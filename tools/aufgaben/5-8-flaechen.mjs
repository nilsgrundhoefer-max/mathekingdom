// Gemeinsame Bausteine für Kapitel 8 „Flächeninhalt und Umfang“ (ADR 0035).
// Figuren bestehen aus Rechtecken [x0, y0, x1, y1] in ganzen Einheiten, die y-Achse zeigt nach oben.
// Grilling mit Nils (2026-11-22): In 8.1 wird in Kästchen gezählt, ab 8.2 ist ein Feld des Rasters 1 cm² (oder 1 m² im Plan).
// Bis G maßstäblich am Raster, ab M Skizzen mit Maßen. Flächen stehen nie mit Komma.

import { B, zz, wahl, mische, fz, suche } from '../werkzeug.mjs';

// Flächeneinheiten in mm², Längeneinheiten in mm.
export const QF = { 'mm²': 1, 'cm²': 100, 'dm²': 10000, 'm²': 1000000, a: 100000000, ha: 10000000000, 'km²': 1000000000000 };
export const LF = { mm: 1, cm: 10, dm: 100, m: 1000, km: 1000000 };
export const QUADRAT = { mm: 'mm²', cm: 'cm²', dm: 'dm²', m: 'm²', km: 'km²' };
// Größe als Text: q(12, 'cm²') wird „12 cm²“, mit geschützter Lücke ab 10 000.
export const q = (n, e) => `${fz(n)} ${e}`;
// Eine Fläche (in mm²) gemischt in zwei Nachbareinheiten: qmix(3250000, 'm²', 'dm²') wird „3 m² 25 dm²“.
export function qmix(w, g, k) {
  const a = Math.floor(w / QF[g]), b = (w % QF[g]) / QF[k];
  return [a ? q(a, g) : null, b ? q(b, k) : null].filter(Boolean).join(' ') || `0 ${k}`;
}
export const lmix = (w, g, k) => { const a = Math.floor(w / LF[g]), b = (w % LF[g]) / LF[k]; return [a ? `${fz(a)} ${g}` : null, b ? `${fz(b)} ${k}` : null].filter(Boolean).join(' '); };

// ---------- Figuren ----------
export const R = (x, y, w, h) => [x, y, x + w, y + h];
const verschiebe = (rechtecke, dx, dy) => rechtecke.map(([a, b, c, d]) => [a + dx, b + dy, c + dx, d + dy]);
export const breite = (rs) => Math.max(...rs.map((r) => r[2])) - Math.min(...rs.map((r) => r[0]));
export const hoehe = (rs) => Math.max(...rs.map((r) => r[3])) - Math.min(...rs.map((r) => r[1]));
export const inhaltVon = (rs, loecher = []) => rs.reduce((s, r) => s + (r[2] - r[0]) * (r[3] - r[1]), 0) - loecher.reduce((s, r) => s + (r[2] - r[0]) * (r[3] - r[1]), 0);
// Formen am Ursprung. L: unten breit, oben links schmal. T: oben breit, unten in der Mitte. U: Boden und zwei Türme. Treppe: drei Stufen.
export const FORMEN = {
  rechteck: ({ w, h }) => [R(0, 0, w, h)],
  L: ({ w1, h1, w2, h2 }) => [R(0, 0, w1, h1), R(0, h1, w2, h2)],
  T: ({ w1, h1, w2, h2, o }) => [R(o, 0, w2, h2), R(0, h2, w1, h1)],
  U: ({ w, h1, p, h2 }) => [R(0, 0, w, h1), R(0, h1, p, h2), R(w - p, h1, p, h2)],
  treppe: ({ s, h }) => [R(0, 0, 3 * s, h), R(0, h, 2 * s, h), R(0, 2 * h, s, h)],
};
// Zufällige Formen in Kästchen. groesse 1 (klein) bis 3 (groß).
export function form(art, groesse = 1) {
  const g = groesse;
  switch (art) {
    case 'rechteck': return { art, rechtecke: FORMEN.rechteck({ w: zz(2, 3 + 2 * g), h: zz(2, 2 + g) }) };
    case 'L': { const w1 = zz(3, 3 + 2 * g), w2 = zz(1, w1 - 2); return { art, rechtecke: FORMEN.L({ w1, h1: zz(1, 1 + g), w2, h2: zz(1, 1 + g) }) }; }
    case 'T': { const w1 = zz(4, 4 + 2 * g), w2 = zz(1, w1 - 2), o = zz(1, w1 - w2 - 1); return { art, rechtecke: FORMEN.T({ w1, h1: zz(1, 1 + g), w2, h2: zz(1, 1 + g), o }) }; }
    case 'U': { const p = zz(1, 1 + Math.floor(g / 2)), w = 2 * p + zz(1, 1 + g); return { art, rechtecke: FORMEN.U({ w, h1: zz(1, 1 + g), p, h2: zz(1, 1 + g) }) }; }
    case 'treppe': return { art, rechtecke: FORMEN.treppe({ s: zz(1, 1 + Math.floor(g / 2)), h: zz(1, 1 + Math.floor(g / 2)) }) };
    default: throw new Error(art);
  }
}
// Figuren nebeneinander auf ein Raster setzen: ein Feld Rand, zwei Felder Abstand. Liefert { b, h, figuren } oder null, wenn es nicht passt.
export function setze(formen, { maxB = 16, maxH = 10, namen = null, zerlegt = false } = {}) {
  const b = formen.reduce((s, f) => s + breite(f.rechtecke), 0) + 2 * (formen.length - 1) + 2;
  const h = Math.max(...formen.map((f) => hoehe(f.rechtecke))) + 2;
  if (b > maxB || h > maxH || b < 4 || h < 3) return null;
  let x = 1;
  const figuren = formen.map((f, i) => {
    const dx = x - Math.min(...f.rechtecke.map((r) => r[0])), dy = 1 - Math.min(...f.rechtecke.map((r) => r[1]));
    x += breite(f.rechtecke) + 2;
    return { ...(namen ? { n: namen[i] } : {}), rechtecke: verschiebe(f.rechtecke, dx, dy), ...(f.loecher ? { loecher: verschiebe(f.loecher, dx, dy) } : {}), ...(zerlegt || f.zerlegt ? { zerlegt: true } : {}) };
  });
  return { b: Math.max(b, 4), h: Math.max(h, 3), figuren };
}
// Ein Raster-Bild: art 'kaestchen' (8.1), 'cm' (Zentimeterraster) oder 'm' (Plan).
export function rasterBild(art, gesetzt, masse = null, legende = null) {
  return B.flaeche({ raster: art, einheit: art, b: gesetzt.b, h: gesetzt.h, figuren: gesetzt.figuren, ...(masse ? { masse } : {}), ...(legende ? { legende } : {}) });
}
export const skizze = (einheit, figuren, masse) => B.flaeche({ einheit, skizze: true, figuren, masse });
// Maße an einem Rechteck: unten (Länge) und links (Breite).
export const unten = ([x0, y0, x1], extra = {}) => ({ p: [x0, y0], q: [x1, y0], ...extra });
export const links = ([x0, y0, , y1], extra = {}) => ({ p: [x0, y0], q: [x0, y1], ...extra });
export const rechts = ([, y0, x1, y1], extra = {}) => ({ p: [x1, y0], q: [x1, y1], ...extra });
export const oben = ([x0, , x1, y1], extra = {}) => ({ p: [x0, y1], q: [x1, y1], ...extra });

// ---------- Nachweis ----------
// Der Prüfer rechnet Flächeninhalt und Umfang der Figur im Bild selbst nach (tools/pruefe-flaechen.mjs).
export const NF = (was, groesse, figur) => ({ art: 'flaeche', was, groesse: String(groesse), ...(figur ? { figur } : {}) });
// Randstücke einer Figur aus Rechtecken: für Rechnungen wie „4 + 2 + 2 + 3 + 2 + 5 = 18“.
export function randStuecke(rs) {
  const xs = [...new Set(rs.flatMap((r) => [r[0], r[2]]))].sort((a, b) => a - b), ys = [...new Set(rs.flatMap((r) => [r[1], r[3]]))].sort((a, b) => a - b);
  const drin = (x, y) => rs.some((r) => x > r[0] && x < r[2] && y > r[1] && y < r[3]);
  const voll = (i, j) => i >= 0 && j >= 0 && i < xs.length - 1 && j < ys.length - 1 && drin((xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2);
  const stuecke = [];
  for (let j = 0; j < ys.length; j++) { let start = null, seite = 0;
    for (let i = 0; i <= xs.length - 1; i++) { const k = i < xs.length - 1 ? voll(i, j) - voll(i, j - 1) : 0;
      if (k && k === seite) continue;
      if (start !== null) stuecke.push(xs[i] - start);
      start = k ? xs[i] : null; seite = k; } }
  for (let i = 0; i < xs.length; i++) { let start = null, seite = 0;
    for (let j = 0; j <= ys.length - 1; j++) { const k = j < ys.length - 1 ? voll(i, j) - voll(i - 1, j) : 0;
      if (k && k === seite) continue;
      if (start !== null) stuecke.push(ys[j] - start);
      start = k ? ys[j] : null; seite = k; } }
  return stuecke;
}
export const umfangVon = (rs, loecher = []) => [...randStuecke(rs), ...loecher.flatMap((l) => [l[2] - l[0], l[3] - l[1], l[2] - l[0], l[3] - l[1]])].reduce((s, x) => s + x, 0);
// Kästchen eines Rechtecks im Gitter (linke untere Ecken), für das Beispiel beim Färben.
export const zellenVon = (x, y, w, h) => Array.from({ length: w * h }, (_, i) => [x + (i % w), y + Math.floor(i / w)]);
export { zz, wahl, mische, fz, suche };
