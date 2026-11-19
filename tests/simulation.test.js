// Simulation einer Testklasse (ADR 0028): simulierte Schüler arbeiten mit der Spiellogik der echten Schüler.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as SIM from '../src/gemeinsam/simulation.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const MIN = 60000;
const JETZT = new Date('2026-11-19T10:00:00').getTime();

function klasse(anzahl = 8, zufallswert = 4711, extra = {}) {
  const leute = SIM.besetzung(anzahl);
  const codes = leute.map((_, i) => `5T-${String.fromCharCode(65 + i)}2${String.fromCharCode(65 + i)}3`);
  const bots = leute.map((l, i) => SIM.neuerBot(codes[i], l.profil, L.neuerSpeicherstand(codes[i], '5t', new Date(JETZT - 50 * 86400000).toISOString()), zufallswert));
  const klassendatei = { codes, tore: ['5.3', '5.4'], aktuellesKapitel: '5.3', zielniveaus: Object.fromEntries(leute.map((l, i) => [codes[i], SIM.PROFILE[l.profil].ziel])), ...extra };
  return { bots, codes, ctx: { pool, index, klassendatei, tempo: 1 } };
}
const zustand = (bots) => JSON.stringify(bots.map((b) => b.stand));

test('Besetzung: Anzahl 5 bis 30, die ersten acht decken jedes Profil ab', () => {
  assert.equal(SIM.besetzung(2).length, 5);
  assert.equal(SIM.besetzung(99).length, 30);
  assert.equal(SIM.besetzung().length, 25);
  assert.deepEqual(new Set(SIM.besetzung(8).map((x) => x.profil)), new Set(Object.keys(SIM.PROFILE)));
  assert.match(SIM.notizFuer('raet'), /rät/);
});

test('Vorlauf: drei Wochen Unterricht mit Einstiegscheck, Siegeln und Rückblick, alles in der Vergangenheit', () => {
  const { bots, ctx } = klasse();
  const stunden = SIM.vorlauf(bots, ctx, 3, JETZT);
  assert.equal(stunden, 9);
  const alle = bots.flatMap((b) => b.stand.versuche);
  assert.ok(alle.length > 150, `nur ${alle.length} Versuche`);
  assert.ok(alle.every((v) => new Date(v.t).getTime() < JETZT));
  assert.ok(alle.some((v) => v.einstieg));
  assert.ok(bots.some((b) => L.siegel(b.stand) >= 2));
  assert.ok(bots.some((b) => (b.stand.rueckblicke ?? []).length > 0));
  assert.ok(bots.every((b) => !b.stand.hilferuf && !b.stand.aktiv));
  // Profile wirken: der Sichere löst mehr als der Blockierte, der Rater rät schnell.
  const quote = (p) => { const v = bots.find((b) => b.profil === p).stand.versuche.filter((x) => !x.einstieg); return v.filter((x) => x.richtig).length / v.length; };
  assert.ok(quote('sicher') > quote('blockiert'));
  assert.ok(bots.find((b) => b.profil === 'raet').stand.versuche.some((v) => v.dauer <= 6 && !v.richtig));
});

test('Gleicher Zufallswert, gleicher Lauf; anderer Zufallswert, anderer Lauf', () => {
  const a = klasse(6, 1), b = klasse(6, 1), c = klasse(6, 2);
  for (const k of [a, b, c]) SIM.vorlauf(k.bots, k.ctx, 1, JETZT);
  assert.equal(zustand(a.bots), zustand(b.bots));
  assert.notEqual(zustand(a.bots), zustand(c.bots));
});

test('Nachholen: ein großer Schritt ergibt dasselbe wie viele kleine (gebremster Hintergrund-Tab)', () => {
  const a = klasse(6, 9), b = klasse(6, 9);
  SIM.starteStunde(a.bots, JETZT, 45); SIM.starteStunde(b.bots, JETZT, 45);
  for (let t = JETZT; t <= JETZT + 20 * MIN; t += 1000) for (const bot of a.bots) SIM.schritt(bot, a.ctx, t);
  for (const bot of b.bots) SIM.schritt(bot, b.ctx, JETZT + 20 * MIN);
  assert.equal(zustand(a.bots), zustand(b.bots));
  assert.ok(a.bots.flatMap((x) => x.stand.versuche).every((v) => new Date(v.t).getTime() <= JETZT + 20 * MIN));
});

test('Live: Schüler arbeiten, zeigen ihre Aufgabe und hören zum Ende gestaffelt auf', () => {
  const { bots, ctx } = klasse(10, 3);
  SIM.starteStunde(bots, JETZT, 45);
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 10 * MIN);
  assert.ok(bots.some((b) => b.stand.aktiv), 'jemand sitzt an einer Aufgabe');
  assert.ok(bots.flatMap((b) => b.stand.versuche).length > 20);
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 45 * MIN);
  assert.ok(bots.every((b) => b.fertig && !b.stand.aktiv && !b.stand.hilferuf));
  const enden = bots.map((b) => b.ende);
  assert.ok(Math.min(...enden) >= JETZT + 40 * MIN - 1 && Math.max(...enden) <= JETZT + 45 * MIN);
  assert.ok(new Set(enden).size > 1, 'gestaffelt');
});

test('Hilferuf wartet auf die Lehrkraft und endet mit ihrer Antwort', () => {
  const { bots, ctx } = klasse(8, 5);
  SIM.starteStunde(bots, JETZT, null);
  let ruf = null, bis = JETZT;
  for (; bis < JETZT + 90 * MIN && !ruf; bis += 30000) for (const b of bots) { SIM.schritt(b, ctx, bis); if (b.stand.hilferuf) ruf = b; }
  assert.ok(ruf, 'jemand ruft Hilfe');
  const seit = ruf.stand.hilferuf.seit;
  SIM.schritt(ruf, ctx, bis + 20 * MIN);
  assert.equal(ruf.stand.hilferuf?.seit, seit, 'ohne Antwort wartet er');
  ctx.klassendatei.hilfe = { [ruf.code]: { zu: seit, status: 'erledigt' } };
  SIM.schritt(ruf, ctx, bis + 21 * MIN);
  assert.equal(ruf.stand.hilferuf, null);
  assert.equal(ruf.stand.hilferufe.at(-1).grund, 'erledigt');
});

test('Reaktionen: Münzgabe wird geöffnet, Sonderauftrag erfüllt, neues Tor betreten', () => {
  const { bots, codes, ctx } = klasse(8, 7);
  const sicher = bots.find((b) => b.profil === 'sicher');
  const lz = [...index.lernzielMitAufgaben].find((l) => l.startsWith('5.3.2'));
  const aufgaben = index.nach.get(`${lz}|G`).slice(0, 3).map((a) => a.id);
  ctx.klassendatei.muenzgaben = { [sicher.code]: [{ id: 'g1', t: new Date(JETZT).toISOString(), muenzen: 500 }] };
  ctx.klassendatei.sonderauftraege = { [sicher.code]: { id: 's1', lernziel: lz, niveau: 'G', aufgaben, belohnung: 250 } };
  SIM.starteStunde(bots, JETZT, null);
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 15 * MIN);
  assert.equal(L.geoeffneteMuenzgabe(sicher.stand, 'g1')?.muenzen, 500);
  assert.equal(sicher.stand.sonderauftraege?.[0]?.bonus, 250);
  ctx.klassendatei.aktuellesKapitel = '5.4';
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 40 * MIN);
  assert.ok(bots.some((b) => b.stand.versuche.some((v) => v.lernziel.startsWith('5.4'))), 'jemand arbeitet im neuen Kapitel');
  assert.ok(codes.length === 8);
});

test('Fortsetzen nach dem Schließen: offene Aufgabe und Hilferuf sind vorbei, die Lücke wird nicht nachgeholt', () => {
  const { bots, ctx } = klasse(5, 11);
  SIM.starteStunde(bots, JETZT, null);
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 10 * MIN);
  const b = bots[0], vorher = b.stand.versuche.length;
  L.rufeHilfe(b.stand, 'x', new Date(JETZT).toISOString());
  const spaeter = JETZT + 16 * 3600000;
  SIM.setzeFort(b, spaeter);
  assert.equal(b.stand.hilferuf, null);
  assert.equal(b.stand.aktiv, null);
  assert.ok(b.naechster >= spaeter);
  SIM.schritt(b, ctx, spaeter);
  assert.equal(b.stand.versuche.length, vorher);
});

test('Spielpause: simulierte Schüler spielen und landen in der Bestenliste', () => {
  const { bots, ctx } = klasse(8, 13);
  SIM.vorlauf(bots, ctx, 1, JETZT);
  ctx.klassendatei.spielpause = true;
  SIM.starteStunde(bots, JETZT, null);
  for (const b of bots) SIM.schritt(b, ctx, JETZT + 15 * MIN);
  assert.ok(bots.some((b) => (b.stand.spiele ?? []).length > 0));
});

test('Schnelllauf 3×: in derselben Zeit etwa dreimal so viele Aufgaben', () => {
  const a = klasse(8, 21), b = klasse(8, 21);
  b.ctx.tempo = 3;
  SIM.starteStunde(a.bots, JETZT, null); SIM.starteStunde(b.bots, JETZT, null);
  for (const x of a.bots) SIM.schritt(x, a.ctx, JETZT + 20 * MIN);
  for (const x of b.bots) SIM.schritt(x, b.ctx, JETZT + 20 * MIN);
  const n = (k) => k.bots.flatMap((x) => x.stand.versuche).length;
  assert.ok(n(b) > 2 * n(a), `${n(b)} gegen ${n(a)}`);
});
