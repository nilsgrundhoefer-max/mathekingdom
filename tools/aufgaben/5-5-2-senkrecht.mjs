// Aufgaben zu 5.5.2 „Zueinander senkrechte Geraden“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0032.
// S1 erkennen, ob zwei Linien senkrecht zueinander sind. S2 Senkrechte zeichnen (Gitterzeichnen; ab M auch im Heft mit Kontrollwert).
// F und G: waagerecht, lotrecht und Gitterdiagonale. Ab M schräge Linien wie „2 nach rechts, 1 nach oben“. „orthogonal“ nur auf E.
import { sechs, zahl, auswahl, opt, gitterPunkte, gitterLinie, B, N, U, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, FG, plus, minus, senk, drin, WAAGERECHT, LOTRECHT, kreuzP, skalarP, kreuzBild, cmmm, mmRechnung, DREIECKE } from './5-5-geo.mjs';

const L_ = (kurz) => `5.5.2-${kurz}`;
const D1 = [1, 1], D2 = [1, -1];
const fvSenk = (v, r) => (kreuzP(v, r) === 0 ? 'senkrecht-parallel-verwechselt' : (r[0] === 0 || r[1] === 0) && v[0] !== 0 && v[1] !== 0 ? 'senkrecht-lotrecht' : undefined);
// „Welche Linie ist senkrecht zu g?“: g mit Richtung v, dazu kurze Strecken a, b, c … quer zu g.
function zuG(text, v, richtungen, hilfen, { bild, mehrfach } = {}) {
  const k = kreuzBild(v, mische(richtungen), bild);
  const optionen = k.linien.map((l) => { const r = minus(l.b, l.a), ok = skalarP(r, v) === 0; return opt(`Linie ${l.n}`, ok, ok ? undefined : fvSenk(v, r)); });
  return auswahl(text, optionen, hilfen, { bild: B.gitter(k.g), nachweis: [{ art: 'lagezu', zu: 'g', lage: 'senkrecht' }], ...(mehrfach ? { mehrfach: true } : {}) });
}
// Zwei Geraden g und h, die sich in einem Gitterpunkt schneiden. zeichen: mit dem Zeichen für den rechten Winkel.
function zwei(u, v, { b = 10, h = 7, zeichen = false } = {}) {
  const s = suche(() => [zz(2, b - 2), zz(2, h - 2)], (p) => drin(b, h, plus(p, u, -1), plus(p, u, 1), plus(p, v, -1), plus(p, v, 1)));
  return { s, g: GT(b, h, { linien: [LN('g', plus(s, u, -1), plus(s, u, 1)), LN('h', plus(s, v, -1), plus(s, v, 1))], ...(zeichen ? { rechte: [{ p: s, u, v }] } : {}) }) };
}
const lageVon = (u, v) => (kreuzP(u, v) === 0 ? 'parallel' : skalarP(u, v) === 0 ? 'senkrecht' : 'schraeg');
// Geraden aus [Name, Punkt, Richtung]; zählt die Paare, die senkrecht zueinander sind.
function geraden(b, h, liste) {
  const linien = liste.map(([n, p, v]) => LN(n, p, plus(p, v)));
  const paare = liste.flatMap(([n1, , u], i) => liste.slice(i + 1).map(([n2, , v]) => [n1, n2, lageVon(u, v)]));
  return { g: GT(b, h, { linien }), paare, senkrechte: paare.filter((x) => x[2] === 'senkrecht').length };
}
// Viereck aus vier Ecken mit den Namen A bis D (gegen den Uhrzeigersinn).
const viereck = (b, h, ecken) => GT(b, h, { figuren: [FG(null, ecken)], punkte: ecken.map((e, i) => PT('ABCD'[i], ...e, ['lu', 'ru', 'ro', 'lo'][i])) });
const rechte = (e) => [0, 1, 2, 3].filter((i) => skalarP(minus(e[(i + 1) % 4], e[i]), minus(e[(i + 3) % 4], e[i])) === 0).length;

// Eine Gerade g mit Richtung v und ein Punkt P: auf g oder neben g. Die Senkrechte durch P hat einen zweiten Gitterpunkt im Gitter.
function mitPunkt(v, auf, { b = 12, h = 8, strecke = false } = {}) {
  const n = senk(v);
  const x = suche(() => ({ a: [zz(0, b), zz(0, h)], t: zz(1, 3), m: auf ? 0 : wahl([-3, -2, -1, 1, 2, 3]), lang: zz(3, 5) }), ({ a, t, m, lang }) => {
    const e = plus(a, v, strecke ? lang : 4), p = plus(plus(a, v, t), n, m);
    return drin(b, h, a, e) && drin(b - 1, h - 1, p) && p[0] >= 1 && p[1] >= 1 && (drin(b, h, plus(p, n)) || drin(b, h, plus(p, n, -1))) && (!strecke || t < lang);
  });
  const a = x.a, e = plus(a, v, strecke ? x.lang : 4), fuss = plus(a, v, x.t), p = plus(fuss, n, x.m);
  const bsp = [p, x.m ? fuss : drin(b, h, plus(p, n)) ? plus(p, n) : plus(p, n, -1)];
  return { a, e, p, fuss, bsp, zu: [a, plus(a, v)], v, n };
}
const bildMitG = (x, b = 12, h = 8, name = 'P') => GT(b, h, { linien: [LN('g', x.a, plus(x.a, x.v))], punkte: [PT(name, ...x.p, x.v[1] === 0 ? 'ro' : 'r')] });
// Typische Fehler beim Zeichnen: parallel statt senkrecht (wenn P neben g liegt), lotrecht oder waagerecht statt senkrecht (bei schrägem g).
function zeichenFehler(x) {
  const f = [];
  if (kreuzP(minus(x.p, x.a), x.v) !== 0) f.push([{ art: 'parallel', zu: x.zu, durch: x.p }, 'senkrecht-parallel-verwechselt', [x.p, plus(x.p, x.v)]]);
  if (x.v[0] !== 0 && x.v[1] !== 0) { f.push([{ art: 'gerade', a: x.p, b: plus(x.p, LOTRECHT) }, 'senkrecht-lotrecht']); f.push([{ art: 'gerade', a: x.p, b: plus(x.p, WAAGERECHT) }, 'senkrecht-lotrecht']); }
  return f;
}
const senkrechteDurch = (text, x, hilfen, b = 12, h = 8) => gitterLinie(text, bildMitG(x, b, h), 'gerade', { art: 'senkrecht', zu: x.zu, durch: x.p }, x.bsp, zeichenFehler(x), hilfen);

export function senkrechte() {
  // =====================================================================
  // S1 Erkennen, ob zwei Linien senkrecht zueinander sind
  // =====================================================================
  sechs(L_('S1'), 'F', [
    () => zuG(Z('Schau dir die Linien an.', 'Welche Linie ist senkrecht zu g?'), WAAGERECHT, [LOTRECHT, wahl([D1, D2])],
      h3('Senkrecht zueinander heißt: Die Linien bilden einen rechten Winkel.', 'Die Ecke eines Blattes ist ein rechter Winkel.', 'Halte in Gedanken eine Blattecke an jede Kreuzung. Wo passt sie genau?')),
    () => { const [u, v] = wahl([[WAAGERECHT, LOTRECHT], [WAAGERECHT, D1], [LOTRECHT, D2], [LOTRECHT, WAAGERECHT]]), senkrecht = skalarP(u, v) === 0, { g } = zwei(u, v);
      return auswahl(Z('Die Linien g und h kreuzen sich.', 'Was stimmt?'), [opt('Sie sind senkrecht zueinander.', senkrecht), opt('Sie sind nicht senkrecht zueinander.', !senkrecht)],
        h3('Schau auf die Ecke an der Kreuzung.', 'Ein rechter Winkel sieht aus wie die Ecke eines Kästchens.', 'Vergleiche die Kreuzung mit der Ecke eines Kästchens im Gitter.'), { bild: B.gitter(g), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: senkrecht ? 'senkrecht' : 'schraeg' }] }); },
    () => zuG(Z('Die Linie g läuft von oben nach unten.', 'Welche Linie ist senkrecht zu g?'), LOTRECHT, [WAAGERECHT, wahl([D1, D2])],
      h3('Suche die Linie mit einem rechten Winkel zu g.', 'Die Kanten eines Fensters sind senkrecht zueinander.', 'Die gesuchte Linie läuft genau von links nach rechts.')),
    () => { const v = wahl([WAAGERECHT, LOTRECHT]), q = senk(v), r = mische(wahl([[q, q, D1], [q, D1, D1], [q, q, D2], [q, D2, D2]])), k = kreuzBild(v, r), n = r.filter((x) => skalarP(x, v) === 0).length;
      return zahl(Z('Schau dir die Linien a, b und c an.', 'Wie viele davon sind senkrecht zu g?'), n, fehlerliste(n, [[r.length, 'lage-prototyp']]),
        h3('Prüfe jede Linie einzeln.', 'Eine schräge Linie bildet mit g keinen rechten Winkel.', 'Zähle nur die Linien mit einem rechten Winkel zu g.'), { bild: B.gitter(k.g), nachweis: [{ art: 'lagezahl', lage: 'senkrecht', wert: n }] }); },
    () => { const [u, v] = wahl([[WAAGERECHT, LOTRECHT], [LOTRECHT, WAAGERECHT]]), { g } = zwei(u, v, { zeichen: true });
      return auswahl(Z('An der Kreuzung siehst du ein kleines Zeichen.', 'Was bedeutet es?'), [opt('Die Linien bilden einen rechten Winkel.', true), opt('Die Linien sind gleich lang.', false, 'parallel-gleichlang'), opt('Die Linien treffen sich nie.', false, 'senkrecht-parallel-verwechselt')],
        h3('Das Zeichen ist ein kleiner Bogen mit einem Punkt.', 'So ein Bogen mit Punkt steht immer in einem rechten Winkel.', 'Die Linien g und h sind senkrecht zueinander.'), { bild: B.gitter(g), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: 'senkrecht' }] }); },
    () => { const namen = mische(['g', 'h', 'k']), y = zz(1, 2), x = zz(2, 3), d = wahl([D1, D2]), p = d === D1 ? [zz(6, 7), y + 1] : [zz(5, 6), 5];
      const b = geraden(10, 7, [[namen[0], [1, y], WAAGERECHT], [namen[1], [x, 3], LOTRECHT], [namen[2], p, d]]);
      return auswahl(Z('Du siehst drei Linien.', 'Welche zwei Linien sind senkrecht zueinander?'), [['g', 'h'], ['g', 'k'], ['h', 'k']].map(([m, n]) => opt(`${m} und ${n}`, b.paare.find((q) => [q[0], q[1]].sort().join() === [m, n].join())[2] === 'senkrecht')),
        h3('Suche die Kreuzung mit einem rechten Winkel.', 'Eine Linie von links nach rechts und eine von oben nach unten sind senkrecht zueinander.', 'Die schräge Linie gehört nicht dazu.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagewahl', lage: 'senkrecht' }] }); },
  ]);
  sechs(L_('S1'), 'G', [
    () => { const v = wahl([D1, D2]);
      return zuG(Z('Die Linie g verläuft schräg.', 'Welche Linie ist senkrecht zu g?'), v, [senk(v), LOTRECHT, WAAGERECHT],
        h3('Auch schräge Linien können senkrecht zueinander sein.', 'Senkrecht zueinander heißt nur: Die Linien bilden einen rechten Winkel.', 'Dreh das Bild in Gedanken, bis g waagerecht liegt.'), { bild: { b: 12, h: 10 } }); },
    () => { const ist = wahl(['senkrecht', 'senkrecht', 'parallel', 'schraeg']);
      const g = ist === 'parallel' ? (() => { const v = wahl([WAAGERECHT, D1, LOTRECHT]), p = [zz(2, 4), zz(2, 3)]; return GT(10, 7, { linien: [LN('g', p, plus(p, v)), LN('h', plus(p, senk(v), v === WAAGERECHT ? 2 : -2), plus(plus(p, senk(v), v === WAAGERECHT ? 2 : -2), v))] }); })()
        : zwei(...(ist === 'senkrecht' ? wahl([[D1, D2], [WAAGERECHT, LOTRECHT]]) : wahl([[WAAGERECHT, D1], [LOTRECHT, D2], [D1, LOTRECHT]]))).g;
      return auswahl(Z('Schau dir die Geraden g und h an.', 'Wie liegen sie zueinander?'), [opt('Sie sind senkrecht zueinander.', ist === 'senkrecht', ist === 'senkrecht' ? undefined : 'senkrecht-parallel-verwechselt'), opt('Sie sind parallel zueinander.', ist === 'parallel', ist === 'parallel' ? undefined : 'senkrecht-parallel-verwechselt'), opt('Weder senkrecht noch parallel.', ist === 'schraeg')],
        h3('Prüfe zuerst: Schneiden sich die Geraden?', 'Schneiden sich zwei Geraden im rechten Winkel, sind sie senkrecht zueinander.', ist === 'parallel' ? 'Die Geraden schneiden sich nicht.' : 'Die Geraden schneiden sich. Schau auf den Winkel.'), { bild: B.gitter(g), nachweis: [{ art: 'lage', linien: ['g', 'h'], lage: ist }] }); },
    () => { const namen = mische(['g', 'h', 'k']), p = [zz(3, 4), zz(3, 4)];
      const b = geraden(10, 7, [[namen[0], p, D1], [namen[1], [p[0] + 2, p[1]], D2], [namen[2], [zz(8, 9), 2], LOTRECHT]]);
      return auswahl(Z('Das Zeichen ⊥ bedeutet: senkrecht zueinander.', 'Was stimmt?'), [['g', 'h'], ['g', 'k'], ['h', 'k']].map(([m, n]) => { const l = b.paare.find((q) => [q[0], q[1]].sort().join() === [m, n].join())[2]; return opt(`${m} ⊥ ${n}`, l === 'senkrecht', l === 'senkrecht' ? undefined : 'senkrecht-lotrecht'); }),
        h3('Suche die beiden Geraden mit einem rechten Winkel.', 'g ⊥ h liest du so: g ist senkrecht zu h.', 'Die beiden schrägen Geraden bilden einen rechten Winkel.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagewahl', lage: 'senkrecht' }] }); },
    () => { const v = wahl([WAAGERECHT, LOTRECHT]), q = senk(v), schraeg = wahl([[D1, [1, 2]], [D2, [1, -2]], [D1, D1]]), r = mische(wahl([[q, q, ...schraeg], [q, q, q, schraeg[0]], [q, ...schraeg, schraeg[0]]])), k = kreuzBild(v, r, v === WAAGERECHT ? { b: 14, h: 8 } : { b: 9, h: 14 }), n = r.filter((x) => skalarP(x, v) === 0).length;
      return zahl(Z('Schau dir die Linien a, b, c und d an.', 'Wie viele davon sind senkrecht zu g?'), n, fehlerliste(n, [[r.length, 'lage-prototyp']]),
        h3('Prüfe jede Linie einzeln mit einer Blattecke.', 'Nur ein rechter Winkel zählt. Fast senkrecht reicht nicht.', 'Vergleiche jeden Winkel mit der Ecke eines Kästchens.'), { bild: B.gitter(k.g), nachweis: [{ art: 'lagezahl', lage: 'senkrecht', wert: n }] }); },
    () => { const k = kind(), { g } = zwei(D1, D2, { zeichen: true });
      return auswahl(Z(`${k} sagt: „Senkrecht heißt immer von oben nach unten.“`, 'Schau dir die Geraden g und h an.', 'Stimmt das?'), [opt('Stimmt.', false, 'senkrecht-lotrecht'), opt('Falsch. Auch schräge Geraden können senkrecht zueinander sein.', true), opt('Falsch. Senkrecht heißt immer von links nach rechts.', false, 'senkrecht-lotrecht')],
        h3('Schau auf das Zeichen an der Kreuzung.', 'Senkrecht zueinander heißt: Zwei Linien bilden einen rechten Winkel.', 'Die Geraden g und h sind schräg. Trotzdem bilden sie einen rechten Winkel.'), { bild: B.gitter(g), nachweis: [U(false), { art: 'lage', linien: ['g', 'h'], lage: 'senkrecht' }] }); },
    () => { const w = zz(4, 6), hh = zz(2, 4), a = [zz(1, 3), 1], art = wahl(['rechteck', 'trapez', 'trapez', 'parallelogramm']);
      const e = art === 'rechteck' ? [a, plus(a, [w, 0]), plus(a, [w, hh]), plus(a, [0, hh])] : art === 'trapez' ? [a, plus(a, [w, 0]), plus(a, [w - 2, hh]), plus(a, [0, hh])] : [a, plus(a, [w, 0]), plus(a, [w + 2, hh]), plus(a, [2, hh])], n = rechte(e);
      return zahl(Z('Schau dir das Viereck ABCD an.', 'Wie viele rechte Winkel hat es?'), n, fehlerliste(n, [[4, 'lage-prototyp'], [2, 'lage-prototyp']]),
        h3('Prüfe jede Ecke einzeln.', 'In einem rechten Winkel sind die beiden Seiten senkrecht zueinander.', 'Schau bei jeder Ecke: Folgen beide Seiten den Linien des Gitters?'), { bild: B.gitter(viereck(11, 6, e)), nachweis: [{ art: 'viereck', ecken: ['A', 'B', 'C', 'D'], rechteWinkel: n }] }); },
  ]);
  sechs(L_('S1'), 'M', [
    () => { const v = wahl([[2, 1], [1, 2], [2, -1]]);
      return zuG('Welche Linie ist senkrecht zur Geraden g?', v, [senk(v), v[0] === 2 ? LOTRECHT : WAAGERECHT, v[1] > 0 ? D2 : D1],
        h2('Lege in Gedanken das Geodreieck mit der Mittellinie auf g.', 'Zähle die Kästchen: Geht g 2 nach rechts und 1 nach oben, dann geht die Senkrechte 1 nach links und 2 nach oben.'), { bild: { b: 13, h: 10 } }); },
    () => { const v = wahl([D1, D2]);
      return zuG('Welche Linien sind senkrecht zur Geraden g? Kreuze alle an.', v, [senk(v), senk(v), LOTRECHT, WAAGERECHT],
        h2('Auch schräge Linien können einen rechten Winkel bilden.', 'Die Gerade g läuft entlang der Diagonalen der Kästchen. Eine Senkrechte dazu läuft entlang der anderen Diagonalen.'), { bild: { b: 13, h: 12 }, mehrfach: true }); },
    () => { const b = geraden(12, 8, wahl([
      [['g', [1, 2], WAAGERECHT], ['h', [3, 4], LOTRECHT], ['k', [9, 4], LOTRECHT], ['m', [5, 4], D1]],
      [['g', [1, 2], WAAGERECHT], ['h', [1, 6], WAAGERECHT], ['k', [3, 4], LOTRECHT], ['m', [9, 4], LOTRECHT]],
      [['g', [2, 1], D1], ['h', [2, 5], D2], ['k', [8, 5], D2], ['m', [5, 7], WAAGERECHT]],
      [['g', [1, 1], [2, 1]], ['h', [6, 2], [-1, 2]], ['k', [10, 4], LOTRECHT], ['m', [3, 6], WAAGERECHT]],
      [['g', [1, 1], D1], ['h', [5, 1], D2], ['k', [10, 3], LOTRECHT], ['m', [2, 6], D2]]]));
      return zahl('Im Bild siehst du die Geraden g, h, k und m. Wie viele Paare von Geraden sind senkrecht zueinander?', b.senkrechte, fehlerliste(b.senkrechte, [[b.senkrechte + 1, 'senkrecht-lotrecht'], [b.senkrechte - 1, 'senkrecht-lotrecht']]),
        h2('Gehe alle Paare der Reihe nach durch: g mit h, g mit k, g mit m, h mit k, h mit m, k mit m.', 'Verlängere die Geraden in Gedanken bis zu ihrem Schnittpunkt und prüfe dort den Winkel.'), { bild: B.gitter(b.g), nachweis: [{ art: 'lagezahl', lage: 'senkrecht', wert: b.senkrechte }] }); },
    () => { const u = wahl([[3, 1], [2, 1], [3, 2], [4, 1]]), a = suche(() => [zz(0, 3), zz(1, 3)], (p) => drin(12, 8, plus(p, u, 2)));
      return zahl(`Die Gerade g geht immer ${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach oben. Die Gerade h ist senkrecht zu g. Wie viele Kästchen geht h nach oben, wenn sie ${u[1]} Kästchen nach links geht?`, u[0], fehlerliste(u[0], [[u[1], 'senkrecht-parallel-verwechselt']]),
        h2('Bei der Senkrechten tauschen die beiden Schrittzahlen ihre Rollen.', `Die Schritte nach rechts von g werden zu Schritten nach oben von h.`), { einheit: 'Kästchen', bild: B.gitter(GT(12, 8, { linien: [LN('g', a, plus(a, u))] })), nachweis: [{ art: 'schritt', u, v: [-u[1], u[0]], lage: 'senkrecht' }] }); },
    () => { const k = kind(), u = wahl([[2, 1], [1, 2]]), { g } = zwei(u, senk(u), { b: 10, h: 8 });
      return auswahl(`${k} sagt: „Die Geraden g und h sind nicht senkrecht zueinander, denn keine von beiden verläuft genau waagerecht.“ Stimmt das?`, [opt('Stimmt.', false, 'senkrecht-lotrecht'), opt('Falsch. Die Geraden bilden einen rechten Winkel. Auf ihre Lage im Heft kommt es nicht an.', true), opt('Falsch. Die Geraden sind parallel zueinander.', false, 'senkrecht-parallel-verwechselt')],
        h2('Senkrecht zueinander beschreibt die Lage zweier Geraden zueinander, nicht ihre Lage auf dem Blatt.', 'Zähle die Kästchenschritte beider Geraden und vergleiche sie.'), { bild: B.gitter(g), nachweis: [U(false), { art: 'lage', linien: ['g', 'h'], lage: 'senkrecht' }] }); },
    () => { const u = wahl([[2, 1], [1, 2], [2, -1]]), n = senk(u), art = wahl(['rechteck', 'trapez', 'trapez', 'parallelogramm']);
      const form = (a) => (art === 'rechteck' ? [a, plus(a, u, 2), plus(plus(a, u, 2), n), plus(a, n)] : art === 'trapez' ? [a, plus(a, u, 3), plus(plus(a, u), n), plus(a, n)] : [a, plus(a, u, 2), plus(plus(a, u, 3), n), plus(plus(a, u), n)]);
      const e = form(suche(() => [zz(1, 9), zz(1, 7)], (p) => drin(11, 8, ...form(p)) && form(p).every((q) => q[0] >= 1 && q[1] >= 1))), z = rechte(e);
      return zahl('Wie viele rechte Winkel hat das Viereck ABCD?', z, fehlerliste(z, [[0, 'senkrecht-lotrecht'], [4, 'lage-prototyp']]),
        h2('Das Viereck liegt schräg. Trotzdem können seine Seiten senkrecht zueinander sein.', 'Zähle bei jeder Ecke die Kästchenschritte beider Seiten: Tauschen die Schrittzahlen ihre Rollen, ist der Winkel ein rechter.'), { bild: B.gitter(viereck(11, 8, e)), nachweis: [{ art: 'viereck', ecken: ['A', 'B', 'C', 'D'], rechteWinkel: z }] }); },
  ]);
  sechs(L_('S1'), 'E', [
    () => { const v = wahl([[3, 1], [3, -1]]);
      return zuG('Genau eine der Linien ist senkrecht zur Geraden g. Welche?', v, [senk(v), v[1] > 0 ? [-1, 2] : [1, 2], LOTRECHT, v[1] > 0 ? D2 : D1], h1('Verlass dich nicht auf den Augenschein. Zähle bei jeder Linie die Kästchenschritte und vergleiche sie mit denen von g.'), { bild: { b: 13, h: 11, weit: 1 } }); },
    () => auswahl('Zwei Geraden g und h heißen orthogonal. Was bedeutet das?', [opt('Sie bilden einen rechten Winkel.', true), opt('Sie haben überall den gleichen Abstand.', false, 'senkrecht-parallel-verwechselt'), opt('Eine verläuft waagerecht, die andere von oben nach unten.', false, 'senkrecht-lotrecht'), opt('Sie schneiden sich in einem beliebigen Winkel.', false)],
      h1('Orthogonal ist ein Fachwort. Du findest es im Wortspeicher.')),
    () => { const u = wahl([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3]]), f = wahl([2, 3]);
      return zahl(`Die Gerade g geht immer ${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach oben. Die Gerade h ist orthogonal zu g. Auf h geht man ${f * u[1]} Kästchen nach links. Wie viele Kästchen geht es dabei nach oben?`, f * u[0], fehlerliste(f * u[0], [[u[0], 'sach-schritt-vergessen'], [f * u[1], 'senkrecht-parallel-verwechselt']]),
        h1('Bestimme zuerst das kleinste Schrittmuster von h und vervielfache es dann.'), { einheit: 'Kästchen', nachweis: [{ art: 'schritt', u, v: [-f * u[1], f * u[0]], lage: 'senkrecht', schritte: [f * u[1], f * u[0]] }] }); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1], [2, -1], [1, 1]]), n = senk(u), recht = wahl([true, true, true, false]), namen = mische(['A', 'B', 'C']);
      const form = (p) => [p, plus(p, u, 2), recht ? plus(p, n, wahl([1, 2])) : plus(plus(p, n), [1, 0])];
      const e = suche(() => form([zz(1, 10), zz(1, 7)]), (q) => drin(11, 8, ...q) && q.every((x) => x[0] >= 1 && x[1] >= 1) && kreuzP(minus(q[1], q[0]), minus(q[2], q[0])) !== 0 && (recht || ![0, 1, 2].some((i) => skalarP(minus(q[(i + 1) % 3], q[i]), minus(q[(i + 2) % 3], q[i])) === 0)));
      const g = GT(11, 8, { figuren: [FG(null, e, 'leer')], punkte: e.map((p, i) => PT(namen[i], ...p)).sort((x, y) => x.n.localeCompare(y.n)) });
      return auswahl('Bei welcher Ecke hat das Dreieck ABC einen rechten Winkel?', [...['A', 'B', 'C'].map((x) => opt(`Bei ${x}.`, recht && x === namen[0], recht && x === namen[0] ? undefined : 'senkrecht-lotrecht')), opt('Bei keiner Ecke.', !recht)],
        h1('Zähle an jeder Ecke die Kästchenschritte der beiden Seiten und prüfe, ob sie ihre Rollen tauschen.'), { bild: B.gitter(g), nachweis: [{ art: 'rechterWinkel', ecken: ['A', 'B', 'C'] }] }); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1]]), n = senk(u);
      const x = suche(() => { const a = [zz(1, 6), zz(1, 4)], b = plus(a, u), k = wahl([1, 2, -1]); return { a, b, punkte: [plus(b, n, k), plus(b, LOTRECHT, wahl([2, 3])), plus(plus(b, n, k), [1, 0]), plus(a, n, k)] }; },
        (q) => drin(12, 9, q.a, q.b, ...q.punkte) && new Set([q.a, q.b, ...q.punkte].map(String)).size === 6 && q.punkte.slice(1).every((p) => skalarP(minus(p, q.b), u) !== 0) && [q.a, q.b, ...q.punkte].every((p) => p[0] >= 1 && p[1] >= 1));
      const namen = mische(['C', 'D', 'E', 'F']), punkte = x.punkte.map((p, i) => ({ p, n: namen[i], r: i === 0 })).sort((p, q) => p.n.localeCompare(q.n));
      return auswahl('Die Gerade h geht durch B und ist orthogonal zur Geraden durch A und B. Durch welchen Punkt geht h?', punkte.map((p) => opt(`Punkt ${p.n}`, p.r, p.r ? undefined : 'senkrecht-lotrecht')),
        h1('Bestimme das Schrittmuster von A nach B. Die Gerade h hat das gedrehte Muster und beginnt in B.'), { bild: B.gitter(GT(12, 9, { punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'lo'), ...punkte.map((p) => PT(p.n, ...p.p))] })), nachweis: [{ art: 'lagepunkt', von: 'A', durch: 'B', lage: 'senkrecht' }] }); },
    () => auswahl('Gegeben sind eine Gerade g und ein Punkt P. Wie viele Geraden durch P sind orthogonal zu g?', [opt('Immer genau eine.', true), opt('Keine oder eine, je nach Lage von P.', false), opt('Immer genau zwei.', false), opt('Beliebig viele.', false, 'senkrecht-parallel-verwechselt')],
      h1('Probiere es aus: einmal mit einem Punkt auf g und einmal mit einem Punkt neben g.')),
  ]);

  // =====================================================================
  // S2 Senkrechte zeichnen
  // =====================================================================
  // Typischer Fehler bei schrägem g: der Punkt von g genau über oder unter P statt des Fußpunkts.
  const fuss = (text, v, hilfen, b = 12, h = 8) => { const x = mitPunkt(v, false, { b, h }), t = (x.p[0] - x.a[0]) / v[0], unter = Number.isInteger(t) ? plus(x.a, v, t) : null;
    return gitterPunkte(text, bildMitG(x, b, h), [x.fuss], unter && drin(b, h, unter) ? [[[unter], 'senkrecht-lotrecht']] : [], hilfen, { nachweis: [{ art: 'lotfuss', punkt: 'P', linie: 'g' }] }); };
  const heft = (text, [a, b, c], hilfen, vorweg = []) => zahl(text, c, fehlerliste(c, [[a + b, 'abstand-schraeg']]), hilfen, { einheit: 'mm', toleranz: 2, nachweis: [...N(...vorweg, mmRechnung(a), mmRechnung(b)), { art: 'dreieck', a, b, c }] });
  sechs(L_('S2'), 'F', [
    () => senkrechteDurch(Z('Zeichne eine Linie durch den Punkt P.', 'Sie soll senkrecht zu g sein.'), mitPunkt(WAAGERECHT, true),
      h3('Die neue Linie bildet mit g einen rechten Winkel.', 'Die Linie g läuft von links nach rechts. Eine Linie senkrecht dazu läuft von oben nach unten.', 'Tippe auf P. Tippe dann auf einen Punkt genau über P.')),
    () => senkrechteDurch(Z('Die Linie g läuft von oben nach unten.', 'Zeichne eine Linie durch den Punkt P.', 'Sie soll senkrecht zu g sein.'), mitPunkt(LOTRECHT, false),
      h3('Die neue Linie bildet mit g einen rechten Winkel.', 'Zu einer Linie von oben nach unten ist eine Linie von links nach rechts senkrecht.', 'Tippe auf P. Tippe dann auf einen Punkt genau neben P.')),
    () => senkrechteDurch(Z('Der Punkt P liegt nicht auf g.', 'Zeichne eine Linie durch P.', 'Sie soll senkrecht zu g sein.'), mitPunkt(WAAGERECHT, false),
      h3('Die neue Linie geht durch P und kreuzt g im rechten Winkel.', 'Stell dir ein Geodreieck vor. Seine Mittellinie liegt auf g.', 'Tippe auf P. Tippe dann auf den Punkt von g genau unter oder über P.')),
    () => { const v = wahl([WAAGERECHT, LOTRECHT]), a = v === WAAGERECHT ? [1, zz(2, 5)] : [zz(3, 9), 1], g = GT(12, 7, { linien: [LN('g', a, plus(a, v))] }), p = v === WAAGERECHT ? [zz(3, 9), 1] : [1, zz(2, 5)];
      return gitterLinie(Z('Zeichne eine Linie.', 'Sie soll senkrecht zu g sein.'), g, 'gerade', { art: 'senkrecht', zu: [a, plus(a, v)] }, [p, plus(p, senk(v), v === WAAGERECHT ? 1 : -1)], [],
        h3('Es gibt viele richtige Linien.', 'Jede Linie mit einem rechten Winkel zu g ist richtig.', v === WAAGERECHT ? 'Tippe zwei Punkte an, die genau übereinander liegen.' : 'Tippe zwei Punkte an, die genau nebeneinander liegen.')); },
    () => { const x = mitPunkt(wahl([WAAGERECHT, LOTRECHT]), true, { strecke: true }), bb = x.e;
      const g = GT(12, 8, { linien: [LN(null, x.a, x.e, 'strecke')], punkte: [PT('A', ...x.a, x.v[1] ? 'l' : 'lo'), PT('B', ...x.e, x.v[1] ? 'l' : 'ro')] }), bsp = [bb, drin(12, 8, plus(bb, x.n)) ? plus(bb, x.n) : plus(bb, x.n, -1)];
      return gitterLinie(Z('Zeichne eine Linie durch den Punkt B.', 'Sie soll senkrecht zur Strecke AB sein.'), g, 'gerade', { art: 'senkrecht', zu: [x.a, x.e], durch: bb }, bsp, [[{ art: 'senkrecht', zu: [x.a, x.e], durch: x.a }, 'lage-prototyp', [x.a, plus(x.a, minus(bsp[1], bb))]]],
        h3('Die neue Linie beginnt am Ende der Strecke.', 'An der Ecke eines Blattes sind zwei Kanten senkrecht zueinander.', 'Tippe auf B. Tippe dann auf einen Punkt, zu dem es im rechten Winkel weitergeht.')); },
    () => fuss(Z('Eine Linie geht durch P.', 'Sie ist senkrecht zu g.', 'Markiere den Punkt, an dem sie g trifft.'), wahl([WAAGERECHT, LOTRECHT]),
      h3('Geh von P aus im rechten Winkel auf g zu.', 'Die gesuchte Linie läuft entlang der Kästchenlinien.', 'Folge von P aus der Kästchenlinie bis zu g.')),
  ]);
  sechs(L_('S2'), 'G', [
    () => { const v = wahl([D1, D2]);
      return senkrechteDurch(Z('Die Gerade g verläuft schräg.', 'Der Punkt P liegt auf g.', 'Zeichne durch P die Senkrechte zu g.'), mitPunkt(v, true),
        h3('Die Gerade g läuft von Ecke zu Ecke schräg durch die Kästchen.', 'Die Senkrechte läuft in der anderen Richtung schräg durch die Kästchen.', v === D1 ? 'Tippe auf P. Geh dann 1 Kästchen nach rechts und 1 nach unten.' : 'Tippe auf P. Geh dann 1 Kästchen nach rechts und 1 nach oben.')); },
    () => { const v = wahl([WAAGERECHT, LOTRECHT]);
      return senkrechteDurch(Z('Zeichne die Gerade h durch den Punkt P.', 'Es soll gelten: h ⊥ g.'), mitPunkt(v, false),
        h3('Das Zeichen ⊥ bedeutet: senkrecht zueinander.', 'Die Gerade h geht durch P und kreuzt g im rechten Winkel.', 'Tippe auf P und auf den Punkt von g, der P am nächsten liegt.')); },
    () => { const v = wahl([D1, D2]);
      return senkrechteDurch(Z('Der Punkt P liegt nicht auf g.', 'Zeichne durch P die Senkrechte zu g.'), mitPunkt(v, false),
        h3('Die Senkrechte geht durch P und kreuzt g im rechten Winkel.', 'Läuft g schräg von Ecke zu Ecke, dann läuft die Senkrechte schräg in der anderen Richtung.', 'Geh von P aus schräg von Ecke zu Ecke auf g zu.')); },
    () => { const v = wahl([D1, D2]), x = mitPunkt(v, true, { strecke: true }), g = GT(12, 8, { linien: [LN(null, x.a, x.e, 'strecke')], punkte: [PT('A', ...x.a, 'l'), PT('B', ...x.e, 'r')] }), bsp = [x.a, drin(12, 8, plus(x.a, x.n)) ? plus(x.a, x.n) : plus(x.a, x.n, -1)];
      return gitterLinie(Z('Zeichne durch den Punkt A die Senkrechte zur Strecke AB.'), g, 'gerade', { art: 'senkrecht', zu: [x.a, x.e], durch: x.a }, bsp, [[{ art: 'gerade', a: x.a, b: plus(x.a, LOTRECHT) }, 'senkrecht-lotrecht'], [{ art: 'gerade', a: x.a, b: plus(x.a, WAAGERECHT) }, 'senkrecht-lotrecht']],
        h3('Die Strecke AB verläuft schräg. Die Senkrechte verläuft auch schräg.', 'Läuft g schräg von Ecke zu Ecke, dann läuft die Senkrechte schräg in der anderen Richtung.', 'Tippe auf A. Geh dann schräg durch ein Kästchen, aber quer zur Strecke.')); },
    () => fuss(Z('Die Senkrechte zu g geht durch P.', 'Markiere den Punkt, an dem sie g trifft.'), wahl([D1, D2]),
      h3('Geh von P aus im rechten Winkel auf g zu.', 'Läuft g schräg von Ecke zu Ecke, dann läuft die Senkrechte schräg in der anderen Richtung.', 'Geh von P aus schräg von Ecke zu Ecke, bis du g triffst.')),
    () => { const v = wahl([D1, D2]), a = suche(() => [zz(2, 8), zz(2, 5)], (p) => drin(12, 7, plus(p, v))), g = GT(12, 7, { linien: [LN('g', a, plus(a, v))] }), p = suche(() => [zz(1, 10), zz(1, 6)], (q) => drin(12, 7, plus(q, senk(v))));
      return gitterLinie(Z('Die Gerade g verläuft schräg.', 'Zeichne eine Senkrechte zu g.'), g, 'gerade', { art: 'senkrecht', zu: [a, plus(a, v)] }, [p, plus(p, senk(v))], [[{ art: 'gerade', a: p, b: plus(p, LOTRECHT) }, 'senkrecht-lotrecht'], [{ art: 'parallel', zu: [a, plus(a, v)] }, 'senkrecht-parallel-verwechselt']],
        h3('Es gibt viele richtige Geraden.', 'Jede Gerade mit einem rechten Winkel zu g ist richtig.', 'Tippe zwei gegenüberliegende Ecken eines Kästchens an, quer zu g.')); },
  ]);
  sechs(L_('S2'), 'M', [
    () => { const v = wahl([[2, 1], [1, 2], [2, -1]]);
      return senkrechteDurch('Der Punkt P liegt auf der Geraden g. Zeichne durch P die Senkrechte zu g.', mitPunkt(v, true, { b: 13, h: 10 }),
        h2('Bestimme, wie viele Kästchen g nach rechts und nach oben geht.', 'Bei der Senkrechten tauschen die beiden Schrittzahlen ihre Rollen, und eine Richtung kehrt sich um.'), 13, 10); },
    () => { const v = wahl([[2, 1], [1, 2], [1, -2]]);
      return senkrechteDurch('Zeichne das Lot vom Punkt P auf die Gerade g.', mitPunkt(v, false, { b: 13, h: 10 }),
        h2('Das Lot ist die Senkrechte zu g, die durch P geht.', 'Bestimme das Schrittmuster von g und drehe es: Aus „2 nach rechts, 1 nach oben“ wird „1 nach links, 2 nach oben“.'), 13, 10); },
    () => { const d = wahl(DREIECKE.filter((x) => x[2] <= 130));
      return heft(`Im Heft: Zeichne eine Strecke AB mit der Länge ${cmmm(d[0])}. Zeichne mit dem Geodreieck durch B die Senkrechte zu AB. Markiere auf ihr einen Punkt C, der ${cmmm(d[1])} von B entfernt ist. Miss die Strecke AC in mm.`, d,
        h2('Lege die Mittellinie des Geodreiecks auf die Strecke AB, sodass die lange Kante durch B geht.', 'Die Strecke AC ist der direkte Weg von A nach C. Miss sie mit dem Lineal.')); },
    () => fuss('Markiere den Fußpunkt des Lots vom Punkt P auf die Gerade g.', wahl([[2, 1], [1, 2], [2, -1]]),
      h2('Der Fußpunkt ist der Punkt, in dem die Senkrechte durch P die Gerade g trifft.', 'Drehe das Schrittmuster von g und gehe damit von P aus auf g zu.'), 13, 10),
    () => { const d = wahl(DREIECKE.filter((x) => x[2] <= 130 && x[0] > x[1]));
      return heft(`Im Heft: Zeichne eine Strecke AB mit der Länge ${cmmm(d[0])}. Zeichne durch A und durch B je eine Senkrechte zu AB. Markiere auf beiden Senkrechten oberhalb von AB je einen Punkt, der ${cmmm(d[1])} von AB entfernt ist: D über A und C über B. Miss die Strecke AC in mm.`, d,
        h2('Es entsteht ein Rechteck ABCD. Die Strecke AC verbindet zwei gegenüberliegende Ecken.', 'Prüfe deine Zeichnung: Die Strecke CD muss so lang sein wie AB.')); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1]]), n = senk(u);
      const x = suche(() => { const a = [zz(1, 8), zz(1, 6)], k = wahl([-2, -1, 1, 2]); return { a, b: plus(a, u, 2), c: plus(plus(a, u, wahl([0, 1, 2])), n, k) }; }, (q) => drin(12, 9, q.a, q.b, q.c) && q.c.every((z) => z >= 1) && (drin(12, 9, plus(q.c, n)) || drin(12, 9, plus(q.c, n, -1))));
      const bsp = [x.c, drin(12, 9, plus(x.c, n)) ? plus(x.c, n) : plus(x.c, n, -1)];
      return gitterLinie('Die Gerade durch A und B ist nicht gezeichnet. Zeichne durch den Punkt C die Senkrechte zu dieser Geraden.', GT(12, 9, { punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'lo'), PT('C', ...x.c, 'ro')] }), 'gerade', { art: 'senkrecht', zu: [x.a, x.b], durch: x.c }, bsp,
        [[{ art: 'parallel', zu: [x.a, x.b], durch: x.c }, 'senkrecht-parallel-verwechselt', [x.c, plus(x.c, u)]], [{ art: 'gerade', a: x.c, b: plus(x.c, LOTRECHT) }, 'senkrecht-lotrecht']],
        h2('Bestimme zuerst das Schrittmuster von A nach B.', 'Drehe das Schrittmuster und gehe damit von C aus weiter.')); },
  ]);
  sechs(L_('S2'), 'E', [
    () => { const v = wahl([[3, 1], [1, 3], [3, -1], [3, 2]]);
      return senkrechteDurch('Zeichne die Gerade durch P, die orthogonal zu g ist.', mitPunkt(v, false, { b: 14, h: 11 }), h1('Bestimme das Schrittmuster von g und drehe es um einen rechten Winkel.'), 14, 11); },
    () => { const d = wahl(DREIECKE.filter((x) => x[0] <= 60 && x[2] <= 130));
      return heft(`Im Heft: Zeichne eine Strecke AB mit der Länge ${cmmm(2 * d[0])} und markiere ihren Mittelpunkt M. Zeichne durch M die Senkrechte zu AB. Markiere auf ihr einen Punkt C, der ${cmmm(d[1])} von M entfernt ist. Miss die Strecke AC in mm.`, d,
        h1('Die Strecke AM ist halb so lang wie AB. Zeichne die Senkrechte mit der Mittellinie des Geodreiecks.'), [mmRechnung(2 * d[0]), `${2 * d[0]} : 2`]); },
    () => { const u = wahl([[2, 1], [1, 2], [1, 1], [2, -1]]), n = senk(u), x = suche(() => { const a = [zz(1, 9), zz(1, 7)]; return { a, b: plus(a, u, 2), m: plus(a, u) }; }, (q) => drin(12, 9, q.a, q.b) && q.b.every((z) => z >= 1) && drin(12, 9, plus(q.m, n)) && drin(12, 9, plus(q.m, n, -1)));
      return gitterLinie('Zeichne die Gerade, die orthogonal zur Strecke AB ist und durch den Mittelpunkt von AB geht.', GT(12, 9, { linien: [LN(null, x.a, x.b, 'strecke')], punkte: [PT('A', ...x.a, 'l'), PT('B', ...x.b, 'r')] }), 'gerade', { art: 'senkrecht', zu: [x.a, x.b], durch: x.m }, [x.m, plus(x.m, n)],
        [[{ art: 'senkrecht', zu: [x.a, x.b], durch: x.a }, 'sach-schritt-vergessen', [x.a, plus(x.a, n)]], [{ art: 'senkrecht', zu: [x.a, x.b], durch: x.b }, 'sach-schritt-vergessen', [x.b, plus(x.b, n)]]],
        h1('Suche zuerst den Gitterpunkt genau in der Mitte zwischen A und B.')); },
    () => { const d = wahl(DREIECKE.filter((x) => x[2] <= 130));
      return heft(`Im Heft: Zeichne eine Gerade g und einen Punkt P, der ${cmmm(d[0])} von g entfernt ist. Zeichne das Lot von P auf g und nenne den Fußpunkt F. Markiere auf g einen Punkt Q, der ${cmmm(d[1])} von F entfernt ist. Miss die Strecke PQ in mm.`, d,
        h1('Zeichne zuerst eine Senkrechte zu g, markiere auf ihr den Punkt P im richtigen Abstand und arbeite dann von F aus weiter.')); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1], [1, 3]]), n = senk(u);
      const x = suche(() => { const a = [zz(1, 10), zz(1, 8)], t = wahl([1, 2]), k = wahl([-2, -1, 1, 2]); return { a, b: plus(a, u, 3), f: plus(a, u, t), p: plus(plus(a, u, t), n, k) }; }, (q) => drin(13, 10, q.a, q.b, q.p) && [q.a, q.b, q.p].every((z) => z[0] >= 1 && z[1] >= 1));
      return gitterPunkte('Die Gerade durch A und B ist nicht gezeichnet. Markiere den Fußpunkt des Lots von P auf diese Gerade.', GT(13, 10, { punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'lo'), PT('P', ...x.p, 'ro')] }), [x.f], [],
        h1('Setze das Schrittmuster von A nach B fort und suche den Punkt, von dem aus es mit dem gedrehten Muster zu P geht.'), { nachweis: [{ art: 'lotfuss', punkt: 'P', punkte: ['A', 'B'] }] }); },
    () => { const u = wahl([[2, 3], [3, 2], [1, 4], [4, 1], [2, 5]]);
      return auswahl(`Die Gerade g geht immer ${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach oben. Welches Schrittmuster gehört zu einer Geraden, die orthogonal zu g ist?`, [
        opt(`${u[1]} Kästchen nach rechts und ${u[0]} Kästchen nach unten`, true), opt(`${u[0]} Kästchen nach rechts und ${u[1]} Kästchen nach unten`, false, 'senkrecht-lotrecht'),
        opt(`${u[1]} Kästchen nach rechts und ${u[0]} Kästchen nach oben`, false, 'senkrecht-lotrecht'), opt(`${u[0]} Kästchen nach links und ${u[1]} Kästchen nach unten`, false, 'senkrecht-parallel-verwechselt')],
      h1('Zeichne das Schrittmuster von g als kleines Treppendreieck und drehe das Dreieck um einen rechten Winkel.'), { nachweis: [{ art: 'schritt', u, v: [u[1], -u[0]], lage: 'senkrecht' }] }); },
  ]);
}
