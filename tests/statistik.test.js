import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as S from '../src/gemeinsam/statistik.js';

const JETZT = '2026-11-19T12:00:00Z';
const tag = (n) => new Date(Date.parse(JETZT) - n * 86400000).toISOString();
const start = (t, text) => ({ t, art: 'start', text });

test('liesStart: Version, Browser und ob online gestartet', () => {
  assert.deepEqual(S.liesStart({ text: 'Start online von GitHub, Version 0.23 vom 19.11.2026, Aufgaben online von GitHub, Edge 131' }), { version: '0.23', browser: 'Edge 131', kopie: false });
  assert.deepEqual(S.liesStart({ text: 'Start aus der Kopie im Klassenordner, Version 0.22, Chrome 130, Grund: GitHub nicht erreichbar' }), { version: '0.22', browser: 'Chrome 130', kopie: true });
});

test('Nutzung: aktive Speicherstände, Aufgaben, Quote, Starts der letzten 7 Tage, ohne Namen', () => {
  const klassen = [
    { klasse: '5a', namen: { A: 'Anna', B: 'Ben', C: 'Cem' }, backups: ['2026-11-19_10-00'], staende: [
      { code: 'A', stand: { versuche: [{ t: tag(1), richtig: true }, { t: tag(2), richtig: false }, { t: tag(10), richtig: true }],
        betrieb: [start(tag(9), 'Start online von GitHub, Version 0.21, Edge 130'), start(tag(1), 'Start online von GitHub, Version 0.23, Edge 131')] } },
      { code: 'B', stand: { versuche: [{ t: tag(20), richtig: true }],
        betrieb: [{ t: tag(3), art: 'problem', text: 'Start aus der Kopie im Klassenordner, Version 0.23, Chrome 130, Grund: GitHub nicht erreichbar' }] } },
    ] },
    { klasse: '5b', namen: { D: 'Dana' }, backups: [], staende: [{ code: 'D', stand: { versuche: [{ t: tag(0), richtig: true }], betrieb: [] } }] },
  ];
  const { zeilen, gesamt } = S.nutzung(klassen, JETZT);
  const a = zeilen[0];
  assert.equal(a.schueler, 3); assert.equal(a.staende, 2); assert.equal(a.aktiv, 1);
  assert.equal(a.aufgaben, 2); assert.equal(a.quote, 0.5);
  assert.equal(a.starts, 2); assert.equal(a.ohneNetz, 1); assert.equal(a.probleme, 1);
  assert.deepEqual(a.versionen, [['0.23', 2]]);
  assert.deepEqual(a.letztesBackup, '2026-11-19_10-00');
  assert.equal(gesamt.aktiv, 2); assert.equal(gesamt.aufgaben, 3);
  assert.equal(gesamt.quote, 2 / 3);
  assert.deepEqual(gesamt.versionen, [['0.23', 2]]);
  assert.ok(!JSON.stringify({ zeilen, gesamt }).includes('Anna'));
});

const zahlAufgabe = (id, loesung, extra = {}) => ({ id, lernziel: 'LZ', niveau: 'G', format: 'zahl', afb: 1, text: 'x', loesung, typischeFehler: [{ wert: 12, fehlvorstellung: 'f' }], ...extra });
const staende = (n, versuche) => Array.from({ length: n }, (_, i) => ({ code: `S${i}`, stand: { versuche: versuche(i), abbrueche: [] } }));

test('Auffällige Aufgabe: dieselbe unerwartete falsche Antwort von mehreren', () => {
  const aufgaben = [zahlAufgabe('X', 42)];
  const st = staende(5, () => [{ aufgabe: 'X', richtig: false, eingaben: ['24'] }]);
  const [x] = S.auffaelligeAufgaben(st, aufgaben);
  assert.equal(x.aufgabe, 'X');
  assert.match(x.gruende[0], /5 Schüler antworten „24“/);
  // Ein hinterlegter typischer Fehler ist erwartet und fällt nicht auf.
  const erwartet = staende(5, () => [{ aufgabe: 'X', richtig: false, eingaben: ['12'] }]);
  assert.equal(S.auffaelligeAufgaben(erwartet, aufgaben).length, 0);
});

test('Auffällige Aufgabe: viel seltener gelöst als die übrigen desselben Lernziels und Niveaus', () => {
  const aufgaben = ['A', 'B', 'C'].map((id) => zahlAufgabe(id, 5));
  const st = staende(5, (i) => [
    { aufgabe: 'A', richtig: true, eingaben: ['5'] }, { aufgabe: 'B', richtig: true, eingaben: ['5'] },
    { aufgabe: 'C', richtig: i === 0, eingaben: [i === 0 ? '5' : String(i)] },
  ]);
  const liste = S.auffaelligeAufgaben(st, aufgaben);
  assert.deepEqual(liste.map((x) => x.aufgabe), ['C']);
  assert.match(liste[0].gruende.at(-1), /Gelöst in 20 %.*in 100 %/);
});

test('Auffällige Aufgabe: oft abgebrochen; zu wenige Daten fallen nicht auf; gesperrte Versuche zählen nicht', () => {
  const aufgaben = [zahlAufgabe('X', 42)];
  const st = staende(4, (i) => []).map((s, i) => ({ ...s, stand: { versuche: [{ aufgabe: 'X', richtig: true, eingaben: ['42'] }], abbrueche: i < 3 ? [{ aufgabe: 'X' }] : [] } }));
  assert.match(S.auffaelligeAufgaben(st, aufgaben)[0].gruende[0], /43 % brechen sie ab/);
  assert.equal(S.auffaelligeAufgaben(staende(2, () => [{ aufgabe: 'X', richtig: false, eingaben: ['24', '24', '24'] }]), aufgaben).length, 0);
  assert.equal(S.auffaelligeAufgaben(staende(4, () => [{ aufgabe: 'X', richtig: false, gesperrt: true, eingaben: ['24'] }]), aufgaben).length, 0);
});

test('Falsche Teile: mehrteilige Aufgaben und Auswahl', () => {
  const sach = { format: 'sachaufgabe', teile: [{ loesung: 3 }, { loesung: 8, typischeFehler: [{ wert: 9 }] }] };
  assert.deepEqual(S.falscheTeile(sach, ['3', '9']), [{ text: 'b) 9', erwartet: true }]);
  assert.deepEqual(S.falscheTeile(sach, ['4', '8']), [{ text: 'a) 4', erwartet: false }]);
  const ausw = { format: 'auswahl', optionen: [{ text: 'ja', richtig: true }, { text: 'nein', fehlvorstellung: 'f' }, { text: 'vielleicht' }] };
  assert.deepEqual(S.falscheTeile(ausw, ['nein', 'vielleicht']), [{ text: 'nein', erwartet: true }, { text: 'vielleicht', erwartet: false }]);
  assert.deepEqual(S.falscheTeile({ format: 'zahl', loesung: 1200 }, ['1 200']), []);
});

test('Je Aufgabentyp: Bearbeitungen, Quote, Abbruchquote, Zahl auffälliger Aufgaben', () => {
  const aufgaben = [zahlAufgabe('X', 1), { id: 'Y', format: 'auswahl', lernziel: 'LZ', niveau: 'G', optionen: [] }];
  const st = [{ code: 'A', stand: { versuche: [{ aufgabe: 'X', richtig: true }, { aufgabe: 'X', richtig: false }], abbrueche: [{ aufgabe: 'X' }] } }];
  const [zahl, auswahl] = S.jeAufgabentyp(st, aufgaben, [{ format: 'zahl' }], { zahl: 'Zahl eingeben' });
  assert.equal(zahl.name, 'Zahl eingeben'); assert.equal(zahl.bearbeitet, 2); assert.equal(zahl.quote, 0.5);
  assert.equal(zahl.abbruchquote, 1 / 3); assert.equal(zahl.auffaellig, 1); assert.equal(zahl.genutzt, 1);
  assert.equal(auswahl.bearbeitet, 0); assert.equal(auswahl.quote, null);
});
