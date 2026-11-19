// Sonderauftrag (ADR 0021): Die Lehrkraft schickt einem Schüler 3 bis 5 Aufgaben zu einem Lernziel, mit 100 Münzen beim Abschluss.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as A from '../src/lehrer/auswertung.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';
const neu = () => L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
const ok = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20, ...extra });
const LZ = '5.3.3-S2';
const aufgaben = (lz, n) => index.nach.get(`${lz}|${n}`);
const auftrag = (ids, extra = {}) => ({ id: '2026-11-19T10:05:00Z', t: '2026-11-19T10:05:00Z', lernziel: LZ, niveau: 'G', aufgaben: ids, ...extra });
const einst = (eintrag) => L.einstellungen({ codes: [CODE], sonderauftraege: { [CODE]: eintrag } }, CODE, pool);

test('Klassendatei: Der Sonderauftrag kommt nur beim eigenen Code an, höchstens 5 Aufgaben', () => {
  const ids = aufgaben(LZ, 'G').map((a) => a.id);
  const e = einst(auftrag(ids));
  assert.equal(e.sonderauftrag.aufgaben.length, L.SONDERAUFTRAG_MAX);
  assert.equal(L.einstellungen({ sonderauftraege: { [CODE]: auftrag(ids) } }, '5A-ZZZZ', pool).sonderauftrag, null);
  assert.equal(L.einstellungen({}, CODE, pool).sonderauftrag, null);
});

test('Ablauf: öffnen, Aufgaben der Reihe nach, am Ende 100 Münzen, egal wie viele richtig, danach erledigt', () => {
  const stand = neu();
  const ids = aufgaben(LZ, 'G').slice(0, 3).map((a) => a.id);
  const sa = einst(auftrag(ids)).sonderauftrag;
  assert.equal(L.offenerSonderauftrag(stand, sa).geoeffnet, false);
  L.oeffneSonderauftrag(stand, sa, { lernziel: '5.3.1-K1' }, '2026-11-19T10:06:00Z');
  assert.equal(L.offenerSonderauftrag(stand, sa).geoeffnet, true);
  let muenzen = 0, ergebnis;
  for (const [i, id] of ids.entries()) {
    assert.equal(L.naechsteSonderauftragAufgabe(stand, sa), id);
    const a = index.aufgabe.get(id);
    const b = L.verbuche(stand, a, ok({ geloest: i !== 1, versuche: i === 1 ? 2 : 1 }), 'M', '2026-11-19T10:07:00Z', index, { sonderauftrag: sa.id });
    muenzen += b.muenzen;
    ergebnis = L.trageSonderauftragEin(stand, sa, a, i !== 1, '2026-11-19T10:07:00Z');
  }
  assert.deepEqual({ fertig: ergebnis.fertig, richtig: ergebnis.richtig, gesamt: ergebnis.gesamt, bonus: ergebnis.bonus }, { fertig: true, richtig: 2, gesamt: 3, bonus: 100 });
  assert.deepEqual(ergebnis.zurueck, { lernziel: '5.3.1-K1' });
  assert.equal(stand.muenzen, muenzen + 100);
  assert.equal(L.offenerSonderauftrag(stand, sa), null, 'erledigt');
  assert.equal(L.oeffneSonderauftrag(stand, sa, null, '2026-11-19T10:08:00Z'), null, 'kein zweites Mal');
  assert.ok(stand.versuche.every((v) => v.sonderauftrag === sa.id), 'im Versuchsprotokoll markiert');
  assert.equal(A.sonderauftragStand(stand, sa).status, 'erledigt');
});

test('Zählt fürs Lernziel, aber nicht für Selbsteinschätzung und Grundlagen-Schleife', () => {
  const stand = neu();
  const g = aufgaben(LZ, 'G');
  const ms = index.meilensteinVon.get(LZ);
  L.merkeWahl(stand, index, ms, 'M', '2026-11-19T10:00:00Z');
  // Zwei G-Aufgaben trotz Lösungsschritt nicht gelöst: Beim eigenen Üben würde die Grundlagen-Schleife beginnen.
  for (const a of g.slice(0, 3)) {
    const b = L.verbuche(stand, a, ok({ geloest: false, versuche: 2, karten: ['tipp', 'beispiel', 'loesungsschritt'], hilfen: 3 }), 'G', '2026-11-19T10:05:00Z', index, { sonderauftrag: 'x' });
    assert.equal(b.grundlage, null);
  }
  assert.equal(L.inGrundlage(stand, LZ), false);
  assert.equal(stand.einschaetzung[ms.id].abstieg, undefined, 'keine Selbsteinschätzung');
  // Richtig auf dem Zielniveau: zählt für das Siegel.
  const s2 = neu();
  for (const a of g.slice(0, 6)) L.verbuche(s2, a, ok(), 'G', '2026-11-19T10:05:00Z', index, { sonderauftrag: 'x' });
  assert.ok(s2.lernziele[LZ], 'Siegel aus dem Sonderauftrag');
});

test('Zurückgezogen oder ersetzt: Der laufende Auftrag wird verworfen, ohne Bonus, Münzen bleiben', () => {
  const stand = neu();
  const ids = aufgaben(LZ, 'G').slice(0, 3).map((a) => a.id);
  const sa = einst(auftrag(ids)).sonderauftrag;
  L.oeffneSonderauftrag(stand, sa, null, '2026-11-19T10:06:00Z');
  const a = index.aufgabe.get(ids[0]);
  L.verbuche(stand, a, ok(), 'M', '2026-11-19T10:07:00Z', index, { sonderauftrag: sa.id });
  L.trageSonderauftragEin(stand, sa, a, true, '2026-11-19T10:07:00Z');
  const vorher = stand.muenzen;
  assert.equal(L.gleicheSonderauftragAb(stand, null), true);
  assert.equal(stand.sonderauftrag, null);
  assert.equal(stand.muenzen, vorher);
  assert.equal((stand.sonderauftraege ?? []).length, 0);
  assert.equal(L.gleicheSonderauftragAb(stand, null), false, 'nichts mehr zu tun');
  // Ein neuer Auftrag beginnt von vorn.
  const neuer = einst(auftrag(ids, { id: '2026-11-19T11:00:00Z' })).sonderauftrag;
  assert.equal(L.offenerSonderauftrag(stand, neuer).erledigt, 0);
});

test('Lehrkraft: schwächste Lernziele zuerst, Voraussetzungen dazu, ungelöste Aufgaben zuerst', () => {
  const stand = neu();
  const g = aufgaben(LZ, 'G');
  for (const a of g.slice(0, 4)) L.verbuche(stand, a, ok({ geloest: false, versuche: 2 }), 'G', '2026-11-19T10:05:00Z', index);
  const anderes = '5.3.1-K1';
  const a1 = aufgaben(anderes, 'G')[0];
  L.verbuche(stand, a1, ok({ geloest: false, versuche: 2 }), 'G', '2026-11-19T10:06:00Z', index);
  const schwach = A.schwaechsteLernziele(stand, index);
  assert.equal(schwach[0].lernziel, LZ, 'das wackelige Lernziel vorn');
  assert.equal(schwach[0].zustand, 'wackelig');
  const vor = A.voraussetzungenVon(index, schwach.map((x) => x.lernziel));
  assert.ok(vor.every((id) => index.lernzielMitAufgaben.has(id) && !schwach.some((x) => x.lernziel === id)));
  // Auf G sind 4 von 6 bearbeitet und nicht gelöst: zuerst die zwei nie bearbeiteten, dann die nicht gelösten.
  const wahl = A.sonderauftragAufgaben(index, stand, LZ, 'G', 4);
  assert.deepEqual(wahl.aufgaben.slice(0, 2).sort(), g.slice(4, 6).map((a) => a.id).sort());
  assert.equal(wahl.ungeloest, 6);
  assert.equal(wahl.nachbar, null);
  // Alles gelöst: Das Dashboard schlägt ein Nachbarniveau vor.
  const fertig = neu();
  for (const a of g) L.verbuche(fertig, a, ok(), 'G', '2026-11-19T10:05:00Z', index);
  const knapp = A.sonderauftragAufgaben(index, fertig, LZ, 'G', 4);
  assert.equal(knapp.ungeloest, 0);
  assert.ok(['F', 'M'].includes(knapp.nachbar));
  assert.equal(knapp.aufgaben.length, 4, 'trotzdem genug Aufgaben, nur schon gelöst');
});

test('Lehrkraft sieht gesendet, geöffnet mit Fortschritt und Fehlvorstellungen', () => {
  const stand = neu();
  const ids = aufgaben(LZ, 'G').slice(0, 3).map((a) => a.id);
  const sa = einst(auftrag(ids)).sonderauftrag;
  assert.equal(A.sonderauftragStand(stand, sa).status, 'gesendet');
  L.oeffneSonderauftrag(stand, sa, null, '2026-11-19T10:06:00Z');
  const a = index.aufgabe.get(ids[0]);
  L.verbuche(stand, a, ok({ geloest: false, versuche: 2, fehlvorstellungen: ['test-fehler'] }), 'M', '2026-11-19T10:07:00Z', index, { sonderauftrag: sa.id });
  L.trageSonderauftragEin(stand, sa, a, false, '2026-11-19T10:07:00Z');
  const st = A.sonderauftragStand(stand, sa);
  assert.deepEqual([st.status, st.erledigt, st.gesamt, st.fehlvorstellungen], ['geoeffnet', 1, 3, ['test-fehler']]);
  assert.equal(A.sonderauftragStand(stand, null), null);
});
