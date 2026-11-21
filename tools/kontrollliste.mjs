// Übernimmt eine Kontrollliste aus dem Aufgabentester des Admin-Dashboards ins Repository (0.37).
// Aufruf: node tools/kontrollliste.mjs <Mathekingdom_Kontrollliste_JJJJ-MM-TT.json>
//
// Der Export enthält immer alle Häkchen, auch die schon übernommenen. Darum ersetzt er die Liste im Repository:
// Ein Häkchen, das der Administrator zurückgenommen hat, fehlt im Export und verschwindet auch hier.
// Übernommen wird nur, was zum heutigen Aufgabenpool passt (gleiche Kennung, gleicher Fingerabdruck).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fingerabdruck, liesExport } from '../src/gemeinsam/kontrolle.js';

const datei = process.argv[2];
if (!datei) { console.error('Aufruf: node tools/kontrollliste.mjs <Kontrollliste.json>'); process.exit(1); }
const neu = liesExport(readFileSync(datei, 'utf8'));
const wurzel = new URL('../aufgabenpool/', import.meta.url);
const aufgaben = new Map();
for (const name of readdirSync(wurzel)) {
  if (/^klasse-\d+\.json$/.test(name)) for (const a of JSON.parse(readFileSync(new URL(name, wurzel), 'utf8')).aufgaben) aufgaben.set(a.id, a);
}
const ziel = new URL('kontrolliert.json', wurzel);
const alt = JSON.parse(readFileSync(ziel, 'utf8'));
const liste = {}, veraltet = [], unbekannt = [];
for (const [kennung, fp] of Object.entries(neu).sort(([a], [b]) => a.localeCompare(b))) {
  const a = aufgaben.get(kennung);
  if (!a) unbekannt.push(kennung);
  else if (fingerabdruck(a) !== fp) veraltet.push(kennung);
  else liste[kennung] = fp;
}
const vorher = Object.keys(alt.aufgaben ?? {}).length;
writeFileSync(ziel, `${JSON.stringify({ ...alt, aufgaben: liste }, null, 1)}\n`);
console.log(`Kontrolliert: ${Object.keys(liste).length} von ${aufgaben.size} Aufgaben (vorher ${vorher}).`);
if (veraltet.length) console.log(`Nicht übernommen, weil sich die Aufgabe seit dem Häkchen geändert hat (${veraltet.length}): ${veraltet.join(', ')}`);
if (unbekannt.length) console.log(`Nicht im Aufgabenpool (${unbekannt.length}): ${unbekannt.join(', ')}`);
