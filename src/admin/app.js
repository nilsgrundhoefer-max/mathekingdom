// Administrator-Dashboard (ADR 0024, 0025): Einrichtung, Betrieb und Aufgabenpflege. Schuljahre, Klassen, Lehrkräfte und
// Schüler anlegen und löschen, Übernahme ins neue Schuljahr, Startdateien, Backups, Betriebsprotokoll.
// Lernstände sieht der Administrator im Lehrer-Dashboard.
import stil from '../lehrer/stil.css';
import { h } from '../schueler/dom.js';
import * as S from '../schueler/speicher.js';
import * as K from '../gemeinsam/krypto.js';
import * as SCH from '../gemeinsam/schule.js';
import * as P from '../gemeinsam/protokoll.js';
import * as B from '../gemeinsam/backup.js';
import * as M from '../gemeinsam/meldungen.js';
import * as ST from '../gemeinsam/statistik.js';
import * as L from '../schueler/logik.js';
import { erzeugeCode, FORMAT_NAMEN } from '../lehrer/auswertung.js';
import { gemerkteOrdner, erlaube } from '../gemeinsam/gemerkt.js';
import { versionsHinweis, VERSION_STIL } from '../gemeinsam/version.js';
import { testklassenKarte } from './testklasse.js';

const gemerkt = gemerkteOrdner('mathekingdom-admin');
const LAUFWERKE = {
  persoenlich: ['Dein persönliches Lehrerlaufwerk', 'Hier liegt dein Administrator-Schlüssel. Nur du darfst Zugriff haben.'],
  schueler: ['Schülertauschlaufwerk', 'Wähle den Ordner „Mathekingdom“ oder das Laufwerk; fehlt der Ordner, wird er angelegt.'],
  lehrer: ['Lehrertauschlaufwerk', 'Wähle den Ordner „Mathekingdom“ oder das Laufwerk; fehlt der Ordner, wird er angelegt.'],
};
const z = { wahl: null, persoenlich: null, schueler: null, lehrer: null, admin: null, v: null, tab: 'uebersicht', jahr: null, betrieb: null, betriebLaedt: false, protokoll: { klasse: '', nurProbleme: true }, klasse: null, gabe: null, uebernahme: null, alt: null, fehler: null, hinweis: null };
let wurzel;
const jetzt = () => new Date().toISOString();

// ---------- Dateien ----------
const jahrOrdner = (ablage, jahr = z.jahr) => ablage.unterordner(jahr);
const klassenOrdner = async (ablage, klasse, jahr = z.jahr) => (await jahrOrdner(ablage, jahr)).unterordner(klasse);
async function speichereVerzeichnis() {
  z.v.stand = jetzt();
  const text = await K.unterschreibe(z.v, z.admin.schluessel.privat);
  await z.schueler.schreibe(SCH.VERZEICHNIS, text);
  await z.lehrer.schreibe(SCH.VERZEICHNIS, text);
}
async function ladeKlasse(klasse, jahr = z.jahr) {
  const t = await (await klassenOrdner(z.lehrer, klasse, jahr)).lies(SCH.KLASSE_DATEI);
  return t ? JSON.parse(t) : null;
}
// Klassendaten speichern und die Klassendatei für die Schüler neu unterschreiben (mit dem Administrator-Schlüssel).
async function speichereKlasse(klasse, daten, jahr = z.jahr) {
  await SCH.sorgePins(daten);
  await (await klassenOrdner(z.lehrer, klasse, jahr)).schreibe(SCH.KLASSE_DATEI, JSON.stringify(daten, null, 1));
  const text = await K.unterschreibe(SCH.klassendateiInhalt(klasse, daten, jetzt()), z.admin.schluessel.privat);
  await (await klassenOrdner(z.schueler, klasse, jahr)).schreibe(S.KLASSENDATEI, text);
}
async function alleCodes(jahr = z.jahr) {
  const codes = [];
  for (const k of Object.keys(z.v.klassen[jahr] ?? {})) codes.push(...Object.keys((await ladeKlasse(k, jahr))?.namen ?? {}));
  return codes;
}
const ersteTore = (klasse) => { const p = window.MK_POOLS?.[parseInt(klasse, 10)]; return p ? [p.kapitel[0].id] : []; };
async function legeKlasseAn(klasse, lehrkraefte = [], jahr = z.jahr) {
  (z.v.klassen[jahr] ??= {})[klasse] ??= { lehrkraefte };
  if (!(await ladeKlasse(klasse, jahr))) await speichereKlasse(klasse, SCH.neueKlassendaten(ersteTore(klasse)), jahr);
}

function ladeHerunter(dateiname, inhalt, typ) {
  const url = URL.createObjectURL(new Blob([inhalt], { type: typ }));
  const a = h('a', { href: url, download: dateiname });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function drucke(...inhalt) {
  document.getElementById('mk-druck')?.remove();
  document.body.append(h('div', { id: 'mk-druck' }, inhalt));
  window.print();
}
const schuelerStartdatei = () => SCH.fuelleStartdatei(window.MK_STARTDATEI_SCHUELER, { SCHLUESSEL: z.v.admin, PFAD: z.v.pfade?.schueler || null });
const lehrerStartdatei = (kuerzel) => SCH.fuelleStartdatei(window.MK_STARTDATEI_LEHRER, { SCHLUESSEL: z.v.admin, KUERZEL: kuerzel, PFAD_SCHUELER: z.v.pfade?.schueler || null, PFAD_LEHRER: z.v.pfade?.lehrer || null });

// Jede Aktion meldet Fehler oben und zeichnet neu.
const tue = (fn) => async (...a) => {
  try { z.fehler = null; await fn(...a); } catch (e) { if (e.name !== 'AbortError') z.fehler = e.message; }
  male();
};

// ---------- Start: drei Ordner, nur beim ersten Mal ----------
async function waehle(art) {
  const handle = await window.showDirectoryPicker({ id: `mk-admin-${art}`, mode: 'readwrite' });
  let ablage = S.ordnerAblage(handle);
  if (art === 'persoenlich') {
    if (await ablage.lies(SCH.VERZEICHNIS)) throw new Error('Das ist ein Mathekingdom-Ordner auf einem Tauschlaufwerk. Für den Schlüssel brauchst du einen Ordner, auf den nur du Zugriff hast.');
  } else ablage = await SCH.mathekingdomOrdner(ablage);
  for (const andere of Object.keys(LAUFWERKE)) {
    if (andere !== art && z.wahl[andere] && await z.wahl[andere].isSameEntry(ablage.handle)) throw new Error(`Diesen Ordner hast du schon für das ${LAUFWERKE[andere][0]} gewählt.`);
  }
  z.wahl[art] = ablage.handle;
  await gemerkt.merke(art, ablage.handle);
}
async function weiter() {
  for (const art of Object.keys(LAUFWERKE)) {
    if (!(await erlaube(z.wahl[art]))) throw new Error(`Bitte erlaube den Zugriff auf „${LAUFWERKE[art][0]}“. Klicke dazu noch einmal auf „Weiter“.`);
  }
  const persoenlich = S.ordnerAblage(z.wahl.persoenlich), schueler = S.ordnerAblage(z.wahl.schueler), lehrer = S.ordnerAblage(z.wahl.lehrer);
  const vorhanden = await schueler.lies(SCH.VERZEICHNIS);
  let adminText = await persoenlich.lies(SCH.ADMIN_DATEI);
  if (!adminText) {
    if (vorhanden) throw new Error(`Auf dem Schülertauschlaufwerk ist Mathekingdom schon eingerichtet, aber in deinem Ordner „${persoenlich.name}“ liegt kein Administrator-Schlüssel. Lege die Datei ${SCH.ADMIN_DATEI} des ersten Administrators dort hinein.`);
    if (!confirm('Hier gibt es noch keinen Administrator-Schlüssel. Neu anlegen und Mathekingdom für die Schule einrichten?')) return;
    adminText = JSON.stringify({ art: 'mathekingdom-admin', angelegt: jetzt(), schluessel: await K.erzeugeSchluessel() }, null, 1);
    await persoenlich.schreibe(SCH.ADMIN_DATEI, adminText);
  }
  const admin = JSON.parse(adminText);
  let v;
  if (vorhanden) {
    v = await K.pruefeUnterschrift(vorhanden, admin.schluessel.oeffentlich);
    if (!v) throw new Error('Das Schulverzeichnis passt nicht zu deinem Administrator-Schlüssel. Hast du die richtige Schlüsseldatei?');
  } else v = SCH.leeresVerzeichnis(admin.schluessel.oeffentlich, SCH.schuljahrAm(new Date()));
  Object.assign(z, { persoenlich, schueler, lehrer, admin, v, jahr: v.schuljahr });
  if (!vorhanden) { await jahrOrdner(schueler); await jahrOrdner(lehrer); await speichereVerzeichnis(); z.hinweis = `Mathekingdom ist eingerichtet, Schuljahr ${v.schuljahr}. Lege jetzt die Lehrkräfte an, dann die Klassen.`; z.tab = 'klassen'; }
  // Kopie für Tage ohne Internet, damit Schüler-Startdateien auch dann starten.
  if (window.MK_SCHUELER_JS) await schueler.schreibe(`${S.SYSTEMORDNER}/${S.KOPIE_SCHUELER}`, window.MK_SCHUELER_JS).catch(() => {});
}

function start() {
  if (!z.wahl) {
    z.wahl = { persoenlich: null, schueler: null, lehrer: null };
    Promise.all(Object.keys(LAUFWERKE).map((a) => gemerkt.hole(a))).then(([p, s, l]) => { z.wahl.persoenlich ??= p; z.wahl.schueler ??= s; z.wahl.lehrer ??= l; male(); });
  }
  const alle = Object.keys(LAUFWERKE).every((a) => z.wahl[a]);
  return h('section', { class: 'karte schmal' },
    h('h1', {}, 'Mathekingdom einrichten'),
    !S.kannOrdner() ? h('p', { class: 'fehlertext' }, 'Dieser Browser kann nicht in Ordnern speichern. Öffne die Datei bitte mit Edge oder Chrome.')
      : h('div', {},
        h('p', { class: 'klein' }, 'Nur beim ersten Mal: drei Ordner wählen. Danach merkt sich der Browser sie.'),
        h('ul', { class: 'liste' }, Object.entries(LAUFWERKE).map(([art, [titel, text]]) => h('li', {},
          h('b', {}, titel), ' ', z.wahl[art] ? h('span', {}, `Ordner „${z.wahl[art].name}“ gemerkt `) : h('span', { class: 'klein' }, `${text} `),
          h('button', { class: z.wahl[art] ? 'schlicht' : 'haupt', id: `wahl-${art}`, onclick: tue(() => waehle(art)) }, z.wahl[art] ? 'Anderen Ordner wählen' : 'Ordner wählen')))),
        h('button', { class: 'haupt', id: 'weiter', disabled: !alle, onclick: tue(weiter) }, 'Weiter')));
}

// ---------- Schuljahre und Klassen ----------
function schuljahrKarte() {
  const v = z.v;
  const neuFeld = h('input', { id: 'neues-schuljahr', type: 'text', size: 8, value: SCH.naechstesSchuljahr([...v.schuljahre].sort().at(-1)) });
  return h('section', { class: 'karte' }, h('h2', {}, 'Schuljahr'),
    h('p', {}, 'Aktuelles Schuljahr: ', h('b', { id: 'aktuelles-schuljahr' }, v.schuljahr), '. Darin arbeiten alle Schüler und Lehrkräfte.'),
    h('div', { class: 'reihe' },
      h('label', {}, 'Ansehen und bearbeiten: ', h('select', { id: 'schuljahr-wahl', onchange: (ev) => { z.jahr = ev.target.value; z.klasse = null; z.uebernahme = null; male(); } },
        [...v.schuljahre].sort().reverse().map((j) => h('option', { value: j, selected: j === z.jahr }, j)))),
      z.jahr !== v.schuljahr && h('button', { class: 'haupt', id: 'schuljahr-wechseln', onclick: tue(async () => {
        if (!confirm(`Ab sofort arbeiten alle Schüler und Lehrkräfte im Schuljahr ${z.jahr}. Wechseln?`)) return;
        v.schuljahr = z.jahr; await speichereVerzeichnis(); z.hinweis = `Das aktuelle Schuljahr ist jetzt ${z.jahr}.`;
      }) }, `${z.jahr} zum aktuellen Schuljahr machen`)),
    h('div', { class: 'reihe' }, h('label', {}, 'Neues Schuljahr ', neuFeld), h('button', { class: 'schlicht', id: 'schuljahr-anlegen', onclick: tue(async () => {
      const j = neuFeld.value.trim();
      if (!SCH.istSchuljahr(j)) throw new Error('Ein Schuljahr sieht so aus: 2027-28.');
      if (!v.schuljahre.includes(j)) v.schuljahre.push(j);
      v.klassen[j] ??= {};
      await jahrOrdner(z.schueler, j); await jahrOrdner(z.lehrer, j);
      await speichereVerzeichnis();
      Object.assign(z, { jahr: j, klasse: null, hinweis: `Schuljahr ${j} angelegt. Es wird erst aktuell, wenn du es dazu machst.` });
    }) }, 'Anlegen')));
}

function klassenKarte() {
  const v = z.v, klassen = Object.keys(v.klassen[z.jahr] ?? {}).sort(SCH.vergleicheKlassen), kuerzel = Object.keys(v.lehrkraefte).sort();
  const eingabe = h('input', { id: 'neue-klasse', type: 'text', placeholder: 'z. B. 5a', size: 6, maxLength: 3 });
  const setzeLehrkraft = tue(async (klasse, k, an) => {
    const liste = new Set(v.klassen[z.jahr][klasse].lehrkraefte ?? []);
    if (an) liste.add(k); else liste.delete(k);
    v.klassen[z.jahr][klasse].lehrkraefte = [...liste].sort();
    // Erst neu unterschreiben, dann das Verzeichnis ändern: Sonst gilt die Klassendatei kurz nicht mehr.
    if (!an) await unterschreibeNeu([klasse], z.jahr);
    await speichereVerzeichnis();
  });
  return h('section', { class: 'karte' }, h('h2', {}, `Klassen im Schuljahr ${z.jahr}`),
    klassen.length ? h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'klassen' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Klasse'), h('th', {}, 'Lehrkräfte'), h('th', {}, ''))),
      h('tbody', {}, klassen.map((k) => h('tr', {}, h('td', {}, h('b', {}, k), v.klassen[z.jahr][k].test && h('span', { class: 'klein' }, ' Testklasse')),
        h('td', {}, kuerzel.length ? kuerzel.map((kz) => h('label', { class: 'schalter', style: 'margin-right:10px' },
          h('input', { type: 'checkbox', 'data-lehrkraft': `${k}|${kz}`, checked: (v.klassen[z.jahr][k].lehrkraefte ?? []).includes(kz), onchange: (ev) => setzeLehrkraft(k, kz, ev.target.checked) }), ` ${kz}`))
          : h('span', { class: 'klein' }, 'Lege zuerst Lehrkräfte an.')),
        h('td', {}, h('div', { class: 'reihe' }, h('button', { class: 'schlicht', 'data-namen': k, onclick: () => { z.klasse = k; z.gabe = null; male(); } }, 'Namen und Codes'),
          h('button', { class: 'schlicht', 'data-aufloesen': k, onclick: tue(async () => {
            if (!confirm(`Klasse ${k} auflösen? Sie verschwindet aus dem Schulverzeichnis, die Schüler können sich nicht mehr anmelden. Ihre Ordner bleiben liegen; du kannst sie wieder aufnehmen oder danach endgültig löschen.`)) return;
            delete v.klassen[z.jahr][k];
            if (z.klasse === k) z.klasse = null;
            await speichereVerzeichnis();
            z.hinweis = `Klasse ${k} aufgelöst. Sie steht jetzt unten unter „Aufgelöste Klassen“.`;
          }) }, 'Auflösen')))))))) : h('p', {}, 'Noch keine Klassen.'),
    h('div', { class: 'reihe' }, eingabe, h('button', { class: 'haupt', id: 'klasse-anlegen', onclick: tue(async () => {
      const k = eingabe.value.trim().toLowerCase();
      if (!SCH.istKlasse(k)) throw new Error('Ein Klassenname sieht so aus: 5a.');
      if (v.klassen[z.jahr]?.[k]) throw new Error(`Die Klasse ${k} gibt es schon.`);
      await legeKlasseAn(k);
      await speichereVerzeichnis();
      z.hinweis = `Klasse ${k} angelegt. Ordne ihr eine Lehrkraft zu und trage die Namen ein.`;
    }) }, 'Klasse anlegen')));
}

function namenKarte() {
  const klasse = z.klasse;
  const platz = h('section', { class: 'karte', id: 'namen-karte' }, h('p', {}, 'Lade …'));
  ladeKlasse(klasse).then((d) => {
    const daten = d ?? SCH.neueKlassendaten(ersteTore(klasse));
    const codes = Object.keys(daten.namen).sort((a, b) => daten.namen[a].localeCompare(daten.namen[b], 'de'));
    const liste = h('textarea', { id: 'namen', rows: 6, placeholder: 'Ein Name pro Zeile, zum Beispiel:\nLena Müller\nTim Schmidt' });
    platz.replaceChildren(h('h2', {}, `Klasse ${klasse}: Namen und Codes`),
      h('p', { class: 'klein' }, 'Die Namen und PINs liegen auf dem Lehrertauschlaufwerk. Die Lehrkräfte der Klasse sehen und ändern dieselbe Liste.'),
      codes.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Schülercode', 'PIN', '', '', '', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, daten.namen[c]), h('td', { class: 'code' }, c), h('td', { class: 'code pin' }, daten.pins?.[c]?.pin ?? '…'),
          h('td', {}, h('button', { class: 'schlicht', 'data-neue-pin': c, onclick: tue(async () => {
            if (!confirm(`Neue PIN für ${daten.namen[c]} vergeben? Die alte gilt dann nicht mehr.`)) return;
            delete daten.pins[c]; await speichereKlasse(klasse, daten);
          }) }, 'Neue PIN')),
          h('td', {}, h('button', { class: 'schlicht', 'data-entfernen': c, onclick: tue(async () => {
            if (!confirm(`${daten.namen[c]} aus der Namensliste entfernen? Der Speicherstand bleibt liegen.`)) return;
            delete daten.namen[c]; delete daten.einst.zielniveaus?.[c]; await speichereKlasse(klasse, daten);
          }) }, 'Entfernen')),
          h('td', {}, h('button', { class: 'schlicht gefahr', 'data-loeschen': c, onclick: tue(() => loescheSchueler(klasse, daten, c)) }, 'Löschen')),
          h('td', {}, h('button', { class: 'schlicht', 'data-muenzen': c, onclick: () => { z.gabe = { code: c, muenzen: 100 }; male(); } }, 'Münzen schicken'))))))),
      z.gabe && daten.namen[z.gabe.code] && gabeKarte(klasse, daten),
      h('p', { class: 'klein' }, '„Entfernen“ nimmt einen Schüler nur aus der Namensliste, sein Speicherstand bleibt. „Löschen“ löscht auch den Speicherstand und seine Backups endgültig, etwa bei einem Schulwechsel.'),
      h('h3', {}, 'Schüler hinzufügen'), liste,
      h('div', { class: 'reihe' },
        h('button', { class: 'haupt', id: 'codes', onclick: tue(async () => {
          const vergeben = await alleCodes();
          for (const n of liste.value.split('\n').map((x) => x.trim()).filter(Boolean)) { const c = erzeugeCode(klasse, vergeben); vergeben.push(c); daten.namen[c] = n; }
          await speichereKlasse(klasse, daten);
        }) }, 'Codes erzeugen'),
        codes.length > 0 && h('button', { class: 'schlicht', id: 'kaertchen', onclick: () => drucke(h('div', { class: 'kaertchen' }, codes.map((c) => h('div', {}, h('small', {}, 'Mathekingdom · Dein Schülercode'), h('b', {}, c), h('small', {}, 'Deine PIN'), h('b', { class: 'pin' }, daten.pins?.[c]?.pin ?? ''), h('span', {}, daten.namen[c]))))) }, 'Code-Kärtchen drucken'),
        h('button', { class: 'schlicht', onclick: () => { z.klasse = null; male(); } }, 'Schließen')));
  }).catch((e) => { platz.replaceChildren(h('p', { class: 'fehlertext' }, e.message)); });
  return platz;
}

// ---------- Münzgabe (ADR 0027) ----------
// Der Administrator schickt einem Schüler Münzen über die Klassendatei. Feste Stufen, ein optionaler Satz.
// Zurückziehen geht nur, solange der Schüler die Gabe nicht geöffnet hat; abziehen geht nie.
async function ladeStand(klasse, code, jahr = z.jahr) {
  const ordner = await (await z.schueler.ordner(jahr))?.ordner(klasse);
  const t = ordner && await ordner.lies(`${code}.json`).catch(() => null);
  try { return t ? JSON.parse(t) : null; } catch { return null; }
}
const neueGabeId = () => `${jetzt()}-${Math.random().toString(36).slice(2, 6)}`;
async function schickeGabe(klasse, code, muenzen, satz) {
  if (!L.MUENZGABEN.includes(muenzen)) throw new Error('Diese Menge gibt es nicht.');
  const daten = await ladeKlasse(klasse);
  if (!daten?.namen[code]) throw new Error('Diesen Schüler gibt es in der Klasse nicht mehr.');
  ((daten.einst.muenzgaben ??= {})[code] ??= []).push({ id: neueGabeId(), t: jetzt(), muenzen, ...(satz ? { satz: satz.slice(0, 200) } : {}) });
  await speichereKlasse(klasse, daten);
  return daten;
}
async function zieheGabeZurueck(klasse, code, id) {
  const stand = await ladeStand(klasse, code);
  if (stand && L.geoeffneteMuenzgabe(stand, id)) throw new Error('Diese Gabe ist schon geöffnet. Die Münzen gehören jetzt dem Schüler.');
  const daten = await ladeKlasse(klasse);
  const liste = daten?.einst.muenzgaben?.[code];
  if (!liste) return;
  daten.einst.muenzgaben[code] = liste.filter((g) => g.id !== id);
  if (!daten.einst.muenzgaben[code].length) delete daten.einst.muenzgaben[code];
  await speichereKlasse(klasse, daten);
}
const datumZeit = (t) => new Date(t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
function gabeKarte(klasse, daten) {
  const g = z.gabe, name = daten.namen[g.code];
  const satz = h('input', { type: 'text', id: 'gabe-satz', maxlength: 200, style: 'width: 100%; max-width: 560px', placeholder: 'Ein kurzer Satz, zum Beispiel: Für deine Hilfe beim Aufräumen.', value: g.satz ?? '', oninput: (e) => { g.satz = e.target.value; } });
  const stufen = h('div', { class: 'reihe', role: 'radiogroup', 'aria-label': 'Münzen' }, L.MUENZGABEN.map((m) => h('label', { class: 'wahl' },
    h('input', { type: 'radio', name: 'gabe-muenzen', value: m, checked: g.muenzen === m, onchange: () => { g.muenzen = m; } }), ` ${m.toLocaleString('de-DE')}${m === 5000 ? ' (zum Testen)' : ''}`)));
  const liste = h('div', { id: 'gaben-liste' }, h('p', { class: 'klein' }, 'Lade …'));
  const gaben = daten.einst.muenzgaben?.[g.code] ?? [];
  ladeStand(klasse, g.code).then((stand) => {
    liste.replaceChildren(gaben.length ? h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Geschickt', 'Münzen', 'Satz', 'Stand', ''].map((t) => h('th', {}, t)))),
      h('tbody', {}, [...gaben].reverse().map((x) => {
        const offen = stand ? L.geoeffneteMuenzgabe(stand, x.id) : null;
        return h('tr', {}, h('td', {}, datumZeit(x.t)), h('td', {}, `+${x.muenzen}`), h('td', {}, x.satz ?? ''),
          h('td', {}, offen ? `geöffnet am ${datumZeit(offen.t)}` : 'noch nicht geöffnet'),
          h('td', {}, offen ? '' : h('button', { class: 'schlicht', 'data-zurueck': x.id, onclick: tue(async () => {
            if (!confirm(`Die Gabe über ${x.muenzen} Münzen an ${name} zurückziehen?`)) return;
            await zieheGabeZurueck(klasse, g.code, x.id);
            z.hinweis = 'Gabe zurückgezogen.';
          }) }, 'Zurückziehen')));
      }))) : h('p', { class: 'klein' }, 'Noch keine Münzgabe an diesen Schüler.'));
  });
  return h('div', { class: 'karte innen', id: 'gabe-karte' },
    h('h3', {}, `Münzen schicken an ${name} (${g.code})`),
    h('p', { class: 'klein' }, 'Der Schüler bekommt einen Brief „Eine Gabe des Königs“, ohne Absender, und die Münzen beim Öffnen. Zurückziehen geht nur, solange er ihn nicht geöffnet hat. Die Lehrkraft der Klasse sieht die Gabe im Schülerprofil.'),
    stufen, satz,
    h('div', { class: 'reihe' },
      h('button', { class: 'haupt', id: 'gabe-schicken', onclick: tue(async () => {
        await schickeGabe(klasse, g.code, g.muenzen, (g.satz ?? '').trim());
        z.hinweis = `${g.muenzen.toLocaleString('de-DE')} Münzen an ${name} geschickt.`;
        g.satz = '';
      }) }, 'Schicken'),
      h('button', { class: 'schlicht', onclick: () => { z.gabe = null; male(); } }, 'Schließen')),
    h('h4', {}, 'Bisherige Gaben'), liste);
}

// ---------- Übernahme ins neue Schuljahr ----------
// Aus einer Klasse eines früheren Schuljahrs: jeder Schüler in eine Klasse des angezeigten Schuljahrs.
function uebernahmeKarte() {
  const v = z.v, echte = (j) => Object.keys(v.klassen[j] ?? {}).filter((k) => !v.klassen[j][k].test); // Testklassen nicht (ADR 0028)
  const frueher = v.schuljahre.filter((j) => j < z.jahr && echte(j).length).sort().reverse();
  if (!frueher.length) return null;
  const u = z.uebernahme;
  if (!u) {
    const jahrWahl = h('select', { id: 'uebernahme-jahr' }, frueher.map((j) => h('option', { value: j }, j)));
    const klassenWahl = () => h('select', { id: 'uebernahme-klasse' }, echte(jahrWahl.value).sort(SCH.vergleicheKlassen).map((k) => h('option', { value: k }, k)));
    let kw = klassenWahl();
    jahrWahl.onchange = () => { const neu = klassenWahl(); kw.replaceWith(neu); kw = neu; };
    return h('section', { class: 'karte' }, h('h2', {}, 'Klassen aus einem früheren Schuljahr übernehmen'),
      h('p', { class: 'klein' }, `Die Schüler wandern mit Münzen, Siegeln, Rang, Wappen und Versuchsprotokoll in eine Klasse des Schuljahrs ${z.jahr}. Aus 5A-K4M2 wird zum Beispiel 6A-K4M2, die PIN bleibt. Die alten Ordner bleiben liegen.`),
      h('div', { class: 'reihe' }, h('label', {}, 'Aus ', jahrWahl), h('label', {}, 'Klasse ', kw),
        h('button', { class: 'haupt', id: 'uebernahme-start', onclick: tue(async () => {
          const daten = await ladeKlasse(kw.value, jahrWahl.value);
          if (!daten || !Object.keys(daten.namen).length) throw new Error('In dieser Klasse stehen keine Schüler.');
          const ziel = SCH.naechsteKlasse(kw.value);
          z.uebernahme = { jahr: jahrWahl.value, klasse: kw.value, daten, ziele: Object.fromEntries(Object.keys(daten.namen).map((c) => [c, ziel])) };
        }) }, 'Schüler zuordnen')));
  }
  const ziele = [...new Set([...Object.keys(v.klassen[z.jahr] ?? {}), ...Object.values(u.ziele).filter(Boolean), ...(u.extra ?? [])])].sort(SCH.vergleicheKlassen);
  const neuFeld = h('input', { id: 'uebernahme-neu', type: 'text', size: 5, placeholder: 'z. B. 6b' });
  const codes = Object.keys(u.daten.namen).sort((a, b) => u.daten.namen[a].localeCompare(u.daten.namen[b], 'de'));
  return h('section', { class: 'karte', id: 'uebernahme' }, h('h2', {}, `Klasse ${u.klasse} (${u.jahr}) übernehmen nach ${z.jahr}`),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Name', 'Bisher', 'Neue Klasse'].map((t) => h('th', {}, t)))),
      h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, u.daten.namen[c]), h('td', { class: 'code' }, c),
        h('td', {}, h('select', { 'data-ziel': c, onchange: (ev) => { u.ziele[c] = ev.target.value; } },
          h('option', { value: '', selected: !u.ziele[c] }, 'nicht übernehmen'), ziele.map((k) => h('option', { value: k, selected: u.ziele[c] === k }, k))))))))),
    h('div', { class: 'reihe' }, h('label', {}, 'Weitere Zielklasse ', neuFeld), h('button', { class: 'schlicht', onclick: () => {
      const k = neuFeld.value.trim().toLowerCase();
      if (SCH.istKlasse(k) && !ziele.includes(k)) { u.extra = [...(u.extra ?? []), k]; male(); }
    } }, 'Hinzufügen')),
    h('div', { class: 'reihe' },
      h('button', { class: 'haupt', id: 'uebernehmen', onclick: tue(fuehreUebernahmeAus) }, 'Übernehmen'),
      h('button', { class: 'schlicht', onclick: () => { z.uebernahme = null; male(); } }, 'Abbrechen')));
}
async function fuehreUebernahmeAus() {
  const u = z.uebernahme, v = z.v;
  const vergeben = await alleCodes();
  const lehrkraefte = v.klassen[u.jahr][u.klasse].lehrkraefte ?? [];
  const quelle = await klassenOrdner(z.schueler, u.klasse, u.jahr);
  const zielDaten = {}, neueCodes = [];
  let anzahl = 0;
  for (const [code, ziel] of Object.entries(u.ziele)) {
    if (!ziel) continue;
    if (!zielDaten[ziel]) { await legeKlasseAn(ziel, lehrkraefte); zielDaten[ziel] = await ladeKlasse(ziel); }
    const neu = SCH.codeFuerUebernahme(code, ziel, vergeben, erzeugeCode);
    vergeben.push(neu);
    if (SCH.codeEnde(neu) !== SCH.codeEnde(code)) neueCodes.push(`${u.daten.namen[code]}: ${neu}`);
    const d = zielDaten[ziel];
    d.namen[neu] = u.daten.namen[code];
    if (u.daten.pins?.[code]) (d.pins ??= {})[neu] = u.daten.pins[code];
    const alt = await quelle.lies(`${code}.json`);
    const zielOrdner = await klassenOrdner(z.schueler, ziel);
    if (alt && !(await zielOrdner.lies(`${neu}.json`))) await zielOrdner.schreibe(`${neu}.json`, JSON.stringify(SCH.uebernimmStand(JSON.parse(alt), neu, ziel, jetzt())));
    anzahl++;
  }
  for (const [k, d] of Object.entries(zielDaten)) await speichereKlasse(k, d);
  await speichereVerzeichnis();
  z.uebernahme = null;
  z.hinweis = `${anzahl} Schüler übernommen.${neueCodes.length ? ` Einen neuen Code bekamen, weil der alte schon vergeben war: ${neueCodes.join(', ')}.` : ''}`;
}

// ---------- Lehrkräfte ----------
function lehrkraefte() {
  const v = z.v, kuerzel = Object.keys(v.lehrkraefte).sort();
  const eingabe = h('input', { id: 'neues-kuerzel', type: 'text', size: 6, maxLength: 5, placeholder: 'z. B. NG' });
  return h('section', { class: 'karte' }, h('h2', {}, 'Lehrkräfte'),
    h('p', { class: 'klein' }, `Jede Lehrkraft bekommt einen eigenen Schlüssel in ihrem Ordner auf dem Lehrertauschlaufwerk und eine eigene Startdatei. Die Startdatei liegt auch in diesem Ordner (Mathekingdom/<Kürzel>/Mathekingdom-Lehrer.html). Mit „Einblick in alle Klassen“ öffnet eine Lehrkraft im Lehrer-Dashboard jede Klasse der Schule. Administrator wird man nur mit einer Kopie der Schlüsseldatei.`),
    kuerzel.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'lehrkraefte' },
      h('thead', {}, h('tr', {}, ['Kürzel', 'Klassen im Schuljahr ' + v.schuljahr, 'Einblick in alle Klassen', '', ''].map((t) => h('th', {}, t)))),
      h('tbody', {}, kuerzel.map((k) => h('tr', {}, h('td', {}, h('b', {}, k)),
        h('td', {}, SCH.klassenDerLehrkraft({ ...v, lehrkraefte: { [k]: { ...v.lehrkraefte[k], admin: false } } }, v.schuljahr, k).join(', ') || '–'),
        h('td', {}, h('input', { type: 'checkbox', 'data-admin': k, checked: Boolean(v.lehrkraefte[k].admin), onchange: tue(async (ev) => {
          if (!ev.target.checked) await unterschreibeNeu(Object.keys(v.klassen[v.schuljahr] ?? {}), v.schuljahr);
          v.lehrkraefte[k].admin = ev.target.checked; await speichereVerzeichnis();
        }) })),
        h('td', {}, h('button', { class: 'schlicht', 'data-startdatei': k, onclick: () => ladeHerunter(`Mathekingdom-Lehrer-${k}.html`, lehrerStartdatei(k), 'text/html') }, 'Startdatei herunterladen')),
        h('td', {}, h('button', { class: 'schlicht gefahr', 'data-lehrkraft-loeschen': k, onclick: tue(() => loescheLehrkraft(k)) }, 'Löschen'))))))),
    h('div', { class: 'reihe' }, eingabe, h('button', { class: 'haupt', id: 'lehrkraft-anlegen', onclick: tue(async () => {
      const k = eingabe.value.trim().toUpperCase();
      if (!SCH.istKuerzel(k)) throw new Error('Ein Kürzel besteht aus 2 bis 5 Buchstaben, zum Beispiel NG.');
      if (v.lehrkraefte[k]) throw new Error(`Das Kürzel ${k} gibt es schon.`);
      const ordner = await z.lehrer.unterordner(k);
      const vorhanden = await ordner.lies(SCH.LEHRER_DATEI);
      let oeffentlich;
      if (vorhanden) oeffentlich = JSON.parse(vorhanden).schluessel.oeffentlich;
      else {
        const schluessel = await K.erzeugeSchluessel();
        await ordner.schreibe(SCH.LEHRER_DATEI, JSON.stringify({ kuerzel: k, schluessel, protokoll: [] }, null, 1));
        oeffentlich = schluessel.oeffentlich;
      }
      v.lehrkraefte[k] = { oeffentlich, admin: false };
      await speichereVerzeichnis();
      await ordner.schreibe('Mathekingdom-Lehrer.html', lehrerStartdatei(k));
      z.hinweis = `Lehrkraft ${k} angelegt. Ihre Startdatei liegt im Ordner ${k} auf dem Lehrertauschlaufwerk.`;
    }) }, 'Lehrkraft anlegen')));
}

// ---------- Startdateien und Pfade ----------
function startdateien() {
  const v = z.v;
  const sp = h('input', { id: 'pfad-schueler', type: 'text', size: 28, value: v.pfade?.schueler ?? '', placeholder: 'z. B. S:\\Mathekingdom' });
  const lp = h('input', { id: 'pfad-lehrer', type: 'text', size: 28, value: v.pfade?.lehrer ?? '', placeholder: 'z. B. L:\\Mathekingdom' });
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Pfade für die Hinweise'),
      h('p', { class: 'klein' }, 'Die Startdateien zeigen beim ersten Öffnen an, welchen Ordner man wählen soll. Den Zugriff selbst kann eine Datei nicht mitbringen; einmal wählt jeder den Ordner selbst. Nach einer Änderung hier müssen die Startdateien neu verteilt werden.'),
      h('div', { class: 'reihe' }, h('label', {}, 'Schülertauschlaufwerk ', sp)),
      h('div', { class: 'reihe' }, h('label', {}, 'Lehrertauschlaufwerk ', lp)),
      h('button', { class: 'haupt', id: 'pfade-speichern', onclick: tue(async () => {
        v.pfade = { schueler: sp.value.trim(), lehrer: lp.value.trim() };
        await speichereVerzeichnis();
        for (const k of Object.keys(v.lehrkraefte)) await (await z.lehrer.unterordner(k)).schreibe('Mathekingdom-Lehrer.html', lehrerStartdatei(k));
        z.hinweis = 'Pfade gespeichert. Die Lehrer-Startdateien in den Kürzel-Ordnern sind erneuert.';
      }) }, 'Speichern')),
    h('section', { class: 'karte' }, h('h2', {}, 'Startdatei für die Schüler'),
      h('p', {}, 'Eine Datei für alle Schüler der Schule. Sie kommt einmal auf jedes Schülerlaufwerk und gilt über alle Schuljahre. Direkt vom Tauschlaufwerk starten soll niemand, weil dort jeder die Datei austauschen könnte.'),
      h('div', { class: 'reihe' },
        h('button', { class: 'haupt', id: 'schueler-startdatei', onclick: () => ladeHerunter('Mathekingdom.html', schuelerStartdatei(), 'text/html') }, 'Herunterladen'),
        h('button', { class: 'schlicht', id: 'schueler-startdatei-ablegen', onclick: tue(async () => {
          await z.schueler.schreibe('Mathekingdom.html', schuelerStartdatei());
          z.hinweis = 'Die Startdatei liegt jetzt im Mathekingdom-Ordner auf dem Schülertauschlaufwerk. Lass sie die Schüler einmal auf ihr eigenes Laufwerk kopieren.';
        }) }, 'Zum Kopieren auf das Schülertauschlaufwerk legen'))),
    h('section', { class: 'karte' }, h('h2', {}, 'Administrator-Schlüssel sichern'),
      h('p', { class: 'klein' }, `Ohne diesen Schlüssel lässt sich das Schulverzeichnis nicht mehr ändern, und alle Startdateien müssten neu verteilt werden. Bewahre eine Kopie sicher auf. Ein weiterer Administrator legt die Datei ${SCH.ADMIN_DATEI} auf sein eigenes Lehrerlaufwerk.`),
      h('button', { class: 'schlicht', id: 'admin-sichern', onclick: () => ladeHerunter(SCH.ADMIN_DATEI, JSON.stringify(z.admin, null, 1), 'application/json') }, 'Schlüsseldatei herunterladen')));
}

// ---------- Alte Lehrerdaten übernehmen (Umzug aus Version 0.20) ----------
function altKarte() {
  const v = z.v, kuerzel = Object.keys(v.lehrkraefte).sort();
  const a = z.alt;
  return h('section', { class: 'karte' }, h('h2', {}, 'Alte Lehrerdaten übernehmen'),
    h('p', { class: 'klein' }, `Für Klassen aus der Zeit vor dem Administrator-Dashboard: Namensliste, PINs, Einstellungen, Notizen und Backups ziehen aus der alten lehrerdaten.json in das Schuljahr ${v.schuljahr} um. Verschiebe vorher den Klassenordner (zum Beispiel 5a) auf dem Schülertauschlaufwerk in „Mathekingdom/${v.schuljahr}“. Danach brauchen die Schüler die neue Startdatei.`),
    h('button', { class: a ? 'schlicht' : 'haupt', id: 'alt-waehlen', onclick: tue(async () => {
      const ordner = S.ordnerAblage(await window.showDirectoryPicker({ id: 'mk-admin-alt', mode: 'read' }));
      const text = await ordner.lies('lehrerdaten.json');
      if (!text) throw new Error('In diesem Ordner liegt keine lehrerdaten.json.');
      z.alt = { ordner, daten: JSON.parse(text) };
    }) }, 'Ordner mit der alten lehrerdaten.json wählen'),
    a && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'alte-klassen' },
      h('thead', {}, h('tr', {}, ['Klasse', 'Schüler', 'Lehrkraft', ''].map((t) => h('th', {}, t)))),
      h('tbody', {}, Object.keys(a.daten.klassen ?? {}).sort(SCH.vergleicheKlassen).map((k) => {
        const wahl = h('select', { 'data-alt-lehrkraft': k }, kuerzel.map((kz) => h('option', { value: kz }, kz)));
        return h('tr', {}, h('td', {}, h('b', {}, k)), h('td', {}, String(Object.keys(a.daten.klassen[k].namen ?? {}).length)), h('td', {}, kuerzel.length ? wahl : 'Lege zuerst eine Lehrkraft an.'),
          h('td', {}, kuerzel.length > 0 && h('button', { class: 'haupt', 'data-alt-uebernehmen': k, onclick: tue(() => uebernimmAlt(k, wahl.value)) }, 'Übernehmen')));
      })))));
}
async function uebernimmAlt(klasse, kuerzel) {
  const jahr = z.v.schuljahr, alt = z.alt.daten.klassen[klasse];
  if (await ladeKlasse(klasse, jahr) && !confirm(`Für ${klasse} gibt es im Schuljahr ${jahr} schon Klassendaten. Überschreiben?`)) return;
  (z.v.klassen[jahr] ??= {})[klasse] = { lehrkraefte: [...new Set([...(z.v.klassen[jahr][klasse]?.lehrkraefte ?? []), kuerzel])] };
  await speichereKlasse(klasse, structuredClone(alt), jahr);
  // Backups ziehen mit: backup/<Klasse>/<Zeitpunkt>/ → <Schuljahr>/<Klasse>/backup/<Zeitpunkt>/
  let backups = 0;
  const quelle = await (await z.alt.ordner.ordner('backup'))?.ordner(klasse);
  if (quelle) {
    const ziel = await (await klassenOrdner(z.lehrer, klasse, jahr)).unterordner('backup');
    for (const stempel of await quelle.ordnernamen()) {
      const von = await quelle.ordner(stempel), nach = await ziel.unterordner(stempel);
      for (const datei of await von.liste()) await nach.schreibe(datei, await von.lies(datei));
      backups++;
    }
  }
  await speichereVerzeichnis();
  const staende = (await (await klassenOrdner(z.schueler, klasse, jahr)).liste()).filter((n) => /^\d{1,2}[A-Z]-[A-Z0-9]{4}\.json$/.test(n)).length;
  z.hinweis = `Klasse ${klasse} übernommen: ${Object.keys(alt.namen ?? {}).length} Schüler, ${backups} Backups. Im Klassenordner auf dem Schülertauschlaufwerk liegen ${staende} Speicherstände.${staende ? '' : ' Hast du den alten Klassenordner schon verschoben?'}`;
}

// ---------- Löschen (ADR 0025) ----------
// Klassendateien mit dem Administrator-Schlüssel neu unterschreiben, bevor eine Lehrkraft ihr Recht verliert.
async function unterschreibeNeu(klassen, jahr) {
  for (const k of klassen) { const d = await ladeKlasse(k, jahr); if (d) await speichereKlasse(k, d, jahr); }
}
// Endgültig: Speicherstand und alle Backups dieses Schülers. Bestätigt wird durch Eintippen des Codes.
async function loescheSchueler(klasse, daten, code) {
  const eingabe = prompt(`${daten.namen[code]} endgültig löschen? Speicherstand und alle Backups dieses Schülers sind danach weg. Zum Bestätigen den Code ${code} eintippen:`);
  if (eingabe == null) return;
  if (eingabe.trim().toUpperCase() !== code) throw new Error('Der Code stimmt nicht. Es wurde nichts gelöscht.');
  const ordner = await (await z.schueler.ordner(z.jahr))?.ordner(klasse);
  if (ordner && (await ordner.liste()).includes(`${code}.json`)) await ordner.entferne(`${code}.json`);
  const backup = await (await (await z.lehrer.ordner(z.jahr))?.ordner(klasse))?.ordner('backup');
  if (backup) await B.loescheAusBackups(backup, code);
  const name = daten.namen[code];
  delete daten.namen[code]; delete daten.pins?.[code]; delete daten.einst.zielniveaus?.[code]; delete daten.notizen?.[code];
  await speichereKlasse(klasse, daten);
  z.hinweis = `${name} (${code}) ist gelöscht, mit Speicherstand und Backups.`;
}
async function loescheLehrkraft(k) {
  const v = z.v, jahr = v.schuljahr, klassen = v.klassen[jahr] ?? {};
  const eigene = Object.keys(klassen).filter((kl) => (klassen[kl].lehrkraefte ?? []).includes(k));
  const allein = eigene.filter((kl) => klassen[kl].lehrkraefte.length === 1);
  const warnung = allein.length ? ` Achtung: Sie ist die einzige Lehrkraft ${allein.length > 1 ? 'der Klassen' : 'der Klasse'} ${allein.join(', ')}. Ordne dort danach eine andere Lehrkraft zu.` : '';
  const eingabe = prompt(`Lehrkraft ${k} löschen? Ihr Schlüssel, ihr Protokoll und ihre Startdatei werden gelöscht; Namenslisten, Backups und Speicherstände ihrer Klassen bleiben.${warnung} Zum Bestätigen das Kürzel eintippen:`);
  if (eingabe == null) return;
  if (eingabe.trim().toUpperCase() !== k) throw new Error('Das Kürzel stimmt nicht. Es wurde nichts gelöscht.');
  await unterschreibeNeu(v.lehrkraefte[k].admin ? Object.keys(klassen) : eigene, jahr);
  delete v.lehrkraefte[k];
  for (const j of Object.keys(v.klassen)) for (const kl of Object.values(v.klassen[j])) if (kl.lehrkraefte?.includes(k)) kl.lehrkraefte = kl.lehrkraefte.filter((x) => x !== k);
  await speichereVerzeichnis();
  if (await z.lehrer.ordner(k)) await z.lehrer.entferne(k);
  z.hinweis = `Lehrkraft ${k} gelöscht.${eigene.length ? ` Die Klassendateien von ${eigene.join(', ')} sind neu unterschrieben.` : ''}${allein.length ? ` Ohne Lehrkraft: ${allein.join(', ')}.` : ''}`;
}
// Klassenordner im Schuljahr, die nicht (mehr) im Schulverzeichnis stehen.
async function aufgeloesteKlassen(jahr) {
  const namen = new Set();
  for (const ablage of [z.schueler, z.lehrer]) for (const n of (await (await ablage.ordner(jahr))?.ordnernamen()) ?? []) if (SCH.istKlasse(n)) namen.add(n);
  return [...namen].filter((k) => !z.v.klassen[jahr]?.[k]).sort(SCH.vergleicheKlassen);
}
function aufgeloesteKarte() {
  const jahr = z.jahr;
  const platz = h('section', { class: 'karte', id: 'aufgeloest' });
  aufgeloesteKlassen(jahr).then((liste) => {
    if (!liste.length) return platz.remove();
    platz.replaceChildren(h('h2', {}, 'Aufgelöste Klassen'),
      h('p', { class: 'klein' }, 'Diese Ordner stehen nicht mehr im Schulverzeichnis. „Daten löschen“ entfernt sie auf beiden Tauschlaufwerken endgültig, mit Speicherständen, Namensliste und Backups.'),
      h('ul', { class: 'klassenliste' }, liste.map((k) => h('li', {}, h('b', {}, k),
        h('button', { class: 'schlicht', 'data-aufnehmen': k, onclick: tue(async () => {
          (z.v.klassen[jahr] ??= {})[k] = { lehrkraefte: [] };
          await speichereVerzeichnis();
          z.hinweis = `Klasse ${k} ist wieder im Schulverzeichnis. Ordne ihr eine Lehrkraft zu.`;
        }) }, 'Wieder aufnehmen'),
        h('button', { class: 'schlicht gefahr', 'data-daten-loeschen': k, onclick: tue(async () => {
          const eingabe = prompt(`Alle Daten der Klasse ${k} im Schuljahr ${jahr} endgültig löschen? Zum Bestätigen den Klassennamen ${k} eintippen:`);
          if (eingabe == null) return;
          if (eingabe.trim().toLowerCase() !== k) throw new Error('Der Klassenname stimmt nicht. Es wurde nichts gelöscht.');
          for (const ablage of [z.schueler, z.lehrer]) { const o = await ablage.ordner(jahr); if (o && await o.ordner(k)) await o.entferne(k); }
          z.hinweis = `Die Daten der Klasse ${k} sind gelöscht.`;
        }) }, 'Daten löschen')))));
  }).catch((e) => platz.replaceChildren(h('p', { class: 'fehlertext' }, e.message)));
  return platz;
}

// ---------- Betrieb: Backups und Betriebsprotokoll (ADR 0013, 0025) ----------
// Liest für das aktuelle Schuljahr alle Klassen: Speicherstände (für ihr Betriebsprotokoll), Namen und Backups,
// dazu das Protokoll jeder Lehrkraft.
async function ladeBetrieb() {
  const v = z.v, jahr = v.schuljahr, klassen = [], eintraege = [];
  const sJahr = await z.schueler.ordner(jahr), lJahr = await z.lehrer.ordner(jahr);
  for (const k of Object.keys(v.klassen[jahr] ?? {}).sort(SCH.vergleicheKlassen)) {
    const daten = await ladeKlasse(k, jahr).catch(() => null);
    const namen = daten?.namen ?? {};
    const ordner = sJahr && await sJahr.ordner(k);
    let staende = 0;
    const standListe = [];
    for (const datei of ordner ? await ordner.liste() : []) {
      const m = datei.match(B.CODE_DATEI);
      if (!m) continue;
      staende++;
      try {
        const stand = JSON.parse(await ordner.lies(datei));
        standListe.push({ code: m[1], stand });
        for (const e of stand.betrieb ?? []) eintraege.push({ ...e, klasse: k, code: m[1], wer: namen[m[1]] ? `${namen[m[1]]} (${m[1]})` : m[1] });
      } catch { /* halb geschrieben */ }
    }
    for (const [code, gaben] of Object.entries(daten?.einst?.muenzgaben ?? {})) for (const g of gaben)
      eintraege.push({ t: g.t, art: 'ok', text: `Münzgabe +${g.muenzen} Münzen an ${code}`, klasse: k, code, wer: 'Administrator' });
    const bo = lJahr && await (await lJahr.ordner(k))?.ordner('backup');
    klassen.push({ klasse: k, test: Boolean(v.klassen[jahr][k].test), lehrkraefte: v.klassen[jahr][k].lehrkraefte ?? [], namen, staende, standListe, backups: bo ? B.behalteneBackups(await bo.ordnernamen()) : [] });
  }
  const meldungen = {};
  for (const kz of Object.keys(v.lehrkraefte)) {
    try {
      const l = JSON.parse(await (await z.lehrer.ordner(kz))?.lies(SCH.LEHRER_DATEI));
      for (const e of l.protokoll ?? []) eintraege.push({ ...e, wer: `Lehrkraft ${kz}` });
      meldungen[kz] = (l.meldungen ?? []).filter((m) => !SCH.istTestklasse(v, jahr, m.klasse)); // Testklassen zählen nicht (ADR 0028)
    } catch { /* noch nie gestartet */ }
  }
  eintraege.sort((a, b) => (a.t < b.t ? 1 : a.t > b.t ? -1 : 0));
  let status = {};
  try { status = JSON.parse(await z.lehrer.lies(M.STATUS_DATEI)) ?? {}; } catch { /* noch keine */ }
  return { klassen, eintraege, meldungen, status, geladen: new Date() };
}
// Zeichnet `zeichne(betrieb)` erst, wenn die Daten da sind.
function mitBetrieb(zeichne) {
  if (z.betrieb) return zeichne(z.betrieb);
  if (!z.betriebLaedt) {
    z.betriebLaedt = true;
    ladeBetrieb().then((b) => { z.betrieb = b; }).catch((e) => { z.fehler = `Lesen der Klassenordner fehlgeschlagen: ${e.message}`; z.betrieb = { klassen: [], eintraege: [], meldungen: {}, status: {}, geladen: new Date() }; })
      .finally(() => { z.betriebLaedt = false; male(); });
  }
  return h('section', { class: 'karte' }, h('p', {}, 'Lese alle Klassenordner …'));
}
const TAG = 86400000;
// Testklassen zählen nicht in Nutzungsstatistik und Auffällige Aufgaben (ADR 0028).
const echteKlassen = (b) => b.klassen.filter((k) => !k.test);
const backupAlt = (k) => !k.backups.length || Date.now() - B.backupZeit(k.backups[0]) > 7 * TAG;
const kurzeZeit = (t) => new Date(t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
const neuLaden = () => h('button', { class: 'schlicht', id: 'betrieb-neu', onclick: () => { z.betrieb = null; male(); } }, 'Neu lesen');

function uebersichtKarte() {
  return mitBetrieb((b) => {
    const woche = b.eintraege.filter((e) => e.art === 'problem' && Date.now() - new Date(e.t) < 7 * TAG);
    const ohneBackup = echteKlassen(b).filter((k) => k.staende && backupAlt(k));
    const ohneLehrkraft = b.klassen.filter((k) => !k.lehrkraefte.length);
    const offen = M.sammle(b.meldungen, b.status, z.v.gesperrt ?? []).filter((g) => g.status === 'offen');
    const auffaellig = auffaelligeVon(b).filter((x) => !(z.v.gesperrt ?? []).includes(x.aufgabe));
    const punkte = [
      offen.length > 0 && h('li', {}, h('b', {}, `${offen.length} ${offen.length === 1 ? 'offene Aufgabenmeldung' : 'offene Aufgabenmeldungen'}: `), offen.slice(0, 5).map((g) => g.kennung).join(', '), ' ',
        h('button', { class: 'schlicht', onclick: () => { z.tab = 'aufgaben'; male(); } }, 'Ansehen')),
      auffaellig.length > 0 && h('li', {}, h('b', {}, `${auffaellig.length} ${auffaellig.length === 1 ? 'auffällige Aufgabe' : 'auffällige Aufgaben'} `), 'nach den Antworten der Schüler. ',
        h('button', { class: 'schlicht', onclick: () => { z.tab = 'aufgaben'; male(); } }, 'Ansehen')),
      woche.length > 0 && h('li', {}, h('b', {}, `${woche.length} technische ${woche.length === 1 ? 'Problem' : 'Probleme'} in den letzten 7 Tagen. `),
        h('button', { class: 'schlicht', onclick: () => { z.tab = 'betrieb'; z.protokoll.nurProbleme = true; male(); } }, 'Im Protokoll ansehen'),
        h('ul', { class: 'liste' }, woche.slice(0, 5).map((e) => h('li', { class: 'klein' }, `${kurzeZeit(e.t)} · ${e.klasse ?? e.wer}: ${e.text}`)))),
      ohneBackup.length > 0 && h('li', {}, h('b', {}, 'Kein Backup in den letzten 7 Tagen: '), ohneBackup.map((k) => k.klasse).join(', '),
        h('span', { class: 'klein' }, '. Backups entstehen, solange ein Lehrer-Dashboard der Klasse offen ist; unter „Betrieb“ kannst du sofort sichern.')),
      ohneLehrkraft.length > 0 && h('li', {}, h('b', {}, 'Ohne Lehrkraft: '), ohneLehrkraft.map((k) => k.klasse).join(', ')),
    ].filter(Boolean);
    return h('section', { class: 'karte', id: 'uebersicht' }, h('div', { class: 'reihe' }, h('h2', {}, 'Was jetzt Aufmerksamkeit braucht'), h('span', { class: 'rechts' }, neuLaden())),
      h('p', { class: 'klein' }, `Schuljahr ${z.v.schuljahr}: ${echteKlassen(b).length} Klassen, ${echteKlassen(b).reduce((n, k) => n + k.staende, 0)} Speicherstände, ${Object.keys(z.v.lehrkraefte).length} Lehrkräfte${b.klassen.length > echteKlassen(b).length ? `, dazu ${b.klassen.length - echteKlassen(b).length} Testklasse${b.klassen.length - echteKlassen(b).length > 1 ? 'n' : ''}` : ''}.`),
      punkte.length ? h('ul', { class: 'liste' }, punkte) : h('p', { id: 'alles-gut' }, 'Alles in Ordnung: keine offenen Aufgabenmeldungen, keine auffälligen Aufgaben, keine technischen Probleme in den letzten 7 Tagen, jede Klasse hat ein frisches Backup und eine Lehrkraft.'));
  });
}

// ---------- Nutzungsstatistik (ADR 0025): Nutzung und Technik, kein Lernstand, keine Namen ----------
const prozent = (q) => (q == null ? '–' : `${Math.round(q * 100)} %`);
const haeufigste = (liste, n = 2) => (liste.length ? liste.slice(0, n).map(([w, c]) => `${w} (${c})`).join(', ') + (liste.length > n ? ' …' : '') : '–');
function nutzungKarte() {
  return mitBetrieb((b) => {
    const tage = (z.nutzungTage ??= 7);
    const { zeilen, gesamt } = ST.nutzung(echteKlassen(b).map((k) => ({ ...k, staende: k.standListe })), jetzt(), tage);
    const zeile = (r, fett) => h('tr', { class: fett ? 'summe' : '', 'data-nutzung': r.klasse },
      h('td', {}, fett ? h('b', {}, 'Alle Klassen') : h('b', {}, r.klasse)),
      h('td', { class: 'zahl' }, `${r.aktiv} von ${r.staende}`), h('td', { class: 'zahl' }, String(r.aufgaben)), h('td', { class: 'zahl' }, prozent(r.quote)),
      h('td', { class: 'zahl' }, String(r.starts)), h('td', { class: `zahl${r.ohneNetz ? ' fehlertext' : ''}` }, String(r.ohneNetz)), h('td', { class: `zahl${r.probleme ? ' fehlertext' : ''}` }, String(r.probleme)),
      h('td', { class: 'klein' }, haeufigste(r.versionen)), h('td', { class: 'klein' }, haeufigste(r.browser)));
    const alteVersion = gesamt.versionen.length > 1 ? gesamt.versionen.slice(1).reduce((n, [, c]) => n + c, 0) : 0;
    return h('section', { class: 'karte', id: 'nutzung' }, h('div', { class: 'reihe' }, h('h2', {}, 'Nutzungsstatistik'), h('span', { class: 'rechts' }, neuLaden())),
      h('p', { class: 'klein' }, 'Wie Mathekingdom an der Schule genutzt wird und ob es technisch läuft. Gezählt werden Speicherstände, keine Personen; Lernstände sehen die Lehrkräfte in ihrem Dashboard. „Nicht online“ heißt: gestartet aus einer Kopie oder der Datei ohne Netz, meist weil GitHub nicht erreichbar war. Version und Browser stammen vom jeweils letzten Start eines Speicherstands.'),
      h('div', { class: 'reihe' }, h('label', {}, 'Zeitraum ', h('select', { id: 'nutzung-tage', onchange: (ev) => { z.nutzungTage = Number(ev.target.value); male(); } },
        [[7, 'letzte 7 Tage'], [30, 'letzte 30 Tage'], [365, 'ganzes Schuljahr']].map(([w, t]) => h('option', { value: w, selected: tage === w }, t))))),
      !zeilen.length ? h('p', {}, 'Noch keine Klasse in diesem Schuljahr.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Klasse', 'Aktive Speicherstände', 'Aufgaben', 'Gelöst', 'Starts', 'Nicht online', 'Probleme', 'Version', 'Browser'].map((t) => h('th', {}, t)))),
        h('tbody', {}, zeilen.map((r) => zeile(r)), zeilen.length > 1 && zeile(gesamt, true)))),
      alteVersion > 0 && h('p', { class: 'klein', id: 'alte-version' }, `${alteVersion} Speicherstände starteten zuletzt nicht mit der häufigsten Version ${gesamt.versionen[0][0]}. Liegt im Klassenordner noch eine alte Kopie? Unter „Schule“ kannst du die Startdateien neu schreiben.`));
  });
}

function backupKarte() {
  return mitBetrieb((b) => {
    const jahr = z.v.schuljahr;
    const mitBackups = b.klassen.filter((k) => k.backups.length);
    const wahl = z.wiederher ??= {};
    const klasse = mitBackups.find((k) => k.klasse === wahl.klasse) ?? mitBackups[0];
    const backupOrdner = async (k) => (await klassenOrdner(z.lehrer, k, jahr)).unterordner('backup');
    return h('section', { class: 'karte', id: 'backups' }, h('div', { class: 'reihe' }, h('h2', {}, 'Backups'), h('span', { class: 'rechts' }, neuLaden())),
      h('p', { class: 'klein' }, `Solange ein Lehrer-Dashboard offen ist, sichert es seine Klasse stündlich in den Ordner „backup“ auf dem Lehrertauschlaufwerk (${jahr}/<Klasse>/backup). Je Klasse bleiben höchstens ${B.MAX_BACKUPS} Stände: der neueste und je der letzte der vier Tage davor, an denen gesichert wurde.`),
      b.klassen.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Klasse', 'Speicherstände', 'Letztes Backup', 'Stände', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, b.klassen.map((k) => h('tr', {}, h('td', {}, h('b', {}, k.klasse)), h('td', { class: 'zahl' }, String(k.staende)),
          h('td', { class: k.staende && backupAlt(k) ? 'fehlertext' : '' }, k.backups.length ? B.lesbarerStempel(k.backups[0]) : 'noch keins'),
          h('td', { class: 'zahl' }, String(k.backups.length)),
          h('td', {}, h('button', { class: 'schlicht', 'data-sichern': k.klasse, onclick: tue(async () => {
            const daten = await ladeKlasse(k.klasse, jahr);
            const r = await B.sichereKlasse({ klassenordner: await klassenOrdner(z.schueler, k.klasse, jahr), backupOrdner: await backupOrdner(k.klasse), zusatz: daten ? { [SCH.KLASSE_DATEI]: JSON.stringify(daten) } : {} });
            z.betrieb = null; z.hinweis = `Klasse ${k.klasse} gesichert: ${r.anzahl} Speicherstände.`;
          }) }, 'Jetzt sichern'))))))),
      klasse && h('div', { id: 'wiederherstellen-karte' }, h('h3', {}, 'Wiederherstellen'),
        h('p', { class: 'klein' }, 'Ein Speicherstand oder alle Speicherstände einer Klasse werden durch die gesicherte Fassung ersetzt. Die Schüler sollten dabei nicht angemeldet sein. Bei der ganzen Klasse kommen auch Namensliste und Einstellungen aus dem Backup zurück.'),
        h('div', { class: 'reihe' },
          h('label', {}, 'Klasse ', h('select', { id: 'backup-klasse', onchange: (ev) => { z.wiederher = { klasse: ev.target.value }; male(); } }, mitBackups.map((k) => h('option', { value: k.klasse, selected: k === klasse }, k.klasse)))),
          h('label', {}, 'Backup vom ', h('select', { id: 'backup-wahl' }, klasse.backups.map((s) => h('option', { value: s, selected: s === wahl.stempel }, B.lesbarerStempel(s))))),
          h('label', {}, 'Was ', h('select', { id: 'backup-schueler' }, h('option', { value: '' }, 'die ganze Klasse'),
            Object.keys(klasse.namen).sort((a, c) => klasse.namen[a].localeCompare(klasse.namen[c], 'de')).map((c) => h('option', { value: c }, `${klasse.namen[c]} (${c})`)))),
          h('button', { class: 'haupt', id: 'wiederherstellen', onclick: tue(async () => {
            const stempel = document.getElementById('backup-wahl').value, code = document.getElementById('backup-schueler').value;
            const zeit = B.lesbarerStempel(stempel), ziel = await klassenOrdner(z.schueler, klasse.klasse, jahr), bo = await backupOrdner(klasse.klasse);
            if (code) {
              if (!confirm(`Speicherstand von ${klasse.namen[code]} auf das Backup vom ${zeit} zurücksetzen?`)) return;
              await B.stelleStandWiederHer({ backupOrdner: bo, stempel, code, klassenordner: ziel });
              z.hinweis = `Speicherstand von ${klasse.namen[code]} aus dem Backup vom ${zeit} wiederhergestellt.`;
            } else {
              if (!confirm(`Alle Speicherstände der Klasse ${klasse.klasse} auf das Backup vom ${zeit} zurücksetzen? Was seitdem gelöst wurde, geht verloren.`)) return;
              const r = await B.stelleKlasseWiederHer({ backupOrdner: bo, stempel, klassenordner: ziel });
              if (r.zusatz[SCH.KLASSE_DATEI]) await speichereKlasse(klasse.klasse, JSON.parse(r.zusatz[SCH.KLASSE_DATEI]), jahr);
              z.hinweis = `Klasse ${klasse.klasse} aus dem Backup vom ${zeit} wiederhergestellt: ${r.codes.length} Speicherstände.`;
            }
            z.wiederher = { klasse: klasse.klasse, stempel };
            z.betrieb = null;
          }) }, 'Wiederherstellen'))));
  });
}

function protokollKarte() {
  return mitBetrieb((b) => {
    const f = z.protokoll;
    const alle = b.eintraege.filter((e) => !f.klasse || e.klasse === f.klasse || (!e.klasse && f.klasse === '-'));
    const zeilen = (f.nurProbleme ? alle.filter((e) => e.art === 'problem') : alle).slice(0, 200);
    const ART = { start: 'Start', problem: 'Problem', ok: 'wieder ok' };
    return h('section', { class: 'karte', id: 'protokoll' }, h('h2', {}, 'Betriebsprotokoll'),
      h('p', { class: 'klein' }, 'Technische Ereignisse aus allen Speicherständen und von allen Lehrer-Dashboards: woher geladen wurde, welche Version, welcher Browser, und was schiefging, etwa GitHub nicht erreichbar, Speichern fehlgeschlagen oder eine von außen veränderte Klassendatei. Lerndaten stehen hier nicht. Die Lehrkräfte sehen davon nur Warnungen, bei denen sie selbst etwas tun können.'),
      h('div', { class: 'reihe' },
        h('label', {}, 'Klasse ', h('select', { id: 'protokoll-klasse', onchange: (ev) => { f.klasse = ev.target.value; male(); } },
          h('option', { value: '' }, 'alle'), b.klassen.map((k) => h('option', { value: k.klasse, selected: f.klasse === k.klasse }, k.klasse)), h('option', { value: '-', selected: f.klasse === '-' }, 'ohne Klasse (Starts der Lehrkräfte)'))),
        h('label', { class: 'schalter' }, h('input', { type: 'checkbox', id: 'protokoll-probleme', checked: f.nurProbleme, onchange: (ev) => { f.nurProbleme = ev.target.checked; male(); } }), ' Nur Probleme'),
        alle.length > 0 && h('button', { class: 'schlicht', id: 'protokoll-export', onclick: () => ladeHerunter(`Mathekingdom_Protokoll_${f.klasse && f.klasse !== '-' ? f.klasse : 'Schule'}_${new Date().toLocaleDateString('sv-SE')}.txt`, P.alsText(alle.map((e) => ({ ...e, wer: e.code ?? e.wer })), f.klasse && f.klasse !== '-' ? f.klasse : null, jetzt()), 'text/plain;charset=utf-8') }, 'Als Textdatei speichern (nur Codes)')),
      h('p', {}, alle.length ? `${alle.length} Einträge, davon ${alle.filter((e) => e.art === 'problem').length} Probleme.` : 'Noch keine Einträge.'),
      zeilen.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Zeit', 'Klasse', 'Wer', 'Art', 'Ereignis'].map((t) => h('th', {}, t)))),
        h('tbody', {}, zeilen.map((e) => h('tr', { class: e.art === 'problem' ? 'problem' : '' },
          h('td', { style: 'white-space:nowrap' }, kurzeZeit(e.t)), h('td', {}, e.klasse ?? '–'), h('td', { style: 'white-space:nowrap' }, e.wer),
          h('td', { class: e.art === 'problem' ? 'fehlertext' : '' }, ART[e.art] ?? e.art), h('td', {}, e.text)))))),
      alle.length > zeilen.length && h('p', { class: 'klein' }, `Gezeigt werden die neuesten ${zeilen.length}. Die Textdatei enthält alle.`));
  });
}

// ---------- Aufgaben: Meldungen und Sperren (ADR 0025) ----------
// Die Aufgabe zu einer Kennung aus den mitgelieferten Pools.
function aufgabeZu(kennung) {
  for (const pool of Object.values(window.MK_POOLS ?? {})) { const a = pool.aufgaben.find((x) => x.id === kennung); if (a) return a; }
  return null;
}
async function setzeStatus(kennung, status) {
  let liste = {};
  try { liste = JSON.parse(await z.lehrer.lies(M.STATUS_DATEI)) ?? {}; } catch { /* neu */ }
  liste[kennung] = { status, t: jetzt() };
  await z.lehrer.schreibe(M.STATUS_DATEI, JSON.stringify(liste, null, 1));
}
async function setzeSperre(kennung, an) {
  const liste = new Set(z.v.gesperrt ?? []);
  if (an) liste.add(kennung); else liste.delete(kennung);
  z.v.gesperrt = [...liste].sort();
  await speichereVerzeichnis();
}
function meldungenKarte() {
  return mitBetrieb((b) => {
    const f = (z.meldungsFilter ??= { nurOffen: true });
    const alle = M.sammle(b.meldungen, b.status, z.v.gesperrt ?? []);
    const liste = f.nurOffen ? alle.filter((g) => g.status === 'offen') : alle;
    const kurz = (t) => (t.length > 90 ? `${t.slice(0, 88)} …` : t);
    return h('section', { class: 'karte', id: 'aufgabenmeldungen' }, h('div', { class: 'reihe' }, h('h2', {}, 'Aufgabenmeldungen'), h('span', { class: 'rechts' }, neuLaden())),
      h('p', { class: 'klein' }, 'Lehrkräfte melden fehlerhafte Aufgaben mit ihrer Kennung. Korrigiert wird die Aufgabe in ihrem Erzeuger; dafür kannst du die Meldungen als Text speichern und weitergeben. Bis die korrigierte Version da ist, kannst du die Aufgabe sperren: Die Schüler bekommen dann eine andere Aufgabe desselben Lernziels und Niveaus, Fehlversuche an ihr zählen nicht. Kommt nach „behoben“ eine neue Meldung, ist die Aufgabe wieder offen.'),
      h('div', { class: 'reihe' },
        h('label', { class: 'schalter' }, h('input', { type: 'checkbox', id: 'meldungen-offen', checked: f.nurOffen, onchange: (ev) => { f.nurOffen = ev.target.checked; male(); } }), ' Nur offene'),
        liste.length > 0 && h('button', { class: 'schlicht', id: 'meldungen-export', onclick: () => ladeHerunter(`Mathekingdom_Aufgabenmeldungen_${new Date().toLocaleDateString('sv-SE')}.txt`, M.alsText(liste, aufgabeZu, jetzt()), 'text/plain;charset=utf-8') }, 'Als Textdatei speichern')),
      !liste.length ? h('p', { id: 'meldungen-leer' }, alle.length ? 'Keine offenen Meldungen.' : 'Noch keine Aufgabe gemeldet.')
        : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
          h('thead', {}, h('tr', {}, ['Kennung', 'Aufgabe', 'Gemeldet', 'Stand', 'Gesperrt'].map((t) => h('th', {}, t)))),
          h('tbody', {}, liste.map((g) => {
            const a = aufgabeZu(g.kennung);
            return h('tr', { 'data-meldung': g.kennung }, h('td', {}, h('code', { class: 'kennung' }, g.kennung)),
              h('td', {}, a ? kurz(a.text.replace(/\{\{\w+\}\}/g, '▢').replace(/\s*\n\s*/g, ' ')) : h('span', { class: 'fehlertext' }, 'nicht im Pool'),
                a && h('div', { class: 'klein' }, `Lösung im Pool: ${M.loesungVon(a)}`),
                h('ul', { class: 'liste klein' }, g.meldungen.map((m) => h('li', {}, `${new Date(m.t).toLocaleDateString('de-DE')}, ${m.kuerzel}${m.klasse ? ` (${m.klasse})` : ''}: ${M.ARTEN[m.art] ?? m.art}${m.satz ? `. ${m.satz}` : ''}`)))),
              h('td', { class: 'zahl' }, String(g.meldungen.length)),
              h('td', {}, h('select', { 'data-status': g.kennung, onchange: tue(async (ev) => { await setzeStatus(g.kennung, ev.target.value); z.betrieb = null; }) },
                Object.entries(M.STATUS).map(([w, t]) => h('option', { value: w, selected: g.status === w }, t)))),
              h('td', {}, h('input', { type: 'checkbox', 'data-sperre': g.kennung, checked: g.gesperrt, onchange: tue(async (ev) => { await setzeSperre(g.kennung, ev.target.checked); }) })));
          })))));
  });
}
// ---------- Auffällige Aufgaben (ADR 0025) ----------
const allePoolAufgaben = () => Object.values(window.MK_POOLS ?? {}).flatMap((p) => p.aufgaben);
const alleStaendeVon = (b) => echteKlassen(b).flatMap((k) => k.standListe ?? []);
function auffaelligeVon(b) { return (b.auffaellig ??= ST.auffaelligeAufgaben(alleStaendeVon(b), allePoolAufgaben())); }
function auffaelligKarte() {
  return mitBetrieb((b) => {
    const liste = auffaelligeVon(b), gesperrt = new Set(z.v.gesperrt ?? []);
    const kurz = (t) => (t.length > 90 ? `${t.slice(0, 88)} …` : t);
    return h('section', { class: 'karte', id: 'auffaellig' }, h('div', { class: 'reihe' }, h('h2', {}, `Auffällige Aufgaben (${liste.length})`), h('span', { class: 'rechts' }, neuLaden())),
      h('p', { class: 'klein' }, `Aus den Antworten aller Schüler dieses Schuljahres, ohne Namen. Auffällig ist eine Aufgabe, wenn viele dieselbe falsche Antwort geben, die nicht als typischer Fehler hinterlegt ist (vielleicht stimmt die Lösung im Pool nicht), wenn sie viel seltener gelöst wird als die übrigen Aufgaben desselben Lernziels und Niveaus, oder wenn sie oft abgebrochen wird. Beurteilt wird erst ab ${ST.MINDESTENS} Bearbeitungen von mindestens ${ST.MIN_SCHUELER} Schülern. Auffällig heißt nicht fehlerhaft: Sieh dir die Aufgabe an und sperre sie, wenn sie nicht stimmt.`),
      !liste.length ? h('p', { id: 'auffaellig-leer' }, 'Keine Aufgabe fällt auf.')
        : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
          h('thead', {}, h('tr', {}, ['Kennung', 'Aufgabe', 'Bearbeitet', 'Gelöst', 'Warum auffällig', 'Gesperrt'].map((t) => h('th', {}, t)))),
          h('tbody', {}, liste.map((x) => {
            const a = aufgabeZu(x.aufgabe);
            return h('tr', { 'data-auffaellig': x.aufgabe }, h('td', {}, h('code', { class: 'kennung' }, x.aufgabe), h('div', { class: 'klein' }, FORMAT_NAMEN[x.format] ?? x.format)),
              h('td', {}, a ? kurz(a.text.replace(/\{\{\w+\}\}/g, '▢').replace(/\s*\n\s*/g, ' ')) : '', a && h('div', { class: 'klein' }, `Lösung im Pool: ${M.loesungVon(a)}`)),
              h('td', { class: 'zahl' }, `${x.bearbeitet} (${x.schueler} Schüler)`), h('td', { class: 'zahl' }, prozent(x.quote)),
              h('td', {}, h('ul', { class: 'liste klein' }, x.gruende.map((g) => h('li', {}, g)))),
              h('td', {}, h('input', { type: 'checkbox', 'data-sperre-auffaellig': x.aufgabe, checked: gesperrt.has(x.aufgabe), onchange: tue(async (ev) => { await setzeSperre(x.aufgabe, ev.target.checked); }) })));
          })))));
  });
}
function typenKarte() {
  return mitBetrieb((b) => {
    const typen = ST.jeAufgabentyp(alleStaendeVon(b), allePoolAufgaben(), auffaelligeVon(b), FORMAT_NAMEN);
    return h('section', { class: 'karte', id: 'aufgabentypen' }, h('h2', {}, 'Je Aufgabentyp'),
      h('p', { class: 'klein' }, 'Wie die Aufgabenformate laufen: Eine hohe Abbruchquote bei einem Format deutet eher auf ein Problem mit der Bedienung als mit einzelnen Aufgaben.'),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Aufgabentyp', 'Im Pool', 'Genutzt', 'Bearbeitungen', 'Gelöst', 'Abgebrochen', 'Auffällig'].map((t) => h('th', {}, t)))),
        h('tbody', {}, typen.map((t) => h('tr', { 'data-typ': t.format }, h('td', {}, t.name), h('td', { class: 'zahl' }, String(t.imPool)), h('td', { class: 'zahl' }, String(t.genutzt)),
          h('td', { class: 'zahl' }, String(t.bearbeitet)), h('td', { class: 'zahl' }, prozent(t.quote)),
          h('td', { class: `zahl${(t.abbruchquote ?? 0) >= 0.2 ? ' fehlertext' : ''}` }, prozent(t.abbruchquote)), h('td', { class: 'zahl' }, String(t.auffaellig))))))));
  });
}
function sperrenKarte() {
  const liste = z.v.gesperrt ?? [];
  const eingabe = h('input', { id: 'sperre-kennung', type: 'text', size: 18, placeholder: 'z. B. 5.3.1-K1-F-01' });
  return h('section', { class: 'karte', id: 'gesperrt' }, h('h2', {}, `Gesperrte Aufgaben (${liste.length})`),
    liste.length ? h('ul', { class: 'klassenliste' }, liste.map((k) => h('li', {}, h('code', { class: 'kennung' }, k), h('span', { class: 'klein' }, aufgabeZu(k)?.lernziel ?? 'nicht im Pool'),
      h('button', { class: 'schlicht', 'data-entsperren': k, onclick: tue(async () => { await setzeSperre(k, false); z.hinweis = `Aufgabe ${k} ist wieder frei.`; }) }, 'Wieder freigeben'))))
      : h('p', { class: 'klein' }, 'Keine Aufgabe gesperrt.'),
    h('div', { class: 'reihe' }, eingabe, h('button', { class: 'schlicht', id: 'sperren', onclick: tue(async () => {
      const k = eingabe.value.trim();
      if (!aufgabeZu(k)) throw new Error(`Die Kennung ${k || '(leer)'} steht nicht im Aufgabenpool.`);
      await setzeSperre(k, true);
      z.hinweis = `Aufgabe ${k} ist gesperrt. Die Schüler bekommen sie ab der nächsten Anmeldung nicht mehr.`;
    }) }, 'Aufgabe sperren')));
}

// ---------- Testklassen (ADR 0028) ----------
const testApi = { z, tue, male: () => male(), ladeKlasse, speichereKlasse, klassenOrdner, speichereVerzeichnis, alleCodes, drucke };

// ---------- Rahmen ----------
// Fünf Bereiche (ADR 0025).
const TABS = [['uebersicht', 'Übersicht'], ['schule', 'Schule'], ['klassen', 'Klassen und Lehrkräfte'], ['betrieb', 'Betrieb'], ['aufgaben', 'Aufgaben']];
function hauptansicht() {
  const inhalt = {
    uebersicht: () => uebersichtKarte(),
    schule: () => [schuljahrKarte(), uebernahmeKarte(), startdateien(), altKarte()],
    klassen: () => [lehrkraefte(), klassenKarte(), z.klasse && namenKarte(), testklassenKarte(testApi), aufgeloesteKarte()],
    betrieb: () => [nutzungKarte(), backupKarte(), protokollKarte()],
    aufgaben: () => [meldungenKarte(), auffaelligKarte(), typenKarte(), sperrenKarte()],
  }[z.tab];
  return h('div', {},
    h('nav', { class: 'tabs bereiche' }, TABS.map(([id, titel]) => h('button', { class: z.tab === id ? 'aktiv' : '', 'data-tab': id, onclick: () => { z.tab = id; z.hinweis = null; if (id !== 'schule' && id !== 'klassen') z.betrieb = null; male(); } }, titel))),
    inhalt());
}
function male() {
  wurzel.replaceChildren(...[
    h('header', { class: 'kopf' }, h('strong', {}, 'Mathekingdom'), h('span', {}, 'Administrator'), z.v && h('span', { class: 'demo' }, `Schuljahr ${z.v.schuljahr}`)),
    z.fehler && h('div', { class: 'meldung fehler', role: 'alert' }, z.fehler),
    z.hinweis && h('div', { class: 'meldung warnung', id: 'hinweis' }, z.hinweis),
    h('main', {}, z.v ? hauptansicht() : start()),
    versionsHinweis('lehrkraft'),
  ].filter(Boolean));
}

if (typeof document !== 'undefined') {
  wurzel = document.getElementById('mathekingdom-lehrer') ?? document.body.appendChild(h('div', { id: 'mathekingdom-lehrer' }));
  document.head.append(h('style', {}, stil + VERSION_STIL));
  male();
}
