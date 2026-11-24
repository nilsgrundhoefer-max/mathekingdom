// Aufgaben zu 7.1.5 „Rechenvorteile“ (Lernziele R1, R2) nach ADR 0015 und ADR 0043.
// R1: Klammern auflösen, Rechenzeichen und Vorzeichen zusammenfassen. R2: Summen vorteilhaft ordnen.
// Grilling mit Nils (2026-11-24): Auf F und G steht der Rechenweg als Schritte da (Lückentext), ab M zählt nur das Ergebnis.
// F ganze Zahlen bis ±20 mit Bild, G bis ±100 und eine Nachkommastelle, M zwei Stellen und gleichnamige Brüche, E ungleichnamige Brüche und Fehlersuche.
// Typische Fehler: Minus und Minus bleibt Minus, bei der Minusklammer nur das erste Zeichen umdrehen, beim Tauschen das Vorzeichen stehen lassen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, T, zt, dt, bt, opt, zz, wahl, mische, antwort, lk, lkd, gerade, weg, wegZ, H, X, KL, kette, val, txt, rechne, pruefe, urteil, AUSSAGEN, kind, ohneKlammern, summe, istGanz } from './7-1-rational.mjs';

const R1 = '7.1.5-R1', R2 = '7.1.5-R2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const FUENFER = (start, schritte) => weg(-50, 50, start, schritte, { schritt: 5, beschriftung: 25 });
const P = { plus: true }, PB = { plus: true, form: 'b' };
const LUECKEN = [{ art: 'luecken' }];
const zeilen = (text, wahr, falsche, hilfen, extra = {}) => auswahl(text, [opt(wahr, true), ...falsche.map(([t, fv]) => opt(t, false, fv))], hilfen, { ...extra, nachweis: [AUSSAGEN] });
const sum = (...teile) => ohneKlammern(teile.map((x) => (typeof x === 'number' ? zt(x) : x)));

export function rechenvorteile() {
  // ================= R1: Klammern auflösen =================
  const hPM = (n, beispiel) => H(n, 'Plus und Minus wird Minus. Minus und Minus wird Plus.', beispiel, 'Schau auf die beiden Zeichen vor der Zahl. Sind sie gleich, wird es Plus. Sind sie verschieden, wird es Minus.');
  sechs(R1, 'F', [
    () => { const a = zz(4, 9), b = zz(2, 9), z = a - b;
      if (z === 0) return null;
      return luecken(Z('Schreibe ohne Klammer und rechne.', `${a} + (${zt(-b)}) = ${a} − {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a + b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(0, '6 + (−4) = 6 − 4 = 2.'), { bild: weg(-10, 10, a, [-b]), nachweis: LUECKEN }); },
    () => { const a = zz(1, 5), b = zz(2, 5), z = a + b;
      return luecken(Z('Schreibe ohne Klammer und rechne.', `${a} − (${zt(-b)}) = ${a} + {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a - b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(0, '3 − (−5) = 3 + 5 = 8.'), { bild: weg(-10, 10, a, [b]), nachweis: LUECKEN }); },
    () => { const a = zz(2, 8), b = zz(a + 1, a + 8), z = a - b;
      if (z < -10) return null;
      return zeilen(Z('Die Klammer soll weg.', 'Welche Zeile stimmt?'), `${a} + (${zt(-b)}) = ${a} − ${b}`, [[`${a} + (${zt(-b)}) = ${a} + ${b}`, 'minus-minus-uebersehen'], [`${a} + (${zt(-b)}) = ${zt(-a)} − ${b}`, 'vorzeichen-vergessen']],
        hPM(0, '7 + (−9) = 7 − 9. Plus und Minus wird Minus.'), { bild: weg(-10, 10, a, [-b]) }); },
    () => { const a = -zz(2, 8), b = zz(2, 9), z = a + b;
      if (z === 0) return null;
      return luecken(Z('Schreibe ohne Klammer und rechne.', `${zt(a)} − (${zt(-b)}) = ${zt(a)} + {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a - b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(0, '−2 − (−6) = −2 + 6 = 4.'), { bild: weg(-10, 10, a, [b]), nachweis: LUECKEN }); },
    () => { const a = zz(1, 5), b = zz(2, 5), m = `${a} − (${zt(-b)}) = ${a} ▢ ${b}`;
      return auswahl(Z('Welches Rechenzeichen fehlt?', m), [opt('+', true), opt('−', false, 'minus-minus-uebersehen')], hPM(0, '5 − (−3) = 5 + 3. Minus und Minus wird Plus.'), { bild: weg(-10, 10, a, [b]), nachweis: [{ art: 'einsetzen', muster: m }] }); },
    () => { const a = -zz(1, 4), b = zz(2, 5), z = a - b;
      return luecken(Z('Schreibe ohne Klammer und rechne.', `${zt(a)} + (${zt(-b)}) = ${zt(a)} − {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a + b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(0, '−4 + (−3) = −4 − 3 = −7.'), { bild: weg(-10, 10, a, [-b]), nachweis: LUECKEN }); },
  ]);
  const hMK = (n) => H(n, 'Minusklammer: Beim Auflösen dreht sich jedes Zeichen in der Klammer um.', '10 − (4 − 6) = 10 − 4 + 6 = 12.', 'Schreibe die Zahl vor der Klammer ab. Drehe dann das Zeichen vor jeder Zahl in der Klammer um.');
  sechs(R1, 'G', [
    () => { const a = 5 * zz(1, 6), b = 5 * zz(7, 14), z = a - b;
      if (z < -50) return null;
      return luecken(Z('Schreibe ohne Klammern und rechne.', `(+${a}) − (+${b}) = ${a} − {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a + b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(1, '(+15) − (+40) = 15 − 40 = −25.'), { bild: FUENFER(a, [-b]), nachweis: LUECKEN }); },
    () => { const a = -5 * zz(2, 9), b = 5 * zz(3, 12), z = a + b;
      if (z === 0 || z > 50) return null;
      return luecken(Z('Schreibe ohne Klammern und rechne.', `(${zt(a)}) − (${zt(-b)}) = ${zt(a)} + {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[a - b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) }, hPM(1, '(−30) − (−45) = −30 + 45 = 15.'), { bild: FUENFER(a, [b]), nachweis: LUECKEN }); },
    () => { const a = 5 * zz(2, 8), b = 5 * zz(3, 12), c = 5 * zz(1, 5), z = a - b + c;
      if (a - b < -50 || z === 0 || z === a) return null;
      return luecken(Z('Schreibe ohne Klammern und rechne.', `(+${a}) + (${zt(-b)}) − (${zt(-c)}) = ${a} − {{a}} + {{b}} = {{c}}`), { a: lk(b), b: lk(c), c: lk(z, [[a - b - c, 'minus-minus-uebersehen'], [a + b + c, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) },
        hPM(1, '(+15) + (−8) − (−5) = 15 − 8 + 5 = 12.'), { bild: FUENFER(a, [-b, c]), nachweis: LUECKEN }); },
    () => { const a = zz(30, 80), b = zz(8, 25), c = zz(5, 20), z = a - b - c;
      return luecken(Z('Löse die Minusklammer auf und rechne.', `${a} − (${b} + ${c}) = ${a} − ${b} − {{a}} = {{b}}`), { a: lk(c), b: lk(z, [[a - b + c, 'minusklammer'], [-z, 'vorzeichen-vergessen']]) },
        H(1, 'Minusklammer: Beim Auflösen dreht sich jedes Zeichen in der Klammer um.', '20 − (8 + 5) = 20 − 8 − 5 = 7.', 'Aus dem Plus in der Klammer wird ein Minus.'), { nachweis: LUECKEN }); },
    () => { const a = zz(10, 40), b = zz(4, 15), c = zz(b + 2, b + 20), l = `${a} − (${b} − ${c})`;
      return zeilen(Z('Die Minusklammer soll weg.', 'Welche Zeile stimmt?'), `${l} = ${a} − ${b} + ${c}`, [[`${l} = ${a} − ${b} − ${c}`, 'minusklammer'], [`${l} = ${a} + ${b} + ${c}`, 'minusklammer']], hMK(1)); },
    () => { const a = zz(12, 40), b = zz(5, 15), c = zz(b + 2, b + 20), l = `${a} − (${b} − ${c})`, name = kind(), stimmt = wahl([true, false, false]);
      const gut = `${l} = ${a} − ${b} + ${c}`, f1 = `${l} = ${a} − ${b} − ${c}`, f2 = `${l} = ${a} + ${b} + ${c}`;
      return urteil(Z(`${name} löst die Klammer auf:`, stimmt ? gut : f1, 'Stimmt das?'), stimmt, stimmt ? gut : f1, stimmt ? f1 : gut, [f2], 'minusklammer', hMK(1)); },
  ]);
  sechs(R1, 'M', [
    () => { const a = zz(105, 240), b = -zz(40, 95), c = -zz(25, 85), d = zz(30, 90), e = X('−', X('−', X('+', a, b), c), d);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[a + b + c - d, 'minus-minus-uebersehen'], [a - b - c - d, 'minus-minus-uebersehen'], [-val(e)[0], 'vorzeichen-vergessen']], H(2, 'Schreibe die Aufgabe zuerst ohne Klammern.', 'Gleiche Zeichen werden zu Plus, verschiedene Zeichen zu Minus. Rechne dann von links nach rechts.')); },
    () => { const a = zz(120, 480), b = zz(40, 95), c = zz(b + 20, b + 150), e = X('−', a, KL(X('−', b, c)));
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[a - b - c, 'minusklammer'], [a + b + c, 'minusklammer'], [a + b - c, 'minusklammer']], H(2, 'Minusklammer: Beim Auflösen dreht sich jedes Zeichen in der Klammer um.', 'Schreibe ohne Klammer: Aus der ersten Zahl in der Klammer wird Minus, aus dem Minus in der Klammer wird Plus.')); },
    () => { const a = D(-zz(105, 395), 2), b = D(-zz(12, 38)), c = D(-zz(15, 95), 2), e = X('+', X('−', a, b), c);
      if (a[1] !== 100 || c[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[plus(plus(a, b), c), 'minus-minus-uebersehen'], [neg(val(e)), 'vorzeichen-vergessen'], [minus(a, b), 'sach-schritt-vergessen']], H(2, 'Schreibe die Aufgabe zuerst ohne Klammern.', 'Aus − (−…) wird Plus, aus + (−…) wird Minus. Schreibe alle Zahlen mit zwei Nachkommastellen.')); },
    () => { const a = -zz(11, 30), b = zz(5, 20), c = -zz(3, 15), l = `(${zt(a)}) − (+${b}) + (${zt(c)})`;
      return zeilen('Die Klammern sollen weg. Welche Zeile stimmt?', `${l} = ${zt(a)} − ${b} − ${-c}`, [[`${l} = ${zt(a)} + ${b} − ${-c}`, 'minus-minus-uebersehen'], [`${l} = ${zt(a)} − ${b} + ${-c}`, 'minus-minus-uebersehen'], [`${l} = ${-a} − ${b} − ${-c}`, 'vorzeichen-vergessen']],
        H(2, 'Schau bei jeder Klammer auf das Zeichen davor und das Vorzeichen darin.', 'Verschiedene Zeichen ergeben Minus, gleiche Zeichen ergeben Plus. Die erste Zahl behält ihr Vorzeichen.')); },
    () => { const N = wahl([7, 9, 11, 13]), a = Q(-zz(1, N - 1), N), b = Q(-zz(1, N - 1), N), c = Q(-zz(1, N - 1), N), e = X('+', X('−', a, b), c);
      if ([a, b, c].some((x) => x[1] !== N) || istGanz(val(e))) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, [[plus(plus(a, b), c), 'minus-minus-uebersehen'], [neg(val(e)), 'vorzeichen-vergessen']], H(2, 'Schreibe die Aufgabe ohne Klammern. Der Nenner bleibt.', 'Aus − (−…) wird Plus. Rechne dann nur mit den Zählern.')); },
    () => { const a = zz(30, 90), b = zz(10, 40), c = -zz(b + 5, b + 60), e = X('−', a, KL(X('+', b, c))), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, {}, stimmt ? null : a - b + c, 'minusklammer', H(2, 'Bei der Minusklammer dreht sich jedes Zeichen in der Klammer um.', 'Berechne zur Kontrolle erst die Klammer. Subtrahiere dann ihr Ergebnis.'), { andere: [a - b + c, a + b + c, -(a - b - c)] }); },
  ]);
  sechs(R1, 'E', [
    () => { const a = D(-zz(1025, 1975), 2), b = D(zz(325, 875), 2), c = D(-zz(205, 695), 2), d = D(-zz(55, 145)), e = X('−', X('+', X('−', a, b), c), d);
      if ([a, b, c].some((x) => x[1] !== 100) || istGanz(d)) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[plus(minus(minus(a, b), neg(c)), d), 'minus-minus-uebersehen'], [neg(val(e)), 'vorzeichen-vergessen']], H(3, 'Schreibe die Aufgabe ohne Klammern. Fasse dann alle Minus-Zahlen zusammen.')); },
    () => { const a = zz(105, 240), b = zz(30, 95), c = zz(40, 120), d = zz(c + 20, c + 150), e = X('−', a, KL(X('−', b, KL(X('−', c, d)))));
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[a - b - c - d, 'minusklammer'], [a - b + c - d, 'minusklammer'], [a - b - c + d, 'minusklammer']], H(3, 'Arbeite von innen nach außen: erst die innere Klammer, dann die äußere.')); },
    () => { const [n1, n2, n3] = wahl([[2, 3, 4], [2, 4, 3], [3, 4, 2], [4, 3, 6], [2, 5, 10]]), a = Q(-1, n1), b = Q(1, n2), c = Q(n3 - 1, n3), e = X('−', a, KL(X('−', b, c)));
      if (val(e)[0] === 0) return null;
      return rechne(`Berechne: ${txt(e, { form: 'b' })} Kürze vollständig.`, e, { form: 'b' }, [[minus(minus(a, b), c), 'minusklammer'], [neg(val(e)), 'vorzeichen-vergessen']], H(3, 'Löse die Minusklammer auf oder berechne sie zuerst. Mache dann alle Brüche gleichnamig.')); },
    () => { const a = zz(20, 40), b = zz(8, 15), c = zz(3, 7), d = zz(2, 9);
      const varianten = [[`${a} − (${b} − ${c}) + ${d}`, a - (b - c) + d], [`${a} − (${b} − ${c} + ${d})`, a - (b - c + d)], [`${a} − ${b} − (${c} + ${d})`, a - b - (c + d)], [`(${a} − ${b}) − ${c} + ${d}`, a - b - c + d]];
      const [gut, ziel] = varianten[zz(0, 2)];
      if (varianten.filter(([, w]) => w === ziel).length !== 1) return null;
      return zeilen(`Wo muss die Klammer stehen, damit die Rechnung stimmt?`, `${gut} = ${ziel}`, varianten.filter(([t]) => t !== gut).map(([t]) => [`${t} = ${ziel}`, 'minusklammer']), H(3, 'Eine Klammer hinter einem Minus dreht alle Zeichen in ihr um. Rechne jede Zeile nach.')); },
    () => { const p = zz(105, 240), m = zz(250, 480), z = -zz(20, 95), x = z + m - p;
      if (x === 0) return null;
      return antwort(`Welche Zahl fehlt? ▢ − (−${p}) + (−${m}) = ${zt(z)}`, x, 'd', [[z - m + p, 'richtung-vertauscht'], [z + m + p, 'minus-minus-uebersehen'], [-x, 'vorzeichen-vergessen']], H(3, 'Schreibe die Aufgabe erst ohne Klammern. Rechne dann rückwärts.'), [`${zt(z)} − (−${m}) + (−${p}) = ${zt(x)}`]); },
    () => { const a = zz(12, 30), b = zz(31, 60), c = zz(40, 90);
      const roh = [[`−(${a} − ${b}) = −${a} + ${b}`, true], [`−(${a} + ${b}) = −${a} + ${b}`, false], [`${c} − (${a} − ${b}) = ${c} − ${a} + ${b}`, true], [`${c} + (${a} − ${b}) = ${c} + ${a} − ${b}`, true], [`${c} − (−${a} + ${b}) = ${c} − ${a} − ${b}`, false]];
      return auswahl('Welche Umformungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'minusklammer')), H(3, 'Plusklammern fallen einfach weg. Bei Minusklammern dreht sich jedes Zeichen in der Klammer um.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
  ]);

  // ================= R2: vorteilhaft ordnen =================
  const hT = (n, beispiel) => H(n, 'Die Zahlen dürfen die Plätze tauschen. Jede Zahl nimmt ihr Zeichen mit.', beispiel, 'Unterstreiche jede Zahl zusammen mit dem Zeichen davor. Tausche dann die Stücke.');
  sechs(R2, 'F', [
    () => { const a = zz(2, 8), b = zz(a + 1, 10), z = b - a;
      return luecken(Z('Die Zahlen dürfen die Plätze tauschen.', `${zt(-a)} + ${b} = ${b} − {{a}} = {{b}}`), { a: lk(a), b: lk(z, [[a + b, 'vorzeichen-vergessen'], [-z, 'vorzeichen-vergessen']]) }, hT(0, '−4 + 9 = 9 − 4 = 5.'), { bild: weg(-10, 10, -a, [b]), nachweis: LUECKEN }); },
    () => { const a = zz(3, 7), b = zz(1, 10 - a);
      if (a === b) return null;
      return luecken(Z('Eine Zahl und ihre Gegenzahl ergeben zusammen null.', `${a} + ${b} − ${a} = {{a}}`), { a: lk(b, [[2 * a + b, 'vorzeichen-vergessen'], [a + b, 'sach-schritt-vergessen']]) },
        H(0, 'Plus 6 und minus 6 heben sich auf.', '6 + 3 − 6 = 3.', 'Suche die Zahl, die einmal mit Plus und einmal mit Minus vorkommt. Streiche beide.'), { bild: weg(-10, 10, a, [b, -a]), nachweis: LUECKEN }); },
    () => { const a = zz(3, 8), b = zz(1, 9);
      if (a === b || b - a < -10) return null;
      return luecken(Z('Eine Zahl und ihre Gegenzahl ergeben zusammen null.', `${zt(-a)} + ${b} + ${a} = ${b} + {{a}} = {{b}}`), { a: lk(0, [[2 * a, 'vorzeichen-vergessen']]), b: lk(b, [[b + 2 * a, 'vorzeichen-vergessen'], [b - a, 'sach-schritt-vergessen']]) },
        H(0, 'Minus 7 und plus 7 heben sich auf.', '−7 + 4 + 7 = 4 + 0 = 4.', 'Suche die Zahl, die einmal mit Plus und einmal mit Minus vorkommt. Zusammen sind sie null.'), { bild: weg(-10, 10, -a, [b, a]), nachweis: LUECKEN }); },
    () => { const a = zz(2, 6), b = zz(a + 1, 10), l = `${zt(-a)} + ${b}`;
      return zeilen(Z('Die Zahlen tauschen die Plätze.', 'Welche Zeile stimmt?'), `${l} = ${b} − ${a}`, [[`${l} = ${a} − ${b}`, 'vorzeichen-vergessen'], [`${l} = ${zt(-b)} + ${a}`, 'vorzeichen-vergessen']], hT(0, '−3 + 7 = 7 − 3. Die 3 nimmt ihr Minus mit.'), { bild: weg(-10, 10, -a, [b]) }); },
    () => { const a = zz(6, 9), c = 10 - a, b = zz(3, 9);
      if (b === c || a - b < -10) return null;
      return luecken(Z('Rechne erst, was gut zusammenpasst.', `${a} − ${b} + ${c} = ${a} + ${c} − ${b} = {{a}} − ${b} = {{b}}`), { a: lk(10), b: lk(10 - b, [[a - b - c, 'vorzeichen-vergessen'], [10 + b, 'vorzeichen-vergessen']]) },
        H(0, 'Suche zwei Zahlen, die zusammen 10 ergeben. Rechne sie zuerst.', '8 − 5 + 2 = 8 + 2 − 5 = 10 − 5 = 5.', 'Tausche die Zahlen mit ihren Zeichen. Rechne erst plus, dann minus.'), { bild: weg(-10, 10, a, [-b, c]), nachweis: LUECKEN }); },
    () => { const a = zz(3, 7), c = 10 - a, b = zz(4, 9);
      if (a === c) return null;
      return luecken(Z('Fasse erst die Zahlen mit Minus zusammen.', `${zt(-a)} + ${b} − ${c} = ${b} − ${a} − ${c} = ${b} − {{a}} = {{b}}`), { a: lk(10), b: lk(b - 10, [[b - a + c, 'vorzeichen-vergessen'], [10 - b, 'vorzeichen-vergessen']]) },
        H(0, 'Zwei Zahlen mit Minus darfst du zusammenfassen. Hier ergeben sie zusammen 10.', '−6 + 9 − 4 = 9 − 6 − 4 = 9 − 10 = −1.', 'Addiere die beiden Zahlen, die ein Minus haben. Ziehe die Summe dann ab.'), { bild: weg(-10, 10, -a, [b, -c]), nachweis: LUECKEN }); },
  ]);
  sechs(R2, 'G', [
    () => { const a = zz(11, 49), c = 10 * zz(5, 9) - a, b = zz(6, 29);
      if (a % 10 === 0 || c < 2) return null;
      return luecken(Z('Ordne vorteilhaft und rechne.', `${a} − ${b} + ${c} = ${a} + ${c} − ${b} = {{a}} − ${b} = {{b}}`), { a: lk(a + c), b: lk(a + c - b, [[a - b - c, 'vorzeichen-vergessen'], [a + c + b, 'vorzeichen-vergessen']]) },
        H(1, 'Suche zwei Zahlen, die zusammen einen Zehner ergeben. Rechne sie zuerst.', '17 − 8 + 3 = 17 + 3 − 8 = 20 − 8 = 12.', 'Tausche die Zahlen mit ihren Zeichen. Rechne erst plus, dann minus.'), { nachweis: LUECKEN }); },
    () => { const a = 5 * zz(2, 6), c = 5 * zz(2, 6), b = 5 * zz(5, 9);
      if (b - a > 50 || b - a - c === 0 || a === c) return null;
      return luecken(Z('Ordne vorteilhaft und rechne.', `${zt(-a)} + ${b} − ${c} = ${b} − ${a} − ${c} = ${b} − {{a}} = {{b}}`), { a: lk(a + c), b: lk(b - a - c, [[b - a + c, 'vorzeichen-vergessen'], [a + c - b, 'vorzeichen-vergessen']]) },
        H(1, 'Fasse die beiden Zahlen mit Minus zusammen. Ziehe sie dann auf einmal ab.', '−25 + 40 − 15 = 40 − 25 − 15 = 40 − 40 = 0.', 'Addiere die Zahlen, die ein Minus haben. Subtrahiere ihre Summe von der Zahl mit Plus.'), { bild: FUENFER(-a, [b, -c]), nachweis: LUECKEN }); },
    () => { const a = 5 * zz(4, 9), b = 5 * zz(2, 6), c = 5 * zz(1, 5), z = c - b;
      if (z === 0 || a - b < -50) return null;
      return luecken(Z('Suche Zahl und Gegenzahl.', 'Rechne dann vorteilhaft.', `${a} − ${b} − ${a} + ${c} = ${c} − {{a}} = {{b}}`), { a: lk(b), b: lk(z, [[c + b, 'vorzeichen-vergessen'], [-z, 'vorzeichen-vergessen'], [2 * a + z, 'sach-schritt-vergessen']]) },
        H(1, 'Eine Zahl und ihre Gegenzahl heben sich auf.', '35 − 20 − 35 + 5 = 5 − 20 = −15.', 'Streiche die Zahl, die einmal mit Plus und einmal mit Minus vorkommt. Rechne mit dem Rest.'), { bild: FUENFER(a, [-b, -a, c]), nachweis: LUECKEN }); },
    () => { const a = zz(11, 15), c = 20 - a, b = zz(6, 18);
      if (c === a || b % 10 === 0 || a - b < -20) return null;
      return luecken(Z('Ordne vorteilhaft und rechne.', `${dt(D(a))} − ${dt(D(b))} + ${dt(D(c))} = ${dt(D(a))} + ${dt(D(c))} − ${dt(D(b))} = {{a}} − ${dt(D(b))} = {{b}}`), { a: lk(2), b: lkd(D(20 - b), [[D(a - b - c), 'vorzeichen-vergessen'], [D(20 + b), 'vorzeichen-vergessen']]) },
        H(1, 'Suche zwei Zahlen, die zusammen eine ganze Zahl ergeben. Rechne sie zuerst.', '1,5 − 0,8 + 0,5 = 1,5 + 0,5 − 0,8 = 2 − 0,8 = 1,2.', 'Tausche die Zahlen mit ihren Zeichen. Rechne erst plus, dann minus.'), { bild: wegZ(a, [-b, c]), nachweis: LUECKEN }); },
    () => { const a = zz(12, 28), b = zz(35, 60), c = zz(11, 29), l = `${zt(-a)} + ${b} − ${c}`;
      return zeilen(Z('Die Zahlen tauschen die Plätze.', 'Welche Zeile stimmt?'), `${l} = ${b} − ${a} − ${c}`, [[`${l} = ${b} − ${a} + ${c}`, 'vorzeichen-vergessen'], [`${l} = ${a} + ${b} − ${c}`, 'vorzeichen-vergessen']], hT(1, '−18 + 45 − 12 = 45 − 18 − 12. Jede Zahl nimmt ihr Zeichen mit.')); },
    () => { const a = zz(21, 49), c = 100 - a - zz(0, 4) * 10, b = zz(12, 38), d = 50 - b, z = a + c - b - d;
      if (c < 11 || d < 11 || z === 0) return null;
      return antwort(Z('Auf einem Konto gibt es vier Buchungen:', `${a} € dazu, ${b} € weg, ${c} € dazu, ${d} € weg.`, 'Um wie viel Euro ändert sich der Kontostand?', 'Ordne vorteilhaft.'), z, 'd', [[a + b + c + d, 'betraege-addiert'], [-z, 'vorzeichen-vergessen'], [a - b + c + d, 'vorzeichen-vergessen']],
        H(1, 'Fasse erst alles zusammen, was dazukommt. Fasse dann alles zusammen, was weggeht.', '45 + 55 = 100 und 28 + 22 = 50. Der Kontostand steigt um 50 €.', 'Addiere die beiden Zahlen mit Plus. Addiere die beiden Zahlen mit Minus. Ziehe die zweite Summe von der ersten ab.'), [`${a} + ${c} − ${b} − ${d} = ${zt(z)}`], { einheit: '€' }); },
  ]);
  sechs(R2, 'M', [
    () => { const a = zz(105, 240), c = 25 * zz(3, 9), b = 100 * zz(4, 9) - a - c + 100 * zz(0, 0), d = zz(110, 480);
      if (b < 30) return null;
      const z = -a + d - b - c;
      return antwort(`Berechne geschickt: ${sum(-a, d, -b, -c)}`, z, 'd', [[-z, 'vorzeichen-vergessen'], [a + d + b + c, 'betraege-addiert'], [-a + d + b + c, 'vorzeichen-vergessen']], H(2, 'Fasse alle Zahlen mit Minus zusammen. Sie ergeben hier einen glatten Hunderter.', 'Addiere die Beträge der drei negativen Zahlen. Ziehe die Summe von der positiven Zahl ab.'), [`${sum(-a, d, -b, -c)} = ${zt(z)}`]); },
    () => { const a = D(zz(105, 395), 2), c = minus(Q(zz(4, 6)), a), b = D(zz(12, 38)), d = minus(Q(zz(6, 8)), b), z = minus(plus(a, c), plus(b, d));
      if (a[1] !== 100 || istGanz(b) || c[0] <= 0 || d[0] <= 0) return null;
      const t = ohneKlammern([dt(a), `−${dt(b)}`, dt(c), `−${dt(d)}`]);
      return antwort(`Berechne geschickt: ${t}`, z, 'd', [[neg(z), 'vorzeichen-vergessen'], [plus(plus(a, c), plus(b, d)), 'betraege-addiert']], H(2, 'Suche Zahlen, die zusammen eine ganze Zahl ergeben.', 'Fasse die beiden positiven Zahlen zusammen und die beiden negativen. Verrechne dann.'), [`${t} = ${T(z)}`]); },
    () => { const a = zz(15, 40), b = zz(45, 90), c = zz(12, 38), l = sum(a, -b, c);
      const roh = mische([[`${l} = ${sum(a, c, -b)}`, true], [`${l} = ${sum(-b, a, c)}`, true], [`${l} = ${sum(b, -a, c)}`, false], [`${l} = ${sum(c, -b, a)}`, true], [`${l} = ${sum(a, -c, b)}`, false]]).slice(0, 4);
      if (roh.every(([, r]) => r) || !roh.some(([, r]) => r)) return null;
      return auswahl('Welche Umstellungen sind erlaubt? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'vorzeichen-vergessen')), H(2, 'Vertauschungsgesetz: Die Zahlen dürfen die Plätze tauschen, wenn jede ihr Zeichen mitnimmt.', 'Prüfe bei jeder Zeile: Hat jede Zahl noch dasselbe Zeichen vor sich wie am Anfang?'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
    () => { const a = zz(28, 95), b = zz(105, 240), c = zz(15, 75), e = kette('+', -a, b, a, -c);
      return rechne(`Berechne geschickt: ${txt(e, P)}`, e, P, [[b - c + 2 * a, 'vorzeichen-vergessen'], [b + c, 'minus-minus-uebersehen'], [c - b, 'vorzeichen-vergessen']], H(2, 'Suche eine Zahl und ihre Gegenzahl. Sie heben sich auf.', 'Streiche das Paar aus Zahl und Gegenzahl. Rechne mit den beiden übrigen Zahlen.')); },
    () => { const N = wahl([7, 9, 11, 13]), a = zz(1, N - 1), b = zz(1, N - 1), c = N - a, d = zz(1, N - 1), z = Q(-a + b - c + d, N);
      if (a === c || b === d) return null;
      const t = ohneKlammern([bt(Q(-a, N)), bt(Q(b, N)), bt(Q(-c, N)), bt(Q(d, N))]);
      if ([a, b, c, d].some((x) => Q(x, N)[1] !== N)) return null;
      if (b + d === a + c) return null; // Das Ergebnis soll ein Bruch sein, nicht null.
      return antwort(`Berechne geschickt: ${t} Kürze vollständig.`, z, 'b', [[neg(z), 'vorzeichen-vergessen'], [Q(a + b + c + d, N), 'betraege-addiert'], [Q(b + d, N), 'sach-schritt-vergessen']], H(2, 'Fasse die beiden negativen Brüche zusammen. Sie ergeben hier ein Ganzes.', 'Addiere erst die Zähler mit Minus, dann die Zähler mit Plus. Der Nenner bleibt.'), [`${t} = ${bt(z)}`]); },
    () => { const n = 2 * zz(6, 15);
      return antwort(`Berechne geschickt: 1 − 2 + 3 − 4 + … + ${n - 1} − ${n}\nBilde dazu Paare.`, -n / 2, 'd', [[n / 2, 'vorzeichen-vergessen'], [-n, 'sach-schritt-vergessen'], [-1, 'sach-schritt-vergessen']],
        H(2, 'Fasse immer zwei Nachbarn zu einem Paar zusammen: 1 − 2, dann 3 − 4 und so weiter.', 'Jedes Paar ergibt −1. Zähle, wie viele Paare es sind.'), [`${n} : 2 · (1 − 2) = ${zt(-n / 2)}`]); },
  ]);
  sechs(R2, 'E', [
    () => { const a = D(zz(1025, 1975), 2), c = minus(Q(zz(21, 29)), a), b = D(zz(52, 98)), d = minus(Q(zz(15, 19)), b), x = D(zz(3125, 4875), 3), z = minus(minus(plus(b, d), plus(a, c)), x);
      if (a[1] !== 100 || istGanz(b) || x[1] !== 1000) return null;
      const t = ohneKlammern([`−${dt(a)}`, dt(b), `−${dt(c)}`, dt(d), `−${dt(x)}`]);
      return antwort(`Berechne geschickt: ${t}`, z, 'd', [[neg(z), 'vorzeichen-vergessen'], [plus(plus(plus(a, c), plus(b, d)), x), 'betraege-addiert']], H(3, 'Suche Zahlen mit gleichem Vorzeichen, die zusammen eine ganze Zahl ergeben.'), [`${t} = ${T(z)}`]); },
    () => { const [n1, n2] = wahl([[3, 4], [5, 4], [3, 8], [7, 4], [5, 6]]), a = zz(1, n1 - 1), b = zz(1, n2 - 1), c = zz(1, n2 - 1), z = plus(Q(-1), Q(b + c, n2));
      if (Q(a, n1)[1] !== n1 || Q(b, n2)[1] !== n2 || Q(c, n2)[1] !== n2 || 2 * a === n1 || z[0] === 0) return null;
      const t = ohneKlammern([bt(Q(-a, n1)), bt(Q(b, n2)), bt(Q(a - n1, n1)), bt(Q(c, n2))]);
      return antwort(`Berechne geschickt: ${t} Kürze vollständig.`, z, 'b', [[neg(z), 'vorzeichen-vergessen'], [plus(Q(1), Q(b + c, n2)), 'betraege-addiert'], [Q(b + c, n2), 'sach-schritt-vergessen']], H(3, 'Ordne so, dass gleichnamige Brüche nebeneinander stehen. Dann musst du nichts erweitern.'), [`${t} = ${bt(z)}`]); },
    () => { const a = 10 * zz(105, 240), c = 1000 * zz(2, 4) - a, b = 10 * zz(210, 480), d = 1000 * zz(5, 8) - b, z = -a + b - c + d;
      if (c < 100 || z === 0) return null;
      return antwort(`Berechne geschickt: ${sum(-a, b, -c, d)}`, z, 'd', [[-z, 'vorzeichen-vergessen'], [a + b + c + d, 'betraege-addiert'], [-a + b + c + d, 'vorzeichen-vergessen']], H(3, 'Fasse erst die negativen und dann die positiven Zahlen zu glatten Tausendern zusammen.'), [`${sum(-a, b, -c, d)} = ${zt(z)}`]); },
    () => { const n = zz(15, 45), k = zz(2, 3), o = n + k, z = k === 2 ? 2 * o - 1 : 3 * o - 3;
      return antwort(`Berechne die Summe aller ganzen Zahlen von ${zt(-n)} bis ${o}.`, z, 'd', [[o - n, 'sach-schritt-vergessen'], [0, 'betrag-gegenzahl'], [o, 'sach-schritt-vergessen']], H(3, 'Jede Zahl hebt sich mit ihrer Gegenzahl auf. Übrig bleiben nur die Zahlen, die keinen Partner haben.'), [k === 2 ? `${o} − 1 + ${o} = ${z}` : `${o} − 2 + ${o} − 1 + ${o} = ${z}`]); },
    () => { const a = zz(35, 60), b = zz(70, 95), c = zz(15, 40), l = sum(a, -b, c), name = kind(), stimmt = wahl([true, false, false]);
      const gut = `${l} = ${sum(a, c, -b)}`, f1 = `${l} = ${sum(b, -a, c)}`, f2 = `${l} = ${sum(a, -c, b)}`;
      return urteil(`${name} stellt um: ${stimmt ? gut : f1}. Stimmt das?`, stimmt, stimmt ? gut : f1, stimmt ? f1 : gut, [f2], 'vorzeichen-vergessen', H(3, 'Beim Tauschen nimmt jede Zahl das Zeichen mit, das vor ihr steht.')); },
    () => { const a = D(zz(12, 48)), c = minus(Q(10), a), d = D(zz(15, 45)), x = minus(plus(a, c), d);
      if (istGanz(a) || istGanz(d)) return null;
      return antwort(`Welche Zahl fehlt? −${dt(a)} + ▢ − ${dt(c)} + ${dt(d)} = 0`, x, 'd', [[neg(x), 'vorzeichen-vergessen'], [plus(plus(a, c), d), 'betraege-addiert'], [plus(a, c), 'sach-schritt-vergessen']], H(3, 'Fasse zuerst alle bekannten Zahlen zusammen. Die fehlende Zahl ist die Gegenzahl dieser Summe.'), [`${dt(a)} + ${dt(c)} − ${dt(d)} = ${dt(x)}`]); },
  ]);
}
