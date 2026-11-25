// Bilderbogen: zeigt jede Aufgabe eines Kapitels so, wie das Schüler-Dashboard sie zeichnet, zur Durchsicht vor dem Merge.
// Es werden dieselben Bausteine benutzt wie im Dashboard (Aufgabentext, Bild, Antwortkärtchen, Tabelle, Eingabe, Stil).
// Aufruf: node tools/bilderbogen.mjs [Kapitelanfang, z. B. 5.1.] [Ausgabe.pdf] [Ordner für Einzelbilder]
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const [anfang = '5.1.', ausgabe = 'build/bilderbogen.pdf', einzeln] = process.argv.slice(2);
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL(`aufgabenpool/klasse-${parseInt(anfang, 10)}.json`, wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith(anfang));
const lernziele = new Map(pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l.text]));

const eingang = `
import stil from './src/schueler/stil.css';
import { h } from './src/schueler/dom.js';
import { aufgabenBild } from './src/schueler/aufgabenbilder.js';
import { urlisteBild, datenTabelle } from './src/schueler/datenbilder.js';
import { eingabefelder, loesungsbild, heftband } from './src/schueler/app.js';
window.bogen = (aufgaben, lernziele) => {
  document.head.append(h('style', {}, stil));
  const halter = document.getElementById('mathekingdom');
  halter.replaceChildren();
  let gruppe = null;
  for (const auf of aufgaben) {
    const g = auf.lernziel + ' ' + auf.niveau;
    if (g !== gruppe) { gruppe = g; halter.append(h('h2', { class: 'bogen-kopf' }, auf.lernziel + ' · Niveau ' + auf.niveau + ': ' + lernziele[auf.lernziel])); }
    const loesung = loesungsbild(auf);
    halter.append(h('section', { class: 'aufgabe', 'data-aufgabe': auf.id }, h('div', { class: 'karte' },
      h('p', { class: 'kennung-oben' }, auf.id + ' · AFB ' + 'I'.repeat(auf.afb) + ' · ' + auf.format),
      auf.heftaufgabe && heftband(auf),
      auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
      auf.bild && h('div', { class: 'bildrahmen zumtext' }, aufgabenBild(auf.bild)),
      auf.urliste && urlisteBild(auf.urliste, false),
      auf.daten && h('div', { class: 'bildrahmen zumtext' }, datenTabelle(auf.daten)),
      h('form', { class: 'antwort' }, eingabefelder(auf, { eingaben: [], reihenfolge: auf.paare?.map((p) => p.rechts) ?? null }, false)),
      loesung && h('div', { class: 'bogen-loesung' }, h('b', {}, 'Lösung zur Durchsicht:'), loesung))));
  }
};`;
const ergebnis = await build({ stdin: { contents: eingang, resolveDir: new URL('.', wurzel).pathname, loader: 'js' }, bundle: true, format: 'iife', write: false,
  loader: { '.css': 'text' }, define: { MK_VERSION: JSON.stringify({ nummer: '0', datum: '', schueler: [], lehrkraft: [] }) }, logLevel: 'warning' });
const skript = ergebnis.outputFiles[0].text;
const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Bilderbogen</title>
<style>body{margin:0;background:#efe6d2} #mathekingdom{padding:16px 24px} .bogen-kopf{font:700 18px system-ui;margin:28px 0 10px;color:#3a3029;break-after:avoid}
#mathekingdom section.aufgabe{break-inside:avoid;margin:0 0 14px} .mk-version{display:none} .kennung-oben{font:12px monospace;color:#6b5f50;margin:0 0 6px} .bogen-loesung{margin-top:10px;border-top:1px dashed #c9b98f;padding-top:6px;font-size:14px}
</style></head><body><div id="mathekingdom"></div><script>${skript}</script></body></html>`;
mkdirSync(new URL('build/', wurzel), { recursive: true });
writeFileSync(new URL('build/bilderbogen.html', wurzel), html);

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(e.message));
await seite.goto(new URL('build/bilderbogen.html', wurzel).href);
await seite.evaluate(([a, l]) => window.bogen(a, l), [aufgaben, Object.fromEntries(lernziele)]);
if (fehler.length) throw new Error(fehler.join('\n'));
if (einzeln) {
  mkdirSync(einzeln, { recursive: true });
  for (const a of aufgaben) await seite.locator(`section[data-aufgabe="${a.id}"]`).screenshot({ path: `${einzeln}/${a.id}.png` });
}
await seite.pdf({ path: ausgabe, format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '8mm', right: '8mm' } });
await browser.close();
console.log(`Bilderbogen mit ${aufgaben.length} Aufgaben: ${ausgabe}`);
