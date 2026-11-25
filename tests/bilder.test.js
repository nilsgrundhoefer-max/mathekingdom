// Die Bilder zu den Aufgaben müssen genau das zeigen, was im Feld "bild" steht: Hier wird jedes Bild des Pools gezeichnet und nachgezählt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Kleiner Ersatz für das DOM: Die Zeichner brauchen nur createElementNS, setAttribute und append.
class Knoten {
  constructor(tag) { this.tag = tag; this.attribute = {}; this.kinder = []; this.style = {}; }
  setAttribute(name, wert) { this.attribute[name] = String(wert); }
  getAttribute(name) { return this.attribute[name] ?? null; }
  addEventListener() {}
  append(...kinder) { this.kinder.push(...kinder); }
  replaceChildren(...kinder) { this.kinder = kinder; }
  alle() { return [this, ...this.kinder.flatMap((k) => (k instanceof Knoten ? k.alle() : []))]; }
  klasse(name) { return this.alle().filter((k) => (k.attribute.class ?? '').split(' ').includes(name)); }
  texte() { return this.alle().filter((k) => k.tag === 'text').map((k) => k.kinder.filter((x) => !(x instanceof Knoten)).join('')); }
}
globalThis.SVGElement = Knoten;
globalThis.document = { createElementNS: (_, tag) => new Knoten(tag), createElement: (tag) => new Knoten(tag) };
const { aufgabenBild, BILDARTEN, teilBreiten } = await import('../src/schueler/aufgabenbilder.js');

const lies = (n) => JSON.parse(readFileSync(new URL(`../aufgabenpool/klasse-${n}.json`, import.meta.url), 'utf8'));
const pool = lies(5);
// Klasse 7 (ADR 0043) bringt das Thermometer und die Zahlengerade mit negativen Zahlen mit.
// Klasse 6 Kapitel 3 (ADR 0045) bringt Körper, Netze und Ansichten mit.
const mitBild = [...pool.aufgaben, ...lies(6).aufgaben.filter((a) => a.id.startsWith('6.3.') || a.id.startsWith('6.4.')), ...lies(7).aufgaben].filter((a) => a.bild);
const zahl = (x) => (typeof x === 'object' ? x.wert : x);
const lesbar = (x) => (typeof x === 'object' && x.frage ? '?' : String(x));

test('Jede Bildart des Pools hat einen Zeichner, und jedes Bild hat eine Beschreibung in Worten', () => {
  assert.ok(mitBild.length >= 200);
  for (const a of mitBild) {
    assert.ok(BILDARTEN.includes(a.bild.art), `${a.id}: ${a.bild.art}`);
    // Die Bilder aus Kapitel 1 stehen in einer figure; das Bild selbst trägt role="img".
    const wurzel = aufgabenBild(a.bild), svg = wurzel.tag === 'svg' ? wurzel : wurzel.alle().find((k) => k.attribute.role === 'img');
    assert.ok(svg, a.id);
    assert.ok(['svg', 'figure'].includes(svg.tag), a.id);
    assert.equal(svg.getAttribute('role'), 'img', a.id);
    assert.ok(svg.getAttribute('aria-label').length > 5, a.id);
    assert.doesNotMatch(svg.getAttribute('aria-label'), /undefined|NaN|null|false/, a.id);
    for (const k of svg.alle()) for (const [n, w] of Object.entries(k.attribute)) assert.doesNotMatch(w, /NaN|undefined/, `${a.id}: ${k.tag} ${n}`);
  }
});

test('Die Bilder zeigen genau die Anzahlen aus der Aufgabe', () => {
  const gezaehlt = {};
  for (const a of mitBild) {
    const b = a.bild, svg = aufgabenBild(b);
    gezaehlt[b.art] = (gezaehlt[b.art] ?? 0) + 1;
    const p = (art) => svg.klasse('plaettchen').filter((k) => k.attribute.class.split(' ').includes(art)).length;
    if (b.art === 'zehnerfeld') {
      assert.equal(p('voll'), b.belegt, a.id);
      assert.equal(p('hell'), b.dazu ?? 0, a.id);
      assert.equal(svg.alle().filter((k) => k.tag === 'rect').length >= b.felder, true, a.id);
    } else if (b.art === 'mengenbild') {
      assert.equal(p('voll'), b.anzahl, a.id);
      assert.equal(p('hell'), b.dazu ?? 0, a.id);
      assert.equal(p('weg'), b.weg ?? 0, a.id);
    } else if (b.art === 'gruppenbild') {
      assert.equal(svg.klasse('plaettchen').length, b.gruppen * b.je + (b.rest ?? 0), a.id);
    } else if (b.art === 'punktefeld') {
      assert.equal(svg.klasse('plaettchen').length, b.reihen * b.spalten, a.id);
      assert.equal(svg.klasse('trennlinie').length, b.trenn ? 1 : 0, a.id);
    } else if (b.art === 'quadratbild') {
      assert.equal(svg.klasse('kaestchen').length, b.seite * b.seite * (b.schichten ?? 1), a.id);
    } else if (b.art === 'paeckchen') {
      assert.equal(svg.klasse('paeckchen').length, b.paeckchen, a.id);
      assert.equal(p('hell'), b.paeckchen * b.je, a.id);
      assert.equal(p('voll'), b.einzeln ?? 0, a.id);
    } else if (b.art === 'zehnermaterial') {
      assert.equal(svg.klasse('platte').length, b.h ?? 0, a.id);
      assert.equal(svg.klasse('stange').length, b.z ?? 0, a.id);
      assert.equal(svg.klasse('wuerfel').length, b.e ?? 0, a.id);
      assert.equal(svg.klasse('weg').length, (b.weg?.h ?? 0) + (b.weg?.z ?? 0) + (b.weg?.e ?? 0), a.id);
    } else if (b.art === 'stellenwerttafel') {
      assert.equal(svg.klasse('plaettchen').length, b.plaettchen.reduce((x, y) => x + y, 0), a.id);
      for (const name of b.spalten) assert.ok(svg.texte().includes(name), `${a.id}: Spalte ${name}`);
    } else if (b.art === 'streifen') {
      // Das Ganze ist die Summe der Teile, und jede Zahl steht lesbar im Bild; die Unbekannte als Fragezeichen.
      assert.equal(b.teile.map(zahl).reduce((x, y) => x + y, 0), zahl(b.ganz), a.id);
      const texte = svg.texte().map((t) => t.replace(/\s/g, ''));
      for (const w of [b.ganz, ...b.teile]) assert.ok(texte.includes(lesbar(w)), `${a.id}: ${lesbar(w)} fehlt in ${texte}`);
      assert.equal(texte.filter((t) => t === '?').length, [b.ganz, ...b.teile].filter((w) => typeof w === 'object' && w.frage).length, a.id);
    } else if (b.art === 'strichliste') {
      // Je Zeile so viele Striche wie die Anzahl, und jeder fünfte liegt quer.
      const zeilen = svg.alle().filter((k) => k.tag === 'tr');
      assert.equal(zeilen.length, b.zeilen.length, a.id);
      b.zeilen.forEach((z, i) => {
        const st = zeilen[i].klasse('strich');
        assert.equal(st.length, z.anzahl, `${a.id}: ${z.name}`);
        if (!z.striche) assert.equal(st.filter((k) => k.attribute.class.includes('quer')).length, Math.floor(z.anzahl / 5), `${a.id}: ${z.name}`);
      });
    } else if (b.art === 'saeulen') {
      // Jede Säule ist genau so hoch (lang), wie ihr Wert über dem Anfang der Achse liegt: gleicher Maßstab für alle.
      const rects = svg.klasse('saeule'), werte = b.saeulen.filter((x) => typeof x.wert === 'number').map((x) => x.wert);
      assert.equal(rects.length, werte.filter((w) => w > (b.ab ?? 0)).length, a.id);
      const laenge = rects.map((r) => Number(r.attribute[b.liegend ? 'width' : 'height']));
      const mass = laenge.map((l, i) => l / (werte.filter((w) => w > (b.ab ?? 0))[i] - (b.ab ?? 0)));
      for (const x of mass) assert.ok(Math.abs(x - mass[0]) < 1e-6, `${a.id}: Maßstab ${mass}`);
      const texte = svg.texte();
      for (const x of b.saeulen) assert.ok(texte.includes(x.name), `${a.id}: ${x.name}`);
      assert.equal(texte.filter((t) => t === '?').length, b.saeulen.filter((x) => typeof x.wert === 'object').length, a.id);
    } else if (b.art === 'bilddiagramm') {
      // Ganze Bilder plus höchstens ein halbes je Zeile; dazu das eine Bild im Schlüssel.
      const ganz = b.zeilen.reduce((x, z) => x + (typeof z.wert === 'number' ? Math.floor(z.wert / b.je) : 0), 0);
      const halb = b.zeilen.filter((z) => typeof z.wert === 'number' && z.wert % b.je).length;
      assert.equal(svg.klasse('symbol').length, ganz + halb + 1, a.id);
      assert.equal(svg.klasse('halb').length, halb, a.id);
    } else if (b.art === 'schaetzbild') {
      // Kapitel 2: genau so viele Symbole, wie die Felder zusammen nennen. Das feste Raster hat eine Linie je Grenze.
      assert.equal(svg.klasse('symbol').length, b.felder.flat().reduce((x, y) => x + y, 0), a.id);
      if (b.raster === 'fest') assert.equal(svg.klasse('rasterlinien')[0].kinder.length, b.felder.length - 1 + b.felder[0].length - 1, a.id);
      assert.equal(svg.klasse('markiert').length, b.markiert ? 1 : 0, a.id);
    } else if (b.art === 'tafel') {
      // Kapitel 2: je Zeile eine Zelle je Spalte; Ziffern stehen lesbar da, Plättchen sind abgezählt.
      const zeilen = [b.werte, ...(b.weitere ?? [])], zellen = svg.alle().filter((k) => k.tag === 'td');
      assert.equal(zellen.length, zeilen.length * b.spalten.length, a.id);
      zeilen.flat().forEach((w, i) => {
        if (w == null || typeof w === 'object') return;
        if (b.plaettchen) assert.equal(zellen[i].alle().filter((k) => k.tag === 'circle').length, w, `${a.id}: Zelle ${i}`);
        else assert.equal(zellen[i].kinder.join(''), String(w), `${a.id}: Zelle ${i}`);
      });
    } else if (b.art === 'bruch') {
      // Kapitel 9 (ADR 0036): Jede Figur hat so viele Teile und so viele gefärbte Teile wie in der Aufgabe.
      const figuren = svg.klasse('bruchfigur');
      assert.equal(figuren.length, b.figuren.length, a.id);
      b.figuren.forEach((f, i) => {
        const je = f.form === 'rechteck' ? f.reihen * f.spalten : f.form === 'hundert' ? 100 : f.teile;
        assert.equal(figuren[i].klasse('bruchteil').length, je * (f.ganze ?? 1), a.id);
        assert.equal(figuren[i].klasse('voll').length, f.gefaerbt.length, a.id);
        assert.ok(f.gefaerbt.every((nr) => nr >= 0 && nr < je * (f.ganze ?? 1)), a.id);
      });
    } else if (b.art === 'zeichentafel') {
      assert.deepEqual(svg.alle().filter((k) => k.tag === 'th').map((k) => k.kinder.join('')), b.zeichen, a.id);
    } else if (b.art === 'vergleich') {
      const texte = svg.texte().map((t) => t.replace(/\s/g, ''));
      for (const w of [b.oben.wert, b.unten.wert]) assert.ok(texte.some((t) => t.includes(lesbar(w))), `${a.id}: ${lesbar(w)} fehlt in ${texte}`);
      assert.equal(Math.abs(zahl(b.oben.wert) - zahl(b.unten.wert)), zahl(b.unterschied), a.id);
    } else if (b.art === 'gitter') {
      // Kapitel 5: Karolinien, Punkte, Figuren, Linien und gefärbte Kästchen stehen genau so oft im Bild wie in der Aufgabe.
      const g = b;
      assert.equal(svg.klasse('karo').length, g.b + g.h + 2, a.id);
      assert.equal(svg.klasse('punkt').length, g.punkte?.length ?? 0, a.id);
      assert.equal(svg.klasse('figur').length, g.figuren?.length ?? 0, a.id);
      assert.equal(svg.klasse('linie').length, g.linien?.length ?? 0, a.id);
      assert.equal(svg.klasse('zelle').length, g.zellen?.length ?? 0, a.id);
      assert.equal(svg.klasse('zentrum').length, g.zentrum ? 1 : 0, a.id);
      assert.equal(svg.klasse('achse').length, (g.achsen ? 2 : 0) + (g.linien ?? []).filter((l) => l.stil === 'achse').length, a.id);
      for (const p of g.punkte ?? []) if (p.n) assert.ok(svg.texte().includes(p.n), `${a.id}: Punkt ${p.n} ist nicht beschriftet`);
      // Klasse 7 (ADR 0043): Mit ursprung liegt der Nullpunkt im Gitter. Die Achsen tragen dann auch negative Zahlen mit echtem Minuszeichen.
      if (g.achsen && g.ursprung) { const links = g.ursprung[0] - (g.ursprung[0] % 2); assert.ok(svg.texte().includes(`−${links}`), `${a.id}: Achsenzahl −${links} fehlt`); }
      else if (g.achsen) assert.ok(svg.texte().includes(String(g.b)) || g.b % 2 === 1, `${a.id}: Achsenzahl ${g.b} fehlt`);
    } else if (b.art === 'lineal') {
      // Jeder Millimeter hat einen Strich, jeder Zentimeter eine Zahl; die Strecke liegt auf dem Lineal.
      assert.equal(svg.klasse('mm').length, b.lang + 1, a.id);
      assert.equal(svg.klasse('cmzahl').length, Math.floor(b.lang / 10) + 1, a.id);
      assert.ok(b.von >= 0 && b.von < b.bis && b.bis <= b.lang, a.id);
      assert.equal(svg.klasse('strecke').length, 1, a.id);
    } else if (b.art === 'geld') {
      // Kapitel 6 (ADR 0033): jedes Stück genau einmal, Scheine ab 5 €.
      assert.equal(svg.klasse('schein').length + svg.klasse('muenzbild').length, b.stuecke.length, a.id);
      assert.equal(svg.klasse('schein').length, b.stuecke.filter((x) => x >= 500).length, a.id);
    } else if (b.art === 'uhr') {
      assert.equal(svg.klasse('uhr').length, b.uhren.length, a.id);
      assert.equal(svg.klasse('stundenzeiger').length, b.uhren.length, a.id);
      assert.equal(svg.klasse('minutenzeiger').length, b.uhren.length, a.id);
    } else if (b.art === 'waage') {
      assert.equal(svg.klasse('gewichtsstueck').length, b.gewichte.length + (b.linksDazu?.length ?? 0), a.id);
      assert.equal(svg.klasse('wiegegut').length, 1, a.id);
    } else if (b.art === 'karte') {
      assert.equal(svg.klasse('ort').length, b.orte.length, a.id);
      assert.equal(svg.klasse('cmzahl').length, b.lang / 10 + 1, a.id);
      assert.equal(svg.klasse('massstabsleiste').length, b.leiste ? 1 : 0, a.id);
      for (const o of b.orte) assert.ok(svg.texte().includes(o.n), `${a.id}: ${o.n}`);
    } else if (b.art === 'grundriss') {
      assert.equal(svg.klasse('massstabsleiste').length, b.leiste ? 1 : 0, a.id);
      assert.ok(svg.texte().some((t) => t.includes(b.name)), a.id);
    } else if (b.art === 'zeitleiste') {
      assert.equal(svg.klasse('bildfrage').length, 1, a.id);
      assert.equal(svg.texte().filter((t) => t.endsWith(' Uhr')).length, b.punkte.filter((x) => typeof x !== 'object').length, a.id);
    } else if (b.art === 'vergleichsbild') {
      assert.equal(svg.klasse('vergleich-klein').length, 1, a.id);
      assert.equal(svg.klasse('vergleich-gross').length, 1, a.id);
      assert.equal(svg.klasse('hilfslinie').length > 0, Boolean(b.hilfslinien), a.id);
    } else if (b.art === 'thermometer') {
      assert.equal(svg.klasse('glas').length, b.saeulen.length, a.id);
      assert.equal(svg.klasse('stand').length, b.saeulen.length, a.id);
      assert.equal(svg.klasse('name').length, b.saeulen.filter((t) => t.name).length, a.id);
      assert.equal(svg.klasse('skala').filter((k) => k.attribute.class.includes('null')).length, b.saeulen.length, `${a.id}: Die Null ist hervorgehoben`);
      assert.ok(svg.texte().includes('−10') || b.von > -10, `${a.id}: echtes Minuszeichen an der Skala`);
    } else if (b.art === 'lupe') {
      // Zahlenstrahl mit Lupe (ADR 0047): ein Rahmen um den vergrößerten Schritt oben.
      assert.equal(svg.klasse('lupenrahmen').length, 1, a.id);
    } else if (b.art === 'einheitentafel') {
      const zeilen = [b.werte, ...(b.weitere ?? [])], zellen = svg.alle().filter((k) => k.tag === 'td');
      assert.equal(zellen.length, zeilen.length * b.spalten.length, a.id);
    }
  }
  for (const art of BILDARTEN) assert.ok(gezaehlt[art] > 0, `Keine Aufgabe mit Bildart ${art}`);
});

test('Streifenbild: Teile sind nach Größe geordnet breit, und kleine Teile bleiben lesbar', () => {
  const b = teilBreiten([90, 10], 300, 40);
  assert.equal(Math.round(b[0] + b[1]), 300);
  assert.ok(b[0] > b[1] && b[1] >= 40);
  const gleich = teilBreiten([25, 25], 200, 40);
  assert.equal(gleich[0], gleich[1]);
});
