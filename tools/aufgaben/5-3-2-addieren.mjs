// Aufgaben zu 5.3.2 „Addieren“ (Lernziele A1 bis A5) nach ADR 0015.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, strahl, raster, tabelle, diagramm, L, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, addUebertraege, addOhneUebertrag, runde, summe, kind, zweiKinder, U, GROESSTES, UEBERFLUESSIG } from '../werkzeug.mjs';

const A = (kurz) => `5.3.2-${kurz}`;
// Zwei Zahlen mit genau `n` Überträgen beim Addieren, ohne Nullen in den Ziffern.
const paar = (von, bis, n, passt = () => true) => suche(() => [zz(von, bis), zz(Math.ceil(von / 3), bis)],
  ([a, b]) => a + b <= (String(bis).length === String(von).length ? 10 ** String(bis).length - 1 : bis) && !/0/.test(`${a}${b}`) && addUebertraege(a, b) === n && a !== b && (a + b) % 10 !== 0 && passt(a, b));
const addFehler = (...z) => fehlerliste(summe(z), [[addOhneUebertrag(...z), 'add-uebertrag-vergessen'], [Math.abs(z[0] - z[1]), 'add-subtrahiert']]);
const vor = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x += s), text: `+ ${s}` })); };
const zehnerStrahl = (n, extra = {}) => ({ von: Math.floor(n / 10) * 10, bis: Math.floor(n / 10) * 10 + 10, schritt: 1, beschriftung: 5, start: n, ...extra });
const tausender = (von, bis) => suche(() => zz(von, bis), (x) => Math.abs(x - runde(x, 1000)) <= 250 && x % 1000 !== 0);

export function addieren() {
  // =====================================================================
  // A1 Fachbegriffe Summand und Summe
  // =====================================================================
  sechs(A('A1'), 'F', [
    () => { const a = zz(4, 8), b = zz(2, 5);
      return auswahl(Z('Die hellen Plättchen kommen dazu.', 'Welche Rechnung passt?'), [opt(`${a} + ${b}`, true), opt(`${a} − ${b}`, false, 'add-subtrahiert'), opt(`${a + b} + ${b}`, false, 'begriffe-verwechselt')],
        h3('Dazu heißt plus.', 'Bild: 5 dunkle Plättchen, 2 helle kommen dazu. Die Rechnung ist 5 + 2.', `Zähle die dunklen Plättchen: ${a}. Zähle die hellen: ${b}.`),
        { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(5, 9), b = zz(3, 6);
      return zahl(Z(`Es liegen ${a} Plättchen da.`, `${b} Plättchen kommen dazu.`, 'Wie viele Plättchen sind es zusammen?'), a + b, fehlerliste(a + b, [[a - b, 'add-subtrahiert']]),
        h3('Zähle alle Plättchen im Bild.', '6 Plättchen, 3 kommen dazu: Zusammen sind es 9.', `Rechne ${a} + ${b}.`),
        { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(5, 9), b = zz(2, 6);
      return luecken(Z('Schreibe die Plus-Aufgabe zum Bild.', '{{a}} + {{b}} = {{c}}'), { a, b, c: a + b },
        h3('Erst kommen die dunklen Plättchen. Dann kommen die hellen dazu.', '7 dunkle und 2 helle Plättchen: 7 + 2 = 9.', `Im Bild sind ${a} dunkle und ${b} helle Plättchen.`),
        { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(6, 12), b = zz(3, 7);
      return strahl('ablesen', Z('Der Pfeil springt weiter.', 'Bei welcher Zahl landet er?'), { von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b), pfeil: a + b }, a + b, fehlerliste(a + b, [[a - b, 'add-subtrahiert']]),
        h3('Weiter springen heißt plus.', 'Start 8, Sprung + 4: Du landest bei 12.', `Der Start ist bei ${a}. Zähle ${b} Striche nach rechts.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(5, 9), b = zz(3, 6);
      return zahl(Z(`Zusammen sind es ${a + b} Plättchen.`, `${a} Plättchen sind dunkel.`, 'Wie viele Plättchen sind hell?'), b, fehlerliste(b, [[a + b + a, 'begriffe-verwechselt'], [a, 'begriffe-verwechselt']]),
        h3('Zähle im Bild die hellen Plättchen.', 'Zusammen 9, davon 6 dunkel: 3 sind hell.', `Zähle von ${a} weiter bis ${a + b}.`),
        { bild: B.menge(a, { dazu: b }), nachweis: N(`${a + b} − ${a}`, `${a} + ${b}`) }); },
    () => { const a = zz(5, 8), [x, y, w] = mische([2, 3, 4, 5, 6, 7]).slice(0, 3);
      return zuordnen(Z(`Im Feld liegen ${a} Plättchen.`, 'Ordne jeder Aufgabe das Ergebnis zu.'), [x, y, w].map((v) => [`${a} + ${v}`, a + v]),
        h3('Lege in Gedanken so viele Plättchen dazu.', '6 + 3: Lege 3 Plättchen dazu. Dann sind es 9.', `${a} + ${x} = ${a + x}.`),
        { bild: B.zehnerfeld(a, { felder: 20 }), nachweis: N(...[x, y, w].map((v) => `${a} + ${v}`)) }); },
  ]);
  sechs(A('A1'), 'G', [
    () => { const [a, b] = paar(21, 68, 0); const [was, wert] = wahl([['Summand', a], ['Summand', b], ['Summe', a + b]]);
      return auswahl(Z(`${a} + ${b} = ${a + b}`, `Wie heißt die Zahl ${wert} in dieser Aufgabe?`), ['Summand', 'Summe', 'Differenz'].map((n) => opt(n, n === was, n === was ? undefined : 'begriffe-verwechselt')),
        h3('Summand + Summand = Summe.', '4 + 5 = 9: 4 und 5 sind die Summanden, 9 ist die Summe.', `${a + b} ist das Ergebnis. Das Ergebnis heißt Summe.`)); },
    () => { const [a, b] = paar(21, 68, 0);
      return luecken(Z(`${a} + ${b} = ${a + b}`, 'Der erste Summand ist {{a}}.', 'Der zweite Summand ist {{b}}.', 'Die Summe ist {{c}}.'), { a, b, c: [a + b, fehlerliste(a + b, [[a, 'begriffe-verwechselt'], [b, 'begriffe-verwechselt']])] },
        h3('Die Summanden werden zusammengezählt. Die Summe ist das Ergebnis.', '4 + 5 = 9: Summanden 4 und 5, Summe 9.', `Der erste Summand ist ${a}.`),
        { bild: B.streifen(a + b, [a, b]), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(2, 5) * 10 + 5, b = zz(2, 4) * 10;
      return zahl(Z(`Die Summanden sind ${a} und ${b}.`, 'Berechne die Summe.'), a + b, fehlerliste(a + b, [[a - b, 'add-subtrahiert']]),
        h3('Die Summe ist das Ergebnis der Plus-Aufgabe.', 'Summanden 20 und 30: 20 + 30 = 50.', `Rechne ${a} + ${b}.`), { bild: B.streifen(frage(a + b), [a, b]), nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = paar(21, 68, 0);
      return zuordnen(Z(`${a} + ${b} = ${a + b}`, 'Ordne jeder Zahl den Namen zu.'), [[a, 'erster Summand'], [b, 'zweiter Summand'], [a + b, 'Summe']],
        h3('Summand + Summand = Summe.', '4 + 5 = 9: 4 und 5 sind die Summanden, 9 ist die Summe.', `${a + b} ist das Ergebnis. Das Ergebnis heißt Summe.`)); },
    () => { const s = zz(6, 9) * 10, a = zz(2, 4) * 10 + 5;
      return zahl(Z(`Die Summe ist ${s}.`, `Ein Summand ist ${a}.`, 'Wie groß ist der andere Summand?'), s - a, fehlerliste(s - a, [[s + a, 'probe-falsche-umkehr']]),
        h3('Die Summe ist das Ganze. Ein Teil ist bekannt, der andere fehlt.', 'Summe 50, ein Summand 20: Der andere ist 30.', `Rechne ${s} − ${a}.`),
        { bild: B.streifen(s, [a, frage(s - a)]), nachweis: N(`${s} − ${a}`, `${a} + ${s - a}`) }); },
    () => { const [a, b] = paar(21, 68, 0), k = kind();
      return auswahl(Z(`${k} sagt:`, `„Bei ${a} + ${b} = ${a + b} ist ${a + b} ein Summand.“`, 'Stimmt das?'), [opt('Stimmt. Jede Zahl der Aufgabe ist ein Summand.', false, 'begriffe-verwechselt'), opt(`Falsch. ${a + b} ist die Summe.`, true), opt(`Falsch. ${a + b} ist die Differenz.`, false, 'begriffe-verwechselt')],
        h3('Die Summanden stehen links vom Gleichheitszeichen.', 'Bei 4 + 5 = 9 ist 9 die Summe.', `${a + b} ist das Ergebnis. Das Ergebnis heißt Summe.`)); },
  ]);
  sechs(A('A1'), 'M', [
    () => { const a = zz(21, 58) * 10, b = zz(101, 298);
      return zahl(`Berechne die Summe von ${a} und ${b}.`, a + b, fehlerliste(a + b, [[Math.abs(a - b), 'add-subtrahiert']]), h2('Die Summe ist das Ergebnis einer Addition.', `Rechne ${a} + ${b}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const s = zz(7, 9) * 100, a = zz(41, 79) * 5;
      return zahl(`Die Summe ist ${s}, ein Summand ist ${a}. Bestimme den anderen Summanden.`, s - a, fehlerliste(s - a, [[s + a, 'probe-falsche-umkehr'], [s - a + 100, 'ergaenzen-zu-viel']]), h2('Der gesuchte Summand ist das, was dem bekannten Summanden bis zur Summe fehlt.', `Rechne ${s} − ${a}.`), { nachweis: N(`${s} − ${a}`, `${a} + ${s - a}`) }); },
    () => { const a = zz(21, 39) * 10, b = zz(11, 19) * 10;
      return auswahl(`Welche Aussage passt zu ${a} + ${b} = ${a + b}?`, [opt(`${a + b} ist die Summe der Summanden ${a} und ${b}.`, true), opt(`${a} ist die Summe von ${b} und ${a + b}.`, false, 'begriffe-verwechselt'), opt(`${a + b} ist ein Summand.`, false, 'begriffe-verwechselt'), opt(`${a} und ${a + b} sind die Summanden.`, false, 'begriffe-verwechselt')],
        h2('Summand + Summand = Summe.', `Links vom Gleichheitszeichen stehen die Summanden ${a} und ${b}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(101, 198) * 5, b = zz(21, 58) * 10;
      return zahl(`Addiere ${a} zur Zahl ${b}.`, a + b, fehlerliste(a + b, [[Math.abs(a - b), 'add-subtrahiert']]), h2('Addieren heißt zusammenzählen.', `Rechne ${b} + ${a}.`), { nachweis: N(`${b} + ${a}`) }); },
    () => { const x = zz(121, 289);
      return zahl(`Beide Summanden einer Addition sind gleich groß. Die Summe ist ${2 * x}. Bestimme einen Summanden.`, x, fehlerliste(x, [[2 * x, 'sach-schritt-vergessen'], [4 * x, 'begriffe-verwechselt']]), h2('Zwei gleiche Summanden: Die Summe ist das Doppelte eines Summanden.', `Halbiere ${2 * x}.`), { nachweis: N(`${x} + ${x}`, `${2 * x} : 2`) }); },
    () => { const a = zz(3, 5) * 10, b = zz(2, 3) * 10, k = kind();
      return auswahl(`${k} behauptet: „Wird ein Summand um 10 größer und der andere um 10 kleiner, bleibt die Summe gleich.“ Beurteile die Aussage.`, [
        opt(`Richtig. Beispiel: ${a} + ${b} = ${a + b} und ${a + 10} + ${b - 10} = ${a + b}. Was der eine Summand gewinnt, verliert der andere.`, true),
        opt(`Falsch. Beispiel: ${a} + ${b} = ${a + b}, aber ${a + 10} + ${b} = ${a + b + 10}.`, false, 'sach-schritt-vergessen'),
        opt('Falsch. Die Summe wird um 20 größer.', false, 'add-subtrahiert'),
        opt('Richtig. Die Summe ändert sich nie, wenn man die Summanden verändert. Das gilt für jede Änderung.')],
      h2('Prüfe die Aussage an einem Beispiel. Verändere beide Summanden.', `Vergleiche ${a} + ${b} mit ${a + 10} + ${b - 10}.`), { nachweis: [U(true), ...N(`${a} + ${b}`, `${a + 10} + ${b - 10}`)] }); },
  ]);
  sechs(A('A1'), 'E', [
    () => { const a = zz(21, 38) * 10, b = zz(101, 198) * 5 + 2, c = wahl([500, 600]), d = zz(21, 39) * 5;
      return zahl(`Addiere zur Summe von ${a} und ${b} die Differenz von ${c} und ${d}.`, a + b + c - d, fehlerliste(a + b + c - d, [[a + b + c + d, 'add-subtrahiert'], [a + b, 'sach-schritt-vergessen']]), h1('Berechne zuerst die Summe und die Differenz getrennt.'), { nachweis: N(`${a} + ${b}`, `${c} − ${d}`, `${a + b} + ${c - d}`) }); },
    () => { const s = zz(51, 89) * 10, x = zz(3, 9) * 5, y = zz(2, 5) * 10;
      return zahl(`Die Summe zweier Zahlen ist ${s}. Der erste Summand wird um ${x} größer, der zweite um ${y} kleiner. Bestimme die neue Summe.`, s + x - y, fehlerliste(s + x - y, [[s + x + y, 'add-subtrahiert'], [s + x, 'sach-schritt-vergessen']]), h1('Jede Änderung eines Summanden ändert die Summe um denselben Betrag.'), { nachweis: N(`${s} + ${x} − ${y}`) }); },
    () => { const x = zz(41, 98);
      return sach(`Ein Summand ist doppelt so groß wie der andere. Die Summe ist ${3 * x}.`, [teil('Bestimme den kleineren Summanden.', x, null, fehlerliste(x, [[3 * x / 2, 'sach-schritt-vergessen']])), teil('Bestimme den größeren Summanden.', 2 * x)],
        h1('Der kleinere Summand steckt insgesamt dreimal in der Summe.'), { nachweis: N(`${3 * x} : 3`, `2 · ${x}`, `${x} + ${2 * x}`) }); },
    () => { const n = wahl([50, 100, 150, 200]);
      return luecken(`Summen von vier aufeinanderfolgenden Zahlen: 1 + 2 + 3 + 4 = 10, 5 + 6 + 7 + 8 = 26, 10 + 11 + 12 + 13 = 46. Stelle die Regel auf: Summe = 4 · kleinste Zahl + {{a}}. Die Summe von vier aufeinanderfolgenden Zahlen ist ${4 * n + 6}. Die kleinste Zahl ist {{b}}.`, { a: 6, b: n },
        h1('Vergleiche jede Summe mit dem Vierfachen der kleinsten Zahl.'), { nachweis: N('1 + 2 + 3 + 4', '10 − 4 · 1', '4 · 1 + 6 = 10', '5 + 6 + 7 + 8', '4 · 5 + 6 = 26', '10 + 11 + 12 + 13', '4 · 10 + 6 = 46', `(${4 * n + 6} − 6) : 4`, `4 · ${n} + 6`) }); },
    () => { const d = wahl([150, 250, 350]), k = zz(31, 42) * 10 + 5;
      return sach(`Zwei Summanden ergeben zusammen ${2 * k + d}. Der eine ist um ${d} größer als der andere.`, [teil('Bestimme den kleineren Summanden.', k), teil('Bestimme den größeren Summanden.', k + d)],
        h1('Ziehe den Unterschied von der Summe ab. Dann bleiben zwei gleich große Teile.'), { nachweis: N(`${k} + ${d}`, `${k} + ${k + d}`, `(${2 * k + d} − ${d}) : 2`) }); },
    () => auswahl('Kann die Summe zweier natürlicher Zahlen kleiner sein als einer der beiden Summanden? Wähle die richtige Begründung.', [
      opt('Nein. Zu jedem Summanden kommt etwas dazu oder nichts. Die Summe ist deshalb mindestens so groß wie jeder Summand.', true),
      opt('Ja. Bei sehr kleinen Summanden ist die Summe kleiner als der größere Summand, zum Beispiel bei 1 und 0.'),
      opt('Ja. Bei 5 + 0 ist die Summe kleiner als 5.', false, 'begriffe-verwechselt'),
      opt('Nein. Die Summe ist immer genau doppelt so groß wie ein Summand.', false, 'begriffe-verwechselt'),
      opt('Das hängt davon ab, welcher Summand vorne steht.', false, 'gesetz-auf-subtraktion')],
    h1('Überlege, was mit einem Summanden passiert, wenn 0 oder mehr als 0 dazukommt.'), { nachweis: [U(false), ...N('5 + 0')] }),
  ]);

  // =====================================================================
  // A2 Schriftlich addieren
  // =====================================================================
  sechs(A('A2'), 'F', [
    () => { const z = zz(2, 7), e = zz(2, 9);
      return zahl(Z(`Du siehst ${z} Stangen und ${e} Würfel.`, 'Welche Zahl ist das?'), 10 * z + e, fehlerliste(10 * z + e, [[10 * e + z, 'stellenwert'], [z + e, 'stellenwert']]),
        h3('Eine Stange ist 1 Zehner. Ein Würfel ist 1 Einer.', '3 Stangen und 5 Würfel: Das ist die Zahl 35.', `${z} Stangen sind ${10 * z}.`),
        { bild: B.material({ z, e }), nachweis: N(`${z} · 10 + ${e}`) }); },
    () => { const z = zz(1, 4), e = zz(11, 17);
      return sach(Z(`Du hast ${z} ${z === 1 ? 'Stange' : 'Stangen'} und ${e} Würfel.`, 'Tausche 10 Würfel in 1 Stange.'), [teil('Wie viele Stangen hast du jetzt?', z + 1), teil('Wie viele Würfel hast du jetzt?', e - 10, null, fehlerliste(e - 10, [[e, 'stellenwert']]))],
        h3('10 Würfel sind genauso viel wie 1 Stange.', '1 Stange und 12 Würfel: Nach dem Tausch sind es 2 Stangen und 2 Würfel.', `Von ${e} Würfeln gehen 10 weg. Dafür kommt 1 Stange dazu.`),
        { bild: B.material({ z, e }), nachweis: N(`${z} + 1`, `${e} − 10`) }); },
    () => { const [a, b] = paar(21, 68, 0, (x, y) => y >= 11);
      return raster(Z(`Rechne im Raster: ${a} + ${b}`, 'Beginne bei den Einern.'), '+', a, b,
        h3('Rechne jede Stelle für sich: erst die Einer, dann die Zehner.', '34 + 25: Einer 4 + 5 = 9. Zehner 3 + 2 = 5. Ergebnis 59.', `Einer: ${a % 10} + ${b % 10} = ${(a + b) % 10}.`)); },
    () => { const [a, b] = paar(211, 688, 0, (x, y) => y >= 111);
      return raster(Z(`Rechne im Raster: ${a} + ${b}`, 'Jede Stelle hat ein Feld.'), '+', a, b,
        h3('Rechne von rechts nach links: Einer, Zehner, Hunderter.', '342 + 251: Einer 2 + 1 = 3. Zehner 4 + 5 = 9. Hunderter 3 + 2 = 5. Ergebnis 593.', `Einer: ${a % 10} + ${b % 10} = ${(a + b) % 10}.`)); },
    () => { const z = zz(2, 6), e = zz(11, 16);
      return zahl(Z(`In der Tafel liegen ${z} Zehner und ${e} Einer.`, '10 Einer werden zu 1 Zehner.', 'Welche Zahl ist das?'), 10 * z + e, fehlerliste(10 * z + e, [[10 * z + e - 10, 'add-uebertrag-vergessen'], [100 * z + e, 'stellenwert']]),
        h3('Nimm 10 Plättchen bei E weg. Lege dafür 1 Plättchen bei Z dazu.', '2 Zehner und 13 Einer: Das sind 3 Zehner und 3 Einer, also 33.', `Nach dem Tausch sind es ${z + 1} Zehner und ${e - 10} Einer.`),
        { bild: B.tafel(['Z', 'E'], [z, e]), nachweis: N(`${z} · 10 + ${e}`) }); },
    () => { const [a, b] = paar(21, 68, 1, (x, y) => y >= 11 && x + y < 100);
      return raster(Z(`Rechne im Raster: ${a} + ${b}`, 'Der gemerkte Zehner ist schon eingetragen.'), '+', a, b,
        h3('Die Einer ergeben mehr als 9. Der Zehner davon steht in der Zeile „gemerkt“.', '47 + 38: Einer 7 + 8 = 15. Schreibe 5, gemerkt 1. Zehner 4 + 3 + 1 = 8. Ergebnis 85.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}. Schreibe ${(a + b) % 10} bei den Einern.`), { hilfe: true }); },
  ]);
  sechs(A('A2'), 'G', [
    () => { const [a, b] = paar(211, 688, 0, (x, y) => y >= 111);
      return zahl(Z('Addiere schriftlich.', `${a} + ${b}`), a + b, addFehler(a, b), h3('Schreibe die Zahlen genau untereinander. Beginne bei den Einern.', '342 + 251: Einer 2 + 1 = 3. Zehner 4 + 5 = 9. Hunderter 3 + 2 = 5. Ergebnis 593.', `Einer: ${a % 10} + ${b % 10} = ${(a + b) % 10}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = paar(211, 688, 1, (x, y) => y >= 111 && x % 10 + y % 10 >= 10);
      return zahl(Z('Addiere schriftlich.', `${a} + ${b}`), a + b, addFehler(a, b), h3('Ergeben die Einer mehr als 9? Dann schreibe den Übertrag 1 zu den Zehnern.', '347 + 126: Einer 7 + 6 = 13. Schreibe 3, Übertrag 1. Zehner 4 + 2 + 1 = 7. Hunderter 4. Ergebnis 473.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}. Schreibe ${(a + b) % 10}, Übertrag 1.`),
        { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map((x, i) => Number(x) + Number(String(b)[i]))), nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = paar(211, 688, 0, (x, y) => y >= 111); const s = String(a), zf = Number(s[1]);
      return luecken(Z('Welche Ziffer fehlt?', `${s[0]}{{a}}${s[2]} + ${b} = ${a + b}`), { a: zf },
        h3('Schau nur auf die Zehner.', '4▢2 + 235 = 697: Bei den Zehnern gilt ▢ + 3 = 9. Es fehlt die 6.', `Zehner: ▢ + ${Math.floor(b / 10) % 10} = ${Math.floor((a + b) / 10) % 10}.`),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${s[0]}▢${s[2]} + ${b} = ${a + b}`, ziffern: [zf] }] }); },
    () => { const [a, b] = paar(1111, 6888, 1, (x, y) => y >= 1111);
      return zahl(Z('Addiere schriftlich.', `${a} + ${b}`), a + b, addFehler(a, b), h3('Rechne Stelle für Stelle von rechts nach links. Achte auf den Übertrag.', '2845 + 1392: Einer 7. Zehner 4 + 9 = 13, schreibe 3, Übertrag 1. Hunderter 8 + 3 + 1 = 12, schreibe 2, Übertrag 1. Tausender 4. Ergebnis 4237.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = paar(211, 688, 1, (x, y) => y >= 111 && x % 10 + y % 10 >= 10 && x % 10 >= 3 && y % 10 >= 3);
      // Zwei Vergleichsaufgaben ohne Übertrag: Einer verkleinert. Alle drei Aufgaben beginnen mit einer anderen Zahl.
      const o1 = [a - a % 10 + 1, b], o2 = [a - a % 10 + 2, b - b % 10 + 1];
      if (addUebertraege(...o1) !== 0 || addUebertraege(...o2) !== 0) throw new Error('A2-G-05: Vergleichsaufgaben haben einen Übertrag');
      return sach(Z('Überlege zuerst.', 'Nur bei einer Aufgabe brauchst du einen Übertrag.', `${o1[0]} + ${o1[1]}`, `${a} + ${b}`, `${o2[0]} + ${o2[1]}`), [teil('Welche Zahl steht bei dieser Aufgabe vorne?', a, null, fehlerliste(a, [[o1[0], 'add-uebertrag-vergessen']])), teil('Rechne diese Aufgabe aus.', a + b, null, addFehler(a, b))],
        h3('Zähle in jeder Stelle die beiden Ziffern zusammen. Mehr als 9 bedeutet Übertrag.', '347 + 126: Die Einer ergeben 7 + 6 = 13. Hier brauchst du einen Übertrag.', 'Schau auf die Einer. Nur bei einer Aufgabe ergeben sie mehr als 9.'),
        { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map((x, i) => Number(x) + Number(String(b)[i]))), nachweis: [{ art: 'uebertrag', zeichen: '+', aufgaben: [[a, b], o1, o2], mit: [true, false, false] }, ...N(`${a} + ${b}`, `${o1[0]} + ${o1[1]}`, `${o2[0]} + ${o2[1]}`)] }); },
    () => { const [a, b] = paar(211, 688, 1, (x, y) => y >= 111 && x % 10 + y % 10 >= 10), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} + ${b} = ${addOhneUebertrag(a, b)}`, `Bei den Einern rechnet ${k} ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`, `${k} schreibt nur die ${(a + b) % 10} auf.`, 'Stimmt das Ergebnis?'), [opt('Stimmt. Man schreibt nur die Einer auf.', false, 'add-uebertrag-vergessen'), opt(`Falsch. Der Übertrag fehlt. Richtig ist ${a + b}.`, true), opt('Falsch. Hier muss man minus rechnen.', false, 'add-subtrahiert')],
        h3('Bei mehr als 9 Einern wandert 1 Zehner in die nächste Spalte.', '347 + 126: Einer 13. Schreibe 3, Übertrag 1. Zehner 4 + 2 + 1 = 7. Ergebnis 473.', `Zehner: ${Math.floor(a / 10) % 10} + ${Math.floor(b / 10) % 10} + 1 = ${Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 + 1}.`),
        { bild: B.tafel(['H', 'Z', 'E'], String(a).split('').map((x, i) => Number(x) + Number(String(b)[i]))), nachweis: [U(false, `${a} + ${b}`, addOhneUebertrag(a, b)), ...N(`${a} + ${b}`)] }); },
  ]);
  sechs(A('A2'), 'M', [
    () => { const [a, b] = paar(1111, 6888, 3, (x, y) => y >= 1111);
      return zahl(`Addiere schriftlich: ${a} + ${b}`, a + b, addFehler(a, b), h2('Rechne von rechts nach links und nimm jeden Übertrag in die nächste Spalte mit.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(2111, 4899), zz(1111, 3899)], ([x, y]) => addUebertraege(x, y) >= 2 && !/0/.test(`${x}${y}`)); const sa = String(a), sb = String(b);
      return luecken(`Bestimme die fehlenden Ziffern: ${sa[0]}{{a}}${sa.slice(2)} + ${sb.slice(0, 2)}{{b}}${sb[3]} = ${a + b}`, { a: Number(sa[1]), b: Number(sb[2]) },
        h2('Beginne bei den Einern und arbeite dich nach links. Beachte dabei die Überträge.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}. Bestimme jetzt die fehlende Zehnerziffer.`),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${sa[0]}▢${sa.slice(2)} + ${sb.slice(0, 2)}▢${sb[3]} = ${a + b}`, ziffern: [Number(sa[1]), Number(sb[2])] }] }); },
    () => { const sp = (n) => Number(String(n).split('').reverse().join('')), zs = [1234, 2345, 3456], d = wahl([1357, 2468, 1346]);
      return luecken(`Berechne der Reihe nach: 1234 + 4321 = {{a}}, 2345 + 5432 = {{b}}, 3456 + 6543 = {{c}}. Nutze das Muster: ${d} + ${sp(d)} = {{d}}`, { a: 5555, b: 7777, c: 9999, d: d + sp(d) },
        h2('Jede Zahl wird zu ihrer Spiegelzahl addiert. Schau, welche Ziffern in jeder Spalte zusammenkommen.', '1234 + 4321: In jeder Spalte ergeben die Ziffern 5.'), { nachweis: N(...zs.map((x) => `${x} + ${sp(x)}`), `${d} + ${sp(d)}`) }); },
    () => { const [a, b] = suche(() => [zz(3, 6) * 1000 + zz(1, 9) * 100 + zz(1, 9), zz(1111, 2999)], ([x, y]) => addUebertraege(x, y) >= 2 && x + y < 10000);
      return zahl(`Addiere schriftlich: ${a} + ${b}`, a + b, addFehler(a, b), h2('Eine Null im Summanden ändert das Verfahren nicht: Addiere die Spalte und beachte den Übertrag.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const s = zz(6, 9) * 1000 + zz(1, 9), b = zz(1111, 3999);
      return luecken(`Bestimme den fehlenden Summanden: {{a}} + ${b} = ${s}`, { a: [s - b, fehlerliste(s - b, [[s + b, 'probe-falsche-umkehr']])] }, h2('Den fehlenden Summanden findest du mit der Umkehraufgabe.', `Rechne ${s} − ${b}.`), { nachweis: N(`${s} − ${b}`, `${s - b} + ${b}`) }); },
    () => { const [a, b] = paar(2111, 4888, 3, (x, y) => y >= 1111), k = kind(), f = addOhneUebertrag(a, b);
      return auswahl(`${k} rechnet ${a} + ${b} = ${f}. Finde den Fehler.`, [
        opt(`${k} hat die Überträge nicht mitgerechnet. Richtig ist ${a + b}.`, true),
        opt(`${k} hat subtrahiert, statt zu addieren.`, false, 'add-subtrahiert'),
        opt(`${k} hat die Zahlen nicht stellengerecht untereinandergeschrieben.`, false, 'stellenwert'),
        opt('Die Rechnung ist richtig.', false, 'add-uebertrag-vergessen')],
      h2('Rechne die Einerspalte nach und vergleiche mit dem Ergebnis.', `Einer: ${a % 10} + ${b % 10} = ${a % 10 + b % 10}. Der Übertrag 1 gehört in die Zehnerspalte.`), { nachweis: [U(false, `${a} + ${b}`, f), ...N(`${a} + ${b}`)] }); },
  ]);
  sechs(A('A2'), 'E', [
    () => { const [a, b] = suche(() => [zz(3111, 6899), zz(1111, 4888)], ([x, y]) => x + y < 10000 && x % 10 + y % 10 >= 10 && Math.floor(x / 10) % 10 + Math.floor(y / 10) % 10 === 9 && Math.floor(x / 100) % 10 + Math.floor(y / 100) % 10 === 9);
      return zahl(`Addiere schriftlich: ${a} + ${b}`, a + b, addFehler(a, b), h1('Ein Übertrag kann in der nächsten Spalte einen weiteren Übertrag auslösen.'), { nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(2111, 4899), zz(1111, 3899)], ([x, y]) => addUebertraege(x, y) >= 2 && !/0/.test(`${x}${y}`)); const sa = String(a), sb = String(b), ss = String(a + b);
      return luecken(`Bestimme die fehlenden Ziffern: ${sa[0]}{{a}}${sa.slice(2)} + ${sb.slice(0, 2)}{{b}}${sb[3]} = ${ss.slice(0, 3)}{{c}}`, { a: Number(sa[1]), b: Number(sb[2]), c: Number(ss[3]) },
        h1('Beginne rechts. Jede Spalte verrät dir, ob ein Übertrag in die nächste Spalte wandert.'),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: `${sa[0]}▢${sa.slice(2)} + ${sb.slice(0, 2)}▢${sb[3]} = ${ss.slice(0, 3)}▢`, ziffern: [Number(sa[1]), Number(sb[2]), Number(ss[3])] }] }); },
    () => { const zs = wahl([[2, 0, 7, 5], [3, 0, 8, 4], [1, 0, 6, 9], [4, 0, 7, 2]]); const ab = [...zs].sort((x, y) => y - x), auf = [...zs].sort((x, y) => x - y);
      const gross = Number(ab.join('')), klein = Number([auf[1], auf[0], auf[2], auf[3]].join(''));
      return zahl(`Bilde aus den Ziffern ${zs.slice(0, 3).join(', ')} und ${zs[3]} die größte und die kleinste vierstellige Zahl. Jede Ziffer kommt genau einmal vor. Berechne die Summe der beiden Zahlen.`, gross + klein, fehlerliste(gross + klein, [[gross + Number(auf.join('')), 'stellenwert']]),
        h1('Eine vierstellige Zahl beginnt nicht mit 0.'), { nachweis: [{ art: 'extremzahlen', ziffern: zs, gross, klein }, `${gross} + ${klein} = ${gross + klein}`] }); },
    () => { const [p, q] = wahl([[3, 8], [4, 7], [5, 9], [6, 8]]);
      return luecken(`Zahl plus Spiegelzahl: 23 + 32 = 55, 41 + 14 = 55, 52 + 25 = 77. Alle Ergebnisse sind Vielfache von 11. Stelle die Regel auf: Die Summe ist 11 · (Summe der beiden Ziffern). Sage damit ${10 * p + q} + ${10 * q + p} vorher: 11 · {{a}} = {{b}}`, { a: p + q, b: 11 * (p + q) },
        h1('Teile jedes Ergebnis durch 11 und vergleiche mit den beiden Ziffern.'), { nachweis: N('23 + 32', '41 + 14', '52 + 25', '11 · 5', '11 · 7', '2 + 3 = 5', '4 + 1 = 5', '5 + 2 = 7', `${p} + ${q}`, `11 · ${p + q}`, `${10 * p + q} + ${10 * q + p}`) }); },
    () => { const d = zz(601, 1499) * 2, k = zz(1201, 2399);
      return sach(`Die Summe zweier Zahlen ist ${2 * k + d}. Die eine Zahl ist um ${d} größer als die andere.`, [teil('Bestimme die kleinere Zahl.', k), teil('Bestimme die größere Zahl.', k + d)],
        h1('Ziehe den Unterschied von der Summe ab. Dann bleiben zwei gleich große Teile.'), { nachweis: N(`(${2 * k + d} − ${d}) : 2`, `${k} + ${d}`, `${k} + ${k + d}`) }); },
    () => auswahl('Zwei dreistellige Zahlen werden schriftlich addiert. Wie viele Überträge können höchstens entstehen? Wähle die richtige Begründung.', [
      opt('Drei. Beispiel: 999 + 999 = 1998. In jeder der drei Spalten entsteht ein Übertrag.', true),
      opt('Zwei. Bei den Hundertern kann kein Übertrag mehr entstehen, weil links keine Spalte folgt.', false, 'add-uebertrag-vergessen'),
      opt('Vier. Das Ergebnis kann vierstellig sein.', false, 'stellenwert'),
      opt('Einer. Ein Übertrag entsteht nur bei den Einern.', false, 'add-uebertrag-vergessen'),
      opt('Beliebig viele. Das hängt von den Zahlen ab.')],
    h1('In jeder Spalte entsteht höchstens ein Übertrag. Zähle die Spalten.'), { nachweis: N('999 + 999') }),
  ]);

  // =====================================================================
  // A3 Mehrere Zahlen schriftlich addieren
  // =====================================================================
  sechs(A('A3'), 'F', [
    () => { const [a, b, c] = mische([2, 3, 4, 5]).slice(0, 3);
      return zahl(Z('Rechne.', `${a} + ${b} + ${c}`), a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]),
        h3('Rechne nacheinander. Folge den Sprüngen.', '3 + 2 + 4: Erst 3 + 2 = 5. Dann 5 + 4 = 9.', `${a} + ${b} = ${a + b}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b, c) }), nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const a = zz(1, 2) * 10, b = 10, c = zz(3, 8);
      return zahl(Z('Rechne.', `${a} + ${b} + ${c}`), a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]),
        h3('Rechne erst die Zehner zusammen.', '10 + 10 + 4: Erst 10 + 10 = 20. Dann 20 + 4 = 24.', `${a} + ${b} = ${a + b}.`),
        { bild: B.strahl({ von: a, bis: a + 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b, c) }), nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(11, 44), zz(11, 44), zz(11, 34)], (x) => addUebertraege(...x) === 0 && summe(x) < 100 && !/0/.test(x.join('')) && new Set(x).size === 3);
      return raster(Z(`Rechne im Raster: ${a} + ${b} + ${c}`, 'Zähle in jeder Spalte 3 Ziffern zusammen.'), '+', a, [b, c],
        h3('Rechne jede Stelle für sich: erst die Einer, dann die Zehner.', '23 + 31 + 14: Einer 3 + 1 + 4 = 8. Zehner 2 + 3 + 1 = 6. Ergebnis 68.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${(a + b + c) % 10}.`)); },
    () => { const [a, b, c] = suche(() => [zz(111, 444), zz(111, 344), zz(111, 244)], (x) => addUebertraege(...x) === 0 && summe(x) < 1000 && !/0/.test(x.join('')) && new Set(x).size === 3);
      return raster(Z(`Rechne im Raster: ${a} + ${b} + ${c}`, 'Jede Stelle hat ein Feld.'), '+', a, [b, c],
        h3('Rechne von rechts nach links: Einer, Zehner, Hunderter.', '231 + 142 + 315: Einer 1 + 2 + 5 = 8. Zehner 3 + 4 + 1 = 8. Hunderter 2 + 1 + 3 = 6. Ergebnis 688.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${(a + b + c) % 10}.`)); },
    () => { const a = zz(6, 8), c = 10 - a, b = suche(() => zz(4, 6), (x) => x !== a && x !== c);
      return auswahl(Z(`${a} + ${b} + ${c}`, 'Welche 2 Zahlen ergeben zusammen 10?'), [opt(`${a} und ${c}`, true), opt(`${a} und ${b}`), opt(`${b} und ${c}`)],
        h3('Schau auf das Feld: Welche Zahl füllt die Reihe bis 10?', '8 + 5 + 2: 8 und 2 ergeben zusammen 10.', `${a} + ${c} = 10.`),
        { bild: B.zehnerfeld(a, { dazu: c }), nachweis: N({ art: 'paarsumme', ziel: 10 }, `${a} + ${c}`, `${a} + ${b}`, `${b} + ${c}`) }); },
    () => { const a = zz(6, 8), c = 10 - a, b = suche(() => zz(3, 8), (x) => x !== a && x !== c);
      return luecken(Z(`${a} + ${b} + ${c}`, 'Zwei Zahlen ergeben zusammen 10.', 'Rechne sie zuerst zusammen.', `${a} + ${c} = {{a}}`, `Dann noch ${b} dazu: {{b}}`), { a: 10, b: 10 + b },
        h3('Mit der 10 rechnet es sich leicht.', '7 + 5 + 3: Erst 7 + 3 = 10. Dann 10 + 5 = 15.', `${a} + ${c} = 10.`),
        { bild: B.zehnerfeld(a, { dazu: c, felder: 20 }), nachweis: N(`${a} + ${c}`, `10 + ${b}`, `${a} + ${b} + ${c}`) }); },
  ]);
  sechs(A('A3'), 'G', [
    () => { const [a, b, c] = suche(() => [zz(111, 444), zz(111, 344), zz(111, 244)], (x) => addUebertraege(...x) === 0 && summe(x) < 1000 && !/0/.test(x.join('')) && new Set(x).size === 3);
      return zahl(Z('Addiere schriftlich.', `${a} + ${b} + ${c}`), a + b + c, addFehler(a, b, c), h3('Schreibe alle 3 Zahlen genau untereinander. Beginne bei den Einern.', '231 + 142 + 315: Einer 1 + 2 + 5 = 8. Zehner 3 + 4 + 1 = 8. Hunderter 2 + 1 + 3 = 6. Ergebnis 688.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${(a + b + c) % 10}.`), { nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(111, 444), zz(111, 344), zz(111, 244)], (x) => addUebertraege(...x) === 1 && summe(x.map((v) => v % 10)) >= 10 && summe(x) < 1000 && !/0/.test(x.join('')));
      return zahl(Z('Addiere schriftlich.', `${a} + ${b} + ${c}`), a + b + c, addFehler(a, b, c), h3('Ergeben die Einer mehr als 9? Dann schreibe den Übertrag zu den Zehnern.', '235 + 142 + 316: Einer 5 + 2 + 6 = 13. Schreibe 3, Übertrag 1. Zehner 3 + 4 + 1 + 1 = 9. Hunderter 6. Ergebnis 693.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${a % 10 + b % 10 + c % 10}.`),
        { bild: B.tafel(['H', 'Z', 'E'], [0, 1, 2].map((i) => summe([a, b, c].map((v) => Number(String(v)[i]))))), nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const [a, c] = suche(() => [zz(12, 38), zz(12, 38)], ([x, y]) => (x + y) % 10 === 0 && x % 10 !== 0 && x !== y), b = suche(() => zz(21, 48), (x) => x % 10 !== 0);
      return luecken(Z(`${a} + ${b} + ${c}`, 'Suche erst 2 Zahlen mit einem glatten Ergebnis.', `${a} + ${c} = {{a}}`, `Dann noch ${b} dazu: {{b}}`), { a: a + c, b: a + b + c },
        h3('Zwei Zahlen passen gut zusammen: Ihre Einer ergeben 10.', '27 + 48 + 13: Erst 27 + 13 = 40. Dann 40 + 48 = 88.', `${a} + ${c} = ${a + c}.`),
        { bild: B.streifen(frage(a + b + c), [a, c, b]), nachweis: N(`${a} + ${c}`, `${a + c} + ${b}`, `${a} + ${b} + ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(1111, 3444), zz(1111, 3444), zz(1111, 2444)], (x) => addUebertraege(...x) === 1 && summe(x) < 10000 && !/0/.test(x.join('')));
      return zahl(Z('Addiere schriftlich.', `${a} + ${b} + ${c}`), a + b + c, addFehler(a, b, c), h3('Rechne Spalte für Spalte von rechts nach links. Achte auf den Übertrag.', '1234 + 2413 + 3126: Einer 4 + 3 + 6 = 13. Schreibe 3, Übertrag 1. Zehner 3 + 1 + 2 + 1 = 7. Hunderter 7. Tausender 6. Ergebnis 6773.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${a % 10 + b % 10 + c % 10}.`), { nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const a = zz(11, 14) * 10, b = zz(21, 24) * 10, c = zz(31, 34) * 10;
      return auswahl(Z('Überlege zuerst.', 'Welche Aufgabe hat das größte Ergebnis?'), [opt(`${a} + ${b} + ${c}`, true), opt(`${a} + ${b} + ${c - 9}`), opt(`${a - 9} + ${b} + ${c}`)],
        h3('Vergleiche die Aufgaben Zahl für Zahl. Wo ist eine Zahl kleiner?', '120 + 230 + 310 ist größer als 120 + 230 + 301. Denn 310 ist größer als 301.', `${c - 9} ist kleiner als ${c}. ${a - 9} ist kleiner als ${a}.`),
        { bild: B.streifen(frage(a + b + c), [a, b, c]), nachweis: [GROESSTES, ...N(`${a} + ${b} + ${c}`, `${a} + ${b} + ${c - 9}`, `${a - 9} + ${b} + ${c}`)] }); },
    () => { const [a, b, c] = suche(() => [zz(12, 36), zz(12, 36), zz(12, 26)], (x) => summe(x.map((v) => v % 10)) >= 11 && summe(x.map((v) => v % 10)) <= 19 && summe(x) < 100 && !/0/.test(x.join(''))), k = kind(), e = a % 10 + b % 10 + c % 10;
      return auswahl(Z(`${k} rechnet: ${a} + ${b} + ${c} = ${a + b + c - 10}`, `Bei den Einern rechnet ${k} ${a % 10} + ${b % 10} + ${c % 10} = ${e}.`, `${k} schreibt nur die ${e % 10} auf.`, 'Stimmt das Ergebnis?'), [opt('Stimmt. Man schreibt nur die Einer auf.', false, 'add-uebertrag-vergessen'), opt(`Falsch. Der Übertrag fehlt. Richtig ist ${a + b + c}.`, true), opt(`Falsch. Richtig ist ${a + b + c - 20}.`, false, 'add-uebertrag-vergessen')],
        h3('Bei mehr als 9 Einern wandert 1 Zehner in die nächste Spalte.', '24 + 35 + 16: Einer 15. Schreibe 5, Übertrag 1. Zehner 2 + 3 + 1 + 1 = 7. Ergebnis 75.', `Die Einer ergeben ${e}. Der Übertrag 1 gehört zu den Zehnern.`),
        { bild: B.tafel(['Z', 'E'], [summe([a, b, c].map((v) => Math.floor(v / 10))), e]), nachweis: [U(false, `${a} + ${b} + ${c}`, a + b + c - 10), ...N(`${a} + ${b} + ${c}`)] }); },
  ]);
  sechs(A('A3'), 'M', [
    () => { const x = suche(() => [zz(1111, 3999), zz(1111, 2999), zz(1111, 2999)], (v) => addUebertraege(...v) >= 3 && summe(v) < 10000 && !/0/.test(v.join('')));
      return zahl(`Addiere schriftlich: ${x.join(' + ')}`, summe(x), addFehler(...x), h2('Bei drei Summanden kann der Übertrag auch 2 sein.', `Einer: ${x.map((v) => v % 10).join(' + ')} = ${summe(x.map((v) => v % 10))}.`), { nachweis: N(x.join(' + ')) }); },
    () => { const tage = ['Freitag', 'Samstag', 'Sonntag'], z1 = [zz(121, 189), zz(211, 289), zz(231, 298)], z2 = [zz(101, 169), zz(181, 259), zz(201, 279)];
      return tabelle('Die Tabelle zeigt die Besucherzahlen von zwei Kinos an einem Wochenende. Berechne für jedes Kino die Gesamtzahl.', ['Kino', ...tage, 'Gesamt'], [['Apollo', ...z1, L('a')], ['Scala', ...z2, L('b')]], { a: summe(z1), b: summe(z2) },
        h2('Addiere die drei Zahlen einer Zeile schriftlich.', `Apollo: ${z1[0]} + ${z1[1]} = ${z1[0] + z1[1]}. Addiere noch ${z1[2]}.`), { nachweis: N(z1.join(' + '), z2.join(' + ')) }); },
    () => { const s = zz(5, 8) * 1000, a = zz(1101, 1899), c = zz(1101, 2399);
      return luecken(`Bestimme den fehlenden Summanden: ${a} + {{a}} + ${c} = ${s}`, { a: [s - a - c, fehlerliste(s - a - c, [[s - a, 'sach-schritt-vergessen'], [s + a + c, 'probe-falsche-umkehr']])] }, h2('Addiere zuerst die bekannten Summanden. Der Rest bis zur Summe ist der gesuchte Summand.', `${a} + ${c} = ${a + c}. Ziehe diese Zahl von ${s} ab.`), { nachweis: N(`${a} + ${c}`, `${s} − ${a + c}`, `${a} + ${s - a - c} + ${c}`) }); },
    () => { const a = zz(3, 5) * 1000 + zz(11, 99), b = zz(511, 899), c = zz(1, 2) * 1000 + zz(1, 9) * 100 + zz(1, 9);
      return zahl(`Addiere schriftlich: ${a} + ${b} + ${c}`, a + b + c, addFehler(a, b, c), h2('Die Summanden haben verschieden viele Stellen. Schreibe Einer unter Einer.', `Einer: ${a % 10} + ${b % 10} + ${c % 10} = ${a % 10 + b % 10 + c % 10}.`), { nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const z = (k) => `${k}1 + ${k}2 + ${k}3`;
      return luecken(`Berechne der Reihe nach: 1 + 2 + 3 = {{a}}, ${z(1)} = {{b}}, ${z(2)} = {{c}}. Nutze das Muster: ${z(9)} = {{d}}`, { a: 6, b: 36, c: 66, d: 276 },
        h2('Vergleiche die Ergebnisse: Von Aufgabe zu Aufgabe wächst jeder Summand um 10.', '11 + 12 + 13 = 36. Jeder der drei Summanden wächst um 10, die Summe also um 30.'), { nachweis: N('1 + 2 + 3', z(1), z(2), z(9), '6 + 9 · 30 = 276') }); },
    () => { const a = 3000 + zz(11, 99), b = zz(511, 589), k = kind();
      return auswahl(`${k} soll ${a} + ${b} berechnen und schreibt ${b} so unter ${a}, dass beide Zahlen links bündig stehen. Das Ergebnis ist ${a + 10 * b}. Beurteile das Vorgehen.`, [
        opt(`Falsch. Die Zahlen stehen nicht stellengerecht untereinander. So wurde ${a} + ${10 * b} gerechnet. Richtig ist ${a + b}.`, true),
        opt('Richtig. Es kommt nur darauf an, dass in jeder Spalte zwei Ziffern stehen. Welche Stellen das sind, ist egal.', false, 'stellenwert'),
        opt(`Falsch. ${k} hat die Überträge vergessen.`, false, 'add-uebertrag-vergessen'),
        opt('Richtig. Links bündig zu schreiben ist beim Addieren üblich.', false, 'stellenwert')],
      h2('Beim schriftlichen Addieren stehen Einer unter Einern, Zehner unter Zehnern.', `Überschlage: ${runde(a, 1000)} + ${runde(b, 100)} ist ungefähr ${runde(a, 1000) + runde(b, 100)}.`), { nachweis: [U(false, `${a} + ${b}`, a + 10 * b), ...N(`${a} + ${b}`, `${a} + ${10 * b}`, `${runde(a, 1000)} + ${runde(b, 100)}`, `10 · ${b}`)] }); },
  ]);
  sechs(A('A3'), 'E', [
    () => { const x = suche(() => [zz(1111, 2999), zz(1111, 2999), zz(511, 999), zz(1111, 1999)], (v) => addUebertraege(...v) >= 3 && summe(v) < 10000);
      return zahl(`Addiere schriftlich: ${x.join(' + ')}`, summe(x), addFehler(...x), h1('Bei vier Summanden kann der Übertrag auch 2 oder 3 sein.'), { nachweis: N(x.join(' + ')) }); },
    () => { const k = wahl([10, 20, 25]), c = wahl([0, 5, 10]), q = [[8, 1, 6], [3, 5, 7], [4, 9, 2]].map((r) => r.map((v) => v * k + c)), s = 15 * k + 3 * c;
      return tabelle(`In einem Zauberquadrat ist die Summe in jeder Zeile, in jeder Spalte und in beiden Diagonalen gleich. Hier ist sie ${s}. Bestimme die fehlenden Zahlen.`, ['', '', ''], [[q[0][0], L('a'), q[0][2]], [L('b'), q[1][1], L('c')], [q[2][0], L('d'), q[2][2]]], { a: q[0][1], b: q[1][0], c: q[1][2], d: q[2][1] },
        h1('Suche eine Zeile oder Spalte, in der nur eine Zahl fehlt.'), { nachweis: N(...q.map((r) => r.join(' + ')), ...[0, 1, 2].map((i) => q.map((r) => r[i]).join(' + ')), `${q[0][0]} + ${q[1][1]} + ${q[2][2]}`, `${q[0][2]} + ${q[1][1]} + ${q[2][0]}`) }); },
    () => { const n = zz(1201, 2899);
      return zahl(`Drei aufeinanderfolgende Zahlen haben die Summe ${3 * n + 3}. Bestimme die kleinste der drei Zahlen.`, n, fehlerliste(n, [[n + 1, 'sach-schritt-vergessen']]), h1('Die Summe ist dreimal so groß wie die mittlere Zahl.'), { nachweis: N(`${3 * n + 3} : 3`, `${n + 1} − 1`, `${n + 1} + 1`, `${n} + ${n + 1} + ${n + 2}`) }); },
    () => { const n = wahl([20, 30, 40]);
      return luecken(`1 + 2 + 3 + … + 10 lässt sich geschickt berechnen: 1 + 10, 2 + 9, 3 + 8, 4 + 7 und 5 + 6 sind 5 Paare mit der Summe 11, zusammen 55. Übertrage die Regel auf 1 + 2 + 3 + … + ${n}: Es sind {{a}} Paare mit der Summe {{b}}, zusammen {{c}}.`, { a: n / 2, b: n + 1, c: n / 2 * (n + 1) },
        h1('Bilde Paare aus der kleinsten und der größten Zahl, der zweitkleinsten und der zweitgrößten und so weiter.'), { nachweis: N('1 + 10', '2 + 9', '3 + 8', '4 + 7', '5 + 6', '5 · 11', `1 + ${n}`, `${n} : 2`, `${n / 2} · ${n + 1}`) }); },
    () => { const x = zz(401, 899);
      return zahl(`Drei Summanden ergeben zusammen ${4 * x}. Zwei Summanden sind gleich groß, der dritte ist doppelt so groß wie jeder der beiden anderen. Bestimme den größten Summanden.`, 2 * x, fehlerliste(2 * x, [[x, 'sach-schritt-vergessen']]), h1('Zerlege die Summe in vier gleich große Teile.'), { nachweis: N(`${4 * x} : 4`, `2 · ${x}`, `${x} + ${x} + ${2 * x}`) }); },
    () => auswahl('„Die Summe von drei ungeraden Zahlen ist immer ungerade.“ Wähle die richtige Begründung.', [
      opt('Das stimmt immer. Zwei ungerade Zahlen ergeben zusammen eine gerade Zahl. Kommt eine ungerade dazu, wird die Summe ungerade.', true),
      opt('Das stimmt nie. 3 + 5 + 7 = 16.', false, 'add-uebertrag-vergessen'),
      opt('Das stimmt nur, wenn alle drei Zahlen verschieden sind.'),
      opt('Das stimmt immer, denn jede Summe ungerader Zahlen ist ungerade, ganz egal, wie viele Summanden es sind.', false, 'begriffe-verwechselt'),
      opt('Das stimmt nur bei einstelligen Zahlen.')],
    h1('Prüfe erst die Summe von zwei ungeraden Zahlen, zum Beispiel 3 + 5.'), { nachweis: [U(true), ...N('3 + 5', '3 + 5 + 7')] }),
  ]);

  // =====================================================================
  // A4 Überschlag und Probe
  // =====================================================================
  sechs(A('A4'), 'F', [
    () => { const n = zz(2, 8) * 10 + wahl([1, 2, 3, 7, 8, 9]), ziel = runde(n, 10), u = Math.floor(n / 10) * 10;
      return strahl('markieren', Z(`Der Punkt liegt bei ${n}.`, 'Welcher Zehner liegt am nächsten?', 'Tippe ihn an.'), zehnerStrahl(n), ziel, fehlerliste(ziel, [[ziel === u ? u + 10 : u, 'falsch-gerundet']]),
        h3('Zehner sind Zahlen wie 10, 20, 30. Zähle die Striche bis zum Zehner links und rechts.', '38: Bis 40 sind es 2 Striche, bis 30 sind es 8 Striche. Am nächsten ist 40.', `Bis ${u} sind es ${n % 10} Striche. Bis ${u + 10} sind es ${10 - n % 10} Striche.`), { nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const n = zz(2, 8) * 10 + wahl([2, 3, 4, 6, 7, 8]), u = Math.floor(n / 10) * 10, ziel = runde(n, 10);
      return auswahl(Z(`Der Punkt liegt bei ${n}.`, `Welcher Zehner liegt näher an ${n}?`), [opt(String(u), ziel === u, ziel === u ? undefined : 'falsch-gerundet'), opt(String(u + 10), ziel === u + 10, ziel === u + 10 ? undefined : 'falsch-gerundet'), opt(String(u + 5), false, 'stellenwert')],
        h3('Schau auf den Zahlenstrahl: Welcher Zehner ist näher am Punkt?', '33 liegt näher an 30 als an 40.', `Bis ${u} sind es ${n % 10} Striche. Bis ${u + 10} sind es ${10 - n % 10} Striche.`), { bild: B.strahl(zehnerStrahl(n)), nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const a = zz(6, 11), b = zz(3, 6);
      return luecken(Z(`${a} + ${b} = ${a + b}`, 'Mit Minus kommst du zurück.', `${a + b} − ${b} = {{a}}`), { a: [a, fehlerliste(a, [[a + b + b, 'sub-addiert']])] },
        h3('Minus macht Plus rückgängig. Du landest wieder am Start.', '8 + 4 = 12. Zurück mit Minus: 12 − 4 = 8.', `Springe von ${a + b} aus ${b} nach links.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b) }), nachweis: N(`${a} + ${b}`, `${a + b} − ${b}`) }); },
    () => { const n = zz(3, 8) * 10 + wahl([1, 2, 8, 9]), ziel = runde(n, 10), u = Math.floor(n / 10) * 10;
      return strahl('markieren', Z(`Der Punkt liegt bei ${n}.`, `Welcher Zehner liegt am nächsten bei ${n}?`, 'Tippe ihn an.'), zehnerStrahl(n), ziel, fehlerliste(ziel, [[ziel === u ? u + 10 : u, 'falsch-gerundet']]),
        h3('Zehner sind Zahlen wie 10, 20, 30. Der nächste Zehner ist nur wenige Striche entfernt.', '62: Bis 60 sind es nur 2 Striche. Am nächsten ist 60.', `Bis ${u} sind es ${n % 10} Striche. Bis ${u + 10} sind es ${10 - n % 10} Striche.`), { nachweis: [`${n} ≈ ${ziel}`] }); },
    () => { const a = zz(7, 9), b = zz(4, 6), k = kind();
      return luecken(Z(`${k} rechnet: ${a} + ${b} = ${a + b + 1}`, 'Prüfe mit Minus.', `${a + b + 1} − ${b} = {{a}}`, `Das ist nicht ${a}.`, `Richtig ist: ${a} + ${b} = {{b}}`), { a: a + 1, b: a + b },
        h3('Kommst du mit Minus nicht zum Start zurück? Dann ist das Ergebnis falsch.', '6 + 3 = 10? Prüfe: 10 − 3 = 7. Das ist nicht 6. Richtig ist 9.', `${a + b + 1} − ${b} = ${a + 1}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b) }), nachweis: N(`${a + b + 1} − ${b}`, `${a} + ${b}`) }); },
    () => { const a = zz(6, 9), b = zz(4, 7), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} + ${b} = ${a + b}`, 'Mit welcher Minus-Aufgabe kommst du zurück zum Start?'), [opt(`${a + b} − ${b}`, true), opt(`${a} − ${b}`, false, 'probe-falsche-umkehr'), opt(`${b} − ${a + b}`, false, 'probe-falsche-umkehr')],
        h3('Starte beim Ergebnis. Nimm weg, was dazugekommen ist.', '7 + 5 = 12. Zurück: 12 − 5 = 7.', `Das Ergebnis ist ${a + b}. Dazugekommen sind ${b}.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b) }), nachweis: N(`${a} + ${b}`, `${a + b} − ${b}`) }); },
  ]);
  sechs(A('A4'), 'G', [
    () => { const [a, b] = suche(() => [zz(21, 58), zz(21, 38)], (x) => x.every((v) => ![0, 4, 5, 6].includes(v % 10)));
      const ra = runde(a, 10), rb = runde(b, 10), fa = ra > a ? ra - 10 : ra + 10, fb = rb > b ? rb - 10 : rb + 10;
      return auswahl(Z(`Welcher Überschlag passt zu ${a} + ${b}?`), [opt(`${ra} + ${rb}`, true), opt(`${fa} + ${rb}`, false, 'falsch-gerundet'), opt(`${ra} + ${fb}`, false, 'falsch-gerundet')],
        h3('Runde beide Zahlen auf den nächsten Zehner.', '48 + 31: 48 ist fast 50, 31 ist fast 30. Der Überschlag ist 50 + 30.', `${a} liegt am nächsten bei ${ra}.`), { bild: B.strahl(zehnerStrahl(a)), nachweis: [`${a} ≈ ${ra}`, `${b} ≈ ${rb}`, ...N(`${ra} + ${rb}`)] }); },
    () => { const [a, b] = paar(21, 68, 0, (x, y) => y >= 11);
      return luecken(Z('Mache die Probe.', `${a} + ${b} = ${a + b}`, `Probe: ${a + b} − {{a}} = {{b}}`), { a: [b, fehlerliste(b, [[a + b, 'probe-falsche-umkehr']])], b: a },
        h3('Bei der Probe rechnest du zurück: Ergebnis minus die Zahl, die dazukam.', '53 + 32 = 85. Probe: 85 − 32 = 53.', `Dazugekommen ist ${b}. Rechne ${a + b} − ${b}.`), { nachweis: N(`${a} + ${b}`, `${a + b} − ${b}`) }); },
    () => { const [a, b] = suche(() => [zz(211, 589), zz(111, 389)], (x) => x.every((v) => Math.abs(v - runde(v, 100)) <= 20 && v % 100 !== 0));
      return luecken(Z('Überschlage zuerst.', `${a} + ${b}`, 'Runde beide Zahlen auf Hunderter.', '{{a}} + {{b}} = {{c}}'), { a: runde(a, 100), b: runde(b, 100), c: runde(a, 100) + runde(b, 100) },
        h3('Hunderter sind Zahlen wie 100, 200, 300. Suche den Hunderter in der Nähe.', '392 + 208: 392 ist fast 400, 208 ist fast 200. Überschlag: 400 + 200 = 600.', `${a} liegt nahe bei ${runde(a, 100)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} + ${runde(b, 100)}`)] }); },
    () => { const [a, b] = suche(() => [zz(21, 58), zz(21, 38)], (x) => x.every((v) => [1, 2, 8, 9].includes(v % 10)));
      return zahl(Z(`Überschlage: ${a} + ${b}`, 'Rechne mit den Zehnern in der Nähe.'), runde(a, 10) + runde(b, 10), fehlerliste(runde(a, 10) + runde(b, 10), [[a + b, 'ueberschlag-nicht-gerundet']]),
        h3('Beim Überschlag rechnest du mit runden Zahlen.', '39 + 42: 40 + 40 = 80.', `${a} ist fast ${runde(a, 10)}. ${b} ist fast ${runde(b, 10)}.`),
        { bild: B.strahl(zehnerStrahl(b)), nachweis: [`${a} ≈ ${runde(a, 10)}`, `${b} ≈ ${runde(b, 10)}`, ...N(`${runde(a, 10)} + ${runde(b, 10)}`)] }); },
    () => { const [a, b] = paar(21, 68, 1, (x, y) => y >= 21 && x + y < 100), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} + ${b} = ${a + b}`, `Mit welcher Rechnung macht ${k} die Probe?`), [opt(`${a + b} − ${b}`, true), opt(`${a + b} + ${b}`, false, 'probe-falsche-umkehr'), opt(`${b} − ${a}`, false, 'probe-falsche-umkehr')].filter((o, i, alle) => alle.findIndex((p) => p.text === o.text) === i),
        h3('Die Probe rechnet zurück zur ersten Zahl.', '46 + 28 = 74. Probe: 74 − 28 = 46.', `Die Probe muss wieder ${a} ergeben.`), { bild: B.streifen(a + b, [a, b]), nachweis: N(`${a} + ${b}`, `${a + b} − ${b}`) }); },
    () => { const a = zz(3, 5) * 100 - zz(1, 5), b = zz(2, 3) * 100 + zz(1, 5), k = kind(), ue = runde(a, 100) + runde(b, 100);
      return auswahl(Z(`${k} rechnet: ${a} + ${b} = ${a + b - 100}`, `Der Überschlag ist ${runde(a, 100)} + ${runde(b, 100)} = ${ue}.`, `Stimmt das Ergebnis ${a + b - 100}?`), [opt('Stimmt. Ein Überschlag ist ja nie ganz genau.', false, 'ueberschlag-nicht-gerundet'), opt(`Falsch. Es muss nahe bei ${ue} liegen. Richtig ist ${a + b}.`, true), opt(`Falsch. Es muss nahe bei ${runde(a, 100) - runde(b, 100)} liegen.`, false, 'add-subtrahiert')],
        h3('Vergleiche das Ergebnis mit dem Überschlag. Beide müssen nah beieinanderliegen.', '298 + 203: Überschlag 300 + 200 = 500. Das Ergebnis 401 ist zu weit weg. Richtig ist 501.', `Der Überschlag ist ${ue}. Das Ergebnis ${a + b - 100} ist 100 zu klein.`),
        { nachweis: [U(false, `${a} + ${b}`, a + b - 100), `${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} + ${runde(b, 100)}`, `${a} + ${b}`, `${runde(a, 100)} − ${runde(b, 100)}`)] }); },
  ]);
  sechs(A('A4'), 'M', [
    () => { const a = tausender(2500, 5500), b = tausender(1500, 3500);
      return zahl(`Überschlage: ${a} + ${b}. Runde dazu beide Zahlen auf Tausender.`, runde(a, 1000) + runde(b, 1000), fehlerliste(runde(a, 1000) + runde(b, 1000), [[a + b, 'ueberschlag-nicht-gerundet']]), h2('Runde zuerst, rechne dann im Kopf.', `${a} ≈ ${runde(a, 1000)} und ${b} ≈ ${runde(b, 1000)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} + ${runde(b, 1000)}`)] }); },
    () => { const a = tausender(2500, 5500), b = tausender(1500, 3500);
      return sach(`${kind()} hat gerechnet: ${a} + ${b} = ${a + b}.`, [teil('Berechne den Überschlag mit Zahlen, die auf Tausender gerundet sind.', runde(a, 1000) + runde(b, 1000), null, fehlerliste(runde(a, 1000) + runde(b, 1000), [[a + b, 'ueberschlag-nicht-gerundet']])), teil(`Mache die Probe: ${a + b} − ${b}`, a, null, fehlerliste(a, [[a + b + b, 'probe-falsche-umkehr']]))],
        h2('Der Überschlag prüft die Größenordnung, die Probe prüft das genaue Ergebnis.', `Überschlag: ${runde(a, 1000)} + ${runde(b, 1000)}.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} + ${runde(b, 1000)}`, `${a + b} − ${b}`, `${a} + ${b}`)] }); },
    () => { const paare = [0, 1, 2, 3].map(() => [tausender(2500, 5500), tausender(1500, 3500)]), i = zz(0, 3);
      return auswahl('Genau eine Rechnung ist falsch. Finde sie mit dem Überschlag.', paare.map(([a, b], j) => opt(`${a} + ${b} = ${a + b - (j === i ? 1000 : 0)}`, j === i, j === i ? undefined : 'ueberschlag-nicht-gerundet')),
        h2('Runde bei jeder Rechnung beide Zahlen auf Tausender und vergleiche mit dem Ergebnis.', `Erste Rechnung im Überschlag: ${runde(paare[0][0], 1000)} + ${runde(paare[0][1], 1000)} = ${runde(paare[0][0], 1000) + runde(paare[0][1], 1000)}.`), { nachweis: [{ art: 'gleichungen', falsche: true }] }); },
    () => { const [a, b] = paar(2111, 5888, 2, (x, y) => y >= 1111);
      return luecken(`Mache die Probe zu ${a} + ${b} = ${a + b}. Probe: ${a + b} − {{a}} = {{b}}`, { a: [b, fehlerliste(b, [[a + b, 'probe-falsche-umkehr']])], b: a },
        h2('Die Probe ist die Umkehraufgabe: Summe − Summand = anderer Summand.', `Ziehe von der Summe ${a + b} den Summanden ${b} ab.`), { nachweis: N(`${a} + ${b}`, `${a + b} − ${b}`) }); },
    () => { const ziel = zz(5, 7) * 1000; const r = [[ziel - 3000 + zz(60, 140), 3200 + zz(60, 120)], [ziel - 4000 + zz(20, 90), 2990 - zz(5, 30)], [ziel - 2000 + zz(5, 40), 3990 - zz(20, 60)], [ziel - 3000 + zz(150, 240), 4900 + zz(0, 40)]];
      return auswahl(`Ein Ergebnis liegt zwischen ${ziel} und ${ziel + 1000}. Entscheide mit dem Überschlag, welche Aufgabe dazu gehört.`, r.map(([a, b], j) => opt(`${a} + ${b}`, j === 0, j === 0 ? undefined : 'ueberschlag-nicht-gerundet')),
        h2('Überschlage jede Aufgabe mit gerundeten Zahlen.', `${r[0][0]} + ${r[0][1]} ist ungefähr ${runde(r[0][0], 100)} + ${runde(r[0][1], 100)}.`), { nachweis: r.map(([a, b], j) => ({ art: 'zwischen', ausdruck: `${a} + ${b}`, von: ziel, bis: ziel + 1000, gilt: j === 0 })) }); },
    () => { const a = zz(2, 4) * 1000 + zz(505, 540), b = zz(2, 3) * 1000 + zz(510, 560), ue = runde(a, 1000) + runde(b, 1000);
      return auswahl(`Zu ${a} + ${b} passt der Überschlag ${runde(a, 1000)} + ${runde(b, 1000)} = ${ue}. Das genaue Ergebnis ist ${a + b}. Erkläre, warum der Überschlag so stark abweicht.`, [
        opt(`Beide Summanden wurden aufgerundet, um ${runde(a, 1000) - a} und um ${runde(b, 1000) - b}. Beide Rundungen vergrößern die Summe.`, true),
        opt('Ein Summand wurde aufgerundet, der andere abgerundet. Das vergrößert die Summe.', false, 'falsch-gerundet'),
        opt('Der Überschlag ist falsch gerechnet.', false, 'ueberschlag-nicht-gerundet'),
        opt('Beim Überschlag darf das Ergebnis beliebig weit abweichen.')],
      h2('Prüfe für jeden Summanden: Wurde auf- oder abgerundet, und was bewirkt das für die Summe?', `${a} wurde auf ${runde(a, 1000)} aufgerundet. Das sind ${runde(a, 1000) - a} mehr.`),
        { nachweis: [`${a} ≈ ${runde(a, 1000)}`, `${b} ≈ ${runde(b, 1000)}`, ...N(`${runde(a, 1000)} + ${runde(b, 1000)}`, `${a} + ${b}`, `${runde(a, 1000)} − ${a}`, `${runde(b, 1000)} − ${b}`)] }); },
  ]);
  sechs(A('A4'), 'E', [
    () => { const [a, b] = suche(() => [zz(3001, 5899), zz(2101, 3899)], (x) => x.every((v) => Math.abs(v % 100 - 50) > 10 && v % 100 !== 0));
      return zahl(`Überschlage ${a} + ${b}. Runde beide Zahlen auf Hunderter.`, runde(a, 100) + runde(b, 100), fehlerliste(runde(a, 100) + runde(b, 100), [[a + b, 'ueberschlag-nicht-gerundet'], [runde(a, 1000) + runde(b, 1000), 'falsch-gerundet']]), h1('Auf Hunderter runden heißt: Die Zehnerziffer entscheidet.'),
        { nachweis: [`${a} ≈ ${runde(a, 100)}`, `${b} ≈ ${runde(b, 100)}`, ...N(`${runde(a, 100)} + ${runde(b, 100)}`)] }); },
    () => auswahl('Bei einem Überschlag wird ein Summand aufgerundet und der andere abgerundet. Vergleiche den Überschlag mit dem genauen Ergebnis.', [
      opt('Das hängt davon ab, welche Rundung größer ist. Die beiden Rundungsfehler gleichen sich teilweise aus.', true),
      opt('Der Überschlag ist immer größer.', false, 'falsch-gerundet'),
      opt('Der Überschlag ist immer kleiner.', false, 'falsch-gerundet'),
      opt('Beide sind immer genau gleich.', false, 'falsch-gerundet'),
      opt('Der Überschlag ist immer doppelt so ungenau wie bei zwei aufgerundeten Summanden.')],
    h1('Prüfe an zwei Beispielen: 58 + 21 mit 60 + 20 und 52 + 29 mit 50 + 30.'), { nachweis: N('58 + 21', '60 + 20', '52 + 29', '50 + 30') }),
    () => { const [a, b] = paar(3111, 5888, 2), f = wahl([10, 100]);
      return zahl(`${kind()} rechnet ${a} + ${b} und erhält ein falsches Ergebnis. Die Probe ergibt: Ergebnis − ${b} = ${a + f}. Um wie viel ist das Ergebnis zu groß?`, f, fehlerliste(f, [[a + b + f, 'sach-schritt-vergessen']]), h1('Die Probe müsste den ersten Summanden ergeben. Vergleiche.'), { nachweis: N(`${a} + ${b}`, `${a + f} − ${a}`, `${a + b + f} − ${b}`) }); },
    () => auswahl('Du willst eine Summe möglichst genau überschlagen. Stelle eine Regel für das Runden auf.', [
      opt('Runde einen Summanden auf und den anderen ab. Dann gleichen sich die Rundungsfehler teilweise aus.', true),
      opt('Runde beide Summanden auf. Dann gleichen sich die Rundungsfehler aus.', false, 'falsch-gerundet'),
      opt('Runde immer beide Summanden ab. Dann ist der Überschlag am genauesten.', false, 'falsch-gerundet'),
      opt('Runde nur den größeren Summanden. Der kleinere spielt für die Genauigkeit keine Rolle.'),
      opt('Runde beide Summanden auf dieselbe Stelle. Die Richtung ist gleichgültig.')],
    h1('Vergleiche 58 + 23 = 81 mit den Überschlägen 60 + 20, 60 + 30 und 50 + 20.'), { nachweis: N('58 + 23', '60 + 20', '60 + 30', '50 + 20') }),
    () => { const a = zz(1201, 2899), s = wahl([5000, 6000, 7000]);
      return zahl(`Bei einer Addition ist ein Summand ${a}. Die Probe lautet ${s} − ▢ = ${a}. Bestimme den anderen Summanden.`, s - a, fehlerliste(s - a, [[s + a, 'add-subtrahiert'], [s - a + 1000, 'ergaenzen-zu-viel']]), h1('Die Probe zieht von der Summe einen Summanden ab und liefert den anderen.'), { nachweis: N(`${s} − ${a}`, `${s} − ${s - a}`) }); },
    () => auswahl('Jana prüft 46 + 28 = 74 mit der Rechnung 28 + 46. Ist das eine geeignete Probe? Wähle die richtige Begründung.', [
      opt('Sie hilft nur wenig. Die Tauschaufgabe benutzt dieselben Zahlen, ein Denkfehler kann sich wiederholen. Sicherer ist 74 − 28 = 46.', true),
      opt('Nein. 28 + 46 hat ein anderes Ergebnis als 46 + 28.', false, 'gesetz-auf-subtraktion'),
      opt('Ja. Die Tauschaufgabe ist die Umkehraufgabe der Addition. Wer sie richtig rechnet, hat das Ergebnis sicher geprüft.', false, 'probe-falsche-umkehr'),
      opt('Nein. Beim Addieren darf man die Summanden nicht vertauschen.', false, 'gesetz-auf-subtraktion'),
      opt('Ja. Eine Probe muss immer eine Addition sein.', false, 'probe-falsche-umkehr')],
    h1('Eine gute Probe führt auf einem anderen Weg zurück zur Ausgangszahl.'), { nachweis: [U(false), ...N('46 + 28', '28 + 46', '74 − 28')] }),
  ]);

  // =====================================================================
  // A5 Sachaufgaben zur Addition, auch mit Tabellen und Diagrammen
  // =====================================================================
  const DAZU = [['Im Korb liegen', 'Äpfel', 'legt', 'dazu'], ['Auf dem Tisch liegen', 'Stifte', 'legt', 'dazu'], ['In der Dose sind', 'Kekse', 'legt', 'dazu'], ['Im Regal stehen', 'Bücher', 'stellt', 'dazu'], ['In der Kiste sind', 'Bälle', 'legt', 'dazu']];
  sechs(A('A5'), 'F', [
    () => { const [ort, ding, verb, zusatz] = wahl(DAZU), a = zz(6, 9), b = zz(2, 5), k = kind();
      return auswahl(Z(`${ort} ${a} ${ding}.`, `${k} ${verb} ${b} ${ding} ${zusatz}.`, 'Welche Rechnung passt?'), [opt(`${a} + ${b}`, true), opt(`${a} − ${b}`, false, 'sach-falsche-rechnung'), opt(`${b} − ${a}`, false, 'begriffe-verwechselt')],
        h3('Es werden mehr. Das ist plus.', '6 Äpfel, 3 Äpfel dazu: 6 + 3.', `Am Anfang sind es ${a}. Dann kommen ${b} dazu.`), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const [ort, ding, verb, zusatz] = wahl(DAZU), a = zz(6, 11), b = zz(3, 7), k = kind();
      return zahl(Z(`${ort} ${a} ${ding}.`, `${k} ${verb} ${b} ${ding} ${zusatz}.`, `Wie viele ${ding} sind es zusammen?`), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung']]),
        h3('Zähle alle Plättchen im Bild.', '8 Stifte, 4 Stifte dazu: 8 + 4 = 12.', `Rechne ${a} + ${b}.`), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(12, 25), b = 10;
      return zahl(Z(`Im Bus sitzen ${a} Kinder.`, `${b} Kinder steigen ein.`, 'Wie viele Kinder sitzen jetzt im Bus?'), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung'], [a + 1, 'stellenwert']]),
        h3('Einsteigen heißt: Es werden mehr.', '15 Kinder, 10 steigen ein: 15 + 10 = 25.', `Rechne ${a} + ${b}.`), { bild: B.streifen(frage(a + b), [a, b]), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(2, 4) * 10, b = zz(3, 8), k = kind();
      return zahl(Z(`${k} hat ${a} Euro.`, `${k} bekommt ${b} Euro dazu.`, `Wie viel Euro hat ${k} jetzt?`), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung']]),
        h3('Dazu bekommen heißt: Das Geld wird mehr.', '20 Euro, 4 Euro dazu: 20 + 4 = 24.', `Springe von ${a} aus ${b} weiter.`),
        { einheit: 'Euro', bild: B.strahl({ von: a - 10, bis: a + 10, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, b) }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = wahl([8, 10, 12]), b = zz(3, 6);
      return auswahl(Z(`Die Rechnung ist ${a} + ${b}.`, 'Welche Geschichte passt?'), [opt(`${a} Vögel sitzen im Baum. ${b} Vögel kommen dazu.`, true), opt(`${a} Vögel sitzen im Baum. ${b} Vögel fliegen weg.`, false, 'sach-falsche-rechnung'), opt(`${b} Bäume. In jedem Baum sitzen ${a} Vögel.`, false, 'sach-falsche-rechnung')],
        h3('Plus heißt: Es werden mehr.', '7 + 2 passt zu: 7 Kinder spielen. 2 Kinder kommen dazu.', 'Suche die Geschichte, in der etwas dazukommt.'), { bild: B.menge(a, { dazu: b }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(2, 3) * 10 + zz(1, 5), b = zz(11, 14), [k1, k2] = zweiKinder();
      return zahl(Z(`${k1} hat ${a} Sticker.`, `${k2} hat ${b} Sticker.`, 'Wie viele Sticker haben beide zusammen?'), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung']]),
        h3('Zusammen heißt plus.', '20 Sticker und 15 Sticker: 20 + 15 = 35.', `Rechne ${a} + ${b}.`), { bild: B.streifen(frage(a + b), [a, b]), nachweis: N(`${a} + ${b}`) }); },
  ]);
  sechs(A('A5'), 'G', [
    () => { const a = zz(41, 58), b = zz(2, 3) * 10, k = kind();
      return zahl(Z(`${k} hat ${a} Seiten gelesen.`, `Heute liest ${k} noch ${b} Seiten dazu.`, 'Wie viele Seiten sind es zusammen?'), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung']]),
        h3('Dazu heißt plus.', '40 Seiten und 20 Seiten dazu: 40 + 20 = 60.', `Rechne ${a} + ${b}.`), { einheit: 'Seiten', bild: B.streifen(frage(a + b), [a, b]), nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b] = paar(21, 68, 0, (x, y) => y >= 21 && x + y < 100);
      return zahl(Z(`In der Klasse 5a sind ${a} Bücher.`, `In der Klasse 5b sind ${b} Bücher.`, 'Wie viele Bücher sind es zusammen?'), a + b, fehlerliste(a + b, [[Math.abs(a - b), 'sach-falsche-rechnung']]),
        h3('Zusammen heißt plus.', '30 Bücher und 40 Bücher: 30 + 40 = 70.', `Rechne ${a} + ${b}.`), { einheit: 'Bücher', bild: B.streifen(frage(a + b), [a, b]), nachweis: N(`${a} + ${b}`) }); },
    () => { const [k1, k2] = zweiKinder(), [a, b] = paar(21, 68, 1, (x, y) => y >= 12 && y <= 29 && x + y < 100);
      return zahl(Z(`${k1} hat ${a} Karten.`, `${k2} hat ${b} Karten mehr als ${k1}.`, `Wie viele Karten hat ${k2}?`), a + b, fehlerliste(a + b, [[a - b, 'sach-falsche-rechnung'], [addOhneUebertrag(a, b), 'add-uebertrag-vergessen']]),
        h3(`Mehr als heißt: Die Zahl wird größer.`, 'Ali hat 30 Karten. Ben hat 10 mehr. Ben hat 30 + 10 = 40.', `Rechne ${a} + ${b}.`), { einheit: 'Karten', bild: B.vergleich({ name: k2, wert: frage(a + b) }, { name: k1, wert: a }, b), nachweis: N(`${a} + ${b}`) }); },
    () => { const w = [zz(11, 19), zz(21, 28), zz(12, 18), zz(22, 29)];
      return diagramm(Z('Das Diagramm zeigt die Kinder in 4 Klassen.', 'Wie viele Kinder sind in 5a und 5b zusammen?'), { titel: 'Kinder je Klasse', einheit: 'Kinder', max: 30, schritt: 10, werteZeigen: true, saeulen: [['5a', w[0]], ['5b', w[1]], ['5c', w[2]], ['5d', w[3]]] }, [teil('5a und 5b zusammen:', w[0] + w[1], 'Kinder', fehlerliste(w[0] + w[1], [[summe(w), 'sach-unnoetige-angabe']]))],
        h3('Lies die Zahlen über den Säulen 5a und 5b ab.', 'Säulen mit 12 und 20: Zusammen 12 + 20 = 32.', `5a hat ${w[0]} Kinder. 5b hat ${w[1]} Kinder.`), { nachweis: N(`${w[0]} + ${w[1]}`) }); },
    () => { const a = zz(8, 12), b = zz(3, 6), k = kind();
      return auswahl(Z(`${k} ist ${a} Jahre alt.`, `Die Schwester ist ${b} Jahre älter.`, 'Wie alt ist die Schwester?', 'Welche Rechnung passt?'), [opt(`${a} + ${b}`, true), opt(`${a} − ${b}`, false, 'sach-falsche-rechnung'), opt(`${b} − ${a}`, false, 'begriffe-verwechselt')],
        h3('Wer älter ist, hat die größere Zahl.', 'Tim ist 10. Eva ist 2 Jahre älter. Eva ist 10 + 2 = 12.', `Die Schwester ist älter als ${k}. Ihre Zahl ist größer als ${a}.`), { bild: B.vergleich({ name: 'Schwester', wert: frage(a + b) }, { name: k, wert: a }, b), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(31, 58), b = zz(12, 29), k = kind();
      return auswahl(Z(`Im Bus sind ${a} Menschen.`, `${b} Menschen steigen ein.`, `${k} rechnet ${a} − ${b} = ${a - b}.`, 'Stimmt das?'), [opt('Stimmt. Die kleinere Zahl wird abgezogen.', false, 'sach-falsche-rechnung'), opt(`Falsch. Einsteigen heißt plus. ${a} + ${b} = ${a + b}.`, true), opt(`Falsch. Man muss ${b} − ${a} rechnen.`, false, 'begriffe-verwechselt')],
        h3('Steigen Menschen ein, werden es mehr.', '40 Menschen, 10 steigen ein: 40 + 10 = 50.', `Rechne ${a} + ${b}.`), { bild: B.streifen(frage(a + b), [a, b]), nachweis: [U(false, `${a} + ${b}`, a - b), ...N(`${a} + ${b}`)] }); },
  ]);
  sechs(A('A5'), 'M', [
    () => { const a = zz(121, 289), b = zz(111, 189);
      return zahl(`Eine Radtour hat zwei Etappen: ${a} km und ${b} km. Berechne die Länge der ganzen Tour.`, a + b, fehlerliste(a + b, [[addOhneUebertrag(a, b), 'add-uebertrag-vergessen'], [a - b, 'sach-falsche-rechnung']]), h2('Beide Etappen zusammen ergeben die ganze Tour.', `Rechne ${a} + ${b}.`), { einheit: 'km', nachweis: N(`${a} + ${b}`) }); },
    () => { const z1 = [zz(21, 38), zz(31, 48), zz(15, 29)], z2 = [zz(18, 32), zz(25, 44), zz(21, 36)];
      return tabelle('Die Tabelle zeigt, wie viele Lose zwei Klassen beim Schulfest verkauft haben. Berechne die Gesamtzahl für jede Klasse.', ['Klasse', 'Freitag', 'Samstag', 'Sonntag', 'Gesamt'], [['5a', ...z1, L('a')], ['5b', ...z2, L('b')]], { a: summe(z1), b: summe(z2) },
        h2('Zu jeder Klasse gehört eine Zeile. Addiere die drei Zahlen dieser Zeile.', `5a: ${z1[0]} + ${z1[1]} = ${z1[0] + z1[1]}. Addiere noch ${z1[2]}.`), { nachweis: N(z1.join(' + '), z2.join(' + ')) }); },
    () => { const w = [zz(3, 9) * 50, zz(3, 9) * 50, zz(3, 9) * 50, zz(3, 9) * 50];
      return diagramm('Das Diagramm zeigt die Besucher eines Freibads an vier Tagen. Lies die Werte ab und rechne.', { titel: 'Besucher im Freibad', einheit: 'Besucher', max: 500, schritt: 100, hilfslinien: true, werteZeigen: false, saeulen: [['Do', w[0]], ['Fr', w[1]], ['Sa', w[2]], ['So', w[3]]] }, [teil('Besucher am Samstag und Sonntag zusammen:', w[2] + w[3], null, fehlerliste(w[2] + w[3], [[summe(w), 'sach-unnoetige-angabe']])), teil('Besucher an allen vier Tagen zusammen:', summe(w), null, fehlerliste(summe(w), [[w[2] + w[3], 'sach-schritt-vergessen']]))],
        h2('Jede Säule endet auf einer Linie oder genau in der Mitte zwischen zwei Linien.', `Samstag: ${w[2]} Besucher. Sonntag: ${w[3]} Besucher.`), { nachweis: N(`${w[2]} + ${w[3]}`, w.join(' + ')) }); },
    () => { const a = zz(41, 68), b = zz(15, 29), c = zz(12, 19);
      return zahl(`Für das Klassenfest werden ${a} Brötchen, ${b} Brezeln und ${c} Stück Kuchen bestellt. Berechne, wie viele Backwaren das zusammen sind.`, a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]), h2('Alle drei Angaben gehören zur Frage.', `${a} + ${b} = ${a + b}. Addiere noch ${c}.`), { nachweis: N(`${a} + ${b} + ${c}`) }); },
    () => { const a = zz(25, 38), b = zz(12, 19), c = zz(4, 8), k = kind();
      return auswahl(`${k} kauft ein Spiel für ${a} € und ein Buch für ${b} €. Dazu kommen ${c} € Versandkosten. ${k} hat einen Gutschein über 10 €. Welcher Rechenausdruck beschreibt den Betrag, der noch zu zahlen ist?`, [opt(`(${a} + ${b} + ${c}) − 10`, true), opt(`${a} + ${b} − (${c} + 10)`, false, 'klammer-falsch-gesetzt'), opt(`${a} + ${b} + ${c} + 10`, false, 'sach-falsche-rechnung'), opt(`${a} + ${b} − ${c} − 10`, false, 'sach-falsche-rechnung')],
        h2('Ordne jede Angabe zu: Was erhöht den Betrag, was senkt ihn?', `Spiel, Buch und Versand kosten zusammen ${a} € + ${b} € + ${c} €.`), { nachweis: N(`(${a} + ${b} + ${c}) − 10`) }); },
    () => { const geld = wahl([50, 60]), p = [zz(18, 24), zz(14, 19), geld - 30 - zz(1, 6)], k = kind(); const s = summe(p);
      if (s <= geld) throw new Error('A5-M-06: Geld reicht');
      return auswahl(`${k} hat ${geld} € und möchte drei Dinge kaufen: einen Rucksack für ${p[0]} €, ein Mäppchen für ${p[1]} € und Turnschuhe für ${p[2]} €. ${k} sagt: „Das Geld reicht.“ Beurteile die Aussage.`, [
        opt(`Falsch: ${p[0]} + ${p[1]} + ${p[2]} = ${s}. ${s - geld === 1 ? 'Es fehlt' : 'Es fehlen'} ${s - geld} €.`, true),
        opt(`Richtig: ${p[0]} + ${p[1]} = ${p[0] + p[1]}. Das ist weniger als ${geld}.`, false, 'sach-schritt-vergessen'),
        opt(`Richtig: Jeder einzelne Preis ist kleiner als ${geld} €.`, false, 'sach-schritt-vergessen'),
        opt(`Falsch: Schon der Rucksack kostet mehr als ${geld} €.`, false, 'sach-unnoetige-angabe')],
      h2('Addiere alle drei Preise und vergleiche die Summe mit dem Geld.', `${p[0]} + ${p[1]} = ${p[0] + p[1]}. Addiere noch ${p[2]}.`), { nachweis: [U(false), ...N(p.join(' + '), `${s} − ${geld}`)] }); },
  ]);
  sechs(A('A5'), 'E', [
    () => { const a = zz(121, 189), b = zz(211, 289), alter = zz(11, 14), k = kind();
      return zahl(`${k} ist ${alter} Jahre alt und sammelt Sticker. Im ersten Album kleben ${a} Sticker, im zweiten ${b}. Berechne, wie viele Sticker ${k} insgesamt eingeklebt hat.`, a + b, fehlerliste(a + b, [[a + b + alter, 'sach-unnoetige-angabe']]), h1('Nicht jede Angabe im Text wird gebraucht.'), { nachweis: [UEBERFLUESSIG(alter), ...N(`${a} + ${b}`)] }); },
    () => { const e = zz(8, 12), ki = zz(4, 6), eis = zz(2, 3), fam = wahl(['Kaya', 'Weber', 'Novak']);
      return zahl(`Familie ${fam} geht mit 2 Erwachsenen und 3 Kindern ins Museum. Der Eintritt kostet ${e} € für Erwachsene und ${ki} € für Kinder. Danach kauft jedes Kind ein Eis für ${eis} €. Berechne die Gesamtkosten.`, 2 * e + 3 * ki + 3 * eis, fehlerliste(2 * e + 3 * ki + 3 * eis, [[2 * e + 3 * ki, 'sach-schritt-vergessen'], [e + ki + eis, 'sach-schritt-vergessen']]), h1('Berechne die Kosten für Erwachsene, Kinder und Eis getrennt.'), { einheit: '€', nachweis: N(`2 · ${e}`, `3 · ${ki}`, `3 · ${eis}`, `${2 * e} + ${3 * ki} + ${3 * eis}`) }); },
    () => { const a = zz(121, 189), tage = wahl(['Montag', 'Dienstag']);
      return auswahl(`Ein Zoo zählt die Besucher. Am ${tage} kamen ${a} Besucher, am nächsten Tag doppelt so viele. Gesucht ist die Zahl aller Besucher in dieser Woche. Welche Angabe fehlt?`, [opt('die Besucherzahlen der übrigen Tage der Woche', true), opt('der Eintrittspreis', false, 'sach-unnoetige-angabe'), opt('die Zahl der Tiere im Zoo', false, 'sach-unnoetige-angabe'), opt(`Es fehlt nichts: ${a} + ${2 * a} = ${3 * a}.`, false, 'sach-schritt-vergessen'), opt('die Öffnungszeiten des Zoos', false, 'sach-unnoetige-angabe')],
        h1('Überlege, für welche Tage du Zahlen brauchst.')); },
    () => { const b = zz(15, 28), mehr = zz(8, 14), [k1, k2, k3] = mische(['Ali', 'Ben', 'Cem', 'Dana', 'Eda', 'Finn']).slice(0, 3);
      return zahl(`${k1}, ${k2} und ${k3} sammeln Kastanien. ${k1} hat ${mehr} mehr als ${k2}. ${k3} hat doppelt so viele wie ${k2}. Zusammen haben sie ${4 * b + mehr}. Bestimme, wie viele Kastanien ${k2} hat.`, b, fehlerliste(b, [[b + mehr, 'sach-schritt-vergessen'], [2 * b, 'sach-schritt-vergessen']]),
        h1(`Drücke alle drei Anzahlen durch die Anzahl von ${k2} aus.`), { nachweis: N(`${b} + ${mehr}`, `2 · ${b}`, `${b + mehr} + ${b} + ${2 * b}`, `(${4 * b + mehr} − ${mehr}) : 4`) }); },
    () => { const w = [zz(5, 9) * 50, zz(3, 6) * 50, zz(4, 8) * 50, zz(6, 9) * 50];
      return diagramm('Das Diagramm zeigt, wie viele Flaschen vier Klassen bei einer Sammelaktion abgegeben haben. Lies die Werte ab und rechne.', { titel: 'Gesammelte Flaschen', einheit: 'Flaschen', max: 500, schritt: 100, hilfslinien: true, werteZeigen: false, saeulen: [['5a', w[0]], ['5b', w[1]], ['5c', w[2]], ['5d', w[3]]] }, [teil('Flaschen in allen vier Klassen zusammen:', summe(w), null, fehlerliste(summe(w), [[summe(w.slice(0, 3)), 'sach-schritt-vergessen']])), teil('Das Ziel der Schule sind 2000 Flaschen. So viele fehlen noch:', 2000 - summe(w), null, fehlerliste(2000 - summe(w), [[2000 + summe(w), 'sach-falsche-rechnung']]))],
        h1('Lies zuerst alle vier Werte ab. Jede Säule endet auf einer Linie oder genau in der Mitte dazwischen.'), { nachweis: N(w.join(' + '), `2000 − ${summe(w)}`) }); },
    () => auswahl('Fermi-Frage: Eine Schule hat 6 Klassenstufen mit je 3 Klassen. In jeder Klasse sind etwa 25 Kinder. Wie viele Kinder besuchen die Schule ungefähr?', [opt('etwa 500', true), opt('etwa 50', false, 'sach-schritt-vergessen'), opt('etwa 150', false, 'sach-schritt-vergessen'), opt('etwa 5000', false, 'stellenwert')],
      h1('Bestimme zuerst die Zahl der Klassen. Runde am Ende auf eine glatte Zahl.'), { nachweis: N('6 · 3', '18 · 25', '450 ≈ 500') }),
  ]);
}
