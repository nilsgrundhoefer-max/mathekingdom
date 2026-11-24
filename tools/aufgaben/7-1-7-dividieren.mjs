// Aufgaben zu 7.1.7 „Dividieren“ (Lernziele D1, D2) nach ADR 0015 und ADR 0043.
// D1: ganze Zahlen dividieren. D2: Dezimalzahlen und Brüche dividieren, Lücken füllen (auf F ganze Zahlen im Alltag).
// Grilling mit Nils (2026-11-24): Keine Division geht in eine Periode. 0 : (−17) kommt vor, durch null wird nur auf E in der Fehlersuche gefragt.
// F teilt einen Weg an der Zahlengeraden in gleiche Sprünge, G eine Nachkommastelle und die Probe, M zwei Stellen, Brüche und Kehrwert, E gemischte Zahlen und Rückwärtsaufgaben.
// Typische Fehler: das Vorzeichen beim Dividieren vergessen, malgenommen statt geteilt, beim Bruch den Kehrwert nicht gebildet.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, mal, durch, neg, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, lkd, gerade, thermo, konto, H, X, kette, val, txt, rechne, pruefe, aussagen, fDiv, huepfer, AUSSAGEN, FREI, kind, istGanz, istDezimal, summe } from './7-1-rational.mjs';

const D1 = '7.1.7-D1', D2 = '7.1.7-D2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const B = { form: 'b' };
const LUECKEN = [{ art: 'luecken' }];
const zeilen = (text, wahr, falsche, hilfen, extra = {}) => auswahl(text, [opt(wahr, true), ...falsche.map(([t, fv]) => opt(t, false, fv))], hilfen, { ...extra, nachweis: [AUSSAGEN] });
// Ein Weg von der Null bis k · n, geteilt in k gleiche Sprünge ohne Beschriftung.
const geteilt = (k, n, extra = {}) => gerade(-20, 0, 1, 5, { start: 0, spruenge: Array(k).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text: '?' })), ...extra });
const hoch = (n) => String(n).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

export function dividieren() {
  // ================= D1: ganze Zahlen =================
  const hF = (beispiel) => H(0, 'Teilen heißt: Der Weg wird in gleich lange Sprünge aufgeteilt.', beispiel, 'Zähle die Striche unter einem Bogen. Der Sprung geht nach links, also ist er negativ.');
  const hV = (n, beispiel) => H(n, 'Beim Dividieren gilt: Gleiche Vorzeichen ergeben Plus, verschiedene Vorzeichen ergeben Minus.', beispiel, 'Bestimme zuerst das Vorzeichen. Teile dann die Zahlen ohne Vorzeichen.');
  sechs(D1, 'F', [
    () => { const k = zz(2, 4), n = -zz(2, 5), e = X(':', k * n, k);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fDiv(k * n, k), hF('(−12) : 3 = −4. Der Weg bis −12 besteht aus 3 Sprüngen von je 4 nach links.'), { bild: geteilt(k, n) }); },
    () => { const k = zz(2, 4), n = -zz(2, 5), p = k * n;
      return luecken(Z('Die Malaufgabe hilft dir.', `${k} · ({{a}}) = ${zt(p)}`, `Also ist (${zt(p)}) : ${k} = {{b}}`), { a: lk(n, [[-n, 'vorzeichen-division']]), b: lk(n, [[-n, 'vorzeichen-division'], [p * k, 'div-falsche-rechenart']]) },
        H(0, 'Zu jeder Geteiltaufgabe gehört eine Malaufgabe.', '4 · (−2) = −8. Also ist (−8) : 4 = −2.', 'Überlege: Welche Zahl mal die zweite Zahl ergibt die erste Zahl?'), { bild: geteilt(k, n), nachweis: LUECKEN }); },
    () => { const k = zz(2, 4), n = zz(2, 5), p = k * n;
      return antwort(Z(`${k} Kinder haben zusammen ${p} € Schulden.`, 'Sie teilen die Schulden gerecht auf.', 'Wie hoch ist der Kontostand von jedem Kind?'), -n, 'd', [[n, 'vorzeichen-division'], [-(p - k), 'div-falsche-rechenart']],
        H(0, 'Schulden sind eine negative Zahl. Sie werden gerecht geteilt.', '(−12) : 3 = −4. Jedes Kind hat −4 €.', 'Schreibe die Schulden als negative Zahl. Teile durch die Anzahl der Kinder.'), [`(−${p}) : ${k} = −${n}`], { einheit: '€', bild: geteilt(k, -n) }); },
    () => { const k = zz(2, 5), n = -zz(2, 4), p = k * n, e = X(':', p, n);
      return rechne(Z('Schau auf die Zahlengerade.', `Wie oft passt der Sprung ${zt(n)} in den Weg bis ${zt(p)}?`, `Rechne: ${txt(e)}`), e, {}, fDiv(p, n), H(0, 'Zähle, wie viele gleiche Sprünge bis zum Ziel führen.', '(−10) : (−2) = 5. Der Sprung −2 passt 5-mal in den Weg bis −10.', 'Zähle die Bögen an der Zahlengeraden. Die Anzahl ist positiv.'), { bild: huepfer(k, n) }); },
    () => { const k = zz(2, 4), n = -zz(2, 5), p = k * n;
      return zeilen(Z('Schau auf die Zahlengerade.', 'Welche Rechnung passt zum Bild?'), `(${zt(p)}) : ${k} = ${zt(n)}`, [[`(${zt(p)}) : ${k} = ${-n}`, 'vorzeichen-division'], [`${-p} : ${k} = ${zt(n)}`, 'vorzeichen-division']], hF('(−12) : 3 = −4: 3 gleiche Sprünge nach links bis −12.'), { bild: geteilt(k, n) }); },
    () => { const n = zz(2, 4);
      return luecken(Z('Setze die Reihe fort.', `${2 * n} : (${zt(-n)}) = −2`, `${n} : (${zt(-n)}) = −1`, `0 : (${zt(-n)}) = {{a}}`, `(${zt(-n)}) : (${zt(-n)}) = {{b}}`, `(${zt(-2 * n)}) : (${zt(-n)}) = {{c}}`), { a: lk(0, [[-n, '1x1-null']]), b: lk(1, [[-1, 'vorzeichen-division']]), c: lk(2, [[-2, 'vorzeichen-division']]) },
        H(0, 'Von Zeile zu Zeile wird das Ergebnis um 1 größer.', '0 : (−3) = 0, danach kommt (−3) : (−3) = 1. Minus geteilt durch Minus ergibt Plus.', 'Schau auf die Punkte an der Zahlengeraden. Gehe immer einen Schritt weiter nach rechts.'), { bild: ZG({ punkte: [-2, -1] }), nachweis: LUECKEN }); },
  ]);
  sechs(D1, 'G', [
    () => { const k = zz(3, 6), n = -5 * zz(2, 5), e = X(':', k * n, k);
      if (k * n < -100) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fDiv(k * n, k).filter(([w]) => Math.abs(w[0]) <= 1000), H(1, 'Teilen heißt: Der Weg wird in gleich lange Sprünge aufgeteilt.', '(−60) : 4 = −15. Der Weg bis −60 besteht aus 4 Sprüngen von je 15 nach links.', 'Teile erst ohne Vorzeichen. Das Ergebnis ist negativ.'),
        { bild: gerade(-100, 0, 5, 25, { start: 0, spruenge: Array(k).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text: '?' })) }) }); },
    () => { const q = zz(3, 12), d = -zz(3, 9), e = X(':', q * d, d);
      return rechne(`Rechne: ${txt(e)}`, e, {}, fDiv(q * d, d).filter(([w]) => Math.abs(w[0]) <= 1000), hV(1, '(−72) : (−8) = 9. Minus geteilt durch Minus ergibt Plus.')); },
    () => { const q = -zz(3, 12), d = zz(3, 9), p = q * d;
      return luecken(Z('Rechne und mache die Probe.', `(${zt(p)}) : ${d} = {{a}}`, `Probe: ({{b}}) · ${d} = ${zt(p)}`), { a: lk(q, [[-q, 'vorzeichen-division']]), b: lk(q, [[-q, 'vorzeichen-division']]) },
        H(1, 'Die Probe ist die Malaufgabe: Ergebnis mal Teiler ergibt die erste Zahl.', '(−56) : 7 = −8. Probe: (−8) · 7 = −56.', 'Teile erst ohne Vorzeichen. Prüfe das Vorzeichen mit der Malaufgabe.'), { nachweis: LUECKEN }); },
    () => { const q = -zz(3, 12), d = -zz(3, 9), e = X(':', q * d, d);
      return rechne(`Rechne: ${txt(e)}`, e, {}, fDiv(q * d, d).filter(([w]) => Math.abs(w[0]) <= 1000), hV(1, '63 : (−9) = −7. Plus geteilt durch Minus ergibt Minus.')); },
    () => { const k = zz(2, 6), n = zz(2, 4), z = -k * n;
      if (z < -20) return null;
      return antwort(Z(`Vor ${k} Stunden waren es 0 °C.`, 'Seitdem ist die Temperatur jede Stunde gleich viel gefallen.', 'Um wie viel Grad hat sie sich jede Stunde geändert?', 'Schreibe das Ergebnis mit Vorzeichen.'), -n, 'd', [[n, 'vorzeichen-division'], [z, 'sach-schritt-vergessen']],
        H(1, 'Die ganze Änderung wird gleichmäßig auf die Stunden verteilt.', '(−12) : 4 = −3. Die Temperatur fällt jede Stunde um 3 Grad.', 'Lies die Temperatur am Thermometer ab. Teile sie durch die Anzahl der Stunden.'), [`(${zt(z)}) : ${k} = −${n}`], { einheit: 'Grad', bild: thermo(-20, 10, 1, 5, [z, 'jetzt']) }); },
    () => { const k = zz(3, 6), n = 5 * zz(2, 6), alt = 10 * zz(1, 6), neu = alt - k * n;
      if (neu >= 0) return null;
      return antwort(Z(`Der Kontostand ist durch ${k} gleiche Abbuchungen gefallen.`, 'Wie hoch war jede Abbuchung?', 'Schreibe das Ergebnis mit Vorzeichen.'), -n, 'd', [[n, 'vorzeichen-division'], [neu / k, 'sach-schritt-vergessen'], [(neu + alt) / k, 'abstand-ueber-null']].filter(([w]) => Number.isInteger(w)),
        H(1, 'Berechne erst, um wie viel der Kontostand insgesamt gefallen ist.', 'Von 40 € auf −60 €: −60 − 40 = −100. Dann (−100) : 5 = −20.', 'Ziehe den alten Kontostand vom neuen ab. Teile das Ergebnis durch die Anzahl der Abbuchungen.'), [`(${zt(neu)} − ${alt}) : ${k} = −${n}`], { einheit: '€', daten: konto(['Kontostand', 'Euro'], [['vorher', zt(alt)], ['nachher', zt(neu)]]) }); },
  ]);
  sechs(D1, 'M', [
    () => { const q = -zz(11, 25), d = zz(11, 19), e = X(':', q * d, d);
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-q, 'vorzeichen-division']], H(2, 'Verschiedene Vorzeichen ergeben Minus.', 'Dividiere die Beträge. Schreibe dann das Minus davor.')); },
    () => { const q = zz(11, 25), d = -zz(4, 12), p = q * d;
      return antwort(`Welche Zahl fehlt? ▢ : (${zt(d)}) = ${q}`, p, 'd', [[-p, 'vorzeichen-vergessen']], H(2, 'Gesucht ist der Dividend. Löse mit der Umkehraufgabe.', 'Multipliziere den Quotienten mit dem Divisor. Achte auf das Vorzeichen.'), [`${q} · (${zt(d)}) = ${zt(p)}`]); },
    () => { const q = -zz(6, 15), d = zz(4, 12), p = q * d;
      return antwort(`Welche Zahl fehlt? (${zt(p)}) : ▢ = ${zt(q)}`, d, 'd', [[-d, 'vorzeichen-division']], H(2, 'Gesucht ist der Divisor. Teile den Dividenden durch den Quotienten.', 'Dividend und Quotient sind beide negativ. Der Divisor ist also positiv.'), [`(${zt(p)}) : (${zt(q)}) = ${d}`]); },
    () => { const q = zz(11, 19), d = -wahl([12, 15, 25]), e = X(':', q * d, d);
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-q, 'vorzeichen-division']], H(2, 'Gleiche Vorzeichen ergeben Plus.', 'Dividiere die Beträge. Das Ergebnis ist positiv.')); },
    () => { const n = zz(11, 19), a = zn(4, 12), b = zn(4, 9), c = zn(4, 12), d = -zz(4, 9), w = [wahl([true, false]), wahl([true, false]), wahl([true, false]), wahl([true, false])];
      if (w.every((x) => x) || !w.some((x) => x) || (a > 0 && b > 0)) return null;
      const roh = [[`${txt(X(':', a * b, b))} = ${zt(w[0] ? a : -a)}`, w[0]], [`0 : (−${n}) = ${w[1] ? 0 : `−${n}`}`, w[1]], [`${txt(X(':', c * d, d))} = ${zt(w[2] ? c : -c)}`, w[2]], [`${txt(X(':', -n, -n))} = ${w[3] ? 1 : -1}`, w[3]]];
      return auswahl('Welche Rechnungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'vorzeichen-division')), H(2, 'Es gelten dieselben Vorzeichenregeln wie beim Multiplizieren. Null geteilt durch eine Zahl ist null.', 'Prüfe jede Rechnung mit der Probe: Quotient mal Divisor ergibt den Dividenden.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
    () => { const n = wahl([4, 5, 6]), m = -zz(2, 6), ws = Array(n - 1).fill(0).map(() => zz(-9, 5)), letzte = n * m - ws.reduce((s, x) => s + x, 0);
      if (letzte < -12 || letzte > 8 || new Set([...ws, letzte]).size < n - 1) return null;
      const alle = [...ws, letzte];
      return antwort(`An ${n} Tagen wurden mittags diese Temperaturen gemessen: ${alle.map((x) => `${zt(x)} °C`).join(', ')}. Berechne den Durchschnitt.`, m, 'd', [[-m, 'vorzeichen-division'], [n * m, 'sach-schritt-vergessen']],
        H(2, 'Durchschnitt: alle Werte addieren und durch ihre Anzahl teilen.', 'Addiere erst alle Temperaturen mit ihren Vorzeichen. Teile die Summe durch die Anzahl der Tage.'), [`(${alle.map((x, i) => (i && x < 0 ? `(${zt(x)})` : zt(x))).join(' + ')}) : ${n} = ${zt(m)}`], { einheit: '°C' }); },
  ]);
  sechs(D1, 'E', [
    () => { const q = -zz(6, 15), b = -zz(3, 8), c = -zz(3, 9), e = X(':', X(':', q * b * c, b), c);
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[-q, 'vorzeichen-division'], [q * c * c, 'klammer-falsch-gesetzt']], H(3, 'Rechne von links nach rechts. Zähle die Minuszeichen, um das Vorzeichen zu bestimmen.')); },
    () => { const q = zz(11, 19), d = -zz(6, 12), e = X(':', q * d, d), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, {}, stimmt ? null : -q, 'vorzeichen-division', H(3, 'Mache die Probe: Quotient mal Divisor muss den Dividenden ergeben.'), { andere: [-q, q + 1, q * d + d] }); },
    () => { const n = zz(11, 29);
      return auswahl('Welche Rechnung hat kein Ergebnis?', [opt(`(−${n}) : 0`, true), opt(`0 : (−${n})`, false, '1x1-null'), opt(`(−${n}) : (−${n})`, false, 'div-durch-sich-selbst'), opt(`${n} : (−1)`, false, 'vorzeichen-division'), opt(`(−${n}) : 1`, false, 'vorzeichen-division')],
        H(3, 'Prüfe mit der Probe: Gibt es eine Zahl, die mal dem Divisor den Dividenden ergibt?'), { nachweis: [FREI('Durch null kann man nicht teilen: Keine Zahl ergibt mal null eine Zahl ungleich null.')] }); },
    () => { const d = -zz(4, 9), m = zz(8, 25), y = zz(3, 9), x = y * d, z = y - m;
      return antwort(`Ich teile eine Zahl durch ${zt(d)} und subtrahiere dann ${m}. Ich erhalte ${zt(z)}. Wie heißt die Zahl?`, x, 'd', [[-x, 'vorzeichen-vergessen'], [(z - m) * d, 'richtung-vertauscht'], [z * d, 'sach-schritt-vergessen']], H(3, 'Rechne rückwärts: erst die Subtraktion rückgängig machen, dann die Division.'), [`(${zt(z)} + ${m}) · (${zt(d)}) = ${zt(x)}`]); },
    () => { const b = -wahl([2, 3]), m = zz(4, 7), n = zz(2, m - 1), z = b ** (m - n);
      return antwort(`Berechne: (${zt(b)})${hoch(m)} : (${zt(b)})${hoch(n)}`, z, 'd', [[-z, 'vorzeichen-division'], [b ** m, 'sach-schritt-vergessen'], [b * (m - n), 'potenz-mal-exponent']], H(3, 'Schreibe beide Potenzen als Produkte. Kürze gleiche Faktoren, bevor du rechnest.'), [`(${zt(b)})${hoch(m)} : (${zt(b)})${hoch(n)} = ${zt(z)}`]); },
    () => auswahl('Welche Aussage stimmt immer?', [opt('Der Quotient von zwei negativen Zahlen ist positiv.', true), opt('Der Quotient ist immer kleiner als der Dividend.', false, 'mal-macht-groesser'), opt('Dividend und Divisor dürfen die Plätze tauschen.', false, 'gesetz-auf-division'),
      opt('Null geteilt durch eine negative Zahl ist negativ.', false, '1x1-null'), opt('Eine negative Zahl geteilt durch −1 bleibt negativ.', false, 'vorzeichen-division')],
      H(3, 'Suche zu jeder Aussage ein Gegenbeispiel mit kleinen Zahlen.'), { nachweis: [FREI('Vorzeichenregel beim Dividieren: Gleiche Vorzeichen ergeben einen positiven Quotienten.')] }),
  ]);

  // ================= D2: Dezimalzahlen, Brüche, Lücken (F: ganze Zahlen im Alltag) =================
  sechs(D2, 'F', [
    () => { const k = zz(2, 5), n = -zz(2, 4), p = k * n;
      return luecken(Z('Schau auf die Zahlengerade.', 'Wie viele Sprünge sind es?', `(${zt(p)}) : {{a}} = ${zt(n)}`), { a: lk(k, [[-k, 'vorzeichen-division']]) },
        H(0, 'Zähle die gleichen Sprünge bis zum Ziel.', '(−12) : 3 = −4, denn 3 Sprünge von je −4 führen zu −12.', 'Zähle die Bögen an der Zahlengeraden.'), { bild: huepfer(k, n), nachweis: LUECKEN }); },
    () => { const k = zz(2, 5), n = zz(2, Math.floor(20 / k)), p = k * n;
      return antwort(Z(`Ein Taucher sinkt in ${k} Minuten auf −${p} m.`, 'Er sinkt in jeder Minute gleich viel.', 'Bei welcher Höhe ist er nach 1 Minute?'), -n, 'd', [[n, 'vorzeichen-division'], [-(p - k), 'div-falsche-rechenart']],
        H(0, 'Der Weg wird gleichmäßig auf die Minuten verteilt.', '(−15) : 3 = −5. Nach 1 Minute ist er bei −5 m.', 'Zähle die Striche unter einem Bogen. Der Sprung geht nach links.'), [`(−${p}) : ${k} = −${n}`], { einheit: 'm', bild: geteilt(k, -n) }); },
    () => { const n = -zz(6, 9), e = X(':', 2 * n, 2);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fDiv(2 * n, 2), hF('(−18) : 2 = −9. Der Weg bis −18 besteht aus 2 Sprüngen von je 9 nach links.'), { bild: geteilt(2, n) }); },
    () => { const k = zz(2, 4), n = -zz(2, 5), p = k * n;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `({{a}}) : ${k} = ${zt(n)}`), { a: lk(p, [[-p, 'vorzeichen-vergessen'], [n, 'sach-schritt-vergessen']]) },
        H(0, 'Die Sprünge zeigen die Malaufgabe. Das Ziel ist die gesuchte Zahl.', '(−15) : 3 = −5, denn 3 · (−5) = −15.', 'Lies das Ziel der Sprünge an der Zahlengeraden ab.'), { bild: huepfer(k, n), nachweis: LUECKEN }); },
    () => { const a = zz(2, 5), b = 2, p = a * b;
      return zeilen(Z('Schau auf die Punkte an der Zahlengeraden.', 'Welche Rechnung stimmt?'), `(${zt(-p)}) : (${zt(-b)}) = ${a}`, [[`(${zt(-p)}) : ${b} = ${a}`, 'vorzeichen-division'], [`${p} : (${zt(-b)}) = ${a}`, 'vorzeichen-division']],
        H(0, 'Minus geteilt durch Minus ergibt Plus. Minus geteilt durch Plus ergibt Minus.', '(−8) : (−2) = 4 und (−8) : 2 = −4.', 'Schau auf die Vorzeichen. Nur bei gleichen Vorzeichen ist das Ergebnis positiv.'), { bild: ZG({ punkte: [-a, a] }) }); },
    () => { const k = zz(2, 4), n = zz(2, Math.floor(10 / k)), p = k * n;
      return antwort(Z(`Vor ${k} Stunden waren es 0 °C.`, 'Seitdem fällt die Temperatur jede Stunde gleich viel.', 'Wie kalt war es nach 1 Stunde?'), -n, 'd', [[n, 'vorzeichen-division'], [-p, 'sach-schritt-vergessen']],
        H(0, 'Die Änderung wird gleichmäßig auf die Stunden verteilt.', '(−8) : 4 = −2. Nach 1 Stunde waren es −2 °C.', 'Lies die Temperatur am Thermometer ab. Teile sie durch die Anzahl der Stunden.'), [`(−${p}) : ${k} = −${n}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [-p, 'jetzt']) }); },
  ]);
  const zehntel = (von, k, n, text) => gerade(von, 0, 1, 10, { teiler: 10, start: 0, spruenge: Array(k).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text })) });
  sechs(D2, 'G', [
    () => { const k = zz(3, 6), n = -zz(3, 6), e = X(':', D(k * n), k);
      if ((k * n) % 10 === 0) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fDiv(D(k * n), k), H(1, 'Teilen heißt: Der Weg wird in gleich lange Sprünge aufgeteilt.', '(−2,4) : 4 = −0,6. Der Weg bis −2,4 besteht aus 4 Sprüngen von je 0,6 nach links.', 'Teile erst ohne Vorzeichen und ohne Komma. Setze dann Komma und Minus.'), { bild: zehntel(-40, k, n, '?') }); },
    () => { const q = zz(2, 9), d = -zz(3, 9), e = X(':', D(q * d), d);
      if ((q * d) % 10 === 0) return null;
      return rechne(`Rechne: ${txt(e)}`, e, {}, fDiv(D(q * d), d), hV(1, '(−4,5) : (−9) = 0,5. Minus geteilt durch Minus ergibt Plus.')); },
    () => { const q = -zz(2, 9), d = zz(3, 9), p = D(q * d);
      if (istGanz(p)) return null;
      return luecken(Z('Rechne und mache die Probe.', `(${dt(p)}) : ${d} = {{a}}`, `Probe: ({{b}}) · ${d} = ${dt(p)}`), { a: lkd(D(q), [[D(-q), 'vorzeichen-division']]), b: lkd(D(q), [[D(-q), 'vorzeichen-division']]) },
        H(1, 'Die Probe ist die Malaufgabe: Ergebnis mal Teiler ergibt die erste Zahl.', '(−3,6) : 6 = −0,6. Probe: (−0,6) · 6 = −3,6.', 'Teile erst ohne Vorzeichen und ohne Komma. Prüfe mit der Malaufgabe.'), { nachweis: LUECKEN }); },
    () => { const k = zz(3, 6), n = wahl([5, 15, 25, 35]), p = D(k * n);
      return antwort(Z(`${k} Freunde haben zusammen ${dt(p, 2)} € Schulden.`, 'Sie teilen die Schulden gerecht auf.', 'Wie hoch ist der Kontostand von jedem?'), D(-n), 'd', [[D(n), 'vorzeichen-division']],
        H(1, 'Schulden sind eine negative Zahl. Sie werden gerecht geteilt.', '(−7,5) : 5 = −1,5. Jeder hat −1,50 €.', 'Schreibe die Schulden als negative Zahl. Teile durch die Anzahl der Freunde.'), [`(−${dt(p)}) : ${k} = ${dt(D(-n))}`], { einheit: '€', geld: true, daten: konto(['Kontostand', 'Euro'], [['alle zusammen', `−${dt(p, 2)}`]]) }); },
    () => { const k = zz(3, 6), n = -zz(3, 6), p = D(k * n);
      if (istGanz(p)) return null;
      return luecken(Z('Schau auf die Zahlengerade.', `Wie oft passt der Sprung ${dt(D(n))} in den Weg?`, `(${dt(p)}) : ({{a}}) = ${k}`), { a: lkd(D(n), [[D(-n), 'vorzeichen-division']]) },
        H(1, 'Der Weg besteht aus gleichen Sprüngen. Jeder Sprung ist der gesuchte Teiler.', '(−3,5) : (−0,7) = 5, denn der Sprung −0,7 passt 5-mal in den Weg bis −3,5.', 'Lies die Zahl an einem Bogen ab. Sie ist negativ.'), { bild: zehntel(-40, k, n, `−${dt(D(-n))}`), nachweis: LUECKEN }); },
    () => { const n = 4, m = D(-wahl([5, 15, 25])), ws = [D(-zz(5, 40)), D(zz(1, 15)), D(-zz(5, 30))], letzte = minus(mal(m, n), summe(ws));
      if (letzte[0] === 0 || !istDezimal(letzte, 1) || Math.abs(letzte[0] / letzte[1]) > 6) return null;
      const alle = [...ws, letzte];
      return antwort(Z(`An ${n} Tagen wurden diese Temperaturen gemessen:`, `${alle.map((x) => `${dt(x)} °C`).join(', ')}.`, 'Wie hoch ist der Durchschnitt?'), m, 'd', [[neg(m), 'vorzeichen-division'], [mal(m, n), 'sach-schritt-vergessen']],
        H(1, 'Durchschnitt: alle Werte addieren und durch ihre Anzahl teilen.', '−2 °C, 1 °C, −3 °C und 0 °C: Die Summe ist −4. Dann (−4) : 4 = −1.', 'Addiere erst alle Temperaturen mit ihren Vorzeichen. Teile die Summe durch die Anzahl der Tage.'), [`(${alle.map((x, i) => (i && x[0] < 0 ? `(${dt(x)})` : dt(x))).join(' + ')}) : ${n} = ${dt(m)}`], { einheit: '°C' }); },
  ]);
  sechs(D2, 'M', [
    () => { const q = D(-zz(105, 495), 2), d = zz(2, 9), e = X(':', mal(q, d), d);
      if (q[1] !== 100 || !istDezimal(mal(q, d), 2)) return null;
      return rechne(`Berechne: ${txt(e)}`, e, { stellen: 2 }, [[neg(q), 'vorzeichen-division']], H(2, 'Verschiedene Vorzeichen ergeben Minus.', 'Dividiere wie gewohnt und setze das Komma. Schreibe dann das Minus davor.')); },
    () => { const n = wahl([3, 4, 5, 7, 8]), z = zz(1, n - 1), k = zz(2, 5), a = Q(-z * k, n);
      if (a[1] !== n || a[0] <= -n) return null;
      const e = X(':', a, k);
      return rechne(`Berechne: ${txt(e, B)} Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-division'], [mal(a, k), 'bruch-kehrwert']], H(2, 'Einen Bruch teilst du durch eine ganze Zahl, indem du den Zähler teilst oder den Nenner malnimmst.', 'Teile den Zähler durch die ganze Zahl. Der Nenner und das Minus bleiben.')); },
    () => { const [a, b] = wahl([[Q(-3, 4), Q(1, 2)], [Q(-2, 3), Q(4, 9)], [Q(-4, 5), Q(2, 3)], [Q(-5, 8), Q(1, 4)], [Q(-3, 7), Q(2, 7)], [Q(-5, 6), Q(1, 3)]]), e = X(':', a, b);
      return rechne(`Berechne: ${txt(e, B)} Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-division'], [mal(a, b), 'bruch-kehrwert']], H(2, 'Durch einen Bruch dividierst du, indem du mit dem Kehrwert multiplizierst.', 'Bilde den Kehrwert des zweiten Bruchs. Multipliziere dann und bestimme das Vorzeichen.')); },
    () => { const q = D(-zz(2, 9)), d = -zz(3, 9), e = X(':', mal(q, d), d);
      if (istGanz(mal(q, d))) return null;
      return rechne(`Berechne: ${txt(e)}`, e, {}, [[neg(q), 'vorzeichen-division']], H(2, 'Verschiedene Vorzeichen ergeben Minus.', 'Dividiere die Beträge. Der Dividend ist positiv, der Divisor negativ.')); },
    () => { const d = D(-wahl([5, 2, 4, 25])), q = D(zz(12, 38)), p = mal(q, d);
      if (!istDezimal(p, 2)) return null;
      return antwort(`Welche Zahl fehlt? ▢ : (${dt(d)}) = ${dt(q)}`, p, 'd', [[neg(p), 'vorzeichen-vergessen'], [durch(q, d), 'probe-falsche-umkehr']], H(2, 'Gesucht ist der Dividend. Löse mit der Umkehraufgabe.', 'Multipliziere den Quotienten mit dem Divisor. Achte auf das Vorzeichen.'), [`${dt(q)} · (${dt(d)}) = ${dt(p)}`]); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt, i) => { const [a, b] = [[Q(-1, 2), Q(1, 4)], [Q(-3, 4), Q(-3, 8)], [Q(2, 3), Q(-1, 3)], [Q(-4, 5), Q(2, 5)], [Q(-1, 3), Q(-1, 6)], [Q(3, 5), Q(-1, 10)]][zz(0, 5)], z = durch(a, b);
      return `${txt(X(':', a, b), B)} = ${bt(stimmt ? z : wahl([neg(z), mal(a, b)]))}`; }, 'vorzeichen-division', H(2, 'Mit dem Kehrwert multiplizieren. Für das Vorzeichen gelten die gewohnten Regeln.', 'Prüfe bei jeder Rechnung erst das Vorzeichen, dann den Wert.')),
  ]);
  sechs(D2, 'E', [
    () => { const [a, b] = wahl([[Q(-5, 2), Q(-5, 4)], [Q(-7, 2), Q(7, 4)], [Q(-4, 3), Q(-2, 9)], [Q(9, 4), Q(-3, 8)], [Q(-8, 3), Q(4, 9)], [Q(-5, 2), Q(-3, 4)], [Q(-7, 4), Q(3, 2)], [Q(-5, 3), Q(-5, 2)]]), e = X(':', a, b);
      return rechne(`Berechne: ${txt(e, B)}${istGanz(val(e)) ? '' : ' Kürze vollständig.'}`, e, B, [[neg(val(e)), 'vorzeichen-division'], [mal(a, b), 'bruch-kehrwert']], H(3, 'Wandle die gemischten Zahlen in Brüche um. Multipliziere dann mit dem Kehrwert.')); },
    () => { const [a, x] = wahl([[Q(-3, 5), D(4)], [Q(-3, 4), D(5)], [Q(-2, 3), D(8)], [Q(-5, 6), D(25, 2)], [Q(-7, 8), D(5)]]), z = durch(a, x);
      return antwort(`Berechne: (${bt(a)}) : ${dt(x)} Gib das Ergebnis als vollständig gekürzten Bruch oder als gemischte Zahl an.`, z, 'b', [[neg(z), 'vorzeichen-division'], [mal(a, x), 'bruch-kehrwert']], H(3, 'Wandle die Dezimalzahl in einen Bruch um. Multipliziere dann mit dem Kehrwert.'), [`(${bt(a)}) : ${dt(x)} = ${bt(z)}`]); },
    () => { const [a, b] = wahl([[Q(-3, 4), Q(1, 2)], [Q(-2, 3), Q(1, 6)], [Q(-5, 6), Q(1, 3)], [Q(-4, 5), Q(2, 5)]]), c = -zz(2, 5), e = X(':', X(':', a, b), c);
      return rechne(`Berechne: ${txt(e, B)} Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-division'], [durch(a, durch(b, c)), 'klammer-falsch-gesetzt']], H(3, 'Rechne von links nach rechts. Zwei Minuszeichen ergeben zusammen Plus.')); },
    () => { const [a, k] = wahl([[Q(-2, 3), -4], [Q(-3, 5), -6], [Q(-4, 7), -2], [Q(-5, 8), -10]]), e = X(':', a, k), stimmt = wahl([true, false, false]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, B, stimmt ? null : mal(a, k), 'bruch-kehrwert', H(3, 'Durch eine ganze Zahl teilen heißt: mit ihrem Kehrwert malnehmen. Der Bruch wird dabei kleiner.'), { andere: [mal(a, k), neg(val(e)), neg(mal(a, k))] }); },
    () => { const [a, q] = wahl([[Q(-3, 2), Q(3, 4)], [Q(-5, 2), Q(5, 6)], [Q(-4, 3), Q(2, 3)], [Q(-9, 4), Q(3, 8)]]), d = durch(a, q);
      return antwort(`Welche Zahl fehlt? (${bt(a)}) : ▢ = ${bt(q)}`, d, 'b', [[neg(d), 'vorzeichen-division'], [mal(a, q), 'bruch-kehrwert']], H(3, 'Gesucht ist der Divisor: Teile den Dividenden durch den Quotienten.'), [`(${bt(a)}) : ${bt(q)} = ${bt(d)}`]); },
    () => { const n = 4, m = D(-wahl([15, 25, 35, 5])), ws = [D(-zz(21, 58)), D(zz(6, 28)), D(-zz(3, 18))], letzte = minus(mal(m, n), summe(ws));
      if (letzte[0] === 0 || istGanz(letzte)) return null;
      return antwort(`Der Durchschnitt von ${n} Zahlen ist ${dt(m)}. Drei der Zahlen sind ${ws.map((x) => dt(x)).join('; ')}. Wie heißt die vierte Zahl?`, letzte, 'd', [[neg(letzte), 'vorzeichen-vergessen'], [minus(m, summe(ws)), 'sach-schritt-vergessen'], [mal(m, n), 'sach-schritt-vergessen']],
        H(3, 'Berechne zuerst die Summe aller Zahlen: Durchschnitt mal Anzahl. Ziehe dann die bekannten Zahlen ab.'), [`${n} · (${dt(m)}) − (${dt(ws[0])}) − ${dt(ws[1])} − (${dt(ws[2])}) = ${dt(letzte)}`]); },
  ]);
}
