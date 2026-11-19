// Ehrentafel und Hoftitel (ADR 0023): die fünf Besten der Klasse nach Kronen und Siegeln.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const neu = (code = '5A-K4M2') => L.neuerSpeicherstand(code, '5a', '2026-11-19T10:00:00Z');
const ok = { geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 };
const loese = (stand, lz, n, ziel) => [...index.nach.get(`${lz}|${n}`)].sort((a, b) => b.afb - a.afb).slice(0, 3).forEach((a) => L.verbuche(stand, a, ok, ziel, 't', index));
const meilenstein = pool.kapitel[2].unterkapitel[2]; // 5.3.3
const ziele = meilenstein.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id)).map((l) => l.id);
const wert = (kronen, siegel = 0) => {
  const je = { F: 0, G: 0, M: 0, E: 0, ...kronen };
  return { kronen: je, siegel, punkte: L.NIVEAUS.reduce((p, n) => p + je[n] * L.KRONEN_PUNKTE[n], 0) + siegel };
};
const e = (id, w, extra = {}) => ({ id, stand: { code: id, ...extra }, wert: w });

test('Punkte: Bronze 1, Silber 2, Gold 4, Purpur 6, jedes Siegel 1; je Meilenstein nur die beste Krone', () => {
  const stand = neu();
  assert.deepEqual(L.ehrenwert(pool, index, stand), { kronen: { F: 0, G: 0, M: 0, E: 0 }, siegel: 0, punkte: 0 });
  for (const lz of ziele) loese(stand, lz, 'M', 'M');
  assert.deepEqual(L.ehrenwert(pool, index, stand), { kronen: { F: 0, G: 0, M: 1, E: 0 }, siegel: ziele.length, punkte: 4 + ziele.length });
  for (const lz of ziele) loese(stand, lz, 'E', 'M');
  const w = L.ehrenwert(pool, index, stand);
  assert.deepEqual(w.kronen, { F: 0, G: 0, M: 0, E: 1 }, 'aufgewertet: Purpur ersetzt Gold');
  assert.equal(w.punkte, 6 + ziele.length);
  // Siegel aus einer anderen Klassenstufe zählen nicht.
  stand.lernziele['6.1.1-A1'] = { erreichtAm: 't' };
  assert.equal(L.ehrenwert(pool, index, stand).siegel, ziele.length);
});

test('Nur wer mindestens eine Silberkrone hat, kommt auf die Tafel', () => {
  assert.equal(L.ehrenfaehig(wert({ F: 3 }, 10)), false);
  assert.equal(L.ehrenfaehig(wert({ G: 1 })), true);
  const t = L.ehrentafel(pool, index, [e('a', wert({ F: 5 }, 20)), e('b', wert({ G: 1 }))]);
  assert.deepEqual(t.map((x) => [x.id, x.platz, x.titel.id]), [['b', 1, 'koenig']]);
});

test('Reihenfolge, Titel und höchstens fünf Plätze', () => {
  const t = L.ehrentafel(pool, index, [
    e('a', wert({ M: 1 }, 2)), e('b', wert({ E: 2 }, 6)), e('c', wert({ G: 1 })), e('d', wert({ M: 3 }, 9)),
    e('f', wert({ G: 2 }, 1)), e('g', wert({ M: 2 }, 4)), e('h', wert({ G: 1 }, 1)),
  ]);
  assert.deepEqual(t.map((x) => x.id), ['d', 'b', 'g', 'a', 'f']);
  assert.deepEqual(t.map((x) => x.titel.m), ['Klassenkönig', 'Herzog', 'Graf', 'Ritter', 'Knappe']);
});

test('Gleichstand: bessere Kronen zuerst, sonst geteilter Platz', () => {
  // Beide 12 Punkte: zwei Purpur gegen drei Gold.
  const t = L.ehrentafel(pool, index, [e('gold', wert({ M: 3 })), e('purpur', wert({ E: 2 }))]);
  assert.deepEqual(t.map((x) => [x.id, x.platz]), [['purpur', 1], ['gold', 2]]);
  const geteilt = L.ehrentafel(pool, index, [e('x', wert({ M: 1 }, 1)), e('y', wert({ M: 1 }, 1)), e('z', wert({ G: 1 }))]);
  assert.deepEqual(geteilt.map((x) => [x.id, x.platz, x.titel.id]), [['x', 1, 'koenig'], ['y', 1, 'koenig'], ['z', 3, 'graf']]);
  // Geteilter fünfter Platz: kurzzeitig sechs Titel.
  const sechs = L.ehrentafel(pool, index, ['a', 'b', 'c', 'd', 'f', 'g'].map((id, i) => e(id, wert({ G: 1 }, i < 4 ? 10 - i : 1))));
  assert.equal(sechs.length, 6);
  assert.deepEqual(sechs.slice(4).map((x) => x.titel.id), ['knappe', 'knappe']);
});

test('Ausgeblendete zählen nicht, der Nächste rückt nach; der eigene Titel ohne Ausblenden bleibt bekannt', () => {
  const t = L.ehrentafel(pool, index, [e('a', wert({ E: 1 }), { ehrentafelAus: true }), e('b', wert({ G: 1 }))]);
  assert.deepEqual(t.map((x) => [x.id, x.titel.id]), [['b', 'koenig']]);
  const ich = neu();
  for (const lz of ziele) loese(ich, lz, 'M', 'M');
  ich.ehrentafelAus = true;
  assert.equal(L.titelOhneAusblenden(pool, index, ich, [neu('5A-AAAA')]).id, 'koenig');
  assert.equal(ich.ehrentafelAus, true, 'der Speicherstand bleibt unverändert');
});

test('Meldung nur bei neuem oder besserem Titel, nicht beim Verlust', () => {
  const stand = neu();
  const [koenig, herzog, graf] = L.HOFTITEL;
  assert.equal(L.meldeHoftitel(stand, null), null);
  assert.equal(L.meldeHoftitel(stand, graf), graf);
  assert.equal(L.meldeHoftitel(stand, graf), null, 'nur einmal');
  assert.equal(L.meldeHoftitel(stand, herzog), herzog, 'Aufstieg');
  assert.equal(L.meldeHoftitel(stand, graf), null, 'Abstieg ohne Meldung');
  assert.equal(L.meldeHoftitel(stand, null), null, 'Verlust ohne Meldung');
  assert.equal(L.meldeHoftitel(stand, koenig), koenig);
});

test('Titelform: bis zur Wahl die männliche Form', () => {
  const stand = neu();
  const herzog = L.hoftitelVon(2);
  assert.equal(L.titelName(herzog, stand.hoftitelForm), 'Herzog');
  assert.equal(L.setzeTitelform(stand, 'x'), false);
  assert.equal(L.setzeTitelform(stand, 'w'), true);
  assert.equal(L.titelName(herzog, stand.hoftitelForm), 'Herzogin');
  assert.equal(L.titelName(L.hoftitelVon(1), 'w'), 'Klassenkönigin');
});

test('Schalter in der Klassendatei, standardmäßig an', () => {
  assert.equal(L.einstellungen({}, '5A-K4M2', pool).ehrentafel, true);
  assert.equal(L.einstellungen({ ehrentafel: false }, '5A-K4M2', pool).ehrentafel, false);
});
