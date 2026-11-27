// Aufgabenführung in Runden, Kronenwahl je Lernziel, Münzen nur für Neues (Version 0.60, ADR 0052).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';
const kap = pool.kapitel.find((k) => k.id === '5.4');
const ms = (id) => kap.unterkapitel.find((u) => u.id === id);
const ok = (x = {}) => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20, ...x });
const neu = () => L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
const einst = () => L.einstellungen({ tore: ['5.4'] }, CODE, pool);
const T = '2026-11-27T09:00:00Z';
// Drei passende Aufgaben eines Lernziels auf Niveau n, die anspruchsvollste zuerst, damit AFB II dabei ist.
const drei = (lz, n, ohne = new Set()) => [...index.nach.get(`${lz}|${n}`)].filter((a) => !ohne.has(a.id)).sort((a, b) => b.afb - a.afb).slice(0, 3);
const loese = (stand, lz, n, ziel = 'M') => drei(lz, n, new Set(stand.versuche.filter((v) => v.richtig).map((v) => v.aufgabe))).map((a) => L.verbuche(stand, a, ok(), ziel, T, index));
const scheitere = (stand, lz, n, mal = 3) => { const liste = index.nach.get(`${lz}|${n}`); for (let i = 0; i < mal; i++) L.verbuche(stand, liste[i], ok({ geloest: false, versuche: 2 }), 'M', T, index); };
const weg = kap.unterkapitel.filter((u) => !L.istAbstecher(u, 'M'));
const lernziele = weg.flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id)).map((l) => l.id);
const [A, B] = ms('5.4.1').lernziele.map((l) => l.id);

test('Absinken gilt nur für das eine Lernziel, das nächste beginnt wieder auf dem Zielniveau', () => {
  const st = neu();
  scheitere(st, A, 'M');
  assert.equal(L.niveauVorschlag(st, '5.4', 'M', 'M', A), 'runter');
  assert.equal(L.niveauVorschlag(st, '5.4', 'M', 'M', B), null, 'B hat keine Fehler');
  L.sinkeAb(st, A, 'G', 'M');
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', A), 'G');
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', B), 'M');
  assert.equal(L.arbeitsniveau(st, '5.4', 'M'), 'M');
});

test('Selbst gewählte höhere Krone gilt, bis das Kind einmal absinkt', () => {
  const st = neu();
  L.setzeNiveau(st, '5.4', 'E');
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', B), 'E');
  L.sinkeAb(st, A, 'M', 'M');
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', B), 'M', 'danach beginnt jedes Lernziel wieder auf Gold');
});

test('Ablehnen: beim nächsten Mal sinkt das Kind von selbst', () => {
  const st = neu();
  scheitere(st, A, 'M');
  L.lehneAbsinkenAb(st, A);
  assert.equal(L.niveauVorschlag(st, '5.4', 'M', 'M', A), null, 'Ruhe direkt nach dem Ablehnen');
  assert.equal(L.sinktVonSelbst(st, A), true);
  scheitere(st, A, 'M');
  assert.equal(L.niveauVorschlag(st, '5.4', 'M', 'M', A), 'runter');
  L.sinkeAb(st, A, 'G', 'M');
  assert.equal(L.sinktVonSelbst(st, A), false);
});

test('Unter dem Ziel geschafft: kein Siegel, nächstes Lernziel, danach 1 Münze auf Silber, volle auf Gold', () => {
  const st = neu();
  scheitere(st, A, 'M');
  L.sinkeAb(st, A, 'G', 'M');
  const b = loese(st, A, 'G');
  assert.deepEqual(b.at(-1).unterZielNeu, { niveau: 'G', mal: 1 });
  assert.equal(b.at(-1).muenzen, L.MUENZEN.training * (drei(A, 'G').at(-1).afb === 3 ? 1.5 : 1), 'Silber ist Training: 10 Münzen');
  assert.equal(st.lernziele[A], undefined, 'kein Siegel');
  assert.equal(L.unterZielGeschafft(st, A).mal, 1);
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', A), 'M', 'das nächste Mal beginnt es wieder auf Gold');
  assert.equal(L.lernzielErledigt(index, st, A, 'M', 'M'), true);
  assert.equal(L.naechstesLernziel(index, st, ms('5.4.1'), 'M', 'M').id, B);
  const nochSilber = index.nach.get(`${A}|G`).find((a) => !st.versuche.some((v) => v.aufgabe === a.id));
  assert.equal(L.verbuche(st, nochSilber, ok(), 'M', T, index).muenzen, 1, 'Silber geschafft: nur noch 1 Münze');
  const gold = index.nach.get(`${A}|M`).find((a) => !st.versuche.some((v) => v.aufgabe === a.id) && a.afb !== 3);
  assert.equal(L.verbuche(st, gold, ok(), 'M', T, index).muenzen, 20, 'auf Gold gibt es weiter volle Münzen');
});

test('Mit Siegel bringen Aufgaben nur noch Münzen für eine bessere Krone', () => {
  const st = neu();
  loese(st, B, 'M');
  assert.ok(st.lernziele[B]);
  const gold = index.nach.get(`${B}|M`).find((a) => !st.versuche.some((v) => v.aufgabe === a.id));
  assert.equal(L.verbuche(st, gold, ok(), 'M', T, index).muenzen, 1);
  const purpur = index.nach.get(`${B}|E`)?.find((a) => a.afb !== 3);
  if (purpur) assert.equal(L.verbuche(st, purpur, ok(), 'M', T, index).muenzen, 25);
  // Rückblick und Seitenblick bringen weiter ihre Münzen.
  const silber = index.nach.get(`${B}|G`)[0];
  assert.equal(L.verbuche(st, silber, ok(), 'M', T, index, { seitenblick: true }).muenzen, 10);
});

test('Runden: erst der ganze Lernpfad, dann vorn wieder auf Gold, nach zweimal unter dem Ziel schlägt die Führung es nicht mehr vor', () => {
  const st = neu(), e = einst();
  // Runde 1: A nur auf Silber, alle anderen mit Siegel.
  scheitere(st, A, 'M'); L.sinkeAb(st, A, 'G', 'M'); loese(st, A, 'G');
  for (const lz of lernziele.filter((x) => x !== A)) loese(st, lz, 'M');
  assert.equal(L.runde(st, '5.4'), 1);
  const m = L.fuehrungsMeilenstein(index, st, kap, e, 'M');
  assert.equal(m?.id, '5.4.1', 'zweite Runde beginnt vorn');
  assert.equal(L.runde(st, '5.4'), 2);
  assert.equal(L.naechstesLernziel(index, st, m, 'M', 'M').id, A);
  assert.equal(L.arbeitsniveau(st, '5.4', 'M', A), 'M', 'in Runde 2 wieder auf Gold');
  // Runde 2: wieder nur Silber. Ältere Silber-Aufgaben aus Runde 1 zählen nicht mit.
  scheitere(st, A, 'M');
  L.sinkeAb(st, A, 'G', 'M');
  const erste = [...index.nach.get(`${A}|G`)].sort((a, b) => b.afb - a.afb)[0];
  assert.equal(L.verbuche(st, erste, ok(), 'M', '2026-11-28T09:00:00Z', index).unterZielNeu, null, 'eine Aufgabe reicht in Runde 2 nicht');
  const alle = index.nach.get(`${A}|G`).filter((a) => a.id !== erste.id);
  let zuletzt;
  for (const a of alle.slice(0, 2)) zuletzt = L.verbuche(st, a, ok(), 'M', '2026-11-28T09:01:00Z', index);
  assert.deepEqual(zuletzt.unterZielNeu, { niveau: 'G', mal: 2 });
  assert.equal(L.unterZielAufgegeben(st, A), true);
  assert.equal(L.fuehrungsMeilenstein(index, st, kap, e, 'M'), null, 'nichts mehr vorzuschlagen, keine dritte Runde');
  assert.equal(L.runde(st, '5.4'), 2);
});

test('Wer sich selbst auf Silber setzt, geht den Lernpfad auf Silber und spielt in Runde 2 wieder um Gold', () => {
  const st = neu(), e = einst();
  L.setzeNiveau(st, '5.4', 'G');
  for (const lz of lernziele) loese(st, lz, 'G');
  assert.ok(lernziele.every((lz) => L.unterZielGeschafft(st, lz)?.mal === 1));
  assert.equal(L.fuehrungsMeilenstein(index, st, kap, e, 'G').id, weg[0].id);
  assert.equal(L.runde(st, '5.4'), 2);
  assert.equal(L.arbeitsniveau(st, '5.4', 'M'), 'M');
});

test('Vorschlag „hoch“ nur noch bei Zielniveau Silber, nie zu Purpur', () => {
  const st = neu();
  const g = index.nach.get(`${A}|G`).concat(index.nach.get(`${B}|G`));
  for (let i = 0; i < 10; i++) L.verbuche(st, g[i % g.length], ok(), 'G', T, index);
  assert.equal(L.niveauVorschlag(st, '5.4', 'G', 'G', A), 'hoch');
  assert.equal(L.niveauVorschlag(st, '5.4', 'G', 'M', A), null);
});
