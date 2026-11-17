// Gezeichnete Bausteine im Stil alter Kartografie: Münze, Siegel, Wappen, Regionskarte, Schlossgarten (ADR 0010).
import { s } from './dom.js';
import { NIVEAUS, ROUTE_NAMEN, WAPPEN_TEILE } from './logik.js';

// Gedämpfte Tintenfarben der Straßen. Jede Straße hat zusätzlich ein eigenes Strichmuster,
// damit man sie auch ohne Farbe auseinanderhält: Feldweg gestrichelt, Talweg durchgezogen, Königsweg doppelt, Bergpfad gepunktet.
export const ROUTE_FARBE = { F: '#9a6a1f', G: '#4b6b35', M: '#2f4f7f', E: '#7b2d43' };
const PERGAMENT = '#f6efdf';
const SEPIA = '#5b4632';

// Eine Straße als Pfad: Rückgabe sind ein oder zwei SVG-Pfade mit dem Muster der Niveaustufe.
export function routeStrich(niveau, d, { breite = 7, aktiv = true } = {}) {
  const farbe = ROUTE_FARBE[niveau];
  const basis = { d, fill: 'none', stroke: farbe, 'stroke-linejoin': 'round', opacity: aktiv ? 1 : 0.5 };
  switch (niveau) {
    case 'F': return [s('path', { ...basis, 'stroke-width': breite, 'stroke-dasharray': `${breite * 1.8} ${breite * 1.1}`, 'stroke-linecap': 'butt' })];
    case 'M': return [s('path', { ...basis, 'stroke-width': breite + 2, 'stroke-linecap': 'round' }),
      s('path', { d, fill: 'none', stroke: PERGAMENT, 'stroke-width': Math.max(2, breite / 2.6), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })];
    case 'E': return [s('path', { ...basis, 'stroke-width': breite + 1, 'stroke-dasharray': `0.1 ${breite * 1.55}`, 'stroke-linecap': 'round' })];
    default: return [s('path', { ...basis, 'stroke-width': breite - 1, 'stroke-linecap': 'round' })];
  }
}
// Kurzes Musterstück einer Straße, etwa für die Legende oder den Aufgabenkopf.
export function routeMuster(niveau, breite = 46) {
  return s('svg', { viewBox: `0 0 ${breite} 14`, width: breite, height: 14, 'aria-hidden': 'true', class: 'routemuster' },
    ...routeStrich(niveau, `M4 7 H${breite - 4}`, { breite: 5 }));
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

// Kleine Zeichen über einem Meilenstein.
const kompass = (x, y) => s('g', { transform: `translate(${x} ${y})`, class: 'zeichen-kompass' },
  s('circle', { r: 10, fill: PERGAMENT, stroke: SEPIA, 'stroke-width': 1.5 }),
  s('path', { d: 'M0 -7 L2.6 0 L0 7 L-2.6 0 Z', fill: SEPIA }),
  s('path', { d: 'M0 -7 L2.6 0 L-2.6 0 Z', fill: '#a3302a' }));
const schloss = (x, y) => s('g', { transform: `translate(${x} ${y})`, class: 'zeichen-schloss' },
  s('path', { d: 'M-4 -2 V-5 A4 4 0 0 1 4 -5 V-2', fill: 'none', stroke: '#6f665a', 'stroke-width': 1.8 }),
  s('rect', { x: -6, y: -2, width: 12, height: 9, rx: 1.5, fill: '#6f665a' }));
const wachssiegel = (x, y) => {
  const g = siegel(26, true);
  g.setAttribute('x', x - 13); g.setAttribute('y', y - 13);
  return g;
};

// Wappen: Schild in der gewählten Farbe, darauf die angebrachten Zeichen.
const SCHILD = 'M10 8 H90 V48 C90 78 68 96 50 104 C32 96 10 78 10 48 Z';
export function wappenBild(wappen, breite = 60) {
  const farbe = WAPPEN_TEILE.find((w) => w.id === wappen.farbe)?.wert ?? '#9e2f28';
  const hat = (id) => wappen.zeichen.includes(id);
  const hell = '#f3e7c9', linie = { fill: 'none', stroke: hell, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  return s('svg', { viewBox: '0 -12 100 124', width: breite, height: (breite * 124) / 100, role: 'img', 'aria-label': 'Dein Wappen', class: 'wappen' },
    s('path', { d: SCHILD, fill: farbe, stroke: '#2f2820', 'stroke-width': 3, 'stroke-linejoin': 'round' }),
    hat('balken') && s('path', { d: 'M10 40 H90 V56 H10 Z', fill: hell, opacity: 0.9 }),
    hat('zirkel') && s('g', linie, s('path', { d: 'M50 26 L36 72 M50 26 L64 72' }), s('circle', { cx: 50, cy: 24, r: 4, fill: hell })),
    hat('winkel') && s('path', { ...linie, d: 'M30 30 V76 H72', 'stroke-width': 5 }),
    hat('eichenlaub') && s('g', { fill: '#c9b77a', stroke: '#5d5223', 'stroke-width': 1.2 },
      s('path', { d: 'M50 92 C38 88 30 80 28 70 C38 72 46 80 50 92 Z' }), s('path', { d: 'M50 92 C62 88 70 80 72 70 C62 72 54 80 50 92 Z' })),
    hat('krone') && s('path', { d: 'M30 8 L33 -2 L41 4 L50 -6 L59 4 L67 -2 L70 8 Z', transform: 'translate(0 6)', fill: '#d6ae4a', stroke: '#6b5115', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }));
}

// ---------- Regionskarte (region_map) ----------
// Vier parallele Straßen, Unterkapitel als Meilensteine. Meilensteine gehen nicht nacheinander auf;
// die Nummern zeigen nur die empfohlene Reihenfolge.
// milestones: [{ id, titel, extra, status }]; status: leer | gesperrt | offen | begonnen | gemeistert
export function regionMap({ milestones, niveau, zielniveau, standort, gewaehlt, wappen, beiMeilenstein, beiStrasse }) {
  const ABSTAND = 150, LINKS = 200, OBEN = 74, LINIE = 28, STUFE = 52;
  const breite = LINKS + (milestones.length - 1) * ABSTAND + 150;
  const hoehe = OBEN + 3 * LINIE + (milestones.length > 3 ? STUFE : 0) + 140;
  const x = (j) => LINKS + j * ABSTAND;
  const versatz = (j) => (Math.floor(j / 3) % 2) * STUFE; // alle drei Meilensteine biegt der Weg ab
  const y = (j, i) => OBEN + versatz(j) + i * LINIE;
  const haupt = milestones.filter((m) => !m.extra).length;

  const weg = (i) => {
    let d = `M${x(0) - 46} ${y(0, i)}`;
    for (let j = 0; j < haupt; j++) {
      if (j > 0 && versatz(j) !== versatz(j - 1)) {
        const mitte = (x(j - 1) + x(j)) / 2, halb = STUFE / 2;
        d += ` C${mitte} ${y(j - 1, i)} ${mitte} ${y(j, i)} ${mitte + halb} ${y(j, i)}`;
      }
      d += ` L${x(j)} ${y(j, i)}`;
    }
    return d + ` L${x(haupt - 1) + 30} ${y(haupt - 1, i)}`;
  };

  const svg = s('svg', { viewBox: `0 0 ${breite} ${hoehe}`, width: breite, height: hoehe, class: 'regionskarte', role: 'group', 'aria-label': 'Regionskarte' },
    s('rect', { x: 3, y: 3, width: breite - 6, height: hoehe - 6, rx: 6, class: 'kartenrand' }),
    windrose(breite - 46, hoehe - 46));
  NIVEAUS.forEach((n, i) => {
    svg.append(...routeStrich(n, weg(i), { breite: n === niveau ? 9 : 6, aktiv: n === niveau }));
    const knopf = s('g', { class: `strassenknopf${n === niveau ? ' aktiv' : ''}`, tabindex: 0, role: 'button', 'aria-label': `Auf den ${ROUTE_NAMEN[n]} (${n}) wechseln`, 'aria-pressed': String(n === niveau),
      onclick: () => beiStrasse(n), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiStrasse(n); } } },
      s('rect', { x: 8, y: y(0, i) - 12, width: x(0) - 62, height: 24, rx: 4, class: 'strassenfeld' }),
      s('text', { x: 16, y: y(0, i) + 5, class: 'strassenname' }, `${n} ${ROUTE_NAMEN[n]}`),
      n === zielniveau && s('text', { x: x(0) - 68, y: y(0, i) + 4, 'text-anchor': 'end', class: 'zielmarke' }, 'Ziel'));
    svg.append(knopf);
  });
  // Abstecher: gestrichelt abseits der Straßen
  milestones.forEach((m, j) => {
    if (!m.extra) return;
    svg.append(s('path', { d: `M${x(j - 1) + (j === haupt ? 30 : 0)} ${y(haupt - 1, 1.5)} L${x(j)} ${y(haupt - 1, 1.5)}`, class: 'abstecher' }));
  });
  milestones.forEach((m, j) => {
    const jj = m.extra ? haupt - 1 : j;
    const oben = m.extra ? y(jj, 1.5) - 12 : y(jj, 0) - 12;
    const hoch = m.extra ? 24 : 3 * LINIE + 24;
    const hier = m.id === standort && ['offen', 'begonnen'].includes(m.status);
    const nummer = m.extra ? null : j + 1;
    const g = s('g', { class: `meilenstein ${m.status}${m.id === gewaehlt ? ' gewaehlt' : ''}${hier ? ' standort' : ''}`, tabindex: 0, role: 'button',
      'aria-label': `Meilenstein ${m.titel}${m.status === 'gemeistert' ? ', gemeistert' : m.status === 'gesperrt' ? ', gesperrt' : ''}`,
      onclick: () => beiMeilenstein(m.id), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiMeilenstein(m.id); } } },
      hier && s('rect', { x: x(j) - 18, y: oben - 6, width: 36, height: hoch + 12, rx: 8, class: 'puls' }),
      s('rect', { x: x(j) - 11, y: oben, width: 22, height: hoch, rx: 5, class: 'stein' }),
      nummer && s('text', { x: x(j), y: oben + hoch - 6, 'text-anchor': 'middle', class: 'steinnummer' }, nummer),
      m.status === 'gemeistert' && wachssiegel(x(j), oben - 18),
      m.status === 'begonnen' && kompass(x(j), oben - 18),
      m.status === 'gesperrt' && schloss(x(j), oben - 16),
      hier && s('text', { x: x(j) + 16, y: oben - 26, class: 'hiermarke' }, 'Hier weiter'),
      s('text', { x: x(j) + 4, y: oben + hoch + 16, transform: `rotate(34 ${x(j) + 4} ${oben + hoch + 16})`, class: 'meilensteinname' }, m.titel));
    svg.append(g);
  });
  // Das eigene Wappen steht am empfohlenen Meilenstein auf der eigenen Straße.
  const ort = Math.max(0, milestones.findIndex((m) => m.id === standort));
  const zeile = NIVEAUS.indexOf(niveau);
  const bild = wappenBild(wappen, 26);
  bild.setAttribute('x', x(ort) - 46); bild.setAttribute('y', y(ort, zeile) - 15);
  bild.setAttribute('class', 'wappen standwappen');
  svg.append(bild);
  return svg;
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
export function zahlenstrahl(strahl, { gewaehlt = null, beiWahl = null } = {}) {
  const { von, bis, schritt, beschriftung } = strahl;
  const B = 720, links = 34, rechts = 44, y = 78;
  const x = (w) => links + ((w - von) / (bis - von)) * (B - links - rechts);
  const svg = s('svg', { class: 'zahlenstrahl', viewBox: `0 0 ${B} 138`, role: beiWahl ? 'group' : 'img', 'aria-label': `Zahlenstrahl von ${von} bis ${bis}` },
    s('line', { x1: links - 14, y1: y, x2: B - 14, y2: y, class: 'achse' }),
    s('path', { d: `M${B - 16} ${y - 7} L${B - 2} ${y} L${B - 16} ${y + 7} Z`, class: 'spitze' }));
  const breite = x(von + schritt) - x(von);
  for (let w = von; w <= bis; w += schritt) {
    const gross = (w - von) % beschriftung === 0;
    const g = s('g', { class: `strich${gross ? ' gross' : ''}${w === gewaehlt ? ' gewaehlt' : ''}`, 'data-wert': w },
      s('line', { x1: x(w), y1: y - (gross ? 12 : 7), x2: x(w), y2: y + (gross ? 12 : 7) }),
      gross && s('text', { x: x(w), y: y + 32, 'text-anchor': 'middle' }, gliedere(w)),
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
    svg.append(s('circle', { cx: x(strahl.start), cy: y, r: 7, class: 'start' }),
      s('text', { x: x(strahl.start), y: y + 52, 'text-anchor': 'middle', class: 'startwort' }, 'Start'));
  }
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
