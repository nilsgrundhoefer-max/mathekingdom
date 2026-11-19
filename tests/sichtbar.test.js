// Lernen sichtbar machen (ADR 0017): überwunden, Hilfebedarf, gefestigt, Diskrepanz, Versuchsverlauf.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const neu = (code = '5A-AAAA') => L.neuerSpeicherstand(code, '5a', '2026-11-01T10:00:00Z');
const v = (lernziel, extra = {}) => ({ t: '2026-11-17T10:00:00Z', aufgabe: 'x', lernziel, niveau: 'M', richtig: true, versuche: 1, eingaben: ['1'], fehlvorstellungen: [], hilfen: 0, dauer: 20, ...extra });
const zeit = (i) => new Date(Date.UTC(2026, 10, 17, 10, i)).toISOString();

test('Fehlvorstellung: aktiv, nach drei richtigen ohne sie überwunden, beim Wiederauftauchen wieder aktiv', () => {
  const f = 'sub-uebertrag-vergessen';
  const liste = [v('A', { richtig: false, fehlvorstellungen: [f], t: zeit(1) }), v('A', { t: zeit(2) }), v('B', { t: zeit(3) }), v('A', { t: zeit(4) })];
  assert.equal(L.fehlvorstellungsStand(liste)[0].status, 'aktiv', 'B zählt nicht, nur zwei richtige bei A');
  liste.push(v('A', { richtig: false, t: zeit(5) }));
  assert.equal(L.fehlvorstellungsStand(liste)[0].status, 'aktiv', 'falsche Aufgabe zählt nicht');
  liste.push(v('A', { t: zeit(6) }));
  const e = L.fehlvorstellungsStand(liste)[0];
  assert.equal(e.status, 'ueberwunden');
  assert.equal(e.ueberwundenAm, zeit(6));
  // Richtig im zweiten Versuch, aber mit dem Fehler im ersten: wieder aktiv, der erste Aha-Moment bleibt stehen.
  liste.push(v('A', { versuche: 2, fehlvorstellungen: [f], t: zeit(7) }));
  const wieder = L.fehlvorstellungsStand(liste)[0];
  assert.equal(wieder.status, 'aktiv');
  assert.equal(wieder.anzahl, 2);
  assert.equal(wieder.ueberwundenAm, zeit(6));
});

test('Hilfebedarf: nur Beispiel und Lösungsschritt zählen, viel ab der Hälfte, Trend ab sechs Aufgaben', () => {
  const stand = neu();
  const mit = (karten) => v('A', { karten, hilfen: karten.length });
  stand.versuche.push(mit(['tipp']), mit(['tipp', 'beispiel']), mit([]));
  let h = L.hilfebedarf(stand, 'A');
  assert.equal(h.mitHilfe, 1);
  assert.equal(h.viel, false, 'unter vier Aufgaben nie viel');
  assert.equal(h.trend, null);
  stand.versuche.push(mit(['tipp', 'beispiel', 'loesungsschritt']));
  h = L.hilfebedarf(stand, 'A');
  assert.equal(h.viel, true, '2 von 4');
  stand.versuche.push(mit([]), mit(['tipp']), mit([]), mit([]));
  h = L.hilfebedarf(stand, 'A');
  assert.equal(h.bearbeitet, 8);
  assert.equal(h.viel, false, '2 von 8');
  assert.equal(h.trend, 'weniger', `vorher ${h.vorher}, nachher ${h.nachher}`);
  // Alte Einträge ohne karten: hilfen = 2 heißt Tipp und Beispiel.
  assert.equal(L.brauchteHilfe({ hilfen: 2 }), true);
  assert.equal(L.brauchteHilfe({ hilfen: 1 }), false);
});

test('Erstmals ohne Hilfe: nur nach vorheriger Hilfe und nur beim ersten Mal', () => {
  const stand = neu();
  stand.versuche.push(v('A', { karten: ['tipp', 'beispiel'], hilfen: 2 }), v('A'));
  assert.equal(L.erstmalsOhneHilfe(stand), true);
  stand.versuche.push(v('A'));
  assert.equal(L.erstmalsOhneHilfe(stand), false, 'zweites Mal ohne Hilfe');
  const ohne = neu();
  ohne.versuche.push(v('B'));
  assert.equal(L.erstmalsOhneHilfe(ohne), false, 'nie Hilfe gebraucht');
});

test('Verbuchen meldet „erstmals ohne Hilfe“ nur beim Üben am Meilenstein', () => {
  const stand = neu();
  const g = index.nach.get('5.3.3-S2|G');
  const b = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: ['1'], fehlvorstellungen: [], hilfen: 0, dauer: 30, ...extra });
  L.verbuche(stand, g[0], b({ hilfen: 2, karten: ['tipp', 'beispiel'] }), 'G', zeit(1), index);
  assert.equal(L.verbuche(stand, g[1], b(), 'G', zeit(2), index).ohneHilfe, true);
  const zwei = neu();
  L.verbuche(zwei, g[0], b({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'G', zeit(1), index);
  assert.equal(L.verbuche(zwei, g[1], b(), 'G', zeit(2), index, { seitenblick: true }).ohneHilfe, false);
});

test('Mut-Satz: nach „unsicher“ und im ersten Versuch richtig, höchstens einmal je Wegstück', () => {
  const stand = neu();
  stand.wegstueck = { t: zeit(1), aufgaben: [] };
  stand.versuche.push(v('A', { sicher: true }));
  assert.equal(L.mutSatzFaellig(stand), false, 'sicher');
  stand.versuche.push(v('A', { sicher: false, versuche: 2 }));
  assert.equal(L.mutSatzFaellig(stand), false, 'erst im zweiten Versuch');
  stand.versuche.push(v('A', { sicher: false }));
  assert.equal(L.mutSatzFaellig(stand), true);
  stand.versuche.push(v('A', { sicher: false }));
  assert.equal(L.mutSatzFaellig(stand), false, 'schon in diesem Wegstück');
  stand.wegstueck = { t: zeit(9), aufgaben: [] };
  assert.equal(L.mutSatzFaellig(stand), true, 'neues Wegstück');
});

test('Gefestigt: Rückblick oder Seitenblick richtig, mindestens 7 Tage nach dem Siegel; aufzufrischen geht vor', () => {
  const stand = neu();
  stand.lernziele.A = { erreichtAm: '2026-11-01T10:00:00Z' };
  stand.versuche.push(v('A', { t: '2026-11-05T10:00:00Z', rueckblick: true }));
  assert.equal(L.istGefestigt(stand, 'A'), false, 'nach 4 Tagen');
  stand.versuche.push(v('A', { t: '2026-11-09T10:00:00Z' }));
  assert.equal(L.istGefestigt(stand, 'A'), false, 'normale Übung zählt nicht');
  stand.versuche.push(v('A', { t: '2026-11-09T11:00:00Z', seitenblick: true, richtig: false }));
  assert.equal(L.istGefestigt(stand, 'A'), false, 'falscher Seitenblick');
  stand.versuche.push(v('A', { t: '2026-11-09T12:00:00Z', seitenblick: true }));
  assert.equal(L.istGefestigt(stand, 'A'), true);
  assert.equal(A.lernzielZustand(stand, 'A'), 'gefestigt');
  assert.equal(A.hatSiegel('gefestigt'), true);
  stand.rueckblick = { A: { stufe: 1, aufzufrischen: true } };
  assert.equal(A.lernzielZustand(stand, 'A'), 'aufzufrischen');
  assert.equal(L.istGefestigt(neu(), 'A'), false, 'ohne Siegel');
});

test('Heatmap nach Fehlvorstellung: nur Fehler, die vorkamen, nur aus den gewählten Lernzielen', () => {
  const lz = '5.3.3-S2';
  const f = 'sub-uebertrag-vergessen';
  const a = neu('5A-AAAA'), b = neu('5A-BBBB');
  a.versuche.push(v(lz, { richtig: false, fehlvorstellungen: [f], t: zeit(1) }));
  b.versuche.push(v(lz, { richtig: false, fehlvorstellungen: [f], t: zeit(1) }), v(lz, { t: zeit(2) }), v(lz, { t: zeit(3) }), v(lz, { t: zeit(4) }));
  b.versuche.push(v('5.4.6-D1', { richtig: false, fehlvorstellungen: ['div-rest-vergessen'], t: zeit(5) }));
  const m = A.fehlvorstellungsMatrix([{ code: a.code, stand: a }, { code: b.code, stand: b }], pool, [lz]);
  assert.deepEqual(m.spalten.map((s) => s.fehlvorstellung), [f]);
  assert.equal(m.spalten[0].aktiv, 1);
  assert.equal(m.spalten[0].ueberwunden, 1);
  assert.equal(m.zeilen[0].zellen[0].status, 'aktiv');
  assert.equal(m.zeilen[1].zellen[0].status, 'ueberwunden');
  assert.ok(A.fehlvorstellungenZu(pool, [lz]).has(f));
  assert.equal(m.nieGezeigt, A.fehlvorstellungenZu(pool, [lz]).size - 1);
});

test('Diskrepanz: überschätzt bei drei „sicher falsch“, unterschätzt bei halb „unsicher richtig“ ab sechs', () => {
  const stand = neu();
  for (let i = 0; i < 2; i++) stand.versuche.push(v('A', { sicher: true, richtig: false, versuche: 2 }));
  assert.equal(A.diskrepanz(stand, pool).ueberschaetzt, false);
  stand.versuche.push(v('A', { sicher: true, richtig: true, versuche: 2 }));
  const d = A.diskrepanz(stand, pool);
  assert.equal(d.ueberschaetzt, true, 'auch im zweiten Versuch richtig ist sicher falsch');
  assert.match(d.gruende.ueber[0], /3-mal sicher falsch/);
  const u = neu();
  for (let i = 0; i < 5; i++) u.versuche.push(v('A', { sicher: false, richtig: i < 3 }));
  assert.equal(A.diskrepanz(u, pool).unterschaetzt, false, 'erst 5 unsichere');
  u.versuche.push(v('A', { sicher: false, richtig: false }));
  assert.equal(A.diskrepanz(u, pool).unterschaetzt, true, '3 von 6');
  // Nach 20 weiteren Aufgaben ohne Sicherheitsangabe ist das Fenster leer.
  for (let i = 0; i < 20; i++) u.versuche.push(v('A'));
  assert.equal(A.diskrepanz(u, pool).unterschaetzt, false);
});

test('Versuchsverlauf: neueste zuerst, erster und zweiter Versuch, Hilfekärtchen und Art', () => {
  const stand = neu();
  stand.versuche.push(v('A', { eingaben: ['12', '14'], versuche: 2, fehlvorstellungen: ['f1'], karten: ['tipp'], hilfen: 1, t: zeit(1) }),
    v('A', { eingaben: [{ z: '3', n: '4' }], seitenblick: true, t: zeit(2) }));
  const vl = A.versuchsverlauf(stand);
  assert.equal(vl.length, 2);
  assert.equal(vl[0].art, 'Seitenblick');
  assert.equal(vl[0].erster, 'z: 3, n: 4');
  assert.equal(vl[0].zweiter, null);
  assert.deepEqual([vl[1].erster, vl[1].zweiter], ['12', '14']);
  assert.deepEqual(vl[1].karten, ['tipp']);
  assert.equal(A.versuchsverlauf(stand, 1).length, 1);
});

test('Pool: jede Aufgabe hat eine prozessbezogene Kompetenz, jede Fehlvorstellung einen Kindersatz, jedes Lernziel Voraussetzungen', () => {
  const erlaubt = Object.keys(pool.kompetenzen);
  assert.deepEqual(erlaubt.sort(), [...A.KOMPETENZ_REIHE].sort());
  for (const a of pool.aufgaben) {
    assert.ok(Array.isArray(a.kompetenz) && a.kompetenz.length >= 1 && a.kompetenz.length <= 2, a.id);
    for (const k of a.kompetenz) assert.ok(erlaubt.includes(k), `${a.id}: ${k}`);
  }
  // Jede Kompetenz kommt vor, damit das Profil keine Achse hat, die nie gefüllt wird.
  for (const k of erlaubt) assert.ok(pool.aufgaben.some((a) => a.kompetenz.includes(k)), k);
  for (const [id, f] of Object.entries(pool.fehlvorstellungen)) assert.match(f.kind, /^Du /, id);
  for (const l of pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele)) assert.ok(Array.isArray(l.voraussetzungen), l.id);
});

test('Kompetenzprofil: Haupt- und Nebenkompetenz zählen, nur erster Versuch ohne Beispiel und Lösungsschritt, ab sechs Aufgaben', () => {
  const sach = pool.aufgaben.filter((a) => a.kompetenz[0] === 'modellieren').slice(0, 6);
  const versuche = sach.map((a, i) => v(a.lernziel, { aufgabe: a.id, richtig: i !== 0, versuche: i === 1 ? 2 : 1, karten: i === 2 ? ['tipp', 'beispiel'] : i === 3 ? ['tipp'] : [] }));
  const p = A.kompetenzProfil(versuche.slice(0, 5), index);
  assert.equal(p.modellieren.bearbeitet, 5);
  assert.equal(p.modellieren.quote, null, 'unter sechs Aufgaben');
  const q = A.kompetenzProfil(versuche, index);
  assert.equal(q.modellieren.gut, 3, 'Nr. 0 falsch, Nr. 1 im zweiten Versuch, Nr. 2 mit Beispiel; der Tipp schadet nicht');
  assert.equal(q.modellieren.quote, 0.5);
  const neben = sach.filter((a) => a.kompetenz[1]).length;
  for (const k of A.KOMPETENZ_REIHE) if (k !== 'modellieren') assert.equal(q[k].bearbeitet, sach.filter((a) => a.kompetenz[1] === k).length);
  assert.ok(neben >= 0);
});

test('Baut auf: Voraussetzungen und was darauf aufbaut', () => {
  const b = A.bautAuf(pool, '5.3.3-S2');
  assert.deepEqual(b.auf.map((l) => l.id), ['5.3.1-K2', '5.3.2-A2']);
  assert.ok(b.darauf.some((l) => l.id === '5.3.3-S3'));
  assert.deepEqual(A.bautAuf(pool, '5.4.1-K1').auf, [], 'Einmaleins: nur Grundschulstoff');
});

test('Aha-Momente: nur überwundene Fehler, neueste zuerst, gesehen wird gemerkt', () => {
  const stand = neu();
  const f = 'sub-uebertrag-vergessen', g = 'sub-addiert';
  stand.versuche.push(v('A', { richtig: false, fehlvorstellungen: [f], t: zeit(1) }), v('A', { t: zeit(2) }), v('A', { t: zeit(3) }), v('A', { t: zeit(4) }),
    v('B', { richtig: false, fehlvorstellungen: [g], t: zeit(5) }));
  let aha = L.ahaMomente(stand);
  assert.deepEqual(aha.map((a) => a.fehlvorstellung), [f], 'offener Fehler g erscheint nicht');
  assert.equal(aha[0].neu, true);
  assert.equal(L.merkeAhaGesehen(stand), true);
  assert.equal(L.merkeAhaGesehen(stand), false);
  assert.equal(L.ahaMomente(stand)[0].neu, false);
  stand.versuche.push(v('B', { t: zeit(6) }), v('B', { t: zeit(7) }), v('B', { t: zeit(8) }), v('A', { richtig: false, fehlvorstellungen: [f], t: zeit(9) }));
  aha = L.ahaMomente(stand);
  assert.deepEqual(aha.map((a) => a.fehlvorstellung), [g, f], 'f bleibt stehen, obwohl er wieder auftaucht');
  assert.deepEqual(aha.map((a) => a.neu), [true, false]);
});
