// Kapitel 7 „Kreis und Winkel“ (ADR 0034): Winkeldrehen und Kreiszeichnen ohne Oberfläche prüfen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { winkelart, leseGrad, pruefeWinkel, kreisAbstand } from '../src/schueler/winkel.js';
import { pruefeGitter, kreisPasst, alsEingabe } from '../src/schueler/geo.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const RICHTIG = { richtig: true, fehlvorstellung: null };

test('Winkelarten: Grenzen bei 90°, 180° und 360°, kein Nullwinkel', () => {
  assert.equal(winkelart(89), 'spitz');
  assert.equal(winkelart(90), 'recht');
  assert.equal(winkelart(91), 'stumpf');
  assert.equal(winkelart(180), 'gestreckt');
  assert.equal(winkelart(181), 'überstumpf');
  assert.equal(winkelart(360), 'voll');
  assert.equal(winkelart(0), null);
});

test('Gradzahl lesen und Richtungen auf dem Kreis vergleichen', () => {
  assert.equal(leseGrad(' 137° '), 137);
  assert.ok(Number.isNaN(leseGrad('etwa 40')));
  assert.equal(kreisAbstand(359, 1), 2);
  assert.equal(kreisAbstand(10, 190), 180);
});

test('Winkeldrehen: Spielraum, typischer Fehler am falschen Skalenring', () => {
  const a = { loesung: 30, toleranz: 2, typischeFehler: [{ wert: 150, fehlvorstellung: 'skala-falsch' }] };
  assert.deepEqual(pruefeWinkel(a, '32'), RICHTIG);
  assert.equal(pruefeWinkel(a, '33').richtig, false);
  assert.deepEqual(pruefeWinkel(a, '151'), { richtig: false, fehlvorstellung: 'skala-falsch' });
  assert.deepEqual(pruefeWinkel(a, ''), { richtig: false, fehlvorstellung: null });
});

test('Jede Winkeldreh-Aufgabe des Pools nimmt ihre Lösung an und nicht ihre typischen Fehler', () => {
  const liste = pool.aufgaben.filter((a) => a.format === 'winkel');
  assert.ok(liste.length > 0);
  for (const a of liste) {
    assert.deepEqual(pruefeWinkel(a, String(a.loesung)), RICHTIG, a.id);
    for (const f of a.typischeFehler ?? []) assert.equal(pruefeWinkel(a, String(f.wert)).richtig, false, a.id);
  }
});

test('Kreis im Gitter: erst Mittelpunkt, dann ein Punkt der Kreislinie, auch schräg', () => {
  const bed = { art: 'kreis', m: [5, 5], r: 5 };
  assert.ok(kreisPasst(bed, [[5, 5], [10, 5]]));
  assert.ok(kreisPasst(bed, [[5, 5], [8, 9]]), 'Punkt (8|9) liegt 5 Kästchen von M entfernt');
  assert.ok(!kreisPasst(bed, [[10, 5], [5, 5]]), 'Reihenfolge vertauscht');
  assert.ok(!kreisPasst(bed, [[5, 5], [9, 5]]));
});

test('Jede Kreisaufgabe des Pools nimmt ihr Beispiel an und erkennt Radius und Durchmesser', () => {
  const liste = pool.aufgaben.filter((a) => a.format === 'gitter' && a.eingabe === 'kreis');
  assert.ok(liste.length > 0);
  for (const a of liste) {
    assert.deepEqual(pruefeGitter(a, alsEingabe(a.beispiel)), RICHTIG, a.id);
    for (const f of a.typischeFehler ?? []) {
      const r = f.bedingung.r, m = f.bedingung.m ?? a.bedingung.m;
      assert.deepEqual(pruefeGitter(a, alsEingabe([m, [m[0] + r, m[1]]])), { richtig: false, fehlvorstellung: f.fehlvorstellung }, a.id);
    }
  }
});

test('Kapitel 7: Innerhalb einer Niveaustufe zeigen keine zwei Aufgaben dasselbe Bild', () => {
  const gesehen = new Map();
  for (const a of pool.aufgaben.filter((x) => x.id.startsWith('5.7.') && x.bild)) {
    const k = `${a.lernziel}|${a.niveau}|${JSON.stringify(a.bild)}`;
    assert.ok(!gesehen.has(k), `${a.id} zeigt dasselbe Bild wie ${gesehen.get(k)}`);
    gesehen.set(k, a.id);
  }
});
