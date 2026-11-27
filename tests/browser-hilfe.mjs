// Version 0.68 (ADR 0057): Hilfe im echten Browser bei 1366 × 650. Der Hilferuf gilt für den Tag, die Meldung „erledigt“ kommt
// nach dem Spiel, der Heftcheck hat immer vier Antworten, die Feedbackfrage ist begrenzt und löst „Lieber etwas anderes“ ein.
// Aufruf: node tools/baue.mjs && node tests/browser-hilfe.mjs   (braucht Playwright; BILDER=<Ordner> für Fotos)
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
const lade = (k) => JSON.parse(readFileSync(new URL(`aufgabenpool/klasse-${k}.json`, wurzel), 'utf8'));
const pool = lade(5), index = L.indexiere(pool), pool7 = lade(7), index7 = L.indexiere(pool7);
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

const leer = (code, kapitel = '5.1') => ({ ...L.neuerSpeicherstand(code, code.slice(0, 2).toLowerCase(), vor(200)), toreGesehen: [kapitel], einstieg: { [kapitel]: { uebersprungen: vor(100) } } });
const klassendatei = (x = {}) => ({ aktuellesKapitel: '5.1', tore: ['5.1'], zielniveaus: {}, ...x });
// Meldet einen Schüler in der Demo an. `andere` sind weitere Speicherstände im selben Klassenordner.
async function schueler(stand, kd, andere = []) {
  const seite = await browser.newPage({ viewport: GROESSE });
  seite.on('pageerror', (e) => fehler.push(`${stand.code}: ${e.message}`));
  await seite.addInitScript(([liste, k, klasse]) => {
    if (localStorage.getItem(`mk-demo-${klasse}/klassendatei.json`)) return; // nur beim ersten Laden
    for (const s of liste) localStorage.setItem(`mk-demo-${klasse}/${s.code}.json`, JSON.stringify(s));
    localStorage.setItem(`mk-demo-${klasse}/klassendatei.json`, JSON.stringify(k));
  }, [[stand, ...andere], kd, stand.klasse]);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', stand.code);
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  return seite;
}
const foto = async (seite, name, ganz = false) => { if (bilder) await seite.screenshot({ path: `${bilder}/${name}.png`, fullPage: ganz }); };
const standVon = (seite, stand) => seite.evaluate(([klasse, code]) => JSON.parse(localStorage.getItem(`mk-demo-${klasse}/${code}.json`)), [stand.klasse, stand.code]);
async function antworte(seite, idx = index) {
  const auf = idx.aufgabe.get(await seite.getAttribute('section.aufgabe', 'data-aufgabe'));
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(auf.loesung));
  else if (auf.format === 'auswahl') { for (const o of auf.optionen) await seite.locator('label.option', { hasText: o.text }).first().locator('input').setChecked(Boolean(o.richtig)).catch(() => {}); }
  else return false;
  await seite.click('#pruefen');
  await seite.waitForSelector('.ergebnis');
  return true;
}
// Meldet das Kind an und geht zur nächsten Aufgabe. Kommt eine, die der Test nicht lösen kann, beginnt er neu.
async function mitLoesbarerAufgabe(stand, kd) {
  for (let i = 0; i < 25; i++) {
    const seite = await schueler(stand, kd);
    await seite.click('#weiter-knopf');
    await seite.click('#aufbrechen');
    await seite.waitForSelector('section.aufgabe');
    if (['zahl', 'auswahl'].includes(index.aufgabe.get(await seite.getAttribute('section.aufgabe', 'data-aufgabe')).format)) return seite;
    await seite.close();
  }
  throw new Error('keine lösbare Aufgabe gefunden');
}
const AUFGABE = pool.aufgaben.find((a) => a.lernziel.startsWith('5.1.') && a.format === 'zahl').id;

// ---------- 1. Ein Hilferuf von gestern ist abgelaufen: Das Kind wird einmal gefragt ----------
{
  const st = leer('5A-ALTR'); L.rufeHilfe(st, AUFGABE, vor(30), 'schwer');
  const seite = await schueler(st, klassendatei());
  await seite.waitForSelector('#hilferuf-abgelaufen');
  assert.match(await seite.innerText('#hilferuf-abgelaufen'), /Dein Hilferuf vom \d+\. \S+ ist abgelaufen\. Brauchst du noch Hilfe\?/);
  assert.doesNotMatch(await seite.innerText('#mathekingdom'), /Du wartest/);
  await foto(seite, '01-hilferuf-abgelaufen');
  await seite.click('#abgelaufen-nein');
  assert.equal(await seite.locator('.hilfebanner').count(), 0);
  let gespeichert = null;
  for (let i = 0; i < 40 && gespeichert?.hilferufe?.at(-1)?.grund !== 'abgelaufen'; i++) { await seite.waitForTimeout(250); gespeichert = await standVon(seite, st); }
  assert.equal(gespeichert.hilferuf, null);
  assert.equal(gespeichert.hilferufe.at(-1).grund, 'abgelaufen');
  await seite.close();
}

// ---------- 2. „Ja“ ruft neu von heute. Der alte Ruf eines anderen Kindes steht nicht davor ----------
{
  const st = leer('5A-NEUR'); L.rufeHilfe(st, AUFGABE, vor(30), 'verstehe');
  const alt = leer('5A-MIAX'); L.rufeHilfe(alt, AUFGABE, vor(50), 'schwer');
  const seite = await schueler(st, klassendatei(), [alt]);
  await seite.click('#abgelaufen-ja');
  await seite.waitForSelector('.hilfebanner:has-text("Platz 1")', { timeout: 15000 });
  assert.match(await seite.innerText('.hilfebanner'), /Du wartest seit \d\d:\d\d Uhr auf Hilfe und bist auf Platz 1 der Warteschlange\. Arbeite ruhig weiter\./);
  await foto(seite, '02-hilferuf-wartet-seit');
  const gespeichert = await standVon(seite, st);
  assert.equal(gespeichert.hilferuf?.anlass, 'verstehe');
  await seite.close();
}

// ---------- 3. „Erledigt“ während eines Belohnungsspiels: Die Meldung kommt erst danach ----------
{
  const st = leer('5A-SPIL'); st.muenzen = 500; L.rufeHilfe(st, AUFGABE, vor(0.05), 'schwer');
  const kd = klassendatei({ spielpause: true });
  const seite = await schueler(st, kd);
  await seite.waitForSelector('.hilfebanner');
  await seite.click('#nav-spiele');
  await seite.locator('button[data-spiel]:not([disabled])').first().click();
  await seite.waitForSelector('section.karte.spiel');
  await seite.evaluate(([k, code, zu]) => localStorage.setItem('mk-demo-5a/klassendatei.json', JSON.stringify({ ...k, hilfe: { [code]: { zu, status: 'erledigt' } } })), [kd, st.code, st.hilferuf.seit]);
  let gespeichert = null;
  for (let i = 0; i < 80 && gespeichert?.hilferuf !== null; i++) { await seite.waitForTimeout(250); gespeichert = await standVon(seite, st); }
  assert.equal(gespeichert.hilferuf, null, 'der Ruf ist erledigt');
  assert.equal(await seite.locator('section.karte.spiel').count(), 1, 'das Spiel läuft weiter');
  assert.equal(await seite.locator('.hilfebanner.erledigt').count(), 0, 'während des Spiels keine Meldung');
  await seite.click('#nav-schlossgarten');
  await seite.waitForSelector('.hilfebanner.erledigt');
  assert.match(await seite.innerText('.hilfebanner.erledigt'), /Deine Lehrkraft hat deinen Hilferuf als erledigt abgehakt\./);
  await foto(seite, '03-erledigt-nach-dem-spiel');
  await seite.close();
}

// ---------- 4. Heftcheck Klasse 7: vier Antworten mit Komma und Minuszeichen, die Aufgabe steht noch einmal da ----------
{
  const st = leer('7A-HEFT', '7.1');
  const aufgaben = pool7.aufgaben.filter((a) => a.niveau === 'M' && a.format === 'zahl' && typeof a.loesung === 'string' && a.loesung.startsWith('−')).slice(0, 8);
  assert.equal(aufgaben.length, 8);
  st.versuche = aufgaben.map((a, i) => ({ t: vor(30), aufgabe: a.id, lernziel: a.lernziel, niveau: 'M', richtig: true, versuche: 1, hilfen: 0, dauer: 30, heft: `H${i + 1}` }));
  st.heftNr = 8; st.heftSeitCheck = 8;
  const seite = await schueler(st, { aktuellesKapitel: '7.1', tore: ['7.1'], zielniveaus: {} });
  await seite.click('#weiter-knopf');
  await seite.click('#aufbrechen');
  await seite.waitForSelector('.karte.heftcheck');
  const texte = await seite.locator('[data-heftwahl]').allInnerTexts();
  assert.equal(texte.length, 4, texte.join(' | '));
  assert.equal(new Set(texte).size, 4);
  for (const t of texte) assert.doesNotMatch(t, /-|\d\.\d/, t);
  assert.ok(texte.some((t) => t.includes('−')), 'echtes Minuszeichen');
  const heft = (await seite.innerText('.heftcheck h1')).match(/H\d+/)[0];
  const gefragt = aufgaben[Number(heft.slice(1)) - 1];
  assert.match(await seite.innerText('#heftaufgabe'), new RegExp(`^Aufgabe ${heft}: `));
  assert.ok((await seite.innerText('#heftaufgabe')).includes(gefragt.text.replace(/\{\{\w+\}\}/g, '▢').slice(0, 30)));
  const b = await seite.locator('.heftwahl').boundingBox();
  assert.ok(b.y + b.height <= GROESSE.height, 'alle Antworten sind ohne Scrollen zu sehen');
  await foto(seite, '04-heftcheck-negative-dezimalzahl');
  const richtig = L.heftAntworten(gefragt.loesung, []).find((o) => o.richtig).text;
  await seite.locator('[data-heftwahl]', { hasText: new RegExp(`^${richtig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( |$)`) }).click();
  assert.match(await seite.innerText('.heftcheck h1'), /Stimmt, genau das steht in deinem Heft\./);
  await seite.close();
}

// ---------- 5. Feedbackfrage: gleiche Knöpfe, „Lieber etwas anderes“ führt auf die Karte ----------
{
  const st = leer('5A-FEED', '5.3'); st.feedbackSeit = 3; st.feedbackNaechste = L.FEEDBACK_FRAGEN.findIndex((f) => f.id === 'weiter');
  const seite = await mitLoesbarerAufgabe(st, klassendatei({ aktuellesKapitel: '5.3', tore: ['5.3'], feedback: { an: true, alle: 3 } }));
  assert.ok(await antworte(seite));
  await seite.click('#weiter');
  await seite.waitForSelector('#feedbackfrage');
  assert.match(await seite.innerText('#feedbackfrage h1'), /Möchtest du so weiterarbeiten\?/);
  const [ja, nein] = [await seite.locator('[data-feedback="0"]'), await seite.locator('[data-feedback="1"]')];
  assert.equal(await ja.getAttribute('class'), await nein.getAttribute('class'), 'beide Knöpfe sind gleich gewichtet');
  const farbe = (l) => l.evaluate((e) => getComputedStyle(e).backgroundColor);
  assert.equal(await farbe(ja), await farbe(nein));
  await foto(seite, '05-feedbackfrage-gleiche-knoepfe');
  await nein.click();
  await seite.waitForSelector('.meldung');
  assert.match(await seite.innerText('.meldung'), /Such dir auf der Karte aus, woran du jetzt arbeiten möchtest\./);
  assert.equal(await seite.locator('#aufbrechen').count(), 1, 'die Regionskarte ist offen');
  await foto(seite, '06-lieber-etwas-anderes');
  await seite.click('#aufbrechen');
  await seite.waitForSelector('section.aufgabe');
  assert.equal(await seite.locator('.meldung').count(), 0, 'der Hinweis verschwindet beim Weitergehen');
  await seite.close();
}

// ---------- 6. Feedbackfrage: nach sechs Fragen am Tag kommt keine mehr ----------
{
  const st = leer('5A-SECH', '5.3'); st.feedbackSeit = 3;
  st.feedback = ['aussehen', 'schwer', 'leicht', 'text', 'spass', 'karte'].map((frage) => ({ t: new Date().toISOString(), frage, antwort: 1 }));
  const seite = await mitLoesbarerAufgabe(st, klassendatei({ aktuellesKapitel: '5.3', tore: ['5.3'], feedback: { an: true, alle: 3 } }));
  assert.ok(await antworte(seite));
  await seite.click('#weiter');
  await seite.waitForSelector('section.aufgabe, .wegstueck, .regionen, #aufbrechen');
  assert.equal(await seite.locator('#feedbackfrage').count(), 0);
  await seite.close();
}

// ---------- 7. Lehrkraft: Der Ruf von gestern steht nicht in der Akut-Zone, sondern unter „Abgelaufene Hilferufe“ ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  await kontext.addInitScript(() => { try { localStorage.setItem('mk-aufgeklappt-lehrer', '{"*":true}'); } catch { /* about:blank */ } });
  const lehrer = await kontext.newPage();
  lehrer.on('pageerror', (e) => fehler.push(`Lehrer: ${e.message}`));
  lehrer.on('dialog', (d) => d.accept());
  await lehrer.addInitScript(() => {
    let wahl = 0;
    window.showDirectoryPicker = async () => (await navigator.storage.getDirectory()).getDirectoryHandle(wahl++ === 0 ? 'lehrer' : '5a', { create: true });
  });
  await lehrer.goto(`${basis}dist/Mathekingdom-Lehrer-ohne-Netz.html`);
  await lehrer.click('#lehrerordner');
  await lehrer.fill('#neue-klasse', '5a');
  await lehrer.click('#klasse-anlegen');
  await lehrer.waitForSelector('#namen', { timeout: 15000 });
  await lehrer.fill('#namen', 'Lea Ammann\nTim Berg\nMia Celik');
  await lehrer.click('#codes');
  await lehrer.waitForSelector('td.code');
  const [lea, tim, mia] = await lehrer.locator('td.code:not(.pin)').allInnerTexts();
  await lehrer.selectOption('#kapitel', '5.1');
  const staende = [lea, tim, mia].map((c) => leer(c));
  L.rufeHilfe(staende[0], AUFGABE, vor(30), 'schwer');   // gestern gerufen, heute wieder da
  L.rufeHilfe(staende[1], AUFGABE, vor(0.1), 'verstehe'); // ruft gerade
  for (const s of staende) { s.geaendert = new Date().toISOString(); s.aktiv = { aufgabe: AUFGABE, seit: vor(0.02), fehlversuche: 0, hilfen: 0 }; }
  await lehrer.evaluate(async (liste) => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    for (const s of liste) { const w = await (await o.getFileHandle(`${s.code}.json`, { create: true })).createWritable(); await w.write(JSON.stringify(s)); await w.close(); }
  }, staende);
  await lehrer.click('[data-tab=jetzt]');
  await lehrer.waitForSelector('#hilferufe-abgelaufen', { timeout: 20000 });
  const zeile = (await lehrer.innerText('#hilferufe-abgelaufen')).match(/^Abgelaufene Hilferufe: (\S+ \S+) \(vom \d+\.\d+\., Aufgabe zu schwer\)\. Ein Hilferuf gilt für den Tag\.$/);
  assert.ok(zeile, await lehrer.innerText('#hilferufe-abgelaufen'));
  assert.equal(await lehrer.locator('ol.schlange li.ruf').count(), 1, 'nur der Ruf von heute steht in der Akut-Zone');
  assert.match(await lehrer.innerText('ol.schlange li.ruf'), /versteht die Aufgabe nicht/);
  assert.ok(!(await lehrer.innerText('ol.schlange')).includes(zeile[1]), 'das Kind mit dem alten Ruf steht nicht in der Akut-Zone');
  if (bilder) await lehrer.screenshot({ path: `${bilder}/07-lehrkraft-abgelaufene-hilferufe.png`, fullPage: true });
  await kontext.close();
}

await browser.close();
server.close();
assert.deepEqual(fehler, [], 'keine Fehler in der Konsole');
console.log('Browsertest Hilfe bestanden.');
