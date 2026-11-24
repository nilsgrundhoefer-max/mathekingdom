// Layoutprüfung für die Bilder eines Kapitels (ADR 0034): Die Aufgaben werden mit den echten Zeichnern des Schüler-Dashboards
// im Browser gezeichnet, bei 420 und bei 1200 Pixel Breite. Geprüft wird, was man im Bild sieht:
// - Beschriftungen überlappen einander nicht und ragen nicht aus dem Bild,
// - Punkt-, Winkel- und Ortsnamen liegen nicht auf einer Linie (Schenkel, Strecke, Breitenkreis im Gradnetz),
//   Maße, Figurnamen und Teilnummern in Kapitel 8 (ADR 0035) liegen nicht auf dem Rand einer Figur,
// - jeder gezeichnete Winkel hat nachgemessen die Größe aus dem Aufgabenpool (auf 0,5° genau).
// Kapitel 9 (ADR 0036) wird mit Text und Eingabe gezeichnet. Dort gilt zusätzlich:
// - jedes Bruchbild hat so viele Teile und so viele gefärbte Teile wie im Aufgabenpool,
// - beim Färben ist jedes Teil groß genug zum Antippen (mindestens 24 Pixel),
// - jeder Bruch im Text steht gestapelt mit waagerechtem Bruchstrich, nichts ragt über die Karte hinaus,
// - ein kurzer Bruchstrahl ist ohne Schieben ganz zu sehen, die Stellenwerttafel mit Komma zeigt ihr Komma.
// Klasse 7 Kapitel 1 (ADR 0043) wird ebenso mit Text, Kontoauszug und Eingabe gezeichnet. Dort gilt zusätzlich:
// - an Zahlengerade, Thermometer und Koordinatensystem überdeckt keine Beschriftung eine andere, nichts ragt über die Karte hinaus.
// Aufruf: node tools/pruefe-layout.mjs [Kapitelanfang, z. B. 5.7.]
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const [anfang = '5.7.'] = process.argv.slice(2);
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL(`aufgabenpool/klasse-${parseInt(anfang, 10)}.json`, wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith(anfang));

const eingang = `
import stil from './src/schueler/stil.css';
import { h } from './src/schueler/dom.js';
import { aufgabenBild } from './src/schueler/aufgabenbilder.js';
import { datenTabelle } from './src/schueler/datenbilder.js';
import { eingabefelder } from './src/schueler/app.js';
window.zeichne = (aufgaben) => {
  document.head.append(h('style', {}, stil));
  const halter = document.getElementById('mathekingdom');
  halter.replaceChildren(...aufgaben.map((auf) => h('section', { class: 'karte', 'data-aufgabe': auf.id },
    /^(5\\.9|6\\.1|7\\.1)\\./.test(auf.lernziel) && auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
    auf.bild && h('div', { class: 'bildrahmen zumtext' }, aufgabenBild(auf.bild)),
    auf.daten && /^7\\.1\\./.test(auf.lernziel) && h('div', { class: 'bildrahmen zumtext' }, datenTabelle(auf.daten)),
    (['winkel', 'gitter'].includes(auf.format) || /^(5\\.9|6\\.1|7\\.1)\\./.test(auf.lernziel)) && h('form', { class: 'antwort' }, eingabefelder(auf, { eingaben: [], reihenfolge: auf.paare?.map((p) => p.rechts) ?? null }, false)))));
};
// Prüft alle Bilder einer Aufgabe und liefert Mängel als Text.
window.pruefe = (soll) => {
  const maengel = [];
  for (const sec of document.querySelectorAll('section[data-aufgabe]')) {
    const id = sec.dataset.aufgabe, auf = soll[id];
    if (/^(5\\.9|6\\.1|7\\.1)\\./.test(auf?.lernziel ?? '')) {
      const karte = sec.getBoundingClientRect();
      // Bruchbilder nachzählen.
      const zaehle = (svg, figuren, was) => {
        const gruppen = [...svg.querySelectorAll('g.bruchfigur')];
        if (gruppen.length !== figuren.length) { maengel.push(id + ': ' + was + ' zeigt ' + gruppen.length + ' statt ' + figuren.length + ' Figuren'); return; }
        figuren.forEach((f, i) => {
          const je = f.form === 'rechteck' ? f.reihen * f.spalten : f.form === 'hundert' ? 100 : f.teile, soll = je * (f.ganze ?? 1);
          const teile = gruppen[i].querySelectorAll('.bruchteil').length, voll = gruppen[i].querySelectorAll('.bruchteil.voll').length;
          if (teile !== soll) maengel.push(id + ': ' + was + ', Figur ' + (f.n ?? i + 1) + ' hat ' + teile + ' statt ' + soll + ' Teile');
          if (voll !== (f.gefaerbt ?? []).length) maengel.push(id + ': ' + was + ', Figur ' + (f.n ?? i + 1) + ' hat ' + voll + ' statt ' + (f.gefaerbt ?? []).length + ' gefärbte Teile');
        });
      };
      if (auf.bild?.art === 'bruch') { const svg = sec.querySelector('.bildrahmen.zumtext svg.bruchbild'); if (svg) zaehle(svg, auf.bild.figuren, 'Bruchbild'); else maengel.push(id + ': Bruchbild fehlt'); }
      if (auf.format === 'faerben') {
        const svg = sec.querySelector('form svg.bruchbild.eingabe');
        if (!svg) maengel.push(id + ': Bild zum Färben fehlt');
        else { zaehle(svg, [{ ...auf.faerben, gefaerbt: [] }], 'Färbebild');
          for (const el of svg.querySelectorAll('.bruchteil')) { const r = el.getBoundingClientRect(); if (Math.min(r.width, r.height) < 24) { maengel.push(id + ': Teil zum Antippen ist nur ' + Math.round(Math.min(r.width, r.height)) + ' Pixel groß'); break; } } }
      }
      if (auf.format === 'bruch' && sec.querySelectorAll('.brucheingabe input:not([type=hidden])').length !== (auf.gemischt ? 3 : 2)) maengel.push(id + ': Brucheingabe hat nicht die erwarteten Felder');
      // Brüche im Text: gestapelt, nie mit schrägem Strich (außer in Auswahllisten).
      const lauf = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
      for (let n = lauf.nextNode(); n; n = lauf.nextNode()) if (n.data.includes('\u2044') && !n.parentElement.closest('option, svg')) { maengel.push(id + ': Bruch „' + n.data.trim() + '“ steht nicht gestapelt'); break; }
      for (const b of sec.querySelectorAll('.bruch')) { const z = b.querySelector('.bz').getBoundingClientRect(), n = b.querySelector('.bn').getBoundingClientRect(); if (!(n.top >= z.bottom - 1)) { maengel.push(id + ': Bruch ' + b.textContent + ' ist nicht gestapelt'); break; } }
      for (const s of sec.querySelectorAll('.bruchsatz, .gemischt')) if (new Set([...s.getClientRects()].filter((r) => r.width > 1).map((r) => Math.round(r.bottom / 8))).size > 1 && Math.max(...[...s.getClientRects()].filter((r) => r.width > 1).map((r) => r.top)) - Math.min(...[...s.getClientRects()].filter((r) => r.width > 1).map((r) => r.top)) > 12) { maengel.push(id + ': Bruch „' + s.textContent + '“ ist umgebrochen'); break; }
      // Nichts ragt aus der Karte (Bilder mit eigenem Schieberahmen ausgenommen).
      for (const el of sec.querySelectorAll('.aufgabentext, .bruch, input, select, label, .brucheingabe, svg.bruchbild, table, .karte-ordnen, button')) {
        if (el.closest('.bildrahmen') && !el.matches('svg.bruchbild')) continue;
        const r = el.getBoundingClientRect(); if (r.width && (r.right > karte.right + 1 || r.left < karte.left - 1)) { maengel.push(id + ': ' + (el.className?.baseVal ?? el.className ?? el.tagName) + ' ragt aus der Karte'); break; }
      }
      for (const svg of sec.querySelectorAll('svg.zahlenstrahl.kurz')) { const rahmen = svg.closest('.bildrahmen'); if (rahmen && rahmen.scrollWidth > rahmen.clientWidth + 1) maengel.push(id + ': kurzer Zahlenstrahl passt nicht in die Breite'); }
      const mitKomma = (auf.bild?.art === 'tafel' && auf.bild.komma != null ? 1 : 0) + (auf.tabelle?.art === 'stellentafel' && auf.tabelle.komma != null ? 1 : 0);
      if (mitKomma && !sec.querySelector('.kommaspalte')) maengel.push(id + ': Stellenwerttafel zeigt kein Komma');
    }
    for (const svg of sec.querySelectorAll('svg')) {
      const rahmen = svg.getBoundingClientRect();
      const texte = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim() && getComputedStyle(t).display !== 'none');
      const kasten = (t) => { const r = t.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, t, k: t.getAttribute('class') ?? '' }; };
      const k = texte.map(kasten);
      const geo = (x) => /geo-|gradzahl|cmwort|mmzahl|lineal/.test(x.k);
      const name = (x) => /punktname|winkelname|ortsname|bildtext|netzname|masszahl|figurname|teilnummer/.test(x.k);
      for (const x of k) if (x.x0 < rahmen.left - 1 || x.x1 > rahmen.right + 1 || x.y0 < rahmen.top - 1 || x.y1 > rahmen.bottom + 1) maengel.push(id + ': „' + x.t.textContent + '“ ragt aus dem Bild');
      const ueber = (a, b, r = 1) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > r && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > r;
      for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) {
        if (geo(k[i]) && geo(k[j])) continue; // Skalen des Geodreiecks und Lineals sind gestaltet
        // Klasse 7 Kapitel 1 (ADR 0043): An Zahlengerade, Thermometer und Koordinatensystem darf keine Beschriftung eine andere überdecken.
        if (!name(k[i]) && !name(k[j]) && !/^7\\.1\\./.test(auf?.lernziel ?? '')) continue;
        if (ueber(k[i], k[j])) maengel.push(id + ': „' + k[i].t.textContent + '“ überdeckt „' + k[j].t.textContent + '“');
      }
      // Namen gegen Linien: Ein Name darf keine Linie schneiden (Schenkel, Strecken, Kreise im Gitter).
      const m = svg.getScreenCTM();
      const P = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
      // Im Gradnetz zählen nur die Breitenkreise (waagerecht); senkrechte Linien verdeckt der helle Rand der Ortsnamen.
      const breitenkreis = (l) => !l.matches('line.gradlinie, line.aequator') || l.getAttribute('y1') === l.getAttribute('y2');
      const linien = [...svg.querySelectorAll('line.schenkel, line.strecke, line.linie, line.radius, line.gradlinie, line.aequator, line.kante')].filter(breitenkreis).map((l) => [P(+l.getAttribute('x1'), +l.getAttribute('y1')), P(+l.getAttribute('x2'), +l.getAttribute('y2'))]);
      const schneidet = (b, [p, q]) => { // Strecke gegen Rechteck (etwas verkleinert)
        const x0 = b.x0 + 2, x1 = b.x1 - 2, y0 = b.y0 + 3, y1 = b.y1 - 3;
        for (let s = 0; s <= 40; s++) { const x = p[0] + (q[0] - p[0]) * s / 40, y = p[1] + (q[1] - p[1]) * s / 40; if (x > x0 && x < x1 && y > y0 && y < y1) return true; }
        return false; };
      for (const x of k.filter((y) => /punktname|winkelname|ortsname|masszahl|figurname|teilnummer/.test(y.k))) if (linien.some((l) => schneidet(x, l))) maengel.push(id + ': „' + x.t.textContent + '“ liegt auf einer Linie');
      // Kapitel 8: Ein Maß steht außen an der Figur, nie auf einer Fläche (außer im weißen Loch).
      const flaechen = [...svg.querySelectorAll('path.flaechenfuell')].map(kasten), loecher = [...svg.querySelectorAll('path.loch')].map(kasten);
      const in_ = (b, x, y) => x > b.x0 + 1 && x < b.x1 - 1 && y > b.y0 + 1 && y < b.y1 - 1;
      for (const x of k.filter((y) => /masszahl/.test(y.k))) { const cx = (x.x0 + x.x1) / 2, cy = (x.y0 + x.y1) / 2;
        if (flaechen.some((f) => in_(f, cx, cy)) && !loecher.some((f) => in_(f, cx, cy))) maengel.push(id + ': Maß „' + x.t.textContent + '“ steht auf der Fläche'); }
      // Winkel nachmessen.
      const bild = auf?.bild?.art === 'winkel' ? auf.bild : null;
      if (bild && svg.closest('.bildrahmen')) bild.winkel.forEach((w, i) => {
        const [l1, l2] = [1, 2].map((n) => svg.querySelector('line.schenkel[data-winkel="' + i + '"][data-schenkel="' + n + '"]'));
        if (!l1 || !l2) { maengel.push(id + ': Winkel ' + (w.n ?? i) + ' fehlt im Bild'); return; }
        const r = (l) => { const a = P(+l.getAttribute('x1'), +l.getAttribute('y1')), b = P(+l.getAttribute('x2'), +l.getAttribute('y2')); return Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI; };
        const gemessen = ((r(l2) - r(l1)) % 360 + 360) % 360 || (w.groesse === 360 ? 360 : 0);
        if (Math.abs(gemessen - w.groesse) > 0.5) maengel.push(id + ': Winkel ' + (w.n ?? i) + ' misst ' + gemessen.toFixed(1) + '° statt ' + w.groesse + '°');
      });
    }
  }
  return maengel;
};`;
const ergebnis = await build({ stdin: { contents: eingang, resolveDir: new URL('.', wurzel).pathname, loader: 'js' }, bundle: true, format: 'iife', write: false,
  loader: { '.css': 'text' }, define: { MK_VERSION: JSON.stringify({ nummer: '0', datum: '', schueler: [], lehrkraft: [] }) }, logLevel: 'warning' });
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const alle = [];
for (const breite of [420, 1200]) {
  const seite = await browser.newPage({ viewport: { width: breite, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.setContent(`<!doctype html><meta charset="utf-8"><body style="margin:0"><div id="mathekingdom" style="padding:8px;box-sizing:border-box;width:${breite}px"></div><script>${ergebnis.outputFiles[0].text}</script>`);
  await seite.evaluate((a) => window.zeichne(a), aufgaben);
  if (fehler.length) throw new Error(fehler.join('\n'));
  const maengel = await seite.evaluate((s) => window.pruefe(s), Object.fromEntries(aufgaben.map((a) => [a.id, a])));
  for (const m of new Set(maengel)) alle.push(`${breite} px · ${m}`);
  await seite.close();
}
await browser.close();
for (const m of alle) console.log(m);
console.log(alle.length ? `${alle.length} Layoutmängel.` : `Layout in Ordnung: ${aufgaben.length} Aufgaben bei 420 und 1200 Pixel Breite.`);
process.exit(alle.length ? 1 : 0);
