// Dateizugriff des Schüler-Dashboards. Siehe docs/adr/0001 und 0004.
// Eine Ablage hat: name, lies(pfad) → Text oder null, schreibe(pfad, text), liste() → Dateinamen.

import { pruefeUnterschrift, liesUngeprueft } from '../gemeinsam/krypto.js';

export const SYSTEMORDNER = '_mathekingdom';
export const KLASSENDATEI = 'klassendatei.json';
const SICHERUNG = 'mk-sicherung-';

async function datei(wurzel, pfad, anlegen) {
  const teile = pfad.split('/');
  let ordner = wurzel;
  for (const t of teile.slice(0, -1)) ordner = await ordner.getDirectoryHandle(t, { create: anlegen });
  return ordner.getFileHandle(teile.at(-1), { create: anlegen });
}

export function ordnerAblage(handle) {
  return {
    name: handle.name, handle,
    async lies(pfad) {
      try { return await (await (await datei(handle, pfad, false)).getFile()).text(); }
      catch (e) { if (e.name === 'NotFoundError' || e.name === 'TypeMismatchError') return null; throw e; }
    },
    async schreibe(pfad, text) {
      const strom = await (await datei(handle, pfad, true)).createWritable();
      await strom.write(text);
      await strom.close();
    },
    async liste() {
      const namen = [];
      for await (const [name, eintrag] of handle.entries()) if (eintrag.kind === 'file') namen.push(name);
      return namen;
    },
    async ordnernamen() {
      const namen = [];
      for await (const [name, eintrag] of handle.entries()) if (eintrag.kind === 'directory') namen.push(name);
      return namen;
    },
    async unterordner(name) { return ordnerAblage(await handle.getDirectoryHandle(name, { create: true })); },
    async entferne(name) { await handle.removeEntry(name, { recursive: true }); },
  };
}

// Ablage nur im Arbeitsspeicher: für Beispieldaten im Lehrer-Dashboard.
export function speicherAblage(name, baum = { dateien: new Map(), ordner: new Map() }) {
  const ziel = (pfad, anlegen) => {
    const teile = pfad.split('/');
    let k = baum;
    for (const t of teile.slice(0, -1)) {
      if (!k.ordner.has(t)) { if (!anlegen) return [null]; k.ordner.set(t, { dateien: new Map(), ordner: new Map() }); }
      k = k.ordner.get(t);
    }
    return [k, teile.at(-1)];
  };
  return {
    name, demo: true,
    async lies(pfad) { const [k, n] = ziel(pfad, false); return k?.dateien.get(n) ?? null; },
    async schreibe(pfad, text) { const [k, n] = ziel(pfad, true); k.dateien.set(n, text); },
    async liste() { return [...baum.dateien.keys()]; },
    async ordnernamen() { return [...baum.ordner.keys()]; },
    async unterordner(n) { if (!baum.ordner.has(n)) baum.ordner.set(n, { dateien: new Map(), ordner: new Map() }); return speicherAblage(n, baum.ordner.get(n)); },
    async entferne(n) { baum.ordner.delete(n); baum.dateien.delete(n); },
  };
}

// Demo ohne Ordner: Alles bleibt im Browser dieses Geräts.
export function demoAblage(klasse) {
  const schluessel = (pfad) => `mk-demo-${klasse}/${pfad}`;
  return {
    name: klasse, demo: true,
    async lies(pfad) { return localStorage.getItem(schluessel(pfad)); },
    async schreibe(pfad, text) { localStorage.setItem(schluessel(pfad), text); },
    async liste() { return []; },
  };
}

export const kannOrdner = () => typeof window.showDirectoryPicker === 'function';
export async function waehleOrdner() {
  return ordnerAblage(await window.showDirectoryPicker({ id: 'mathekingdom', mode: 'readwrite' }));
}

const liesJson = (text) => { try { return text ? JSON.parse(text) : null; } catch { return null; } };
const liesSicherung = (code) => { try { return liesJson(localStorage.getItem(SICHERUNG + code)); } catch { return null; } };

// Lädt den Speicherstand. Fehlt die Datei oder ist sie älter als die Sicherung im Browser, gilt die Sicherung.
export async function ladeStand(ablage, code) {
  const ausDatei = liesJson(await ablage.lies(`${code}.json`));
  const sicherung = liesSicherung(code);
  if (sicherung && (!ausDatei || sicherung.geaendert > ausDatei.geaendert)) {
    return { stand: sicherung, hinweis: ausDatei ? 'sicherung-neuer' : 'datei-fehlte' };
  }
  return { stand: ausDatei, hinweis: null };
}

// Liest die Klassendatei. Ist ein öffentlicher Schlüssel hinterlegt (window.MK_SCHLUESSEL, aus der Startdatei),
// zählt sie nur mit gültiger Unterschrift. status: ok | ungeprueft | fehlt | ungueltig
export async function ladeKlassendatei(ablage) {
  const text = await ablage.lies(KLASSENDATEI);
  const schluessel = window.MK_SCHLUESSEL;
  if (!text) return { daten: null, status: schluessel ? 'fehlt' : 'ungeprueft' };
  if (!schluessel) return { daten: liesUngeprueft(text), status: 'ungeprueft' };
  const daten = await pruefeUnterschrift(text, schluessel);
  return { daten, status: daten ? 'ok' : 'ungueltig' };
}

// Offene Hilferufe der anderen Schüler der Klasse, für den Platz in der Warteschlange.
export async function ladeAndereHilferufe(ablage, eigenerCode) {
  const rufe = [];
  for (const name of await ablage.liste()) {
    if (!/^\d{1,2}[A-Z]-[A-Z0-9]{4}\.json$/.test(name) || name === `${eigenerCode}.json`) continue;
    const stand = liesJson(await ablage.lies(name).catch(() => null));
    if (stand?.hilferuf) rufe.push(stand.hilferuf);
  }
  return rufe;
}

// Speichert höchstens alle `intervall` Millisekunden, und nur wenn sich etwas geändert hat.
export function speicherdienst(ablage, holeStand, melde, intervall = 10000) {
  let geaendert = false, laeuft = false;
  async function speichere() {
    if (!geaendert || laeuft) return;
    laeuft = true; geaendert = false;
    const stand = holeStand();
    stand.geaendert = new Date().toISOString();
    const text = JSON.stringify(stand);
    try { localStorage.setItem(SICHERUNG + stand.code, text); } catch { /* Sicherung ist nur ein Netz */ }
    try { await ablage.schreibe(`${stand.code}.json`, text); melde({ ok: true, um: new Date() }); }
    catch (e) { geaendert = true; melde({ ok: false, fehler: e }); }
    laeuft = false;
  }
  const takt = setInterval(speichere, intervall);
  return { markiere() { geaendert = true; }, sofort: speichere, stopp() { clearInterval(takt); } };
}

// Aufgabenpool: zuerst online, dann die Kopie im Klassenordner, zuletzt die eingebettete Fassung.
export async function ladePool(ablage, klassenstufe) {
  const datei = `klasse-${klassenstufe}.json`;
  if (window.MK_BASIS) {
    try {
      const antwort = await fetch(`${window.MK_BASIS}aufgabenpool/${datei}`, { cache: 'no-cache', signal: AbortSignal.timeout(5000) });
      if (antwort.ok) return { pool: await antwort.json(), quelle: 'online' };
    } catch { /* weiter mit der Kopie */ }
  }
  const kopie = liesJson(await ablage.lies(`${SYSTEMORDNER}/${datei}`).catch(() => null));
  if (kopie) return { pool: kopie, quelle: 'klassenordner' };
  const eingebettet = window.MK_POOLS?.[klassenstufe];
  if (eingebettet) return { pool: eingebettet, quelle: 'eingebettet' };
  return { pool: null, quelle: null };
}
