// Klasse 6, Kapitel 1 „Brüche“ (ADR 0037): zweiter Aufgabenpool, vollständig gekürzt mit „fast richtig“, Brücken in die Vorstufe.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as B from '../src/schueler/bruch.js';
import * as L from '../src/schueler/logik.js';
import { ohneGesperrte } from '../src/gemeinsam/meldungen.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const lernziele = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele);

test('Kapitel 1 hat 12 Lernziele mit je 24 Aufgaben, 6 je Niveau', () => {
  const eins = pool.aufgaben.filter((a) => a.id.startsWith('6.1.'));
  assert.equal(eins.length, 288);
  const je = {};
  for (const a of eins) je[`${a.lernziel} ${a.niveau}`] = (je[`${a.lernziel} ${a.niveau}`] ?? 0) + 1;
  assert.equal(Object.keys(je).length, 48);
  assert.ok(Object.values(je).every((n) => n === 6));
});

// ---------- Kapitel 2 „Rechnen mit Brüchen“ und der Niveau-Meilenstein (ADR 0038) ----------
const kap2 = pool.kapitel.find((k) => k.id === '6.2');
const dividieren = kap2.unterkapitel.find((u) => u.ab);
const einstFuer = (zielniveau, mehr = {}) => ({ zielniveau, offeneKapitel: new Set(['6.2']), gesperrteMeilensteine: new Set(), ...mehr });
const leer = () => ({ versuche: [], lernziele: {}, niveau: {}, niveauMarke: {}, muenzen: 0, wappen: { gekauft: [], zeichen: [] } });
// Löst je Lernziel die ersten drei Aufgaben der Niveaustufe (darunter eine aus AFB II) und trägt die Siegel nach.
function loese(stand, u, niveau, zielniveau) {
  for (const l of u.lernziele) {
    const alle = index.nach.get(`${l.id}|${L.stufeAb(niveau, u.ab)}`);
    for (const a of [...alle.filter((x) => x.afb >= 2).slice(0, 1), ...alle.filter((x) => x.afb < 2).slice(0, 2)]) {
      stand.versuche.push({ t: '2026-11-24T08:00:00.000Z', aufgabe: a.id, lernziel: l.id, niveau: a.niveau, afb: a.afb, richtig: true, versuche: 1, hilfen: 0, muenzen: 1 });
    }
  }
  L.trageSiegelNach(stand, index, zielniveau, '2026-11-24T08:00:00.000Z');
}

test('Kapitel 2 hat 14 Lernziele mit je 24 Aufgaben; „Brüche dividieren“ hat nur M und E, je 12', () => {
  const zwei = pool.aufgaben.filter((a) => a.id.startsWith('6.2.'));
  assert.equal(zwei.length, 336);
  assert.equal(kap2.unterkapitel.length, 7);
  assert.equal(dividieren.titel, 'Brüche dividieren');
  assert.equal(dividieren.ab, 'M');
  for (const u of kap2.unterkapitel) for (const l of u.lernziele) {
    const je = L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length);
    assert.deepEqual(je, u.ab ? [0, 0, 12, 12] : [6, 6, 6, 6], l.id);
  }
});

test('Niveau-Meilenstein: Für F und G ist er ein Abstecher an „Brüche multiplizieren“, für M und E ein Meilenstein', () => {
  for (const n of ['F', 'G']) {
    assert.equal(L.istAbstecher(dividieren, n), true, n);
    assert.equal(L.wirtVon(kap2, dividieren, n).titel, 'Brüche multiplizieren');
  }
  for (const n of ['M', 'E']) assert.equal(L.istAbstecher(dividieren, n), false, n);
  // Der letzte Meilenstein hängt für niemanden am Abstecher.
  assert.equal(L.istAbstecher(kap2.unterkapitel.at(-1), 'F'), false);
});

test('Niveau-Meilenstein: Die Aufgaben kommen mindestens von der Marke, auch wenn um Silber gespielt wird', () => {
  const stand = leer(), lz = dividieren.lernziele[0].id;
  for (const n of ['F', 'G', 'M']) assert.equal(L.naechsteAufgabe(index, stand, lz, n, () => 0).niveau, 'M', n);
  assert.equal(L.naechsteAufgabe(index, stand, lz, 'E', () => 0).niveau, 'E');
  assert.equal(L.stufeFuer(index, kap2.unterkapitel[0].lernziele[0].id, 'F'), 'F', 'andere Meilensteine bleiben, wie sie sind');
});

test('Niveau-Meilenstein: Das Kapitel ist für G ohne ihn geschafft, die Führung geht an ihm vorbei', () => {
  const stand = leer(), einst = einstFuer('G');
  for (const u of kap2.unterkapitel.filter((x) => !x.ab)) loese(stand, u, 'G', 'G');
  const e = L.etappe(pool, index, stand, { ...einst, aktuellesKapitel: '6.2' });
  assert.equal(e.gesamt, 6);
  assert.equal(e.geschafft, 6);
  assert.equal(e.milestone, null, 'nichts mehr offen');
  assert.equal(L.fuehrungsMeilenstein(index, stand, kap2, einst, 'G'), null);
  // Angeboten wird der Abstecher nach „Brüche multiplizieren“.
  const wirt = L.wirtVon(kap2, dividieren, 'G');
  assert.deepEqual(L.abstecherAm(index, stand, kap2, wirt, einst, 'G').map((u) => u.id), [dividieren.id]);
  // Das Kapitelband gibt es ohne den Abstecher, aber nur für dieses Zielniveau.
  const nur2 = { ...pool, kapitel: [kap2] };
  assert.ok(L.vergebeEhrenzeichen(leerMit(stand), nur2, index, 'G').includes('kapitelband'));
  assert.ok(!L.vergebeEhrenzeichen(leerMit(stand), nur2, index, 'M').includes('kapitelband'));
});
function leerMit(stand) { return { ...structuredClone(stand), wappen: { gekauft: [], zeichen: [] } }; }

test('Niveau-Meilenstein: Für M zählt er zum Kapitel und liegt auf dem Weg', () => {
  const stand = leer(), einst = einstFuer('M');
  for (const u of kap2.unterkapitel.filter((x) => !x.ab)) loese(stand, u, 'M', 'M');
  const e = L.etappe(pool, index, stand, { ...einst, aktuellesKapitel: '6.2' });
  assert.equal(e.gesamt, 7);
  assert.equal(e.geschafft, 6);
  assert.equal(e.milestone.id, dividieren.id);
});

test('Niveau-Meilenstein: Freiwillig geschafft gibt es die Krone in Gold, nie darunter; Kronen bleiben beim Wechsel des Zielniveaus', () => {
  const stand = leer();
  loese(stand, dividieren, 'G', 'G'); // spielt um Silber, bekommt Aufgaben von M
  assert.equal(L.krone(index, stand, dividieren), 'M');
  assert.equal(L.milestoneStatus(index, stand, dividieren), 'gemeistert');
  assert.equal(L.krone(index, stand, dividieren), 'M', 'nach einem Wechsel auf M oder zurück auf F bleibt die Krone');
  // Zwei richtige Aufgaben reichen nicht, auch nicht für Bronze.
  const wenig = leer(), a = index.nach.get(`${dividieren.lernziele[0].id}|M`).slice(0, 2);
  for (const x of a) wenig.versuche.push({ t: '2026-11-24T08:00:00.000Z', aufgabe: x.id, lernziel: x.lernziel, niveau: 'M', afb: x.afb, richtig: true, versuche: 1, hilfen: 0 });
  assert.equal(L.lernzielStand(wenig, a[0].lernziel, 'F', index).erreicht, false);
  assert.equal(L.krone(index, wenig, dividieren), null);
});

test('Niveau-Meilenstein mit Meilensteinfreigabe: Der Abstecher lichtet sich mit seinem Wirt, nicht mit dem ganzen Kapitel', () => {
  const stand = leer(), wirt = L.wirtVon(kap2, dividieren, 'G');
  const einst = einstFuer('G', { meilensteinFreigabe: { '6.2': kap2.unterkapitel.filter((u) => !u.ab).map((u) => u.id) } });
  assert.ok(L.imNebel(index, stand, kap2, einst).has(dividieren.id));
  loese(stand, wirt, 'G', 'G');
  assert.ok(!L.imNebel(index, stand, kap2, einst).has(dividieren.id));
});

test('Der Pool der Klasse 6 besteht die Prüfung, jede Aufgabe ist nachgerechnet', () => {
  assert.deepEqual(pruefePool(lies(6), [fuenf]).fehler, []);
  assert.ok(pool.aufgaben.every((a) => a.nachweis));
});

test('Der Prüfer meldet eine falsche Lösung und eine veränderte Vorstufe', () => {
  let alle = 0, gemeldet = 0;
  for (let i = 0; i < pool.aufgaben.length; i += 5) {
    const p = lies(6), a = p.aufgaben[i];
    if (a.format !== 'zahl') continue;
    a.loesung = Number(a.loesung) + 1; alle++;
    if (pruefePool(p, [fuenf]).fehler.length) gemeldet++;
  }
  assert.ok(alle >= 4 && gemeldet === alle, `${gemeldet} von ${alle} gemeldet`);
  const p = lies(6); p.vorstufe.aufgaben[0].text += ' Zusatz.';
  assert.ok(pruefePool(p, [fuenf]).fehler.length > 0);
});

test('Vollständig gekürzt: richtiger Wert in falscher Form ist „fast richtig“ und nennt, was fehlt', () => {
  const a = { format: 'bruch', loesung: '3⁄4', gekuerzt: true };
  assert.deepEqual(B.pruefeBruch(a, '3/4'), { richtig: true, fehlvorstellung: null });
  assert.deepEqual(B.pruefeBruch(a, '6/8'), { richtig: false, fehlvorstellung: 'kuerzen-nicht-vollstaendig', nachbessern: 'kuerzen' });
  assert.equal(B.pruefeBruch(a, '2/3').nachbessern, undefined);
  assert.equal(B.pruefeBruch({ format: 'bruch', loesung: '3⁄4' }, '6/8').richtig, true, 'ohne gekuerzt gilt jeder gleichwertige Bruch');
  const g = { format: 'bruch', loesung: `2${B.SCHMAL}1⁄2`, gemischt: true, form: 'gemischt' };
  assert.equal(B.pruefeBruch(g, '2 1/2').richtig, true);
  assert.equal(B.pruefeBruch(g, '2 2/4').richtig, true, 'die Form gemischt verlangt kein Kürzen');
  assert.equal(B.pruefeBruch(g, '5/2').nachbessern, 'gemischt');
  assert.equal(B.pruefeBruch(g, '1 3/2').nachbessern, 'gemischt');
  assert.ok(B.NACHBESSERN.kuerzen && B.NACHBESSERN.gemischt && B.NACHBESSERN_HOECHSTENS === 2);
  for (const f of ['kuerzen-nicht-vollstaendig', 'gemischt-umwandeln']) assert.ok(pool.fehlvorstellungen[f], f);
});

test('Jede Bruchaufgabe mit gekuerzt hat eine vollständig gekürzte Lösung', () => {
  const ggt = (a, b) => (b ? ggt(b, a % b) : a);
  const mit = pool.aufgaben.filter((a) => a.format === 'bruch' && a.gekuerzt);
  assert.ok(mit.length >= 20);
  for (const a of mit) { const b = B.leseBruch(a.loesung); assert.ok(b.z === 0 || (ggt(b.z, b.n) === 1 && (b.g === 0 || b.z < b.n)), a.id); assert.equal(B.pruefeBruch(a, a.loesung).richtig, true, a.id); }
});

test('Vorstufe: Aufgaben aus Klasse 5 für Brücken, unverändert und ohne E', () => {
  const v = pool.vorstufe;
  assert.equal(v.klassenstufe, 5);
  const original = new Map(fuenf.aufgaben.map((a) => [a.id, a]));
  for (const a of v.aufgaben) { assert.deepEqual(a, original.get(a.id), a.id); assert.notEqual(a.niveau, 'E'); }
  const fremd = new Set(lernziele.flatMap((l) => l.voraussetzungen ?? []).filter((id) => !id.startsWith('6.')));
  assert.deepEqual(new Set(v.lernziele.map((l) => l.id)), fremd);
  for (const id of fremd) { assert.ok(index.vorstufe.has(id)); assert.ok(index.lernziel.get(id).text); for (const n of ['F', 'G', 'M']) assert.ok(index.nach.get(`${id}|${n}`)?.length >= L.BRUECKE_AUFGABEN, `${id} ${n}`); }
  // Vorstufen-Lernziele sind kein eigener Stoff: Sie zählen nicht zu den Lernzielen mit Aufgaben der Klasse.
  for (const id of fremd) assert.equal(index.lernzielMitAufgaben.has(id), false);
});

test('Brücke aus Klasse 6 in ein Lernziel der Klasse 5', () => {
  const stand = L.neuerSpeicherstand('6A-K4M2', '6a', '2026-11-24T10:00:00Z');
  const lz = '6.1.1-B1', g = index.nach.get(`${lz}|M`);
  for (let i = 0; i < 4; i++) L.verbuche(stand, g[i], { geloest: false, versuche: 2, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 }, 'M', '2026-11-24T10:05:00Z');
  const v = L.brueckeVorschlag(stand, index, lz, '2026-11-24T10:08:00Z');
  assert.ok(v && v.zu.startsWith('5.9.1-'), JSON.stringify(v));
  assert.match(v.text, /^Ich kann/);
  const b = L.stelleBruecke(stand, index, v, 'M', '2026-11-24T10:08:00Z');
  assert.equal(b.aufgaben.length, L.BRUECKE_AUFGABEN);
  assert.ok(b.aufgaben.every((id) => index.aufgabe.get(id).lernziel === v.zu && index.aufgabe.get(id).niveau === 'G'));
});

test('Gesperrte Aufgaben fallen auch aus der Vorstufe', () => {
  const id = pool.vorstufe.aufgaben[0].id;
  const p = ohneGesperrte(pool, [id, pool.aufgaben[0].id]);
  assert.equal(p.vorstufe.aufgaben.length, pool.vorstufe.aufgaben.length - 1);
  assert.equal(p.aufgaben.length, pool.aufgaben.length - 1);
});

// Eine simulierte Klasse 6 arbeitet drei Wochen in Kapitel 1; danach laufen die Auswertungen der Lehrkraft auch mit Versuchen aus der Vorstufe.
test('Simulierte Klasse 6: Schüler arbeiten in Kapitel 1, die Lehrerauswertung verkraftet Brücken in die Klasse 5', async () => {
  const SIM = await import('../src/gemeinsam/simulation.js');
  const A = await import('../src/lehrer/auswertung.js');
  const JETZT = new Date('2026-11-24T10:00:00').getTime(), jetzt = new Date(JETZT).toISOString();
  const leute = SIM.besetzung(8);
  const codes = leute.map((_, i) => `6T-${String.fromCharCode(65 + i)}2${String.fromCharCode(65 + i)}3`);
  const bots = leute.map((l, i) => SIM.neuerBot(codes[i], l.profil, L.neuerSpeicherstand(codes[i], '6t', new Date(JETZT - 50 * 86400000).toISOString()), 4711));
  const zielniveaus = Object.fromEntries(leute.map((l, i) => [codes[i], SIM.PROFILE[l.profil].ziel]));
  const klassendatei = { codes, tore: ['6.1'], aktuellesKapitel: '6.1', zielniveaus };
  SIM.vorlauf(bots, { pool, index, klassendatei, tempo: 1 }, 3, JETZT);
  const versuche = bots.flatMap((b) => b.stand.versuche);
  assert.ok(versuche.length > 150, `nur ${versuche.length} Versuche`);
  assert.ok(versuche.every((v) => index.aufgabe.get(v.aufgabe)), 'jede bearbeitete Aufgabe steht im Index');
  assert.ok(versuche.some((v) => v.lernziel.startsWith('6.1.')));
  // Ein Schüler geht dazu eine Brücke in die Klasse 5.
  const stand = bots[0].stand, lz = '6.1.2-W1';
  for (const a of index.nach.get(`${lz}|M`).slice(0, 4)) L.verbuche(stand, a, { geloest: false, versuche: 2, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 }, 'M', jetzt);
  const v = L.brueckeVorschlag(stand, index, lz, jetzt) ?? { fuer: lz, zu: '5.4.1-K1', text: '' };
  for (const a of index.nach.get(`${v.zu.startsWith('5.') ? v.zu : '5.4.1-K1'}|G`).slice(0, 3)) L.verbuche(stand, a, { geloest: true, versuche: 1, eingaben: ['1'], fehlvorstellungen: [], hilfen: 0, dauer: 20 }, 'M', jetzt);
  assert.ok(stand.versuche.some((x) => x.lernziel.startsWith('5.')));
  const staende = bots.map((b) => ({ code: b.code, stand: b.stand }));
  const eigene = A.lernzieleMitAufgaben(pool, index);
  assert.ok(eigene.every((l) => l.id.startsWith('6.')), 'Lernziele der Vorstufe erscheinen nicht im Lernstand');
  assert.doesNotThrow(() => {
    A.lernzielmatrix(staende, eigene, zielniveaus); A.lernzielStatistik(staende, eigene); A.aufgabenStatistik(staende); A.fehlerStatistik(staende);
    A.aufgabenAudit(staende, index); A.aufgabenUebersicht(staende, pool, index); A.berichtstabellen(staende, pool, index, zielniveaus, (c) => c, jetzt);
    A.brueckenImpulse(staende, index, jetzt); A.grundlagenHinweise(staende, index); A.vorwissen(staende, pool, '6.1'); A.schnelllaeufer(staende, pool, index, zielniveaus, jetzt);
    A.voraussetzungenVon(index, eigene.map((l) => l.id));
    for (const s of staende) { A.kennzahlen(s.stand, zielniveaus[s.code], jetzt); A.livestatus(s.stand, zielniveaus[s.code], jetzt); A.afbProfil(s.stand, index); A.kompetenzProfil(s.stand.versuche, index); A.schwaechsteLernziele(s.stand, index); A.selbsteinschaetzung(s.stand, pool); A.diskrepanz(s.stand, pool); }
  });
});

test('Lehrer-Dashboard: Der Niveau-Meilenstein ist bei Zielniveau G ein Abstecher und keine Lücke, bei M ein gewöhnliches Lernziel', async () => {
  const A = await import('../src/lehrer/auswertung.js');
  const ziele = A.lernzieleMitAufgaben(pool, index).filter((l) => l.kapitel === '6.2');
  assert.deepEqual(ziele.filter((l) => l.ab).map((l) => l.ab), ['M', 'M']);
  const freiwillig = leer();
  loese(freiwillig, dividieren, 'G', 'G');
  const staende = [{ code: '6A-AAAA', stand: leer() }, { code: '6A-BBBB', stand: leer() }, { code: '6A-CCCC', stand: freiwillig }];
  const matrix = A.lernzielmatrix(staende, ziele, { '6A-AAAA': 'G', '6A-BBBB': 'M', '6A-CCCC': 'G' });
  const zelle = (i) => matrix[i].zellen.find((c) => c.lernziel === dividieren.lernziele[0].id);
  assert.equal(zelle(0).abstecher, true);
  assert.equal(zelle(0).status, 'offen');
  assert.equal(zelle(1).abstecher, undefined);
  assert.equal(zelle(2).abstecher, true);
  assert.equal(zelle(2).status, 'siegel', 'eine freiwillig geschaffte Krone ist sichtbar');
  assert.ok(matrix[0].zellen.filter((c) => c.abstecher).length === 2);
});
