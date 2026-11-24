// Gemeinsame Bausteine für Klasse 6, Kapitel 2 „Rechnen mit Brüchen“ (ADR 0038).
// Grilling mit Nils (2026-11-24): Gerechnet wird mit Nennern bis 12 (F), 20 (G), 30 (M) und 60 (E). Jedes Ergebnis ist vollständig
// gekürzt (gekuerzt: true); ein Ergebnis über 1 steht als gemischte Zahl, ein unechter Bruch zählt gleich.
// Ein Bruch ist hier ein Paar [Zähler, Nenner], auch über 1. Gerechnet wird genau.

import { B, br, opt, zz, wahl, mische, bruch, auswahl } from '../werkzeug.mjs';
import { vorn, streu, fig, leer, benenne, bild, NB, NBW, WERT, FREI, ggt } from './5-9-brueche.mjs';

export { vorn, streu, fig, leer, benenne, bild, NB, NBW, WERT, FREI, ggt, B, br, opt, zz, wahl, mische };
export const kgv = (a, b) => (a * b) / ggt(a, b);
export const kz = ([z, n]) => { const g = ggt(z, n); return [z / g, n / g]; };
export const plus = (a, b) => kz([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
export const minus = (a, b) => kz([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
export const mal = (a, b) => kz([a[0] * b[0], a[1] * b[1]]);
export const durch = (a, b) => kz([a[0] * b[1], a[1] * b[0]]);
export const gleich = (a, b) => a[0] * b[1] === b[0] * a[1];
export const kleiner = (a, b) => a[0] * b[1] < b[0] * a[1];
export const ganz = (n) => [n, 1];
// Text einer Zahl: natürliche Zahl, echter Bruch oder gemischte Zahl. Der Bruch wird nicht gekürzt.
export const T = ([z, n]) => (z % n === 0 ? String(z / n) : z > n ? br(z % n, n, Math.floor(z / n)) : br(z, n));
// Als unechter Bruch.
export const U = ([z, n]) => br(z, n);
export const istBruch = (q) => q[0] % q[1] !== 0;
// Ein gekürzter echter Bruch mit einem Nenner aus der Liste. von: kleinster Zähler.
export const echt = (nenner, von = 1) => { const n = wahl(nenner), zs = vorn(n - von, von).filter((z) => ggt(z, n) === 1); return [wahl(zs), n]; };
// Eine gemischte Zahl als unechter Bruch: Ganze aus der Liste, dahinter ein gekürzter echter Bruch.
export const gemischt = (ganze, nenner) => { const [z, n] = echt(nenner), g = wahl(ganze); return [g * n + z, n]; };
// Typische Fehler einer Brucheingabe: [[Bruch, Fehlvorstellung]]. Fällt weg, was kein Bruch ist, was der Lösung gleicht oder doppelt ist.
export const fehler = (loesung, liste) => {
  const gesehen = [];
  return liste.filter(([f]) => f && f[0] > 0 && f[1] > 1 && Number.isInteger(f[0]) && Number.isInteger(f[1]) && !gleich(f, loesung) && !gesehen.some((x) => gleich(x, f)) && gesehen.push(f))
    .map(([f, fv]) => [br(f[0], f[1]), fv]);
};
// Brucheingabe mit vollständig gekürzter Lösung. Die Lösung muss ein Bruch sein (keine natürliche Zahl).
export const rechneB = (text, erg, fehlerliste, hilfen, nachweis, extra = {}) => (istBruch(erg) ? bruch(text, T(kz(erg)), fehler(erg, fehlerliste), hilfen, { gekuerzt: true, nachweis, ...extra }) : null);
// Falsche Antworten für eine Auswahl: Brüche als Text, ohne die Lösung und ohne doppelte Werte.
export const optionen = (loesung, falsche, text = T) => {
  const gesehen = [loesung];
  return [opt(text(loesung), true), ...falsche.filter(([f]) => f && f[0] > 0 && f[1] > 0 && !gesehen.some((x) => gleich(x, f)) && gesehen.push(f)).map(([f, fv]) => opt(text(f), false, fv))];
};
// „Stimmt das?“ mit einer Gleichung: richtig ist „Stimmt.“ oder die Antwort mit der richtigen Gleichung.
export const urteil = (text, stimmt, behauptung, richtigGlg, falschGlg, fv, hilfen, extra = {}) => auswahl(text,
  [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Es gilt ${richtigGlg}.`, !stimmt, stimmt ? fv : undefined), ...falschGlg.map((g) => opt(`Falsch. Es gilt ${g}.`, false, fv))],
  hilfen, { ...extra, nachweis: [{ art: 'urteil', stimmt, behauptung }, ...(extra.nachweis ?? [])] });
export const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
export const HILFS = (wertText, grund) => ({ wert: String(wertText), grund });
export const ZEICHEN = (d, fv = 'mal-macht-groesser') => [opt('<', d < 0, d < 0 ? undefined : fv), opt('>', d > 0, d > 0 ? undefined : fv), opt('=', d === 0)];

// ---------- Bilder ----------
export const kreis = (z, n) => fig('kreis', n, vorn(z));
export const streifen = (z, n) => fig('streifen', n, vorn(z));
export const akku = (z, n) => fig('akku', n, vorn(z));
// Ein Bruch als Kreis, über 1 mit mehreren Ganzen (höchstens drei).
export const kreise = ([z, n]) => (z > n ? fig('kreis', n, vorn(z), { ganze: Math.ceil(z / n) }) : fig('kreis', n, vorn(z)));
export const zwei = (a, c) => bild(...benenne([a, c]));
// Rechteckbild für a⁄b von c⁄d: d Spalten, davon c hell gefärbt; b Zeilen, in den gefärbten Spalten sind a Zeilen kräftig gefärbt.
export const rechteckbild = ([a, b], [c, d]) => {
  const kraeftig = [], hell = [];
  for (let r = 0; r < b; r++) for (let s = 0; s < c; s++) (r < a ? kraeftig : hell).push(r * d + s);
  return bild(fig('rechteck', [b, d], kraeftig, { hell }));
};
// Zahlenstrahl in Bruchteilen: T Abstände je Ganzes, von 0 bis `bis` Ganze, mit Punkten an den genannten Stellen.
export const bstrahl = (teile, bis = 1, extra = {}) => B.strahl({ von: 0, bis: bis * teile, schritt: 1, beschriftung: teile, teiler: teile, ...extra });
export const TEILWORT = { 2: 'Halbe', 3: 'Drittel', 4: 'Viertel', 5: 'Fünftel', 6: 'Sechstel', 8: 'Achtel', 10: 'Zehntel', 12: 'Zwölftel' };
