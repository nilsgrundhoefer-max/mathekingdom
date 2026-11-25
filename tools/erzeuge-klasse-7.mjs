// Erzeugt aufgabenpool/klasse-7.json.
// Aufruf: node tools/erzeuge-klasse-7.mjs
// Wie in Klasse 5 und 6: fester Zufall, jedes Unterkapitel mit eigenem Erzeuger in tools/aufgaben/ und eigener Saat.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-7.mjs';
import { aufgaben, fehlvorstellungen, setzeSaat, KOMPETENZEN } from './werkzeug.mjs';
import { zahlen } from './aufgaben/7-1-1-zahlen.mjs';
import { koordinaten } from './aufgaben/7-1-x1-koordinaten.mjs';
import { vergleichen } from './aufgaben/7-1-2-vergleichen.mjs';
import { wege } from './aufgaben/7-1-x2-wege.mjs';
import { addieren } from './aufgaben/7-1-3-addieren.mjs';
import { subtrahieren } from './aufgaben/7-1-4-subtrahieren.mjs';
import { rechenvorteile } from './aufgaben/7-1-5-rechenvorteile.mjs';
import { multiplizieren } from './aufgaben/7-1-6-multiplizieren.mjs';
import { dividieren } from './aufgaben/7-1-7-dividieren.mjs';
import { verbindung } from './aufgaben/7-1-8-verbindung.mjs';
import { temperaturen } from './aufgaben/7-1-x3-temperaturen.mjs';
import { girokonto } from './aufgaben/7-1-x4-girokonto.mjs';
import { geradenkreuzung } from './aufgaben/7-2-1-geradenkreuzung.mjs';
import { namenFrei } from './aufgaben/7-2-figur.mjs';
import { winkelsumme } from './aufgaben/7-2-2-winkelsumme.mjs';
import { dreiecksformen } from './aufgaben/7-2-3-dreiecksformen.mjs';
import { konstruieren } from './aufgaben/7-2-4-konstruieren.mjs';
import { satzDesThales, tangenten } from './aufgaben/7-2-5-thales.mjs';
import { hoehen } from './aufgaben/7-2-6-hoehen.mjs';
import { ortslinien, umkreis, inkreis } from './aufgaben/7-2-7-ortslinien.mjs';

const ERZEUGER = [
  // Kapitel 1 (ADR 0043)
  [71171171, zahlen],
  [71971171, koordinaten],
  [71271271, vergleichen],
  [71971272, wege],
  [71371371, addieren],
  [71471471, subtrahieren],
  [71571571, rechenvorteile],
  [71671671, multiplizieren],
  [71771771, dividieren],
  [71871871, verbindung],
  [71971873, temperaturen],
  [71971874, girokonto],
  // Kapitel 2 (ADR 0044)
  [72172172, geradenkreuzung],
  [72272272, winkelsumme],
  [72372372, dreiecksformen],
  [72472472, konstruieren],
  [72572572, satzDesThales],
  [72971972, tangenten],
  [72672672, hoehen],
  [72772772, ortslinien],
  [72972973, umkreis],
  [72972974, inkreis],
];
for (const [saat, erzeuge] of ERZEUGER) { setzeSaat(saat); erzeuge(); }
// Kapitel 2: Punktnamen im Karogitter stehen frei (ADR 0044).
for (const a of aufgaben) if (a.id.startsWith('7.2.')) { if (a.bild?.art === 'gitter') namenFrei(a.bild); if (a.gitter) namenFrei(a.gitter); }
// Mehrere Punkte antippen: Sagt der Text „alle“, verrät das Dashboard nicht, wie viele es sind. Sonst verlangt es genau so viele
// Punkte wie die Lösung hat; ein typischer Fehler mit anderer Anzahl ließe sich dann gar nicht abgeben.
for (const a of aufgaben) if (a.id.startsWith('7.2.') && a.eingabe === 'punkte' && a.loesung.length > 1) {
  if (/\balle\b/.test(a.text)) a.offen = true;
  else a.typischeFehler = (a.typischeFehler ?? []).filter((f) => f.punkte.length === a.loesung.length);
}

// Layout (Nils, 2026-11-21: „korrekte Darstellung und das Layout der Aufgaben“): Steht hinter einer Rechnung noch ein Auftrag
// („Kürze vollständig.“), beginnt er auf einer neuen Zeile. Sonst liest man ihn als Teil der Rechnung.
const AUFTRAG = /([^.?!:\n]) (Kürze vollständig|Gib das Ergebnis als|Kreuze alle an\.|Schreibe (?:das Ergebnis|eine|einen|sie) )/g;
for (const a of aufgaben) if (typeof a.text === 'string') a.text = a.text.replace(AUFTRAG, '$1\n$2');

// Vorstufe (ADR 0037): Eine Brücke darf zu einem Lernziel aus Klasse 5 oder 6 führen. Die Aufgaben dieser Lernziele (Niveaustufen F, G und M)
// liegen als Kopie im Pool. Zuerst müssen deshalb die Pools der Klassen 5 und 6 erzeugt sein (npm run pool).
const mitAufgaben = new Set(aufgaben.map((a) => a.lernziel));
const fremd = [...new Set(kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => mitAufgaben.has(l.id)).flatMap((l) => l.voraussetzungen).filter((id) => !id.startsWith('7.')))].sort();
const frueher = [5, 6].map((k) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${k}.json`, import.meta.url), 'utf8')));
const lernzieleFrueher = new Map(frueher.flatMap((p) => p.kapitel).flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l]));
const vorstufe = {
  klassenstufen: [5, 6],
  lernziele: fremd.map((id) => ({ id, text: lernzieleFrueher.get(id).text })),
  aufgaben: frueher.flatMap((p) => p.aufgaben).filter((a) => fremd.includes(a.lernziel) && a.niveau !== 'E'),
};

const pool = {
  version: 3,
  klassenstufe: 7,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt Mathematik 7, Differenzierende Ausgabe (Klett)',
  fehlvorstellungen,
  kompetenzen: KOMPETENZEN,
  kapitel,
  aufgaben,
  vorstufe,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-7.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben, dazu ${vorstufe.aufgaben.length} Aufgaben aus Klasse 5 und 6 für Brücken (${fremd.length} Lernziele).`);
