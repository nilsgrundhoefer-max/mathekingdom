// Aufgaben zu 7.1.1 „Rationale Zahlen“ (Lernziele Z1, Z2) nach ADR 0015 und ADR 0043.
// Z1: negative Zahlen im Alltag deuten, an der Zahlengeraden ablesen und eintragen. Z2: Gegenzahl, Betrag (auf F und G „Abstand zur Null“), Zahlbereiche ab M.
// Grilling mit Nils (2026-11-24): F ganze Zahlen bis ±20 und immer ein Bild (Thermometer, Zahlengerade), G eine Nachkommastelle,
// M zwei Stellen und Brüche, E Brüche mit feinerer Einteilung, Fehlersuche und Rückwärtsaufgaben.
// Typische Fehler: Vorzeichen vergessen, von der beschrifteten Zahl in die falsche Richtung zählen, Betrag und Gegenzahl verwechseln.

import { sechs, auswahl, luecken, zuordnen, Z } from '../werkzeug.mjs';
import { Q, D, plus, neg, T, zt, dt, bt, ut, br, opt, zz, wahl, mische, antwort, wahlAus, lk, lkd, gerade, thermo, H, X, AB, rechne, markiere, ANGABE, BILD, KONTEXT, WERT, FREI, AUSSAGEN, kind, MINUS, glg, val, txt } from './7-1-rational.mjs';

const Z1 = '7.1.1-Z1', Z2 = '7.1.1-Z2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
// Der Fehler „von der beschrifteten Zahl in die falsche Richtung gezählt“: aus −7 wird −3 (bei Beschriftung in Fünfern).
const gespiegelt = (t, b) => { const l = -b * Math.floor(-t / b); return l + (-t % b); };
// Alltagsangaben mit Vorzeichen: [Satz, Wort für das Vorzeichen, negativ?, Einheit]
const ALLTAG = (b) => [
  [`Ein Taucher ist ${b} m unter der Wasseroberfläche.`, 'unter', true, 'm'],
  [`Das Thermometer zeigt ${b} Grad unter null.`, 'unter', true, '°C'],
  [`Auf dem Konto sind ${b} € Schulden.`, 'Schulden', true, '€'],
  [`Ein Bergwerk liegt ${b} m unter dem Meeresspiegel.`, 'unter', true, 'm'],
];

export function zahlen() {
  // ================= Z1: ablesen, eintragen, Alltag =================
  const hAblesen = (n) => H(n, 'Links von der Null stehen die negativen Zahlen. Zähle von einer beschrifteten Zahl aus.', 'Zwei Striche links von −5 steht −7.', 'Suche die nächste beschriftete Zahl. Zähle von dort die Striche bis zum Pfeil.');
  sechs(Z1, 'F', [
    () => { const w = -zz(1, 9);
      return antwort(Z('Schau auf das Thermometer.', 'Wie viel Grad Celsius sind es?'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']],
        H(0, 'Unter der Null sind die Temperaturen negativ. Sie haben ein Minus.', 'Drei Striche unter der Null sind es −3 °C.', 'Zähle die Striche von der Null nach unten. Schreibe ein Minus davor.'), [BILD(zt(w))], { einheit: '°C', bild: thermo(-10, 10, 1, 5, w) }); },
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Auf welche Zahl zeigt der Pfeil?'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']], hAblesen(0), [BILD(zt(w))], { bild: ZG({ pfeil: w }) }); },
    () => { const w = -wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(`Markiere ${zt(w)} an der Zahlengeraden.`, ZG(), w, [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']],
        H(0, 'Negative Zahlen stehen links von der Null.', '−3 liegt drei Striche links von der Null.', 'Starte bei der Null. Gehe so viele Striche nach links, wie die Zahl sagt.'), [ANGABE(zt(w))]); },
    () => { const b = zz(2, 9);
      return wahlAus(Z(`Es sind ${b} Grad unter null.`, 'Welche Zahl passt dazu?'), `${zt(-b)} °C`, [[`${b} °C`, 'vorzeichen-vergessen'], ['0 °C', null]],
        H(0, 'Unter null heißt: Die Zahl bekommt ein Minus.', '3 Grad unter null sind −3 °C.', 'Schau auf das Thermometer. Liegt die rote Säule über oder unter der Null?'), { bild: thermo(-10, 10, 1, 5, -b), nachweis: [KONTEXT(b, 'unter', true), WERT(zt(-b))] }); },
    () => { const kalt = -zz(6, 9), mild = -zz(1, 4), warm = zz(1, 6), werte = mische([kalt, mild, warm]), namen = ['morgens', 'mittags', 'abends'];
      const fv = (w) => (w === mild ? 'negativ-groesser' : 'vorzeichen-vergessen');
      return auswahl(Z('Die Thermometer zeigen drei Temperaturen an einem Tag.', 'Wann war es am kältesten?'), werte.map((w, i) => opt(namen[i], w === kalt, w === kalt ? undefined : fv(w))),
        H(0, 'Je weiter unten die Säule steht, desto kälter ist es.', '−8 °C ist kälter als −2 °C.', 'Suche das Thermometer mit der niedrigsten Säule.'), { bild: thermo(-10, 10, 1, 5, ...werte.map((w, i) => [w, namen[i]])), nachweis: [{ art: 'thermowahl', was: 'kaeltestes' }] }); },
    () => { const w = -wahl([11, 12, 13, 14, 16, 17, 18, 19]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Auf welche Zahl zeigt der Pfeil?'), w, 'd', [[-w, 'vorzeichen-vergessen'], [gespiegelt(w, 5), 'strahl-gespiegelt']], hAblesen(0), [BILD(zt(w))], { bild: gerade(-20, 0, 1, 5, { pfeil: w }) }); },
  ]);
  const ZEHNTEL = (extra) => gerade(-20, 20, 1, 10, { teiler: 10, ...extra });
  sechs(Z1, 'G', [
    () => { const t = -wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Auf welche Zahl zeigt der Pfeil?'), D(t), 'd', [[D(-t), 'vorzeichen-vergessen'], [D(gespiegelt(t, 10)), 'strahl-gespiegelt']],
        H(1, 'Zwischen zwei beschrifteten Zahlen liegen zehn Schritte. Jeder Schritt ist ein Zehntel.', 'Drei Striche links von −1 steht −1,3.', 'Suche die nächste beschriftete Zahl. Zähle von dort die Zehntel bis zum Pfeil.'), [BILD(dt(D(t)))], { bild: ZEHNTEL({ pfeil: t }) }); },
    () => { const b = zz(12, 95), [satz, wort, negativ, einheit] = wahl(ALLTAG(b).filter((x) => x[3] !== '°C'));
      return antwort(Z(satz, 'Schreibe die Angabe als Zahl mit Vorzeichen.'), -b, 'd', [[b, 'vorzeichen-vergessen']],
        H(1, 'Unter null, unter dem Meeresspiegel und Schulden sind negativ.', '20 m unter dem Meeresspiegel schreibt man als −20 m.', 'Entscheide: Liegt die Angabe über oder unter null? Setze das passende Vorzeichen.'), [KONTEXT(b, wort, negativ)], { einheit }); },
    () => { const t = -wahl([3, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 18]);
      return markiere(`Markiere ${dt(D(t))} an der Zahlengeraden.`, ZEHNTEL(), t, [[-t, 'vorzeichen-vergessen'], [gespiegelt(t, 10), 'strahl-gespiegelt']],
        H(1, 'Jeder kleine Schritt ist ein Zehntel.', '−1,2 liegt zwei Striche links von −1.', 'Gehe erst zur ganzen Zahl. Gehe dann die Zehntel weiter nach links.'), [ANGABE(dt(D(t)))]); },
    () => { const w = -wahl([2, 4, 6, 8, 12, 14, 16, 18]);
      return antwort(Z('Schau auf das Thermometer.', 'Wie viel Grad Celsius sind es?'), w, 'd', [[-w, 'vorzeichen-vergessen'], [-10 * Math.floor(-w / 10) - (-w % 10) / 2, 'strahl-einerschritte'], [gespiegelt(w, 10), 'strahl-gespiegelt']],
        H(1, 'Achte auf die Skala: Ein Strich bedeutet hier 2 Grad.', 'Zwei Striche unter −10 °C sind es −14 °C.', 'Zähle von der nächsten beschrifteten Zahl in Zweierschritten bis zur Säule.'), [BILD(zt(w))], { einheit: '°C', bild: thermo(-20, 30, 2, 10, w) }); },
    () => { const bs = mische([zz(2, 9), zz(11, 30), zz(31, 60), zz(61, 95)]);
      const paare = [[`${bs[0]} Grad unter null`, `${zt(-bs[0])} °C`], [`${bs[1]} € Guthaben`, `${bs[1]} €`], [`${bs[2]} € Schulden`, `${zt(-bs[2])} €`], [`${bs[3]} m unter dem Meeresspiegel`, `${zt(-bs[3])} m`]];
      return zuordnen('Ordne jeder Angabe die passende Zahl zu.', paare,
        H(1, 'Unter null und Schulden sind negativ. Guthaben ist positiv.', '5 € Schulden sind −5 €.', 'Schau zuerst auf die Einheit. Entscheide dann über das Vorzeichen.'), { nachweis: [FREI('Alltagsangaben mit Vorzeichen, jede Einheit kommt mit einer anderen Zahl vor')] }); },
    () => { const w = -wahl([6, 7, 8, 9]), k = kind(), falsch = gespiegelt(w, 5);
      return wahlAus(Z(`${k} liest am Thermometer ${zt(falsch)} °C ab.`, 'Das ist falsch.', 'Wie viel Grad sind es wirklich?'), `${zt(w)} °C`, [[`${zt(-w)} °C`, 'vorzeichen-vergessen'], [`${zt(w - 5)} °C`, 'strahl-einerschritte']],
        H(1, 'Unter der Null werden die Zahlen nach unten immer kleiner.', 'Zwei Striche unter −5 °C sind es −7 °C.', `Suche die beschriftete Zahl über der Säule. Zähle von dort nach unten.`), { bild: thermo(-10, 10, 1, 5, w), nachweis: [BILD(zt(w)), WERT(zt(w))] }); },
  ]);
  sechs(Z1, 'M', [
    () => { const t = -wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29]);
      return antwort('Auf welche Zahl zeigt der Pfeil an der Zahlengeraden?', D(t, 2), 'd', [[D(-t, 2), 'vorzeichen-vergessen'], [D(gespiegelt(t, 10), 2), 'strahl-gespiegelt'], [D(t, 1), 'strahl-einerschritte']],
        H(2, 'Zwischen zwei beschrifteten Zahlen liegen zehn Schritte. Wie groß ist ein Schritt?', 'Ein Schritt ist ein Hundertstel. Zähle von der nächsten beschrifteten Zahl nach links.'), [BILD(dt(D(t, 2)))], { bild: gerade(-30, 10, 1, 10, { teiler: 100, pfeil: t }) }); },
    () => { const N = wahl([2, 4, 5]), t = -wahl([...Array(3 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(t, N);
      if (w[1] !== N) return null;
      return markiere(`Markiere ${bt(w)} an der Zahlengeraden.`, gerade(-3 * N, N, 1, N, { teiler: N }), t, [[-t, 'vorzeichen-vergessen'], [gespiegelt(t, N), 'strahl-gespiegelt']],
        H(2, 'Zähle zuerst, in wie viele Teile der Abstand zwischen zwei ganzen Zahlen geteilt ist.', 'Gehe von der Null nach links: erst die ganzen Schritte, dann den Bruch weiter nach links.'), [ANGABE(bt(w))]); },
    () => { const g = zz(1, 8), z = zz(1, 9), w = D(-(10 * g + z));
      return luecken(`Zwischen welchen benachbarten ganzen Zahlen liegt ${dt(w)}? {{a}} < ${dt(w)} < {{b}}`, { a: lk(-g - 1, [[-g, 'negativ-groesser'], [g, 'vorzeichen-vergessen']]), b: lk(-g, [[-g - 1, 'negativ-groesser'], [-g + 1, 'richtung-vertauscht']]) },
        H(2, 'Die kleinere Zahl steht links. Bei negativen Zahlen ist das die Zahl, die weiter von der Null entfernt ist.', `Suche ${dt(w)} in Gedanken auf der Zahlengeraden. Welche ganze Zahl liegt links davon, welche rechts?`), { nachweis: [{ art: 'luecken' }] }); },
    () => { const b = D(zz(105, 395), 2), was = wahl([[`Der Wasserstand eines Sees liegt ${dt(b)} m unter dem Normalwert.`, 'unter', 'm'], [`Ein Kellerboden liegt ${dt(b)} m unter der Straße.`, 'unter', 'm'], [`Ein Konto zeigt ${dt(b, 2)} € Schulden.`, 'Schulden', '€']]);
      if (b[1] !== 100) return null;
      return antwort(`${was[0]} Schreibe die Angabe als Zahl mit Vorzeichen.`, neg(b), 'd', [[b, 'vorzeichen-vergessen']],
        H(2, 'Angaben unter einem Vergleichswert und Schulden sind negativ.', 'Setze das Minuszeichen vor die Dezimalzahl.'), [KONTEXT(dt(b), was[1], true)], { einheit: was[2] }); },
    () => { const N = wahl([3, 4, 5]), t = -wahl([...Array(2 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(t, N);
      if (w[1] !== N) return null;
      return antwort('Auf welche Zahl zeigt der Pfeil? Schreibe sie als Bruch oder gemischte Zahl.', w, 'b', [[neg(w), 'vorzeichen-vergessen'], [Q(gespiegelt(t, N), N), 'richtung-vertauscht']],
        H(2, 'Zähle, in wie viele Teile der Abstand zwischen zwei ganzen Zahlen geteilt ist. Das ist der Nenner.', 'Zähle von der Null nach links: erst die ganzen Schritte, dann die Teile. Das Minus gilt für die ganze Zahl.'), [BILD(bt(w))], { bild: gerade(-2 * N, N, 1, N, { teiler: N, pfeil: t }) }); },
    () => { const g = zz(1, 6), z = zz(2, 8), w = D(-(10 * g + z)), k = kind(), stimmt = wahl([true, false, false]);
      const wahr = `${zt(-g - 1)} < ${dt(w)} < ${zt(-g)}`, falsch = `${zt(-g)} < ${dt(w)} < ${zt(-g - 1)}`, auch = `${zt(-g)} < ${dt(w)} < ${zt(-g + 1)}`;
      return auswahl(`${k} behauptet: ${stimmt ? wahr : falsch}. Stimmt das?`, [opt('Stimmt.', stimmt, stimmt ? undefined : 'negativ-groesser'), opt(`Falsch. Richtig ist: ${stimmt ? falsch : wahr}.`, !stimmt, stimmt ? 'negativ-groesser' : undefined), opt(`Falsch. Richtig ist: ${auch}.`, false, 'richtung-vertauscht')],
        H(2, 'Bei „<“ steht links die kleinere Zahl. Welche Zahl liegt auf der Zahlengeraden weiter links?', 'Ordne die drei Zahlen in Gedanken auf der Zahlengeraden an und lies sie von links nach rechts.'), { hinweise: { 'richtung-vertauscht': 'Zwischen welchen ganzen Zahlen liegt die Zahl? Suche sie auf der Zahlengeraden.' }, nachweis: [{ art: 'urteil', stimmt, behauptung: stimmt ? wahr : falsch }] }); },
  ]);
  sechs(Z1, 'E', [
    () => { const t = -50 * wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return antwort('Auf welche Zahl zeigt der Pfeil an der Zahlengeraden?', t, 'd', [[-t, 'vorzeichen-vergessen'], [-250 * Math.floor(-t / 250) - ((-t % 250) / 50), 'strahl-einerschritte'], [gespiegelt(t, 250), 'strahl-gespiegelt']],
        H(3, 'Bestimme zuerst die Schrittweite: Wie viele Schritte liegen zwischen zwei beschrifteten Zahlen?'), [BILD(zt(t))], { bild: gerade(-500, 500, 50, 250, { pfeil: t }) }); },
    () => { const N = wahl([3, 4, 5]), z = -wahl([...Array(2 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(z, N);
      if (w[1] !== N) return null;
      return markiere(`Markiere ${ut(w)} an der Zahlengeraden.`, gerade(-4 * N, 2 * N, 1, 2 * N, { teiler: 2 * N }), 2 * z, [[-2 * z, 'vorzeichen-vergessen'], [z, 'bruchstrahl-striche'], [gespiegelt(2 * z, 2 * N), 'strahl-gespiegelt']],
        H(3, 'Die Einteilung der Zahlengeraden ist feiner als der Nenner. Erweitere den Bruch passend.'), [ANGABE(ut(w))]); },
    () => { const N = wahl([3, 4, 5, 6, 7]), g = zz(1, 4), r = zz(1, N - 1), w = Q(-(g * N + r), N);
      if (w[1] !== N) return null;
      return luecken(`Zwischen welchen benachbarten ganzen Zahlen liegt ${ut(w)}? {{a}} < ${ut(w)} < {{b}}`, { a: lk(-g - 1, [[-g, 'negativ-groesser'], [g, 'vorzeichen-vergessen']]), b: lk(-g, [[-g - 1, 'negativ-groesser'], [-g + 1, 'richtung-vertauscht']]) },
        H(3, 'Wandle den Bruch zuerst in eine gemischte Zahl um.'), { nachweis: [{ art: 'luecken' }] }); },
    () => { const t = -5 * wahl([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]), w = D(t, 2), falsch = D(-50 * Math.floor(-t / 50) - ((-t % 50) / 5) * 10, 2);
      return antwort('An der Zahlengeraden sind nur wenige Zahlen beschriftet. Auf welche Zahl zeigt der Pfeil?', w, 'd', [[neg(w), 'vorzeichen-vergessen'], [falsch, 'strahl-einerschritte'], [D(gespiegelt(t, 50), 2), 'strahl-gespiegelt']],
        H(3, 'Zwischen zwei beschrifteten Zahlen liegen zehn Schritte. Wie groß ist dann ein Schritt?'), [BILD(dt(w))], { bild: gerade(-100, 100, 5, 50, { teiler: 100, pfeil: t }) }); },
    () => { const alle = mische([[Q(-3, 4), D(-75, 2)], [Q(-1, 2), D(-5)], [Q(-5, 4), D(-125, 2)], [Q(-2, 5), D(-4)], [Q(-7, 10), D(-7)], [Q(-3, 2), D(-15)], [Q(-1, 4), D(-25, 2)], [Q(-9, 5), D(-18)], [Q(-1, 8), D(-125, 3)]]).slice(0, 4);
      return zuordnen('Ordne jedem Bruch die gleich große Dezimalzahl zu.', alle.map(([b, d]) => [bt(b), dt(d)]), H(3, 'Erweitere den Bruch auf den Nenner 10, 100 oder 1000. Das Vorzeichen bleibt.'), { nachweis: [{ art: 'paare' }] }); },
    () => { const t = zz(1, 6), k = zz(t + 2, t + 9), w = D(t - k);
      return antwort(`Der Pfeil zeigt auf eine Zahl. Welche Zahl liegt ${k} Teilstriche weiter links?`, w, 'd', [[D(t + k), 'richtung-vertauscht'], [D(k - t), 'vorzeichen-vergessen'], [Q(t - 10 * k, 10), 'strahl-einerschritte']],
        H(3, 'Lies zuerst die Zahl am Pfeil ab. Jeder Teilstrich ist ein Zehntel.'), [BILD(dt(D(t))), `${dt(D(t))} − ${k} · 0,1 = ${dt(w)}`], { bild: gerade(-10, 10, 1, 10, { teiler: 10, pfeil: t }) }); },
  ]);

  // ================= Z2: Gegenzahl, Betrag, Zahlbereiche =================
  const hGegen = (n) => H(n, 'Die Gegenzahl liegt gleich weit von der Null entfernt, aber auf der anderen Seite.', 'Die Gegenzahl von −3 ist 3. Die Gegenzahl von 5 ist −5.', 'Zähle die Schritte bis zur Null. Gehe auf der anderen Seite genauso weit.');
  const hAbstand = (n) => H(n, 'Der Abstand zur Null ist die Zahl der Schritte bis zur Null. Er hat kein Minus.', 'Von −4 bis zur Null sind es 4 Schritte.', 'Zähle die Schritte von der Zahl bis zur Null.');
  sechs(Z2, 'F', [
    () => { const b = zz(2, 9);
      return antwort(Z(`Der Punkt liegt bei ${zt(-b)}.`, 'Wie viele Schritte sind es von dort bis zur Null?'), b, 'd', [[-b, 'betrag-gegenzahl'], [10 - b, 'strahl-gespiegelt']], hAbstand(0), [`0 − (${zt(-b)}) = ${b}`], { bild: ZG({ punkte: [-b] }) }); },
    () => { const b = zz(2, 9);
      return antwort(Z('Schau auf die Zahlengerade.', `Wie heißt die Gegenzahl von ${zt(-b)}?`), b, 'd', [[-b, 'betrag-gegenzahl']], hGegen(0), [`0 − (${zt(-b)}) = ${b}`], { bild: ZG({ punkte: [-b] }) }); },
    () => { const b = wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(Z(`Die Zahl ${b} hat eine Gegenzahl.`, 'Markiere die Gegenzahl an der Zahlengeraden.'), ZG(), -b, [[b, 'betrag-gegenzahl'], [gespiegelt(-b, 5), 'strahl-gespiegelt']], hGegen(0), [`0 − ${b} = ${zt(-b)}`]); },
    () => { const b = zz(2, 9);
      return antwort(Z(`Der Punkt liegt bei ${b}.`, 'Eine andere Zahl ist gleich weit von der Null entfernt.', 'Wie heißt diese Zahl?'), -b, 'd', [[b, 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], hGegen(0), [`0 − ${b} = ${zt(-b)}`], { bild: ZG({ punkte: [b] }) }); },
    () => { const fern = -zz(6, 9), nah = zz(1, fern === -6 ? 4 : 5), mittel = -zz(1, 3);
      if (Math.abs(mittel) === nah) return null;
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Welche Zahl ist am weitesten von der Null entfernt?'), [opt(zt(fern), true), opt(zt(nah), false, 'betrag-gegenzahl'), opt(zt(mittel), false, 'negativ-groesser')],
        H(0, 'Zähle bei jeder Zahl die Schritte bis zur Null.', '−7 ist weiter von der Null entfernt als 4.', 'Zähle für jeden Punkt die Schritte bis zur Null. Vergleiche.'), { bild: ZG({ punkte: [fern, nah, mittel] }), nachweis: [{ art: 'nullfern' }] }); },
    () => { const b = wahl([12, 14, 16, 18]);
      return antwort(Z('Schau auf die Zahlengerade.', `Wie heißt die Gegenzahl von ${b}?`), -b, 'd', [[b, 'betrag-gegenzahl']], hGegen(0), [`0 − ${b} = ${zt(-b)}`], { bild: gerade(-20, 20, 2, 10, { punkte: [b] }) }); },
  ]);
  sechs(Z2, 'G', [
    () => { const w = D(-zz(11, 99));
      return antwort(`Gib die Gegenzahl von ${dt(w)} an.`, neg(w), 'd', [[w, 'betrag-gegenzahl']], hGegen(1), [`0 − (${dt(w)}) = ${dt(neg(w))}`]); },
    () => { const t = -wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17, 18]);
      return antwort(Z(`Der Punkt liegt bei ${dt(D(t))}.`, 'Wie groß ist der Abstand zur Null?'), D(-t), 'd', [[D(t), 'betrag-gegenzahl']], hAbstand(1), [`0 − (${dt(D(t))}) = ${dt(D(-t))}`], { bild: gerade(-20, 20, 1, 10, { teiler: 10, punkte: [t] }) }); },
    () => { const b = zz(12, 95);
      return antwort(Z(`Eine Zahl hat die Gegenzahl ${zt(-b)}.`, 'Wie heißt die Zahl?'), b, 'd', [[-b, 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], hGegen(1), [`0 − (${zt(-b)}) = ${b}`]); },
    () => { const t = wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17]);
      return markiere(Z(`Die Zahl ${dt(D(t))} hat eine Gegenzahl.`, 'Markiere die Gegenzahl an der Zahlengeraden.'), gerade(-20, 20, 1, 10, { teiler: 10 }), -t, [[t, 'betrag-gegenzahl'], [gespiegelt(-t, 10), 'strahl-gespiegelt']], hGegen(1), [`0 − ${dt(D(t))} = ${dt(D(-t))}`]); },
    () => { const b = wahl([2, 3, 4, 6, 7, 8, 9]);
      return markiere(Z(`Zwei Zahlen haben den Abstand ${b} zur Null.`, 'Markiere die kleinere der beiden Zahlen.'), ZG(), -b, [[b, 'negativ-groesser'], [gespiegelt(-b, 5), 'strahl-gespiegelt']],
        H(1, 'Zwei Zahlen sind gleich weit von der Null entfernt: eine links, eine rechts.', 'Den Abstand 4 zur Null haben −4 und 4. Die kleinere Zahl ist −4.', 'Finde beide Zahlen. Die kleinere liegt links.'), [`0 − ${b} = ${zt(-b)}`]); },
    () => { const b = zz(2, 9), k = kind();
      return auswahl(Z(`${k} sagt: Die Gegenzahl einer Zahl ist immer negativ.`, 'Stimmt das?'), [opt('Stimmt.', false, 'betrag-gegenzahl'), opt(`Falsch. Die Gegenzahl von ${zt(-b)} ist ${b}.`, true), opt(`Falsch. Die Gegenzahl von ${b} ist ${b}.`, false, 'betrag-gegenzahl')],
        H(1, 'Probiere es mit einer negativen Zahl aus.', 'Die Gegenzahl von −2 ist 2.', 'Suche eine Zahl mit einer positiven Gegenzahl.'), { nachweis: [FREI('Gegenbeispiel: Die Gegenzahl einer negativen Zahl ist positiv')] }); },
  ]);
  const BEREICHE = [opt('ℕ (natürliche Zahlen)'), opt('ℤ (ganze Zahlen)'), opt('ℚ (rationale Zahlen)')];
  const bereich = (text, zahlText, w, hilfen) => { const inN = w[1] === 1 && w[0] >= 0, inZ = w[1] === 1;
    return auswahl(text, [opt(BEREICHE[0].text, inN, inN ? undefined : 'zahlbereich-falsch'), opt(BEREICHE[1].text, inZ), opt(BEREICHE[2].text, true)], hilfen, { mehrfach: true, nachweis: [{ art: 'bereich', zahl: zahlText }] }); };
  sechs(Z2, 'M', [
    () => { const w = D(-zz(11, 99));
      return rechne(`Berechne ${txt(AB(w))}.`, AB(w), {}, [[w, 'betrag-gegenzahl']], H(2, 'Der Betrag ist der Abstand zur Null. Er ist nie negativ.', 'Lass das Minuszeichen weg.')); },
    () => { const w = wahl([Q(-zz(2, 30)), D(zz(11, 49)), Q(zz(2, 30)), D(-zz(11, 49)), Q(-3, 4), Q(0)]), t = T(w, 'b' === 'x' ? 'b' : w[1] === 4 ? 'b' : 'd');
      return bereich(`Zu welchen Zahlbereichen gehört ${t}? Kreuze alle an.`, t, w, H(2, 'ℕ enthält nur 0, 1, 2, 3 … In ℤ kommen die negativen ganzen Zahlen dazu, in ℚ alle Brüche und Dezimalzahlen.', 'Prüfe der Reihe nach: Ist die Zahl ganz? Ist sie nicht negativ?')); },
    () => { const b = D(zz(11, 89)), anders = D(Number(String(b[0]).split('').reverse().join('')) || 12);
      if (b[1] !== 10 || anders[0] === b[0]) return null;
      return auswahl(`Welche Zahlen haben den Betrag ${dt(b)}? Kreuze alle an.`, [opt(dt(b), true), opt(dt(neg(b)), true), opt('0', false, 'betrag-gegenzahl'), opt(dt(neg(anders)), false)],
        H(2, 'Zwei Zahlen haben denselben Abstand zur Null: eine positive und eine negative.', 'Suche die Zahl selbst und ihre Gegenzahl.'), { mehrfach: true, nachweis: [{ art: 'betragwahl', betrag: dt(b) }] }); },
    () => { const N = wahl([3, 4, 5, 7, 8]), z = zz(1, N - 1), w = Q(-z, N);
      if (w[1] !== N) return null;
      return antwort(`Gib die Gegenzahl von ${bt(w)} an.`, neg(w), 'b', [[w, 'betrag-gegenzahl'], [Q(N, z), 'bruch-kehrwert']], H(2, 'Die Gegenzahl hat denselben Abstand zur Null, aber das andere Vorzeichen.', 'Ändere nur das Vorzeichen. Zähler und Nenner bleiben.'), [`0 − (${bt(w)}) = ${bt(neg(w))}`]); },
    () => { const a = -zz(3, 15), b = wahl([zz(2, 9), -zz(2, 9)]), op = wahl(['+', '−']), e = X(op, AB(a), AB(b));
      if (op === '−' && Math.abs(a) <= Math.abs(b)) return null;
      return rechne(`Berechne ${txt(e)}.`, e, {}, [[val(X(op, a, b)), 'betrag-gegenzahl'], [val(X(op, a, AB(b))), 'betrag-gegenzahl'], [neg(val(e)), 'vorzeichen-vergessen']], H(2, 'Bestimme zuerst jeden Betrag einzeln. Rechne dann.', `Ersetze jeden Betrag durch eine Zahl ohne Minus. Rechne dann ${op === '+' ? 'plus' : 'minus'}.`)); },
    () => { const a = zz(2, 9), b = zz(2, 9), c = zz(2, 9), d = zz(1, 9);
      const roh = mische([[`|${zt(-a)}| = ${a}`, true], [`|${b}| = ${zt(-b)}`, false], [`|${zt(-c)}| > |${c - 1}|`, true], [`|${zt(-d)}| < 0`, false], ['|0| = 0', true]]).slice(0, 4);
      if (!roh.some(([, r]) => r)) return null;
      return auswahl('Welche Aussagen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'betrag-gegenzahl')), H(2, 'Ein Betrag ist nie negativ.', 'Berechne zuerst jeden Betrag. Prüfe dann jede Aussage einzeln.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
  ]);
  sechs(Z2, 'E', [
    () => { const [z, N] = wahl([[12, 4], [15, 3], [18, 6], [20, 5], [7, 2], [9, 4], [10, 4]]), v = wahl([-1, -1, 1]), t = `${v < 0 ? MINUS : ''}${br(z, N)}`;
      return bereich(`Zu welchen Zahlbereichen gehört ${t}? Kreuze alle an.`, t, Q(v * z, N), H(3, 'Kürze den Bruch zuerst. Manche Brüche sind ganze Zahlen.')); },
    () => { const [b, d] = wahl([[Q(9, 2), D(45)], [Q(5, 4), D(125, 2)], [Q(7, 5), D(14)], [Q(11, 4), D(275, 2)], [Q(3, 8), D(375, 3)]]), falsch = plus(d, D(wahl([1, 9, 10])));
      return auswahl(`Für welche Zahlen x gilt |x| = ${dt(d)}? Kreuze alle an.`, [opt(dt(neg(d)), true), opt(bt(b), true), opt(`${MINUS}${ut(b)}`, true), opt(dt(falsch), false, 'betrag-gegenzahl'), opt('0', false, 'betrag-gegenzahl')],
        H(3, 'Zwei Zahlen haben diesen Betrag. Sie können auch als Bruch geschrieben sein.'), { mehrfach: true, nachweis: [{ art: 'betragwahl', betrag: dt(d) }] }); },
    () => { const a = D(zz(15, 45)), b = D(zz(51, 95)), c = -zz(2, 5), e = X('−', AB(X('−', a, b)), AB(c));
      return rechne(`Berechne ${txt(e)}.`, e, {}, [[val(X('−', X('−', a, b), c)), 'betrag-gegenzahl'], [val(X('+', AB(X('−', a, b)), AB(c))), 'minus-minus-uebersehen'], [val(X('−', X('−', b, a), c)), 'betrag-gegenzahl']],
        H(3, 'Rechne zuerst innerhalb der Betragsstriche. Bilde dann die Beträge.')); },
    () => { const roh = mische([['Jede natürliche Zahl ist auch eine ganze Zahl.', true], ['Jede ganze Zahl ist auch eine rationale Zahl.', true], ['Jede rationale Zahl ist auch eine ganze Zahl.', false], ['Der Betrag einer Zahl ist nie negativ.', true], ['Die Gegenzahl einer Zahl ist immer kleiner als die Zahl.', false], ['Zwei verschiedene Zahlen können denselben Betrag haben.', true], ['Null ist eine negative Zahl.', false]]).slice(0, 5);
      if (roh.filter(([, r]) => r).length < 2 || roh.filter(([, r]) => !r).length < 2) return null;
      return auswahl('Welche Aussagen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'betrag-gegenzahl')), H(3, 'Suche zu jeder Aussage ein Beispiel oder ein Gegenbeispiel, etwa −3 oder 0,5.'), { mehrfach: true, nachweis: [FREI('Aussagen über Zahlbereiche, Betrag und Gegenzahl')] }); },
    () => { const b = wahl([zz(3, 40), D(zz(11, 99))]), w = neg(Array.isArray(b) ? b : Q(b));
      return antwort(`Die Zahl a hat den Betrag ${T(neg(w))} und ist kleiner als ihre Gegenzahl. Wie heißt a?`, w, 'd', [[neg(w), 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], H(3, 'Zwei Zahlen haben diesen Betrag. Welche von beiden liegt links von ihrer Gegenzahl?'), [`0 − ${T(neg(w))} = ${T(w)}`]); },
    () => { const g = zz(3, 12);
      return antwort(`Wie viele ganze Zahlen haben einen Betrag, der kleiner als ${g} ist?`, 2 * (g - 1) + 1, 'd', [[2 * (g - 1), 'sach-schritt-vergessen'], [g - 1, 'betrag-gegenzahl'], [2 * g + 1, 'betrag-gegenzahl']],
        H(3, 'Denke an die positiven Zahlen, die negativen Zahlen und die Null.'), [`2 · (${g} − 1) + 1 = ${2 * (g - 1) + 1}`]); },
  ]);
}
