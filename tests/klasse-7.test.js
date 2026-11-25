// Klasse 7, Kapitel 1 „Rationale Zahlen“ (ADR 0043): dritter Aufgabenpool, Zahlen mit Vorzeichen, vier Quadranten, Brücken in zwei Vorstufen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as B from '../src/schueler/bruch.js';
import * as L from '../src/schueler/logik.js';
import { punktText, lesePunkte } from '../src/schueler/geo.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(7), sechs = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const RICHTIG = { richtig: true, fehlvorstellung: null };
const aufgabe = (id) => pool.aufgaben.find((a) => a.id === id);
const eins = pool.kapitel[0];

test('Der Jahresplan hat 8 Kapitel wie das Buch, gebaut sind Kapitel 1 und 2', () => {
  assert.deepEqual(pool.kapitel.map((k) => k.titel), ['Rationale Zahlen', 'Dreiecke', 'Rechnen mit Termen', 'Gleichungen', 'Vierecke', 'Proportional und antiproportional', 'Prozente', 'Wahrscheinlichkeit']);
  assert.ok(pool.aufgaben.every((a) => /^7\.[12]\./.test(a.id)));
});

test('Kapitel 1 hat 8 Meilensteine mit je 2 Lernzielen und 4 Abstecher mit je 1 Lernziel, je Lernziel 24 Aufgaben', () => {
  const meilen = eins.unterkapitel.filter((u) => !u.extra), abstecher = eins.unterkapitel.filter((u) => u.extra);
  assert.equal(meilen.length, 8);
  assert.equal(abstecher.length, 4);
  assert.ok(meilen.every((u) => u.lernziele.length === 2));
  assert.ok(abstecher.every((u) => u.lernziele.length === 1));
  assert.equal(pool.aufgaben.filter((a) => a.id.startsWith('7.1.')).length, 480);
  for (const u of eins.unterkapitel) for (const l of u.lernziele) {
    assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), [6, 6, 6, 6], l.id);
  }
});

test('Die Abstecher hängen an den Meilensteinen aus dem Grilling', () => {
  const vor = (id) => eins.unterkapitel[eins.unterkapitel.findIndex((u) => u.id === id) - 1].id;
  assert.equal(vor('7.1.X1'), '7.1.1');
  assert.equal(vor('7.1.X2'), '7.1.2');
  assert.equal(vor('7.1.X3'), '7.1.8');
  assert.equal(vor('7.1.X4'), '7.1.X3');
});

test('Zahlen mit Vorzeichen: Bindestrich, Minuszeichen und Halbgeviertstrich zählen, ein Plus davor auch', () => {
  for (const [text, wert] of [['-5', -5], ['−5', -5], ['– 5', -5], ['+7', 7], ['7', 7], ['− 1 200', -1200], ['-0', 0]]) assert.equal(L.leseZahl(text), wert, text);
  for (const text of ['--5', '5-', '−', '', '3−4']) assert.ok(Number.isNaN(L.leseZahl(text)), text);
});

test('Eine ganze Lösung: richtig mit jedem Minuszeichen, die Zahl ohne Minus ist der typische Fehler', () => {
  const a = pool.aufgaben.find((x) => x.format === 'zahl' && typeof x.loesung === 'number' && x.loesung < 0 && x.typischeFehler?.some((f) => f.wert === -x.loesung));
  for (const z of ['-', '−', '–']) assert.deepEqual(L.pruefeAntwort(a, `${z}${-a.loesung}`), RICHTIG, z);
  assert.deepEqual(L.pruefeAntwort(a, `−${-a.loesung},0`), RICHTIG);
  const ohne = L.pruefeAntwort(a, String(-a.loesung));
  assert.equal(ohne.richtig, false);
  assert.equal(ohne.fehlvorstellung, a.typischeFehler.find((f) => f.wert === -a.loesung).fehlvorstellung);
});

test('Dezimalzahlen mit Vorzeichen: „−0,23“ und „-0,23“ sind richtig, ohne Minus ist es der Vorzeichenfehler', () => {
  const a = aufgabe('7.1.3-A2-M-01');
  assert.equal(B.leseDezimal('−2,5').z, -25);
  assert.equal(B.leseDezimal('+2,5').z, 25);
  const minus = a.loesung.startsWith('−');
  assert.deepEqual(L.pruefeAntwort(a, a.loesung), RICHTIG);
  assert.deepEqual(L.pruefeAntwort(a, a.loesung.replace('−', '-')), RICHTIG);
  const gegen = minus ? a.loesung.slice(1) : `−${a.loesung}`;
  assert.equal(L.pruefeAntwort(a, gegen).richtig, false);
  assert.equal(L.pruefeAntwort(a, gegen).fehlvorstellung, 'vorzeichen-vergessen');
});

test('Geld: Ein Kontostand gilt mit und ohne Endnull', () => {
  const a = pool.aufgaben.find((x) => x.lernziel === '7.1.X4-B1' && x.niveau === 'E' && x.format === 'zahl' && /0$/.test(x.loesung));
  assert.ok(a, 'eine Lösung mit Endnull');
  assert.deepEqual(L.pruefeAntwort(a, a.loesung), RICHTIG);
  assert.deepEqual(L.pruefeAntwort(a, a.loesung.replace(/0$/, '')), RICHTIG);
});

test('Brüche mit Vorzeichen: Das Minus gilt für die ganze Zahl; gekürzt wird wie in Klasse 6', () => {
  assert.deepEqual(B.alsWert(B.leseBruch('−3/4')), { z: -3, n: 4 });
  assert.deepEqual(B.alsWert(B.leseBruch('-1 3/4')), { z: -7, n: 4 });
  assert.deepEqual(B.alsWert(B.leseBruch('−2')), { z: -2, n: 1 });
  const a = { format: 'bruch', loesung: '−3⁄4', gekuerzt: true, typischeFehler: [{ wert: '3⁄4', fehlvorstellung: 'vorzeichen-vergessen' }] };
  assert.deepEqual(B.pruefeBruch(a, '−3/4'), RICHTIG);
  assert.deepEqual(B.pruefeBruch(a, '-3/4'), RICHTIG);
  assert.deepEqual(B.pruefeBruch(a, '−6/8'), { richtig: false, fehlvorstellung: 'kuerzen-nicht-vollstaendig', nachbessern: 'kuerzen' });
  assert.equal(B.pruefeBruch(a, '3/4').fehlvorstellung, 'vorzeichen-vergessen');
});

test('Alle Aufgaben mit Zahl, Dezimalzahl oder Bruch: Die Lösung ist richtig, jeder typische Fehler wird erkannt', () => {
  for (const a of pool.aufgaben.filter((x) => x.format === 'zahl' || x.format === 'bruch')) {
    assert.deepEqual(L.pruefeAntwort(a, String(a.loesung)), RICHTIG, a.id);
    for (const f of a.typischeFehler ?? []) {
      const e = L.pruefeAntwort(a, String(f.wert));
      assert.equal(e.richtig, false, `${a.id} ${f.wert}`);
      assert.equal(e.fehlvorstellung, f.fehlvorstellung, `${a.id} ${f.wert}`);
    }
  }
});

test('Lücken und Zahlenmauern: Die Lösungen sind richtig, auch mit getipptem Bindestrich', () => {
  const tippe = (w) => String(w).replace('−', '-');
  for (const a of pool.aufgaben.filter((x) => x.format === 'luecken' || x.format === 'tabelle')) {
    const eingabe = Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, tippe(l.loesung)]));
    assert.equal(L.pruefeAntwort(a, eingabe).richtig, true, a.id);
  }
});

test('Koordinatensystem mit vier Quadranten: Punkte mit Minus werden geschrieben, gelesen und geprüft', () => {
  assert.equal(punktText([-3, 2]), '(−3|2)');
  assert.deepEqual(lesePunkte('A(−3|2) und B(-1|-4)'), [[-3, 2], [-1, -4]]);
  const gitter = pool.aufgaben.filter((a) => a.format === 'gitter' && a.id.startsWith('7.1.'));
  assert.ok(gitter.length >= 10);
  for (const a of gitter) {
    assert.deepEqual(a.gitter.ursprung, [a.gitter.b / 2, a.gitter.h / 2], a.id);
    assert.deepEqual(L.pruefeAntwort(a, a.loesung.map(punktText).join(' ')), RICHTIG, a.id);
    for (const f of a.typischeFehler ?? []) assert.equal(L.pruefeAntwort(a, f.punkte.map(punktText).join(' ')).fehlvorstellung, f.fehlvorstellung, `${a.id} ${JSON.stringify(f.punkte)}`);
  }
});

test('Schreibweise: echtes Minuszeichen, „(+15)“ nur in 1.3 bis 1.5 und nie auf F', () => {
  for (const a of pool.aufgaben) {
    const alles = JSON.stringify([a.text, a.optionen, a.hilfen, a.karten, a.paare]);
    assert.ok(!/(^|[^\w⁄])-\d/.test(alles), `${a.id}: Bindestrich statt Minus`);
    if (/\(\+\d/.test(JSON.stringify([a.text, a.optionen]))) {
      assert.ok(/^7\.1\.[345]-/.test(a.id), `${a.id}: (+…) außerhalb von 1.3 bis 1.5`);
      assert.notEqual(a.niveau, 'F', a.id);
    }
  }
});

test('Staffel: Auf F hat jede Aufgabe ein Bild und nur ganze Zahlen', () => {
  for (const a of pool.aufgaben.filter((x) => x.niveau === 'F' && x.id.startsWith('7.1.'))) {
    assert.ok(a.bild || a.strahl || a.gitter || a.daten || a.tabelle, `${a.id} ohne Bild`);
    assert.ok(!/\d,\d|⁄/.test(JSON.stringify([a.text, a.optionen, typeof a.loesung === 'string' ? a.loesung : null])), `${a.id}: Komma oder Bruch auf F`);
  }
});

test('Brücken: Die Voraussetzungen liegen in Klasse 7, 6 oder 5, und die Vorstufe bringt ihre Aufgaben mit', () => {
  const eigene = new Set(pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => l.id));
  const vor = new Set(pool.vorstufe.lernziele.map((l) => l.id));
  const stufen = new Set();
  for (const u of eins.unterkapitel) for (const l of u.lernziele) for (const v of l.voraussetzungen) {
    assert.ok(eigene.has(v) || vor.has(v), `${l.id} baut auf ${v}`);
    if (vor.has(v)) { stufen.add(v[0]); assert.ok(pool.vorstufe.aufgaben.some((a) => a.lernziel === v), `${v} ohne Aufgaben`); }
  }
  assert.deepEqual([...stufen].sort(), ['5', '6']);
});

test('Der Pool der Klasse 7 besteht die Prüfung, jede Aufgabe ist nachgerechnet', () => {
  assert.deepEqual(pruefePool(lies(7), [fuenf, sechs]).fehler, []);
  assert.ok(pool.aufgaben.every((a) => a.nachweis));
});
