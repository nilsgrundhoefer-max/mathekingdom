// Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048): 5 Meilensteine mit je 2 Lernzielen, Rechenraster mit Kommaspalte,
// Kommafeld beim Multiplizieren, Überschlag mit mehreren richtigen Werten, Division mit Dezimalzahl im Dividenden, Geld mit zwei Stellen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const fuenfK = pool.kapitel[4];
const kap5 = pool.aufgaben.filter((a) => a.id.startsWith('6.5.'));
const RICHTIG = { richtig: true, fehlvorstellung: null };
const meldungen = (aendere) => {
  const kopie = structuredClone(pool);
  aendere(kopie.aufgaben);
  return pruefePool(kopie, [fuenf]).fehler;
};
const finde = (liste, id) => liste.find((a) => a.id === id);
const loesungen = (a) => Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]));

test('Kapitel 5 hat 5 Meilensteine mit je 2 Lernzielen und 24 Aufgaben je Lernziel, zusammen 240 Aufgaben', () => {
  assert.equal(fuenfK.titel, 'Rechnen mit Dezimalzahlen');
  assert.deepEqual(fuenfK.unterkapitel.map((x) => x.id), ['6.5.1', '6.5.2', '6.5.3', '6.5.4', '6.5.5']);
  assert.equal(kap5.length, 240);
  for (const x of fuenfK.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    assert.equal(L.istNiveauAbstecher(x, 'F'), false, x.id);
    for (const l of x.lernziele) assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), [6, 6, 6, 6], l.id);
  }
});

test('Heftaufgaben gibt es nur beim schriftlichen Rechnen ab M, auf F und G rechnen die Kinder im Raster', () => {
  const heft = kap5.filter((a) => a.heftaufgabe);
  assert.ok(heft.length >= 12, `nur ${heft.length} Heftaufgaben`);
  const schriftlich = ['6.5.1-A2', '6.5.3-M1', '6.5.3-M2', '6.5.4-D1', '6.5.4-D2'];
  for (const a of heft) {
    assert.ok(schriftlich.includes(a.lernziel), a.id);
    assert.ok(['M', 'E'].includes(a.niveau), a.id);
  }
  for (const lz of schriftlich) assert.ok(heft.some((a) => a.lernziel === lz), `${lz} ohne Heftaufgabe`);
  const raster = kap5.filter((a) => a.tabelle?.art === 'raster');
  assert.ok(raster.length >= 12);
  for (const a of raster) assert.ok(['F', 'G'].includes(a.niveau), a.id);
});

test('Rechenraster mit Kommaspalte: F zeigt Endnullen grau, G trägt sie in Notizfelder ein, die nicht bewertet werden', () => {
  const komma = kap5.filter((a) => a.tabelle?.art === 'raster' && a.tabelle.komma != null);
  const f = komma.find((a) => a.niveau === 'F' && a.tabelle.zeilen.flat().some((z) => z?.endnull));
  const g = komma.find((a) => a.niveau === 'G' && a.tabelle.zeilen.flat().some((z) => z?.notiz));
  assert.ok(f, 'F-Raster mit grauer Endnull fehlt');
  assert.ok(g, 'G-Raster mit Notizfeld fehlt');
  for (const a of [f, g]) {
    assert.equal(a.tabelle.kopf[a.tabelle.komma], ',');
    assert.deepEqual(L.pruefeAntwort(a, loesungen(a)), RICHTIG, a.id);
  }
  assert.ok(meldungen((l) => { finde(l, f.id).tabelle.rechnung.ergebnis = '0,1'; }).some((x) => x.startsWith(f.id)), 'falsches Rasterergebnis nicht gemeldet');
});

test('Malnehmen im Raster: ohne Komma rechnen, dann das Komma im eigenen Feld setzen', () => {
  const a = kap5.find((x) => x.lernziel === '6.5.3-M2' && x.tabelle?.ablesen);
  assert.ok(a, 'Raster mit Kommafeld fehlt');
  assert.equal(a.tabelle.ablesen.luecke, 'k');
  assert.match(String(a.luecken.k.loesung), /,/);
  assert.deepEqual(L.pruefeAntwort(a, loesungen(a)), RICHTIG);
  const falsch = a.luecken.k.typischeFehler.find((t) => t.fehlvorstellung === 'mal-komma-wie-plus');
  if (falsch) assert.equal(L.pruefeAntwort(a, { ...loesungen(a), k: String(falsch.wert) }).fehlvorstellung, 'mal-komma-wie-plus');
  assert.ok(meldungen((l) => { finde(l, a.id).luecken.k.loesung = '9,99'; }).some((x) => x.startsWith(a.id)), 'falsches Komma nicht gemeldet');
});

test('Überschlag auf M: Jeder Wert aus sinnvoll gerundeten Zahlen zählt, das genaue Ergebnis nicht', () => {
  const mit = kap5.filter((a) => a.format === 'luecken' && a.luecken.u?.auch);
  assert.ok(mit.length >= 2, 'Überschlag mit weiteren Werten fehlt');
  for (const a of mit) {
    for (const w of [a.luecken.u.loesung, ...a.luecken.u.auch]) assert.deepEqual(L.pruefeAntwort(a, { ...loesungen(a), u: String(w) }), RICHTIG, `${a.id} ${w}`);
    assert.equal(L.pruefeAntwort(a, { ...loesungen(a), u: String(a.luecken.e.loesung) }).fehlvorstellung, 'ueberschlag-nicht-gerundet', a.id);
  }
  const a = mit[0];
  assert.ok(meldungen((l) => { finde(l, a.id).luecken.u.auch = ['12345']; }).some((x) => x.startsWith(a.id)), 'erfundener Überschlag nicht gemeldet');
});

test('Geld: 4,5 € zählt wie 4,50 €', () => {
  const geld = kap5.filter((a) => a.format === 'zahl' && a.einheit === '€' && /,\d0$/.test(a.loesung));
  assert.ok(geld.length >= 3);
  for (const a of geld) {
    assert.deepEqual(L.pruefeAntwort(a, a.loesung), RICHTIG, a.id);
    assert.deepEqual(L.pruefeAntwort(a, a.loesung.replace(/0$/, '').replace(/,$/, '')), RICHTIG, a.id);
  }
});

test('Division durch eine Dezimalzahl: Das Lösungsbild nennt die Aufgabe vor dem Verschieben, der Prüfer rechnet sie nach', () => {
  const a = kap5.find((x) => x.division?.vorher);
  assert.ok(a, 'Division mit verschobenem Komma fehlt');
  assert.ok(a.text.includes(a.division.vorher));
  assert.ok(meldungen((l) => { finde(l, a.id).division.vorher = '1,1 : 0,7'; }).some((x) => x.startsWith(a.id)), 'falsches vorher nicht gemeldet');
  const d = kap5.find((x) => x.division && typeof x.division.dividend === 'string');
  assert.ok(d, 'Division mit Dezimalzahl im Dividenden fehlt');
  assert.ok(meldungen((l) => { finde(l, d.id).division.divisor += 1; }).some((x) => x.startsWith(d.id)));
});

test('Verschiebepfeile in der Stellenwerttafel passen zur Rechnung im Text', () => {
  const a = kap5.find((x) => x.bild?.art === 'tafel' && x.bild.schieben);
  assert.ok(a, 'Tafel mit Verschiebepfeilen fehlt');
  assert.ok(meldungen((l) => { const s = finde(l, a.id).bild.schieben; s.richtung = s.richtung === 'links' ? 'rechts' : 'links'; }).some((x) => x.startsWith(a.id)), 'falsche Richtung nicht gemeldet');
});

test('Zehntel mal Zehntel im Hunderterfeld: hell der erste Faktor, kräftig der Teil davon', () => {
  const a = kap5.find((x) => x.bild?.art === 'bruch' && x.bild.figuren[0].form === 'hundert' && x.bild.figuren[0].hell);
  assert.ok(a, 'Hunderterfeld mit hellen Feldern fehlt');
  const f = a.bild.figuren[0], [, x, y] = a.text.match(/0,(\d) · 0,(\d)/).map(Number);
  assert.equal(f.hell.length + f.gefaerbt.length, 10 * x);
  assert.equal(f.gefaerbt.length, x * y);
});

test('Die neuen Fehlvorstellungen haben eine Beschreibung und eine Rückmeldung', async () => {
  const { fehlvorstellungen } = await import('../tools/werkzeug.mjs');
  for (const k of ['komma-nicht-untereinander', 'mal-komma-wie-plus', 'stufe-null-angehaengt', 'komma-falsche-richtung', 'div-ein-komma-verschoben', 'div-komma-vergessen', 'endnull-nicht-ergaenzt', 'div-macht-kleiner']) {
    assert.ok(fehlvorstellungen[k], k);
    assert.ok(kap5.some((a) => JSON.stringify(a).includes(`"${k}"`)), `${k} kommt in keiner Aufgabe vor`);
  }
});
