// Aufgaben zu 5.3.5 „Rechengesetze und Rechenvorteile“ (Lernziele R1 und R2) nach ADR 0015.
// F arbeitet mit Tauschaufgaben und der passenden 10 am Bild, ohne die Namen der Gesetze.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, U, WERT } from '../werkzeug.mjs';

const RG = (kurz) => `5.3.5-${kurz}`;
const vor = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x += s), text: `+ ${s}` })); };
const krumm = (von, bis) => suche(() => zz(von, bis), (x) => x % 10 !== 0 && x % 10 !== 5);
// Drei Summanden bis 100: a und c ergänzen sich zu einem vollen Zehner, b passt zu keinem der beiden.
const trio = () => suche(() => { const a = krumm(21, 47), c = zz(1, 2) * 10 + (10 - (a % 10)), b = krumm(12, 28); return [a, b, c]; },
  ([a, b, c]) => a + b + c <= 100 && (a + b) % 10 !== 0 && (b + c) % 10 !== 0 && new Set([a, b, c]).size === 3);
// Minus-Kette: b und c ergänzen sich zu einem vollen Zehner.
const minusKette = (aVon, aBis, rund) => suche(() => { const b = krumm(11, 27), c = 10 - (b % 10); return [rund ? zz(aVon, aBis) * 10 : krumm(aVon, aBis), b, c]; }, ([a, b, c]) => a - b - c > 10);
const reihe = (von, bis) => Array.from({ length: bis - von + 1 }, (_, i) => von + i).join(' + ');

export function rechengesetze() {
  // =====================================================================
  // R1 Rechengesetze kennen
  // =====================================================================
  sechs(RG('R1'), 'F', [
    () => { const a = zz(3, 5), b = zz(6, 9);
      return luecken(Z(`${a} + ${b} = ${a + b}`, 'Tausche die Zahlen.', `${b} + ${a} = {{a}}`), { a: a + b },
        h3('Beim Plus-Rechnen darfst du die Zahlen tauschen. Das Ergebnis bleibt gleich.', '2 + 7 = 9. Also ist auch 7 + 2 = 9.', `Es sind dieselben Plättchen. Zusammen sind es ${a + b}.`), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`, `${b} + ${a}`) }); },
    () => { const a = zz(2, 4), b = zz(5, 8);
      return auswahl(Z('Welche Aufgabe ist die Tauschaufgabe?', `${a} + ${b}`), [opt(`${b} + ${a}`, true), opt(`${b} − ${a}`, false, 'add-subtrahiert'), opt(`${a} + ${a}`)],
        h3('Bei der Tauschaufgabe tauschen die beiden Zahlen den Platz.', 'Die Tauschaufgabe zu 2 + 6 ist 6 + 2.', `Die Zahlen ${a} und ${b} bleiben. Das Plus bleibt auch.`), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`, `${b} + ${a}`) }); },
    () => { const a = zz(2, 3), b = zz(14, 17);
      return zahl(Z(`${a} + ${b} ist schwer zu zählen.`, 'Tausche die Zahlen.', `Rechne ${b} + ${a}.`), a + b, fehlerliste(a + b, [[b - a, 'add-subtrahiert']]),
        h3('Starte bei der großen Zahl. Dann sind es nur wenige Schritte.', '2 + 15: Starte bei 15 und gehe 2 weiter. Ergebnis 17.', `Starte bei ${b}. Gehe ${a} Schritte weiter.`), { bild: B.strahl({ von: 10, bis: 20, schritt: 1, beschriftung: 5, start: b, spruenge: vor(b, a) }), nachweis: N(`${b} + ${a}`, `${a} + ${b}`) }); },
    () => { const a = zz(3, 5), b = zz(6, 9);
      return luecken(Z('Welche Zahl fehlt?', `${a} + ${b} = {{a}} + ${a}`), { a: [b, fehlerliste(b, [[a + b, 'sach-schritt-vergessen']])] },
        h3('Links und rechts stehen dieselben Zahlen. Sie sind nur getauscht.', '2 + 7 = 7 + 2.', `Links stehen ${a} und ${b}. Rechts steht schon die ${a}.`), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`, `${b} + ${a}`) }); },
    () => { const a = zz(6, 9), b = zz(2, 4);
      return auswahl('Welche 2 Aufgaben haben dasselbe Ergebnis?', [opt(`${a} + ${b} und ${b} + ${a}`, true), opt(`${a} + ${b} und ${a} − ${b}`, false, 'add-subtrahiert'), opt(`${a} + ${b} und ${a} + ${a}`)],
        h3('Tauschaufgaben haben dasselbe Ergebnis.', '5 + 3 und 3 + 5 haben beide das Ergebnis 8.', `Suche die Aufgabe mit denselben Zahlen und einem Plus.`), { bild: B.menge(a, { dazu: b }), nachweis: N({ art: 'gleicheWerte' }, `${a} + ${b}`, `${b} + ${a}`, `${a} − ${b}`, `${a} + ${a}`) }); },
    () => { const a = zz(2, 3) * 10, b = zz(4, 6) * 10;
      return zahl(Z(`${a} + ${b} = ${a + b}`, `Wie viel ist ${b} + ${a}?`), a + b, fehlerliste(a + b, [[b - a, 'add-subtrahiert']]),
        h3('Das ist die Tauschaufgabe. Das Ergebnis bleibt gleich.', '10 + 40 = 50. Also ist auch 40 + 10 = 50.', `Die Sprünge im Bild sind dieselben. Du landest bei ${a + b}.`), { bild: B.strahl({ von: 0, bis: 100, schritt: 10, beschriftung: 10, start: 0, spruenge: vor(0, b, a) }), nachweis: N(`${a} + ${b}`, `${b} + ${a}`) }); },
  ]);

  sechs(RG('R1'), 'G', [
    () => { const a = zz(12, 19), b = zz(23, 48);
      return auswahl(Z('Welches Gesetz siehst du?', `${a} + ${b} = ${b} + ${a}`), [opt('Vertauschungsgesetz', true), opt('Verbindungsgesetz', false, 'begriffe-verwechselt'), opt('Kein Gesetz. Die Rechnung ist falsch.')],
        h3('Schau genau: Haben die Zahlen den Platz getauscht?', '5 + 9 = 9 + 5: Die Zahlen sind vertauscht. Das ist das Vertauschungsgesetz.', `${a} und ${b} haben den Platz getauscht.`), { nachweis: N(`${a} + ${b}`, `${b} + ${a}`) }); },
    () => { const a = zz(12, 19), b = zz(21, 29), c = zz(3, 9);
      return luecken(Z('Die Klammer wandert.', 'Die Zahlen bleiben gleich.', `(${a} + ${b}) + ${c} = ${a} + (${b} + {{a}})`), { a: c },
        h3('Beim Verbindungsgesetz bleibt die Reihenfolge der Zahlen gleich.', '(4 + 7) + 3 = 4 + (7 + 3).', `Links stehen ${a}, ${b} und ${c}. Rechts fehlt die letzte Zahl.`), { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: N(`(${a} + ${b}) + ${c}`, `${a} + (${b} + ${c})`) }); },
    () => { const a = zz(11, 18), b = wahl([2, 3, 4, 6, 7, 8]), c = 10 - b;
      return luecken(Z('Rechne auf 2 Wegen.', `(${a} + ${b}) + ${c} = {{a}}`, `${a} + (${b} + ${c}) = {{b}}`), { a: a + b + c, b: a + b + c },
        h3('Rechne immer zuerst die Klammer aus.', '(12 + 9) + 1 = 21 + 1 = 22. Und 12 + (9 + 1) = 12 + 10 = 22.', `Zweiter Weg: ${b} + ${c} = 10. Dann ${a} + 10.`), { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: N(`(${a} + ${b}) + ${c}`, `${a} + (${b} + ${c})`) }); },
    () => { const a = zz(4, 6) * 10, b = zz(15, 25);
      return auswahl('Wo darfst du die Zahlen tauschen?', [opt(`Bei ${a} + ${b}`, true), opt(`Bei ${a} − ${b}`, false, 'gesetz-auf-subtraktion'), opt('Bei beiden Aufgaben', false, 'gesetz-auf-subtraktion')],
        h3('Das Vertauschungsgesetz gilt nur beim Addieren.', '8 + 3 = 3 + 8. Aber 8 − 3 ist nicht 3 − 8.', 'Suche die Aufgabe mit dem Plus.')); },
    () => { const a = zz(26, 38), b = zz(12, 16), c = zz(3, 9);
      return auswahl(Z('Welche Rechnung hat dasselbe Ergebnis?', `${a} + (${b} + ${c})`), [opt(`(${a} + ${b}) + ${c}`, true), opt(`(${a} + ${b}) − ${c}`, false, 'add-subtrahiert'), opt(`${a} − (${b} + ${c})`, false, 'add-subtrahiert')],
        h3('Beim Addieren darfst du die Klammer versetzen.', '5 + (4 + 6) = (5 + 4) + 6.', 'Suche die Rechnung mit denselben Zahlen und 2-mal Plus.'), { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: [WERT(a + b + c), ...N(`${a} + (${b} + ${c})`, `(${a} + ${b}) + ${c}`)] }); },
    () => { const a = wahl([20, 30]), b = zz(7, 9), c = zz(2, 4), k = kind(), li = a - b - c, re = a - (b - c);
      return auswahl(Z(`${k} sagt:`, `${a} − ${b} − ${c} ist dasselbe wie ${a} − (${b} − ${c}).`, 'Stimmt das?'), [opt('Stimmt.', false, 'gesetz-auf-subtraktion'), opt(`Falsch. Links kommt ${li} heraus. Rechts kommt ${re} heraus.`, true), opt(`Falsch. Links kommt ${re} heraus. Rechts kommt ${li} heraus.`, false, 'klammer-ignoriert')],
        h3('Rechne beide Seiten aus. Die Klammer kommt zuerst.', '10 − 4 − 2 = 4. Aber 10 − (4 − 2) = 10 − 2 = 8.', `Rechts: Klammer ${b} − ${c} = ${b - c}. Dann ${a} − ${b - c}.`), { nachweis: [U(false), ...N(`${a} − ${b} − ${c}`, `${a} − (${b} − ${c})`)] }); },
  ]);

  sechs(RG('R1'), 'M', [
    () => { const a = zz(105, 145), b = krumm(56, 78), c = 100 - b;
      return auswahl(`Welches Rechengesetz wurde angewendet? (${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, [opt('Verbindungsgesetz', true), opt('Vertauschungsgesetz', false, 'begriffe-verwechselt'), opt('Kein Rechengesetz. Die Gleichung ist falsch.'), opt('Vertauschungsgesetz und Verbindungsgesetz zugleich', false, 'begriffe-verwechselt')],
        h2('Vergleiche beide Seiten: Hat sich die Reihenfolge der Zahlen geändert oder nur die Klammer?', 'Die Reihenfolge der Zahlen ist gleich geblieben. Nur die Klammer steht an einer anderen Stelle.'), { nachweis: N(`(${a} + ${b}) + ${c}`, `${a} + (${b} + ${c})`) }); },
    () => { const a = zz(36, 48), b = suche(() => krumm(56, 89), (x) => Math.floor(x / 10) !== x % 10), c = 100 - b, dreh = (b % 10) * 10 + Math.floor(b / 10);
      return auswahl('Welche Gleichungen stimmen? Wähle alle richtigen aus.', [opt(`${a} + ${b} = ${b} + ${a}`, true), opt(`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, true), opt('(90 − 40) − 10 = 90 − (40 − 10)', false, 'gesetz-auf-subtraktion'), opt(`${a} + ${b} = ${a} + ${dreh}`, false, 'stellenwert')],
        h2('Bei der Addition darfst du vertauschen und Klammern versetzen. Prüfe die übrigen Gleichungen durch Ausrechnen.', '(90 − 40) − 10 = 40, aber 90 − (40 − 10) = 60.'), { mehrfach: true, nachweis: [{ art: 'gleichungen' }, ...N('(90 − 40) − 10', '90 − (40 − 10)')] }); },
    () => { const a = zz(26, 48), b = krumm(56, 84), c = 100 - b;
      return luecken(`Nutze das Verbindungsgesetz und fülle die Lücken: (${a} + ${b}) + ${c} = ${a} + (${b} + {{a}}) = ${a} + {{b}} = {{c}}`, { a: c, b: 100, c: a + 100 },
        h2('Die Klammer wandert zu den beiden Zahlen, die sich zu 100 ergänzen.', `${b} + ${c} = 100.`), { nachweis: N(`${b} + ${c}`, `${a} + 100`, `(${a} + ${b}) + ${c}`) }); },
    () => { const a = zz(56, 78), b = zz(23, 39), c = zz(2, 9);
      return auswahl('Welche Gleichung zeigt das Vertauschungsgesetz?', [opt(`${a} + ${b} = ${b} + ${a}`, true), opt(`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, false, 'begriffe-verwechselt'), opt(`${a} + ${b} = ${a + b}`), opt(`${a} − ${b} = ${b} − ${a}`, false, 'gesetz-auf-subtraktion')],
        h2('Beim Vertauschungsgesetz tauschen die Summanden den Platz.', 'Suche die Gleichung, in der auf beiden Seiten dieselben zwei Summanden in getauschter Reihenfolge stehen.'), { nachweis: N(`${a} + ${b} = ${b} + ${a}`) }); },
    () => { const a = zz(5, 9) * 10, b = zz(2, 4) * 10, c = wahl([5, 10, 15]);
      return luecken(`Zeige mit einem Beispiel, dass das Verbindungsgesetz für die Subtraktion nicht gilt. (${a} − ${b}) − ${c} = {{a}} und ${a} − (${b} − ${c}) = {{b}}`, { a: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']])], b: [a - b + c, fehlerliste(a - b + c, [[a - b - c, 'klammer-ignoriert']])] },
        h2('Berechne in beiden Rechenausdrücken zuerst die Klammer.', `${a} − ${b} = ${a - b} und ${b} − ${c} = ${b - c}.`), { nachweis: N(`(${a} − ${b}) − ${c}`, `${a} − (${b} − ${c})`) }); },
    () => { const x = zz(11, 15), y = zz(4, 8), k = kind();
      return auswahl(`${k} behauptet: „Das Vertauschungsgesetz gilt auch für die Subtraktion.“ Welche Begründung ist richtig?`, [
        opt(`Falsch. Ein Gegenbeispiel genügt: ${x} − ${y} = ${x - y}, aber ${y} − ${x} ist keine natürliche Zahl.`, true),
        opt('Richtig. Die Rechengesetze gelten für alle Rechenarten.', false, 'gesetz-auf-subtraktion'),
        opt(`Richtig, denn ${x} − ${y} und ${y} − ${x} haben dasselbe Ergebnis.`, false, 'gesetz-auf-subtraktion'),
        opt('Falsch. Das Vertauschungsgesetz gilt für keine Rechenart.')],
      h2('Prüfe die Behauptung an einem Beispiel: Vertausche Minuend und Subtrahend.', `${x} − ${y} = ${x - y}. Bei ${y} − ${x} ist der Subtrahend größer als der Minuend.`), { nachweis: [U(false), ...N(`${x} − ${y}`)] }); },
  ]);

  sechs(RG('R1'), 'E', [
    () => auswahl('Welche Gleichung beschreibt das Verbindungsgesetz der Addition allgemein?', [
      opt('(a + b) + c = a + (b + c)', true), opt('a + b = b + a', false, 'begriffe-verwechselt'), opt('(a − b) − c = a − (b − c)', false, 'gesetz-auf-subtraktion'), opt('a + (b + c) = (a + b) · c'), opt('(a + b) + c = a + b')],
    h1('Beim Verbindungsgesetz bleibt die Reihenfolge der Summanden gleich. Nur die Klammer wird versetzt.')),
    () => { const a = zz(6, 9) * 10, b = zz(2, 4) * 10 + 5, c = wahl([10, 15]);
      return luecken(`Berechne für a = ${a}, b = ${b} und c = ${c}: (a − b) − c = {{x}} und a − (b − c) = {{y}}. Die beiden Ergebnisse unterscheiden sich um {{z}}.`, { x: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']])], y: [a - b + c, fehlerliste(a - b + c, [[a - b - c, 'klammer-ignoriert']])], z: 2 * c },
        h1('Setze die Zahlen ein und berechne jeweils zuerst die Klammer.'), { nachweis: N(`(${a} − ${b}) − ${c}`, `${a} − (${b} − ${c})`, `${a - b + c} − ${a - b - c}`) }); },
    () => { const a = zz(6, 9) * 10, b = zz(2, 4) * 10;
      return auswahl(`Für welche Zahlen im Kästchen gilt (${a} − ${b}) − ▢ = ${a} − (${b} − ▢)?`, [opt('Nur für die Zahl 0.', true), opt(`Für jede Zahl von 0 bis ${b}.`, false, 'gesetz-auf-subtraktion'), opt('Für keine Zahl.'), opt(`Nur für die Zahl ${b}.`), opt(`Nur für die Zahl ${b / 2}.`)],
        h1('Links wird die Zahl im Kästchen abgezogen, rechts kommt sie dazu. Setze mehrere Zahlen ein.'), { nachweis: N(`(${a} − ${b}) − 0`, `${a} − (${b} − 0)`, `(${a} − ${b}) − 10`, `${a} − (${b} − 10)`, `(${a} − ${b}) − ${b / 2}`, `${a} − (${b} − ${b / 2})`) }); },
    () => { const a1 = zz(5, 6) * 10, a2 = zz(8, 9) * 10;
      return auswahl(`(${a1} − 20) − 5 = ${a1 - 25} und ${a1} − (20 − 5) = ${a1 - 15}. Ebenso (${a2} − 40) − 10 = ${a2 - 50} und ${a2} − (40 − 10) = ${a2 - 30}. Stelle eine Regel für die Terme (a − b) − c und a − (b − c) auf.`, [
        opt('a − (b − c) ist immer um 2 · c größer als (a − b) − c.', true), opt('a − (b − c) ist immer um c größer als (a − b) − c.'), opt('Beide Terme haben immer denselben Wert.', false, 'gesetz-auf-subtraktion'), opt('a − (b − c) ist immer um b größer als (a − b) − c.'), opt('a − (b − c) ist immer um 2 · c kleiner als (a − b) − c.')],
      h1('Vergleiche in beiden Beispielen den Unterschied der Ergebnisse mit der Zahl c.'), { nachweis: N(`(${a1} − 20) − 5`, `${a1} − (20 − 5)`, `${a1 - 15} − ${a1 - 25} = 10`, '2 · 5', `(${a2} − 40) − 10`, `${a2} − (40 − 10)`, `${a2 - 30} − ${a2 - 50} = 20`, '2 · 10') }); },
    () => { const b = suche(() => krumm(27, 43), (x) => x !== 25), c = 50 - b, x = zz(12, 38) * 5, s = x + 50;
      return luecken(`Bestimme die fehlende Zahl mithilfe des Verbindungsgesetzes: ({{a}} + ${b}) + ${c} = ${s}`, { a: [x, fehlerliste(x, [[s - b, 'sach-schritt-vergessen'], [s + 50, 'add-subtrahiert']])] },
        h1('Fasse zuerst die beiden bekannten Summanden zusammen.'), { nachweis: N(`${b} + ${c}`, `${s} − 50`, `(${x} + ${b}) + ${c}`) }); },
    () => { const k = kind(), n = zz(6, 9);
      return auswahl(`${k} behauptet: „a − b = b − a gilt für keine natürlichen Zahlen.“ Beurteile die Aussage.`, [
        opt(`Falsch. Für a = b gilt die Gleichung, zum Beispiel ${n} − ${n} = ${n} − ${n} = 0. Für verschiedene Zahlen gilt sie nicht.`, true),
        opt('Richtig. Bei der Subtraktion darf man in keinem Fall vertauschen.'),
        opt('Falsch. Die Gleichung gilt für alle natürlichen Zahlen.', false, 'gesetz-auf-subtraktion'),
        opt('Falsch. Die Gleichung gilt immer, wenn a größer ist als b.', false, 'gesetz-auf-subtraktion'),
        opt('Richtig. Auch wenn a und b gleich sind, sind die Ergebnisse verschieden.')],
      h1('Untersuche auch den Sonderfall, dass a und b dieselbe Zahl sind.'), { nachweis: [U(false), ...N(`${n} − ${n}`)] }); },
  ]);

  // =====================================================================
  // R2 Vorteilhaft rechnen
  // =====================================================================
  sechs(RG('R2'), 'F', [
    () => { const a = zz(6, 9), p = 10 - a, b = suche(() => zz(2, 5), (x) => x !== p);
      return luecken(Z(`${a} + ${b} + ${p}`, `Rechne erst ${a} + ${p} = {{a}}`, `Dann plus ${b}: {{b}}`), { a: 10, b: 10 + b },
        h3('Suche 2 Zahlen, die zusammen 10 ergeben.', '8 + 5 + 2: Erst 8 + 2 = 10. Dann 10 + 5 = 15.', `${a} + ${p} = 10.`), { bild: B.zehnerfeld(a, { dazu: p }), nachweis: N(`${a} + ${p}`, `10 + ${b}`, `${a} + ${b} + ${p}`) }); },
    () => { const a = zz(6, 8), p = 10 - a, b = suche(() => zz(2, 5), (x) => x !== p);
      return auswahl(Z('Welche 2 Zahlen ergeben zusammen 10?', `${a} + ${b} + ${p}`), [opt(`${a} und ${p}`, true), opt(`${a} und ${b}`), opt(`${b} und ${p}`)],
        h3('Schau auf das Zehnerfeld: Welche Zahlen füllen es genau?', '9 + 4 + 1: 9 und 1 ergeben 10.', `Zu ${a} fehlen ${p} bis zur 10.`), { bild: B.zehnerfeld(a, { dazu: p }), nachweis: N({ art: 'paarsumme', ziel: 10 }, `${a} + ${p}`, `${a} + ${b}`, `${b} + ${p}`) }); },
    () => { const a = zz(7, 9), p = 10 - a, b = zz(4, 6);
      return zahl(Z('Rechne geschickt.', `${a} + ${b} + ${p}`), 10 + b, [],
        h3('Rechne erst die 2 Zahlen, die zusammen 10 ergeben.', '8 + 5 + 2: Erst 8 + 2 = 10. Dann 10 + 5 = 15.', `${a} + ${p} = 10. Dann kommen noch ${b} dazu.`), { bild: B.zehnerfeld(a, { dazu: p }), nachweis: N(`${a} + ${p}`, `10 + ${b}`, `${a} + ${b} + ${p}`) }); },
    () => { const a = zz(2, 4), p = 10 - a, b = suche(() => zz(3, 5), (x) => x !== a);
      return zahl(Z('Suche erst die 10.', `${a} + ${b} + ${p}`), 10 + b, [],
        h3('Die erste und die letzte Zahl ergeben zusammen 10.', '3 + 5 + 7: Erst 3 + 7 = 10. Dann 10 + 5 = 15.', `${a} + ${p} = 10. Dann kommen noch ${b} dazu.`), { bild: B.zehnerfeld(a, { dazu: p }), nachweis: N(`${a} + ${p}`, `10 + ${b}`, `${a} + ${b} + ${p}`) }); },
    () => { const a = zz(6, 8), p = 10 - a, b = suche(() => zz(7, 9), (x) => x !== a);
      return auswahl(Z('Wie rechnest du am leichtesten?', `${a} + ${b} + ${p}`), [opt(`Erst ${a} + ${p}. Dann plus ${b}.`, true), opt(`Erst ${a} + ${b}. Dann plus ${p}.`), opt(`Erst ${b} + ${p}. Dann plus ${a}.`)],
        h3('Am leichtesten ist es mit der 10.', '7 + 8 + 3: Erst 7 + 3 = 10. Dann plus 8.', `${a} + ${p} = 10.`), { bild: B.zehnerfeld(a, { dazu: p }), nachweis: N(`${a} + ${p}`, `10 + ${b}`, `${a} + ${b} + ${p}`) }); },
    () => { const a = zz(12, 17), p = 20 - a, b = suche(() => zz(4, 6), (x) => x !== p);
      return zahl(Z('Suche erst die 20.', `${a} + ${b} + ${p}`), 20 + b, [],
        h3('Die erste und die letzte Zahl ergeben zusammen 20.', '14 + 3 + 6: Erst 14 + 6 = 20. Dann 20 + 3 = 23.', `${a} + ${p} = 20. Dann kommen noch ${b} dazu.`), { bild: B.zehnerfeld(a, { dazu: p, felder: 20 }), nachweis: N(`${a} + ${p}`, `20 + ${b}`, `${a} + ${b} + ${p}`) }); },
  ]);

  sechs(RG('R2'), 'G', [
    () => { const [a, b, c] = trio();
      return luecken(Z('Rechne geschickt.', `${a} + ${b} + ${c}`, `Erst ${a} + ${c} = {{a}}`, `Dann plus ${b}: {{b}}`), { a: a + c, b: a + b + c },
        h3('Suche 2 Zahlen, deren Einer zusammen 10 ergeben.', '27 + 15 + 13: Erst 27 + 13 = 40. Dann 40 + 15 = 55.', `${a} + ${c} = ${a + c}.`), { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: N(`${a} + ${c}`, `${a + c} + ${b}`, `${a} + ${b} + ${c}`) }); },
    () => { const [a, b, c] = trio();
      return zahl(Z('Rechne geschickt.', `${a} + ${b} + ${c}`), a + b + c, [],
        h3('Suche 2 Zahlen, die zusammen einen vollen Zehner ergeben.', '27 + 15 + 13: Erst 27 + 13 = 40. Dann 40 + 15 = 55.', `${a} + ${c} = ${a + c}. Dann kommen noch ${b} dazu.`), { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: N(`${a} + ${c}`, `${a + c} + ${b}`, `${a} + ${b} + ${c}`) }); },
    () => { const [a, b, c] = trio();
      return auswahl(Z('Welche 2 Zahlen rechnest du zuerst zusammen?', `${a} + ${b} + ${c}`), [opt(`${a} und ${c}`, true), opt(`${a} und ${b}`), opt(`${b} und ${c}`)],
        h3('Schau auf die Einer: Welche ergeben zusammen 10?', '18 + 27 + 32: 8 Einer und 2 Einer ergeben 10. Also erst 18 + 32.', `${a % 10} Einer und ${c % 10} Einer ergeben zusammen 10.`), { nachweis: N({ art: 'paarsumme', ziel: a + c }, `${a} + ${c}`, `${a} + ${b}`, `${b} + ${c}`) }); },
    () => { const [a, b, c] = minusKette(4, 9, true);
      return zahl(Z('Rechne geschickt.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler']]),
        h3('Rechne erst aus, was zusammen weggeht.', '40 − 16 − 4: Zusammen gehen 16 + 4 = 20 weg. 40 − 20 = 20.', `${b} + ${c} = ${b + c}. Ziehe das von ${a} ab.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`) }); },
    () => { const [a, b, c] = minusKette(41, 95, false);
      return luecken(Z('Ziehe beide Zahlen zusammen ab.', `${b} + ${c} = {{a}}`, `${a} − ${b} − ${c} = {{b}}`), { a: b + c, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler']])] },
        h3('Erst rechnest du aus, was zusammen weggeht.', '45 − 18 − 2: 18 + 2 = 20. Dann 45 − 20 = 25.', `${b} + ${c} = ${b + c}. Ziehe das von ${a} ab.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`) }); },
    () => { const [a, b, c] = minusKette(5, 9, true), k = kind();
      return auswahl(Z(`${k} rechnet ${a} − ${b} − ${c} so:`, `${b} + ${c} = ${b + c}`, `${a} − ${b + c} = ${a - b - c}`, 'Stimmt das?'), [opt('Stimmt. Beide Zahlen gehen weg.', true), opt(`Falsch. Richtig ist ${a - b + c}.`, false, 'sub-klammerfehler'), opt('Falsch. Man muss immer von links nach rechts rechnen.')],
        h3('Prüfe mit dem anderen Weg: Rechne von links nach rechts.', '30 − 8 − 2: 30 − 8 = 22, 22 − 2 = 20. Und 30 − 10 = 20.', `${a} − ${b} = ${a - b}. Dann ${a - b} − ${c} = ${a - b - c}.`), { nachweis: N(U(true, `${a} − ${b} − ${c}`, a - b - c), `${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`, `${a} − ${b}`, `${a - b} − ${c}`) }); },
  ]);

  sechs(RG('R2'), 'M', [
    () => { const [a, b, c, d] = suche(() => { const c0 = krumm(12, 38), b0 = krumm(86, 97); return [zz(2, 4) * 100 - c0, b0, c0, 100 - b0]; }, ([, , c0, d0]) => c0 !== d0);
      return zahl(`Berechne vorteilhaft: ${a} + ${b} + ${c} + ${d}`, a + b + c + d, [],
        h2('Suche Summanden, die sich zu vollen Hundertern ergänzen.', `${a} + ${c} = ${a + c} und ${b} + ${d} = ${b + d}.`), { nachweis: N(`${a} + ${c}`, `${b} + ${d}`, `${a + c} + ${b + d}`, `${a} + ${b} + ${c} + ${d}`) }); },
    () => { const a = zz(5, 9) * 100, b = krumm(113, 187), c = 200 - b;
      return luecken(`Berechne vorteilhaft und fülle die Lücken: ${a} − ${b} − ${c} = ${a} − {{a}} = {{b}}`, { a: 200, b: [a - 200, fehlerliste(a - 200, [[a - b + c, 'sub-klammerfehler']])] },
        h2('Fasse die beiden Subtrahenden zusammen.', `${b} + ${c} = 200.`), { nachweis: N(`${b} + ${c}`, `${a} − 200`, `${a} − ${b} − ${c}`) }); },
    () => { const x = krumm(41, 48), z = 100 - x, y = krumm(31, 38), w = 100 - y, gross = krumm(131, 149);
      return zuordnen('Ordne jedem Rechenausdruck den vorteilhaften Rechenweg zu.', [[`${x} + ${y} + ${z}`, `(${x} + ${z}) + ${y}`], [`${x} + ${y} + ${w}`, `${x} + (${y} + ${w})`], [`${gross} − ${x} − ${z}`, `${gross} − (${x} + ${z})`]],
        h2('Suche in jedem Rechenausdruck die beiden Zahlen, die sich zu 100 ergänzen.', `${x} + ${z} = 100 und ${y} + ${w} = 100.`), { nachweis: N(`${x} + ${y} + ${z}`, `(${x} + ${z}) + ${y}`, `${x} + ${y} + ${w}`, `${x} + (${y} + ${w})`, `${gross} − ${x} − ${z}`, `${gross} − (${x} + ${z})`) }); },
    () => { const a = krumm(312, 388), c = 500 - a, b = krumm(46, 88);
      return zahl(`Berechne vorteilhaft: ${a} + ${b} + ${c}`, a + b + c, [],
        h2('Vertausche die Summanden so, dass ein voller Hunderter entsteht.', `${a} + ${c} = 500.`), { nachweis: N(`${a} + ${c}`, `500 + ${b}`, `${a} + ${b} + ${c}`) }); },
    () => { const gross = wahl([200, 300]), d = zz(1, 3), b = gross - d, a = krumm(234, 468);
      return luecken(`Rechne mit einer Hilfsaufgabe und fülle die Lücken: ${a} + ${b} = ${a} + ${gross} − {{a}} = {{b}}`, { a: d, b: [a + b, fehlerliste(a + b, [[a + gross + d, 'add-subtrahiert'], [a + gross, 'sach-schritt-vergessen']])] },
        h2(`Addiere zuerst ${gross}. Das ist zu viel, deshalb wird der Unterschied wieder subtrahiert.`, `${gross} − ${b} = ${d}.`), { nachweis: N(`${gross} − ${b}`, `${a} + ${gross} − ${d}`, `${a} + ${b}`) }); },
    () => { const a = zz(3, 5) * 100, b = wahl([120, 130, 140]), c = 200 - b, k = kind();
      return auswahl(`${k} rechnet: ${a} − ${b} + ${c} = ${a} − 200 = ${a - 200}. Beurteile den Rechenweg.`, [
        opt(`Falsch. Ohne Klammer wird von links nach rechts gerechnet: ${a} − ${b} + ${c} = ${a - b + c}.`, true),
        opt(`Richtig. ${b} und ${c} ergänzen sich zu 200 und dürfen zusammengefasst werden.`, false, 'gesetz-auf-subtraktion'),
        opt(`Falsch. Richtig ist ${a} + ${b} + ${c} = ${a + b + c}.`, false, 'sub-addiert'),
        opt('Richtig. Zusammenfassen ist in jedem Rechenausdruck erlaubt.', false, 'gesetz-auf-subtraktion')],
      h2(`Achte auf die Rechenzeichen: Nur ${b} wird subtrahiert, ${c} wird addiert.`, `${a} − ${b} = ${a - b}.`), { nachweis: N(U(false, `${a} − ${b} + ${c}`, a - 200), `${a} − ${b} + ${c}`, `${a} − ${b}`, `${a - b} + ${c}`) }); },
  ]);

  sechs(RG('R2'), 'E', [
    () => zahl('Berechne vorteilhaft: 10 + 20 + 30 + 40 + 50 + 60 + 70 + 80 + 90', 450, fehlerliste(450, [[500, 'sach-schritt-vergessen'], [400, 'sach-schritt-vergessen']]),
      h1('Bilde Paare mit gleicher Summe. Eine Zahl bleibt ohne Partner.'), { nachweis: N('10 + 90', '20 + 80', '30 + 70', '40 + 60', '4 · 100 + 50', '10 + 20 + 30 + 40 + 50 + 60 + 70 + 80 + 90') }),
    () => auswahl('Wie lässt sich die Summe 1 + 2 + 3 + … + 20 aller Zahlen von 1 bis 20 vorteilhaft berechnen?', [
      opt('10 Paare mit der Summe 21 bilden: 10 · 21 = 210.', true), opt('20 Paare mit der Summe 21 bilden: 20 · 21 = 420.'), opt('10 Paare mit der Summe 20 bilden: 10 · 20 = 200.'), opt('Jede Zahl durch 10 ersetzen: 20 · 10 = 200.'), opt('Nur die erste und die letzte Zahl addieren: 1 + 20 = 21.')],
    h1('Addiere die erste und die letzte Zahl, dann die zweite und die vorletzte. Wie viele solche Paare gibt es?'), { nachweis: N('1 + 20', '2 + 19', '10 · 21', reihe(1, 20)) }),
    () => { const s1 = wahl([200, 300]), s2 = wahl([300, 400]), a = krumm(113, 187), b = s1 - a, c = krumm(123, 177), d = s2 - c;
      return zahl(`Berechne vorteilhaft: 1000 − ${a} − ${b} − ${c} − ${d}`, 1000 - s1 - s2, fehlerliste(1000 - s1 - s2, [[1000 - s1, 'sach-schritt-vergessen']]),
        h1('Fasse Subtrahenden zusammen, die sich zu vollen Hundertern ergänzen.'), { nachweis: N(`${a} + ${b}`, `${c} + ${d}`, `1000 − ${s1} − ${s2}`, `1000 − ${a} − ${b} − ${c} − ${d}`) }); },
    () => auswahl('Die Zahlen 10, 20, 30, 40 und 50 werden in ein Kreuz aus 5 Feldern geschrieben: ein Feld in der Mitte und je ein Feld links, rechts, oben und unten. Die drei Zahlen waagerecht und die drei Zahlen senkrecht sollen dieselbe Summe haben. Welche Zahlen können in der Mitte stehen? Wähle alle richtigen aus.', [
      opt('10', true), opt('20'), opt('30', true), opt('40'), opt('50', true)],
    h1('Die Zahl in der Mitte zählt in beiden Richtungen. Die vier übrigen Zahlen müssen sich in zwei Paare mit gleicher Summe aufteilen lassen.'), { mehrfach: true, nachweis: N('20 + 50', '30 + 40', '10 + 50', '20 + 40', '10 + 40', '20 + 30', '10 + 30 + 40 + 50', '10 + 20 + 30 + 50') }),
    () => { const off = wahl([10, 20, 30]);
      return luecken(`Es gilt 1 + 2 + 3 + … + 9 = 45. Berechne damit die Summe aller Zahlen von ${off + 1} bis ${off + 9}: ${off + 1} + ${off + 2} + ${off + 3} + … + ${off + 9} = {{a}}`, { a: [9 * off + 45, fehlerliste(9 * off + 45, [[off + 45, 'sach-schritt-vergessen'], [10 * off + 45, 'sach-schritt-vergessen']])] },
        h1(`Jeder der 9 Summanden ist um ${off} größer als in der bekannten Summe.`), { nachweis: N(reihe(1, 9), `${off + 1} − 1`, `9 · ${off} + 45`, reihe(off + 1, off + 9)) }); },
    () => auswahl('3 + 4 + 5 + 6 + 7 = 25 und 10 + 11 + 12 + 13 + 14 = 60. Stelle eine Regel für die Summe von 5 aufeinanderfolgenden Zahlen auf.', [
      opt('Die Summe ist 5-mal die mittlere Zahl, denn die äußeren Paare ergeben jeweils das Doppelte der mittleren Zahl.', true),
      opt('Die Summe ist 5-mal die erste Zahl.'), opt('Die Summe ist 5-mal die letzte Zahl.'), opt('Die Summe ist die erste Zahl plus die letzte Zahl.'), opt('Es gibt keine Regel. Jede Summe muss einzeln berechnet werden.')],
    h1('Vergleiche beide Summen mit der Zahl in der Mitte.'), { nachweis: N('3 + 4 + 5 + 6 + 7', '5 · 5', '3 + 7', '4 + 6', '10 + 11 + 12 + 13 + 14', '5 · 12', '10 + 14', '11 + 13') }),
  ]);
}
