// Aufgaben zu 7.1.2 „Rationale Zahlen vergleichen und ordnen“ (Lernziele V1, V2) nach ADR 0015 und ADR 0043.
// V1: vergleichen. V2: ordnen, Abstand und Mitte zweier Zahlen.
// Grilling mit Nils (2026-11-24): F ganze Zahlen bis ±20 mit Bild, G bis ±100, eine Nachkommastelle und einfache Brüche (nur hier),
// M zwei Stellen und gleichnamige Brüche, E ungleichnamige Brüche, Fehlersuche, Rückwärtsaufgaben.
// Typische Fehler: −8 für größer halten als −3, den Abstand über die Null hinweg als Differenz der Beträge rechnen.

import { sechs, auswahl, luecken, ordnen, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, durch, neg, vgl, gleich, T, zt, dt, bt, ut, opt, zz, zn, wahl, mische, antwort, lkd, gerade, thermo, H, ZEICHEN, VGL, AUSSAGEN, ORDNUNG, kind, istDezimal, istGanz } from './7-1-rational.mjs';

const V1 = '7.1.2-V1', V2 = '7.1.2-V2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const ZEHNTEL = (extra) => gerade(-20, 20, 1, 10, { teiler: 10, ...extra });
// Vergleichen: Welches Zeichen passt zwischen zwei Zahlen (als Text)?
const vergleiche = (kopf, ta, tb, a, b, hilfen, extra = {}) => auswahl(kopf(`${ta} ▢ ${tb}`), ZEICHEN(vgl(a, b), 'negativ-groesser'), hilfen, { ...extra, nachweis: [VGL(ta, tb)] });
// Eine Aussage aus mehreren: Jede Antwort ist ein Vergleich.
const eine = (text, wahr, falsche, hilfen) => auswahl(text, [opt(wahr, true), ...falsche.map((t) => opt(t, false, 'negativ-groesser'))], hilfen, { nachweis: [AUSSAGEN] });
const zeichen = (a, b) => (vgl(a, b) < 0 ? '<' : vgl(a, b) > 0 ? '>' : '=');
const kehr = (z) => (z === '<' ? '>' : '<');
// Einsetzen: Welche Antworten machen die Kette wahr?
const einsetzen = (text, muster, optionen, hilfen, mehrfach) => auswahl(text, optionen.map(([t, r, fv]) => opt(t, r, r ? undefined : fv ?? 'negativ-groesser')), hilfen, { ...(mehrfach ? { mehrfach: true } : {}), nachweis: [{ art: 'einsetzen', muster }] });
const ordne = (karten, form, hilfen, extra = {}) => { const s = [...karten].sort((x, y) => vgl(x, y)), ab = extra.ab === true;
  if (s.some((x, i) => i > 0 && gleich(x, s[i - 1]))) return null;
  const t = (x) => (extra.text ? extra.text(x) : T(x, form));
  return ordnen(ab ? 'Ordne von der größten zur kleinsten Zahl.' : extra.kopf ?? 'Ordne von der kleinsten zur größten Zahl.', (ab ? s.reverse() : s).map(t), hilfen, { umgekehrt: 'negativ-groesser', nachweis: [ORDNUNG(ab)], ...(extra.bild ? { bild: extra.bild } : {}) }); };

export function vergleichen() {
  // ================= V1: vergleichen =================
  const hV = (n) => H(n, 'Die kleinere Zahl liegt auf der Zahlengeraden weiter links.', '−8 liegt links von −3. Also gilt −8 < −3.', 'Suche beide Zahlen auf der Zahlengeraden. Die linke Zahl ist die kleinere.');
  const hSpitze = 'Die Spitze des Zeichens zeigt immer zur kleineren Zahl.';
  sechs(V1, 'F', [
    () => { const a = -zz(1, 9), b = -zz(1, 9);
      if (a === b) return null;
      return vergleiche((t) => Z('Schau auf die Punkte an der Zahlengeraden.', `Welches Zeichen passt? ${t}`), zt(a), zt(b), a, b, hV(0), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const a = -zz(5, 9), b = zz(1, 4), [x, y] = mische([a, b]);
      return vergleiche((t) => Z('Schau auf die Punkte an der Zahlengeraden.', `Welches Zeichen passt? ${t}`), zt(x), zt(y), x, y, H(0, 'Jede negative Zahl ist kleiner als jede positive Zahl.', '−9 < 2, denn −9 liegt links von 2.', 'Schau auf die Zahlengerade. Welche Zahl liegt weiter links?'), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const ws = mische([-zz(6, 9), -zz(1, 4), zz(1, 9)]);
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Welche Zahl ist am kleinsten?'), ws.map((w) => opt(zt(w), w === Math.min(...ws), w === Math.min(...ws) ? undefined : 'negativ-groesser')), hV(0), { bild: ZG({ punkte: ws }), nachweis: [{ art: 'extrem', was: 'kleinstes' }] }); },
    () => { const a = -zz(1, 9), b = -zz(1, 9), [o1, o2] = mische(['Oslo', 'Kiruna', 'Zermatt', 'Moskau']);
      if (Math.abs(a - b) < 2) return null;
      return auswahl(Z('Die Thermometer zeigen die Temperatur in zwei Orten.', 'Wo ist es kälter?'), [opt(o1, a < b, a < b ? undefined : 'negativ-groesser'), opt(o2, b < a, b < a ? undefined : 'negativ-groesser')],
        H(0, 'Je weiter unten die Säule steht, desto kälter ist es.', '−8 °C ist kälter als −2 °C.', 'Vergleiche die Höhe der beiden Säulen.'), { bild: thermo(-10, 10, 1, 5, [a, o1], [b, o2]), nachweis: [{ art: 'thermowahl', was: 'kaeltestes' }] }); },
    () => { const g = -zz(3, 7), gut = zz(g + 1, -1), a = zz(-10, g - 2), b = g - 1;
      return { ...eine(Z('Schau auf die Zahlengerade.', 'Welche Aussage stimmt?'), `${zt(gut)} > ${zt(g)}`, [`${zt(a)} > ${zt(g)}`, `${zt(b)} > ${zt(g)}`], hV(0)), bild: ZG({ punkte: [g] }) }; },
    () => { const a = -zz(1, 9), [x, y] = mische([a, 0]);
      return vergleiche((t) => Z('Schau auf die Zahlengerade.', `Welches Zeichen passt? ${t}`), zt(x), zt(y), x, y, H(0, 'Jede negative Zahl ist kleiner als null.', '−4 < 0, denn −4 liegt links von der Null.', 'Suche die Zahl auf der Zahlengeraden. Liegt sie links oder rechts von der Null?'), { bild: ZG({ punkte: [a] }) }); },
  ]);
  sechs(V1, 'G', [
    () => { const a = -zz(11, 99), b = -zz(11, 99);
      if (a === b) return null;
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, zt(a), zt(b), a, b, hV(1)); },
    () => { const a = -zz(1, 19), b = -zz(1, 19);
      if (a === b || a % 10 === 0 || b % 10 === 0) return null;
      return vergleiche((t) => Z('Schau auf die Punkte an der Zahlengeraden.', `Welches Zeichen passt? ${t}`), dt(D(a)), dt(D(b)), D(a), D(b), hV(1), { bild: ZEHNTEL({ punkte: [a, b] }) }); },
    () => { const zs = mische([-zz(12, 18), -zz(2, 8), -zz(9, 11)]), gr = Math.max(...zs);
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Welche Zahl ist am größten?'), zs.map((w) => opt(dt(D(w)), w === gr, w === gr ? undefined : 'negativ-groesser')), hV(1), { bild: ZEHNTEL({ punkte: zs }), nachweis: [{ art: 'extrem', was: 'groesstes' }] }); },
    () => { const N = wahl([4, 5, 8]), a = -zz(1, N - 1), b = -zz(1, N - 1);
      if (a === b || Q(a, N)[1] !== N || Q(b, N)[1] !== N) return null;
      return vergleiche((t) => Z('Schau auf die Punkte an der Zahlengeraden.', `Welches Zeichen passt? ${t}`), bt(Q(a, N)), bt(Q(b, N)), Q(a, N), Q(b, N), H(1, 'Bei gleichem Nenner entscheidet der Zähler. Bei negativen Brüchen dreht sich das Zeichen um.', `−3⁄4 liegt links von −1⁄4. Also gilt −3⁄4 < −1⁄4.`, 'Suche beide Brüche auf der Zahlengeraden. Der linke Bruch ist der kleinere.'), { bild: gerade(-N, N, 1, N, { teiler: N, punkte: [a, b] }) }); },
    () => { const g = D(-zz(21, 79)), gut = plus(g, D(zz(2, 15))), a = minus(g, D(zz(2, 9))), b = neg(gut);
      return eine('Welche Aussage stimmt?', `${dt(gut)} > ${dt(g)}`, [`${dt(a)} > ${dt(g)}`, `${dt(g)} > ${dt(b)}`], hV(1)); },
    () => { const u = -zz(4, 9), o = u + 2, gut = D(10 * u + zz(11, 19)), zuKlein = D(10 * u - zz(1, 8)), zuGross = D(10 * o + zz(1, 8));
      return einsetzen(Z('Welche Zahl passt in das Kästchen?', `${zt(u)} < ▢ < ${zt(o)}`), `${zt(u)} < ▢ < ${zt(o)}`, mische([[dt(gut), true], [dt(zuKlein), false], [dt(zuGross), false]]),
        H(1, 'Die gesuchte Zahl liegt auf der Zahlengeraden zwischen den beiden Zahlen.', 'Zwischen −5 und −3 liegt zum Beispiel −4,2.', 'Prüfe jede Antwort: Liegt sie rechts von der ersten und links von der zweiten Zahl?')); },
  ]);
  sechs(V1, 'M', [
    () => { const g = zz(0, 4), a = D(-(100 * g + zz(11, 49)), 2), b = D(-(10 * g + zz(2, 6)));
      if (gleich(a, b) || a[1] !== 100) return null;
      const [x, y] = mische([a, b]);
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, dt(x), dt(y), x, y, H(2, 'Vergleiche zuerst ohne Vorzeichen, Stelle für Stelle. Bei zwei negativen Zahlen dreht sich das Zeichen um.', 'Schreibe beide Zahlen mit gleich vielen Nachkommastellen. Die Zahl, die weiter von der Null entfernt ist, ist die kleinere.')); },
    () => { const [b, d] = wahl([[Q(-1, 2), D(-5)], [Q(-1, 4), D(-25, 2)], [Q(-3, 4), D(-75, 2)], [Q(-1, 5), D(-2)], [Q(-2, 5), D(-4)], [Q(-3, 5), D(-6)]]), x = plus(d, D(wahl([-5, -3, 3, 5, 7]), 2));
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, bt(b), dt(x), b, x, H(2, 'Wandle den Bruch in eine Dezimalzahl um. Vergleiche dann.', 'Schreibe den Bruch mit dem Nenner 100. Bei zwei negativen Zahlen ist die Zahl mit dem größeren Betrag die kleinere.')); },
    () => { const a = D(-zz(11, 99), 2), b = D(-zz(11, 99), 2), c = D(-zz(12, 98)), roh = [];
      for (const [x, y] of [[a, b], [c, a], [neg(b), c], [Q(0), a]]) { if (gleich(x, y)) return null; const z = zeichen(x, y), stimmt = wahl([true, false]); roh.push([`${dt(x)} ${stimmt ? z : kehr(z)} ${dt(y)}`, stimmt]); }
      if (!roh.some(([, r]) => r) || roh.every(([, r]) => r)) return null;
      return auswahl('Welche Aussagen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'negativ-groesser')), H(2, 'Die kleinere Zahl liegt auf der Zahlengeraden links.', 'Prüfe jede Aussage einzeln. Achte besonders auf zwei negative Zahlen.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
    () => { const N = wahl([5, 7, 8, 9, 10]), a = Q(-zz(1, N - 1), N), b = Q(-zz(1, N - 1), N);
      if (gleich(a, b) || a[1] !== N || b[1] !== N) return null;
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, bt(a), bt(b), a, b, H(2, 'Bei gleichem Nenner entscheidet der Zähler. Bei negativen Brüchen dreht sich das Zeichen um.', 'Vergleiche erst die Brüche ohne Vorzeichen. Der Bruch mit dem größeren Betrag ist hier der kleinere.')); },
    () => { const u = D(-zz(12, 28)), o = plus(u, D(zz(3, 6))), mitte = plus(u, D(zz(11, 29), 2));
      if (vgl(mitte, o) >= 0) return null;
      const m = `${dt(u)} < ▢ < ${dt(o)}`;
      return einsetzen(`Welche Zahlen passen in das Kästchen? ${m} Kreuze alle an.`, m, mische([[dt(mitte), true], [dt(minus(u, D(5, 2))), false], [dt(plus(o, D(5, 2))), false], [dt(minus(o, D(1, 2))), true]]),
        H(2, 'Die Zahl muss rechts von der ersten und links von der zweiten Zahl liegen.', 'Schreibe alle Zahlen mit zwei Nachkommastellen. Prüfe dann jede Antwort einzeln.'), true); },
    () => { const a = zz(3, 9), b = zz(2, a - 1), c = zz(2, 9);
      const roh = mische([[`|${zt(-a)}| > ${b}`, true], [`${zt(-a)} > ${zt(-b)}`, false], [`|${zt(-b)}| < |${zt(-a)}|`, true], [`${zt(-c)} < ${zt(-c - 1)}`, false], [`|${zt(-c)}| = ${c}`, true]]).slice(0, 4);
      if (!roh.some(([, r]) => r) || roh.every(([, r]) => r)) return null;
      return auswahl('Welche Aussagen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'negativ-groesser')), H(2, 'Berechne zuerst die Beträge. Vergleiche dann.', 'Ein Betrag ist nie negativ. Ersetze jeden Betrag durch seine Zahl und prüfe die Aussage.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
  ]);
  sechs(V1, 'E', [
    () => { const [n1, n2] = wahl([[3, 4], [4, 5], [5, 6], [3, 5], [4, 7], [6, 7], [5, 8]]), a = Q(-zz(1, n1 - 1), n1), b = Q(-zz(1, n2 - 1), n2);
      if (gleich(a, b) || a[1] !== n1 || b[1] !== n2) return null;
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, bt(a), bt(b), a, b, H(3, 'Mache die Brüche gleichnamig. Bei zwei negativen Brüchen ist der mit dem größeren Betrag der kleinere.')); },
    () => { const m = `−${bt(Q(3, 4))} < ▢ < −${bt(Q(1, 2))}`, gut = wahl([[bt(Q(-5, 8)), true], [bt(Q(-2, 3)), true], [bt(Q(-3, 5)), true]]), dez = D(-zz(51, 74), 2);
      return einsetzen(`Welche Zahlen passen in das Kästchen? ${m} Kreuze alle an.`, m, mische([gut, [dt(dez), true], [bt(Q(-wahl([2, 3]), 7)), false], [dt(D(-zz(76, 95), 2)), false], [bt(Q(-4, 5)), false]]),
        H(3, 'Wandle alle Zahlen in Dezimalzahlen um oder mache die Brüche gleichnamig.'), true); },
    () => { const g = zz(1, 4), [b, d] = wahl([[Q(4, 9), 44], [Q(2, 3), 67], [Q(5, 6), 83], [Q(3, 7), 43], [Q(5, 9), 56]]), x = neg(plus(Q(g), b)), y = D(-(100 * g + d + wahl([-1, 0, 1])), 2);
      return vergleiche((t) => `Welches Zeichen passt? ${t}`, bt(x), dt(y), x, y, H(3, 'Die Zahl vor dem Komma ist gleich. Vergleiche den Bruch mit den Nachkommastellen, zum Beispiel durch Erweitern.')); },
    () => { const g = zz(1, 8), z = zz(2, 7), h = zz(1, 8), m = `−${g},▢${h} > −${g},${z}${h}`, ziffern = mische([...Array(10).keys()]).slice(0, 5);
      if (!ziffern.some((d) => d < z) || ziffern.every((d) => d < z)) return null;
      return einsetzen(`Welche Ziffern können im Kästchen stehen? ${m} Kreuze alle an.`, m, ziffern.sort((x, y) => x - y).map((d) => [String(d), d < z]), H(3, 'Bei negativen Zahlen ist die Zahl größer, die näher an der Null liegt.'), true); },
    () => { const a = Q(-zz(1, 5), 6), b = D(-zz(11, 89), 2), c = Q(-zz(1, 3), 4), roh = [];
      for (const [x, tx, y, ty] of [[a, bt(a), b, dt(b)], [c, bt(c), b, dt(b)], [a, bt(a), c, bt(c)], [neg(b), dt(neg(b)), a, bt(a)]]) { if (gleich(x, y)) return null; const z = zeichen(x, y), stimmt = wahl([true, false]); roh.push([`${tx} ${stimmt ? z : kehr(z)} ${ty}`, stimmt]); }
      if (!roh.some(([, r]) => r) || roh.every(([, r]) => r)) return null;
      return auswahl('Welche Aussagen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'negativ-groesser')), H(3, 'Wandle Brüche in Dezimalzahlen um, bevor du vergleichst.'), { mehrfach: true, nachweis: [AUSSAGEN] }); },
    () => { const u = D(-zz(21, 95)), o = D(zz(11, 75)), anzahl = Math.floor(o[0] / o[1]) - Math.ceil(u[0] / u[1]) + 1;
      if (istGanz(u) || istGanz(o)) return null;
      return antwort(`Wie viele ganze Zahlen liegen zwischen ${dt(u)} und ${dt(o)}?`, anzahl, 'd', [[anzahl - 1, 'sach-schritt-vergessen'], [anzahl + 1, 'abstand-ueber-null'], [Math.floor(o[0] / o[1]) - Math.floor(-u[0] / u[1]), 'abstand-ueber-null']],
        H(3, 'Finde die kleinste und die größte ganze Zahl dazwischen. Vergiss die Null nicht.'), [{ art: 'zaehle', von: dt(u), bis: dt(o) }]); },
  ]);

  // ================= V2: ordnen, Abstand, Mitte =================
  const hO = (n) => H(n, 'Ganz links stehen die negativen Zahlen, die weit von der Null entfernt sind.', '−8, −3, 0, 5 ist richtig geordnet.', 'Ordne erst die negativen Zahlen: Die Zahl mit dem größten Abstand zur Null ist die kleinste. Dann folgen die positiven.');
  const hA = (n) => H(n, 'Zähle die Schritte von der einen Zahl zur anderen. Zähle über die Null hinweg.', 'Von −3 bis 4 sind es 3 Schritte bis zur Null und dann noch 4. Das sind 7.', 'Zähle erst bis zur Null. Zähle dann weiter bis zur zweiten Zahl.');
  const abstand = (text, a, b, form, hilfen, extra = {}) => { const d = minus(b, a), ta = T(a, form), tb = T(b, form);
    return antwort(text, d, form, [[minus(Q(Math.abs(b[0]), b[1]), Q(Math.abs(a[0]), a[1])), 'abstand-ueber-null'], [plus(Q(Math.abs(b[0]), b[1]), Q(Math.abs(a[0]), a[1])), 'betraege-addiert'], [neg(d), 'vorzeichen-vergessen']], hilfen, [`${tb} − ${a[0] < 0 ? `(${ta})` : ta} = ${T(d, form)}`], extra); };
  const mitte = (text, a, b, form, hilfen, extra = {}) => { const m = durch(plus(a, b), 2), ta = T(a, form), tb = T(b, form);
    if (form === 'd' && !istDezimal(m)) return null;
    return antwort(text, m, form, [[durch(minus(b, a), 2), 'abstand-ueber-null'], [neg(m), 'vorzeichen-vergessen'], [plus(a, b), 'sach-schritt-vergessen']], hilfen, [`(${ta} + ${b[0] < 0 ? `(${tb})` : tb}) : 2 = ${T(m, form)}`], extra); };
  sechs(V2, 'F', [
    () => { const ws = [-zz(6, 9), -zz(1, 4), zz(1, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { bild: ZG({ punkte: ws }) }); },
    () => { const a = -zz(1, 6), b = zz(1, 6);
      return abstand(Z(`Die Punkte liegen bei ${zt(a)} und ${b}.`, 'Wie viele Schritte liegen zwischen den beiden Zahlen?'), Q(a), Q(b), 'd', hA(0), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const ws = [-zz(7, 10), -zz(4, 6), -zz(1, 3), zz(2, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { bild: ZG({ punkte: ws }) }); },
    () => { const a = -zz(6, 9), b = -zz(1, 4);
      return abstand(Z(`Die Punkte liegen bei ${zt(a)} und ${zt(b)}.`, 'Wie viele Schritte liegen zwischen den beiden Zahlen?'), Q(a), Q(b), 'd', H(0, 'Zähle die Schritte von der einen Zahl zur anderen.', 'Von −7 bis −2 sind es 5 Schritte.', 'Starte bei der linken Zahl. Zähle die Schritte bis zur rechten Zahl.'), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const a = -zz(2, 8), b = zz(2, 8);
      return abstand(Z('Die Thermometer zeigen zwei Temperaturen.', 'Wie viel Grad liegen dazwischen?'), Q(a), Q(b), 'd', H(0, 'Zähle die Grade von der unteren Säule bis zur oberen. Zähle über die Null hinweg.', 'Von −2 °C bis 3 °C sind es 5 Grad.', 'Zähle erst bis zur Null. Zähle dann weiter nach oben.'), { bild: thermo(-10, 10, 1, 5, [a, 'morgens'], [b, 'mittags']) }); },
    () => { const ws = [-zz(6, 9), -zz(1, 5), zz(1, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', H(0, 'Die tiefste Temperatur steht am Thermometer ganz unten.', '−8 °C ist kälter als −3 °C.', 'Suche zuerst die kälteste Temperatur. Sie hat die niedrigste Säule.'), { kopf: 'Ordne von der kleinsten zur größten Temperatur.', text: (x) => `${zt(x[0])} °C`, bild: thermo(-10, 10, 1, 5, ...mische(ws).map((w, i) => [w, ['Mo', 'Di', 'Mi'][i]])) }); },
  ]);
  sechs(V2, 'G', [
    () => ordne([-zz(60, 99), -zz(30, 59), -zz(1, 29), zz(1, 40), zz(41, 99)].map((w) => Q(w)), 'd', hO(1)),
    () => { const ws = [-zz(11, 19), -zz(5, 9), -zz(1, 4), zz(2, 18)];
      return ordne(ws.map((w) => D(w)), 'd', hO(1), { bild: ZEHNTEL({ punkte: ws }) }); },
    () => { const a = -zz(2, 9), b = a + 2 * zz(2, 5);
      if (b > 10 || b === 0) return null;
      return mitte(Z(`Die Punkte liegen bei ${zt(a)} und ${zt(b)}.`, 'Welche Zahl liegt genau in der Mitte?'), Q(a), Q(b), 'd', H(1, 'Die Mitte ist von beiden Zahlen gleich weit entfernt.', 'Zwischen −6 und 2 liegen 8 Schritte. Die Mitte ist 4 Schritte von jeder Zahl entfernt: −2.', 'Zähle die Schritte zwischen den Zahlen. Gehe die Hälfte davon von der linken Zahl nach rechts.'), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const a = -zz(11, 60), b = zz(11, 39);
      return abstand(`Wie groß ist der Abstand zwischen ${zt(a)} und ${b}?`, Q(a), Q(b), 'd', hA(1)); },
    () => { const a = -zz(3, 18), b = zz(2, 17);
      return abstand(Z(`Die Punkte liegen bei ${dt(D(a))} und ${dt(D(b))}.`, 'Wie groß ist der Abstand zwischen den beiden Zahlen?'), D(a), D(b), 'd', hA(1), { bild: ZEHNTEL({ punkte: [a, b] }) }); },
    () => { const a = -zz(5, 9), m = a + zz(2, 6), b = 2 * m - a;
      if (b > 10 || m === 0) return null;
      return antwort(Z(`Der Punkt ${zt(m)} liegt genau in der Mitte zwischen zwei Zahlen.`, `Die eine Zahl ist ${zt(a)}.`, 'Wie heißt die andere Zahl?'), b, 'd', [[a - (m - a), 'richtung-vertauscht'], [m - a, 'sach-schritt-vergessen'], [-b, 'vorzeichen-vergessen']],
        H(1, 'Die Mitte ist von beiden Zahlen gleich weit entfernt.', 'Die Mitte ist −2, eine Zahl ist −6. Das sind 4 Schritte. Die andere Zahl ist 2.', 'Zähle die Schritte von der bekannten Zahl bis zur Mitte. Gehe von der Mitte genauso weit nach rechts.'), [`2 · (${zt(m)}) − (${zt(a)}) = ${zt(b)}`], { bild: ZG({ punkte: [a, m] }) }); },
  ]);
  sechs(V2, 'M', [
    () => ordne([D(-zz(110, 199), 2), D(-zz(11, 99), 2), D(-zz(2, 9)), D(zz(1, 9), 2), D(zz(11, 99), 2)], 'd', H(2, 'Ordne zuerst die negativen Zahlen. Je größer der Betrag, desto kleiner die Zahl.', 'Schreibe alle Zahlen mit zwei Nachkommastellen. Beginne mit der Zahl, die am weitesten links liegt.')),
    () => { const ws = mische([[Q(-1, 2), 'b'], [Q(-3, 4), 'b'], [D(-zz(55, 70), 2), 'd'], [D(-zz(2, 4)), 'd'], [Q(1, 4), 'b'], [D(zz(3, 9)), 'd'], [Q(-1, 4), 'b']]).slice(0, 4), form = new Map(ws.map(([x, f]) => [String(x), f]));
      return ordne(ws.map(([x]) => x), 'd', H(2, 'Wandle die Brüche in Dezimalzahlen um. Ordne dann.', 'Schreibe jede Zahl als Dezimalzahl mit zwei Nachkommastellen und vergleiche.'), { kopf: 'Ordne die Brüche und Dezimalzahlen von der kleinsten zur größten Zahl.', text: (x) => T(x, form.get(String(x))) }); },
    () => { const a = D(-zz(12, 48)), b = plus(a, D(2 * zz(6, 30)));
      return mitte(`Welche Zahl liegt genau in der Mitte zwischen ${dt(a)} und ${dt(b)}?`, a, b, 'd', H(2, 'Die Mitte ist von beiden Zahlen gleich weit entfernt.', 'Addiere beide Zahlen und teile die Summe durch 2.')); },
    () => { const a = D(-zz(105, 495), 2), b = D(zz(11, 49));
      return abstand(`Wie groß ist der Abstand zwischen ${dt(a)} und ${dt(b)}?`, a, b, 'd', H(2, 'Zähle über die Null hinweg: erst bis zur Null, dann weiter.', 'Addiere die Abstände der beiden Zahlen zur Null.')); },
    () => { const N = wahl([5, 7, 8, 9]), a = Q(-zz(1, N - 1), N), b = Q(zz(1, N - 1), N);
      if (a[1] !== N || b[1] !== N) return null;
      return abstand(`Wie groß ist der Abstand zwischen ${bt(a)} und ${bt(b)}? Kürze vollständig.`, a, b, 'b', H(2, 'Zähle über die Null hinweg: erst bis zur Null, dann weiter.', 'Addiere die Abstände der beiden Brüche zur Null. Der Nenner bleibt.')); },
    () => { const d = 2 * zz(2, 9) + 1, m = D(-zz(5, 35)), kl = minus(m, durch(Q(d), 2));
      return antwort(`Zwei Zahlen haben den Abstand ${d}. Genau in ihrer Mitte liegt ${dt(m)}. Wie heißt die kleinere der beiden Zahlen?`, kl, 'd', [[plus(m, durch(Q(d), 2)), 'richtung-vertauscht'], [minus(m, Q(d)), 'sach-schritt-vergessen']],
        H(2, 'Von der Mitte aus ist es zu jeder der beiden Zahlen der halbe Abstand.', 'Halbiere den Abstand. Gehe von der Mitte so weit nach links.'), [`${dt(m)} − ${d} : 2 = ${dt(kl)}`]); },
  ]);
  sechs(V2, 'E', [
    () => { const ws = mische([[Q(-2, 3), 'b'], [Q(-3, 4), 'b'], [Q(-5, 6), 'b'], [D(-zz(68, 73), 2), 'd'], [Q(-3, 5), 'b'], [D(-zz(77, 82), 2), 'd'], [Q(-7, 8), 'b']]).slice(0, 5), form = new Map(ws.map(([x, f]) => [String(x), f]));
      return ordne(ws.map(([x]) => x), 'd', H(3, 'Mache die Brüche gleichnamig oder wandle alles in Dezimalzahlen um.'), { ab: true, text: (x) => T(x, form.get(String(x))) }); },
    () => { const [n1, n2] = wahl([[4, 2], [3, 6], [8, 4], [5, 10], [3, 4]]), a = Q(-zz(1, n1 - 1), n1), b = Q(zz(1, n2 - 1), n2);
      return mitte(`Welche Zahl liegt genau in der Mitte zwischen ${bt(a)} und ${bt(b)}? Kürze vollständig.`, a, b, 'b', H(3, 'Addiere beide Brüche und halbiere die Summe.')); },
    () => { const [n1, n2] = wahl([[3, 4], [2, 5], [4, 6], [3, 8], [5, 6]]), a = Q(-zz(1, n1 - 1), n1), b = Q(zz(1, n2 - 1), n2);
      return abstand(`Wie groß ist der Abstand zwischen ${bt(a)} und ${bt(b)}? Kürze vollständig.`, a, b, 'b', H(3, 'Über die Null hinweg addieren sich die Beträge. Mache die Brüche zuerst gleichnamig.')); },
    () => { const m = D(-zz(12, 48)), a = minus(m, D(zz(15, 60))), b = minus(plus(m, m), a);
      return antwort(`Die Zahl ${dt(m)} liegt genau in der Mitte zwischen ${dt(a)} und einer zweiten Zahl. Wie heißt die zweite Zahl?`, b, 'd', [[minus(a, minus(m, a)), 'richtung-vertauscht'], [minus(m, a), 'sach-schritt-vergessen'], [neg(b), 'vorzeichen-vergessen']],
        H(3, 'Die zweite Zahl ist von der Mitte genauso weit entfernt wie die erste, nur auf der anderen Seite.'), [`2 · (${dt(m)}) − (${dt(a)}) = ${dt(b)}`]); },
    () => { const tief = -zz(110, 430), hoch = zz(1200, 4800), [ort, berg] = wahl([['Das Ufer des Toten Meeres', 'ein Berggipfel'], ['Der Boden einer Senke', 'eine Bergstation'], ['Ein Salzsee', 'ein Pass']]);
      return antwort(`${ort} liegt bei ${zt(tief)} m, ${berg} bei ${hoch} m. Wie groß ist der Höhenunterschied?`, hoch - tief, 'd', [[hoch + tief, 'abstand-ueber-null'], [tief - hoch, 'vorzeichen-vergessen']],
        H(3, 'Der Höhenunterschied geht über die Höhe 0 hinweg.'), [`${hoch} − (${zt(tief)}) = ${hoch - tief}`], { einheit: 'm' }); },
    () => { const m = D(-zz(5, 35)), d = D(zz(125, 475), 2);
      if (d[1] !== 100) return null;
      return luecken(`Zwei Zahlen haben von ${dt(m)} den Abstand ${dt(d)}. Die kleinere Zahl ist {{a}}, die größere Zahl ist {{b}}.`, { a: lkd(minus(m, d), [[minus(neg(m), d), 'vorzeichen-vergessen'], [plus(m, d), 'richtung-vertauscht']]), b: lkd(plus(m, d), [[minus(m, d), 'richtung-vertauscht'], [plus(neg(m), d), 'vorzeichen-vergessen']]) },
        H(3, 'Gehe von der Zahl aus einmal nach links und einmal nach rechts.'), { nachweis: [`${dt(m)} − ${dt(d)} = ${dt(minus(m, d))}`, `${dt(m)} + ${dt(d)} = ${dt(plus(m, d))}`] }); },
  ]);
}
