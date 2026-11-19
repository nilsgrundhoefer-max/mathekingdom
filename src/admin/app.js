// Administrator-Dashboard (ADR 0024): Hier beginnt die Einrichtung. Schuljahre, Klassen, Lehrkräfte, Übernahme ins
// neue Schuljahr, Startdateien und der Umzug alter Lehrerdaten. Lernstände sieht der Administrator im Lehrer-Dashboard.
import stil from '../lehrer/stil.css';
import { h } from '../schueler/dom.js';
import * as S from '../schueler/speicher.js';
import * as K from '../gemeinsam/krypto.js';
import * as SCH from '../gemeinsam/schule.js';
import { erzeugeCode } from '../lehrer/auswertung.js';
import { gemerkteOrdner, erlaube } from '../gemeinsam/gemerkt.js';
import { versionsHinweis, VERSION_STIL } from '../gemeinsam/version.js';

const gemerkt = gemerkteOrdner('mathekingdom-admin');
const LAUFWERKE = {
  persoenlich: ['Dein persönliches Lehrerlaufwerk', 'Hier liegt dein Administrator-Schlüssel. Nur du darfst Zugriff haben.'],
  schueler: ['Schülertauschlaufwerk', 'Wähle den Ordner „Mathekingdom“ oder das Laufwerk; fehlt der Ordner, wird er angelegt.'],
  lehrer: ['Lehrertauschlaufwerk', 'Wähle den Ordner „Mathekingdom“ oder das Laufwerk; fehlt der Ordner, wird er angelegt.'],
};
const z = { wahl: null, persoenlich: null, schueler: null, lehrer: null, admin: null, v: null, tab: 'klassen', jahr: null, klasse: null, uebernahme: null, alt: null, fehler: null, hinweis: null };
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
  if (!vorhanden) { await jahrOrdner(schueler); await jahrOrdner(lehrer); await speichereVerzeichnis(); z.hinweis = `Mathekingdom ist eingerichtet, Schuljahr ${v.schuljahr}. Lege jetzt die Lehrkräfte an, dann die Klassen.`; z.tab = 'lehrkraefte'; }
  // Kopie für Tage ohne Internet, damit Schüler-Startdateien auch dann starten.
  if (window.MK_SCHUELER_JS) await schueler.schreibe(`${S.SYSTEMORDNER}/schueler.js`, window.MK_SCHUELER_JS).catch(() => {});
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
    await speichereVerzeichnis();
  });
  return h('section', { class: 'karte' }, h('h2', {}, `Klassen im Schuljahr ${z.jahr}`),
    klassen.length ? h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'klassen' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Klasse'), h('th', {}, 'Lehrkräfte'), h('th', {}, ''))),
      h('tbody', {}, klassen.map((k) => h('tr', {}, h('td', {}, h('b', {}, k)),
        h('td', {}, kuerzel.length ? kuerzel.map((kz) => h('label', { class: 'schalter', style: 'margin-right:10px' },
          h('input', { type: 'checkbox', 'data-lehrkraft': `${k}|${kz}`, checked: (v.klassen[z.jahr][k].lehrkraefte ?? []).includes(kz), onchange: (ev) => setzeLehrkraft(k, kz, ev.target.checked) }), ` ${kz}`))
          : h('span', { class: 'klein' }, 'Lege zuerst Lehrkräfte an.')),
        h('td', {}, h('button', { class: 'schlicht', 'data-namen': k, onclick: () => { z.klasse = k; male(); } }, 'Namen und Codes'))))))) : h('p', {}, 'Noch keine Klassen.'),
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
        h('thead', {}, h('tr', {}, ['Name', 'Schülercode', 'PIN', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, daten.namen[c]), h('td', { class: 'code' }, c), h('td', { class: 'code pin' }, daten.pins?.[c]?.pin ?? '…'),
          h('td', {}, h('button', { class: 'schlicht', onclick: tue(async () => {
            if (!confirm(`${daten.namen[c]} aus der Namensliste entfernen? Der Speicherstand bleibt liegen.`)) return;
            delete daten.namen[c]; delete daten.einst.zielniveaus?.[c]; await speichereKlasse(klasse, daten);
          }) }, 'Entfernen'))))))),
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

// ---------- Übernahme ins neue Schuljahr ----------
// Aus einer Klasse eines früheren Schuljahrs: jeder Schüler in eine Klasse des angezeigten Schuljahrs.
function uebernahmeKarte() {
  const v = z.v, frueher = v.schuljahre.filter((j) => j < z.jahr && Object.keys(v.klassen[j] ?? {}).length).sort().reverse();
  if (!frueher.length) return null;
  const u = z.uebernahme;
  if (!u) {
    const jahrWahl = h('select', { id: 'uebernahme-jahr' }, frueher.map((j) => h('option', { value: j }, j)));
    const klassenWahl = () => h('select', { id: 'uebernahme-klasse' }, Object.keys(v.klassen[jahrWahl.value] ?? {}).sort(SCH.vergleicheKlassen).map((k) => h('option', { value: k }, k)));
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
    h('p', { class: 'klein' }, `Jede Lehrkraft bekommt einen eigenen Schlüssel in ihrem Ordner auf dem Lehrertauschlaufwerk und eine eigene Startdatei. Die Startdatei liegt auch in diesem Ordner (Mathekingdom/<Kürzel>/Mathekingdom-Lehrer.html). Mit Administratorrechten sieht eine Lehrkraft im Lehrer-Dashboard alle Klassen.`),
    kuerzel.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'lehrkraefte' },
      h('thead', {}, h('tr', {}, ['Kürzel', 'Klassen im Schuljahr ' + v.schuljahr, 'Administratorrechte', ''].map((t) => h('th', {}, t)))),
      h('tbody', {}, kuerzel.map((k) => h('tr', {}, h('td', {}, h('b', {}, k)),
        h('td', {}, SCH.klassenDerLehrkraft({ ...v, lehrkraefte: { [k]: { ...v.lehrkraefte[k], admin: false } } }, v.schuljahr, k).join(', ') || '–'),
        h('td', {}, h('input', { type: 'checkbox', 'data-admin': k, checked: Boolean(v.lehrkraefte[k].admin), onchange: tue(async (ev) => { v.lehrkraefte[k].admin = ev.target.checked; await speichereVerzeichnis(); }) })),
        h('td', {}, h('button', { class: 'schlicht', 'data-startdatei': k, onclick: () => ladeHerunter(`Mathekingdom-Lehrer-${k}.html`, lehrerStartdatei(k), 'text/html') }, 'Startdatei herunterladen'))))))),
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

// ---------- Rahmen ----------
const TABS = [['klassen', 'Schuljahre und Klassen'], ['lehrkraefte', 'Lehrkräfte'], ['startdateien', 'Startdateien'], ['alt', 'Alte Daten übernehmen']];
function hauptansicht() {
  const inhalt = { klassen: () => [schuljahrKarte(), klassenKarte(), z.klasse && namenKarte(), uebernahmeKarte()], lehrkraefte, startdateien, alt: altKarte }[z.tab];
  return h('div', {},
    h('nav', { class: 'tabs bereiche' }, TABS.map(([id, titel]) => h('button', { class: z.tab === id ? 'aktiv' : '', 'data-tab': id, onclick: () => { z.tab = id; z.hinweis = null; male(); } }, titel))),
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
