import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as SCH from '../src/gemeinsam/schule.js';
import { speicherAblage } from '../src/schueler/speicher.js';
import { erzeugeSchluessel, unterschreibe, pruefeUnterschrift } from '../src/gemeinsam/krypto.js';
import { erzeugeCode } from '../src/lehrer/auswertung.js';
import { beiname, neuerSpeicherstand } from '../src/schueler/logik.js';

test('Schuljahr wechselt am 1. August', () => {
  assert.equal(SCH.schuljahrAm('2026-11-19'), '2026-27');
  assert.equal(SCH.schuljahrAm('2027-07-31T12:00:00'), '2026-27');
  assert.equal(SCH.schuljahrAm('2027-08-01T12:00:00'), '2027-28');
  assert.equal(SCH.naechstesSchuljahr('2026-27'), '2027-28');
  assert.equal(SCH.naechstesSchuljahr('2099-00'), '2100-01');
  assert.equal(SCH.naechsteKlasse('5a'), '6a');
  assert.equal(SCH.naechsteKlasse('10c'), '11c');
  assert.equal(SCH.codeInKlasse('5A-K4M2', '6b'), '6B-K4M2');
});

test('Gewählter Ordner führt zum Mathekingdom-Ordner, Schuljahres- und Klassenordner sind zu tief', async () => {
  const laufwerk = speicherAblage('S:');
  const mk = await laufwerk.unterordner('Mathekingdom');
  await mk.schreibe(SCH.VERZEICHNIS, '{}');
  const klasse = await (await mk.unterordner('2026-27')).unterordner('5a');
  assert.equal((await SCH.findeSchule(mk)).wurzel.name, 'Mathekingdom');
  assert.equal((await SCH.findeSchule(laufwerk)).wurzel.name, 'Mathekingdom');
  assert.equal((await SCH.findeSchule(klasse)).fehler, 'zu-tief');
  assert.equal((await SCH.findeSchule(await mk.ordner('2026-27'))).fehler, 'zu-tief');
  assert.equal((await SCH.findeSchule(speicherAblage('Downloads'))).fehler, 'fehlt');
});

test('Klassenordner im aktuellen Schuljahr, sonst im neuesten, in dem es ihn gibt', async () => {
  const mk = speicherAblage('Mathekingdom');
  await (await mk.unterordner('2025-26')).unterordner('5a');
  await (await mk.unterordner('2026-27')).unterordner('6a');
  assert.equal((await SCH.findeKlassenordner(mk, '2026-27', '6a')).schuljahr, '2026-27');
  assert.equal((await SCH.findeKlassenordner(mk, '2027-28', '6a')).schuljahr, '2026-27');
  assert.equal((await SCH.findeKlassenordner(mk, '2026-27', '5a')).schuljahr, '2025-26');
  assert.equal(await SCH.findeKlassenordner(mk, '2026-27', '7a'), null);
});

test('Klassendatei dürfen Lehrkräfte der Klasse, Lehrkräfte mit Administratorrechten und der Administrator unterschreiben', async () => {
  const [admin, ng, hr, xy, fremd] = await Promise.all([1, 2, 3, 4, 5].map(() => erzeugeSchluessel()));
  const v = SCH.leeresVerzeichnis(admin.oeffentlich, '2026-27');
  v.lehrkraefte = { NG: { oeffentlich: ng.oeffentlich, admin: true }, HR: { oeffentlich: hr.oeffentlich }, XY: { oeffentlich: xy.oeffentlich } };
  v.klassen['2026-27'] = { '5a': { lehrkraefte: ['HR'] }, '5b': { lehrkraefte: ['XY', 'HR'] } };
  const liste = SCH.schluesselDerKlasse(v, '2026-27', '5a');
  for (const [s, gilt] of [[admin, true], [ng, true], [hr, true], [xy, false], [fremd, false]]) {
    const text = await unterschreibe({ klasse: '5a' }, s.privat);
    assert.equal(Boolean(await SCH.pruefeMitSchluesseln(text, liste)), gilt);
  }
  assert.deepEqual(SCH.klassenDerLehrkraft(v, '2026-27', 'HR'), ['5a', '5b']);
  assert.deepEqual(SCH.klassenDerLehrkraft(v, '2026-27', 'XY'), ['5b']);
  assert.deepEqual(SCH.klassenDerLehrkraft(v, '2026-27', 'NG'), ['5a', '5b']);
  // Das Schulverzeichnis selbst prüft das Schüler-Dashboard mit dem Schlüssel des Administrators.
  const mk = speicherAblage('Mathekingdom');
  await mk.schreibe(SCH.VERZEICHNIS, await unterschreibe(v, admin.privat));
  assert.equal((await SCH.ladeVerzeichnis(mk, admin.oeffentlich)).status, 'ok');
  assert.equal((await SCH.ladeVerzeichnis(mk, ng.oeffentlich)).status, 'ungueltig');
  assert.equal((await SCH.ladeVerzeichnis(mk, null)).status, 'ungeprueft');
  assert.ok(await pruefeUnterschrift(await mk.lies(SCH.VERZEICHNIS), admin.oeffentlich));
});

test('Hinterer Teil des Codes ist schulweit einmalig', () => {
  let i = 0;
  const zufall = () => (i++ < 4 ? 0 : 0.99);
  const vorhanden = erzeugeCode('5a', [], () => 0);
  const code = erzeugeCode('5b', [vorhanden], zufall);
  assert.ok(code.startsWith('5B-'));
  assert.notEqual(code.split('-')[1], vorhanden.split('-')[1]);
});

test('Übernahme: neuer Code in der Zielklasse, Speicherstand wandert mit und behält den Beinamen', () => {
  const stand = neuerSpeicherstand('5A-K4M2', '5a', '2026-09-01T08:00:00Z');
  stand.muenzen = 120; stand.lernziele = { x: { erreichtAm: '2026-10-01' } }; stand.hilferuf = { seit: 'x' };
  const vorher = beiname(stand);
  const neu = SCH.uebernimmStand(stand, '6A-K4M2', '6a', '2027-08-20T08:00:00Z');
  assert.equal(neu.code, '6A-K4M2'); assert.equal(neu.klasse, '6a');
  assert.equal(neu.muenzen, 120); assert.deepEqual(neu.lernziele, stand.lernziele);
  assert.equal(neu.hilferuf, null);
  assert.equal(beiname(neu), vorher);
  assert.equal(stand.code, '5A-K4M2', 'das Original bleibt unverändert');
  assert.equal(SCH.codeFuerUebernahme('5A-K4M2', '6a', ['6B-ZZZZ'], () => 'neu'), '6A-K4M2');
  assert.equal(SCH.codeFuerUebernahme('5A-K4M2', '6a', ['6B-K4M2'], () => '6A-NEU1'), '6A-NEU1');
});

test('Klassendatei enthält Prüfwerte der PINs, aber keine Namen und keine PINs', async () => {
  const k = SCH.neueKlassendaten(['5.1']);
  k.namen = { '5A-K4M2': 'Lena Müller' };
  assert.equal(await SCH.sorgePins(k), true);
  assert.equal(await SCH.sorgePins(k), false);
  const inhalt = SCH.klassendateiInhalt('5a', k, '2026-11-19T10:00:00Z');
  const text = JSON.stringify(inhalt);
  assert.ok(!text.includes('Lena'));
  assert.ok(!text.includes(`"pin":"${k.pins['5A-K4M2'].pin}"`));
  assert.deepEqual(inhalt.codes, ['5A-K4M2']);
  assert.deepEqual(inhalt.tore, ['5.1']);
});

test('Startdatei-Vorlage bekommt Werte eingesetzt', () => {
  const v = 'a=/*SCHLUESSEL*/null;b=/*PFAD*/null;c=/*KUERZEL*/null;';
  assert.equal(SCH.fuelleStartdatei(v, { SCHLUESSEL: { x: 1 }, PFAD: 'S:\\Mathekingdom', KUERZEL: null }), 'a={"x":1};b="S:\\\\Mathekingdom";c=null;');
});
