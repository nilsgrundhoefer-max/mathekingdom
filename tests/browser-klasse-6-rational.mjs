// Klasse 6, Kapitel 9 „Rationale Zahlen“ (ADR 0059) im echten Browser: Jede der 288 Aufgaben wird im gebauten Schüler-Dashboard
// (Probeansicht des Aufgabentesters) bei 1200 Pixel Breite gezeigt und über die Oberfläche gelöst, denn die Kinder arbeiten am PC.
// Die richtige Lösung gilt als richtig, der erste typische Fehler als falsch. Kein Bild ist breiter als die Karte, keine Beschriftung ragt hinaus,
// kein Bindestrich steht als Minus. Der Knopf „±“ steht an jedem Zahlenfeld und an jeder Brucheingabe.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-rational.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.9.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
// Beispielbilder für Nils: je eine typische Aufgabe der Bilder und Eingaben, die erste passende.
const MUSTER = [
  ['thermometer-F', (a) => a.niveau === 'F' && a.bild?.art === 'thermometer'],
  ['zahlengerade-markieren-F', (a) => a.niveau === 'F' && a.format === 'zahlenstrahl'],
  ['gegenzahl-G', (a) => a.lernziel === '6.9.2-R2' && a.niveau === 'G'],
  ['bruch-mit-vorzeichen-M', (a) => a.niveau === 'M' && a.format === 'bruch'],
  ['ordnen-G', (a) => a.niveau === 'G' && a.format === 'ordnen'],
  ['dazwischen-M', (a) => a.lernziel === '6.9.3-V2' && a.niveau === 'M' && /▢/.test(a.text)],
  ['zunahme-pfeil-F', (a) => a.lernziel === '6.9.4-Z1' && a.niveau === 'F' && a.bild],
  ['kontoauszug-G', (a) => a.lernziel === '6.9.4-Z2' && a.niveau === 'G' && a.daten],
  ['zahlenmauer-E', (a) => a.lernziel === '6.9.5-A1' && a.format === 'tabelle'],
  ['malnehmen-spruenge-E', (a) => a.lernziel === '6.9.6-P1' && a.bild?.art],
];
const FOTOS = Object.fromEntries(MUSTER.map(([name, f]) => [aufgaben.find(f)?.id, name]).filter(([id]) => id));

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
const teileBruch = (text) => { const m = String(text).match(/^(−)?(?:(\d+)\D)?(\d+)⁄(\d+)$/); return { minus: Boolean(m[1]), g: m[2], z: m[3], n: m[4] }; };
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);

async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(falsch ?? auf.loesung));
  else if (auf.format === 'zahlenstrahl') await seite.click(`svg.zahlenstrahl [data-wert="${falsch ?? auf.loesung}"]`);
  else if (auf.format === 'bruch') {
    const b = teileBruch(falsch ?? auf.loesung);
    // Ohne Feld für die Ganzen tippt das Kind eine gemischte Zahl als unechten Bruch.
    if (!auf.gemischt && b.g) { b.z = String(Number(b.g) * Number(b.n) + Number(b.z)); b.g = undefined; }
    if (b.minus) await seite.click('.brucheingabe button.vorzeichen');
    if (auf.gemischt) await seite.fill('input[name=bruch-g]', b.g ?? '');
    await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n);
  } else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
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
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || /Das stimmt noch nicht|Fast richtig/.test(document.querySelector('section.aufgabe')?.innerText ?? ''));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, knoepfe = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  const draussen = await seite.evaluate(() => {
    const karte = document.querySelector('section.aufgabe').getBoundingClientRect(), aus = [];
    for (const el of document.querySelectorAll('section.aufgabe svg, section.aufgabe table')) {
      const r = el.getBoundingClientRect();
      if (r.left < karte.left - 1 || r.right > karte.right + 1) aus.push(`${el.tagName} breiter als die Karte`);
      if (el.tagName.toLowerCase() === 'svg') for (const t of el.querySelectorAll('text')) { const b = t.getBoundingClientRect(); if (b.width && (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1)) aus.push(`„${t.textContent}“ ragt aus dem Bild`); }
    }
    return aus;
  });
  assert.deepEqual(draussen, [], auf.id);
  assert.equal(await seite.evaluate(() => { const lauf = document.createTreeWalker(document.querySelector('section.aufgabe'), NodeFilter.SHOW_TEXT); for (let n = lauf.nextNode(); n; n = lauf.nextNode()) if (/(^|[^\w.])-\d/.test(n.data) && !n.parentElement.closest('.kennung, .aufgabenkennung, code')) return n.data; return null; }), null, `${auf.id}: Bindestrich statt Minuszeichen`);
  if (['zahl', 'bruch'].includes(auf.format)) { assert.ok(await seite.locator('form.antwort button.vorzeichen').count() >= 1, `${auf.id}: Knopf „±“ fehlt`); knoepfe++; }
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-1200.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = ['zahl', 'zahlenstrahl', 'bruch'].includes(auf.format) ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(auf.id); assert.equal(await antworte(auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);
await browser.close();
console.log(`Klasse 6 Kapitel 9 im Browser bei 1200 Pixel: ${aufgaben.length} Aufgaben gelöst, ${falschGeprueft} typische Fehler als falsch erkannt, ${knoepfe} Eingaben mit Knopf „±“.`);
