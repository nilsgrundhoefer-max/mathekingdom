// Lehrer-Dashboard: Oberfläche. Die Auswertung steht in auswertung.js.
import stil from './stil.css';
import { h, s as svg } from '../schueler/dom.js';
import * as L from '../schueler/logik.js';
import * as S from '../schueler/speicher.js';
import * as A from './auswertung.js';
import * as K from '../gemeinsam/krypto.js';
import { xlsx } from './xlsx.js';
import { beispielklasse } from './beispiel.js';
import { NIVEAU_FARBE } from '../schueler/bilder.js';
import { versionsHinweis, versionstext, VERSION_STIL } from '../gemeinsam/version.js';
import * as P from '../gemeinsam/protokoll.js';
import * as B from '../gemeinsam/backup.js';
import * as M from '../gemeinsam/meldungen.js';
import * as SCH from '../gemeinsam/schule.js';
import { gemerkteOrdner, erlaube } from '../gemeinsam/gemerkt.js';

const LEHRERDATEN = 'lehrerdaten.json';
const CODE_DATEI = /^(\d{1,2}[A-Z]-[A-Z0-9]{4})\.json$/;
const BACKUP_ABSTAND = 60 * 60000;
const z = {
  lehrer: null, daten: null, klasse: null, ordner: null, pool: null, index: null,
  staende: [], unbekannt: [], warnungen: [], klassendateiText: null, aktualisiert: null, letztesBackup: null,
  ansicht: 'start', tab: 'jetzt', ls: null, schueler: null, fehler: null, backups: null, backupGewaehlt: null,
  overlay: null, sitzplanOffen: false, sitzGewaehlt: null, gesehen: new Set(), pfadKapitel: null,
  // Mit Schulverzeichnis (ADR 0024): { schueler, lehrer, kuerzel, verzeichnis, schuljahr }. Ohne: alte Lehrerdaten in einer Datei.
  schule: null, klasseText: null, alleCodes: [], andereOffen: [], wahl: null,
};
let wurzel, takt;

const jetzt = () => new Date().toISOString();
const uhr = (d) => new Date(d).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
const kl = () => z.daten.klassen[z.klasse];
const name = (code) => kl().namen[code] ?? code;
const ziel = (code) => kl().einst.zielniveaus[code] ?? L.STANDARD_ZIELNIVEAU;
const prozent = (x) => (x == null ? '–' : `${Math.round(x * 100)} %`);
const chip = (n) => h('span', { class: 'chip', style: `background:${NIVEAU_FARBE[n]}`, title: L.NIVEAU_NAMEN[n] }, n);
const aufgabentext = (id) => z.index.aufgabe.get(id)?.text.replace(/\{\{\w+\}\}/g, '▢') ?? id;
// Ersetzt Lernziel-Kennungen in Hinweistexten durch etwas Lesbares, z. B. „Subtrahieren S2“.
const lesbar = (text) => text.replace(/\d+\.\d+\.\w+-\w+/g, (id) => { const l = A.lernzieleMitAufgaben(z.pool, z.index).find((x) => x.id === id); return l ? `„${l.milestone} ${id.split('-').pop()}“` : id; });
const lernzieltext = (id) => A.lernzieleMitAufgaben(z.pool, z.index).find((l) => l.id === id)?.text ?? id;

// ---------- Gemerkte Ordner ----------
const gemerkt = gemerkteOrdner('mathekingdom-lehrer');
const merke = (schluessel, handle) => gemerkt.merke(schluessel, handle);
const erinnere = (schluessel) => gemerkt.hole(schluessel);

// ---------- Dateien ----------
// Ohne Schulverzeichnis steht alles in den Lehrerdaten. Mit Schulverzeichnis gehören Schlüssel und Protokoll der
// Lehrkraft (<Kürzel>/lehrer.json), Namensliste, PINs und Einstellungen der Klasse (Schuljahr/Klasse/klasse.json).
async function speichereLehrer() {
  if (!z.schule) return z.lehrer.schreibe(LEHRERDATEN, JSON.stringify(z.daten, null, 1));
  const ich = await z.schule.lehrer.unterordner(z.schule.kuerzel);
  await ich.schreibe(SCH.LEHRER_DATEI, JSON.stringify({ kuerzel: z.schule.kuerzel, schluessel: z.daten.schluessel, protokoll: z.daten.protokoll ?? [], meldungen: z.daten.meldungen ?? [] }, null, 1));
}
const klasseImLehrerlaufwerk = async (klasse = z.klasse) => (await z.schule.lehrer.unterordner(z.schule.schuljahr)).unterordner(klasse);
// Hat eine andere Lehrkraft die Klassendaten inzwischen geändert, wird die Änderung auf ihre Fassung angewandt (ADR 0024).
async function speichereKlasse(tun) {
  const ort = await klasseImLehrerlaufwerk();
  if (tun) {
    const liegt = await ort.lies(SCH.KLASSE_DATEI);
    if (liegt && liegt !== z.klasseText) {
      try { const frisch = JSON.parse(liegt); tun(frisch); z.daten.klassen[z.klasse] = frisch; } catch { /* halb geschrieben: unsere Fassung gilt */ }
    }
  }
  const text = JSON.stringify(kl(), null, 1);
  await ort.schreibe(SCH.KLASSE_DATEI, text);
  z.klasseText = text;
}
async function speichereDaten(tun) {
  if (!z.schule) return speichereLehrer();
  if (z.klasse && kl()) await speichereKlasse(tun);
}
async function ladeKlasseNeu() {
  const t = await (await klasseImLehrerlaufwerk()).lies(SCH.KLASSE_DATEI);
  if (t && t !== z.klasseText) { try { z.daten.klassen[z.klasse] = JSON.parse(t); z.klasseText = t; } catch { /* beim nächsten Takt */ } }
}
const klassenSchluessel = () => [...SCH.schluesselDerKlasse(z.schule.verzeichnis, z.schule.schuljahr, z.klasse), z.daten.schluessel.oeffentlich];
// Betriebsprotokoll der Lehrkraft in den Lehrerdaten (ADR 0013). Ein Fehler beim Speichern darf hier nichts aufhalten.
function notiere(art, text, klasse) {
  P.trage((z.daten.protokoll ??= []), { t: jetzt(), art, text, ...(klasse ? { klasse } : {}) }, P.MAX_LEHRER);
  return speichereLehrer().catch(() => {});
}
async function schreibeKlassendatei() {
  if (await SCH.sorgePins(kl())) await speichereDaten();
  const text = await K.unterschreibe(SCH.klassendateiInhalt(z.klasse, kl(), jetzt()), z.daten.schluessel.privat);
  await z.ordner.schreibe(S.KLASSENDATEI, text);
  z.klassendateiText = text;
}
// Alles, was die Klassendatei schreibt oder prüft, läuft nacheinander durch diese Schlange. Sonst überholen sich
// ein Klick und das Neuladen alle 5 Sekunden, und das Dashboard hält seine eigene Datei für fremd verändert.
let schlange = Promise.resolve();
function inSchlange(tun) {
  const fertig = schlange.then(tun);
  schlange = fertig.catch(() => {});
  return fertig;
}
function aendere(tun) {
  tun(kl());
  schlange = schlange.then(async () => { await speichereDaten(tun); await schreibeKlassendatei(); male(); })
    .catch((e) => { z.fehler = `Speichern fehlgeschlagen: ${e.message}`; notiere('problem', `Speichern der Klassendatei oder Lehrerdaten fehlgeschlagen: ${e.message}`, z.klasse); male(); });
  return schlange;
}

async function oeffneLehrer(ablage) {
  z.lehrer = ablage;
  const text = await ablage.lies(LEHRERDATEN);
  z.daten = text ? JSON.parse(text) : { version: 1, schluessel: await K.erzeugeSchluessel(), klassen: {} };
  if (!text) await speichereDaten();
  if (!ablage.demo) {
    const e = P.starteintrag({ t: jetzt(), version: versionstext(), dashboard: window.MK_QUELLE ?? 'ohne-netz', grund: window.MK_GRUND, browser: P.browserName(navigator.userAgent) });
    await notiere(e.art, e.text);
  }
  // Kopie des gerade geladenen Dashboards für Tage ohne Internet (ADR 0011).
  if (window.MK_LEHRER_PAKET && !ablage.demo) await ablage.schreibe(`${S.SYSTEMORDNER}/lehrer-paket.js`, window.MK_LEHRER_PAKET)
    .catch((e) => notiere('problem', `Kopie des Dashboards aufs Lehrerlaufwerk fehlgeschlagen: ${e.message}`));
  z.ansicht = 'klassen'; z.fehler = null; male();
}

// Mit Schulverzeichnis (ADR 0024): Mathekingdom-Ordner auf beiden Tauschlaufwerken, Kürzel aus der Startdatei.
async function oeffneSchule(schueler, lehrer, kuerzel) {
  const v = await SCH.ladeVerzeichnis(schueler, window.MK_SCHLUESSEL);
  if (v.status === 'fehlt') throw new Error('Im Mathekingdom-Ordner auf dem Schülertauschlaufwerk fehlt das Schulverzeichnis. Hat der Administrator die Schule schon eingerichtet?');
  if (v.status === 'ungueltig') throw new Error('Das Schulverzeichnis auf dem Schülertauschlaufwerk ist ungültig: Die Unterschrift des Administrators passt nicht.');
  if (!v.daten.lehrkraefte?.[kuerzel]) throw new Error(`Das Kürzel ${kuerzel} ist im Schulverzeichnis nicht angelegt. Frag deinen Administrator.`);
  const ichOrdner = await lehrer.ordner(kuerzel);
  const text = ichOrdner && await ichOrdner.lies(SCH.LEHRER_DATEI);
  if (!text) throw new Error(`Auf dem Lehrertauschlaufwerk fehlt der Ordner „${kuerzel}“ mit deinem Schlüssel. Hast du dort den Ordner „Mathekingdom“ gewählt?`);
  const ich = JSON.parse(text);
  Object.assign(z, { schule: { schueler, lehrer, kuerzel, verzeichnis: v.daten, schuljahr: v.daten.schuljahr }, lehrer, daten: { version: 2, schluessel: ich.schluessel, protokoll: ich.protokoll ?? [], meldungen: ich.meldungen ?? [], klassen: {} } });
  const e = P.starteintrag({ t: jetzt(), version: versionstext(), dashboard: window.MK_QUELLE ?? 'ohne-netz', grund: window.MK_GRUND, browser: P.browserName(navigator.userAgent) });
  await notiere(e.art, e.text);
  // Kopien für Tage ohne Internet: Lehrer-Dashboard aufs Lehrer-, Schüler-Dashboard aufs Schülertauschlaufwerk.
  if (window.MK_LEHRER_PAKET) await lehrer.schreibe(`${S.SYSTEMORDNER}/lehrer.js`, window.MK_LEHRER_PAKET)
    .catch((f) => notiere('problem', `Kopie des Dashboards aufs Lehrertauschlaufwerk fehlgeschlagen: ${f.message}`));
  if (window.MK_SCHUELER_JS) await schueler.schreibe(`${S.SYSTEMORDNER}/schueler.js`, window.MK_SCHUELER_JS)
    .catch((f) => notiere('problem', `Kopie des Schüler-Dashboards aufs Schülertauschlaufwerk fehlgeschlagen: ${f.message}`));
  z.ansicht = 'klassen'; z.fehler = null;
  // Die Liste der Klassen braucht nur, wer mehrere hat (ADR 0025).
  const meine = SCH.klassenDerLehrkraft(z.schule.verzeichnis, z.schule.schuljahr, kuerzel);
  if (meine.length === 1) return oeffneSchulklasse(meine[0]);
  male();
}
async function ladeVerzeichnisNeu() {
  const v = await SCH.ladeVerzeichnis(z.schule.schueler, window.MK_SCHLUESSEL);
  if (v.daten && v.status !== 'ungueltig') Object.assign(z.schule, { verzeichnis: v.daten, schuljahr: v.daten.schuljahr });
}
// Alle Codes des Schuljahrs: Der hintere Teil eines neuen Codes soll schulweit einmalig sein.
async function alleCodesImJahr() {
  const jahr = await z.schule.lehrer.ordner(z.schule.schuljahr);
  if (!jahr) return [];
  const codes = [];
  for (const k of await jahr.ordnernamen()) {
    const t = await (await jahr.ordner(k))?.lies(SCH.KLASSE_DATEI).catch(() => null);
    try { codes.push(...Object.keys(JSON.parse(t)?.namen ?? {})); } catch { /* keine Klassendaten */ }
  }
  return codes;
}
async function oeffneSchulklasse(klasse) {
  await ladeVerzeichnisNeu();
  const ordner = await (await z.schule.schueler.unterordner(z.schule.schuljahr)).unterordner(klasse);
  z.klasse = null; // erst nach dem Laden der Klassendaten wieder schreiben
  const text = await (await klasseImLehrerlaufwerk(klasse)).lies(SCH.KLASSE_DATEI);
  if (text) { z.daten.klassen = { [klasse]: JSON.parse(text) }; z.klasseText = text; } else { z.daten.klassen = {}; z.klasseText = null; }
  Object.assign(z, { alleCodes: await alleCodesImJahr(), andereOffen: [], anwesendGeschrieben: 0 });
  await oeffneKlasse(klasse, ordner);
}

async function oeffneKlasse(klasse, ablage) {
  if (ablage.name.toLowerCase() !== klasse) { z.fehler = `Der gewählte Ordner heißt „${ablage.name}“. Für die Klasse ${klasse} muss er „${klasse}“ heißen.`; return male(); }
  const stufe = parseInt(klasse, 10);
  const { pool, quelle: poolQuelle, grund: poolGrund } = await ladePool(ablage, stufe);
  if (poolGrund) notiere('problem', `Aufgaben für Klasse ${stufe} ${P.QUELLE_TEXT[poolQuelle] ?? 'nicht gefunden'}, Grund: ${poolGrund}`, klasse);
  if (!pool) { z.fehler = `Für Klasse ${stufe} gibt es noch keinen Aufgabenpool.`; return male(); }
  // Eine neue Klasse hat nur Tor 1 offen (ADR 0022).
  z.daten.klassen[klasse] ??= { namen: {}, notizen: {}, einst: { aktuellesKapitel: null, tore: [pool.kapitel[0].id], toreEinzeln: {}, spielpause: false, zielniveaus: {}, hilfe: {}, nachrichten: {}, sperren: {} } };
  const e = z.daten.klassen[klasse].einst;
  e.nachrichten ??= {}; e.sperren ??= {}; e.sonderauftraege ??= {};
  // Bestehende Klassen ohne Torfreigabe behalten genau die Tore, die bisher offen waren.
  if (!Array.isArray(e.tore)) e.tore = [...L.toreDerKlasse(e, pool)];
  e.toreEinzeln ??= {};
  Object.assign(z, { melden: null, meldungGesendet: null, overlay: null, sitzplanOffen: false, sitzGewaehlt: null, gesehen: new Set(), pfadKapitel: null, zweitesGemeldet: false });
  Object.assign(z, { klasse, ordner: ablage, pool, index: L.indexiere(pool), ansicht: 'klasse', fehler: null, warnungen: [], klassendateiText: null, schueler: null, ls: { art: 'klasse' } });
  // Kopien für den Unterricht ohne Internet.
  await ablage.schreibe(`${S.SYSTEMORDNER}/klasse-${stufe}.json`, JSON.stringify(pool));
  if (window.MK_SCHUELER_JS) await ablage.schreibe(`${S.SYSTEMORDNER}/schueler-dashboard.js`, window.MK_SCHUELER_JS);
  clearInterval(takt);
  await speichereDaten();
  await inSchlange(schreibeKlassendatei);
  await lade();
  // Im Unterricht zuerst der Raum, sonst der Lernstand. Ohne Namensliste der Bereich Klasse.
  if (!Object.keys(kl().namen).length) z.abschnitt = 'schueler';
  z.tab = !Object.keys(kl().namen).length ? 'klasse' : A.jemandAktiv(z.staende, jetzt()) ? 'jetzt' : 'lernstand';
  clearInterval(takt);
  const frisch = async () => {
    const vorher = z.warnungen.length, vorherOffen = z.andereOffen.join();
    await lade();
    const fokus = document.activeElement?.tagName;
    // Eine neue Warnung wird sofort gezeigt. Sonst nur neu zeichnen, wo es nicht beim Tippen stört.
    if (z.warnungen.length > vorher || z.andereOffen.join() !== vorherOffen || (['jetzt', 'lernstand', 'aufgaben'].includes(z.tab) && !['SELECT', 'INPUT', 'TEXTAREA'].includes(fokus) && !document.querySelector('details.nachricht[open], details.sonderauftrag[open]'))) male();
  };
  // Dauert das Lesen im Netz länger als 5 Sekunden, wird der nächste Durchgang ausgelassen statt doppelt gestartet.
  let laeuft = false;
  takt = setInterval(async () => { if (laeuft) return; laeuft = true; try { await frisch(); } finally { laeuft = false; } }, 5000);
  // Im Hintergrund bremst der Browser die Uhr: beim Zurückkehren sofort neu lesen.
  document.onvisibilitychange = () => { if (!document.hidden && z.ansicht === 'klasse') frisch(); };
  male();
}

// Der neueste Aufgabenpool: online, sonst der in dieser Datei mitgelieferte, zuletzt die Kopie im Klassenordner.
async function ladePool(ablage, stufe) {
  let grund = null;
  if (window.MK_BASIS && !ablage.demo) {
    try {
      const antwort = await fetch(`${window.MK_BASIS}aufgabenpool/klasse-${stufe}.json`, { cache: 'no-cache', signal: AbortSignal.timeout(4000) });
      if (antwort.ok) return { pool: await antwort.json(), quelle: 'online' };
      grund = P.fehlergrund(null, antwort.status);
    } catch (e) { grund = P.fehlergrund(e); /* weiter mit der mitgelieferten Fassung */ }
  }
  if (window.MK_POOLS?.[stufe]) return { pool: window.MK_POOLS[stufe], quelle: 'mitgeliefert', grund };
  try { return { pool: JSON.parse(await ablage.lies(`${S.SYSTEMORDNER}/klasse-${stufe}.json`)), quelle: 'klassenordner', grund }; } catch { return { pool: null, quelle: null, grund }; }
}

async function lade() {
  if (z.schule) { await inSchlange(ladeKlasseNeu); await anwesend().catch(() => {}); }
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

  await inSchlange(pruefeKlassendatei);
  if (!z.letztesBackup || Date.now() - z.letztesBackup > BACKUP_ABSTAND) {
    await sichere().catch((e) => { z.letztesBackup = Date.now(); notiere('problem', `Stündliches Backup fehlgeschlagen: ${e.message}`, z.klasse); });
  }
}

// Wer hat die Klasse gerade noch offen? Jedes Dashboard hinterlässt alle halbe Minute eine kleine Datei (ADR 0024).
async function anwesend() {
  const ort = await klasseImLehrerlaufwerk();
  if (Date.now() - (z.anwesendGeschrieben ?? 0) > 30000) { await ort.schreibe(`offen-${z.schule.kuerzel}.json`, JSON.stringify({ t: jetzt() })); z.anwesendGeschrieben = Date.now(); }
  const andere = [];
  for (const datei of await ort.liste()) {
    const m = datei.match(/^offen-(.+)\.json$/);
    if (!m || m[1] === z.schule.kuerzel) continue;
    try { if (Date.now() - new Date(JSON.parse(await ort.lies(datei)).t) < 90000) andere.push(m[1]); } catch { /* egal */ }
  }
  z.andereOffen = andere.sort();
}

// Weicht die Klassendatei im Ordner von der zuletzt geschriebenen ab, wird sie wiederhergestellt. Gewarnt wird nur,
// wenn sie fehlt oder ihre Unterschrift nicht passt. Trägt sie die eigene Unterschrift, stammt sie von einem
// Lehrer-Dashboard: bei älterem Stand ein Überbleibsel, bei neuerem ein zweites geöffnetes Dashboard.
async function pruefeKlassendatei() {
  const liegt = await z.ordner.lies(S.KLASSENDATEI);
  let liegtNeu = false;
  if (z.klassendateiText && liegt !== z.klassendateiText) {
    const echt = !liegt ? null : z.schule ? await SCH.pruefeMitSchluesseln(liegt, klassenSchluessel()) : await K.pruefeUnterschrift(liegt, z.daten.schluessel.oeffentlich);
    if (echt && z.schule) {
      // Eine andere Lehrkraft der Klasse (oder der Administrator) hat geschrieben. Ihre Fassung gilt, die Klassendaten
      // sind eben schon neu gelesen. Nur eine ältere Fassung (wieder eingespielt) wird überschrieben.
      if (echt.stand >= (K.liesUngeprueft(z.klassendateiText)?.stand ?? '')) { z.klassendateiText = liegt; liegtNeu = true; }
    } else if (!echt) {
      // Mit Schulverzeichnis geht das nur ins Betriebsprotokoll für den Administrator: Die Lehrkraft kann nichts tun (ADR 0025).
      if (!z.schule) z.warnungen.unshift(`${uhr(Date.now())} Uhr: Die Klassendatei ${liegt ? 'wurde von außen verändert' : 'fehlte'}. Sie wurde wiederhergestellt.`);
      notiere('problem', liegt ? 'Klassendatei von außen verändert (Unterschrift passt nicht), wiederhergestellt' : 'Klassendatei fehlte im Klassenordner, neu geschrieben', z.klasse);
    } else if (echt.stand > (K.liesUngeprueft(z.klassendateiText)?.stand ?? '') && !z.zweitesGemeldet) {
      z.zweitesGemeldet = true;
      z.warnungen.unshift(`${uhr(Date.now())} Uhr: Ein zweites Lehrer-Dashboard schreibt in diese Klasse. Lass bitte nur eines offen, sonst überschreiben sie sich gegenseitig.`);
      notiere('problem', 'Ein zweites Lehrer-Dashboard schreibt in diese Klasse', z.klasse);
    }
    if (!liegtNeu) await schreibeKlassendatei();
  }
  // Antworten auf erledigte oder zurückgezogene Hilferufe entfernen.
  const hilfe = kl().einst.hilfe;
  let geaendert = false;
  for (const code of Object.keys(hilfe)) {
    const ruf = z.staende.find((s) => s.code === code)?.stand.hilferuf;
    if (!ruf || ruf.seit !== hilfe[code].zu) { delete hilfe[code]; geaendert = true; }
  }
  if (geaendert) { await speichereDaten(); await schreibeKlassendatei(); }
}

// ---------- Backup ----------
const backupOrdner = async () => (z.schule ? (await klasseImLehrerlaufwerk()).unterordner('backup') : (await z.lehrer.unterordner('backup')).unterordner(z.klasse));
async function sichere() {
  if (!z.staende.length) return;
  const d = new Date();
  await B.sichereKlasse({ klassenordner: z.ordner, backupOrdner: await backupOrdner(), staende: [...z.staende, ...z.unbekannt], jetzt: d,
    zusatz: z.schule ? { [SCH.KLASSE_DATEI]: JSON.stringify(kl()) } : { [LEHRERDATEN]: JSON.stringify(z.daten) } });
  z.letztesBackup = Date.now();
  kl().letztesBackup = d.toISOString();
  await speichereDaten();
}
async function stelleWiederHer(stempel, code) {
  await B.stelleStandWiederHer({ backupOrdner: await backupOrdner(), stempel, code, klassenordner: z.ordner });
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
  if (z.schule) return ladeHerunter('Mathekingdom.html', SCH.fuelleStartdatei(window.MK_STARTDATEI_SCHUELER, { SCHLUESSEL: z.schule.verzeichnis.admin, PFAD: z.schule.verzeichnis.pfade?.schueler || null }), 'text/html');
  ladeHerunter('Mathekingdom.html', window.MK_STARTDATEI.replace('/*SCHLUESSEL*/null', JSON.stringify(z.daten.schluessel.oeffentlich)), 'text/html');
}

// ---------- Rahmen ----------
// Zwischen den eigenen Klassen oben wechseln (ADR 0025). Ohne Schulverzeichnis zurück zur Liste.
function klassenwahl() {
  if (!z.schule) return h('button', { class: 'schlicht hell', onclick: () => { clearInterval(takt); z.ansicht = 'klassen'; male(); } }, 'Klasse wechseln');
  const meine = SCH.klassenDerLehrkraft(z.schule.verzeichnis, z.schule.schuljahr, z.schule.kuerzel);
  if (meine.length < 2) return null;
  return h('select', { class: 'klassenwahl', id: 'klassenwahl', 'aria-label': 'Klasse wechseln', onchange: (ev) => {
    clearInterval(takt);
    oeffneSchulklasse(ev.target.value).catch((e) => { z.fehler = `Die Klasse ${ev.target.value} ließ sich nicht öffnen: ${e.message}`; male(); });
  } }, meine.map((k) => h('option', { value: k, selected: k === z.klasse }, `Klasse ${k}`)));
}
function male() {
  const ansichten = { start, klassen, klasse: klassenAnsicht };
  const gerollt = wurzel.querySelector('.overlay-inhalt')?.scrollTop;
  wurzel.replaceChildren(...[
    h('header', { class: 'kopf' }, h('strong', {}, 'Mathekingdom'), h('span', {}, 'Lehrer-Dashboard'),
      z.lehrer?.demo && h('span', { class: 'demo' }, 'Beispieldaten: nichts wird gespeichert'),
      z.schule && h('span', { class: 'demo' }, `${z.schule.kuerzel} · Schuljahr ${z.schule.schuljahr}`),
      z.ansicht === 'klasse' && z.andereOffen.length > 0 && h('span', { class: 'demo', id: 'andere-offen' }, `Auch ${z.andereOffen.join(' und ')} ${z.andereOffen.length > 1 ? 'haben' : 'hat'} die Klasse gerade offen`),
      z.ansicht === 'klasse' && klassenwahl()),
    z.fehler && h('div', { class: 'meldung fehler', role: 'alert' }, z.fehler),
    h('main', {}, ansichten[z.ansicht]()),
    z.ansicht === 'klasse' && z.overlay && kl().namen[z.overlay] && overlay(),
    z.ansicht === 'klasse' && z.tafel && tafelbildAnsicht(),
    z.ansicht === 'klasse' && z.melden && meldeDialog(),
    versionsHinweis('lehrkraft'),
  ].filter(Boolean));
  if (gerollt) { const o = wurzel.querySelector('.overlay-inhalt'); if (o) o.scrollTop = gerollt; }
}

function start() {
  if (window.MK_SCHULE) return startSchule();
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

// Erster Start mit Schulverzeichnis: Kürzel (aus der Startdatei), dann einmal die beiden Mathekingdom-Ordner.
// Danach sind sie gemerkt, und „Weiter“ fragt höchstens nach der Erlaubnis.
function startSchule() {
  if (!z.wahl) {
    z.wahl = { schueler: null, lehrer: null, geladen: false };
    Promise.all([erinnere('schule-schueler'), erinnere('schule-lehrer')]).then(([s, l]) => { Object.assign(z.wahl, { schueler: z.wahl.schueler ?? s, lehrer: z.wahl.lehrer ?? l, geladen: true }); male(); });
  }
  let kuerzel = window.MK_KUERZEL ?? '';
  try { kuerzel ||= localStorage.getItem('mk-kuerzel') ?? ''; } catch { /* egal */ }
  const kuerzelFeld = !window.MK_KUERZEL && h('input', { id: 'kuerzel', type: 'text', value: kuerzel, size: 6, maxLength: 5, placeholder: 'z. B. NG' });
  const LAUFWERK = { schueler: ['Schülertauschlaufwerk', window.MK_PFAD_SCHUELER], lehrer: ['Lehrertauschlaufwerk', window.MK_PFAD_LEHRER] };
  const waehle = async (art) => {
    try {
      const gewaehlt = S.ordnerAblage(await window.showDirectoryPicker({ id: `mk-${art}`, mode: 'readwrite' }));
      const { wurzel: w } = await SCH.findeSchule(gewaehlt);
      if (!w) { z.fehler = `In diesem Ordner liegt kein eingerichtetes Mathekingdom. Wähle auf dem ${LAUFWERK[art][0]} den Ordner „Mathekingdom“${LAUFWERK[art][1] ? ` (${LAUFWERK[art][1]})` : ''}.`; return male(); }
      z.wahl[art] = w.handle; await merke(`schule-${art}`, w.handle); z.fehler = null; male();
    } catch (e) { if (e.name !== 'AbortError') { z.fehler = e.message; male(); } }
  };
  const weiter = async () => {
    const k = (kuerzelFeld ? kuerzelFeld.value : kuerzel).trim().toUpperCase();
    if (!SCH.istKuerzel(k)) { z.fehler = 'Gib dein Kürzel ein, zum Beispiel NG.'; return male(); }
    try { localStorage.setItem('mk-kuerzel', k); } catch { /* egal */ }
    for (const art of ['schueler', 'lehrer']) {
      if (!(await erlaube(z.wahl[art]))) { z.fehler = `Bitte erlaube den Zugriff auf das ${LAUFWERK[art][0]}. Klicke dazu noch einmal auf „Weiter“.`; return male(); }
    }
    try { await oeffneSchule(S.ordnerAblage(z.wahl.schueler), S.ordnerAblage(z.wahl.lehrer), k); }
    catch (e) { z.fehler = e.message; male(); }
  };
  const zeile = (art) => h('li', {}, h('b', {}, LAUFWERK[art][0]), ' ',
    z.wahl[art] ? h('span', {}, `Ordner „${z.wahl[art].name}“ gemerkt `) : h('span', { class: 'klein' }, `Wähle den Ordner „Mathekingdom“${LAUFWERK[art][1] ? ` (${LAUFWERK[art][1]})` : ''}. `),
    h('button', { class: z.wahl[art] ? 'schlicht' : 'haupt', id: `wahl-${art}`, onclick: () => waehle(art) }, z.wahl[art] ? 'Anderen Ordner wählen' : 'Ordner wählen'));
  return h('section', { class: 'karte schmal' },
    h('h1', {}, 'Willkommen'),
    window.MK_KUERZEL ? h('p', {}, `Dein Kürzel: `, h('b', {}, window.MK_KUERZEL)) : h('p', {}, h('label', {}, 'Dein Kürzel ', kuerzelFeld)),
    !S.kannOrdner() ? h('p', { class: 'fehlertext' }, 'Dieser Browser kann nicht in Ordnern speichern. Öffne die Datei bitte mit Edge oder Chrome.')
      : h('div', {},
        h('p', { class: 'klein' }, 'Nur beim ersten Mal: Wähle auf beiden Tauschlaufwerken den Ordner „Mathekingdom“. Danach merkt sich der Browser die Ordner.'),
        h('ul', { class: 'liste' }, zeile('schueler'), zeile('lehrer')),
        h('button', { class: 'haupt', id: 'weiter', disabled: !(z.wahl.schueler && z.wahl.lehrer), onclick: weiter }, 'Weiter')),
    h('button', { class: 'schlicht', id: 'beispiel', onclick: starteBeispiel }, 'Mit einer Beispielklasse ausprobieren'));
}

async function starteBeispiel() {
  const lehrer = S.speicherAblage('lehrer'), ordner = S.speicherAblage('5a');
  await oeffneLehrer(lehrer);
  const pool = window.MK_POOLS[5], bsp = beispielklasse(pool, L.indexiere(pool));
  z.daten.klassen['5a'] = { namen: bsp.namen, notizen: {}, einst: { aktuellesKapitel: '5.4', tore: ['5.1', '5.2', '5.3', '5.4'], toreEinzeln: {}, spielpause: false, zielniveaus: bsp.zielniveaus, hilfe: {}, nachrichten: {}, sperren: {} } };
  for (const { code, stand } of bsp.staende) await ordner.schreibe(`${code}.json`, JSON.stringify(stand));
  await oeffneKlasse('5a', ordner);
}

function klassen() {
  if (z.schule) return klassenSchule();
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

function klassenSchule() {
  const v = z.schule.verzeichnis, jahr = z.schule.schuljahr;
  const meine = SCH.klassenDerLehrkraft(v, jahr, z.schule.kuerzel);
  const oeffne = (k) => oeffneSchulklasse(k).catch((e) => { z.fehler = `Die Klasse ${k} ließ sich nicht öffnen: ${e.message}`; male(); });
  return h('section', { class: 'karte schmal' },
    h('h1', {}, 'Deine Klassen'),
    h('p', { class: 'klein' }, `Schuljahr ${jahr}. ${v.lehrkraefte?.[z.schule.kuerzel]?.admin ? 'Du hast Einblick in alle Klassen.' : 'Klassen legt der Administrator an und ordnet sie dir zu.'}`),
    meine.length ? h('ul', { class: 'klassenliste' }, meine.map((k) => h('li', {}, h('b', {}, k), h('span', {}, (v.klassen[jahr][k].lehrkraefte ?? []).join(', ') || 'keine Lehrkraft'),
      h('button', { class: 'haupt', 'data-klasse': k, onclick: () => oeffne(k) }, 'Öffnen')))) : h('p', {}, 'Dir ist in diesem Schuljahr noch keine Klasse zugeordnet.'),
    h('button', { class: 'schlicht', id: 'verzeichnis-neu', onclick: async () => { await ladeVerzeichnisNeu(); male(); } }, 'Neu laden'));
}

// ---------- Klasse ----------
// Vier Bereiche statt vieler Reiter (ADR 0010). Jeder Bereich geht beim Anklicken in die Tiefe.
const BEREICHE = [['jetzt', 'Jetzt'], ['lernstand', 'Lernstand'], ['aufgaben', 'Aufgaben'], ['klasse', 'Klasse']];
function klassenAnsicht() {
  const e = kl().einst;
  const inhalte = { jetzt: bereichJetzt, lernstand, aufgaben: aufgabenTab, klasse: bereichKlasse };
  return h('div', {},
    h('div', { class: 'leiste' },
      h('h1', {}, `Klasse ${z.klasse}`),
      // Ein Aktuelles Kapitel wählen öffnet sein Tor für die Klasse (ADR 0022).
      h('label', {}, 'Aktuelles Kapitel ', h('select', { id: 'kapitel', onchange: (ev) => aendere((k) => {
        k.einst.aktuellesKapitel = ev.target.value || null;
        if (ev.target.value && !k.einst.tore.includes(ev.target.value)) k.einst.tore = ordneTore([...k.einst.tore, ev.target.value]);
      }) },
        h('option', { value: '' }, 'keins gewählt'),
        z.pool.kapitel.map((k, i) => h('option', { value: k.id, selected: e.aktuellesKapitel === k.id }, `${i + 1} ${k.titel}`)))),
      // Spielfreigabe (ADR 0018): aus, nur in der Spielpause oder verdient (Belohnungsspiel nach jedem vierten Wegstück).
      h('label', { title: 'Wann Minispiele gehen. Verdient: Rechenpause immer, ein Belohnungsspiel nach jedem vierten Wegstück.' }, 'Spiele ', h('select', { id: 'spielfreigabe', onchange: (ev) => aendere((k) => { k.einst.spielfreigabe = ev.target.value; }) },
        Object.entries({ aus: 'aus', spielpause: 'nur in der Spielpause', verdient: 'verdient (nach 4 Wegstücken)' }).map(([w, t]) => h('option', { value: w, selected: (e.spielfreigabe ?? 'spielpause') === w }, t)))),
      (e.spielfreigabe ?? 'spielpause') !== 'aus' && h('label', { class: 'schalter' }, h('input', { id: 'spielpause', type: 'checkbox', checked: e.spielpause, onchange: (ev) => aendere((k) => { k.einst.spielpause = ev.target.checked; }) }), ' Spielpause jetzt'),
      h('span', { class: 'klein rechts', id: 'aktualisiert' }, z.aktualisiert ? `Aktualisiert um ${z.aktualisiert.toLocaleTimeString('de-DE')}` : '')),
    z.warnungen.length > 0 && h('div', { class: 'meldung warnung' }, h('ul', {}, z.warnungen.slice(0, 4).map((w) => h('li', {}, w))),
      h('button', { class: 'schlicht', onclick: () => { z.warnungen = []; male(); } }, 'Gelesen')),
    h('nav', { class: 'tabs bereiche' }, BEREICHE.map(([id, titel]) => h('button', { class: z.tab === id ? 'aktiv' : '', 'data-tab': id, onclick: () => { z.tab = id; if (id === 'lernstand') z.ls = { art: 'klasse' }; if (id === 'klasse') z.backups = null; male(); } }, titel))),
    inhalte[z.tab]());
}

// ---------- Jetzt: Klassenraum und Akut-Zone ----------
const STATUS = {
  hilfe: ['Hilferuf', '✋'], blockiert: ['Blockiert', '!'], beobachten: ['Beobachten', '?'], laesstnach: ['Lässt nach', '↘'], flow: ['Im Flow', '✓'],
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
        h('span', { class: 'unten' }, (linien.length ? linien : [ziel(code)]).map(chip), st.stand ? `Siegel ${L.siegel(st.stand)}` : ''),
        st.stand && wegreihe(st.stand));
    })));
}

// Wegstücke von heute als kleine Reihe, gefärbt nach der Quote (ADR 0016).
const wegKlasse = (w) => (w.richtig / w.gesamt >= 0.8 ? 'voll' : w.richtig / w.gesamt >= 0.5 ? 'halb' : 'leer');
function wegreihe(stand) {
  const w = A.wegstueckeHeute(stand, jetzt());
  if (!w.length) return null;
  return h('span', { class: 'wegreihe', title: `Wegstücke heute: ${w.map((x) => `${x.richtig}/${x.gesamt}`).join(', ')}` },
    w.slice(-8).map((x) => h('i', { class: wegKlasse(x) })), w.length > 8 && h('small', {}, `+${w.length - 8}`));
}
const anteilText = (q) => String(Math.round(q * 50) / 10).replace('.', ',');

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

// ---------- Sonderauftrag (ADR 0021) ----------
// Im Schülerprofil: ein Lernziel (Vorschlag: die schwächsten und ihre Voraussetzungen), eine Niveaustufe, 3 bis 5 Aufgaben.
const SATZ_VORLAGEN = ['Das schaffst du!', 'Damit kommst du bei deinem Lernziel weiter.', 'Eine kleine Herausforderung für dich.'];
const SA_STATUS = { gesendet: ['gesendet, noch nicht geöffnet', 'warn'], geoeffnet: ['geöffnet', 'warn'], erledigt: ['erledigt', 'gut'] };
function sonderauftragFeld(code) {
  const stand = z.staende.find((x) => x.code === code)?.stand ?? L.neuerSpeicherstand(code, z.klasse, jetzt());
  const auftrag = kl().einst.sonderauftraege?.[code] ?? null;
  const st = A.sonderauftragStand(stand, auftrag);
  const offen = st && st.status !== 'erledigt';
  const zieh = () => aendere((k) => { delete k.einst.sonderauftraege[code]; });
  const statusZeile = st && h('div', { class: 'sa-stand', id: 'sonderauftrag-stand' },
    h('p', {}, h('b', {}, 'Sonderauftrag: '), `${lernzieltext(auftrag.lernziel)}, Niveau ${auftrag.niveau}, ${auftrag.aufgaben.length} Aufgaben, Belohnung ${L.sonderauftragBelohnung(auftrag.belohnung)} Münzen, verschickt um ${uhr(auftrag.t)} Uhr. `,
      h('span', { class: `marke ${SA_STATUS[st.status][1]}` }, SA_STATUS[st.status][0]),
      st.status === 'geoeffnet' && ` ${st.erledigt} von ${st.gesamt} bearbeitet`,
      st.status === 'erledigt' && ` ${st.richtig} von ${st.gesamt} richtig`),
    st.fehlvorstellungen.length > 0 && h('p', { class: 'klein' }, `Typische Fehler dabei: ${st.fehlvorstellungen.map((f) => z.pool.fehlvorstellungen[f]?.beschreibung ?? f).join('; ')}`),
    offen && h('button', { class: 'schlicht', 'data-sa-zurueck': code, onclick: zieh }, 'Zurückziehen'));
  if (offen) return h('div', { class: 'sonderauftrag' }, statusZeile);
  // Zusammenstellen. Der Entwurf bleibt beim Neuzeichnen erhalten.
  const ziel = kl().einst.zielniveaus[code] ?? L.STANDARD_ZIELNIVEAU;
  const schwach = A.schwaechsteLernziele(stand, z.index).map((x) => x.lernziel);
  const vor = A.voraussetzungenVon(z.index, schwach);
  if (z.sa?.code !== code) {
    z.sa = { code, offen: false, lernziel: schwach[0] ?? null, niveau: L.NIVEAUS[Math.max(0, L.NIVEAUS.indexOf(ziel) - 1)], anzahl: 4, satz: '', aufgaben: null };
  }
  const sa = z.sa;
  const neu = () => { sa.aufgaben = null; male(); };
  const auswahl = sa.lernziel ? A.sonderauftragAufgaben(z.index, stand, sa.lernziel, sa.niveau, sa.anzahl) : null;
  if (auswahl && !sa.aufgaben) sa.aufgaben = auswahl.aufgaben;
  const alle = A.lernzieleMitAufgaben(z.pool, z.index);
  const tausche = (i) => {
    const frei = auswahl.vorrat.filter((id) => !sa.aufgaben.includes(id));
    if (!frei.length) return;
    sa.aufgaben = sa.aufgaben.map((id, j) => (j === i ? frei[0] : id));
    male();
  };
  const sende = () => {
    if (!sa.lernziel || !sa.aufgaben?.length) return;
    const t = jetzt();
    const eintrag = { id: t, t, lernziel: sa.lernziel, niveau: sa.niveau, aufgaben: [...sa.aufgaben], belohnung: L.sonderauftragBelohnung(kl().einst.sonderauftragBelohnung), ...(sa.satz.trim() && { satz: sa.satz.trim().slice(0, 200) }) };
    z.sa = null;
    aendere((k) => { (k.einst.sonderauftraege ??= {})[code] = eintrag; });
  };
  const option = (id, mark) => h('option', { value: id, selected: sa.lernziel === id }, `${mark}${lernzieltext(id)}`);
  return h('div', { class: 'sonderauftrag' }, statusZeile,
    h('details', { class: 'sonderauftrag', open: sa.offen, ontoggle: (ev) => { sa.offen = ev.target.open; } },
      h('summary', {}, st ? 'Neuen Sonderauftrag schicken' : 'Sonderauftrag schicken'),
      h('p', { class: 'klein' }, `3 bis 5 Aufgaben als Brief. Für das Bearbeiten aller Aufgaben gibt es ${L.sonderauftragBelohnung(kl().einst.sonderauftragBelohnung)} Münzen dazu, egal wie viele richtig sind. Die Belohnung stellst du unter Klasse › Unterricht ein.`),
      h('div', { class: 'reihe' },
        h('label', {}, 'Lernziel ', h('select', { 'data-sa-lernziel': code, onchange: (ev) => { sa.lernziel = ev.target.value || null; neu(); } },
          !sa.lernziel && h('option', { value: '' }, 'bitte wählen'),
          schwach.length > 0 && h('optgroup', { label: 'Schwächste Lernziele' }, schwach.map((id) => option(id, ''))),
          vor.length > 0 && h('optgroup', { label: 'Voraussetzungen dazu' }, vor.map((id) => option(id, ''))),
          h('optgroup', { label: 'Alle Lernziele' }, alle.filter((l) => !schwach.includes(l.id) && !vor.includes(l.id)).map((l) => option(l.id, `${l.milestone}: `))))),
        h('label', {}, 'Niveau ', h('select', { 'data-sa-niveau': code, onchange: (ev) => { sa.niveau = ev.target.value; neu(); } },
          L.NIVEAUS.map((n) => h('option', { value: n, selected: sa.niveau === n }, `${n}${n === ziel ? ' (Zielniveau)' : ''}`)))),
        h('label', {}, 'Aufgaben ', h('select', { 'data-sa-anzahl': code, onchange: (ev) => { sa.anzahl = Number(ev.target.value); neu(); } },
          [3, 4, 5].map((n) => h('option', { value: n, selected: sa.anzahl === n }, n))))),
      !schwach.length && h('p', { class: 'klein' }, 'Noch keine Schwächen erkennbar. Wähle ein Lernziel aus der Liste.'),
      auswahl && auswahl.ungeloest < sa.anzahl && h('p', { class: 'klein warnhinweis', id: 'sa-knapp' },
        `Auf Niveau ${sa.niveau} hat ${name(code)} nur ${auswahl.ungeloest} ungelöste Aufgaben zu diesem Lernziel, der Rest wurde schon einmal gelöst und bringt nur 1 Münze.`,
        auswahl.nachbar && [' ', h('button', { class: 'link', 'data-sa-nachbar': auswahl.nachbar, onclick: () => { sa.niveau = auswahl.nachbar; neu(); } }, `Niveau ${auswahl.nachbar} hat genug.`)]),
      sa.aufgaben?.length > 0 && h('ol', { class: 'sa-aufgaben' }, sa.aufgaben.map((id, i) => h('li', {}, h('span', {}, aufgabentext(id)),
        auswahl.vorrat.length > sa.aufgaben.length && h('button', { class: 'schlicht', 'data-sa-tausche': i, onclick: () => tausche(i) }, 'Tauschen')))),
      h('div', { class: 'reihe' }, SATZ_VORLAGEN.map((t) => h('button', { class: `schlicht${sa.satz === t ? ' aktiv' : ''}`, onclick: () => { sa.satz = sa.satz === t ? '' : t; male(); } }, t))),
      h('div', { class: 'reihe' },
        h('input', { type: 'text', placeholder: 'Eigener Satz (freiwillig)', maxLength: 200, value: sa.satz, 'data-sa-satz': code, oninput: (ev) => { sa.satz = ev.target.value; } }),
        h('button', { class: 'haupt', 'data-sa-senden': code, disabled: !sa.aufgaben?.length, onclick: sende }, 'Sonderauftrag schicken'))));
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
        st.aufgabe && h('div', {}, aufgabentext(st.aufgabe), ' ', kennungMitMelden(st.aufgabe)),
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
    const tafel = A.tafelAufgabe(z.staende, x.fehlvorstellung);
    karten.push(h('li', {}, h('span', {}, h('b', {}, 'Mini-Workshop: '), `${x.codes.length} Schüler machen denselben Fehler. ${z.pool.fehlvorstellungen[x.fehlvorstellung]?.beschreibung ?? x.fehlvorstellung} (${x.codes.map(name).join(', ')})`),
      tafel && h('button', { class: 'haupt', 'data-tafelbild': tafel, onclick: () => { z.tafel = { aufgabe: tafel }; male(); } }, 'Tafelbild zeigen'),
      gesehen(`fv|${x.fehlvorstellung}`)));
  }
  // Brücke (ADR 0014): wackelig in dieser Stunde, und eine Voraussetzung sitzt noch nicht.
  for (const x of A.brueckenImpulse(angemeldet(), z.index, jetzt())) {
    const schluessel = `bruecke|${x.code}|${x.lernziel}`;
    if (z.gesehen.has(schluessel)) continue;
    const zustand = { offen: 'nicht begonnen', begonnen: 'begonnen', wackelig: 'wackelig', aufzufrischen: 'aufzufrischen' };
    karten.push(h('li', { 'data-bruecke': x.code }, h('span', {}, h('b', {}, 'Brücke: '), `${name(x.code)} ist wackelig bei ${lesbar(x.lernziel)}. Voraussetzung: ${x.voraussetzungen.map((v) => `${lesbar(v.id)} (${zustand[v.zustand]})`).join(', ')}. `,
      x.genommen ? 'Die Brücke wurde schon gegangen. Ein kurzes Gespräch lohnt sich.' : 'Das Dashboard bietet dazu eine Brücke an. Ein Hinweis von dir kann helfen, sie zu nehmen.'),
    gesehen(schluessel)));
  }
  // Grundlage (ADR 0015): zum zweiten Mal von G auf die Grundlage zurückgefallen.
  for (const x of A.grundlagenHinweise(z.staende, z.index)) {
    const schluessel = `grundlage|${x.code}|${x.lernziel}|${x.mal}`;
    if (z.gesehen.has(schluessel)) continue;
    karten.push(h('li', { 'data-grundlage': x.code }, h('span', {}, h('b', {}, 'Grundlage: '), `${name(x.code)} übt bei ${lesbar(x.lernziel)} zum ${x.mal}. Mal die Grundlage${x.aktiv ? '' : ' und ist inzwischen zurück auf G'}. `,
      x.baustein ? `Baustein: ${x.baustein}. ` : '', 'Ein kurzes Gespräch oder Material zum Anfassen kann jetzt helfen.'),
    gesehen(schluessel)));
  }
  // Lässt nach (ADR 0016): Ob eine Pause, ein Wechsel oder ein Gespräch hilft, entscheidet die Lehrkraft.
  for (const { code, stand } of angemeldet()) {
    const x = A.laesstNach(stand, jetzt());
    if (!x) continue;
    const schluessel = `nach|${code}|${x.anzahl}`;
    if (z.gesehen.has(schluessel)) continue;
    karten.push(h('li', { 'data-laesst-nach': code }, h('span', {}, h('b', {}, 'Lässt nach: '), `${name(code)} hat in den letzten zwei Wegstücken ${x.letzte.map((w) => `${w.richtig} von ${w.gesamt}`).join(' und ')} gelöst, vorher im Schnitt ${anteilText(x.schnitt)} von 5. `,
      'Vielleicht hilft eine kurze Pause, ein anderes Lernziel oder ein Gespräch.'), gesehen(schluessel)));
  }
  // Sonderauftrag erledigt (ADR 0021).
  for (const { code, stand } of z.staende) {
    const auftrag = kl().einst.sonderauftraege?.[code];
    const st = kl().namen[code] && A.sonderauftragStand(stand, auftrag);
    if (st?.status !== 'erledigt') continue;
    const schluessel = `sa|${code}|${auftrag.id}`;
    if (z.gesehen.has(schluessel)) continue;
    karten.push(h('li', { class: 'gut', 'data-sa-erledigt': code }, h('span', {}, h('b', {}, 'Sonderauftrag erledigt: '), `${name(code)} hat ${st.richtig} von ${st.gesamt} Aufgaben zu ${lesbar(auftrag.lernziel)} richtig gelöst.`),
      h('button', { class: 'schlicht', onclick: () => { z.overlay = code; male(); } }, 'Ansehen'), gesehen(schluessel)));
  }
  for (const x of A.schnelllaeufer(z.staende, z.pool, z.index, kl().einst.zielniveaus, jetzt())) {
    const schluessel = `fertig|${x.code}|${x.milestone}|${x.zielniveau}`;
    if (z.gesehen.has(schluessel)) continue;
    karten.push(h('li', { class: 'gut' }, h('span', {}, h('b', {}, 'Schnellläufer: '), `${name(x.code)} hat den Meilenstein „${x.titel}“ auf Zielniveau ${x.zielniveau} gemeistert. `,
      x.naechstes ? '' : 'Zeit für eine Knobelaufgabe oder für die Rolle als Lernbegleiter.'),
      x.naechstes && h('button', { class: 'haupt', 'data-anheben': x.code, onclick: () => aendere((k) => { k.einst.zielniveaus[x.code] = x.naechstes; }) }, `Zielniveau auf ${x.naechstes} anheben`),
      gesehen(schluessel)));
  }
  for (const x of A.unterschaetzer(angemeldet(), z.pool, kl().einst.zielniveaus)) {
    const schluessel = `unter|${x.code}|${x.meilensteine.join(',')}`;
    if (z.gesehen.has(schluessel) || !x.naechstes) continue;
    karten.push(h('li', { class: 'gut' }, h('span', {}, h('b', {}, 'Selbsteinschätzung: '), `${name(x.code)} hat sich an den letzten ${x.meilensteine.length} Meilensteinen unterschätzt und jedes Mal ein höheres Niveau geschafft als gewählt.`),
      h('button', { class: 'haupt', 'data-anheben': x.code, onclick: () => aendere((k) => { k.einst.zielniveaus[x.code] = x.naechstes; }) }, `Zielniveau auf ${x.naechstes} anheben`),
      gesehen(schluessel)));
  }
  return karten.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Impulse'), h('ul', { class: 'impulse' }, karten));
}

function bereichJetzt() {
  const status = statusAller();
  return h('div', {},
    akutZone(status),
    impulse(),
    alleCodes().length > 0 ? sitzplanKarte(status) : h('section', { class: 'karte' }, h('p', {}, 'Lege zuerst unter „Klasse“ die Namensliste an.')),
    z.unbekannt.length > 0 && h('div', { class: 'meldung warnung' }, `Im Klassenordner liegen Speicherstände mit Codes, die nicht in deiner Namensliste stehen: ${z.unbekannt.map((u) => u.code).join(', ')}.`));
}

function zielWahl(code) {
  return h('select', { 'data-ziel': code, 'aria-label': 'Zielniveau', onchange: (ev) => aendere((k) => { if (ev.target.value === L.STANDARD_ZIELNIVEAU) delete k.einst.zielniveaus[code]; else k.einst.zielniveaus[code] = ev.target.value; }) },
    L.NIVEAUS.map((n) => h('option', { value: n, selected: ziel(code) === n }, `${n} · ${L.NIVEAU_NAMEN[n]}`)));
}
function druckeEinzelbericht(code) {
  drucke(h('h1', {}, `${name(code)}, Klasse ${z.klasse}`), h('p', {}, `Diagnosebericht, Stand ${new Date().toLocaleDateString('de-DE')}`), einzelInhalt(code, true),
    kl().notizen[code] && h('p', {}, h('b', {}, kl().notizVon?.[code] ? `Notiz (${kl().notizVon[code]}): ` : 'Notiz: '), kl().notizen[code]));
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
      aktuelleAufgabe(code),
      nachrichtFeld(code),
      sonderauftragFeld(code),
      muenzgabenZeile(code),
      einzelInhalt(code)));
}

// Münzgaben des Administrators (ADR 0027): nur zum Ansehen, damit sich niemand über einen Münzberg wundert.
function muenzgabenZeile(code) {
  const stand = z.staende.find((x) => x.code === code)?.stand;
  const liste = A.muenzgabenStand(stand, L.gueltigeMuenzgaben(kl().einst.muenzgaben?.[code]));
  if (!liste.length) return null;
  const tag = (t) => new Date(t).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return h('div', { class: 'muenzgaben', id: 'muenzgaben' },
    liste.map((g) => h('p', {}, h('b', {}, `Münzgabe +${g.muenzen}`), g.geoeffnet ? `, geöffnet am ${tag(g.geoeffnet)}` : `, noch nicht geöffnet (geschickt am ${tag(g.t)})`,
      g.satz && h('span', { class: 'klein' }, ` „${g.satz}“`))),
    h('p', { class: 'klein' }, 'Münzgaben schickt der Administrator. Du kannst sie nicht ändern.'));
}

// ---------- Aufgabenmeldungen (ADR 0025) ----------
// Die Lehrkraft meldet eine fehlerhafte Aufgabe an den Administrator. Er setzt den Stand und sperrt sie notfalls.
const gesperrt = (kennung) => Boolean(z.schule?.verzeichnis.gesperrt?.includes(kennung));
function kennungMitMelden(kennung) {
  return h('span', { class: 'kennung-zeile' }, h('code', { class: 'kennung' }, kennung),
    gesperrt(kennung) && h('span', { class: 'marke schlecht' }, 'gesperrt'),
    z.schule && h('button', { class: 'link klein', 'data-melden': kennung, onclick: (ev) => { ev.stopPropagation(); z.melden = { kennung, art: '', satz: '' }; male(); } }, 'Aufgabe melden'));
}
function aktuelleAufgabe(code) {
  const id = z.staende.find((s) => s.code === code)?.stand.aktiv?.aufgabe;
  if (!id) return null;
  return h('div', { class: 'karte aktuelle-aufgabe', id: 'aktuelle-aufgabe' }, h('span', { class: 'klein' }, 'Gerade bei: '), aufgabentext(id), ' ', kennungMitMelden(id));
}
async function ladeMeldungsStatus() {
  try { z.meldungsStatus = JSON.parse(await z.schule.lehrer.lies(M.STATUS_DATEI)) ?? {}; } catch { z.meldungsStatus = {}; }
}
function meldeDialog() {
  const m = z.melden, a = z.index.aufgabe.get(m.kennung.trim());
  const zu = () => { z.melden = null; male(); };
  const senden = async () => {
    try {
      const neu = M.neueMeldung({ ...m, klasse: z.klasse, t: jetzt() });
      (z.daten.meldungen ??= []).push(neu);
      await speichereLehrer();
      z.melden = null; z.meldungGesendet = neu.kennung; male();
    } catch (e) { m.fehler = e.message; male(); }
  };
  return h('div', { class: 'overlay', onclick: (ev) => { if (ev.target.classList.contains('overlay')) zu(); } },
    h('div', { class: 'overlay-inhalt schmal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Aufgabe melden', id: 'melde-dialog' },
      h('h2', {}, 'Aufgabe melden'),
      h('p', { class: 'klein' }, 'Die Meldung geht an den Administrator. Er prüft die Aufgabe, korrigiert sie und kann sie bis dahin für alle Schüler sperren.'),
      h('label', {}, 'Kennung ', h('input', { id: 'melde-kennung', type: 'text', size: 18, value: m.kennung, oninput: (ev) => { m.kennung = ev.target.value; } })),
      a ? h('p', { class: 'tafel-klein' }, aufgabentext(a.id), h('br'), h('span', { class: 'klein' }, `Lösung im Pool: ${loesungVon(a)}`)) : h('p', { class: 'klein' }, 'Diese Kennung steht nicht im Aufgabenpool. Prüfe, ob du sie richtig abgeschrieben hast.'),
      h('div', { class: 'reihe' }, Object.entries(M.ARTEN).map(([wert, text]) => h('label', { class: 'schalter' },
        h('input', { type: 'radio', name: 'melde-art', value: wert, checked: m.art === wert, onchange: () => { m.art = wert; if (m.fehler) { m.fehler = null; male(); } } }), ` ${text}`))),
      h('input', { id: 'melde-satz', type: 'text', maxLength: M.MAX_SATZ, placeholder: 'Was stimmt nicht? (ein Satz, freiwillig)', value: m.satz, oninput: (ev) => { m.satz = ev.target.value; }, style: 'width:100%' }),
      m.fehler && h('p', { class: 'fehlertext' }, m.fehler),
      h('div', { class: 'reihe' }, h('button', { class: 'haupt', id: 'melde-senden', onclick: senden }, 'Melden'), h('button', { class: 'schlicht', onclick: zu }, 'Abbrechen'))));
}
function meldungenKarte() {
  if (z.meldungsStatus === undefined) { z.meldungsStatus = null; ladeMeldungsStatus().then(male); }
  const eigene = M.sammle({ [z.schule.kuerzel]: z.daten.meldungen ?? [] }, z.meldungsStatus ?? {}, z.schule.verzeichnis.gesperrt ?? []);
  return h('section', { class: 'karte', id: 'meldungen' }, h('div', { class: 'reihe' }, h('h2', {}, 'Aufgabenmeldungen'),
    h('button', { class: 'schlicht rechts', id: 'melden-frei', onclick: () => { z.melden = { kennung: '', art: '', satz: '' }; male(); } }, 'Aufgabe melden')),
    h('p', { class: 'klein' }, 'Ist eine Aufgabe fehlerhaft oder nicht lösbar, melde sie mit ihrer Kennung. Die Schüler sehen die Kennung klein unten links, du siehst sie hier, in der Akut-Zone und bei jedem Schüler. Der Administrator behebt die Aufgabe.'),
    z.meldungGesendet && h('p', { class: 'meldung warnung', id: 'meldung-gesendet' }, `Aufgabe ${z.meldungGesendet} gemeldet.`),
    eigene.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Kennung', 'Gemeldet', 'Was', 'Stand'].map((t) => h('th', {}, t)))),
      h('tbody', {}, eigene.map((g) => h('tr', {}, h('td', {}, h('code', { class: 'kennung' }, g.kennung)), h('td', {}, new Date(g.zuletzt).toLocaleDateString('de-DE')),
        h('td', {}, g.arten.map((x) => M.ARTEN[x]).join(', ')),
        h('td', {}, M.STATUS[g.status], g.gesperrt && [' ', h('span', { class: 'marke schlecht' }, 'gesperrt')])))))));
}

// ---------- Tafelbild (ADR 0014) ----------
// Vollbild für den Beamer: eine Aufgabe und die häufigsten falschen Antworten der Klasse, ohne Codes und Namen.
const loesungVon = M.loesungVon;
function tafelbildAnsicht() {
  const t = z.tafel, a = z.index.aufgabe.get(t.aufgabe);
  const zu = () => { z.tafel = null; male(); };
  if (!a) { z.tafel = null; return null; }
  const bild = A.tafelbild(angemeldet(), a.id);
  const groesste = Math.max(1, ...bild.falsche.map((f) => f.anzahl));
  setTimeout(() => wurzel.querySelector('.tafelbild')?.focus());
  return h('div', { class: 'tafelbild', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Tafelbild', tabindex: -1, onkeydown: (ev) => { if (ev.key === 'Escape') zu(); } },
    h('div', { class: 'tafel-kopf' }, h('span', {}, `Aufgabe · ${lernzieltext(a.lernziel)}`),
      h('span', { class: 'rechts reihe' }, h('button', { class: 'schlicht', id: 'tafel-loesung', onclick: () => { t.loesung = !t.loesung; male(); } }, t.loesung ? 'Lösung verbergen' : 'Lösung zeigen'),
        h('button', { class: 'haupt', id: 'tafel-zu', onclick: zu }, 'Schließen'))),
    h('p', { class: 'tafel-aufgabe' }, aufgabentext(a.id)),
    a.format === 'auswahl' && h('ul', { class: 'tafel-optionen' }, a.optionen.map((o) => h('li', {}, o.text))),
    a.format === 'zuordnen' && h('ul', { class: 'tafel-optionen' }, a.paare.map((p) => h('li', {}, p.links))),
    a.teile && h('ol', { class: 'tafel-optionen' }, a.teile.map((x) => h('li', {}, x.text))),
    h('h2', {}, 'Antworten aus der Klasse'),
    bild.falsche.length === 0 ? h('p', {}, 'Noch keine falschen Antworten.')
      : h('ul', { class: 'tafel-balken' }, bild.falsche.map((f) => h('li', {}, h('b', {}, f.antwort), h('span', { class: 'spur' }, h('i', { style: `width:${Math.round((f.anzahl / groesste) * 100)}%` })), h('span', {}, `${f.anzahl}-mal`)))),
    h('p', { class: 'tafel-fuss' }, `${bild.richtig} von ${bild.bearbeitet} Bearbeitungen im ersten Versuch richtig.`),
    t.loesung && h('p', { class: 'tafel-loesung' }, h('b', {}, 'Lösung: '), loesungVon(a)),
    h('p', { class: 'tafel-frage' }, 'Wie könnte man auf diese Antworten kommen? Was wurde dabei gedacht?'));
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
          const erreicht = stand && status !== 'gemeistert' ? L.krone(z.index, stand, st) : null;
          return h('td', {}, h('button', { class: `sperre ${gesperrt ? 'zu' : status}`, 'data-sperre': `${st.id}|${code}`, 'aria-pressed': String(gesperrt), onclick: () => setze(st.id, [code], !gesperrt) },
            gesperrt ? '🔒 gesperrt' : status === 'gemeistert' ? '✓ gemeistert' : erreicht ? `${erreicht} erreicht, Ziel ${ziel(code)}` : status === 'begonnen' ? 'offen, begonnen' : 'offen'));
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
  gefestigt: ['Gefestigt', '★'], siegel: ['Siegel', '✓'], aufzufrischen: ['Aufzufrischen', '↻'], wackelig: ['Wackelig', '!'], begonnen: ['Begonnen', '…'], offen: ['Nicht begonnen', '·'],
};
const ZUSTAND_TEXT = {
  gefestigt: 'Siegel und mindestens eine Woche später im Rückblick oder Seitenblick richtig gelöst', siegel: 'Lernziel erreicht', aufzufrischen: 'Siegel vorhanden, aber im Rückblick falsch gelöst', wackelig: 'begonnen, aber viele Fehlversuche oder Lösungsschritt-Kärtchen', begonnen: 'begonnen', offen: 'noch nicht begonnen',
};
const zustandLegende = () => h('ul', { class: 'zlegende', 'aria-label': 'Zeichenerklärung' },
  Object.entries(ZUSTAND).map(([id, [titel, zeichen]]) => h('li', {}, h('i', { class: `zelle ${id}` }, zeichen), titel)));
const gehe = (ls) => { z.ls = ls; male(); window.scrollTo?.(0, 0); };
const lernziel = (id) => A.lernzieleMitAufgaben(z.pool, z.index).find((l) => l.id === id);
const kurzname = (l) => `${l.milestone} ${l.id.split('-').pop()}`;
const angemeldet = () => alleCodes().map((code) => ({ code, stand: z.staende.find((x) => x.code === code)?.stand })).filter((x) => x.stand);

function lernstand() {
  if (alleCodes().length === 0) return h('section', { class: 'karte' }, h('p', {}, 'Lege zuerst unter „Klasse“ die Namensliste an.'));
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
  const filter = lernstandFilter(staende, lernziele);
  const gezeigt = filter.aktiv ? staende.filter(({ code }) => filter.aktiv.treffer.has(code)) : staende;
  const matrix = A.lernzielmatrix(gezeigt, lernziele, kl().einst.zielniveaus);
  const sicht = z.lsSicht ?? 'lernziele';
  const versuche = staende.flatMap(({ stand }) => stand.versuche);
  const heuteAktiv = staende.filter(({ stand }) => stand.versuche.some((v) => new Date(v.t).toLocaleDateString('sv-SE') === heute())).length;
  const fehlen = codes.filter((c) => !staende.some((x) => x.code === c));
  const auff = staende.flatMap(({ code, stand }) => [...A.auffaelligkeiten(stand, ziel(code), jetzt()), ...A.pruefeStand(stand, ziel(code)).map((text) => ({ art: 'datei', text }))].map((a) => ({ code, ...a })));
  return h('div', {},
    h('section', { class: 'kennzahlen' },
      kennzahl(zellen.filter((c) => A.hatSiegel(c.status)).length, 'Siegel in der Klasse', `von ${zellen.length} möglichen`),
      kennzahl(zellen.filter((c) => c.status === 'wackelig').length, 'wackelige Lernziele', 'genauer hinschauen'),
      kennzahl(prozent(versuche.length ? versuche.filter((v) => v.richtig).length / versuche.length : null), 'Lösungsquote', `${versuche.length} Aufgaben`),
      kennzahl(`${heuteAktiv} von ${codes.length}`, 'heute aktiv', fehlen.length ? `${fehlen.length} noch nie angemeldet` : null)),
    h('section', { class: 'karte' },
      h('div', { class: 'reihe' }, h('h2', {}, 'Wer steht wo?'), auswahl,
        h('div', { class: 'umschalter', role: 'group', 'aria-label': 'Heatmap zeigt' }, [['lernziele', 'nach Lernzielen'], ['fehler', 'nach Fehlvorstellungen']].map(([id, text]) =>
          h('button', { 'data-sicht': id, 'aria-pressed': String(sicht === id), onclick: () => { z.lsSicht = id; male(); } }, text))),
        h('span', { class: 'rechts' }, sicht === 'lernziele' ? zustandLegende() : fehlerLegende())),
      filter.leiste,
      sicht === 'lernziele'
        ? [h('p', { class: 'klein' }, 'Eine Zeile pro Schüler, eine Spalte pro Lernziel. Tippe auf einen Namen, um den Schüler zu öffnen, oder auf ein Lernziel, um zu sehen, woran die Klasse dort hängt.'),
          heatmap(matrix, lernziele, true)]
        : fehlerHeatmap(gezeigt, lernziele),
      fehlen.length > 0 && h('p', { class: 'klein' }, `Noch nicht angemeldet: ${fehlen.map(name).join(', ')}.`)),
    h('section', { class: 'karte' },
      h('h2', {}, 'Lernziele im Vergleich'),
      h('p', { class: 'klein' }, 'Wie viele Schüler bei jedem Lernziel wo stehen. Tippe auf eine Zeile für die Einzelheiten.'),
      lernzielBalken(matrix, lernziele)),
    h('section', { class: 'karte', id: 'kompetenz-klasse' }, h('h2', {}, 'Kompetenzprofil der Klasse'),
      h('p', { class: 'klein' }, kompetenzErklaerung), kompetenzNetz(A.kompetenzProfil(versuche, z.index), null, 'Kompetenzprofil der Klasse')),
    hoftitelKlasse(staende),
    selbsteinschaetzungKlasse(staende),
    vorwissenKlasse(staende),
    heftUndSicherheitKlasse(staende),
    h('details', { class: 'karte aufklapp' }, h('summary', {}, h('h2', {}, `Auffälligkeiten (${auff.length})`)),
      auff.length === 0 ? h('p', { class: 'klein' }, 'Keine Auffälligkeiten.') : h('ul', { class: 'liste' }, auff.map((a) => h('li', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: a.code }) }, name(a.code)), `: ${lesbar(a.text)}`)))),
    meilensteineSperren());
}

// Hoftitel (ADR 0023): wer gerade einen der fünf Titel trägt, mit Namen, Punkten und Niveaustufen.
function hoftitelKlasse(staende) {
  const an = kl().einst.ehrentafel !== false;
  const v = L.hoftitelVergabe(z.pool, z.index, staende.map(({ code, stand }) => ({ id: code, stand })));
  return h('section', { class: 'karte', id: 'hoftitel-lehrer' }, h('h2', {}, 'Hoftitel'),
    h('p', { class: 'klein' }, `${an ? 'Jeder dieser Schüler sieht' : 'Ausgeschaltet. Eingeschaltet sähe jeder dieser Schüler'} seinen Titel oben in der Kopfzeile, sonst nirgends; die Mitschüler sehen ihn nicht. Punkte: je Meilenstein die beste Krone (F 1, G 2, M 4, E 6), dazu 1 je Siegel; ein Titel erst ab einer Krone auf G. Die Werte kommen aus den Speicherständen der Schüler und sind deshalb nicht fälschungssicher.`),
    v.length === 0 ? h('p', { class: 'klein' }, 'Noch hat niemand eine Krone auf G oder besser.')
      : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Platz', 'Hoftitel', 'Name', 'Punkte', ...L.NIVEAUS, 'Siegel'].map((x) => h('th', {}, L.NIVEAUS.includes(x) ? chip(x) : x)))),
        h('tbody', {}, v.map((e) => h('tr', { 'data-ehre': e.id },
          h('td', { class: 'zahl' }, e.platz),
          h('td', {}, e.titel.name),
          h('td', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: e.id }) }, name(e.id))),
          h('td', { class: 'zahl' }, e.wert.punkte),
          L.NIVEAUS.map((n) => h('td', { class: 'zahl' }, e.wert.kronen[n])),
          h('td', { class: 'zahl' }, e.wert.siegel)))))));
}

// Vorwissen aus dem Einstiegscheck (ADR 0014): je Kapitel, in dem jemand ihn gemacht oder übersprungen hat.
function vorwissenKlasse(staende) {
  const kapitel = z.pool.kapitel.filter((k) => staende.some(({ stand }) => stand.einstieg?.[k.id]));
  if (kapitel.length === 0) return null;
  return h('section', { class: 'karte', id: 'vorwissen' }, h('h2', {}, 'Vorwissen aus dem Einstiegscheck'),
    h('p', { class: 'klein' }, 'Ergebnisse vor dem ersten Meilenstein eines Kapitels, je Meilenstein der Anteil gelöster Aufgaben (G und M, ohne Hilfen, ein Versuch). Sie zählen für kein Lernziel und für kein Siegel.'),
    kapitel.map((k) => {
      const v = A.vorwissen(staende, z.pool, k.id);
      const verteilung = L.NIVEAUS.filter((n) => v.empfehlungen[n]).map((n) => `${v.empfehlungen[n]} × ${n}`).join(', ');
      return h('div', { class: 'vorwissen-kapitel' }, h('h3', {}, k.titel),
        h('p', {}, `${v.fertig} ${v.fertig === 1 ? 'Schüler hat' : 'Schüler haben'} den Einstiegscheck gemacht${v.uebersprungen ? `, ${v.uebersprungen} übersprungen` : ''}.${verteilung ? ` Vorgeschlagenes Niveau: ${verteilung}.` : ''}`),
        v.meilensteine.length > 0 && balkenListe(v.meilensteine.map((m) => ({ name: m.titel, wert: m.quote ?? 0, zusatz: `${m.richtig} von ${m.gesamt}` })), { max: 1, format: prozent }));
    }));
}

// Heftcheck und Sicherheitsangabe der Klasse (ADR 0014). Die Sicherheitsangabe ist eine Probe: Nach etwa vier Wochen auswerten.
function heftUndSicherheitKlasse(staende) {
  const heft = staende.map(({ code, stand }) => ({ code, ...A.heftQuote(stand) })).filter((x) => x.gesamt > 0);
  const p = A.sicherheitsProfil(staende.flatMap(({ stand }) => stand.versuche));
  if (heft.length === 0 && p.gesamt === 0) return null;
  const summe = heft.reduce((n, x) => n + x.gesamt, 0), richtig = heft.reduce((n, x) => n + x.richtig, 0);
  const auffaellig = heft.filter((x) => x.gesamt >= 2 && x.quote < 0.7);
  const sicherFalsch = staende.map(({ code, stand }) => ({ code, n: A.sicherheitsProfil(stand.versuche).sicherFalsch })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 5);
  return h('section', { class: 'karte', id: 'heft-sicherheit' }, h('h2', {}, 'Heftcheck und Sicherheitsangabe'),
    heft.length > 0 && h('div', {}, h('h3', {}, 'Heftcheck'),
      h('p', {}, `${richtig} von ${summe} Heftchecks richtig (${prozent(richtig / summe)}).`),
      auffaellig.length > 0 && h('p', { class: 'klein' }, `Weniger als 70 % richtig: ${auffaellig.map((x) => `${name(x.code)} (${x.richtig} von ${x.gesamt})`).join(', ')}. Ein Blick ins Heft lohnt sich.`)),
    p.gesamt > 0 && h('div', {}, h('h3', {}, 'Sicherheitsangabe (Probe)'),
      h('table', { class: 'tabelle vierfeld' },
        h('thead', {}, h('tr', {}, h('th', {}, ''), h('th', {}, 'im 1. Versuch richtig'), h('th', {}, 'nicht im 1. Versuch'))),
        h('tbody', {},
          h('tr', {}, h('th', {}, 'sicher'), h('td', { class: 'zahl' }, p.sicherRichtig), h('td', { class: 'zahl fehlertext' }, h('b', {}, p.sicherFalsch), ' sicher falsch')),
          h('tr', {}, h('th', {}, 'unsicher'), h('td', { class: 'zahl' }, p.unsicherRichtig), h('td', { class: 'zahl' }, p.unsicherFalsch)))),
      h('p', { class: 'klein' }, '„Sicher falsch“ ist das stärkste Zeichen einer Fehlvorstellung. „Unsicher richtig“ heißt oft: Das Wissen ist da, aber noch nicht gefestigt.'),
      p.fehler.length > 0 && h('p', { class: 'klein' }, h('b', {}, 'Häufigste Fehler bei „sicher falsch“: '), p.fehler.slice(0, 3).map((f) => `${z.pool.fehlvorstellungen[f.fehlvorstellung]?.beschreibung ?? f.fehlvorstellung} (${f.anzahl}-mal)`).join('; ')),
      sicherFalsch.length > 0 && h('p', { class: 'klein' }, h('b', {}, 'Am häufigsten sicher falsch: '), sicherFalsch.map((x) => `${name(x.code)} (${x.n})`).join(', '))));
}

// Heatmap Schüler × Lernziel, nach Meilensteinen gruppiert.
// Selbsteinschätzung je Schüler: erste Wahl am Meilenstein gegen das erste erreichte Niveau (ADR 0012).
function selbsteinschaetzungKlasse(staende) {
  const zeilen = staende.map(({ code, stand }) => ({ code, ...A.selbsteinschaetzung(stand, z.pool) })).filter((x) => x.liste.length > 0);
  return h('section', { class: 'karte', id: 'selbsteinschaetzung' }, h('h2', {}, 'Selbsteinschätzung'),
    h('p', { class: 'klein' }, `Beim ersten Start eines Meilensteins wählt jeder Schüler ein Niveau. Verglichen wird es mit dem Niveau, auf dem er dort zuerst alle Lernziele nachweist. Wer vorher absteigt, hat sich überschätzt. Eine Tendenz steht ab ${A.SELBSTEINSCHAETZUNG_AB} bewerteten Meilensteinen da.`),
    zeilen.length === 0 ? h('p', { class: 'klein' }, 'Noch hat niemand einen Meilenstein mit Niveauwahl begonnen.')
      : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Selbsteinschätzung', 'unterschätzt', 'passend', 'überschätzt'].map((t) => h('th', {}, t)))),
        h('tbody', {}, zeilen.map((x) => h('tr', {}, h('td', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: x.code }) }, name(x.code))),
          h('td', {}, x.tendenz ? h('b', {}, x.tendenz) : h('span', { class: 'klein' }, `noch zu wenig (${x.bewertet} von ${A.SELBSTEINSCHAETZUNG_AB})`)),
          h('td', { class: 'zahl' }, x.unter), h('td', { class: 'zahl' }, x.passend), h('td', { class: 'zahl' }, x.ueber)))))));
}

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
      h('td', { class: 'summe' }, zeile.zellen.filter((c) => A.hatSiegel(c.status)).length))))));
}

// ---------- Lernen sichtbar machen (ADR 0017) ----------
// Filter über der Heatmap: alle, braucht viel Hilfe, überschätzt, unterschätzt. Unter der Leiste stehen die Gründe.
function lernstandFilter(staende, lernziele) {
  const ids = lernziele.map((l) => l.id);
  const hilfe = new Map(), ueber = new Map(), unter = new Map();
  for (const { code, stand } of staende) {
    const viel = A.vielHilfe(stand, ids);
    if (viel.length) hilfe.set(code, viel.map((x) => `${kurzname(lernziel(x.lernziel))} (${x.mitHilfe} von ${x.letzte})`).join(', '));
    const d = A.diskrepanz(stand, z.pool);
    if (d.ueberschaetzt) ueber.set(code, d.gruende.ueber.join('; '));
    if (d.unterschaetzt) unter.set(code, d.gruende.unter.join('; '));
  }
  const filter = {
    hilfe: { titel: 'Braucht viel Hilfe', treffer: hilfe, erklaerung: 'Beispiel oder Lösungsschritt in mindestens der Hälfte der letzten 10 Aufgaben eines Lernziels (ab 4 Aufgaben). Der Tipp zählt nicht.' },
    ueber: { titel: 'Überschätzt sich', treffer: ueber, erklaerung: 'Mindestens 3-mal „sicher falsch“ in den letzten 20 Aufgaben, oder am Meilenstein eher zu hoch gewählt.' },
    unter: { titel: 'Unterschätzt sich', treffer: unter, erklaerung: 'Mindestens die Hälfte von mindestens 6 „unsicher“-Antworten im ersten Versuch richtig, oder am Meilenstein eher zu niedrig gewählt.' },
  };
  if (!filter[z.lsFilter]) z.lsFilter = null;
  const aktiv = z.lsFilter ? filter[z.lsFilter] : null;
  const knopf = (id, text, n) => h('button', { 'data-filter': id ?? 'alle', 'aria-pressed': String((z.lsFilter ?? null) === id), onclick: () => { z.lsFilter = id; male(); } }, text, n != null && h('b', {}, ` ${n}`));
  const leiste = h('div', { class: 'filterleiste', id: 'ls-filter' },
    h('div', { class: 'umschalter', role: 'group', 'aria-label': 'Schüler filtern' },
      knopf(null, 'Alle'), Object.entries(filter).map(([id, f]) => knopf(id, f.titel, f.treffer.size))),
    aktiv && h('div', { class: 'filtergruende' }, h('p', { class: 'klein' }, aktiv.erklaerung),
      aktiv.treffer.size === 0 ? h('p', { class: 'klein' }, 'Niemand in der Klasse.')
        : h('ul', { class: 'liste' }, [...aktiv.treffer].sort((a, b) => name(a[0]).localeCompare(name(b[0]), 'de')).map(([code, grund]) =>
          h('li', {}, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code }) }, name(code)), `: ${grund}`)))));
  return { aktiv, leiste };
}

const FEHLER_ZUSTAND = { aktiv: ['Aktiv', '!'], ueberwunden: ['Überwunden', '✓'], nie: ['Nie gezeigt', '·'] };
const fehlerLegende = () => h('ul', { class: 'zlegende', 'aria-label': 'Zeichenerklärung' },
  Object.entries(FEHLER_ZUSTAND).map(([id, [titel, zeichen]]) => h('li', {}, h('i', { class: `zelle fv-${id}` }, zeichen), titel)));
const fehlerName = (f) => z.pool.fehlvorstellungen[f]?.beschreibung ?? f;

// Heatmap Schüler × Fehlvorstellung (ADR 0017): Überwunden heißt drei richtige Aufgaben desselben Lernziels ohne den Fehler.
function fehlerHeatmap(staende, lernziele) {
  const m = A.fehlvorstellungsMatrix(staende, z.pool, lernziele.map((l) => l.id));
  if (m.spalten.length === 0) return h('p', { class: 'klein', id: 'fehler-heatmap' }, 'In diesen Kapiteln hat noch niemand einen typischen Fehler gemacht.');
  const zeilen = [...m.zeilen].sort((a, b) => name(a.code).localeCompare(name(b.code), 'de'));
  const zelle = (code, s, c) => {
    const art = c ? c.status : 'nie';
    const titel = `${name(code)} · ${fehlerName(s.fehlvorstellung)}: ${c ? `${FEHLER_ZUSTAND[art][0]} (${c.anzahl}-mal gezeigt)` : 'nie gezeigt'}`;
    return h('td', { class: `zelle fv-${art}`, title: titel }, FEHLER_ZUSTAND[art][1]);
  };
  return h('div', { id: 'fehler-heatmap' },
    h('p', { class: 'klein' }, 'Eine Zeile pro Schüler, eine Spalte pro typischem Fehler, die Fehler mit den meisten aktiven Schülern links. Überwunden ist ein Fehler, wenn danach drei Aufgaben desselben Lernziels ohne ihn richtig waren. Taucht er wieder auf, ist er wieder aktiv.'),
    h('div', { class: 'rollbar' }, h('table', { class: 'heatmap fehlermap' },
      h('thead', {}, h('tr', {}, h('th', { class: 'name' }, 'Name'),
        m.spalten.map((s, i) => h('th', { class: 'kurz', title: fehlerName(s.fehlvorstellung) }, String(i + 1))), h('th', { class: 'summe' }, 'aktiv'))),
      h('tbody', {}, zeilen.map((zeile) => h('tr', {},
        h('th', { class: 'name', scope: 'row' }, h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code: zeile.code }) }, name(zeile.code))),
        zeile.zellen.map((c, i) => zelle(zeile.code, m.spalten[i], c)),
        h('td', { class: 'summe' }, zeile.zellen.filter((c) => c?.status === 'aktiv').length)))))),
    h('ol', { class: 'fehlerspalten klein' }, m.spalten.map((s) => h('li', {}, fehlerName(s.fehlvorstellung), h('span', { class: 'zahlen' }, ` · ${s.aktiv} aktiv, ${s.ueberwunden} überwunden`)))),
    m.nieGezeigt > 0 && h('p', { class: 'klein' }, `${m.nieGezeigt} weitere typische Fehler dieser Kapitel kamen in der Klasse noch nicht vor.`));
}

// Kompetenzprofil als Netzdiagramm (ADR 0017): fünf Achsen von 0 bis 100 %, der Schüler als Fläche,
// die Klasse als gestrichelte Linie zum Vergleich. Achsen mit weniger als 6 Aufgaben bleiben grau und ohne Punkt.
function kompetenzNetz(profil, vergleich = null, titel = 'Kompetenzprofil') {
  const R = 92, M = 150, reihe = A.KOMPETENZ_REIHE;
  const winkel = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / reihe.length;
  const punkt = (i, r) => [M + r * Math.cos(winkel(i)), M + r * Math.sin(winkel(i))].map((x) => Math.round(x * 10) / 10);
  const flaeche = (p) => reihe.map((k, i) => punkt(i, R * (p[k].quote ?? 0)).join(',')).join(' ');
  const name = (k) => z.pool.kompetenzen?.[k] ?? k;
  const kurz = { symbolisch: 'Symbolisch', 'probleme-loesen': 'Probleme lösen', modellieren: 'Modellieren', argumentieren: 'Argumentieren', kommunizieren: 'Kommunizieren' };
  const leer = reihe.every((k) => profil[k].quote == null);
  const bild = svg('svg', { viewBox: '-60 10 420 280', class: 'netz', role: 'img', 'aria-label': `${titel}: ${reihe.map((k) => `${name(k)} ${profil[k].quote == null ? 'noch zu wenig' : prozent(profil[k].quote)}`).join(', ')}` },
    [0.25, 0.5, 0.75, 1].map((f) => svg('polygon', { class: 'ring', points: reihe.map((_, i) => punkt(i, R * f).join(',')).join(' ') })),
    reihe.map((k, i) => svg('line', { class: `achse${profil[k].quote == null ? ' grau' : ''}`, x1: M, y1: M, x2: punkt(i, R)[0], y2: punkt(i, R)[1] })),
    vergleich && svg('polygon', { class: 'klasse', points: flaeche(vergleich) }),
    !leer && svg('polygon', { class: 'schueler', points: flaeche(profil) }),
    reihe.map((k, i) => profil[k].quote != null && svg('circle', { class: 'punkt', cx: punkt(i, R * profil[k].quote)[0], cy: punkt(i, R * profil[k].quote)[1], r: 5 },
      svg('title', {}, `${name(k)}: ${prozent(profil[k].quote)} (${profil[k].gut} von ${profil[k].bearbeitet} Aufgaben im ersten Versuch ohne Beispiel und Lösungsschritt)`))),
    reihe.map((k, i) => { const [x, y] = punkt(i, R + 20); return svg('text', { x, y, class: `beschriftung${profil[k].quote == null ? ' grau' : ''}`, 'text-anchor': x < M - 10 ? 'end' : x > M + 10 ? 'start' : 'middle', 'dominant-baseline': y < M - 10 ? 'auto' : y > M + 10 ? 'hanging' : 'middle' }, kurz[k]); }));
  return h('div', { class: 'kompetenzprofil' }, bild,
    h('table', { class: 'tabelle kompetenztabelle' },
      h('thead', {}, h('tr', {}, h('th', {}, 'Kompetenz'), h('th', {}, vergleich ? 'Schüler' : 'Klasse'), vergleich && h('th', {}, 'Klasse'))),
      h('tbody', {}, reihe.map((k) => h('tr', {}, h('td', {}, name(k)),
        h('td', { class: 'zahl' }, profil[k].quote == null ? h('span', { class: 'klein' }, `noch zu wenig (${profil[k].bearbeitet})`) : prozent(profil[k].quote)),
        vergleich && h('td', { class: 'zahl' }, vergleich[k].quote == null ? '–' : prozent(vergleich[k].quote)))))),
    vergleich && h('p', { class: 'klein netzlegende' }, h('i', { class: 'muster schueler' }), ' Schüler ', h('i', { class: 'muster klasse' }), ' Klasse'));
}
const kompetenzErklaerung = `Anteil der Aufgaben je prozessbezogener Kompetenz, die im ersten Versuch ohne Beispiel und Lösungsschritt richtig waren, über das ganze Schuljahr. Unter ${A.KOMPETENZ_AB} Aufgaben bleibt die Achse grau.`;

const TREND_TEXT = { weniger: 'braucht weniger Hilfe', gleich: 'gleich', mehr: 'braucht mehr Hilfe' };
const hilfeAnteil = (x) => (x == null ? '–' : prozent(x));
// Hilfebedarf je Lernziel: Anteil mit Beispiel oder Lösungsschritt in der ersten und zweiten Hälfte der Aufgaben.
function hilfebedarfTabelle(zeilen, erste) {
  return h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'hilfebedarf' },
    h('thead', {}, h('tr', {}, [erste, 'Aufgaben', 'Hilfe in den letzten 10', 'erste Hälfte', 'zweite Hälfte', 'Trend'].map((t) => h('th', {}, t)))),
    h('tbody', {}, zeilen.map((x) => h('tr', {}, h('td', {}, x.name, x.viel && h('span', { class: 'marke schlecht' }, 'viel Hilfe')),
      h('td', { class: 'zahl' }, x.bearbeitet), h('td', { class: 'zahl' }, `${x.mitHilfe} von ${x.letzte}`),
      h('td', { class: 'zahl' }, hilfeAnteil(x.vorher)), h('td', { class: 'zahl' }, hilfeAnteil(x.nachher)),
      h('td', {}, x.trend ? h('span', { class: `trend ${x.trend}` }, TREND_TEXT[x.trend]) : h('span', { class: 'klein' }, `ab ${L.HILFE_TREND_AB} Aufgaben`)))))));
}

// Gestapelte Balken je Lernziel: Siegel, begonnen, wackelig, nicht begonnen.
function lernzielBalken(matrix, lernziele) {
  const reihenfolge = ['gefestigt', 'siegel', 'aufzufrischen', 'begonnen', 'wackelig', 'offen'];
  return h('ul', { class: 'stapel' }, lernziele.map((l, i) => {
    const anzahl = Object.fromEntries(reihenfolge.map((s) => [s, matrix.filter((m) => m.zellen[i].status === s).length]));
    const gesamt = matrix.length || 1;
    return h('li', {}, h('button', { class: 'stapelzeile', 'data-lernziel-balken': l.id, onclick: () => gehe({ art: 'lernziel', id: l.id }) },
      h('span', { class: 'stapelname' }, h('small', {}, kurzname(l)), l.text),
      h('span', { class: 'stapelbalken', role: 'img', 'aria-label': reihenfolge.map((s) => `${anzahl[s]} ${ZUSTAND[s][0]}`).join(', ') },
        reihenfolge.filter((s) => anzahl[s]).map((s) => h('i', { class: `teil zelle ${s}`, style: `flex-grow:${anzahl[s] / gesamt}`, title: `${ZUSTAND[s][0]}: ${anzahl[s]}` }, anzahl[s] / gesamt >= 0.12 ? anzahl[s] : ''))),
      h('span', { class: 'stapelzahl' }, `${anzahl.gefestigt + anzahl.siegel + anzahl.aufzufrischen}/${matrix.length}`)));
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
  const gruppen = { gefestigt: [], siegel: [], aufzufrischen: [], wackelig: [], begonnen: [], offen: [] };
  for (const { code, stand } of staende) gruppen[A.lernzielZustand(stand, id)].push(code);
  const fehler = A.fehlerZuLernziel(staende, id).slice(0, 6);
  const nachNiveau = L.NIVEAUS.map((n) => { const x = v.filter((y) => y.niveau === n); return { n, bearbeitet: x.length, quote: x.length ? x.filter((y) => y.richtig).length / x.length : 0 }; }).filter((x) => x.bearbeitet);
  const audit = A.aufgabenAudit(staende, z.index, 2).filter((a) => a.lernziel === id).slice(0, 5);
  return h('div', {},
    h('section', { class: 'karte' }, h('p', { class: 'klein' }, `Meilenstein ${l.milestone}`), h('h2', {}, l.text), bautAufListe(id, staende)),
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
      h('section', { class: 'karte' }, h('h2', {}, 'Lösungsquote nach Niveau'),
        nachNiveau.length === 0 ? h('p', { class: 'klein' }, 'Noch keine Aufgaben bearbeitet.')
          : balkenListe(nachNiveau.map((x) => ({ name: [chip(x.n), ` ${L.NIVEAU_NAMEN[x.n]}`], wert: x.quote, zusatz: `· ${x.bearbeitet} Aufgaben` })), { max: 1, format: prozent }))),
    (() => {
      const zeilen = staende.map(({ code, stand }) => ({ name: h('button', { class: 'link', onclick: () => gehe({ art: 'schueler', code }) }, name(code)), sortiert: name(code), ...L.hilfebedarf(stand, id) }))
        .filter((x) => x.bearbeitet > 0).sort((a, b) => Number(b.viel) - Number(a.viel) || a.sortiert.localeCompare(b.sortiert, 'de'));
      return zeilen.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Hilfebedarf'),
        h('p', { class: 'klein' }, 'Wie oft jeder Schüler hier Beispiel oder Lösungsschritt aufgedeckt hat und ob es mit der Zeit weniger wird. Der Tipp zählt nicht, weil er sich von selbst öffnet.'),
        hilfebedarfTabelle(zeilen, 'Name'));
    })(),
    audit.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Schwierigste Aufgaben zu diesem Lernziel'),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Aufgabe', 'Niveau', 'AFB', 'Bearbeitet', 'Lösungsquote', 'Häufigste falsche Antwort'].map((t) => h('th', {}, t)))),
        h('tbody', {}, audit.map((a) => h('tr', {}, h('td', {}, aufgabentext(a.aufgabe), a.auffaellig && h('span', { class: 'marke schlecht' }, 'Prüfen'),
          h('button', { class: 'link', 'data-tafelbild': a.aufgabe, onclick: () => { z.tafel = { aufgabe: a.aufgabe }; male(); } }, ' Tafelbild')), h('td', {}, a.niveau && chip(a.niveau)),
          h('td', { class: 'zahl' }, ['', 'I', 'II', 'III'][a.afb] ?? ''), h('td', { class: 'zahl' }, a.bearbeitet), h('td', {}, balken(a.quote)),
          h('td', {}, a.haeufigsteFalsche ? `${a.haeufigsteFalsche} (${a.haeufigsteAnzahl}-mal)` : '–'))))))));
}

function lernstandSchueler(code) {
  const notiz = h('textarea', { rows: 3, placeholder: z.schule ? 'Notiz, für alle Lehrkräfte der Klasse' : 'Notiz, nur für dich', value: kl().notizen[code] ?? '',
    onchange: (ev) => { const text = ev.target.value; aendere((k) => { k.notizen[code] = text; if (z.schule) (k.notizVon ??= {})[code] = z.schule.kuerzel; }); } });
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

// ---------- Aufgaben: Auswertung nach AFB, Aufgabentyp, Niveau und je Aufgabe ----------
function aufgabenTab() {
  return h('div', {}, z.schule && meldungenKarte(), aufgabenAuswertung());
}
function aufgabenAuswertung() {
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
    gruppenTabelle('Nach Niveau', 'Niveau', u.niveau, (g) => [chip(g.wert), ` ${L.NIVEAU_NAMEN[g.wert]}`]),
    h('section', { class: 'karte' }, h('h2', {}, 'Einzelne Aufgaben'),
      h('div', { class: 'filter' },
        wahl('sicht', 'aufg-sicht', ['Zeige', null], Object.entries(A.AUFGABEN_SICHTEN).map(([id, x]) => [id, x.titel])),
        wahl('milestone', 'aufg-meilenstein', ['Meilenstein', 'Alle Meilensteine'], meilensteine),
        wahl('afb', 'aufg-afb', ['AFB', 'Alle'], Object.entries(A.AFB_NAMEN)),
        wahl('format', 'aufg-format', ['Aufgabentyp', 'Alle'], u.format.map((g) => [g.wert, g.name])),
        wahl('niveau', 'aufg-niveau', ['Niveau', 'Alle'], L.NIVEAUS.map((n) => [n, `${n} · ${L.NIVEAU_NAMEN[n]}`]))),
      f.sicht === 'nie' && h('p', { class: 'klein' }, 'Gezeigt werden nur Aufgaben aus Lernzielen und Niveaustufen, an denen die Klasse schon gearbeitet hat. Sie hätten also drankommen können.'),
      liste.length === 0 ? h('p', { class: 'klein', id: 'aufg-leer' }, 'Keine Aufgabe passt zu dieser Auswahl.') : h('div', { class: 'rollbar' }, h('table', { class: 'tabelle', id: 'aufg-liste' },
        h('thead', {}, h('tr', {}, ['Aufgabe', 'Meilenstein', 'Niveau', 'AFB', 'Typ', 'Bearbeitet', 'Gelöst', 'Lösungsquote', 'Im ersten Versuch', 'Abgebrochen', 'Zeit', 'Häufigste falsche Antwort'].map((t) => h('th', {}, t)))),
        h('tbody', {}, sichtbar.map((a) => h('tr', { 'data-aufgabe': a.aufgabe }, h('td', {}, aufgabentext(a.aufgabe), a.auffaellig && h('span', { class: 'marke schlecht' }, 'Prüfen'), h('br'), kennungMitMelden(a.aufgabe)),
          h('td', {}, a.milestone?.titel ?? ''), h('td', {}, chip(a.niveau)), h('td', { class: 'zahl' }, ['', 'I', 'II', 'III'][a.afb] ?? ''), h('td', {}, A.FORMAT_NAMEN[a.format] ?? a.format),
          h('td', { class: 'zahl' }, a.bearbeitet), h('td', { class: 'zahl' }, a.geloest), h('td', {}, a.bearbeitet ? balken(a.quote) : '–'), h('td', { class: 'zahl' }, prozent(a.ersterVersuch)),
          h('td', { class: 'zahl' }, a.abbrueche || '–'), h('td', { class: 'zahl' }, a.zeitMedian == null ? '–' : `${a.zeitMedian} s`),
          h('td', {}, a.haeufigsteFalsche ? `${a.haeufigsteFalsche} (${a.haeufigsteAnzahl}-mal)` : '–')))))),
      liste.length > sichtbar.length && h('button', { class: 'schlicht', id: 'aufg-alle', onclick: () => { f.alle = true; male(); } }, `Alle ${liste.length} Aufgaben zeigen`)));
}

// ---------- Seite eines Schülers ----------
// Oben drei Kennzahlen, darunter der Weg über die Lernziele, dann Balken und Fehler. Das Protokoll ist zugeklappt.
function heftUndSicherText(stand) {
  const heft = A.heftQuote(stand), sicher = A.sicherheitsProfil(stand.versuche);
  return [heft.gesamt ? ` · Heftcheck ${heft.richtig} von ${heft.gesamt} richtig` : '', sicher.gesamt ? ` · ${sicher.sicherFalsch}-mal sicher falsch` : ''].join('');
}
function einzelInhalt(code, fuerDruck = false) {
  const stand = z.staende.find((s) => s.code === code)?.stand;
  if (!stand) return h('section', { class: 'karte' }, h('p', {}, `${name(code)} hat sich noch nicht angemeldet.`));
  const k = A.kennzahlen(stand, ziel(code), jetzt());
  const auff = A.auffaelligkeiten(stand, ziel(code), jetzt(), !fuerDruck);
  const maengel = A.pruefeStand(stand, ziel(code));
  const lernziele = A.lernzieleMitAufgaben(z.pool, z.index);
  const protokoll = [...stand.versuche].reverse();
  const afb = A.afbProfil(stand, z.index), wirkung = A.hilfenWirkung(stand);
  const fehler = L.fehlvorstellungsStand(stand.versuche).sort((a, b) => (a.status === b.status ? b.anzahl - a.anzahl : a.status === 'aktiv' ? -1 : 1)).slice(0, fuerDruck ? 4 : 8);
  const hilfe = lernziele.map((l) => ({ name: `${kurzname(l)} ${l.text}`, ...L.hilfebedarf(stand, l.id) })).filter((x) => x.bearbeitet >= L.HILFE_MIN);
  const d = A.diskrepanz(stand, z.pool);
  const zuletzt = k.minutenStill == null ? 'noch nie' : k.minutenStill < 2 ? 'gerade eben' : k.minutenStill < 60 ? `vor ${k.minutenStill} min` : new Date(k.letzteAktivitaet).toLocaleDateString('de-DE');
  const gruppen = [];
  for (const l of lernziele) { const g = gruppen.at(-1); if (g?.id === l.unterkapitel) g.ziele.push(l); else gruppen.push({ id: l.unterkapitel, titel: l.milestone, ziele: [l] }); }
  const quote = (x) => ({ wert: x.quote ?? 0, zusatz: `· ${x.bearbeitet} Aufgaben` });
  return h('div', { class: 'schuelerseite' },
    h('section', { class: 'kennzahlen' },
      kennzahl(`${k.siegel} von ${lernziele.length}`, 'Siegel', k.rang),
      kennzahl(ziel(code), 'Zielniveau', L.NIVEAU_NAMEN[ziel(code)]),
      kennzahl(zuletzt, 'zuletzt aktiv')),
    h('p', { class: 'klein nebenwerte' }, `${k.bearbeitet} Aufgaben · ${prozent(k.quote)} gelöst · ${prozent(k.ersterVersuch)} im ersten Versuch · ${k.hilfekaertchen} Hilfekärtchen · ${k.hilferufe} Hilferufe · ${prozent(k.trainingAnteil)} Training`,
      heftUndSicherText(stand)),
    (d.ueberschaetzt || d.unterschaetzt) && h('p', { class: 'diskrepanz', id: 'diskrepanz' }, h('b', {}, 'Einschätzung passt nicht: '),
      [d.ueberschaetzt && `überschätzt sich (${d.gruende.ueber.join('; ')})`, d.unterschaetzt && `unterschätzt sich (${d.gruende.unter.join('; ')})`].filter(Boolean).join(' · ')),
    (auff.length > 0 || maengel.length > 0) && h('ul', { class: 'liste hinweise' }, auff.map((a) => h('li', {}, lesbar(a.text))), maengel.map((m) => h('li', { class: 'fehlertext' }, `Speicherstand passt nicht zum Protokoll: ${m}`))),
    h('section', { class: 'karte' }, h('div', { class: 'reihe' }, h('h2', {}, 'Weg über die Lernziele'), h('span', { class: 'rechts' }, zustandLegende())),
      h('div', { class: 'weg' }, gruppen.map((g) => h('div', { class: 'weggruppe' }, h('small', {}, g.titel),
        h('div', { class: 'wegzellen' }, g.ziele.map((l) => {
          const s = A.lernzielZustand(stand, l.id);
          const titel = `${l.text}: ${ZUSTAND_TEXT[s]}`;
          return fuerDruck ? h('i', { class: `zelle ${s}`, title: titel }, ZUSTAND[s][1])
            : h('button', { class: `zelle ${s}`, title: titel, 'aria-label': titel, onclick: () => gehe({ art: 'lernziel', id: l.id }) }, ZUSTAND[s][1]);
        })))))),
    meilensteineVon(code, stand),
    h('section', { class: 'karte', id: 'kompetenz-schueler' }, h('h2', {}, 'Kompetenzprofil'),
      h('p', { class: 'klein' }, kompetenzErklaerung),
      kompetenzNetz(A.kompetenzProfil(stand.versuche, z.index), A.kompetenzProfil(z.staende.flatMap((x) => x.stand.versuche), z.index), `Kompetenzprofil von ${name(code)}`)),
    h('div', { class: 'zweispaltig' },
      h('section', { class: 'karte' }, h('h2', {}, 'Lösungsquote nach Anforderungsbereich'),
        balkenListe([{ name: 'AFB I · Reproduzieren', ...quote(afb[1]) }, { name: 'AFB II · Zusammenhänge', ...quote(afb[2]) }, { name: 'AFB III · Verallgemeinern', ...quote(afb[3]) }], { max: 1, format: prozent })),
      h('section', { class: 'karte' }, h('h2', {}, 'Wirkung der Hilfekärtchen'),
        balkenListe([{ name: 'ohne Hilfekärtchen', ...quote(wirkung.ohne) }, { name: 'mit Hilfekärtchen', ...quote(wirkung.mit) }, { name: 'im ersten Versuch', wert: k.ersterVersuch ?? 0, zusatz: `· ${k.bearbeitet} Aufgaben` }], { max: 1, format: prozent }))),
    h('div', { class: 'zweispaltig' },
      h('section', { class: 'karte', id: 'fehler-schueler' }, h('h2', {}, 'Typische Fehler'),
        fehler.length ? [balkenListe(fehler.map((f) => ({ name: [h('i', { class: `zelle fv-${f.status}`, title: FEHLER_ZUSTAND[f.status][0] }, FEHLER_ZUSTAND[f.status][1]), ' ', fehlerName(f.fehlvorstellung)], wert: f.anzahl, zusatz: f.status === 'ueberwunden' ? '· überwunden' : '' })), { format: (x) => `${x}-mal` }),
          h('p', { class: 'klein' }, 'Aktive Fehler oben. Überwunden heißt: danach drei Aufgaben desselben Lernziels ohne den Fehler richtig.')]
          : h('p', { class: 'klein' }, 'Noch keine typischen Fehler erkannt.')),
      h('section', { class: 'karte' }, h('h2', {}, 'Niveau der letzten Aufgaben'),
        k.niveauverlauf.length ? h('p', { class: 'verlauf' }, k.niveauverlauf.slice(-40).map(chip)) : h('p', { class: 'klein' }, 'Noch keine Aufgaben.'),
        h('p', { class: 'klein' }, 'Links die älteren, rechts die neuesten Aufgaben.'))),
    hilfe.length > 0 && h('section', { class: 'karte' }, h('h2', {}, 'Hilfebedarf'),
      h('p', { class: 'klein' }, `Lernziele mit mindestens ${L.HILFE_MIN} Aufgaben: Wie oft Beispiel oder Lösungsschritt aufgedeckt wurden und ob es weniger wird.`),
      hilfebedarfTabelle(hilfe, 'Lernziel')),
    !fuerDruck && versuchsverlaufKarte(stand),
    !fuerDruck && h('details', { class: 'karte aufklapp' }, h('summary', {}, h('h2', {}, `Versuchsprotokoll (${protokoll.length})`)),
      h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Wann', 'Aufgabe', 'Niveau', 'Gelöst', 'Versuche', 'Hilfekärtchen', 'Dauer', 'Erkannter Fehler'].map((t) => h('th', {}, t)))),
        h('tbody', {}, protokoll.map((v) => h('tr', {}, h('td', {}, new Date(v.t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })),
          h('td', {}, aufgabentext(v.aufgabe)), h('td', {}, chip(v.niveau)), h('td', {}, v.richtig ? 'ja' : 'nein'), h('td', { class: 'zahl' }, v.versuche), h('td', { class: 'zahl' }, v.hilfen),
          h('td', { class: 'zahl' }, `${v.dauer} s`), h('td', {}, (v.fehlvorstellungen ?? []).map((f) => z.pool.fehlvorstellungen[f]?.beschreibung ?? f).join(' ')))))))));
}
// Liste „baut auf“ (ADR 0017): Voraussetzungen mit Siegeln der Klasse, dazu was darauf aufbaut.
function bautAufListe(id, staende) {
  const b = A.bautAuf(z.pool, id);
  const mitSiegel = (lz) => staende.filter(({ stand }) => stand.lernziele[lz]).length;
  const eintrag = (x) => h('li', {}, z.index.lernzielMitAufgaben.has(x.id)
    ? [h('button', { class: 'link', onclick: () => gehe({ art: 'lernziel', id: x.id }) }, `${x.milestone}: ${x.text}`), h('span', { class: 'klein' }, ` · ${mitSiegel(x.id)} von ${staende.length} mit Siegel`)]
    : [`${x.milestone}: ${x.text}`, h('span', { class: 'klein' }, ' · noch ohne Aufgaben')]);
  return h('div', { class: 'bautauf', id: 'baut-auf' },
    h('div', {}, h('h3', {}, 'Baut auf'), b.auf.length ? h('ul', { class: 'liste' }, b.auf.map(eintrag)) : h('p', { class: 'klein' }, 'Nur auf Grundschulstoff.')),
    b.darauf.length > 0 && h('div', {}, h('h3', {}, 'Darauf baut auf'), h('ul', { class: 'liste' }, b.darauf.map(eintrag))));
}
// Versuchsverlauf (ADR 0017): die letzten 20 Aufgaben mit erstem und zweitem Versuch. Nur für die Lehrkraft.
const KARTEN_KURZ = { tipp: 'Tipp', beispiel: 'Beispiel', loesungsschritt: 'Lösungsschritt' };
function versuchsverlaufKarte(stand) {
  const verlauf = A.versuchsverlauf(stand, 20);
  if (verlauf.length === 0) return null;
  const richtigText = (v) => (v.richtig ? (v.zweiter == null ? 'richtig' : 'im 2. Versuch richtig') : 'nicht gelöst');
  return h('section', { class: 'karte', id: 'versuchsverlauf' }, h('h2', {}, 'Versuchsverlauf'),
    h('p', { class: 'klein' }, 'Die letzten 20 Aufgaben, neueste oben: was im ersten und im zweiten Versuch eingegeben wurde, welcher typische Fehler darin steckt und welche Hilfekärtchen offen waren.'),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle verlauf-tabelle' },
      h('thead', {}, h('tr', {}, ['Wann', 'Aufgabe', 'Niveau', '1. Versuch', '2. Versuch', 'Ergebnis', 'Erkannter Fehler', 'Hilfekärtchen'].map((t) => h('th', {}, t)))),
      h('tbody', {}, verlauf.map((v) => h('tr', { class: v.richtig ? '' : 'falsch' },
        h('td', {}, new Date(v.t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })),
        h('td', {}, aufgabentext(v.aufgabe), v.art && [' ', h('span', { class: 'marke' }, v.art)]), h('td', {}, chip(v.niveau)),
        h('td', { class: 'eingabe' }, v.erster || '–', v.sicher != null && h('small', {}, v.sicher ? ' (sicher)' : ' (unsicher)')),
        h('td', { class: 'eingabe' }, v.zweiter || '–'),
        h('td', {}, richtigText(v)),
        h('td', {}, v.fehlvorstellungen.map(fehlerName).join(' ') || '–'),
        h('td', {}, v.karten.map((k) => KARTEN_KURZ[k]).join(', ') || '–')))))));
}
// Meilensteine eines Schülers: erreichtes Niveau gegen Ziel, dazu die Selbsteinschätzung (ADR 0012).
function meilensteineVon(code, stand) {
  const se = new Map(A.selbsteinschaetzung(stand, z.pool).liste.map((x) => [x.meilenstein, x]));
  const zeilen = z.pool.kapitel.flatMap((k) => k.unterkapitel).filter((u) => L.milestoneStatus(z.index, stand, u) !== 'leer')
    .map((u) => ({ u, status: L.milestoneStatus(z.index, stand, u), erreicht: L.krone(z.index, stand, u), e: se.get(u.id) }))
    .filter((x) => x.status !== 'offen' || x.e);
  if (zeilen.length === 0) return null;
  const zielN = ziel(code);
  return h('section', { class: 'karte', id: 'meilensteine-schueler' }, h('h2', {}, 'Meilensteine'),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Meilenstein', 'Erreicht', 'Ziel', 'Gewählt beim Start', 'Selbsteinschätzung'].map((t) => h('th', {}, t)))),
      h('tbody', {}, zeilen.map(({ u, status, erreicht, e }) => h('tr', {}, h('td', {}, u.titel),
        h('td', {}, erreicht ? [chip(erreicht), status === 'gemeistert' ? ' gemeistert' : ` erreicht, Ziel ${zielN}`] : status === 'gemeistert' ? 'gemeistert' : 'begonnen'),
        h('td', {}, chip(zielN)),
        h('td', {}, e ? chip(e.gewaehlt) : '–'),
        h('td', {}, e?.urteil ? `${A.URTEIL_TEXT[e.urteil]}${e.abstieg ? ' (abgestiegen)' : ''}` : e ? 'noch offen' : '–')))))));
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

// ---------- Bereich Klasse (ADR 0025): Schüler, Unterricht, Berichte ----------
// Backup und Betriebsprotokoll gehören zum Administrator-Dashboard. Nur ohne Schulverzeichnis (bis 0.20) gibt es sie hier noch.
function schuelerAbschnitt() {
  const liste = h('textarea', { id: 'namen', rows: 6, placeholder: 'Ein Name pro Zeile, zum Beispiel:\nLena Müller\nTim Schmidt' });
  const codes = Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Namensliste und Schülercodes'),
      h('p', { class: 'klein' }, z.schule ? 'Die Namen und PINs liegen auf dem Lehrertauschlaufwerk, für alle Lehrkräfte der Klasse. Im Klassenordner der Schüler stehen nur die Codes und zu jeder PIN ein Prüfwert.' : 'Die Namen und PINs bleiben in deinem Ordner auf dem Lehrerlaufwerk. Im Klassenordner stehen nur die Codes und zu jeder PIN ein Prüfwert.'),
      codes.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
        h('thead', {}, h('tr', {}, ['Name', 'Schülercode', 'PIN', 'Zielniveau', '', ''].map((t) => h('th', {}, t)))),
        h('tbody', {}, codes.map((c) => h('tr', {}, h('td', {}, name(c)), h('td', { class: 'code' }, c), h('td', { class: 'code pin' }, kl().pins?.[c]?.pin ?? '…'),
          h('td', {}, zielWahl(c)),
          h('td', {}, h('button', { class: 'schlicht', 'data-neue-pin': c, onclick: () => { if (confirm(`Neue PIN für ${name(c)} vergeben? Die alte gilt dann nicht mehr.`)) aendere((k) => { delete k.pins[c]; }); } }, 'Neue PIN')),
          h('td', {}, h('button', { class: 'schlicht', onclick: () => { if (confirm(`${name(c)} aus der Namensliste entfernen? Der Speicherstand im Klassenordner bleibt liegen.`)) aendere((k) => { delete k.namen[c]; delete k.einst.zielniveaus[c]; }); } }, 'Entfernen'))))))),
      h('h3', {}, 'Schüler hinzufügen'), liste,
      h('div', { class: 'reihe' },
        h('button', { class: 'haupt', id: 'codes', onclick: () => aendere((k) => {
          for (const n of liste.value.split('\n').map((x) => x.trim()).filter(Boolean)) k.namen[A.erzeugeCode(z.klasse, [...Object.keys(k.namen), ...z.alleCodes])] = n;
        }) }, 'Codes erzeugen'),
        codes.length > 0 && h('button', { class: 'schlicht', id: 'kaertchen', onclick: () => drucke(h('div', { class: 'kaertchen' }, codes.map((c) => h('div', {}, h('small', {}, 'Mathekingdom · Dein Schülercode'), h('b', {}, c), h('small', {}, 'Deine PIN'), h('b', { class: 'pin' }, kl().pins?.[c]?.pin ?? ''), h('span', {}, name(c)))))) }, 'Code-Kärtchen drucken'))),
    h('section', { class: 'karte' }, h('h2', {}, 'Startdatei für die Schüler'),
      h('p', {}, z.schule ? 'Diese Datei kommt einmal auf jedes Schülerlaufwerk. Sie ist für alle Schüler der Schule gleich und enthält den öffentlichen Schlüssel des Administrators. Normalerweise verteilt sie der Administrator.' : 'Diese Datei kommt einmal auf jedes Schülerlaufwerk. Sie enthält deinen öffentlichen Schlüssel: Damit erkennen die Schüler-Dashboards, ob die Klassendatei wirklich von dir stammt.'),
      h('button', { class: 'haupt', id: 'startdatei', onclick: ladeStartdatei }, 'Startdatei herunterladen')));
}
function unterrichtAbschnitt() {
  return h('div', {},
    toreKarte(),
    meilensteinFreigabeKarte(),
    expeditionKarte(),
    einstiegKarte(),
    h('section', { class: 'karte', id: 'sicherheitsangabe-karte' }, h('h2', {}, 'Sicherheitsangabe (Probe)'),
      h('p', { class: 'klein' }, 'Beim ersten Versuch prüfen die Schüler mit „ich bin sicher“ oder „ich bin unsicher“. Ist eine sichere Antwort falsch, kommt sofort ein deutlicher Hinweis. Münzen ändern sich nicht. Die Auswertung steht im Lernstand unter „Heftcheck und Sicherheitsangabe“.'),
      h('label', { class: 'schalter' }, h('input', { id: 'sicherheitsangabe', type: 'checkbox', checked: Boolean(kl().einst.sicherheitsangabe), onchange: (ev) => aendere((k) => { k.einst.sicherheitsangabe = ev.target.checked; }) }), ' Für diese Klasse einschalten')),
    h('section', { class: 'karte', id: 'konzentration-karte' }, h('h2', {}, 'Rast und Ton'),
      h('p', { class: 'klein' }, 'Die Schüler arbeiten in Wegstücken zu fünf Aufgaben. Nach jedem vierten Wegstück am Tag (etwa 20 Minuten) schlägt das Dashboard eine Rast von einer Minute vor; die Schüler können sie überspringen. Der Ton ist ein kurzer, leiser Klang bei jeder richtigen Aufgabe, sinnvoll nur mit Kopfhörern.'),
      h('label', { class: 'schalter' }, h('input', { id: 'rast', type: 'checkbox', checked: kl().einst.rast !== false, onchange: (ev) => aendere((k) => { k.einst.rast = ev.target.checked; }) }), ' Rast vorschlagen'),
      h('label', { class: 'schalter' }, h('input', { id: 'ton', type: 'checkbox', checked: Boolean(kl().einst.ton), onchange: (ev) => aendere((k) => { k.einst.ton = ev.target.checked; }) }), ' Ton bei richtigen Aufgaben')),
    h('section', { class: 'karte', id: 'spiele-karte' }, h('h2', {}, 'Spiele und Bestenliste'),
      h('p', { class: 'klein' }, 'Die Schüler lösen Münzen für Spiele ein: die Rechenpause (Kopfrechen-Sprint, 20 Münzen) und Belohnungsspiele rein zum Spaß (Botenritt, Burgmauer, Steinmetz, Grenzlauf und Kellerjagd, je 100 Münzen, eine Runde von höchstens 3 Minuten). Oben in der Leiste stellst du ein, wann Spiele gehen: aus, nur in der Spielpause oder verdient. Bei „verdient“ geht die Rechenpause immer und ein Belohnungsspiel nach jedem vierten Wegstück, etwa alle 20 Minuten.'),
      h('p', { class: 'klein' }, 'Die Bestenliste gibt es nur in den Belohnungsspielen: die besten fünf der Klasse in dieser Woche, mit Wappen und einem Beinamen aus festen Bausteinen, nie mit Namen. Jeder Schüler kann sich ausblenden. Weil die Schüler ihren Speicherstand selbst schreiben, ist ein Bestwert nicht fälschungssicher.'),
      h('label', { class: 'schalter' }, h('input', { id: 'bestenliste', type: 'checkbox', checked: kl().einst.bestenliste !== false, onchange: (ev) => aendere((k) => { k.einst.bestenliste = ev.target.checked; }) }), ' Bestenliste zeigen'),
      h('p', { class: 'klein' }, 'Hoftitel: Die fünf Besten des Schuljahrs nach Kronen und Siegeln sehen oben in ihrer Kopfzeile einen Titel mit Symbol (Klassenkönig, Herzog, Graf, Ritter, Knappe). Die Mitschüler sehen ihn nicht. Wer gerade welchen Titel trägt, steht im Lernstand.'),
      h('label', { class: 'schalter' }, h('input', { id: 'hoftitel-schalter', type: 'checkbox', checked: kl().einst.ehrentafel !== false, onchange: (ev) => aendere((k) => { k.einst.ehrentafel = ev.target.checked; }) }), ' Hoftitel zeigen')),
    h('section', { class: 'karte', id: 'belohnung-karte' }, h('h2', {}, 'Belohnung für den Sonderauftrag'),
      h('p', { class: 'klein' }, 'So viele Münzen bekommt ein Schüler dazu, wenn er alle Aufgaben eines Sonderauftrags bearbeitet hat, egal wie viele richtig sind. Der Betrag gilt für alle Aufträge, die du ab jetzt in dieser Klasse schickst, und steht auf dem Brief. Bereits verschickte Aufträge behalten ihren Betrag. Zum Vergleich: Eine Aufgabe auf dem Zielniveau bringt 20 Münzen, der Wappenschrank eines Schuljahrs kostet etwa 5.000.'),
      h('label', {}, 'Belohnung ', h('select', { id: 'sonderauftrag-belohnung', onchange: (ev) => aendere((k) => { k.einst.sonderauftragBelohnung = Number(ev.target.value); }) },
        L.SONDERAUFTRAG_BELOHNUNGEN.map((m) => h('option', { value: m, selected: L.sonderauftragBelohnung(kl().einst.sonderauftragBelohnung) === m }, `${m.toLocaleString('de-DE')} Münzen${m === L.SONDERAUFTRAG_BONUS ? ' (Standard)' : ''}`))))));
}
function berichteAbschnitt() {
  return h('div', {},
    h('section', { class: 'karte' }, h('h2', {}, 'Berichte'),
      h('p', { class: 'klein' }, 'Den Diagnosebericht eines einzelnen Schülers findest du auf seiner Seite im Lernstand.'),
      h('div', { class: 'reihe' },
        h('button', { class: 'schlicht', id: 'excel', onclick: exportiereExcel }, 'Rohdaten als Excel-Datei'),
        h('button', { class: 'schlicht', id: 'pdf', onclick: () => drucke(klassenbericht()) }, 'Klassenbericht als PDF'))));
}
// Ohne Schulverzeichnis gibt es keinen Administrator: Backup und Protokoll bleiben dann bei der Lehrkraft.
const sicherungAbschnitt = () => h('div', {}, sicherung(), protokollKarte());
const ABSCHNITTE = [['schueler', 'Schüler', schuelerAbschnitt], ['unterricht', 'Unterricht', unterrichtAbschnitt], ['berichte', 'Berichte', berichteAbschnitt], ['sicherung', 'Backup und Protokoll', sicherungAbschnitt]];
function bereichKlasse() {
  const abschnitte = ABSCHNITTE.filter(([id]) => id !== 'sicherung' || !z.schule);
  const aktiv = abschnitte.find(([id]) => id === z.abschnitt) ?? abschnitte[0];
  return h('div', {},
    h('nav', { class: 'abschnitte' }, abschnitte.map(([id, titel]) => h('button', { class: aktiv[0] === id ? 'aktiv' : '', 'data-abschnitt': id, onclick: () => { z.abschnitt = id; z.backups = null; male(); } }, titel))),
    aktiv[2]());
}

// ---------- Einstiegscheck (ADR 0014) ----------
// Freiwillig für die Schüler; die Lehrkraft kann ihn je Kapitel zur Pflicht machen.
// ---------- Torfreigabe (ADR 0022) ----------
// Liste Schüler × Tore: Die Zeile „ganze Klasse“ hakt alle an, einzeln kann man nur zusätzlich öffnen.
const ordneTore = (ids) => z.pool.kapitel.map((k) => k.id).filter((id) => ids.includes(id));
function toreKarte() {
  const e = kl().einst;
  const klasse = new Set(e.tore ?? []);
  const einzeln = (c) => new Set(e.toreEinzeln?.[c] ?? []);
  const codes = Object.keys(kl().namen).sort((a, b) => name(a).localeCompare(name(b), 'de'));
  const gearbeitet = (kapId, wer) => wer.filter((c) => z.staende.find((x) => x.code === c)?.stand?.versuche?.some((v) => L.kapitelVon(v.lernziel ?? '') === kapId)).length;
  const klassenHaken = (kapId, an) => {
    if (!an) {
      const betroffen = codes.filter((c) => !einzeln(c).has(kapId));
      const n = gearbeitet(kapId, betroffen);
      if (n > 0 && !confirm(`In diesem Kapitel haben schon ${n} Schüler gearbeitet. Tor trotzdem schließen? Siegel, Kronen und Münzen bleiben erhalten, das Tor ist für sie nur nicht mehr sichtbar.`)) return male();
    }
    aendere((k) => {
      const neu = new Set(k.einst.tore ?? []);
      if (an) neu.add(kapId); else neu.delete(kapId);
      k.einst.tore = ordneTore([...neu]);
      if (!an && k.einst.aktuellesKapitel === kapId) k.einst.aktuellesKapitel = null;
    });
  };
  const einzelHaken = (c, kapId, an) => {
    if (!an && gearbeitet(kapId, [c]) > 0 && !confirm(`${name(c)} hat in diesem Kapitel schon gearbeitet. Tor trotzdem schließen? Der Fortschritt bleibt erhalten.`)) return male();
    aendere((k) => {
      const neu = new Set(k.einst.toreEinzeln?.[c] ?? []);
      if (an) neu.add(kapId); else neu.delete(kapId);
      k.einst.toreEinzeln ??= {};
      if (neu.size) k.einst.toreEinzeln[c] = ordneTore([...neu]); else delete k.einst.toreEinzeln[c];
    });
  };
  const alleOeffnen = () => aendere((k) => { k.einst.tore = z.pool.kapitel.map((x) => x.id); });
  return h('section', { class: 'karte', id: 'tore-karte' }, h('h2', {}, 'Tore'),
    h('p', { class: 'klein' }, 'Die Schüler sehen im Schlossgarten nur die Tore, die hier angehakt sind; die anderen fehlen ganz. Die Zeile „ganze Klasse“ öffnet ein Tor für alle. Einzelnen Schülern kannst du zusätzlich Tore öffnen (Haken mit Punkt). Ein Tor wieder zu schließen nimmt niemandem Siegel, Kronen oder Münzen. Ein neues Tor wird den Schülern beim nächsten Start einmal angekündigt.'),
    h('div', { class: 'reihe' }, h('button', { class: 'schlicht', id: 'alle-tore', disabled: klasse.size === z.pool.kapitel.length, onclick: alleOeffnen }, 'Alle Tore öffnen')),
    h('div', { class: 'rollbar' }, h('table', { class: 'tabelle tore' },
      h('thead', {}, h('tr', {}, h('th', {}, ''), z.pool.kapitel.map((k, i) => h('th', { title: k.titel }, `Tor ${i + 1}`, h('br'), h('small', {}, k.titel))))),
      h('tbody', {},
        h('tr', { class: 'klassenzeile' }, h('th', {}, 'ganze Klasse'), z.pool.kapitel.map((k) => {
          const offen = codes.filter((c) => klasse.has(k.id) || einzeln(c).has(k.id)).length;
          return h('td', {}, h('label', { class: 'torhaken' }, h('input', { type: 'checkbox', 'data-tor-klasse': k.id, checked: klasse.has(k.id), onchange: (ev) => klassenHaken(k.id, ev.target.checked) })),
            codes.length > 0 && h('small', { class: 'zaehler' }, `${offen} von ${codes.length} offen`));
        })),
        codes.map((c) => h('tr', {}, h('th', {}, name(c)), z.pool.kapitel.map((k) => {
          if (klasse.has(k.id)) return h('td', {}, h('input', { type: 'checkbox', checked: true, disabled: true, title: 'für die ganze Klasse offen', 'data-tor': `${k.id}|${c}` }));
          const an = einzeln(c).has(k.id);
          return h('td', { class: an ? 'einzeln' : '' }, h('label', { class: 'torhaken', title: an ? 'einzeln geöffnet' : 'einzeln öffnen' },
            h('input', { type: 'checkbox', checked: an, 'data-tor': `${k.id}|${c}`, onchange: (ev) => einzelHaken(c, k.id, ev.target.checked) }), an && h('span', { class: 'punkt' }, '•')));
        })))))));
}

// ---------- Meilensteinfreigabe (ADR 0026) ----------
// Standard: alle Meilensteine eines Kapitels offen. Ausgeschaltet bleiben nur die angehakten offen; die übrigen liegen
// im Nebel und gehen für einen Schüler auf, sobald er alle angehakten gemeistert hat.
function meilensteinFreigabeKarte() {
  const e = kl().einst;
  const hatAufgaben = (u) => u.lernziele.some((l) => z.index.lernzielMitAufgaben.has(l.id));
  const kapitel = z.pool.kapitel.filter((k) => (e.tore ?? []).includes(k.id) && k.unterkapitel.some(hatAufgaben));
  if (!kapitel.length) return null;
  const kap = kapitel.find((k) => k.id === (z.freigabeKapitel ?? e.aktuellesKapitel)) ?? kapitel[0];
  const frei = e.meilensteinFreigabe?.[kap.id];
  const beschraenkt = Array.isArray(frei);
  const meilensteine = kap.unterkapitel.filter(hatAufgaben);
  const codes = alleCodes();
  const offenFuer = (u) => codes.filter((c) => {
    const stand = z.staende.find((x) => x.code === c)?.stand ?? { versuche: [], lernziele: {} };
    const einst = { meilensteinFreigabe: e.meilensteinFreigabe, gesperrteMeilensteine: new Set(Object.entries(e.sperren ?? {}).filter(([, cs]) => cs.includes(c)).map(([m]) => m)) };
    return !L.imNebel(z.index, stand, kap, einst).has(u.id);
  }).length;
  const setze = (liste) => aendere((k) => {
    k.einst.meilensteinFreigabe ??= {};
    if (liste === null) delete k.einst.meilensteinFreigabe[kap.id];
    else k.einst.meilensteinFreigabe[kap.id] = kap.unterkapitel.map((u) => u.id).filter((id) => liste.includes(id));
  });
  const haken = (id, an) => { const neu = new Set(frei ?? []); if (an) neu.add(id); else neu.delete(id); setze([...neu]); };
  return h('section', { class: 'karte', id: 'meilenstein-freigabe' }, h('h2', {}, 'Meilensteine im Kapitel'),
    h('p', { class: 'klein' }, 'Normalerweise sind alle Meilensteine eines Kapitels offen. Schaltest du das aus, bleiben nur die angehakten offen. Die übrigen liegen für die Schüler im Nebel und öffnen sich für jeden Schüler einzeln, sobald er alle angehakten gemeistert hat. Ein Abstecher öffnet sich, wenn sein Meilenstein gemeistert ist. Was ein Schüler schon angefangen hat, bleibt für ihn offen.'),
    kapitel.length > 1 && h('label', {}, 'Kapitel ', h('select', { id: 'freigabe-kapitel', onchange: (ev) => { z.freigabeKapitel = ev.target.value; male(); } },
      kapitel.map((k) => h('option', { value: k.id, selected: k.id === kap.id }, k.titel)))),
    h('label', { class: 'schalter' }, h('input', { type: 'checkbox', id: 'alle-meilensteine', checked: !beschraenkt,
      onchange: (ev) => setze(ev.target.checked ? null : [meilensteine.find((u) => !u.extra)?.id].filter(Boolean)) }), ' Alle Meilensteine offen'),
    beschraenkt && h('ul', { class: 'liste' }, meilensteine.map((u) => h('li', {}, h('label', { class: 'schalter' },
      h('input', { type: 'checkbox', 'data-freigabe': u.id, checked: frei.includes(u.id), onchange: (ev) => haken(u.id, ev.target.checked) }),
      ` ${u.extra ? 'Abstecher: ' : ''}${u.titel}`),
      codes.length > 0 && h('small', { class: 'zaehler' }, ` ${offenFuer(u)} von ${codes.length} offen`)))));
}

function einstiegKarte() {
  const pflicht = new Set(kl().einst.einstiegPflicht ?? []);
  const mit = z.pool.kapitel.filter((k) => k.unterkapitel.some((u) => u.lernziele.some((l) => z.index.lernzielMitAufgaben.has(l.id))));
  return h('section', { class: 'karte', id: 'einstieg-karte' }, h('h2', {}, 'Einstiegscheck'),
    h('p', { class: 'klein' }, 'Bevor ein Schüler in einem Kapitel die erste Aufgabe bearbeitet, bietet das Dashboard sechs bis acht Aufgaben aus allen Meilensteinen an. Daraus folgt ein Vorschlag für die Kronenwahl, keine Siegel und keine Münzen. Normalerweise darf man ihn überspringen. Als Pflicht muss er vor dem ersten Meilenstein gemacht werden. Das Ergebnis steht im Lernstand unter „Vorwissen“.'),
    h('ul', { class: 'liste' }, mit.map((k) => h('li', {}, h('label', { class: 'schalter' },
      h('input', { type: 'checkbox', 'data-einstieg-pflicht': k.id, checked: pflicht.has(k.id), onchange: (ev) => aendere((kk) => {
        const neu = new Set(kk.einst.einstiegPflicht ?? []);
        if (ev.target.checked) neu.add(k.id); else neu.delete(k.id);
        kk.einst.einstiegPflicht = [...neu];
      }) }), ` ${k.titel}: Pflicht`)))));
}

// ---------- Expedition (ADR 0014) ----------
// Ein gemeinsames Ziel der Klasse. Die Schüler sehen den Stand der Klasse und nur ihren eigenen Beitrag.
const BELOHNUNG = { fahne: 'Expeditionsfahne fürs Wappen', spielpause: 'eine Spielpause' };
function expeditionKarte() {
  const ex = kl().einst.expedition;
  const datum = (t) => new Date(`${t}T12:00:00`).toLocaleDateString('de-DE');
  if (ex) {
    const st = A.expeditionUebersicht(angemeldet(), ex, jetzt());
    const anteil = Math.min(1, st.summe / ex.ziel);
    return h('section', { class: 'karte', id: 'expedition' }, h('h2', {}, 'Expedition'),
      h('p', {}, h('b', {}, `${st.summe} von ${ex.ziel} Expeditionszeichen`), ` bis zum ${datum(ex.bis)}. Belohnung: ${BELOHNUNG[ex.belohnung]}.`),
      h('span', { class: 'balken', title: prozent(anteil) }, h('i', { style: `width:${Math.round(anteil * 100)}%` }), h('b', {}, prozent(anteil))),
      st.geschafft ? h('p', { class: 'marke gut' }, ex.belohnung === 'spielpause' ? 'Geschafft! Die Klasse hat sich eine Spielpause verdient. Schalte sie oben ein, wenn es passt.' : 'Geschafft! Alle Schüler bekommen beim nächsten Öffnen die Expeditionsfahne.')
        : st.vorbei ? h('p', { class: 'fehlertext' }, 'Das Enddatum ist vorbei, das Ziel wurde nicht erreicht.') : null,
      h('p', { class: 'klein' }, 'Ein Zeichen gibt es für jedes neue Siegel und für jeden Tag, an dem ein Schüler einen Rückblick abschließt. Die Schüler sehen nur den Stand der Klasse und ihren eigenen Beitrag, nie die der anderen.'),
      h('details', {}, h('summary', {}, 'Beiträge der Schüler (nur für dich)'),
        h('ul', { class: 'liste' }, [...st.beitraege].sort((a, b) => b.zeichen - a.zeichen).map((b) => h('li', {}, `${name(b.code)}: ${b.zeichen}`)))),
      h('button', { class: 'schlicht', id: 'expedition-beenden', onclick: () => { if (confirm('Expedition beenden? Der Balken verschwindet bei allen Schülern.')) aendere((k) => { k.einst.expedition = null; }); } }, 'Expedition beenden'));
  }
  const in4Wochen = new Date(Date.now() + 28 * 86400000).toLocaleDateString('sv-SE');
  const zielFeld = h('input', { id: 'expedition-ziel', type: 'number', min: 1, value: Math.max(10, Object.keys(kl().namen).length * 4), style: 'width:6em' });
  const bisFeld = h('input', { id: 'expedition-bis', type: 'date', value: in4Wochen });
  const lohnFeld = h('select', { id: 'expedition-belohnung' }, Object.entries(BELOHNUNG).map(([id, text]) => h('option', { value: id }, text)));
  return h('section', { class: 'karte', id: 'expedition' }, h('h2', {}, 'Expedition'),
    h('p', { class: 'klein' }, 'Ein gemeinsames Ziel für die ganze Klasse: Jedes neue Siegel und jeder abgeschlossene Rückblick (höchstens einer am Tag) bringt ein Expeditionszeichen. Jeder Schüler sieht den Stand der Klasse und seinen eigenen Beitrag, aber nicht den der anderen. Als Richtwert passen etwa vier Zeichen je Schüler in vier Wochen.'),
    h('div', { class: 'reihe' },
      h('label', {}, 'Ziel ', zielFeld, ' Zeichen'),
      h('label', {}, 'bis ', bisFeld),
      h('label', {}, 'Belohnung ', lohnFeld),
      h('button', { class: 'haupt', id: 'expedition-starten', onclick: () => {
        const ziel = parseInt(zielFeld.value, 10);
        if (!(ziel > 0) || !bisFeld.value) { z.fehler = 'Gib ein Ziel und ein Enddatum ein.'; return male(); }
        aendere((k) => { k.einst.expedition = { id: `ex-${Date.now().toString(36)}`, ziel, start: jetzt(), bis: bisFeld.value, belohnung: lohnFeld.value }; });
      } }, 'Expedition starten')));
}

// ---------- Betriebsprotokoll (ADR 0013) ----------
function protokollKarte() {
  const alle = P.sammle(z.staende, z.daten.protokoll, z.klasse, name);
  const nurProbleme = z.protokollNurProbleme ?? false;
  const zeilen = (nurProbleme ? alle.filter((e) => e.art === 'problem') : alle).slice(0, 100);
  const probleme = alle.filter((e) => e.art === 'problem').length;
  const ART = { start: 'Start', problem: 'Problem', ok: 'wieder ok' };
  return h('section', { class: 'karte', id: 'protokoll' }, h('h2', {}, 'Protokoll'),
    h('p', { class: 'klein' }, 'Technische Ereignisse aus allen Speicherständen und von diesem Dashboard: woher es geladen wurde, welche Version, und was schiefging, zum Beispiel GitHub nicht erreichbar oder Speichern fehlgeschlagen. Lerndaten stehen hier nicht.'),
    h('p', {}, alle.length ? `${alle.length} Einträge, davon ${probleme} Probleme.` : 'Noch keine Einträge.'),
    alle.length > 0 && h('div', { class: 'reihe' },
      h('label', {}, h('input', { type: 'checkbox', id: 'protokoll-probleme', checked: nurProbleme, onchange: (ev) => { z.protokollNurProbleme = ev.target.checked; document.getElementById('protokoll').replaceWith(protokollKarte()); } }), ' Nur Probleme'),
      h('button', { class: 'schlicht', id: 'protokoll-export', onclick: () => ladeHerunter(`Mathekingdom_Protokoll_${z.klasse}_${heute()}.txt`, P.alsText(alle, z.klasse, jetzt()), 'text/plain;charset=utf-8') }, 'Protokoll als Textdatei speichern')),
    zeilen.length > 0 && h('div', { class: 'rollbar' }, h('table', { class: 'tabelle' },
      h('thead', {}, h('tr', {}, ['Zeit', 'Wer', 'Art', 'Ereignis'].map((t) => h('th', {}, t)))),
      h('tbody', {}, zeilen.map((e) => h('tr', { class: e.art === 'problem' ? 'problem' : '' },
        h('td', { style: 'white-space:nowrap' }, new Date(e.t).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })),
        h('td', { style: 'white-space:nowrap' }, e.wer), h('td', { class: e.art === 'problem' ? 'fehlertext' : '' }, ART[e.art] ?? e.art), h('td', {}, e.text)))))),
    alle.length > zeilen.length && h('p', { class: 'klein' }, 'Gezeigt werden die neuesten 100. Die Textdatei enthält alle.'));
}

// ---------- Backup ----------
function sicherung() {
  if (z.backups === null) {
    // Nur diesen Teil nachzeichnen, damit angefangene Eingaben stehen bleiben.
    const platz = h('section', { class: 'karte' }, h('p', {}, 'Lade Backups …'));
    backupOrdner().then((o) => o.ordnernamen()).then((n) => { z.backups = n.sort().reverse(); if (platz.isConnected) platz.replaceWith(sicherung()); });
    return platz;
  }
  const letztes = kl().letztesBackup;
  const alt = letztes && Date.now() - new Date(letztes) > 7 * 86400000;
  const gewaehlt = z.backupGewaehlt ?? z.backups[0];
  return h('section', { class: 'karte' }, h('h2', {}, 'Backup'),
    h('p', {}, z.schule ? `Solange dieses Dashboard offen ist, werden alle Speicherstände, die Klassendatei und die Klassendaten stündlich in den Ordner „backup“ der Klasse auf dem Lehrertauschlaufwerk kopiert (${z.schule.schuljahr}/${z.klasse}/backup).` : 'Solange dieses Dashboard offen ist, werden alle Speicherstände, die Klassendatei und deine Lehrerdaten stündlich in den Ordner „backup“ auf deinem Lehrerlaufwerk kopiert.'),
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
