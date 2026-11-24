// Wappenbereiche der Klassen 6 bis 10 (ADR 0039): Schildteilung, Helmzier, Schildhalter, Wahlspruch, Prunkrahmen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../src/schueler/logik.js';

const stand = (klasse, siegel = 400, muenzen = 100000) => ({ klasse, muenzen, lernziele: Object.fromEntries(Array.from({ length: siegel }, (_, i) => [`x.${i}`, {}])),
  wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] } });
const teile = (klasse) => L.WAPPEN_TEILE.filter((t) => t.klasse === klasse);

test('Jede Klassenstufe von 6 bis 10 hat einen gebauten Bereich für etwa 5.000 Münzen, und kein Teil heißt Krone', () => {
  assert.equal(new Set(L.WAPPEN_TEILE.map((t) => t.id)).size, L.WAPPEN_TEILE.length, 'jede Kennung gibt es einmal');
  for (const b of L.WAPPENBEREICHE.filter((x) => x.klasse > 5)) {
    const liste = teile(b.klasse);
    assert.ok(liste.length > 0, b.name);
    assert.deepEqual([...new Set(liste.map((t) => t.art))].sort(), Object.keys(b.arten).sort(), b.name);
    const summe = liste.reduce((a, t) => a + t.preis, 0);
    assert.ok(summe >= 4800 && summe <= 5200, `${b.name}: ${summe} Münzen`);
  }
  assert.equal(teile(6).length, 10);
  assert.equal(teile(8).length, 5);
  assert.equal(teile(9).length, 30);
  assert.ok(teile(9).filter((t) => t.deutsch).length >= 4, 'einige lateinische Sprüche mit Übersetzung');
  assert.ok(L.WAPPEN_TEILE.every((t) => !/krone/i.test(t.name) && !/krone/i.test(t.id)));
  // Ränge steigen mit der Klassenstufe: Klasse 6 Rang 3 bis 5, Klasse 10 bis Rang 11.
  assert.deepEqual([Math.min(...teile(6).map((t) => t.rang)), Math.max(...teile(6).map((t) => t.rang))], [3, 5]);
  assert.equal(Math.max(...teile(10).map((t) => t.rang)), 11);
  assert.ok(L.WAPPEN_TEILE.every((t) => t.rang < L.RAENGE.length));
});

test('Ein Bereich öffnet sich mit der Klassenstufe, ein Teil mit dem Rang', () => {
  assert.equal(L.kaufe(stand('5a'), 'gespalten'), 'klasse');
  assert.equal(L.kaufe(stand('6a', 10), 'gespalten'), 'rang');
  assert.equal(L.kaufe(stand('6a', 30, 100), 'gespalten'), 'muenzen');
  assert.equal(L.kaufe(stand('6a', 30), 'gespalten'), 'ok');
  assert.equal(L.kaufe(stand('6a'), 'topfhelm'), 'klasse');
  assert.equal(L.kaufe(stand('10b'), 'mantel'), 'ok');
});

test('Schildteilung: eine zur Zeit, die zweite Farbe ist eine andere gekaufte Farbe', () => {
  const s = stand('6a');
  for (const id of ['gespalten', 'geviert']) L.kaufe(s, id);
  L.legeAn(s, 'gespalten'); L.legeAn(s, 'geviert');
  assert.equal(s.wappen.teilung, 'geviert');
  assert.equal(L.zweiteFarbe(s.wappen), null, 'ohne zweite Farbe keine Teilung im Bild');
  L.kaufe(s, 'blau'); L.kaufe(s, 'gold');
  assert.equal(L.zweiteFarbe(s.wappen), 'blau');
  L.waehleZweiteFarbe(s, 'gold');
  assert.equal(L.zweiteFarbe(s.wappen), 'gold');
  L.waehleZweiteFarbe(s, 'rot');
  assert.equal(s.wappen.farbe2, 'gold', 'die Schildfarbe selbst geht nicht');
  L.waehleZweiteFarbe(s, 'silber');
  assert.equal(s.wappen.farbe2, 'gold', 'nicht gekaufte Farben gehen nicht');
  L.legeAn(s, 'gold'); // Gold wird Schildfarbe: Die zweite Farbe weicht aus.
  assert.equal(L.zweiteFarbe(s.wappen), 'rot');
  L.legeAn(s, 'geviert');
  assert.equal(s.wappen.teilung, undefined);
  assert.equal(L.traegt(s.wappen, 'geviert'), false);
});

test('Helmzier, Schildhalter, Wahlspruch und Prunkrahmen lassen sich anlegen und abnehmen', () => {
  const s = stand('10a');
  for (const id of ['topfhelm', 'stechhelm', 'decke-schlicht', 'federbusch', 'halter-loewe', 'halter-einhorn', 'spruch-1', 'spruch-25', 'lorbeer', 'kette']) assert.equal(L.kaufe(s, id), 'ok', id);
  L.legeAn(s, 'topfhelm'); L.legeAn(s, 'stechhelm'); L.legeAn(s, 'decke-schlicht'); L.legeAn(s, 'federbusch');
  assert.deepEqual([s.wappen.helm, s.wappen.helmdecke, s.wappen.helmschmuck], ['stechhelm', 'decke-schlicht', 'federbusch']);
  // Schildhalter: Der erste stellt sich auf beide Seiten, dann je Seite gleich oder verschieden.
  L.legeAn(s, 'halter-loewe');
  assert.deepEqual(s.wappen.halter, { links: 'halter-loewe', rechts: 'halter-loewe' });
  L.stelleHalter(s, 'halter-einhorn', 'rechts');
  assert.deepEqual(s.wappen.halter, { links: 'halter-loewe', rechts: 'halter-einhorn' });
  L.stelleHalter(s, 'halter-einhorn', 'rechts');
  assert.deepEqual(s.wappen.halter, { links: 'halter-loewe' });
  L.stelleHalter(s, 'halter-greif', 'rechts');
  assert.deepEqual(s.wappen.halter, { links: 'halter-loewe' }, 'nicht gekauft');
  L.legeAn(s, 'halter-loewe');
  assert.deepEqual(s.wappen.halter, {});
  L.legeAn(s, 'spruch-1'); L.legeAn(s, 'spruch-25');
  assert.equal(s.wappen.spruch, 'spruch-25');
  assert.equal(L.teil('spruch-25').deutsch, 'Durch Mühe zu den Sternen');
  L.legeAn(s, 'lorbeer'); L.legeAn(s, 'kette'); L.legeAn(s, 'lorbeer');
  assert.deepEqual(s.wappen.prunk, ['kette']);
  assert.ok(L.traegt(s.wappen, 'kette') && !L.traegt(s.wappen, 'lorbeer') && L.traegt(s.wappen, 'stechhelm'));
  // Das Wappen der Klasse 5 bleibt, wie es war.
  L.legeAn(s, 'mantel');
  assert.deepEqual(s.wappen.prunk, ['kette'], 'nicht gekauft');
  assert.equal(s.wappen.farbe, 'rot');
});
