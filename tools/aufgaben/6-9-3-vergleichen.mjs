// Aufgaben zu 6.9.3 „Rationale Zahlen vergleichen und ordnen“ (Lernziele V1, V2) nach ADR 0015 und ADR 0059.
// V1: vergleichen. V2: ordnen und Zahlen angeben, die dazwischen liegen (T09-M-03).
// Grilling mit Nils (2026-11-28): F ganze Zahlen bis ±20 mit Bild, G bis ±100, eine Nachkommastelle und Halbe,
// M zwei Nachkommastellen und die Nenner 2, 4, 5 und 10, E andere Nenner, Fehlersuche, Aussagen prüfen (T09-E-03).
// Typische Fehler: −7 > −4, weil 7 > 4; −0,5 < −0,75, weil 75 mehr Ziffern hat; Rangfolge falsch herum.

import { sechs, auswahl, ordnen, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, vgl, gleich, T, zt, dt, bt, opt, zz, wahl, mische, antwort, gerade, thermo, H, ZEICHEN, VGL, AUSSAGEN, ORDNUNG, kind, istGanz } from './7-1-rational.mjs';

const V1 = '6.9.3-V1', V2 = '6.9.3-V2';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const ZEHNTEL = (extra) => gerade(-20, 20, 1, 10, { teiler: 10, ...extra });
const vergleiche = (kopf, ta, tb, a, b, hilfen, extra = {}) => auswahl(kopf(`${ta} ▢ ${tb}`), ZEICHEN(vgl(a, b), extra.fv ?? 'negativ-groesser'), hilfen, { ...(extra.bild ? { bild: extra.bild } : {}), nachweis: [VGL(ta, tb)] });
const zeichen = (a, b) => (vgl(a, b) < 0 ? '<' : vgl(a, b) > 0 ? '>' : '=');
const kehr = (z) => (z === '<' ? '>' : '<');
const einsetzen = (text, muster, optionen, hilfen, mehrfach) => auswahl(text, optionen.map(([t, r, fv]) => opt(t, r, r ? undefined : fv ?? 'negativ-groesser')), hilfen, { ...(mehrfach ? { mehrfach: true } : {}), nachweis: [{ art: 'einsetzen', muster }] });
const ordne = (karten, form, hilfen, extra = {}) => { const s = [...karten].sort((x, y) => vgl(x, y)), ab = extra.ab === true;
  if (s.some((x, i) => i > 0 && gleich(x, s[i - 1]))) return null;
  const t = (x) => (extra.text ? extra.text(x) : T(x, form));
  return ordnen(ab ? 'Ordne von der größten zur kleinsten Zahl.' : extra.kopf ?? 'Ordne von der kleinsten zur größten Zahl.', (ab ? s.reverse() : s).map(t), hilfen, { umgekehrt: 'negativ-groesser', nachweis: [ORDNUNG(ab)], ...(extra.bild ? { bild: extra.bild } : {}) }); };
// Aussagen mit < und >: [[x, tx, y, ty]] je Zeile, zufällig wahr oder falsch.
const aussagenAus = (paare, hilfen, fv = 'negativ-groesser') => { const roh = [];
  for (const [x, tx, y, ty] of paare) { if (gleich(x, y)) return null; const z = zeichen(x, y), stimmt = wahl([true, false]); roh.push([`${tx} ${stimmt ? z : kehr(z)} ${ty}`, stimmt]); }
  if (!roh.some(([, r]) => r) || roh.every(([, r]) => r)) return null;
  return auswahl(Z('Prüfe die Aussagen.', 'Kreuze alle richtigen Aussagen an.'), roh.map(([t, r]) => opt(t, r, r ? undefined : fv)), hilfen, { mehrfach: true, nachweis: [AUSSAGEN] }); };

export function vergleichen69() {
  // ================= V1: vergleichen =================
  const hV = (n) => H(n, 'Die kleinere Zahl liegt auf der Zahlengeraden weiter links.', '−8 liegt links von −3. Also gilt −8 < −3.', 'Suche beide Zahlen auf der Zahlengeraden. Die linke Zahl ist die kleinere.');
  const mitBild = (t) => Z('Schau auf die Punkte an der Zahlengeraden.', `Setze das passende Zeichen ein. ${t}`);
  sechs(V1, 'F', [
    () => { const a = -zz(1, 9), b = -zz(1, 9);
      if (a === b) return null;
      return vergleiche(mitBild, zt(a), zt(b), a, b, hV(0), { bild: ZG({ punkte: [a, b] }) }); },
    () => { const a = -zz(5, 9), b = zz(1, 4), [x, y] = mische([a, b]);
      return vergleiche(mitBild, zt(x), zt(y), x, y, H(0, 'Jede negative Zahl ist kleiner als jede positive Zahl.', '−9 < 2, denn −9 liegt links von 2.', 'Schau auf die Zahlengerade. Welche Zahl liegt weiter links?'), { bild: ZG({ punkte: [a, b] }), fv: 'vorzeichen-vergessen' }); },
    () => { const ws = mische([-zz(6, 9), -zz(1, 4), zz(1, 9)]);
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Kreuze die kleinste Zahl an.'), ws.map((w) => opt(zt(w), w === Math.min(...ws), w === Math.min(...ws) ? undefined : 'negativ-groesser')), hV(0), { bild: ZG({ punkte: ws }), nachweis: [{ art: 'extrem', was: 'kleinstes' }] }); },
    () => { const a = -zz(1, 9), b = -zz(1, 9), [o1, o2] = mische(['Oslo', 'Kiruna', 'Zermatt', 'Moskau']);
      if (Math.abs(a - b) < 2) return null;
      return auswahl(Z('Die Thermometer zeigen die Temperatur in zwei Orten.', 'Kreuze an, wo es kälter ist.'), [opt(o1, a < b, a < b ? undefined : 'negativ-groesser'), opt(o2, b < a, b < a ? undefined : 'negativ-groesser')],
        H(0, 'Je weiter unten die Säule steht, desto kälter ist es.', '−8 °C ist kälter als −2 °C.', 'Vergleiche die Höhe der beiden Säulen.'), { bild: thermo(-10, 10, 1, 5, [a, o1], [b, o2]), nachweis: [{ art: 'thermowahl', was: 'kaeltestes' }] }); },
    () => { const a = -zz(11, 19), b = -zz(11, 19);
      if (a === b) return null;
      return vergleiche(mitBild, zt(a), zt(b), a, b, hV(0), { bild: gerade(-20, 0, 1, 5, { punkte: [a, b] }) }); },
    () => { const a = -zz(1, 9), [x, y] = mische([a, 0]);
      return vergleiche((t) => Z('Schau auf die Zahlengerade.', `Setze das passende Zeichen ein. ${t}`), zt(x), zt(y), x, y, H(0, 'Jede negative Zahl ist kleiner als null.', '−4 < 0, denn −4 liegt links von der Null.', 'Suche die Zahl auf der Zahlengeraden. Liegt sie links oder rechts von der Null?'), { bild: ZG({ punkte: [a] }) }); },
  ]);
  const ohne = (t) => `Setze das passende Zeichen ein. ${t}`;
  sechs(V1, 'G', [
    () => { const a = -5 * zz(2, 19), b = -5 * zz(2, 19);
      if (a === b) return null;
      return vergleiche(mitBild, zt(a), zt(b), a, b, hV(1), { bild: gerade(-100, 0, 5, 25, { punkte: [a, b] }) }); },
    () => { const a = -zz(1, 19), b = -zz(1, 19);
      if (a === b || a % 10 === 0 || b % 10 === 0) return null;
      return vergleiche(mitBild, dt(D(a)), dt(D(b)), D(a), D(b), hV(1), { bild: ZEHNTEL({ punkte: [a, b] }) }); },
    () => { const zs = mische([-zz(12, 18), -zz(2, 8), -zz(9, 11)]), gr = Math.max(...zs);
      if (zs.some((x) => x % 10 === 0)) return null;
      return auswahl(Z('Schau auf die Punkte an der Zahlengeraden.', 'Kreuze die größte Zahl an.'), zs.map((w) => opt(dt(D(w)), w === gr, w === gr ? undefined : 'negativ-groesser')), hV(1), { bild: ZEHNTEL({ punkte: zs }), nachweis: [{ art: 'extrem', was: 'groesstes' }] }); },
    () => { const g = zz(1, 8), a = Q(-(2 * g + 1), 2), b = D(-(10 * g + wahl([1, 2, 3, 4, 6, 7, 8, 9])));
      return vergleiche(ohne, bt(a), dt(b), a, b, H(1, 'Ein Halb ist 0,5. Schreibe beide Zahlen als Dezimalzahl.', '−1⁄2 = −0,5', 'Wandle den Bruch in eine Dezimalzahl um. Vergleiche dann.')); },
    () => { const a = -zz(20, 90), b = a + zz(2, 9), roh = [[Q(a), zt(a), Q(b), zt(b)], [Q(-b), zt(-b), Q(a), zt(a)], [D(10 * a - 5), dt(D(10 * a - 5)), Q(a), zt(a)], [Q(0), '0', Q(b), zt(b)]];
      return aussagenAus(roh, H(1, 'Die kleinere Zahl liegt links. Bei zwei negativen Zahlen ist die Zahl weiter von der Null entfernt die kleinere.', '−45 < −40', 'Prüfe jede Aussage einzeln an der Zahlengeraden in Gedanken.')); },
    () => { const u = -zz(4, 9), o = u + 2, gut = D(10 * u + zz(11, 19)), zuKlein = D(10 * u - zz(1, 8)), zuGross = D(10 * o + zz(1, 8)), m = `${zt(u)} < ▢ < ${zt(o)}`;
      if (gut[1] === 1 || zuKlein[1] === 1 || zuGross[1] === 1) return null;
      return einsetzen(Z(`Setze eine Zahl in das Kästchen ein: ${m}`, 'Kreuze die passende Zahl an.'), m, mische([[dt(gut), true], [dt(zuKlein), false], [dt(zuGross), false]]),
        H(1, 'Die gesuchte Zahl liegt auf der Zahlengeraden zwischen den beiden Zahlen.', 'Zwischen −5 und −3 liegt zum Beispiel −4,2.', 'Prüfe jede Antwort: Liegt sie rechts von der ersten und links von der zweiten Zahl?')); },
  ]);
  sechs(V1, 'M', [
    () => { const g = zz(0, 4), a = D(-(100 * g + zz(11, 49)), 2), b = D(-(10 * g + zz(2, 6)));
      if (gleich(a, b) || a[1] !== 100) return null;
      const [x, y] = mische([a, b]);
      return vergleiche(ohne, dt(x), dt(y), x, y, H(2, 'Vergleiche zuerst ohne Vorzeichen, Stelle für Stelle. Bei zwei negativen Zahlen dreht sich das Zeichen um.', 'Schreibe beide Zahlen mit gleich vielen Nachkommastellen. Die Zahl, die weiter von der Null entfernt ist, ist die kleinere.'), { fv: 'dezimal-mehr-ziffern' }); },
    () => { const [b, d] = wahl([[Q(-1, 2), D(-5)], [Q(-1, 4), D(-25, 2)], [Q(-3, 4), D(-75, 2)], [Q(-1, 5), D(-2)], [Q(-2, 5), D(-4)], [Q(-3, 5), D(-6)], [Q(-7, 10), D(-7)]]), x = plus(d, D(wahl([-5, -3, 3, 5, 7]), 2));
      return vergleiche(ohne, bt(b), dt(x), b, x, H(2, 'Wandle den Bruch in eine Dezimalzahl um. Vergleiche dann.', 'Schreibe den Bruch mit dem Nenner 100. Bei zwei negativen Zahlen ist die Zahl weiter von der Null entfernt die kleinere.')); },
    () => { const a = D(-zz(11, 99), 2), b = D(-zz(11, 99), 2), c = D(-zz(12, 98));
      if ([a, b, c].some((x) => x[1] === 1)) return null;
      return aussagenAus([[a, dt(a), b, dt(b)], [c, dt(c), a, dt(a)], [neg(b), dt(neg(b)), c, dt(c)], [Q(0), '0', a, dt(a)]], H(2, 'Die kleinere Zahl liegt auf der Zahlengeraden links.', 'Prüfe jede Aussage einzeln. Achte besonders auf zwei negative Zahlen.')); },
    () => { const N = wahl([4, 5, 10]), a = Q(-zz(1, N - 1), N), b = Q(-zz(1, N - 1), N);
      if (gleich(a, b) || a[1] !== N || b[1] !== N) return null;
      return vergleiche(ohne, bt(a), bt(b), a, b, H(2, 'Bei gleichem Nenner entscheidet der Zähler. Bei negativen Brüchen dreht sich das Zeichen um.', 'Vergleiche erst die Brüche ohne Vorzeichen. Der Bruch weiter weg von der Null ist hier der kleinere.')); },
    () => { const a = D(-zz(5, 9)), b = D(-zz(51, 99), 2), c = Q(-1, wahl([2, 4]));
      if (gleich(a, b) || b[1] !== 100) return null;
      const ws = mische([a, b, c, D(zz(1, 9))]), kl = ws.reduce((x, y) => (vgl(y, x) < 0 ? y : x));
      return auswahl('Kreuze die kleinste Zahl an.', ws.map((w) => opt(T(w, w[1] === 2 || w[1] === 4 ? 'b' : 'd'), gleich(w, kl), gleich(w, kl) ? undefined : 'dezimal-mehr-ziffern')), H(2, 'Schreibe alle Zahlen als Dezimalzahl mit zwei Nachkommastellen.', 'Die kleinste Zahl liegt am weitesten links: die negative Zahl, die am weitesten von der Null entfernt ist.'), { nachweis: [{ art: 'extrem', was: 'kleinstes' }] }); },
    () => { const k = kind(), d1 = zz(2, 8), d2 = d1 * 10 + zz(1, 9), a = D(-d1), b = D(-d2, 2);
      return auswahl(Z(`${k} sagt: „${dt(b)} ist größer als ${dt(a)}, weil ${d2} größer ist als ${d1}.“`, 'Prüfe die Aussage.'),
        [opt(`Falsch. Richtig ist: ${dt(b)} < ${dt(a)}.`, true), opt('Stimmt.', false, 'dezimal-wie-natuerlich'), opt(`Falsch. Richtig ist: ${dt(b)} = ${dt(a)}.`, false, 'dezimal-stelle')],
        H(2, 'Schreibe beide Zahlen mit gleich vielen Nachkommastellen.', `${dt(a)} = ${dt(a, 2)}. Vergleiche dann wie bei ganzen Zahlen mit Vorzeichen.`), { nachweis: [{ art: 'urteil', stimmt: false, behauptung: `${dt(b)} > ${dt(a)}` }] }); },
  ]);
  sechs(V1, 'E', [
    () => { const [n1, n2] = wahl([[3, 4], [4, 5], [5, 6], [3, 5], [4, 7], [6, 7], [5, 8]]), a = Q(-zz(1, n1 - 1), n1), b = Q(-zz(1, n2 - 1), n2);
      if (gleich(a, b) || a[1] !== n1 || b[1] !== n2) return null;
      return vergleiche(ohne, bt(a), bt(b), a, b, H(3, 'Mache die Brüche gleichnamig. Bei zwei negativen Brüchen ist der mit dem größeren Abstand zur Null der kleinere.'), { fv: 'bruch-nenner-groesse' }); },
    () => { const m = `−${bt(Q(3, 4))} < ▢ < −${bt(Q(1, 2))}`, gut = wahl([[bt(Q(-5, 8)), true], [bt(Q(-2, 3)), true], [bt(Q(-3, 5)), true]]), dez = D(-zz(51, 74), 2);
      if (dez[1] !== 100) return null;
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([gut, [dt(dez), true], [bt(Q(-wahl([2, 3]), 7)), false], [dt(D(-zz(76, 95), 2)), false], [bt(Q(-4, 5)), false]]),
        H(3, 'Wandle alle Zahlen in Dezimalzahlen um oder mache die Brüche gleichnamig.'), true); },
    () => { const g = zz(1, 4), [b, d] = wahl([[Q(4, 9), 44], [Q(2, 3), 67], [Q(5, 6), 83], [Q(3, 7), 43], [Q(5, 9), 56]]), x = neg(plus(Q(g), b)), y = D(-(100 * g + d + wahl([-1, 0, 1])), 2);
      if (y[1] !== 100) return null;
      return vergleiche(ohne, bt(x), dt(y), x, y, H(3, 'Die Zahl vor dem Komma ist gleich. Vergleiche den Bruch mit den Nachkommastellen, zum Beispiel durch Erweitern.')); },
    () => { const g = zz(1, 8), z = zz(2, 7), h = zz(1, 8), m = `−${g},▢${h} > −${g},${z}${h}`, ziffern = mische([...Array(10).keys()]).slice(0, 5);
      if (!ziffern.some((d) => d < z) || ziffern.every((d) => d < z)) return null;
      return einsetzen(Z(`Setze Ziffern in das Kästchen ein: ${m}`, 'Kreuze alle passenden Ziffern an.'), m, ziffern.sort((x, y) => x - y).map((d) => [String(d), d < z]), H(3, 'Bei negativen Zahlen ist die Zahl größer, die näher an der Null liegt.'), true); },
    () => { const a = zz(3, 9), b = zz(1, a - 1), k = kind();
      return auswahl(Z(`${k} sagt: „Eine negative Zahl ist umso größer, je weiter sie von der Null entfernt ist.“`, `${k} denkt dabei an ${zt(-a)} und ${zt(-b)}.`, 'Prüfe die Aussage. Begründe mit der Zahlengeraden.'),
        [opt(`Falsch. ${zt(-a)} liegt weiter links als ${zt(-b)}, also gilt ${zt(-a)} < ${zt(-b)}.`, true), opt(`Stimmt. ${zt(-a)} ist weiter von der Null entfernt, also gilt ${zt(-a)} > ${zt(-b)}.`, false, 'negativ-groesser'), opt(`Falsch. Beide Zahlen sind gleich groß, also gilt ${zt(-a)} = ${zt(-b)}.`, false, 'betrag-gegenzahl')],
        H(3, 'Auf der Zahlengeraden ist die Zahl weiter links immer die kleinere.'), { nachweis: [{ art: 'urteil', stimmt: false, behauptung: `${zt(-a)} > ${zt(-b)}` }] }); },
    () => { const u = D(-zz(21, 95)), o = D(zz(11, 75)), anzahl = Math.floor(o[0] / o[1]) - Math.ceil(u[0] / u[1]) + 1;
      if (istGanz(u) || istGanz(o)) return null;
      return antwort(`Bestimme, wie viele ganze Zahlen zwischen ${dt(u)} und ${dt(o)} liegen.`, anzahl, 'd', [[anzahl - 1, 'sach-schritt-vergessen'], [anzahl + 1, 'abstand-ueber-null'], [Math.floor(o[0] / o[1]) - Math.floor(-u[0] / u[1]), 'abstand-ueber-null']],
        H(3, 'Finde die kleinste und die größte ganze Zahl dazwischen. Vergiss die Null nicht.'), [{ art: 'zaehle', von: dt(u), bis: dt(o) }]); },
  ]);

  // ================= V2: ordnen und Zahlen dazwischen =================
  const hO = (n) => H(n, 'Ganz links stehen die negativen Zahlen, die weit von der Null entfernt sind.', '−8, −3, 0, 5 ist richtig geordnet.', 'Ordne erst die negativen Zahlen: Die Zahl am weitesten weg von der Null ist die kleinste. Dann folgen die positiven.');
  sechs(V2, 'F', [
    () => { const ws = [-zz(6, 9), -zz(1, 4), zz(1, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { bild: ZG({ punkte: ws }) }); },
    () => { const ws = [-zz(7, 10), -zz(4, 6), -zz(1, 3), zz(2, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { bild: ZG({ punkte: ws }) }); },
    () => { const ws = [-zz(6, 9), -zz(1, 5), zz(1, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', H(0, 'Die tiefste Temperatur steht am Thermometer ganz unten.', '−8 °C ist kälter als −3 °C.', 'Suche zuerst die kälteste Temperatur. Sie hat die niedrigste Säule.'), { kopf: 'Ordne von der kleinsten zur größten Temperatur.', text: (x) => `${zt(x[0])} °C`, bild: thermo(-10, 10, 1, 5, ...mische(ws).map((w, i) => [w, ['Mo', 'Di', 'Mi'][i]])) }); },
    () => { const ws = [-zz(15, 19), -zz(8, 13), -zz(1, 6)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { ab: true, bild: gerade(-20, 0, 1, 5, { punkte: ws }) }); },
    () => { const ws = [-zz(7, 9), -zz(3, 6), 0, zz(1, 9)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(0), { bild: ZG({ punkte: ws.filter((w) => w !== 0) }) }); },
    () => { const u = -zz(3, 9), o = u + zz(3, 5), m = `${zt(u)} < ▢ < ${zt(o)}`, gut = u + zz(1, o - u - 1);
      const t = einsetzen(Z('Schau auf die Zahlengerade.', `Setze eine Zahl in das Kästchen ein: ${m}`, 'Kreuze die passende Zahl an.'), m, mische([[zt(gut), true], [zt(u - zz(1, 2)), false], [zt(o + zz(1, 2)), false]]),
        H(0, 'Die Zahl muss zwischen den beiden Zahlen liegen.', 'Zwischen −5 und −2 liegen −4 und −3.', 'Suche beide Zahlen auf der Zahlengeraden. Welche Zahl liegt dazwischen?'));
      return { ...t, bild: ZG({ punkte: [u, o] }) }; },
  ]);
  sechs(V2, 'G', [
    () => { const ws = [-5 * zz(12, 19), -5 * zz(6, 11), -5 * zz(1, 5), 5 * zz(1, 8), 5 * zz(9, 19)];
      return ordne(ws.map((w) => Q(w)), 'd', hO(1), { bild: gerade(-100, 100, 5, 50, { punkte: ws }) }); },
    () => { const ws = [-zz(11, 19), -zz(5, 9), -zz(1, 4), zz(2, 18)];
      if (ws.some((x) => x % 10 === 0)) return null;
      return ordne(ws.map((w) => D(w)), 'd', hO(1), { bild: ZEHNTEL({ punkte: ws }) }); },
    () => { const g = zz(1, 9), ws = mische([[Q(-(2 * g + 1), 2), 'b'], [D(-(10 * g + zz(1, 4))), 'd'], [D(-(10 * g + zz(6, 9))), 'd'], [Q(-g - wahl([0, 1])), 'd'], [D(10 * zz(1, 9) + 5), 'd']]).slice(0, 4), form = new Map(ws.map(([x, f]) => [String(x), f]));
      return ordne(ws.map(([x]) => x), 'd', H(1, 'Ein Halb ist 0,5. Schreibe alle Zahlen als Dezimalzahl.', '−1⁄2 = −0,5', 'Wandle den Bruch um. Ordne dann an der Zahlengeraden in Gedanken.'), { text: (x) => T(x, form.get(String(x))) }); },
    () => { const ws = [D(-zz(61, 99)), D(-zz(31, 59)), D(-zz(11, 29)), D(zz(11, 49))];
      if (ws.some((x) => x[1] === 1)) return null;
      return ordne(ws, 'd', hO(1), { ab: true }); },
    () => { const u = -zz(4, 9), m = `${zt(u - 1)} < ▢ < ${zt(u)}`, ok = mische([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2).map((z) => D(10 * (u - 1) + 10 - z));
      const roh = [...ok.map((x) => [dt(x), true]), [dt(D(10 * u + zz(1, 9))), false], [dt(D(-(10 * (u - 1)) + zz(1, 9))), false, 'vorzeichen-vergessen']];
      if (new Set(roh.map(([t]) => t)).size !== roh.length) return null;
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische(roh), H(1, 'Die Zahl muss rechts von der ersten und links von der zweiten Zahl liegen.', 'Zwischen −5 und −4 liegt zum Beispiel −4,3.', 'Prüfe jede Antwort: Liegt sie auf der Zahlengeraden zwischen den beiden Zahlen?'), true); },
    () => { const ws = [-zz(15, 19), -zz(8, 13), -zz(1, 6)], k = kind(), falsch = [...ws].sort((a, b) => b - a);
      return auswahl(Z(`${k} ordnet die Zahlen ${mische(ws).map(zt).join(', ')} von der kleinsten zur größten.`, `${k} schreibt: ${falsch.map(zt).join(' < ')}`, 'Prüfe die Reihenfolge.'),
        [opt(`Falsch. Richtig ist: ${ws.map(zt).join(' < ')}.`, true), opt('Stimmt.', false, 'negativ-groesser'), opt(`Falsch. Richtig ist: ${[ws[1], ws[0], ws[2]].map(zt).join(' < ')}.`, false, 'negativ-groesser')],
        H(1, 'Die kleinste Zahl liegt ganz links. Bei negativen Zahlen ist das die Zahl am weitesten weg von der Null.', '−18 < −9 < −3', 'Suche die Zahlen auf der Zahlengeraden. Lies sie von links nach rechts.'), { bild: gerade(-20, 0, 1, 5, { punkte: ws }), nachweis: [{ art: 'urteil', stimmt: false, behauptung: falsch.map(zt).join(' < ') }] }); },
  ]);
  sechs(V2, 'M', [
    () => { const ws = [D(-zz(110, 199), 2), D(-zz(11, 99), 2), D(-zz(2, 9)), D(zz(1, 9), 2), D(zz(11, 99), 2)];
      if (ws.some((x) => x[1] === 1)) return null;
      return ordne(ws, 'd', H(2, 'Ordne zuerst die negativen Zahlen. Je weiter weg von der Null, desto kleiner die Zahl.', 'Schreibe alle Zahlen mit zwei Nachkommastellen. Beginne mit der Zahl, die am weitesten links liegt.')); },
    () => { const ws = mische([[Q(-1, 2), 'b'], [Q(-3, 4), 'b'], [D(-zz(55, 70), 2), 'd'], [D(-zz(2, 4)), 'd'], [Q(1, 4), 'b'], [D(zz(3, 9)), 'd'], [Q(-1, 4), 'b'], [Q(-2, 5), 'b']]).slice(0, 4), form = new Map(ws.map(([x, f]) => [String(x), f]));
      return ordne(ws.map(([x]) => x), 'd', H(2, 'Wandle die Brüche in Dezimalzahlen um. Ordne dann.', 'Schreibe jede Zahl als Dezimalzahl mit zwei Nachkommastellen und vergleiche.'), { kopf: 'Ordne die Brüche und Dezimalzahlen von der kleinsten zur größten Zahl.', text: (x) => T(x, form.get(String(x))) }); },
    () => { const m = `${MINUS1} < ▢ < −${bt(Q(1, 2))}`, ok = mische([D(-6), D(-75, 2), D(-8), D(-55, 2), D(-9), Q(-3, 4)]).slice(0, 2), falsch = [D(-4), D(-125, 2), D(5)];
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([...ok.map((x) => [T(x, x[1] === 4 ? 'b' : 'd'), true]), ...falsch.map((x) => [dt(x), false, gleich(x, D(5)) ? 'vorzeichen-vergessen' : 'negativ-groesser'])]),
        H(2, 'Schreibe −1⁄2 als Dezimalzahl. Die Zahl muss zwischen −1 und −0,5 liegen.', 'Prüfe jede Antwort an der Zahlengeraden: rechts von −1 und links von −0,5?'), true); },
    () => { const u = D(-zz(12, 48)), o = plus(u, D(zz(2, 5))), m = `${dt(u)} < ▢ < ${dt(o)}`, a = plus(u, D(zz(1, 9), 2)), b = minus(o, D(zz(1, 9), 2));
      if ([u, o, a, b].some((x) => istGanz(x)) || gleich(a, b) || u[1] === 1 || o[1] === 1) return null;
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([[dt(a), true], [dt(b), true], [dt(minus(u, D(5, 2))), false], [dt(plus(o, D(5, 2))), false]]),
        H(2, 'Die Zahl muss rechts von der ersten und links von der zweiten Zahl liegen.', 'Schreibe alle Zahlen mit zwei Nachkommastellen. Prüfe dann jede Antwort einzeln.'), true); },
    () => { const ws = [D(-zz(201, 299), 2), D(-zz(101, 199), 2), Q(-wahl([1, 3]), 4), D(zz(11, 99), 2)];
      if (ws.some((x) => x[1] === 1 || x[1] === 10)) return null;
      return ordne(ws, 'd', H(2, 'Wandle den Bruch in eine Dezimalzahl um. Ordne dann.', 'Die größte Zahl liegt am weitesten rechts.'), { ab: true, text: (x) => T(x, x[1] === 4 ? 'b' : 'd') }); },
    () => { const u = D(-zz(21, 89)), o = plus(u, D(1)), m = `${dt(u)} < ▢ < ${dt(o)}`, mitte = plus(u, D(5, 2));
      if (u[1] === 1) return null;
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([[dt(mitte), true], [dt(plus(u, D(zz(1, 4), 2))), true], [dt(neg(mitte)), false, 'vorzeichen-vergessen'], [dt(minus(u, D(zz(1, 9), 2))), false]]),
        H(2, 'Zwischen zwei Dezimalzahlen mit einer Nachkommastelle liegen Zahlen mit zwei Nachkommastellen.', 'Hänge an beide Grenzen eine Null an. Dann siehst du die Zahlen dazwischen.'), true); },
  ]);
  sechs(V2, 'E', [
    () => { const ws = mische([[Q(-2, 3), 'b'], [Q(-3, 4), 'b'], [Q(-5, 6), 'b'], [D(-zz(68, 73), 2), 'd'], [Q(-3, 5), 'b'], [D(-zz(77, 82), 2), 'd'], [Q(-7, 8), 'b']]).slice(0, 5), form = new Map(ws.map(([x, f]) => [String(x), f]));
      return ordne(ws.map(([x]) => x), 'd', H(3, 'Mache die Brüche gleichnamig oder wandle alles in Dezimalzahlen um.'), { ab: true, text: (x) => T(x, form.get(String(x))) }); },
    () => { const [n1, n2] = wahl([[3, 4], [2, 3], [4, 5], [5, 6]]), a = Q(-(n1 - 1), n1), b = Q(-(n2 - 1), n2), m = `${bt(b)} < ▢ < ${bt(a)}`;
      if (vgl(b, a) >= 0) return null;
      const mitte = Q(a[0] * b[1] + b[0] * a[1], 2 * a[1] * b[1]);
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([[bt(mitte), true], [bt(Q(-1)), false], [bt(neg(mitte)), false, 'vorzeichen-vergessen'], [bt(Q(-(n1 - 1) , n1 + 1)), vgl(Q(-(n1 - 1), n1 + 1), b) > 0 && vgl(Q(-(n1 - 1), n1 + 1), a) < 0, 'bruch-nenner-groesse']]),
        H(3, 'Mache alle Brüche gleichnamig. Zwischen zwei Brüchen liegt zum Beispiel ihre Mitte.'), true); },
    () => { const a = D(-zz(11, 49), 2), b = Q(-wahl([1, 2, 4]), 5), c = Q(-1, wahl([3, 6, 8])), d = D(-zz(51, 99), 3);
      if ([a, d].some((x) => x[1] < 100)) return null;
      return aussagenAus([[a, dt(a), b, bt(b)], [c, bt(c), b, bt(b)], [d, dt(d), a, dt(a)], [neg(c), bt(neg(c)), d, dt(d)]], H(3, 'Wandle Brüche in Dezimalzahlen um, bevor du vergleichst.')); },
    () => { const k = kind(), ws = mische([D(-zz(11, 19)), D(-zz(21, 29), 2), D(-zz(301, 399), 3)]), richtig = [...ws].sort((x, y) => vgl(x, y)), falsch = [...ws].sort((x, y) => String(dt(x)).length - String(dt(y)).length).reverse();
      if (richtig.map(dt).join() === falsch.map(dt).join() || ws.some((x) => istGanz(x))) return null;
      return auswahl(Z(`${k} ordnet ${ws.map(dt).join('; ')} von der kleinsten zur größten Zahl.`, `${k} schreibt: ${falsch.map(dt).join(' < ')}`, 'Prüfe die Reihenfolge.'),
        [opt(`Falsch. Richtig ist: ${richtig.map(dt).join(' < ')}.`, true), opt('Stimmt.', false, 'dezimal-mehr-ziffern')], H(3, 'Mehr Ziffern machen eine Zahl nicht größer oder kleiner. Schreibe alle Zahlen mit gleich vielen Nachkommastellen.'), { nachweis: [{ art: 'urteil', stimmt: false, behauptung: falsch.map(dt).join(' < ') }] }); },
    () => { const a = zz(2, 9), roh = mische([[`Zwischen ${zt(-a - 1)} und ${zt(-a)} liegen unendlich viele Zahlen.`, true], ['Es gibt eine kleinste negative Zahl.', false], ['Jede positive Zahl ist größer als jede negative Zahl.', true], [`${zt(-a)} ist größer als ${zt(-a - 1)}, weil ${zt(-a)} näher an der Null liegt.`, true], ['Von zwei negativen Zahlen ist die mit mehr Ziffern die kleinere.', false]]).slice(0, 4);
      if (!roh.some(([, r]) => r) || roh.every(([, r]) => r)) return null;
      return auswahl(Z('Prüfe die Aussagen.', 'Kreuze alle richtigen Aussagen an.'), roh.map(([t, r]) => opt(t, r, r ? undefined : 'negativ-groesser')), H(3, 'Suche zu jeder Aussage ein Beispiel oder ein Gegenbeispiel an der Zahlengeraden.'), { mehrfach: true, nachweis: [FREI0] }); },
    () => { const u = Q(-zz(2, 5), 7), o = plus(u, Q(1, 7)), m = `${bt(u)} < ▢ < ${bt(o)}`, mitte = Q(2 * u[0] + 1, 14);
      if (u[1] !== 7) return null;
      return einsetzen(Z(`Setze Zahlen in das Kästchen ein: ${m}`, 'Kreuze alle passenden Zahlen an.'), m, mische([[bt(mitte), true], [bt(o), false], [bt(neg(mitte)), false, 'vorzeichen-vergessen'], [bt(Q(u[0], 6)), vgl(Q(u[0], 6), u) > 0 && vgl(Q(u[0], 6), o) < 0, 'bruch-nenner-groesse']]),
        H(3, 'Erweitere beide Brüche mit 2. Dann siehst du einen Bruch dazwischen.'), true); },
  ]);
}
const MINUS1 = '−1';
const FREI0 = { art: 'frei', grund: 'Aussagen über die Anordnung der Zahlen an der Zahlengeraden' };
