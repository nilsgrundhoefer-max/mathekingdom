// Klasse 7, Kapitel 2 „Dreiecke“ (ADR 0044) im echten Browser: Jede Aufgabe wird im gebauten Schüler-Dashboard (Probeansicht des Aufgabentesters)
// bei 420 Pixel Breite gezeigt und über die Oberfläche gelöst. Die richtige Lösung gilt als richtig, beim Gitter auch der erste typische Fehler als falsch.
// Dazu: Nichts ragt über den Bildschirm, jede Figur ist da, die Ordnen-Karten mit Sätzen stehen untereinander, und 2.1 und 2.5 tragen „Pflicht ab Gold“.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-7-dreiecke.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-7.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('7.2.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '7.2.1-W2-F-01': 'parallelen-F', '7.2.2-S1-G-01': 'winkelsumme-G', '7.2.3-D2-G-01': 'gleichschenklig-G', '7.2.4-K2-F-01': 'zirkelboegen-F',
  '7.2.4-K2-F-02': 'schritte-ordnen-F', '7.2.4-K2-G-03': 'heftaufgabe-G', '7.2.5-T1-F-01': 'thales-F', '7.2.6-H2-F-01': 'hoehe-stumpf-F', '7.2.7-O1-F-02': 'mittelsenkrechte-F', '7.2.X1-T1-E-02': 'tangente-E' };

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
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);
const tippe = async (auf, punkt) => {
  const svg = seite.locator('svg.gitterbild.eingabe');
  const ort = await svg.evaluate((el, [x, y, h]) => {
    const blatt = el.querySelector('.blatt'), u = Number(blatt.getAttribute('height')) / h, box = el.getBoundingClientRect(), k = box.width / el.viewBox.baseVal.width;
    return { x: (Number(blatt.getAttribute('x')) + x * u) * k, y: (Number(blatt.getAttribute('y')) + (h - y) * u) * k };
  }, [punkt[0], punkt[1], auf.gitter.h]);
  await svg.click({ position: ort });
};

async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', text(falsch ?? auf.loesung));
  else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, text(l.loesung)); }
  else if (auf.format === 'sachaufgabe') {
    for (const [i, t] of auf.teile.entries()) { if (t.optionen) await kreuze(`teil-${i}`, t.optionen.filter((o) => o.richtig).map((o) => o.text)); else await seite.fill(`input[name="teil-${i}"]`, text(t.loesung)); }
  } else if (auf.format === 'gitter') { for (const p of falsch ?? (auf.eingabe === 'punkte' ? auf.loesung : auf.beispiel)) await tippe(auf, p); }
  else if (auf.format === 'ordnen') {
    for (const [platz, karte] of auf.loesung.entries()) for (let k = 0; k < auf.karten.length; k++) {
      const i = JSON.parse(await seite.inputValue('input[name=ordnung]')).indexOf(karte);
      if (i <= platz) break;
      await seite.click(`ol.ordnen li:nth-child(${i + 1}) button.links`);
    }
    if (await seite.evaluate(() => document.querySelector('input[name=ordnung]').dataset.bewegt !== '1')) { await seite.click('ol.ordnen li:nth-child(1) button.rechts'); await seite.click('ol.ordnen li:nth-child(2) button.links'); }
  } else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  // Version 0.59: Den Knopf „±“ gibt es nur in Kapitel 1. Hier tippt das Kind ein Minus selbst.
  assert.equal(await seite.locator('button.vorzeichen').count(), 0, `${auf.id}: kein Vorzeichenknopf außerhalb von Kapitel 1`);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  if (auf.bild?.art === 'figur') assert.equal(await seite.locator('section.aufgabe svg.figurbild').count(), 1, `${auf.id}: Figur fehlt`);
  if (auf.format === 'ordnen' && auf.karten.some((k) => k.length > 24)) {
    assert.equal(await seite.locator('ol.ordnen.saetze').count(), 1, `${auf.id}: Sätze stehen nicht untereinander`);
    assert.ok(await seite.evaluate(() => [...document.querySelectorAll('ol.ordnen li')].every((li) => li.scrollWidth <= li.clientWidth + 1)), `${auf.id}: Karte ragt hinaus`);
  }
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-420.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = auf.format === 'gitter' && auf.eingabe === 'punkte' ? auf.typischeFehler?.[0]?.punkte : auf.format === 'zahl' ? auf.typischeFehler?.[0]?.wert : null;
  if (f != null) { await zeige(auf.id); assert.equal(await antworte(auf, f), false, `${auf.id}: Der typische Fehler ${JSON.stringify(f)} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);

// Die Meilensteine 2.1 und 2.5 tragen auf der Tafel „Pflicht ab Gold“. Mit Zielniveau Silber sind sie ein Abstecher, mit Aufgaben auf Silber.
{
  const k = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const fehlerK = [];
  k.on('pageerror', (e) => fehlerK.push(e.message));
  await k.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await k.fill('#code', '7a-zwei');
  await k.click('#demo');
  await k.waitForSelector('.regionen');
  await k.click('[data-kapitel="7.2"]');
  await k.waitForSelector('svg.regionskarte');
  if (await k.locator('#einstieg-ueberspringen').count()) await k.click('#einstieg-ueberspringen');
  assert.equal(await k.locator('svg.regionskarte .meilenstein').count(), 10);
  assert.equal(await k.locator('svg.regionskarte path.abstecher').count(), 3);
  await k.locator('.meilenstein .stein').nth(0).click();
  if (await k.locator('#einstieg-ueberspringen').count()) await k.click('#einstieg-ueberspringen');
  assert.match(await k.innerText('#niveau-marke'), /Pflicht ab Gold/);
  if (bilder) await k.locator('.karte.tafel').screenshot({ path: `${bilder}/pflicht-ab-gold-420.png` });
  assert.deepEqual(fehlerK, []);
}
await browser.close();
console.log(`Klasse 7 Kapitel 2 im Browser: ${aufgaben.length} Aufgaben gelöst, ${falschGeprueft} typische Fehler geprüft.`);
