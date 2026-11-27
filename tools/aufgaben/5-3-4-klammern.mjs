// Aufgaben zu 5.3.4 „Klammern“ (Lernziele B1 und B2) nach ADR 0015.
// F rechnet in zwei Schritten am Streifenbild und ordnet Geschichten zu, ohne das Wort Klammer.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, tabelle, L, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, GROESSTES, WERT, UEBERFLUESSIG } from '../werkzeug.mjs';

const KL = (kurz) => `5.3.4-${kurz}`;
const vor = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x += s), text: `+ ${s}` })); };

export function klammern() {
  // =====================================================================
  // B1 Rechenausdrücke mit Klammern berechnen
  // =====================================================================
  sechs(KL('B1'), 'F', [
    () => { const a = 10, b = zz(2, 3), c = zz(4, 5);
      return luecken(Z('Rechne in 2 Schritten.', `Erst: ${b} + ${c} = {{a}}`, `Dann: ${a} minus dieses Ergebnis = {{b}}`), { a: b + c, b: a - b - c },
        h3('Die beiden kleinen Teile gehen zusammen weg.', 'Erst 3 + 2 = 5. Dann 10 − 5 = 5.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`) }); },
    () => { const a = wahl([13, 15]), b = zz(2, 3), c = zz(4, 5), k = kind();
      return zahl(Z(`${k} hat ${a} Euro.`, `Ein Heft kostet ${b} Euro.`, `Ein Stift kostet ${c} Euro.`, `${k} kauft beides.`, 'Wie viel Euro bleiben?'), a - b - c, fehlerliste(a - b - c, [[a - b, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]),
        h3('Rechne erst aus, was beides zusammen kostet.', '10 Euro. Heft 2 Euro, Stift 3 Euro: zusammen 5 Euro. Es bleiben 5 Euro.', `${b} + ${c} = ${b + c}. Ziehe das von ${a} ab.`), { einheit: 'Euro', bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`) }); },
    () => { const a = wahl([17, 19]), b = zz(4, 6), c = zz(2, 3);
      return luecken(Z('Rechne in 2 Schritten.', `Erst: ${b} + ${c} = {{a}}`, `Dann: ${a} minus dieses Ergebnis = {{b}}`), { a: b + c, b: a - b - c },
        h3('Zähle erst die beiden kleinen Teile zusammen.', 'Erst 6 + 2 = 8. Dann 15 − 8 = 7.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`) }); },
    () => { const a = 20, b = zz(2, 3), c = zz(5, 6);
      return zahl(Z(`Rechne erst ${b} + ${c}.`, `Ziehe das Ergebnis von ${a} ab.`), a - b - c, fehlerliste(a - b - c, [[b + c, 'sach-schritt-vergessen'], [a + b + c, 'sub-addiert']]),
        h3('Es sind 2 Schritte: erst plus, dann minus.', 'Erst 3 + 4 = 7. Dann 20 − 7 = 13.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`) }); },
    () => { const a = wahl([13, 15, 16]), b = zz(4, 5), c = zz(2, 3);
      return luecken(Z('Beide Wege haben dasselbe Ergebnis.', `Weg 1: ${a} − ${b} − ${c} = {{a}}`, `Weg 2: ${b} + ${c} = {{b}}`, `und dann ${a} − ${b + c} = {{c}}`), { a: a - b - c, b: b + c, c: a - b - c },
        h3('Bei beiden Wegen gehen dieselben Teile weg.', '14 − 4 − 2 = 8. Oder: 4 + 2 = 6 und 14 − 6 = 8.', `${a} − ${b} = ${a - b}. Davon gehen noch ${c} weg.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − ${b} − ${c}`, `${b} + ${c}`, `${a} − ${b + c}`) }); },
    () => { const a = wahl([40, 50]), b = 20, c = 5;
      return zahl(Z(`Rechne erst ${b} + ${c}.`, `Ziehe das Ergebnis von ${a} ab.`), a - b - c, fehlerliste(a - b - c, [[b + c, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]),
        h3('Es sind 2 Schritte: erst plus, dann minus.', 'Erst 10 + 5 = 15. Dann 20 − 15 = 5.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`) }); },
  ]);
  sechs(KL('B1'), 'G', [
    () => { const a = zz(2, 5) * 10, b = zz(3, 6), c = 10 - b;
      return zahl(Z('Berechne.', `${a} − (${b} + ${c})`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']]),
        h3('Rechne zuerst aus, was in der Klammer steht.', '20 − (4 + 6): Klammer 4 + 6 = 10. Dann 20 − 10 = 10.', `Klammer: ${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(11, 25), b = wahl([5, 15]), c = zz(6, 9);
      return zahl(Z('Berechne.', `(${a} + ${b}) − ${c}`), a + b - c, fehlerliste(a + b - c, [[a + b + c, 'sub-addiert'], [a + b, 'sach-schritt-vergessen']]),
        h3('Rechne zuerst aus, was in der Klammer steht.', '(15 + 5) − 8: Klammer 15 + 5 = 20. Dann 20 − 8 = 12.', `Klammer: ${a} + ${b} = ${a + b}.`), { nachweis: N(`(${a} + ${b}) − ${c}`) }); },
    () => { const [b, c] = suche(() => [zz(11, 19), zz(3, 9)], ([x, y]) => (x + y) % 10 === 0), a = zz(4, 6) * 10 + 5;
      return luecken(Z(`${a} − (${b} + ${c})`, `Klammer zuerst: ${b} + ${c} = {{a}}`, `Dann ${a} minus dieses Ergebnis: {{b}}`), { a: b + c, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']])] },
        h3('Die Klammer sagt: Das rechnest du zuerst.', '45 − (12 + 8): Klammer 12 + 8 = 20. Dann 45 − 20 = 25.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − (${b} + ${c})`) }); },
    () => { const a = zz(5, 8) * 10, b = zz(2, 3) * 10 + 5, c = 5;
      return zahl(Z('Berechne.', `${a} − (${b} − ${c})`), a - (b - c), fehlerliste(a - b + c, [[a - b - c, 'klammer-ignoriert']]),
        h3('Rechne zuerst aus, was in der Klammer steht.', '40 − (15 − 5): Klammer 15 − 5 = 10. Dann 40 − 10 = 30.', `Klammer: ${b} − ${c} = ${b - c}.`), { nachweis: N(`${a} − (${b} − ${c})`) }); },
    () => { const a = zz(3, 5) * 10, b = 10, c = 5;
      return auswahl(Z('Welche Rechnung hat dasselbe Ergebnis?', `${a} − (${b} + ${c})`), [opt(`${a} − ${b + c}`, true), opt(`${a - b} + ${c}`, false, 'klammer-ignoriert'), opt(`${a} + ${b + c}`, false, 'sub-addiert')],
        h3('Rechne zuerst die Klammer aus.', '30 − (10 + 5): Die Klammer ergibt 15. Also 30 − 15.', `Klammer: ${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: [WERT(a - (b + c)), ...N(`${a} − (${b} + ${c})`)] }); },
    () => { const a = zz(4, 6) * 10, b = 10, c = 5, k = kind();
      return auswahl(Z(`${k} rechnet ${a} − (${b} + ${c}) so:`, `${a} − ${b} = ${a - b}`, `${a - b} + ${c} = ${a - b + c}`, 'Stimmt das?'), [opt('Stimmt. Man rechnet von links nach rechts.', false, 'klammer-ignoriert'), opt(`Falsch. Die Klammer kommt zuerst. Richtig ist ${a - b - c}.`, true), opt(`Falsch. Richtig ist ${a + b + c}.`, false, 'sub-addiert')],
        h3('Was in der Klammer steht, wird zuerst berechnet.', '40 − (10 + 5): Klammer 10 + 5 = 15. Dann 40 − 15 = 25.', `Klammer: ${b} + ${c} = ${b + c}. Dann ${a} − ${b + c}.`), { nachweis: [U(false, `${a} − (${b} + ${c})`, a - b + c), ...N(`${a} − (${b} + ${c})`)] }); },
  ]);
  sechs(KL('B1'), 'M', [
    () => { const a = zz(21, 38) * 10, b = zz(6, 9) * 10, c = zz(3, 9) * 5;
      return zahl(`Berechne: ${a} − (${b} + ${c})`, a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']]), h2('Berechne zuerst die Klammer.', `Klammer: ${b} + ${c} = ${b + c}.`), { nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(3, 5) * 100, b = zz(11, 19) * 10, c = zz(8, 12) * 10 + 5, d = zz(3, 7) * 5;
      return zahl(`Berechne: (${a} − ${b}) − (${c} − ${d})`, a - b - (c - d), fehlerliste(a - b - c + d, [[a - b - c - d, 'klammer-ignoriert']]), h2('Berechne beide Klammern getrennt und subtrahiere dann.', `Erste Klammer: ${a} − ${b} = ${a - b}. Zweite Klammer: ${c} − ${d} = ${c - d}.`), { nachweis: N(`(${a} − ${b}) − (${c} − ${d})`) }); },
    () => { const zeilen = [[zz(8, 9) * 10, zz(2, 3) * 10, zz(1, 2) * 10 + 5], [zz(12, 15) * 10, zz(4, 5) * 10 + 5, zz(2, 3) * 10 + 5], [zz(20, 25) * 10, zz(7, 9) * 10, zz(4, 6) * 10]];
      return tabelle('Setze die Zahlen für a, b und c ein und berechne.', ['a', 'b', 'c', 'a − (b + c)'], zeilen.map((z, i) => [...z, L('abc'[i])]), Object.fromEntries(zeilen.map(([a, b, c], i) => ['abc'[i], [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']])]])),
        h2('Berechne in jeder Zeile zuerst die Summe b + c.', `Erste Zeile: ${zeilen[0][1]} + ${zeilen[0][2]} = ${zeilen[0][1] + zeilen[0][2]}.`), { nachweis: N(...zeilen.map(([a, b, c]) => `${a} − (${b} + ${c})`)) }); },
    () => { const a = zz(4, 6) * 100, b = zz(21, 29) * 10, c = zz(5, 9) * 10 + 5;
      return zahl(`Berechne: ${a} − (${b} − ${c})`, a - b + c, fehlerliste(a - b + c, [[a - b - c, 'klammer-ignoriert']]), h2('Berechne zuerst die Klammer.', `Klammer: ${b} − ${c} = ${b - c}.`), { nachweis: N(`${a} − (${b} − ${c})`) }); },
    () => { const a = zz(7, 9) * 10, b = zz(2, 4) * 10, c = zz(1, 2) * 10;
      return auswahl(`In ${a} − ${b} + ${c} = ${a - b - c} fehlt eine Klammer. Wo muss sie stehen, damit die Gleichung stimmt?`, [opt(`${a} − (${b} + ${c})`, true), opt(`(${a} − ${b}) + ${c}`, false, 'klammer-falsch-gesetzt'), opt('Die Gleichung stimmt auch ohne Klammer.', false, 'klammer-ignoriert'), opt(`(${a} − ${b} + ${c})`, false, 'klammer-falsch-gesetzt')],
        h2('Berechne zuerst, was ohne Klammer herauskommt, und vergleiche.', `Ohne Klammer: ${a} − ${b} + ${c} = ${a - b + c}.`), { nachweis: N(WERT(a - b - c), `${a} − (${b} + ${c})`, `(${a} − ${b}) + ${c}`, `${a} − ${b} + ${c}`) }); },
    () => { const a = zz(8, 9) * 10, b = zz(3, 4) * 10, c = zz(1, 2) * 10;
      return auswahl(`„a − (b + c) hat immer denselben Wert wie a − b − c.“ Beurteile die Aussage.`, [
        opt(`Richtig. Beide Male werden b und c abgezogen. Beispiel: ${a} − (${b} + ${c}) = ${a - b - c} und ${a} − ${b} − ${c} = ${a - b - c}.`, true),
        opt(`Falsch. Beispiel: ${a} − (${b} + ${c}) = ${a - b - c}, aber ${a} − ${b} − ${c} = ${a - b + c}.`, false, 'sub-klammerfehler'),
        opt('Falsch. Klammern verändern das Ergebnis immer.', false, 'klammer-ignoriert'),
        opt('Das stimmt nur, wenn b und c gleich groß sind.')],
      h2('Rechne beide Ausdrücke an einem Beispiel aus und überlege, was jeweils insgesamt abgezogen wird.', `${a} − (${b} + ${c}) = ${a} − ${b + c}.`), { nachweis: [U(true), ...N(`${a} − (${b} + ${c})`, `${a} − ${b} − ${c}`)] }); },
  ]);
  sechs(KL('B1'), 'E', [
    () => { const a = 1000, b = zz(4, 6) * 100, c = zz(11, 19) * 10, d = zz(5, 9) * 10;
      return zahl(`Berechne: ${a} − [${b} − (${c} + ${d})]`, a - (b - (c + d)), fehlerliste(a - b + c + d, [[a - b - c - d, 'klammer-ignoriert'], [a - b - c + d, 'klammer-ignoriert']]), h1('Bei verschachtelten Klammern rechnest du von innen nach außen.'), { nachweis: N(`${a} − (${b} − (${c} + ${d}))`) }); },
    () => { const [a, b, c, d] = [zz(8, 9) * 10, zz(3, 4) * 10, 20, 10];
      return auswahl(`In ${a} − ${b} − ${c} + ${d} darfst du ein Klammerpaar setzen. Welcher Term hat den größten Wert?`, [
        opt(`${a} − (${b} − ${c}) + ${d}`, true), opt(`${a} − ${b} − (${c} + ${d})`, false, 'klammer-falsch-gesetzt'), opt(`(${a} − ${b}) − ${c} + ${d}`, false, 'klammer-ignoriert'), opt(`${a} − (${b} − ${c} + ${d})`, false, 'klammer-falsch-gesetzt'), opt(`${a} − (${b} + ${c}) + ${d}`, false, 'klammer-falsch-gesetzt')],
        h1('Der Wert wird groß, wenn insgesamt möglichst wenig subtrahiert wird.'), { nachweis: [GROESSTES, ...N(`${a} − (${b} − ${c}) + ${d}`)] }); },
    () => { const a = zz(2, 3) * 100, c = zz(3, 9) * 5, x = zz(11, 17) * 5, r = a - x - c;
      return luecken(`Bestimme die fehlende Zahl: ${a} − ({{a}} + ${c}) = ${r}`, { a: [x, fehlerliste(x, [[a - r, 'sach-schritt-vergessen'], [a - r + c, 'klammer-ignoriert']])] }, h1('Bestimme zuerst den Wert der ganzen Klammer.'), { nachweis: N(`${a} − ${r}`, `${a - r} − ${c}`, `${a} − (${x} + ${c})`) }); },
    () => auswahl('50 − (20 − 5) = 35 und 50 − 20 + 5 = 35. Ebenso 90 − (40 − 10) = 60 und 90 − 40 + 10 = 60. Stelle die Regel für a − (b − c) auf.', [
      opt('a − (b − c) = a − b + c: Es wird um c weniger abgezogen, also kommt c wieder dazu.', true),
      opt('a − (b − c) = a − b − c: Die Klammer darf man einfach weglassen.', false, 'klammer-ignoriert'),
      opt('a − (b − c) = a + b − c: Das Minus vor der Klammer wird zu einem Plus.', false, 'klammer-falsch-gesetzt'),
      opt('a − (b − c) = (a − b) − c: Die Klammer darf man verschieben.', false, 'klammer-falsch-gesetzt'),
      opt('Es gibt keine Regel. Jedes Beispiel muss einzeln berechnet werden.')],
    h1('Vergleiche in beiden Beispielen die Rechenzeichen vor der letzten Zahl.'), { nachweis: N('50 − (20 − 5)', '50 − 20 + 5', '90 − (40 − 10)', '90 − 40 + 10') }),
    () => { const a = wahl([100, 120]), [b, c, d] = [50, 30, 10];
      return zahl(`In ${a} − ${b} − ${c} − ${d} darfst du genau ein Klammerpaar setzen. Bestimme den größten Wert, den du so erreichen kannst.`, a - (b - c - d), fehlerliste(a - b + c + d, [[a - (b - c) - d, 'klammer-falsch-gesetzt'], [a - b - c - d, 'klammer-ignoriert']]),
        h1('Probiere alle Möglichkeiten: Die Klammer kann zwei oder drei Zahlen umfassen.'), { nachweis: N(`${a} − ${b} − ${c} − ${d}`, `${a} − (${b} − ${c} − ${d})`, `${a} − (${b} − ${c}) − ${d}`, `${a} − ${b} − (${c} − ${d})`, `(${a} − ${b}) − ${c} − ${d}`, `(${a} − ${b} − ${c}) − ${d}`, `${a} − (${b} − ${c} − ${d})`) }); },
    () => auswahl('Jonas behauptet: „Eine Klammer hinter einem Plus darf ich weglassen. Es gilt immer a + (b − c) = a + b − c.“ Wähle die richtige Begründung.', [
      opt('Das stimmt immer. In beiden Termen kommt b dazu und c geht weg. Beispiel: 50 + (20 − 5) = 65 und 50 + 20 − 5 = 65.', true),
      opt('Das stimmt nie. Klammern darf man nicht weglassen.', false, 'klammer-ignoriert'),
      opt('Das stimmt nur, wenn c kleiner ist als a.'),
      opt('Das stimmt nie. Beim Weglassen der Klammer wird aus dem Minus ein Plus, also ändert sich der Wert.', false, 'klammer-falsch-gesetzt'),
      opt('Das stimmt immer, denn auch a − (b − c) = a − b − c.', false, 'klammer-ignoriert')],
    h1('Überlege für beide Terme, was zu a dazukommt und was weggeht.'), { nachweis: [U(true), ...N('50 + (20 − 5)', '50 + 20 − 5')] }),
  ]);

  // =====================================================================
  // B2 Zu einem Text den passenden Rechenausdruck finden
  // =====================================================================
  sechs(KL('B2'), 'F', [
    () => { const a = zz(9, 12), b = zz(4, 5), c = zz(2, 3);
      return auswahl(Z(`Im Bus sind ${a} Kinder.`, `${b} Kinder steigen aus.`, `Dann steigen noch ${c} Kinder aus.`, 'Welche Rechnung passt?'), [opt(`${a} − ${b} − ${c}`, true), opt(`${a} − ${b} + ${c}`, false, 'sub-klammerfehler'), opt(`${a} + ${b} + ${c}`, false, 'sach-falsche-rechnung')],
        h3('Aussteigen heißt minus. Hier steigen 2-mal Kinder aus.', '8 Kinder. 2 steigen aus, dann 1: 8 − 2 − 1.', `Erst gehen ${b} weg. Dann gehen ${c} weg.`), { bild: B.menge(a, { weg: b + c }), nachweis: N(`${a} − ${b} − ${c}`, `${b} + ${c}`) }); },
    () => { const a = zz(6, 9), b = zz(4, 5), c = zz(2, 3);
      return auswahl(Z(`Im Bus sind ${a} Kinder.`, `${b} Kinder steigen ein.`, `Dann steigen ${c} Kinder aus.`, 'Welche Rechnung passt?'), [opt(`${a} + ${b} − ${c}`, true), opt(`${a} − ${b} − ${c}`, false, 'sach-falsche-rechnung'), opt(`${a} + ${b} + ${c}`, false, 'sach-falsche-rechnung')],
        h3('Einsteigen heißt plus. Aussteigen heißt minus.', '5 Kinder. 3 steigen ein, 2 steigen aus: 5 + 3 − 2.', `Erst kommen ${b} dazu. Dann gehen ${c} weg.`), { bild: B.menge(a, { dazu: b, weg: c }), nachweis: N(`${a} + ${b} − ${c}`) }); },
    () => { const a = zz(11, 15), b = zz(4, 5), c = zz(2, 3), [k1, k2] = zweiKinder();
      return zahl(Z(`Auf dem Tisch liegen ${a} Nüsse.`, `${k1} isst ${b} Nüsse.`, `${k2} isst ${c} Nüsse.`, 'Wie viele Nüsse bleiben?'), a - b - c, fehlerliste(a - b - c, [[a - b, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]),
        h3('Zähle im Bild die Plättchen ohne Strich.', '10 Nüsse. 3 und 2 werden gegessen: 10 − 3 − 2 = 5.', `Zusammen werden ${b} + ${c} = ${b + c} Nüsse gegessen.`), { bild: B.menge(a, { weg: b + c }), nachweis: N(`${a} − ${b} − ${c}`, `${b} + ${c}`) }); },
    () => { const a = zz(6, 8), b = zz(2, 3), c = zz(4, 5), k = kind();
      return zahl(Z(`${k} hat ${a} Sticker.`, `${k} bekommt ${b} Sticker dazu.`, `Dann bekommt ${k} noch ${c} Sticker.`, `Wie viele Sticker hat ${k} jetzt?`), a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]),
        h3('Es kommt 2-mal etwas dazu. Folge den Sprüngen.', '4 Sticker. 2 dazu, dann 3 dazu: 4 + 2 + 3 = 9.', `${a} + ${b} = ${a + b}. Dann kommen noch ${c} dazu.`), { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b, c) }), nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const a = wahl([12, 15]), b = zz(4, 5), c = zz(2, 3);
      return auswahl(Z(`Die Rechnung ist ${a} − ${b} − ${c}.`, 'Welche Geschichte passt?'), [opt(`${a} Kekse. Mia isst ${b} Kekse. Tom isst ${c} Kekse.`, true), opt(`${a} Kekse. Mia isst ${b} Kekse. Tom bringt ${c} Kekse.`, false, 'sach-falsche-rechnung'), opt(`${a} Kekse. Mia bringt ${b} Kekse. Tom bringt ${c} Kekse.`, false, 'sach-falsche-rechnung')],
        h3('Hier stehen 2 Minus. Es geht 2-mal etwas weg.', '10 − 3 − 2 passt zu: 10 Äpfel. 3 werden gegessen, dann noch 2.', 'Suche die Geschichte, in der 2-mal etwas weggeht.'), { bild: B.menge(a, { weg: b + c }), nachweis: N(`${a} − ${b} − ${c}`, `${b} + ${c}`) }); },
    () => { const a = zz(8, 11), b = zz(4, 5), c = zz(2, 3), k = kind();
      return zahl(Z(`${k} hat ${a} Murmeln.`, `${k} gewinnt ${b} Murmeln dazu.`, `Dann verliert ${k} ${c} Murmeln.`, `Wie viele Murmeln hat ${k} jetzt?`), a + b - c, fehlerliste(a + b - c, [[a + b, 'sach-schritt-vergessen'], [a + b + c, 'sach-falsche-rechnung']]),
        h3('Gewinnen heißt plus. Verlieren heißt minus.', '6 Murmeln. 3 gewinnen, 2 verlieren: 6 + 3 − 2 = 7.', `${a} + ${b} = ${a + b}. Davon gehen ${c} weg.`), { bild: B.menge(a, { dazu: b, weg: c }), nachweis: N(`${a} + ${b} − ${c}`) }); },
  ]);
  sechs(KL('B2'), 'G', [
    () => { const a = wahl([50, 60]), b = zz(11, 15), c = 20, k = kind();
      return auswahl(Z(`${k} hat ${a} Euro.`, `${k} kauft ein Buch für ${b} Euro.`, `${k} kauft ein Spiel für ${c} Euro.`, 'Welche Rechnung passt?'), [opt(`${a} − (${b} + ${c})`, true), opt(`${a} − ${b} + ${c}`, false, 'klammer-ignoriert'), opt(`(${a} + ${b}) − ${c}`, false, 'klammer-falsch-gesetzt')],
        h3('Beide Preise gehen weg. In der Klammer steht, was zusammen weggeht.', '30 Euro. Ein Heft für 4 Euro, ein Ball für 6 Euro: 30 − (4 + 6).', `Zusammen gehen ${b} + ${c} Euro weg.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = wahl([40, 50]), b = zz(12, 16), c = 10, k = kind();
      return zahl(Z(`${k} hat ${a} Euro.`, `${k} kauft einen Ball für ${b} Euro.`, `${k} kauft ein Heft für ${c} Euro.`, 'Wie viel Euro bleiben?'), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert'], [a - b, 'sach-schritt-vergessen']]),
        h3('Rechne erst aus, was beides zusammen kostet.', '30 Euro. Zusammen 4 + 6 = 10 Euro ausgegeben. Es bleiben 20 Euro.', `${b} + ${c} = ${b + c}. Ziehe das von ${a} ab.`), { einheit: 'Euro', bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(4, 6) * 10, b = 15, c = 5;
      return luecken(Z(`Die Rechnung ist ${a} − (${b} + ${c}).`, 'Wie viel wird zusammen abgezogen? {{a}}', 'Was ist das Ergebnis? {{b}}'), { a: b + c, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']])] },
        h3('In der Klammer steht, was zusammen abgezogen wird.', '40 − (15 + 5): Zusammen werden 20 abgezogen. Ergebnis 20.', `${b} + ${c} = ${b + c}.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − (${b} + ${c})`) }); },
    () => { const a = zz(3, 5) * 10, b = zz(6, 8), c = zz(3, 7);
      return auswahl(Z(`Addiere ${b} und ${c}.`, `Ziehe das Ergebnis von ${a} ab.`, 'Welche Rechnung passt?'), [opt(`${a} − (${b} + ${c})`, true), opt(`(${b} + ${c}) − ${a}`, false, 'begriffe-verwechselt'), opt(`${a} − ${b} + ${c}`, false, 'klammer-ignoriert')],
        h3('Was zuerst gerechnet wird, steht in der Klammer.', 'Addiere 3 und 4. Ziehe das Ergebnis von 20 ab: 20 − (3 + 4).', `Zuerst wird ${b} + ${c} gerechnet. Das kommt in die Klammer.`), { nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(3, 4) * 10, b = zz(6, 9), c = zz(11, 14);
      return auswahl(Z(`Die Rechnung ist ${a} − (${b} + ${c}).`, 'Welche Geschichte passt?'), [opt(`${a} Plätze. ${b} Kinder und ${c} Erwachsene setzen sich.`, true), opt(`${a} Plätze. ${b} Kinder setzen sich. ${c} Plätze kommen dazu.`, false, 'klammer-ignoriert'), opt(`${b} Kinder und ${c} Erwachsene. ${a} Menschen kommen dazu.`, false, 'sach-falsche-rechnung')],
        h3('In der Klammer steht, was zusammen weggeht.', '20 − (3 + 5) passt zu: 20 Plätze. 3 Kinder und 5 Erwachsene setzen sich.', `Suche die Geschichte, in der ${b} und ${c} zusammen weggehen.`), { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(6, 8) * 10, b = 25, c = 10, k = kind();
      return auswahl(Z(`${k} hat ${a} Euro.`, `${k} gibt erst ${b} Euro aus, dann ${c} Euro.`, `${k} schreibt: ${a} − ${b} + ${c}`, 'Stimmt das?'), [opt('Stimmt. Die Zahlen stehen in der richtigen Reihenfolge.', false, 'klammer-ignoriert'), opt(`Falsch. Beide Beträge gehen weg. Richtig ist ${a} − (${b} + ${c}).`, true), opt(`Falsch. Richtig ist ${a} + ${b} + ${c}.`, false, 'sach-falsche-rechnung')],
        h3('Ausgeben heißt minus. Hier wird 2-mal Geld ausgegeben.', '50 Euro, 10 Euro und 5 Euro ausgegeben: 50 − (10 + 5).', `Zusammen gehen ${b} + ${c} = ${b + c} Euro weg.`), { nachweis: [U(false), ...N(`${a} − (${b} + ${c})`, `${a} − ${b} + ${c}`)] }); },
  ]);
  sechs(KL('B2'), 'M', [
    () => { const a = wahl([200, 250, 300]), b = zz(4, 6) * 10 + 5, c = zz(2, 4) * 10;
      return auswahl(`Welcher Rechenausdruck passt? „Subtrahiere die Summe von ${b} und ${c} von ${a}.“`, [opt(`${a} − (${b} + ${c})`, true), opt(`(${b} + ${c}) − ${a}`, false, 'begriffe-verwechselt'), opt(`${a} − ${b} + ${c}`, false, 'klammer-ignoriert'), opt(`(${a} − ${b}) + ${c}`, false, 'klammer-falsch-gesetzt')],
        h2('„Von“ nennt den Minuenden. Die Summe wird als Ganzes abgezogen und steht deshalb in der Klammer.', `Der Minuend ist ${a}. Abgezogen wird ${b} + ${c}.`), { nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = wahl([500, 600]), b = zz(31, 38) * 10, c = zz(12, 18) * 10;
      return zahl(`Subtrahiere von ${a} die Differenz der Zahlen ${b} und ${c}. Stelle den Rechenausdruck auf und berechne.`, a - (b - c), fehlerliste(a - b + c, [[a - b - c, 'klammer-ignoriert']]), h2('Die Differenz wird als Ganzes subtrahiert. Sie steht in einer Klammer.', `Rechenausdruck: ${a} − (${b} − ${c}). Klammer: ${b} − ${c} = ${b - c}.`), { nachweis: N(`${a} − (${b} − ${c})`) }); },
    () => { const a = wahl([90, 80]), b = zz(3, 4) * 10, c = wahl([15, 25]);
      return zuordnen('Ordne jedem Text den passenden Rechenausdruck zu.', [[`Subtrahiere die Summe von ${b} und ${c} von ${a}.`, `${a} − (${b} + ${c})`], [`Subtrahiere ${b} von ${a} und addiere ${c}.`, `(${a} − ${b}) + ${c}`], [`Subtrahiere die Differenz von ${b} und ${c} von ${a}.`, `${a} − (${b} − ${c})`]],
        h2('Achte darauf, was als Ganzes abgezogen wird. Das steht in der Klammer.', `„Die Summe von ${b} und ${c}“ ist der Ausdruck ${b} + ${c}.`), { nachweis: N(`${a} − (${b} + ${c})`, `(${a} − ${b}) + ${c}`, `${a} − (${b} − ${c})`) }); },
    () => { const a = zz(8, 9) * 10, b = zz(3, 4) * 10 + 5, c = zz(15, 25);
      return auswahl(`Welcher Rechenausdruck passt? „Addiere zur Differenz von ${a} und ${b} die Zahl ${c}.“`, [opt(`(${a} − ${b}) + ${c}`, true), opt(`${a} − (${b} + ${c})`, false, 'klammer-falsch-gesetzt'), opt(`(${a} + ${b}) − ${c}`, false, 'begriffe-verwechselt'), opt(`${c} − (${a} − ${b})`, false, 'begriffe-verwechselt')],
        h2('Bilde zuerst die Differenz. Danach wird addiert.', `Die Differenz von ${a} und ${b} ist ${a} − ${b}.`), { nachweis: N(`(${a} − ${b}) + ${c}`) }); },
    () => { const a = wahl([80, 100]), b = zz(26, 38), c = zz(12, 19), k = kind();
      return sach(`${k} hat ${a} € gespart und kauft einen Rucksack für ${b} € und eine Trinkflasche für ${c} €. Zur Situation passt der Rechenausdruck ${a} − (${b} + ${c}).`, [teil('Berechne den Wert der Klammer. Er gibt an, wie viel zusammen ausgegeben wird.', b + c, '€'), teil('Berechne das Restgeld.', a - b - c, '€', fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']]))],
        h2('Die Klammer fasst beide Preise zusammen.', `${b} + ${c} = ${b + c}.`), { nachweis: N(`${b} + ${c}`, `${a} − (${b} + ${c})`) }); },
    () => { const a = 80, b = zz(31, 38), c = zz(15, 19), [k1, k2] = zweiKinder();
      return auswahl(`Von ${a} € werden erst ${b} € und dann ${c} € ausgegeben. ${k1} schreibt ${a} − ${b} − ${c}, ${k2} schreibt ${a} − (${b} + ${c}). Beurteile die beiden Rechenausdrücke.`, [
        opt(`Beide passen. Sie haben denselben Wert ${a - b - c}: Einmal werden die Beträge nacheinander abgezogen, einmal zusammen.`, true),
        opt(`Nur der Ausdruck von ${k1} passt. Eine Klammer verändert das Ergebnis.`, false, 'klammer-ignoriert'),
        opt(`Nur der Ausdruck von ${k2} passt. Ohne Klammer wird ${c} addiert.`, false, 'sub-klammerfehler'),
        opt('Keiner von beiden passt. Hier muss addiert werden.', false, 'sach-falsche-rechnung')],
      h2('Berechne beide Rechenausdrücke und vergleiche.', `${a} − ${b} − ${c} = ${a - b - c}.`), { nachweis: N(`${a} − ${b} − ${c}`, `${a} − (${b} + ${c})`) }); },
  ]);
  sechs(KL('B2'), 'E', [
    () => { const a = 1000, b = zz(21, 28) * 10, c = wahl([400, 450]), d = zz(12, 18) * 10;
      return auswahl(`Welcher Term passt? „Subtrahiere von ${a} die Summe aus ${b} und der Differenz von ${c} und ${d}.“`, [opt(`${a} − [${b} + (${c} − ${d})]`, true), opt(`${a} − ${b} + (${c} − ${d})`, false, 'klammer-ignoriert'), opt(`(${a} − ${b}) + ${c} − ${d}`, false, 'klammer-falsch-gesetzt'), opt(`${a} − [(${b} + ${c}) − ${d}]`, false, 'klammer-falsch-gesetzt'), opt(`[${a} − (${b} + ${c})] − ${d}`, false, 'klammer-falsch-gesetzt')],
        h1('Baue den Term von innen nach außen: zuerst die Differenz, dann die Summe, dann die Subtraktion von 1000.'), { nachweis: N(`${a} − [${b} + (${c} − ${d})] = ${a - (b + (c - d))}`) }); },
    () => { const p = zz(24, 28), kr = zz(2, 4), neu = zz(2, 3), frei = 30;
      return zahl(`Eine Klasse hat ${frei} Plätze im Bus reserviert. Angemeldet sind ${p} Kinder. ${kr} Kinder sind krank, ${neu} Begleitpersonen kommen dazu. Stelle einen Term auf und berechne, wie viele Plätze frei bleiben.`, frei - (p - kr + neu), fehlerliste(frei - (p - kr + neu), [[frei - p - kr + neu, 'klammer-ignoriert'], [frei - (p - kr), 'sach-schritt-vergessen']]),
        h1('Berechne zuerst in einer Klammer, wie viele Personen tatsächlich mitfahren.'), { nachweis: N(`${p} − ${kr} + ${neu}`, `${frei} − (${p} − ${kr} + ${neu})`) }); },
    () => { const a = wahl([300, 400]), b = zz(11, 15) * 10, c = zz(3, 9) * 5;
      return auswahl(`Welcher Text passt zum Term ${a} − (${b} − ${c})?`, [
        opt(`Ein Saal hat ${a} Plätze. ${b} Karten wurden verkauft, ${c} davon wurden zurückgegeben. Gesucht sind die freien Plätze.`, true),
        opt(`Ein Saal hat ${a} Plätze. Erst kommen ${b} Gäste, dann noch ${c}. Gesucht sind die freien Plätze.`, false, 'klammer-ignoriert'),
        opt(`Ein Saal hat ${a} Plätze. ${b} Gäste kommen, ${c} Stühle werden weggeräumt. Gesucht sind die freien Plätze.`, false, 'klammer-ignoriert'),
        opt(`In einem Saal sitzen ${a} Gäste. Erst gehen ${b}, dann gehen ${c}. Gesucht sind die übrigen Gäste.`, false, 'klammer-ignoriert'),
        opt(`In einem Saal sitzen ${b} Gäste. ${c} gehen, ${a} kommen dazu. Gesucht sind alle Gäste.`, false, 'sach-falsche-rechnung')],
      h1('Die Klammer beschreibt, wie viele Plätze tatsächlich besetzt sind.'), { nachweis: N(`${a} − (${b} − ${c})`) }); },
    () => auswahl('Für welche Zahlen im Kästchen haben die Terme 100 − (▢ + 20) und 100 − ▢ − 20 denselben Wert? Stelle die Regel auf.', [
      opt('Für jede Zahl von 0 bis 80: Beide Terme subtrahieren insgesamt die Zahl und 20.', true),
      opt('Nur für die Zahl 0.', false, 'klammer-ignoriert'),
      opt('Nur für die Zahl 20.'),
      opt('Für keine Zahl: Eine Klammer verändert immer den Wert, sonst wäre sie unnötig.', false, 'klammer-ignoriert'),
      opt('Nur für gerade Zahlen.')],
    h1('Setze mehrere Zahlen ein, zum Beispiel 10, 35 und 80, und vergleiche die Werte.'), { nachweis: N('100 − (10 + 20)', '100 − 10 − 20', '100 − (35 + 20)', '100 − 35 − 20', '100 − (80 + 20)', '100 − 80 − 20') }),
    () => { const a = 50, heft = zz(3, 5), anz = 3, stift = zz(6, 9), alter = zz(10, 12), k = kind();
      return zahl(`${k} ist ${alter} Jahre alt und hat ${a} €. ${k} kauft ${anz} Hefte für je ${heft} € und einen Füller für ${stift} €. Stelle einen Term auf und berechne das Restgeld.`, a - (anz * heft + stift), fehlerliste(a - (anz * heft + stift), [[a - (heft + stift), 'sach-schritt-vergessen'], [a - (anz * heft + stift) - alter, 'sach-unnoetige-angabe']]),
        h1('Nicht jede Angabe wird gebraucht. Die Klammer fasst alle Ausgaben zusammen.'), { einheit: '€', nachweis: [UEBERFLUESSIG(alter), ...N(`${anz} · ${heft} + ${stift}`, `${a} − (${anz} · ${heft} + ${stift})`)] }); },
    () => { const [a, b, c, d] = [60, 20, 10, 5];
      return auswahl(`In ${a} − ${b} − ${c} + ${d} soll genau ein Klammerpaar gesetzt werden, sodass der Wert 45 herauskommt. Welcher Term erfüllt das?`, [opt(`${a} − (${b} − ${c} + ${d})`, true), opt(`${a} − (${b} − ${c}) + ${d}`, false, 'klammer-falsch-gesetzt'), opt(`${a} − ${b} − (${c} + ${d})`, false, 'klammer-falsch-gesetzt'), opt(`(${a} − ${b}) − ${c} + ${d}`, false, 'klammer-ignoriert'), opt(`${a} − (${b} + ${c}) + ${d}`, false, 'klammer-falsch-gesetzt')],
        h1('Berechne jeden Term. Achte auf die Rechenzeichen innerhalb der Klammer.'), { nachweis: [WERT(45), ...N(`${a} − (${b} − ${c} + ${d}) = 45`)] }); },
  ]);
}
