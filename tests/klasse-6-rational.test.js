// Klasse 6, Kapitel 9 „Rationale Zahlen“ (ADR 0059): 9.1 bis 9.4 auf allen Stufen, 9.5 und 9.6 als Abstecher nur auf E.
// Technik aus Klasse 7 Kapitel 1 (Zahlengerade, Thermometer, Kontoauszug, ±-Knopf), Staffel und Wörter nach der Niveaustufe der Klasse 6.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { mitVorzeichen } from '../src/schueler/zahlenbilder.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5), sieben = lies(7);
const index = L.indexiere(pool);
const neun = pool.kapitel[8];
const kap9 = pool.aufgaben.filter((a) => a.id.startsWith('6.9.'));
const meldungen = (aendere) => { const kopie = structuredClone(pool); aendere(kopie.aufgaben); return pruefePool(kopie, [fuenf]).fehler; };
const finde = (liste, id) => liste.find((a) => a.id === id);
const gemeldet = (id, aendere, was) => assert.ok(meldungen((l) => aendere(finde(l, id))).some((x) => x.startsWith(id)), `${id}: ${was} nicht gemeldet`);
const sichtbar = (a) => JSON.stringify([a.text, a.optionen?.map((o) => o.text), a.hilfen]);
const erste = (f) => kap9.find(f);

test('Kapitel 9 hat 6 Meilensteine mit je 2 Lernzielen, 9.5 und 9.6 nur auf E, zusammen 288 Aufgaben', () => {
  assert.equal(neun.titel, 'Rationale Zahlen');
  assert.deepEqual(neun.unterkapitel.map((x) => x.id), ['6.9.1', '6.9.2', '6.9.3', '6.9.4', '6.9.5', '6.9.6']);
  assert.equal(kap9.length, 288);
  for (const x of neun.unterkapitel) {
    const nurE = ['6.9.5', '6.9.6'].includes(x.id);
    assert.equal(x.lernziele.length, 2, x.id);
    assert.equal(x.ab, nurE ? 'E' : undefined, x.id);
    for (const l of x.lernziele) {
      assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), nurE ? [0, 0, 0, 24] : [6, 6, 6, 6], l.id);
      assert.ok(l.merkzettel?.regel && l.grundlage, l.id);
    }
  }
});

test('Wörter nach Stufe: Betrag und Zahlbereiche nur auf E, rationale Zahl ab M, keine Potenzen und keine Fragen', () => {
  for (const a of kap9) {
    const t = sichtbar(a);
    if (a.niveau !== 'E') assert.doesNotMatch(t, /Betrag|\|[−\d]|[ℕℤℚ]/, a.id);
    if (['F', 'G'].includes(a.niveau)) assert.doesNotMatch(t, /rationale Zahl/, a.id);
    assert.doesNotMatch(t, /[²³⁴⁵⁶⁷⁸⁹]/, `${a.id}: Potenz`);
    assert.doesNotMatch(a.text.replace(/„[^“]*“/g, ''), /\?/, `${a.id}: Auftrag als Frage`);
  }
  assert.ok(kap9.some((a) => a.niveau === 'E' && /Betrag/.test(sichtbar(a))));
  assert.ok(kap9.some((a) => a.niveau === 'M' && /rationale Zahl/.test(sichtbar(a))));
});

test('Schreibweise: echtes Minus, eine negative Zahl nach einem Rechenzeichen steht in Klammern, kein Plus vor positiven Zahlen', () => {
  for (const a of kap9) {
    const t = [a.text, ...(a.optionen ?? []).map((o) => o.text)].join('\n');
    assert.doesNotMatch(t, /(^|[\s(=])-\d/, `${a.id}: Bindestrich als Minus`);
    assert.doesNotMatch(t, /[\d)] [+−·:] −\d/, `${a.id}: negative Zahl ohne Klammer`);
    assert.doesNotMatch(t, /\(\+\d/, `${a.id}: Plus vor positiver Zahl`);
  }
});

test('Staffel: F ganze Zahlen bis 20 und immer ein Bild, G bis 100', () => {
  const zahlen = (a) => (a.text.match(/−?\d+(?:,\d+)?/g) ?? []).map((z) => Math.abs(parseFloat(z.replace('−', '-').replace(',', '.'))));
  for (const a of kap9.filter((x) => x.niveau === 'F')) {
    assert.ok(a.bild || a.strahl || a.daten || a.tabelle, `${a.id}: F ohne Bild`);
    assert.doesNotMatch(a.text, /\d,\d|⁄/, `${a.id}: F nur ganze Zahlen`);
  }
  for (const a of kap9.filter((x) => x.niveau === 'G' && !x.daten && !/€/.test(x.text))) for (const z of zahlen(a)) assert.ok(z <= 100, `${a.id}: ${z} zu groß für G`);
});

test('Der ±-Knopf gilt für Kapitel 9; ein getipptes Plus und der Bindestrich zählen', () => {
  assert.ok(kap9.every(mitVorzeichen));
  const neg = erste((a) => a.format === 'zahl' && typeof a.loesung === 'number' && a.loesung < 0);
  assert.equal(L.pruefeAntwort(neg, `-${-neg.loesung}`).richtig, true, neg.id);
  assert.equal(L.pruefeAntwort(neg, `−${-neg.loesung}`).richtig, true, neg.id);
  assert.equal(L.pruefeAntwort(neg, String(-neg.loesung)).richtig, false, neg.id);
  const pos = erste((a) => a.format === 'zahl' && typeof a.loesung === 'number' && a.loesung > 0);
  assert.equal(L.pruefeAntwort(pos, `+${pos.loesung}`).richtig, true, pos.id);
});

test('Klasse 7 Kapitel 1 baut auf Kapitel 9 auf und zeigt dessen Aufgaben als Brücken', () => {
  const lz = new Map(sieben.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l]));
  assert.ok(lz.get('7.1.1-Z1').voraussetzungen.includes('6.9.1-N2'));
  assert.ok(lz.get('7.1.1-Z2').voraussetzungen.includes('6.9.2-R2'));
  assert.ok(lz.get('7.1.2-V1').voraussetzungen.includes('6.9.3-V1'));
  assert.ok(lz.get('7.1.2-V2').voraussetzungen.includes('6.9.3-V2'));
  assert.ok(sieben.vorstufe.aufgaben.some((a) => a.id.startsWith('6.9.')), 'Brückenaufgaben aus 6.9 fehlen');
});

test('Der Prüfer meldet falsche Ergebnisse, den Betrag auf M, fehlende Klammern und zu viele Stellen auf G', () => {
  const r = erste((a) => a.niveau === 'E' && a.format === 'zahl' && /^Berechne /.test(a.text) && typeof a.loesung === 'number');
  gemeldet(r.id, (a) => { a.loesung += 1; }, 'falsches Ergebnis');
  const m = erste((a) => a.niveau === 'M' && a.format === 'zahl');
  gemeldet(m.id, (a) => { a.text = `${a.text}\nDer Betrag hilft.`; }, 'Betrag auf M');
  const k = erste((a) => /[+−] \(−\d/.test(a.text));
  gemeldet(k.id, (a) => { a.text = a.text.replace(/([+−]) \((−\d+(?:,\d+)?)\)/, '$1 $2'); }, 'negative Zahl ohne Klammer');
  const g = erste((a) => a.niveau === 'G' && /\d,\d/.test(a.text));
  gemeldet(g.id, (a) => { a.text = a.text.replace(/(\d,\d)/, '$1234'); }, 'vier Stellen auf G');
});
