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
  const a = pool.aufgaben.find((x) => x.mehrfach);
  const richtige = a.optionen.filter((o) => o.richtig).map((o) => o.text);
  assert.equal(L.pruefeAntwort(a, richtige).richtig, true);
  assert.equal(L.pruefeAntwort(a, a.optionen.map((o) => o.text)).richtig, false);
  assert.equal(L.pruefeAntwort(a, []).richtig, false);
});

test('Auswahl: falsche Option meldet ihre Fehlvorstellung', () => {
  const a = aufgaben('5.3.3-S1', 'F').find((x) => x.format === 'auswahl');
  const falsch = a.optionen.find((o) => !o.richtig && o.fehlvorstellung);
  assert.deepEqual(L.pruefeAntwort(a, [falsch.text]), { richtig: false, fehlvorstellung: falsch.fehlvorstellung });
});

test('Lücken, Zuordnen und Sachaufgabe: alles muss stimmen', () => {
  // Eine Lückenaufgabe, deren letzte Lücke einen typischen Fehler kennt.
  const l = pool.aufgaben.find((x) => x.format === 'luecken' && Object.keys(x.luecken).length === 2 && Object.values(x.luecken)[1].typischeFehler.length);
  const [erste, zweite] = Object.keys(l.luecken);
  assert.equal(L.pruefeAntwort(l, { [erste]: String(l.luecken[erste].loesung), [zweite]: String(l.luecken[zweite].loesung) }).richtig, true);
  const fehler = l.luecken[zweite].typischeFehler[0];
  assert.deepEqual(L.pruefeAntwort(l, { [erste]: String(l.luecken[erste].loesung), [zweite]: String(fehler.wert) }), { richtig: false, fehlvorstellung: fehler.fehlvorstellung });
  const z = pool.aufgaben.find((x) => x.format === 'zuordnen');
  assert.equal(L.pruefeAntwort(z, Object.fromEntries(z.paare.map((p) => [p.links, p.rechts]))).richtig, true);
  assert.equal(L.pruefeAntwort(z, {}).richtig, false);
  const s = pool.aufgaben.find((x) => x.format === 'sachaufgabe' && x.teile.length >= 2);
  assert.equal(L.pruefeAntwort(s, s.teile.map((t) => String(t.loesung))).richtig, true);
  assert.equal(L.pruefeAntwort(s, [String(s.teile[0].loesung), ...s.teile.slice(1).map((t) => String(t.loesung + 1))]).richtig, false);
});

test('Ordnen: nur die verlangte Reihenfolge ist richtig, genau andersherum meldet die Richtung', () => {
  const a = pool.aufgaben.find((x) => x.format === 'ordnen' && x.umgekehrt && x.sonst);
  assert.deepEqual(L.pruefeAntwort(a, a.loesung), { richtig: true, fehlvorstellung: null });
  assert.deepEqual(L.pruefeAntwort(a, [...a.loesung].reverse()), { richtig: false, fehlvorstellung: a.umgekehrt });
  const vertauscht = [a.loesung[1], a.loesung[0], ...a.loesung.slice(2)];
  assert.deepEqual(L.pruefeAntwort(a, vertauscht), { richtig: false, fehlvorstellung: a.sonst });
  assert.equal(L.pruefeAntwort(a, a.karten).richtig, false, 'die Karten liegen nie schon richtig da');
});

test('Zeichen: römische Zahlzeichen und Dualzahlen, Kleinschreibung und Leerzeichen stören nicht', () => {
  const roem = pool.aufgaben.find((x) => x.format === 'zeichen' && x.tasten.includes('X') && x.typischeFehler.length);
  assert.equal(L.pruefeAntwort(roem, roem.loesung).richtig, true);
  assert.equal(L.pruefeAntwort(roem, ` ${roem.loesung.toLowerCase().split('').join(' ')} `).richtig, true);
  const f = roem.typischeFehler[0];
  assert.deepEqual(L.pruefeAntwort(roem, f.wert), { richtig: false, fehlvorstellung: f.fehlvorstellung });
  assert.deepEqual(L.pruefeAntwort(roem, 'MMMM'), { richtig: false, fehlvorstellung: null });
  const zwei = pool.aufgaben.find((x) => x.format === 'zeichen' && x.tasten.join('') === '01');
  assert.equal(L.pruefeAntwort(zwei, zwei.loesung).richtig, true);
  assert.equal(L.pruefeAntwort(zwei, `${zwei.loesung}0`).richtig, false);
});

test('Schätzen: jeder Wert im Schätzbereich ist richtig, knapp daneben nicht', () => {
  const alle = pool.aufgaben.filter((x) => x.format === 'schaetzen');
  assert.ok(alle.length >= 3);
  for (const a of alle) {
    const [von, bis] = a.bereich;
    assert.ok(['M', 'E'].includes(a.niveau), 'Schätzbereich erst ab M');
    assert.ok(von <= a.loesung && a.loesung <= bis);
    assert.ok(a.loesung - von <= a.loesung / 5 && bis - a.loesung <= a.loesung / 5, 'höchstens ein Fünftel daneben');
    for (const w of [von, a.loesung, bis]) assert.equal(L.pruefeAntwort(a, String(w)).richtig, true);
    for (const w of [von - 1, bis + 1]) assert.equal(L.pruefeAntwort(a, String(w)).richtig, false);
    for (const f of a.typischeFehler) assert.deepEqual(L.pruefeAntwort(a, String(f.von)), { richtig: false, fehlvorstellung: f.fehlvorstellung });
  }
});

test('Kapitel 2: 13 Lernziele mit je 24 Aufgaben, der Abstecher zählt nicht für den Abschluss', () => {
  const k2 = pool.kapitel.find((k) => k.id === '5.2');
  const lernziele = k2.unterkapitel.flatMap((u) => u.lernziele.map((l) => l.id));
  assert.equal(lernziele.length, 13);
  for (const lz of lernziele) for (const n of ['F', 'G', 'M', 'E']) assert.equal(aufgaben(lz, n).length, 6, `${lz} ${n}`);
  assert.equal(k2.unterkapitel.find((u) => u.id === '5.2.X1').extra, true);
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

test('Münzen am eigenen Zielniveau: auf dem Ziel gleich viel, darüber mehr, Training und Beispiel weniger, Fehlversuch und Tipp kosten nichts', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G')[0], e = aufgaben(S2, 'E')[0], f = aufgaben(S2, 'F')[0];
  assert.equal(L.muenzenFuer(stand, g, ok(), 'G'), 20);
  assert.equal(L.muenzenFuer(stand, e, ok(), 'G'), 25);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'G'), 10);
  assert.equal(L.muenzenFuer(stand, f, ok(), 'F'), 20, 'auf F bringt die Aufgabe am eigenen Ziel so viel wie auf M');
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 1, karten: ['tipp'] }), 'G'), 20, 'Tipp kostet nichts');
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 2, karten: ['tipp', 'beispiel'] }), 'G'), 16);
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 2 }), 'G'), 16, 'alter Eintrag ohne Kartenliste');
  assert.equal(L.muenzenFuer(stand, g, ok({ hilfen: 3 }), 'G'), 1);
  assert.equal(L.muenzenFuer(stand, g, ok({ versuche: 2 }), 'G'), 20, 'zweiter Versuch kostet nichts');
  assert.equal(L.muenzenFuer(stand, g, ok({ geloest: false }), 'G'), 0);
  L.verbuche(stand, g, ok(), 'G', 't');
  assert.equal(L.muenzenFuer(stand, g, ok(), 'G'), 1, 'Wiederholung einer gelösten Aufgabe');
  assert.equal(stand.muenzen, 20);
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
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G'), null, 'von Silber geht es nicht hinunter auf Bronze (ADR 0015)');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'G', 'F'), 'runter', 'außer das Ziel des Kindes ist F');
  const m = aufgaben(S2, 'M');
  for (let i = 0; i < 3; i++) L.verbuche(stand, m[i], ok({ geloest: false }), 'M', 't');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'M'), 'runter');
  L.setzeNiveau(stand, '5.3', 'F');
  assert.equal(L.arbeitsniveau(stand, '5.3', 'M'), 'G', 'eine alte Bronze-Wahl wird zu Silber');
  assert.equal(L.arbeitsniveau(stand, '5.3', 'F'), 'F');
  assert.equal(L.niveauVorschlag(stand, '5.3', 'F', 'F'), null);
  assert.equal(L.niveauVorschlag(stand, '5.4', 'M'), null, 'anderes Kapitel bleibt unberührt');
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
  assert.equal(L.naechsteAufgabe(index, stand, '5.7.1-L1', 'G'), null);
});

test('Meilenstein: Status folgt den Lernzielen', () => {
  const stand = neu();
  const station = pool.kapitel[2].unterkapitel[2];
  assert.equal(L.milestoneStatus(index, stand, pool.kapitel[8].unterkapitel[0]), 'leer');
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
  assert.equal(L.rang(30).naechster.name, 'Fährtenleser');
  assert.equal(L.RAENGE.length, 12, 'zwölf Ränge über sechs Schuljahre');
  assert.equal(L.rang(330).name, 'Ritter der Karte');
  assert.equal(L.rang(1000).naechster, null);
});

test('Wappen: Kauf braucht Münzen und Rang', () => {
  const stand = neu();
  assert.equal(L.kaufe(stand, 'blau'), 'muenzen');
  stand.muenzen = 500;
  assert.equal(L.kaufe(stand, 'blau'), 'ok');
  assert.equal(stand.muenzen, 440);
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
  assert.equal(L.starteMinispiel(stand, { spielpause: false }), 'keine-spielpause');
  assert.equal(L.starteMinispiel(stand, { spielpause: true }), 'ok');
  assert.equal(stand.muenzen, 5);
  assert.equal(L.starteMinispiel(stand, { spielpause: true }), 'muenzen');
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
  assert.equal(start.kapitel.id, '5.1');
  assert.deepEqual([start.geschafft, start.gesamt, start.milestone.id], [0, 5, '5.1.1']);
  // Die Lehrkraft arbeitet in Kapitel 4: Dort geht es weiter.
  const vier = L.einstellungen({ aktuellesKapitel: '5.4' }, stand.code, pool);
  assert.equal(L.etappe(pool, index, stand, vier).milestone.id, '5.4.1');
  // Ein begonnener Meilenstein hat Vorrang, ein gesperrter fällt heraus.
  const zu = L.einstellungen({ aktuellesKapitel: '5.3', sperren: { '5.3.1': [stand.code] } }, stand.code, pool);
  const mitSperre = L.etappe(pool, index, stand, zu);
  assert.deepEqual([mitSperre.gesamt, mitSperre.milestone.id], [4, '5.3.2']);
  // Alle Lernziele des aktuellen Kapitels erreicht: Die Etappe zeigt das nächste offene Kapitel mit Aufgaben.
  for (const u of pool.kapitel.find((k) => k.id === '5.4').unterkapitel) for (const l of u.lernziele) stand.lernziele[l.id] = { t: 'x' };
  assert.equal(L.etappe(pool, index, stand, vier).kapitel.id, '5.1');
});

test('Jeder Meilenstein mit Aufgaben hat einen Merkzettel', () => {
  for (const k of pool.kapitel) for (const u of k.unterkapitel) {
    if (!u.lernziele.some((l) => index.lernzielMitAufgaben.has(l.id))) continue;
    assert.ok(u.merkzettel?.regeln.length >= 3 && u.merkzettel.beispiel, u.id);
  }
});

test('Siegelregel: drei richtige reichen nur mit einer Aufgabe aus AFB II oder III', () => {
  const g = aufgaben('5.4.5-D2', 'M');
  assert.deepEqual(g.map((a) => a.afb), L.AFB_FOLGEN.M);
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

test('Reihenfolge der Aufgaben folgt der Folge der Anforderungsbereiche jeder Niveaustufe', () => {
  for (const n of L.NIVEAUS) {
    const stand = neu(), folge = [], ids = [];
    for (let i = 0; i < 6; i++) {
      const a = L.naechsteAufgabe(index, stand, '5.4.5-D4', n);
      folge.push(a.afb); ids.push(a.id);
      L.verbuche(stand, a, ok({ geloest: false }), 'F', 't', index);
    }
    assert.deepEqual(folge, L.AFB_FOLGEN[n], n);
    assert.deepEqual(ids, [...ids].sort(), 'neue Aufgaben kommen in der Reihenfolge ihrer Nummern');
  }
  assert.ok(!L.AFB_FOLGEN.F.includes(3), 'auf F gibt es keine Aufgabe zum Begründen');
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
  assert.equal(L.muenzenFuer(stand, e.find((a) => a.afb === 3), ok(), 'M'), Math.round(L.MUENZEN.darueber * 1.5));
  assert.equal(L.muenzenFuer(stand, e.find((a) => a.afb === 1), ok(), 'M'), L.MUENZEN.darueber);
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
  assert.equal(L.kaufe(b, 'fahne'), 'ehrenzeichen');
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

test('Einstiegscheck: sechs bis acht Aufgaben aus allen Meilensteinen, G und M, AFB I und II', () => {
  const stand = neu();
  const kapitel = pool.kapitel.find((k) => k.id === '5.3');
  assert.equal(L.einstiegsZustand(stand, index, kapitel), 'offen');
  const e = L.stelleEinstieg(stand, index, kapitel, '2026-11-17T10:00:00Z');
  assert.ok(e.aufgaben.length >= L.EINSTIEG_MIN && e.aufgaben.length <= L.EINSTIEG_MAX, String(e.aufgaben.length));
  const auf = e.aufgaben.map((id) => index.aufgabe.get(id));
  assert.ok(auf.every((a) => ['G', 'M'].includes(a.niveau) && (a.afb ?? 1) <= 2));
  const mitAufgaben = kapitel.unterkapitel.filter((u) => u.lernziele.some((l) => index.lernzielMitAufgaben.has(l.id)));
  for (const u of mitAufgaben) assert.ok(auf.some((a) => index.meilensteinVon.get(a.lernziel).id === u.id), u.id);
  assert.equal(L.einstiegsZustand(stand, index, kapitel), 'laeuft');
});

test('Einstiegscheck: zählt für kein Lernziel, bringt keine Münzen und schlägt eine Krone vor', () => {
  const stand = neu();
  const kapitel = pool.kapitel.find((k) => k.id === '5.3');
  const e = L.stelleEinstieg(stand, index, kapitel, '2026-11-17T10:00:00Z');
  let r;
  for (const id of [...e.aufgaben]) {
    assert.equal(L.naechsteEinstiegsAufgabe(stand, '5.3'), id);
    const a = index.aufgabe.get(id);
    r = L.trageEinstiegEin(stand, '5.3', a, { geloest: a.niveau === 'G', eingaben: [], fehlvorstellungen: [], dauer: 10 }, '2026-11-17T10:05:00Z');
  }
  assert.equal(r.fertig, true);
  assert.equal(r.empfehlung, 'G');
  assert.equal(L.naechsteEinstiegsAufgabe(stand, '5.3'), null);
  assert.equal(L.einstiegsZustand(stand, index, kapitel), null);
  assert.equal(stand.muenzen ?? 0, 0);
  assert.deepEqual(stand.lernziele, {});
  assert.ok(stand.versuche.every((v) => v.einstieg && v.muenzen === 0));
  for (const u of kapitel.unterkapitel) assert.notEqual(L.milestoneStatus(index, stand, u), 'begonnen');
  // Die erste echte Aufgabe ist noch neu, und die Kronenwahl gilt als Selbsteinschätzung.
  const id0 = e.aufgaben[0], lz = index.aufgabe.get(id0).lernziel;
  const ms = index.meilensteinVon.get(lz);
  L.merkeWahl(stand, index, ms, 'G', '2026-11-17T10:10:00Z');
  assert.equal(stand.einschaetzung[ms.id].gewaehlt, 'G');
  assert.equal(L.einstiegsEmpfehlung([{ niveau: 'G', richtig: true }, { niveau: 'M', richtig: true }]), 'E');
  assert.equal(L.einstiegsEmpfehlung([{ niveau: 'G', richtig: true }, { niveau: 'M', richtig: true }, { niveau: 'M', richtig: false }]), 'M');
  assert.equal(L.einstiegsEmpfehlung([{ niveau: 'G', richtig: false }, { niveau: 'M', richtig: false }]), 'G', 'F wird nie empfohlen (ADR 0015)');
});

test('Einstiegscheck: nicht mehr angeboten, wenn im Kapitel schon gearbeitet wurde oder er übersprungen ist', () => {
  const kapitel = pool.kapitel.find((k) => k.id === '5.3');
  const a = neu();
  L.verbuche(a, aufgaben(S2, 'G')[0], ok(), 'G', '2026-11-17T10:05:00Z');
  assert.equal(L.einstiegsZustand(a, index, kapitel), null);
  const b = neu();
  L.ueberspringeEinstieg(b, '5.3', '2026-11-17T10:05:00Z');
  assert.equal(L.einstiegsZustand(b, index, kapitel), null);
  assert.equal(L.einstellungen({ einstiegPflicht: ['5.3'] }, '5A-K4M2', pool).einstiegPflicht.has('5.3'), true);
});

test('Brücke: Vorschlag erst bei wackelig, drei Aufgaben eine Stufe tiefer, einmal am Tag je Lernziel', () => {
  const stand = neu();
  const lz = '5.3.3-S2';
  const g = aufgaben(lz, 'M'); // die Brücke gibt es ab Gold, auf Silber übt das Kind die Grundlage (ADR 0015)
  for (let i = 0; i < 3; i++) L.verbuche(stand, g[i], ok({ geloest: false, versuche: 2 }), 'M', '2026-11-17T10:05:00Z');
  assert.equal(L.brueckeVorschlag(stand, index, lz, '2026-11-17T10:06:00Z'), null);
  L.verbuche(stand, g[3], ok({ geloest: false, versuche: 2 }), 'M', '2026-11-17T10:07:00Z');
  const v = L.brueckeVorschlag(stand, index, lz, '2026-11-17T10:08:00Z');
  assert.equal(v.fuer, lz);
  assert.ok(index.lernziel.get(lz).voraussetzungen.includes(v.zu));
  assert.equal(L.brueckenNiveau('G'), 'F');
  assert.equal(L.brueckenNiveau('F'), 'F');
  const b = L.stelleBruecke(stand, index, v, 'M', '2026-11-17T10:08:00Z');
  assert.equal(b.aufgaben.length, L.BRUECKE_AUFGABEN);
  assert.ok(b.aufgaben.every((id) => index.aufgabe.get(id).niveau === 'G' && index.aufgabe.get(id).lernziel === v.zu));
  assert.equal(L.brueckeVorschlag(stand, index, lz, '2026-11-17T10:09:00Z'), null, 'nicht, solange eine Brücke läuft');
  let r;
  for (const id of [...b.aufgaben]) {
    const a = index.aufgabe.get(id);
    assert.equal(L.naechsteBrueckenAufgabe(stand), id);
    L.verbuche(stand, a, ok(), 'M', '2026-11-17T10:10:00Z', index, { bruecke: true });
    r = L.trageBrueckeEin(stand, a, true, '2026-11-17T10:10:00Z');
  }
  assert.deepEqual({ fertig: r.fertig, richtig: r.richtig, gesamt: r.gesamt, fuer: r.fuer }, { fertig: true, richtig: 3, gesamt: 3, fuer: lz });
  assert.equal(stand.brueckeAktiv, null);
  assert.equal(stand.bruecken.length, 1);
  assert.ok(stand.versuche.filter((x) => x.bruecke).length === 3);
  assert.equal(L.brueckeVorschlag(stand, index, lz, '2026-11-17T12:00:00Z'), null, 'am selben Tag nicht noch einmal');
  assert.ok(L.brueckeVorschlag(stand, index, lz, '2026-11-18T09:00:00Z'), 'am nächsten Tag wieder');
});

test('Brücke: Lernziele ohne Voraussetzungen mit Aufgaben bekommen keine', () => {
  const stand = neu();
  const lz = '5.2.1-N1';
  // 5.2.1-N1 ist der Anfang von Kapitel 2 und baut auf nichts auf, also gibt es auch keine Brücke (ADR 0017).
  assert.deepEqual((index.lernziel.get(lz).voraussetzungen ?? []).filter((id) => index.lernzielMitAufgaben.has(id)), []);
  for (const a of aufgaben(lz, 'G').slice(0, 4)) L.verbuche(stand, a, ok({ geloest: false, versuche: 2 }), 'G', '2026-11-17T10:05:00Z');
  assert.equal(L.brueckeVorschlag(stand, index, lz, '2026-11-17T10:08:00Z'), null);
});

test('Einmaleins-Brücke: Schriftliches Dividieren baut auf Geteilt-Aufgaben aus dem Einmaleins auf', () => {
  for (const lz of ['5.4.1-K1', '5.4.1-K2']) for (const n of L.NIVEAUS) assert.equal(aufgaben(lz, n).length, 6, `${lz} ${n}`);
  assert.equal(index.lernziel.get('5.4.5-D2').voraussetzungen[0], '5.4.1-K2');
  const stand = neu();
  for (const a of aufgaben('5.4.5-D2', 'M').slice(0, 4)) L.verbuche(stand, a, ok({ geloest: false, versuche: 2 }), 'M', '2026-11-17T10:05:00Z');
  const v = L.brueckeVorschlag(stand, index, '5.4.5-D2', '2026-11-17T10:08:00Z');
  assert.equal(v.zu, '5.4.1-K2');
  const b = L.stelleBruecke(stand, index, v, 'M', '2026-11-17T10:08:00Z');
  assert.ok(b.aufgaben.every((id) => index.aufgabe.get(id).lernziel === '5.4.1-K2' && index.aufgabe.get(id).niveau === 'G'));
  // Mit Siegel beim Einmaleins geht die Brücke zur nächsten Voraussetzung ohne Siegel.
  stand.brueckeAktiv = null;
  stand.lernziele['5.4.1-K2'] = { t: '2026-11-16T10:00:00Z' };
  assert.equal(L.brueckeVorschlag(stand, index, '5.4.5-D2', '2026-11-17T10:08:00Z').zu, '5.4.5-D1');
});

// ---------- Niveaustufen nach Abschluss (ADR 0015) ----------
test('Kronenwahl: Bronze steht nur zur Wahl, wenn das Ziel F ist', () => {
  assert.deepEqual(L.wahlNiveaus('M'), ['G', 'M', 'E']);
  assert.deepEqual(L.wahlNiveaus('G'), ['G', 'M', 'E']);
  assert.deepEqual(L.wahlNiveaus('F'), ['F', 'G', 'M', 'E']);
});

test('Hilfekärtchen: auf F liegt der Tipp sofort offen, auf E geht er nicht von selbst auf', () => {
  const je = (n) => aufgaben(S2, n)[0];
  assert.equal(L.kartenZuBeginn(je('F')), 1);
  for (const n of ['G', 'M', 'E']) assert.equal(L.kartenZuBeginn(je(n)), 0, n);
  for (const n of ['F', 'G', 'M']) assert.equal(L.tippVonSelbst(je(n)), true, n);
  assert.equal(L.tippVonSelbst(je('E')), false);
  // Anzahl der Kärtchen: F und G drei, M zwei, E eines.
  const anzahl = (n) => L.KARTEN.filter((k) => je(n).hilfen[k]).length;
  assert.deepEqual(['F', 'G', 'M', 'E'].map(anzahl), [3, 3, 2, 1]);
});

test('Bronze: drei richtige F-Aufgaben reichen, ohne Aufgabe aus AFB II', () => {
  const stand = neu();
  const f = aufgaben(S2, 'F').filter((a) => a.afb === 1);
  for (const a of f.slice(0, 3)) L.verbuche(stand, a, ok(), 'F', 't', index);
  assert.equal(L.lernzielStand(stand, S2, 'F', index).erreicht, true);
  assert.equal(L.lernzielStand(stand, S2, 'G', index).erreicht, false);
});

test('Grundlagen-Schleife: zwei Aufgaben trotz Lösungsschritt nicht gelöst, dann F, nach drei richtigen zurück', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G'), f = aufgaben(S2, 'F');
  const mitSchritt = ok({ geloest: false, versuche: 2, hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] });
  assert.equal(L.verbuche(stand, g[0], mitSchritt, 'M', 't1', index).grundlage, null);
  assert.equal(L.aufgabenNiveau(stand, S2, 'G'), 'G');
  const beginn = L.verbuche(stand, g[1], mitSchritt, 'M', 't2', index).grundlage;
  assert.deepEqual(beginn, { art: 'beginnt', richtige: 0, mal: 1 });
  assert.equal(L.inGrundlage(stand, S2), true);
  assert.equal(L.aufgabenNiveau(stand, S2, 'G'), 'F');
  assert.equal(L.aufgabenNiveau(stand, '5.3.3-S3', 'G'), 'G', 'die Schleife gilt nur für dieses Lernziel');
  assert.equal(L.naechsteAufgabe(index, stand, S2, L.aufgabenNiveau(stand, S2, 'G')).niveau, 'F');
  assert.equal(L.brueckeVorschlag(stand, index, S2, 't'), null, 'in der Schleife gibt es keine Brücke');
  // Eine falsche und eine mit Lösungsschritt gelöste F-Aufgabe zählen nicht.
  assert.equal(L.verbuche(stand, f[0], ok({ geloest: false }), 'M', 't3', index).grundlage.richtige, 0);
  assert.equal(L.verbuche(stand, f[0], ok({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', 't4', index).grundlage.richtige, 0);
  assert.deepEqual(L.verbuche(stand, f[1], ok(), 'M', 't5', index).grundlage, { art: 'laeuft', richtige: 1, mal: 1 });
  assert.equal(L.verbuche(stand, f[1], ok(), 'M', 't6', index).grundlage.richtige, 1, 'dieselbe Aufgabe zählt nur einmal');
  assert.equal(L.verbuche(stand, f[2], ok(), 'M', 't7', index).grundlage.richtige, 2);
  assert.equal(L.grundlageRichtige(stand, S2), 2);
  assert.deepEqual(L.verbuche(stand, f[3], ok(), 'M', 't8', index).grundlage, { art: 'endet', richtige: 3, mal: 1 });
  assert.equal(L.inGrundlage(stand, S2), false);
  assert.equal(L.aufgabenNiveau(stand, S2, 'G'), 'G');
  // Zurück auf G zählt nur, was danach geschieht.
  assert.equal(L.verbuche(stand, g[2], ok(), 'M', 't9', index).grundlage, null);
  assert.equal(L.verbuche(stand, g[3], mitSchritt, 'M', 't10', index).grundlage, null);
  assert.deepEqual(L.verbuche(stand, g[4], mitSchritt, 'M', 't11', index).grundlage, { art: 'beginnt', richtige: 0, mal: 2 });
  assert.equal(stand.grundlage[S2].mal, L.GRUNDLAGE_HINWEIS_AB);
});

test('Grundlagen-Schleife: beginnt auch bei einem wackeligen Lernziel, nicht auf M und nicht bei Ziel F', () => {
  const g = aufgaben(S2, 'G'), m = aufgaben(S2, 'M');
  const falsch = ok({ geloest: false, versuche: 2 });
  const wackelig = neu();
  for (let i = 0; i < 3; i++) assert.equal(L.verbuche(wackelig, g[i], falsch, 'G', 't', index).grundlage, null);
  assert.equal(L.verbuche(wackelig, g[3], falsch, 'G', 't', index).grundlage.art, 'beginnt');
  const aufM = neu();
  for (let i = 0; i < 5; i++) assert.equal(L.verbuche(aufM, m[i], falsch, 'M', 't', index).grundlage, null);
  const zielF = neu();
  for (let i = 0; i < 5; i++) assert.equal(L.verbuche(zielF, g[i], falsch, 'F', 't', index).grundlage, null);
  // Rückblick und Brücke lösen keine Schleife aus.
  const rueck = neu();
  for (let i = 0; i < 5; i++) assert.equal(L.verbuche(rueck, g[i], falsch, 'G', 't', index, { rueckblick: true }).grundlage, null);
});

test('Jedes Lernziel mit Aufgaben nennt seine Grundlage', () => {
  for (const id of index.lernzielMitAufgaben) assert.ok(index.lernziel.get(id).grundlage, id);
});

// ---------- Wegstück und Seitenblick (ADR 0016) ----------
test('Wegstück: fünf Aufgaben, dann Abschluss mit Bilanz; nach jedem vierten Wegstück des Tages eine Rast', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G');
  let e;
  for (let i = 0; i < 4; i++) {
    e = L.trageWegstueckEin(stand, g[i], { richtig: i !== 1, muenzen: i !== 1 ? 15 : 0 }, `2026-11-17T10:0${i}:00Z`);
    assert.equal(e.fertig, false);
    assert.equal(L.wegstueckNummer(stand), i + 2);
  }
  e = L.trageWegstueckEin(stand, g[4], { richtig: true, muenzen: 15 }, '2026-11-17T10:05:00Z');
  assert.deepEqual({ fertig: e.fertig, richtig: e.richtig, muenzen: e.muenzen, heute: e.heute, rast: e.rast }, { fertig: true, richtig: 4, muenzen: 60, heute: 1, rast: false });
  assert.deepEqual(e.punkte, [true, false, true, true, true]);
  assert.equal(stand.wegstueck, null);
  assert.equal(L.wegstueckNummer(stand), 1);
  for (let w = 0; w < 3; w++) for (let i = 0; i < 5; i++) e = L.trageWegstueckEin(stand, g[i], { richtig: true }, '2026-11-17T10:30:00Z');
  assert.equal(e.heute, 4);
  assert.equal(e.rast, true);
  // Ein neuer Tag zählt von vorn.
  for (let i = 0; i < 5; i++) e = L.trageWegstueckEin(stand, g[i], { richtig: true }, '2026-11-18T10:00:00Z');
  assert.equal(e.heute, 1);
});

test('Seitenblick: ab der vierten Aufgabe einmal je Wegstück, nur zu besiegelten Lernzielen desselben Kapitels', () => {
  const stand = neu();
  const g = aufgaben(S2, 'G');
  const anderes = [...index.lernzielMitAufgaben].find((id) => id !== S2 && L.kapitelVon(id) === L.kapitelVon(S2));
  const fremdes = [...index.lernzielMitAufgaben].find((id) => L.kapitelVon(id) !== L.kapitelVon(S2));
  for (let i = 0; i < 3; i++) { assert.equal(L.seitenblickFaellig(stand), false); L.trageWegstueckEin(stand, g[i], { richtig: true }, 't'); }
  assert.equal(L.seitenblickFaellig(stand), true);
  // Ohne Siegel im Kapitel gibt es keinen Seitenblick; ein Siegel in einem anderen Kapitel zählt nicht.
  stand.lernziele[fremdes] = { erreichtAm: 't' };
  assert.equal(L.waehleSeitenblick(index, stand, S2, 'G'), null);
  stand.lernziele[anderes] = { erreichtAm: 't' };
  const blick = L.waehleSeitenblick(index, stand, S2, 'G');
  assert.equal(blick.lernziel, anderes);
  L.trageWegstueckEin(stand, blick, { richtig: true, seitenblick: true }, 't');
  assert.equal(L.seitenblickFaellig(stand), false);
});

test('Seitenblick zählt für kein Lernziel, keine Krone, keine Selbsteinschätzung und keine Grundlagen-Schleife', () => {
  const stand = neu();
  const m = aufgaben(S2, 'M');
  for (const a of m.slice(0, 4)) L.verbuche(stand, a, ok(), 'M', 't', index, { seitenblick: true });
  assert.equal(stand.lernziele[S2], undefined);
  assert.equal(L.lernzielStand(stand, S2, 'M', index).richtige, 0);
  assert.equal(L.krone(index, stand, index.meilensteinVon.get(S2)), null);
  assert.ok(stand.versuche.every((v) => v.seitenblick));
  assert.ok(stand.versuche.every((v) => v.muenzen > 0), 'Münzen gibt es trotzdem');
  // Viele falsche Seitenblicke auf G lösen keine Grundlagen-Schleife aus und machen das Lernziel nicht wackelig.
  const g = aufgaben(S2, 'G');
  for (const a of g) L.verbuche(stand, a, ok({ geloest: false, versuche: 2, hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', 't', index, { seitenblick: true });
  assert.equal(L.inGrundlage(stand, S2), false);
  assert.equal(L.istWackelig(stand, S2), false);
});

test('Klassendatei: Rast standardmäßig an, Ton standardmäßig aus', () => {
  const ohne = L.einstellungen(null, '5A-K4M2', pool);
  assert.equal(ohne.rast, true); assert.equal(ohne.ton, false);
  const mit = L.einstellungen({ rast: false, ton: true }, '5A-K4M2', pool);
  assert.equal(mit.rast, false); assert.equal(mit.ton, true);
});

test('Strichliste: Zahl und Bündel zählen, ab M auch der eigene Querstrich', () => {
  const zeilen = [{ name: 'Hund', loesung: 6 }, { name: 'Katze', loesung: 3 }];
  const auto = { format: 'strichliste', buendeln: 'auto', zeilen }, selbst = { ...auto, buendeln: 'selbst' };
  assert.deepEqual(L.pruefeAntwort(auto, ['IIII/I', 'III']), { richtig: true, fehlvorstellung: null });
  assert.deepEqual(L.pruefeAntwort(selbst, ['IIII/I', 'III']), { richtig: true, fehlvorstellung: null });
  // Fünf Striche und dann der Querstrich: Die Zahl stimmt, das Bündel nicht.
  assert.deepEqual(L.pruefeAntwort(selbst, ['IIIII/', 'III']), { richtig: false, fehlvorstellung: 'strich-buendel-falsch' });
  assert.deepEqual(L.pruefeAntwort(selbst, ['IIII/II', 'III']), { richtig: false, fehlvorstellung: 'liste-verzaehlt' });
  assert.equal(L.pruefeAntwort(auto, ['IIII/', 'III']).richtig, false);
  assert.equal(L.richtigGebuendelt('IIII/IIII/II'), true);
  assert.equal(L.richtigGebuendelt('IIIII'), false);
});

test('Säulen zeichnen: jede offene Säule muss auf ihrem Wert stehen', () => {
  const diagramm = { fein: 2, schritt: 10, max: 30, saeulen: [{ name: 'A', wert: 8, offen: true }, { name: 'B', wert: 12 }, { name: 'C', wert: 14, offen: true }] };
  const a = { format: 'zeichnen', diagramm };
  assert.deepEqual(L.pruefeAntwort(a, [8, 12, 14]), { richtig: true, fehlvorstellung: null });
  assert.deepEqual(L.pruefeAntwort(a, [4, 12, 14]), { richtig: false, fehlvorstellung: 'skala-einerschritte' });
  assert.deepEqual(L.pruefeAntwort(a, [14, 12, 8]), { richtig: false, fehlvorstellung: 'diagramm-vertauscht' });
  assert.deepEqual(L.pruefeAntwort(a, [10, 12, 14]), { richtig: false, fehlvorstellung: null });
});
