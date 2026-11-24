// Gemeinsame Bausteine für Klasse 6, Kapitel 1 „Brüche“ (ADR 0037).
// Grilling mit Nils (2026-11-24): Nenner F bis 10, G bis 20, M bis 50 und 100, E bis 200. Brüche über 1 ab G, auf F nur beim Umwandeln.
// Erweitert und gekürzt wird auf F mit 2, 3, 5 und 10, auf G mit Zahlen bis 10, auf M bis 12, auf E in mehreren Schritten.
// Ab „Brüche kürzen“ (6.1.3-K2) ist ein Bruch als Ergebnis vollständig gekürzt: bruch(…, { gekuerzt: true }).

import { B, br, opt, zz, wahl, mische } from '../werkzeug.mjs';
import { vorn, streu, fig, leer, benenne, bild, anz, NB, NBW, WERT, FREI, FORM, ggt, sortiere } from './5-9-brueche.mjs';

export { vorn, streu, fig, leer, benenne, bild, anz, NB, NBW, WERT, FREI, FORM, ggt, sortiere, B, br, opt, zz, wahl, mische };
export const b2 = ([z, n, g = 0]) => br(z, n, g);
export const teilerfremd = (z, n) => ggt(z, n) === 1;
// Ein vollständig gekürzter echter Bruch mit einem Nenner aus der Liste.
export const gekuerzt = (nenner, von = 1) => { const n = wahl(nenner), zs = vorn(n - von, von).filter((z) => teilerfremd(z, n)); return [wahl(zs), n]; };
export const kuerze = ([z, n]) => { const g = ggt(z, n); return [z / g, n / g]; };
export const wert = ([z, n]) => z / n;
export const gleichViel = (a, c) => a[0] * c[1] === c[0] * a[1];
// Nachweis: Erweitern oder Kürzen mit einer Zahl. gesucht: Die Zahl ist die Antwort.
export const UMF = (von, mit, wie, gesucht = false) => ({ art: 'umformen', von: b2(von), mit, wie, nach: b2(wie === 'erweitern' ? [von[0] * mit, von[1] * mit] : [von[0] / mit, von[1] / mit]), ...(gesucht ? { gesucht: true } : {}) });
export const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
export const HILFS = (wertText, grund) => ({ wert: String(wertText), grund });
export const ZEICHEN = (l, r, fv = 'zeichen-verwechselt') => { const d = l[0] * r[1] - r[0] * l[1]; return [opt('<', d < 0, d < 0 ? undefined : fv), opt('>', d > 0, d > 0 ? undefined : fv), opt('=', d === 0)]; };
// Zahlenstrahl in Bruchteilen: T Abstände je Ganzes, von 0 bis `bis` Ganze. Am Strahl stehen nur die Ganzen.
export const bstrahl = (T, bis = 1, extra = {}) => ({ von: 0, bis: bis * T, schritt: 1, beschriftung: T, teiler: T, ...extra });
// Zwei Streifen untereinander: gleich lang, verschieden geteilt.
export const zweiStreifen = (a, c) => bild(...benenne([fig('streifen', a[1], vorn(a[0])), fig('streifen', c[1], vorn(c[0]))]));
export const streifen = (z, n) => bild(fig('streifen', n, vorn(z)));
export const kreis = (z, n) => bild(fig('kreis', n, vorn(z)));
// Kürzel für die Wörter der Stammbrüche.
export const TEILWORT = { 2: 'Halbe', 3: 'Drittel', 4: 'Viertel', 5: 'Fünftel', 6: 'Sechstel', 8: 'Achtel', 10: 'Zehntel' };
