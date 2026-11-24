// Aufgaben zu 7.1.3 „Addieren“ (Lernziele A1, A2) nach ADR 0015 und ADR 0043.
// A1: ganze Zahlen addieren. A2: Dezimalzahlen und Brüche addieren (auf F mehrere Sprünge mit ganzen Zahlen).
// Grilling mit Nils (2026-11-24): F bis ±20 mit Sprüngen an der Zahlengeraden, G bis ±100 und eine Nachkommastelle mit der Schreibweise (+15),
// M zwei Stellen und gleichnamige Brüche, E ungleichnamige Brüche, Fehlersuche und Rückwärtsaufgaben.
// Typische Fehler: die Beträge immer addieren, das Vorzeichen des Ergebnisses vergessen, in die falsche Richtung gehen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, betrag, gleich, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, lkd, gerade, weg, wegZ, thermo, H, X, kette, val, txt, rechne, pruefe, aussagen, mauerR, fAdd, AUSSAGEN, FREI, kind, istGanz } from './7-1-rational.mjs';

const A1 = '7.1.3-A1', A2 = '7.1.3-A2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const P = { plus: true }, PB = { plus: true, form: 'b' };
const MAUER = Z('Fülle die Zahlenmauer aus.', 'Jeder Stein ist die Summe der beiden Steine darunter.');
const fMauer = (x) => (x[0] === 0 ? [] : [{ wert: -x[0], fehlvorstellung: 'vorzeichen-vergessen' }]);

export function addieren() {
  // ================= A1: ganze Zahlen =================
  const hF = (beispiel) => H(0, 'Starte bei der ersten Zahl. Plus eine positive Zahl geht nach rechts, plus eine negative Zahl geht nach links.', beispiel, 'Lege den Finger auf die erste Zahl. Gehe so viele Schritte, wie der Bogen zeigt.');
  sechs(A1, 'F', [
    () => { const a = -zz(2, 8), z = zz(1, 8), b = z - a, e = X('+', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fAdd(a, b), hF('−3 + 5 = 2. Du gehst von −3 aus 5 Schritte nach rechts.'), { bild: weg(-10, 10, a, [b]) }); },
    () => { const a = zz(1, 6), z = -zz(1, 8), b = z - a, e = X('+', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fAdd(a, b), hF('4 + (−7) = −3. Du gehst von 4 aus 7 Schritte nach links.'), { bild: weg(-10, 10, a, [b]) }); },
    () => { const a = -zz(1, 5), b = -zz(2, 5), e = X('+', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, fAdd(a, b), hF('−2 + (−5) = −7. Du gehst von −2 aus 5 Schritte nach links.'), { bild: weg(-10, 10, a, [b]) }); },
    () => { const a = -zz(2, 8), b = zz(3, 12), z = a + b;
      if (z > 10 || z === 0) return null;
      return antwort(Z(`Morgens sind es ${zt(a)} °C.`, `Bis mittags wird es ${b} Grad wärmer.`, 'Wie warm ist es mittags?'), z, 'd', fAdd(a, b),
        H(0, 'Wärmer heißt: Die Säule steigt. Du rechnest plus.', '−5 + 8 = 3. Mittags sind es 3 °C.', 'Zähle am Thermometer von der Säule aus nach oben.'), [`${zt(a)} + ${b} = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [a, 'morgens']) }); },
    () => { const a = -zz(2, 7), b = zz(2, 9), z = a + b;
      if (z === 0 || z > 10 || -a + b === z || a - b < -10) return null;
      return auswahl(Z('Schau auf die Zahlengerade.', 'Welche Rechnung passt zum Bild?'), [opt(`${zt(a)} + ${b} = ${zt(z)}`, true), opt(`${zt(a)} + (${zt(-b)}) = ${zt(z)}`, false, 'richtung-vertauscht'), opt(`${-a} + ${b} = ${zt(z)}`, false, 'vorzeichen-vergessen')],
        H(0, 'Der Bogen startet bei der ersten Zahl. Er geht nach rechts: Es wird eine positive Zahl addiert.', '−3 + 5 = 2: Start bei −3, 5 Schritte nach rechts, Ziel 2.', 'Lies den Start, die Richtung und das Ziel ab. Prüfe damit jede Rechnung.'), { bild: weg(-10, 10, a, [b]), nachweis: [AUSSAGEN] }); },
    () => { const a = -zz(1, 6), b = zz(1, 6), c = -zz(1, 5);
      if (a + b === 0 || b + c === 0) return null;
      return mauerR(MAUER, [a, b, c], [[1, 0], [1, 1], [2, 0]], H(0, 'Addiere zwei Steine, die nebeneinander liegen. Schreibe die Summe in den Stein darüber.', '−4 + 6 = 2. Über −4 und 6 steht 2.', 'Beginne unten links. Rechne erst die mittlere Reihe aus, dann den obersten Stein.'), { fehler: fMauer }); },
  ]);
  const hG = (n = 1) => H(n, 'Gleiche Vorzeichen: Abstände zur Null addieren. Verschiedene Vorzeichen: Abstände subtrahieren.', '(−35) + (+12) = −23. Der Abstand 35 ist größer, deshalb ist das Ergebnis negativ.', 'Bestimme zuerst das Vorzeichen. Es kommt von der Zahl mit dem größeren Abstand zur Null.');
  sechs(A1, 'G', [
    () => { const a = -5 * zz(3, 9), z = 5 * zz(1, 8), b = z - a, e = X('+', a, b);
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fAdd(a, b), hG(), { bild: weg(-50, 50, a, [b], { schritt: 5, beschriftung: 25 }) }); },
    () => { const a = -zz(12, 49), b = -zz(12, 49), e = X('+', a, b);
      return rechne(`Rechne: ${txt(e, P)}`, e, P, fAdd(a, b), H(1, 'Zwei negative Zahlen: Abstände zur Null addieren, das Minus bleibt.', '(−20) + (−15) = −35.', 'Addiere die Zahlen ohne Vorzeichen. Schreibe dann ein Minus davor.')); },
    () => { const a = -zz(11, 40), b = zz(11, 40), c = -zz(11, 30);
      if (a + b === 0) return null;
      return mauerR(MAUER, [a, b, c], [[0, 1], [1, 1], [2, 0]], H(1, 'Ein Stein unten fehlt. Überlege: Welche Zahl muss zum Nachbarstein addiert werden?', 'Unten steht −10, darüber 5. Der fehlende Stein ist 15, denn −10 + 15 = 5.', 'Suche zuerst den Stein, unter dem nur eine Zahl fehlt.'), { fehler: fMauer }); },
    () => { const s = zz(25, 70), e = zz(20, 95), z = e - s, name = kind();
      if (z === 0) return null;
      return antwort(Z(`${name} hat ${s} € Schulden auf dem Konto.`, `${name} zahlt ${e} € ein.`, 'Wie hoch ist der Kontostand jetzt?'), z, 'd', fAdd(-s, e),
        H(1, 'Schulden sind ein negativer Kontostand. Einzahlen heißt: plus rechnen.', '−40 + 60 = 20. Der Kontostand ist 20 €.', 'Schreibe die Schulden als negative Zahl. Addiere dann die Einzahlung.'), [`−${s} + ${e} = ${zt(z)}`], { einheit: '€' }); },
    () => { const a = -5 * zz(2, 8), z = 5 * zz(1, 8), b = z - a;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${zt(a)} + {{a}} = ${z}`), { a: lk(b, [[z + a, 'abstand-ueber-null'], [-b, 'richtung-vertauscht']]) },
        H(1, 'Zähle die Schritte vom Start bis zum Ziel. Zähle über die Null hinweg.', '−20 + 35 = 15, denn von −20 bis 15 sind es 35 Schritte nach rechts.', 'Gehe erst bis zur Null. Gehe dann weiter bis zum Ziel. Addiere beide Stücke.'), { bild: gerade(-50, 50, 5, 25, { start: a, spruenge: [{ von: a, nach: z, text: '?' }] }), nachweis: [{ art: 'luecken' }] }); },
    () => { const s = -zz(5, 30), a = zz(15, 60), b = s - a;
      return antwort(Z(`Die Summe von zwei Zahlen ist ${zt(s)}.`, `Die eine Zahl ist ${a}.`, 'Wie heißt die andere Zahl?'), b, 'd', [[s + a, 'richtung-vertauscht'], [-b, 'vorzeichen-vergessen'], [a - s, 'vorzeichen-vergessen']],
        H(1, 'Die andere Zahl muss negativ sein. Sie zieht die Summe unter die Null.', 'Summe −10, eine Zahl 25: Die andere Zahl ist −35, denn 25 + (−35) = −10.', 'Gehe von der bekannten Zahl bis zur Summe. So lang ist der Weg nach links.'), [`${zt(s)} − ${a} = ${zt(b)}`]); },
  ]);
  sechs(A1, 'M', [
    () => { const a = -zz(105, 240), b = zz(40, 95), c = -zz(25, 85), e = kette('+', a, b, c);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[a + b - c, 'vorzeichen-vergessen'], [-(a + b + c), 'vorzeichen-vergessen'], [-a + b - c, 'betraege-addiert']], H(2, 'Fasse zuerst die Zahlen mit gleichem Vorzeichen zusammen.', 'Addiere die beiden negativen Zahlen. Verrechne das Ergebnis dann mit der positiven Zahl.')); },
    () => { const b = -zz(15, 60), z = -zz(5, 40), a = z - b;
      if (a === 0) return null;
      return antwort(`Welche Zahl fehlt? ▢ + (${zt(b)}) = ${zt(z)}`, a, 'd', [[z + b, 'richtung-vertauscht'], [-a, 'vorzeichen-vergessen']], H(2, 'Löse mit der Umkehraufgabe.', 'Ziehe vom Ergebnis den bekannten Summanden ab. Achte auf Minus und Minus.'), [`${zt(z)} − (${zt(b)}) = ${zt(a)}`]); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt) => { const a = zn(11, 60), b = zn(11, 60), z = a + b, f = wahl([-z, Math.abs(a) + Math.abs(b), -(Math.abs(a) + Math.abs(b))]);
      if ((a > 0 && b > 0) || (!stimmt && f === z)) return null;
      return `${txt(X('+', a, b), P)} = ${zt(stimmt ? z : f)}`; }, 'betraege-addiert', H(2, 'Prüfe zuerst nur das Vorzeichen des Ergebnisses.', 'Bei verschiedenen Vorzeichen subtrahierst du die Beträge. Das Vorzeichen kommt von der Zahl mit dem größeren Betrag.')),
    () => { const a = -zz(260, 690), b = zz(120, 480), e = X('+', a, b);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, fAdd(a, b), H(2, 'Verschiedene Vorzeichen: Beträge subtrahieren.', 'Ziehe den kleineren Betrag vom größeren ab. Das Ergebnis bekommt das Vorzeichen der Zahl mit dem größeren Betrag.')); },
    () => { const u = [-zz(12, 40), zz(10, 35), -zz(15, 45), zz(5, 30)];
      if (u[0] + u[1] === 0 || u[1] + u[2] === 0 || u[2] + u[3] === 0) return null;
      return mauerR(MAUER, u, [[0, 2], [0, 3], [1, 0], [2, 0], [2, 1], [3, 0]], H(2, 'Fehlt unten ein Stein, hilft die Umkehraufgabe.', 'Rechne den Stein darüber minus den bekannten Nachbarstein.'), { fehler: fMauer }); },
    () => { const a = -zz(35, 140), z = -2 * a;
      return antwort(`Welche Zahl musst du zu ${zt(a)} addieren, damit die Gegenzahl von ${zt(a)} herauskommt?`, z, 'd', [[-a, 'sach-schritt-vergessen'], [-z, 'vorzeichen-vergessen'], [0, 'betrag-gegenzahl']],
        H(2, 'Die Gegenzahl liegt auf der anderen Seite der Null, gleich weit entfernt.', 'Bestimme die Gegenzahl. Gehe dann von der Zahl über die Null bis zur Gegenzahl.'), [`${-a} − (${zt(a)}) = ${z}`]); },
  ]);
  sechs(A1, 'E', [
    () => { const a = -zz(1150, 2900), b = zz(3100, 5200), c = -zz(450, 980), d = -zz(120, 390), e = kette('+', a, b, c, d);
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[-(a + b + c + d), 'vorzeichen-vergessen'], [-a + b - c - d, 'betraege-addiert'], [a + b - c - d, 'vorzeichen-vergessen']], H(3, 'Fasse erst alle negativen Zahlen zusammen. Verrechne dann mit der positiven Zahl.')); },
    () => { const a = -zz(125, 480), b = zz(60, 240), e = X('+', a, b), z = a + b, stimmt = wahl([true, false]);
      if (z >= 0) return null;
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, P, stimmt ? null : wahl([-(-a + b), -a + b]), 'betraege-addiert', H(3, 'Bei verschiedenen Vorzeichen werden die Beträge subtrahiert, nicht addiert.'), { andere: [-z, -(-a + b), -a + b] }); },
    () => { const a = -zz(210, 480), c = zz(105, 190), z = -zz(40, 160), b = z - a - c;
      if (b === 0) return null;
      return antwort(`Welche Zahl fehlt? (${zt(a)}) + ▢ + (+${c}) = ${zt(z)}`, b, 'd', [[z + a + c, 'richtung-vertauscht'], [-b, 'vorzeichen-vergessen'], [z - a, 'sach-schritt-vergessen']], H(3, 'Fasse die beiden bekannten Summanden zusammen. Löse dann mit der Umkehraufgabe.'), [`${zt(z)} − (${zt(a)}) − ${c} = ${zt(b)}`]); },
    () => { const m = -zz(12, 48), s = 3 * m;
      return antwort(`Die Summe von 3 aufeinanderfolgenden ganzen Zahlen ist ${zt(s)}. Wie heißt die kleinste der 3 Zahlen?`, m - 1, 'd', [[m, 'sach-schritt-vergessen'], [m + 1, 'negativ-groesser'], [-(m - 1), 'vorzeichen-vergessen']],
        H(3, 'Die mittlere Zahl ist ein Drittel der Summe. Bei negativen Zahlen liegt die kleinste am weitesten links.'), [`${zt(s)} : 3 − 1 = ${zt(m - 1)}`]); },
    () => { const u = [-zz(25, 80), zz(30, 95), -zz(40, 120), zz(15, 60)];
      if (u[0] + u[1] === 0 || u[1] + u[2] === 0 || u[2] + u[3] === 0) return null;
      return mauerR(MAUER, u, [[0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [2, 1]], H(3, 'Arbeite dich von oben links nach unten rechts vor. Jeder fehlende Stein ist eine Umkehraufgabe.'), { fehler: fMauer }); },
    () => auswahl('Welche Aussage stimmt immer?', [opt('Die Summe von zwei negativen Zahlen ist negativ.', true), opt('Die Summe einer positiven und einer negativen Zahl ist negativ.', false, 'betraege-addiert'), opt('Die Summe von zwei Zahlen ist größer als jede der beiden Zahlen.', false, 'mal-macht-groesser'),
      opt('Die Summe einer Zahl und ihrer Gegenzahl ist positiv.', false, 'betrag-gegenzahl'), opt('Die Summe von zwei ganzen Zahlen ist nie null.', false, 'betrag-gegenzahl')],
      H(3, 'Suche zu jeder Aussage ein Gegenbeispiel. Findest du keines, überlege an der Zahlengeraden, warum sie immer gilt.'), { nachweis: [FREI('Regeln zum Addieren ganzer Zahlen: Nur die Summe zweier negativer Zahlen ist immer negativ.')] }),
  ]);

  // ================= A2: Dezimalzahlen und Brüche (F: mehrere Sprünge) =================
  sechs(A2, 'F', [
    () => { const a = -zz(2, 6), b = zz(4, 9), c = -zz(2, 7), e = kette('+', a, b, c);
      if (a + b > 10 || a + b + c < -10 || a + b + c === a || a + b === 0) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e)}`), e, {}, [[a + b - c, 'richtung-vertauscht'], [-(a + b + c), 'vorzeichen-vergessen'], [a + b, 'sach-schritt-vergessen']],
        H(0, 'Gehe einen Sprung nach dem anderen.', '−4 + 7 + (−5): erst von −4 nach 3, dann von 3 nach −2.', 'Rechne erst die ersten beiden Zahlen. Rechne mit dem Ergebnis weiter.'), { bild: weg(-10, 10, a, [b, c]) }); },
    () => { const s = zz(3, 9), e = zz(4, 15), z = e - s, name = kind();
      if (z === 0 || z > 10) return null;
      return antwort(Z(`${name} hat ${s} € Schulden auf dem Konto.`, `Es kommen ${e} € dazu.`, 'Wie hoch ist der Kontostand jetzt?'), z, 'd', fAdd(-s, e),
        H(0, 'Schulden sind eine negative Zahl. Kommt Geld dazu, rechnest du plus.', '−5 + 8 = 3. Der Kontostand ist 3 €.', 'Starte an der Zahlengeraden bei den Schulden. Gehe so viele Schritte nach rechts, wie Euro dazukommen.'), [`−${s} + ${e} = ${zt(z)}`], { einheit: '€', bild: ZG({ start: -s }) }); },
    () => { const a = -zz(1, 4), b = zz(3, 9), z = a + b;
      if (z === 0) return null;
      return antwort(Z(`Ein Aufzug steht im Stockwerk ${zt(a)}.`, `Er fährt ${b} Stockwerke nach oben.`, 'In welchem Stockwerk hält er?'), z, 'd', fAdd(a, b),
        H(0, 'Nach oben heißt: plus rechnen. An der Zahlengeraden geht es nach rechts.', '−2 + 5 = 3. Der Aufzug hält im Stockwerk 3.', 'Starte beim Stockwerk mit dem Minus. Zähle über die Null hinweg nach rechts.'), [`${zt(a)} + ${b} = ${zt(z)}`], { bild: ZG({ start: a }) }); },
    () => { const a = -zz(3, 8), b = zz(5, 12), c = zz(2, 6), z = a + b - c;
      if (a + b > 10 || a + b <= 0 || z === a) return null;
      return antwort(Z(`Morgens sind es ${zt(a)} °C.`, `Bis mittags wird es ${b} Grad wärmer.`, `Bis abends wird es ${c} Grad kälter.`, 'Wie warm ist es abends?'), z, 'd', [[a + b + c, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [a + b, 'sach-schritt-vergessen']],
        H(0, 'Wärmer heißt plus, kälter heißt plus eine negative Zahl.', '−6 + 9 + (−4) = −1. Abends sind es −1 °C.', 'Rechne erst bis mittags. Rechne von dort aus weiter bis abends.'), [`${zt(a)} + ${b} + (${zt(-c)}) = ${zt(z)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [a, 'morgens']) }); },
    () => { const z = -zz(2, 6), a = -zz(7, 10), b = z - a, c = zz(1, 4), d = z - c, f1 = -a + b === z ? null : `${-a} + ${b} = ${zt(z)}`;
      const falsch = [f1 ?? `${zt(a)} + (${zt(-b)}) = ${zt(z)}`, `${c} + ${-d} = ${zt(z)}`];
      return auswahl(Z('Die Zahlengerade hilft dir.', 'Welche Rechnung stimmt?'), [opt(wahl([`${zt(a)} + ${b} = ${zt(z)}`, `${c} + (${zt(d)}) = ${zt(z)}`]), true), opt(falsch[0], false, 'vorzeichen-vergessen'), opt(falsch[1], false, 'vorzeichen-vergessen')],
        H(0, 'Prüfe jede Rechnung mit Sprüngen an der Zahlengeraden.', '−8 + 5 = −3: von −8 aus 5 Schritte nach rechts.', 'Starte bei der ersten Zahl. Gehe den Sprung und vergleiche mit dem Ergebnis.'), { bild: ZG(), nachweis: [AUSSAGEN] }); },
    () => { const a = -zz(3, 8), z = zz(1, 7), b = z - a;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${zt(a)} + {{a}} = ${z}`), { a: lk(b, [[z + a, 'abstand-ueber-null'], [-b, 'richtung-vertauscht']]) },
        H(0, 'Zähle die Schritte vom Start bis zum Ziel.', '−6 + 8 = 2, denn von −6 bis 2 sind es 8 Schritte nach rechts.', 'Zähle erst bis zur Null. Zähle dann weiter bis zum Ziel.'), { bild: ZG({ start: a, spruenge: [{ von: a, nach: z, text: '?' }] }), nachweis: [{ art: 'luecken' }] }); },
  ]);
  const hD = (n) => H(n, 'Dezimalzahlen addierst du wie ganze Zahlen: erst das Vorzeichen bestimmen, dann rechnen.', '(−2,5) + (+1,2) = −1,3. Der Abstand 2,5 ist größer, deshalb bleibt das Minus.', 'Vergleiche die Abstände zur Null. Ziehe den kleineren vom größeren ab.');
  sechs(A2, 'G', [
    () => { const a = -zz(12, 19), b = zz(3, 11), e = X('+', D(a), D(b));
      if (a % 10 === 0 || b % 10 === 0) return null;
      return rechne(Z('Schau auf die Zahlengerade.', `Rechne: ${txt(e, P)}`), e, P, fAdd(D(a), D(b)), hD(1), { bild: wegZ(a, [b]) }); },
    () => { const a = D(-zz(12, 48)), b = D(-zz(12, 48)), e = X('+', a, b);
      if (istGanz(a) || istGanz(b)) return null;
      return rechne(`Rechne: ${txt(e, P)}`, e, P, fAdd(a, b), H(1, 'Zwei negative Zahlen: Abstände zur Null addieren, das Minus bleibt.', '(−1,5) + (−2,2) = −3,7.', 'Addiere die Zahlen ohne Vorzeichen. Schreibe dann ein Minus davor.')); },
    () => { const u = [D(-zz(11, 35)), D(zz(6, 29)), D(-zz(4, 19))];
      if (u.some(istGanz) || gleich(plus(u[0], u[1]), 0)) return null;
      return mauerR(MAUER, u, [[1, 0], [1, 1], [2, 0]], H(1, 'Addiere zwei Steine, die nebeneinander liegen. Achte auf die Vorzeichen.', '−1,5 + 0,8 = −0,7.', 'Rechne erst die mittlere Reihe aus, dann den obersten Stein.')); },
    () => { const a = D(-zz(12, 68)), b = D(zz(15, 95)), z = plus(a, b), ort = wahl(['Oslo', 'Kiruna', 'Zermatt', 'Moskau']);
      if (istGanz(a) || istGanz(b) || z[0] === 0) return null;
      return antwort(Z(`In ${ort} sind es morgens ${dt(a)} °C.`, `Bis mittags steigt die Temperatur um ${dt(b)} Grad.`, 'Wie warm ist es mittags?'), z, 'd', fAdd(a, b),
        H(1, 'Steigt die Temperatur, rechnest du plus.', '−3,5 + 5 = 1,5. Mittags sind es 1,5 °C.', 'Gehe erst bis zur Null. Gehe dann den Rest des Anstiegs weiter.'), [`${dt(a)} + ${dt(b)} = ${dt(z)}`], { einheit: '°C' }); },
    () => { const a = -zz(8, 18), z = zz(2, 12), b = z - a;
      if (a % 10 === 0 || z % 10 === 0) return null;
      return luecken(Z('Schau auf die Zahlengerade.', 'Welche Zahl fehlt?', `${dt(D(a))} + {{a}} = ${dt(D(z))}`), { a: lkd(D(b), [[D(z + a), 'abstand-ueber-null'], [D(-b), 'richtung-vertauscht']]) },
        H(1, 'Zähle die Zehntel vom Start bis zum Ziel. Zähle über die Null hinweg.', '−0,6 + 1 = 0,4, denn von −0,6 bis 0,4 ist es genau 1.', 'Gehe erst bis zur Null. Gehe dann weiter bis zum Ziel. Addiere beide Stücke.'), { bild: gerade(-20, 20, 1, 10, { teiler: 10, start: a, spruenge: [{ von: a, nach: z, text: '?' }] }), nachweis: [{ art: 'luecken' }] }); },
    () => { const s = D(-zz(6, 35)), a = D(zz(12, 58)), b = minus(s, a);
      if (istGanz(s) || istGanz(a)) return null;
      return antwort(Z(`Die Summe von zwei Zahlen ist ${dt(s)}.`, `Die eine Zahl ist ${dt(a)}.`, 'Wie heißt die andere Zahl?'), b, 'd', [[plus(s, a), 'richtung-vertauscht'], [neg(b), 'vorzeichen-vergessen']],
        H(1, 'Die andere Zahl muss negativ sein. Sie zieht die Summe unter die Null.', 'Summe −1, eine Zahl 2,5: Die andere Zahl ist −3,5, denn 2,5 + (−3,5) = −1.', 'Gehe von der bekannten Zahl bis zur Summe. So lang ist der Weg nach links.'), [`${dt(s)} − ${dt(a)} = ${dt(b)}`]); },
  ]);
  const fBruch = (a, b) => [...fAdd(a, b), [Q(a[0] + b[0], a[1] + b[1]), 'bruch-add-zaehler-nenner']];
  sechs(A2, 'M', [
    () => { const a = D(-zz(105, 495), 2), b = D(zz(12, 38)), e = X('+', a, b);
      if (a[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, fAdd(a, b), H(2, 'Schreibe beide Zahlen mit zwei Nachkommastellen.', 'Verschiedene Vorzeichen: Ziehe den kleineren Betrag vom größeren ab. Das Vorzeichen kommt von der Zahl mit dem größeren Betrag.')); },
    () => { const N = wahl([5, 7, 9, 11, 13]), a = Q(-zz(1, N - 1), N), b = Q(-zz(1, N - 1), N), e = X('+', a, b);
      if (a[1] !== N || b[1] !== N || istGanz(val(e))) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fBruch(a, b), H(2, 'Gleichnamige Brüche: Der Nenner bleibt. Du rechnest nur mit den Zählern.', 'Beide Brüche sind negativ. Addiere die Zähler und behalte das Minus.')); },
    () => { const N = wahl([5, 7, 8, 9]), a = Q(-(N + zz(1, N - 1)), N), b = Q(zz(1, N - 1), N), e = X('+', a, b);
      if (a[1] !== N || b[1] !== N || istGanz(val(e))) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fBruch(a, b), H(2, 'Wandle die gemischte Zahl zuerst in einen Bruch um.', 'Rechne mit den Zählern. Der Nenner bleibt. Das Ergebnis bekommt das Vorzeichen der Zahl mit dem größeren Betrag.')); },
    () => { const a = D(-zz(15, 95), 2), b = D(zz(12, 38)), c = D(-zz(105, 195), 2), e = kette('+', a, b, c);
      if (a[1] !== 100) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[neg(val(e)), 'vorzeichen-vergessen'], [plus(plus(betrag(a), b), betrag(c)), 'betraege-addiert'], [plus(a, b), 'sach-schritt-vergessen']], H(2, 'Fasse zuerst die beiden negativen Zahlen zusammen.', 'Addiere die Beträge der negativen Zahlen. Verrechne dann mit der positiven Zahl.')); },
    () => { const b = D(-zz(105, 395), 2), z = D(-zz(6, 24)), a = minus(z, b);
      if (b[1] !== 100) return null;
      return antwort(`Welche Zahl fehlt? ▢ + (${dt(b)}) = ${dt(z)}`, a, 'd', [[plus(z, b), 'richtung-vertauscht'], [neg(a), 'vorzeichen-vergessen']], H(2, 'Löse mit der Umkehraufgabe.', 'Ziehe vom Ergebnis den bekannten Summanden ab. Minus und Minus wird Plus.'), [`${dt(z)} − (${dt(b)}) = ${dt(a)}`]); },
    () => aussagen('Welche Rechnungen stimmen? Kreuze alle an.', 4, (stimmt, i) => { const N = [5, 7, 9, 11][i], a = Q(zn(1, N - 1), N), b = Q(zn(1, N - 1), N), z = plus(a, b), f = wahl([neg(z), plus(betrag(a), betrag(b)), minus(a, b)]);
      if (istGanz(z) || (a[0] > 0 && b[0] > 0) || a[1] !== N || b[1] !== N || (!stimmt && (gleich(f, z) || istGanz(f)))) return null;
      return `${txt(X('+', a, b), PB)} = ${bt(stimmt ? z : f)}`; }, 'betraege-addiert', H(2, 'Der Nenner bleibt. Prüfe bei den Zählern zuerst das Vorzeichen.', 'Rechne jede Aufgabe mit den Zählern nach: gleiche Vorzeichen addieren, verschiedene Vorzeichen subtrahieren.')),
  ]);
  sechs(A2, 'E', [
    () => { const [n1, n2] = wahl([[3, 4], [2, 5], [4, 6], [3, 8], [5, 6], [2, 3], [4, 5]]), a = Q(-zz(1, n1 - 1), n1), b = Q(zz(1, n2 - 1), n2), e = X('+', a, b);
      if (a[1] !== n1 || b[1] !== n2 || val(e)[0] === 0) return null;
      return rechne(`Berechne: ${txt(e, PB)} Kürze vollständig.`, e, PB, fBruch(a, b), H(3, 'Mache die Brüche gleichnamig. Achte dann auf die Vorzeichen der Zähler.')); },
    () => { const [b, d] = wahl([[Q(-3, 4), null], [Q(-2, 5), null], [Q(-7, 8), null], [Q(-3, 5), null], [Q(-1, 4), null]]), x = wahl([D(5), D(25, 2), D(2), D(1), D(75, 2)]), z = plus(b, x);
      if (istGanz(z) || z[1] > 40) return null;
      return antwort(`Berechne: ${bt(b)} + ${dt(x)} Gib das Ergebnis als vollständig gekürzten Bruch an.`, z, 'b', fAdd(b, x), H(3, 'Wandle die Dezimalzahl in einen Bruch um. Mache dann gleichnamig.'), [`${bt(b)} + ${dt(x)} = ${bt(z)}`]); },
    () => { const [n1, n2] = wahl([[6, 3], [8, 4], [10, 5], [9, 3], [4, 2]]), a = Q(-wahl([1, 5, 7].filter((x) => x < n1)), n1), b = Q(1, n2), e = X('+', a, b), z = val(e), stimmt = wahl([true, false, false]);
      if (a[1] !== n1 || z[0] >= 0) return null;
      const f = Q(a[0] + b[0], a[1] + b[1]);
      return pruefe((beh) => `${kind()} rechnet: ${beh}. Stimmt das?`, e, PB, stimmt ? null : f, 'bruch-add-zaehler-nenner', H(3, 'Brüche darfst du erst addieren, wenn sie gleichnamig sind. Die Nenner werden nie addiert.'), { andere: [neg(z), f, plus(betrag(a), b)] }); },
    () => { const [n1, n2] = wahl([[2, 3], [4, 3], [2, 5], [4, 5]]), b = neg(plus(1, Q(1, n1))), z = Q(zz(1, n2 - 1), n2), a = minus(z, b);
      if (z[1] !== n2) return null;
      return antwort(`Welche Zahl fehlt? ▢ + (${bt(b)}) = ${bt(z)} Kürze vollständig und schreibe als gemischte Zahl.`, a, 'b', [[plus(z, b), 'richtung-vertauscht'], [neg(a), 'vorzeichen-vergessen']], H(3, 'Die Umkehraufgabe hilft: Ergebnis minus bekannter Summand. Minus und Minus wird Plus.'), [`${bt(z)} − (${bt(b)}) = ${bt(a)}`]); },
    () => { const a = D(-zz(1205, 2895), 2), b = D(zz(52, 98)), c = D(-zz(3125, 4875), 3), d = D(zz(105, 195), 2), e = kette('+', a, b, c, d);
      if (a[1] !== 100 || c[1] !== 1000 || istGanz(b)) return null;
      return rechne(`Berechne: ${txt(e, P)}`, e, P, [[neg(val(e)), 'vorzeichen-vergessen'], [plus(plus(betrag(a), b), plus(betrag(c), d)), 'betraege-addiert']], H(3, 'Fasse die negativen und die positiven Zahlen getrennt zusammen. Schreibe alle Zahlen mit gleich vielen Nachkommastellen.')); },
    () => { const s = D(-zz(8050, 19950), 2), g = D(zz(2505, 6995), 2), ab = D(zz(1205, 4995), 2), st = minus(plus(s, g), ab), z = neg(st);
      if ([s, g, ab].some((x) => x[1] !== 100 && x[1] !== 20 && x[1] !== 50) || st[0] >= 0) return null;
      return antwort(`Ein Konto hat den Stand ${dt(s, 2)} €. Es kommen ${dt(g, 2)} € dazu, dann gehen ${dt(ab, 2)} € ab. Wie viel Euro müssen danach eingezahlt werden, damit der Kontostand genau 0 € ist?`, z, 'd',
        [[st, 'vorzeichen-vergessen'], [neg(plus(s, g)), 'sach-schritt-vergessen'], [neg(plus(plus(s, g), ab)), 'richtung-vertauscht']], H(3, 'Berechne zuerst den neuen Kontostand. Gesucht ist dann seine Gegenzahl.'), [`${dt(s)} + ${dt(g)} − ${dt(ab)} = ${dt(st)}`, `0 − (${dt(st)}) = ${dt(z)}`], { einheit: '€', geld: true }); },
  ]);
}
