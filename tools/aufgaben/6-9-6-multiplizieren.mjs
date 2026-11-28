// Aufgaben zu 6.9.6 „Rationale Zahlen multiplizieren und dividieren“ (Lernziele P1, D1) nach ADR 0015 und ADR 0059.
// Die Lerneinheit trägt im Buch die Marke E: 24 Aufgaben je Lernziel, nur auf E. Für alle anderen ist sie ein Abstecher.
// P1: ganze Zahlen, Dezimalzahlen und Brüche multiplizieren. D1: dieselben Zahlen dividieren, keine Division geht in eine Periode.
// Anders als in Klasse 7 (7.1.6/7.1.7) gibt es keine Potenzen und keine Fragen mit Fragezeichen. Durch null wird nur in einer Aussage gefragt.
// Typische Fehler: Minus mal Minus bleibt Minus, das Vorzeichen fehlt, addiert statt malgenommen, malgenommen statt geteilt.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, mal, durch, neg, T, zt, dt, bt, opt, zz, zn, wahl, antwort, lk, lkd, gerade, thermo, konto, H, X, kette, val, txt, rechne, pruefe, aussagen, fMal, fDiv, huepfer, ZEICHEN, VGL, FREI, kind, istGanz, istDezimal } from './7-1-rational.mjs';

const P1 = '6.9.6-P1', D1 = '6.9.6-D1';
const B = { form: 'b' };
const LUECKEN = [{ art: 'luecken' }];
const k = (x) => (x < 0 ? `(${zt(x)})` : zt(x));
const kq = (x, f = 'd') => (x[0] < 0 ? `(${T(x, f)})` : T(x, f));
const hP = H(3, 'Gleiche Vorzeichen ergeben Plus. Verschiedene Vorzeichen ergeben Minus.');
const hD = H(3, 'Beim Dividieren gelten dieselben Vorzeichenregeln wie beim Multiplizieren.');
const ZEICHENTEXT = (l) => Z('Entscheide ohne zu rechnen.', `Setze ein Zeichen ein: ${l} ▢ 0`, 'Kreuze das passende Zeichen an.');
const bruch = (z, n) => { const b = Q(z, n); return b[1] === n ? b : null; };

// Falsche Werte nur einmal anbieten: Zwei Fehlvorstellungen können denselben Wert liefern.
function einmal(werte) {
  const raus = [];
  for (const x of werte) if (x != null && !raus.some((y) => y[0] * x[1] === x[0] * y[1])) raus.push(x);
  return raus;
}

export function multiplizieren69() {
  // ================= P1: multiplizieren =================
  const malZ = (sa, sb) => () => { const a = sa * zz(3, 15), b = sb * zz(3, 12), e = X('·', a, b);
    return rechne(`Berechne ${txt(e)}.`, e, {}, fMal(a, b), hP); };
  const kette3 = () => { const fs = [zn(2, 9), zn(2, 9), zn(2, 6)], e = kette('·', ...fs);
    if (fs.filter((x) => x < 0).length < 2) return null;
    return rechne(`Berechne ${txt(e)}.`, e, {}, [[neg(val(e)), 'minus-mal-minus'], [Q(fs[0] + fs[1] + fs[2]), '1x1-addiert']], H(3, 'Zähle die Minuszeichen. Eine gerade Anzahl ergibt Plus.')); };
  const zeichenP = () => { const fs = [zn(2, 9), zn(2, 9), zn(2, 9), zn(2, 9)], minusse = fs.filter((x) => x < 0).length, l = fs.map(k).join(' · ');
    if (minusse < 2) return null;
    return auswahl(ZEICHENTEXT(l), ZEICHEN(minusse % 2 ? -1 : 1, 'minus-mal-minus'), H(3, 'Zähle die negativen Faktoren. Eine gerade Anzahl ergibt Plus, eine ungerade Anzahl ergibt Minus.'), { nachweis: [VGL(l, '0')] }); };
  const zeilenP = () => { const da = [];
    return aussagen(Z('Prüfe die Rechnungen.', 'Kreuze alle richtigen Rechnungen an.'), 4, (stimmt) => { const a = zn(3, 12), b = zn(3, 12), z = a * b;
      if ((a > 0 && b > 0) || da.includes(`${a}·${b}`)) return null; da.push(`${a}·${b}`);
      return `${txt(X('·', a, b))} = ${zt(stimmt ? z : -z)}`; }, 'minus-mal-minus', H(3, 'Bestimme bei jeder Rechnung zuerst das Vorzeichen des Ergebnisses.')); };
  const pruefenP = (stimmt) => () => { const a = -zz(11, 19), b = zn(3, 9), e = X('·', a, b), z = val(e), f = fMal(a, b);
    return pruefe((beh) => Z(`${kind()} rechnet: ${beh}`, 'Prüfe die Rechnung.'), e, {}, stimmt ? null : f[0][0], f[0][1], hP, { andere: einmal([...f.map((x) => x[0]), Q(z[0] + 10)]) }); };
  const alsMal = () => { const n = -zz(2, 5), m = zz(3, 4);
    return luecken(Z('Schreibe die Plusaufgabe als Malaufgabe.', 'Berechne dann.', `${Array(m).fill(k(n)).join(' + ')} = {{a}} · ${k(n)} = {{b}}`), { a: lk(m), b: lk(m * n, [[-m * n, 'vorzeichen-vergessen'], [m + n, '1x1-addiert']]) },
      H(3, 'Gleiche Sprünge hintereinander sind eine Malaufgabe.'), { bild: huepfer(m, n), nachweis: LUECKEN }); };
  const kaelter = () => { const n = zz(2, 4), m = zz(3, 5), s = zz(1, 6), w = s - m * n;
    if (w >= 0 || w < -10) return null;
    return antwort(Z(`Am Abend sind es ${s} °C.`, `Die Temperatur sinkt jede Stunde um ${n} Grad.`, `Berechne die Temperatur nach ${m} Stunden.`), w, 'd', [[s + m * n, 'richtung-vertauscht'], [-m * n, 'sach-schritt-vergessen'], [s - m - n, '1x1-addiert']],
      H(3, 'Rechne erst die gesamte Änderung als Malaufgabe aus.'), [`${s} + ${m} · (−${n}) = ${zt(w)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [s, 'Abend']) }); };
  const abbuchungen = () => { const m = zz(3, 5), n = 5 * zz(3, 9), was = wahl(['Sportverein', 'Musikschule', 'Handy']), monate = ['Januar', 'Februar', 'März', 'April', 'Mai'], z = -m * n;
    return antwort(Z(`Der Kontoauszug zeigt ${m} gleiche Abbuchungen.`, 'Berechne die Änderung des Kontostands.', 'Schreibe das Ergebnis mit Vorzeichen.'), z, 'd', [[-z, 'vorzeichen-vergessen'], [-n, 'sach-schritt-vergessen'], [-(m + n), '1x1-addiert']],
      H(3, 'Mehrmals dieselbe Abbuchung ist eine Malaufgabe mit einer negativen Zahl.'), [`${m} · (−${n}) = ${zt(z)}`], { einheit: '€', daten: konto(['Buchung', 'Euro'], monate.slice(0, m).map((mo) => [`${was} ${mo}`, zt(-n)])) }); };
  const malD = (art) => () => { const a = D(-zz(11, 95)), b = art === 'z' ? Q(zn(2, 9)) : D(zn(2, 9)), e = X('·', a, b);
    if (istGanz(a) || !istDezimal(val(e), 3)) return null;
    return rechne(`Berechne ${txt(e)}.`, e, { stellen: 3 }, fMal(a, b).filter(([w]) => istDezimal(w, 3)), H(3, 'Rechne ohne Komma und ohne Vorzeichen. Setze dann das Komma und das Vorzeichen.')); };
  const malDD = () => { const a = D(-zz(11, 49)), b = D(-zz(2, 9)), e = X('·', a, b);
    if (istGanz(a) || !istDezimal(val(e), 3)) return null;
    return rechne(`Berechne ${txt(e)}.`, e, { stellen: 3 }, fMal(a, b).filter(([w]) => istDezimal(w, 3)), H(3, 'Zähle die Stellen nach dem Komma in beiden Faktoren. So viele hat auch das Ergebnis.')); };
  const malB = (gleich) => () => { const [n1, n2] = wahl([[3, 5], [4, 5], [5, 7], [3, 7], [2, 9], [3, 8]]), a = bruch(-zz(1, n1 - 1), n1), b = bruch((gleich ? -1 : 1) * zz(1, n2 - 1), n2);
    if (!a || !b) return null;
    const e = X('·', a, b);
    return rechne(`Berechne ${txt(e, B)}. Kürze vollständig.`, e, B, [[neg(val(e)), gleich ? 'minus-mal-minus' : 'vorzeichen-vergessen']], H(3, 'Zähler mal Zähler, Nenner mal Nenner. Bestimme zuerst das Vorzeichen.')); };
  const malBZ = () => { const n = wahl([3, 4, 5, 6, 8]), a = bruch(-zz(1, n - 1), n), m = -n * zz(2, 5);
    if (!a) return null;
    const e = X('·', a, m);
    return rechne(`Berechne ${txt(e, B)}.`, e, B, [[neg(val(e)), 'minus-mal-minus']], H(3, 'Teile die ganze Zahl zuerst durch den Nenner. Nimm das Ergebnis dann mit dem Zähler mal.')); };
  const faktorFehlt = () => { const a = zn(3, 9), b = zn(3, 9), p = a * b;
    if (a > 0 && b > 0) return null;
    return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} · ${k(b)} = ${zt(p)}`), { a: lk(a, [[-a, 'vorzeichen-division']]) }, H(3, 'Rechne mit der Umkehraufgabe: Teile das Ergebnis durch den bekannten Faktor.'), { nachweis: [`${zt(p)} : ${k(b)} = ${zt(a)}`] }); };
  const reihe = () => { const n = zz(2, 4);
    return luecken(Z('Setze die Reihe fort.', `2 · ${k(-n)} = ${zt(-2 * n)}`, `1 · ${k(-n)} = ${zt(-n)}`, `0 · ${k(-n)} = 0`, `(−1) · ${k(-n)} = {{a}}`, `(−2) · ${k(-n)} = {{b}}`), { a: lk(n, [[-n, 'minus-mal-minus']]), b: lk(2 * n, [[-2 * n, 'minus-mal-minus']]) },
      H(3, 'Von Zeile zu Zeile wird das Ergebnis um gleich viel größer.'), { bild: gerade(-10, 10, 1, 5, { punkte: [-2 * n, -n, 0] }), nachweis: LUECKEN }); };
  const immerP = () => auswahl(Z('Prüfe die Aussagen.', 'Kreuze die Aussage an, die immer stimmt.'), [opt('Das Produkt von vier negativen Zahlen ist positiv.', true), opt('Das Produkt von drei negativen Zahlen ist positiv.', false, 'minus-mal-minus'),
    opt('Wechselt ein Faktor sein Vorzeichen, bleibt das Produkt gleich.', false, 'vorzeichen-vergessen'), opt('Eine Zahl mit sich selbst malgenommen kann negativ sein.', false, 'minus-mal-minus')],
    H(3, 'Zähle bei jeder Aussage die Minuszeichen oder suche ein Gegenbeispiel.'), { nachweis: [FREI('Vorzeichenregel beim Multiplizieren: Eine gerade Anzahl negativer Faktoren ergibt ein positives Produkt.')] });
  const geschickt = () => { const fs = [Q(-2), D(zz(2, 9)), Q(-5), Q(zn(3, 7))], e = kette('·', ...fs);
    if (istGanz(fs[1])) return null;
    return rechne(`Berechne geschickt: ${txt(e)}`, e, {}, [[neg(val(e)), 'minus-mal-minus']], H(3, 'Zähle die negativen Faktoren. Nimm zuerst (−2) und (−5) zusammen.')); };
  const dezimalBruch = () => { const [a, x] = wahl([[Q(-3, 4), D(8)], [Q(-2, 5), D(15)], [Q(-3, 8), D(4)], [Q(-1, 4), D(6)]]), y = wahl([x, neg(x)]), z = mal(a, y);
    if (!istDezimal(z, 2)) return null;
    return antwort(Z(`Berechne (${bt(a)}) · ${kq(y)}.`, 'Gib das Ergebnis als Dezimalzahl an.'), z, 'd', [[neg(z), y[0] < 0 ? 'minus-mal-minus' : 'vorzeichen-vergessen']], H(3, 'Schreibe den Bruch als Dezimalzahl oder rechne mit Brüchen weiter.'), [`(${bt(a)}) · ${kq(y)} = ${dt(z)}`]); };

  sechs(P1, 'E', [
    malZ(-1, 1), malZ(1, -1), malZ(-1, -1), dezimalBruch, kette3, kette3, zeichenP, zeichenP,
    zeilenP, pruefenP(true), pruefenP(false), alsMal, kaelter, abbuchungen, malD('z'), malD('d'),
    malDD, malB(true), malB(false), malBZ, faktorFehlt, reihe, immerP, geschickt,
  ], 24);

  // ================= D1: dividieren =================
  const durchZ = (sq, sb) => () => { const q = sq * zz(2, 15), b = sb * zz(2, 12), a = q * b, e = X(':', a, b);
    return rechne(`Berechne ${txt(e)}.`, e, {}, fDiv(a, b), hD); };
  const pruefenD = (stimmt) => () => { const q = zn(3, 12), b = -zz(3, 9), a = q * b, e = X(':', a, b), f = fDiv(a, b);
    return pruefe((beh) => Z(`${kind()} rechnet: ${beh}`, 'Prüfe die Rechnung.'), e, {}, stimmt ? null : f[0][0], f[0][1], hD, { andere: einmal(f.map((x) => x[0])) }); };
  const zeichenD = () => { const q = zn(2, 9), b = zn(2, 9), c = zn(2, 5), a = q * b * c, l = `${k(a)} : ${k(b)} : ${k(c)}`, minusse = [a, b, c].filter((x) => x < 0).length;
    if (minusse < 2) return null;
    return auswahl(ZEICHENTEXT(l), ZEICHEN(minusse % 2 ? -1 : 1, 'vorzeichen-division'), H(3, 'Zähle die Minuszeichen. Beim Dividieren gilt dieselbe Regel wie beim Multiplizieren.'), { nachweis: [VGL(l, '0')] }); };
  const zeilenD = () => { const da = [];
    return aussagen(Z('Prüfe die Rechnungen.', 'Kreuze alle richtigen Rechnungen an.'), 4, (stimmt) => { const q = zn(2, 12), b = zn(2, 9), a = q * b;
      if ((a > 0 && b > 0) || da.includes(`${a}:${b}`)) return null; da.push(`${a}:${b}`);
      return `${txt(X(':', a, b))} = ${zt(stimmt ? q : -q)}`; }, 'vorzeichen-division', H(3, 'Mache bei jeder Rechnung die Probe mit der Malaufgabe.')); };
  const sprungweg = () => { const m = zz(3, 5), n = -zz(2, 4), a = m * n, e = X(':', a, m);
    return rechne(Z('Der Weg an der Zahlengeraden hat gleich lange Sprünge.', `Berechne ${txt(e)}.`), e, {}, fDiv(a, m), H(3, 'Teile den ganzen Weg in gleich lange Sprünge. Die Sprünge gehen nach links.'),
      { bild: gerade(-20, 0, 1, 5, { start: 0, spruenge: Array(m).fill(0).map((_, i) => ({ von: i * n, nach: (i + 1) * n, text: '?' })) }) }); };
  const abkuehlen = () => { const m = zz(3, 5), n = zz(2, 3), s = zz(2, 6), e = s - m * n;
    if (e >= 0) return null;
    return antwort(Z(`Um 18 Uhr sind es ${s} °C, ${m} Stunden später sind es ${zt(e)} °C.`, 'Die Temperatur ändert sich jede Stunde gleich.', 'Bestimme die Änderung pro Stunde mit Vorzeichen.'), -n, 'd', [[n, 'vorzeichen-division'], [e - s, 'sach-schritt-vergessen'], [(e + s) / m, 'abstand-ueber-null']].filter(([w]) => Number.isInteger(w)),
      H(3, 'Bestimme zuerst die gesamte Änderung. Teile sie dann durch die Anzahl der Stunden.'), [`(${zt(e)} − ${s}) : ${m} = ${zt(-n)}`], { einheit: '°C', bild: thermo(-10, 10, 1, 5, [s, '18 Uhr'], [e, 'später']) }); };
  const schulden = () => { const m = zz(3, 4), n = 5 * zz(4, 12), names = ['Kino', 'Fahrrad', 'Ausflug', 'Pizza'], z = -n;
    return antwort(Z(`${m} Freunde bezahlen gemeinsam von einem Konto.`, 'Der Kontoauszug zeigt die Abbuchungen.', `Teile den gesamten Betrag auf die ${m} Freunde auf.`, 'Gib den Anteil pro Person mit Vorzeichen an.'), z, 'd', [[-z, 'vorzeichen-division'], [-m * n * m, 'div-falsche-rechenart']],
      H(3, 'Addiere zuerst alle Abbuchungen. Teile dann durch die Anzahl der Personen.'), [`(${Array(m).fill(0).map((_, i) => (i ? k(-n) : zt(-n))).join(' + ')}) : ${m} = ${zt(z)}`], { einheit: '€', daten: konto(['Buchung', 'Euro'], names.slice(0, m).map((x) => [x, zt(-n)])) }); };
  const dividendFehlt = () => { const q = zn(3, 9), b = zn(3, 9), a = q * b;
    if (a > 0 && b > 0) return null;
    return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} : ${k(b)} = ${zt(q)}`), { a: lk(a, [[-a, 'vorzeichen-division']]) }, H(3, 'Rechne mit der Umkehraufgabe: Nimm das Ergebnis mit der Zahl mal, durch die geteilt wird.'), { nachweis: [`${zt(q)} · ${k(b)} = ${zt(a)}`] }); };
  const probe = () => { const q = -zz(3, 9), b = -zz(3, 9), a = q * b;
    return luecken(Z('Rechne die Aufgabe und mache die Probe.', `${zt(a)} : ${k(b)} = {{a}}`, `Probe: {{b}} · ${k(b)} = ${zt(a)}`), { a: lk(q, [[-q, 'vorzeichen-division']]), b: lk(q, [[-q, 'vorzeichen-division']]) }, hD, { nachweis: LUECKEN }); };
  const durchD = (art) => () => { const q = D(zn(11, 95)), b = art === 'z' ? Q(zn(2, 9)) : D(zn(2, 9)), a = mal(q, b), e = X(':', a, b);
    if (istGanz(q) || istGanz(a) || !istDezimal(a, 3) || (a[0] > 0 && b[0] > 0)) return null;
    return rechne(`Berechne ${txt(e)}.`, e, { stellen: 3 }, fDiv(a, b).filter(([w]) => istDezimal(w, 3)), H(3, 'Bestimme zuerst das Vorzeichen. Teile dann wie bei Dezimalzahlen ohne Vorzeichen.')); };
  const durchB = (gleich) => () => { const [n1, n2] = wahl([[3, 5], [4, 5], [5, 7], [3, 7], [2, 9], [3, 8]]), a = bruch(-zz(1, n1 - 1), n1), b = bruch((gleich ? -1 : 1) * zz(1, n2 - 1), n2);
    if (!a || !b) return null;
    const e = X(':', a, b);
    return rechne(`Berechne ${txt(e, B)}. Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-division'], [mal(a, b), 'bruch-kehrwert']], H(3, 'Teile durch einen Bruch, indem du mit dem Kehrwert malnimmst. Bestimme zuerst das Vorzeichen.')); };
  const durchBZ = () => { const n = wahl([3, 4, 5, 7]), a = bruch(-zz(1, n - 1), n), m = zn(2, 5);
    if (!a) return null;
    const e = X(':', a, m);
    return rechne(`Berechne ${txt(e, B)}. Kürze vollständig.`, e, B, [[neg(val(e)), 'vorzeichen-division'], [mal(a, Q(m)), 'div-falsche-rechenart']], H(3, 'Teile einen Bruch durch eine ganze Zahl, indem du den Nenner mit der Zahl malnimmst.')); };
  const denken = () => { const f = -zz(2, 6), x = zn(2, 9), s = zz(3, 15), z = x * f + s;
    return antwort(Z('Lena denkt sich eine Zahl.', `Sie nimmt die Zahl mit ${k(f)} mal und addiert ${s}.`, `Sie erhält ${zt(z)}.`, 'Bestimme Lenas Zahl.'), x, 'd', [[-x, 'vorzeichen-division'], [(z + s) / f, 'richtung-vertauscht']].filter(([w]) => Number.isInteger(w) && w !== x),
      H(3, 'Rechne rückwärts: Mache erst die Addition rückgängig, dann das Malnehmen.'), [`(${zt(z)} − ${s}) : ${k(f)} = ${zt(x)}`]); };
  const null0 = () => auswahl(Z('Prüfe die Aussagen.', 'Kreuze die Aussage an, die immer stimmt.'), [opt('0 geteilt durch eine negative Zahl ergibt 0.', true), opt('Eine negative Zahl geteilt durch 0 ergibt 0.', false, 'vorzeichen-division'),
    opt('Eine negative Zahl geteilt durch eine negative Zahl ist negativ.', false, 'vorzeichen-division'), opt('Ein Quotient ist immer kleiner als die erste Zahl.', false, 'div-falsche-rechenart')],
    H(3, 'Mache zu jeder Aussage die Probe mit einer Malaufgabe oder suche ein Gegenbeispiel.'), { nachweis: [FREI('0 : (−5) = 0, denn 0 · (−5) = 0. Durch 0 kann man nicht teilen.')] });
  const mittel = () => { const n = 4, w = [zz(-9, 3), zz(-9, 3), zz(-9, 3), zz(-9, 3)], s = w.reduce((x, y) => x + y, 0);
    if (s % n !== 0 || s >= 0 || new Set(w).size < 3) return null;
    const tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'];
    return antwort(Z('Die Tabelle zeigt die Temperatur an 4 Tagen am Morgen.', 'Berechne den Mittelwert.'), s / n, 'd', [[-s / n, 'vorzeichen-division'], [s, 'sach-schritt-vergessen']],
      H(3, 'Addiere alle Werte mit Vorzeichen. Teile die Summe durch die Anzahl der Tage.'), [`(${w.map((x, i) => (i ? k(x) : zt(x))).join(' + ')}) : ${n} = ${zt(s / n)}`], { einheit: '°C', daten: konto(['Tag', 'Temperatur in °C'], tage.map((t, i) => [t, zt(w[i])])) }); };
  const malDurch = () => { const a = zn(2, 9), b = zn(2, 9), c = zn(2, 6), p = a * b * c, e = X(':', X('·', a * c, b), c);
    if ([a, b, c].filter((x) => x < 0).length < 1 || p === 0) return null;
    return rechne(`Berechne ${txt(e)}.`, e, {}, [[neg(val(e)), 'vorzeichen-division']], H(3, 'Rechne von links nach rechts. Achte bei jedem Schritt auf das Vorzeichen.')); };

  sechs(D1, 'E', [
    durchZ(-1, 1), durchZ(1, -1), durchZ(-1, -1), durchZ(1, -1), pruefenD(true), pruefenD(false), zeichenD, zeilenD,
    zeilenD, sprungweg, abkuehlen, schulden, dividendFehlt, probe, durchD('z'), durchD('d'),
    durchD('z'), durchB(true), durchB(false), durchBZ, denken, null0, mittel, malDurch,
  ], 24);
}
