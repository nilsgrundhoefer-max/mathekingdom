// Aufgaben zu 6.1.2 „Brüche erweitern“ (Lernziele W1, W2) nach ADR 0015 und ADR 0037.
// W1: einen Bruch mit einer Zahl erweitern. W2: auf einen Nenner erweitern und gleichwertige Brüche erkennen.
// Grilling mit Nils (2026-11-24): F erweitert am Bild mit 2, 3, 5 und 10, G mit Zahlen bis 10, M bis 12, E in mehreren Schritten.
// Verlangt eine Aufgabe einen erweiterten Bruch, dann zählt genau dieser Bruch (genau: true).

import { sechs, auswahl, luecken, zahl, bruch, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, fig, benenne, bild, NB, WERT, UMF, HILFS, gekuerzt, zweiStreifen, streifen, kreis, br, opt, zz, wahl, mische, teilerfremd } from './6-1-brueche.mjs';

const W1 = '6.1.2-W1', W2 = '6.1.2-W2';
const mal = ([z, n], k) => [z * k, n * k];
// Ein Bruch und eine Erweiterungszahl, die zusammen in einen Streifen passen (höchstens 20 Teile).
const amBild = () => { const [n, k] = wahl([[2, 2], [2, 3], [2, 5], [2, 10], [3, 2], [3, 3], [3, 5], [4, 2], [4, 3], [4, 5], [5, 2], [5, 3], [6, 2], [6, 3], [10, 2]]); return { a: gekuerzt([n]), k }; };
const urteil = (kn, sagt, stimmt, beh, richtigGlg, falschGlg, fv, hilfen, extra = {}) => auswahl(sagt, [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Es gilt ${richtigGlg}.`, !stimmt, stimmt ? fv : undefined), ...falschGlg.map((g) => opt(`Falsch. Es gilt ${g}.`, false, fv))], hilfen, { ...extra, nachweis: [{ art: 'urteil', stimmt, behauptung: beh }] });

export function erweitern() {
  // ================= W1: mit einer Zahl erweitern =================
  const tW1 = h3('Erweitern heißt: Nimm den Zähler und den Nenner mit derselben Zahl mal.', '1⁄2 mit 3 erweitert: 1 · 3 = 3 und 2 · 3 = 6. Also 1⁄2 = 3⁄6.', 'Rechne zuerst den Zähler mal die Zahl. Rechne dann den Nenner mal die Zahl.');
  sechs(W1, 'F', [
    () => { const { a, k } = amBild(), c = mal(a, k);
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', `Erweitere mit ${k}.`, `${br(...a)} = {{a}}⁄{{b}}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + k, 'erweitern-addiert']])], b: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + k, 'erweitern-addiert']])] }, tW1,
        { bild: zweiStreifen(a, c), nachweis: [UMF(a, k, 'erweitern'), NB(br(...c), { figur: 'B' })] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      if (a[0] + k >= a[1] + k || a[0] === a[1]) return null;
      return auswahl(Z(`Erweitere ${br(...a)} mit ${k}.`, 'Welcher Bruch stimmt?'), [opt(br(...c), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(a[0] + k, a[1] + k), false, 'erweitern-addiert')], tW1,
        { bild: streifen(...a), nachweis: [UMF(a, k, 'erweitern'), WERT(br(...c), true)] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', `Erweitere mit ${k}.`, `${br(...a)} = {{a}}⁄${c[1]}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + k, 'erweitern-addiert'], [c[1], 'bruch-vertauscht']])] },
        h3('Der Nenner ist schon erweitert. Jetzt fehlt noch der Zähler.', '1⁄2 mit 3 erweitert: 1 · 3 = 3 und 2 · 3 = 6. Also 1⁄2 = 3⁄6.', `Rechne den Zähler mal ${k}.`),
        { bild: zweiStreifen(a, c), nachweis: [UMF(a, k, 'erweitern'), NB(br(...c), { figur: 'B' })] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      return bruch(Z(`Erweitere ${br(...a)} mit ${k}.`, 'Schreibe den neuen Bruch.'), br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'erweitern-addiert']], tW1,
        { genau: true, bild: kreis(...a), nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      if (a[0] === 1 && k === 2 && a[1] === 2) return null;
      return auswahl(Z(`Im Streifen ist ${br(...a)} gefärbt.`, `Jedes Teil wird in ${k} gleich große Teile geteilt.`, 'Welcher Bruch ist jetzt gefärbt?'), [opt(br(...c), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(a[0] + k, a[1] + k), false, 'erweitern-addiert')],
        h3('Aus jedem Teil werden mehrere kleine Teile. Das gilt auch für die gefärbten Teile.', 'Teilst du bei 1⁄2 jedes Teil in 3 Teile, dann sind 3 von 6 Teilen gefärbt.', `Rechne den Zähler mal ${k} und den Nenner mal ${k}.`),
        { bild: streifen(...a), nachweis: [UMF(a, k, 'erweitern'), WERT(br(...c), true)] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      return zahl(Z(`Du erweiterst ${br(...a)} mit ${k}.`, 'Wie heißt der neue Nenner?'), c[1], fehlerliste(c[1], [[a[1] + k, 'erweitern-addiert'], [a[1], 'erweitern-nur-ein-teil'], [c[0], 'bruch-vertauscht']]),
        h3('Der Nenner steht unter dem Bruchstrich. Auch er wird malgenommen.', '1⁄2 mit 3 erweitert: Der neue Nenner ist 2 · 3 = 6.', `Rechne ${a[1]} · ${k}.`),
        { bild: streifen(...a), nachweis: [UMF(a, k, 'erweitern')] }); },
  ]);
  const tW1G = h3('Nimm den Zähler und den Nenner mit der Erweiterungszahl mal.', '2⁄3 mit 4 erweitert: 2 · 4 = 8 und 3 · 4 = 12. Also 2⁄3 = 8⁄12.', 'Rechne zuerst den neuen Zähler aus. Rechne dann den neuen Nenner aus.');
  const g1 = () => ({ a: gekuerzt([3, 4, 5, 6, 7, 8, 9, 11, 12], 2), k: zz(4, 9) });
  sechs(W1, 'G', [
    () => { const { a, k } = g1(), c = mal(a, k);
      return bruch(Z(`Erweitere ${br(...a)} mit ${k}.`), br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'erweitern-addiert']], tW1G, { genau: true, nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 8, 10, 12], 2), k = zz(3, 9), c = mal(a, k);
      return luecken(Z(`Im Kreis ist ${br(...a)} gefärbt.`, `Erweitere mit ${k}.`, `${br(...a)} = {{a}}⁄{{b}}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + k, 'erweitern-addiert']])], b: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + k, 'erweitern-addiert']])] }, tW1G,
        { bild: kreis(...a), nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const { a, k } = g1(), c = mal(a, k);
      return zahl(Z(`${br(...a)} wurde erweitert zu ${br(...c)}.`, 'Wie heißt die Erweiterungszahl?'), k, fehlerliste(k, [[c[1] - a[1], 'erweitern-addiert'], [c[0] - a[0], 'erweitern-addiert'], [k + 1, 'div-einmaleins'], [k - 1, 'div-einmaleins']]),
        h3('Vergleiche die beiden Nenner. Mit welcher Zahl wurde malgenommen?', '2⁄3 = 8⁄12: Aus der 3 wurde 12. Die Erweiterungszahl ist 4.', `Rechne ${c[1]} : ${a[1]}.`), { nachweis: [UMF(a, k, 'erweitern', true)] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 8, 10], 2), k = zz(3, 9), c = mal(a, k);
      return auswahl(Z(`Im Streifen ist ${br(...a)} gefärbt.`, `Erweitere mit ${k}.`, 'Welcher Bruch stimmt?'), [opt(br(...c), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(a[0] + k, a[1] + k), false, 'erweitern-addiert')], tW1G,
        { bild: streifen(...a), nachweis: [UMF(a, k, 'erweitern'), WERT(br(...c), true)] }); },
    () => { const n = wahl([3, 4, 5, 6, 8]), z = wahl(vorn(n - 1, n + 1).filter((x) => teilerfremd(x, n))), a = [z, n], k = zz(3, 8), c = mal(a, k);
      return bruch(Z('Jeder Kreis ist ein Ganzes.', `Gefärbt ist ${br(...a)}.`, `Erweitere den Bruch mit ${k}.`), br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'erweitern-addiert']],
        h3('Auch ein Bruch über 1 wird so erweitert: Zähler und Nenner mal dieselbe Zahl.', '5⁄4 mit 2 erweitert: 5 · 2 = 10 und 4 · 2 = 8. Also 5⁄4 = 10⁄8.', `Rechne ${z} · ${k} und ${n} · ${k}.`),
        { genau: true, bild: bild(fig('kreis', n, vorn(z), { ganze: 2 })), nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const { a, k } = g1(), c = mal(a, k), kn = kind(), stimmt = wahl([true, false, false]), falle = [c[0], a[1]], gesagt = stimmt ? c : falle, glg = (x) => `${br(...a)} = ${br(...x)}`;
      return urteil(kn, Z(`${kn} erweitert ${br(...a)} mit ${k}.`, `${kn} rechnet: ${glg(gesagt)}`, 'Stimmt das?'), stimmt, glg(gesagt), glg(stimmt ? falle : c), [glg([a[0], c[1]])], 'erweitern-nur-ein-teil',
        h3('Beim Erweitern ändern sich immer beide Zahlen: der Zähler und der Nenner.', '1⁄2 mit 3 erweitert ist 3⁄6. Die Brüche 3⁄2 und 1⁄6 sind falsch.', `Prüfe: Ist der Zähler ${a[0]} · ${k}? Ist der Nenner ${a[1]} · ${k}?`)); },
  ]);
  const m1 = () => ({ a: gekuerzt([7, 8, 9, 11, 12, 13, 15, 16, 20, 25], 2), k: zz(6, 12) });
  sechs(W1, 'M', [
    () => { const { a, k } = m1(), c = mal(a, k);
      return bruch(`Erweitere ${br(...a)} mit ${k}.`, br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'erweitern-addiert']],
        h2('Beim Erweitern nimmst du Zähler und Nenner mit derselben Zahl mal.', `Rechne ${a[0]} · ${k} für den Zähler und ${a[1]} · ${k} für den Nenner.`), { genau: true, nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 7, 8, 9], 2), k = zz(2, 5), j = wahl([3, 4, 5, 6, 7].filter((x) => x !== k)), c = mal(a, k), d = mal(c, j);
      return bruch(`Erweitere ${br(...a)} zuerst mit ${k}. Erweitere das Ergebnis dann mit ${j}. Wie heißt der Bruch am Ende?`, br(...d), [[br(...c), 'sach-schritt-vergessen'], [br(...mal(a, k + j)), 'erweitern-addiert'], [br(a[0], d[1]), 'erweitern-nur-ein-teil']],
        h2('Erweitere in zwei Schritten. Schreibe das Zwischenergebnis auf.', `Nach dem ersten Schritt heißt der Bruch ${br(...c)}. Erweitere ihn jetzt mit ${j}.`), { genau: true, nachweis: [UMF(a, k, 'erweitern'), UMF(c, j, 'erweitern')] }); },
    () => { const { a, k } = m1(), c = mal(a, k);
      return zahl(`${br(...a)} wurde erweitert. Herausgekommen ist ${br(...c)}. Mit welcher Zahl wurde erweitert?`, k, fehlerliste(k, [[c[1] - a[1], 'erweitern-addiert'], [c[0] - a[0], 'erweitern-addiert'], [k + 1, 'div-einmaleins'], [k - 1, 'div-einmaleins']]),
        h2('Vergleiche die beiden Nenner oder die beiden Zähler: Mit welcher Zahl wurde malgenommen?', `Rechne ${c[1]} : ${a[1]}. Prüfe das Ergebnis am Zähler.`), { nachweis: [UMF(a, k, 'erweitern', true)] }); },
    () => { const { a, k } = m1(), c = mal(a, k);
      return luecken(`Erweitere mit ${k}: ${br(...a)} = {{a}}⁄{{b}}`, { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + k, 'erweitern-addiert']])], b: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + k, 'erweitern-addiert']])] },
        h2('Beim Erweitern nimmst du Zähler und Nenner mit derselben Zahl mal.', `Rechne ${a[0]} · ${k} und ${a[1]} · ${k}.`), { nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const n = wahl([6, 8, 10, 12]), z = wahl(vorn(n - 2, 1).filter((x) => teilerfremd(x, n))), k = zz(2, 4), [was, stueck] = wahl([['Eine Torte', 'Stücke'], ['Ein Blechkuchen', 'Stücke'], ['Eine Pizza', 'Stücke']]);
      return bruch(`${was} ist in ${n} gleich große ${stueck} geschnitten, ${z} davon sind noch übrig. Jetzt wird jedes Stück in ${k} gleich große Teile geteilt. Welcher Bruchteil ist übrig? Schreibe den Bruch mit dem neuen Nenner.`, br(z * k, n * k), [[br(z, n), 'sach-schritt-vergessen'], [br(z, n * k), 'erweitern-nur-ein-teil'], [br(z + k, n + k), 'erweitern-addiert']],
        h2('Übrig ist zuerst ein Bruch mit dem Nenner der Stückzahl. Das Teilen der Stücke erweitert diesen Bruch.', `Übrig sind ${br(z, n)}. Erweitere mit ${k}.`), { genau: true, nachweis: [`${z} : ${n} = ${br(z, n)}`, UMF([z, n], k, 'erweitern')] }); },
    () => { const a = gekuerzt([5, 6, 7, 8, 9, 11, 12], 2), k = zz(2, 5), c = mal(a, k), kn = kind(), stimmt = wahl([true, false, false]), falle = [a[0] + k, a[1] + k], gesagt = stimmt ? c : falle, glg = (x) => `${br(...a)} = ${br(...x)}`;
      return urteil(kn, `${kn} rechnet ${glg(gesagt)} und sagt: „Ich habe oben und unten ${stimmt ? `mit ${k} malgenommen` : `${k} dazugezählt`}.“ Stimmt die Gleichung?`, stimmt, glg(gesagt), glg(stimmt ? falle : c), [glg([c[0], a[1]]), glg([a[0], c[1]])], 'erweitern-addiert',
        h2('Der Wert eines Bruchs bleibt nur gleich, wenn Zähler und Nenner mit derselben Zahl malgenommen werden.', `Prüfe mit einem einfachen Bruch: 1⁄2 ist die Hälfte. Zählst du oben und unten 1 dazu, wird daraus 2⁄3, und das ist mehr als die Hälfte.`)); },
  ]);
  sechs(W1, 'E', [
    () => { const a = gekuerzt([14, 15, 16, 18, 24, 25, 35, 40], 5), k = zz(13, 24), c = mal(a, k);
      return bruch(`Erweitere ${br(...a)} mit ${k}.`, br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'erweitern-addiert']], h1('Nimm Zähler und Nenner mit derselben Zahl mal. Rechne schriftlich, wenn die Zahlen groß sind.'), { genau: true, nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const k = zz(3, 9), j = wahl([4, 6, 7, 8, 12].filter((x) => x !== k));
      return zahl(`Ein Bruch wird zuerst mit ${k} und dann mit ${j} erweitert. Mit welcher einen Zahl hättest du ihn gleich erweitern können?`, k * j, fehlerliste(k * j, [[k + j, 'erweitern-addiert'], [Math.max(k, j), 'sach-schritt-vergessen'], [k * j + k, 'sach-falsche-rechnung']]),
        h1('Probiere es mit 1⁄2 aus: Vergleiche den Nenner am Anfang mit dem Nenner am Ende.'), { nachweis: [`${k} · ${j} = ${k * j}`] }); },
    () => { const a = gekuerzt([3, 4, 5, 7], 2), [k, j, l] = mische([2, 3, 4, 5, 6]).slice(0, 3), c = mal(a, k), d = mal(c, j), e = mal(d, l);
      return bruch(`Erweitere ${br(...a)} nacheinander mit ${k}, mit ${j} und mit ${l}. Wie heißt der Bruch am Ende?`, br(...e), [[br(...d), 'sach-schritt-vergessen'], [br(...mal(a, k + j + l)), 'erweitern-addiert'], [br(a[0], e[1]), 'erweitern-nur-ein-teil']],
        h1('Schreibe jedes Zwischenergebnis auf. Oder überlege, mit welcher einen Zahl du gleich erweitern kannst.'), { genau: true, nachweis: [UMF(a, k, 'erweitern'), UMF(c, j, 'erweitern'), UMF(d, l, 'erweitern')] }); },
    () => { const a = gekuerzt([4, 5, 6, 7, 8, 9], 2), k = zz(3, 9), c = mal(a, k), kn = kind(), stimmt = wahl([true, false, false]), beh = `${br(...c)} ${stimmt ? '=' : '>'} ${br(...a)}`;
      return urteil(kn, `${kn} behauptet: „${br(...c)} ist ${stimmt ? 'genauso groß wie' : 'größer als'} ${br(...a)}, ${stimmt ? `denn der Bruch wurde nur mit ${k} erweitert` : 'denn Zähler und Nenner sind größer'}.“ Stimmt das?`, stimmt, beh, `${br(...c)} ${stimmt ? '>' : '='} ${br(...a)}`, [`${br(...c)} < ${br(...a)}`], 'bruch-nur-zaehler-verglichen',
        h1('Erweitern verfeinert nur die Einteilung. Was passiert dabei mit dem Wert des Bruchs?')); },
    () => { const n = wahl([20, 25, 40, 50]), z = wahl(vorn(n - 6, 3).filter((x) => teilerfremd(x, n))), N = wahl([200, 400, 600, 1000].filter((x) => x % n === 0 && x / n <= 25)), k = N / n, [ort, was] = wahl([['Auf einem Stadtplan', 'Park'], ['Auf einer Karte', 'Wald'], ['In einem Mosaik', 'blau']]);
      return zahl(`${ort} ist ${br(z, n)} der Fläche ${was}. Die Fläche wird in ein Raster mit ${N} gleich großen Feldern geteilt. Wie viele Felder sind ${was}?`, z * k, fehlerliste(z * k, [[z, 'erweitern-nur-ein-teil'], [k, 'sach-schritt-vergessen'], [N - z * k, 'sach-frage-verfehlt']]),
        h1(`Erweitere den Bruch auf den Nenner ${N}. Der neue Zähler ist die gesuchte Zahl der Felder.`), { nachweis: [`${N} : ${n} = ${k}`, UMF([z, n], k, 'erweitern')] }); },
    () => { const a = gekuerzt([7, 8, 9, 11, 12, 13], 2), k = zz(7, 14), c = mal(a, k);
      return zahl(`Ein Bruch mit dem Nenner ${a[1]} wird erweitert. Der neue Bruch heißt ${br(...c)}. Wie hieß der Zähler vorher?`, a[0], fehlerliste(a[0], [[k, 'sach-frage-verfehlt'], [c[0], 'erweitern-nur-ein-teil'], [c[0] - (c[1] - a[1]), 'erweitern-addiert']]),
        h1('Finde zuerst die Erweiterungszahl: Vergleiche dazu die beiden Nenner.'), { nachweis: [`${c[1]} : ${a[1]} = ${k}`, `${c[0]} : ${k} = ${a[0]}`] }); },
  ]);

  // ================= W2: auf einen Nenner erweitern, gleichwertige Brüche =================
  const tW2 = h3('Schau auf die Nenner. Mit welcher Zahl wurde malgenommen?', '1⁄2 = 3⁄6: Aus der 2 wurde 6. Das ist mal 3. Also auch 1 · 3 = 3.', 'Nimm den Zähler mit derselben Zahl mal wie den Nenner.');
  sechs(W2, 'F', [
    () => { const { a, k } = amBild(), c = mal(a, k);
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', 'Welcher Zähler fehlt?', `${br(...a)} = {{a}}⁄${c[1]}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert'], [k, 'sach-frage-verfehlt']])] }, tW2,
        { bild: zweiStreifen(a, c), nachweis: [NB(br(...c), { figur: 'B' })] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      if (c[1] > 12 || a[0] + 1 >= c[1] || a[0] === c[0] - 1) return null;
      const roh = mische([[fig('kreis', c[1], vorn(c[0])), true], [fig('kreis', c[1], vorn(a[0])), false, 'erweitern-nur-ein-teil'], [fig('kreis', c[1], vorn(c[0] - 1)), false]]), figuren = benenne(roh.map(([f]) => f));
      return auswahl(Z(`In welcher Figur ist genauso viel gefärbt wie ${br(...a)}?`), figuren.map((f, i) => opt(`Figur ${f.n}`, roh[i][1], roh[i][2])),
        h3('Die Teile sind hier kleiner. Dafür brauchst du mehr davon.', '1⁄2 ist die Hälfte. Bei 6 Teilen ist die Hälfte 3⁄6.', `Aus ${a[1]} Teilen werden ${c[1]} Teile. Das ist mal ${k}.`), { bild: bild(...figuren), nachweis: [{ art: 'figurwahl', bruch: br(...a) }] }); },
    () => { const { a, k } = amBild(), c = mal(a, k), f1 = [a[0], c[1]], f2 = [a[0] + 1, a[1] + 1];
      if (f2[0] >= f2[1] || f2[1] > 10) return null;
      return auswahl(Z(`Im Kreis ist ${br(...a)} gefärbt.`, 'Welcher Bruch ist genauso groß?'), [opt(br(...c), true), opt(br(...f1), false, 'erweitern-nur-ein-teil'), opt(br(...f2), false, 'erweitern-addiert')], tW2,
        { bild: kreis(...a), nachweis: [WERT(br(...a), false)] }); },
    () => { const [n, k] = wahl([[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [6, 2]]), a = gekuerzt([n]), c = mal(a, k);
      return luecken(Z('In beiden Kreisen ist gleich viel gefärbt.', 'Welcher Zähler fehlt?', `${br(...a)} = {{a}}⁄${c[1]}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert']])] }, tW2,
        { bild: bild(...benenne([fig('kreis', a[1], vorn(a[0])), fig('kreis', c[1], vorn(c[0]))])), nachweis: [NB(br(...c), { figur: 'B' })] }); },
    () => { const a = wahl([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), ks = mische([2, 3, 5, 10].filter((k) => a[1] * k <= 100)), r = ks.slice(0, 2).map((k) => mal(a, k)), f = [[a[0], r[0][1]], [a[0] + 1, a[1] + 1]];
      if (f[1][0] >= f[1][1]) return null;
      return auswahl(Z(`Welche Brüche sind genauso groß wie ${br(...a)}?`, 'Kreuze alle an.'), [...r.map((x) => opt(br(...x), true)), opt(br(...f[0]), false, 'erweitern-nur-ein-teil'), opt(br(...f[1]), false, 'erweitern-addiert')],
        h3('Ein Bruch bleibt gleich groß, wenn du ihn erweiterst.', '1⁄2 = 2⁄4 = 5⁄10. Alle drei Brüche sind die Hälfte.', 'Prüfe jeden Bruch: Wurden Zähler und Nenner mit derselben Zahl malgenommen?'),
        { mehrfach: true, bild: kreis(...a), nachweis: [WERT(br(...a), false)] }); },
    () => { const { a, k } = amBild(), c = mal(a, k);
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', 'Welcher Nenner fehlt?', `${br(...a)} = ${c[0]}⁄{{a}}`), { a: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + c[0] - a[0], 'erweitern-addiert']])] },
        h3('Schau auf die Zähler. Mit welcher Zahl wurde malgenommen?', '1⁄2 = 3⁄6: Aus der 1 wurde 3. Das ist mal 3. Also auch 2 · 3 = 6.', 'Nimm den Nenner mit derselben Zahl mal wie den Zähler.'),
        { bild: zweiStreifen(a, c), nachweis: [NB(br(...c), { figur: 'B' })] }); },
  ]);
  const tW2G = h3('Teile den neuen Nenner durch den alten Nenner. Das ist die Erweiterungszahl.', '2⁄3 auf den Nenner 12: 12 : 3 = 4. Also 2⁄3 = 8⁄12.', 'Nimm den Zähler mit der Erweiterungszahl mal.');
  const g2 = () => ({ a: gekuerzt([3, 4, 5, 6, 7, 8, 9, 12], 2), k: zz(3, 9) });
  sechs(W2, 'G', [
    () => { const { a, k } = amBild(), c = mal(a, k);
      if (c[1] < 12) return null;
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', `Erweitere ${br(...a)} auf den Nenner ${c[1]}.`, `${br(...a)} = {{a}}⁄${c[1]}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert'], [k, 'sach-frage-verfehlt']])] }, tW2G,
        { bild: zweiStreifen(a, c), nachweis: [NB(br(...c), { figur: 'B' })] }); },
    () => { const { a, k } = g2(), c = mal(a, k);
      return bruch(Z(`Erweitere ${br(...a)} auf den Nenner ${c[1]}.`), br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(a[0] + c[1] - a[1], c[1]), 'erweitern-addiert'], [br(k, c[1]), 'sach-schritt-vergessen']], tW2G,
        { genau: true, nachweis: [`${c[1]} : ${a[1]} = ${k}`, UMF(a, k, 'erweitern')] }); },
    () => { const a = wahl([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [5, 6]]), ks = mische([2, 3, 4, 5, 6, 7, 8]).slice(0, 3), r = ks.slice(0, wahl([1, 2])).map((k) => mal(a, k)), kf = ks[2];
      const f = [[a[0] * kf, a[1] * kf + a[1]], [a[0] + kf, a[1] + kf]];
      const alle = [...r.map((x) => opt(br(...x), true)), opt(br(...f[0]), false, 'erweitern-nur-ein-teil'), opt(br(...f[1]), false, 'erweitern-addiert'), ...(r.length === 1 ? [opt(br(a[0], a[1] * kf), false, 'erweitern-nur-ein-teil')] : [])];
      if (f.some((x) => x[0] * a[1] === x[1] * a[0])) return null;
      return auswahl(Z(`Im Kreis ist ${br(...a)} gefärbt.`, 'Welche Brüche sind dazu gleichwertig?', 'Kreuze alle an.'), alle,
        h3('Gleichwertige Brüche haben denselben Wert. Sie entstehen durch Erweitern.', '2⁄3 = 4⁄6 = 10⁄15. Alle drei Brüche sind gleichwertig.', 'Prüfe jeden Bruch: Wurden Zähler und Nenner mit derselben Zahl malgenommen?'),
        { mehrfach: true, bild: kreis(...a), nachweis: [WERT(br(...a), false)] }); },
    () => { const { a, k } = g2(), c = mal(a, k);
      return luecken(Z('Welcher Nenner fehlt?', `${br(...a)} = ${c[0]}⁄{{a}}`), { a: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + c[0] - a[0], 'erweitern-addiert'], [k, 'sach-frage-verfehlt']])] },
        h3('Teile den neuen Zähler durch den alten Zähler. Das ist die Erweiterungszahl.', '2⁄3 = 8⁄12: 8 : 2 = 4. Also 3 · 4 = 12.', `Rechne ${c[0]} : ${a[0]}. Nimm den Nenner mit dem Ergebnis mal.`), { nachweis: [UMF(a, k, 'erweitern', true)] }); },
    () => { const [a, k, j] = wahl([[[1, 2], 2, 4], [[1, 2], 3, 6], [[1, 2], 2, 8], [[1, 3], 2, 4], [[2, 3], 2, 4], [[1, 4], 2, 4], [[3, 4], 2, 4], [[1, 2], 5, 10], [[1, 3], 3, 6], [[2, 3], 3, 6], [[1, 5], 2, 4], [[2, 5], 2, 4]]), c = mal(a, k), d = mal(a, j);
      return luecken(Z('Alle drei Streifen sind gleich weit gefärbt.', 'Welche Zähler fehlen?', `${br(...a)} = {{a}}⁄${c[1]} = {{b}}⁄${d[1]}`), { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert']])], b: [d[0], fehlerliste(d[0], [[a[0], 'erweitern-nur-ein-teil'], [c[0], 'erweitern-nur-ein-teil'], [a[0] + d[1] - a[1], 'erweitern-addiert']])] },
        h3('Vergleiche jeden Nenner mit dem ersten Nenner. Mit welcher Zahl wurde malgenommen?', '1⁄2 = 2⁄4 = 4⁄8. Alle drei Brüche sind gleichwertig.', 'Nimm den Zähler mit derselben Zahl mal wie den Nenner.'),
        { bild: bild(...benenne([fig('streifen', a[1], vorn(a[0])), fig('streifen', c[1], vorn(c[0])), fig('streifen', d[1], vorn(d[0]))])), nachweis: [NB(br(...c), { figur: 'B' }), NB(br(...d), { figur: 'C' })] }); },
    () => { const a = gekuerzt([3, 4, 5, 6], 2), k = zz(3, 6), c = mal(a, k), kn = kind(), stimmt = wahl([true, false, false]), falle = [a[0] * (k - 1), c[1]], gesagt = stimmt ? c : falle, glg = (x) => `${br(...a)} = ${br(...x)}`;
      return urteil(kn, Z(`Im Kreis ist ${br(...a)} gefärbt.`, `${kn} sagt: ${glg(gesagt)}`, 'Stimmt das?'), stimmt, glg(gesagt), glg(stimmt ? falle : c), [glg([a[0], c[1]])], 'erweitern-nur-ein-teil',
        h3('Finde die Erweiterungszahl am Nenner. Prüfe sie am Zähler.', '2⁄3 = 8⁄12: 12 : 3 = 4 und 2 · 4 = 8. Das stimmt.', `Rechne ${c[1]} : ${a[1]}. Nimm den Zähler mit dem Ergebnis mal.`), { bild: kreis(...a) }); },
  ]);
  const m2 = () => ({ a: gekuerzt([7, 8, 9, 11, 12, 13, 15, 16], 2), k: zz(6, 12) });
  sechs(W2, 'M', [
    () => { const { a, k } = m2(), c = mal(a, k);
      return luecken(`Erweitere auf den Nenner ${c[1]}: ${br(...a)} = {{a}}⁄${c[1]}`, { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert'], [k, 'sach-schritt-vergessen']])] },
        h2('Finde zuerst die Erweiterungszahl: Teile den neuen Nenner durch den alten.', `Rechne ${c[1]} : ${a[1]} = ${k}. Nimm den Zähler mit ${k} mal.`), { nachweis: [`${c[1]} : ${a[1]} = ${k}`, UMF(a, k, 'erweitern')] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 7, 8, 9], 2), [k, j] = mische([3, 4, 5, 6, 7, 8, 9, 11, 12]).slice(0, 2), c = mal(a, k), d = mal(a, j);
      return luecken(`Die drei Brüche sind gleichwertig. Welche Zahlen fehlen? ${br(...a)} = {{a}}⁄${c[1]} = ${d[0]}⁄{{b}}`, { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert']])], b: [d[1], fehlerliste(d[1], [[a[1], 'erweitern-nur-ein-teil'], [c[1], 'erweitern-nur-ein-teil'], [a[1] + d[0] - a[0], 'erweitern-addiert']])] },
        h2('Vergleiche jeden Bruch mit dem ersten. Einmal findest du die Erweiterungszahl am Nenner, einmal am Zähler.', `Rechne ${c[1]} : ${a[1]} für die erste Lücke und ${d[0]} : ${a[0]} für die zweite.`), { nachweis: [UMF(a, k, 'erweitern', true), UMF(a, j, 'erweitern', true)] }); },
    () => { const N = wahl([24, 36, 40, 48, 60]), ja = mische([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20].filter((n) => N % n === 0 && n > 2)), nein = mische([5, 7, 8, 9, 14, 16, 18, 25, 32, 45, 50].filter((n) => N % n !== 0)), r = zz(2, 3);
      const brueche = [...ja.slice(0, r), ...nein.slice(0, 5 - r)].map((n) => [gekuerzt([n])[0], n]);
      return auswahl(`Welche Brüche lassen sich auf den Nenner ${N} erweitern? Kreuze alle an.`, brueche.map((x) => opt(br(...x), N % x[1] === 0, N % x[1] === 0 ? undefined : 'erweitern-addiert')),
        h2(`Ein Bruch lässt sich nur dann auf den Nenner ${N} erweitern, wenn ${N} ein Vielfaches seines Nenners ist.`, `Prüfe bei jedem Bruch: Geht ${N} geteilt durch den Nenner ohne Rest auf?`), { mehrfach: true, nachweis: [{ art: 'erweiterbar', nenner: N }] }); },
    () => { const n = wahl([4, 5, 10, 20, 25, 50]), a = gekuerzt([n]), k = 100 / n, c = mal(a, k);
      return bruch(`Erweitere ${br(...a)} auf den Nenner 100.`, br(...c), [[br(a[0], 100), 'erweitern-nur-ein-teil'], [br(k, 100), 'sach-schritt-vergessen'], [br(a[0] + 100 - n, 100), 'erweitern-addiert']],
        h2('Finde zuerst die Erweiterungszahl: Wie oft passt der alte Nenner in die 100?', `Rechne 100 : ${n} = ${k}. Nimm den Zähler mit ${k} mal.`), { genau: true, nachweis: [`100 : ${n} = ${k}`, UMF(a, k, 'erweitern')] }); },
    () => { const [n1, n2, N] = wahl([[3, 4, 12], [4, 6, 12], [3, 5, 15], [4, 5, 20], [6, 8, 24], [3, 8, 24], [4, 10, 20], [6, 9, 18], [5, 6, 30], [8, 12, 24], [9, 12, 36], [6, 10, 30]]), a = gekuerzt([n1]), c = gekuerzt([n2]), ka = N / n1, kc = N / n2;
      return luecken(Z(`Bringe beide Brüche auf den Nenner ${N}.`, `${br(...a)} = {{a}}⁄${N}`, `${br(...c)} = {{b}}⁄${N}`), { a: [a[0] * ka, fehlerliste(a[0] * ka, [[a[0], 'erweitern-nur-ein-teil'], [ka, 'sach-schritt-vergessen'], [a[0] * kc, 'sach-falsche-rechnung']])], b: [c[0] * kc, fehlerliste(c[0] * kc, [[c[0], 'erweitern-nur-ein-teil'], [kc, 'sach-schritt-vergessen'], [c[0] * ka, 'sach-falsche-rechnung']])] },
        h2('Jeder Bruch hat seine eigene Erweiterungszahl: neuer Nenner geteilt durch alten Nenner.', `Rechne ${N} : ${n1} = ${ka} für den ersten Bruch und ${N} : ${n2} = ${kc} für den zweiten.`), { nachweis: [`${N} : ${n1} = ${ka}`, UMF(a, ka, 'erweitern'), `${N} : ${n2} = ${kc}`, UMF(c, kc, 'erweitern')] }); },
    () => { const [n1, n2, N] = wahl([[4, 6, 12], [6, 8, 24], [6, 9, 18], [8, 12, 24], [9, 12, 36], [6, 10, 30], [10, 15, 30], [8, 10, 40], [4, 10, 20], [12, 16, 48]]);
      return zahl(`Zwei Brüche haben die Nenner ${n1} und ${n2}. Auf welchen gemeinsamen Nenner kannst du beide erweitern? Gib den kleinsten an.`, N, fehlerliste(N, [[n1 * n2, 'sach-frage-verfehlt'], [n1 + n2, 'erweitern-addiert'], [Math.max(n1, n2), 'sach-schritt-vergessen']]),
        h2('Der gemeinsame Nenner muss ein Vielfaches von beiden Nennern sein.', `Schreibe die Vielfachen von ${Math.max(n1, n2)} auf. Das erste, in dem auch die ${Math.min(n1, n2)} aufgeht, ist die Lösung.`), { nachweis: [{ art: 'kgv', zahlen: [n1, n2], zahl: N }] }); },
  ]);
  sechs(W2, 'E', [
    () => { const a = gekuerzt([14, 15, 16, 18, 24, 25, 36], 5), k = zz(8, 19), c = mal(a, k);
      return luecken(`Erweitere auf den Nenner ${c[1]}: ${br(...a)} = {{a}}⁄${c[1]}`, { a: [c[0], fehlerliste(c[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[1] - a[1], 'erweitern-addiert'], [k, 'sach-schritt-vergessen']])] },
        h1('Teile den neuen Nenner durch den alten. Mit dem Ergebnis erweiterst du.'), { nachweis: [`${c[1]} : ${a[1]} = ${k}`, UMF(a, k, 'erweitern')] }); },
    () => { const a = gekuerzt([12, 15, 16, 18, 24, 25], 5), k = zz(7, 15), c = mal(a, k);
      return luecken(`Welcher Zähler fehlt? {{a}}⁄${a[1]} = ${br(...c)}`, { a: [a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [k, 'sach-frage-verfehlt'], [c[0] - (c[1] - a[1]), 'erweitern-addiert']])] },
        h1('Hier wurde von links nach rechts erweitert. Finde die Erweiterungszahl an den Nennern.'), { nachweis: [`${c[1]} : ${a[1]} = ${k}`, `${c[0]} : ${k} = ${a[0]}`] }); },
    () => { const a = gekuerzt([7, 8, 9, 12, 15], 2), ks = mische([6, 7, 8, 9, 11, 12, 13, 15]), r = zz(2, 3), richtige = ks.slice(0, r).map((k) => mal(a, k));
      const falsche = ks.slice(r, 5).map((k, i) => (i % 2 ? [a[0] * k, a[1] * (k + 1)] : [a[0] * k + 1, a[1] * k]));
      return auswahl(`Welche Brüche sind gleichwertig zu ${br(...a)}? Kreuze alle an.`, [...richtige.map((x) => opt(br(...x), true)), ...falsche.map((x) => opt(br(...x), false, 'erweitern-nur-ein-teil'))],
        h1('Teile bei jedem Bruch den Nenner durch den Nenner des ersten Bruchs. Passt dieselbe Zahl auch beim Zähler?'), { mehrfach: true, nachweis: [WERT(br(...a), false)] }); },
    () => { const N = wahl([100, 120, 150, 200]), ja = mische([4, 5, 8, 10, 12, 15, 20, 24, 25, 30, 40, 50, 60, 75].filter((n) => N % n === 0)), nein = mische([6, 7, 8, 9, 12, 15, 16, 18, 30, 35, 45, 48, 80].filter((n) => N % n !== 0)), r = zz(2, 4);
      const brueche = [...ja.slice(0, r), ...nein.slice(0, 6 - r)].map((n) => [gekuerzt([n])[0], n]);
      return auswahl(`Welche Brüche lassen sich auf den Nenner ${N} erweitern? Kreuze alle an.`, brueche.map((x) => opt(br(...x), N % x[1] === 0, N % x[1] === 0 ? undefined : 'erweitern-addiert')),
        h1(`Nur wenn ${N} ein Vielfaches des Nenners ist, gibt es eine Erweiterungszahl.`), { mehrfach: true, nachweis: [{ art: 'erweiterbar', nenner: N }] }); },
    () => { const a = gekuerzt([11, 12, 13, 15, 16, 18], 5), k = zz(8, 14), c = mal(a, k);
      return zahl(`Ein Bruch ist gleichwertig zu ${br(...a)} und hat den Zähler ${c[0]}. Wie heißt sein Nenner?`, c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + c[0] - a[0], 'erweitern-addiert'], [k, 'sach-frage-verfehlt']]),
        h1('Finde die Erweiterungszahl an den beiden Zählern. Erweitere dann den Nenner.'), { nachweis: [`${c[0]} : ${a[0]} = ${k}`, UMF(a, k, 'erweitern')] }); },
    () => { const a = gekuerzt([7, 8, 9, 12, 15], 2), anzahl = zz(4, 9), G = a[1] * anzahl;
      return zahl(`Wie viele Brüche mit einem Nenner von höchstens ${G} sind gleichwertig zu ${br(...a)}? Zähle ${br(...a)} selbst mit, und zähle nur Brüche, die durch Erweitern entstehen.`, anzahl, fehlerliste(anzahl, [[anzahl - 1, 'sach-frage-verfehlt'], [anzahl + 1, 'bruchstrahl-striche'], [G - a[1], 'erweitern-addiert']]),
        h1('Jede Erweiterungszahl gibt einen neuen Nenner. Wie viele Vielfache des Nenners sind erlaubt?'), { nachweis: [`${G} : ${a[1]} = ${anzahl}`, HILFS(br(...a), 'Ausgangsbruch, alle gezählten Brüche sind zu ihm gleichwertig')] }); },
  ]);
}
