import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/gemeinsam/protokoll.js';

test('Betriebsprotokoll: behält nur die neuesten Einträge', () => {
  const liste = [];
  for (let i = 0; i < 60; i++) P.trage(liste, { t: String(i), art: 'start', text: '' }, P.MAX_SCHUELER);
  assert.equal(liste.length, 50);
  assert.equal(liste[0].t, '10');
  assert.equal(liste.at(-1).t, '59');
});

test('Betriebsprotokoll: Browser wird lesbar benannt', () => {
  assert.equal(P.browserName('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36 Edg/131.0.2903.70'), 'Edge 131');
  assert.equal(P.browserName('Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36'), 'Chrome 130');
});

test('Betriebsprotokoll: Start online ist kein Problem', () => {
  const e = P.starteintrag({ t: 'x', version: 'Version 0.3', dashboard: 'online', aufgaben: 'online', klassendatei: 'ok', browser: 'Edge 131' });
  assert.equal(e.art, 'start');
  assert.match(e.text, /online von GitHub, Version 0\.3, Aufgaben online von GitHub, Klassendatei ok, Edge 131/);
});

test('Betriebsprotokoll: Start aus der Kopie ist ein Problem, auch ohne genannten Grund', () => {
  const e = P.starteintrag({ t: 'x', version: 'Version 0.3', dashboard: 'kopie', aufgaben: 'klassenordner', aufgabenGrund: P.fehlergrund(null, 404), browser: 'Edge 131' });
  assert.equal(e.art, 'problem');
  assert.match(e.text, /Kopie im Klassenordner/);
  assert.match(e.text, /GitHub nicht erreichbar/);
  assert.match(e.text, /404/);
});

test('Betriebsprotokoll: Datei ohne Netz ist kein Problem', () => {
  assert.equal(P.starteintrag({ t: 'x', version: 'v', dashboard: 'ohne-netz', browser: 'b' }).art, 'start');
});

test('Betriebsprotokoll: Gründe in Worten', () => {
  assert.match(P.fehlergrund(null, 404), /Pages/);
  assert.match(P.fehlergrund(null, 500), /500/);
  assert.match(P.fehlergrund({ name: 'TimeoutError' }), /nicht rechtzeitig/);
  assert.match(P.fehlergrund(new TypeError('Failed to fetch')), /nicht erreichbar \(Failed to fetch\)/);
});

test('Betriebsprotokoll: sammelt Klasse und Lehrkraft, neueste zuerst, Export ohne Namen', () => {
  const staende = [{ code: '5A-AAAA', stand: { betrieb: [{ t: '2026-11-18T08:00:00Z', art: 'problem', text: 'GitHub' }] } },
    { code: '5A-BBBB', stand: { versuche: [] } }];
  const lehrer = [{ t: '2026-11-18T09:00:00Z', art: 'start', text: 'L' }, { t: '2026-11-18T07:00:00Z', art: 'problem', text: 'andere', klasse: '6b' }];
  const alle = P.sammle(staende, lehrer, '5a', () => 'Lena Müller');
  assert.deepEqual(alle.map((e) => e.wer), ['Lehrkraft', 'Lena Müller']);
  const text = P.alsText(alle, '5a', '2026-11-18T10:00:00Z');
  assert.match(text, /5A-AAAA/);
  assert.doesNotMatch(text, /Lena/);
  assert.match(text, /PROBLEM/);
});
