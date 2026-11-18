// Erzeugt aufgabenpool/klasse-5.json.
// Aufruf: node tools/erzeuge-klasse-5.mjs
// Der Zufall ist fest geimpft: Gleicher Code ergibt immer dieselbe Datei.
// Jedes Unterkapitel hat seinen eigenen Erzeuger in tools/aufgaben/ und eine eigene Saat.
// So bleiben die Aufgaben der anderen Unterkapitel unverändert, wenn eines überarbeitet wird.

import { writeFileSync, mkdirSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-5.mjs';
import { aufgaben, fehlvorstellungen, setzeSaat } from './werkzeug.mjs';
import { kopfrechnen } from './aufgaben/5-3-1-kopfrechnen.mjs';
import { addieren } from './aufgaben/5-3-2-addieren.mjs';
import { subtrahieren } from './aufgaben/5-3-3-subtrahieren.mjs';
import { klammern } from './aufgaben/5-3-4-klammern.mjs';
import { rechengesetze } from './aufgaben/5-3-5-rechengesetze.mjs';
import { einmaleins } from './aufgaben/5-4-1-einmaleins.mjs';
import { dividieren } from './aufgaben/5-4-5-dividieren.mjs';
import { multiplizieren } from './aufgaben/5-4-2-multiplizieren.mjs';
import { rechenvorteile } from './aufgaben/5-4-3-rechenvorteile.mjs';
import { potenzen } from './aufgaben/5-4-4-potenzen.mjs';
import { punktVorStrich } from './aufgaben/5-4-6-punkt-vor-strich.mjs';
import { verteilungsgesetz } from './aufgaben/5-4-7-verteilungsgesetz.mjs';

const ERZEUGER = [
  [53153153, kopfrechnen], [53253253, addieren], [53353353, subtrahieren], [53453453, klammern], [53553553, rechengesetze],
  [54154154, einmaleins], [54254254, multiplizieren], [54354354, rechenvorteile], [54454454, potenzen], [54554554, dividieren], [54654654, punktVorStrich], [54754754, verteilungsgesetz],
];
for (const [saat, erzeuge] of ERZEUGER) { setzeSaat(saat); erzeuge(); }

const pool = {
  version: 3,
  klassenstufe: 5,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt 5 (Klett)',
  fehlvorstellungen,
  kapitel,
  aufgaben,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben.`);
