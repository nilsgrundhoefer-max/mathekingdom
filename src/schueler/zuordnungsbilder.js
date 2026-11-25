// Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050): Wertetabelle und Dreisatztabelle als Bild und als Eingabe.
// Grilling mit Nils, 2026-11-25:
// - Eine Wertetabelle liegt waagrecht und hat zwei Zeilen: oben die erste Größe, darunter die zugeordnete.
// - Die Dreisatztabelle hat drei Zeilen (gegeben, für 1, gesucht). Am Rand stehen die Rechenpfeile: Womit wird geteilt, womit malgenommen?
//   Auf F sind die Rechenpfeile vorgegeben, auf G trägt das Kind die Zahl am Pfeil selbst ein.
// Das Schaubild selbst zeichnet das Karogitter (geobilder.js, Feld `skala`).
import { h } from './dom.js';

const zelle = (c, feld) => (typeof c === 'object' && c !== null ? (feld ? feld(c.luecke, c.einheit ?? null) : h('span', { class: 'frage' }, c.einheit ? `? ${c.einheit}` : '?')) : c);

// t: { zeilen: [[name, wert, wert, …], [name, wert, …]] }. Ein Wert ist ein Text oder { luecke, einheit? }.
export function werteTabelle(t, feld = null) {
  return h('table', { class: 'aufgabentabelle wertetabelle' }, t.n && h('caption', {}, t.n),
    h('tbody', {}, t.zeilen.map((z) => h('tr', {}, z.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', { class: c === '?' ? 'frage' : null }, zelle(c, feld))))))));
}
// b: { art: 'wertetabellen', tabellen: [{ n?, zeilen }] }
export const werteTabellenBild = (b) => h('figure', { class: `datenbild wertetabellen${b.tabellen.length > 1 ? ' mehrere' : ''}` }, b.tabellen.map((t) => werteTabelle(t)));

// Rechenpfeil: Text („: 4“) oder { zeichen, luecke } (das Kind trägt die Zahl ein) oder null (kein Pfeil).
function pfeil(p, seite, feld) {
  if (p == null) return null;
  const text = typeof p === 'object' ? h('span', { class: 'pfeiltext' }, `${p.zeichen} `, feld ? feld(p.luecke, null, 'klein') : '?') : h('span', { class: 'pfeiltext' }, p);
  return h('span', { class: `rechenpfeil ${seite}` }, seite === 'links' ? [text, h('span', { class: 'bogen', 'aria-hidden': 'true' })] : [h('span', { class: 'bogen', 'aria-hidden': 'true' }), text]);
}
// t: { kopf: [links, rechts], zeilen: drei Zeilen mit je zwei Werten, pfeile: [{ links, rechts }, { links, rechts }] }
export function dreisatzTabelle(t, feld = null) {
  const teile = [h('span', { class: 'ds-kopf', style: 'grid-column:2;grid-row:1' }, t.kopf[0]), h('span', { class: 'ds-kopf', style: 'grid-column:3;grid-row:1' }, t.kopf[1])];
  t.zeilen.forEach((z, k) => z.forEach((c, i) => teile.push(h('span', { class: `ds-wert${typeof c === 'object' ? ' offen' : ''}`, style: `grid-column:${i + 2};grid-row:${2 + 2 * k} / span 2` }, zelle(c, feld)))));
  (t.pfeile ?? []).forEach((p, j) => { for (const seite of ['links', 'rechts']) { const e = pfeil(p?.[seite], seite, feld); if (e) { e.style.gridColumn = seite === 'links' ? '1' : '4'; e.style.gridRow = `${3 + 2 * j} / span 2`; teile.push(e); } } });
  return h('div', { class: 'dreisatz', role: 'group', 'aria-label': `Dreisatztabelle: ${t.kopf.join(' und ')}` }, teile);
}
// b: { art: 'dreisatz', kopf, zeilen, pfeile }
export const dreisatzBild = (b) => h('figure', { class: 'datenbild dreisatzbild' }, dreisatzTabelle(b));

export const ZUORDNUNGSBILDER = { wertetabellen: werteTabellenBild, dreisatz: dreisatzBild };
