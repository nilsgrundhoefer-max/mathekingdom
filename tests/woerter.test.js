// Worterklärung am Wort (ADR 0056): Welche Wörter der Wortspeicher stehen in einem Text?
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { wortVerzeichnis, findeWoerter, aufgabenTexte, NUR_IM_KAPITEL } from '../src/gemeinsam/woerter.js';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const fuenf = lies(5), sechs = lies(6), sieben = lies(7);
const v5 = wortVerzeichnis(fuenf);
const addieren = { meilenstein: '5.3.2', kapitel: '5.3' };
const finde = (text, ort = addieren, v = v5) => findeWoerter(text, v, ort).map((f) => `${text.slice(f.start, f.ende)}=${f.wort}`);

test('Die Aufgabe aus der Meldung zeigt nur ihre eigenen Wörter', () => {
  const auf = fuenf.aufgaben.find((a) => a.id === '5.3.2-A2-G-01');
  assert.deepEqual(aufgabenTexte(auf).flatMap((t) => finde(t)), ['Addiere schriftlich=schriftlich addieren']);
  // Mit aufgedecktem Tipp und Beispiel kommen deren Wörter dazu, auch „Einer“ und „Hunderter“ (Grundwörter).
  const hilfen = [auf.hilfen.tipp, auf.hilfen.beispiel].flatMap((t) => finde(t)).map((s) => s.split('=')[1]);
  for (const w of ['Einer', 'Zehner', 'Hunderter', 'Ergebnis']) assert.ok(hilfen.includes(w), w);
  assert.ok(!hilfen.includes('Überschlag') && !hilfen.includes('Probe'));
});

test('Wortformen: Endungen, Befehlsform, Mittelwort, Umlaut im Plural, Wortgruppen', () => {
  assert.deepEqual(finde('Wie groß ist die Summe der Summanden?'), ['Summe=Summe', 'Summanden=Summand']);
  assert.deepEqual(finde('Addiere 3 und 4. Du addierst zwei Zahlen.'), ['Addiere=addieren', 'addierst=addieren']);
  assert.deepEqual(finde('Runde auf Zehner. Die Zahl wurde gerundet.', { meilenstein: '5.2.3', kapitel: '5.2' }), ['Runde=runden', 'Zehner=Zehner', 'gerundet=runden']);
  assert.deepEqual(finde('Wie groß sind die Überträge?'), ['Überträge=Übertrag']);
  assert.deepEqual(finde('Subtrahiere schriftlich.', { meilenstein: '5.3.3', kapitel: '5.3' }), ['Subtrahiere schriftlich=schriftlich subtrahieren']);
  // Kein Treffer mitten im Wort und keiner in einer reinen Rechnung.
  assert.deepEqual(finde('Der Summenwert 211 + 587'), []);
});

test('Jede Fundstelle steht im Text, Fundstellen überschneiden sich nicht', () => {
  for (const pool of [fuenf, sechs, sieben]) {
    const v = wortVerzeichnis(pool);
    const ort = new Map(pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele.map((l) => [l.id, { meilenstein: u.id, kapitel: k.id }]))));
    let mit = 0;
    for (const a of pool.aufgaben) {
      let n = 0;
      for (const t of aufgabenTexte(a)) {
        const funde = findeWoerter(t, v, ort.get(a.lernziel));
        n += funde.length;
        funde.forEach((f, i) => { assert.ok(f.start < f.ende && f.ende <= t.length && f.erklaerung, a.id); if (i) assert.ok(funde[i - 1].ende <= f.start, a.id); });
      }
      if (n) mit++;
    }
    assert.ok(mit > pool.aufgaben.length / 2, `Klasse ${pool.klassenstufe}: nur ${mit} Aufgaben mit erklärtem Wort`);
  }
});

test('Der eigene Meilenstein erklärt vor dem Rest, Alltagswörter nur im eigenen Kapitel', () => {
  assert.deepEqual(finde('Teile 20 durch 4. Die Pizza hat drei Teile.', { meilenstein: '5.4.5', kapitel: '5.4' }).filter((s) => s.endsWith('=teilen')), ['Teile=teilen']);
  assert.ok(NUR_IM_KAPITEL.has('teilen'));
  assert.deepEqual(finde('Teile 20 durch 4.', { meilenstein: '5.1.1', kapitel: '5.1' }).filter((s) => s.endsWith('=teilen')), []);
  assert.deepEqual(finde('Die Spitze der Pyramide.', { meilenstein: '5.7.3', kapitel: '5.7' }).filter((s) => s.endsWith('=spitz')), []);
});

test('Klasse 6 und 7 erklären auch Wörter aus früheren Klassenstufen, Brüche mit Umlaut', () => {
  assert.ok(sechs.vorstufe.woerter.length > 300 && sieben.vorstufe.woerter.length > sechs.vorstufe.woerter.length);
  const v7 = wortVerzeichnis(sieben);
  const w = findeWoerter('Wie groß ist der Winkel im Dreieck?', v7, { meilenstein: '7.2.2', kapitel: '7.2' }).map((f) => f.wort);
  assert.deepEqual(w, ['Winkel', 'Dreieck']);
  const v6 = wortVerzeichnis(sechs);
  assert.deepEqual(findeWoerter('Welche Brüche sind gleich groß?', v6, { meilenstein: '6.1.2', kapitel: '6.1' }).map((f) => f.wort), ['Bruch']);
  // Vorstufe: Jedes Brückenlernziel bringt seinen Merkzettel mit.
  for (const pool of [sechs, sieben]) for (const l of pool.vorstufe.lernziele) assert.ok(l.merkzettel?.regel, l.id);
});
