// Erzeugt aufgabenpool/klasse-6.json.
// Aufruf: node tools/erzeuge-klasse-6.mjs
// Wie in Klasse 5: fester Zufall, jedes Unterkapitel mit eigenem Erzeuger in tools/aufgaben/ und eigener Saat.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-6.mjs';
import { aufgaben, fehlvorstellungen, setzeSaat, KOMPETENZEN } from './werkzeug.mjs';
import { brueche } from './aufgaben/6-1-1-brueche.mjs';
import { erweitern } from './aufgaben/6-1-2-erweitern.mjs';
import { kuerzen } from './aufgaben/6-1-3-kuerzen.mjs';
import { vergleichen } from './aufgaben/6-1-4-vergleichen.mjs';
import { bruecheUndGroessen } from './aufgaben/6-1-5-groessen.mjs';
import { bruecheAmZahlenstrahl } from './aufgaben/6-1-6-zahlenstrahl.mjs';
import { gleichnamig } from './aufgaben/6-2-1-gleichnamig.mjs';
import { ungleichnamig } from './aufgaben/6-2-2-ungleichnamig.mjs';
import { vervielfachen } from './aufgaben/6-2-3-vervielfachen.mjs';
import { teilen } from './aufgaben/6-2-4-teilen.mjs';
import { multiplizieren } from './aufgaben/6-2-5-multiplizieren.mjs';
import { dividieren } from './aufgaben/6-2-6-dividieren.mjs';
import { ausdruecke } from './aufgaben/6-2-7-ausdruecke.mjs';
import { quaderUndNetze } from './aufgaben/6-3-1-quader.mjs';
import { schraegbilder } from './aufgaben/6-3-2-schraegbild.mjs';

const ERZEUGER = [
  // Kapitel 1 (ADR 0037)
  [61161161, brueche],
  [61261261, erweitern],
  [61361361, kuerzen],
  [61461461, vergleichen],
  [61561561, bruecheUndGroessen],
  [61661661, bruecheAmZahlenstrahl],
  // Kapitel 2 (ADR 0038)
  [62162162, gleichnamig],
  [62262262, ungleichnamig],
  [62362362, vervielfachen],
  [62462462, teilen],
  [62562562, multiplizieren],
  [62662662, dividieren],
  [62762762, ausdruecke],
  // Kapitel 3 (ADR 0045)
  [63163163, quaderUndNetze],
  [63263263, schraegbilder],
];
for (const [saat, erzeuge] of ERZEUGER) { setzeSaat(saat); erzeuge(); }

// Vorstufe (ADR 0037): Eine Brücke darf zu einem Lernziel aus Klasse 5 führen. Damit das auch ohne Netz und ohne den Pool der
// Klasse 5 geht, liegen die Aufgaben dieser Lernziele (Niveaustufen F, G und M, denn eine Brücke liegt eine Stufe unter dem Zielniveau)
// als Kopie im Pool. Zuerst muss deshalb aufgabenpool/klasse-5.json erzeugt sein (npm run pool).
const mitAufgaben = new Set(aufgaben.map((a) => a.lernziel));
const fremd = [...new Set(kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => mitAufgaben.has(l.id)).flatMap((l) => l.voraussetzungen).filter((id) => !id.startsWith('6.')))].sort();
const klasse5 = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const lernziele5 = new Map(klasse5.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l]));
const vorstufe = {
  klassenstufe: 5,
  lernziele: fremd.map((id) => ({ id, text: lernziele5.get(id).text })),
  aufgaben: klasse5.aufgaben.filter((a) => fremd.includes(a.lernziel) && a.niveau !== 'E'),
};

const pool = {
  version: 3,
  klassenstufe: 6,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt Mathematik 6, Differenzierende Ausgabe (Klett)',
  fehlvorstellungen,
  kompetenzen: KOMPETENZEN,
  kapitel,
  aufgaben,
  vorstufe,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-6.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben, dazu ${vorstufe.aufgaben.length} Aufgaben aus Klasse 5 für Brücken (${fremd.length} Lernziele).`);
