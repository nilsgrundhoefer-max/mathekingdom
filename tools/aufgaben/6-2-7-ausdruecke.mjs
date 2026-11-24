// Aufgaben zu 6.2.7 „Punkt vor Strich und Klammern“ (Lernziele R1, R2) nach ADR 0015 und ADR 0038.
// R1: Punkt vor Strich mit Brüchen. R2: Rechenausdrücke mit Klammern, geschickt rechnen.
// Grilling mit Nils (2026-11-24): Auf F und G wird nicht durch einen Bruch dividiert (das ist der Niveau-Meilenstein 2.6), auf M und E schon.
// Auf F bleiben die Brüche gleichnamig und werden nur mit natürlichen Zahlen malgenommen oder geteilt.
// Typische Fehler: von links nach rechts rechnen (Punkt vor Strich missachtet), die Klammer nicht beachten, nur einen Teil der Klammer malnehmen.

import { sechs, auswahl, luecken, zahl, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, mal, plus, minus, durch, T, echt, rechneB, optionen, urteil, VGL, ZEICHEN, streifen, zwei, istBruch, gleich, ganz, kleiner } from './6-2-rechnen.mjs';

const R1 = '6.2.7-R1', R2 = '6.2.7-R2';
const B2 = (q) => br(q[0], q[1]);
const pos = (q) => q[0] * q[1] > 0;
const gz = (ganze, nenner) => { const a = echt(nenner), g = wahl(ganze); return [g * a[1] + a[0], a[1]]; };
// Zwei gekürzte echte Brüche mit demselben Nenner.
const gleichn = (nenner, passt = () => true) => { for (let i = 0; i < 800; i++) { const n = wahl(nenner), a = echt([n]), c = echt([n]); if (a[0] !== c[0] && passt(a, c, n)) return { a, c, n }; } return null; };
// p · q mit Nennerprodukt N und dazu ein Bruch x⁄N: [[p, q], N]
const PRODUKTE = [[[1, 2], [1, 2]], [[1, 2], [1, 3]], [[1, 2], [2, 3]], [[1, 2], [1, 4]], [[1, 2], [3, 4]], [[1, 3], [1, 3]], [[2, 3], [2, 3]], [[1, 3], [2, 3]], [[1, 2], [1, 5]], [[1, 2], [3, 5]], [[1, 3], [1, 4]], [[1, 3], [3, 4]], [[2, 3], [1, 4]], [[1, 2], [1, 6]], [[1, 2], [5, 6]], [[1, 3], [2, 5]], [[2, 3], [4, 5]], [[1, 4], [3, 4]], [[1, 4], [3, 5]], [[3, 4], [3, 5]]];
const prod = (passt = () => true) => { for (let i = 0; i < 800; i++) { const [p, q] = wahl(PRODUKTE), N = p[1] * q[1], x = [zz(1, N - 1), N]; if (passt(p, q, x, N)) return { p, q, x, N, roh: [p[0] * q[0], N] }; } return null; };
const gleichungen = (anzahl, erzeuge, fv, tipp) => { const roh = [];
  for (let i = 0; i < anzahl; i++) { const stimmt = i < 2 ? i === 0 : wahl([true, false]), r = erzeuge(stimmt); if (!r || roh.some(([q]) => q === r)) return null; roh.push([r, stimmt]); }
  return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : fv)), tipp, { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); };

export function ausdruecke() {
  // ================= R1: Punkt vor Strich =================
  const NF = [5, 7, 9, 11];
  const tP = h3('Punkt vor Strich: Rechne zuerst die Malaufgabe.', `${br(1, 7)} + 2 · ${br(2, 7)} = ${br(1, 7)} + ${br(4, 7)} = ${br(5, 7)}.`, 'Unterstreiche die Malaufgabe. Rechne sie zuerst aus.');
  sechs(R1, 'F', [
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => x[0] + 2 * y[0] < m), k = 2;
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, 'Rechne zuerst die Malaufgabe.', `${B2(a)} + ${k} · ${B2(c)} = ${B2(a)} + {{a}}⁄${n} = {{b}}⁄${n}`), { a: [k * c[0], fehlerliste(k * c[0], [[c[0] + k, '1x1-addiert'], [a[0] + c[0], 'punkt-vor-strich']])], b: [a[0] + k * c[0], fehlerliste(a[0] + k * c[0], [[(a[0] + c[0]) * k, 'punkt-vor-strich'], [a[0] + c[0], 'sach-schritt-vergessen']])] }, tP,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} + ${k} · ${B2(c)} = ${B2(a)} + ${br(k * c[0], n)} = ${br(a[0] + k * c[0], n)}`] }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => x[0] > 2 * y[0] && ggt(x[0] - 2 * y[0], m) === 1), r = [a[0] - 2 * c[0], n];
      return rechneB(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} − 2 · ${B2(c)}.`), r, [[[(a[0] - c[0]) * 2, n], 'punkt-vor-strich'], [[a[0] - c[0], n], 'sach-schritt-vergessen'], [[a[0] + 2 * c[0], n], 'sub-addiert']],
        h3('Punkt vor Strich: Rechne zuerst die Malaufgabe.', `${br(6, 7)} − 2 · ${br(2, 7)} = ${br(6, 7)} − ${br(4, 7)} = ${br(2, 7)}.`, `Rechne zuerst 2 · ${B2(c)}. Ziehe das Ergebnis von ${B2(a)} ab.`), [`${B2(a)} − 2 · ${B2(c)} = ${B2(r)}`], { bild: bild(streifen(...a)) }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => x[0] + 3 * y[0] < m && ggt(x[0] + 3 * y[0], m) === 1 && (x[0] + y[0]) * 3 !== x[0] + 3 * y[0]), r = [a[0] + 3 * c[0], n];
      return auswahl(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Wie viel ist ${B2(a)} + 3 · ${B2(c)}?`), optionen(r, [[[(a[0] + c[0]) * 3, n], 'punkt-vor-strich'], [[a[0] + c[0], n], 'sach-schritt-vergessen']], T), tP,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} + 3 · ${B2(c)} = ${B2(r)}`, WERT(T(r), false)] }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => 3 * x[0] + y[0] < m);
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, 'Rechne zuerst die Malaufgabe.', `3 · ${B2(a)} + ${B2(c)} = {{a}}⁄${n} + ${B2(c)} = {{b}}⁄${n}`), { a: [3 * a[0], fehlerliste(3 * a[0], [[a[0] + 3, '1x1-addiert'], [a[0], 'sach-schritt-vergessen']])], b: [3 * a[0] + c[0], fehlerliste(3 * a[0] + c[0], [[3 * (a[0] + c[0]), 'punkt-vor-strich'], [a[0] + c[0], 'sach-schritt-vergessen']])] },
        h3('Punkt vor Strich: Rechne zuerst die Malaufgabe.', `3 · ${br(1, 7)} + ${br(2, 7)} = ${br(3, 7)} + ${br(2, 7)} = ${br(5, 7)}.`, 'Rechne zuerst die Malaufgabe. Zähle dann den zweiten Bruch dazu.'), { bild: bild(streifen(...a)), nachweis: [`3 · ${B2(a)} + ${B2(c)} = ${br(3 * a[0], n)} + ${B2(c)} = ${br(3 * a[0] + c[0], n)}`] }); },
    () => { const n = wahl([5, 7, 9]), k = wahl([2, 3]), r = [1 + k, n], [k1, k2] = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara']), was = wahl(['Saft', 'Wasser', 'Tee']);
      if (ggt(1 + k, n) > 1) return null;
      return rechneB(Z(`${k1} trinkt ${br(1, n)} l ${was}.`, `${k2} trinkt ${k} Gläser mit je ${br(1, n)} l.`, 'Wie viel trinken beide zusammen?'), r, [[[2 * k, n], 'punkt-vor-strich'], [[2, n], 'sach-schritt-vergessen']],
        h3('Rechne zuerst aus, wie viel in den Gläsern ist.', `${br(1, 5)} l und 2 Gläser mit je ${br(1, 5)} l: ${br(1, 5)} + 2 · ${br(1, 5)} = ${br(1, 5)} + ${br(2, 5)} = ${br(3, 5)}.`, `Rechne ${br(1, n)} + ${k} · ${br(1, n)}. Die Malaufgabe kommt zuerst.`), [`${br(1, n)} l + ${k} · ${br(1, n)} l = ${B2(r)} l`], { einheit: 'l', bild: bild(streifen(1, n)) }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => y[0] % 2 === 0 && x[0] > y[0] / 2 && ggt(x[0] - y[0] / 2, m) === 1 && (x[0] - y[0]) % 2 === 0 === false), r = [a[0] - c[0] / 2, n];
      return rechneB(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} − ${B2(c)} : 2.`), r, [[[a[0] - c[0], 2 * n], 'punkt-vor-strich'], [[a[0] - c[0], n], 'sach-schritt-vergessen']],
        h3('Auch Geteilt ist eine Punktrechnung. Rechne sie zuerst.', `${br(6, 7)} − ${br(4, 7)} : 2 = ${br(6, 7)} − ${br(2, 7)} = ${br(4, 7)}.`, `Rechne zuerst ${B2(c)} : 2. Ziehe das Ergebnis von ${B2(a)} ab.`), [`${B2(a)} − ${B2(c)} : 2 = ${B2(r)}`], { bild: bild(streifen(...a)) }); },
  ]);
  const tG = h3('Punkt vor Strich: Rechne zuerst die Malaufgabe. Kürze am Ende.', `${br(3, 4)} − ${br(1, 2)} · ${br(1, 2)} = ${br(3, 4)} − ${br(1, 4)} = ${br(2, 4)} = ${br(1, 2)}.`, 'Unterstreiche die Malaufgabe. Rechne sie zuerst aus.');
  sechs(R1, 'G', [
    () => { const { p, q, x, roh } = prod((pp, qq, xx, N) => xx[0] + pp[0] * qq[0] < N), r = plus(x, roh);
      return rechneB(Z(`Rechne ${B2(p)} · ${B2(q)} + ${B2(kz(x))}.`, 'Kürze das Ergebnis vollständig.'), r, [[mal(p, plus(q, x)), 'punkt-vor-strich'], [roh, 'sach-schritt-vergessen']], tG, [`${B2(p)} · ${B2(q)} + ${B2(kz(x))} = ${T(r)}`]); },
    () => { const { p, q, x, N, roh } = prod((pp, qq, xx, NN) => xx[0] > pp[0] * qq[0] && ggt(xx[0], NN) === 1);
      return luecken(Z(`Im Streifen ist ${B2(x)} gefärbt.`, 'Rechne zuerst die Malaufgabe.', `${B2(x)} − ${B2(p)} · ${B2(q)} = ${B2(x)} − {{a}}⁄${N} = {{b}}⁄${N}`), { a: [roh[0], fehlerliste(roh[0], [[p[0] + q[0], 'bruch-mal-wie-plus']])], b: [x[0] - roh[0], fehlerliste(x[0] - roh[0], [[x[0] + roh[0], 'sub-addiert'], [x[0] - p[0], 'punkt-vor-strich']])] }, tG,
        { bild: bild(streifen(...x)), nachweis: [`${B2(x)} − ${B2(p)} · ${B2(q)} = ${B2(x)} − ${B2(roh)} = ${br(x[0] - roh[0], N)}`] }); },
    () => { const k = wahl([2, 3]), n = wahl([4, 6, 8]), e = [1, 2], r = plus(mal(ganz(k), [1, n]), e), sorte = wahl(['Pizza', 'Kuchen', 'Torte']);
      const os = [[`${k} · ${br(1, n)} + ${B2(e)}`, true], [`${k} · (${br(1, n)} + ${B2(e)})`, false, 'klammer-falsch-gesetzt'], [`${k} + ${br(1, n)} + ${B2(e)}`, false, 'sach-falsche-rechnung']];
      return auswahl(Z(`Der Kreis zeigt ${br(1, n)}.`, `${k} Kinder essen je ${br(1, n)} ${sorte}.`, `Ein Kind isst ${B2(e)} ${sorte}.`, 'Welche Rechnung passt dazu?'), mische(os.map(([t, ri, fv]) => opt(t, ri, fv))),
        h3('Zuerst kommt die Malaufgabe für die Kinder mit gleich großen Stücken.', `2 Kinder essen je ${br(1, 4)}, eins isst ${br(1, 2)}: 2 · ${br(1, 4)} + ${br(1, 2)}.`, 'Überlege: Welche Zahl gehört nur zu einem der beiden Brüche?'), { bild: bild({ form: 'kreis', teile: n, gefaerbt: [0] }), nachweis: [`${k} · ${br(1, n)} + ${B2(e)} = ${T(r)}`, WERT(T(r), false)] }); },
    () => { const c = echt([6, 8, 9, 10, 12]), k = wahl([2, 3]), x = echt([2, 3, 4, 5, 6].filter((m) => c[1] % m === 0)), pr = mal(ganz(k), c), r = minus(pr, x);
      if (!pos(r) || !istBruch(r) || k * c[0] > 2 * c[1]) return null;
      return rechneB(Z(`Rechne ${k} · ${B2(c)} − ${B2(x)}.`, 'Kürze das Ergebnis vollständig.'), r, [[mal(ganz(k), minus(c, x)), 'punkt-vor-strich'], [pr, 'sach-schritt-vergessen']].filter(([f]) => pos(f)), tG, [`${k} · ${B2(c)} − ${B2(x)} = ${T(r)}`]); },
    () => { const n = wahl([4, 8]), k = wahl([2, 3]), e = [1, 2], r = plus(e, mal(ganz(k), [1, n])), kn = kind(), [w1, w2] = wahl([['Äpfel', 'Nüsse'], ['Kartoffeln', 'Zwiebeln'], ['Mehl', 'Zucker']]);
      return rechneB(Z(`${kn} kauft ${B2(e)} kg ${w1}.`, `Dazu kommen ${k} Tüten ${w2} mit je ${br(1, n)} kg.`, 'Wie schwer ist der Einkauf zusammen?', 'Kürze das Ergebnis vollständig.'), r, [[mal(ganz(k), plus(e, [1, n])), 'punkt-vor-strich'], [plus(e, [1, n]), 'sach-schritt-vergessen']],
        h3('Rechne zuerst aus, wie schwer alle Tüten zusammen sind.', `${br(1, 2)} kg und 3 Tüten mit je ${br(1, 4)} kg: ${br(1, 2)} + 3 · ${br(1, 4)} = ${br(1, 2)} + ${br(3, 4)} = ${T([5, 4])}.`, `Rechne ${B2(e)} + ${k} · ${br(1, n)}. Die Malaufgabe kommt zuerst.`), [`${B2(e)} kg + ${k} · ${br(1, n)} kg = ${T(r)} kg`], { einheit: 'kg' }); },
    () => { const { a, c, n } = gleichn([5, 7, 9], (x, y, m) => x[0] + 2 * y[0] < m), k = 2, richtig = [a[0] + k * c[0], n], falle = [(a[0] + c[0]) * k, n], kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} + ${B2(c)} · ${k} = ${T(kz(x))}`;
      if (gleich(richtig, falle)) return null;
      return urteil(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `${kn} rechnet: ${g(stimmt ? richtig : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? richtig : falle), g(stimmt ? falle : richtig), [g([a[0] + c[0], n])], 'punkt-vor-strich',
        h3('Auch wenn Plus vorn steht: Die Malaufgabe kommt zuerst.', `${br(1, 7)} + ${br(2, 7)} · 2 = ${br(1, 7)} + ${br(4, 7)} = ${br(5, 7)}.`, `Rechne zuerst ${B2(c)} · ${k}. Zähle dann ${B2(a)} dazu.`), { bild: bild(streifen(...a)) }); },
  ]);
  const NM = [2, 3, 4, 5, 6, 8];
  const drei = (passt) => { for (let i = 0; i < 2000; i++) { const a = echt(NM), p = echt(NM), q = echt(NM); if (passt(a, p, q)) return { a, p, q }; } return null; };
  sechs(R1, 'M', [
    () => { const { a, p, q } = drei((x, y, z) => ggt(y[0] * z[0], y[1] * z[1]) > 1), r = plus(a, mal(p, q));
      if (!istBruch(r) || r[1] > 30) return null;
      return rechneB(`Berechne ${B2(a)} + ${B2(p)} · ${B2(q)} und kürze vollständig.`, r, [[mal(plus(a, p), q), 'punkt-vor-strich'], [mal(p, q), 'sach-schritt-vergessen']],
        h2('Punkt vor Strich: Berechne zuerst das Produkt.', `${B2(p)} · ${B2(q)} = ${B2(mal(p, q))}. Addiere dann ${B2(a)} mit dem Hauptnenner.`), [`${B2(a)} + ${B2(p)} · ${B2(q)} = ${T(r)}`]); },
    () => { const { a, p, q } = drei((x, y, z) => !gleich(y, z)), d = durch(p, q), r = minus(a, d);
      if (!pos(r) || !istBruch(r) || r[1] > 30 || !pos(minus(a, p))) return null;
      return rechneB(`Berechne ${B2(a)} − ${B2(p)} : ${B2(q)} und kürze vollständig.`, r, [[durch(minus(a, p), q), 'punkt-vor-strich'], [minus(a, mal(p, q)), 'bruch-kehrwert']].filter(([f]) => pos(f)),
        h2('Auch die Division ist eine Punktrechnung. Berechne sie zuerst.', `${B2(p)} : ${B2(q)} = ${T(d)}. Subtrahiere das Ergebnis von ${B2(a)}.`), [`${B2(a)} − ${B2(p)} : ${B2(q)} = ${T(r)}`]); },
    () => { const a = echt(NM), c = echt(NM), p = echt(NM), q = echt(NM), r = plus(mal(a, c), mal(p, q));
      if (!istBruch(r) || r[1] > 30 || gleich(a, p) || gleich(c, q) || gleich(a, q) || gleich(c, p) || gleich(a, c)) return null;
      return rechneB(`Berechne ${B2(a)} · ${B2(c)} + ${B2(p)} · ${B2(q)} und kürze vollständig.`, r, [[mal(mal(a, plus(c, p)), q), 'punkt-vor-strich'], [mal(a, c), 'sach-schritt-vergessen']],
        h2('Berechne zuerst beide Produkte. Addiere sie dann.', `${B2(a)} · ${B2(c)} = ${B2(mal(a, c))} und ${B2(p)} · ${B2(q)} = ${B2(mal(p, q))}.`), [`${B2(a)} · ${B2(c)} + ${B2(p)} · ${B2(q)} = ${T(r)}`]); },
    () => { const a = echt(NM), c = echt([3, 4, 5, 6]), k = wahl([2, 3, 4]), r = plus(durch(a, ganz(k)), c);
      if (!istBruch(r) || r[1] > 30) return null;
      return rechneB(`Berechne ${B2(a)} : ${k} + ${B2(c)} und kürze vollständig.`, r, [[durch(a, plus(ganz(k), c)), 'punkt-vor-strich'], [durch(a, ganz(k)), 'sach-schritt-vergessen']],
        h2('Hier steht die Punktrechnung schon vorn. Berechne zuerst den Quotienten.', `${B2(a)} : ${k} = ${B2(durch(a, ganz(k)))}. Addiere dann ${B2(c)}.`), [`${B2(a)} : ${k} + ${B2(c)} = ${T(r)}`]); },
    () => { const { a, p, q } = drei((x, y) => !gleich(x, y)), l = plus(a, mal(p, q)), r = mal(plus(a, p), q), art = wahl([0, 1]), rechts = art ? `(${B2(a)} + ${B2(p)}) · ${B2(q)}` : `${B2(mal(p, q))} + ${B2(a)}`, rw = art ? r : l;
      return auswahl(`Welches Zeichen passt? ${B2(a)} + ${B2(p)} · ${B2(q)} ▢ ${rechts}`, ZEICHEN(l[0] * rw[1] - rw[0] * l[1], 'punkt-vor-strich'), h2('Berechne links zuerst das Produkt. Achte rechts auf die Klammer.', `Links: ${B2(p)} · ${B2(q)} = ${B2(mal(p, q))}, dann plus ${B2(a)}. Vergleiche mit dem Wert rechts.`), { nachweis: [VGL(`${B2(a)} + ${B2(p)} · ${B2(q)}`, rechts)] }); },
    () => { const { a, p, q } = drei((x, y, z) => x[0] === 1 && y[0] === 1 && x[1] !== y[1]), kn = kind();
      return auswahl(`${kn} rechnet ${B2(a)} + ${B2(p)} · ${B2(q)} = ${B2(plus(a, p))} · ${B2(q)} = ${T(mal(plus(a, p), q))}. Welchen Fehler macht ${kn}?`, [opt('Es wurde zuerst addiert, obwohl die Multiplikation Vorrang hat.', true), opt('Die Brüche wurden falsch gleichnamig gemacht.', false, 'bruch-add-ungleichnamig'), opt('Beim Multiplizieren wurde nicht gekürzt.', false, 'kuerzen-nicht-vollstaendig'), opt('Es gibt keinen Fehler, die Rechnung stimmt.', false, 'punkt-vor-strich')],
        h2('Schau dir an, welche Rechnung zuerst ausgeführt wurde.', 'Ohne Klammer gilt Punkt vor Strich. Das Produkt muss zuerst berechnet werden.'), { nachweis: [FREI('Fehleranalyse: Punkt vor Strich missachtet')] }); },
  ]);
  sechs(R1, 'E', [
    () => { const e = gz([1, 2, 3], [2, 3, 4]), p = echt([3, 4, 5, 6]), f = gz([1], [2, 3, 4, 5]), x = echt([4, 6, 8, 12]), r = plus(minus(e, mal(p, f)), x);
      if (!pos(minus(e, mal(p, f))) || !istBruch(r) || r[1] > 48) return null;
      return rechneB(`Berechne ${T(e)} − ${B2(p)} · ${T(f)} + ${B2(x)} und kürze vollständig.`, r, [[plus(mal(minus(e, p), f), x), 'punkt-vor-strich'], [minus(minus(e, mal(p, f)), x), 'sub-klammerfehler']].filter(([q]) => pos(q)),
        h1('Berechne zuerst das Produkt mit unechten Brüchen. Rechne danach von links nach rechts.'), [`${T(e)} − ${B2(p)} · ${T(f)} + ${B2(x)} = ${T(r)}`]); },
    () => { const a = echt([3, 4, 5, 6]), c = echt([2, 3, 4, 5]), p = echt([4, 6, 8]), k = wahl([2, 3]), r = minus(durch(a, c), mal(p, ganz(k)));
      if (!pos(r) || !istBruch(r) || r[1] > 48 || gleich(a, c)) return null;
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} − ${B2(p)} · ${k} und kürze vollständig.`, r, [[mal(minus(durch(a, c), p), ganz(k)), 'punkt-vor-strich'], [minus(mal(a, c), mal(p, ganz(k))), 'bruch-kehrwert']].filter(([q]) => pos(q)),
        h1('Hier stehen zwei Punktrechnungen. Berechne beide, bevor du subtrahierst.'), [`${B2(a)} : ${B2(c)} − ${B2(p)} · ${k} = ${T(r)}`]); },
    () => { const a = echt([2, 3, 4]), p = echt([2, 3, 4]), q = echt([3, 4, 5, 6]), r = plus(a, mal(p, q));
      if (q[0] === 1 || !istBruch(r) || r[1] > 40 || gleich(a, p)) return null;
      return luecken(`Welcher Zähler fehlt? ${B2(a)} + ${B2(p)} · {{a}}⁄${q[1]} = ${T(r)}`, { a: [q[0], fehlerliste(q[0], [[q[1] - q[0], 'bruch-teil-zu-rest'], [r[0], 'sach-frage-verfehlt'], [q[0] + 1, 'punkt-vor-strich']])] },
        h1('Rechne rückwärts: Subtrahiere zuerst den ersten Bruch vom Ergebnis. Dividiere dann durch den Faktor.'), { nachweis: [`(${T(r)} − ${B2(a)}) : ${B2(p)} = ${B2(q)}`, { art: 'teil', bruch: B2(q), was: 'zaehler', zahl: q[0] }] }); },
    () => auswahl('Ein Rechenausdruck ohne Klammern enthält eine Addition und eine Multiplikation. Die Addition steht vorn. Was gilt?', mische([opt('Die Multiplikation wird trotzdem zuerst berechnet.', true), opt('Es wird von links nach rechts gerechnet, also zuerst addiert.', false, 'punkt-vor-strich'), opt('Die Reihenfolge ist egal, das Ergebnis bleibt gleich.', false, 'punkt-vor-strich'), opt('Bei Brüchen wird immer zuerst gleichnamig gemacht und addiert.', false, 'bruch-mal-wie-plus'), opt('Das hängt davon ab, welcher Bruch größer ist.', false, 'punkt-vor-strich')]),
      h1('Die Vorrangregel hängt nicht davon ab, ob mit natürlichen Zahlen oder mit Brüchen gerechnet wird.'), { nachweis: [FREI('Punkt vor Strich gilt unabhängig von der Stellung')] }),
    () => { const k1 = zz(2, 4), k2 = zz(2, 3), a = echt([4, 8]), c = echt([2, 4]), r = plus(mal(ganz(k1), a), mal(ganz(k2), c));
      if (!istBruch(r) || gleich(a, c)) return null;
      return rechneB(`Für eine Soße werden ${k1} Becher Milch mit je ${B2(a)} l und ${k2} Becher Sahne mit je ${B2(c)} l verrührt. Wie viel Liter Soße sind das? Kürze vollständig.`, r, [[mal(ganz(k1 + k2), plus(a, c)), 'punkt-vor-strich'], [plus(a, c), 'sach-schritt-vergessen'], [mal(ganz(k1), a), 'sach-schritt-vergessen']],
        h1('Schreibe einen einzigen Rechenausdruck mit zwei Produkten auf.'), [`${k1} · ${B2(a)} l + ${k2} · ${B2(c)} l = ${T(r)} l`], { einheit: 'l' }); },
    () => gleichungen(5, (stimmt) => { const a = echt([2, 3, 4]), p = echt([2, 3, 4, 5]), q = echt([2, 3, 4, 6]), art = wahl(['+', '−']), w = art === '+' ? plus(a, mal(p, q)) : minus(a, mal(p, q)), lr = mal(art === '+' ? plus(a, p) : minus(a, p), q), x = stimmt ? w : lr;
      return !pos(x) || !pos(w) || !istBruch(x) || gleich(x, w) !== stimmt ? null : `${B2(a)} ${art} ${B2(p)} · ${B2(q)} = ${T(x)}`; }, 'punkt-vor-strich', h1('Berechne in jeder Gleichung zuerst das Produkt. Wer von links nach rechts rechnet, erhält die falschen Werte.')),
  ]);

  // ================= R2: Klammern, geschickt rechnen =================
  const tK = h3('Die Klammer kommt zuerst.', `(${br(1, 7)} + ${br(2, 7)}) · 2 = ${br(3, 7)} · 2 = ${br(6, 7)}.`, 'Rechne zuerst aus, was in der Klammer steht. Rechne dann weiter.');
  sechs(R2, 'F', [
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => 2 * (x[0] + y[0]) < m);
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, 'Rechne zuerst die Klammer.', `(${B2(a)} + ${B2(c)}) · 2 = {{a}}⁄${n} · 2 = {{b}}⁄${n}`), { a: [a[0] + c[0], fehlerliste(a[0] + c[0], [[a[0] * c[0], 'bruch-mal-wie-plus']])], b: [2 * (a[0] + c[0]), fehlerliste(2 * (a[0] + c[0]), [[a[0] + 2 * c[0], 'klammer-ignoriert'], [a[0] + c[0] + 2, '1x1-addiert']])] }, tK,
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`(${B2(a)} + ${B2(c)}) · 2 = ${br(a[0] + c[0], n)} · 2 = ${br(2 * (a[0] + c[0]), n)}`] }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => x[0] > y[0] && (x[0] - y[0]) % 2 === 0 && ggt((x[0] - y[0]) / 2, m) === 1), r = [(a[0] - c[0]) / 2, n];
      return rechneB(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Rechne (${B2(a)} − ${B2(c)}) : 2.`), r, [[[a[0] - c[0], n], 'sach-schritt-vergessen'], [[2 * a[0] - c[0], 2 * n], 'klammer-ignoriert']].filter(([f]) => pos(f)),
        h3('Die Klammer kommt zuerst. Teile dann das Ergebnis.', `(${br(6, 7)} − ${br(2, 7)}) : 2 = ${br(4, 7)} : 2 = ${br(2, 7)}.`, `Rechne zuerst ${B2(a)} − ${B2(c)}. Teile dann den Zähler durch 2.`), [`(${B2(a)} − ${B2(c)}) : 2 = ${B2(r)}`], { bild: bild(streifen(...a)) }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => 2 * (x[0] + y[0]) < m && ggt(2 * (x[0] + y[0]), m) === 1 && 2 * x[0] + y[0] !== 2 * (x[0] + y[0])), r = [2 * (a[0] + c[0]), n];
      return auswahl(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, `Wie viel ist 2 · (${B2(a)} + ${B2(c)})?`), optionen(r, [[[2 * a[0] + c[0], n], 'verteilung-halb'], [[a[0] + c[0], n], 'sach-schritt-vergessen']], T), tK,
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`2 · (${B2(a)} + ${B2(c)}) = ${B2(r)}`, WERT(T(r), false)] }); },
    () => { const n = wahl(NF), a = echt([n]), c = echt([n]), e = echt([n]);
      if (a[0] <= c[0] + e[0] || c[0] === e[0]) return null;
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, 'Rechne zuerst die Klammer.', `${B2(a)} − (${B2(c)} + ${B2(e)}) = ${B2(a)} − {{a}}⁄${n} = {{b}}⁄${n}`), { a: [c[0] + e[0], fehlerliste(c[0] + e[0], [[Math.abs(c[0] - e[0]), 'add-subtrahiert']])], b: [a[0] - c[0] - e[0], fehlerliste(a[0] - c[0] - e[0], [[a[0] - c[0] + e[0], 'klammer-ignoriert'], [a[0] + c[0] + e[0], 'sub-addiert']])] },
        h3('Die Klammer kommt zuerst. Ziehe dann ihr Ergebnis ab.', `${br(6, 7)} − (${br(1, 7)} + ${br(2, 7)}) = ${br(6, 7)} − ${br(3, 7)} = ${br(3, 7)}.`, 'Zähle zuerst die beiden Brüche in der Klammer zusammen.'), { bild: bild(streifen(...a)), nachweis: [`${B2(a)} − (${B2(c)} + ${B2(e)}) = ${B2(a)} − ${br(c[0] + e[0], n)} = ${br(a[0] - c[0] - e[0], n)}`] }); },
    () => { const { a, c, n } = gleichn([5, 7], (x, y) => x[0] === 1 && y[0] === 2), k = 2, r = [k * (a[0] + c[0]), n], kn = kind();
      return rechneB(Z(`In einer Tüte sind ${B2(a)} kg Nüsse und ${B2(c)} kg Rosinen.`, `${kn} kauft ${k} Tüten.`, 'Wie viel Kilogramm sind das zusammen?'), r, [[[k * a[0] + c[0], n], 'verteilung-halb'], [[a[0] + c[0], n], 'sach-schritt-vergessen']],
        h3('Rechne zuerst aus, wie schwer eine Tüte ist.', `Eine Tüte: ${br(1, 7)} kg + ${br(2, 7)} kg = ${br(3, 7)} kg. Zwei Tüten: 2 · ${br(3, 7)} kg = ${br(6, 7)} kg.`, `Rechne ${k} · (${B2(a)} + ${B2(c)}). Die Klammer kommt zuerst.`), [`${k} · (${B2(a)} kg + ${B2(c)} kg) = ${T(r)} kg`], { einheit: 'kg', bild: zwei(streifen(...a), streifen(...c)) }); },
    () => { const { a, c, n } = gleichn(NF, (x, y, m) => (x[0] + y[0]) * 2 > m && (x[0] + y[0]) < m && ggt((x[0] + y[0]) * 2, m) === 1), r = [(a[0] + c[0]) * 2, n];
      return rechneB(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, `Rechne (${B2(a)} + ${B2(c)}) · 2.`, 'Schreibe das Ergebnis als gemischte Zahl.'), r, [[[a[0] + 2 * c[0], n], 'klammer-ignoriert'], [[a[0] + c[0], n], 'sach-schritt-vergessen']],
        h3('Die Klammer kommt zuerst. Schreibe am Ende als gemischte Zahl.', `(${br(2, 5)} + ${br(1, 5)}) · 2 = ${br(3, 5)} · 2 = ${br(6, 5)} = ${T([6, 5])}.`, `Rechne zuerst ${B2(a)} + ${B2(c)}. Nimm dann den Zähler mal 2.`), [`(${B2(a)} + ${B2(c)}) · 2 = ${T(r)}`], { bild: zwei(streifen(...a), streifen(...c)) }); },
  ]);
  const tKG = h3('Die Klammer kommt zuerst. Kürze am Ende.', `(${br(1, 2)} + ${br(1, 4)}) · ${br(2, 3)} = ${br(3, 4)} · ${br(2, 3)} = ${br(6, 12)} = ${br(1, 2)}.`, 'Rechne zuerst aus, was in der Klammer steht. Rechne dann weiter.');
  const VP = [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [2, 10], [5, 10], [3, 9], [3, 12], [4, 12], [6, 12]];
  const vpaar = (passt = () => true) => { for (let i = 0; i < 800; i++) { const [n, m] = wahl(VP), a = echt([n]), c = echt([m]); if (passt(a, c)) return { a, c }; } return null; };
  sechs(R2, 'G', [
    () => { const { a, c } = vpaar((x, y) => kleiner(plus(x, y), [1, 1])), q = echt([2, 3, 4, 5]), r = mal(plus(a, c), q);
      if (r[1] > 40) return null;
      return rechneB(Z(`Rechne (${B2(a)} + ${B2(c)}) · ${B2(q)}.`, 'Kürze das Ergebnis vollständig.'), r, [[plus(a, mal(c, q)), 'klammer-ignoriert'], [plus(a, c), 'sach-schritt-vergessen']], tKG, [`(${B2(a)} + ${B2(c)}) · ${B2(q)} = ${T(r)}`]); },
    () => { const n = wahl([4, 5, 6, 8]), a = echt([n]), c = echt([n]), d = a[0] - c[0];
      if (d < 1) return null;
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, 'Rechne zuerst die Klammer.', `(${B2(a)} − ${B2(c)}) · ${br(1, 2)} = {{a}}⁄${n} · ${br(1, 2)} = {{b}}⁄${2 * n}`), { a: [d, fehlerliste(d, [[a[0] + c[0], 'sub-addiert']])], b: [d, fehlerliste(d, [[2 * d, 'bruch-mal-nenner-mit'], [d + 1, 'bruch-mal-wie-plus']])] }, tKG,
        { bild: bild(streifen(...a)), nachweis: [`(${B2(a)} − ${B2(c)}) · ${br(1, 2)} = ${br(d, n)} · ${br(1, 2)} = ${br(d, 2 * n)}`] }); },
    () => { const k = wahl([2, 3]), n = wahl([4, 8]), m = n === 4 ? 8 : 4, r = mal(ganz(k), plus([1, n], [1, m]));
      const os = [[`${k} · (${br(1, n)} + ${br(1, m)})`, true], [`${k} · ${br(1, n)} + ${br(1, m)}`, false, 'verteilung-halb'], [`${k} + ${br(1, n)} + ${br(1, m)}`, false, 'sach-falsche-rechnung']];
      return auswahl(Z(`Der Kreis zeigt ${br(1, n)}.`, `Jedes Kind isst ${br(1, n)} Pizza mit Salami und ${br(1, m)} Pizza mit Käse.`, `Es sind ${k} Kinder.`, 'Welche Rechnung passt dazu?'), mische(os.map(([t, ri, fv]) => opt(t, ri, fv))),
        h3('Rechne zuerst aus, wie viel ein Kind isst. Das steht in der Klammer.', `Jedes Kind isst ${br(1, 4)} und ${br(1, 8)}. Bei 2 Kindern: 2 · (${br(1, 4)} + ${br(1, 8)}).`, 'Überlege: Für welche Brüche gilt die Anzahl der Kinder?'), { bild: bild({ form: 'kreis', teile: n, gefaerbt: [0] }), nachweis: [`${k} · (${br(1, n)} + ${br(1, m)}) = ${T(r)}`, WERT(T(r), false)] }); },
    () => { const { a, c } = vpaar((x, y) => kleiner(y, x)), x = echt([2, 3, 4, 5, 6]), d = minus(a, c), r = minus(x, d);
      if (!pos(r) || !istBruch(r) || r[1] > 40 || !pos(minus(x, a))) return null;
      return rechneB(Z(`Im Streifen ist ${B2(x)} gefärbt.`, `Rechne ${B2(x)} − (${B2(a)} − ${B2(c)}).`, 'Kürze das Ergebnis vollständig.'), r, [[minus(minus(x, a), c), 'klammer-ignoriert'], [d, 'sach-schritt-vergessen']].filter(([f]) => pos(f)),
        h3('Die Klammer kommt zuerst. Ziehe dann ihr Ergebnis ab.', `${br(3, 4)} − (${br(1, 2)} − ${br(1, 4)}) = ${br(3, 4)} − ${br(1, 4)} = ${br(2, 4)} = ${br(1, 2)}.`, `Rechne zuerst ${B2(a)} − ${B2(c)}. Ziehe das Ergebnis von ${B2(x)} ab.`), [`${B2(x)} − (${B2(a)} − ${B2(c)}) = ${T(r)}`], { bild: bild(streifen(...x)) }); },
    () => { const [n, m] = wahl([[2, 4], [2, 3], [3, 6], [2, 6], [2, 5], [2, 10], [5, 10], [4, 8], [2, 8]]), k = (n * m) / ggt(n, m) * wahl([1, 2]), a = echt([n]), c = echt([m]), x = (k / n) * a[0], y = (k / m) * c[0];
      if (k > 24) return null;
      return luecken(Z('Nimm jeden Bruch in der Klammer mal.', `${k} · (${B2(a)} + ${B2(c)}) = ${k} · ${B2(a)} + ${k} · ${B2(c)} = {{a}} + {{b}} = {{c}}`), { a: [x, fehlerliste(x, [[k * a[0], 'sach-schritt-vergessen']])], b: [y, fehlerliste(y, [[k * c[0], 'sach-schritt-vergessen'], [c[0], 'verteilung-halb']])], c: [x + y, fehlerliste(x + y, [[x, 'verteilung-halb']])] },
        h3('Du darfst die Zahl mit jedem Bruch in der Klammer einzeln malnehmen.', `4 · (${br(1, 2)} + ${br(1, 4)}) = 4 · ${br(1, 2)} + 4 · ${br(1, 4)} = 2 + 1 = 3.`, `Rechne ${k} · ${B2(a)} und ${k} · ${B2(c)}. Zähle beide Ergebnisse zusammen.`), { nachweis: [`${k} · (${B2(a)} + ${B2(c)}) = ${k} · ${B2(a)} + ${k} · ${B2(c)} = ${x} + ${y} = ${x + y}`] }); },
    () => { const { a, c } = vpaar((x, y) => kleiner(plus(x, y), [1, 1])), k = 2, richtig = mal(plus(a, c), ganz(k)), falle = plus(a, mal(c, ganz(k))), kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `(${B2(a)} + ${B2(c)}) · ${k} = ${T(x)}`;
      return urteil(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `${kn} rechnet: ${g(stimmt ? richtig : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? richtig : falle), g(stimmt ? falle : richtig), [g(plus(a, c))], 'klammer-ignoriert',
        h3('Die Klammer kommt zuerst. Erst danach wird malgenommen.', `(${br(1, 2)} + ${br(1, 4)}) · 2 = ${br(3, 4)} · 2 = ${br(6, 4)} = ${T([3, 2])}.`, `Rechne zuerst ${B2(a)} + ${B2(c)}. Nimm das Ergebnis mal ${k}.`), { bild: bild(streifen(...a)) }); },
  ]);
  sechs(R2, 'M', [
    () => { const a = echt(NM), c = echt(NM), q = echt([3, 4, 5, 6, 8]), d = minus(a, c), r = durch(d, q);
      if (!pos(d) || a[1] === c[1] || !istBruch(r) || r[1] > 40) return null;
      return rechneB(`Berechne (${B2(a)} − ${B2(c)}) : ${B2(q)} und kürze vollständig.`, r, [[minus(a, durch(c, q)), 'klammer-ignoriert'], [mal(d, q), 'bruch-kehrwert']].filter(([f]) => pos(f)),
        h2('Berechne zuerst die Klammer mit dem Hauptnenner.', `${B2(a)} − ${B2(c)} = ${B2(d)}. Dividiere dann durch ${B2(q)}: mit dem Kehrwert multiplizieren.`), [`(${B2(a)} − ${B2(c)}) : ${B2(q)} = ${T(r)}`]); },
    () => { const e = gz([1, 2], [2, 3, 4]), a = echt([2, 3, 4, 6]), c = echt([3, 4, 6, 8, 12]), s = plus(a, c), r = mal(e, s);
      if (a[1] === c[1] || !istBruch(r) || r[1] > 40) return null;
      return rechneB(`Berechne ${T(e)} · (${B2(a)} + ${B2(c)}) und kürze vollständig.`, r, [[plus(mal(e, a), c), 'verteilung-halb'], [s, 'sach-schritt-vergessen']],
        h2('Berechne zuerst die Klammer. Wandle die gemischte Zahl in einen Bruch um.', `${B2(a)} + ${B2(c)} = ${T(s)}. Multipliziere das mit ${B2(e)}.`), [`${T(e)} · (${B2(a)} + ${B2(c)}) = ${T(r)}`]); },
    () => { const f = echt([3, 5, 7, 8, 9]), n = wahl([5, 7, 9, 11]), a = echt([n]), c = [n - a[0], n];
      if (ggt(c[0], n) > 1 || f[1] === n) return null;
      return rechneB(`Berechne geschickt: ${B2(f)} · ${B2(a)} + ${B2(f)} · ${B2(c)}`, f, [[mal(f, a), 'verteilung-halb'], [mal(f, f), 'verteilung-halb']],
        h2('In beiden Produkten steckt derselbe Faktor. Klammere ihn aus.', `${B2(f)} · (${B2(a)} + ${B2(c)}). Schau dir die Summe in der Klammer genau an.`), [`${B2(f)} · ${B2(a)} + ${B2(f)} · ${B2(c)} = ${B2(f)}`]); },
    () => { const a = echt([2, 3, 4]), c = echt([2, 3, 4, 6]), p = echt([2, 3, 4]), q = echt([3, 4, 6]), s = plus(a, c), d = minus(p, q), r = durch(s, d);
      if (a[1] === c[1] || p[1] === q[1] || !pos(d) || !istBruch(r) || r[1] > 30) return null;
      return rechneB(`Berechne (${B2(a)} + ${B2(c)}) : (${B2(p)} − ${B2(q)}) und kürze vollständig.`, r, [[mal(s, d), 'bruch-kehrwert'], [durch(d, s), 'bruch-kehrwert']],
        h2('Berechne zuerst beide Klammern. Dividiere dann.', `Die erste Klammer ergibt ${T(s)}, die zweite ${B2(d)}.`), [`(${B2(a)} + ${B2(c)}) : (${B2(p)} − ${B2(q)}) = ${T(r)}`]); },
    () => { const [n, m] = wahl([[2, 3], [2, 4], [3, 4], [2, 5], [3, 6], [4, 6]]), a = echt([n]), c = echt([m]), k = (n * m) / ggt(n, m), art = wahl([0, 1]), links = `(${B2(a)} + ${B2(c)}) · ${k}`, rechts = art ? `${B2(a)} · ${k} + ${B2(c)} · ${k}` : `${B2(a)} + ${B2(c)} · ${k}`, l = mal(plus(a, c), ganz(k)), r = art ? l : plus(a, mal(c, ganz(k)));
      return auswahl(`Welches Zeichen passt? ${links} ▢ ${rechts}`, ZEICHEN(l[0] * r[1] - r[0] * l[1], 'verteilung-halb'), h2('Wird eine Summe multipliziert, dann wird jeder Summand multipliziert.', `Links: (${B2(a)} + ${B2(c)}) · ${k} = ${T(l)}. Prüfe, ob rechts beide Brüche mit ${k} multipliziert werden.`), { nachweis: [VGL(links, rechts)] }); },
    () => auswahl('Du sollst das Produkt aus einer natürlichen Zahl und einer Summe von zwei Brüchen berechnen. Die Zahl ist ein Vielfaches beider Nenner. Welcher Weg ist geschickt?', mische([opt('Die Zahl mit jedem Bruch einzeln multiplizieren, denn dann kürzen sich die Nenner weg.', true), opt('Die Zahl nur mit dem ersten Bruch multiplizieren und den zweiten addieren.', false, 'verteilung-halb'), opt('Zuerst die Zahl zu den Zählern addieren.', false, '1x1-addiert'), opt('Die Klammer weglassen, denn Punkt vor Strich regelt die Reihenfolge.', false, 'klammer-ignoriert')]),
      h2('Denke an das Verteilungsgesetz.', 'Bei einem Vielfachen der Nenner entstehen beim Ausmultiplizieren natürliche Zahlen.'), { nachweis: [FREI('Verteilungsgesetz geschickt nutzen')] }),
  ]);
  sechs(R2, 'E', [
    () => { const e = gz([1, 2, 3], [2, 4]), f = gz([0, 1], [2, 3, 4]), a = echt([2, 3, 4]), c = echt([3, 4, 6]), q = echt([3, 4, 5, 6]), d = minus(e, f), s = plus(a, c), r = mal(durch(d, s), q);
      if (!pos(d) || a[1] === c[1] || !istBruch(r) || r[1] > 24) return null;
      return rechneB(`Berechne (${T(e)} − ${T(f)}) : (${B2(a)} + ${B2(c)}) · ${B2(q)} und kürze vollständig.`, r, [[durch(d, mal(s, q)), 'klammer-falsch-gesetzt'], [durch(d, s), 'sach-schritt-vergessen']],
        h1('Berechne zuerst beide Klammern. Rechne danach von links nach rechts.'), [`(${T(e)} − ${T(f)}) : (${B2(a)} + ${B2(c)}) · ${B2(q)} = ${T(r)}`]); },
    () => { const f = echt([4, 5, 6, 7, 8, 9]), n = wahl([2, 3, 4, 5]), c = echt([n]), g = zz(1, 3), e = [g * n + c[0], n], r = mal(f, ganz(g));
      if (!istBruch(r) || f[1] === n) return null;
      return rechneB(`Berechne geschickt: ${B2(f)} · ${T(e)} − ${B2(f)} · ${B2(c)}`, r, [[mal(f, e), 'verteilung-halb'], [mal(f, minus(e, [2 * c[0], n])), 'sub-klammerfehler']].filter(([x]) => pos(x)),
        h1('Klammere den gemeinsamen Faktor aus. Die Differenz in der Klammer ist dann eine natürliche Zahl.'), [`${B2(f)} · ${T(e)} − ${B2(f)} · ${B2(c)} = ${T(r)}`]); },
    () => { const a = echt([2, 3, 4]), c = echt([2, 3, 4]), p = echt([2, 3]), q = echt([4, 6]);
      if (a[1] === c[1] || !kleiner(q, p)) return null;
      const terme = [[`(${B2(a)} + ${B2(c)}) · ${B2(p)} − ${B2(q)}`, minus(mal(plus(a, c), p), q)], [`${B2(a)} + ${B2(c)} · (${B2(p)} − ${B2(q)})`, plus(a, mal(c, minus(p, q)))], [`(${B2(a)} + ${B2(c)}) · (${B2(p)} − ${B2(q)})`, mal(plus(a, c), minus(p, q))], [`${B2(a)} + ${B2(c)} · ${B2(p)} − ${B2(q)}`, minus(plus(a, mal(c, p)), q)]];
      if (terme.some(([, w]) => !pos(w)) || new Set(terme.map(([, w]) => T(w))).size < 4) return null;
      const ziel = wahl([0, 1, 2]);
      return auswahl(`In der Rechnung ${B2(a)} + ${B2(c)} · ${B2(p)} − ${B2(q)} fehlen Klammern. Mit welchen Klammern hat der Ausdruck den Wert ${T(terme[ziel][1])}?`, mische(terme.map(([t], i) => opt(t, i === ziel, i === ziel ? undefined : i === 3 ? 'klammer-ignoriert' : 'klammer-falsch-gesetzt'))),
        h1('Überschlage zuerst, welche Klammerung den Wert deutlich verändert. Rechne dann die Kandidaten nach.'), { nachweis: [`${terme[ziel][0]} = ${T(terme[ziel][1])}`, WERT(T(terme[ziel][1]), false)] }); },
    () => auswahl('Ein Rechenausdruck hat die Form: Bruch mal erste Zahl plus derselbe Bruch mal zweite Zahl. Wann lohnt sich das Ausklammern besonders?', mische([opt('Wenn die Summe der beiden Zahlen eine natürliche Zahl ist oder sich gut mit dem Nenner kürzen lässt.', true), opt('Immer, denn Ausklammern verändert das Ergebnis zum Einfacheren.', false, 'verteilung-halb'), opt('Nur wenn beide Zahlen gleich sind.', false, 'verteilung-halb'), opt('Nur wenn der Bruch den Zähler eins hat.', false, 'verteilung-halb'), opt('Nie, denn zuerst müssen die Produkte berechnet werden.', false, 'punkt-vor-strich')]),
      h1('Ausklammern ändert den Wert nicht. Es lohnt sich, wenn die Klammer danach leicht zu berechnen ist.'), { nachweis: [FREI('Wann Ausklammern geschickt ist')] }),
    () => { const e = gz([1, 2, 3], [2, 4]), f = gz([1, 2], [4]), k = zz(2, 5), r = mal(ganz(k), plus(e, f)), kn = kind();
      if (!istBruch(r) || gleich(e, f)) return null;
      return rechneB(`${kn} wandert an ${k} Tagen jeden Vormittag ${T(e)} km und jeden Nachmittag ${T(f)} km. Wie viele Kilometer sind das insgesamt? Kürze vollständig.`, r, [[plus(mal(ganz(k), e), f), 'verteilung-halb'], [plus(e, f), 'sach-schritt-vergessen']],
        h1('Schreibe einen Rechenausdruck mit Klammer: die Strecke eines Tages mal die Anzahl der Tage.'), [`${k} · (${T(e)} km + ${T(f)} km) = ${T(r)} km`], { einheit: 'km' }); },
    () => gleichungen(5, (stimmt) => { const a = echt([2, 3, 4]), c = echt([2, 3, 4, 6]), q = echt([2, 3, 4, 5]), art = wahl(['·', ':']), s = plus(a, c), w = art === '·' ? mal(s, q) : durch(s, q), f = art === '·' ? plus(a, mal(c, q)) : plus(a, durch(c, q)), x = stimmt ? w : f;
      return a[1] === c[1] || !istBruch(x) || gleich(x, w) !== stimmt || x[1] > 40 ? null : `(${B2(a)} + ${B2(c)}) ${art} ${B2(q)} = ${T(x)}`; }, 'klammer-ignoriert', h1('Berechne in jeder Gleichung zuerst die Klammer. Wer sie übergeht, erhält die falschen Werte.')),
  ]);
}
