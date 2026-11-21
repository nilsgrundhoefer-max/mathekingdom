// Gezeichnete Bausteine im Stil alter Kartografie: Münze, Siegel, Wappen, Regionskarte, Schlossgarten (ADR 0010).
import { s } from './dom.js';
import { NIVEAUS, KRONEN, WAPPEN_TEILE } from './logik.js';
import { ZEICHNER } from './wappenzeichen.js';

// Gedämpfte Farben der Niveaustufen für das Lehrer-Dashboard (dort nur als Buchstaben-Chips).
export const NIVEAU_FARBE = { F: '#9a6a1f', G: '#4b6b35', M: '#2f4f7f', E: '#7b2d43' };
const PERGAMENT = '#f6efdf';
const SEPIA = '#5b4632';

// Kronen in vier Farben (ADR 0012). Damit man sie auch ohne Farbe unterscheidet, trägt jede Krone
// so viele Edelsteine wie ihre Stufe: Bronze einen, Silber zwei, Gold drei, Purpur vier.
export const KRONEN_FARBE = {
  F: { fuell: '#b9783e', rand: '#6b3f17', stein: '#f0d2b0' },
  G: { fuell: '#c3c8cf', rand: '#5d636b', stein: '#ffffff' },
  M: { fuell: '#dcb24a', rand: '#7a5a12', stein: '#fff2c4' },
  E: { fuell: '#7d3f93', rand: '#3f1b4d', stein: '#e9c9f4' },
};
const KRONE = 'M2 16 L3.5 6 L7.5 10.5 L10 3.5 L12.5 10.5 L16.5 6 L18 16 Z';
export function kroneBild(niveau, groesse = 22, { voll = true, titel = null } = {}) {
  const f = KRONEN_FARBE[niveau];
  const attr = { viewBox: '0 0 20 20', width: groesse, height: groesse, class: `krone krone-${niveau ?? 'leer'}`, ...(titel ? { role: 'img', 'aria-label': titel } : { 'aria-hidden': 'true' }) };
  if (!voll || !f) return s('svg', attr, s('path', { d: KRONE, fill: 'none', stroke: '#a89d8a', 'stroke-width': 1.2, 'stroke-dasharray': '2 1.6', 'stroke-linejoin': 'round' }),
    s('path', { d: 'M2 16 H18 V18 H2 Z', fill: 'none', stroke: '#a89d8a', 'stroke-width': 1 }));
  const zahl = NIVEAUS.indexOf(niveau) + 1;
  const steine = Array.from({ length: zahl }, (_, i) => s('circle', { cx: 10 + (i - (zahl - 1) / 2) * 3.4, cy: 14.6, r: 1.15, fill: f.stein, stroke: f.rand, 'stroke-width': 0.5 }));
  return s('svg', attr,
    s('path', { d: KRONE, fill: f.fuell, stroke: f.rand, 'stroke-width': 1.1, 'stroke-linejoin': 'round' }),
    s('path', { d: 'M2 16 H18 V18.4 H2 Z', fill: f.fuell, stroke: f.rand, 'stroke-width': 1.1, 'stroke-linejoin': 'round' }),
    ...steine);
}

// Symbole der Hoftitel (ADR 0023). Die Königskrone ist absichtlich anders als die Kronen der Meilensteine:
// höher, mit Kreuz, rotem Samt und Hermelinband, ohne Edelsteine einer Kronenfarbe.
const TINTE = '#3b2f22';
const HOFSYMBOL = {
  koenig: () => [
    s('path', { d: 'M5 9.5 C5 6 15 6 15 9.5 Z', fill: '#a3243b', stroke: TINTE, 'stroke-width': 0.8 }),
    s('path', { d: 'M3 15 L3.6 7.2 L6.8 10.4 L10 5.2 L13.2 10.4 L16.4 7.2 L17 15 Z', fill: '#e0b53c', stroke: TINTE, 'stroke-width': 1, 'stroke-linejoin': 'round' }),
    s('path', { d: 'M10 1.2 V4.6 M8.6 2.6 H11.4', stroke: TINTE, 'stroke-width': 1.1, 'stroke-linecap': 'round' }),
    s('rect', { x: 2.6, y: 14.6, width: 14.8, height: 3.6, rx: 0.8, fill: '#fbf7ee', stroke: TINTE, 'stroke-width': 0.9 }),
    ...[5, 8.3, 11.7, 15].map((x) => s('path', { d: `M${x} 15.6 v1.6`, stroke: '#1d1712', 'stroke-width': 1.1, 'stroke-linecap': 'round' }))],
  herzog: () => [
    s('path', { d: 'M5 17 L13.2 6.8', stroke: '#8a6a1c', 'stroke-width': 1.8, 'stroke-linecap': 'round' }),
    s('path', { d: 'M5 17 L13.2 6.8', stroke: '#e0b53c', 'stroke-width': 0.8, 'stroke-linecap': 'round' }),
    s('circle', { cx: 14.4, cy: 5.4, r: 2.6, fill: '#e0b53c', stroke: TINTE, 'stroke-width': 0.9 }),
    s('path', { d: 'M14.4 1.4 V2.8 M13.6 2 H15.2', stroke: TINTE, 'stroke-width': 0.9, 'stroke-linecap': 'round' }),
    s('path', { d: 'M8.4 12.7 l1.6 1.3', stroke: TINTE, 'stroke-width': 1.2, 'stroke-linecap': 'round' })],
  graf: () => [
    s('path', { d: 'M10 1.6 L11.4 4 V13 H8.6 V4 Z', fill: '#d9dde2', stroke: TINTE, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }),
    s('path', { d: 'M10 4 V12.4', stroke: '#8d949c', 'stroke-width': 0.6 }),
    s('rect', { x: 5.4, y: 12.8, width: 9.2, height: 1.8, rx: 0.9, fill: '#8a6a1c', stroke: TINTE, 'stroke-width': 0.8 }),
    s('rect', { x: 9.1, y: 14.6, width: 1.8, height: 2.6, fill: '#6b4a2a', stroke: TINTE, 'stroke-width': 0.6 }),
    s('circle', { cx: 10, cy: 18.2, r: 1.2, fill: '#e0b53c', stroke: TINTE, 'stroke-width': 0.7 })],
  ritter: () => [
    s('path', { d: 'M4.4 17.6 V9.4 C4.4 5.2 7 3 10 3 C13 3 15.6 5.2 15.6 9.4 V17.6 Z', fill: '#c3c8cf', stroke: TINTE, 'stroke-width': 1, 'stroke-linejoin': 'round' }),
    s('path', { d: 'M6 10 H14', stroke: TINTE, 'stroke-width': 1.3, 'stroke-linecap': 'round' }),
    s('path', { d: 'M10 3 V17.6', stroke: '#8d949c', 'stroke-width': 0.6 }),
    ...[12.6, 14.4].map((y) => s('path', { d: `M7.6 ${y} h1.2 M11.2 ${y} h1.2`, stroke: TINTE, 'stroke-width': 0.9, 'stroke-linecap': 'round' })),
    s('path', { d: 'M10 3 C11 1.2 13.4 0.8 14.6 1.6 C13 2 11.8 2.6 10 3 Z', fill: '#a3243b', stroke: TINTE, 'stroke-width': 0.6 })],
  knappe: () => [
    s('path', { d: 'M5 1.8 V18.4', stroke: '#6b4a2a', 'stroke-width': 1.4, 'stroke-linecap': 'round' }),
    s('path', { d: 'M5.6 2.6 H16.8 L12.4 5.4 L16.8 8.2 H5.6 Z', fill: '#2f6f73', stroke: TINTE, 'stroke-width': 0.9, 'stroke-linejoin': 'round' }),
    s('circle', { cx: 5, cy: 1.6, r: 1, fill: '#e0b53c', stroke: TINTE, 'stroke-width': 0.6 })],
};
export function hoftitelBild(id, groesse = 22, { titel = null } = {}) {
  const zeichner = HOFSYMBOL[id];
  if (!zeichner) return null;
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, class: `hofsymbol hofsymbol-${id}`, ...(titel ? { role: 'img', 'aria-label': titel } : { 'aria-hidden': 'true' }) }, zeichner());
}

export function muenze(groesse = 18) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true' },
    s('circle', { cx: 10, cy: 10, r: 9, fill: '#d6ae4a', stroke: '#8a6a1c', 'stroke-width': 1.5 }),
    s('circle', { cx: 10, cy: 10, r: 5.5, fill: 'none', stroke: '#8a6a1c', 'stroke-width': 1 }));
}

// Wachssiegel: gewellter Rand, Prägering. Leer ist es nur ein gestrichelter Kreis.
const SIEGELRAND = (() => {
  const punkte = [];
  for (let i = 0; i < 24; i++) {
    const w = (i / 24) * Math.PI * 2, r = i % 2 ? 8.4 : 9.4;
    punkte.push(`${(10 + r * Math.cos(w)).toFixed(2)} ${(10 + r * Math.sin(w)).toFixed(2)}`);
  }
  return `M${punkte.join(' L')} Z`;
})();
export function siegel(groesse = 18, voll = true) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true', class: 'siegel' },
    voll
      ? [s('path', { d: SIEGELRAND, fill: '#a3302a', stroke: '#6e1c18', 'stroke-width': 0.8, 'stroke-linejoin': 'round' }),
        s('circle', { cx: 10, cy: 10, r: 5.6, fill: 'none', stroke: '#e7b3a6', 'stroke-width': 0.9, opacity: 0.8 }),
        s('path', { d: 'M7.2 12.2 V8 L10 10.6 L12.8 8 V12.2', fill: 'none', stroke: '#f3d2c8', 'stroke-width': 1.1, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })]
      : s('circle', { cx: 10, cy: 10, r: 8, fill: 'none', stroke: '#a89d8a', 'stroke-width': 1.3, 'stroke-dasharray': '2.2 2' }));
}

// Siegel der Münzgabe (ADR 0027): goldenes Wachs mit Münze, damit es nicht wie der Sonderauftrag aussieht.
export function gabeSiegel(groesse = 44) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true', class: 'siegel gabesiegel' },
    s('path', { d: SIEGELRAND, fill: '#c9962e', stroke: '#7a5a12', 'stroke-width': 0.8, 'stroke-linejoin': 'round' }),
    s('circle', { cx: 10, cy: 10, r: 5.4, fill: '#e8c766', stroke: '#7a5a12', 'stroke-width': 0.9 }),
    s('circle', { cx: 10, cy: 10, r: 3, fill: 'none', stroke: '#7a5a12', 'stroke-width': 0.7 }));
}

// Kleine Zeichen über einem Meilenstein.
const kompass = (x, y) => s('g', { transform: `translate(${x} ${y})`, class: 'zeichen-kompass' },
  s('circle', { r: 10, fill: PERGAMENT, stroke: SEPIA, 'stroke-width': 1.5 }),
  s('path', { d: 'M0 -7 L2.6 0 L0 7 L-2.6 0 Z', fill: SEPIA }),
  s('path', { d: 'M0 -7 L2.6 0 L-2.6 0 Z', fill: '#a3302a' }));
const schloss = (x, y) => s('g', { transform: `translate(${x} ${y})`, class: 'zeichen-schloss' },
  s('path', { d: 'M-4 -2 V-5 A4 4 0 0 1 4 -5 V-2', fill: 'none', stroke: '#6f665a', 'stroke-width': 1.8 }),
  s('rect', { x: -6, y: -2, width: 12, height: 9, rx: 1.5, fill: '#6f665a' }));

// Wappen: Schild in der gewählten Farbe, darauf ein großes Hauptzeichen und bis zu zwei kleine Beizeichen oben (ADR 0018).
// Auf hellen Metallfarben (Silber, Gold) stehen die Zeichen dunkel, sonst hell.
const SCHILD = 'M10 8 H90 V48 C90 78 68 96 50 104 C32 96 10 78 10 48 Z';
const ORTE = [{ x: 50, y: 60, m: 0.92 }, { x: 27, y: 25, m: 0.34 }, { x: 73, y: 25, m: 0.34 }];
export function wappenBild(wappen, breite = 60) {
  const feld = WAPPEN_TEILE.find((w) => w.id === wappen.farbe) ?? WAPPEN_TEILE[0];
  const zeichenFarbe = feld.metall ? '#2f2820' : '#f3e7c9';
  const zeichen = (wappen.zeichen ?? []).filter((id) => ZEICHNER[id]).slice(0, ORTE.length);
  const id = `mk-schild-${Math.random().toString(36).slice(2, 8)}`;
  return s('svg', { viewBox: '0 -12 100 124', width: breite, height: (breite * 124) / 100, role: 'img', 'aria-label': 'Dein Wappen', class: 'wappen' },
    s('defs', {}, s('clipPath', { id }, s('path', { d: SCHILD }))),
    s('path', { d: SCHILD, fill: feld.wert }),
    s('g', { 'clip-path': `url(#${id})` }, zeichen.map((z, i) => {
      // Nur ein Hauptzeichen: Es steht in der Mitte. Mit Beizeichen rückt es etwas nach unten.
      const ort = i === 0 && zeichen.length === 1 ? { x: 50, y: 54, m: 1 } : ORTE[i];
      return s('g', { transform: `translate(${ort.x} ${ort.y}) scale(${ort.m})`, class: `zeichen-${z}` }, ZEICHNER[z](zeichenFarbe, feld.wert));
    })),
    s('path', { d: SCHILD, fill: 'none', stroke: '#2f2820', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
}

// ---------- Regionskarte (region_map) ----------
// Ein Weg, Unterkapitel als Meilensteine (ADR 0012). Über jedem Meilenstein steht seine Krone, sobald es eine gibt.
// Meilensteine gehen nicht nacheinander auf; die Nummern zeigen nur die empfohlene Reihenfolge.
// milestones: [{ id, titel, extra, status, krone }]; status: leer | gesperrt | offen | begonnen | gemeistert
export function regionMap({ milestones, standort, gewaehlt, wappen, beiMeilenstein }) {
  const ABSTAND = 150, LINKS = 90, OBEN = 96, STUFE = 52, HOCH = 40;
  const haupt = milestones.filter((m) => !m.extra).length;
  const breite = LINKS + (milestones.length - 1) * ABSTAND + 150;
  const hoehe = OBEN + (haupt > 3 ? STUFE : 0) + HOCH + (milestones.length > haupt ? 70 : 0) + 120;
  const x = (j) => LINKS + j * ABSTAND;
  const versatz = (j) => (Math.floor(j / 3) % 2) * STUFE; // alle drei Meilensteine biegt der Weg ab
  const y = (j) => OBEN + versatz(j) + HOCH / 2;

  let d = `M${x(0) - 60} ${y(0)}`;
  for (let j = 0; j < haupt; j++) {
    if (j > 0 && versatz(j) !== versatz(j - 1)) {
      const mitte = (x(j - 1) + x(j)) / 2, halb = STUFE / 2;
      d += ` C${mitte} ${y(j - 1)} ${mitte} ${y(j)} ${mitte + halb} ${y(j)}`;
    }
    d += ` L${x(j)} ${y(j)}`;
  }
  d += ` L${x(haupt - 1) + 40} ${y(haupt - 1)}`;

  const svg = s('svg', { viewBox: `0 0 ${breite} ${hoehe}`, width: breite, height: hoehe, class: 'regionskarte', role: 'group', 'aria-label': 'Regionskarte' },
    s('rect', { x: 3, y: 3, width: breite - 6, height: hoehe - 6, rx: 6, class: 'kartenrand' }));
  const unten = y(haupt - 1) + 70;
  const mitteVon = (m, j) => [x(j), m.extra ? unten : y(j)];
  // Landschaft und Nebel (ADR 0014): Jeder gemeisterte Meilenstein lichtet den Nebel um sich und gibt die Zeichnung daneben frei.
  svg.append(s('g', { class: 'landschaft', 'aria-hidden': 'true' }, milestones.map((m, j) => {
    const [mx, my] = mitteVon(m, j);
    return landschaft(j, mx + 104, m.extra ? my + 4 : my - 64);
  })));
  const frei = milestones.map((m, j) => [m, j]).filter(([m]) => m.status === 'gemeistert');
  const nebelId = `mk-nebel-${Math.random().toString(36).slice(2, 8)}`;
  svg.append(
    s('defs', {},
      s('filter', { id: `${nebelId}-weich`, x: '-50%', y: '-50%', width: '200%', height: '200%' }, s('feGaussianBlur', { stdDeviation: 18 })),
      s('mask', { id: nebelId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: breite, height: hoehe },
        s('rect', { x: 0, y: 0, width: breite, height: hoehe, fill: 'white' }),
        frei.map(([m, j]) => { const [mx, my] = mitteVon(m, j); return s('ellipse', { cx: mx + 45, cy: my - 25, rx: 125, ry: 95, fill: 'black', filter: `url(#${nebelId}-weich)` }); }))),
    s('rect', { x: 4, y: 4, width: breite - 8, height: hoehe - 8, rx: 6, class: 'nebel', mask: `url(#${nebelId})`, 'aria-hidden': 'true', 'data-frei': frei.length }),
    windrose(breite - 46, hoehe - 46),
    s('path', { d, class: 'weg-rand' }), s('path', { d, class: 'weg' }));
  // Abstecher: gestrichelt unterhalb des Weges
  milestones.forEach((m, j) => {
    if (!m.extra) return;
    svg.append(s('path', { d: `M${x(haupt - 1)} ${y(haupt - 1)} C${x(haupt - 1)} ${unten} ${x(j) - 40} ${unten} ${x(j)} ${unten}`, class: 'abstecher' }));
  });
  milestones.forEach((m, j) => {
    const mitte = m.extra ? unten : y(j);
    const oben = mitte - HOCH / 2;
    const hier = m.id === standort && ['offen', 'begonnen'].includes(m.status);
    const nummer = m.extra ? null : j + 1;
    const zustand = m.status === 'gemeistert' ? ', gemeistert' : m.status === 'gesperrt' ? ', gesperrt' : m.status === 'imnebel' ? ', noch im Nebel' : '';
    const kroneText = m.krone ? `, Krone ${KRONEN[m.krone]}` : '';
    const g = s('g', { class: `meilenstein ${m.status}${m.id === gewaehlt ? ' gewaehlt' : ''}${hier ? ' standort' : ''}`, tabindex: 0, role: 'button',
      'aria-label': m.status === 'imnebel' ? `Meilenstein ${nummer ?? ''} noch im Nebel` : `Meilenstein ${m.titel}${zustand}${kroneText}`,
      onclick: () => beiMeilenstein(m.id), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiMeilenstein(m.id); } } },
      hier && s('rect', { x: x(j) - 19, y: oben - 7, width: 38, height: HOCH + 14, rx: 9, class: 'puls' }),
      s('rect', { x: x(j) - 12, y: oben, width: 24, height: HOCH, rx: 6, class: 'stein' }),
      nummer && s('text', { x: x(j), y: oben + HOCH - 9, 'text-anchor': 'middle', class: 'steinnummer' }, nummer));
    const zeichen = m.krone ? kroneBild(m.krone, 34) : m.status === 'gemeistert' ? siegel(26, true) : null;
    if (zeichen) { zeichen.setAttribute('x', x(j) - (m.krone ? 17 : 13)); zeichen.setAttribute('y', oben - (m.krone ? 38 : 30)); g.append(zeichen); }
    else if (m.status === 'begonnen') g.append(kompass(x(j), oben - 18));
    else if (m.status === 'gesperrt') g.append(schloss(x(j), oben - 16));
    if (hier) g.append(s('text', { x: x(j) + 18, y: oben - 42, class: 'hiermarke' }, 'Hier weiter'));
    // Im Nebel nur Umriss und Nummer, ohne Namen (ADR 0026).
    if (m.status !== 'imnebel') g.append(s('text', { x: x(j) + 4, y: oben + HOCH + 18, transform: `rotate(34 ${x(j) + 4} ${oben + HOCH + 18})`, class: 'meilensteinname' }, m.titel));
    svg.append(g);
  });
  // Das eigene Wappen steht am empfohlenen Meilenstein auf dem Weg.
  const ort = Math.max(0, milestones.findIndex((m) => m.id === standort));
  const bild = wappenBild(wappen, 26);
  const ortY = milestones[ort]?.extra ? unten : y(ort);
  bild.setAttribute('x', x(ort) - 52); bild.setAttribute('y', ortY - 16);
  bild.setAttribute('class', 'wappen standwappen');
  svg.append(bild);
  return svg;
}

// Kleine Federzeichnungen der Landschaft, eine je Meilenstein, reihum: Dorf, Wald, Brücke, Burg, Mühle, Berge.
const LANDSCHAFT = ['Dorf', 'Wald', 'Brücke', 'Burg', 'Mühle', 'Berge'];
function landschaft(j, cx, cy) {
  const strich = { fill: 'none', stroke: SEPIA, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  const art = LANDSCHAFT[j % LANDSCHAFT.length];
  const formen = {
    Dorf: [s('path', { ...strich, d: 'M-22 8 V-4 L-14 -12 L-6 -4 V8 Z M-2 8 V-8 L8 -18 L18 -8 V8 Z M5 8 V1 H11 V8' }), s('path', { ...strich, d: 'M8 -18 V-24' })],
    Wald: [-18, -4, 10].map((dx, i) => s('path', { ...strich, fill: '#c7d0ae', d: `M${dx} 8 V3 M${dx - 9} 3 L${dx} ${-16 - i * 2} L${dx + 9} 3 Z` })),
    Brücke: [s('path', { ...strich, stroke: '#5f86a6', 'stroke-width': 3, d: 'M-30 10 C-12 4 6 14 30 6' }), s('path', { ...strich, d: 'M-14 4 C-6 -6 6 -6 14 4 M-14 4 V10 M14 4 V8' })],
    Burg: [s('path', { ...strich, d: 'M-16 10 V-8 H-12 V-12 H-8 V-8 H8 V-12 H12 V-8 H16 V10 Z M-3 10 V2 A3 3 0 0 1 3 2 V10' }), s('path', { ...strich, d: 'M0 -8 V-22 L9 -19 L0 -16' })],
    Mühle: [s('path', { ...strich, d: 'M-8 10 L-5 -6 H5 L8 10 Z' }), s('path', { ...strich, d: 'M0 -6 L-14 -20 M0 -6 L14 -20 M0 -6 L-14 8 M0 -6 L14 8' })],
    Berge: [s('path', { ...strich, fill: '#ddd2b8', d: 'M-30 10 L-12 -16 L0 0 L10 -12 L30 10 Z' }), s('path', { ...strich, d: 'M-16 -10 L-12 -16 L-8 -10' })],
  };
  return s('g', { transform: `translate(${cx} ${cy}) scale(.85)`, class: 'zeichnung', 'data-art': art }, formen[art]);
}

function windrose(cx, cy) {
  return s('g', { transform: `translate(${cx} ${cy})`, class: 'windrose', 'aria-hidden': 'true' },
    s('circle', { r: 22, fill: 'none' }),
    s('path', { d: 'M0 -30 L5 0 L0 30 L-5 0 Z M-30 0 L0 5 L30 0 L0 -5 Z' }),
    s('text', { y: -33, 'text-anchor': 'middle' }, 'N'));
}

// ---------- Schlossgarten (world_map) ----------
// Gartentor einer Region: offen mit Weg dahinter, geschlossen mit Gitter.
export function gartentor(offen, groesse = 54) {
  return s('svg', { viewBox: '0 0 60 60', width: groesse, height: groesse, 'aria-hidden': 'true', class: `gartentor ${offen ? 'offen' : 'zu'}` },
    s('path', { d: 'M8 56 V24 A22 22 0 0 1 52 24 V56', fill: 'none', stroke: SEPIA, 'stroke-width': 3 }),
    s('path', { d: 'M4 56 H56', stroke: SEPIA, 'stroke-width': 2 }),
    offen
      ? [s('path', { d: 'M22 56 C26 44 34 44 38 56', fill: '#e2d3ad', stroke: '#9a6a1f', 'stroke-width': 1.5 }),
        s('path', { d: 'M8 24 L2 30 V56', fill: 'none', stroke: SEPIA, 'stroke-width': 2 }), s('path', { d: 'M52 24 L58 30 V56', fill: 'none', stroke: SEPIA, 'stroke-width': 2 })]
      : [16, 24, 32, 40, 48].map((xx) => s('path', { d: `M${xx} ${xx === 16 || xx === 48 ? 30 : 20} V56`, stroke: '#6f665a', 'stroke-width': 2 })),
    s('path', { d: 'M10 18 C16 10 24 6 30 6 C36 6 44 10 50 18', fill: 'none', stroke: '#4b6b35', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }));
}
// Kleine Bildzeichen für die Knöpfe der Kopfzeile (seit 0.34). In Strichfarbe des Knopfs, damit sie auch auf dem dunklen aktiven Knopf stehen.
export function turmZeichen(groesse = 20) {
  const strich = { fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true', class: 'knopfzeichen turm' },
    s('path', { d: 'M5 19 V8 H6.8 V6 H8.6 V8 H11.4 V6 H13.2 V8 H15 V19 Z', ...strich }),
    s('path', { d: 'M8.6 19 V15.4 A1.4 1.4 0 0 1 11.4 15.4 V19', ...strich }),
    s('path', { d: 'M10 6 V1', ...strich }),
    s('path', { d: 'M10 1.2 L14.2 2.5 L10 3.8 Z', fill: '#c0392b', stroke: '#c0392b', 'stroke-width': 0.8, 'stroke-linejoin': 'round' }));
}
export function wuerfelZeichen(groesse = 20) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true', class: 'knopfzeichen wuerfel' },
    s('rect', { x: 2.5, y: 2.5, width: 15, height: 15, rx: 3.2, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 }),
    [[6.5, 6.5], [13.5, 6.5], [10, 10], [6.5, 13.5], [13.5, 13.5]].map(([cx, cy]) => s('circle', { cx, cy, r: 1.35, fill: 'currentColor' })));
}
// Kopfbild des Schlossgartens: Schloss in Federzeichnung, davor Hecken und Wege.
export function schlossBild() {
  const strich = { fill: 'none', stroke: SEPIA, 'stroke-width': 2, 'stroke-linejoin': 'round' };
  return s('svg', { viewBox: '0 0 600 150', class: 'schlossbild', role: 'img', 'aria-label': 'Das Schloss mit seinem Garten' },
    s('path', { d: 'M0 128 C120 118 200 124 300 120 C400 124 480 118 600 128 V150 H0 Z', fill: '#e8dcbf' }),
    s('g', strich,
      s('path', { d: 'M230 120 V62 H250 V50 H262 V62 H338 V50 H350 V62 H370 V120' }),
      s('path', { d: 'M230 62 V40 H244 V32 H250 V40 H256 V62 M344 62 V40 H350 V32 H356 V40 H370 V62' }),
      s('path', { d: 'M282 62 V30 L300 12 L318 30 V62' }),
      s('path', { d: 'M290 120 V96 A10 10 0 0 1 310 96 V120' }),
      s('path', { d: 'M246 80 H254 V90 H246 Z M346 80 H354 V90 H346 Z M296 40 H304 V50 H296 Z' }),
      s('path', { d: 'M300 12 V2 L312 6 L300 10' })),
    s('g', { fill: '#7f9466', opacity: 0.55 },
      s('ellipse', { cx: 170, cy: 122, rx: 60, ry: 9 }), s('ellipse', { cx: 430, cy: 122, rx: 60, ry: 9 }),
      s('ellipse', { cx: 70, cy: 128, rx: 50, ry: 7 }), s('ellipse', { cx: 530, cy: 128, rx: 50, ry: 7 })),
    s('path', { d: 'M300 122 C300 134 270 140 230 150 M300 122 C300 134 330 140 370 150', fill: 'none', stroke: '#9a6a1f', 'stroke-width': 2, 'stroke-dasharray': '6 5' }));
}

// ---------- Bilder in Aufgaben ----------
const gliedere = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));

// Zahlenstrahl. strahl: { von, bis, schritt, beschriftung, start?, spruenge?: [{ von, nach, text }], pfeil? }
// Mit beiWahl lässt sich ein Teilstrich antippen; gewaehlt ist der gerade markierte Wert.
// startwort: false zeichnet nur den Punkt, ohne das Wort „Start“ (Bilder, in denen nichts gesprungen wird).
export function zahlenstrahl(strahl, { gewaehlt = null, beiWahl = null, startwort = true } = {}) {
  const { von, bis, schritt, beschriftung } = strahl;
  const B = 720, links = 34, rechts = 44, y = 78;
  const x = (w) => links + ((w - von) / (bis - von)) * (B - links - rechts);
  const svg = s('svg', { class: 'zahlenstrahl', viewBox: `0 0 ${B} 138`, role: beiWahl ? 'group' : 'img', 'aria-label': `Zahlenstrahl von ${von} bis ${bis}` },
    s('line', { x1: links - 14, y1: y, x2: B - 14, y2: y, class: 'achse' }),
    s('path', { d: `M${B - 16} ${y - 7} L${B - 2} ${y} L${B - 16} ${y + 7} Z`, class: 'spitze' }));
  // Ausschnitt (Kapitel 2): Der Strahl beginnt nicht bei 0. Zwei schräge Striche zeigen die Unterbrechung.
  if (strahl.ausschnitt) svg.append(s('path', { d: `M${links - 17} ${y + 8} l6 -16 M${links - 11} ${y + 8} l6 -16`, class: 'unterbrechung' }));
  const lang = String(gliedere(bis)).length > 7;
  const breite = x(von + schritt) - x(von);
  for (let w = von; w <= bis; w += schritt) {
    const gross = (w - von) % beschriftung === 0;
    const g = s('g', { class: `strich${gross ? ' gross' : ''}${w === gewaehlt ? ' gewaehlt' : ''}`, 'data-wert': w },
      s('line', { x1: x(w), y1: y - (gross ? 12 : 7), x2: x(w), y2: y + (gross ? 12 : 7) }),
      gross && s('text', { x: x(w), y: y + 32, 'text-anchor': 'middle', class: lang ? 'lang' : null }, gliedere(w)),
      w === gewaehlt && s('circle', { cx: x(w), cy: y, r: 9, class: 'marke' }));
    if (beiWahl) {
      const waehle = () => beiWahl(w);
      g.append(s('rect', { x: x(w) - breite / 2, y: y - 30, width: breite, height: 70, class: 'treffer' }));
      g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', `Teilstrich ${w === gewaehlt ? '(gewählt)' : ''} ${strahl.verdeckt ? '' : w}`.trim());
      g.addEventListener('click', waehle);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); waehle(); } });
    }
    svg.append(g);
  }
  if (strahl.start != null) {
    svg.append(s('circle', { cx: x(strahl.start), cy: y, r: 7, class: 'start' }));
    if (startwort) svg.append(s('text', { x: x(strahl.start), y: y + 52, 'text-anchor': 'middle', class: 'startwort' }, 'Start'));
  }
  // Punkte (Kapitel 2): Zahlen, die am Strahl markiert und beschriftet sind. Sie müssen nicht auf einem Teilstrich liegen.
  [...(strahl.punkte ?? [])].sort((p, q) => p - q).forEach((p, i) => {
    const hoch = y - 26 - (i % 2) * 20;
    svg.append(s('line', { x1: x(p), y1: y - 6, x2: x(p), y2: hoch + 5, class: 'punktlinie' }), s('circle', { cx: x(p), cy: y, r: 6, class: 'punkt' }),
      s('text', { x: x(p), y: hoch, 'text-anchor': 'middle', class: 'punktzahl' }, gliedere(p)));
  });
  for (const sp of strahl.spruenge ?? []) {
    const a = x(sp.von), b = x(sp.nach), hoch = Math.min(46, 16 + Math.abs(b - a) / 6);
    svg.append(s('path', { d: `M${a} ${y - 12} Q${(a + b) / 2} ${y - 12 - hoch * 1.6} ${b} ${y - 12}`, class: 'sprung' }),
      s('path', { d: `M${b} ${y - 12} l${b > a ? -9 : 9} -3 l${b > a ? 3 : -3} -8 Z`, class: 'sprungspitze' }),
      s('text', { x: (a + b) / 2, y: y - 18 - hoch * 0.8, 'text-anchor': 'middle', class: 'sprungtext' }, sp.text));
  }
  if (strahl.pfeil != null) {
    svg.append(s('text', { x: x(strahl.pfeil), y: y + 54, 'text-anchor': 'middle', class: 'frage' }, '?'),
      s('path', { d: `M${x(strahl.pfeil)} ${y + 38} l-6 -12 h12 Z`, class: 'fragepfeil' }));
  }
  return svg;
}

// Säulendiagramm. d: { titel, einheit, max, schritt, werteZeigen, saeulen: [{ name, wert }] }
export function saeulendiagramm(d) {
  const B = 560, H = 320, links = 62, unten = 48, oben = 44, rechts = 12;
  const hoehe = H - oben - unten, platz = (B - links - rechts) / d.saeulen.length, breit = Math.min(64, platz * 0.6);
  const y = (w) => oben + hoehe - (w / d.max) * hoehe;
  const svg = s('svg', { class: 'diagramm', viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': `Säulendiagramm: ${d.titel}` },
    s('text', { x: 0, y: 16, class: 'titel' }, d.titel),
    s('text', { x: links - 8, y: oben - 12, 'text-anchor': 'end', class: 'einheit' }, d.einheit));
  for (let w = 0; w <= d.max; w += d.schritt) {
    svg.append(s('line', { x1: links, y1: y(w), x2: B - rechts, y2: y(w), class: w === 0 ? 'grund' : 'gitter' }),
      s('text', { x: links - 8, y: y(w) + 5, 'text-anchor': 'end', class: 'achsenzahl' }, gliedere(w)));
    // feine Hilfslinie auf halber Höhe, damit sich Zwischenwerte ablesen lassen
    if (d.hilfslinien && w + d.schritt / 2 <= d.max) svg.append(s('line', { x1: links, y1: y(w + d.schritt / 2), x2: B - rechts, y2: y(w + d.schritt / 2), class: 'gitter fein' }));
  }
  d.saeulen.forEach((sa, i) => {
    const x = links + platz * i + (platz - breit) / 2, t = y(sa.wert), r = Math.min(4, (y(0) - t) / 2);
    svg.append(s('path', { d: `M${x} ${y(0)} V${t + r} Q${x} ${t} ${x + r} ${t} H${x + breit - r} Q${x + breit} ${t} ${x + breit} ${t + r} V${y(0)} Z`, class: 'saeule' }),
      s('text', { x: x + breit / 2, y: y(0) + 20, 'text-anchor': 'middle', class: 'name' }, sa.name),
      d.werteZeigen && s('text', { x: x + breit / 2, y: t - 7, 'text-anchor': 'middle', class: 'wert' }, gliedere(sa.wert)));
  });
  return svg;
}
