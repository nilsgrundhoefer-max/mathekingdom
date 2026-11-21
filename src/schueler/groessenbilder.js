// Kapitel 6 „Größen und Sachaufgaben“ (ADR 0033): Bilder für Geld, Uhr, Waage, Einheitentafel, Schätzen mit Vergleichsgröße,
// Karte mit Maßstab, Grundriss und Zeitleiste. Dazu die Größeneingabe: eine Zahl mit Komma und eine Einheit.
// Grilling mit Nils, 2026-11-21:
// - Am Bildschirm gibt es keine echten Zentimeter. Gemessen wird am gezeichneten Lineal unter der Karte.
// - Die Zeigeruhr gibt es nur auf F, sonst stehen Uhrzeiten als „14:35 Uhr“ da.
// - Beim Schätzen steht eine Vergleichsgröße im Bild. Auf F und G helfen Hilfslinien, ab M nicht mehr.
import { h, s } from './dom.js';
import { EINHEITEN, teileEingabe } from './groessen.js';

const LINIE = '#5b4632', DUNKEL = '#2f4f7f', HELL = '#fbf6e9', GOLD = '#d9b44a', KUPFER = '#c07a45';
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;
const lies = (x) => (istFrage(x) ? '?' : String(x));
const rahmen = (breite, hoehe, titel, ...kinder) => s('svg', { class: 'aufgabenbild groessenbild', viewBox: `0 0 ${breite} ${hoehe}`, width: breite, height: hoehe, role: 'img', 'aria-label': titel }, ...kinder);
const text = (x, y, inhalt, attribute = {}) => s('text', { x, y, 'text-anchor': 'middle', ...attribute }, inhalt);

// ---------- Geld ----------
// b: { stuecke: [2000, 500, 100, 50, 20] } in Cent, jedes Stück eine Münze oder ein Schein.
const SCHEIN = { 500: '#c9cdbb', 1000: '#e8b4a8', 2000: '#a9c4e4', 5000: '#f0c78a', 10000: '#b5d6a7' };
const MUENZE = { 1: [13, KUPFER], 2: [15, KUPFER], 5: [17, KUPFER], 10: [16, GOLD], 20: [18, GOLD], 50: [20, GOLD], 100: [19, '#d8d8d8'], 200: [21, GOLD] };
export const geldName = (ct) => (ct >= 100 ? `${ct / 100} €` : `${ct} ct`);
function geldBild(b) {
  const B = 540, rand = 8, zeile = 56, teile = [];
  let x = rand, y = rand;
  for (const ct of b.stuecke) {
    const schein = ct >= 500, breite = schein ? 92 : MUENZE[ct][0] * 2 + 8;
    if (x + breite > B - rand) { x = rand; y += zeile; }
    if (schein) teile.push(s('g', { class: 'schein' }, s('rect', { x, y: y + 3, width: 86, height: 46, rx: 4, fill: SCHEIN[ct], stroke: LINIE, 'stroke-width': 1.5 }),
      s('rect', { x: x + 6, y: y + 9, width: 20, height: 34, rx: 2, fill: 'none', stroke: LINIE, 'stroke-width': 0.8, opacity: 0.5 }), text(x + 52, y + 33, geldName(ct), { class: 'bildzahl klein' })));
    else {
      const [r, farbe] = MUENZE[ct], cx = x + r + 2, cy = y + 26;
      teile.push(s('g', { class: 'muenzbild' }, s('circle', { cx, cy, r, fill: farbe, stroke: LINIE, 'stroke-width': 1.5 }),
        ct >= 100 && s('circle', { cx, cy, r: r - 6, fill: ct === 100 ? GOLD : '#d8d8d8', stroke: LINIE, 'stroke-width': 0.6 }),
        text(cx, cy + 4.5, ct >= 100 ? `${ct / 100} €` : String(ct), { 'font-size': ct >= 100 ? 12 : 13, 'font-weight': 700, fill: '#2b2118' }),
        ct < 100 && text(cx, cy + r + 13, 'ct', { 'font-size': 11, fill: LINIE })));
    }
    x += breite + 6;
  }
  return rahmen(B, y + zeile + 10, `Geld: ${b.stuecke.map(geldName).join(', ')}`, teile);
}

// ---------- Uhr ----------
// b: { uhren: [{ h, min, text? }] }: eine oder zwei Zeigeruhren nebeneinander, darunter ein Wort wie „morgens“ oder „Abfahrt“.
function uhrBild(b) {
  const r = 66, breit = 190, hoch = 2 * r + 46, teile = [];
  b.uhren.forEach((u, i) => {
    const cx = breit / 2 + i * breit, cy = r + 10, el = [s('circle', { cx, cy, r, fill: '#fffdf6', stroke: LINIE, 'stroke-width': 4 })];
    for (let k = 0; k < 60; k++) {
      const w = (k * 6 * Math.PI) / 180, lang = k % 5 === 0 ? 9 : 4;
      el.push(s('line', { x1: cx + Math.sin(w) * (r - 4), y1: cy - Math.cos(w) * (r - 4), x2: cx + Math.sin(w) * (r - 4 - lang), y2: cy - Math.cos(w) * (r - 4 - lang), stroke: LINIE, 'stroke-width': k % 5 === 0 ? 2.2 : 1 }));
    }
    for (let z = 1; z <= 12; z++) { const w = (z * 30 * Math.PI) / 180; el.push(text(cx + Math.sin(w) * (r - 24), cy - Math.cos(w) * (r - 24) + 5.5, String(z), { 'font-size': 15, 'font-weight': 700, fill: '#3a3029' })); }
    const wm = (u.min * 6 * Math.PI) / 180, wh = (((u.h % 12) + u.min / 60) * 30 * Math.PI) / 180;
    el.push(s('line', { class: 'stundenzeiger', x1: cx, y1: cy, x2: cx + Math.sin(wh) * (r - 34), y2: cy - Math.cos(wh) * (r - 34), stroke: DUNKEL, 'stroke-width': 6, 'stroke-linecap': 'round' }),
      s('line', { class: 'minutenzeiger', x1: cx, y1: cy, x2: cx + Math.sin(wm) * (r - 13), y2: cy - Math.cos(wm) * (r - 13), stroke: '#a3302a', 'stroke-width': 3.5, 'stroke-linecap': 'round' }),
      s('circle', { cx, cy, r: 4.5, fill: LINIE }));
    if (u.text) el.push(text(cx, 2 * r + 34, u.text, { class: 'bildname' }));
    teile.push(s('g', { class: 'uhr' }, el));
  });
  const wort = (u) => `${u.text ? `${u.text}: ` : ''}Der kleine Zeiger steht ${u.min === 0 ? 'auf' : 'hinter'} der ${u.h % 12 || 12}, der große Zeiger auf der ${u.min / 5 || 12}`;
  return rahmen(breit * b.uhren.length, hoch, `Zeigeruhr. ${b.uhren.map(wort).join('. ')}.`, teile);
}

// ---------- Waage ----------
// b: { links: 'Paket', gewichte: [1000, 500, 200] } in Gramm. Die Waage steht im Gleichgewicht. Optional linksDazu: Gewichtsstücke neben dem Gegenstand.
export const gewichtName = (g) => (g >= 1000 ? `${g / 1000} kg` : `${g} g`);
function waageBild(b) {
  const B = 520, H = 190, mitte = B / 2, yBalken = 62, lx = 120, rx = B - 120, yS = 132, teile = [];
  const stueck = (x, yUnten, g) => { const br = g >= 1000 ? 54 : g >= 100 ? 46 : 38, ho = g >= 1000 ? 40 : g >= 100 ? 32 : 26;
    return s('g', { class: 'gewichtsstueck' }, s('path', { d: `M${x - br / 2} ${yUnten} L${x - br / 2 + 6} ${yUnten - ho} H${x + br / 2 - 6} L${x + br / 2} ${yUnten} Z`, fill: '#9aa3ad', stroke: '#3a3f45', 'stroke-width': 1.5 }),
      s('rect', { x: x - 6, y: yUnten - ho - 7, width: 12, height: 7, rx: 2, fill: '#9aa3ad', stroke: '#3a3f45', 'stroke-width': 1.2 }),
      text(x, yUnten - ho / 2 + 5, gewichtName(g), { 'font-size': 12.5, 'font-weight': 700, fill: '#1e2328' })); };
  const reihe = (liste, cx) => { let x = cx - (liste.length - 1) * 28; return liste.map((g) => { const el = stueck(x, yS, g); x += 56; return el; }); };
  teile.push(s('path', { d: `M${mitte - 46} ${H - 8} H${mitte + 46} L${mitte + 8} ${yBalken} H${mitte - 8} Z`, fill: '#cdb98a', stroke: LINIE, 'stroke-width': 2 }),
    s('rect', { x: lx - 20, y: yBalken - 5, width: rx - lx + 40, height: 10, rx: 4, fill: '#8a6a3b', stroke: LINIE, 'stroke-width': 1.5 }),
    s('circle', { cx: mitte, cy: yBalken, r: 7, fill: GOLD, stroke: LINIE, 'stroke-width': 1.5 }));
  for (const x of [lx, rx]) teile.push(s('line', { x1: x, y1: yBalken, x2: x, y2: yS + 2, stroke: LINIE, 'stroke-width': 1.5, opacity: 0.35 }),
    s('path', { d: `M${x - 104} ${yS} H${x + 104} L${x + 84} ${yS + 14} H${x - 84} Z`, fill: '#e6d8b4', stroke: LINIE, 'stroke-width': 2 }));
  const dazu = b.linksDazu ?? [];
  const px = lx - (dazu.length ? 44 : 0);
  teile.push(s('g', { class: 'wiegegut' }, s('rect', { x: px - 40, y: yS - 50, width: 80, height: 50, rx: 5, fill: '#f4dcc3', stroke: '#8a5a3b', 'stroke-width': 2 }),
    text(px, yS - 20, b.links, { 'font-size': 14, 'font-weight': 700, fill: '#3a3029' })), dazu.map((g, i) => stueck(lx + 34 + i * 50, yS, g)), reihe(b.gewichte, rx));
  return rahmen(B, H, `Waage im Gleichgewicht. Links: ${b.links}${dazu.length ? ` und ${dazu.map(gewichtName).join(', ')}` : ''}. Rechts: ${b.gewichte.map(gewichtName).join(', ')}.`, teile);
}

// ---------- Einheitentafel ----------
// b: { gruppen: [{ name: 'km', spalten: 1 }, { name: 'm', spalten: 3 }], spalten: ['', 'H', 'Z', 'E'], werte: [3, 2, 5, 0], weitere? }
export function einheitentafelBild(b) {
  const zelle = (w) => (w == null ? '' : istFrage(w) ? h('span', { class: 'bildfrage' }, '?') : String(w));
  let ende = 0;
  const enden = new Set(b.gruppen.map((g) => (ende += g.spalten) - 1).slice(0, -1));
  const rand = (i) => (enden.has(i) ? 'blockende' : null);
  const zeilen = [b.werte, ...(b.weitere ?? [])];
  return h('figure', { class: 'datenbild', role: 'img', 'aria-label': `Einheitentafel mit den Spalten ${b.gruppen.map((g) => g.name).join(', ')}: ${zeilen.map((z) => z.map((w) => (w == null ? 'leer' : lies(w))).join(' ')).join('; ')}` },
    h('table', { class: 'stellentafel einheitentafel' },
      h('thead', {}, h('tr', { class: 'gruppen' }, b.gruppen.map((g) => h('th', { colSpan: g.spalten, scope: 'colgroup' }, g.name))),
        b.spalten.some(Boolean) && h('tr', {}, b.spalten.map((n, i) => h('th', { scope: 'col', class: rand(i) }, n)))),
      h('tbody', {}, zeilen.map((zeile) => h('tr', {}, zeile.map((w, i) => h('td', { class: rand(i) }, zelle(w))))))));
}

// ---------- Schätzen mit Vergleichsgröße ----------
// b: { klein: 'kind', gross: 'turm', richtung: 'hoch' | 'lang', zehntel: 40, hilfslinien? }: Das Große ist zehntel/10-mal so hoch (lang) wie das Kleine.
const FORM = {
  kind: (x, y, w, hh) => [s('circle', { cx: x + w / 2, cy: y + hh * 0.11, r: hh * 0.11, fill: '#f0c9a0', stroke: LINIE, 'stroke-width': 1.5 }),
    s('path', { d: `M${x + w * 0.2} ${y + hh * 0.26} H${x + w * 0.8} L${x + w * 0.74} ${y + hh * 0.62} H${x + w * 0.26} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.5 }),
    s('path', { d: `M${x + w * 0.3} ${y + hh * 0.62} V${y + hh} M${x + w * 0.7} ${y + hh * 0.62} V${y + hh}`, stroke: DUNKEL, 'stroke-width': Math.max(3, w * 0.2), 'stroke-linecap': 'butt', fill: 'none' })],
  tuer: (x, y, w, hh) => [s('rect', { x, y, width: w, height: hh, fill: '#8a5a3b', stroke: LINIE, 'stroke-width': 2 }), s('rect', { x: x + w * 0.14, y: y + hh * 0.07, width: w * 0.72, height: hh * 0.38, fill: 'none', stroke: '#5b3a22', 'stroke-width': 1.2 }),
    s('circle', { cx: x + w * 0.8, cy: y + hh * 0.56, r: 2.5, fill: GOLD })],
  auto: (x, y, w, hh) => [s('path', { d: `M${x} ${y + hh * 0.8} V${y + hh * 0.45} H${x + w * 0.2} L${x + w * 0.32} ${y} H${x + w * 0.72} L${x + w * 0.86} ${y + hh * 0.45} H${x + w} V${y + hh * 0.8} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.5 }),
    s('circle', { cx: x + w * 0.22, cy: y + hh * 0.8, r: hh * 0.2, fill: '#2b2118' }), s('circle', { cx: x + w * 0.78, cy: y + hh * 0.8, r: hh * 0.2, fill: '#2b2118' })],
  turm: (x, y, w, hh) => [s('path', { d: `M${x} ${y + hh} V${y} h${w / 5} v${w / 5} h${w / 5} v${-w / 5} h${w / 5} v${w / 5} h${w / 5} v${-w / 5} h${w / 5} V${y + hh} Z`, fill: '#cfc6b4', stroke: LINIE, 'stroke-width': 2 }),
    [0.25, 0.5, 0.75].map((t) => s('rect', { x: x + w * 0.4, y: y + hh * t, width: w * 0.2, height: Math.min(18, hh * 0.08), fill: '#3a3029' }))],
  baum: (x, y, w, hh) => [s('rect', { x: x + w * 0.42, y: y + hh * 0.55, width: w * 0.16, height: hh * 0.45, fill: '#7a5230', stroke: LINIE, 'stroke-width': 1.5 }),
    s('ellipse', { cx: x + w / 2, cy: y + hh * 0.32, rx: w / 2, ry: hh * 0.32, fill: '#6c9a4f', stroke: '#3f6a2d', 'stroke-width': 2 })],
  haus: (x, y, w, hh) => [s('rect', { x, y: y + hh * 0.35, width: w, height: hh * 0.65, fill: '#f1e3c4', stroke: LINIE, 'stroke-width': 2 }),
    s('path', { d: `M${x - 6} ${y + hh * 0.35} L${x + w / 2} ${y} L${x + w + 6} ${y + hh * 0.35} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 2 }),
    s('rect', { x: x + w * 0.4, y: y + hh * 0.72, width: w * 0.2, height: hh * 0.28, fill: '#8a5a3b', stroke: LINIE, 'stroke-width': 1.2 }), s('rect', { x: x + w * 0.12, y: y + hh * 0.48, width: w * 0.2, height: hh * 0.14, fill: '#dfe7f3', stroke: LINIE, 'stroke-width': 1 }),
    s('rect', { x: x + w * 0.68, y: y + hh * 0.48, width: w * 0.2, height: hh * 0.14, fill: '#dfe7f3', stroke: LINIE, 'stroke-width': 1 })],
  mast: (x, y, w, hh) => [s('rect', { x: x + w * 0.44, y, width: w * 0.12, height: hh, fill: '#9aa3ad', stroke: LINIE, 'stroke-width': 1.2 }),
    s('path', { d: `M${x + w * 0.56} ${y + 4} h${w * 0.9} l${-w * 0.2} ${hh * 0.06} l${w * 0.2} ${hh * 0.06} h${-w * 0.9} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.2 })],
  leuchtturm: (x, y, w, hh) => [s('path', { d: `M${x} ${y + hh} L${x + w * 0.22} ${y + hh * 0.14} H${x + w * 0.78} L${x + w} ${y + hh} Z`, fill: '#fffdf6', stroke: LINIE, 'stroke-width': 2 }),
    [0.3, 0.6].map((t) => s('path', { d: `M${x + w * (0.22 - 0.22 * ((t - 0.14) / 0.86))} ${y + hh * t} H${x + w * (0.78 + 0.22 * ((t - 0.14) / 0.86))} V${y + hh * (t + 0.14)} H${x + w * (0.22 - 0.22 * ((t + 0.14 - 0.14) / 0.86))} Z`, fill: '#a3302a', opacity: 0.85 })),
    s('rect', { x: x + w * 0.25, y, width: w * 0.5, height: hh * 0.14, fill: GOLD, stroke: LINIE, 'stroke-width': 2 })],
  bus: (x, y, w, hh) => [s('rect', { x, y, width: w, height: hh * 0.82, rx: 8, fill: '#e2b23c', stroke: LINIE, 'stroke-width': 2 }),
    Array.from({ length: Math.max(3, Math.round(w / 46)) }, (_, i) => { const n = Math.max(3, Math.round(w / 46)); return s('rect', { x: x + 8 + i * ((w - 16) / n), y: y + hh * 0.14, width: (w - 16) / n - 6, height: hh * 0.28, fill: '#dfe7f3', stroke: LINIE, 'stroke-width': 1 }); }),
    s('circle', { cx: x + w * 0.16, cy: y + hh * 0.82, r: hh * 0.18, fill: '#2b2118' }), s('circle', { cx: x + w * 0.84, cy: y + hh * 0.82, r: hh * 0.18, fill: '#2b2118' })],
  lkw: (x, y, w, hh) => [s('rect', { x, y, width: w * 0.78, height: hh * 0.8, fill: '#cfd6dd', stroke: LINIE, 'stroke-width': 2 }),
    s('path', { d: `M${x + w * 0.8} ${y + hh * 0.8} V${y + hh * 0.3} H${x + w * 0.92} L${x + w} ${y + hh * 0.55} V${y + hh * 0.8} Z`, fill: '#2f4f7f', stroke: LINIE, 'stroke-width': 2 }),
    [0.12, 0.3, 0.9].map((t) => s('circle', { cx: x + w * t, cy: y + hh * 0.82, r: hh * 0.18, fill: '#2b2118' }))],
  schiff: (x, y, w, hh) => [s('path', { d: `M${x} ${y + hh * 0.5} H${x + w} L${x + w * 0.9} ${y + hh} H${x + w * 0.08} Z`, fill: '#8a5a3b', stroke: LINIE, 'stroke-width': 2 }),
    s('rect', { x: x + w * 0.3, y: y + hh * 0.2, width: w * 0.4, height: hh * 0.3, fill: '#fffdf6', stroke: LINIE, 'stroke-width': 1.5 }), s('rect', { x: x + w * 0.46, y, width: w * 0.08, height: hh * 0.2, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.2 })],
  bruecke: (x, y, w, hh) => [s('rect', { x, y, width: w, height: hh * 0.3, fill: '#cfc6b4', stroke: LINIE, 'stroke-width': 2 }),
    Array.from({ length: Math.max(2, Math.round(w / 90)) }, (_, i) => { const b0 = w / Math.max(2, Math.round(w / 90)), x0 = x + i * b0; return s('path', { d: `M${x0 + 6} ${y + hh} V${y + hh * 0.3} M${x0 + b0 - 6} ${y + hh * 0.3} V${y + hh} M${x0 + 6} ${y + hh} Q${x0 + b0 / 2} ${y + hh * 0.2} ${x0 + b0 - 6} ${y + hh}`, fill: 'none', stroke: LINIE, 'stroke-width': 2 }); })],
};
export const VERGLEICH_NAMEN = { kind: 'Kind', tuer: 'Tür', auto: 'Auto', turm: 'Turm', baum: 'Baum', haus: 'Haus', mast: 'Fahnenmast', leuchtturm: 'Leuchtturm', bus: 'Bus', lkw: 'Lastwagen', schiff: 'Schiff', bruecke: 'Brücke' };
// Breite je Höhe (hoch) oder Höhe je Länge (lang) der Formen.
const SCHLANK = { kind: 0.36, tuer: 0.46, turm: 0.3, baum: 0.6, haus: 0.9, mast: 0.1, leuchtturm: 0.3, auto: 0.36, bus: 0.24, lkw: 0.26, schiff: 0.22, bruecke: 0.16 };
function vergleichsBild(b) {
  const mal = b.zehntel / 10, teile = [];
  const titel = `Zum Schätzen: ${VERGLEICH_NAMEN[b.klein]} und ${VERGLEICH_NAMEN[b.gross]}${b.richtung === 'hoch' ? ' stehen nebeneinander' : ' liegen untereinander'}.`;
  if (b.richtung === 'hoch') {
    const H = Math.min(250, Math.max(150, 44 * mal)), hk = H / mal, boden = H + 22, wk = Math.max(14, hk * SCHLANK[b.klein]), wg = Math.max(40, Math.min(170, H * SCHLANK[b.gross]));
    const xk = 34, xg = xk + wk + 46, B = xg + wg + 70;
    if (b.hilfslinien) for (let i = 1; i <= Math.floor(mal + 0.001); i++) teile.push(s('line', { class: 'hilfslinie', x1: 8, x2: B - 8, y1: boden - i * hk, y2: boden - i * hk, stroke: '#8a7a5a', 'stroke-width': 1.2, 'stroke-dasharray': '6 5' }));
    teile.push(s('line', { x1: 0, x2: B, y1: boden, y2: boden, stroke: '#3f6a2d', 'stroke-width': 4 }), s('g', { class: 'vergleich-klein' }, FORM[b.klein](xk, boden - hk, wk, hk)), s('g', { class: 'vergleich-gross' }, FORM[b.gross](xg, boden - H, wg, H)),
      text(xk + wk / 2, boden + 18, VERGLEICH_NAMEN[b.klein], { class: 'bildname' }), text(xg + wg / 2, boden + 18, VERGLEICH_NAMEN[b.gross], { class: 'bildname' }));
    return rahmen(B, boden + 26, titel, teile);
  }
  const W = Math.min(470, Math.max(240, 70 * mal)), wk = W / mal, hk = Math.max(18, Math.min(46, wk * SCHLANK[b.klein])), hg = Math.max(34, Math.min(70, W * SCHLANK[b.gross])), x0 = 14, y1 = 12, y2 = y1 + hk + 34;
  if (b.hilfslinien) for (let i = 0; i <= Math.floor(mal + 0.001); i++) teile.push(s('line', { class: 'hilfslinie', x1: x0 + i * wk, x2: x0 + i * wk, y1: 4, y2: y2 + hg + 6, stroke: '#8a7a5a', 'stroke-width': 1.2, 'stroke-dasharray': '6 5' }));
  teile.push(s('g', { class: 'vergleich-klein' }, FORM[b.klein](x0, y1, wk, hk)), s('g', { class: 'vergleich-gross' }, FORM[b.gross](x0, y2, W, hg)),
    s('text', { x: x0 + wk + 10, y: y1 + hk / 2 + 5, class: 'bildname' }, VERGLEICH_NAMEN[b.klein]), s('text', { x: x0, y: y2 + hg + 22, class: 'bildname' }, VERGLEICH_NAMEN[b.gross]));
  return rahmen(x0 + W + 20, y2 + hg + 30, titel, teile);
}

// ---------- Karte mit Maßstab ----------
// b: { orte: [{ n: 'Burg', mm: 0, zeichen: 'burg' }, …], lang: 100, massstab?: 25000, leiste?: { mm: 10, text: '100 m' } }
// Die Orte liegen an einem geraden Weg. Darunter liegt ein Lineal; mm ist die Stelle des Ortes am Lineal.
const ORT = {
  burg: (x, y) => [s('path', { d: `M${x - 14} ${y} V${y - 22} h6 v5 h5 v-5 h6 v5 h5 v-5 h6 V${y} Z`, fill: '#cfc6b4', stroke: LINIE, 'stroke-width': 1.5 }), s('rect', { x: x - 3, y: y - 9, width: 6, height: 9, fill: '#3a3029' })],
  dorf: (x, y) => [[-9, 7].map((d) => [s('rect', { x: x + d - 7, y: y - 10, width: 14, height: 10, fill: '#f1e3c4', stroke: LINIE, 'stroke-width': 1.2 }), s('path', { d: `M${x + d - 9} ${y - 10} L${x + d} ${y - 19} L${x + d + 9} ${y - 10} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.2 })])],
  muehle: (x, y) => [s('path', { d: `M${x - 8} ${y} L${x - 5} ${y - 18} H${x + 5} L${x + 8} ${y} Z`, fill: '#f1e3c4', stroke: LINIE, 'stroke-width': 1.5 }), s('path', { d: `M${x - 13} ${y - 31} L${x + 13} ${y - 5} M${x + 13} ${y - 31} L${x - 13} ${y - 5}`, stroke: '#7a5230', 'stroke-width': 3 })],
  hafen: (x, y) => [s('path', { d: `M${x - 14} ${y - 8} H${x + 14} L${x + 9} ${y} H${x - 9} Z`, fill: '#8a5a3b', stroke: LINIE, 'stroke-width': 1.5 }), s('path', { d: `M${x} ${y - 8} V${y - 28} L${x + 12} ${y - 12} Z`, fill: '#fffdf6', stroke: LINIE, 'stroke-width': 1.5 })],
  wald: (x, y) => [[-9, 0, 9].map((d) => s('path', { d: `M${x + d - 7} ${y} L${x + d} ${y - 22 - (d === 0 ? 5 : 0)} L${x + d + 7} ${y} Z`, fill: '#6c9a4f', stroke: '#3f6a2d', 'stroke-width': 1.2 }))],
  turm: (x, y) => [s('rect', { x: x - 6, y: y - 26, width: 12, height: 26, fill: '#cfc6b4', stroke: LINIE, 'stroke-width': 1.5 }), s('path', { d: `M${x - 9} ${y - 26} L${x} ${y - 37} L${x + 9} ${y - 26} Z`, fill: '#a3302a', stroke: LINIE, 'stroke-width': 1.2 })],
  bruecke: (x, y) => [s('path', { d: `M${x - 15} ${y} Q${x} ${y - 20} ${x + 15} ${y}`, fill: 'none', stroke: LINIE, 'stroke-width': 4 }), s('path', { d: `M${x - 15} ${y} Q${x} ${y - 9} ${x + 15} ${y}`, fill: 'none', stroke: '#6c93c4', 'stroke-width': 3 })],
};
const tausender = (n) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ');
const massstabText = (b) => (b.massstab ? `Maßstab 1:${tausender(b.massstab)}` : '');
function leisteSvg(b, x, y, mm) {
  if (!b.leiste) return null;
  const br = b.leiste.mm * mm;
  return s('g', { class: 'massstabsleiste' }, s('rect', { x, y, width: br, height: 7, fill: '#3a3029' }), s('line', { x1: x, x2: x, y1: y - 4, y2: y + 11, stroke: '#3a3029', 'stroke-width': 1.5 }), s('line', { x1: x + br, x2: x + br, y1: y - 4, y2: y + 11, stroke: '#3a3029', 'stroke-width': 1.5 }),
    s('text', { x: x + br + 8, y: y + 8, 'font-size': 14, 'font-weight': 700, fill: '#3a3029' }, b.leiste.text), s('text', { x, y: y - 8, 'font-size': 12, fill: '#6b5f50' }, `${b.leiste.mm / 10} cm auf der Karte`));
}
function karteBild(b) {
  const mm = 6, links = 34, B = links * 2 + b.lang * mm, yWeg = 96, yL = 122, hoch = 58, X = (w) => links + w * mm;
  const svg = s('svg', { class: 'linealbild kartenbild', viewBox: `0 0 ${B} ${yL + hoch + 8}`, role: 'img',
    'aria-label': `Karte mit Lineal${b.massstab ? `, ${massstabText(b)}` : ''}${b.leiste ? `, ${b.leiste.mm / 10} cm auf der Karte sind ${b.leiste.text}` : ''}. ${b.orte.map((o) => `${o.n} liegt bei ${o.mm} Millimetern`).join(', ')}.` });
  svg.style.maxWidth = `${Math.min(B, 760)}px`;
  svg.append(s('rect', { x: 4, y: 4, width: B - 8, height: yL - 10, rx: 8, fill: '#f3ead2', stroke: '#b9a26a', 'stroke-width': 1.5 }));
  // Ein wenig Landschaft, immer dieselbe, damit jedes Kind dasselbe Bild sieht.
  for (const [dx, dy] of [[0.12, 30], [0.33, 22], [0.58, 34], [0.8, 24], [0.93, 40]]) svg.append(s('path', { d: `M${B * dx - 14} ${dy + 8} q7 -12 14 0 q7 -12 14 0`, fill: 'none', stroke: '#c5b383', 'stroke-width': 1.5 }));
  svg.append(s('line', { class: 'weg', x1: X(b.orte[0].mm), y1: yWeg, x2: X(b.orte.at(-1).mm), y2: yWeg, stroke: '#8a5a3b', 'stroke-width': 4, 'stroke-dasharray': '10 5' }));
  b.orte.forEach((o, i) => svg.append(s('g', { class: 'ort' }, ORT[o.zeichen ?? 'dorf'](X(o.mm), yWeg - 8), s('circle', { cx: X(o.mm), cy: yWeg, r: 5, fill: '#a3302a', stroke: '#fffdf6', 'stroke-width': 1.5 }),
    s('text', { x: X(o.mm), y: yWeg - (i % 2 ? 52 : 50), 'text-anchor': 'middle', class: 'punktname' }, o.n), s('line', { x1: X(o.mm), y1: yWeg + 6, x2: X(o.mm), y2: yL, class: 'streckenende' }))));
  if (b.massstab) svg.append(s('text', { x: B - 14, y: 24, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 700, fill: '#3a3029' }, massstabText(b)));
  if (b.leiste) svg.append(leisteSvg(b, 16, 22, mm));
  svg.append(s('rect', { x: X(0) - 14, y: yL, width: b.lang * mm + 28, height: hoch, rx: 5, class: 'lineal' }));
  for (let w = 0; w <= b.lang; w++) {
    svg.append(s('line', { x1: X(w), y1: yL, x2: X(w), y2: yL + (w % 10 === 0 ? 24 : w % 5 === 0 ? 17 : 11), class: `mm${w % 10 === 0 ? ' cm' : ''}` }));
    if (w % 10 === 0) svg.append(s('text', { x: X(w), y: yL + 43, 'text-anchor': 'middle', class: 'cmzahl' }, String(w / 10)));
  }
  svg.append(s('text', { x: X(b.lang) + 4, y: yL + 55, 'text-anchor': 'end', class: 'cmwort' }, 'cm'));
  return h('figure', { class: 'datenbild geobild' }, svg);
}

// ---------- Grundriss ----------
// b: { name: 'Rittersaal', b: 60, h: 40 (Millimeter im Plan), massstab?: 100, leiste? }: ein Rechteck mit seinen Maßen im Plan.
const planMass = (mm) => (mm % 10 === 0 ? `${mm / 10} cm` : `${Math.floor(mm / 10)} cm ${mm % 10} mm`);
function grundrissBild(b) {
  const k = Math.min(4, 300 / b.b, 170 / b.h), w = b.b * k, hh = b.h * k, x = 62, y = 40, B = x + w + 40;
  return rahmen(Math.max(B, 300), y + hh + 46, `Grundriss ${b.name}: im Plan ${planMass(b.b)} lang und ${planMass(b.h)} breit${b.massstab ? `, ${massstabText(b)}` : ''}${b.leiste ? `, ${b.leiste.mm / 10} cm im Plan sind ${b.leiste.text}` : ''}.`,
    s('rect', { x, y, width: w, height: hh, fill: '#fffdf6', stroke: '#3a3029', 'stroke-width': 5 }), s('rect', { x: x + w * 0.42, y: y + hh - 3, width: Math.min(34, w * 0.2), height: 6, fill: '#fffdf6' }),
    text(x + w / 2, y + hh / 2 + 6, b.name, { class: 'bildname' }),
    s('path', { d: `M${x} ${y + hh + 14} H${x + w} M${x} ${y + hh + 8} v12 M${x + w} ${y + hh + 8} v12 M${x - 14} ${y} V${y + hh} M${x - 20} ${y} h12 M${x - 20} ${y + hh} h12`, stroke: '#a3302a', 'stroke-width': 1.5, fill: 'none' }),
    text(x + w / 2, y + hh + 34, planMass(b.b), { class: 'bildzahl klein' }), s('text', { x: x - 20, y: y + hh / 2 + 6, 'text-anchor': 'end', class: 'bildzahl klein' }, planMass(b.h)),
    b.massstab && s('text', { x, y: 22, 'font-size': 15, 'font-weight': 700, fill: '#3a3029' }, massstabText(b)), b.leiste && leisteSvg(b, x, 22, k));
}

// ---------- Zeitleiste ----------
// b: { punkte: ['8:35', '9:00', '10:20'], spruenge: ['25 min', '1 h 20 min'] }: Zeitpunkte auf einer Linie, darüber die Zeitspannen als Bögen.
// Ein Eintrag { wert, frage: true } erscheint als Fragezeichen.
function zeitleisteBild(b) {
  const n = b.punkte.length, rand = 58, schritt = Math.min(190, 440 / (n - 1)), B = rand * 2 + schritt * (n - 1), y = 78, X = (i) => rand + i * schritt, teile = [];
  teile.push(s('line', { x1: rand - 22, x2: B - rand + 22, y1: y, y2: y, stroke: LINIE, 'stroke-width': 3 }));
  b.punkte.forEach((p, i) => teile.push(s('line', { x1: X(i), x2: X(i), y1: y - 9, y2: y + 9, stroke: LINIE, 'stroke-width': 3 }),
    text(X(i), y + 30, istFrage(p) ? '?' : `${p} Uhr`, { class: istFrage(p) ? 'bildfrage' : 'bildzahl klein' })));
  b.spruenge.forEach((sp, i) => teile.push(s('path', { d: `M${X(i) + 4} ${y - 12} Q${X(i) + schritt / 2} ${y - 62} ${X(i + 1) - 4} ${y - 12}`, fill: 'none', stroke: DUNKEL, 'stroke-width': 2.5 }),
    s('path', { d: `M${X(i + 1) - 4} ${y - 12} l-10 -3 l5 -8 Z`, fill: DUNKEL }), text(X(i) + schritt / 2, y - 46, istFrage(sp) ? '?' : `+ ${sp}`, { class: istFrage(sp) ? 'bildfrage' : 'bildzahl klein' })));
  return rahmen(B, y + 42, `Zeitleiste: ${b.punkte.map((p) => (istFrage(p) ? 'gesuchte Uhrzeit' : `${p} Uhr`)).join(', ')}. Zeitspannen dazwischen: ${b.spruenge.map((x) => (istFrage(x) ? 'gesucht' : x)).join(', ')}.`, teile);
}

export const GROESSENBILDER = { geld: geldBild, uhr: uhrBild, waage: waageBild, einheitentafel: einheitentafelBild, vergleichsbild: vergleichsBild, karte: karteBild, grundriss: grundrissBild, zeitleiste: zeitleisteBild };

// ---------- Größeneingabe ----------
// Ein Zahlenfeld, das auch ein Komma annimmt, und dahinter die Einheit: fest oder zum Auswählen (auf.einheiten).
// Im Speicherstand steht die Eingabe als Text „2,5 km“. Ohne gewählte Einheit steht nur die Zahl da.
export function groesseEingabe(auf, letzte, gesperrt) {
  const alt = teileEingabe(letzte);
  return h('span', { class: 'zahlfeld groessefeld' },
    h('input', { name: 'zahl', type: 'text', inputMode: 'decimal', autocomplete: 'off', size: 9, disabled: gesperrt, value: alt.zahl, 'aria-label': 'Deine Antwort, die Zahl' }),
    auf.einheiten
      ? h('select', { name: 'einheit', class: 'einheitwahl', disabled: gesperrt, 'aria-label': 'Einheit wählen' }, h('option', { value: '' }, 'Einheit'), auf.einheiten.map((e) => h('option', { value: e, selected: alt.einheit === e }, e)))
      : h('span', { class: 'einheit' }, auf.einheit));
}
export function liesGroesse(auf, formular) {
  const zahl = formular.elements.zahl?.value.trim() ?? '', einheit = auf.einheiten ? formular.elements.einheit?.value ?? '' : auf.einheit;
  return { eingabe: `${zahl}${einheit ? ` ${einheit}` : ''}`, leer: !zahl };
}
export const istEinheit = (e) => e in EINHEITEN;
