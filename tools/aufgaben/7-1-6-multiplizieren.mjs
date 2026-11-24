// Aufgaben zu 7.1.6 „Multiplizieren“ (Lernziele P1, P2) nach ADR 0015 und ADR 0043.
// P1: ganze Zahlen multiplizieren. P2: Dezimalzahlen und Brüche multiplizieren, auch mit mehreren Faktoren (auf F ganze Zahlen im Alltag).
// Grilling mit Nils (2026-11-24): F mit gleichen Sprüngen an der Zahlengeraden, G eine Nachkommastelle, M zwei Stellen, Brüche und die Regel
// „gerade Anzahl Minuszeichen ergibt Plus“, E Potenzen wie (−2)³, Fehlersuche und Rückwärtsaufgaben. Ab hier steht kein Plus mehr vor positiven Zahlen.
// Typische Fehler: Minus mal Minus bleibt Minus, das Vorzeichen fehlt, addiert statt malgenommen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, mal, durch, neg, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, lkd, gerade, weg, thermo, konto, H, X, kette, val, txt, glg, rechne, pruefe, aussagen, fMal, huepfer, ZEICHEN, VGL, AUSSAGEN, FREI, kind, istGanz, istDezimal } from './7-1-rational.mjs';

const P1 = '7.1.6-P1', P2 = '7.1.6-P2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const B = { form: 'b' };
const LUECKEN = [{ art: 'luecken' }];
const zeilen = (text, wahr, falsche, hilfen, extra = {}) => auswahl(text, [opt(wahr, true), ...falsche.map(([t, fv]) => opt(t, false, fv))], hilfen, { ...extra, nachweis: [AUSSAGEN] });
const hoch = (n) => String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

export function multiplizieren() {
  // ================= P1: ganze Zahlen =================
  const hF = (beispiel) => H(0, 'Malnehmen heißt: mehrmals denselben Sprung machen.', beispiel, 'Starte bei der Null. Zähle die Sprünge und lies das Ziel ab.');
  const hV = (n, beispiel) => H(n, 'Gleiche Vorzeichen ergeben Plus. Verschiedene Vorzeichen ergeben Minus.', beispiel, 'Bestimme zuerst das Vorzeichen. Rechne dann mit den Zahlen ohne Vorzeichen.');
  sechs(P1, 'F', [
    () => { const k = zz(2, 4), n = -zz(2, 5), e = X('·', k, n);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fMal(k, n), hF('3 · (−4) = −12. Das sind 3 Sprünge von je 4 nach links.'), { bild: huepfer(k, n) }); },
    () => { const k = zz(2, 4), n = -zz(2, 5), e = X('·', n, k);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fMal(n, k), H(0, 'Beim Malnehmen darfst du die Zahlen tauschen.', '(−5) · 3 = 3 · (−5) = −15.', 'Tausche die Zahlen. Mache dann die Sprünge an der Zahlengeraden.'), { bild: huepfer(k, n) }); },
    () => { const k = zz(3, 4), n = -zz(2, 5);
      return luecken(Z('Schreibe als Plusaufgabe und rechne.', `${k} · (${zt(n)}) = ${Array(k).fill(`(${zt(n)})`).join(' + ')} = {{a}}`), { a: lk(k * n, [[-k * n, 'vorzeichen-vergessen'], [k + n, '1x1-addiert']]) },
        hF('4 · (−3) = (−3) + (−3) + (−3) + (−3) = −12.'), { bild: huepfer(k, n), nachweis: LUECKEN }); },
    () => { const k = zz(2, 4), n = zz(2, Math.floor(10 / k)), z = -k * n;
      return antwort(Z('Jetzt sind es 0 °C.', `Die Temperatur sinkt jede Stunde um ${n} Grad.`, `Wie kalt ist es nach ${k} Stunden?`), z, 'd', [[-z, 'vorzeichen-vergessen'], [-(k + n), '1x1-addiert'], [-n, 'sach-schritt-vergessen']],
        H(0, 'Die Temperatur sinkt mehrmals um gleich viel. Das ist eine Malaufgabe mit einer negativen Zahl.', '4 · (−2) = −8. Nach 4 Stunden sind es −8 °C.', 'Zähle am Thermometer für jede Stunde gleich viele Striche nach unten.'), [`${k} · (−${n}) = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [0, 'jetzt']) }); },
    () => { const k = zz(2, 4), n = -zz(2, 5), z = k * n;
      return zeilen(Z('Schau auf die Zahlengerade.', 'Welche Rechnung passt zum Bild?'), `${k} · (${zt(n)}) = ${zt(z)}`, [[`${k} · ${-n} = ${zt(z)}`, 'vorzeichen-vergessen'], [`(${zt(-k)}) · (${zt(n)}) = ${zt(z)}`, 'minus-mal-minus']],
        hF('3 · (−4) = −12: 3 Sprünge, jeder geht 4 nach links.'), { bild: huepfer(k, n) }); },
    () => { const n = zz(2, 4);
      return luecken(Z('Setze die Reihe fort.', `2 · (${zt(-n)}) = ${zt(-2 * n)}`, `1 · (${zt(-n)}) = ${zt(-n)}`, `0 · (${zt(-n)}) = 0`, `(−1) · (${zt(-n)}) = {{a}}`, `(−2) · (${zt(-n)}) = {{b}}`), { a: lk(n, [[-n, 'minus-mal-minus']]), b: lk(2 * n, [[-2 * n, 'minus-mal-minus']]) },
        H(0, 'Von Zeile zu Zeile wird das Ergebnis immer um gleich viel größer.', '0 · (−3) = 0, danach kommt (−1) · (−3) = 3. Minus mal Minus ergibt Plus.', 'Schau auf die Punkte an der Zahlengeraden. Gehe immer denselben Schritt weiter nach rechts.'), { bild: ZG({ punkte: [-2 * n, -n, 0] }), nachweis: LUECKEN }); },
  ]);
  sechs(P1, 'G', [
    () => { const k = zz(3, 6), n = -5 * zz(2, 4), e = X('·', k, n);
      if (k * n < -100) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fMal(k, n), H(1, 'Malnehmen heißt: mehrmals denselben Sprung machen.', '4 · (−15) = −60. Das sind 4 Sprünge von je 15 nach links.', 'Rechne erst ohne Vorzeichen. Das Ergebnis ist negativ.'), { bild: weg(-100, 0, 0, Array(k).fill(n), { schritt: 5, beschriftung: 25 }) }); },
    () => { const a = -zz(3, 9), b = -zz(6, 12), e = X('·', a, b);
      return rechne(`Rechne: ${txt(e)}`, e, {}, fMal(a, b), hV(1, '(−6) · (−9) = 54. Minus mal Minus ergibt Plus.')); },
    () => { const s = 5 * zz(1, 3), n = zz(2, 4), k = zz(3, 6), z = s - k * n;
      if (z >= 0 || z < -20) return null;
      return antwort(Z(`Jetzt sind es ${s} °C.`, `Die Temperatur sinkt jede Stunde um ${n} Grad.`, `Wie kalt ist es nach ${k} Stunden?`), z, 'd', [[-z, 'vorzeichen-vergessen'], [s + k * n, 'richtung-vertauscht'], [-k * n, 'sach-schritt-vergessen']],
        H(1, 'Rechne erst aus, um wie viel Grad die Temperatur insgesamt sinkt.', '6 · (−3) = −18. Von 5 °C aus sind es dann 5 − 18 = −13 °C.', 'Nimm die Stunden mit den Grad mal. Ziehe das Ergebnis von der Temperatur ab.'), [`${s} + ${k} · (−${n}) = ${zt(z)}`], { einheit: '°C', bild: thermo(-20, 30, 5, 10, [s, 'jetzt']) }); },
    () => { const a = -zz(6, 12), b = -zz(4, 9), z = a * b;
      return zeilen('Welche Rechnung stimmt?', `(${zt(a)}) · (${zt(b)}) = ${z}`, [[`(${zt(a)}) · (${zt(b)}) = ${zt(-z)}`, 'minus-mal-minus'], [`(${zt(a)}) · (${zt(b)}) = ${zt(a + b)}`, '1x1-addiert']], hV(1, '(−12) · (−5) = 60. Gleiche Vorzeichen ergeben Plus.')); },
    () => { const k = zz(3, 5), n = 5 * zz(3, 9), was = wahl(['Sportverein', 'Musikschule', 'Handy', 'Busfahrkarte']), monate = ['Januar', 'Februar', 'März', 'April', 'Mai'], z = -k * n;
      return antwort(Z(`Der Kontoauszug zeigt ${k} gleiche Abbuchungen.`, 'Um wie viel Euro ändert sich der Kontostand?', 'Schreibe das Ergebnis mit Vorzeichen.'), z, 'd', [[-z, 'vorzeichen-vergessen'], [-n, 'sach-schritt-vergessen'], [-(k + n), '1x1-addiert']],
        H(1, 'Mehrmals dieselbe Abbuchung: Das ist eine Malaufgabe mit einer negativen Zahl.', '4 · (−25) = −100. Der Kontostand sinkt um 100 €.', 'Zähle die Zeilen. Nimm die Anzahl mit der Abbuchung mal.'), [`${k} · (−${n}) = ${zt(z)}`], { einheit: '€', daten: konto(['Buchung', 'Euro'], monate.slice(0, k).map((m) => [`${was} ${m}`, zt(-n)])) }); },
    () => { const f = -zz(3, 8), x = zn(3, 9), plusz = zz(5, 20), z = x * f + plusz;
      return antwort(Z('Ich denke mir eine Zahl.', `Ich nehme sie mit ${zt(f)} mal und addiere ${plusz}.`, `Ich erhalte ${zt(z)}.`, 'Wie heißt meine Zahl?'), x, 'd', [[-x, 'vorzeichen-division'], [(z + plusz) / f, 'richtung-vertauscht']].filter(([w]) => Number.isInteger(w)),
        H(1, 'Rechne rückwärts: erst die Addition rückgängig machen, dann das Malnehmen.', 'Zahl mal (−4) plus 10 ergibt −18. Rückwärts: −18 − 10 = −28 und −28 : (−4) = 7.', 'Ziehe erst die addierte Zahl ab. Teile dann durch die Zahl, mit der malgenommen wurde.'), [`(${zt(z)} − ${plusz}) : (${zt(f)}) = ${zt(x)}`]); },
  ]);
  sechs(P1, 'M', [
    () => { const a = -zz(11, 25), b = zz(12, 35), e = X('·', a, b);
      return rechne(`Berechne: ${txt(e)}`, e, {}, fMal(a, b), H(2, 'Verschiedene Vorzeichen ergeben Minus.', 'Multipliziere die Beträge. Schreibe dann das Minus davor.')); },
    () => { const a = -zz(2, 9), b = zz(2, 9), c = -zz(2, 9), e = kette('·', a, b, c);
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-a * b * c, 'minus-mal-minus'], [a + b + c, '1x1-addiert']], H(2, 'Zähle die Minuszeichen. Eine gerade Anzahl ergibt Plus.', 'Bestimme erst das Vorzeichen. Multipliziere dann die drei Beträge.')); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt) => { const a = zn(3, 12), b = zn(3, 12), z = a * b;
      if (a > 0 && b > 0) return null;
      return `${txt(X('·', a, b))} = ${zt(stimmt ? z : -z)}`; }, 'minus-mal-minus', H(2, 'Vorzeichenregel: Gleiche Vorzeichen ergeben Plus, verschiedene ergeben Minus.', 'Prüfe bei jeder Rechnung zuerst nur das Vorzeichen des Ergebnisses.')),
    () => { const a = -wahl([15, 25, 35, 45, 125]), b = -wahl([12, 16, 24, 32, 8]), e = X('·', a, b);
      return rechne(`Berechne: ${txt(e)}`, e, {}, fMal(a, b), H(2, 'Gleiche Vorzeichen ergeben Plus.', 'Multipliziere die Beträge. Das Ergebnis ist positiv.')); },
    () => { const fs = [zn(2, 9), zn(2, 9), zn(2, 9), zn(2, 9)], minusse = fs.filter((x) => x < 0).length, l = fs.map((x, i) => (x < 0 ? `(${zt(x)})` : String(x))).join(' · ');
      if (minusse < 2) return null;
      return auswahl(`Entscheide ohne zu rechnen. Welches Zeichen passt? ${l} ▢ 0`, ZEICHEN(minusse % 2 ? -1 : 1, 'minus-mal-minus'), H(2, 'Zähle die Minuszeichen. Eine gerade Anzahl ergibt Plus, eine ungerade Anzahl ergibt Minus.', 'Zähle nur die negativen Faktoren. Entscheide dann, ob das Produkt über oder unter null liegt.'), { nachweis: [VGL(l, '0')] }); },
    () => { const a = -zz(2, 9), b = zz(2, 9), c = zn(2, 9), p = a * b * c;
      return antwort(`Das Produkt aus drei Zahlen ist ${zt(p)}. Zwei der Faktoren sind ${zt(a)} und ${b}. Wie heißt der dritte Faktor?`, c, 'd', [[-c, 'vorzeichen-division']], H(2, 'Fasse die beiden bekannten Faktoren zusammen. Löse dann mit der Umkehraufgabe.', 'Multipliziere die bekannten Faktoren. Teile das Produkt durch dieses Ergebnis und achte auf das Vorzeichen.'), [`${zt(p)} : ((${zt(a)}) · ${b}) = ${zt(c)}`]); },
  ]);
  sechs(P1, 'E', [
    () => { const b = -zz(2, 5), n = b === -2 ? zz(3, 7) : b === -3 ? zz(3, 5) : zz(2, 4), z = b ** n;
      return antwort(`Berechne die Potenz: (${zt(b)})${hoch(n)}`, z, 'd', [[-z, 'minus-mal-minus'], [b * n, 'potenz-mal-exponent'], [-b * n, 'potenz-mal-exponent']], H(3, 'Schreibe die Potenz als Produkt gleicher Faktoren. Zähle dann die Minuszeichen.'), [`(${zt(b)})${hoch(n)} = ${zt(z)}`]); },
    () => { const fs = [-zz(2, 5), -zz(2, 5), -zz(2, 4), zz(2, 5), -1], e = kette('·', ...fs), z = val(e)[0];
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-z, 'minus-mal-minus'], [fs.reduce((s, x) => s + x, 0), '1x1-addiert']], H(3, 'Bestimme erst das Vorzeichen: Zähle die negativen Faktoren. Multipliziere dann die Beträge geschickt.')); },
    () => { const a = -zz(11, 19), b = -zz(11, 15), e = X('·', a, b), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, {}, stimmt ? null : -a * b, 'minus-mal-minus', H(3, 'Prüfe zuerst das Vorzeichen. Gleiche Vorzeichen ergeben Plus.'), { andere: [-a * b, a + b, a * b + 10] }); },
    () => { const n = 2 * zz(5, 24) + wahl([0, 1]), m = wahl([3, 4, 5]), z = (n % 2 ? -1 : 1) * (-2) ** m;
      return antwort(`Berechne geschickt: (−1)${hoch(n)} · (−2)${hoch(m)}`, z, 'd', [[-z, 'minus-mal-minus'], [-n * -2 * m, 'potenz-mal-exponent'], [2 ** m === Math.abs(z) ? n * 2 * m : null, 'potenz-mal-exponent']], H(3, 'Eine Potenz von −1 ist 1 oder −1. Es kommt nur darauf an, ob die Hochzahl gerade oder ungerade ist.'), [`(−1)${hoch(n)} · (−2)${hoch(m)} = ${zt(z)}`]); },
    () => { const b = zz(2, 5), n = wahl([2, 4]), l = `(−${b})${hoch(n)}`, r = `−${b}${hoch(n)}`;
      return auswahl(`Welches Zeichen passt? ${l} ▢ ${r}`, ZEICHEN(1, 'minus-mal-minus'), H(3, 'Mit Klammer gehört das Minus zur Basis und wird mit potenziert. Ohne Klammer wird erst potenziert, dann kommt das Minus davor.'), { nachweis: [VGL(l, r)] }); },
    () => auswahl('Welche Aussage stimmt immer?', [opt('Das Produkt von vier negativen Zahlen ist positiv.', true), opt('Das Produkt von drei negativen Zahlen ist positiv.', false, 'minus-mal-minus'), opt('Ein Produkt ist immer größer als jeder seiner Faktoren.', false, 'mal-macht-groesser'),
      opt('Wechselt ein Faktor sein Vorzeichen, bleibt das Produkt gleich.', false, 'vorzeichen-vergessen'), opt('Eine Zahl mit sich selbst malgenommen kann negativ sein.', false, 'minus-mal-minus')],
      H(3, 'Zähle bei jeder Aussage die Minuszeichen oder suche ein Gegenbeispiel.'), { nachweis: [FREI('Vorzeichenregel beim Multiplizieren: Eine gerade Anzahl negativer Faktoren ergibt ein positives Produkt.')] }),
  ]);

  // ================= P2: Dezimalzahlen, Brüche, mehrere Faktoren (F: ganze Zahlen im Alltag) =================
  sechs(P2, 'F', [
    () => { const k = 2, n = -zz(6, 9), e = X('·', k, n);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fMal(k, n), hF('2 · (−7) = −14. Das sind 2 Sprünge von je 7 nach links.'), { bild: huepfer(k, n) }); },
    () => { const k = zz(2, 5), n = zz(2, Math.floor(20 / k)), z = -k * n;
      return antwort(Z(`Ein Taucher sinkt jede Minute ${n} m tiefer.`, 'Er startet an der Wasseroberfläche bei 0 m.', `Bei welcher Höhe ist er nach ${k} Minuten?`), z, 'd', [[-z, 'vorzeichen-vergessen'], [-(k + n), '1x1-addiert'], [-n, 'sach-schritt-vergessen']],
        H(0, 'Der Taucher sinkt mehrmals gleich weit. Das ist eine Malaufgabe mit einer negativen Zahl.', '3 · (−4) = −12. Er ist bei −12 m.', 'Mache für jede Minute einen Sprung nach links. Lies das Ziel ab.'), [`${k} · (−${n}) = ${zt(z)}`], { einheit: 'm', bild: huepfer(k, -n) }); },
    () => { const k = zz(2, 4), n = zz(3, 5), z = -k * n, name = kind();
      return antwort(Z(`${name} hat 0 € auf dem Konto.`, `${name} leiht sich ${k}-mal ${n} €.`, 'Wie hoch ist der Kontostand jetzt?'), z, 'd', [[-z, 'vorzeichen-vergessen'], [-(k + n), '1x1-addiert'], [-n, 'sach-schritt-vergessen']],
        H(0, 'Geliehenes Geld sind Schulden. Schulden sind eine negative Zahl.', '3 · (−5) = −15. Der Kontostand ist −15 €.', 'Mache für jedes Leihen einen Sprung nach links. Lies das Ziel ab.'), [`${k} · (−${n}) = ${zt(z)}`], { einheit: '€', bild: huepfer(k, -n) }); },
    () => { const k = zz(3, 4), n = -zz(2, 5);
      return luecken(Z('Schreibe als Malaufgabe und rechne.', `${Array(k).fill(`(${zt(n)})`).join(' + ')} = {{a}} · (${zt(n)}) = {{b}}`), { a: lk(k), b: lk(k * n, [[-k * n, 'vorzeichen-vergessen'], [k + n, '1x1-addiert']]) },
        hF('(−4) + (−4) + (−4) = 3 · (−4) = −12.'), { bild: huepfer(k, n), nachweis: LUECKEN }); },
    () => { const a = zz(2, 3), b = zz(2, 5), z = a * b;
      if (z > 10) return null;
      return zeilen(Z('Schau auf die Punkte an der Zahlengeraden.', 'Welche Rechnung stimmt?'), `(${zt(-a)}) · (${zt(-b)}) = ${z}`, [[`(${zt(-a)}) · ${b} = ${z}`, 'vorzeichen-vergessen'], [`${a} · (${zt(-b)}) = ${z}`, 'vorzeichen-vergessen']],
        H(0, 'Minus mal Minus ergibt Plus. Minus mal Plus ergibt Minus.', '(−2) · (−5) = 10 und (−2) · 5 = −10.', 'Schau auf die Vorzeichen. Nur bei gleichen Vorzeichen ist das Ergebnis positiv.'), { bild: ZG({ punkte: [-z, z] }) }); },
    () => { const n = -zz(2, 5), e = kette('·', 2, 2, n);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, [[-4 * n, 'vorzeichen-vergessen'], [2 * n, 'sach-schritt-vergessen'], [4 + n, '1x1-addiert']], H(0, 'Rechne erst die ersten beiden Zahlen. Nimm das Ergebnis dann mit der dritten Zahl mal.', '2 · 2 · (−3) = 4 · (−3) = −12.', 'Zähle die Sprünge an der Zahlengeraden. Lies das Ziel ab.'), { bild: huepfer(4, n) }); },
  ]);
  sechs(P2, 'G', [
    () => { const k = zz(3, 4), n = -zz(3, 5), e = X('·', k, D(n));
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fMal(k, D(n)), H(1, 'Malnehmen heißt: mehrmals denselben Sprung machen.', '3 · (−0,4) = −1,2. Das sind 3 Sprünge von je 0,4 nach links.', 'Rechne erst ohne Vorzeichen und ohne Komma. Setze dann Komma und Minus.'), { bild: gerade(-20, 0, 1, 10, { teiler: 10, start: 0, spruenge: Array(k).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text: `−${dt(D(-n))}` })) }) }); },
    () => { const a = D(-zz(2, 9)), b = zz(3, 9), e = X('·', a, b);
      return rechne(`Rechne: ${txt(e)}`, e, {}, fMal(a, b), hV(1, '(−0,5) · 8 = −4. Verschiedene Vorzeichen ergeben Minus.')); },
    () => { const a = D(-zz(11, 25)), b = -zz(2, 6), e = X('·', a, b);
      if (istGanz(a)) return null;
      return rechne(`Rechne: ${txt(e)}`, e, {}, fMal(a, b), hV(1, '(−1,2) · (−3) = 3,6. Minus mal Minus ergibt Plus.')); },
    () => { const k = zz(3, 6), n = wahl([5, 15]), z = D(-k * n);
      if (k * n > 100) return null;
      return antwort(Z('Jetzt sind es 0 °C.', `Die Temperatur sinkt jede Stunde um ${dt(D(n))} Grad.`, `Wie kalt ist es nach ${k} Stunden?`), z, 'd', [[neg(z), 'vorzeichen-vergessen'], [D(-n), 'sach-schritt-vergessen']],
        H(1, 'Die Temperatur sinkt mehrmals um gleich viel. Das ist eine Malaufgabe mit einer negativen Zahl.', '4 · (−1,5) = −6. Nach 4 Stunden sind es −6 °C.', 'Nimm die Stunden mit den Grad mal. Das Ergebnis ist negativ.'), [`${k} · (−${dt(D(n))}) = ${dt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [0, 'jetzt']) }); },
    () => { const k = zz(4, 6), n = -zz(3, 6), z = k * n;
      if (z < -40) return null;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${k} · ({{a}}) = ${dt(D(z))}`), { a: lkd(D(n), [[D(-n), 'vorzeichen-division']]) },
        H(1, 'Alle Sprünge sind gleich lang. Wie lang ist ein Sprung?', '5 · (−0,7) = −3,5, denn 5 Sprünge von je 0,7 nach links führen zu −3,5.', 'Zähle die Striche unter einem Bogen. Jeder Strich ist ein Zehntel.'), { bild: gerade(-40, 0, 1, 10, { teiler: 10, start: 0, spruenge: Array(k).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text: '?' })) }), nachweis: LUECKEN }); },
    () => { const f = -zz(2, 5), x = zz(2, 8), p = D(zz(5, 25)), z = plus(Q(x * f), p);
      if (istGanz(p)) return null;
      return antwort(Z('Ich denke mir eine Zahl.', `Ich nehme sie mit ${zt(f)} mal und addiere ${dt(p)}.`, `Ich erhalte ${dt(z)}.`, 'Wie heißt meine Zahl?'), x, 'd', [[-x, 'vorzeichen-division']],
        H(1, 'Rechne rückwärts: erst die Addition rückgängig machen, dann das Malnehmen.', 'Zahl mal (−3) plus 1,5 ergibt −4,5. Rückwärts: −4,5 − 1,5 = −6 und −6 : (−3) = 2.', 'Ziehe erst die addierte Zahl ab. Teile dann durch die Zahl, mit der malgenommen wurde.'), [`(${dt(z)} − ${dt(p)}) : (${zt(f)}) = ${x}`]); },
  ]);
  const bruch = (z, n) => { const b = Q(z, n); return b[1] === n ? b : null; };
  sechs(P2, 'M', [
    () => { const a = D(-zz(12, 95)), b = D(zz(2, 9)), e = X('·', a, b);
      if (istGanz(a) || !istDezimal(val(e), 2)) return null;
      return rechne(`Berechne: ${txt(e)}`, e, { stellen: 2 }, fMal(a, b).filter(([w]) => istDezimal(w, 2)), H(2, 'Verschiedene Vorzeichen ergeben Minus.', 'Multipliziere ohne Komma und ohne Vorzeichen. Setze dann das Komma und das Minus.')); },
    () => { const [n1, n2] = wahl([[3, 5], [4, 5], [5, 7], [3, 7], [2, 9]]), a = bruch(-zz(1, n1 - 1), n1), b = bruch(-zz(1, n2 - 1), n2);
      if (!a || !b) return null;
      const e = X('·', a, b);
      return rechne(`Berechne: ${txt(e, B)} Kürze vollständig.`, e, B, [[neg(val(e)), 'minus-mal-minus'], [Q(a[0] * b[0], a[1] + b[1]), 'bruch-mal-nenner-mit']], H(2, 'Zähler mal Zähler, Nenner mal Nenner. Gleiche Vorzeichen ergeben Plus.', 'Bestimme erst das Vorzeichen. Multipliziere dann die Zähler und die Nenner.')); },
    () => { const a = D(-wahl([5, 15, 25])), b = wahl([2, 4, 6, 8]), c = D(-wahl([5, 15, 12, 25])), e = kette('·', a, b, c);
      if (!istDezimal(val(e), 2)) return null;
      return rechne(`Berechne: ${txt(e)}`, e, { stellen: 2 }, [[neg(val(e)), 'minus-mal-minus']], H(2, 'Zähle die Minuszeichen. Eine gerade Anzahl ergibt Plus.', 'Rechne erst zwei Faktoren zusammen, die ein glattes Ergebnis geben. Bestimme das Vorzeichen am Schluss.')); },
    () => { const n = wahl([3, 4, 5, 6, 8]), a = bruch(-zz(1, n - 1), n), k = n * zz(2, 5);
      if (!a) return null;
      const e = X('·', a, k);
      return rechne(`Berechne: ${txt(e, B)}`, e, B, [[neg(val(e)), 'vorzeichen-vergessen'], [Q(a[0], n * k), 'bruch-mal-nenner-mit']], H(2, 'Ganze Zahl mal Zähler, der Nenner bleibt. Kürze, bevor du rechnest.', 'Teile die ganze Zahl durch den Nenner. Nimm das Ergebnis mit dem Zähler mal. Das Vorzeichen ist Minus.')); },
    () => { const fs = [D(-zz(11, 25)), Q(-zz(2, 5)), D(-zz(2, 8)), Q(zz(2, 4))].map((x, i) => (i === 2 && wahl([true, false]) ? neg(x) : x)), minusse = fs.filter((x) => x[0] < 0).length, l = fs.map((x) => (x[0] < 0 ? `(${T(x)})` : T(x))).join(' · ');
      return auswahl(`Entscheide ohne zu rechnen. Welches Zeichen passt? ${l} ▢ 0`, ZEICHEN(minusse % 2 ? -1 : 1, 'minus-mal-minus'), H(2, 'Zähle die Minuszeichen. Eine gerade Anzahl ergibt Plus, eine ungerade Anzahl ergibt Minus.', 'Zähle nur die negativen Faktoren. Die Größe der Zahlen spielt für das Vorzeichen keine Rolle.'), { nachweis: [VGL(l, '0')] }); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt, i) => { const a = i % 2 ? D(zn(2, 9)) : bruch(zn(1, 2), 3) ?? Q(-1, 3), b = i % 2 ? Q(zn(2, 9)) : bruch(zn(1, 4), 5) ?? Q(1, 5), z = mal(a, b);
      if (a[0] > 0 && b[0] > 0) return null;
      const f = i % 2 ? 'd' : 'b';
      return `${txt(X('·', a, b), { form: f })} = ${T(stimmt ? z : neg(z), f)}`; }, 'minus-mal-minus', H(2, 'Vorzeichenregel: Gleiche Vorzeichen ergeben Plus, verschiedene ergeben Minus.', 'Prüfe bei jeder Rechnung zuerst nur das Vorzeichen des Ergebnisses.')),
  ]);
  sechs(P2, 'E', [
    () => { const [g, n1, z2, n2] = wahl([[1, 2, 2, 3], [1, 3, 3, 8], [2, 2, 2, 5], [1, 4, 2, 5], [2, 3, 3, 4], [1, 5, 5, 9]]), a = neg(plus(Q(g), Q(1, n1))), b = Q(z2, n2), e = X('·', a, b);
      return rechne(`Berechne: ${txt(e, B)} Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-vergessen'], [neg(plus(Q(g), mal(Q(1, n1), b))), 'gemischt-getrennt-mal']], H(3, 'Wandle die gemischte Zahl zuerst in einen Bruch um. Kürze über Kreuz, bevor du multiplizierst.')); },
    () => { const [a, x] = wahl([[Q(-3, 4), D(8)], [Q(-2, 5), D(15)], [Q(-5, 6), D(12)], [Q(-3, 8), D(4)], [Q(-2, 3), D(6)]]), y = wahl([x, neg(x)]), z = mal(a, y);
      if (istGanz(z)) return null;
      return antwort(`Berechne: (${bt(a)}) · ${y[0] < 0 ? `(${dt(y)})` : dt(y)} Gib das Ergebnis als vollständig gekürzten Bruch an.`, z, 'b', [[neg(z), y[0] < 0 ? 'minus-mal-minus' : 'vorzeichen-vergessen']], H(3, 'Wandle die Dezimalzahl in einen Bruch um. Kürze dann über Kreuz.'), [`(${bt(a)}) · ${y[0] < 0 ? `(${dt(y)})` : dt(y)} = ${bt(z)}`]); },
    () => { const [b, tb, n] = wahl([[D(-2), '−0,2', 3], [D(-5), '−0,5', 3], [D(-3), '−0,3', 2], [D(-1), '−0,1', 3], [D(-4), '−0,4', 2], [D(-15), '−1,5', 2]]);
      let z = Q(1); for (let i = 0; i < n; i++) z = mal(z, b);
      return antwort(`Berechne die Potenz: (${tb})${hoch(n)}`, z, 'd', [[neg(z), 'minus-mal-minus'], [mal(b, n), 'potenz-mal-exponent'], [mal(z, 10), 'dezimal-stelle']], H(3, 'Schreibe die Potenz als Produkt gleicher Faktoren. Zähle die Minuszeichen und die Nachkommastellen.'), [`(${tb})${hoch(n)} = ${dt(z)}`]); },
    () => { const [a, b] = wahl([[Q(-2, 3), Q(-3, 4)], [Q(-3, 5), Q(-5, 6)], [Q(-4, 7), Q(-7, 8)], [Q(-2, 5), Q(-5, 8)]]), e = X('·', a, b), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, B, stimmt ? null : neg(val(e)), 'minus-mal-minus', H(3, 'Prüfe zuerst das Vorzeichen, dann den Wert. Kürzen über Kreuz spart Arbeit.'), { andere: [neg(val(e)), Q(a[0] * b[0], a[1] + b[1]), plus(a, b)] }); },
    () => { const fs = [Q(-2), D(5), Q(-4), D(-25), Q(zz(3, 7))], e = kette('·', ...fs);
      return rechne(`Berechne geschickt: ${txt(e)}`, e, {}, [[neg(val(e)), 'minus-mal-minus']], H(3, 'Zähle die negativen Faktoren. Fasse dann Faktoren zusammen, die glatte Zahlen ergeben.')); },
    () => { const [g, n1, z2, n2] = wahl([[1, 2, 3, 4], [1, 3, 2, 3], [2, 2, 5, 6], [1, 4, 5, 8]]), b = neg(plus(Q(g), Q(1, n1))), p = Q(z2, n2), a = durch(p, b);
      return antwort(`Welche Zahl fehlt? ▢ · (${bt(b)}) = ${bt(p)} Kürze vollständig.`, a, 'b', [[neg(a), 'vorzeichen-division'], [mal(p, b), 'bruch-kehrwert']], H(3, 'Löse mit der Umkehraufgabe: Teile das Produkt durch den bekannten Faktor. Durch einen Bruch teilst du mit dem Kehrwert.'), [`${bt(p)} : (${bt(b)}) = ${bt(a)}`]); },
  ]);
}
