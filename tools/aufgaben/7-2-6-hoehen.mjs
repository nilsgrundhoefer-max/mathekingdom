// Aufgaben zu 7.2.6 „Höhen“ (Lernziele H1 und H2) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25): Höhen zeichnet man am Karogitter (Linie mit Bedingung „senkrecht zur Seite durch die Ecke“)
// und tippt Fußpunkte und den Höhenschnittpunkt an. Fehlvorstellungen: Höhe nicht senkrecht, Höhe zur Seitenmitte,
// falsche Ecke, Seite beim stumpfwinkligen Dreieck nicht verlängert. Heftaufgaben mit Kontrollwert auf M und E.
// H1: Höhen einzeichnen. H2: stumpfwinklige und rechtwinklige Dreiecke, Höhenschnittpunkt.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, figur, dreieckSss, dreieckFigur, cm, H, zahl, auswahl, opt, Z, ordnen, kind, gitterPunkte, gitterLinie, GT, PT, LN, FG, gitterBild, grad, R } from './7-2-figur.mjs';

const H1 = '7.2.6-H1', H2 = '7.2.6-H2';
const RICHT = { F: [[1, 0], [0, 1]], G: [[1, 0], [0, 1], [1, 1], [1, -1]], M: [[1, 0], [1, 1], [2, 1], [1, 2], [1, -1], [2, -1]], E: [[2, 1], [1, 2], [3, 1], [1, 3], [2, -1], [1, -2], [3, -1]] };
const NAMEN = { c: ['A', 'B', 'C'], a: ['B', 'C', 'A'], b: ['C', 'A', 'B'] };
// Ein Dreieck im Gitter: Grundseite P1P2 mit der Richtung u (m Schritte), Fußpunkt der Höhe bei t Schritten, Höhe k Schritte senkrecht.
// art: 'spitz' (Fuß innen), 'stumpf' (Fuß außen). Die Ecken heißen nach der Seite, auf der die Höhe steht.
function hoehenDreieck(niveau, { art = 'spitz', seite = 'c', richtung } = {}) {
  return suche(() => {
    const u = richtung ?? wahl(RICHT[niveau]), n = [-u[1], u[0]], lu = Math.hypot(...u), m = zz(2, Math.max(2, Math.floor(8 / lu)));
    const t = art === 'spitz' ? zz(1, m - 1) : wahl([zz(-3, -1), zz(m + 1, m + 3)]), k = zz(Math.max(1, Math.ceil(2 / lu)), Math.max(2, Math.floor(7 / lu)));
    const P = [[0, 0], [m * u[0], m * u[1]], [t * u[0] + k * n[0], t * u[1] + k * n[1]]], F = [t * u[0], t * u[1]];
    const xs = [...P, F].map((p) => p[0]), ys = [...P, F].map((p) => p[1]), dx = 1 - Math.min(...xs), dy = 1 - Math.min(...ys);
    const s = (p) => [p[0] + dx, p[1] + dy], [Q1, Q2, Q3] = P.map(s), [a, b, c] = NAMEN[seite];
    return { u, m, t, k, F: s(F), [a]: Q1, [b]: Q2, [c]: Q3, ecke: c, basis: [Q1, Q2], b: Math.max(...xs) + dx + 1, h: Math.max(...ys) + dy + 1, seite, laenge: k * lu };
  }, (d) => d.b <= 14 && d.h <= 11 && d.m >= 2 && (art !== 'spitz' || (d.t > 0 && d.t < d.m)));
}
const gitterVon = (d, extra = {}) => GT(d.b, d.h, { punkte: [PT('A', ...d.A), PT('B', ...d.B), PT('C', ...d.C)], figuren: [FG(null, [d.A, d.B, d.C])], ...extra, linien: extra.linien ?? [] });
const mitte = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const hName = (s) => `h_${s}`;
const hHoehe = (n, s) => H(n, `Die Höhe ${hName(s)} geht von der Ecke gegenüber der Seite ${s} aus. Sie steht senkrecht auf ${s}.`, 'Bei einer waagerechten Seite ist die Höhe eine senkrechte Linie nach oben oder unten.', `Lege das Geodreieck mit der Mittellinie auf die Seite ${s}.`);
// Höhe zeichnen: eine Linie senkrecht zur Seite durch die Ecke.
function hoeheZeichnen(n, text, opts = {}) {
  const d = hoehenDreieck(n, opts), E = d[d.ecke], [P1, P2] = d.basis, verl = opts.art === 'stumpf' && opts.verlaengert ? [LN(null, P1, P2, 'gerade', 'hilfs')] : []; // die ganze Gerade: Die Verlängerung reicht sicher bis zum Fußpunkt
  const fehler = [[{ art: 'strecke', a: E, b: mitte(P1, P2).every(Number.isInteger) ? mitte(P1, P2) : E }, 'hoehe-nicht-senkrecht'], [{ art: 'senkrecht', zu: [P1, P2], durch: P1 }, 'hoehe-falsche-seite'], [{ art: 'senkrecht', zu: [P1, P2], durch: P2 }, 'hoehe-falsche-seite']];
  return gitterLinie(text(d.seite, d.ecke), gitterVon(d, { linien: verl }), 'strecke', { art: 'senkrecht', zu: [P1, P2], durch: E }, [E, d.F], fehler.filter(([b]) => b.a !== b.b), hHoehe(n, d.seite), { nachweis: [{ art: 'linie' }, { art: 'hoehe', ecke: E, seite: [P1, P2], fuss: d.F }] });
}
function fusspunkt(n, text, opts = {}) {
  const d = hoehenDreieck(n, opts), [P1, P2] = d.basis, M = mitte(P1, P2);
  return gitterPunkte(text(d.seite, d.ecke), gitterVon(d, { linien: opts.art === 'stumpf' && opts.verlaengert ? [LN(null, P1, P2, 'gerade', 'hilfs')] : [] }), [d.F], M.every(Number.isInteger) && String(M) !== String(d.F) ? [[[M], 'hoehe-nicht-senkrecht']] : [],
    H(n, 'Der Fußpunkt ist das Ende der Höhe auf der Seite.', 'Gehe von der Ecke senkrecht zur Seite, bis du sie triffst.', 'Die Höhe bildet mit der Seite einen rechten Winkel.'), { nachweis: [{ art: 'hoehe', ecke: d[d.ecke], seite: [P1, P2], fuss: d.F }] });
}
// Welche Linie ist die Höhe? Drei Linien von C aus: die Höhe, die Linie zur Seitenmitte und eine schräge.
function welcheLinie(n, text) {
  const d = hoehenDreieck(n, { richtung: [1, 0] }), M = mitte(d.A, d.B); if (Math.abs(M[0] - d.F[0]) < 1) return null;
  const frei = []; for (let x = d.A[0] + 1; x < d.B[0]; x++) if (Math.abs(x - d.F[0]) >= 1 && Math.abs(x - M[0]) >= 1) frei.push(x);
  if (!frei.length) return null; const S = [wahl(frei), d.A[1]];
  const namen = mische(['p', 'q', 'r']), wo = { [namen[0]]: d.F, [namen[1]]: M, [namen[2]]: S };
  return auswahl(text, namen.map((x, i) => opt(x, i === 0, i === 0 ? undefined : 'hoehe-nicht-senkrecht')), hHoehe(n, 'c'),
    { bild: gitterBild(GT(d.b, d.h, { punkte: [PT('A', ...d.A), PT('B', ...d.B), PT('C', ...d.C)], figuren: [FG(null, [d.A, d.B, d.C])], linien: Object.entries(wo).map(([nm, p]) => LN(nm, d.C, p, 'strecke', 'hilfs')) })), nachweis: [{ art: 'hoehe', ecke: d.C, seite: [d.A, d.B], fuss: d.F, linie: namen[0] }] });
}
// Höhenschnittpunkt bei waagerechter Grundseite: A(0|0), B(c|0), C(x|y) ergibt H(x | x(c − x)/y).
function hoehenschnitt(art) {
  return suche(() => { const c = zz(4, 10), x = art === 'stumpf' ? wahl([zz(-3, -1), zz(c + 1, c + 3)]) : zz(1, c - 1), y = zz(2, 7), hy = (x * (c - x)) / y; return { c, x, y, hy }; },
    (t) => Number.isInteger(t.hy) && t.hy !== 0 && (art === 'stumpf' ? t.hy >= -4 : t.hy > 0 && t.hy < t.y) && Math.max(t.c, t.x) - Math.min(0, t.x) <= 12);
}
function hsGitter(t, mitHoehen) {
  const dx = 1 - Math.min(0, t.x), dy = 1 - Math.min(0, t.hy), A = [dx, dy], B = [dx + t.c, dy], C = [dx + t.x, dy + t.y], Hp = [dx + t.x, dy + t.hy];
  const fussA = null; // nur die Höhe h_c ist leicht zu zeichnen; dazu h_a durch A und H
  const g = GT(Math.max(B[0], C[0]) + 2, Math.max(C[1], A[1]) + 2, { punkte: [PT('A', ...A), PT('B', ...B), PT('C', ...C)], figuren: [FG(null, [A, B, C])],
    linien: mitHoehen ? [LN(null, C, [C[0], Math.min(A[1], Hp[1])], 'gerade', 'hilfs'), LN(null, A, Hp, 'gerade', 'hilfs')] : [] });
  return { A, B, C, H: Hp, g, fussA };
}

// ---------- H1: Höhen einzeichnen ----------
function h1() {
  sechs(H1, 'F', [
    () => hoeheZeichnen('F', (s, e) => Z(`Zeichne die Höhe ${hName(s)}.`, `Sie geht von ${e} aus und steht senkrecht auf ${s}.`), { richtung: [1, 0] }),
    () => fusspunkt('F', (s) => Z(`Die Höhe ${hName(s)} trifft die Seite ${s} im Fußpunkt.`, 'Tippe den Fußpunkt an.'), { richtung: [1, 0] }),
    () => welcheLinie('F', Z('Von C gehen drei Linien aus.', 'Welche Linie ist die Höhe h_c?', 'Kreuze an.')),
    () => hoeheZeichnen('F', (s, e) => Z(`Zeichne die Höhe ${hName(s)} von ${e} aus.`), { richtung: [0, 1], seite: wahl(['a', 'b']) }),
    () => { const d = hoehenDreieck('F', { richtung: [1, 0] });
      return zahl(Z('Die Höhe h_c geht von C senkrecht zur Seite c.', 'Zähle die Kästchen.', 'Wie lang ist h_c?'), d.k, [[Math.abs(d.C[0] - d.A[0]), 'hoehe-nicht-senkrecht']].filter(([x]) => x !== d.k),
        H('F', 'Die Höhe geht senkrecht nach unten bis zur Seite c.', 'Liegt C 4 Kästchen über c, ist h_c 4 Kästchen lang.', 'Zähle die Kästchen von C bis zur Seite c.'), { einheit: 'Kästchen', bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'gitterlaenge', a: d.C, b: d.F, wert: d.k }] }); },
    () => hoeheZeichnen('F', (s, e) => Z('Das Dach hat die Form eines Dreiecks.', `Zeichne die Höhe ${hName(s)} von der Spitze ${e} aus.`), { richtung: [1, 0] }),
  ]);
  sechs(H1, 'G', [
    () => hoeheZeichnen('G', (s, e) => Z(`Zeichne die Höhe ${hName(s)} ein.`), { seite: wahl(['a', 'b', 'c']) }),
    () => hoeheZeichnen('G', (s, e) => Z(`Zeichne die Höhe ${hName(s)}.`, `Sie geht von ${e} aus.`), { richtung: wahl([[1, 1], [1, -1]]) }),
    () => fusspunkt('G', (s) => Z(`Tippe den Fußpunkt der Höhe ${hName(s)} an.`), { richtung: wahl([[1, 1], [1, -1]]), seite: wahl(['a', 'b', 'c']) }),
    () => welcheLinie('G', Z('Welche Linie ist die Höhe h_c?', 'Kreuze an.')),
    () => { const d = hoehenDreieck('G', { richtung: [0, 1], seite: wahl(['a', 'b']) });
      return zahl(Z(`Zähle die Kästchen.`, `Wie lang ist die Höhe ${hName(d.seite)}?`), d.k, [], H('G', 'Die Höhe steht senkrecht auf der Seite.', 'Bei einer senkrechten Seite ist die Höhe waagerecht.', `Zähle von ${d.ecke} aus waagerecht bis zur Seite.`),
        { einheit: 'Kästchen', bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'gitterlaenge', a: d[d.ecke], b: d.F, wert: d.k }] }); },
    () => { const k = kind();
      return auswahl(Z(`${k} zeichnet die Höhe h_c von C zur Mitte der Seite c.`, 'Kreuze die richtige Begründung an.'),
        [opt('Das ist falsch. Die Höhe muss senkrecht auf c stehen. Sie trifft c meist nicht in der Mitte.', true), opt('Das ist richtig. Die Höhe halbiert immer die Seite.', false, 'hoehe-nicht-senkrecht'), opt('Das ist richtig. Jede Linie von C zur Seite c ist eine Höhe.', false, 'hoehe-nicht-senkrecht')],
        hHoehe('G', 'c'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(H1, 'M', [
    () => hoeheZeichnen('M', (s) => `Zeichne die Höhe ${hName(s)} ein.`, { seite: wahl(['a', 'b', 'c']) }),
    () => { const [a, b, c] = suche(() => [zz(4, 8), zz(4, 8), zz(5, 9)], ([p, q, r]) => p + q > r + 2 && p + r > q + 2 && q + r > p + 2 && p * p + q * q > r * r + 4 && p * p + r * r > q * q + 4 && q * q + r * r > p * p + 4);
      const s = (a + b + c) / 2, F = Math.sqrt(s * (s - a) * (s - b) * (s - c)), hc = Math.round((20 * F) / c);
      return zahl(`Konstruiere im Heft ein Dreieck mit a = ${cm(a)}, b = ${cm(b)} und c = ${cm(c)}. Zeichne die Höhe h_c ein und miss ihre Länge in Millimetern.`, hc, [], H('M', 'Konstruiere zuerst nach sss. Lege dann das Geodreieck mit der Mittellinie auf c.', 'Verschiebe das Geodreieck, bis die Kante durch C geht. Miss dann von C bis zu c.'),
        { einheit: 'mm', toleranz: 2, nachweis: [{ art: 'heft', gegeben: { a, b, c }, gesucht: 'h_c', satz: 'sss' }] }); },
    () => fusspunkt('M', (s) => `Tippe den Fußpunkt der Höhe ${hName(s)} an.`, { seite: wahl(['a', 'b', 'c']) }),
    () => { const s = wahl(['a', 'b', 'c']), e = { a: 'A', b: 'B', c: 'C' }[s];
      return auswahl(`Von welcher Ecke geht die Höhe ${hName(s)} aus, und auf welcher Seite steht sie senkrecht? Kreuze an.`, [opt(`von ${e}, senkrecht auf ${s}`, true), ...['A', 'B', 'C'].filter((x) => x !== e).map((x) => opt(`von ${x}, senkrecht auf ${s}`, false, 'hoehe-falsche-seite')), opt(`von ${e}, zur Mitte von ${s}`, false, 'hoehe-nicht-senkrecht')],
        hHoehe('M', s), { nachweis: [{ art: 'name', hoehe: s, ecke: e }] }); },
    () => { const d = hoehenDreieck('M', { richtung: wahl([[1, 1], [1, -1]]) }), F = d.F, l = Math.abs(d.C[0] - F[0]);
      return zahl(`Die Höhe h_c verläuft schräg durch die Kästchen. Bestimme, wie viele Kästchendiagonalen sie lang ist.`, l, [[Math.abs(d.C[1] - d.A[1]), 'hoehe-nicht-senkrecht']].filter(([x]) => x !== l),
        H('M', 'Zeichne die Höhe zuerst ein. Sie geht von C senkrecht zu c.', 'Zähle die Diagonalen der Kästchen von C bis zum Fußpunkt.'), { bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'gitterlaenge', a: d.C, b: F, wert: l, diagonal: true }] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Die Höhe h_c steht senkrecht zum unteren Heftrand.“ Erkläre, wann das falsch ist. Kreuze an.`,
        [opt('Wenn c schräg liegt. Die Höhe steht senkrecht auf c, nicht auf dem Heftrand.', true), opt('Nie. Höhen gehen immer von oben nach unten.', false, 'hoehe-nicht-senkrecht'), opt('Nur bei stumpfwinkligen Dreiecken.', false, 'hoehe-falsche-seite'), opt('Wenn das Dreieck klein ist.', false, 'hoehe-nicht-senkrecht')],
        hHoehe('M', 'c'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(H1, 'E', [
    () => hoeheZeichnen('E', (s) => `Zeichne die Höhe ${hName(s)} ein.`, { seite: wahl(['a', 'b', 'c']) }),
    () => fusspunkt('E', (s) => `Tippe den Fußpunkt der Höhe ${hName(s)} an.`, { seite: wahl(['a', 'b', 'c']) }),
    () => { const [a, b, c] = suche(() => [zz(4, 9), zz(4, 9), zz(5, 10)], ([p, q, r]) => p + q > r + 2 && p + r > q + 2 && q + r > p + 2 && p * p + q * q > r * r + 4 && p * p + r * r > q * q + 4 && q * q + r * r > p * p + 4);
      const s = (a + b + c) / 2, F = Math.sqrt(s * (s - a) * (s - b) * (s - c)), ha = Math.round((20 * F) / a);
      return zahl(`Konstruiere im Heft ein Dreieck mit a = ${cm(a)}, b = ${cm(b)} und c = ${cm(c)}. Zeichne die Höhe h_a ein und miss ihre Länge in Millimetern.`, ha, [], H('E', 'h_a geht von A aus und steht senkrecht auf a.'),
        { einheit: 'mm', toleranz: 2, nachweis: [{ art: 'heft', gegeben: { a, b, c }, gesucht: 'h_a', satz: 'sss' }] }); },
    () => { const k = kind(), d = hoehenDreieck('E', { seite: 'c' });
      return auswahl(`${k} zeichnet die Höhe h_c von C aus senkrecht auf die Seite a. Erkläre den Fehler. Kreuze an.`,
        [opt('h_c steht senkrecht auf c. Senkrecht auf a steht die Höhe h_a, und sie geht von A aus.', true), opt('Das ist richtig, a liegt bei C.', false, 'hoehe-falsche-seite'), opt('Die Höhe muss zur Mitte von c gehen.', false, 'hoehe-nicht-senkrecht'), opt('Eine Höhe darf nie an einer Ecke beginnen.', false, 'hoehe-falsche-seite')],
        hHoehe('E', 'c'), { bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const [a, b] = wahl([[3, 4], [6, 8], [4, 3], [8, 6]]), c = Math.hypot(a, b), h = (a * b) / c; // h_c hat höchstens eine Nachkommastelle
      return zahl(`Ein Dreieck hat bei C einen rechten Winkel und die Seiten a = ${a} cm, b = ${b} cm und c = ${c} cm. Die Höhe h_c ist ${String(h).replace('.', ',')} cm lang. Bestimme die Länge der Höhe h_a in Zentimetern.`, b, [[h, 'hoehe-falsche-seite'], [a, 'hoehe-falsche-seite']].filter(([x]) => Number.isInteger(x)),
        H('E', 'Im rechtwinkligen Dreieck sind zwei Seiten zugleich Höhen.'), { einheit: 'cm', nachweis: [{ art: 'name', hoehe: 'a', ist: 'b' }, { zahl: a, grund: 'a wird nicht gebraucht' }, { zahl: c, grund: 'c wird nicht gebraucht' }, { zahl: h, grund: `h_c = ${String(h).replace('.', ',')} cm wird nicht gebraucht` }] }); },
    () => ordnen('Zeichne die Höhe h_c mit dem Geodreieck. Ordne die Schritte.', ['Lege die Mittellinie des Geodreiecks auf die Seite c.', 'Verschiebe das Geodreieck entlang c, bis seine Kante durch C geht.', 'Zeichne von C aus an der Kante entlang bis zur Seite c.', 'Markiere den Fußpunkt und schreibe h_c an die Strecke.'], H('E', 'Die Mittellinie liegt immer auf der Seite.')),
  ]);
}

// ---------- H2: stumpf- und rechtwinklige Dreiecke, Höhenschnittpunkt ----------
function h2() {
  const hStumpf = (n) => H(n, 'Im stumpfwinkligen Dreieck liegt der Fußpunkt mancher Höhen außerhalb.', 'Dann verlängerst du die Seite über die Ecke hinaus.', 'Zeichne die Verlängerung dünn und gehe von der Ecke senkrecht darauf.');
  const hSchnitt = (n) => H(n, 'Die drei Höhen schneiden sich in einem Punkt.', 'Zwei Höhen reichen, um den Schnittpunkt zu finden.', 'Folge beiden Höhen bis zu ihrem Schnittpunkt.');
  const schnitt = (n, art, text, mitHoehen) => { const t = hoehenschnitt(art), s = hsGitter(t, mitHoehen);
    return gitterPunkte(text, s.g, [s.H], [[[s.C], 'hoehe-falsche-seite']], hSchnitt(n), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'hoehenschnitt', ecken: [s.A, s.B, s.C] }] }] }); };
  sechs(H2, 'F', [
    () => hoeheZeichnen('F', (s, e) => Z('Das Dreieck ist stumpfwinklig.', 'Die Seite c ist schon verlängert.', `Zeichne die Höhe ${hName(s)} von ${e} aus.`), { art: 'stumpf', richtung: [1, 0], verlaengert: true }),
    () => fusspunkt('F', (s) => Z('Die Seite c ist verlängert.', `Tippe den Fußpunkt der Höhe ${hName(s)} an.`), { art: 'stumpf', richtung: [1, 0], verlaengert: true }),
    () => { const d = hoehenDreieck('F', { art: 'stumpf', richtung: [1, 0] });
      return auswahl(Z('Das Dreieck ist stumpfwinklig.', 'Wo liegt der Fußpunkt von h_c?', 'Kreuze an.'), [opt('außerhalb der Seite c', true), opt('in der Mitte von c', false, 'hoehe-nicht-senkrecht'), opt('genau bei A', false, 'hoehe-falsche-seite')], hStumpf('F'),
        { bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'hoehe', ecke: d.C, seite: [d.A, d.B], fuss: d.F, aussen: true }] }); },
    () => { const s = wahl(['a', 'b']);
      return auswahl(Z('Das Dreieck hat bei C einen rechten Winkel.', `Welche Seite ist zugleich die Höhe ${hName(s)}?`, 'Kreuze an.'), ['a', 'b', 'c'].map((x) => opt(x, x === (s === 'a' ? 'b' : 'a'), x === (s === 'a' ? 'b' : 'a') ? undefined : 'hoehe-falsche-seite')),
        H('F', 'Die Seiten a und b stehen senkrecht aufeinander.', 'b steht senkrecht auf a und geht von A aus. Also ist b die Höhe h_a.', `Welche Seite steht senkrecht auf ${s}?`), { bild: dreieckFigur(dreieckSss(3, 4, 5), { w: { C: { wert: 90 } } }), nachweis: [{ art: 'name', hoehe: s, ist: s === 'a' ? 'b' : 'a' }] }); },
    () => schnitt('F', 'spitz', Z('Zwei Höhen sind schon gezeichnet.', 'Tippe den Schnittpunkt H der beiden Höhen an.'), true),
    () => hoeheZeichnen('F', (s, e) => Z('Die Seite c ist verlängert.', `Zeichne die Höhe ${hName(s)}.`), { art: 'stumpf', richtung: [1, 0], verlaengert: true }),
  ]);
  sechs(H2, 'G', [
    () => hoeheZeichnen('G', (s, e) => Z('Das Dreieck ist stumpfwinklig.', `Zeichne die Höhe ${hName(s)} von ${e} aus.`), { art: 'stumpf', richtung: wahl([[1, 0], [0, 1]]), seite: wahl(['a', 'b', 'c']), verlaengert: true }),
    () => fusspunkt('G', (s) => Z(`Tippe den Fußpunkt der Höhe ${hName(s)} an.`, 'Er liegt außerhalb des Dreiecks.'), { art: 'stumpf', richtung: wahl([[1, 0], [0, 1]]) }),
    () => schnitt('G', 'spitz', Z('Zwei Höhen sind gezeichnet.', 'Tippe den Höhenschnittpunkt an.'), true),
    () => { const d = hoehenDreieck('G', { art: 'stumpf', richtung: [1, 0] });
      return auswahl(Z('Wo liegt der Fußpunkt der Höhe h_c?', 'Kreuze an.'), [opt('auf der Verlängerung von c', true), opt('in der Mitte von c', false, 'hoehe-nicht-senkrecht'), opt('auf der Seite a', false, 'hoehe-falsche-seite')], hStumpf('G'),
        { bild: gitterBild(gitterVon(d)), nachweis: [{ art: 'hoehe', ecke: d.C, seite: [d.A, d.B], fuss: d.F, aussen: true }] }); },
    () => schnitt('G', 'stumpf', Z('Das Dreieck ist stumpfwinklig.', 'Zwei Höhen sind gezeichnet.', 'Tippe den Höhenschnittpunkt an.'), true),
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Im stumpfwinkligen Dreieck gibt es keine Höhe h_c.“`, 'Kreuze die richtige Begründung an.'),
        [opt('Das stimmt nicht. Man verlängert c, dann steht h_c senkrecht auf der Verlängerung.', true), opt('Das stimmt. Die Höhe passt nicht ins Dreieck.', false, 'hoehe-falsche-seite'), opt('Das stimmt nicht. h_c geht dann zur Mitte von c.', false, 'hoehe-nicht-senkrecht')],
        hStumpf('G'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(H2, 'M', [
    () => hoeheZeichnen('M', (s) => `Das Dreieck ist stumpfwinklig. Zeichne die Höhe ${hName(s)} ein.`, { art: 'stumpf', seite: wahl(['a', 'b', 'c']) }),
    () => schnitt('M', 'spitz', 'Zeichne zwei Höhen in Gedanken oder auf Papier. Tippe den Höhenschnittpunkt an.', false),
    () => fusspunkt('M', (s) => `Tippe den Fußpunkt der Höhe ${hName(s)} an.`, { art: 'stumpf', seite: wahl(['a', 'b', 'c']) }),
    () => { const art = wahl(['spitz', 'recht', 'stumpf']);
      return auswahl(`Wo liegt der Höhenschnittpunkt in einem ${{ spitz: 'spitzwinkligen', recht: 'rechtwinkligen', stumpf: 'stumpfwinkligen' }[art]} Dreieck? Kreuze an.`,
        [opt({ spitz: 'innerhalb des Dreiecks', recht: 'in der Ecke mit dem rechten Winkel', stumpf: 'außerhalb des Dreiecks' }[art], true), ...['innerhalb des Dreiecks', 'in der Ecke mit dem rechten Winkel', 'außerhalb des Dreiecks'].filter((x) => x !== { spitz: 'innerhalb des Dreiecks', recht: 'in der Ecke mit dem rechten Winkel', stumpf: 'außerhalb des Dreiecks' }[art]).map((x) => opt(x, false, 'innen-aussen-verwechselt'))],
        H('M', 'Zeichne für jede Art ein Beispiel und probiere es aus.', 'Spitzwinklig: innen. Rechtwinklig: in der Ecke. Stumpfwinklig: außen.'), { nachweis: [{ art: 'hoehenschnitt', dreieck: art }] }); },
    () => schnitt('M', 'stumpf', 'Das Dreieck ist stumpfwinklig. Zwei Höhen sind gezeichnet. Tippe den Höhenschnittpunkt an.', true),
    () => { const k = kind();
      return auswahl(`${k} findet im rechtwinkligen Dreieck mit γ = 90° den Höhenschnittpunkt nicht, weil „man nur eine Höhe zeichnen kann“. Erkläre. Kreuze an.`,
        [opt('Die Seiten a und b sind selbst Höhen. Sie schneiden sich in C, also ist H = C.', true), opt('Im rechtwinkligen Dreieck gibt es keinen Höhenschnittpunkt.', false, 'hoehe-falsche-seite'), opt('H liegt auf der Mitte von c.', false, 'hoehe-nicht-senkrecht'), opt('H liegt außerhalb.', false, 'innen-aussen-verwechselt')],
        H('M', 'Welche Seiten stehen senkrecht aufeinander?', 'a und b stehen senkrecht. Sie sind selbst Höhen und schneiden sich in C.'), { nachweis: [{ art: 'urteil', stimmt: false }, { art: 'hoehenschnitt', dreieck: 'recht' }] }); },
  ]);
  sechs(H2, 'E', [
    () => schnitt('E', 'stumpf', 'Das Dreieck ist stumpfwinklig. Bestimme den Höhenschnittpunkt H und tippe ihn an.', false),
    () => hoeheZeichnen('E', (s) => `Zeichne die Höhe ${hName(s)} ein.`, { art: 'stumpf', seite: wahl(['a', 'b']) }),
    () => schnitt('E', 'spitz', 'Bestimme den Höhenschnittpunkt H des Dreiecks und tippe ihn an.', false),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Im stumpfwinkligen Dreieck liegen alle drei Fußpunkte außerhalb.“ Beurteile die Aussage. Kreuze an.`,
        [opt('Falsch. Die Höhe von der Ecke mit dem stumpfen Winkel hat ihren Fußpunkt auf der Gegenseite.', true), opt('Richtig. Darum muss man alle Seiten verlängern.', false, 'hoehe-falsche-seite'), opt('Richtig. Auch H liegt außerhalb.', false, 'innen-aussen-verwechselt'), opt('Falsch. Alle Fußpunkte liegen innen.', false, 'hoehe-falsche-seite')],
        H('E', 'Zeichne ein stumpfwinkliges Dreieck und alle drei Höhen.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const g = zz(20, 70);
      // Im Dreieck ABC sei H der Höhenschnittpunkt. ∢AHB = 180° − γ (Viereck aus zwei Fußpunkten, C und H mit zwei rechten Winkeln).
      return grad(`Im spitzwinkligen Dreieck ABC ist γ = ${g}°. H ist der Höhenschnittpunkt. Bestimme den Winkel ∢AHB.`, 180 - g, [[g, 'hoehe-falsche-seite'], [90 - g, 'hoehe-nicht-senkrecht']],
        H('E', 'Das Viereck aus C, den Fußpunkten von h_a und h_b und H hat zwei rechte Winkel.'), { nachweis: [R(`360° − 90° − 90° − ${g}° = ${180 - g}°`)] }); },
    () => ordnen('Bestimme den Höhenschnittpunkt eines stumpfwinkligen Dreiecks. Ordne die Schritte.', ['Verlängere die beiden Seiten am stumpfen Winkel über die Ecke hinaus.', 'Zeichne zwei Höhen senkrecht auf die Verlängerungen.', 'Verlängere die beiden Höhen über die Ecken hinaus.', 'Der Schnittpunkt der verlängerten Höhen ist H. Er liegt außerhalb.'], H('E', 'Ohne Verlängerung keine Höhe.')),
  ]);
}

export function hoehen() { h1(); h2(); }
