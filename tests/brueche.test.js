// Kapitel 9 „Brüche und Dezimalzahlen“ (ADR 0036): Brucheingabe, Teile färben, Dezimalzahlen und der unabhängige Prüfer.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as B from '../src/schueler/bruch.js';
import { pruefeAntwort } from '../src/schueler/logik.js';
import { pruefeBruchAufgabe } from '../tools/pruefe-brueche.mjs';

const text = readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8');
const pool = JSON.parse(text);
const neun = pool.aufgaben.filter((a) => a.lernziel.startsWith('5.9.'));
const kopie = (a) => JSON.parse(JSON.stringify(a));

test('Kapitel 9 hat 8 Lernziele mit je 24 Aufgaben, 6 je Niveau', () => {
  assert.equal(neun.length, 192);
  const je = {};
  for (const a of neun) je[`${a.lernziel} ${a.niveau}`] = (je[`${a.lernziel} ${a.niveau}`] ?? 0) + 1;
  assert.equal(Object.keys(je).length, 32);
  assert.ok(Object.values(je).every((n) => n === 6));
});

test('Brüche lesen: schräger Strich, Bruchstrich, gemischte Zahl, ganze Zahl', () => {
  assert.deepEqual(B.leseBruch('3/4'), { g: 0, z: 3, n: 4 });
  assert.deepEqual(B.leseBruch('3⁄4'), { g: 0, z: 3, n: 4 });
  assert.deepEqual(B.leseBruch('1 3/4'), { g: 1, z: 3, n: 4 });
  assert.deepEqual(B.leseBruch(`1${B.SCHMAL}3⁄4`), { g: 1, z: 3, n: 4 });
  assert.deepEqual(B.leseBruch('2'), { g: 2, z: 0, n: 1 });
  assert.equal(B.leseBruch('3/0'), null);
  assert.equal(B.leseBruch('/4'), null);
  assert.equal(B.leseBruch('drei'), null);
});

test('Brucheingabe: Ein gleichwertiger Bruch zählt, außer die Aufgabe verlangt genau diesen Bruch', () => {
  const a = { format: 'bruch', loesung: '2⁄4', typischeFehler: [{ wert: '4⁄2', fehlvorstellung: 'bruch-vertauscht' }, { wert: '2⁄2', fehlvorstellung: 'bruch-teil-zu-rest' }] };
  assert.equal(pruefeAntwort(a, '2/4').richtig, true);
  assert.equal(pruefeAntwort(a, '1/2').richtig, true);
  assert.equal(pruefeAntwort(a, '50/100').richtig, true);
  assert.deepEqual(pruefeAntwort(a, '4/2'), { richtig: false, fehlvorstellung: 'bruch-vertauscht' });
  assert.deepEqual(pruefeAntwort(a, '2/2'), { richtig: false, fehlvorstellung: 'bruch-teil-zu-rest' });
  assert.deepEqual(pruefeAntwort(a, '3/4'), { richtig: false, fehlvorstellung: null });
  assert.deepEqual(pruefeAntwort(a, '/4'), { richtig: false, fehlvorstellung: null });
  const genau = { format: 'bruch', loesung: '68⁄100', genau: true };
  assert.equal(pruefeAntwort(genau, '68/100').richtig, true);
  assert.equal(pruefeAntwort(genau, '17/25').richtig, false);
  const gemischt = { format: 'bruch', loesung: `1${B.SCHMAL}2⁄4`, gemischt: true };
  assert.equal(pruefeAntwort(gemischt, '1 2/4').richtig, true);
  assert.equal(pruefeAntwort(gemischt, '1 1/2').richtig, true);
  assert.equal(pruefeAntwort(gemischt, '6/4').richtig, true);
  assert.equal(pruefeAntwort(gemischt, '2/4').richtig, false);
});

test('Teile färben: Jede Auswahl mit der richtigen Anzahl zählt', () => {
  const a = { format: 'faerben', faerben: { form: 'kreis', teile: 6 }, loesung: 4, typischeFehler: [{ wert: 2, fehlvorstellung: 'bruch-teil-zu-rest' }] };
  assert.equal(pruefeAntwort(a, '0 1 2 3').richtig, true);
  assert.equal(pruefeAntwort(a, '5 0 2 4').richtig, true);
  assert.equal(pruefeAntwort(a, '1 1 2 3').richtig, false);
  assert.deepEqual(pruefeAntwort(a, '0 3'), { richtig: false, fehlvorstellung: 'bruch-teil-zu-rest' });
  assert.deepEqual(pruefeAntwort(a, ''), { richtig: false, fehlvorstellung: null });
});

test('Dezimalzahlen: Komma oder Punkt, Endnullen ändern nichts, die typischen Fehler werden erkannt', () => {
  const a = { format: 'zahl', loesung: '0,5', typischeFehler: [{ wert: '0,05', fehlvorstellung: 'dezimal-stelle' }, { wert: '5', fehlvorstellung: 'dezimal-stelle' }] };
  for (const richtig of ['0,5', '0.5', '0,50', ' 0,5 ']) assert.equal(pruefeAntwort(a, richtig).richtig, true, richtig);
  assert.deepEqual(pruefeAntwort(a, '0,05'), { richtig: false, fehlvorstellung: 'dezimal-stelle' });
  assert.deepEqual(pruefeAntwort(a, '5'), { richtig: false, fehlvorstellung: 'dezimal-stelle' });
  assert.deepEqual(pruefeAntwort(a, '5,0'), { richtig: false, fehlvorstellung: 'dezimal-stelle' });
  assert.deepEqual(pruefeAntwort(a, ',5'), { richtig: false, fehlvorstellung: null });
  assert.deepEqual(pruefeAntwort(a, ''), { richtig: false, fehlvorstellung: null });
});

// Die Eingabe, die das Dashboard für die richtige Lösung abliefert.
function richtigeEingabe(a) {
  switch (a.format) {
    case 'zahl': case 'zahlenstrahl': return String(a.loesung);
    case 'bruch': return a.loesung.replace('⁄', '/').replace(B.SCHMAL, ' ');
    case 'faerben': return Array.from({ length: a.loesung }, (_, i) => i).join(' ');
    case 'auswahl': return a.optionen.filter((o) => o.richtig).map((o) => o.text);
    case 'luecken': case 'tabelle': return Object.fromEntries(Object.entries(a.luecken).map(([n, l]) => [n, String(l.loesung)]));
    case 'zuordnen': return Object.fromEntries(a.paare.map((p) => [p.links, p.rechts]));
    case 'ordnen': return a.loesung;
    case 'sachaufgabe': return a.teile.map((t) => (t.optionen ? t.optionen.filter((o) => o.richtig).map((o) => o.text) : String(t.loesung)));
    default: throw new Error(a.format);
  }
}

test('Jede Aufgabe aus Kapitel 9: Die Lösung gilt als richtig, jeder typische Fehler als falsch mit seiner Fehlvorstellung', () => {
  for (const a of neun) {
    assert.deepEqual(pruefeAntwort(a, richtigeEingabe(a)), { richtig: true, fehlvorstellung: null }, a.id);
    if (!['zahl', 'zahlenstrahl', 'bruch', 'faerben'].includes(a.format)) continue;
    for (const f of a.typischeFehler ?? []) {
      const eingabe = a.format === 'faerben' ? Array.from({ length: f.wert }, (_, i) => i).join(' ') : String(f.wert).replace('⁄', '/').replace(B.SCHMAL, ' ');
      const e = pruefeAntwort(a, eingabe);
      assert.equal(e.richtig, false, `${a.id}: ${f.wert}`);
      assert.ok(e.fehlvorstellung, `${a.id}: ${f.wert}`);
      assert.ok(e.fehlvorstellung in pool.fehlvorstellungen, `${a.id}: ${e.fehlvorstellung}`);
    }
  }
});

// Der Prüfer rechnet unabhängig vom Erzeuger nach. Hier werden Fehler eingebaut: Er muss sie melden.
const meldet = (a) => pruefeBruchAufgabe(a, pool.fehlvorstellungen).length > 0;
function quote(aendere) {
  let alle = 0; const durch = [];
  for (const original of neun) {
    const a = kopie(original);
    if (aendere(a) === false) continue;
    alle++;
    if (!meldet(a)) durch.push(a.id);
  }
  return { alle, durch };
}

test('Der Prüfer nimmt alle Aufgaben aus Kapitel 9 an', () => {
  for (const a of neun) assert.deepEqual(pruefeBruchAufgabe(a, pool.fehlvorstellungen), [], a.id);
});

test('Prüfer: Eine falsche Lösung fällt immer auf', () => {
  for (const [name, aendere, mindestens] of [
    ['Zahl um 1 daneben', (a) => { if (!['zahl', 'zahlenstrahl', 'faerben'].includes(a.format) || typeof a.loesung !== 'number') return false; a.loesung += 1; }, 30],
    ['Dezimalzahl verändert', (a) => { if (!['zahl', 'zahlenstrahl'].includes(a.format) || typeof a.loesung !== 'string') return false; a.loesung = a.loesung.replace(/\d$/, (z) => String((Number(z) + 1) % 10 || 1)); }, 8],
    ['Zähler um 1 daneben', (a) => { if (a.format !== 'bruch') return false; a.loesung = a.loesung.replace(/(\d+)⁄/, (_, z) => `${Number(z) + 1}⁄`); }, 15],
    ['Nenner um 1 daneben', (a) => { if (a.format !== 'bruch') return false; a.loesung = a.loesung.replace(/⁄(\d+)/, (_, n) => `⁄${Number(n) + 1}`); }, 15],
    ['Lücke um 1 daneben', (a) => { const l = Object.values(a.luecken ?? {}); if (!l.length) return false; const x = l[l.length - 1]; x.loesung = typeof x.loesung === 'number' ? x.loesung + 1 : x.loesung.replace(/\d$/, (z) => String((Number(z) + 1) % 10 || 1)); }, 20],
    ['Teilaufgabe um 1 daneben', (a) => { if (!a.teile?.length || typeof a.teile[0].loesung !== 'number') return false; a.teile[0].loesung += 1; }, 2],
    ['Karten vertauscht', (a) => { if (a.format !== 'ordnen') return false; [a.loesung[0], a.loesung[1]] = [a.loesung[1], a.loesung[0]]; }, 8],
    ['Paare vertauscht', (a) => { if (a.format !== 'zuordnen') return false; [a.paare[0].rechts, a.paare[1].rechts] = [a.paare[1].rechts, a.paare[0].rechts]; }, 3],
  ]) {
    const q = quote(aendere);
    assert.ok(q.alle >= mindestens, `${name}: zu wenige Aufgaben geprüft (${q.alle})`);
    assert.deepEqual(q.durch, [], name);
  }
});

test('Prüfer: Eine falsch angekreuzte Antwort fällt immer auf', () => {
  for (const [name, aendere] of [
    ['richtige Antwort als falsch markiert', (a) => { if (a.format !== 'auswahl') return false; a.optionen.find((o) => o.richtig).richtig = false; }],
    ['falsche Antwort als richtig markiert', (a) => { if (a.format !== 'auswahl') return false; a.optionen.find((o) => !o.richtig).richtig = true; }],
  ]) {
    const q = quote(aendere);
    assert.ok(q.alle >= 50, `${name}: zu wenige Aufgaben geprüft (${q.alle})`);
    assert.deepEqual(q.durch, [], name);
  }
});

test('Prüfer: Ein verändertes Bruchbild fällt auf', () => {
  // Wählt das Kind unter den Figuren, ist das Bild selbst die Angabe: Ein anderes Bild ist dann eine andere, aber stimmige Aufgabe.
  const mitBruchbild = (a) => a.bild?.art === 'bruch' && a.bild.figuren.some((f) => (f.gefaerbt ?? []).length) && !a.nachweis.some((n) => ['figurwahl', 'figurextrem'].includes(n?.art));
  for (const [name, aendere] of [
    ['ein gefärbtes Teil weniger', (a) => { if (!mitBruchbild(a)) return false; a.bild.figuren.find((f) => f.gefaerbt.length).gefaerbt.pop(); }],
    ['ein Teil mehr im Ganzen', (a) => { if (!mitBruchbild(a)) return false; const f = a.bild.figuren[0]; if (f.form === 'hundert') return false; if (f.form === 'rechteck') f.spalten += 1; else f.teile += 1; }],
  ]) {
    const q = quote(aendere);
    assert.ok(q.alle >= 40, `${name}: zu wenige Aufgaben geprüft (${q.alle})`);
    assert.ok(q.durch.length <= q.alle * 0.1, `${name}: ${q.durch.length} von ${q.alle} unbemerkt (${q.durch.join(', ')})`);
  }
});

test('Prüfer: Regeln der Niveaustufen und der Sprache werden gemeldet', () => {
  const finde = (bedingung) => kopie(neun.find(bedingung));
  const ohneNachweis = finde((a) => a.format === 'bruch'); delete ohneNachweis.nachweis;
  assert.ok(meldet(ohneNachweis));
  const fremd = finde((a) => a.format === 'bruch' && a.typischeFehler?.length); fremd.typischeFehler[0].fehlvorstellung = 'gibt-es-nicht';
  assert.ok(meldet(fremd));
  const nenner = finde((a) => a.niveau === 'F' && a.format === 'bruch'); nenner.loesung = '3⁄7';
  assert.ok(meldet(nenner));
});
