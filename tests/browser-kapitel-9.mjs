// Kapitel 9 (ADR 0036) im echten Browser: Jede der 192 Aufgaben wird im gebauten Schüler-Dashboard (Probeansicht des Aufgabentesters)
// gezeigt und über die Oberfläche gelöst, bei 420 Pixel Breite. Die richtige Lösung muss als richtig gelten, der erste typische Fehler als falsch.
// Aufruf: node tools/baue.mjs && node tests/browser-kapitel-9.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-5.json', wurzel), 'utf8'));
const neun = pool.aufgaben.filter((a) => a.lernziel.startsWith('5.9.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '5.9.1-B1-G-06': 'bruchbild-vier-figuren-G', '5.9.1-B2-M-02': 'teile-faerben-M', '5.9.1-B1-M-02': 'brucheingabe-gemischt-M', '5.9.1-B3-F-04': 'ordnen-F', '5.9.2-T1-G-02': 'bruchteil-G', '5.9.3-K1-G-02': 'stellenwerttafel-komma-G', '5.9.3-K2-F-02': 'zahlenstrahl-F', '5.9.3-K3-G-06': 'einheitentafel-G' };

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
const teileBruch = (text) => { const m = String(text).match(/^(?:(\d+)\D)?(\d+)⁄(\d+)$/); return { g: m[1], z: m[2], n: m[3] }; };
const kreuze = (seite, name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);

async function antworte(seite, auf, falsch = null) {
  const text = (l) => String(l);
  if (auf.format === 'zahl' || (auf.format === 'zahlenstrahl' && auf.eingabe === 'ablesen')) await seite.fill('input[name=zahl]', text(falsch ?? auf.loesung));
  else if (auf.format === 'zahlenstrahl') await seite.click(`svg.zahlenstrahl [data-wert="${falsch ?? auf.loesung}"]`);
  else if (auf.format === 'bruch') {
    const b = teileBruch(falsch ?? auf.loesung);
    if (auf.gemischt) await seite.fill('input[name=bruch-g]', b.g ?? '');
    await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n);
  } else if (auf.format === 'faerben') {
    for (let i = 0; i < (falsch ?? auf.loesung); i++) await seite.click(`svg.bruchbild.eingabe [data-nr="${i}"]`);
  } else if (auf.format === 'auswahl') await kreuze(seite, 'option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, text(l.loesung)); }
  else if (auf.format === 'zuordnen') { for (const p of auf.paare) await seite.selectOption(`select[name="paar-${p.links}"]`, p.rechts); }
  else if (auf.format === 'ordnen') {
    for (const [platz, karte] of auf.loesung.entries()) for (let k = 0; k < auf.karten.length; k++) {
      const i = JSON.parse(await seite.inputValue('input[name=ordnung]')).indexOf(karte);
      if (i <= platz) break;
      await seite.click(`ol.ordnen li:nth-child(${i + 1}) button.links`);
    }
    if (await seite.evaluate(() => document.querySelector('input[name=ordnung]').dataset.bewegt !== '1')) { await seite.click('ol.ordnen li:nth-child(1) button.rechts'); await seite.click('ol.ordnen li:nth-child(2) button.links'); }
  } else if (auf.format === 'sachaufgabe') {
    for (const [i, t] of auf.teile.entries()) { if (t.optionen) await kreuze(seite, `teil-${i}`, t.optionen.filter((o) => o.richtig).map((o) => o.text)); else await seite.fill(`input[name="teil-${i}"]`, text(t.loesung)); }
  } else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  // Nach dem ersten Fehlversuch kommt noch kein Ergebnis, sondern der Hinweis „Das stimmt noch nicht“.
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

const { seite, fehler } = await seiteMit(420);
let falschGeprueft = 0;
for (const auf of neun) {
  await zeige(seite, auf.id);
  // Am Handy ragt nichts über den Bildschirm, und kein Bruch steht mit schrägem Strich im Text.
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  assert.equal(await seite.evaluate(() => { const lauf = document.createTreeWalker(document.querySelector('section.aufgabe'), NodeFilter.SHOW_TEXT); for (let n = lauf.nextNode(); n; n = lauf.nextNode()) if (n.data.includes('⁄') && !n.parentElement.closest('option, svg')) return n.data; return null; }), null, `${auf.id}: Bruch nicht gestapelt`);
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-420.png` });
  assert.equal(await antworte(seite, auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = ['zahl', 'zahlenstrahl', 'bruch', 'faerben'].includes(auf.format) ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(seite, auf.id); assert.equal(await antworte(seite, auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);
// Nach einem Fehler zeigt das Dashboard die Lösung in Worten: am Bruchstrahl die Zahl, nicht die Nummer des Teilstrichs.
const strahl = neun.find((a) => a.format === 'zahlenstrahl' && a.eingabe === 'markieren' && a.strahl.teiler === 10);
await zeige(seite, strahl.id);
const daneben = strahl.loesung === strahl.strahl.von ? strahl.loesung + 1 : strahl.strahl.von;
for (let versuch = 0; versuch < 2; versuch++) { await seite.click(`svg.zahlenstrahl [data-wert="${daneben}"]`); await seite.click('#pruefen'); }
await seite.waitForFunction(() => window.ergebnisse.length > 0);
assert.match(await seite.locator('section.aufgabe').innerText(), new RegExp(`Die Lösung ist: ${Math.floor(strahl.loesung / 10)},${strahl.loesung % 10}`));
if (bilder) {
  const breit = await seiteMit(1200);
  for (const [id, name] of Object.entries(FOTOS)) { await zeige(breit.seite, id); await breit.seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${name}-1200.png` }); }
  assert.deepEqual(breit.fehler, []);
}
await browser.close();
console.log(`Kapitel 9 im Browser in Ordnung: ${neun.length} Aufgaben gelöst, ${falschGeprueft} typische Fehler als falsch erkannt.`);
