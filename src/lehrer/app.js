// Lehrer-Dashboard: Oberfläche. Die Auswertung steht in auswertung.js.
import stil from './stil.css';
import { h } from '../schueler/dom.js';
import * as L from '../schueler/logik.js';
import * as S from '../schueler/speicher.js';
import * as A from './auswertung.js';
import * as K from '../gemeinsam/krypto.js';
import { xlsx } from './xlsx.js';
import { beispielklasse } from './beispiel.js';
import { ROUTE_FARBE } from '../schueler/bilder.js';
import { versionsHinweis, VERSION_STIL } from '../gemeinsam/version.js';

const LEHRERDATEN = 'lehrerdaten.json';
const CODE_DATEI = /^(\d{1,2}[A-Z]-[A-Z0-9]{4})\.json$/;
const BACKUP_ABSTAND = 60 * 60000;
const z = {
  lehrer: null, daten: null, klasse: null, ordner: null, pool: null, index: null,
  staende: [], unbekannt: [], warnungen: [], klassendateiText: null, aktualisiert: null, letztesBackup: null,
  ansicht: 'start', tab: 'jetzt', ls: null, schueler: null, fehler: null, backups: null, backupGewaehlt: null,
  overlay: null, sitzplanOffen: false, sitzGewaehlt: null, gesehen: new Set(), pfadKapitel: null,
};
let wurzel, takt;

const jetzt = () => new Date().toISOString();
const uhr = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const kl = () => z.daten.klassen[z.klasse];
const name = (code) => kl().namen[code] ?? code;
const ziel = (code) => kl().einst.zielniveaus[code] ?? L.STANDARD_ZIELNIVEAU;
const prozent = (x) => (x == null ? '–' : `${Math.round(x * 100)} %`);
const chip = (n) => h('span', { class: 'chip', style: `background:${ROUTE_FARBE[n]}`, title: `${L.ROUTE_NAMEN[n]} · ${L.NIVEAU_NAMEN[n]}` }, n);
const aufgabentext = (id) => z.index.aufgabe.get(id)?.text.replace(/\{\{\w+\}\}/g, '▢') ?? id;
// Ersetzt Lernziel-Kennungen in Hinweistexten durch etwas Lesbares, z. B. „Subtrahieren S2“.
const lesbar = (text) => text.replace(/\d+\.\d+\.\w+-\w+/g, (id) => { const l = A.lernzieleMitAufgaben(z.pool, z.index).find((x) => x.id === id); return l ? `„${l.milestone} ${id.split('-').pop()}“` : id; });
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
// Jeder Schüler der Namensliste hat eine PIN. Der langsame Prüfwert wird einmal berechnet und bei den Lehrerdaten gemerkt.
async function sorgePins() {
  const pins = (kl().pins ??= {});
  let neu = false;
  for (const code of Object.keys(pins)) if (!kl().namen[code]) { delete pins[code]; neu = true; }
  for (const code of Object.keys(kl().namen)) {
    if (pins[code]?.wert) continue;
    const pin = K.neuePin();
    pins[code] = { pin, ...(await K.pinEintrag(pin)) };
    neu = true;
  }
  if (neu) await speichereDaten();
}
async function schreibeKlassendatei() {
  const e = kl().einst;
  await sorgePins();
  const pins = Object.fromEntries(Object.entries(kl().pins).map(([code, p]) => [code, { salz: p.salz, wert: p.wert }]));
  const text = await K.unterschreibe({ klasse: z.klasse, stand: jetzt(), aktuellesKapitel: e.aktuellesKapitel, codes: Object.keys(kl().namen),
    zielniveaus: e.zielniveaus, spielpause: e.spielpause, hilfe: e.hilfe, nachrichten: e.nachrichten, sperren: e.sperren, pins }, z.daten.schluessel.privat);
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
  // Kopie des gerade geladenen Dashboards für Tage ohne Internet (ADR 0011).
  if (window.MK_LEHRER_PAKET && !ablage.demo) await ablage.schreibe(`${S.SYSTEMORDNER}/lehrer-paket.js`, window.MK_LEHRER_PAKET).catch(() => {});
  z.ansicht = 'klassen'; z.fehler = null; male();
}

async function oeffneKlasse(klasse, ablage) {
  if (ablage.name.toLowerCase() !== klasse) { z.fehler = `Der gewählte Ordner heißt „${ablage.name}“. Für die Klasse ${klasse} muss er „${klasse}“ heißen.`; return male(); }
  const stufe = parseInt(klasse, 10);
  const pool = await ladePool(ablage, stufe);
  if (!pool) { z.fehler = `Für Klasse ${stufe} gibt es noch keinen Aufgabenpool.`; return male(); }
  z.daten.klassen[klasse] ??= { namen: {}, notizen: {}, einst: { aktuellesKapitel: null, spielpause: false, zielniveaus: {}, hilfe: {}, nachrichten: {}, sperren: {} } };
  const e = z.daten.klassen[klasse].einst;
  e.nachrichten ??= {}; e.sperren ??= {};
  Object.assign(z, { overlay: null, sitzplanOffen: false, sitzGewaehlt: null, gesehen: new Set(), pfadKapitel: null });
  Object.assign(z, { klasse, ordner: ablage, pool, index: L.indexiere(pool), ansicht: 'klasse', fehler: null, warnungen: [], klassendateiText: null, schueler: null, ls: { art: 'klasse' } });
  // Kopien für den Unterricht ohne Internet.
  await ablage.schreibe(`${S.SYSTEMORDNER}/klasse-${stufe}.json`, JSON.stringify(pool));
  if (window.MK_SCHUELER_JS) await ablage.schreibe(`${S.SYSTEMORDNER}/schueler-dashboard.js`, window.MK_SCHUELER_JS);
  await speichereDaten();
  await schreibeKlassendatei();
  await lade();
  // Im Unterricht zuerst der Raum, sonst der Lernstand. Ohne Namensliste die Verwaltung.
  z.tab = !Object.keys(kl().namen).length ? 'verwaltung' : A.jemandAktiv(z.staende, jetzt()) ? 'jetzt' : 'lernstand';
  clearInterval(takt);
  const frisch = async () => {
    const vorher = z.warnungen.length;
    await lade();
    const fokus = document.activeElement?.tagName;
    // Eine neue Warnung wird sofort gezeigt. Sonst nur neu zeichnen, wo es nicht beim Tippen stört.
    if (z.warnungen.length > vorher || (['jetzt', 'lernstand', 'aufgaben'].includes(z.tab) && !['SELECT', 'INPUT', 'TEXTAREA'].includes(fokus) && !document.querySelector('details.nachricht[open]'))) male();
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
  const gerollt = wurzel.querySelector('.overlay-inhalt')?.scrollTop;
  wurzel.replaceChildren(...[
    h('header', { class: 'kopf' }, h('strong', {}, 'Mathekingdom'), h('span', {}, 'Lehrer-Dashboard'),
      z.lehrer?.demo && h('span', { class: 'demo' }, 'Beispieldaten: nichts wird gespeichert'),
      z.ansicht === 'klasse' && h('button', { class: 'schlicht hell', onclick: () => { clearInterval(takt); z.ansicht = 'klassen'; male(); } }, 'Klasse wechseln')),
    z.fehler && h('div', { class: 'meldung fehler', role: 'alert' }, z.fehler),
    h('main', {}, ansichten[z.ansicht]()),
    z.ansicht === 'klasse' && z.overlay && kl().namen[z.overlay] && overlay(),
    versionsHinweis('lehrkraft'),
  ].filter(Boolean));
  if (gerollt) { const o = wurzel.querySelector('.overlay-inhalt'); if (o) o.scrollTop = gerollt; }
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
  z.daten.klassen['5a'] = { namen: bsp.namen, notizen: {}, einst: { aktuellesKapitel: '5.4', spielpause: false, zielniveaus: bsp.zielniveaus, hilfe: {}, nachrichten: {}, sperren: {} } };
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
// Vier Bereiche statt vieler Reiter (ADR 0010). Jeder Bereich geht beim Anklicken in die Tiefe.
const BEREICHE = [['jetzt', 'Jetzt'], ['lernstand', 'Lernstand'], ['aufgaben', 'Aufgaben'], ['verwaltung', 'Verwaltung']];
function klassenAnsicht() {
  const e = kl().einst;
  const inhalte = { jetzt: bereichJetzt, lernstand, aufgaben: aufgabenTab, verwaltung };
  return h('div', {},
    h('div', { class: 'leiste' },
      h('h1', {}, `Klasse ${z.klasse}`),
      h('label', {}, 'Aktuelles Kapitel ', h('select', { id: 'kapitel', onchange: (ev) => aendere((k) => { k.einst.aktuellesKapitel = ev.target.value || null; }) },
        h('option', { value: '' }, 'Alle Kapitel offen'),
        z.pool.kapitel.map((k, i) => h('option', { value: k.id, selected: e.aktuellesKapitel === k.id }, `${i + 1} ${k.titel}`)))),
      h('label', { class: 'schalter' }, h('input', { id: 'spielpause', type: 'checkbox', checked: e.spielpause, onchange: (ev) => aendere((k) => { k.einst.spielpause = ev.target.checked; }) }), ' Spielpause erlaubt'),
      h('span', { class: 'klein rechts', id: 'aktualisiert' }, z.aktualisiert ? `Aktualisiert um ${z.aktualisiert.toLocaleTimeString('de-DE')}` : '')),
    z.warnungen.length > 0 && h('div', { class: 'meldung warnung' }, h('ul', {}, z.warnungen.slice(0, 4).map((w) => h('li', {}, w))),
      h('button', { class: 'schlicht', onclick: () => { z.warnungen = []; male(); } }, 'Gelesen')),
    h('nav', { class: 'tabs bereiche' }, BEREICHE.map(([id, titel]) => h('button', { class: z.tab === id ? 'aktiv' : '', 'data-tab': id, onclick: () => { z.tab = id; if (id === 'lernstand') z.ls = { art: 'klasse' }; if (id === 'verwaltung') z.backups = null; male(); } }, titel))),
    inhalte[z.tab]());
}

// ---------- Jetzt: Klassenraum und Akut-Zone ----------
const STATUS = {
  hilfe: ['Hilferuf', '✋'], blockiert: ['Blockiert', '!'], beobachten: ['Beobachten', '?'], flow: ['Im Flow', '✓'],
  arbeitet: ['Arbeitet', '›'], inaktiv: ['Inaktiv', 'z'], fehlt: ['Nicht da', '–'],
};
// Als erledigt abgehakte Rufe verschwinden sofort, auch wenn der Speicherstand des Schülers erst gleich nachzieht.
const erledigt = (code, seit) => kl().einst.hilfe[code]?.zu === seit && kl().einst.hilfe[code].status === 'erledigt';
const alleCodes = () => Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
function statusAller() {
  const m = new Map();
  for (const code of alleCodes()) {
    const stand = z.staende.find((x) => x.code === code)?.stand ?? null;
    let st = A.livestatus(stand, ziel(code), jetzt());
    if (st.status === 'hilfe' && erledigt(code, st.seit)) st = { ...st, status: 'arbeitet', text: 'Hilfe erledigt' };
    m.set(code, { ...st, stand });
  }
  return m;
}

// Sitzplan: Reihenfolge der Plätze, zeilenweise. Liegt bei den Lehrerdaten.
function sitzplan() {
  const plan = (kl().sitzplan ??= { spalten: 6, plaetze: [] });
  plan.plaetze = plan.plaetze.map((c) => (c && kl().namen[c] ? c : null));
  for (const code of alleCodes()) {
    if (plan.plaetze.includes(code)) continue;
    const frei = plan.plaetze.indexOf(null);
    if (frei >= 0) plan.plaetze[frei] = code; else plan.plaetze.push(code);
  }
  return plan;
}
function sitzplanKarte(status) {
  const plan = sitzplan(), bearbeiten = z.sitzplanOffen;
  let plaetze = [...plan.plaetze];
  while (plaetze.length && plaetze.at(-1) === null) plaetze.pop();
  if (bearbeiten) { const voll = (Math.ceil(plaetze.length / plan.spalten) + 1) * plan.spalten; while (plaetze.length < voll) plaetze.push(null); }
  const tausche = async (i) => {
    if (z.sitzGewaehlt === null) { if (plaetze[i]) { z.sitzGewaehlt = i; male(); } return; }
    [plaetze[i], plaetze[z.sitzGewaehlt]] = [plaetze[z.sitzGewaehlt], plaetze[i]];
    plan.plaetze = plaetze; z.sitzGewaehlt = null;
    await speichereDaten(); male();
  };
  const zaehler = {};
  for (const st of status.values()) zaehler[st.status] = (zaehler[st.status] ?? 0) + 1;
  return h('section', { class: 'karte' },
    h('div', { class: 'reihe' }, h('h2', {}, 'Klassenraum'),
      h('span', { class: 'legende' }, Object.entries(STATUS).filter(([id]) => zaehler[id]).map(([id, [titel, zeichen]]) => h('span', { class: `punkt ${id}` }, h('i', {}, zeichen), `${zaehler[id]} ${titel}`))),
      h('span', { class: 'rechts reihe' },
        bearbeiten && h('label', {}, 'Plätze pro Reihe ', h('select', { id: 'spalten', onchange: async (ev) => { plan.spalten = Number(ev.target.value); await speichereDaten(); male(); } },
          [3, 4, 5, 6, 7, 8].map((n) => h('option', { value: n, selected: n === plan.spalten }, n)))),
        h('button', { class: 'schlicht', id: 'sitzplan-bearbeiten', onclick: () => { z.sitzplanOffen = !bearbeiten; z.sitzGewaehlt = null; male(); } }, bearbeiten ? 'Fertig' : 'Sitzplan ändern'))),
    bearbeiten && h('p', { class: 'klein' }, 'Tippe erst auf einen Schüler und dann auf den Platz, an dem er sitzt. Die beiden Plätze werden getauscht.'),
    h('div', { class: `sitzplan ${bearbeiten ? 'bearbeiten' : ''}`, style: `grid-template-columns: repeat(${plan.spalten}, minmax(0, 1fr))` }, plaetze.map((code, i) => {
      if (!code) return bearbeiten ? h('button', { class: 'platz leer', 'data-platz': i, 'aria-label': 'Leerer Platz', onclick: () => tausche(i) }) : h('span', { class: 'platz leer' });
      const st = status.get(code), [titel, zeichen] = STATUS[st.status];
      const linien = [...new Set(Object.values(st.stand?.niveau ?? {}))];
      return h('button', { class: `platz ${st.status}${z.sitzGewaehlt === i ? ' gewaehlt' : ''}`, 'data-platz': i, 'data-schueler': code, title: `${titel}: ${st.text}`,
        onclick: () => { if (bearbeiten) tausche(i); else { z.overlay = code; male(); } } },
        h('span', { class: 'zeichen', 'aria-hidden': 'true' }, zeichen), h('b', {}, name(code)), h('span', { class: 'was' }, st.text),
        h('span', { class: 'unten' }, (linien.length ? linien : [ziel(code)]).map(chip), st.stand ? `Siegel ${L.siegel(st.stand)}` : ''));
    })));
}

function nachrichtFeld(code) {
  const sende = (text) => { if (text.trim()) aendere((k) => { k.einst.nachrichten[code] = { t: jetzt(), text: text.trim().slice(0, 200) }; }); };
  const eingabe = h('input', { type: 'text', placeholder: 'Eigene Nachricht', maxLength: 200, 'data-nachricht': code });
  const letzte = kl().einst.nachrichten[code];
  const gelesen = letzte && z.staende.find((x) => x.code === code)?.stand.gelesen === letzte.t;
  return h('details', { class: 'nachricht' }, h('summary', {}, 'Nachricht senden', letzte && h('span', { class: `marke ${gelesen ? 'gut' : 'warn'}` }, gelesen ? 'gelesen' : 'gesendet, noch nicht gelesen')),
    letzte && h('p', { class: 'klein' }, `Zuletzt um ${uhr(letzte.t)} Uhr: „${letzte.text}“`),
    h('div', { class: 'reihe' }, ['Schau dir das Beispiel-Kärtchen an.', 'Lies die Aufgabe noch einmal genau.', 'Komm bitte zu mir nach vorn.'].map((t) => h('button', { class: 'schlicht', onclick: () => sende(t) }, t))),
    h('div', { class: 'reihe' }, eingabe, h('button', { class: 'haupt', 'data-sende': code, onclick: () => sende(eingabe.value) }, 'Senden')));
}

function akutZone(status) {
  const hilfe = kl().einst.hilfe;
  const akut = [...status].filter(([code, st]) => st.status === 'hilfe' || (st.status === 'blockiert' && !z.gesehen.has(`${code}|${st.seit}`)))
    .sort(([, a], [, b]) => (a.status === b.status ? (a.seit < b.seit ? -1 : 1) : a.status === 'hilfe' ? -1 : 1));
  return h('section', { class: 'karte' },
    h('h2', {}, `Akut-Zone (${akut.length})`),
    akut.length === 0 ? h('p', { class: 'klein' }, 'Gerade braucht niemand Hilfe.') : h('ol', { class: 'schlange' }, akut.map(([code, st]) => {
      const ruf = st.status === 'hilfe';
      const unterwegs = ruf && hilfe[code]?.zu === st.seit && hilfe[code].status === 'unterwegs';
      const lz = z.index.aufgabe.get(st.aufgabe)?.lernziel;
      const helfer = A.lernbegleiter(z.staende, lz, kl().einst.zielniveaus, jetzt(), code);
      return h('li', { class: `${ruf ? 'ruf' : 'blockiert'}${unterwegs ? ' unterwegs' : ''}` },
        h('div', {}, h('button', { class: 'link', onclick: () => { z.overlay = code; male(); } }, name(code)),
          h('span', { class: `marke ${ruf ? 'warn' : 'schlecht'}` }, ruf ? `Hilferuf seit ${st.minuten} min` : st.text)),
        st.aufgabe && h('div', {}, aufgabentext(st.aufgabe)),
        st.kontext && h('div', { class: 'klein' }, st.kontext),
        helfer.length > 0 && h('div', { class: 'klein' }, `Könnte helfen: ${helfer.map(name).join(', ')}`),
        h('div', { class: 'reihe' },
          ruf && !unterwegs && h('button', { class: 'haupt', 'data-komme': code, onclick: () => aendere((k) => { k.einst.hilfe[code] = { zu: st.seit, status: 'unterwegs' }; }) }, 'Ich komme'),
          ruf && h('button', { class: 'schlicht', 'data-erledigt': code, onclick: () => aendere((k) => { k.einst.hilfe[code] = { zu: st.seit, status: 'erledigt' }; }) }, 'Erledigt'),
          !ruf && h('button', { class: 'schlicht', 'data-kuemmere': code, onclick: () => { z.gesehen.add(`${code}|${st.seit}`); male(); } }, 'Ich kümmere mich')),
        nachrichtFeld(code));
    })));
}

function impulse() {
  const gesehen = (schluessel) => h('button', { class: 'schlicht', onclick: () => { z.gesehen.add(schluessel); male(); } }, 'Gesehen');
  const karten = [];
  for (const x of A.klasseHaengt(z.staende, z.index)) {
    if (z.gesehen.has(`lz|${x.lernziel}`)) continue;
    karten.push(h('li', {}, h('span', {}, h('b', {}, 'Mini-Workshop: '), `${x.codes.length} Schüler kommen hier gerade nicht weiter: ${lernzieltext(x.lernziel)} (${x.codes.map(name).join(', ')})`), gesehen(`lz|${x.lernziel}`)));
  }
  for (const x of A.fehlerHaeufung(z.staende, jetzt())) {
    if (z.gesehen.has(`fv|${x.fehlvorstellung}`)) continue;
    karten.push(h('li', {}, h('span', {}, h('b', {}, 'Mini-Workshop: '), `${x.codes.length} Schüler machen denselben Fehler. ${z.pool.fehlvorstellungen[x.fehlvorstellung]?.beschreibung ?? x.fehlvorstellung} (${x.codes.map(name).join(', ')})`), gesehen(`fv|${x.fehlvorstellung}`)));
  }
  for (const x of A.schnelllaeufer(z.staende, z.pool, z.index, kl().einst.zielniveaus, jetzt())) {
    const schluessel = `fertig|${x.code}|${x.milestone}|${x.zielniveau}`;
    if (z.gesehen.has(schluessel)) continue;
    karten.push(h('li', { class: 'gut' }, h('span', {}, h('b', {}, 'Schnellläufer: '), `${name(x.code)} hat den Meilenstein „${x.titel}“ auf Zielniveau ${x.zielniveau} gemeistert. `,
      x.naechstes ? '' : 'Zeit für eine Knobelaufgabe oder für die Rolle als Lernbegleiter.'),
      x.naechstes && h('button', { class: 'haupt', 'data-anheben': x.code, onclick: () => aendere((k) => { k.einst.zielniveaus[x.code] = x.naechstes; }) }, `Zielniveau auf ${x.naechstes} anheben`),
      gesehen(schluessel)));
  }
  return karten.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Impulse'), h('ul', { class: 'impulse' }, karten));
}

function bereichJetzt() {
  const status = statusAller();
  return h('div', {},
    akutZone(status),
    impulse(),
    alleCodes().length > 0 ? sitzplanKarte(status) : h('section', { class: 'karte' }, h('p', {}, 'Lege zuerst unter „Verwaltung“ die Namensliste an.')),
    z.unbekannt.length > 0 && h('div', { class: 'meldung warnung' }, `Im Klassenordner liegen Speicherstände mit Codes, die nicht in deiner Namensliste stehen: ${z.unbekannt.map((u) => u.code).join(', ')}.`));
}

function zielWahl(code) {
  return h('select', { 'data-ziel': code, 'aria-label': 'Zielniveau', onchange: (ev) => aendere((k) => { if (ev.target.value === L.STANDARD_ZIELNIVEAU) delete k.einst.zielniveaus[code]; else k.einst.zielniveaus[code] = ev.target.value; }) },
    L.NIVEAUS.map((n) => h('option', { value: n, selected: ziel(code) === n }, `${n} · ${L.NIVEAU_NAMEN[n]}`)));
}
function druckeEinzelbericht(code) {
  drucke(h('h1', {}, `${name(code)}, Klasse ${z.klasse}`), h('p', {}, `Diagnosebericht, Stand ${new Date().toLocaleDateString('de-DE')}`), einzelInhalt(code, true),
    kl().notizen[code] && h('p', {}, h('b', {}, 'Notiz: '), kl().notizen[code]));
}
// Detailansicht über dem Klassenraum: Der Sitzplan bleibt dahinter stehen.
function overlay() {
  const code = z.overlay;
  const zu = () => { z.overlay = null; male(); };
  return h('div', { class: 'overlay', onclick: (ev) => { if (ev.target.classList.contains('overlay')) zu(); } },
    h('div', { class: 'overlay-inhalt', role: 'dialog', 'aria-modal': 'true', 'aria-label': name(code) },
      h('div', { class: 'reihe overlay-kopf' }, h('h2', {}, name(code)), h('span', { class: 'klein' }, code), h('label', {}, 'Zielniveau ', zielWahl(code)),
        h('span', { class: 'rechts reihe' }, h('button', { class: 'schlicht', onclick: () => druckeEinzelbericht(code) }, 'Diagnosebericht als PDF'),
          h('button', { class: 'haupt', id: 'overlay-zu', onclick: zu }, 'Schließen'))),
      nachrichtFeld(code),
      einzelInhalt(code)));
}

// ---------- Meilensteine öffnen und sperren ----------
function meilensteineSperren() {
  const hatAufgaben = (u) => u.lernziele.some((l) => z.index.lernzielMitAufgaben.has(l.id));
  const kapitel = z.pool.kapitel.filter((k) => k.unterkapitel.some(hatAufgaben));
  const kap = kapitel.find((k) => k.id === (z.pfadKapitel ?? kl().einst.aktuellesKapitel)) ?? kapitel[0];
  const codes = alleCodes();
  if (!kap || codes.length === 0) return null;
  const meilensteine = kap.unterkapitel.filter(hatAufgaben);
  const sperren = kl().einst.sperren;
  const zu = (st, code) => Boolean(sperren[st]?.includes(code));
  const setze = (st, wen, gesperrt) => aendere((k) => {
    const menge = new Set(k.einst.sperren[st] ?? []);
    for (const c of wen) { if (gesperrt) menge.add(c); else menge.delete(c); }
    if (menge.size) k.einst.sperren[st] = [...menge]; else delete k.einst.sperren[st];
  });
  const massenwahl = (st) => h('select', { 'data-masse': st.id, 'aria-label': `Aktion für ${st.titel}`, onchange: (ev) => {
    const [was, gruppe] = ev.target.value.split('|');
    if (was) setze(st.id, gruppe === 'alle' ? codes : codes.filter((c) => ziel(c) === gruppe), was === 'zu');
  } }, h('option', { value: '' }, 'Für mehrere …'), h('option', { value: 'auf|alle' }, 'Für alle öffnen'), h('option', { value: 'zu|alle' }, 'Für alle sperren'),
    L.NIVEAUS.flatMap((n) => [h('option', { value: `zu|${n}` }, `Für Zielniveau ${n} sperren`), h('option', { value: `auf|${n}` }, `Für Zielniveau ${n} öffnen`)]));
  return h('details', { class: 'karte aufklapp', open: Boolean(z.sperrenOffen), ontoggle: (ev) => { z.sperrenOffen = ev.target.open; } },
    h('summary', {}, h('h2', {}, 'Meilensteine öffnen und sperren')),
    h('div', { class: 'reihe' },
      kapitel.length > 1 && h('label', {}, 'Kapitel ', h('select', { id: 'pfad-kapitel', onchange: (ev) => { z.pfadKapitel = ev.target.value; male(); } }, kapitel.map((k) => h('option', { value: k.id, selected: k.id === kap.id }, k.titel))))),
    h('p', { class: 'klein' }, 'Einen gesperrten Meilenstein sieht der Schüler auf seiner Regionskarte mit Schloss und kann dort keine Aufgaben starten. „Gemeistert“ setzt das Dashboard selbst, sobald alle Lernziele des Meilensteins erreicht sind.'),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle pfad' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Name'), h('th', {}, 'Ziel'), meilensteine.map((st) => h('th', {}, st.titel, h('br'), massenwahl(st))))),
      h('tbody', {}, codes.map((code) => {
        const stand = z.staende.find((x) => x.code === code)?.stand;
        return h('tr', {}, h('td', {}, name(code)), h('td', {}, chip(ziel(code))), meilensteine.map((st) => {
          const gesperrt = zu(st.id, code);
          const status = stand ? L.milestoneStatus(z.index, stand, st) : 'offen';
          return h('td', {}, h('button', { class: `sperre ${gesperrt ? 'zu' : status}`, 'data-sperre': `${st.id}|${code}`, 'aria-pressed': String(gesperrt), onclick: () => setze(st.id, [code], !gesperrt) },
            gesperrt ? '🔒 gesperrt' : status === 'gemeistert' ? '✓ gemeistert' : status === 'begonnen' ? 'offen, begonnen' : 'offen'));
        }));
      })))));
}

// ---------- Diagnose ----------
function balken(wert) {
  return h('span', { class: 'balken', title: prozent(wert) }, h('i', { style: `width:${Math.round((wert ?? 0) * 100)}%` }), h('b', {}, prozent(wert)));
}
// ---------- Lernstand: Klasse, darunter Lernziel, darunter Schüler ----------
// Vier Zustände je Lernziel und Schüler, jeder mit eigenem Zeichen, damit die Farbe nie allein trägt.
const ZUSTAND = {
  siegel: ['Siegel', '✓'], wackelig: ['Wackelig', '!'], begonnen: ['Begonnen', '…'], offen: ['Nicht begonnen', '·'],
};
const ZUSTAND_TEXT = {
  siegel: 'Lernziel erreicht', wackelig: 'begonnen, aber viele Fehlversuche oder Lösungsschritt-Kärtchen', begonnen: 'begonnen', offen: 'noch nicht begonnen',
};
const zustandLegende = () => h('ul', { class: 'zlegende', 'aria-label': 'Zeichenerklärung' },
  Object.entries(ZUSTAND).map(([id, [titel, zeichen]]) => h('li', {}, h('i', { class: `zelle ${id}` }, zeichen), titel)));
const gehe = (ls) => { z.ls = ls; male(); window.scrollTo?.(0, 0); };
const lernziel = (id) => A.lernzieleMitAufgaben(z.pool, z.index).find((l) => l.id === id);
const kurzname = (l) => `${l.milestone} ${l.id.split('-').pop()}`;
const angemeldet = () => alleCodes().map((code) => ({ code, stand: z.staende.find((x) => x.code === code)?.stand })).filter((x) => x.stand);

function lernstand() {
  if (alleCodes().length === 0) return h('section', { class: 'karte' }, h('p', {}, 'Lege zuerst unter „Verwaltung“ die Namensliste an.'));
  const ls = (z.ls ??= { art: 'klasse' });
  const pfad = ls.art !== 'klasse' && h('nav', { class: 'brotkrumen', 'aria-label': 'Ebene' },
    h('button', { class: ls.art === 'klasse' ? 'aktiv' : 'link', onclick: () => gehe({ art: 'klasse' }) }, `Klasse ${z.klasse}`),
    ls.art === 'lernziel' && [h('span', {}, '›'), h('span', { class: 'aktiv' }, kurzname(lernziel(ls.id)))],
    ls.art === 'schueler' && [h('span', {}, '›'), h('span', { class: 'aktiv' }, name(ls.code))]);
  const inhalt = ls.art === 'lernziel' && lernziel(ls.id) ? lernstandLernziel(ls.id) : ls.art === 'schueler' && kl().namen[ls.code] ? lernstandSchueler(ls.code) : lernstandKlasse();
  return h('div', {}, pfad, inhalt);
}

// Kennzahl: groß der Wert, darunter in Worten, was er bedeutet.
const kennzahl = (wert, titel, zusatz) => h('div', { class: 'kennzahl' }, h('b', {}, wert), h('span', {}, titel), zusatz && h('small', {}, zusatz));

// Welche Kapitel Heatmap und Balken zeigen: gewählt, sonst alle, in denen die Klasse schon gearbeitet hat.
function lernstandKapitel(staende) {
  const alle = A.lernzieleMitAufgaben(z.pool, z.index);
  const mitDaten = [...new Set(alle.filter((l) => staende.some(({ stand }) => stand.versuche.some((v) => v.lernziel === l.id))).map((l) => l.kapitel))];
  const kapitel = [...new Set(alle.map((l) => l.kapitel))];
  const wahl = z.lsKapitel ?? (mitDaten.length ? 'daten' : 'alle');
  const zeige = wahl === 'alle' ? kapitel : wahl === 'daten' ? mitDaten : [wahl];
  const auswahl = h('label', { class: 'klein' }, 'Zeige ', h('select', { id: 'ls-kapitel', onchange: (ev) => { z.lsKapitel = ev.target.value; male(); } },
    mitDaten.length > 0 && h('option', { value: 'daten', selected: wahl === 'daten' }, 'Kapitel, in denen gearbeitet wurde'),
    h('option', { value: 'alle', selected: wahl === 'alle' }, 'Alle Kapitel'),
    kapitel.map((id) => h('option', { value: id, selected: wahl === id }, z.pool.kapitel.find((k) => k.id === id)?.titel ?? id))));
  return { lernziele: alle.filter((l) => zeige.includes(l.kapitel)), auswahl };
}

function lernstandKlasse() {
  const alleZiele = A.lernzieleMitAufgaben(z.pool, z.index);
  const staende = angemeldet();
  const codes = alleCodes();
  if (staende.length === 0) return h('section', { class: 'karte' }, h('p', {}, 'Noch hat sich kein Schüler angemeldet. Sobald Schüler Aufgaben bearbeiten, erscheint hier der Lernstand.'), meilensteineSperren());
  const zellen = A.lernzielmatrix(staende, alleZiele, kl().einst.zielniveaus).flatMap((m) => m.zellen);
  const { lernziele, auswahl } = lernstandKapitel(staende);
  const matrix = A.lernzielmatrix(staende, lernziele, kl().einst.zielniveaus);
  const versuche = staende.flatMap(({ stand }) => stand.versuche);
  const heuteAktiv = staende.filter(({ stand }) => stand.versuche.some((v) => new Date(v.t).toLocaleDateString('sv-SE') === heute())).length;
  const fehlen = codes.filter((c) => !staende.some((x) => x.code === c));
  const auff = staende.flatMap(({ code, stand }) => [...A.auffaelligkeiten(stand, ziel(code), jetzt()), ...A.pruefeStand(stand, ziel(code)).map((text) => ({ art: 'datei', text }))].map((a) => ({ code, ...a })));
  return h('div', {},
    h('section', { class: 'kennzahlen' },
      kennzahl(zellen.filter((c) => c.status === 'siegel').length, 'Siegel in der Klasse', `von ${zellen.length} möglichen`),
      kennzahl(zellen.filter((c) => c.status === 'wackelig').length, 'wackelige Lernziele', 'genauer hinschauen'),
      kennzahl(prozent(versuche.length ? versuche.filter((v) => v.richtig).length / versuche.length : null), 'Lösungsquote', `${versuche.length} Aufgaben`),
      kennzahl(`${heuteAktiv} von ${codes.length}`, 'heute aktiv', fehlen.length ? `${fehlen.length} noch nie angemeldet` : null)),
    h('section', { class: 'karte' },
      h('div', { class: 'reihe' }, h('h2', {}, 'Wer steht wo?'), auswahl, h('span', { class: 'rechts' }, zustandLegende())),
      h('p', { class: 'klein' }, 'Eine Zeile pro Schüler, eine Spalte pro Lernziel. Tippe auf einen Namen, um den Schüler zu öffnen, oder auf ein Lernziel, um zu sehen, woran die Klasse dort hängt.'),
      heatmap(matrix, lernziele, true),
      fehlen.length > 0 && h('p', { class: 'klein' }, `Noch nicht angemeldet: ${fehlen.map(name).join(', ')}.`)),
    h('section', { class: 'karte' },
      h('h2', {}, 'Lernziele im Vergleich'),
      h('p', { class: 'klein' }, 'Wie viele Schüler bei jedem Lernziel wo stehen. Tippe auf eine Zeile für die Einzelheiten.'),
      lernzielBalken(matrix, lernziele)),
    h('details', { class: 'karte aufklapp' }, h('summary', {}, h('h2', {}, `Auffälligkeiten (${auff.length})`)),
      auff.length === 0 ? h('p', { class: 'klein' }, 'Keine Auffälligkeiten.') : h('ul', { class: 'liste' }, auff.map((a) => h('li', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: a.code }) }, name(a.code)), `: ${lesbar(a.text)}`)))),
    meilensteineSperren());
}

// Heatmap Schüler × Lernziel, nach Meilensteinen gruppiert.
function heatmap(matrix, lernziele, klickbar) {
  const gruppen = [];
  for (const l of lernziele) { const g = gruppen.at(-1); if (g?.id === l.unterkapitel) g.anzahl++; else gruppen.push({ id: l.unterkapitel, titel: l.milestone, anzahl: 1 }); }
  const zeilen = [...matrix].sort((a, b) => name(a.code).localeCompare(name(b.code), 'de'));
  const kopf = (l) => (klickbar ? h('button', { class: 'spalte', 'data-lernziel': l.id, title: l.text, onclick: () => gehe({ art: 'lernziel', id: l.id }) }, l.id.split('-').pop()) : l.id.split('-').pop());
  return h('div', { class: 'rollbar' }, h('table', { class: 'heatmap' },
    h('thead', {},
      h('tr', {}, h('th', {}, ''), gruppen.map((g) => h('th', { colSpan: g.anzahl, class: 'gruppe' }, g.titel)), h('th', {}, '')),
      h('tr', {}, h('th', { class: 'name' }, 'Name'), lernziele.map((l) => h('th', { class: 'kurz' }, kopf(l))), h('th', { class: 'summe' }, 'Siegel'))),
    h('tbody', {}, zeilen.map((zeile) => h('tr', {},
      h('th', { class: 'name', scope: 'row' }, klickbar ? h('button', { class: 'link', 'data-schueler-zeile': zeile.code, onclick: () => gehe({ art: 'schueler', code: zeile.code }) }, name(zeile.code)) : name(zeile.code)),
      zeile.zellen.map((c, i) => h('td', { class: `zelle ${c.status}`, title: `${name(zeile.code)} · ${lernziele[i].text}: ${ZUSTAND_TEXT[c.status]}${c.bearbeitet ? ` (${c.bearbeitet} Aufgaben, Fortschritt ${c.fortschritt} von 3)` : ''}` }, ZUSTAND[c.status][1])),
      h('td', { class: 'summe' }, zeile.zellen.filter((c) => c.status === 'siegel').length))))));
}

// Gestapelte Balken je Lernziel: Siegel, begonnen, wackelig, nicht begonnen.
function lernzielBalken(matrix, lernziele) {
  const reihenfolge = ['siegel', 'begonnen', 'wackelig', 'offen'];
  return h('ul', { class: 'stapel' }, lernziele.map((l, i) => {
    const anzahl = Object.fromEntries(reihenfolge.map((s) => [s, matrix.filter((m) => m.zellen[i].status === s).length]));
    const gesamt = matrix.length || 1;
    return h('li', {}, h('button', { class: 'stapelzeile', 'data-lernziel-balken': l.id, onclick: () => gehe({ art: 'lernziel', id: l.id }) },
      h('span', { class: 'stapelname' }, h('small', {}, kurzname(l)), l.text),
      h('span', { class: 'stapelbalken', role: 'img', 'aria-label': reihenfolge.map((s) => `${anzahl[s]} ${ZUSTAND[s][0]}`).join(', ') },
        reihenfolge.filter((s) => anzahl[s]).map((s) => h('i', { class: `teil zelle ${s}`, style: `flex-grow:${anzahl[s] / gesamt}`, title: `${ZUSTAND[s][0]}: ${anzahl[s]}` }, anzahl[s] / gesamt >= 0.12 ? anzahl[s] : ''))),
      h('span', { class: 'stapelzahl' }, `${anzahl.siegel}/${matrix.length}`)));
  }));
}

// Einfache waagerechte Balken für eine Größe (eine Farbe, Wert daneben in Textfarbe).
function balkenListe(eintraege, { max = null, format = (x) => x } = {}) {
  const groesste = max ?? Math.max(1, ...eintraege.map((e) => e.wert));
  return h('ul', { class: 'balkenliste' }, eintraege.map((e) => h('li', {},
    h('span', { class: 'bname' }, e.name),
    h('span', { class: 'bspur' }, h('i', { style: `width:${Math.max(2, Math.round((e.wert / groesste) * 100))}%` })),
    h('span', { class: 'bwert' }, format(e.wert), e.zusatz && h('small', {}, ` ${e.zusatz}`)))));
}

function lernstandLernziel(id) {
  const l = lernziel(id);
  const staende = angemeldet();
  const v = staende.flatMap(({ stand }) => stand.versuche.filter((x) => x.lernziel === id));
  const st = A.lernzielStatistik(staende, [l])[0];
  const gruppen = { siegel: [], wackelig: [], begonnen: [], offen: [] };
  for (const { code, stand } of staende) gruppen[A.lernzielZustand(stand, id)].push(code);
  const fehler = A.fehlerZuLernziel(staende, id).slice(0, 6);
  const nachStrasse = L.NIVEAUS.map((n) => { const x = v.filter((y) => y.niveau === n); return { n, bearbeitet: x.length, quote: x.length ? x.filter((y) => y.richtig).length / x.length : 0 }; }).filter((x) => x.bearbeitet);
  const audit = A.aufgabenAudit(staende, z.index, 2).filter((a) => a.lernziel === id).slice(0, 5);
  return h('div', {},
    h('section', { class: 'karte' }, h('p', { class: 'klein' }, `Meilenstein ${l.milestone}`), h('h2', {}, l.text)),
    h('section', { class: 'kennzahlen' },
      kennzahl(`${st.erreicht} von ${staende.length}`, 'mit Siegel'),
      kennzahl(prozent(st.quote), 'Lösungsquote', `${st.bearbeitet} Aufgaben`),
      kennzahl(st.zeitMedian == null ? '–' : `${st.zeitMedian} s`, 'Zeit pro Aufgabe', 'Median'),
      kennzahl(prozent(st.hilfenAnteil), 'mit Hilfekärtchen')),
    h('section', { class: 'karte' }, h('div', { class: 'reihe' }, h('h2', {}, 'Wer steht wo?'), h('span', { class: 'rechts' }, zustandLegende())),
      h('div', { class: 'vierspaltig' }, Object.entries(gruppen).map(([s, liste]) => h('div', { class: `gruppenliste ${s}` },
        h('h3', {}, h('i', { class: `zelle ${s}` }, ZUSTAND[s][1]), `${ZUSTAND[s][0]} (${liste.length})`),
        liste.length ? h('ul', {}, liste.map((c) => h('li', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: c }) }, name(c))))) : h('p', { class: 'klein' }, 'niemand'))))),
    h('div', { class: 'zweispaltig' },
      h('section', { class: 'karte' }, h('h2', {}, 'Häufigste typische Fehler'),
        fehler.length === 0 ? h('p', { class: 'klein' }, 'Noch keine typischen Fehler erkannt.')
          : balkenListe(fehler.map((f) => ({ name: z.pool.fehlvorstellungen[f.fehlvorstellung]?.beschreibung ?? f.fehlvorstellung, wert: f.anzahl, zusatz: `· ${f.schueler.length} Schüler` })), { format: (x) => `${x}-mal` })),
      h('section', { class: 'karte' }, h('h2', {}, 'Lösungsquote nach Straße'),
        nachStrasse.length === 0 ? h('p', { class: 'klein' }, 'Noch keine Aufgaben bearbeitet.')
          : balkenListe(nachStrasse.map((x) => ({ name: [chip(x.n), ` ${L.ROUTE_NAMEN[x.n]}`], wert: x.quote, zusatz: `· ${x.bearbeitet} Aufgaben` })), { max: 1, format: prozent }))),
    audit.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Schwierigste Aufgaben zu diesem Lernziel'),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Aufgabe', 'Straße', 'AFB', 'Bearbeitet', 'Lösungsquote', 'Häufigste falsche Antwort'].map((t) => h('th', {}, t)))),
        h('tbody', {}, audit.map((a) => h('tr', {}, h('td', {}, aufgabentext(a.aufgabe), a.auffaellig && h('span', { class: 'marke schlecht' }, 'Prüfen')), h('td', {}, a.niveau && chip(a.niveau)),
          h('td', { class: 'zahl' }, ['', 'I', 'II', 'III'][a.afb] ?? ''), h('td', { class: 'zahl' }, a.bearbeitet), h('td', {}, balken(a.quote)),
          h('td', {}, a.haeufigsteFalsche ? `${a.haeufigsteFalsche} (${a.haeufigsteAnzahl}-mal)` : '–'))))))));
}

function lernstandSchueler(code) {
  const notiz = h('textarea', { rows: 3, placeholder: 'Notiz, nur für dich', value: kl().notizen[code] ?? '',
    onchange: async (ev) => { kl().notizen[code] = ev.target.value; await speichereDaten(); } });
  return h('div', {},
    h('section', { class: 'karte' },
      h('div', { class: 'reihe' },
        h('label', {}, 'Schüler ', h('select', { id: 'schueler', onchange: (ev) => gehe({ art: 'schueler', code: ev.target.value }) }, alleCodes().map((c) => h('option', { value: c, selected: c === code }, name(c))))),
        h('span', { class: 'klein' }, code),
        h('label', {}, 'Zielniveau ', zielWahl(code)),
        h('span', { class: 'rechts reihe' }, h('button', { class: 'schlicht', id: 'einzelbericht', onclick: () => druckeEinzelbericht(code) }, 'Diagnosebericht als PDF'))),
      nachrichtFeld(code)),
    einzelInhalt(code),
    h('section', { class: 'karte' }, h('h2', {}, 'Notiz'), notiz));
}

// ---------- Aufgaben: Auswertung nach AFB, Aufgabentyp, Straße und je Aufgabe ----------
function aufgabenTab() {
  if (z.staende.length === 0) return h('section', { class: 'karte' }, h('p', {}, 'Noch gibt es keine Daten. Sobald Schüler Aufgaben bearbeiten, erscheint hier die Auswertung.'));
  const u = A.aufgabenUebersicht(z.staende, z.pool, z.index);
  const f = (z.aufg ??= { sicht: 'schwierig', milestone: '', afb: '', format: '', niveau: '', alle: false });
  const setze = (feld) => (e) => { f[feld] = e.target.value; f.alle = false; male(); };
  const wahl = (feld, id, leer, optionen) => h('label', {}, h('span', { class: 'klein' }, leer[0]),
    h('select', { id, onchange: setze(feld) }, leer[1] && h('option', { value: '' }, leer[1]), optionen.map(([wert, text]) => h('option', { value: wert, selected: String(f[feld]) === String(wert) }, text))));
  const gruppenTabelle = (titel, erste, liste, zeige = (g) => g.name) => h('section', { class: 'karte' }, h('h2', {}, titel),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle gruppen' },
      h('thead', {}, h('tr', {}, [erste, 'Aufgaben im Pool', 'davon bearbeitet', 'Bearbeitungen', 'Lösungsquote', 'Im ersten Versuch', 'Abgebrochen', 'Zeit pro Aufgabe'].map((t) => h('th', {}, t)))),
      h('tbody', {}, liste.map((g) => h('tr', {}, h('td', {}, zeige(g)), h('td', { class: 'zahl' }, g.imPool), h('td', { class: 'zahl' }, g.genutzt), h('td', { class: 'zahl' }, g.bearbeitet),
        h('td', {}, g.bearbeitet ? balken(g.quote) : '–'), h('td', { class: 'zahl' }, prozent(g.ersterVersuch)), h('td', { class: 'zahl' }, g.abbrueche || '–'),
        h('td', { class: 'zahl' }, g.zeitMedian == null ? '–' : `${g.zeitMedian} s`)))))));
  const meilensteine = [...new Map(u.aufgaben.filter((a) => a.milestone).map((a) => [a.milestone.id, a.milestone.titel]))];
  const liste = A.aufgabenSicht(u.aufgaben, f.sicht, f);
  const sichtbar = f.alle ? liste : liste.slice(0, 20);
  const zahl = (sicht) => A.aufgabenSicht(u.aufgaben, sicht).length;
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Auf einen Blick'),
      h('div', { class: 'kacheln' },
        [['Aufgaben bearbeitet', `${u.aufgaben.filter((a) => a.bearbeitet > 0).length} von ${u.aufgaben.length}`],
          ['Bearbeitet, aber nie gelöst', zahl('nieGeloest')], ['Nie bearbeitet, obwohl angeboten', zahl('nie')],
          ['Zum Prüfen markiert', u.aufgaben.filter((a) => a.auffaellig).length]].map(([t, w]) => h('div', { class: 'kachel' }, h('b', {}, w), h('span', {}, t))))),
    gruppenTabelle('Nach Anforderungsbereich', 'AFB', u.afb),
    gruppenTabelle('Nach Aufgabentyp', 'Aufgabentyp', u.format),
    gruppenTabelle('Nach Straße', 'Straße', u.niveau, (g) => [chip(g.wert), ` ${L.ROUTE_NAMEN[g.wert]} · ${L.NIVEAU_NAMEN[g.wert]}`]),
    h('section', { class: 'karte' }, h('h2', {}, 'Einzelne Aufgaben'),
      h('div', { class: 'filter' },
        wahl('sicht', 'aufg-sicht', ['Zeige', null], Object.entries(A.AUFGABEN_SICHTEN).map(([id, x]) => [id, x.titel])),
        wahl('milestone', 'aufg-meilenstein', ['Meilenstein', 'Alle Meilensteine'], meilensteine),
        wahl('afb', 'aufg-afb', ['AFB', 'Alle'], Object.entries(A.AFB_NAMEN)),
        wahl('format', 'aufg-format', ['Aufgabentyp', 'Alle'], u.format.map((g) => [g.wert, g.name])),
        wahl('niveau', 'aufg-niveau', ['Straße', 'Alle'], L.NIVEAUS.map((n) => [n, `${n} ${L.ROUTE_NAMEN[n]}`]))),
      f.sicht === 'nie' && h('p', { class: 'klein' }, 'Gezeigt werden nur Aufgaben aus Lernzielen und Straßen, an denen die Klasse schon gearbeitet hat. Sie hätten also drankommen können.'),
      liste.length === 0 ? h('p', { class: 'klein', id: 'aufg-leer' }, 'Keine Aufgabe passt zu dieser Auswahl.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'aufg-liste' },
        h('thead', {}, h('tr', {}, ['Aufgabe', 'Meilenstein', 'Straße', 'AFB', 'Typ', 'Bearbeitet', 'Gelöst', 'Lösungsquote', 'Im ersten Versuch', 'Abgebrochen', 'Zeit', 'Häufigste falsche Antwort'].map((t) => h('th', {}, t)))),
        h('tbody', {}, sichtbar.map((a) => h('tr', { 'data-aufgabe': a.aufgabe }, h('td', {}, aufgabentext(a.aufgabe), a.auffaellig && h('span', { class: 'marke schlecht' }, 'Prüfen')),
          h('td', {}, a.milestone?.titel ?? ''), h('td', {}, chip(a.niveau)), h('td', { class: 'zahl' }, ['', 'I', 'II', 'III'][a.afb] ?? ''), h('td', {}, A.FORMAT_NAMEN[a.format] ?? a.format),
          h('td', { class: 'zahl' }, a.bearbeitet), h('td', { class: 'zahl' }, a.geloest), h('td', {}, a.bearbeitet ? balken(a.quote) : '–'), h('td', { class: 'zahl' }, prozent(a.ersterVersuch)),
          h('td', { class: 'zahl' }, a.abbrueche || '–'), h('td', { class: 'zahl' }, a.zeitMedian == null ? '–' : `${a.zeitMedian} s`),
          h('td', {}, a.haeufigsteFalsche ? `${a.haeufigsteFalsche} (${a.haeufigsteAnzahl}-mal)` : '–')))))),
      liste.length > sichtbar.length && h('button', { class: 'schlicht', id: 'aufg-alle', onclick: () => { f.alle = true; male(); } }, `Alle ${liste.length} Aufgaben zeigen`)));
}

// ---------- Seite eines Schülers ----------
// Oben drei Kennzahlen, darunter der Weg über die Lernziele, dann Balken und Fehler. Das Protokoll ist zugeklappt.
function einzelInhalt(code, fuerDruck = false) {
  const stand = z.staende.find((s) => s.code === code)?.stand;
  if (!stand) return h('section', { class: 'karte' }, h('p', {}, `${name(code)} hat sich noch nicht angemeldet.`));
  const k = A.kennzahlen(stand, ziel(code), jetzt());
  const auff = A.auffaelligkeiten(stand, ziel(code), jetzt(), !fuerDruck);
  const maengel = A.pruefeStand(stand, ziel(code));
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  const protokoll = [...stand.versuche].reverse();
  const afb = A.afbProfil(stand, z.index), wirkung = A.hilfenWirkung(stand), fehler = A.fehlerVon(stand).slice(0, fuerDruck ? 4 : 8);
  const zuletzt = k.minutenStill == null ? 'noch nie' : k.minutenStill < 2 ? 'gerade eben' : k.minutenStill < 60 ? `vor ${k.minutenStill} min` : new Date(k.letzteAktivitaet).toLocaleDateString('de-DE');
  const gruppen = [];
  for (const l of lernziele) { const g = gruppen.at(-1); if (g?.id === l.unterkapitel) g.ziele.push(l); else gruppen.push({ id: l.unterkapitel, titel: l.milestone, ziele: [l] }); }
  const quote = (x) => ({ wert: x.quote ?? 0, zusatz: `· ${x.bearbeitet} Aufgaben` });
  return h('div', { class: 'schuelerseite' },
    h('section', { class: 'kennzahlen' },
      kennzahl(`${k.siegel} von ${lernziele.length}`, 'Siegel', k.rang),
      kennzahl(ziel(code), 'Zielniveau', L.NIVEAU_NAMEN[ziel(code)]),
      kennzahl(zuletzt, 'zuletzt aktiv')),
    h('p', { class: 'klein nebenwerte' }, `${k.bearbeitet} Aufgaben · ${prozent(k.quote)} gelöst · ${prozent(k.ersterVersuch)} im ersten Versuch · ${k.hilfekaertchen} Hilfekärtchen · ${k.hilferufe} Hilferufe · ${prozent(k.trainingAnteil)} Training`),
    (auff.length > 0 || maengel.length > 0) && h('ul', { class: 'liste hinweise' }, auff.map((a) => h('li', {}, lesbar(a.text))), maengel.map((m) => h('li', { class: 'fehlertext' }, `Speicherstand passt nicht zum Protokoll: ${m}`))),
    h('section', { class: 'karte' }, h('div', { class: 'reihe' }, h('h2', {}, 'Weg über die Lernziele'), h('span', { class: 'rechts' }, zustandLegende())),
      h('div', { class: 'weg' }, gruppen.map((g) => h('div', { class: 'weggruppe' }, h('small', {}, g.titel),
        h('div', { class: 'wegzellen' }, g.ziele.map((l) => {
          const s = A.lernzielZustand(stand, l.id);
          const titel = `${l.text}: ${ZUSTAND_TEXT[s]}`;
          return fuerDruck ? h('i', { class: `zelle ${s}`, title: titel }, ZUSTAND[s][1])
            : h('button', { class: `zelle ${s}`, title: titel, 'aria-label': titel, onclick: () => gehe({ art: 'lernziel', id: l.id }) }, ZUSTAND[s][1]);
        })))))),
    h('div', { class: 'zweispaltig' },
      h('section', { class: 'karte' }, h('h2', {}, 'Lösungsquote nach Anforderungsbereich'),
        balkenListe([{ name: 'AFB I · Reproduzieren', ...quote(afb[1]) }, { name: 'AFB II · Zusammenhänge', ...quote(afb[2]) }, { name: 'AFB III · Verallgemeinern', ...quote(afb[3]) }], { max: 1, format: prozent })),
      h('section', { class: 'karte' }, h('h2', {}, 'Wirkung der Hilfekärtchen'),
        balkenListe([{ name: 'ohne Hilfekärtchen', ...quote(wirkung.ohne) }, { name: 'mit Hilfekärtchen', ...quote(wirkung.mit) }, { name: 'im ersten Versuch', wert: k.ersterVersuch ?? 0, zusatz: `· ${k.bearbeitet} Aufgaben` }], { max: 1, format: prozent }))),
    h('div', { class: 'zweispaltig' },
      h('section', { class: 'karte' }, h('h2', {}, 'Typische Fehler'),
        fehler.length ? balkenListe(fehler.map((f) => ({ name: z.pool.fehlvorstellungen[f.fehlvorstellung]?.beschreibung ?? f.fehlvorstellung, wert: f.anzahl })), { format: (x) => `${x}-mal` })
          : h('p', { class: 'klein' }, 'Noch keine typischen Fehler erkannt.')),
      h('section', { class: 'karte' }, h('h2', {}, 'Straßen der letzten Aufgaben'),
        k.niveauverlauf.length ? h('p', { class: 'verlauf' }, k.niveauverlauf.slice(-40).map(chip)) : h('p', { class: 'klein' }, 'Noch keine Aufgaben.'),
        h('p', { class: 'klein' }, 'Links die älteren, rechts die neuesten Aufgaben.'))),
    !fuerDruck && h('details', { class: 'karte aufklapp' }, h('summary', {}, h('h2', {}, `Versuchsprotokoll (${protokoll.length})`)),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Wann', 'Aufgabe', 'Straße', 'Gelöst', 'Versuche', 'Hilfekärtchen', 'Dauer', 'Erkannter Fehler'].map((t) => h('th', {}, t)))),
        h('tbody', {}, protokoll.map((v) => h('tr', {}, h('td', {}, new Date(v.t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })),
          h('td', {}, aufgabentext(v.aufgabe)), h('td', {}, chip(v.niveau)), h('td', {}, v.richtig ? 'ja' : 'nein'), h('td', { class: 'zahl' }, v.versuche), h('td', { class: 'zahl' }, v.hilfen),
          h('td', { class: 'zahl' }, `${v.dauer} s`), h('td', {}, (v.fehlvorstellungen ?? []).map((f) => z.pool.fehlvorstellungen[f]?.beschreibung ?? f).join(' ')))))))));
}
function klassenbericht() {
  const zeilen = A.berichtstabellen(z.staende, z.pool, z.index, kl().einst.zielniveaus, name, jetzt())[0].zeilen;
  const spalten = [0, 2, 4, 6, 7, 8, 10, 11, 12, 13];
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  return h('div', {}, h('h1', {}, `Klassenbericht ${z.klasse}`), h('p', {}, `Stand: ${new Date().toLocaleString('de-DE')}`),
    h('table', { class: 'tabelle' }, h('thead', {}, h('tr', {}, spalten.map((i) => h('th', {}, zeilen[0][i])))), h('tbody', {}, zeilen.slice(1).map((r) => h('tr', {}, spalten.map((i) => h('td', {}, r[i])))))),
    h('h2', {}, 'Lernstand'), zustandLegende(), heatmap(A.lernzielmatrix(z.staende, lernziele, kl().einst.zielniveaus), lernziele, false),
    h('ul', { class: 'klein' }, lernziele.map((l) => h('li', {}, `${l.id.split('-').pop()} (${l.milestone}): ${l.text}`))));
}

// ---------- Verwaltung: Klasse und Codes, Berichte, Backup ----------
function verwaltung() {
  const liste = h('textarea', { id: 'namen', rows: 6, placeholder: 'Ein Name pro Zeile, zum Beispiel:\nLena Müller\nTim Schmidt' });
  const codes = Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Namensliste und Schülercodes'),
      h('p', { class: 'klein' }, 'Die Namen und PINs bleiben in deinem Ordner auf dem Lehrerlaufwerk. Im Klassenordner stehen nur die Codes und zu jeder PIN ein Prüfwert.'),
      codes.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Schülercode', 'PIN', 'Zielniveau', '', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, name(c)), h('td', { class: 'code' }, c), h('td', { class: 'code pin' }, kl().pins?.[c]?.pin ?? '…'),
          h('td', {}, zielWahl(c)),
          h('td', {}, h('button', { class: 'schlicht', 'data-neue-pin': c, onclick: () => { if (confirm(`Neue PIN für ${name(c)} vergeben? Die alte gilt dann nicht mehr.`)) aendere((k) => { delete k.pins[c]; }); } }, 'Neue PIN')),
          h('td', {}, h('button', { class: 'schlicht', onclick: () => { if (confirm(`${name(c)} aus der Namensliste entfernen? Der Speicherstand im Klassenordner bleibt liegen.`)) aendere((k) => { delete k.namen[c]; delete k.einst.zielniveaus[c]; }); } }, 'Entfernen'))))))),
      h('h3', {}, 'Schüler hinzufügen'), liste,
      h('div', { class: 'reihe' },
        h('button', { class: 'haupt', id: 'codes', onclick: () => aendere((k) => {
          for (const n of liste.value.split('\n').map((x) => x.trim()).filter(Boolean)) k.namen[A.erzeugeCode(z.klasse, Object.keys(k.namen))] = n;
        }) }, 'Codes erzeugen'),
        codes.length > 0 && h('button', { class: 'schlicht', id: 'kaertchen', onclick: () => drucke(h('div', { class: 'kaertchen' }, codes.map((c) => h('div', {}, h('small', {}, 'Mathekingdom · Dein Schülercode'), h('b', {}, c), h('small', {}, 'Deine PIN'), h('b', { class: 'pin' }, kl().pins?.[c]?.pin ?? ''), h('span', {}, name(c)))))) }, 'Code-Kärtchen drucken'))),
    h('section', { class: 'karte' }, h('h2', {}, 'Startdatei für die Schüler'),
      h('p', {}, 'Diese Datei kommt einmal auf jedes Schülerlaufwerk. Sie enthält deinen öffentlichen Schlüssel: Damit erkennen die Schüler-Dashboards, ob die Klassendatei wirklich von dir stammt.'),
      h('button', { class: 'haupt', id: 'startdatei', onclick: ladeStartdatei }, 'Startdatei herunterladen')),
    h('section', { class: 'karte' }, h('h2', {}, 'Berichte'),
      h('p', { class: 'klein' }, 'Den Diagnosebericht eines einzelnen Schülers findest du auf seiner Seite im Lernstand.'),
      h('div', { class: 'reihe' },
        h('button', { class: 'schlicht', id: 'excel', onclick: exportiereExcel }, 'Rohdaten als Excel-Datei'),
        h('button', { class: 'schlicht', id: 'pdf', onclick: () => drucke(klassenbericht()) }, 'Klassenbericht als PDF'))),
    sicherung());
}

// ---------- Backup ----------
function sicherung() {
  if (z.backups === null) {
    // Nur diesen Teil nachzeichnen, damit angefangene Eingaben in der Verwaltung stehen bleiben.
    const platz = h('section', { class: 'karte' }, h('p', {}, 'Lade Backups …'));
    backupOrdner().then((o) => o.ordnernamen()).then((n) => { z.backups = n.sort().reverse(); if (platz.isConnected) platz.replaceWith(sicherung()); });
    return platz;
  }
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
  document.head.append(h('style', {}, stil + VERSION_STIL));
  // Kam das Dashboard als Kopie vom Lehrerlaufwerk, ist der Ordner schon gewählt.
  if (window.MK_LEHRER_ORDNER) merke('lehrer', window.MK_LEHRER_ORDNER).then(() => oeffneLehrer(S.ordnerAblage(window.MK_LEHRER_ORDNER)))
    .catch((e) => { z.fehler = e.message; male(); });
  else male();
}
