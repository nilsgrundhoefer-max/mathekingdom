// Aufgaben zu 5.5.3 „Zueinander parallele Geraden“ (Lernziele P1 und P2) nach ADR 0015 und ADR 0032.
// P1 erkennen, ob zwei Linien parallel zueinander sind. P2 Parallelen zeichnen (Gitterzeichnen; ab M auch im Heft mit Kontrollwert).
// Typische Fehlvorstellung: „Parallel heißt gleich lang“ oder „genau untereinander“. Deshalb sind parallele Strecken hier oft verschieden lang und versetzt.
import { sechs, zahl, auswahl, opt, gitterLinie, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, FG, plus, minus, senk, drin, WAAGERECHT, LOTRECHT, kreuzP, skalarP, streckenBild, cmmm, mmRechnung, DREIECKE } from './5-5-geo.mjs';

const L_ = (kurz) => `5.5.3-${kurz}`;
const D1 = [1, 1], D2 = [1, -1];
const KAESTCHEN = HILFSZAHL(1, '2 Kästchen sind 1 cm');
const lageVon = (u, v) => (kreuzP(u, v) === 0 ? 'parallel' : skalarP(u, v) === 0 ? 'senkrecht' : 'schraeg');
const fvPar = (v, r, gleichLang) => (skalarP(v, r) === 0 ? 'senkrecht-parallel-verwechselt' : gleichLang ? 'parallel-gleichlang' : undefined);
// „Welche Linie ist parallel zu g?“: g und Strecken a, b, c … daneben. richtungen: [Richtung, Schritte].
function zuG(text, v, richtungen, hilfen, { bild, mehrfach } = {}) {
  const k = streckenBild(v, mische(richtungen), bild), lang = bild?.langG ? skalarP(v, v) * bild.langG ** 2 : -1;
  const optionen = k.linien.map((l) => { const r = minus(l.b, l.a), ok = kreuzP(r, v) === 0; return opt(`Linie ${l.n}`, ok, ok ? undefined : fvPar(v, r, skalarP(r, r) === lang)); });
  return auswahl(text, optionen, hilfen, { bild: B.gitter(k.g), nachweis: [{ art: 'lagezu', zu: 'g', lage: 'parallel' }], ...(mehrfach ? { mehrfach: true } : {}) });
}
// Zwei Linien g und h mit den Richtungen u und v. Parallele liegen `weit` Schritte auseinander, andere schneiden sich.
function zwei(u, v, { b = 10, h = 7, weit = 2 } = {}) {
  const par = kreuzP(u, v) === 0, n = senk(u);
  const s = suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => (par ? drin(b, h, plus(p, u, -1), plus(p, u, 1), plus(plus(p, n, weit), u, -1), plus(plus(p, n, weit), u, 1)) : drin(b, h, plus(p, u, -1), plus(p, u, 1), plus(p, v, -1), plus(p, v, 1))));
  const q = par ? plus(s, n, weit) : s;
  return GT(b, h, { linien: [LN('g', plus(s, u, -1), plus(s, u, 1)), LN('h', plus(q, v, -1), plus(q, v, 1))] });
}
function geraden(b, h, liste) {
  const linien = liste.map(([n, p, v]) => LN(n, p, plus(p, v)));
  const paare = liste.flatMap(([n1, , u], i) => liste.slice(i + 1).map(([n2, , v]) => [n1, n2, lageVon(u, v)]));
  return { g: GT(b, h, { linien }), paare, parallele: paare.filter((x) => x[2] === 'parallel').length };
}
const paarOptionen = (b, zeichen, fv) => [['g', 'h'], ['g', 'k'], ['h', 'k']].map(([m, n]) => { const l = b.paare.find((q) => [q[0], q[1]].sort().join() === [m, n].join())[2]; return opt(`${m} ${zeichen} ${n}`, l === 'parallel', l === 'parallel' ? undefined : fv(l)); });
const viereck = (b, h, ecken) => GT(b, h, { figuren: [FG(null, ecken)], punkte: ecken.map((e, i) => PT('ABCD'[i], ...e, ['lu', 'ru', 'ro', 'lo'][i])) });
const parallelPaare = (e) => [0, 1].filter((i) => kreuzP(minus(e[i + 1], e[i]), minus(e[(i + 3) % 4], e[i + 2])) === 0).length;

// Eine Gerade g mit Richtung v und ein Punkt P neben g. Die Parallele durch P hat einen zweiten Gitterpunkt im Gitter.
function mitPunkt(v, { b = 12, h = 8 } = {}) {
  const n = senk(v);
  const x = suche(() => ({ a: [zz(0, b), zz(0, h)], t: zz(0, 3), m: wahl([-3, -2, -1, 1, 2, 3]) }), ({ a, t, m }) => { const p = plus(plus(a, v, t), n, m);
    return drin(b, h, a, plus(a, v, 2)) && drin(b - 1, h - 1, p) && p[0] >= 1 && p[1] >= 1 && (drin(b, h, plus(p, v)) || drin(b, h, plus(p, v, -1))) && Math.abs(m) * Math.sqrt(skalarP(v, v)) >= 2; });
  const p = plus(plus(x.a, v, x.t), n, x.m);
  return { a: x.a, p, v, n, zu: [x.a, plus(x.a, v)], bsp: [p, drin(b, h, plus(p, v)) ? plus(p, v) : plus(p, v, -1)] };
}
const bildMitG = (x, b = 12, h = 8) => GT(b, h, { linien: [LN('g', x.a, plus(x.a, x.v))], punkte: [PT('P', ...x.p, x.v[1] === 0 ? 'ro' : 'r')] });
function zeichenFehler(x) {
  const f = [[{ art: 'senkrecht', zu: x.zu, durch: x.p }, 'senkrecht-parallel-verwechselt', [x.p, plus(x.p, x.n)]]];
  if (x.v[0] !== 0 && x.v[1] !== 0) { f.push([{ art: 'gerade', a: x.p, b: plus(x.p, WAAGERECHT) }, 'lage-prototyp']); f.push([{ art: 'gerade', a: x.p, b: plus(x.p, LOTRECHT) }, 'lage-prototyp']); }
  return f;
}
const paralleleDurch = (text, x, hilfen, b = 12, h = 8) => gitterLinie(text, bildMitG(x, b, h), 'gerade', { art: 'parallel', zu: x.zu, durch: x.p }, x.bsp, zeichenFehler(x), hilfen);
// Eine Parallele zu g in einem festen Abstand (in Kästchen); g verläuft waagerecht oder von oben nach unten.
function imAbstand(text, v, k, hilfen, extra) {
  const a = v === WAAGERECHT ? [1, zz(k, 8 - k)] : [zz(k, 12 - k), 1], zu = [a, plus(a, v)], n = senk(v), seite = drin(12, 8, plus(a, n, k)) ? 1 : -1, p = plus(a, n, seite * k);
  const f = [k - 1, k + 1].filter((d) => d > 0).map((d) => [{ art: 'parallel', zu, abstand: d }, 'koord-ab-eins']);
  return gitterLinie(text, GT(12, 8, { linien: [LN('g', ...zu)] }), 'gerade', { art: 'parallel', zu, abstand: k }, [p, plus(p, v)], f, hilfen, extra);
}

export function parallele() {
  // =====================================================================
  // P1 Erkennen, ob zwei Linien parallel zueinander sind
  // =====================================================================
  sechs(L_('P1'), 'F', [
    () => zuG(Z('Schau dir die Linien an.', 'Welche Linie ist parallel zu g?'), WAAGERECHT, [[WAAGERECHT, zz(2, 3)], [wahl([D1, D2]), 3]],
      h3('Zwei parallele Linien liegen überall gleich weit auseinander.', 'Die beiden Schienen eines Gleises sind parallel zueinander.', 'Suche die Linie, die genauso von links nach rechts läuft wie g.'), { bild: { langG: 6 } }),
    () => { const [u, v] = wahl([[WAAGERECHT, WAAGERECHT], [LOTRECHT, LOTRECHT], [WAAGERECHT, D1], [LOTRECHT, D2]]), par = kreuzP(u, v) === 0;
      return auswahl(Z('Schau dir die Linien g und h an.', 'Was stimmt?'), [opt('Sie sind parallel zueinander.', par), opt('Sie sind nicht parallel zueinander.', !par)],
        h3('Zwei parallele Linien treffen sich nie.', 'Zwei parallele Linien haben überall den gleichen Abstand.', par ? 'Miss den Abstand links und rechts in Kästchen. Er ist gleich.' : 'Die Linien treffen sich in einem Punkt.'), { bild: B.gitter(zwei(u, v)), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: par ? 'parallel' : 'schraeg' }] }); },
    () => zuG(Z('Die Linie g läuft von oben nach unten.', 'Welche Linie ist parallel zu g?'), LOTRECHT, [[LOTRECHT, zz(2, 3)], [WAAGERECHT, 4]],
      h3('Zwei parallele Linien laufen in dieselbe Richtung.', 'Die Kanten einer Tür links und rechts sind parallel zueinander.', 'Suche die Linie, die auch von oben nach unten läuft.'), { bild: { langG: 4 } }),
    () => { const v = wahl([WAAGERECHT, LOTRECHT]), d = wahl([D1, D2]), r = mische(wahl([[[v, 2], [v, 4], [d, 2]], [[v, 3], [d, 2], [senk(v), 2]], [[v, 2], [v, 3], [senk(v), 3]]])), k = streckenBild(v, r), n = r.filter(([x]) => x === v).length;
      return zahl(Z('Schau dir die Linien a, b und c an.', 'Wie viele davon sind parallel zu g?'), n, fehlerliste(n, [[r.length, 'lage-prototyp']]),
        h3('Prüfe jede Linie einzeln.', 'Eine parallele Linie darf kürzer oder länger sein.', 'Zähle die Linien mit derselben Richtung wie g.'), { bild: B.gitter(k.g), nachweis: [{ art: 'lagezuZahl', zu: 'g', lage: 'parallel', wert: n }] }); },
    () => { const v = wahl([WAAGERECHT, LOTRECHT]);
      return auswahl(Z('Die Linien g und h sind parallel zueinander.', 'Was gilt für parallele Linien?'), [opt('Sie haben überall den gleichen Abstand.', true), opt('Sie sind immer gleich lang.', false, 'parallel-gleichlang'), opt('Sie bilden einen rechten Winkel.', false, 'senkrecht-parallel-verwechselt')],
        h3('Schau auf den Abstand der beiden Linien.', 'Der Abstand ist links genauso groß wie rechts.', 'Zwei parallele Linien treffen sich nie. Ihr Abstand bleibt gleich.'), { bild: B.gitter(zwei(v, v, { weit: zz(2, 3) })), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: 'parallel' }] }); },
    () => { const namen = mische(['g', 'h', 'k']), v = wahl([WAAGERECHT, LOTRECHT]), d = wahl([D1, D2]);
      const b = geraden(10, 7, v === WAAGERECHT ? [[namen[0], [1, zz(1, 2)], v], [namen[1], [1, zz(5, 6)], v], [namen[2], d === D1 ? [4, 2] : [4, 5], d]] : [[namen[0], [zz(1, 2), 1], v], [namen[1], [zz(7, 9), 1], v], [namen[2], d === D1 ? [4, 2] : [4, 5], d]]);
      return auswahl(Z('Du siehst drei Linien.', 'Welche zwei Linien sind parallel zueinander?'), paarOptionen(b, 'und', () => undefined),
        h3('Suche zwei Linien mit derselben Richtung.', 'Zwei parallele Linien kreuzen sich nicht.', 'Die schräge Linie kreuzt die beiden anderen. Sie gehört nicht dazu.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagewahl', lage: 'parallel' }] }); },
  ]);
  sechs(L_('P1'), 'G', [
    () => { const v = wahl([D1, D2]), w = v === D1 ? D2 : D1;
      return zuG(Z('Die Linie g verläuft schräg.', 'Welche Linie ist parallel zu g?'), v, [[v, 2], [w, 4], [wahl([WAAGERECHT, LOTRECHT]), 4]],
        h3('Auch schräge Linien können parallel zueinander sein.', 'Zwei parallele Linien müssen nicht gleich lang sein.', 'Suche die Linie mit derselben Richtung wie g.'), { bild: { b: 12, h: 9, langG: 4 } }); },
    () => { const ist = wahl(['parallel', 'parallel', 'senkrecht', 'schraeg']), [u, v] = ist === 'parallel' ? wahl([[D1, D1], [D2, D2], [WAAGERECHT, WAAGERECHT]]) : ist === 'senkrecht' ? wahl([[D1, D2], [WAAGERECHT, LOTRECHT]]) : wahl([[WAAGERECHT, D1], [LOTRECHT, D2]]);
      return auswahl(Z('Schau dir die Geraden g und h an.', 'Wie liegen sie zueinander?'), [opt('Sie sind parallel zueinander.', ist === 'parallel', ist === 'parallel' ? undefined : 'senkrecht-parallel-verwechselt'), opt('Sie sind senkrecht zueinander.', ist === 'senkrecht', ist === 'senkrecht' ? undefined : 'senkrecht-parallel-verwechselt'), opt('Weder parallel noch senkrecht.', ist === 'schraeg')],
        h3('Prüfe zuerst: Schneiden sich die Geraden?', 'Geraden ohne Schnittpunkt sind parallel zueinander.', ist === 'parallel' ? 'Die Geraden haben überall den gleichen Abstand.' : 'Die Geraden schneiden sich. Schau auf den Winkel.'), { bild: B.gitter(zwei(u, v, { weit: u === WAAGERECHT ? 3 : 2 })), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: ist }] }); },
    () => { const namen = mische(['g', 'h', 'k']), v = wahl([D1, D2]), b = geraden(10, 7, [[namen[0], v === D1 ? [1, 2] : [1, 5], v], [namen[1], v === D1 ? [5, 2] : [5, 5], v], [namen[2], [zz(4, 6), zz(3, 4)], wahl([WAAGERECHT, LOTRECHT])]]);
      return auswahl(Z('Das Zeichen ∥ bedeutet: parallel zueinander.', 'Was stimmt?'), paarOptionen(b, '∥', () => 'lage-prototyp'),
        h3('Suche die beiden Geraden mit derselben Richtung.', 'g ∥ h liest du so: g ist parallel zu h.', 'Die beiden schrägen Geraden schneiden sich nicht.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagewahl', lage: 'parallel' }] }); },
    () => { const v = wahl([WAAGERECHT, LOTRECHT, D1]), fast = v === WAAGERECHT ? [4, 1] : v === LOTRECHT ? [1, 4] : [2, 1], r = mische(wahl([[[v, 2], [v, 4], [fast, 1], [senk(v), 2]], [[v, 3], [fast, 1], [senk(v), 3], [senk(v), 2]], [[v, 2], [v, 3], [v, 4], [fast, 1]]])), k = streckenBild(v, r, { b: 13, h: 9 }), n = r.filter(([x]) => x === v).length;
      return zahl(Z('Schau dir die Linien a, b, c und d an.', 'Wie viele davon sind parallel zu g?'), n, fehlerliste(n, [[n + 1, 'lage-prototyp']]),
        h3('Prüfe jede Linie einzeln.', 'Fast parallel reicht nicht. Der Abstand muss überall gleich sein.', 'Miss bei jeder Linie den Abstand zu g am Anfang und am Ende.'), { bild: B.gitter(k.g), nachweis: [{ art: 'lagezuZahl', zu: 'g', lage: 'parallel', wert: n }] }); },
    () => { const k = kind(), v = wahl([WAAGERECHT, D1, LOTRECHT]), n = senk(v), x = suche(() => ({ p: [zz(1, 9), zz(1, 6)], l1: zz(2, 3), l2: zz(5, 6), s: zz(1, 2) }), (q) => drin(11, 7, q.p, plus(q.p, v, q.l2), plus(plus(q.p, n, 2), v, q.s), plus(plus(q.p, n, 2), v, q.s + q.l1)));
      const g = GT(11, 7, { linien: [LN('a', x.p, plus(x.p, v, x.l2), 'strecke'), LN('b', plus(plus(x.p, n, 2), v, x.s), plus(plus(x.p, n, 2), v, x.s + x.l1), 'strecke')] });
      return auswahl(Z(`${k} sagt: „Die Strecken a und b sind nicht parallel.“`, `${k} meint: „Sie sind ja nicht gleich lang.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'parallel-gleichlang'), opt('Falsch. Parallele Strecken müssen nicht gleich lang sein.', true), opt('Falsch. Die Strecken sind senkrecht zueinander.', false, 'senkrecht-parallel-verwechselt')],
        h3('Für parallel zählt nur die Richtung, nicht die Länge.', 'Verlängere beide Strecken in Gedanken zu Geraden.', 'Die verlängerten Linien haben überall den gleichen Abstand.'), { bild: B.gitter(g), nachweis: [U(false), { art: 'lage', linien: ['a', 'b'], lage: 'parallel' }] }); },
    () => { const d = zz(2, 4), y = zz(1, 6 - d), g = GT(11, 7, { linien: [LN('g', [1, y], [2, y]), LN('h', [1, y + d], [2, y + d])] });
      return zahl(Z('Die Geraden g und h sind parallel zueinander.', `Links liegen sie ${d} Kästchen auseinander.`, 'Wie viele Kästchen sind es rechts?'), d, fehlerliste(d, [[d + 1, 'parallel-gleichlang'], [d - 1, 'parallel-gleichlang']]),
        h3('Parallele Geraden haben überall den gleichen Abstand.', 'Der Abstand ist an jeder Stelle gleich groß.', 'Zähle rechts die Kästchen zwischen g und h.'), { einheit: 'Kästchen', bild: B.gitter(g), nachweis: [{ art: 'abstandLinien', linien: ['g', 'h'], wert: d, einheit: 'kaestchen' }] }); },
  ]);
  sechs(L_('P1'), 'M', [
    () => { const v = wahl([[2, 1], [1, 2], [2, -1]]), fast = v[0] === 2 ? [3 * Math.sign(v[0]), v[1]] : [1, 3];
      return zuG('Welche Linie ist parallel zur Geraden g?', v, [[v, 2], [fast, 1], [[v[1], v[0]], 2]],
        h2('Zwei parallele Linien haben dasselbe Schrittmuster.', 'Zähle bei jeder Linie, wie viele Kästchen sie nach rechts und wie viele sie nach oben oder unten geht.'), { bild: { b: 13, h: 10 } }); },
    () => { const v = wahl([[2, 1], [1, 2], D1]), fast = v === D1 ? [3, 2] : v[0] === 2 ? [3, 1] : [1, 3];
      return zuG('Welche Linien sind parallel zur Geraden g? Kreuze alle an.', v, [[v, 1], [v, 2], [fast, 1], [senk(v), 2]],
        h2('Auf die Länge und auf die Lage im Bild kommt es nicht an.', 'Vergleiche die Schrittmuster: Eine Linie mit dem doppelten Schrittmuster ist auch parallel.'), { bild: { b: 14, h: 11 }, mehrfach: true }); },
    () => { const b = geraden(12, 8, wahl([
      [['g', [1, 1], WAAGERECHT], ['h', [1, 6], WAAGERECHT], ['k', [3, 3], D1], ['m', [8, 3], D1]],
      [['g', [1, 1], [2, 1]], ['h', [1, 4], [2, 1]], ['k', [5, 1], [3, 1]], ['m', [9, 3], LOTRECHT]],
      [['g', [2, 1], LOTRECHT], ['h', [6, 1], LOTRECHT], ['k', [10, 1], LOTRECHT], ['m', [3, 4], WAAGERECHT]],
      [['g', [1, 6], D2], ['h', [5, 6], D2], ['k', [2, 2], [2, 1]], ['m', [8, 2], [1, 2]]],
      [['g', [1, 2], [1, 2]], ['h', [5, 2], [1, 2]], ['k', [1, 7], [2, -1]], ['m', [5, 7], [2, -1]]]]));
      return zahl('Im Bild siehst du die Geraden g, h, k und m. Wie viele Paare von Geraden sind parallel zueinander?', b.parallele, fehlerliste(b.parallele, [[b.parallele + 1, 'lage-prototyp'], [b.parallele - 1, 'lage-prototyp']]),
        h2('Gehe alle Paare der Reihe nach durch: g mit h, g mit k, g mit m, h mit k, h mit m, k mit m.', 'Vergleiche die Schrittmuster. Drei parallele Geraden bilden drei Paare.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagezahl', lage: 'parallel', wert: b.parallele }] }); },
    () => { const u = wahl([[3, 1], [2, 1], [3, 2], [4, 1], [1, 2]]), f = wahl([2, 3]), a = suche(() => [zz(0, 3), zz(1, 3)], (p) => drin(12, 8, plus(p, u, 2)));
      return zahl(`Die Gerade g geht immer ${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach oben. Die Gerade h ist parallel zu g. Wie viele Kästchen geht h nach oben, wenn sie ${f * u[0]} Kästchen nach rechts geht?`, f * u[1], fehlerliste(f * u[1], [[u[1], 'sach-schritt-vergessen'], [f * u[0], 'sach-falsche-rechnung']]),
        h2('Parallele Geraden haben dasselbe Schrittmuster.', `Die Gerade h macht das Schrittmuster von g ${f}-mal hintereinander.`), { einheit: 'Kästchen', bild: B.gitter(GT(12, 8, { linien: [LN('g', a, plus(a, u))] })), nachweis: [{ art: 'schritt', u, v: [f * u[0], f * u[1]], lage: 'parallel' }, ...N(`${f * u[0]} : ${u[0]}`, `${f} · ${u[1]}`)] }); },
    () => { const k = kind(), dreh = wahl([false, true]), b = geraden(11, 7, dreh ? [['g', [1, 2], WAAGERECHT], ['h', [1, 5], WAAGERECHT], ['k', [zz(4, 7), 3], LOTRECHT]] : [['g', [3, 1], LOTRECHT], ['h', [8, 1], LOTRECHT], ['k', [5, zz(2, 5)], WAAGERECHT]]);
      return auswahl(`${k} sagt: „Die Geraden g und h sind beide senkrecht zu k. Also sind g und h parallel zueinander.“ Stimmt das?`, [opt('Stimmt. Zwei Geraden, die senkrecht zur selben Geraden sind, sind parallel zueinander.', true), opt('Falsch. Dann sind g und h senkrecht zueinander.', false, 'senkrecht-parallel-verwechselt'), opt('Falsch. Über g und h lässt sich nichts sagen.', false)],
        h2('Prüfe die Aussage am Bild.', 'Beide Geraden bilden mit k einen rechten Winkel. Sie laufen deshalb in dieselbe Richtung.'), { bild: B.gitter(b.g), nachweis: [U(true), { art: 'lage', linien: ['g', 'h'], lage: 'parallel' }, { art: 'lage', linien: ['g', 'k'], lage: 'senkrecht' }, { art: 'lage', linien: ['h', 'k'], lage: 'senkrecht' }] }); },
    () => { const u = wahl([[3, 1], [2, 1], [3, -1]]), w = wahl([[1, 2], [1, 3], [-1, 2]]), art = wahl(['parallelogramm', 'trapez', 'trapez', 'keins']);
      const form = (a) => (art === 'parallelogramm' ? [a, plus(a, u, 2), plus(plus(a, u, 2), w), plus(a, w)] : art === 'trapez' ? [a, plus(a, u, 2), plus(plus(a, u), w), plus(a, w)] : [a, plus(a, u, 2), plus(plus(plus(a, u), w), [0, 1]), plus(a, w)]);
      const e = suche(() => form([zz(1, 9), zz(1, 7)]), (q) => drin(12, 8, ...q) && q.every((x) => x[0] >= 1 && x[1] >= 1) && (art !== 'keins' || parallelPaare(q) === 0)), z = parallelPaare(e);
      return zahl('Wie viele Paare paralleler Seiten hat das Viereck ABCD?', z, fehlerliste(z, [[z + 1, 'lage-prototyp'], [4, 'viereck-eigenschaft']]),
        h2('Vergleiche nur Seiten, die einander gegenüberliegen: AB mit CD und BC mit DA.', 'Bestimme für jede Seite das Schrittmuster. Parallele Seiten haben dasselbe Muster.'), { bild: B.gitter(viereck(12, 8, e)), nachweis: [{ art: 'viereck', ecken: ['A', 'B', 'C', 'D'], parallelPaare: z }] }); },
  ]);
  sechs(L_('P1'), 'E', [
    () => { const v = wahl([[3, 1], [3, -1], [3, 2]]), s = Math.sign(v[1]);
      return zuG('Genau eine der Linien ist parallel zur Geraden g. Welche?', v, [[v, 1], [v[1] * s === 1 ? [4, s] : [4, 3 * s], 1], [v[1] * s === 1 ? [2, s] : [2, s], 1], [v[1] * s === 1 ? [5, 2 * s] : [1, s], 1]], h1('Verlass dich nicht auf den Augenschein. Vergleiche die Schrittmuster aller Linien mit dem von g.'), { bild: { b: 15, h: 12 } }); },
    () => auswahl('Für drei Geraden gilt: g ∥ h und h ⊥ k. Was folgt daraus für g und k?', [opt('g ⊥ k', true), opt('g ∥ k', false, 'senkrecht-parallel-verwechselt'), opt('g und k haben keinen gemeinsamen Punkt.', false, 'senkrecht-parallel-verwechselt'), opt('Über g und k lässt sich nichts sagen.', false)],
      h1('Zeichne eine Skizze: zuerst h, dann g parallel dazu und zuletzt k senkrecht zu h.')),
    () => { const [x, y] = wahl([[2, 3], [3, 2], [1, 2], [2, 1], [3, 1], [1, 3]]);
      return zahl(`Die Gerade g geht immer ${2 * x} Kästchen nach rechts und ${2 * y} Kästchen nach oben. Die Gerade h ist parallel zu g. Auf h geht man ${3 * x} Kästchen nach rechts. Wie viele Kästchen geht es dabei nach oben?`, 3 * y, fehlerliste(3 * y, [[2 * y, 'sach-schritt-vergessen'], [2 * y + x, 'sach-falsche-rechnung']]),
        h1('Bestimme zuerst das kleinste Schrittmuster von g.'), { einheit: 'Kästchen', nachweis: [{ art: 'schritt', u: [2 * x, 2 * y], v: [3 * x, 3 * y], lage: 'parallel' }] }); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1]]), n = senk(u);
      const x = suche(() => { const a = [zz(1, 7), zz(1, 5)], c = plus(plus(a, u, wahl([0, 1])), n, wahl([-2, -1, 1, 2])); return { a, b: plus(a, u), c, punkte: [plus(c, u, wahl([1, 2])), plus(plus(c, u), LOTRECHT), plus(a, u, 2), plus(c, n)] }; },
        (q) => drin(12, 9, q.a, q.b, q.c, ...q.punkte) && new Set([q.a, q.b, q.c, ...q.punkte].map(String)).size === 7 && [q.a, q.b, q.c, ...q.punkte].every((p) => p[0] >= 1 && p[1] >= 1));
      const namen = mische(['D', 'E', 'F', 'G']), punkte = x.punkte.map((p, i) => ({ p, n: namen[i], r: i === 0 })).sort((p, q) => p.n.localeCompare(q.n));
      return auswahl('Die Gerade h geht durch C und ist parallel zur Geraden durch A und B. Durch welchen Punkt geht h?', punkte.map((p) => opt(`Punkt ${p.n}`, p.r, p.r ? undefined : 'lage-prototyp')),
        h1('Bestimme das Schrittmuster von A nach B und setze es von C aus an.'), { bild: B.gitter(GT(12, 9, { punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'lo'), PT('C', ...x.c, 'lo'), ...punkte.map((p) => PT(p.n, ...p.p))] })), nachweis: [{ art: 'lagepunkt', von: 'A', durch: 'B', ab: 'C', lage: 'parallel' }] }); },
    () => { const n = wahl([3, 4, 5, 6]);
      return zahl(`${n} Geraden sind parallel zueinander. Zwei weitere Geraden sind ebenfalls parallel zueinander und schneiden jede der ${n} Geraden. Wie viele Schnittpunkte gibt es insgesamt?`, 2 * n, fehlerliste(2 * n, [[n, 'sach-schritt-vergessen'], [2 * n + 1, 'parallel-gleichlang'], [n + 2, 'sach-falsche-rechnung']]),
        h1('Parallele Geraden schneiden sich nicht. Zähle nur die Schnittpunkte zwischen den beiden Gruppen.'), { nachweis: N(`2 · ${n}`) }); },
    () => auswahl('Zwei verschiedene Geraden auf einem Blatt haben keinen gemeinsamen Punkt, auch wenn man sie beliebig verlängert. Was gilt?', [opt('Sie sind parallel zueinander.', true), opt('Sie sind orthogonal zueinander.', false, 'senkrecht-parallel-verwechselt'), opt('Sie sind gleich lang.', false, 'parallel-gleichlang'), opt('Das ist nicht möglich.', false, 'gerade-begrenzt')],
      h1('Überlege, was mit dem Abstand zweier Geraden geschieht, die sich nie treffen.')),
  ]);

  // =====================================================================
  // P2 Parallelen zeichnen
  // =====================================================================
  const heftDreieck = (text, [a, b, c], hilfen) => zahl(text, c, fehlerliste(c, [[a + b, 'abstand-schraeg']]), hilfen, { einheit: 'mm', toleranz: 2, nachweis: [...N(mmRechnung(a), mmRechnung(b)), { art: 'dreieck', a, b, c }] });
  const ohnePunkt = (text, v, hilfen, fehler = true) => { const a = suche(() => [zz(2, 9), zz(2, 5)], (p) => drin(12, 7, plus(p, v))), zu = [a, plus(a, v)], n = senk(v), p = suche(() => plus(a, n, wahl([-3, -2, 2, 3])), (q) => drin(12, 7, q, plus(q, v)));
    return gitterLinie(text, GT(12, 7, { linien: [LN('g', ...zu)] }), 'gerade', { art: 'parallel', zu }, [p, plus(p, v)], fehler ? [[{ art: 'senkrecht', zu }, 'senkrecht-parallel-verwechselt']] : [], hilfen); };
  const zuStrecke = (text, v, hilfen) => { const n = senk(v), x = suche(() => ({ a: [zz(1, 10), zz(1, 6)], l: zz(2, 4), t: zz(0, 2), m: wahl([-3, -2, 2, 3]) }), (q) => { const c = plus(plus(q.a, v, q.t), n, q.m); return drin(12, 8, q.a, plus(q.a, v, q.l), c) && c[0] >= 1 && c[1] >= 1 && (drin(12, 8, plus(c, v)) || drin(12, 8, plus(c, v, -1))) && plus(q.a, v, q.l).every((z) => z >= 1) && Math.abs(q.m) * Math.sqrt(skalarP(v, v)) >= 2; });
    const e = plus(x.a, v, x.l), c = plus(plus(x.a, v, x.t), n, x.m), bsp = [c, drin(12, 8, plus(c, v)) ? plus(c, v) : plus(c, v, -1)];
    return gitterLinie(text, GT(12, 8, { linien: [LN(null, x.a, e, 'strecke')], punkte: [PT('A', ...x.a, 'l'), PT('B', ...e, 'r'), PT('C', ...c, 'ro')] }), 'gerade', { art: 'parallel', zu: [x.a, e], durch: c }, bsp, [[{ art: 'senkrecht', zu: [x.a, e], durch: c }, 'senkrecht-parallel-verwechselt', [c, plus(c, n)]], [{ art: 'gerade', a: c, b: x.a }, 'lage-prototyp'], [{ art: 'gerade', a: c, b: e }, 'lage-prototyp']], hilfen); };
  sechs(L_('P2'), 'F', [
    () => paralleleDurch(Z('Zeichne eine Linie durch den Punkt P.', 'Sie soll parallel zu g sein.'), mitPunkt(WAAGERECHT),
      h3('Die neue Linie läuft in dieselbe Richtung wie g.', 'Die Linie g läuft von links nach rechts. Eine parallele Linie läuft auch von links nach rechts.', 'Tippe auf P. Tippe dann auf einen Punkt genau neben P.')),
    () => paralleleDurch(Z('Die Linie g läuft von oben nach unten.', 'Zeichne eine Linie durch den Punkt P.', 'Sie soll parallel zu g sein.'), mitPunkt(LOTRECHT),
      h3('Die neue Linie läuft in dieselbe Richtung wie g.', 'Zwei parallele Linien haben überall den gleichen Abstand.', 'Tippe auf P. Tippe dann auf einen Punkt genau über P.')),
    () => ohnePunkt(Z('Zeichne eine Linie.', 'Sie soll parallel zu g sein.'), wahl([WAAGERECHT, LOTRECHT]),
      h3('Es gibt viele richtige Linien.', 'Jede Linie mit derselben Richtung wie g ist richtig.', 'Tippe zwei Punkte an, die beide gleich weit von g entfernt sind.')),
    () => zuStrecke(Z('Zeichne eine Linie durch den Punkt C.', 'Sie soll parallel zur Strecke AB sein.'), wahl([WAAGERECHT, LOTRECHT]),
      h3('Die neue Linie läuft in dieselbe Richtung wie die Strecke AB.', 'Zwei parallele Linien kreuzen sich nie.', 'Tippe auf C. Geh dann in die Richtung, in der es von A nach B geht.')),
    () => { const k = zz(2, 3);
      return imAbstand(Z('Zeichne eine Linie parallel zu g.', `Sie soll ${k} Kästchen von g entfernt sein.`), WAAGERECHT, k,
        h3('Zähle von g aus die Kästchen nach oben oder nach unten.', 'Eine parallele Linie hat überall denselben Abstand zu g.', `Tippe zwei Punkte an. Beide liegen ${k} Kästchen über g.`)); },
    () => { const k = zz(2, 4);
      return imAbstand(Z('Die Linie g läuft von oben nach unten.', 'Zeichne eine Linie parallel zu g.', `Sie soll ${k} Kästchen von g entfernt sein.`), LOTRECHT, k,
        h3('Zähle von g aus die Kästchen nach links oder nach rechts.', 'Eine parallele Linie hat überall denselben Abstand zu g.', `Tippe zwei Punkte an. Beide liegen ${k} Kästchen neben g.`)); },
  ]);
  sechs(L_('P2'), 'G', [
    () => paralleleDurch(Z('Die Gerade g verläuft schräg.', 'Zeichne durch P die Parallele zu g.'), mitPunkt(D1),
      h3('Die Parallele hat dieselbe Richtung wie g.', 'Die Gerade g läuft von Ecke zu Ecke schräg durch die Kästchen.', 'Tippe auf P. Geh dann 1 Kästchen nach rechts und 1 nach oben.')),
    () => paralleleDurch(Z('Zeichne die Gerade h durch den Punkt P.', 'Es soll gelten: h ∥ g.'), mitPunkt(wahl([WAAGERECHT, LOTRECHT])),
      h3('Das Zeichen ∥ bedeutet: parallel zueinander.', 'Die Gerade h geht durch P und hat dieselbe Richtung wie g.', 'Tippe auf P. Geh dann in die Richtung von g ein Kästchen weiter.')),
    () => ohnePunkt(Z('Die Gerade g verläuft schräg.', 'Zeichne eine Parallele zu g.'), wahl([D1, D2]),
      h3('Es gibt viele richtige Geraden.', 'Jede Gerade mit derselben Richtung wie g ist richtig.', 'Tippe zwei gegenüberliegende Ecken eines Kästchens an, in der Richtung von g.')),
    () => zuStrecke(Z('Die Strecke AB verläuft schräg.', 'Zeichne durch C die Parallele zur Strecke AB.'), wahl([D1, D2]),
      h3('Die Parallele hat dieselbe Richtung wie die Strecke AB.', 'Die Strecke AB läuft von Ecke zu Ecke schräg durch die Kästchen.', 'Tippe auf C. Geh dann genauso schräg durch ein Kästchen wie von A nach B.')),
    () => { const c = zz(1, 2);
      return imAbstand(Z('Zeichne eine Parallele zu g.', `Ihr Abstand zu g soll ${c} cm sein.`, 'Denke daran: 2 Kästchen sind 1 cm.'), wahl([WAAGERECHT, LOTRECHT]), c * 2,
        h3('Rechne den Abstand zuerst in Kästchen um.', '3 cm sind 6 Kästchen, denn 3 · 2 = 6.', `Der Abstand ist ${c * 2} Kästchen.`), { nachweis: [{ art: 'linie' }, KAESTCHEN, ...N(`${c} · 2`)] }); },
    () => paralleleDurch(Z('Die Gerade g verläuft schräg.', 'Der Punkt P liegt neben g.', 'Zeichne durch P die Parallele zu g.'), mitPunkt(D2),
      h3('Die Parallele hat dieselbe Richtung wie g.', 'Die Gerade g läuft von Ecke zu Ecke schräg durch die Kästchen.', 'Tippe auf P. Geh dann 1 Kästchen nach rechts und 1 nach unten.')),
  ]);
  sechs(L_('P2'), 'M', [
    () => paralleleDurch('Zeichne durch den Punkt P die Parallele zur Geraden g.', mitPunkt(wahl([[2, 1], [1, 2], [2, -1]]), { b: 13, h: 10 }),
      h2('Bestimme, wie viele Kästchen g nach rechts und nach oben geht.', 'Setze dasselbe Schrittmuster im Punkt P an.'), 13, 10),
    () => { const d = wahl(DREIECKE.filter((x) => x[2] <= 130));
      return heftDreieck(`Im Heft: Zeichne eine Gerade g und mit dem Geodreieck eine Parallele h zu g im Abstand ${cmmm(d[0])}. Zeichne eine Senkrechte zu g. Sie schneidet g im Punkt A und h im Punkt B. Markiere auf h einen Punkt C, der ${cmmm(d[1])} von B entfernt ist. Miss die Strecke AC in mm.`, d,
        h2('Für die Parallele legst du eine der parallelen Hilfslinien des Geodreiecks auf g.', 'Die Strecke AB ist genau so lang wie der Abstand der beiden Geraden.')); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1]]), n = senk(u);
      const x = suche(() => { const a = [zz(1, 8), zz(1, 6)]; return { a, b: plus(a, u, 2), c: plus(plus(a, u, wahl([0, 1, 2])), n, wahl([-2, -1, 1, 2])) }; }, (q) => drin(12, 9, q.a, q.b, q.c) && q.c.every((z) => z >= 1) && (drin(12, 9, plus(q.c, u)) || drin(12, 9, plus(q.c, u, -1))));
      const bsp = [x.c, drin(12, 9, plus(x.c, u)) ? plus(x.c, u) : plus(x.c, u, -1)];
      return gitterLinie('Die Gerade durch A und B ist nicht gezeichnet. Zeichne durch den Punkt C die Parallele zu dieser Geraden.', GT(12, 9, { punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'lo'), PT('C', ...x.c, 'ro')] }), 'gerade', { art: 'parallel', zu: [x.a, x.b], durch: x.c }, bsp,
        [[{ art: 'senkrecht', zu: [x.a, x.b], durch: x.c }, 'senkrecht-parallel-verwechselt', [x.c, plus(x.c, n)]], [{ art: 'gerade', a: x.c, b: x.a }, 'lage-prototyp'], [{ art: 'gerade', a: x.c, b: x.b }, 'lage-prototyp']],
        h2('Bestimme zuerst das Schrittmuster von A nach B.', 'Gehe von C aus mit demselben Schrittmuster weiter.')); },
    () => { const k = zz(2, 4);
      return imAbstand(`Zeichne eine Parallele zu g im Abstand ${k * 5} mm. Ein Kästchen ist 5 mm breit.`, wahl([WAAGERECHT, LOTRECHT]), k,
        h2('Rechne den Abstand in Kästchen um.', `${k * 5} mm sind ${k} Kästchen, denn ${k * 5} : 5 = ${k}.`), { nachweis: [{ art: 'linie' }, ...N(`${k * 5} : 5`)] }); },
    () => { const a = wahl([25, 35, 45, 15]), b = suche(() => wahl([20, 30, 40, 55]), (x) => x !== a);
      return zahl(`Im Heft: Zeichne eine Gerade g. Zeichne oberhalb von g eine Parallele h im Abstand ${cmmm(a)} und unterhalb von g eine Parallele k im Abstand ${cmmm(b)}. Miss den Abstand der Geraden h und k in mm.`, a + b, fehlerliste(a + b, [[Math.abs(a - b), 'sub-addiert']]),
        h2('Den Abstand zweier Parallelen misst du auf einer Senkrechten.', 'Die Gerade g liegt zwischen h und k. Die beiden Abstände ergänzen sich.'), { einheit: 'mm', toleranz: 2, nachweis: N(mmRechnung(a), mmRechnung(b), `${a} + ${b}`) }); },
    () => paralleleDurch('Die Gerade g verläuft flach. Zeichne durch den Punkt P die Parallele zu g.', mitPunkt(wahl([[3, 1], [3, -1]]), { b: 14, h: 10 }),
      h2('Zähle genau: Wie viele Kästchen geht g nach rechts, bis sie wieder einen Gitterpunkt trifft?', 'Setze dasselbe Schrittmuster im Punkt P an.'), 14, 10),
  ]);
  sechs(L_('P2'), 'E', [
    () => paralleleDurch('Zeichne durch den Punkt P die Parallele zur Geraden g.', mitPunkt(wahl([[3, 2], [2, 3], [1, 3], [3, -2]]), { b: 14, h: 11 }), h1('Suche zwei Gitterpunkte auf g und bestimme daraus das Schrittmuster.'), 14, 11),
    () => { const a = wahl([60, 70, 80, 90]), x = suche(() => zz(15, a - 15), (z) => z % 5 === 0 && z % 10 !== 0 && z !== a - z);
      return zahl(`Im Heft: Zeichne zwei parallele Geraden g und h im Abstand ${cmmm(a)}. Zeichne zwischen ihnen eine dritte Parallele k, die ${cmmm(x)} von g entfernt ist. Miss den Abstand der Geraden k und h in mm.`, a - x, fehlerliste(a - x, [[a + x, 'sub-addiert']]),
        h1('Zeichne eine gemeinsame Senkrechte und miss alle Abstände auf ihr.'), { einheit: 'mm', toleranz: 2, nachweis: N(mmRechnung(a), mmRechnung(x), `${a} − ${x}`) }); },
    () => { const v = wahl([[2, 1], [1, 2], [2, -1]]), n = senk(v);
      const x = suche(() => ({ a: [zz(1, 10), zz(1, 8)], q: zz(0, 2), m: wahl([-2, -1, 1, 2]), t: zz(0, 3), k: wahl([-2, -1, 1, 2]) }), (z) => { const q = plus(z.a, v, z.q), p = plus(plus(z.a, v, z.t), n, z.k); return z.q !== z.t && drin(13, 10, z.a, plus(z.a, v, 3), p) && p.every((c) => c >= 1) && q.every((c) => c >= 1) && (drin(13, 10, plus(p, n)) || drin(13, 10, plus(p, n, -1))); });
      const q = plus(x.a, v, x.q), p = plus(plus(x.a, v, x.t), n, x.k), bsp = [p, drin(13, 10, plus(p, n)) ? plus(p, n) : plus(p, n, -1)];
      return gitterLinie('Die Gerade k ist orthogonal zu g und geht durch Q. Sie ist nicht gezeichnet. Zeichne durch P die Parallele zu k.', GT(13, 10, { linien: [LN('g', x.a, plus(x.a, v))], punkte: [PT('Q', ...q, 'lo'), PT('P', ...p, 'ro')] }), 'gerade', { art: 'senkrecht', zu: [x.a, plus(x.a, v)], durch: p }, bsp,
        [[{ art: 'parallel', zu: [x.a, plus(x.a, v)], durch: p }, 'senkrecht-parallel-verwechselt', [p, plus(p, v)]]], h1('Überlege zuerst, wie die gesuchte Gerade zu g liegt.')); },
    () => { const d = wahl(DREIECKE.filter((x) => x[2] <= 130));
      return heftDreieck(`Im Heft: Zeichne eine Strecke AB mit der Länge ${cmmm(d[0])}. Zeichne durch A die Senkrechte zu AB und markiere auf ihr den Punkt D, der ${cmmm(d[1])} von A entfernt ist. Zeichne die Parallele zu AB durch D und die Parallele zu AD durch B. Die beiden Parallelen schneiden sich im Punkt C. Miss die Strecke BD in mm.`, d,
        h1('Es entsteht ein Rechteck ABCD. Kontrolliere deine Zeichnung: AC und BD müssen gleich lang sein.')); },
    () => { const v = wahl([[2, 1], [1, 2], WAAGERECHT, [2, -1]]), n = senk(v);
      const x = suche(() => ({ a: [zz(0, 10), zz(0, 8)], c: [zz(1, 12), zz(1, 9)], d: wahl([[2, 0], [0, 2], [2, 2], [4, 2], [2, 4], [2, -2]]) }), (z) => { const e = plus(z.c, z.d), m = plus(z.c, z.d.map((q) => q / 2));
        return drin(13, 10, z.a, plus(z.a, v, 2), z.c, e) && e.every((q) => q >= 1) && kreuzP(minus(m, z.a), v) ** 2 >= 4 * skalarP(v, v) && kreuzP(z.d, v) !== 0 && (drin(13, 10, plus(m, v)) || drin(13, 10, plus(m, v, -1))); });
      const e = plus(x.c, x.d), m = plus(x.c, x.d.map((q) => q / 2)), bsp = [m, drin(13, 10, plus(m, v)) ? plus(m, v) : plus(m, v, -1)];
      return gitterLinie('Zeichne die Parallele zu g, die durch den Mittelpunkt der Strecke AB geht.', GT(13, 10, { linien: [LN('g', x.a, plus(x.a, v)), LN(null, x.c, e, 'strecke')], punkte: [PT('A', ...x.c, 'l'), PT('B', ...e, 'r')] }), 'gerade', { art: 'parallel', zu: [x.a, plus(x.a, v)], durch: m }, bsp,
        [[{ art: 'parallel', zu: [x.a, plus(x.a, v)], durch: x.c }, 'sach-schritt-vergessen'], [{ art: 'parallel', zu: [x.a, plus(x.a, v)], durch: e }, 'sach-schritt-vergessen']], h1('Suche zuerst den Gitterpunkt genau in der Mitte zwischen A und B.')); },
    () => { const u = wahl([[2, 3], [3, 2], [1, 4], [4, 1], [2, 5]]);
      return auswahl(`Die Gerade g geht immer ${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach oben. Welches Schrittmuster gehört zu einer Geraden, die parallel zu g ist?`, [
        opt(`${2 * u[0]} Kästchen nach rechts und ${2 * u[1]} Kästchen nach oben`, true), opt(`${u[1]} Kästchen nach rechts und ${u[0]} Kästchen nach oben`, false, 'lage-prototyp'),
        opt(`${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach unten`, false, 'lage-prototyp'), opt(`${u[0] + 2} Kästchen nach rechts und ${u[1] + 2} Kästchen nach oben`, false, 'sach-falsche-rechnung')],
      h1('Eine Parallele entsteht, wenn du das Schrittmuster von g mehrmals hintereinander ausführst.'), { nachweis: [{ art: 'schritt', u, v: [2 * u[0], 2 * u[1]], lage: 'parallel', zahlen: [u[0] + 2, u[1] + 2] }] }); },
  ]);
}
