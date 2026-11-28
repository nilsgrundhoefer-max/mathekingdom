// Aufgaben zu 6.9.2 „Rationale Zahlen“ (Lernziele R1, R2) nach ADR 0015 und ADR 0059.
// R1: negative Dezimalzahlen und Brüche an der Zahlengeraden ablesen und eintragen. R2: Gegenzahl, rationale Zahlen erkennen, Betrag nur auf E.
// Grilling mit Nils (2026-11-28): F rechnet nur mit ganzen Zahlen (die Zahlengerade darf feiner eingeteilt sein), G Halbe und eine Nachkommastelle,
// M zwei Nachkommastellen und die Nenner 2, 4, 5 und 10, E feinere Einteilungen, Betrag und Zahlbereiche.

import { sechs, auswahl, luecken, zuordnen, Z } from '../werkzeug.mjs';
import { Q, D, neg, T, zt, dt, bt, ut, br, opt, zz, wahl, mische, antwort, wahlAus, lk, lkd, gerade, H, X, AB, rechne, markiere, ANGABE, BILD, FREI, AUSSAGEN, kind, MINUS, val, txt, plus } from './7-1-rational.mjs';

const R1 = '6.9.2-R1', R2 = '6.9.2-R2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const ZEHNTEL = (extra) => gerade(-20, 20, 1, 10, { teiler: 10, ...extra });
const HALBE = (extra) => gerade(-10, 4, 1, 2, { teiler: 2, ...extra });
const gespiegelt = (t, b) => { const l = -b * Math.floor(-t / b); return l + (-t % b); };

export function rational6() {
  // ================= R1: Dezimalzahlen und Brüche an der Zahlengeraden =================
  const hNach = (n) => H(n, 'Der Pfeil liegt zwischen zwei ganzen Zahlen. Die linke ist die kleinere.', 'Liegt der Pfeil zwischen −3 und −2, dann gilt −3 < Pfeil < −2.', 'Suche die beschrifteten Zahlen links und rechts vom Pfeil.');
  const nachbarn = (n, bild, tick, T0, kopf) => { const w = Q(tick, T0), u = Math.floor(tick / T0), o = u + 1;
    return luecken(Z(kopf, 'Ergänze die beiden ganzen Zahlen.', '{{a}} < Zahl am Pfeil < {{b}}'), { a: lk(u, [[o, 'negativ-groesser'], [-u, 'vorzeichen-vergessen']]), b: lk(o, [[u, 'negativ-groesser'], [-o, 'vorzeichen-vergessen']]) },
      hNach(n), { bild: { ...bild, pfeil: tick }, nachweis: [BILD(T(w)), einsen(u), einsen(o)] }); };
  // Nachweis für eine ganze Zahl aus lauter Einsen: 0 − 1 − 1 = −2 (die Grenzen sind im Bild beschriftet, aber nicht als Zahl hinterlegt).
  const einsen = (z) => (z === 0 ? '1 − 1 = 0' : `0${' − 1'.repeat(-z)} = ${zt(z)}`);
  // Abstand als Zahl (Hilfe für den Nachweis): a − b.
  const minus0 = (a, b) => plus(a, neg(Array.isArray(b) ? b : Q(b)));
  sechs(R1, 'F', [
    () => { const t = -wahl([1, 3, 5, 7, 9]);
      return nachbarn(0, HALBE(), t, 2, 'Der Pfeil zeigt auf eine Zahl zwischen zwei ganzen Zahlen.'); },
    () => { const g = -zz(1, 4), tick = 2 * g + 1;
      return markiere(Z(`Markiere die Zahl genau in der Mitte zwischen ${zt(g)} und ${zt(g + 1)}.`), HALBE(), tick, [[tick - 2, 'richtung-vertauscht'], [-tick, 'vorzeichen-vergessen'], [2 * g, 'strahl-ganzes']],
        H(0, 'Zwischen zwei ganzen Zahlen liegt hier genau ein Strich. Er ist die Mitte.', 'Die Mitte zwischen −3 und −2 ist der Strich dazwischen.', 'Suche die beiden Zahlen. Tippe auf den Strich dazwischen.'), [`${zt(g)} + 1⁄2 = ${dt(Q(tick, 2))}`]); },
    () => { const t = -wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17, 18]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Zähle, wie viele Striche der Pfeil links von der Null liegt.'), -t, 'd', [[-t + 1, 'sach-schritt-vergessen'], [t, 'vorzeichen-vergessen'], [-t - 10 * Math.floor(-t / 10), 'strahl-ganzes']],
        H(0, 'Zähle jeden kleinen Strich einzeln, von der Null nach links.', 'Bis −1 sind es 10 Striche.', 'Lege den Finger auf die Null. Zähle nach links bis zum Pfeil.'), [BILD(dt(D(t))), `${dt(D(-t))} · 10 = ${-t}`], { bild: ZEHNTEL({ pfeil: t }) }); },
    () => { const g = -zz(1, 4), tick = 2 * g - 1;
      return markiere(Z(`Markiere den Strich genau in der Mitte zwischen ${zt(g - 1)} und ${zt(g)}.`), HALBE(), tick, [[tick + 2, 'richtung-vertauscht'], [-tick, 'vorzeichen-vergessen']],
        H(0, 'Zwischen zwei ganzen Zahlen liegt hier genau ein Strich.', 'Die Mitte zwischen −5 und −4 ist der Strich dazwischen.', 'Suche erst die beiden ganzen Zahlen.'), [`${zt(g - 1)} + 1⁄2 = ${dt(Q(tick, 2))}`]); },
    () => { const t = -wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17, 18]);
      return nachbarn(0, ZEHNTEL(), t, 10, 'Der Pfeil zeigt auf eine Zahl zwischen zwei ganzen Zahlen.'); },
    () => { const t = -wahl([1, 3, 5, 7, 9]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Zähle, wie viele Striche der Pfeil links von der Null liegt.'), -t, 'd', [[-t + 1, 'sach-schritt-vergessen'], [(-t - 1) / 2, 'strahl-ganzes']],
        H(0, 'Zähle jeden Strich einzeln, auch die Striche zwischen den beschrifteten Zahlen.', 'Bis −1 sind es 2 Striche.', 'Lege den Finger auf die Null. Zähle nach links bis zum Pfeil.'), [BILD(dt(Q(t, 2))), `${dt(Q(-t, 2))} · 2 = ${-t}`], { bild: HALBE({ pfeil: t }) }); },
  ]);
  const hZ = (n) => H(n, 'Zwischen zwei ganzen Zahlen liegen zehn Schritte. Jeder Schritt ist ein Zehntel.', 'Drei Striche links von −1 steht −1,3.', 'Suche die nächste beschriftete Zahl. Zähle von dort die Zehntel bis zum Pfeil.');
  sechs(R1, 'G', [
    () => { const t = -wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), D(t), 'd', [[D(-t), 'vorzeichen-vergessen'], [D(gespiegelt(t, 10)), 'strahl-gespiegelt']], hZ(1), [BILD(dt(D(t)))], { bild: ZEHNTEL({ pfeil: t }) }); },
    () => { const t = -wahl([3, 4, 6, 7, 12, 13, 14, 16, 17, 18]);
      return markiere(`Markiere ${dt(D(t))} an der Zahlengeraden.`, ZEHNTEL(), t, [[-t, 'vorzeichen-vergessen'], [gespiegelt(t, 10), 'strahl-gespiegelt']],
        H(1, 'Jeder kleine Schritt ist ein Zehntel.', '−1,2 liegt zwei Striche links von −1.', 'Gehe erst zur ganzen Zahl. Gehe dann die Zehntel weiter nach links.'), [ANGABE(dt(D(t)))]); },
    () => { const t = -wahl([1, 3, 5, 7, 9]);
      return antwort(Z('Schau auf die Zahlengerade.', 'Lies die Zahl ab, auf die der Pfeil zeigt.', 'Schreibe sie als Dezimalzahl.'), Q(t, 2), 'd', [[Q(-t, 2), 'vorzeichen-vergessen'], [Q(t + 2, 2), 'richtung-vertauscht'], [Q(t), 'strahl-einerschritte']],
        H(1, 'Zwischen zwei ganzen Zahlen liegt hier ein Strich. Er ist die Hälfte.', 'Der Strich zwischen −2 und −1 ist −1,5.', 'Suche die ganze Zahl rechts vom Pfeil. Gehe einen halben Schritt nach links.'), [BILD(dt(Q(t, 2)))], { bild: HALBE({ pfeil: t }) }); },
    () => { const t = -wahl([1, 3, 5, 7, 9]), w = Q(t, 2);
      return markiere(`Markiere ${bt(w)} an der Zahlengeraden.`, HALBE(), t, [[-t, 'vorzeichen-vergessen'], [t + 2, 'richtung-vertauscht'], [(t - 1) / 2 * 2 + 2, 'strahl-ganzes']],
        H(1, 'Ein Halb liegt in der Mitte zwischen zwei ganzen Zahlen.', '−1 1⁄2 liegt in der Mitte zwischen −2 und −1.', 'Gehe erst zur ganzen Zahl. Gehe dann noch einen halben Schritt nach links.'), [ANGABE(bt(w))]); },
    () => { const alle = mische([1, 3, 5, 7, 9]).slice(0, 4);
      return zuordnen('Ordne jedem Bruch die gleich große Dezimalzahl zu.', alle.map((z) => [bt(Q(-z, 2)), dt(Q(-z, 2))]),
        H(1, 'Ein Halb ist 0,5. Das Vorzeichen bleibt gleich.', '−1⁄2 = −0,5', 'Schreibe die Ganzen vor das Komma und für das Halb eine 5 dahinter.'), { nachweis: [{ art: 'paare' }] }); },
    () => { const g = zz(1, 8), z = zz(1, 9), w = D(-(10 * g + z));
      return luecken(`Ergänze die benachbarten ganzen Zahlen. {{a}} < ${dt(w)} < {{b}}`, { a: lk(-g - 1, [[-g, 'negativ-groesser'], [g, 'vorzeichen-vergessen']]), b: lk(-g, [[-g - 1, 'negativ-groesser'], [-g + 1, 'richtung-vertauscht']]) },
        H(1, 'Die kleinere Zahl steht links. Bei negativen Zahlen ist das die Zahl, die weiter von der Null entfernt ist.', '−3 < −2,4 < −2', `Suche ${dt(w)} in Gedanken auf der Zahlengeraden. Welche ganze Zahl liegt links davon, welche rechts?`), { nachweis: [{ art: 'luecken' }] }); },
  ]);
  sechs(R1, 'M', [
    () => { const t = -wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 26, 27, 28, 29]);
      return antwort('Lies die Zahl ab, auf die der Pfeil an der Zahlengeraden zeigt.', D(t, 2), 'd', [[D(-t, 2), 'vorzeichen-vergessen'], [D(gespiegelt(t, 10), 2), 'strahl-gespiegelt'], [D(t, 1), 'strahl-einerschritte']],
        H(2, 'Zwischen zwei beschrifteten Zahlen liegen zehn Schritte. Bestimme, wie groß ein Schritt ist.', 'Ein Schritt ist ein Hundertstel. Zähle von der nächsten beschrifteten Zahl nach links.'), [BILD(dt(D(t, 2)))], { bild: gerade(-30, 10, 1, 10, { teiler: 100, pfeil: t }) }); },
    () => { const N = wahl([4, 5]), t = -wahl([...Array(3 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(t, N);
      if (w[1] !== N) return null;
      return markiere(`Markiere ${bt(w)} an der Zahlengeraden.`, gerade(-3 * N, N, 1, N, { teiler: N }), t, [[-t, 'vorzeichen-vergessen'], [gespiegelt(t, N), 'strahl-gespiegelt']],
        H(2, 'Zähle zuerst, in wie viele Teile der Abstand zwischen zwei ganzen Zahlen geteilt ist.', 'Gehe von der Null nach links: erst die ganzen Schritte, dann den Bruch weiter nach links.'), [ANGABE(bt(w))]); },
    () => { const N = wahl([4, 5]), t = -wahl([...Array(2 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(t, N);
      if (w[1] !== N) return null;
      return antwort('Lies die Zahl ab, auf die der Pfeil zeigt. Schreibe sie als Bruch oder gemischte Zahl.', w, 'b', [[neg(w), 'vorzeichen-vergessen'], [Q(gespiegelt(t, N), N), 'richtung-vertauscht']],
        H(2, 'Zähle, in wie viele Teile der Abstand zwischen zwei ganzen Zahlen geteilt ist. Das ist der Nenner.', 'Zähle von der Null nach links: erst die ganzen Schritte, dann die Teile. Das Minus gilt für die ganze Zahl.'), [BILD(bt(w))], { bild: gerade(-2 * N, N, 1, N, { teiler: N, pfeil: t }) }); },
    () => { const g = zz(1, 9), z = zz(1, 99), w = D(-(100 * g + z), 2);
      if (z % 10 === 0) return null;
      return luecken(`Ergänze die benachbarten ganzen Zahlen. {{a}} < ${dt(w)} < {{b}}`, { a: lk(-g - 1, [[-g, 'negativ-groesser'], [g, 'vorzeichen-vergessen']]), b: lk(-g, [[-g - 1, 'negativ-groesser'], [-g + 1, 'richtung-vertauscht']]) },
        H(2, 'Bei negativen Zahlen liegt die Zahl mit dem größeren Abstand zur Null weiter links.', 'Suche die Zahl in Gedanken auf der Zahlengeraden.'), { nachweis: [{ art: 'luecken' }] }); },
    () => { const alle = mische([[Q(-3, 4), D(-75, 2)], [Q(-1, 2), D(-5)], [Q(-5, 4), D(-125, 2)], [Q(-2, 5), D(-4)], [Q(-7, 10), D(-7)], [Q(-3, 2), D(-15)], [Q(-1, 4), D(-25, 2)], [Q(-9, 5), D(-18)]]).slice(0, 4);
      return zuordnen('Ordne jedem Bruch die gleich große Dezimalzahl zu.', alle.map(([b, d]) => [bt(b), dt(d)]), H(2, 'Erweitere den Bruch auf den Nenner 10 oder 100. Das Vorzeichen bleibt.', 'Ein Viertel ist 0,25, ein Fünftel ist 0,2.'), { nachweis: [{ art: 'paare' }] }); },
    () => { const g = zz(1, 6), z = zz(2, 8), w = D(-(10 * g + z)), k = kind(), stimmt = wahl([true, false, false]);
      const wahr = `${zt(-g - 1)} < ${dt(w)} < ${zt(-g)}`, falsch = `${zt(-g)} < ${dt(w)} < ${zt(-g - 1)}`, auch = `${zt(-g)} < ${dt(w)} < ${zt(-g + 1)}`;
      return auswahl(Z(`${k} behauptet: ${stimmt ? wahr : falsch}.`, 'Prüfe die Behauptung.'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'negativ-groesser'), opt(`Falsch. Richtig ist: ${stimmt ? falsch : wahr}.`, !stimmt, stimmt ? 'negativ-groesser' : undefined), opt(`Falsch. Richtig ist: ${auch}.`, false, 'richtung-vertauscht')],
        H(2, 'Bei „<“ steht links die kleinere Zahl. Welche Zahl liegt auf der Zahlengeraden weiter links?', 'Ordne die drei Zahlen in Gedanken auf der Zahlengeraden an und lies sie von links nach rechts.'), { nachweis: [{ art: 'urteil', stimmt, behauptung: stimmt ? wahr : falsch }] }); },
  ]);
  sechs(R1, 'E', [
    () => { const t = -5 * wahl([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]), w = D(t, 2), falsch = D(-50 * Math.floor(-t / 50) - ((-t % 50) / 5) * 10, 2);
      return antwort(Z('An der Zahlengeraden sind nur wenige Zahlen beschriftet.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), w, 'd', [[neg(w), 'vorzeichen-vergessen'], [falsch, 'strahl-einerschritte'], [D(gespiegelt(t, 50), 2), 'strahl-gespiegelt']],
        H(3, 'Zwischen zwei beschrifteten Zahlen liegen zehn Schritte. Bestimme, wie groß dann ein Schritt ist.'), [BILD(dt(w))], { bild: gerade(-100, 100, 5, 50, { teiler: 100, pfeil: t }) }); },
    () => { const N = wahl([3, 4, 5]), z = -wahl([...Array(2 * N).keys()].map((i) => i + 1).filter((i) => i % N !== 0)), w = Q(z, N);
      if (w[1] !== N) return null;
      return markiere(`Markiere ${ut(w)} an der Zahlengeraden.`, gerade(-4 * N, 2 * N, 1, 2 * N, { teiler: 2 * N }), 2 * z, [[-2 * z, 'vorzeichen-vergessen'], [z, 'bruchstrahl-striche'], [gespiegelt(2 * z, 2 * N), 'strahl-gespiegelt']],
        H(3, 'Die Einteilung der Zahlengeraden ist feiner als der Nenner. Erweitere den Bruch passend.'), [ANGABE(ut(w))]); },
    () => { const N = wahl([3, 4, 5, 6, 8]), g = zz(1, 4), r = zz(1, N - 1), w = Q(-(g * N + r), N);
      if (w[1] !== N) return null;
      return luecken(`Ergänze die benachbarten ganzen Zahlen. {{a}} < ${ut(w)} < {{b}}`, { a: lk(-g - 1, [[-g, 'negativ-groesser'], [g, 'vorzeichen-vergessen']]), b: lk(-g, [[-g - 1, 'negativ-groesser'], [-g + 1, 'richtung-vertauscht']]) },
        H(3, 'Wandle den Bruch zuerst in eine gemischte Zahl um.'), { nachweis: [{ art: 'luecken' }] }); },
    () => { const t = zz(1, 6), k = zz(t + 2, t + 9), w = D(t - k);
      return antwort(`Gib die Zahl an, die ${k} Teilstriche links vom Pfeil liegt.`, w, 'd', [[D(t + k), 'richtung-vertauscht'], [D(k - t), 'vorzeichen-vergessen'], [Q(t - 10 * k, 10), 'strahl-einerschritte']],
        H(3, 'Lies zuerst die Zahl am Pfeil ab. Jeder Teilstrich ist ein Zehntel.'), [BILD(dt(D(t))), `${dt(D(t))} − ${k} · 0,1 = ${dt(w)}`], { bild: gerade(-10, 10, 1, 10, { teiler: 10, pfeil: t }) }); },
    () => { const alle = mische([[Q(-3, 4), D(-75, 2)], [Q(-5, 4), D(-125, 2)], [Q(-1, 8), D(-125, 3)], [Q(-3, 8), D(-375, 3)], [Q(-7, 20), D(-35, 2)], [Q(-9, 25), D(-36, 2)], [Q(-11, 8), D(-1375, 3)]]).slice(0, 4);
      return zuordnen('Ordne jedem Bruch die gleich große Dezimalzahl zu.', alle.map(([b, d]) => [bt(b), dt(d)]), H(3, 'Erweitere den Bruch auf den Nenner 10, 100 oder 1000. Das Vorzeichen bleibt.'), { nachweis: [{ art: 'paare' }] }); },
    () => { const t = -5 * wahl([21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49, 51, 53, 57]);
      return antwort(Z('Auf dieser Zahlengeraden fehlt die Null.', 'Lies die Zahl ab, auf die der Pfeil zeigt.'), D(t, 2), 'd', [[D(-t, 2), 'vorzeichen-vergessen'], [D(gespiegelt(t, 50), 2), 'strahl-gespiegelt'], [D(-50 * Math.floor(-t / 50) - ((-t % 50) / 5) * 10, 2), 'strahl-einerschritte']],
        H(3, 'Bestimme zuerst die Schrittweite. Je weiter links, desto kleiner die Zahl.'), [BILD(dt(D(t, 2)))], { bild: gerade(-300, -100, 5, 50, { teiler: 100, pfeil: t }) }); },
  ]);

  // ================= R2: Gegenzahl, rationale Zahlen, Betrag auf E =================
  const hGegen = (n) => H(n, 'Die Gegenzahl liegt gleich weit von der Null entfernt, aber auf der anderen Seite.', 'Die Gegenzahl von −3 ist 3. Die Gegenzahl von 5 ist −5.', 'Zähle die Schritte bis zur Null. Gehe auf der anderen Seite genauso weit.');
  const hAbstand = (n) => H(n, 'Der Abstand zur Null ist die Zahl der Schritte bis zur Null. Er hat kein Minus.', 'Von −4 bis zur Null sind es 4 Schritte.', 'Zähle die Schritte von der Zahl bis zur Null.');
  sechs(R2, 'F', [
    () => { const b = zz(2, 9);
      return antwort(Z(`Der Punkt liegt bei ${zt(-b)}.`, 'Zähle die Schritte von dort bis zur Null.'), b, 'd', [[-b, 'betrag-gegenzahl'], [10 - b, 'strahl-gespiegelt']], hAbstand(0), [`0 − (${zt(-b)}) = ${b}`], { bild: ZG({ punkte: [-b] }) }); },
    () => { const b = zz(2, 9);
      return antwort(Z('Schau auf die Zahlengerade.', `Gib die Gegenzahl von ${zt(-b)} an.`), b, 'd', [[-b, 'betrag-gegenzahl']], hGegen(0), [`0 − (${zt(-b)}) = ${b}`], { bild: ZG({ punkte: [-b] }) }); },
    () => { const b = wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return markiere(Z(`Die Zahl ${b} hat eine Gegenzahl.`, 'Markiere die Gegenzahl an der Zahlengeraden.'), ZG(), -b, [[b, 'betrag-gegenzahl'], [gespiegelt(-b, 5), 'strahl-gespiegelt']], hGegen(0), [`0 − ${b} = ${zt(-b)}`]); },
    () => { const b = zz(2, 9);
      return antwort(Z(`Der Punkt liegt bei ${b}.`, 'Eine andere Zahl ist gleich weit von der Null entfernt.', 'Gib diese Zahl an.'), -b, 'd', [[b, 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], hGegen(0), [`0 − ${b} = ${zt(-b)}`], { bild: ZG({ punkte: [b] }) }); },
    () => { const fern = -zz(6, 9), nah = zz(1, fern === -6 ? 4 : 5), mittel = -zz(1, 3);
      if (Math.abs(mittel) === nah) return null;
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Kreuze die Zahl mit dem größten Abstand zur Null an.'), [opt(zt(fern), true), opt(zt(nah), false, 'betrag-gegenzahl'), opt(zt(mittel), false, 'negativ-groesser')],
        H(0, 'Zähle bei jeder Zahl die Schritte bis zur Null.', '−7 ist weiter von der Null entfernt als 4.', 'Zähle für jeden Punkt die Schritte bis zur Null. Vergleiche.'), { bild: ZG({ punkte: [fern, nah, mittel] }), nachweis: [{ art: 'nullfern' }] }); },
    () => { const b = wahl([12, 14, 16, 18]);
      return antwort(Z('Schau auf die Zahlengerade.', `Gib die Gegenzahl von ${b} an.`), -b, 'd', [[b, 'betrag-gegenzahl']], hGegen(0), [`0 − ${b} = ${zt(-b)}`], { bild: gerade(-20, 20, 2, 10, { punkte: [b] }) }); },
  ]);
  sechs(R2, 'G', [
    () => { const w = D(-zz(11, 99));
      if (w[1] === 1) return null;
      return antwort(`Gib die Gegenzahl von ${dt(w)} an.`, neg(w), 'd', [[w, 'betrag-gegenzahl']], hGegen(1), [`0 − (${dt(w)}) = ${dt(neg(w))}`]); },
    () => { const t = -wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17, 18]);
      return antwort(Z(`Der Punkt liegt bei ${dt(D(t))}.`, 'Bestimme den Abstand zur Null.'), D(-t), 'd', [[D(t), 'betrag-gegenzahl']], hAbstand(1), [`0 − (${dt(D(t))}) = ${dt(D(-t))}`], { bild: ZEHNTEL({ punkte: [t] }) }); },
    () => { const b = zz(12, 95);
      return antwort(Z(`Eine Zahl hat die Gegenzahl ${zt(-b)}.`, 'Gib die Zahl an.'), b, 'd', [[-b, 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], hGegen(1), [`0 − (${zt(-b)}) = ${b}`]); },
    () => { const t = wahl([3, 4, 6, 7, 8, 12, 13, 14, 16, 17]);
      return markiere(Z(`Die Zahl ${dt(D(t))} hat eine Gegenzahl.`, 'Markiere die Gegenzahl an der Zahlengeraden.'), ZEHNTEL(), -t, [[t, 'betrag-gegenzahl'], [gespiegelt(-t, 10), 'strahl-gespiegelt']], hGegen(1), [`0 − ${dt(D(t))} = ${dt(D(-t))}`]); },
    () => { const b = wahl([2, 3, 4, 6, 7, 8, 9]);
      return markiere(Z(`Zwei Zahlen haben den Abstand ${b} zur Null.`, 'Markiere die kleinere der beiden Zahlen.'), ZG(), -b, [[b, 'negativ-groesser'], [gespiegelt(-b, 5), 'strahl-gespiegelt']],
        H(1, 'Zwei Zahlen sind gleich weit von der Null entfernt: eine links, eine rechts.', 'Den Abstand 4 zur Null haben −4 und 4. Die kleinere Zahl ist −4.', 'Finde beide Zahlen. Die kleinere liegt links.'), [`0 − ${b} = ${zt(-b)}`]); },
    () => { const b = zz(2, 9), k = kind();
      return auswahl(Z(`${k} sagt: „Die Gegenzahl einer Zahl ist immer negativ.“`, 'Prüfe die Aussage.'), [opt('Stimmt.', false, 'betrag-gegenzahl'), opt(`Falsch. Die Gegenzahl von ${zt(-b)} ist ${b}.`, true), opt(`Falsch. Die Gegenzahl von ${b} ist ${b}.`, false, 'betrag-gegenzahl')],
        H(1, 'Probiere es mit einer negativen Zahl aus.', 'Die Gegenzahl von −2 ist 2.', 'Suche eine Zahl mit einer positiven Gegenzahl.'), { nachweis: [FREI('Gegenbeispiel: Die Gegenzahl einer negativen Zahl ist positiv')] }); },
  ]);
  sechs(R2, 'M', [
    () => { const N = wahl([4, 5, 10]), z = zz(1, N - 1), w = Q(-z, N);
      if (w[1] !== N) return null;
      return antwort(`Gib die Gegenzahl von ${bt(w)} an.`, neg(w), 'b', [[w, 'betrag-gegenzahl'], [Q(N, z), 'bruch-kehrwert']], H(2, 'Die Gegenzahl hat denselben Abstand zur Null, aber das andere Vorzeichen.', 'Ändere nur das Vorzeichen. Zähler und Nenner bleiben.'), [`0 − (${bt(w)}) = ${bt(neg(w))}`]); },
    () => { const w = D(-zz(101, 999), 2);
      if (w[1] !== 100) return null;
      return antwort(`Gib die Gegenzahl von ${dt(w)} an.`, neg(w), 'd', [[w, 'betrag-gegenzahl']], H(2, 'Die Gegenzahl hat dasselbe Zahlenbild, nur das Vorzeichen ist anders.', 'Lass das Minus weg.'), [`0 − (${dt(w)}) = ${dt(neg(w))}`]); },
    () => { const b = D(zz(11, 89)), anders = D(Number(String(b[0]).split('').reverse().join('')) || 12);
      if (b[1] !== 10 || anders[0] === b[0]) return null;
      return auswahl(`Kreuze alle Zahlen an, die von der Null den Abstand ${dt(b)} haben.`, [opt(dt(b), true), opt(dt(neg(b)), true), opt('0', false, 'betrag-gegenzahl'), opt(dt(neg(anders)), false, 'zahl-nach-gehoer')],
        H(2, 'Zwei Zahlen haben denselben Abstand zur Null: eine positive und eine negative.', 'Suche die Zahl selbst und ihre Gegenzahl.'), { mehrfach: true, nachweis: [{ art: 'betragwahl', betrag: dt(b) }] }); },
    () => { const w = D(-zz(101, 999), 2);
      if (w[1] !== 100) return null;
      return antwort(`Gib die Gegenzahl der Gegenzahl von ${dt(w)} an.`, w, 'd', [[neg(w), 'betrag-gegenzahl']], H(2, 'Bilde zweimal die Gegenzahl. Dabei wechselt das Vorzeichen zweimal.', 'Bilde zuerst die Gegenzahl. Bilde dann davon noch einmal die Gegenzahl.'), [`0 − (${dt(w)}) = ${dt(neg(w))}`, `0 − ${dt(neg(w))} = ${dt(w)}`]); },
    () => { const g = zz(2, 30), d = D(-zz(11, 99)), N = wahl([4, 5]), b = Q(zz(1, N - 1), N);
      if (d[1] === 1 || b[1] !== N) return null;
      const roh = mische([[dt(d), true], [bt(b), true], [zt(-g), false], [String(g + 1), false], ['0', false]]);
      return auswahl('Kreuze alle rationalen Zahlen an, die keine ganzen Zahlen sind.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'zahlbereich-falsch')),
        H(2, 'Ganze Zahlen haben kein Komma und keinen Bruch. Alle anderen Zahlen hier sind rationale Zahlen, aber keine ganzen.', 'Prüfe jede Zahl: Hat sie ein Komma oder einen Bruch?'), { mehrfach: true, nachweis: [FREI('Dezimalzahlen und Brüche sind rationale, aber keine ganzen Zahlen')] }); },
    () => { const h = D(zz(11, 99));
      if (h[1] === 1) return null;
      const d = plus(h, h);
      return antwort(Z(`Eine Zahl und ihre Gegenzahl liegen ${dt(d)} auseinander.`, 'Gib die negative der beiden Zahlen an.'), neg(h), 'd', [[h, 'negativ-groesser'], [neg(d), 'sach-schritt-vergessen']],
        H(2, 'Die Null liegt genau in der Mitte zwischen einer Zahl und ihrer Gegenzahl.', 'Halbiere den Abstand. Setze ein Minus davor.'), [`${dt(d)} : 2 = ${dt(h)}`, `0 − ${dt(h)} = ${dt(neg(h))}`]); },
  ]);
  const BEREICHE = ['ℕ (natürliche Zahlen)', 'ℤ (ganze Zahlen)', 'ℚ (rationale Zahlen)'];
  const bereich = (text, zahlText, w, hilfen) => { const inN = w[1] === 1 && w[0] >= 0, inZ = w[1] === 1;
    return auswahl(text, [opt(BEREICHE[0], inN, inN ? undefined : 'zahlbereich-falsch'), opt(BEREICHE[1], inZ, inZ ? undefined : 'zahlbereich-falsch'), opt(BEREICHE[2], true)], hilfen, { mehrfach: true, nachweis: [{ art: 'bereich', zahl: zahlText }] }); };
  sechs(R2, 'E', [
    () => { const w = D(-zz(11, 99));
      if (w[1] === 1) return null;
      return rechne(`Berechne ${txt(AB(w))}.`, AB(w), {}, [[w, 'betrag-gegenzahl']], H(3, 'Der Betrag ist der Abstand zur Null. Er ist nie negativ.')); },
    () => { const w = wahl([Q(-zz(2, 30)), D(zz(11, 49)), Q(zz(2, 30)), D(-zz(11, 49)), Q(-3, 4), Q(0)]), t = T(w, w[1] === 4 ? 'b' : 'd');
      if (w[1] === 10 && w[0] % 10 === 0) return null;
      return bereich(`Kreuze alle Zahlbereiche an, zu denen ${t} gehört.`, t, w, H(3, 'ℕ enthält nur 0, 1, 2, 3 … In ℤ kommen die negativen ganzen Zahlen dazu, in ℚ alle Brüche und Dezimalzahlen.')); },
    () => { const [z, N] = wahl([[12, 4], [15, 3], [18, 6], [20, 5], [7, 2], [9, 4], [10, 4]]), v = wahl([-1, -1, 1]), t = `${v < 0 ? MINUS : ''}${br(z, N)}`;
      return bereich(`Kreuze alle Zahlbereiche an, zu denen ${t} gehört.`, t, Q(v * z, N), H(3, 'Kürze den Bruch zuerst. Manche Brüche sind ganze Zahlen.')); },
    () => { const roh = mische([['Jede natürliche Zahl ist auch eine ganze Zahl.', true], ['Jede ganze Zahl ist auch eine rationale Zahl.', true], ['Jede rationale Zahl ist auch eine ganze Zahl.', false], ['Der Betrag einer Zahl ist nie negativ.', true], ['Die Gegenzahl einer Zahl ist immer kleiner als die Zahl.', false], ['Zwei verschiedene Zahlen können denselben Betrag haben.', true], ['Null ist eine negative Zahl.', false], ['Eine negative Zahl ist umso größer, je größer ihr Betrag ist.', false]]).slice(0, 5);
      if (roh.filter(([, r]) => r).length < 2 || roh.filter(([, r]) => !r).length < 2) return null;
      return auswahl('Prüfe die Aussagen. Kreuze alle an, die stimmen.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'betrag-gegenzahl')), H(3, 'Suche zu jeder Aussage ein Beispiel oder ein Gegenbeispiel, etwa −3 oder 0,5.'), { mehrfach: true, nachweis: [FREI('Aussagen über Zahlbereiche, Betrag und Gegenzahl')] }); },
    () => { const b = wahl([zz(3, 40), D(zz(11, 99))]), w = neg(Array.isArray(b) ? b : Q(b));
      if (!Number.isInteger(b) && w[1] === 1) return null;
      return antwort(`Die Zahl a hat den Betrag ${T(neg(w))} und ist kleiner als ihre Gegenzahl. Gib a an.`, w, 'd', [[neg(w), 'betrag-gegenzahl'], [0, 'betrag-gegenzahl']], H(3, 'Zwei Zahlen haben diesen Betrag. Welche von beiden liegt links von ihrer Gegenzahl?'), [`0 − ${T(neg(w))} = ${T(w)}`]); },
    () => { const g = zz(3, 12);
      return antwort(`Bestimme, wie viele ganze Zahlen einen Betrag haben, der kleiner als ${g} ist.`, 2 * (g - 1) + 1, 'd', [[2 * (g - 1), 'sach-schritt-vergessen'], [g - 1, 'betrag-gegenzahl'], [2 * g + 1, 'betrag-gegenzahl']],
        H(3, 'Denke an die positiven Zahlen, die negativen Zahlen und die Null.'), [`2 · (${g} − 1) + 1 = ${2 * (g - 1) + 1}`]); },
  ]);
}
