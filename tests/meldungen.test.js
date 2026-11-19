import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../src/gemeinsam/meldungen.js';
import * as L from '../src/schueler/logik.js';
import { readFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));

test('Aufgabenmeldung: Kennung und Art sind Pflicht', () => {
  assert.throws(() => M.neueMeldung({ kennung: '', art: 'loesung', t: 'x' }), /Kennung/);
  assert.throws(() => M.neueMeldung({ kennung: '5.3.1-K1-F-01', art: 'egal', t: 'x' }), /Wähle/);
  const m = M.neueMeldung({ kennung: ' 5.3.1-K1-F-01 ', art: 'unklar', satz: 'x'.repeat(400), klasse: '5a', t: '2026-11-19T10:00:00Z' });
  assert.equal(m.kennung, '5.3.1-K1-F-01'); assert.equal(m.satz.length, M.MAX_SATZ); assert.equal(m.klasse, '5a');
});

test('Aufgabenmeldungen: je Kennung gesammelt, Stand, neue Meldung öffnet wieder', () => {
  const lk = {
    NG: [{ id: 1, t: '2026-11-18T10:00:00Z', kennung: 'A', art: 'loesung', klasse: '5a' }, { id: 2, t: '2026-11-19T09:00:00Z', kennung: 'B', art: 'bild' }],
    HR: [{ id: 3, t: '2026-11-19T11:00:00Z', kennung: 'A', art: 'unklar', klasse: '5b' }],
  };
  const g = M.sammle(lk, { B: { status: 'behoben', t: '2026-11-19T10:00:00Z' }, A: { status: 'kein-fehler', t: '2026-11-19T10:00:00Z' } }, ['B']);
  assert.deepEqual(g.map((x) => x.kennung), ['A', 'B']);
  assert.equal(g[0].meldungen.length, 2); assert.deepEqual(g[0].klassen.sort(), ['5a', '5b']); assert.deepEqual(g[0].arten.sort(), ['loesung', 'unklar']);
  assert.equal(g[0].status, 'offen', 'Meldung nach „kein Fehler“ öffnet wieder');
  assert.equal(g[1].status, 'behoben'); assert.equal(g[1].gesperrt, true);
  const a = pool.aufgaben[0];
  const text = M.alsText(M.sammle({ NG: [{ t: '2026-11-19T09:00:00Z', kennung: a.id, art: 'loesung', satz: 'Stimmt nicht' }] }), (k) => pool.aufgaben.find((x) => x.id === k), '2026-11-19T12:00:00Z');
  assert.match(text, new RegExp(`## ${a.id.replace(/\./g, '\\.')}`));
  assert.match(text, /Lösung im Pool: /); assert.match(text, /NG: Lösung falsch\. Stimmt nicht/);
});

test('Gesperrte Aufgaben: nicht mehr ausgewählt, aus laufenden Listen genommen, Fehlversuche zählen nicht', () => {
  const lz = pool.aufgaben[0].lernziel, niveau = pool.aufgaben[0].niveau;
  const alle = pool.aufgaben.filter((a) => a.lernziel === lz && a.niveau === niveau).map((a) => a.id);
  const gesperrt = alle.slice(0, -1);
  const offen = M.ohneGesperrte(pool, gesperrt);
  assert.equal(offen.aufgaben.length, pool.aufgaben.length - gesperrt.length);
  assert.equal(M.ohneGesperrte(pool, []), pool);
  const index = L.indexiere(offen);
  const stand = L.neuerSpeicherstand('5A-TEST', '5a', '2026-11-19T08:00:00Z');
  for (let i = 0; i < 10; i++) assert.equal(L.naechsteAufgabe(index, stand, lz, niveau).id, alle.at(-1));
  // Vier Fehlversuche an gesperrten Aufgaben machen das Lernziel nicht wackelig.
  stand.versuche = gesperrt.slice(0, 4).map((id, i) => ({ t: `2026-11-19T08:0${i}:00Z`, aufgabe: id, lernziel: lz, niveau, richtig: false, versuche: 2 }));
  stand.rueckblickAktiv = { aufgaben: [gesperrt[0], alle.at(-1)], erledigt: [] };
  stand.aktiv = { aufgabe: gesperrt[1] };
  assert.equal(L.istWackelig(stand, lz), true);
  assert.equal(M.beachteSperren(stand, gesperrt), true);
  assert.equal(L.istWackelig(stand, lz), false);
  assert.deepEqual(stand.rueckblickAktiv.aufgaben, [alle.at(-1)]);
  assert.equal(stand.aktiv, null);
  assert.equal(M.beachteSperren(stand, gesperrt), false, 'zweimal ändert nichts');
});
