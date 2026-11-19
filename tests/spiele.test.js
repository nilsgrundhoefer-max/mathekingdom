// Drei weitere Belohnungsspiele (ADR 0019): Steinmetz, Grenzlauf, Kellerjagd.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as L from '../src/schueler/logik.js';
import * as SP from '../src/schueler/spiele.js';

const zufall = (() => { let x = 7; return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648); })();

test('Jedes Belohnungsspiel hat Regeln, 100 Münzen Preis, drei Minuten und eine Punkt-Einheit', () => {
  const belohnung = L.SPIELE.filter((s) => s.art === 'belohnung');
  assert.deepEqual(belohnung.map((s) => s.id), ['botenritt', 'burgmauer', 'steinmetz', 'grenzlauf', 'kellerjagd']);
  for (const s of belohnung) {
    assert.ok(SP.SPIEL_ARTEN.includes(s.id), s.id);
    assert.equal(s.preis, 100); assert.equal(s.sekunden, 180); assert.ok(s.einheit);
  }
});

test('Steinmetz: eine volle Reihe verschwindet und zählt einen Punkt, mehrere zählen je einen', () => {
  const st = SP.neuerSteinmetz(zufall);
  const unten = SP.STEIN.zeilen - 1;
  st.feld[unten] = Array(SP.STEIN.spalten).fill(2);
  st.feld[unten - 1] = Array(SP.STEIN.spalten).fill(2);
  st.feld[unten][0] = null; st.feld[unten - 1][0] = null; st.feld[unten - 2][5] = 3;
  st.stein = { form: 0, felder: [[0, 0], [0, 1], [0, 2], [0, 3]], x: 0, y: unten - 3 }; // senkrechter Langstein in die Lücke
  SP.steinFallen(st, zufall);
  assert.equal(st.punkte, 2);
  assert.equal(st.feld[unten][0], 0, 'der Rest des Langsteins bleibt liegen');
  assert.equal(st.feld[unten][5], 3, 'was darüber lag, rutscht nach');
  assert.deepEqual(st.feld[unten - 1].map((f) => f !== null), [true, ...Array(SP.STEIN.spalten - 1).fill(false)]);
});

test('Steinmetz: schieben stoppt am Rand, drehen weicht vom Rand ab, alle fünf Reihen schneller', () => {
  const st = SP.neuerSteinmetz(zufall);
  for (let i = 0; i < 20; i++) SP.lenkeStein(st, 'ArrowLeft');
  assert.ok(SP.steinFelder(st.stein).every(([x]) => x >= 0));
  assert.ok(SP.steinFelder(st.stein).some(([x]) => x === 0));
  st.stein = { form: 0, felder: [[1, 0], [1, 1], [1, 2], [1, 3]], x: -1, y: 4 };
  SP.lenkeStein(st, 'ArrowUp');
  assert.ok(SP.steinPasst(st, st.stein), 'gedreht und zur Seite gerückt');
  assert.equal(new Set(SP.steinFelder(st.stein).map(([, y]) => y)).size, 1, 'jetzt waagerecht');
  const takt = SP.steinTakt(st);
  st.punkte = 5;
  assert.ok(SP.steinTakt(st) < takt);
});

test('Steinmetz: stößt der Stapel oben an, ist die Runde vorbei', () => {
  const st = SP.neuerSteinmetz(zufall);
  for (let y = 0; y < SP.STEIN.zeilen; y++) st.feld[y] = Array(SP.STEIN.spalten).fill(1).map((f, x) => (x === y % SP.STEIN.spalten ? null : f));
  for (let i = 0; i < 5 && !st.vorbei; i++) SP.steinFallen(st, zufall);
  assert.equal(st.vorbei, true);
  const neu = SP.neuerSteinmetz(zufall); // die ersten sieben Steine sind sieben verschiedene Formen
  const formen = new Set([neu.stein.form, neu.naechste, ...neu.sack]);
  assert.equal(formen.size, SP.STEIN_FORMEN);
});

test('Grenzlauf: springen über Steine, ducken unter Raben, Treffer kostet ein Banner', () => {
  const l = SP.neuerLauf();
  const stein = { art: 'stein', x: SP.LAUF.x - 5, breite: 20, hoehe: 18 };
  assert.equal(SP.stoesstAn(l, stein), true, 'am Boden stößt er an');
  SP.laufSchritt(l, 16, { springen: true }, zufall);
  for (let i = 0; i < 6; i++) SP.laufSchritt(l, 16, {}, zufall);
  assert.ok(l.y > 18); assert.equal(SP.stoesstAn(l, stein), false, 'im Sprung darüber');
  const r = SP.neuerLauf();
  const rabe = { art: 'rabe', x: SP.LAUF.x - 10, breite: 30, hoehe: 14, ueber: 28 };
  assert.equal(SP.stoesstAn(r, rabe), true, 'aufrecht trifft ihn der Rabe');
  SP.laufSchritt(r, 16, { ducken: true }, zufall);
  assert.equal(r.duckt, true); assert.equal(SP.stoesstAn(r, rabe), false, 'geduckt fliegt er drüber');
  const graben = { art: 'graben', x: SP.LAUF.x - 18, breite: 36, hoehe: 0 };
  assert.equal(SP.stoesstAn(SP.neuerLauf(), graben), true);
  const t = SP.neuerLauf();
  t.hindernisse.push({ ...stein }); t.bisHindernis = 1e9;
  SP.laufSchritt(t, 16, {}, zufall);
  assert.equal(t.banner, SP.LAUF.banner - 1);
  SP.laufSchritt(t, 16, {}, zufall);
  assert.equal(t.banner, SP.LAUF.banner - 1, 'kurz geschützt nach dem Treffer');
});

test('Grenzlauf: gezählt werden Meilen, etwa eine alle drei Sekunden am Anfang, und es wird schneller', () => {
  const l = SP.neuerLauf();
  l.bisHindernis = 1e12;
  for (let i = 0; i < 190; i++) SP.laufSchritt(l, 16, {}, zufall);
  assert.equal(l.punkte, 1);
  assert.ok(l.tempo > SP.LAUF.tempo);
  const v = SP.neuerLauf();
  for (let i = 0; i < 3 && !v.vorbei; i++) { v.schutz = 0; v.hindernisse = [{ art: 'zaun', x: SP.LAUF.x - 5, breite: 28, hoehe: 30 }]; v.bisHindernis = 1e9; SP.laufSchritt(v, 16, {}, zufall); }
  assert.equal(v.vorbei, true, 'nach drei Treffern ist Schluss');
});

test('Kellerjagd: alle Kellerpläne sind geschlossen, ohne Sackgassen und ganz erreichbar', () => {
  assert.equal(SP.KELLERPLAENE.length, 3);
  for (const plan of SP.KELLERPLAENE) {
    const b = plan[0].length;
    assert.ok(plan.every((r) => r.length === b));
    const frei = (x, y) => plan[y]?.[x] !== undefined && plan[y][x] !== '#';
    plan.forEach((r, y) => [...r].forEach((c, x) => { if (y === 0 || x === 0 || y === plan.length - 1 || x === b - 1) assert.equal(c, '#'); }));
    for (const z of 'ETR') assert.ok(plan.join('').includes(z), z);
    const felder = plan.flatMap((r, y) => [...r].map((c, x) => [x, y, c])).filter(([, , c]) => c !== '#');
    for (const [x, y] of felder) assert.ok([[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([dx, dy]) => frei(x + dx, y + dy)).length >= 2, `Sackgasse bei ${x},${y}`);
    const start = felder.find(([, , c]) => c === 'E');
    const gesehen = new Set([`${start[0]},${start[1]}`]), schlange = [start];
    while (schlange.length) { const [x, y] = schlange.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (frei(x + dx, y + dy) && !gesehen.has(`${x + dx},${y + dy}`)) { gesehen.add(`${x + dx},${y + dy}`); schlange.push([x + dx, y + dy]); } }
    assert.equal(gesehen.size, felder.length);
  }
});

test('Kellerjagd: Rollen sammeln, über die Treppe in den nächsten Keller mit einer Ratte mehr', () => {
  const k = SP.neueKellerjagd();
  assert.equal(k.ratten.length, SP.KELLER.ratten);
  const rolle = k.rollen[0];
  k.rollen = [rolle];
  k.pause = 0; k.pos = [rolle[0] - 1, rolle[1]]; k.naechste = [1, 0];
  if (!SP.kellerFrei(k, ...k.pos)) { k.pos = [rolle[0] + 1, rolle[1]]; k.naechste = [-1, 0]; }
  SP.kundschafterSchritt(k);
  assert.equal(k.punkte, 1); assert.equal(k.rollen.length, 0);
  k.pos = [k.treppe[0] - 1, k.treppe[1]]; k.naechste = [1, 0];
  SP.kundschafterSchritt(k);
  assert.equal(k.keller, 2);
  assert.equal(k.ratten.length, SP.KELLER.ratten + 1);
  assert.ok(k.rollen.length > 0, 'der nächste Keller hat neue Rollen');
  assert.ok(SP.ratteTakt(k) < SP.KELLER.ratteMs, 'die Ratten werden etwas schneller');
});

test('Kellerjagd: eine Ratte folgt dem Kundschafter im selben Gang, nicht durch Mauern', () => {
  const k = SP.neueKellerjagd();
  k.pos = [1, 3]; // Gang in Zeile 3 des ersten Kellers
  assert.deepEqual(SP.sichtRichtung(k, [5, 3]), [-1, 0]);
  assert.equal(SP.sichtRichtung(k, [1, 7]), null, 'Mauer dazwischen');
  assert.equal(SP.sichtRichtung(k, [4, 5]), null, 'nicht im selben Gang');
});

test('Kellerjagd: eine Ratte kostet ein Banner und schickt zurück zum Eingang', () => {
  const k = SP.neueKellerjagd();
  k.pause = 0; k.pos = [1, 3];
  k.ratten = [{ pos: [2, 3], richtung: null }];
  k.sammelRatte = SP.ratteTakt(k);
  SP.kellerSchritt(k, 1, zufall);
  assert.equal(k.banner, SP.KELLER.banner - 1);
  assert.deepEqual(k.pos, k.eingang);
  assert.ok(k.pause > 0);
  k.banner = 1; k.pause = 0; k.pos = [1, 3]; k.ratten = [{ pos: [2, 3], richtung: null }]; k.sammelRatte = SP.ratteTakt(k);
  SP.kellerSchritt(k, 1, zufall);
  assert.equal(k.vorbei, true);
});
