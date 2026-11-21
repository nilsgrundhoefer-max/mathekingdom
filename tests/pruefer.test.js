// Der Prüfer rechnet jede Aufgabe unabhängig vom Erzeuger nach (ADR 0015). Dieser Test baut absichtlich Fehler in den Pool ein:
// Der Prüfer muss sie melden. So fällt auf, wenn eine Prüfregel verloren geht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pruefePool } from '../tools/pruefe-pool.mjs';

const text = readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8');
const frisch = () => JSON.parse(text);
const anzahl = frisch().aufgaben.length;

test('Der Pool besteht die Prüfung, und fast jede Aufgabe ist nachgerechnet', () => {
  const pool = frisch();
  assert.deepEqual(pruefePool(pool).fehler, []);
  assert.ok(pool.aufgaben.filter((a) => a.nachweis).length >= anzahl * 0.95);
});

// Baut in jede `schritt`-te Aufgabe einen Fehler ein und zählt, wie oft der Prüfer ihn meldet.
function quote(aendere, schritt = 7) {
  let alle = 0, gemeldet = 0; const durch = [];
  for (let i = 0; i < anzahl; i += schritt) {
    const pool = frisch(), a = pool.aufgaben[i];
    if (aendere(a) === false) continue;
    alle++;
    if (pruefePool(pool).fehler.length) gemeldet++; else durch.push(a.id);
  }
  return { alle, gemeldet, durch };
}
const letzteZahl = (t, wie) => { const m = [...t.matchAll(/\d+/g)]; if (!m.length) return null; const x = m[m.length - 1]; return t.slice(0, x.index) + wie(Number(x[0])) + t.slice(x.index + x[0].length); };

test('Eine falsche Lösung fällt immer auf', () => {
  for (const [name, aendere] of [
    ['Lösung um 1 daneben', (a) => { if (typeof a.loesung !== 'number') return false; a.loesung += 1; }],
    ['Lücke um 1 daneben', (a) => { const l = Object.values(a.luecken ?? {}); if (!l.length) return false; l[l.length - 1].loesung += 1; }],
    ['Teilaufgabe um 1 daneben', (a) => { if (!a.teile?.length) return false; a.teile[0].loesung += 1; }],
  ]) {
    const q = quote(aendere, name.startsWith('Lösung') ? 5 : 1);
    assert.ok(q.alle >= 10, `${name}: zu wenige Aufgaben geprüft (${q.alle})`);
    assert.deepEqual(q.durch, [], name);
  }
});

test('Eine falsch angekreuzte Antwort fällt bei Rechenaufgaben auf', () => {
  // Nur Auswahlaufgaben, deren Antworten Zahlen oder Rechnungen sind: Begründungen in Worten kann kein Programm prüfen, die sind gegengelesen.
  const q = quote((a) => {
    if (!a.optionen || a.mehrfach || !a.optionen.every((o) => /\d/.test(o.text) && !/[A-Za-zÄÖÜäöüß]{4,}/.test(o.text))) return false;
    const r = a.optionen.find((o) => o.richtig), f = a.optionen.find((o) => !o.richtig);
    r.richtig = false; f.richtig = true; delete f.fehlvorstellung;
  }, 1);
  assert.ok(q.alle >= 20, `nur ${q.alle}`);
  assert.deepEqual(q.durch, []);
});

test('Eine veränderte Zahl im Aufgabentext oder im Bild fällt fast immer auf', () => {
  const textZahl = quote((a) => { const t = letzteZahl(a.text, (z) => z + 1); if (!t) return false; a.text = t; });
  assert.ok(textZahl.gemeldet >= textZahl.alle * 0.85, `Textzahl: ${textZahl.gemeldet} von ${textZahl.alle}; nicht gemeldet: ${textZahl.durch}`);
  const bild = quote((a) => {
    if (!a.bild) return false;
    // Länge und Einteilung einer Achse (Zahlenstrahl, Säulendiagramm) und die Größe eines Gitters sind frei wählbar; die Werte darauf prüft der Test zu Kapitel 1.
    const k = Object.keys(a.bild).find((n) => typeof a.bild[n] === 'number' && !['von', 'bis', 'schritt', 'beschriftung', 'felder', 'max', 'fein', 'ab', 'b', 'h', 'lang'].includes(n));
    if (!k) return false; a.bild[k] += 1;
  }, 2);
  assert.ok(bild.alle >= 40);
  assert.ok(bild.gemeldet >= bild.alle * 0.95, `Bild: ${bild.gemeldet} von ${bild.alle}; nicht gemeldet: ${bild.durch}`);
});

test('Eine falsche Rechnung in einem Hilfekärtchen fällt fast immer auf', () => {
  const q = quote((a) => {
    for (const k of Object.keys(a.hilfen)) if (/= (\d+)(?![\d?])/.test(a.hilfen[k])) { a.hilfen[k] = a.hilfen[k].replace(/= (\d+)(?![\d?])/, (_, z) => `= ${Number(z) + 1}`); return undefined; }
    return false;
  }, 5);
  assert.ok(q.alle >= 40);
  assert.ok(q.gemeldet >= q.alle * 0.9, `Hilfe: ${q.gemeldet} von ${q.alle}; nicht gemeldet: ${q.durch}`);
});

test('Regeln der Niveaustufen: zu viele Antworten, fehlendes Bild und fehlende Grundlage werden gemeldet', () => {
  const meldet = (aendere) => { const pool = frisch(); aendere(pool); return pruefePool(pool).fehler; };
  assert.ok(meldet((p) => { const a = p.aufgaben.find((x) => x.niveau === 'F' && x.optionen); a.optionen.push({ text: 'noch eine', richtig: false }); }).length > 0);
  assert.ok(meldet((p) => { delete p.aufgaben.find((x) => x.niveau === 'F' && x.bild).bild; }).length > 0);
  assert.ok(meldet((p) => { delete p.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.grundlage).grundlage; }).some((f) => /Grundlage/.test(f)));
  assert.ok(meldet((p) => { delete p.aufgaben.find((x) => x.niveau === 'G').hilfen.beispiel; }).length > 0);
});

test('Zahlenmauer, Malkreuz und Rechenraster: falsche Steine, Felder und Zahlen fallen auf', () => {
  const mitTabelle = (art) => frisch().aufgaben.map((a, i) => [a, i]).filter(([a]) => a.tabelle?.art === art).map(([, i]) => i);
  for (const art of ['mauer', 'malkreuz', 'raster']) {
    const stellen = mitTabelle(art);
    assert.ok(stellen.length >= 5, `${art}: nur ${stellen.length} Aufgaben`);
    for (const i of stellen) {
      // Ein Eingabefeld mit falscher Lösung.
      let pool = frisch(), a = pool.aufgaben[i];
      const l = Object.values(a.luecken); l[0].loesung += 1;
      assert.ok(pruefePool(pool).fehler.length > 0, `${a.id}: falsches Eingabefeld nicht gemeldet`);
      // Eine vorgegebene Zahl in der Tabelle verändert.
      pool = frisch(); a = pool.aufgaben[i];
      const zeile = a.tabelle.zeilen.find((z) => z.some((c) => typeof c === 'string' && /^\d+$/.test(c)));
      if (!zeile) continue;
      const k = zeile.findIndex((c) => typeof c === 'string' && /^\d+$/.test(c));
      zeile[k] = String(Number(zeile[k]) + 1);
      assert.ok(pruefePool(pool).fehler.length > 0, `${a.id}: veränderte Zahl ${zeile[k]} nicht gemeldet`);
    }
  }
});

test('Kapitel 1 Daten: falsche Striche, Säulen, Achsen und Antworten fallen auf', () => {
  const kap1 = frisch().aufgaben.map((a, i) => [a, i]).filter(([a]) => a.lernziel.startsWith('5.1.'));
  const meldet = (i, aendere) => { const pool = frisch(); aendere(pool.aufgaben[i]); return pruefePool(pool).fehler.length > 0; };
  const alle = (filter, aendere, name) => {
    const stellen = kap1.filter(([a]) => filter(a));
    assert.ok(stellen.length >= 5, `${name}: nur ${stellen.length} Aufgaben`);
    for (const [a, i] of stellen) assert.ok(meldet(i, aendere), `${a.id}: ${name} nicht gemeldet`);
  };
  alle((a) => a.format === 'strichliste', (a) => { a.zeilen[0].loesung += 1; }, 'Strichliste mit einem Strich zu viel');
  alle((a) => a.format === 'strichliste' && ['F', 'G'].includes(a.niveau), (a) => { a.buendeln = 'selbst'; }, 'selbst bündeln auf F oder G');
  alle((a) => a.format === 'zeichnen' && a.daten?.kopf.length === 2, (a) => { const x = a.diagramm.saeulen.find((s) => s.offen && s.start !== s.wert); x.wert += a.diagramm.fein * (x.wert + a.diagramm.fein <= a.diagramm.max ? 1 : -1); }, 'falsche Säulenhöhe');
  alle((a) => a.format === 'zeichnen', (a) => { a.diagramm.saeulen.find((s) => s.offen).wert += a.diagramm.fein / 2 || 1; }, 'Säule zwischen zwei Linien');
  // Achsen beginnen bei 0, außer bei täuschenden Diagrammen in V2 auf M und E.
  alle((a) => a.bild?.art === 'saeulen' && !/-V2$/.test(a.lernziel), (a) => { a.bild.ab = a.bild.schritt; }, 'abgeschnittene Achse');
  alle((a) => a.bild?.art === 'saeulen', (a) => { const x = a.bild.saeulen.find((y) => typeof y.wert === 'number'); x.wert += (a.bild.fein ?? a.bild.schritt) / 4; }, 'Wert zwischen den Linien');
  // Halbe Bilder erst ab M.
  alle((a) => a.bild?.art === 'bilddiagramm' && ['F', 'G'].includes(a.niveau) && a.bild.je % 2 === 0, (a) => { a.bild.zeilen[0].wert += a.bild.je / 2; }, 'halbes Bild auf F oder G');
  // Antworten, die der Prüfer an den Daten selbst nachrechnet: Eine falsch angekreuzte fällt immer auf.
  const GEBUNDEN = ['zeile', 'datenwahl', 'rangfolge', 'einteilung', 'mangel', 'aussagen'];
  alle((a) => a.format === 'auswahl' && !a.mehrfach && a.nachweis?.some((n) => GEBUNDEN.includes(n?.art)),
    (a) => { const r = a.optionen.find((o) => o.richtig), f = a.optionen.find((o) => !o.richtig); r.richtig = false; f.richtig = true; delete f.fehlvorstellung; }, 'falsch angekreuzte Antwort');
});

test('Kapitel 5 Geometrie: verschobene Punkte, falsche Linien und falsch benannte Figuren fallen auf', () => {
  const kap5 = frisch().aufgaben.map((a, i) => [a, i]).filter(([a]) => a.lernziel.startsWith('5.5.'));
  const meldet = (i, aendere) => { const pool = frisch(); aendere(pool.aufgaben[i]); return pruefePool(pool).fehler.length > 0; };
  const alle = (filter, aendere, name, mindestens = 10) => {
    const stellen = kap5.filter(([a]) => filter(a));
    assert.ok(stellen.length >= mindestens, `${name}: nur ${stellen.length} Aufgaben`);
    for (const [a, i] of stellen) assert.ok(meldet(i, aendere), `${a.id}: ${name} nicht gemeldet`);
  };
  const frei = (a, p) => !a.loesung.some((q) => q[0] === p[0] && q[1] === p[1]);
  // Gitterzeichnen mit Punkten: Ein Punkt der Lösung rutscht ein Kästchen weiter.
  alle((a) => a.format === 'gitter' && a.eingabe === 'punkte' && !a.offen, (a) => { const [x, y] = a.loesung[0], neu = [[x + 1, y], [x - 1, y], [x, y + 1]].find((p) => p[0] >= 0 && p[0] <= a.gitter.b && p[1] <= a.gitter.h && frei(a, p)); a.loesung[0] = neu; }, 'verschobener Punkt', 40);
  // Lineal: Die Strecke endet einen Zentimeter weiter rechts als gerechnet.
  alle((a) => a.bild?.art === 'lineal', (a) => { a.bild.bis += 10; }, 'verschobenes Streckenende am Lineal', 5);
  // Gefärbte Kästchen: Ein Kästchen der Lösung fehlt.
  alle((a) => a.format === 'gitter' && a.eingabe === 'zellen', (a) => { a.loesung.pop(); }, 'fehlendes Kästchen', 8);
  // Linien: Das Beispiel erfüllt die Bedingung nicht mehr.
  alle((a) => a.format === 'gitter' && a.eingabe === 'linie', (a) => { a.beispiel = [a.beispiel[0], a.beispiel[0]]; }, 'Beispiel ist keine Linie', 30);
  // Auswahl an Figuren und Vierecksnamen: Eine falsch angekreuzte Antwort fällt immer auf.
  const GEBUNDEN = ['figurenwahl', 'achsenwahl', 'streckenwahl', 'punktwahl', 'lagewahl'];
  const NAMEN = ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'];
  alle((a) => a.format === 'auswahl' && (a.nachweis?.some((n) => GEBUNDEN.includes(n?.art)) || (a.nachweis?.some((n) => n?.art === 'viereck') && a.optionen.every((o) => NAMEN.includes(o.text)))),
    (a) => { const f = a.optionen.find((o) => !o.richtig); f.richtig = true; delete f.fehlvorstellung; if (!a.mehrfach) a.optionen.find((o) => o.richtig && o !== f).richtig = false; }, 'falsch angekreuzte Antwort', 40);
  // Eine Ecke des Vierecks verrutscht: Name oder Eigenschaften stimmen nicht mehr.
  alle((a) => a.bild?.art === 'gitter' && a.bild.figuren?.length === 1 && a.nachweis?.some((n) => n?.art === 'viereck' && n.typ && n.typ !== 'Viereck' && n.typ !== 'Trapez'),
    (a) => { const e = a.bild.figuren[0].ecken[1]; e[0] += 1; const p = a.bild.punkte?.find((q) => q.n === 'B'); if (p) p.x += 1; }, 'verschobene Ecke', 20);
});
