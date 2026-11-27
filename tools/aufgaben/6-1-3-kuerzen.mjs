// Aufgaben zu 6.1.3 „Brüche kürzen“ (Lernziele K1, K2) nach ADR 0015 und ADR 0037.
// K1: einen Bruch mit einer Zahl kürzen (genau dieser Bruch zählt). K2: vollständig kürzen (gekuerzt: true).
// Grilling mit Nils (2026-11-24): Gekürzt wird schrittweise. Die Teilbarkeitsregeln für 2, 3, 5 und 10 stehen auf den Hilfekärtchen,
// der größte gemeinsame Teiler kommt erst auf E. Ein noch kürzbares Ergebnis ist „fast richtig“ und kostet keinen Versuch.

import { sechs, auswahl, luecken, zahl, bruch, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, streu, fig, bild, NB, WERT, UMF, HILFS, gekuerzt, zweiStreifen, streifen, kreis, br, opt, zz, wahl, mische, ggt } from './6-1-brueche.mjs';

const K1 = '6.1.3-K1', K2 = '6.1.3-K2';
const mal = ([z, n], k) => [z * k, n * k];
// Ein gekürzter Bruch a und eine Zahl k, sodass der erweiterte Bruch c in einen Streifen passt (höchstens 20 Teile).
const amBild = (ks = [2, 3, 5, 10]) => { const [n, k] = wahl([[2, 2], [2, 3], [2, 5], [2, 10], [3, 2], [3, 3], [3, 5], [4, 2], [4, 3], [4, 5], [5, 2], [5, 3], [6, 2], [6, 3], [10, 2], [3, 4], [3, 6], [4, 4], [2, 6], [2, 8], [5, 4], [2, 4]].filter(([, x]) => ks.includes(x))), a = gekuerzt([n]); return { a, k, c: mal(a, k) }; };
const figur = (c) => (c[1] <= 12 ? kreis(...c) : streifen(...c));
const urteil = (sagt, stimmt, beh, richtigGlg, falschGlg, fv, hilfen, extra = {}) => auswahl(sagt, [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Es gilt ${richtigGlg}.`, !stimmt, stimmt ? fv : undefined), ...falschGlg.map((g) => opt(`Falsch. Es gilt ${g}.`, false, fv))], hilfen, { ...extra, nachweis: [{ art: 'urteil', stimmt, behauptung: beh }] });
const REGELN = 'Durch 2 teilbar: Die letzte Ziffer ist gerade. Durch 5 teilbar: Die letzte Ziffer ist 0 oder 5. Durch 3 teilbar: Die Quersumme ist durch 3 teilbar.';

export function kuerzen() {
  // ================= K1: mit einer Zahl kürzen =================
  const tK1 = h3('Kürzen heißt: Teile den Zähler und den Nenner durch dieselbe Zahl.', '4⁄6 mit 2 gekürzt: 4 : 2 = 2 und 6 : 2 = 3. Also 4⁄6 = 2⁄3.', 'Teile zuerst den Zähler durch die Zahl. Teile dann den Nenner durch die Zahl.');
  const fK1 = (c, k) => [[br(c[0] / k, c[1]), 'erweitern-nur-ein-teil'], [br(c[0] * k, c[1] * k), 'erweitern-kuerzen-verwechselt']];
  sechs(K1, 'F', [
    () => { const { a, k, c } = amBild();
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', `Kürze mit ${k}.`, `${br(...c)} = {{a}}⁄{{b}}`), { a: [a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [c[0] * k, 'erweitern-kuerzen-verwechselt']])], b: [a[1], fehlerliste(a[1], [[c[1], 'erweitern-nur-ein-teil'], [c[1] * k, 'erweitern-kuerzen-verwechselt']])] }, tK1,
        { bild: zweiStreifen(c, a), nachweis: [UMF(c, k, 'kuerzen'), NB(br(...a), { figur: 'B' })] }); },
    () => { const { a, k, c } = amBild();
      if (c[0] - k < 1) return null;
      return auswahl(Z(`Kürze ${br(...c)} mit ${k}.`, 'Welcher Bruch stimmt?'), [opt(br(...a), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(c[0] - k, c[1] - k), false)], tK1,
        { bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen'), WERT(br(...a), true)] }); },
    () => { const { a, k, c } = amBild();
      return bruch(Z(`Kürze ${br(...c)} mit ${k}.`, 'Schreibe den neuen Bruch.'), br(...a), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0] * k, c[1] * k), 'erweitern-kuerzen-verwechselt']], tK1,
        { genau: true, bild: figur(c), nachweis: [UMF(c, k, 'kuerzen')] }); },
    () => { const { a, k, c } = amBild();
      return luecken(Z('Beide Streifen sind gleich weit gefärbt.', `Kürze mit ${k}.`, `${br(...c)} = {{a}}⁄${a[1]}`), { a: [a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [c[0] * k, 'erweitern-kuerzen-verwechselt'], [k, 'sach-frage-verfehlt']])] },
        h3('Der Nenner ist schon gekürzt. Jetzt fehlt noch der Zähler.', '4⁄6 mit 2 gekürzt: 4 : 2 = 2 und 6 : 2 = 3. Also 4⁄6 = 2⁄3.', `Teile den Zähler durch ${k}.`),
        { bild: zweiStreifen(c, a), nachweis: [UMF(c, k, 'kuerzen'), NB(br(...a), { figur: 'B' })] }); },
    () => { const { a, k, c } = amBild();
      if (c[0] - k < 1) return null;
      return auswahl(Z(`Im Streifen ist ${br(...c)} gefärbt.`, `Immer ${k} Teile werden zu einem Teil zusammengefasst.`, 'Welcher Bruch ist jetzt gefärbt?'), [opt(br(...a), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(c[0] - k, c[1] - k), false)],
        h3('Aus mehreren kleinen Teilen wird ein großes Teil. Das gilt auch für die gefärbten Teile.', 'Fasst du bei 4⁄6 immer 2 Teile zusammen, dann sind 2 von 3 Teilen gefärbt.', `Teile den Zähler durch ${k} und den Nenner durch ${k}.`),
        { bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen'), WERT(br(...a), true)] }); },
    () => { const { a, k, c } = amBild();
      return zahl(Z(`Du kürzt ${br(...c)} mit ${k}.`, 'Wie heißt der neue Zähler?'), a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [a[1], 'bruch-vertauscht'], [c[0] * k, 'erweitern-kuerzen-verwechselt']]),
        h3('Der Zähler steht über dem Bruchstrich. Auch er wird geteilt.', '4⁄6 mit 2 gekürzt: Der neue Zähler ist 4 : 2 = 2.', `Rechne ${c[0]} : ${k}.`),
        { bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen')] }); },
  ]);
  const tK1G = h3('Teile den Zähler und den Nenner durch die Kürzungszahl.', '12⁄18 mit 6 gekürzt: 12 : 6 = 2 und 18 : 6 = 3. Also 12⁄18 = 2⁄3.', 'Rechne zuerst den neuen Zähler aus. Rechne dann den neuen Nenner aus.');
  const g1 = () => { const a = gekuerzt([3, 4, 5, 6, 7, 8, 9, 11, 12], 2), k = zz(4, 9); return { a, k, c: mal(a, k) }; };
  sechs(K1, 'G', [
    () => { const { a, k, c } = g1();
      return bruch(Z(`Kürze ${br(...c)} mit ${k}.`), br(...a), fK1(c, k), tK1G, { genau: true, nachweis: [UMF(c, k, 'kuerzen')] }); },
    () => { const { a, k, c } = amBild([3, 4, 5, 6, 8]);
      return luecken(Z(`Im Streifen ist ${br(...c)} gefärbt.`, `Kürze mit ${k}.`, `${br(...c)} = {{a}}⁄{{b}}`), { a: [a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [c[0] * k, 'erweitern-kuerzen-verwechselt']])], b: [a[1], fehlerliste(a[1], [[c[1], 'erweitern-nur-ein-teil'], [c[1] * k, 'erweitern-kuerzen-verwechselt']])] }, tK1G,
        { bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen')] }); },
    () => { const { a, k, c } = g1();
      return zahl(Z(`${br(...c)} wurde gekürzt zu ${br(...a)}.`, 'Wie heißt die Kürzungszahl?'), k, fehlerliste(k, [[c[1] - a[1], 'kuerzen-subtrahiert'], [c[0] - a[0], 'kuerzen-subtrahiert'], [k + 1, 'div-einmaleins'], [k - 1, 'div-einmaleins']]),
        h3('Vergleiche die beiden Nenner. Durch welche Zahl wurde geteilt?', '12⁄18 = 2⁄3: Aus der 18 wurde 3. Die Kürzungszahl ist 6.', `Rechne ${c[1]} : ${a[1]}.`), { nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const { a, k, c } = amBild([3, 4, 5, 6]);
      if (c[0] - k < 1) return null;
      return auswahl(Z(`Im Streifen ist ${br(...c)} gefärbt.`, `Kürze mit ${k}.`, 'Welcher Bruch stimmt?'), [opt(br(...a), true), opt(br(a[0], c[1]), false, 'erweitern-nur-ein-teil'), opt(br(c[0] - k, c[1] - k), false)], tK1G,
        { bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen'), WERT(br(...a), true)] }); },
    () => { const c = wahl([[12, 18], [8, 12], [12, 16], [6, 12], [10, 20], [8, 20], [6, 18], [12, 20], [4, 12], [9, 18]]), g = ggt(...c), ja = mische(vorn(g - 1, 2).filter((t) => g % t === 0)).slice(0, 2), nein = mische([2, 3, 4, 5, 6, 8, 9].filter((t) => c[0] % t !== 0 || c[1] % t !== 0)).slice(0, 4 - ja.length);
      if (ja.length < 1 || ja.length + nein.length !== 4) return null;
      return auswahl(Z(`Im Streifen ist ${br(...c)} gefärbt.`, 'Mit welchen Zahlen kannst du den Bruch kürzen?', 'Kreuze alle an.'), [...ja.map((t) => opt(String(t), true)), ...nein.map((t) => opt(String(t), false, 'erweitern-nur-ein-teil'))],
        h3('Die Kürzungszahl muss in den Zähler und in den Nenner passen.', '12⁄18 lässt sich mit 6 kürzen: 12 : 6 = 2 und 18 : 6 = 3.', `Prüfe jede Zahl: Ist ${c[0]} durch sie teilbar? Ist auch ${c[1]} durch sie teilbar?`),
        { mehrfach: true, bild: streifen(...c), nachweis: [{ art: 'kuerzbar', bruch: br(...c) }] }); },
    () => { const { a, k, c } = g1(), kn = kind(), stimmt = wahl([true, false, false]), falle = [a[0], c[1]], gesagt = stimmt ? a : falle, glg = (x) => `${br(...c)} = ${br(...x)}`;
      return urteil(Z(`${kn} kürzt ${br(...c)} mit ${k}.`, `${kn} rechnet: ${glg(gesagt)}`, 'Stimmt das?'), stimmt, glg(gesagt), glg(stimmt ? falle : a), [glg([c[0], a[1] * k * 2])], 'erweitern-nur-ein-teil',
        h3('Beim Kürzen ändern sich immer beide Zahlen: der Zähler und der Nenner.', '4⁄6 mit 2 gekürzt ist 2⁄3. Der Bruch 2⁄6 ist falsch.', `Prüfe: Ist der Zähler ${c[0]} : ${k}? Ist der Nenner ${c[1]} : ${k}?`)); },
  ]);
  const m1 = () => { const a = gekuerzt([7, 8, 9, 11, 12, 13, 15, 16, 20, 25], 2), k = zz(6, 12); return { a, k, c: mal(a, k) }; };
  sechs(K1, 'M', [
    () => { const { a, k, c } = m1();
      return bruch(`Kürze ${br(...c)} mit ${k}.`, br(...a), fK1(c, k), h2('Beim Kürzen teilst du Zähler und Nenner durch dieselbe Zahl.', `Rechne ${c[0]} : ${k} für den Zähler und ${c[1]} : ${k} für den Nenner.`), { genau: true, nachweis: [UMF(c, k, 'kuerzen')] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 7, 8, 9, 11], 2), k = zz(2, 5), j = wahl([2, 3, 4, 5, 6, 7].filter((x) => x !== k)), d = mal(a, j), c = mal(d, k);
      return bruch(`Kürze ${br(...c)} zuerst mit ${k}. Kürze das Ergebnis dann mit ${j}. Wie heißt der Bruch am Ende?`, br(...a), [[br(...d), 'sach-schritt-vergessen'], [br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0] / k, c[1]), 'erweitern-nur-ein-teil']],
        h2('Kürze in zwei Schritten. Schreibe das Zwischenergebnis auf.', `Nach dem ersten Schritt heißt der Bruch ${br(...d)}. Kürze ihn jetzt mit ${j}.`), { genau: true, nachweis: [UMF(c, k, 'kuerzen'), UMF(d, j, 'kuerzen')] }); },
    () => { const { a, k, c } = m1();
      return zahl(`${br(...c)} wurde gekürzt. Herausgekommen ist ${br(...a)}. Mit welcher Zahl wurde gekürzt?`, k, fehlerliste(k, [[c[1] - a[1], 'kuerzen-subtrahiert'], [c[0] - a[0], 'kuerzen-subtrahiert'], [k + 1, 'div-einmaleins'], [k - 1, 'div-einmaleins']]),
        h2('Vergleiche die beiden Nenner oder die beiden Zähler: Durch welche Zahl wurde geteilt?', `Rechne ${c[1]} : ${a[1]}. Prüfe das Ergebnis am Zähler.`), { nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const { a, k, c } = m1();
      return luecken(`Kürze mit ${k}: ${br(...c)} = {{a}}⁄{{b}}`, { a: [a[0], fehlerliste(a[0], [[c[0], 'erweitern-nur-ein-teil'], [c[0] * k, 'erweitern-kuerzen-verwechselt']])], b: [a[1], fehlerliste(a[1], [[c[1], 'erweitern-nur-ein-teil'], [c[1] * k, 'erweitern-kuerzen-verwechselt']])] },
        h2('Beim Kürzen teilst du Zähler und Nenner durch dieselbe Zahl.', `Rechne ${c[0]} : ${k} und ${c[1]} : ${k}.`), { nachweis: [UMF(c, k, 'kuerzen')] }); },
    () => { const c = wahl([[36, 48], [24, 36], [30, 45], [24, 60], [18, 54], [40, 60], [36, 60], [48, 72], [30, 75], [42, 84]]), teiler = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15], ja = mische(teiler.filter((t) => c[0] % t === 0 && c[1] % t === 0)), nein = mische(teiler.filter((t) => c[0] % t !== 0 || c[1] % t !== 0)), r = zz(2, 3);
      if (ja.length < r || nein.length < 5 - r) return null;
      return auswahl(`Mit welchen Zahlen lässt sich ${br(...c)} kürzen? Kreuze alle an.`, [...ja.slice(0, r).map((t) => opt(String(t), true)), ...nein.slice(0, 5 - r).map((t) => opt(String(t), false, 'erweitern-nur-ein-teil'))],
        h2('Eine Kürzungszahl muss ein Teiler vom Zähler und vom Nenner sein.', `Prüfe jede Zahl mit den Teilbarkeitsregeln: Geht ${c[0]} auf und geht auch ${c[1]} auf?`), { mehrfach: true, nachweis: [{ art: 'kuerzbar', bruch: br(...c) }] }); },
    () => { const a = gekuerzt([3, 4, 5, 6, 7, 8], 1), k = wahl([4, 6, 8, 9, 10, 12]), j = wahl([2, 3, 4, 5, 6].filter((x) => k % x === 0 && x !== k)), c = mal(a, k), kn = kind(), stimmt = wahl([true, false, false]), falle = [a[0], (c[1] / j)], gesagt = stimmt ? a : falle, glg = (x) => `${br(...c)} = ${br(...x)}`;
      return urteil(`${kn} kürzt ${br(...c)} so: Den Zähler teilt ${kn} durch ${k}, den Nenner durch ${stimmt ? k : j}. Das Ergebnis ist ${br(...gesagt)}. Stimmt die Gleichung ${glg(gesagt)}?`, stimmt, glg(gesagt), glg(stimmt ? falle : a), [glg([c[0] / j, a[1]]), glg([a[0], c[1]])], 'erweitern-nur-ein-teil',
        h2('Der Wert eines Bruchs bleibt nur gleich, wenn Zähler und Nenner durch dieselbe Zahl geteilt werden.', `Kürze selbst: Teile ${c[0]} und ${c[1]} beide durch ${k}.`)); },
  ]);
  sechs(K1, 'E', [
    () => { const a = gekuerzt([3, 4, 5, 7, 8, 9], 2), [k, j, l] = mische([2, 3, 4, 5, 6]).slice(0, 3), d = mal(a, l), e = mal(d, j), c = mal(e, k);
      return bruch(`Kürze ${br(...c)} nacheinander mit ${k}, mit ${j} und mit ${l}. Wie heißt der Bruch am Ende?`, br(...a), [[br(...d), 'sach-schritt-vergessen'], [br(...e), 'sach-schritt-vergessen'], [br(a[0], c[1]), 'erweitern-nur-ein-teil']],
        h1('Schreibe jedes Zwischenergebnis auf. Oder überlege, mit welcher einen Zahl du gleich kürzen kannst.'), { genau: true, nachweis: [UMF(c, k, 'kuerzen'), UMF(e, j, 'kuerzen'), UMF(d, l, 'kuerzen')] }); },
    () => { const k = zz(3, 9), j = wahl([4, 5, 6, 7, 8, 12].filter((x) => x !== k));
      return zahl(`Ein Bruch wird zuerst mit ${k} und dann mit ${j} gekürzt. Mit welcher einen Zahl hättest du ihn gleich kürzen können?`, k * j, fehlerliste(k * j, [[k + j, 'kuerzen-subtrahiert'], [Math.max(k, j), 'sach-schritt-vergessen'], [k * j + k, 'sach-falsche-rechnung']]),
        h1('Probiere es mit einem Bruch aus, der sich so kürzen lässt. Vergleiche den Nenner am Anfang mit dem Nenner am Ende.'), { nachweis: [`${k} · ${j} = ${k * j}`] }); },
    () => { const a = gekuerzt([7, 8, 9, 11, 12, 13, 15], 3), k = zz(14, 28), c = mal(a, k);
      return zahl(`${br(...c)} wurde in einem Schritt zu ${br(...a)} gekürzt. Mit welcher Zahl?`, k, fehlerliste(k, [[c[1] - a[1], 'kuerzen-subtrahiert'], [c[0] - a[0], 'kuerzen-subtrahiert'], [k + 1, 'div-einmaleins'], [k - 2, 'div-einmaleins']]),
        h1('Teile den alten Nenner durch den neuen Nenner. Prüfe das Ergebnis am Zähler.'), { nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const c = wahl([[72, 108], [60, 90], [84, 126], [96, 144], [90, 150], [120, 168], [108, 180], [72, 120], [126, 168]]), teiler = [2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 15, 16, 18, 21, 24, 36], ja = mische(teiler.filter((t) => c[0] % t === 0 && c[1] % t === 0)), nein = mische(teiler.filter((t) => c[0] % t !== 0 || c[1] % t !== 0)), r = zz(2, 4);
      if (ja.length < r || nein.length < 6 - r) return null;
      return auswahl(`Mit welchen Zahlen lässt sich ${br(...c)} kürzen? Kreuze alle an.`, [...ja.slice(0, r).map((t) => opt(String(t), true)), ...nein.slice(0, 6 - r).map((t) => opt(String(t), false, 'erweitern-nur-ein-teil'))],
        h1('Zerlege große Zahlen: Durch 12 ist eine Zahl teilbar, wenn sie durch 3 und durch 4 teilbar ist.'), { mehrfach: true, nachweis: [{ art: 'kuerzbar', bruch: br(...c) }] }); },
    () => { const a = gekuerzt([7, 8, 9, 11, 12, 13, 15, 16], 3), k = zz(7, 15), c = mal(a, k);
      return bruch(`Ein Bruch wurde mit ${k} gekürzt. Herausgekommen ist ${br(...a)}. Wie hieß der Bruch vorher?`, br(...c), [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil'], [br(a[0] + k, a[1] + k), 'kuerzen-subtrahiert']],
        h1('Kürzen lässt sich durch Erweitern rückgängig machen.'), { genau: true, nachweis: [UMF(a, k, 'erweitern')] }); },
    () => { const c = wahl([[36, 48], [24, 36], [40, 60], [36, 60], [48, 72], [30, 45], [24, 60], [54, 72], [32, 48], [45, 75]]), g = ggt(...c), anzahl = vorn(g - 1, 2).filter((t) => g % t === 0).length;
      return zahl(`Mit wie vielen verschiedenen Zahlen kannst du ${br(...c)} kürzen? Zähle nur Zahlen, die größer als 1 sind.`, anzahl, fehlerliste(anzahl, [[anzahl + 1, 'sach-frage-verfehlt'], [anzahl - 1, 'sach-schritt-vergessen'], [g, 'sach-frage-verfehlt'], [1, 'kuerzen-nicht-vollstaendig']]),
        h1('Jede Kürzungszahl ist ein gemeinsamer Teiler von Zähler und Nenner. Schreibe alle gemeinsamen Teiler auf.'), { nachweis: [{ art: 'gemeinsameTeiler', bruch: br(...c), zahl: anzahl }, HILFS(1, 'Kürzen mit 1 ändert den Bruch nicht')] }); },
  ]);

  // ================= K2: vollständig kürzen =================
  const tK2 = h3('Suche eine Zahl, die in den Zähler und in den Nenner passt. Teile beide durch sie.', '6⁄8: Beide Zahlen sind gerade. 6 : 2 = 3 und 8 : 2 = 4. Also 6⁄8 = 3⁄4.', 'Prüfe am Ende: Passt noch eine Zahl in beide? Dann kürze weiter.');
  const fK2 = (c, a) => [[br(a[0], c[1]), 'erweitern-nur-ein-teil'], [br(c[0], a[1]), 'erweitern-nur-ein-teil']].filter(([, , x]) => !x);
  sechs(K2, 'F', [
    () => { const { a, k, c } = amBild([2, 3, 5]);
      return bruch(Z(`Im Streifen ist ${br(...c)} gefärbt.`, 'Kürze so weit wie möglich.'), br(...a), fK2(c, a), tK2, { gekuerzt: true, bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const a = wahl([[1, 2], [1, 3], [2, 3]]), k = wahl([2, 3]), d = mal(a, k), c = mal(d, 2);
      if (c[1] > 12) return null;
      return auswahl(Z(`Im Kreis ist ${br(...c)} gefärbt.`, 'Alle drei Brüche sind gleich groß.', 'Welcher Bruch ist so weit wie möglich gekürzt?'), [opt(br(...a), true), opt(br(...d), false, 'kuerzen-nicht-vollstaendig'), opt(br(...c), false, 'kuerzen-nicht-vollstaendig')],
        h3('Ein Bruch ist fertig gekürzt: Keine Zahl außer 1 passt in Zähler und Nenner.', '2⁄4 ist noch nicht fertig, denn 2 passt in beide Zahlen. 1⁄2 ist fertig.', 'Prüfe jeden Bruch: Passt die 2 oder die 3 in beide Zahlen?'),
        { bild: kreis(...c), nachweis: [{ art: 'gekuerztwahl' }] }); },
    () => { const { a, k, c } = amBild([2, 3, 5]);
      return bruch(Z('Welcher Bruchteil ist gefärbt?', 'Kürze so weit wie möglich.'), br(...a), fK2(c, a),
        h3('Zähle zuerst alle Teile und die gefärbten Teile. Kürze dann den Bruch.', 'Von 8 Teilen sind 6 gefärbt. 6⁄8 = 3⁄4.', `Im Bild ist ${br(...c)} gefärbt. Teile beide Zahlen durch ${k}.`),
        { gekuerzt: true, bild: bild(fig('streifen', c[1], streu(c[1], c[0]))), nachweis: [NB(br(...c)), UMF(c, k, 'kuerzen', true)] }); },
    () => { const a = wahl([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]]), d = mal(a, 2), c = mal(d, 2);
      return luecken(Z(`Im Streifen ist ${br(...c)} gefärbt.`, 'Kürze zweimal mit 2.', `${br(...c)} = {{a}}⁄${d[1]} = {{b}}⁄${a[1]}`), { a: [d[0], fehlerliste(d[0], [[c[0], 'erweitern-nur-ein-teil'], [a[0], 'sach-schritt-vergessen']])], b: [a[0], fehlerliste(a[0], [[d[0], 'kuerzen-nicht-vollstaendig'], [c[0], 'erweitern-nur-ein-teil']])] },
        h3('Kürze Schritt für Schritt. Teile jedes Mal Zähler und Nenner durch 2.', '4⁄8 = 2⁄4 = 1⁄2. Zweimal wurde mit 2 gekürzt.', `Rechne ${c[0]} : 2. Teile das Ergebnis noch einmal durch 2.`),
        { bild: streifen(...c), nachweis: [UMF(c, 2, 'kuerzen'), UMF(d, 2, 'kuerzen')] }); },
    () => { const a = wahl([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), [k, j] = wahl([[2, 2], [2, 3], [3, 2], [2, 5], [5, 2]]), d = mal(a, j), c = mal(d, k), kn = kind();
      if (d[1] > 20) return null;
      return bruch(Z(`${kn} kürzt ${br(...c)} mit ${k}.`, `Das Ergebnis ist ${br(...d)}.`, 'Kürze weiter, so weit es geht.'), br(...a), fK2(d, a),
        h3('Der Bruch ist noch nicht fertig. Suche noch eine Zahl für Zähler und Nenner.', '4⁄8 = 2⁄4. Jetzt passt die 2 noch einmal in beide Zahlen: 2⁄4 = 1⁄2.', `Teile ${d[0]} und ${d[1]} beide durch ${j}.`),
        { gekuerzt: true, bild: streifen(...d), nachweis: [UMF(c, k, 'kuerzen'), UMF(d, j, 'kuerzen', true)] }); },
    () => { const z = wahl([10, 30, 70, 90]), c = [z, 100], a = [z / 10, 10];
      return bruch(Z(`Im Hunderterfeld ist ${br(...c)} gefärbt.`, 'Kürze so weit wie möglich.'), br(...a), [[br(a[0], 100), 'erweitern-nur-ein-teil'], [br(z, 10), 'erweitern-nur-ein-teil']].filter(([w]) => !/^(\d+)⁄\1$/.test(w) && Number(w.split('⁄')[0]) < Number(w.split('⁄')[1])),
        h3('Beide Zahlen enden auf 0. Dann passt die 10 in beide.', '20⁄100: 20 : 10 = 2 und 100 : 10 = 10. Also 20⁄100 = 2⁄10. Das geht noch weiter.', `Teile ${z} und 100 beide durch 10.`),
        { gekuerzt: true, bild: bild(fig('hundert', null, vorn(z))), nachweis: [UMF(c, 10, 'kuerzen')] }); },
  ]);
  const tK2G = h3(`Kürze Schritt für Schritt. ${REGELN}`, '24⁄36 = 12⁄18 = 6⁄9 = 2⁄3. Jetzt passt keine Zahl mehr in beide.', 'Kürze zuerst mit einer kleinen Zahl. Prüfe das Ergebnis und kürze weiter.');
  const voll = (nenner, ks, von = 1) => { const a = gekuerzt(nenner, von), k = wahl(ks); return { a, k, c: mal(a, k) }; };
  sechs(K2, 'G', [
    () => { const { a, k, c } = voll([3, 4, 5, 6, 7, 8, 9], [4, 6, 8, 9, 10, 12]);
      return bruch(Z(`Kürze ${br(...c)} vollständig.`), br(...a), fK2(c, a), tK2G, { gekuerzt: true, nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const { a, k, c } = amBild([4, 6, 8]);
      return bruch(Z(`Im Streifen ist ${br(...c)} gefärbt.`, 'Kürze den Bruch vollständig.'), br(...a), fK2(c, a), tK2G, { gekuerzt: true, bild: streifen(...c), nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const a = gekuerzt([3, 4, 5, 7, 8, 9], 2), [k, j] = wahl([[2, 3], [3, 2], [2, 5], [5, 2], [3, 5], [5, 3], [2, 2], [3, 3]]), d = mal(a, j), c = mal(d, k);
      return luecken(Z('Kürze in zwei Schritten.', `Kürze zuerst mit ${k} und dann mit ${j}.`, `${br(...c)} = {{a}}⁄${d[1]} = {{b}}⁄${a[1]}`), { a: [d[0], fehlerliste(d[0], [[c[0], 'erweitern-nur-ein-teil'], [a[0], 'sach-schritt-vergessen']])], b: [a[0], fehlerliste(a[0], [[d[0], 'kuerzen-nicht-vollstaendig'], [c[0], 'erweitern-nur-ein-teil']])] },
        h3('Teile bei jedem Schritt den Zähler durch dieselbe Zahl wie den Nenner.', '12⁄18 = 6⁄9 = 2⁄3. Erst wurde mit 2 gekürzt, dann mit 3.', `Rechne ${c[0]} : ${k}. Teile das Ergebnis dann durch ${j}.`), { nachweis: [UMF(c, k, 'kuerzen'), UMF(d, j, 'kuerzen')] }); },
    () => { const z = wahl([15, 25, 35, 45, 55, 65, 75, 85, 95, 20, 40, 60, 80]), g = ggt(z, 100), c = [z, 100], a = [z / g, 100 / g];
      return bruch(Z(`Im Hunderterfeld ist ${br(...c)} gefärbt.`, 'Kürze den Bruch vollständig.'), br(...a), [[br(a[0], 100), 'erweitern-nur-ein-teil']],
        h3('Endet der Zähler auf 0 oder 5? Dann passt die 5 in beide Zahlen.', '15⁄100: 15 : 5 = 3 und 100 : 5 = 20. Also 15⁄100 = 3⁄20.', 'Kürze mit 5. Prüfe das Ergebnis und kürze weiter.'),
        { gekuerzt: true, bild: bild(fig('hundert', null, vorn(z))), nachweis: [UMF(c, g, 'kuerzen', true)] }); },
    () => { const n = wahl([12, 15, 16, 18, 20]), z = wahl(vorn(n - 5, 3).filter((x) => ggt(x, n) > 1)), g = ggt(z, n), c = [z, n], a = [z / g, n / g];
      return bruch(Z(`Im Bild siehst du ${n} Kugeln.`, 'Welcher Bruchteil der Kugeln ist gefärbt?', 'Kürze vollständig.'), br(...a), [[br(n - z, n), 'sach-frage-verfehlt'], [br(a[0], n), 'erweitern-nur-ein-teil']].filter(([w]) => { const [x, y] = w.split('⁄').map(Number); return x * a[1] !== y * a[0]; }),
        h3('Zähle zuerst die gefärbten Kugeln. Der Nenner ist die Zahl aller Kugeln.', 'Von 12 Kugeln sind 8 gefärbt. 8⁄12 = 4⁄6 = 2⁄3.', `Der Bruch heißt zuerst ${br(...c)}. Kürze ihn Schritt für Schritt.`),
        { gekuerzt: true, bild: bild(fig('menge', n, vorn(z))), nachweis: [NB(br(...c)), UMF(c, g, 'kuerzen', true)] }); },
    () => { const fertig = mische([[2, 3], [3, 4], [5, 8], [4, 9], [7, 10], [5, 12], [9, 16], [8, 15], [3, 20], [7, 18]]), offen = mische([[6, 9], [9, 12], [10, 15], [6, 16], [14, 21], [15, 18], [12, 20], [9, 15], [21, 28], [15, 20]]), r = zz(1, 3);
      return auswahl(Z('Welche Brüche sind vollständig gekürzt?', 'Kreuze alle an.'), [...fertig.slice(0, r).map((x) => opt(br(...x), true)), ...offen.slice(0, 4 - r).map((x) => opt(br(...x), false, 'kuerzen-nicht-vollstaendig'))],
        h3(`Suche bei jedem Bruch eine Zahl für Zähler und Nenner. ${REGELN}`, '9⁄12 ist nicht fertig: Die 3 passt in 9 und in 12. 5⁄8 ist fertig.', 'Prüfe bei jedem Bruch die 2, die 3 und die 5.'), { mehrfach: true, nachweis: [{ art: 'gekuerztwahl' }] }); },
  ]);
  sechs(K2, 'M', [
    () => { const { a, k, c } = voll([5, 7, 8, 9, 11, 12, 13, 15], [12, 14, 15, 16, 18, 20, 24]);
      return bruch(`Kürze ${br(...c)} vollständig.`, br(...a), fK2(c, a), h2(`Kürze Schritt für Schritt, bis keine Zahl außer 1 mehr in Zähler und Nenner passt. ${REGELN}`, `Beginne mit ${c[0] % 2 === 0 && c[1] % 2 === 0 ? 2 : c[0] % 3 === 0 && c[1] % 3 === 0 ? 3 : 5}. Prüfe das Ergebnis und kürze weiter.`), { gekuerzt: true, nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const [alle, was, teil] = wahl([['Losen', 'Lose', 'Gewinne'], ['Büchern', 'Bücher', 'Sachbücher'], ['Fahrrädern', 'Fahrräder', 'Mountainbikes'], ['Stimmen', 'Stimmen', 'Ja-Stimmen']]), a = gekuerzt([4, 5, 6, 8, 9, 12, 15, 16], 1), k = wahl([8, 12, 15, 18, 24]), c = mal(a, k);
      return bruch(`Von ${c[1]} ${alle} sind ${c[0]} ${teil}. Welcher Anteil der ${was} ist das? Kürze vollständig.`, br(...a), [[br(c[1] - c[0], c[1]), 'sach-frage-verfehlt'], [br(a[1], a[0]), 'bruch-vertauscht'], [br(a[0], c[1]), 'erweitern-nur-ein-teil']].filter(([w]) => { const [x, y] = w.split('⁄').map(Number); return x * a[1] !== y * a[0]; }),
        h2('Der Anteil ist ein Bruch: Der Teil steht im Zähler, das Ganze im Nenner.', `Der Bruch heißt zuerst ${br(...c)}. Kürze ihn Schritt für Schritt.`), { gekuerzt: true, nachweis: [`${c[0]} : ${c[1]} = ${br(...a)}`] }); },
    () => { const n = wahl([3, 4, 5, 6, 8, 9]), z = wahl(vorn(n - 1, 1).filter((x) => ggt(x, n) === 1)), g = zz(2, 7), k = wahl([2, 3, 4, 5, 6]), Zc = (g * n + z) * k, Nc = n * k;
      return bruch(`Schreibe ${br(Zc, Nc)} als gemischte Zahl und kürze vollständig.`, br(z, n, g), [[br(z, n, g + 1), 'gemischt-umwandeln'], [br(z, n, g - 1), 'gemischt-umwandeln']],
        h2('Du kannst zuerst kürzen und dann umwandeln oder umgekehrt. Am Ende steht hinter den Ganzen ein vollständig gekürzter echter Bruch.', `Kürze zuerst mit ${k}: Das ergibt ${br(g * n + z, n)}. Wie oft passt die ${n} in die ${g * n + z}?`), { gekuerzt: true, form: 'gemischt', nachweis: [`${br(Zc, Nc)} = ${br(z, n, g)}`] }); },
    () => { const z = wahl(vorn(95, 4).filter((x) => ggt(x, 100) >= 4 && ggt(x, 100) < 50)), g = ggt(z, 100), a = [z / g, 100 / g];
      return bruch(`Kürze ${br(z, 100)} vollständig.`, br(...a), [[br(a[0], 100), 'erweitern-nur-ein-teil'], [br(z, a[1]), 'erweitern-nur-ein-teil']].filter(([w]) => { const [x, y] = w.split('⁄').map(Number); return x < y; }),
        h2('Die 100 lässt sich nur durch 2, 4, 5, 10, 20, 25 und 50 teilen. Welche dieser Zahlen passt auch in den Zähler?', `Kürze mit ${g}.`), { gekuerzt: true, nachweis: [UMF([z, 100], g, 'kuerzen', true)] }); },
    () => { const a = wahl([[2, 3], [3, 4], [3, 5], [5, 6], [4, 7], [5, 8], [4, 9]]), ks = mische([4, 6, 7, 8, 9, 11, 12, 15]), r = zz(2, 3), richtige = ks.slice(0, r).map((k) => mal(a, k));
      const falsche = ks.slice(r, 5).map((k, i) => (i % 2 ? [a[0] * k, a[1] * k + a[1]] : [a[0] * k + a[0], a[1] * k]));
      return auswahl(`Welche Brüche ergeben vollständig gekürzt ${br(...a)}? Kreuze alle an.`, [...richtige.map((x) => opt(br(...x), true)), ...falsche.map((x) => opt(br(...x), false, 'erweitern-nur-ein-teil'))],
        h2(`Kürze jeden Bruch vollständig und vergleiche mit ${br(...a)}.`, `Teile bei jedem Bruch den Zähler durch ${a[0]} und den Nenner durch ${a[1]}. Kommt beide Male dieselbe Zahl heraus?`), { mehrfach: true, nachweis: [WERT(br(...a), false)] }); },
    () => { const a = gekuerzt([7, 8, 9, 11, 12, 13], 3), k = zz(6, 12), c = mal(a, k);
      return luecken(`Der Bruch ergibt vollständig gekürzt ${br(...a)}. Welcher Nenner fehlt? ${c[0]}⁄{{a}} = ${br(...a)}`, { a: [c[1], fehlerliste(c[1], [[a[1], 'erweitern-nur-ein-teil'], [a[1] + c[0] - a[0], 'kuerzen-subtrahiert'], [k, 'sach-frage-verfehlt']])] },
        h2('Finde die Kürzungszahl an den beiden Zählern.', `Rechne ${c[0]} : ${a[0]} = ${k}. Der fehlende Nenner ist ${k}-mal so groß wie ${a[1]}.`), { nachweis: [UMF(a, k, 'erweitern', true)] }); },
  ]);
  sechs(K2, 'E', [
    () => { const { a, k, c } = voll([5, 7, 8, 9, 11, 12, 13, 15, 16], [28, 36, 42, 45, 48, 54, 56, 60]);
      return bruch(`Kürze ${br(...c)} vollständig.`, br(...a), fK2(c, a), h1('Kürze in mehreren Schritten oder suche den größten gemeinsamen Teiler von Zähler und Nenner.'), { gekuerzt: true, nachweis: [UMF(c, k, 'kuerzen', true)] }); },
    () => { const { a, k, c } = voll([3, 4, 5, 7, 8, 9, 11], [18, 24, 28, 30, 36, 42, 45], 2);
      return zahl(`Mit welcher größten Zahl kannst du ${br(...c)} kürzen?`, k, fehlerliste(k, [[k / 2, 'kuerzen-nicht-vollstaendig'], [k / 3, 'kuerzen-nicht-vollstaendig'], [2, 'kuerzen-nicht-vollstaendig'], [c[1] - c[0], 'kuerzen-subtrahiert']]),
        h1('Gesucht ist der größte gemeinsame Teiler (ggT) von Zähler und Nenner. Kürze schrittweise und nimm alle Kürzungszahlen miteinander mal.'), { nachweis: [{ art: 'ggt', zahlen: [c[0], c[1]], zahl: k }] }); },
    () => { const n = wahl([7, 8, 9, 11, 12, 15]), z = wahl(vorn(n - 1, 1).filter((x) => ggt(x, n) === 1)), g = zz(3, 9), k = wahl([6, 8, 9, 12, 15]), Zc = (g * n + z) * k, Nc = n * k;
      return bruch(`Schreibe ${br(Zc, Nc)} als vollständig gekürzte gemischte Zahl.`, br(z, n, g), [[br(z, n, g + 1), 'gemischt-umwandeln'], [br(z, n, g - 1), 'gemischt-umwandeln']],
        h1('Kürze zuerst vollständig. Teile dann den Zähler durch den Nenner: Das Ergebnis sind die Ganzen, der Rest bleibt als Zähler.'), { gekuerzt: true, form: 'gemischt', nachweis: [`${br(Zc, Nc)} = ${br(z, n, g)}`] }); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const a = gekuerzt([4, 5, 6, 7, 8, 9, 11, 12], 2), k = wahl([6, 8, 9, 12, 14, 15, 18]), c = mal(a, k), stimmt = i < 2 ? i === 0 : wahl([true, false]), x = stimmt ? a : wahl([[a[0] + 1, a[1]], [a[0], a[1] + 1], [a[0] - 1, a[1]]]); if (roh.some(([t]) => t.startsWith(br(...c)))) return null; roh.push([`${br(...c)} = ${br(...x)}`, stimmt]); }
      return auswahl('Hier wurde gekürzt. Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'erweitern-nur-ein-teil')), h1('Erweitere den rechten Bruch zur Probe: Mit welcher Zahl kommst du auf den linken Nenner? Passt dann auch der Zähler?'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
    () => { const a = gekuerzt([5, 6, 8, 9, 12, 15, 16], 2), k = wahl([8, 10, 12, 15, 20]), N = a[1] * k, rest = a[0] * k, weg = N - rest, [was, tat] = wahl([['Karten', 'verkauft'], ['Plätzen', 'besetzt'], ['Aufgaben', 'gelöst'], ['Seiten', 'gelesen']]);
      if (ggt(weg, N) === 1) return null;
      return bruch(`Von ${N} ${was} sind ${weg} schon ${tat}. Welcher Anteil ist noch übrig? Kürze vollständig.`, br(...a), [[br(a[1] - a[0], a[1]), 'sach-frage-verfehlt'], [br(a[1], a[0]), 'bruch-vertauscht']],
        h1('Rechne zuerst aus, wie viele noch übrig sind. Der Anteil ist dann ein Bruch mit der Gesamtzahl im Nenner.'), { gekuerzt: true, nachweis: [`${N} − ${weg} = ${rest}`, `${rest} : ${N} = ${br(...a)}`] }); },
    () => { const a = gekuerzt([5, 7, 8, 9, 11, 13], 2), k = zz(6, 14), s = (a[0] + a[1]) * k;
      return zahl(`Ein Bruch ergibt vollständig gekürzt ${br(...a)}. Sein Zähler und sein Nenner haben zusammen die Summe ${s}. Wie heißt der Zähler dieses Bruchs?`, a[0] * k, fehlerliste(a[0] * k, [[a[1] * k, 'bruch-vertauscht'], [k, 'sach-schritt-vergessen'], [a[0], 'sach-frage-verfehlt'], [s - a[0], 'kuerzen-subtrahiert']]),
        h1(`Beim Erweitern von ${br(...a)} wächst auch die Summe aus Zähler und Nenner mit der Erweiterungszahl.`), { nachweis: [`${a[0]} + ${a[1]} = ${a[0] + a[1]}`, `${s} : ${a[0] + a[1]} = ${k}`, `${a[0]} · ${k} = ${a[0] * k}`] }); },
  ]);
}
