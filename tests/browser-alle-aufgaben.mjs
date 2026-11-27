// Fester Browsertest über alle Aufgaben (Version 0.66, ADR 0057): Jede Aufgabe der Klassen 5 bis 7 wird im gebauten
// Schüler-Dashboard gezeigt, in der Prüfgröße 1366 × 650 Pixel (Schul-Notebook mit Browserleisten). Geprüft wird:
// - „Prüfen“ ist ohne Scrollen ganz zu sehen,
// - die Seite ist nicht breiter als das Fenster,
// - ein Bild in der linken Spalte ist nicht höher als das Fenster,
// - kein Zahlenfeld in einem Lückentext ist schmaler als drei Ziffern,
// - beim Zeichnen der Aufgabe tritt kein Programmfehler auf.
// Aufruf: node tools/baue.mjs && node tests/browser-alle-aufgaben.mjs [Anfang der Kennung, z. B. 5.7.]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const BREITE = 1366, HOEHE = 650;
const [anfang = ''] = process.argv.slice(2);
const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const kennungen = [5, 6, 7].flatMap((n) => JSON.parse(readFileSync(new URL(`aufgabenpool/klasse-${n}.json`, wurzel), 'utf8')).aufgaben.map((a) => a.id)).filter((id) => id.startsWith(anfang));

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(e.message));
await seite.addInitScript(() => { window.MK_PROBE = true; });
await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
await seite.waitForFunction(() => document.getElementById('mathekingdom')?.classList.contains('probe'));

const maengel = [];
for (const id of kennungen) {
  const vorher = fehler.length;
  const m = await seite.evaluate(async (kennung) => {
    window.scrollTo(0, 0);
    window.postMessage({ mkProbe: kennung }, '*');
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const karte = document.querySelector(`section.aufgabe[data-aufgabe="${kennung}"]`);
    if (!karte) return ['wird nicht gezeigt'];
    const funde = [];
    const knopf = document.querySelector('#pruefen')?.getBoundingClientRect();
    if (!knopf) funde.push('„Prüfen“ fehlt');
    else if (knopf.bottom > innerHeight || knopf.top < 0) funde.push(`„Prüfen“ liegt bei ${Math.round(knopf.bottom)} Pixel und damit unter dem Fensterrand`);
    if (document.documentElement.scrollWidth > innerWidth) funde.push(`Seite ist ${document.documentElement.scrollWidth - innerWidth} Pixel zu breit`);
    for (const bild of karte.querySelectorAll('.zs-bild svg')) { const r = bild.getBoundingClientRect(); if (r.height > innerHeight) funde.push(`Bild in der linken Spalte ist ${Math.round(r.height)} Pixel hoch`); }
    for (const feld of karte.querySelectorAll('.luecken .zahlfeld input')) {
      const st = getComputedStyle(feld), innen = feld.clientWidth - parseFloat(st.paddingLeft) - parseFloat(st.paddingRight);
      const probe = document.createElement('span'); probe.textContent = '888'; probe.style.cssText = `font:${st.font};position:absolute;visibility:hidden`; document.body.append(probe);
      const drei = probe.getBoundingClientRect().width; probe.remove();
      if (innen < drei) { funde.push(`Lückenfeld ist mit ${Math.round(innen)} Pixel schmaler als drei Ziffern (${Math.round(drei)} Pixel)`); break; }
    }
    return funde;
  }, id);
  for (const f of m) maengel.push(`${id}: ${f}`);
  for (const f of fehler.slice(vorher)) maengel.push(`${id}: Programmfehler: ${f}`);
}
await browser.close();
for (const m of maengel.slice(0, 60)) console.log(m);
if (maengel.length > 60) console.log(`… und ${maengel.length - 60} weitere`);
console.log(maengel.length ? `${maengel.length} Mängel bei ${BREITE} × ${HOEHE} Pixel.` : `In Ordnung: ${kennungen.length} Aufgaben bei ${BREITE} × ${HOEHE} Pixel, „Prüfen“ ist überall ohne Scrollen zu sehen.`);
process.exit(maengel.length ? 1 : 0);
