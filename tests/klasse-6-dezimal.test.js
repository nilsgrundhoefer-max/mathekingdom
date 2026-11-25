// Klasse 6, Kapitel 4 „Dezimalzahlen“ (ADR 0047): 6 Meilensteine mit je 2 Lernzielen, Heftaufgaben nur beim schriftlichen Dividieren,
// periodische Dezimalzahlen in zwei Feldern, Endnullen nie verlangt. Der Prüfer kennt das Heftband in Klasse 5, 6 und 7.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';
import { periodeText } from '../tools/pruefe-brueche.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const vier = pool.kapitel[3];
const kap4 = pool.aufgaben.filter((a) => a.id.startsWith('6.4.'));
const RICHTIG = { richtig: true, fehlvorstellung: null };
const meldungen = (aendere) => {
  const kopie = structuredClone(pool);
  aendere(kopie.aufgaben);
  return pruefePool(kopie, [fuenf]).fehler;
};
const finde = (liste, id) => liste.find((a) => a.id === id);

test('Kapitel 4 hat 6 Meilensteine mit je 2 Lernzielen und 24 Aufgaben je Lernziel, zusammen 288 Aufgaben', () => {
  const sechs = vier.unterkapitel.find((x) => x.id === '6.4.6');
  assert.equal(sechs.ab, 'M');
  assert.equal(L.istNiveauAbstecher(sechs, 'G'), true);
  assert.equal(L.istNiveauAbstecher(sechs, 'M'), false);
  assert.equal(vier.titel, 'Dezimalzahlen');
  assert.deepEqual(vier.unterkapitel.map((x) => x.id), ['6.4.1', '6.4.2', '6.4.3', '6.4.5', '6.4.6', '6.4.7']);
  assert.equal(kap4.length, 288);
  for (const x of vier.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    // 4.6 Schriftlich dividieren ist ein Abstecher ab M: zwölf Aufgaben auf M und E, keine auf F und G.
    const soll = x.id === '6.4.6' ? [0, 0, 12, 12] : [6, 6, 6, 6];
    for (const l of x.lernziele) assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), soll, l.id);
  }
});

test('Heftaufgaben gibt es in Kapitel 4 nur beim schriftlichen Dividieren auf M und E, je Gruppe zwei', () => {
  const heft = kap4.filter((a) => a.heftaufgabe);
  assert.equal(heft.length, 8);
  for (const a of heft) {
    assert.ok(a.lernziel.startsWith('6.4.6'), a.id);
    assert.ok(['M', 'E'].includes(a.niveau), a.id);
    assert.match(a.text, /^Dividiere schriftlich im Heft: \d+ : \d+\n/, a.id);
    assert.ok(a.division, a.id);
  }
});

test('Der Prüfer meldet eine Heftaufgabe ohne Kennzeichen und ein Kennzeichen ohne Heftauftrag', () => {
  const heft = kap4.find((a) => a.heftaufgabe), ohne = kap4.find((a) => !a.heftaufgabe && a.format === 'zahl');
  assert.ok(meldungen((l) => { delete finde(l, heft.id).heftaufgabe; }).some((f) => f.startsWith(heft.id)), 'fehlendes Kennzeichen nicht gemeldet');
  assert.ok(meldungen((l) => { finde(l, ohne.id).heftaufgabe = true; }).some((f) => f.startsWith(ohne.id)), 'überzähliges Kennzeichen nicht gemeldet');
  // Auch in Klasse 5 und 7 trägt jede Aufgabe mit Heftauftrag das Kennzeichen.
  for (const n of [5, 7]) assert.ok(lies(n).aufgaben.some((a) => a.heftaufgabe), `Klasse ${n} ohne Heftaufgabe`);
});

test('Periode: Jede Schreibweise mit dem richtigen Wert zählt, die abgebrochene Zahl ist der typische Fehler', () => {
  assert.equal(periodeText({ z: 1, n: 6 }), '0,16̅');
  assert.equal(periodeText({ z: 1, n: 3 }), '0,3̅');
  assert.equal(periodeText({ z: 7, n: 8 }), '0,875');
  const a = kap4.find((x) => x.format === 'periode' && x.loesung === '0,7̅');
  assert.ok(a, 'Aufgabe mit 0,7̅ fehlt');
  assert.deepEqual(L.pruefeAntwort(a, { vor: '0,', periode: '7' }), RICHTIG);
  assert.deepEqual(L.pruefeAntwort(a, { vor: '0,7', periode: '7' }), RICHTIG);
  assert.deepEqual(L.pruefeAntwort(a, { vor: '0,7', periode: '' }), { richtig: false, fehlvorstellung: 'periode-abgebrochen' });
});

test('Der Prüfer meldet eine Periode, die nicht die kürzeste Schreibweise ist', () => {
  const a = kap4.find((x) => x.format === 'periode' && x.loesung === '0,7̅');
  assert.ok(meldungen((l) => { finde(l, a.id).loesung = '0,77̅'; }).some((f) => f.startsWith(a.id)));
});

test('Endnullen sind nie verlangt: Beim Runden zählt „9“ wie „9,0“', () => {
  const runden = kap4.filter((a) => a.lernziel.startsWith('6.4.3') && a.format === 'zahl' && /,\d*0$/.test(a.loesung));
  assert.ok(runden.length >= 1);
  for (const a of runden) {
    assert.deepEqual(L.pruefeAntwort(a, a.loesung), RICHTIG, a.id);
    assert.deepEqual(L.pruefeAntwort(a, a.loesung.replace(/,?0+$/, '')), RICHTIG, a.id);
  }
});

test('Der Prüfer rechnet jede Rundung nach und meldet ein falsches Ergebnis', () => {
  const a = kap4.find((x) => x.lernziel.startsWith('6.4.3') && x.format === 'zahl' && x.nachweis?.some((n) => n?.art === 'runden'));
  assert.ok(meldungen((l) => { const b = finde(l, a.id); b.nachweis = b.nachweis.map((n) => (n?.art === 'runden' ? { ...n, ergebnis: `${n.ergebnis}1` } : n)); }).some((f) => f.startsWith(a.id)));
});

test('Schriftliche Division: Der Prüfer meldet Dividend und Divisor, die nicht die Lösung ergeben', () => {
  const a = kap4.find((x) => x.division && x.format === 'zahl');
  assert.ok(meldungen((l) => { finde(l, a.id).division.divisor += 1; }).some((f) => f.startsWith(a.id)));
});
