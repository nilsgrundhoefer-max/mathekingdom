// Aufgabenführung und Meilensteinfreigabe (ADR 0026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';
const kap = pool.kapitel.find((k) => k.id === '5.4');
const ms = (id) => kap.unterkapitel.find((u) => u.id === id);
const ok = () => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 });
const neu = () => L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
// Alle Lernziele eines Meilensteins auf Niveau n nachweisen (je drei Aufgaben, die schwersten zuerst).
const meistere = (stand, id, n = 'M', ziel = 'M') => {
  for (const l of ms(id).lernziele) {
    const liste = [...(index.nach.get(`${l.id}|${n}`) ?? [])].sort((a, b) => b.afb - a.afb).slice(0, 3);
    for (const a of liste) L.verbuche(stand, a, ok(), ziel, '2026-11-19T10:05:00Z', index);
  }
};
const einmal = (stand, id, extra = {}) => {
  const lz = ms(id).lernziele[0].id;
  const a = index.nach.get(`${lz}|M`)[0];
  L.verbuche(stand, a, { ...ok(), geloest: false, versuche: 2 }, 'M', '2026-11-19T10:06:00Z', index, extra);
};
const einst = (k = {}) => L.einstellungen({ tore: ['5.4'], ...k }, CODE, pool);

test('Ohne Meilensteinfreigabe liegt nichts im Nebel', () => {
  assert.equal(L.imNebel(index, neu(), kap, einst()).size, 0);
});

test('Freigabe: nur die angehakten offen, die übrigen gehen alle auf einmal auf', () => {
  const stand = neu();
  const e = einst({ meilensteinFreigabe: { '5.4': ['5.4.1', '5.4.2'] } });
  assert.deepEqual([...L.imNebel(index, stand, kap, e)], ['5.4.3', '5.4.4', '5.4.5', '5.4.6', '5.4.7', '5.4.X1']);
  meistere(stand, '5.4.1');
  assert.equal(L.imNebel(index, stand, kap, e).size, 6, 'erst wenn alle freigegebenen gemeistert sind');
  meistere(stand, '5.4.2');
  assert.deepEqual([...L.imNebel(index, stand, kap, e)], ['5.4.X1'], 'der Abstecher hängt an 5.4.7');
  meistere(stand, '5.4.7');
  assert.equal(L.imNebel(index, stand, kap, e).size, 0);
});

test('Freigabe: Begonnenes bleibt offen, ein Sonderauftrag öffnet nichts, gesperrte zählen nicht', () => {
  const stand = neu();
  const e = einst({ meilensteinFreigabe: { '5.4': ['5.4.1'] } });
  einmal(stand, '5.4.5');
  einmal(stand, '5.4.6', { sonderauftrag: 'x1' });
  const nebel = L.imNebel(index, stand, kap, e);
  assert.equal(nebel.has('5.4.5'), false);
  assert.equal(nebel.has('5.4.6'), true);
  // Ist der einzige freigegebene Meilenstein für das Kind gesperrt, ist nichts mehr zu meistern: alles geht auf.
  const zu = einst({ meilensteinFreigabe: { '5.4': ['5.4.1'] }, sperren: { '5.4.1': [CODE] } });
  assert.deepEqual([...L.imNebel(index, neu(), kap, zu)], ['5.4.X1']);
});

test('Führung: zum zuletzt bearbeiteten Meilenstein, danach zum nächsten nicht gemeisterten', () => {
  const stand = neu();
  const e = einst();
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M').id, '5.4.1');
  einmal(stand, '5.4.1');
  einmal(stand, '5.4.2');
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M').id, '5.4.2', 'nicht der erste angefangene');
  // Ein Seitenblick oder Rückblick zieht die Führung nicht weg.
  einmal(stand, '5.4.1', { seitenblick: true });
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M').id, '5.4.2');
  meistere(stand, '5.4.2');
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M').id, '5.4.3', 'nach dem Meistern der nächste danach');
  assert.equal(L.etappe(pool, index, stand, { ...e, aktuellesKapitel: '5.4' }).milestone.id, '5.4.3');
  // Am Ende des Weges geht es vorn weiter, bei dem, was noch fehlt.
  for (const id of ['5.4.3', '5.4.4', '5.4.5', '5.4.6', '5.4.7']) meistere(stand, id);
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M').id, '5.4.1');
});

test('Führung: Wer über seinem Ziel spielt, wird erst mit der Krone dieser Farbe weitergeführt', () => {
  const stand = neu();
  const e = einst();
  meistere(stand, '5.4.1', 'M');
  assert.equal(L.fuehrungFertig(index, stand, ms('5.4.1'), 'M', 'M'), true);
  assert.equal(L.fuehrungFertig(index, stand, ms('5.4.1'), 'E', 'M'), false);
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'E').id, '5.4.1');
  meistere(stand, '5.4.1', 'E');
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'E').id, '5.4.2');
});

test('Führung überspringt Abstecher, bietet sie am Meilenstein davor an', () => {
  const stand = neu();
  const e = einst();
  assert.deepEqual(L.abstecherAm(index, stand, kap, ms('5.4.7'), e, 'M').map((u) => u.id), ['5.4.X1']);
  for (const u of kap.unterkapitel.filter((x) => !x.extra)) meistere(stand, u.id);
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap, e, 'M'), null);
});
