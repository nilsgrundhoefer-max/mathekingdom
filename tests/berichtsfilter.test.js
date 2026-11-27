// Version 0.59: Berichte werden nach dem Auslesen nicht gelöscht, sondern nach Version und „seit dem letzten Export“ gefiltert.
// Dazu der Vorzeichenknopf nur noch in Klasse 7 Kapitel 1.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as AN from '../src/gemeinsam/aufgabenanalyse.js';
import { mitVorzeichen, abKlasse7 } from '../src/schueler/zahlenbilder.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));

test('Versionen vergleichen: 0.59 ist neuer als 0.6 nicht, 0.100 neuer als 0.99', () => {
  assert.ok(AN.vergleicheVersion('0.59', '0.58') > 0);
  assert.ok(AN.vergleicheVersion('0.100', '0.99') > 0);
  assert.equal(AN.vergleicheVersion('0.59', '0.59'), 0);
  assert.ok(AN.vergleicheVersion('0.54', '0.59') < 0);
});

test('Filter: ab Version lässt ältere und unbeschriftete Einträge weg, seit dem Export nur Neues', () => {
  const z = { abVersion: '0.59' };
  assert.equal(AN.imZeitraum('2026-11-27T08:00:00Z', z, '0.59'), true);
  assert.equal(AN.imZeitraum('2026-11-27T08:00:00Z', z, '0.60'), true);
  assert.equal(AN.imZeitraum('2026-11-27T08:00:00Z', z, '0.58'), false);
  assert.equal(AN.imZeitraum('2026-11-27T08:00:00Z', z, null), false, 'ohne Version: vor 0.54');
  const seit = { seit: '2026-11-27T09:00:00.000Z' };
  assert.equal(AN.imZeitraum('2026-11-27T08:59:00.000Z', seit), false);
  assert.equal(AN.imZeitraum('2026-11-27T09:01:00.000Z', seit), true);
  assert.equal(AN.imZeitraum('2026-11-27T08:00:00Z', {}), true, 'ohne Filter alles');
});

test('Aufgabenanalyse und Feedback zählen nur die gewählte Version', () => {
  const st = L.neuerSpeicherstand('5A-AAAA', '5a', '2026-11-26T08:00:00Z');
  const a = pool.aufgaben[0];
  st.versuche.push({ t: '2026-11-26T08:01:00Z', aufgabe: a.id, lernziel: a.lernziel, niveau: a.niveau, richtig: true, versuche: 1, eingaben: [], version: '0.58' });
  st.versuche.push({ t: '2026-11-27T08:01:00Z', aufgabe: a.id, lernziel: a.lernziel, niveau: a.niveau, richtig: false, versuche: 2, eingaben: [], version: '0.59' });
  st.dashboardVersion = '0.59';
  L.trageFeedbackEin(st, L.FEEDBACK_FRAGEN[0], 0, null, '2026-11-27T08:02:00Z');
  assert.equal(st.feedback.at(-1).version, '0.59', 'Feedback trägt die Version');
  st.feedback.push({ t: '2026-11-26T08:02:00Z', frage: L.FEEDBACK_FRAGEN[0].id, antwort: 1 });
  const klassen = [{ klasse: '5a', staende: [{ code: '5A-AAAA', stand: st }] }];
  assert.deepEqual(AN.vorkommendeVersionen(klassen), ['0.59', '0.58']);
  const alle = AN.aufgabenanalyse(klassen, pool.aufgaben, {});
  assert.equal(alle.zeilen[0].bearbeitet, 2);
  const neu = AN.aufgabenanalyse(klassen, pool.aufgaben, { abVersion: '0.59' });
  assert.equal(neu.zeilen[0].bearbeitet, 1);
  assert.equal(neu.zeilen[0].quote, 0);
  assert.equal(AN.feedbackAuswertung(klassen, {}).antworten, 2);
  assert.equal(AN.feedbackAuswertung(klassen, { abVersion: '0.59' }).antworten, 1);
  // Nichts wurde gelöscht.
  assert.equal(st.versuche.length, 2);
});

test('Vorzeichenknopf nur in Klasse 7 Kapitel 1, Abstecher eingeschlossen', () => {
  assert.equal(mitVorzeichen({ lernziel: '7.1.3-A1' }), true);
  assert.equal(mitVorzeichen({ lernziel: '7.1.X1-K1' }), true, 'Abstecher Koordinatensystem');
  assert.equal(mitVorzeichen({ lernziel: '7.2.1-D1' }), false);
  assert.equal(mitVorzeichen({ lernziel: '7.4.1-G1' }), false);
  assert.equal(mitVorzeichen({ lernziel: '6.1.1-B1' }), false);
  assert.equal(mitVorzeichen({}), false);
  assert.equal(abKlasse7({ lernziel: '7.2.1-D1' }), true, 'Kommatastatur und Lückensätze bleiben für ganz Klasse 7');
});
