// Aufgaben zu 5.5.5 „Entfernung und Abstand“ (Lernziel D1) nach ADR 0015 und ADR 0032.
// Entfernung zweier Punkte, Abstand eines Punktes von einer Geraden, Abstand zweier Parallelen.
// Gemessen wird in Kästchen (F), in cm (ab G, 2 Kästchen sind 1 cm) und in mm (ab M, 1 Kästchen ist 5 mm). Schräge Längen kommen nur vor, wenn sie ganzzahlig sind.
import { sechs, zahl, auswahl, opt, luecken, gitterPunkte, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, plus, minus, senk, drin, WAAGERECHT, LOTRECHT } from './5-5-geo.mjs';

const L_ = (kurz) => `5.5.5-${kurz}`;
const KAESTCHEN = HILFSZAHL(1, '2 Kästchen sind 1 cm');
// Zwei Punkte nebeneinander oder übereinander, n Kästchen voneinander entfernt.
function zweiPunkte(n, namen = 'AB', b = 12, h = 7, strecke = false) {
  const v = n <= h - 2 ? wahl([WAAGERECHT, LOTRECHT]) : WAAGERECHT, a = suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => drin(b - 1, h - 1, plus(p, v, n)));
  const e = plus(a, v, n);
  return { a, e, v, g: GT(b, h, { punkte: [PT(namen[0], ...a, v[0] ? 'lo' : 'l'), PT(namen[1], ...e, v[0] ? 'ro' : 'l')], ...(strecke ? { linien: [LN(null, a, e, 'strecke')] } : {}) }) };
}
// Eine Gerade g (waagerecht oder von oben nach unten) und ein Punkt P im Abstand d.
function punktUndGerade(d, v = wahl([WAAGERECHT, LOTRECHT]), b = 12, h = 8) {
  const n = senk(v), x = suche(() => ({ a: v === WAAGERECHT ? [1, zz(0, h)] : [zz(0, b), 1], t: zz(1, 7), s: wahl([1, -1]) }), (q) => { const p = plus(plus(q.a, v, q.t), n, q.s * d); return drin(b - 1, h - 1, p) && p[0] >= 1 && p[1] >= 1; });
  const fuss = plus(x.a, v, x.t), p = plus(fuss, n, x.s * d);
  return { a: x.a, v, n, fuss, p, g: GT(b, h, { linien: [LN('g', x.a, plus(x.a, v))], punkte: [PT('P', ...p, v === WAAGERECHT ? 'ro' : 'o')] }) };
}
// Zwei parallele Geraden g und h im Abstand d.
function parallelen(d, v = wahl([WAAGERECHT, LOTRECHT]), b = 12, h = 8) {
  const a = v === WAAGERECHT ? [1, zz(0, h - d)] : [zz(0, b - d), 1], q = plus(a, v === WAAGERECHT ? LOTRECHT : WAAGERECHT, d);
  return { a, q, v, g: GT(b, h, { linien: [LN('g', a, plus(a, v)), LN('h', q, plus(q, v))] }) };
}
// Punkt P über g mit drei Punkten A, B, C auf g: einer genau gegenüber, die anderen daneben. Dazu die drei Wege als Strecken.
function dreiWege(v, d, b = 12, h = 8) {
  const n = senk(v);
  const x = suche(() => ({ a: [zz(0, b), zz(0, h)], t: zz(2, 5), s: wahl([1, -1]), k: mische([-2, -1, 1, 2, 3]).slice(0, 2) }), (q) => { const f = plus(q.a, v, q.t), p = plus(f, n, q.s * d), pts = [f, ...q.k.map((k) => plus(f, v, k))];
    return drin(b, h, q.a, plus(q.a, v, 2), ...pts) && drin(b - 1, h - 1, p) && p[0] >= 1 && p[1] >= 1 && pts.every((z) => z[0] >= 1 && z[1] >= 1 && z[0] < b && z[1] < h); });
  const f = plus(x.a, v, x.t), p = plus(f, n, x.s * d), namen = mische(['A', 'B', 'C']), pts = [f, ...x.k.map((k) => plus(f, v, k))].map((z, i) => ({ p: z, n: namen[i], r: i === 0 })).sort((y, z) => y.n.localeCompare(z.n));
  return { p, f, pts, g: GT(b, h, { linien: [LN('g', x.a, plus(x.a, v)), ...pts.map((z) => LN(null, p, z.p, 'strecke', 'hilfs'))], punkte: [PT('P', ...p, x.s > 0 ? 'o' : 'u'), ...pts.map((z) => PT(z.n, ...z.p, x.s > 0 ? 'u' : 'o'))] }) };
}
const wegOptionen = (w) => w.pts.map((z) => opt(`Strecke P${z.n}`, z.r, z.r ? undefined : 'abstand-schraeg'));

export function entfernungUndAbstand() {
  sechs(L_('D1'), 'F', [
    () => { const n = zz(3, 9), p = zweiPunkte(n);
      return zahl(Z('Schau dir die Punkte A und B an.', 'Wie viele Kästchen sind sie voneinander entfernt?'), n, fehlerliste(n, [[n + 1, 'koord-ab-eins'], [n - 1, 'koord-ab-eins']]),
        h3('Die Entfernung ist der gerade Weg von A nach B.', 'Zähle die Kästchen zwischen den Punkten, nicht die Linien.', 'Beginne bei A und zähle Kästchen für Kästchen bis B.'), { einheit: 'Kästchen', bild: B.gitter(p.g), nachweis: [{ art: 'strecke', von: 'A', nach: 'B', wert: n, einheit: 'kaestchen' }] }); },
    () => { const d = zz(2, 5), x = punktUndGerade(d, WAAGERECHT);
      return zahl(Z('Schau dir den Punkt P und die Gerade g an.', 'Wie viele Kästchen ist P von g entfernt?'), d, fehlerliste(d, [[d + 1, 'koord-ab-eins'], [d - 1, 'koord-ab-eins']]),
        h3('Geh von P auf dem kürzesten Weg zu g.', 'Der kürzeste Weg führt gerade nach unten oder gerade nach oben.', 'Zähle die Kästchen von P bis zur Geraden.'), { einheit: 'Kästchen', bild: B.gitter(x.g), nachweis: [{ art: 'abstand', punkt: 'P', linie: 'g', wert: d, einheit: 'kaestchen' }] }); },
    () => { const w = dreiWege(wahl([WAAGERECHT, LOTRECHT]), zz(2, 4));
      return auswahl(Z('Vom Punkt P führen drei Wege zur Geraden g.', 'Welcher Weg ist am kürzesten?'), wegOptionen(w),
        h3('Der kürzeste Weg trifft die Gerade im rechten Winkel.', 'Ein schräger Weg ist immer länger als der gerade Weg.', 'Suche den Weg, der senkrecht zu g ist.'), { bild: B.gitter(w.g), nachweis: [{ art: 'lotfuss', punkt: 'P', linie: 'g' }] }); },
    () => { const d = zz(2, 5), x = parallelen(d);
      return zahl(Z('Die Geraden g und h sind parallel zueinander.', 'Wie viele Kästchen liegen sie auseinander?'), d, fehlerliste(d, [[d + 1, 'koord-ab-eins'], [d - 1, 'koord-ab-eins']]),
        h3('Zwei parallele Geraden haben überall den gleichen Abstand.', 'Zähle die Kästchen auf dem kürzesten Weg von g nach h.', 'Geh im rechten Winkel von g zu h und zähle die Kästchen.'), { einheit: 'Kästchen', bild: B.gitter(x.g), nachweis: [{ art: 'abstandLinien', linien: ['g', 'h'], wert: d, einheit: 'kaestchen' }] }); },
    () => { const n = wahl([4, 6, 8, 10]), p = zweiPunkte(n, 'HB');
      return zahl(Z('Das Haus steht im Punkt H und der Baum im Punkt B.', '2 Kästchen sind 1 cm lang.', 'Wie viele cm sind H und B voneinander entfernt?'), n / 2, fehlerliste(n / 2, [[n, 'laenge-kaestchen'], [n * 2, 'laenge-kaestchen']]),
        h3('Zähle zuerst die Kästchen zwischen H und B.', 'Immer 2 Kästchen zusammen sind 1 cm.', `Es sind ${n} Kästchen. Teile durch 2.`), { einheit: 'cm', bild: B.gitter(p.g), nachweis: [KAESTCHEN, ...N(`${n} : 2`), { art: 'strecke', von: 'H', nach: 'B', wert: n / 2, einheit: 'cm' }] }); },
    () => { const d = zz(2, 5), x = punktUndGerade(d, LOTRECHT);
      return zahl(Z('Die Gerade g ist ein Weg im Schlossgarten.', 'Im Punkt P steht ein Brunnen.', 'Wie viele Kästchen ist der Brunnen vom Weg entfernt?'), d, fehlerliste(d, [[d + 1, 'koord-ab-eins'], [d - 1, 'koord-ab-eins']]),
        h3('Geh vom Brunnen auf dem kürzesten Weg zum Weg.', 'Der kürzeste Weg führt gerade nach links oder gerade nach rechts.', 'Zähle die Kästchen von P bis zur Geraden.'), { einheit: 'Kästchen', bild: B.gitter(x.g), nachweis: [{ art: 'abstand', punkt: 'P', linie: 'g', wert: d, einheit: 'kaestchen' }] }); },
  ]);
  sechs(L_('D1'), 'G', [
    () => { const n = wahl([4, 6, 8, 10]), p = zweiPunkte(n, 'AB', 12, 7, true);
      return zahl(Z('Die Entfernung von A nach B ist die Länge der Strecke AB.', 'Wie viele cm sind A und B voneinander entfernt?', 'Denke daran: 2 Kästchen sind 1 cm.'), n / 2, fehlerliste(n / 2, [[n, 'laenge-kaestchen'], [n / 2 + 1, 'koord-ab-eins']]),
        h3('Zähle die Kästchen und rechne sie in Zentimeter um.', '6 Kästchen sind 3 cm, denn 6 : 2 = 3.', `Die Strecke ist ${n} Kästchen lang.`), { einheit: 'cm', bild: B.gitter(p.g), nachweis: [KAESTCHEN, ...N(`${n} : 2`), { art: 'strecke', von: 'A', nach: 'B', wert: n / 2, einheit: 'cm' }] }); },
    () => { const d = wahl([2, 4, 6]), x = punktUndGerade(d);
      return zahl(Z('Der Abstand ist der kürzeste Weg von P zur Geraden g.', 'Wie viele cm beträgt der Abstand?', 'Denke daran: 2 Kästchen sind 1 cm.'), d / 2, fehlerliste(d / 2, [[d, 'laenge-kaestchen']]),
        h3('Miss den Abstand immer senkrecht zur Geraden.', '4 Kästchen sind 2 cm, denn 4 : 2 = 2.', `Der Punkt P ist ${d} Kästchen von g entfernt.`), { einheit: 'cm', bild: B.gitter(x.g), nachweis: [KAESTCHEN, ...N(`${d} : 2`), { art: 'abstand', punkt: 'P', linie: 'g', wert: d / 2, einheit: 'cm' }] }); },
    () => { const x = punktUndGerade(zz(2, 4));
      return gitterPunkte(Z('Schau dir den Punkt P und die Gerade g an.', 'Ein Punkt von g liegt P am nächsten.', 'Markiere diesen Punkt.'), x.g, [x.fuss], [[[plus(x.fuss, x.v)], 'abstand-schraeg'], [[plus(x.fuss, x.v, -1)], 'abstand-schraeg']],
        h3('Der nächste Punkt liegt genau gegenüber von P.', 'Der kürzeste Weg von P zu g ist senkrecht zu g.', 'Geh von P aus im rechten Winkel auf g zu.'), { nachweis: [{ art: 'lotfuss', punkt: 'P', linie: 'g' }] }); },
    () => { const v = wahl([[1, 1], [1, -1]]), w = dreiWege(v, 2, 12, 9);
      return auswahl(Z('Die Gerade g verläuft schräg.', 'Welche Strecke zeigt den Abstand von P zu g?'), wegOptionen(w),
        h3('Der Abstand ist der kürzeste Weg von P zu g.', 'Der kürzeste Weg ist senkrecht zu g.', 'Suche die Strecke mit einem rechten Winkel zu g.'), { bild: B.gitter(w.g), nachweis: [{ art: 'lotfuss', punkt: 'P', linie: 'g' }] }); },
    () => { const d = wahl([2, 4, 6]), x = parallelen(d);
      return zahl(Z('Die Geraden g und h sind parallel zueinander.', 'Wie viele cm beträgt ihr Abstand?', 'Denke daran: 2 Kästchen sind 1 cm.'), d / 2, fehlerliste(d / 2, [[d, 'laenge-kaestchen']]),
        h3('Den Abstand misst du senkrecht zu beiden Geraden.', '6 Kästchen sind 3 cm, denn 6 : 2 = 3.', `Die Geraden liegen ${d} Kästchen auseinander.`), { einheit: 'cm', bild: B.gitter(x.g), nachweis: [KAESTCHEN, ...N(`${d} : 2`), { art: 'abstandLinien', linien: ['g', 'h'], wert: d / 2, einheit: 'cm' }] }); },
    () => { const k = kind(), [d, s] = wahl([[4, 3], [3, 4]]), v = wahl([WAAGERECHT, LOTRECHT]), n = senk(v);
      const x = suche(() => ({ a: v === WAAGERECHT ? [1, zz(0, 8)] : [zz(0, 12), 1], t: zz(1, 7), z: wahl([1, -1]), r: wahl([1, -1]) }), (q) => { const f = plus(q.a, v, q.t), p = plus(f, n, q.z * d), a = plus(f, v, q.r * s); return drin(11, 7, p, a) && [p, a].every((c) => c[0] >= 1 && c[1] >= 1); });
      const f = plus(x.a, v, x.t), p = plus(f, n, x.z * d), a = plus(f, v, x.r * s), g = GT(12, 8, { linien: [LN('g', x.a, plus(x.a, v)), LN(null, p, a, 'strecke', 'hilfs')], punkte: [PT('P', ...p, 'o'), PT('A', ...a, v === WAAGERECHT ? 'u' : 'r')] });
      return auswahl(Z(`${k} misst die Strecke von P nach A.`, 'Sie ist 5 Kästchen lang.', `${k} sagt: „Der Abstand von P zu g ist 5 Kästchen.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'abstand-schraeg'), opt(`Falsch. Der Abstand ist ${d} Kästchen. Man misst senkrecht zu g.`, true), opt(`Falsch. Der Abstand ist ${s} Kästchen.`, false, 'abstand-schraeg')],
        h3('Der Abstand ist der kürzeste Weg von P zu g.', 'Ein schräger Weg ist länger als der Weg im rechten Winkel.', 'Geh von P aus im rechten Winkel auf g zu und zähle die Kästchen.'), { bild: B.gitter(g), nachweis: [U(false), { art: 'abstand', punkt: 'P', linie: 'g', wert: d, einheit: 'kaestchen' }, { art: 'strecke', von: 'P', nach: 'A', wert: 5, einheit: 'kaestchen' }, HILFSZAHL(s, 'Kästchen vom Fußpunkt bis A')] }); },
  ]);
  sechs(L_('D1'), 'M', [
    () => { const d = zz(2, 6), x = punktUndGerade(d, undefined, 13, 9);
      return zahl('Wie viele mm beträgt der Abstand des Punktes P von der Geraden g? Ein Kästchen ist 5 mm breit.', d * 5, fehlerliste(d * 5, [[d, 'laenge-kaestchen'], [d * 10, 'einheit-mm-cm']]),
        h2('Der Abstand wird senkrecht zur Geraden gemessen.', `Der Punkt P ist ${d} Kästchen von g entfernt. Rechne in mm um.`), { einheit: 'mm', bild: B.gitter(x.g), nachweis: [...N(`${d} · 5`), { art: 'abstand', punkt: 'P', linie: 'g', wert: d * 5, einheit: 'mm' }] }); },
    () => { const d = wahl([3, 5, 7]), x = parallelen(d, undefined, 13, 9);
      return luecken('Der Abstand der Parallelen g und h beträgt {{a}} cm und {{b}} mm. Ein Kästchen ist 5 mm breit.', { a: [Math.floor(d / 2), fehlerliste(Math.floor(d / 2), [[d, 'laenge-kaestchen']])], b: [5, []] },
        h2('Zähle die Kästchen auf einer Senkrechten zu beiden Geraden.', `Es sind ${d} Kästchen, also ${d * 5} mm.`), { bild: B.gitter(x.g), nachweis: [...N(`${d} · 5`, `${d * 5} : 10 = ${Math.floor(d / 2)} Rest 5`), { art: 'abstandLinien', linien: ['g', 'h'], wert: d * 5, einheit: 'mm' }] }); },
    () => { const x = zz(2, 13), y1 = zz(1, 4), y2 = y1 + zz(4, 7), m = wahl([100, 200, 500]);
      return zahl(`Auf einer Karte des Königreichs liegt die Burg im Punkt B(${x}|${y1}) und der Turm im Punkt T(${x}|${y2}). Eine Einheit entspricht ${m} m. Wie viele m sind Burg und Turm in Luftlinie voneinander entfernt?`, (y2 - y1) * m, fehlerliste((y2 - y1) * m, [[y2 - y1, 'sach-schritt-vergessen'], [(y2 + y1) * m, 'sub-addiert'], [y2 * m, 'lineal-nicht-null']]),
        h2('Beide Punkte haben dieselbe x-Koordinate. Sie liegen genau übereinander.', `Die Entfernung beträgt ${y2} − ${y1} Einheiten.`), { einheit: 'm', nachweis: [...N(`${y2} − ${y1}`, `${y2 - y1} · ${m}`), HILFSZAHL(x, 'Beide Punkte haben dieselbe x-Koordinate.')] }); },
    () => { const v = WAAGERECHT, yg = zz(1, 2), [d1, d2] = suche(() => [zz(2, 5), zz(2, 5)], ([p, q]) => p !== q), x1 = zz(1, 3), x2 = zz(8, 11), namen = mische(['P', 'Q']);
      const g = GT(12, 8, { linien: [LN('g', [1, yg], [2, yg])], punkte: [PT(namen[0], x1, yg + d1), PT(namen[1], x2, yg + d2)] }), mehr = d1 > d2 ? namen[0] : namen[1];
      return auswahl('Welcher Punkt hat den größeren Abstand von der Geraden g?', ['P', 'Q'].map((n) => opt(`Punkt ${n}`, n === mehr, n === mehr ? undefined : 'abstand-schraeg')).concat([opt('Beide haben denselben Abstand.', false)]),
        h2('Auf die Lage links oder rechts kommt es nicht an.', 'Miss für beide Punkte den Abstand senkrecht zu g und vergleiche.'), { bild: B.gitter(g), nachweis: [{ art: 'abstand', punkt: namen[0], linie: 'g', wert: d1, einheit: 'kaestchen' }, { art: 'abstand', punkt: namen[1], linie: 'g', wert: d2, einheit: 'kaestchen' }] }); },
    () => { const [x, y, z] = wahl([[6, 8, 10], [8, 6, 10]]), a = [zz(1, 2), 1], b = plus(a, [x, 0]), c = plus(b, [0, y]);
      const g = GT(12, 10, { linien: [LN(null, a, b, 'strecke'), LN(null, b, c, 'strecke'), LN(null, a, c, 'strecke', 'hilfs')], punkte: [PT('A', ...a, 'lu'), PT('B', ...b, 'ru'), PT('C', ...c, 'ro')] });
      return zahl(`Ein Weg führt von A über B nach C. Die Luftlinie von A nach C ist ${z / 2} cm lang. Um wie viele cm ist die Luftlinie kürzer als der Weg über B? Denke daran: 2 Kästchen sind 1 cm.`, (x + y - z) / 2, fehlerliste((x + y - z) / 2, [[(x + y) / 2, 'sach-schritt-vergessen'], [x + y - z, 'laenge-kaestchen']]),
        h2('Bestimme zuerst die Längen der Strecken AB und BC in cm.', `Der Weg über B ist ${x / 2} cm + ${y / 2} cm lang.`), { einheit: 'cm', bild: B.gitter(g), nachweis: [KAESTCHEN, { art: 'strecke', von: 'A', nach: 'B', wert: x / 2, einheit: 'cm' }, { art: 'strecke', von: 'B', nach: 'C', wert: y / 2, einheit: 'cm' }, { art: 'strecke', von: 'A', nach: 'C', wert: z / 2, einheit: 'cm' }, ...N(`${x / 2} + ${y / 2}`, `${(x + y) / 2} − ${z / 2}`)] }); },
    () => { const d = zz(5, 7), k = zz(1, d - 2), x = parallelen(d, WAAGERECHT, 13, 9), p = [zz(2, 11), x.a[1] + k], g = GT(13, 9, { ...x.g, punkte: [PT('P', ...p)] });
      return zahl(`Der Punkt P liegt zwischen den Parallelen g und h. Die Parallelen haben den Abstand ${d * 5} mm. Der Punkt P ist ${k * 5} mm von g entfernt. Wie viele mm ist P von h entfernt?`, (d - k) * 5, fehlerliste((d - k) * 5, [[(d + k) * 5, 'sub-addiert'], [d - k, 'laenge-kaestchen']]),
        h2('Die Abstände von P zu g und zu h ergeben zusammen den Abstand der Parallelen.', `Rechne ${d * 5} mm − ${k * 5} mm.`), { einheit: 'mm', bild: B.gitter(g), nachweis: [{ art: 'abstandLinien', linien: ['g', 'h'], wert: d * 5, einheit: 'mm' }, { art: 'abstand', punkt: 'P', linie: 'g', wert: k * 5, einheit: 'mm' }, ...N(`${d * 5} − ${k * 5}`), { art: 'abstand', punkt: 'P', linie: 'h', wert: (d - k) * 5, einheit: 'mm' }] }); },
  ]);
  sechs(L_('D1'), 'E', [
    () => { const [dg, dh] = suche(() => [zz(1, 3), zz(1, 3)], ([p, q]) => p !== q), yg = zz(3, 5), xh = zz(3, 9), g = GT(12, 8, { linien: [LN('g', [1, yg], [2, yg]), LN('h', [xh, 1], [xh, 2])] }), soll = [[xh - dh, yg - dg], [xh - dh, yg + dg], [xh + dh, yg - dg], [xh + dh, yg + dg]];
      return gitterPunkte(`Markiere alle Gitterpunkte, die von der Geraden g den Abstand ${dg} Kästchen und von der Geraden h den Abstand ${dh} Kästchen haben.`, g, soll, [[[[xh - dg, yg - dh], [xh - dg, yg + dh], [xh + dg, yg - dh], [xh + dg, yg + dh]], 'koord-vertauscht'], [[soll[3]], 'sach-schritt-vergessen'], [[soll[1], soll[3]], 'sach-schritt-vergessen']],
        h1('Zu jedem Abstand gibt es Punkte auf beiden Seiten der Geraden. Suche die Punkte, die beide Bedingungen zugleich erfüllen.'), { offen: true, nachweis: [{ art: 'abstandspunkte', bedingungen: [['g', dg], ['h', dh]] }] }); },
    () => { const a = zz(6, 9), b = zz(2, a - 2);
      return luecken(`Von A nach B sind es ${a} cm, von B nach C sind es ${b} cm. Die Lage der drei Punkte ist nicht bekannt. Die Entfernung von A nach C beträgt höchstens {{a}} cm und mindestens {{b}} cm.`, { a: [a + b, fehlerliste(a + b, [[a, 'sach-schritt-vergessen']])], b: [a - b, fehlerliste(a - b, [[b, 'sach-schritt-vergessen'], [0, 'sach-falsche-rechnung']])] },
        h1('Stell dir vor, die drei Punkte liegen auf einer Geraden: einmal B zwischen A und C, einmal C zwischen A und B.'), { nachweis: N(`${a} + ${b}`, `${a} − ${b}`) }); },
    () => { const p = suche(() => [zz(2, 13), zz(2, 10)], (q) => q[0] !== q[1]);
      return luecken(`Der Punkt P hat die Koordinaten (${p[0]}|${p[1]}). Sein Abstand von der x-Achse beträgt {{a}} Einheiten, sein Abstand von der y-Achse beträgt {{b}} Einheiten.`, { a: [p[1], fehlerliste(p[1], [[p[0], 'koord-vertauscht']])], b: [p[0], fehlerliste(p[0], [[p[1], 'koord-vertauscht']])] },
        h1('Der Abstand von der x-Achse wird senkrecht zur x-Achse gemessen, also nach oben.'), { nachweis: [{ art: 'achsenabstand', xAchse: p[1], yAchse: p[0] }] }); },
    () => { const k = kind(), d = zz(2, 4), w = dreiWege(wahl([WAAGERECHT, LOTRECHT]), d);
      return auswahl(`${k} sagt: „Der Abstand von P zur Geraden g ist die Entfernung von P zu irgendeinem Punkt auf g.“ Stimmt das?`, [opt('Falsch. Der Abstand ist die kürzeste dieser Entfernungen. Sie wird senkrecht zu g gemessen.', true), opt('Stimmt. Alle Punkte auf g sind gleich weit von P entfernt.', false, 'abstand-schraeg'), opt('Falsch. Der Abstand ist die größte dieser Entfernungen.', false, 'abstand-schraeg'), opt('Stimmt. Man darf den Punkt auf g frei wählen.', false, 'abstand-schraeg')],
        h1('Vergleiche im Bild die drei Strecken von P zur Geraden.'), { bild: B.gitter(w.g), nachweis: [U(false), { art: 'abstand', punkt: 'P', linie: 'g', wert: d, einheit: 'kaestchen' }] }); },
    () => { const r = wahl([5, 5, 10]), p = [r === 5 ? zz(5, 7) : 10, r === 5 ? zz(5, 7) : 10], b = r === 5 ? 12 : 18, h = r === 5 ? 12 : 14, g = GT(b, h, { punkte: [PT('P', ...p)] });
      let anzahl = 0; for (let x = 0; x <= b; x++) for (let y = 0; y <= h; y++) if ((x - p[0]) ** 2 + (y - p[1]) ** 2 === r * r) anzahl++;
      return zahl(`Wie viele Gitterpunkte im Bild sind vom Punkt P genau ${r} Kästchen entfernt? Tipp: Eine Strecke, die 3 Kästchen nach rechts und 4 Kästchen nach oben führt, ist genau 5 Kästchen lang.`, anzahl, fehlerliste(anzahl, [[4, 'abstand-schraeg'], [8, 'sach-schritt-vergessen']]),
        h1('Es gibt Punkte genau neben, über und unter P und außerdem schräg liegende Punkte. Nutze den Tipp für alle Richtungen.'), { bild: B.gitter(g), nachweis: [{ art: 'entfernungspunkte', punkt: 'P', wert: r, anzahl }, { art: 'dreieck', a: 3, b: 4, c: 5 }] }); },
    () => { const d = zz(3, 6);
      return auswahl(`Die Geraden g und h sind parallel und haben den Abstand ${d} cm. Der Punkt A liegt auf g, der Punkt B liegt auf h. Was gilt für die Länge der Strecke AB?`, [opt(`Sie ist mindestens ${d} cm lang.`, true), opt(`Sie ist immer genau ${d} cm lang.`, false, 'abstand-schraeg'), opt(`Sie ist höchstens ${d} cm lang.`, false, 'abstand-schraeg'), opt('Darüber lässt sich nichts sagen.', false)],
        h1('Überlege, wann die Strecke AB am kürzesten ist und was geschieht, wenn du B auf h verschiebst.'), { nachweis: [HILFSZAHL(d, 'Abstand der Parallelen')] }); },
  ]);
}
