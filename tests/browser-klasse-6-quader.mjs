// Klasse 6, Kapitel 6 „Berechnungen am Quader“ (ADR 0049) im echten Browser: Jede der 240 Aufgaben wird im gebauten Schüler-Dashboard
// (Probeansicht des Aufgabentesters) bei 1200 Pixel Breite gezeigt und über die Oberfläche gelöst, denn die Kinder arbeiten am PC.
// Die richtige Lösung gilt als richtig, bei Zahl und Größe auch der erste typische Fehler als falsch. Jede Heftaufgabe trägt das Heftband.
// Größen: Ab G wählt das Kind die Einheit. Ist eine Einheit verlangt, gibt der richtige Wert in einer anderen Einheit den Hinweis „Fast richtig“.
// Kein Bild ragt aus seinem Rahmen, und kein Maß im Körperbild liegt außerhalb der Zeichnung.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-quader.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { schreibe, artVon, inGrundeinheit } from '../src/schueler/groessen.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.6.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '6.6.1-O1-F-02': 'netz-tabelle-F', '6.6.1-O2-F-04': 'netz-flaechen-F', '6.6.2-W1-F-05': 'bildkarten-wuerfel-F', '6.6.2-W2-G-03': 'bildkarten-quader-G',
  '6.6.3-U1-F-02': 'einheitentafel-F', '6.6.4-V1-F-01': 'quader-aus-wuerfeln-F', '6.6.4-V2-M-02': 'heftaufgabe-M', '6.6.5-Z1-F-01': 'zerlegt-F', '6.6.5-Z1-M-01': 'l-form-M',
  '6.6.5-Z1-E-01': 'loch-E', '6.6.5-Z1-M-04': 'treppe-M', '6.6.5-Z2-F-01': 'quadrate-aussen-F' };

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(e.message));
await seite.addInitScript(() => { window.MK_PROBE = true; window.ergebnisse = []; window.addEventListener('message', (ev) => { if (ev.data?.mkProbeErgebnis) window.ergebnisse.push(ev.data.mkProbeErgebnis); }); });
await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);

const zeige = async (id) => {
  await seite.evaluate((kennung) => { window.ergebnisse.length = 0; window.postMessage({ mkProbe: kennung }, '*'); }, id);
  await seite.waitForSelector(`section.aufgabe[data-aufgabe="${id}"]`);
};
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);
const groesse = async (auf, wert, einheit = auf.einheit) => {
  const [zahl, e] = schreibe(wert, einheit, true).split(/\s(?=\S+$)/);
  await seite.fill('input[name=zahl]', zahl); if (auf.einheiten) await seite.selectOption('select[name=einheit]', e);
};
async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(falsch ?? auf.loesung));
  else if (auf.format === 'groesse') await groesse(auf, falsch ?? auf.loesung);
  else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, String(l.loesung)); }
  else if (auf.format === 'ordnen') {
    for (const [platz, karte] of auf.loesung.entries()) for (let k = 0; k < auf.karten.length; k++) {
      const i = JSON.parse(await seite.inputValue('input[name=ordnung]')).indexOf(karte);
      if (i <= platz) break;
      await seite.click(`ol.ordnen li:nth-child(${i + 1}) button.links`);
    }
    if (await seite.evaluate(() => document.querySelector('input[name=ordnung]').dataset.bewegt !== '1')) { await seite.click('ol.ordnen li:nth-child(1) button.rechts'); await seite.click('ol.ordnen li:nth-child(2) button.links'); }
  } else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || /Das stimmt noch nicht|Fast richtig/.test(document.querySelector('section.aufgabe')?.innerText ?? ''));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, heft = 0, mitBild = 0, fast = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  if (auf.bild) {
    mitBild++;
    assert.ok(await seite.locator('section.aufgabe .bildrahmen svg, section.aufgabe .bildrahmen table').count() >= 1, `${auf.id}: Bild fehlt`);
    // Kein Maß und keine Kante ragt aus der Zeichnung, und das Bild passt in die Karte.
    const draussen = await seite.evaluate(() => {
      const karte = document.querySelector('section.aufgabe').getBoundingClientRect(), aus = [];
      for (const svg of document.querySelectorAll('section.aufgabe .bildrahmen svg')) {
        const r = svg.getBoundingClientRect();
        if (r.left < karte.left - 1 || r.right > karte.right + 1) aus.push('Bild breiter als die Karte');
        for (const t of svg.querySelectorAll('text')) { const b = t.getBoundingClientRect(); if (b.width && (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1)) aus.push(`„${t.textContent}“ ragt aus dem Bild`); }
      }
      return aus;
    });
    assert.deepEqual(draussen, [], auf.id);
  }
  const band = await seite.locator('section.aufgabe #heftband').count();
  assert.equal(band, auf.heftaufgabe ? 1 : 0, `${auf.id}: Heftband ${band ? 'zu viel' : 'fehlt'}`);
  if (band) heft++;
  if (auf.format === 'groesse') assert.equal(await seite.locator('section.aufgabe select[name=einheit]').count(), auf.einheiten ? 1 : 0, `${auf.id}: Einheitenwahl`);
  if (auf.format === 'auswahl' && auf.optionen.some((o) => o.bild)) assert.equal(await seite.locator('section.aufgabe form.antwort .optionen svg').count(), auf.optionen.length, `${auf.id}: Bildkarten`);
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-1200.png` });
  // Verlangte Einheit: erst der richtige Wert in einer anderen Einheit, das gibt „Fast richtig“ und kein Ergebnis.
  if (auf.format === 'groesse' && auf.verlangt) {
    const andere = auf.einheiten.find((e) => e !== auf.einheit && artVon(e) === auf.groesse && inGrundeinheit(schreibe(auf.loesung, e, true).split(/\s(?=\S+$)/)[0], e) === auf.loesung);
    if (andere) {
      await groesse(auf, auf.loesung, andere);
      await seite.click('#pruefen');
      await seite.waitForFunction(() => document.querySelector('section.aufgabe')?.innerText.includes('Fast richtig'));
      assert.equal(await seite.evaluate(() => window.ergebnisse.length), 0, `${auf.id}: „Fast richtig“ hat einen Versuch gekostet`);
      if (bilder && !fast) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/fast-richtig-einheit-M-1200.png` });
      fast++;
    }
  }
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = ['zahl', 'groesse'].includes(auf.format) ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(auf.id); assert.equal(await antworte(auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
}
assert.equal(heft, aufgaben.filter((a) => a.heftaufgabe).length);
assert.ok(fast >= 5, `nur ${fast} Aufgaben mit „Fast richtig“ geprüft`);

// cm² statt cm³: Die Rückmeldung nennt die Einheitenart.
{
  const auf = aufgaben.find((a) => a.format === 'groesse' && a.groesse === 'volumen' && a.einheiten?.includes('cm²') && a.einheit === 'cm³');
  await zeige(auf.id);
  await seite.fill('input[name=zahl]', schreibe(auf.loesung, 'cm³', true).split(/\s(?=\S+$)/)[0]);
  await seite.selectOption('select[name=einheit]', 'cm²');
  await seite.click('#pruefen');
  await seite.waitForFunction(() => document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
  if (bilder) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/einheit-art-G-1200.png` });
}
assert.deepEqual(fehler, []);
await browser.close();
console.log(`Klasse 6 Kapitel 6 im Browser bei 1200 Pixel: ${aufgaben.length} Aufgaben gelöst, ${mitBild} mit Bild, ${heft} Heftaufgaben mit Heftband, ${fast} mit „Fast richtig“ bei der Einheit, ${falschGeprueft} typische Fehler geprüft.`);
