// Erzeugt aufgabenpool/klasse-6.json.
// Aufruf: node tools/erzeuge-klasse-6.mjs
// Wie in Klasse 5: fester Zufall, jedes Unterkapitel mit eigenem Erzeuger in tools/aufgaben/ und eigener Saat.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-6.mjs';
import { grundwoerter, fruehereWoerter } from './grundwoerter.mjs';
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
import { ansichten } from './aufgaben/6-3-3-ansichten.mjs';
import { prismen } from './aufgaben/6-3-4-prisma.mjs';
import { pyramiden } from './aufgaben/6-3-5-pyramide.mjs';
import { rundeKoerper } from './aufgaben/6-3-6-rund.mjs';
import { kopfgeometrie } from './aufgaben/6-3-8-kopfgeometrie.mjs';
import { dezimalschreibweise6 } from './aufgaben/6-4-1-schreibweise.mjs';
import { vergleichen6 } from './aufgaben/6-4-2-vergleichen.mjs';
import { runden6 } from './aufgaben/6-4-3-runden.mjs';
import { umwandeln6 } from './aufgaben/6-4-5-umwandeln.mjs';
import { dividieren6 } from './aufgaben/6-4-6-dividieren.mjs';
import { prozent6 } from './aufgaben/6-4-7-prozent.mjs';
import { addieren6 } from './aufgaben/6-5-1-addieren.mjs';
import { stufenzahlen6 } from './aufgaben/6-5-2-stufenzahlen.mjs';
import { multiplizieren6 } from './aufgaben/6-5-3-multiplizieren.mjs';
import { dividieren6 as dividieren65 } from './aufgaben/6-5-4-dividieren.mjs';
import { verbinden6 } from './aufgaben/6-5-5-verbinden.mjs';
import { oberflaeche6 } from './aufgaben/6-6-1-oberflaeche.mjs';
import { volumenVergleichen6 } from './aufgaben/6-6-2-volumen-vergleichen.mjs';
import { einheiten6 } from './aufgaben/6-6-3-einheiten.mjs';
import { volumen6 } from './aufgaben/6-6-4-volumen.mjs';
import { zusammengesetzt6 } from './aufgaben/6-6-5-zusammengesetzt.mjs';
import { darstellungen6 } from './aufgaben/6-7-1-darstellungen.mjs';
import { proportional6 } from './aufgaben/6-7-2-proportional.mjs';
import { schaubilder6 } from './aufgaben/6-7-5-schaubilder.mjs';
import { dreisatz6 } from './aufgaben/6-7-6-dreisatz.mjs';
import { antiproportional6 } from './aufgaben/6-7-7-antiproportional.mjs';

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
  [63363363, ansichten],
  [63463463, prismen],
  [63563563, pyramiden],
  [63663663, rundeKoerper],
  [63863863, kopfgeometrie],
  // Kapitel 4 (ADR 0047)
  [64164164, dezimalschreibweise6],
  [64264264, vergleichen6],
  [64364364, runden6],
  [64564564, umwandeln6],
  [64664664, dividieren6],
  [64764764, prozent6],
  // Kapitel 5 (ADR 0048)
  [65165165, addieren6],
  [65265265, stufenzahlen6],
  [65365365, multiplizieren6],
  [65465465, dividieren65],
  [65565565, verbinden6],
  // Kapitel 6 (ADR 0049)
  [66166166, oberflaeche6],
  [66266266, volumenVergleichen6],
  [66366366, einheiten6],
  [66466466, volumen6],
  [66566566, zusammengesetzt6],
  // Kapitel 7 (ADR 0050)
  [67167167, darstellungen6],
  [67267267, proportional6],
  [67567567, schaubilder6],
  [67667667, dreisatz6],
  [67767767, antiproportional6],
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
  lernziele: fremd.map((id) => ({ id, text: lernziele5.get(id).text, ...(lernziele5.get(id).merkzettel && { merkzettel: lernziele5.get(id).merkzettel }) })),
  // Worterklärung am Wort (ADR 0056): die Wortspeicher und Grundwörter der Klasse 5, jedes Wort einmal.
  woerter: fruehereWoerter([klasse5]),
  aufgaben: klasse5.aufgaben.filter((a) => fremd.includes(a.lernziel) && a.niveau !== 'E'),
};

const pool = {
  version: 3,
  klassenstufe: 6,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt Mathematik 6, Differenzierende Ausgabe (Klett)',
  fehlvorstellungen,
  kompetenzen: KOMPETENZEN,
  kapitel,
  grundwoerter: grundwoerter[6],
  aufgaben,
  vorstufe,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-6.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben, dazu ${vorstufe.aufgaben.length} Aufgaben aus Klasse 5 für Brücken (${fremd.length} Lernziele).`);
