// Prüfung für Merkzettel und Worterklärung am Wort (ADR 0056), im Browser mit dem echten Stil des Schüler-Dashboards.
// Merkzettel: Jeder Merkzettel wird in der Seitenleiste (300 Pixel) und an der Meilenstein-Tafel (PC 690 Pixel, kleines
// Notebookfenster 560 Pixel) gezeichnet. Nichts ragt über seinen Kasten hinaus, keine Zeile einer Rechnung bricht um.
// Wörter: Jede Aufgabe wird mit Text und Eingabe gezeichnet und unterstrichen. Der sichtbare Text bleibt dabei Zeichen für
// Zeichen gleich, kein Wort ist doppelt unterstrichen, und die Erklärung bleibt beim Darüberfahren in der Karte.
// Aufruf: node tools/pruefe-merkzettel.mjs
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const wurzel = new URL('../', import.meta.url);
const pools = [5, 6, 7].map((k) => JSON.parse(readFileSync(new URL(`aufgabenpool/klasse-${k}.json`, wurzel), 'utf8')));

const eingang = `
import stil from './src/schueler/stil.css';
import { h } from './src/schueler/dom.js';
import { eingabefelder, merkzettelInhalt, markiereWoerter } from './src/schueler/app.js';
import { wortVerzeichnis } from './src/gemeinsam/woerter.js';
const halter = () => document.getElementById('mathekingdom');
window.zeichneMerkzettel = (ziele, breite) => {
  if (!document.querySelector('style[data-mk]')) document.head.append(h('style', { 'data-mk': '' }, stil));
  halter().replaceChildren(h('aside', { class: 'hilfen', style: 'width:' + breite + 'px' }, ziele.map((l) => h('details', { class: 'merkzettel', open: true, 'data-lernziel': l.id }, h('summary', {}, 'Merkzettel'), merkzettelInhalt(l.merkzettel)))));
  const maengel = [];
  for (const d of document.querySelectorAll('details.merkzettel')) {
    const aussen = d.getBoundingClientRect();
    for (const el of d.querySelectorAll('.mz-regel, .mz-beispiel, .mz-rechnung, .mz-rechnung > span, .mz-zeile, .bruch')) {
      const r = el.getBoundingClientRect();
      if (r.right > aussen.right - 1 || r.left < aussen.left + 1) maengel.push(d.dataset.lernziel + ': ragt bei ' + breite + ' px über den Merkzettel hinaus (' + el.className + ')');
    }
    const kasten = d.querySelector('.mz-beispiel').getBoundingClientRect();
    for (const el of d.querySelectorAll('.mz-rechnung')) if (el.getBoundingClientRect().right > kasten.right - 4) maengel.push(d.dataset.lernziel + ': Rechnung ist bei ' + breite + ' px breiter als der Beispielkasten');
  }
  return maengel;
};
window.pruefeWoerter = (pool, breite) => {
  if (!document.querySelector('style[data-mk]')) document.head.append(h('style', { 'data-mk': '' }, stil));
  const verzeichnis = wortVerzeichnis(pool);
  const ort = new Map(pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele.map((l) => [l.id, { meilenstein: u.id, kapitel: k.id }]))));
  const maengel = [];
  let woerter = 0, mit = 0;
  for (const auf of pool.aufgaben) {
    const karte = h('div', { class: 'karte', style: 'width:' + breite + 'px;box-sizing:border-box' },
      auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
      h('form', { class: 'antwort' }, eingabefelder(auf, { eingaben: [], reihenfolge: auf.paare?.map((p) => p.rechts) ?? null }, false)),
      h('div', { class: 'kaertchen' }, Object.values(auf.hilfen ?? {}).filter((t) => typeof t === 'string').map((t) => h('div', { class: 'kaertchen-offen' }, h('p', {}, t)))));
    halter().replaceChildren(h('section', { class: 'aufgabe' }, karte));
    const vorher = karte.textContent;
    const n = markiereWoerter(karte, verzeichnis, ort.get(auf.lernziel));
    if (karte.textContent !== vorher) maengel.push(auf.id + ': Unterstreichen hat den Text verändert');
    const el = [...karte.querySelectorAll('.wort')];
    if (el.length !== n || new Set(el.map((e) => e.dataset.wort)).size !== n) maengel.push(auf.id + ': Wort doppelt unterstrichen');
    if (el.some((e) => e.querySelector('.wort') || e.closest('.bruch, svg, select'))) maengel.push(auf.id + ': Wort an verbotener Stelle unterstrichen');
    for (const e of el) {
      e.dispatchEvent(new MouseEvent('mouseenter'));
      const b = karte.querySelector('.worterklaerung')?.getBoundingClientRect(), k = karte.getBoundingClientRect();
      if (!b) maengel.push(auf.id + ': keine Erklärung zu „' + e.textContent + '“');
      else if (b.left < k.left || b.right > k.right) maengel.push(auf.id + ': Erklärung zu „' + e.textContent + '“ ragt seitlich aus der Karte');
      e.dispatchEvent(new MouseEvent('mouseleave'));
      if (karte.querySelector('.worterklaerung')) maengel.push(auf.id + ': Erklärung bleibt nach dem Wegfahren stehen');
    }
    woerter += n; if (n) mit++;
  }
  halter().replaceChildren();
  return { maengel, woerter, mit };
};`;
const ergebnis = await build({ stdin: { contents: eingang, resolveDir: new URL('.', wurzel).pathname, loader: 'js' }, bundle: true, format: 'iife', write: false,
  loader: { '.css': 'text' }, define: { MK_VERSION: JSON.stringify({ nummer: '0', datum: '', schueler: [], lehrkraft: [] }) }, logLevel: 'warning' });
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1000, height: 900 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(e.message));
await seite.setContent(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="mathekingdom" style="padding:8px"></div><script>${ergebnis.outputFiles[0].text}</script>`);
const alle = [];
let merkzettel = 0;
for (const pool of pools) {
  const ziele = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => l.merkzettel);
  merkzettel += ziele.length;
  // 300: Seitenleiste neben der Aufgabe. 650 und 520: Meilenstein-Tafel in der Karte am PC und im kleinen Notebookfenster.
  for (const breite of [300, 650, 520]) alle.push(...await seite.evaluate(([z, b]) => window.zeichneMerkzettel(z, b), [ziele, breite]));
  const w = await seite.evaluate(([p, b]) => window.pruefeWoerter(p, b), [pool, 690]);
  alle.push(...w.maengel);
  console.log(`Klasse ${pool.klassenstufe}: ${ziele.length} Merkzettel, ${w.woerter} unterstrichene Wörter in ${w.mit} von ${pool.aufgaben.length} Aufgaben (mit allen Hilfekärtchen).`);
}
await browser.close();
if (fehler.length) { console.log(fehler.join('\n')); process.exit(1); }
for (const m of new Set(alle)) console.log(m);
console.log(alle.length ? `${new Set(alle).size} Mängel.` : `Merkzettel und Worterklärungen in Ordnung: ${merkzettel} Merkzettel bei 300, 650 und 520 Pixel Breite.`);
process.exit(alle.length ? 1 : 0);
