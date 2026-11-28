// Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058): Kreisdiagramm, Streifendiagramm und die Eingabe „Streifen färben“.
// Grilling mit Nils, 2026-11-28:
// - Kreisdiagramm: farbige Ausschnitte, Beginn oben, im Uhrzeigersinn. Die Namen stehen in einer Legende rechts, nie im Kreis.
// - Streifendiagramm: ein Streifen von 10 cm oder 20 cm, darunter ein Zentimeterlineal. Die Namen stehen in einer Legende darunter.
// - Streifen färben: Über einem Streifen aus 20 Kästchen stehen Farbknöpfe mit den Namen. Geprüft wird nur die Anzahl je Farbe.
import { h, s } from './dom.js';
import { leseStreifen } from './daten.js';

export { streifenFaerbenLoesung } from './daten.js';

// Sechs gut unterscheidbare Farben (auch in Graustufen verschieden hell).
export const DATENFARBEN = ['#3b6fb5', '#e8a33d', '#4f8a4a', '#b4483c', '#8a5fa8', '#7fc4bd'];
const farbe = (i) => DATENFARBEN[i % DATENFARBEN.length];
const legendeText = (t) => `${t.name}${t.text ? `: ${t.text}` : ''}`;

// ---------- Kreisdiagramm ----------
// b: { art: 'kreisdiagramm', titel?, teile: [{ name, winkel, text? }] }. Die Winkel ergeben zusammen 360°.
// text steht in der Legende hinter dem Namen („25 %“, „90°“, „1⁄4“ oder „?“).
const punkt = (cx, cy, r, grad) => { const w = ((grad - 90) * Math.PI) / 180; return [cx + r * Math.cos(w), cy + r * Math.sin(w)]; };
export function kreisdiagrammBild(b) {
  const r = 110, cx = 130, cy = (b.titel ? 40 : 14) + r, zeile = 34, leg = 290;
  const hoehe = Math.max(cy + r + 16, (b.titel ? 40 : 14) + b.teile.length * zeile + 10), breite = 600;
  const teile = [];
  if (b.titel) teile.push(s('text', { x: breite / 2, y: 24, 'text-anchor': 'middle', class: 'titel' }, b.titel));
  let start = 0;
  b.teile.forEach((t, i) => {
    const ende = start + t.winkel;
    if (t.winkel >= 360) teile.push(s('circle', { cx, cy, r, fill: farbe(i), class: 'ausschnitt' }));
    else if (t.winkel > 0) {
      const [x1, y1] = punkt(cx, cy, r, start), [x2, y2] = punkt(cx, cy, r, ende);
      teile.push(s('path', { d: `M${cx} ${cy} L${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${t.winkel > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`, fill: farbe(i), class: 'ausschnitt' }));
    }
    start = ende;
  });
  teile.push(s('circle', { cx, cy, r, class: 'kreisrand' }));
  const oben = (b.titel ? 40 : 14) + Math.max(0, (2 * r - b.teile.length * zeile) / 2);
  b.teile.forEach((t, i) => {
    const y = oben + i * zeile;
    teile.push(s('rect', { x: leg, y: y + 6, width: 22, height: 22, rx: 3, fill: farbe(i), class: 'legendenfeld' }));
    teile.push(s('text', { x: leg + 32, y: y + 23, class: `legende${t.text === '?' ? ' mitfrage' : ''}` }, legendeText(t)));
  });
  return h('figure', { class: 'datenbild kreisdiagrammbild' },
    s('svg', { class: 'datendiagramm kreisdiagramm', viewBox: `0 0 ${breite} ${hoehe}`, role: 'img', 'aria-label': `Kreisdiagramm${b.titel ? `: ${b.titel}` : ''}. ${b.teile.map(legendeText).join('; ')}` }, teile));
}

// ---------- Streifendiagramm ----------
// b: { art: 'streifendiagramm', titel?, laenge: 10 oder 20 (cm), teile: [{ name, mm, text? }], lineal?: true }. Die Teile ergeben zusammen die Länge.
export function streifendiagrammBild(b) {
  const links = 30, plot = 520, je = plot / (b.laenge * 10), oben = b.titel ? 44 : 14, hoch = 54;
  const spalten = 2, zeile = 32, legOben = oben + hoch + (b.lineal === false ? 18 : 62), reihen = Math.ceil(b.teile.length / spalten);
  const breite = links * 2 + plot, hoehe = legOben + reihen * zeile + 6;
  const teile = [];
  if (b.titel) teile.push(s('text', { x: breite / 2, y: 26, 'text-anchor': 'middle', class: 'titel' }, b.titel));
  let x = links;
  b.teile.forEach((t, i) => {
    const w = t.mm * je;
    teile.push(s('rect', { x, y: oben, width: w, height: hoch, fill: farbe(i), class: 'abschnitt' }));
    x += w;
  });
  teile.push(s('rect', { x: links, y: oben, width: plot, height: hoch, class: 'streifenrand' }));
  if (b.lineal !== false) {
    const y0 = oben + hoch + 8;
    teile.push(s('line', { x1: links, x2: links + plot, y1: y0, y2: y0, class: 'grund' }));
    for (let mm = 0; mm <= b.laenge * 10; mm += 5) {
      const xm = links + mm * je, cm = mm % 10 === 0;
      teile.push(s('line', { x1: xm, x2: xm, y1: y0, y2: y0 + (cm ? 14 : 8), class: cm ? 'grund' : 'gitter stark' }));
      if (cm) teile.push(s('text', { x: xm, y: y0 + 32, 'text-anchor': 'middle', class: 'achsenzahl' }, String(mm / 10)));
    }
    teile.push(s('text', { x: links + plot, y: y0 + 50, 'text-anchor': 'end', class: 'einheit' }, 'cm'));
  }
  b.teile.forEach((t, i) => {
    const sx = links + (i % spalten) * (plot / spalten), sy = legOben + Math.floor(i / spalten) * zeile;
    teile.push(s('rect', { x: sx, y: sy, width: 22, height: 22, rx: 3, fill: farbe(i), class: 'legendenfeld' }));
    teile.push(s('text', { x: sx + 32, y: sy + 17, class: `legende${t.text === '?' ? ' mitfrage' : ''}` }, legendeText(t)));
  });
  return h('figure', { class: 'datenbild streifendiagrammbild' },
    s('svg', { class: 'datendiagramm streifendiagramm', viewBox: `0 0 ${breite} ${hoehe}`, role: 'img', 'aria-label': `Streifendiagramm, ${b.laenge} cm lang${b.titel ? `: ${b.titel}` : ''}. ${b.teile.map(legendeText).join('; ')}` }, teile));
}

// ---------- Streifen färben ----------
// Aufgabe: { format: 'streifenfaerben', streifen: { kaestchen: 20, laenge? }, farben: [{ name, loesung }] }.
// Eingabe im versteckten Feld „streifenfaerben“: je Kästchen die Nummer der Farbe oder „-“, durch Kommas getrennt.
export function streifenFaerbenEingabe(auf, letzte, gesperrt) {
  const n = auf.streifen.kaestchen;
  let zellen = leseStreifen(letzte, n), aktiv = 0;
  const feld = h('input', { type: 'hidden', name: 'streifenfaerben', value: zellen.map((x) => x ?? '-').join(',') });
  const knopfreihe = h('div', { class: 'farbknoepfe', role: 'radiogroup', 'aria-label': 'Farbe wählen' });
  const streifen = h('div', { class: 'faerbestreifen', role: 'group', 'aria-label': `Streifen aus ${n} Kästchen` });
  const zeichne = (fokus = null) => {
    knopfreihe.replaceChildren(...auf.farben.map((f, i) => h('button', { type: 'button', class: `farbknopf${i === aktiv ? ' aktiv' : ''}`, role: 'radio', 'aria-checked': String(i === aktiv), disabled: gesperrt, 'data-farbe': String(i),
      onclick: () => { aktiv = i; zeichne(); } }, h('span', { class: 'farbfeld', style: `background:${farbe(i)}`, 'aria-hidden': 'true' }), f.name)));
    streifen.replaceChildren(...zellen.map((z, i) => h('button', { type: 'button', class: `streifenkaestchen${z != null ? ' voll' : ''}`, 'data-nr': String(i), disabled: gesperrt, style: z != null ? `background:${farbe(z)}` : null,
      'aria-label': `Kästchen ${i + 1}: ${z != null ? auf.farben[z].name : 'weiß'}`,
      onclick: () => { zellen = zellen.map((x, k) => (k === i ? (x === aktiv ? null : aktiv) : x)); feld.value = zellen.map((x) => x ?? '-').join(','); zeichne(i); } })));
    if (fokus != null) streifen.querySelector(`[data-nr="${fokus}"]`)?.focus();
  };
  zeichne();
  const zaehler = auf.streifen.laenge ? h('p', { class: 'klein' }, `Der Streifen ist ${auf.streifen.laenge} cm lang. Ein Kästchen ist ${String(auf.streifen.laenge / n).replace('.', ',')} cm lang und steht für ${100 / n} %.`) : h('p', { class: 'klein' }, `Ein Kästchen steht für ${100 / n} %.`);
  return h('div', { class: 'mitbild streifenfaerben' }, h('div', { class: 'bildrahmen' }, knopfreihe, streifen, zaehler), feld,
    !gesperrt && h('p', { class: 'klein' }, 'Wähle oben eine Farbe und tippe Kästchen an. Noch einmal tippen macht ein Kästchen wieder weiß.'));
}
// Lösungsbild: die Farben der Reihe nach.
export function streifenFaerbenLoesungBild(auf) {
  const zellen = auf.farben.flatMap((f, i) => Array(f.loesung).fill(i));
  return h('div', { class: 'mitbild streifenfaerben' },
    h('div', { class: 'faerbestreifen' }, Array.from({ length: auf.streifen.kaestchen }, (_, i) => h('span', { class: `streifenkaestchen${zellen[i] != null ? ' voll' : ''}`, style: zellen[i] != null ? `background:${farbe(zellen[i])}` : null }))),
    h('p', { class: 'legende-zeile' }, auf.farben.map((f, i) => h('span', { class: 'legende-eintrag' }, h('span', { class: 'farbfeld', style: `background:${farbe(i)}`, 'aria-hidden': 'true' }), `${f.name}: ${f.loesung} Kästchen`))));
}

export const DATENBILDER6 = { kreisdiagramm: kreisdiagrammBild, streifendiagramm: streifendiagrammBild };
