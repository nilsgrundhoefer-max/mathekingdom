// Aufgaben zu 7.1.8 „Verbindung der Rechenarten“ (Lernziele T1, T2) nach ADR 0015 und ADR 0043.
// T1: Punkt vor Strich und Klammern mit rationalen Zahlen. T2: Ausmultiplizieren und Ausklammern.
// Grilling mit Nils (2026-11-24): Auf F und G steht der Rechenweg als Schritte da (Lückentext), ab M zählt nur das Ergebnis.
// F ganze Zahlen mit Bild, G bis ±100 (Ergebnisse auch größer), M zwei Nachkommastellen und Ausklammern, E Brüche, Potenzen, Fehlersuche und Rückwärtsaufgaben.
// Typische Fehler: von links nach rechts statt Punkt vor Strich, nur die erste Zahl in der Klammer malgenommen, Vorzeichen vergessen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, mal, durch, neg, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, gerade, weg, thermo, konto, H, X, KL, kette, val, txt, rechne, pruefe, huepfer, AUSSAGEN, kind, istGanz, istDezimal } from './7-1-rational.mjs';

const T1 = '7.1.8-T1', T2 = '7.1.8-T2';
const B = { form: 'b' };
const LUECKEN = [{ art: 'luecken' }];
const zeilen = (text, wahr, falsche, hilfen, extra = {}) => auswahl(text, [opt(wahr, true), ...falsche.map(([t, fv]) => opt(t, false, fv))], hilfen, { ...extra, nachweis: [AUSSAGEN] });
const k = (n) => (n < 0 ? `(${zt(n)})` : String(n));
const FUENFER = (start, schritte) => weg(-50, 50, start, schritte, { schritt: 5, beschriftung: 25 });
const TIEF = (start, schritte) => weg(-20, 5, start, schritte);
const hoch = (n) => String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

export function verbindung() {
  // ================= T1: Punkt vor Strich, Klammern =================
  const hP = (n, beispiel) => H(n, 'Punktrechnung kommt vor Strichrechnung: erst mal und geteilt, dann plus und minus.', beispiel, 'Unterstreiche die Malaufgabe oder die Geteiltaufgabe. Rechne sie zuerst aus.');
  const hK = (n, beispiel) => H(n, 'Was in der Klammer steht, rechnest du zuerst.', beispiel, 'Rechne erst die Klammer aus. Rechne dann mit dem Ergebnis weiter.');
  sechs(T1, 'F', [
    () => { const a = zz(1, 4), b = zz(2, 4), c = -zz(2, 5), p = b * c, z = a + p;
      if (p < -20) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${a} + ${b} · (${zt(c)}) = ${a} + ({{a}}) = {{b}}`), { a: lk(p, [[-p, 'vorzeichen-vergessen']]), b: lk(z, [[(a + b) * c, 'punkt-vor-strich'], [a - p, 'vorzeichen-vergessen']]) }, hP(0, '2 + 3 · (−4) = 2 + (−12) = −10.'), { bild: TIEF(a, [p]), nachweis: LUECKEN }); },
    () => { const a = -zz(6, 9), b = zz(2, 3), c = zz(2, 5), p = b * c, z = a + p;
      if (z === 0 || z > 10) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${zt(a)} + ${b} · ${c} = ${zt(a)} + {{a}} = {{b}}`), { a: lk(p), b: lk(z, [[(a + b) * c, 'punkt-vor-strich'], [-z, 'vorzeichen-vergessen']]) }, hP(0, '−8 + 2 · 5 = −8 + 10 = 2.'), { bild: weg(-10, 10, a, [p]), nachweis: LUECKEN }); },
    () => { const a = -zz(1, 4), b = zz(a * -1 + 2, 7), s = a + b, c = -zz(2, Math.floor(20 / s)), z = s * c;
      if (s < 2 || s > 5 || z < -20) return null;
      return luecken(Z('Rechne erst die Klammer.', `(${zt(a)} + ${b}) · (${zt(c)}) = {{a}} · (${zt(c)}) = {{b}}`), { a: lk(s, [[-s, 'vorzeichen-vergessen']]), b: lk(z, [[a + b * c, 'klammer-ignoriert'], [-z, 'vorzeichen-vergessen']]) }, hK(0, '(−2 + 5) · (−4) = 3 · (−4) = −12.'), { bild: huepfer(s, c), nachweis: LUECKEN }); },
    () => { const a = zz(4, 9), b = zz(2, 3), c = zz(2, 5), p = b * c, l = `${a} − ${b} · ${c}`;
      if (a - p < -10 || a === p) return null;
      return zeilen(Z('Rechne Punkt vor Strich.', 'Welche Zeile stimmt?'), `${l} = ${a} − ${p}`, [[`${l} = ${a - b} · ${c}`, 'punkt-vor-strich'], [`${l} = ${a} + ${p}`, 'vorzeichen-vergessen']], hP(0, '6 − 2 · 3 = 6 − 6 = 0. Erst kommt die Malaufgabe.'), { bild: weg(-10, 10, a, [-p]) }); },
    () => { const d = -zz(2, 5), q = -zz(2, 5), p = -d * q * -1, c = zz(2, 8), a = d * q, z = q + c;
      if (z === 0 || a > 20) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${a} : (${zt(d)}) + ${c} = {{a}} + ${c} = {{b}}`), { a: lk(q, [[-q, 'vorzeichen-division']]), b: lk(z, [[-q + c, 'vorzeichen-division']]) }, hP(0, '10 : (−2) + 3 = −5 + 3 = −2.'), { bild: weg(-10, 10, q, [c]), nachweis: LUECKEN }); },
    () => { const a = zz(2, 4), b = -zz(2, 4), c = zz(2, 5), p = a * b, z = p - c;
      if (z < -20) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${a} · (${zt(b)}) − ${c} = {{a}} − ${c} = {{b}}`), { a: lk(p, [[-p, 'vorzeichen-vergessen']]), b: lk(z, [[p + c, 'richtung-vertauscht'], [-p - c, 'vorzeichen-vergessen']]) }, hP(0, '4 · (−2) − 3 = −8 − 3 = −11.'), { bild: weg(-20, 0, p, [-c]), nachweis: LUECKEN }); },
  ]);
  sechs(T1, 'G', [
    () => { const a = -5 * zz(1, 5), b = zz(2, 5), c = -5 * zz(1, 3), p = b * c, z = a + p;
      if (z < -50) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${zt(a)} + ${b} · (${zt(c)}) = ${zt(a)} + ({{a}}) = {{b}}`), { a: lk(p, [[-p, 'vorzeichen-vergessen']]), b: lk(z, [[(a + b) * c, 'punkt-vor-strich'], [a - p, 'vorzeichen-vergessen']]) }, hP(1, '−15 + 4 · (−5) = −15 + (−20) = −35.'), { bild: FUENFER(a, [p]), nachweis: LUECKEN }); },
    () => { const a = -zz(11, 19), b = zz(2, 9), s = a + b, c = zz(3, 9), z = s * c;
      return luecken(Z('Rechne erst die Klammer.', `(${zt(a)} + ${b}) · ${c} = ({{a}}) · ${c} = {{b}}`), { a: lk(s, [[-s, 'vorzeichen-vergessen']]), b: lk(z, [[a + b * c, 'klammer-ignoriert'], [-z, 'vorzeichen-vergessen']]) }, hK(1, '(−12 + 4) · 5 = (−8) · 5 = −40.'), { nachweis: LUECKEN }); },
    () => { const a = 5 * zz(1, 4), b = zz(2, 5), c = -5 * zz(1, 2), p = b * c, z = a - p;
      if (z > 50) return null;
      return luecken(Z('Rechne Punkt vor Strich.', `${a} − ${b} · (${zt(c)}) = ${a} − ({{a}}) = ${a} + {{b}} = {{c}}`), { a: lk(p, [[-p, 'vorzeichen-vergessen']]), b: lk(-p, [[p, 'minus-minus-uebersehen']]), c: lk(z, [[a + p, 'minus-minus-uebersehen'], [(a - b) * c, 'punkt-vor-strich']]) },
        hP(1, '20 − 3 · (−10) = 20 − (−30) = 20 + 30 = 50.'), { bild: FUENFER(a, [-p]), nachweis: LUECKEN }); },
    () => { const d = zz(3, 9), q = -zz(3, 9), a = d * q, c = zz(3, 15), z = q - c;
      return luecken(Z('Rechne Punkt vor Strich.', `(${zt(a)}) : ${d} − ${c} = {{a}} − ${c} = {{b}}`), { a: lk(q, [[-q, 'vorzeichen-division']]), b: lk(z, [[q + c, 'richtung-vertauscht'], [-q - c, 'vorzeichen-division']]) }, hP(1, '(−36) : 4 − 6 = −9 − 6 = −15.'), { nachweis: LUECKEN }); },
    () => { const a = zz(5, 15), b = zz(2, 5), c = zz(2, 5), d = zz(c + 2, c + 6), l = `${a} − ${b} · (${c} − ${d})`;
      return zeilen(Z('Rechne erst die Klammer.', 'Welche Zeile stimmt?'), `${l} = ${a} − ${b} · (${zt(c - d)})`, [[`${l} = ${a - b} · (${c} − ${d})`, 'punkt-vor-strich'], [`${l} = ${a} − ${b * c} − ${d}`, 'verteilung-halb']], hK(1, '8 − 2 · (3 − 7) = 8 − 2 · (−4). Die Klammer kommt zuerst.')); },
    () => { const s = zz(2, 9), st = zz(3, 6), n = zz(2, 4), auf = zz(2, 6), z = s - st * n + auf;
      if (z >= 0 || s - st * n < -20) return null;
      return antwort(Z(`Mittags sind es ${s} °C.`, `Dann fällt die Temperatur ${st} Stunden lang jede Stunde um ${n} Grad.`, `Danach steigt sie um ${auf} Grad.`, 'Wie kalt ist es jetzt?'), z, 'd', [[(s - st) * n + auf, 'punkt-vor-strich'], [-z, 'vorzeichen-vergessen'], [s - st * n, 'sach-schritt-vergessen'], [s - st * n - auf, 'richtung-vertauscht']],
        H(1, 'Schreibe erst einen Rechenausdruck auf. Rechne dann Punkt vor Strich.', '6 + 5 · (−3) + 4 = 6 − 15 + 4 = −5.', 'Rechne erst aus, um wie viel Grad die Temperatur insgesamt fällt. Rechne dann von der Temperatur am Mittag aus weiter.'), [`${s} + ${st} · (−${n}) + ${auf} = ${zt(z)}`], { einheit: '°C', bild: thermo(-20, 10, 1, 5, [s, 'mittags']) }); },
  ]);
  sechs(T1, 'M', [
    () => { const a = -zz(15, 45), b = zz(3, 9), c = -zz(11, 25), q = -zz(3, 9), d = -zz(4, 9), e = X('−', X('+', a, X('·', b, c)), X(':', q * d * -1 * -1, d));
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[(a + b) * c - q, 'punkt-vor-strich'], [a - b * c - q, 'vorzeichen-vergessen'], [a + b * c + q, 'vorzeichen-division']], H(2, 'Punkt vor Strich: Berechne zuerst das Produkt und den Quotienten.', 'Ersetze beide Punktrechnungen durch ihre Ergebnisse. Rechne dann von links nach rechts.')); },
    () => { const a = -zz(11, 25), b = zz(30, 60), c = -zz(3, 9), d = zz(11, 40), e = X('+', X('·', X('+', a, b), c), d);
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[a + b * c + d, 'klammer-ignoriert'], [-(a + b) * c + d, 'vorzeichen-vergessen']], H(2, 'Klammer zuerst, dann Punkt vor Strich.', 'Berechne die Summe in der Klammer. Multipliziere dann und addiere zum Schluss.')); },
    () => { const a = D(zz(12, 48)), b = D(zz(12, 25)), c = D(-zz(2, 8)), e = X('−', a, X('·', b, c));
      if (istGanz(a) || !istDezimal(val(e), 2)) return null;
      return rechne(`Berechne: ${txt(e)}`, e, { stellen: 2 }, [[mal(minus(a, b), c), 'punkt-vor-strich'], [plus(a, mal(b, c)), 'minus-minus-uebersehen']].filter(([w]) => istDezimal(w, 2)), H(2, 'Punkt vor Strich. Das Produkt ist negativ.', 'Berechne zuerst das Produkt. Eine negative Zahl zu subtrahieren heißt, ihre Gegenzahl zu addieren.')); },
    () => { const q = zz(4, 12), d = -zz(3, 9), b = zz(3, 9), c = zz(4, 9), e = X('−', X(':', q * d, d), X('·', b, c));
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-q - b * c, 'vorzeichen-division'], [(q - b) * c, 'punkt-vor-strich'], [q + b * c, 'richtung-vertauscht']], H(2, 'Punkt vor Strich: erst der Quotient und das Produkt, dann die Differenz.', 'Minus geteilt durch Minus ergibt Plus. Subtrahiere dann das Produkt.')); },
    () => { const a = -zz(3, 9), b = zz(4, 9), c = -zz(3, 9), e = X('+', a, X('·', b, c)), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, {}, stimmt ? null : (a + b) * c, 'punkt-vor-strich', H(2, 'Punkt vor Strich gilt auch bei negativen Zahlen.', 'Berechne erst das Produkt. Addiere es dann zur ersten Zahl.'), { andere: [(a + b) * c, a - b * c, -(a + b * c)] }); },
    () => { const a = -zz(2, 6), b = zz(a * -1 + 2, 9), c = zz(2, 5), d = zz(c + 1, 9);
      const varianten = [[`(${zt(a)} + ${b}) · ${c} − ${d}`, (a + b) * c - d], [`${zt(a)} + ${b} · (${c} − ${d})`, a + b * (c - d)], [`(${zt(a)} + ${b}) · (${c} − ${d})`, (a + b) * (c - d)], [`${zt(a)} + (${b} · ${c} − ${d})`, a + b * c - d]];
      const [gut, ziel] = varianten[zz(0, 2)];
      if (varianten.filter(([, w]) => w === ziel).length !== 1) return null;
      return zeilen('Wo müssen die Klammern stehen, damit die Rechnung stimmt?', `${gut} = ${zt(ziel)}`, varianten.filter(([t]) => t !== gut).map(([t]) => [`${t} = ${zt(ziel)}`, 'klammer-falsch-gesetzt']), H(2, 'Eine Klammer ändert die Reihenfolge: Sie wird zuerst gerechnet.', 'Rechne jede Zeile nach: erst die Klammer, dann Punkt vor Strich.')); },
  ]);
  sechs(T1, 'E', [
    () => { const [a, b, c] = wahl([[Q(-1, 2), Q(3, 4), Q(-2, 3)], [Q(1, 3), Q(5, 6), Q(-2, 5)], [Q(-3, 4), Q(2, 3), Q(-3, 8)], [Q(-1, 6), Q(4, 5), Q(-5, 6)], [Q(1, 2), Q(3, 5), Q(-5, 9)]]), e = X('+', a, X('·', b, c));
      return rechne(`Berechne: ${txt(e, B)}${istGanz(val(e)) ? '' : ' Kürze vollständig.'}`, e, B, [[mal(plus(a, b), c), 'punkt-vor-strich'], [minus(a, mal(b, c)), 'vorzeichen-vergessen'], [neg(val(e)), 'vorzeichen-vergessen']], H(3, 'Punkt vor Strich: Multipliziere zuerst die beiden Brüche und kürze. Addiere dann.')); },
    () => { const a = -zz(2, 5), b = zz(2, 4), c = -zz(2, 5), z = a * a - b * c * c;
      return antwort(`Berechne: (${zt(a)})² − ${b} · (${zt(c)})²`, z, 'd', [[-a * a - b * c * c, 'minus-mal-minus'], [a * a + b * c * c, 'minus-mal-minus'], [(a * a - b) * c * c, 'punkt-vor-strich']], H(3, 'Die Reihenfolge ist: Potenzen, dann Punktrechnung, dann Strichrechnung.'), [`(${zt(a)})² − ${b} · (${zt(c)})² = ${zt(z)}`]); },
    () => { const a = zz(3, 9), b = zz(2, 5), c = zz(2, 9), d = -zz(2, 6), f = zz(2, 4), e = X('−', a, X('·', b, KL(X('−', c, X('·', d, f)))));
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[a - b * (c + d * f), 'minus-minus-uebersehen'], [(a - b) * (c - d * f), 'punkt-vor-strich'], [a - b * ((c - d) * f), 'punkt-vor-strich']], H(3, 'Arbeite von innen nach außen. Auch in der Klammer gilt Punkt vor Strich.')); },
    () => { const f = -zz(3, 9), x = zz(4, 15), p = zz(11, 40), z = x * f + p;
      return antwort(`Welche Zahl fehlt? ▢ · (${zt(f)}) + ${p} = ${zt(z)}`, x, 'd', [[-x, 'vorzeichen-division'], [(z + p) / f, 'richtung-vertauscht']].filter(([w]) => Number.isInteger(w)), H(3, 'Rechne rückwärts: erst die Strichrechnung rückgängig machen, dann die Punktrechnung.'), [`(${zt(z)} − ${p}) : (${zt(f)}) = ${x}`]); },
    () => { const b = D(wahl([15, 25, 35, 45])), c = wahl([2, 4, 6]), a = D(-zz(55, 95)), d = D(-wahl([5, 25])), e = X(':', KL(X('+', a, X('·', b, c))), d);
      if (!istDezimal(val(e), 2) || val(e)[0] === 0) return null;
      return rechne(`Berechne: ${txt(e)}`, e, { stellen: 2 }, [[neg(val(e)), 'vorzeichen-division'], [durch(mal(plus(a, b), c), d), 'punkt-vor-strich']].filter(([w]) => istDezimal(w, 2)), H(3, 'Berechne zuerst die Klammer, darin Punkt vor Strich. Dividiere zum Schluss und achte auf das Vorzeichen.')); },
    () => { const a = -zz(3, 9), b = zz(4, 9), d = zz(3, 9), q = -zz(3, 9), z = a * b - q;
      return antwort(`Subtrahiere vom Produkt aus ${zt(a)} und ${b} den Quotienten aus ${zt(q * d)} und ${d}.`, z, 'd', [[a * b + q, 'minus-minus-uebersehen'], [q - a * b, 'richtung-vertauscht'], [-a * b - q, 'vorzeichen-vergessen']], H(3, 'Schreibe zuerst einen Rechenausdruck auf. Produkt und Quotient werden vor der Subtraktion berechnet.'), [`(${zt(a)}) · ${b} − (${zt(q * d)}) : ${d} = ${zt(z)}`]); },
  ]);

  // ================= T2: Ausmultiplizieren und Ausklammern =================
  const hA = (n, beispiel) => H(n, 'Die Zahl vor der Klammer wird mit jeder Zahl in der Klammer malgenommen.', beispiel, 'Nimm erst die erste Zahl in der Klammer mal. Nimm dann die zweite Zahl mal. Rechne zum Schluss zusammen.');
  sechs(T2, 'F', [
    () => { const f = zz(2, 4), a = -zz(3, 6), b = zz(1, -a - 1), s = a + b;
      if (f * s < -20) return null;
      return luecken(Z('Rechne erst die Klammer.', `${f} · (${zt(a)} + ${b}) = ${f} · ({{a}}) = {{b}}`), { a: lk(s, [[-s, 'vorzeichen-vergessen'], [a - b, 'betraege-addiert']]), b: lk(f * s, [[-f * s, 'vorzeichen-vergessen'], [f * a + b, 'verteilung-halb']]) },
        H(0, 'Was in der Klammer steht, rechnest du zuerst.', '3 · (−4 + 2) = 3 · (−2) = −6.', 'Rechne erst die Klammer aus. Nimm das Ergebnis dann mal.'), { bild: huepfer(f, s), nachweis: LUECKEN }); },
    () => { const f = zz(2, 4), a = -zz(2, 5), b = zz(1, 3), p1 = f * a, p2 = f * b;
      if (p1 < -20 || a + b >= 0) return null;
      return luecken(Z(`Nimm jede Zahl in der Klammer mal ${f}.`, `${f} · (${zt(a)} + ${b}) = ${f} · (${zt(a)}) + ${f} · ${b} = {{a}} + {{b}} = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[b, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 + b, 'verteilung-halb'], [-(p1 + p2), 'vorzeichen-vergessen']]) },
        hA(0, '3 · (−4 + 2) = 3 · (−4) + 3 · 2 = −12 + 6 = −6.'), { bild: TIEF(p1, [p2]), nachweis: LUECKEN }); },
    () => { const f = zz(2, 3), a = -zz(2, 4), b = zz(3, 5), l = `${f} · (${zt(a)} + ${b})`;
      return zeilen(Z('Die Klammer soll weg.', 'Welche Zeile stimmt?'), `${l} = ${f} · (${zt(a)}) + ${f} · ${b}`, [[`${l} = ${f} · (${zt(a)}) + ${b}`, 'verteilung-halb'], [`${l} = ${zt(a)} + ${f} · ${b}`, 'verteilung-halb']],
        hA(0, '2 · (−3 + 5) = 2 · (−3) + 2 · 5. Beide Zahlen in der Klammer werden malgenommen.'), { bild: weg(-10, 10, f * a, [f * b]) }); },
    () => { const f = -zz(2, 3), a = zz(2, 4), b = zz(1, 2), p1 = f * a, p2 = f * b;
      return luecken(Z(`Nimm jede Zahl in der Klammer mal ${zt(f)}.`, `(${zt(f)}) · (${a} + ${b}) = (${zt(f)}) · ${a} + (${zt(f)}) · ${b} = {{a}} + ({{b}}) = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[-p2, 'vorzeichen-vergessen'], [b, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 + b, 'verteilung-halb'], [p1 - p2, 'vorzeichen-vergessen']]) },
        hA(0, '(−2) · (4 + 1) = (−2) · 4 + (−2) · 1 = −8 + (−2) = −10.'), { bild: weg(-20, 0, p1, [p2]), nachweis: LUECKEN }); },
    () => { const f = zz(2, 4), a = -zz(3, 5), b = zz(1, 2), z = f * (a + b);
      if (z < -20) return null;
      return luecken(Z('Welche Zahlen fehlen?', `${f} · (${zt(a)} + ${b}) = ${f} · (${zt(a)}) + {{a}} · ${b} = {{b}}`), { a: lk(f, [[1, 'verteilung-halb']]), b: lk(z, [[f * a + b, 'verteilung-halb'], [-z, 'vorzeichen-vergessen']]) },
        hA(0, '4 · (−3 + 1) = 4 · (−3) + 4 · 1 = −8.'), { bild: huepfer(f, a + b), nachweis: LUECKEN }); },
    () => { const f = zz(2, 3), a = zz(2, 5), b = zz(a + 1, a + 4), p1 = f * a, p2 = f * b;
      if (p1 > 10 || p1 - p2 < -10) return null;
      return luecken(Z(`Nimm jede Zahl in der Klammer mal ${f}.`, `${f} · (${a} − ${b}) = ${f} · ${a} − ${f} · ${b} = {{a}} − {{b}} = {{c}}`), { a: lk(p1), b: lk(p2, [[b, 'verteilung-halb']]), c: lk(p1 - p2, [[p1 - b, 'verteilung-halb'], [p2 - p1, 'vorzeichen-vergessen']]) },
        hA(0, '2 · (5 − 8) = 2 · 5 − 2 · 8 = 10 − 16 = −6.'), { bild: weg(-10, 10, p1, [-p2]), nachweis: LUECKEN }); },
  ]);
  const hM = (n, beispiel) => H(n, 'Ausmultiplizieren: Die Zahl vor der Klammer wird mit jeder Zahl in der Klammer malgenommen.', beispiel, 'Schreibe zwei Malaufgaben auf. Achte bei jeder auf das Vorzeichen. Rechne dann zusammen.');
  sechs(T2, 'G', [
    () => { const f = -zz(2, 5), a = wahl([20, 25, 30, 40, 50]), b = zz(2, 4), p1 = f * a, p2 = f * b;
      return luecken(Z('Multipliziere aus und rechne.', `(${zt(f)}) · (${a} + ${b}) = (${zt(f)}) · ${a} + (${zt(f)}) · ${b} = {{a}} + ({{b}}) = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[-p2, 'vorzeichen-vergessen'], [b, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 + b, 'verteilung-halb'], [p1 - p2, 'vorzeichen-vergessen']]) },
        hM(1, '(−4) · (25 + 2) = (−4) · 25 + (−4) · 2 = −100 + (−8) = −108.'), { nachweis: LUECKEN }); },
    () => { const f = 5, a = -wahl([10, 8, 6]), b = zz(1, 3), p1 = f * a, p2 = f * b;
      return luecken(Z('Multipliziere aus und rechne.', `${f} · (${zt(a)} + ${b}) = ${f} · (${zt(a)}) + ${f} · ${b} = {{a}} + {{b}} = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[b, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 + b, 'verteilung-halb'], [-(p1 + p2), 'vorzeichen-vergessen']]) },
        hM(1, '5 · (−10 + 3) = 5 · (−10) + 5 · 3 = −50 + 15 = −35.'), { bild: FUENFER(p1, [p2]), nachweis: LUECKEN }); },
    () => { const f = -wahl([3, 5]), a = wahl([10, 15, 20]), b = zz(2, 5) * (f === -3 ? 5 : 1), p1 = f * a, p2 = -f * b;
      if (p1 < -100 || b >= a) return null;
      return luecken(Z('Multipliziere aus und rechne.', `(${zt(f)}) · (${a} − ${b}) = (${zt(f)}) · ${a} − (${zt(f)}) · ${b} = {{a}} + {{b}} = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[-p2, 'minus-mal-minus'], [b, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 - p2, 'minus-mal-minus'], [p1 - b, 'verteilung-halb']]) },
        hM(1, '(−3) · (20 − 5) = (−3) · 20 − (−3) · 5 = −60 + 15 = −45.'), { bild: weg(-100, 0, p1, [p2], { schritt: 5, beschriftung: 25 }), nachweis: LUECKEN }); },
    () => { const f = -zz(2, 5), a = zz(6, 9), b = zz(2, 5), l = `(${zt(f)}) · (${a} − ${b})`;
      return zeilen(Z('Die Klammer soll weg.', 'Welche Zeile stimmt?'), `${l} = (${zt(f)}) · ${a} − (${zt(f)}) · ${b}`, [[`${l} = (${zt(f)}) · ${a} − ${b}`, 'verteilung-halb'], [`${l} = (${zt(f)}) · ${a} + (${zt(f)}) · ${b}`, 'vorzeichen-vergessen']],
        hM(1, '(−2) · (7 − 4) = (−2) · 7 − (−2) · 4. Das Minus in der Klammer bleibt stehen.')); },
    () => { const f = zz(3, 9), d = zz(1, 3), p1 = -100 * f, p2 = f * d;
      return luecken(Z('Zerlege geschickt und rechne.', `${f} · (${zt(-100 + d)}) = ${f} · (−100 + ${d}) = ${f} · (−100) + ${f} · ${d} = {{a}} + {{b}} = {{c}}`), { a: lk(p1, [[-p1, 'vorzeichen-vergessen']]), b: lk(p2, [[d, 'verteilung-halb']]), c: lk(p1 + p2, [[p1 - p2, 'vorzeichen-vergessen'], [p1 + d, 'verteilung-halb']]) },
        H(1, 'Zerlege die schwierige Zahl in einen glatten Hunderter und einen kleinen Rest.', '7 · (−98) = 7 · (−100 + 2) = −700 + 14 = −686.', 'Nimm erst den Hunderter mal. Nimm dann den Rest mal. Rechne zum Schluss zusammen.'), { nachweis: LUECKEN }); },
    () => { const m = zz(3, 6), ein = 5 * zz(2, 4), aus = ein + zz(2, 9), z = m * (ein - aus), was = wahl(['Handy', 'Sportverein', 'Musikschule']);
      return antwort(Z('Der Kontoauszug zeigt die Buchungen in einem Monat.', `Jeder Monat sieht gleich aus.`, `Um wie viel Euro ändert sich der Kontostand in ${m} Monaten?`, 'Schreibe das Ergebnis mit Vorzeichen.'), z, 'd', [[-z, 'vorzeichen-vergessen'], [m * ein - aus, 'verteilung-halb'], [ein - aus, 'sach-schritt-vergessen'], [m * (ein + aus), 'betraege-addiert']],
        H(1, 'Rechne erst aus, was in einem Monat übrig bleibt. Nimm das Ergebnis dann mit den Monaten mal.', '6 · (15 − 22) = 6 · (−7) = −42. Der Kontostand sinkt um 42 €.', 'Fasse die beiden Buchungen zusammen. Nimm das Ergebnis mit der Anzahl der Monate mal.'), [`${m} · (${ein} − ${aus}) = ${zt(z)}`], { einheit: '€', daten: konto(['Buchung', 'Euro'], [['Taschengeld', String(ein)], [was, zt(-aus)]]) }); },
  ]);
  sechs(T2, 'M', [
    () => { const f = -zz(3, 9), a = 10 * zz(2, 6), b = zz(2, 4), e = X('·', f, X('−', a, b));
      return rechne(`Multipliziere aus und berechne: ${txt(e)}`, e, {}, [[f * a - b, 'verteilung-halb'], [f * a + f * b, 'vorzeichen-vergessen'], [-f * (a - b), 'vorzeichen-vergessen']], H(2, 'Multipliziere den Faktor mit jeder Zahl in der Klammer.', 'Berechne beide Produkte mit Vorzeichen. Minus mal Minus ergibt Plus.')); },
    () => { const f = -zz(3, 9), a = zz(11, 19), b = 10 * zz(2, 4) - a, e = X('+', X('·', f, a), X('·', f, b));
      if (b < 2) return null;
      return rechne(`Klammere aus und berechne: ${txt(e)}`, e, {}, [[-val(e)[0], 'vorzeichen-vergessen'], [f * a + b, 'verteilung-halb'], [2 * f * (a + b), 'verteilung-halb']], H(2, 'In beiden Produkten steckt derselbe Faktor. Schreibe ihn vor eine Klammer.', 'Addiere die beiden anderen Zahlen in der Klammer. Multipliziere die Summe mit dem gemeinsamen Faktor.')); },
    () => { const f = -zz(3, 9), a = zz(11, 19), b = zz(2, 9), l = `(${zt(f)}) · ${a} + (${zt(f)}) · ${b}`;
      return zeilen(`Welcher Rechenausdruck ist gleich ${l}?`, `${l} = (${zt(f)}) · (${a} + ${b})`, [[`${l} = (${zt(f)}) · ${a} + ${b}`, 'verteilung-halb'], [`${l} = (${zt(2 * f)}) · (${a} + ${b})`, 'verteilung-halb'], [`${l} = (${zt(f)}) · ${a} · ${b}`, 'verteilung-halb']],
        H(2, 'Ausklammern: Der gemeinsame Faktor kommt einmal vor die Klammer.', 'Suche den Faktor, der in beiden Produkten vorkommt. In der Klammer bleiben die beiden anderen Zahlen mit ihrem Rechenzeichen.')); },
    () => { const f = D(-wahl([5, 15, 25])), a = zz(4, 9), b = D(zz(12, 28)), e = X('·', f, X('−', a, b));
      if (istGanz(b) || !istDezimal(val(e), 2)) return null;
      return rechne(`Multipliziere aus und berechne: ${txt(e)}`, e, { stellen: 2 }, [[minus(mal(f, a), b), 'verteilung-halb'], [neg(val(e)), 'vorzeichen-vergessen']].filter(([w]) => istDezimal(w, 2)), H(2, 'Multipliziere den Faktor mit jeder Zahl in der Klammer.', 'Berechne beide Produkte mit Vorzeichen. Fasse sie dann zusammen.')); },
    () => { const f = -zz(3, 9), a = zz(11, 19), s = 5 * zz(5, 8), b = s - a;
      return antwort(`Welche Zahl fehlt? (${zt(f)}) · ${a} + (${zt(f)}) · ▢ = (${zt(f)}) · ${s}`, b, 'd', [[s + a, 'richtung-vertauscht'], [-b, 'vorzeichen-vergessen']], H(2, 'Klammere den gemeinsamen Faktor aus. Dann siehst du, welche Summe in der Klammer stehen muss.', 'Die beiden Zahlen hinter dem gemeinsamen Faktor müssen zusammen die Zahl auf der rechten Seite ergeben.'), [`${s} − ${a} = ${b}`]); },
    () => { const f = zz(11, 19), a = -zz(31, 69), b = -100 - a, e = X('+', X('·', f, a), X('·', f, b));
      return rechne(`Berechne geschickt: ${txt(e)}`, e, {}, [[100 * f, 'vorzeichen-vergessen'], [f * a + b, 'verteilung-halb']], H(2, 'Klammere den gemeinsamen Faktor aus. Die Summe in der Klammer ist eine glatte Zahl.', 'Addiere die beiden negativen Zahlen. Multipliziere dann mit dem gemeinsamen Faktor.')); },
  ]);
  sechs(T2, 'E', [
    () => { const [n1, z1, n2, z2] = wahl([[4, 3, 6, 5], [3, 2, 4, 3], [6, 1, 4, 3], [3, 1, 6, 5], [2, 1, 3, 2]]), f = -12, e = X('·', f, X('−', Q(z1, n1), Q(z2, n2)));
      return rechne(`Multipliziere aus und berechne: ${txt(e, B)}`, e, B, [[neg(val(e)), 'vorzeichen-vergessen'], [minus(mal(f, Q(z1, n1)), Q(z2, n2)), 'verteilung-halb']], H(3, 'Multipliziere den Faktor mit jedem Bruch einzeln. Dabei lässt sich jedes Mal kürzen.')); },
    () => { const f = D(wahl([25, 15, 35, 45])), a = D(-zz(21, 48)), b = minus(Q(-10), a), e = X('+', X('·', f, a), X('·', f, b));
      if (istGanz(a)) return null;
      return rechne(`Berechne geschickt: ${txt(e)}`, e, {}, [[neg(val(e)), 'vorzeichen-vergessen'], [plus(mal(f, a), b), 'verteilung-halb']], H(3, 'Klammere den gemeinsamen Faktor aus. Die Summe in der Klammer ist eine glatte Zahl.')); },
    () => { const f = -zz(3, 6), a = zz(11, 19), b = zz(a + 10, a + 30), e = X('·', f, X('−', a, b)), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, {}, stimmt ? null : f * a - b, 'verteilung-halb', H(3, 'Der Faktor vor der Klammer gilt für jede Zahl in der Klammer. Prüfe zur Kontrolle, indem du erst die Klammer berechnest.'), { andere: [f * a - b, f * a + f * b, -(f * (a - b))] }); },
    () => { const a = zz(21, 48), b = 100 - a, x = D(-zz(15, 85)), z = mal(x, 100);
      if (istGanz(x)) return null;
      return antwort(`In beide Kästchen gehört dieselbe Zahl: ▢ · ${a} + ▢ · ${b} = ${T(z)}. Wie heißt die Zahl?`, x, 'd', [[neg(x), 'vorzeichen-division'], [durch(z, a), 'verteilung-halb']].filter(([w]) => istDezimal(w, 2)), H(3, 'Klammere die gesuchte Zahl aus. In der Klammer steht dann eine glatte Summe.'), [`${T(z)} : (${a} + ${b}) = ${dt(x)}`]); },
    () => { const a = zz(11, 19), b = zz(21, 39), f = -zz(3, 6), c = zz(4, 9), d = zz(11, 16), g = -zz(4, 9), u = zz(3, 6), v = 10 - u;
      const roh = [[`−${a} − ${b} = −(${a} + ${b})`, true], [`−${a} + ${b} = −(${a} + ${b})`, false], [`(${zt(f)}) · ${c} + (${zt(f)}) · ${d} = (${zt(f)}) · ${c + d}`, true], [`(${zt(f)}) · ${c} − (${zt(f)}) · ${d} = (${zt(f)}) · ${c + d}`, false], [`${u} · (${zt(g)}) + ${v} · (${zt(g)}) = 10 · (${zt(g)})`, true]];
      return auswahl('Welche Umformungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'verteilung-halb')), H(3, 'Beim Ausklammern muss jedes Glied durch den ausgeklammerten Faktor teilbar sein. Auch ein Minus lässt sich ausklammern.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
    () => { const s = -10 * zz(2, 6), m = zz(6, 14), ab = D(wahl([25, 35, 45])), auf = D(wahl([125, 175, 75]), 2), z = plus(Q(s), mal(m, minus(auf, ab)));
      if (!istDezimal(z, 2)) return null;
      return antwort(`Ein U-Boot ist bei ${zt(s)} m. Es sinkt ${m} Minuten lang jede Minute ${dt(ab)} m und steigt danach ${m} Minuten lang jede Minute ${dt(auf)} m. Bei welcher Höhe ist es dann?`, z, 'd', [[neg(z), 'vorzeichen-vergessen'], [plus(Q(s), mal(m, plus(auf, ab))), 'richtung-vertauscht'], [plus(Q(s), minus(auf, ab)), 'sach-schritt-vergessen']].filter(([w]) => istDezimal(w, 2)),
        H(3, 'Sinken und Steigen dauern gleich lang. Fasse beide Änderungen pro Minute zusammen und multipliziere dann.'), [`${zt(s)} + ${m} · (${dt(auf)} − ${dt(ab)}) = ${T(z)}`], { einheit: 'm' }); },
  ]);
}
