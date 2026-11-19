// Münzgabe des Administrators und einstellbare Belohnung des Sonderauftrags (ADR 0027).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';
import * as SCH from '../src/gemeinsam/schule.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';
const neu = () => L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
const gabe = (id, muenzen, extra = {}) => ({ id, t: id, muenzen, ...extra });

test('Münzgabe: kommt nur beim eigenen Code an, nur feste Stufen', () => {
  const k = { codes: [CODE], muenzgaben: { [CODE]: [gabe('a', 500, { satz: 'Toll!' }), gabe('b', 123), gabe('c', 5000)] } };
  const e = L.einstellungen(k, CODE, pool);
  assert.deepEqual(e.muenzgaben.map((g) => g.muenzen), [500, 5000]);
  assert.equal(e.muenzgaben[0].satz, 'Toll!');
  assert.deepEqual(L.einstellungen(k, '5A-ZZZZ', pool).muenzgaben, []);
  assert.deepEqual(L.einstellungen({}, CODE, pool).muenzgaben, []);
});

test('Münzgabe: Gutschrift beim Öffnen, genau einmal, älteste zuerst', () => {
  const stand = neu();
  const gaben = L.gueltigeMuenzgaben([gabe('2026-11-19T12:00:00Z', 100), gabe('2026-11-19T11:00:00Z', 250)]);
  const offen = L.offeneMuenzgaben(stand, gaben);
  assert.equal(offen[0].muenzen, 250);
  assert.equal(L.oeffneMuenzgabe(stand, offen[0], '2026-11-19T12:30:00Z'), 250);
  assert.equal(L.oeffneMuenzgabe(stand, offen[0], '2026-11-19T12:31:00Z'), 0);
  assert.equal(stand.muenzen, 250);
  assert.equal(L.offeneMuenzgaben(stand, gaben).length, 1);
  L.oeffneMuenzgabe(stand, L.offeneMuenzgaben(stand, gaben)[0], '2026-11-19T12:32:00Z');
  assert.equal(stand.muenzen, 350);
  assert.equal(L.offeneMuenzgaben(stand, gaben).length, 0);
});

test('Münzgabe: Zurückziehen nimmt nichts weg, die Lehrkraft sieht geöffnete auch danach', () => {
  const stand = neu();
  const [g] = L.gueltigeMuenzgaben([gabe('x', 1000)]);
  L.oeffneMuenzgabe(stand, g, '2026-11-19T13:00:00Z');
  assert.equal(stand.muenzen, 1000);
  assert.deepEqual(L.offeneMuenzgaben(stand, []), []);
  assert.equal(stand.muenzen, 1000);
  const liste = A.muenzgabenStand(stand, L.gueltigeMuenzgaben([gabe('y', 50)]));
  assert.equal(liste.length, 2);
  assert.equal(liste.find((x) => x.id === 'x').geoeffnet, '2026-11-19T13:00:00Z');
  assert.equal(liste.find((x) => x.id === 'y').geoeffnet, null);
});

test('Klassendatei trägt die Münzgaben', () => {
  const k = SCH.neueKlassendaten();
  k.namen[CODE] = 'Lena';
  k.einst.muenzgaben[CODE] = [gabe('z', 100)];
  assert.deepEqual(SCH.klassendateiInhalt('5a', k, 't').muenzgaben, { [CODE]: [gabe('z', 100)] });
});

test('Sonderauftrag: Belohnung aus dem Auftrag, sonst 100', () => {
  assert.equal(L.sonderauftragBelohnung(250), 250);
  assert.equal(L.sonderauftragBelohnung(undefined), 100);
  assert.equal(L.sonderauftragBelohnung(777), 100);
  const LZ = '5.3.3-S2';
  const ids = index.nach.get(`${LZ}|G`).slice(0, 3).map((a) => a.id);
  for (const [belohnung, erwartet] of [[500, 500], [undefined, 100]]) {
    const stand = neu();
    const sa = L.einstellungen({ codes: [CODE], sonderauftraege: { [CODE]: { id: 's', t: 's', lernziel: LZ, niveau: 'G', aufgaben: ids, belohnung } } }, CODE, pool).sonderauftrag;
    assert.equal(sa.belohnung, erwartet);
    L.oeffneSonderauftrag(stand, sa, null, 't');
    let r;
    for (const id of ids) r = L.trageSonderauftragEin(stand, sa, index.aufgabe.get(id), true, 't');
    assert.equal(r.bonus, erwartet);
    assert.equal(stand.muenzen, erwartet);
    assert.equal(stand.sonderauftraege[0].bonus, erwartet);
  }
});

test('Prüfung des Speicherstands: Münzgaben und Sonderauftrag-Belohnungen zählen als verdient', () => {
  const stand = neu();
  L.oeffneMuenzgabe(stand, L.gueltigeMuenzgaben([gabe('g', 500)])[0], 't');
  (stand.sonderauftraege ??= []).push({ id: 's', bonus: 250 }); stand.muenzen += 250;
  assert.equal(A.pruefeStand(stand, 'M').filter((m) => /Münzen/.test(m)).length, 0);
  stand.muenzen += 1;
  assert.equal(A.pruefeStand(stand, 'M').filter((m) => /Münzen/.test(m)).length, 1);
});
