// Aufgaben zu 6.6.1 „Oberflächeninhalt des Quaders“ (Lernziele O1, O2) nach ADR 0015 und ADR 0049.
// O1: Oberflächeninhalt berechnen. F füllt eine Tabelle mit den drei Flächenpaaren, G rechnet mit der Formel und einem Zwischenergebnis,
// ab M zählt nur das Ergebnis. O2: Sachaufgaben (Verpackung, ohne Deckel, Wände); die fehlende Kante aus dem Oberflächeninhalt gibt es nur auf E.

import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, opt, auswahl, luecken, tabelle, L, H, zahl, lk, kind, zweiKinder, FREI, mm, T, mz, Q, gehtAuf, EW, flaeche, laenge, volumen,
  QN, BN, WERT, URTEIL, VGL, HG, quaderBild, netzBild, kanten } from './6-6-quader.mjs';

const O1 = '6.6.1-O1', O2 = '6.6.1-O2';
const q2 = (e) => `${e}²`, q3 = (e) => `${e}³`;
// Rechnungen des Nachweises für einen Quader mit ganzen oder Komma-Kanten (Millimeter) in der Einheit e.
const oRechnung = (a, b, c, e) => { const q = Q(a, b, c), f = q2(e);
  return [`${T(a, e)} · ${T(b, e)} = ${T(q.ab, f)}`, `${T(a, e)} · ${T(c, e)} = ${T(q.ac, f)}`, `${T(b, e)} · ${T(c, e)} = ${T(q.bc, f)}`, `2 · (${T(q.ab, f)} + ${T(q.ac, f)} + ${T(q.bc, f)}) = ${T(q.O, f)}`]; };
// Typische Fehler beim Oberflächeninhalt (Werte in mm²): nur drei Flächen, Volumen statt Oberfläche (Maßzahl), nur eine Fläche.
const oFehler = (a, b, c, e) => { const q = Q(a, b, c); return [[q.O / 2, 'oberflaeche-drei-flaechen'], [(q.V / mm(1, e) ** 3) * mm(1, e) ** 2, 'volumen-oberflaeche-verwechselt'], [q.ab, 'oberflaeche-drei-flaechen']]; };

// Tabelle mit den drei Flächenpaaren (F). a, b, c ganze Zahlen in der Einheit e.
function paarTabelle(zeilen, a, b, c, e, hilfen, bild) {
  const x = a * b, y = a * c, z = b * c, o = 2 * (x + y + z), f = q2(e);
  return tabelle(Z(...zeilen, 'Fülle die Tabelle aus.'),
    ['Flächen', 'Rechnung', `eine Fläche in ${f}`, `beide Flächen in ${f}`],
    [['Boden und Deckel', `${a} · ${b}`, L('x'), L('x2')], ['vorne und hinten', `${a} · ${c}`, L('y'), L('y2')], ['links und rechts', `${b} · ${c}`, L('z'), L('z2')], ['Oberflächeninhalt', '', '', L('o')]],
    { x: lk(x, [[a + b, 'umfang-flaeche-verwechselt']]), x2: lk(2 * x, [[x, 'oberflaeche-drei-flaechen']]), y: lk(y, [[a + c, 'umfang-flaeche-verwechselt']]), y2: lk(2 * y, [[y, 'oberflaeche-drei-flaechen']]),
      z: lk(z, [[b + c, 'umfang-flaeche-verwechselt']]), z2: lk(2 * z, [[z, 'oberflaeche-drei-flaechen']]), o: lk(o, [[x + y + z, 'oberflaeche-drei-flaechen'], [a * b * c, 'volumen-oberflaeche-verwechselt']]) },
    hilfen, { bild, nachweis: [`${a} · ${b} = ${x}`, `${a} · ${c} = ${y}`, `${b} · ${c} = ${z}`, `2 · ${x} = ${2 * x}`, `2 · ${y} = ${2 * y}`, `2 · ${z} = ${2 * z}`, `${2 * x} + ${2 * y} + ${2 * z} = ${o}`, BN('oberflaeche', `${o} ${f}`)] });
}
const hTab = H('F', 'Rechne jede Zeile für sich: Länge mal Breite der Fläche.', 'Boden mit 5 cm und 4 cm: 5 · 4 = 20. Boden und Deckel zusammen: 2 · 20 = 40.', 'Addiere zum Schluss die drei Zahlen der letzten Spalte.');
// Würfel als Lückentext (F).
function wuerfelLuecken(zeilen, a, e, bild) {
  const f = a * a, o = 6 * f;
  return luecken(Z(...zeilen, `Eine Fläche: ${a} ${e} · ${a} ${e} = {{f}} ${q2(e)}`, `Alle sechs Flächen: 6 · {{g}} ${q2(e)} = {{o}} ${q2(e)}`),
    { f: lk(f, [[2 * a, 'umfang-flaeche-verwechselt'], [4 * a, 'umfang-flaeche-verwechselt']]), g: lk(f), o: lk(o, [[3 * f, 'oberflaeche-drei-flaechen'], [a * a * a, 'volumen-oberflaeche-verwechselt'], [4 * f, 'oberflaeche-drei-flaechen']]) },
    H('F', 'Alle sechs Flächen vom Würfel sind gleich groß.', 'Würfel mit 2 cm Kante: Eine Fläche hat 2 cm · 2 cm = 4 cm². Sechs Flächen: 6 · 4 cm² = 24 cm².', 'Rechne zuerst eine Fläche aus. Nimm sie dann mal 6.'),
    { bild, nachweis: [`${a} ${e} · ${a} ${e} = ${f} ${q2(e)}`, `6 · ${f} ${q2(e)} = ${o} ${q2(e)}`, BN('oberflaeche', `${o} ${q2(e)}`)] });
}
const hForm = (n) => H(n, 'Rechne die drei verschiedenen Flächen aus und addiere sie.', 'a = 5 cm, b = 4 cm, c = 2 cm: 20 cm² + 10 cm² + 8 cm² = 38 cm². Dann 2 · 38 cm² = 76 cm².', 'Nimm die Summe der drei Flächen mal 2.');
const hErg = (n) => H(n, 'Jede Fläche kommt zweimal vor: O = 2 · (a · b + a · c + b · c).', 'Achte auf die Einheit: Ein Flächeninhalt hat eine Flächeneinheit wie cm².');

// Oberflächeninhalt als Größe (ab G mit Einheitenwahl). a, b, c in Millimetern.
function oAufgabe(niveau, zeilen, a, b, c, e, hilfen, { bild = null, einheit = q2(e), einheiten = EW(e), verlangt = false, zusatz = [] } = {}) {
  const q = Q(a, b, c);
  if (!gehtAuf(q.O, einheit)) return null;
  return flaeche(Z(...zeilen), q.O, einheit, [...oFehler(a, b, c, e), ...zusatz], hilfen, { ...(niveau === 'F' ? {} : { einheiten }), ...(verlangt ? { verlangt: true } : {}), bild,
    nachweis: [...oRechnung(a, b, c, e), bild ? BN('oberflaeche', T(q.O, q2(e))) : QN([T(a, e), T(b, e), T(c, e)], 'oberflaeche', T(q.O, q2(e))), ...(einheit !== q2(e) ? [`${T(q.O, q2(e))} = ${T(q.O, einheit)}`] : [])] });
}
const kText = (a, b, c, e) => `a = ${T(a, e)}, b = ${T(b, e)} und c = ${T(c, e)}`;

export function oberflaeche6() {
  // ================= O1: Oberflächeninhalt berechnen =================
  sechs(O1, 'F', [
    () => { const [a, b, c] = kanten(2, 6); return paarTabelle([`Der Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch.`, 'Berechne den Oberflächeninhalt.'], a, b, c, 'cm', hTab, quaderBild(mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm')); },
    () => { const [a, b, c] = kanten(1, 5); if (2 * c + b > 11) return null;
      return paarTabelle(['Das Bild zeigt das Netz von einem Quader.', 'Gleiche Farbe heißt: gleich große Flächen.', 'Berechne den Oberflächeninhalt.'], a, b, c, 'cm', hTab, netzBild(a, b, c, 'cm')); },
    () => { const a = zz(2, 6); return wuerfelLuecken([`Der Würfel hat die Kantenlänge ${a} cm.`, 'Berechne den Oberflächeninhalt.'], a, 'cm', quaderBild(mm(a, 'cm'), mm(a, 'cm'), mm(a, 'cm'), 'cm')); },
    () => { const a = zz(3, 8), c = suche(() => zz(2, 9), (x) => x !== a); return paarTabelle([`Der Quader hat einen quadratischen Boden mit ${a} dm Seitenlänge.`, `Er ist ${c} dm hoch.`, 'Berechne den Oberflächeninhalt.'], a, a, c, 'dm', hTab, quaderBild(mm(a, 'dm'), mm(a, 'dm'), mm(c, 'dm'), 'dm')); },
    () => { const [a, b, c] = kanten(2, 6), q = Q(a, b, c), kn = kind();
      return auswahl(Z(`${kn} sucht den Oberflächeninhalt von dem Quader.`, 'Kreuze die richtige Rechnung an.'),
        [opt(`2 · ${q.ab} cm² + 2 · ${q.ac} cm² + 2 · ${q.bc} cm² = ${q.O} cm²`, true), opt(`${q.ab} cm² + ${q.ac} cm² + ${q.bc} cm² = ${q.O / 2} cm²`, false, 'oberflaeche-drei-flaechen'), opt(`${a} cm · ${b} cm · ${c} cm = ${q.V} cm³`, false, 'volumen-oberflaeche-verwechselt')],
        H('F', 'Ein Quader hat sechs Flächen.', 'Jede Fläche gibt es zweimal: unten und oben, vorne und hinten, links und rechts.', 'Suche die Rechnung mit allen sechs Flächen.'), { bild: quaderBild(mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm'), nachweis: [BN('oberflaeche', `${q.O} cm²`), WERT(`${q.O} cm²`)] }); },
    () => { const a = zz(7, 10); return wuerfelLuecken([`Ein Spielwürfel aus Holz hat ${a} mm lange Kanten.`, 'Berechne den Oberflächeninhalt.'], a, 'mm', quaderBild(a, a, a, 'mm')); },
  ]);
  sechs(O1, 'G', [
    () => { const [a, b, c] = kanten(3, 12), s = a * b + a * c + b * c;
      return luecken(Z(`Die Kanten sind a = ${a} cm, b = ${b} cm und c = ${c} cm.`, 'Berechne mit der Formel O = 2 · (a · b + a · c + b · c).', `Die Klammer: ${a} · ${b} + ${a} · ${c} + ${b} · ${c} = {{s}}`, 'O = {{o}} cm²'),
        { s: lk(s, [[a * b * c, 'volumen-oberflaeche-verwechselt']]), o: lk(2 * s, [[s, 'oberflaeche-drei-flaechen'], [a * b * c, 'volumen-oberflaeche-verwechselt']]) }, hForm('G'),
        { bild: quaderBild(mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm'), nachweis: [`${a} · ${b} + ${a} · ${c} + ${b} · ${c} = ${s}`, `2 · ${s} = ${2 * s}`, BN('oberflaeche', `${2 * s} cm²`)] }); },
    () => { const [a, b, c] = kanten(2, 9); return oAufgabe('G', ['Berechne den Oberflächeninhalt von dem Quader.', 'Wähle auch die passende Einheit.'], mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', hForm('G'), { bild: quaderBild(mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm') }); },
    () => { const a = zz(11, 20), A = mm(a, 'cm');
      return flaeche(Z(`Ein Würfel hat die Kantenlänge ${a} cm.`, 'Berechne den Oberflächeninhalt.', 'Wähle auch die passende Einheit.'), 6 * A * A, 'cm²', [[3 * A * A, 'oberflaeche-drei-flaechen'], [A * A, 'oberflaeche-drei-flaechen'], [4 * A * A, 'oberflaeche-drei-flaechen']],
        H('G', 'Beim Würfel sind alle sechs Flächen gleich groß.', 'Kante 10 cm: Eine Fläche hat 10 cm · 10 cm = 100 cm². Dann 6 · 100 cm² = 600 cm².', 'Rechne eine Fläche aus und nimm sie mal 6.'),
        { einheiten: EW('cm'), nachweis: [`${a} cm · ${a} cm = ${a * a} cm²`, `6 · ${a * a} cm² = ${T(6 * A * A, 'cm²')}`, QN([`${a} cm`, `${a} cm`, `${a} cm`], 'oberflaeche', T(6 * A * A, 'cm²'))] }); },
    () => { const [a, b, c] = kanten(2, 8); return oAufgabe('G', [`Ein Container ist ${a} m lang, ${b} m breit und ${c} m hoch.`, 'Berechne seinen Oberflächeninhalt.', 'Wähle auch die passende Einheit.'], mm(a, 'm'), mm(b, 'm'), mm(c, 'm'), 'm', hForm('G')); },
    () => { const [a, b, c] = kanten(3, 9), q = Q(a, b, c), kn = kind();
      return auswahl(Z(`${kn} rechnet für den Quader: ${q.ab} cm² + ${q.ac} cm² + ${q.bc} cm² = ${q.O / 2} cm².`, `${kn} sagt: „Das ist der Oberflächeninhalt.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Jede Fläche gibt es zweimal. Der Oberflächeninhalt ist ${q.O} cm².`, true), opt('Stimmt.', false, 'oberflaeche-drei-flaechen'), opt(`Falsch. Der Oberflächeninhalt ist ${q.V} cm².`, false, 'volumen-oberflaeche-verwechselt')],
        H('G', 'Zähle die Flächen von dem Quader.', 'Ein Quader hat 6 Flächen: Boden, Deckel, vorne, hinten, links, rechts.', 'In der Rechnung stehen nur 3 Flächen.'), { bild: quaderBild(mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm'), nachweis: [BN('oberflaeche', `${q.O} cm²`), URTEIL(false)] }); },
    () => { const [a, b, c] = kanten(3, 9), [d, e2, f] = suche(() => kanten(3, 9), ([x, y, z]) => x * y * z !== a * b * c || x + y + z !== a + b + c), p = Q(a, b, c), r = Q(d, e2, f);
      if (p.O === r.O) return null;
      return auswahl(Z(`Quader A hat die Kanten ${a} cm, ${b} cm und ${c} cm.`, `Quader B hat die Kanten ${d} cm, ${e2} cm und ${f} cm.`, 'Kreuze den Quader mit dem größeren Oberflächeninhalt an.'),
        [opt('Quader A', p.O > r.O), opt('Quader B', r.O > p.O), opt('Beide sind gleich groß.', false)], H('G', 'Berechne beide Oberflächeninhalte.', 'Für jeden Quader: drei Flächen ausrechnen, addieren, mal 2.', 'Vergleiche dann die beiden Ergebnisse.'),
        { nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${p.O} cm²`), QN([`${d} cm`, `${e2} cm`, `${f} cm`], 'oberflaeche', `${r.O} cm²`), VGL(`${p.O} cm²`, `${r.O} cm²`, { groesser: 'Quader A', kleiner: 'Quader B', gleich: 'Beide sind gleich groß.' })] }); },
  ]);
  sechs(O1, 'M', [
    () => { const a = mm(zz(4, 9), 'cm'), b = mm(zz(2, 6), 'cm'), c = mm(wahl([15, 25, 35, 45]), 'cm', true); return oAufgabe('M', [`Ein Quader hat die Kanten ${kText(a, b, c, 'cm')}.`, 'Berechne den Oberflächeninhalt.'], a, b, c, 'cm', hErg('M')); },
    () => { const a = mm(zz(3, 6) * 10, 'cm'), b = mm(zz(2, 4), 'dm'), c = mm(wahl([15, 25, 35]), 'cm'), q = Q(a, b, c);
      const falsch = 2 * ((a / 10) * (b / 100) + (a / 10) * (c / 10) + (b / 100) * (c / 10)) * 100; // 40 · 2 statt 40 · 20
      return flaeche(Z(`Ein Quader hat die Kanten a = ${T(a, 'cm')}, b = ${T(b, 'dm')} und c = ${T(c, 'cm')}.`, 'Berechne den Oberflächeninhalt.'), q.O, 'cm²', [[falsch, 'einheiten-nicht-angeglichen'], [q.O / 2, 'oberflaeche-drei-flaechen']],
        H('M', 'Die Kanten haben verschiedene Einheiten. Wandle zuerst um.', `${T(b, 'dm')} = ${T(b, 'cm')}. Rechne dann alles in Zentimetern.`), { einheiten: ['cm²', 'dm²', 'cm³', 'dm³'], nachweis: [`${T(b, 'dm')} = ${T(b, 'cm')}`, ...oRechnung(a, b, c, 'cm'), QN([T(a, 'cm'), T(b, 'cm'), T(c, 'cm')], 'oberflaeche', T(q.O, 'cm²'))] }); },
    () => { const a = mm(wahl([15, 25, 35, 45]), 'cm', true), o = 6 * a * a;
      return flaeche(Z(`Ein Würfel hat die Kantenlänge ${T(a, 'cm')}.`, 'Berechne den Oberflächeninhalt.'), o, 'cm²', [[3 * a * a, 'oberflaeche-drei-flaechen'], [a * a, 'oberflaeche-drei-flaechen']],
        H('M', 'Der Würfel hat sechs gleich große Quadrate: O = 6 · a · a.', `Eine Fläche: ${T(a, 'cm')} · ${T(a, 'cm')} = ${T(a * a, 'cm²')}.`), { einheiten: EW('cm'), nachweis: [`${T(a, 'cm')} · ${T(a, 'cm')} = ${T(a * a, 'cm²')}`, `6 · ${T(a * a, 'cm²')} = ${T(o, 'cm²')}`, QN([T(a, 'cm'), T(a, 'cm'), T(a, 'cm')], 'oberflaeche', T(o, 'cm²'))] }); },
    () => { const a = mm(wahl([25, 35, 45]), 'm', true), b = mm(zz(2, 4), 'm'), c = mm(wahl([12, 15, 24]), 'm', true); return oAufgabe('M', [`Ein Raum ist ${T(a, 'm')} lang, ${T(b, 'm')} breit und ${T(c, 'm')} hoch.`, 'Berechne den Oberflächeninhalt des Raums: Boden, Decke und alle Wände.'], a, b, c, 'm', hErg('M')); },
    () => { const a = mm(zz(4, 8), 'cm'), b = mm(zz(3, 6), 'cm'), c = mm(wahl([15, 25, 35]), 'cm', true), s = mm(wahl([35, 45]), 'cm', true), p = Q(a, b, c), r = Q(s, s, s);
      if (p.O === r.O) return null;
      return auswahl(Z(`Ein Quader hat die Kanten ${kText(a, b, c, 'cm')}.`, `Ein Würfel hat die Kantenlänge ${T(s, 'cm')}.`, 'Kreuze den Körper mit dem größeren Oberflächeninhalt an.'), [opt('der Quader', p.O > r.O), opt('der Würfel', r.O > p.O), opt('Beide sind gleich groß.', false)],
        H('M', 'Berechne beide Oberflächeninhalte und vergleiche.', `Würfel: 6 · ${T(s, 'cm')} · ${T(s, 'cm')} = ${T(r.O, 'cm²')}.`), { nachweis: [QN([T(a, 'cm'), T(b, 'cm'), T(c, 'cm')], 'oberflaeche', T(p.O, 'cm²')), QN([T(s, 'cm'), T(s, 'cm'), T(s, 'cm')], 'oberflaeche', T(r.O, 'cm²')), VGL(T(p.O, 'cm²'), T(r.O, 'cm²'), { groesser: 'der Quader', kleiner: 'der Würfel', gleich: 'Beide sind gleich groß.' })] }); },
    () => { const [a, b, c] = kanten(3, 9), q = Q(a, b, c), kn = kind();
      return auswahl(Z(`${kn} berechnet den Oberflächeninhalt eines Quaders mit ${a} cm, ${b} cm und ${c} cm so: ${a} · ${b} · ${c} = ${q.V}.`, 'Kreuze die Erklärung für den Fehler an.'),
        [opt('Das ist die Rechnung für das Volumen. Für den Oberflächeninhalt berechnet man die sechs Flächen und addiert sie.', true), opt('Die Rechnung stimmt, es fehlt nur die Einheit.', false, 'volumen-oberflaeche-verwechselt'), opt('Das Ergebnis muss noch verdoppelt werden.', false, 'volumen-oberflaeche-verwechselt'), opt('Die drei Kanten müssen addiert werden.', false, 'umfang-flaeche-verwechselt')],
        H('M', 'Überlege, was Länge mal Breite mal Höhe angibt.', 'Der Oberflächeninhalt ist eine Fläche: Jede Teilfläche ist Länge mal Breite.'), { nachweis: [FREI('Volumen und Oberflächeninhalt unterscheiden')] }); },
  ]);
  sechs(O1, 'E', [
    () => { const [a, b, c] = kanten(3, 8), q = Q(a, b, c);
      return auswahl(Z(`Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c} cm.`, 'Kreuze alle Rechnungen an, die seinen Oberflächeninhalt ergeben.'),
        [opt(`2 · ${a} cm · ${b} cm + 2 · ${a} cm · ${c} cm + 2 · ${b} cm · ${c} cm`, true), opt(`2 · (${q.ab} cm² + ${q.ac} cm² + ${q.bc} cm²)`, true), opt(`${q.ab} cm² + ${q.ac} cm² + ${q.bc} cm²`, false, 'oberflaeche-drei-flaechen'), opt(`2 · ${q.ab} cm² + ${q.ac} cm² + ${q.bc} cm²`, false, 'oberflaeche-drei-flaechen'), opt(`${q.O / 2} cm² + ${q.O / 2} cm²`, true)],
        H('E', 'Rechne jede Rechnung aus und vergleiche mit dem Oberflächeninhalt.'), { mehrfach: true, nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${q.O} cm²`), WERT(`${q.O} cm²`)] }); },
    () => { const a = zz(2, 5), o1 = 6 * a * a, o2 = 6 * 4 * a * a;
      return zahl(Z(`Ein Würfel hat die Kantenlänge ${a} cm.`, 'Jede Kante wird verdoppelt.', 'Gib an, wie viel mal so groß der Oberflächeninhalt dann ist.'), 4, [[2, 'volumen-waechst-wie-kante'], [8, 'volumen-oberflaeche-verwechselt'], [6, 'volumen-waechst-wie-kante']],
        H('E', 'Berechne den Oberflächeninhalt vorher und nachher und teile.'), { nachweis: [`2 · ${a} cm = ${2 * a} cm`, QN([`${a} cm`, `${a} cm`, `${a} cm`], 'oberflaeche', `${o1} cm²`), QN([`${2 * a} cm`, `${2 * a} cm`, `${2 * a} cm`], 'oberflaeche', `${o2} cm²`), `${o2} cm² : ${o1} cm² = 4`] }); },
    () => { const [a, b, c] = kanten(2, 7), q = Q(a, b, 2 * c), alt = Q(a, b, c);
      return flaeche(Z(`Ein Quader hat die Kanten a = ${a} cm, b = ${b} cm und c = ${c} cm.`, 'Nur die Höhe c wird verdoppelt.', 'Berechne den neuen Oberflächeninhalt.'), q.O * 100, 'cm²', [[2 * alt.O * 100, 'volumen-waechst-wie-kante'], [alt.O * 100, 'sach-schritt-vergessen'], [(q.O / 2) * 100, 'oberflaeche-drei-flaechen']],
        H('E', 'Boden und Deckel bleiben gleich groß. Nur die vier Seitenflächen wachsen.'), { einheiten: EW('cm'), nachweis: [`2 · ${c} cm = ${2 * c} cm`, QN([`${a} cm`, `${b} cm`, `${2 * c} cm`], 'oberflaeche', `${q.O} cm²`)] }); },
    () => auswahl(Z('Bei einem Würfel werden alle Kanten verdoppelt.', 'Kreuze die Begründung an, warum der Oberflächeninhalt dann viermal so groß ist.'),
      [opt('Jede Fläche wird doppelt so lang und doppelt so breit. Also ist jede Fläche viermal so groß.', true), opt('Der Würfel hat danach doppelt so viele Flächen.', false, 'volumen-waechst-wie-kante'), opt('Jede Kante ist doppelt so lang, also ist auch jede Fläche doppelt so groß.', false, 'volumen-waechst-wie-kante'), opt('Es kommen vier neue Würfel dazu.', false, 'volumen-oberflaeche-verwechselt')],
      H('E', 'Zeichne ein Quadrat und eines mit doppelter Seitenlänge. Zähle, wie oft das kleine hineinpasst.'), { nachweis: [FREI('Wachstum des Oberflächeninhalts begründen')] }),
    () => { const a = mm(wahl([12, 15, 16]), 'm', true), b = mm(wahl([60, 80]), 'cm'), c = mm(wahl([4, 5]), 'dm'), q = Q(a, b, c);
      if (!gehtAuf(q.O, 'm²')) return null;
      return flaeche(Z(`Eine Truhe ist ${T(a, 'm')} lang, ${T(b, 'cm')} breit und ${T(c, 'dm')} hoch.`, 'Berechne ihren Oberflächeninhalt in Quadratmetern.'), q.O, 'm²', [[q.O / 2, 'oberflaeche-drei-flaechen'], [q.O * 10, 'umrechnungszahl'], [q.O / 10, 'umrechnungszahl']],
        H('E', 'Wandle zuerst alle Kanten in Meter um.'), { einheiten: ['m²', 'dm²', 'cm²', 'm³'], verlangt: true, nachweis: [`${T(b, 'cm')} = ${T(b, 'm')}`, `${T(c, 'dm')} = ${T(c, 'm')}`, ...oRechnung(a, b, c, 'm'), QN([T(a, 'm'), T(b, 'm'), T(c, 'm')], 'oberflaeche', T(q.O, 'm²'))] }); },
    () => { const [a, b, c] = kanten(3, 8), q = Q(a, b, c), falsch = 2 * q.ab + 2 * q.ac + q.bc, kn = kind();
      return auswahl(Z(`${kn} rechnet für einen Quader mit ${a} cm, ${b} cm und ${c} cm: 2 · ${q.ab} cm² + 2 · ${q.ac} cm² + ${q.bc} cm² = ${falsch} cm².`, 'Beurteile die Rechnung.'),
        [opt(`Falsch. Die Fläche mit ${q.bc} cm² gibt es auch zweimal. Richtig sind ${q.O} cm².`, true), opt('Stimmt.', false, 'oberflaeche-drei-flaechen'), opt(`Falsch. Jede Fläche zählt nur einmal. Richtig sind ${q.O / 2} cm².`, false, 'oberflaeche-drei-flaechen'), opt(`Falsch. Richtig sind ${q.V} cm².`, false, 'volumen-oberflaeche-verwechselt')],
        H('E', 'Prüfe, ob jede der drei Flächen zweimal vorkommt.'), { nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${q.O} cm²`), URTEIL(false)] }); },
  ]);

  // ================= O2: Sachaufgaben und fehlende Kante =================
  const hSach = (n) => H(n, 'Überlege zuerst, welche Flächen gebraucht werden.', 'Schachtel mit 5 cm, 4 cm, 2 cm: 2 · 20 cm² + 2 · 10 cm² + 2 · 8 cm² = 76 cm².', 'Rechne jede Fläche aus und addiere.');
  sechs(O2, 'F', [
    () => { const [a, b, c] = kanten(1, 5), kn = kind(); if (2 * c + b > 11) return null;
      return paarTabelle([`${kn} beklebt eine Schachtel ganz mit Papier.`, 'Das Bild zeigt ihr Netz.', 'Berechne, wie viel Papier nötig ist.'], a, b, c, 'cm', hTab, netzBild(a, b, c, 'cm')); },
    () => { const a = zz(3, 9), kn = kind(); return wuerfelLuecken([`${kn} malt einen Holzwürfel außen ganz an.`, `Der Würfel hat ${a} cm lange Kanten.`, 'Berechne die Fläche zum Anmalen.'], a, 'cm', quaderBild(mm(a, 'cm'), mm(a, 'cm'), mm(a, 'cm'), 'cm')); },
    () => { const [a, b, c] = kanten(2, 9); return paarTabelle(['Eine Schatztruhe auf der Burg bekommt außen neues Leder.', `Sie ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, 'Berechne, wie viel Leder nötig ist.'], a, b, c, 'dm', hTab, quaderBild(mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm')); },
    () => { const [a, b, c] = kanten(2, 5), q = Q(a, b, c); if (2 * c + b > 11) return null;
      return flaeche(Z('Das Bild zeigt das Netz von einem Umzugskarton.', 'In jeder Fläche steht ihr Flächeninhalt in dm².', 'Berechne den Oberflächeninhalt vom Karton.'), q.O * 10000, 'dm²', [[(q.O / 2) * 10000, 'oberflaeche-drei-flaechen'], [(q.ab + q.ac + q.bc + q.ab) * 10000, 'oberflaeche-drei-flaechen']],
        H('F', 'Der Oberflächeninhalt ist die Summe aller sechs Flächen.', 'Flächen 6, 6, 3, 3, 2, 2: zusammen 22 dm².', 'Addiere alle sechs Zahlen im Netz.'), { bild: netzBild(a, b, c, 'dm', { werte: true }), nachweis: [`${q.ab} + ${q.ab} + ${q.ac} + ${q.ac} + ${q.bc} + ${q.bc} = ${q.O}`, BN('oberflaeche', `${q.O} dm²`)] }); },
    () => { const [a, b, c] = kanten(2, 6), q = Q(a, b, c), mehr = zz(0, 1), papier = q.O + (mehr ? zz(2, 9) : -zz(2, 9)), kn = kind();
      return auswahl(Z(`${kn} will die Schachtel ganz mit Papier bekleben.`, `${kn} hat ${papier} cm² Papier.`, 'Kreuze die richtige Antwort an.'), [opt(`Das Papier reicht. Nötig sind ${q.O} cm².`, mehr === 1), opt(`Das Papier reicht nicht. Nötig sind ${q.O} cm².`, mehr === 0), opt(`Das Papier reicht. Nötig sind nur ${q.O / 2} cm².`, false, 'oberflaeche-drei-flaechen')],
        H('F', 'Berechne zuerst den Oberflächeninhalt der Schachtel.', 'Jede der drei Flächen gibt es zweimal.', 'Vergleiche dann mit dem Papier.'), { bild: quaderBild(mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm'),
          nachweis: [BN('oberflaeche', `${q.O} cm²`), VGL(`${papier} cm²`, `${q.O} cm²`, { groesser: `Das Papier reicht. Nötig sind ${q.O} cm².`, kleiner: `Das Papier reicht nicht. Nötig sind ${q.O} cm².`, gleich: `Das Papier reicht. Nötig sind ${q.O} cm².` })] }); },
    () => { const a = zz(2, 6), o = 6 * a * a, kn = kind();
      return flaeche(Z(`${kn} bastelt einen Würfel aus Pappe.`, `Jede Kante ist ${a} cm lang.`, 'Berechne, wie viel Pappe für alle Flächen nötig ist.'), o * 100, 'cm²', [[3 * a * a * 100, 'oberflaeche-drei-flaechen'], [a * a * 100, 'oberflaeche-drei-flaechen'], [4 * a * a * 100, 'oberflaeche-drei-flaechen']],
        H('F', 'Ein Würfel hat sechs gleiche Flächen.', 'Kante 2 cm: Eine Fläche hat 2 cm · 2 cm = 4 cm². Sechs Flächen: 6 · 4 cm² = 24 cm².', 'Rechne eine Fläche aus und nimm sie mal 6.'), { bild: netzBild(a, a, a, 'cm'), nachweis: [`${a} cm · ${a} cm = ${a * a} cm²`, `6 · ${a * a} cm² = ${o} cm²`, BN('oberflaeche', `${o} cm²`)] }); },
  ]);
  // Offener Quader: Boden und vier Seiten (ohne Deckel). Werte in mm².
  const offen = (a, b, c) => a * b + 2 * a * c + 2 * b * c;
  const offenRechnung = (a, b, c, e) => { const q = Q(a, b, c), f = q2(e); return [`${T(a, e)} · ${T(b, e)} = ${T(q.ab, f)}`, `2 · ${T(a, e)} · ${T(c, e)} = ${T(2 * q.ac, f)}`, `2 · ${T(b, e)} · ${T(c, e)} = ${T(2 * q.bc, f)}`, `${T(q.ab, f)} + ${T(2 * q.ac, f)} + ${T(2 * q.bc, f)} = ${T(offen(a, b, c), f)}`]; };
  const hOffen = (n) => H(n, 'Ohne Deckel bleiben fünf Flächen: der Boden und vier Seiten.', 'Kiste mit 5 cm, 4 cm, 2 cm: 20 cm² + 2 · 10 cm² + 2 · 8 cm² = 56 cm².', 'Rechne den Boden einmal und jede Seitenfläche zweimal.');
  const wand = (a, b, c) => 2 * a * c + 2 * b * c;
  sechs(O2, 'G', [
    () => { const [a, b, c] = kanten(3, 12).map((x) => mm(x, 'cm')), w = offen(a, b, c);
      return flaeche(Z('Der Karton hat keinen Deckel.', 'Berechne, wie viel Pappe für den Karton nötig ist.', 'Wähle auch die passende Einheit.'), w, 'cm²', [[Q(a, b, c).O, 'deckel-mitgerechnet'], [Q(a, b, c).O / 2, 'oberflaeche-drei-flaechen']], hOffen('G'),
        { einheiten: EW('cm'), bild: quaderBild(a, b, c, 'cm', { titel: 'Karton ohne Deckel' }), nachweis: offenRechnung(a, b, c, 'cm') }); },
    () => { const [a, b, c] = kanten(2, 9).map((x) => mm(x, 'dm')), w = offen(a, b, c);
      return flaeche(Z('Ein Aquarium aus Glas ist oben offen.', `Es ist ${T(a, 'dm')} lang, ${T(b, 'dm')} breit und ${T(c, 'dm')} hoch.`, 'Berechne, wie viel Glas nötig ist.'), w, 'dm²', [[Q(a, b, c).O, 'deckel-mitgerechnet'], [Q(a, b, c).O / 2, 'oberflaeche-drei-flaechen']], hOffen('G'),
        { einheiten: EW('dm'), bild: quaderBild(a, b, c, 'dm', { titel: 'Aquarium, oben offen' }), nachweis: offenRechnung(a, b, c, 'dm') }); },
    () => { const a = mm(zz(4, 7), 'm'), b = mm(zz(3, 5), 'm'), c = mm(zz(2, 3), 'm'), w = wand(a, b, c), q = Q(a, b, c);
      return flaeche(Z(`Ein Zimmer ist ${T(a, 'm')} lang, ${T(b, 'm')} breit und ${T(c, 'm')} hoch.`, 'Die vier Wände bekommen neue Farbe.', 'Berechne die Fläche der vier Wände.'), w, 'm²', [[q.O, 'deckel-mitgerechnet'], [w / 2, 'oberflaeche-drei-flaechen'], [w + q.ab, 'deckel-mitgerechnet']],
        H('G', 'Boden und Decke gehören nicht dazu.', 'Je zwei Wände sind gleich groß.', 'Rechne 2 · Länge · Höhe und 2 · Breite · Höhe. Addiere dann.'), { einheiten: EW('m'), nachweis: [`2 · ${T(a, 'm')} · ${T(c, 'm')} = ${T(2 * q.ac, 'm²')}`, `2 · ${T(b, 'm')} · ${T(c, 'm')} = ${T(2 * q.bc, 'm²')}`, `${T(2 * q.ac, 'm²')} + ${T(2 * q.bc, 'm²')} = ${T(w, 'm²')}`] }); },
    () => { const a = mm(zz(11, 20), 'cm'), o = 6 * a * a, kn = kind();
      return flaeche(Z(`${kn} packt ein Geschenk in Würfelform ein.`, `Jede Kante ist ${T(a, 'cm')} lang.`, 'Berechne, wie viel Papier mindestens nötig ist.'), o, 'cm²', [[3 * a * a, 'oberflaeche-drei-flaechen'], [a * a, 'oberflaeche-drei-flaechen'], [4 * a * a, 'oberflaeche-drei-flaechen']],
        H('G', 'Das Papier bedeckt alle sechs Flächen.', 'Kante 10 cm: 6 · 10 cm · 10 cm = 600 cm².', 'Rechne eine Fläche aus und nimm sie mal 6.'), { einheiten: EW('cm'), bild: quaderBild(a, a, a, 'cm'), nachweis: [`${T(a, 'cm')} · ${T(a, 'cm')} = ${T(a * a, 'cm²')}`, `6 · ${T(a * a, 'cm²')} = ${T(o, 'cm²')}`, BN('oberflaeche', T(o, 'cm²'))] }); },
    () => { const [a, b, c] = kanten(3, 9), q = Q(a, b, c), w = q.ab + 2 * q.ac + 2 * q.bc, kn = kind();
      return auswahl(Z('Die Kiste hat keinen Deckel.', `${kn} rechnet für das Holz: ${q.O} dm².`, 'Beurteile das Ergebnis.'), [opt(`Falsch. Der Deckel fehlt. Nötig sind ${w} dm².`, true), opt('Stimmt.', false, 'deckel-mitgerechnet'), opt(`Falsch. Nötig sind ${q.O / 2} dm².`, false, 'oberflaeche-drei-flaechen')],
        H('G', 'Zähle die Flächen der Kiste ohne Deckel.', 'Es sind fünf Flächen: Boden und vier Seiten.', 'Ziehe vom Ergebnis eine Fläche ab: den Deckel.'), { bild: quaderBild(mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', { titel: 'Kiste ohne Deckel' }), nachweis: [BN('oberflaeche', `${q.O} dm²`), `${a} dm · ${b} dm = ${q.ab} dm²`, `${q.O} dm² − ${q.ab} dm² = ${w} dm²`, URTEIL(false)] }); },
    () => { const [a, b, c] = kanten(3, 9), s = suche(() => zz(3, 8), (x) => 6 * x * x !== Q(a, b, c).O), p = Q(a, b, c), r = 6 * s * s, [k1, k2] = zweiKinder();
      return auswahl(Z(`${k1} packt eine Schachtel mit ${a} cm, ${b} cm und ${c} cm ein.`, `${k2} packt einen Würfel mit ${s} cm Kantenlänge ein.`, 'Kreuze an, wer mehr Papier braucht.'), [opt(k1, p.O > r), opt(k2, r > p.O), opt('Beide brauchen gleich viel.', false)],
        H('G', 'Berechne beide Oberflächeninhalte.', `Würfel: 6 · ${s} cm · ${s} cm = ${r} cm².`, 'Vergleiche dann die beiden Ergebnisse.'), { nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${p.O} cm²`), QN([`${s} cm`, `${s} cm`, `${s} cm`], 'oberflaeche', `${r} cm²`), VGL(`${p.O} cm²`, `${r} cm²`, { groesser: k1, kleiner: k2, gleich: 'Beide brauchen gleich viel.' })] }); },
  ]);
  sechs(O2, 'M', [
    () => { const a = mm(wahl([125, 145, 165, 185]), 'cm', true), b = mm(zz(6, 12), 'cm'), c = mm(zz(3, 6), 'cm'); return oAufgabe('M', [`Eine Pralinenschachtel ist ${T(a, 'cm')} lang, ${T(b, 'cm')} breit und ${T(c, 'cm')} hoch.`, 'Sie wird ganz in Folie verpackt.', 'Berechne, wie viel Folie mindestens nötig ist.'], a, b, c, 'cm', hErg('M')); },
    () => { const a = mm(zz(4, 6), 'm'), b = mm(zz(3, 4), 'm'), c = mm(25, 'm', true), w = wand(a, b, c), reicht = wahl([5, 9, 15]), wm = w / 1e6;
      if (wm % reicht !== 0) return null;
      return zahl(Z(`Ein Zimmer ist ${T(a, 'm')} lang, ${T(b, 'm')} breit und ${T(c, 'm')} hoch. Die vier Wände werden gestrichen.`, `Ein Eimer Farbe reicht für ${reicht} m².`, 'Rechne im Heft.', 'Gib an, wie viele Eimer Farbe nötig sind.'), wm / reicht, [[Q(a, b, c).O / 1e6 / reicht, 'deckel-mitgerechnet'], [wm, 'sach-schritt-vergessen']],
        H('M', 'Berechne zuerst die Fläche der vier Wände.', 'Teile die Fläche durch die Fläche, für die ein Eimer reicht.'), { einheit: 'Eimer', nachweis: [`2 · ${T(a, 'm')} · ${T(c, 'm')} = ${T(2 * a * c, 'm²')}`, `2 · ${T(b, 'm')} · ${T(c, 'm')} = ${T(2 * b * c, 'm²')}`, `${T(2 * a * c, 'm²')} + ${T(2 * b * c, 'm²')} = ${T(w, 'm²')}`, `${T(w, 'm²')} : ${reicht} m² = ${wm / reicht}`] }); },
    () => { const a = mm(zz(6, 12), 'dm'), b = mm(zz(3, 5), 'dm'), c = mm(wahl([35, 45, 55]), 'dm', true), w = offen(a, b, c);
      return flaeche(Z(`Ein Aquarium ist ${T(a, 'dm')} lang, ${T(b, 'dm')} breit und ${T(c, 'dm')} hoch. Es ist oben offen.`, 'Berechne, wie viel Glas nötig ist.'), w, 'dm²', [[Q(a, b, c).O, 'deckel-mitgerechnet'], [Q(a, b, c).O / 2, 'oberflaeche-drei-flaechen']],
        H('M', 'Oben offen heißt: Der Deckel fehlt. Es bleiben fünf Flächen.', 'Rechne den Boden einmal und die Seitenflächen je zweimal.'), { einheiten: ['dm²', 'm²', 'dm³', 'l'], nachweis: offenRechnung(a, b, c, 'dm') }); },
    () => { const a = mm(wahl([15, 25, 35]), 'dm', true), o = 6 * a * a;
      return flaeche(Z(`Ein Würfel aus Blech hat die Kantenlänge ${T(a, 'dm')}.`, 'Berechne, wie viel Blech für den Würfel nötig ist.'), o, 'dm²', [[3 * a * a, 'oberflaeche-drei-flaechen'], [a * a, 'oberflaeche-drei-flaechen'], [5 * a * a, 'deckel-mitgerechnet']],
        H('M', 'Alle sechs Flächen sind gleich groß: O = 6 · a · a.', `Eine Fläche: ${T(a, 'dm')} · ${T(a, 'dm')} = ${T(a * a, 'dm²')}.`), { einheiten: EW('dm'), nachweis: [`${T(a, 'dm')} · ${T(a, 'dm')} = ${T(a * a, 'dm²')}`, `6 · ${T(a * a, 'dm²')} = ${T(o, 'dm²')}`, QN([T(a, 'dm'), T(a, 'dm'), T(a, 'dm')], 'oberflaeche', T(o, 'dm²'))] }); },
    () => { const a = mm(zz(6, 10), 'm'), b = mm(zz(3, 5), 'm'), c = mm(wahl([15, 25]), 'm', true), w = offen(a, b, c), preis = wahl([20, 30, 40]), wm = w / 1e6;
      return zahl(Z(`Ein Schwimmbecken ist ${T(a, 'm')} lang, ${T(b, 'm')} breit und ${T(c, 'm')} tief. Boden und Wände bekommen neue Fliesen.`, `Ein Quadratmeter Fliesen kostet ${preis} €.`, 'Rechne im Heft.', 'Gib die Kosten für die Fliesen an.'), wm * preis, [[(Q(a, b, c).O / 1e6) * preis, 'deckel-mitgerechnet'], [wm, 'sach-schritt-vergessen']],
        H('M', 'Das Becken ist oben offen: Boden und vier Wände.', 'Nimm die Fläche in Quadratmetern mal den Preis für einen Quadratmeter.'), { einheit: '€', nachweis: [...offenRechnung(a, b, c, 'm'), `${wm} · ${preis} = ${wm * preis}`, HG(`${wm}`, 'Maßzahl der Fläche in m²')] }); },
    () => { const [x, y] = wahl([[[6, 4, 1], [4, 3, 2]], [[8, 3, 1], [4, 3, 2]], [[6, 6, 1], [4, 3, 3]], [[9, 4, 1], [6, 3, 2]], [[8, 2, 2], [4, 4, 2]]]), p = Q(...x), r = Q(...y);
      return auswahl(Z(`Karton A hat die Kanten ${x[0]} dm, ${x[1]} dm und ${x[2]} dm. Karton B hat die Kanten ${y[0]} dm, ${y[1]} dm und ${y[2]} dm.`, 'Beide Kartons fassen gleich viel.', 'Kreuze den Karton an, für den weniger Pappe nötig ist.'), [opt('Karton A', p.O < r.O), opt('Karton B', r.O < p.O), opt('Für beide ist gleich viel Pappe nötig.', false, 'volumen-oberflaeche-verwechselt')],
        H('M', 'Gleiches Volumen heißt nicht gleicher Oberflächeninhalt.', 'Berechne für beide Kartons alle sechs Flächen und vergleiche.'), { nachweis: [QN(x.map((k) => `${k} dm`), 'oberflaeche', `${p.O} dm²`), QN(y.map((k) => `${k} dm`), 'oberflaeche', `${r.O} dm²`), VGL(`${p.O} dm²`, `${r.O} dm²`, { groesser: 'Karton B', kleiner: 'Karton A', gleich: 'Für beide ist gleich viel Pappe nötig.' })] }); },
  ]);
  sechs(O2, 'E', [
    () => { const a = zz(3, 12), o = 6 * a * a;
      return laenge(Z(`Ein Würfel hat den Oberflächeninhalt ${o} cm².`, 'Bestimme seine Kantenlänge.'), mm(a, 'cm'), 'cm', [[mm(o / 6, 'cm'), 'sach-schritt-vergessen'], [mm(o / 4, 'cm'), 'oberflaeche-drei-flaechen']],
        H('E', 'Teile durch 6. Dann kennst du eine Fläche. Welche Zahl mal sich selbst ergibt sie?'), { einheiten: EW('cm'), nachweis: [`${o} cm² : 6 = ${a * a} cm²`, HG(`${a} cm`, 'gesuchte Kante, durch Probieren'), `${a} cm · ${a} cm = ${a * a} cm²`, QN([`${a} cm`, `${a} cm`, `${a} cm`], 'oberflaeche', `${o} cm²`)] }); },
    () => { const [a, b, c] = kanten(2, 9), q = Q(a, b, c);
      return laenge(Z(`Ein Quader hat den Oberflächeninhalt ${q.O} cm². Zwei Kanten sind a = ${a} cm und b = ${b} cm.`, 'Rechne im Heft.', 'Bestimme die Kante c.'), mm(c, 'cm'), 'cm', [[mm(q.O / 2 - q.ab, 'cm'), 'sach-schritt-vergessen']],
        H('E', 'Die Hälfte des Oberflächeninhalts ist a · b + a · c + b · c. Ziehe a · b ab. Der Rest ist (a + b) · c.'), { einheiten: EW('cm'), nachweis: [`${q.O} cm² : 2 = ${q.O / 2} cm²`, `${a} cm · ${b} cm = ${q.ab} cm²`, `${q.O / 2} cm² − ${q.ab} cm² = ${q.O / 2 - q.ab} cm²`, `${a} cm + ${b} cm = ${a + b} cm`, `${q.O / 2 - q.ab} cm² : ${a + b} cm = ${c} cm`, QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${q.O} cm²`)] }); },
    () => { const a = zz(2, 9), o = 6 * a * a, v = a * a * a;
      return volumen(Z(`Ein Würfel hat den Oberflächeninhalt ${o} cm².`, 'Bestimme sein Volumen.'), v * 1000, 'cm³', [[(o / 6) * 1000, 'sach-schritt-vergessen'], [o * 1000, 'volumen-oberflaeche-verwechselt']],
        H('E', 'Bestimme zuerst eine Fläche, dann die Kantenlänge, dann das Volumen.'), { einheiten: EW('cm'), nachweis: [`${o} cm² : 6 = ${a * a} cm²`, HG(`${a} cm`, 'gesuchte Kante, durch Probieren'), `${a} cm · ${a} cm = ${a * a} cm²`, QN([`${a} cm`, `${a} cm`, `${a} cm`], 'volumen', `${v} cm³`)] }); },
    () => { const v = wahl([12, 18, 20, 24, 30, 36]), alle = []; for (let x = 1; x <= v; x++) for (let y = x; y <= v; y++) for (let z = y; z <= v; z++) if (x * y * z === v) alle.push([x, y, z]);
      const best = alle.reduce((p, k) => (Q(...k).O < Q(...p).O ? k : p));
      return { ...luecken(Z(`Im Heft: Finde alle Quader mit dem Volumen ${v} cm³, deren Kantenlängen ganze Zentimeter sind. Quader mit denselben drei Kantenlängen zählen nur einmal.`, 'Anzahl der Quader: {{n}}', 'Kanten des Quaders mit dem kleinsten Oberflächeninhalt: {{a}} cm, {{b}} cm und {{c}} cm'),
        { n: lk(alle.length, [[alle.length - 1, 'sach-schritt-vergessen'], [alle.length + 1, 'teilflaeche-doppelt']]), a: lk(best[0]), b: lk(best[1]), c: lk(best[2]) },
        H('E', 'Gehe geordnet vor: Beginne mit der kleinsten Kante 1, dann 2 und so weiter. Berechne zu jedem Quader den Oberflächeninhalt.'), { nachweis: [{ art: 'alleQuader', volumen: v, anzahl: alle.length, kanten: best }] }), reihenfolgeEgal: ['a', 'b', 'c'] }; },
    () => { const a = zz(3, 8), c = suche(() => zz(2, 9), (x) => x !== a), o = a * a + 4 * a * c;
      return laenge(Z(`Eine Kiste ohne Deckel hat einen quadratischen Boden mit ${a} dm Seitenlänge. Für die Kiste wurden ${o} dm² Holz gebraucht.`, 'Bestimme die Höhe der Kiste.'), mm(c, 'dm'), 'dm', [[mm(o - a * a, 'dm'), 'sach-schritt-vergessen'], [mm((o - a * a) / a, 'dm'), 'sach-schritt-vergessen']],
        H('E', 'Ziehe den Boden ab. Der Rest sind vier gleich große Seitenflächen.'), { einheiten: EW('dm'), nachweis: [`${a} dm · ${a} dm = ${a * a} dm²`, `${o} dm² − ${a * a} dm² = ${o - a * a} dm²`, `${o - a * a} dm² : 4 = ${a * c} dm²`, `${a * c} dm² : ${a} dm = ${c} dm`] }); },
    () => { const a = zz(2, 6), einzeln = 6 * a * a, neu = Q(2 * a, a, a).O;
      return flaeche(Z(`Zwei gleiche Würfel mit der Kantenlänge ${a} cm werden an einer Fläche zusammengeklebt.`, 'Bestimme den Oberflächeninhalt des neuen Körpers.'), neu * 100, 'cm²', [[2 * einzeln * 100, 'klebeflaeche-mitgezaehlt'], [(2 * einzeln - a * a) * 100, 'klebeflaeche-mitgezaehlt'], [einzeln * 100, 'sach-schritt-vergessen']],
        H('E', 'An der Klebestelle verschwinden zwei Flächen: von jedem Würfel eine.'), { einheiten: EW('cm'), nachweis: [`2 · ${a} cm = ${2 * a} cm`, QN([`${2 * a} cm`, `${a} cm`, `${a} cm`], 'oberflaeche', `${neu} cm²`)] }); },
  ]);
}
