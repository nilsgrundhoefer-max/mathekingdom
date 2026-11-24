// Klasse 7, Kapitel 1 „Rationale Zahlen“ (ADR 0043) im echten Browser: Jede Aufgabe wird im gebauten Schüler-Dashboard (Probeansicht des Aufgabentesters)
// gezeigt und über die Oberfläche gelöst, bei 420 Pixel Breite. Die richtige Lösung muss als richtig gelten, der erste typische Fehler als falsch.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-7.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-7.json', wurzel), 'utf8'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '7.1.1-Z1-F-03': 'zahlengerade-markieren-F', '7.1.1-Z1-M-05': 'bruch-mit-vorzeichen-M', '7.1.X1-K1-F-02': 'vier-quadranten-F', '7.1.3-A1-F-01': 'addieren-F', '7.1.3-A1-G-03': 'zahlenmauer-G',
  '7.1.4-S1-M-01': 'subtrahieren-M', '7.1.6-P1-G-01': 'multiplizieren-G', '7.1.8-T1-E-01': 'verbindung-E', '7.1.X3-C1-F-01': 'thermometer-F', '7.1.X4-B1-G-01': 'kontoauszug-G', '7.1.X4-B1-M-01': 'soll-haben-M' };

const browser = await chromium.launch();
const seiteMit = async (breite) => {
  const seite = await browser.newPage({ viewport: { width: breite, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.addInitScript(() => { window.MK_PROBE = true; window.ergebnisse = []; window.addEventListener('message', (ev) => { if (ev.data?.mkProbeErgebnis) window.ergebnisse.push(ev.data.mkProbeErgebnis); }); });
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  return { seite, fehler };
};
const zeige = async (seite, id) => {
  await seite.evaluate((kennung) => { window.ergebnisse.length = 0; window.postMessage({ mkProbe: kennung }, '*'); }, id);
  await seite.waitForSelector(`section.aufgabe[data-aufgabe="${id}"]`);
};
const teileBruch = (text) => { const m = String(text).match(/^(−)?(?:(\d+)\D)?(\d+)⁄(\d+)$/); return { minus: Boolean(m[1]), g: m[2], z: m[3], n: m[4] }; };
const kreuze = (seite, name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);
// Ein Punkt im Koordinatensystem mit vier Quadranten: Die Stelle im Bild folgt aus dem Blatt und dem Ursprung in der Mitte.
const tippe = async (seite, auf, punkt) => {
  const svg = seite.locator('svg.gitterbild.eingabe');
  const ort = await svg.evaluate((el, [x, y, b, h]) => {
    const blatt = el.querySelector('.blatt'), u = Number(blatt.getAttribute('width')) / b, box = el.getBoundingClientRect(), k = box.width / el.viewBox.baseVal.width;
    return { x: (Number(blatt.getAttribute('x')) + x * u) * k, y: (Number(blatt.getAttribute('y')) + (h - y) * u) * k };
  }, [punkt[0] + auf.gitter.ursprung[0], punkt[1] + auf.gitter.ursprung[1], auf.gitter.b, auf.gitter.h]);
  await svg.click({ position: ort });
};

async function antworte(seite, auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(falsch ?? auf.loesung));
  else if (auf.format === 'zahlenstrahl') await seite.click(`svg.zahlenstrahl [data-wert="${falsch ?? auf.loesung}"]`);
  else if (auf.format === 'bruch') {
    const b = teileBruch(falsch ?? auf.loesung);
    if (b.minus) await seite.click('.brucheingabe button.vorzeichen');
    if (auf.gemischt) await seite.fill('input[name=bruch-g]', b.g ?? '');
    await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n);
  } else if (auf.format === 'gitter') { for (const p of falsch ?? auf.loesung) await tippe(seite, auf, p); }
  else if (auf.format === 'auswahl') await kreuze(seite, 'option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, String(l.loesung)); }
  else if (auf.format === 'zuordnen') { for (const p of auf.paare) await seite.selectOption(`select[name="paar-${p.links}"]`, p.rechts); }
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

const { seite, fehler } = await seiteMit(420);
let falschGeprueft = 0;
for (const auf of pool.aufgaben) {
  await zeige(seite, auf.id);
  // Am Handy ragt nichts über den Bildschirm, kein Bruch steht mit schrägem Strich im Text, und nirgends steht ein Bindestrich als Minus.
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  assert.equal(await seite.evaluate(() => { const lauf = document.createTreeWalker(document.querySelector('section.aufgabe'), NodeFilter.SHOW_TEXT); for (let n = lauf.nextNode(); n; n = lauf.nextNode()) if (n.data.includes('⁄') && !n.parentElement.closest('option, svg')) return n.data; return null; }), null, `${auf.id}: Bruch nicht gestapelt`);
  assert.equal(await seite.evaluate(() => { const lauf = document.createTreeWalker(document.querySelector('section.aufgabe'), NodeFilter.SHOW_TEXT); for (let n = lauf.nextNode(); n; n = lauf.nextNode()) if (/(^|[^\w.])-\d/.test(n.data) && !n.parentElement.closest('.kennung, .aufgabenkennung, code')) return n.data; return null; }), null, `${auf.id}: Bindestrich statt Minuszeichen im Bild`);
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-420.png` });
  assert.equal(await antworte(seite, auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = ['zahl', 'zahlenstrahl', 'bruch'].includes(auf.format) ? auf.typischeFehler?.[0] : auf.format === 'gitter' && auf.typischeFehler?.[0] ? { wert: auf.typischeFehler[0].punkte } : null;
  if (f) { await zeige(seite, auf.id); assert.equal(await antworte(seite, auf, f.wert), false, `${auf.id}: Der typische Fehler ${JSON.stringify(f.wert)} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);
// Der Knopf „±“ setzt das Minus vor die Zahl und nimmt es wieder weg. Getippt gilt auch der Bindestrich.
const negativ = pool.aufgaben.find((a) => a.format === 'zahl' && typeof a.loesung === 'number' && a.loesung < 0);
await zeige(seite, negativ.id);
await seite.fill('input[name=zahl]', String(-negativ.loesung));
await seite.click('form.antwort button.vorzeichen');
assert.equal(await seite.inputValue('input[name=zahl]'), `−${-negativ.loesung}`);
await seite.click('form.antwort button.vorzeichen');
assert.equal(await seite.inputValue('input[name=zahl]'), String(-negativ.loesung));
await seite.fill('input[name=zahl]', `-${-negativ.loesung}`);
await seite.click('#pruefen');
await seite.waitForFunction(() => window.ergebnisse.length > 0);
assert.equal(await seite.evaluate(() => window.ergebnisse.at(-1).richtig), true, 'der getippte Bindestrich gilt als Minus');
// Nach der Aufgabe zeigt die Lösung das echte Minuszeichen.
assert.match(await seite.innerText('section.aufgabe'), new RegExp(`−${-negativ.loesung}`));
if (bilder) {
  const breit = await seiteMit(1200);
  for (const [id, name] of Object.entries(FOTOS)) { await zeige(breit.seite, id); await breit.seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${name}-1200.png` }); }
  assert.deepEqual(breit.fehler, []);
}
// Ein Schüler der Klasse 7 sieht nur das Tor der Klasse 7. Die Karte hat 8 Meilensteine und 4 Abstecher.
{
  const seite = await browser.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
  const fehlerK = [];
  seite.on('pageerror', (e) => fehlerK.push(e.message));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '7a-eins');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.locator('[data-kapitel^="5."], [data-kapitel^="6."]').count(), 0, 'eine Klasse 7 sieht keine Tore der Klassen 5 und 6');
  if (bilder) await seite.screenshot({ path: `${bilder}/schlossgarten-klasse-7-420.png`, fullPage: true });
  await seite.click('[data-kapitel="7.1"]');
  await seite.waitForSelector('svg.regionskarte');
  if (await seite.locator('#einstieg-ueberspringen').count()) await seite.click('#einstieg-ueberspringen');
  assert.equal(await seite.locator('svg.regionskarte .meilenstein').count(), 12);
  assert.equal(await seite.locator('svg.regionskarte path.abstecher').count(), 4);
  assert.deepEqual(await seite.locator('svg.regionskarte .steinnummer').allTextContents(), ['1', '2', '3', '4', '5', '6', '7', '8']);
  if (bilder) await seite.locator('.kartenrahmen').screenshot({ path: `${bilder}/regionskarte-klasse-7-420.png` });
  await seite.locator('.meilenstein .stein').nth(0).click();
  if (await seite.locator('#einstieg-ueberspringen').count()) await seite.click('#einstieg-ueberspringen');
  await seite.click('.kronenwahl button[data-krone="G"]');
  await seite.locator('.lernziele li').nth(0).locator('button').click();
  await seite.waitForSelector('section.aufgabe #pruefen');
  assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^7\.1\.1-Z1-G-/);
  assert.deepEqual(fehlerK, []);
}
await browser.close();
console.log(`Klasse 7 im Browser in Ordnung: ${pool.aufgaben.length} Aufgaben gelöst, ${falschGeprueft} typische Fehler als falsch erkannt, der Knopf „±“ und die Karte mit 8 Meilensteinen und 4 Abstechern geprüft.`);
