// Gemeinsame Bausteine für Klasse 6, Kapitel 6 „Berechnungen am Quader“ (ADR 0049).
// Grilling mit Nils (2026-11-25): F ganze Kanten bis 10 in einer Einheit, G ganze Kanten bis 20, auch dm und m,
// M Kanten mit einer Kommastelle und gemischte Einheiten, E Umkehraufgaben, Verdoppeln, Optimieren, Fehlersuche.
// Die Kanten heißen a, b, c (Länge, Breite, Höhe), dazu O und V. Kein Hochzeichen außer in cm² und cm³: V = a · a · a.
// Auf F steht die Einheit fest hinter dem Feld, ab G wählt das Kind sie aus einer Liste. Nirgends wird gerundet.
// Gerechnet wird mit ganzen Zahlen: Jede Länge in Millimetern, jede Fläche in mm², jedes Volumen in mm³.

import { zz, wahl, mische, suche, Z, opt, auswahl, luecken, tabelle, L, groesse as groesseRoh, einheitentafel, ordnen, B, kind, zweiKinder } from '../werkzeug.mjs';
import { schreibe, EINHEITEN } from '../../src/schueler/groessen.js';
import { H, zahl, lk, bildkarten, bau, ausTuermen, zufallsBau, ansicht, verdeckteWuerfel, ohneUndefined } from './6-3-koerper.mjs';
import { FREI } from './5-9-brueche.mjs';

export { zz, wahl, mische, suche, Z, opt, auswahl, luecken, tabelle, L, einheitentafel, ordnen, B, kind, zweiKinder, H, zahl, lk, bildkarten, bau, ausTuermen, zufallsBau, ansicht, verdeckteWuerfel, ohneUndefined, FREI };

// ---------- Größen ----------
export const LF = { mm: 1, cm: 10, dm: 100, m: 1000 };
// n (ganze Zahl oder Zehntel mit zehntel = true) in der Einheit e als Millimeter.
export const mm = (n, e, zehntel = false) => (zehntel ? (n * LF[e]) / 10 : n * LF[e]);
// Text einer Größe aus ihrem Wert in der Grundeinheit: T(40000, 'cm³') ist „40 cm³“, T(25, 'cm') ist „2,5 cm“.
export const T = (wert, einheit) => schreibe(wert, einheit, true);
export const faktor = (einheit) => EINHEITEN[einheit][1];
// Nur die Maßzahl (für Tabellen, in denen die Einheit im Kopf steht).
export const mz = (wert, einheit) => T(wert, einheit).replace(new RegExp(` ${einheit}$`), '');
// Quader mit den Kanten a, b, c in Millimetern: Flächen, Oberfläche und Volumen.
export const Q = (a, b, c) => ({ ab: a * b, ac: a * c, bc: b * c, O: 2 * (a * b + a * c + b * c), V: a * b * c });
// Geht der Wert in der Einheit mit höchstens `stellen` Stellen nach dem Komma auf?
export const gehtAuf = (wert, einheit, stellen = 3) => Number.isInteger((wert * 10 ** stellen) / faktor(einheit));
// Einheiten zur Auswahl ab G: Länge, Fläche und Volumen derselben Grundeinheit.
export const EW = (e) => [e, `${e}²`, `${e}³`];

// Größe eingeben. fehler: [[wert in der Grundeinheit, fehlvorstellung]]. extra: { einheiten, verlangt, bild, nachweis }
export const groesse = (text, art, wert, einheit, fehler, hilfen, extra) => groesseRoh(text, art, wert, einheit, (fehler ?? []).filter(([w]) => Number.isInteger(w)), hilfen, extra);
export const volumen = (text, wert, einheit, fehler, hilfen, extra) => groesse(text, 'volumen', wert, einheit, fehler, hilfen, extra);
export const flaeche = (text, wert, einheit, fehler, hilfen, extra) => groesse(text, 'flaeche', wert, einheit, fehler, hilfen, extra);
export const laenge = (text, wert, einheit, fehler, hilfen, extra) => groesse(text, 'laenge', wert, einheit, fehler, hilfen, extra);

// ---------- Nachweise (tools/pruefe-quader.mjs rechnet sie unabhängig nach) ----------
// Ein Quader aus dem Text: kanten als Größentexte, was: 'volumen' | 'oberflaeche', wert als Größentext.
export const QN = (kanten, was, wert) => ({ art: 'quader', kanten, was, wert });
// Was das Bild zeigt: 'volumen', 'oberflaeche' (Quader, Körper aus Quadern), 'wuerfel' (Anzahl), 'aussen' (Quadrate außen am Würfelbau).
export const BN = (was, wert, extra = {}) => ({ art: 'bild', was, wert, ...extra });
// Mit { nicht: true } ist die Antwort richtig, deren Wert anders ist.
export const WERT = (wert, extra = {}) => ({ art: 'wert', wert, ...extra });
export const URTEIL = (stimmt) => ({ art: 'urteil', stimmt });
// Vergleich zweier Ergebnisse: wenn = { groesser, kleiner, gleich } nennt die Antwort für links > rechts, links < rechts und links = rechts.
export const VGL = (links, rechts, wenn) => ({ art: 'vergleich', links, rechts, wenn });
export const EXTREM = (was) => ({ art: 'extrem', was });
export const ART = (groessenart) => ({ art: 'einheitenart', groesse: groessenart });
export const HG = (wert, grund) => ({ wert, grund });

// ---------- Bilder ----------
// Quader im Schrägbild mit Maßen. Die Kanten in Millimetern, e ist die Einheit der Beschriftung.
export const quaderBild = (a, b, c, e, o = {}) => ohneUndefined({ art: 'koerper', form: 'quader', a: a / LF[e], b: b / LF[e], c: c / LF[e],
  masse: a === b && b === c ? [{ von: 'A', bis: 'B', t: T(a, e) }] : [{ von: 'A', bis: 'B', t: T(a, e) }, { von: 'B', bis: 'C', t: T(b, e) }, { von: 'A', bis: 'E', t: T(c, e) }], ...o });
// Ein Teil eines Körpers aus Quadern: Ecke vorn links unten (x, y, z), Kanten a, b, c, alles in der Einheit des Bildes.
export const TL = (x, y, z, a, b, c) => ({ x, y, z, a, b, c });
export const MS = (von, bis, t, seite) => ({ von, bis, t, ...(seite ? { seite } : {}) });
export const bauBild = (teile, e, o = {}) => ohneUndefined({ art: 'koerper', form: 'quaderbau', einheit: e, teile, ...o });
// Quader mit sichtbaren Einheitswürfeln (a, b, c ganze Zahlen in der Einheit e).
export const rasterBild = (a, b, c, e, masse = true) => bauBild([TL(0, 0, 0, a, b, c)], e, { raster: true,
  ...(masse ? { masse: [MS([0, 0, 0], [a, 0, 0], `${a} ${e}`), MS([a, 0, 0], [a, b, 0], `${b} ${e}`), MS([0, 0, 0], [0, 0, c], `${c} ${e}`)] } : {}) });
// Netz eines Quaders (Kästchen = Einheit e) mit den drei Flächenpaaren in drei Farben und den Maßen.
export function netzBild(a, b, c, e, { werte = false } = {}) {
  const r = (x, y, w, h, farbe, n) => ({ ecken: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], farbe, ...(n != null ? { n } : {}) });
  const n = (f) => (werte ? String(f) : null);
  return { art: 'netz', flaechen: [r(c, c, a, b, 'grund', n(a * b)), r(c, 0, a, c, 1, n(a * c)), r(c, c + b, a, c, 1, n(a * c)), r(0, c, c, b, 2, n(b * c)), r(c + a, c, c, b, 2, n(b * c)), r(c, c + b + c, a, b, 'grund', n(a * b))],
    ...(werte ? {} : { masse: [{ von: [c, 0], bis: [c + a, 0], t: `${a} ${e}` }, { von: [c + a + c, c], bis: [c + a + c, c + b], t: `${b} ${e}` }, { von: [c, 0], bis: [c, c], t: `${c} ${e}` }] }), einheit: e };
}
// Körper aus zwei Quadern: unten A (a × b × c1), darauf links B (a2 × b × c2). Maße in ganzen Einheiten oder Zehnteln als Zahl.
// art: 'zerlegt' (F, G: zwei Farben, alle Maße), 'ganz' (M: Gesamthöhe statt der Höhe von B).
export function stufenKoerper(a, b, c1, a2, c2, e, art, t = (x) => `${String(x).replace('.', ',')} ${e}`) {
  const teile = [TL(0, 0, 0, a, b, c1), TL(0, 0, c1, a2, b, c2)], h = c1 + c2;
  const fest = [MS([0, 0, 0], [a, 0, 0], t(a)), MS([0, 0, h], [0, b, h], t(b), 'schraeg-links'), MS([a, b, 0], [a, b, c1], t(c1), 'rechts'), MS([0, 0, h], [a2, 0, h], t(a2), 'unten')];
  const masse = art === 'ganz' ? [...fest, MS([0, 0, 0], [0, 0, h], t(Math.round(h * 10) / 10), 'links')] : [...fest, MS([0, 0, c1], [0, 0, h], t(c2), 'links')];
  return bauBild(teile, e, { ...(art === 'zerlegt' ? { zerlegt: true } : {}), masse });
}
// Würfelbau als voller Quader aus Einheitswürfeln.
export const vollerQuader = (a, b, c) => { const w = []; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) w.push([x, y, z]); return w; };
// Quadrate außen an einem Würfelbau (auch unten).
export function aussenflaechen(w) {
  const s = new Set(w.map((p) => p.join(',')));
  let n = 0;
  for (const [x, y, z] of w) for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) if (!s.has([x + dx, y + dy, z + dz].join(','))) n++;
  return n;
}
// Oberfläche und Volumen eines Körpers aus Quadern (Teile wie TL, überschneidungsfrei), in Einheiten des Bildes.
export function bauWerte(teile) {
  const schn = (von, lang) => [...new Set(teile.flatMap((t) => [t[von], t[von] + t[lang]]))].sort((p, q) => p - q);
  const xs = schn('x', 'a'), ys = schn('y', 'b'), zs = schn('z', 'c');
  const voll = (i, j, k) => i >= 0 && j >= 0 && k >= 0 && i < xs.length - 1 && j < ys.length - 1 && k < zs.length - 1
    && teile.some((t) => (xs[i] + xs[i + 1]) / 2 > t.x && (xs[i] + xs[i + 1]) / 2 < t.x + t.a && (ys[j] + ys[j + 1]) / 2 > t.y && (ys[j] + ys[j + 1]) / 2 < t.y + t.b && (zs[k] + zs[k + 1]) / 2 > t.z && (zs[k] + zs[k + 1]) / 2 < t.z + t.c);
  let V = 0, O = 0;
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) for (let k = 0; k < zs.length - 1; k++) {
    if (!voll(i, j, k)) continue;
    const dx = xs[i + 1] - xs[i], dy = ys[j + 1] - ys[j], dz = zs[k + 1] - zs[k];
    V += dx * dy * dz;
    if (!voll(i - 1, j, k)) O += dy * dz; if (!voll(i + 1, j, k)) O += dy * dz;
    if (!voll(i, j - 1, k)) O += dx * dz; if (!voll(i, j + 1, k)) O += dx * dz;
    if (!voll(i, j, k - 1)) O += dx * dy; if (!voll(i, j, k + 1)) O += dx * dy;
  }
  return { V, O };
}
// Drei ganze Kanten von `von` bis `bis`, nicht alle gleich, die längste zuerst.
export const kanten = (von, bis) => suche(() => [zz(von, bis), zz(von, bis), zz(von, bis)].sort((x, y) => y - x), ([a, b, c]) => !(a === b && b === c) && a >= b + 1);
// Kontexte: Gegenstände in Quaderform mit passender Einheit.
export const DINGE_CM = ['Schachtel', 'Dose', 'Kiste', 'Packung'];

// ---------- Weitere Nachweise ----------
// Bildkarten: Welche Karte ist richtig? regel 'max', 'min' oder 'gleich' (mit wert) für was = 'wuerfel' oder 'aussen'.
export const KN = (was, regel, wert) => ({ art: 'karten', was, regel, ...(wert != null ? { wert } : {}) });
// Zeile einer Einheitentafel zum Eintragen.
export const TAFEL = (groesseText, zeile = 0) => ({ art: 'einheitentafel', zeile, groesse: groesseText });
// Ordnen: 'auf' beginnt mit der kleinsten Angabe.
export const ORD = (richtung = 'auf') => ({ art: 'ordnen', richtung });

// ---------- Einheitentafel für Volumen: drei Spalten je Einheit ----------
export const VTAFEL = { 'm³-dm³': ['m³', 'dm³'], 'dm³-cm³': ['dm³', 'cm³'], 'cm³-mm³': ['cm³', 'mm³'], 'l-ml': ['l', 'ml'] };
const tafelKopf = ['H', 'Z', 'E', 'H', 'Z', 'E'];
const tafelGruppen = (name) => VTAFEL[name].map((e) => [e, 3]);
// Ziffern eines Volumens (mm³) für die Tafel: führende Felder bleiben leer.
export function tafelZiffern(name, wert) {
  const text = String(wert / faktor(VTAFEL[name][1])).padStart(6, ' ');
  if (text.length > 6 || !/^ *\d+$/.test(text)) throw new Error(`passt nicht in die Tafel ${name}: ${wert}`);
  return [...text].map((c) => (c === ' ' ? null : Number(c)));
}
export const tafelBild = (name, wert) => B.etafel(tafelGruppen(name), tafelKopf, tafelZiffern(name, wert));
// Tafel zum Eintragen mit Ablesen in der kleinen Einheit.
export function tafelAufgabe(text, name, wert, fehler, hilfen) {
  const werte = {}, klein = VTAFEL[name][1], n = wert / faktor(klein);
  const zeile = tafelZiffern(name, wert).map((x, i) => { if (x == null) return ''; werte[`z${i}`] = x; return L(`z${i}`); });
  return einheitentafel(text, tafelGruppen(name), tafelKopf, [zeile], { ...werte, x: lk(n, fehler) }, hilfen, { nachweis: [TAFEL(T(wert, VTAFEL[name][0]))] }, { text: 'Das sind', luecke: 'x', einheit: klein });
}
// Zahl mit Gliederung wie im Text (ab 10 000 mit geschütztem Leerzeichen).
export const N = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
