// Klasse 7, Kapitel 2 „Dreiecke“ (ADR 0044): 7 Meilensteine, 3 Abstecher nur auf E, Pflicht-ab-Marke, Figuren mit wahren Winkeln,
// Konstruieren am Gitter und im Heft mit Kontrollwert.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefeGitter, alsEingabe } from '../src/schueler/geo.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(7), sechs = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const RICHTIG = { richtig: true, fehlvorstellung: null };
const zwei = pool.kapitel[1];
const kap2 = pool.aufgaben.filter((a) => a.id.startsWith('7.2.'));
const u = (id) => zwei.unterkapitel.find((x) => x.id === id);

test('Kapitel 2 hat 7 Meilensteine mit je 2 Lernzielen und 3 Abstecher nur auf E, zusammen 408 Aufgaben', () => {
  assert.equal(zwei.titel, 'Dreiecke');
  assert.deepEqual(zwei.unterkapitel.map((x) => x.id), ['7.2.1', '7.2.2', '7.2.3', '7.2.4', '7.2.5', '7.2.X1', '7.2.6', '7.2.7', '7.2.X2', '7.2.X3']);
  assert.equal(kap2.length, 408);
  for (const x of zwei.unterkapitel) for (const l of x.lernziele) {
    const zahl = L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length);
    assert.deepEqual(zahl, x.extra ? [0, 0, 0, 24] : [6, 6, 6, 6], l.id);
  }
  assert.ok(zwei.unterkapitel.filter((x) => x.extra).every((x) => x.ab === 'E' && x.lernziele.length === 1));
  assert.ok(zwei.unterkapitel.filter((x) => !x.extra).every((x) => x.lernziele.length === 2));
});

test('Pflicht ab M: 2.1 und 2.5 sind auf F und G ein freiwilliger Abstecher auf der eigenen Stufe', () => {
  assert.deepEqual(zwei.unterkapitel.filter((x) => x.pflicht).map((x) => [x.id, x.pflicht]), [['7.2.1', 'M'], ['7.2.5', 'M']]);
  for (const id of ['7.2.1', '7.2.5']) {
    assert.equal(L.istNiveauAbstecher(u(id), 'F'), true, id);
    assert.equal(L.istNiveauAbstecher(u(id), 'G'), true, id);
    assert.equal(L.istNiveauAbstecher(u(id), 'M'), false, id);
    assert.equal(L.istAbstecher(u(id), 'E'), false, id);
  }
  // Anders als ein Abstecher ab E hebt die Pflicht-ab-Marke die Stufe nicht an: Auf G wird auf G gearbeitet.
  assert.equal(L.stufeFuer(index, '7.2.1-W1', 'G'), 'G');
  assert.equal(L.stufeFuer(index, '7.2.X1-T1', 'G'), 'E');
  assert.equal(L.istNiveauAbstecher(u('7.2.2'), 'F'), false);
});

test('Gitteraufgaben: Punkte, Linien und Kreise nehmen ihre Lösung an und erkennen die typischen Fehler', () => {
  const gitter = kap2.filter((a) => a.format === 'gitter');
  assert.ok(gitter.length >= 80, `nur ${gitter.length} Gitteraufgaben`);
  for (const a of gitter) {
    const loesung = a.eingabe === 'punkte' ? a.loesung : a.beispiel;
    assert.deepEqual(pruefeGitter(a, alsEingabe(loesung)), RICHTIG, a.id);
    assert.equal(pruefeGitter(a, '').richtig, false, a.id);
    if (a.eingabe === 'punkte') for (const f of a.typischeFehler ?? []) assert.deepEqual(pruefeGitter(a, alsEingabe(f.punkte)), { richtig: false, fehlvorstellung: f.fehlvorstellung }, a.id);
  }
  assert.deepEqual([...new Set(gitter.map((a) => a.eingabe))].sort(), ['kreis', 'linie', 'punkte']);
});

test('Heftaufgaben: Kontrollwert auf 2 mm oder 2° genau, mit Planfigur', () => {
  const heft = kap2.filter((a) => a.nachweis?.some((n) => n.art === 'heft'));
  assert.ok(heft.length >= 12, `nur ${heft.length} Heftaufgaben`);
  assert.ok(heft.every((a) => a.niveau !== 'F'), 'Heftaufgaben gibt es erst ab G');
  for (const a of heft) {
    assert.equal(a.toleranz, 2, a.id);
    for (const d of [-2, 0, 2]) assert.equal(L.pruefeAntwort(a, String(a.loesung + d)).richtig, true, `${a.id} ${d}`);
    for (const d of [-3, 3]) assert.equal(L.pruefeAntwort(a, String(a.loesung + d)).richtig, false, `${a.id} ${d}`);
  }
  assert.ok(heft.filter((a) => a.lernziel === '7.2.4-K2').every((a) => a.bild?.titel === 'Planfigur'));
});

test('Konstruktionsschritte ordnen: Nur die richtige Reihenfolge zählt', () => {
  const ordnen = kap2.filter((a) => a.format === 'ordnen');
  assert.ok(ordnen.length >= 10);
  for (const a of ordnen) {
    assert.deepEqual(L.pruefeAntwort(a, a.loesung), RICHTIG, a.id);
    assert.equal(L.pruefeAntwort(a, [...a.loesung].reverse()).richtig, false, a.id);
  }
});

test('Auf F hat jede Aufgabe ein Bild, keine Aufgabe spricht von Hypotenuse oder Kathete', () => {
  for (const a of kap2.filter((x) => x.niveau === 'F')) assert.ok(a.bild || a.gitter, `${a.id} ohne Bild`);
  for (const a of kap2) assert.ok(!/Hypotenuse|Kathete/.test(JSON.stringify([a.text, a.optionen, a.hilfen])), a.id);
});

test('Der Prüfer misst jede Figur nach: Ein falscher Winkel im Bild fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.bild?.art === 'figur' && x.bild.winkel?.some((w) => w.wert != null && !w.frage));
  const w = a.bild.winkel.find((x) => x.wert != null && !x.frage);
  w.wert += 15;
  const { fehler } = pruefePool(kopie, [fuenf, sechs]);
  assert.ok(fehler.some((f) => f.startsWith(a.id)), `${a.id}: kein Fehler gemeldet`);
});

test('Der Prüfer kennt die Dreiecksarten: Ein falscher Kongruenzsatz fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.nachweis?.some((n) => n.art === 'kongruenz' && n.satz === 'sws'));
  a.nachweis.find((n) => n.art === 'kongruenz').satz = 'sss';
  const { fehler } = pruefePool(kopie, [fuenf, sechs]);
  assert.ok(fehler.some((f) => f.startsWith(a.id)), `${a.id}: kein Fehler gemeldet`);
});
