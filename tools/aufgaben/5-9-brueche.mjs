// Gemeinsame Bausteine für Kapitel 9 „Brüche und Dezimalzahlen“ (ADR 0036).
// Grilling mit Nils (2026-11-22): Brüche stehen immer mit waagerechtem Bruchstrich (im Text „3⁄4“ mit U+2044, das Dashboard stapelt).
// Nenner: F 2, 3, 4; G bis 8 und 10; M bis 12 und 100; E bis 20. Brüche über 1 gibt es ab M. Gerechnet wird mit Brüchen nicht.
// Eine Figur im Bruchbild: { n?, form, teile | reihen + spalten, ganze?, gefaerbt: [Nummern], ungleich? } (src/schueler/bruchbilder.js).

import { B, br, opt, zz, wahl, mische } from '../werkzeug.mjs';

export const vorn = (k, ab = 0) => Array.from({ length: k }, (_, i) => ab + i);
// k von n Teilen, nicht alle nebeneinander (ab G).
export function streu(n, k) {
  for (let i = 0; i < 200; i++) {
    const l = mische(vorn(n)).slice(0, k).sort((a, b) => a - b);
    if (k < 2 || k >= n - 1 || l.some((x, j) => j > 0 && x !== l[j - 1] + 1)) return l;
  }
  return vorn(k);
}
const spec = (form, n) => (Array.isArray(n) ? { form, reihen: n[0], spalten: n[1] } : form === 'hundert' ? { form } : { form, teile: n });
export const anz = (n) => (Array.isArray(n) ? n[0] * n[1] : n);
export const fig = (form, n, gefaerbt, extra = {}) => ({ ...spec(form, n), gefaerbt, ...extra });
export const leer = (form, n, extra = {}) => ({ ...spec(form, n), ...extra });
export const benenne = (figuren) => figuren.map((f, i) => ({ n: 'ABCD'[i], ...f }));
export const bild = (...figuren) => B.bruch(...figuren);

// Nachweis: Die Figur zeigt diesen Bruchteil (abgezählt, nicht gekürzt). Mit rest: der weiße Bruchteil.
export const NB = (bruch, extra = {}) => ({ art: 'bild', bruch, form: true, ...extra });
export const NBW = (bruch, extra = {}) => ({ art: 'bild', bruch, ...extra });
export const WERT = (wert, form = true) => ({ art: 'wert', wert, ...(form ? { form: true } : {}) });
export const FREI = (grund) => ({ art: 'frei', grund });

export const ERLAUBT = {
  F: (n) => n >= 2 && n <= 4, G: (n) => n >= 2 && (n <= 8 || n === 10),
  M: (n) => n >= 2 && (n <= 12 || n === 100), E: (n) => n >= 2 && (n <= 20 || n === 100),
};
// Falsche Antworten zu k⁄n: vertauscht (ab M), der Rest als Nenner, die weißen Teile gezählt, Nachbarn.
export function falsche(stufe, k, n, anzahl = 2) {
  const ueber1 = stufe === 'M' || stufe === 'E', liste = [];
  const dazu = (z, nn, fv) => {
    if (z >= 1 && ERLAUBT[stufe](nn) && z !== nn && (ueber1 || z < nn) && z * n !== k * nn && !liste.some(([a, b]) => a * nn === z * b)) liste.push([z, nn, fv]);
  };
  if (ueber1) dazu(n, k, 'bruch-vertauscht');
  dazu(k, n - k, 'bruch-teil-zu-rest');
  dazu(n - k, n);
  dazu(k + 1, n); dazu(k - 1, n); dazu(1, n); dazu(k, n + 1); dazu(1, 2); dazu(1, 3);
  return liste.slice(0, anzahl);
}
export const falscheOpt = (stufe, k, n, anzahl = 2) => falsche(stufe, k, n, anzahl).map(([z, nn, fv]) => opt(br(z, nn), false, fv));
export const falscheFehler = (k, n) => [[n > k ? br(n, k) : null, 'bruch-vertauscht'], [n - k >= 2 ? br(k, n - k) : null, 'bruch-teil-zu-rest']].filter(([w]) => w);

// Wörter zu den Formen: [Der Kreis, des Kreises, Im Kreis]
export const FORM = {
  kreis: ['Der Kreis', 'des Kreises', 'Im Kreis'], rechteck: ['Das Rechteck', 'des Rechtecks', 'Im Rechteck'],
  streifen: ['Der Streifen', 'des Streifens', 'Im Streifen'], menge: ['Die Kugeln', 'der Kugeln', 'Im Bild'],
};
export const BRUCHWORT = { 2: 'Halbe', 3: 'Drittel', 4: 'Viertel', 5: 'Fünftel', 6: 'Sechstel', 8: 'Achtel' };
// Größter gemeinsamer Teiler und gekürzter Bruch (nur für die Erzeuger, der Prüfer rechnet selbst).
export const ggt = (a, b) => (b ? ggt(b, a % b) : a);
export const kleiner = (a, b) => a[0] * b[1] < b[0] * a[1];
export const sortiere = (brueche) => [...brueche].sort((a, b) => a[0] * b[1] - b[0] * a[1]);
// Dezimalzahl als Text: dz(25, 100) wird „0,25“, dz(250, 100, 2) wird „2,50“. Ohne stellen fallen Endnullen weg.
export function dz(z, n, stellen = null) {
  const laenge = String(n).length - 1, ganz = Math.floor(z / n);
  let nach = String(z % n).padStart(laenge, '0');
  if (stellen == null) nach = nach.replace(/0+$/, ''); else nach = nach.slice(0, Math.max(stellen, nach.replace(/0+$/, '').length)).padEnd(stellen, '0');
  return nach ? `${ganz},${nach}` : String(ganz);
}
export { br, opt, zz, wahl, mische };
