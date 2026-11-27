// Version 0.68 (ADR 0057): Hilferuf gilt für den Tag, Heftcheck mit Dezimalzahlen und negativen Zahlen, Feedbackfrage begrenzt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';

const lade = (k) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${k}.json`, import.meta.url), 'utf8'));
const pools = [5, 6, 7].map(lade);
const pool = pools[0], index = L.indexiere(pool);
const GESTERN = '2026-11-26T09:00:00Z', HEUTE = '2026-11-27T09:00:00Z', SPAETER = '2026-11-27T09:30:00Z';
const neu = (code = '5A-K4M2') => L.neuerSpeicherstand(code, '5a', '2026-11-19T10:00:00Z');
const AUFGABE = pool.aufgaben[0].id;

test('Hilferuf: gilt am selben Tag weiter und läuft am nächsten Tag ab', () => {
  const stand = neu();
  L.rufeHilfe(stand, AUFGABE, GESTERN, 'schwer');
  assert.equal(L.lasseHilferufAblaufen(stand, '2026-11-26T11:00:00Z'), false, 'am selben Tag bleibt er offen');
  assert.ok(stand.hilferuf);
  assert.equal(L.lasseHilferufAblaufen(stand, HEUTE), true);
  assert.equal(stand.hilferuf, null);
  assert.deepEqual(stand.hilferufAbgelaufen, { seit: GESTERN, aufgabe: AUFGABE, anlass: 'schwer' });
  assert.equal(stand.hilferufe.at(-1).grund, 'abgelaufen');
  assert.equal(L.lasseHilferufAblaufen(stand, HEUTE), false, 'nur einmal');
});

test('Hilferuf abgelaufen: „Ja“ ruft neu von heute, „Nein“ räumt nur auf', () => {
  const ja = neu(), nein = neu();
  for (const s of [ja, nein]) { L.rufeHilfe(s, AUFGABE, GESTERN, 'verstehe'); L.lasseHilferufAblaufen(s, HEUTE); }
  L.beantworteAbgelaufen(ja, true, SPAETER);
  assert.deepEqual(ja.hilferuf, { seit: SPAETER, aufgabe: AUFGABE, anlass: 'verstehe' });
  assert.equal(ja.hilferufAbgelaufen, undefined);
  L.beantworteAbgelaufen(nein, false, SPAETER);
  assert.equal(nein.hilferuf, null);
  assert.equal(nein.hilferufAbgelaufen, undefined);
  // Ein neuer Ruf zu einer anderen Aufgabe
  const anders = neu();
  L.rufeHilfe(anders, AUFGABE, GESTERN); L.lasseHilferufAblaufen(anders, HEUTE);
  L.beantworteAbgelaufen(anders, true, SPAETER, pool.aufgaben[5].id);
  assert.equal(anders.hilferuf.aufgabe, pool.aufgaben[5].id);
});

test('Warteschlange: Rufe von gestern verlängern sie nicht, die Lehrkraft sieht sie als abgelaufen', () => {
  const alt = neu('5A-AAAA'), frisch = neu('5A-BBBB'), ohne = neu('5A-CCCC');
  L.rufeHilfe(alt, AUFGABE, GESTERN, 'schwer');
  L.rufeHilfe(frisch, AUFGABE, HEUTE);
  assert.equal(L.wartePlatz(frisch, [alt.hilferuf], SPAETER), 1, 'der alte Ruf steht nicht davor');
  assert.equal(L.wartePlatz(frisch, [alt.hilferuf]), 2, 'ohne Uhrzeit wie bisher');
  const staende = [{ code: '5A-AAAA', stand: alt }, { code: '5A-BBBB', stand: frisch }, { code: '5A-CCCC', stand: ohne }];
  assert.deepEqual(A.warteschlange(staende, index, SPAETER).map((r) => r.code), ['5A-BBBB']);
  assert.deepEqual(A.abgelaufeneHilferufe(staende, SPAETER), [{ code: '5A-AAAA', seit: GESTERN, aufgabe: AUFGABE, anlass: 'schwer' }]);
  // Das Kind meldet sich an: Der Ruf läuft ab und bleibt heute in der Liste, bis es neu ruft.
  L.lasseHilferufAblaufen(alt, HEUTE);
  assert.deepEqual(A.abgelaufeneHilferufe(staende, SPAETER).map((r) => r.code), ['5A-AAAA']);
  L.beantworteAbgelaufen(alt, true, SPAETER);
  assert.deepEqual(A.abgelaufeneHilferufe(staende, SPAETER), []);
  assert.deepEqual(A.warteschlange(staende, index, SPAETER).map((r) => r.code), ['5A-BBBB', '5A-AAAA']);
});

test('Livestatus: ein Hilferuf von gestern zählt nicht mehr als „braucht Hilfe“', () => {
  const stand = neu();
  L.rufeHilfe(stand, AUFGABE, GESTERN);
  stand.geaendert = SPAETER; stand.aktiv = { aufgabe: AUFGABE, seit: SPAETER };
  assert.notEqual(A.livestatus(stand, 'M', SPAETER).status, 'hilfe');
  L.rufeHilfe(Object.assign(stand, { hilferuf: null }), AUFGABE, SPAETER);
  assert.equal(A.livestatus(stand, 'M', SPAETER).status, 'hilfe');
});

test('Heftcheck: Dezimalzahlen und negative Zahlen bekommen drei falsche Antworten in deutscher Schreibweise', () => {
  const texte = (w, f) => L.heftAntworten(w, f).map((o) => o.text);
  assert.deepEqual(texte(12, [13]), ['12', '13', '11', '22']);
  assert.deepEqual(texte('−0,17', ['0,17']), ['−0,17', '0,17', '−0,16', '−0,18']);
  assert.deepEqual(texte('26,5', []), ['26,5', '26,6', '26,4', '27,5']);
  assert.deepEqual(texte(-1752, [1752]), ['−1752', '1752', '−1751', '−1753']);
  assert.deepEqual(texte('0,3', ['0,03', '0,30']), ['0,3', '0,03', '0,4', '0,2'], '0,30 ist dieselbe Zahl und fällt weg');
  assert.deepEqual(texte(0, []), ['0', '1', '10', '100'], 'ohne negative Zahlen in der Aufgabe bleibt es bei Zahlen ab 0');
  assert.deepEqual(texte(25000, []), ['25 000', '25 001', '24 999', '25 010']);
  assert.equal(L.heftAntworten('3/4'), null);
});

test('Heftcheck: jede Aufgabe mit Heftwert in Klasse 5 bis 7 hat vier verschiedene Antworten ohne Bindestrich-Minus', () => {
  let gezaehlt = 0;
  for (const p of pools) for (const a of p.aufgaben) {
    const w = L.heftWert(a);
    if (!w) continue;
    gezaehlt++;
    const o = L.heftAntworten(w.wert, w.fehler);
    assert.equal(o.length, 4, a.id);
    assert.equal(new Set(o.map((x) => x.text)).size, 4, a.id);
    assert.equal(o.filter((x) => x.richtig).length, 1, a.id);
    for (const x of o) assert.doesNotMatch(x.text, /-|\./, `${a.id}: ${x.text}`);
  }
  assert.ok(gezaehlt > 2000, `${gezaehlt} Aufgaben mit Heftwert`);
});

test('Heftcheck: die Frage zu einer Dezimalaufgabe trägt die Einheit an allen Antworten', () => {
  const p7 = pools[2], i7 = L.indexiere(p7), stand = L.neuerSpeicherstand('7A-K4M2', '7a', '2026-11-19T10:00:00Z');
  const a = p7.aufgaben.find((x) => x.id === '7.1.X3-C1-M-01');
  stand.versuche = Array.from({ length: 8 }, (_, i) => ({ t: HEUTE, aufgabe: a.id, lernziel: a.lernziel, niveau: 'M', richtig: true, versuche: 1, heft: `H${i + 1}` }));
  stand.heftSeitCheck = 8;
  const f = L.heftcheckFrage(stand, i7, () => 0);
  assert.equal(f.optionen.length, 4);
  assert.ok(f.optionen.every((o) => o.text.endsWith(' Grad')));
  assert.ok(f.optionen.some((o) => o.richtig && o.text === '26,5 Grad'));
});

test('Feedbackfrage: höchstens sechs am Tag und keine Frage zweimal am selben Tag', () => {
  const stand = neu(), fb = { alle: 3 };
  const gefragt = [];
  for (let i = 0; i < 9; i++) {
    stand.feedbackSeit = 3;
    if (!L.feedbackFaellig(stand, fb, HEUTE)) break;
    const f = L.naechsteFeedbackFrage(stand, { tipp: true, bild: true }, HEUTE);
    gefragt.push(f.id);
    L.trageFeedbackEin(stand, f, 0, AUFGABE, HEUTE);
  }
  assert.equal(gefragt.length, L.FEEDBACK_JE_TAG);
  assert.equal(new Set(gefragt).size, 6);
  stand.feedbackSeit = 3;
  assert.equal(L.feedbackFaellig(stand, fb, HEUTE), false, 'die siebte Frage kommt heute nicht');
  assert.equal(L.feedbackFaellig(stand, fb, '2026-11-28T09:00:00Z'), true, 'morgen geht es weiter');
  assert.equal(L.feedbackFaellig(stand, fb), true, 'ohne Uhrzeit wie bisher');
});

test('Feedbackfrage: eine heute schon gestellte Frage wird übersprungen', () => {
  const stand = neu();
  const erste = L.naechsteFeedbackFrage(stand, { tipp: true, bild: true }, HEUTE);
  stand.feedback = [{ t: HEUTE, frage: erste.id, antwort: 1 }];
  assert.notEqual(L.naechsteFeedbackFrage(stand, { tipp: true, bild: true }, SPAETER).id, erste.id);
  assert.equal(L.naechsteFeedbackFrage(stand, { tipp: true, bild: true }, '2026-11-28T09:00:00Z').id, erste.id, 'am nächsten Tag darf sie wiederkommen');
});
