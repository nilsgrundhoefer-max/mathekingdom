import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const neu = () => L.neuerSpeicherstand('5A-K4M2', '5a', '2026-11-17T10:00:00Z');
const aufgaben = (lz, n) => index.nach.get(`${lz}|${n}`);
const ok = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20, ...extra });
const S2 = '5.3.3-S2';

test('Schülercode: gültige Codes legen die Klasse fest', () => {
  assert.deepEqual(L.leseCode(' 5a-k4m2 '), { code: '5A-K4M2', klasse: '5a' });
  assert.deepEqual(L.leseCode('10B-XY12'), { code: '10B-XY12', klasse: '10b' });
  assert.equal(L.leseCode('5A-01'), null);
  assert.equal(L.leseCode('Lena'), null);
});

test('Zahleingabe: Leerzeichen und Tausenderpunkte sind erlaubt', () => {
  assert.equal(L.leseZahl('12 345'), 12345);
  assert.equal(L.leseZahl('12.345'), 12345);
  assert.ok(Number.isNaN(L.leseZahl('')));
  assert.ok(Number.isNaN(L.leseZahl('12a')));
});

test('Zahl-Aufgabe: richtige Lösung, typischer Fehler, sonstiger Fehler', () => {
  const a = aufgaben(S2, 'G').find((x) => x.typischeFehler.length);
  assert.deepEqual(L.pruefeAntwort(a, String(a.loesung)), { richtig: true, fehlvorstellung: null });
  const f = a.typischeFehler[0];
  assert.deepEqual(L.pruefeAntwort(a, String(f.wert)), { richtig: false, fehlvorstellung: f.fehlvorstellung });
  assert.deepEqual(L.pruefeAntwort(a, '1'), { richtig: false, fehlvorstellung: null });
});

test('Auswahl: Mehrfachauswahl verlangt genau alle richtigen Optionen', () => {
  const a = aufgaben('5.3.3-S4', 'M')[0];
  const richtige = a.optionen.filter((o) => o.richtig).map((o) => o.text);
  assert.equal(L.pruefeAntwort(a, richtige).richtig, true);
  assert.equal(L.pruefeAntwort(a, a.optionen.map((o) => o.text)).richtig, false);
  assert.equal(L.pruefeAntwort(a, []).richtig, false);
});

test('Auswahl: falsche Option meldet ihre Fehlvorstellung', () => {
  const a = aufgaben('5.3.3-S1', 'F').find((x) => x.format === 'auswahl');
  const falsch = a.optionen.find((o) => !o.richtig);
  assert.deepEqual(L.pruefeAntwort(a, [falsch.text]), { richtig: false, fehlvorstellung: 'begriffe-verwechselt' });
});

test('Lücken, Zuordnen und Sachaufgabe: alles muss stimmen', () => {
  const l = aufgaben('5.4.5-D4', 'F')[0];
  assert.equal(L.pruefeAntwort(l, { q: String(l.luecken.q.loesung), r: String(l.luecken.r.loesung) }).richtig, true);
  assert.equal(L.pruefeAntwort(l, { q: String(l.luecken.q.loesung), r: '0' }).fehlvorstellung, 'div-rest-vergessen');
  const z = aufgaben('5.3.3-S1', 'F').find((x) => x.format === 'zuordnen');
  assert.equal(L.pruefeAntwort(z, Object.fromEntries(z.paare.map((p) => [p.links, p.rechts]))).richtig, true);
  assert.equal(L.pruefeAntwort(z, {}).richtig, false);
  const s = aufgaben('5.3.3-S5', 'M')[0];
  assert.equal(L.pruefeAntwort(s, s.teile.map((t) => String(t.loesung))).richtig, true);
  assert.equal(L.pruefeAntwort(s, [String(s.teile[0].loesung), '5']).richtig, false);
});

test('Lernziel: drei richtige Aufgaben auf dem Zielniveau erreichen es', () => {
  const stand = neu();
  const [a, b, c] = aufgaben(S2, 'G');
  assert.equal(L.verbuche(stand, a, ok(), 'G', 't1').neuesLernziel, false);
  assert.equal(L.verbuche(stand, b, ok(), 'G', 't2').neuesLernziel, false);
  assert.equal(L.verbuche(stand, c, ok(), 'G', 't3').neuesLernziel, true);
  assert.equal(L.sterne(stand), 1);
});

test('Lernziel: nur leichte Aufgaben reichen nicht (kein Durchrennen)', () => {
  const stand = neu();
  for (const a of aufgaben(S2, 'F')) L.verbuche(stand, a, ok(), 'G', 't');
  assert.equal(L.sterne(stand), 0);
  assert.equal(L.lernzielStand(stand, S2, 'G').fortschritt, 1);
  // Eine Trainingsaufgabe plus zwei auf dem Zielniveau genügen.
  const [a, b] = aufgaben(S2, 'G');
  L.verbuche(stand, a, ok(), 'G', 't');
  assert.equal(L.verbuche(stand, b, ok(), 'G', 't').neuesLernziel, true);
});

test('Lernziel: dieselbe Aufgabe dreimal zählt nur einmal, Lösungsschritt zählt nicht', () => {
  const stand = neu();
  const [a, b, c, d] = aufgaben(S2, 'G');
  for (let i = 0; i < 3; i++) L.verbuche(stand, a, ok(), 'G', 't');
  assert.equal(L.sterne(stand), 0);
  L.verbuche(stand, b, ok({ hilfen: 3 }), 'G', 't');
  L.verbuche(stand, c, ok({ hilfen: 2 }), 'G', 't');
  assert.equal(L.sterne(stand), 0);
  L.verbuche(stand, d, ok(), 'G', 't');
  assert.equal(L.sterne(stand), 1);
});

test('Lernziel: Förderschüler mit Zielniveau F erreicht es auf F', () => {
  const stand = neu();
  for (const a of aufgaben(S2, 'F').slice(0, 3)) L.verbuche(stand, a, ok(), 'F', 't');
  assert.equal(L.sterne(stand), 1);
});

test('Münzen: höheres Niveau bringt mehr, Training, Hilfen und zweiter Versuch weniger', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G')[0], e = aufgaben(S2, 'E')[0], f = aufgaben(S2, 'F')[0];
  assert.equal(L.muenzenFuer(stand, g, ok(), 'G'), 15);
  assert.equal(L.muenzenFuer(stand, e, ok(), 'G'), 25);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'G'), 5);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'F'), 10);
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 1 }), 'G'), 12);
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 3 }), 'G'), 1);
  assert.equal(L.muenzenFuer(stand, g, ok({ versuche: 2 }), 'G'), 9);
  assert.equal(L.muenzenFuer(stand, g, ok({ geloest: false }), 'G'), 0);
  L.verbuche(stand, g, ok(), 'G', 't');
  assert.equal(L.muenzenFuer(stand, g, ok(), 'G'), 1, 'Wiederholung einer gelösten Aufgabe');
  assert.equal(stand.muenzen, 15);
});

test('Niveauvorschlag: hoch nach 4 von 5, runter nach 3 Fehlern, Ruhe nach Ablehnung', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G');
  for (let i = 0; i < 4; i++) L.verbuche(stand, g[i], ok(), 'G', 't');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G'), null);
  L.verbuche(stand, g[4], ok({ geloest: false }), 'G', 't');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G'), 'hoch');
  L.lehneVorschlagAb(stand, '5.3');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G'), null);
  for (let i = 0; i < 3; i++) L.verbuche(stand, g[i], ok({ geloest: false }), 'G', 't');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G'), 'runter');
  L.setzeNiveau(stand, '5.3', 'F');
  assert.equal(L.arbeitsniveau(stand, '5.3', 'G'), 'F');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'F'), null);
  assert.equal(L.niveauVorschlag(stand, '5.4', 'G'), null, 'anderes Kapitel bleibt unberührt');
});

test('Aufgabenauswahl: erst neue, dann ungelöste, nie zweimal direkt dieselbe', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G');
  const gesehen = new Set();
  for (let i = 0; i < g.length; i++) {
    const a = L.naechsteAufgabe(index, stand, S2, 'G');
    assert.ok(!gesehen.has(a.id), 'keine Wiederholung, solange neue Aufgaben da sind');
    gesehen.add(a.id);
    L.verbuche(stand, a, ok({ geloest: i !== 0 }), 'G', 't');
  }
  const ungeloest = stand.versuche[0].aufgabe;
  assert.equal(L.naechsteAufgabe(index, stand, S2, 'G').id, ungeloest);
  assert.equal(L.naechsteAufgabe(index, stand, '5.1.1-L1', 'G'), null);
});

test('Station: Status folgt den Lernzielen', () => {
  const stand = neu();
  const station = pool.kapitel[2].unterkapitel[2];
  assert.equal(L.stationStatus(index, stand, pool.kapitel[0].unterkapitel[0]), 'leer');
  assert.equal(L.stationStatus(index, stand, station), 'offen');
  L.verbuche(stand, aufgaben(S2, 'G')[0], ok(), 'G', 't');
  assert.equal(L.stationStatus(index, stand, station), 'begonnen');
  assert.equal(L.naechstesLernziel(index, stand, station).id, '5.3.3-S1');
  for (const l of station.lernziele) stand.lernziele[l.id] = { erreichtAm: 't' };
  assert.equal(L.stationStatus(index, stand, station), 'erreicht');
});

test('Rang ergibt sich allein aus den Sternen', () => {
  assert.equal(L.rang(0).name, 'Rangierlok');
  assert.equal(L.rang(5).name, 'Regionalzug');
  assert.equal(L.rang(29).name, 'Express');
  assert.equal(L.rang(30).name, 'Königszug');
  assert.equal(L.rang(30).naechster, null);
});

test('Werkstatt: Kauf braucht Münzen und Rang', () => {
  const stand = neu();
  assert.equal(L.kaufe(stand, 'blau'), 'muenzen');
  stand.muenzen = 500;
  assert.equal(L.kaufe(stand, 'blau'), 'ok');
  assert.equal(stand.muenzen, 470);
  assert.equal(L.kaufe(stand, 'blau'), 'vorhanden');
  assert.equal(L.kaufe(stand, 'krone'), 'rang', 'Münzen allein kaufen keinen Rang');
  L.ruesteAus(stand, 'blau');
  assert.equal(stand.lok.farbe, 'blau');
  L.ruesteAus(stand, 'gold');
  assert.equal(stand.lok.farbe, 'blau', 'nicht gekaufte Teile lassen sich nicht anlegen');
});

test('Minispiel: nur in der Spielpause und gegen Münzen', () => {
  const stand = neu();
  stand.muenzen = 25;
  assert.equal(L.starteMinispiel(stand, false), 'keine-spielpause');
  assert.equal(L.starteMinispiel(stand, true), 'ok');
  assert.equal(stand.muenzen, 5);
  assert.equal(L.starteMinispiel(stand, true), 'muenzen');
  for (let i = 0; i < 200; i++) { const a = L.kopfrechenAufgabe(); assert.ok(Number.isInteger(a.loesung) && a.loesung > 0); }
});

test('Hilferuf: Platz in der Warteschlange nach Eingang', () => {
  const stand = neu();
  assert.equal(L.wartePlatz(stand, []), null);
  L.rufeHilfe(stand, 'x', '2026-11-17T10:05:00Z');
  assert.equal(L.wartePlatz(stand, [{ seit: '2026-11-17T10:01:00Z' }, { seit: '2026-11-17T10:09:00Z' }, null]), 2);
  L.beendeHilferuf(stand, 'zurueckgezogen', '2026-11-17T10:06:00Z');
  assert.equal(stand.hilferuf, null);
  assert.equal(stand.hilferufe.length, 1);
});

test('Klassendatei: Standardwerte ohne Datei, sonst Vorgaben der Lehrkraft', () => {
  const ohne = L.einstellungen(null, '5A-K4M2', pool);
  assert.equal(ohne.zielniveau, 'G');
  assert.equal(ohne.offeneKapitel.size, 9);
  assert.equal(ohne.spielpause, false);
  const mit = L.einstellungen({ aktuellesKapitel: '5.4', zielniveaus: { '5A-K4M2': 'M' }, spielpause: true, codes: ['5A-AAAA'] }, '5A-K4M2', pool);
  assert.equal(mit.zielniveau, 'M');
  assert.deepEqual([...mit.offeneKapitel], ['5.1', '5.2', '5.3', '5.4']);
  assert.equal(mit.codeBekannt, false);
});
