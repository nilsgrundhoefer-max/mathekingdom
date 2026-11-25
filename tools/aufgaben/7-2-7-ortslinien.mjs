// Aufgaben zu 7.2.7 „Mittelsenkrechte. Winkelhalbierende“ (Lernziele O1 und O2) und zu den Purpur-Abstechern
// 7.2.X2 „Mittelsenkrechte. Umkreis“ und 7.2.X3 „Winkelhalbierende. Inkreis“ (nur E) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25), Niveauübersicht K02: Ortslinien auf G nur Kreis und Mittelsenkrechte, die Winkelhalbierende
// als Ortslinie ab M. E: Ortslinien mit zwei Bedingungen einschließlich Mittelparallele, Fehlersuche, Zirkel und Lineal.
// Am Karogitter liegen alle Lösungen auf Gitterpunkten: Winkelhalbierende mit ganzzahliger Richtung, Kreise mit r = 5.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, figur, plus, dir, drehe, cm, WERT, GESUCHT, NAME, H, grad, zahl, auswahl, opt, luecken, lk, Z, ordnen, FIG, R, winkelFuer, drehFuer, kind, gitterPunkte, gitterLinie, gitterKreis, gitterBild, GT, PT, LN, FG, dreieckAus, dreieckBild, kuerze } from './7-2-figur.mjs';

const O1 = '7.2.7-O1', O2 = '7.2.7-O2', X2 = '7.2.X2-U1', X3 = '7.2.X3-I1';
const AUF5 = [[3, 4], [4, 3], [-3, 4], [-4, 3], [0, 5], [5, 0], [3, -4], [4, -3], [-3, -4], [-4, -3], [0, -5], [-5, 0]];
const plusG = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
// Eine Strecke AB mit ganzzahliger Mitte. richt: Richtung von A nach B (halbe Strecke = k · richt).
function strecke(niveau) {
  const r = wahl({ F: [[1, 0], [0, 1]], G: [[1, 0], [0, 1], [1, 1], [1, -1]], M: [[1, 0], [2, 1], [1, 1], [1, -2], [1, 2]], E: [[2, 1], [1, 2], [3, 1], [1, -1], [2, -1]] }[niveau]);
  const k = r[0] && r[1] ? (Math.abs(r[0]) + Math.abs(r[1]) > 2 ? 1 : 2) : zz(2, 4), M = [7, 5], A = plusG(M, r, -k), B = plusG(M, r, k);
  return { A, B, M, r, n: [-r[1], r[0]], k };
}
const hMS = (n) => H(n, 'Die Mittelsenkrechte geht durch die Mitte von AB und steht senkrecht auf AB.', 'Ist AB waagerecht, ist die Mittelsenkrechte eine senkrechte Linie durch die Mitte.', 'Finde zuerst die Mitte. Zeichne dann senkrecht dazu.');
const msZeichnen = (n, text) => { const s = strecke(n);
  return gitterLinie(text, GT(14, 10, { punkte: [PT('A', ...s.A), PT('B', ...s.B)], linien: [LN(null, s.A, s.B, 'strecke')] }), 'gerade', { art: 'senkrecht', zu: [s.A, s.B], durch: s.M }, [s.M, plusG(s.M, s.n)],
    [[{ art: 'senkrecht', zu: [s.A, s.B], durch: s.A }, 'mittelsenkrechte-nicht-mittig'], [{ art: 'senkrecht', zu: [s.A, s.B], durch: s.B }, 'mittelsenkrechte-nicht-mittig'], [{ art: 'gerade', a: s.A, b: s.B }, 'mittelsenkrechte-nicht-mittig']], hMS(n),
    { nachweis: [{ art: 'linie' }, { art: 'mittelsenkrechte', a: s.A, b: s.B }] }); };
// Punkte auf einer Geraden p (waagerecht), die von A und B gleich weit entfernt sind, oder Punkte mit Abstand 5 von P.
function zweiBedingungen(n, text, art) {
  const O = [7, 5], [a, b] = wahl(AUF5.filter(([x, y]) => y > 0 && x !== 0).map((p) => [p, [-p[0], p[1]]])), P = O;
  if (art === 'kreis-ms') { // Mittelsenkrechte von AB (senkrecht, x = O.x + a.x) schneidet den Kreis um P (r = 5) in zwei Punkten.
    const x = O[0] + a[0], A = [x - zz(2, 3), 1], B = [2 * x - A[0], 1], L1 = [x, O[1] + a[1]], L2 = [x, O[1] - a[1]];
    if (A[0] < 0 || B[0] > 14) return null;
    return gitterPunkte(text, GT(14, 11, { punkte: [PT('A', ...A), PT('B', ...B), PT('P', ...P)], kreise: [{ m: P, r: 5 }] }), [L1, L2].filter((q) => q[1] >= 0 && q[1] <= 11), [[[L1], 'ortslinie-verwechselt']],
      H(n, 'Die gesuchten Punkte liegen auf dem Kreis und auf der Mittelsenkrechten von AB.', 'Zeichne die Mittelsenkrechte ein. Wo schneidet sie den Kreis?', 'Die Mittelsenkrechte geht senkrecht durch die Mitte von AB.'),
      { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: P, r: 5 }, { art: 'gleichweit', a: A, b: B }] }] });
  }
  const y = O[1] + a[1], L1 = [O[0] + a[0], y], L2 = [O[0] + b[0], y]; // Kreis um P (r = 5) und waagerechte Gerade p
  return gitterPunkte(text, GT(14, 11, { punkte: [PT('P', ...P)], linien: [LN('p', [0, y], [14, y], 'gerade')], kreise: [] }), [L1, L2], [[[L1], 'ortslinie-verwechselt']],
    H(n, 'Alle Punkte mit Abstand 5 von P liegen auf einem Kreis um P.', 'Zeichne den Kreis in Gedanken. Wo schneidet er p?', 'Zähle von P aus: Gehe auf p, bis der Abstand 5 Kästchen ist.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: P, r: 5 }, { art: 'auf', a: [0, y], b: [14, y] }] }] });
}

// ---------- O1: Mittelsenkrechte und Kreis als Ortslinien ----------
function o1() {
  sechs(O1, 'F', [
    () => { const s = strecke('F'); return gitterPunkte(Z('Tippe die Mitte der Strecke AB an.'), GT(14, 10, { punkte: [PT('A', ...s.A), PT('B', ...s.B)], linien: [LN(null, s.A, s.B, 'strecke')] }), [s.M], [],
      H('F', 'Die Mitte ist von A und B gleich weit entfernt.', 'Ist AB 6 Kästchen lang, ist die Mitte 3 Kästchen von A entfernt.', 'Zähle die Kästchen von A bis B und halbiere.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'mitte', a: s.A, b: s.B }] }] }); },
    () => msZeichnen('F', Z('Zeichne die Mittelsenkrechte der Strecke AB.')),
    () => { const m = [zz(4, 9), zz(4, 6)], r = zz(2, 3);
      return gitterKreis(Z(`Alle Punkte mit ${r} Kästchen Abstand von M liegen auf einer Linie.`, 'Zeichne diese Linie.', 'Tippe zuerst M und dann einen Punkt der Linie an.'), GT(14, 10, { punkte: [PT('M', ...m)] }), m, r, [m[0] + r, m[1]], [[{ r: 2 * r }, 'ortslinie-verwechselt']],
        H('F', 'Gleich weit von einem Punkt: Das ist ein Kreis.', `Der Kreis um M hat den Radius ${r} Kästchen.`, 'Tippe M an und dann einen Punkt, der genau so weit weg ist.'), { nachweis: [{ art: 'kreisGitter', r }] }); },
    () => { const s = strecke('F'), andere = plusG(s.M, s.r, 1);
      return auswahl(Z('Welche Linie ist die Mittelsenkrechte von AB?', 'Kreuze an.'), [opt('m', true), opt('s', false, 'mittelsenkrechte-nicht-mittig'), opt('t', false, 'mittelsenkrechte-nicht-mittig')], hMS('F'),
        { bild: gitterBild(GT(14, 10, { punkte: [PT('A', ...s.A), PT('B', ...s.B)], linien: [LN(null, s.A, s.B, 'strecke'), LN('m', s.M, plusG(s.M, s.n), 'gerade'), LN('s', andere, plusG(andere, s.n), 'gerade'), LN('t', s.M, plusG(s.M, plusG(s.n, s.r)), 'gerade')] })), nachweis: [{ art: 'mittelsenkrechte', a: s.A, b: s.B, linie: 'm' }] }); },
    () => zweiBedingungen('F', Z('Gesucht sind Punkte auf der Geraden p.', 'Sie sollen 5 Kästchen von P entfernt sein.', 'Tippe beide Punkte an.'), 'kreis-p'),
    () => msZeichnen('F', Z('Ein Spielplatz soll gleich weit von zwei Häusern A und B entfernt sein.', 'Zeichne die Linie, auf der er liegen kann.')),
  ]);
  sechs(O1, 'G', [
    () => msZeichnen('G', Z('Zeichne die Mittelsenkrechte von AB.')),
    () => zweiBedingungen('G', Z('Gesucht sind Punkte mit gleich weitem Abstand von A und B.', 'Sie sollen auch 5 Kästchen von P entfernt sein.', 'Tippe sie an.'), 'kreis-ms'),
    () => zweiBedingungen('G', Z('Tippe die Punkte auf p an.', 'Sie sollen 5 Kästchen von P entfernt sein.'), 'kreis-p'),
    () => { const s = strecke('G'); return gitterPunkte(Z('Tippe die Mitte von AB an.'), GT(14, 10, { punkte: [PT('A', ...s.A), PT('B', ...s.B)], linien: [LN(null, s.A, s.B, 'strecke')] }), [s.M], [],
      H('G', 'Gehe von A aus halb so weit nach rechts und halb so weit nach oben wie bis B.', 'Von A nach B: 4 rechts, 2 hoch. Die Mitte: 2 rechts, 1 hoch.', 'Halbiere beide Schritte.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'mitte', a: s.A, b: s.B }] }] }); },
    () => { const r = zz(2, 4), m = [zz(4, 9), zz(4, 6)];
      return gitterKreis(Z(`Ein Hund ist an einem Pfahl M mit einer Leine von ${r} Kästchen angebunden.`, 'Bis dorthin kommt er gerade noch.', 'Zeichne diese Grenze.'), GT(14, 10, { punkte: [PT('M', ...m)] }), m, r, [m[0], m[1] + r], [[{ r: 2 * r }, 'ortslinie-verwechselt']],
        H('G', 'Alle Punkte mit gleichem Abstand von M liegen auf einem Kreis.', 'Die Leine ist der Radius.', 'Tippe M und dann einen Punkt im Abstand der Leine an.'), { nachweis: [{ art: 'kreisGitter', r }] }); },
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Der Punkt P liegt auf der Mittelsenkrechten von AB.“`, '„Also ist P von A und B gleich weit entfernt.“', 'Kreuze die richtige Begründung an.'),
        [opt('Das stimmt. Jeder Punkt der Mittelsenkrechten ist von A und B gleich weit entfernt.', true), opt('Das stimmt nur für die Mitte von AB.', false, 'mittelsenkrechte-nicht-mittig'), opt('Das stimmt nicht. P ist näher an A.', false, 'ortslinie-verwechselt')],
        hMS('G'), { nachweis: [{ art: 'urteil', stimmt: true }] }); },
  ]);
  sechs(O1, 'M', [
    () => msZeichnen('M', 'Zeichne die Mittelsenkrechte der Strecke AB.'),
    () => zweiBedingungen('M', 'Gesucht sind alle Punkte, die von A und B gleich weit und von P genau 5 Kästchen entfernt sind. Tippe sie an.', 'kreis-ms'),
    () => { const w = wahl(['ms', 'kreis', 'par']);
      return auswahl(`Welche Ortslinie gehört zur Bedingung: „${{ ms: 'gleich weit von A und B entfernt', kreis: 'genau 3 cm von M entfernt', par: 'genau 3 cm von der Geraden g entfernt' }[w]}“? Kreuze an.`,
        [opt('die Mittelsenkrechte von AB', w === 'ms', w === 'ms' ? undefined : 'ortslinie-verwechselt'), opt('ein Kreis um M', w === 'kreis', w === 'kreis' ? undefined : 'ortslinie-verwechselt'), opt('zwei Parallelen zu g', w === 'par', w === 'par' ? undefined : 'ortslinie-verwechselt'), opt('die Winkelhalbierende', false, 'ortslinie-verwechselt')],
        H('M', 'Abstand zu einem Punkt, zu zwei Punkten oder zu einer Geraden?', 'Ein Punkt: Kreis. Zwei Punkte: Mittelsenkrechte. Eine Gerade: zwei Parallelen.'), { nachweis: [{ art: 'ortslinie', was: w, ...(w === 'ms' ? {} : { abstand: 3 }) }] }); },
    () => zweiBedingungen('M', 'Tippe alle Punkte auf p an, die vom Punkt P genau 5 Kästchen entfernt sind.', 'kreis-p'),
    () => { const s = strecke('M'), Q = plusG(s.M, s.n, wahl([2, 3, -2])), d = Math.hypot(Q[0] - s.A[0], Q[1] - s.A[1]);
      return auswahl(`Q liegt auf der Mittelsenkrechten von AB. Der Abstand von Q zu A ist ${cm(String(Math.round(d * 5) / 10))}. Bestimme den Abstand von Q zu B. Kreuze an.`, [opt(`${cm(String(Math.round(d * 5) / 10))}`, true), opt('Das kann man nicht wissen.', false, 'ortslinie-verwechselt'), opt(`${cm(String(Math.round(d * 10) / 10))}`, false, 'mittelsenkrechte-nicht-mittig')],
        hMS('M'), { bild: gitterBild(GT(14, 10, { punkte: [PT('A', ...s.A), PT('B', ...s.B), PT('Q', ...Q)], linien: [LN(null, s.A, s.B, 'strecke'), LN('m', s.M, plusG(s.M, s.n), 'gerade', 'hilfs')] })), nachweis: [{ art: 'mittelsenkrechte', a: s.A, b: s.B, punkt: Q }, { zahl: Math.round(d * 5) / 10, grund: `QA = QB = ${cm(String(Math.round(d * 5) / 10))}` }] }); },
    () => { const k = kind();
      return auswahl(`${k} soll einen Treffpunkt finden, der von drei Freunden A, B und C gleich weit entfernt ist. ${k} zeichnet nur die Mittelsenkrechte von AB. Beurteile. Kreuze an.`,
        [opt('Das reicht nicht. Man braucht noch die Mittelsenkrechte von BC. Der Schnittpunkt ist der Treffpunkt.', true), opt('Das reicht. Jeder Punkt darauf passt.', false, 'ortslinie-verwechselt'), opt('Man muss einen Kreis um A zeichnen.', false, 'ortslinie-verwechselt'), opt('Der Treffpunkt ist die Mitte von AB.', false, 'mittelsenkrechte-nicht-mittig')],
        H('M', 'Drei Bedingungen: gleich weit von A und B, gleich weit von B und C.', 'Jede Bedingung hat eine Mittelsenkrechte. Der Treffpunkt ist ihr Schnittpunkt.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(O1, 'E', [
    () => msZeichnen('E', 'Zeichne die Mittelsenkrechte der Strecke AB.'),
    () => { const y1 = zz(2, 3), d = 2 * zz(2, 3), y2 = y1 + d, ym = (y1 + y2) / 2;
      return gitterLinie('Die Geraden g und h sind parallel. Zeichne die Linie aller Punkte, die von g und h gleich weit entfernt sind.', GT(14, 10, { linien: [LN('g', [0, y1], [14, y1], 'gerade'), LN('h', [0, y2], [14, y2], 'gerade')] }), 'gerade', { art: 'gerade', a: [0, ym], b: [14, ym] }, [[0, ym], [14, ym]],
        [], H('E', 'Die Mittelparallele liegt genau in der Mitte zwischen g und h.'), { nachweis: [{ art: 'linie' }, { art: 'mittelparallele', y: [y1, y2] }] }); },
    () => zweiBedingungen('E', 'Ein Brunnen soll von zwei Häusern A und B gleich weit und vom Baum P genau 5 Kästchen entfernt sein. Tippe alle möglichen Orte an.', 'kreis-ms'),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Die Mittelsenkrechte von AB ist die Gerade durch die Mitte von AB.“ Beurteile die Beschreibung. Kreuze an.`,
        [opt('Unvollständig. Durch die Mitte gehen viele Geraden. Sie muss außerdem senkrecht auf AB stehen.', true), opt('Richtig und vollständig.', false, 'mittelsenkrechte-nicht-mittig'), opt('Falsch. Sie geht durch A.', false, 'mittelsenkrechte-nicht-mittig'), opt('Falsch. Sie ist parallel zu AB.', false, 'ortslinie-verwechselt')],
        hMS('E'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const y = zz(3, 6), P = [7, y + 3];
      return gitterPunkte('Gesucht sind alle Punkte, die von der Geraden g genau 3 Kästchen und vom Punkt P genau 5 Kästchen entfernt sind. Tippe sie an.', GT(14, 12, { punkte: [PT('P', ...P)], linien: [LN('g', [0, y], [14, y], 'gerade')] }),
        [[P[0] - 4, y + 3 + 3], [P[0] + 4, y + 3 + 3], [P[0] - 5, y + 3], [P[0] + 5, y + 3]].filter((q) => q[1] <= 12 && q[1] - P[1] !== 0 || true).filter((q) => Math.abs(q[1] - y) === 3 && Math.hypot(q[0] - P[0], q[1] - P[1]) === 5).concat([[P[0] - 3, y - 3 + 0], [P[0] + 3, y - 3]].filter((q) => Math.hypot(q[0] - P[0], q[1] - P[1]) === 5 && Math.abs(q[1] - y) === 3 && q[1] >= 0)),
        [], H('E', 'Abstand 3 von g: zwei Parallelen zu g. Abstand 5 von P: ein Kreis. Suche alle Schnittpunkte.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: P, r: 5 }, { art: 'abstandGerade', a: [0, y], b: [14, y], d: 3 }] }] }); },
    () => ordnen('Finde alle Punkte, die von A und B gleich weit und von M genau 3 cm entfernt sind. Ordne die Schritte.', ['Zeichne die Mittelsenkrechte von AB.', 'Zeichne den Kreis um M mit dem Radius 3 cm.', 'Markiere die Schnittpunkte von Kreis und Mittelsenkrechte.', 'Beschreibe die Lösung: Es gibt zwei, einen oder keinen Punkt.'], H('E', 'Jede Bedingung hat ihre Ortslinie.'), { nachweis: [{ art: 'schritte' }, { zahl: 3, grund: 'Radius des Kreises um M' }] }),
  ]);
}

// ---------- O2: Winkelhalbierende ----------
// Winkel am Gitter: erster Schenkel u, zweiter v, die Winkelhalbierende hat die ganzzahlige Richtung w.
const WH = [[[1, 0], [0, 1], [1, 1]], [[1, 0], [3, 4], [2, 1]], [[1, 0], [4, 3], [3, 1]], [[1, 0], [-3, 4], [1, 2]], [[1, 0], [-4, 3], [1, 3]], [[1, 0], [-1, 0], [0, 1]]];
const dreh90 = (p, k) => { let q = p; for (let i = 0; i < k; i++) q = [-q[1], q[0]]; return q; };
function winkelGitter(niveau) {
  const [u0, v0, w0] = wahl(niveau === 'F' ? WH.slice(0, 1).concat([WH[5]]) : niveau === 'G' ? WH.slice(0, 6) : WH), k = niveau === 'F' ? zz(0, 1) * 0 : zz(0, 3), [u, v, w] = [u0, v0, w0].map((p) => dreh90(p, k));
  const S = [7, 5], lu = Math.hypot(...u0), lv = Math.hypot(...v0), fu = Math.max(1, Math.round(4 / lu)), fv = Math.max(1, Math.round(4 / lv));
  const U = plusG(S, u, fu), V = plusG(S, v, fv);
  return { S, U, V, w, u, v, g: GT(14, 10, { punkte: [PT('S', ...S)], linien: [LN(null, S, U, 'strahl'), LN(null, S, V, 'strahl')] }) };
}
const hWH = (n) => H(n, 'Die Winkelhalbierende teilt den Winkel in zwei gleich große Winkel.', 'Ein rechter Winkel wird in zwei Winkel von 45° geteilt. Am Gitter ist das die Kästchendiagonale.', 'Sie beginnt im Scheitel S und liegt genau zwischen den Schenkeln.');
const whZeichnen = (n, text) => { const t = winkelGitter(n), mitte = [(t.U[0] + t.V[0]) / 2, (t.U[1] + t.V[1]) / 2];
  return gitterLinie(text, t.g, 'gerade', { art: 'gerade', a: t.S, b: plusG(t.S, t.w) }, [t.S, plusG(t.S, t.w)], mitte.every(Number.isInteger) && !((mitte[0] - t.S[0]) * t.w[1] === (mitte[1] - t.S[1]) * t.w[0]) ? [[{ art: 'gerade', a: t.S, b: mitte }, 'winkelhalbierende-seitenmitte']] : [], hWH(n),
    { nachweis: [{ art: 'linie' }, { art: 'winkelhalbierende', s: t.S, u: t.u, v: t.v, w: t.w }] }); };
function o2() {
  const halb = (n, text, ganz) => grad(text, ganz / 2, [[ganz, 'winkelhalbierende-seitenmitte'], [ganz * 2, 'winkelhalbierende-seitenmitte']], H(n, 'Die Winkelhalbierende teilt den Winkel in zwei gleich große Teile.', 'Ein Winkel von 80° wird in 40° und 40° geteilt.', `Rechne ${ganz}° : 2.`),
    { bild: winkelBild(n, ganz, { halb: GESUCHT('φ', ganz / 2), ganz: WERT(ganz) }), nachweis: [`${ganz}° : 2 = ${ganz / 2}°`, FIG('φ')] });
  sechs(O2, 'F', [
    () => whZeichnen('F', Z('Zeichne die Winkelhalbierende des Winkels bei S.')),
    () => halb('F', Z('Die Winkelhalbierende teilt den Winkel.', 'Berechne den Winkel φ.'), 20 * zz(2, 7)),
    () => { const t = winkelGitter('F'), mitte = [(t.U[0] + t.V[0]) / 2, (t.U[1] + t.V[1]) / 2], X = plusG(t.S, t.u, 1);
      return auswahl(Z('Welcher Strahl ist die Winkelhalbierende?', 'Kreuze an.'), [opt('w', true), opt('s', false, 'winkelhalbierende-seitenmitte'), opt('t', false, 'winkelhalbierende-seitenmitte')], hWH('F'),
        { bild: gitterBild(GT(14, 10, { punkte: [PT('S', ...t.S)], linien: [LN(null, t.S, t.U, 'strahl'), LN(null, t.S, t.V, 'strahl'), LN('w', t.S, plusG(t.S, t.w, 3), 'strahl', 'hilfs'), LN('s', t.S, plusG(t.S, plusG(t.w, t.u), 2), 'strahl', 'hilfs'), LN('t', t.S, plusG(t.S, plusG(t.w, t.v), 2), 'strahl', 'hilfs')] })), nachweis: [{ art: 'winkelhalbierende', s: t.S, u: t.u, v: t.v, w: t.w, linie: 'w' }] }); },
    () => whZeichnen('F', Z('Halbiere den Winkel bei S.', 'Zeichne die Winkelhalbierende.')),
    () => { const h = 10 * zz(2, 7);
      return grad(Z('Die Winkelhalbierende teilt einen Winkel.', `Jeder Teil ist ${h}° groß.`, 'Berechne den ganzen Winkel.'), 2 * h, [[h, 'winkelhalbierende-seitenmitte']], H('F', 'Zwei gleich große Teile ergeben den ganzen Winkel.', 'Zweimal 30° sind 60°.', `Rechne 2 · ${h}°.`),
        { bild: winkelBild('F', 2 * h, { halb: WERT(h), ganz: GESUCHT('φ', 2 * h) }), nachweis: [`2 · ${h}° = ${2 * h}°`, FIG('φ')] }); },
    () => whZeichnen('F', Z('Ein Weg soll genau zwischen zwei Zäunen verlaufen.', 'Die Zäune treffen sich in S.', 'Zeichne den Weg.')),
  ]);
  sechs(O2, 'G', [
    () => whZeichnen('G', Z('Zeichne die Winkelhalbierende des Winkels bei S.')),
    () => halb('G', Z('Die Winkelhalbierende teilt den Winkel.', 'Berechne φ.'), 10 * zz(5, 16)),
    () => { const w = dreiWinkelGerade();
      return grad(Z('Im Dreieck halbiert w den Winkel α.', `Es ist α = ${w.a}° und β = ${w.b}°.`, 'Berechne den Winkel δ bei D.'), w.d, [[180 - w.a - w.b, 'winkelhalbierende-seitenmitte'], [w.a, 'winkelhalbierende-seitenmitte']],
        H('G', 'Im Dreieck ABD kennst du α : 2 und β.', `α : 2 = ${w.a / 2}°.`, `Rechne 180° − ${w.a / 2}° − ${w.b}°.`), { bild: w.bild, nachweis: [`${w.a}° : 2 = ${w.a / 2}°`, R(`180° − ${w.a / 2}° − ${w.b}° = ${w.d}°`), FIG('δ')] }); },
    () => whZeichnen('G', Z('Halbiere den Winkel bei S.')),
    () => zweiBedingungen('G', Z('Gesucht sind Punkte auf p.', 'Sie sollen 5 Kästchen von P entfernt sein.', 'Tippe sie an.'), 'kreis-p'),
    () => { const k = kind();
      return auswahl(Z(`${k} zeichnet im Dreieck die Linie von A zur Mitte von a.`, `${k} sagt: „Das ist die Winkelhalbierende von α.“`, 'Kreuze die richtige Antwort an.'),
        [opt('Das stimmt meistens nicht. Die Winkelhalbierende teilt den Winkel, nicht die Seite a.', true), opt('Das stimmt immer.', false, 'winkelhalbierende-seitenmitte'), opt('Das stimmt nicht. Die Winkelhalbierende geht zur Ecke B.', false, 'winkelhalbierende-seitenmitte')],
        hWH('G'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(O2, 'M', [
    () => whZeichnen('M', 'Zeichne die Winkelhalbierende des Winkels bei S.'),
    () => { const w = dreiWinkelGerade('M');
      return grad(`Im Dreieck ABC halbiert w den Winkel α. Es ist α = ${w.a}° und β = ${w.b}°. Berechne den Winkel δ bei D.`, w.d, [[180 - w.a - w.b, 'winkelhalbierende-seitenmitte'], [w.a, 'winkelhalbierende-seitenmitte']],
        H('M', 'Arbeite im Dreieck ABD.', `180° − ${w.a / 2}° − ${w.b}°.`), { bild: w.bild, nachweis: [`${w.a}° : 2 = ${w.a / 2}°`, R(`180° − ${w.a / 2}° − ${w.b}° = ${w.d}°`), FIG('δ')] }); },
    () => auswahl('Ein Punkt P ist von den beiden Schenkeln eines Winkels gleich weit entfernt. Auf welcher Linie liegt P? Kreuze an.', [opt('auf der Winkelhalbierenden', true), opt('auf der Mittelsenkrechten', false, 'ortslinie-verwechselt'), opt('auf einem Kreis um den Scheitel', false, 'ortslinie-verwechselt'), opt('auf einem Schenkel', false, 'ortslinie-verwechselt')],
      H('M', 'Gleich weit von zwei Geraden: Welche Ortslinie gehört dazu?', 'Die Linie teilt den Winkel zwischen den Schenkeln in zwei gleiche Teile.'), { nachweis: [{ art: 'ortslinie', was: 'wh' }] }),
    () => whZeichnen('M', 'Zeichne die Ortslinie aller Punkte im Winkelfeld, die von beiden Schenkeln gleich weit entfernt sind.'),
    () => { const t = winkelGitter('M'), P = plusG(t.S, t.w, 2), Q = plusG(t.S, t.w, 3), X = plusG(t.S, plusG(t.w, t.u), 2);
      if (t.u[0] * t.v[1] === t.u[1] * t.v[0]) return null; // gestreckter Winkel: Das Winkelfeld ist nicht eindeutig
      if (![P, Q, X].every((p) => p[0] >= 0 && p[1] >= 0 && p[0] <= 14 && p[1] <= 10)) return null;
      return gitterPunkte('Tippe alle markierten Punkte an, die von beiden Schenkeln gleich weit entfernt sind.', GT(14, 10, { punkte: mische([PT('P', ...P), PT('Q', ...Q), PT('X', ...X)]).concat([PT('S', ...t.S)]), linien: [LN(null, t.S, t.U, 'strahl'), LN(null, t.S, t.V, 'strahl')] }), [P, Q], [[[P, Q, X], 'winkelhalbierende-seitenmitte']],
        H('M', 'Diese Punkte liegen auf der Winkelhalbierenden.', 'Zeichne die Winkelhalbierende ein und prüfe jeden Punkt.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'gleichweitGeraden', s: t.S, u: t.u, v: t.v, kandidaten: [P, Q, X] }] }] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Jeder Punkt, der von zwei sich schneidenden Geraden gleich weit entfernt ist, liegt auf einer einzigen Winkelhalbierenden.“ Überprüfe. Kreuze an.`,
        [opt('Falsch. Zwei Geraden bilden vier Winkel. Es gibt zwei Winkelhalbierende, die senkrecht zueinander stehen.', true), opt('Richtig.', false, 'ortslinie-verwechselt'), opt('Falsch. Es gibt vier Winkelhalbierende, die nicht senkrecht sind.', false, 'ortslinie-verwechselt'), opt('Falsch. Es ist die Mittelsenkrechte.', false, 'ortslinie-verwechselt')],
        H('M', 'Denke an die Scheitelwinkel und Nebenwinkel an der Kreuzung.', 'Halbiere zwei Nebenwinkel. Ihre Hälften ergeben 90°.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(O2, 'E', [
    () => whZeichnen('E', 'Zeichne die Winkelhalbierende des Winkels bei S.'),
    () => { const w = dreiWinkelGerade('E'), aw = 180 - w.d;
      return grad(`Im Dreieck ABC halbiert w den Winkel α und trifft BC in D. Es ist α = ${w.a}° und β = ${w.b}°. Bestimme den Winkel ∢ADC.`, aw, [[w.d, 'nebenwinkel-gleich'], [180 - w.a - w.b, 'winkelhalbierende-seitenmitte']],
        H('E', 'Berechne zuerst ∢ADB im Dreieck ABD.'), { bild: w.bild, nachweis: [`${w.a}° : 2 = ${w.a / 2}°`, R(`180° − ${w.a / 2}° − ${w.b}° = ${w.d}°`), R(`180° − ${w.d}° = ${aw}°`)] }); },
    () => { const a = 2 * zz(10, 40);
      return grad(`Zwei Geraden schneiden sich unter dem Winkel ${a}°. Bestimme den Winkel zwischen den beiden Winkelhalbierenden.`, 90, [[a / 2, 'winkelhalbierende-seitenmitte'], [180 - a, 'nebenwinkel-gleich']], H('E', `Die Halbierenden teilen ${a}° und ${180 - a}°.`), { nachweis: [`${a}° : 2 = ${a / 2}°`, R(`180° − ${a}° = ${180 - a}°`), `${180 - a}° : 2 = ${(180 - a) / 2}°`, R(`${a / 2}° + ${(180 - a) / 2}° = 90°`)] }); },
    () => { const k = kind(), a = 2 * zz(20, 40);
      return auswahl(`${k} halbiert einen Winkel von ${a}° und erhält zwei Winkel von ${a / 2 + 10}° und ${a / 2 - 10}°, weil die Linie zur Mitte der gegenüberliegenden Seite geht. Erkläre den Fehler. Kreuze an.`,
        [opt('Die Linie zur Seitenmitte ist keine Winkelhalbierende. Diese teilt den Winkel in zwei gleich große Teile.', true), opt('Beim Messen passieren immer Fehler.', false, 'winkelhalbierende-seitenmitte'), opt('Die Winkelhalbierende geht immer zur Seitenmitte.', false, 'winkelhalbierende-seitenmitte'), opt('Der Winkel war zu groß.', false, 'winkelhalbierende-seitenmitte')],
        hWH('E'), { nachweis: [`${a}° : 2 = ${a / 2}°`, { art: 'urteil', stimmt: false }] }); },
    () => { const t = winkelGitter('E'), P = plusG(t.S, t.w, zz(2, 3));
      if (![P, plusG(P, dreh90(t.w, 1), 3)].every((p) => p[0] >= 0 && p[1] >= 0 && p[0] <= 14 && p[1] <= 10)) return null;
      return gitterPunkte('Ein Brunnen soll von zwei Mauern gleich weit entfernt sein. Die Mauern beginnen in S. Er soll genau auf dem markierten Weg p liegen. Tippe den Ort an.',
        GT(14, 10, { punkte: [PT('S', ...t.S)], linien: [LN(null, t.S, t.U, 'strahl'), LN(null, t.S, t.V, 'strahl'), LN('p', P, plusG(P, dreh90(t.w, 1), 3), 'gerade', 'hilfs')] }), [P], [], H('E', 'Zeichne die Winkelhalbierende. Wo schneidet sie p?'),
        { nachweis: [{ art: 'ort', bedingungen: [{ art: 'gleichweitGeraden', s: t.S, u: t.u, v: t.v, kandidaten: [P] }, { art: 'auf', a: P, b: plusG(P, dreh90(t.w, 1)) }] }] }); },
    () => ordnen('Begründe: Jeder Punkt P auf der Winkelhalbierenden ist von beiden Schenkeln gleich weit entfernt. Ordne die Schritte.',
      ['Fälle von P die Lote auf beide Schenkel. Ihre Fußpunkte heißen F₁ und F₂.', 'Die Dreiecke SPF₁ und SPF₂ haben die Seite SP gemeinsam.', 'Sie stimmen in den Winkeln bei S (halbiert) und bei F₁ und F₂ (90°) überein.', 'Also sind sie kongruent (wsw), und PF₁ = PF₂.'], H('E', 'Suche zwei kongruente Dreiecke.')),
  ]);
}
// Winkelbild ohne Gitter: Winkel bei S mit Halbierender.
function winkelBild(n, ganz, { halb, ganz: g }) {
  const d = n === 'F' ? 0 : drehFuer(n), S = [0, 0], U = drehe(plus(S, dir(0), 3.4), d), V = drehe(plus(S, dir(ganz), 3.4), d), W = drehe(plus(S, dir(ganz / 2), 3.8), d);
  return figur({ punkte: { S, U, V, W }, versteckt: ['U', 'V', 'W'], linien: [['S', 'U'], ['S', 'V'], ['S', 'W', { stil: 'hilfs', n: 'w' }]], winkel: [['S', 'U', 'W', { farbe: 0, ...halb }], ['S', 'W', 'V', { farbe: 0, ...(halb.frage ? { wert: halb.wert } : halb), n: halb.frage ? halb.n : undefined, frage: halb.frage }], ['S', 'U', 'V', { farbe: 2, r: 52, ...g }]].map((x) => { if (x[3].n === undefined) delete x[3].n; return x; }) });
}
// Dreieck ABC mit Winkelhalbierender von A, die BC in D trifft: δ = ∢ADB = 180° − α/2 − β.
function dreiWinkelGerade(n = 'G') {
  const [a, b] = suche(() => [2 * winkelFuer(n === 'G' ? 'G' : 'M', 20, 45), winkelFuer(n, 35, 75)], ([x, y]) => x + y <= 140 && 180 - x / 2 - y >= 30), d = 180 - a / 2 - b, E = dreieckAus(a, b, drehFuer(n));
  const AB = Math.hypot(E.B[0] - E.A[0], E.B[1] - E.A[1]), AD = (AB * Math.sin((b * Math.PI) / 180)) / Math.sin((d * Math.PI) / 180), u = [(E.B[0] - E.A[0]) / AB, (E.B[1] - E.A[1]) / AB];
  const D = drehe(plus(E.A, [u[0], u[1]], AD), a / 2, E.A);
  return { a, b, d, bild: figur({ punkte: { ...E, D }, linien: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['A', 'D', { n: 'w', stil: 'hilfs' }]], winkel: [['A', 'B', 'D', { wert: a / 2, gleich: 1, farbe: 0 }], ['A', 'D', 'C', { wert: a / 2, gleich: 1, farbe: 0 }], ['B', 'D', 'A', { wert: b, farbe: 1 }], ['D', 'A', 'B', { n: 'δ', wert: d, frage: true, farbe: 2 }]] }) };
}

// ---------- 7.2.X2: Umkreis (nur E, 24) ----------
// Drei Punkte auf einem Kreis mit r = 5 um U: Der Umkreismittelpunkt ist ganzzahlig.
function umkreisDreieck() {
  return suche(() => { const U = [zz(6, 8), zz(6, 7)], [p, q, r] = mische(AUF5).slice(0, 3); return { U, A: plusG(U, p), B: plusG(U, q), C: plusG(U, r) }; },
    (t) => { const k = (t.B[0] - t.A[0]) * (t.C[1] - t.A[1]) - (t.B[1] - t.A[1]) * (t.C[0] - t.A[0]); return k > 6 && [t.A, t.B, t.C].every((p) => p[0] >= 0 && p[1] >= 0 && p[0] <= 14 && p[1] <= 12); });
}
function umkreis() {
  const g = (t, extra = {}) => GT(14, 12, { punkte: [PT('A', ...t.A), PT('B', ...t.B), PT('C', ...t.C)], figuren: [FG(null, [t.A, t.B, t.C])], ...extra });
  const art = (t) => { const s = (P, Q, R) => (Q[0] - P[0]) * (R[0] - P[0]) + (Q[1] - P[1]) * (R[1] - P[1]); const w = [s(t.A, t.B, t.C), s(t.B, t.C, t.A), s(t.C, t.A, t.B)]; return w.some((x) => x < 0) ? 'stumpf' : w.some((x) => x === 0) ? 'recht' : 'spitz'; };
  // Mittelsenkrechte von PQ als Gerade durch U mit kleinster ganzzahliger Richtung. Beide Punkte liegen im Gitter.
  const ms = (t, P, Q) => { const v = kuerze([-(Q[1] - P[1]), Q[0] - P[0]]), im = (p) => p[0] >= 0 && p[1] >= 0 && p[0] <= 14 && p[1] <= 12, b = [plusG(t.U, v), plusG(t.U, v, -1)].find(im); return b ? LN(null, t.U, b, 'gerade', 'hilfs') : null; };
  const tippU = (text, mitMS) => { const t = umkreisDreieck(), mAB = [(t.A[0] + t.B[0]) / 2, (t.A[1] + t.B[1]) / 2], linien = [ms(t, t.A, t.B), ms(t, t.B, t.C)];
    if (mitMS && linien.includes(null)) return null;
    return gitterPunkte(text, g(t, mitMS ? { linien } : {}), [t.U], mAB.every(Number.isInteger) ? [[[mAB], 'mittelsenkrechte-nicht-mittig']] : [],
      H('E', 'Der Umkreismittelpunkt ist der Schnittpunkt der Mittelsenkrechten.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'gleichweit', a: t.A, b: t.B }, { art: 'gleichweit', a: t.B, b: t.C }] }] }); };
  const kreis = (text) => { const t = umkreisDreieck();
    return gitterKreis(text, g(t), t.U, 5, t.A, [[{ r: 4 }, 'umkreis-inkreis-verwechselt'], [{ r: 3 }, 'umkreis-inkreis-verwechselt']], H('E', 'Finde zuerst U. Der Kreis geht durch alle drei Ecken.'), { nachweis: [{ art: 'kreisGitter', r: 5 }, { art: 'ort', bedingungen: [{ art: 'gleichweit', a: t.A, b: t.B }, { art: 'gleichweit', a: t.B, b: t.C }] }] }); };
  const lage = () => { const a = wahl(['spitz', 'recht', 'stumpf']);
    return auswahl(`Wo liegt der Umkreismittelpunkt eines ${{ spitz: 'spitzwinkligen', recht: 'rechtwinkligen', stumpf: 'stumpfwinkligen' }[a]} Dreiecks? Kreuze an.`,
      [opt({ spitz: 'innerhalb des Dreiecks', recht: 'in der Mitte der längsten Seite', stumpf: 'außerhalb des Dreiecks' }[a], true), ...['innerhalb des Dreiecks', 'in der Mitte der längsten Seite', 'außerhalb des Dreiecks'].filter((x) => x !== { spitz: 'innerhalb des Dreiecks', recht: 'in der Mitte der längsten Seite', stumpf: 'außerhalb des Dreiecks' }[a]).map((x) => opt(x, false, 'innen-aussen-verwechselt'))],
      H('E', 'Beim rechtwinkligen Dreieck hilft der Thaleskreis.'), { nachweis: [{ art: 'umkreislage', dreieck: a }] }); };
  const msMitZirkel = (P = 'A', Q = 'B') => ordnen(`Konstruiere die Mittelsenkrechte von ${P}${Q} mit Zirkel und Lineal. Ordne die Schritte.`, [`Stelle den Zirkel auf mehr als die halbe Länge von ${P}${Q} ein.`, `Zeichne um ${P} einen Kreisbogen oberhalb und unterhalb von ${P}${Q}.`, `Zeichne um ${Q} mit demselben Radius zwei Bögen, die die ersten schneiden.`, 'Verbinde die beiden Schnittpunkte. Das ist die Mittelsenkrechte.'], H('E', 'Beide Bögen brauchen denselben Radius.'));
  const urteil = () => { const k = kind(), [satz, stimmt, grund, fv] = wahl([
    ['Der Umkreismittelpunkt liegt immer im Dreieck.', false, 'Beim stumpfwinkligen Dreieck liegt er außerhalb.', 'innen-aussen-verwechselt'],
    ['Der Umkreismittelpunkt ist von allen drei Ecken gleich weit entfernt.', true, 'Er liegt auf allen drei Mittelsenkrechten.', 'umkreis-inkreis-verwechselt'],
    ['Für den Umkreis braucht man die Winkelhalbierenden.', false, 'Man braucht die Mittelsenkrechten. Die Winkelhalbierenden gehören zum Inkreis.', 'umkreis-inkreis-verwechselt'],
    ['Zwei Mittelsenkrechten reichen, um U zu finden.', true, 'Die dritte geht von selbst durch ihren Schnittpunkt.', 'umkreis-inkreis-verwechselt']]);
    return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage. Kreuze an.`, [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Das sieht man an jedem Beispiel.`, false, fv), opt('Das hängt von der Größe des Dreiecks ab.', false, fv)], H('E', 'Denke an die Mittelsenkrechten.'), { nachweis: [{ art: 'urteil', stimmt }] }); };
  const radius = () => { const t = suche(umkreisDreieck, (x) => [x.A, x.B, x.C].some((p) => p[0] === x.U[0] || p[1] === x.U[1]));
    return zahl('Der Umkreismittelpunkt U ist eingezeichnet. Bestimme den Radius des Umkreises in Kästchen.', 5, [[4, 'umkreis-inkreis-verwechselt'], [10, 'thales-durchmesser']], H('E', 'Zähle von U bis zu einer Ecke, die auf derselben Gitterlinie liegt.'),
      { einheit: 'Kästchen', bild: gitterBild(g(t, { punkte: [PT('A', ...t.A), PT('B', ...t.B), PT('C', ...t.C), PT('U', ...t.U)] })), nachweis: [{ art: 'gitterlaenge', a: t.U, b: [t.A, t.B, t.C].find((p) => p[0] === t.U[0] || p[1] === t.U[1]), wert: 5 }] }); };
  const winkelU = () => { const g0 = winkelFuer('E', 30, 80);
    return grad(`Im spitzwinkligen Dreieck ABC ist γ = ${g0}°. U ist der Umkreismittelpunkt. Die Strecken UA und UB sind gleich lang. Der Winkel ∢AUB ist doppelt so groß wie γ. Bestimme den Winkel ∢UAB.`, 90 - g0, [[g0, 'basiswinkel-falsch'], [180 - 2 * g0, 'basiswinkel-falsch']],
      H('E', 'Das Dreieck ABU ist gleichschenklig.'), { nachweis: [`2 · ${g0}° = ${2 * g0}°`, R(`180° − ${2 * g0}° = ${180 - 2 * g0}°`), `${180 - 2 * g0}° : 2 = ${90 - g0}°`] }); };
  sechs(X2, 'E', [
    () => tippU('Zwei Mittelsenkrechten sind gezeichnet. Tippe den Umkreismittelpunkt U an.', true), () => msMitZirkel(), () => kreis('Zeichne den Umkreis des Dreiecks. Tippe zuerst den Mittelpunkt, dann einen Punkt des Kreises an.'), () => urteil(), () => lage(), () => urteil(),
    () => tippU('Bestimme den Umkreismittelpunkt U des Dreiecks und tippe ihn an.', false), () => radius(), () => winkelU(), () => lage(), () => kreis('Zeichne den Kreis durch A, B und C.'), () => urteil(),
    () => tippU('Drei Häuser A, B und C bekommen einen gemeinsamen Spielplatz. Er soll von allen gleich weit entfernt sein. Tippe den Ort an.', false), () => msMitZirkel('B', 'C'), () => kreis('Zeichne den Umkreis. Sein Mittelpunkt ist der Schnittpunkt der Mittelsenkrechten.'), () => winkelU(), () => radius(), () => urteil(),
    () => tippU('Tippe den Punkt an, der von A, B und C gleich weit entfernt ist.', false), () => lage(), () => kreis('Zeichne den Umkreis des Dreiecks ABC.'),
    () => auswahl('Warum schneiden sich die drei Mittelsenkrechten in einem Punkt? Kreuze an.', [opt('Der Schnittpunkt von zwei ist gleich weit von A, B und C entfernt. Also liegt er auch auf der dritten.', true), opt('Weil drei Geraden sich immer in einem Punkt schneiden.', false, 'mittelsenkrechte-nicht-mittig'), opt('Weil das Dreieck gleichseitig ist.', false, 'dreieck-sonderfall'), opt('Weil sie parallel sind.', false, 'ortslinie-verwechselt')],
      H('E', 'Nutze die Eigenschaft der Mittelsenkrechten zweimal.'), { nachweis: [{ art: 'urteil', stimmt: true }] }),
    () => winkelU(), () => tippU('Die Mittelsenkrechten von AB und BC sind eingezeichnet. Tippe ihren Schnittpunkt an.', true),
  ], 24);
}

// ---------- 7.2.X3: Inkreis (nur E, 24) ----------
// Dreiecke mit ganzzahligem Inkreismittelpunkt I und Radius r. beruehr: Berührpunkt auf einer Gitterlinie.
const INKREIS = [
  { E: [[0, 0], [4, 0], [0, 3]], I: [1, 1], r: 1, T: [1, 0] }, { E: [[0, 0], [8, 0], [0, 6]], I: [2, 2], r: 2, T: [2, 0] }, { E: [[0, 0], [6, 0], [0, 8]], I: [2, 2], r: 2, T: [2, 0] },
  { E: [[0, 0], [12, 0], [0, 5]], I: [2, 2], r: 2, T: [2, 0] }, { E: [[0, 0], [12, 0], [0, 9]], I: [3, 3], r: 3, T: [3, 0] }, { E: [[0, 0], [14, 0], [5, 12]], I: [6, 4], r: 4, T: [6, 0] }, { E: [[0, 0], [9, 0], [0, 12]], I: [3, 3], r: 3, T: [3, 0] },
];
function inkreisDreieck() {
  const t = wahl(INKREIS), sp = t.E.some((p) => p[0] > 10) ? false : wahl([false, true]), w = Math.max(...t.E.map((p) => p[0]));
  const f = (p) => [1 + (sp ? w - p[0] : p[0]), 1 + p[1]], E = t.E.map(f);
  const [A, B, C] = sp ? [E[1], E[0], E[2]] : E; // gegen den Uhrzeigersinn
  return { A, B, C, I: f(t.I), r: t.r, T: f(t.T), g: (extra = {}) => GT(w + 2, Math.max(...t.E.map((p) => p[1])) + 2, { punkte: [PT('A', ...A), PT('B', ...B), PT('C', ...C)], figuren: [FG(null, [A, B, C])], ...extra }) };
}
function inkreis() {
  const tippI = (text) => { const t = inkreisDreieck();
    return gitterPunkte(text, t.g(), [t.I], [], H('E', 'Der Inkreismittelpunkt ist der Schnittpunkt der Winkelhalbierenden.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'inkreis', ecken: [t.A, t.B, t.C] }] }] }); };
  const kreis = (text) => { const t = inkreisDreieck();
    return gitterKreis(text, t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B), PT('C', ...t.C), PT('I', ...t.I)] }), t.I, t.r, t.T, [[{ r: t.r + 1 }, 'umkreis-inkreis-verwechselt']], H('E', 'Der Radius ist der Abstand von I zu einer Seite, senkrecht gemessen.'), { nachweis: [{ art: 'kreisGitter', r: t.r }, { art: 'ort', bedingungen: [{ art: 'inkreis', ecken: [t.A, t.B, t.C] }] }] }); };
  const whMitZirkel = (E = null) => ordnen(E ? `Konstruiere die Winkelhalbierende des Winkels bei ${E} mit Zirkel und Lineal. Ordne die Schritte.` : 'Konstruiere die Winkelhalbierende eines Winkels mit Zirkel und Lineal. Ordne die Schritte.', [E ? `Zeichne um ${E} einen Kreisbogen, der beide Schenkel schneidet.` : 'Zeichne um den Scheitel einen Kreisbogen, der beide Schenkel schneidet.', 'Zeichne um die beiden Schnittpunkte Bögen mit demselben Radius.', 'Die beiden Bögen schneiden sich in einem Punkt im Winkelfeld.', 'Verbinde diesen Punkt mit dem Scheitel.'], H('E', 'Der erste Bogen geht um den Scheitel.'));
  const urteil = () => { const k = kind(), [satz, stimmt, grund, fv] = wahl([
    ['Der Inkreismittelpunkt kann außerhalb des Dreiecks liegen.', false, 'Er liegt immer innen, denn die Winkelhalbierenden verlaufen im Dreieck.', 'innen-aussen-verwechselt'],
    ['Der Inkreis geht durch die drei Ecken.', false, 'Der Inkreis berührt die drei Seiten. Durch die Ecken geht der Umkreis.', 'umkreis-inkreis-verwechselt'],
    ['Der Inkreismittelpunkt ist von allen drei Seiten gleich weit entfernt.', true, 'Er liegt auf allen drei Winkelhalbierenden.', 'umkreis-inkreis-verwechselt'],
    ['Den Radius des Inkreises misst man von I zu einer Ecke.', false, 'Man misst von I senkrecht zu einer Seite.', 'umkreis-inkreis-verwechselt']]);
    return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage. Kreuze an.`, [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Das sieht man an jedem Beispiel.`, false, fv), opt('Das gilt nur im gleichseitigen Dreieck.', false, fv)], H('E', 'Denke an die Winkelhalbierenden.'), { nachweis: [{ art: 'urteil', stimmt }] }); };
  const radius = () => { const t = inkreisDreieck();
    return zahl('I ist der Inkreismittelpunkt. Bestimme den Radius des Inkreises in Kästchen.', t.r, [[Math.round(Math.hypot(t.I[0] - t.A[0], t.I[1] - t.A[1])), 'umkreis-inkreis-verwechselt']].filter(([x]) => x !== t.r), H('E', 'Zähle senkrecht von I bis zu einer Seite, die auf einer Gitterlinie liegt.'),
      { einheit: 'Kästchen', bild: gitterBild(t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B), PT('C', ...t.C), PT('I', ...t.I)] })), nachweis: [{ art: 'gitterlaenge', a: t.I, b: t.T, wert: t.r }] }); };
  const winkelI = () => { const g0 = 2 * zz(15, 50);
    return grad(`Im Dreieck ABC ist γ = ${g0}°. I ist der Inkreismittelpunkt. Bestimme den Winkel ∢AIB.`, 90 + g0 / 2, [[180 - g0, 'umkreis-inkreis-verwechselt'], [2 * g0 <= 180 ? 180 - g0 / 2 : 0, 'winkelhalbierende-seitenmitte']].filter(([x]) => x > 0),
      H('E', 'Im Dreieck ABI sind die Winkel bei A und B halb so groß wie α und β.'), { nachweis: [R(`180° − ${g0}° = ${180 - g0}°`), `${180 - g0}° : 2 = ${(180 - g0) / 2}°`, R(`180° − ${(180 - g0) / 2}° = ${90 + g0 / 2}°`)] }); };
  const welche = (text = 'Welche Linien brauchst du, um den Inkreismittelpunkt zu finden? Kreuze an.') => auswahl(text, [opt('zwei Winkelhalbierende', true), opt('zwei Mittelsenkrechten', false, 'umkreis-inkreis-verwechselt'), opt('zwei Höhen', false, 'umkreis-inkreis-verwechselt'), opt('die Linien von den Ecken zu den Seitenmitten', false, 'winkelhalbierende-seitenmitte')],
    H('E', 'I ist von allen Seiten gleich weit entfernt.'), { nachweis: [{ art: 'ortslinie', was: 'wh' }] });
  sechs(X3, 'E', [
    () => welche(), () => whMitZirkel(), () => kreis('I ist der Inkreismittelpunkt. Zeichne den Inkreis: Tippe I und den Berührpunkt auf der unteren Seite an.'), () => urteil(), () => radius(), () => urteil(),
    () => tippI('Bestimme den Inkreismittelpunkt I und tippe ihn an.'), () => winkelI(), () => kreis('Zeichne den Inkreis des Dreiecks mit dem Mittelpunkt I.'), () => winkelI(), () => radius(), () => urteil(),
    () => tippI('Ein runder Tisch soll so in eine dreieckige Ecke passen, dass er alle drei Wände berührt. Tippe seinen Mittelpunkt an.'), () => whMitZirkel('A'), () => kreis('Zeichne den Kreis um I, der alle drei Seiten berührt.'), () => winkelI(), () => radius(), () => urteil(),
    () => tippI('Tippe den Punkt an, der von allen drei Seiten des Dreiecks gleich weit entfernt ist.'), () => welche(`${kind()} will den Inkreis eines Dreiecks zeichnen. Welche Linien braucht es dafür zuerst? Kreuze an.`), () => radius(),
    () => auswahl('Warum schneiden sich die drei Winkelhalbierenden in einem Punkt? Kreuze an.', [opt('Der Schnittpunkt von zwei ist von allen drei Seiten gleich weit entfernt. Also liegt er auch auf der dritten.', true), opt('Weil sie zur Seitenmitte gehen.', false, 'winkelhalbierende-seitenmitte'), opt('Weil das Dreieck rechtwinklig ist.', false, 'dreieck-art'), opt('Das ist Zufall.', false, 'ortslinie-verwechselt')],
      H('E', 'Nutze die Eigenschaft der Winkelhalbierenden zweimal.'), { nachweis: [{ art: 'urteil', stimmt: true }] }),
    () => winkelI(), () => tippI('Tippe den Mittelpunkt des Inkreises an.'),
  ], 24);
}

export function ortslinien() { o1(); o2(); }
export { umkreis, inkreis };
