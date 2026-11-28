// Aufgaben zu 6.9.4 „Zunahme und Abnahme“ (Lernziele Z1, Z2) nach ADR 0015 und ADR 0059.
// Z1: Änderungen an der Zahlengeraden und am Thermometer bestimmen. Z2: Sachaufgaben, in denen der neue Stand oder die Änderung gesucht ist.
// Grilling mit Nils (2026-11-28, Q7): F und G mit Pfeil an Zahlengerade oder Thermometer. „Um wie viel ist es wärmer oder kälter geworden?“
// beantwortet das Kind mit einer Zahl ohne Vorzeichen; die Richtung steht im Auftrag oder kommt als Auswahl dazu. M über die Null mit
// Dezimalzahlen, E rückwärts (der Start ist gesucht). Die Summe der Beträge statt des Abstands (von −3 bis 5 „2 Grad“) ist der typische Fehler
// „abstand-ueber-null“, die vertauschte Richtung „richtung-vertauscht“.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, betrag, vgl, T, zt, dt, bt, opt, zz, wahl, mische, antwort, wahlAus, lk, lkd, gerade, thermo, konto, weg, wegZ, H, BILD, FREI, kind, istGanz, istDezimal } from './7-1-rational.mjs';

const Z1 = '6.9.4-Z1', Z2 = '6.9.4-Z2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
// Klammer um eine negative Zahl nach einem Rechenzeichen.
const k = (x) => (vgl(x, Q(0)) < 0 ? `(${T(x)})` : T(x));
// Änderung von a nach b: Wert ohne Vorzeichen, Rechnung, typische Fehler (Beträge voneinander abgezogen, Beträge addiert).
const aenderung = (a, b) => { const d = betrag(minus(b, a)), ab = betrag(minus(betrag(b), betrag(a))), sum = plus(betrag(a), betrag(b));
  const kreuzt = vgl(a, Q(0)) * vgl(b, Q(0)) < 0;
  return { d, rechnung: vgl(b, a) > 0 ? `${T(b)} − ${k(a)} = ${T(d)}` : `${T(a)} − ${k(b)} = ${T(d)}`, fehler: kreuzt ? [[ab, 'abstand-ueber-null']] : [[sum, 'betraege-addiert']] }; };
const STUNDEN = [['morgens', 'mittags'], ['nachts', 'mittags'], ['mittags', 'abends'], ['abends', 'nachts']];

export function zunahme6() {
  // ================= Z1: an Zahlengerade und Thermometer =================
  const hW = (n) => H(n, 'Zähle die Grade von der einen Säule zur anderen. Zähle über die Null hinweg.', 'Von −2 °C bis 3 °C: 2 Grad bis zur Null und 3 Grad weiter, zusammen 5 Grad.', 'Zähle erst bis zur Null. Zähle dann weiter bis zur zweiten Säule.');
  sechs(Z1, 'F', [
    () => { const a = -zz(1, 7), b = zz(1, 8), [t1, t2] = wahl(STUNDEN.slice(0, 2)), { d, rechnung, fehler } = aenderung(Q(a), Q(b));
      return antwort(Z(`Die Thermometer zeigen die Temperatur ${t1} und ${t2}.`, 'Bestimme, um wie viel Grad es wärmer geworden ist.'), d, 'd', fehler, hW(0), [BILD(zt(a), { name: t1 }), BILD(zt(b), { name: t2 }), rechnung], { einheit: 'Grad', bild: thermo(-10, 10, 1, 5, [a, t1], [b, t2]) }); },
    () => { const a = zz(1, 6), s = zz(a + 1, 9), b = a - s;
      return antwort(Z(`Das Thermometer zeigt die Temperatur am Abend.`, `In der Nacht wird es ${s} Grad kälter.`, 'Gib die Temperatur in der Nacht an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']],
        H(0, 'Kälter heißt: Die Säule geht nach unten.', 'Von 2 °C aus 5 Grad kälter: 2 Grad bis zur Null, 3 Grad weiter. Das sind −3 °C.', 'Zähle von der Säule aus nach unten. Zähle über die Null hinweg.'), [BILD(zt(a)), `${a} − ${s} = ${zt(b)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, a) }); },
    () => { const s = -zz(1, 7), p = zz(-s + 1, 9);
      if (s + p > 10) return null;
      return antwort(Z('Schau auf die Zahlengerade.', 'Der Pfeil startet beim Punkt.', 'Gib die Zahl an, bei der der Pfeil endet.'), s + p, 'd', [[s - p, 'richtung-vertauscht'], [-(s + p), 'vorzeichen-vergessen']],
        H(0, 'Plus heißt: Der Pfeil geht nach rechts.', 'Von −3 aus 5 nach rechts: Du landest bei 2.', 'Lege den Finger auf den Start. Gehe so viele Striche nach rechts, wie am Pfeil steht.'), [`${zt(s)} + ${p} = ${zt(s + p)}`], { bild: weg(-10, 10, s, [p]) }); },
    () => { const a = -zz(2, 8), b = zz(1, 8), { d, rechnung, fehler } = aenderung(Q(a), Q(b));
      return antwort(Z(`Die Punkte liegen bei ${zt(a)} und ${b}.`, 'Bestimme, wie viele Schritte es von der linken zur rechten Zahl sind.'), d, 'd', fehler,
        H(0, 'Zähle die Schritte über die Null hinweg.', 'Von −3 bis 4: 3 Schritte bis zur Null und 4 Schritte weiter, zusammen 7.', 'Zähle erst bis zur Null. Zähle dann weiter bis zum zweiten Punkt.'), [rechnung], { bild: ZG({ punkte: [a, b] }) }); },
    () => { const a = -zz(1, 4), b = -zz(5, 9), [t1, t2] = wahl(STUNDEN.slice(2)), { d, rechnung, fehler } = aenderung(Q(a), Q(b));
      return antwort(Z(`Die Thermometer zeigen die Temperatur ${t1} und ${t2}.`, 'Bestimme, um wie viel Grad es kälter geworden ist.'), d, 'd', fehler,
        H(0, 'Beide Temperaturen sind unter null. Zähle die Striche zwischen den beiden Säulen.', 'Von −2 °C bis −7 °C sind es 5 Grad.', 'Zähle von der höheren Säule nach unten bis zur niedrigeren.'), [BILD(zt(a), { name: t1 }), BILD(zt(b), { name: t2 }), rechnung], { einheit: 'Grad', bild: thermo(-10, 10, 1, 5, [a, t1], [b, t2]) }); },
    () => { const a = -zz(2, 7), b = zz(1, 6), { d } = aenderung(Q(a), Q(b)), ab = Math.abs(b + a), [t1, t2] = wahl(STUNDEN.slice(0, 2));
      if (ab === 0 || ab === d[0]) return null;
      return auswahl(Z(`Die Thermometer zeigen die Temperatur ${t1} und ${t2}.`, 'Kreuze die passende Änderung an.'), [opt(`${d[0]} Grad wärmer`, true), opt(`${ab} Grad wärmer`, false, 'abstand-ueber-null'), opt(`${d[0]} Grad kälter`, false, 'richtung-vertauscht')],
        hW(0), { bild: thermo(-10, 10, 1, 5, [a, t1], [b, t2]), nachweis: [FREI('Änderung zwischen zwei Thermometern: Abstand über die Null hinweg und Richtung')] }); },
  ]);
  sechs(Z1, 'G', [
    () => { const a = -zz(3, 18), b = zz(2, 25), { d, rechnung, fehler } = aenderung(Q(a), Q(b));
      return antwort(Z(`Morgens zeigt das Thermometer ${zt(a)} °C, mittags ${b} °C.`, 'Bestimme, um wie viel Grad es wärmer geworden ist.'), d, 'd', fehler, hW(1), [rechnung], { einheit: 'Grad' }); },
    () => { const a = -2 * zz(1, 9), b = 2 * zz(1, 12), { d, rechnung, fehler } = aenderung(Q(a), Q(b)), [t1, t2] = wahl(STUNDEN.slice(0, 2));
      return antwort(Z(`Die Thermometer zeigen die Temperatur ${t1} und ${t2}.`, 'Ein Strich bedeutet 2 Grad.', 'Bestimme, um wie viel Grad es wärmer geworden ist.'), d, 'd', [...fehler, [d[0] / 2, 'strahl-einerschritte']], hW(1), [BILD(zt(a), { name: t1 }), BILD(zt(b), { name: t2 }), rechnung], { einheit: 'Grad', bild: thermo(-20, 30, 2, 10, [a, t1], [b, t2]) }); },
    () => { const s = zz(-5, 3), p1 = -zz(4, 8), p2 = zz(2, 7), z = s + p1 + p2;
      if (s + p1 < -10 || z > 10 || s === 0) return null;
      return antwort(Z('Schau auf die Zahlengerade.', 'Der Weg startet beim Punkt und folgt den Pfeilen.', 'Gib die Zahl an, bei der der Weg endet.'), z, 'd', [[s - p1 - p2, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [s + p1, 'sach-schritt-vergessen']],
        H(1, 'Minus geht nach links, Plus geht nach rechts.', 'Start −2, dann −5, dann +3: −2 − 5 = −7, dann −7 + 3 = −4.', 'Gehe die Pfeile nacheinander. Merke dir nach jedem Pfeil, wo du bist.'), [`${zt(s)} − ${-p1} = ${zt(s + p1)}`, `${zt(s + p1)} + ${p2} = ${zt(z)}`], { bild: weg(-10, 10, s, [p1, p2]) }); },
    () => { const a = zz(2, 12), s = zz(a + 3, 30), b = a - s;
      return antwort(Z(`Am Nachmittag sind es ${a} °C.`, `Bis zum Morgen fällt die Temperatur um ${s} Grad.`, 'Gib die Temperatur am Morgen an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']],
        H(1, 'Fällt die Temperatur, rechnest du minus. Unter null wird die Zahl negativ.', `8 °C, dann 15 Grad weniger: 8 − 15 = −7. Es sind −7 °C.`, 'Rechne die Temperatur minus die Änderung.'), [`${a} − ${s} = ${zt(b)}`], { einheit: '°C' }); },
    () => { const a = 2 * zz(1, 10), s = 2 * zz(a / 2 + 1, 15), b = a - s;
      if (b < -20) return null;
      return antwort(Z('Das Thermometer zeigt die Temperatur am Mittag.', `Bis zum Abend wird es ${s} Grad kälter.`, 'Gib die Temperatur am Abend an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht'], [a - s / 2, 'strahl-einerschritte']],
        H(1, 'Kälter heißt: minus. Ein Strich bedeutet hier 2 Grad.', '6 °C, dann 10 Grad kälter: 6 − 10 = −4.', 'Lies zuerst die Temperatur ab. Rechne dann minus die Änderung.'), [BILD(zt(a)), `${a} − ${s} = ${zt(b)}`], { einheit: '°C', bild: thermo(-20, 30, 2, 10, a) }); },
    () => { const a = -zz(3, 9), b = zz(1, 9), { d } = aenderung(Q(a), Q(b));
      return luecken(Z(`Ein Pfeil an der Zahlengeraden startet bei ${zt(a)} und endet bei ${b}.`, 'Ergänze die Länge des Pfeils.', 'Der Pfeil geht {{a}} Schritte nach rechts.'), { a: lk(d[0], [[Math.abs(a + b), 'abstand-ueber-null']]) },
        H(1, 'Zähle die Schritte über die Null hinweg.', 'Von −4 bis 3: 4 Schritte bis zur Null und 3 weiter, zusammen 7.', 'Zähle erst bis zur Null. Zähle dann weiter.'), { nachweis: [`${b} − (${zt(a)}) = ${d[0]}`], bild: ZG({ punkte: [a, b] }) }); },
  ]);
  sechs(Z1, 'M', [
    () => { const s = -zz(5, 15), p = zz(-s + 2, 30), z = s + p;
      if (z > 20 || z % 10 === 0) return null;
      return antwort(Z('Schau auf die Zahlengerade.', 'Gib die Zahl an, bei der der Pfeil endet.'), D(z), 'd', [[D(s - p), 'richtung-vertauscht'], [D(-z), 'vorzeichen-vergessen']],
        H(2, 'Ein Strich bedeutet hier 0,1. Plus geht nach rechts.', 'Rechne Start plus Pfeil. Achte darauf, ob du über die Null kommst.'), [`${dt(D(s))} + ${dt(D(p))} = ${dt(D(z))}`], { bild: wegZ(s, [p]) }); },
    () => { const a = D(-zz(11, 95)), b = D(zz(11, 95)), [t1, t2] = wahl(STUNDEN.slice(0, 2)), { d, rechnung, fehler } = aenderung(a, b);
      if (istGanz(a) || istGanz(b)) return null;
      return antwort(Z(`${t1[0].toUpperCase()}${t1.slice(1)} sind es ${dt(a)} °C, ${t2} ${dt(b)} °C.`, 'Bestimme, um wie viel Grad es wärmer geworden ist.'), d, 'd', fehler,
        H(2, 'Über die Null hinweg addierst du die beiden Abstände zur Null.', 'Rechne die höhere minus die tiefere Temperatur.'), [rechnung], { einheit: 'Grad' }); },
    () => { const s = zz(-15, 15), z = zz(-18, 18), p = z - s;
      if (s === 0 || z === 0 || Math.abs(p) < 4 || s % 10 === 0 || z % 10 === 0 || Math.sign(s) === Math.sign(z)) return null;
      return antwort(Z(`Ein Pfeil an der Zahlengeraden startet bei ${dt(D(s))} und endet bei ${dt(D(z))}.`, 'Gib die Änderung mit Vorzeichen an.', 'Ein Pfeil nach rechts bekommt ein Plus, ein Pfeil nach links ein Minus.'), D(p), 'd',
        [[D(-p), 'richtung-vertauscht'], [minus(betrag(D(z)), betrag(D(s))), 'abstand-ueber-null']],
        H(2, 'Ein Pfeil nach rechts heißt Zunahme, nach links Abnahme.', 'Rechne Ziel minus Start. Ist das Ergebnis negativ, zeigt der Pfeil nach links.'), [`${dt(D(z))} − ${k(D(s))} = ${dt(D(p))}`]); },
    () => { const a1 = D(zz(5, 45)), b1 = D(-zz(5, 45)), a2 = D(-zz(5, 45)), b2 = minus(a2, D(zz(10, 60))), d1 = minus(a1, b1), d2 = minus(a2, b2);
      if (vgl(d1, d2) === 0 || [a1, b1, a2, b2].some((x) => istGanz(x))) return null;
      const ost = vgl(d1, d2) > 0;
      return auswahl(Z(`In Nordheim fällt die Temperatur von ${dt(a1)} °C auf ${dt(b1)} °C.`, `In Südheim fällt sie von ${dt(a2)} °C auf ${dt(b2)} °C.`, 'Kreuze an, wo die Temperatur stärker fällt.'),
        [opt(`in Nordheim, um ${dt(d1)} Grad`, ost, ost ? undefined : 'abstand-ueber-null'), opt(`in Südheim, um ${dt(d2)} Grad`, !ost, ost ? 'abstand-ueber-null' : undefined), opt('in beiden Orten gleich stark', false, 'abstand-ueber-null')],
        H(2, 'Rechne für jeden Ort die Änderung aus. Über die Null hinweg addierst du die Abstände zur Null.', 'Vergleiche die beiden Änderungen ohne Vorzeichen.'), { nachweis: [`${dt(a1)} − ${k(b1)} = ${dt(d1)}`, `${dt(a2)} − ${k(b2)} = ${dt(d2)}`, FREI('Verglichen werden die beiden Änderungen')] }); },
    () => { const s = -zz(2, 9), p1 = zz(5, 12), p2 = -zz(4, 12), p3 = zz(1, 6), z = s + p1 + p2 + p3;
      if (s + p1 > 10 || s + p1 + p2 < -10 || z > 10 || z < -10) return null;
      return antwort(Z('Schau auf die Zahlengerade.', 'Der Weg startet beim Punkt und folgt den drei Pfeilen.', 'Gib die Zahl an, bei der der Weg endet.'), z, 'd', [[s - p1 - p2 - p3, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [s + p1 + p2, 'sach-schritt-vergessen']],
        H(2, 'Gehe die Pfeile nacheinander. Plus geht nach rechts, Minus nach links.', 'Schreibe nach jedem Pfeil auf, wo du bist.'), [`${zt(s)} + ${p1} − ${-p2} + ${p3} = ${zt(z)}`], { bild: weg(-10, 10, s, [p1, p2, p3]) }); },
    () => { const a = -zz(5, 20), b = zz(3, 25), m = D(5 * zz(1, 9), 2), A = plus(Q(a), neg(m)), { d, rechnung, fehler } = aenderung(A, Q(b));
      if (!istDezimal(A, 2)) return null;
      return antwort(Z(`In einer Kühlkammer sind es ${dt(A)} °C.`, `Draußen sind es ${b} °C.`, 'Bestimme den Temperaturunterschied.'), d, 'd', fehler,
        H(2, 'Rechne die höhere minus die tiefere Temperatur.', 'Über die Null hinweg addierst du die Abstände zur Null.'), [rechnung], { einheit: 'Grad' }); },
  ]);
  sechs(Z1, 'E', [
    () => { const s = D(zz(11, 95)), z = D(-zz(11, 95));
      if (istGanz(s) || istGanz(z)) return null;
      return antwort(Z(`Nach einem Anstieg um ${dt(s)} Grad zeigt das Thermometer ${dt(plus(z, s))} °C.`, 'Gib die Temperatur vor dem Anstieg an.'), z, 'd', [[plus(plus(z, s), s), 'richtung-vertauscht'], [neg(z), 'vorzeichen-vergessen']],
        H(3, 'Rechne rückwärts: Ein Anstieg wird beim Zurückrechnen zu einer Abnahme.'), [`${dt(plus(z, s))} − ${dt(s)} = ${dt(z)}`], { einheit: '°C' }); },
    () => { const a = -zz(3, 9), b = zz(2, 9), kk = kind(), falsch = Math.abs(b + a), { d } = aenderung(Q(a), Q(b));
      if (falsch === 0 || falsch === d[0]) return null;
      return auswahl(Z(`${kk} rechnet: „Von ${zt(a)} °C auf ${b} °C sind es ${falsch} Grad.“`, 'Prüfe die Rechnung. Begründe.'),
        [opt(`Falsch. Es sind ${d[0]} Grad, denn bis zur Null sind es ${-a} Grad und dann noch ${b} Grad.`, true), opt(`Stimmt, denn ${b} − ${-a} = ${b + a}.`, false, 'abstand-ueber-null'), opt(`Falsch. Es sind ${-a} Grad, denn nur der Teil unter null zählt.`, false, 'sach-schritt-vergessen')],
        H(3, 'Zeichne die beiden Temperaturen an eine Zahlengerade. Zähle die Grade dazwischen.'), { nachweis: [FREI('Der Abstand über die Null ist die Summe der beiden Abstände zur Null')] }); },
    () => { const s = zz(-15, 10), p = [zz(5, 15), -zz(10, 25), zz(3, 12)], z = s + p[0] + p[1] + p[2];
      if (s === 0 || z === 0 || s % 10 === 0 || z % 10 === 0 || Math.abs(z) > 19 || s + p[0] > 20 || s + p[0] + p[1] < -20) return null;
      return antwort(Z('Schau auf die Zahlengerade.', 'Der Weg startet beim Punkt und folgt den drei Pfeilen.', 'Gib die Zahl an, bei der der Weg endet.'), D(z), 'd', [[D(s - p[0] - p[1] - p[2]), 'richtung-vertauscht'], [D(-z), 'vorzeichen-vergessen'], [D(s + p[0] + p[1]), 'sach-schritt-vergessen']],
        H(3, 'Ein Strich bedeutet 0,1. Gehe die Pfeile nacheinander.'), [`${dt(D(s))} + ${dt(D(p[0]))} − ${dt(D(-p[1]))} + ${dt(D(p[2]))} = ${dt(D(z))}`], { bild: wegZ(s, p) }); },
    () => { const s1 = D(5 * zz(3, 19)), s2 = D(zz(5, 30)), ende = D(-zz(5, 50)), start = plus(minus(ende, s2), s1);
      if ([s1, s2, ende, start].some((x) => istGanz(x))) return null;
      return antwort(Z(`Die Temperatur fällt erst um ${dt(s1)} Grad und steigt dann um ${dt(s2)} Grad.`, `Am Ende sind es ${dt(ende)} °C.`, 'Gib die Temperatur am Anfang an.'), start, 'd', [[minus(plus(ende, s2), s1), 'richtung-vertauscht'], [neg(start), 'vorzeichen-vergessen'], [plus(ende, s1), 'sach-schritt-vergessen']],
        H(3, 'Rechne rückwärts: Mache jeden Schritt in umgekehrter Reihenfolge und Richtung rückgängig.'), [`${dt(ende)} − ${dt(s2)} + ${dt(s1)} = ${dt(start)}`], { einheit: '°C' }); },
    () => { const N = wahl([4, 8]), a = Q(zz(1, N - 1), N), s = Q(zz(N + 1, 3 * N - 1), N), b = minus(a, s);
      if (a[1] !== N || istGanz(b) || istGanz(s)) return null;
      return antwort(Z(`Ein Wasserstand liegt ${bt(a)} m über dem Normalwert.`, `Er sinkt um ${bt(s)} m.`, 'Gib den neuen Wasserstand als Zahl mit Vorzeichen an. Kürze vollständig.'), b, 'b', [[neg(b), 'vorzeichen-vergessen'], [plus(a, s), 'richtung-vertauscht']],
        H(3, 'Mache die Brüche gleichnamig. Rechne dann Wasserstand minus Änderung.'), [`${bt(a)} − ${bt(s)} = ${bt(b)}`], { einheit: 'm' }); },
    () => { const z = D(-zz(11, 95)), l = D(zz(25, 99)), s = minus(z, l);
      if ([z, l, s].some((x) => istGanz(x))) return null;
      return antwort(Z(`Ein Pfeil der Länge ${dt(l)} zeigt nach rechts und endet bei ${dt(z)}.`, 'Gib die Zahl an, bei der der Pfeil startet.'), s, 'd', [[plus(z, l), 'richtung-vertauscht'], [neg(s), 'vorzeichen-vergessen']],
        H(3, 'Gehe vom Ende aus zurück, also nach links.'), [`${dt(z)} − ${dt(l)} = ${dt(s)}`]); },
  ]);

  // ================= Z2: Sachaufgaben =================
  const hK = (n) => H(n, 'Kommt Geld dazu, rechnest du plus. Geht Geld ab, rechnest du minus.', 'Kontostand 5 €, Abbuchung 8 €: 5 − 8 = −3. Das Konto ist mit 3 € im Minus.', 'Rechne den alten Kontostand plus oder minus die Buchung.');
  sechs(Z2, 'F', [
    () => { const a = zz(2, 9), s = zz(a + 1, 15), b = a - s;
      return antwort(Z(`Auf Ninas Konto sind ${a} €.`, `Es werden ${s} € abgebucht.`, 'Gib den neuen Kontostand an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']], hK(0), [`${a} − ${s} = ${zt(b)}`], { einheit: '€', daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${a} €`], ['Abbuchung', `${zt(-s)} €`], ['neuer Kontostand', '?']]) }); },
    () => { const a = zz(1, 4), s = zz(a + 1, a + 5), b = a - s;
      return antwort(Z(`Der Aufzug steht im Stockwerk ${a}.`, `Er fährt ${s} Stockwerke nach unten.`, 'Gib das Stockwerk an, in dem er hält.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']],
        H(0, 'Nach unten heißt: minus. Unter dem Erdgeschoss werden die Stockwerke negativ.', 'Von Stockwerk 2 drei Stockwerke nach unten: 2 − 3 = −1.', 'Starte bei der Zahl des Stockwerks. Gehe so viele Schritte nach links.'), [`${a} − ${s} = ${zt(b)}`], { bild: gerade(-5, 10, 1, 5, { start: a }) }); },
    () => { const t = zz(6, 18), s = zz(2, t - 2), b = -t + s;
      return antwort(Z(`Ein Taucher ist ${t} m unter der Wasseroberfläche.`, `Er steigt ${s} m auf.`, 'Gib seine neue Höhe als Zahl mit Vorzeichen an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [-t - s, 'richtung-vertauscht']],
        H(0, 'Aufsteigen heißt: Die Zahl wird größer. Sie bleibt negativ, solange der Taucher unter Wasser ist.', 'Bei −10 m 4 m aufsteigen: −10 + 4 = −6.', 'Starte beim Punkt. Gehe so viele Schritte nach rechts, wie er aufsteigt.'), [`${zt(-t)} + ${s} = ${zt(b)}`], { einheit: 'm', bild: gerade(-20, 0, 1, 5, { start: -t }) }); },
    () => { const a = zz(1, 6), s = zz(a + 1, 10), b = a - s;
      return antwort(Z(`Abends sind es ${a} °C.`, `In der Nacht wird es ${s} Grad kälter.`, 'Gib die Temperatur in der Nacht an.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']],
        H(0, 'Kälter heißt: minus.', '3 °C und 5 Grad kälter: 3 − 5 = −2.', 'Zähle am Thermometer von der Säule aus nach unten.'), [BILD(zt(a)), `${a} − ${s} = ${zt(b)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, a) }); },
    () => { const a = -zz(2, 9), e = zz(-a + 1, 15), b = a + e;
      return antwort(Z(`Ben hat ${-a} € Schulden.`, `Er zahlt ${e} € auf sein Konto ein.`, 'Gib den neuen Kontostand an.'), b, 'd', [[a - e, 'richtung-vertauscht'], [-a + e, 'betraege-addiert']], hK(0), [`${zt(a)} + ${e} = ${zt(b)}`], { einheit: '€', daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${zt(a)} €`], ['Einzahlung', `${e} €`], ['neuer Kontostand', '?']]) }); },
    () => { const u = -zz(2, 5), o = zz(5, 15), { d, rechnung, fehler } = aenderung(Q(u), Q(o));
      return antwort(Z(`Der Burgkeller liegt bei ${zt(u)} m.`, `Die Turmspitze liegt bei ${o} m.`, 'Bestimme den Höhenunterschied.'), d, 'd', fehler,
        H(0, 'Zähle über die Höhe 0 m hinweg.', 'Von −3 m bis 10 m: 3 m bis zur 0 und 10 m weiter, zusammen 13 m.', 'Zähle an der Zahlengeraden die Schritte vom Keller bis zur Spitze.'), [rechnung], { einheit: 'm', bild: gerade(-5, 15, 1, 5, { punkte: [u, o] }) }); },
  ]);
  sechs(Z2, 'G', [
    () => { const a = zz(12, 60), s = zz(a + 5, 95), b = a - s;
      return antwort(Z(`Auf einem Konto sind ${a} €.`, `Es werden ${s} € abgebucht.`, 'Berechne den neuen Kontostand.'), b, 'd', [[-b, 'vorzeichen-vergessen'], [a + s, 'richtung-vertauscht']], hK(1), [`${a} − ${s} = ${zt(b)}`], { einheit: '€', daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${a} €`], ['Abbuchung', `${zt(-s)} €`], ['neuer Kontostand', '?']]) }); },
    () => { const t = zz(10, 40), h = zz(10, 50), { d, rechnung, fehler } = aenderung(Q(-t), Q(h));
      return antwort(Z(`Ein Fisch schwimmt ${t} m unter der Wasseroberfläche.`, `Eine Möwe fliegt ${h} m darüber.`, 'Berechne den Höhenunterschied zwischen Fisch und Möwe.'), d, 'd', fehler,
        H(1, 'Die Wasseroberfläche hat die Höhe 0 m. Über die Null hinweg addierst du die Abstände.', '20 m unter und 30 m über dem Wasser: 20 + 30 = 50.', 'Rechne den Abstand des Fisches zur 0 plus den Abstand der Möwe zur 0.'), [rechnung], { einheit: 'm' }); },
    () => { const a = -zz(5, 25), b = zz(1, 15), [o, z1, z2] = [wahl(['In Moskau', 'In Kiruna', 'In Helsinki']), wahl(['6 Uhr', '7 Uhr']), wahl(['14 Uhr', '15 Uhr'])], { d, rechnung, fehler } = aenderung(Q(a), Q(b));
      return antwort(Z(`${o} sind es um ${z1} ${zt(a)} °C.`, `Um ${z2} sind es ${b} °C.`, 'Berechne, um wie viel Grad es wärmer geworden ist.'), d, 'd', fehler, hW(1), [rechnung], { einheit: 'Grad' }); },
    () => { const u = -zz(1, 3), o = zz(3, 12), { d, rechnung, fehler } = aenderung(Q(u), Q(o));
      return antwort(Z(`Lea steigt im Stockwerk ${zt(u)} in den Aufzug.`, `Sie fährt in das Stockwerk ${o}.`, 'Bestimme, um wie viele Stockwerke sie nach oben fährt.'), d, 'd', fehler,
        H(1, 'Zähle über das Erdgeschoss (0) hinweg.', 'Von −2 bis 5: 2 Stockwerke bis zum Erdgeschoss und 5 weiter, zusammen 7.', 'Rechne Ziel minus Start.'), [rechnung], { bild: gerade(-5, 15, 1, 5, { punkte: [u, o] }) }); },
    () => { const a = zz(15, 40), s1 = zz(20, 50), e = zz(5, 30), b = a - s1 + e;
      if (a - s1 >= 0 || b === 0 || Math.abs(b) > 99) return null;
      return antwort(Z(`Auf Tims Konto sind ${a} €.`, `Erst werden ${s1} € abgebucht, dann ${e} € eingezahlt.`, 'Berechne den neuen Kontostand.'), b, 'd', [[a + s1 - e, 'richtung-vertauscht'], [a - s1, 'sach-schritt-vergessen'], [-b, 'vorzeichen-vergessen']], hK(1), [`${a} − ${s1} = ${zt(a - s1)}`, `${zt(a - s1)} + ${e} = ${zt(b)}`], { einheit: '€', daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${a} €`], ['Abbuchung', `${zt(-s1)} €`], ['Einzahlung', `${e} €`]]) }); },
    () => { const a = -zz(10, 40), e = zz(5, 30), b = a + e;
      if (b === 0) return null;
      const opts = [[`${zt(a)} + ${e}`, true], [`${zt(a)} − ${e}`, false, 'richtung-vertauscht'], [`${-a} + ${e}`, false, 'vorzeichen-vergessen']];
      return auswahl(Z(`Ein Konto zeigt ${zt(a)} €.`, `Dann werden ${e} € eingezahlt.`, 'Kreuze die passende Rechnung an.'), mische(opts).map(([t, r, fv]) => opt(t, r, fv)),
        H(1, 'Einzahlen heißt: Geld kommt dazu. Der Kontostand vorher ist negativ.', 'Bei −20 € und 5 € Einzahlung: −20 + 5.', 'Schreibe zuerst den alten Kontostand mit Vorzeichen. Überlege dann: plus oder minus?'), { nachweis: [FREI('Einzahlung heißt plus, der alte Kontostand ist negativ')] }); },
  ]);
  sechs(Z2, 'M', [
    () => { const a = D(zz(1005, 9995), 2), s = D(zz(10005, 19995), 2), b = minus(a, s);
      if (a[1] !== 100 || s[1] !== 100 || vgl(b, Q(0)) >= 0 || vgl(neg(b), Q(1000)) >= 0) return null;
      return antwort(Z(`Auf einem Konto sind ${dt(a, 2)} €.`, `Es werden ${dt(s, 2)} € abgebucht.`, 'Berechne den neuen Kontostand.'), b, 'd', [[neg(b), 'vorzeichen-vergessen'], [plus(a, s), 'richtung-vertauscht']], H(2, 'Geht mehr Geld ab, als auf dem Konto ist, wird der Kontostand negativ.', 'Rechne die größere minus die kleinere Zahl und setze ein Minus davor.'), [`${dt(a, 2)} − ${dt(s, 2)} = ${dt(b, 2)}`], { einheit: '€', geld: true }); },
    () => { const t = D(zz(101, 299)), s = D(zz(11, 99)), b = plus(neg(t), s);
      if ([t, s, b].some((x) => istGanz(x))) return null;
      return antwort(Z(`Ein Taucher ist ${dt(t)} m unter der Wasseroberfläche.`, `Er steigt ${dt(s)} m auf.`, 'Berechne seine neue Höhe als Zahl mit Vorzeichen.'), b, 'd', [[neg(b), 'vorzeichen-vergessen'], [minus(neg(t), s), 'richtung-vertauscht']],
        H(2, 'Aufsteigen heißt plus. Unter Wasser ist die Höhe negativ.', 'Rechne die Tiefe mit Minus plus die Strecke nach oben.'), [`${dt(neg(t))} + ${dt(s)} = ${dt(b)}`], { einheit: 'm' }); },
    () => { const a = D(-zz(11, 95)), b = D(zz(11, 95)), { d, rechnung, fehler } = aenderung(a, b), [o1, o2] = mische(['Oslo', 'Rom', 'Kiruna', 'Madrid']).slice(0, 2);
      if (istGanz(a) || istGanz(b)) return null;
      return antwort(Z(`An einem Wintertag sind es in ${o1} ${dt(a)} °C, in ${o2} ${dt(b)} °C.`, 'Berechne den Temperaturunterschied.'), d, 'd', fehler, H(2, 'Rechne die höhere minus die tiefere Temperatur.', 'Über die Null hinweg addierst du die Abstände zur Null.'), [rechnung], { einheit: 'Grad' }); },
    () => { const a = D(zz(1005, 4995), 2), s1 = D(zz(5005, 9995), 2), e = D(zz(1005, 2995), 2), b = plus(minus(a, s1), e);
      if ([a, s1, e].some((x) => x[1] !== 100) || vgl(minus(a, s1), Q(0)) >= 0 || vgl(b, Q(0)) === 0) return null;
      return antwort(Z('Hier siehst du einen Kontoauszug.', 'Berechne den neuen Kontostand.'), b, 'd', [[minus(a, s1), 'sach-schritt-vergessen'], [neg(b), 'vorzeichen-vergessen'], [minus(plus(a, s1), e), 'richtung-vertauscht']],
        H(2, 'Rechne die Buchungen nacheinander. Abbuchungen haben ein Minus.', 'Schreibe nach jeder Buchung den Zwischenstand auf.'), [`${dt(a, 2)} − ${dt(s1, 2)} + ${dt(e, 2)} = ${dt(b, 2)}`], { einheit: '€', geld: true, daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${dt(a, 2)} €`], ['Abbuchung', `${dt(neg(s1), 2)} €`], ['Gutschrift', `${dt(e, 2)} €`]]) }); },
    () => { const w = D(-zz(11, 95), 2), s = D(zz(101, 199), 2), b = plus(w, s);
      if ([w, s].some((x) => x[1] !== 100) || istGanz(b)) return null;
      return antwort(Z(`Der Wasserstand im Burggraben liegt bei ${dt(w)} m, also unter dem Normalwert.`, `Nach einem Regen steigt er um ${dt(s)} m.`, 'Berechne den neuen Wasserstand.'), b, 'd', [[minus(w, s), 'richtung-vertauscht'], [neg(b), 'vorzeichen-vergessen']],
        H(2, 'Steigen heißt plus. Über die Null hinweg wird der Wasserstand positiv.', 'Rechne den alten Wasserstand plus den Anstieg.'), [`${dt(w)} + ${dt(s)} = ${dt(b)}`], { einheit: 'm' }); },
    () => { const u = -zz(1, 3), o = zz(2, 9), h = D(zz(275, 345), 2), n = o - u, w = mal0(h, n);
      if (h[1] !== 100 && h[1] !== 20 && h[1] !== 4) return null;
      return antwort(Z(`Ein Auto fährt im Parkhaus vom Stockwerk ${zt(u)} in das Stockwerk ${o}.`, `Jedes Stockwerk ist ${dt(h)} m hoch.`, 'Berechne, wie viele Meter das Auto nach oben fährt.'), w, 'd', [[mal0(h, o + u), 'abstand-ueber-null'], [mal0(h, o), 'sach-schritt-vergessen']],
        H(2, 'Bestimme zuerst, wie viele Stockwerke es sind. Zähle über das Erdgeschoss hinweg.', 'Rechne die Anzahl der Stockwerke mal die Höhe eines Stockwerks.'), [`${o} − (${zt(u)}) = ${n}`, `${n} · ${dt(h)} = ${dt(w)}`], { einheit: 'm' }); },
  ]);
  sechs(Z2, 'E', [
    () => { const s = D(zz(5005, 9995), 2), nach = D(-zz(1005, 4995), 2), vor = plus(nach, s);
      if ([s, nach].some((x) => x[1] !== 100)) return null;
      return antwort(Z(`Nach einer Abbuchung von ${dt(s, 2)} € zeigt ein Konto ${dt(nach, 2)} €.`, 'Berechne den Kontostand vor der Abbuchung.'), vor, 'd', [[minus(nach, s), 'richtung-vertauscht'], [neg(vor), 'vorzeichen-vergessen']],
        H(3, 'Rechne rückwärts: Eine Abbuchung machst du mit plus rückgängig.'), [`${dt(nach, 2)} + ${dt(s, 2)} = ${dt(vor, 2)}`], { einheit: '€', geld: true }); },
    () => { const a = zz(2, 9), r = D(wahl([5, 15, 25])), n = zz(3, 8), b = minus(Q(a), mal0(r, n));
      if (vgl(b, Q(0)) >= 0 || istGanz(r)) return null;
      return antwort(Z(`Um 18 Uhr sind es ${a} °C.`, `Danach fällt die Temperatur jede Stunde um ${dt(r)} Grad.`, `Berechne die Temperatur um ${18 + n} Uhr.`), b, 'd', [[plus(Q(a), mal0(r, n)), 'richtung-vertauscht'], [neg(b), 'vorzeichen-vergessen'], [minus(Q(a), mal0(r, n - 1)), 'sach-schritt-vergessen']],
        H(3, 'Bestimme zuerst, um wie viel Grad die Temperatur insgesamt fällt.'), [`${18 + n} − 18 = ${n}`, `${n} · ${dt(r)} = ${dt(mal0(r, n))}`, `${a} − ${dt(mal0(r, n))} = ${dt(b)}`], { einheit: '°C' }); },
    () => { const N = wahl([4, 2, 8]), a = Q(-zz(1, N - 1), N), b = Q(zz(N + 1, 3 * N), N), d = minus(b, a);
      if (a[1] !== N || istGanz(b) || istGanz(d)) return null;
      return antwort(Z(`Ein Pegel zeigt am Morgen ${bt(a)} m und am Abend ${bt(b)} m.`, 'Berechne, um wie viele Meter das Wasser gestiegen ist. Kürze vollständig.'), d, 'b', [[minus(b, neg(a)), 'abstand-ueber-null'], [neg(d), 'vorzeichen-vergessen']],
        H(3, 'Rechne Abend minus Morgen. Minus eine negative Zahl heißt plus.'), [`${bt(b)} − (${bt(a)}) = ${bt(d)}`], { einheit: 'm' }); },
    () => { const a = D(zz(1005, 4995), 2), s = D(zz(5005, 9995), 2), b = minus(a, s), kk = kind(), falsch = minus(s, a);
      if ([a, s].some((x) => x[1] !== 100)) return null;
      return auswahl(Z(`Auf einem Konto sind ${dt(a, 2)} €. Es werden ${dt(s, 2)} € abgebucht.`, `${kk} rechnet: „Der neue Kontostand ist ${dt(falsch, 2)} €.“`, 'Prüfe das Ergebnis.'),
        [opt(`Falsch. Der Kontostand ist ${dt(b, 2)} €, weil mehr abgebucht wird, als auf dem Konto war.`, true), opt('Stimmt.', false, 'vorzeichen-vergessen'), opt(`Falsch. Der Kontostand ist ${dt(plus(a, s), 2)} €.`, false, 'richtung-vertauscht')],
        H(3, 'Geht mehr Geld ab, als da ist, wird der Kontostand negativ.'), { nachweis: [FREI('Wird mehr abgebucht, als auf dem Konto ist, ist der neue Kontostand negativ')] }); },
    () => { const a = D(zz(1005, 2995), 2), s1 = D(zz(3005, 5995), 2), e = D(zz(1005, 3995), 2), b = plus(minus(a, s1), e);
      if ([a, s1, e].some((x) => x[1] !== 100) || vgl(minus(a, s1), Q(0)) >= 0) return null;
      return luecken(Z('Im Kontoauszug fehlt ein Betrag.', 'Ergänze die fehlende Abbuchung.', `Alter Kontostand ${dt(a, 2)} €, neuer Kontostand ${dt(b, 2)} €, Gutschrift ${dt(e, 2)} €.`, 'Abbuchung: {{a}} €'),
        { a: [dt(s1, 2), [{ wert: dt(neg(s1), 2), fehlvorstellung: 'vorzeichen-vergessen' }]] }, H(3, 'Rechne vom neuen Kontostand rückwärts: Ziehe die Gutschrift ab und vergleiche mit dem alten Kontostand.'),
        { nachweis: [`${dt(b, 2)} − ${dt(e, 2)} = ${dt(minus(b, e), 2)}`, `${dt(a, 2)} − (${dt(minus(b, e), 2)}) = ${dt(s1, 2)}`], daten: konto(['Buchung', 'Betrag'], [['alter Kontostand', `${dt(a, 2)} €`], ['Abbuchung', '?'], ['Gutschrift', `${dt(e, 2)} €`], ['neuer Kontostand', `${dt(b, 2)} €`]]) }); },
    () => { const t = D(zz(101, 299)), s1 = D(zz(51, 99)), s2 = D(zz(21, 149)), b = plus(minus(neg(t), s1), s2);
      if ([t, s1, s2, b].some((x) => istGanz(x))) return null;
      return antwort(Z(`Eine Taucherin ist ${dt(t)} m tief.`, `Sie taucht ${dt(s1)} m tiefer und steigt dann ${dt(s2)} m auf.`, 'Berechne ihre Höhe am Ende als Zahl mit Vorzeichen.'), b, 'd', [[plus(plus(neg(t), s1), s2), 'richtung-vertauscht'], [neg(b), 'vorzeichen-vergessen'], [minus(neg(t), s1), 'sach-schritt-vergessen']],
        H(3, 'Tiefer heißt minus, aufsteigen heißt plus. Die Wasseroberfläche hat die Höhe 0 m.'), [`${dt(neg(t))} − ${dt(s1)} + ${dt(s2)} = ${dt(b)}`], { einheit: 'm' }); },
  ]);
}
const mal0 = (a, n) => { const x = Array.isArray(a) ? a : Q(a); return Q(x[0] * n, x[1]); };
