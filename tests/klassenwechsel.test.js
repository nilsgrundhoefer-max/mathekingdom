// Klassenwechsel, Schuljahreswechsel und Wiederholung (Version 0.62, ADR 0054).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as SCH from '../src/gemeinsam/schule.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const T = '2027-03-01T09:00:00Z';
const ok = { geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 };
// Ein Speicherstand mit Siegeln in Klasse 5 und einer Bearbeitung aus Klasse 6 (Brücke oder Abstecher spielt keine Rolle).
function standMitSiegeln() {
  const stand = L.neuerSpeicherstand('5A-K4M2', '5a', '2026-09-01T08:00:00Z');
  const lz = index.lernzielMitAufgaben.values().next().value;
  for (const a of [...index.nach.get(`${lz}|M`)].sort((x, y) => y.afb - x.afb).slice(0, 3)) L.verbuche(stand, a, ok, 'M', T, index);
  stand.versuche.push({ t: T, aufgabe: '6.1.1-A1-G-01', lernziel: '6.1.1-A1', niveau: 'G', richtig: true, muenzen: 10 });
  stand.niveau['5.1'] = 'M'; stand.niveauMarke['5.1'] = 2;
  stand.niveau['6.1'] = 'G'; stand.niveauMarke['6.1'] = 3;
  (stand.grundlage ??= {})['6.1.1-A1'] = { aktiv: true, ab: 3, mal: 1, t: T };
  stand.muenzen = 77;
  return { stand, lz };
}

test('Vorschlag zum neuen Schuljahr: eine Stufe höher, nach Klasse 10 niemand', () => {
  assert.equal(SCH.vorschlagNeuesJahr('5a'), '6a');
  assert.equal(SCH.vorschlagNeuesJahr('9c'), '10c');
  assert.equal(SCH.vorschlagNeuesJahr('10b'), '');
});

test('Wiederholung: im Schuljahr nur nach unten, beim Schuljahreswechsel auch in derselben Stufe', () => {
  assert.equal(SCH.wiederholteStufe('5a', '5b'), null);
  assert.equal(SCH.wiederholteStufe('6a', '5b'), 5);
  assert.equal(SCH.wiederholteStufe('5a', '6a', true), null);
  assert.equal(SCH.wiederholteStufe('5a', '5a', true), 5);
  assert.equal(SCH.wiederholteStufe('7a', '6c', true), 6);
});

test('Archiv: Siegel, Kronenwahl und Bearbeitungen der Stufe ins Archiv, Rang, Münzen und Wappen bleiben', () => {
  const { stand, lz } = standMitSiegeln();
  assert.equal(L.siegel(stand), 1);
  const rangVorher = L.rang(L.rangSiegel(stand)).stufe;
  const archiv = L.archiviereStufe(stand, 5, T, { schuljahr: '2026-27', klasse: '5a' });
  assert.equal(archiv.siegel, 1);
  assert.equal(archiv.versuche.length, 3);
  assert.ok(archiv.lernziele[lz]);
  assert.equal(L.siegel(stand), 0);
  assert.equal(L.rangSiegel(stand), 1, 'der Rang sinkt nie');
  assert.equal(L.rang(L.rangSiegel(stand)).stufe, rangVorher);
  assert.equal(stand.muenzen, 77);
  assert.deepEqual(stand.versuche.map((v) => v.lernziel), ['6.1.1-A1']);
  assert.equal(stand.niveau['5.1'], undefined);
  assert.equal(stand.niveau['6.1'], 'G');
  // Stellen im Versuchsprotokoll der anderen Stufe rücken nach.
  assert.equal(stand.niveauMarke['6.1'], 0);
  assert.equal(stand.grundlage['6.1.1-A1'].ab, 0);
  assert.equal(L.archivDerStufe(stand, 5).length, 1);
});

test('Nach der Wiederholung zählt nur Neues: dasselbe Lernziel gibt wieder ein Siegel', () => {
  const { stand, lz } = standMitSiegeln();
  L.archiviereStufe(stand, 5, T);
  const r = [...index.nach.get(`${lz}|M`)].sort((x, y) => y.afb - x.afb).slice(0, 3).map((a) => L.verbuche(stand, a, ok, 'M', '2027-09-01T09:00:00Z', index));
  assert.ok(r.some((x) => x.neuesLernziel));
  assert.equal(L.siegel(stand), 1);
  assert.equal(L.rangSiegel(stand), 1);
});

test('Übernahme mit Wiederholung archiviert im kopierten Stand, das Original bleibt', () => {
  const { stand } = standMitSiegeln();
  const neu = SCH.uebernimmStand(stand, '5B-K4M2', '5b', '2027-08-20T08:00:00Z', { wiederholung: 5, schuljahr: '2026-27' });
  assert.equal(neu.code, '5B-K4M2');
  assert.equal(L.siegel(neu), 0);
  assert.equal(neu.archiv[0].klasse, '5a');
  assert.equal(neu.archiv[0].schuljahr, '2026-27');
  assert.equal(L.siegel(stand), 1);
  assert.equal(SCH.uebernimmStand(stand, '6A-K4M2', '6a', T).archiv, undefined);
});

test('Klassenwechsel in den Klassendaten: Name, PIN, Zielniveau, Notiz und Münzgaben ziehen mit, der Rest verfällt', () => {
  const quelle = SCH.neueKlassendaten(), ziel = SCH.neueKlassendaten();
  quelle.namen = { '5A-K4M2': 'Lena', '5A-ZZZZ': 'Tim' };
  quelle.pins = { '5A-K4M2': { pin: '1234', salz: 's', wert: 'w' } };
  quelle.notizen = { '5A-K4M2': 'braucht Ruhe' };
  Object.assign(quelle.einst, { zielniveaus: { '5A-K4M2': 'E' }, nachrichten: { '5A-K4M2': { text: 'Hallo' } }, sonderauftraege: { '5A-K4M2': { id: 1 } },
    muenzgaben: { '5A-K4M2': [{ id: 'g', muenzen: 50 }] }, sperren: { '5.1.1': ['5A-K4M2', '5A-ZZZZ'], '5.1.2': ['5A-K4M2'] } });
  SCH.zieheUm(quelle, ziel, '5A-K4M2', '5B-K4M2');
  assert.equal(ziel.namen['5B-K4M2'], 'Lena');
  assert.equal(ziel.pins['5B-K4M2'].pin, '1234');
  assert.equal(ziel.einst.zielniveaus['5B-K4M2'], 'E');
  assert.equal(ziel.notizen['5B-K4M2'], 'braucht Ruhe');
  assert.equal(ziel.einst.muenzgaben['5B-K4M2'][0].muenzen, 50);
  assert.equal(ziel.einst.nachrichten['5B-K4M2'], undefined);
  assert.deepEqual(Object.keys(quelle.namen), ['5A-ZZZZ']);
  assert.equal(quelle.pins['5A-K4M2'], undefined);
  assert.equal(quelle.einst.sonderauftraege['5A-K4M2'], undefined);
  assert.deepEqual(quelle.einst.sperren, { '5.1.1': ['5A-ZZZZ'] });
});

test('Alter Code findet den neuen über den hinteren Teil', () => {
  assert.deepEqual(SCH.neuerCodeZu('5A-K4M2', { '6a': ['6A-AAAA'], '6b': ['6B-K4M2'] }), { klasse: '6b', code: '6B-K4M2' });
  assert.equal(SCH.neuerCodeZu('5A-K4M2', { '6a': ['6A-AAAA'] }), null);
});
