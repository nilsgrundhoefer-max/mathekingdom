// Klasse 6, Kapitel 3 „Körper“ (ADR 0045): 7 Meilensteine, Pflicht ab M für Schrägbild und Ansichten, Bildkarten,
// Körperbilder, Netze und Würfelbauten, die der Prüfer selbst faltet, zählt und nachmisst.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefeGitter, alsEingabe } from '../src/schueler/geo.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const RICHTIG = { richtig: true, fehlvorstellung: null };
const drei = pool.kapitel[2];
const kap3 = pool.aufgaben.filter((a) => a.id.startsWith('6.3.'));
const u = (id) => drei.unterkapitel.find((x) => x.id === id);
const gemeldet = (kopie, id) => pruefePool(kopie, [fuenf]).fehler.some((f) => f.startsWith(id));
const worte = (a) => JSON.stringify([a.text, a.optionen?.map((o) => o.text), a.hilfen]);

test('Kapitel 3 hat 7 Meilensteine mit je 2 Lernzielen und 6 Aufgaben je Stufe, zusammen 336 Aufgaben', () => {
  assert.equal(drei.titel, 'Körper');
  assert.deepEqual(drei.unterkapitel.map((x) => x.id), ['6.3.1', '6.3.2', '6.3.3', '6.3.4', '6.3.5', '6.3.6', '6.3.8']);
  assert.equal(kap3.length, 336);
  for (const x of drei.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    for (const l of x.lernziele) assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), [6, 6, 6, 6], l.id);
  }
});

test('Pflicht ab M: Schrägbild (3.2) und Ansichten (3.3) sind auf F und G ein freiwilliger Abstecher', () => {
  assert.deepEqual(drei.unterkapitel.filter((x) => x.pflicht).map((x) => [x.id, x.pflicht]), [['6.3.2', 'M'], ['6.3.3', 'M']]);
  for (const id of ['6.3.2', '6.3.3']) {
    assert.equal(L.istNiveauAbstecher(u(id), 'F'), true, id);
    assert.equal(L.istNiveauAbstecher(u(id), 'G'), true, id);
    assert.equal(L.istNiveauAbstecher(u(id), 'M'), false, id);
  }
  assert.equal(L.istNiveauAbstecher(u('6.3.1'), 'F'), false);
  assert.equal(L.stufeFuer(index, '6.3.2-S1', 'G'), 'G');
});

test('Jedes gebaute Lernziel der Klasse 6 nennt seine Stelle im Bildungsplan', () => {
  const gebaut = pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((x) => x.lernziele)).filter((l) => pool.aufgaben.some((a) => a.lernziel === l.id));
  assert.ok(gebaut.length >= 38);
  for (const l of gebaut) assert.match(l.bp ?? '', /^(ZVO|RF|FZ|DS|ZP|MES) \(\d+\)/, l.id);
  assert.ok(drei.unterkapitel.flatMap((x) => x.lernziele).every((l) => l.bp.startsWith('RF')));
});

test('Bildkarten: Jede Antwort ist ein Bild mit Buchstaben, und nur die richtige Wahl zählt', () => {
  const karten = kap3.filter((a) => a.optionen?.some((o) => o.bild));
  assert.ok(karten.length >= 50, `nur ${karten.length} Aufgaben mit Bildkarten`);
  for (const a of karten) {
    assert.ok(a.optionen.every((o) => o.bild), a.id);
    assert.deepEqual(a.optionen.map((o) => o.text), 'ABCDEF'.slice(0, a.optionen.length).split(''), a.id);
    const richtig = a.optionen.filter((o) => o.richtig).map((o) => o.text);
    assert.ok(richtig.length >= 1, a.id);
    if (!a.mehrfach) assert.equal(richtig.length, 1, a.id);
    assert.deepEqual(L.pruefeAntwort(a, richtig), RICHTIG, a.id);
    const falsch = a.optionen.find((o) => !o.richtig);
    if (falsch) assert.equal(L.pruefeAntwort(a, [falsch.text]).richtig, false, a.id);
  }
});

test('Gitteraufgaben: Netze ergänzen, Kanten zeichnen und Ecken setzen nehmen ihre Lösung an', () => {
  const gitter = kap3.filter((a) => a.format === 'gitter');
  assert.equal(gitter.length, 48);
  for (const a of gitter) {
    const loesung = a.eingabe === 'linie' ? a.beispiel : a.loesung;
    assert.deepEqual(pruefeGitter(a, alsEingabe(loesung)), RICHTIG, a.id);
    assert.equal(pruefeGitter(a, '').richtig, false, a.id);
    for (const f of a.typischeFehler ?? []) if (f.punkte) assert.equal(pruefeGitter(a, alsEingabe(f.punkte)).richtig, false, a.id);
  }
  // Ein Würfelnetz lässt sich auf verschiedene Weise ergänzen: Jede Ergänzung, die faltet, zählt.
  const netz = gitter.find((a) => a.bedingung?.art === 'netz' && a.bedingung.fehlt === 1 && a.bedingung.gegeben.length === 5);
  assert.ok(netz);
});

test('Auf F hat jede Aufgabe ein Bild, Bildkarten oder ein Gitter', () => {
  for (const a of kap3.filter((x) => x.niveau === 'F')) assert.ok(a.bild || a.gitter || a.optionen?.some((o) => o.bild), `${a.id} ohne Bild`);
});

test('Wortspeicher: Fachwörter erscheinen erst ab ihrer Stufe', () => {
  const ab = { Grundriss: 'G', Aufriss: 'G', Seitenriss: 'M', Prisma: 'G', Grundfläche: 'G', Mantelfläche: 'M', Pyramide: 'G', Seitendreieck: 'M', Kreisausschnitt: 'M', Würfelnetz: 'G' };
  for (const a of kap3) for (const [wort, stufe] of Object.entries(ab)) {
    if (L.NIVEAUS.indexOf(a.niveau) >= L.NIVEAUS.indexOf(stufe)) continue;
    assert.ok(!worte(a).includes(wort), `${a.id}: „${wort}“ erst ab ${stufe}`);
  }
});

test('Der Prüfer faltet Netze: Ein Netz, das nicht faltet, fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.id.startsWith('6.3.') && x.format === 'auswahl' && !x.optionen.some((o) => o.bild) && x.nachweis?.some((n) => n.art === 'netz' && n.faltbar !== false) && x.bild?.art === 'netz' && x.bild.flaechen?.length === 6 && x.bild.flaechen.every((f) => f.ecken.length === 4));
  assert.ok(a);
  a.bild.flaechen = a.bild.flaechen.map((f, i) => ({ ...f, ecken: f.ecken.map(([x, y]) => [x + i, y]) }));
  assert.ok(gemeldet(kopie, a.id), `${a.id}: kein Fehler gemeldet`);
});

test('Der Prüfer kennt den Spielwürfel: Falsche Augen nach dem Kippen fallen auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.id.startsWith('6.3.8') && x.format === 'zahl' && x.nachweis?.some((n) => n.art === 'kippen'));
  const n = a.nachweis.find((x) => x.art === 'kippen');
  n.wert = 7 - n.wert; a.loesung = n.wert;
  assert.ok(gemeldet(kopie, a.id), `${a.id}: kein Fehler gemeldet`);
});

test('Der Prüfer zählt Würfelbauten: Eine falsche Anzahl fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.id.startsWith('6.3.8') && x.format === 'zahl' && x.bild?.form === 'wuerfelbau' && x.nachweis?.some((n) => n.art === 'wuerfelzahl'));
  assert.ok(a);
  a.bild.wuerfel = a.bild.wuerfel.slice(1);
  assert.ok(gemeldet(kopie, a.id), `${a.id}: kein Fehler gemeldet`);
});

test('Der Prüfer kennt die Eigenschaften der Körper: Eine falsch markierte Antwort fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.id.startsWith('6.3.6') && x.nachweis?.some((n) => n.art === 'eigenschaft') && x.optionen?.some((o) => !o.richtig));
  assert.ok(a);
  for (const o of a.optionen) o.richtig = !o.richtig;
  assert.ok(gemeldet(kopie, a.id), `${a.id}: kein Fehler gemeldet`);
});

test('Der Prüfer verlangt den Operator am Satzanfang: Ein Auftrag als Frage fällt auf', () => {
  const kopie = structuredClone(pool);
  const a = kopie.aufgaben.find((x) => x.id.startsWith('6.3.8') && x.format === 'zahl' && /Gib an, wie viele Würfel/.test(x.text));
  assert.ok(a);
  a.text = a.text.replace(/Gib an, wie viele Würfel (.*)\./, 'Wie viele Würfel $1?');
  assert.ok(gemeldet(kopie, a.id), `${a.id}: kein Fehler gemeldet`);
});
