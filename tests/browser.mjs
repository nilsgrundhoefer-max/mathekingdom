// Fährt das gebaute Schüler-Dashboard in einem echten Browser durch.
// Aufruf: node tools/baue.mjs && node tests/browser.mjs   (braucht Playwright)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const wurzel = new URL('../', import.meta.url);
const bilder = process.env.BILDER; // optional: Ordner für Bildschirmfotos
if (bilder) mkdirSync(bilder, { recursive: true });

const server = createServer((req, res) => {
  try {
    const pfad = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    res.setHeader('content-type', pfad.endsWith('.html') ? 'text/html; charset=utf-8' : pfad.endsWith('.js') ? 'text/javascript' : 'application/json');
    res.end(readFileSync(new URL(pfad, wurzel)));
  } catch { res.statusCode = 404; res.end(); }
}).listen(0);
const basis = `http://localhost:${server.address().port}/`;
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-5.json', wurzel), 'utf8'));
const browser = await chromium.launch();
let nr = 0;
const foto = async (seite, name) => { if (bilder) await seite.screenshot({ path: `${bilder}/${String(++nr).padStart(2, '0')}-${name}.png`, fullPage: true }); };

// Der Klassenordner wird im Test durch einen Ordner im privaten Browser-Dateisystem ersetzt.
const ordnerErsatz = (name) => `
  window.showDirectoryPicker = async () => (await navigator.storage.getDirectory()).getDirectoryHandle(${JSON.stringify(name)}, { create: true });`;

// Löst die gerade angezeigte Aufgabe richtig (oder absichtlich falsch).
async function antworte(seite, richtig = true) {
  const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
  const auf = pool.aufgaben.find((a) => a.id === id);
  assert.ok(auf, `Aufgabe nicht gefunden: ${id}`);
  const wert = (l) => String(richtig ? l : l + 1);
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', wert(auf.loesung));
  else if (auf.format === 'auswahl') {
    for (const o of auf.optionen) await seite.locator('label.option', { hasText: o.text }).locator('input').setChecked(o.richtig === richtig).catch(() => {});
  } else if (auf.format === 'zuordnen') {
    for (const [i, p] of auf.paare.entries()) await seite.selectOption(`select[name="paar-${p.links}"]`, richtig ? p.rechts : auf.paare[(i + 1) % auf.paare.length].rechts);
  } else if (auf.format === 'luecken') {
    for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, wert(l.loesung));
  } else for (const [i, t] of auf.teile.entries()) await seite.fill(`input[name="teil-${i}"]`, wert(t.loesung));
  await seite.click('#pruefen');
  return auf;
}

// ---------- 1. Komplettdatei als lokale Datei, Demo ohne Ordner ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(new URL('dist/Schueler-Dashboard-komplett.html', wurzel).href);
  await foto(seite, 'anmeldung');
  await seite.fill('#code', 'quatsch');
  await seite.click('#demo');
  await seite.waitForSelector('.fehler');
  await seite.fill('#code', '5a-test');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.locator('.region').count(), 9);
  await foto(seite, 'jahresplan');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.metro');
  assert.equal(await seite.locator('.station').count(), 5);
  await foto(seite, 'metrokarte');

  // Erste Aufgabe: einmal falsch (Hinweis), dann richtig (weniger Münzen).
  await seite.click('#losfahren');
  await antworte(seite, false);
  await seite.waitForSelector('.hinweis');
  await foto(seite, 'aufgabe-hinweis');
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  assert.ok(Number(await seite.innerText('#muenzen')) > 0);
  await foto(seite, 'aufgabe-richtig');

  // Zwei weitere richtige Aufgaben: Lernziel erreicht, ein Stern.
  for (let i = 0; i < 2; i++) { await seite.click('#weiter'); await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig'); }
  assert.equal(await seite.innerText('#sterne'), '1');
  await seite.waitForSelector('.lohn.neu');
  await foto(seite, 'lernziel-erreicht');

  // Hilfekärtchen der Reihe nach, dann zweimal falsch: Lösung wird gezeigt.
  await seite.click('#weiter');
  await seite.fill('input[name=zahl], input[type=text]', '7').catch(() => {});
  assert.ok(await seite.locator('[data-hilfe=beispiel]').isDisabled());
  await seite.click('[data-hilfe=tipp]');
  await seite.click('[data-hilfe=beispiel]');
  assert.equal(await seite.locator('.kaertchen-offen').count(), 2);
  await foto(seite, 'hilfekaertchen');
  await antworte(seite, false); await seite.waitForSelector('.hinweis');
  await antworte(seite, false); await seite.waitForSelector('.ergebnis.falsch');
  await foto(seite, 'aufgabe-falsch');

  // Hilferuf und Werkstatt.
  await seite.click('#weiter');
  await seite.click('#hilferuf');
  await seite.waitForSelector('.hilfebanner');
  await seite.click('.kopf nav button:has-text("Werkstatt")');
  await seite.waitForSelector('.werkbank');
  await seite.click('[data-teil=blau]');
  await foto(seite, 'werkstatt');
  await seite.click('#spiel').catch(() => {});
  await foto(seite, 'spiel');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 2. Speichern im Ordner, Neuladen, falscher Ordner ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const seite = await kontext.newPage();
  await seite.addInitScript(ordnerErsatz('5a'));
  await seite.goto(`${basis}dist/Schueler-Dashboard-komplett.html`);
  await seite.fill('#code', '5B-AAAA');
  await seite.click('#ordner');
  await seite.waitForSelector('.fehler');
  assert.match(await seite.innerText('.fehler'), /Klasse 5b/);
  await seite.fill('#code', '5A-K4M2');
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.4"]');
  await seite.click('#losfahren');
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  await seite.waitForFunction(() => document.getElementById('speicherstatus').textContent.startsWith('Gespeichert'));
  const gespeichert = await seite.evaluate(async () => {
    const ordner = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    return JSON.parse(await (await (await ordner.getFileHandle('5A-K4M2.json')).getFile()).text());
  });
  assert.equal(gespeichert.versuche.length, 1);
  assert.equal(gespeichert.code, '5A-K4M2');
  const muenzen = gespeichert.muenzen;

  // Anderer Computer: Sicherung im Browser fehlt, der Stand kommt aus dem Ordner.
  await seite.evaluate(() => localStorage.clear());
  await seite.reload();
  await seite.fill('#code', '5A-K4M2');
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen');
  assert.equal(Number(await seite.innerText('#muenzen')), muenzen);

  // Klassendatei der Lehrkraft: nur Kapitel bis 5.3 offen, Code muss in der Liste stehen.
  await seite.evaluate(async () => {
    const ordner = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    const strom = await (await ordner.getFileHandle('klassendatei.json', { create: true })).createWritable();
    await strom.write(JSON.stringify({ aktuellesKapitel: '5.3', codes: ['5A-K4M2'], zielniveaus: { '5A-K4M2': 'M' } }));
    await strom.close();
  });
  await seite.reload();
  await seite.fill('#code', '5A-XXXX');
  await seite.click('#ordner');
  await seite.waitForSelector('.fehler');
  await seite.fill('#code', '5A-K4M2');
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.locator('.region:not(.gesperrt)').count(), 3);
  await seite.click('[data-kapitel="5.3"]');
  assert.match(await seite.innerText('.unter'), /Linie M/);
  await kontext.close();
}

// ---------- 3. Startdatei ohne Netz: Dashboard und Pool kommen aus dem Klassenordner ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const seite = await kontext.newPage();
  await seite.route(/github\.io/, (r) => r.abort());
  await seite.addInitScript(ordnerErsatz('5a'));
  await seite.goto(`${basis}dist/Mathekingdom.html`);
  await seite.evaluate(async ([dashboard, poolText]) => {
    const ordner = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a', { create: true });
    const system = await ordner.getDirectoryHandle('_mathekingdom', { create: true });
    for (const [name, text] of [['schueler-dashboard.js', dashboard], ['klasse-5.json', poolText]]) {
      const strom = await (await system.getFileHandle(name, { create: true })).createWritable();
      await strom.write(text); await strom.close();
    }
  }, [readFileSync(new URL('dist/schueler-dashboard.js', wurzel), 'utf8'), JSON.stringify(pool)]);
  await seite.waitForSelector('#mk-ordner');
  await foto(seite, 'startdatei-ohne-netz');
  await seite.click('#mk-ordner');
  await seite.waitForSelector('#code');
  await seite.fill('#code', '5A-K4M2');
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen', { timeout: 15000 });
  await kontext.close();
}

await browser.close();
server.close();
console.log('Browsertest bestanden.');
