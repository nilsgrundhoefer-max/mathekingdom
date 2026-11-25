// Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048) im echten Browser: Jede der 240 Aufgaben wird im gebauten Schüler-Dashboard
// (Probeansicht des Aufgabentesters) bei 1200 Pixel Breite gezeigt und über die Oberfläche gelöst, denn die Kinder arbeiten am PC.
// Die richtige Lösung gilt als richtig, bei einer Zahl auch der erste typische Fehler als falsch. Jede Heftaufgabe trägt das Heftband.
// Rechenraster mit Kommaspalte: Kommaspalte, graue Endnullen auf F, Notiz- und Übertragsfelder ohne Bewertung.
// Bei Geld steht nach der Antwort der Satz „Bei Geld schreibt man zwei Stellen nach dem Komma“, und 4,5 zählt wie 4,50.
// Nach zwei Fehlversuchen zeigt eine Division mit Dezimalzahl die schriftliche Division mit dem Satz zum Komma.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-rechnen.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.5.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '6.5.1-A2-F-01': 'kommaraster-F', '6.5.1-A2-G-01': 'kommaraster-notiz-G', '6.5.2-S1-F-01': 'verschiebepfeile-F', '6.5.3-M1-F-02': 'malraster-kommafeld-F',
  '6.5.3-M2-F-01': 'hunderterfeld-F', '6.5.3-M2-M-02': 'ueberschlag-M', '6.5.4-D1-F-02': 'komma-lueckentext-F', '6.5.4-D2-M-01': 'heftaufgabe-M', '6.5.5-V1-F-02': 'punkt-vor-strich-F' };

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
const teileBruch = (text) => { const m = String(text).match(/^(?:(\d+)\D)?(\d+)⁄(\d+)$/); return { g: m[1], z: m[2], n: m[3] }; };
// „0,16̅“: Vor der Periode steht „0,1“, die Periode ist „6“.
const teilePeriode = (text) => { const t = String(text), i = t.search(/\d̅/); return i < 0 ? { vor: t, periode: '' } : { vor: t.slice(0, i), periode: t.slice(i).replace(/̅/g, '') }; };
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);

async function antworte(auf, falsch = null) {
  const text = (l) => String(l);
  if (auf.format === 'zahl' || (auf.format === 'zahlenstrahl' && auf.eingabe === 'ablesen')) await seite.fill('input[name=zahl]', text(falsch ?? auf.loesung));
  else if (auf.format === 'zahlenstrahl') await seite.click(`svg.zahlenstrahl [data-wert="${falsch ?? auf.loesung}"]`);
  else if (auf.format === 'bruch') {
    const b = teileBruch(falsch ?? auf.loesung);
    if (auf.gemischt) await seite.fill('input[name=bruch-g]', b.g ?? '');
    await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n);
  } else if (auf.format === 'periode') {
    const p = teilePeriode(falsch ?? auf.loesung);
    await seite.fill('input[name=periode-vor]', p.vor); await seite.fill('input[name=periode-per]', p.periode);
  } else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, text(l.loesung)); }
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
  // Nach dem ersten Fehlversuch kommt noch kein Ergebnis, sondern der Hinweis „Das stimmt noch nicht“.
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, heft = 0, endnull = 0, raster = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  if (auf.bild) assert.equal(await seite.locator('section.aufgabe .bildrahmen svg, section.aufgabe .bildrahmen table, section.aufgabe .bildrahmen .geld, section.aufgabe .bildrahmen img').count() >= 1, true, `${auf.id}: Bild fehlt`);
  const band = await seite.locator('section.aufgabe #heftband').count();
  assert.equal(band, auf.heftaufgabe ? 1 : 0, `${auf.id}: Heftband ${band ? 'zu viel' : 'fehlt'}`);
  if (band) { heft++; assert.match(await seite.innerText('#heftband'), /Heftaufgabe:\s+Rechne im Heft\. Gib danach nur dein Ergebnis ein\./, auf.id); }
  // Rechenraster mit Kommaspalte: das Komma in eigener Spalte, auf F graue Endnullen, auf G Notizfelder.
  if (auf.tabelle?.komma != null) {
    raster++;
    assert.ok(await seite.locator('section.aufgabe .kommaraster .kommaspalte').count() >= 3, `${auf.id}: Kommaspalte fehlt`);
    if (auf.tabelle.zeilen.flat().some((z) => z?.endnull)) assert.ok(await seite.locator('section.aufgabe .kommaraster .endnull').count() >= 1, `${auf.id}: graue Endnull fehlt`);
    if (auf.tabelle.zeilen.flat().some((z) => z?.notiz)) assert.ok(await seite.locator('section.aufgabe .kommaraster input.uebertrag').count() >= 1, `${auf.id}: Notizfeld fehlt`);
  }
  if (auf.tabelle?.ablesen) assert.ok((await seite.innerText('section.aufgabe')).includes(auf.tabelle.ablesen.text), `${auf.id}: Kommafeld fehlt`);
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-1200.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  if (await seite.locator('#endnull').count()) {
    endnull++;
    assert.match(await seite.innerText('#endnull'), /^Bei Geld schreibt man zwei Stellen nach dem Komma: \d+,\d\d €\.$/, auf.id);
  }
  const f = auf.format === 'zahl' ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(auf.id); assert.equal(await antworte(auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
}
assert.equal(heft, aufgaben.filter((a) => a.heftaufgabe).length);
const geld = aufgaben.filter((a) => a.format === 'zahl' && a.einheit === '€' && /,\d0$/.test(a.loesung));
assert.ok(geld.length >= 3);
assert.equal(endnull, geld.length, 'Satz zu Geld fehlt');

// Bei Geld ist die Endnull nicht verlangt: „4,5“ gilt bei der Lösung „4,50“ als richtig.
{
  const auf = geld[0];
  await zeige(auf.id);
  assert.equal(await antworte(auf, auf.loesung.replace(/0$/, '').replace(/,$/, '')), true, `${auf.id}: ohne Endnull nicht richtig`);
  if (bilder) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/geld-endnull-F-1200.png` });
}
// Zwei Fehlversuche bei einer Division durch eine Dezimalzahl: Das Lösungsbild zeigt die Division nach dem Verschieben, mit dem Satz zum Komma.
{
  const auf = aufgaben.find((a) => a.division?.vorher && typeof a.division.dividend === 'string' && a.format === 'zahl');
  await zeige(auf.id);
  for (let i = 0; i < 2; i++) { await seite.fill('input[name=zahl]', '12345'); await seite.click('#pruefen'); await seite.waitForTimeout(150); }
  await seite.waitForFunction(() => window.ergebnisse.length > 0);
  assert.equal(await seite.locator('#loesungsbild svg, #loesungsbild table').count() >= 1, true, `${auf.id}: Lösungsbild der Division fehlt`);
  const text = await seite.innerText('#loesungsbild');
  assert.ok(text.includes('Verschiebe zuerst das Komma'), `${auf.id}: Satz zum Verschieben fehlt`);
  assert.ok(text.includes('Wenn du das Komma überschreitest, setzt du im Ergebnis das Komma.'), `${auf.id}: Satz zum Komma fehlt`);
  if (bilder) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/division-loesung-G-1200.png` });
}
assert.deepEqual(fehler, []);
await browser.close();
console.log(`Klasse 6 Kapitel 5 im Browser bei 1200 Pixel: ${aufgaben.length} Aufgaben gelöst, ${raster} Raster mit Komma, ${heft} Heftaufgaben mit Heftband, ${endnull} mit Satz zu Geld, ${falschGeprueft} typische Fehler geprüft.`);
