// Klasse 7, Kapitel 1 „Rationale Zahlen“ (ADR 0043): das Thermometer.
// Grilling mit Nils, 2026-11-24: Auf F hat jede Aufgabe ein Bild. Das Thermometer steht senkrecht, die Null ist hervorgehoben,
// unter null ist die Skala blau hinterlegt. Bis zu drei Thermometer stehen nebeneinander (morgens, mittags, abends).
// b: { von, bis, schritt (ein Teilstrich), beschriftung (jeder wievielte Wert trägt eine Zahl), saeulen: [{ wert, name? }] }
import { h, s } from './dom.js';

const mz = (n) => (n < 0 ? `−${-n}` : String(n));

export function thermometerBild(b) {
  const oben = 34, unten = 52, hoch = 250, breit = 132, rohr = 18;
  // Stehen Namen unter den Thermometern, bekommt das Bild unten eine Zeile dazu. Sonst läge der Name auf der Kugel.
  const fuss = oben + hoch + unten, B = breit * b.saeulen.length, H = fuss + (b.saeulen.some((t) => t.name) ? 20 : 0);
  const y = (w) => oben + ((b.bis - w) / (b.bis - b.von)) * hoch;
  const svg = s('svg', { class: 'thermometer', viewBox: `0 0 ${B} ${H}`, role: 'img',
    'aria-label': `Thermometer von ${mz(b.von)} bis ${mz(b.bis)} Grad Celsius: ${b.saeulen.map((t) => `${t.name ? `${t.name} ` : ''}${mz(t.wert)} Grad`).join(', ')}` });
  svg.style.maxWidth = `${B * 1.5}px`;
  b.saeulen.forEach((t, i) => {
    const x = i * breit + 34, mitte = x + rohr / 2, kugel = fuss - 26;
    const g = s('g', { class: 'thermo' });
    // Röhre mit Kugel, darin die Flüssigkeit bis zum Wert.
    g.append(s('path', { d: `M${x} ${y(b.bis) - 10} a${rohr / 2} ${rohr / 2} 0 0 1 ${rohr} 0 V${kugel - 14} a17 17 0 1 1 ${-rohr} 0 Z`, class: 'glas' }),
      s('circle', { cx: mitte, cy: kugel, r: 12, class: 'saft' }),
      s('rect', { x: mitte - 4.5, y: y(t.wert), width: 9, height: kugel - y(t.wert), class: 'saft' }),
      s('line', { x1: x - 2, y1: y(t.wert), x2: x + rohr + 2, y2: y(t.wert), class: 'stand' }));
    for (let w = b.von; w <= b.bis; w += b.schritt) {
      const gross = w % b.beschriftung === 0;
      g.append(s('line', { x1: x + rohr + 4, y1: y(w), x2: x + rohr + (gross ? 18 : 11), y2: y(w), class: `teil${gross ? ' gross' : ''}${w === 0 ? ' null' : ''}` }));
      if (gross) g.append(s('text', { x: x + rohr + 24, y: y(w) + 5, class: `skala${w === 0 ? ' null' : ''}` }, mz(w)));
    }
    g.append(s('text', { x: x + rohr + 24, y: 16, class: 'einheit' }, '°C'));
    if (t.name) g.append(s('text', { x: mitte + 18, y: H - 4, 'text-anchor': 'middle', class: 'name' }, t.name));
    svg.append(g);
  });
  return h('figure', { class: 'datenbild thermofigur' }, svg);
}

export const RATIONALBILDER = { thermometer: thermometerBild };
