// Aufgaben zu 6.6.5 „Zusammengesetzte Körper“ (Lernziele Z1, Z2) nach ADR 0015 und ADR 0049.
// Z1: Volumen. F und G sehen die Zerlegung (zwei Farben, Schnittlinie, alle Maße), M leitet eine Länge selbst her, E ergänzt (Quader minus Loch).
// Z2: Oberflächeninhalt. F und G zählen die Quadrate außen an einem Würfelbau, M und E rechnen an Körpern aus Quadern (Klebefläche zählt nicht).

import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, opt, auswahl, luecken, H, zahl, lk, kind, bildkarten, bau, ausTuermen, zufallsBau, FREI, T, faktor, Q, EW, volumen, flaeche, laenge,
  QN, BN, WERT, URTEIL, EXTREM, KN, TL, MS, bauBild, rasterBild, stufenKoerper, aussenflaechen, bauWerte, N } from './6-6-quader.mjs';

const Z1 = '6.6.5-Z1', Z2 = '6.6.5-Z2';
const q2 = (e) => `${e}²`, q3 = (e) => `${e}³`;
// Stufenkörper: unten A (a × b × c1), darauf links B (a2 × b × c2). Alle Maße in Millimetern, e ist die Einheit im Bild.
function stufe(a, b, c1, a2, c2, e) {
  const f = faktor(e), x = a * b * c1, y = a2 * b * c2, oa = Q(a, b, c1).O, ob = Q(a2, b, c2).O, k = a2 * b;
  const bild = (art) => stufenKoerper(a / f, b / f, c1 / f, a2 / f, c2 / f, e, art, (n) => T(Math.round(n * f), e));
  return { x, y, V: x + y, oa, ob, k, O: oa + ob - 2 * k, h: c1 + c2, bild,
    vRechnung: [`${T(a, e)} · ${T(b, e)} · ${T(c1, e)} = ${T(x, q3(e))}`, `${T(a2, e)} · ${T(b, e)} · ${T(c2, e)} = ${T(y, q3(e))}`, `${T(x, q3(e))} + ${T(y, q3(e))} = ${T(x + y, q3(e))}`],
    oRechnung: [QN([T(a, e), T(b, e), T(c1, e)], 'oberflaeche', T(oa, q2(e))), QN([T(a2, e), T(b, e), T(c2, e)], 'oberflaeche', T(ob, q2(e))), `${T(a2, e)} · ${T(b, e)} = ${T(k, q2(e))}`, `${T(oa, q2(e))} + ${T(ob, q2(e))} − 2 · ${T(k, q2(e))} = ${T(oa + ob - 2 * k, q2(e))}`] };
}
// Zufällige ganze Maße: [a, b, c1, a2, c2] in der Einheit e, als Millimeter.
const masse = (e, amax, cmax) => { const f = faktor(e), a = zz(4, amax), b = zz(2, 4), c1 = zz(1, cmax), a2 = zz(2, a - 2), c2 = zz(1, cmax); return [a, b, c1, a2, c2].map((x) => x * f); };
const hZ = (n) => H(n, 'Der Körper besteht aus zwei Quadern. Rechne jeden Quader einzeln.', 'Unten 5 cm · 2 cm · 1 cm = 10 cm³, oben 2 cm · 2 cm · 2 cm = 8 cm³. Zusammen sind es 18 cm³.', 'Addiere die beiden Volumen.');
const vFehlerZ = (s, a, b, e) => [[s.x, 'sach-schritt-vergessen'], [s.y, 'sach-schritt-vergessen'], [a * b * s.h, 'teilflaeche-doppelt']];
// Körper mit durchgehendem Loch (von vorne nach hinten): außen a × b × c, Loch la × lc, ganze Maße in der Einheit e.
function lochKoerper(a, b, c, la, lc, e) {
  const x0 = Math.floor((a - la) / 2), z0 = Math.floor((c - lc) / 2), t = (n) => `${n} ${e}`;
  const teile = [TL(0, 0, 0, a, b, z0), TL(0, 0, z0 + lc, a, b, c - z0 - lc), TL(0, 0, z0, x0, b, lc), TL(x0 + la, 0, z0, a - x0 - la, b, lc)];
  return { teile, bild: bauBild(teile, e, { masse: [MS([0, 0, 0], [a, 0, 0], t(a)), MS([a, 0, 0], [a, b, 0], t(b)), MS([0, 0, 0], [0, 0, c], t(c), 'links'), MS([x0, 0, z0 + lc], [x0 + la, 0, z0 + lc], t(la), 'oben'), MS([x0, 0, z0], [x0, 0, z0 + lc], t(lc), 'links')] }) };
}
// U-Form: Boden a × b × c1, darauf links und rechts je ein Turm w × b × c2.
function uKoerper(a, b, c1, w, c2, e) {
  const t = (n) => `${n} ${e}`, h = c1 + c2, teile = [TL(0, 0, 0, a, b, c1), TL(0, 0, c1, w, b, c2), TL(a - w, 0, c1, w, b, c2)];
  return { teile, bild: bauBild(teile, e, { masse: [MS([0, 0, 0], [a, 0, 0], t(a)), MS([a, b, 0], [a, b, c1], t(c1), 'rechts'), MS([0, 0, h], [w, 0, h], t(w), 'unten'), MS([0, 0, c1], [0, 0, h], t(c2), 'links'), MS([0, 0, h], [0, b, h], t(b), 'schraeg-links')] }) };
}
// Treppe aus drei Stufen: jede Stufe s lang, b breit, h hoch.
function treppenKoerper(s, b, h, e) {
  const t = (n) => `${n} ${e}`, teile = [TL(0, 0, 0, 3 * s, b, h), TL(0, 0, h, 2 * s, b, h), TL(0, 0, 2 * h, s, b, h)];
  return { teile, bild: bauBild(teile, e, { masse: [MS([2 * s, 0, 0], [3 * s, 0, 0], t(s)), MS([3 * s, b, 0], [3 * s, b, h], t(h), 'rechts'), MS([0, 0, 3 * h], [0, b, 3 * h], t(b), 'schraeg-links')] }) };
}
const offenerBau = (n, b = 3, t = 2, h = 2) => zufallsBau(b, t, h, n);

export function zusammengesetzt6() {
  // ================= Z1: Volumen zusammengesetzter Körper =================
  const zLuecken = (zeilen, m, e, hilfen) => { const [a, b, c1, a2, c2] = m, s = stufe(...m, e), f = faktor(e), f3 = faktor(q3(e));
    return luecken(Z(...zeilen, `Quader unten: ${a / f} ${e} · ${b / f} ${e} · ${c1 / f} ${e} = {{x}} ${q3(e)}`, `Quader oben: ${a2 / f} ${e} · ${b / f} ${e} · ${c2 / f} ${e} = {{y}} ${q3(e)}`, `Zusammen: {{v}} ${q3(e)}`),
      { x: lk(s.x / f3, [[(a + b + c1) / f, 'volumen-kanten-addiert']]), y: lk(s.y / f3, [[(a2 + b + c2) / f, 'volumen-kanten-addiert']]), v: lk(s.V / f3, [[s.x / f3, 'sach-schritt-vergessen'], [(a * b * s.h) / f3, 'teilflaeche-doppelt']]) }, hilfen,
      { bild: s.bild('zerlegt'), nachweis: [...s.vRechnung, BN('volumen', T(s.V, q3(e)))] }); };
  sechs(Z1, 'F', [
    () => zLuecken(['Der Körper ist in zwei Quader zerlegt.', 'Berechne das Volumen.'], masse('cm', 7, 3), 'cm', hZ('F')),
    () => { const m = masse('cm', 8, 3), s = stufe(...m, 'cm');
      return volumen(Z('Der Körper ist in zwei Quader zerlegt.', `Der Quader unten hat das Volumen ${T(s.x, 'cm³')}.`, `Der Quader oben hat das Volumen ${T(s.y, 'cm³')}.`, 'Gib das Volumen von dem ganzen Körper an.'), s.V, 'cm³', [[s.x, 'sach-schritt-vergessen'], [Math.abs(s.x - s.y), 'sach-schritt-vergessen']],
        H('F', 'Der ganze Körper ist so groß wie beide Quader zusammen.', 'Quader mit 10 cm³ und 8 cm³: zusammen 10 cm³ + 8 cm³ = 18 cm³.', 'Addiere die beiden Volumen.'), { bild: s.bild('zerlegt'), nachweis: [`${T(s.x, 'cm³')} + ${T(s.y, 'cm³')} = ${T(s.V, 'cm³')}`, BN('volumen', T(s.V, 'cm³'))] }); },
    () => zLuecken(['Der Körper ist in zwei Quader zerlegt.', 'Berechne das Volumen.'], masse('dm', 8, 3), 'dm', hZ('F')),
    () => { const m = masse('cm', 6, 2), s = stufe(...m, 'cm');
      return volumen(Z('Der Körper ist in zwei Quader zerlegt.', 'Berechne das Volumen von dem ganzen Körper.'), s.V, 'cm³', vFehlerZ(s, m[0], m[1], 'cm'), hZ('F'), { bild: s.bild('zerlegt'), nachweis: [...s.vRechnung, BN('volumen', T(s.V, 'cm³'))] }); },
    () => { const m = suche(() => masse('cm', 8, 3), (k) => stufe(...k, 'cm').x > stufe(...k, 'cm').y), s = stufe(...m, 'cm'), t = (w) => T(w, 'cm³'), kn = kind();
      return auswahl(Z(`${kn} hat die beiden Quader schon berechnet.`, `Unten sind es ${t(s.x)}, oben ${t(s.y)}.`, 'Kreuze die richtige Rechnung für den ganzen Körper an.'), [opt(`${t(s.x)} + ${t(s.y)} = ${t(s.V)}`, true), opt(`${t(s.x)} − ${t(s.y)} = ${t(s.x - s.y)}`, false, 'sach-schritt-vergessen'), opt(`2 · ${t(s.x)} = ${t(2 * s.x)}`, false, 'teilflaeche-doppelt')],
        H('F', 'Zusammen heißt: addieren.', 'Quader mit 10 cm³ und 8 cm³: zusammen 10 cm³ + 8 cm³ = 18 cm³.', 'Suche die Rechnung mit dem Pluszeichen.'), { bild: s.bild('zerlegt'), nachweis: [BN('volumen', t(s.V)), WERT(t(s.V))] }); },
    () => zLuecken(['Auf der Burg steht ein Podest aus Stein.', 'Es ist in zwei Quader zerlegt.', 'Berechne das Volumen.'], masse('m', 6, 2), 'm', hZ('F')),
  ]);
  sechs(Z1, 'G', [
    () => { const m = masse('cm', 12, 6), s = stufe(...m, 'cm');
      return volumen(Z('Der Körper ist in zwei Quader zerlegt.', 'Berechne das Volumen von dem ganzen Körper.', 'Wähle auch die passende Einheit.'), s.V, 'cm³', vFehlerZ(s, m[0], m[1], 'cm'), hZ('G'), { einheiten: EW('cm'), bild: s.bild('zerlegt'), nachweis: [...s.vRechnung, BN('volumen', T(s.V, 'cm³'))] }); },
    () => zLuecken(['Der Körper ist in zwei Quader zerlegt.', 'Berechne das Volumen.'], masse('dm', 12, 6), 'dm', hZ('G')),
    () => { const [a, b, c] = [zz(5, 12), zz(3, 8), zz(2, 6)], s = zz(2, Math.min(a, b) - 1), v = a * b * c + s * s * s;
      return volumen(Z(`Ein Quader ist ${a} cm lang, ${b} cm breit und ${c} cm hoch.`, `Auf dem Quader steht ein Würfel mit ${s} cm Kantenlänge.`, 'Berechne das Volumen von dem ganzen Körper.', 'Wähle auch die passende Einheit.'), v * 1000, 'cm³', [[a * b * c * 1000, 'sach-schritt-vergessen'], [s * s * s * 1000, 'sach-schritt-vergessen'], [a * b * (c + s) * 1000, 'teilflaeche-doppelt']], hZ('G'),
        { einheiten: EW('cm'), nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'volumen', `${a * b * c} cm³`), QN([`${s} cm`, `${s} cm`, `${s} cm`], 'volumen', `${s * s * s} cm³`), `${a * b * c} cm³ + ${s * s * s} cm³ = ${v} cm³`] }); },
    () => { const m = masse('m', 9, 4), s = stufe(...m, 'm');
      return volumen(Z('Eine Mauer der Burg hat eine Stufe.', 'Sie ist in zwei Quader zerlegt.', 'Berechne das Volumen von der Mauer.', 'Wähle auch die passende Einheit.'), s.V, 'm³', vFehlerZ(s, m[0], m[1], 'm'), hZ('G'), { einheiten: EW('m'), bild: s.bild('zerlegt'), nachweis: [...s.vRechnung, BN('volumen', T(s.V, 'm³'))] }); },
    () => { const m = masse('cm', 10, 5), s = stufe(...m, 'cm'), t = (w) => T(w, 'cm³'), kn = kind();
      return auswahl(Z(`${kn} rechnet nur den Quader unten aus.`, `${kn} sagt: „Der Körper hat das Volumen ${t(s.x)}.“`, 'Beurteile die Aussage.'), [opt(`Falsch. Der Quader oben fehlt. Das Volumen ist ${t(s.V)}.`, true), opt('Stimmt.', false, 'sach-schritt-vergessen'), opt(`Falsch. Das Volumen ist ${t(m[0] * m[1] * s.h)}.`, false, 'teilflaeche-doppelt')],
        H('G', 'Zähle die Quader im Bild.', 'Der Körper besteht aus zwei Quadern. Beide gehören zum Volumen.', 'Berechne auch den Quader oben. Addiere dann.'), { bild: s.bild('zerlegt'), nachweis: [...s.vRechnung, BN('volumen', t(s.V)), URTEIL(false)] }); },
    () => { const [s1, b, h] = [zz(2, 5), zz(3, 9), zz(1, 4)], eine = s1 * b * h, tr = treppenKoerper(s1, b, h, 'dm');
      return volumen(Z('Die Treppe hat drei gleich hohe Stufen.', `Jede Stufe ist ${s1} dm lang, ${b} dm breit und ${h} dm hoch.`, 'Berechne das Volumen von der ganzen Treppe.', 'Wähle auch die passende Einheit.'), 6 * eine * 1e6, 'dm³', [[3 * eine * 1e6, 'sach-schritt-vergessen'], [eine * 1e6, 'sach-schritt-vergessen'], [9 * eine * 1e6, 'teilflaeche-doppelt']],
        H('G', 'Zerlege die Treppe in Quader.', 'Unten liegen 3 Blöcke nebeneinander, darüber 2 und oben 1. Das sind 6 gleiche Blöcke.', 'Berechne einen Block. Nimm ihn mal 6.'), { einheiten: EW('dm'), bild: tr.bild, nachweis: [`${s1} dm · ${b} dm · ${h} dm = ${eine} dm³`, '3 + 2 + 1 = 6', `6 · ${eine} dm³ = ${6 * eine} dm³`, BN('volumen', `${6 * eine} dm³`)] }); },
  ]);
  const hGanz = (n, s, e, c1) => H(n, 'Zerlege den Körper in zwei Quader. Eine Höhe steht nicht im Bild.', `Höhe des oberen Quaders: ${T(s.h, e)} − ${T(c1, e)} = ${T(s.h - c1, e)}.`);
  sechs(Z1, 'M', [
    () => { const m = masse('cm', 12, 6), s = stufe(...m, 'cm');
      return volumen(Z('Berechne das Volumen des Körpers.'), s.V, 'cm³', vFehlerZ(s, m[0], m[1], 'cm'), hGanz('M', s, 'cm', m[2]), { einheiten: EW('cm'), bild: s.bild('ganz'), nachweis: [`${T(s.h, 'cm')} − ${T(m[2], 'cm')} = ${T(m[4], 'cm')}`, ...s.vRechnung, BN('volumen', T(s.V, 'cm³'))] }); },
    () => { const m = [zz(5, 9) * 10, zz(2, 4) * 10, wahl([15, 25, 35]), zz(2, 3) * 10, wahl([15, 25])], s = stufe(...m, 'cm');
      return volumen(Z('Rechne im Heft.', 'Berechne das Volumen des Körpers.'), s.V, 'cm³', vFehlerZ(s, m[0], m[1], 'cm'), hGanz('M', s, 'cm', m[2]), { einheiten: EW('cm'), bild: s.bild('ganz'), nachweis: [`${T(s.h, 'cm')} − ${T(m[2], 'cm')} = ${T(m[4], 'cm')}`, ...s.vRechnung, BN('volumen', T(s.V, 'cm³'))] }); },
    () => { const m = masse('dm', 10, 6), s = stufe(...m, 'dm');
      return laenge(Z('Der Körper besteht aus zwei Quadern.', 'Bestimme die Höhe des oberen Quaders.'), m[4], 'dm', [[s.h, 'sach-schritt-vergessen'], [m[2], 'sach-schritt-vergessen']], H('M', 'Im Bild steht die ganze Höhe und die Höhe des unteren Quaders.', 'Ziehe die Höhe des unteren Quaders von der ganzen Höhe ab.'),
        { einheiten: EW('dm'), bild: s.bild('ganz'), nachweis: [`${T(s.h, 'dm')} − ${T(m[2], 'dm')} = ${T(m[4], 'dm')}`] }); },
    () => { const [s1, b, h] = [zz(2, 4), zz(4, 9), wahl([15, 25])], st = s1 * 100 * b * 100 * h * 10, tr = treppenKoerper(s1, b, h / 10, 'dm');
      return volumen(Z(`Eine Treppe aus Beton hat drei Stufen. Jede Stufe ist ${s1} dm lang, ${b} dm breit und ${T(h * 10, 'dm')} hoch.`, 'Berechne das Volumen der Treppe.'), 6 * st, 'dm³', [[3 * st, 'sach-schritt-vergessen'], [st, 'sach-schritt-vergessen'], [9 * st, 'teilflaeche-doppelt']],
        H('M', 'Zerlege die Treppe in gleiche Blöcke: unten 3, darüber 2, oben 1.', 'Berechne das Volumen eines Blocks und multipliziere mit 6.'), { einheiten: ['dm³', 'dm²', 'm³', 'l'], bild: { ...tr.bild, masse: [MS([2 * s1, 0, 0], [3 * s1, 0, 0], `${s1} dm`), MS([3 * s1, b, 0], [3 * s1, b, h / 10], T(h * 10, 'dm'), 'rechts'), MS([0, 0, (3 * h) / 10], [0, b, (3 * h) / 10], `${b} dm`, 'schraeg-links')] },
          nachweis: [`${s1} dm · ${b} dm · ${T(h * 10, 'dm')} = ${T(st, 'dm³')}`, '3 + 2 + 1 = 6', `6 · ${T(st, 'dm³')} = ${T(6 * st, 'dm³')}`, BN('volumen', T(6 * st, 'dm³'))] }); },
    () => { const m = masse('m', 8, 3), s = stufe(...m, 'm'), preis = wahl([80, 90, 100, 120]), vm = s.V / 1e9;
      return zahl(Z('Das Bild zeigt ein Fundament aus Beton.', `Ein Kubikmeter Beton kostet ${preis} €.`, 'Rechne im Heft.', 'Gib die Kosten für den Beton an.'), vm * preis, [[(s.x / 1e9) * preis, 'sach-schritt-vergessen'], [vm, 'sach-schritt-vergessen']],
        H('M', 'Berechne zuerst das Volumen des Fundaments in m³.', 'Multipliziere die Maßzahl des Volumens mit dem Preis für einen Kubikmeter.'), { einheit: '€', bild: s.bild('ganz'), nachweis: [`${T(s.h, 'm')} − ${T(m[2], 'm')} = ${T(m[4], 'm')}`, ...s.vRechnung, BN('volumen', T(s.V, 'm³')), `${vm} · ${preis} = ${vm * preis}`] }); },
    () => { const m = suche(() => masse('cm', 9, 4), (k) => k[3] < k[0] - 10 && k[0] - k[3] !== k[3]), [a, b, c1, a2, c2] = m, s = stufe(...m, 'cm'), t = (w) => T(w, 'cm³'), kasten = a * b * s.h, luecke = (a - a2) * b * c2;
      return auswahl(Z('Kreuze alle Rechnungen an, die das Volumen des Körpers ergeben.'), [opt(`${t(s.x)} + ${t(s.y)}`, true), opt(`${t(kasten)} − ${t(luecke)}`, true), opt(`${t(kasten)} − ${t(s.y)}`, false, 'teilflaeche-doppelt'), opt(`${t(s.x)} + ${t(luecke)}`, false, 'teilflaeche-doppelt'), opt(`${T(a, 'cm')} · ${T(b, 'cm')} · ${T(s.h, 'cm')}`, false, 'sach-schritt-vergessen')],
        H('M', 'Es gibt zwei Wege: zerlegen und addieren oder zu einem Quader ergänzen und abziehen.', 'Berechne das Volumen und dann jede Rechnung.'), { mehrfach: true, bild: s.bild('ganz'), nachweis: [`${T(s.h, 'cm')} − ${T(c1, 'cm')} = ${T(c2, 'cm')}`, ...s.vRechnung, BN('volumen', t(s.V)), WERT(t(s.V))] }); },
  ]);
  sechs(Z1, 'E', [
    () => { const [a, b, c] = [zz(6, 10), zz(3, 6), zz(5, 8)], la = zz(2, a - 4), lc = zz(2, c - 3), k = lochKoerper(a, b, c, la, lc, 'cm'), v = a * b * c - la * b * lc;
      return volumen(Z('Durch den Quader führt von vorne nach hinten ein Loch in Quaderform.', 'Berechne das Volumen des Körpers.'), v * 1000, 'cm³', [[a * b * c * 1000, 'sach-schritt-vergessen'], [la * b * lc * 1000, 'sach-schritt-vergessen'], [(a * b * c - la * lc) * 1000, 'sach-schritt-vergessen']],
        H('E', 'Berechne den vollen Quader und ziehe das Loch ab. Das Loch ist so lang, wie der Quader tief ist.'), { einheiten: EW('cm'), bild: k.bild, nachweis: [`${a} cm · ${b} cm · ${c} cm = ${a * b * c} cm³`, `${la} cm · ${b} cm · ${lc} cm = ${la * b * lc} cm³`, `${a * b * c} cm³ − ${la * b * lc} cm³ = ${v} cm³`, BN('volumen', `${v} cm³`)] }); },
    () => { const [a, b, c1, w, c2] = [zz(7, 10), zz(2, 5), zz(1, 3), 2, zz(2, 5)], k = uKoerper(a, b, c1, w, c2, 'dm'), v = a * b * c1 + 2 * w * b * c2;
      return volumen(Z('Rechne im Heft.', 'Berechne das Volumen des Körpers.'), v * 1e6, 'dm³', [[(a * b * c1 + w * b * c2) * 1e6, 'sach-schritt-vergessen'], [a * b * (c1 + c2) * 1e6, 'teilflaeche-doppelt']],
        H('E', 'Zerlege in drei Quader oder ergänze zu einem Quader und ziehe die Lücke ab.'), { einheiten: EW('dm'), bild: k.bild, nachweis: [`${a} dm · ${b} dm · ${c1} dm = ${a * b * c1} dm³`, `${w} dm · ${b} dm · ${c2} dm = ${w * b * c2} dm³`, `${a * b * c1} dm³ + 2 · ${w * b * c2} dm³ = ${v} dm³`, BN('volumen', `${v} dm³`)] }); },
    () => { const m = masse('cm', 10, 6), [a, b, c1, a2, c2] = m, s = stufe(...m, 'cm');
      return laenge(Z(`Ein Körper besteht aus zwei Quadern. Der untere Quader ist ${T(a, 'cm')} lang, ${T(b, 'cm')} breit und ${T(c1, 'cm')} hoch. Der obere Quader ist ${T(a2, 'cm')} lang und ${T(b, 'cm')} breit. Der ganze Körper hat das Volumen ${T(s.V, 'cm³')}.`, 'Bestimme die Höhe des oberen Quaders.'), c2, 'cm', [[(s.V / (a2 * b)), 'sach-schritt-vergessen'], [c1, 'sach-schritt-vergessen']].filter(([w]) => Number.isInteger(w)),
        H('E', 'Ziehe das Volumen des unteren Quaders ab. Der Rest ist das Volumen des oberen Quaders.'), { einheiten: EW('cm'), nachweis: [`${T(a, 'cm')} · ${T(b, 'cm')} · ${T(c1, 'cm')} = ${T(s.x, 'cm³')}`, `${T(s.V, 'cm³')} − ${T(s.x, 'cm³')} = ${T(s.y, 'cm³')}`, `${T(a2, 'cm')} · ${T(b, 'cm')} = ${T(a2 * b, 'cm²')}`, `${T(s.y, 'cm³')} : ${T(a2 * b, 'cm²')} = ${T(c2, 'cm')}`] }); },
    () => { const [a, b, c] = [zz(8, 12), zz(5, 7), zz(4, 6)], w = 1, innen = (a - 2 * w) * (b - 2 * w) * (c - w), v = a * b * c - innen;
      return volumen(Z(`Im Heft: Ein Wassertrog aus Stein ist außen ${a} dm lang, ${b} dm breit und ${c} dm hoch. Die Wände und der Boden sind überall ${w} dm dick. Oben ist der Trog offen.`, 'Bestimme das Volumen des Steins.'), v * 1e6, 'dm³', [[innen * 1e6, 'sach-schritt-vergessen'], [(a * b * c - (a - w) * (b - w) * (c - w)) * 1e6, 'sach-schritt-vergessen'], [(a * b * c - (a - 2 * w) * (b - 2 * w) * (c - 2 * w)) * 1e6, 'deckel-mitgerechnet']],
        H('E', 'Berechne den Quader außen und den Hohlraum innen. Der Hohlraum ist in Länge und Breite um zwei Wände kleiner, in der Höhe nur um den Boden.'), { einheiten: ['dm³', 'l', 'dm²', 'm³'],
          nachweis: [`${a} dm · ${b} dm · ${c} dm = ${a * b * c} dm³`, `${a} dm − 2 · ${w} dm = ${a - 2 * w} dm`, `${b} dm − 2 · ${w} dm = ${b - 2 * w} dm`, `${c} dm − ${w} dm = ${c - w} dm`, `${a - 2 * w} dm · ${b - 2 * w} dm · ${c - w} dm = ${innen} dm³`, `${a * b * c} dm³ − ${innen} dm³ = ${v} dm³`] }); },
    () => { const s = zz(4, 10), t = zz(1, s - 2), v = s ** 3 - t ** 3;
      return volumen(Z(`Aus einem Würfel mit der Kantenlänge ${s} cm wird an einer Ecke ein Würfel mit der Kantenlänge ${t} cm herausgeschnitten.`, 'Bestimme das Volumen des Restkörpers.'), v * 1000, 'cm³', [[s ** 3 * 1000, 'sach-schritt-vergessen'], [(s - t) ** 3 * 1000, 'volumen-waechst-wie-kante']],
        H('E', 'Berechne beide Würfel und ziehe den kleinen vom großen ab.'), { einheiten: EW('cm'), nachweis: [QN([`${s} cm`, `${s} cm`, `${s} cm`], 'volumen', `${s ** 3} cm³`), QN([`${t} cm`, `${t} cm`, `${t} cm`], 'volumen', `${t ** 3} cm³`), `${s ** 3} cm³ − ${t ** 3} cm³ = ${v} cm³`] }); },
    () => auswahl(Z('Aus einem Würfel wird an einer Ecke ein kleiner Würfel herausgeschnitten.', `${kind()} sagt: „Volumen und Oberflächeninhalt werden beide kleiner.“`, 'Beurteile die Aussage.'),
      [opt('Falsch. Das Volumen wird kleiner. Der Oberflächeninhalt bleibt gleich: Drei Quadrate fallen weg und drei gleich große kommen innen dazu.', true), opt('Stimmt. Wenn etwas fehlt, wird beides kleiner.', false, 'volumen-oberflaeche-verwechselt'), opt('Falsch. Beides bleibt gleich, denn die Form außen ändert sich kaum.', false), opt('Falsch. Das Volumen bleibt gleich, nur der Oberflächeninhalt wird kleiner.', false, 'volumen-oberflaeche-verwechselt')],
      H('E', 'Zähle an der Ecke die Flächen, die wegfallen, und die neuen Flächen in der Lücke.'), { nachweis: [FREI('Volumen und Oberflächeninhalt beim Ausschneiden einer Ecke'), URTEIL(false)] }),
  ]);

  // ================= Z2: Oberflächeninhalt zusammengesetzter Körper =================
  const hAussen = (n) => H(n, 'Zähle alle Quadrate außen: auch unten, hinten und links.', 'Ein einzelner Würfel hat 6 Quadrate außen.', 'Zähle Seite für Seite: oben, unten, vorne, hinten, links, rechts.');
  const reihe = (n) => Array.from({ length: n }, (_, x) => [x, 0, 0]), turm = (n) => Array.from({ length: n }, (_, z) => [0, 0, z]);
  sechs(Z2, 'F', [
    () => { const n = zz(2, 4), w = reihe(n), o = aussenflaechen(w);
      return zahl(Z(`${n} Würfel sind zu einer Stange zusammengeklebt.`, 'Zähle die Quadrate außen an der Stange.', 'Zähle auch unten und hinten.'), o, [[6 * n, 'klebeflaeche-mitgezaehlt'], [o - 2, 'oberflaeche-drei-flaechen']], hAussen('F'), { bild: bau(w), nachweis: [BN('aussen', o)] }); },
    () => { const n = zz(2, 5), w = turm(n);
      return luecken(Z(`Der Turm besteht aus ${n} Würfeln.`, 'Zähle die Quadrate außen.', 'Oben und unten: {{o}} Quadrate', `An den vier Seiten: 4 · ${n} = {{s}} Quadrate`, 'Zusammen: {{z}} Quadrate'), { o: lk(2, [[1, 'oberflaeche-drei-flaechen']]), s: lk(4 * n), z: lk(4 * n + 2, [[6 * n, 'klebeflaeche-mitgezaehlt'], [4 * n + 1, 'oberflaeche-drei-flaechen']]) },
        H('F', 'Der Turm hat oben ein Quadrat und unten ein Quadrat.', 'Turm aus 2 Würfeln: oben und unten 2 Quadrate, an den Seiten 4 · 2 = 8 Quadrate. Zusammen 10.', 'Addiere die beiden Zahlen.'), { bild: bau(w), nachweis: [`4 · ${n} = ${4 * n}`, `2 + ${4 * n} = ${4 * n + 2}`, BN('aussen', 4 * n + 2)] }); },
    () => { const [a, b] = wahl([[2, 2], [3, 2], [3, 1], [4, 2]]), w = []; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) w.push([x, y, 0]); const o = aussenflaechen(w);
      return zahl(Z('Die Platte ist aus Würfeln gebaut.', 'Zähle die Quadrate außen an der Platte.', 'Zähle auch unten und hinten.'), o, [[6 * a * b, 'klebeflaeche-mitgezaehlt'], [a * b, 'oberflaeche-drei-flaechen'], [o - a * b, 'oberflaeche-drei-flaechen']], hAussen('F'), { bild: bau(w), nachweis: [BN('aussen', o)] }); },
    () => { const w = ausTuermen([wahl([[2, 1], [1, 2], [2, 1, 1], [1, 1, 2]])]), o = aussenflaechen(w);
      return flaeche(Z('Der Körper ist aus Würfeln gebaut.', 'Jedes Quadrat außen hat den Flächeninhalt 1 cm².', 'Gib den Oberflächeninhalt von dem Körper an.'), o * 100, 'cm²', [[6 * w.length * 100, 'klebeflaeche-mitgezaehlt'], [(o - 2) * 100, 'oberflaeche-drei-flaechen']],
        H('F', 'Der Oberflächeninhalt ist die Anzahl der Quadrate außen.', '10 Quadrate außen mit je 1 cm² sind zusammen 10 cm².', 'Zähle Seite für Seite: oben, unten, vorne, hinten, links, rechts.'), { bild: bau(w), nachweis: [BN('aussen', o), `${o} · 1 cm² = ${o} cm²`] }); },
    () => { const n = wahl([2, 3]), w = reihe(n), o = aussenflaechen(w), kn = kind();
      return auswahl(Z(`${kn} klebt ${n} Würfel zu einer Stange zusammen.`, 'Kreuze die Anzahl der Quadrate außen an.'), [opt(`${o} Quadrate`, true), opt(`${6 * n} Quadrate`, false, 'klebeflaeche-mitgezaehlt'), opt(`${6 * n - (n - 1)} Quadrate`, false, 'klebeflaeche-mitgezaehlt')],
        H('F', 'An jeder Klebestelle sind zwei Quadrate nicht mehr außen.', '2 einzelne Würfel haben 12 Quadrate. Zusammengeklebt bleiben 12 − 2 = 10 Quadrate außen.', 'Zähle die Quadrate außen am Bild.'), { bild: bau(w), nachweis: [BN('aussen', o), WERT(`${o}`)] }); },
    () => { const w = ausTuermen([wahl([[3, 2, 1], [1, 2, 3], [2, 2, 1], [1, 2, 2]])]), o = aussenflaechen(w);
      return zahl(Z('Die Treppe ist aus Würfeln gebaut.', 'Zähle die Quadrate außen an der Treppe.', 'Zähle auch unten und hinten.'), o, [[6 * w.length, 'klebeflaeche-mitgezaehlt'], [o - 3, 'oberflaeche-drei-flaechen']], hAussen('F'), { bild: bau(w), nachweis: [BN('aussen', o)] }); },
  ]);
  sechs(Z2, 'G', [
    () => { const n = zz(5, 7), w = offenerBau(n), o = aussenflaechen(w);
      return zahl(Z('Der Körper ist aus Würfeln gebaut.', 'Bestimme die Anzahl der Quadrate außen.', 'Zähle auch unten, hinten und links.'), o, [[6 * n, 'klebeflaeche-mitgezaehlt']], hAussen('G'), { bild: bau(w), nachweis: [BN('aussen', o)] }); },
    () => { const n = zz(4, 6), w = offenerBau(n), o = aussenflaechen(w);
      return flaeche(Z('Der Körper ist aus Würfeln mit 1 cm Kantenlänge gebaut.', 'Bestimme den Oberflächeninhalt.', 'Wähle auch die passende Einheit.'), o * 100, 'cm²', [[6 * n * 100, 'klebeflaeche-mitgezaehlt']],
        H('G', 'Jedes Quadrat außen hat den Flächeninhalt 1 cm².', '14 Quadrate außen sind zusammen 14 cm².', 'Zähle die Quadrate außen: auch unten, hinten und links.'), { einheiten: EW('cm'), bild: bau(w), nachweis: [BN('aussen', o), `${o} · 1 cm² = ${o} cm²`] }); },
    () => { const n = zz(4, 6), w = offenerBau(n), o = aussenflaechen(w), k = (6 * n - o) / 2;
      return luecken(Z(`Der Körper besteht aus ${n} Würfeln.`, `Einzeln haben die Würfel 6 · ${n} = {{e}} Quadrate.`, `Der Körper hat ${k} Klebestellen.`, 'Bestimme die Anzahl der Quadrate außen.', `Dort fallen 2 · ${k} = {{w}} Quadrate weg.`, 'Außen bleiben {{z}} Quadrate.'), { e: lk(6 * n), w: lk(2 * k, [[k, 'klebeflaeche-mitgezaehlt']]), z: lk(o, [[6 * n - k, 'klebeflaeche-mitgezaehlt'], [6 * n, 'klebeflaeche-mitgezaehlt']]) },
        H('G', 'An jeder Klebestelle berühren sich zwei Quadrate. Beide sind nicht mehr außen.', '2 Würfel: 12 Quadrate. Eine Klebestelle: 12 − 2 = 10 Quadrate außen.', 'Ziehe die Quadrate an den Klebestellen ab.'), { bild: bau(w), nachweis: [`6 · ${n} = ${6 * n}`, `2 · ${k} = ${2 * k}`, `${6 * n} − ${2 * k} = ${o}`, BN('aussen', o)] }); },
    () => { const [a, b, c] = mische([zz(2, 3), zz(2, 3), zz(1, 3)]), o = 2 * (a * b + a * c + b * c);
      return zahl(Z('Der Quader ist aus Würfeln gebaut.', 'Bestimme die Anzahl der Quadrate außen.'), o, [[o / 2, 'oberflaeche-drei-flaechen'], [6 * a * b * c, 'klebeflaeche-mitgezaehlt'], [a * b * c, 'volumen-oberflaeche-verwechselt']],
        H('G', 'Zähle die Quadrate oben, vorne und rechts. Jede Seite gibt es zweimal.', 'Oben 6, vorne 4, rechts 6 Quadrate: 2 · (6 + 4 + 6) = 32 Quadrate.', 'Addiere die drei Zahlen. Nimm die Summe mal 2.'), { bild: rasterBild(a, b, c, 'cm', false), nachweis: [`2 · (${a * b} + ${a * c} + ${b * c}) = ${o}`, BN('aussen', o)] }); },
    () => { const bauten = suche(() => [offenerBau(4, 4, 2, 2), offenerBau(4, 4, 2, 2), offenerBau(4, 4, 2, 2)], (l) => { const o = l.map(aussenflaechen), min = Math.min(...o); return o.filter((x) => x === min).length === 1 && new Set(l.map((w) => JSON.stringify([...w].sort()))).size === 3; });
      const min = Math.min(...bauten.map(aussenflaechen));
      return bildkarten(Z('Jeder Körper besteht aus 4 Würfeln.', 'Kreuze den Körper mit den wenigsten Quadraten außen an.'), bauten.map((w) => [bau(w), aussenflaechen(w) === min, 'klebeflaeche-mitgezaehlt']),
        H('G', 'Viele Klebestellen heißt: wenige Quadrate außen.', 'Jede Klebestelle nimmt 2 Quadrate weg.', 'Zähle bei jedem Körper die Klebestellen.'), { nachweis: [KN('aussen', 'min')] }); },
    () => auswahl(Z('Eine Stange besteht aus 4 Würfeln in einer Reihe.', 'Ein Block besteht aus 2 · 2 Würfeln.', `${kind()} sagt: „Beide haben gleich viele Quadrate außen.“`, 'Beurteile die Aussage.'),
      [opt('Falsch. Der Block hat 16 Quadrate außen. Die Stange hat 18 Quadrate außen.', true), opt('Stimmt. Beide bestehen aus 4 Würfeln.', false, 'volumen-oberflaeche-verwechselt'), opt('Falsch. Die Stange hat 16 Quadrate außen. Der Block hat 18 Quadrate außen.', false)],
      H('G', 'Gleich viele Würfel heißt nicht: gleich viele Quadrate außen.', '4 einzelne Würfel haben 24 Quadrate. Jede Klebestelle nimmt 2 weg.', 'Zähle die Klebestellen bei der Stange und beim Block.'), { nachweis: ['6 · 4 = 24', '24 − 2 · 3 = 18', '24 − 2 · 4 = 16', URTEIL(false)] }),
  ]);
  const oFehlerZ = (s) => [[s.oa + s.ob, 'klebeflaeche-mitgezaehlt'], [s.oa + s.ob - s.k, 'klebeflaeche-mitgezaehlt'], [s.oa, 'sach-schritt-vergessen']];
  const hOZ = (n) => H(n, 'Die Klebefläche liegt innen und zählt nicht zum Oberflächeninhalt. Sie fehlt an beiden Quadern.', 'Berechne beide Oberflächeninhalte, addiere sie und ziehe zweimal die Klebefläche ab.');
  sechs(Z2, 'M', [
    () => { const m = masse('cm', 9, 4), s = stufe(...m, 'cm');
      return flaeche(Z('Der Körper ist aus zwei Quadern zusammengeklebt.', 'Berechne den Oberflächeninhalt des Körpers.'), s.O, 'cm²', oFehlerZ(s), hOZ('M'), { einheiten: EW('cm'), bild: s.bild('zerlegt'), nachweis: [...s.oRechnung, BN('oberflaeche', T(s.O, 'cm²'))] }); },
    () => { const m = masse('dm', 10, 5), s = stufe(...m, 'dm');
      return flaeche(Z('Rechne im Heft.', 'Berechne den Oberflächeninhalt des Körpers.'), s.O, 'dm²', oFehlerZ(s), hOZ('M'), { einheiten: EW('dm'), bild: s.bild('ganz'), nachweis: [`${T(s.h, 'dm')} − ${T(m[2], 'dm')} = ${T(m[4], 'dm')}`, ...s.oRechnung, BN('oberflaeche', T(s.O, 'dm²'))] }); },
    () => { const [a, b, c] = [zz(5, 12), zz(3, 8), zz(2, 6)], q = Q(a, b, c), neu = Q(a, b, 2 * c).O;
      return flaeche(Z(`Zwei gleiche Quader sind ${a} cm lang, ${b} cm breit und ${c} cm hoch. Sie werden genau aufeinander gestapelt und zusammengeklebt.`, 'Berechne den Oberflächeninhalt des neuen Körpers.'), neu * 100, 'cm²', [[2 * q.O * 100, 'klebeflaeche-mitgezaehlt'], [(2 * q.O - q.ab) * 100, 'klebeflaeche-mitgezaehlt'], [q.O * 100, 'sach-schritt-vergessen']], hOZ('M'),
        { einheiten: EW('cm'), nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${q.O} cm²`), `${a} cm · ${b} cm = ${q.ab} cm²`, `2 · ${q.O} cm² − 2 · ${q.ab} cm² = ${neu} cm²`, `2 · ${c} cm = ${2 * c} cm`, QN([`${a} cm`, `${b} cm`, `${2 * c} cm`], 'oberflaeche', `${neu} cm²`)] }); },
    () => { const n = zz(5, 8), w = offenerBau(n), o = aussenflaechen(w), s = wahl([2, 3]);
      return flaeche(Z(`Der Körper ist aus Würfeln mit der Kantenlänge ${s} cm gebaut.`, 'Bestimme seinen Oberflächeninhalt.'), o * s * s * 100, 'cm²', [[o * 100, 'sach-schritt-vergessen'], [o * s * 100, 'volumen-waechst-wie-kante'], [6 * n * s * s * 100, 'klebeflaeche-mitgezaehlt']],
        H('M', 'Zähle die Quadrate außen, auch unten, hinten und links.', `Jedes Quadrat hat den Flächeninhalt ${s} cm · ${s} cm = ${s * s} cm².`), { einheiten: EW('cm'), bild: bau(w), nachweis: [BN('aussen', o), `${s} cm · ${s} cm = ${s * s} cm²`, `${o} · ${s * s} cm² = ${o * s * s} cm²`] }); },
    () => { const [s1, b, h] = [zz(2, 4), zz(4, 9), zz(1, 3)], tr = treppenKoerper(s1, b, h, 'dm'), O = bauWerte(tr.teile).O, boden = 3 * s1 * b;
      return flaeche(Z(`Ein Siegerpodest hat die Form einer Treppe mit drei Stufen. Jede Stufe ist ${s1} dm lang, ${b} dm breit und ${h} dm hoch. Das Podest wird außen gestrichen, nur die Unterseite nicht.`, 'Rechne im Heft.', 'Berechne die Fläche, die gestrichen wird.'), (O - boden) * 1e4, 'dm²', [[O * 1e4, 'deckel-mitgerechnet'], [boden * 1e4, 'sach-schritt-vergessen']],
        H('M', 'Von oben gesehen ist das Podest ein Rechteck, von vorne eine Treppe aus 6 gleichen Rechtecken.', 'Addiere: oben, vorne und hinten, links und alle Stufen rechts. Die Unterseite gehört nicht dazu.'), { einheiten: EW('dm'), bild: tr.bild, nachweis: [BN('oberflaeche', `${O} dm²`), `3 · ${s1} dm · ${b} dm = ${boden} dm²`, `${O} dm² − ${boden} dm² = ${O - boden} dm²`] }); },
    () => { const s = zz(2, 6), kn = kind(), k = s * s;
      return auswahl(Z(`${kn} klebt einen Würfel mit der Kantenlänge ${s} cm mit einer ganzen Fläche auf einen größeren Quader.`, 'Kreuze an, um wie viel der Oberflächeninhalt des neuen Körpers kleiner ist als die Summe der beiden einzelnen Oberflächeninhalte.'),
        [opt(`${2 * k} cm²`, true), opt(`${k} cm²`, false, 'klebeflaeche-mitgezaehlt'), opt(`${6 * k} cm²`, false), opt(`${4 * k} cm²`, false)],
        H('M', 'Die Klebefläche verschwindet an beiden Körpern.', `Die Klebefläche ist ${s} cm · ${s} cm = ${k} cm² groß.`), { nachweis: [`${s} cm · ${s} cm = ${k} cm²`, `2 · ${k} cm² = ${2 * k} cm²`, WERT(`${2 * k} cm²`)] }); },
  ]);
  sechs(Z2, 'E', [
    () => { const [a, b, c] = [zz(6, 9), zz(3, 6), zz(5, 8)], la = zz(2, a - 4), lc = zz(2, c - 3), k = lochKoerper(a, b, c, la, lc, 'cm'), q = Q(a, b, c), O = q.O - 2 * la * lc + 2 * (la + lc) * b;
      return flaeche(Z('Durch den Quader führt von vorne nach hinten ein Loch in Quaderform.', 'Berechne den Oberflächeninhalt des Körpers. Die Innenflächen des Lochs gehören dazu.'), O * 100, 'cm²', [[q.O * 100, 'sach-schritt-vergessen'], [(q.O - 2 * la * lc) * 100, 'sach-schritt-vergessen'], [(q.O + 2 * (la + lc) * b) * 100, 'klebeflaeche-mitgezaehlt']],
        H('E', 'Vorne und hinten fehlt das Rechteck des Lochs. Dafür kommen innen vier Flächen dazu.'), { einheiten: EW('cm'), bild: k.bild,
          nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'oberflaeche', `${q.O} cm²`), `2 · ${la} cm · ${lc} cm = ${2 * la * lc} cm²`, `2 · ${la} cm · ${b} cm + 2 · ${lc} cm · ${b} cm = ${2 * (la + lc) * b} cm²`, `${q.O} cm² − ${2 * la * lc} cm² + ${2 * (la + lc) * b} cm² = ${O} cm²`, BN('oberflaeche', `${O} cm²`)] }); },
    () => { const [a, b, c1, w, c2] = [zz(7, 10), zz(2, 5), zz(1, 3), 2, zz(2, 5)], k = uKoerper(a, b, c1, w, c2, 'dm'), O = bauWerte(k.teile).O, voll = Q(a, b, c1 + c2).O;
      return flaeche(Z('Rechne im Heft.', 'Berechne den Oberflächeninhalt des Körpers.'), O * 1e4, 'dm²', [[voll * 1e4, 'sach-schritt-vergessen'], [(Q(a, b, c1).O + 2 * Q(w, b, c2).O) * 1e4, 'klebeflaeche-mitgezaehlt']],
        H('E', 'Gehe die Flächen der Reihe nach durch: unten, vorne und hinten, außen links und rechts, dann alle Flächen, die nach oben und in die Lücke zeigen.'), { einheiten: EW('dm'), bild: k.bild, nachweis: [BN('oberflaeche', `${O} dm²`)] }); },
    () => { const s = zz(4, 10), t = zz(1, s - 2), O = 6 * s * s;
      return flaeche(Z(`Aus einem Würfel mit der Kantenlänge ${s} cm wird an einer Ecke ein Würfel mit der Kantenlänge ${t} cm herausgeschnitten.`, 'Bestimme den Oberflächeninhalt des Restkörpers.'), O * 100, 'cm²', [[(O - 3 * t * t) * 100, 'sach-schritt-vergessen'], [(O - 6 * t * t) * 100, 'volumen-oberflaeche-verwechselt'], [(O + 3 * t * t) * 100, 'klebeflaeche-mitgezaehlt']],
        H('E', 'An der Ecke fallen drei Quadrate weg. In der Lücke kommen drei gleich große Quadrate dazu.'), { einheiten: EW('cm'), nachweis: [QN([`${s} cm`, `${s} cm`, `${s} cm`], 'oberflaeche', `${O} cm²`), `${t} cm · ${t} cm = ${t * t} cm²`, `${O} cm² − 3 · ${t * t} cm² + 3 · ${t * t} cm² = ${O} cm²`] }); },
    () => { const n = wahl([8, 12, 16, 18, 24]), alle = []; for (let x = 1; x <= n; x++) for (let y = x; y <= n; y++) for (let z = y; z <= n; z++) if (x * y * z === n) alle.push(Q(x, y, z).O);
      const [min, max] = [Math.min(...alle), Math.max(...alle)];
      return luecken(Z(`Im Heft: Aus ${n} Würfeln mit der Kantenlänge 1 cm werden Quader gebaut. Untersuche alle Möglichkeiten.`, 'Kleinster Oberflächeninhalt: {{min}} cm²', 'Größter Oberflächeninhalt: {{max}} cm²'), { min: lk(min), max: lk(max, [[6 * n, 'klebeflaeche-mitgezaehlt']]) },
        H('E', 'Schreibe alle Quader mit ihren drei Kantenlängen auf und berechne zu jedem den Oberflächeninhalt.'), { nachweis: [{ art: 'alleQuader', volumen: n, min, max }] }); },
    () => { const m = [zz(5, 9) * 100, zz(2, 4) * 100, wahl([150, 250]), zz(2, 3) * 100, wahl([150, 250, 350])], s = stufe(...m, 'dm');
      return flaeche(Z('Berechne den Oberflächeninhalt des Körpers.'), s.O, 'dm²', oFehlerZ(s), H('E', 'Die Fläche, an der die beiden Quader zusammenstoßen, gehört nicht zum Oberflächeninhalt.'), { einheiten: EW('dm'), bild: s.bild('ganz'), nachweis: [`${T(s.h, 'dm')} − ${T(m[2], 'dm')} = ${T(m[4], 'dm')}`, ...s.oRechnung, BN('oberflaeche', T(s.O, 'dm²'))] }); },
    () => { const [a, b, c] = suche(() => [zz(5, 9), zz(3, 6), zz(1, 4)], ([x, y, z]) => x > y && y > z), q = Q(a, b, c);
      return auswahl(Z(`Zwei gleiche Quader mit den Kanten ${a} cm, ${b} cm und ${c} cm werden an einer ganzen Fläche zusammengeklebt. Der neue Körper soll einen möglichst kleinen Oberflächeninhalt haben.`, 'Kreuze die Fläche an, an der geklebt wird.'),
        [opt(`die Fläche mit ${q.ab} cm²`, true), opt(`die Fläche mit ${q.ac} cm²`, false), opt(`die Fläche mit ${q.bc} cm²`, false, 'klebeflaeche-mitgezaehlt'), opt('Das ist egal, der Oberflächeninhalt ist immer gleich.', false, 'klebeflaeche-mitgezaehlt')],
        H('E', 'Die Klebefläche verschwindet zweimal. Je größer sie ist, desto mehr Oberfläche fällt weg.'), { nachweis: [`${a} cm · ${b} cm = ${q.ab} cm²`, `${a} cm · ${c} cm = ${q.ac} cm²`, `${b} cm · ${c} cm = ${q.bc} cm²`, EXTREM('groesste')] }); },
  ]);
}
