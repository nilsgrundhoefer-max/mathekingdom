// Gemeinsame Bausteine der Erzeuger zu Kapitel 5 „Geometrische Grundbegriffe und ebene Figuren“ (ADR 0032).
// Punkte sind [x, y] in Kästchen, die y-Achse zeigt nach oben. 2 Kästchen sind 1 cm, 1 Kästchen sind 5 mm.
import { zz, wahl, mische, suche, GT, PT, LN, FG } from '../werkzeug.mjs';

export const plus = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
export const minus = (p, q) => [p[0] - q[0], p[1] - q[1]];
export const senk = (v) => [-v[1], v[0]];
export const gleichP = (p, q) => p[0] === q[0] && p[1] === q[1];
export const drin = (b, h, ...punkte) => punkte.every((p) => p[0] >= 0 && p[1] >= 0 && p[0] <= b && p[1] <= h);
export const WAAGERECHT = [1, 0], LOTRECHT = [0, 1];
export const DIAGONAL = [[1, 1], [1, -1]];
export const SCHRAEG = [[2, 1], [1, 2], [2, -1], [1, -2], [3, 1], [1, 3], [3, -1], [1, -3]];
export const kreuzP = (u, v) => u[0] * v[1] - u[1] * v[0];
export const skalarP = (u, v) => u[0] * v[0] + u[1] * v[1];
export const aufGerade = (p, a, b) => kreuzP(minus(b, a), minus(p, a)) === 0;
// Eine Linie mit Richtung v über n Schritte, die ganz im Gitter liegt. `passt` prüft den Startpunkt zusätzlich.
export function linie(name, b, h, v, n, art = 'gerade', passt = () => true) {
  const a = suche(() => [zz(0, b), zz(0, h)], (p) => drin(b, h, p, plus(p, v, n)) && passt(p, plus(p, v, n)));
  return LN(name, a, plus(a, v, n), art);
}
// Spiegeln an einer Achse (waagerecht, lotrecht oder diagonal) und an einem Punkt.
export const spiegleX = (p, x0) => [2 * x0 - p[0], p[1]];
export const spiegleY = (p, y0) => [p[0], 2 * y0 - p[1]];
export const spieglePunkt = (p, z) => [2 * z[0] - p[0], 2 * z[1] - p[1]];
// An der Achse durch a mit Richtung (1, 1) oder (1, −1).
export const spiegleDiag = (p, a, steigt) => (steigt ? [a[0] + (p[1] - a[1]), a[1] + (p[0] - a[0])] : [a[0] - (p[1] - a[1]), a[1] - (p[0] - a[0])]);
export const cm = (kaestchen) => kaestchen / 2;
export const mm = (kaestchen) => kaestchen * 5;
// Länge in Worten ohne Kommazahl: 43 mm sind „4 cm 3 mm“.
export const cmmm = (millimeter) => (millimeter % 10 === 0 ? `${millimeter / 10} cm` : millimeter < 10 ? `${millimeter} mm` : `${Math.floor(millimeter / 10)} cm ${millimeter % 10} mm`);
export const NAMEN = ['A', 'B', 'C', 'D', 'E'];
// Verschiebt alle Punkte einer Liste von Ecken.
export const schiebe = (ecken, v) => ecken.map((e) => plus(e, v));
// Eine Linie g mit Richtung v und kurze Strecken a, b, c …, die g in Gitterpunkten kreuzen. richtungen: je Strecke ihre Richtung.
// Die Kreuzungspunkte liegen `weit` Schritte von v auseinander, damit sich die Strecken nicht berühren.
export function kreuzBild(v, richtungen, { b = 12, h = 8, weit = Math.abs(v[0]) + Math.abs(v[1]) > 2 ? 2 : 3, artG = 'gerade', nameG = 'g', namen = 'abcd', halb = null } = {}) {
  const n = richtungen.length, k = (r) => halb ?? (Math.max(Math.abs(r[0]), Math.abs(r[1])) > 1 ? 1 : r[0] && r[1] ? 1 : 2);
  const bau = (start) => richtungen.map((r, i) => { const s = plus(start, v, i * weit); return { s, a: plus(s, r, -k(r)), e: plus(s, r, k(r)) }; });
  const start = suche(() => [zz(0, b), zz(0, h)], (p) => { const t = bau(p); return drin(b, h, ...t.flatMap((x) => [x.a, x.e])) && drin(b - 1, h - 1, ...t.map((x) => x.s)) && t.every((x) => x.s[0] >= 1 && x.s[1] >= 1)
    && t.every((x, i) => t.every((y, j) => i >= j || ![x.a, x.e].some((q) => aufStrecke(q, y.a, y.e)) && ![y.a, y.e].some((q) => aufStrecke(q, x.a, x.e)))); });
  const teile = bau(start), strecken = teile.map((x, i) => LN(namen[i], x.a, x.e, 'strecke'));
  const linien = [LN(nameG, start, plus(start, v, artG === 'gerade' ? 1 : (n - 1) * weit + 1), artG), ...strecken];
  return { g: GT(b, h, { linien }), linien: strecken, punkte: teile.map((x) => x.s), start };
}
// Schneiden oder berühren sich zwei Strecken?
const seite = (a, b, p) => Math.sign(kreuzP(minus(b, a), minus(p, a)));
export const schneiden = (a, b, c, d) => { const s1 = seite(a, b, c), s2 = seite(a, b, d), s3 = seite(c, d, a), s4 = seite(c, d, b);
  if (s1 !== s2 && s3 !== s4) return true;
  return [[a, b, c], [a, b, d], [c, d, a], [c, d, b]].some(([x, y, p]) => aufStrecke(p, x, y)); };
// Eine Linie g mit Richtung v (Gerade, oder Strecke mit `langG` Schritten) und Strecken a, b, c …, die g nicht berühren. richtungen: je Strecke [Richtung, Schritte].
export function streckenBild(v, richtungen, { b = 12, h = 8, langG = 0, nameG = 'g', namen = 'abcd' } = {}) {
  const x = suche(() => ({ a: [zz(0, b), zz(0, h)], teile: richtungen.map(([r, n]) => { const p = [zz(0, b), zz(0, h)]; return [p, plus(p, r, n)]; }) }), ({ a, teile }) => {
    const e = plus(a, v, langG || 1);
    if (!drin(b, h, a, e, ...teile.flat()) || (!langG && !drin(b - 1, h - 1, a) )) return false;
    // Abstand halten: Jede Strecke liegt ganz auf einer Seite von g, mindestens 1 Kästchen entfernt, und die Strecken kommen sich nicht nahe.
    const fern = (p) => kreuzP(v, minus(p, a)) ** 2 >= skalarP(v, v);
    if (!teile.every(([p, q]) => fern(p) && fern(q) && seite(a, e, p) === seite(a, e, q))) return false;
    const dick = ([p, q]) => [p, q, plus(p, [1, 0]), plus(p, [0, 1]), plus(q, [1, 0]), plus(q, [0, 1]), plus(p, [-1, 0]), plus(p, [0, -1]), plus(q, [-1, 0]), plus(q, [0, -1])];
    return teile.every((t, i) => teile.every((u, j) => i >= j || (!schneiden(...t, ...u) && !dick(t).some((p) => aufStrecke(p, ...u)) && !dick(u).some((p) => aufStrecke(p, ...t)) && !(kreuzP(minus(t[1], t[0]), minus(u[1], u[0])) === 0 && aufGerade(u[0], ...t)))));
  });
  const strecken = x.teile.map(([p, q], i) => LN(namen[i], p, q, 'strecke'));
  return { g: GT(b, h, { linien: [LN(nameG, x.a, plus(x.a, v, langG || 1), langG ? 'strecke' : 'gerade'), ...strecken] }), linien: strecken, a: x.a };
}
export const aufStrecke = (p, a, b) => aufGerade(p, a, b) && skalarP(minus(p, a), minus(p, b)) <= 0;
// Länge in mm als Rechnung für den Nachweis: 45 mm aus „4 cm 5 mm“.
export const mmRechnung = (l) => (l % 10 ? (l < 10 ? null : `${Math.floor(l / 10)} · 10 + ${l % 10}`) : `${l / 10} · 10`);
// Rechtwinklige Dreiecke mit ganzen Millimetern (für Heftaufgaben mit Kontrollwert).
export const DREIECKE = [[30, 40, 50], [60, 80, 100], [45, 60, 75], [50, 120, 130], [90, 120, 150], [75, 100, 125], [80, 60, 100], [40, 30, 50], [120, 50, 130], [60, 45, 75], [35, 120, 125], [120, 90, 150]];
export { zz, wahl, mische, suche, GT, PT, LN, FG };
