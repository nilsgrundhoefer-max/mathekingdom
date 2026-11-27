// Bericht zur Worterklärung am Wort (ADR 0056): Wie oft wird welches Wort erklärt, und welche häufigen Wörter der Aufgaben
// stehen in keinem Wortspeicher? Aufruf: node tools/wortbericht.mjs [5|6|7] [--fehlend]
import { readFileSync } from 'node:fs';
import { wortVerzeichnis, findeWoerter, aufgabenTexte } from '../src/gemeinsam/woerter.js';

const klasse = process.argv[2] ?? '5';
const pool = JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${klasse}.json`, import.meta.url), 'utf8'));
const verzeichnis = wortVerzeichnis(pool);
const ortVon = new Map(pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele.map((l) => [l.id, { meilenstein: u.id, kapitel: k.id }]))));
const zaehler = new Map(), fremd = new Map(), ohne = new Map();
let n = 0, summe = 0, leer = 0;
for (const a of pool.aufgaben) {
  const ort = ortVon.get(a.lernziel);
  const texte = aufgabenTexte(a);
  const gefunden = new Set();
  for (const t of texte) for (const f of findeWoerter(t, verzeichnis, ort)) {
    gefunden.add(f.wort);
    if (f.rang >= 2) fremd.set(f.wort, (fremd.get(f.wort) ?? 0) + 1);
  }
  for (const w of gefunden) zaehler.set(w, (zaehler.get(w) ?? 0) + 1);
  n++; summe += gefunden.size; if (!gefunden.size) leer++;
  // Wörter ohne Erklärung: alles, was nicht gefunden wurde.
  for (const t of texte) {
    const funde = findeWoerter(t, verzeichnis, ort);
    for (const m of t.matchAll(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]{3,}/g)) if (!funde.some((f) => m.index < f.ende && f.start < m.index + m[0].length)) ohne.set(m[0], (ohne.get(m[0]) ?? 0) + 1);
  }
}
console.log(`Klasse ${klasse}: ${n} Aufgaben, im Schnitt ${(summe / n).toFixed(1)} erklärte Wörter, ${leer} Aufgaben ohne.`);
const liste = (m, ab = 1) => [...m].filter(([, z]) => z >= ab).sort((a, b) => b[1] - a[1]).map(([w, z]) => `${w} ${z}`).join(' | ');
if (process.argv.includes('--fremd')) console.log('Aus anderen Kapiteln:', liste(fremd));
if (process.argv.includes('--fehlend')) console.log('Ohne Erklärung:', liste(ohne, Number(process.argv[process.argv.indexOf('--fehlend') + 1]) || 8));
if (process.argv.includes('--nie')) console.log('Nie gefunden:', verzeichnis.filter((e) => !zaehler.has(e.wort)).map((e) => e.wort).join(' | '));
