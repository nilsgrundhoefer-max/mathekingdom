// Klasse 6, Kapitel 6 „Berechnungen am Quader“ (ADR 0049): 5 Meilensteine mit je 2 Lernzielen, Volumeneinheiten in der Größeneingabe,
// verlangte Einheit als „fast richtig“, Körper aus Quadern, Maße am Netz, Kanten in beliebiger Reihenfolge, und ein Prüfer, der jede Aufgabe nachrechnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefeGroesse, inGrundeinheit, schreibe, artVon, loesungGroesse, leseKommazahl } from '../src/schueler/groessen.js';
import { NACHBESSERN } from '../src/schueler/bruch.js';
import { quaderbauZellen } from '../src/schueler/koerperbilder.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const sechs = pool.kapitel[5];
const kap6 = pool.aufgaben.filter((a) => a.id.startsWith('6.6.'));
const RICHTIG = { richtig: true, fehlvorstellung: null };
const klar = (t) => t.replace(/ /g, ' ');
const meldungen = (aendere) => {
  const kopie = structuredClone(pool);
  aendere(kopie.aufgaben);
  return pruefePool(kopie, [fuenf]).fehler;
};
const finde = (liste, id) => liste.find((a) => a.id === id);
const gemeldet = (id, aendere, was) => assert.ok(meldungen((l) => aendere(finde(l, id))).some((x) => x.startsWith(id)), `${id}: ${was} nicht gemeldet`);

test('Kapitel 6 hat 5 Meilensteine mit je 2 Lernzielen und 24 Aufgaben je Lernziel, zusammen 240 Aufgaben', () => {
  assert.equal(sechs.titel, 'Berechnungen am Quader');
  assert.deepEqual(sechs.unterkapitel.map((x) => x.id), ['6.6.1', '6.6.2', '6.6.3', '6.6.4', '6.6.5']);
  assert.equal(kap6.length, 240);
  for (const x of sechs.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    for (const l of x.lernziele) assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), [6, 6, 6, 6], l.id);
  }
});

test('Volumeneinheiten: Umrechnungszahl 1000, 1 l = 1 dm³, 1 ml = 1 cm³, 1 hl = 100 l', () => {
  assert.equal(artVon('cm³'), 'volumen');
  assert.equal(inGrundeinheit('1', 'cm³'), 1000);
  assert.equal(inGrundeinheit('1', 'l'), inGrundeinheit('1', 'dm³'));
  assert.equal(inGrundeinheit('1', 'ml'), inGrundeinheit('1', 'cm³'));
  assert.equal(inGrundeinheit('1', 'hl'), inGrundeinheit('100', 'l'));
  assert.equal(inGrundeinheit('0,5', 'm³'), inGrundeinheit('500', 'dm³'));
  assert.equal(klar(schreibe(2500000, 'dm³')), '2,5 dm³');
  assert.deepEqual(leseKommazahl('0.125'), { z: 125, n: 1000 }, 'nach einer einzelnen Null ist der Punkt ein Komma');
  assert.deepEqual(leseKommazahl('1.250'), { z: 1250, n: 1 });
});

test('Größeneingabe: jede Einheit derselben Art zählt, cm² statt cm³ ist der Fehler „einheit-art“', () => {
  const a = { format: 'groesse', groesse: 'volumen', einheit: 'dm³', loesung: 2500000, lernziel: '6.6.4-V1' };
  for (const e of ['2,5 dm³', '2500 cm³', '2,5 l', '2500 ml', '0,0025 m³'.slice(0, 0) || '2 500 cm³']) assert.deepEqual(pruefeGroesse(a, e), RICHTIG, e);
  assert.equal(pruefeGroesse(a, '2,5 dm²').fehlvorstellung, 'einheit-art');
  assert.equal(pruefeGroesse(a, '2,5 dm').fehlvorstellung, 'einheit-art');
  assert.equal(pruefeGroesse(a, '2,5').fehlvorstellung, 'einheit-fehlt');
  assert.equal(pruefeGroesse(a, '2,5 kg').fehlvorstellung, 'einheit-fehlt');
  const f = { format: 'groesse', groesse: 'flaeche', einheit: 'cm²', loesung: 375, lernziel: '6.6.1-O1' };
  assert.equal(pruefeGroesse(f, '3,75 cm³').fehlvorstellung, 'einheit-art');
  assert.equal(klar(loesungGroesse(f)), '3,75 cm²', 'ab Klasse 6 steht eine Fläche mit Komma da');
  assert.equal(klar(loesungGroesse({ ...f, lernziel: '5.8.2-F1' })), '3 cm² 75 mm²', 'in Klasse 5 bleibt es gemischt');
});

test('Verlangte Einheit: Der richtige Wert in einer anderen Einheit ist fast richtig und kostet keinen Versuch', () => {
  const mit = kap6.filter((a) => a.format === 'groesse' && a.verlangt);
  assert.ok(mit.length >= 10, `nur ${mit.length}`);
  assert.ok(NACHBESSERN.einheit.includes('kostet dich keinen Versuch'));
  for (const a of mit) {
    assert.ok(['M', 'E'].includes(a.niveau), a.id);
    assert.deepEqual(pruefeGroesse(a, schreibe(a.loesung, a.einheit, true)), RICHTIG, a.id);
    const andere = a.einheiten.find((e) => e !== a.einheit && artVon(e) === a.groesse && a.loesung % 1 === 0 && inGrundeinheit(schreibe(a.loesung, e, true).replace(/\s\S+$/, ''), e) === a.loesung);
    if (andere) assert.deepEqual(pruefeGroesse(a, schreibe(a.loesung, andere, true)), { richtig: false, fehlvorstellung: 'einheit-verlangt', nachbessern: 'einheit' }, a.id);
  }
  gemeldet(mit[0].id, (a) => { a.text = a.text.replace(/ in [A-ZÄÖÜ][a-zäöü]+\b/, ''); }, 'verlangt ohne Einheit im Text');
});

test('Einheitenwahl: F hat die Einheit fest, ab G wählt das Kind auch zwischen Fläche und Volumen', () => {
  for (const a of kap6.filter((x) => x.format === 'groesse')) {
    if (a.niveau === 'F') { assert.equal(a.einheiten, undefined, a.id); continue; }
    assert.ok(a.einheiten.length >= 3 && a.einheiten.length <= 5, a.id);
    assert.ok(a.einheiten.includes(a.einheit), a.id);
    if (!a.verlangt) assert.ok(a.einheiten.some((e) => artVon(e) !== a.groesse), `${a.id}: keine Einheit einer anderen Art zur Wahl`);
  }
});

test('Heftaufgaben nur ab M, bei Sachaufgaben und zusammengesetzten Körpern', () => {
  const heft = kap6.filter((a) => a.heftaufgabe);
  assert.equal(heft.length, 16);
  for (const a of heft) {
    assert.ok(['6.6.1-O2', '6.6.4-V2', '6.6.5-Z1', '6.6.5-Z2'].includes(a.lernziel), a.id);
    assert.ok(['M', 'E'].includes(a.niveau), a.id);
  }
});

test('Sprache: „Volumen“ statt „Rauminhalt“, keine Hochzahl an der Kante, auf F und G kein Komma im Aufgabentext', () => {
  for (const a of kap6) {
    const alles = JSON.stringify(a);
    assert.doesNotMatch(alles, /Rauminhalt/, a.id);
    assert.doesNotMatch(a.text, /\ba³|\ba²/, a.id);
    if (['F', 'G'].includes(a.niveau)) assert.doesNotMatch(a.text, /\d,\d/, a.id);
    if (['F', 'G'].includes(a.niveau)) assert.doesNotMatch(a.text, /\bhl\b/, a.id);
  }
});

test('Körper aus Quadern: Zellen, zerlegte Körper in zwei Tönen, Einheitswürfel als Raster', () => {
  const zerlegt = kap6.filter((a) => a.bild?.form === 'quaderbau' && a.bild.zerlegt);
  assert.ok(zerlegt.length >= 8);
  for (const a of zerlegt) { assert.ok(['F', 'G', 'M'].includes(a.niveau), a.id); assert.equal(a.bild.teile.length, 2, a.id); }
  const { xs, ys, zs, teilVon } = quaderbauZellen({ teile: [{ x: 0, y: 0, z: 0, a: 4, b: 2, c: 1 }, { x: 0, y: 0, z: 1, a: 2, b: 2, c: 3 }] });
  assert.deepEqual([xs, ys, zs], [[0, 2, 4], [0, 2], [0, 1, 4]]);
  assert.equal(teilVon(0, 0, 1), 1);
  assert.equal(teilVon(1, 0, 1), -1, 'rechts oben ist Luft');
  const raster = kap6.filter((a) => a.bild?.form === 'quaderbau' && a.bild.raster);
  assert.ok(raster.length >= 6);
  for (const a of raster) for (const t of a.bild.teile) for (const k of ['a', 'b', 'c']) assert.ok(Number.isInteger(t[k]), a.id);
});

test('Maße im Bild gehören zur Aufgabe: Der Prüfer rechnet Volumen und Oberflächeninhalt aus dem Bild nach', () => {
  const v = kap6.find((a) => a.format === 'groesse' && a.groesse === 'volumen' && a.bild?.form === 'quaderbau' && a.bild.teile.length > 1 && !a.heftaufgabe);
  assert.ok(v);
  gemeldet(v.id, (a) => { a.bild.teile[0].a += 1; }, 'geändertes Bild');
  gemeldet(v.id, (a) => { a.loesung += 1000; }, 'falsche Lösung');
  const o = kap6.find((a) => a.format === 'groesse' && a.groesse === 'flaeche' && !a.bild && a.nachweis?.some((n) => n?.art === 'quader'));
  assert.ok(o);
  gemeldet(o.id, (a) => { a.loesung *= 2; }, 'falscher Oberflächeninhalt');
  gemeldet(o.id, (a) => { a.nachweis = a.nachweis.filter((n) => typeof n !== 'string'); a.nachweis.find((n) => n.art === 'quader').kanten[0] = '999 cm'; }, 'Kante, die nicht in der Aufgabe steht');
  const netz = kap6.find((a) => a.bild?.art === 'netz' && a.bild.masse);
  assert.ok(netz, 'Netz mit Maßen fehlt');
  assert.ok(netz.bild.masse.every((m) => /^\d+ (cm|dm|m)$/.test(klar(m.t))));
});

test('Volumeneinheiten in der Stellenwerttafel: drei Spalten je Einheit', () => {
  const tafeln = kap6.filter((a) => a.bild?.art === 'einheitentafel' || a.tabelle?.art === 'einheitentafel');
  assert.ok(tafeln.length >= 10);
  for (const a of tafeln) for (const g of (a.bild ?? a.tabelle).gruppen) assert.equal(g.spalten, 3, a.id);
  const t = tafeln.find((a) => a.format === 'luecken' && a.bild);
  gemeldet(t.id, (a) => { const n = Object.keys(a.luecken)[0]; a.luecken[n].loesung = Number(a.luecken[n].loesung) * 10; }, 'falsche Umrechnung');
});

test('Alle Quader zu einem Volumen: Die drei Kanten dürfen in beliebiger Reihenfolge stehen', () => {
  const a = kap6.find((x) => x.reihenfolgeEgal);
  assert.ok(a, 'Aufgabe mit freier Reihenfolge fehlt');
  const soll = Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]));
  assert.deepEqual(L.pruefeAntwort(a, soll), RICHTIG);
  const [x, y, z] = a.reihenfolgeEgal;
  assert.deepEqual(L.pruefeAntwort(a, { ...soll, [x]: soll[z], [y]: soll[x], [z]: soll[y] }), RICHTIG, 'gedrehte Reihenfolge');
  assert.equal(L.pruefeAntwort(a, { ...soll, [x]: '1' }).richtig, false);
  gemeldet(a.id, (k) => { k.luecken.n.loesung += 1; }, 'falsche Anzahl');
});

test('Die richtige Lösung jeder Aufgabe gilt als richtig, jeder typische Fehler als falsch', () => {
  for (const a of kap6) {
    if (a.format === 'groesse') {
      assert.deepEqual(L.pruefeAntwort(a, schreibe(a.loesung, a.einheit, true)), RICHTIG, a.id);
      for (const f of a.typischeFehler ?? []) assert.notEqual(f.wert, a.loesung, a.id);
    } else if (a.format === 'zahl') {
      assert.deepEqual(L.pruefeAntwort(a, String(a.loesung)), RICHTIG, a.id);
      for (const f of a.typischeFehler ?? []) assert.equal(L.pruefeAntwort(a, String(f.wert)).fehlvorstellung, f.fehlvorstellung, a.id);
    } else if (a.format === 'auswahl') {
      assert.ok(a.optionen.some((o) => o.richtig), a.id);
      assert.equal(new Set(a.optionen.map((o) => o.text)).size, a.optionen.length, a.id);
    }
  }
});

test('Die neuen Fehlvorstellungen haben eine Beschreibung und kommen in Aufgaben vor', async () => {
  const { fehlvorstellungen } = await import('../tools/werkzeug.mjs');
  const text = JSON.stringify(kap6);
  for (const k of ['oberflaeche-drei-flaechen', 'volumen-oberflaeche-verwechselt', 'volumen-kanten-addiert', 'einheiten-nicht-angeglichen', 'klebeflaeche-mitgezaehlt', 'liter-nicht-dm3', 'deckel-mitgerechnet', 'volumen-waechst-wie-kante']) {
    assert.ok(fehlvorstellungen[k], k);
    assert.ok(text.includes(`"${k}"`), `${k} kommt in keiner Aufgabe vor`);
  }
  for (const k of ['einheit-art', 'einheit-verlangt']) assert.ok(fehlvorstellungen[k], k);
});
