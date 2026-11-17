// Lehrer-Dashboard: Oberfläche. Die Auswertung steht in auswertung.js.
import stil from './stil.css';
import { h } from '../schueler/dom.js';
import * as L from '../schueler/logik.js';
import * as S from '../schueler/speicher.js';
import * as A from './auswertung.js';
import * as K from '../gemeinsam/krypto.js';
import { xlsx } from './xlsx.js';
import { beispielklasse } from './beispiel.js';
import { LINIENFARBE, stern } from '../schueler/bilder.js';

const LEHRERDATEN = 'lehrerdaten.json';
const CODE_DATEI = /^(\d{1,2}[A-Z]-[A-Z0-9]{4})\.json$/;
const BACKUP_ABSTAND = 60 * 60000;
const z = {
  lehrer: null, daten: null, klasse: null, ordner: null, pool: null, index: null,
  staende: [], unbekannt: [], warnungen: [], klassendateiText: null, aktualisiert: null, letztesBackup: null,
  ansicht: 'start', tab: 'live', schueler: null, fehler: null, backups: null, backupGewaehlt: null,
};
let wurzel, takt;

const jetzt = () => new Date().toISOString();
const uhr = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const kl = () => z.daten.klassen[z.klasse];
const name = (code) => kl().namen[code] ?? code;
const ziel = (code) => kl().einst.zielniveaus[code] ?? 'G';
const prozent = (x) => (x == null ? '–' : `${Math.round(x * 100)} %`);
const chip = (n) => h('span', { class: 'chip', style: `background:${LINIENFARBE[n]}`, title: L.NIVEAU_NAMEN[n] }, n);
const aufgabentext = (id) => z.index.aufgabe.get(id)?.text.replace(/\{\{\w+\}\}/g, '▢') ?? id;
// Ersetzt Lernziel-Kennungen in Hinweistexten durch etwas Lesbares, z. B. „Subtrahieren S2“.
const lesbar = (text) => text.replace(/\d+\.\d+\.\w+-\w+/g, (id) => { const l = A.lernzieleMitAufgaben(z.pool, z.index).find((x) => x.id === id); return l ? `„${l.station} ${id.split('-').pop()}“` : id; });
const lernzieltext = (id) => A.lernzieleMitAufgaben(z.pool, z.index).find((l) => l.id === id)?.text ?? id;

// ---------- Gemerkte Ordner ----------
const db = () => new Promise((ok, nein) => {
  const r = indexedDB.open('mathekingdom-lehrer', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('ordner');
  r.onsuccess = () => ok(r.result); r.onerror = () => nein(r.error);
});
async function merke(schluessel, handle) {
  try { const d = await db(); d.transaction('ordner', 'readwrite').objectStore('ordner').put(handle, schluessel); } catch { /* dann eben neu wählen */ }
}
async function erinnere(schluessel) {
  try {
    const d = await db();
    return await new Promise((ok) => { const r = d.transaction('ordner').objectStore('ordner').get(schluessel); r.onsuccess = () => ok(r.result ?? null); r.onerror = () => ok(null); });
  } catch { return null; }
}
async function erlaube(handle) {
  return (await handle.queryPermission({ mode: 'readwrite' })) === 'granted' || (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
}

// ---------- Dateien ----------
async function speichereDaten() { await z.lehrer.schreibe(LEHRERDATEN, JSON.stringify(z.daten, null, 1)); }
async function schreibeKlassendatei() {
  const e = kl().einst;
  const text = await K.unterschreibe({ klasse: z.klasse, stand: jetzt(), aktuellesKapitel: e.aktuellesKapitel, codes: Object.keys(kl().namen),
    zielniveaus: e.zielniveaus, spielpause: e.spielpause, hilfe: e.hilfe }, z.daten.schluessel.privat);
  await z.ordner.schreibe(S.KLASSENDATEI, text);
  z.klassendateiText = text;
}
// Änderungen werden nacheinander geschrieben, damit sich zwei schnelle Klicks nicht überholen.
let schlange = Promise.resolve();
function aendere(tun) {
  tun(kl());
  schlange = schlange.then(async () => { await speichereDaten(); await schreibeKlassendatei(); male(); })
    .catch((e) => { z.fehler = `Speichern fehlgeschlagen: ${e.message}`; male(); });
  return schlange;
}

async function oeffneLehrer(ablage) {
  z.lehrer = ablage;
  const text = await ablage.lies(LEHRERDATEN);
  z.daten = text ? JSON.parse(text) : { version: 1, schluessel: await K.erzeugeSchluessel(), klassen: {} };
  if (!text) await speichereDaten();
  z.ansicht = 'klassen'; z.fehler = null; male();
}

async function oeffneKlasse(klasse, ablage) {
  if (ablage.name.toLowerCase() !== klasse) { z.fehler = `Der gewählte Ordner heißt „${ablage.name}“. Für die Klasse ${klasse} muss er „${klasse}“ heißen.`; return male(); }
  const stufe = parseInt(klasse, 10);
  const pool = await ladePool(ablage, stufe);
  if (!pool) { z.fehler = `Für Klasse ${stufe} gibt es noch keinen Aufgabenpool.`; return male(); }
  z.daten.klassen[klasse] ??= { namen: {}, notizen: {}, einst: { aktuellesKapitel: null, spielpause: false, zielniveaus: {}, hilfe: {} } };
  Object.assign(z, { klasse, ordner: ablage, pool, index: L.indexiere(pool), ansicht: 'klasse', fehler: null, warnungen: [], klassendateiText: null, schueler: null,
    tab: Object.keys(z.daten.klassen[klasse].namen).length ? 'live' : 'klasse' });
  // Kopien für den Unterricht ohne Internet.
  await ablage.schreibe(`${S.SYSTEMORDNER}/klasse-${stufe}.json`, JSON.stringify(pool));
  if (window.MK_SCHUELER_JS) await ablage.schreibe(`${S.SYSTEMORDNER}/schueler-dashboard.js`, window.MK_SCHUELER_JS);
  await speichereDaten();
  await schreibeKlassendatei();
  await lade();
  clearInterval(takt);
  const frisch = async () => {
    const vorher = z.warnungen.length;
    await lade();
    const fokus = document.activeElement?.tagName;
    // Eine neue Warnung wird sofort gezeigt. Sonst nur neu zeichnen, wo es nicht beim Tippen stört.
    if (z.warnungen.length > vorher || (['live', 'diagnose'].includes(z.tab) && !['SELECT', 'INPUT', 'TEXTAREA'].includes(fokus))) male();
  };
  takt = setInterval(frisch, 5000);
  // Im Hintergrund bremst der Browser die Uhr: beim Zurückkehren sofort neu lesen.
  document.onvisibilitychange = () => { if (!document.hidden && z.ansicht === 'klasse') frisch(); };
  male();
}

// Der neueste Aufgabenpool: online, sonst der in dieser Datei mitgelieferte, zuletzt die Kopie im Klassenordner.
async function ladePool(ablage, stufe) {
  if (window.MK_BASIS && !ablage.demo) {
    try {
      const antwort = await fetch(`${window.MK_BASIS}aufgabenpool/klasse-${stufe}.json`, { cache: 'no-cache', signal: AbortSignal.timeout(4000) });
      if (antwort.ok) return await antwort.json();
    } catch { /* weiter mit der mitgelieferten Fassung */ }
  }
  if (window.MK_POOLS?.[stufe]) return window.MK_POOLS[stufe];
  try { return JSON.parse(await ablage.lies(`${S.SYSTEMORDNER}/klasse-${stufe}.json`)); } catch { return null; }
}

async function lade() {
  const staende = [], unbekannt = [];
  for (const datei of await z.ordner.liste()) {
    const m = datei.match(CODE_DATEI);
    if (!m) continue;
    const roh = await z.ordner.lies(datei).catch(() => null);
    let stand = null;
    try { stand = JSON.parse(roh); } catch { /* halb geschriebene Datei: beim nächsten Takt wieder */ }
    if (!stand?.versuche) continue;
    (kl().namen[m[1]] ? staende : unbekannt).push({ code: m[1], stand, roh });
  }
  staende.sort((a, b) => name(a.code).localeCompare(name(b.code), 'de'));
  Object.assign(z, { staende, unbekannt, aktualisiert: new Date() });

  // Wurde die Klassendatei von außen verändert, wird sie sofort wiederhergestellt.
  const liegt = await z.ordner.lies(S.KLASSENDATEI);
  if (z.klassendateiText && liegt !== z.klassendateiText) {
    z.warnungen.unshift(`${uhr(Date.now())} Uhr: Die Klassendatei wurde von außen verändert. Sie wurde wiederhergestellt.`);
    await schreibeKlassendatei();
  }
  // Antworten auf erledigte oder zurückgezogene Hilferufe entfernen.
  const hilfe = kl().einst.hilfe;
  let geaendert = false;
  for (const code of Object.keys(hilfe)) {
    const ruf = staende.find((s) => s.code === code)?.stand.hilferuf;
    if (!ruf || ruf.seit !== hilfe[code].zu) { delete hilfe[code]; geaendert = true; }
  }
  if (geaendert) { await speichereDaten(); await schreibeKlassendatei(); }
  if (!z.letztesBackup || Date.now() - z.letztesBackup > BACKUP_ABSTAND) await sichere().catch(() => {});
}

// ---------- Backup ----------
const backupOrdner = async () => (await (await z.lehrer.unterordner('backup')).unterordner(z.klasse));
async function sichere() {
  if (!z.staende.length) return;
  const d = new Date(), zwei = (n) => String(n).padStart(2, '0');
  const stempel = `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}_${zwei(d.getHours())}-${zwei(d.getMinutes())}`;
  const alle = await backupOrdner(), ziel = await alle.unterordner(stempel);
  for (const { code, roh } of [...z.staende, ...z.unbekannt]) await ziel.schreibe(`${code}.json`, roh);
  await ziel.schreibe(S.KLASSENDATEI, z.klassendateiText ?? '');
  await ziel.schreibe(LEHRERDATEN, JSON.stringify(z.daten));
  for (const alt of A.alteBackups(await alle.ordnernamen(), d)) await alle.entferne(alt);
  z.letztesBackup = Date.now();
  kl().letztesBackup = d.toISOString();
  await speichereDaten();
}
async function stelleWiederHer(stempel, code) {
  const quelle = await (await backupOrdner()).unterordner(stempel);
  const stand = JSON.parse(await quelle.lies(`${code}.json`));
  stand.geaendert = jetzt(); // damit ältere Sicherungen im Browser des Schülers nicht gewinnen
  await z.ordner.schreibe(`${code}.json`, JSON.stringify(stand));
  await lade();
  z.warnungen.unshift(`${uhr(Date.now())} Uhr: Speicherstand von ${name(code)} aus dem Backup ${stempel} wiederhergestellt.`);
  male();
}

// ---------- Herunterladen und Drucken ----------
function ladeHerunter(dateiname, inhalt, typ) {
  const url = URL.createObjectURL(new Blob([inhalt], { type: typ }));
  const a = h('a', { href: url, download: dateiname });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const heute = () => new Date().toLocaleDateString('sv-SE');
function exportiereExcel() {
  const blaetter = A.berichtstabellen(z.staende, z.pool, z.index, kl().einst.zielniveaus, name, jetzt());
  ladeHerunter(`Mathekingdom_${z.klasse}_${heute()}.xlsx`, xlsx(blaetter), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}
function drucke(...inhalt) {
  document.getElementById('mk-druck')?.remove();
  document.body.append(h('div', { id: 'mk-druck' }, inhalt));
  window.print();
}
function ladeStartdatei() {
  ladeHerunter('Mathekingdom.html', window.MK_STARTDATEI.replace('/*SCHLUESSEL*/null', JSON.stringify(z.daten.schluessel.oeffentlich)), 'text/html');
}

// ---------- Rahmen ----------
function male() {
  const ansichten = { start, klassen, klasse: klassenAnsicht };
  wurzel.replaceChildren(...[
    h('header', { class: 'kopf' }, h('strong', {}, 'Mathekingdom'), h('span', {}, 'Lehrer-Dashboard'),
      z.lehrer?.demo && h('span', { class: 'demo' }, 'Beispieldaten: nichts wird gespeichert'),
      z.ansicht === 'klasse' && h('button', { class: 'schlicht hell', onclick: () => { clearInterval(takt); z.ansicht = 'klassen'; male(); } }, 'Klasse wechseln')),
    z.fehler && h('div', { class: 'meldung fehler', role: 'alert' }, z.fehler),
    h('main', {}, ansichten[z.ansicht]()),
  ].filter(Boolean));
}

function start() {
  const knopf = h('button', { class: 'haupt', id: 'lehrerordner', onclick: async () => {
    try { const a = await S.waehleOrdner(); await merke('lehrer', a.handle); await oeffneLehrer(a); }
    catch (e) { if (e.name !== 'AbortError') { z.fehler = e.message; male(); } }
  } }, 'Ordner auf dem Lehrerlaufwerk wählen');
  const weiter = h('span', {});
  erinnere('lehrer').then((handle) => {
    if (handle) weiter.append(h('button', { class: 'haupt', id: 'weiter', onclick: async () => { if (await erlaube(handle)) oeffneLehrer(S.ordnerAblage(handle)); } }, `Weiter mit Ordner „${handle.name}“`));
  });
  return h('section', { class: 'karte schmal' },
    h('h1', {}, 'Willkommen'),
    h('p', {}, 'Wähle einen Ordner auf deinem Lehrerlaufwerk. Dort liegen die Namenslisten, dein Schlüssel für die Klassendateien und die Backups. Schüler dürfen auf diesen Ordner keinen Zugriff haben.'),
    S.kannOrdner() ? h('div', { class: 'reihe' }, weiter, knopf) : h('p', { class: 'fehlertext' }, 'Dieser Browser kann nicht in Ordnern speichern. Öffne die Datei bitte mit Edge oder Chrome.'),
    h('button', { class: 'schlicht', id: 'beispiel', onclick: starteBeispiel }, 'Mit einer Beispielklasse ausprobieren'));
}

async function starteBeispiel() {
  const lehrer = S.speicherAblage('lehrer'), ordner = S.speicherAblage('5a');
  await oeffneLehrer(lehrer);
  const pool = window.MK_POOLS[5], bsp = beispielklasse(pool, L.indexiere(pool));
  z.daten.klassen['5a'] = { namen: bsp.namen, notizen: {}, einst: { aktuellesKapitel: '5.4', spielpause: false, zielniveaus: bsp.zielniveaus, hilfe: {} } };
  for (const { code, stand } of bsp.staende) await ordner.schreibe(`${code}.json`, JSON.stringify(stand));
  await oeffneKlasse('5a', ordner);
}

function klassen() {
  const eingabe = h('input', { id: 'neue-klasse', type: 'text', placeholder: 'z. B. 5a', size: 6, maxLength: 3 });
  const oeffne = async (klasse) => {
    try {
      let handle = await erinnere(`klasse-${klasse}`);
      if (!handle || !(await erlaube(handle))) handle = (await S.waehleOrdner()).handle;
      await merke(`klasse-${klasse}`, handle);
      await oeffneKlasse(klasse, S.ordnerAblage(handle));
    } catch (e) { if (e.name !== 'AbortError') { z.fehler = e.message; male(); } }
  };
  const namen = Object.keys(z.daten.klassen).sort();
  return h('section', { class: 'karte schmal' },
    h('h1', {}, 'Deine Klassen'),
    namen.length ? h('ul', { class: 'klassenliste' }, namen.map((k) => h('li', {}, h('b', {}, k), h('span', {}, `${Object.keys(z.daten.klassen[k].namen).length} Schüler`),
      h('button', { class: 'haupt', onclick: () => oeffne(k) }, 'Öffnen')))) : h('p', {}, 'Noch keine Klasse eingerichtet.'),
    h('h2', {}, 'Neue Klasse einrichten'),
    h('p', { class: 'klein' }, 'Gib den Namen der Klasse ein und wähle danach ihren Ordner auf dem Klassenlaufwerk. Der Ordner muss genauso heißen wie die Klasse.'),
    h('div', { class: 'reihe' }, eingabe, h('button', { class: 'haupt', id: 'klasse-anlegen', onclick: () => {
      const k = eingabe.value.trim().toLowerCase();
      if (!/^\d{1,2}[a-z]$/.test(k)) { z.fehler = 'Ein Klassenname sieht so aus: 5a.'; return male(); }
      oeffne(k);
    } }, 'Klassenordner wählen')));
}

// ---------- Klasse ----------
function klassenAnsicht() {
  const e = kl().einst;
  const tabs = [['live', 'Live'], ['diagnose', 'Diagnose'], ['schueler', 'Einzelne Schüler'], ['klasse', 'Klasse und Codes'], ['sicherung', 'Backup']];
  const inhalte = { live, diagnose, schueler: einzel, klasse: verwaltung, sicherung };
  return h('div', {},
    h('div', { class: 'leiste' },
      h('h1', {}, `Klasse ${z.klasse}`),
      h('label', {}, 'Aktuelles Kapitel ', h('select', { id: 'kapitel', onchange: (ev) => aendere((k) => { k.einst.aktuellesKapitel = ev.target.value || null; }) },
        h('option', { value: '' }, 'Alle Kapitel offen'),
        z.pool.kapitel.map((k, i) => h('option', { value: k.id, selected: e.aktuellesKapitel === k.id }, `${i + 1} ${k.titel}`)))),
      h('label', { class: 'schalter' }, h('input', { id: 'spielpause', type: 'checkbox', checked: e.spielpause, onchange: (ev) => aendere((k) => { k.einst.spielpause = ev.target.checked; }) }), ' Spielpause erlaubt'),
      h('span', { class: 'klein', id: 'aktualisiert' }, z.aktualisiert ? `Aktualisiert um ${z.aktualisiert.toLocaleTimeString('de-DE')}` : ''),
      h('span', { class: 'rechts' },
        h('button', { class: 'schlicht', id: 'excel', onclick: exportiereExcel }, 'Excel-Datei'),
        h('button', { class: 'schlicht', id: 'pdf', onclick: () => drucke(klassenbericht()) }, 'Klassenbericht als PDF'))),
    z.warnungen.length > 0 && h('div', { class: 'meldung warnung' }, h('ul', {}, z.warnungen.slice(0, 4).map((w) => h('li', {}, w))),
      h('button', { class: 'schlicht', onclick: () => { z.warnungen = []; male(); } }, 'Gelesen')),
    h('nav', { class: 'tabs' }, tabs.map(([id, titel]) => h('button', { class: z.tab === id ? 'aktiv' : '', 'data-tab': id, onclick: () => { z.tab = id; male(); } }, titel))),
    inhalte[z.tab]());
}

// ---------- Live ----------
function live() {
  const hilfe = kl().einst.hilfe;
  // Als erledigt abgehakte Rufe verschwinden sofort, auch wenn der Speicherstand des Schülers erst gleich nachzieht.
  const erledigt = (code, seit) => hilfe[code]?.zu === seit && hilfe[code].status === 'erledigt';
  const schlange = A.warteschlange(z.staende, z.index, jetzt()).filter((r) => !erledigt(r.code, r.seit));
  const haengt = A.klasseHaengt(z.staende, z.index);
  const tag = heute();
  return h('div', {},
    h('section', { class: 'karte' },
      h('h2', {}, `Hilfe-Warteschlange (${schlange.length})`),
      schlange.length === 0 ? h('p', { class: 'klein' }, 'Gerade braucht niemand Hilfe.') : h('ol', { class: 'schlange' }, schlange.map((r) => {
        const unterwegs = hilfe[r.code]?.zu === r.seit && hilfe[r.code].status === 'unterwegs';
        return h('li', { class: unterwegs ? 'unterwegs' : '' },
          h('div', {}, h('b', {}, name(r.code)), h('span', { class: 'klein' }, ` wartet seit ${r.wartetMinuten} min`),
            r.gleiche > 1 && h('span', { class: 'marke warn' }, `${r.gleiche} Schüler beim selben Lernziel`)),
          h('div', { class: 'klein' }, aufgabentext(r.aufgabe)),
          h('div', { class: 'reihe' },
            !unterwegs && h('button', { class: 'haupt', 'data-komme': r.code, onclick: () => aendere((k) => { k.einst.hilfe[r.code] = { zu: r.seit, status: 'unterwegs' }; }) }, 'Ich komme'),
            h('button', { class: 'schlicht', 'data-erledigt': r.code, onclick: () => aendere((k) => { k.einst.hilfe[r.code] = { zu: r.seit, status: 'erledigt' }; }) }, 'Erledigt')));
      }))),
    haengt.map((x) => h('div', { class: 'meldung warnung' }, h('span', {}, h('b', {}, `${x.codes.length} Schüler kommen gerade nicht weiter: `), lernzieltext(x.lernziel),
      ` (${x.codes.map(name).join(', ')}). Das könnte eine Erklärung für alle wert sein.`))),
    z.unbekannt.length > 0 && h('div', { class: 'meldung warnung' }, `Im Klassenordner liegen Speicherstände mit Codes, die nicht in deiner Namensliste stehen: ${z.unbekannt.map((u) => u.code).join(', ')}.`),
    h('section', { class: 'karte' },
      h('h2', {}, 'Lernstand der Klasse'),
      z.staende.length === 0 ? h('p', { class: 'klein' }, 'Noch hat sich kein Schüler angemeldet.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Gerade', 'Linie', 'Sterne', 'Heute bearbeitet', 'Heute gelöst', 'Gesamt gelöst', 'Hinweise'].map((t) => h('th', {}, t)))),
        h('tbody', {}, z.staende.map(({ code, stand }) => {
          const k = A.kennzahlen(stand, ziel(code), jetzt());
          const heuteV = stand.versuche.filter((v) => new Date(v.t).toLocaleDateString('sv-SE') === tag);
          const auff = A.auffaelligkeiten(stand, ziel(code), jetzt());
          const maengel = A.pruefeStand(stand, ziel(code));
          const linien = [...new Set(Object.values(k.niveaus))];
          return h('tr', {},
            h('td', {}, h('button', { class: 'link', onclick: () => { z.schueler = code; z.tab = 'schueler'; male(); } }, name(code))),
            h('td', {}, stand.hilferuf && !erledigt(code, stand.hilferuf.seit) ? h('span', { class: 'marke warn' }, 'braucht Hilfe') : k.aktiveAufgabe ? h('span', { class: 'marke gut' }, 'arbeitet')
              : k.minutenStill != null && k.minutenStill < 3 ? 'aktiv' : k.minutenStill == null ? '–' : k.minutenStill < 90 ? `still seit ${k.minutenStill} min` : 'nicht da'),
            h('td', {}, (linien.length ? linien : [ziel(code)]).map(chip)),
            h('td', { class: 'zahl' }, k.sterne),
            h('td', { class: 'zahl' }, heuteV.length),
            h('td', { class: 'zahl' }, heuteV.filter((v) => v.richtig).length),
            h('td', { class: 'zahl' }, `${k.geloest} von ${k.bearbeitet}`),
            h('td', {}, auff.map((a) => h('span', { class: 'marke warn', title: lesbar(a.text) }, { inaktiv: 'still', raten: 'rät', training: 'zu leicht', 'ohne-erfolg': 'kommt nicht voran', hilfen: 'viele Hilfen' }[a.art])),
              maengel.length > 0 && h('span', { class: 'marke schlecht', title: maengel.join('; ') }, 'Datei verändert')));
        }))))));
}

// ---------- Diagnose ----------
function balken(wert) {
  return h('span', { class: 'balken', title: prozent(wert) }, h('i', { style: `width:${Math.round((wert ?? 0) * 100)}%` }), h('b', {}, prozent(wert)));
}
function matrixTabelle() {
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  const matrix = A.lernzielmatrix(z.staende, lernziele, kl().einst.zielniveaus);
  const stationen = [];
  for (const l of lernziele) { const s = stationen.at(-1); if (s?.id === l.unterkapitel) s.anzahl++; else stationen.push({ id: l.unterkapitel, titel: l.station, anzahl: 1 }); }
  return h('div', { class: 'rollbar' }, h('table', { class: 'tabelle matrix' },
    h('thead', {},
      h('tr', {}, h('th', {}, ''), stationen.map((s) => h('th', { colSpan: s.anzahl, class: 'gruppe' }, s.titel)), h('th', {}, '')),
      h('tr', {}, h('th', {}, 'Name'), lernziele.map((l) => h('th', { title: l.text, class: 'kurz' }, l.id.split('-').pop())), h('th', {}, 'Erreicht'))),
    h('tbody', {}, matrix.map((zeile) => h('tr', {}, h('td', {}, name(zeile.code)),
      zeile.zellen.map((c) => h('td', { class: `zelle ${c.status}`, title: `${lernzieltext(c.lernziel)}: ${c.status === 'erreicht' ? 'erreicht' : c.status === 'begonnen' ? `${c.bearbeitet} Aufgaben bearbeitet, Fortschritt ${c.fortschritt} von 3` : 'noch nicht begonnen'}` },
        c.status === 'erreicht' ? '★' : c.status === 'begonnen' ? `${c.fortschritt}/3` : '·')),
      h('td', { class: 'zahl' }, zeile.zellen.filter((c) => c.status === 'erreicht').length))))));
}
function diagnose() {
  if (z.staende.length === 0) return h('section', { class: 'karte' }, h('p', {}, 'Noch gibt es keine Daten. Sobald Schüler Aufgaben bearbeiten, erscheint hier die Auswertung.'));
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  const statistik = A.lernzielStatistik(z.staende, lernziele);
  const schwer = A.aufgabenStatistik(z.staende).filter((a) => a.quote < 0.6).slice(0, 10);
  const fehler = A.fehlerStatistik(z.staende);
  const auff = z.staende.flatMap(({ code, stand }) => [...A.auffaelligkeiten(stand, ziel(code), jetzt()), ...A.pruefeStand(stand, ziel(code)).map((text) => ({ art: 'datei', text }))].map((a) => ({ code, ...a })));
  const hilfen = z.staende.map(({ code, stand }) => ({ code, k: A.kennzahlen(stand, ziel(code), jetzt()) })).sort((a, b) => b.k.hilfekaertchen - a.k.hilfekaertchen);
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Auffälligkeiten'),
      auff.length === 0 ? h('p', { class: 'klein' }, 'Keine Auffälligkeiten.') : h('ul', { class: 'liste' }, auff.map((a) => h('li', {}, h('b', {}, name(a.code)), `: ${lesbar(a.text)}`)))),
    h('section', { class: 'karte' }, h('h2', {}, 'Lernzielmatrix'),
      h('p', { class: 'klein' }, '★ erreicht · 2/3 in Arbeit mit Fortschritt · Punkt: noch nicht begonnen. Fahre mit der Maus über eine Spalte, um das Lernziel zu lesen.'),
      matrixTabelle()),
    h('section', { class: 'karte' }, h('h2', {}, 'Lernziele im Vergleich'),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Lernziel', 'Schüler daran', 'Erreicht von', 'Aufgaben', 'Lösungsquote', 'Zeit pro Aufgabe', 'Mit Hilfekärtchen'].map((t) => h('th', {}, t)))),
        h('tbody', {}, statistik.map((s) => h('tr', {}, h('td', {}, h('span', { class: 'klein' }, s.station), h('br'), s.text), h('td', { class: 'zahl' }, s.schueler), h('td', { class: 'zahl' }, s.erreicht),
          h('td', { class: 'zahl' }, s.bearbeitet), h('td', {}, s.bearbeitet ? balken(s.quote) : '–'), h('td', { class: 'zahl' }, s.zeitMedian == null ? '–' : `${s.zeitMedian} s`), h('td', { class: 'zahl' }, prozent(s.hilfenAnteil)))))))),
    h('section', { class: 'karte' }, h('h2', {}, 'Typische Fehler'),
      fehler.length === 0 ? h('p', { class: 'klein' }, 'Noch keine typischen Fehler erkannt.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Fehlvorstellung', 'Wie oft', 'Wer'].map((t) => h('th', {}, t)))),
        h('tbody', {}, fehler.map((f) => h('tr', {}, h('td', {}, z.pool.fehlvorstellungen[f.fehlvorstellung]?.beschreibung ?? f.fehlvorstellung), h('td', { class: 'zahl' }, f.anzahl),
          h('td', {}, f.schueler.map((s) => `${name(s.code)} (${s.anzahl})`).join(', ')))))))),
    h('section', { class: 'karte' }, h('h2', {}, 'Aufgaben, an denen die Klasse hängt'),
      schwer.length === 0 ? h('p', { class: 'klein' }, 'Keine Aufgabe mit auffällig niedriger Lösungsquote.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Aufgabe', 'Linie', 'Bearbeitet', 'Lösungsquote', 'Zeit'].map((t) => h('th', {}, t)))),
        h('tbody', {}, schwer.map((a) => h('tr', {}, h('td', {}, aufgabentext(a.aufgabe)), h('td', {}, chip(a.niveau)), h('td', { class: 'zahl' }, `${a.bearbeitet}-mal von ${a.schueler} Schülern`), h('td', {}, balken(a.quote)), h('td', { class: 'zahl' }, `${a.zeitMedian} s`))))))),
    h('section', { class: 'karte' }, h('h2', {}, 'Hilfen'),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Tipp', 'Beispiel', 'Lösungsschritt', 'Hilferufe', 'Aufgaben'].map((t) => h('th', {}, t)))),
        h('tbody', {}, hilfen.map(({ code, k }) => h('tr', {}, h('td', {}, name(code)), h('td', { class: 'zahl' }, k.tipp), h('td', { class: 'zahl' }, k.beispiel), h('td', { class: 'zahl' }, k.loesungsschritt), h('td', { class: 'zahl' }, k.hilferufe), h('td', { class: 'zahl' }, k.bearbeitet))))))));
}

// ---------- Einzelne Schüler ----------
function einzelInhalt(code, fuerDruck = false) {
  const stand = z.staende.find((s) => s.code === code)?.stand;
  if (!stand) return h('p', {}, `${name(code)} hat sich noch nicht angemeldet.`);
  const k = A.kennzahlen(stand, ziel(code), jetzt());
  const auff = A.auffaelligkeiten(stand, ziel(code), jetzt(), !fuerDruck);
  const maengel = A.pruefeStand(stand, ziel(code));
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  const kachel = (titel, wert) => h('div', { class: 'kachel' }, h('span', {}, titel), h('b', {}, wert));
  const protokoll = fuerDruck ? stand.versuche.slice(-40) : [...stand.versuche].reverse();
  return h('div', {},
    h('div', { class: 'kacheln' }, kachel('Zielniveau', ziel(code)), kachel('Rang', k.rang), kachel('Sterne', k.sterne), kachel('Aufgaben', k.bearbeitet), kachel('Lösungsquote', prozent(k.quote)),
      kachel('Im ersten Versuch', prozent(k.ersterVersuch)), kachel('Zeit pro Aufgabe', k.zeitMedian == null ? '–' : `${k.zeitMedian} s`), kachel('Hilfekärtchen', k.hilfekaertchen), kachel('Hilferufe', k.hilferufe), kachel('Training', prozent(k.trainingAnteil))),
    (auff.length > 0 || maengel.length > 0) && h('ul', { class: 'liste' }, auff.map((a) => h('li', {}, lesbar(a.text))), maengel.map((m) => h('li', { class: 'fehlertext' }, `Speicherstand passt nicht zum Protokoll: ${m}`))),
    h('h3', {}, 'Niveauverlauf'),
    k.niveauverlauf.length ? h('p', { class: 'verlauf' }, k.niveauverlauf.map(chip)) : h('p', { class: 'klein' }, 'Noch keine Aufgaben.'),
    h('h3', {}, 'Lernziele'),
    h('table', { class: 'tabelle' }, h('tbody', {}, lernziele.map((l) => {
      const st = L.lernzielStand(stand, l.id, ziel(code));
      const n = stand.versuche.filter((v) => v.lernziel === l.id).length;
      return h('tr', {}, h('td', {}, stern(16, Boolean(stand.lernziele[l.id]))), h('td', {}, l.text),
        h('td', {}, stand.lernziele[l.id] ? 'erreicht' : n ? `${st.fortschritt} von 3, ${n} Aufgaben bearbeitet` : 'noch nicht begonnen'));
    }))),
    h('h3', {}, fuerDruck ? 'Versuchsprotokoll (letzte 40 Aufgaben)' : 'Versuchsprotokoll'),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Wann', 'Aufgabe', 'Linie', 'Gelöst', 'Versuche', 'Hilfekärtchen', 'Dauer', 'Erkannter Fehler'].map((t) => h('th', {}, t)))),
      h('tbody', {}, protokoll.map((v) => h('tr', {}, h('td', {}, new Date(v.t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })),
        h('td', {}, aufgabentext(v.aufgabe)), h('td', {}, chip(v.niveau)), h('td', {}, v.richtig ? 'ja' : 'nein'), h('td', { class: 'zahl' }, v.versuche), h('td', { class: 'zahl' }, v.hilfen),
        h('td', { class: 'zahl' }, `${v.dauer} s`), h('td', {}, (v.fehlvorstellungen ?? []).map((f) => z.pool.fehlvorstellungen[f]?.beschreibung ?? f).join(' ')))))))); 
}
function einzel() {
  const codes = Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
  const code = z.schueler && kl().namen[z.schueler] ? z.schueler : codes[0];
  if (!code) return h('section', { class: 'karte' }, h('p', {}, 'Lege zuerst unter „Klasse und Codes“ die Namensliste an.'));
  const notiz = h('textarea', { rows: 3, placeholder: 'Notiz, nur für dich', value: kl().notizen[code] ?? '',
    onchange: async (ev) => { kl().notizen[code] = ev.target.value; await speichereDaten(); } });
  return h('section', { class: 'karte' },
    h('div', { class: 'reihe' },
      h('label', {}, 'Schüler ', h('select', { id: 'schueler', onchange: (ev) => { z.schueler = ev.target.value; male(); } }, codes.map((c) => h('option', { value: c, selected: c === code }, name(c))))),
      h('span', { class: 'klein' }, code),
      h('button', { class: 'schlicht', id: 'einzelbericht', onclick: () => drucke(h('h1', {}, `${name(code)}, Klasse ${z.klasse}`), h('p', {}, `Stand: ${new Date().toLocaleDateString('de-DE')}`), einzelInhalt(code, true), kl().notizen[code] && h('p', {}, h('b', {}, 'Notiz: '), kl().notizen[code])) }, 'Einzelbericht als PDF')),
    einzelInhalt(code), h('h3', {}, 'Notiz'), notiz);
}
function klassenbericht() {
  const zeilen = A.berichtstabellen(z.staende, z.pool, z.index, kl().einst.zielniveaus, name, jetzt())[0].zeilen;
  const spalten = [0, 2, 4, 6, 7, 8, 10, 11, 12, 13];
  return h('div', {}, h('h1', {}, `Klassenbericht ${z.klasse}`), h('p', {}, `Stand: ${new Date().toLocaleString('de-DE')}`),
    h('table', { class: 'tabelle' }, h('thead', {}, h('tr', {}, spalten.map((i) => h('th', {}, zeilen[0][i])))), h('tbody', {}, zeilen.slice(1).map((r) => h('tr', {}, spalten.map((i) => h('td', {}, r[i])))))),
    h('h2', {}, 'Lernzielmatrix'), matrixTabelle(),
    h('ul', { class: 'klein' }, A.lernzieleMitAufgaben(z.pool, z.index).map((l) => h('li', {}, `${l.id.split('-').pop()} (${l.station}): ${l.text}`))));
}

// ---------- Klasse und Codes ----------
function verwaltung() {
  const liste = h('textarea', { id: 'namen', rows: 6, placeholder: 'Ein Name pro Zeile, zum Beispiel:\nLena Müller\nTim Schmidt' });
  const codes = Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Namensliste und Schülercodes'),
      h('p', { class: 'klein' }, 'Die Namen bleiben in deinem Ordner auf dem Lehrerlaufwerk. Im Klassenordner stehen nur die Codes.'),
      codes.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Schülercode', 'Zielniveau', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, name(c)), h('td', { class: 'code' }, c),
          h('td', {}, h('select', { 'data-ziel': c, onchange: (ev) => aendere((k) => { if (ev.target.value === 'G') delete k.einst.zielniveaus[c]; else k.einst.zielniveaus[c] = ev.target.value; }) },
            L.NIVEAUS.map((n) => h('option', { value: n, selected: ziel(c) === n }, `${n} · ${L.NIVEAU_NAMEN[n]}`)))),
          h('td', {}, h('button', { class: 'schlicht', onclick: () => { if (confirm(`${name(c)} aus der Namensliste entfernen? Der Speicherstand im Klassenordner bleibt liegen.`)) aendere((k) => { delete k.namen[c]; delete k.einst.zielniveaus[c]; }); } }, 'Entfernen'))))))),
      h('h3', {}, 'Schüler hinzufügen'), liste,
      h('div', { class: 'reihe' },
        h('button', { class: 'haupt', id: 'codes', onclick: () => aendere((k) => {
          for (const n of liste.value.split('\n').map((x) => x.trim()).filter(Boolean)) k.namen[A.erzeugeCode(z.klasse, Object.keys(k.namen))] = n;
        }) }, 'Codes erzeugen'),
        codes.length > 0 && h('button', { class: 'schlicht', id: 'kaertchen', onclick: () => drucke(h('div', { class: 'kaertchen' }, codes.map((c) => h('div', {}, h('small', {}, 'Mathekingdom · Dein Schülercode'), h('b', {}, c), h('span', {}, name(c)))))) }, 'Code-Kärtchen drucken'))),
    h('section', { class: 'karte' }, h('h2', {}, 'Startdatei für die Schüler'),
      h('p', {}, 'Diese Datei kommt einmal auf jedes Schülerlaufwerk. Sie enthält deinen öffentlichen Schlüssel: Damit erkennen die Schüler-Dashboards, ob die Klassendatei wirklich von dir stammt.'),
      h('button', { class: 'haupt', id: 'startdatei', onclick: ladeStartdatei }, 'Startdatei herunterladen')));
}

// ---------- Backup ----------
function sicherung() {
  if (z.backups === null) { backupOrdner().then((o) => o.ordnernamen()).then((n) => { z.backups = n.sort().reverse(); male(); }); return h('p', {}, 'Lade Backups …'); }
  const letztes = kl().letztesBackup;
  const alt = letztes && Date.now() - new Date(letztes) > 7 * 86400000;
  const gewaehlt = z.backupGewaehlt ?? z.backups[0];
  return h('section', { class: 'karte' }, h('h2', {}, 'Backup'),
    h('p', {}, 'Solange dieses Dashboard offen ist, werden alle Speicherstände, die Klassendatei und deine Lehrerdaten stündlich in den Ordner „backup“ auf deinem Lehrerlaufwerk kopiert.'),
    h('p', { class: alt ? 'fehlertext' : '' }, letztes ? `Letztes Backup: ${new Date(letztes).toLocaleString('de-DE')}${alt ? '. Das ist älter als eine Woche.' : ''}` : 'Es gibt noch kein Backup.'),
    h('button', { class: 'haupt', id: 'backup', onclick: async () => { await sichere(); z.backups = null; male(); } }, 'Jetzt sichern'),
    z.backups.length > 0 && h('div', {}, h('h3', {}, 'Einen Speicherstand wiederherstellen'),
      h('p', { class: 'klein' }, 'Der Speicherstand des Schülers im Klassenordner wird durch die gesicherte Fassung ersetzt. Der Schüler sollte dabei nicht angemeldet sein.'),
      h('div', { class: 'reihe' },
        h('label', {}, 'Backup vom ', h('select', { id: 'backup-wahl', onchange: (ev) => { z.backupGewaehlt = ev.target.value; } }, z.backups.map((b) => h('option', { value: b, selected: b === gewaehlt }, b.replace('_', ' um ').replace(/-(\d\d)$/, ':$1'))))),
        h('label', {}, 'Schüler ', h('select', { id: 'backup-schueler' }, Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de')).map((c) => h('option', { value: c }, name(c))))),
        h('button', { class: 'schlicht', id: 'wiederherstellen', onclick: async () => {
          const code = document.getElementById('backup-schueler').value, stempel = document.getElementById('backup-wahl').value;
          try { if (confirm(`Speicherstand von ${name(code)} auf das Backup ${stempel} zurücksetzen?`)) await stelleWiederHer(stempel, code); }
          catch { z.fehler = `In diesem Backup gibt es keinen Speicherstand von ${name(code)}.`; male(); }
        } }, 'Wiederherstellen'))));
}

// ---------- Start ----------
if (typeof document !== 'undefined') {
  wurzel = document.getElementById('mathekingdom-lehrer') ?? document.body.appendChild(h('div', { id: 'mathekingdom-lehrer' }));
  document.head.append(h('style', {}, stil));
  male();
}
