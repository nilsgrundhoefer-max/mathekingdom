// Aufgaben zu 6.2.2 „Ungleichnamige Brüche addieren und subtrahieren“ (Lernziele U1, U2) nach ADR 0015 und ADR 0038.
// U1: Ein Nenner ist ein Vielfaches des anderen, nur ein Bruch wird erweitert. U2: einen gemeinsamen Nenner finden.
// Grilling mit Nils (2026-11-24): Auf F und G steht der Rechenweg in zwei Schritten da (erst die erweiterten Brüche, dann das Ergebnis),
// ab M nur das Ergebnis. In U2 nennt die Aufgabe auf F den gemeinsamen Nenner, auf G ist er das Produkt der Nenner, ab M der Hauptnenner.
// Typische Fehler: Zähler und Nenner getrennt addieren (1⁄2 + 1⁄3 = 2⁄5), die Zähler addieren, ohne gleichnamig zu machen.

import { sechs, auswahl, luecken, zahl, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, plus, minus, kgv, T, U, echt, rechneB, optionen, urteil, VGL, ZEICHEN, kreis, streifen, akku, zwei, istBruch, gleich, kleiner } from './6-2-rechnen.mjs';

const U1 = '6.2.2-U1', U2 = '6.2.2-U2';
const erw = ([z, n], N) => [(z * N) / n, N];
// a⁄n und c⁄m, m ist ein Vielfaches von n. Beide Brüche sind gekürzt und echt.
const vielfach = (paare, passt = () => true) => { for (let i = 0; i < 800; i++) { const [n, m] = wahl(paare), a = echt([n]), c = echt([m]); if (passt(a, c)) return { a, c, n, m, k: m / n, ae: erw(a, m) }; } return null; };
// a⁄n und c⁄m mit gemeinsamem Nenner N (Produkt oder Hauptnenner).
const fremde = (paare, passt = () => true) => { for (let i = 0; i < 800; i++) { const [n, m] = wahl(paare), a = echt([n]), c = echt([m]), N = kgv(n, m); if (passt(a, c, N)) return { a, c, n, m, N, ae: erw(a, N), ce: erw(c, N) }; } return null; };
const B2 = (q) => br(q[0], q[1]);
const NAMEN = ['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara', 'Jonas', 'Ida'];

export function ungleichnamig() {
  // ================= U1: Ein Nenner ist ein Vielfaches des anderen =================
  const PF = [[2, 4], [2, 6], [2, 8], [2, 10], [3, 6], [3, 9], [4, 8], [5, 10], [3, 12], [4, 12], [6, 12]];
  const tU1 = h3('Die Teile sind verschieden groß. Mache zuerst aus den großen Teilen kleine Teile.', `${br(1, 2)} + ${br(1, 4)} = ${br(2, 4)} + ${br(1, 4)} = ${br(3, 4)}. Aus einem Halben werden zwei Viertel.`, 'Erweitere den Bruch mit dem kleineren Nenner. Rechne dann mit den Zählern.');
  sechs(U1, 'F', [
    () => { const { a, c, m, ae } = vielfach(PF, (x, y) => kleiner(plus(x, y), [1, 1]));
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, 'Erweitere zuerst den ersten Bruch.', `${B2(a)} + ${B2(c)} = {{a}}⁄${m} + ${B2(c)} = {{b}}⁄${m}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + c[0], 'bruch-add-ungleichnamig']])], b: [ae[0] + c[0], fehlerliste(ae[0] + c[0], [[a[0] + c[0], 'bruch-add-ungleichnamig'], [Math.abs(ae[0] - c[0]), 'add-subtrahiert']])] }, tU1,
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(c)} = ${br(ae[0] + c[0], m)}`] }); },
    () => { const { a, m, k, ae } = vielfach(PF);
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Jedes Teil wird in ${k} gleich große Teile geteilt.`, `${B2(a)} = {{a}}⁄${m}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + k, 'erweitern-addiert']])] },
        h3('Erweitern heißt: Zähler und Nenner mit derselben Zahl malnehmen.', `${br(1, 2)} = ${br(2, 4)}, denn 1 · 2 = 2 und 2 · 2 = 4.`, `Nimm den Zähler ${a[0]} mal ${k}.`), { bild: bild(streifen(...a)), nachweis: [{ art: 'umformen', von: B2(a), mit: k, wie: 'erweitern', nach: B2(ae) }] }); },
    () => { const { a, c, m, ae } = vielfach(PF, (x, y) => kleiner(y, x));
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, 'Erweitere zuerst den ersten Bruch.', `${B2(a)} − ${B2(c)} = {{a}}⁄${m} − ${B2(c)} = {{b}}⁄${m}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil']])], b: [ae[0] - c[0], fehlerliste(ae[0] - c[0], [[Math.abs(a[0] - c[0]), 'bruch-add-ungleichnamig'], [ae[0] + c[0], 'sub-addiert']])] },
        h3('Mache zuerst aus den großen Teilen kleine Teile. Ziehe dann ab.', `${br(1, 2)} − ${br(1, 4)} = ${br(2, 4)} − ${br(1, 4)} = ${br(1, 4)}.`, 'Erweitere den ersten Bruch. Rechne dann mit den Zählern.'),
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(c)} = ${br(ae[0] - c[0], m)}`] }); },
    () => { const { a, c, n, m, ae } = vielfach(PF.filter(([, y]) => y <= 10), (x, y) => kleiner(plus(x, y), [1, 1])), s = plus(a, c);
      return auswahl(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `Wie viel ist ${B2(a)} + ${B2(c)}?`), optionen(s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], m], 'bruch-add-ungleichnamig']], T), tU1,
        { bild: zwei(kreis(...a), kreis(...c)), nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(c)} = ${T(s)}`, WERT(T(s))] }); },
    () => { const { a, c, n, m, ae } = vielfach(PF.filter(([, y]) => y <= 8), (x, y) => kleiner(plus(x, y), [1, 1])), s = plus(a, c), [k1, k2] = mische(NAMEN);
      return rechneB(Z(`${k1} isst ${B2(a)} Pizza.`, `${k2} isst ${B2(c)} Pizza.`, 'Wie viel Pizza essen beide zusammen?'), s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], m], 'bruch-add-ungleichnamig']],
        h3('Die Stücke sind verschieden groß. Schneide die großen Stücke kleiner.', `${br(1, 2)} Pizza und ${br(1, 4)} Pizza: ${br(2, 4)} + ${br(1, 4)} = ${br(3, 4)} Pizza.`, `Erweitere ${B2(a)} auf den Nenner ${m}. Zähle dann zusammen.`),
        [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(c)} = ${T(s)}`], { bild: zwei(kreis(...a), kreis(...c)) }); },
    () => { const { a, c, m, ae } = vielfach(PF.filter(([, y]) => y <= 10), (x, y) => kleiner(plus(x, y), [1, 1]) && ggt(erw(x, y[1])[0] + y[0], y[1]) > 1), s = plus(a, c);
      return rechneB(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `Rechne ${B2(a)} + ${B2(c)}.`, 'Kürze das Ergebnis.'), s, [[[a[0] + c[0], a[1] + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], m], 'bruch-add-ungleichnamig']],
        h3('Erweitere zuerst. Zähle dann zusammen. Kürze am Ende.', `${br(1, 2)} + ${br(1, 6)} = ${br(3, 6)} + ${br(1, 6)} = ${br(4, 6)} = ${br(2, 3)}.`, `Erweitere ${B2(a)} auf den Nenner ${m}. Das Ergebnis lässt sich noch kürzen.`),
        [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(c)} = ${br(ae[0] + c[0], m)}`], { bild: zwei(kreis(...a), kreis(...c)) }); },
  ]);
  const PG = [[2, 12], [2, 14], [2, 16], [2, 18], [2, 20], [3, 12], [3, 15], [3, 18], [4, 12], [4, 16], [4, 20], [5, 15], [5, 20], [6, 12], [6, 18], [7, 14], [8, 16], [9, 18], [10, 20], [5, 10], [4, 8], [3, 9]];
  const tU1G = h3('Der größere Nenner ist der gemeinsame Nenner. Erweitere nur den anderen Bruch.', `${br(2, 3)} + ${br(1, 12)} = ${br(8, 12)} + ${br(1, 12)} = ${br(9, 12)} = ${br(3, 4)}.`, 'Überlege: Mit welcher Zahl musst du den kleineren Nenner malnehmen? Erweitere damit.');
  sechs(U1, 'G', [
    () => { const { a, c, m, ae } = vielfach(PG, (x, y) => kleiner(plus(x, y), [1, 1]));
      return luecken(Z('Erweitere zuerst den ersten Bruch.', 'Addiere dann.', `${B2(a)} + ${B2(c)} = {{a}}⁄${m} + ${B2(c)} = {{b}}⁄${m}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil'], [a[0] + m - a[1], 'erweitern-addiert']])], b: [ae[0] + c[0], fehlerliste(ae[0] + c[0], [[a[0] + c[0], 'bruch-add-ungleichnamig'], [Math.abs(ae[0] - c[0]), 'add-subtrahiert']])] }, tU1G,
        { nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(c)} = ${br(ae[0] + c[0], m)}`] }); },
    () => { const { a, c, m, ae } = vielfach(PG.filter(([x]) => x <= 6), (x, y) => kleiner(y, x)), d = minus(a, c);
      return rechneB(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} − ${B2(c)}.`, 'Kürze das Ergebnis vollständig.'), d, [[[Math.abs(a[0] - c[0]), m], 'bruch-add-ungleichnamig'], [[ae[0] + c[0], m], 'sub-addiert'], [[Math.abs(a[0] - c[0]), m - a[1]], 'bruch-add-zaehler-nenner']], tU1G,
        [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(c)} = ${T(d)}`], { bild: bild(streifen(...a)) }); },
    () => { const m = wahl([8, 10]), { a, c, ae } = vielfach([[m / 2, m], [2, m]].filter(([x]) => x > 1 && x < m), (x, y) => kleiner(y, x) && !kleiner(x, [1, 2])), d = minus(a, c), kn = kind();
      return rechneB(Z(`Der Akku ist zu ${B2(a)} voll.`, `${kn} verbraucht beim Spielen ${B2(c)} vom ganzen Akku.`, 'Wie voll ist der Akku jetzt?', 'Kürze das Ergebnis vollständig.'), d, [[[ae[0] + c[0], m], 'sub-addiert'], [[Math.abs(a[0] - c[0]), m], 'bruch-add-ungleichnamig'], [c, 'sach-frage-verfehlt']],
        h3('Der Akku hat hier mehr Felder als der Nenner des ersten Bruchs. Erweitere zuerst.', `Der Akku ist zu ${br(1, 2)} voll und ${br(1, 8)} wird verbraucht: ${br(4, 8)} − ${br(1, 8)} = ${br(3, 8)}.`, `Erweitere ${B2(a)} auf den Nenner ${m}. Ziehe dann ${B2(c)} ab.`),
        [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(c)} = ${T(d)}`], { bild: bild(akku(ae[0], m)) }); },
    () => { const { a, c, m, ae } = vielfach(PG, (x, y) => kleiner(y, x));
      return luecken(Z('Erweitere zuerst den ersten Bruch.', 'Subtrahiere dann.', `${B2(a)} − ${B2(c)} = {{a}}⁄${m} − ${B2(c)} = {{b}}⁄${m}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil']])], b: [ae[0] - c[0], fehlerliste(ae[0] - c[0], [[Math.abs(a[0] - c[0]), 'bruch-add-ungleichnamig'], [ae[0] + c[0], 'sub-addiert']])] }, tU1G,
        { nachweis: [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(c)} = ${br(ae[0] - c[0], m)}`] }); },
    () => { const [n1, n2, n3] = wahl([[2, 4, 8], [2, 4, 12], [3, 6, 12], [2, 6, 12], [3, 6, 18], [2, 8, 16], [5, 10, 20], [2, 10, 20], [4, 8, 16], [3, 9, 18]]), a = echt([n1]), c = echt([n2]), e = echt([n3]), s = plus(plus(a, c), e);
      if (!kleiner(s, [1, 1])) return null;
      return rechneB(Z(`Rechne ${B2(a)} + ${B2(c)} + ${B2(e)}.`, 'Kürze das Ergebnis vollständig.'), s, [[[a[0] + c[0] + e[0], n1 + n2 + n3], 'bruch-add-zaehler-nenner'], [[a[0] + c[0] + e[0], n3], 'bruch-add-ungleichnamig'], [plus(a, c), 'sach-schritt-vergessen']],
        h3('Der größte Nenner ist der gemeinsame Nenner. Erweitere die beiden anderen Brüche.', `${br(1, 2)} + ${br(1, 4)} + ${br(1, 8)} = ${br(4, 8)} + ${br(2, 8)} + ${br(1, 8)} = ${br(7, 8)}.`, `Erweitere alle Brüche auf den Nenner ${n3}. Zähle dann die drei Zähler zusammen.`),
        [`${B2(a)} + ${B2(c)} + ${B2(e)} = ${T(s)}`]); },
    () => { const { a, c, n, m, ae } = vielfach(PF.filter(([, y]) => y <= 10), (x, y) => kleiner(plus(x, y), [1, 1]) && x[0] + y[0] !== erw(x, y[1])[0] + y[0]), kn = kind(), s = [ae[0] + c[0], m], falle = [a[0] + c[0], n + m], stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} + ${B2(c)} = ${B2(x)}`;
      return urteil(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `${kn} rechnet: ${g(stimmt ? s : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? s : falle), g(stimmt ? falle : s), [g([a[0] + c[0], m])], 'bruch-add-zaehler-nenner',
        h3('Die Nenner darfst du nie addieren. Mache die Brüche zuerst gleichnamig.', `${br(1, 2)} + ${br(1, 4)} = ${br(2, 4)} + ${br(1, 4)} = ${br(3, 4)}.`, `Erweitere ${B2(a)} auf den Nenner ${m}. Rechne dann nach.`), { bild: zwei(kreis(...a), kreis(...c)) }); },
  ]);
  const PM = [[3, 12], [3, 15], [3, 18], [3, 21], [3, 24], [4, 12], [4, 16], [4, 20], [4, 24], [4, 28], [5, 15], [5, 20], [5, 25], [5, 30], [6, 12], [6, 18], [6, 24], [6, 30], [7, 14], [7, 21], [7, 28], [8, 16], [8, 24], [9, 18], [9, 27], [10, 20], [10, 30], [12, 24], [15, 30]];
  const hm = (a, c, m) => h2('Ein Nenner ist ein Vielfaches des anderen. Er ist der Hauptnenner.', `Erweitere ${B2(a)} auf den Nenner ${m}. Rechne dann mit den Zählern und kürze.`);
  sechs(U1, 'M', [
    () => { const { a, c, m, ae } = vielfach(PM, (x, y) => kleiner([1, 1], plus(x, y))), s = plus(a, c);
      return rechneB(`Berechne ${B2(a)} + ${B2(c)}. Gib das Ergebnis als vollständig gekürzte gemischte Zahl an.`, s, [[[a[0] + c[0], a[1] + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], m], 'bruch-add-ungleichnamig'], [[ae[0] + c[0] - m, m - 1], 'gemischt-umwandeln']], hm(a, c, m), [`${B2(a)} + ${B2(c)} = ${T(s)}`]); },
    () => { const { a, c, m } = vielfach(PM.filter(([x]) => x <= 6), () => true), g1 = zz(3, 6), g2 = zz(1, 2), e = [g1 * a[1] + a[0], a[1]], f = [g2 * m + c[0], m], d = minus(e, f);
      if (!kleiner(a, c) || !istBruch(d)) return null;
      return rechneB(`Berechne ${T(e)} − ${T(f)} und kürze vollständig.`, d, [[[(g1 - g2) * m + Math.abs(erw(a, m)[0] - c[0]), m], 'gemischt-kleiner-von-groesser'], [plus(e, f), 'sub-addiert']],
        h2('Mache zuerst die Brüche gleichnamig. Dann siehst du, dass du ein Ganzes umwandeln musst.', `${T(e)} ist dasselbe wie ${T([g1 * m + erw(a, m)[0], m])}. Wandle ein Ganzes in ${br(m, m)} um und ziehe dann ab.`), [`${T(e)} − ${T(f)} = ${T(d)}`]); },
    () => { const { a, c, m } = vielfach([[2, 4], [2, 10], [4, 20], [5, 10], [5, 20], [2, 20], [4, 8], [10, 20]], (x, y) => kleiner(plus(x, y), [1, 1])), g1 = zz(1, 3), g2 = zz(1, 3), e = [g1 * a[1] + a[0], a[1]], f = [g2 * m + c[0], m], s = plus(e, f), [k1] = mische(NAMEN), [ort1, ort2] = wahl([['zum See', 'zur Hütte'], ['zum Bach', 'zum Gipfel'], ['zur Mühle', 'zum Aussichtsturm']]);
      return rechneB(`${k1} wandert zuerst ${T(e)} km ${ort1} und dann ${T(f)} km weiter ${ort2}. Wie viele Kilometer sind das zusammen? Kürze vollständig.`, s, [[[(g1 + g2) * (a[1] + m) + a[0] + c[0], a[1] + m], 'bruch-add-zaehler-nenner'], [minus(kleiner(e, f) ? f : e, kleiner(e, f) ? e : f), 'sach-falsche-rechnung']],
        h2('Addiere die beiden Strecken. Mache die Brüche vorher gleichnamig.', `Erweitere ${B2(a)} auf den Nenner ${m}. Zähle dann die Ganzen und die Brüche zusammen.`), [`${T(e)} km + ${T(f)} km = ${T(s)} km`], { einheit: 'km' }); },
    () => { const { a, c, m, ae } = vielfach(PM, (x, y) => kleiner(y, x) && ggt(erw(x, y[1])[0] - y[0], y[1]) > 1), d = minus(a, c);
      return rechneB(`Berechne ${B2(a)} − ${B2(c)} und kürze vollständig.`, d, [[[Math.abs(a[0] - c[0]), m], 'bruch-add-ungleichnamig'], [[ae[0] + c[0], m], 'sub-addiert'], [[ae[0] - c[0], m - 1], 'kuerzen-nicht-vollstaendig']], hm(a, c, m), [`${B2(a)} − ${B2(c)} = ${T(d)}`]); },
    () => { const { a, c } = vielfach(PM, (x, y) => kleiner(y, x)), d = minus(a, c);
      if (d[1] > 30) return null;
      return rechneB(`Welchen Bruch musst du von ${B2(a)} subtrahieren, um ${B2(d)} zu erhalten? Kürze vollständig.`, c, [[plus(a, d), 'sub-addiert'], [[Math.abs(a[0] - d[0]), Math.max(a[1], d[1])], 'bruch-add-ungleichnamig']],
        h2('Gesucht ist der Unterschied zwischen den beiden Brüchen.', `Rechne ${B2(a)} − ${B2(d)}. Mache die Brüche vorher gleichnamig.`), [`${B2(a)} − ${B2(d)} = ${B2(c)}`]); },
    () => { const roh = [];
      for (let i = 0; i < 4; i++) { const { a, c, n, m, ae } = vielfach(PG, (x, y) => kleiner(plus(x, y), [1, 1])), stimmt = i < 2 ? i === 0 : wahl([true, false]), s = plus(a, c), x = stimmt ? s : wahl([[a[0] + c[0], n + m], [a[0] + c[0], m]]);
        if ((!stimmt && gleich(x, s)) || !istBruch(x) || gleich(x, a) || gleich(x, c)) return null;
        const t = `${B2(a)} + ${B2(c)} = ${B2(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt, kz(x)[1] === n + m ? 'bruch-add-zaehler-nenner' : 'bruch-add-ungleichnamig']); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r, fv]) => opt(t, r, r ? undefined : fv)), h2('Rechne jede Aufgabe nach: erst gleichnamig machen, dann addieren, dann kürzen.', 'Überschlage: Die Summe muss größer sein als jeder der beiden Brüche.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
  sechs(U1, 'E', [
    () => { const [n1, n2, n3] = wahl([[3, 6, 24], [4, 8, 24], [4, 12, 36], [5, 10, 40], [3, 12, 48], [6, 12, 48], [4, 16, 48], [5, 15, 45], [2, 14, 28], [3, 9, 36], [9, 18, 36], [5, 20, 60]]), a = echt([n1]), c = echt([n2]), e = echt([n3]), r = minus(plus(a, c), e);
      if (!kleiner(e, plus(a, c)) || !istBruch(r)) return null;
      return rechneB(`Berechne ${B2(a)} + ${B2(c)} − ${B2(e)} und kürze vollständig.`, r, [[plus(plus(a, c), e), 'sub-addiert'], [plus(a, c), 'sach-schritt-vergessen'], [[Math.abs(a[0] + c[0] - e[0]) || 1, n3], 'bruch-add-ungleichnamig']],
        h1('Der größte Nenner ist ein Vielfaches der beiden anderen. Erweitere alle Brüche auf ihn.'), [`${B2(a)} + ${B2(c)} − ${B2(e)} = ${T(r)}`]); },
    () => { const { a, c, m } = vielfach(PM, () => true), g1 = zz(1, 3), g2 = zz(1, 4), f = [g1 * m + c[0], m], x = [g2 * a[1] + a[0], a[1]], s = plus(f, x);
      if (!istBruch(s)) return null;
      return rechneB(`Von einer Zahl wird ${T(f)} subtrahiert. Das Ergebnis ist ${T(x)}. Wie heißt die Zahl? Kürze vollständig.`, s, [[minus(kleiner(f, x) ? x : f, kleiner(f, x) ? f : x), 'sach-falsche-rechnung'], [[(g1 + g2) * (m + a[1]) + a[0] + c[0], a[1] + m], 'bruch-add-zaehler-nenner']],
        h1('Mache die Subtraktion rückgängig. Achte auf den gemeinsamen Nenner.'), [`${T(x)} + ${T(f)} = ${T(s)}`]); },
    () => { const [n1, n2] = wahl([[4, 8], [3, 12], [4, 12], [5, 10], [5, 20], [4, 20], [6, 12], [3, 9]]), a = echt([n1]), c = echt([n2]), rest = minus([1, 1], plus(a, c)), satz = wahl([`Vom Taschengeld sind ${B2(a)} für ein Buch verplant und ${B2(c)} für ein Geschenk.`, `Von den Ferien sind ${B2(a)} für die Großeltern verplant und ${B2(c)} für das Zeltlager.`, `Vom Garten sind ${B2(a)} mit Gemüse bepflanzt und ${B2(c)} mit Blumen.`]);
      if (!kleiner(plus(a, c), [1, 1])) return null;
      return rechneB(`${satz} Der Rest ist noch frei. Welcher Bruchteil ist noch frei? Kürze vollständig.`, rest, [[plus(a, c), 'sach-frage-verfehlt'], [minus([1, 1], a), 'sach-schritt-vergessen'], [[a[0] + c[0], n1 + n2], 'bruch-add-zaehler-nenner']], h1('Ziehe beide Bruchteile vom Ganzen ab.'), [`1 − ${B2(a)} − ${B2(c)} = ${B2(rest)}`]); },
    () => { const k = wahl([3, 4, 5]), teile = Array.from({ length: k }, (_, i) => [1, 2 ** (i + 1)]), text = teile.map(B2).join(' + '), rest = [1, 2 ** k];
      return rechneB(`Berechne die Summe ${text}. Wie viel fehlt dann noch bis 1?`, rest, [[[2 ** k - 1, 2 ** k], 'sach-frage-verfehlt'], [[1, 2 ** (k + 1)], 'sach-schritt-vergessen'], [[k, 2 ** (k + 1) - 2], 'bruch-add-zaehler-nenner']],
        h1('Erweitere alle Brüche auf den größten Nenner. Vergleiche die Summe mit dem Ganzen.'), [`1 − ${teile.map(B2).join(' − ')} = ${B2(rest)}`]); },
    () => { const { a, c, m } = vielfach(PM, (x, y) => kleiner(y, x)), d = minus(a, c), x = erw(a, m)[0];
      if (d[1] === m || d[1] === a[1]) return null;
      return luecken(`Welcher Zähler fehlt? {{a}}⁄${m} − ${B2(c)} = ${B2(d)}`, { a: [x, fehlerliste(x, [[d[0] + c[0], 'bruch-add-ungleichnamig'], [x - 2 * c[0], 'sub-addiert'], [a[0], 'erweitern-nur-ein-teil']])] },
        h1(`Rechne rückwärts: Addiere ${B2(c)} zum Ergebnis. Erweitere dafür auf den Nenner ${m}.`), { nachweis: [`${B2(d)} + ${B2(c)} = ${br(x, m)}`] }); },
    () => { const { a, c, n, m } = vielfach(PG, (x, y) => kleiner(plus(x, y), [1, 1])), kn = kind();
      return auswahl(`${kn} rechnet ${B2(a)} + ${B2(c)} = ${br(a[0] + c[0], n + m)}. Woran erkennst du ohne Rechnung, dass das Ergebnis nicht stimmen kann?`, [opt('Das Ergebnis ist kleiner als der größere der beiden Brüche, obwohl etwas dazukommt.', true), opt('Das Ergebnis ist größer als 1, obwohl beide Brüche kleiner als ein Halbes sind.', false, 'bruch-add-zaehler-nenner'), opt('Der Nenner des Ergebnisses muss immer eine gerade Zahl sein.', false, 'bruch-add-zaehler-nenner'), opt('Der Zähler des Ergebnisses darf nie größer sein als die Zähler der beiden Brüche.', false, 'bruch-add-zaehler-nenner')],
        h1('Vergleiche das Ergebnis mit den beiden Brüchen der Aufgabe: Was passiert mit einer Zahl, zu der du etwas addierst?'), { nachweis: [FREI('Plausibilität: Eine Summe ist größer als jeder Summand')] }); },
  ]);

  // ================= U2: einen gemeinsamen Nenner finden =================
  const QF = [[2, 3], [2, 5], [3, 4]];
  const tU2 = h3('Beide Brüche bekommen den gemeinsamen Nenner. Erweitere jeden Bruch.', `${br(1, 2)} + ${br(1, 3)} = ${br(3, 6)} + ${br(2, 6)} = ${br(5, 6)}.`, 'Erweitere den ersten Bruch und den zweiten Bruch. Rechne dann mit den Zählern.');
  sechs(U2, 'F', [
    () => { const { a, c, N, ae, ce } = fremde(QF);
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, `Der gemeinsame Nenner ist ${N}.`, `${B2(a)} = {{a}}⁄${N}`, `${B2(c)} = {{b}}⁄${N}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil'], [ce[0], 'erweitern-nur-ein-teil']])], b: [ce[0], fehlerliste(ce[0], [[c[0], 'erweitern-nur-ein-teil'], [ae[0], 'erweitern-nur-ein-teil']])] },
        h3('Erweitern heißt: Zähler und Nenner mit derselben Zahl malnehmen.', `${br(1, 2)} = ${br(3, 6)}, denn 1 · 3 = 3 und 2 · 3 = 6.`, 'Überlege bei jedem Bruch: Mit welcher Zahl wurde der Nenner malgenommen?'),
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} = ${B2(ae)}`, `${B2(c)} = ${B2(ce)}`, { art: 'kgv', zahlen: [a[1], c[1]], zahl: N }] }); },
    () => { const { a, c, N, ae, ce } = fremde(QF, (x, y) => kleiner(plus(x, y), [1, 1]));
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, `Der gemeinsame Nenner ist ${N}.`, `${B2(a)} + ${B2(c)} = {{a}}⁄${N} + {{b}}⁄${N} = {{c}}⁄${N}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil']])], b: [ce[0], fehlerliste(ce[0], [[c[0], 'erweitern-nur-ein-teil']])], c: [ae[0] + ce[0], fehlerliste(ae[0] + ce[0], [[a[0] + c[0], 'bruch-add-ungleichnamig']])] }, tU2,
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(ce)} = ${br(ae[0] + ce[0], N)}`, { art: 'kgv', zahlen: [a[1], c[1]], zahl: N }] }); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QF, (x, y) => kleiner(plus(x, y), [1, 1])), s = [ae[0] + ce[0], N];
      return auswahl(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `Der gemeinsame Nenner ist ${N}.`, `Wie viel ist ${B2(a)} + ${B2(c)}?`), optionen(s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], N], 'bruch-add-ungleichnamig']], U), tU2,
        { bild: zwei(kreis(...a), kreis(...c)), nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(ce)} = ${B2(s)}`, WERT(B2(s)), { art: 'kgv', zahlen: [n, m], zahl: N }] }); },
    () => { const { a, c, N, ae, ce } = fremde(QF, (x, y) => kleiner(y, x));
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, `Der gemeinsame Nenner ist ${N}.`, `${B2(a)} − ${B2(c)} = {{a}}⁄${N} − {{b}}⁄${N} = {{c}}⁄${N}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil']])], b: [ce[0], fehlerliste(ce[0], [[c[0], 'erweitern-nur-ein-teil']])], c: [ae[0] - ce[0], fehlerliste(ae[0] - ce[0], [[Math.abs(a[0] - c[0]), 'bruch-add-ungleichnamig'], [ae[0] + ce[0], 'sub-addiert']])] },
        h3('Beide Brüche bekommen den gemeinsamen Nenner. Ziehe dann die Zähler ab.', `${br(1, 2)} − ${br(1, 3)} = ${br(3, 6)} − ${br(2, 6)} = ${br(1, 6)}.`, 'Erweitere den ersten Bruch und den zweiten Bruch. Rechne dann mit den Zählern.'),
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(ce)} = ${br(ae[0] - ce[0], N)}`, { art: 'kgv', zahlen: [a[1], c[1]], zahl: N }] }); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QF, (x, y) => kleiner(plus(x, y), [1, 1])), s = plus(a, c), [k1, k2] = mische(NAMEN), was = wahl(['Saft', 'Wasser', 'Tee']);
      return rechneB(Z(`${k1} trinkt ${B2(a)} l ${was}.`, `${k2} trinkt ${B2(c)} l ${was}.`, `Der gemeinsame Nenner ist ${N}.`, 'Wie viel trinken beide zusammen?'), s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], N], 'bruch-add-ungleichnamig']], tU2,
        [`${B2(a)} l + ${B2(c)} l = ${B2(ae)} l + ${B2(ce)} l = ${T(s)} l`, { art: 'kgv', zahlen: [n, m], zahl: N }], { einheit: 'l', bild: zwei(kreis(...a), kreis(...c)) }); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QF, (x, y) => kleiner(y, x)), d = minus(a, c);
      return rechneB(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `Der gemeinsame Nenner ist ${N}.`, `Rechne ${B2(a)} − ${B2(c)}.`), d, [[[Math.abs(a[0] - c[0]), Math.abs(n - m)], 'bruch-add-zaehler-nenner'], [[Math.abs(a[0] - c[0]) || 1, N], 'bruch-add-ungleichnamig'], [[ae[0] + ce[0], N], 'sub-addiert']],
        h3('Beide Brüche bekommen den gemeinsamen Nenner. Ziehe dann die Zähler ab.', `${br(1, 2)} − ${br(1, 3)} = ${br(3, 6)} − ${br(2, 6)} = ${br(1, 6)}.`, `Erweitere beide Brüche auf den Nenner ${N}. Rechne dann mit den Zählern.`),
        [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(ce)} = ${T(d)}`, { art: 'kgv', zahlen: [n, m], zahl: N }], { bild: zwei(kreis(...a), kreis(...c)) }); },
  ]);
  const QG = [[3, 4], [3, 5], [4, 5], [2, 7], [3, 7], [4, 7], [5, 6], [2, 9], [3, 8], [3, 10], [2, 11], [2, 5], [2, 3]];
  const tU2G = h3('Nimm die beiden Nenner miteinander mal. Das ist ein gemeinsamer Nenner.', `${br(2, 3)} + ${br(1, 5)}: Der gemeinsame Nenner ist 3 · 5 = 15. Dann ${br(10, 15)} + ${br(3, 15)} = ${br(13, 15)}.`, 'Erweitere jeden Bruch mit dem Nenner des anderen Bruchs. Rechne dann mit den Zählern.');
  sechs(U2, 'G', [
    () => { const { a, c, N, ae, ce } = fremde(QG, (x, y) => kleiner(plus(x, y), [1, 1]));
      return luecken(Z('Mache die Brüche gleichnamig.', 'Addiere dann.', `${B2(a)} + ${B2(c)} = {{a}}⁄${N} + {{b}}⁄${N} = {{c}}⁄${N}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil'], [ce[0], 'erweitern-nur-ein-teil']])], b: [ce[0], fehlerliste(ce[0], [[c[0], 'erweitern-nur-ein-teil']])], c: [ae[0] + ce[0], fehlerliste(ae[0] + ce[0], [[a[0] + c[0], 'bruch-add-ungleichnamig']])] }, tU2G,
        { nachweis: [`${B2(a)} + ${B2(c)} = ${B2(ae)} + ${B2(ce)} = ${br(ae[0] + ce[0], N)}`, { art: 'kgv', zahlen: [a[1], c[1]], zahl: N }] }); },
    () => { const { a, c, N, ae, ce } = fremde(QG.filter(([x, y]) => x <= 5 && y <= 8), (x, y) => kleiner(y, x));
      return luecken(Z(`Streifen A zeigt ${B2(a)}.`, `Streifen B zeigt ${B2(c)}.`, 'Mache die Brüche gleichnamig.', `${B2(a)} − ${B2(c)} = {{a}}⁄${N} − {{b}}⁄${N} = {{c}}⁄${N}`), { a: [ae[0], fehlerliste(ae[0], [[a[0], 'erweitern-nur-ein-teil']])], b: [ce[0], fehlerliste(ce[0], [[c[0], 'erweitern-nur-ein-teil']])], c: [ae[0] - ce[0], fehlerliste(ae[0] - ce[0], [[Math.abs(a[0] - c[0]), 'bruch-add-ungleichnamig'], [ae[0] + ce[0], 'sub-addiert']])] }, tU2G,
        { bild: zwei(streifen(...a), streifen(...c)), nachweis: [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(ce)} = ${br(ae[0] - ce[0], N)}`, { art: 'kgv', zahlen: [a[1], c[1]], zahl: N }] }); },
    () => { const { a, c, n, m, N } = fremde(QG);
      return zahl(Z(`Du willst ${B2(a)} und ${B2(c)} addieren.`, 'Wie heißt der kleinste gemeinsame Nenner?'), N, fehlerliste(N, [[n + m, 'bruch-add-zaehler-nenner'], [Math.max(n, m), 'bruch-add-ungleichnamig'], [2 * N, 'sach-frage-verfehlt']]),
        h3('Der gemeinsame Nenner muss durch beide Nenner teilbar sein.', `Für ${br(1, 3)} und ${br(1, 4)} ist es die 12, denn 3 · 4 = 12.`, `Rechne ${n} · ${m}.`), { nachweis: [{ art: 'kgv', zahlen: [n, m], zahl: N }, { art: 'teil', bruch: B2(a), was: 'zaehler', zahl: a[0] }, { art: 'teil', bruch: B2(c), was: 'zaehler', zahl: c[0] }] }); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QG, (x, y) => kleiner(y, x)), d = minus(a, c);
      return rechneB(Z(`Rechne ${B2(a)} − ${B2(c)}.`, 'Kürze das Ergebnis vollständig.'), d, [[[Math.abs(a[0] - c[0]) || 1, Math.abs(n - m)], 'bruch-add-zaehler-nenner'], [[Math.abs(a[0] - c[0]) || 1, N], 'bruch-add-ungleichnamig'], [[ae[0] + ce[0], N], 'sub-addiert']],
        h3('Nimm die beiden Nenner miteinander mal. Das ist ein gemeinsamer Nenner.', `${br(3, 4)} − ${br(2, 5)}: Der gemeinsame Nenner ist 20. Dann ${br(15, 20)} − ${br(8, 20)} = ${br(7, 20)}.`, `Erweitere beide Brüche auf den Nenner ${N}. Ziehe dann die Zähler ab.`),
        [`${B2(a)} − ${B2(c)} = ${B2(ae)} − ${B2(ce)} = ${T(d)}`, { art: 'kgv', zahlen: [n, m], zahl: N }]); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QG.filter(([x, y]) => x <= 5 && y <= 8), (x, y) => kleiner(plus(x, y), [1, 1])), s = plus(a, c), [z1, z2] = wahl([['Milch', 'Wasser'], ['Milch', 'Sahne'], ['Wasser', 'Öl']]);
      return rechneB(Z(`Für einen Teig braucht man ${B2(a)} l ${z1}.`, `Dazu kommen ${B2(c)} l ${z2}.`, 'Wie viel Flüssigkeit ist das zusammen?', 'Kürze das Ergebnis vollständig.'), s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], N], 'bruch-add-ungleichnamig']], tU2G,
        [`${B2(a)} l + ${B2(c)} l = ${B2(ae)} l + ${B2(ce)} l = ${T(s)} l`, { art: 'kgv', zahlen: [n, m], zahl: N }], { einheit: 'l', bild: zwei(kreis(...a), kreis(...c)) }); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QG.filter(([x, y]) => x <= 5 && y <= 8), (x, y) => kleiner(plus(x, y), [1, 1])), kn = kind(), s = [ae[0] + ce[0], N], falle = [a[0] + c[0], n + m], stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} + ${B2(c)} = ${B2(x)}`;
      return urteil(Z(`Kreis A zeigt ${B2(a)}.`, `Kreis B zeigt ${B2(c)}.`, `${kn} rechnet: ${g(stimmt ? s : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? s : falle), g(stimmt ? falle : s), [g([a[0] + c[0], N])], 'bruch-add-zaehler-nenner',
        h3('Die Nenner darfst du nie addieren. Mache die Brüche zuerst gleichnamig.', `${br(1, 2)} + ${br(1, 3)} = ${br(3, 6)} + ${br(2, 6)} = ${br(5, 6)}.`, `Der gemeinsame Nenner ist ${N}. Erweitere beide Brüche und rechne nach.`), { bild: zwei(kreis(...a), kreis(...c)) }); },
  ]);
  const QM = [[4, 6], [6, 8], [6, 9], [8, 12], [9, 12], [10, 15], [6, 10], [8, 10], [4, 10], [9, 15], [10, 12], [12, 18], [6, 15], [12, 16], [4, 14], [6, 14], [10, 25], [12, 20], [8, 20], [15, 20]];
  const hU2M = (n, m, N) => h2('Suche den Hauptnenner: das kleinste Vielfache, das beide Nenner gemeinsam haben.', `Die Vielfachen von ${Math.max(n, m)} sind ${Math.max(n, m)}, ${2 * Math.max(n, m)}, ${3 * Math.max(n, m)} … Das erste, in das auch die ${Math.min(n, m)} passt, ist ${N}.`);
  sechs(U2, 'M', [
    () => { const { a, c, n, m, N, ae, ce } = fremde(QM), s = plus(a, c);
      return rechneB(`Berechne ${B2(a)} + ${B2(c)} und kürze vollständig.`, s, [[[a[0] + c[0], n + m], 'bruch-add-zaehler-nenner'], [[a[0] + c[0], N], 'bruch-add-ungleichnamig'], [[ae[0] + ce[0] + 1, N], null]].filter(([, fv]) => fv), hU2M(n, m, N), [`${B2(a)} + ${B2(c)} = ${T(s)}`]); },
    () => { const [n1, n2, n3] = wahl([[4, 6, 8], [3, 4, 6], [2, 3, 8], [4, 6, 9], [3, 5, 6], [4, 5, 10], [6, 8, 12], [2, 5, 6], [3, 4, 8], [6, 9, 12], [4, 10, 15], [5, 6, 15]]), a = echt([n1]), c = echt([n2]), e = echt([n3]), N = kgv(kgv(n1, n2), n3);
      return zahl(`Bestimme den Hauptnenner der Brüche ${B2(a)}, ${B2(c)} und ${B2(e)}.`, N, fehlerliste(N, [[n1 * n2 * n3, 'sach-frage-verfehlt'], [n1 + n2 + n3, 'bruch-add-zaehler-nenner'], [Math.max(n1, n2, n3), 'bruch-add-ungleichnamig'], [2 * N, 'sach-frage-verfehlt']]),
        h2('Der Hauptnenner ist die kleinste Zahl, die durch alle drei Nenner teilbar ist.', `Gehe die Vielfachen von ${n3} durch: ${n3}, ${2 * n3}, ${3 * n3} … Prüfe jedes Mal, ob auch ${n1} und ${n2} hineinpassen.`), { nachweis: [{ art: 'kgv', zahlen: [n1, n2, n3], zahl: N }, ...[a, c, e].map((q) => ({ art: 'teil', bruch: B2(q), was: 'zaehler', zahl: q[0] }))] }); },
    () => { const { a, c, N } = fremde(QM, (x, y) => kleiner(x, y)), g1 = zz(3, 6), g2 = zz(1, 2), e = [g1 * a[1] + a[0], a[1]], f = [g2 * c[1] + c[0], c[1]], d = minus(e, f);
      return rechneB(`Berechne ${T(e)} − ${T(f)} und kürze vollständig.`, d, [[plus(e, f), 'sub-addiert'], [[(g1 - g2) * N + Math.abs(erw(a, N)[0] - erw(c, N)[0]), N], 'gemischt-kleiner-von-groesser']],
        h2('Mache zuerst die Brüche gleichnamig. Wandle dann ein Ganzes um, weil der erste Bruch kleiner ist.', `Der Hauptnenner ist ${N}. Aus ${T(e)} wird ${T([g1 * N + erw(a, N)[0], N])}, aus ${T(f)} wird ${T([g2 * N + erw(c, N)[0], N])}.`), [`${T(e)} − ${T(f)} = ${T(d)}`]); },
    () => { const { a, c, n, m, N, ae, ce } = fremde(QM, (x, y) => kleiner(y, x)), d = minus(a, c);
      return rechneB(`Berechne ${B2(a)} − ${B2(c)} und kürze vollständig.`, d, [[[Math.abs(a[0] - c[0]) || 1, Math.abs(n - m)], 'bruch-add-zaehler-nenner'], [[Math.abs(a[0] - c[0]) || 1, N], 'bruch-add-ungleichnamig'], [[ae[0] + ce[0], N], 'sub-addiert']], hU2M(n, m, N), [`${B2(a)} − ${B2(c)} = ${T(d)}`]); },
    () => { const { a, c } = fremde([[4, 6], [4, 10], [6, 10], [2, 6], [4, 5], [5, 6], [2, 5], [3, 4], [3, 10]], () => true), g1 = zz(1, 3), g2 = zz(1, 3), e = [g1 * a[1] + a[0], a[1]], f = [g2 * c[1] + c[0], c[1]], s = plus(e, f), kn = kind(), [t1, t2] = wahl([['am Samstag', 'am Sonntag'], ['vor der Pause', 'nach der Pause'], ['am Vormittag', 'am Nachmittag']]);
      if (!istBruch(s)) return null;
      return rechneB(`${kn} fährt ${t1} ${T(e)} km mit dem Rad und ${t2} ${T(f)} km. Wie viele Kilometer sind das zusammen? Kürze vollständig.`, s, [[minus(kleiner(e, f) ? f : e, kleiner(e, f) ? e : f), 'sach-falsche-rechnung'], [[(g1 + g2) * (a[1] + c[1]) + a[0] + c[0], a[1] + c[1]], 'bruch-add-zaehler-nenner']],
        h2('Addiere die Ganzen und die Brüche einzeln. Mache die Brüche vorher gleichnamig.', `Der Hauptnenner von ${a[1]} und ${c[1]} ist ${kgv(a[1], c[1])}. Ergeben die Brüche zusammen mehr als 1, kommt ein Ganzes dazu.`), [`${T(e)} km + ${T(f)} km = ${T(s)} km`], { einheit: 'km' }); },
    () => { const { a, c, n, m, N } = fremde(QM), [k1, k2] = mische(NAMEN);
      return auswahl(`${k1} und ${k2} berechnen ${B2(a)} + ${B2(c)}. ${k1} nimmt als gemeinsamen Nenner das Produkt ${n * m}, ${k2} nimmt den Hauptnenner ${N}. Wer rechnet richtig?`, [opt(`Beide rechnen richtig. ${k1} muss am Ende nur mehr kürzen.`, true), opt(`Nur ${k2} rechnet richtig, denn es gibt nur einen gemeinsamen Nenner.`, false, 'bruch-add-ungleichnamig'), opt(`Nur ${k1} rechnet richtig, denn der gemeinsame Nenner ist immer das Produkt.`, false, 'bruch-add-ungleichnamig'), opt('Keiner von beiden, denn die Nenner müssen addiert werden.', false, 'bruch-add-zaehler-nenner')],
        h2('Ein gemeinsamer Nenner muss nur durch beide Nenner teilbar sein.', `Prüfe: Sind ${n * m} und ${N} beide durch ${n} und durch ${m} teilbar?`), { nachweis: [FREI('Jeder gemeinsame Nenner führt zum selben Wert')] }); },
  ]);
  const QE = [[12, 18], [8, 12], [10, 15], [12, 16], [9, 12], [14, 21], [15, 20], [12, 20], [16, 24], [18, 24], [15, 25], [8, 14], [10, 12], [20, 30], [12, 30], [9, 24], [18, 27]];
  sechs(U2, 'E', [
    () => { const [n1, n2, n3] = wahl([[6, 8, 12], [4, 6, 9], [8, 12, 18], [6, 10, 15], [9, 12, 18], [8, 10, 20], [6, 9, 12], [10, 12, 15], [12, 16, 24], [5, 6, 9], [4, 9, 12], [6, 14, 21]]), a = echt([n1]), c = echt([n2]), e = echt([n3]), r = minus(plus(a, c), e);
      if (!kleiner(e, plus(a, c)) || !istBruch(r)) return null;
      return rechneB(`Berechne ${B2(a)} + ${B2(c)} − ${B2(e)} und kürze vollständig.`, r, [[plus(plus(a, c), e), 'sub-addiert'], [plus(a, c), 'sach-schritt-vergessen'], [[Math.abs(a[0] + c[0] - e[0]) || 1, kgv(kgv(n1, n2), n3)], 'bruch-add-ungleichnamig']],
        h1('Bestimme den Hauptnenner aller drei Brüche. Mit dem Produkt der Nenner werden die Zahlen unnötig groß.'), [`${B2(a)} + ${B2(c)} − ${B2(e)} = ${T(r)}`]); },
    () => { const { a, c } = fremde(QE), g = zz(1, 2), e = [g * c[1] + c[0], c[1]], x = minus(e, a);
      if (x[0] <= 0 || !istBruch(x)) return null;
      return rechneB(`Zu welcher Zahl musst du ${B2(a)} addieren, um ${T(e)} zu erhalten? Kürze vollständig.`, x, [[plus(e, a), 'sub-addiert'], [[Math.abs(e[0] - a[0]), kgv(a[1], c[1])], 'bruch-add-ungleichnamig']],
        h1('Rechne rückwärts. Suche den Hauptnenner, bevor du subtrahierst.'), [`${T(e)} − ${B2(a)} = ${T(x)}`]); },
    () => { const [n1, n2, n3] = wahl([[5, 4, 6], [3, 4, 6], [4, 5, 10], [3, 5, 6], [2, 5, 6], [4, 6, 8], [3, 8, 12], [5, 6, 10]]), a = echt([n1]), c = echt([n2]), e = echt([n3]), rest = minus([1, 1], plus(plus(a, c), e)), [flaeche, t1, t2, t3] = wahl([['eines Grundstücks', 'Garten', 'Haus', 'Terrasse'], ['eines Schulhofs', 'Sportfläche', 'Spielfläche', 'Schulgarten'], ['einer Stadtfläche', 'Wohngebiet', 'Wald', 'Gewerbegebiet']]);
      if (rest[0] <= 0 || !kleiner(plus(plus(a, c), e), [1, 1])) return null;
      return rechneB(`${B2(a)} ${flaeche} sind ${t1}, ${B2(c)} sind ${t2} und ${B2(e)} sind ${t3}. Welcher Bruchteil bleibt für alles andere übrig? Kürze vollständig.`, rest, [[plus(plus(a, c), e), 'sach-frage-verfehlt'], [minus([1, 1], plus(a, c)), 'sach-schritt-vergessen']],
        h1('Addiere zuerst die drei Bruchteile mit dem Hauptnenner. Ziehe die Summe vom Ganzen ab.'), [`1 − ${B2(a)} − ${B2(c)} − ${B2(e)} = ${B2(rest)}`]); },
    () => { const [n, m] = wahl([[2, 3], [2, 4], [3, 4], [4, 6], [4, 5], [3, 5], [5, 6], [2, 5], [2, 6], [2, 9], [4, 9], [3, 6]]), s = plus([1, n], [1, m]);
      return luecken(`Jeder Bruch lässt sich als Summe von Brüchen mit dem Zähler 1 schreiben. Welcher Nenner fehlt? ${B2(s)} = ${br(1, n)} + 1⁄{{a}}`, { a: [m, fehlerliste(m, [[s[1] - n, 'bruch-add-zaehler-nenner'], [s[1], 'bruch-add-ungleichnamig'], [n, 'sach-frage-verfehlt']])] },
        h1(`Rechne ${B2(s)} − ${br(1, n)} und kürze das Ergebnis vollständig.`), { nachweis: [`${B2(s)} − ${br(1, n)} = ${br(1, m)}`, { art: 'teil', bruch: br(1, m), was: 'nenner', zahl: m }] }); },
    () => { const { a, c } = fremde(QE.filter(([x, y]) => x <= 16 && y <= 24)), s = plus(a, c), v = wahl([s, plus(s, [1, kgv(a[1], c[1])]), minus(s, [1, kgv(a[1], c[1])])]), vk = kz(v);
      if (!istBruch(vk) || vk[0] <= 0) return null;
      return auswahl(`Welches Zeichen passt? ${B2(a)} + ${B2(c)} ▢ ${T(vk)}`, ZEICHEN(s[0] * vk[1] - vk[0] * s[1], 'bruch-add-ungleichnamig'), h1('Berechne die Summe links und bringe sie auf denselben Nenner wie die Zahl rechts.'), { nachweis: [VGL(`${B2(a)} + ${B2(c)}`, T(vk))] }); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const { a, c, n, m, N } = fremde(QM), pl = wahl([true, false]), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        if (!pl && !kleiner(c, a)) return null;
        const r = pl ? plus(a, c) : minus(a, c), x = stimmt ? r : wahl([kz([pl ? a[0] + c[0] : Math.abs(a[0] - c[0]) || 1, N]), kz([a[0] + c[0], n + m])]);
        if ((!stimmt && gleich(x, r)) || !istBruch(x) || !istBruch(r) || gleich(x, a) || gleich(x, c)) return null;
        const t = `${B2(a)} ${pl ? '+' : '−'} ${B2(c)} = ${T(x)}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'bruch-add-ungleichnamig')), h1('Rechne mit dem Hauptnenner nach und kürze. Ein Überschlag mit einem Halben hilft beim schnellen Aussortieren.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
}
