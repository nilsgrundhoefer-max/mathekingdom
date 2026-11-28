// Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058): 5 Meilensteine, der letzte als Niveau-Meilenstein ab M.
// Streifen färben, Datensatz erfinden, Kreis- und Streifendiagramm, und ein Prüfer, der jede Aufgabe nachrechnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefeStreifenFaerben, pruefeDatensatz, zentralwert, mittelwert, spannweite } from '../src/schueler/daten.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const acht = pool.kapitel[7];
const kap8 = pool.aufgaben.filter((a) => a.id.startsWith('6.8.'));
const meldungen = (aendere) => { const kopie = structuredClone(pool); aendere(kopie.aufgaben); return pruefePool(kopie, [fuenf]).fehler; };
const finde = (liste, id) => liste.find((a) => a.id === id);
const gemeldet = (id, aendere, was) => assert.ok(meldungen((l) => aendere(finde(l, id))).some((x) => x.startsWith(id)), `${id}: ${was} nicht gemeldet`);
const sichtbar = (a) => JSON.stringify([a.text, a.optionen?.map((o) => o.text), a.hilfen]);
const erste = (f) => kap8.find(f);

test('Kapitel 8 hat 5 Meilensteine mit je 2 Lernzielen, 8.6 als Niveau-Meilenstein ab M, zusammen 240 Aufgaben', () => {
  assert.equal(acht.titel, 'Daten auswerten und darstellen');
  assert.deepEqual(acht.unterkapitel.map((x) => x.id), ['6.8.1', '6.8.2', '6.8.4', '6.8.5', '6.8.6']);
  assert.equal(kap8.length, 240);
  for (const x of acht.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    assert.equal(x.ab, x.id === '6.8.6' ? 'M' : undefined, x.id);
    for (const l of x.lernziele) assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), x.id === '6.8.6' ? [0, 0, 12, 12] : [6, 6, 6, 6], l.id);
  }
});

test('Wörter nach Stufe: kein Median, Durchschnitt oder Tortendiagramm; Ausreißer nur auf E; Stichprobe und relative Häufigkeit ab G', () => {
  for (const a of kap8) {
    const t = sichtbar(a);
    assert.doesNotMatch(t, /Median|Durchschnitt|Tortendiagramm|Kuchendiagramm|arithmetische/, a.id);
    if (a.niveau !== 'E') assert.doesNotMatch(t, /Ausreißer/, a.id);
    if (a.niveau === 'F') assert.doesNotMatch(t, /Stichprobe|relative Häufigkeit|absolute Häufigkeit|Ausschnitt/, a.id);
    assert.doesNotMatch(a.text.replace(/„[^“]*“/g, ''), /\?/, `${a.id}: Auftrag als Frage`);
  }
  assert.ok(kap8.some((a) => a.niveau === 'E' && /Ausreißer/.test(sichtbar(a))));
});

test('Kreisdiagramme ergeben 360°, Streifendiagramme sind 10 oder 20 cm lang, auf F mit vollen Zentimetern', () => {
  const kreise = kap8.filter((a) => a.bild?.art === 'kreisdiagramm'), streifen = kap8.filter((a) => a.bild?.art === 'streifendiagramm');
  assert.ok(kreise.length >= 20 && streifen.length >= 20);
  for (const a of kreise) assert.equal(a.bild.teile.reduce((s, t) => s + t.winkel, 0), 360, a.id);
  for (const a of streifen) {
    assert.ok([10, 20].includes(a.bild.laenge), a.id);
    assert.equal(a.bild.teile.reduce((s, t) => s + t.mm, 0), a.bild.laenge * 10, a.id);
    if (a.niveau === 'F') assert.ok(a.bild.teile.every((t) => t.mm % 10 === 0), a.id);
  }
});

test('Streifen färben: Nur die Anzahl je Farbe zählt, nicht wo die Kästchen liegen; der typische Fehler wird erkannt', () => {
  const a = erste((x) => x.format === 'streifenfaerben');
  const l = a.farben.map((f) => f.loesung);
  const vorn = l.flatMap((k, i) => Array(k).fill(i)), hinten = [...vorn].reverse();
  assert.deepEqual(pruefeStreifenFaerben(a, vorn.join(',')), { richtig: true, fehlvorstellung: null });
  assert.equal(pruefeStreifenFaerben(a, hinten.join(',')).richtig, true);
  const f = a.typischeFehler[0], falsch = f.werte.flatMap((k, i) => Array(k).fill(i));
  while (falsch.length < 20) falsch.push('-');
  assert.deepEqual(pruefeStreifenFaerben(a, falsch.join(',')), { richtig: false, fehlvorstellung: f.fehlvorstellung });
  assert.equal(pruefeStreifenFaerben(a, '').richtig, false);
  assert.equal(L.pruefeAntwort(a, vorn.join(',')).richtig, true);
});

test('Datensatz erfinden: Jede Reihe mit den verlangten Kenngrößen ist richtig; Spannweite als größter Wert wird erkannt', () => {
  const a = { luecken: { a: {}, b: {}, c: {}, d: {}, e: {} }, datensatz: { anzahl: 5, von: 0, bis: 50, mittelwert: 7, spannweite: 6 } };
  const ein = (l) => Object.fromEntries('abcde'.split('').map((n, i) => [n, String(l[i])]));
  assert.equal(pruefeDatensatz(a, ein([4, 7, 7, 7, 10])).richtig, true);
  assert.equal(pruefeDatensatz(a, ein([10, 4, 7, 8, 6])).richtig, true);
  assert.equal(pruefeDatensatz(a, ein([4, 7, 7, 7, 11])).richtig, false);
  assert.equal(pruefeDatensatz(a, ein([4, 7, 7, 7, ''])).richtig, false);
  assert.equal(pruefeDatensatz({ ...a, datensatz: { anzahl: 5, von: 0, bis: 50, spannweite: 9 } }, ein([1, 2, 3, 4, 9])).fehlvorstellung, 'spannweite-groesster-wert');
  assert.equal(zentralwert([5, 1, 9, 3]), 4);
  assert.equal(mittelwert([2, 3, 4, 5, 11]), 5);
  assert.equal(spannweite([4, 9, 2, 7]), 7);
  for (const x of kap8.filter((y) => y.datensatz)) {
    assert.equal(x.niveau, 'E', x.id);
    assert.equal(L.pruefeAntwort(x, Object.fromEntries(Object.entries(x.luecken).map(([n, l]) => [n, String(l.loesung)]))).richtig, true, x.id);
  }
});

test('Heftaufgaben nur auf M und E, davon 4 beim Kreisdiagramm zeichnen', () => {
  const heft = kap8.filter((a) => a.heftaufgabe);
  assert.equal(heft.length, 8);
  assert.ok(heft.every((a) => ['M', 'E'].includes(a.niveau)));
  assert.equal(heft.filter((a) => a.lernziel === '6.8.6-D2').length, 4);
});

test('Der Prüfer meldet falsche Kenngrößen, falsche Winkel, Streifen ohne 20 Kästchen und verbotene Wörter', () => {
  const k = erste((a) => a.nachweis?.some((n) => n?.art === 'kenngroesse' && !n.zwischen && !n.beispiel && a.format === 'zahl'));
  gemeldet(k.id, (a) => { a.loesung = typeof a.loesung === 'number' ? a.loesung + 1 : '99,9'; }, 'falsche Kenngröße');
  const w = erste((a) => a.bild?.art === 'kreisdiagramm');
  gemeldet(w.id, (a) => { a.bild.teile[0].winkel += 10; }, 'Kreis ohne 360°');
  const s = erste((a) => a.format === 'streifenfaerben');
  gemeldet(s.id, (a) => { a.farben[0].loesung += 1; }, 'Streifen mit 21 Kästchen');
  gemeldet(s.id, (a) => { a.niveau = 'G'; }, 'Streifen färben auf G');
  const m = erste((a) => a.niveau === 'M' && a.format === 'zahl');
  gemeldet(m.id, (a) => { a.text = `${a.text}\nDer Median hilft.`; }, 'Median');
  const t = erste((a) => a.format === 'tabelle' && a.lernziel === '6.8.6-D2');
  gemeldet(t.id, (a) => { const n = Object.keys(a.luecken)[0]; a.luecken[n].loesung += 1; }, 'falscher Winkel in der Tabelle');
  const d = erste((a) => a.datensatz);
  gemeldet(d.id, (a) => { a.luecken.a.loesung += 1; }, 'Beispiel erfüllt die Bedingung nicht');
});
