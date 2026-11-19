// Torfreigabe (ADR 0022): Die Lehrkraft öffnet Tore je Klasse in beliebiger Reihenfolge und einzelnen Schülern zusätzlich.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';

test('Alte Klassendateien ohne Tore: alles bis zum Aktuellen Kapitel, ohne Aktuelles Kapitel alles', () => {
  assert.deepEqual([...L.einstellungen({ aktuellesKapitel: '5.3' }, CODE, pool).offeneKapitel], ['5.1', '5.2', '5.3']);
  assert.equal(L.einstellungen({}, CODE, pool).offeneKapitel.size, 9);
  assert.equal(L.einstellungen(null, CODE, pool).offeneKapitel.size, 9);
});

test('Freie Reihenfolge, Aktuelles Kapitel immer offen, Einzeltore nur zusätzlich', () => {
  const k = { tore: ['5.5', '5.1', 'gibtsnicht'], aktuellesKapitel: '5.3', toreEinzeln: { [CODE]: ['5.7', '5.1'], '5A-ZZZZ': ['5.9'] } };
  const e = L.einstellungen(k, CODE, pool);
  assert.deepEqual([...e.offeneKapitel], ['5.1', '5.3', '5.5', '5.7']); // in Buchreihenfolge
  assert.deepEqual([...e.zusaetzlicheKapitel], ['5.7']); // 5.1 ist schon für die Klasse offen
  assert.deepEqual([...L.einstellungen(k, '5A-AAAA', pool).offeneKapitel], ['5.1', '5.3', '5.5']);
  // Schließt die Lehrkraft 5.7 für die Klasse, bleibt das Einzeltor.
  assert.equal(L.einstellungen({ tore: [], toreEinzeln: { [CODE]: ['5.7'] } }, CODE, pool).offeneKapitel.has('5.7'), true);
  assert.equal(L.einstellungen({ tore: [] }, CODE, pool).offeneKapitel.size, 0);
});

test('Ankündigung: beim ersten Start keine, danach jedes neue Tor einmal', () => {
  const stand = L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
  assert.deepEqual(L.neueTore(stand, new Set(['5.1'])), []);
  assert.deepEqual(L.neueTore(stand, new Set(['5.1', '5.4'])), ['5.4']);
  L.merkeToreGesehen(stand, ['5.4']);
  assert.deepEqual(L.neueTore(stand, new Set(['5.1', '5.4'])), []);
  // Geschlossen und wieder geöffnet: keine zweite Ankündigung.
  assert.deepEqual(L.neueTore(stand, new Set(['5.4'])), []);
});

test('Startseite: nach geschafftem Klassenkapitel zum zusätzlich geöffneten Tor', () => {
  const stand = L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
  const k = { tore: ['5.3', '5.4'], aktuellesKapitel: '5.4', toreEinzeln: { [CODE]: ['5.3'] } };
  for (const u of pool.kapitel.find((x) => x.id === '5.4').unterkapitel) for (const l of u.lernziele) stand.lernziele[l.id] = { t: 'x' };
  // 5.3 ist für die Klasse offen, kein Einzeltor: weiter im offenen Kapitel 5.3.
  assert.equal(L.etappe(pool, index, stand, L.einstellungen(k, CODE, pool)).kapitel.id, '5.3');
  // Nur 5.4 für die Klasse, 5.3 einzeln: das Einzeltor kommt dran.
  const nur = { tore: ['5.4'], aktuellesKapitel: '5.4', toreEinzeln: { [CODE]: ['5.3'] } };
  assert.equal(L.etappe(pool, index, stand, L.einstellungen(nur, CODE, pool)).kapitel.id, '5.3');
});
