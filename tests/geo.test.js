// Kapitel 5 Geometrie (ADR 0032): Das Gitterzeichnen wird ohne Oberfläche geprüft. Jede Gitteraufgabe des Pools muss ihre eigene Lösung annehmen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { erfuellt, pruefeGitter, lesePunkte, alsEingabe, gitterLoesung } from '../src/schueler/geo.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const gitter = pool.aufgaben.filter((a) => a.format === 'gitter');
const RICHTIG = { richtig: true, fehlvorstellung: null };

test('Punkte als Text: Schreiben und Lesen passen zusammen', () => {
  const punkte = [[3, 5], [0, 0], [12, 7]];
  assert.equal(alsEingabe(punkte), '(3|5) (0|0) (12|7)');
  assert.deepEqual(lesePunkte(alsEingabe(punkte)), punkte);
  assert.deepEqual(lesePunkte(''), []);
  assert.deepEqual(lesePunkte(null), []);
});

test('Linienbedingungen: Strecke, Gerade, eine von mehreren, senkrecht, parallel, Länge', () => {
  const g = [[0, 0], [4, 2]];
  assert.ok(erfuellt({ art: 'strecke', a: [1, 1], b: [4, 1] }, [[4, 1], [1, 1]]));
  assert.ok(!erfuellt({ art: 'strecke', a: [1, 1], b: [4, 1] }, [[1, 1], [3, 1]]));
  assert.ok(erfuellt({ art: 'gerade', a: g[0], b: g[1] }, [[2, 1], [6, 3]]));
  assert.ok(!erfuellt({ art: 'gerade', a: g[0], b: g[1] }, [[2, 1], [6, 4]]));
  assert.ok(erfuellt({ art: 'eine', linien: [[[0, 3], [1, 3]], [[2, 0], [2, 1]]] }, [[2, 5], [2, 7]]));
  assert.ok(!erfuellt({ art: 'eine', linien: [[[0, 3], [1, 3]], [[2, 0], [2, 1]]] }, [[0, 0], [1, 1]]));
  assert.ok(erfuellt({ art: 'senkrecht', zu: g, durch: [2, 1] }, [[1, 3], [3, -1]]));
  assert.ok(!erfuellt({ art: 'senkrecht', zu: g, durch: [2, 1] }, [[2, 3], [4, -1]]), 'senkrecht, aber nicht durch den Punkt');
  assert.ok(erfuellt({ art: 'parallel', zu: g }, [[0, 2], [2, 3]]));
  assert.ok(!erfuellt({ art: 'parallel', zu: g }, [[2, 1], [6, 3]]), 'die Linie selbst ist keine Parallele');
  assert.ok(erfuellt({ art: 'parallel', zu: [[0, 0], [5, 0]], abstand: 3 }, [[1, 3], [4, 3]]));
  assert.ok(!erfuellt({ art: 'parallel', zu: [[0, 0], [5, 0]], abstand: 3 }, [[1, 2], [4, 2]]));
  assert.ok(erfuellt({ art: 'laenge', laenge: 5, von: [1, 1] }, [[4, 5], [1, 1]]), 'auch schräg: 3 und 4 Kästchen ergeben 5');
  assert.ok(!erfuellt({ art: 'laenge', laenge: 5, von: [1, 1] }, [[1, 1], [5, 1]]));
  assert.ok(!erfuellt({ art: 'gerade', a: g[0], b: g[1] }, [[2, 1], [2, 1]]), 'zwei gleiche Punkte sind keine Linie');
  assert.ok(!erfuellt({ art: 'gerade', a: g[0], b: g[1] }, [[2, 1]]));
});

test('Jede Gitteraufgabe nimmt ihre Lösung an und erkennt ihre typischen Fehler', () => {
  assert.ok(gitter.length >= 80, `nur ${gitter.length} Gitteraufgaben`);
  const arten = new Set();
  for (const a of gitter) {
    arten.add(a.eingabe);
    const loesung = a.eingabe === 'linie' ? a.beispiel : a.loesung;
    assert.deepEqual(pruefeGitter(a, alsEingabe(loesung)), RICHTIG, a.id);
    assert.deepEqual(L.pruefeAntwort(a, alsEingabe([...loesung].reverse())), RICHTIG, `${a.id}: Die Reihenfolge der Punkte ist gleichgültig`);
    assert.equal(pruefeGitter(a, '').richtig, false, a.id);
    assert.equal(typeof gitterLoesung(a), 'string', a.id);
    for (const f of a.typischeFehler ?? []) {
      const falsch = a.eingabe === 'linie' ? f.beispiel : f.punkte;
      if (!falsch) continue;
      assert.deepEqual(pruefeGitter(a, alsEingabe(falsch)), { richtig: false, fehlvorstellung: f.fehlvorstellung }, a.id);
    }
    if (a.eingabe !== 'linie') {
      const g = a.gitter, max = a.eingabe === 'zellen' ? [g.b - 1, g.h - 1] : [g.b, g.h];
      for (const [x, y] of a.loesung) assert.ok(x >= 0 && y >= 0 && x <= max[0] && y <= max[1], `${a.id}: (${x}|${y}) liegt außerhalb`);
      assert.equal(pruefeGitter(a, alsEingabe(a.loesung.slice(1))).richtig, false, `${a.id}: ein fehlender Punkt`);
    }
  }
  assert.deepEqual([...arten].sort(), ['linie', 'punkte', 'zellen']);
});

test('Heftaufgaben mit Kontrollwert: 2 mm Abweichung zählen als richtig, 3 mm nicht', () => {
  const heft = pool.aufgaben.filter((a) => a.format === 'zahl' && a.toleranz);
  assert.ok(heft.length >= 12, `nur ${heft.length}`);
  for (const a of heft) {
    assert.equal(a.toleranz, 2, a.id);
    assert.equal(a.einheit, 'mm', a.id);
    for (const d of [-2, 0, 2]) assert.equal(L.pruefeAntwort(a, String(a.loesung + d)).richtig, true, `${a.id}: ${d} mm`);
    for (const d of [-3, 3]) assert.equal(L.pruefeAntwort(a, String(a.loesung + d)).richtig, false, `${a.id}: ${d} mm`);
  }
});

test('Kapitel 5: Jedes der 16 Lernziele hat auf jeder Niveaustufe 6 Aufgaben', () => {
  const zahl = new Map();
  for (const a of pool.aufgaben.filter((x) => x.lernziel.startsWith('5.5.'))) zahl.set(`${a.lernziel}|${a.niveau}`, (zahl.get(`${a.lernziel}|${a.niveau}`) ?? 0) + 1);
  assert.equal(zahl.size, 64);
  for (const [k, n] of zahl) assert.equal(n, 6, k);
});
