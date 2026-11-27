// Die Schule im Dateisystem (ADR 0024): Mathekingdom-Ordner auf beiden Tauschlaufwerken, Schuljahresordner,
// Klassenordner und das vom Administrator unterschriebene Schulverzeichnis.
//
//   Schülertauschlaufwerk  Mathekingdom/schulverzeichnis.json, _mathekingdom/, 2026-27/5a/<Code>.json, klassendatei.json
//   Lehrertauschlaufwerk   Mathekingdom/schulverzeichnis.json, <Kürzel>/lehrer.json, 2026-27/5a/klasse.json, backup/
//   Lehrerlaufwerk         mathekingdom-admin.json (privater Schlüssel des Administrators)

import { pruefeUnterschrift, liesUngeprueft, neuePin, pinEintrag } from './krypto.js';
import { BEINAME_VORNE, BEINAME_HINTEN, archiviereStufe } from '../schueler/logik.js';

export const ORDNERNAME = 'Mathekingdom';
export const VERZEICHNIS = 'schulverzeichnis.json';
export const KLASSE_DATEI = 'klasse.json';
export const LEHRER_DATEI = 'lehrer.json';
export const ADMIN_DATEI = 'mathekingdom-admin.json';

export const istSchuljahr = (n) => /^\d{4}-\d{2}$/.test(String(n));
export const istKlasse = (n) => /^\d{1,2}[a-z]$/.test(String(n));
export const istKuerzel = (k) => /^[A-ZÄÖÜ]{2,5}$/.test(String(k));
export const vergleicheKlassen = (a, b) => parseInt(a, 10) - parseInt(b, 10) || a.localeCompare(b);

// Das Schuljahr beginnt am 1. August.
export function schuljahrAm(datum) {
  const d = new Date(datum);
  const j = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
  return `${j}-${String((j + 1) % 100).padStart(2, '0')}`;
}
export function naechstesSchuljahr(sj) {
  const j = parseInt(sj, 10) + 1;
  return `${j}-${String((j + 1) % 100).padStart(2, '0')}`;
}
export function naechsteKlasse(klasse) {
  const m = String(klasse).match(/^(\d{1,2})([a-z])$/);
  return m ? `${Number(m[1]) + 1}${m[2]}` : null;
}
export const codeEnde = (code) => String(code).split('-')[1];
export const codeInKlasse = (code, klasse) => `${klasse.toUpperCase()}-${codeEnde(code)}`;

// Führt der gewählte Ordner zum Mathekingdom-Ordner? Er selbst (mit Schulverzeichnis) oder ein Unterordner
// „Mathekingdom“ darin. Schuljahres- und Klassenordner sind zu tief: Sie gelten nicht über das Schuljahr hinaus.
// Liefert { wurzel } oder { fehler: 'zu-tief' | 'fehlt' }.
export async function findeSchule(ablage) {
  if (await ablage.lies(VERZEICHNIS)) return { wurzel: ablage };
  const unter = (await ablage.ordnernamen()).find((n) => n.toLowerCase() === ORDNERNAME.toLowerCase());
  if (unter) {
    const u = await ablage.ordner(unter);
    if (u && await u.lies(VERZEICHNIS)) return { wurzel: u };
  }
  const name = String(ablage.name).toLowerCase();
  if (istSchuljahr(name) || istKlasse(name)) return { fehler: 'zu-tief' };
  return { fehler: 'fehlt' };
}

// Für den Administrator: der Mathekingdom-Ordner im gewählten Ordner, notfalls neu angelegt.
export async function mathekingdomOrdner(ablage) {
  if (String(ablage.name).toLowerCase() === ORDNERNAME.toLowerCase() || await ablage.lies(VERZEICHNIS)) return ablage;
  const unter = (await ablage.ordnernamen()).find((n) => n.toLowerCase() === ORDNERNAME.toLowerCase());
  return ablage.unterordner(unter ?? ORDNERNAME);
}

// ---------- Schulverzeichnis ----------
export function leeresVerzeichnis(adminOeffentlich, schuljahr) {
  return { version: 1, stand: null, admin: adminOeffentlich, schuljahr, schuljahre: [schuljahr], pfade: { schueler: '', lehrer: '' }, lehrkraefte: {}, klassen: { [schuljahr]: {} } };
}
// status: ok | ungeprueft (kein Schlüssel bekannt) | fehlt | ungueltig
export async function ladeVerzeichnis(wurzel, adminSchluessel) {
  const text = await wurzel.lies(VERZEICHNIS);
  if (!text) return { daten: null, status: 'fehlt' };
  if (!adminSchluessel) return { daten: liesUngeprueft(text), status: 'ungeprueft' };
  const daten = await pruefeUnterschrift(text, adminSchluessel);
  return { daten, status: daten ? 'ok' : 'ungueltig' };
}
// Wer eine Klassendatei unterschreiben darf: die Lehrkräfte der Klasse, Lehrkräfte mit Administratorrechten
// und der Administrator selbst.
export function schluesselDerKlasse(v, schuljahr, klasse) {
  const lk = v?.lehrkraefte ?? {};
  const wer = new Set([...(v?.klassen?.[schuljahr]?.[klasse]?.lehrkraefte ?? []), ...Object.keys(lk).filter((k) => lk[k].admin)]);
  return [...[...wer].map((k) => lk[k]?.oeffentlich), v?.admin].filter(Boolean);
}
// Testklasse (ADR 0028): im Schulverzeichnis markiert, zählt nicht in Nutzungsstatistik, Auffällige Aufgaben und Aufgabenmeldungen.
export const istTestklasse = (v, schuljahr, klasse) => Boolean(v?.klassen?.[schuljahr]?.[klasse]?.test);
export function klassenDerLehrkraft(v, schuljahr, kuerzel) {
  const alle = v?.klassen?.[schuljahr] ?? {};
  const admin = Boolean(v?.lehrkraefte?.[kuerzel]?.admin);
  return Object.keys(alle).filter((k) => admin || (alle[k].lehrkraefte ?? []).includes(kuerzel)).sort(vergleicheKlassen);
}
export async function pruefeMitSchluesseln(text, schluessel) {
  for (const s of schluessel) {
    const daten = await pruefeUnterschrift(text, s);
    if (daten) return daten;
  }
  return null;
}

// Der Klassenordner im gegebenen Schuljahr, sonst im neuesten Schuljahr, in dem es ihn gibt.
export async function findeKlassenordner(wurzel, schuljahr, klasse) {
  const jahre = (await wurzel.ordnernamen()).filter(istSchuljahr).sort().reverse();
  for (const j of [schuljahr, ...jahre.filter((x) => x !== schuljahr)].filter(Boolean)) {
    const jahr = await wurzel.ordner(j);
    const ordner = jahr && await jahr.ordner(klasse);
    if (ordner) return { ablage: ordner, schuljahr: j };
  }
  return null;
}

// ---------- Klassendaten ----------
export function neueKlassendaten(ersteTore = []) {
  return { namen: {}, notizen: {}, pins: {}, einst: { aktuellesKapitel: null, tore: ersteTore, toreEinzeln: {}, spielpause: false, zielniveaus: {}, hilfe: {}, nachrichten: {}, sperren: {}, sonderauftraege: {}, muenzgaben: {} } };
}
// Jeder Schüler der Namensliste hat eine PIN; der langsame Prüfwert wird einmal berechnet. Liefert, ob sich etwas änderte.
export async function sorgePins(k) {
  const pins = (k.pins ??= {});
  let neu = false;
  for (const code of Object.keys(pins)) if (!k.namen[code]) { delete pins[code]; neu = true; }
  for (const code of Object.keys(k.namen)) {
    if (pins[code]?.wert) continue;
    const pin = neuePin();
    pins[code] = { pin, ...(await pinEintrag(pin)) };
    neu = true;
  }
  return neu;
}
// Inhalt der Klassendatei: was die Schüler-Dashboards lesen. Keine Namen, keine PINs, nur ihre Prüfwerte.
export function klassendateiInhalt(klasse, k, stand) {
  const e = k.einst;
  const pins = Object.fromEntries(Object.entries(k.pins ?? {}).map(([code, p]) => [code, { salz: p.salz, wert: p.wert }]));
  return { klasse, stand, aktuellesKapitel: e.aktuellesKapitel, tore: e.tore, toreEinzeln: e.toreEinzeln ?? {}, codes: Object.keys(k.namen),
    zielniveaus: e.zielniveaus, spielpause: e.spielpause, spielfreigabe: e.spielfreigabe ?? 'spielpause', bestenliste: e.bestenliste !== false, ehrentafel: e.ehrentafel !== false,
    hilfe: e.hilfe, nachrichten: e.nachrichten, sonderauftraege: e.sonderauftraege ?? {}, muenzgaben: e.muenzgaben ?? {}, ...(e.feedback && { feedback: e.feedback }), sperren: e.sperren, meilensteinFreigabe: e.meilensteinFreigabe ?? {}, expedition: e.expedition ?? null,
    sicherheitsangabe: Boolean(e.sicherheitsangabe), ton: Boolean(e.ton), rast: e.rast !== false, einstiegPflicht: e.einstiegPflicht ?? [], pins };
}

// ---------- Übernahme ins neue Schuljahr ----------
// Der Speicherstand wandert mit: Münzen, Siegel, Rang, Wappen, Versuchsprotokoll. Der Beiname bleibt derselbe,
// obwohl er sich ohne eigene Wahl aus dem Code ergibt.
// Mit `wiederholung` beginnt die Klassenstufe neu (ADR 0054): ihre Siegel, Kronen und Bearbeitungen kommen ins Archiv.
export function uebernimmStand(stand, neuerCode, neueKlasse, jetzt, { wiederholung = null, schuljahr = null } = {}) {
  const neu = structuredClone(stand);
  if (wiederholung) archiviereStufe(neu, wiederholung, jetzt, { schuljahr, klasse: stand.klasse });
  if (!neu.beiname) {
    let h = 0;
    for (const c of String(stand.code ?? '')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    neu.beiname = { vorne: BEINAME_VORNE[h % BEINAME_VORNE.length], hinten: BEINAME_HINTEN[Math.floor(h / BEINAME_VORNE.length) % BEINAME_HINTEN.length] };
  }
  Object.assign(neu, { code: neuerCode, klasse: neueKlasse, geaendert: jetzt, hilferuf: null, aktiv: null });
  return neu;
}
// Neuer Code in der Zielklasse. Ist der hintere Teil im neuen Schuljahr schon vergeben, gibt es einen neuen.
export function codeFuerUebernahme(alterCode, zielKlasse, vergeben, erzeuge) {
  const ende = codeEnde(alterCode);
  if (!vergeben.some((c) => codeEnde(c) === ende)) return codeInKlasse(alterCode, zielKlasse);
  return erzeuge(zielKlasse, vergeben);
}

// ---------- Klassenwechsel und Schuljahreswechsel (ADR 0054) ----------
export const stufe = (klasse) => Number.parseInt(klasse, 10);
export const LETZTE_STUFE = 10;
// Vorschlag beim Schuljahreswechsel: dieselbe Klasse eine Stufe höher. Nach Klasse 10 wird niemand übernommen.
export const vorschlagNeuesJahr = (klasse) => (stufe(klasse) >= LETZTE_STUFE ? '' : naechsteKlasse(klasse) ?? '');
// Welche Stufe neu beginnt: im laufenden Schuljahr nur, wer in eine niedrigere Stufe wechselt,
// beim Schuljahreswechsel auch, wer in derselben Stufe bleibt.
export function wiederholteStufe(alteKlasse, neueKlasse, neuesSchuljahr = false) {
  const alt = stufe(alteKlasse), neu = stufe(neueKlasse);
  return neu < alt || (neuesSchuljahr && neu === alt) ? neu : null;
}
// Klassenwechsel in den Klassendaten: Name, PIN, Zielniveau, Notiz und ungeöffnete Münzgaben ziehen mit.
// Sonderauftrag, Nachricht, Hilferuf und gesperrte Meilensteine bleiben zurück und verfallen.
export function zieheUm(quelle, ziel, code, neuerCode) {
  ziel.namen[neuerCode] = quelle.namen[code];
  if (quelle.pins?.[code]) (ziel.pins ??= {})[neuerCode] = quelle.pins[code];
  const zn = quelle.einst?.zielniveaus?.[code];
  if (zn) (ziel.einst.zielniveaus ??= {})[neuerCode] = zn;
  if (quelle.notizen?.[code]) (ziel.notizen ??= {})[neuerCode] = quelle.notizen[code];
  if (quelle.notizVon?.[code]) (ziel.notizVon ??= {})[neuerCode] = quelle.notizVon[code];
  if (quelle.einst?.muenzgaben?.[code]) (ziel.einst.muenzgaben ??= {})[neuerCode] = quelle.einst.muenzgaben[code];
  entferneAusKlasse(quelle, code);
}
export function entferneAusKlasse(daten, code) {
  delete daten.namen[code]; delete daten.pins?.[code]; delete daten.notizen?.[code]; delete daten.notizVon?.[code];
  for (const feld of ['zielniveaus', 'hilfe', 'nachrichten', 'sonderauftraege', 'muenzgaben']) delete daten.einst?.[feld]?.[code];
  for (const [st, codes] of Object.entries(daten.einst?.sperren ?? {})) {
    const rest = (codes ?? []).filter((c) => c !== code);
    if (rest.length) daten.einst.sperren[st] = rest; else delete daten.einst.sperren[st];
  }
}
// Ein alter Code nach einem Wechsel: In welcher Klasse steht jetzt ein Code mit demselben hinteren Teil?
export function neuerCodeZu(code, codesJeKlasse) {
  const ende = codeEnde(code);
  for (const [klasse, codes] of Object.entries(codesJeKlasse)) {
    const treffer = codes.find((c) => codeEnde(c) === ende);
    if (treffer) return { klasse, code: treffer };
  }
  return null;
}

// ---------- Startdateien ----------
// Die Vorlagen (aus tools/baue.mjs) enthalten Platzhalter wie /*SCHLUESSEL*/null; hier kommen die Werte hinein.
export function fuelleStartdatei(vorlage, werte) {
  let text = vorlage;
  for (const [name, wert] of Object.entries(werte)) text = text.split(`/*${name}*/null`).join(JSON.stringify(wert ?? null).replace(/<\//g, '<\\/'));
  return text;
}
