// 0.37: Gesehene Lösung zählt erst am nächsten Tag (ADR 0031), „Lösungen durchgeklickt“, Kontrollliste des Aufgabentesters.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';
import * as K from '../src/gemeinsam/kontrolle.js';
import { reihenfolge } from '../src/admin/aufgabentester.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const neu = () => L.neuerSpeicherstand('5A-K4M2', '5a', '2026-11-17T08:00:00Z');
// Sechs G-Aufgaben eines Lernziels mit AFB II dabei, Zielniveau G.
const lz = pool.kapitel[0].unterkapitel[0].lernziele[0].id;
const gAufgaben = pool.aufgaben.filter((a) => a.lernziel === lz && a.niveau === 'G');
const loese = (stand, a, t, extra = {}) => L.verbuche(stand, a, { geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, karten: [], dauer: 40, ...extra }, 'G', t, index);
const falsch = (stand, a, t, dauer = 40) => L.verbuche(stand, a, { geloest: false, versuche: 2, eingaben: [], fehlvorstellungen: [], hilfen: 1, karten: ['tipp'], dauer }, 'G', t, index);

test('Lösung gesehen: nach zwei Fehlversuchen oder mit Lösungsschritt, nicht mit Tipp oder Beispiel, nie im Einstiegscheck', () => {
  assert.equal(L.loesungGesehen({ richtig: false }), true);
  assert.equal(L.loesungGesehen({ richtig: true, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), true);
  assert.equal(L.loesungGesehen({ richtig: true, karten: ['tipp', 'beispiel'] }), false);
  assert.equal(L.loesungGesehen({ richtig: false, einstieg: true }), false);
});

test('Am selben Tag bringt eine Aufgabe mit gesehener Lösung 1 Münze und zählt nicht fürs Siegel', () => {
  const stand = neu(), [a] = gAufgaben;
  falsch(stand, a, '2026-11-17T08:05:00Z');
  const b = loese(stand, a, '2026-11-17T08:10:00Z');
  assert.equal(b.bekannt, true);
  assert.equal(b.muenzen, 1);
  assert.equal(stand.versuche.at(-1).bekannt, true);
  assert.equal(L.lernzielStand(stand, lz, 'G', index).richtige, 0);
});

test('Ab dem nächsten Tag zählt die Aufgabe wieder normal', () => {
  const stand = neu(), [a] = gAufgaben;
  falsch(stand, a, '2026-11-17T08:05:00Z');
  const b = loese(stand, a, '2026-11-18T08:10:00Z');
  assert.equal(b.bekannt, false);
  assert.ok(b.muenzen > 1);
  assert.equal(L.lernzielStand(stand, lz, 'G', index).richtige, 1);
});

test('Lösungsschritt heute, ohne Kärtchen noch einmal heute: zählt nicht; morgen schon', () => {
  const stand = neu(), [a] = gAufgaben;
  loese(stand, a, '2026-11-17T08:05:00Z', { hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] });
  assert.equal(loese(stand, a, '2026-11-17T08:20:00Z').bekannt, true);
  assert.equal(L.lernzielStand(stand, lz, 'G', index).richtige, 0);
  assert.equal(loese(stand, a, '2026-11-18T08:20:00Z').bekannt, false);
  assert.equal(L.lernzielStand(stand, lz, 'G', index).richtige, 1);
});

test('Durchklicken bringt kein Siegel: sechs Lösungen ansehen, dann alle sechs am selben Tag richtig', () => {
  const stand = neu();
  gAufgaben.forEach((a, i) => falsch(stand, a, `2026-11-17T08:${String(i).padStart(2, '0')}:00Z`, 10));
  gAufgaben.forEach((a, i) => loese(stand, a, `2026-11-17T09:${String(i).padStart(2, '0')}:00Z`));
  assert.equal(stand.lernziele[lz], undefined);
  assert.equal(L.lernzielStand(stand, lz, 'G', index).erreicht, false);
});

test('Lehrkraft: „Lösungen durchgeklickt“ ab 5 der letzten 10 Aufgaben mit gesehener Lösung, je unter 30 Sekunden', () => {
  const jetzt = '2026-11-17T09:00:00Z';
  const stand = neu();
  gAufgaben.slice(0, 4).forEach((a, i) => falsch(stand, a, `2026-11-17T08:0${i}:00Z`, 12));
  assert.equal(A.auffaelligkeiten(stand, 'G', jetzt, false).some((x) => x.art === 'durchgeklickt'), false, 'vier reichen nicht');
  falsch(stand, gAufgaben[4], '2026-11-17T08:05:00Z', 12);
  const treffer = A.auffaelligkeiten(stand, 'G', jetzt, false).find((x) => x.art === 'durchgeklickt');
  assert.ok(treffer);
  assert.match(treffer.text, /^Lösungen durchgeklickt: 5 der letzten 5 Aufgaben/);
  const langsam = neu();
  gAufgaben.slice(0, 5).forEach((a, i) => falsch(langsam, a, `2026-11-17T08:0${i}:00Z`, 45));
  assert.equal(A.auffaelligkeiten(langsam, 'G', jetzt, false).some((x) => x.art === 'durchgeklickt'), false, 'wer sich Zeit nimmt, klickt nicht durch');
});

test('Fingerabdruck: gleich für gleichen Inhalt, unabhängig von der Reihenfolge der Felder, anders bei jeder Änderung', () => {
  const a = pool.aufgaben[0];
  assert.match(K.fingerabdruck(a), /^[0-9a-f]{16}$/);
  const umgestellt = Object.fromEntries(Object.entries(a).reverse());
  assert.equal(K.fingerabdruck(umgestellt), K.fingerabdruck(a));
  assert.notEqual(K.fingerabdruck({ ...a, loesung: 8 }), K.fingerabdruck(a));
  assert.notEqual(K.fingerabdruck({ ...a, hilfen: { ...a.hilfen, tipp: 'anders' } }), K.fingerabdruck(a));
  assert.equal(new Set(pool.aufgaben.map(K.fingerabdruck)).size, pool.aufgaben.length, 'keine zwei Aufgaben gleich');
});

test('Kontrolliert: Laufwerk oder Repository, zurückgenommen schlägt Repository, geänderte Aufgabe verliert das Häkchen', () => {
  const [a, b, c] = pool.aufgaben;
  const repo = { [b.id]: K.fingerabdruck(b), [c.id]: K.fingerabdruck(c) };
  let lw = K.hake({}, a, '2026-11-21T10:00:00Z');
  assert.equal(K.zustand(a, repo, lw).quelle, 'laufwerk');
  assert.equal(K.zustand(b, repo, lw).quelle, 'repo');
  lw = K.nimmZurueck(lw, c, '2026-11-21T10:01:00Z');
  assert.equal(K.zustand(c, repo, lw).kontrolliert, false);
  const geaendert = { ...a, text: `${a.text} ` };
  assert.deepEqual(K.zustand(geaendert, repo, lw), { kontrolliert: false, quelle: null, veraltet: true, t: null });
  const ex = K.alsExport([a, b, c], repo, lw, '2026-11-21T10:02:00Z');
  assert.deepEqual(Object.keys(ex.aufgaben), [a.id, b.id].sort());
  assert.equal(ex.anzahl, 2);
  assert.deepEqual(K.liesExport(JSON.stringify(ex)), ex.aufgaben);
  assert.throws(() => K.liesExport('{"aufgaben":{}}'), /keine Kontrollliste/);
});

test('Aufgabentester: alle Aufgaben in der Reihenfolge Lernziel, dann F, G, M, E', () => {
  const liste = reihenfolge({ 5: pool });
  assert.equal(liste.length, pool.aufgaben.length);
  const erste = liste.slice(0, 24).map(({ a }) => `${a.lernziel}|${a.niveau}`);
  assert.deepEqual([...new Set(erste)], ['F', 'G', 'M', 'E'].map((n) => `${liste[0].a.lernziel}|${n}`));
});

test('Die Kontrollliste im Repository passt zum Aufgabenpool', () => {
  const repo = JSON.parse(readFileSync(new URL('../aufgabenpool/kontrolliert.json', import.meta.url), 'utf8'));
  assert.equal(repo.art, K.EXPORT_ART);
  const nachId = new Map(pool.aufgaben.map((a) => [a.id, a]));
  for (const [k, fp] of Object.entries(repo.aufgaben)) {
    assert.ok(nachId.has(k), `${k} fehlt im Pool`);
    assert.equal(K.fingerabdruck(nachId.get(k)), fp, `${k} hat sich seit dem Häkchen geändert`);
  }
});
