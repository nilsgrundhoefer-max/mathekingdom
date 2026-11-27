// Automatische Prüfungen aus dem Audit aus Schülersicht (Version 0.65):
// Schreibweise, Pronomen, Beispiel ungleich Aufgabe, Länge der richtigen Antwort, eigene Hinweise.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beispielVerraet } from '../tools/werkzeug.mjs';

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pools = [5, 6, 7].map(lies);
const aufgaben = pools.flatMap((p) => p.aufgaben);

// Alle Texte einer Aufgabe, die ein Kind lesen kann (ohne Bilddaten und Nachweise).
const OHNE = new Set(['bild', 'nachweis', 'id', 'lernziel', 'format', 'kompetenz', 'gitter', 'luecke']);
function* texte(o, pfad = '') {
  if (typeof o === 'string') yield [pfad, o];
  else if (Array.isArray(o)) for (const v of o) yield* texte(v, pfad);
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) if (!OHNE.has(k)) yield* texte(v, `${pfad}.${k}`);
}
const zeige = (liste) => liste.slice(0, 12).join('\n');

test('Schreibweise: keine doppelten Wörter, doppelten Satzzeichen oder Leerzeichen vor Satzzeichen', () => {
  const muster = /\.\.(?!\.)|\.,|,,| {2}|(?<![\p{L}\d])(\p{L}{3,}) \1(?![\p{L}\d])|\s[.,;!]|\p{L}\s\?/u;
  const erlaubt = /\b(die die|der der|das das|sie sie)\b/i; // „Zahlen, die die …“ ist richtiges Deutsch
  const funde = [];
  for (const a of aufgaben) for (const [pfad, s] of texte(a)) {
    const m = s.match(muster);
    if (m && !erlaubt.test(m[0])) funde.push(`${a.id}${pfad}: ${s.slice(0, 120)}`);
  }
  for (const p of pools) for (const [code, f] of Object.entries(p.fehlvorstellungen)) for (const [k, s] of Object.entries(f)) {
    if (typeof s === 'string' && muster.test(s) && !erlaubt.test(s.match(muster)[0])) funde.push(`${code}.${k}: ${s}`);
  }
  assert.equal(funde.length, 0, zeige(funde));
});

test('Schreibweise: kein Unterstrich außer bei Indizes wie h_c, Gradzeichen ohne Leerzeichen', () => {
  const funde = [];
  for (const a of aufgaben) for (const [pfad, s] of texte(a)) {
    if (/_/.test(s.replace(/\{\{\w+\}\}/g, '')) && !/(?<![\p{L}\d])\p{L}_[\p{L}\d](?![\p{L}\d])/u.test(s)) funde.push(`${a.id}${pfad}: ${s.slice(0, 100)}`);
    if (/\d °(?![CF])/.test(s)) funde.push(`${a.id}${pfad}: ${s.slice(0, 100)}`);
  }
  assert.equal(funde.length, 0, zeige(funde));
});

test('Besitzwörter im selben Satz passen zum Vornamen („Lina … ihr“, „Tom … sein“)', () => {
  // Bewusst eng: „sie“ und „er“ stehen oft für Dinge („die Linie“, „der Balken“) und lassen sich nicht sicher prüfen.
  const W = ['Mia', 'Lena', 'Mara', 'Ida', 'Lina', 'Elif', 'Sara', 'Lisa', 'Jana', 'Eda', 'Lea', 'Paula'];
  const M = ['Tom', 'Ali', 'Ben', 'Jonas', 'Finn', 'Ole', 'Paul', 'Emre', 'Noah', 'Tarik', 'Max', 'Tim'];
  const satzMit = (namen, wort) => new RegExp(`(?<!\\p{L})(${namen.join('|')}) [^.!?„“\\n]*(?<!\\p{L})${wort}(?!\\p{L})`, 'u');
  const wSein = satzMit(W, 'seine?[mnrs]?'), mIhr = satzMit(M, 'ihre?[mnrs]?');
  const funde = [];
  for (const a of aufgaben) for (const [pfad, s] of texte(a)) {
    const namen = [...W, ...M].filter((n) => new RegExp(`(?<!\\p{L})${n}(?!\\p{L})`, 'u').test(s));
    if (namen.length !== 1) continue; // zwei Kinder im Satz: nicht eindeutig
    if (wSein.test(s) || mIhr.test(s)) funde.push(`${a.id}${pfad}: ${s.slice(0, 110)}`);
  }
  assert.equal(funde.length, 0, zeige(funde));
});

test('Das Beispiel rechnet nie die Aufgabe selbst vor', () => {
  const AUSNAHMEN = new Set(['6.3.8-K2-G-03']); // Beispiel zeigt nur einen Zwischenschritt
  const funde = aufgaben.filter((a) => a.hilfen?.beispiel && !AUSNAHMEN.has(a.id) && beispielVerraet(a, a.hilfen.beispiel)).map((a) => `${a.id}: ${a.hilfen.beispiel.slice(0, 100)}`);
  assert.equal(funde.length, 0, zeige(funde));
});

// „Die längste Antwort ist richtig“: Auswahlaufgabe mit genau einer richtigen Antwort,
// die deutlich länger ist als jede falsche. Je Kapitel darf das höchstens ein Drittel sein.
const laengsteRichtig = (a) => {
  if (a.format !== 'auswahl' || a.mehrfach) return null;
  const richtig = a.optionen.filter((o) => o.richtig);
  if (richtig.length !== 1) return null;
  const laengen = a.optionen.map((o) => o.text.length).sort((x, y) => x - y);
  if (laengen.at(-1) < 25) return null;
  const lr = richtig[0].text.length;
  return lr === laengen.at(-1) && lr >= 1.25 * laengen.at(-2);
};

test('Höchstens in einem Drittel der Auswahlaufgaben je Kapitel ist die längste Antwort die richtige', () => {
  const je = new Map();
  for (const a of aufgaben) {
    const f = laengsteRichtig(a);
    if (f === null) continue;
    const kap = a.id.split('.').slice(0, 2).join('.');
    const z = je.get(kap) ?? { alle: 0, lang: 0 };
    z.alle += 1; z.lang += f ? 1 : 0; je.set(kap, z);
  }
  const zuViel = [...je].filter(([, z]) => z.lang * 3 > z.alle).map(([kap, z]) => `Kapitel ${kap}: ${z.lang} von ${z.alle}`);
  assert.equal(zuViel.length, 0, zuViel.join('\n'));
});

test('Eigene Hinweise einer Aufgabe gehören zu einer Fehlvorstellung, die in der Aufgabe vorkommt', () => {
  const funde = [];
  for (const p of pools) for (const a of p.aufgaben) {
    if (!a.hinweise) continue;
    const codes = new Set(JSON.stringify(a).match(/"fehlvorstellung":"[^"]+"/g)?.map((s) => s.split('"')[3]) ?? []);
    for (const k of ['umgekehrt', 'sonst']) if (typeof a[k] === 'string') codes.add(a[k]);
    for (const code of Object.keys(a.hinweise)) {
      if (!p.fehlvorstellungen[code]) funde.push(`${a.id}: Hinweis für unbekannte Fehlvorstellung ${code}`);
      else if (!codes.has(code)) funde.push(`${a.id}: Hinweis für ${code}, kommt in der Aufgabe nicht vor`);
    }
  }
  assert.equal(funde.length, 0, zeige(funde));
});

test('Beim Ordnen gehört zur umgekehrten Reihenfolge eine bekannte Fehlvorstellung', () => {
  const funde = [];
  for (const p of pools) for (const a of p.aufgaben) {
    if (a.format === 'ordnen' && typeof a.umgekehrt === 'string' && !p.fehlvorstellungen[a.umgekehrt]) funde.push(`${a.id}: ${a.umgekehrt}`);
  }
  assert.equal(funde.length, 0, zeige(funde));
});
