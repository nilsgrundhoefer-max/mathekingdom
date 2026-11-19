// Münzen einlösen (ADR 0018): Wappenschrank, Haupt- und Beizeichen, Ehrenzeichen, Spielfreigabe, Bestenliste, Spielregeln.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as SP from '../src/schueler/spiele.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const neu = (code = '5A-K4M2') => L.neuerSpeicherstand(code, '5a', '2026-11-17T10:00:00Z');
const zufall = (() => { let x = 42; return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648); })();

test('Wappenschrank Klasse 5: etwa 12 Farben und 20 Zeichen, zusammen etwa 5.000 Münzen, einzeln höchstens 600', () => {
  const kaufbar = L.WAPPEN_TEILE.filter((t) => t.klasse === 5 && t.preis != null);
  assert.equal(kaufbar.filter((t) => t.art === 'farbe').length, 12);
  assert.equal(kaufbar.filter((t) => t.art === 'zeichen').length, 20);
  const summe = kaufbar.reduce((s, t) => s + t.preis, 0);
  assert.ok(summe >= 4500 && summe <= 5500, `Summe ${summe}`);
  assert.ok(kaufbar.every((t) => t.preis <= 600));
  assert.ok(kaufbar.every((t) => t.rang < L.RAENGE.length));
  assert.equal(new Set(L.WAPPEN_TEILE.map((t) => t.id)).size, L.WAPPEN_TEILE.length, 'Ids eindeutig');
  assert.deepEqual(L.WAPPEN_TEILE.filter((t) => t.ehre).map((t) => t.id), ['fahne', 'purpurrose', 'kapitelband', 'wegstern']);
});

test('Ein Wappen trägt ein Hauptzeichen und bis zu zwei Beizeichen', () => {
  const stand = neu();
  stand.muenzen = 5000;
  for (const id of ['kreis', 'raute', 'stern', 'feder']) assert.equal(L.kaufe(stand, id), 'ok');
  for (const id of ['kreis', 'raute', 'stern']) L.legeAn(stand, id);
  assert.deepEqual(stand.wappen.zeichen, ['kreis', 'raute', 'stern']);
  L.legeAn(stand, 'feder');
  assert.deepEqual(stand.wappen.zeichen, ['kreis', 'raute', 'feder'], 'ein viertes ersetzt das letzte Beizeichen');
  L.macheHauptzeichen(stand, 'feder');
  assert.deepEqual(stand.wappen.zeichen, ['feder', 'kreis', 'raute']);
  L.legeAn(stand, 'feder');
  assert.deepEqual(stand.wappen.zeichen, ['kreis', 'raute'], 'abnehmen: das erste Beizeichen rückt nach');
  assert.equal(L.kaufe(stand, 'purpurrose'), 'ehrenzeichen', 'Ehrenzeichen kann man nicht kaufen');
});

test('Alte Wappen mit mehr als drei Zeichen behalten die drei teuersten, das teuerste wird Hauptzeichen', () => {
  const stand = L.migriere({ ...neu(), wappen: { farbe: 'rot', zeichen: ['eichenlaub', 'balken', 'zirkel', 'lilie', 'winkel'], gekauft: ['rot', 'eichenlaub', 'balken', 'zirkel', 'lilie', 'winkel'] } });
  assert.equal(stand.wappen.zeichen[0], 'lilie');
  assert.equal(stand.wappen.zeichen.length, 3);
  assert.equal(stand.wappen.gekauft.length, 6, 'gekaufte Teile bleiben alle');
});

test('Ehrenzeichen: Purpurrose, Kapitelband und Wegstern werden verdient, nicht gekauft', () => {
  const stand = neu();
  assert.deepEqual(L.vergebeEhrenzeichen(stand, pool, index), []);
  // 25 Wegstücke mit mindestens 4 von 5 richtig
  stand.wegstuecke = Array.from({ length: 25 }, (_, i) => ({ t: 't', tag: `2026-11-${10 + (i % 9)}`, richtig: i % 2 ? 4 : 5, gesamt: 5, muenzen: 80 }));
  assert.deepEqual(L.vergebeEhrenzeichen(stand, pool, index), ['wegstern']);
  assert.deepEqual(L.vergebeEhrenzeichen(stand, pool, index), [], 'nur einmal');
  // Alle Lernziele eines Kapitels besiegelt
  const kapitel = pool.kapitel.find((k) => k.unterkapitel.some((u) => u.lernziele.some((l) => index.lernzielMitAufgaben.has(l.id))));
  for (const l of kapitel.unterkapitel.flatMap((u) => u.lernziele)) stand.lernziele[l.id] = { erreichtAm: '2026-11-17T10:00:00Z' };
  assert.ok(L.vergebeEhrenzeichen(stand, pool, index).includes('kapitelband'));
  assert.deepEqual(stand.neueEhre, ['wegstern', 'kapitelband']);
});

test('Spielfreigabe: aus, nur in der Spielpause, verdient nach jedem vierten Wegstück', () => {
  const stand = neu();
  stand.muenzen = 1000;
  const aus = { spielfreigabe: 'aus', spielpause: true };
  assert.equal(L.spielErlaubt(stand, aus, 'kopfrechnen'), 'aus', 'aus gilt auch in einer Spielpause');
  const pause = { spielfreigabe: 'spielpause', spielpause: false };
  assert.equal(L.spielErlaubt(stand, pause, 'botenritt'), 'keine-spielpause');
  assert.equal(L.spielErlaubt(stand, { ...pause, spielpause: true }, 'botenritt'), 'ok');
  const verdient = { spielfreigabe: 'verdient', spielpause: false };
  assert.equal(L.spielErlaubt(stand, verdient, 'kopfrechnen'), 'ok', 'Rechenpause geht bei „verdient“ immer');
  assert.equal(L.spielErlaubt(stand, verdient, 'burgmauer'), 'nicht-verdient');
  // Vier Wegstücke an einem Tag bringen eine Gutschrift, wie die Rast.
  const aufgabe = { id: 'x' };
  for (let w = 0; w < 4; w++) for (let i = 0; i < 5; i++) L.trageWegstueckEin(stand, aufgabe, { richtig: true }, `2026-11-17T1${w}:0${i}:00`);
  assert.equal(stand.spielGutschrift, 1);
  assert.equal(L.starteMinispiel(stand, verdient, 'burgmauer'), 'ok');
  assert.equal(stand.muenzen, 900);
  assert.equal(stand.spielGutschrift, 0, 'die Gutschrift ist verbraucht');
  assert.equal(L.starteMinispiel(stand, verdient, 'burgmauer'), 'nicht-verdient');
  const arm = neu();
  arm.muenzen = 99;
  assert.equal(L.starteMinispiel(arm, { spielpause: true }, 'botenritt'), 'muenzen');
});

test('Klassendatei: Spielfreigabe ist standardmäßig „nur in der Spielpause“, Bestenliste an', () => {
  const e = L.einstellungen({}, '5A-K4M2', pool);
  assert.equal(e.spielfreigabe, 'spielpause');
  assert.equal(e.bestenliste, true);
  const f = L.einstellungen({ spielfreigabe: 'verdient', bestenliste: false }, '5A-K4M2', pool);
  assert.equal(f.spielfreigabe, 'verdient');
  assert.equal(f.bestenliste, false);
  assert.equal(L.einstellungen({ spielfreigabe: 'quatsch' }, '5A-K4M2', pool).spielfreigabe, 'spielpause');
});

test('Bestenliste: die fünf Besten dieser Woche mit Beinamen, eigener Platz, ausblenden', () => {
  const jetzt = '2026-11-19T10:00:00'; // Donnerstag
  const schueler = Array.from({ length: 7 }, (_, i) => {
    const st = neu(`5A-AA${i}${i}`);
    L.trageSpielEin(st, 'botenritt', 10 + i, '2026-11-18T09:00:00');
    L.trageSpielEin(st, 'botenritt', 99, '2026-11-14T09:00:00'); // letzte Woche: zählt nicht
    return st;
  });
  const [ich, ...andere] = schueler; // ich habe 10 Punkte, alle anderen mehr
  andere[5].bestenlisteAus = true;   // 16 Punkte, ausgeblendet
  const b = L.bestenliste(ich, andere, 'botenritt', jetzt);
  assert.deepEqual(b.plaetze.map((p) => p.punkte), [15, 14, 13, 12, 11]);
  assert.equal(b.eigenerPlatz, 6);
  assert.ok(b.plaetze.every((p) => !/5A-/.test(p.beiname)), 'nie der Code');
  assert.equal(L.bestenliste(ich, andere, 'burgmauer', jetzt).plaetze.length, 0, 'jedes Spiel hat eine eigene Liste');
  // Ab Montag beginnt die Liste neu.
  assert.equal(L.bestenliste(ich, andere, 'botenritt', '2026-11-23T08:00:00').plaetze.length, 0);
  assert.equal(L.bestwert(ich, 'botenritt'), 99, 'der eigene Bestwert bleibt');
  // Wer sich ausblendet, steht für die anderen nicht in der Liste, sieht aber seinen Platz.
  const ausgeblendet = L.bestenliste(andere[5], [ich, ...andere.slice(0, 5)], 'botenritt', jetzt);
  assert.equal(ausgeblendet.ausgeblendet, true);
  assert.equal(ausgeblendet.eigenerPlatz, 1);
  assert.ok(ausgeblendet.plaetze.every((p) => !p.eigen));
});

test('Beiname: fest aus dem Code, frei wählbar nur aus den Bausteinen', () => {
  const st = neu();
  const vorher = L.beiname(st);
  assert.equal(L.beiname(neu()), vorher, 'derselbe Code, derselbe Beiname');
  assert.equal(L.aendereBeiname(st, 'Kluger', 'Otter'), 'ok');
  assert.equal(L.beiname(st), 'Kluger Otter');
  assert.equal(L.aendereBeiname(st, 'Doofer', 'Otter'), 'ungueltig');
  assert.equal(L.beiname(st), 'Kluger Otter', 'freie Wörter gehen nicht');
});

test('Beiname: erste Änderung kostenlos, danach 50 Münzen (ADR 0020)', () => {
  const st = neu();
  st.muenzen = 70;
  assert.equal(L.preisBeiname(st), 0);
  assert.equal(L.aendereBeiname(st, 'Kluger', 'Otter'), 'ok');
  assert.equal(st.muenzen, 70, 'die erste Änderung kostet nichts');
  assert.equal(L.preisBeiname(st), 50);
  assert.equal(L.aendereBeiname(st, 'Kluger', 'Otter'), 'gleich', 'derselbe Name kostet nichts');
  assert.equal(st.muenzen, 70);
  assert.equal(L.aendereBeiname(st, 'Flinker', 'Fuchs'), 'ok');
  assert.equal(st.muenzen, 20);
  assert.equal(L.aendereBeiname(st, 'Stiller', 'Biber'), 'zu-wenig');
  assert.equal(L.beiname(st), 'Flinker Fuchs');
  assert.equal(st.muenzen, 20);
  // Ein alter Stand mit gewähltem Beinamen, aber ohne Merker, hat die kostenlose Änderung noch.
  const alt = neu();
  alt.beiname = { vorne: 'Roter', hinten: 'Igel' };
  alt.muenzen = 0;
  assert.equal(L.preisBeiname(alt), 0);
  assert.equal(L.aendereBeiname(alt, 'Weiser', 'Igel'), 'ok');
  assert.equal(L.preisBeiname(alt), 50);
});

test('Wochenbeginn ist der Montag', () => {
  assert.equal(L.wocheVon('2026-11-19T10:00:00'), '2026-11-16');
  assert.equal(L.wocheVon('2026-11-16T00:30:00'), '2026-11-16');
  assert.equal(L.wocheVon('2026-11-22T23:00:00'), '2026-11-16');
});

test('Botenritt: Briefe machen das Gefolge länger, Rand und eigenes Gefolge beenden die Runde', () => {
  const r = SP.neuerRitt(zufall);
  r.brief = [6, r.glieder[0][1]];
  SP.rittSchritt(r, zufall);
  assert.equal(r.punkte, 1);
  assert.equal(r.glieder.length, 4);
  assert.ok(SP.rittTakt(r) < SP.RITT.schrittMs, 'mit jedem Brief etwas schneller');
  SP.lenkeRitt(r, 'ArrowLeft');
  assert.deepEqual(r.naechste, [1, 0], 'umkehren geht nicht');
  for (let i = 0; i < 40 && !r.vorbei; i++) { r.brief = null; SP.rittSchritt(r, zufall); }
  assert.equal(r.vorbei, true, 'am Rand ist Schluss');
  const k = SP.neuerRitt(zufall);
  k.glieder = [[5, 5], [5, 6], [4, 6], [4, 5], [4, 4]];
  k.richtung = [0, -1]; k.brief = null;
  SP.lenkeRitt(k, 'ArrowLeft'); SP.rittSchritt(k, zufall);
  assert.equal(k.vorbei, true, 'ins eigene Gefolge');
});

test('Burgmauer: Treffer bringen Punkte, Raben an der Mauer kosten Banner', () => {
  const m = SP.neueMauer();
  m.raben.push({ x0: m.x, y: SP.MAUER.mauerY - 120, weite: 0, phase: 0, tempo: 0, t: 0 });
  m.bisRabe = 1e9;
  for (let i = 0; i < 30; i++) SP.mauerSchritt(m, 16, { schiessen: true }, zufall);
  assert.equal(m.punkte, 1);
  m.raben.push({ x0: 40, y: SP.MAUER.mauerY - 2, weite: 0, phase: 0, tempo: 10, t: 0 });
  SP.mauerSchritt(m, 16, {}, zufall);
  assert.equal(m.banner, SP.MAUER.banner - 1);
  m.banner = 1;
  m.raben.push({ x0: 40, y: SP.MAUER.mauerY - 2, weite: 0, phase: 0, tempo: 10, t: 0 });
  SP.mauerSchritt(m, 16, {}, zufall);
  assert.equal(m.vorbei, true);
  const x = SP.neueMauer().x;
  const n = SP.neueMauer();
  SP.mauerSchritt(n, 500, { links: true }, zufall);
  assert.ok(n.x < x, 'die Armbrust fährt');
});
