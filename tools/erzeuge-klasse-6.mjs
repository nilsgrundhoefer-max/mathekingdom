// Erzeugt aufgabenpool/klasse-6.json.
// Aufruf: node tools/erzeuge-klasse-6.mjs
// Wie in Klasse 5: fester Zufall, jedes Unterkapitel mit eigenem Erzeuger in tools/aufgaben/ und eigener Saat.

import { writeFileSync, mkdirSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-6.mjs';
import { aufgaben, fehlvorstellungen, setzeSaat, KOMPETENZEN } from './werkzeug.mjs';
import { brueche } from './aufgaben/6-1-1-brueche.mjs';
import { erweitern } from './aufgaben/6-1-2-erweitern.mjs';
import { kuerzen } from './aufgaben/6-1-3-kuerzen.mjs';
import { vergleichen } from './aufgaben/6-1-4-vergleichen.mjs';
import { bruecheUndGroessen } from './aufgaben/6-1-5-groessen.mjs';
import { bruecheAmZahlenstrahl } from './aufgaben/6-1-6-zahlenstrahl.mjs';

const ERZEUGER = [
  // Kapitel 1 (ADR 0037)
  [61161161, brueche],
  [61261261, erweitern],
  [61361361, kuerzen],
  [61461461, vergleichen],
  [61561561, bruecheUndGroessen],
  [61661661, bruecheAmZahlenstrahl],
];
for (const [saat, erzeuge] of ERZEUGER) { setzeSaat(saat); erzeuge(); }

const pool = {
  version: 3,
  klassenstufe: 6,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt Mathematik 6, Differenzierende Ausgabe (Klett)',
  fehlvorstellungen,
  kompetenzen: KOMPETENZEN,
  kapitel,
  aufgaben,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-6.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben.`);
