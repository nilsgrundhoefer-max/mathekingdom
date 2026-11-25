// Klasse 6, Kapitel 3 „Körper“ (ADR 0045) im echten Browser: Jede Aufgabe wird im gebauten Schüler-Dashboard (Probeansicht des Aufgabentesters)
// bei 420 Pixel Breite gezeigt und über die Oberfläche gelöst, auch die Bildkarten und das Färben von Netzen im Gitter.
// Die richtige Lösung gilt als richtig, bei Zahl und Gitter auch der erste typische Fehler als falsch. Nichts ragt über den Bildschirm,
// jedes Körperbild ist da, und 3.2 und 3.3 tragen „Pflicht ab Gold“.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-koerper.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.3.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '6.3.1-Q2-F-01': 'netz-ergaenzen-F', '6.3.2-S2-F-01': 'schraegbild-F', '6.3.3-A1-F-02': 'ansichten-bildkarten-F', '6.3.4-P2-G-01': 'prisma-netz-G',
  '6.3.5-Y1-F-01': 'pyramide-F', '6.3.6-R2-G-01': 'zylindernetz-G', '6.3.8-K1-G-03': 'spielwuerfel-netze-G', '6.3.8-K2-M-03': 'wuerfelbau-M' };

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(e.message));
await seite.addInitScript(() => { window.MK_PROBE = true; window.ergebnisse = []; window.addEventListener('message', (ev) => { if (ev.data?.mkProbeErgebnis) window.ergebnisse.push(ev.data.mkProbeErgebnis); }); });
await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);

const zeige = async (id) => {
  await seite.evaluate((kennung) => { window.ergebnisse.length = 0; window.postMessage({ mkProbe: kennung }, '*'); }, id);
  await seite.waitForSelector(`section.aufgabe[data-aufgabe="${id}"]`);
};
const text = (x) => String(x).replace('.', ',');
// Bildkarten verstecken ihr Eingabefeld; ein Klick auf die Karte setzt es.
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.closest('label').click(); }, [name, richtige]);
const tippe = async (auf, punkt) => {
  const svg = seite.locator('svg.gitterbild.eingabe');
  const ort = await svg.evaluate((el, [x, y, b, h, mitte]) => {
    const blatt = el.querySelector('.blatt'), u = Number(blatt.getAttribute('width')) / b, box = el.getBoundingClientRect(), k = box.width / el.viewBox.baseVal.width;
    return { x: (Number(blatt.getAttribute('x')) + (x + mitte) * u) * k, y: (Number(blatt.getAttribute('y')) + (h - y - mitte) * u) * k };
  }, [punkt[0], punkt[1], auf.gitter.b, auf.gitter.h, auf.eingabe === 'zellen' ? 0.5 : 0]);
  await svg.click({ position: ort });
};

async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', text(falsch ?? auf.loesung));
  else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, text(l.loesung)); }
  else if (auf.format === 'gitter') { for (const p of falsch ?? (auf.eingabe === 'linie' ? auf.beispiel : auf.loesung)) await tippe(auf, p); }
  else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, karten = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  if (auf.bild) assert.equal(await seite.locator('section.aufgabe .bildrahmen svg').count() >= 1, true, `${auf.id}: Bild fehlt`);
  if (auf.optionen?.some((o) => o.bild)) {
    karten++;
    assert.equal(await seite.locator('section.aufgabe .bildkarte').count(), auf.optionen.length, `${auf.id}: Bildkarten fehlen`);
    assert.equal(await seite.locator('section.aufgabe .bildkarte svg').count(), auf.optionen.length, `${auf.id}: Bild auf einer Karte fehlt`);
  }
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-420.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = auf.format === 'gitter' && auf.eingabe !== 'linie' ? auf.typischeFehler?.[0]?.punkte : auf.format === 'zahl' ? auf.typischeFehler?.[0]?.wert : null;
  if (f != null) { await zeige(auf.id); assert.equal(await antworte(auf, f), false, `${auf.id}: Der typische Fehler ${JSON.stringify(f)} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);

// Die Meilensteine 3.2 und 3.3 tragen auf der Tafel „Pflicht ab Gold“.
{
  const k = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const fehlerK = [];
  k.on('pageerror', (e) => fehlerK.push(e.message));
  const karte = async () => {
    await k.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
    await k.fill('#code', '6a-drei');
    await k.click('#demo');
    await k.waitForSelector('.regionen');
    await k.click('[data-kapitel="6.3"]');
    await k.waitForSelector('svg.regionskarte');
    if (await k.locator('#einstieg-ueberspringen').count()) await k.click('#einstieg-ueberspringen');
  };
  await karte();
  assert.equal(await k.locator('svg.regionskarte .meilenstein').count(), 7);
  for (const [n, marke] of [[1, /Pflicht ab Gold/], [2, /Pflicht ab Gold/], [3, null]]) {
    if (n > 1) await karte();
    await k.locator('.meilenstein .stein').nth(n).click();
    if (await k.locator('#einstieg-ueberspringen').count()) await k.click('#einstieg-ueberspringen');
    await k.waitForSelector('.karte.tafel');
    const text = (await k.locator('#niveau-marke').count()) ? await k.innerText('#niveau-marke') : '';
    if (marke) assert.match(text, marke, `Meilenstein ${n + 1}`);
    else assert.doesNotMatch(text, /Pflicht/, `Meilenstein ${n + 1}`);
    if (bilder && n === 1) await k.locator('.karte.tafel').screenshot({ path: `${bilder}/pflicht-ab-gold-420.png` });
  }
  assert.deepEqual(fehlerK, []);
}
await browser.close();
console.log(`Klasse 6 Kapitel 3 im Browser: ${aufgaben.length} Aufgaben gelöst, ${karten} mit Bildkarten, ${falschGeprueft} typische Fehler geprüft.`);
