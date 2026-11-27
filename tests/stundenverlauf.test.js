// Stundenverlauf im Lehrer-Dashboard (Version 0.61, ADR 0053).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';

// Ortszeit Mittag, damit der Tag in jeder Zeitzone derselbe bleibt.
const JETZT = new Date(2026, 10, 27, 11, 0, 0).getTime();
const vor = (min) => new Date(JETZT - min * 60000).toISOString();
const stand = (aufgaben) => {
  const s = L.neuerSpeicherstand('5A-TEST', '5a', vor(600));
  for (const [min, niveau, richtig] of aufgaben) s.versuche.push({ t: vor(min), aufgabe: `x-${min}`, lernziel: '5.3.1-K1', niveau, richtig });
  return s;
};

test('heutige Aufgaben: nur von heute, in zeitlicher Folge', () => {
  const s = stand([[10, 'G', true], [30, 'M', false], [24 * 60, 'E', true]]);
  assert.deepEqual(A.heutigeAufgaben(s, JETZT).map((x) => x.niveau), ['M', 'G']);
  assert.deepEqual(A.heutigeAufgaben(null, JETZT), []);
});

test('Stundenbeginn: erste Aufgabe heute, höchstens 90 Minuten zurück', () => {
  assert.equal(A.stundenBeginn(stand([[40, 'G', true], [5, 'G', true]]), JETZT), JETZT - 40 * 60000);
  assert.equal(A.stundenBeginn(stand([[200, 'G', true], [5, 'G', true]]), JETZT), JETZT - 90 * 60000);
  assert.equal(A.stundenBeginn(stand([]), JETZT), null);
  assert.deepEqual(A.stundenAufgaben(stand([[200, 'G', true], [5, 'M', true]]), JETZT).map((x) => x.niveau), ['M']);
});

test('Tempo: Aufgaben je zehn Minuten, die ersten zehn Minuten zählen voll', () => {
  assert.equal(A.tempo(stand([[20, 'G', true], [15, 'G', true], [10, 'G', false], [5, 'G', true]]), JETZT), 2);
  // Zwei Aufgaben in der ersten Minute ergeben kein Tempo von 20.
  assert.equal(A.tempo(stand([[1, 'G', true], [0.5, 'G', true]]), JETZT), 2);
  assert.equal(A.tempo(stand([]), JETZT), null);
});

test('Stundentabelle: gelöst von bearbeitet je Niveaustufe und Vergleich mit dem Median', () => {
  const staende = [
    { code: 'A', stand: stand([[30, 'F', true], [25, 'G', true], [20, 'G', false], [15, 'M', true], [10, 'G', true], [5, 'G', true]]) },
    { code: 'B', stand: stand([[30, 'G', true], [20, 'G', true], [10, 'G', true]]) },
    { code: 'C', stand: stand([[30, 'G', true], [20, 'M', true], [10, 'G', false]]) },
    { code: 'D', stand: stand([[30, 'G', true]]) },
    { code: 'E', stand: null },
  ];
  const { zeilen, median } = A.stundenTabelle(staende, JETZT);
  const a = zeilen.find((x) => x.code === 'A');
  assert.deepEqual(a.je.G, { bearbeitet: 4, geloest: 3 });
  assert.deepEqual(a.je.F, { bearbeitet: 1, geloest: 1 });
  assert.equal(a.bearbeitet, 6);
  assert.equal(a.geloest, 5);
  assert.equal(median, 1); // Tempi 2, 1, 1 und 1/3
  assert.equal(a.vergleich, 'schneller'); // über 1,6
  assert.equal(zeilen.find((x) => x.code === 'D').vergleich, 'langsamer');
  assert.equal(zeilen.find((x) => x.code === 'B').vergleich, null);
  assert.equal(zeilen.find((x) => x.code === 'E').tempo, null);
});

test('Stundentabelle: ohne drei Schüler mit Aufgaben gibt es keinen Vergleich', () => {
  const { zeilen, median } = A.stundenTabelle([{ code: 'A', stand: stand([[5, 'G', true]]) }, { code: 'B', stand: stand([[30, 'G', true]]) }], JETZT);
  assert.equal(median, null);
  assert.ok(zeilen.every((x) => x.vergleich === null));
});

test('Säulen: je fünf Minuten, gestapelt nach Niveaustufe', () => {
  const staende = [
    { code: 'A', stand: stand([[22, 'F', true], [21, 'G', false], [3, 'M', true]]) },
    { code: 'B', stand: stand([[12, 'G', true], [2, 'E', true]]) },
  ];
  const { ab, saeulen } = A.stundenSaeulen(staende, JETZT);
  assert.equal(ab % (5 * 60000), 0);
  assert.ok(ab <= JETZT - 22 * 60000 && ab > JETZT - 27 * 60000);
  assert.equal(saeulen.reduce((s, x) => s + x.gesamt, 0), 5);
  assert.equal(saeulen.reduce((s, x) => s + x.geloest, 0), 4);
  const letzte = saeulen.at(-1);
  assert.ok(letzte.bis >= JETZT);
  assert.equal(letzte.je.M + letzte.je.E, 2);
  assert.deepEqual(A.stundenSaeulen([{ code: 'C', stand: stand([]) }], JETZT), { ab: null, saeulen: [] });
});

test('Lernzielstand: unter dem Ziel geschafft ist ein eigener Stand ohne Siegel', () => {
  const s = stand([[10, 'G', true]]);
  assert.equal(A.lernzielZustand(s, '5.3.1-K1'), 'begonnen');
  s.unterZiel = { '5.3.1-K1': { mal: 1, niveau: 'G', t: vor(10) } };
  assert.equal(A.lernzielZustand(s, '5.3.1-K1'), 'unterziel');
  s.lernziele['5.3.1-K1'] = { t: vor(1) };
  assert.equal(A.lernzielZustand(s, '5.3.1-K1'), 'siegel');
});
