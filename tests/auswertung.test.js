import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';
import * as K from '../src/gemeinsam/krypto.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const JETZT = '2026-11-17T10:30:00Z';
const neu = (code = '5A-AAAA') => L.neuerSpeicherstand(code, '5a', '2026-11-17T10:00:00Z');
const aufgaben = (lz, n) => index.nach.get(`${lz}|${n}`);
const b = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: ['1'], fehlvorstellungen: [], hilfen: 0, dauer: 30, ...extra });
const S2 = '5.3.3-S2';

test('Schülercodes: richtiges Format, eindeutig, ohne verwechselbare Zeichen', () => {
  const codes = [];
  for (let i = 0; i < 200; i++) codes.push(A.erzeugeCode('5a', codes));
  assert.equal(new Set(codes).size, 200);
  for (const c of codes) { assert.ok(L.leseCode(c), c); assert.doesNotMatch(c.slice(3), /[01OIL]/); }
});

test('Kennzahlen eines Schülers', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G'), f = aufgaben(S2, 'F');
  L.verbuche(stand, g[0], b({ dauer: 20 }), 'G', '2026-11-17T10:05:00Z');
  L.verbuche(stand, g[1], b({ geloest: false, versuche: 2, hilfen: 2, dauer: 60, fehlvorstellungen: ['sub-uebertrag-vergessen'] }), 'G', '2026-11-17T10:10:00Z');
  L.verbuche(stand, f[0], b({ hilfen: 3, dauer: 40 }), 'G', '2026-11-17T10:20:00Z');
  stand.geaendert = '2026-11-17T10:20:05Z';
  const k = A.kennzahlen(stand, 'G', JETZT);
  assert.equal(k.bearbeitet, 3);
  assert.equal(k.geloest, 2);
  assert.equal(k.tipp, 2); assert.equal(k.beispiel, 2); assert.equal(k.loesungsschritt, 1);
  assert.equal(k.hilfekaertchen, 5);
  assert.equal(k.zeitMedian, 40);
  assert.equal(Math.round(k.trainingAnteil * 100), 33);
  assert.equal(k.minutenStill, 10);
  assert.deepEqual(k.niveauverlauf, ['G', 'G', 'F']);
});

test('Auffälligkeiten: inaktiv, Raten, Training, viel Arbeit ohne Erfolg', () => {
  const stand = neu();
  const f = aufgaben(S2, 'F'), g = aufgaben(S2, 'G');
  for (let i = 0; i < 6; i++) L.verbuche(stand, f[i], b({ geloest: false, dauer: 3 }), 'G', '2026-11-17T10:05:00Z');
  for (let i = 0; i < 3; i++) L.verbuche(stand, g[i], b({ geloest: false }), 'G', '2026-11-17T10:06:00Z');
  stand.geaendert = '2026-11-17T10:06:00Z';
  const arten = A.auffaelligkeiten(stand, 'G', JETZT).map((x) => x.art);
  assert.deepEqual(arten.sort(), ['inaktiv', 'ohne-erfolg', 'raten', 'training']);
  assert.deepEqual(A.auffaelligkeiten(neu(), 'G', JETZT), []);
});

test('Veränderter Speicherstand fällt auf', () => {
  const stand = neu();
  for (const a of aufgaben(S2, 'G').slice(0, 3)) L.verbuche(stand, a, b(), 'G', JETZT);
  assert.deepEqual(A.pruefeStand(stand, 'G'), []);
  stand.muenzen = 9999;
  stand.lernziele['5.3.3-S5'] = { erreichtAm: JETZT };
  assert.equal(A.pruefeStand(stand, 'G').length, 2);
});

test('Lernzielmatrix und Statistik der Klasse', () => {
  const eins = neu('5A-AAAA'), zwei = neu('5A-BBBB');
  for (const a of aufgaben(S2, 'G').slice(0, 3)) L.verbuche(eins, a, b(), 'G', JETZT);
  L.verbuche(zwei, aufgaben(S2, 'G')[0], b({ geloest: false, fehlvorstellungen: ['sub-uebertrag-vergessen'] }), 'G', JETZT);
  const staende = [{ code: '5A-AAAA', stand: eins }, { code: '5A-BBBB', stand: zwei }];
  const lernziele = A.lernzieleMitAufgaben(pool, index);
  assert.equal(lernziele.length, 11);
  const spalte = lernziele.findIndex((l) => l.id === S2);
  const matrix = A.lernzielmatrix(staende, lernziele, {});
  assert.equal(matrix[0].zellen[spalte].status, 'erreicht');
  assert.equal(matrix[1].zellen[spalte].status, 'begonnen');
  assert.equal(matrix[1].zellen[0].status, 'offen');
  const st = A.lernzielStatistik(staende, lernziele)[spalte];
  assert.equal(st.bearbeitet, 4); assert.equal(st.quote, 0.75); assert.equal(st.erreicht, 1); assert.equal(st.schueler, 2);
  const fehler = A.fehlerStatistik(staende);
  assert.deepEqual(fehler, [{ fehlvorstellung: 'sub-uebertrag-vergessen', anzahl: 1, schueler: [{ code: '5A-BBBB', anzahl: 1 }] }]);
  assert.equal(A.aufgabenStatistik(staende, 2)[0].quote, 0.5);
});

test('Hilfe-Warteschlange: Reihenfolge nach Eingang, gleiche Lernziele werden gezählt', () => {
  const a = neu('5A-AAAA'), c = neu('5A-CCCC'), d = neu('5A-DDDD');
  L.rufeHilfe(a, aufgaben(S2, 'G')[0].id, '2026-11-17T10:20:00Z');
  L.rufeHilfe(c, aufgaben(S2, 'F')[1].id, '2026-11-17T10:10:00Z');
  const schlange = A.warteschlange([{ code: '5A-AAAA', stand: a }, { code: '5A-CCCC', stand: c }, { code: '5A-DDDD', stand: d }], index, JETZT);
  assert.deepEqual(schlange.map((r) => r.code), ['5A-CCCC', '5A-AAAA']);
  assert.equal(schlange[0].wartetMinuten, 20);
  assert.equal(schlange[0].gleiche, 2);
});

test('Klasse hängt: mehrere Schüler scheitern gerade am selben Lernziel', () => {
  const staende = ['5A-AAAA', '5A-BBBB', '5A-CCCC'].map((code) => {
    const stand = neu(code);
    for (const a of aufgaben(S2, 'G').slice(0, 2)) L.verbuche(stand, a, b({ geloest: false }), 'G', JETZT);
    return { code, stand };
  });
  assert.deepEqual(A.klasseHaengt(staende, index), [{ lernziel: S2, codes: ['5A-AAAA', '5A-BBBB', '5A-CCCC'] }]);
  assert.deepEqual(A.klasseHaengt(staende.slice(0, 2), index), []);
});

test('Berichtstabellen: fünf Blätter, Namen aus der Namensliste', () => {
  const stand = neu();
  L.verbuche(stand, aufgaben(S2, 'G')[0], b(), 'G', JETZT);
  const blaetter = A.berichtstabellen([{ code: '5A-AAAA', stand }], pool, index, {}, () => 'Lena Muster', JETZT);
  assert.deepEqual(blaetter.map((x) => x.name), ['Übersicht', 'Lernzielmatrix', 'Lernziele', 'Typische Fehler', 'Versuchsprotokoll']);
  assert.equal(blaetter[0].zeilen[1][0], 'Lena Muster');
  assert.equal(blaetter[4].zeilen.length, 2);
  for (const blatt of blaetter) for (const zeile of blatt.zeilen) assert.equal(zeile.length, blatt.zeilen[0].length, blatt.name);
});

test('Backups: 14 Tage alles, danach eines pro Woche', () => {
  const namen = ['2026-11-17_09-00', '2026-11-10_09-00', '2026-10-28_09-00', '2026-10-27_09-00', '2026-10-26_08-00', '2026-10-20_09-00'];
  assert.deepEqual(A.alteBackups(namen, '2026-11-17T12:00:00').sort(), ['2026-10-27_09-00', '2026-10-28_09-00']);
});

test('Signatur: echte Klassendatei wird angenommen, veränderte abgelehnt', async () => {
  const schluessel = await K.erzeugeSchluessel();
  const datei = await K.unterschreibe({ klasse: '5a', aktuellesKapitel: '5.3' }, schluessel.privat);
  assert.deepEqual(await K.pruefeUnterschrift(datei, schluessel.oeffentlich), { klasse: '5a', aktuellesKapitel: '5.3' });
  assert.equal(await K.pruefeUnterschrift(datei.replace('5.3', '5.9'), schluessel.oeffentlich), null);
  assert.equal(await K.pruefeUnterschrift('{"aktuellesKapitel":"5.9"}', schluessel.oeffentlich), null);
  const fremd = await K.erzeugeSchluessel();
  assert.equal(await K.pruefeUnterschrift(datei, fremd.oeffentlich), null);
  assert.deepEqual(K.liesUngeprueft(datei), { klasse: '5a', aktuellesKapitel: '5.3' });
});
