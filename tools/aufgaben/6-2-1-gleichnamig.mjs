// Aufgaben zu 6.2.1 „Gleichnamige Brüche addieren und subtrahieren“ (Lernziele A1, A2) nach ADR 0015 und ADR 0038.
// A1: gleichnamige Brüche addieren und subtrahieren. A2: gemischte Zahlen mit gleichem Nenner, Ergänzen zum Ganzen.
// Grilling mit Nils (2026-11-24): Das Ergebnis ist vollständig gekürzt, ein Ergebnis über 1 steht als gemischte Zahl.
// Typischer Fehler: Zähler und Nenner getrennt addieren (2⁄8 + 3⁄8 = 5⁄16), beim Abziehen mit gemischten Zahlen „größer minus kleiner“.

import { sechs, auswahl, luecken, zahl, bruch, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, fig, bild, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, plus, minus, T, U, echt, fehler, rechneB, optionen, urteil, kreis, streifen, akku, kreise, zwei, istBruch, gleich } from './6-2-rechnen.mjs';

const A1 = '6.2.1-A1', A2 = '6.2.1-A2';
// Zwei gleichnamige Brüche a⁄n und c⁄n. passt(a, c, n) wählt aus.
const paar = (nenner, passt) => { for (let i = 0; i < 500; i++) { const n = wahl(nenner), a = zz(1, n - 1), c = zz(1, n - 1); if (a !== c && passt(a, c, n)) return { n, a, c }; } return null; };
const fremd = (z, n) => ggt(z, n) === 1;
const KUCHEN = [['einer Pizza', 'der Pizza'], ['eines Kuchens', 'des Kuchens'], ['einer Torte', 'der Torte']];

export function gleichnamig() {
  // ================= A1: gleichnamige Brüche =================
  const tPlus = h3('Die Teile sind gleich groß. Zähle nur die Zähler zusammen.', `${br(2, 7)} + ${br(3, 7)} = ${br(5, 7)}, denn 2 + 3 = 5. Der Nenner bleibt 7.`, 'Rechne mit den beiden Zählern. Schreibe den Nenner ab.');
  const tMinus = h3('Die Teile sind gleich groß. Ziehe nur die Zähler voneinander ab.', `${br(5, 7)} − ${br(2, 7)} = ${br(3, 7)}, denn 5 − 2 = 3. Der Nenner bleibt 7.`, 'Rechne mit den beiden Zählern. Schreibe den Nenner ab.');
  const NF = [5, 6, 7, 8, 9, 10, 12];
  sechs(A1, 'F', [
    () => { const p = paar(NF.filter((n) => n <= 10), (a, c, n) => a + c < n); const { n, a, c } = p;
      return luecken(Z(`Kreis A zeigt ${br(a, n)}.`, `Kreis B zeigt ${br(c, n)}.`, 'Zähle die gefärbten Teile zusammen.', `${br(a, n)} + ${br(c, n)} = {{a}}⁄${n}`), { a: [a + c, fehlerliste(a + c, [[Math.abs(a - c), 'add-subtrahiert'], [n, 'bruch-teil-zu-rest']])] }, tPlus,
        { bild: zwei(kreis(a, n), kreis(c, n)), nachweis: [`${br(a, n)} + ${br(c, n)} = ${br(a + c, n)}`] }); },
    () => { const { n, a, c } = paar(NF.filter((n) => n <= 10), (a, c, n) => a + c < n && fremd(a + c, n));
      return rechneB(Z(`Kreis A zeigt ${br(a, n)}.`, `Kreis B zeigt ${br(c, n)}.`, `Rechne ${br(a, n)} + ${br(c, n)}.`), [a + c, n], [[[a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[Math.abs(a - c), n], 'add-subtrahiert']], tPlus,
        [`${br(a, n)} + ${br(c, n)} = ${br(a + c, n)}`], { bild: zwei(kreis(a, n), kreis(c, n)) }); },
    () => { const { n, a, c } = paar(NF, (a, c, n) => a + c < n && Math.abs(a - c) > 0 && fremd(a + c, n));
      return auswahl(Z(`Streifen A zeigt ${br(a, n)}.`, `Streifen B zeigt ${br(c, n)}.`, `Wie viel ist ${br(a, n)} + ${br(c, n)}?`), optionen([a + c, n], [[[a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[Math.abs(a - c), n], 'add-subtrahiert']], U), tPlus,
        { bild: zwei(streifen(a, n), streifen(c, n)), nachweis: [`${br(a, n)} + ${br(c, n)} = ${br(a + c, n)}`, WERT(br(a + c, n))] }); },
    () => { const { n, a, c } = paar(NF, (a, c) => a > c + 1);
      return luecken(Z(`Im Streifen ist ${br(a, n)} gefärbt.`, `Davon nimmst du ${br(c, n)} weg.`, `${br(a, n)} − ${br(c, n)} = {{a}}⁄${n}`), { a: [a - c, fehlerliste(a - c, [[a + c, 'sub-addiert'], [n - a, 'bruch-teil-zu-rest']])] }, tMinus,
        { bild: bild(streifen(a, n)), nachweis: [`${br(a, n)} − ${br(c, n)} = ${br(a - c, n)}`] }); },
    () => { const n = wahl([5, 6, 8, 10]), { a, c } = paar([n], (x, y) => x > y && x >= n - 2 && fremd(x - y, n)), kn = kind();
      return rechneB(Z(`Der Akku ist zu ${br(a, n)} voll.`, `${kn} spielt und verbraucht ${br(c, n)} vom ganzen Akku.`, 'Wie voll ist der Akku jetzt?'), [a - c, n], [[[a + c, n], 'sub-addiert'], [[c, n], 'sach-frage-verfehlt'], [[n - a, n], 'sach-frage-verfehlt']],
        h3('Der Akku wird leerer. Du musst abziehen.', `Der Akku ist zu ${br(4, 5)} voll. ${br(1, 5)} wird verbraucht. Dann bleibt ${br(4, 5)} − ${br(1, 5)} = ${br(3, 5)}.`, `Rechne ${br(a, n)} − ${br(c, n)}.`),
        [`${br(a, n)} − ${br(c, n)} = ${br(a - c, n)}`], { bild: bild(akku(a, n)) }); },
    () => { const { n, a, c } = paar([4, 6, 8, 9, 10, 12], (x, y, m) => x + y < m && !fremd(x + y, m)), e = kz([a + c, n]);
      return rechneB(Z(`Kreis A zeigt ${br(a, n)}.`, `Kreis B zeigt ${br(c, n)}.`, `Rechne ${br(a, n)} + ${br(c, n)}.`, 'Kürze das Ergebnis.'), e, [[[a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[Math.abs(a - c), n], 'add-subtrahiert']],
        h3('Zähle zuerst die Zähler zusammen. Kürze dann das Ergebnis.', `${br(1, 8)} + ${br(3, 8)} = ${br(4, 8)}. Gekürzt ist das ${br(1, 2)}.`, `Das Ergebnis heißt zuerst ${br(a + c, n)}. Teile Zähler und Nenner durch dieselbe Zahl.`),
        [`${br(a, n)} + ${br(c, n)} = ${br(a + c, n)}`], { bild: zwei(kreis(a, n), kreis(c, n)) }); },
  ]);
  const NG = [8, 9, 10, 12, 14, 15, 16, 18, 20];
  const tG = h3('Rechne mit den Zählern. Der Nenner bleibt gleich. Kürze am Ende.', `${br(7, 12)} − ${br(1, 12)} = ${br(6, 12)} = ${br(1, 2)}.`, 'Schreibe zuerst das Ergebnis mit dem alten Nenner. Kürze dann so weit wie möglich.');
  sechs(A1, 'G', [
    () => { const { n, a, c } = paar(NG, (x, y, m) => x + y < m && !fremd(x + y, m));
      return rechneB(Z(`Rechne ${br(a, n)} + ${br(c, n)}.`, 'Kürze das Ergebnis vollständig.'), [a + c, n], [[[a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[Math.abs(a - c), n], 'add-subtrahiert']], tG, [`${br(a, n)} + ${br(c, n)} = ${br(a + c, n)}`]); },
    () => { const { n, a, c } = paar(NG, (x, y, m) => x > y + 1 && !fremd(x - y, m));
      return rechneB(Z(`Im Streifen ist ${br(a, n)} gefärbt.`, `Rechne ${br(a, n)} − ${br(c, n)}.`, 'Kürze das Ergebnis vollständig.'), [a - c, n], [[[a + c, n], 'sub-addiert'], [[n - a, n], 'bruch-teil-zu-rest']], tG, [`${br(a, n)} − ${br(c, n)} = ${br(a - c, n)}`], { bild: bild(streifen(a, n)) }); },
    () => { const { n, a, c } = paar(NG, (x, y, m) => x + y < m && x + y > m / 2 && x > 1 && y > 2);
      return luecken(Z(`Im Streifen ist ${br(a + c, n)} gefärbt.`, 'Welcher Zähler fehlt?', `${br(a, n)} + {{a}}⁄${n} = ${br(a + c, n)}`), { a: [c, fehlerliste(c, [[2 * a + c, 'add-subtrahiert'], [n - a, 'sach-frage-verfehlt'], [a + c, 'sach-frage-verfehlt']])] },
        h3('Überlege: Wie viele Teile kommen dazu?', `${br(3, 10)} + ${br(4, 10)} = ${br(7, 10)}, denn von 3 bis 7 fehlen 4.`, `Rechne ${a + c} − ${a}.`), { bild: bild(streifen(a + c, n)), nachweis: [`${br(a + c, n)} − ${br(a, n)} = ${br(c, n)}`] }); },
    () => { const n = wahl(NG), [a, c, e] = [zz(1, 5), zz(1, 5), zz(1, 5)];
      if (a + c + e >= n || new Set([a, c, e]).size < 2) return null;
      return rechneB(Z(`Rechne ${br(a, n)} + ${br(c, n)} + ${br(e, n)}.`, 'Kürze das Ergebnis vollständig.'), [a + c + e, n], [[[a + c + e, 3 * n], 'bruch-add-zaehler-nenner'], [[a + c, n], 'sach-schritt-vergessen']],
        h3('Auch bei drei Brüchen zählst du nur die Zähler zusammen.', `${br(1, 9)} + ${br(2, 9)} + ${br(3, 9)} = ${br(6, 9)} = ${br(2, 3)}.`, `Rechne ${a} + ${c} + ${e}. Schreibe den Nenner ${n} darunter und kürze.`), [`${br(a, n)} + ${br(c, n)} + ${br(e, n)} = ${br(a + c + e, n)}`]); },
    () => { const n = wahl([8, 10]), { a, c } = paar([n], (x, y) => x > y && x >= n - 2 && !fremd(x - y, n) && x - y > 1), kn = kind(), was = wahl(['schaut ein Video', 'hört Musik', 'spielt ein Spiel']);
      return rechneB(Z(`Der Akku ist zu ${br(a, n)} voll.`, `${kn} ${was} und verbraucht ${br(c, n)} vom ganzen Akku.`, 'Wie voll ist der Akku jetzt?', 'Kürze das Ergebnis vollständig.'), [a - c, n], [[[a + c, n], 'sub-addiert'], [[c, n], 'sach-frage-verfehlt'], [[n - a, n], 'sach-frage-verfehlt']],
        h3('Der Akku wird leerer. Du musst abziehen.', `Der Akku ist zu ${br(9, 10)} voll. ${br(3, 10)} wird verbraucht. Dann bleibt ${br(9, 10)} − ${br(3, 10)} = ${br(6, 10)} = ${br(3, 5)}.`, `Rechne ${br(a, n)} − ${br(c, n)}. Kürze dann.`),
        [`${br(a, n)} − ${br(c, n)} = ${br(a - c, n)}`], { bild: bild(akku(a, n)) }); },
    () => { const { n, a, c } = paar([5, 6, 7, 8, 9, 10], (x, y, m) => x + y < m && x + y !== 2 * Math.abs(x - y)), kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `${br(a, n)} + ${br(c, n)} = ${br(...x)}`, falsch = [a + c, 2 * n];
      return urteil(Z(`${kn} rechnet: ${g(stimmt ? [a + c, n] : falsch)}`, 'Stimmt das?'), stimmt, g(stimmt ? [a + c, n] : falsch), g(stimmt ? falsch : [a + c, n]), [g([a + c + 1, n])], 'bruch-add-zaehler-nenner',
        h3('Der Nenner sagt, wie groß die Teile sind. Die Teile bleiben gleich groß.', `${br(2, 7)} + ${br(3, 7)} = ${br(5, 7)}. Der Nenner bleibt 7.`, `Prüfe: Ist der Zähler ${a} + ${c}? Ist der Nenner noch ${n}?`)); },
  ]);
  const NM = [12, 14, 15, 16, 18, 20, 21, 24, 25, 28, 30];
  sechs(A1, 'M', [
    () => { const n = wahl(NM), a = zz(6, n - 2), c = zz(2, 9), e = zz(2, 7), z = a + c - e;
      if (a + c >= 2 * n || z <= 0 || z >= n || fremd(z, n) || c === e) return null;
      return rechneB(`Berechne ${br(a, n)} + ${br(c, n)} − ${br(e, n)} und kürze vollständig.`, [z, n], [[[a + c + e, n], 'sub-addiert'], [[a + c, n], 'sach-schritt-vergessen'], [[Math.abs(a - c - e), n], 'add-subtrahiert']],
        h2('Bei gleichnamigen Brüchen rechnest du nur mit den Zählern, der Nenner bleibt.', `Rechne ${a} + ${c} − ${e}. Schreibe das Ergebnis über den Nenner ${n} und kürze.`), [`${br(a, n)} + ${br(c, n)} − ${br(e, n)} = ${br(z, n)}`]); },
    () => { const { n, a, c } = paar(NM, (x, y, m) => y > x + 2 && !fremd(y - x, m));
      return rechneB(`Welchen Bruch musst du zu ${br(a, n)} addieren, um ${br(c, n)} zu erhalten? Kürze vollständig.`, [c - a, n], [[[a + c, n], 'sub-addiert'], [[c, n], 'sach-frage-verfehlt']],
        h2('Gesucht ist der Unterschied der beiden Brüche.', `Rechne ${br(c, n)} − ${br(a, n)} und kürze das Ergebnis.`), [`${br(c, n)} − ${br(a, n)} = ${br(c - a, n)}`]); },
    () => { const n = wahl([12, 16, 18, 20, 24]), a = zz(3, 7), c = zz(2, 6), rest = n - a - c, [k1, k2] = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara']), [was] = wahl([['Kuchen'], ['Blechkuchen'], ['Apfelkuchen']]);
      if (rest < 2 || a === c) return null;
      return rechneB(`Ein ${was} ist in ${n} gleich große Stücke geschnitten. ${k1} nimmt ${br(a, n)} des Kuchens mit, ${k2} nimmt ${br(c, n)}. Welcher Bruchteil des Kuchens bleibt übrig? Kürze vollständig.`, [rest, n], [[[a + c, n], 'sach-frage-verfehlt'], [[n - a, n], 'sach-schritt-vergessen'], [[n - c, n], 'sach-schritt-vergessen']],
        h2('Der ganze Kuchen ist 1. Ziehe beide Bruchteile davon ab.', `Schreibe 1 als ${br(n, n)}. Rechne dann ${n} − ${a} − ${c} für den Zähler.`), [`1 − ${br(a, n)} − ${br(c, n)} = ${br(rest, n)}`, { art: 'teil', bruch: br(a, n), was: 'nenner', zahl: n }]); },
    () => { const { n, a, c } = paar(NM, (x, y, m) => x + y > m && x + y < 2 * m && (x + y) % m !== 0);
      return rechneB(`Berechne ${br(a, n)} + ${br(c, n)}. Schreibe das Ergebnis als gemischte Zahl und kürze vollständig.`, [a + c, n], [[[a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[Math.abs(a - c), n], 'add-subtrahiert']],
        h2('Ist der Zähler größer als der Nenner, steckt ein Ganzes im Bruch.', `Das Ergebnis heißt zuerst ${br(a + c, n)}. Wie oft passt die ${n} in die ${a + c}? Der Rest bleibt als Zähler.`), [`${br(a, n)} + ${br(c, n)} = ${T(kz([a + c, n]))}`]); },
    () => { const roh = [], n = wahl([9, 10, 12, 15, 16]);
      for (let i = 0; i < 4; i++) { const a = zz(2, n - 2), c = zz(1, n - 2), pl = wahl([true, false]); if ((!pl && a <= c) || (pl && a + c >= n) || a === c) return null; const e = pl ? a + c : a - c, stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? kz([e, n]) : wahl([[e, pl ? 2 * n : n + 1], [e + 1, n]]); if (!istBruch(x) || (!stimmt && gleich(x, [e, n]))) return null;
        const t = `${br(a, n)} ${pl ? '+' : '−'} ${br(c, n)} = ${U(x)}`; if (roh.some(([s, , k]) => s === t || k === `${pl}${Math.min(a, c)}|${Math.max(a, c)}`)) return null; roh.push([t, stimmt, `${pl}${Math.min(a, c)}|${Math.max(a, c)}`]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'bruch-add-zaehler-nenner')), h2('Rechne jede Aufgabe selbst nach. Achte darauf, ob das Ergebnis gekürzt wurde.', 'Rechne mit den Zählern und behalte den Nenner. Vergleiche dann, auch mit dem gekürzten Bruch.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
    () => auswahl('Warum bleibt der Nenner gleich, wenn du gleichnamige Brüche addierst?', mische([opt('Die Teile bleiben gleich groß, es werden nur mehr Teile.', true), opt('Der Nenner ist immer die größere Zahl und darf sich deshalb nicht ändern.', false, 'bruch-add-zaehler-nenner'), opt('Die Nenner heben sich beim Addieren gegenseitig auf.', false, 'bruch-add-zaehler-nenner'), opt('Der Nenner zählt die gefärbten Teile, und die ändern sich nicht.', false, 'bruch-vertauscht')]).slice(0, 4),
      h2('Überlege, was der Nenner bei einem Bruch angibt.', 'Stell dir Achtel einer Pizza vor: Zwei Achtel und drei Achtel sind fünf Stücke derselben Größe.'), { nachweis: [FREI('Bedeutung des Nenners beim Addieren')] }),
  ]);
  const NE = [18, 24, 28, 30, 32, 35, 36, 40, 42, 45, 48];
  sechs(A1, 'E', [
    () => { const n = wahl(NE), a = zz(10, n - 3), c = zz(5, n - 5), e = zz(3, 12), f = zz(2, 9), z = a + c - e - f;
      if (z <= n || z >= 2 * n || fremd(z, n) || z % n === 0) return null;
      return rechneB(`Berechne ${br(a, n)} + ${br(c, n)} − ${br(e, n)} − ${br(f, n)}. Gib das Ergebnis als vollständig gekürzte gemischte Zahl an.`, [z, n], [[[a + c + e + f, n], 'sub-addiert'], [[a + c - e + f, n], 'sub-klammerfehler']],
        h1('Fasse zuerst alle Zähler zusammen. Wandle erst am Ende um und kürze.'), [`${br(a, n)} + ${br(c, n)} − ${br(e, n)} − ${br(f, n)} = ${T(kz([z, n]))}`]); },
    () => { const n = wahl(NE), c = zz(7, n - 5), s = zz(n + 3, 2 * n - 3), x = s - c;
      if (x <= 0 || x >= n || fremd(x, n) || s % n === 0) return null;
      return rechneB(`Zu einem Bruch wird ${br(c, n)} addiert. Das Ergebnis ist ${T([s, n])}. Wie heißt der Bruch? Kürze vollständig.`, [x, n], [[[s + c, n], 'sub-addiert'], [[Math.abs(s - n - c), n], 'gemischt-umwandeln']],
        h1('Rechne rückwärts. Wandle die gemischte Zahl vorher in einen Bruch um.'), [`${T([s, n])} − ${br(c, n)} = ${br(x, n)}`]); },
    () => { const [z, nn] = wahl([[2, 3], [3, 4], [5, 6], [3, 5], [4, 5], [5, 8], [7, 9]]), k = wahl([4, 5, 6, 7, 8]), n = nn * k, a = zz(5, z * k - 4), c = z * k - a;
      if (n > 60 || a === c) return null;
      return luecken(`Welcher Zähler fehlt? ${br(a, n)} + {{a}}⁄${n} = ${br(z, nn)}`, { a: [c, fehlerliste(c, [[z - a > 0 ? z - a : nn, 'erweitern-nur-ein-teil'], [z * k, 'sach-schritt-vergessen'], [z * k + a, 'sub-addiert']])] },
        h1(`Erweitere ${br(z, nn)} zuerst auf den Nenner ${n}.`), { nachweis: [`${br(z, nn)} − ${br(a, n)} = ${br(c, n)}`] }); },
    () => { const n = wahl([12, 15, 16, 18, 20, 24, 25]), x = zz(5, n - 3), y = zz(2, x - 2);
      if ((x + y) >= n || !fremd(x, n) || !fremd(y, n)) return null;
      return rechneB(`Zwei gleichnamige Brüche haben die Summe ${T(kz([x + y, n]))} und die Differenz ${T(kz([x - y, n]))}. Wie heißt der größere der beiden Brüche?`, [x, n], [[[y, n], 'sach-frage-verfehlt'], [kz([x + y, n]), 'sach-schritt-vergessen'], [[2 * x, n], 'sach-schritt-vergessen']],
        h1('Addierst du Summe und Differenz, erhältst du das Doppelte des größeren Bruchs.'), [`(${T(kz([x + y, n]))} + ${T(kz([x - y, n]))}) : 2 = ${br(x, n)}`]); },
    () => { const n = wahl([20, 24, 25, 30, 40]), voll = zz(n - 4, n - 1), a = zz(3, 8), c = zz(2, 7), dazu = zz(2, 5), z = voll - a - c + dazu;
      if (z <= 0 || z >= n || fremd(z, n) || a === c) return null;
      return rechneB(`Ein Akku ist morgens zu ${br(voll, n)} geladen. Am Vormittag werden ${br(a, n)} der ganzen Ladung verbraucht, am Nachmittag ${br(c, n)}. Danach wird der Akku kurz um ${br(dazu, n)} nachgeladen. Wie voll ist er jetzt? Kürze vollständig.`, [z, n], [[[voll - a - c, n], 'sach-schritt-vergessen'], [[voll - a - c - dazu, n], 'sach-falsche-rechnung'], [[a + c, n], 'sach-frage-verfehlt']],
        h1('Schreibe eine einzige Rechnung auf: Was verbraucht wird, ziehst du ab. Was geladen wird, kommt dazu.'), [`${br(voll, n)} − ${br(a, n)} − ${br(c, n)} + ${br(dazu, n)} = ${br(z, n)}`]); },
    () => { const roh = [], n = wahl([12, 15, 18, 20, 24]);
      for (let i = 0; i < 5; i++) { const a = zz(5, n - 1), c = zz(3, n - 1), pl = wahl([true, false]); if ((!pl && a <= c) || a === c) return null; const e = pl ? a + c : a - c, stimmt = i < 2 ? i === 0 : wahl([true, false]);
        if (e % n === 0) return null;
        const x = stimmt ? kz([e, n]) : wahl([kz([e + n, n]), [e, pl ? 2 * n : n - 1], kz([e + 1, n])]); if (!istBruch(x) || (!stimmt && gleich(x, [e, n]))) return null;
        const t = `${br(a, n)} ${pl ? '+' : '−'} ${br(c, n)} = ${T(x)}`; if (roh.some(([s]) => s === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-umwandeln')), h1('Wandle die gemischten Zahlen in Brüche um oder kürze die Ergebnisse, bevor du vergleichst.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);

  // ================= A2: gemischte Zahlen, Ergänzen zum Ganzen =================
  const tErg = h3('Ein Ganzes hat so viele Teile, wie der Nenner sagt.', `Von ${br(3, 8)} bis zum Ganzen fehlen ${br(5, 8)}, denn 3 + 5 = 8.`, 'Zähle die weißen Teile im Bild.');
  const tGem = h3('Rechne die Ganzen und die Brüche einzeln.', `${T([5, 4])} + ${br(2, 4)} = ${T([7, 4])}. Das Ganze bleibt, die Viertel werden mehr.`, 'Rechne zuerst mit den Brüchen. Schreibe dann die Ganzen davor.');
  sechs(A2, 'F', [
    () => { const n = wahl([4, 5, 6, 8, 10]), a = zz(1, n - 1);
      return luecken(Z(`Im Kreis ist ${br(a, n)} gefärbt.`, 'Wie viel fehlt bis zum Ganzen?', `${br(a, n)} + {{a}}⁄${n} = 1`), { a: [n - a, fehlerliste(n - a, [[a, 'bruch-teil-zu-rest'], [n, 'bruch-ganzes-teil']])] }, tErg, { bild: bild(kreis(a, n)), nachweis: [`1 − ${br(a, n)} = ${br(n - a, n)}`] }); },
    () => { const [a, n] = echt([3, 4, 5, 6, 7, 8, 9, 10]);
      return rechneB(Z(`Im Streifen ist ${br(a, n)} gefärbt.`, `Rechne 1 − ${br(a, n)}.`), [n - a, n], [[[a, n], 'bruch-teil-zu-rest'], [[1, n], 'bruch-ganzes-teil']],
        h3('Das Ganze sind alle Teile des Streifens.', `1 − ${br(2, 5)} = ${br(3, 5)}, denn 1 ist dasselbe wie ${br(5, 5)}.`, 'Zähle die weißen Teile im Streifen.'), [`1 − ${br(a, n)} = ${br(n - a, n)}`], { bild: bild(streifen(a, n)) }); },
    () => { const n = wahl([4, 5, 6, 8]), a = zz(1, n - 2), c = zz(1, n - 1 - a);
      if (!fremd(a + c, n)) return null;
      return rechneB(Z(`Bild A zeigt ${T([n + a, n])}.`, `Bild B zeigt ${br(c, n)}.`, `Rechne ${T([n + a, n])} + ${br(c, n)}.`), [n + a + c, n], [[[a + c, n], 'sach-schritt-vergessen'], [[n + a + c, 2 * n], 'bruch-add-zaehler-nenner']], tGem,
        [`${T([n + a, n])} + ${br(c, n)} = ${T([n + a + c, n])}`], { bild: zwei(kreise([n + a, n]), kreis(c, n)) }); },
    () => { const n = wahl([4, 5, 6]), a = zz(1, n - 2), c = zz(1, n - 1 - a), e = [2 * n + a, n], f = [n + c, n], s = plus(e, f);
      if (!fremd(a + c, n)) return null;
      return auswahl(Z(`Bild A zeigt ${T(e)}.`, `Bild B zeigt ${T(f)}.`, `Wie viel ist ${T(e)} + ${T(f)}?`), optionen(s, [[[3 * n + a + c, 2 * n], 'bruch-add-zaehler-nenner'], [[2 * n + a + c, n], 'sach-schritt-vergessen']]), tGem,
        { bild: zwei(kreise(e), kreise(f)), nachweis: [`${T(e)} + ${T(f)} = ${T(s)}`, WERT(T(s))] }); },
    () => { const n = wahl([3, 5, 7]), a = zz(2, n - 1), c = zz(1, a - 1), [was] = wahl(KUCHEN), ding = was.includes('Pizza') ? 'Pizzen' : was.includes('Torte') ? 'Torten' : 'Kuchen';
      if (!fremd(a - c, n) || !fremd(a, n) || !fremd(c, n)) return null;
      return rechneB(Z(`Auf dem Tisch stehen ${T([n + a, n])} ${ding}.`, `Die Kinder essen davon ${br(c, n)} ${ding}.`, 'Wie viel bleibt übrig?'), [n + a - c, n], [[[n + a + c, n], 'sub-addiert'], [[a - c, n], 'sach-schritt-vergessen']],
        h3('Es wird gegessen. Du musst abziehen.', `${T([7, 4])} − ${br(2, 4)} = ${T([5, 4])}. Das Ganze bleibt, von den Vierteln gehen zwei weg.`, `Rechne ${a} − ${c} für den Zähler. Das Ganze bleibt.`),
        [`${T([n + a, n])} − ${br(c, n)} = ${T([n + a - c, n])}`], { bild: bild(kreise([n + a, n])) }); },
    () => { const n = wahl([4, 6, 8, 10]), a = zz(1, n - 1), e = kz([n - a, n]);
      return rechneB(Z(`Das Bild zeigt ${T([n + a, n])}.`, `Wie viel fehlt bis 2?`, 'Kürze das Ergebnis.'), e, [[[a, n], 'bruch-teil-zu-rest'], [[2 * n - a, n], 'gemischt-umwandeln']],
        h3('Der erste Kreis ist schon voll. Schau auf den zweiten Kreis.', `Von ${T([5, 4])} bis 2 fehlen ${br(3, 4)}.`, 'Zähle die weißen Teile im zweiten Kreis. Kürze den Bruch, wenn es geht.'), [`2 − ${T([n + a, n])} = ${br(n - a, n)}`], { bild: bild(kreise([n + a, n])) }); },
  ]);
  const tUm = h3('Reicht der Bruch nicht, dann wandle ein Ganzes um.', `${T([9, 4])} − ${br(3, 4)}: Schreibe ${T([9, 4])} als ${br(9, 4)}. Dann ${br(9, 4)} − ${br(3, 4)} = ${br(6, 4)} = ${T([3, 2])}.`, 'Schreibe die gemischte Zahl als Bruch. Rechne dann mit den Zählern.');
  sechs(A2, 'G', [
    () => { const n = wahl([5, 6, 7, 8, 9, 10, 12]), a = zz(2, n - 1), c = zz(2, n - 1), g1 = zz(1, 3), g2 = zz(1, 3), s = [(g1 + g2) * n + a + c, n];
      if (a + c <= n) return null;
      return rechneB(Z(`Rechne ${T([g1 * n + a, n])} + ${T([g2 * n + c, n])}.`, 'Kürze das Ergebnis vollständig.'), s, [[[(g1 + g2) * n + a + c - n, n], 'gemischt-umwandeln'], [[(g1 + g2) * 2 * n + a + c, 2 * n], 'bruch-add-zaehler-nenner']],
        h3('Rechne die Ganzen und die Brüche einzeln. Aus zu vielen Teilen wird ein neues Ganzes.', `${T([8, 5])} + ${T([14, 5])} = 3 + ${br(7, 5)} = ${T([22, 5])}.`, `Die Brüche ergeben zusammen ${br(a + c, n)}. Darin steckt ein Ganzes.`), [`${T([g1 * n + a, n])} + ${T([g2 * n + c, n])} = ${T(kz(s))}`]); },
    () => { const n = wahl([6, 8, 9, 10, 12]), a = zz(3, n - 1), c = zz(1, a - 2), e = [n + a, n], f = [c, n], d = minus(e, f);
      if (fremd(a - c, n)) return null;
      return rechneB(Z(`Das Bild zeigt ${T(e)}.`, `Rechne ${T(e)} − ${br(c, n)}.`, 'Kürze das Ergebnis vollständig.'), d, [[[n + a + c, n], 'sub-addiert'], [[a - c, n], 'sach-schritt-vergessen']], tGem, [`${T(e)} − ${br(c, n)} = ${T(d)}`], { bild: bild(kreise(e)) }); },
    () => { const n = wahl([4, 5, 6, 8]), a = zz(1, n - 2), c = zz(a + 1, n - 1), e = [2 * n + a, n];
      return luecken(Z(`Das Bild zeigt ${T(e)}.`, 'Wandle zuerst in einen Bruch um.', 'Rechne dann mit den Zählern.', `${T(e)} − ${br(c, n)} = {{a}}⁄${n} − ${br(c, n)} = {{b}}⁄${n}`), { a: [2 * n + a, fehlerliste(2 * n + a, [[2 + a, 'gemischt-umwandeln'], [20 + a, 'gemischt-umwandeln'], [n + a, 'gemischt-umwandeln']])], b: [2 * n + a - c, fehlerliste(2 * n + a - c, [[2 * n + c - a, 'gemischt-kleiner-von-groesser'], [2 * n + a + c, 'sub-addiert']])] }, tUm,
        { bild: bild(kreise(e)), nachweis: [`${T(e)} − ${br(c, n)} = ${br(2 * n + a, n)} − ${br(c, n)} = ${br(2 * n + a - c, n)}`] }); },
    () => { const [a, n] = echt([5, 6, 7, 8, 9, 10, 12]), g = zz(3, 6), g2 = zz(1, g - 2), d = [g * n - g2 * n - a, n];
      return rechneB(Z(`Rechne ${g} − ${T([g2 * n + a, n])}.`), d, [[[(g - g2) * n + a, n], 'gemischt-kleiner-von-groesser'], [[(g - g2) * n - a + n, n], 'gemischt-umwandeln'], [[g * n + g2 * n + a, n], 'sub-addiert']],
        h3('Ziehe zuerst die Ganzen ab. Ziehe dann den Bruch von einem Ganzen ab.', `5 − ${T([11, 8])} = 4 − ${br(3, 8)} = ${T([29, 8])}.`, `Rechne ${g} − ${g2}. Ziehe vom Ergebnis noch ${br(a, n)} ab.`), [`${g} − ${T([g2 * n + a, n])} = ${T(d)}`]); },
    () => { const n = wahl([4, 5, 8, 10]), a = zz(1, n - 2), c = zz(a + 1, n - 1), g = zz(2, 2), e = [g * n + a, n], f = [n + c, n], d = minus(e, f), kn = kind(), [ding, tat] = wahl([['Ein Brett', 'sägt'], ['Ein Seil', 'schneidet'], ['Eine Leiste', 'sägt']]);
      return rechneB(Z(`${ding} ist ${T(e)} m lang.`, `${kn} ${tat} ${T(f)} m ab.`, 'Wie lang ist der Rest?', 'Kürze das Ergebnis vollständig.'), d, [[[(g - 1) * n + c - a, n], 'gemischt-kleiner-von-groesser'], [plus(e, f), 'sub-addiert']],
        h3('Der Bruch reicht nicht zum Abziehen. Wandle beide Zahlen in Brüche um.', `${T([9, 4])} m − ${T([7, 4])} m = ${br(9, 4)} m − ${br(7, 4)} m = ${br(2, 4)} m = ${br(1, 2)} m.`, `Schreibe ${T(e)} als ${br(e[0], n)} und ${T(f)} als ${br(f[0], n)}. Ziehe dann ab.`),
        [`${T(e)} m − ${T(f)} m = ${T(d)} m`], { einheit: 'm' }); },
    () => { const n = wahl([5, 6, 7, 8, 9]), a = zz(1, n - 3), c = zz(a + 2, n - 1), e = [2 * n + a, n], kn = kind(), richtig = [2 * n + a - c, n], falle = [2 * n + c - a, n], stimmt = wahl([true, false, false]), g = (x) => `${T(e)} − ${br(c, n)} = ${T(x)}`;
      return urteil(Z(`Das Bild zeigt ${T(e)}.`, `${kn} rechnet: ${g(stimmt ? richtig : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? richtig : falle), g(stimmt ? falle : richtig), [g([n + a + c, n])], 'gemischt-kleiner-von-groesser',
        h3('Schau auf die Brüche: Reicht der erste Bruch zum Abziehen?', `${T([9, 4])} − ${br(3, 4)} = ${br(9, 4)} − ${br(3, 4)} = ${br(6, 4)} = ${T([3, 2])}.`, `Schreibe ${T(e)} als ${br(e[0], n)}. Ziehe dann ${br(c, n)} ab.`), { bild: bild(kreise(e)) }); },
  ]);
  const gz = (n, von, bis) => { const z = zz(1, n - 1); return [zz(von, bis) * n + z, n]; };
  sechs(A2, 'M', [
    () => { const n = wahl([8, 9, 10, 12, 14, 15, 16, 18, 20]), e = gz(n, 4, 8), f = gz(n, 1, 3), d = minus(e, f);
      if (e[0] % n >= f[0] % n || fremd(e[0] - f[0], n)) return null;
      return rechneB(`Berechne ${T(e)} − ${T(f)} und kürze vollständig.`, d, [[[Math.floor(e[0] / n) * n - Math.floor(f[0] / n) * n + (f[0] % n) - (e[0] % n), n], 'gemischt-kleiner-von-groesser'], [plus(e, f), 'sub-addiert'], [[e[0] - f[0] + n, n], 'gemischt-umwandeln']],
        h2('Der erste Bruch ist kleiner als der zweite. Wandle deshalb ein Ganzes in Bruchteile um.', `Schreibe ${T(e)} als ${Math.floor(e[0] / n) - 1} Ganze und ${br((e[0] % n) + n, n)}. Ziehe dann die Ganzen und die Brüche einzeln ab.`), [`${T(e)} − ${T(f)} = ${T(d)}`]); },
    () => { const n = wahl([8, 10, 12, 15, 16, 20]), e = gz(n, 2, 4), f = gz(n, 1, 3), g = gz(n, 1, 2), z = e[0] + f[0] - g[0];
      if (z <= n || z % n === 0 || fremd(z, n)) return null;
      return rechneB(`Berechne ${T(e)} + ${T(f)} − ${T(g)} und kürze vollständig.`, [z, n], [[[e[0] + f[0] + g[0], n], 'sub-addiert'], [plus(e, f), 'sach-schritt-vergessen']],
        h2('Rechne von links nach rechts. Du kannst alle Zahlen zuerst in Brüche umwandeln.', `Als Brüche: ${br(e[0], n)} + ${br(f[0], n)} − ${br(g[0], n)}. Rechne mit den Zählern und wandle am Ende um.`), [`${T(e)} + ${T(f)} − ${T(g)} = ${T(kz([z, n]))}`]); },
    () => { const n = wahl([8, 9, 12, 15, 16, 20, 24]), e = gz(n, 1, 4), ziel = Math.floor(e[0] / n) + zz(2, 3), d = [ziel * n - e[0], n];
      if (!fremd(d[0], n)) return null;
      return rechneB(`Welche Zahl musst du zu ${T(e)} addieren, um ${ziel} zu erhalten?`, d, [[[d[0] + n, n], 'gemischt-kleiner-von-groesser'], [[ziel * n + e[0], n], 'sub-addiert'], [[n - (e[0] % n), n], 'sach-schritt-vergessen']],
        h2('Ergänze zuerst bis zum nächsten Ganzen und dann bis zur Zahl.', `Bis ${Math.floor(e[0] / n) + 1} fehlen ${br(n - (e[0] % n), n)}. Von dort bis ${ziel} fehlen noch ${ziel - Math.floor(e[0] / n) - 1} Ganze.`), [`${ziel} − ${T(e)} = ${T(d)}`]); },
    () => { const n = wahl([8, 9, 10, 12, 14, 15, 16, 18]), e = gz(n, 1, 4), f = gz(n, 1, 4), s = plus(e, f);
      if ((e[0] % n) + (f[0] % n) <= n || fremd(e[0] + f[0], n)) return null;
      return rechneB(`Berechne ${T(e)} + ${T(f)} und kürze vollständig.`, s, [[[e[0] + f[0] - n, n], 'gemischt-umwandeln'], [[2 * (Math.floor(e[0] / n) + Math.floor(f[0] / n)) * n + (e[0] % n) + (f[0] % n), 2 * n], 'bruch-add-zaehler-nenner']],
        h2('Die beiden Brüche ergeben zusammen mehr als ein Ganzes.', `Die Brüche ergeben ${br((e[0] % n) + (f[0] % n), n)}. Das ist ein Ganzes und ${br((e[0] % n) + (f[0] % n) - n, n)}. Zähle das Ganze zu den anderen Ganzen.`), [`${T(e)} + ${T(f)} = ${T(s)}`]); },
    () => { const n = wahl([4, 6, 10, 12]), e = gz(n, 2, 3), f = gz(n, 1, 1), d = minus(e, f), [k1, k2] = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara']);
      if (e[0] % n >= f[0] % n || !istBruch(d) || !fremd(e[0], n) || !fremd(f[0], n)) return null;
      return rechneB(`${k1} trainiert in dieser Woche ${T(e)} h, ${k2} trainiert ${T(f)} h. Wie viel länger trainiert ${k1}? Gib das Ergebnis als Bruchteil einer Stunde oder als gemischte Zahl an.`, d, [[plus(e, f), 'sub-addiert'], [[Math.floor(e[0] / n) * n - n + (f[0] % n) - (e[0] % n), n], 'gemischt-kleiner-von-groesser']],
        h2('Gesucht ist der Unterschied der beiden Zeiten.', `Rechne ${T(e)} h − ${T(f)} h. Wandle dafür ein Ganzes in ${br(n, n)} um.`), [`${T(e)} h − ${T(f)} h = ${T(d)} h`], { einheit: 'h' }); },
    () => { const n = wahl([5, 6, 7, 8, 9]), a = zz(1, n - 3), c = zz(a + 2, n - 1), g1 = zz(3, 5), kn = kind();
      return auswahl(`${kn} rechnet ${T([g1 * n + a, n])} − ${T([n + c, n])} = ${T([(g1 - 1) * n + c - a, n])}. Welchen Fehler macht ${kn}?`, [opt('Bei den Brüchen wird der kleinere vom größeren abgezogen, statt ein Ganzes umzuwandeln.', true), opt('Die Ganzen werden falsch voneinander abgezogen.', false, 'sach-falsche-rechnung'), opt('Das Ergebnis ist richtig, es ist nur nicht gekürzt.', false, 'gemischt-kleiner-von-groesser'), opt('Die Nenner hätten auch voneinander abgezogen werden müssen.', false, 'bruch-add-zaehler-nenner')],
        h2('Vergleiche die beiden Brüche hinter den Ganzen: Welcher ist größer?', `${br(a, n)} ist kleiner als ${br(c, n)}. Man kann ${br(c, n)} also nicht einfach davon abziehen.`), { nachweis: [FREI('Fehleranalyse: größer minus kleiner bei gemischten Zahlen')] }); },
  ]);
  sechs(A2, 'E', [
    () => { const n = wahl([18, 20, 24, 28, 30, 36, 40]), e = gz(n, 5, 9), f = gz(n, 2, 4), g = gz(n, 1, 3), z = e[0] - f[0] + g[0];
      if (e[0] % n >= f[0] % n || z % n === 0 || fremd(z, n)) return null;
      return rechneB(`Berechne ${T(e)} − ${T(f)} + ${T(g)} und kürze vollständig.`, [z, n], [[[e[0] - f[0] - g[0], n], 'sub-klammerfehler'], [minus(e, f), 'sach-schritt-vergessen']],
        h1('Rechne von links nach rechts. Mit unechten Brüchen vermeidest du Fehler beim Umwandeln.'), [`${T(e)} − ${T(f)} + ${T(g)} = ${T(kz([z, n]))}`]); },
    () => { const n = wahl([12, 16, 18, 20, 24, 30]), f = gz(n, 1, 3), d = gz(n, 1, 3), e = plus(f, d);
      if (!istBruch(e) || fremd(f[0] + d[0], n)) return null;
      return rechneB(`Von einer Zahl wird ${T(f)} subtrahiert. Das Ergebnis ist ${T(d)}. Wie heißt die Zahl? Kürze vollständig.`, e, [[minus(f[0] > d[0] ? f : d, f[0] > d[0] ? d : f), 'sach-falsche-rechnung'], [[f[0] + d[0] - n, n], 'gemischt-umwandeln']],
        h1('Mache die Subtraktion rückgängig.'), [`${T(d)} + ${T(f)} = ${T(e)}`]); },
    () => { const n = wahl([8, 10, 12, 20]), voll = gz(n, 3, 5), a = gz(n, 1, 1), c = [zz(n / 2, n - 1), n], rest = minus(minus(voll, a), c), [k1, k2] = mische(['Mia', 'Tom', 'Lena', 'Ali']);
      if (!istBruch(rest) || rest[0] < rest[1] || (voll[0] % n) >= (a[0] % n) || !fremd(voll[0], n) || !fremd(a[0], n) || !fremd(c[0], n)) return null;
      return rechneB(`In einem Kanister sind ${T(voll)} l Farbe. ${k1} verbraucht ${T(a)} l für den Zaun, ${k2} verbraucht ${T(c)} l für die Tür. Wie viele Liter Farbe sind noch im Kanister? Kürze vollständig.`, rest, [[minus(voll, a), 'sach-schritt-vergessen'], [plus(a, c), 'sach-frage-verfehlt']],
        h1('Ziehe beide Mengen ab. Achte darauf, wo du ein Ganzes umwandeln musst.'), [`${T(voll)} l − ${T(a)} l − ${T(c)} l = ${T(rest)} l`], { einheit: 'l' }); },
    () => { const n = wahl([6, 8, 10, 12]), a = gz(n, 1, 2), d = [zz(n + 1, 2 * n - 1), n], c = plus(a, [2 * d[0], n]), m = plus(a, d);
      if (!istBruch(m) || !fremd(a[0], n)) return null;
      return rechneB(`Welche Zahl liegt genau in der Mitte zwischen ${T(a)} und ${T(c)}? Kürze vollständig.`, m, [[kz([a[0] + c[0] * (n / c[1]), n]), 'sach-schritt-vergessen'], [minus(c, a), 'sach-falsche-rechnung']],
        h1('Die Mitte ist von beiden Zahlen gleich weit entfernt: Addiere beide Zahlen und halbiere die Summe.'), [`(${T(a)} + ${T(c)}) : 2 = ${T(m)}`]); },
    () => { const n = wahl([5, 6, 8, 10, 12]), s = [zz(2, n - 1), n], start = gz(n, 1, 2), k = zz(4, 9), ziel = plus(start, [k * s[0], n]);
      if (!fremd(s[0], n) || istBruch(ziel)) return null;
      return zahl(`Du beginnst bei ${T(start)} und addierst immer wieder ${br(...s)}. Nach wie vielen Schritten erreichst du die Zahl ${T(ziel)}?`, k, fehlerliste(k, [[k + 1, 'sach-schritt-vergessen'], [k - 1, 'sach-schritt-vergessen'], [k * s[0], 'sach-frage-verfehlt']]),
        h1('Berechne zuerst, wie groß der Abstand zwischen Start und Ziel ist. Wie oft passt der Schritt hinein?'), { nachweis: [`(${T(ziel)} − ${T(start)}) : ${br(...s)} = ${k}`] }); },
    () => { const roh = [], n = wahl([6, 8, 9, 10, 12]);
      for (let i = 0; i < 5; i++) { const e = gz(n, 2, 5), f = gz(n, 1, 2), pl = wahl([true, false]), r = pl ? plus(e, f) : minus(e, f), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        if (!istBruch(r)) return null;
        const x = stimmt ? r : wahl([plus(r, [1, 1]), pl ? minus(r, [1, 1]) : [Math.floor(e[0] / n) * n - Math.floor(f[0] / n) * n + Math.abs((e[0] % n) - (f[0] % n)), n]]); if (!istBruch(x) || x[0] <= 0 || (!stimmt && gleich(x, r))) return null;
        const t = `${T(e)} ${pl ? '+' : '−'} ${T(f)} = ${T(kz(x))}`; if (roh.some(([s]) => s === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-kleiner-von-groesser')), h1('Rechne mit unechten Brüchen nach. Achte auf die Stellen, an denen ein Ganzes umgewandelt werden muss.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
}
