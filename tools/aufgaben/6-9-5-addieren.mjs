// Aufgaben zu 6.9.5 „Rationale Zahlen addieren und subtrahieren“ (Lernziele A1, A2) nach ADR 0015 und ADR 0059.
// Die Lerneinheit trägt im Buch die Marke E: 24 Aufgaben je Lernziel, nur auf E. Für alle anderen ist sie ein Abstecher.
// A1: ganze Zahlen addieren und subtrahieren. A2: Dezimalzahlen und Brüche mit Vorzeichen.
// Schreibweise wie in Klasse 7, aber ohne (+15): Nach einem Rechenzeichen steht eine negative Zahl in Klammern.
// Typische Fehler: die Beträge addiert, das Vorzeichen vergessen, Minus und Minus übersehen, in die falsche Richtung gegangen.

import { sechs, auswahl, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, T, zt, dt, bt, opt, zz, wahl, antwort, lk, lkd, H, X, kette, val, txt, glg, rechne, pruefe, aussagen, mauerR, fAdd, fSub, kind, istGanz, istDezimal } from './7-1-rational.mjs';

const A1 = '6.9.5-A1', A2 = '6.9.5-A2';
const MAUER = Z('Ergänze die Zahlenmauer.', 'Jeder Stein ist die Summe der beiden Steine darunter.');
const fMauer = (x) => (x[0] === 0 ? [] : [{ wert: -x[0], fehlvorstellung: 'vorzeichen-vergessen' }]);
const B = { form: 'b' };
const hA = H(3, 'Plus eine negative Zahl geht nach links. Minus eine negative Zahl geht nach rechts: Du addierst die Gegenzahl.');
const hS = H(3, 'Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren.');

export function addieren69() {
  // ================= A1: ganze Zahlen =================
  const add = (a, b) => () => { const e = X('+', a(), b()); return val(e)[0] === 0 ? null : rechne(`Berechne ${txt(e)}.`, e, {}, fAdd(e.l.q, e.r.q), hA); };
  const sub = (a, b) => () => { const e = X('−', a(), b()); return val(e)[0] === 0 ? null : rechne(`Berechne ${txt(e)}.`, e, {}, fSub(e.l.q, e.r.q), hS); };
  const z = (u, o, v = 1) => () => v * zz(u, o);
  const kette3 = (f) => () => { const [a, b, c, ops] = f(), e = X(ops[1], X(ops[0], a, b), c);
    if (val(e)[0] === 0) return null;
    return rechne(`Berechne ${txt(e)}.`, e, {}, [[neg(val(e)), 'vorzeichen-vergessen'], [val(X(ops[1], X(ops[0], Math.abs(a), Math.abs(b)), Math.abs(c))), 'betraege-addiert'], [val(X(ops[1] === '−' ? '+' : '−', X(ops[0], a, b), c)), 'minus-minus-uebersehen']], H(3, 'Rechne von links nach rechts. Schreibe nach jedem Schritt das Zwischenergebnis auf.')); };
  const fehlt = (art) => () => { const a = -zz(5, 60), w = zz(-80, 80), b = art === '+' ? w - a : w + a;
    if (w === 0 || b === 0) return null;
    // Die Lücke steht vorn: Hinter einem Rechenzeichen stünde eine negative Lösung ohne Klammer.
    const text = art === '+' ? `{{a}} + (${zt(a)}) = ${zt(w)}` : `{{a}} − (${zt(a)}) = ${zt(w)}`;
    const nw = art === '+' ? `${zt(w)} − (${zt(a)}) = ${zt(b)}` : `${zt(w)} + (${zt(a)}) = ${zt(b)}`;
    return luecken(Z('Ergänze die fehlende Zahl.', text), { a: lk(b, [[-b, 'vorzeichen-vergessen'], [art === '+' ? w + a : w - a, 'richtung-vertauscht']]) }, H(3, 'Rechne mit der Umkehraufgabe. Achte auf das Vorzeichen.'), { nachweis: [nw] }); };
  const pruefen = (stimmt) => () => { const a = -zz(12, 60), b = wahl([-1, 1]) * zz(12, 60), op = wahl(['+', '−']), e = X(op, a, b), w = val(e);
    if (w[0] === 0) return null;
    const f = op === '+' ? fAdd(a, b) : fSub(a, b), falsch = stimmt ? null : f[0][0], k = kind();
    return pruefe((beh) => Z(`${k} rechnet: ${beh}`, 'Prüfe die Rechnung.'), e, {}, falsch, op === '+' ? f[0][1] : f[0][1], hA, { andere: einmal(f.map((x) => x[0])) }); };
  const zeilen = () => { const daten = [];
    return aussagen(Z('Prüfe die Rechnungen.', 'Kreuze alle richtigen Rechnungen an.'), 4, (stimmt) => { const a = -zz(3, 30), b = wahl([-1, 1]) * zz(3, 30), op = wahl(['+', '−']), e = X(op, a, b), w = val(e)[0];
      if (daten.includes(`${a}${op}${b}`)) return null; daten.push(`${a}${op}${b}`);
      const f = op === '+' ? -w : a + b === w ? -w : a + b;
      return `${txt(e)} = ${zt(stimmt ? w : f === w ? -w : f)}`; }, 'minus-minus-uebersehen', H(3, 'Rechne jede Aufgabe selbst. Vergleiche dann mit dem Ergebnis.')); };
  const zuPlus = () => { const a = zz(-30, 30), b = -zz(3, 40), e = X('−', a, b), w = val(e)[0];
    if (a === 0 || w === 0) return null;
    return luecken(Z('Schreibe die Aufgabe als Plusaufgabe und berechne.', `${txt(e)} = ${zt(a)} + {{a}} = {{b}}`), { a: lk(-b, [[b, 'minus-minus-uebersehen']]), b: lk(w, [[a + b, 'minus-minus-uebersehen'], [-w, 'vorzeichen-vergessen']]) }, hS, { nachweis: [`${txt(e)} = ${zt(w)}`] }); };
  const geschickt = () => { const a = zz(13, 89), b = wahl([-1, 1]) * zz(13, 89), e = kette('+', -a, b, a);
    if (b === a || b === -a) return null;
    return rechne(`Berechne geschickt: ${txt(e)}`, e, {}, [[-b, 'vorzeichen-vergessen'], [b - 2 * a, 'betraege-addiert']], H(3, 'Suche zwei Zahlen, die zusammen null ergeben.')); };
  const rueck = () => { const s = -zz(5, 60), a = zz(5, 60), x = s - a;
    return antwort(Z(`Wenn du zu einer Zahl ${a} addierst, erhältst du ${zt(s)}.`, 'Gib die Zahl an.'), x, 'd', [[s + a, 'richtung-vertauscht'], [-x, 'vorzeichen-vergessen']], H(3, 'Rechne rückwärts mit der Umkehraufgabe.'), [`${zt(s)} − ${a} = ${zt(x)}`]); };
  const konto = () => { const a = zz(20, 150), s1 = zz(a + 10, 300), e = zz(10, 120), w = a - s1 + e;
    if (w === 0) return null;
    return antwort(Z(`Auf einem Konto sind ${a} €.`, `Es werden ${s1} € abgebucht und ${e} € gutgeschrieben.`, 'Schreibe eine Rechnung und berechne den Kontostand.'), w, 'd', [[a + s1 - e, 'richtung-vertauscht'], [-w, 'vorzeichen-vergessen'], [a - s1, 'sach-schritt-vergessen']], H(3, 'Abbuchung heißt minus, Gutschrift heißt plus.'), [`${a} − ${s1} + ${e} = ${zt(w)}`], { einheit: '€' }); };
  const temperaturen = () => { const a = -zz(3, 15), f = zz(2, 9), s = zz(5, 20), w = a - f + s;
    if (w === 0 || f === s) return null;
    return antwort(Z(`Um 6 Uhr sind es ${zt(a)} °C.`, `Bis 8 Uhr fällt die Temperatur um ${f} Grad, bis 14 Uhr steigt sie um ${s} Grad.`, 'Berechne die Temperatur um 14 Uhr.'), w, 'd', [[a + f - s, 'richtung-vertauscht'], [-w, 'vorzeichen-vergessen'], [a - f, 'sach-schritt-vergessen']], H(3, 'Fallen heißt minus, steigen heißt plus.'), [`${zt(a)} − ${f} + ${s} = ${zt(w)}`], { einheit: '°C' }); };
  const mauer = (offen) => () => { const a = -zz(5, 40), b = zz(5, 40), c = -zz(5, 40);
    if (a + b === 0 || b + c === 0 || a + 2 * b + c === 0) return null;
    return mauerR(MAUER, [a, b, c], offen, H(3, 'Ein Stein ist die Summe der beiden Steine darunter. Fehlt ein Stein unten, rechnest du mit der Umkehraufgabe.'), { fehler: fMauer }); };
  sechs(A1, 'E', [
    add(z(12, 95, -1), z(12, 95)), add(z(12, 95), z(12, 95, -1)), add(z(12, 95, -1), z(12, 95, -1)), add(z(105, 480, -1), z(105, 480)),
    sub(z(12, 60), z(61, 99)), sub(z(12, 95, -1), z(12, 95)), sub(z(12, 95), z(12, 95, -1)), sub(z(12, 95, -1), z(12, 95, -1)),
    kette3(() => [-zz(10, 60), zz(10, 60), zz(10, 60), ['+', '−']]), kette3(() => [zz(10, 60), -zz(10, 60), -zz(10, 60), ['−', '+']]),
    mauer([[1, 0], [1, 1], [2, 0]]), mauer([[0, 1], [1, 0], [2, 0]]),
    fehlt('+'), fehlt('−'), pruefen(true), pruefen(false), zeilen, zeilen,
    konto, temperaturen, rueck, zuPlus, geschickt, sub(z(105, 480, -1), z(105, 480, -1)),
  ], 24);

  // ================= A2: Dezimalzahlen und Brüche =================
  const dz = (u, o, v = 1, st = 1) => () => { const x = D(v * zz(u, o), st); return istGanz(x) ? null : x; };
  const brq = (nenner, v = 1, max = 1) => () => { const n = wahl(nenner), x = Q(v * zz(1, max * n - 1), n); return istGanz(x) || x[1] !== n ? null : x; };
  const r2 = (op, a, b, form = 'd') => () => { const x = a(), y = b();
    if (!x || !y) return null;
    const e = X(op, x, y), w = val(e);
    if (w[0] === 0) return null;
    return rechne(`Berechne ${txt(e, { form })}.${form === 'b' ? ' Kürze vollständig.' : ''}`, e, { form }, op === '+' ? fAdd(x, y) : fSub(x, y), form === 'b' ? H(3, 'Mache die Brüche gleichnamig. Bestimme dann das Vorzeichen wie bei ganzen Zahlen.') : H(3, 'Schreibe beide Zahlen mit gleich vielen Nachkommastellen. Rechne dann wie mit ganzen Zahlen.')); };
  const gemischt = () => { const x = D(-zz(11, 95)), y = Q(wahl([1, 3]), 4), e = X('+', x, y), w = val(e);
    if (istGanz(x) || w[0] === 0) return null;
    return rechne(`Berechne ${txt(e, { form: 'b' })} und gib das Ergebnis als Dezimalzahl an.`.replace(txt(e, { form: 'b' }), `${dt(x)} + ${bt(y)}`), e, {}, fAdd(x, y), H(3, 'Schreibe den Bruch als Dezimalzahl.'), { nachweis: [`${dt(x)} + ${dt(y)} = ${dt(w)}`] }); };
  const fehltD = () => { const a = D(-zz(11, 95)), w = D(zz(-95, 95)), b = minus(w, a);
    if (istGanz(a) || istGanz(w) || istGanz(b) || w[0] === 0) return null;
    return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} + (${dt(a)}) = ${dt(w)}`), { a: lkd(b, [[neg(b), 'vorzeichen-vergessen'], [plus(w, a), 'richtung-vertauscht']]) }, H(3, 'Rechne mit der Umkehraufgabe: Ergebnis minus erste Zahl.'), { nachweis: [`${dt(w)} − (${dt(a)}) = ${dt(b)}`] }); };
  const pruefenD = (stimmt) => () => { const a = D(-zz(11, 95)), b = D(wahl([-1, 1]) * zz(11, 95)), op = wahl(['+', '−']), e = X(op, a, b), w = val(e);
    if (istGanz(a) || istGanz(b) || w[0] === 0) return null;
    const f = op === '+' ? fAdd(a, b) : fSub(a, b), falsch = stimmt ? null : f[0][0], k = kind();
    return pruefe((beh) => Z(`${k} rechnet: ${beh}`, 'Prüfe die Rechnung.'), e, {}, falsch, f[0][1], hA, { andere: einmal(f.map((x) => x[0])) }); };
  const mauerD = () => { const a = D(-zz(11, 49)), b = D(zz(11, 49)), c = D(-zz(11, 49));
    if ([a, b, c].some(istGanz) || val(X('+', a, b))[0] === 0 || val(X('+', b, c))[0] === 0) return null;
    return mauerR(MAUER, [a, b, c], [[1, 0], [1, 1], [2, 0]], H(3, 'Addiere zwei Steine, die nebeneinander liegen. Achte auf die Vorzeichen.')); };
  const kontoD = () => { const a = D(zz(1005, 9995), 2), s = D(zz(10005, 20995), 2), e = D(zz(1005, 5995), 2), w = plus(minus(a, s), e);
    if ([a, s, e].some((x) => x[1] !== 100) || w[0] === 0) return null;
    return antwort(Z(`Auf einem Konto sind ${dt(a, 2)} €.`, `Es werden ${dt(s, 2)} € abgebucht und ${dt(e, 2)} € gutgeschrieben.`, 'Berechne den Kontostand.'), w, 'd', [[minus(plus(a, s), e), 'richtung-vertauscht'], [neg(w), 'vorzeichen-vergessen'], [minus(a, s), 'sach-schritt-vergessen']], H(3, 'Abbuchung heißt minus, Gutschrift heißt plus.'), [`${dt(a, 2)} − ${dt(s, 2)} + ${dt(e, 2)} = ${dt(w, 2)}`], { einheit: '€', geld: true }); };
  const tauchen = () => { const t = D(zz(105, 395), 2), s = D(zz(51, 199), 2), w = plus(neg(t), s);
    if ([t, s].some((x) => x[1] !== 100) || w[0] === 0 || !istDezimal(w, 2)) return null;
    return antwort(Z(`Ein Tauchroboter ist bei ${dt(neg(t))} m.`, `Er steigt um ${dt(s)} m.`, 'Berechne seine neue Höhe.'), w, 'd', [[minus(neg(t), s), 'richtung-vertauscht'], [neg(w), 'vorzeichen-vergessen']], H(3, 'Steigen heißt plus.'), [`${dt(neg(t))} + ${dt(s)} = ${dt(w)}`], { einheit: 'm' }); };
  const ketteB = () => { const n = wahl([4, 6, 8, 10]), a = Q(-zz(1, n - 1), n), b = Q(zz(1, n - 1), n), c = Q(-zz(1, n - 1), n), e = X('−', X('+', a, b), c), w = val(e);
    if ([a, b, c].some((x) => x[1] !== n) || w[0] === 0) return null;
    return rechne(`Berechne ${txt(e, B)}. Kürze vollständig.`, e, B, [[neg(w), 'vorzeichen-vergessen'], [val(X('+', X('+', a, b), c)), 'minus-minus-uebersehen']], H(3, 'Die Brüche sind gleichnamig. Rechne mit den Zählern von links nach rechts.')); };
  const zeilenD = () => { const ges = [];
    return aussagen(Z('Prüfe die Rechnungen.', 'Kreuze alle richtigen Rechnungen an.'), 4, (stimmt) => { const a = D(-zz(11, 95)), b = D(wahl([-1, 1]) * zz(11, 95)), op = wahl(['+', '−']), e = X(op, a, b), w = val(e);
      if (istGanz(a) || istGanz(b) || w[0] === 0 || ges.includes(txt(e))) return null; ges.push(txt(e));
      const f = (op === '+' ? fAdd(a, b) : fSub(a, b)).map((x) => x[0]).find((x) => x[0] * w[1] !== w[0] * x[1] && istDezimal(x, 1));
      if (!f) return null;
      return `${txt(e)} = ${dt(stimmt ? w : f)}`; }, 'betraege-addiert', H(3, 'Rechne jede Aufgabe selbst. Vergleiche dann mit dem Ergebnis.')); };
  const rueckB = () => { const n = wahl([3, 4, 5, 6]), s = Q(-zz(1, n - 1), n), a = Q(zz(1, n - 1), n), x = minus(s, a);
    if (s[1] !== n || a[1] !== n || istGanz(x)) return null;
    return antwort(Z(`Wenn du zu einer Zahl ${bt(a)} addierst, erhältst du ${bt(s)}.`, 'Gib die Zahl an. Kürze vollständig.'), x, 'b', [[plus(s, a), 'richtung-vertauscht'], [neg(x), 'vorzeichen-vergessen']], H(3, 'Rechne rückwärts mit der Umkehraufgabe.'), [`${bt(s)} − ${bt(a)} = ${bt(x)}`]); };
  sechs(A2, 'E', [
    r2('+', dz(11, 95, -1), dz(11, 95)), r2('+', dz(11, 95), dz(11, 95, -1)), r2('+', dz(11, 95, -1), dz(101, 995, -1, 2)), r2('−', dz(11, 95), dz(11, 95, -1)),
    r2('−', dz(11, 95, -1), dz(11, 95)), r2('−', dz(101, 995, -1, 2), dz(101, 995, -1, 2)), r2('−', dz(11, 49), dz(51, 99)),
    r2('+', brq([3, 5, 7, 9], -1), brq([3, 5, 7, 9]), 'b'), r2('−', brq([4, 6, 8], -1), brq([4, 6, 8]), 'b'), r2('+', brq([2, 4], -1, 3), brq([3, 6], -1), 'b'), r2('−', brq([3], 1), brq([4], -1), 'b'), r2('−', brq([5, 10], -1, 2), brq([2], -1), 'b'),
    gemischt, fehltD, pruefenD(true), pruefenD(false), mauerD, kontoD,
    tauchen, ketteB, zeilenD, rueckB, r2('+', dz(1001, 9999, -1, 3), dz(11, 95)), r2('−', brq([6, 8, 12], 1), brq([4, 3], 1, 2), 'b'),
  ], 24);
}

// Falsche Werte nur einmal anbieten: Zwei Fehlvorstellungen können denselben Wert liefern.
function einmal(werte) {
  const raus = [];
  for (const x of werte) if (x != null && !raus.some((y) => y[0] * x[1] === x[0] * y[1])) raus.push(x);
  return raus;
}
