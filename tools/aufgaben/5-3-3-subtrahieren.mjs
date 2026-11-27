// Aufgaben zu 5.3.3 „Subtrahieren“ (Lernziele S1 bis S5) nach ADR 0015.
// F übt den Grundlagen-Baustein am Bild, G das Lernziel in einem Schritt, M Muster und Vorgehensweisen, E Regeln und Probleme.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, strahl, raster, tabelle, L, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, subUebertraege, kleinerVonGroesser, subUebertragVergessen, runde, kind, zweiKinder, U, UEBERFLUESSIG } from '../werkzeug.mjs';

const S = (kurz) => `5.3.3-${kurz}`;
// Zwei Zahlen mit genau `n` Überträgen beim Subtrahieren.
const paar = (von, bis, n, passt = () => true) => suche(() => { const a = zz(von, bis); return [a, zz(Math.ceil(von / 4), a - Math.ceil(von / 10))]; },
  ([a, b]) => b > 0 && a - b >= 11 && String(a - b).length === String(a).length && !/0/.test(`${a}${b}`) && subUebertraege(a, b) === n && a % 10 !== b % 10 && passt(a, b));
const subFehler = (a, b) => fehlerliste(a - b, [[kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'], [subUebertragVergessen(a, b), 'sub-uebertrag-vergessen'], [a + b, 'sub-addiert']]);
// Zahlenstrahl mit Einerschritten rund um die Zahlen.
const strahlUm = (klein, gross, extra = {}) => { const von = Math.floor(klein / 10) * 10, bis = Math.max(von + 20, Math.ceil((gross + 1) / 10) * 10); return { von, bis, schritt: 1, beschriftung: bis - von > 20 ? 10 : 5, ...extra }; };
const zurueck = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x -= s), text: `− ${s}` })); };

export function subtrahieren() {
  // =====================================================================
  // S1 Fachbegriffe Minuend, Subtrahend, Differenz
  // =====================================================================
  sechs(S('S1'), 'F', [
    () => { const a = zz(6, 12), b = zz(2, a - 3);
      return auswahl(Z('Schau dir das Bild an.', 'Welche Rechnung passt?'), [opt(`${a} − ${b}`, true), opt(`${a} + ${b}`, false, 'sub-addiert'), opt(`${b} − ${a}`, false, 'begriffe-verwechselt')],
        h3('Durchgestrichen heißt: weggenommen. Wegnehmen ist minus.', 'Bild: 7 Plättchen, 2 durchgestrichen. Die Rechnung ist 7 − 2.', `Zähle alle Plättchen: ${a}. Zähle die durchgestrichenen: ${b}.`),
        { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(9, 16), b = zz(3, a - 4);
      return zahl(Z(`Es sind ${a} Plättchen.`, `${b} Plättchen sind durchgestrichen.`, 'Wie viele Plättchen bleiben?'), a - b, fehlerliste(a - b, [[a + b, 'sub-addiert']]),
        h3('Zähle die Plättchen ohne Strich.', '8 Plättchen, 3 durchgestrichen: Es bleiben 5.', `Rechne ${a} − ${b}.`),
        { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(8, 15), b = zz(2, a - 3);
      return luecken(Z('Schreibe die Minus-Aufgabe zum Bild.', '{{a}} − {{b}} = {{c}}'), { a, b, c: a - b },
        h3('Vorne stehen alle Plättchen. Dann kommen die durchgestrichenen.', '9 Plättchen, 4 durchgestrichen: 9 − 4 = 5.', `Im Bild sind ${a} Plättchen. ${b} sind durchgestrichen.`),
        { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(12, 19), b = zz(3, 8);
      return strahl('ablesen', Z('Der Pfeil springt zurück.', 'Bei welcher Zahl landet er?'), strahlUm(a - b, a, { start: a, spruenge: zurueck(a, b), pfeil: a - b }), a - b, fehlerliste(a - b, [[a + b, 'sub-addiert']]),
        h3('Zurück springen heißt minus.', 'Start 14, Sprung − 4: Du landest bei 10.', `Der Start ist bei ${a}. Zähle ${b} Striche nach links.`),
        { nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(11, 18), b = zz(3, 7);
      return zahl(Z(`Vorher waren es ${a} Plättchen.`, `Jetzt sind es noch ${a - b} Plättchen.`, 'Wie viele Plättchen wurden weggenommen?'), b, fehlerliste(b, [[a - b, 'begriffe-verwechselt'], [a + a - b, 'sub-addiert']]),
        h3('Zähle die durchgestrichenen Plättchen.', 'Vorher 10, jetzt 6: 4 wurden weggenommen.', `Rechne ${a} − ${a - b}.`),
        { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${a - b}`) }); },
    () => { const a = zz(7, 10), [x, y, w] = mische([1, 2, 3, 4, 5, 6].filter((v) => v < a)).slice(0, 3);
      return zuordnen(Z(`Im Feld liegen ${a} Plättchen.`, 'Ordne jeder Aufgabe das Ergebnis zu.'), [x, y, w].map((v) => [`${a} − ${v}`, a - v]),
        h3('Decke so viele Plättchen zu, wie weggenommen werden.', '8 − 3: Decke 3 Plättchen zu. Es bleiben 5.', `${a} − ${x} = ${a - x}.`),
        { bild: B.zehnerfeld(a), nachweis: N(...[x, y, w].map((v) => `${a} − ${v}`)) }); },
  ]);
  sechs(S('S1'), 'G', [
    () => { const [a, b] = paar(30, 99, 0); const [was, wert] = wahl([['Minuend', a], ['Subtrahend', b], ['Differenz', a - b]]);
      return auswahl(Z(`${a} − ${b} = ${a - b}`, `Wie heißt die Zahl ${wert} in dieser Aufgabe?`), ['Minuend', 'Subtrahend', 'Differenz'].map((n) => opt(n, n === was, n === was ? undefined : 'begriffe-verwechselt')),
        h3('Minuend − Subtrahend = Differenz.', '9 − 4 = 5: 9 ist der Minuend, 4 der Subtrahend, 5 die Differenz.', `${a} steht vorne. Das ist der Minuend.`)); },
    () => { const [a, b] = paar(30, 99, 0);
      return luecken(Z(`${a} − ${b} = ${a - b}`, 'Der Minuend ist {{a}}.', 'Der Subtrahend ist {{b}}.', 'Die Differenz ist {{c}}.'), { a: [a, fehlerliste(a, [[b, 'begriffe-verwechselt']])], b: [b, fehlerliste(b, [[a, 'begriffe-verwechselt']])], c: a - b },
        h3('Der Minuend steht vorne. Der Subtrahend wird abgezogen.', '9 − 4 = 5: Minuend 9, Subtrahend 4, Differenz 5.', `Der Minuend ist ${a}.`),
        { bild: B.streifen(a, [b, a - b]), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(5, 9) * 10 + zz(1, 9), b = zz(1, 4) * 10;
      return zahl(Z(`Der Minuend ist ${a}.`, `Der Subtrahend ist ${b}.`, 'Berechne die Differenz.'), a - b, fehlerliste(a - b, [[a + b, 'sub-addiert']]),
        h3('Die Differenz ist das Ergebnis der Minus-Aufgabe.', 'Minuend 50, Subtrahend 20: 50 − 20 = 30.', `Rechne ${a} − ${b}.`), { bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(40, 99, 0, (x, y) => new Set([x, y, x - y]).size === 3);
      return zuordnen(Z(`${a} − ${b} = ${a - b}`, 'Ordne jeder Zahl den Namen zu.'), [[a, 'Minuend'], [b, 'Subtrahend'], [a - b, 'Differenz']],
        h3('Minuend − Subtrahend = Differenz.', '9 − 4 = 5: 9 ist der Minuend, 4 der Subtrahend, 5 die Differenz.', `${a - b} ist das Ergebnis. Das Ergebnis heißt Differenz.`)); },
    () => { const d = zz(2, 5) * 10, b = zz(2, 4) * 10 + 5;
      return zahl(Z(`Die Differenz ist ${d}.`, `Der Subtrahend ist ${b}.`, 'Wie groß ist der Minuend?'), d + b, fehlerliste(d + b, [[Math.abs(b - d), 'probe-falsche-umkehr']]),
        h3('Der Minuend ist die ganze Zahl am Anfang. Zähle beide Teile zusammen.', 'Differenz 20, Subtrahend 15: Der Minuend ist 35.', `Rechne ${d} + ${b}.`),
        { bild: B.streifen(frage(d + b), [b, d]), nachweis: N(`${d} + ${b}`, `${d + b} − ${b}`) }); },
    () => { const [a, b] = paar(40, 99, 0); const k = kind();
      return auswahl(Z(`${k} sagt:`, `„Bei ${a} − ${b} = ${a - b} ist ${b} der Minuend.“`, 'Stimmt das?'), [opt('Stimmt. Der Minuend steht hinter dem Minus.', false, 'begriffe-verwechselt'), opt(`Falsch. ${b} ist der Subtrahend.`, true), opt(`Falsch. ${b} ist die Differenz.`, false, 'begriffe-verwechselt')],
        h3('Der Minuend steht vorne. Von ihm wird abgezogen.', 'Bei 9 − 4 = 5 ist 9 der Minuend.', `Vorne steht ${a}. Also ist ${a} der Minuend.`)); },
  ]);
  sechs(S('S1'), 'M', [
    () => { const a = zz(41, 95) * 10, b = zz(12, 38) * 10;
      return zahl(`Berechne die Differenz von ${a} und ${b}.`, a - b, fehlerliste(a - b, [[a + b, 'sub-addiert']]), h2('Die Differenz ist das Ergebnis einer Subtraktion.', `Rechne ${a} − ${b}.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const b = zz(11, 29) * 5, d = zz(21, 59) * 5;
      return zahl(`Der Subtrahend ist ${b}, die Differenz ist ${d}. Bestimme den Minuenden.`, b + d, fehlerliste(b + d, [[Math.abs(d - b), 'probe-falsche-umkehr']]),
        h2('Minuend − Subtrahend = Differenz. Also ist der Minuend die Summe aus Subtrahend und Differenz.', `Rechne ${d} + ${b}.`), { nachweis: N(`${d} + ${b}`, `${b + d} − ${b}`) }); },
    () => { const a = zz(8, 15) * 10, b = zz(2, 4) * 10, c = wahl([15, 25, 35]);
      return auswahl(`Welcher Rechenausdruck passt? „Subtrahiere die Summe von ${b} und ${c} von ${a}.“`, [opt(`${a} − (${b} + ${c})`, true), opt(`(${b} + ${c}) − ${a}`, false, 'begriffe-verwechselt'), opt(`${a} − ${b} + ${c}`, false, 'klammer-ignoriert'), opt(`(${a} − ${b}) + ${c}`, false, 'klammer-falsch-gesetzt')],
        h2('„Von“ nennt den Minuenden. Die Summe wird als Ganzes abgezogen.', `Der Minuend ist ${a}. Abgezogen wird die Summe ${b} + ${c}.`), { nachweis: N(`${a} − (${b} + ${c})`) }); },
    () => { const a = zz(6, 9) * 100, d = zz(21, 55) * 10;
      return zahl(`Der Minuend ist ${a}, die Differenz ist ${d}. Bestimme den Subtrahenden.`, a - d, fehlerliste(a - d, [[a + d, 'sub-addiert']]),
        h2('Der Subtrahend ist das, was vom Minuenden bis zur Differenz fehlt.', `Rechne ${a} − ${d}.`), { nachweis: N(`${a} − ${d}`, `${a} − ${a - d}`) }); },
    () => { const d = zz(12, 48) * 2;
      return zahl(`Die Differenz zweier Zahlen ist ${d}. Der Minuend ist doppelt so groß wie der Subtrahend. Bestimme den Minuenden.`, 2 * d, fehlerliste(2 * d, [[d, 'sach-schritt-vergessen'], [d / 2, 'begriffe-verwechselt']]),
        h2('Probiere mit einem Beispiel: Ist der Minuend doppelt so groß wie der Subtrahend, dann ist die Differenz genauso groß wie der Subtrahend.', `Der Subtrahend ist ${d}. Der Minuend ist doppelt so groß.`), { nachweis: N(`2 · ${d}`, `${2 * d} − ${d}`) }); },
    () => { const a = zz(5, 9) * 10, b = zz(1, 2) * 10, k = kind();
      return auswahl(`${k} behauptet: „Wenn der Subtrahend größer wird und der Minuend gleich bleibt, wird auch die Differenz größer.“ Beurteile die Aussage.`, [
        opt(`Falsch. Beispiel: ${a} − ${b} = ${a - b}, aber ${a} − ${b + 10} = ${a - b - 10}. Wer mehr abzieht, behält weniger.`, true),
        opt(`Richtig. Beispiel: ${a} − ${b} = ${a - b} und ${a + 10} − ${b} = ${a - b + 10}.`, false, 'begriffe-verwechselt'),
        opt('Richtig. Größere Zahlen ergeben immer größere Ergebnisse. Das gilt für jede Rechenart.'),
        opt('Das lässt sich nicht entscheiden. Es kommt auf die Zahlen an.')],
      h2('Prüfe die Aussage an einem Beispiel und verändere nur den Subtrahenden.', `Vergleiche ${a} − ${b} mit ${a} − ${b + 10}.`), { nachweis: [U(false), ...N(`${a} − ${b}`, `${a} − ${b + 10}`)] }); },
  ]);
  sechs(S('S1'), 'E', [
    () => { const a = zz(21, 39) * 10, b = zz(11, 19) * 10, c = zz(4, 19) * 5;
      return zahl(`Subtrahiere ${c} von der Summe der Zahlen ${a} und ${b}.`, a + b - c, fehlerliste(a + b - c, [[a + b + c, 'sub-addiert'], [a - b - c, 'begriffe-verwechselt']]), h1('Bilde zuerst die Summe. Sie ist der Minuend.'), { nachweis: N(`${a} + ${b} − ${c}`) }); },
    () => { const d = zz(13, 89);
      return zahl(`Der Minuend ist um ${d} größer als der Subtrahend. Bestimme die Differenz.`, d, [], h1('Die Differenz gibt an, wie weit Minuend und Subtrahend auseinanderliegen.'), { nachweis: [{ zahl: 100, grund: 'Beispiel für den Subtrahenden' }, ...N(`100 + ${d}`, `${100 + d} − 100`)] }); },
    () => { const d = zz(21, 39) * 5, x = zz(2, 8) * 5;
      return zahl(`Die Differenz zweier Zahlen ist ${d}. Der Minuend wird um ${x} kleiner, der Subtrahend bleibt gleich. Bestimme die neue Differenz.`, d - x, fehlerliste(d - x, [[d + x, 'sub-addiert'], [d, 'sach-schritt-vergessen']]),
        h1('Wird nur der Minuend kleiner, wird die Differenz um genauso viel kleiner.'), { nachweis: N(`${d} − ${x}`) }); },
    () => { const m = zz(6, 24) * 10;
      return luecken(`Bei 9 − 4 = 5 gilt 9 + 4 + 5 = 18, bei 20 − 8 = 12 gilt 20 + 8 + 12 = 40. Stelle die Regel auf: Minuend + Subtrahend + Differenz = {{a}} · Minuend. Bei einer Subtraktion ergeben Minuend, Subtrahend und Differenz zusammen ${2 * m}. Der Minuend ist {{b}}.`, { a: 2, b: [m, fehlerliste(m, [[2 * m, 'sach-schritt-vergessen']])] },
        h1('Subtrahend und Differenz ergeben zusammen immer den Minuenden.'), { nachweis: N('9 + 4 + 5 = 18', '18 : 9', '2 · 9 = 18', '20 + 8 + 12 = 40', '2 · 20 = 40', `${2 * m} : 2`, `2 · ${m}`) }); },
    () => { const [x, y] = suche(() => [zz(31, 69), zz(11, 29)], ([p, q]) => p - q > 5 && (p + q) % 10 === 0);
      return sach(`Zwei Zahlen haben die Summe ${x + y} und die Differenz ${x - y}.`, [teil('Bestimme die größere Zahl.', x), teil('Bestimme die kleinere Zahl.', y)],
        h1('Ziehe die Differenz von der Summe ab. Dann bleibt zweimal die kleinere Zahl.'), { nachweis: N(`(${x + y} − ${x - y}) : 2`, `${y} + ${x - y}`, `${x} + ${y}`, `${x} − ${y}`) }); },
    () => auswahl('Minuend und Subtrahend sind natürliche Zahlen. Kann die Differenz größer sein als der Minuend? Wähle die richtige Begründung.', [
      opt('Nein. Vom Minuenden wird etwas weggenommen oder nichts. Die Differenz ist deshalb höchstens so groß wie der Minuend.', true),
      opt('Ja. Bei einem sehr kleinen Subtrahenden wird die Differenz größer als der Minuend, zum Beispiel bei 0.', false, 'begriffe-verwechselt'),
      opt('Ja. Bei 5 − 9 ist die Differenz größer als der Minuend.', false, 'sub-kleiner-von-groesser'),
      opt('Nein. Die Differenz ist immer kleiner als der Subtrahend.', false, 'begriffe-verwechselt'),
      opt('Das hängt davon ab, ob die Zahlen gerade oder ungerade sind.')],
    h1('Überlege, was mit dem Minuenden passiert, wenn der Subtrahend 0 ist und wenn er größer als 0 ist.'), { nachweis: [U(false), ...N('7 − 0', '7 − 3')] }),
  ]);

  // =====================================================================
  // S2 Schriftlich subtrahieren
  // =====================================================================
  sechs(S('S2'), 'F', [
    () => { const z = zz(2, 8), e = zz(1, 9);
      return zahl(Z('Schau in die Tafel.', 'Welche Zahl siehst du?'), 10 * z + e, fehlerliste(10 * z + e, [[10 * e + z, 'stellenwert'], [z + e, 'stellenwert']]),
        h3('Z heißt Zehner. E heißt Einer.', '2 Plättchen bei Z und 5 bei E: Das ist die Zahl 25.', `Bei Z liegen ${z} Plättchen. Das sind ${z} Zehner, also ${10 * z}.`),
        { bild: B.tafel(['Z', 'E'], [z, e]), nachweis: N(`${z} · 10 + ${e}`) }); },
    () => { const z = zz(3, 8), e = zz(4, 9), wz = zz(1, z - 1), we = zz(1, e - 1);
      return zahl(Z(`Du hast ${10 * z + e}.`, `Nimm ${wz} ${wz === 1 ? 'Stange' : 'Stangen'} und ${we} Würfel weg.`, 'Wie viel bleibt?'), 10 * (z - wz) + e - we, fehlerliste(10 * (z - wz) + e - we, [[10 * z + e - wz - we, 'stellenwert']]),
        h3('Eine Stange ist 1 Zehner. Ein Würfel ist 1 Einer.', '35: Nimm 1 Stange und 2 Würfel weg. Es bleiben 2 Stangen und 3 Würfel, also 23.', `Es bleiben ${z - wz} Stangen und ${e - we} Würfel.`),
        { bild: B.material({ z, e }, { z: wz, e: we }), nachweis: N(`${10 * z + e} − ${10 * wz + we}`) }); },
    () => { const [a, b] = paar(40, 99, 0, (x, y) => y >= 11);
      return raster(Z(`Rechne im Raster: ${a} − ${b}`, 'Beginne bei den Einern.'), '−', a, b,
        h3('Rechne jede Stelle für sich: erst die Einer, dann die Zehner.', '57 − 23: Einer 7 − 3 = 4. Zehner 5 − 2 = 3. Ergebnis 34.', `Einer: ${a % 10} − ${b % 10} = ${(a - b) % 10}.`)); },
    () => { const [a, b] = paar(300, 999, 0, (x, y) => y >= 111);
      return raster(Z(`Rechne im Raster: ${a} − ${b}`, 'Jede Stelle hat ein Feld.'), '−', a, b,
        h3('Rechne von rechts nach links: Einer, Zehner, Hunderter.', '578 − 243: Einer 8 − 3 = 5. Zehner 7 − 4 = 3. Hunderter 5 − 2 = 3. Ergebnis 335.', `Einer: ${a % 10} − ${b % 10} = ${(a - b) % 10}.`)); },
    () => { const z = zz(3, 6), e = zz(1, 4), w = zz(e + 2, 9);
      return sach(Z(`Du hast ${z} Stangen und ${e} Würfel.`, `Du willst ${w} Würfel wegnehmen.`, 'Du tauschst 1 Stange in 10 Würfel.'), [teil('Wie viele Würfel hast du jetzt?', e + 10, null, fehlerliste(e + 10, [[10, 'stellenwert'], [e, 'sub-kleiner-von-groesser']])), teil('Wie viel bleibt nach dem Wegnehmen?', 10 * z + e - w, null, fehlerliste(10 * z + e - w, [[10 * z + w - e, 'sub-kleiner-von-groesser']]))],
        h3('1 Stange ist genauso viel wie 10 Würfel.', '2 Stangen, 1 Würfel: Nach dem Tausch sind es 1 Stange und 11 Würfel.', `Du hast ${e} Würfel und bekommst 10 dazu.`),
        { bild: B.material({ z, e }), nachweis: N(`${e} + 10`, `${10 * z + e} − ${w}`) }); },
    () => { const [a, b] = paar(31, 95, 1, (x, y) => y >= 11);
      return raster(Z(`Rechne im Raster: ${a} − ${b}`, 'Der Tausch ist schon eingetragen.'), '−', a, b,
        h3('In der Zeile „getauscht“ steht dieselbe Zahl: 1 Zehner weniger, 10 Einer mehr.', '52 − 17: getauscht 4 Zehner und 12 Einer. Einer 12 − 7 = 5. Zehner 4 − 1 = 3. Ergebnis 35.', `Einer: ${a % 10 + 10} − ${b % 10} = ${a % 10 + 10 - b % 10}.`), { hilfe: true }); },
  ]);
  sechs(S('S2'), 'G', [
    () => { const [a, b] = paar(300, 999, 0, (x, y) => y >= 111);
      return zahl(Z('Subtrahiere schriftlich.', `${a} − ${b}`), a - b, subFehler(a, b), h3('Schreibe die Zahlen genau untereinander. Beginne bei den Einern.', '578 − 243: Einer 8 − 3 = 5. Zehner 7 − 4 = 3. Hunderter 5 − 2 = 3. Ergebnis 335.', `Einer: ${a % 10} − ${b % 10} = ${(a - b) % 10}.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(300, 999, 1, (x, y) => y >= 111 && x % 10 < y % 10);
      return zahl(Z('Subtrahiere schriftlich.', `${a} − ${b}`), a - b, subFehler(a, b), h3('Die obere Ziffer ist zu klein? Dann tausche 1 Zehner in 10 Einer.', '472 − 138: Einer 12 − 8 = 4. Zehner 6 − 3 = 3. Hunderter 4 − 1 = 3. Ergebnis 334.', `Einer: ${a % 10} − ${b % 10} geht nicht. Rechne ${a % 10 + 10} − ${b % 10} = ${a % 10 + 10 - b % 10}.`),
        { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map(Number)), nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(300, 999, 0, (x, y) => y >= 111); const s = String(a), zf = Number(s[1]);
      return luecken(Z('Welche Ziffer fehlt?', `${s[0]}{{a}}${s[2]} − ${b} = ${a - b}`), { a: zf },
        h3('Schau nur auf die Zehner.', '5▢7 − 234 = 323: Bei den Zehnern gilt ▢ − 3 = 2. Es fehlt die 5.', `Zehner: ▢ − ${Math.floor(b / 10) % 10} = ${Math.floor((a - b) / 10) % 10}.`),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${s[0]}▢${s[2]} − ${b} = ${a - b}`, ziffern: [zf] }] }); },
    () => { const [a, b] = paar(2000, 9999, 1, (x, y) => y >= 1111);
      return zahl(Z('Subtrahiere schriftlich.', `${a} − ${b}`), a - b, subFehler(a, b), h3('Rechne Stelle für Stelle von rechts nach links. Achte auf den Übertrag.', '2845 − 1392: Einer 3. Zehner 14 − 9 = 5, Übertrag 1. Hunderter 8 − 3 − 1 = 4. Tausender 1. Ergebnis 1453.', `Einer: ${a % 10 >= b % 10 ? `${a % 10} − ${b % 10} = ${a % 10 - b % 10}` : `${a % 10 + 10} − ${b % 10} = ${a % 10 + 10 - b % 10}, Übertrag 1`}.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(400, 999, 1, (x, y) => y >= 111 && x % 10 < y % 10 && Math.floor(x / 10) % 10 <= 7 && Math.floor(x / 10) % 10 > Math.floor(y / 10) % 10);
      // Zwei Vergleichsaufgaben ohne Übertrag: Einer vertauscht, einmal zusätzlich 2 Zehner mehr.
      const e1 = a % 10, e2 = b % 10, o1 = [a - e1 + e2, b - e2 + e1], o2 = [a - e1 + e2 + 20, b - e2 + e1];
      if (subUebertraege(...o1) !== 0 || subUebertraege(...o2) !== 0) throw new Error('S2-G-05: Vergleichsaufgaben haben einen Übertrag');
      return sach(Z('Überlege zuerst.', 'Nur bei einer Aufgabe brauchst du einen Übertrag.', `${o1[0]} − ${o1[1]}`, `${a} − ${b}`, `${o2[0]} − ${o2[1]}`), [teil('Welche Zahl steht bei dieser Aufgabe vorne?', a, null, fehlerliste(a, [[o1[0], 'sub-kleiner-von-groesser'], [o2[0], 'sub-kleiner-von-groesser']])), teil('Rechne diese Aufgabe aus.', a - b, null, subFehler(a, b))],
        h3('Vergleiche in jeder Stelle die obere Ziffer mit der unteren.', '563 − 248: Bei den Einern ist 3 kleiner als 8. Hier brauchst du einen Übertrag.', 'Schau auf die Einer. Nur bei einer Aufgabe ist die obere Ziffer kleiner.'),
        { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map(Number)), nachweis: [{ art: 'uebertrag', zeichen: '−', aufgaben: [[a, b], o1, o2], mit: [true, false, false] }, ...N(`${a} − ${b}`, `${o1[0]} − ${o1[1]}`, `${o2[0]} − ${o2[1]}`)] }); },
    () => { const [a, b] = paar(300, 999, 1, (x, y) => y >= 111 && x % 10 < y % 10); const falsch = kleinerVonGroesser(a, b), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} − ${b} = ${falsch}`, `Bei den Einern rechnet ${k} ${b % 10} − ${a % 10} = ${b % 10 - a % 10}.`, 'Stimmt das?'), [opt('Stimmt. Man zieht immer die kleinere Zahl ab.', false, 'sub-kleiner-von-groesser'), opt(`Falsch. Die Einer sind vertauscht. Richtig ist ${a - b}.`, true), opt('Falsch. Hier muss man plus rechnen.', false, 'sub-addiert')],
        h3('Es wird immer die untere Ziffer von der oberen abgezogen.', '452 − 127: Einer 2 − 7 geht nicht. Tausche: 12 − 7 = 5. Ergebnis 325.', `Oben steht ${a % 10}, unten ${b % 10}. Rechne ${a % 10 + 10} − ${b % 10}.`), { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map(Number)), nachweis: [U(false, `${a} − ${b}`, falsch), ...N(`${a} − ${b}`)] }); },
  ]);
  sechs(S('S2'), 'M', [
    () => { const [a, b] = suche(() => [zz(21, 98) * 100, zz(1111, 7999)], ([x, y]) => x % 1000 !== 0 && x - y > 500 && y % 10 !== 0 && Math.floor(y / 10) % 10 !== 0);
      return zahl(`Subtrahiere schriftlich: ${a} − ${b}`, a - b, subFehler(a, b), h2('Steht oben eine Null, holst du den Übertrag aus der nächsten Stelle, die keine Null ist.', `Einer: 10 − ${b % 10} = ${10 - b % 10}, Übertrag 1.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(5000, 9999), zz(1100, 4899)], ([x, y]) => subUebertraege(x, y) >= 2 && Math.floor(x / 10) % 10 === 0 && x - y > 1000);
      const sa = String(a), sb = String(b);
      return luecken(`Bestimme die fehlenden Ziffern: ${sa[0]}{{a}}${sa.slice(2)} − ${sb.slice(0, 2)}{{b}}${sb[3]} = ${a - b}`, { a: Number(sa[1]), b: Number(sb[2]) },
        h2('Beginne bei den Einern und arbeite dich nach links. Beachte dabei die Überträge.', `Einer: ${a % 10 < b % 10 ? a % 10 + 10 : a % 10} − ${b % 10} = ${(a - b) % 10}. Bestimme jetzt die fehlende Zehnerziffer des Subtrahenden.`),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${sa[0]}▢${sa.slice(2)} − ${sb.slice(0, 2)}▢${sb[3]} = ${a - b}`, ziffern: [Number(sa[1]), Number(sb[2])] }] }); },
    () => { const [a, b, c] = suche(() => [zz(4, 9) * 1000 + zz(1, 9), zz(1111, 2999), zz(12, 49) * 10], ([x, y, v]) => x - y - v > 1000);
      return zahl(`Berechne: ${a} − ${b} − ${c}`, a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]), h2('Subtrahiere nacheinander. Oder addiere zuerst die beiden Subtrahenden.', `${b} + ${c} = ${b + c}. Ziehe diese Summe von ${a} ab.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const [a, b] = suche(() => [zz(3, 9) * 1000 + zz(1, 9) * 10, zz(1111, 6999)], ([x, y]) => x - y > 500 && subUebertraege(x, y) === 3 && y % 10 !== 0);
      return zahl(`Subtrahiere schriftlich: ${a} − ${b}`, a - b, subFehler(a, b), h2('Achte auf die Nullen im Minuenden: Der Übertrag wandert über die Null hinweg.', `Einer: 10 − ${b % 10} = ${10 - b % 10}, Übertrag 1.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const d = zz(6, 9), t = zz(3, 5);
      const zeile = (k) => `${(t + k) * 1000 + 5} − ${(t + k) * 1000 + 5 - d}`;
      return luecken(`Berechne der Reihe nach: ${zeile(0)} = {{a}}, ${zeile(1)} = {{b}}, ${zeile(2)} = {{c}}. Setze das Muster fort: {{d}} − ${(t + 4) * 1000 + 5 - d} hat dasselbe Ergebnis.`, { a: d, b: d, c: d, d: (t + 4) * 1000 + 5 },
        h2('Vergleiche Minuend und Subtrahend von Aufgabe zu Aufgabe: Beide wachsen um denselben Betrag.', `${zeile(0)} = ${d}. Ergänzen ist hier leichter als schriftliches Rechnen.`),
        { nachweis: N(zeile(0), zeile(1), zeile(2), `${(t + 4) * 1000 + 5 - d} + ${d}`, `${(t + 4) * 1000 + 5} − ${(t + 4) * 1000 + 5 - d}`) }); },
    () => { const [a, b] = suche(() => [zz(4, 8) * 1000 + zz(1, 9), zz(1111, 2999)], ([x, y]) => subUebertraege(x, y) === 3 && runde(y, 100) !== y); const falsch = kleinerVonGroesser(a, b), k = kind(), ue = runde(a, 1000) - runde(b, 100);
      if (Math.abs(falsch - (a - b)) < 500) throw new Error('S2-M-06: falsches Ergebnis liegt zu nah am richtigen');
      return auswahl(`${k} erhält bei ${a} − ${b} das Ergebnis ${falsch}. Prüfe mit einem Überschlag und entscheide.`, [
        opt(`Falsch: ${runde(a, 1000)} − ${runde(b, 100)} = ${ue}. Das Ergebnis muss nahe bei ${ue} liegen.`, true),
        opt(`Richtig: ${runde(a, 1000)} − ${runde(b, 100)} ist ungefähr ${runde(falsch, 100)}.`, false, 'ueberschlag-nicht-gerundet'),
        opt('Richtig: In jeder Stelle wurde die kleinere von der größeren Ziffer abgezogen.', false, 'sub-kleiner-von-groesser'),
        opt(`Falsch: Das Ergebnis muss größer sein als ${a}.`, false, 'sub-addiert')],
      h2('Runde beide Zahlen und rechne im Kopf. Vergleiche mit dem angegebenen Ergebnis.', `${a} ist ungefähr ${runde(a, 1000)}, ${b} ist ungefähr ${runde(b, 100)}.`), { nachweis: [U(false, `${a} − ${b}`, falsch), ...N(`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 100)}`, `${runde(a, 1000)} − ${runde(b, 100)}`, `${a} − ${b}`)] }); },
  ]);
  sechs(S('S2'), 'E', [
    () => { const [a, b] = suche(() => [zz(5, 9) * 1000 + zz(1, 9), zz(1111, 4999)], ([x, y]) => subUebertraege(x, y) === 3);
      return zahl(`Subtrahiere schriftlich: ${a} − ${b}`, a - b, subFehler(a, b), h1('Der Übertrag wandert über beide Nullen hinweg.'), { nachweis: N(`${a} − ${b}`) }); },
    () => { const zs = wahl([[2, 4, 6, 8], [1, 3, 5, 7], [2, 3, 7, 9], [1, 4, 6, 9], [3, 5, 6, 8]]);
      let min = 99, bei = null;
      for (const p of [[0, 1, 2, 3], [0, 2, 1, 3], [0, 3, 1, 2], [1, 0, 2, 3], [1, 2, 0, 3], [1, 3, 0, 2], [2, 0, 1, 3], [2, 1, 0, 3], [2, 3, 0, 1], [3, 0, 1, 2], [3, 1, 0, 2], [3, 2, 0, 1], [0, 1, 3, 2], [0, 2, 3, 1], [0, 3, 2, 1], [1, 0, 3, 2], [1, 2, 3, 0], [1, 3, 2, 0], [2, 0, 3, 1], [2, 1, 3, 0], [2, 3, 1, 0], [3, 0, 2, 1], [3, 1, 2, 0], [3, 2, 1, 0]]) {
        const x = 10 * zs[p[0]] + zs[p[1]], y = 10 * zs[p[2]] + zs[p[3]];
        if (x > y && x - y < min) { min = x - y; bei = [x, y]; }
      }
      return zahl(`Bilde aus den Ziffern ${zs.slice(0, 3).join(', ')} und ${zs[3]} zwei zweistellige Zahlen. Jede Ziffer kommt genau einmal vor. Wie groß ist die kleinste mögliche Differenz?`, min, [],
        h1('Die Zehnerziffern sollten möglichst nah beieinanderliegen. Die Einer gleichen dann aus.'), { nachweis: [{ art: 'kleinsteDifferenz', ziffern: zs, differenz: min }, `${bei[0]} − ${bei[1]} = ${min}`] }); },
    () => { const x = zz(801, 1299), a = wahl([4000, 5000, 6000]);
      return zahl(`Von ${a} wird dreimal dieselbe Zahl subtrahiert. Es bleibt ${a - 3 * x}. Bestimme die Zahl.`, x, fehlerliste(x, [[3 * x, 'sach-schritt-vergessen']]), h1('Berechne zuerst, wie viel insgesamt subtrahiert wurde.'), { nachweis: N(`${a} − 3 · ${x}`, `(${a} − ${a - 3 * x}) : 3`) }); },
    () => { const anna = (p, q) => 1001 * p + 110 * q, f = (p, q) => anna(p, q) - anna(q, p);
      return luecken(`ANNA-Zahlen: 4334 − 3443 = ${f(4, 3)}, 5115 − 1551 = ${f(5, 1)}, 7227 − 2772 = ${f(7, 2)}. Alle Ergebnisse sind Vielfache von 891. Der Faktor hängt nur von den beiden Ziffern ab. Stelle die Regel auf und sage mit ihr 9229 − 2992 vorher: {{a}} · 891 = {{b}}`, { a: 7, b: f(9, 2) },
        h1('Teile jedes Ergebnis durch 891 und vergleiche den Faktor mit den beiden Ziffern der ANNA-Zahl.'),
        { nachweis: N('4334 − 3443', '5115 − 1551', '7227 − 2772', '1 · 891', '4 · 891', '5 · 891', '9229 − 2992', '7 · 891', '4 − 3 = 1', '5 − 1 = 4', '7 − 2 = 5', '9 − 2 = 7') }); },
    () => { const d = zz(1201, 3899), x = wahl([100, 200, 250]);
      return zahl(`Die Differenz zweier Zahlen ist ${d}. Der Minuend wird um ${x} größer, der Subtrahend um ${x} kleiner. Bestimme die neue Differenz.`, d + 2 * x, fehlerliste(d + 2 * x, [[d, 'sach-schritt-vergessen'], [d + x, 'sach-schritt-vergessen']]),
        h1('Beide Änderungen vergrößern den Abstand der beiden Zahlen.'), { nachweis: N(`${d} + ${x} + ${x}`) }); },
    () => auswahl('„Vergrößere ich Minuend und Subtrahend um dieselbe Zahl, bleibt die Differenz gleich.“ Gilt das immer? Wähle die richtige Begründung.', [
      opt('Ja, immer: Beide Zahlen verschieben sich auf dem Zahlenstrahl gleich weit. Ihr Abstand bleibt gleich.', true),
      opt('Nein: Die Differenz wird um diese Zahl größer.', false, 'begriffe-verwechselt'),
      opt('Nein: Die Differenz wird doppelt so groß.'),
      opt('Nur bei geraden Zahlen: 8 − 2 = 6 und 10 − 4 = 6.'),
      opt('Ja, aber nur, wenn dabei kein Übertrag entsteht. Mit Übertrag ändert sich der Abstand.', false, 'sub-uebertrag-vergessen')],
    h1('Die Differenz ist der Abstand zweier Zahlen auf dem Zahlenstrahl. Prüfe an 8 − 2 und 10 − 4.'), { nachweis: [U(true), ...N('8 − 2', '10 − 4')] }),
  ]);

  // =====================================================================
  // S3 Mehrere Zahlen subtrahieren
  // =====================================================================
  sechs(S('S3'), 'F', [
    () => { const a = zz(16, 20), b = zz(3, 5), c = zz(2, 4);
      return strahl('ablesen', Z('Der Pfeil springt 2-mal zurück.', 'Bei welcher Zahl landet er?'), { von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, b, c), pfeil: a - b - c }, a - b - c, fehlerliste(a - b - c, [[a - b, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]),
        h3('Folge beiden Sprüngen nach links.', 'Start 15, erst − 4, dann − 3: Du landest bei 8.', `Nach dem ersten Sprung bist du bei ${a - b}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const a = zz(14, 19), b = zz(4, 5), c = zz(2, 3);
      return luecken(Z(`Rechne in 2 Schritten: ${a} − ${b} − ${c}`, `Erst ${b} weg: {{a}}`, `Dann noch ${c} weg: {{b}}`), { a: a - b, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler']])] },
        h3('Nimm erst die eine Zahl weg. Nimm dann die andere Zahl weg.', '12 − 3 − 2: Erst 12 − 3 = 9. Dann 9 − 2 = 7.', `${a} − ${b} = ${a - b}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, b, c) }), nachweis: N(`${a} − ${b}`, `${a - b} − ${c}`) }); },
    () => { const a = zz(3, 5) * 10, b = 10, c = 5;
      return zahl(Z('Rechne.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
        h3('Beide Zahlen gehen weg. Rechne nacheinander.', '40 − 10 − 5: Erst 40 − 10 = 30. Dann 30 − 5 = 25.', `${a} − ${b} = ${a - b}.`),
        { bild: B.strahl({ von: a - 20, bis: a, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, b, c) }), nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const a = zz(24, 29), b = a % 10, c = zz(2, 5);
      return strahl('markieren', Z(`Starte bei ${a}.`, `Springe erst ${b} zurück.`, `Springe dann ${c} zurück.`, 'Tippe an: Wo landest du?'), { von: 10, bis: 30, schritt: 1, beschriftung: 5, start: a }, a - b - c, fehlerliste(a - b - c, [[a - b, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]),
        h3('Zurück heißt: nach links.', 'Start 26, erst 6 zurück: 20. Dann 4 zurück: 16.', `Nach dem ersten Sprung bist du bei ${a - b}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const k = kind(), a = 20, b = zz(3, 6), c = zz(2, 4);
      return auswahl(Z(`${k} hat ${a} Euro.`, `${k} kauft ein Heft für ${b} Euro.`, `${k} kauft einen Stift für ${c} Euro.`, 'Welche Rechnung passt?'), [opt(`${a} − ${b} − ${c}`, true), opt(`${a} − ${b} + ${c}`, false, 'sub-klammerfehler'), opt(`${a} + ${b} + ${c}`, false, 'sub-addiert')],
        h3('Kaufen heißt: Das Geld geht weg. Das ist minus.', '10 Euro. Ein Ball für 4 Euro, ein Eis für 2 Euro: 10 − 4 − 2.', `Beide Preise gehen weg: erst ${b} Euro, dann ${c} Euro.`),
        { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const a = zz(15, 19), b = a % 10, c = zz(2, 5);
      return zahl(Z('Rechne.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
        h3('Rechne erst bis zur 10. Dann geht es leicht weiter.', '17 − 7 − 2: Erst 17 − 7 = 10. Dann 10 − 2 = 8.', `${a} − ${b} = 10.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, b, c) }), nachweis: N(`${a} − ${b} − ${c}`) }); },
  ]);
  sechs(S('S3'), 'G', [
    () => { const a = zz(7, 9) * 10 + zz(1, 9), b = zz(1, 3) * 10, c = zz(1, 3) * 10;
      return zahl(Z('Berechne.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
        h3('Ziehe die Zahlen nacheinander ab.', '75 − 20 − 10: Erst 75 − 20 = 55. Dann 55 − 10 = 45.', `${a} − ${b} = ${a - b}.`),
        { bild: B.strahl({ von: Math.floor((a - b - c) / 10) * 10, bis: 100, schritt: 5, beschriftung: 10 }), nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(700, 999), zz(111, 399), zz(111, 299)], ([x, y, v]) => subUebertraege(x, y) === 0 && subUebertraege(x - y, v) === 0 && x - y - v > 100);
      return zahl(Z('Subtrahiere schriftlich.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
        h3('Ziehe erst die erste Zahl ab. Ziehe dann die zweite Zahl vom Ergebnis ab.', '786 − 243 − 121: Erst 786 − 243 = 543. Dann 543 − 121 = 422.', `${a} − ${b} = ${a - b}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const [b, c] = suche(() => [zz(11, 39), zz(11, 39)], ([x, y]) => (x + y) % 10 === 0 && x % 10 !== 0 && x !== y), a = suche(() => zz(7, 10) * 10, (x) => x - b - c >= 20);
      return luecken(Z(`${a} − ${b} − ${c}`, 'Zähle erst zusammen, was weggeht.', `${b} + ${c} = {{a}}`, `Ziehe dieses Ergebnis von ${a} ab: {{b}}`), { a: b + c, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler']])] },
        h3('Beide Zahlen gehen weg. Du darfst sie erst zusammenzählen.', '80 − 24 − 16: 24 + 16 = 40. Dann 80 − 40 = 40.', `${b} + ${c} = ${b + c}.`),
        { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(800, 999), zz(111, 399), zz(111, 399)], ([x, y, v]) => subUebertraege(x, y) + subUebertraege(x - y, v) === 1 && x - y - v > 100);
      return zahl(Z('Subtrahiere schriftlich.', `${a} − ${b} − ${c}`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
        h3('Rechne zweimal nacheinander schriftlich. Achte auf den Übertrag.', '948 − 315 − 402: Erst 948 − 315 = 633. Dann 633 − 402 = 231.', `${a} − ${b} = ${a - b}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const [b, c] = suche(() => [zz(11, 19), zz(2, 9)], ([x, y]) => (x + y) % 10 === 0), a = zz(6, 9) * 10;
      return auswahl(Z('Welche Rechnung hat dasselbe Ergebnis?', `${a} − ${b} − ${c}`), [opt(`${a} − ${b + c}`, true), opt(`${a} − ${b - c}`, false, 'sub-klammerfehler'), opt(`${a} + ${b + c}`, false, 'sub-addiert')],
        h3('Zähle zusammen, was insgesamt weggeht.', '50 − 13 − 7: Es gehen 13 + 7 = 20 weg. Also 50 − 20.', `${b} + ${c} = ${b + c}.`),
        { bild: B.streifen(a, [b, c, frage(a - b - c)]), nachweis: N(`${a} − ${b} − ${c}`, `${a} − ${b + c}`, `${b} + ${c}`) }); },
    () => { const a = zz(6, 9) * 10, b = zz(2, 3) * 10, c = 10, k = kind();
      return auswahl(Z(`${k} rechnet ${a} − ${b} − ${c} so:`, `${b} − ${c} = ${b - c}`, `${a} − ${b - c} = ${a - b + c}`, 'Stimmt das?'), [opt(`Stimmt. Man darf auch zuerst ${b} − ${c} rechnen.`, false, 'sub-klammerfehler'), opt(`Falsch. Beide Zahlen gehen weg. Richtig ist ${a - b - c}.`, true), opt(`Falsch. Richtig ist ${a + b + c}.`, false, 'sub-addiert')],
        h3('Jede Zahl hinter einem Minus wird abgezogen.', '50 − 20 − 10: Es gehen 20 und 10 weg, zusammen 30. Ergebnis 20.', `${a} − ${b} = ${a - b}. Davon gehen noch ${c} weg.`), { nachweis: [U(false, `${a} − ${b} − ${c}`, a - b + c), ...N(`${a} − ${b} − ${c}`)] }); },
  ]);
  sechs(S('S3'), 'M', [
    () => { const [a, b, c] = suche(() => [zz(4, 9) * 1000 + zz(1, 9), zz(1111, 2999), zz(101, 899)], ([x, y, v]) => x - y - v > 500 && v % 10 !== 0);
      return zahl(`Subtrahiere schriftlich: ${a} − ${b} − ${c}`, a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]), h2('Addiere zuerst die beiden Subtrahenden und ziehe ihre Summe ab.', `${b} + ${c} = ${b + c}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const [b, c] = suche(() => [zz(101, 189) * 10, zz(21, 89) * 10], ([x, y]) => (x + y) % 1000 === 0), a = zz(4, 9) * 1000;
      return luecken(`Berechne geschickt: ${a} − ${b} − ${c}. Die Summe der Subtrahenden ist {{a}}. Das Ergebnis ist {{b}}.`, { a: b + c, b: [a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler']])] },
        h2('Die beiden Subtrahenden ergänzen sich zu einer glatten Zahl.', `${b} + ${c} = ${b + c}.`), { nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(71, 98) * 10, zz(111, 399), zz(11, 29) * 10], ([x, y, v]) => x - y - v > 100 && Math.floor(x / 10) % 10 !== 0); const sa = String(a);
      return luecken(`Bestimme die fehlende Ziffer: ${sa[0]}{{a}}${sa[2]} − ${b} − ${c} = ${a - b - c}`, { a: Number(sa[1]) },
        h2('Rechne rückwärts: Addiere zum Ergebnis beide Subtrahenden.', `${a - b - c} + ${c} = ${a - b}. Addiere jetzt noch ${b}.`), { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${sa[0]}▢${sa[2]} − ${b} − ${c} = ${a - b - c}`, ziffern: [Number(sa[1])] }] }); },
    () => { const [a, b, c] = suche(() => [zz(5, 9) * 1000 + zz(1, 9) * 10, zz(1111, 2999), zz(1011, 1999)], ([x, y, v]) => x - y - v > 500 && subUebertraege(x, y) >= 2 && y % 10 !== 0);
      return zahl(`Subtrahiere schriftlich: ${a} − ${b} − ${c}`, a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]), h2('Subtrahiere nacheinander und achte auf die Nullen im Minuenden.', `${a} − ${b} = ${a - b}.`), { nachweis: N(`${a} − ${b} − ${c}`) }); },
    () => { const z = (k) => `1000 − ${k}00 − ${k * 100 - 1}`;
      return luecken(`Berechne der Reihe nach: ${z(1)} = {{a}}, ${z(2)} = {{b}}, ${z(3)} = {{c}}. Setze das Muster fort: ${z(4)} = {{d}}`, { a: 801, b: 601, c: 401, d: 201 },
        h2('Vergleiche die Ergebnisse: Von Aufgabe zu Aufgabe ändern sie sich um denselben Betrag.', '1000 − 100 − 99 = 801. Von Aufgabe zu Aufgabe wird 200 mehr abgezogen.'), { nachweis: N(z(1), z(2), z(3), z(4)) }); },
    () => { const a = zz(7, 9) * 100, b = zz(3, 4) * 100 + 50, c = 150, k = kind();
      return auswahl(`${k} rechnet ${a} − ${b} − ${c} so: ${b} − ${c} = ${b - c}, dann ${a} − ${b - c} = ${a - b + c}. Beurteile den Rechenweg.`, [
        opt(`Falsch. Beide Zahlen werden abgezogen: ${b} + ${c} = ${b + c} und ${a} − ${b + c} = ${a - b - c}.`, true),
        opt('Richtig. Die beiden Subtrahenden darf man zuerst verrechnen.', false, 'sub-klammerfehler'),
        opt(`Falsch. Man muss ${a} + ${b} − ${c} rechnen.`, false, 'sub-addiert'),
        opt('Richtig. Das Ergebnis ist kleiner als der Minuend, also stimmt es.')],
      h2('Überlege, wie viel insgesamt abgezogen wird.', `Insgesamt werden ${b} + ${c} = ${b + c} abgezogen.`), { nachweis: [U(false, `${a} − ${b} − ${c}`, a - b + c), ...N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − ${b} − ${c}`)] }); },
  ]);
  sechs(S('S3'), 'E', [
    () => { const [a, b, c, d] = suche(() => [zz(7, 9) * 1000, zz(1111, 2999), zz(1011, 1999), zz(211, 899)], ([x, y, v, w]) => x - y - v - w > 500);
      return zahl(`Berechne: ${a} − ${b} − ${c} − ${d}`, a - b - c - d, fehlerliste(a - b - c - d, [[a - b - c, 'sach-schritt-vergessen'], [a - b - c + d, 'sub-klammerfehler']]), h1('Addiere zuerst alle Subtrahenden.'), { nachweis: N(`${a} − ${b} − ${c} − ${d}`) }); },
    () => { const [b, c, d] = [zz(11, 39) * 5 + 100, zz(21, 59) * 5 + 200, zz(11, 39) * 5], r = zz(8, 20) * 100;
      return zahl(`Von einer Zahl werden nacheinander ${b}, ${c} und ${d} subtrahiert. Es bleibt ${r}. Bestimme die Zahl.`, r + b + c + d, fehlerliste(r + b + c + d, [[r - b - c - d, 'probe-falsche-umkehr']]), h1('Rechne rückwärts: Mache jede Subtraktion rückgängig.'), { nachweis: N(`${r} + ${b} + ${c} + ${d}`, `${r + b + c + d} − ${b} − ${c} − ${d}`) }); },
    () => { const a = zz(21, 29) * 100, [b, c, d] = [650 + wahl([0, 50]), 350 + wahl([0, 50]), 250];
      return auswahl(`Welcher Term hat denselben Wert wie ${a} − ${b} − ${c} − ${d}?`, [opt(`${a} − (${b} + ${c} + ${d})`, true), opt(`${a} − (${b} + ${c}) + ${d}`, false, 'sub-klammerfehler'), opt(`${a} − ${b} + ${c} + ${d}`, false, 'sub-klammerfehler'), opt(`${a} − (${b} − ${c}) − ${d}`, false, 'sub-klammerfehler'), opt(`(${a} − ${b}) + (${c} − ${d})`, false, 'klammer-falsch-gesetzt')],
        h1('Alle drei Zahlen werden abgezogen. Fasse zusammen, was insgesamt abgezogen wird.'), { nachweis: N(`${a} − ${b} − ${c} − ${d}`, `${a} − (${b} + ${c} + ${d})`) }); },
    () => { const m = zz(8, 12);
      return luecken(`Von 100 werden fünf aufeinanderfolgende Zahlen subtrahiert: 100 − ${m - 2} − ${m - 1} − ${m} − ${m + 1} − ${m + 2} = ${100 - 5 * m}. Stelle die Regel auf: Insgesamt wird {{a}} · die mittlere Zahl subtrahiert. Bei welcher mittleren Zahl ist das Ergebnis 0? {{b}}`, { a: 5, b: 20 },
        h1('Die beiden äußeren Zahlen weichen gleich weit von der mittleren ab, die eine nach oben, die andere nach unten.'), { nachweis: N(`100 − ${m - 2} − ${m - 1} − ${m} − ${m + 1} − ${m + 2}`, `(100 − ${100 - 5 * m}) : ${m}`, `100 − 5 · ${m}`, '100 : 5', '100 − 5 · 20 = 0') }); },
    () => { const x = zz(12, 34) * 10, r = zz(15, 30) * 10;
      return zahl(`In ${r + 2 * x} − ▢ − ▢ = ${r} steht in beiden Kästchen dieselbe Zahl. Bestimme sie.`, x, fehlerliste(x, [[2 * x, 'sach-schritt-vergessen']]), h1('Berechne zuerst, wie viel insgesamt subtrahiert wird.'), { nachweis: N(`${r + 2 * x} − ${x} − ${x}`, `(${r + 2 * x} − ${r}) : 2`) }); },
    () => auswahl('Lisa behauptet: „Bei a − b − c darf ich die beiden Subtrahenden vertauschen. Es gilt immer a − b − c = a − c − b.“ Wähle die richtige Begründung.', [
      opt('Das stimmt immer. Beide Male wird insgesamt b + c abgezogen. Beispiel: 90 − 20 − 30 = 40 und 90 − 30 − 20 = 40.', true),
      opt('Das stimmt nie. Beim Subtrahieren darf man nichts vertauschen, auch nicht die Subtrahenden.', false, 'gesetz-auf-subtraktion'),
      opt('Das stimmt nur, wenn b und c gleich groß sind.'),
      opt('Das stimmt immer, denn auch a − b = b − a.', false, 'gesetz-auf-subtraktion'),
      opt('Das stimmt nur, wenn b größer ist als c.')],
    h1('Überlege, wie viel in beiden Rechnungen insgesamt abgezogen wird.'), { nachweis: [U(true), ...N('90 − 20 − 30', '90 − 30 − 20')] }),
  ]);

  // =====================================================================
  // S4 Überschlag und Probe
  // =====================================================================
  const zehnerStrahl = (n, extra = {}) => ({ von: Math.floor(n / 10) * 10, bis: Math.floor(n / 10) * 10 + 10, schritt: 1, beschriftung: 5, start: n, ...extra });
  sechs(S('S4'), 'F', [
    () => { const n = zz(2, 8) * 10 + wahl([1, 2, 3, 7, 8, 9]), ziel = runde(n, 10);
      return strahl('markieren', Z(`Der Punkt liegt bei ${n}.`, 'Welcher Zehner liegt am nächsten?', 'Tippe ihn an.'), zehnerStrahl(n), ziel, fehlerliste(ziel, [[ziel === Math.floor(n / 10) * 10 ? ziel + 10 : ziel - 10, 'falsch-gerundet']]),
        h3('Zehner sind Zahlen wie 10, 20, 30. Zähle die Striche bis zum Zehner links und rechts.', '38: Bis 40 sind es 2 Striche, bis 30 sind es 8 Striche. Am nächsten ist 40.', `Bis ${Math.floor(n / 10) * 10} sind es ${n % 10} Striche. Bis ${Math.floor(n / 10) * 10 + 10} sind es ${10 - n % 10} Striche.`),
        { nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const n = zz(2, 8) * 10 + wahl([2, 3, 4, 6, 7, 8]), u = Math.floor(n / 10) * 10, ziel = runde(n, 10);
      return auswahl(Z(`Der Punkt liegt bei ${n}.`, `Welcher Zehner liegt näher an ${n}?`), [opt(String(u), ziel === u, 'falsch-gerundet'), opt(String(u + 10), ziel === u + 10, 'falsch-gerundet'), opt(String(u + 5), false, 'stellenwert')].map((o) => (o.richtig ? { text: o.text, richtig: true } : o)),
        h3('Schau auf den Zahlenstrahl: Welcher Zehner ist näher am Punkt?', '33 liegt näher an 30 als an 40.', `Bis ${u} sind es ${n % 10} Striche. Bis ${u + 10} sind es ${10 - n % 10} Striche.`),
        { bild: B.strahl(zehnerStrahl(n)), nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const a = zz(15, 19), b = zz(3, 6);
      return luecken(Z(`${a} − ${b} = ${a - b}`, 'Mit Plus kommst du zurück.', `${a - b} + ${b} = {{a}}`), { a: [a, fehlerliste(a, [[a - b - b, 'add-subtrahiert']])] },
        h3('Plus macht Minus rückgängig. Du landest wieder am Start.', '14 − 4 = 10. Zurück mit Plus: 10 + 4 = 14.', `Springe von ${a - b} aus ${b} nach rechts.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: [{ von: a, nach: a - b, text: `− ${b}` }] }), nachweis: N(`${a} − ${b}`, `${a - b} + ${b}`) }); },
    () => { const n = zz(3, 8) * 10 + wahl([1, 2, 8, 9]), ziel = runde(n, 10);
      return strahl('markieren', Z(`Der Punkt liegt bei ${n}.`, `Welcher Zehner liegt am nächsten bei ${n}?`, 'Tippe ihn an.'), zehnerStrahl(n), ziel, fehlerliste(ziel, [[ziel === Math.floor(n / 10) * 10 ? ziel + 10 : ziel - 10, 'falsch-gerundet']]),
        h3('Zehner sind Zahlen wie 10, 20, 30. Der nächste Zehner ist nur wenige Striche entfernt.', '62: Bis 60 sind es nur 2 Striche. Am nächsten ist 60.', `Bis ${Math.floor(n / 10) * 10} sind es ${n % 10} Striche. Bis ${Math.floor(n / 10) * 10 + 10} sind es ${10 - n % 10} Striche.`),
        { nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const a = 20, b = zz(4, 8), k = kind();
      return luecken(Z(`${k} rechnet: ${a} − ${b} = ${a - b - 1}`, 'Prüfe mit Plus.', `${a - b - 1} + ${b} = {{a}}`, `Das ist nicht ${a}.`, `Richtig ist: ${a} − ${b} = {{b}}`), { a: a - 1, b: a - b },
        h3('Kommst du mit Plus nicht zum Start zurück? Dann ist das Ergebnis falsch.', '10 − 4 = 5? Prüfe: 5 + 4 = 9. Das ist nicht 10. Richtig ist 6.', `${a - b - 1} + ${b} = ${a - 1}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: [{ von: a, nach: a - b, text: `− ${b}` }] }), nachweis: N(`${a - b - 1} + ${b}`, `${a} − ${b}`) }); },
    () => { const a = zz(13, 18), b = zz(4, 7), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} − ${b} = ${a - b}`, 'Mit welcher Plus-Aufgabe kommst du zurück zum Start?'), [opt(`${a - b} + ${b}`, true), opt(`${a} + ${b}`, false, 'probe-falsche-umkehr'), opt(`${a} + ${a - b}`, false, 'probe-falsche-umkehr')],
        h3('Starte beim Ergebnis. Gib zurück, was weggenommen wurde.', '12 − 5 = 7. Zurück: 7 + 5 = 12.', `Das Ergebnis ist ${a - b}. Weggenommen wurden ${b}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: [{ von: a, nach: a - b, text: `− ${b}` }] }), nachweis: N(`${a} − ${b}`, `${a - b} + ${b}`) }); },
  ]);
  sechs(S('S4'), 'G', [
    () => { const [a, b] = suche(() => [zz(51, 98), zz(21, 48)], ([x, y]) => [x, y].every((v) => ![0, 4, 5, 6].includes(v % 10)) && runde(x, 10) - runde(y, 10) >= 20);
      const ra = runde(a, 10), rb = runde(b, 10), fa = ra > a ? ra - 10 : ra + 10, fb = rb > b ? rb - 10 : rb + 10;
      return auswahl(Z(`Welcher Überschlag passt zu ${a} − ${b}?`), [opt(`${ra} − ${rb}`, true), opt(`${fa} − ${rb}`, false, 'falsch-gerundet'), opt(`${ra} − ${fb}`, false, 'falsch-gerundet')],
        h3('Runde beide Zahlen auf den nächsten Zehner.', '68 − 31: 68 ist fast 70, 31 ist fast 30. Der Überschlag ist 70 − 30.', `${a} liegt am nächsten bei ${ra}.`),
        { bild: B.strahl(zehnerStrahl(a)), nachweis: [`${a} ≈ ${ra}`, `${b} ≈ ${rb}`, ...N(`${ra} − ${rb}`)] }); },
    () => { const [a, b] = paar(50, 99, 0, (x, y) => y >= 11);
      return luecken(Z('Mache die Probe.', `${a} − ${b} = ${a - b}`, `Probe: ${a - b} + {{a}} = {{b}}`), { a: [b, fehlerliste(b, [[a, 'probe-falsche-umkehr']])], b: a },
        h3('Bei der Probe rechnest du zurück: Ergebnis plus die abgezogene Zahl.', '85 − 32 = 53. Probe: 53 + 32 = 85.', `Abgezogen wurde ${b}. Rechne ${a - b} + ${b}.`), { nachweis: N(`${a} − ${b}`, `${a - b} + ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(411, 989), zz(111, 389)], ([x, y]) => [x, y].every((v) => Math.abs(v - runde(v, 100)) <= 20 && v % 100 !== 0) && runde(x, 100) > runde(y, 100));
      return luecken(Z('Überschlage zuerst.', `${a} − ${b}`, 'Runde beide Zahlen auf Hunderter.', '{{a}} − {{b}} = {{c}}'), { a: runde(a, 100), b: runde(b, 100), c: runde(a, 100) - runde(b, 100) },
        h3('Hunderter sind Zahlen wie 100, 200, 300. Suche den Hunderter in der Nähe.', '592 − 208: 592 ist fast 600, 208 ist fast 200. Überschlag: 600 − 200 = 400.', `${a} liegt nahe bei ${runde(a, 100)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} − ${runde(b, 100)}`)] }); },
    () => { const [a, b] = suche(() => [zz(61, 98), zz(21, 48)], ([x, y]) => [x, y].every((v) => [1, 2, 8, 9].includes(v % 10)));
      return zahl(Z(`Überschlage: ${a} − ${b}`, 'Rechne mit den Zehnern in der Nähe.'), runde(a, 10) - runde(b, 10), fehlerliste(runde(a, 10) - runde(b, 10), [[a - b, 'ueberschlag-nicht-gerundet']]),
        h3('Beim Überschlag rechnest du mit runden Zahlen.', '79 − 42: 80 − 40 = 40.', `${a} ist fast ${runde(a, 10)}. ${b} ist fast ${runde(b, 10)}.`),
        { bild: B.strahl(zehnerStrahl(b)), nachweis: [`${a} ≈ ${runde(a, 10)}`, `${b} ≈ ${runde(b, 10)}`, ...N(`${runde(a, 10)} − ${runde(b, 10)}`)] }); },
    () => { const [a, b] = paar(60, 99, 1, (x, y) => y >= 21 && x - y !== y), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} − ${b} = ${a - b}`, `Mit welcher Rechnung macht ${k} die Probe?`), [opt(`${a - b} + ${b}`, true), opt(`${a} + ${b}`, false, 'probe-falsche-umkehr'), opt(`${a - b} − ${b}`, false, 'probe-falsche-umkehr')],
        h3('Die Probe rechnet zurück zur ersten Zahl.', '74 − 28 = 46. Probe: 46 + 28 = 74.', `Die Probe muss wieder ${a} ergeben.`),
        { bild: B.streifen(a, [b, a - b]), nachweis: N(`${a} − ${b}`, `${a - b} + ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(5, 9) * 100 + zz(1, 5), zz(2, 3) * 100 - zz(1, 5)], () => true), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} − ${b} = ${a - b + 100}`, `Der Überschlag ist ${runde(a, 100)} − ${runde(b, 100)} = ${runde(a, 100) - runde(b, 100)}.`, `Stimmt das Ergebnis ${a - b + 100}?`), [opt('Stimmt. Ein Überschlag ist ja nie ganz genau.', false, 'ueberschlag-nicht-gerundet'), opt(`Falsch. Es muss nahe bei ${runde(a, 100) - runde(b, 100)} liegen. Richtig ist ${a - b}.`, true), opt(`Falsch. Es muss nahe bei ${runde(a, 100) + runde(b, 100)} liegen.`, false, 'sub-addiert')],
        h3('Vergleiche das Ergebnis mit dem Überschlag. Beide müssen nah beieinanderliegen.', '603 − 298: Überschlag 600 − 300 = 300. Das Ergebnis 405 ist zu weit weg. Richtig ist 305.', `Der Überschlag ist ${runde(a, 100) - runde(b, 100)}. Das Ergebnis ${a - b + 100} ist 100 zu groß.`),
        { nachweis: [U(false, `${a} − ${b}`, a - b + 100), `${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} − ${runde(b, 100)}`, `${a} − ${b}`, `${runde(a, 100)} + ${runde(b, 100)}`)] }); },
  ]);
  const tausender = (von, bis) => suche(() => zz(von, bis), (x) => Math.abs(x - runde(x, 1000)) <= 250 && x % 1000 !== 0);
  sechs(S('S4'), 'M', [
    () => { const a = tausender(5500, 9500), b = tausender(1500, 3500);
      return zahl(`Überschlage: ${a} − ${b}. Runde dazu beide Zahlen auf Tausender.`, runde(a, 1000) - runde(b, 1000), fehlerliste(runde(a, 1000) - runde(b, 1000), [[a - b, 'ueberschlag-nicht-gerundet']]), h2('Runde zuerst, rechne dann im Kopf.', `${a} ≈ ${runde(a, 1000)} und ${b} ≈ ${runde(b, 1000)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} − ${runde(b, 1000)}`)] }); },
    () => { const a = tausender(4500, 8500), b = tausender(1500, 2500);
      return sach(`${kind()} hat gerechnet: ${a} − ${b} = ${a - b}.`, [teil('Berechne den Überschlag mit Zahlen, die auf Tausender gerundet sind.', runde(a, 1000) - runde(b, 1000), null, fehlerliste(runde(a, 1000) - runde(b, 1000), [[a - b, 'ueberschlag-nicht-gerundet']])), teil(`Mache die Probe: ${a - b} + ${b}`, a, null, fehlerliste(a, [[a - b - b, 'probe-falsche-umkehr']]))],
        h2('Der Überschlag prüft die Größenordnung, die Probe prüft das genaue Ergebnis.', `Überschlag: ${runde(a, 1000)} − ${runde(b, 1000)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} − ${runde(b, 1000)}`, `${a - b} + ${b}`, `${a} − ${b}`)] }); },
    () => { const paare = [0, 1, 2, 3].map(() => [tausender(5500, 9500), tausender(1500, 3500)]), i = zz(0, 3);
      return auswahl('Genau eine Rechnung ist falsch. Finde sie mit dem Überschlag.', paare.map(([a, b], j) => opt(`${a} − ${b} = ${a - b + (j === i ? 1000 : 0)}`, j === i, j === i ? undefined : 'ueberschlag-nicht-gerundet')),
        h2('Runde bei jeder Rechnung beide Zahlen auf Tausender und vergleiche mit dem Ergebnis.', `Erste Rechnung im Überschlag: ${runde(paare[0][0], 1000)} − ${runde(paare[0][1], 1000)} = ${runde(paare[0][0], 1000) - runde(paare[0][1], 1000)}.`), { nachweis: [{ art: 'gleichungen', falsche: true }] }); },
    () => { const [a, b] = suche(() => [zz(5, 9) * 1000 + zz(1, 9) * 10, zz(1111, 3999)], ([x, y]) => subUebertraege(x, y) >= 2);
      return luecken(`Mache die Probe zu ${a} − ${b} = ${a - b}. Probe: ${a - b} + {{a}} = {{b}}`, { a: [b, fehlerliste(b, [[a, 'probe-falsche-umkehr']])], b: a },
        h2('Die Probe ist die Umkehraufgabe: Differenz + Subtrahend = Minuend.', `Addiere zur Differenz ${a - b} den Subtrahenden ${b}.`), { nachweis: N(`${a} − ${b}`, `${a - b} + ${b}`) }); },
    () => { const ziel = zz(2, 4) * 1000; const r = [[ziel + 4000 + zz(60, 140), 3990 - zz(60, 120)], [ziel + 4000 + zz(20, 90), 1990 - zz(5, 30)], [ziel + 2000 + zz(5, 40), 2990 - zz(20, 60)], [ziel + 5000 + zz(150, 240), 3100 + zz(0, 40)]];
      return auswahl(`Ein Ergebnis liegt zwischen ${ziel} und ${ziel + 1000}. Entscheide mit dem Überschlag, welche Aufgabe dazu gehört.`, r.map(([a, b], j) => opt(`${a} − ${b}`, j === 0, j === 0 ? undefined : 'ueberschlag-nicht-gerundet')),
        h2('Überschlage jede Aufgabe mit gerundeten Tausendern.', `${r[0][0]} − ${r[0][1]} ist ungefähr ${runde(r[0][0], 1000)} − ${runde(r[0][1], 1000)}.`), { nachweis: r.map(([a, b], j) => ({ art: 'zwischen', ausdruck: `${a} − ${b}`, von: ziel, bis: ziel + 1000, gilt: j === 0 })) }); },
    () => { const a = zz(5, 7) * 1000 + zz(505, 540), b = zz(2, 3) * 1000 + zz(455, 495), ue = runde(a, 1000) - runde(b, 1000);
      return auswahl(`Zu ${a} − ${b} passt der Überschlag ${runde(a, 1000)} − ${runde(b, 1000)} = ${ue}. Das genaue Ergebnis ist ${a - b}. Erkläre, warum der Überschlag so stark abweicht.`, [
        opt(`Der Minuend wurde um ${runde(a, 1000) - a} aufgerundet, der Subtrahend um ${b - runde(b, 1000)} abgerundet. Beide Rundungen vergrößern die Differenz.`, true),
        opt('Beide Zahlen wurden aufgerundet. Das vergrößert die Differenz, denn größere Zahlen ergeben mehr.', false, 'falsch-gerundet'),
        opt('Der Überschlag ist falsch gerechnet.', false, 'ueberschlag-nicht-gerundet'),
        opt('Beim Überschlag darf das Ergebnis beliebig weit abweichen.')],
      h2('Prüfe für jede der beiden Zahlen: Wurde auf- oder abgerundet, und was bewirkt das für die Differenz?', `${a} wurde auf ${runde(a, 1000)} aufgerundet. Das sind ${runde(a, 1000) - a} mehr.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} − ${runde(b, 1000)}`, `${a} − ${b}`, `${runde(a, 1000)} − ${a}`, `${b} − ${runde(b, 1000)}`)] }); },
  ]);
  sechs(S('S4'), 'E', [
    () => { const [a, b] = suche(() => [zz(6001, 9899), zz(2101, 4899)], ([x, y]) => [x, y].every((v) => Math.abs(v % 100 - 50) > 10 && v % 100 !== 0));
      return zahl(`Überschlage ${a} − ${b}. Runde beide Zahlen auf Hunderter.`, runde(a, 100) - runde(b, 100), fehlerliste(runde(a, 100) - runde(b, 100), [[a - b, 'ueberschlag-nicht-gerundet'], [runde(a, 1000) - runde(b, 1000), 'falsch-gerundet']]), h1('Auf Hunderter runden heißt: Die Zehnerziffer entscheidet.'),
        { nachweis: [`${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} − ${runde(b, 100)}`)] }); },
    () => auswahl('Bei einem Überschlag wird der Minuend aufgerundet und der Subtrahend abgerundet. Vergleiche den Überschlag mit dem genauen Ergebnis.', [
      opt('Der Überschlag ist größer: Es wird von mehr ausgegangen und weniger abgezogen.', true),
      opt('Der Überschlag ist kleiner: Beim Runden geht immer etwas verloren.', false, 'falsch-gerundet'),
      opt('Beide sind gleich: Die Rundungen heben sich auf.', false, 'falsch-gerundet'),
      opt('Das lässt sich ohne die Zahlen nicht sagen.'),
      opt('Der Überschlag ist kleiner: Der Subtrahend wird kleiner.', false, 'begriffe-verwechselt')],
    h1('Prüfe an einem Beispiel wie 58 − 22 und dem Überschlag 60 − 20.'), { nachweis: N('58 − 22', '60 − 20') }),
    () => { const [a, b] = paar(5000, 9999, 2), f = wahl([10, 100]);
      return zahl(`${kind()} rechnet ${a} − ${b} und erhält ein falsches Ergebnis. Die Probe ergibt: Ergebnis + ${b} = ${a - f}. Um wie viel ist das Ergebnis zu klein?`, f, fehlerliste(f, [[a - b - f, 'sach-schritt-vergessen']]), h1('Die Probe müsste den Minuenden ergeben. Vergleiche.'), { nachweis: N(`${a} − ${b}`, `${a} − ${a - f}`, `${a - b - f} + ${b}`) }); },
    () => auswahl('Du willst eine Differenz möglichst genau überschlagen. Stelle eine Regel für das Runden auf.', [
      opt('Runde Minuend und Subtrahend in dieselbe Richtung. Dann gleichen sich die Rundungsfehler teilweise aus.', true),
      opt('Runde den Minuenden auf und den Subtrahenden ab. Dann gleichen sich die Rundungsfehler aus.', false, 'falsch-gerundet'),
      opt('Runde immer beide Zahlen ab. Dann ist der Überschlag nie zu groß.', false, 'falsch-gerundet'),
      opt('Runde nur den Subtrahenden. Der Minuend spielt für die Genauigkeit keine Rolle.'),
      opt('Runde beide Zahlen auf dieselbe Stelle. Die Richtung ist gleichgültig.')],
    h1('Vergleiche 58 − 27 = 31 mit den Überschlägen 60 − 30, 60 − 20 und 50 − 30.'), { nachweis: N('58 − 27', '60 − 30', '60 − 20', '50 − 30') }),
    () => { const d = zz(1201, 2899), m = wahl([4000, 5000, 6000]);
      return zahl(`Bei einer Subtraktion ist die Differenz ${d}. Die Probe lautet ${d} + ▢ = ${m}. Bestimme den Subtrahenden.`, m - d, fehlerliste(m - d, [[m + d, 'sub-addiert'], [m - d + 1000, 'ergaenzen-zu-viel']]), h1('Die Probe addiert Differenz und Subtrahend zum Minuenden.'), { nachweis: N(`${m} − ${d}`, `${d} + ${m - d}`) }); },
    () => auswahl('Tarik prüft 74 − 28 = 46 mit der Rechnung 74 − 46. Ist das eine geeignete Probe? Wähle die richtige Begründung.', [
      opt('Ja. Minuend − Differenz ergibt den Subtrahenden: 74 − 46 = 28.', true),
      opt('Nein. Eine Probe muss immer eine Addition sein.', false, 'probe-falsche-umkehr'),
      opt('Nein. 74 − 46 ergibt wieder 46.'),
      opt('Ja. Bei der Subtraktion darf man die Zahlen beliebig vertauschen.', false, 'gesetz-auf-subtraktion'),
      opt('Ja, aber nur, weil 74 eine gerade Zahl ist.')],
    h1('Minuend, Subtrahend und Differenz hängen zusammen: Kennst du zwei davon, liegt die dritte fest.'), { nachweis: [U(true), ...N('74 − 28', '74 − 46')] }),
  ]);

  // =====================================================================
  // S5 Sachaufgaben zur Subtraktion
  // =====================================================================
  const DINGE = [['Im Korb sind', 'Äpfel', 'nimmt', 'weg'], ['Auf dem Tisch liegen', 'Stifte', 'nimmt', 'weg'], ['In der Dose sind', 'Kekse', 'isst', 'auf'], ['Im Regal stehen', 'Bücher', 'nimmt', 'heraus'], ['In der Schale liegen', 'Nüsse', 'isst', 'auf']];
  sechs(S('S5'), 'F', [
    () => { const [ort, ding, verb, zusatz] = wahl(DINGE), a = zz(9, 14), b = zz(3, 6), k = kind();
      return auswahl(Z(`${ort} ${a} ${ding}.`, `${k} ${verb} ${b} ${ding} ${zusatz}.`, 'Welche Rechnung passt?'), [opt(`${a} − ${b}`, true), opt(`${a} + ${b}`, false, 'sach-falsche-rechnung'), opt(`${b} − ${a}`, false, 'begriffe-verwechselt')],
        h3('Es werden weniger. Das ist minus.', '10 Äpfel, 3 Äpfel weg: 10 − 3.', `Am Anfang sind es ${a}. Dann gehen ${b} weg.`), { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const [ort, ding, verb, zusatz] = wahl(DINGE), a = zz(12, 18), b = zz(4, 8), k = kind();
      return zahl(Z(`${ort} ${a} ${ding}.`, `${k} ${verb} ${b} ${ding} ${zusatz}.`, `Wie viele ${ding} sind noch da?`), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Zähle im Bild die Plättchen ohne Strich.', '15 Stifte, 6 Stifte weg: 15 − 6 = 9.', `Rechne ${a} − ${b}.`), { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(22, 38), b = 10;
      return zahl(Z(`Im Bus sitzen ${a} Kinder.`, `${b} Kinder steigen aus.`, 'Wie viele Kinder sitzen noch im Bus?'), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung'], [a - 1, 'stellenwert']]),
        h3('Aussteigen heißt: Es werden weniger.', '25 Kinder, 10 steigen aus: 25 − 10 = 15.', `Rechne ${a} − ${b}.`), { bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(3, 5) * 10, b = zz(3, 8), k = kind();
      return zahl(Z(`${k} hat ${a} Euro.`, `${k} gibt ${b} Euro aus.`, `Wie viel Euro hat ${k} noch?`), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Ausgeben heißt: Das Geld wird weniger.', '30 Euro, 4 Euro ausgegeben: 30 − 4 = 26.', `Springe von ${a} aus ${b} zurück.`),
        { einheit: 'Euro', bild: B.strahl({ von: a - 10, bis: a + 10, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, b) }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = wahl([15, 20, 25]), b = zz(4, 9);
      return auswahl(Z(`Die Rechnung ist ${a} − ${b}.`, 'Welche Geschichte passt?'), [opt(`${a} Ballons. ${b} Ballons platzen.`, true), opt(`${a} Ballons. ${b} Ballons kommen dazu.`, false, 'sach-falsche-rechnung'), opt(`${b} Kinder. Jedes Kind hat ${a} Ballons.`, false, 'sach-falsche-rechnung')],
        h3('Minus heißt: Es werden weniger.', '12 − 5 passt zu: 12 Kekse. 5 Kekse werden gegessen.', 'Suche die Geschichte, in der etwas weggeht.'), { bild: B.menge(a, { weg: b }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(3, 4) * 10 + zz(4, 9), b = a % 10;
      return zahl(Z(`In der Kiste sind ${a} Bälle.`, `Die Kinder holen ${b} Bälle heraus.`, 'Wie viele Bälle bleiben in der Kiste?'), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Herausholen heißt: Es werden weniger.', '27 Bälle, 7 heraus: 27 − 7 = 20.', `Rechne ${a} − ${b}.`), { bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
  ]);
  sechs(S('S5'), 'G', [
    () => { const a = zz(6, 9) * 10 + zz(2, 8), b = zz(2, 4) * 10, k = kind();
      return zahl(Z(`Ein Buch hat ${a} Seiten.`, `${k} hat schon ${b} Seiten gelesen.`, 'Wie viele Seiten fehlen noch?'), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Das ganze Buch ist der lange Streifen. Die gelesenen Seiten gehen weg.', '70 Seiten, 20 gelesen: 70 − 20 = 50.', `Rechne ${a} − ${b}.`), { einheit: 'Seiten', bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(70, 99, 0, (x, y) => y >= 31);
      return zahl(Z(`Im Kino gibt es ${a} Plätze.`, `${b} Plätze sind besetzt.`, 'Wie viele Plätze sind noch frei?'), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Alle Plätze minus die besetzten Plätze.', '80 Plätze, 50 besetzt: 80 − 50 = 30.', `Rechne ${a} − ${b}.`), { einheit: 'Plätze', bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
    () => { const [k1, k2] = zweiKinder(), [a, b] = paar(60, 95, 1, (x, y) => y >= 31);
      return zahl(Z(`${k1} hat ${b} Karten.`, `${k2} hat ${a} Karten.`, `Wie viele Karten hat ${k2} mehr als ${k1}?`), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung'], [kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser']]),
        h3('Gesucht ist der Unterschied. Den Unterschied rechnest du mit minus.', '50 Karten und 30 Karten: Der Unterschied ist 50 − 30 = 20.', `Rechne ${a} − ${b}.`), { einheit: 'Karten', bild: B.vergleich({ name: k2, wert: a }, { name: k1, wert: b }, frage(a - b)), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(5, 8) * 10 + zz(5, 9), b = zz(1, 2) * 10 + zz(1, 4);
      return zahl(Z(`Eine Jacke kostet ${a} Euro.`, `Im Angebot ist sie ${b} Euro billiger.`, 'Wie viel Euro kostet die Jacke jetzt?'), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']]),
        h3('Billiger heißt: Der Preis wird kleiner.', '50 Euro, 10 Euro billiger: 50 − 10 = 40.', `Rechne ${a} − ${b}.`), { einheit: 'Euro', bild: B.streifen(a, [b, frage(a - b)]), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(11, 15), b = zz(3, 6), k = kind();
      return auswahl(Z(`${k} ist ${a} Jahre alt.`, `${k} ist ${b} Jahre älter als der Bruder.`, 'Wie alt ist der Bruder?', 'Welche Rechnung passt?'), [opt(`${a} − ${b}`, true), opt(`${a} + ${b}`, false, 'sach-falsche-rechnung'), opt(`${b} − ${a}`, false, 'begriffe-verwechselt')],
        h3(`Wer ist jünger? Der Jüngere hat die kleinere Zahl.`, 'Tim ist 10. Er ist 2 Jahre älter als Eva. Eva ist 10 − 2 = 8.', `Der Bruder ist jünger als ${k}. Seine Zahl ist kleiner als ${a}.`), { bild: B.vergleich({ name: k, wert: a }, { name: 'Bruder', wert: frage(a - b) }, b), nachweis: N(`${a} − ${b}`) }); },
    () => { const [a, b] = paar(50, 80, 1, (x, y) => y >= 12 && y <= 29), k = kind();
      return auswahl(Z(`Im Bus sind ${a} Menschen.`, `${b} Menschen steigen aus.`, `${k} rechnet ${a} + ${b} = ${a + b}.`, 'Stimmt das?'), [opt('Stimmt. Es sind mehr Zahlen. Also rechnet man plus.', false, 'sach-falsche-rechnung'), opt(`Falsch. Aussteigen heißt minus. ${a} − ${b} = ${a - b}.`, true), opt(`Falsch. Man muss ${b} − ${a} rechnen.`, false, 'begriffe-verwechselt')],
        h3('Steigen Menschen aus, werden es weniger.', '40 Menschen, 10 steigen aus: 40 − 10 = 30.', `Rechne ${a} − ${b}.`), { bild: B.streifen(a, [b, frage(a - b)]), nachweis: [U(false, `${a} − ${b}`, a + b), ...N(`${a} − ${b}`)] }); },
  ]);
  sechs(S('S5'), 'M', [
    () => { const a = zz(20, 30) * 10, b = suche(() => zz(121, 219), (x) => x % 10 !== 0 && a - x > 20);
      return zahl(`Die Klasse 5d braucht ${a} € für den Ausflug. In der Klassenkasse sind ${b} €. Berechne den Betrag, der fehlt.`, a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung'], [kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser']]), h2('Gesucht ist der Unterschied zwischen dem Betrag, der gebraucht wird, und dem Betrag, der da ist.', `Rechne ${a} − ${b}.`), { einheit: '€', nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(41, 58), b = zz(12, 19), c = zz(6, 9);
      return sach(`Ein Bus fährt mit ${a} Fahrgästen los. An der ersten Haltestelle steigen ${b} aus, an der zweiten ${c}.`, [teil('Berechne die Zahl der Fahrgäste nach der ersten Haltestelle.', a - b, null, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung']])), teil('Berechne die Zahl der Fahrgäste nach der zweiten Haltestelle.', a - b - c, null, fehlerliste(a - b - c, [[a - c, 'sach-schritt-vergessen'], [a - b + c, 'sub-klammerfehler']]))],
        h2('Rechne Haltestelle für Haltestelle.', `Nach der ersten Haltestelle: ${a} − ${b}.`), { nachweis: N(`${a} − ${b}`, `${a - b} − ${c}`) }); },
    () => { const e = zz(9, 14), k = zz(5, 8), f = 2 * e + 2 * k - zz(4, 9);
      return zahl(`Preise im Freibad: Erwachsene ${e} €, Kinder ${k} €, Familienkarte ${f} €. Familie Kaya kommt mit 2 Erwachsenen und 2 Kindern und kauft die Familienkarte. Berechne, wie viel sie gegenüber Einzelkarten spart.`, 2 * e + 2 * k - f, fehlerliste(2 * e + 2 * k - f, [[e + k - f, 'sach-schritt-vergessen'], [2 * e + 2 * k, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst, was vier Einzelkarten kosten.', `Einzelkarten: 2 · ${e} € + 2 · ${k} € = ${2 * e + 2 * k} €.`), { einheit: '€', nachweis: N(`2 · ${e} + 2 · ${k}`, `${2 * e + 2 * k} − ${f}`) }); },
    () => { const [a, b] = paar(180, 290, 1, (x, y) => y >= 120), [t1, t2] = wahl([['Der Fernsehturm', 'das Münster'], ['Der Funkturm', 'der Kirchturm'], ['Das Hochhaus', 'der Aussichtsturm']]);
      return zahl(`${t1} ist ${a} m hoch, ${t2} ${b} m. Berechne den Höhenunterschied.`, a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung'], [kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser']]), h2('Ein Unterschied ist eine Differenz.', `Rechne ${a} − ${b}.`), { einheit: 'm', nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(7, 9) * 10, b = zz(25, 38), c = zz(12, 19), k = kind();
      return auswahl(`${k} hat ${a} €. ${k} kauft ein Spiel für ${b} € und ein Buch für ${c} €. Welcher Rechenausdruck beschreibt das Restgeld?`, [opt(`${a} − (${b} + ${c})`, true), opt(`${a} − ${b} + ${c}`, false, 'klammer-ignoriert'), opt(`(${a} − ${b}) + ${c}`, false, 'klammer-falsch-gesetzt'), opt(`${a} + ${b} − ${c}`, false, 'sach-falsche-rechnung')],
        h2('Beide Preise werden bezahlt. Zusammen bilden sie den Betrag, der abgezogen wird.', `Ausgegeben werden ${b} € + ${c} €.`), { nachweis: N(`${a} − (${b} + ${c})`, `${a} − ${b} − ${c}`) }); },
    () => { const max = wahl([600, 630, 750]), drin = max - zz(205, 235), p1 = zz(92, 99), p2 = max - drin - p1 + zz(4, 9), k = kind();
      return auswahl(`Ein Aufzug trägt ${max} kg. Darin stehen 5 Personen mit zusammen ${drin} kg. Zwei weitere Personen mit ${p1} kg und ${p2} kg wollen einsteigen. ${k} sagt: „Das passt.“ Beurteile die Aussage.`, [
        opt(`Falsch: ${drin} + ${p1} + ${p2} = ${drin + p1 + p2}. Das sind ${drin + p1 + p2 - max} kg zu viel.`, true),
        opt(`Richtig: ${max} − ${drin} = ${max - drin}. Es ist noch viel Platz.`, false, 'sach-schritt-vergessen'),
        opt(`Richtig: ${max} − ${drin} − ${p1} = ${max - drin - p1}. Es bleibt noch etwas übrig.`, false, 'sach-schritt-vergessen'),
        opt('Falsch: In einem Aufzug dürfen höchstens 5 Personen stehen.', false, 'sach-unnoetige-angabe')],
      h2('Berechne das Gesamtgewicht aller sieben Personen und vergleiche es mit der Tragkraft.', `${drin} + ${p1} = ${drin + p1}. Addiere noch ${p2}.`), { nachweis: [U(false), ...N(`${drin} + ${p1} + ${p2}`, `${drin + p1 + p2} − ${max}`)] }); },
  ]);
  sechs(S('S5'), 'E', [
    () => { const max = zz(40, 50) * 10, d = zz(8, 16), da = suche(() => zz(211, 339), (x) => x % 10 !== 0);
      return zahl(`Ein Schwimmbad lässt ${max} Menschen gleichzeitig ins Wasser und hat ${d} Duschen. Um 14 Uhr sind ${da} Menschen im Wasser. Berechne, wie viele noch hineindürfen.`, max - da, fehlerliste(max - da, [[max - da - d, 'sach-unnoetige-angabe'], [max + da, 'sach-falsche-rechnung']]), h1('Nicht jede Angabe im Text wird gebraucht.'), { nachweis: [UEBERFLUESSIG(d), ...N(`${max} − ${da}`)] }); },
    () => { const a = 100, s = zz(38, 48), t = zz(11, 14), r = wahl([3, 5]), k = kind();
      return zahl(`${k} hat ${a} €. ${k} kauft Schuhe für ${s} € und zwei T-Shirts für je ${t} €. An der Kasse gibt es ${r} € Rabatt. Berechne das Restgeld.`, a - s - 2 * t + r, fehlerliste(a - s - 2 * t + r, [[a - s - t + r, 'sach-schritt-vergessen'], [a - s - 2 * t - r, 'sach-falsche-rechnung'], [a - s - 2 * t, 'sach-schritt-vergessen']]),
        h1('Berechne zuerst, was an der Kasse tatsächlich bezahlt wird.'), { einheit: '€', nachweis: N(`${s} + 2 · ${t} − ${r}`, `${a} − ${s + 2 * t - r}`) }); },
    () => { const p = zz(28, 36) * 10, aus = zz(65, 95), stadt = wahl(['Stuttgart', 'Ulm', 'Karlsruhe', 'Freiburg']);
      return auswahl(`Ein Zug hat ${p} Sitzplätze. In ${stadt} steigen ${aus} Personen aus, niemand steigt ein. Gesucht ist die Zahl der freien Sitzplätze nach dem Halt. Welche Angabe fehlt?`, [opt(`die Zahl der Personen, die vor dem Halt im Zug saßen`, true), opt('die Zahl der Wagen des Zuges', false, 'sach-unnoetige-angabe'), opt('die Uhrzeit der Ankunft', false, 'sach-unnoetige-angabe'), opt(`Es fehlt nichts: ${p} − ${aus} = ${p - aus}.`, false, 'sach-falsche-rechnung'), opt('der Preis einer Fahrkarte', false, 'sach-unnoetige-angabe')],
        h1('Überlege, wie du die besetzten Plätze nach dem Halt berechnen würdest.')); },
    () => { const mo = zz(4, 6) * 5, [plus, minus] = wahl([[10, 15], [5, 10], [10, 5]]), rest = zz(31, 58), k = kind(); const di = mo + plus, mi = di - minus;
      return zahl(`${k} liest ein Buch: am Montag ${mo} Seiten, am Dienstag ${plus} Seiten mehr als am Montag, am Mittwoch ${minus} Seiten weniger als am Dienstag. Danach sind noch ${rest} Seiten übrig. Bestimme, wie viele Seiten das Buch hat.`, mo + di + mi + rest, fehlerliste(mo + di + mi + rest, [[mo + plus + minus + rest, 'sach-schritt-vergessen'], [mo + di + mi, 'sach-schritt-vergessen']]),
        h1('Bestimme zuerst für jeden Tag die Seitenzahl.'), { einheit: 'Seiten', nachweis: N(`${mo} + ${plus}`, `${di} − ${minus}`, `${mo} + ${di} + ${mi} + ${rest}`) }); },
    () => { const a = zz(88, 98), w = wahl([7, 8, 9]), g = 50, n = Math.floor((a - g) / w) + 1, k = kind();
      return zahl(`${k} hat ${a} €. Jede Woche gibt ${k} ${w} € aus. Nach wie vielen Wochen sind es zum ersten Mal weniger als ${g} €?`, n, fehlerliste(n, [[n - 1, 'sach-schritt-vergessen']]), h1('Subtrahiere Woche für Woche und notiere die Beträge.'), { einheit: 'Wochen', nachweis: [{ art: 'ersteUnterschreitung', start: a, schritt: w, grenze: g, anzahl: n }] }); },
    () => auswahl('Fermi-Frage: Wie viele Schultage hat ein Jahr ungefähr? Ein Jahr hat 365 Tage. Überlege, welche Tage du abziehen musst.', [opt('etwa 190', true), opt('etwa 100', false, 'sach-falsche-rechnung'), opt('etwa 300', false, 'sach-schritt-vergessen'), opt('etwa 350', false, 'sach-schritt-vergessen')],
      h1('Ein Jahr hat 52 Wochen mit je 2 Wochenendtagen. Dazu kommen rund 14 Wochen Ferien mit je 5 Wochentagen.'), { nachweis: N('52 · 2', '14 · 5', '365 − 104 − 70', '191 ≈ 190') }),
  ]);
}
