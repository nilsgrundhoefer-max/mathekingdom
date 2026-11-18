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
  const l = aufgaben('5.4.5-D4', 'M')[0];
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
  assert.equal(L.siegel(stand), 1);
});

test('Lernziel: nur leichte Aufgaben reichen nicht (kein Durchrennen)', () => {
  const stand = neu();
  for (const a of aufgaben(S2, 'F')) L.verbuche(stand, a, ok(), 'G', 't');
  assert.equal(L.siegel(stand), 0);
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
  assert.equal(L.siegel(stand), 0);
  L.verbuche(stand, b, ok({ hilfen: 3 }), 'G', 't');
  L.verbuche(stand, c, ok({ hilfen: 2 }), 'G', 't');
  assert.equal(L.siegel(stand), 0);
  L.verbuche(stand, d, ok(), 'G', 't');
  assert.equal(L.siegel(stand), 1);
});

test('Lernziel: Förderschüler mit Zielniveau F erreicht es auf F', () => {
  const stand = neu();
  for (const a of aufgaben(S2, 'F').slice(0, 3)) L.verbuche(stand, a, ok(), 'F', 't');
  assert.equal(L.siegel(stand), 1);
});

test('Münzen: höheres Niveau bringt mehr, Training und Beispiel weniger, Fehlversuch und Tipp kosten nichts', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G')[0], e = aufgaben(S2, 'E')[0], f = aufgaben(S2, 'F')[0];
  assert.equal(L.muenzenFuer(stand, g, ok(), 'G'), 15);
  assert.equal(L.muenzenFuer(stand, e, ok(), 'G'), 25);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'G'), 5);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'F'), 10);
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 1, karten: ['tipp'] }), 'G'), 15, 'Tipp kostet nichts');
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 2, karten: ['tipp', 'beispiel'] }), 'G'), 12);
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 2 }), 'G'), 12, 'alter Eintrag ohne Kartenliste');
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 3 }), 'G'), 1);
  assert.equal(L.muenzenFuer(stand, g, ok({ versuche: 2 }), 'G'), 15, 'zweiter Versuch kostet nichts');
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

test('Meilenstein: Status folgt den Lernzielen', () => {
  const stand = neu();
  const station = pool.kapitel[2].unterkapitel[2];
  assert.equal(L.milestoneStatus(index, stand, pool.kapitel[0].unterkapitel[0]), 'leer');
  assert.equal(L.milestoneStatus(index, stand, station), 'offen');
  L.verbuche(stand, aufgaben(S2, 'G')[0], ok(), 'G', 't');
  assert.equal(L.milestoneStatus(index, stand, station), 'begonnen');
  assert.equal(L.naechstesLernziel(index, stand, station).id, '5.3.3-S1');
  for (const l of station.lernziele) stand.lernziele[l.id] = { erreichtAm: 't' };
  assert.equal(L.milestoneStatus(index, stand, station), 'gemeistert');
});

test('Rang ergibt sich allein aus den Siegeln', () => {
  assert.equal(L.rang(0).name, 'Wanderer');
  assert.equal(L.rang(5).name, 'Kundschafter');
  assert.equal(L.rang(29).name, 'Wegmeister');
  assert.equal(L.rang(30).name, 'Hofkartograf');
  assert.equal(L.rang(30).naechster, null);
});

test('Wappen: Kauf braucht Münzen und Rang', () => {
  const stand = neu();
  assert.equal(L.kaufe(stand, 'blau'), 'muenzen');
  stand.muenzen = 500;
  assert.equal(L.kaufe(stand, 'blau'), 'ok');
  assert.equal(stand.muenzen, 470);
  assert.equal(L.kaufe(stand, 'blau'), 'vorhanden');
  assert.equal(L.kaufe(stand, 'lilie'), 'rang', 'Münzen allein kaufen keinen Rang');
  L.legeAn(stand, 'blau');
  assert.equal(stand.wappen.farbe, 'blau');
  L.legeAn(stand, 'gold');
  assert.equal(stand.wappen.farbe, 'blau', 'nicht gekaufte Teile lassen sich nicht anlegen');
});

test('Alter Speicherstand: Lok-Teile werden Wappen-Teile, Münzen und Lernziele bleiben', () => {
  const alt = { version: 1, muenzen: 42, lernziele: { 'x': { erreichtAm: 't' } }, lok: { farbe: 'blau', extras: ['dampf', 'krone'], gekauft: ['rot', 'blau', 'dampf', 'krone'] } };
  const stand = L.migriere(alt);
  assert.deepEqual(stand.wappen, { farbe: 'blau', zeichen: ['eichenlaub', 'lilie'], gekauft: ['rot', 'blau', 'eichenlaub', 'lilie'] });
  assert.equal(stand.lok, undefined);
  assert.equal(stand.muenzen, 42);
  assert.equal(L.siegel(stand), 1);
  for (const id of stand.wappen.gekauft) assert.ok(L.WAPPEN_TEILE.some((w) => w.id === id), id);
  assert.equal(L.migriere(stand), stand, 'zweimal umstellen ändert nichts');
  assert.equal(L.migriere(null), null);
});

test('Wappen-Zeichen Krone heißt jetzt Lilie, auch in Speicherständen mit Wappen', () => {
  const stand = L.migriere({ ...neu(), wappen: { farbe: 'rot', zeichen: ['krone'], gekauft: ['rot', 'krone'] } });
  assert.deepEqual(stand.wappen, { farbe: 'rot', zeichen: ['lilie'], gekauft: ['rot', 'lilie'] });
});

// Drei passende Aufgaben richtig lösen, davon eine aus AFB II oder III: Damit ist ein Lernziel auf diesem Niveau nachgewiesen.
const loese = (stand, lz, n, ziel, t = 't') => {
  const liste = [...aufgaben(lz, n)].sort((a, b) => b.afb - a.afb).slice(0, 3);
  const b = liste.map((a) => L.verbuche(stand, a, ok(), ziel, t, index));
  return b.find((x) => x.neueKrone) ?? b.at(-1);
};
const meilenstein = pool.kapitel[2].unterkapitel[2]; // 5.3.3
const ziele = meilenstein.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id)).map((l) => l.id);

test('Krone: niedrigstes Niveau, auf dem alle Lernziele nachgewiesen sind', () => {
  const stand = neu();
  assert.equal(L.krone(index, stand, meilenstein), null);
  for (const lz of ziele.slice(1)) loese(stand, lz, 'M', 'M');
  assert.equal(L.krone(index, stand, meilenstein), null, 'ein Lernziel fehlt noch');
  const b = loese(stand, ziele[0], 'G', 'M');
  assert.equal(L.krone(index, stand, meilenstein), 'G', 'Silber, weil ein Lernziel nur auf G nachgewiesen ist');
  assert.deepEqual(b.neueKrone, { niveau: 'G', vorher: null });
  assert.equal(L.milestoneStatus(index, stand, meilenstein), 'begonnen', 'unter dem Zielniveau M nicht gemeistert');
  assert.equal(stand.lernziele[ziele[0]], undefined, 'kein Siegel unter dem Zielniveau');
  const c = loese(stand, ziele[0], 'M', 'M');
  assert.equal(L.krone(index, stand, meilenstein), 'M', 'aufgewertet auf Gold');
  assert.deepEqual(c.neueKrone, { niveau: 'M', vorher: 'G' });
  assert.equal(L.milestoneStatus(index, stand, meilenstein), 'gemeistert');
  assert.equal(L.kronen(pool, index, stand)[meilenstein.id], 'M');
});

test('Krone: E-Aufgaben zählen auch für Gold, Lösungsschritt zählt nicht', () => {
  const stand = neu();
  for (const lz of ziele) loese(stand, lz, 'E', 'M');
  assert.equal(L.krone(index, stand, meilenstein), 'E');
  const ohne = neu();
  for (const lz of ziele) for (const a of [...aufgaben(lz, 'F')].sort((x, y) => y.afb - x.afb).slice(0, 3)) L.verbuche(ohne, a, ok({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', 't', index);
  assert.equal(L.krone(index, ohne, meilenstein), null);
});

test('Selbsteinschätzung: unterschätzt, passend, überschätzt', () => {
  const unter = neu();
  L.merkeWahl(unter, index, meilenstein, 'F', 't0');
  L.merkeWahl(unter, index, meilenstein, 'E', 't1');
  assert.equal(unter.einschaetzung[meilenstein.id].gewaehlt, 'F', 'nur die erste Wahl zählt');
  let b;
  for (const lz of ziele) b = loese(unter, lz, 'M', 'M', 't2');
  assert.equal(b.ersteKrone, true);
  assert.equal(L.urteil(unter.einschaetzung[meilenstein.id]), 'unterschaetzt');
  for (const lz of ziele) loese(unter, lz, 'E', 'M', 't3');
  assert.equal(unter.einschaetzung[meilenstein.id].krone, 'M', 'spätere Aufwertung ändert die Einschätzung nicht');

  const passt = neu();
  L.merkeWahl(passt, index, meilenstein, 'G', 't0');
  for (const lz of ziele) loese(passt, lz, 'G', 'M');
  assert.equal(L.urteil(passt.einschaetzung[meilenstein.id]), 'passend', 'Bronze oder Silber unter dem Ziel zählt ganz normal');

  const ueber = neu();
  L.merkeWahl(ueber, index, meilenstein, 'E', 't0');
  assert.equal(L.urteil(ueber.einschaetzung[meilenstein.id]), null, 'noch offen');
  L.verbuche(ueber, aufgaben(ziele[0], 'G')[0], ok(), 'M', 't1', index);
  assert.equal(L.urteil(ueber.einschaetzung[meilenstein.id]), 'ueberschaetzt', 'abgestiegen');

  const alt = neu();
  L.verbuche(alt, aufgaben(ziele[0], 'M')[0], ok(), 'M', 't0', index);
  L.merkeWahl(alt, index, meilenstein, 'M', 't1');
  assert.equal(alt.einschaetzung[meilenstein.id], undefined, 'schon begonnen: keine Einschätzung');
});

test('Zielniveau gesenkt: Siegel werden nachgetragen, nie weggenommen', () => {
  const stand = neu();
  for (const lz of ziele) loese(stand, lz, 'G', 'M');
  assert.equal(L.siegel(stand), 0);
  assert.equal(L.trageSiegelNach(stand, index, 'E', 't'), 0);
  assert.equal(L.trageSiegelNach(stand, index, 'G', 't'), ziele.length);
  assert.equal(L.milestoneStatus(index, stand, meilenstein), 'gemeistert');
  assert.equal(L.trageSiegelNach(stand, index, 'E', 't'), 0);
  assert.equal(L.milestoneStatus(index, stand, meilenstein), 'gemeistert', 'Anheben nimmt nichts weg');
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
  assert.equal(ohne.zielniveau, 'M');
  assert.equal(ohne.offeneKapitel.size, 9);
  assert.equal(ohne.spielpause, false);
  const mit = L.einstellungen({ aktuellesKapitel: '5.4', zielniveaus: { '5A-K4M2': 'M' }, spielpause: true, codes: ['5A-AAAA'] }, '5A-K4M2', pool);
  assert.equal(mit.zielniveau, 'M');
  assert.deepEqual([...mit.offeneKapitel], ['5.1', '5.2', '5.3', '5.4']);
  assert.equal(mit.codeBekannt, false);
});

test('Neue Formate: Zahlenstrahl, Tabelle und Diagramm werden ausgewertet', () => {
  const je = (format, filter = () => true) => pool.aufgaben.find((a) => a.format === format && filter(a));
  for (const strahl of [je('zahlenstrahl', (a) => a.eingabe === 'markieren'), je('zahlenstrahl', (a) => a.eingabe === 'ablesen')]) {
    assert.equal(L.pruefeAntwort(strahl, String(strahl.loesung)).richtig, true);
    assert.equal(L.pruefeAntwort(strahl, String(strahl.loesung + strahl.strahl.schritt)).richtig, false);
  }
  const tabelle = je('tabelle');
  const voll = Object.fromEntries(Object.entries(tabelle.luecken).map(([n, l]) => [n, String(l.loesung)]));
  assert.equal(L.pruefeAntwort(tabelle, voll).richtig, true);
  const [erste] = Object.keys(voll);
  assert.equal(L.pruefeAntwort(tabelle, { ...voll, [erste]: String(tabelle.luecken[erste].loesung + 1) }).richtig, false);
  assert.equal(L.pruefeAntwort(tabelle, {}).richtig, false);
  const diagramm = je('diagramm', (a) => a.teile.length === 2);
  assert.equal(L.pruefeAntwort(diagramm, diagramm.teile.map((t) => String(t.loesung))).richtig, true);
  assert.equal(L.pruefeAntwort(diagramm, [String(diagramm.teile[0].loesung), '']).richtig, false);
});

test('Kapitel 5.3 ist vollständig: jeder Meilenstein hat Aufgaben auf allen vier Straßen', () => {
  const kapitel = pool.kapitel.find((k) => k.id === '5.3');
  for (const u of kapitel.unterkapitel) for (const l of u.lernziele) for (const n of ['F', 'G', 'M', 'E']) {
    assert.ok(pool.aufgaben.filter((a) => a.lernziel === l.id && a.niveau === n).length >= 6, `${l.id} ${n}`);
  }
});

test('Etappe der Startseite: Fortschritt und nächster Meilenstein, gesperrte Meilensteine zählen nicht', () => {
  const stand = neu();
  const frei = L.einstellungen(null, stand.code, pool);
  const start = L.etappe(pool, index, stand, frei);
  assert.equal(start.kapitel.id, '5.3');
  assert.deepEqual([start.geschafft, start.gesamt, start.milestone.id], [0, 5, '5.3.1']);
  // Die Lehrkraft arbeitet in Kapitel 4: Dort geht es weiter.
  const vier = L.einstellungen({ aktuellesKapitel: '5.4' }, stand.code, pool);
  assert.equal(L.etappe(pool, index, stand, vier).milestone.id, '5.4.5');
  // Ein begonnener Meilenstein hat Vorrang, ein gesperrter fällt heraus.
  const zu = L.einstellungen({ aktuellesKapitel: '5.3', sperren: { '5.3.1': [stand.code] } }, stand.code, pool);
  const mitSperre = L.etappe(pool, index, stand, zu);
  assert.deepEqual([mitSperre.gesamt, mitSperre.milestone.id], [4, '5.3.2']);
  // Alle Lernziele des aktuellen Kapitels erreicht: Die Etappe zeigt das nächste offene Kapitel mit Aufgaben.
  for (const u of pool.kapitel.find((k) => k.id === '5.4').unterkapitel) for (const l of u.lernziele) stand.lernziele[l.id] = { t: 'x' };
  assert.equal(L.etappe(pool, index, stand, vier).kapitel.id, '5.3');
});

test('Jeder Meilenstein mit Aufgaben hat einen Merkzettel', () => {
  for (const k of pool.kapitel) for (const u of k.unterkapitel) {
    if (!u.lernziele.some((l) => index.lernzielMitAufgaben.has(l.id))) continue;
    assert.ok(u.merkzettel?.regeln.length >= 3 && u.merkzettel.beispiel, u.id);
  }
});

test('Siegelregel: drei richtige reichen nur mit einer Aufgabe aus AFB II oder III', () => {
  const g = aufgaben('5.4.5-D2', 'M');
  assert.deepEqual(g.map((a) => a.afb), L.AFB_FOLGE);
  const stand = neu();
  const [eins, vier] = g.filter((a) => a.afb === 1);
  L.verbuche(stand, eins, ok(), 'M', 't1', index);
  L.verbuche(stand, vier, ok(), 'M', 't2', index);
  // Dritte richtige Aufgabe, aber wieder nur AFB I (eine Wiederholung zählt nicht doppelt): kein Siegel.
  const fremd = { ...eins, id: 'x-afb1' };
  const ohne = L.verbuche(stand, fremd, ok(), 'M', 't3', index);
  assert.equal(ohne.neuesLernziel, false);
  const st = L.lernzielStand(stand, '5.4.5-D2', 'M', index);
  assert.deepEqual([st.erreicht, st.anspruchFehlt, st.fortschritt], [false, true, 2]);
  const mit = L.verbuche(stand, g.find((a) => a.afb === 2), ok(), 'M', 't4', index);
  assert.equal(mit.neuesLernziel, true);
});

test('Reihenfolge der Aufgaben folgt den Anforderungsbereichen I, II, II, I, II, III', () => {
  const stand = neu(), folge = [];
  for (let i = 0; i < 6; i++) {
    const a = L.naechsteAufgabe(index, stand, '5.4.5-D4', 'G');
    folge.push(a.afb);
    L.verbuche(stand, a, ok({ geloest: false }), 'G', 't', index);
  }
  assert.deepEqual(folge, L.AFB_FOLGE);
});

test('Hilfekärtchen je Niveaustufe und Lösungsschritt auf M', () => {
  const anzahl = (n) => Object.keys(aufgaben('5.4.5-D2', n)[0].hilfen);
  assert.deepEqual([anzahl('F'), anzahl('G'), anzahl('M'), anzahl('E')], [L.KARTEN, L.KARTEN, ['tipp', 'loesungsschritt'], ['tipp']]);
  // Auf M ist das zweite Kärtchen der Lösungsschritt: Die Aufgabe zählt dann nicht für das Siegel und bringt nur 1 Münze.
  const stand = neu(), m = aufgaben('5.4.5-D2', 'M')[0];
  const b = L.verbuche(stand, m, ok({ hilfen: 2, karten: ['tipp', 'loesungsschritt'] }), 'M', 't', index);
  assert.equal(b.muenzen, 1);
  assert.equal(L.lernzielStand(stand, '5.4.5-D2', 'M', index).richtige, 0);
  // Alte Einträge ohne Kartenliste: zwei Kärtchen waren Tipp und Beispiel, das zählt.
  assert.equal(L.hatKarte({ hilfen: 2 }, 'loesungsschritt'), false);
  assert.equal(L.hatKarte({ hilfen: 3 }, 'loesungsschritt'), true);
});

test('AFB III bringt die Hälfte mehr Münzen, Wortspeicher wächst mit der Stufe', () => {
  const stand = neu(), e = aufgaben('5.4.5-D1', 'E');
  assert.equal(L.muenzenFuer(stand, e.find((a) => a.afb === 3), ok(), 'M'), Math.round(L.MUENZEN_BASIS.E * 1.5));
  assert.equal(L.muenzenFuer(stand, e.find((a) => a.afb === 1), ok(), 'M'), L.MUENZEN_BASIS.E);
  const station = pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.id === '5.4.5');
  const bis = (n) => station.wortspeicher.filter((w) => L.NIVEAUS.indexOf(w.ab) <= L.NIVEAUS.indexOf(n)).length;
  assert.ok(bis('F') >= 4 && bis('F') < bis('G') && bis('G') < bis('M') && bis('M') < bis('E'));
  assert.ok(!station.wortspeicher.filter((w) => w.ab === 'F').some((w) => /Quotient|Dividend|Divisor/.test(w.wort + w.erklaerung)));
});

// ---------- Rückblick und Expedition (ADR 0014) ----------
const mitSiegeln = (ids, erreichtAm) => { const st = neu(); for (const id of ids) st.lernziele[id] = { erreichtAm }; return st; };
const rbZiele = [...index.lernzielMitAufgaben].slice(0, 6);

test('Rückblick: fällig nach 2, 7 und 21 Tagen, höchstens einmal am Tag', () => {
  const st = mitSiegeln(rbZiele.slice(0, 2), '2026-11-01T10:00:00Z');
  assert.deepEqual(L.faelligeLernziele(st, index, '2026-11-02T10:00:00Z'), []);
  assert.equal(L.faelligeLernziele(st, index, '2026-11-03T11:00:00Z').length, 2);
  const r = L.stelleRueckblick(st, index, 'M', '2026-11-03T11:00:00Z', () => 0);
  assert.equal(r.aufgaben.length, L.RUECKBLICK_MIN);
  assert.equal(new Set(r.aufgaben).size, r.aufgaben.length);
  // gemischt: die ersten beiden Aufgaben stammen aus verschiedenen LernrbZielen
  assert.notEqual(index.aufgabe.get(r.aufgaben[0]).lernziel, index.aufgabe.get(r.aufgaben[1]).lernziel);
  assert.ok(r.aufgaben.every((id) => index.aufgabe.get(id).niveau === 'M'));
  for (const id of r.aufgaben) L.trageRueckblickEin(st, index.aufgabe.get(id), true, '2026-11-03T11:10:00Z');
  assert.equal(st.rueckblickAktiv, null);
  assert.equal(L.rueckblickAngebot(st, index, '2026-11-03T15:00:00Z'), null); // heute schon einer
  assert.equal(st.rueckblick[rbZiele[0]].stufe, 1);
  assert.deepEqual(L.faelligeLernziele(st, index, '2026-11-05T10:00:00Z'), []); // nächste Stufe erst ab Tag 7
  assert.equal(L.faelligeLernziele(st, index, '2026-11-08T11:00:00Z').length, 2);
});

test('Rückblick: Ein Fehler nimmt kein Siegel weg, das Lernziel kommt wieder und ist aufzufrischen', () => {
  const st = mitSiegeln([rbZiele[0]], '2026-11-01T10:00:00Z');
  const r = L.stelleRueckblick(st, index, 'M', '2026-11-04T10:00:00Z', () => 0);
  const [erste, ...rest] = r.aufgaben.map((id) => index.aufgabe.get(id));
  assert.equal(L.trageRueckblickEin(st, erste, false, '2026-11-04T10:01:00Z').fertig, false);
  let ende;
  for (const a of rest) ende = L.trageRueckblickEin(st, a, true, '2026-11-04T10:05:00Z');
  assert.deepEqual(ende.aufzufrischen, [rbZiele[0]]);
  assert.ok(st.lernziele[rbZiele[0]]);
  assert.equal(st.rueckblick[rbZiele[0]].stufe, 0);
  assert.deepEqual(L.faelligeLernziele(st, index, '2026-11-05T08:00:00Z'), [rbZiele[0]]);
  assert.equal(L.rueckblickAngebot(st, index, '2026-11-05T08:00:00Z').art, 'neu');
});

test('Rückblick: Aufgaben zählen nicht zur Selbsteinschätzung und bringen normale Münzen', () => {
  const st = mitSiegeln([S2], '2026-11-01T10:00:00Z');
  const ms = index.meilensteinVon.get(S2);
  st.einschaetzung[ms.id] = { gewaehlt: 'E', t: '2026-11-01T09:00:00Z' };
  const a = aufgaben(S2, 'M')[0];
  const b = L.verbuche(st, a, ok(), 'M', '2026-11-04T10:00:00Z', index, { rueckblick: true });
  assert.equal(st.einschaetzung[ms.id].abstieg, undefined);
  assert.equal(st.versuche.at(-1).rueckblick, true);
  assert.equal(b.muenzen, L.muenzenFuer(neu(), a, ok(), 'M'));
});

test('Expedition: Siegel und Rückblick-Tage im Zeitraum zählen, Belohnung einmal', () => {
  const ex = { id: 'ex-1', ziel: 3, start: '2026-11-10T00:00:00Z', bis: '2026-11-30', belohnung: 'fahne' };
  const a = mitSiegeln([rbZiele[0]], '2026-11-05T10:00:00Z'); // vor dem Start: zählt nicht
  a.lernziele[rbZiele[1]] = { erreichtAm: '2026-11-12T10:00:00Z' };
  a.rueckblicke = [{ t: '2026-11-12T11:00:00Z', tag: '2026-11-12' }, { t: '2026-12-02T11:00:00Z', tag: '2026-12-02' }];
  const b = mitSiegeln([rbZiele[2]], '2026-11-20T10:00:00Z');
  assert.equal(L.expeditionsZeichen(a, ex), 2);
  assert.deepEqual(L.expeditionsStand([a, b], ex, '2026-11-21T10:00:00Z'), { summe: 3, ziel: 3, geschafft: true, vorbei: false });
  assert.equal(L.expeditionsStand([a], ex, '2026-12-01T10:00:00Z').vorbei, true);
  assert.equal(L.holeBelohnung(a, ex, '2026-11-21T10:00:00Z'), true);
  assert.equal(L.holeBelohnung(a, ex, '2026-11-22T10:00:00Z'), false);
  assert.ok(a.wappen.gekauft.includes('fahne'));
  assert.equal(L.kaufe(b, 'fahne'), 'expedition');
});

// ---------- Heftcheck und Sicherheitsangabe (ADR 0014) ----------
test('Heftcode: nur für gelöste Aufgaben ab M, fortlaufend', () => {
  const st = neu();
  const g = aufgaben(S2, 'G')[0], m = aufgaben(S2, 'M');
  assert.equal(L.verbuche(st, g, ok(), 'M', '2026-11-18T10:00:00Z', index).heft, null);
  assert.equal(L.verbuche(st, m[0], ok(), 'M', '2026-11-18T10:01:00Z', index).heft, 'H1');
  assert.equal(L.verbuche(st, m[1], { ...ok(), geloest: false, versuche: 2 }, 'M', '2026-11-18T10:02:00Z', index).heft, null);
  assert.equal(L.verbuche(st, m[2], ok(), 'M', '2026-11-18T10:03:00Z', index).heft, 'H2');
  assert.equal(st.versuche.at(-1).heft, 'H2');
});

test('Heftcheck: nach acht Heftcodes eine Frage mit vier Antworten, danach beginnt der Zähler neu', () => {
  const st = neu();
  const zahlen = pool.aufgaben.filter((a) => a.niveau === 'M' && L.heftWert(a)).slice(0, 9);
  zahlen.slice(0, 7).forEach((a, i) => L.verbuche(st, a, ok(), 'M', `2026-11-18T10:0${i}:00Z`, index));
  assert.equal(L.heftcheckFrage(st, index), null);
  L.verbuche(st, zahlen[7], ok(), 'M', '2026-11-18T10:09:00Z', index);
  const f = L.heftcheckFrage(st, index, () => 0);
  assert.equal(f.optionen.length, 4);
  assert.equal(f.optionen.filter((o) => o.richtig).length, 1);
  assert.notEqual(f.heft, 'H8', 'nicht nach der allerletzten Aufgabe');
  assert.equal(new Set(f.optionen.map((o) => o.text)).size, 4);
  L.trageHeftcheckEin(st, f, false, '2026-11-18T10:10:00Z');
  assert.equal(L.heftcheckFrage(st, index), null);
  assert.deepEqual(st.heftchecks.map((c) => c.richtig), [false]);
});

test('Sicherheitsangabe: sicher falsch heißt sicher geprüft und nicht im ersten Versuch gelöst', () => {
  assert.equal(L.sicherFalsch({ sicher: true, richtig: true, versuche: 1 }), false);
  assert.equal(L.sicherFalsch({ sicher: true, richtig: true, versuche: 2 }), true);
  assert.equal(L.sicherFalsch({ sicher: true, richtig: false, versuche: 2 }), true);
  assert.equal(L.sicherFalsch({ sicher: false, richtig: false, versuche: 2 }), false);
  const st = neu();
  L.verbuche(st, aufgaben(S2, 'M')[0], { ...ok(), sicher: true }, 'M', '2026-11-18T10:00:00Z', index);
  assert.equal(st.versuche.at(-1).sicher, true);
});
