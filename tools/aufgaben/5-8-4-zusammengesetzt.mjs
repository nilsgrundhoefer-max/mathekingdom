// Aufgaben zu 5.8.4 „Zusammengesetzte Figuren“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0035.
// S1: Flächeninhalt zusammengesetzter Figuren durch Zerlegen oder Ergänzen. S2: Umfang zusammengesetzter Figuren und Sachaufgaben.
// Grilling mit Nils (2026-11-22): nur Figuren aus Rechtecken. F mit gezeigter Einteilung, G zerlegt das Kind selbst (am Raster),
// M Skizzen ohne Raster mit fehlenden Seiten, E zwei Wege und Rahmen. Teilflächen sind farbig und nummeriert, ein Loch ist weiß.

import { sechs, zahl, auswahl, opt, luecken, groesse, Z, G, HILFSGROESSE, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { QF, q, R, form, setze, rasterBild, skizze, NF, inhaltVon, randStuecke, umfangVon, zz, wahl, mische } from './5-8-flaechen.mjs';

const S1 = '5.8.4-S1', S2 = '5.8.4-S2';
const l = (n, e) => `${n} ${e}`;
const summe = (xs) => xs.reduce((s, x) => s + x, 0);
// Rechnungen zu einer Figur aus Rechtecken: jede Teilfläche, dann die Summe.
function aRechnung(rs, e) {
  const teile = rs.map((r) => [r[2] - r[0], r[3] - r[1]]), A = summe(teile.map(([w, h]) => w * h));
  return [...teile.map(([w, h]) => G(`${l(w, e)} · ${l(h, e)} = ${q(w * h, `${e}²`)}`)), G(`${teile.map(([w, h]) => q(w * h, `${e}²`)).join(' + ')} = ${q(A, `${e}²`)}`)];
}
const uRechnung = (rs, e, loecher = []) => G(`${[...randStuecke(rs), ...loecher.flatMap((r) => [r[2] - r[0], r[3] - r[1], r[2] - r[0], r[3] - r[1]])].map((x) => l(x, e)).join(' + ')} = ${l(umfangVon(rs, loecher), e)}`);
// Eine Form am Raster (art 'cm' oder 'm'). Liefert { bild, rs, A, u } oder null.
function amRaster(art, formArt, groesse_, { zerlegt = false, loch = false } = {}) {
  let f = form(formArt, groesse_);
  if (loch) { const w = zz(5, 9), h = zz(4, 6), lw = zz(1, w - 4), lh = zz(1, h - 3), lx = zz(2, w - lw - 2), ly = zz(2, h - lh - 2); if (ly + lh > h - 1 || lx + lw > w - 1) return null; f = { rechtecke: [R(0, 0, w, h)], loecher: [R(lx, ly, lw, lh)] }; }
  const g = setze([f], { zerlegt, maxB: 16, maxH: 11 });
  if (!g) return null;
  const fig = g.figuren[0], rs = fig.rechtecke, lo = fig.loecher ?? [];
  return { bild: rasterBild(art, g), rs, lo, A: inhaltVon(rs, lo), u: umfangVon(rs, lo) };
}
// Skizzen mit Maßen (ab M). Jede liefert { bild, A, u, a: Rechnungen zum Flächeninhalt, uR: Rechnungen zum Umfang }.
const M_ = (p, q_, text) => ({ p, q: q_, ...(text ? { text } : {}) });
function skizzeL(e, W, h1_, w2, H) {
  if (w2 >= W || h1_ >= H || Math.max(W, H) / Math.min(W, H) > 3) return null;
  const rs = [[0, 0, W, h1_], [0, h1_, w2, H]], d = W - w2, t = H - h1_, A = W * h1_ + w2 * t, u = 2 * W + 2 * H;
  return { rs, bild: skizze(e, [{ rechtecke: rs }], [M_([0, 0], [W, 0]), M_([0, 0], [0, H]), M_([0, H], [w2, H]), M_([W, 0], [W, h1_])]), A, u,
    a: [G(`${l(H, e)} − ${l(h1_, e)} = ${l(t, e)}`), G(`${l(W, e)} · ${l(h1_, e)} = ${q(W * h1_, `${e}²`)}`), G(`${l(w2, e)} · ${l(t, e)} = ${q(w2 * t, `${e}²`)}`), G(`${q(W * h1_, `${e}²`)} + ${q(w2 * t, `${e}²`)} = ${q(A, `${e}²`)}`)],
    ergaenzen: [G(`${l(W, e)} · ${l(H, e)} = ${q(W * H, `${e}²`)}`), G(`${l(W, e)} − ${l(w2, e)} = ${l(d, e)}`), G(`${l(H, e)} − ${l(h1_, e)} = ${l(t, e)}`), G(`${l(d, e)} · ${l(t, e)} = ${q(d * t, `${e}²`)}`), G(`${q(W * H, `${e}²`)} − ${q(d * t, `${e}²`)} = ${q(A, `${e}²`)}`)],
    uR: [G(`${l(W, e)} − ${l(w2, e)} = ${l(d, e)}`), G(`${l(H, e)} − ${l(h1_, e)} = ${l(t, e)}`), G(`${[W, h1_, d, t, w2, H].map((x) => l(x, e)).join(' + ')} = ${l(u, e)}`)],
    teil: [W * h1_, w2 * t], innen: w2, rest: [d, t] };
}
function skizzeU(e, w, b1, p, b2) {
  const H = b1 + b2, g = w - 2 * p;
  if (g < 1 || Math.max(w, H) / Math.min(w, H) > 3) return null;
  const rs = [[0, 0, w, b1], [0, b1, p, H], [w - p, b1, w, H]], A = w * b1 + 2 * p * b2, u = 2 * w + 2 * H + 2 * b2;
  return { rs, bild: skizze(e, [{ rechtecke: rs }], [M_([0, 0], [w, 0]), M_([0, 0], [0, H]), M_([0, H], [p, H]), M_([p, b1], [p, H])]), A, u,
    a: [G(`${l(H, e)} − ${l(b2, e)} = ${l(b1, e)}`), G(`${l(w, e)} · ${l(b1, e)} = ${q(w * b1, `${e}²`)}`), G(`${l(p, e)} · ${l(b2, e)} = ${q(p * b2, `${e}²`)}`), G(`${q(w * b1, `${e}²`)} + ${q(p * b2, `${e}²`)} + ${q(p * b2, `${e}²`)} = ${q(A, `${e}²`)}`)],
    uR: [G(`${l(w, e)} − ${l(p, e)} − ${l(p, e)} = ${l(g, e)}`), G(`${[w, H, p, b2, g, b2, p, H].map((x) => l(x, e)).join(' + ')} = ${l(u, e)}`)] };
}
function skizzeT(e, w1, b1, w2, b2, o) {
  const H = b1 + b2, r = w1 - o - w2;
  if (r < 1 || o < 1 || Math.max(w1, H) / Math.min(w1, H) > 3) return null;
  const rs = [[o, 0, o + w2, b2], [0, b2, w1, H]], A = w1 * b1 + w2 * b2, u = 2 * w1 + 2 * b1 + 2 * b2;
  return { rs, bild: skizze(e, [{ rechtecke: rs }], [M_([0, H], [w1, H]), M_([w1, b2], [w1, H]), M_([o, 0], [o + w2, 0]), M_([o + w2, 0], [o + w2, b2]), M_([0, b2], [o, b2])]), A, u,
    a: [G(`${l(w1, e)} · ${l(b1, e)} = ${q(w1 * b1, `${e}²`)}`), G(`${l(w2, e)} · ${l(b2, e)} = ${q(w2 * b2, `${e}²`)}`), G(`${q(w1 * b1, `${e}²`)} + ${q(w2 * b2, `${e}²`)} = ${q(A, `${e}²`)}`)],
    uR: [G(`${l(w1, e)} − ${l(o, e)} − ${l(w2, e)} = ${l(r, e)}`), G(`${[w1, b1, r, b2, w2, b2, o, b1].map((x) => l(x, e)).join(' + ')} = ${l(u, e)}`)] };
}
function skizzeRahmen(e, W, H, r) {
  const w = W - 2 * r, h = H - 2 * r;
  // Das Loch ist groß genug für seine Maße: mindestens ein Drittel so breit und so hoch wie die Platte.
  if (w < 2 || h < 2 || 3 * w < W || 3 * h < H || Math.max(W, H) / Math.min(W, H) > 3) return null;
  const rs = [[0, 0, W, H]], lo = [[r, r, W - r, H - r]], A = W * H - w * h;
  return { rs, lo, bild: skizze(e, [{ rechtecke: rs, loecher: lo }], [M_([0, 0], [W, 0]), M_([0, 0], [0, H]), M_([r, r], [W - r, r]), M_([W - r, r], [W - r, H - r])]), A, u: 2 * W + 2 * H + 2 * w + 2 * h, w, h,
    a: [G(`${l(W, e)} · ${l(H, e)} = ${q(W * H, `${e}²`)}`), G(`${l(w, e)} · ${l(h, e)} = ${q(w * h, `${e}²`)}`), G(`${q(W * H, `${e}²`)} − ${q(w * h, `${e}²`)} = ${q(A, `${e}²`)}`)] };
}
function skizzeTreppe(e, s, h) {
  const rs = [[0, 0, 3 * s, h], [0, h, 2 * s, 2 * h], [0, 2 * h, s, 3 * h]], A = 6 * s * h, u = 6 * s + 6 * h;
  if (Math.max(s, h) / Math.min(s, h) > 3) return null;
  return { rs, bild: skizze(e, [{ rechtecke: rs }], [M_([0, 0], [3 * s, 0]), M_([0, 0], [0, 3 * h]), M_([0, 3 * h], [s, 3 * h]), M_([3 * s, 0], [3 * s, h])]), A, u,
    a: [G(`${l(3 * s, e)} · ${l(h, e)} = ${q(3 * s * h, `${e}²`)}`), G(`2 · ${l(s, e)} = ${l(2 * s, e)}`), G(`${l(2 * s, e)} · ${l(h, e)} = ${q(2 * s * h, `${e}²`)}`), G(`${l(s, e)} · ${l(h, e)} = ${q(s * h, `${e}²`)}`), G(`${q(3 * s * h, `${e}²`)} + ${q(2 * s * h, `${e}²`)} + ${q(s * h, `${e}²`)} = ${q(A, `${e}²`)}`)],
    uR: [G(`2 · ${l(3 * s, e)} + 2 · ${l(3 * h, e)} = ${l(u, e)}`)] };
}
const aFehler = (A, x) => fehlerliste(A, [[x.u, 'umfang-flaeche-verwechselt'], ...(x.teil ? [[x.teil[0], 'sach-schritt-vergessen']] : [])]);

export function zusammengesetzt() {
  // ---------- S1: Flächeninhalt ----------
  const tippT = h3('Rechne jede Teilfläche für sich aus.', 'Teilfläche 1: 4 cm · 2 cm = 8 cm², Teilfläche 2: 2 cm · 3 cm = 6 cm². Zusammen 14 cm².', 'Zähle die Teilflächen dann zusammen.');
  const zahlA = (text, x, e, hilfen, extra = []) => x && zahl(text, x.A, fehlerliste(x.A, [[x.u, 'umfang-flaeche-verwechselt'], [inhaltVon([x.rs[0]]), 'sach-schritt-vergessen'], ...extra]), hilfen, { einheit: `${e}²`, bild: x.bild, nachweis: x.a ?? aRechnung(x.rs, e) });
  sechs(S1, 'F', [
    () => zahlA(Z('Die Figur besteht aus zwei Teilflächen.', 'Wie groß ist die ganze Figur?'), amRaster('cm', 'L', 1, { zerlegt: true }), 'cm', tippT),
    () => zahlA(Z('Die Figur besteht aus zwei Teilflächen.', 'Wie groß ist die ganze Figur?'), amRaster('cm', 'T', 1, { zerlegt: true }), 'cm', tippT),
    () => { const x = amRaster('cm', 'L', 2, { zerlegt: true });
      if (!x) return null;
      const [a1, a2] = x.rs.map((r) => inhaltVon([r]));
      return luecken(Z('Rechne mit den Teilflächen.', 'Teilfläche 1: {{a}} cm²', 'Teilfläche 2: {{b}} cm²', 'Ganze Figur: {{c}} cm²'), { a: a1, b: a2, c: [a1 + a2, fehlerliste(a1 + a2, [[x.u, 'umfang-flaeche-verwechselt']])] }, tippT, { bild: x.bild, nachweis: [...aRechnung(x.rs, 'cm'), { zahl: 1, grund: 'Nummer der Teilfläche' }, { zahl: 2, grund: 'Nummer der Teilfläche' }] }); },
    () => zahlA(Z('Die Figur besteht aus drei Teilflächen.', 'Wie groß ist die ganze Figur?'), amRaster('cm', 'U', 1, { zerlegt: true }), 'cm', h3('Rechne jede der drei Teilflächen aus.', 'Teilfläche 1 hat 8 cm², 2 und 3 haben je 2 cm². Zusammen 12 cm².', 'Zähle alle drei zusammen.')),
    () => zahlA(Z('Der Plan zeigt den Kräutergarten der Burg.', 'Er besteht aus zwei Teilflächen.', 'Wie groß ist der Garten?'), amRaster('m', 'L', 2, { zerlegt: true }), 'm', h3('Jedes Feld ist 1 m².', 'Teilfläche 1: 10 m², Teilfläche 2: 4 m². Zusammen 14 m².', 'Rechne jede Teilfläche aus und zähle zusammen.')),
    () => zahlA(Z('Die Treppe besteht aus drei Teilflächen.', 'Wie groß ist sie?'), amRaster('cm', 'treppe', 3, { zerlegt: true }), 'cm', h3('Rechne jede Stufe für sich aus.', 'Stufen mit 6 cm², 4 cm² und 2 cm² sind zusammen 12 cm².', 'Zähle alle drei Teilflächen zusammen.')),
  ]);
  const tippZ = h3('Zerlege die Figur in Rechtecke.', 'Ein L: unten 5 cm · 2 cm = 10 cm², oben 2 cm · 3 cm = 6 cm². Zusammen 16 cm².', 'Rechne jedes Rechteck mit A = a · b und zähle zusammen.');
  sechs(S1, 'G', [
    () => zahlA(Z('Wie groß ist die Figur?', 'Zerlege sie in Rechtecke.'), amRaster('cm', 'L', 3), 'cm', tippZ),
    () => zahlA(Z('Wie groß ist die Figur?', 'Zerlege sie in Rechtecke.'), amRaster('cm', 'T', 2), 'cm', tippZ),
    () => zahlA(Z('Der Plan zeigt den Burghof.', 'Wie groß ist er?'), amRaster('m', 'U', 2), 'm', h3('Zerlege den Hof in drei Rechtecke.', 'Unten 6 m · 2 m = 12 m², zwei Türme je 1 m · 2 m = 2 m². Zusammen 16 m².', 'Rechne jedes Rechteck aus und zähle zusammen.')),
    () => zahlA(Z('Wie groß ist die Treppe?'), amRaster('cm', 'treppe', 3), 'cm', h3('Zerlege die Treppe in Stufen.', 'Stufen mit 6 cm², 4 cm² und 2 cm² sind zusammen 12 cm².', 'Rechne jede Stufe aus.')),
    () => { const x = amRaster('cm', 'rechteck', 1, { loch: true });
      if (!x) return null;
      const [r] = x.rs, [o] = x.lo, W = r[2] - r[0], H = r[3] - r[1], w = o[2] - o[0], h = o[3] - o[1];
      return zahl(Z('Aus dem Rechteck ist ein Stück ausgeschnitten.', 'Wie groß ist die Fläche jetzt?'), x.A, fehlerliste(x.A, [[W * H, 'loch-nicht-abgezogen'], [x.u, 'umfang-flaeche-verwechselt']]),
        h3('Rechne das ganze Rechteck aus. Ziehe dann das Loch ab.', '6 cm · 4 cm = 24 cm², Loch 2 cm · 1 cm = 2 cm². Es bleiben 22 cm².', 'Das ausgeschnittene Stück gehört nicht mehr zur Fläche.'),
        { einheit: 'cm²', bild: x.bild, nachweis: [G(`${l(W, 'cm')} · ${l(H, 'cm')} = ${q(W * H, 'cm²')}`), G(`${l(w, 'cm')} · ${l(h, 'cm')} = ${q(w * h, 'cm²')}`), G(`${q(W * H, 'cm²')} − ${q(w * h, 'cm²')} = ${q(x.A, 'cm²')}`)] }); },
    () => { const x = amRaster('cm', 'L', 2);
      if (!x) return null;
      const [r1, r2] = x.rs, w1 = r1[2] - r1[0], ganz = w1 * (r2[3] - r1[1]), doppelt = x.A + (r2[2] - r2[0]) * (r1[3] - r1[1]), kn = kind(), stimmt = wahl([true, false]), beh = stimmt ? x.A : doppelt;
      return auswahl(Z(`${kn} sagt: Die Figur ist ${q(beh, 'cm²')} groß.`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'teilflaeche-doppelt'), opt(`Falsch. Sie ist ${q(stimmt ? doppelt : x.A, 'cm²')} groß.`, !stimmt, stimmt ? 'teilflaeche-doppelt' : undefined), opt(`Falsch. Sie ist ${q(ganz, 'cm²')} groß.`, false, 'loch-nicht-abgezogen')].filter((o, i) => i < 2 || ganz !== x.A),
        tippZ, { bild: x.bild, nachweis: [{ art: 'urteil', stimmt, behauptet: q(beh, 'cm²') }, ...aRechnung(x.rs, 'cm'), HILFSGROESSE(q(doppelt, 'cm²'), 'doppelt gezählt'), HILFSGROESSE(q(ganz, 'cm²'), 'ganzes Rechteck')] }); },
  ]);
  const zahlS = (text, x, e, hilfen, { wie = 'a', extra = {} } = {}) => x && zahl(text, x.A, aFehler(x.A, x), hilfen, { einheit: `${e}²`, bild: x.bild, nachweis: x[wie], ...extra });
  sechs(S1, 'M', [
    () => zahlS('Wie groß ist die Fläche? Zerlege sie in zwei Rechtecke.', skizzeL('m', zz(12, 30), zz(5, 12), zz(4, 10), zz(14, 24)), 'm', h2('Rechne zuerst die fehlende Seite aus.', 'Zerlege dann in zwei Rechtecke und zähle die Flächen zusammen.')),
    () => zahlS('Wie groß ist die Fläche? Ergänze sie zu einem Rechteck und ziehe das fehlende Stück ab.', skizzeL('cm', zz(15, 40), zz(6, 15), zz(5, 14), zz(18, 30)), 'cm', h2('Das ganze Rechteck ist so lang und so breit wie die Figur.', 'Rechne die Seiten des fehlenden Stücks aus und ziehe seine Fläche ab.'), { wie: 'ergaenzen' }),
    () => { const W = zz(20, 40), H = zz(14, 30), r = zz(3, 6), x = skizzeRahmen('cm', W, H, r);
      if (!x) return null;
      return zahl('Aus einer Platte ist ein Rechteck ausgeschnitten. Wie groß ist die Fläche, die übrig bleibt?', x.A, fehlerliste(x.A, [[W * H, 'loch-nicht-abgezogen'], [x.u, 'umfang-flaeche-verwechselt']]), h2('Rechne die ganze Platte aus.', 'Ziehe die Fläche des Lochs ab.'), { einheit: 'cm²', bild: x.bild, nachweis: x.a }); },
    () => zahlS('Wie groß ist die Fläche?', skizzeT('m', zz(14, 30), zz(4, 9), zz(4, 9), zz(6, 14), zz(3, 8)), 'm', h2('Zerlege die Figur in zwei Rechtecke.', 'Rechne jede Fläche mit A = a · b und zähle zusammen.')),
    () => zahlS('Wie groß ist die Fläche? Rechne zuerst die fehlende Seite aus.', skizzeU('m', zz(16, 30), zz(4, 9), zz(3, 7), zz(6, 14)), 'm', h2('Die Figur besteht aus einem Rechteck unten und zwei Türmen.', 'Die Höhe des unteren Rechtecks ist die ganze Höhe minus die Höhe eines Turms.')),
    () => { const W = wahl([20, 24, 30]), H = wahl([15, 18, 20]), w2 = wahl([8, 10, 12]), h1_ = wahl([6, 8, 10]), x = skizzeL('m', W, h1_, w2, H);
      if (!x || x.A % 100) return null;
      return groesse('Ein Grundstück hat diese Form. Wie groß ist es? Wähle eine passende Einheit.', 'flaeche', x.A * QF['m²'], 'm²', [[x.u * QF['m²'], 'umfang-flaeche-verwechselt'], [W * H * QF['m²'], 'loch-nicht-abgezogen']], h2('Zerlege die Fläche in zwei Rechtecke.', 'Gib das Ergebnis in m² oder in a an.'), { einheiten: ['m²', 'a', 'ha'], bild: x.bild, nachweis: x.a }); },
  ]);
  sechs(S1, 'E', [
    () => { const W = zz(30, 60), H = zz(20, 45), r = zz(4, 8), x = skizzeRahmen('cm', W, H, r);
      if (!x) return null;
      return zahl('Ein Bild hat einen Rahmen. Wie groß ist die Fläche des Rahmens?', x.A, fehlerliste(x.A, [[W * H, 'loch-nicht-abgezogen'], [x.w * x.h, 'sach-frage-verfehlt'], [x.u, 'umfang-flaeche-verwechselt']]), h1('Der Rahmen ist das große Rechteck ohne das Bild in der Mitte.'), { einheit: 'cm²', bild: x.bild, nachweis: x.a }); },
    () => zahlS('Wie groß ist die Fläche?', skizzeU('m', zz(40, 90), zz(10, 25), zz(8, 18), zz(15, 35)), 'm', h1('Rechne zuerst die fehlende Seite aus.')),
    () => zahlS('Wie groß ist die Fläche der Treppe?', skizzeTreppe('cm', zz(12, 30), zz(8, 20)), 'cm', h1('Zerlege die Treppe in Stufen. Du kennst die Breite einer Stufe und ihre Höhe.')),
    () => { const x = skizzeL('m', zz(15, 30), zz(5, 12), zz(4, 10), zz(16, 28));
      if (!x) return null;
      const [W, h1_] = [x.rs[0][2], x.rs[0][3]], [w2, H] = [x.rs[1][2], x.rs[1][3]], [d, t] = x.rest;
      return luecken(Z('Rechne auf zwei Wegen.', 'Zerlegen: {{a}} m² + {{b}} m² = {{c}} m²', 'Ergänzen: {{d}} m² − {{e}} m² = {{f}} m²'), { a: W * h1_, b: w2 * t, c: x.A, d: W * H, e: d * t, f: [x.A, fehlerliste(x.A, [[W * H, 'loch-nicht-abgezogen']])] }, h1('Beim Zerlegen zählst du zwei Rechtecke zusammen, beim Ergänzen ziehst du das fehlende Stück vom großen Rechteck ab.'),
        { bild: x.bild, nachweis: [...x.a, ...x.ergaenzen] }); },
    () => { const W = wahl([60, 70, 80]), H = wahl([40, 50]), r = 5, x = skizzeRahmen('cm', W, H, r);
      if (!x) return null;
      return groesse('Um ein Fenster liegt ein Rahmen aus Holz. Wie groß ist die Fläche des Rahmens? Wähle eine passende Einheit.', 'flaeche', x.A * QF['cm²'], 'cm²', [[W * H * QF['cm²'], 'loch-nicht-abgezogen'], [x.u * QF['cm²'], 'umfang-flaeche-verwechselt']], h1('Ziehe die Fläche des Fensters von der ganzen Fläche ab.'), { einheiten: ['cm²', 'dm²', 'm²'], bild: x.bild, nachweis: x.a }); },
    () => { const x = skizzeRahmen('cm', zz(20, 40), zz(15, 30), zz(3, 6));
      if (!x) return null;
      const W = x.rs[0][2], H = x.rs[0][3], kn = kind(), stimmt = wahl([true, false]), beh = stimmt ? x.A : W * H;
      return auswahl(`${kn} sagt: Die Fläche ist ${q(beh, 'cm²')} groß. Stimmt das?`, [opt('Stimmt, denn das Loch ist schon abgezogen.', stimmt), opt(`Falsch, denn das Loch muss noch abgezogen werden. Es sind ${q(x.A, 'cm²')}.`, !stimmt, stimmt ? 'loch-nicht-abgezogen' : undefined), opt(`Falsch, denn es sind ${q(x.u, 'cm²')}.`, false, 'umfang-flaeche-verwechselt')],
        h1('Rechne das ganze Rechteck aus und ziehe das Loch ab.'), { bild: x.bild, nachweis: [{ art: 'urteil', stimmt, behauptet: q(beh, 'cm²') }, ...x.a, HILFSGROESSE(q(x.u, 'cm²'), 'falsche Rechnung'), HILFSGROESSE(q(W * H, 'cm²'), 'ohne Loch')] }); },
  ]);

  // ---------- S2: Umfang ----------
  const tippU = h3('Fahre einmal um die ganze Figur herum.', 'Ein L mit den Seiten 4, 2, 2, 3, 2 und 5 cm hat zusammen 18 cm Umfang.', 'Zähle jede Seite auf dem Rand. Linien innen gehören nicht dazu.');
  const zahlU = (text, x, e, hilfen) => x && zahl(text, x.u, fehlerliste(x.u, [[x.A, 'umfang-flaeche-verwechselt'], ...(x.rs.length > 1 ? [[summe(x.rs.map((r) => 2 * (r[2] - r[0]) + 2 * (r[3] - r[1]))), 'innere-linie-im-umfang']] : [])]), hilfen, { einheit: e, bild: x.bild, nachweis: x.uR ?? [uRechnung(x.rs, e, x.lo ?? [])] });
  sechs(S2, 'F', [
    () => zahlU(Z('Wie lang ist der Umfang der Figur?'), amRaster('cm', 'L', 1), 'cm', tippU),
    () => zahlU(Z('Wie lang ist der Umfang der Figur?'), amRaster('cm', 'T', 1), 'cm', tippU),
    () => zahlU(Z('Der Plan zeigt ein Beet.', 'Um das Beet kommt ein Zaun.', 'Wie lang ist der Zaun?'), amRaster('m', 'L', 2), 'm', h3('Der Zaun geht einmal ganz um das Beet.', 'Seiten 4 m, 2 m, 2 m, 3 m, 2 m und 5 m: zusammen 18 m.', 'Zähle alle Seiten am Rand zusammen.')),
    () => { const x = amRaster('cm', 'L', 1);
      if (!x) return null;
      return luecken(Z('Bestimme bei der Figur:', 'Flächeninhalt: {{a}} cm²', 'Umfang: {{b}} cm'), { a: [x.A, fehlerliste(x.A, [[x.u, 'umfang-flaeche-verwechselt']])], b: [x.u, fehlerliste(x.u, [[x.A, 'umfang-flaeche-verwechselt']])] },
        h3('Der Flächeninhalt zählt die Felder, der Umfang die Seiten am Rand.', 'Ein L mit 7 Feldern kann 16 cm Umfang haben.', 'Rechne beides getrennt.'), { bild: x.bild, nachweis: [...aRechnung(x.rs, 'cm'), uRechnung(x.rs, 'cm')] }); },
    () => zahlU(Z('Wie lang ist der Umfang der Treppe?'), amRaster('cm', 'treppe', 3), 'cm', h3('Fahre die Stufen genau nach.', 'Eine Treppe hat oben und rechts viele kleine Seiten.', 'Zähle jede Seite am Rand.')),
    () => zahlU(Z('Die Figur besteht aus zwei Teilflächen.', 'Wie lang ist ihr Umfang?'), amRaster('cm', 'L', 2, { zerlegt: true }), 'cm', h3('Die gestrichelte Linie innen gehört nicht zum Umfang.', 'Nur der Rand außen zählt.', 'Fahre einmal außen herum und zähle.')),
  ]);
  const tippUG = h3('Fahre einmal um die Figur. Linien innen zählen nicht.', 'Ein U mit Lücke: Auch die Seiten in der Lücke gehören zum Rand.', 'Schreibe alle Seiten am Rand auf und zähle zusammen.');
  sechs(S2, 'G', [
    () => zahlU(Z('Berechne den Umfang der Figur.'), amRaster('cm', 'U', 2), 'cm', tippUG),
    () => zahlU(Z('Der Plan zeigt den Burghof.', 'Wie lang ist die Mauer um den Hof?'), amRaster('m', 'T', 2), 'm', tippUG),
    () => { const x = amRaster('m', 'L', 3), t = wahl([1, 2]);
      if (!x) return null;
      return zahl(Z('Der Plan zeigt einen Garten.', 'Um den Garten kommt ein Zaun.', `Das Tor ist ${l(t, 'm')} breit und braucht keinen Zaun.`, 'Wie viel m Zaun braucht man?'), x.u - t, fehlerliste(x.u - t, [[x.u, 'sach-schritt-vergessen'], [x.A - t, 'umfang-flaeche-verwechselt']]),
        h3('Rechne zuerst den ganzen Umfang aus.', 'Umfang 24 m, Tor 2 m: 24 m − 2 m = 22 m.', 'Ziehe dann das Tor ab.'), { einheit: 'm', bild: x.bild, nachweis: [uRechnung(x.rs, 'm'), G(`${l(x.u, 'm')} − ${l(t, 'm')} = ${l(x.u - t, 'm')}`)] }); },
    () => zahlU(Z('Berechne den Umfang der Figur.'), amRaster('cm', 'L', 3), 'cm', tippUG),
    () => { const x = amRaster('cm', 'treppe', 3);
      if (!x) return null;
      return luecken(Z('Bestimme bei der Treppe:', 'A = {{a}} cm²', 'u = {{b}} cm'), { a: [x.A, fehlerliste(x.A, [[x.u, 'umfang-flaeche-verwechselt']])], b: [x.u, fehlerliste(x.u, [[x.A, 'umfang-flaeche-verwechselt']])] },
        h3('A: Zerlege in Rechtecke. u: Fahre einmal herum.', 'Stufen mit 6, 4 und 2 cm² sind 12 cm².', 'Rechne beides getrennt.'), { bild: x.bild, nachweis: [...aRechnung(x.rs, 'cm'), uRechnung(x.rs, 'cm')] }); },
    () => { const x = amRaster('cm', 'L', 2, { zerlegt: true });
      if (!x) return null;
      const innen = x.rs[1][2] - x.rs[1][0], kn = kind(), stimmt = wahl([true, false, false]), falsch = x.u + 2 * innen, beh = stimmt ? x.u : falsch;
      return auswahl(Z(`${kn} sagt: Der Umfang ist ${l(beh, 'cm')}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'innere-linie-im-umfang'), opt(`Falsch. Der Umfang ist ${l(stimmt ? falsch : x.u, 'cm')}.`, !stimmt, stimmt ? 'innere-linie-im-umfang' : undefined), opt(`Falsch. Der Umfang ist ${l(x.A, 'cm')}.`, false, 'umfang-flaeche-verwechselt')],
        h3('Die gestrichelte Linie liegt innen.', 'Zum Umfang gehört nur der Rand außen.', 'Fahre außen herum und zähle nach.'), { bild: x.bild, nachweis: [{ art: 'urteil', stimmt, behauptet: l(beh, 'cm') }, uRechnung(x.rs, 'cm'), HILFSGROESSE(l(falsch, 'cm'), 'innere Linie mitgezählt'), HILFSGROESSE(l(x.A, 'cm'), 'Flächeninhalt')] }); },
  ]);
  const zahlUS = (text, x, e, hilfen) => x && zahl(text, x.u, fehlerliste(x.u, [[x.A, 'umfang-flaeche-verwechselt']]), hilfen, { einheit: e, bild: x.bild, nachweis: x.uR });
  sechs(S2, 'M', [
    () => zahlUS('Wie lang ist der Umfang der Figur? Rechne zuerst die fehlenden Seiten aus.', skizzeL('m', zz(12, 30), zz(5, 12), zz(4, 10), zz(14, 24)), 'm', h2('Zwei Seiten fehlen. Rechne sie aus der ganzen Länge und Breite aus.', 'Zähle dann alle sechs Seiten zusammen.')),
    () => zahlUS('Wie lang ist der Umfang der Figur?', skizzeT('cm', zz(14, 30), zz(4, 9), zz(4, 9), zz(6, 14), zz(3, 8)), 'cm', h2('Rechne zuerst die fehlende Seite unten rechts am Querbalken aus.', 'Zähle dann alle acht Seiten zusammen.')),
    () => { const x = skizzeL('m', zz(20, 40), zz(8, 15), zz(6, 14), zz(20, 34)), t = wahl([2, 3, 4]);
      if (!x) return null;
      return zahl(`Ein Grundstück hat diese Form. Es bekommt einen Zaun mit einem Tor, das ${l(t, 'm')} breit ist. Wie viel m Zaun braucht man?`, x.u - t, fehlerliste(x.u - t, [[x.u, 'sach-schritt-vergessen'], [x.A, 'umfang-flaeche-verwechselt']]), h2('Rechne den Umfang aus.', 'Ziehe dann die Breite des Tors ab.'), { einheit: 'm', bild: x.bild, nachweis: [...x.uR, G(`${l(x.u, 'm')} − ${l(t, 'm')} = ${l(x.u - t, 'm')}`)] }); },
    () => zahlUS('Wie lang ist der Umfang der Figur?', skizzeU('cm', zz(16, 30), zz(4, 9), zz(3, 7), zz(6, 14)), 'cm', h2('Denke an die Seiten in der Lücke.', 'Fahre einmal ganz herum und zähle alle acht Seiten.')),
    () => { const x = skizzeL('cm', zz(12, 25), zz(4, 10), zz(4, 9), zz(12, 22));
      if (!x) return null;
      return luecken(Z('Bestimme bei der Figur:', 'A = {{a}} cm²', 'u = {{b}} cm'), { a: [x.A, fehlerliste(x.A, [[x.u, 'umfang-flaeche-verwechselt']])], b: [x.u, fehlerliste(x.u, [[x.A, 'umfang-flaeche-verwechselt']])] }, h2('Rechne zuerst die fehlenden Seiten aus.', 'A: zerlegen und zusammenzählen. u: alle Seiten am Rand.'), { bild: x.bild, nachweis: [...x.a, ...x.uR] }); },
    () => { const x = skizzeL('m', wahl([6, 7, 8]), wahl([3, 4]), wahl([2, 3]), wahl([5, 6, 7])), tuer = 1;
      if (!x) return null;
      return zahl(`Ein Zimmer hat diese Form. An allen Wänden kommt eine Leiste an den Boden, nur nicht an der Tür. Die Tür ist ${l(tuer, 'm')} breit. Wie viel m Leiste braucht man?`, x.u - tuer, fehlerliste(x.u - tuer, [[x.u, 'sach-schritt-vergessen'], [x.A - tuer, 'umfang-flaeche-verwechselt']]), h2('Die Leiste läuft einmal um das ganze Zimmer.', 'Rechne den Umfang aus und ziehe die Tür ab.'), { einheit: 'm', bild: x.bild, nachweis: [...x.uR, G(`${l(x.u, 'm')} − ${l(tuer, 'm')} = ${l(x.u - tuer, 'm')}`)] }); },
  ]);
  sechs(S2, 'E', [
    () => zahlUS('Wie lang ist der Umfang der Treppe?', skizzeTreppe('m', zz(12, 40), zz(10, 30)), 'm', h1('Verschiebe die Stufen in Gedanken nach außen. Dann siehst du ein Rechteck.')),
    () => { const x = skizzeRahmen('cm', zz(30, 60), zz(20, 45), zz(4, 8));
      if (!x) return null;
      const W = x.rs[0][2], H = x.rs[0][3];
      return zahl('Ein Rahmen bekommt außen und innen eine goldene Kante. Wie viele cm Kante braucht man?', x.u, fehlerliste(x.u, [[2 * W + 2 * H, 'sach-schritt-vergessen'], [x.A, 'umfang-flaeche-verwechselt']]), h1('Rechne den Umfang außen und den Umfang innen aus.'),
        { einheit: 'cm', bild: x.bild, nachweis: [G(`2 · ${l(W, 'cm')} + 2 · ${l(H, 'cm')} = ${l(2 * W + 2 * H, 'cm')}`), G(`2 · ${l(x.w, 'cm')} + 2 · ${l(x.h, 'cm')} = ${l(2 * x.w + 2 * x.h, 'cm')}`), G(`${l(2 * W + 2 * H, 'cm')} + ${l(2 * x.w + 2 * x.h, 'cm')} = ${l(x.u, 'cm')}`)] }); },
    () => zahlUS('Wie lang ist der Umfang der Figur?', skizzeU('m', zz(40, 90), zz(10, 25), zz(8, 18), zz(15, 35)), 'm', h1('Rechne zuerst die Breite der Lücke aus.')),
    () => { const x = skizzeT('m', zz(20, 40), zz(5, 12), zz(5, 12), zz(8, 18), zz(4, 10));
      if (!x) return null;
      const kn = kind(), w1 = x.rs[1][2], falsch = x.u + 2 * (x.rs[0][2] - x.rs[0][0]), stimmt = wahl([true, false]), beh = stimmt ? x.u : falsch;
      return auswahl(`${kn} rechnet den Umfang aus und erhält ${l(beh, 'm')}. Stimmt das?`, [opt('Stimmt.', stimmt, stimmt ? undefined : 'innere-linie-im-umfang'), opt(`Falsch. Der Umfang ist ${l(stimmt ? falsch : x.u, 'm')}.`, !stimmt, stimmt ? 'innere-linie-im-umfang' : undefined), opt(`Falsch. Der Umfang ist ${l(2 * w1, 'm')}.`, false, 'umfang-halb')],
        h1('Rechne die fehlende Seite aus und fahre einmal außen herum.'), { bild: x.bild, nachweis: [{ art: 'urteil', stimmt, behauptet: l(beh, 'm') }, ...x.uR, HILFSGROESSE(l(falsch, 'm'), 'innere Linie mitgezählt'), HILFSGROESSE(l(2 * w1, 'm'), 'falsche Rechnung')] }); },
    () => { const x = skizzeL('m', zz(40, 80), zz(15, 30), zz(15, 35), zz(45, 80)), t1 = wahl([3, 4]), t2 = wahl([1, 2]);
      if (!x) return null;
      const z = x.u - t1 - t2;
      return zahl(`Eine Weide hat diese Form. Sie bekommt einen Zaun. Es gibt ein Tor für den Traktor, ${l(t1, 'm')} breit, und ein Tor für Menschen, ${l(t2, 'm')} breit. Wie viel m Zaun braucht man?`, z, fehlerliste(z, [[x.u, 'sach-schritt-vergessen'], [x.u - t1, 'sach-schritt-vergessen']]), h1('Rechne den Umfang aus und ziehe beide Tore ab.'),
        { einheit: 'm', bild: x.bild, nachweis: [...x.uR, G(`${l(x.u, 'm')} − ${l(t1, 'm')} − ${l(t2, 'm')} = ${l(z, 'm')}`)] }); },
    () => { const a = zz(10, 20), b = zz(8, 14), t = zz(2, b - 3), w = zz(2, a - 4);
      return zahl(`Aus einem Rechteck, ${l(a, 'cm')} lang und ${l(b, 'cm')} breit, wird an einer langen Seite in der Mitte ein Stück herausgeschnitten: ${l(w, 'cm')} breit und ${l(t, 'cm')} tief. Um wie viel cm wird der Umfang länger?`, 2 * t, fehlerliste(2 * t, [[w * t, 'umfang-flaeche-verwechselt'], [t, 'sach-schritt-vergessen']].filter(([x]) => x !== 0)), h1('Vergleiche den Rand vorher und nachher. Welche Seiten kommen dazu, welche fallen weg?'),
        { einheit: 'cm', nachweis: [HILFSGROESSE(l(w, 'cm'), 'fällt am Rand weg und kommt unten in der Lücke wieder dazu'), G(`2 · ${l(a, 'cm')} + 2 · ${l(b, 'cm')} = ${l(2 * a + 2 * b, 'cm')}`), G(`${l(2 * a + 2 * b, 'cm')} + 2 · ${l(t, 'cm')} = ${l(2 * a + 2 * b + 2 * t, 'cm')}`), G(`${l(2 * a + 2 * b + 2 * t, 'cm')} − ${l(2 * a + 2 * b, 'cm')} = ${l(2 * t, 'cm')}`)] }); },
  ]);
}
