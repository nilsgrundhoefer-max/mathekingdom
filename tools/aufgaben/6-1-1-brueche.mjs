// Aufgaben zu 6.1.1 „Brüche“ (Lernziele B1, B2) nach ADR 0015 und ADR 0037.
// B1: Bruchteile an Bildern erkennen und darstellen, auch über 1. B2: gemischte Zahl und Bruch ineinander umwandeln.
// Grilling mit Nils (2026-11-24): Die Meilensteine überschneiden sich mit Klasse 5 Kapitel 9 und ziehen an:
// F Nenner bis 10 und verstreut gefärbt, G mehrere Ganze und Nenner bis 20, M bis 50 und 100, E bis 200.

import { sechs, auswahl, luecken, zahl, ordnen, bruch, faerben, Z, h1, h2, h3, fehlerliste, kind, zweiKinder } from '../werkzeug.mjs';
import { vorn, streu, fig, leer, benenne, bild, anz, NB, NBW, WERT, HILFS, FORM, b2, sortiere, br, opt, zz, wahl, mische } from './6-1-brueche.mjs';

const B1 = '6.1.1-B1', B2 = '6.1.1-B2';
const figurOpt = (figuren, richtig, fv = () => undefined) => figuren.map((f, i) => opt(`Figur ${f.n}`, richtig(f, i), richtig(f, i) ? undefined : fv(f, i)));
const GANZE = { kreis: 'Jeder Kreis', rechteck: 'Jedes Rechteck' };

export function brueche() {
  // ================= B1: Bruchteile erkennen und darstellen =================
  const tB1 = h3('Zähle alle Teile: Das ist der Nenner. Zähle die gefärbten Teile: Das ist der Zähler.', 'Von 5 gleich großen Teilen sind 2 Teile gefärbt. Der Bruch heißt 2⁄5.', 'Schreibe die Zahl der gefärbten Teile über den Bruchstrich. Schreibe die Zahl aller Teile darunter.');
  sechs(B1, 'F', [
    () => { const n = wahl([5, 6, 8, 10]), k = zz(2, n - 2);
      if (2 * k === n || n - k < 2) return null;
      return auswahl(Z('Der Kreis ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?'), [opt(br(k, n), true), opt(br(n - k, n), false), opt(br(k, n - k), false, 'bruch-teil-zu-rest')], tB1,
        { bild: bild(fig('kreis', n, streu(n, k))), nachweis: [NB(br(k, n)), WERT(br(k, n))] }); },
    () => { const n = wahl([[2, 3], [2, 4], [2, 5], [3, 3]]), N = anz(n), k = zz(2, N - 2);
      return bruch(Z('Das Rechteck ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?', 'Schreibe den Bruch.'), br(k, N), [[br(N, k), 'bruch-vertauscht'], [br(k, N - k), 'bruch-teil-zu-rest']], tB1,
        { bild: bild(fig('rechteck', n, streu(N, k))), nachweis: [NB(br(k, N))] }); },
    () => { const n = wahl([5, 6, 7, 8, 9, 10]), k = zz(2, n - 2);
      return faerben(Z(`Färbe ${br(k, n)} des Streifens.`, 'Tippe die Teile an.'), leer('streifen', n), br(k, n), k, [[n - k, 'bruch-teil-zu-rest'], [1, 'bruchteil-zaehler-vergessen']],
        h3('Der Zähler sagt, wie viele Teile du färbst.', 'Für 2⁄5 färbst du 2 von 5 Teilen.', `Der Zähler ist ${k}. Färbe ${k} Teile.`)); },
    () => { const n = wahl([6, 8, 9, 10]), k = zz(2, n - 2), form = wahl(['streifen', 'kreis']);
      if (2 * k === n) return null;
      return zahl(Z(`${FORM[form][2]} ist ${br(k, n)} gefärbt.`, 'Wie viele Teile sind weiß?'), n - k, fehlerliste(n - k, [[k, 'sach-frage-verfehlt'], [n, 'bruch-ganzes-teil']]),
        h3('Der Nenner nennt alle Teile. Der Zähler zählt die gefärbten Teile.', 'Bei 2⁄5 sind 2 von 5 Teilen gefärbt. Dann sind 3 Teile weiß.', `Rechne ${n} − ${k}.`),
        { bild: bild(fig(form, n, streu(n, k))), nachweis: [{ art: 'bild', was: 'weiss', zahl: n - k }] }); },
    () => { const [k, n] = wahl([[3, 8], [2, 6], [3, 5], [4, 6], [5, 8]]);
      const roh = mische([[fig('kreis', n, streu(n, k)), 'r'], [fig('kreis', n, streu(n, k), { ungleich: true }), 'ungleich'], [fig('kreis', Math.min(12, n + k), streu(Math.min(12, n + k), k)), 'rest']]);
      const figuren = benenne(roh.map(([f]) => f)), rollen = roh.map(([, r]) => r);
      return auswahl(Z(`In welcher Figur ist ${br(k, n)} gefärbt?`, 'Achte auf gleich große Teile.'), figurOpt(figuren, (f, i) => rollen[i] === 'r', (f, i) => (rollen[i] === 'rest' ? 'bruch-teil-zu-rest' : 'bruch-ungleiche-teile')),
        h3('Ein Bruch braucht gleich große Teile. Schau genau hin.', 'Ein Kreis hat 2 Teile, aber ein Teil ist viel größer. Dann ist kein Teil 1⁄2.', 'Streiche zuerst die Figur mit ungleich großen Teilen. Zähle dann bei den anderen alle Teile.'),
        { bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(k, n) }] }); },
    () => { const n = wahl([[2, 3], [2, 4], [2, 5], [3, 3], [2, 2]]), N = anz(n), k = zz(Math.min(2, N - 1), N - 1);
      return faerben(Z(`Färbe ${br(k, N)} des Rechtecks.`, 'Tippe die Teile an.'), leer('rechteck', n), br(k, N), k, [[N - k, 'bruch-teil-zu-rest'], [N, 'bruch-ganzes-teil']],
        h3('Zähle zuerst alle Teile des Rechtecks. Das ist der Nenner.', 'Für 3⁄4 färbst du 3 von 4 Teilen.', `Färbe ${k} Teile. Welche Teile du nimmst, ist egal.`)); },
  ]);
  const tB1G = h3('Der Nenner zählt die Teile von einem Ganzen. Der Zähler zählt alle gefärbten Teile.', 'Zwei Kreise mit je 4 Teilen. 5 Teile sind gefärbt. Das sind 5⁄4.', 'Zähle zuerst die Teile von einem Ganzen. Zähle dann alle gefärbten Teile.');
  sechs(B1, 'G', [
    () => { const [form, n] = wahl([['kreis', 3], ['kreis', 4], ['kreis', 5], ['kreis', 6], ['rechteck', [2, 2]], ['rechteck', [2, 3]]]), N = anz(n), k = zz(1, N - 1), z = N + k;
      return bruch(Z(`${GANZE[form]} ist ein Ganzes.`, 'Wie viel ist gefärbt?', 'Schreibe als Bruch.'), br(z, N), [[br(z, 2 * N), 'ganzes-mehrere-figuren'], [br(N, z), 'bruch-vertauscht']], tB1G,
        { bild: bild(fig(form, n, vorn(z), { ganze: 2 })), nachweis: [NB(br(z, N))] }); },
    () => { const n = wahl([12, 15, 16, 18, 20]), k = zz(3, n - 3);
      if (2 * k === n) return null;
      return auswahl(Z('Der Streifen ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?'), [opt(br(k, n), true), opt(br(n - k, n), false), opt(br(k, n - k), false, 'bruch-teil-zu-rest')], h3('Die gefärbten Teile liegen verstreut. Zähle sie einzeln.', 'Von 12 Teilen sind 5 Teile gefärbt. Der Bruch heißt 5⁄12.', 'Zähle alle Teile für den Nenner. Zähle die gefärbten Teile für den Zähler.'),
        { bild: bild(fig('streifen', n, streu(n, k))), nachweis: [NB(br(k, n)), WERT(br(k, n))] }); },
    () => { const [form, n] = wahl([['kreis', 3], ['kreis', 4], ['kreis', 6], ['rechteck', [2, 2]], ['rechteck', [2, 3]], ['rechteck', [1, 5]]]), N = anz(n), k = zz(1, N - 1), z = N + k;
      return faerben(Z(`${GANZE[form]} ist ein Ganzes.`, `Färbe ${br(z, N)}.`), leer(form, n, { ganze: 2 }), br(z, N), z, [[k, 'bruch-ganzes-teil'], [N, 'bruch-vertauscht']],
        h3('Der Zähler ist größer als der Nenner. Du brauchst also mehr als ein Ganzes.', 'Für 5⁄4 färbst du 4 Teile im ersten Kreis und noch 1 Teil im zweiten.', `Färbe ein Ganzes voll. Färbe dann noch ${k} ${k === 1 ? 'Teil' : 'Teile'} im zweiten.`)); },
    () => { const n = wahl([12, 14, 15, 16, 18, 20]), k = zz(3, n - 4);
      if (2 * k === n) return null;
      return bruch(Z(`Im Bild siehst du ${n} Kugeln.`, 'Welcher Bruchteil der Kugeln ist nicht gefärbt?'), br(n - k, n), [[br(k, n), 'sach-frage-verfehlt'], [br(n - k, k), 'bruch-teil-zu-rest'], [br(n, n - k), 'bruch-vertauscht']],
        h3('Gefragt ist nach den weißen Kugeln. Zähle sie für den Zähler.', 'Von 12 Kugeln sind 5 gefärbt. Dann sind 7⁄12 nicht gefärbt.', 'Der Nenner bleibt die Zahl aller Kugeln. Der Zähler ist die Zahl der weißen Kugeln.'),
        { bild: bild(fig('menge', n, vorn(k))), nachweis: [NB(br(n - k, n), { rest: true })] }); },
    () => { const [k, n, m] = wahl([[3, 4, 2], [1, 2, 3], [2, 3, 2], [1, 3, 3], [1, 4, 2]]);
      const roh = mische([[fig('kreis', n, streu(n, k)), true], [fig('rechteck', [m, n], streu(m * n, m * k)), true], [fig('kreis', n, streu(n, k), { ungleich: true }), false, 'bruch-ungleiche-teile'], [fig('rechteck', [1, n + k], streu(n + k, k)), false, 'bruch-teil-zu-rest']]);
      const figuren = benenne(roh.map(([f]) => f));
      return auswahl(Z(`In welchen Figuren ist ${br(k, n)} gefärbt?`, 'Kreuze alle passenden Figuren an.'), figuren.map((f, i) => opt(`Figur ${f.n}`, roh[i][1], roh[i][2])),
        h3('Die Form ist egal. Auch die Zahl der Teile darf anders sein.', '2⁄4 eines Rechtecks sind genauso viel wie 1⁄2.', 'Prüfe jede Figur: Sind die Teile gleich groß? Ist gleich viel gefärbt?'),
        { mehrfach: true, bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(k, n) }] }); },
    () => { const n = wahl([3, 4, 5, 6]), k = zz(1, n - 1), z = n + k, [a, c] = zweiKinder();
      return auswahl(Z('Jeder Kreis ist ein Ganzes.', `${a} zählt ${br(z, 2 * n)}.`, `${c} zählt ${br(z, n)}.`, 'Welcher Bruch stimmt?'), [opt(br(z, n), true), opt(br(z, 2 * n), false, 'ganzes-mehrere-figuren'), opt(br(n, z), false, 'bruch-vertauscht')],
        h3('Ein Ganzes ist ein Kreis, nicht beide zusammen.', 'Zwei Kreise mit je 4 Teilen. 5 Teile sind gefärbt. Das sind 5⁄4 und nicht 5⁄8.', `Ein Kreis hat ${n} Teile. Das ist der Nenner.`),
        { bild: bild(fig('kreis', n, vorn(z), { ganze: 2 })), nachweis: [NB(br(z, n)), WERT(br(z, n)), HILFS(br(z, 2 * n), 'falsch gezählter Bruch aus dem Text')] }); },
  ]);
  const tB1M = h2('Zähle zuerst die Teile eines Ganzen: Das ist der Nenner. Zähle dann alle gefärbten Teile.', 'Schreibe die Zahl der gefärbten Teile über den Bruchstrich und die Zahl der Teile eines Ganzen darunter.');
  sechs(B1, 'M', [
    () => { const n = wahl([[3, 4], [3, 5], [4, 5], [2, 6], [3, 6]]), N = anz(n), k = zz(2, N - 2), z = 2 * N + k;
      return bruch(Z('Jedes Rechteck ist ein Ganzes. Wie viel ist gefärbt?', 'Schreibe als Bruch.'), br(z, N), [[br(z, 3 * N), 'ganzes-mehrere-figuren'], [br(N, z), 'bruch-vertauscht'], [br(k, N), 'gemischt-umwandeln']], tB1M,
        { bild: bild(fig('rechteck', n, vorn(z), { ganze: 3 })), nachweis: [NB(br(z, N))] }); },
    () => { const [n, z, nn] = wahl([[[4, 5], 3, 5], [[4, 5], 3, 4], [[3, 4], 2, 3], [[3, 6], 5, 6], [[4, 4], 3, 8], [[3, 5], 2, 5], [[4, 5], 7, 10]]), N = anz(n), k = (N / nn) * z;
      return faerben(`Das Rechteck hat ${N} gleich große Teile. Färbe ${br(z, nn)} des Rechtecks.`, leer('rechteck', n), br(z, nn), k, [[z, 'bruchteil-zaehler-vergessen'], [N / nn, 'bruchteil-zaehler-vergessen'], [N - k, 'bruch-teil-zu-rest']],
        h2(`Der Nenner ist ${nn}, das Rechteck hat aber ${N} Teile. Wie viele Teile gehören zu einem ${nn === 3 ? 'Drittel' : nn === 4 ? 'Viertel' : nn === 5 ? 'Fünftel' : nn === 6 ? 'Sechstel' : nn === 8 ? 'Achtel' : 'Zehntel'}?`, `Rechne ${N} : ${nn} = ${N / nn}. Nimm das Ergebnis mit ${z} mal und färbe so viele Teile.`)); },
    () => { const n = wahl([20, 25, 40, 50]), mal = 100 / n, z = wahl(vorn(n - 3, 2).filter((x) => x * mal < 100 && x % 5 !== 0));
      return zahl(`Im Hunderterfeld sollen ${br(z, n)} gefärbt werden. Wie viele Kästchen sind das?`, z * mal, fehlerliste(z * mal, [[z, 'bruchteil-zaehler-vergessen'], [mal, 'bruchteil-zaehler-vergessen'], [100 - z * mal, 'sach-frage-verfehlt']]),
        h2(`Wie viele Kästchen gehören zu einem Teil, wenn 100 Kästchen in ${n} gleich große Teile geteilt werden?`, `Rechne 100 : ${n} = ${mal}. Nimm das Ergebnis mit ${z} mal.`),
        { nachweis: [`${br(z, n)} von 100 = ${z * mal}`] }); },
    () => { const [form, n] = wahl([['kreis', 8], ['kreis', 10], ['kreis', 12], ['rechteck', [3, 4]], ['rechteck', [4, 5]]]), N = anz(n), k = zz(2, N - 2), z = N + k;
      return auswahl(`${GANZE[form]} ist ein Ganzes. Welcher Bruch gibt an, wie viel weiß geblieben ist?`, [opt(br(N - k, N), true), opt(br(N - k, 2 * N), false, 'ganzes-mehrere-figuren'), opt(br(z, N), false, 'sach-frage-verfehlt'), opt(br(k, N), false)],
        h2('Gefragt ist nach den weißen Teilen. Der Nenner zählt trotzdem nur die Teile eines Ganzen.', `Ein Ganzes hat ${N} Teile. Weiß sind ${N - k} Teile.`),
        { bild: bild(fig(form, n, vorn(z), { ganze: 2 })), nachweis: [{ art: 'bild', was: 'weiss', zahl: N - k }, `${N - k} : ${N} = ${br(N - k, N)}`, WERT(br(N - k, N), true)] }); },
    () => { const n = wahl([24, 30, 36, 40, 48]), k = wahl(vorn(n - 10, 5)), j = zz(3, 6), kn = kind(), [ding, tat] = wahl([['Eine Tafel Schokolade hat', 'isst'], ['Ein Kalender hat', 'öffnet'], ['Ein Setzkasten hat', 'füllt']]), was = ding.startsWith('Eine Tafel') ? 'Stücke' : ding.startsWith('Ein Kalender') ? 'Türchen' : 'Fächer';
      if (k + j >= n) return null;
      return bruch(`${ding} ${n} gleich große ${was}. ${kn} ${tat} zuerst ${k} und dann noch ${j} ${was}. Welcher Bruchteil ist das zusammen?`, br(k + j, n), [[br(j, n), 'sach-schritt-vergessen'], [br(k, n), 'sach-schritt-vergessen'], [br(k + j, n - k - j), 'bruch-teil-zu-rest'], [br(n - k - j, n), 'sach-frage-verfehlt']],
        h2('Zähle zuerst zusammen, wie viele es am Ende sind. Der Nenner ist die Zahl aller Teile.', `Rechne ${k} + ${j} = ${k + j}. Das ist der Zähler.`), { nachweis: [`${k} + ${j} = ${k + j}`, `${k + j} : ${n} = ${br(k + j, n)}`] }); },
    () => { const [n, m] = wahl([[4, 2], [3, 2], [5, 2], [2, 3], [3, 3], [4, 3]]), k = zz(1, n - 1), ganze = 1, z = ganze * n + k;
      const roh = mische([[fig('kreis', n, vorn(z), { ganze: 2 }), true], [fig('rechteck', [m, n], vorn(m * z), { ganze: 2 }), true], [fig('kreis', 2 * n > 12 ? n : 2 * n, vorn(z)), false, 'bruch-ganzes-teil'], [fig('rechteck', [1, n], vorn(k)), false, 'gemischt-umwandeln']]);
      if (roh[2] && 2 * n > 12) return null;
      const figuren = benenne(roh.map(([f]) => f));
      return auswahl(`In welchen Bildern ist ${br(z, n)} gefärbt? Bei zwei gleichen Figuren ist jede ein Ganzes. Kreuze alle passenden an.`, figuren.map((f, i) => opt(`Figur ${f.n}`, roh[i][1], roh[i][2])),
        h2(`${br(z, n)} ist mehr als ein Ganzes. Welche Bilder zeigen überhaupt mehr als ein Ganzes?`, `Ein Ganzes sind ${br(n, n)}. Dazu kommen noch ${br(k, n)}. Auch feinere Teile können gleich viel zeigen.`),
        { mehrfach: true, bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(z, n) }] }); },
  ]);
  sechs(B1, 'E', [
    () => { const n = wahl([[3, 5], [4, 5], [3, 6], [4, 4]]), N = anz(n), k = zz(2, N - 2), z = 2 * N + k;
      return bruch('Jedes Rechteck ist ein Ganzes. Welcher Bruchteil ist weiß geblieben? Schreibe als Bruch.', br(N - k, N), [[br(N - k, 3 * N), 'ganzes-mehrere-figuren'], [br(z, N), 'sach-frage-verfehlt'], [br(k, N), 'sach-frage-verfehlt']],
        h1('Der Nenner zählt die Teile eines Ganzen. Der Zähler zählt hier die weißen Teile.'),
        { bild: bild(fig('rechteck', n, vorn(z), { ganze: 3 })), nachweis: [{ art: 'bild', was: 'weiss', zahl: N - k }, `${N - k} : ${N} = ${br(N - k, N)}`] }); },
    () => { const n = wahl([20, 25, 50]), mal = 100 / n, z = wahl(vorn(n - 5, 3).filter((x) => x % 5 !== 0)), g = zz(1, 2), Z_ = g * n + z;
      return zahl(`Jedes Hunderterfeld ist ein Ganzes. Wie viele Kästchen musst du färben, um ${br(Z_, n)} darzustellen?`, Z_ * mal, fehlerliste(Z_ * mal, [[z * mal, 'gemischt-umwandeln'], [Z_, 'bruchteil-zaehler-vergessen'], [(g + 1) * 100 - Z_ * mal, 'sach-frage-verfehlt']]),
        h1(`Ein Teil sind 100 : ${n} Kästchen. Der Zähler sagt, wie viele solche Teile du brauchst.`), { nachweis: [`${br(Z_, n)} von 100 = ${Z_ * mal}`] }); },
    () => { const n = wahl([120, 150, 160, 180, 200]), e = wahl([5, 10, 20].filter((x) => n % x === 0)), k = zz(2, n / e - 2) * e, j = zz(1, 3) * e, kn = kind();
      if (k + j >= n) return null;
      return bruch(`Ein Mosaik hat ${n} gleich große Steine. ${kn} hat schon ${k} Steine gelegt und legt heute noch ${j} dazu. Welcher Bruchteil des Mosaiks fehlt dann noch?`, br(n - k - j, n), [[br(k + j, n), 'sach-frage-verfehlt'], [br(n - k, n), 'sach-schritt-vergessen'], [br(n - k - j, k + j), 'bruch-teil-zu-rest']],
        h1('Rechne zuerst aus, wie viele Steine am Ende fehlen. Der Nenner ist die Zahl aller Steine.'), { nachweis: [`${n} − ${k} − ${j} = ${n - k - j}`, `${n - k - j} : ${n} = ${br(n - k - j, n)}`] }); },
    () => { const [n, m] = wahl([[4, 3], [3, 2], [5, 2], [6, 2], [3, 4]]), k = zz(1, n - 1), z = n + k, kn = kind(), stimmt = wahl([true, false, false]);
      const gesagt = stimmt ? br(m * z, m * n) : br(z, 2 * n), beh = `${br(z, n)} = ${gesagt}`;
      return auswahl(`Jeder Kreis ist ein Ganzes, gefärbt ist ${br(z, n)}. ${kn} sagt: „Das ist genauso viel wie ${gesagt}.“ Stimmt das?`,
        [opt('Stimmt.', stimmt, stimmt ? undefined : 'bruch-ganzes-teil'), opt(`Falsch. Es gilt ${br(z, n)} > ${gesagt}.`, !stimmt, stimmt ? 'erweitern-nur-ein-teil' : undefined), opt(`Falsch. Es gilt ${br(z, n)} < ${gesagt}.`, false, 'bruch-nenner-groesse')],
        h1('Stell dir vor, jedes Teil wird noch einmal geteilt. Wie ändern sich dann Zähler und Nenner?'),
        { bild: bild(fig('kreis', n, vorn(z), { ganze: 2 })), nachweis: [{ art: 'urteil', stimmt, behauptung: beh }] }); },
    () => { const n = wahl([12, 16, 18, 20]), k = wahl(vorn(n - 6, 3)), [a, c] = mische([2, 3, 4, 5, 6].filter((x) => n % x === 0)).slice(0, 2);
      if (!a || !c || k % a === 0 || k % c === 0) return null;
      return zahl(`Ein Streifen hat ${n} gleich große Teile. ${br(1, a)} des Streifens ist rot und ${br(1, c)} ist blau gefärbt, kein Teil hat zwei Farben. Wie viele Teile sind weiß?`, n - n / a - n / c, fehlerliste(n - n / a - n / c, [[n / a + n / c, 'sach-frage-verfehlt'], [n - n / a, 'sach-schritt-vergessen'], [n - a - c, 'bruchteil-zaehler-vergessen']]),
        h1('Rechne beide Bruchteile in Teile des Streifens um. Ziehe beide von allen Teilen ab.'), { nachweis: [`${br(1, a)} von ${n} = ${n / a}`, `${br(1, c)} von ${n} = ${n / c}`, `${n} − ${n / a} − ${n / c} = ${n - n / a - n / c}`] }); },
    () => { const n = wahl([4, 5, 6, 8]), g = zz(2, 3), k = zz(1, n - 1), z = g * n + k;
      return zahl(`Jeder Kreis ist in ${n} gleich große Teile geteilt. Du sollst ${br(z, n)} färben. Wie viele Kreise brauchst du mindestens?`, g + 1, fehlerliste(g + 1, [[g, 'gemischt-umwandeln'], [z, 'bruch-ganzes-teil'], [k, 'gemischt-umwandeln']]),
        h1(`Wie viele Kreise werden ganz voll? Für die übrigen Teile brauchst du noch einen weiteren Kreis.`), { nachweis: [{ art: 'ganze', bruch: br(z, n), zahl: g }, `${g} + 1 = ${g + 1}`] }); },
  ]);

  // ================= B2: gemischte Zahl und Bruch umwandeln =================
  const tB2 = h3('Ein voller Kreis ist ein Ganzes. Zähle die vollen Kreise. Schau dann auf den Rest.', 'Ein voller Kreis und 1 von 4 Teilen: Das ist 1 1⁄4.', 'Schreibe zuerst die Ganzen. Schreibe dahinter den Bruch für den Rest.');
  sechs(B2, 'F', [
    () => { const n = wahl([2, 3, 4, 5]), k = zz(1, n - 1);
      return auswahl(Z('Jeder Kreis ist ein Ganzes.', 'Welche gemischte Zahl passt zum Bild?'), [opt(br(k, n, 1), true), opt(br(n + k, 2 * n), false, 'ganzes-mehrere-figuren'), opt(br(1, n, k === 1 ? 2 : k), false)], tB2,
        { bild: bild(fig('kreis', n, vorn(n + k), { ganze: 2 })), nachweis: [NBW(br(k, n, 1)), WERT(br(k, n, 1), true)] }); },
    () => { const n = wahl([[1, 2], [1, 3], [2, 2], [1, 4], [1, 5]]), N = anz(n), g = zz(1, 2), k = zz(1, N - 1);
      return bruch(Z('Jedes Rechteck ist ein Ganzes.', 'Wie viel ist gefärbt?', 'Schreibe als gemischte Zahl.'), br(k, N, g), [[br(g * N + k, (g + 1) * N), 'ganzes-mehrere-figuren'], [br(N, k, g), 'bruch-vertauscht']], tB2,
        { form: 'gemischt', bild: bild(fig('rechteck', n, vorn(g * N + k), { ganze: g + 1 })), nachweis: [NBW(br(k, N, g))] }); },
    () => { const n = wahl([2, 3, 4, 5]), k = zz(1, n - 1);
      return luecken(Z('Das Bild zeigt eine gemischte Zahl.', 'Schreibe sie als Bruch.', `${br(k, n, 1)} = {{a}}⁄${n}`), { a: [n + k, fehlerliste(n + k, [[10 + k, 'gemischt-umwandeln'], [1 + k, 'gemischt-umwandeln'], [k, 'gemischt-umwandeln']])] },
        h3('Ein Ganzes hat so viele Teile, wie der Nenner sagt. Zähle alle gefärbten Teile.', '1 1⁄4 sind 4 Viertel und noch 1 Viertel. Das sind 5⁄4.', `Zähle im Bild alle gefärbten Teile. Das ist der Zähler.`),
        { bild: bild(fig('kreis', n, vorn(n + k), { ganze: 2 })), nachweis: [`${br(k, n, 1)} = ${br(n + k, n)}`] }); },
    () => { const n = wahl([2, 3, 4, 5]), g = zz(1, 2), k = zz(1, n - 1), z = g * n + k;
      return bruch(Z('Jeder Kreis ist ein Ganzes.', 'Wie viel ist gefärbt?', 'Schreibe als Bruch.'), br(z, n), [[br(z, (g + 1) * n), 'ganzes-mehrere-figuren'], [br(k, n), 'gemischt-umwandeln']],
        h3('Der Nenner zählt die Teile von einem Kreis. Der Zähler zählt alle gefärbten Teile.', 'Zwei Kreise mit je 4 Teilen. 5 Teile sind gefärbt. Das sind 5⁄4.', 'Zähle alle gefärbten Teile in allen Kreisen. Das ist der Zähler.'),
        { bild: bild(fig('kreis', n, vorn(z), { ganze: g + 1 })), nachweis: [NB(br(z, n))] }); },
    () => { const [form, n] = wahl([['kreis', 2], ['kreis', 3], ['kreis', 4], ['rechteck', [1, 4]], ['rechteck', [1, 5]]]), N = anz(n), k = zz(1, N - 1);
      return faerben(Z(`${GANZE[form]} ist ein Ganzes.`, `Färbe ${br(k, N, 1)}.`), leer(form, n, { ganze: 2 }), br(k, N, 1), N + k, [[k, 'gemischt-umwandeln'], [1 + k, 'gemischt-umwandeln']],
        h3('Die 1 vor dem Bruch heißt: ein ganzes Stück. Der Bruch kommt noch dazu.', 'Für 1 1⁄4 färbst du einen ganzen Kreis und noch 1 von 4 Teilen.', `Färbe das erste Ganze voll. Färbe dann ${k} ${k === 1 ? 'Teil' : 'Teile'} im zweiten.`)); },
    () => { const n = wahl([2, 3, 4, 5]), g = zz(2, 3);
      return zahl(Z('Jeder Kreis ist ein Ganzes.', `Im Bild sind ${g} Ganze gefärbt.`, `Wie viele ${n === 2 ? 'Halbe' : n === 3 ? 'Drittel' : n === 4 ? 'Viertel' : 'Fünftel'} sind das?`), g * n, fehlerliste(g * n, [[n, 'gemischt-umwandeln'], [g, 'bruch-ganzes-teil'], [g + n, 'erweitern-addiert']]),
        h3('Zähle alle gefärbten Teile in allen Kreisen.', 'Ein Kreis mit 4 Teilen sind 4 Viertel. Zwei Kreise sind 8 Viertel.', `Ein Kreis hat ${n} Teile. Rechne ${g} · ${n}.`),
        { bild: bild(fig('kreis', n, vorn(g * n), { ganze: g })), nachweis: [{ art: 'bild', was: 'gefaerbt', zahl: g * n }, HILFS(g, 'Anzahl der Kreise')] }); },
  ]);
  const tB2G = h3('Ganze mal Nenner, dann den Zähler dazu: So wird aus der gemischten Zahl ein Bruch.', '2 1⁄3 = 7⁄3, denn 2 · 3 + 1 = 7.', 'Rechne die Ganzen in Bruchteile um. Zähle dann den Zähler dazu.');
  const tB2Gr = h3('Wie oft passt der Nenner in den Zähler? So viele Ganze sind es. Der Rest bleibt als Zähler.', '7⁄3 = 2 1⁄3, denn die 3 passt 2-mal in die 7 und 1 bleibt übrig.', 'Teile den Zähler durch den Nenner. Der Rest ist der neue Zähler.');
  const gz = (stufe) => { const n = stufe === 'G' ? wahl([3, 4, 5, 6, 8, 10]) : stufe === 'M' ? wahl([6, 7, 8, 9, 11, 12, 15, 20, 25]) : wahl([12, 15, 16, 24, 25, 30, 40, 60]), g = stufe === 'G' ? zz(1, 4) : stufe === 'M' ? zz(3, 9) : zz(6, 15), k = zz(1, n - 1); return { n, g, k, z: g * n + k }; };
  sechs(B2, 'G', [
    () => { const { n, g, k, z } = { n: wahl([3, 4, 5, 6]), g: 2, k: 0, z: 0 }, kk = zz(1, n - 1), zz_ = g * n + kk;
      return bruch(Z('Jeder Kreis ist ein Ganzes.', `Schreibe ${br(zz_, n)} als gemischte Zahl.`), br(kk, n, g), [[br(zz_ % 10 || 1, n, Math.floor(zz_ / 10) || 1), 'gemischt-umwandeln'], [br(kk, n, g + 1), 'gemischt-umwandeln']], tB2Gr,
        { form: 'gemischt', bild: bild(fig('kreis', n, vorn(zz_), { ganze: 3 })), nachweis: [`${br(zz_, n)} = ${br(kk, n, g)}`] }); },
    () => { const { n, g, k, z } = gz('G');
      return bruch(Z(`Schreibe ${br(k, n, g)} als Bruch.`), br(z, n), [[br(g * 10 + k, n), 'gemischt-umwandeln'], [br(g + k, n), 'gemischt-umwandeln'], [br(g * k, n), 'gemischt-umwandeln']], tB2G, { nachweis: [`${br(k, n, g)} = ${br(z, n)}`] }); },
    () => { const n = wahl([3, 4, 5, 6]), g = zz(1, 2), k = zz(1, n - 1), z = g * n + k;
      if (g * 10 + k === z || g + k === z) return null;
      return auswahl(Z('Jeder Kreis ist ein Ganzes.', `Welcher Bruch ist genauso groß wie ${br(k, n, g)}?`), [opt(br(z, n), true), opt(br(g * 10 + k, n), false, 'gemischt-umwandeln'), opt(br(g + k, n), false, 'gemischt-umwandeln')], tB2G,
        { bild: bild(fig('kreis', n, vorn(z), { ganze: g + 1 })), nachweis: [`${br(k, n, g)} = ${br(z, n)}`, WERT(br(z, n), true)] }); },
    () => { const n = wahl([2, 3, 4, 5]), g = zz(1, 2), k = zz(1, n - 1), z = g * n + k, form = wahl(['kreis', 'kreis', 'rechteck']);
      return luecken(Z(`${GANZE[form]} ist ein Ganzes.`, 'Schreibe auf zwei Arten.', `${br(z, n)} = {{g}} + {{k}}⁄${n}`), { g: [g, fehlerliste(g, [[g + 1, 'gemischt-umwandeln']])], k: [k, fehlerliste(k, [[z, 'gemischt-umwandeln']])] }, tB2Gr,
        { bild: bild(fig(form, form === 'kreis' ? n : [1, n], vorn(z), { ganze: g + 1 })), nachweis: [`${br(z, n)} = ${br(k, n, g)}`, { art: 'ganze', bruch: br(z, n), zahl: g }, `${z} − ${g} · ${n} = ${k}`] }); },
    () => { const n = wahl([4, 6, 8]), g = zz(1, 3), k = zz(1, n - 1), z = g * n + k, [was, ganz] = wahl([['Pizza', 'Pizzen'], ['Kuchen', 'Kuchen'], ['Torte', 'Torten']]);
      return bruch(Z(`Jede${was === 'Kuchen' ? 'r' : ''} ${was} hat ${n} gleich große Stücke.`, `Die Gäste essen ${z} Stücke.`, `Wie viele ${ganz} sind das?`, 'Schreibe als gemischte Zahl.'), br(k, n, g), [[br(k, n, g + 1), 'gemischt-umwandeln'], [br(z % 10 || 1, n, Math.floor(z / 10) || 1), 'gemischt-umwandeln']],
        h3('Die Stücke sind Bruchteile. Der Nenner ist die Zahl der Stücke in einem Ganzen.', '7 Stücke von Pizzen mit je 4 Stücken sind 7⁄4 = 1 3⁄4 Pizzen.', `Wie oft passt die ${n} in die ${z}? Das sind die Ganzen. Der Rest bleibt als Zähler.`),
        { form: 'gemischt', nachweis: [`${br(z, n)} = ${br(k, n, g)}`] }); },
    () => { const { n, g, k, z } = gz('G'), stimmt = wahl([true, false, false]), kn = kind(), falle = g * 10 + k, gesagt = stimmt ? z : falle, glg = (w) => `${br(k, n, g)} = ${br(w, n)}`;
      if (falle === z || g + k === z || g + k === falle) return null;
      return auswahl(Z(`${kn} rechnet: ${glg(gesagt)}`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'gemischt-umwandeln'), opt(`Falsch. Es gilt ${glg(stimmt ? falle : z)}.`, !stimmt, stimmt ? 'gemischt-umwandeln' : undefined), opt(`Falsch. Es gilt ${glg(g + k)}.`, false, 'gemischt-umwandeln')], tB2G,
        { nachweis: [{ art: 'urteil', stimmt, behauptung: glg(gesagt) }] }); },
  ]);
  const tB2M = h2('Gemischte Zahl in Bruch: Ganze mal Nenner plus Zähler. Bruch in gemischte Zahl: Zähler durch Nenner teilen, der Rest bleibt als Zähler.', 'Schreibe die Rechnung auf: Wie oft passt der Nenner in den Zähler?');
  sechs(B2, 'M', [
    () => { const { n, g, k, z } = gz('M');
      return bruch(`Schreibe ${br(z, n)} als gemischte Zahl.`, br(k, n, g), [[br(k, n, g + 1), 'gemischt-umwandeln'], [br(k, n, g - 1), 'gemischt-umwandeln']], h2('Wie oft passt der Nenner in den Zähler? So viele Ganze sind es.', `Die ${n} passt ${g}-mal in die ${z}, und ${k} ${k === 1 ? 'bleibt' : 'bleiben'} übrig. Die ${g} sind die Ganzen, der Rest bleibt als Zähler.`),
        { form: 'gemischt', nachweis: [`${br(z, n)} = ${br(k, n, g)}`] }); },
    () => { const { n, g, k, z } = gz('M');
      return bruch(`Schreibe ${br(k, n, g)} als Bruch.`, br(z, n), [[br(g * 10 + k, n), 'gemischt-umwandeln'], [br(g + k, n), 'gemischt-umwandeln'], [br(g * n, n), 'sach-schritt-vergessen']], h2('Rechne die Ganzen in Bruchteile um: Ein Ganzes hat so viele Teile, wie der Nenner sagt.', `Rechne ${g} · ${n} + ${k} = ${z}. Das ist der neue Zähler.`),
        { nachweis: [`${br(k, n, g)} = ${br(z, n)}`] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), liste = [];
      for (const [g, k] of mische([[1, 1], [2, 1], [1, n - 1], [2, n - 1], [3, 1], [1, 2]])) { const x = wahl([true, false]) ? [g * n + k, n, 0] : [k, n, g]; if (k < n && !liste.some((y) => y[0] + y[2] * y[1] === x[0] + x[2] * x[1])) liste.push(x); }
      if (liste.length < 4) return null;
      const karten = liste.slice(0, 4).sort((a, c) => (a[0] + a[2] * a[1]) - (c[0] + c[2] * c[1]));
      if (!karten.some((x) => x[2]) || karten.every((x) => x[2])) return null;
      return ordnen('Ordne die Zahlen. Beginne mit der kleinsten.', karten.map(b2), h2('Wandle alle Zahlen in dieselbe Schreibweise um, zum Beispiel alle in Brüche.', `Alle Zahlen haben den Nenner ${n}. Vergleiche dann nur noch die Zähler.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'gemischt-umwandeln' }); },
    () => { const { n, g, k, z } = gz('M');
      return zahl(`Zwischen welchen beiden natürlichen Zahlen liegt ${br(z, n)}? Gib die kleinere der beiden Zahlen an.`, g, fehlerliste(g, [[g + 1, 'sach-frage-verfehlt'], [k, 'gemischt-umwandeln'], [Math.floor(z / 10), 'gemischt-umwandeln']]),
        h2('Wandle den Bruch in eine gemischte Zahl um. Die Ganzen sagen dir, wo die Zahl liegt.', `Die ${n} passt ${g}-mal in die ${z}. Die Zahl liegt also zwischen ${g} und ${g + 1}.`), { nachweis: [{ art: 'ganze', bruch: br(z, n), zahl: g }] }); },
    () => { const n = wahl([6, 8, 12]), kinder = zz(4, 9), je = zz(2, 3), z = kinder * je, g = Math.floor(z / n), k = z % n, [was, ganz] = wahl([['Pizza', 'Pizzen'], ['Blechkuchen', 'Blechkuchen']]);
      if (k === 0 || g === 0) return null;
      return bruch(`Eine ${was === 'Pizza' ? 'Pizza' : 'Platte Blechkuchen'} hat ${n} gleich große Stücke. ${kinder} Kinder essen je ${je} Stücke. Wie viele ${was === 'Pizza' ? ganz : 'Platten'} sind das zusammen? Schreibe als gemischte Zahl.`, br(k, n, g), [[br(k, n, g + 1), 'gemischt-umwandeln'], [br(je, n, kinder), 'sach-falsche-rechnung']],
        h2('Rechne zuerst aus, wie viele Stücke gegessen werden. Die Stücke sind Bruchteile mit dem Nenner der Stückzahl.', `Es sind ${kinder} · ${je} = ${z} Stücke, also ${br(z, n)}. Teile ${z} durch ${n}.`), { form: 'gemischt', nachweis: [`${kinder} · ${je} = ${z}`, `${br(z, n)} = ${br(k, n, g)}`] }); },
    () => { const roh = [];
      for (let i = 0; i < 4; i++) { const { n, g, k, z } = gz('M'), stimmt = i < 2 ? i === 0 : wahl([true, false]), falsch = wahl([g * 10 + k, z + n, z - 1].filter((x) => x !== z)); roh.push([`${br(k, n, g)} = ${br(stimmt ? z : falsch, n)}`, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', mische(roh).map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-umwandeln')), h2('Rechne bei jeder Gleichung nach: Ganze mal Nenner plus Zähler.', 'Prüfe jede Gleichung einzeln und kreuze nur die an, bei denen der Zähler stimmt.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
  sechs(B2, 'E', [
    () => { const { n, g, k, z } = gz('E');
      return bruch(`Schreibe ${br(z, n)} als gemischte Zahl.`, br(k, n, g), [[br(k, n, g + 1), 'gemischt-umwandeln'], [br(k, n, g - 1), 'gemischt-umwandeln']], h1('Teile den Zähler durch den Nenner. Das Ergebnis sind die Ganzen, der Rest bleibt als Zähler.'), { form: 'gemischt', nachweis: [`${br(z, n)} = ${br(k, n, g)}`] }); },
    () => { const n = wahl([6, 7, 8, 9, 12, 15]), q = zz(6, 14);
      return zahl(`Der Scheinbruch ${br(q * n, n)} ist eine natürliche Zahl. Welche?`, q, fehlerliste(q, [[q * n, 'bruch-ganzes-teil'], [q - 1, 'div-einmaleins'], [q + 1, 'div-einmaleins']]), h1('Ein Bruchstrich ist auch ein Geteiltzeichen. Teile den Zähler durch den Nenner.'), { nachweis: [`${br(q * n, n)} = ${q}`] }); },
    () => { const { n, g, k, z } = gz('E');
      return luecken(`Welcher Zähler fehlt? {{a}}⁄${n} = ${br(k, n, g)}`, { a: [z, fehlerliste(z, [[g * 10 + k, 'gemischt-umwandeln'], [g + k, 'gemischt-umwandeln'], [g * n, 'sach-schritt-vergessen']])] }, h1('Rechne die Ganzen in Bruchteile um und zähle den Zähler dazu.'), { nachweis: [`${br(k, n, g)} = ${br(z, n)}`] }); },
    () => { const n1 = wahl([4, 5, 6]), n2 = wahl([3, 8, 10].filter((x) => x !== n1)), g = zz(2, 5), roh = [[n1 - 1, n1, g], [g * n1 + 1, n1, 0], [(g + 1) * n2 - 1, n2, 0], [1, n2, g + 1], [n2 - 1, n2, g - 1]];
      const werte = roh.map((x) => (x[0] + x[2] * x[1]) / x[1]), gross = wahl([true, false]), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      if (new Set(werte).size !== werte.length) return null;
      return auswahl(`Welche Zahl ist am ${gross ? 'größten' : 'kleinsten'}?`, roh.map((x, i) => opt(b2(x), werte[i] === ziel)), h1('Wandle alle Zahlen in gemischte Zahlen um. Vergleiche zuerst die Ganzen.'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const n = wahl([6, 8, 12]), g = zz(2, 6), roh = mische([[1, n, g], [g * n + 3, n, 0], [n - 1, n, g - 1], [g * n + n + 1, n, 0], [5, n, g]]);
      const karten = roh.sort((a, c) => (a[0] + a[2] * a[1]) - (c[0] + c[2] * c[1]));
      if (new Set(karten.map((x) => x[0] + x[2] * x[1])).size !== 5) return null;
      return ordnen('Ordne die Zahlen. Beginne mit der größten.', karten.reverse().map(b2), h1('Schreibe alle Zahlen als Brüche mit demselben Nenner. Dann zählen nur noch die Zähler.'), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'gemischt-umwandeln' }); },
    () => { const n = wahl([5, 6, 7, 8, 9, 12]), g = zz(2, 9), anzahl = n - 1;
      return zahl(`Ein Bruch hat den Nenner ${n} und liegt zwischen ${g} und ${g + 1}. Er ist keine natürliche Zahl. Wie viele solche Brüche gibt es?`, anzahl, fehlerliste(anzahl, [[n, 'bruchstrahl-striche'], [n + 1, 'bruchstrahl-striche'], [1, 'gemischt-umwandeln']]),
        h1(`Schreibe ${g} und ${g + 1} als Brüche mit dem Nenner ${n}. Welche Zähler liegen dazwischen?`), { nachweis: [`${g} · ${n} = ${g * n}`, `${g + 1} · ${n} = ${(g + 1) * n}`, `${(g + 1) * n} − ${g * n} − 1 = ${anzahl}`] }); },
  ]);
}
