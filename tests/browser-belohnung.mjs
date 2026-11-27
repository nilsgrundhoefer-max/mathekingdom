// Version 0.69 (ADR 0057): Belohnung und Eingabe im echten Browser bei 1366 × 650. Titelform, ehrlicher Spieltext,
// Bestenliste nach 0 Punkten, Endnull beim Runden, Knopf „±“ und das Feld für die Ganzen.
// Aufruf: node tools/baue.mjs && node tests/browser-belohnung.mjs   (braucht Playwright; BILDER=<Ordner> für Fotos)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import * as L from '../src/schueler/logik.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const wurzel = new URL('../', import.meta.url);
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-5.json', wurzel), 'utf8'));
const index = L.indexiere(pool);
const server = createServer((req, res) => {
  try {
    const pfad = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
    res.setHeader('content-type', pfad.endsWith('.html') ? 'text/html; charset=utf-8' : pfad.endsWith('.js') ? 'text/javascript' : 'application/json');
    res.end(readFileSync(new URL(pfad, wurzel)));
  } catch { res.statusCode = 404; res.end(); }
}).listen(0);
const basis = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch();
const GROESSE = { width: 1366, height: 650 };
const vor = (stunden) => new Date(Date.now() - stunden * 3600000).toISOString();
const fehler = [];

const leer = (code) => ({ ...L.neuerSpeicherstand(code, '5a', vor(200)), toreGesehen: ['5.1'], einstieg: { '5.1': { uebersprungen: vor(100) } } });
const ok = () => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, karten: [], dauer: 30 });
const klassendatei = (x = {}) => ({ aktuellesKapitel: '5.1', tore: ['5.1'], zielniveaus: {}, ...x });
async function schueler(stand, kd) {
  const seite = await browser.newPage({ viewport: GROESSE });
  seite.on('pageerror', (e) => fehler.push(`${stand.code}: ${e.message}`));
  await seite.addInitScript(([s, k]) => {
    if (localStorage.getItem('mk-demo-5a/klassendatei.json')) return;
    localStorage.setItem(`mk-demo-5a/${s.code}.json`, JSON.stringify(s)); localStorage.setItem('mk-demo-5a/klassendatei.json', JSON.stringify(k));
  }, [stand, kd]);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', stand.code);
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  return seite;
}
// Anmeldung mit Klassenordner (im Test das private Browser-Dateisystem): Nur so gilt die Spielfreigabe der Klasse, die Demo hat immer Spielpause.
async function mitOrdner(stand, kd) {
  const seite = await browser.newPage({ viewport: GROESSE });
  seite.on('pageerror', (e) => fehler.push(`${stand.code}: ${e.message}`));
  await seite.addInitScript(() => { window.showDirectoryPicker = async () => (await navigator.storage.getDirectory()).getDirectoryHandle('5a', { create: true }); });
  await seite.goto(`${basis}dist/Mathekingdom-ohne-Netz.html`);
  await seite.evaluate(async ([s, k]) => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a', { create: true });
    for (const [name, inhalt] of [[`${s.code}.json`, s], ['klassendatei.json', k]]) { const w = await (await o.getFileHandle(name, { create: true })).createWritable(); await w.write(JSON.stringify(inhalt)); await w.close(); }
  }, [stand, kd]);
  await seite.fill('#code', stand.code);
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen');
  return seite;
}
const foto = async (ziel, name) => { if (bilder) await ziel.screenshot({ path: `${bilder}/${name}.png` }); };
const standVon = (seite, code) => seite.evaluate((c) => JSON.parse(localStorage.getItem(`mk-demo-5a/${c}.json`)), code);

// ---------- 1. Titelform: Die Wahl im Wappenschrank gilt für Rang und Hoftitel ----------
{
  const st = leer('5A-TITL');
  // Ein Meilenstein auf Gold: reicht für den Hoftitel.
  const ms = pool.kapitel[0].unterkapitel[0];
  for (const lz of ms.lernziele.map((l) => l.id).filter((id) => index.lernzielMitAufgaben.has(id))) for (const a of [...index.nach.get(`${lz}|M`)].sort((x, y) => (y.afb ?? 1) - (x.afb ?? 1)).slice(0, 3)) L.verbuche(st, a, ok(), 'M', vor(30), index);
  st.heftSeitCheck = 0;
  const seite = await schueler(st, klassendatei());
  await seite.waitForSelector('#hoftitel-kopf', { timeout: 20000 });
  assert.match(await seite.innerText('.kopf .wer'), /Wanderer 5A-TITL\s*Klassenkönig$/);
  await seite.click('#wappen-knopf');
  await seite.waitForSelector('#titelform');
  assert.deepEqual(await seite.locator('#titelform button').allInnerTexts(), ['Wanderer, Ritter, Klassenkönig', 'Wanderin, Ritterin, Klassenkönigin']);
  assert.equal(await seite.getAttribute('[data-titelform="m"]', 'aria-pressed'), 'true', 'Standard ist die bisherige Form');
  await seite.click('[data-titelform="w"]');
  assert.equal(await seite.getAttribute('[data-titelform="w"]', 'aria-pressed'), 'true');
  assert.match(await seite.innerText('.kopf .wer'), /Wanderin 5A-TITL\s*Klassenkönigin$/);
  assert.match(await seite.innerText('.werkbank'), /Rang: Wanderin/);
  assert.match(await seite.innerText('.werkbank'), /dann wirst du Kundschafterin/);
  const b = await seite.locator('#titelform').boundingBox();
  assert.ok(b.y + b.height <= GROESSE.height, 'die Wahl ist ohne Scrollen zu sehen');
  await foto(seite, '01-titelform');
  let gespeichert = null;
  for (let i = 0; i < 40 && gespeichert?.titelform !== 'w'; i++) { await seite.waitForTimeout(250); gespeichert = await standVon(seite, st.code); }
  assert.equal(gespeichert.titelform, 'w');
  await seite.click('[data-titelform="m"]');
  assert.match(await seite.innerText('.kopf .wer'), /Wanderer 5A-TITL\s*Klassenkönig$/);
  await seite.close();
}

// ---------- 2. Spiele: ehrlicher Text und der eigene Eintrag nach 0 Punkten ----------
{
  const st = leer('5A-SPIE'); st.muenzen = 300; st.spielGutschrift = 1;
  st.spiele = [{ spiel: 'botenritt', t: new Date().toISOString(), punkte: 0 }];
  const seite = await mitOrdner(st, klassendatei({ spielfreigabe: 'verdient', codes: [st.code] }));
  await seite.click('#nav-spiele');
  assert.equal(await seite.innerText('#verdient'), 'Die Spiele sind für dich frei. Eine Runde kostet 100 Münzen. Das gilt, bis du eine Runde gespielt hast.');
  assert.doesNotMatch(await seite.innerText('#mathekingdom'), /verdient/);
  assert.match(await seite.innerText('#bestenliste-botenritt'), /Bestenliste der Klasse für „Botenritt“, diese Woche/);
  assert.equal(await seite.locator('#bestenliste-botenritt li.eigen').count(), 1, 'die eigene Runde mit 0 Punkten steht da');
  assert.match(await seite.innerText('#bestenliste-botenritt li.eigen'), /^1\.\s*.+\s*0$/);
  assert.match(await seite.innerText('#bestenliste-burgmauer'), /Bei diesem Spiel hat diese Woche noch niemand Punkte geholt\./);
  await seite.locator('#verdient').scrollIntoViewIfNeeded();
  await foto(seite, '02-spiele-frei-und-bestenliste');
  await seite.close();
}

// ---------- 3. Einzelne Aufgaben in der Probeansicht: Endnull, Knopf „±“, Feld für die Ganzen ----------
{
  const seite = await browser.newPage({ viewport: GROESSE });
  seite.on('pageerror', (e) => fehler.push(`Probe: ${e.message}`));
  await seite.addInitScript(() => { window.MK_PROBE = true; window.ergebnisse = []; window.addEventListener('message', (ev) => { if (ev.data?.mkProbeErgebnis) window.ergebnisse.push(ev.data.mkProbeErgebnis); }); });
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  const zeige = async (id) => {
    await seite.evaluate((kennung) => { window.ergebnisse.length = 0; window.postMessage({ mkProbe: kennung }, '*'); }, id);
    await seite.waitForSelector(`section.aufgabe[data-aufgabe="${id}"]`);
  };
  const ergebnis = async () => { await seite.waitForFunction(() => window.ergebnisse.length > 0); return seite.evaluate(() => window.ergebnisse.at(-1).richtig); };

  // Runden auf Hundertstel: 4,7 ist fast richtig, 4,70 richtig. Kein Versuch geht verloren.
  await zeige('6.4.3-R1-M-02');
  await seite.fill('input[name=zahl]', '4,7');
  await seite.click('#pruefen');
  await seite.waitForSelector('section.aufgabe:has-text("Fast richtig")');
  assert.match(await seite.innerText('section.aufgabe'), /Fast richtig: Der Wert stimmt\. Schreibe zwei Stellen nach dem Komma, auch wenn am Ende eine Null steht\. So sieht man, wie genau gerundet wurde\. Das kostet dich keinen Versuch\./);
  assert.equal(await seite.evaluate(() => window.ergebnisse.length), 0, 'noch kein Ergebnis');
  assert.equal(await seite.inputValue('input[name=zahl]'), '4,7', 'die Eingabe bleibt stehen');
  await foto(seite, '03-runden-fast-richtig');
  await seite.fill('input[name=zahl]', '4,70');
  await seite.click('#pruefen');
  assert.equal(await ergebnis(), true);
  assert.match(await seite.innerText('#endnull'), /^Beim Runden schreibt man die Null mit\./);
  // Bleibt das Kind bei 4,7, zählt die Antwort nach zwei Bitten trotzdem.
  await zeige('6.4.3-R1-M-02');
  for (let i = 0; i < 3; i++) { await seite.fill('input[name=zahl]', '4,7'); await seite.click('#pruefen'); await seite.waitForTimeout(150); }
  assert.equal(await ergebnis(), true);

  // Lücke direkt hinter „−“ oder „+“: kein Knopf „±“. Das Ergebnis hinter „=“ behält ihn.
  await zeige('7.1.5-R1-G-03');
  const knopfBei = (name) => seite.locator(`.zahlfeld:has(input[name="luecke-${name}"]) button.vorzeichen`).count();
  assert.deepEqual([await knopfBei('a'), await knopfBei('b'), await knopfBei('c')], [0, 0, 1]);
  await foto(seite.locator('section.aufgabe'), '04-luecke-ohne-vorzeichenknopf');
  await seite.fill('input[name="luecke-a"]', '40'); await seite.fill('input[name="luecke-b"]', '5'); await seite.fill('input[name="luecke-c"]', '−5');
  await seite.click('#pruefen');
  assert.equal(await ergebnis(), true);

  // Bruch mit „Kürze vollständig“: Das Feld für die Ganzen ist da, auch wenn keine gemischte Zahl herauskommt, und darf leer bleiben.
  await zeige('7.1.4-S2-M-03');
  assert.equal(await seite.locator('.brucheingabe input:not([type=hidden])').count(), 3);
  const f = await seite.locator('.brucheingabe').boundingBox();
  assert.ok(f.x >= 0 && f.x + f.width <= GROESSE.width);
  await foto(seite.locator('section.aufgabe'), '05-bruch-mit-feld-fuer-ganze');
  await seite.fill('input[name=bruch-z]', '2'); await seite.fill('input[name=bruch-n]', '3');
  await seite.click('#pruefen');
  assert.equal(await ergebnis(), true);
  // In Klasse 5 bleibt es bei Zähler und Nenner.
  const fuenf = pool.aufgaben.find((a) => a.format === 'bruch' && !a.gemischt);
  await zeige(fuenf.id);
  assert.equal(await seite.locator('.brucheingabe input:not([type=hidden])').count(), 2);
  await seite.close();
}

await browser.close();
server.close();
assert.deepEqual(fehler, [], 'keine Fehler in der Konsole');
console.log('Browsertest Belohnung und Eingabe bestanden.');
