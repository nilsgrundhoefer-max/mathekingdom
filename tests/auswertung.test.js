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
  assert.equal(lernziele.length, 23);
  const spalte = lernziele.findIndex((l) => l.id === S2);
  const matrix = A.lernzielmatrix(staende, lernziele, {});
  assert.equal(matrix[0].zellen[spalte].status, 'siegel');
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

test('Berichtstabellen: acht Blätter, Namen aus der Namensliste', () => {
  const stand = neu();
  L.verbuche(stand, aufgaben(S2, 'G')[0], b(), 'G', JETZT);
  const blaetter = A.berichtstabellen([{ code: '5A-AAAA', stand }], pool, index, {}, () => 'Lena Muster', JETZT);
  assert.deepEqual(blaetter.map((x) => x.name), ['Übersicht', 'Lernzielmatrix', 'Lernziele', 'Typische Fehler', 'Aufgaben-Audit', 'Versuchsprotokoll', 'Nach AFB, Typ, Straße', 'Alle Aufgaben']);
  assert.equal(blaetter[0].zeilen[1][0], 'Lena Muster');
  assert.equal(blaetter[5].zeilen.length, 2);
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

test('Live-Status: Hilferuf, blockiert, beobachten, im Flow, inaktiv, nicht da', () => {
  const g = aufgaben(S2, 'G');
  const mit = (tun) => { const st = neu(); tun(st); st.geaendert ??= JETZT; return A.livestatus(st, 'G', JETZT); };
  assert.equal(A.livestatus(null, 'G', JETZT).status, 'fehlt');
  assert.equal(mit((st) => { st.geaendert = '2026-11-16T10:00:00Z'; }).status, 'fehlt');
  assert.equal(mit((st) => { st.geaendert = JETZT; }).status, 'inaktiv');
  // drei richtige in Folge
  assert.equal(mit((st) => { for (let i = 0; i < 3; i++) L.verbuche(st, g[i], b(), 'G', '2026-11-17T10:2' + i + ':00Z'); st.geaendert = JETZT; }).status, 'flow');
  // zwei ungelöste Aufgaben mit je zwei Versuchen: vier Fehlversuche in Folge
  const rot = mit((st) => { for (let i = 0; i < 2; i++) L.verbuche(st, g[i], b({ geloest: false, versuche: 2 }), 'G', '2026-11-17T10:2' + i + ':00Z'); st.geaendert = JETZT; });
  assert.equal(rot.status, 'blockiert');
  assert.equal(rot.fehlversuche, 4);
  // seit sechs Minuten an derselben Aufgabe
  assert.equal(mit((st) => { st.aktiv = { aufgabe: g[0].id, seit: '2026-11-17T10:24:00Z', fehlversuche: 0, hilfen: 0 }; }).status, 'blockiert');
  // Tipp gezogen
  const gelb = mit((st) => { st.aktiv = { aufgabe: g[0].id, seit: '2026-11-17T10:29:00Z', fehlversuche: 1, hilfen: 1 }; });
  assert.equal(gelb.status, 'beobachten');
  assert.match(gelb.kontext, /1 Hilfekärtchen gezogen, 1 Fehlversuche/);
  // Hilferuf geht vor
  const ruf = mit((st) => { L.rufeHilfe(st, g[0].id, '2026-11-17T10:27:00Z'); });
  assert.equal(ruf.status, 'hilfe');
  assert.equal(ruf.minuten, 3);
  // alte Fehlversuche von gestern machen niemanden rot
  assert.notEqual(mit((st) => { for (let i = 0; i < 2; i++) L.verbuche(st, g[i], b({ geloest: false, versuche: 2 }), 'G', '2026-11-16T10:2' + i + ':00Z'); st.aktiv = { aufgabe: g[2].id, seit: '2026-11-17T10:29:30Z' }; }).status, 'blockiert');
});

test('Impulse: Lernbegleiter, Fehlerhäufung, Schnellläufer', () => {
  const g = aufgaben(S2, 'G');
  const gut = neu('5A-GUTE');
  for (let i = 0; i < 3; i++) L.verbuche(gut, g[i], b(), 'G', '2026-11-17T10:1' + i + ':00Z');
  gut.geaendert = JETZT;
  assert.ok(gut.lernziele[S2]);
  const schwach = neu('5A-HILF');
  const staende = [{ code: '5A-GUTE', stand: gut }, { code: '5A-HILF', stand: schwach }];
  assert.deepEqual(A.lernbegleiter(staende, S2, {}, JETZT, '5A-HILF'), ['5A-GUTE']);
  assert.deepEqual(A.lernbegleiter(staende, S2, {}, JETZT, '5A-GUTE'), []);

  const drei = ['5A-AAAA', '5A-BBBB', '5A-CCCC'].map((code) => {
    const st = neu(code);
    L.verbuche(st, g[0], b({ geloest: false, versuche: 2, fehlvorstellungen: ['sub-uebertrag-vergessen'] }), 'G', '2026-11-17T10:20:00Z');
    return { code, stand: st };
  });
  assert.deepEqual(A.fehlerHaeufung(drei, JETZT), [{ fehlvorstellung: 'sub-uebertrag-vergessen', codes: ['5A-AAAA', '5A-BBBB', '5A-CCCC'] }]);
  assert.deepEqual(A.fehlerHaeufung(drei.slice(0, 2), JETZT), []);

  // Station Subtrahieren ganz abgeschlossen
  const fertig = neu('5A-FERT');
  for (const kurz of ['S1', 'S2', 'S3', 'S4', 'S5']) for (let i = 0; i < 3; i++) L.verbuche(fertig, aufgaben(`5.3.3-${kurz}`, 'G')[i], b(), 'G', '2026-11-17T10:15:00Z');
  const lauf = A.schnelllaeufer([{ code: '5A-FERT', stand: fertig }, ...staende], pool, index, { '5A-FERT': 'G' }, JETZT);
  assert.equal(lauf.length, 1);
  assert.deepEqual([lauf[0].code, lauf[0].milestone, lauf[0].naechstes], ['5A-FERT', '5.3.3', 'M']);
});

test('Anforderungsbereiche, Wirkung der Hilfen und Aufgaben-Audit', () => {
  assert.ok(pool.aufgaben.every((a) => [1, 2, 3].includes(a.afb)));
  assert.ok(pool.aufgaben.some((a) => a.afb === 3));
  const stand = neu();
  const g = aufgaben(S2, 'G');
  L.verbuche(stand, g[0], b(), 'G', JETZT);
  L.verbuche(stand, g[1], b({ geloest: false, versuche: 2, hilfen: 1, eingaben: ['77', '77'] }), 'G', JETZT);
  const profil = A.afbProfil(stand, index);
  assert.deepEqual(profil[1], { bearbeitet: 2, quote: 0.5 });
  assert.equal(profil[3].quote, null);
  const w = A.hilfenWirkung(stand);
  assert.equal(w.ohne.quote, 1); assert.equal(w.mit.quote, 0);

  const staende = ['5A-AAAA', '5A-BBBB', '5A-CCCC'].map((code) => {
    const st = neu(code);
    L.verbuche(st, g[0], b({ geloest: false, versuche: 2, eingaben: ['77', '77'] }), 'G', JETZT);
    st.abbrueche.push({ t: JETZT, aufgabe: g[0].id, fehlversuche: 1, hilfen: 0 });
    return { code, stand: st };
  });
  const [a] = A.aufgabenAudit(staende, index);
  assert.equal(a.aufgabe, g[0].id);
  assert.equal(a.quote, 0);
  assert.equal(a.abbrueche, 3);
  assert.equal(a.abbruchquote, 0.5);
  assert.equal(a.haeufigsteFalsche, '77');
  assert.equal(a.haeufigsteAnzahl, 6);
  assert.equal(a.auffaellig, true);
});

test('Klassendatei: gesperrte Stationen und Nachricht je Schüler', () => {
  const e = L.einstellungen({ sperren: { '5.3.3': ['5A-AAAA'], '5.4.5': ['5A-BBBB'] }, nachrichten: { '5A-AAAA': { t: JETZT, text: 'Komm bitte nach vorn.' } } }, '5A-AAAA', pool);
  assert.deepEqual([...e.gesperrteMeilensteine], ['5.3.3']);
  assert.equal(e.nachricht.text, 'Komm bitte nach vorn.');
  assert.equal(L.einstellungen(null, '5A-AAAA', pool).gesperrteMeilensteine.size, 0);
});

test('PIN: vier Ziffern, Prüfwert statt PIN, falsche PIN fällt durch', async () => {
  for (let i = 0; i < 50; i++) assert.match(K.neuePin(), /^\d{4}$/);
  const eintrag = await K.pinEintrag('4711');
  assert.deepEqual(Object.keys(eintrag).sort(), ['salz', 'wert']);
  assert.ok(!JSON.stringify(eintrag).includes('4711'));
  assert.equal(await K.pruefePin('4711', eintrag), true);
  assert.equal(await K.pruefePin(' 4711 ', eintrag), true);
  assert.equal(await K.pruefePin('4712', eintrag), false);
  assert.equal(await K.pruefePin('', eintrag), false);
  assert.notEqual((await K.pinEintrag('4711')).wert, eintrag.wert); // eigenes Salz je Schüler
  assert.deepEqual(L.einstellungen({ pins: { '5A-AAAA': eintrag } }, '5A-AAAA', pool).pin, eintrag);
  assert.equal(L.einstellungen({ pins: {} }, '5A-AAAA', pool).pin, null);
});

test('Auswertung nach AFB, Aufgabentyp und Linie, Sichten auf einzelne Aufgaben', () => {
  const g = aufgaben(S2, 'G');
  const eins = neu('5A-AAAA'), zwei = neu('5A-BBBB');
  L.verbuche(eins, g[0], b(), 'G', JETZT);
  L.verbuche(zwei, g[0], b(), 'G', JETZT);
  L.verbuche(eins, g[1], b({ geloest: false, versuche: 2, eingaben: ['1', '2'] }), 'G', JETZT);
  zwei.abbrueche.push({ t: JETZT, aufgabe: g[2].id, fehlversuche: 0, hilfen: 0 });
  const u = A.aufgabenUebersicht([{ code: '5A-AAAA', stand: eins }, { code: '5A-BBBB', stand: zwei }], pool, index);
  assert.equal(u.aufgaben.length, pool.aufgaben.length);
  // Gruppen: Summen stimmen mit dem Pool und den Bearbeitungen überein.
  for (const gruppen of [u.afb, u.format, u.niveau]) {
    assert.equal(gruppen.reduce((s, x) => s + x.imPool, 0), pool.aufgaben.length);
    assert.equal(gruppen.reduce((s, x) => s + x.bearbeitet, 0), 3);
    assert.equal(gruppen.reduce((s, x) => s + x.abbrueche, 0), 1);
  }
  const linieG = u.niveau.find((x) => x.wert === 'G');
  assert.deepEqual([linieG.genutzt, linieG.bearbeitet, Math.round(linieG.quote * 100), linieG.abbruchquote], [2, 3, 67, 0.25]);
  assert.equal(u.niveau.find((x) => x.wert === 'E').quote, null);
  assert.equal(u.format.find((x) => x.wert === g[0].format).name, A.FORMAT_NAMEN[g[0].format]);
  // Sichten
  const ids = (sicht, filter) => A.aufgabenSicht(u.aufgaben, sicht, filter).map((a) => a.aufgabe);
  assert.deepEqual(ids('geloest'), [g[0].id]);
  assert.deepEqual(ids('schwierig'), [g[1].id, g[0].id]);
  assert.deepEqual(ids('nieGeloest'), [g[1].id]);
  assert.deepEqual(ids('abgebrochen'), [g[2].id]);
  // Nie bearbeitet: nur aus Lernziel und Linie, an denen gearbeitet wurde, und ohne die abgebrochene Aufgabe.
  assert.deepEqual(ids('nie'), g.slice(3).map((a) => a.id).sort());
  assert.deepEqual(ids('bearbeitet', { niveau: 'E' }), []);
  assert.deepEqual(ids('bearbeitet', { milestone: '5.3.3', afb: g[0].afb, format: g[0].format }).includes(g[0].id), true);
});

test('Lernzielstand: offen, begonnen, wackelig, Siegel; Bereich beim Öffnen', () => {
  const stand = neu();
  assert.equal(A.lernzielZustand(stand, S2), 'offen');
  const g = aufgaben(S2, 'G');
  L.verbuche(stand, g[0], b({ geloest: false }), 'G', JETZT);
  assert.equal(A.lernzielZustand(stand, S2), 'begonnen');
  for (const a of g.slice(1, 4)) L.verbuche(stand, a, b({ geloest: false }), 'G', JETZT);
  assert.equal(A.lernzielZustand(stand, S2), 'wackelig', 'vier Aufgaben, keine gelöst');
  const zwei = neu();
  for (const a of g.slice(0, 2)) L.verbuche(zwei, a, b({ hilfen: 3, karten: L.KARTEN }), 'G', JETZT);
  assert.equal(A.lernzielZustand(zwei, S2), 'wackelig', 'zweimal Lösungsschritt');
  zwei.lernziele[S2] = { erreichtAm: JETZT };
  assert.equal(A.lernzielZustand(zwei, S2), 'siegel');
  assert.equal(A.jemandAktiv([{ code: 'x', stand }], '2026-11-17T10:35:00Z'), true);
  assert.equal(A.jemandAktiv([{ code: 'x', stand }], '2026-11-17T11:30:00Z'), false);
});
