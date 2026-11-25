// Gemeinsame Bausteine der Erzeuger zu Klasse 7, Kapitel 2 „Dreiecke“ (ADR 0044).
// Eine Figur ist maßstabsgetreu: Die Erzeuger rechnen die Ecken aus Winkeln und Seiten aus, das Dashboard zeichnet sie nur verkleinert.
// Koordinaten in Zentimetern, y nach oben. Winkel in Grad. Ecken eines Dreiecks heißen gegen den Uhrzeigersinn A, B, C,
// die Seite a liegt A gegenüber, der Winkel α liegt bei A (Grilling mit Nils, 2026-11-25).
import { zz, wahl, mische, suche, B, GT, PT, LN, FG } from '../werkzeug.mjs';

export { zz, wahl, mische, suche, GT, PT, LN, FG };
export const GRIECH = { A: 'α', B: 'β', C: 'γ' };
export const SEITE = { A: 'a', B: 'b', C: 'c' };
const rad = (g) => (g * Math.PI) / 180;
const RZ = (x) => Math.round(x * 1000) / 1000;
export const dir = (g) => [Math.cos(rad(g)), Math.sin(rad(g))];
export const plus = (p, v, k = 1) => [RZ(p[0] + k * v[0]), RZ(p[1] + k * v[1])];
export const abstand = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
export const mitte = (p, q) => [RZ((p[0] + q[0]) / 2), RZ((p[1] + q[1]) / 2)];
const drehe = (p, g, um = [0, 0]) => { const c = Math.cos(rad(g)), s = Math.sin(rad(g)), x = p[0] - um[0], y = p[1] - um[1]; return [RZ(um[0] + c * x - s * y), RZ(um[1] + s * x + c * y)]; };
export const gradZahl = (x) => `${x}°`;
export const cm = (x) => `${String(x).replace('.', ',')} cm`;

// Ein Dreieck aus der Seite c = AB und den Winkeln α und β (wsw). Gedreht um `dreh` Grad um A.
export function dreieckWsw(c, alpha, beta, dreh = 0) {
  const gamma = 180 - alpha - beta, b = (c * Math.sin(rad(beta))) / Math.sin(rad(gamma));
  const A = [0, 0], Bp = [c, 0], C = plus(A, dir(alpha), b);
  return { A, B: drehe(Bp, dreh), C: drehe(C, dreh) };
}
// Ein Dreieck aus b, c und α (sws).
export function dreieckSws(b, c, alpha, dreh = 0) { return { A: [0, 0], B: drehe([c, 0], dreh), C: drehe(plus([0, 0], dir(alpha), b), dreh) }; }
// Ein Dreieck aus drei Seiten (sss), C über AB.
export function dreieckSss(a, b, c, dreh = 0) {
  const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
  return { A: [0, 0], B: drehe([c, 0], dreh), C: drehe([RZ(x), RZ(y)], dreh) };
}
// Innenwinkel eines Dreiecks, auf Hundertstel gerundet (zum Vergleichen und für Heftaufgaben).
export function winkelBei(E, p) {
  const q = E[{ A: 'B', B: 'C', C: 'A' }[p]], r = E[{ A: 'C', B: 'A', C: 'B' }[p]], s = E[p];
  const u = [q[0] - s[0], q[1] - s[1]], v = [r[0] - s[0], r[1] - s[1]];
  return (Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180) / Math.PI;
}
export const seiteVon = (E, x) => ({ a: abstand(E.B, E.C), b: abstand(E.A, E.C), c: abstand(E.A, E.B) })[x];

// ---------- Figur ----------
// f: { punkte: { A: [x, y], … }, versteckt?: [namen], ohneName?: [namen], pos?: { A: grad }, linien: [[a, b, { n, stil, gleich }]],
//      winkel: [[s, a, b, { n, wert, frage, gleich, farbe }]], masse: [[a, b, text, { frage }]], kreise: [[m, r]], titel }
export function figur(f) {
  const versteckt = new Set(f.versteckt ?? []), ohne = new Set(f.ohneName ?? []);
  return {
    art: 'figur',
    punkte: Object.entries(f.punkte).map(([n, p]) => ({ n, p: [RZ(p[0]), RZ(p[1])], ...(versteckt.has(n) ? { zeigen: false } : {}), ...(ohne.has(n) ? { name: false } : {}), ...(f.pos?.[n] != null ? { pos: f.pos[n] } : {}) })),
    linien: (f.linien ?? []).map(([a, b, o = {}]) => ({ a, b, ...o })),
    ...(f.winkel?.length ? { winkel: f.winkel.map(([s, a, b, o = {}]) => ({ s, a, b, ...o })) } : {}),
    ...(f.masse?.length ? { masse: f.masse.map(([a, b, t, o = {}]) => ({ a, b, t, ...o })) } : {}),
    ...(f.kreise?.length ? { kreise: f.kreise.map(([m, r, stil]) => ({ m, r: RZ(r), ...(stil ? { stil } : {}) })) } : {}),
    ...(f.titel ? { titel: f.titel } : {}),
  };
}
// Ein Dreieck ABC als Figur. w: { A: { wert | n | frage … } } Winkel an den Ecken, m: { a: 'text' } Maße der Seiten, gleich: { a: 1 } Striche.
export function dreieckFigur(E, { w = {}, m = {}, gleich = {}, titel = null, extra = {} } = {}) {
  const linien = [['A', 'B', { ...(gleich.c ? { gleich: gleich.c } : {}) }], ['B', 'C', { ...(gleich.a ? { gleich: gleich.a } : {}) }], ['C', 'A', { ...(gleich.b ? { gleich: gleich.b } : {}) }]];
  const nach = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
  const winkel = Object.entries(w).map(([p, o]) => [p, nach[p][0], nach[p][1], o]);
  const masse = Object.entries(m).map(([s, t]) => { const [p, q] = { a: ['B', 'C'], b: ['C', 'A'], c: ['A', 'B'] }[s]; return typeof t === 'object' ? [p, q, t.t, t] : [p, q, t]; });
  return figur({ punkte: { A: E.A, B: E.B, C: E.C, ...(extra.punkte ?? {}) }, linien: [...linien, ...(extra.linien ?? [])], winkel: [...winkel, ...(extra.winkel ?? [])], masse, titel, versteckt: extra.versteckt, pos: extra.pos, ohneName: extra.ohneName, kreise: extra.kreise });
}
// Wert eines Winkels in der Figur: zeigt die Größe. Gesucht: zeigt den Namen oder ein Fragezeichen.
export const WERT = (wert, o = {}) => ({ wert, ...o });
export const GESUCHT = (n, wert, o = {}) => ({ n, wert, frage: true, ...o });
export const NAME = (n, o = {}) => ({ n, ...o });

// Zwei Geraden schneiden sich in S. Die erste hat die Richtung `dreh`, die zweite liegt `alpha` Grad weiter.
// Die vier Winkel heißen gegen den Uhrzeigersinn α, β, γ, δ (α zwischen den beiden „vorderen“ Strahlen).
export const KREUZ_NAMEN = ['α', 'β', 'γ', 'δ'];
export function kreuzung(alpha, dreh, zeige, { lang = 3.2, namen = KREUZ_NAMEN, s = 'S', geraden = ['g', 'h'] } = {}) {
  const S = [0, 0], g1 = plus(S, dir(dreh), lang), g2 = plus(S, dir(dreh), -lang), h1 = plus(S, dir(dreh + alpha), lang), h2 = plus(S, dir(dreh + alpha), -lang);
  const enden = { G1: g1, H1: h1, G2: g2, H2: h2 };
  const reihe = [['G1', 'H1'], ['H1', 'G2'], ['G2', 'H2'], ['H2', 'G1']];
  const winkel = reihe.map(([a, b], i) => (zeige[i] ? [s, a, b, { farbe: i, ...zeige[i], ...(zeige[i].n == null && zeige[i].wert == null ? {} : {}) }] : null)).filter(Boolean);
  return figur({ punkte: { [s]: S, ...enden }, versteckt: Object.keys(enden), ohneName: [s], linien: [['G2', 'G1', geraden[0] ? { n: geraden[0] } : {}], ['H2', 'H1', geraden[1] ? { n: geraden[1] } : {}]], winkel });
}
// Größen der vier Winkel an einer Kreuzung mit α.
export const kreuzWerte = (alpha) => [alpha, 180 - alpha, alpha, 180 - alpha];

// Zwei parallele Geraden g (oben) und h (unten), geschnitten von s unter dem Winkel alpha (zur Richtung von g).
// Winkel an g: α, β, γ, δ wie bei der Kreuzung; an h: α′, β′, γ′, δ′ in derselben Lage. Mit `knick` ist h nicht parallel (um so viel Grad gedreht).
export const STRICH = '′';
export function parallelen(alpha, zeigeG, zeigeH, { dreh = 0, abst = 2.6, knick = 0, namen = ['g', 'h', 's'] } = {}) {
  const e = dir(dreh), n = dir(dreh + 90), u = dir(dreh + alpha);
  const t = abst / Math.sin(rad(alpha)); // Strecke auf s zwischen den Schnittpunkten
  const S1 = [0, 0], S2 = plus(S1, u, -t);
  const lg = 3.4, ls = 1.9;
  const eh = dir(dreh + knick);
  const p = { S1, S2, G1: plus(S1, e, lg + 0.6), G2: plus(S1, e, -lg), H1: plus(S2, eh, lg), H2: plus(S2, eh, -lg - 0.6), T1: plus(S1, u, ls), T2: plus(S2, u, -ls) };
  const reiheG = [['G1', 'T1'], ['T1', 'G2'], ['G2', 'T2'], ['T2', 'G1']], reiheH = [['H1', 'T1'], ['T1', 'H2'], ['H2', 'T2'], ['T2', 'H1']];
  const winkel = [...reiheG.map(([a, b], i) => (zeigeG[i] ? ['S1', a, b, { farbe: i, ...zeigeG[i] }] : null)), ...reiheH.map(([a, b], i) => (zeigeH[i] ? ['S2', a, b, { farbe: i, ...zeigeH[i] }] : null))].filter(Boolean);
  return figur({ punkte: p, versteckt: ['G1', 'G2', 'H1', 'H2', 'T1', 'T2'], ohneName: ['S1', 'S2'],
    linien: [['G2', 'G1', { n: namen[0] }], ['H2', 'H1', { n: namen[1] }], ['T2', 'T1', { n: namen[2] }]], winkel });
}
export const NAMEN_G = ['α', 'β', 'γ', 'δ'], NAMEN_H = NAMEN_G.map((x) => x + STRICH);

// Winkel in Zehnerschritten (F), Fünferschritten (G) oder ganz (M, E), ohne zu kleine oder zu stumpfe Winkel.
export const winkelFuer = (niveau, von = 30, bis = 150) => {
  const schritt = { F: 10, G: 5, M: 1, E: 1 }[niveau];
  return schritt * zz(Math.ceil(von / schritt), Math.floor(bis / schritt));
};
// Drei Innenwinkel mit Summe 180°, jeder mindestens `min` Grad.
export function dreiWinkel(niveau, { min = 30, max = 110, recht = false, stumpf = false } = {}) {
  return suche(() => { const a = winkelFuer(niveau, min, max), b = recht ? 90 : winkelFuer(niveau, min, max); return [a, b, 180 - a - b]; },
    ([a, b, c]) => c >= min && c <= (stumpf ? 140 : max) && (!stumpf || Math.max(a, b, c) > 90) && (stumpf || recht || Math.max(a, b, c) < 90 || niveau !== 'F') && new Set([a, b, c]).size === 3);
}
// Lage eines Dreiecks je Niveaustufe: F mit waagerechter Grundseite, G leicht gedreht, M und E beliebig.
export const drehFuer = (niveau) => (niveau === 'F' ? 0 : niveau === 'G' ? wahl([0, 0, 10, -10, 15, -15]) : zz(-40, 40));

// Ein Satz von Bildern im Gitter für die Konstruktionen (Höhen, Mittelsenkrechte, Thales): Gitter mit Punkten und Linien.
export const gitterBild = (g) => B.gitter(g);
export const kreuzProd = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
export const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
export const skalar = (u, v) => u[0] * v[0] + u[1] * v[1];
export const vek = (p, q) => [q[0] - p[0], q[1] - p[1]];
export const ggt = (a, b) => (b ? ggt(b, a % b) : Math.abs(a));
// Kleinster ganzzahliger Richtungsvektor.
export const kuerze = (v) => { const g = ggt(Math.abs(v[0]), Math.abs(v[1])) || 1; return [v[0] / g, v[1] / g]; };
// Gitterpunkte (ohne Rand) im Gitter b × h.
export const gitterPunkteIn = (b, h) => { const l = []; for (let x = 0; x <= b; x++) for (let y = 0; y <= h; y++) l.push([x, y]); return l; };

// ---------- Aufgaben-Bausteine ----------
import { zahl as zahlRoh, auswahl as auswahlRoh, luecken as lueckenRoh, opt, Z, sach, teil, teilWahl, ordnen as ordnenRoh, gitterPunkte, gitterLinie, gitterKreis, zuordnen } from '../werkzeug.mjs';
export { opt, Z, sach, teil, teilWahl, gitterPunkte, gitterLinie, gitterKreis, zuordnen };
export { kind, zweiKinder } from '../werkzeug.mjs';
const STUFE = { F: 0, G: 1, M: 2, E: 3 };
// Hilfekärtchen je Niveaustufe: F und G Tipp, Beispiel, Lösungsschritt; M Tipp und Lösungsschritt; E nur der Tipp.
export const H = (niveau, tipp, beispiel, schritt) => (STUFE[niveau] <= 1 ? { tipp, beispiel, loesungsschritt: schritt } : STUFE[niveau] === 2 ? { tipp, loesungsschritt: schritt ?? beispiel } : { tipp });
// Typische Fehler als [[wert, fehlvorstellung]]: nie die Lösung, nie doppelt, nur sinnvolle Winkel.
export const fehler = (loesung, liste) => liste.filter(([w], i, l) => w !== loesung && w > 0 && Number.isFinite(w) && l.findIndex(([x]) => x === w) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
// Ein Winkel als Zahl mit Einheit „°“.
export const grad = (text, loesung, fl, hilfen, extra) => zahlRoh(text, loesung, fehler(loesung, fl ?? []), hilfen, { einheit: '°', ...extra });
export const zahl = (text, loesung, fl, hilfen, extra) => zahlRoh(text, loesung, fehler(loesung, fl ?? []), hilfen, extra);
export const auswahl = auswahlRoh;
export const lk = (loesung, fl = []) => [loesung, fehler(loesung, fl)];
export const luecken = lueckenRoh;
export const ordnen = (text, schritte, hilfen, extra) => ordnenRoh(text, schritte, hilfen, { sonst: 'konstruktion-reihenfolge', nachweis: [{ art: 'schritte' }], ...extra });
export const BEZ = (paar, welche, extra = {}) => ({ art: 'beziehung', paar, ...(welche ? { welche } : {}), ...extra });
export const FIG = (winkel, extra = {}) => ({ art: 'figur', winkel, ...extra });
// Rechnung mit Gradzahlen: „180° − 40° = 140°“.
export const R = (...teile) => teile.join(' ');

// ---------- Dreiecke und Vierecke aus Winkeln ----------
export { drehe };
// Ein Dreieck mit den Innenwinkeln α und β an der Seite c (Länge 5), gedreht. Liefert die Ecken.
export const dreieckAus = (alpha, beta, dreh = 0, c = 5) => dreieckWsw(c, alpha, beta, dreh);
// Bild eines Dreiecks: zeige { A: WERT(…) | GESUCHT(…) | NAME(…) }, o wie dreieckFigur.
export const dreieckBild = (E, zeige = {}, o = {}) => dreieckFigur(E, { w: zeige, ...o });
// Ein Viereck ABCD aus zwei Dreiecken an der Diagonalen AC (Länge L): unten ABC mit den Winkeln a1 (bei A) und c1 (bei C),
// oben ACD mit a2 und c2. Innenwinkel: A = a1 + a2, B = 180 − a1 − c1, C = c1 + c2, D = 180 − a2 − c2.
export function viereckAus(a1, c1, a2, c2, dreh = 0, L = 6) {
  const A = [0, 0], C = [L, 0];
  const B = plus(A, dir(-a1), (L * Math.sin((c1 * Math.PI) / 180)) / Math.sin(((a1 + c1) * Math.PI) / 180));
  const D = plus(A, dir(a2), (L * Math.sin((c2 * Math.PI) / 180)) / Math.sin(((a2 + c2) * Math.PI) / 180));
  return { A: drehe(A, dreh), B: drehe(B, dreh), C: drehe(C, dreh), D: drehe(D, dreh) };
}
// Bild eines Vierecks ABCD. zeige { A: … } an den Ecken (Innenwinkel), linien zusätzlich (z. B. die Diagonale).
export function viereckBild(V, zeige = {}, { linien = [], titel = null } = {}) {
  const nach = { A: ['B', 'D'], B: ['C', 'A'], C: ['D', 'B'], D: ['A', 'C'] };
  return figur({ punkte: V, linien: [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ...linien], winkel: Object.entries(zeige).map(([p, o]) => [p, nach[p][0], nach[p][1], o]), titel });
}
