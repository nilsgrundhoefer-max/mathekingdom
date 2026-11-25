// Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050): 6 Meilensteine mit je 2 Lernzielen, die beiden letzten als Niveau-Meilenstein nur auf E.
// Schaubild mit Achsennamen und Einteilung, Punkte eintragen mit Nachfrage, Wertetabelle, Dreisatztabelle mit Rechenpfeilen,
// und ein Prüfer, der jede Aufgabe nachrechnet.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as L from '../src/schueler/logik.js';
import { pruefePool } from '../tools/pruefe-pool.mjs';
import { schaubildArt, ordneEin, zahlWert } from '../tools/pruefe-zuordnungen.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(6), fuenf = lies(5);
const index = L.indexiere(pool);
const sieben = pool.kapitel[6];
const kap7 = pool.aufgaben.filter((a) => a.id.startsWith('6.7.'));
const RICHTIG = { richtig: true, fehlvorstellung: null };
const meldungen = (aendere) => {
  const kopie = structuredClone(pool);
  aendere(kopie.aufgaben);
  return pruefePool(kopie, [fuenf]).fehler;
};
const finde = (liste, id) => liste.find((a) => a.id === id);
const gemeldet = (id, aendere, was) => assert.ok(meldungen((l) => aendere(finde(l, id))).some((x) => x.startsWith(id)), `${id}: ${was} nicht gemeldet`);
const sichtbar = (a) => JSON.stringify([a.text, a.optionen?.map((o) => o.text), a.hilfen, a.nachfrage, a.loesungsweg]);

test('Kapitel 7 hat 6 Meilensteine mit je 2 Lernzielen und 24 Aufgaben je Lernziel, zusammen 288 Aufgaben', () => {
  assert.equal(sieben.titel, 'Zuordnungen');
  assert.deepEqual(sieben.unterkapitel.map((x) => x.id), ['6.7.1', '6.7.2', '6.7.5', '6.7.6', '6.7.7', '6.7.8']);
  assert.equal(kap7.length, 288);
  for (const x of sieben.unterkapitel) {
    assert.equal(x.lernziele.length, 2, x.id);
    const nurE = ['6.7.7', '6.7.8'].includes(x.id);
    assert.equal(x.ab, nurE ? 'E' : undefined, `${x.id}: Niveau-Meilenstein`);
    assert.equal(x.pflicht, x.id === '6.7.6' ? 'M' : undefined, `${x.id}: Pflicht-ab-Marke`);
    for (const l of x.lernziele) {
      assert.deepEqual(L.NIVEAUS.map((n) => (index.nach.get(`${l.id}|${n}`) ?? []).length), nurE ? [0, 0, 0, 24] : [6, 6, 6, 6], l.id);
      assert.match(l.bp ?? '', /^(FZ|DS|ZVO) \(\d+\)/, l.id);
    }
  }
});

test('Wörter nach Stufe: antiproportional und Produkt nur auf E, Quotient ab M, Wertepaar und Einteilung ab G, kein Proportionalitätsfaktor', () => {
  for (const a of kap7) {
    const t = sichtbar(a);
    assert.doesNotMatch(t, /Proportionalitätsfaktor|Ursprung|Koordinatensystem|Graph\b/, a.id);
    if (a.niveau !== 'E') assert.doesNotMatch(t, /antiproportional|Produkt/, a.id);
    if (['F', 'G'].includes(a.niveau)) assert.doesNotMatch(t, /Quotient/, a.id);
    if (a.niveau === 'F') assert.doesNotMatch(t, /Wertepaar|Einteilung/, a.id);
    assert.doesNotMatch(a.text, /\?/, `${a.id}: Auftrag als Frage`);
  }
  assert.ok(kap7.some((a) => /Nullpunkt/.test(sichtbar(a))));
  assert.ok(kap7.some((a) => /\d (Hefte|kg|h|Kugeln) → \d/.test(sichtbar(a))), 'Pfeilschreibweise fehlt');
});

test('Schaubild: erster Quadrant, Achsennamen mit Einheit, Einteilung 1, 2, 5, 10 und ab G auch 0,5; auf F nach rechts immer 1', () => {
  const alle = kap7.flatMap((a) => [a.bild?.art === 'gitter' && a.bild, a.format === 'gitter' && a.gitter, ...(a.optionen ?? []).map((o) => o.bild?.art === 'gitter' && o.bild)].filter(Boolean).map((g) => [a, g]));
  assert.ok(alle.length >= 90, `nur ${alle.length} Schaubilder`);
  for (const [a, g] of alle) {
    assert.ok(g.achsen && g.skala && !g.ursprung, a.id);
    for (const s of [g.skala.x, g.skala.y]) {
      assert.ok(s.name.length > 2, a.id);
      assert.ok([0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].includes(s.schritt), `${a.id}: Einteilung ${s.schritt}`);
      if (['F'].includes(a.niveau)) assert.ok(Number.isInteger(s.schritt) && s.schritt <= 5, `${a.id}: Einteilung ${s.schritt} auf F`);
    }
    if (a.niveau === 'F') { assert.equal(g.skala.x.schritt, 1, `${a.id}: Einteilung nach rechts auf F`);
    }
    assert.ok(g.b >= 3 && g.b <= 14 && g.h >= 3 && g.h <= 14, `${a.id}: Schaubild ${g.b} × ${g.h}`);
  }
});

test('Der Prüfer erkennt am Schaubild und an der Tabelle, welche Art Zuordnung vorliegt', () => {
  const sk = { x: { name: 'x', schritt: 1 }, y: { name: 'y', schritt: 2 } };
  assert.equal(schaubildArt({ art: 'gitter', b: 6, h: 6, skala: sk, zuege: [{ punkte: [[0, 0], [5, 5]] }] }), 'prop');
  assert.equal(schaubildArt({ art: 'gitter', b: 6, h: 6, skala: sk, zuege: [{ punkte: [[0, 2], [4, 6]] }] }), 'gerade');
  assert.equal(schaubildArt({ art: 'gitter', b: 6, h: 6, skala: sk, zuege: [{ punkte: [[0, 0], [2, 1], [4, 5]] }] }), 'sonst');
  const art = (paare) => ordneEin(paare.map((p) => p.map(zahlWert)));
  assert.equal(art([['2', '3'], ['4', '6'], ['10', '15']]), 'prop');
  assert.equal(art([['2', '12'], ['4', '6'], ['8', '3']]), 'anti');
  assert.equal(art([['1', '3'], ['2', '5'], ['3', '7']]), 'keines');
});

test('Erkenn-Aufgaben: Etwa die Hälfte ist nicht proportional, und „3 zum Preis von 2“ kommt erst ab G vor', () => {
  const beleg = (a) => a.nachweis?.find((n) => ['einordnung', 'bildart'].includes(n?.art));
  const erkennen = kap7.filter((a) => ['6.7.2-P1', '6.7.5-S1'].includes(a.lernziel) && beleg(a));
  const nicht = erkennen.filter((a) => { const n = beleg(a); return (n.art === 'bildart' ? n.ist : ordneEin(n.paare.map((p) => p.map(zahlWert)))) !== 'prop'; });
  assert.ok(erkennen.length >= 12, `nur ${erkennen.length}`);
  assert.ok(nicht.length >= erkennen.length / 3 && nicht.length <= erkennen.length * 2 / 3, `${nicht.length} von ${erkennen.length} nicht proportional`);
  const angebot = kap7.filter((a) => /zum Preis von/.test(sichtbar(a)));
  assert.ok(angebot.length >= 1);
  for (const a of angebot) assert.notEqual(a.niveau, 'F', a.id);
});

test('Punkte eintragen: F 2 Punkte, G 3, M 3 bis 4, ab G mit Nachfrage zur Geraden durch den Nullpunkt', () => {
  const punkte = kap7.filter((a) => a.format === 'gitter');
  assert.ok(punkte.length >= 10);
  for (const a of punkte) {
    assert.equal(a.eingabe, 'punkte', a.id);
    const n = a.loesung.length;
    assert.ok({ F: n === 2, G: n === 3, M: n >= 3 && n <= 4, E: n >= 3 && n <= 5 }[a.niveau], `${a.id}: ${n} Punkte`);
    for (const p of a.loesung) assert.ok(Number.isInteger(p[0]) && Number.isInteger(p[1]), `${a.id}: Punkt nicht auf einem Gitterpunkt`);
    assert.equal(Boolean(a.nachfrage), a.niveau !== 'F', `${a.id}: Nachfrage`);
    const soll = a.loesung.map((p) => `(${p[0]}|${p[1]})`).join(' ');
    const ja = a.nachfrage?.optionen.find((o) => o.richtig).text, nein = a.nachfrage?.optionen.find((o) => !o.richtig).text;
    assert.deepEqual(L.pruefeAntwort(a, a.nachfrage ? `${soll} [${ja}]` : soll), RICHTIG, a.id);
    if (a.nachfrage) {
      assert.match(a.nachfrage.text, /Nullpunkt/, a.id);
      assert.equal(L.pruefeAntwort(a, `${soll} [${nein}]`).richtig, false, `${a.id}: falsche Nachfrage gilt als richtig`);
      assert.equal(L.pruefeAntwort(a, soll).richtig, false, `${a.id}: ohne Nachfrage richtig`);
    }
  }
  gemeldet(punkte[0].id, (a) => { a.loesung[0][1] += 1; }, 'Punkt neben dem Wertepaar');
});

test('Vertauschte Achsen und gezählte Kästchen sind im Schaubild eigene Fehler', () => {
  const a = { format: 'gitter', eingabe: 'punkte', gitter: { b: 10, h: 10, achsen: true, skala: { x: { name: 'Anzahl', schritt: 1 }, y: { name: 'Preis in €', schritt: 2 } } }, loesung: [[2, 2], [4, 4]], typischeFehler: [] };
  assert.deepEqual(L.pruefeAntwort(a, '(2|2) (4|4)'), RICHTIG);
  assert.equal(L.pruefeAntwort(a, '(4|1) (8|2)').fehlvorstellung, 'schaubild-achsen-vertauscht');
  assert.equal(L.pruefeAntwort(a, '(2|4) (4|8)').fehlvorstellung, 'einteilung-uebersehen');
  assert.equal(L.pruefeAntwort(a, '(1|1) (3|3)').fehlvorstellung, null);
});

test('Dreisatztabelle: F mit vorgegebenen Rechenpfeilen und der Zeile „für 1“, G trägt die Rechenpfeile selbst ein', () => {
  const ds = kap7.filter((a) => a.tabelle?.art === 'dreisatz');
  assert.ok(ds.length >= 20);
  for (const a of ds) {
    const t = a.tabelle, felder = (t.pfeile ?? []).flatMap((p) => [p.links, p.rechts]).filter((p) => typeof p === 'object');
    assert.equal(t.kopf.length, 2, a.id);
    if (a.niveau === 'F') { assert.equal(felder.length, 0, `${a.id}: Rechenpfeile auf F sind vorgegeben`); assert.equal(t.pfeile.length, t.zeilen.length - 1, a.id); assert.match(String(t.zeilen[1][0]), /^1 /, `${a.id}: Zeile für 1`); }
    if (a.niveau === 'G' && a.lernziel === '6.7.6-R1' && t.pfeile?.length) assert.ok(felder.length >= 2, `${a.id}: Rechenpfeile zum Eintragen`);
    for (const f of felder) assert.ok(a.luecken[f.luecke], `${a.id}: Lücke ${f.luecke}`);
    const soll = Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]));
    assert.deepEqual(L.pruefeAntwort(a, soll), RICHTIG, a.id);
  }
  const erste = ds.find((a) => a.niveau === 'F');
  gemeldet(erste.id, (a) => { const n = Object.keys(a.luecken).at(-1); a.luecken[n].loesung = Number(a.luecken[n].loesung) + 1; }, 'falscher Dreisatz');
  const anti = ds.find((a) => a.lernziel === '6.7.8-U1');
  assert.ok(anti, 'antiproportionale Dreisatztabelle fehlt');
  assert.notEqual(anti.tabelle.pfeile[0].links.zeichen, anti.tabelle.pfeile[0].rechts.zeichen, 'Gegenrechnung: links teilen, rechts malnehmen');
});

test('Wertetabellen liegen waagrecht, und der Prüfer rechnet jede Lücke nach', () => {
  const wt = kap7.filter((a) => a.tabelle?.art === 'werte');
  assert.ok(wt.length >= 30);
  for (const a of wt) {
    assert.equal(a.tabelle.zeilen.length, 2, a.id);
    assert.ok(a.tabelle.zeilen.every((z) => typeof z[0] === 'string' && z.length === a.tabelle.zeilen[0].length), a.id);
    const soll = Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]));
    assert.deepEqual(L.pruefeAntwort(a, soll), RICHTIG, a.id);
  }
  const p = wt.find((a) => a.lernziel === '6.7.2-P2'), anti = wt.find((a) => a.lernziel === '6.7.7-A2');
  gemeldet(p.id, (a) => { const n = Object.keys(a.luecken)[0]; a.luecken[n].loesung = Number(String(a.luecken[n].loesung).replace(',', '.')) + 1; }, 'Lücke, die nicht proportional ist');
  gemeldet(anti.id, (a) => { const n = Object.keys(a.luecken)[0]; a.luecken[n].loesung = Number(String(a.luecken[n].loesung).replace(',', '.')) + 1; }, 'Lücke, die das Produkt ändert');
});

test('Zahlen: F nur ganze Zahlen oder Geld mit ,50, kein Ergebnis wird gerundet', () => {
  for (const a of kap7) {
    if (a.niveau === 'F') for (const m of a.text.matchAll(/\d+,(\d+)/g)) assert.equal(m[1], '50', `${a.id}: ${m[0]}`);
    assert.doesNotMatch(sichtbar(a), /[Rr]unde |gerundet|ungefähr/, a.id);
    if (a.format === 'zahl' && typeof a.loesung === 'string') assert.match(a.loesung, /^\d+,\d{1,3}$/, a.id);
  }
});

test('Heftaufgaben nur ab M: R1, R2 und S2 je 4, U1 8, zusammen 20, jede mit Kontrollwert', () => {
  const heft = kap7.filter((a) => a.heftaufgabe);
  assert.equal(heft.length, 20);
  const je = (l) => heft.filter((a) => a.lernziel === l).length;
  assert.deepEqual(['6.7.5-S2', '6.7.6-R1', '6.7.6-R2', '6.7.8-U1'].map(je), [4, 4, 4, 8]);
  for (const a of heft) { assert.ok(['M', 'E'].includes(a.niveau), a.id); assert.ok(['zahl', 'auswahl', 'luecken', 'tabelle'].includes(a.format), `${a.id}: kein Kontrollwert`); }
});

test('Antiproportional: Kurven nur zum Erkennen und Ablesen, „keines von beiden“ bei etwa einem Viertel von U2', () => {
  const e = kap7.filter((a) => a.lernziel.startsWith('6.7.7') || a.lernziel.startsWith('6.7.8'));
  assert.equal(e.length, 96);
  for (const a of e) { assert.equal(a.niveau, 'E', a.id); assert.notEqual(a.format, 'gitter', `${a.id}: Kurve zeichnen`); }
  const kurven = e.filter((a) => [a.bild, ...(a.optionen ?? []).map((o) => o.bild)].some((b) => b?.zuege?.some((z) => z.punkte.length > 8)));
  assert.ok(kurven.length >= 6, `nur ${kurven.length} Aufgaben mit Kurve`);
  const u2 = kap7.filter((a) => a.lernziel === '6.7.8-U2');
  const keines = u2.filter((a) => a.format === 'auswahl' && a.optionen.some((o) => o.richtig && /[Kk]eines von beiden|^Falsch\./.test(o.text)));
  assert.ok(keines.length >= 4 && keines.length <= 8, `${keines.length} von 24 mit „keines von beiden“`);
});

test('Die richtige Lösung jeder Aufgabe gilt als richtig, jeder typische Fehler als falsch', () => {
  for (const a of kap7) {
    if (a.format === 'zahl') {
      assert.deepEqual(L.pruefeAntwort(a, String(a.loesung)), RICHTIG, a.id);
      for (const f of a.typischeFehler ?? []) assert.equal(L.pruefeAntwort(a, String(f.wert)).fehlvorstellung, f.fehlvorstellung, `${a.id}: ${f.wert}`);
    } else if (a.format === 'auswahl') {
      assert.ok(a.optionen.some((o) => o.richtig), a.id);
      assert.equal(new Set(a.optionen.map((o) => o.text)).size, a.optionen.length, a.id);
    } else if (a.format === 'luecken') {
      assert.deepEqual(L.pruefeAntwort(a, Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]))), RICHTIG, a.id);
    }
  }
  const z = kap7.find((a) => a.format === 'zahl' && a.nachweis?.some((n) => n?.art === 'dreisatz'));
  gemeldet(z.id, (a) => { a.loesung = typeof a.loesung === 'number' ? a.loesung + 1 : '999,5'; }, 'falsches Dreisatzergebnis');
});

test('Die neuen Fehlvorstellungen haben eine Beschreibung und kommen in Aufgaben vor', async () => {
  const { fehlvorstellungen } = await import('../tools/werkzeug.mjs');
  const text = JSON.stringify(kap7);
  for (const k of ['je-mehr-proportional', 'prop-addiert', 'dreisatz-falsch-herum', 'dreisatz-zwischenwert', 'schaubild-achsen-vertauscht', 'achse-ungleichmaessig', 'grundgebuehr-uebersehen',
    'anti-proportional-gerechnet', 'prop-antiproportional-gerechnet', 'einteilung-uebersehen', 'tabelle-falsche-zeile']) {
    assert.ok(fehlvorstellungen[k], k);
    assert.ok(text.includes(`"${k}"`), `${k} kommt in keiner Aufgabe vor`);
  }
});
