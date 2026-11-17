// Gezeichnete Bausteine: Lok, Münze, Stern, Metrokarte.
import { s } from './dom.js';
import { NIVEAUS, WERKSTATT } from './logik.js';

export const LINIENFARBE = { F: '#e69f00', G: '#009e73', M: '#0072b2', E: '#cc79a7' };

export function muenze(groesse = 18) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true' },
    s('circle', { cx: 10, cy: 10, r: 9, fill: '#e8b923', stroke: '#a67c00', 'stroke-width': 1.5 }),
    s('circle', { cx: 10, cy: 10, r: 5.5, fill: 'none', stroke: '#a67c00', 'stroke-width': 1 }));
}
const STERNPFAD = 'M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.500 7.700l5.900-.8z';
export function stern(groesse = 18, voll = true) {
  return s('svg', { viewBox: '0 0 20 20', width: groesse, height: groesse, 'aria-hidden': 'true' },
    s('path', { d: STERNPFAD, fill: voll ? '#f5c518' : 'none', stroke: voll ? '#a67c00' : '#9aa3b5', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }));
}

export function lokBild(lok, breite = 120) {
  const farbe = WERKSTATT.find((w) => w.id === lok.farbe)?.wert ?? '#d9413a';
  const hat = (id) => lok.extras.includes(id);
  return s('svg', { viewBox: '0 0 120 80', width: breite, height: (breite * 80) / 120, role: 'img', 'aria-label': 'Deine Lok' },
    hat('dampf') && s('g', { fill: '#e9edf5', stroke: '#b9c2d6', 'stroke-width': 1 },
      s('circle', { cx: 84, cy: 12, r: 7 }), s('circle', { cx: 73, cy: 7, r: 5 }), s('circle', { cx: 94, cy: 6, r: 4 })),
    hat('fahne') && s('g', {}, s('line', { x1: 14, y1: 6, x2: 14, y2: 26, stroke: '#3a4256', 'stroke-width': 2 }),
      s('path', { d: 'M15 7h14l-4 4.5 4 4.5H15z', fill: '#f5c518', stroke: '#a67c00' })),
    s('rect', { x: 80, y: 20, width: 9, height: 14, rx: 1.5, fill: '#3a4256' }),
    s('rect', { x: 10, y: 24, width: 38, height: 34, rx: 4, fill: farbe, stroke: '#1d2b4f', 'stroke-width': 2 }),
    s('rect', { x: 17, y: 30, width: 18, height: 13, rx: 2, fill: '#dff1ff', stroke: '#1d2b4f', 'stroke-width': 1.5 }),
    s('rect', { x: 44, y: 34, width: 60, height: 24, rx: 10, fill: farbe, stroke: '#1d2b4f', 'stroke-width': 2 }),
    hat('streifen') && s('rect', { x: 48, y: 43, width: 52, height: 5, rx: 2.5, fill: '#fff', opacity: 0.9 }),
    hat('krone') && s('path', { d: 'M17 24l2-11 6 6 4-9 4 9 6-6 2 11z', fill: '#f5c518', stroke: '#a67c00', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }),
    hat('laterne') && s('circle', { cx: 105, cy: 40, r: 5, fill: '#ffe66b', stroke: '#a67c00', 'stroke-width': 1.5 }),
    s('path', { d: 'M104 58l10 8H98z', fill: '#3a4256' }),
    [26, 58, 84].map((x) => s('g', {}, s('circle', { cx: x, cy: 62, r: 10, fill: '#3a4256' }), s('circle', { cx: x, cy: 62, r: 4, fill: '#c9d1e3' }))),
    s('rect', { x: 22, y: 60, width: 66, height: 4, rx: 2, fill: '#8d97ad' }));
}

// Metrokarte eines Kapitels: vier parallele Linien, Unterkapitel als Stationen.
// stationen: [{ id, titel, extra, status }]; status: leer | offen | begonnen | erreicht
export function metrokarte({ stationen, niveau, zielniveau, standort, gewaehlt, lok, beiStation, beiLinie }) {
  const ABSTAND = 150, LINKS = 110, OBEN = 64, LINIE = 26, STUFE = 52;
  const breite = LINKS + (stationen.length - 1) * ABSTAND + 150;
  const hoehe = OBEN + 3 * LINIE + (stationen.length > 3 ? STUFE : 0) + 130;
  const x = (j) => LINKS + j * ABSTAND;
  const versatz = (j) => (Math.floor(j / 3) % 2) * STUFE; // alle drei Stationen ein Knick, wie auf einem Netzplan
  const y = (j, i) => OBEN + versatz(j) + i * LINIE;
  const haupt = stationen.filter((st) => !st.extra).length;

  const linie = (i) => {
    let d = `M${x(0) - 46} ${y(0, i)}`;
    for (let j = 0; j < haupt; j++) {
      if (j > 0 && versatz(j) !== versatz(j - 1)) {
        const mitte = (x(j - 1) + x(j)) / 2, halb = STUFE / 2;
        d += ` L${mitte - halb} ${y(j - 1, i)} L${mitte + halb} ${y(j, i)}`;
      }
      d += ` L${x(j)} ${y(j, i)}`;
    }
    return d + ` L${x(haupt - 1) + 30} ${y(haupt - 1, i)}`;
  };

  const svg = s('svg', { viewBox: `0 0 ${breite} ${hoehe}`, width: breite, height: hoehe, class: 'metro', role: 'group', 'aria-label': 'Metrokarte' });
  NIVEAUS.forEach((n, i) => {
    svg.append(s('path', { d: linie(i), fill: 'none', stroke: LINIENFARBE[n], 'stroke-width': n === niveau ? 9 : 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: n === niveau ? 1 : 0.55 }));
    const knopf = s('g', { class: 'linienknopf', tabindex: 0, role: 'button', 'aria-label': `Auf Linie ${n} umsteigen`, 'aria-pressed': String(n === niveau),
      onclick: () => beiLinie(n), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiLinie(n); } } },
      s('circle', { cx: x(0) - 62, cy: y(0, i), r: 12, fill: LINIENFARBE[n], stroke: n === niveau ? '#1d2b4f' : 'none', 'stroke-width': 2.5 }),
      s('text', { x: x(0) - 62, y: y(0, i) + 4, 'text-anchor': 'middle', class: 'linienname' }, n));
    svg.append(knopf);
    if (n === zielniveau) svg.append(s('text', { x: x(0) - 78, y: y(0, i) + 4, 'text-anchor': 'end', class: 'zielmarke' }, 'Ziel'));
  });
  // Gestrichelte Abzweige zu den Extra-Stationen
  stationen.forEach((st, j) => {
    if (!st.extra) return;
    svg.append(s('path', { d: `M${x(j - 1) + (j === haupt ? 30 : 0)} ${y(haupt - 1, 1.5)} L${x(j)} ${y(haupt - 1, 1.5)}`, stroke: '#9aa3b5', 'stroke-width': 4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }));
  });
  stationen.forEach((st, j) => {
    const jj = st.extra ? haupt - 1 : j;
    const oben = st.extra ? y(jj, 1.5) - 10 : y(jj, 0) - 10;
    const hoch = st.extra ? 20 : 3 * LINIE + 20;
    const g = s('g', { class: `station ${st.status}${st.id === gewaehlt ? ' gewaehlt' : ''}`, tabindex: 0, role: 'button', 'aria-label': `Station ${st.titel}`,
      onclick: () => beiStation(st.id), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiStation(st.id); } } },
      s('rect', { x: x(j) - 10, y: oben, width: 20, height: hoch, rx: 10, class: 'kapsel' }),
      st.status === 'erreicht' && s('g', { transform: `translate(${x(j) - 10} ${oben - 26})` }, s('path', { d: STERNPFAD, fill: '#f5c518', stroke: '#a67c00', 'stroke-width': 1.2 })),
      s('text', { x: x(j) + 4, y: oben + hoch + 16, transform: `rotate(38 ${x(j) + 4} ${oben + hoch + 16})`, class: 'stationsname' }, st.titel));
    svg.append(g);
  });
  // Die eigene Lok steht an der nächsten offenen Station auf der eigenen Linie.
  const ort = Math.max(0, stationen.findIndex((st) => st.id === standort));
  const zeile = NIVEAUS.indexOf(niveau);
  const zug = lokBild(lok, 56);
  zug.setAttribute('x', x(ort) - 68); zug.setAttribute('y', y(ort, zeile) - 34);
  zug.setAttribute('class', 'zug');
  svg.append(zug);
  return svg;
}
