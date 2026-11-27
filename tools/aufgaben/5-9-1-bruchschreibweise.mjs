// Aufgaben zu 5.9.1 „Bruchschreibweise“ (Lernziele B1, B2, B3) nach ADR 0015 und ADR 0036.
// B1: Bruchteile am Bild erkennen und benennen. B2: Bruchteile darstellen und zum Ganzen ergänzen. B3: Brüche vergleichen und ordnen.
// Grilling mit Nils (2026-11-22): F zusammenhängend gefärbt, Nenner 2, 3, 4. G verstreut gefärbt, Falle „ungleich große Teile“, Stammbrüche.
// M zwei Ganze und gemischte Zahlen, selbst einteilen. E gleichwertige Brüche am Bild, „unechter Bruch“. Kein Kürzen, kein Erweitern.

import { sechs, auswahl, luecken, zahl, ordnen, strahl, bruch, faerben, B, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, streu, fig, leer, benenne, bild, anz, NB, NBW, WERT, FREI, falscheOpt, falscheFehler, FORM, BRUCHWORT, sortiere, br, opt, zz, wahl, mische } from './5-9-brueche.mjs';

const B1 = '5.9.1-B1', B2 = '5.9.1-B2', B3 = '5.9.1-B3';
const ZEICHEN = (l, r) => [opt('<', l[0] * r[1] < r[0] * l[1], 'zeichen-verwechselt'), opt('>', l[0] * r[1] > r[0] * l[1], 'zeichen-verwechselt'), opt('=', l[0] * r[1] === r[0] * l[1])].map((o) => (o.richtig ? opt(o.text, true) : o));
const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
const b2 = ([z, n]) => br(z, n);
const ist = (k) => (k === 1 ? 'ist' : 'sind');
const figurOpt = (figuren, richtig, fv = () => undefined) => figuren.map((f, i) => opt(`Figur ${f.n}`, richtig(f, i), richtig(f, i) ? undefined : fv(f, i)));

export function bruchschreibweise() {
  // ================= B1: Bruchteile erkennen und benennen =================
  const tB1 = h3('Zähle alle Teile: Das ist der Nenner. Zähle die gefärbten Teile: Das ist der Zähler.', 'Von 2 gleich großen Teilen ist 1 Teil gefärbt. Der Bruch heißt 1⁄2.', 'Schreibe die Zahl der gefärbten Teile über den Bruchstrich. Schreibe die Zahl aller Teile darunter.');
  const kn = (stufe) => { const n = stufe === 'F' ? zz(2, 4) : stufe === 'G' ? wahl([5, 6, 8, 10]) : wahl([6, 8, 9, 10, 12]); return [zz(1, n - 1), n]; };
  sechs(B1, 'F', [
    () => { const [k, n] = kn('F');
      return auswahl(Z('Der Kreis ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?'), [opt(br(k, n), true), ...falscheOpt('F', k, n)], tB1, { bild: bild(fig('kreis', n, vorn(k))), nachweis: [NB(br(k, n)), WERT(br(k, n))] }); },
    () => { const n = wahl([[1, 2], [1, 3], [1, 4], [2, 2]]), N = anz(n), k = zz(1, N - 1);
      return bruch(Z('Das Rechteck ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?', 'Schreibe den Bruch.'), br(k, N), falscheFehler(k, N), tB1, { bild: bild(fig('rechteck', n, vorn(k))), nachweis: [NB(br(k, N))] }); },
    () => { const n = zz(3, 4), k = zz(1, n - 1), form = wahl(['streifen', 'kreis']);
      return luecken(Z(`${FORM[form][0]} hat {{a}} gleich große Teile.`, '{{b}} Teile davon sind gefärbt.'), { a: [n, fehlerliste(n, [[n - k, 'bruch-teil-zu-rest']])], b: [k, fehlerliste(k, [[n, 'bruch-vertauscht']])] },
        h3('Zähle zuerst alle Teile. Zähle dann nur die gefärbten Teile.', 'Ein Streifen hat 2 Teile. 1 Teil ist gefärbt.', 'Alle Teile zählen mit: die gefärbten und die weißen.'),
        { bild: bild(fig(form, n, vorn(k))), nachweis: [{ art: 'bild', was: 'teile', zahl: n }, { art: 'bild', was: 'gefaerbt', zahl: k }] }); },
    () => { const [k, n] = kn('F'), [frage, richtig] = wahl([['Wie heißt die Zahl unter dem Bruchstrich?', 'Nenner'], ['Wie heißt die Zahl über dem Bruchstrich?', 'Zähler'], ['Welche Zahl nennt alle Teile des Ganzen?', 'Nenner'], ['Welche Zahl zählt die gefärbten Teile?', 'Zähler']]);
      return auswahl(Z(`Im Bild ${ist(k)} ${br(k, n)} gefärbt.`, frage), ['Zähler', 'Nenner', 'Bruchstrich'].map((w) => opt(w, w === richtig, w === richtig || w === 'Bruchstrich' ? undefined : 'bruch-vertauscht')),
        h3('Der Nenner steht unten. Der Zähler steht oben.', 'Im Bruch 1⁄2 ist 1 der Zähler und 2 der Nenner.', 'Der Nenner nennt alle Teile. Der Zähler zählt die gefärbten Teile.'),
        { bild: bild(fig(wahl(['kreis', 'streifen']), n, vorn(k))), nachweis: [NB(br(k, n)), FREI('Begriffe Zähler und Nenner')] }); },
    () => { const [k, n] = wahl([[1, 4], [1, 3], [1, 2], [3, 4], [2, 3]]), k2 = k === 1 ? (n > 2 ? 2 : 0) : 1;
      const figuren = benenne(mische([fig('kreis', n, vorn(k), { rolle: 'r' }), fig('kreis', n + k, vorn(k), { rolle: 'rest' }), fig('kreis', n === 2 ? 4 : n, vorn(n === 2 ? 1 : k2), { rolle: 'f' })])), rollen = figuren.map((f) => f.rolle);
      figuren.forEach((f) => delete f.rolle);
      return auswahl(Z(`In welcher Figur ist ${br(k, n)} gefärbt?`), figurOpt(figuren, (f, i) => rollen[i] === 'r', (f, i) => (rollen[i] === 'rest' ? 'bruch-teil-zu-rest' : undefined)),
        h3('Zähle bei jeder Figur alle Teile. Das ist der Nenner.', 'Bei 1⁄2 hat die Figur 2 Teile. 1 Teil ist gefärbt.', `Suche die Figur mit ${n} gleich großen Teilen. Davon ${k === 1 ? 'ist 1 Teil' : `sind ${k} Teile`} gefärbt.`),
        { bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(k, n) }] }); },
    () => { const [k, n] = kn('F');
      return auswahl(Z('Alle Kugeln zusammen sind das Ganze.', 'Welcher Bruchteil der Kugeln ist gefärbt?'), [opt(br(k, n), true), ...falscheOpt('F', k, n)],
        h3('Zähle alle Kugeln: Das ist der Nenner. Zähle die gefärbten Kugeln: Das ist der Zähler.', 'Von 2 Kugeln ist 1 Kugel gefärbt. Der Bruch heißt 1⁄2.', 'Schreibe die Zahl der gefärbten Kugeln über den Bruchstrich. Schreibe die Zahl aller Kugeln darunter.'),
        { bild: bild(fig('menge', n, vorn(k))), nachweis: [NB(br(k, n)), WERT(br(k, n))] }); },
  ]);
  const tB1G = h3('Die gefärbten Teile müssen nicht nebeneinander liegen. Zähle sie einzeln.', 'Von 6 gleich großen Teilen sind 5 Teile gefärbt. Der Bruch heißt 5⁄6.', 'Zähle alle Teile für den Nenner. Zähle die gefärbten Teile für den Zähler.');
  sechs(B1, 'G', [
    () => { const [k, n] = kn('G'), nn = Math.min(n, 8), kk = Math.min(k, nn - 1);
      return bruch(Z('Der Kreis ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?'), br(kk, nn), falscheFehler(kk, nn), tB1G, { bild: bild(fig('kreis', nn, streu(nn, kk))), nachweis: [NB(br(kk, nn))] }); },
    () => { const [form, n] = wahl([['streifen', 5], ['streifen', 8], ['streifen', 10], ['rechteck', [2, 3]], ['rechteck', [2, 4]], ['rechteck', [2, 5]]]), N = anz(n), k = zz(2, N - 2);
      return auswahl(Z(`${FORM[form][0]} ist in gleich große Teile geteilt.`, 'Welcher Bruchteil ist gefärbt?'), [opt(br(k, N), true), ...falscheOpt('G', k, N)], tB1G, { bild: bild(fig(form, n, streu(N, k))), nachweis: [NB(br(k, N)), WERT(br(k, N))] }); },
    () => { const [k, n] = wahl([[1, 3], [1, 4], [2, 4], [1, 2], [2, 3], [3, 4]]), form = wahl(['kreis', 'kreis', 'rechteck']), N = (x) => (form === 'rechteck' ? [1, x] : x);
      const roh = mische([[fig(form, N(n), streu(n, k)), 'r'], [fig(form, N(n), streu(n, k), { ungleich: true }), 'ungleich'], [fig(form, N(n + k), streu(n + k, k)), 'rest']]);
      const figuren = benenne(roh.map(([f]) => f)), rollen = roh.map(([, r]) => r);
      return auswahl(Z(`In welcher Figur ist ${br(k, n)} gefärbt?`, 'Achte auf gleich große Teile.'), figurOpt(figuren, (f, i) => rollen[i] === 'r', (f, i) => (rollen[i] === 'rest' ? 'bruch-teil-zu-rest' : 'bruch-ungleiche-teile')),
        h3('Ein Bruch braucht gleich große Teile. Schau genau hin.', 'Ein Kreis hat 2 Teile, aber ein Teil ist viel größer. Dann ist kein Teil 1⁄2.', 'Streiche zuerst die Figur mit ungleich großen Teilen. Zähle dann bei den anderen alle Teile.'),
        { bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(k, n) }] }); },
    () => { const [k, n] = kn('G');
      return luecken(Z(`Schau auf den Bruch ${br(k, n)}.`, 'Der Zähler ist {{a}}.', 'Der Nenner ist {{b}}.'), { a: [k, fehlerliste(k, [[n, 'bruch-vertauscht']])], b: [n, fehlerliste(n, [[k, 'bruch-vertauscht']])] },
        h3('Der Zähler steht über dem Bruchstrich. Der Nenner steht darunter.', 'Im Bruch 5⁄6 ist 5 der Zähler und 6 der Nenner.', 'Lies zuerst die obere Zahl. Das ist der Zähler.'),
        { nachweis: [{ art: 'teil', bruch: br(k, n), was: 'zaehler', zahl: k }, { art: 'teil', bruch: br(k, n), was: 'nenner', zahl: n }] }); },
    () => { const n = wahl([5, 6, 8, 10]), k = wahl(vorn(n - 1, 1).filter((x) => 2 * x !== n)), form = wahl(['kreis', 'streifen']), nn = form === 'kreis' ? Math.min(n, 8) : n, kk = Math.min(k, nn - 1);
      if (2 * kk === nn) return null;
      return bruch(Z(`${FORM[form][0]} ist in gleich große Teile geteilt.`, 'Welcher Bruchteil ist weiß?'), br(nn - kk, nn), [[br(kk, nn), 'sach-frage-verfehlt'], [br(nn, nn - kk), 'bruch-vertauscht']],
        h3('Gefragt ist nach den weißen Teilen. Zähle sie für den Zähler.', 'Von 6 Teilen ist 1 Teil gefärbt. Dann sind 5⁄6 weiß.', 'Der Nenner bleibt die Zahl aller Teile. Der Zähler ist die Zahl der weißen Teile.'),
        { bild: bild(fig(form, nn, streu(nn, kk))), nachweis: [NB(br(nn - kk, nn), { rest: true })] }); },
    () => { const [k, n] = wahl([[3, 4], [1, 4], [2, 4], [1, 2]]);
      const roh = mische([[fig('kreis', n === 2 ? 2 : 4, streu(n === 2 ? 2 : 4, k)), true], [fig('rechteck', n === 2 ? [1, 2] : [2, 2], streu(n, k)), true], [fig('kreis', n, streu(n, k), { ungleich: true }), false, 'bruch-ungleiche-teile'], [fig('rechteck', [1, n + k], streu(n + k, k)), false, 'bruch-teil-zu-rest']]);
      const figuren = benenne(roh.map(([f]) => f));
      return auswahl(Z(`In welchen Figuren ist ${br(k, n)} gefärbt?`, 'Kreuze alle passenden Figuren an.'), figuren.map((f, i) => opt(`Figur ${f.n}`, roh[i][1], roh[i][2])),
        h3('Die Form ist egal. Wichtig sind gleich große Teile und ihre Anzahl.', 'Ein Kreis und ein Rechteck können beide 1⁄2 zeigen.', 'Prüfe jede Figur einzeln: Sind die Teile gleich groß? Wie viele Teile sind es?'),
        { mehrfach: true, bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(k, n) }] }); },
  ]);
  const tB1M = h2('Zähle zuerst die Teile eines Ganzen: Das ist der Nenner. Zähle dann alle gefärbten Teile.', 'Schreibe die Zahl der gefärbten Teile über den Bruchstrich und die Zahl der Teile eines Ganzen darunter.');
  sechs(B1, 'M', [
    () => { const n = wahl([[3, 4], [2, 5], [2, 6], [3, 3], [2, 4]]), N = anz(n), k = zz(2, N - 2);
      return bruch(Z('Das Rechteck ist in gleich große Teile geteilt.', 'Welcher Bruchteil ist gefärbt?'), br(k, N), falscheFehler(k, N), tB1M, { bild: bild(fig('rechteck', n, streu(N, k))), nachweis: [NB(br(k, N))] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), k = zz(1, n - 1);
      return bruch(Z('Jeder Kreis ist ein Ganzes.', 'Wie viel ist gefärbt? Schreibe als gemischte Zahl.'), br(k, n, 1), [[br(n + k, 2 * n), 'bruch-ganzes-teil'], [br(n, k, 1), 'bruch-vertauscht']],
        h2('Ein Kreis ist ganz gefärbt: Das ist 1 Ganzes. Welcher Bruchteil ist im zweiten Kreis gefärbt?', 'Schreibe zuerst die Ganzen und dahinter den Bruchteil des zweiten Kreises.'),
        { bild: bild(fig('kreis', n, vorn(n + k), { ganze: 2 })), nachweis: [NBW(br(k, n, 1))] }); },
    () => { const [form, n] = wahl([['rechteck', [2, 2]], ['kreis', 3], ['kreis', 5], ['rechteck', [2, 3]], ['kreis', 4]]), N = anz(n), k = zz(1, N - 1), z = N + k;
      return auswahl(Z(`${form === 'kreis' ? 'Jeder Kreis' : 'Jedes Rechteck'} ist ein Ganzes.`, 'Welcher Bruch gibt an, wie viel gefärbt ist?'),
        [opt(br(z, N), true), opt(br(z, 2 * N), false, 'bruch-ganzes-teil'), opt(br(N, z), false, 'bruch-vertauscht'), opt(br(2 * N - z, N), false)],
        h2('Der Nenner zählt die Teile eines Ganzen, nicht die Teile beider Figuren zusammen.', `Ein Ganzes hat ${N} Teile. Gefärbt sind ${z} Teile.`),
        { bild: bild(fig(form, n, vorn(z), { ganze: 2 })), nachweis: [NB(br(z, N)), WERT(br(z, N))] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), k = zz(1, n - 1), z = n + k;
      return auswahl(Z(`Welche gemischte Zahl ist genauso groß wie ${br(z, n)}?`, 'Das Bild hilft dir.'), [opt(br(k, n, 1), true), opt(br(1, n, k === 1 ? 2 : k), false), opt(br(k, z, 1), false, 'bruch-ganzes-teil'), opt(br(k === n - 1 ? k - 1 || 1 : k + 1, n, k === n - 1 && k === 1 ? 2 : 1), false)],
        h2(`${n} ${BRUCHWORT[n]} sind ein Ganzes. Wie viele ${BRUCHWORT[n]} bleiben dann noch übrig?`, `${br(z, n)} = ${br(n, n)} + ${br(k, n)}. Schreibe das Ganze als 1 und den Rest als Bruch dahinter.`),
        { bild: bild(fig('kreis', n, vorn(z), { ganze: 2 })), nachweis: [`${br(z, n)} = ${br(k, n, 1)}`, WERT(br(k, n, 1))] }); },
    () => { const n = wahl([8, 10, 12]), k = wahl(vorn(n - 3, 2).filter((x) => 2 * x !== n));
      return bruch(Z(`Im Bild siehst du ${n} Kugeln. ${k} Kugeln sind gefärbt.`, 'Welcher Bruchteil der Kugeln ist nicht gefärbt?'), br(n - k, n), [[br(k, n), 'sach-frage-verfehlt'], [br(n - k, k), 'bruch-teil-zu-rest'], [br(n, n - k), 'bruch-vertauscht']],
        h2('Gefragt ist nach den Kugeln, die nicht gefärbt sind. Wie viele sind das?', `Rechne ${n} − ${k} = ${n - k}. Das ist der Zähler, der Nenner bleibt ${n}.`),
        { bild: bild(fig('menge', n, vorn(k))), nachweis: [`${n} − ${k} = ${n - k}`, NB(br(n - k, n), { rest: true })] }); },
    () => { const n = wahl([8, 10, 12]), k = zz(2, 4), j = zz(2, n - k - 2), kn_ = kind();
      return bruch(Z(`Im Streifen sind schon ${k} Teile gefärbt. ${kn_} färbt noch ${j} weitere Teile.`, 'Welcher Bruchteil des Streifens ist dann gefärbt?'), br(k + j, n), [[br(j, n), 'sach-schritt-vergessen'], [br(k + j, n - k - j), 'bruch-teil-zu-rest'], [br(n, k + j), 'bruch-vertauscht']],
        h2('Wie viele Teile sind am Ende gefärbt? Der Nenner bleibt gleich, denn der Streifen hat immer noch gleich viele Teile.', `Rechne ${k} + ${j} = ${k + j}. Das ist der neue Zähler.`),
        { bild: bild(fig('streifen', n, vorn(k))), nachweis: [`${br(k, n)} + ${br(j, n)} = ${br(k + j, n)}`] }); },
  ]);
  sechs(B1, 'E', [
    () => { const [n, k, gleich, falsch] = wahl([[[2, 4], 4, [[4, 8], [2, 4], [1, 2]], [[4, 4], [1, 4]]], [[3, 4], 6, [[6, 12], [3, 6], [1, 2]], [[6, 6], [1, 6]]], [[2, 6], 4, [[4, 12], [2, 6], [1, 3]], [[4, 8], [1, 4]]], [[2, 6], 8, [[8, 12], [4, 6], [2, 3]], [[8, 4], [3, 4]]], [[2, 4], 6, [[6, 8], [3, 4]], [[6, 2], [2, 3], [4, 6]]], [[4, 4], 12, [[12, 16], [6, 8], [3, 4]], [[12, 4], [2, 3]]]]);
      const reihen = n[0], spalten = n[1], gef = vorn(k / reihen).flatMap((c) => vorn(reihen).map((r) => r * spalten + c)).sort((a, b) => a - b);
      return auswahl(Z('Das Rechteck ist in gleich große Teile geteilt.', 'Welche Brüche geben den gefärbten Bruchteil an? Kreuze alle an.'), [...gleich.map((x) => opt(b2(x), true)), opt(b2(falsch[0]), false, 'bruch-teil-zu-rest'), ...falsch.slice(1).map((x) => opt(b2(x), false))],
        h1('Fasse gleich große Teile zu größeren Teilen zusammen, zum Beispiel immer eine ganze Spalte. Dann siehst du gleichwertige Brüche.'),
        { mehrfach: true, bild: bild(fig('rechteck', n, gef)), nachweis: [NB(br(k, anz(n))), WERT(br(k, anz(n)), false)] }); },
    () => { const [ziel, r1, r2, f1, f2] = wahl([[[1, 2], ['kreis', 4, 2], ['rechteck', [2, 3], 3], ['kreis', 6, 2], ['rechteck', [2, 4], 3]], [[1, 3], ['kreis', 6, 2], ['rechteck', [3, 3], 3], ['kreis', 4, 1], ['rechteck', [2, 3], 3]], [[3, 4], ['kreis', 8, 6], ['rechteck', [3, 4], 9], ['kreis', 6, 4], ['rechteck', [2, 4], 7]], [[2, 3], ['kreis', 6, 4], ['rechteck', [3, 4], 8], ['kreis', 8, 6], ['rechteck', [2, 3], 3]]]);
      const roh = mische([[r1, true], [r2, true], [f1, false], [f2, false]]), figuren = benenne(roh.map(([[form, n, k]]) => fig(form, n, streu(anz(n), k))));
      return auswahl(Z(`In welchen Figuren ist ${b2(ziel)} gefärbt?`, 'Kreuze alle passenden Figuren an.'), figuren.map((f, i) => opt(`Figur ${f.n}`, roh[i][1])),
        h1('Ein Bruchteil kann aus mehr und kleineren Teilen bestehen. Vergleiche die gefärbte Fläche mit der ganzen Figur.'),
        { mehrfach: true, bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: b2(ziel) }] }); },
    () => { const [form, n] = wahl([['kreis', 5], ['kreis', 6], ['kreis', 8], ['rechteck', [2, 3]], ['rechteck', [2, 4]]]), N = anz(n), ganze = wahl([2, 3]), k = zz(1, N - 1), z = (ganze - 1) * N + k;
      return bruch(Z(`${form === 'kreis' ? 'Jeder Kreis' : 'Jedes Rechteck'} ist ein Ganzes.`, 'Wie viel ist gefärbt? Schreibe als unechten Bruch.'), br(z, N), [[br(z, ganze * N), 'bruch-ganzes-teil'], [br(N, z), 'bruch-vertauscht']],
        h1('Der Nenner zählt die Teile eines Ganzen. Der Zähler zählt alle gefärbten Teile in allen Figuren.'),
        { bild: bild(fig(form, n, vorn(z), { ganze })), nachweis: [NB(br(z, N))] }); },
    () => { const n = mische([5, 6, 8, 9, 12, 15, 20]).slice(0, 5), wie = mische([1, 1, 0, 0, wahl([0, 1])]);
      return auswahl(Z('Ein unechter Bruch ist größer als 1.', 'Welche Brüche sind unechte Brüche? Kreuze alle an.'), n.map((x, i) => opt(wie[i] ? br(x + zz(1, 4), x) : br(x - zz(1, Math.min(4, x - 2)), x), Boolean(wie[i]), wie[i] ? undefined : 'bruch-vertauscht')),
        h1('Vergleiche Zähler und Nenner: Sind es mehr Teile, als ein Ganzes hat?'), { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '>', wert: '1' }] }); },
    () => { const m = wahl([3, 4, 5, 6, 8]), j = zz(1, m - 1), n = 2 * m;
      return luecken(Z('Immer zwei Teile untereinander gehören zusammen.', `Ergänze: ${br(2 * j, n)} = {{a}} ${BRUCHWORT[m]}`), { a: [j, fehlerliste(j, [[2 * j, 'bruch-teil-zu-rest'], [m, 'bruch-vertauscht']])] },
        h1(`Zwei kleine Teile sind zusammen ein größeres Teil. Wie viele größere Teile hat das ganze Rechteck, und wie viele davon sind gefärbt?`),
        { bild: bild(fig('rechteck', [2, m], vorn(j).flatMap((c) => [c, m + c]).sort((a, b) => a - b))), nachweis: [NB(br(2 * j, n)), `${br(2 * j, n)} = ${j} ${BRUCHWORT[m]}`] }); },
    () => { const m = wahl([3, 4, 5]), j = zz(1, m - 1), stimmt = wahl([true, false]), a = [j, m], b = stimmt ? [2 * j, 2 * m] : [2 * j + wahl([-1, 1]), 2 * m], kn_ = kind();
      return auswahl(`${kn_} sagt: „${b2(a)} und ${b2(b)} sind gleichwertig.“ Stimmt das? Die Figuren helfen dir.`,
        [opt('Stimmt.', stimmt, stimmt ? undefined : 'bruch-nenner-groesse'), opt(`Falsch. Es gilt ${b2(a)} < ${b2(b)}.`, !stimmt && a[0] * b[1] < b[0] * a[1], 'bruch-nenner-groesse'), opt(`Falsch. Es gilt ${b2(a)} > ${b2(b)}.`, !stimmt && a[0] * b[1] > b[0] * a[1], 'bruch-nenner-groesse')].map((o) => (o.richtig ? opt(o.text, true) : o)),
        h1('Vergleiche in beiden Figuren, wie weit die gefärbte Fläche reicht. Die Teile in Figur B sind halb so groß wie in Figur A.'),
        { bild: bild(...benenne([fig('streifen', a[1], vorn(a[0])), fig('streifen', b[1], vorn(b[0]))])), nachweis: [{ art: 'urteil', stimmt, behauptung: `${b2(a)} = ${b2(b)}` }] }); },
  ]);

  // ================= B2: Bruchteile darstellen und zum Ganzen ergänzen =================
  const tB2 = h3('Der Nenner sagt: So viele Teile hat das Ganze. Der Zähler sagt: So viele Teile färbst du.', 'Für 1⁄2 färbst du 1 von 2 Teilen.', 'Lies den Zähler. Färbe genau so viele Teile.');
  const faerbeF = (form, n) => () => { const N = anz(n), k = zz(1, N - 1);
    return faerben(`Färbe ${br(k, N)} ${FORM[form][1]}.`, leer(form, n), br(k, N), k, [[N - k, 'bruch-teil-zu-rest']], tB2); };
  sechs(B2, 'F', [
    faerbeF('streifen', wahl([3, 4])),
    faerbeF('kreis', wahl([3, 4])),
    () => faerbeF('rechteck', wahl([[1, 3], [2, 2], [1, 4]]))(),
    () => { const [k, n] = wahl([[1, 3], [2, 3], [1, 4], [3, 4]]), form = wahl(['kreis', 'streifen']);
      return auswahl(Z(`${FORM[form][2]} ${ist(k)} ${br(k, n)} gefärbt.`, 'Welcher Bruchteil fehlt bis zum Ganzen?'), [opt(br(n - k, n), true), opt(br(k, n), false, 'sach-frage-verfehlt'), ...falscheOpt('F', n - k, n).filter((o) => o.text !== br(k, n))],
        h3('Das Ganze sind alle Teile zusammen. Zähle die weißen Teile.', 'Ist 1⁄2 gefärbt, dann fehlt noch 1⁄2 bis zum Ganzen.', 'Der Nenner bleibt gleich. Der Zähler ist die Zahl der weißen Teile.'),
        { bild: bild(fig(form, n, vorn(k))), nachweis: [NB(br(k, n)), NB(br(n - k, n), { rest: true }), WERT(br(n - k, n))] }); },
    () => { const [z, n, N] = wahl([[1, 2, 4], [1, 2, 6], [1, 2, 8], [1, 3, 6], [1, 4, 8], [1, 3, 9]]);
      return faerben(Z('Alle Kugeln zusammen sind das Ganze.', `Färbe ${br(z, n)} der Kugeln.`), leer('menge', N), br(z, n), N / n, [[1, 'bruch-ganzes-teil'], [n, 'bruch-vertauscht']],
        h3('Teile die Kugeln zuerst gerecht in gleich große Gruppen auf.', 'Für 1⁄2 von 2 Kugeln färbst du 1 Kugel.', `Bilde ${n} gleich große Gruppen. Färbe eine Gruppe.`)); },
    () => { const n = zz(3, 4), k = zz(1, n - 1), form = wahl(['kreis', 'streifen']);
      return luecken(Z(`${FORM[form][2]} ${ist(k)} ${k} ${BRUCHWORT[n]} gefärbt.`, `Bis zum Ganzen fehlen noch {{a}} ${BRUCHWORT[n]}.`), { a: [n - k, fehlerliste(n - k, [[k, 'sach-frage-verfehlt'], [n, 'bruch-ganzes-teil']])] },
        h3('Zähle die weißen Teile im Bild.', '2 Halbe sind ein Ganzes. Ist 1 Halbes gefärbt, fehlt noch 1 Halbes.', `Ein Ganzes hat ${n} ${BRUCHWORT[n]}. Wie viele davon sind noch weiß?`),
        { bild: bild(fig(form, n, vorn(k))), nachweis: [{ art: 'bild', was: 'weiss', zahl: n - k }] }); },
  ]);
  const tB2G = h3('Der Nenner nennt alle Teile. Der Zähler sagt, wie viele Teile du färbst.', 'Für 5⁄6 färbst du 5 von 6 Teilen.', 'Welche Teile du färbst, ist egal. Nur die Anzahl muss stimmen.');
  sechs(B2, 'G', [
    () => { const n = wahl([5, 6, 8]), k = zz(2, n - 1); return faerben(`Färbe ${br(k, n)} des Kreises.`, leer('kreis', n), br(k, n), k, [[n - k, 'bruch-teil-zu-rest']], tB2G); },
    () => { const n = wahl([8, 10]), k = zz(3, n - 1); return faerben(`Färbe ${br(k, n)} des Streifens.`, leer('streifen', n), br(k, n), k, [[n - k, 'bruch-teil-zu-rest']], tB2G); },
    () => { const n = wahl([5, 6, 8, 10]), k = wahl(vorn(n - 1, 1).filter((x) => 2 * x !== n)), form = n <= 8 ? wahl(['kreis', 'streifen']) : 'streifen';
      return bruch(Z(`${FORM[form][2]} ${ist(k)} ${br(k, n)} gefärbt.`, 'Welcher Bruchteil fehlt bis zum Ganzen?'), br(n - k, n), [[br(k, n), 'sach-frage-verfehlt'], [br(n, n - k), 'bruch-vertauscht']],
        h3('Das Ganze sind alle Teile zusammen. Zähle die weißen Teile.', 'Sind 5⁄6 gefärbt, dann fehlt noch 1⁄6 bis zum Ganzen.', 'Der Nenner bleibt gleich. Der Zähler ist die Zahl der weißen Teile.'),
        { bild: bild(fig(form, n, vorn(k))), nachweis: [NB(br(n - k, n), { rest: true })] }); },
    () => { const n = wahl([[2, 3], [2, 4], [2, 5]]), N = anz(n), k = zz(2, N - 1); return faerben(`Färbe ${br(k, N)} des Rechtecks.`, leer('rechteck', n), br(k, N), k, [[N - k, 'bruch-teil-zu-rest']], tB2G); },
    () => { const n = wahl([6, 8, 10]), k = zz(4, n - 1), j = zz(1, k - 2);
      return zahl(Z(`Es sollen ${br(k, n)} des Streifens gefärbt sein.`, 'Wie viele Teile musst du noch färben?'), k - j, fehlerliste(k - j, [[k, 'sach-schritt-vergessen'], [n - j, 'bruch-teil-zu-rest'], [n - k, 'sach-frage-verfehlt']]),
        h3('Der Zähler sagt, wie viele Teile am Ende gefärbt sind. Zähle die Teile, die schon gefärbt sind.', 'Für 5⁄6 brauchst du 5 gefärbte Teile. Sind schon 2 gefärbt, fehlen noch 3.', `Am Ende sind ${k} Teile gefärbt. Ziehe die schon gefärbten Teile ab.`),
        { einheit: 'Teile', bild: bild(fig('streifen', n, vorn(j))), nachweis: [{ art: 'teil', bruch: br(k, n), was: 'zaehler', zahl: k }, { art: 'bild', was: 'gefaerbt', zahl: j }, `${k} − ${j} = ${k - j}`] }); },
    () => { const n = wahl([5, 6, 8, 10]), k = wahl(vorn(n - 3, 2).filter((x) => 2 * x !== n)), stimmt = wahl([true, false]), x = stimmt ? n - k : wahl([k, n - k - 1, n - k + 1].filter((y) => y >= 1 && y !== n - k)), kn_ = kind();
      const anders = wahl([k, n - k - 1, n - k + 1].filter((y) => y >= 1 && y !== n - k && y !== x));
      return auswahl(Z(`Im Streifen sind ${br(k, n)} gefärbt.`, `${kn_} sagt: „Bis zum Ganzen fehlen noch ${br(x, n)}.“`, 'Stimmt das?'),
        [opt('Stimmt.', stimmt, stimmt ? undefined : 'bruch-ganzes-teil'), opt(`Falsch. Es gilt ${br(k, n)} + ${br(stimmt ? anders : n - k, n)} = 1.`, !stimmt, 'bruch-ganzes-teil'), opt(`Falsch. Es gilt ${br(k, n)} + ${br(stimmt ? (anders === k ? n - k + 1 : k) : anders, n)} = 1.`, false, 'bruch-ganzes-teil')].map((o) => (o.richtig ? opt(o.text, true) : o)),
        h3('Zähle die weißen Teile im Bild. So viele Teile fehlen bis zum Ganzen.', 'Sind 5⁄6 gefärbt, dann fehlt noch 1⁄6. Denn 5⁄6 + 1⁄6 = 1.', `Das Ganze hat ${n} Teile. Gefärbt sind ${k} Teile.`),
        { bild: bild(fig('streifen', n, vorn(k))), nachweis: [{ art: 'urteil', stimmt, behauptung: `${br(k, n)} + ${br(x, n)} = 1` }] }); },
  ]);
  const tB2M = h2('Teile die Figur zuerst in so viele gleich große Gruppen, wie der Nenner sagt.', 'Zähle die Teile einer Gruppe. Nimm so viele Gruppen, wie der Zähler sagt.');
  sechs(B2, 'M', [
    () => { const [n, z, nn] = wahl([[[3, 4], 2, 3], [[3, 4], 3, 4], [[3, 4], 5, 6], [[2, 5], 3, 5], [[2, 6], 3, 4], [[2, 6], 2, 3], [[2, 4], 3, 4], [[3, 3], 2, 3]]), N = anz(n), k = (N / nn) * z;
      return faerben(Z(`Das Rechteck hat ${N} gleich große Teile.`, `Färbe ${br(z, nn)} des Rechtecks.`), leer('rechteck', n), br(z, nn), k, [[N / nn, 'bruchteil-zaehler-vergessen'], [z, 'bruch-ganzes-teil']], tB2M); },
    () => { const n = wahl([3, 4, 5, 6]), k = zz(1, n - 1), gemischt = wahl([true, false]);
      return faerben(Z('Jeder Kreis ist ein Ganzes.', `Färbe ${gemischt ? br(k, n, 1) : br(n + k, n)}.`), leer('kreis', n, { ganze: 2 }), gemischt ? br(k, n, 1) : br(n + k, n), n + k, [[k, 'bruch-ganzes-teil']],
        h2('Die Zahl ist größer als 1. Du brauchst also einen ganzen Kreis und einen Teil des zweiten Kreises.', `Färbe einen Kreis ganz. Färbe im zweiten Kreis noch ${k} ${k === 1 ? 'Teil' : 'Teile'}.`)); },
    () => { const [l, b_, z, n] = wahl([[6, 4, 3, 8], [6, 4, 5, 6], [5, 4, 3, 10], [6, 3, 5, 9], [8, 3, 5, 12], [5, 4, 3, 4]]), N = l * b_, k = (N / n) * z;
      return zahl(Z(`Zeichne in dein Heft ein Rechteck: ${l} Kästchen lang und ${b_} Kästchen breit.`, `Färbe ${br(z, n)} des Rechtecks.`, 'Wie viele Kästchen hast du gefärbt?'), k, fehlerliste(k, [[N / n, 'bruchteil-zaehler-vergessen'], [N, 'sach-schritt-vergessen'], [N - k, 'bruch-teil-zu-rest']]),
        h2('Wie viele Kästchen hat das ganze Rechteck? Teile es dann in so viele gleich große Gruppen, wie der Nenner sagt.', `Das Rechteck hat ${l} · ${b_} = ${N} Kästchen. Rechne ${N} : ${n} und nimm das Ergebnis mal ${z}.`),
        { einheit: 'Kästchen', nachweis: [`${l} · ${b_} = ${N}`, `${br(z, n)} von ${N} = ${k}`] }); },
    () => { const [N, z, n] = wahl([[12, 3, 4], [12, 2, 3], [10, 3, 5], [12, 5, 6], [8, 3, 4], [10, 1, 2]]), k = (N / n) * z;
      return zahl(Z(`Zeichne in dein Heft einen Streifen aus ${N} Kästchen.`, `Färbe ${br(z, n)} des Streifens.`, 'Wie viele Kästchen hast du gefärbt?'), k, fehlerliste(k, [[N / n, 'bruchteil-zaehler-vergessen'], [z, 'bruch-ganzes-teil'], [N - k, 'bruch-teil-zu-rest']]),
        h2('Teile den Streifen in so viele gleich große Stücke, wie der Nenner sagt. Wie viele Kästchen hat ein Stück?', `Ein Stück hat ${N} : ${n} = ${N / n} Kästchen. Du färbst ${z} ${z === 1 ? 'Stück' : 'Stücke'}.`),
        { einheit: 'Kästchen', nachweis: [`${br(z, n)} von ${N} = ${k}`] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), k = zz(1, n - 1);
      return bruch(Z('Jeder Kreis ist ein Ganzes.', `Gefärbt sind ${br(k, n, 1)}.`, 'Welcher Bruchteil fehlt noch bis 2?'), br(n - k, n), [[br(k, n), 'sach-frage-verfehlt'], [br(2 * n - k, n), 'bruch-ganzes-teil']],
        h2('Der erste Kreis ist schon ganz gefärbt. Schau nur auf den zweiten Kreis.', 'Zähle die weißen Teile im zweiten Kreis. Der Nenner bleibt gleich.'),
        { bild: bild(fig('kreis', n, vorn(n + k), { ganze: 2 })), nachweis: [`2 − ${br(k, n, 1)} = ${br(n - k, n)}`] }); },
    () => { const [z, n] = wahl([[2, 5], [3, 4], [2, 3], [3, 5], [3, 8], [5, 6]]), e = zz(2, 4), x = z * e, g = n * e;
      return zahl(Z(`Der gefärbte Teil eines Streifens ist ${x} Kästchen lang. Das sind ${br(z, n)} des Streifens.`, 'Wie viele Kästchen lang ist der ganze Streifen? Zeichne ihn zur Kontrolle in dein Heft.'), g, fehlerliste(g, [[x / z, 'sach-schritt-vergessen'], [x * n, 'bruchteil-zaehler-vergessen'], [(x / z) * (n - z), 'sach-frage-verfehlt']]),
        h2(`${x} Kästchen sind ${z} gleich große Teile. Wie lang ist dann ein Teil?`, `Ein Teil hat ${x} : ${z} = ${e} Kästchen. Der ganze Streifen hat ${n} solche Teile.`),
        { einheit: 'Kästchen', nachweis: [`${x} : ${z} = ${e}`, `${e} · ${n} = ${g}`] }); },
  ]);
  sechs(B2, 'E', [
    () => { const [n, z, nn] = wahl([[[4, 5], 7, 10], [[4, 5], 3, 4], [[4, 5], 3, 5], [[3, 6], 5, 6], [[3, 6], 7, 9], [[2, 8], 5, 8], [[2, 8], 3, 4], [[4, 4], 5, 8]]), N = anz(n), k = (N / nn) * z;
      return faerben(`Färbe ${br(z, nn)} des Rechtecks.`, leer('rechteck', n), br(z, nn), k, [[N / nn, 'bruchteil-zaehler-vergessen'], [z, 'bruch-ganzes-teil']], h1('Teile das Rechteck zuerst in so viele gleich große Gruppen, wie der Nenner sagt. Wie viele Kästchen hat eine Gruppe?')); },
    () => { const [l, b_, n1, n2] = wahl([[6, 4, 3, 4], [6, 4, 2, 3], [6, 4, 4, 6], [5, 4, 2, 5], [5, 4, 4, 5], [6, 3, 2, 3], [6, 3, 3, 6]]), N = l * b_, a = N / n1, c = N / n2;
      return zahl(Z(`Zeichne in dein Heft ein Rechteck: ${l} Kästchen lang und ${b_} Kästchen breit.`, `Färbe ${br(1, n1)} des Rechtecks rot und ${br(1, n2)} blau. Kein Kästchen bekommt zwei Farben.`, 'Wie viele Kästchen bleiben weiß?'), N - a - c, fehlerliste(N - a - c, [[a + c, 'sach-frage-verfehlt'], [N - a, 'sach-schritt-vergessen'], [N - c, 'sach-schritt-vergessen']]),
        h1('Rechne zuerst aus, wie viele Kästchen das ganze Rechteck hat. Bestimme dann die Zahl der roten und der blauen Kästchen.'),
        { einheit: 'Kästchen', nachweis: [`${l} · ${b_} = ${N}`, `${br(1, n1)} von ${N} = ${a}`, `${br(1, n2)} von ${N} = ${c}`, `${N} − ${a} − ${c} = ${N - a - c}`] }); },
    () => { const [z, n] = wahl([[5, 6], [2, 3], [3, 4], [1, 6], [1, 3], [1, 4]]), k = (12 / n) * z;
      return faerben(Z('Der Kreis hat 12 gleich große Teile.', `Färbe ${br(z, n)} des Kreises.`), leer('kreis', 12), br(z, n), k, [[12 / n, 'bruchteil-zaehler-vergessen'], [z, 'bruch-ganzes-teil']], h1('Wie viele der 12 Teile gehören zu einem Teil des Bruchs? Teile 12 durch den Nenner.')); },
    () => { const [N, a, c] = wahl([[20, [3, 4], [4, 5]], [20, [7, 10], [3, 4]], [12, [2, 3], [3, 4]], [12, [5, 6], [3, 4]], [18, [5, 6], [7, 9]], [20, [3, 5], [13, 20]]]), ka = (N / a[1]) * a[0], kc = (N / c[1]) * c[0], [gross, klein] = ka > kc ? [ka, kc] : [kc, ka];
      return zahl(Z(`Zeichne in dein Heft zwei Streifen aus je ${N} Kästchen.`, `Färbe im ersten Streifen ${b2(a)} und im zweiten Streifen ${b2(c)}.`, 'Wie viele Kästchen sind in dem einen Streifen mehr gefärbt als in dem anderen?'), gross - klein, fehlerliste(gross - klein, [[gross, 'sach-schritt-vergessen'], [klein, 'sach-schritt-vergessen'], [gross + klein, 'sub-addiert']]),
        h1('Rechne für jeden Streifen aus, wie viele Kästchen gefärbt sind. Vergleiche dann die beiden Zahlen.'),
        { einheit: 'Kästchen', nachweis: [`${b2(a)} von ${N} = ${ka}`, `${b2(c)} von ${N} = ${kc}`, `${gross} − ${klein} = ${gross - klein}`] }); },
    () => { const [form, n, z, nn] = wahl([['rechteck', [2, 4], 11, 8], ['rechteck', [2, 4], 5, 4], ['kreis', 6, 3, 2], ['kreis', 8, 7, 4], ['rechteck', [2, 3], 4, 3], ['kreis', 10, 7, 5]]), N = anz(n), k = (N / nn) * z, gemischt = wahl([true, false]);
      return faerben(Z(`${form === 'kreis' ? 'Jeder Kreis' : 'Jedes Rechteck'} ist ein Ganzes.`, `Färbe ${gemischt ? br(z - nn, nn, 1) : br(z, nn)}.`), leer(form, n, { ganze: 2 }), gemischt ? br(z - nn, nn, 1) : br(z, nn), k, [[z, 'bruch-ganzes-teil'], [k - N, 'bruch-ganzes-teil']],
        h1('Die Zahl ist größer als 1: Eine Figur wird ganz gefärbt. Überlege dann, wie viele Teile der zweiten Figur zum Rest gehören.')); },
    () => { const [z, n] = wahl([[3, 8], [2, 5], [1, 4], [3, 10], [5, 12], [4, 9], [2, 7]]), e = zz(2, 4), w = (n - z) * e, g = n * e;
      return zahl(Z(`In einem Streifen aus Kästchen ${ist(z)} ${br(z, n)} gefärbt. ${w} Kästchen sind weiß.`, 'Aus wie vielen Kästchen besteht der ganze Streifen?'), g, fehlerliste(g, [[(w / (n - z)) * z, 'sach-frage-verfehlt'], [w / (n - z), 'sach-schritt-vergessen'], [(w / z) * n, 'bruch-ganzes-teil']]),
        h1('Welcher Bruchteil des Streifens ist weiß? Von diesem Bruchteil kennst du die Zahl der Kästchen.'),
        { einheit: 'Kästchen', nachweis: [`1 − ${br(z, n)} = ${br(n - z, n)}`, `${n} − ${z} = ${n - z}`, `${w} : ${n - z} = ${e}`, `${e} · ${n} = ${g}`] }); },
  ]);

  // ================= B3: Brüche vergleichen und ordnen =================
  const tB3 = h3('Die Teile sind gleich groß. Mehr gefärbte Teile sind mehr.', 'Es gilt 1⁄3 < 2⁄3. Denn 1 Teil ist weniger als 2 Teile.', 'Der Nenner ist gleich. Vergleiche nur die Zähler.');
  const dreiStreifen = (zs, n = 4) => benenne(zs.map((k) => fig('streifen', n, vorn(k))));
  sechs(B3, 'F', [
    () => { const n = zz(3, 4), [a, c] = mische(vorn(n - 1, 1)).slice(0, 2);
      return auswahl(Z(`Figur A zeigt ${br(a, n)}.`, `Figur B zeigt ${br(c, n)}.`, 'Welches Zeichen passt?', `${br(a, n)} ▢ ${br(c, n)}`), ZEICHEN([a, n], [c, n]), tB3,
        { bild: bild(...benenne([fig('streifen', n, vorn(a)), fig('streifen', n, vorn(c))])), nachweis: [NB(br(a, n), { figur: 'A' }), NB(br(c, n), { figur: 'B' }), VGL(br(a, n), br(c, n))] }); },
    () => { const zs = mische([1, 2, 3]), figuren = benenne(zs.map((k) => fig('kreis', 4, vorn(k)))), gross = wahl([true, false]);
      return auswahl(`In welcher Figur ist am ${gross ? 'meisten' : 'wenigsten'} gefärbt?`, figurOpt(figuren, (f, i) => zs[i] === (gross ? 3 : 1)),
        h3('Alle Kreise haben gleich große Teile. Zähle die gefärbten Teile.', 'In einem Kreis sind 2 Teile gefärbt, im anderen 1 Teil. Im ersten ist mehr gefärbt.', 'Zähle bei jeder Figur die gefärbten Teile. Vergleiche die Zahlen.'),
        { bild: bild(...figuren), nachweis: [{ art: 'figurextrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const zs = mische(mische([1, 2, 3, 4]).slice(0, 3));
      return auswahl(Z('Die Streifen zeigen drei Brüche.', 'Welcher Bruch ist am größten?'), zs.map((k) => opt(br(k, 4), k === Math.max(...zs))), tB3, { bild: bild(...dreiStreifen(zs)), nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const zs = mische(wahl([[1, 2, 3], [1, 2, 3, 4], [2, 3, 4], [1, 3, 4]])), sort = [...zs].sort((a, c) => a - c);
      return ordnen(Z('Die Streifen zeigen die Brüche.', 'Ordne die Brüche.', 'Beginne mit dem kleinsten.'), sort.map((k) => br(k, 4)), tB3, { bild: bild(...dreiStreifen(zs)), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt' }); },
    () => { const n = zz(3, 4), [a, c] = mische(vorn(n - 1, 1)).slice(0, 2), stimmt = wahl([true, false]), kn_ = kind(), gr = a > c ? '>' : '<', beh = stimmt ? gr : (gr === '>' ? '<' : '>');
      return auswahl(Z(`${kn_} sagt: „${br(a, n)} ist ${beh === '>' ? 'größer' : 'kleiner'} als ${br(c, n)}.“`, 'Stimmt das?', 'Schau auf die Figuren.'),
        [opt('Stimmt.', stimmt, 'zeichen-verwechselt'), opt(`Falsch. Es gilt ${br(a, n)} ${gr} ${br(c, n)}.`, !stimmt, 'zeichen-verwechselt'), opt(`Falsch. Es gilt ${br(a, n)} = ${br(c, n)}.`, false)].map((o) => (o.richtig ? opt(o.text, true) : o)), tB3,
        { bild: bild(...benenne([fig('kreis', n, vorn(a)), fig('kreis', n, vorn(c))])), nachweis: [{ art: 'urteil', stimmt, behauptung: `${br(a, n)} ${beh} ${br(c, n)}` }] }); },
    () => { const zs = mische(mische([1, 2, 3, 4]).slice(0, 3));
      return auswahl(Z('Die Streifen zeigen drei Brüche.', 'Welcher Bruch ist am kleinsten?'), zs.map((k) => opt(br(k, 4), k === Math.min(...zs))), tB3, { bild: bild(...dreiStreifen(zs)), nachweis: [{ art: 'extrem', was: 'kleinste' }] }); },
  ]);
  const tStamm = h3('Bei mehr Teilen wird jedes Teil kleiner.', 'Es gilt 1⁄2 > 1⁄4. Eine halbe Pizza ist mehr als ein Viertel.', 'Der Zähler ist gleich. Der Bruch mit dem kleineren Nenner ist größer.');
  const tGleich = h3('Der Nenner ist gleich: Die Teile sind gleich groß. Vergleiche die Zähler.', 'Es gilt 3⁄8 < 5⁄8. Denn 3 Teile sind weniger als 5 Teile.', 'Mehr Teile von gleicher Größe sind mehr.');
  const stamm = () => mische([2, 3, 4, 5, 6, 8, 10]);
  sechs(B3, 'G', [
    () => { const n = wahl([5, 6, 8, 10]), [a, c] = mische(vorn(n - 1, 1)).slice(0, 2);
      return auswahl(Z('Welches Zeichen passt?', `${br(a, n)} ▢ ${br(c, n)}`), ZEICHEN([a, n], [c, n]), tGleich, { nachweis: [VGL(br(a, n), br(c, n))] }); },
    () => { const n = wahl([6, 8, 10]), zs = mische(vorn(n - 1, 1)).slice(0, 4).sort((a, c) => a - c);
      return ordnen(Z('Ordne die Brüche.', 'Beginne mit dem kleinsten.'), zs.map((k) => br(k, n)), tGleich, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt' }); },
    () => { const [a, c] = stamm().filter((x) => x <= 8).slice(0, 2);
      return auswahl(Z(`Figur A zeigt ${br(1, a)}.`, `Figur B zeigt ${br(1, c)}.`, 'Welches Zeichen passt?', `${br(1, a)} ▢ ${br(1, c)}`), [opt('<', a > c, 'bruch-nenner-groesse'), opt('>', a < c, 'bruch-nenner-groesse'), opt('=', false)].map((o) => (o.richtig ? opt(o.text, true) : o)), tStamm,
        { bild: bild(...benenne([fig('kreis', a, [0]), fig('kreis', c, [0])])), nachweis: [NB(br(1, a), { figur: 'A' }), NB(br(1, c), { figur: 'B' }), VGL(br(1, a), br(1, c))] }); },
    () => { const ns = stamm().slice(0, 3), gross = wahl([true, false]), ziel = gross ? Math.min(...ns) : Math.max(...ns), falle = gross ? Math.max(...ns) : Math.min(...ns);
      return auswahl(Z('Die Streifen zeigen drei Stammbrüche.', `Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), ns.map((n) => opt(br(1, n), n === ziel, n === falle ? 'bruch-nenner-groesse' : undefined)), tStamm,
        { bild: bild(...benenne(ns.map((n) => fig('streifen', n, [0])))), nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const ns = stamm().slice(0, 4).sort((a, c) => c - a);
      return ordnen(Z('Ordne die Stammbrüche.', 'Beginne mit dem kleinsten.'), ns.map((n) => br(1, n)), tStamm, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'bruch-nenner-groesse' }); },
    () => { const [x, y] = stamm().filter((n) => n <= 8).slice(0, 2), a = Math.max(x, y), c = Math.min(x, y), stimmt = wahl([true, false, false]), kn_ = kind();
      const satz = stimmt ? `${kn_} sagt: „${br(1, c)} ist größer als ${br(1, a)}.“` : `${kn_} sagt: „${br(1, a)} ist größer als ${br(1, c)}, denn ${a} ist größer als ${c}.“`;
      const [l, r] = stimmt ? [c, a] : [a, c];
      return auswahl(Z(satz, 'Stimmt das?'), [opt('Stimmt.', stimmt, 'bruch-nenner-groesse'), opt(`Falsch. Es gilt ${br(1, l)} ${stimmt ? '=' : '<'} ${br(1, r)}.`, !stimmt), opt(`Falsch. Es gilt ${br(1, l)} ${stimmt ? '<' : '='} ${br(1, r)}.`, false, stimmt ? 'bruch-nenner-groesse' : undefined)].map((o) => (o.richtig ? opt(o.text, true) : o)), tStamm,
        { bild: bild(...benenne([fig('kreis', l, [0]), fig('kreis', r, [0])])), nachweis: [{ art: 'urteil', stimmt, behauptung: `${br(1, l)} > ${br(1, r)}` }] }); },
  ]);
  const tZaehler = h2('Die Zähler sind gleich: Es sind gleich viele Teile. Bei welchem Bruch sind die Teile größer?', 'Der Bruch mit dem kleineren Nenner hat die größeren Teile. Er ist größer.');
  const ACHTEL = [[1, 2, br(1, 2)], [3, 4, br(3, 4)], [7, 8, br(7, 8)], [1, 1, '1'], [9, 8, br(1, 8, 1)], [5, 4, br(5, 4)], [5, 4, br(1, 4, 1)], [3, 2, br(3, 2)], [3, 2, br(1, 2, 1)], [7, 4, br(3, 4, 1)], [7, 4, br(7, 4)], [3, 8, br(3, 8)], [11, 8, br(11, 8)], [1, 4, br(1, 4)]];
  sechs(B3, 'M', [
    () => { const k = wahl([2, 3, 5]), [a, c] = mische([3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((n) => n > k)).slice(0, 2);
      return auswahl(Z('Welches Zeichen passt?', `${br(k, a)} ▢ ${br(k, c)}`), [opt('<', a > c, 'bruch-nenner-groesse'), opt('>', a < c, 'bruch-nenner-groesse'), opt('=', false)].map((o) => (o.richtig ? opt(o.text, true) : o)), tZaehler, { nachweis: [VGL(br(k, a), br(k, c))] }); },
    () => { const ns = mische([5, 6, 8, 9, 10, 12]).slice(0, 5), wie = mische([1, 1, 0, 0, wahl([0, 1])]);
      return auswahl(Z(`Welche Brüche sind größer als ${br(1, 2)}?`, 'Kreuze alle an.'), ns.map((n, i) => { const halb = Math.floor(n / 2), z = wie[i] ? zz(halb + 1, Math.min(n - 1, halb + 2)) : zz(Math.max(1, halb - 2), n % 2 ? halb : halb - 1); return opt(br(z, n), Boolean(wie[i])); }),
        h2('Bestimme für jeden Bruch die Hälfte des Nenners. Ist der Zähler größer als diese Hälfte?', 'Beispiel: Die Hälfte von 8 ist 4. Bei 5⁄8 ist der Zähler größer als 4, also ist der Bruch größer als die Hälfte.'),
        { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '>', wert: br(1, 2) }] }); },
    () => { const T = wahl([3, 4, 5]), gem = wahl([true, false]), k = zz(1, T - 1), wert = gem ? T + k : k;
      return strahl('markieren', `Markiere ${gem ? br(k, T, 1) : br(k, T)} am Zahlenstrahl.`, { von: 0, bis: 2 * T, schritt: 1, beschriftung: T, teiler: T }, wert, fehlerliste(wert, [[gem ? k : T + k, 'bruch-ganzes-teil'], [T - k, 'bruch-teil-zu-rest']]),
        h2('In wie viele Teile ist die Strecke von 0 bis 1 geteilt? Das passt zum Nenner.', gem ? `Gehe zuerst bis zur 1. Gehe dann noch ${k} ${k === 1 ? 'Teilstrich' : 'Teilstriche'} weiter.` : `Gehe von 0 aus ${k} ${k === 1 ? 'Teilstrich' : 'Teilstriche'} nach rechts.`),
        { nachweis: [{ art: 'strahl', zahl: gem ? br(k, T, 1) : br(k, T) }] }); },
    () => { const ns = mische([3, 4, 5, 6, 8, 10, 12]).slice(0, 4), wie = mische([1, 1, 0, wahl([0, 1])]);
      return auswahl(Z('Welche Brüche sind größer als 1?', 'Kreuze alle an.'), ns.map((n, i) => opt(wie[i] ? br(n + zz(1, 3), n) : br(n - zz(1, 2), n), Boolean(wie[i]), wie[i] ? undefined : 'bruch-vertauscht')),
        h2('Ein Ganzes hat so viele Teile, wie der Nenner sagt. Sind es mehr Teile als ein Ganzes?', 'Ist der Zähler größer als der Nenner, dann ist der Bruch größer als 1.'), { mehrfach: true, nachweis: [{ art: 'schwelle', zeichen: '>', wert: '1' }] }); },
    () => { const T = wahl([4, 5, 6, 8]), p = zz(1, T - 1);
      if (p * 2 === T) return null;
      return bruch(Z('Auf welche Zahl zeigt der Pfeil?', 'Schreibe die Zahl als Bruch.'), br(p, T), [[br(p, T - p), 'bruch-teil-zu-rest'], [br(T, p), 'bruch-vertauscht']],
        h2('In wie viele gleich große Teile ist die Strecke von 0 bis 1 geteilt? Das ist der Nenner.', `Die Strecke von 0 bis 1 hat ${T} Teile. Zähle die Teile von 0 bis zum Pfeil für den Zähler.`),
        { bild: B.strahl({ von: 0, bis: T, schritt: 1, beschriftung: T, pfeil: p, teiler: T }), nachweis: [{ art: 'strahl', zahl: br(p, T) }] }); },
    () => { for (let i = 0; i < 50; i++) { const liste = mische(ACHTEL).slice(0, 5);
        if (new Set(liste.map(([z, n]) => z / n)).size === 5 && liste.some(([, , t]) => t.includes(' ')) && liste.some(([z, n]) => z < n)) return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten.'), sortiere(liste).map(([, , t]) => t),
          h2('Sortiere zuerst grob: Welche Zahlen sind kleiner als 1, welche größer?', 'Schreibe alle Zahlen in Achteln, zum Beispiel am Zahlenstrahl: 1⁄2 sind 4 Achtel, 3⁄4 sind 6 Achtel, 1 sind 8 Achtel.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt' }); }
      return null; },
  ]);
  sechs(B3, 'E', [
    () => { const [a, c] = mische([3, 4, 5, 6, 8, 9, 10, 12, 15, 20]).slice(0, 2);
      return auswahl(Z('Welches Zeichen passt?', `${br(a - 1, a)} ▢ ${br(c - 1, c)}`), [opt('<', a < c, 'bruch-nenner-groesse'), opt('>', a > c, 'bruch-nenner-groesse'), opt('=', false)].map((o) => (o.richtig ? opt(o.text, true) : o)),
        h1('Beiden Brüchen fehlt genau ein Teil bis zum Ganzen. Bei welchem Bruch ist das fehlende Teil kleiner?'), { nachweis: [VGL(br(a - 1, a), br(c - 1, c))] }); },
    () => { const ns = mische([3, 4, 5, 6, 8, 10, 12, 15, 20]).slice(0, 5), gross = wahl([true, false]), ziel = gross ? Math.max(...ns) : Math.min(...ns), falle = gross ? Math.min(...ns) : Math.max(...ns);
      return auswahl(Z('Jedem Bruch fehlt ein Teil bis zum Ganzen.', `Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), ns.map((n) => opt(br(n - 1, n), n === ziel, n === falle ? 'bruch-nenner-groesse' : undefined)),
        h1('Vergleiche die fehlenden Teile: Je kleiner das fehlende Teil ist, desto näher liegt der Bruch an 1.'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const ns = mische([2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 4).sort((a, c) => a - c), ab = wahl([true, false]), liste = ns.map((n) => br(n - 1, n));
      return ordnen(Z('Ordne die Brüche.', `Beginne mit dem ${ab ? 'größten' : 'kleinsten'}.`), ab ? [...liste].reverse() : liste,
        h1('Jedem Bruch fehlt genau ein Teil bis zum Ganzen. Je kleiner dieses Teil ist, desto größer ist der Bruch.'), { nachweis: [{ art: 'ordnung', richtung: ab ? 'ab' : 'auf' }], umgekehrt: 'bruch-nenner-groesse' }); },
    () => { const k = wahl([2, 3, 5, 7]), ns = mische([4, 5, 6, 8, 9, 10, 12, 15, 20].filter((n) => n > k)).slice(0, 3).sort((a, c) => a - c), stimmt = wahl([true, false, false]), kn_ = kind();
      const richtig = [...ns].reverse().map((n) => br(k, n)).join(' < '), falsch = ns.map((n) => br(k, n)).join(' < '), halb = [ns[1], ns[2], ns[0]].map((n) => br(k, n)).join(' < ');
      return auswahl(`${kn_} ordnet drei Brüche: ${stimmt ? richtig : falsch}. Stimmt die Reihenfolge?`,
        [opt('Stimmt.', stimmt, 'bruch-nenner-groesse'), opt(`Falsch. Richtig ist ${stimmt ? falsch : richtig}.`, !stimmt, 'bruch-nenner-groesse'), opt(`Falsch. Richtig ist ${halb}.`, false)].map((o) => (o.richtig ? opt(o.text, true) : o)),
        h1('Alle Brüche haben denselben Zähler. Überlege, bei welchem Nenner die Teile am größten sind.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: stimmt ? richtig : falsch }] }); },
    () => { const n1 = wahl([5, 6, 8, 10]), n2 = wahl([3, 4, 5, 6]), n3 = wahl([4, 6, 8, 10]), n4 = wahl([3, 4, 5, 8]), w = () => wahl([true, false]);
      const liste = [w() ? [`${br(1, n1)} < ${br(1, n1 + 2)}`, false] : [`${br(1, n1)} > ${br(1, n1 + 2)}`, true], w() ? [`${br(n2 + 1, n2)} > 1`, true] : [`${br(n2 + 1, n2)} < 1`, false], w() ? [`${br(n3 / 2, n3)} = ${br(1, 2)}`, true] : [`${br(n3 / 2 + 1, n3)} = ${br(1, 2)}`, false], w() ? [`${br(n4 - 1, n4)} > ${br(n4, n4 + 1)}`, false] : [`${br(n4 - 1, n4)} < ${br(n4, n4 + 1)}`, true], w() ? [`${br(3, 10)} > ${br(1, 2)}`, false] : [`${br(7, 10)} > ${br(1, 2)}`, true]];
      if (liste.every(([, r]) => r) || liste.every(([, r]) => !r)) return null;
      return auswahl(Z('Welche Aussagen stimmen?', 'Kreuze alle an.'), liste.map(([t, r]) => opt(t, r)), h1('Prüfe jede Aussage einzeln. Vergleiche mit 1⁄2 und mit 1, oder überlege, wie groß die Teile sind.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
    () => { const [von, bis, drin, aus] = wahl([[[1, 2], [3, 4], [[5, 8], [2, 3], [7, 12], [3, 5]], [[7, 8], [3, 8], [4, 5], [5, 12], [9, 10]]], [[1, 4], [1, 2], [[3, 8], [1, 3], [5, 12], [2, 5]], [[5, 8], [1, 5], [2, 3], [1, 6], [3, 5]]], [[1, 2], [1, 1], [[5, 8], [2, 3], [7, 10], [11, 12]], [[3, 8], [5, 4], [2, 5], [7, 6]]]]);
      const k = zz(2, 3), liste = mische([...mische(drin).slice(0, k), ...mische(aus).slice(0, 5 - k)]);
      return auswahl(Z(`Welche Brüche liegen zwischen ${b2(von)} und ${bis[1] === 1 ? '1' : b2(bis)}?`, 'Kreuze alle an.'), liste.map((x) => opt(b2(x), drin.includes(x))),
        h1('Vergleiche jeden Bruch mit beiden Grenzen. Ein Zahlenstrahl im Heft hilft dir dabei.'), { mehrfach: true, nachweis: [{ art: 'zwischen', von: b2(von), bis: bis[1] === 1 ? '1' : b2(bis) }] }); },
  ]);
}
