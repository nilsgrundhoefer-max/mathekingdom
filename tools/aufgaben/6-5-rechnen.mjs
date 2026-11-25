// Gemeinsame Bausteine für Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048).
// Grilling mit Nils (2026-11-25): F ein Schritt am Bild oder am Geld, höchstens Hundertstel. G Faktor höchstens zweistellig,
// Divisor einstellig (auch nach dem Verschieben). M Faktor bis dreistellig, Divisor bis zweistellig, Überschlag Pflicht.
// E keine längeren Zahlen, sondern Begründen, Fehlersuche, Faktoren und Divisoren kleiner als 1, Klammern setzen, Rückwärtsaufgaben.
// Schriftlich: F und G im Rechenraster (Komma unter Komma, beim Multiplizieren ohne Komma und danach das Komma setzen), ab M im Heft.
// Divisionen gehen auf F bis M immer auf, höchstens drei Stellen nach dem Komma. Endnullen werden nie verlangt: 4,5 € zählt wie 4,50 €.
// Eine Dezimalzahl ist hier ein Text („2,35“). Gerechnet wird mit ganzen Zahlen: 2,35 ist [235, 2].

import { B, zz, wahl, mische, kind, opt } from '../werkzeug.mjs';
import { T, dfe, URTEIL, FREI, bild, fig, vorn } from './6-4-dezimal.mjs';

export { T, dfe, URTEIL, FREI, bild, fig, vorn };

export const P = (t) => { const [g, n = ''] = String(t).split(','); return [Number(g + n), n.length]; };
const auf = ([z, k], K) => z * 10 ** (K - k);
export const wert = (t) => { const [z, k] = P(t); return z / 10 ** k; };
export const plus = (a, b) => { const x = P(a), y = P(b), K = Math.max(x[1], y[1]); return T(auf(x, K) + auf(y, K), K); };
export const minus = (a, b) => { const x = P(a), y = P(b), K = Math.max(x[1], y[1]), d = auf(x, K) - auf(y, K); return d < 0 ? null : T(d, K); };
export const mal = (a, b) => { const x = P(a), y = P(b); return T(x[0] * y[0], x[1] + y[1]); };
// a : b, wenn die Division nach höchstens `stellen` Stellen aufgeht, sonst null.
export const durch = (a, b, stellen = 4) => { const x = P(a), y = P(b), z = x[0] * 10 ** y[1], n = y[0] * 10 ** x[1];
  for (let k = 0; k <= stellen; k++) if ((z * 10 ** k) % n === 0) return T((z * 10 ** k) / n, k); return null; };
export const stellen = (t) => P(t)[1];
// Zufällige Dezimalzahl mit genau k Stellen nach dem Komma (die letzte Ziffer ist keine 0), Wert von `von` bis `bis`.
export const dez = (k, von, bis) => { for (;;) { const z = zz(Math.round(von * 10 ** k), Math.round(bis * 10 ** k)); if (k === 0 || z % 10 !== 0) return T(z, k); } };
// Mit einer Stufenzahl: das Komma verschieben (s > 0 nach rechts, s < 0 nach links).
export const schiebe = (t, s) => { const [z, k] = P(t); return s >= 0 ? (s <= k ? T(z, k - s) : T(z * 10 ** (s - k), 0)) : T(z, k - s); };
// Geld: immer zwei Stellen nach dem Komma.
export const euro = (t) => T(P(t)[0] * 10 ** (2 - P(t)[1]), 2, 2);
// Typische Fehler beim Rechnen mit Dezimalzahlen.
// Rechtsbündig statt Komma unter Komma: 2,35 + 1,4 wird wie 235 + 14 gerechnet.
export const rechtsbuendig = (a, b, op = '+') => { const x = P(a), y = P(b), K = Math.max(x[1], y[1]), w = op === '+' ? x[0] + y[0] : x[0] - y[0]; return w < 0 ? null : T(w, K); };
// Endnull nicht ergänzt: 5 − 2,35 wird zu 3,35 (die Stellen der unteren Zahl werden abgeschrieben).
export const endnullFehler = (a, b) => { const x = P(a), y = P(b); if (x[1] >= y[1]) return null; const g = Math.floor(x[0] / 10 ** x[1]) - Math.floor(y[0] / 10 ** y[1]); if (g < 0) return null; const rest = y[0] % 10 ** y[1]; return T(g * 10 ** y[1] + rest, y[1]); };
// Komma wie beim Addieren: so viele Stellen wie der längere Faktor.
export const kommaWiePlus = (a, b) => { const x = P(a), y = P(b); return T(x[0] * y[0], Math.max(x[1], y[1])); };
export const KINDER = () => kind();
// Überschlag eines Produkts: jeder Faktor auf Ganze gerundet (Faktoren unter 1 auf ihre erste Stelle). Liefert [gerundet a, gerundet b].
export const grob = (t) => { const v = wert(t); if (v >= 1) return String(Math.round(v)); const [z, k] = P(t); const f = 10 ** (String(z).length - 1); return T(Math.round(z / f) * f, k); };
// Grob auf die erste Ziffer: 23,4 → 20, 4,9 → 5, 0,48 → 0,5.
export const ersteStelle = (t) => { const v = wert(t); if (v < 1) return grob(t); const g = Math.round(v), f = 10 ** (String(g).length - 1); return String(Math.round(g / f) * f); };
export { B, zz, wahl, mische, kind, opt };
