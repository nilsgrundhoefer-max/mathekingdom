// Version 0.69 (ADR 0057): Titelform, Bestenliste nach einer Runde mit 0 Punkten, Feld für die Ganzen bei Brüchen.
// Die Endnull beim Runden prüft tests/klasse-6-dezimal.test.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';

const lade = (k) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${k}.json`, import.meta.url), 'utf8'));
const pool = lade(5), index = L.indexiere(pool);
const neu = (code = '5A-K4M2') => L.neuerSpeicherstand(code, '5a', '2026-11-19T10:00:00Z');
const JETZT = '2026-11-27T09:00:00';

test('Titelform: Jeder Rang und jeder Hoftitel hat zwei verschiedene Formen', () => {
  for (const e of [...L.RAENGE, ...L.HOFTITEL]) {
    assert.ok(e.w && e.w !== e.name, e.name);
    assert.equal(L.inForm(e, 'm'), e.name);
    assert.equal(L.inForm(e, 'w'), e.w);
  }
  assert.equal(new Set([...L.RAENGE, ...L.HOFTITEL].map((e) => e.w)).size, L.RAENGE.length + L.HOFTITEL.length - 0);
});

test('Titelform: Standard ist die bisherige Form, die Wahl gilt für Rang, nächsten Rang und Kennzahlen der Lehrkraft', () => {
  const stand = neu();
  assert.equal(L.titelform(stand), 'm');
  assert.equal(L.rang(0).name, 'Wanderer');
  assert.equal(L.rang(0, L.titelform(stand)).naechster.name, 'Kundschafter');
  L.setzeTitelform(stand, 'w');
  assert.equal(stand.titelform, 'w');
  assert.equal(L.rang(0, L.titelform(stand)).name, 'Wanderin');
  assert.equal(L.rang(0, L.titelform(stand)).naechster.name, 'Kundschafterin');
  assert.equal(L.rang(20, 'w').name, 'Wegmeisterin');
  assert.equal(A.kennzahlen(stand, 'M', JETZT).rang, 'Wanderin');
  L.setzeTitelform(stand, 'm');
  assert.equal(stand.titelform, undefined, 'die bisherige Form steht nicht im Speicherstand');
  assert.equal(A.kennzahlen(stand, 'M', JETZT).rang, 'Wanderer');
});

test('Titelform: Der Hoftitel folgt der Wahl des Kindes, die Symbole bleiben', () => {
  const wert = (kronen, siegel = 0) => ({ kronen: { F: 0, G: 0, M: 0, E: 0, ...kronen }, siegel, punkte: Object.entries(kronen).reduce((p, [n, k]) => p + k * L.KRONEN_PUNKTE[n], 0) + siegel });
  const mia = neu('5A-MIAA'); L.setzeTitelform(mia, 'w');
  const t = L.hoftitelVergabe(pool, index, [{ id: 'mia', stand: mia, wert: wert({ M: 3 }) }, { id: 'ben', stand: neu('5A-BENN'), wert: wert({ M: 2 }) },
    { id: 'lea', stand: Object.assign(neu('5A-LEAA'), { titelform: 'w' }), wert: wert({ G: 1 }) }]);
  assert.deepEqual(t.map((e) => [e.id, e.titel.id, e.titel.name]), [['mia', 'koenig', 'Klassenkönigin'], ['ben', 'herzog', 'Herzog'], ['lea', 'graf', 'Gräfin']]);
  assert.equal(L.HOFTITEL[0].name, 'Klassenkönig', 'die Liste selbst bleibt unverändert');
});

test('Bestenliste: Nach einer eigenen Runde mit 0 Punkten steht der eigene Eintrag da, fremde 0-Punkte-Runden nicht', () => {
  const ich = neu(), anderer = neu('5A-BENN');
  assert.equal(L.bestenliste(ich, [anderer], 'botenritt', JETZT).plaetze.length, 0);
  L.trageSpielEin(ich, 'botenritt', 0, JETZT);
  L.trageSpielEin(anderer, 'botenritt', 0, JETZT);
  const b = L.bestenliste(ich, [anderer], 'botenritt', JETZT);
  assert.deepEqual(b.plaetze.map((p) => [p.eigen, p.punkte]), [[true, 0]]);
  assert.equal(b.eigenerPlatz, 1);
  assert.equal(L.bestenliste(ich, [anderer], 'burgmauer', JETZT).plaetze.length, 0, 'jedes Spiel hat seine eigene Liste');
  // Holt jemand Punkte, steht er vor der eigenen 0.
  L.trageSpielEin(anderer, 'botenritt', 7, JETZT);
  assert.deepEqual(L.bestenliste(ich, [anderer], 'botenritt', JETZT).plaetze.map((p) => p.punkte), [7, 0]);
  // Eine Runde aus der letzten Woche zählt nicht.
  const alt = neu(); L.trageSpielEin(alt, 'botenritt', 0, '2026-11-17T09:00:00');
  assert.equal(L.bestenliste(alt, [], 'botenritt', JETZT).plaetze.length, 0);
});

test('Bruch-Eingabe: Das Feld für die Ganzen verrät nicht mehr, ob eine gemischte Zahl herauskommt', () => {
  for (const k of [6, 7]) {
    const p = lade(k), i = L.indexiere(p);
    const brueche = p.aufgaben.filter((a) => a.format === 'bruch');
    for (const a of brueche.filter((x) => x.gemischt)) assert.ok(L.mitGanzenFeld(i, a), a.id);
    // In jedem Lernziel haben alle „Kürze vollständig“-Aufgaben dieselbe Eingabe.
    const je = new Map();
    for (const a of brueche.filter((x) => x.gekuerzt)) je.set(a.lernziel, (je.get(a.lernziel) ?? new Set()).add(L.mitGanzenFeld(i, a)));
    for (const [lz, formen] of je) assert.equal(formen.size, 1, lz);
  }
  const p7 = lade(7), i7 = L.indexiere(p7), a = p7.aufgaben.find((x) => x.id === '7.1.4-S2-M-03');
  assert.equal(a.gemischt, undefined);
  assert.ok(L.mitGanzenFeld(i7, a), 'auch ohne gemischte Lösung gibt es das Feld');
  assert.equal(L.mitGanzenFeld(index, pool.aufgaben.find((x) => x.format === 'bruch' && !x.gemischt)), false, 'in Klasse 5 bleibt es bei zwei Feldern');
  assert.equal(L.mitGanzenFeld(i7, p7.aufgaben.find((x) => x.format === 'zahl')), false);
});
