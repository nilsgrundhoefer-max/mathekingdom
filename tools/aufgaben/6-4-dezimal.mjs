// Gemeinsame Bausteine für Klasse 6, Kapitel 4 „Dezimalzahlen“ (ADR 0047).
// Grilling mit Nils (2026-11-25): F Zehntel und Hundertstel, G bis Tausendstel, M bis Zehntausendstel, E Dichte, Fehlersuche, Rückwärtsaufgaben.
// 0,5 und 0,50 sind gleich viel; Endnullen werden nie verlangt, auch beim Runden nicht. Jeder Auftrag beginnt mit einem Operator.
// Eine Dezimalzahl wird hier als ganze Zahl z in der Einheit 10^−k geführt: (305, 3) ist 0,305. Gerechnet wird nur mit ganzen Zahlen.

import { B, L, br, opt, zz, wahl, mische, kind, fehlerliste, periodisch } from '../werkzeug.mjs';
import { vorn, fig, bild, NB, NBW, WERT, FREI, dz, ggt } from './5-9-brueche.mjs';

export { B, L, br, opt, zz, wahl, mische, kind, fehlerliste, periodisch, vorn, fig, bild, NB, NBW, WERT, FREI, dz, ggt };

// Text einer Dezimalzahl z · 10^−k, ohne Endnullen. Mit stellen genau so viele Stellen nach dem Komma.
export const T = (z, k, stellen = null) => dz(z, 10 ** k, stellen);
const num = (t) => (typeof t === 'number' ? t : Number(String(t).replace(',', '.')));
// Typische Fehler mit Dezimalzahlen: [[wert, fehlvorstellung]], ohne die Lösung, ohne Doppelte und ohne Unsinn.
export const dfe = (loesung, paare) => { const gesehen = new Set([num(loesung)]); return paare.filter(([w]) => w != null && !Number.isNaN(num(w)) && num(w) >= 0 && /^\d+(,\d{1,4})?$/.test(String(w)) && !gesehen.has(num(w)) && gesehen.add(num(w))).map(([wert, fehlvorstellung]) => ({ wert: /^\d+$/.test(String(wert)) ? Number(wert) : wert, fehlvorstellung })); };
export const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
export const URTEIL = (stimmt, behauptung) => ({ art: 'urteil', stimmt, behauptung });
export const ZEICHEN = (d, fv) => [opt('<', d < 0, d < 0 ? undefined : fv), opt('>', d > 0, d > 0 ? undefined : fv), opt('=', d === 0, d === 0 ? undefined : fv)];
// Zwei Zahlen (z, k) auf dieselbe Einheit bringen und vergleichen: < 0, 0, > 0.
export const vgl = ([a, ka], [c, kc]) => { const k = Math.max(ka, kc); return a * 10 ** (k - ka) - c * 10 ** (k - kc); };
export const stellenVon = (t) => (String(t).split(',')[1] ?? '').length;
export const alsPaar = (t) => [Number(String(t).replace(',', '')), stellenVon(t)];

// ---------- Stellenwerttafel ----------
export const tafelZeile = (ziffern, vorsilbe) => { const werte = {}; return { zeile: ziffern.map((z, i) => { if (z == null) return ''; werte[`${vorsilbe}${i}`] = z; return L(`${vorsilbe}${i}`); }), werte }; };
// Ziffern von z · 10^−k für die Spalten (z. B. ['Z', 'E', 'z', 'h', 't']). Vor den Einern bleiben führende Felder leer.
export function ziffernFuer(spalten, z, k) {
  const e = spalten.indexOf('E'), nach = spalten.length - 1 - e, voll = z * 10 ** (nach - k);
  const t = String(voll).padStart(spalten.length, ' ').split('');
  return t.map((c, i) => (c === ' ' ? (i >= e ? 0 : null) : Number(c)));
}
export const NAME = { E: 'Einer', Z: 'Zehner', H: 'Hunderter', z: 'Zehntel', h: 'Hundertstel', t: 'Tausendstel' };

// ---------- Runden ----------
// z · 10^−k gerundet auf `auf` Stellen nach dem Komma (auf = 0: auf Ganze, −1: auf Zehner). Ergebnis in der Einheit 10^−auf.
export const runde = (z, k, auf) => { const f = 10 ** (k - auf); return Math.floor((z + f / 2) / f); };
export const abschneiden = (z, k, auf) => Math.floor(z / 10 ** (k - auf));
export const STELLENWORT = { 0: 'Ganze', 1: 'Zehntel', 2: 'Hundertstel', 3: 'Tausendstel' };
export const STELLE_KURZ = { 0: 'E', 1: 'z', 2: 'h', 3: 't' };
// Gerundet wie Schritt für Schritt von hinten (der Fehler „runden-kette“).
export const rundeKette = (z, k, auf) => { let w = z; for (let s = k; s > auf; s--) w = runde(w, s, s - 1); return w; };

// ---------- Brüche und Division ----------
export const kz = ([z, n]) => { const g = ggt(z, n); return [z / g, n / g]; };
// Nur 2 und 5 im Nenner: Die Dezimalzahl bricht ab. Dann die kleinste Stufenzahl, auf die sich erweitern lässt.
export const stufenzahl = (n) => { for (let k = 0; k <= 6; k++) if ((10 ** k) % n === 0) return k; return null; };
// Bruch z⁄n als Dezimalzahl: { ganz, vor (Ziffern nach dem Komma vor der Periode), periode }. Die Periode ist leer, wenn die Division aufgeht.
export function entwickle(z, n) {
  const ganz = Math.floor(z / n), ziffern = [], gesehen = new Map();
  let rest = z % n;
  while (rest !== 0 && !gesehen.has(rest)) { gesehen.set(rest, ziffern.length); rest *= 10; ziffern.push(Math.floor(rest / n)); rest %= n; }
  const start = rest === 0 ? ziffern.length : gesehen.get(rest);
  return { ganz, vor: ziffern.slice(0, start).join(''), periode: ziffern.slice(start).join('') };
}
// Text: „0,375“ oder „0,16̅“.
export const dezimalText = (z, n) => { const e = entwickle(z, n); return e.periode ? periodisch(`${e.ganz},${e.vor}`, e.periode) : (e.vor ? `${e.ganz},${e.vor}` : String(e.ganz)); };
// Die ersten `stellen` Ziffern nach dem Komma, abgebrochen (für typische Fehler wie 0,66 statt 0,6̅).
export const abgebrochen = (z, n, stellen) => { const e = entwickle(z, n), ziffern = (e.vor + e.periode.repeat(stellen)).slice(0, stellen); return `${e.ganz},${ziffern}`; };

// ---------- Bilder ----------
export const hundert = (k) => bild(fig('hundert', null, vorn(k)));
export const streifen10 = (k) => bild(fig('streifen', 10, vorn(k)));
// Zahlenstrahl in Einheiten 10^−k: teiler 10, 100 oder 1000.
export const strahl10 = (von, bis, teiler, beschriftung = 10, extra = {}) => B.strahl({ von, bis, schritt: 1, beschriftung, teiler, ...(von > 0 ? { ausschnitt: true } : {}), ...extra });
export const strahlSpec = (von, bis, teiler, beschriftung = 10, extra = {}) => ({ von, bis, schritt: 1, beschriftung, teiler, ...(von > 0 ? { ausschnitt: true } : {}), ...extra });
// Zahlenstrahl mit Lupe: oben Zehntel (oder Hundertstel) von `von` bis `bis`, unten der Abschnitt ab `stelle` zehnfach vergrößert.
export const lupe = (von, bis, teiler, stelle, unten = {}) => B.lupe(
  { von, bis, schritt: 1, beschriftung: 10, teiler, ...(von > 0 ? { ausschnitt: true } : {}) },
  { von: stelle * 10, bis: stelle * 10 + 10, schritt: 1, beschriftung: 5, teiler: teiler * 10, ...(stelle > 0 ? { ausschnitt: true } : {}), ...unten });
export const KONTEXTE = { lauf: ['100-m-Lauf', 's'], weit: ['Weitsprung', 'm'], wurf: ['Ballwurf', 'm'] };
export const MARKT = ['Gewürzhändlerin', 'Tuchhändler', 'Bäckerin', 'Kaufmann'];
