// Aufgaben zum Abstecher 5.2.X1 „Römische Zahlzeichen“ (Lernziele X1 und X2) nach ADR 0015 und ADR 0030.
// X1 römische Zahlzeichen lesen, X2 Zahlen mit römischen Zahlzeichen schreiben.
// F bis 20 mit I, V und X und nur durch Zusammenzählen, G bis 100 mit IV und IX, M bis 3000 mit der Subtraktionsregel,
// E Jahreszahlen, ungültige Schreibweisen und die fehlende Null. Geschrieben wird mit sieben Tasten, nie mit der Tastatur.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, ordnen, zeichen, ROEMISCH_TASTEN, Z, N, B, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, kind, U, HILFSZAHL, roemisch, roemischNurAddiert, roemWert } from '../werkzeug.mjs';
import { EINS, zeichenwahl } from './5-2-1-zahlenstrahl.mjs';

const X_ = (kurz) => `5.2.X1-${kurz}`;
const r = roemisch;
const R = (n, extra = {}) => ({ art: 'roemisch', zeichen: r(n), wert: n, ...extra });
const NUR = { nurWert: true };
// Zahlen ohne Subtraktion (keine Ziffer 4 oder 9) und Zahlen mit Subtraktion.
const ohneAbzug = (n) => !/[49]/.test(String(n));
const mitAbzug = (n) => /[49]/.test(String(n));
const teileVon = (n) => [...r(n)].map((c) => roemWert(c));
const umgedreht = (n) => [...r(n)].reverse().join('');
// Lesen: Die Zeichenfolge steht im Text, gesucht ist die Zahl.
const lesen = (text, n, hilfen, extra = {}) => zahl(text, n, fehlerliste(n, [[roemWert(r(n)), 'roemisch-nur-addiert'], [r(n).length, 'roemisch-zeichen-verwechselt']]), hilfen, { nachweis: [R(n)], ...extra });
// Schreiben: gesucht ist die Zeichenfolge, getippt mit den sieben Tasten.
const schreiben = (text, n, hilfen, extra = {}, nachweis = []) => zeichen(text, r(n), ROEMISCH_TASTEN, [[roemischNurAddiert(n), mitAbzug(n) ? 'roemisch-nur-addiert' : 'roemisch-vier-gleiche'], [umgedreht(n), 'roemisch-falsch-abgezogen']], hilfen, { nachweis: [R(n), ...nachweis], ...extra });
const TAFEL_F = () => B.zeichentafel('X');
const TAFEL_G = () => B.zeichentafel('C');
const drei = (liste) => mische(liste).slice(0, 3);

export function roemischeZahlzeichen() {
  // =====================================================================
  // X1 Römische Zahlzeichen lesen
  // =====================================================================
  sechs(X_('X1'), 'F', [
    () => { const n = wahl([6, 7, 8]);
      return lesen(Z('Die Römer schrieben Zahlen mit Zeichen.', `Welche Zahl ist ${r(n)}?`), n,
        h3('Zähle die Werte der Zeichen zusammen. Die Werte stehen im Bild.', 'VI ist 5 + 1 = 6.', `${r(n)} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F() }); },
    () => { const n = wahl([11, 12, 13, 16]), f1 = n + 5 > 20 ? n - 5 : n + 5, f2 = r(n).length;
      return auswahl(`Welche Zahl ist ${r(n)}?`, [opt(String(n), true), opt(String(f1), false, 'roemisch-zeichen-verwechselt'), opt(String(f2), false, 'roemisch-zeichen-verwechselt')],
        h3('Jedes Zeichen hat einen Wert. Zähle die Werte zusammen.', 'XI ist 10 + 1 = 11.', `${r(n)} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F(), nachweis: [R(n)] }); },
    () => { const n = wahl([16, 17, 18]), e = n - 15;
      return luecken(Z(`Rechne den Wert von ${r(n)} aus.`, `10 + 5 + ${e} = {{a}}`), { a: [n, fehlerliste(n, [[r(n).length, 'roemisch-zeichen-verwechselt'], [n - 5, 'roemisch-zeichen-verwechselt']])] },
        h3('X ist 10 und V ist 5. Jedes I ist 1.', 'XVI ist 10 + 5 + 1 = 16.', `Rechne 15 + ${e}.`), { bild: TAFEL_F(), nachweis: [R(n), ...N(`10 + 5 + ${e}`)] }); },
    () => { const l = drei([3, 6, 7, 8, 11, 12, 15, 20]);
      return zuordnen('Welche Zahl gehört zu welchen Zeichen?', l.map((n) => [r(n), n]),
        h3('Zähle bei jeder Karte die Werte der Zeichen zusammen.', 'VII ist 5 + 1 + 1 = 7.', `${r(l[0])} ist ${teileVon(l[0]).join(' + ')}.`), { bild: TAFEL_F(), nachweis: l.map((n) => R(n)) }); },
    () => { const l = wahl([[8, 11, 6], [8, 15, 12], [13, 20, 16], [18, 20, 15], [3, 10, 7]]), max = Math.max(...l), lang = l.reduce((a, b) => (r(b).length > r(a).length ? b : a));
      return auswahl('Welche Zahl ist am größten?', l.map((n) => opt(r(n), n === max, n === lang && n !== max ? 'roemisch-zeichen-verwechselt' : undefined)),
        h3('Viele Zeichen heißen nicht große Zahl. Rechne jeden Wert aus.', 'VIII ist 8. X ist 10. Also ist X größer.', `${r(max)} ist ${max}.`), { bild: TAFEL_F(), nachweis: [{ art: 'extremwert', was: 'groesste', wert: max, system: 'roemisch' }] }); },
    () => { const n = wahl([15, 17, 18, 20, 12]);
      return lesen(Z(`Auf einem alten Stein steht ${r(n)}.`, 'Welche Zahl ist das?'), n,
        h3('Lies von links nach rechts. Zähle die Werte zusammen.', 'XII ist 10 + 1 + 1 = 12.', `${r(n)} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F() }); },
  ]);
  sechs(X_('X1'), 'G', [
    () => { const n = suche(() => zz(51, 88), (x) => ohneAbzug(x) && x % 10 !== 0);
      return lesen(Z('Hier kommen zwei neue Zeichen dazu: L und C.', `Welche Zahl ist ${r(n)}?`), n,
        h3('L ist 50. Zähle die Werte von links nach rechts zusammen.', 'LXII ist 50 + 10 + 1 + 1 = 62.', `${r(n)} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_G() }); },
    () => { const n = wahl([4, 9]);
      return lesen(Z(`Auf einer alten Uhr steht die Stunde ${r(n)}.`, 'Das kleinere Zeichen steht links.', 'Welche Stunde ist das?'), n,
        h3('Steht I links vor V oder X? Dann wird 1 abgezogen.', 'IV ist 5 − 1 = 4.', n === 4 ? 'Rechne 5 − 1.' : 'Rechne 10 − 1.'), { bild: TAFEL_G() }); },
    () => { const l = mische([4, 6, 9, 11, 14, 16, 19, 21]).slice(0, 4).sort((a, b) => a - b);
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.'), l.map(r),
        h3('Rechne zuerst jede Karte in eine Zahl um.', 'IV ist 4. VI ist 6. Also kommt IV vor VI.', `${r(l[0])} ist ${l[0]}. Das ist die kleinste Zahl.`), { bild: TAFEL_G(), nachweis: [{ art: 'ordnung', system: 'roemisch', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'roemisch-nur-addiert' }); },
    () => { const n = wahl([24, 29, 34, 39, 64, 69, 74, 79]);
      return auswahl(`Welche Zahl ist ${r(n)}?`, [opt(String(n), true), opt(String(roemWert(r(n))), false, 'roemisch-nur-addiert'), opt(String(n + 1), false)],
        h3('Schau auf das Ende. Dort steht ein kleineres Zeichen links.', 'XIV ist 10 + 4 = 14.', `Das Ende ${r(n % 10)} ist ${n % 10}.`), { nachweis: [R(n)] }); },
    () => { const z = wahl([20, 30, 60, 70]), e = wahl([4, 9]), n = z + e;
      return luecken(Z(`Zerlege ${r(n)} in zwei Teile.`, `${r(z)} ist {{a}}.`, `${r(e)} ist {{b}}.`, `Zusammen: {{a}} + {{b}} = {{c}}`.replace('{{a}} + {{b}}', `${z} + ${e}`)), { a: z, b: [e, fehlerliste(e, [[e + 2, 'roemisch-nur-addiert']])], c: [n, fehlerliste(n, [[n + 2, 'roemisch-nur-addiert']])] },
        h3('Der vordere Teil sind die Zehner. Der hintere Teil sind die Einer.', 'XXIV: XX ist 20, IV ist 4. Zusammen 24.', `${r(z)} ist ${z}. ${r(e)} ist ${e}.`), { nachweis: [R(z), R(e), R(n), ...N(`${z} + ${e}`)] }); },
    () => { const k = kind(), [n, f] = wahl([[9, 'elf'], [4, 'sechs']]);
      return auswahl(Z(`${k} liest ${r(n)} als ${f}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'roemisch-nur-addiert'), opt(`Falsch. Das I steht links und wird abgezogen. Die Zahl ist ${n}.`, true), opt(`Falsch. Die Zahl ist ${n + 1}.`, false, 'roemisch-zeichen-verwechselt')],
        h3('Wo steht das kleinere Zeichen? Links heißt abziehen.', 'XI ist 10 + 1 = 11. IX ist 10 − 1 = 9.', `In ${r(n)} steht das I links.`), { nachweis: [U(false), R(n, NUR)] }); },
  ]);
  sechs(X_('X1'), 'M', [
    () => { const n = suche(() => zz(140, 399), (x) => mitAbzug(x) && x % 10 !== 0);
      return lesen(`Welche Zahl ist ${r(n)}?`, n, h2('Suche zuerst die Stellen, an denen ein kleineres Zeichen links vor einem größeren steht. Diese beiden Zeichen gehören zusammen.', `Zerlege in Hunderter, Zehner und Einer: ${r(Math.floor(n / 100) * 100)}, ${r(Math.floor((n % 100) / 10) * 10)} und ${r(n % 10)}.`)); },
    () => { const n = suche(() => zz(1510, 1899), (x) => x % 10 !== 0);
      return lesen(`Über dem Tor eines alten Rathauses steht die Jahreszahl ${r(n)}. In welchem Jahr wurde das Tor gebaut?`, n, h2('M ist 1000 und D ist 500. Lies die Zahl Stelle für Stelle: Tausender, Hunderter, Zehner, Einer.', `Die Hunderter sind ${r(Math.floor((n % 1000) / 100) * 100)}, also ${Math.floor((n % 1000) / 100) * 100}.`)); },
    () => { const [a, b] = mische(wahl([[40, 60], [90, 110], [400, 600], [900, 1100], [88, 90], [38, 40], [388, 400]]));
      return auswahl(`Welches Zeichen passt? ${r(a)} ▢ ${r(b)}`, zeichenwahl(a, b).map((o) => (o.fehlvorstellung ? { ...o, fehlvorstellung: 'roemisch-nur-addiert' } : o)),
        h2('Rechne beide Zeichenfolgen in Zahlen um. Die Länge der Zeichenfolge sagt nichts über die Größe.', `${r(a)} ist ${a}, ${r(b)} ist ${b}.`), { nachweis: [{ art: 'vergleich', links: r(a), rechts: r(b), zeichen: a < b ? '<' : '>', system: 'roemisch' }] }); },
    () => zuordnen('Bei diesen Zahlen wird ein Zeichen abgezogen. Ordne jeder Zeichenfolge ihre Zahl zu.', [40, 90, 400, 900].map((n) => [r(n), n]),
      h2('Das linke Zeichen ist kleiner und wird vom rechten abgezogen.', 'XL ist 50 − 10, CM ist 1000 − 100.'), { nachweis: [40, 90, 400, 900].map((n) => R(n)) }),
    () => { const l = mische([[49, 51], [90, 110], [400, 600], [99, 101], [44, 46]]).slice(0, 3).flat().slice(0, 5).sort((a, b) => b - a);
      return ordnen('Ordne die Zahlen. Beginne mit der größten Zahl.', l.map(r),
        h2('Rechne jede Karte in eine Zahl um, bevor du ordnest.', `Die größte Zahl ist ${r(l[0])}, das ist ${l[0]}.`), { nachweis: [{ art: 'ordnung', system: 'roemisch', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'roemisch-nur-addiert' }); },
    () => { const [n, kurz, viele, halb] = wahl([[99, 'IC', 'LXXXXVIIII', 'XCVIIII'], [49, 'IL', 'XXXXVIIII', 'XLVIIII'], [499, 'ID', 'CCCCXCIX', 'CDXCVIIII'], [999, 'IM', 'DCCCCXCIX', 'CMXCVIIII']]);
      return auswahl(`Nur eine dieser Schreibweisen für die Zahl ${n} ist richtig. Welche?`, [opt(r(n), true), opt(kurz, false, 'roemisch-falsch-abgezogen'), opt(viele, false, 'roemisch-vier-gleiche'), opt(halb, false, 'roemisch-vier-gleiche')],
        h2('Abgezogen wird immer nur das nächstkleinere Zeichen der Reihe I, X, C. Kein Zeichen steht viermal hintereinander.', `Zerlege ${n} in Stellen und schreibe jede Stelle für sich.`), { nachweis: [{ art: 'roemischGueltig' }, R(n, NUR)] }); },
  ]);
  sechs(X_('X1'), 'E', [
    () => { const n = suche(() => zz(2040, 3999), (x) => (String(x).match(/[49]/g) ?? []).length >= 2);
      return lesen(`Welche Zahl ist ${r(n)}?`, n, h1('Zerlege die Zeichenfolge in Tausender, Hunderter, Zehner und Einer. An jeder Stelle kann ein Zeichen abgezogen sein.')); },
    () => { const a = suche(() => zz(1410, 1790), (x) => mitAbzug(x)), b = a + suche(() => zz(105, 290), (x) => x % 10 !== 0);
      return zahl(`Auf einem Denkmal steht: „Errichtet im Jahr ${r(a)}, erneuert im Jahr ${r(b)}.“ Wie viele Jahre liegen dazwischen?`, b - a, fehlerliste(b - a, [[roemWert(r(b)) - roemWert(r(a)), 'roemisch-nur-addiert']]),
        h1('Rechne beide Jahreszahlen ins Zehnersystem um. Erst dann lässt sich der Unterschied berechnen.'), { nachweis: [R(a, NUR), R(b, NUR), ...N(`${b} − ${a}`)] }); },
    () => { const gut = mische([1994, 2444, 949, 3888, 1666, 499]).slice(0, 3), [schlecht, fv] = wahl([['MIM', 'roemisch-falsch-abgezogen'], ['CCCCXL', 'roemisch-vier-gleiche'], ['MCMLL', 'roemisch-vier-gleiche'], ['MDVX', 'roemisch-falsch-abgezogen'], ['XXL', 'roemisch-falsch-abgezogen']]);
      return auswahl('Drei dieser Zeichenfolgen sind gültige römische Zahlen. Welche ist ungültig?', [...gut.map((n) => opt(r(n), false)), opt(schlecht, true)],
        h1('Prüfe drei Regeln: Kein Zeichen steht viermal hintereinander, V, L und D kommen nur einmal vor, und abgezogen wird nur I vor V oder X, X vor L oder C und C vor D oder M.'), { nachweis: [{ art: 'roemischGueltig', falsche: true }] }); },
    () => auswahl('Warum kann man mit römischen Zahlzeichen nicht schriftlich untereinander rechnen wie im Zehnersystem?', [
      opt('Die Zeichen haben keinen Stellenwert. Deshalb stehen gleiche Werte nicht untereinander.', true),
      opt('Es gibt nur sieben verschiedene Zeichen, und das sind zu wenige.', false),
      opt('Römische Zahlen sind immer länger als die Zahlen im Zehnersystem.', false, 'roemisch-zeichen-verwechselt'),
      opt('Man kann römische Zahlen nur zusammenzählen, aber nie voneinander abziehen.', false)],
    h1('Vergleiche: Im Zehnersystem bedeutet eine 5 je nach Stelle 5, 50 oder 500. Wie ist das bei dem Zeichen V?')),
    () => { const l = wahl([[1999, 2000, 2001, 1988], [2999, 3000, 3010, 2888], [999, 1000, 1100, 888]]), min = Math.min(...l);
      return auswahl('Welche dieser Zahlen ist die kleinste?', l.map((n) => opt(r(n), n === min, n === Math.max(...l) || r(n).length < 3 ? 'roemisch-zeichen-verwechselt' : undefined)),
        h1('Die kürzeste Zeichenfolge ist nicht die kleinste Zahl. Vergleiche zuerst die Tausender, dann die Hunderter.'), { nachweis: [{ art: 'extremwert', was: 'kleinste', wert: min, system: 'roemisch' }] }); },
    () => { const k = kind(), [a, b] = wahl([[8, 10], [38, 50], [88, 100], [388, 500]]);
      return auswahl(`${k} behauptet: „Von zwei römischen Zahlen ist immer die mit mehr Zeichen die größere.“ Beurteile die Aussage.`, [
        opt(`Falsch. ${r(a)} hat mehr Zeichen als ${r(b)}, ist aber die kleinere Zahl.`, true),
        opt('Stimmt. Das ist genauso wie bei der Zahl der Stellen im Zehnersystem.', false, 'roemisch-zeichen-verwechselt'),
        opt('Stimmt, solange in keiner der beiden Zahlen ein Zeichen abgezogen wird.', false, 'roemisch-zeichen-verwechselt'),
        opt('Falsch. Es ist immer die Zahl mit weniger Zeichen die größere.', false)],
      h1('Suche ein Gegenbeispiel: eine Zahl mit vielen kleinen Zeichen und eine größere Zahl mit einem einzigen Zeichen.'), { nachweis: [U(false), R(a, NUR), R(b, NUR)] }); },
  ]);

  // =====================================================================
  // X2 Zahlen mit römischen Zahlzeichen schreiben
  // =====================================================================
  sechs(X_('X2'), 'F', [
    () => { const n = wahl([6, 7, 8]);
      return schreiben(Z(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, 'Tippe die Zeichen der Reihe nach an.'), n,
        h3('Beginne mit dem größten Zeichen, das in die Zahl passt.', 'Die Zahl 6: Die 5 passt. Es fehlt noch 1. Also VI.', `In ${n} passt die 5. Es fehlen noch ${n - 5}.`), { bild: TAFEL_F() }); },
    () => { const n = wahl([11, 12, 13]);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n,
        h3('Das größte Zeichen steht links. Die kleinen Zeichen kommen danach.', 'Die Zahl 11: Die 10 passt. Es fehlt noch 1. Also XI.', `In ${n} passt die 10. Es fehlen noch ${n - 10}.`), { bild: TAFEL_F() }); },
    () => { const n = wahl([15, 16]), rest = n === 16 ? 'I' : '';
      return auswahl(`Wie schreibt man die Zahl ${n}?`, [opt(r(n), true), opt(`VX${rest}`, false, 'roemisch-falsch-abgezogen'), opt(`VVV${rest}`, false, 'roemisch-vier-gleiche')],
        h3('Das größte Zeichen steht links. V kommt nur einmal vor.', 'Die Zahl 12 ist 10 + 1 + 1. Man schreibt XII.', `${n} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F(), nachweis: [R(n)] }); },
    () => { const n = wahl([16, 17, 18]);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n,
        h3('Nimm zuerst die 10, dann die 5, dann die Einer.', 'Die Zahl 16 ist 10 + 5 + 1. Man schreibt XVI.', `${n} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F() }); },
    () => { const e = wahl([1, 2, 3]), n = 15 + e;
      return schreiben(Z(`Zähle zusammen: 10 + 5 + ${e}.`, 'Schreibe das Ergebnis mit römischen Zahlzeichen.'), n,
        h3('Für jeden Teil der Rechnung gibt es Zeichen.', '10 + 1 + 1 schreibt man XII.', `10 ist X. 5 ist V. ${e} ist ${r(e)}.`), { bild: TAFEL_F() }, N(`10 + 5 + ${e}`)); },
    () => { const n = wahl([20, 15, 8, 12]);
      return schreiben(Z(`Ein altes Buch hat ${n} Kapitel.`, 'Schreibe diese Zahl mit römischen Zahlzeichen.'), n,
        h3('Welche Zeichen ergeben zusammen die Zahl? Beginne mit dem größten.', 'Die Zahl 13 ist 10 + 1 + 1 + 1. Man schreibt XIII.', `${n} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_F() }); },
  ]);
  sechs(X_('X2'), 'G', [
    () => { const n = suche(() => zz(51, 88), (x) => ohneAbzug(x) && x % 10 !== 0);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n,
        h3('Schreibe zuerst die Zehner, dann die Einer. L ist 50.', 'Die Zahl 62: 60 ist LX, 2 ist II. Also LXII.', `${Math.floor(n / 10) * 10} ist ${r(Math.floor(n / 10) * 10)}. ${n % 10} ist ${r(n % 10)}.`), { bild: TAFEL_G() }); },
    () => { const n = wahl([4, 9, 14, 19, 24, 29]);
      return schreiben(Z(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, 'Achtung: Hier wird ein Zeichen abgezogen.'), n,
        h3('Die 4 schreibt man IV. Die 9 schreibt man IX.', 'Die Zahl 14: 10 ist X, 4 ist IV. Also XIV.', `Die Einer ${n % 10} schreibt man ${r(n % 10)}.`), { bild: TAFEL_G() }); },
    () => { const n = wahl([34, 39, 64, 69]);
      return auswahl(`Wie schreibt man die Zahl ${n}?`, [opt(r(n), true), opt(roemischNurAddiert(n), false, 'roemisch-vier-gleiche'), opt(r(n % 10 === 4 ? n + 2 : n + 2), false, 'roemisch-falsch-abgezogen')],
        h3('Kein Zeichen steht viermal hintereinander. Achte auf die Seite des I.', 'Die Zahl 24 schreibt man XXIV, nicht XXIIII.', `Die Einer ${n % 10} schreibt man ${r(n % 10)}.`), { nachweis: [R(n)] }); },
    () => { const n = wahl([30, 60, 70, 80, 100]);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n,
        h3('Für 50 gibt es das Zeichen L. Für 100 gibt es das Zeichen C.', 'Die Zahl 70 ist 50 + 10 + 10. Man schreibt LXX.', `${n} ist ${teileVon(n).join(' + ')}.`), { bild: TAFEL_G() }); },
    () => { const h = wahl([3, 8]);
      return schreiben(Z(`Auf einer alten Uhr steht die Stunde ${r(h)}.`, 'Schreibe die nächste Stunde mit römischen Zahlzeichen.'), h + 1,
        h3('Rechne zuerst in Zahlen. Schreibe dann die neue Zahl.', 'Nach der Stunde XIII kommt 14. Man schreibt XIV.', `${r(h)} ist ${h}. Die nächste Stunde ist ${h + 1}.`), {}, [R(h, NUR), EINS, ...N(`${h} + 1`)]); },
    () => { const k = kind(), [n, falsch, grund] = wahl([[4, 'IIII', 'I'], [9, 'VIIII', 'I'], [40, 'XXXX', 'X']]);
      return auswahl(Z(`${k} schreibt die Zahl ${n} so: ${falsch}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'roemisch-vier-gleiche'), opt(`Falsch. Das ${grund} steht höchstens dreimal hintereinander. Richtig ist ${r(n)}.`, true), opt(`Falsch. Richtig ist ${umgedreht(n)}.`, false, 'roemisch-falsch-abgezogen')],
        h3('Zähle gleiche Zeichen hintereinander. Mehr als drei sind nicht erlaubt.', 'Die Zahl 14 schreibt man XIV, nicht XIIII.', `Ziehe ab: ${r(n)} ist ${n}.`), { nachweis: [U(false), R(n, NUR)] }); },
  ]);
  sechs(X_('X2'), 'M', [
    () => { const n = suche(() => zz(141, 399), (x) => mitAbzug(x) && x % 10 !== 0);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n, h2('Schreibe jede Stelle für sich: erst die Hunderter, dann die Zehner, dann die Einer.', `Die Zehner ${Math.floor((n % 100) / 10) * 10} schreibt man ${r(Math.floor((n % 100) / 10) * 10) || 'gar nicht'}, die Einer ${n % 10} schreibt man ${r(n % 10)}.`)); },
    () => { const n = suche(() => zz(1610, 2025), (x) => x % 10 !== 0);
      return schreiben(`Schreibe die Jahreszahl ${n} mit römischen Zahlzeichen.`, n, h2('Beginne mit den Tausendern und arbeite dich Stelle für Stelle nach rechts.', `Die Hunderter ${Math.floor((n % 1000) / 100) * 100} schreibt man ${r(Math.floor((n % 1000) / 100) * 100) || 'gar nicht'}.`)); },
    () => { const n = wahl([440, 490, 940, 990, 409, 904]);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n, h2('400 und 900 schreibt man mit einem C links vor dem größeren Zeichen.', '400 ist CD, 900 ist CM.')); },
    () => { const n = wahl([44, 94, 444, 944]);
      return auswahl(`Wie schreibt man die Zahl ${n}?`, [opt(r(n), true), opt(roemischNurAddiert(n), false, 'roemisch-vier-gleiche'), opt(r(n - 4) + 'IIII', false, 'roemisch-vier-gleiche'), opt(r(n + 2), false, 'roemisch-falsch-abgezogen')],
        h2('Auch bei den Einern wird abgezogen. Schreibe jede Stelle für sich und prüfe, auf welcher Seite das kleinere Zeichen steht.', `Die Einer 4 schreibt man IV, die Zehner ${n % 100 - 4} schreibt man ${r(n % 100 - 4)}.`), { nachweis: [R(n)] }); },
    () => { const n = wahl([50, 100, 500, 1000, 40, 90]);
      return schreiben(`Schreibe den Vorgänger von ${r(n)} mit römischen Zahlzeichen.`, n - 1, h2('Rechne die Zahl ins Zehnersystem um, bilde den Vorgänger und schreibe ihn Stelle für Stelle.', `${r(n)} ist ${n}. Der Vorgänger ist ${n - 1}.`), {}, [R(n, NUR), ...N(`${n} − 1`)]); },
    () => { const k = kind(), [n, falsch, grund, viele] = wahl([[490, 'XD', 'Vor D darf nur C abgezogen werden', 'CCCCLXXXX'], [99, 'IC', 'Vor C darf nur X abgezogen werden', 'LXXXXVIIII'], [1990, 'MXM', 'Vor M darf nur C abgezogen werden', 'MDCCCCLXXXX'], [45, 'VL', 'Das Zeichen V wird nie abgezogen', 'XXXXV']]);
      return auswahl(`${k} schreibt die Zahl ${n} als ${falsch}. Was ist daran falsch?`, [
        opt(`${grund}. Richtig ist ${r(n)}.`, true),
        opt(`Nichts. ${falsch} ist eine kurze und gültige Schreibweise.`, false, 'roemisch-falsch-abgezogen'),
        opt(`Man darf nie abziehen. Richtig ist ${viele}.`, false, 'roemisch-vier-gleiche'),
        opt(`Die Zeichen stehen in der falschen Reihenfolge. Richtig ist ${[...falsch].reverse().join('')}.`, false, 'roemisch-falsch-abgezogen')],
      h2('Abgezogen werden nur I, X und C, und zwar jeweils nur vor den beiden nächstgrößeren Zeichen.', `Schreibe ${n} Stelle für Stelle.`), { nachweis: [R(n, NUR)] }); },
  ]);
  sechs(X_('X2'), 'E', [
    () => { const n = suche(() => zz(3040, 3999), (x) => (String(x).match(/[49]/g) ?? []).length >= 2);
      return schreiben(`Schreibe die Zahl ${n} mit römischen Zahlzeichen.`, n, h1('Schreibe Tausender, Hunderter, Zehner und Einer nacheinander. Prüfe bei jeder Stelle, ob abgezogen wird.')); },
    () => { const [s, b] = wahl([[1500, 8], [2000, 4], [2500, 6], [3000, 9], [1900, 7]]), a = s - b;
      return schreiben(`Addiere ${r(a)} und ${r(b)}. Schreibe das Ergebnis mit römischen Zahlzeichen.`, s, h1('Mit römischen Zahlzeichen lässt sich nicht stellenweise rechnen. Rechne im Zehnersystem und übersetze erst das Ergebnis zurück.'), {}, [R(a, NUR), R(b, NUR), ...N(`${a} + ${b}`)]); },
    () => { const n = wahl([2999, 3499, 1999, 3899, 2989]);
      return schreiben(`Schreibe den Nachfolger von ${r(n)} mit römischen Zahlzeichen.`, n + 1, h1('Rechne ins Zehnersystem um. Achte darauf, wie viele Stellen sich beim Nachfolger ändern.'), {}, [R(n, NUR), EINS, ...N(`${n} + 1`)]); },
    () => auswahl('Die Römer hatten sieben Zahlzeichen. Welche dieser Zahlen lässt sich damit nach den Regeln nicht schreiben?', [
      opt('Die Zahl 0, denn für „nichts“ gibt es kein Zeichen.', true),
      opt('Die Zahl 3999, denn sie ist zu groß.', false),
      opt('Die Zahl 1444, denn die Ziffer 4 kommt dreimal vor.', false, 'roemisch-vier-gleiche'),
      opt('Die Zahl 2888, denn dafür braucht man zu viele Zeichen.', false, 'roemisch-zeichen-verwechselt')],
    h1('Überlege, wozu die 0 im Zehnersystem gebraucht wird, und ob römische Zahlzeichen dafür einen Ersatz brauchen.')),
    () => { const [wort, n] = wahl([['zweistellige', 88], ['dreistellige', 888], ['vierstellige', 3888]]);
      return schreiben(`Welche ${wort} Zahl braucht die meisten römischen Zahlzeichen${n === 3888 ? ', wenn M höchstens dreimal vorkommt' : ''}? Schreibe sie mit römischen Zahlzeichen.`, n, h1('Die meisten Zeichen braucht eine Ziffer, bei der nichts abgezogen wird und kein einzelnes Zeichen reicht. Prüfe die Ziffern 3, 4, 8 und 9.')); },
    () => { const [text, n] = wahl([['Schreibe die größte Zahl, in der jedes der sieben römischen Zahlzeichen genau einmal vorkommt.', 1666], ['Schreibe die kleinste Zahl, in der jedes der sieben römischen Zahlzeichen genau einmal vorkommt.', 1444], ['Schreibe die größte Zahl, in der jedes der Zeichen I, V, X und L genau einmal vorkommt.', 66], ['Schreibe die kleinste Zahl, in der jedes der Zeichen I, V, X und L genau einmal vorkommt.', 44]]);
      return schreiben(text, n, h1(n % 100 === 66 ? 'Eine Zahl wird am größten, wenn kein Zeichen abgezogen wird.' : 'Eine Zahl wird am kleinsten, wenn so oft wie möglich ein Zeichen abgezogen wird.')); },
  ]);
}
