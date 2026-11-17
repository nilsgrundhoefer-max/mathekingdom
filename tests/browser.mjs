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
  if (auf.format === 'zahl' || (auf.format === 'zahlenstrahl' && auf.eingabe === 'ablesen')) await seite.fill('input[name=zahl]', wert(auf.loesung));
  else if (auf.format === 'zahlenstrahl') {
    const st = auf.strahl, daneben = auf.loesung + st.schritt <= st.bis ? auf.loesung + st.schritt : auf.loesung - st.schritt;
    await seite.click(`svg.zahlenstrahl [data-wert="${richtig ? auf.loesung : daneben}"]`);
  } else if (auf.format === 'tabelle') {
    for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, wert(l.loesung));
  } else if (auf.format === 'diagramm') {
    for (const [i, t] of auf.teile.entries()) await seite.fill(`input[name="teil-${i}"]`, wert(t.loesung));
  }
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

// ---------- 1b. Neue Formate: Zahlenstrahl, Tabelle, Diagramm ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(new URL('dist/Schueler-Dashboard-komplett.html', wurzel).href);
  await seite.fill('#code', '5a-form');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  // Startseite: Etappe mit Fortschritt, ein Tipp führt direkt in die nächste Aufgabe. Dort liegt der Merkzettel bereit.
  assert.match(await seite.innerText('.etappe'), /Addieren und Subtrahieren: Station Kopfrechnen[\s\S]*0 von 5 Stationen geschafft/);
  await foto(seite, 'startseite-etappe');
  await seite.click('#weiterfahren');
  await seite.waitForSelector('section.aufgabe[data-aufgabe^="5.3.1-K1"]');
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), false);
  await seite.click('.merkzettel summary');
  assert.match(await seite.innerText('.merkzettel'), /Rechne in Schritten[\s\S]*Beispiel[\s\S]*Im Heft/);
  await seite.click('[data-hilfe=tipp]'); // Neuzeichnen: der Merkzettel bleibt offen
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), true);
  await foto(seite, 'merkzettel');
  await seite.click('.kopf nav button:has-text("Jahresplan")');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.metro');
  assert.equal(await seite.locator('.station:not(.leer)').count(), 5); // alle fünf Stationen haben jetzt Aufgaben
  assert.equal(await seite.locator('.station.standort').count(), 1);
  assert.match(await seite.textContent('.station.standort'), /Hier weiter/);
  await foto(seite, 'metrokarte-standort');
  // Übt an einer Station auf einer Linie ein Lernziel, bis eine Aufgabe des gesuchten Formats kommt, und löst sie.
  const suche = async (station, linie, lernzielNr, passt, name) => {
    for (let i = 0; i < 8; i++) {
      await seite.click(`.station[aria-label="Station ${station}"] .kapsel`);
      await seite.click(`.linienknopf[aria-label="Auf Linie ${linie} umsteigen"]`).catch(() => {});
      await seite.locator('.lernziele li button').nth(lernzielNr).click();
      const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
      const treffer = passt(pool.aufgaben.find((a) => a.id === id));
      if (treffer) {
        await foto(seite, `format-${name}`);
        await antworte(seite, false);
        await seite.waitForSelector('.hinweis');
      }
      await antworte(seite, true);
      await seite.waitForSelector('.ergebnis.richtig');
      if (treffer) await foto(seite, `format-${name}-geloest`);
      await seite.click('.ergebnis button:has-text("Zur Metrokarte")');
      await seite.waitForSelector('svg.metro');
      if (treffer) return;
    }
    assert.fail(`Keine Aufgabe im Format ${name} gefunden`);
  };
  await suche('Kopfrechnen', 'F', 0, (a) => a.format === 'zahlenstrahl' && a.eingabe === 'markieren', 'zahlenstrahl-antippen');
  await suche('Kopfrechnen', 'G', 1, (a) => a.format === 'zahlenstrahl' && a.eingabe === 'ablesen', 'zahlenstrahl-ablesen');
  await suche('Kopfrechnen', 'M', 0, (a) => a.format === 'tabelle', 'tabelle');
  await suche('Addieren', 'G', 4, (a) => a.format === 'diagramm', 'diagramm');
  await suche('Addieren', 'E', 4, (a) => a.format === 'diagramm' && a.teile.length === 2, 'diagramm-zwei-fragen');
  await suche('Addieren', 'M', 4, (a) => a.format === 'tabelle', 'tabelle-gesamt');
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

// ---------- 4. Lehrer-Dashboard mit Beispielklasse, als lokale Datei ----------
{
  const seite = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.addInitScript(() => { window.print = () => { window.gedruckt = (window.gedruckt ?? 0) + 1; }; });
  await seite.goto(new URL('dist/Lehrer-Dashboard.html', wurzel).href);
  await foto(seite, 'lehrer-start');
  await seite.click('#beispiel');
  await seite.waitForSelector('.schlange li');
  assert.equal(await seite.locator('.karte .tabelle tbody tr').count(), 14);
  await foto(seite, 'lehrer-live');
  const wartend = await seite.locator('.schlange li').count();
  await seite.locator('[data-komme]').first().click();
  await seite.waitForSelector('.schlange li.unterwegs');
  await seite.locator('.schlange li.unterwegs [data-erledigt]').click();
  await seite.waitForFunction((n) => document.querySelectorAll('.schlange li').length === n - 1, wartend);
  // Klassenraum: 14 Plätze mit Ampel, mindestens ein blockierter Schüler ohne Hilferuf in der Akut-Zone.
  assert.equal(await seite.locator('.sitzplan .platz[data-schueler]').count(), 14);
  assert.ok(await seite.locator('.sitzplan .platz.blockiert').count() >= 1);
  assert.ok(await seite.locator('.schlange li.blockiert').count() >= 1);
  await seite.locator('[data-kuemmere]').first().click();
  // Detailansicht über dem Sitzplan.
  await seite.locator('.sitzplan .platz[data-schueler]').first().click();
  await seite.waitForSelector('.overlay .kacheln');
  assert.equal(await seite.locator('.sitzplan').count(), 1);
  await foto(seite, 'lehrer-overlay');
  await seite.click('#overlay-zu');
  assert.equal(await seite.locator('.overlay').count(), 0);
  // Sitzplan ändern: ersten und zweiten Platz tauschen.
  const vorher = await seite.locator('.sitzplan .platz').nth(0).getAttribute('data-schueler');
  await seite.click('#sitzplan-bearbeiten');
  await seite.locator('.sitzplan .platz').nth(0).click();
  await seite.locator('.sitzplan .platz').nth(1).click();
  await seite.click('#sitzplan-bearbeiten');
  assert.equal(await seite.locator('.sitzplan .platz').nth(1).getAttribute('data-schueler'), vorher);
  await foto(seite, 'lehrer-live-neu');
  await seite.setViewportSize({ width: 820, height: 1100 });
  await foto(seite, 'lehrer-live-tablet');
  await seite.setViewportSize({ width: 1400, height: 900 });
  // Lernpfad: Station für eine ganze Gruppe sperren.
  await seite.click('[data-tab=pfad]');
  await seite.selectOption('#pfad-kapitel', '5.3');
  await seite.selectOption('[data-masse="5.3.3"]', 'zu|alle');
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 14);
  await seite.locator('.sperre.zu').first().click();
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 13);
  await foto(seite, 'lehrer-lernpfad');
  await seite.click('[data-tab=diagnose]');
  await seite.waitForSelector('.matrix');
  assert.equal(await seite.locator('.matrix tbody tr').count(), 14);
  await foto(seite, 'lehrer-diagnose');
  await seite.click('[data-tab=schueler]');
  await seite.waitForSelector('.kacheln');
  await foto(seite, 'lehrer-einzel');
  await seite.click('#einzelbericht');
  assert.ok(await seite.locator('#mk-druck .kachel').count() > 5);
  await seite.click('#pdf');
  assert.equal(await seite.locator('#mk-druck .matrix').count(), 1);
  assert.equal(await seite.evaluate(() => window.gedruckt), 2);
  await seite.emulateMedia({ media: 'print' });
  await foto(seite, 'lehrer-klassenbericht-druck');
  await seite.emulateMedia({ media: 'screen' });
  const [excel] = await Promise.all([seite.waitForEvent('download'), seite.click('#excel')]);
  assert.match(excel.suggestedFilename(), /^Mathekingdom_5a_.*\.xlsx$/);
  assert.equal(readFileSync(await excel.path()).subarray(0, 2).toString(), 'PK');
  await seite.click('[data-tab=klasse]');
  await seite.waitForSelector('td.code');
  await foto(seite, 'lehrer-klasse');
  await seite.click('#kaertchen');
  assert.equal(await seite.locator('#mk-druck .kaertchen > div').count(), 14);
  await seite.click('[data-tab=sicherung]');
  await seite.click('#backup');
  await seite.waitForSelector('#backup-wahl');
  await foto(seite, 'lehrer-backup');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 5. Lehrkraft und Schüler arbeiten im selben Klassenordner ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
  await kontext.route(/github\.io/, (r) => r.abort());
  const lehrer = await kontext.newPage();
  const fehler = [];
  lehrer.on('pageerror', (e) => fehler.push(`Lehrer: ${e.message}`));
  lehrer.on('dialog', (d) => d.accept());
  // Erste Ordnerwahl: Lehrerlaufwerk. Danach: Klassenordner.
  await lehrer.addInitScript(() => {
    let wahl = 0;
    window.showDirectoryPicker = async () => (await navigator.storage.getDirectory()).getDirectoryHandle(wahl++ === 0 ? 'lehrer' : '5a', { create: true });
  });
  await lehrer.goto(`${basis}dist/Lehrer-Dashboard.html`);
  await lehrer.click('#lehrerordner');
  await lehrer.fill('#neue-klasse', '5a');
  await lehrer.click('#klasse-anlegen');
  await lehrer.waitForSelector('#namen', { timeout: 15000 });
  await lehrer.fill('#namen', 'Lena Müller\nTim Schmidt\n\nAylin Kaya');
  await lehrer.click('#codes');
  await lehrer.waitForSelector('td.code');
  const codes = await lehrer.locator('td.code:not(.pin)').allInnerTexts();
  await lehrer.waitForFunction(() => [...document.querySelectorAll('td.pin')].every((x) => /^\d{4}$/.test(x.textContent)));
  const pin = (await lehrer.locator('td.pin').allInnerTexts())[0];
  assert.equal(codes.length, 3);
  assert.ok(codes.every((c) => /^5A-[A-Z0-9]{4}$/.test(c)));
  const aylin = codes[0]; // alphabetisch nach Namen
  await lehrer.selectOption(`[data-ziel="${aylin}"]`, 'M');
  await lehrer.selectOption('#kapitel', '5.4');

  const lies = (pfad) => lehrer.evaluate(async (pfad) => {
    let o = await navigator.storage.getDirectory();
    const teile = pfad.split('/');
    for (const t of teile.slice(0, -1)) o = await o.getDirectoryHandle(t);
    return (await (await o.getFileHandle(teile.at(-1))).getFile()).text();
  }, pfad);
  const schreibe = (pfad, text) => lehrer.evaluate(async ([pfad, text]) => {
    let o = await navigator.storage.getDirectory();
    const teile = pfad.split('/');
    for (const t of teile.slice(0, -1)) o = await o.getDirectoryHandle(t);
    const strom = await (await o.getFileHandle(teile.at(-1), { create: true })).createWritable();
    await strom.write(text); await strom.close();
  }, [pfad, text]);

  // Im Klassenordner stehen keine Namen, auf dem Lehrerlaufwerk schon.
  const inhalt = async () => JSON.parse(JSON.parse(await lies('5a/klassendatei.json')).inhalt);
  const warteAuf = async (pruefe) => { for (let i = 0; i < 50 && !pruefe(await inhalt()); i++) await lehrer.waitForTimeout(100); assert.ok(pruefe(await inhalt())); };
  await warteAuf((k) => k.aktuellesKapitel === '5.4');
  const klassendatei = await lies('5a/klassendatei.json');
  assert.ok(!/Lena|Schmidt|Aylin/.test(klassendatei));
  // Die PIN steht nur bei den Lehrerdaten, in der Klassendatei steht ein Prüfwert.
  assert.equal(JSON.parse(await lies('lehrer/lehrerdaten.json')).klassen['5a'].pins[aylin].pin, pin);
  assert.deepEqual(Object.keys((await inhalt()).pins[aylin]).sort(), ['salz', 'wert']);
  assert.ok(!klassendatei.includes(`"${pin}"`));
  assert.equal(JSON.parse(JSON.parse(klassendatei).inhalt).aktuellesKapitel, '5.4');
  const lehrerdaten = JSON.parse(await lies('lehrer/lehrerdaten.json'));
  assert.deepEqual(Object.values(lehrerdaten.klassen['5a'].namen).sort(), ['Aylin Kaya', 'Lena Müller', 'Tim Schmidt']);
  assert.ok((await lies('5a/_mathekingdom/schueler-dashboard.js')).length > 10000);
  assert.equal(JSON.parse(await lies('5a/_mathekingdom/klasse-5.json')).aufgaben.length, pool.aufgaben.length);

  // Die Startdatei enthält den öffentlichen Schlüssel.
  const [start] = await Promise.all([lehrer.waitForEvent('download'), lehrer.click('#startdatei')]);
  const startText = readFileSync(await start.path(), 'utf8');
  assert.ok(startText.includes(JSON.stringify(lehrerdaten.schluessel.oeffentlich)));
  assert.ok(!startText.includes('/*SCHLUESSEL*/null'));

  // Schülerin meldet sich an: Zielniveau M, Kapitel bis 5.4 offen, fremder Code wird abgelehnt.
  const schueler = await kontext.newPage();
  schueler.on('pageerror', (e) => fehler.push(`Schüler: ${e.message}`));
  await schueler.addInitScript(`${ordnerErsatz('5a')}; window.MK_SCHLUESSEL = ${JSON.stringify(lehrerdaten.schluessel.oeffentlich)};`);
  await schueler.goto(`${basis}dist/Schueler-Dashboard-komplett.html`);
  await schueler.fill('#code', '5A-ZZZZ');
  await schueler.click('#ordner');
  await schueler.waitForSelector('.fehler');
  await schueler.fill('#code', aylin);
  await schueler.click('#ordner');
  await schueler.waitForFunction(() => /Gib auch deine PIN ein/.test(document.querySelector('.fehler')?.textContent ?? ''));
  await schueler.fill('#pin', pin === '0000' ? '0001' : '0000');
  await schueler.click('#ordner');
  await schueler.waitForFunction(() => /Die PIN stimmt nicht/.test(document.querySelector('.fehler')?.textContent ?? ''));
  await schueler.fill('#pin', pin);
  await schueler.click('#ordner');
  await schueler.waitForSelector('.regionen');
  assert.equal(await schueler.locator('.region:not(.gesperrt)').count(), 4);
  await schueler.click('[data-kapitel="5.4"]');
  assert.match(await schueler.innerText('.unter'), /Linie M/);
  await schueler.click('#losfahren');
  await antworte(schueler, true);
  await schueler.waitForSelector('.ergebnis.richtig');
  await schueler.click('#weiter');
  await schueler.click('#hilferuf');
  await schueler.waitForSelector('.hilfebanner');

  // Der Hilferuf erscheint bei der Lehrkraft, die Antwort beim Schüler.
  await lehrer.click('[data-tab=live]');
  await lehrer.waitForSelector(`[data-komme="${aylin}"]`, { timeout: 8000 });
  assert.match(await lehrer.innerText('.schlange'), /Aylin Kaya/);
  await foto(lehrer, 'lehrer-hilferuf');
  await lehrer.click(`[data-komme="${aylin}"]`);
  await lehrer.waitForSelector('.schlange li.unterwegs');
  await schueler.waitForFunction(() => /kommt|unterwegs/i.test(document.querySelector('.hilfebanner')?.textContent ?? ''), null, { timeout: 6000 });
  await foto(schueler, 'schueler-hilfe-kommt');
  await lehrer.click(`[data-erledigt="${aylin}"]`);
  await lehrer.waitForFunction(() => !document.querySelector('.schlange li'), null, { timeout: 1000 }); // verschwindet sofort
  await schueler.waitForSelector('.hilfebanner.erledigt', { timeout: 8000 });
  await schueler.waitForSelector('#hilferuf'); // ein neuer Hilferuf ist wieder möglich
  await lehrer.waitForFunction(() => !document.querySelector('.schlange li'), null, { timeout: 25000 });

  // Nachricht an eine Schülerin, sie bestätigt, die Lehrkraft sieht „gelesen“.
  await lehrer.click(`.sitzplan [data-schueler="${aylin}"]`);
  await lehrer.click('.overlay details.nachricht summary');
  await lehrer.fill(`[data-nachricht="${aylin}"]`, 'Rechne die Probe.');
  await lehrer.click(`.overlay [data-sende="${aylin}"]`);
  await schueler.waitForSelector('.hilfebanner.nachricht', { timeout: 15000 });
  assert.match(await schueler.innerText('.hilfebanner.nachricht'), /Rechne die Probe\./);
  await schueler.click('#nachricht-ok');
  await lehrer.waitForFunction(() => /gelesen/.test(document.querySelector('.overlay details.nachricht .marke.gut')?.textContent ?? ''), null, { timeout: 15000 });
  await lehrer.click('#overlay-zu');

  // Station sperren: Die Schülerin sieht das Schloss und kann dort nichts starten. Öffnen macht es rückgängig.
  await lehrer.click('[data-tab=pfad]');
  await lehrer.click(`[data-sperre="5.4.5|${aylin}"]`);
  await warteAuf((k) => k.sperren?.['5.4.5']?.includes(aylin));
  await schueler.click('.pfad button');
  await schueler.waitForSelector('.tafel.gesperrt', { timeout: 15000 });
  assert.equal(await schueler.locator('#losfahren').count(), 0);
  await foto(schueler, 'schueler-station-gesperrt');
  await lehrer.click(`[data-sperre="5.4.5|${aylin}"]`);
  await schueler.waitForSelector('#losfahren', { timeout: 15000 });
  assert.equal(JSON.parse(await lies(`5a/${aylin}.json`)).abbrueche.length, 1);

  // Spielpause wirkt beim Schüler.
  await lehrer.check('#spielpause');
  await warteAuf((k) => k.spielpause === true);

  // Backup und Wiederherstellen.
  await lehrer.click('[data-tab=sicherung]');
  await lehrer.waitForSelector('#backup-wahl');
  const stempel = await lehrer.inputValue('#backup-wahl');
  assert.equal(JSON.parse(await lies(`lehrer/backup/5a/${stempel}/${aylin}.json`)).code, aylin);
  await schreibe(`5a/${aylin}.json`, JSON.stringify({ ...JSON.parse(await lies(`5a/${aylin}.json`)), muenzen: 99999 }));
  await lehrer.selectOption('#backup-schueler', aylin);
  await lehrer.click('#wiederherstellen');
  await lehrer.waitForFunction(() => /wiederhergestellt/.test(document.querySelector('.meldung.warnung')?.textContent ?? ''));
  assert.ok(JSON.parse(await lies(`5a/${aylin}.json`)).muenzen < 1000);

  // Eine von außen veränderte Klassendatei erkennt die Lehrkraft und stellt sie wieder her.
  const gefaelscht = JSON.stringify({ inhalt: JSON.stringify({ klasse: '5a', aktuellesKapitel: null, codes: [aylin, '5A-ZZZZ'], zielniveaus: {}, spielpause: true, hilfe: {} }), signatur: JSON.parse(klassendatei).signatur });
  await schreibe('5a/klassendatei.json', gefaelscht);
  await lehrer.waitForFunction(() => /von außen verändert/.test(document.querySelector('.meldung.warnung')?.textContent ?? ''), null, { timeout: 25000 });
  assert.notEqual(await lies('5a/klassendatei.json'), gefaelscht);
  await foto(lehrer, 'lehrer-warnung');

  // Ohne offenes Lehrer-Dashboard: Das Schüler-Dashboard lehnt die gefälschte Datei ab.
  await lehrer.goto('about:blank');
  await schueler.goto(`${basis}dist/Schueler-Dashboard-komplett.html`);
  await schueler.evaluate(async (text) => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    const strom = await (await o.getFileHandle('klassendatei.json')).createWritable();
    await strom.write(text); await strom.close();
  }, gefaelscht);
  await schueler.fill('#code', '5A-ZZZZ');
  await schueler.click('#ordner');
  await schueler.waitForSelector('.fehler');
  assert.match(await schueler.innerText('.fehler'), /Klassendatei/);
  assert.deepEqual(fehler, []);
  await kontext.close();
}

await browser.close();
server.close();
console.log('Browsertest bestanden.');
