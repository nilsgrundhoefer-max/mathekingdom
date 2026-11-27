// Version 0.67 (ADR 0057): Kapitelende, Vorausarbeiten, Tagessperre, Purpur-Wahl im neuen Kapitel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import * as SCH from '../src/gemeinsam/schule.js';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const index = L.indexiere(pool);
const CODE = '5A-K4M2';
const GESTERN = '2026-11-26T09:00:00Z', HEUTE = '2026-11-27T09:00:00Z', SPAETER = '2026-11-27T09:30:00Z';
const kapitel = (id) => pool.kapitel.find((k) => k.id === id);
const ok = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, karten: [], dauer: 20, ...extra });
const neu = () => L.neuerSpeicherstand(CODE, '5a', '2026-11-19T10:00:00Z');
const einst = (k = {}) => L.einstellungen({ aktuellesKapitel: '5.1', tore: ['5.1'], ...k }, CODE, pool);
const lernziele = (kap, ziel = 'M') => kapitel(kap).unterkapitel.filter((u) => !L.istAbstecher(u, ziel)).flatMap((u) => u.lernziele).map((l) => l.id).filter((id) => index.lernzielMitAufgaben.has(id));
// Drei Aufgaben je Lernziel, die anspruchsvollsten zuerst: reicht für Siegel und Krone auf dieser Stufe.
const meistere = (stand, ids, n = 'M', ziel = 'M', t = GESTERN) => {
  for (const lz of ids) for (const a of [...index.nach.get(`${lz}|${n}`)].sort((x, y) => y.afb - x.afb).slice(0, 3)) L.verbuche(stand, a, ok(), ziel, t, index);
};

test('Kapitel geschafft: erst wenn alle Pflicht-Meilensteine gemeistert sind', () => {
  const stand = neu(), e = einst(), ids = lernziele('5.1');
  meistere(stand, ids.slice(0, -1));
  assert.equal(L.kapitelStand(index, stand, kapitel('5.1'), e), null);
  assert.equal(L.kapitelendeAngebot(pool, index, stand, e, kapitel('5.1'), HEUTE), null);
  meistere(stand, ids.slice(-1));
  assert.equal(L.kapitelStand(index, stand, kapitel('5.1'), e), 'geschafft');
  assert.equal(L.fuehrungsMeilenstein(index, stand, kapitel('5.1'), e, 'M', HEUTE), null, 'die Führung bietet keine alten Aufgaben mehr an');
});

test('Lernpfad geschafft: zweimal nur unter dem Ziel zählt für das Kapitelende', () => {
  const stand = neu(), e = einst(), ids = lernziele('5.1');
  meistere(stand, ids.slice(1));
  stand.unterZiel = { [ids[0]]: { mal: L.UNTER_ZIEL_HOECHSTENS, niveau: 'G', t: GESTERN } };
  assert.equal(L.kapitelStand(index, stand, kapitel('5.1'), e), 'lernpfad');
  const an = L.kapitelendeAngebot(pool, index, stand, { ...e, voraus: false }, kapitel('5.1'), HEUTE);
  assert.equal(an.zustand, 'lernpfad');
  assert.equal(an.haupt.art, 'fertig', 'keine höhere Krone, solange ein Siegel fehlt');
  assert.ok(L.vorausKapitel(pool, index, stand, e), 'darf trotzdem vorausarbeiten');
});

test('Hauptknopf am Kapitelende: nächstes Kapitel, Rückblick, frühere Kapitel, höhere Krone, sonst fertig', () => {
  const stand = neu(), ids = lernziele('5.1');
  meistere(stand, ids);
  const an = (e, t = HEUTE) => L.kapitelendeAngebot(pool, index, stand, e, kapitel('5.1'), t).haupt;
  // Vorausarbeiten an: Das Tor zum nächsten Kapitel ist offen.
  const mit = L.mitVorausarbeiten(pool, index, stand, einst());
  assert.equal(mit.vorausKapitel, '5.2');
  assert.ok(mit.offeneKapitel.has('5.2') && mit.einstiegPflicht.has('5.2'), 'mit Einstiegscheck');
  assert.deepEqual([an(mit).art, an(mit).kapitel.id], ['kapitel', '5.2']);
  // Vorausarbeiten aus: höhere Krone. Purpur ist hier ein Angebot am Kapitelende.
  const ohne = L.mitVorausarbeiten(pool, index, stand, einst({ vorausarbeiten: false }));
  assert.equal(ohne.vorausKapitel, undefined);
  assert.deepEqual(an(ohne), { art: 'krone', niveau: 'E' });
  // Alle Kronen in Purpur: fertig.
  const lea = neu(); meistere(lea, ids, 'E');
  assert.equal(L.kapitelendeAngebot(pool, index, lea, ohne, kapitel('5.1'), HEUTE).haupt.art, 'fertig');
  // Offene Lernziele in einem früheren Kapitel.
  const spaeter = neu(); meistere(spaeter, lernziele('5.2'));
  const e2 = L.einstellungen({ aktuellesKapitel: '5.2', tore: ['5.1', '5.2'], vorausarbeiten: false }, CODE, pool);
  spaeter.einstieg = { '5.1': { uebersprungen: GESTERN } };
  assert.deepEqual([L.kapitelendeAngebot(pool, index, spaeter, e2, kapitel('5.2'), HEUTE).haupt.art, L.kapitelendeAngebot(pool, index, spaeter, e2, kapitel('5.2'), HEUTE).haupt.kapitel.id], ['frueher', '5.1']);
  // Ein fälliger Rückblick (etwa 14 Tage nach dem Siegel, ab zehn Siegeln) geht früheren Kapiteln und der höheren Krone vor.
  assert.equal(L.kapitelendeAngebot(pool, index, spaeter, e2, kapitel('5.2'), '2026-12-12T09:00:00Z').haupt.art, 'rueckblick');
});

test('Vorausarbeiten: höchstens Aktuelles Kapitel plus eins, nicht ohne Erlaubnis, nicht vor dem Kapitelende', () => {
  const stand = neu();
  assert.equal(L.vorausKapitel(pool, index, stand, einst()), null, 'noch nicht fertig');
  meistere(stand, lernziele('5.1'));
  assert.equal(L.vorausKapitel(pool, index, stand, einst()), '5.2');
  assert.equal(L.vorausKapitel(pool, index, stand, einst({ vorausarbeiten: false })), null);
  assert.equal(L.vorausKapitel(pool, index, stand, einst({ aktuellesKapitel: null })), null, 'ohne Aktuelles Kapitel gibt es keine Grenze');
  meistere(stand, lernziele('5.2'));
  const e = L.mitVorausarbeiten(pool, index, stand, einst());
  assert.ok(e.offeneKapitel.has('5.2') && !e.offeneKapitel.has('5.3'), 'nicht zwei Kapitel voraus');
  assert.equal(L.vorausKapitel(pool, index, stand, einst({ aktuellesKapitel: '5.2', tore: ['5.1', '5.2'] })), '5.3', 'die Grenze rückt mit dem Aktuellen Kapitel weiter');
  // Die Klassendatei trägt die Einstellung, Standard an.
  const daten = { namen: { [CODE]: 'A' }, einst: { aktuellesKapitel: '5.1', tore: ['5.1'], zielniveaus: {}, hilfe: {}, nachrichten: {}, sperren: {} } };
  assert.equal(SCH.klassendateiInhalt('5a', daten, HEUTE).vorausarbeiten, true);
  daten.einst.vorausarbeiten = false;
  assert.equal(SCH.klassendateiInhalt('5a', daten, HEUTE).vorausarbeiten, false);
});

test('Sitzplan-Marke: fertig, dann voraus', () => {
  const stand = neu(), e = einst();
  assert.equal(L.kapitelMarke(pool, index, stand, e), null);
  meistere(stand, lernziele('5.1'));
  assert.equal(L.kapitelMarke(pool, index, stand, e), 'fertig');
  L.stelleEinstieg(stand, index, kapitel('5.2'), HEUTE);
  assert.equal(L.kapitelMarke(pool, index, stand, e), 'voraus');
});

test('Tagessperre: eine heute gelöste Aufgabe kommt heute nicht wieder, morgen schon', () => {
  const stand = neu(), lz = lernziele('5.1')[0], alle = index.nach.get(`${lz}|M`);
  const heute = new Set();
  for (let i = 0; i < alle.length; i++) {
    const a = L.naechsteAufgabe(index, stand, lz, 'M', Math.random, HEUTE);
    assert.ok(a && !heute.has(a.id), `Aufgabe ${i + 1} ist neu`);
    heute.add(a.id);
    // Mit Lösungsschritt gelöst: zählt nicht fürs Siegel, das Lernziel bleibt also offen.
    L.verbuche(stand, a, ok({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', HEUTE, index);
  }
  assert.equal(stand.lernziele[lz], undefined);
  assert.equal(L.heuteFertig(index, stand, lz, 'M', SPAETER), true);
  assert.equal(L.naechsteAufgabe(index, stand, lz, 'M', Math.random, SPAETER), null, 'das Lernziel ist für heute fertig');
  assert.ok(L.naechsteAufgabe(index, stand, lz, 'M', Math.random, SPAETER, true), 'selbst gewählt darf das Kind üben');
  assert.ok(L.naechsteAufgabe(index, stand, lz, 'M', Math.random, '2026-11-28T09:00:00Z'), 'morgen zählt es wieder');
  // Die Führung geht zum nächsten Lernziel, ohne eine neue Runde zu beginnen.
  const ms = index.meilensteinVon.get(lz), e = einst();
  assert.equal(L.lernzielErledigt(index, stand, lz, 'M', 'M'), false);
  assert.equal(L.lernzielErledigt(index, stand, lz, 'M', 'M', SPAETER), true);
  assert.notEqual(L.naechstesLernziel(index, stand, ms, 'M', 'M', SPAETER).id, lz);
  assert.equal(L.runde(stand, '5.1'), 1);
  assert.ok(L.fuehrungsMeilenstein(index, stand, kapitel('5.1'), e, 'M', SPAETER));
  assert.equal(L.runde(stand, '5.1'), 1);
});

test('Tagessperre: selbst gewählte Wiederholung bringt 1 Münze und keinen neuen Heftcode', () => {
  const stand = neu(), lz = lernziele('5.1')[0], a = index.nach.get(`${lz}|M`)[0];
  const erst = L.verbuche(stand, a, ok(), 'M', HEUTE, index);
  assert.ok(erst.heft && erst.muenzen > 1 && erst.einMuenze === null);
  const noch = L.verbuche(stand, a, ok(), 'M', SPAETER, index);
  assert.deepEqual([noch.muenzen, noch.heft, noch.einMuenze], [1, null, 'wiederholt']);
  const morgen = L.verbuche(stand, a, ok(), 'M', '2026-11-28T09:00:00Z', index);
  assert.ok(morgen.heft, 'am nächsten Tag gibt es wieder einen Heftcode');
});

test('Nach einem Fehler kommt eine andere Aufgabe, die falsche frühestens nach zwei anderen', () => {
  const stand = neu(), lz = lernziele('5.1')[0], alle = index.nach.get(`${lz}|M`);
  // Fünf von sechs sind gelöst (an früheren Tagen), eine ist offen und gerade falsch gewesen.
  for (const a of alle.slice(1)) L.verbuche(stand, a, ok({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', GESTERN, index);
  L.verbuche(stand, alle[0], { ...ok(), geloest: false, versuche: 2 }, 'M', HEUTE, index);
  const eins = L.naechsteAufgabe(index, stand, lz, 'M', Math.random, HEUTE);
  assert.notEqual(eins.id, alle[0].id, 'nicht sofort dieselbe');
  L.verbuche(stand, eins, { ...ok(), geloest: false, versuche: 2 }, 'M', HEUTE, index);
  const zwei = L.naechsteAufgabe(index, stand, lz, 'M', Math.random, HEUTE);
  assert.ok(zwei.id !== alle[0].id && zwei.id !== eins.id, 'auch nicht nach einer anderen');
});

test('Eine im Einstiegscheck gelöste Aufgabe kommt heute nicht wieder und gilt später nicht als Wiederholung', () => {
  const stand = neu(), lz = lernziele('5.1')[0], a = index.nach.get(`${lz}|M`)[0];
  stand.einstieg = { '5.1': { t: HEUTE, aufgaben: [a.id], erledigt: [] } };
  L.trageEinstiegEin(stand, '5.1', a, { geloest: true, eingaben: [], fehlvorstellungen: [], dauer: 10 }, HEUTE);
  for (let i = 0; i < 20; i++) assert.notEqual(L.naechsteAufgabe(index, stand, lz, 'M', Math.random, SPAETER).id, a.id);
  assert.ok(L.muenzenFuer(stand, a, ok(), 'M', index) > 1, 'volle Münzen, denn im Einstiegscheck gab es keine');
});

test('Purpur-Wahl gilt im neuen Kapitel weiter, außer das Kind ist abgesunken', () => {
  const stand = neu();
  L.setzeNiveau(stand, '5.1', 'E');
  meistere(stand, lernziele('5.1'), 'E');
  assert.equal(L.erbeWahl(stand, '5.2', 'M'), true);
  assert.equal(L.arbeitsniveau(stand, '5.2', 'M'), 'E');
  assert.equal(L.erbeWahl(stand, '5.2', 'M'), false, 'nur einmal');
  // Abgesunken: Die Wahl des alten Kapitels steht nicht mehr auf Purpur.
  const tim = neu();
  L.setzeNiveau(tim, '5.1', 'E');
  meistere(tim, lernziele('5.1').slice(0, 1), 'E');
  L.sinkeAb(tim, lernziele('5.1')[0], 'M', 'M');
  assert.equal(L.erbeWahl(tim, '5.2', 'M'), false);
  assert.equal(L.arbeitsniveau(tim, '5.2', 'M'), 'M');
  // Gold über dem Ziel Silber wird nicht übernommen.
  const mia = neu();
  L.setzeNiveau(mia, '5.1', 'M');
  meistere(mia, lernziele('5.1', 'G').slice(0, 1), 'M', 'G');
  assert.equal(L.erbeWahl(mia, '5.2', 'G'), false);
});

test('Der Vorschlag nach dem Einstiegscheck nennt, wie viele Gold-Aufgaben gelöst sind', () => {
  const stand = neu();
  const e = L.stelleEinstieg(stand, index, kapitel('5.1'), HEUTE, () => 0);
  let r;
  e.aufgaben.forEach((id) => { const a = index.aufgabe.get(id); r = L.trageEinstiegEin(stand, '5.1', a, { geloest: a.niveau === 'M', eingaben: [], fehlvorstellungen: [], dauer: 10 }, HEUTE); });
  assert.equal(r.empfehlung, 'M');
  assert.deepEqual(r.gold, { richtig: 4, gesamt: 4 });
});

test('Nebel: Ein Meilenstein, der zweimal nur unter dem Ziel geschafft ist, hält die übrigen nicht mehr fest', () => {
  const stand = neu(), k = kapitel('5.1'), erste = k.unterkapitel[0];
  const e = einst({ meilensteinFreigabe: { '5.1': [erste.id] } });
  assert.ok(L.imNebel(index, stand, k, e).size > 0);
  stand.unterZiel = Object.fromEntries(erste.lernziele.map((l) => [l.id, { mal: 2, niveau: 'G', t: GESTERN }]));
  assert.equal(L.imNebel(index, stand, k, e).size, 0);
});
