// Kapitel 8 „Flächeninhalt und Umfang“ (ADR 0035): Figuren aus Rechtecken und das Kästchenfärben ohne Oberfläche prüfen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inhalt, umfang, rand, inFigur, zellenErfuellt } from '../src/schueler/flaeche.js';
import { pruefeGitter, alsEingabe } from '../src/schueler/geo.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const aufgaben = pool.aufgaben ?? pool;
const L = { rechtecke: [[0, 0, 5, 2], [0, 2, 2, 5]] };

test('Rechteck: Flächeninhalt a · b, Umfang 2 · a + 2 · b', () => {
  const r = { rechtecke: [[0, 0, 4, 3]] };
  assert.equal(inhalt(r), 12);
  assert.equal(umfang(r), 14);
  assert.equal(rand(r).length, 4);
});

test('L-Figur: Teilflächen addiert, die Trennlinie gehört nicht zum Umfang', () => {
  assert.equal(inhalt(L), 16);
  assert.equal(umfang(L), 2 * 5 + 2 * 5);
  assert.equal(rand(L).length, 6);
  assert.ok(inFigur(L, 1, 4));
  assert.ok(!inFigur(L, 4, 4));
});

test('Rahmen: Das Loch wird abgezogen, sein Rand zählt zum Umfang', () => {
  const rahmen = { rechtecke: [[0, 0, 6, 5]], loecher: [[1, 1, 5, 4]] };
  assert.equal(inhalt(rahmen), 30 - 12);
  assert.equal(umfang(rahmen), 22 + 14);
  assert.ok(!inFigur(rahmen, 3, 2));
});

test('Kästchen färben: Anzahl, Umfang, Rechteck und Zusammenhang', () => {
  const zwei_mal_drei = [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2]];
  assert.ok(zellenErfuellt({ n: 6, rechteck: true }, zwei_mal_drei));
  assert.ok(zellenErfuellt({ umfang: 10 }, zwei_mal_drei));
  assert.ok(!zellenErfuellt({ n: 6, rechteck: true }, [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2]]));
  assert.ok(zellenErfuellt({ n: 6 }, [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [1, 2]]));
  assert.ok(!zellenErfuellt({ n: 2 }, [[1, 1], [2, 2]]), 'nur über Ecken verbunden zählt nicht');
  assert.ok(!zellenErfuellt({ n: 2 }, [[1, 1], [1, 1]]), 'doppelt getippt zählt nicht');
});

test('Pool: Jede Färbe-Aufgabe in Kapitel 8 nimmt ihr Beispiel an und eine andere passende Figur', () => {
  const faerben = aufgaben.filter((a) => a.id.startsWith('5.8.') && a.bedingung?.art === 'flaeche');
  assert.ok(faerben.length > 0);
  for (const a of faerben) {
    assert.deepEqual(pruefeGitter(a, alsEingabe(a.loesung)), { richtig: true, fehlvorstellung: null }, a.id);
    // Dieselbe Figur, ein Kästchen nach rechts verschoben, ist genauso richtig.
    const verschoben = a.loesung.map(([x, y]) => [x + 1, y]);
    if (Math.max(...verschoben.map((z) => z[0])) <= a.gitter.b) assert.equal(pruefeGitter(a, alsEingabe(verschoben)).richtig, true, a.id);
    assert.equal(pruefeGitter(a, alsEingabe(a.loesung.slice(1))).richtig, false, a.id);
  }
});

test('Pool: Bilder in Kapitel 8 rechnen sich nach (Zählaufgaben am Raster)', () => {
  const zaehlen = aufgaben.filter((a) => a.id.startsWith('5.8.1-Z1') && a.format === 'zahl' && a.bild?.figuren?.length === 1 && a.einheit === 'Kästchen' && /bedeckt/.test(a.text));
  assert.ok(zaehlen.length > 0);
  for (const a of zaehlen) assert.equal(inhalt(a.bild.figuren[0]), a.loesung, a.id);
});
