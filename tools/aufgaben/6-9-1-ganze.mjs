// Aufgaben zu 6.9.1 „Ganze Zahlen“ (Lernziele N1, N2) nach ADR 0015 und ADR 0059.
// N1: negative Zahlen im Alltag deuten und mit Vorzeichen schreiben. N2: ganze Zahlen an der Zahlengeraden ablesen und eintragen.
// Grilling mit Nils (2026-11-28): eigene Aufgaben auf dem Niveau der Klasse 6, Technik (Bilder, Prüfung, Knopf „±“) aus Klasse 7.
// F ganze Zahlen bis ±20 und immer ein Bild, G bis ±100, M bis ±1000 und zwei Nachkommastellen, E feinere Einteilungen, Fehlersuche, Rückwärts.
// Jeder Auftrag beginnt mit einem Operator; Fragen mit Fragezeichen gibt es in Klasse 6 nicht.

import { sechs, auswahl, luecken, zuordnen, Z } from '../werkzeug.mjs';
import { Q, D, neg, zt, dt, opt, zz, wahl, mische, antwort, wahlAus, lk, gerade, thermo, konto, H, markiere, ANGABE, BILD, KONTEXT, WERT, FREI, AUSSAGEN, kind } from './7-1-rational.mjs';

const N1 = '6.9.1-N1', N2 = '6.9.1-N2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
// Der Fehler „von der beschrifteten Zahl in die falsche Richtung gezählt“: aus −7 wird −3 (bei Beschriftung in Fünfern).
const gespiegelt = (t, b) => { const l = -b * Math.floor(-t / b); return l + (-t % b); };
const ORTE = ['Oslo', 'Kiruna', 'Zermatt', 'Moskau', 'Helsinki', 'Tromsø'];

export function ganze6() {
  // ================= N1: Alltag deuten =================
  const hTh = (n) => H(n, 'Unter der Null sind die Temperaturen negativ. Sie haben ein Minus.', 'Drei Striche unter der Null sind es −3 °C.', 'Zähle die Striche von der Null nach unten. Schreibe ein Minus davor.');
  sechs(N1, 'F', [
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return antwort(Z('Schau auf das Thermometer.', 'Lies die Temperatur ab.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']], hTh(0), [BILD(zt(w))], { einheit: '°C', bild: thermo(-10, 10, 1, 5, w) }); },
    () => { const b = zz(2, 9);
      return wahlAus(Z(`Es sind ${b} Grad unter null.`, 'Kreuze die passende Temperatur an.'), `${zt(-b)} °C`, [[`${b} °C`, 'vorzeichen-vergessen'], ['0 °C', 'vorzeichen-vergessen']],
        H(0, 'Unter null heißt: Die Zahl bekommt ein Minus.', '3 Grad unter null sind −3 °C.', 'Schau auf das Thermometer. Liegt die rote Säule über oder unter der Null?'), { bild: thermo(-10, 10, 1, 5, -b), nachweis: [KONTEXT(b, 'unter', true), WERT(zt(-b))] }); },
    () => { const kalt = -zz(6, 9), mild = -zz(1, 4), warm = zz(1, 6), werte = mische([kalt, mild, warm]), namen = ['morgens', 'mittags', 'abends'];
      return auswahl(Z('Die Thermometer zeigen drei Temperaturen an einem Tag.', 'Kreuze an, wann es am kältesten war.'), werte.map((w, i) => opt(namen[i], w === kalt, w === kalt ? undefined : w === mild ? 'negativ-groesser' : 'vorzeichen-vergessen')),
        H(0, 'Je weiter unten die Säule steht, desto kälter ist es.', '−8 °C ist kälter als −2 °C.', 'Suche das Thermometer mit der niedrigsten Säule.'), { bild: thermo(-10, 10, 1, 5, ...werte.map((w, i) => [w, namen[i]])), nachweis: [{ art: 'thermowahl', was: 'kaeltestes' }] }); },
    () => { const b = zz(1, 4);
      return antwort(Z(`Die Tiefgarage ist ${b} Stockwerke unter dem Erdgeschoss.`, 'Das Erdgeschoss hat die Nummer 0.', 'Schreibe das Stockwerk der Tiefgarage als Zahl mit Vorzeichen.'), -b, 'd', [[b, 'vorzeichen-vergessen']],
        H(0, 'Stockwerke unter dem Erdgeschoss bekommen ein Minus.', 'Zwei Stockwerke unter dem Erdgeschoss ist −2.', 'Starte an der Zahlengeraden bei der Null. Gehe so viele Schritte nach links, wie die Tiefgarage tiefer liegt.'), [KONTEXT(b, 'unter', true)], { bild: gerade(-5, 10, 1, 5, { punkte: [0] }) }); },
    () => { const [a, b] = [-zz(1, 9), zz(-9, 5)], [o1, o2] = mische(ORTE).slice(0, 2);
      if (a === b || Math.abs(a - b) < 2) return null;
      return auswahl(Z('Die Thermometer zeigen die Temperatur in zwei Orten.', 'Kreuze an, wo es wärmer ist.'), [opt(o1, a > b, a > b ? undefined : 'negativ-groesser'), opt(o2, b > a, b > a ? undefined : 'negativ-groesser')],
        H(0, 'Je weiter oben die Säule steht, desto wärmer ist es.', '−2 °C ist wärmer als −8 °C.', 'Vergleiche die Höhe der beiden Säulen.'), { bild: thermo(-10, 10, 1, 5, [a, o1], [b, o2]), nachweis: [{ art: 'thermowahl', was: 'waermstes' }] }); },
    () => { const w = -wahl([11, 12, 13, 14, 16, 17, 18, 19]);
      return antwort(Z('Schau auf das Thermometer.', 'Lies die Temperatur ab.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']], hTh(0), [BILD(zt(w))], { einheit: '°C', bild: thermo(-20, 10, 1, 5, w) }); },
  ]);
  const ALLTAG = (b) => [
    [`Ein Taucher ist ${b} m unter der Wasseroberfläche.`, 'unter', '−', 'm'],
    [`Auf dem Konto sind ${b} € Schulden.`, 'Schulden', '−', '€'],
    [`Ein Bergwerk liegt ${b} m unter dem Meeresspiegel.`, 'unter', '−', 'm'],
    [`Die Burg wurde im Jahr ${b} vor Christus gegründet.`, 'vor Christus', '−', null],
  ];
  sechs(N1, 'G', [
    () => { const b = zz(12, 95), [satz, wort, , einheit] = wahl(ALLTAG(b));
      return antwort(Z(satz, 'Schreibe die Angabe als Zahl mit Vorzeichen.'), -b, 'd', [[b, 'vorzeichen-vergessen']],
        H(1, 'Unter null, unter dem Meeresspiegel, Schulden und Jahre vor Christus sind negativ.', '20 m unter dem Meeresspiegel schreibt man als −20 m.', 'Entscheide: Liegt die Angabe über oder unter null? Setze das passende Vorzeichen.'), [KONTEXT(b, wort, true)], einheit ? { einheit } : {}); },
    () => { const bs = mische([zz(2, 9), zz(11, 30), zz(31, 60), zz(61, 95)]);
      const paare = [[`${bs[0]} Grad unter null`, `${zt(-bs[0])} °C`], [`${bs[1]} € Guthaben`, `${bs[1]} €`], [`${bs[2]} € Schulden`, `${zt(-bs[2])} €`], [`${bs[3]} m unter dem Meeresspiegel`, `${zt(-bs[3])} m`]];
      return zuordnen('Ordne jeder Angabe die passende Zahl zu.', paare,
        H(1, 'Unter null und Schulden sind negativ. Guthaben ist positiv.', '5 € Schulden sind −5 €.', 'Schau zuerst auf die Einheit. Entscheide dann über das Vorzeichen.'), { nachweis: [FREI('Alltagsangaben mit Vorzeichen, jede Einheit kommt mit einer anderen Zahl vor')] }); },
    () => { const w = -wahl([2, 4, 6, 8, 12, 14, 16, 18]);
      return antwort(Z('Schau auf das Thermometer.', 'Ein Strich bedeutet hier 2 Grad.', 'Lies die Temperatur ab.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [-10 * Math.floor(-w / 10) - (-w % 10) / 2, 'strahl-einerschritte'], [gespiegelt(w, 10), 'strahl-gespiegelt']],
        H(1, 'Achte auf die Skala: Ein Strich bedeutet hier 2 Grad.', 'Zwei Striche unter −10 °C sind es −14 °C.', 'Zähle von der nächsten beschrifteten Zahl in Zweierschritten bis zur Säule.'), [BILD(zt(w))], { einheit: '°C', bild: thermo(-20, 30, 2, 10, w) }); },
    () => { const b = zz(12, 95);
      return wahlAus(Z(`Ein Kontoauszug zeigt den Kontostand ${zt(-b)} €.`, 'Kreuze an, was das bedeutet.'), `${b} € Schulden`, [[`${b} € Guthaben`, 'vorzeichen-vergessen'], [`${b} € abgehoben`, 'begriffe-verwechselt']],
        H(1, 'Ein negativer Kontostand bedeutet Schulden.', '−30 € heißt: 30 € Schulden.', 'Achte auf das Vorzeichen. Minus heißt: Es fehlt Geld.'), { daten: konto(['Buchung', 'Betrag'], [['Kontostand', `${zt(-b)} €`]]), nachweis: [FREI('Ein negativer Kontostand bedeutet Schulden')] }); },
    () => { const w = -wahl([6, 7, 8, 9]), k = kind(), falsch = gespiegelt(w, 5);
      return wahlAus(Z(`${k} liest am Thermometer ${zt(falsch)} °C ab.`, 'Das ist falsch.', 'Kreuze die richtige Temperatur an.'), `${zt(w)} °C`, [[`${zt(-w)} °C`, 'vorzeichen-vergessen'], [`${zt(w - 5)} °C`, 'strahl-einerschritte']],
        H(1, 'Unter der Null werden die Zahlen nach unten immer kleiner.', 'Zwei Striche unter −5 °C sind es −7 °C.', 'Suche die beschriftete Zahl über der Säule. Zähle von dort nach unten.'), { bild: thermo(-10, 10, 1, 5, w), nachweis: [BILD(zt(w)), WERT(zt(w))] }); },
    () => { const b = zz(12, 95), h = zz(12, 95);
      if (b === h) return null;
      return luecken(Z(`Ein Vogel fliegt ${h} m über dem Meer.`, `Ein Fisch schwimmt ${b} m unter der Wasseroberfläche.`, 'Die Wasseroberfläche hat die Höhe 0 m.', 'Schreibe beide Höhen als Zahlen mit Vorzeichen.', 'Vogel: {{a}} m', 'Fisch: {{b}} m'),
        { a: lk(h, [[-h, 'vorzeichen-vergessen']]), b: lk(-b, [[b, 'vorzeichen-vergessen']]) },
        H(1, 'Über der Wasseroberfläche ist positiv, darunter negativ.', '5 m unter Wasser sind −5 m.', 'Entscheide für jede Angabe: über oder unter 0 m?'), { nachweis: [KONTEXT(h, 'über', false), KONTEXT(b, 'unter', true)] }); },
  ]);
  sechs(N1, 'M', [
    () => { const b = D(zz(105, 995), 2), was = wahl([[`Der Wasserstand eines Sees liegt ${dt(b)} m unter dem Normalwert.`, 'unter', 'm'], [`Ein Kellerboden liegt ${dt(b)} m unter der Straße.`, 'unter', 'm'], [`Ein Konto zeigt ${dt(b, 2)} € Schulden.`, 'Schulden', '€']]);
      if (b[1] !== 100) return null;
      return antwort(Z(was[0], 'Schreibe die Angabe als Zahl mit Vorzeichen.'), neg(b), 'd', [[b, 'vorzeichen-vergessen']],
        H(2, 'Angaben unter einem Vergleichswert und Schulden sind negativ.', 'Setze das Minuszeichen vor die Dezimalzahl.'), [KONTEXT(dt(b), was[1], true)], { einheit: was[2], ...(was[2] === '€' ? { geld: true } : {}) }); },
    () => { const [a, b, c, d] = [zz(2, 15), zz(105, 995), zz(2, 9), zz(12, 95)];
      const roh = mische([[`${a} Grad unter null`, true], [`${b} m über dem Meeresspiegel`, false], [`${d},50 € Schulden`, true], [`${c}. Untergeschoss`, true], [`${d + 3} € Guthaben`, false]]);
      return auswahl('Kreuze alle Angaben an, die man mit einer negativen Zahl schreibt.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'vorzeichen-vergessen')),
        H(2, 'Negativ ist alles, was unter einem Nullpunkt liegt: unter null, unter dem Erdgeschoss, Schulden.', 'Prüfe jede Angabe einzeln: Liegt sie über oder unter dem Nullpunkt?'), { mehrfach: true, nachweis: [FREI('Unter null, Schulden und Untergeschoss sind negativ, über dem Meeresspiegel und Guthaben positiv')] }); },
    () => { const [ort, b] = wahl([['Das Ufer des Toten Meeres', 428], ['Der tiefste Punkt der Niederlande', 7], ['Der Boden des Kaspischen Meeres am Ufer', 28], ['Eine Stadt in einer Senke', zz(110, 160)]]), h = zz(105, 960);
      return luecken(Z(`${ort} liegt ${b} m unter dem Meeresspiegel. Die Burg liegt ${h} m über dem Meeresspiegel.`, 'Schreibe beide Höhen als Zahlen mit Vorzeichen.', 'Ufer oder Stadt: {{a}} m', 'Burg: {{b}} m'),
        { a: lk(-b, [[b, 'vorzeichen-vergessen']]), b: lk(h, [[-h, 'vorzeichen-vergessen']]) },
        H(2, 'Der Meeresspiegel hat die Höhe 0 m.', 'Unter dem Meeresspiegel steht ein Minus, darüber nicht.'), { nachweis: [KONTEXT(b, 'unter', true), KONTEXT(h, 'über', false)] }); },
    () => { const t = zz(11, 95), w = D(-t);
      if (t % 10 === 0) return null;
      return wahlAus(Z(`Ein Thermometer zeigt ${dt(w)} °C.`, 'Kreuze den passenden Satz an.'), `Es ist ${dt(D(t))} Grad unter null.`, [[`Es ist ${dt(D(t))} Grad über null.`, 'vorzeichen-vergessen'], [`Es ist ${dt(D(t + 10))} Grad unter null.`, 'strahl-einerschritte']],
        H(2, 'Das Minus heißt: unter null.', 'Lies die Zahl ohne Vorzeichen und entscheide dann: über oder unter null?'), { nachweis: [FREI('Eine negative Temperatur liegt unter null')] }); },
    () => { const b = D(zz(105, 995), 2);
      if (b[1] !== 100) return null;
      return antwort(Z(`Ein Laden macht in einem Monat ${dt(b, 2)} € Verlust.`, 'Schreibe den Verlust als Zahl mit Vorzeichen.'), neg(b), 'd', [[b, 'vorzeichen-vergessen']],
        H(2, 'Ein Gewinn ist positiv, ein Verlust negativ.', 'Setze ein Minus vor die Zahl.'), [KONTEXT(dt(b, 2), 'Verlust', true)], { einheit: '€', geld: true }); },
    () => { const bs = mische([zz(105, 395), zz(405, 695), zz(705, 995)]), z = zz(11, 99), w = D(-z);
      if (z % 10 === 0) return null;
      const paare = [[`${bs[0]} € Guthaben`, `${bs[0]} €`], [`${bs[1]} € Schulden`, `${zt(-bs[1])} €`], [`${bs[2]} m unter dem Meeresspiegel`, `${zt(-bs[2])} m`], [`${dt(D(z))} Grad unter null`, `${dt(w)} °C`]];
      return zuordnen('Ordne jeder Angabe die passende Zahl zu.', paare, H(2, 'Schulden und Angaben unter null sind negativ.', 'Achte auf die Einheit und auf das Vorzeichen.'), { nachweis: [FREI('Alltagsangaben mit Vorzeichen, jede Einheit kommt mit einer anderen Zahl vor')] }); },
  ]);
  sechs(N1, 'E', [
    () => { const roh = mische([['Ein Kontostand von −20 € bedeutet 20 € Schulden.', true], ['−8 °C ist wärmer als −3 °C.', false], ['Das Jahr 50 vor Christus schreibt man als −50.', true], ['Ein Taucher bei −12 m ist tiefer als ein Taucher bei −7 m.', true], ['Der Kontostand −5 € ist besser als der Kontostand −2 €.', false], ['0 °C ist eine negative Temperatur.', false]]).slice(0, 5);
      if (roh.filter(([, r]) => r).length < 2 || roh.filter(([, r]) => !r).length < 2) return null;
      return auswahl('Prüfe die Aussagen. Kreuze alle an, die stimmen.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'negativ-groesser')), H(3, 'Denke an die Zahlengerade: Weiter links heißt kleiner, kälter, tiefer oder weniger Geld.'), { mehrfach: true, nachweis: [FREI('Aussagen über negative Zahlen im Alltag')] }); },
    () => { const t = zz(105, 395), b = D(t, 2);
      if (b[1] !== 100) return null;
      return wahlAus(Z(`Der Pegel eines Flusses zeigt ${dt(neg(b))} m.`, 'Der Wert 0 m ist der normale Wasserstand.', 'Kreuze die passende Bedeutung an.'), `Das Wasser steht ${dt(b)} m unter dem normalen Wasserstand.`,
        [[`Das Wasser steht ${dt(b)} m über dem normalen Wasserstand.`, 'vorzeichen-vergessen'], [`Das Wasser ist ${dt(b)} m tief.`, 'begriffe-verwechselt'], [`Das Wasser steht ${t} m unter dem normalen Wasserstand.`, 'dezimal-wie-natuerlich']],
        H(3, 'Der Nullpunkt ist hier der normale Wasserstand, nicht der Grund des Flusses.'), { nachweis: [FREI('Ein negativer Pegelwert liegt unter dem normalen Wasserstand')] }); },
    () => { const z = D(-zz(1010, 9990), 2), zeilen = [['Kontostand am 1.', `${dt(z, 2)} € Soll`]];
      if (z[1] > 100) return null;
      return antwort(Z('Auf einem Kontoauszug steht „Soll“ für Schulden und „Haben“ für Guthaben.', 'Schreibe den Kontostand als Zahl mit Vorzeichen.'), z, 'd', [[neg(z), 'vorzeichen-vergessen']],
        H(3, 'Soll bedeutet: Auf dem Konto fehlt Geld.'), [KONTEXT(dt(neg(z), 2), 'Soll', true)], { einheit: '€', geld: true, daten: konto(['Buchung', 'Betrag'], zeilen) }); },
    () => { const b = zz(2, 5), hoch = zz(2, 9);
      return wahlAus(Z(`Im Aufzug eines Hauses steht 0 für das Erdgeschoss.`, `Herr Lang steigt im Stockwerk ${zt(-b)} ein und fährt in den ${hoch}. Stock.`, 'Kreuze an, wo Herr Lang einsteigt.'), `im ${b}. Untergeschoss`,
        [[`im ${b}. Stock über dem Erdgeschoss`, 'vorzeichen-vergessen'], ['im Erdgeschoss', 'vorzeichen-vergessen'], [`im ${hoch}. Untergeschoss`, 'begriffe-verwechselt']],
        H(3, 'Negative Stockwerke liegen unter dem Erdgeschoss.'), { nachweis: [FREI('Ein negatives Stockwerk liegt unter dem Erdgeschoss')] }); },
    () => { const b = zz(12, 95), k = kind();
      return wahlAus(Z(`${k} schreibt für „${b} m unter dem Meeresspiegel“ die Zahl ${b} m.`, 'Prüfe die Angabe. Kreuze die richtige Antwort an.'), `Falsch. Richtig ist ${zt(-b)} m.`, [['Stimmt.', 'vorzeichen-vergessen'], [`Falsch. Richtig ist ${zt(-b * 10)} m.`, 'stellenwert']],
        H(3, 'Unter dem Meeresspiegel heißt: unter der Höhe 0 m.'), { nachweis: [FREI('Unter dem Meeresspiegel ist negativ')] }); },
    () => { const g = D(zz(1005, 9995), 2), v = D(zz(1005, 9995), 2);
      if (g[1] !== 100 || v[1] !== 100) return null;
      return luecken(Z(`Ein Gewinn von ${dt(g, 2)} € wird als ${dt(g, 2)} € geschrieben.`, `Ein Verlust von ${dt(v, 2)} € wird ebenso mit Vorzeichen geschrieben.`, 'Ergänze die Zahl.', 'Verlust: {{a}} €'),
        { a: [dt(neg(v), 2), [{ wert: dt(v, 2), fehlvorstellung: 'vorzeichen-vergessen' }]] }, H(3, 'Gewinn und Verlust sind Gegensätze. Einer davon ist negativ.'), { nachweis: [KONTEXT(dt(v, 2), 'Verlust', true)] }); },
  ]);

  // ================= N2: Zahlengerade ablesen und eintragen =================
  const hAb = (n) => H(n, 'Links von der Null stehen die negativen Zahlen. Zähle von einer beschrifteten Zahl aus.', 'Zwei Striche links von −5 steht −7.', 'Suche die nächste beschriftete Zahl. Zähle von dort die Striche bis zum Pfeil.');
  const hEin = (n) => H(n, 'Negative Zahlen stehen links von der Null.', '−3 liegt drei Striche links von der Null.', 'Starte bei der nächsten beschrifteten Zahl. Gehe so viele Striche weiter, wie noch fehlen.');
  const ablesen = (n, bild, w, schritt, beschr, extraFehler = []) => antwort(Z('Schau auf die Zahlengerade.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, beschr), 'strahl-gespiegelt'], ...extraFehler], hAb(n), [BILD(zt(w))], { bild: { ...bild, pfeil: w } });
  sechs(N2, 'F', [
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]); return ablesen(0, ZG(), w, 1, 5); },
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, ZG(), w, [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']], hEin(0), [ANGABE(zt(w))]); },
    () => { const w = -wahl([11, 12, 13, 14, 16, 17, 18, 19]); return ablesen(0, gerade(-20, 0, 1, 5), w, 1, 5); },
    () => { const w = -wahl([11, 12, 13, 14, 16, 17, 18, 19]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, gerade(-20, 5, 1, 5), w, [[gespiegelt(w, 5), 'strahl-gespiegelt'], [w + 10, 'stellenwert']], hEin(0), [ANGABE(zt(w))]); },
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return wahlAus(Z('Schau auf die Zahlengerade.', 'Kreuze die Zahl an, auf die der Pfeil zeigt.'), zt(w), [[zt(-w), 'vorzeichen-vergessen'], [zt(gespiegelt(w, 5)), 'strahl-gespiegelt']], hAb(0), { bild: ZG({ pfeil: w }), nachweis: [BILD(zt(w)), WERT(zt(w))] }); },
    () => { const w = -wahl([2, 4, 6, 8, 12, 14, 16, 18]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Von Strich zu Strich sind es 2.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [-10 * Math.floor(-w / 10) - (-w % 10) / 2, 'strahl-einerschritte']],
        H(0, 'Achte auf die Einteilung: Ein Strich bedeutet hier 2.', 'Ein Strich links von −10 steht −12.', 'Zähle von der nächsten beschrifteten Zahl in Zweierschritten bis zum Pfeil.'), [BILD(zt(w))], { bild: gerade(-20, 10, 2, 10, { pfeil: w }) }); },
  ]);
  sechs(N2, 'G', [
    () => { const w = -5 * wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', w, 'd', [[-w, 'vorzeichen-vergessen'], [-25 * Math.floor(-w / 25) - (-w % 25) / 5, 'strahl-einerschritte'], [gespiegelt(w, 25), 'strahl-gespiegelt']],
        H(1, 'Bestimme zuerst, wie viel ein Strich bedeutet.', 'Zwischen 0 und −25 liegen 5 Striche. Ein Strich ist 5.', 'Zähle von der nächsten beschrifteten Zahl in Fünferschritten bis zum Pfeil.'), [BILD(zt(w))], { bild: gerade(-50, 50, 5, 25, { pfeil: w }) }); },
    () => { const w = -10 * wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, gerade(-100, 20, 10, 50), w, [[gespiegelt(w, 50), 'strahl-gespiegelt'], [w / 10, 'strahl-einerschritte']], H(1, 'Ein Strich bedeutet hier 10.', '−70 liegt zwei Striche links von −50.', 'Suche die nächste beschriftete Zahl. Gehe in Zehnerschritten weiter.'), [ANGABE(zt(w))]); },
    () => { const w = -2 * wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', w, 'd', [[-w, 'vorzeichen-vergessen'], [-10 * Math.floor(-w / 10) - (-w % 10) / 2, 'strahl-einerschritte'], [gespiegelt(w, 10), 'strahl-gespiegelt']],
        H(1, 'Ein Strich bedeutet hier 2.', 'Zwei Striche links von −20 steht −24.', 'Zähle von der nächsten beschrifteten Zahl in Zweierschritten bis zum Pfeil.'), [BILD(zt(w))], { bild: gerade(-40, 20, 2, 10, { pfeil: w }) }); },
    () => { const w = -wahl([11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, gerade(-30, 10, 1, 10), w, [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 10), 'strahl-gespiegelt']], hEin(1), [ANGABE(zt(w))]); },
    () => { const d = wahl([2, 3, 4, 5]), s = -zz(30, 60), folge = [s, s + d, s + 2 * d];
      return luecken(Z(`Die Zahlen steigen immer um ${d}.`, 'Ergänze die nächsten beiden Zahlen.', `${folge.map(zt).join(', ')}, {{a}}, {{b}}`),
        { a: lk(s + 3 * d, [[s + 2 * d - d, 'richtung-vertauscht'], [-(s + 3 * d), 'vorzeichen-vergessen']]), b: lk(s + 4 * d, [[s + 2 * d - 2 * d, 'richtung-vertauscht'], [-(s + 4 * d), 'vorzeichen-vergessen']]) },
        H(1, 'Steigen heißt: Auf der Zahlengeraden geht es nach rechts. Negative Zahlen werden dabei näher an der Null.', `Von −30 aus um 3 gestiegen ist −27.`, `Rechne immer plus ${d}.`), { nachweis: [`${zt(s + 2 * d)} + ${d} = ${zt(s + 3 * d)}`, `${zt(s + 3 * d)} + ${d} = ${zt(s + 4 * d)}`] }); },
    () => { const m = -zz(12, 98);
      return luecken(`Ergänze die beiden Nachbarzahlen. {{a}} < ${zt(m)} < {{b}}`, { a: lk(m - 1, [[m + 1, 'negativ-groesser'], [-(m - 1), 'vorzeichen-vergessen']]), b: lk(m + 1, [[m - 1, 'negativ-groesser'], [-(m + 1), 'vorzeichen-vergessen']]) },
        H(1, 'Die kleinere Nachbarzahl liegt links, die größere rechts.', 'Die Nachbarzahlen von −40 sind −41 und −39.', 'Gehe von der Zahl einen Schritt nach links und einen nach rechts.'), { nachweis: [`${zt(m)} − 1 = ${zt(m - 1)}`, `${zt(m)} + 1 = ${zt(m + 1)}`] }); },
  ]);
  sechs(N2, 'M', [
    () => { const w = -10 * wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', w, 'd', [[-w, 'vorzeichen-vergessen'], [-100 * Math.floor(-w / 100) - (-w % 100) / 10, 'strahl-einerschritte'], [gespiegelt(w, 100), 'strahl-gespiegelt']],
        H(2, 'Bestimme zuerst, wie viel ein Strich bedeutet.', 'Zähle von der nächsten beschrifteten Zahl in passenden Schritten bis zum Pfeil.'), [BILD(zt(w))], { bild: gerade(-300, 100, 10, 100, { pfeil: w }) }); },
    () => { const w = -50 * wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, gerade(-500, 500, 50, 250), w, [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 250), 'strahl-gespiegelt']], H(2, 'Bestimme zuerst, wie viel ein Strich bedeutet.', 'Zwischen zwei beschrifteten Zahlen liegen 5 Striche. Gehe von der nächsten beschrifteten Zahl weiter.'), [ANGABE(zt(w))]); },
    () => { const a = -zz(10, 60), b = a + 2 * zz(5, 40);
      if (b === 0 || (a + b) / 2 === 0) return null;
      const m = (a + b) / 2;
      return antwort(`Bestimme die Zahl, die genau in der Mitte zwischen ${zt(a)} und ${zt(b)} liegt.`, m, 'd', [[(b - a) / 2, 'abstand-ueber-null'], [-m, 'vorzeichen-vergessen'], [a + b, 'sach-schritt-vergessen']],
        H(2, 'Die Mitte ist von beiden Zahlen gleich weit entfernt.', 'Zähle die Schritte zwischen den Zahlen. Gehe die Hälfte davon von der linken Zahl nach rechts.'), [`${zt(b)} − (${zt(a)}) = ${b - a}`, `${b - a} : 2 = ${(b - a) / 2}`, `${zt(a)} + ${(b - a) / 2} = ${zt(m)}`]); },
    () => { const w = -2 * wahl([3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', w, 'd', [[-w, 'vorzeichen-vergessen'], [-20 * Math.floor(-w / 20) - (-w % 20) / 2, 'strahl-einerschritte'], [gespiegelt(w, 20), 'strahl-gespiegelt']],
        H(2, 'Bestimme zuerst, wie viel ein Strich bedeutet.', 'Zähle von der nächsten beschrifteten Zahl in Zweierschritten bis zum Pfeil.'), [BILD(zt(w))], { bild: gerade(-60, 20, 2, 20, { pfeil: w }) }); },
    () => { const u = -zz(20, 60), o = u + zz(5, 8), m = `${zt(u)} < ▢ < ${zt(o)}`, drin = mische([u + 1, u + 2, o - 1]).slice(0, 2), draussen = [u - zz(1, 3), o + zz(1, 3), -(u + 2)];
      return auswahl(Z(`Kreuze alle Zahlen an, für die gilt: ${m}`), mische([...drin.map((x) => opt(zt(x), true)), ...draussen.map((x) => opt(zt(x), false, x === -(u + 2) ? 'vorzeichen-vergessen' : 'negativ-groesser'))]),
        H(2, 'Die Zahl muss rechts von der ersten und links von der zweiten Zahl liegen.', 'Prüfe jede Antwort an der Zahlengeraden in Gedanken.'), { mehrfach: true, nachweis: [{ art: 'einsetzen', muster: m }] }); },
    () => { const u = -zz(4, 30), o = zz(2, 25), anzahl = o - u - 1;
      return antwort(`Bestimme, wie viele ganze Zahlen zwischen ${zt(u)} und ${o} liegen.`, anzahl, 'd', [[anzahl + 1, 'sach-schritt-vergessen'], [o - (-u) - 1, 'abstand-ueber-null'], [anzahl + 2, 'sach-schritt-vergessen']],
        H(2, 'Zähle die negativen Zahlen, die Null und die positiven Zahlen dazwischen.', 'Die beiden Grenzen zählen nicht mit.'), [{ art: 'zaehle', von: zt(u), bis: String(o) }]); },
  ]);
  sechs(N2, 'E', [
    () => { const w = -100 * wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', w, 'd', [[-w, 'vorzeichen-vergessen'], [-500 * Math.floor(-w / 500) - (-w % 500) / 100, 'strahl-einerschritte'], [gespiegelt(w, 500), 'strahl-gespiegelt']],
        H(3, 'Bestimme zuerst die Schrittweite: Wie viele Striche liegen zwischen zwei beschrifteten Zahlen?'), [BILD(zt(w))], { bild: gerade(-1000, 1000, 100, 500, { pfeil: w }) }); },
    () => { const w = -5 * wahl([1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, gerade(-120, 30, 5, 30), w, [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 30), 'strahl-gespiegelt']], H(3, 'Bestimme zuerst, wie viel ein Strich bedeutet. Die Null liegt nicht in der Mitte.'), [ANGABE(zt(w))]); },
    () => { const w = -2 * wahl([16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44]);
      return antwort(Z('Auf dieser Zahlengeraden fehlt die Null.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), w, 'd', [[-w, 'vorzeichen-vergessen'], [-10 * Math.floor(-w / 10) - (-w % 10) / 2, 'strahl-einerschritte'], [gespiegelt(w, 10), 'strahl-gespiegelt']],
        H(3, 'Bestimme zuerst die Schrittweite. Je weiter links, desto kleiner die Zahl.'), [BILD(zt(w))], { bild: gerade(-90, -30, 2, 10, { pfeil: w }) }); },
    () => { const s = zz(3, 15), k = zz(s + 5, 40), w = s - k;
      return antwort(Z(`Ein Punkt liegt bei ${s}.`, `Bestimme die Zahl, die ${k} Schritte links von diesem Punkt liegt.`), w, 'd', [[s + k, 'richtung-vertauscht'], [k - s, 'vorzeichen-vergessen'], [w + 1, 'sach-schritt-vergessen']],
        H(3, 'Zähle erst die Schritte bis zur Null. Gehe dann weiter nach links.'), [`${s} − ${k} = ${zt(w)}`]); },
    () => { const u = -zz(25, 60), o = -zz(3, 20), anzahl = o - u - 1;
      return antwort(`Bestimme, wie viele ganze Zahlen zwischen ${zt(u)} und ${zt(o)} liegen.`, anzahl, 'd', [[anzahl + 1, 'sach-schritt-vergessen'], [(-u) + (-o) - 1, 'abstand-ueber-null'], [anzahl + 2, 'sach-schritt-vergessen']],
        H(3, 'Rechne zuerst den Abstand der beiden Zahlen aus. Die Grenzen zählen nicht mit.'), [{ art: 'zaehle', von: zt(u), bis: zt(o) }]); },
    () => { const h = zz(3, 40), d = 2 * h;
      return antwort(Z(`Zwei Zahlen liegen gleich weit von der Null entfernt, eine links und eine rechts.`, `Zusammen sind sie ${d} Schritte voneinander entfernt.`, 'Gib die kleinere der beiden Zahlen an.'), -h, 'd', [[h, 'negativ-groesser'], [-d, 'sach-schritt-vergessen']],
        H(3, 'Die Null liegt genau in der Mitte zwischen den beiden Zahlen.'), [`${d} : 2 = ${h}`, `0 − ${h} = ${zt(-h)}`]); },
  ]);
}
