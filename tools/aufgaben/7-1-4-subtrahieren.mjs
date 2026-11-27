// Aufgaben zu 7.1.4 „Subtrahieren“ (Lernziele S1, S2) nach ADR 0015 und ADR 0043.
// S1: ganze Zahlen subtrahieren. S2: Dezimalzahlen und Brüche subtrahieren (auf F mehrere Sprünge mit ganzen Zahlen).
// Grilling mit Nils (2026-11-24): F bis ±20 mit Sprüngen an der Zahlengeraden, G bis ±100 und eine Nachkommastelle mit der Schreibweise (+15),
// M zwei Stellen und gleichnamige Brüche, E ungleichnamige Brüche, Fehlersuche und Rückwärtsaufgaben.
// Typische Fehler: bei 3 − (−5) das zweite Minus übersehen, das Vorzeichen des Ergebnisses vergessen, in die falsche Richtung gehen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, betrag, gleich, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, lkd, gerade, weg, wegZ, thermo, H, X, kette, val, txt, rechne, pruefe, aussagen, fSub, AUSSAGEN, FREI, kind, istGanz } from './7-1-rational.mjs';

const S1 = '7.1.4-S1', S2 = '7.1.4-S2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const P = { plus: true }, PB = { plus: true, form: 'b' };

export function subtrahieren() {
  // ================= S1: ganze Zahlen =================
  const hF = (beispiel) => H(0, 'Starte bei der ersten Zahl. Minus heißt: nach links gehen.', beispiel, 'Lege den Finger auf die erste Zahl. Gehe so viele Schritte, wie der Bogen zeigt.');
  const hGegen = (n, beispiel) => H(n, 'Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren. Aus Minus und Minus wird Plus.', beispiel, 'Schreibe erst die Plusaufgabe mit der Gegenzahl. Rechne dann.');
  sechs(S1, 'F', [
    () => { const a = zz(1, 6), z = -zz(1, 8), b = a - z, e = X('−', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fSub(a, b), hF('3 − 7 = −4. Du gehst von 3 aus 7 Schritte nach links.'), { bild: weg(-10, 10, a, [-b]) }); },
    () => { const a = -zz(1, 5), b = zz(2, 5), e = X('−', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fSub(a, b), hF('−2 − 5 = −7. Du gehst von −2 aus 5 Schritte nach links.'), { bild: weg(-10, 10, a, [-b]) }); },
    () => { const a = zz(1, 5), b = -zz(2, 5), e = X('−', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fSub(a, b), hGegen(0, '4 − (−3) = 4 + 3 = 7.'), { bild: weg(-10, 10, a, [-b]) }); },
    () => { const a = zz(1, 6), b = zz(a + 1, a + 8), z = a - b;
      if (z < -10) return null;
      return antwort(Z(`Abends sind es ${a} °C.`, `In der Nacht wird es ${b} Grad kälter.`, 'Wie kalt ist es in der Nacht?'), z, 'd', fSub(a, b),
        H(0, 'Kälter heißt: Die Säule sinkt. Du rechnest minus.', '3 − 8 = −5. In der Nacht sind es −5 °C.', 'Zähle am Thermometer von der Säule aus nach unten. Zähle über die Null hinweg.'), [`${a} − ${b} = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [a, 'abends']) }); },
    () => { const a = zz(1, 5), b = zz(a + 1, a + 6), z = a - b;
      if (-a - b === z || a + b === z) return null;
      return auswahl(Z('Schau auf die Zahlengerade.', 'Welche Rechnung passt zum Bild?'), [opt(`${a} − ${b} = ${zt(z)}`, true), opt(`${a} − (${zt(-b)}) = ${zt(z)}`, false, 'minus-minus-uebersehen'), opt(`${zt(-a)} − ${b} = ${zt(z)}`, false, 'vorzeichen-vergessen')],
        H(0, 'Der Bogen startet bei der ersten Zahl. Er geht nach links: Es wird eine positive Zahl subtrahiert.', '2 − 6 = −4: Start bei 2, 6 Schritte nach links, Ziel −4.', 'Lies den Start, die Richtung und das Ziel ab. Prüfe damit jede Rechnung.'), { bild: weg(-10, 10, a, [-b]), nachweis: [AUSSAGEN] }); },
    () => { const a = -zz(4, 8), b = -zz(1, 6), e = X('−', a, b);
      if (a === b) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fSub(a, b), hGegen(0, '−6 − (−4) = −6 + 4 = −2.'), { bild: weg(-10, 10, a, [-b]) }); },
  ]);
  sechs(S1, 'G', [
    () => { const a = 5 * zz(1, 6), b = 5 * zz(7, 14), e = X('−', a, b);
      if (a - b < -50) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fSub(a, b), H(1, 'Eine positive Zahl subtrahieren heißt: nach links gehen.', '(+15) − (+40) = 15 − 40 = −25.', 'Gehe erst bis zur Null. Gehe dann den Rest nach links weiter.'), { bild: weg(-50, 50, a, [-b], { schritt: 5, beschriftung: 25 }) }); },
    () => { const a = -5 * zz(2, 9), b = -5 * zz(3, 12), e = X('−', a, b);
      if (a === b || a - b > 50) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fSub(a, b), hGegen(1, '(−25) − (−45) = −25 + 45 = 20.'), { bild: weg(-50, 50, a, [-b], { schritt: 5, beschriftung: 25 }) }); },
    () => { const a = -zz(12, 48), b = -zz(11, 39), z = a - b;
      if (z === 0) return null;
      return luecken(Z('Schreibe als Plusaufgabe und rechne.', `(${zt(a)}) − (${zt(b)}) = (${zt(a)}) + {{a}} = {{b}}`), { a: lk(-b, [[b, 'minus-minus-uebersehen']]), b: lk(z, [[a + b, 'minus-minus-uebersehen'], [-z, 'vorzeichen-vergessen']]) },
        hGegen(1, '(−24) − (−13) = (−24) + 13 = −11.'), { nachweis: [{ art: 'luecken' }] }); },
    () => { const t = zz(18, 45), g = zz(t + 3, t + 30), z = t - g, v = wahl(['Der FC Blau', 'Die Mannschaft der 7b', 'Der SV Grün', 'Das Team Rot']);
      return antwort(Z(`${v} hat ${t} Tore geschossen.`, `Die Gegner haben ${g} Tore geschossen.`, 'Wie groß ist die Tordifferenz?'), z, 'd', [[-z, 'vorzeichen-vergessen'], [t + g, 'betraege-addiert']],
        H(1, 'Tordifferenz heißt: eigene Tore minus Tore der Gegner. Sie kann negativ sein.', '20 Tore geschossen, 26 Gegentore: 20 − 26 = −6.', 'Ziehe die Tore der Gegner von den eigenen Toren ab. Achte auf das Vorzeichen.'), [`${t} − ${g} = ${zt(z)}`]); },
    () => { const m = 5 * zz(1, 5), n = -5 * zz(1, 4), z = m - n;
      return antwort(Z('Die Thermometer zeigen die Temperatur mittags und nachts.', 'Wie groß ist der Temperaturunterschied?'), z, 'd', [[m + n, 'abstand-ueber-null'], [-z, 'vorzeichen-vergessen'], [Math.abs(m + n) || null, 'abstand-ueber-null']],
        H(1, 'Der Unterschied geht über die Null hinweg. Du rechnest: hohe Temperatur minus tiefe Temperatur.', '15 − (−10) = 15 + 10 = 25. Der Unterschied ist 25 Grad.', 'Zähle von der tiefen Säule bis zur Null. Zähle dann weiter bis zur hohen Säule.'), [`${m} − (${zt(n)}) = ${z}`], { einheit: 'Grad', bild: thermo(-20, 30, 5, 10, [m, 'mittags'], [n, 'nachts']) }); },
    () => { const b = zz(25, 60), z = -zz(5, 30), a = z + b;
      return antwort(Z(`Von einer Zahl werden ${b} subtrahiert.`, `Das Ergebnis ist ${zt(z)}.`, 'Wie heißt die Zahl?'), a, 'd', [[z - b, 'richtung-vertauscht'], [-a, 'vorzeichen-vergessen'], [b - z, 'vorzeichen-vergessen']],
        H(1, 'Rechne rückwärts: Gehe vom Ergebnis aus wieder nach rechts.', 'Eine Zahl minus 30 ergibt −10. Die Zahl ist 20, denn −10 + 30 = 20.', 'Addiere zum Ergebnis die Zahl, die subtrahiert wurde.'), [`${zt(z)} + ${b} = ${zt(a)}`]); },
  ]);
  sechs(S1, 'M', [
    () => { const a = -zz(105, 240), b = zz(40, 95), c = -zz(25, 85), e = kette('−', a, b, c);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[a - b + c, 'minus-minus-uebersehen'], [-(a - b - c), 'vorzeichen-vergessen'], [a + b - c, 'richtung-vertauscht']], H(2, 'Schreibe jede Subtraktion als Addition der Gegenzahl.', 'Aus − (+80) wird − 80, aus − (−45) wird + 45. Rechne dann von links nach rechts.')); },
    () => { const b = -zz(15, 60), z = zz(5, 40), a = z + b;
      if (a === 0) return null;
      return antwort(`Welche Zahl fehlt? ▢ − (${zt(b)}) = ${z}`, a, 'd', [[z - b, 'minus-minus-uebersehen'], [-a, 'vorzeichen-vergessen']], H(2, 'Löse mit der Umkehraufgabe: Ergebnis plus Subtrahend.', 'Addiere zum Ergebnis die negative Zahl. Das ist ein Schritt nach links.'), [`${z} + (${zt(b)}) = ${zt(a)}`]); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt) => { const a = zn(11, 60), b = zn(11, 60), z = a - b, f = wahl([a + b, -z]);
      if ((a > 0 && b > 0 && a > b) || (!stimmt && f === z)) return null;
      return `${txt(X('−', a, b), P)} = ${zt(stimmt ? z : f)}`; }, 'minus-minus-uebersehen', H(2, 'Schreibe jede Aufgabe als Plusaufgabe mit der Gegenzahl.', 'Wandle erst um, zum Beispiel (−20) − (−5) = −20 + 5. Rechne dann nach.')),
    () => { const a = zz(120, 480), b = zz(a + 40, a + 400), e = X('−', a, b);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, fSub(a, b), H(2, 'Der Subtrahend ist größer als der Minuend. Das Ergebnis ist negativ.', 'Ziehe die kleinere Zahl von der größeren ab. Schreibe ein Minus vor das Ergebnis.')); },
    () => { const a = -zz(25, 95), b = -zz(105, 240), z = a - b;
      return antwort(`Der Minuend ist ${zt(a)}, der Subtrahend ist ${zt(b)}. Berechne die Differenz.`, z, 'd', fSub(a, b), H(2, 'Differenz heißt: Minuend minus Subtrahend.', 'Schreibe die Aufgabe mit Klammern auf. Wandle sie dann in eine Plusaufgabe um.'), [`${zt(a)} − (${zt(b)}) = ${zt(z)}`]); },
    () => { const z = -zz(15, 60), b = -zz(40, 120), a = z + b;
      return antwort(`Die Differenz von zwei Zahlen ist ${zt(z)}. Der Subtrahend ist ${zt(b)}. Wie heißt der Minuend?`, a, 'd', [[z - b, 'minus-minus-uebersehen'], [-a, 'vorzeichen-vergessen'], [b - z, 'richtung-vertauscht']],
        H(2, 'Minuend minus Subtrahend ergibt die Differenz. Rückwärts: Differenz plus Subtrahend.', 'Addiere die Differenz und den Subtrahenden. Beide sind negativ.'), [`${zt(z)} + (${zt(b)}) = ${zt(a)}`]); },
  ]);
  sechs(S1, 'E', [
    () => { const a = -zz(1150, 2900), b = zz(1100, 3200), c = -zz(450, 980), d = -zz(1200, 2400), e = kette('−', a, b, c, d);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[a - b + c + d, 'minus-minus-uebersehen'], [-(a - b - c - d), 'vorzeichen-vergessen'], [a - b - c + d, 'minus-minus-uebersehen']], H(3, 'Schreibe die Aufgabe ohne Klammern. Fasse dann alle Minus-Zahlen und alle Plus-Zahlen zusammen.')); },
    () => { const a = -zz(125, 480), b = -zz(60, 240), e = X('−', a, b), z = a - b, stimmt = wahl([true, false, false]);
      if (z >= 0) return null;
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, P, stimmt ? null : a + b, 'minus-minus-uebersehen', H(3, 'Eine negative Zahl subtrahieren heißt, ihre Gegenzahl zu addieren.'), { andere: [a + b, -z, -(a + b)] }); },
    () => { const a = -zz(210, 480), c = zz(105, 190), z = -zz(40, 160), b = a - c - z;
      if (b >= 0) return null;
      return antwort(`Welche Zahl fehlt? (${zt(a)}) − ▢ − (+${c}) = ${zt(z)}`, b, 'd', [[-b, 'vorzeichen-vergessen'], [a + c - z, 'richtung-vertauscht'], [a - z, 'sach-schritt-vergessen']], H(3, 'Fasse zuerst zusammen, was du kennst. Überlege dann, was subtrahiert werden muss.'), [`${zt(a)} − ${c} − (${zt(z)}) = ${zt(b)}`]); },
    () => auswahl('Welche Aussage stimmt immer?', [opt('Wer eine negative Zahl subtrahiert, erhält mehr als den Minuenden.', true), opt('Die Differenz von zwei negativen Zahlen ist negativ.', false, 'minus-minus-uebersehen'), opt('Beim Subtrahieren wird das Ergebnis immer kleiner als der Minuend.', false, 'minus-minus-uebersehen'),
      opt('Minuend und Subtrahend dürfen die Plätze tauschen.', false, 'gesetz-auf-subtraktion'), opt('Die Differenz von zwei positiven Zahlen ist positiv.', false, 'sub-kleiner-von-groesser')],
      H(3, 'Suche zu jeder Aussage ein Gegenbeispiel mit kleinen Zahlen.'), { hinweise: { 'gesetz-auf-subtraktion': 'Probiere es mit zwei Zahlen aus: Was ergibt 3 − 5? Was ergibt 5 − 3?', 'sub-kleiner-von-groesser': 'Probiere es mit zwei Zahlen aus: Was ergibt 3 − 5?', 'minus-minus-uebersehen': 'Suche ein Gegenbeispiel, zum Beispiel (−2) − (−5).' }, nachweis: [FREI('Regeln zum Subtrahieren ganzer Zahlen: Eine negative Zahl zu subtrahieren heißt, ihre Gegenzahl zu addieren.')] }),
    () => { const h = zz(1250, 2900), t = zz(210, 480), d = zz(60, 190), z = h + t + d;
      return antwort(`Eine Berghütte liegt ${h} m über dem Meeresspiegel. Ein Tal liegt ${t} m unter dem Meeresspiegel. Der Boden eines Sees im Tal liegt noch ${d} m tiefer. Wie groß ist der Höhenunterschied zwischen Hütte und Seeboden?`, z, 'd',
        [[h - t - d, 'abstand-ueber-null'], [h + t, 'sach-schritt-vergessen'], [h + t - d, 'richtung-vertauscht']], H(3, 'Bestimme zuerst die Höhe des Seebodens als negative Zahl. Subtrahiere sie von der Höhe der Hütte.'), [`−${t} − ${d} = ${zt(-t - d)}`, `${h} − (${zt(-t - d)}) = ${z}`], { einheit: 'm' }); },
    () => { const p = -zz(105, 240), m = zz(250, 480), z = -zz(20, 95), x = z + m + p;
      if (x === 0) return null;
      return antwort(`Von einer Zahl wird erst ${zt(p)} subtrahiert und dann ${m}. Das Ergebnis ist ${zt(z)}. Wie heißt die Zahl?`, x, 'd', [[z + m - p, 'minus-minus-uebersehen'], [z - m - p, 'richtung-vertauscht'], [-x, 'vorzeichen-vergessen']],
        H(3, 'Rechne rückwärts: Mache erst die zweite Subtraktion rückgängig, dann die erste.'), [`${zt(z)} + ${m} + (${zt(p)}) = ${zt(x)}`]); },
  ]);

  // ================= S2: Dezimalzahlen und Brüche (F: mehrere Sprünge) =================
  sechs(S2, 'F', [
    () => { const a = zz(2, 6), b = zz(a + 1, a + 5), c = zz(1, 4), e = kette('−', a, b, c);
      if (a - b - c < -10) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, [[a - b + c, 'richtung-vertauscht'], [-(a - b - c), 'vorzeichen-vergessen'], [a - b, 'sach-schritt-vergessen']],
        H(0, 'Gehe einen Sprung nach dem anderen nach links.', '5 − 8 − 3: erst von 5 nach −3, dann von −3 nach −6.', 'Rechne erst die ersten beiden Zahlen. Rechne mit dem Ergebnis weiter.'), { bild: weg(-10, 10, a, [-b, -c]) }); },
    () => { const s = zz(2, 8), ab = zz(s + 1, s + 9), z = s - ab;
      return antwort(Z(`Auf dem Konto sind ${s} €.`, `Es gehen ${ab} € ab.`, 'Wie hoch ist der Kontostand jetzt?'), z, 'd', fSub(s, ab),
        H(0, 'Geht Geld ab, rechnest du minus. Der Kontostand kann unter null fallen.', '6 − 10 = −4. Der Kontostand ist −4 €.', 'Starte an der Zahlengeraden beim Kontostand. Gehe so viele Schritte nach links, wie Euro abgehen.'), [`${s} − ${ab} = ${zt(z)}`], { einheit: '€', bild: ZG({ start: s }) }); },
    () => { const a = -zz(1, 5), b = zz(2, 5), z = a - b;
      return antwort(Z(`Ein Taucher ist bei ${zt(a)} m.`, `Er taucht ${b} m tiefer.`, 'Bei welcher Höhe ist er jetzt?'), z, 'd', fSub(a, b),
        H(0, 'Tiefer heißt: minus rechnen. An der Zahlengeraden geht es nach links.', '−3 − 5 = −8. Der Taucher ist bei −8 m.', 'Starte bei der negativen Zahl. Zähle die Schritte nach links.'), [`${zt(a)} − ${b} = ${zt(z)}`], { einheit: 'm', bild: ZG({ start: a }) }); },
    () => { const a = zz(2, 6), b = zz(a + 1, a + 5), c = zz(1, 4), z = a - b - c;
      if (z < -10) return null;
      return antwort(Z(`Mittags sind es ${a} °C.`, `Bis abends wird es ${b} Grad kälter.`, `In der Nacht wird es noch ${c} Grad kälter.`, 'Wie kalt ist es in der Nacht?'), z, 'd', [[a - b + c, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [a - b, 'sach-schritt-vergessen']],
        H(0, 'Kälter heißt minus. Rechne einen Schritt nach dem anderen.', '4 − 6 − 3 = −5. In der Nacht sind es −5 °C.', 'Rechne erst bis abends. Rechne von dort aus weiter bis in die Nacht.'), [`${a} − ${b} − ${c} = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [a, 'mittags']) }); },
    () => { const z = -zz(2, 6), a = zz(1, 4), b = a - z, c = -zz(7, 10), d = c - z;
      return auswahl(Z('Die Zahlengerade hilft dir.', 'Welche Rechnung stimmt?'), [opt(wahl([`${a} − ${b} = ${zt(z)}`, `${zt(c)} − (${zt(d)}) = ${zt(z)}`]), true), opt(`${b} − ${a} = ${zt(z)}`, false, 'sub-kleiner-von-groesser'), opt(`${zt(c)} − ${-d} = ${zt(z)}`, false, 'minus-minus-uebersehen')],
        H(0, 'Prüfe jede Rechnung mit Sprüngen an der Zahlengeraden.', '2 − 5 = −3: von 2 aus 5 Schritte nach links.', 'Starte bei der ersten Zahl. Gehe den Sprung und vergleiche mit dem Ergebnis.'), { bild: ZG(), nachweis: [AUSSAGEN] }); },
    () => { const a = zz(1, 6), z = -zz(1, 7), b = a - z;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${a} − {{a}} = ${zt(z)}`), { a: lk(b, [[a + z, 'abstand-ueber-null'], [Math.abs(a + z) || null, 'abstand-ueber-null']].filter(([x]) => x != null && x !== 0)) },
        H(0, 'Zähle die Schritte vom Start bis zum Ziel.', '3 − 7 = −4, denn von 3 bis −4 sind es 7 Schritte nach links.', 'Zähle erst bis zur Null. Zähle dann weiter bis zum Ziel.'), { bild: ZG({ start: a, spruenge: [{ von: a, nach: z, text: '?' }] }), nachweis: [{ art: 'luecken' }] }); },
  ]);
  sechs(S2, 'G', [
    () => { const a = zz(3, 14), b = zz(a + 4, a + 18), e = X('−', D(a), D(b));
      if (a % 10 === 0 || b % 10 === 0 || a - b < -20) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fSub(D(a), D(b)), H(1, 'Eine positive Zahl subtrahieren heißt: nach links gehen.', '(+1,2) − (+2,5) = 1,2 − 2,5 = −1,3.', 'Gehe erst bis zur Null. Gehe dann den Rest nach links weiter.'), { bild: wegZ(a, [-b]) }); },
    () => { const a = -zz(11, 19), b = -zz(3, 17), e = X('−', D(a), D(b));
      if (a === b || b % 10 === 0) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fSub(D(a), D(b)), hGegen(1, '(−1,4) − (−0,9) = −1,4 + 0,9 = −0,5.'), { bild: wegZ(a, [-b]) }); },
    () => { const a = D(-zz(12, 48)), b = D(-zz(11, 39)), z = minus(a, b);
      if (z[0] === 0 || istGanz(a) || istGanz(b)) return null;
      return luecken(Z('Schreibe als Plusaufgabe und rechne.', `(${dt(a)}) − (${dt(b)}) = (${dt(a)}) + {{a}} = {{b}}`), { a: lkd(neg(b), [[b, 'minus-minus-uebersehen']]), b: lkd(z, [[plus(a, b), 'minus-minus-uebersehen'], [neg(z), 'vorzeichen-vergessen']]) },
        hGegen(1, '(−2,4) − (−1,3) = (−2,4) + 1,3 = −1,1.'), { nachweis: [{ art: 'luecken' }] }); },
    () => { const a = D(zz(12, 48)), b = D(zz(52, 95)), z = minus(a, b);
      if (istGanz(a) || istGanz(b)) return null;
      return antwort(Z(`Abends sind es ${dt(a)} °C.`, `In der Nacht fällt die Temperatur um ${dt(b)} Grad.`, 'Wie kalt ist es in der Nacht?'), z, 'd', fSub(a, b),
        H(1, 'Fällt die Temperatur, rechnest du minus.', '2,5 − 4 = −1,5. In der Nacht sind es −1,5 °C.', 'Gehe erst bis zur Null. Gehe dann den Rest nach unten weiter.'), [`${dt(a)} − ${dt(b)} = ${dt(z)}`], { einheit: '°C' }); },
    () => { const a = zz(2, 12), z = -zz(3, 18), b = a - z;
      if (a % 10 === 0 || z % 10 === 0) return null;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${dt(D(a))} − {{a}} = ${dt(D(z))}`), { a: lkd(D(b), [[D(Math.abs(a + z)), 'abstand-ueber-null']].filter(([x]) => x[0] !== 0)) },
        H(1, 'Zähle die Zehntel vom Start bis zum Ziel. Zähle über die Null hinweg.', '0,4 − 1 = −0,6, denn von 0,4 bis −0,6 ist es genau 1.', 'Gehe erst bis zur Null. Gehe dann weiter bis zum Ziel. Addiere beide Stücke.'), { bild: gerade(-20, 20, 1, 10, { teiler: 10, start: a, spruenge: [{ von: a, nach: z, text: '?' }] }), nachweis: [{ art: 'luecken' }] }); },
    () => { const b = D(zz(22, 68)), z = D(-zz(6, 35)), a = plus(z, b);
      if (istGanz(b) || istGanz(z)) return null;
      return antwort(Z(`Von einer Zahl werden ${dt(b)} subtrahiert.`, `Das Ergebnis ist ${dt(z)}.`, 'Wie heißt die Zahl?'), a, 'd', [[minus(z, b), 'richtung-vertauscht'], [neg(a), 'vorzeichen-vergessen']],
        H(1, 'Rechne rückwärts: Gehe vom Ergebnis aus wieder nach rechts.', 'Eine Zahl minus 2,5 ergibt −1. Die Zahl ist 1,5, denn −1 + 2,5 = 1,5.', 'Addiere zum Ergebnis die Zahl, die subtrahiert wurde.'), [`${dt(z)} + ${dt(b)} = ${dt(a)}`]); },
  ]);
  const fBruch = (a, b) => [...fSub(a, b), [Q(Math.abs(a[0]) - Math.abs(b[0]), a[1] === b[1] ? a[1] : Math.abs(a[1] - b[1]) || 1), 'bruch-add-zaehler-nenner']];
  sechs(S2, 'M', [
    () => { const a = D(zz(12, 38)), b = D(zz(405, 895), 2), e = X('−', a, b);
      if (b[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, fSub(a, b), H(2, 'Schreibe beide Zahlen mit zwei Nachkommastellen.', 'Der Subtrahend ist größer. Ziehe die kleinere Zahl von der größeren ab und schreibe ein Minus davor.')); },
    () => { const N = wahl([5, 7, 9, 11, 13]), a = Q(zz(1, N - 2), N), b = Q(zz(a[0] + 1, N - 1), N), e = X('−', a, b);
      if (a[1] !== N || b[1] !== N) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fSub(a, b), H(2, 'Gleichnamige Brüche: Der Nenner bleibt. Du rechnest nur mit den Zählern.', 'Der zweite Zähler ist größer. Das Ergebnis ist negativ.')); },
    () => { const N = wahl([5, 7, 8, 9]), a = Q(-zz(1, N - 1), N), b = Q(-(N + zz(1, N - 1)), N), e = X('−', a, b);
      if (a[1] !== N || b[1] !== N || istGanz(val(e))) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fSub(a, b), H(2, 'Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren.', 'Wandle die gemischte Zahl in einen Bruch um. Schreibe dann die Plusaufgabe und rechne mit den Zählern.')); },
    () => { const a = D(-zz(15, 95), 2), b = D(zz(12, 38)), c = D(-zz(105, 195), 2), e = kette('−', a, b, c);
      if (a[1] !== 100 || c[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[minus(minus(a, b), betrag(c)), 'minus-minus-uebersehen'], [neg(val(e)), 'vorzeichen-vergessen'], [minus(a, b), 'sach-schritt-vergessen']], H(2, 'Schreibe die Aufgabe ohne Klammern.', 'Aus − (+…) wird Minus, aus − (−…) wird Plus. Rechne dann von links nach rechts.')); },
    () => { const b = D(-zz(105, 395), 2), z = D(zz(6, 24)), a = plus(z, b);
      if (b[1] !== 100) return null;
      return antwort(`Welche Zahl fehlt? ▢ − (${dt(b)}) = ${dt(z)}`, a, 'd', [[minus(z, b), 'minus-minus-uebersehen'], [neg(a), 'vorzeichen-vergessen']], H(2, 'Löse mit der Umkehraufgabe: Ergebnis plus Subtrahend.', 'Addiere zum Ergebnis die negative Zahl. Das ist ein Schritt nach links.'), [`${dt(z)} + (${dt(b)}) = ${dt(a)}`]); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt, i) => { const N = [5, 7, 9, 11][i], a = Q(zn(1, N - 1), N), b = Q(zn(1, N - 1), N), z = minus(a, b), f = wahl([neg(z), plus(a, b)]);
      if (istGanz(z) || (a[0] > 0 && b[0] > 0 && a[0] > b[0]) || a[1] !== N || b[1] !== N || (!stimmt && (gleich(f, z) || istGanz(f)))) return null;
      return `${txt(X('−', a, b), PB)} = ${bt(stimmt ? z : f)}`; }, 'minus-minus-uebersehen', H(2, 'Der Nenner bleibt. Schreibe jede Aufgabe als Plusaufgabe mit der Gegenzahl.', 'Rechne jede Aufgabe mit den Zählern nach. Achte auf Minus und Minus.')),
  ]);
  sechs(S2, 'E', [
    () => { const [n1, n2] = wahl([[4, 3], [5, 2], [6, 4], [8, 3], [6, 5], [3, 2], [5, 4]]), a = Q(zz(1, n1 - 1), n1), b = Q(zz(1, n2 - 1), n2), e = X('−', a, b);
      if (a[1] !== n1 || b[1] !== n2 || val(e)[0] >= 0) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fSub(a, b), H(3, 'Mache die Brüche gleichnamig. Ist der zweite Zähler größer, wird das Ergebnis negativ.')); },
    () => { const b = wahl([Q(-3, 4), Q(-2, 5), Q(-7, 8), Q(-3, 5), Q(-1, 4)]), x = wahl([D(5), D(25, 2), D(2), D(1), D(75, 2)]), z = minus(b, x);
      if (istGanz(z) || z[1] > 40) return null;
      return antwort(`Berechne: ${bt(b)} − ${dt(x)} Gib das Ergebnis als vollständig gekürzten Bruch oder als gemischte Zahl an.`, z, 'b', fSub(b, x), H(3, 'Wandle die Dezimalzahl in einen Bruch um. Mache dann gleichnamig.'), [`${bt(b)} − ${dt(x)} = ${bt(z)}`]); },
    () => { const [n1, n2] = wahl([[6, 3], [8, 4], [10, 5], [9, 3], [4, 2]]), a = Q(-wahl([1, 5, 7].filter((x) => x < n1)), n1), b = Q(-1, n2), e = X('−', a, b), z = val(e), stimmt = wahl([true, false, false]);
      if (a[1] !== n1 || z[0] === 0) return null;
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, PB, stimmt ? null : plus(a, b), 'minus-minus-uebersehen', H(3, 'Aus Minus und Minus wird Plus. Mache die Brüche erst danach gleichnamig.'), { andere: [plus(a, b), neg(z), neg(plus(a, b))] }); },
    () => { const [n1, n2] = wahl([[2, 3], [4, 3], [2, 5], [4, 5]]), b = neg(plus(1, Q(1, n1))), z = Q(zz(1, n2 - 1), n2), a = plus(z, b);
      if (z[1] !== n2) return null;
      return antwort(`Welche Zahl fehlt? ▢ − (${bt(b)}) = ${bt(z)} Kürze vollständig.`, a, 'b', [[minus(z, b), 'minus-minus-uebersehen'], [neg(a), 'vorzeichen-vergessen']], H(3, 'Die Umkehraufgabe hilft: Ergebnis plus Subtrahend. Der Subtrahend ist negativ.'), [`${bt(z)} + (${bt(b)}) = ${bt(a)}`]); },
    () => { const a = D(-zz(1205, 2895), 2), b = D(zz(52, 98)), c = D(-zz(3125, 4875), 3), d = D(zz(105, 195), 2), e = kette('−', a, b, c, d);
      if (a[1] !== 100 || c[1] !== 1000 || istGanz(b) || d[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[neg(val(e)), 'vorzeichen-vergessen'], [minus(minus(minus(a, b), betrag(c)), d), 'minus-minus-uebersehen']], H(3, 'Schreibe die Aufgabe ohne Klammern. Schreibe alle Zahlen mit gleich vielen Nachkommastellen.')); },
    () => { const s = D(zz(12050, 39950), 2), x = D(zz(15005, 29995), 2), y = D(zz(10005, 19995), 2), st = minus(minus(s, x), y), z = neg(st);
      if (st[0] >= 0) return null;
      return antwort(`Auf einem Konto sind ${dt(s, 2)} €. Es werden ${dt(x, 2)} € und ${dt(y, 2)} € abgebucht. Um wie viel Euro ist das Konto danach überzogen?`, z, 'd',
        [[st, 'vorzeichen-vergessen'], [minus(x, s), 'sach-schritt-vergessen'], [plus(plus(s, x), y), 'richtung-vertauscht']], H(3, 'Berechne den neuen Kontostand. Er ist negativ. Gesucht ist sein Betrag.'), [`${dt(s)} − ${dt(x)} − ${dt(y)} = ${dt(st)}`, `0 − (${dt(st)}) = ${dt(z)}`], { einheit: '€', geld: true }); },
  ]);
}
