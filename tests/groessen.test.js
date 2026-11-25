// Kapitel 6 Größen und Sachaufgaben (ADR 0033): Rechnen mit Größen ohne Oberfläche, und der Umfang des Kapitels im Pool.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { leseKommazahl, inGrundeinheit, teileEingabe, schreibe, gemischt, uhrzeit, pruefeGroesse, loesungGroesse, artVon } from '../src/schueler/groessen.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const kapitel6 = pool.aufgaben.filter((a) => a.lernziel.startsWith('5.6.'));
const RICHTIG = { richtig: true, fehlvorstellung: null };
// Zwischen Zahl und Einheit steht ein geschütztes Leerzeichen. Für den Vergleich im Test wird es ein gewöhnliches.
const klar = (text) => text.replace(/\u00a0/g, ' ');

test('Kommazahl lesen: Komma, Punkt und Gliederung', () => {
  assert.deepEqual(leseKommazahl('2,5'), { z: 25, n: 10 });
  assert.deepEqual(leseKommazahl('2.5'), { z: 25, n: 10 });
  assert.deepEqual(leseKommazahl('1 250'), { z: 1250, n: 1 });
  assert.deepEqual(leseKommazahl('1.250'), { z: 1250, n: 1 }, 'ein Punkt vor genau drei Ziffern gliedert nur');
  assert.deepEqual(leseKommazahl('0,05'), { z: 5, n: 100 });
  assert.equal(leseKommazahl(''), null);
  assert.equal(leseKommazahl('2,5,1'), null);
  assert.equal(leseKommazahl('zwei'), null);
});

test('Größen werden in der Grundeinheit geführt', () => {
  assert.equal(inGrundeinheit('3,50', '€'), 350);
  assert.equal(inGrundeinheit('2,5', 'km'), 2500000);
  assert.equal(inGrundeinheit('1,5', 'h'), 5400);
  assert.equal(inGrundeinheit('0,5', 'ct'), null, 'halbe Cent gibt es nicht');
  assert.equal(inGrundeinheit('3', 'Liter'), null);
  assert.deepEqual(teileEingabe(' 2,5 km '), { zahl: '2,5', einheit: 'km' });
  assert.deepEqual(teileEingabe('3,50€'), { zahl: '3,50', einheit: '€' });
  assert.deepEqual(teileEingabe('250'), { zahl: '250', einheit: '' });
  assert.equal(artVon('kg'), 'gewicht');
  assert.equal(artVon('l'), 'volumen', 'Liter gibt es seit Klasse 6 Kapitel 6 (ADR 0049)');
  assert.equal(artVon('Liter'), null);
});

test('Schreibweisen: Komma, Geld mit zwei Stellen, Zeit gemischt', () => {
  assert.equal(klar(schreibe(2500000, 'km')), '2,5 km');
  assert.equal(klar(schreibe(350, '€')), '3,50 €');
  assert.equal(klar(schreibe(5, '€')), '0,05 €');
  assert.equal(klar(schreibe(300, '€')), '3 €');
  assert.equal(klar(schreibe(25000000, 'kg')), '25 kg');
  assert.equal(klar(schreibe(5400, 'h')), '1 h 30 min');
  assert.equal(klar(gemischt(350, ['€', 'ct'])), '3 € 50 ct');
  assert.equal(klar(gemischt(8100, ['h', 'min'])), '2 h 15 min');
  assert.equal(klar(gemischt(0, ['€', 'ct'])), '0 ct');
  assert.equal(klar(uhrzeit(875)), '14:35 Uhr');
  assert.equal(klar(uhrzeit(545)), '9:05 Uhr');
});

test('Größe prüfen: jede Schreibweise mit demselben Wert ist richtig, ohne Einheit ist es falsch', () => {
  const a = { format: 'groesse', groesse: 'laenge', einheit: 'km', loesung: 2500000, typischeFehler: [{ wert: 250000, fehlvorstellung: 'umrechnungszahl' }] };
  for (const eingabe of ['2,5 km', '2.5 km', '2500 m', '2 500 m', '2500m', '250000 cm']) assert.deepEqual(pruefeGroesse(a, eingabe), RICHTIG, eingabe);
  assert.deepEqual(pruefeGroesse(a, '2,5'), { richtig: false, fehlvorstellung: 'einheit-fehlt' });
  assert.deepEqual(pruefeGroesse(a, '2,5 kg'), { richtig: false, fehlvorstellung: 'einheit-fehlt' }, 'falsche Größenart');
  assert.deepEqual(pruefeGroesse(a, '250 m'), { richtig: false, fehlvorstellung: 'umrechnungszahl' });
  assert.deepEqual(pruefeGroesse(a, '3 km'), { richtig: false, fehlvorstellung: null });
  assert.equal(klar(loesungGroesse(a)), '2,5 km');
});

test('Kapitel 6 hat 15 Lernziele mit je 6 Aufgaben auf F, G, M und E', () => {
  const lernziele = pool.kapitel.find((k) => k.id === '5.6').unterkapitel.flatMap((u) => u.lernziele);
  assert.equal(lernziele.length, 15);
  assert.equal(kapitel6.length, 360);
  for (const l of lernziele) for (const n of ['F', 'G', 'M', 'E']) assert.equal(kapitel6.filter((a) => a.lernziel === l.id && a.niveau === n).length, 6, `${l.id} ${n}`);
});

test('Jede Größenaufgabe nimmt ihre Lösung an und erkennt ihre typischen Fehler', () => {
  const groessen = kapitel6.filter((a) => a.format === 'groesse');
  assert.ok(groessen.length >= 30, `nur ${groessen.length} Größenaufgaben`);
  for (const a of groessen) {
    assert.deepEqual(L.pruefeAntwort(a, loesungGroesse(a)), RICHTIG, a.id);
    assert.equal(L.pruefeAntwort(a, loesungGroesse(a).replace(/\s*\S+$/, '')).fehlvorstellung, 'einheit-fehlt', `${a.id} ohne Einheit`);
    for (const f of a.typischeFehler ?? []) assert.equal(L.pruefeAntwort(a, schreibe(f.wert, a.einheit)).fehlvorstellung, f.fehlvorstellung, `${a.id} ${f.wert}`);
  }
});

test('Kapitel 6 kommt ohne Liter aus, und auf F steht keine Kommazahl', () => {
  for (const a of kapitel6) {
    assert.ok(!/\b\d+\s?(l|ml|Liter)\b/.test(a.text), `${a.id}: Liter gehört nicht ins Kapitel`);
    if (a.niveau === 'F') assert.ok(!/\d,\d/.test(a.text), `${a.id}: Kommazahl auf F`);
  }
});
