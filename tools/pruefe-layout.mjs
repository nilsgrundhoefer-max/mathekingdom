// Layoutprüfung für die Bilder eines Kapitels (ADR 0034): Die Aufgaben werden mit den echten Zeichnern des Schüler-Dashboards
// im Browser gezeichnet, bei 420 und bei 1200 Pixel Breite. Geprüft wird, was man im Bild sieht:
// - Beschriftungen überlappen einander nicht und ragen nicht aus dem Bild,
// - Punkt-, Winkel- und Ortsnamen liegen nicht auf einer Linie (Schenkel, Strecke, Breitenkreis im Gradnetz),
// - jeder gezeichnete Winkel hat nachgemessen die Größe aus dem Aufgabenpool (auf 0,5° genau).
// Aufruf: node tools/pruefe-layout.mjs [Kapitelanfang, z. B. 5.7.]
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const [anfang = '5.7.'] = process.argv.slice(2);
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-5.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith(anfang));

const eingang = `
import stil from './src/schueler/stil.css';
import { h } from './src/schueler/dom.js';
import { aufgabenBild } from './src/schueler/aufgabenbilder.js';
import { eingabefelder } from './src/schueler/app.js';
window.zeichne = (aufgaben) => {
  document.head.append(h('style', {}, stil));
  const halter = document.getElementById('mathekingdom');
  halter.replaceChildren(...aufgaben.map((auf) => h('section', { class: 'karte', 'data-aufgabe': auf.id },
    auf.bild && h('div', { class: 'bildrahmen zumtext' }, aufgabenBild(auf.bild)),
    ['winkel', 'gitter'].includes(auf.format) && h('form', { class: 'antwort' }, eingabefelder(auf, { eingaben: [] }, false)))));
};
// Prüft alle Bilder einer Aufgabe und liefert Mängel als Text.
window.pruefe = (soll) => {
  const maengel = [];
  for (const sec of document.querySelectorAll('section[data-aufgabe]')) {
    const id = sec.dataset.aufgabe, auf = soll[id];
    for (const svg of sec.querySelectorAll('svg')) {
      const rahmen = svg.getBoundingClientRect();
      const texte = [...svg.querySelectorAll('text')].filter((t) => t.textContent.trim() && getComputedStyle(t).display !== 'none');
      const kasten = (t) => { const r = t.getBoundingClientRect(); return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom, t, k: t.getAttribute('class') ?? '' }; };
      const k = texte.map(kasten);
      const geo = (x) => /geo-|gradzahl|cmwort|mmzahl|lineal/.test(x.k);
      const name = (x) => /punktname|winkelname|ortsname|bildtext|netzname/.test(x.k);
      for (const x of k) if (x.x0 < rahmen.left - 1 || x.x1 > rahmen.right + 1 || x.y0 < rahmen.top - 1 || x.y1 > rahmen.bottom + 1) maengel.push(id + ': „' + x.t.textContent + '“ ragt aus dem Bild');
      const ueber = (a, b, r = 1) => Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) > r && Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) > r;
      for (let i = 0; i < k.length; i++) for (let j = i + 1; j < k.length; j++) {
        if (geo(k[i]) && geo(k[j])) continue; // Skalen des Geodreiecks und Lineals sind gestaltet
        if (!name(k[i]) && !name(k[j])) continue;
        if (ueber(k[i], k[j])) maengel.push(id + ': „' + k[i].t.textContent + '“ überdeckt „' + k[j].t.textContent + '“');
      }
      // Namen gegen Linien: Ein Name darf keine Linie schneiden (Schenkel, Strecken, Kreise im Gitter).
      const m = svg.getScreenCTM();
      const P = (x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(m); return [q.x, q.y]; };
      // Im Gradnetz zählen nur die Breitenkreise (waagerecht); senkrechte Linien verdeckt der helle Rand der Ortsnamen.
      const breitenkreis = (l) => !l.matches('line.gradlinie, line.aequator') || l.getAttribute('y1') === l.getAttribute('y2');
      const linien = [...svg.querySelectorAll('line.schenkel, line.strecke, line.linie, line.radius, line.gradlinie, line.aequator')].filter(breitenkreis).map((l) => [P(+l.getAttribute('x1'), +l.getAttribute('y1')), P(+l.getAttribute('x2'), +l.getAttribute('y2'))]);
      const schneidet = (b, [p, q]) => { // Strecke gegen Rechteck (etwas verkleinert)
        const x0 = b.x0 + 2, x1 = b.x1 - 2, y0 = b.y0 + 3, y1 = b.y1 - 3;
        for (let s = 0; s <= 40; s++) { const x = p[0] + (q[0] - p[0]) * s / 40, y = p[1] + (q[1] - p[1]) * s / 40; if (x > x0 && x < x1 && y > y0 && y < y1) return true; }
        return false; };
      for (const x of k.filter((y) => /punktname|winkelname|ortsname/.test(y.k))) if (linien.some((l) => schneidet(x, l))) maengel.push(id + ': „' + x.t.textContent + '“ liegt auf einer Linie');
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
