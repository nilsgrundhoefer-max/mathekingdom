// Prüft eine Aufgabenpool-Datei: Aufbau, Regeln der Niveaustufen (ADR 0015), Rechnungen und Bilder.
// Der Prüfer rechnet alles selbst nach und benutzt nichts aus den Erzeugern (tools/werkzeug.mjs, tools/aufgaben/).
// Aufruf: node tools/pruefe-pool.mjs [aufgabenpool/klasse-5.json]

import { readFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { gGleichungen, GROESSENBILDER, bildMaengel, sprachMaengel, pruefeGroessenNachweis, groesseMaengel, tafelMaengel, umwandelMaengel, schaetzMaengel, teilAuswahlMaengel, einheitFaktor } from './pruefe-groessen.mjs';
import { flaecheBildMaengel, zellenMaengel, flaecheSprachMaengel } from './pruefe-flaechen.mjs';
import { gRechne } from './pruefe-groessen.mjs';
import { bGleichungen, bruchSprachMaengel, pruefeBruchAufgabe, bruchHatBild } from './pruefe-brueche.mjs';
import { WINKELBILDER, WINKEL_SONDER, WINKEL_ERGEBNIS, WINKEL_ARTEN, winkelBildMaengel, winkelBildZahlen, winkelfeldMaengel, kreisMaengel, winkelSprachMaengel } from './pruefe-winkel.mjs';

// Liefert die Liste aller Fehler im Pool. Eine leere Liste heißt: in Ordnung.
// vorstufen: Pools früherer Klassenstufen. Voraussetzungen dürfen auf ihre Lernziele zeigen (ADR 0037).
export function pruefePool(pool, vorstufen = []) {
const fehler = [];
const melde = (id, text) => fehler.push(`${id}: ${text}`);

const NIVEAUS = ['F', 'G', 'M', 'E'];
const PRO_GRUPPE = 6;
const AFB_FOLGE = { F: [1, 1, 1, 1, 2, 1], G: [1, 1, 2, 1, 2, 3], M: [1, 2, 2, 1, 2, 3], E: [1, 2, 2, 3, 2, 3] };
const KARTEN = { F: ['tipp', 'beispiel', 'loesungsschritt'], G: ['tipp', 'beispiel', 'loesungsschritt'], M: ['tipp', 'loesungsschritt'], E: ['tipp'] };
const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };
const BILDER_JE_GRUPPE = { F: 6, G: 3 };
const FORMATE = ['zahl', 'zahlenstrahl', 'auswahl', 'luecken', 'tabelle', 'zuordnen', 'sachaufgabe', 'diagramm', 'strichliste', 'zeichnen', 'ordnen', 'zeichen', 'schaetzen', 'gitter', 'groesse', 'winkel', 'bruch', 'faerben'];
const KOMPETENZEN = ['argumentieren', 'probleme-loesen', 'modellieren', 'symbolisch', 'kommunizieren'];
const SCHLUESSEL = ['id', 'lernziel', 'niveau', 'afb', 'kompetenz', 'format', 'text', 'loesung', 'typischeFehler', 'hilfen', 'bild', 'nachweis', 'eingabe', 'strahl',
  'luecken', 'mehrfach', 'optionen', 'teile', 'paare', 'tabelle', 'ziffernfelder', 'einheit', 'diagramm',
  'zeilen', 'buendeln', 'urliste', 'daten',
  'karten', 'tasten', 'bereich', 'lang', 'umgekehrt', 'sonst', 'links', 'rechts',
  'gitter', 'linie', 'bedingung', 'beispiel', 'verbinden', 'offen', 'toleranz',
  'groesse', 'einheiten', 'tippBild', 'winkelfeld',
  'faerben', 'genau', 'gemischt', 'gekuerzt', 'form'];
// Kapitel, in denen mit Brüchen gerechnet wird: Klasse 5 Kapitel 9 und Klasse 6 Kapitel 1 (ADR 0037).
const BRUCHKAPITEL = ['5.9', '6.1'];
const istBruchLernziel = (id) => BRUCHKAPITEL.some((k) => id.startsWith(`${k}.`));
// Kapitel 6 (ADR 0033): Dort wird mit Größen gerechnet. Solange eine Aufgabe aus Kapitel 6 geprüft wird, lesen die Gleichungsprüfungen auch Einheiten.
let groessenModus = false;
// Kapitel 9 (ADR 0036): Dort wird mit Brüchen und Dezimalzahlen gerechnet. Gleichungen, Format und Nachweis prüft tools/pruefe-brueche.mjs.
let bruchModus = false;
// Die Prüfung arbeitet auf einer Kopie, damit sie am Pool nichts verändert.

// ---------- Rechnen ----------
const zahlAus = (s) => Number(String(s).replace(/[\s\u00a0\u202f]/g, ''));
const NUM = '\\d+(?:\\u00a0\\d{3})*';
// Potenzen stehen in Hochschreibweise (2³). Beim Rechnen werden sie als Produkt ausgeschrieben.
const HOCH = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ATOM = `[(\\[]*${NUM}[${HOCH}]*[)\\]]*`;
const ausschreiben = (s) => String(s).replace(new RegExp(`(\\d+)([${HOCH}]+)`, 'g'), (_, b, e) => `(${Array(Number([...e].map((c) => HOCH.indexOf(c)).join(''))).fill(b).join('·')})`);
const AUSDRUCK = `${ATOM}(?: [+−·:] ${ATOM})*`;
const zahlenIn = (s) => [...String(s).matchAll(new RegExp(NUM, 'g'))].map((m) => zahlAus(m[0]));
const norm = (s) => String(s).replace(/[\s\u00a0\u202f]/g, '');

// Rechnet einen Ausdruck aus Zahlen, +, −, ·, : und Klammern aus. NaN, wenn es kein Ausdruck ist oder eine Division nicht aufgeht.
function rechne(ausdruck) {
  const t = norm(ausschreiben(ausdruck)).replace(/\[/g, '(').replace(/\]/g, ')').match(/\d+|[+−·:()]|./g) ?? [];
  let i = 0;
  const faktor = () => {
    if (t[i] === '(') { i++; const w = strich(); if (t[i++] !== ')') return NaN; return w; }
    if (!/^\d+$/.test(t[i] ?? '')) return NaN;
    return Number(t[i++]);
  };
  const punkt = () => {
    let w = faktor();
    while (t[i] === '·' || t[i] === ':') {
      const z = t[i++], r = faktor();
      if (z === ':' && (r === 0 || w % r !== 0)) return NaN;
      w = z === '·' ? w * r : w / r;
    }
    return w;
  };
  const strich = () => {
    let w = punkt();
    while (t[i] === '+' || t[i] === '−') { const z = t[i++], r = punkt(); w = z === '+' ? w + r : w - r; }
    return w;
  };
  const w = strich();
  return i === t.length ? w : NaN;
}
const istAusdruck = (s) => new RegExp(`^${AUSDRUCK}$`).test(String(s).trim()) && !Number.isNaN(rechne(s));
const hatZeichen = (s) => /[+−·:]/.test(s);

// Alle Gleichungen in einem Text: „12 + 3 = 15“, „7 · 8 = 56 = 50 + 6“, „14 : 4 = 3 Rest 2“.
const EINHEITEN = /(?<=\d) (?:€|Euro|Cent|ct|cm|mm|km|m|kg|g|l|min|h|Einer|Zehner|Hunderter|Tausender)(?=[\s.,;:!?)]|$)/g;
const GLEICHUNG = new RegExp(`(?<! [+−·:=≈] )(?<![\\d▢_(\\[A-Za-zÄÖÜäöüß\\u00a0])(${AUSDRUCK})((?: = ${AUSDRUCK})+)(?: Rest (\\d+))?(?! ?[+−·:=▢_\\d]| Rest)`, 'g');
function gleichungenIn(text) {
  if (bruchModus) return bGleichungen(text);
  let roh = String(text);
  const mitGroessen = groessenModus ? gGleichungen(roh) : [];
  for (const g of mitGroessen) roh = roh.replace(g.ganz, '#'.repeat(g.ganz.length));
  const t = roh.replace(EINHEITEN, '');
  if (mitGroessen.length) return [...mitGroessen, ...[...t.matchAll(GLEICHUNG)].map((m) => ({ ganz: m[0], seiten: [m[1], ...m[2].split(' = ').slice(1)], rest: m[3] == null ? null : Number(m[3]), danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1) }))];
  return [...t.matchAll(GLEICHUNG)].map((m) => ({ ganz: m[0], seiten: [m[1], ...m[2].split(' = ').slice(1)], rest: m[3] == null ? null : Number(m[3]), danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1) }));
}
// Stimmt die Gleichung? Mit Rest: Dividend : Divisor = Quotient Rest r.
function stimmt(g) {
  if (g.groesse) return g.ok;
  if (g.rest != null) {
    const m = g.seiten.length === 2 && g.seiten[0].match(new RegExp(`^(${NUM}) : (${NUM})$`));
    if (!m) return false;
    const [a, d, q] = [zahlAus(m[1]), zahlAus(m[2]), rechne(g.seiten[1])];
    return d > 0 && g.rest < d && q * d + g.rest === a;
  }
  const werte = g.seiten.map(rechne);
  return werte.every((w) => !Number.isNaN(w) && w === werte[0]);
}
// Der Rechenausdruck, mit dem ein Text beginnt („574 + 277, denn …“).
const anfang = (text) => String(text).match(new RegExp(`^${AUSDRUCK}(?= = |[,.;]|$)`))?.[0] ?? null;
// Beginnt eine Antwort mit Zustimmung (true) oder Ablehnung (false)? Sonst null.
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nie|Stimmt nie|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false
  : /^(Stimmt|Richtig|Ja|Das stimmt immer)(?![a-zäöü])(?!, aber| nur)/.test(text) ? true : null);
const rundet = (a, b) => [10, 100, 1000, 10000].some((p) => Math.round(a / p) * p === b);

// ---------- Jahresplan ----------
const lernziele = new Map();
const kapitelVon = new Map();
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  if (lernziele.has(l.id)) melde(l.id, 'Lernziel-ID doppelt');
  lernziele.set(l.id, u);
  kapitelVon.set(l.id, k);
}
// Wörter, die erst ab einer höheren Stufe im Wortspeicher stehen. Es zählt die früheste Stufe im ganzen Kapitel.
const wortAb = new Map();
for (const k of pool.kapitel) {
  const ab = new Map();
  for (const u of k.unterkapitel) for (const w of u.wortspeicher ?? []) for (const wort of w.wort.split(' ')) {
    if (!ab.has(wort) || NIVEAUS.indexOf(w.ab) < NIVEAUS.indexOf(ab.get(wort))) ab.set(wort, w.ab);
  }
  wortAb.set(k.id, ab);
}
const B_ = 'A-Za-zÄÖÜäöüß';
const wortMuster = (wort) => (/^[A-ZÄÖÜ]/.test(wort)
  ? new RegExp(`(?<![${B_}])${wort}(?:e|en|n|s|es)?(?![${B_}])`)
  : new RegExp(wort.replace(/e?n$/, ''), 'i'));

// ---------- Einzelprüfungen ----------
const pruefeZahl = (id, a, was = 'Lösung') => {
  if (!Number.isInteger(a.loesung) || a.loesung < 0) melde(id, `${was} ist keine natürliche Zahl`);
  for (const f of a.typischeFehler ?? []) {
    if (f.wert === a.loesung || (a.toleranz && Math.abs(f.wert - a.loesung) <= a.toleranz)) melde(id, 'typischer Fehler ist gleich der Lösung');
    if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  const werte = (a.typischeFehler ?? []).map((f) => f.wert);
  if (new Set(werte).size !== werte.length) melde(id, 'typischer Fehler doppelt');
};
const sichtbareTexte = (a) => [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.teile ?? []).flatMap((t) => [t.text, ...(t.optionen ?? []).map((o) => o.text)]), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts])];
const loesungenVon = (a) => [
  ...(typeof a.loesung === 'number' ? [a.loesung] : []),
  ...Object.values(a.luecken ?? {}).map((l) => l.loesung),
  ...(a.teile ?? []).filter((t) => !t.optionen).map((t) => t.loesung),
  ...(a.format === 'strichliste' ? (a.zeilen ?? []).map((z) => z.loesung) : []),
  ...(a.format === 'zeichnen' ? (a.diagramm?.saeulen ?? []).filter((x) => x.offen).map((x) => x.wert) : []),
];
const wertVon = (x) => (typeof x === 'object' && x !== null ? x.wert : x);
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;

function pruefeHilfen(a) {
  const soll = KARTEN[a.niveau] ?? [];
  for (const h of soll) if (!a.hilfen?.[h]?.trim()) melde(a.id, `Hilfekärtchen ${h} fehlt`);
  for (const h of Object.keys(a.hilfen ?? {})) if (!soll.includes(h)) melde(a.id, `Hilfekärtchen ${h} ist auf Niveaustufe ${a.niveau} nicht vorgesehen`);
  for (const [name, h] of Object.entries(a.hilfen ?? {})) for (const g of gleichungenIn(h)) {
    if (g.danach === '?') continue; // vorgeführte Rechnung, die geprüft werden soll („20 : 4 = 6?“)
    if (!stimmt(g)) melde(a.id, `Gleichung im Hilfekärtchen ${name} stimmt nicht: ${g.ganz}`);
  }
}

const NEBENSATZ = /,\s(weil|dass|wenn|damit|obwohl|sodass|ob|der|die|das|denen|deren)\s/;
function pruefeSprache(a) {
  const stufe = NIVEAUS.indexOf(a.niveau);
  const texte = sichtbareTexte(a), mitHilfen = [...texte, ...Object.values(a.hilfen ?? {})];
  // Wortschatz: keine Fachwörter höherer Stufen, auch nicht in den Hilfekärtchen.
  for (const [wort, ab] of wortAb.get(kapitelVon.get(a.lernziel)?.id) ?? []) if (NIVEAUS.indexOf(ab) > stufe) {
    const muster = wortMuster(wort);
    const stelle = mitHilfen.find((t) => muster.test(t));
    if (stelle) melde(a.id, `Wort „${wort}“ steht erst ab Niveaustufe ${ab} im Wortspeicher („${stelle.replace(/\n/g, ' / ').slice(0, 70)}“)`);
  }
  if (stufe === 0 && mitHilfen.some((t) => /schriftlich/i.test(t))) melde(a.id, 'auf F wird nicht schriftlich gerechnet');
  // Kapitel 5 (Nils, 2026-11-21): die Zeichen ⊥ und ∥ erst ab G, „orthogonal“ nur auf E, keine Kommazahlen.
  if (a.lernziel.startsWith('5.5.')) {
    if (stufe === 0 && mitHilfen.some((t) => /[⊥∥]/.test(t))) melde(a.id, 'die Zeichen ⊥ und ∥ gibt es erst ab G');
    if (mitHilfen.some((t) => /\d,\d/.test(t))) melde(a.id, 'Kapitel 5 kommt ohne Kommazahlen aus');
  }
  // Kapitel 6 (Nils, 2026-11-21): Komma, Brüche und seltene Einheiten je Niveaustufe.
  if (a.lernziel.startsWith('5.6.')) for (const x of sprachMaengel(a.niveau, mitHilfen)) melde(a.id, x);
  if (a.lernziel.startsWith('5.8.')) for (const x of flaecheSprachMaengel(a.niveau, mitHilfen)) melde(a.id, x);
  if (a.lernziel.startsWith('5.7.')) for (const x of winkelSprachMaengel(a.niveau, mitHilfen)) melde(a.id, x);
  if (istBruchLernziel(a.lernziel)) for (const x of bruchSprachMaengel(a, mitHilfen)) melde(a.id, x);
  // Einfache Sprache auf F und G: kurze Sätze, jeder Satz in einer eigenen Zeile, keine Nebensätze.
  if (stufe <= 1) for (const t of texte) for (const zeile of t.split('\n')) {
    const saetze = zeile.replace(/\{\{\w+\}\}/g, 'x').split(/(?<=[.?!])\s+(?=[A-ZÄÖÜ„])/).filter(Boolean);
    if (saetze.length > 1) melde(a.id, `einfache Sprache: mehrere Sätze in einer Zeile („${zeile}“)`);
    if (zeile.split(/\s+/).filter((w) => /[\dA-Za-zÄÖÜäöüß]/.test(w)).length > 14) melde(a.id, `einfache Sprache: Zeile mit mehr als 14 Wörtern („${zeile}“)`);
    if (NEBENSATZ.test(zeile)) melde(a.id, `einfache Sprache: Nebensatz („${zeile}“)`);
  }
}

// Zahlenraum (ADR 0015): Die Zahlengröße trennt die Stufen nicht, aber F bleibt im Hunderterraum.
function pruefeZahlenraum(a) {
  const kapitel = kapitelVon.get(a.lernziel)?.id;
  const stufe = NIVEAUS.indexOf(a.niveau);
  const raster = a.tabelle?.art === 'raster';
  // Zahlen im Zweiersystem (1011₂) sind keine Zahlen des Zehnersystems und zählen hier nicht.
  const ohneDual = (t) => String(t).replace(/[01]+₂/g, ' ');
  const zahlen = [...[a.text, ...(a.teile ?? []).map((t) => t.text), ...(a.optionen ?? []).filter((o) => o.richtig).map((o) => o.text)].map(ohneDual).flatMap(zahlenIn), ...(raster ? [...a.tabelle.rechnung.zahlen, a.tabelle.rechnung.ergebnis] : a.format === 'groesse' ? [Math.floor(a.loesung / (einheitFaktor(a.einheit) ?? 1))] : loesungenVon(a))];
  for (const n of zahlen) {
    let ok = true;
    // Kapitel 1: F bis 100, G bis 1000, M bis 10 000, E bis 100 000.
    if (kapitel === '5.1') ok = n <= [100, 1000, 10000, 100000][stufe];
    // Kapitel 6: Große Maßzahlen entstehen beim Umwandeln (3 km = 3000 m), darum reicht F bis 10 000.
    if (kapitel === '5.6') ok = n <= [10000, 100000, 10000000, 1000000000][stufe];
    if (kapitel === '5.3') ok = stufe === 0 ? n <= (raster ? 999 : 100) : n <= 20000;
    // Kapitel 4: Auf F höchstens das Einmaleins bis 12 · 12 und glatte Zehnerzahlen (Nils, 2026-11-18).
    if (kapitel === '5.4') ok = stufe === 0 ? n <= 144 || (n <= 1000 && n % 10 === 0) : stufe === 1 ? n <= 10000 : stufe === 2 ? n <= 100000 : n <= 1000000;
    // Kapitel 2 (Nils, 2026-11-21): Hier ist die Zahlengröße selbst der Stoff.
    const uk = a.lernziel.split('-')[0];
    if (uk === '5.2.1') ok = n <= (stufe === 0 ? 10000 : 1000000);
    if (uk === '5.2.2') ok = stufe === 0 ? n < 1e9 : n < 1e15;
    if (uk === '5.2.3') ok = n <= (stufe <= 1 ? 100000 : 100000000);
    if (uk === '5.2.4') ok = n <= [200, 1000, 100000, 100000][stufe];
    if (uk === '5.2.5') ok = n <= [16, 32, 256, 1024][stufe];
    if (uk === '5.2.X1') ok = n <= [20, 100, 3000, 3999][stufe];
    if (!ok) melde(a.id, `Zahl ${n} liegt außerhalb des Zahlenraums der Niveaustufe ${a.niveau}`);
  }
}

// Zahlen im Aufgabentext, die zur Rechnung gehören. Zählwörter des Auftrags („in 2 Schritten“, „Klasse 5a“, „1 Kind“) gehören nicht dazu.
const OHNE_RECHENWERT = /\d+ Schritten|\d+-mal|auf \d+ Wegen|[Ww]elche \d+ (?:Zahlen|Aufgaben)|erst \d+ Zahlen|Weg \d+|\d+[a-d](?![a-zäöü])|\d+ Uhr|in \d+ Klassen|aus \d+ Feldern|\d+er-|(?<![\d\u00a0])1 (?=[A-ZÄÖÜ])/g;
const textZahlen = (a) => [a.text, ...(a.teile ?? []).map((t) => t.text)].flatMap((t) => zahlenIn(t.replace(OHNE_RECHENWERT, ' ')));

// ---------- Nachweis ----------
// Sonderfälle, die sich nicht als einzelne Rechnung schreiben lassen. Jede Art wird hier durch Ausprobieren aller Fälle bestätigt.
const permutationen = (liste) => (liste.length <= 1 ? [liste] : liste.flatMap((x, i) => permutationen([...liste.slice(0, i), ...liste.slice(i + 1)]).map((p) => [x, ...p])));
const kombinationen = (anzahl) => (anzahl === 0 ? [[]] : kombinationen(anzahl - 1).flatMap((k) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((z) => [...k, z])));
const einsetzen = (muster, ziffern) => { let i = 0; return muster.replace(/▢/g, () => ziffern[i++]); };
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// Kapitel 1: Daten aus einem Bild, einer Liste von Antworten (Urliste), einer Tabelle (daten) oder dem vorgegebenen Teil eines Diagramms.
const TAGNAMEN = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
const ohneZeichen = (t) => String(t).replace(/[„“‚‘]/g, '').trim();
// Welcher Name ist mit einer Antwort gemeint? Wochentage dürfen ausgeschrieben sein.
const nameIn = (text, namen) => namen.find((n) => ohneZeichen(text) === n || TAGNAMEN[n] === ohneZeichen(text));
// Striche einer Zeile in der Strichliste. „IIII/“ ist ein richtiges Bündel, „IIIII/“ ein falsches (sechs Striche).
const strichzahl = (z) => (z.striche ? [...z.striche].filter((c) => c === 'I' || c === '/').length : z.anzahl);
const richtigGebuendelt = (z) => !z.striche || new RegExp(`^(IIII/)*I{0,4}$`).test(z.striche);
const DATENBILDER = ['saeulen', 'bilddiagramm', 'strichliste'];
function datenVon(a, quelle, spalte = 1) {
  const b = a.bild;
  const lies = (liste) => new Map((liste ?? []).map((x) => [x.name, istFrage(x.wert) ? null : wertVon(x.wert)]));
  const q = quelle ?? (DATENBILDER.includes(b?.art) ? 'bild' : a.format === 'zeichnen' ? 'diagramm' : a.daten ? 'daten' : 'urliste');
  if (q === 'bild') return b?.art === 'saeulen' ? lies(b.saeulen) : b?.art === 'bilddiagramm' ? lies(b.zeilen) : b?.art === 'strichliste' ? new Map(b.zeilen.map((z) => [z.name, strichzahl(z)])) : null;
  if (q === 'urliste') { if (!a.urliste) return null; const m = new Map(); for (const x of a.urliste) m.set(x, (m.get(x) ?? 0) + 1); return m; }
  if (q === 'daten') return a.daten ? new Map(a.daten.zeilen.map((z) => [z[0], /^\d[\d\u00a0]*$/.test(String(z[spalte])) ? zahlAus(z[spalte]) : null])) : null;
  if (q === 'diagramm') return a.diagramm ? new Map(a.diagramm.saeulen.filter((x) => !x.offen).map((x) => [x.name, x.wert])) : null;
  return null;
}
// Stimmt eine Aussage über die Daten? Die Namen stehen in der Reihenfolge des Satzes.
function aussageWahr(typ, nm, m, wert) {
  const v = (x) => m.get(x), alle = [...m.values()];
  if (nm.some((x) => typeof v(x) !== 'number')) return undefined;
  const einmal = (z) => alle.filter((x) => x === z).length === 1;
  switch (typ) {
    case 'meiste': return v(nm[0]) === Math.max(...alle) && einmal(v(nm[0]));
    case 'wenigste': return v(nm[0]) === Math.min(...alle) && einmal(v(nm[0]));
    case 'mehr': return v(nm[0]) > v(nm[1]);
    case 'gleich': return v(nm[0]) === v(nm[1]);
    case 'anzahl': return v(nm[0]) === wert;
    case 'summeMehr': return v(nm[0]) + v(nm[1]) > v(nm[2]);
    case 'doppelt': return v(nm[0]) === 2 * v(nm[1]);
    case 'mehrAlsDoppelt': return v(nm[0]) > 2 * v(nm[1]);
    case 'mehrAlsHaelfte': return 2 * v(nm[0]) > alle.reduce((x, y) => x + y, 0);
    default: return undefined;
  }
}
const NAMEN_JE_AUSSAGE = { meiste: 1, wenigste: 1, anzahl: 1, mehrAlsHaelfte: 1, mehr: 2, gleich: 2, doppelt: 2, mehrAlsDoppelt: 2, summeMehr: 3 };
// Die Antworten sind Namen aus den Daten. Richtig ist genau der Name, auf den die Bedingung zutrifft.
function pruefeNamenwahl(a, m, trifft) {
  const namen = [...m.keys()];
  const passend = namen.filter(trifft);
  if (passend.length === 0 || (!a.mehrfach && passend.length !== 1)) return `Bedingung trifft auf ${passend.length} Zeilen zu`;
  for (const o of a.optionen ?? []) {
    const n = nameIn(o.text, namen);
    if (!n) return `Antwort „${o.text}“ ist kein Name aus den Daten`;
    if (passend.includes(n) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
  }
  return null;
}
// Achse „In 5er-Schritten bis 40“: passt, wenn jeder Wert auf einer Linie liegt, der größte Wert auf die Achse passt und es höchstens 20 Linien sind.
const EINTEILUNG = /^In (\d+)er-Schritten bis (\d[\d\u00a0]*)(?:, denn .+)?$/;
const einteilungPasst = (text, werte) => {
  const m = text.match(EINTEILUNG);
  if (!m) return undefined;
  const [s, max] = [zahlAus(m[1]), zahlAus(m[2])];
  return max % s === 0 && max >= Math.max(...werte) && max / s <= 20 && werte.every((w) => w % s === 0);
};
const MAENGEL = { 'Der Titel fehlt.': 'titel', 'Die Einheit fehlt.': 'einheit', 'Eine Säule fehlt.': 'saeule', 'Die Achse beginnt nicht bei 0.': 'achse', 'Nichts, das Diagramm ist in Ordnung.': 'nichts' };

// ---------- Kapitel 2: Natürliche Zahlen ----------
// Alles wird hier unabhängig vom Erzeuger nachgerechnet: Stellen, Zahlwörter (vom Wort zur Zahl), Runden, Zweiersystem, römische Zahlzeichen.
const STELLEN = ['E', 'Z', 'H', 'T', 'ZT', 'HT', 'M', 'ZM', 'HM', 'Md', 'ZMd', 'HMd', 'B', 'ZB', 'HB'];
const STELLENWORT = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender', 10000: 'Zehntausender', 100000: 'Hunderttausender', 1000000: 'Million' };
const istStufe = (x) => /^10+$/.test(String(x));
const gerundet = (zahl, auf) => { const rest = zahl % auf; return rest * 2 >= auf ? zahl - rest + auf : zahl - rest; };
// Vom Zahlwort zur Zahl. null, wenn das Wort keine Zahl ist.
const WORT_EINER = { ein: 1, eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, dreizehn: 13, vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19 };
const WORT_ZEHNER = { zwanzig: 20, dreißig: 30, vierzig: 40, fünfzig: 50, sechzig: 60, siebzig: 70, achtzig: 80, neunzig: 90 };
function unterTausend(w) {
  if (w === '') return 0;
  let rest = w, wert = 0;
  const hundert = rest.match(/^(ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun)hundert/);
  if (hundert) { wert += WORT_EINER[hundert[1]] * 100; rest = rest.slice(hundert[0].length); }
  if (rest === '') return wert;
  if (rest in WORT_EINER) return wert + WORT_EINER[rest];
  if (rest in WORT_ZEHNER) return wert + WORT_ZEHNER[rest];
  const m = rest.match(/^(ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun)und(\w+)$/u);
  if (m && m[2] in WORT_ZEHNER) return wert + WORT_EINER[m[1]] + WORT_ZEHNER[m[2]];
  return null;
}
function zahlAusWort(wort) {
  if (wort === 'null') return 0;
  const teile = String(wort).split(' ');
  let wert = 0, i = 0, letzte = Infinity;
  const GROSS = [[/^Billion(en)?$/, 1e12], [/^Milliarden?$/, 1e9], [/^Million(en)?$/, 1e6]];
  while (i < teile.length) {
    const stufe = GROSS.find(([muster]) => muster.test(teile[i + 1] ?? ''));
    if (stufe) {
      const k = teile[i] === 'eine' ? 1 : unterTausend(teile[i]);
      if (k == null || k < 1 || stufe[1] >= letzte || (k === 1) !== /(Billion|Milliarde|Million)$/.test(teile[i + 1])) return null;
      wert += k * stufe[1]; letzte = stufe[1]; i += 2;
      continue;
    }
    if (i !== teile.length - 1) return null;
    const [vor, nach] = teile[i].includes('tausend') ? teile[i].split('tausend') : ['', teile[i]];
    const t = teile[i].includes('tausend') ? unterTausend(vor) : 0, e = unterTausend(nach);
    if (t == null || e == null || (teile[i].includes('tausend') && t < 1) || t + e === 0) return null;
    // Am Wortende heißt es „eins“, davor „ein“.
    if (/ein$/.test(nach) || /eins/.test(vor) || /eins(?!$)/.test(nach)) return null;
    wert += t * 1000 + e; i++;
  }
  return wert;
}
// Römische Zahlzeichen: Wert einer Zeichenfolge und die eine gültige Schreibweise einer Zahl.
const ROEM_WERT = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
function roemischZuZahl(t) {
  if (!/^[IVXLCDM]+$/.test(t)) return null;
  const w = [...t].map((c) => ROEM_WERT[c]);
  return w.reduce((sum, x, i) => (x < (w[i + 1] ?? 0) ? sum - x : sum + x), 0);
}
function zahlZuRoemisch(n) {
  const stelle = (z, eins, fuenf, zehn) => [``, eins, eins + eins, eins + eins + eins, eins + fuenf, fuenf, fuenf + eins, fuenf + eins + eins, fuenf + eins + eins + eins, eins + zehn][z];
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  return 'M'.repeat(Math.floor(n / 1000)) + stelle(Math.floor(n / 100) % 10, 'C', 'D', 'M') + stelle(Math.floor(n / 10) % 10, 'X', 'L', 'C') + stelle(n % 10, 'I', 'V', 'X');
}
const roemischGueltig = (t) => { const w = roemischZuZahl(t); return w != null && zahlZuRoemisch(w) === t; };
const dualZuZahl = (t) => (/^[01]+$/.test(t) ? [...t].reduce((w, c) => w * 2 + Number(c), 0) : null);
// Wert einer Karte oder Antwort in einem der drei Zahlsysteme.
const wertIn = (text, system) => {
  const t = String(text).trim();
  if (system === 'roemisch') return roemischZuZahl(t);
  if (system === 'dual') return dualZuZahl(t.replace(/₂$/, ''));
  if (system === 'wort') return zahlAusWort(t);
  return /^\d[\d ]*$/.test(t) ? zahlAus(t) : null;
};
// Was die Aufgabe dem Kind zeigt: Zahlen in Text, Antworten, Bild, Tabelle, Zahlenstrahl und Karten.
const gezeigt = (a) => new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...bildZahlen(a.bild), ...zahlenImObjekt(a.tabelle), ...zahlenImObjekt(a.strahl), ...(a.karten ?? []).flatMap(zahlenIn), ...zahlenImObjekt(a.daten)]);
const strahlVon = (a) => a.strahl ?? (a.bild?.art === 'zahlenstrahl' ? a.bild : null);
const schaetzSumme = (b) => b.felder.flat().reduce((x, y) => x + y, 0);
// Jede Antwort wird einzeln eingestuft: richtig genau dann, wenn `trifft` es sagt. undefined heißt: Die Antwort lässt sich nicht lesen.
function stufeEin(a, trifft, mindestens = 1) {
  let richtige = 0;
  for (const o of a.optionen ?? []) {
    const w = trifft(o.text);
    if (w === undefined) return `Antwort „${o.text}“ lässt sich nicht prüfen`;
    if (w !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    if (w) richtige++;
  }
  return richtige >= mindestens ? null : 'keine Antwort trifft zu';
}

// ---------- Kapitel 5: Geometrie auf dem Karogitter (ADR 0032) ----------
// Eigene Rechnung des Prüfers. Ein Punkt ist [x, y] in Kästchen, die y-Achse zeigt nach oben. 1 Kästchen sind 5 mm.
const gitterVon = (a) => a.gitter ?? (a.bild?.art === 'gitter' ? a.bild : null);
const V = (p, q) => [q[0] - p[0], q[1] - p[1]];
const det = (u, v) => u[0] * v[1] - u[1] * v[0];
const sp = (u, v) => u[0] * v[0] + u[1] * v[1];
const pGleich = (p, q) => Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9;
const mengeGleich = (A, B) => A.length === B.length && A.every((p) => B.some((q) => pGleich(p, q))) && B.every((p) => A.some((q) => pGleich(p, q)));
const gPunkt = (g, n) => { const p = (g?.punkte ?? []).find((x) => x.n === n); return p ? [p.x, p.y] : null; };
const gLinie = (g, n) => (g?.linien ?? []).find((l) => l.n === n) ?? null;
const gFigur = (g, n) => (g?.figuren ?? []).find((f) => f.n === n) ?? null;
const gAchse = (g) => { const l = (g?.linien ?? []).filter((x) => x.stil === 'achse'); return l.length === 1 ? l[0] : null; };
const aufLinie = (x, a, b) => Math.abs(det(V(a, b), V(a, x))) < 1e-9;
const lageZweier = (l1, l2) => { const u = V(l1.a, l1.b), v = V(l2.a, l2.b); return det(u, v) === 0 ? (det(u, V(l1.a, l2.a)) === 0 ? 'gleich' : 'parallel') : sp(u, v) === 0 ? 'senkrecht' : 'schraeg'; };
const lotfuss = (p, l) => { const d = V(l.a, l.b), t = sp(V(l.a, p), d) / sp(d, d); return [l.a[0] + t * d[0], l.a[1] + t * d[1]]; };
const spiegleAnLinie = (p, l) => { const f = lotfuss(p, l); return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
const spiegleAnPunkt = (p, z) => [2 * z[0] - p[0], 2 * z[1] - p[1]];
const imGitter = (g, p) => Array.isArray(p) && Number.isInteger(p[0]) && Number.isInteger(p[1]) && p[0] >= 0 && p[1] >= 0 && p[0] <= g.b && p[1] <= g.h;
const ganzeWurzel = (q) => { const w = Math.round(Math.sqrt(q)); return w * w === q ? w : null; };
const inEinheit = (k, einheit) => (k == null ? null : einheit === 'mm' ? k * 5 : einheit === 'cm' ? (k % 2 === 0 ? k / 2 : null) : k);
const kantenBleiben = (ecken, f) => ecken.every((e, i) => { const [p, q] = [f(e), f(ecken[(i + 1) % ecken.length])];
  return ecken.some((x, k) => { const y = ecken[(k + 1) % ecken.length]; return (pGleich(p, x) && pGleich(q, y)) || (pGleich(p, y) && pGleich(q, x)); }); });
const schwerpunkt = (punkte) => [punkte.reduce((s_, p) => s_ + p[0], 0) / punkte.length, punkte.reduce((s_, p) => s_ + p[1], 0) / punkte.length];
// Bildet die Abbildung f die Figur auf sich ab? Vieleck: Ecken auf Ecken und Seiten auf Seiten. Kästchen: Mitten auf Mitten.
const bleibt = (figur, f) => (figur.zellen ? mengeGleich(figur.zellen.map(f), figur.zellen) : mengeGleich(figur.ecken.map(f), figur.ecken) && kantenBleiben(figur.ecken, f));
// Eine Figur der Aufgabe: ein benanntes Vieleck oder die gefärbten Kästchen ('zellen', als Mittelpunkte).
const figurVon = (g, wer) => (wer === 'zellen' ? (g?.zellen?.length ? { zellen: g.zellen.map(([x, y]) => [x + 0.5, y + 0.5]) } : null) : gFigur(g, wer));
const mittePunkte = (figur) => { const p = figur.zellen ?? figur.ecken, xs = p.map((q) => q[0]), ys = p.map((q) => q[1]);
  return figur.zellen ? [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2] : schwerpunkt(p); };
// Alle Symmetrieachsen: Geraden durch die Mitte und eine Ecke oder Seitenmitte (bei Kästchen: waagerecht, senkrecht, beide Diagonalen).
function achsenVon(figur) {
  const c = mittePunkte(figur);
  const ziele = figur.zellen ? [[c[0] + 1, c[1]], [c[0], c[1] + 1], [c[0] + 1, c[1] + 1], [c[0] + 1, c[1] - 1]]
    : [...figur.ecken, ...figur.ecken.map((e, i) => schwerpunkt([e, figur.ecken[(i + 1) % figur.ecken.length]]))].filter((k) => !pGleich(k, c));
  const achsen = [];
  for (const k of ziele) {
    const l = { a: c, b: k };
    if (bleibt(figur, (p) => spiegleAnLinie(p, l)) && !achsen.some((x) => Math.abs(det(V(x.a, x.b), V(l.a, l.b))) < 1e-9)) achsen.push(l);
  }
  return achsen;
}
const istAchse = (figur, l) => bleibt(figur, (p) => spiegleAnLinie(p, l));
const punktsymmetrisch = (figur) => { const c = mittePunkte(figur); return bleibt(figur, (p) => spiegleAnPunkt(p, c)); };
// Viereck aus vier Ecken in ihrer Reihenfolge: Eigenschaften und alle Namen, die zutreffen (ein Quadrat ist auch Rechteck, Raute, Parallelogramm, Trapez und Drachen).
function viereckVon(e) {
  if (!Array.isArray(e) || e.length !== 4) return null;
  const s_ = [0, 1, 2, 3].map((i) => V(e[i], e[(i + 1) % 4])), l2 = s_.map((v) => sp(v, v));
  const k = [0, 1, 2, 3].map((i) => det(s_[i], s_[(i + 1) % 4]));
  const konvex = k.every((x) => x > 0) || k.every((x) => x < 0);
  const par = [det(s_[0], s_[2]) === 0, det(s_[1], s_[3]) === 0], rechte = [0, 1, 2, 3].filter((i) => sp(s_[i], s_[(i + 1) % 4]) === 0).length;
  const gleichlang = l2.every((x) => x === l2[0]), d1 = V(e[0], e[2]), d2 = V(e[1], e[3]);
  const drachen = (l2[0] === l2[3] && l2[1] === l2[2]) || (l2[0] === l2[1] && l2[2] === l2[3]);
  const typen = new Set(['Viereck']);
  if (par[0] || par[1]) typen.add('Trapez');
  if (par[0] && par[1]) typen.add('Parallelogramm');
  if (rechte === 4) typen.add('Rechteck');
  if (gleichlang) typen.add('Raute');
  if (rechte === 4 && gleichlang) typen.add('Quadrat');
  if (drachen) typen.add('Drachen');
  const genau = ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Drachen', 'Trapez', 'Viereck'].find((t) => typen.has(t));
  return { ok: konvex, typen, genau, parallelPaare: par.filter(Boolean).length, rechteWinkel: rechte, gleichlang, gegenGleich: l2[0] === l2[2] && l2[1] === l2[3],
    diagonalenGleich: sp(d1, d1) === sp(d2, d2), diagonalenSenkrecht: sp(d1, d2) === 0, diagonalenHalbieren: pGleich(schwerpunkt([e[0], e[2]]), schwerpunkt([e[1], e[3]])),
    achsen: achsenVon({ ecken: e }).length, punktsymmetrisch: punktsymmetrisch({ ecken: e }) };
}
// Trifft eine Eigenschaft auf eine Figur zu? „nicht …“ kehrt um, „genau …“ meint den engsten Namen des Vierecks.
function figurHat(figur, was) {
  if (was.includes(' und ')) { const w = was.split(' und ').map((x) => figurHat(figur, x)); return w.includes(undefined) ? undefined : w.every(Boolean); }
  if (was.startsWith('nicht ')) { const w = figurHat(figur, was.slice(6)); return w === undefined ? undefined : !w; }
  if (was === 'achsensymmetrisch') return achsenVon(figur).length > 0;
  if (was === 'punktsymmetrisch') return punktsymmetrisch(figur);
  const m = was.match(/^(\d) Achsen?$/);
  if (m) return achsenVon(figur).length === Number(m[1]);
  const v = figur.ecken && viereckVon(figur.ecken);
  if (!v) return undefined;
  if (was.startsWith('genau ')) return v.genau === was.slice(6);
  if (v.typen.has(was) || ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'].includes(was)) return v.typen.has(was);
  return typeof v[was] === 'boolean' ? v[was] : undefined;
}
// Gitterzeichnen einer Linie: Erfüllen die beiden Punkte die Bedingung?
function linieErfuellt(bed, p, q) {
  if (!p || !q || pGleich(p, q)) return false;
  const r = V(p, q);
  switch (bed.art) {
    case 'strecke': return mengeGleich([p, q], [bed.a, bed.b]);
    case 'gerade': return aufLinie(p, bed.a, bed.b) && aufLinie(q, bed.a, bed.b);
    case 'eine': return bed.linien.some(([a, b]) => aufLinie(p, a, b) && aufLinie(q, a, b));
    case 'senkrecht': return sp(r, V(...bed.zu)) === 0 && (!bed.durch || aufLinie(bed.durch, p, q));
    case 'parallel': { const z = V(...bed.zu);
      return det(r, z) === 0 && !aufLinie(p, ...bed.zu) && (!bed.durch || aufLinie(bed.durch, p, q)) && (bed.abstand == null || det(z, V(bed.zu[0], p)) ** 2 === bed.abstand ** 2 * sp(z, z)); }
    case 'laenge': return sp(r, r) === bed.laenge ** 2 && (!bed.von || pGleich(p, bed.von) || pGleich(q, bed.von)) && (!bed.auf || (aufLinie(p, ...bed.auf) && aufLinie(q, ...bed.auf)));
    default: return false;
  }
}
// Aufbau eines Gitters (als Bild oder als Eingabe). Liefert den ersten Mangel oder null.
function gitterMangel(g) {
  if (!ganz(g?.b, 3, 18) || !ganz(g?.h, 3, 14)) return 'Größe passt nicht';
  const drin = (p) => Array.isArray(p) && p.length === 2 && p.every((x) => Number.isInteger(x * 2)) && p[0] >= 0 && p[1] >= 0 && p[0] <= g.b && p[1] <= g.h;
  for (const p of g.punkte ?? []) if (!drin([p.x, p.y]) || !/^[A-Z]['′]?$/.test(p.n ?? '')) return `Punkt ${p.n} liegt außerhalb oder hat keinen Namen`;
  for (const l of g.linien ?? []) { if (!drin(l.a) || !drin(l.b) || pGleich(l.a, l.b)) return 'Linie liegt außerhalb'; if (!['gerade', 'strecke', 'strahl'].includes(l.art)) return 'Linie ohne Art'; }
  for (const f of g.figuren ?? []) if (!Array.isArray(f.ecken) || f.ecken.length < 3 || !f.ecken.every(drin)) return 'Figur liegt außerhalb';
  // Kapitel 7: Kreise im Gitter liegen ganz im Gitter.
  for (const k of g.kreise ?? []) if (!drin(k.m) || !(k.r > 0) || k.m[0] - k.r < 0 || k.m[1] - k.r < 0 || k.m[0] + k.r > g.b || k.m[1] + k.r > g.h) return 'Kreis liegt außerhalb';
  for (const z of g.zellen ?? []) if (!ganz(z?.[0], 0, g.b - 1) || !ganz(z?.[1], 0, g.h - 1)) return 'Kästchen liegt außerhalb';
  for (const [was, namen] of [['Punkt', (g.punkte ?? []).map((p) => p.n)], ['Linie', (g.linien ?? []).map((l) => l.n).filter(Boolean)], ['Figur', (g.figuren ?? []).map((f) => f.n).filter(Boolean)]]) if (new Set(namen).size !== namen.length) return `${was} doppelt benannt`;
  for (const r of g.rechte ?? []) if (!drin(r.p) || sp(r.u, r.v) !== 0) return 'Zeichen für den rechten Winkel steht an keinem rechten Winkel';
  if (g.zentrum && !drin(g.zentrum)) return 'Symmetriezentrum liegt außerhalb';
  if ((g.linien ?? []).filter((l) => l.stil === 'achse').length > 1) return 'mehr als eine Symmetrieachse';
  return null;
}
const KOORD = /\((\d+)\|(\d+)\)/g;
const koordIn = (text) => [...String(text).matchAll(KOORD)].map((m) => [Number(m[1]), Number(m[2])]);
const LAGEWORT = { senkrecht: /senkrecht|Senkrechte|orthogonal|⊥|Lot|rechte[nr]? Winkel/, parallel: /parallel|Parallele|∥/ };

const ARTWORT = { gerade: 'Gerade', strecke: 'Strecke', strahl: 'Strahl' };
const schnittpunktVon = (l1, l2) => { const u = V(l1.a, l1.b), v = V(l2.a, l2.b), d = det(u, v); if (d === 0) return null; const t = det(V(l1.a, l2.a), v) / d; return [l1.a[0] + t * u[0], l1.a[1] + t * u[1]]; };
const GEO_SONDER = {
  // Strecke, Strahl oder Gerade? Antworten nennen Linien („Linie a“) oder die drei Namen. Zuordnen: links die Linie, rechts ihr Name.
  linienart: (n, a) => {
    const g = gitterVon(a);
    if (n.linie) {
      const l = gLinie(g, n.linie);
      if (!l || l.art !== n.was) return `Linie ${n.linie} ist ${l?.art ?? 'nicht im Bild'}, nicht ${n.was}`;
      if (a.format === 'auswahl' && a.optionen.every((o) => Object.values(ARTWORT).includes(o.text))) return stufeEin(a, (t) => t === ARTWORT[n.was]);
      return null;
    }
    if (a.format === 'zuordnen') { for (const p of a.paare) if (ARTWORT[gLinie(g, p.links.replace(/^Linie /, ''))?.art] !== p.rechts) return `${p.links} ist kein(e) ${p.rechts}`; return null; }
    return stufeEin(a, (t) => { if (/^Kein/.test(t)) return !(g.linien ?? []).some((l) => l.art === n.was); const l = gLinie(g, t.replace(/^Linie /, '')); return l ? l.art === n.was : undefined; });
  },
  linienzahl: (n, a) => { const k = (gitterVon(a)?.linien ?? []).filter((l) => l.art === n.was).length; return k === n.wert ? null : `im Bild sind ${k}, nicht ${n.wert}`; },
  // So viele Verbindungen (Strecken, Geraden, Schnittpunkte) gibt es höchstens zwischen n Dingen: jedes mit jedem.
  verbindungen: (n, a) => {
    const k = n.n ?? (gitterVon(a)?.punkte ?? []).length;
    if (n.n != null && !zahlenIn(a.text).includes(n.n) && !/zwei|drei|vier|fünf|sechs/.test(a.text)) return `${n.n} steht nicht im Text`;
    return k * (k - 1) / 2 === n.wert ? null : `es sind ${k * (k - 1) / 2}, nicht ${n.wert}`;
  },
  // Der Schnittpunkt zweier Linien (benannt oder durch je zwei benannte Punkte) ist ein Gitterpunkt und die Lösung.
  schnittpunkt: (n, a) => {
    const g = gitterVon(a), linien = n.linien ? n.linien.map((x) => gLinie(g, x)) : n.punkte.map(([p, q]) => ({ a: gPunkt(g, p), b: gPunkt(g, q) }));
    if (linien.some((l) => !l?.a || !l?.b)) return 'Linie fehlt im Bild';
    const sch = schnittpunktVon(...linien);
    if (!sch || !imGitter(g, sch.map((x) => Math.round(x * 1e6) / 1e6))) return 'kein Schnittpunkt auf einem Gitterpunkt';
    if (a.format === 'gitter') return mengeGleich([sch], a.loesung) ? null : `der Schnittpunkt ist (${sch})`;
    if (n.x != null && (n.x !== sch[0] || n.y !== sch[1])) return `der Schnittpunkt ist (${sch}), nicht (${n.x}|${n.y})`;
    if (n.luecken) { const [lx, ly] = n.luecken.map((k) => a.luecken?.[k]?.loesung); if (lx !== sch[0] || ly !== sch[1]) return 'Lücken passen nicht zum Schnittpunkt'; }
    if (a.format === 'auswahl' && a.optionen.every((o) => koordIn(o.text).length === 1)) return stufeEin(a, (t) => pGleich(koordIn(t)[0], sch));
    return null;
  },
  // Antworten nennen Punkte oder Koordinaten. Richtig ist jeder, der auf der Linie von `von` durch `durch` liegt (Gerade, Strahl oder Strecke) oder die Bedingung an seine Koordinaten erfüllt.
  punktwahl: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.von), q = gPunkt(g, n.durch), l = n.linie ? gLinie(g, n.linie) : null;
    const trifft = (x) => {
      if (n.linie || n.linienart) {
        const [a_, b_] = l ? [l.a, l.b] : [p, q], art = l?.art ?? n.linienart;
        if (!a_ || !b_) return undefined;
        if (!aufLinie(x, a_, b_)) return false;
        const t = sp(V(a_, x), V(a_, b_)) / sp(V(a_, b_), V(a_, b_));
        return art === 'gerade' ? true : art === 'strahl' ? t >= 0 : t >= 0 && t <= 1;
      }
      return { x: x[0] === n.wert, y: x[1] === n.wert, 'x=y': x[0] === x[1], 'x>y': x[0] > x[1], 'x<y': x[0] < x[1] }[n.was];
    };
    return stufeEin(a, (t) => { if (/^Kein/.test(t)) return !(g.punkte ?? []).some((x) => ![n.von, n.durch].includes(x.n) && trifft([x.x, x.y])); const x = gPunkt(g, t.replace(/^Punkt /, '')) ?? (koordIn(t).length === 1 ? koordIn(t)[0] : null); return x ? trifft(x) : undefined; });
  },
  // Schrittmuster am Karogitter: Die Schritte u und v gehören zu senkrechten oder parallelen Linien.
  schritt: (n) => (n.lage === 'senkrecht' ? sp(n.u, n.v) === 0 : det(n.u, n.v) === 0) && (n.u[0] || n.u[1]) && (n.v[0] || n.v[1]) ? null : `die Schritte (${n.u}) und (${n.v}) sind nicht ${n.lage}`,
  // Antworten nennen Ecken („Bei A“). Richtig ist die Ecke des Dreiecks mit dem rechten Winkel.
  rechterWinkel: (n, a) => {
    const g = gitterVon(a), e = n.ecken.map((x) => gPunkt(g, x));
    if (e.length !== 3 || e.some((x) => !x)) return 'Dreieck fehlt im Bild';
    const recht = (i) => sp(V(e[i], e[(i + 1) % 3]), V(e[i], e[(i + 2) % 3])) === 0;
    return stufeEin(a, (t) => { if (/keiner/.test(t)) return ![0, 1, 2].some(recht); const i = n.ecken.indexOf(t.replace(/^Bei /, '').replace(/\.$/, '')); return i < 0 ? undefined : recht(i); });
  },
  // Antworten nennen Punkte. Richtig ist jeder Punkt X, für den die Linie durch `durch` und X zur Linie durch `von` und `durch` die Lage hat.
  lagepunkt: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.von), q = gPunkt(g, n.durch), b = n.ab ? gPunkt(g, n.ab) : q;
    if (!p || !q || !b) return 'Punkt fehlt im Bild';
    return stufeEin(a, (t) => { const x = gPunkt(g, t.replace(/^Punkt /, '')); if (!x || pGleich(x, b)) return undefined; return n.lage === 'senkrecht' ? sp(V(p, q), V(b, x)) === 0 : det(V(p, q), V(b, x)) === 0 && !aufLinie(x, p, q); });
  },
  // Zwei benannte Linien stehen senkrecht, parallel oder schräg zueinander. Antworten „senkrecht“, „parallel“, „weder noch“ werden eingestuft.
  lage: (n, a) => {
    const g = gitterVon(a), [l1, l2] = (n.linien ?? []).map((x) => gLinie(g, x));
    if (!l1 || !l2) return 'Linie fehlt im Bild';
    const ist = lageZweier(l1, l2);
    if (ist !== n.lage) return `${n.linien.join(' und ')} sind ${ist}, nicht ${n.lage}`;
    const wort = (t) => (/[Ww]eder|keins|nichts/.test(t) ? 'schraeg' : /^(Sie sind )?senkrecht|^⊥/.test(t) ? 'senkrecht' : /^(Sie sind )?parallel|^∥/.test(t) ? 'parallel' : undefined);
    if (a.format === 'auswahl' && a.optionen.every((o) => wort(o.text) !== undefined)) return stufeEin(a, (t) => wort(t) === ist);
    return null;
  },
  // Antworten nennen Paare von Linien („g und h“, „g ⊥ h“, „g ∥ h“). Richtig ist ein Paar genau dann, wenn es die Lage hat.
  lagewahl: (n, a) => {
    const g = gitterVon(a), benannt = (g?.linien ?? []).filter((l) => l.n);
    const paare = benannt.flatMap((l1, i) => benannt.slice(i + 1).map((l2) => lageZweier(l1, l2)));
    return stufeEin(a, (t) => {
      if (/^Kein/.test(t)) return !paare.includes(n.lage);
      const m = t.match(/^([a-z]) (und|⊥|∥) ([a-z])(?![a-zäöü])/);
      if (!m) return undefined;
      const [l1, l2] = [gLinie(g, m[1]), gLinie(g, m[3])];
      if (!l1 || !l2) return undefined;
      const ist = lageZweier(l1, l2);
      // Ein Zeichen in der Antwort behauptet selbst eine Lage.
      return m[2] === '⊥' ? ist === 'senkrecht' && n.lage === 'senkrecht' : m[2] === '∥' ? ist === 'parallel' && n.lage === 'parallel' : ist === n.lage;
    });
  },
  // Antworten nennen einzelne Linien. Richtig ist eine Linie genau dann, wenn sie zur genannten Linie die Lage hat.
  lagezu: (n, a) => {
    const g = gitterVon(a), zu = gLinie(g, n.zu);
    if (!zu) return 'Linie fehlt im Bild';
    return stufeEin(a, (t) => { if (/^Kein/.test(t)) return !(g.linien ?? []).some((l) => l.n && l.n !== n.zu && lageZweier(l, zu) === n.lage); const l = gLinie(g, t.replace(/^(Gerade|Strecke|Linie) /, '')); return l ? lageZweier(l, zu) === n.lage : undefined; });
  },
  // So viele der anderen benannten Linien haben zur genannten Linie die Lage.
  lagezuZahl: (n, a) => {
    const g = gitterVon(a), zu = gLinie(g, n.zu);
    if (!zu) return 'Linie fehlt im Bild';
    const k = (g.linien ?? []).filter((l) => l.n && l.n !== n.zu && lageZweier(l, zu) === n.lage).length;
    return k === n.wert ? null : `es sind ${k} Linien, nicht ${n.wert}`;
  },
  // So viele Paare benannter Linien haben die Lage.
  lagezahl: (n, a) => {
    const benannt = (gitterVon(a)?.linien ?? []).filter((l) => l.n);
    const k = benannt.flatMap((l1, i) => benannt.slice(i + 1).map((l2) => lageZweier(l1, l2))).filter((x) => x === n.lage).length;
    return k === n.wert ? null : `es sind ${k} Paare, nicht ${n.wert}`;
  },
  // Koordinaten eines benannten Punktes. Lücken, Antworten mit Koordinaten oder mit Punktnamen werden daran geprüft.
  koordinaten: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.punkt);
    if (!g?.achsen) return 'kein Koordinatensystem';
    if (!p) return `Punkt ${n.punkt} fehlt im Bild`;
    if (p[0] !== n.x || p[1] !== n.y) return `${n.punkt} liegt bei (${p[0]}|${p[1]}), nicht bei (${n.x}|${n.y})`;
    if (n.luecken) { const [lx, ly] = n.luecken.map((k) => a.luecken?.[k]?.loesung); if (lx !== p[0] || ly !== p[1]) return `Lücken ${n.luecken.join(', ')} passen nicht zu (${p[0]}|${p[1]})`; }
    if (a.format === 'auswahl' && a.optionen.every((o) => koordIn(o.text).length === 1)) return stufeEin(a, (t) => pGleich(koordIn(t)[0], p));
    if (a.format === 'auswahl' && a.optionen.every((o) => gPunkt(g, o.text.replace(/^Punkt /, '')))) return stufeEin(a, (t) => pGleich(gPunkt(g, t.replace(/^Punkt /, '')), p));
    return null;
  },
  // Zuordnen: links ein Punktname, rechts seine Koordinaten.
  koordinatenpaare: (n, a) => {
    const g = gitterVon(a);
    if (a.format !== 'zuordnen' || !g?.achsen) return 'braucht Zuordnen und ein Koordinatensystem';
    for (const p of a.paare) { const q = gPunkt(g, p.links), k = koordIn(p.rechts)[0]; if (!q || !k || !pGleich(q, k)) return `${p.links} liegt nicht bei ${p.rechts}`; }
    return null;
  },
  // Die vierte Ecke eines Parallelogramms (also auch Rechtecks) ABCD aus A, B und C: D = A + C − B.
  vierteEcke: (n, a) => {
    const g = gitterVon(a), [p, q, r] = n.ecken.map((x) => gPunkt(g, x) ?? koordIn(a.text)[['A', 'B', 'C'].indexOf(x)]);
    if (!p || !q || !r) return 'Ecke fehlt';
    const d = [p[0] + r[0] - q[0], p[1] + r[1] - q[1]];
    if (d[0] !== n.x || d[1] !== n.y) return `die vierte Ecke ist (${d}), nicht (${n.x}|${n.y})`;
    if (n.luecken) { const [lx, ly] = n.luecken.map((k) => a.luecken?.[k]?.loesung); if (lx !== d[0] || ly !== d[1]) return 'Lücken passen nicht zur vierten Ecke'; }
    return null;
  },
  // Gitterzeichnen: ein Punkt, der von einem benannten Punkt aus um einen Schritt versetzt liegt.
  versetzt: (n, a) => { const p = gPunkt(a.gitter, n.punkt); return p && a.loesung?.length === 1 && pGleich(a.loesung[0], [p[0] + n.schritt[0], p[1] + n.schritt[1]]) ? null : 'Lösung ist nicht der versetzte Punkt'; },
  // Gitterzeichnen: Die benannten Punkte haben immer denselben Schritt; einzutragen sind die nächsten `anzahl` Punkte.
  muster: (n, a) => {
    const p = n.punkte.map((x) => gPunkt(a.gitter, x));
    if (p.some((x) => !x) || p.length < 3) return 'Punkte fehlen im Bild';
    const d = V(p[0], p[1]);
    if (p.slice(1).some((x, i) => !pGleich(V(p[i], x), d))) return 'die Punkte haben keinen festen Schritt';
    const soll = Array.from({ length: n.anzahl }, (_, i) => [p.at(-1)[0] + (i + 1) * d[0], p.at(-1)[1] + (i + 1) * d[1]]);
    return mengeGleich(soll, a.loesung) ? null : 'Lösung setzt das Muster nicht fort';
  },
  // Gitterzeichnen: Der Punkt `mitte` ist die Mitte zwischen `von` und dem gesuchten Punkt.
  mitteUmkehr: (n, a) => { const p = gPunkt(a.gitter, n.von), m_ = gPunkt(a.gitter, n.mitte); return p && m_ && a.loesung?.length === 1 && pGleich(a.loesung[0], spiegleAnPunkt(p, m_)) ? null : 'Lösung ist nicht der zweite Endpunkt'; },
  // Gitterzeichnen: Rechteck mit Seiten entlang der Achsen aus zwei gegenüberliegenden Ecken.
  achsenRechteck: (n, a) => { const p = gPunkt(a.gitter, n.a), q = gPunkt(a.gitter, n.c); return p && q && p[0] !== q[0] && p[1] !== q[1] && mengeGleich(a.loesung, [[q[0], p[1]], [p[0], q[1]]]) ? null : 'Lösung sind nicht die beiden fehlenden Ecken'; },
  // Gitterzeichnen: alle Gitterpunkte mit einer festen Koordinate, die andere liegt zwischen `von` und `bis` (beide eingeschlossen).
  bereich: (n, a) => { const soll = []; for (let k = n.von; k <= n.bis; k++) soll.push(n.fest === 'x' ? [n.wert, k] : [k, n.wert]); return n.bis > n.von && mengeGleich(soll, a.loesung) ? null : 'Lösung ist nicht genau die Menge der Punkte'; },
  // Gitterzeichnen: Die Punkte aus dem Text sind einzutragen.
  eintragen: (n, a) => {
    if (a.format !== 'gitter' || a.eingabe !== 'punkte') return 'braucht Gitterzeichnen mit Punkten';
    if (!a.gitter?.achsen) return 'kein Koordinatensystem';
    const imText = koordIn(a.text);
    for (const p of n.punkte) if (!imText.some((q) => pGleich(p, q))) return `(${p[0]}|${p[1]}) steht nicht im Text`;
    return mengeGleich(n.punkte, a.loesung) ? null : 'Lösung ist nicht genau die Menge der Punkte aus dem Text';
  },
  // Spiegeln an der Achse oder am Zentrum. von: Urbilder (Punkte oder Ecken im Bild). Bei Kästchen wird die gefärbte Figur gespiegelt.
  spiegeln: (n, a) => {
    const g = gitterVon(a), achse = gAchse(g);
    if (n.an === 'achse' ? !achse : !g?.zentrum) return 'Achse oder Zentrum fehlt im Bild';
    const f = (p) => (n.an === 'achse' ? spiegleAnLinie(p, achse) : spiegleAnPunkt(p, g.zentrum));
    if (a.eingabe === 'zellen') {
      const mitten = g.zellen.map(([x, y]) => [x + 0.5, y + 0.5]), bilder = mitten.map(f).filter((p) => !mitten.some((q) => pGleich(p, q))).map(([x, y]) => [x - 0.5, y - 0.5]);
      if (bilder.some((p) => !ganz(p[0], 0, g.b - 1) || !ganz(p[1], 0, g.h - 1))) return 'ein Bildkästchen liegt außerhalb';
      return mengeGleich(bilder, a.loesung) ? null : 'Lösung ist nicht das Spiegelbild der gefärbten Kästchen';
    }
    const vorhanden = [...(g.punkte ?? []).map((p) => [p.x, p.y]), ...(g.figuren ?? []).flatMap((x) => x.ecken), ...(g.linien ?? []).filter((l) => l.stil !== 'achse').flatMap((l) => [l.a, l.b])];
    for (const p of n.von) if (!vorhanden.some((q) => pGleich(p, q))) return `Urbild (${p}) steht nicht im Bild`;
    const bilder = n.von.map(f);
    if (bilder.some((p) => !imGitter(g, p))) return 'ein Bildpunkt liegt nicht auf einem Gitterpunkt';
    if (n.bild) {
      if (n.von.length !== 1 || !pGleich(bilder[0], n.bild)) return `Bildpunkt ist (${bilder[0]}), nicht (${n.bild})`;
      if (n.luecken) { const [lx, ly] = n.luecken.map((k) => a.luecken?.[k]?.loesung); if (lx !== n.bild[0] || ly !== n.bild[1]) return 'Lücken passen nicht zum Bildpunkt'; }
      if (a.format === 'auswahl' && a.optionen.every((o) => koordIn(o.text).length === 1)) return stufeEin(a, (t) => pGleich(koordIn(t)[0], n.bild));
      if (a.format === 'auswahl' && a.optionen.every((o) => gPunkt(g, o.text.replace(/^Punkt /, '')))) return stufeEin(a, (t) => pGleich(gPunkt(g, t.replace(/^Punkt /, '')), n.bild));
      return null;
    }
    if (a.format !== 'gitter') return 'braucht Gitterzeichnen oder einen Bildpunkt';
    // Punkte auf der Achse bleiben liegen und werden nicht noch einmal gesetzt.
    const neu = bilder.filter((p, i) => !pGleich(p, n.von[i]));
    return mengeGleich(neu, a.loesung) ? null : 'Lösung ist nicht die Menge der Bildpunkte';
  },
  // Ein Viereck (oder Vieleck) ergänzen: Die Ecken in ihrer Reihenfolge, genau ein Punkt fehlt, und nur ein Gitterpunkt ergibt die verlangte Figur.
  ergaenzen: (n, a) => {
    const g = a.gitter;
    if (a.format !== 'gitter' || a.eingabe !== 'punkte' || a.loesung.length !== 1) return 'braucht Gitterzeichnen mit genau einem Punkt';
    const gegeben = (g.punkte ?? []).map((p) => [p.x, p.y]), i = n.ecken.findIndex((e) => pGleich(e, a.loesung[0]));
    if (i < 0 || n.ecken.length !== 4) return 'der gesuchte Punkt ist keine Ecke';
    for (const [k, e] of n.ecken.entries()) if (k !== i && !gegeben.some((q) => pGleich(q, e))) return `Ecke (${e}) steht nicht im Bild`;
    const passt = (p) => { const v = viereckVon(n.ecken.map((e, k) => (k === i ? p : e))); return v.ok && (n.genau ? v.genau === n.typ : v.typen.has(n.typ)); };
    if (!passt(a.loesung[0])) return `mit der Lösung entsteht kein ${n.typ}`;
    let andere = 0;
    for (let x = 0; x <= g.b; x++) for (let y = 0; y <= g.h; y++) if (!pGleich([x, y], a.loesung[0]) && !gegeben.some((q) => pGleich(q, [x, y])) && passt([x, y])) andere++;
    return andere ? `${andere} weitere Gitterpunkte ergeben auch ein ${n.typ}` : null;
  },
  // Der Punkt einer Linie, der einem Punkt am nächsten liegt (Fußpunkt des Lots), oder die Mitte zwischen zwei Punkten.
  lotfuss: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.punkt), l = n.punkte ? { a: gPunkt(g, n.punkte[0]), b: gPunkt(g, n.punkte[1]) } : gLinie(g, n.linie);
    if (!p || !l?.a || !l?.b) return 'Punkt oder Linie fehlt im Bild';
    const f = lotfuss(p, l);
    if (!imGitter(g, f)) return 'der Fußpunkt ist kein Gitterpunkt';
    if (a.format === 'gitter') return mengeGleich([f], a.loesung) ? null : `der Fußpunkt ist (${f})`;
    if (a.format === 'auswahl') return stufeEin(a, (t) => { const q = gPunkt(g, t.replace(/^(Punkt |Strecke [A-Z])/, '').slice(-1)); return q ? pGleich(q, f) : undefined; });
    return null;
  },
  mitte: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.von), q = gPunkt(g, n.nach);
    if (!p || !q) return 'Punkt fehlt im Bild';
    const m_ = schwerpunkt([p, q]);
    if (a.format === 'gitter') return mengeGleich([m_], a.loesung) ? null : `die Mitte ist (${m_})`;
    if (n.x != null && (n.x !== m_[0] || n.y !== m_[1])) return `die Mitte ist (${m_}), nicht (${n.x}|${n.y})`;
    if (n.luecken) { const [lx, ly] = n.luecken.map((k) => a.luecken?.[k]?.loesung); if (lx !== m_[0] || ly !== m_[1]) return 'Lücken passen nicht zur Mitte'; }
    return null;
  },
  // Gitterzeichnen einer Linie: Das Beispiel erfüllt die Bedingung, die typischen Fehler erfüllen sie nicht, und alles Genannte steht im Bild.
  linie: (n, a) => {
    if (a.format !== 'gitter' || a.eingabe !== 'linie') return 'braucht Gitterzeichnen mit einer Linie';
    const g = a.gitter, bed = a.bedingung, punkte = (g.punkte ?? []).map((p) => [p.x, p.y]), text = sichtbareTexte(a).join(' ');
    const imBild = (p) => punkte.some((q) => pGleich(p, q)) || koordIn(text).some((q) => pGleich(p, q)) || (/Mitte|Mittelpunkt/.test(text) && punkte.some((q, i) => punkte.slice(i + 1).some((r) => pGleich(schwerpunkt([q, r]), p))));
    const linieImBild = ([p, q]) => (g.linien ?? []).some((l) => aufLinie(p, l.a, l.b) && aufLinie(q, l.a, l.b)) || (imBild(p) && imBild(q)) || (g.figuren ?? []).some((f) => f.ecken.some((e, i) => mengeGleich([e, f.ecken[(i + 1) % f.ecken.length]], [p, q])));
    if (!linieErfuellt(bed, ...a.beispiel)) return 'das Beispiel erfüllt die Bedingung nicht';
    if (bed.zu && !linieImBild(bed.zu)) return 'die Bezugslinie steht nicht im Bild';
    if (bed.auf && !linieImBild(bed.auf)) return 'die Linie, auf der gezeichnet wird, steht nicht im Bild';
    for (const k of ['durch', 'von']) if (bed[k] && !imBild(bed[k])) return `der Punkt (${bed[k]}) steht nicht im Bild`;
    if (bed.art === 'strecke' && !(imBild(bed.a) && imBild(bed.b))) return 'die Endpunkte stehen nicht im Bild oder im Text';
    if (LAGEWORT[bed.art] && !LAGEWORT[bed.art].test(text)) return `der Text verlangt keine Linie, die ${bed.art} ist`;
    for (const k of ['abstand', 'laenge']) if (bed[k] != null && ![bed[k], bed[k] * 5, bed[k] / 2].some((z) => zahlenIn(text).includes(z)) && !(a.nachweis ?? []).some((z) => typeof z === 'string' && z.endsWith(`= ${bed[k]}`))) return `${k === 'abstand' ? 'der Abstand' : 'die Länge'} ${bed[k]} Kästchen steht nicht im Text`;
    for (const f of a.typischeFehler ?? []) if (f.beispiel && (!linieErfuellt(f.bedingung, ...f.beispiel) || linieErfuellt(bed, ...f.beispiel))) return 'ein typischer Fehler passt nicht zu seinem Beispiel oder ist selbst richtig';
    return null;
  },
  // Die Symmetrieachse(n) einer Figur zeichnen: Die Bedingung nennt genau alle Achsen der Figur.
  achseZeichnen: (n, a) => {
    const figur = figurVon(a.gitter, n.figur);
    if (!figur || a.eingabe !== 'linie') return 'Figur fehlt oder keine Linie verlangt';
    const achsen = achsenVon(figur), genannt = a.bedingung.art === 'eine' ? a.bedingung.linien : a.bedingung.art === 'gerade' ? [[a.bedingung.a, a.bedingung.b]] : [];
    if (!achsen.length || achsen.length !== genannt.length) return `die Figur hat ${achsen.length} Achsen, genannt sind ${genannt.length}`;
    for (const [p, q] of genannt) if (!achsen.some((l) => aufLinie(p, l.a, l.b) && aufLinie(q, l.a, l.b))) return 'eine genannte Linie ist keine Symmetrieachse';
    return linieErfuellt(a.bedingung, ...a.beispiel) ? null : 'das Beispiel ist keine Achse';
  },
  // Länge einer Strecke zwischen zwei benannten Punkten, Abstand eines Punktes von einer Linie, Abstand zweier Parallelen.
  strecke: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.von), q = gPunkt(g, n.nach);
    if (!p || !q) return 'Punkt fehlt im Bild';
    const w = inEinheit(ganzeWurzel(sp(V(p, q), V(p, q))), n.einheit);
    return w === n.wert ? null : `die Strecke ist ${w ?? 'nicht ganzzahlig'}, nicht ${n.wert}`;
  },
  // Antworten nennen Strecken („Strecke AB“). Richtig ist die längste oder die kürzeste.
  streckenwahl: (n, a) => {
    const g = gitterVon(a), lang = (t) => { const m_ = t.match(/^Strecke ([A-Z])([A-Z])$/), p = m_ && gPunkt(g, m_[1]), q = m_ && gPunkt(g, m_[2]); return p && q ? sp(V(p, q), V(p, q)) : null; };
    const alle = a.optionen.map((o) => lang(o.text));
    if (alle.some((x) => x == null)) return 'eine Antwort ist keine Strecke im Bild';
    const ziel = n.was === 'laengste' ? Math.max(...alle) : Math.min(...alle);
    if (alle.filter((x) => x === ziel).length !== 1) return 'nicht eindeutig';
    return stufeEin(a, (t) => lang(t) === ziel);
  },
  abstand: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.punkt), l = gLinie(g, n.linie);
    if (!p || !l) return 'Punkt oder Linie fehlt im Bild';
    const f = lotfuss(p, l), q = sp(V(p, f), V(p, f)), w = inEinheit(Math.abs(q - Math.round(q)) < 1e-9 ? ganzeWurzel(Math.round(q)) : null, n.einheit);
    return w === n.wert ? null : `der Abstand ist ${w ?? 'nicht ganzzahlig'}, nicht ${n.wert}`;
  },
  abstandLinien: (n, a) => {
    const g = gitterVon(a), [l1, l2] = n.linien.map((x) => gLinie(g, x));
    if (!l1 || !l2 || lageZweier(l1, l2) !== 'parallel') return 'die Linien fehlen oder sind nicht parallel';
    const f = lotfuss(l1.a, l2), q = sp(V(l1.a, f), V(l1.a, f)), w = inEinheit(Math.abs(q - Math.round(q)) < 1e-9 ? ganzeWurzel(Math.round(q)) : null, n.einheit);
    return w === n.wert ? null : `der Abstand ist ${w ?? 'nicht ganzzahlig'}, nicht ${n.wert}`;
  },
  // Gitterzeichnen: alle Gitterpunkte, die von jeder genannten Linie den genannten Abstand (in Kästchen) haben.
  abstandspunkte: (n, a) => {
    const g = a.gitter, soll = [];
    for (let x = 0; x <= g.b; x++) for (let y = 0; y <= g.h; y++) if (n.bedingungen.every(([name, d]) => { const l = gLinie(g, name); if (!l) return false; const f = lotfuss([x, y], l); return Math.abs(sp(V([x, y], f), V([x, y], f)) - d * d) < 1e-9; })) soll.push([x, y]);
    return soll.length && mengeGleich(soll, a.loesung) ? null : `Lösung ist nicht genau die Menge der ${soll.length} Punkte`;
  },
  // Abstand eines Punktes von den Achsen: von der x-Achse so weit wie seine y-Koordinate und umgekehrt.
  achsenabstand: (n, a) => { const p = gPunkt(gitterVon(a), n.punkt) ?? koordIn(a.text)[0]; return p && p[1] === n.xAchse && p[0] === n.yAchse ? null : 'Abstände passen nicht zu den Koordinaten'; },
  // So viele Gitterpunkte des Bildes haben von einem Punkt genau diese Entfernung (in Kästchen).
  entfernungspunkte: (n, a) => {
    const g = gitterVon(a), p = gPunkt(g, n.punkt); let k = 0;
    if (!p) return 'Punkt fehlt im Bild';
    for (let x = 0; x <= g.b; x++) for (let y = 0; y <= g.h; y++) if (sp(V(p, [x, y]), V(p, [x, y])) === n.wert ** 2) k++;
    return k === n.anzahl ? null : `es sind ${k} Gitterpunkte, nicht ${n.anzahl}`;
  },
  // Lineal: Die Strecke ist so lang wie der Unterschied der beiden abgelesenen Stellen.
  messen: (n, a) => {
    const b = a.bild;
    if (b?.art !== 'lineal') return 'kein Lineal';
    if (b.bis - b.von !== n.wert) return `die Strecke ist ${b.bis - b.von} mm lang, nicht ${n.wert}`;
    if (n.cm != null && (n.cm * 10 + (n.mm ?? 0) !== n.wert || (n.mm ?? 0) > 9)) return 'cm und mm passen nicht zur Länge';
    return null;
  },
  // Rechtwinkliges Dreieck im Heft: Aus zwei Strecken im rechten Winkel ergibt sich die dritte.
  dreieck: (n) => (n.a * n.a + n.b * n.b === n.c * n.c && n.a > 0 && n.b > 0 ? null : `${n.a}, ${n.b} und ${n.c} bilden kein rechtwinkliges Dreieck`),
  // So viele Symmetrieachsen hat die Figur. Ist die Figur punktsymmetrisch? Ist eine benannte Linie eine Symmetrieachse?
  achsen: (n, a) => {
    const figur = figurVon(gitterVon(a), n.figur);
    if (!figur) return 'Figur fehlt im Bild';
    const k = achsenVon(figur).length;
    return k === n.wert ? null : `die Figur hat ${k} Symmetrieachsen, nicht ${n.wert}`;
  },
  punktsymmetrie: (n, a) => {
    const figur = figurVon(gitterVon(a), n.figur);
    if (!figur) return 'Figur fehlt im Bild';
    return punktsymmetrisch(figur) === n.wert ? null : `die Figur ist ${n.wert ? 'nicht ' : ''}punktsymmetrisch`;
  },
  istAchse: (n, a) => {
    const g = gitterVon(a), figur = figurVon(g, n.figur), l = gLinie(g, n.linie);
    if (!figur || !l) return 'Figur oder Linie fehlt im Bild';
    return istAchse(figur, l) === n.wert ? null : `${n.linie} ist ${n.wert ? 'keine' : 'eine'} Symmetrieachse`;
  },
  // Gitterzeichnen: ein Punkt, erst an der ersten, dann an der zweiten genannten Linie gespiegelt.
  doppelspiegelung: (n, a) => {
    const g = a.gitter, p = gPunkt(g, n.punkt), [l1, l2] = n.linien.map((x) => gLinie(g, x));
    if (!p || !l1 || !l2) return 'Punkt oder Linie fehlt im Bild';
    return a.loesung?.length === 1 && pGleich(a.loesung[0], spiegleAnLinie(spiegleAnLinie(p, l1), l2)) ? null : 'Lösung ist nicht der doppelt gespiegelte Punkt';
  },
  // Gitterzeichnen einer Linie: die Symmetrieachse zu zwei Punkten (jeder Punkt der Linie ist von beiden gleich weit entfernt).
  mittelsenkrechte: (n, a) => {
    const g = a.gitter, p = gPunkt(g, n.von), q = gPunkt(g, n.nach), bed = a.bedingung;
    if (!p || !q || bed?.art !== 'gerade') return 'Punkte fehlen oder keine Gerade verlangt';
    const gleichWeit = (x) => sp(V(x, p), V(x, p)) === sp(V(x, q), V(x, q));
    return gleichWeit(bed.a) && gleichWeit(bed.b) && !pGleich(bed.a, bed.b) && linieErfuellt(bed, ...a.beispiel) ? null : 'die Linie ist nicht die Symmetrieachse der beiden Punkte';
  },
  // Gitterzeichnen: das Symmetriezentrum einer punktsymmetrischen Figur.
  zentrum: (n, a) => {
    const figur = figurVon(a.gitter, n.figur);
    if (!figur || !punktsymmetrisch(figur)) return 'Figur fehlt oder ist nicht punktsymmetrisch';
    return a.loesung?.length === 1 && pGleich(a.loesung[0], mittePunkte(figur)) ? null : 'Lösung ist nicht das Symmetriezentrum';
  },
  // Antworten nennen Linien. Richtig ist jede, die Symmetrieachse der Figur ist.
  achsenwahl: (n, a) => {
    const g = gitterVon(a), figur = figurVon(g, n.figur);
    if (!figur) return 'Figur fehlt im Bild';
    return stufeEin(a, (t) => { if (/^Kein/.test(t)) return !(g.linien ?? []).some((l) => l.n && istAchse(figur, l)); const l = gLinie(g, t.replace(/^(Gerade|Linie) /, '')); return l ? istAchse(figur, l) : undefined; });
  },
  // Antworten nennen Figuren („Figur A“). Richtig ist jede, auf die die Eigenschaft zutrifft.
  figurenwahl: (n, a) => {
    const g = gitterVon(a);
    return stufeEin(a, (t) => {
      if (/^Kein/.test(t)) return !(g.figuren ?? []).some((f) => figurHat(f, n.was));
      const f = gFigur(g, t.match(/^Figur ([A-Z])$/)?.[1]);
      return f ? figurHat(f, n.was) : undefined;
    });
  },
  // Ein Viereck im Bild: sein engster Name und seine Eigenschaften. Antworten, die Vierecksnamen sind, werden eingestuft.
  viereck: (n, a) => {
    const g = gitterVon(a), f = n.figur ? gFigur(g, n.figur) : null, e = f?.ecken ?? (n.ecken ?? []).map((x) => gPunkt(g, x));
    if (e.length !== 4 || e.some((x) => !x)) return 'Viereck fehlt im Bild';
    const v = viereckVon(e);
    if (!v.ok) return 'kein gewöhnliches Viereck';
    if (n.typ && v.genau !== n.typ) return `das Viereck ist ein ${v.genau}, kein ${n.typ}`;
    for (const k of ['parallelPaare', 'rechteWinkel', 'achsen', 'gleichlang', 'gegenGleich', 'diagonalenGleich', 'diagonalenSenkrecht', 'diagonalenHalbieren', 'punktsymmetrisch']) if (n[k] != null && v[k] !== n[k]) return `${k} ist ${v[k]}, nicht ${n[k]}`;
    const NAMEN = ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'];
    if (a.format === 'auswahl' && a.optionen.every((o) => NAMEN.includes(o.text))) return stufeEin(a, (t) => (a.mehrfach ? v.typen.has(t) : v.genau === t));
    return null;
  },
};
const GEO_ERGEBNIS = {
  achsenabstand: (n) => [n.xAchse, n.yAchse], entfernungspunkte: (n) => n.anzahl,
  lagezuZahl: (n) => n.wert,
  schritt: (n) => n.v.map(Math.abs),
  linienzahl: (n) => n.wert, verbindungen: (n) => n.wert, schnittpunkt: (n) => [n.x, n.y].filter((x) => x != null), vierteEcke: (n) => [n.x, n.y],
  lagezahl: (n) => n.wert, koordinaten: (n) => [n.x, n.y], spiegeln: (n) => n.bild ?? [], mitte: (n) => [n.x, n.y].filter((x) => x != null), strecke: (n) => n.wert, abstand: (n) => n.wert, abstandLinien: (n) => n.wert,
  messen: (n) => [n.wert, n.cm, n.mm].filter((x) => x != null), dreieck: (n) => n.c, achsen: (n) => n.wert,
  viereck: (n) => ['parallelPaare', 'rechteWinkel', 'achsen'].map((k) => n[k]).filter((x) => typeof x === 'number'),
};

const SONDER = {
  // Kapitel 2: die Ziffer an einer Stelle der Zahl.
  stelle: (n, a) => {
    const i = STELLEN.indexOf(n.stelle);
    if (i < 0) return `unbekannte Stelle ${n.stelle}`;
    if (!gezeigt(a).has(n.zahl)) return `${n.zahl} steht nicht in der Aufgabe`;
    const z = Math.floor(n.zahl / 10 ** i) % 10;
    return z === n.ziffer ? null : `an der Stelle ${n.stelle} von ${n.zahl} steht ${z}, nicht ${n.ziffer}`;
  },
  // Wie viele Stellen oder wie viele Nullen eine Zahl hat.
  ziffernzahl: (n) => {
    const t = String(n.zahl), ist = n.was === 'nullen' ? [...t].filter((c) => c === '0').length : t.length;
    return ist === n.anzahl ? null : `${n.zahl} hat ${ist} ${n.was === 'nullen' ? 'Nullen' : 'Stellen'}, nicht ${n.anzahl}`;
  },
  // Zahlwort und Zahl gehören zusammen. Bei einer Auswahl ist genau die Antwort richtig, die dieselbe Zahl nennt.
  zahlwort: (n, a) => {
    const w = zahlAusWort(n.wort);
    if (w !== n.zahl) return `„${n.wort}“ ist ${w ?? 'kein Zahlwort'}, nicht ${n.zahl}`;
    const texte = sichtbareTexte(a).join('\n');
    if (!texte.includes(n.wort) && !texte.toLowerCase().includes(n.wort.toLowerCase())) return `„${n.wort}“ steht nicht in der Aufgabe`;
    if (a.format === 'auswahl') return stufeEin(a, (t) => { const x = /^\d[\d ]*$/.test(t) ? zahlAus(t) : zahlAusWort(t.charAt(0).toLowerCase() + t.slice(1)) ?? zahlAusWort(t); return x == null ? undefined : x === n.zahl; });
    if (a.format === 'zuordnen' && !a.paare.some((p) => [p.links, p.rechts].some((x) => x.toLowerCase() === n.wort.toLowerCase()) && [p.links, p.rechts].some((x) => /^\d[\d ]*$/.test(x) && zahlAus(x) === n.zahl))) return `kein Paar verbindet „${n.wort}“ mit ${n.zahl}`;
    return null;
  },
  // Zwei Zahlen vergleichen. Die Antworten einer Auswahl sind die Zeichen <, > und =.
  vergleich: (n, a) => {
    const [l, r] = [wertIn(n.links, n.system), wertIn(n.rechts, n.system)];
    if (l == null || r == null) return 'Zahlen lassen sich nicht lesen';
    const zeichen = l < r ? '<' : l > r ? '>' : '=';
    if (zeichen !== n.zeichen) return `${n.links} ${zeichen} ${n.rechts}, nicht ${n.zeichen}`;
    const texte = sichtbareTexte(a).join('\n') + JSON.stringify(a.bild ?? '');
    for (const x of [n.links, n.rechts]) if (!norm(texte).includes(norm(x)) && !bildZahlen(a.bild).includes(wertIn(x, n.system))) return `${x} steht nicht in der Aufgabe`;
    if (a.format === 'auswahl' && a.optionen.every((o) => ['<', '>', '='].includes(o.text))) return stufeEin(a, (t) => t === zeichen);
    return null;
  },
  // Antworten der Form „412 < 421 < 430“: Richtig ist genau die Kette, in der jeder Vergleich stimmt.
  ketten: (n, a) => stufeEin(a, (t) => {
    const teile = t.split(/ ([<>]) /);
    if (teile.length < 3) return undefined;
    for (let i = 1; i < teile.length; i += 2) {
      const [l, r] = [wertIn(teile[i - 1], n.system), wertIn(teile[i + 1], n.system)];
      if (l == null || r == null) return undefined;
      if (teile[i] === '<' ? !(l < r) : !(l > r)) return false;
    }
    return true;
  }),
  // Ordnen: Die Lösung ist die Reihenfolge vom kleinsten zum größten Wert (oder umgekehrt), so wie der Text es verlangt.
  ordnung: (n, a) => {
    if (a.format !== 'ordnen') return 'braucht das Format ordnen';
    const werte = a.loesung.map((k) => wertIn(k, n.system));
    if (werte.some((w) => w == null)) return 'eine Karte lässt sich nicht lesen';
    for (let i = 1; i < werte.length; i++) if (n.richtung === 'auf' ? !(werte[i - 1] < werte[i]) : !(werte[i - 1] > werte[i])) return `Reihenfolge stimmt nicht bei ${a.loesung[i - 1]} und ${a.loesung[i]}`;
    const verlangt = /kleinsten/.test(a.text) ? 'auf' : /größten/.test(a.text) ? 'ab' : null;
    return verlangt === n.richtung ? null : 'der Text verlangt eine andere Richtung (Beginne mit der kleinsten oder der größten Zahl)';
  },
  // Die größte oder kleinste von mehreren Zahlen. Die Zahlen sind die Antworten oder stehen im Text.
  extremwert: (n, a) => {
    const zahlen = n.zahlen ?? (a.optionen ?? []).map((o) => wertIn(o.text, n.system));
    if (zahlen.length < 2 || zahlen.some((x) => x == null)) return 'Zahlen lassen sich nicht lesen';
    if (n.zahlen) { const da = gezeigt(a); for (const x of n.zahlen) if (!da.has(x)) return `${x} steht nicht in der Aufgabe`; }
    const ziel = n.was === 'groesste' ? Math.max(...zahlen) : Math.min(...zahlen);
    if (zahlen.filter((x) => x === ziel).length !== 1) return 'der Wert kommt doppelt vor';
    if (ziel !== n.wert) return `${n.was === 'groesste' ? 'größte' : 'kleinste'} Zahl ist ${ziel}, nicht ${n.wert}`;
    if (a.format === 'auswahl' && n.system) return stufeEin(a, (t) => wertIn(t, n.system) === ziel);
    return null;
  },
  // Zahlenstrahl: Der Pfeil zeigt auf den Wert (ablesen), oder der Wert aus dem Text liegt auf einem Teilstrich (markieren).
  strahl: (n, a) => {
    const st = strahlVon(a);
    if (!st) return 'kein Zahlenstrahl';
    if (n.wert < st.von || n.wert > st.bis || (n.wert - st.von) % st.schritt !== 0) return `${n.wert} liegt nicht auf einem Teilstrich`;
    if (a.format === 'zahlenstrahl' && a.eingabe === 'markieren') return sichtbareTexte(a).flatMap(zahlenIn).includes(n.wert) || n.wort ? null : `${n.wert} steht nicht im Text`;
    return st.pfeil === n.wert ? null : `der Pfeil zeigt auf ${st.pfeil}, nicht auf ${n.wert}`;
  },
  // So groß ist der Schritt von Teilstrich zu Teilstrich.
  schrittweite: (n, a) => (strahlVon(a)?.schritt === n.wert ? null : `der Schritt ist ${strahlVon(a)?.schritt}, nicht ${n.wert}`),
  // Runden auf eine Stelle. Nennt der Text die Stelle nicht mit Namen, steht `frei: true` dabei (sinnvolles Runden).
  runden: (n, a) => {
    if (!istStufe(n.auf) || n.auf < 10) return `${n.auf} ist keine Rundungsstelle`;
    const w = gerundet(n.zahl, n.auf);
    if (w !== n.wert) return `${n.zahl} auf ${n.auf} gerundet ist ${w}, nicht ${n.wert}`;
    if (!gezeigt(a).has(n.zahl)) return `${n.zahl} steht nicht in der Aufgabe`;
    const texte = [...sichtbareTexte(a), ...(a.tabelle?.kopf ?? [])].join(' ');
    if (!n.frei && STELLENWORT[n.auf] && !new RegExp(`(?<![A-Za-zäöü])${STELLENWORT[n.auf]}`).test(texte)) return `der Text nennt die Stelle ${STELLENWORT[n.auf]} nicht`;
    return null;
  },
  // Die kleinste und die größte Zahl, die gerundet den Wert ergibt.
  rundungsgrenze: (n, a) => {
    if (!istStufe(n.auf) || n.wert % n.auf !== 0) return 'Wert passt nicht zur Rundungsstelle';
    let k = n.wert, g = n.wert;
    while (k > 0 && gerundet(k - 1, n.auf) === n.wert) k--;
    while (gerundet(g + 1, n.auf) === n.wert) g++;
    if (n.kleinste != null && n.kleinste !== k) return `kleinste Zahl ist ${k}, nicht ${n.kleinste}`;
    if (n.groesste != null && n.groesste !== g) return `größte Zahl ist ${g}, nicht ${n.groesste}`;
    return gezeigt(a).has(n.wert) ? null : `${n.wert} steht nicht in der Aufgabe`;
  },
  // Jede Antwort ist eine Zahl. Richtig ist sie genau dann, wenn sie gerundet den Wert ergibt.
  rundenwahl: (n, a) => (istStufe(n.auf) ? stufeEin(a, (t) => { const x = wertIn(t); return x == null ? undefined : gerundet(x, n.auf) === n.wert; }) : 'keine Rundungsstelle'),
  // Auf welche Stelle wurde gerundet? Genau eine der genannten Stellen passt.
  rundungsstelle: (n, a) => {
    if (gerundet(n.zahl, n.auf) !== n.wert) return `${n.zahl} auf ${n.auf} gerundet ist nicht ${n.wert}`;
    const da = gezeigt(a);
    if (!da.has(n.zahl) || !da.has(n.wert)) return 'Zahlen stehen nicht in der Aufgabe';
    return stufeEin(a, (t) => { const auf = Object.keys(STELLENWORT).find((k) => t.startsWith(STELLENWORT[k])); return auf == null ? undefined : gerundet(n.zahl, Number(auf)) === n.wert; });
  },
  // Zweiersystem: Zeichenfolge und Wert gehören zusammen.
  dual: (n, a) => {
    const w = dualZuZahl(n.dual);
    if (w !== n.wert) return `${n.dual} im Zweiersystem ist ${w}, nicht ${n.wert}`;
    if (a.format === 'zeichen' && !n.nurWert && a.loesung !== n.dual) return 'Lösung ist nicht diese Zeichenfolge';
    if (a.format === 'auswahl' && !n.nurWert) return stufeEin(a, (t) => { const x = /₂$/.test(t) ? wertIn(t, 'dual') : wertIn(t); return x == null ? undefined : x === w; });
    return null;
  },
  // Römische Zahlzeichen: Zeichenfolge und Wert gehören zusammen, und die Schreibweise ist die gültige.
  roemisch: (n, a) => {
    if (zahlZuRoemisch(n.wert) !== n.zeichen) return `${n.wert} schreibt man ${zahlZuRoemisch(n.wert)}, nicht ${n.zeichen}`;
    if (a.format === 'zeichen' && !n.nurWert && a.loesung !== n.zeichen) return 'Lösung ist nicht diese Zeichenfolge';
    if (a.format !== 'zeichen' && !sichtbareTexte(a).join(' ').includes(n.zeichen) && !sichtbareTexte(a).flatMap(zahlenIn).includes(n.wert)) return `${n.zeichen} steht nicht in der Aufgabe`;
    if (a.format === 'auswahl' && !n.nurWert) return stufeEin(a, (t) => { const x = /^[IVXLCDM]+$/.test(t) ? (roemischGueltig(t) ? roemischZuZahl(t) : -1) : wertIn(t); return x == null ? undefined : x === n.wert; });
    return null;
  },
  // Jede Antwort ist eine Zeichenfolge. Richtig sind genau die gültig geschriebenen (oder mit `falsche: true` die ungültigen).
  roemischGueltig: (n, a) => stufeEin(a, (t) => (/^[IVXLCDM]+$/.test(t) ? roemischGueltig(t) !== Boolean(n.falsche) : undefined)),
  // Stellenwerttafel: Die Ziffern der Zeile (vorgegeben oder einzutragen) ergeben die Zahl. Bild oder Tabelle zum Eintragen.
  tafel: (n, a) => {
    const basis = n.basis ?? 10;
    const lies = (ziffern) => ziffern.reduce((w, z) => w * basis + (z ?? 0), 0);
    if (a.tabelle?.art === 'stellentafel') {
      const zeile = a.tabelle.zeilen[n.zeile ?? 0];
      const ziffern = zeile.map((c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c === '' ? null : Number(c)));
      if (ziffern.some((z) => z != null && (!Number.isInteger(z) || z < 0 || z >= basis))) return 'Feld mit mehr als einer Ziffer';
      if (lies(ziffern) !== n.zahl) return `die Tafel zeigt ${lies(ziffern)}, nicht ${n.zahl}`;
      // Führende Stellen bleiben leer, innere Nullen stehen da.
      const erste = ziffern.findIndex((z) => z != null);
      if (ziffern.slice(erste).some((z) => z == null) || (ziffern[erste] === 0 && ziffern.length - erste > 1 && basis === 10)) return 'leeres Feld mitten in der Zahl oder führende Null';
      if (!gleich(n.ziffern, ziffern.filter((z) => z != null))) return 'Ziffern im Nachweis passen nicht zur Tafel';
      return null;
    }
    if (a.bild?.art !== 'tafel') return 'keine Stellenwerttafel';
    const wert = lies(a.bild.werte.map(wertVon));
    return wert === n.zahl ? null : `die Tafel zeigt ${wert}, nicht ${n.zahl}`;
  },
  // Schätzbild: Anzahl im markierten Feld, Zahl der Felder, alle zusammen, das vollste oder leerste Feld.
  bildwert: (n, a) => {
    const b = a.bild;
    if (b?.art !== 'schaetzbild') return 'kein Schätzbild';
    const alle = b.felder.flat();
    const ist = { feld: b.markiert ? b.felder[b.markiert[0]]?.[b.markiert[1]] : undefined, felder: alle.length, gesamt: schaetzSumme(b), groesstes: Math.max(...alle), kleinstes: Math.min(...alle),
      grobfelder: b.grob ? b.grob[0] * b.grob[1] : undefined }[n.was];
    return ist === n.wert ? null : `${n.was} ist ${ist}, nicht ${n.wert}`;
  },
  // Jede Antwort ist eine Zahl. Richtig ist genau die, die am nächsten am Ziel liegt (ohne Ziel: an der wahren Anzahl im Schätzbild).
  naechste: (n, a) => {
    const ziel = n.ziel ?? (a.bild?.art === 'schaetzbild' ? schaetzSumme(a.bild) : null);
    if (ziel == null) return 'kein Ziel';
    if (n.ziel != null && !gezeigt(a).has(n.ziel) && !n.frei) return `${n.ziel} steht nicht in der Aufgabe`;
    const abstand = (t) => { const x = wertIn(t.replace(/^(etwa|rund|ungefähr) /, '')); return x == null ? null : Math.abs(x - ziel); };
    const alle = (a.optionen ?? []).map((o) => abstand(o.text));
    if (alle.some((x) => x == null)) return 'eine Antwort ist keine Zahl';
    const klein = Math.min(...alle);
    if (alle.filter((x) => x === klein).length !== 1) return 'zwei Antworten liegen gleich nah';
    return stufeEin(a, (t) => abstand(t) === klein);
  },
  // Kapitel 1: Ein Wert wird aus dem Bild, der Liste, der Tabelle oder dem Diagramm abgelesen.
  ablesen: (n, a) => {
    const m = datenVon(a, n.quelle, n.spalte);
    if (!m) return `keine Daten (${n.quelle ?? 'Bild'})`;
    if (!m.has(n.name)) return `${n.name} steht nicht in den Daten`;
    return m.get(n.name) === n.wert ? null : `bei ${n.name} steht ${m.get(n.name)}, nicht ${n.wert}`;
  },
  // Gesucht ist die Zeile mit dem größten, dem kleinsten, einem bestimmten oder dem mittleren Wert, die falsch übertragene oder die falsch gebündelte.
  zeile: (n, a) => {
    if (n.bedingung === 'falschGebuendelt') {
      if (a.bild?.art !== 'strichliste') return 'braucht eine Strichliste';
      const falsch = a.bild.zeilen.filter((z) => !richtigGebuendelt(z)).map((z) => z.name);
      return pruefeNamenwahl(a, new Map(a.bild.zeilen.map((z) => [z.name, strichzahl(z)])), (x) => falsch.includes(x));
    }
    if (n.bedingung === 'abweichend') {
      const ziel = datenVon(a, 'daten'), von = datenVon(a, DATENBILDER.includes(a.bild?.art) ? 'bild' : 'urliste');
      if (!ziel || !von) return 'braucht zwei Datenquellen';
      return pruefeNamenwahl(a, von, (x) => ziel.get(x) !== von.get(x));
    }
    const m = datenVon(a, n.quelle);
    if (!m) return 'keine Daten';
    const alle = [...m.values()], sortiert = [...alle].sort((x, y) => x - y);
    const ziel = { groesste: Math.max(...alle), kleinste: Math.min(...alle), gleich: n.wert, mitte: alle.length % 2 ? sortiert[(alle.length - 1) / 2] : NaN }[n.bedingung];
    if (ziel === undefined) return `unbekannte Bedingung ${n.bedingung}`;
    return pruefeNamenwahl(a, m, (x) => m.get(x) === ziel);
  },
  // Bilddiagramm: So viel ist ein Bild wert.
  schluessel: (n, a) => (a.bild?.art === 'bilddiagramm' && a.bild.je === n.wert ? null : `ein Bild steht nicht für ${n.wert}`),
  // Säulendiagramm: So viel liegt zwischen zwei Linien.
  linienabstand: (n, a) => (a.bild?.art === 'saeulen' && (a.bild.fein ?? a.bild.schritt) === n.wert ? null : `die Linien liegen nicht ${n.wert} auseinander`),
  // Antworten der Form „Rot: 5 · Blau: 3“: Richtig ist genau die Antwort, die alle Werte richtig nennt.
  datenwahl: (n, a) => {
    const m = datenVon(a, n.quelle);
    if (!m) return 'keine Daten';
    for (const o of a.optionen ?? []) {
      const teile = o.text.split(' · ').map((t) => t.match(/^(.+): (\d[\d\u00a0]*)$/));
      if (teile.some((t) => !t)) return `Antwort „${o.text}“ hat nicht die Form Name: Zahl`;
      const passt = teile.length === m.size && teile.every(([, x, z]) => m.get(nameIn(x, [...m.keys()])) === zahlAus(z));
      if (passt !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „Rot, Blau, Gelb“: Richtig ist genau die Reihe vom größten zum kleinsten Wert (oder umgekehrt, wenn der Text es so verlangt).
  rangfolge: (n, a) => {
    const m = datenVon(a, n.quelle);
    if (!m) return 'keine Daten';
    if (new Set(m.values()).size !== m.size) return 'zwei Werte sind gleich';
    const aufsteigend = /vom kleinsten zum größten/i.test(a.text);
    const soll = [...m.keys()].sort((x, y) => (aufsteigend ? m.get(x) - m.get(y) : m.get(y) - m.get(x)));
    for (const o of a.optionen ?? []) {
      const reihe = o.text.split(', ').map((t) => nameIn(t, [...m.keys()]));
      if (reihe.some((x) => !x) || reihe.length !== m.size) return `Antwort „${o.text}“ nennt nicht alle Namen`;
      if (gleich(reihe, soll) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Achseneinteilung zu den Werten der Tabelle: Genau eine Antwort passt.
  einteilung: (n, a) => {
    const m = datenVon(a, a.daten ? 'daten' : undefined);
    if (!m || !gleich([...m.values()], n.werte)) return 'Werte passen nicht zu den Daten';
    for (const o of a.optionen ?? []) {
      const p = einteilungPasst(o.text, n.werte);
      if (p === undefined) return `Antwort „${o.text}“ ist keine Achseneinteilung`;
      if (p !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Was fehlt am Diagramm zur Tabelle? Genau ein Mangel, oder keiner.
  mangel: (n, a) => {
    const b = a.bild, t = datenVon(a, 'daten');
    if (b?.art !== 'saeulen') return 'braucht ein Säulendiagramm';
    const hat = new Set([...(!b.titel || b.ohne?.includes('titel') ? ['titel'] : []), ...(!b.einheit || b.ohne?.includes('einheit') ? ['einheit'] : []),
      ...(t && [...t.keys()].some((x) => !b.saeulen.some((sa) => sa.name === x)) ? ['saeule'] : []), ...(b.ab ? ['achse'] : [])]);
    if (t) for (const sa of b.saeulen) if (t.get(sa.name) !== wertVon(sa.wert)) return `Säule ${sa.name} passt nicht zur Tabelle`;
    if (hat.size > 1) return 'mehr als ein Mangel';
    if (hat.size === 0) hat.add('nichts');
    for (const o of a.optionen ?? []) {
      if (!MAENGEL[o.text]) return `Antwort „${o.text}“ ist kein bekannter Mangel`;
      if (hat.has(MAENGEL[o.text]) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Eine Aussage über die Daten (zu einem Urteil „Stimmt das?“).
  aussage: (n, a) => {
    const m = datenVon(a, n.quelle);
    if (!m) return 'keine Daten';
    const w = aussageWahr(n.typ, n.namen, m, n.wert);
    if (w === undefined) return `Aussage ${n.typ} lässt sich nicht prüfen`;
    if (w !== n.stimmt) return `die Aussage ${n.typ} über ${n.namen.join(', ')} ${w ? 'stimmt' : 'stimmt nicht'}`;
    if (n.typ === 'anzahl' && !zahlenIn(a.text).includes(n.wert)) return `${n.wert} steht nicht im Text`;
    for (const x of n.namen.slice(0, NAMEN_JE_AUSSAGE[n.typ])) if (!a.text.includes(x) && !a.text.includes(TAGNAMEN[x] ?? '\u0000')) return `${x} steht nicht im Text`;
    const u = a.nachweis.find((x) => x?.art === 'urteil');
    if (u && u.stimmt !== n.stimmt) return 'Urteil passt nicht zur Aussage';
    return null;
  },
  // Mehrere Aussagen als Antworten: Richtig sind genau die, die stimmen.
  aussagen: (n, a) => {
    const m = datenVon(a, n.quelle);
    if (!m) return 'keine Daten';
    for (const o of a.optionen ?? []) {
      const x = n.liste.find((y) => y.text === o.text);
      if (!x) return `Antwort „${o.text}“ fehlt in der Liste`;
      const w = aussageWahr(x.typ, x.namen, m, x.wert);
      if (w === undefined) return `Aussage „${o.text}“ lässt sich nicht prüfen`;
      if (w !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
      for (const nm of x.namen) if (!o.text.includes(nm) && !o.text.includes(TAGNAMEN[nm] ?? '\u0000')) return `${nm} steht nicht in „${o.text}“`;
    }
    return null;
  },
  // Ziffernrätsel: Genau eine Belegung der Kästchen macht die Rechnung wahr.
  ziffern: (n, a) => {
    const g = gleichungenIn(n.muster.replace(/▢/g, '0'));
    if (g.length !== 1) return 'Muster ist keine Rechnung';
    const passend = kombinationen((n.muster.match(/▢/g) ?? []).length).filter((k) => { const [l, r] = einsetzen(n.muster, k).split(' = ').map(rechne); return l === r; });
    if (passend.length !== 1 || !gleich(passend[0], n.ziffern)) return `Ziffernrätsel hat die Lösungen ${JSON.stringify(passend)}`;
    if (!norm(a.text.replace(/\{\{\w+\}\}/g, '▢')).includes(norm(n.muster))) return 'Muster steht nicht im Text';
    if (!gleich(Object.values(a.luecken ?? {}).map((l) => l.loesung), n.ziffern)) return 'Lücken passen nicht zu den Ziffern';
    return null;
  },
  extremzahlen: (n) => {
    const alle = permutationen(n.ziffern).filter((p) => p[0] !== 0).map((p) => Number(p.join('')));
    return Math.max(...alle) === n.gross && Math.min(...alle) === n.klein ? null : 'größte oder kleinste Zahl falsch';
  },
  kleinsteDifferenz: (n, a) => {
    const alle = permutationen(n.ziffern).filter((p) => p[0] !== 0 && p[2] !== 0).map((p) => Math.abs(p[0] * 10 + p[1] - p[2] * 10 - p[3]));
    return Math.min(...alle) === n.differenz ? null : `kleinste Differenz ist ${Math.min(...alle)}`;
  },
  zwischen: (n, a) => {
    const w = rechne(n.ausdruck);
    if (Number.isNaN(w) && !/:/.test(n.ausdruck)) return 'Ausdruck lässt sich nicht berechnen';
    const [x, d] = n.ausdruck.split(' : ').map(zahlAus);
    const liegt = Number.isNaN(w) ? x > n.von * d && x < n.bis * d : w > n.von && w < n.bis;
    if (liegt !== n.gilt) return `„${n.ausdruck} liegt zwischen ${n.von} und ${n.bis}“ ist ${liegt ? 'wahr' : 'falsch'}`;
    const o = (a.optionen ?? []).find((x_) => norm(x_.text) === norm(n.ausdruck));
    if (o && o.richtig !== n.gilt) return `Option „${o.text}“ ist falsch eingestuft`;
    return null;
  },
  // Jede Antwort ist eine Gleichung. Richtig ist sie genau dann, wenn beide Seiten gleich sind.
  gleichungen: (n, a) => {
    // Mit falsche: true ist die Antwort richtig, deren Gleichung nicht stimmt („Welche Rechnung ist falsch?“).
    const soll = (o) => (n.falsche ? !o.richtig : o.richtig);
    for (const o of a.optionen ?? []) {
      const seiten = o.text.split(' = ');
      if (seiten.length !== 2 || seiten.some((s) => Number.isNaN(rechne(s)))) {
        const g = gleichungenIn(o.text);
        if (g.length !== 1 || stimmt(g[0]) !== soll(o)) return `Gleichung „${o.text}“ ist falsch eingestuft oder nicht lesbar`;
      } else if ((rechne(seiten[0]) === rechne(seiten[1])) !== soll(o)) return `Gleichung „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Jede Antwort ist ein Rechenausdruck. Richtig ist er genau dann, wenn er den Wert hat.
  wert: (n, a) => {
    for (const o of a.optionen ?? []) {
      const w = rechne(anfang(o.text) ?? '');
      if (Number.isNaN(w)) { if (o.richtig) return `Antwort „${o.text}“ ist kein Rechenausdruck`; continue; }
      if ((w === n.wert) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  anzahlProdukte: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) for (let y = n.von ?? 1; y <= n.bis; y++) if (x * y === n.produkt) k++;
    return k === n.anzahl ? null : `es gibt ${k} Aufgaben mit dem Ergebnis ${n.produkt}`;
  },
  anzahlTeiler: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) if (n.zahl % x === 0) k++;
    return k === n.anzahl ? null : `${n.zahl} hat ${k} Teiler bis ${n.bis}`;
  },
  ziffernTeilbar: (n, a) => {
    const passend = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((z) => Number(n.muster.replace('▢', z)) % n.durch === 0);
    if (!gleich(passend, n.ziffern)) return `passende Ziffern sind ${passend}`;
    if (n.anzahl != null && n.anzahl !== passend.length) return 'Anzahl der Ziffern falsch';
    if (n.anzahl == null && passend.length !== 1) return 'Ziffer ist nicht eindeutig';
    return a.text.includes(n.muster) ? null : 'Muster steht nicht im Text';
  },
  ziffernZahlen: (n) => {
    const k = permutationen(n.ziffern).filter((p) => p[0] !== 0 && Number(p.join('')) % n.durch === 0).length;
    return k === n.anzahl ? null : `${k} Zahlen sind teilbar`;
  },
  // Größtes Vielfaches bis zur Grenze (999) oder kleinstes ab der Grenze (1000).
  grenzVielfaches: (n) => {
    const w = n.grenze % 10 === 9 ? Math.floor(n.grenze / n.durch) * n.durch : Math.ceil(n.grenze / n.durch) * n.durch;
    return w === n.zahl ? null : `gesuchtes Vielfaches ist ${w}`;
  },
  vielfachesZwischen: (n) => {
    const alle = [];
    for (let x = n.von + 1; x < n.bis; x++) if (x % n.durch === 0) alle.push(x);
    return alle.length === 1 && alle[0] === n.zahl ? null : `Vielfache dazwischen: ${alle}`;
  },
  grenzRest: (n) => {
    let x = n.grenze;
    while (x % n.durch !== n.rest) x--;
    return x === n.zahl && n.rest < n.durch ? null : `gesuchte Zahl ist ${x}`;
  },
  anzahlMitRest: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) if (x % n.durch === n.rest) k++;
    return k === n.anzahl && n.rest < n.durch ? null : `es sind ${k} Zahlen`;
  },
  kleinsteMitResten: (n) => {
    if (n.bedingungen.some(([m, r]) => r >= m)) return 'Rest ist nicht kleiner als der Divisor';
    let x = 1;
    while (!n.bedingungen.every(([m, r]) => x % m === r) && x < 100000) x++;
    return x === n.zahl ? null : `kleinste Zahl ist ${x}`;
  },
  teilerZwischen: (n) => {
    const alle = [];
    for (let x = n.von + 1; x < n.bis; x++) if (n.zahl % x === 0) alle.push(x);
    return alle.length === 1 && alle[0] === n.teiler ? null : `Teiler dazwischen: ${alle}`;
  },
  // Genau ein Zahlenpaar von 1 bis 10 hat dieses Produkt und diese Summe.
  zahlenpaar: (n) => {
    const alle = [];
    for (let x = 1; x <= 10; x++) for (let y = x; y <= 10; y++) if (x * y === n.produkt && x + y === n.summe) alle.push([x, y]);
    return alle.length === 1 && gleich(alle[0], n.paar) ? null : `Paare: ${JSON.stringify(alle)}`;
  },
  // Urteil über eine Behauptung: „Stimmt das?“ Mit Rechnung wird nachgerechnet, ob das behauptete Ergebnis stimmt.
  // Die richtige Antwort muss mit dem passenden Wort beginnen (Stimmt, Richtig, Ja oder Falsch, Nein).
  urteil: (n, a) => {
    if (typeof n.stimmt !== 'boolean') return 'stimmt fehlt';
    if (n.rechnung != null) {
      if (n.rest != null) {
        const [x, d] = n.rechnung.split(' : ').map(zahlAus);
        if ((n.behauptet * d + n.rest === x && n.rest < d) !== n.stimmt) return `„${n.rechnung} = ${n.behauptet} Rest ${n.rest}“ ist ${n.stimmt ? 'falsch' : 'richtig'}`;
      } else {
        const w = rechne(n.rechnung);
        if (Number.isNaN(w)) return 'Rechnung lässt sich nicht berechnen';
        if ((w === n.behauptet) !== n.stimmt) return `„${n.rechnung} = ${n.behauptet}“ ist ${w === n.behauptet ? 'richtig' : 'falsch'}`;
      }
      const imText = new Set(zahlenIn(a.text));
      for (const z of [...zahlenIn(n.rechnung), n.behauptet, ...(n.rest != null ? [n.rest] : [])]) if (!imText.has(z)) return `${z} steht nicht im Text`;
    }
    for (const o of a.optionen ?? []) {
      const p = polaritaet(o.text);
      if (o.richtig && p !== null && p !== n.stimmt) return `richtige Antwort „${o.text.slice(0, 30)}“ passt nicht zum Urteil`;
    }
    // Ist die Rechnung falsch, nennt genau die richtige Antwort das richtige Ergebnis.
    if (n.rechnung != null && !n.stimmt) {
      const [x, d] = n.rechnung.split(' : ').map(zahlAus);
      const soll = n.rest != null ? [Math.floor(x / d), x % d] : [rechne(n.rechnung)];
      const nenntEs = (o) => soll.every((z) => zahlenIn(o.text).includes(z));
      // Nennt keine Antwort das genaue Ergebnis (Überschlag), entfällt die Regel.
      if ((a.optionen ?? []).some(nenntEs)) for (const o of a.optionen) {
        const nennt = nenntEs(o);
        if (nennt !== o.richtig) return o.richtig ? `richtige Antwort nennt das richtige Ergebnis ${soll.join(' Rest ')} nicht` : `falsche Antwort „${o.text.slice(0, 30)}“ nennt das richtige Ergebnis`;
      }
    }
    return null;
  },
  // Antworten der Form „7 und 3“: Richtig ist das Paar mit der Zielsumme.
  paarsumme: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(/^(\d+) und (\d+)$/);
      if (!m) return `Antwort „${o.text}“ ist kein Zahlenpaar`;
      if ((Number(m[1]) + Number(m[2]) === n.ziel) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „8 + 2 und 2 + 8“: Richtig ist das Paar mit gleichem Wert.
  gleicheWerte: (n, a) => {
    for (const o of a.optionen ?? []) {
      const [l, r] = o.text.split(' und ').map(rechne);
      if (Number.isNaN(l) || Number.isNaN(r)) return `Antwort „${o.text}“ besteht nicht aus zwei Rechnungen`;
      if ((l === r) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „6956 : 65“: Richtig ist die Aufgabe, deren Quotient über der Grenze liegt.
  quotientUeber: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(new RegExp(`^(${NUM}) : (${NUM})$`));
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((zahlAus(m[1]) > n.grenze * zahlAus(m[2])) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „6111 : 28“: Richtig ist die Aufgabe, deren Zahlen auf die führende Stelle gerundet den Überschlag ergeben.
  ueberschlagVon: (n, a) => {
    const fuehrend = (x) => { const p = 10 ** (String(x).length - 1); return Math.round(x / p) * p; };
    for (const o of a.optionen ?? []) {
      const m = o.text.match(new RegExp(`^(${NUM}) : (${NUM})$`));
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((fuehrend(zahlAus(m[1])) === n.dividend && fuehrend(zahlAus(m[2])) === n.divisor) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „14 : 5“: Richtig ist die Aufgabe, bei der ein Rest bleibt.
  restBleibt: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(/^(\d+) : (\d+)$/);
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((Number(m[1]) % Number(m[2]) !== 0) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Jede Antwort ist eine Zahl. Richtig ist sie genau dann, wenn die Eigenschaft (nicht) zutrifft.
  zahlenwahl: (n, a) => {
    const TEST = {
      teilt: (x) => n.zahl % x === 0,
      einmaleins: (x) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some((u) => x % u === 0 && x / u <= 10),
      rest: (x) => x < n.durch,
    };
    if (!TEST[n.eigenschaft]) return 'unbekannte Eigenschaft';
    for (const o of a.optionen ?? []) {
      if (!/^\d+$/.test(o.text)) return `Antwort „${o.text}“ ist keine Zahl`;
      if ((TEST[n.eigenschaft](Number(o.text)) === n.gilt) !== o.richtig) return `Antwort ${o.text} ist falsch eingestuft`;
    }
    return null;
  },
  // Die Antworten beginnen mit einem Rechenausdruck. Richtig ist der mit dem größten (kleinsten) Wert.
  extrem: (n, a) => {
    const werte = (a.optionen ?? []).map((o) => ({ o, w: rechne(anfang(o.text) ?? '') })).filter((x) => !Number.isNaN(x.w));
    if (werte.length < 2) return 'zu wenige Rechenausdrücke';
    const ziel = n.was === 'groesstes' ? Math.max(...werte.map((x) => x.w)) : Math.min(...werte.map((x) => x.w));
    if (werte.filter((x) => x.w === ziel).length !== 1) return 'zwei Antworten haben denselben Wert';
    for (const { o, w } of werte) if ((w === ziel) !== o.richtig) return `Antwort „${o.text.slice(0, 30)}“ ist falsch eingestuft`;
    for (const o of a.optionen) if (o.richtig && Number.isNaN(rechne(anfang(o.text) ?? ''))) return 'richtige Antwort ist kein Rechenausdruck';
    return null;
  },
  // Genau eine Art, das Ziel aus Vielfachen der beiden Werte zusammenzusetzen (Dartscheibe).
  kombination: (n) => {
    const alle = [];
    for (let x = 0; x * n.werte[0] <= n.ziel; x++) for (let y = 0; x * n.werte[0] + y * n.werte[1] <= n.ziel; y++) if (x * n.werte[0] + y * n.werte[1] === n.ziel) alle.push([x, y]);
    return alle.length === 1 && gleich(alle[0], n.anzahl) ? null : `Möglichkeiten: ${JSON.stringify(alle)}`;
  },
  // Welche der Aufgaben braucht beim schriftlichen Rechnen einen Übertrag?
  uebertrag: (n) => {
    const braucht = ([x, y]) => {
      let u = 0, je = false;
      for (; x > 0 || y > 0; x = Math.floor(x / 10), y = Math.floor(y / 10)) {
        u = n.zeichen === '+' ? (x % 10 + y % 10 + u >= 10 ? 1 : 0) : (x % 10 < y % 10 + u ? 1 : 0);
        if (u) je = true;
      }
      return je;
    };
    return gleich(n.aufgaben.map(braucht), n.mit) ? null : `Überträge: ${n.aufgaben.map(braucht)}`;
  },
  // Nach wie vielen Schritten liegt der Betrag zum ersten Mal unter der Grenze?
  ersteUnterschreitung: (n) => {
    let k = 0, x = n.start;
    while (x >= n.grenze && x - n.schritt >= 0) { x -= n.schritt; k++; }
    return x < n.grenze && k === n.anzahl ? null : `es sind ${k} Schritte`;
  },
  // Potenz: basis hoch exponent ist wert.
  potenz: (n) => (Number.isInteger(n.basis) && Number.isInteger(n.exponent) && n.exponent >= 1 && n.basis ** n.exponent === n.wert ? null : `${n.basis} hoch ${n.exponent} ist nicht ${n.wert}`),
  quadrat: (n) => {
    const alle = Array.from({ length: 1000 }, (_, i) => i + 1).filter((x) => x * x === n.zahl);
    return alle.length === 1 && alle[0] === n.wurzel ? null : 'keine Quadratzahl';
  },
  // Überschlag mit einer glatten Zahl in der Nähe, die nicht durch Runden entsteht (963 : 3 mit 900 : 3).
  naheBei: (n) => {
    const stellen = String(n.rund).replace(/0+$/, '').length;
    return stellen <= 2 && Math.abs(n.zahl - n.rund) / n.zahl <= 0.15 ? null : `${n.rund} ist keine glatte Zahl nahe bei ${n.zahl}`;
  },
};
// Was eine Sonderprüfung als Ergebnis bestätigt. Nur das zählt als Lösung, nicht jede Zahl in der Beschreibung.
const ERGEBNIS = {
  kleinsteDifferenz: (n) => n.differenz,
  ziffern: (n) => n.ziffern, potenz: (n) => [n.basis, n.exponent, n.wert], extremzahlen: (n) => [n.gross, n.klein], anzahlProdukte: (n) => n.anzahl, anzahlTeiler: (n) => n.anzahl,
  ziffernTeilbar: (n) => n.anzahl ?? n.ziffern, ziffernZahlen: (n) => n.anzahl, grenzVielfaches: (n) => n.zahl, vielfachesZwischen: (n) => n.zahl,
  grenzRest: (n) => n.zahl, anzahlMitRest: (n) => n.anzahl, kleinsteMitResten: (n) => n.zahl, teilerZwischen: (n) => n.teiler,
  ablesen: (n) => n.wert, schluessel: (n) => n.wert, linienabstand: (n) => n.wert,
  stelle: (n) => n.ziffer, ziffernzahl: (n) => n.anzahl, zahlwort: (n) => n.zahl, extremwert: (n) => n.wert, strahl: (n) => n.wert, schrittweite: (n) => n.wert, runden: (n) => n.wert,
  rundungsgrenze: (n) => [n.kleinste, n.groesste].filter((x) => x != null), dual: (n) => n.wert, roemisch: (n) => n.wert, tafel: (n) => n.zahl, bildwert: (n) => n.wert,
  kombination: (n) => n.anzahl, uebertrag: (n) => n.aufgaben.filter((_, i) => n.mit[i]).map((x) => x[0]), ersteUnterschreitung: (n) => n.anzahl, quadrat: (n) => n.wurzel, zahlenpaar: (n) => n.paar,
};
Object.assign(SONDER, GEO_SONDER);
Object.assign(ERGEBNIS, GEO_ERGEBNIS);
// Kapitel 7 (ADR 0034): Winkel, Kreise, Dreiecke und Gradnetz.
Object.assign(SONDER, WINKEL_SONDER);
Object.assign(ERGEBNIS, WINKEL_ERGEBNIS);
const zahlenImObjekt = (x) => (typeof x === 'number' ? [x] : typeof x === 'string' ? zahlenIn(x) : x && typeof x === 'object' ? Object.values(x).flatMap(zahlenImObjekt) : []);

// Zahlen, die ein Bild zeigt (ohne die Unbekannten).
function bildZahlen(b) {
  if (!b) return [];
  if (WINKELBILDER.includes(b.art)) return winkelBildZahlen(b);
  const w = (x) => (istFrage(x) ? [] : [wertVon(x)]);
  switch (b.art) {
    case 'stellenwerttafel': return [...b.plaettchen, b.plaettchen.reduce((s, x, i) => s + x * 10 ** (b.plaettchen.length - 1 - i), 0)];
    case 'zehnermaterial': {
      const wert = (m) => 100 * m.h + 10 * m.z + m.e;
      return [b.h, b.z, b.e, wert(b), 10 * b.z, 100 * b.h, ...(b.weg ? [b.weg.h, b.weg.z, b.weg.e, wert(b.weg), wert(b) - wert(b.weg)] : [])];
    }
    case 'punktefeld': return [b.reihen, b.spalten, b.reihen * b.spalten, ...(b.trenn ? [b.trenn, b.reihen - b.trenn, b.trenn * b.spalten, (b.reihen - b.trenn) * b.spalten] : [])];
    case 'quadratbild': return [b.seite, b.seite * b.seite, ...(b.schichten > 1 ? [b.schichten, b.schichten * b.seite * b.seite] : [])];
    case 'paeckchen': return [b.einzeln ?? 0, b.paeckchen, b.je, b.paeckchen * b.je, (b.einzeln ?? 0) + b.paeckchen * b.je];
    case 'mengenbild': return [b.anzahl, b.weg ?? 0, b.dazu ?? 0, b.anzahl + (b.dazu ?? 0), b.anzahl + (b.dazu ?? 0) - (b.weg ?? 0)];
    case 'gruppenbild': return [b.gruppen, b.je, b.rest ?? 0, b.gruppen * b.je, b.gruppen * b.je + (b.rest ?? 0)];
    case 'streifen': return [...w(b.ganz), ...b.teile.flatMap(w)];
    case 'vergleich': return [...w(b.oben.wert), ...w(b.unten.wert), ...w(b.unterschied)];
    case 'zehnerfeld': return [b.felder, b.belegt, b.dazu ?? 0, b.belegt + (b.dazu ?? 0), b.felder - b.belegt];
    case 'zahlenstrahl': return [b.von, b.bis, ...(b.punkte ?? []), ...(b.start != null ? [b.start] : []), ...(b.spruenge ?? []).flatMap((s) => [s.von, s.nach, Math.abs(s.nach - s.von)])];
    case 'saeulen': return [b.max, b.schritt, b.fein ?? b.schritt, b.ab ?? 0, ...b.saeulen.flatMap((x) => w(x.wert))];
    case 'bilddiagramm': return [b.je, ...b.zeilen.flatMap((x) => w(x.wert))];
    case 'strichliste': return b.zeilen.map(strichzahl);
    case 'tafel': { const z = b.werte.filter((x) => !istFrage(x)).map((x) => x ?? 0); return [...(b.weitere ?? []).flatMap((zeile) => [...zeile.map((x) => x ?? 0), zeile.reduce((s, x) => s * (b.basis ?? 10) + (x ?? 0), 0)]), ...z, b.werte.some(istFrage) ? null : b.werte.reduce((s, x) => s * (b.basis ?? 10) + (x ?? 0), 0), ...b.spalten.flatMap(zahlenIn)].filter((x) => x != null); }
    case 'schaetzbild': { const alle = b.felder.flat(), n = alle.reduce((x, y) => x + y, 0); return [alle.length, b.felder.length, b.felder[0].length, n, ...(b.markiert ? [b.felder[b.markiert[0]][b.markiert[1]]] : []), ...(b.grob ? [b.grob[0] * b.grob[1]] : [])]; }
    case 'gitter': return zahlenImObjekt({ ...b, linien: (b.linien ?? []).map((l) => [l.a, l.b]), punkte: (b.punkte ?? []).map((q) => [q.x, q.y]), figuren: (b.figuren ?? []).map((f) => f.ecken) });
    case 'lineal': return [0, b.von, b.bis, b.bis - b.von, b.lang, b.lang / 10, Math.floor(b.von / 10), Math.floor(b.bis / 10), b.bis % 10, b.von % 10];
    case 'zeichentafel': return b.zeichen.map((z) => ({ I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 })[z]);
    default: return [];
  }
}

function pruefeNachweis(a) {
  // Kapitel 6 rechnet mit Größen und hat einen eigenen Nachweis (tools/pruefe-groessen.mjs).
  if (groessenModus) { for (const x of pruefeGroessenNachweis(a)) melde(a.id, x); return; }
  const pflicht = ['zahl', 'luecken', 'tabelle', 'sachaufgabe', 'strichliste', 'zeichnen', 'ordnen', 'zeichen', 'schaetzen', 'gitter', 'winkel'].includes(a.format);
  if (!a.nachweis) {
    if (pflicht) melde(a.id, 'Nachweis fehlt');
    if ((a.optionen ?? []).some((o) => polaritaet(o.text) !== null) && !a.begriffGeprueft) melde(a.id, 'Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
    return;
  }
  if (!Array.isArray(a.nachweis) || a.nachweis.length === 0) { melde(a.id, 'Nachweis ist leer'); return; }
  const loesungen = loesungenVon(a);
  // Bekannt ist, was die Aufgabe zeigt: Text, Antworten, Tabelle, Diagramm, Zahlenstrahl, Bild. Dazu 10, 100, 1000.
  // Die Lösung selbst ist nicht bekannt: Sie muss als Ergebnis einer Rechnung aus bekannten Zahlen entstehen.
  // Ausnahme Lücken und Tabellen: Dort werden die Lösungen in den Text eingesetzt und jede Gleichung geprüft (pruefeFormat).
  const frei = a.format === 'auswahl' || a.format === 'zuordnen'; // Beispiele zu einer allgemeinen Aussage sind frei wählbar
  const eingesetzt = a.format === 'luecken' ? a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken?.[n]?.loesung ?? '?') : '';
  const bekannt = new Set([10, 100, 1000, ...sichtbareTexte(a).flatMap(zahlenIn), ...bildZahlen(a.bild),
    ...zahlenImObjekt(a.tabelle), ...zahlenImObjekt(a.diagramm), ...zahlenImObjekt(a.strahl), ...zahlenIn(eingesetzt), ...zahlenImObjekt(a.daten), ...(a.karten ?? []).flatMap(zahlenIn), ...bildZahlen(a.gitter && { ...a.gitter, art: 'gitter' }), ...zahlenImObjekt(a.bedingung),
    ...(a.format === 'strichliste' ? a.zeilen.map((z) => z.start ?? 0) : []),
    ...(['luecken', 'tabelle'].includes(a.format) ? loesungen : []),
    // Ab M gehören kleine Zahlen zum Text („doppelt“, „dreimal“, „die Hälfte“).
    ...(NIVEAUS.indexOf(a.niveau) >= 2 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [])]);
  const gegeben = new Set(bekannt);
  const ergebnisse = new Set();
  const vorkommen = new Set();
  const offen = [];
  for (const n of a.nachweis) {
    if (typeof n === 'object' && n !== null) {
      if (n.art == null) {
        if (typeof n.zahl !== 'number' || !n.grund) melde(a.id, 'Nachweis: Hilfszahl ohne Zahl oder Grund');
        if (loesungen.includes(n.zahl) && a.format !== 'luecken') melde(a.id, 'Nachweis: Die Lösung darf keine Hilfszahl sein');
        bekannt.add(n.zahl);
        continue;
      }
      const pruefe = SONDER[n.art];
      if (!pruefe) { melde(a.id, `Nachweis: unbekannte Art ${n.art}`); continue; }
      const meldung = pruefe(n, a);
      if (meldung) melde(a.id, `Nachweis ${n.art}: ${meldung}`);
      for (const z of zahlenImObjekt(n)) { bekannt.add(z); vorkommen.add(z); }
      for (const z of [ERGEBNIS[n.art]?.(n) ?? []].flat()) ergebnisse.add(z);
      continue;
    }
    if (n.includes('≈')) {
      const [l, r] = n.split(' ≈ ');
      const [x, y] = [zahlAus(l), zahlAus(r)];
      if (!/^[\d\u00a0]+$/.test(l) || !/^[\d\u00a0]+$/.test(r) || !rundet(x, y)) melde(a.id, `Nachweis: ${n} ist nicht richtig gerundet`);
      offen.push({ n, ein: [x], aus: [y], wert: y });
      continue;
    }
    // Division mit Rest: „14 : 4 = 3 Rest 2“. Quotient und Rest sind die Ergebnisse.
    const mr = n.match(new RegExp(`^(${NUM}) : (${NUM}) = (${NUM}) Rest (${NUM})$`));
    if (mr) {
      const [x, d, q, r] = mr.slice(1).map(zahlAus);
      if (!(d > 0) || r >= d || q * d + r !== x) melde(a.id, `Nachweis: „${n}“ stimmt nicht`);
      offen.push({ n, ein: [x, d], aus: [x, d, q, r], wert: q, werte: [q, r] });
      continue;
    }
    const seiten = n.split(' = ');
    const werte = seiten.map(rechne);
    if (seiten.length < 2 || werte.some((w) => Number.isNaN(w))) { melde(a.id, `Nachweis: „${n}“ ist keine Rechnung`); continue; }
    if (werte.some((w) => w !== werte[0])) melde(a.id, `Nachweis: „${n}“ stimmt nicht (${werte.join(' und ')})`);
    if (werte[0] < 0) melde(a.id, `Nachweis: „${n}“ hat ein negatives Ergebnis`);
    offen.push({ n, ein: zahlenIn(seiten[0]), aus: zahlenIn(n), wert: werte[0] });
  }
  // Zeilen der Reihe nach auflösen: Eine Rechnung zählt, sobald alle ihre Zahlen bekannt sind. Ihr Ergebnis ist danach bekannt.
  for (let weiter = true; weiter;) {
    weiter = false;
    for (const z of offen) if (!z.fertig && (frei || z.ein.every((x) => bekannt.has(x)))) {
      z.fertig = true; weiter = true;
      for (const x of z.aus) { bekannt.add(x); vorkommen.add(x); }
      for (const w of z.werte ?? [z.wert]) ergebnisse.add(w);
    }
  }
  // Ein zweiter Rechenweg mit Hilfszahlen (400 + 213 − 3 statt 397 + 213) zählt, wenn er zu einem schon bestätigten Ergebnis führt.
  for (const z of offen) if (!z.fertig) {
    if (ergebnisse.has(z.wert) || bekannt.has(z.wert)) { for (const x of z.aus) vorkommen.add(x); continue; }
    melde(a.id, `Nachweis: ${z.ein.filter((x) => !bekannt.has(x)).join(', ')} kommt in der Aufgabe nicht vor (${z.n})`);
  }
  // Jede Lösung muss sich aus dem Nachweis ergeben.
  if (a.tabelle?.art === 'raster') return;
  for (const l of loesungen) {
    const menge = ['zahl', 'winkel', 'sachaufgabe', 'diagramm', 'zahlenstrahl', 'strichliste', 'zeichnen', 'schaetzen'].includes(a.format) ? ergebnisse : vorkommen;
    if (!menge.has(l)) melde(a.id, `Lösung ${l} ergibt sich nicht aus dem Nachweis`);
  }
  // Lücken ohne eigene Gleichung: Fragt die Lücke nach einem Fachbegriff („Der erste Summand ist ▢“), zählt die Gleichung im Text. Sonst muss die Zahl ein Ergebnis im Nachweis sein.
  for (const n of a.lueckenOhneGleichung ?? []) {
    const wert = a.luecken[n].loesung;
    const g = a.text.match(new RegExp(`(${NUM}) ([+−·:]) (${NUM}) = (${NUM})`));
    const frage = a.text.match(new RegExp(`(erste |zweite )?(${Object.values(BEGRIFFE).flat().join('|')}) ist \\{\\{${n}\\}\\}\\.?(\n|$)`));
    if (g && frage && gleichungenIn(a.text).length === 1) {
      const namen = BEGRIFFE[g[2]], zahlen = [zahlAus(g[1]), zahlAus(g[3]), zahlAus(g[4])];
      const stelle = frage[1] === 'zweite ' ? 1 : namen.indexOf(frage[2]);
      if (namen[stelle] !== frage[2] || zahlen[stelle] !== wert) melde(a.id, `Lücke ${n}: ${frage[2]} ist ${zahlen[stelle] ?? 'in der Gleichung nicht zu finden'}, nicht ${wert}`);
    } else if (!ergebnisse.has(wert)) melde(a.id, `Lücke ${n}: ${wert} ist kein Ergebnis im Nachweis`);
  }
  // Zwei Lücken ohne eigene Gleichung mit derselben Lösung: Dann ließe sich eine falsche Lösung hinter dem Ergebnis der anderen verstecken.
  { const frei = (a.lueckenOhneGleichung ?? []).filter((n) => ergebnisse.has(a.luecken[n].loesung)).map((n) => a.luecken[n].loesung);
    // Ausnahme: Division mit Rest, dort dürfen Quotient und Rest gleich sein.
    if (new Set(frei).size !== frei.length && !(a.nachweis ?? []).some((z) => typeof z === 'string' && / Rest /.test(z))) melde(a.id, 'zwei Lücken ohne eigene Gleichung haben dieselbe Lösung'); }
  // Die Lösung ist das Endergebnis, kein Zwischenergebnis: Sie wird nicht in einer späteren Rechnung zu etwas Neuem weiterverrechnet.
  if (['zahl', 'winkel'].includes(a.format) && !a.nachweis.some((n) => typeof n === 'object' && [ERGEBNIS[n.art]?.(n) ?? []].flat().includes(a.loesung))) {
    const zeilen = offen.filter((z) => z.fertig);
    const stellen = zeilen.map((z, i) => ((z.werte ?? [z.wert]).includes(a.loesung) ? i : -1)).filter((i) => i >= 0);
    const weiter = (i) => zeilen.slice(i + 1).some((z) => z.ein.includes(a.loesung) && !gegeben.has(z.wert) && z.wert !== a.loesung);
    if (stellen.length && stellen.every(weiter)) melde(a.id, `Lösung ${a.loesung} ist im Nachweis nur ein Zwischenergebnis`);
  }
  // Jede Zahl aus dem Text gehört zur Rechnung: Sie steht im Nachweis oder im Bild, oder sie ist als Hilfszahl mit Grund genannt.
  const benutzt = new Set([...zahlenImObjekt(a.nachweis), ...bildZahlen(a.bild), ...bildZahlen(a.gitter && { ...a.gitter, art: 'gitter' }), ...zahlenImObjekt(a.bedingung), ...(a.format === 'gitter' ? zahlenImObjekt(a.loesung) : []), ...zahlenImObjekt(a.tabelle), ...zahlenImObjekt(a.diagramm), ...zahlenImObjekt(a.strahl), ...zahlenImObjekt(a.daten)]);
  const mitUrteil = a.nachweis.some((n) => n?.art === 'urteil');
  // Kapitel 2: Die 0 ist dort Stoff („von 0 bis 1000“, „eine 0 an der Zehnerstelle“) und keine Rechenzahl.
  const nullFrei = a.lernziel.startsWith('5.2.');
  if (!mitUrteil) for (const z of textZahlen(a)) if (!benutzt.has(z) && !(z === 0 && nullFrei)) melde(a.id, `Zahl ${z} aus dem Text kommt im Nachweis nicht vor`);
  const antwortenGeprueft = a.nachweis.some((n) => ['naechste', 'rundenwahl'].includes(n?.art)); // dort stuft der Prüfer jede Antwort selbst ein
  for (const o of antwortenGeprueft ? [] : (a.optionen ?? []).filter((x) => x.richtig && /^[\d\u00a0]+$/.test(x.text))) {
    if (!vorkommen.has(zahlAus(o.text))) melde(a.id, `richtige Antwort ${o.text} ergibt sich nicht aus dem Nachweis`);
  }
  if (a.format === 'auswahl') pruefeAuswahlNachweis(a, ergebnisse);
  // Steht im Text eine Gleichung mit Platzhalter („15 : ▢ = 3“), muss sie mit der eingesetzten Lösung stimmen.
  if (a.format === 'zahl' && (a.text.match(/▢/g) ?? []).length === 1) {
    for (const zeile of a.text.split('\n').filter((z) => z.includes('▢') && z.includes(' = '))) {
      const g = gleichungenIn(zeile.replace('▢', String(a.loesung)));
      if (g.length === 1 && !stimmt(g[0])) melde(a.id, `Mit der Lösung ${a.loesung} stimmt „${zeile.trim()}“ nicht`);
    }
  }
  // Steht im Text eine fertige Rechnung, muss sie im Nachweis vorkommen oder direkt die Lösung sein.
  if (a.format === 'zahl') {
    const imNachweis = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? n.split(/ [=≈] /).map(norm) : n.ausdruck ? [norm(n.ausdruck)] : [])));
    const gerundet = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' && n.includes('≈') ? [zahlAus(n.split(' ≈ ')[0])] : n.art === 'naheBei' ? [n.zahl] : [])));
    for (const zeile of a.text.split('\n')) {
      if (/[▢]|\{\{/.test(zeile)) continue;
      for (const m of zeile.replace(EINHEITEN, '').matchAll(new RegExp(`(?<! [+−·:=] )(?<![\\d▢(\\[])${AUSDRUCK}`, 'g'))) {
        if (!hatZeichen(m[0])) continue;
        // Beim Überschlag wird nicht die Rechnung aus dem Text gerechnet, sondern die gerundete.
        if (zahlenIn(m[0]).some((z) => gerundet.has(z))) continue;
        const klammern = (t) => norm(t).replace(/\[/g, '(').replace(/\]/g, ')');
        if (![...imNachweis].some((n) => klammern(n).includes(klammern(m[0]))) && rechne(m[0]) !== a.loesung) melde(a.id, `Rechnung „${m[0]}“ aus dem Text fehlt im Nachweis`);
      }
    }
  }
}

// Kapitel 1: Fragt eine Aufgabe nur nach dem Wert eines Namens („Wie viele Kinder haben ‚Apfel‘ gewählt?“), ist die Lösung genau der abgelesene Wert.
const VERGLEICH = /mehr|weniger|zusammen|oder|insgesamt|nicht|alle|beide|ohne|Unterschied|doppelt|Hälfte|fehlen|Bündel|Bilder?\b|danach|dazu/i;
function pruefeAblesefrage(a) {
  if (groessenModus) return;
  const m = datenVon(a);
  if (!m || !m.size) return;
  if (!DATENBILDER.includes(a.bild?.art) && a.daten?.kopf.length > 2) return; // Tabelle mit mehreren Spalten: Es wird gerechnet.
  const fragen = a.format === 'zahl' ? [{ text: a.text.split('\n').at(-1), loesung: a.loesung }] : a.format === 'sachaufgabe' ? a.teile : [];
  const kommtVor = (text, n) => new RegExp(`(^|[^${B_}\\d])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^${B_}\\d])`).test(text) || (TAGNAMEN[n] && text.includes(TAGNAMEN[n]));
  for (const f of fragen) {
    if (!/^Wie viele/.test(f.text) || VERGLEICH.test(f.text)) continue;
    const namen = [...m.keys()].filter((n) => kommtVor(f.text, n));
    if (namen.length !== 1 || typeof m.get(namen[0]) !== 'number') continue;
    if (m.get(namen[0]) !== f.loesung) melde(a.id, `„${f.text}“: abgelesen ist ${m.get(namen[0])}, nicht ${f.loesung}`);
  }
}

// Auswahlaufgaben: Die richtige Antwort muss an den Nachweis gebunden sein.
const ARTEN_GEO = ['vierteEcke', 'lagezuZahl', 'schritt', 'rechterWinkel', 'lagepunkt', 'streckenwahl', 'linienart', 'linienzahl', 'verbindungen', 'schnittpunkt', 'punktwahl', 'lage', 'lagewahl', 'lagezu', 'lagezahl', 'koordinaten', 'spiegeln', 'lotfuss', 'strecke', 'abstand', 'abstandLinien', 'messen', 'achsen', 'punktsymmetrie', 'istAchse', 'achsenwahl', 'figurenwahl', 'viereck', ...WINKEL_ARTEN];
const ARTEN_AUSWAHL = [...ARTEN_GEO, 'zahlwort', 'vergleich', 'ketten', 'rundenwahl', 'rundungsstelle', 'dual', 'roemisch', 'roemischGueltig', 'naechste', 'quotientUeber', 'ueberschlagVon', 'wert', 'gleichungen', 'zwischen', 'extrem', 'zahlenwahl', 'urteil', 'paarsumme', 'gleicheWerte', 'restBleibt',
  'zeile', 'datenwahl', 'rangfolge', 'einteilung', 'mangel', 'aussagen'];
function pruefeAuswahlNachweis(a, ergebnisse) {
  const arten = a.nachweis.filter((n) => typeof n === 'object').map((n) => n.art);
  const gebunden = arten.some((x) => ARTEN_AUSWAHL.includes(x));
  const richtige = a.optionen.filter((o) => o.richtig);
  // Zahlen in der richtigen Antwort stehen im Text oder im Nachweis.
  const erlaubt = new Set([...zahlenIn(a.text), ...zahlenImObjekt(a.nachweis), ...bildZahlen(a.bild)]);
  // Rechnet eine Sonderart jede Antwort selbst nach, sind deren Zahlen schon geprüft.
  const selbstGeprueft = arten.some((x) => [...ARTEN_GEO, 'zahlwort', 'vergleich', 'ketten', 'rundenwahl', 'rundungsstelle', 'dual', 'roemisch', 'roemischGueltig', 'naechste', 'extremwert', 'gleichungen', 'wert', 'extrem', 'zahlenwahl', 'paarsumme', 'gleicheWerte', 'restBleibt', 'quotientUeber', 'ueberschlagVon', 'datenwahl', 'einteilung', 'zeile', 'mangel', 'rangfolge'].includes(x));
  if (!selbstGeprueft) for (const o of richtige) for (const z of zahlenIn(o.text)) if (!erlaubt.has(z)) melde(a.id, `Zahl ${z} in der richtigen Antwort kommt weder im Text noch im Nachweis vor`);
  // Antworten mit Zustimmung oder Ablehnung brauchen ein Urteil.
  if (a.optionen.some((o) => polaritaet(o.text) !== null) && !arten.includes('urteil') && !a.begriffGeprueft) melde(a.id, 'Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
  if (gebunden || a.mehrfach) return;
  const seiten = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? n.split(/ [=≈] /).map(norm) : [])));
  const ersteSeiten = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? [norm(n.split(/ [=≈] /)[0])] : [])));
  // Reine Rechenausdrücke: Nur der richtige steht im Nachweis. Werden auch die falschen nachgerechnet, braucht es eine Sonderart.
  if (a.optionen.every((o) => new RegExp(`^${AUSDRUCK}$`).test(o.text.trim()) && hatZeichen(o.text))) {
    if (!seiten.has(norm(richtige[0].text))) melde(a.id, `richtige Antwort „${richtige[0].text}“ steht nicht im Nachweis`);
    for (const o of a.optionen) if (!o.richtig && ersteSeiten.has(norm(o.text))) melde(a.id, `falsche Antwort „${o.text}“ steht im Nachweis (Sonderart wert oder extrem nötig)`);
    return;
  }
  // Reine Gleichungen: Die richtige steht wörtlich im Nachweis.
  if (a.optionen.every((o) => gleichungenIn(o.text).length === 1 && gleichungenIn(o.text)[0].ganz === o.text)) {
    if (!a.nachweis.some((n) => typeof n === 'string' && norm(n) === norm(richtige[0].text))) melde(a.id, `richtige Antwort „${richtige[0].text}“ steht nicht im Nachweis`);
    return;
  }
  // Reine Zahlen: Die richtige ist ein Ergebnis im Nachweis, die falschen sind es nicht.
  if (a.optionen.every((o) => /^(etwa )?\d[\d\u00a0]*$/.test(o.text))) {
    const z = (o) => zahlAus(o.text.replace('etwa ', ''));
    if (!ergebnisse.has(z(richtige[0]))) melde(a.id, `richtige Antwort ${richtige[0].text} ist kein Ergebnis im Nachweis`);
    // Ist die richtige Antwort das Ergebnis der letzten Zeile, dürfen falsche Antworten Zwischenergebnisse sein (typische Fehler).
    const letzteZeile = a.nachweis.filter((n) => typeof n === 'string').at(-1);
    const endwert = letzteZeile ? zahlAus(letzteZeile.split(/ [=≈] /).at(-1)) : NaN;
    if (z(richtige[0]) !== endwert) for (const o of a.optionen) if (!o.richtig && ergebnisse.has(z(o))) melde(a.id, `falsche Antwort ${o.text} ist ein Ergebnis im Nachweis`);
  }
}

// Fachbegriffe: „Wie heißt die Zahl 65 in 24 + 65 = 89?“ wird aus der Gleichung im Text bestimmt.
const BEGRIFFE = { '+': ['Summand', 'Summand', 'Summe'], '−': ['Minuend', 'Subtrahend', 'Differenz'], '·': ['Faktor', 'Faktor', 'Produkt'], ':': ['Dividend', 'Divisor', 'Quotient'] };
function pruefeBegriff(a) {
  if (a.format !== 'auswahl') return;
  const g = a.text.match(new RegExp(`(${NUM}) ([+−·:]) (${NUM}) = (${NUM})`));
  if (!g) return;
  const zahlen = [zahlAus(g[1]), zahlAus(g[3]), zahlAus(g[4])];
  const begriffVon = (z) => { const i = zahlen.indexOf(z); return i < 0 || zahlen.indexOf(z, i + 1) >= 0 ? null : BEGRIFFE[g[2]][i]; };
  const alle = [...new Set(Object.values(BEGRIFFE).flat())];
  const frage = a.text.match(/Wie heißt die Zahl (\d+)/);
  if (frage) {
    const soll = begriffVon(Number(frage[1]));
    if (!soll) { melde(a.id, 'Fachbegriff: Zahl ist in der Gleichung nicht eindeutig'); return; }
    for (const o of a.optionen) if ((o.text === soll) !== o.richtig) melde(a.id, `Fachbegriff: „${o.text}“ ist falsch eingestuft (richtig ist ${soll})`);
    a.begriffGeprueft = true;
    return;
  }
  // Behauptung im Text: „Bei 41 + 46 = 87 ist 87 ein Summand.“
  const beh = a.text.match(new RegExp(`ist (\\d+) (?:ein|eine|der|die|das) (${alle.join('|')})`));
  if (beh) {
    const soll = begriffVon(Number(beh[1]));
    if (!soll) { melde(a.id, 'Fachbegriff: Zahl ist in der Gleichung nicht eindeutig'); return; }
    const stimmtBeh = soll === beh[2];
    for (const o of a.optionen) {
      const genannt = alle.filter((b) => o.text.includes(b));
      const passt = polaritaet(o.text) === stimmtBeh && (stimmtBeh || genannt.includes(soll));
      if (passt !== o.richtig) melde(a.id, `Fachbegriff: „${o.text.slice(0, 40)}“ ist falsch eingestuft (richtig ist ${soll})`);
    }
    a.begriffGeprueft = true;
  }
}

// ---------- Bilder ----------
const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
function pruefeBild(a) {
  const b = a.bild;
  if (!b) return;
  const m = (text) => melde(a.id, `Bild ${b.art}: ${text}`);
  // Kapitel 6: Bilder mit Größen. Ob ihre Größen zur Aufgabe gehören, prüft der Nachweis.
  // Kapitel 7 zeigt an der Zeigeruhr Winkel zwischen den Zeigern, auf jeder Niveaustufe.
  if (GROESSENBILDER.includes(b.art)) { bildMaengel(b, b.art === 'uhr' && a.lernziel.startsWith('5.7.') ? 'F' : a.niveau).forEach(m); return; }
  // Kapitel 7: Winkel mit Geodreieck, Kreis am Lineal, Gradnetz. Was sie zeigen, rechnet der Nachweis nach.
  if (WINKELBILDER.includes(b.art)) { winkelBildMaengel(b, a).forEach(m); return; }
  // Kapitel 8: Figuren aus Rechtecken. Flächeninhalt und Umfang rechnet der Nachweis nach.
  if (b.art === 'flaeche') { flaecheBildMaengel(b, a, gRechne).forEach(m); return; }
  const kern = []; // Zahlen, die das Bild zeigt und die zur Aufgabe gehören müssen
  const unbekannte = [];
  const w = (x) => { if (istFrage(x)) unbekannte.push(x.wert); else kern.push(x); return wertVon(x); };
  switch (b.art) {
    case 'stellenwerttafel': {
      const erlaubt = ['T', 'H', 'Z', 'E'];
      if (!Array.isArray(b.spalten) || b.spalten.length !== b.plaettchen?.length || b.spalten.join('') !== erlaubt.slice(-b.spalten.length).join('')) { m('Spalten passen nicht'); break; }
      if (b.plaettchen.some((x) => !ganz(x, 0, 19))) m('zu viele Plättchen in einer Spalte');
      kern.push(b.plaettchen.reduce((s, x, i) => s + x * 10 ** (b.plaettchen.length - 1 - i), 0));
      break;
    }
    case 'zehnermaterial': {
      if (!ganz(b.h, 0, 9) || !ganz(b.z, 0, 20) || !ganz(b.e, 0, 20) || b.h + b.z + b.e === 0) m('Anzahl der Platten, Stangen oder Würfel passt nicht');
      if (b.weg && (b.weg.h > b.h || b.weg.z > b.z || b.weg.e > b.e || b.weg.h + b.weg.z + b.weg.e === 0)) m('es wird mehr weggenommen, als da ist');
      kern.push({ wert: 100 * b.h + 10 * b.z + b.e, teile: [b.h, b.z, b.e].filter((x) => x > 0) });
      if (b.weg) kern.push({ wert: 100 * b.weg.h + 10 * b.weg.z + b.weg.e, teile: [b.weg.h, b.weg.z, b.weg.e].filter((x) => x > 0) });
      break;
    }
    case 'punktefeld':
      if (!ganz(b.reihen, 1, 12) || !ganz(b.spalten, 1, 12)) m('Feld ist größer als 12 mal 12');
      if (b.trenn != null && !ganz(b.trenn, 1, b.reihen - 1)) m('Trennlinie liegt nicht im Feld');
      kern.push({ faktoren: [b.reihen, b.spalten] });
      break;
    case 'quadratbild':
      if (!ganz(b.seite, 2, 10) || !ganz(b.schichten ?? 1, 1, 5) || ((b.schichten ?? 1) > 1 && b.schichten !== b.seite)) m('Quadrat passt nicht (Schichten nur als Würfel: so viele Schichten wie Kästchen an einer Seite)');
      kern.push((b.schichten ?? 1) > 1 ? b.seite ** 3 : b.seite * b.seite);
      break;
    case 'paeckchen':
      if (!ganz(b.einzeln ?? 0, 0, 20) || !ganz(b.paeckchen, 1, 8) || !ganz(b.je, 2, 10)) m('Päckchen passen nicht');
      kern.push({ faktoren: [b.paeckchen, b.je] });
      if (b.einzeln) kern.push(b.einzeln);
      break;
    case 'mengenbild':
      if (!ganz(b.anzahl, 1, 30) || !ganz(b.dazu ?? 0, 0, 20) || !ganz(b.weg ?? 0, 0, b.anzahl + (b.dazu ?? 0))) m('Anzahl passt nicht');
      kern.push(b.anzahl); if (b.weg) kern.push(b.weg); if (b.dazu) kern.push(b.dazu);
      if (b.weg || b.dazu) kern.push(b.anzahl + (b.dazu ?? 0) - (b.weg ?? 0));
      break;
    case 'gruppenbild':
      if (!ganz(b.gruppen, 1, 12) || !ganz(b.je, 1, 12) || !ganz(b.rest ?? 0, 0, b.je - 1)) m('Gruppen passen nicht (Rest muss kleiner sein als eine Gruppe)');
      if (b.rest) kern.push(b.je, b.gruppen * b.je + b.rest); else kern.push({ faktoren: [b.gruppen, b.je] });
      break;
    case 'streifen': {
      if (!Array.isArray(b.teile) || b.teile.length < 2 || b.teile.length > 4) { m('braucht zwei bis vier Teile'); break; }
      const g = w(b.ganz), teile = b.teile.map(w);
      if (teile.some((t) => !(t > 0)) || teile.reduce((s, x) => s + x, 0) !== g) m(`Teile ergeben zusammen nicht das Ganze (${teile.join(' + ')} und ${g})`);
      break;
    }
    case 'vergleich': {
      const o = w(b.oben?.wert), u = w(b.unten?.wert), d = w(b.unterschied);
      if (!b.oben?.name || !b.unten?.name) m('Name fehlt');
      if (!(o > u) || o - u !== d) m(`Unterschied stimmt nicht (${o} − ${u} und ${d})`);
      for (const name of [b.oben?.name, b.unten?.name]) if (name && !a.text.includes(name)) m(`Name ${name} steht nicht im Text`);
      break;
    }
    case 'zehnerfeld':
      if (![10, 20].includes(b.felder) || !ganz(b.belegt, 0, b.felder) || !ganz(b.dazu ?? 0, 0, b.felder - b.belegt)) m('Plättchen passen nicht ins Feld');
      kern.push(b.belegt); if (b.dazu) kern.push(b.dazu, b.belegt + b.dazu);
      break;
    case 'zahlenstrahl': {
      if (!(b.von < b.bis) || !(b.schritt > 0) || (b.bis - b.von) % b.schritt !== 0 || b.beschriftung % b.schritt !== 0) { m('Einteilung geht nicht auf'); break; }
      if ((b.bis - b.von) / b.schritt > 60) m('zu viele Teilstriche');
      const aufStrich = (v) => v >= b.von && v <= b.bis && (v - b.von) % b.schritt === 0;
      if (b.start != null) { if (!aufStrich(b.start)) m(`Start ${b.start} liegt nicht auf einem Teilstrich`); if (b.start !== 0) kern.push(b.start); }
      for (const s of b.spruenge ?? []) {
        if (!aufStrich(s.von) || !aufStrich(s.nach)) m(`Sprung ${s.von} nach ${s.nach} liegt nicht auf Teilstrichen`);
        const t = String(s.text ?? '').match(/^([+−]) (\d+)$/);
        if (s.text !== '?' && (!t || s.von + (t[1] === '+' ? 1 : -1) * Number(t[2]) !== s.nach)) m(`Sprung ${s.von} nach ${s.nach} passt nicht zur Beschriftung „${s.text}“`);
        if (s.von === s.nach) m('Sprung ohne Länge');
      }
      if (b.start != null && b.spruenge?.length && b.spruenge[0].von !== b.start) m('erster Sprung beginnt nicht am Start');
      // Markierte Zahlen (Kapitel 2) liegen im Bereich des Strahls und kommen in der Aufgabe vor.
      if (b.punkte) {
        const da = new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...(a.karten ?? []).flatMap(zahlenIn)]);
        if (!Array.isArray(b.punkte) || b.punkte.length < 1 || b.punkte.length > 6 || new Set(b.punkte).size !== b.punkte.length) m('Punkte passen nicht');
        else for (const p of b.punkte) { if (!(p >= b.von && p <= b.bis)) m(`Punkt ${p} liegt nicht auf dem Strahl`); if (!da.has(p)) m(`Punkt ${p} kommt in der Aufgabe nicht vor`); }
      }
      break;
    }
    case 'saeulen': {
      const fein = b.fein ?? b.schritt, ab = b.ab ?? 0;
      if (!(b.titel || b.ohne?.includes('titel')) || !(b.einheit || b.ohne?.includes('einheit'))) m('Titel oder Einheit fehlt');
      if (b.ohne?.some((x) => !['titel', 'einheit'].includes(x))) m('unbekannter Teil in ohne');
      if (!(fein > 0) || !(b.schritt > 0) || b.schritt % fein !== 0 || (b.max - ab) % b.schritt !== 0 || ab % fein !== 0 || !(b.max > ab)) { m('Achse geht nicht auf'); break; }
      if ((b.max - ab) / fein > 40) m('zu viele Linien');
      // Achsen beginnen bei 0 (Nils, 2026-11-20). Nur täuschende Diagramme in V2 auf M und E dürfen abgeschnitten sein.
      if (ab !== 0 && !(/-V2$/.test(a.lernziel) && ['M', 'E'].includes(a.niveau))) m(`Achse beginnt bei ${ab}, nicht bei 0`);
      if (!Array.isArray(b.saeulen) || b.saeulen.length < 2 || b.saeulen.length > 7) { m('braucht zwei bis sieben Säulen'); break; }
      if (new Set(b.saeulen.map((x) => x.name)).size !== b.saeulen.length) m('Name doppelt');
      for (const x of b.saeulen) {
        const v = wertVon(x.wert);
        if (istFrage(x.wert)) unbekannte.push(v);
        // Jeder Wert liegt genau auf einer Linie und auf der Achse.
        if (!Number.isInteger(v) || v <= ab || v > b.max || (v - ab) % fein !== 0) m(`Wert ${v} bei ${x.name} liegt nicht auf einer Linie`);
      }
      break;
    }
    case 'bilddiagramm': {
      if (!b.titel || !b.einheit) m('Titel oder Einheit fehlt');
      if (!['kind', 'buch', 'schaf', 'apfel'].includes(b.symbol)) m(`unbekanntes Symbol ${b.symbol}`);
      if (!ganz(b.je, 1, 1000)) { m('Schlüssel fehlt'); break; }
      if (!Array.isArray(b.zeilen) || b.zeilen.length < 2 || b.zeilen.length > 6) { m('braucht zwei bis sechs Zeilen'); break; }
      for (const x of b.zeilen) {
        const v = wertVon(x.wert);
        if (istFrage(x.wert)) unbekannte.push(v);
        const halb = v % b.je !== 0;
        // Halbe Bilder erst ab M, sauber in der Mitte geteilt.
        if (halb && (b.je % 2 !== 0 || v % b.je !== b.je / 2)) m(`Wert ${v} ist kein Vielfaches eines halben Bildes`);
        if (halb && NIVEAUS.indexOf(a.niveau) < 2) m(`halbes Bild auf Niveaustufe ${a.niveau}`);
        if (!(v > 0) || Math.ceil(v / b.je) > 12) m(`Wert ${v}: zu viele Bilder in einer Zeile`);
      }
      break;
    }
    case 'strichliste': {
      if (!Array.isArray(b.zeilen) || b.zeilen.length < 1 || b.zeilen.length > 6) { m('braucht eine bis sechs Zeilen'); break; }
      if (new Set(b.zeilen.map((x) => x.name)).size !== b.zeilen.length) m('Name doppelt');
      for (const z of b.zeilen) {
        if (!ganz(z.anzahl, 0, 40)) m(`Anzahl ${z.anzahl} passt nicht`);
        if (z.striche && (!/^[I/]+$/.test(z.striche) || strichzahl(z) !== z.anzahl)) m(`Striche bei ${z.name} passen nicht zur Anzahl`);
      }
      break;
    }
    case 'tafel': {
      const basis = b.basis ?? 10;
      if (![10, 2].includes(basis)) { m('Basis muss 10 oder 2 sein'); break; }
      if (!Array.isArray(b.spalten) || !Array.isArray(b.werte) || b.spalten.length !== b.werte.length || b.spalten.length < 2 || b.spalten.length > 15) { m('Spalten und Werte passen nicht'); break; }
      // Die Spalten heißen wie die Stellenwerte: E, Z, H, T … oder im Zweiersystem 1, 2, 4, 8 …
      const soll = basis === 2 ? b.spalten.map((_, i) => String(2 ** (b.spalten.length - 1 - i))) : STELLEN.slice(0, b.spalten.length).reverse();
      if (!gleich(b.spalten, soll)) m(`Spalten heißen ${b.spalten.join(', ')} statt ${soll.join(', ')}`);
      if (b.gruppen && b.gruppen.reduce((n, g) => n + g.spalten, 0) !== b.spalten.length) m('Dreierblöcke passen nicht zu den Spalten');
      if (b.gruppen && b.gruppen.slice(1).some((g) => g.spalten !== 3)) m('ein Block hat nicht drei Stellen');
      const werte = b.werte.map((x) => (istFrage(x) ? (unbekannte.push(x.wert), x.wert) : x));
      if (werte.some((x) => x != null && !ganz(x, 0, b.plaettchen && basis === 10 ? 19 : basis - 1))) m('Wert passt nicht in ein Feld');
      const erste = werte.findIndex((x) => x != null);
      if (erste < 0 || (basis === 10 && !b.plaettchen && werte.slice(erste).some((x) => x == null))) m('leeres Feld mitten in der Zahl');
      if (!b.werte.some(istFrage)) kern.push(werte.reduce((s, x) => s * basis + (x ?? 0), 0));
      // Weitere Zeilen zum Vergleichen: gleich breit, lückenlos, und jede Zahl kommt in der Aufgabe vor.
      for (const zeile of b.weitere ?? []) {
        const da = new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...(a.karten ?? []).flatMap(zahlenIn)]);
        if (!Array.isArray(zeile) || zeile.length !== b.spalten.length || zeile.some((x) => x != null && !ganz(x, 0, basis - 1))) { m('weitere Zeile passt nicht zu den Spalten'); continue; }
        const e = zeile.findIndex((x) => x != null);
        if (e < 0 || zeile.slice(e).some((x) => x == null)) m('leeres Feld mitten in der Zahl');
        const wert = zeile.reduce((s, x) => s * basis + (x ?? 0), 0);
        if (!da.has(wert)) m(`Zahl ${wert} der Tafel kommt in der Aufgabe nicht vor`);
      }
      if (b.weitere && !new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...(a.karten ?? []).flatMap(zahlenIn)]).has(werte.reduce((s, x) => s * basis + (x ?? 0), 0))) m('Zahl der ersten Zeile kommt in der Aufgabe nicht vor');
      break;
    }
    case 'zeichentafel': {
      // Spickzettel der römischen Zahlzeichen: eine Auswahl in der Reihenfolge I, V, X, L, C, D, M.
      const alle = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
      if (!Array.isArray(b.zeichen) || b.zeichen.length < 2 || b.zeichen.some((z) => !alle.includes(z)) || !gleich(b.zeichen, alle.filter((z) => b.zeichen.includes(z)))) m('Zeichen passen nicht');
      // Die Zeichen der Aufgabe stehen alle auf dem Spickzettel.
      else for (const z of new Set([a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.karten ?? []), typeof a.loesung === 'string' ? a.loesung : ''].flatMap((t) => String(t).match(/\b[IVXLCDM]+\b/g) ?? []).join(''))) if (!b.zeichen.includes(z)) m(`Zeichen ${z} fehlt auf der Zeichentafel`);
      break;
    }
    case 'schaetzbild': {
      if (!['punkt', 'schaf', 'apfel', 'kind', 'vogel', 'stern'].includes(b.symbol)) m(`unbekanntes Symbol ${b.symbol}`);
      if (!Array.isArray(b.felder) || b.felder.length < 2 || b.felder.length > 6 || b.felder.some((z) => !Array.isArray(z) || z.length !== b.felder[0].length) || b.felder[0].length < 2 || b.felder[0].length > 8) { m('Felder passen nicht (2 bis 6 Reihen, 2 bis 8 Spalten)'); break; }
      const alle = b.felder.flat(), n = alle.reduce((x, y) => x + y, 0), stufe = NIVEAUS.indexOf(a.niveau);
      if (alle.some((x) => !ganz(x, 0, 40))) m('zu viele Symbole in einem Feld');
      if (typeof b.saat !== 'string' || !/^\d+$/.test(b.saat)) m('Saat fehlt');
      // Raster (Nils, 2026-11-21): auf F und G fest eingezeichnet, ab M blendet das Kind es selbst ein.
      if (!['fest', 'wahl', 'ohne'].includes(b.raster)) m('Raster muss fest, wahl oder ohne sein');
      if (stufe <= 1 && b.raster !== 'fest') m(`auf ${a.niveau} ist das Raster fest eingezeichnet`);
      if (stufe >= 2 && b.raster === 'fest' && !b.fest) m(`ab M blendet das Kind das Raster selbst ein`);
      if (b.gezaehlt && (stufe !== 0 || !b.markiert)) m('die Anzahl im Feld steht nur auf F dabei, und nur am markierten Feld');
      if (b.markiert && !(ganz(b.markiert[0], 0, b.felder.length - 1) && ganz(b.markiert[1], 0, b.felder[0].length - 1))) { m('markiertes Feld gibt es nicht'); break; }
      if (b.grob && (b.felder[0].length % b.grob[0] !== 0 || b.felder.length % b.grob[1] !== 0 || b.grob[0] * b.grob[1] >= alle.length)) m('grobes Raster passt nicht zum feinen');
      // Rechnet der Nachweis selbst mit dem Bild (wahre Anzahl, vollstes Feld), gehört es damit schon zur Aufgabe.
      if (!(a.nachweis ?? []).some((x) => (x?.art === 'naechste' && x.ziel == null) || (x?.art === 'bildwert' && ['gesamt', 'groesstes', 'kleinstes'].includes(x.was))))
        kern.push({ wert: n, teile: [alle.length, ...(b.markiert ? [b.felder[b.markiert[0]][b.markiert[1]]] : [n])] });
      break;
    }
    case 'gitter': { const mangel = gitterMangel(b); if (mangel) m(mangel); break; }
    case 'lineal': {
      if (!ganz(b.lang, 50, 120) || b.lang % 10 !== 0 || !ganz(b.von, 0, b.lang) || !ganz(b.bis, 1, b.lang) || b.von >= b.bis) m('Strecke passt nicht auf das Lineal');
      break;
    }
    default: m('unbekannte Bildart');
  }
  // Kapitel 1: Nennen Text und Bildtitel eine Klasse, ist es dieselbe.
  const klassen = (t) => String(t ?? '').match(/\b\d[a-e]\b/g) ?? [];
  if (klassen(b.titel).length) for (const k of klassen(a.text)) if (!klassen(b.titel).includes(k)) m(`Klasse ${k} im Text, aber ${klassen(b.titel).join(', ')} im Titel`);
  // Das Bild muss zur Aufgabe gehören: Seine Zahlen stehen im Text, in den Antworten, im Nachweis oder sind die Lösung.
  const bekannt = new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...loesungenVon(a), ...zahlenImObjekt(a.nachweis), ...zahlenImObjekt(a.tabelle), ...(a.karten ?? []).flatMap(zahlenIn)]);
  for (const k of kern) {
    if (k.faktoren) { const [x, y] = k.faktoren; if (!bekannt.has(x * y) || !(bekannt.has(x) || bekannt.has(y))) m(`${x} mal ${y} kommt in der Aufgabe nicht vor`); }
    else if (typeof k === 'object') { if (!bekannt.has(k.wert) && !k.teile.every((x) => bekannt.has(x))) m(`${k.wert} kommt in der Aufgabe nicht vor`); }
    else if (!bekannt.has(k)) m(`${k} kommt in der Aufgabe nicht vor`);
  }
  // Eine Unbekannte im Bild ist nie eine Zahl, die schon im Text steht, und sie gehört zur Lösung oder zum Nachweis.
  for (const u of unbekannte) if (!bekannt.has(u)) m(`Unbekannte ${u} gehört nicht zur Aufgabe`);
  if (unbekannte.length > 1) m('mehr als eine Unbekannte');
}
// Formate, die das Dashboard selbst zeichnet (Zahlenstrahl, Diagramm, Rechenraster, Zahlenmauer, Malkreuz), zählen wie ein Bild.
// Kapitel 1: Strichliste und Säulen zeichnen, auch die Antwortkärtchen einer Umfrage (Urliste).
const hatBild = (a) => Boolean(a.bild) || ['zahlenstrahl', 'diagramm', 'strichliste', 'zeichnen', 'gitter', 'winkel'].includes(a.format) || Boolean(a.urliste) || ['raster', 'mauer', 'malkreuz', 'stellentafel', 'einheitentafel'].includes(a.tabelle?.art)
  // Kapitel 6: Preisliste, Fahrplan und Einkaufszettel sind das Bild der Aufgabe.
  || (Boolean(a.daten) && (a.lernziel.startsWith('5.6.') || a.lernziel.startsWith('5.8.')))
  || (istBruchLernziel(a.lernziel) && bruchHatBild(a));

// ---------- Formate ----------
function pruefeFormat(a) {
  if (a.format === 'zahl') {
    pruefeZahl(a.id, a);
  } else if (a.format === 'auswahl') {
    const richtige = a.optionen.filter((o) => o.richtig).length;
    if (a.optionen.length < 2) melde(a.id, 'weniger als zwei Optionen');
    if (!a.mehrfach && a.optionen.length > MAX_OPTIONEN[a.niveau]) melde(a.id, `mehr als ${MAX_OPTIONEN[a.niveau]} Antworten auf Niveaustufe ${a.niveau}`);
    if (a.mehrfach && a.optionen.length > MAX_OPTIONEN[a.niveau] + 1) melde(a.id, `zu viele Antworten auf Niveaustufe ${a.niveau}`);
    if (richtige < 1) melde(a.id, 'keine richtige Option');
    if (!a.mehrfach && richtige !== 1) melde(a.id, 'Einfachauswahl braucht genau eine richtige Option');
    if (a.mehrfach && richtige === a.optionen.length) melde(a.id, 'Mehrfachauswahl: alle Antworten sind richtig');
    if (new Set(a.optionen.map((o) => norm(o.text))).size !== a.optionen.length) melde(a.id, 'Option doppelt');
    for (const o of a.optionen) {
      if (o.fehlvorstellung && !(o.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${o.fehlvorstellung}`);
      if (o.richtig && o.fehlvorstellung) melde(a.id, 'richtige Antwort mit Fehlvorstellung');
      // Rechnungen in richtigen Antworten müssen stimmen, außer es wird gerade die falsche Rechnung gesucht.
      const falscheGesucht = /falsch|Fehler|stimmt nicht|nicht richtig/i.test(a.text);
      if (o.richtig && !falscheGesucht) for (const g of gleichungenIn(o.text)) if (g.danach !== '?' && !stimmt(g)) melde(a.id, `Gleichung in der richtigen Antwort stimmt nicht: ${g.ganz}`);
      // Wird die falsche Rechnung gesucht, ist genau sie falsch.
      if (falscheGesucht && a.optionen.every((x) => gleichungenIn(x.text).length === 1 && gleichungenIn(x.text)[0].ganz === x.text.replace(EINHEITEN, ''))) {
        if (stimmt(gleichungenIn(o.text)[0]) === o.richtig) melde(a.id, `Option „${o.text}“ ist falsch eingestuft`);
      }
    }
    // Sind alle Antworten reine Rechenausdrücke oder Zahlen, darf keine falsche denselben Wert haben wie die richtige.
    if (!a.mehrfach && a.optionen.every((o) => istAusdruck(o.text)) && !/Rechnung|Rechenweg|Aufgabe|Ausdruck|Term|passt|Klammer|Probe|Überschlag|zeigt|gehört/i.test(a.text)) {
      const r = rechne(a.optionen.find((o) => o.richtig).text);
      for (const o of a.optionen) if (!o.richtig && rechne(o.text) === r) melde(a.id, `falsche Antwort „${o.text}“ hat denselben Wert wie die richtige`);
    }
  } else if (a.format === 'luecken') {
    const namen = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
    if (namen.length === 0) melde(a.id, 'keine Lücke im Text');
    if (new Set(namen).size !== namen.length) melde(a.id, 'Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n], `Lücke ${n}`);
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) melde(a.id, `Lösung ${n} ohne Lücke im Text`);
    if (a.ziffernfelder) for (const l of Object.values(a.luecken ?? {})) if (!ganz(l.loesung, 0, 9)) melde(a.id, 'Ziffernfeld mit mehrstelliger Lösung');
    // Lösungen einsetzen: Jede Gleichung im Text muss dann stimmen. Ausnahme: eine vorgeführte Rechnung, die geprüft werden soll.
    const setze = (anders) => a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => (n === anders ? a.luecken[n].loesung + 1 : a.luecken?.[n]?.loesung ?? '?'));
    const falsche = (text) => text.split('\n').filter((z) => !/rechnet|behauptet|sagt|meint/.test(z)).flatMap(gleichungenIn).filter((g) => !stimmt(g));
    for (const g of falsche(setze(null))) melde(a.id, `mit den Lösungen stimmt die Gleichung nicht: ${g.ganz}`);
    // Eine Lücke, die in keiner Gleichung des Textes steht, muss sich als Ergebnis aus dem Nachweis ergeben (pruefeNachweis).
    a.lueckenOhneGleichung = namen.filter((n) => a.luecken?.[n] && falsche(setze(n)).length === 0);
  } else if (a.format === 'zuordnen') {
    if ((a.paare?.length ?? 0) < 2) melde(a.id, 'zu wenige Paare');
    for (const seite of ['links', 'rechts']) if (new Set(a.paare.map((p) => norm(p[seite]))).size !== a.paare.length) melde(a.id, `Paare ${seite} nicht eindeutig`);
    // Sind beide Seiten Rechenausdrücke oder Zahlen, müssen sie gleich viel wert sein, und kein anderes Paar passt auch.
    if (a.paare.every((p) => istAusdruck(p.links) && istAusdruck(p.rechts)) && a.paare.some((p) => hatZeichen(p.links + p.rechts))) {
      for (const p of a.paare) if (rechne(p.links) !== rechne(p.rechts)) melde(a.id, `Paar „${p.links}“ und „${p.rechts}“ passt nicht zusammen`);
      if (new Set(a.paare.map((p) => rechne(p.rechts))).size !== a.paare.length) melde(a.id, 'zwei Paare haben denselben Wert');
    }
    // Mit Nachweis: Zu jedem Paar gehört eine Rechnung, in der seine Zahlen vorkommen.
    if (a.nachweis && !groessenModus) for (const p of a.paare) {
      const z = zahlenIn(`${p.links} ${p.rechts}`);
      // Ein Nachweis mit eigener Art (Zahlwort, römisch, Zweiersystem) prüft das Paar selbst.
      if (z.length && !a.nachweis.some((n) => (typeof n === 'string' ? z.every((x) => zahlenIn(n).includes(x)) : n?.art && z.every((x) => zahlenImObjekt(n).includes(x))))) melde(a.id, `Paar „${p.links}“ und „${p.rechts}“ steht nicht im Nachweis`);
    }
    for (const p of a.paare) for (const g of gleichungenIn(`${p.links} ${p.rechts}`)) if (!stimmt(g)) melde(a.id, `Gleichung im Paar stimmt nicht: ${g.ganz}`);
  } else if (a.format === 'sachaufgabe') {
    if ((a.teile?.length ?? 0) < 2) melde(a.id, 'Sachaufgabe braucht mindestens zwei Teile');
    for (const t of a.teile ?? []) {
      if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt');
      // Kapitel 6: Ein Teil kann eine Auswahl sein (wichtige Angaben, passende Rechnung, Antwortsatz).
      if (t.optionen || t.art) { if (!groessenModus) melde(a.id, 'Auswahl als Teil gibt es nur in Kapitel 6'); for (const x of teilAuswahlMaengel(t, a.niveau, pool.fehlvorstellungen)) melde(a.id, x); } else pruefeZahl(a.id, t);
    }
    if (!(a.teile ?? []).some((t) => !t.optionen)) melde(a.id, 'Sachaufgabe braucht mindestens einen Teil mit einer Zahl');
  } else if (a.format === 'winkel') {
    // Kapitel 7: Winkeldrehen. Die Lösung ist eine Gradzahl gegen den Uhrzeigersinn.
    pruefeZahl(a.id, a);
    for (const x of winkelfeldMaengel(a, pool.fehlvorstellungen)) melde(a.id, `Winkeldrehen: ${x}`);
  } else if (a.format === 'groesse') {
    for (const x of groesseMaengel(a, pool.fehlvorstellungen)) melde(a.id, x);
  } else if (a.format === 'gitter') {
    // Kapitel 5: Gitterzeichnen. Punkte und Kästchen sind Mengen von Gitterpunkten, eine Linie hat eine Bedingung und ein Beispiel.
    const g = a.gitter, mangel = gitterMangel(g);
    if (mangel) { melde(a.id, `Gitter: ${mangel}`); return; }
    if (a.bild) melde(a.id, 'Gitterzeichnen zeigt schon ein Gitter und braucht kein weiteres Bild');
    for (const f of a.typischeFehler ?? []) if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
    if (a.eingabe === 'linie') {
      if (!['gerade', 'strecke'].includes(a.linie)) melde(a.id, 'Gitter: linie muss gerade oder strecke sein');
      if (!a.bedingung?.art || !Array.isArray(a.beispiel) || a.beispiel.length !== 2 || !a.beispiel.every((q) => imGitter(g, q))) melde(a.id, 'Gitter: Bedingung oder Beispiel fehlt');
      for (const f of a.typischeFehler ?? []) if (!f.bedingung?.art) melde(a.id, 'Gitter: typischer Fehler ohne Bedingung');
    } else if (a.eingabe === 'kreis') {
      for (const x of kreisMaengel(a)) melde(a.id, `Gitter: ${x}`);
    } else if (a.eingabe === 'zellen' && a.bedingung?.art === 'flaeche') {
      // Kapitel 8: Kästchen färben mit Bedingung (Anzahl, Umfang, Rechteck).
      for (const x of zellenMaengel(a, pool.fehlvorstellungen)) melde(a.id, `Gitter: ${x}`);
    } else if (a.eingabe === 'punkte' || a.eingabe === 'zellen') {
      const zellen = a.eingabe === 'zellen', drin = (q) => (zellen ? ganz(q?.[0], 0, g.b - 1) && ganz(q?.[1], 0, g.h - 1) : imGitter(g, q));
      if (!Array.isArray(a.loesung) || a.loesung.length < 1 || a.loesung.length > (zellen ? 40 : 8) || !a.loesung.every(drin)) melde(a.id, 'Gitter: Lösung liegt nicht im Gitter');
      else if (new Set(a.loesung.map(String)).size !== a.loesung.length) melde(a.id, 'Gitter: Punkt in der Lösung doppelt');
      if (zellen && a.loesung.some((q) => (g.zellen ?? []).some((z) => pGleich(q, z)))) melde(a.id, 'Gitter: Ein Kästchen der Lösung ist schon gefärbt');
      for (const f of a.typischeFehler ?? []) if (!Array.isArray(f.punkte) || !f.punkte.every(drin) || mengeGleich(f.punkte, a.loesung ?? [])) melde(a.id, 'Gitter: typischer Fehler liegt außerhalb oder ist gleich der Lösung');
    } else melde(a.id, 'Gitter: eingabe muss punkte, linie, zellen oder kreis sein');
  } else if (a.format === 'zahlenstrahl') {
    pruefeZahl(a.id, a);
    const st = a.strahl ?? {};
    if (!['markieren', 'ablesen'].includes(a.eingabe)) melde(a.id, 'Zahlenstrahl: eingabe muss markieren oder ablesen sein');
    if (!(st.von < st.bis) || !(st.schritt > 0) || (st.bis - st.von) % st.schritt !== 0 || st.beschriftung % st.schritt !== 0) melde(a.id, 'Zahlenstrahl: Einteilung geht nicht auf');
    if ((st.bis - st.von) / st.schritt > 40) melde(a.id, 'Zahlenstrahl: zu viele Teilstriche zum Antippen');
    const aufStrich = (v) => v >= st.von && v <= st.bis && (v - st.von) % st.schritt === 0;
    for (const [was, v] of [['Lösung', a.loesung], ['Start', st.start ?? st.von], ['Pfeil', st.pfeil ?? st.von], ...(st.spruenge ?? []).flatMap((sp) => [['Sprung', sp.von], ['Sprung', sp.nach]])]) {
      if (!aufStrich(v)) melde(a.id, `Zahlenstrahl: ${was} ${v} liegt nicht auf einem Teilstrich`);
    }
    if (a.eingabe === 'ablesen' && st.pfeil !== a.loesung) melde(a.id, 'Zahlenstrahl: Pfeil zeigt nicht auf die Lösung');
    if (a.eingabe === 'markieren' && st.pfeil != null) melde(a.id, 'Zahlenstrahl: Pfeil verrät die Lösung');
    if (a.loesung % st.beschriftung === 0 && a.eingabe === 'ablesen') melde(a.id, 'Zahlenstrahl: Lösung steht als Beschriftung am Strahl');
    for (const sp of st.spruenge ?? []) {
      const m = String(sp.text).match(/^([+−]) (\d+)$/);
      if (!m || sp.von + (m[1] === '+' ? 1 : -1) * Number(m[2]) !== sp.nach) melde(a.id, 'Zahlenstrahl: Sprung passt nicht zu seiner Beschriftung');
      if (a.eingabe === 'markieren' && sp.nach === a.loesung) melde(a.id, 'Zahlenstrahl: Sprung verrät die Lösung');
    }
    if (!a.nachweis) melde(a.id, 'Nachweis fehlt');
  } else if (a.format === 'diagramm') {
    const d = a.diagramm ?? {};
    if (!d.titel || !d.einheit || !(d.max > 0) || !(d.schritt > 0) || d.max % d.schritt !== 0) melde(a.id, 'Diagramm: Titel, Einheit oder Achse fehlt');
    if ((d.saeulen?.length ?? 0) < 2) melde(a.id, 'Diagramm braucht mindestens zwei Säulen');
    // Ablesbar ist ein Wert nur auf einer Linie, einer Hilfslinie oder genau in der Mitte dazwischen.
    const raster = d.werteZeigen ? 1 : d.hilfslinien ? d.schritt / 4 : d.schritt / 2;
    for (const sa of d.saeulen ?? []) if (!(sa.wert > 0) || sa.wert > d.max || sa.wert % raster !== 0) melde(a.id, `Diagramm: Wert ${sa.wert} lässt sich nicht ablesen`);
    if ((a.teile?.length ?? 0) < 1) melde(a.id, 'Diagramm braucht mindestens eine Frage');
    for (const t of a.teile ?? []) { if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt'); pruefeZahl(a.id, t); }
    if (!a.nachweis) melde(a.id, 'Nachweis fehlt');
  } else if (a.format === 'tabelle') {
    const t = a.tabelle ?? {};
    const zellen = (t.zeilen ?? []).flat();
    if (t.art !== 'mauer' && (!t.kopf?.length || (t.zeilen ?? []).some((z) => z.length !== t.kopf.length))) melde(a.id, 'Tabelle: Zeilen passen nicht zur Kopfzeile');
    const namen = [...zellen.filter((c) => typeof c === 'object').map((c) => c.luecke), ...(t.art === 'malkreuz' && t.rechnung?.summe ? [t.rechnung.summe] : []), ...(t.art === 'einheitentafel' && t.ablesen ? [t.ablesen.luecke] : [])];
    if (namen.length === 0) melde(a.id, 'Tabelle ohne Lücke');
    if (new Set(namen).size !== namen.length) melde(a.id, 'Tabelle: Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n], `Lücke ${n}`);
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) melde(a.id, `Lösung ${n} ohne Lücke in der Tabelle`);
    if (t.art === 'einheitentafel') { for (const x of tafelMaengel(a)) melde(a.id, x); }
    else if (t.art === 'umwandeln') { for (const x of umwandelMaengel(a)) melde(a.id, x); }
    else if (t.art === 'stellentafel') {
      // Kapitel 2: ein Feld je Ziffer. Die Zahl selbst prüft der Nachweis `tafel`.
      const basis = (a.nachweis ?? []).find((n) => n?.art === 'tafel')?.basis ?? 10;
      for (const c of zellen) if (typeof c === 'object' ? !ganz(a.luecken?.[c.luecke]?.loesung, 0, basis - 1) : !/^\d?$/.test(c)) melde(a.id, 'Stellenwerttafel: Feld mit mehr als einer Ziffer');
      if (t.gruppen && t.gruppen.reduce((n, g) => n + g.spalten, 0) !== t.kopf.length) melde(a.id, 'Stellenwerttafel: Dreierblöcke passen nicht zu den Spalten');
      const zeilenMitNachweis = new Set((a.nachweis ?? []).filter((n) => n?.art === 'tafel').map((n) => n.zeile ?? 0));
      t.zeilen.forEach((_, i) => { if (!zeilenMitNachweis.has(i)) melde(a.id, `Stellenwerttafel: Zeile ${i + 1} ohne Nachweis`); });
    } else if (t.art === 'raster') (t.rechnung?.zeichen === '·' ? pruefeRasterMal : pruefeRaster)(a);
    else if (t.art === 'mauer') pruefeMauer(a);
    else if (t.art === 'malkreuz') pruefeMalkreuz(a);
    else {
      // Bekannte Tabellenarten zusätzlich nachrechnen.
      const zeichen = t.kopf?.[0];
      for (const zeile of t.zeilen ?? []) zeile.forEach((c, k) => {
        if (typeof c !== 'object') return;
        const l = a.luecken?.[c.luecke]?.loesung, links = zahlAus(String(zeile[0])), oben = zahlAus(String(t.kopf[k]));
        if (zeichen === '+' && links + oben !== l) melde(a.id, 'Additionstabelle falsch');
        if (zeichen === '−' && links - oben !== l) melde(a.id, 'Subtraktionstabelle falsch');
        if (zeichen === '·' && links * oben !== l) melde(a.id, 'Maltabelle falsch');
        if (t.kopf[k] === 'Gesamt' && zeile.slice(1, k).reduce((s, x) => s + zahlAus(String(x)), 0) !== l) melde(a.id, 'Tabelle: Gesamt falsch');
        // Kapitel 1: Eine Zeile „Gesamt“ ist die Summe der Spalte. Eine Zeile mit Namen enthält den abgelesenen Wert.
        const wertIn = (r) => (typeof r[k] === 'object' ? a.luecken?.[r[k].luecke]?.loesung : zahlAus(String(r[k])));
        if (zeile[0] === 'Gesamt' && t.zeilen.filter((r) => r !== zeile).reduce((s, r) => s + wertIn(r), 0) !== l) melde(a.id, 'Tabelle: Zeile Gesamt falsch');
        const abgelesen = (a.nachweis ?? []).filter((n) => n?.art === 'ablesen' && n.name === zeile[0] && !n.spalte);
        if (t.kopf.length === 2 && abgelesen.length === 1 && !abgelesen.some((n) => n.wert === l)) melde(a.id, `Tabelle: bei ${zeile[0]} steht ${l}, abgelesen ist ${abgelesen.map((n) => n.wert).join(' oder ')}`);
        if (t.kopf[k] === 'fehlt bis 1000' && 1000 - links !== l) melde(a.id, 'Tabelle: Ergänzung falsch');
        if (t.kopf[k] === 'a − (b + c)' && Number(zeile[0]) - (Number(zeile[1]) + Number(zeile[2])) !== l) melde(a.id, 'Tabelle: Rechenausdruck falsch');
      });
    }
  } else if (a.format === 'strichliste') {
    // Bündeln: auf F und G von selbst, ab M setzt das Kind den Querstrich selbst (Nils, 2026-11-20).
    if (a.buendeln !== (NIVEAUS.indexOf(a.niveau) <= 1 ? 'auto' : 'selbst')) melde(a.id, `Strichliste: Bündeln muss auf ${a.niveau} ${NIVEAUS.indexOf(a.niveau) <= 1 ? 'auto' : 'selbst'} sein`);
    if (!Array.isArray(a.zeilen) || a.zeilen.length < 2 || a.zeilen.length > 6) { melde(a.id, 'Strichliste: zwei bis sechs Zeilen'); return; }
    if (new Set(a.zeilen.map((z) => z.name)).size !== a.zeilen.length) melde(a.id, 'Strichliste: Name doppelt');
    for (const z of a.zeilen) {
      pruefeZahl(a.id, z, `Zeile ${z.name}`);
      if (!ganz(z.loesung, 1, 40)) melde(a.id, `Strichliste: ${z.loesung} Striche in einer Zeile`);
      if (z.start != null && !ganz(z.start, 1, z.loesung - 1)) melde(a.id, `Strichliste: Start ${z.start} bei ${z.name} passt nicht`);
    }
    // Die Liste der Antworten ergibt mit den schon vorhandenen Strichen genau die Lösung.
    if (a.urliste) {
      const m = datenVon(a, 'urliste');
      for (const x of m.keys()) if (!a.zeilen.some((z) => z.name === x)) melde(a.id, `Strichliste: Antwort ${x} hat keine Zeile`);
      for (const z of a.zeilen) if ((m.get(z.name) ?? 0) + (z.start ?? 0) !== z.loesung) melde(a.id, `Strichliste: ${z.name} hat ${(m.get(z.name) ?? 0) + (z.start ?? 0)} Striche, nicht ${z.loesung}`);
    }
  } else if (a.format === 'zeichnen') {
    const d = a.diagramm ?? {};
    if (!d.titel || !d.einheit || !(d.fein > 0) || !(d.schritt > 0) || d.schritt % d.fein !== 0 || !(d.max > 0) || d.max % d.schritt !== 0) { melde(a.id, 'Zeichnen: Titel, Einheit oder Achse passt nicht'); return; }
    if (d.max / d.fein > 40) melde(a.id, 'Zeichnen: zu viele Linien zum Einrasten');
    if (!Array.isArray(d.saeulen) || d.saeulen.length < 2 || d.saeulen.length > 7) { melde(a.id, 'Zeichnen: zwei bis sieben Säulen'); return; }
    if (!d.saeulen.some((x) => x.offen && x.start !== x.wert)) melde(a.id, 'Zeichnen: keine Säule zu zeichnen');
    if (new Set(d.saeulen.map((x) => x.name)).size !== d.saeulen.length) melde(a.id, 'Zeichnen: Name doppelt');
    for (const x of d.saeulen) {
      // Jede Säule rastet auf einer Linie ein: Lösung und Starthöhe liegen auf dem Raster der Linien.
      if (!ganz(x.wert, d.fein, d.max) || x.wert % d.fein !== 0) melde(a.id, `Zeichnen: Wert ${x.wert} bei ${x.name} liegt nicht auf einer Linie`);
      if (x.start != null && (!ganz(x.start, 0, d.max) || x.start % d.fein !== 0)) melde(a.id, `Zeichnen: Start ${x.start} bei ${x.name} passt nicht`);
      if (x.start != null && !x.offen) melde(a.id, 'Zeichnen: Start bei einer vorgegebenen Säule');
    }
    // Steht eine Tabelle dabei, zeigt das fertige Diagramm genau ihre Werte.
    if (a.daten) {
      const t = datenVon(a, 'daten');
      // Eine Zeile „Gesamt“ und ein „?“ in der Tabelle sind erlaubt.
      const namen = [...t.keys()].filter((x) => x !== 'Gesamt');
      const werte = a.daten.kopf.length === 2; // Bei mehreren Spalten wird gerechnet, nicht abgelesen.
      if (namen.length !== d.saeulen.length || d.saeulen.some((x) => !t.has(x.name) || (werte && t.get(x.name) !== null && t.get(x.name) !== x.wert))) melde(a.id, 'Zeichnen: Säulen passen nicht zur Tabelle');
    }
  } else if (a.format === 'ordnen') {
    // Kapitel 2: Die Karten liegen gemischt da; die Lösung nennt dieselben Karten in der verlangten Reihenfolge.
    if (!Array.isArray(a.karten) || a.karten.length < 3 || a.karten.length > 6 || a.karten.some((k) => typeof k !== 'string' || !k.trim())) { melde(a.id, 'Ordnen: drei bis sechs Karten'); return; }
    if (new Set(a.karten.map(norm)).size !== a.karten.length) melde(a.id, 'Ordnen: Karte doppelt');
    if (!Array.isArray(a.loesung) || !gleich([...a.loesung].sort(), [...a.karten].sort())) melde(a.id, 'Ordnen: Lösung nennt nicht genau die Karten');
    if (gleich(a.loesung, a.karten)) melde(a.id, 'Ordnen: Die Karten liegen schon richtig');
    for (const f of [a.umgekehrt, a.sonst]) if (f && !(f in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${f}`);
    if (!(a.nachweis ?? []).some((n) => n?.art === 'ordnung')) melde(a.id, 'Ordnen: Nachweis der Reihenfolge fehlt');
  } else if (a.format === 'zeichen') {
    // Kapitel 2: römische Zahlzeichen oder Zweiersystem. Die Lösung besteht nur aus den Zeichen der Tasten.
    if (!Array.isArray(a.tasten) || a.tasten.length < 2 || a.tasten.some((t) => typeof t !== 'string' || t.length !== 1)) { melde(a.id, 'Zeichen: Tasten fehlen'); return; }
    const roem = gleich(a.tasten, ['I', 'V', 'X', 'L', 'C', 'D', 'M']), zwei = gleich(a.tasten, ['0', '1']);
    if (!roem && !zwei) melde(a.id, 'Zeichen: Tasten sind weder die römischen Zahlzeichen noch 0 und 1');
    if (typeof a.loesung !== 'string' || !a.loesung || [...a.loesung].some((c) => !a.tasten.includes(c))) melde(a.id, 'Zeichen: Lösung besteht nicht aus den Tasten');
    for (const f of a.typischeFehler ?? []) {
      if (f.wert === a.loesung) melde(a.id, 'typischer Fehler ist gleich der Lösung');
      if (typeof f.wert !== 'string' || [...f.wert].some((c) => !a.tasten.includes(c))) melde(a.id, 'Zeichen: typischer Fehler besteht nicht aus den Tasten');
      if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
    }
    if (!(a.nachweis ?? []).some((n) => n?.art === (roem ? 'roemisch' : 'dual') && (roem ? n.zeichen : n.dual) === a.loesung)) melde(a.id, 'Zeichen: Nachweis zur Lösung fehlt');
  } else if (a.format === 'schaetzen') {
    // Kapitel 2 (Nils, 2026-11-21): ab M zählt der Schätzbereich, ein Fünftel nach oben und nach unten. Auf F und G zählt der Rechenweg.
    // Kapitel 6: Schätzen mit einer Vergleichsgröße im Bild.
    if (a.bild?.art === 'vergleichsbild') { for (const x of schaetzMaengel(a, pool.fehlvorstellungen)) melde(a.id, x); return; }
    if (NIVEAUS.indexOf(a.niveau) < 2) melde(a.id, 'Schätzen mit Schätzbereich gibt es erst ab M');
    if (a.bild?.art !== 'schaetzbild') { melde(a.id, 'Schätzen: Schätzbild fehlt'); return; }
    const n = a.bild.felder.flat().reduce((x, y) => x + y, 0);
    if (a.loesung !== n) melde(a.id, `Schätzen: Auf dem Bild sind ${n}, nicht ${a.loesung}`);
    if (!gleich(a.bereich, [Math.ceil(n * 0.8), Math.floor(n * 1.2)])) melde(a.id, `Schätzen: Schätzbereich ist ${Math.ceil(n * 0.8)} bis ${Math.floor(n * 1.2)}`);
    if (n < 40) melde(a.id, 'Schätzen: zu wenige Symbole, die kann man zählen');
    for (const f of a.typischeFehler ?? []) {
      if (!(f.von <= f.bis) || (f.von <= a.bereich?.[1] && f.bis >= a.bereich?.[0])) melde(a.id, 'Schätzen: typischer Fehler liegt im Schätzbereich');
      if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
    }
    if (!(a.nachweis ?? []).some((x) => x?.art === 'bildwert' && x.was === 'gesamt')) melde(a.id, 'Schätzen: Nachweis der Anzahl fehlt');
  } else melde(a.id, `unbekanntes Format ${a.format}`);
  if (a.daten) {
    const t = a.daten;
    if (!Array.isArray(t.kopf) || t.kopf.length < 2 || !Array.isArray(t.zeilen) || t.zeilen.some((z) => z.length !== t.kopf.length)) melde(a.id, 'Daten: Zeilen passen nicht zur Kopfzeile');
  }
  if (a.urliste && (!Array.isArray(a.urliste) || a.urliste.length < 3 || a.urliste.length > 60)) melde(a.id, 'Urliste: 3 bis 60 Antworten');
}

// Stellenraster: Die Ziffern in den Zeilen und die Lösungsziffern müssen genau die Rechnung ergeben.
function pruefeRaster(a) {
  const t = a.tabelle, r = t.rechnung;
  const m = (text) => melde(a.id, `Raster: ${text}`);
  if (!r || !['+', '−'].includes(r.zeichen) || !Array.isArray(r.zahlen) || r.zahlen.length < 2) { m('Rechnung fehlt'); return; }
  const soll = r.zeichen === '+' ? r.zahlen.reduce((s, x) => s + x, 0) : r.zahlen[0] - r.zahlen.slice(1).reduce((s, x) => s + x, 0);
  if (soll !== r.ergebnis || soll < 0) m(`Ergebnis stimmt nicht (${soll} und ${r.ergebnis})`);
  const stellen = t.kopf.slice(1);
  if (stellen.join('') !== ['T', 'H', 'Z', 'E'].slice(-stellen.length).join('')) m('Kopfzeile ist keine Stellenwerttafel');
  const zahl = (zeile) => Number(zeile.slice(1).map((c) => (c === '' ? '0' : String(c))).join(''));
  const zeilen = t.zeilen.filter((z) => !['getauscht', 'gemerkt', 'Ergebnis'].includes(z[0]));
  if (!gleich(zeilen.map(zahl), r.zahlen)) m('Zeilen zeigen nicht die Zahlen der Rechnung');
  if (zeilen.slice(1).some((z) => z[0] !== r.zeichen) || zeilen[0][0] !== '') m('Rechenzeichen steht falsch');
  for (const z of zeilen) if (/^0\d/.test(z.slice(1).join(''))) m('führende Null');
  const ergebnis = t.zeilen.find((z) => z[0] === 'Ergebnis');
  if (!ergebnis || t.zeilen.at(-1) !== ergebnis) { m('Ergebniszeile fehlt'); return; }
  const ziffern = ergebnis.slice(1).map((c) => a.luecken?.[c.luecke]?.loesung);
  if (Number(ziffern.join('')) !== r.ergebnis || ziffern.some((z) => !ganz(z, 0, 9))) m('Lösungsziffern ergeben nicht das Ergebnis');
  const ziff = (x) => String(x).padStart(stellen.length, '0').split('').map(Number);
  // Hilfszeile „gemerkt“: der Zehner aus der Spalte rechts daneben.
  const gemerkt = t.zeilen.find((z) => z[0] === 'gemerkt');
  if (gemerkt) {
    const soll_ = Array(stellen.length).fill('');
    let u = 0;
    for (let i = stellen.length - 1; i >= 0; i--) { const s = r.zahlen.reduce((x, y) => x + ziff(y)[i], 0) + u; u = Math.floor(s / 10); if (u && i > 0) soll_[i - 1] = u; }
    if (!gleich(gemerkt.slice(1).map(String), soll_.map(String))) m('Zeile „gemerkt“ stimmt nicht');
  }
  // Hilfszeile „getauscht“: Sie hat denselben Wert wie die obere Zahl, und jede Stelle reicht zum Abziehen.
  const getauscht = t.zeilen.find((z) => z[0] === 'getauscht');
  if (getauscht) {
    const oben = getauscht.slice(1).map((c) => (c === '' ? 0 : Number(c))), unten = ziff(r.zahlen[1]);
    if (oben.reduce((s, x, i) => s + x * 10 ** (stellen.length - 1 - i), 0) !== r.zahlen[0]) m('Zeile „getauscht“ hat nicht den Wert der oberen Zahl');
    if (oben.some((x, i) => x < unten[i] || x - unten[i] > 9)) m('Zeile „getauscht“ reicht nicht zum Abziehen');
    if (!gleich(oben.map((x, i) => x - unten[i]), ziffern)) m('Zeile „getauscht“ führt nicht zum Ergebnis');
  }
  if (r.zeichen === '−' && !getauscht && ziff(r.zahlen[0]).some((x, i) => x < ziff(r.zahlen[1])[i])) m('Tausch nötig, aber die Zeile „getauscht“ fehlt');
  if (r.zeichen === '+' && !gemerkt && ziff(r.ergebnis).some((x, i) => r.zahlen.reduce((s, y) => s + ziff(y)[i], 0) !== x)) m('Übertrag nötig, aber die Zeile „gemerkt“ fehlt');
}

// Zahlenmauer: Jeder Stein ist die Summe (das Produkt) der beiden darunter, und die leeren Steine lassen sich eindeutig bestimmen.
function pruefeMauer(a) {
  const t = a.tabelle, m = (text) => melde(a.id, `Zahlenmauer: ${text}`);
  if (!['+', '·'].includes(t.rechenart)) { m('Rechenart fehlt'); return; }
  const z = t.zeilen ?? [];
  if (z.length < 3 || z.length > 4 || z.some((r, i) => r.length !== i + 1)) { m('Steine sind nicht als Mauer angeordnet'); return; }
  const wert = (c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : zahlAus(c));
  const w = z.map((r) => r.map(wert));
  if (w.flat().some((x) => !Number.isInteger(x) || x < 0)) { m('Stein ohne natürliche Zahl'); return; }
  const op = t.rechenart === '·' ? (x, y) => x * y : (x, y) => x + y;
  for (let i = 0; i < z.length - 1; i++) for (let j = 0; j <= i; j++) if (op(w[i + 1][j], w[i + 1][j + 1]) !== w[i][j]) m(`Stein ${w[i][j]} ist nicht ${w[i + 1][j]} ${t.rechenart} ${w[i + 1][j + 1]}`);
  // Eindeutig: Von den bekannten Steinen aus lässt sich jeder leere Stein Schritt für Schritt ausrechnen.
  const bekannt = z.map((r) => r.map((c) => typeof c !== 'object'));
  for (let weiter = true; weiter;) {
    weiter = false;
    for (let i = 0; i < z.length - 1; i++) for (let j = 0; j <= i; j++) {
      const [o, l, r] = [bekannt[i][j], bekannt[i + 1][j], bekannt[i + 1][j + 1]];
      if (!o && l && r) { bekannt[i][j] = true; weiter = true; }
      if (o && l !== r && (t.rechenart === '+' || w[i + 1][l ? j : j + 1] !== 0)) { bekannt[i + 1][j] = bekannt[i + 1][j + 1] = true; weiter = true; }
    }
  }
  if (bekannt.flat().some((x) => !x)) m('die leeren Steine lassen sich nicht eindeutig bestimmen');
}

// Malkreuz: Die Zerlegungen ergeben die Faktoren der Aufgabe, jedes Feld ist sein Teilprodukt, die Summe ist das Produkt.
function pruefeMalkreuz(a) {
  const t = a.tabelle, m = (text) => melde(a.id, `Malkreuz: ${text}`);
  if (t.kopf[0] !== '·') { m('Malzeichen fehlt'); return; }
  const oben = t.kopf.slice(1).map(zahlAus), links = t.zeilen.map((r) => zahlAus(r[0]));
  if ([...oben, ...links].some((x) => !(x > 0))) m('Zerlegung mit 0');
  const [x, y] = t.rechnung?.faktoren ?? [];
  if (links.reduce((s, v) => s + v, 0) !== x || oben.reduce((s, v) => s + v, 0) !== y) m('Zerlegung ergibt nicht die Faktoren');
  if (!norm(a.text).includes(`${x}·${y}`)) m(`${x} · ${y} steht nicht im Text`);
  t.zeilen.forEach((r, i) => r.slice(1).forEach((c, j) => {
    const v = typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : zahlAus(c);
    if (v !== links[i] * oben[j]) m(`Feld ${links[i]} mal ${oben[j]} ist nicht ${v}`);
  }));
  if (a.luecken?.[t.rechnung?.summe]?.loesung !== x * y) m('Summe ist nicht das Produkt');
}

// Rechenraster beim Multiplizieren: oben a · b, je Ziffer von b ein Teilprodukt, das unter dieser Ziffer endet, unten das Ergebnis.
function pruefeRasterMal(a) {
  const t = a.tabelle, r = t.rechnung, m = (text) => melde(a.id, `Raster: ${text}`);
  const [x, y] = r.zahlen ?? [];
  if (!Number.isInteger(x) || !Number.isInteger(y) || r.zahlen.length !== 2) { m('Rechnung fehlt'); return; }
  if (x * y !== r.ergebnis) m(`Ergebnis stimmt nicht (${x * y} und ${r.ergebnis})`);
  const yz = String(y).split('').map(Number), lx = String(x).length, breite = lx + 1 + yz.length;
  if (t.kopf.length !== breite) { m('Raster hat die falsche Breite'); return; }
  if (!gleich(t.zeilen[0], [...String(x).split(''), '·', ...String(y).split('')])) m('erste Zeile zeigt nicht die Aufgabe');
  const ziffer = (c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c === '' ? null : Number(c));
  const liest = (zeile, ende, soll, was) => {
    const z = zeile.map(ziffer), s = String(soll), anfang = ende - s.length + 1;
    if (z.some((v, i) => (i < anfang || i > ende ? v !== null : !ganz(v, 0, 9) || v !== Number(s[i - anfang])))) m(`${was} ${soll} steht nicht richtig im Raster`);
  };
  const soll = yz.length > 1 ? yz.length + 2 : 2;
  if (t.zeilen.length !== soll) { m('falsche Anzahl Zeilen'); return; }
  if (yz.length > 1) {
    if (yz.includes(0)) m('Null im zweiten Faktor');
    yz.forEach((d, i) => liest(t.zeilen[1 + i], lx + 1 + i, x * d, 'Teilprodukt'));
  }
  liest(t.zeilen.at(-1), breite - 1, x * y, 'Ergebnis');
}

// ---------- Durchlauf ----------
const ids = new Set();
const gruppen = new Map();
for (const a of pool.aufgaben.map((x) => ({ ...x }))) {
  if (ids.has(a.id)) melde(a.id, 'ID doppelt');
  ids.add(a.id);
  for (const k of Object.keys(a)) if (!SCHLUESSEL.includes(k)) melde(a.id, `unbekanntes Feld ${k}`);
  if (!lernziele.has(a.lernziel)) melde(a.id, `unbekanntes Lernziel ${a.lernziel}`);
  if (!NIVEAUS.includes(a.niveau)) { melde(a.id, `unbekannte Niveaustufe ${a.niveau}`); continue; }
  if (!FORMATE.includes(a.format)) { melde(a.id, `unbekanntes Format ${a.format}`); continue; }
  if (![1, 2, 3].includes(a.afb)) melde(a.id, `Anforderungsbereich fehlt oder ist ungültig: ${a.afb}`);
  // Prozessbezogene Kompetenz (ADR 0017): eine Haupt- und höchstens eine andere Nebenkompetenz.
  if (!Array.isArray(a.kompetenz) || a.kompetenz.length < 1 || a.kompetenz.length > 2 || a.kompetenz.some((k) => !KOMPETENZEN.includes(k)) || a.kompetenz[0] === a.kompetenz[1]) {
    melde(a.id, `prozessbezogene Kompetenz fehlt oder ist ungültig: ${JSON.stringify(a.kompetenz)}`);
  }
  if (!a.id.startsWith(`${a.lernziel}-${a.niveau}-`)) melde(a.id, 'ID passt nicht zu Lernziel und Niveaustufe');
  if (!a.text?.trim()) { melde(a.id, 'Text fehlt'); continue; }
  if (/undefined|NaN|(?<![A-Za-zäöü])null|\[object/.test(JSON.stringify([sichtbareTexte(a), a.hilfen]))) melde(a.id, 'Text enthält einen Platzhalter (undefined, NaN)');
  if (sichtbareTexte(a).concat(Object.values(a.hilfen ?? {})).some((t) => / {2}|^ | $|\d-\d| - /.test(t))) melde(a.id, 'Text mit doppeltem Leerzeichen oder Bindestrich statt Minuszeichen');
  groessenModus = a.lernziel.startsWith('5.6.') || a.lernziel.startsWith('5.8.');
  const schluessel = `${a.lernziel} ${a.niveau}`;
  if (!gruppen.has(schluessel)) gruppen.set(schluessel, []);
  gruppen.get(schluessel).push(a);
  bruchModus = istBruchLernziel(a.lernziel);
  pruefeHilfen(a);
  pruefeSprache(a);
  if (bruchModus) {
    for (const x of pruefeBruchAufgabe(a, pool.fehlvorstellungen)) melde(a.id, x);
    bruchModus = false;
    if (a.niveau === 'F' && !hatBild(a)) melde(a.id, 'auf F braucht jede Aufgabe ein Bild');
    if (a.niveau === 'F' && a.afb === 3) melde(a.id, 'auf F gibt es keinen Anforderungsbereich III');
    continue;
  }
  pruefeZahlenraum(a);
  pruefeFormat(a);
  pruefeBegriff(a);
  pruefeNachweis(a);
  pruefeBild(a);
  pruefeAblesefrage(a);
  if (a.tippBild && (a.tippBild.art !== 'einheitentafel' || a.niveau !== 'G' || bildMaengel(a.tippBild, a.niveau).length)) melde(a.id, 'Bild im Tipp: nur die Einheitentafel auf G');
  // Kapitel 1 spielt in fünften Klassen: Jede genannte Klasse ist 5a bis 5e.
  if (a.lernziel.startsWith('5.1.')) for (const k of sichtbareTexte(a).join(' ').match(/\b\d+[a-z]\b/g) ?? []) if (!/^5[a-e]$/.test(k)) melde(a.id, `Klasse ${k} gibt es in Klasse 5 nicht`);
  if (a.niveau === 'F' && !hatBild(a)) melde(a.id, 'auf F braucht jede Aufgabe ein Bild');
  if (a.niveau === 'F' && a.afb === 3) melde(a.id, 'auf F gibt es keinen Anforderungsbereich III');
}

groessenModus = false;
// Abdeckung: Jedes Lernziel mit Aufgaben hat auf jeder Niveaustufe genau sechs Aufgaben in der festen Folge der Anforderungsbereiche.
const mitAufgaben = new Set(pool.aufgaben.map((a) => a.lernziel));
for (const l of mitAufgaben) for (const n of NIVEAUS) {
  const gruppe = (gruppen.get(`${l} ${n}`) ?? []).sort((a, b) => a.id.localeCompare(b.id));
  if (gruppe.length !== PRO_GRUPPE) { melde(`${l} ${n}`, `${gruppe.length} Aufgaben statt ${PRO_GRUPPE}`); continue; }
  const folge = gruppe.map((a) => a.afb);
  if (folge.join() !== AFB_FOLGE[n].join()) melde(`${l} ${n}`, `Anforderungsbereiche ${folge.join(', ')} statt ${AFB_FOLGE[n].join(', ')}`);
  const bilder = gruppe.filter(hatBild).length;
  if (bilder < (BILDER_JE_GRUPPE[n] ?? 0)) melde(`${l} ${n}`, `nur ${bilder} Aufgaben mit Bild, nötig sind ${BILDER_JE_GRUPPE[n]}`);
  // Keine zwei Aufgaben einer Gruppe mit demselben Text und denselben Antworten.
  const gesehen = new Set();
  for (const a of gruppe) {
    const k = JSON.stringify([a.text, (a.optionen ?? []).map((o) => o.text).sort(), a.tabelle, a.strahl, a.bild]);
    if (gesehen.has(k)) melde(a.id, 'Aufgabe kommt in der Gruppe doppelt vor');
    gesehen.add(k);
  }
}
// Grundlage: Jedes Lernziel mit Aufgaben nennt den Baustein, den die Förderstufe übt (für den Hinweis im Lehrer-Dashboard).
for (const l of pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele)) if (mitAufgaben.has(l.id) && !l.grundlage) melde(l.id, 'Lernziel ohne Grundlage');
// Wortspeicher: Jede Station mit Aufgaben braucht einen, mit Wörtern mindestens für F, G und M.
for (const k of pool.kapitel) for (const u of k.unterkapitel) if (u.lernziele.some((l) => mitAufgaben.has(l.id))) {
  groessenModus = k.id === '5.6' || k.id === '5.8';
  bruchModus = BRUCHKAPITEL.includes(k.id);
  for (const n of ['F', 'G', 'M']) if (!(u.wortspeicher ?? []).some((w) => w.ab === n && w.wort && w.erklaerung)) melde(u.id, `Wortspeicher ohne Wörter ab Niveaustufe ${n}`);
  for (const w of u.wortspeicher ?? []) {
    if (!NIVEAUS.includes(w.ab)) melde(u.id, `Wortspeicher: unbekannte Stufe bei ${w.wort}`);
    for (const g of gleichungenIn(w.erklaerung)) if (!stimmt(g)) melde(u.id, `Wortspeicher: Gleichung stimmt nicht: ${g.ganz}`);
  }
  for (const text of [...(u.merkzettel?.regeln ?? []), u.merkzettel?.beispiel ?? '']) for (const g of gleichungenIn(text)) if (!stimmt(g)) melde(u.id, `Merkzettel: Gleichung stimmt nicht: ${g.ganz}`);
}
groessenModus = false;
bruchModus = false;
for (const [id, f] of Object.entries(pool.fehlvorstellungen)) if (!f.beschreibung || !f.hinweis || !f.kind) melde(id, 'Fehlvorstellung ohne Beschreibung, Hinweis oder Kindersatz');
// Kindersätze für Aha-Momente (ADR 0017): einfache Sprache, ein Satz, ohne Fachsprache der Lehrkraft.
for (const [id, f] of Object.entries(pool.fehlvorstellungen)) if (f.kind && (!/^Du /.test(f.kind) || /, (der|die|das|den|dem|wenn|weil|dass|ob|obwohl|durch|mit|in|wo)\b|;/.test(f.kind) || f.kind.length > 110)) melde(id, `Kindersatz nicht in einfacher Sprache: ${f.kind}`);
for (const k of Object.keys(pool.kompetenzen ?? {})) if (!KOMPETENZEN.includes(k)) melde(k, 'unbekannte prozessbezogene Kompetenz im Pool');
// Voraussetzungen (ADR 0017): jedes Lernziel hat einen Eintrag, nur bekannte Lernziele, keine Kreise.
const frueher = new Set(vorstufen.flatMap((p) => p.kapitel).flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => l.id));
const vorVon = new Map(pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l.voraussetzungen]));
for (const [id, vor] of vorVon) {
  if (!Array.isArray(vor)) { melde(id, 'Lernziel ohne Voraussetzungen (leere Liste heißt: Grundschulstoff)'); continue; }
  for (const v of vor) if (!vorVon.has(v) && !frueher.has(v)) melde(id, `unbekannte Voraussetzung ${v}`);
  const besucht = new Set(), offen = [...vor];
  while (offen.length) { const v = offen.pop(); if (v === id) { melde(id, 'Voraussetzungen im Kreis'); break; } if (besucht.has(v)) continue; besucht.add(v); offen.push(...(vorVon.get(v) ?? [])); }
}

// Vorstufe (ADR 0037): Kopien von Aufgaben der vorigen Klassenstufe, nur für Brücken. Jede Kopie gleicht der Aufgabe im früheren Pool,
// und jede Voraussetzung aus einer früheren Klassenstufe hat dort Aufgaben auf F, G und M (eine Brücke liegt eine Stufe unter dem Zielniveau).
const fruehereAufgaben = new Map(vorstufen.flatMap((p) => p.aufgaben).map((a) => [a.id, a]));
const kopien = pool.vorstufe?.aufgaben ?? [];
if (new Set(kopien.map((a) => a.id)).size !== kopien.length) melde('vorstufe', 'Aufgabe doppelt');
for (const a of kopien) {
  if (a.niveau === 'E') melde(a.id, 'Vorstufe: Aufgaben auf E braucht keine Brücke');
  if (vorstufen.length && JSON.stringify(fruehereAufgaben.get(a.id)) !== JSON.stringify(a)) melde(a.id, 'Vorstufe: Die Kopie gleicht nicht der Aufgabe im Pool der früheren Klassenstufe (Pool neu erzeugen)');
}
const kopiert = new Set(kopien.map((a) => `${a.lernziel}|${a.niveau}`)), benannt = new Set((pool.vorstufe?.lernziele ?? []).map((l) => l.id));
for (const [id, vor] of vorVon) if (mitAufgaben.has(id)) for (const v of vor ?? []) if (!vorVon.has(v)) {
  if (!benannt.has(v)) melde(id, `Vorstufe: Lernziel ${v} fehlt in der Liste der Vorstufe`);
  for (const n of ['F', 'G', 'M']) if (!kopiert.has(`${v}|${n}`)) melde(id, `Vorstufe: Für die Voraussetzung ${v} fehlen Aufgaben auf ${n}`);
}
for (const l of pool.vorstufe?.lernziele ?? []) if (!l.text || vorVon.has(l.id) || (vorstufen.length && !frueher.has(l.id))) melde(l.id, 'Vorstufe: Lernziel ohne Text oder nicht aus einer früheren Klassenstufe');

return { fehler, mitAufgaben, lernziele, hatBild };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pool = JSON.parse(readFileSync(process.argv[2] ?? 'aufgabenpool/klasse-5.json', 'utf8'));
  // Die Pools der früheren Klassenstufen liegen daneben.
  const vorstufen = [];
  for (let k = 5; k < pool.klassenstufe; k++) if (existsSync(`aufgabenpool/klasse-${k}.json`)) vorstufen.push(JSON.parse(readFileSync(`aufgabenpool/klasse-${k}.json`, 'utf8')));
  const { fehler, mitAufgaben, lernziele, hatBild } = pruefePool(pool, vorstufen);
  if (fehler.length) { console.error(fehler.join('\n')); console.error(`\n${fehler.length} Fehler.`); process.exit(1); }
  const mitNachweis = pool.aufgaben.filter((a) => a.nachweis).length, mitBild = pool.aufgaben.filter(hatBild).length;
  console.log(`In Ordnung: ${pool.aufgaben.length} Aufgaben zu ${mitAufgaben.size} Lernzielen, ${mitNachweis} nachgerechnet, ${mitBild} mit Bild, ${lernziele.size} Lernziele im Jahresplan.`);
}
