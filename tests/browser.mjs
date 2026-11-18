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
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await foto(seite, 'anmeldung');
  await seite.fill('#code', 'quatsch');
  await seite.click('#demo');
  await seite.waitForSelector('.fehler');
  await seite.fill('#code', '5a-test');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.locator('.region').count(), 9);
  await foto(seite, 'schlossgarten');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.locator('.meilenstein').count(), 5);
  await foto(seite, 'regionskarte');

  // Erste Aufgabe: einmal falsch (Hinweis), dann richtig (weniger Münzen).
  await seite.click('#aufbrechen');
  await antworte(seite, false);
  await seite.waitForSelector('.hinweis');
  // Nach dem ersten Fehlversuch liegt der Tipp offen, und der zweite Versuch kostet nichts.
  assert.equal(await seite.locator('.kaertchen-offen').count(), 1);
  await foto(seite, 'aufgabe-hinweis');
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  assert.equal(Number(await seite.innerText('#muenzen')), 20);
  await foto(seite, 'aufgabe-richtig');

  // Zwei weitere richtige Aufgaben: Lernziel erreicht, ein Stern.
  for (let i = 0; i < 2; i++) { await seite.click('#weiter'); await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig'); }
  assert.equal(await seite.innerText('#siegel'), '1');
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
  await seite.click('.kopf nav button:has-text("Wappen")');
  await seite.waitForSelector('.werkbank');
  await seite.click('[data-teil=blau]');
  await foto(seite, 'wappen');
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
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-form');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  // Startseite: Etappe mit Fortschritt, ein Tipp führt direkt in die nächste Aufgabe. Dort liegt der Merkzettel bereit.
  assert.match(await seite.innerText('.etappe'), /Addieren und Subtrahieren: Meilenstein Kopfrechnen[\s\S]*0 von 5 Meilensteinen gemeistert/);
  await foto(seite, 'startseite-etappe');
  await seite.click('#weiter-wandern');
  await seite.waitForSelector('section.aufgabe[data-aufgabe^="5.3.1-K1"]');
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), false);
  await seite.click('.merkzettel summary');
  assert.match(await seite.innerText('.merkzettel'), /Rechne in Schritten[\s\S]*Beispiel[\s\S]*Im Heft/);
  await seite.click('[data-hilfe=tipp]'); // Neuzeichnen: der Merkzettel bleibt offen
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), true);
  await foto(seite, 'merkzettel');
  await seite.click('.kopf nav button:has-text("Schlossgarten")');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.locator('.meilenstein:not(.leer)').count(), 5); // alle fünf Stationen haben jetzt Aufgaben
  assert.equal(await seite.locator('.meilenstein.standort').count(), 1);
  assert.match(await seite.textContent('.meilenstein.standort'), /Hier weiter/);
  await foto(seite, 'regionskarte-standort');
  // Übt an einer Station auf einer Linie ein Lernziel, bis eine Aufgabe des gesuchten Formats kommt, und löst sie.
  const suche = async (station, linie, lernzielNr, passt, name) => {
    for (let i = 0; i < 8; i++) {
      await seite.click(`.meilenstein[aria-label^="Meilenstein ${station}"] .stein`);
      await seite.click(`.kronenwahl button[data-krone="${linie}"]`);
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
      await seite.click('.ergebnis button:has-text("Zur Regionskarte")');
      await seite.waitForSelector('svg.regionskarte');
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

// ---------- 1c. Niveaustufen: Hilfen, Wortspeicher und Sternregel je Stufe (Dividieren) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-stuf');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.4"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.match(await seite.innerText('.unter'), /spielst um Gold/); // Standard-Zielniveau ist M
  const oeffne = async (linie, lernzielNr) => {
    await seite.click('.meilenstein[aria-label^="Meilenstein Dividieren"] .stein');
    await seite.click(`.kronenwahl button[data-krone="${linie}"]`);
    await seite.locator('.lernziele li button').nth(lernzielNr).click();
    await seite.waitForSelector('section.aufgabe');
  };
  const zurueck = async () => { await seite.click('.pfad button'); await seite.waitForSelector('svg.regionskarte'); };
  // F: drei Kärtchen, Wortspeicher offen und nur mit Alltagswörtern, jeder Satz in einer eigenen Zeile.
  await oeffne('F', 5);
  assert.equal(await seite.locator('[data-hilfe]').count(), 3);
  assert.equal(await seite.locator('.wortspeicher dl').isVisible(), true);
  assert.doesNotMatch(await seite.innerText('.wortspeicher'), /Quotient|Dividend/);
  assert.ok((await seite.innerText('.aufgabentext')).includes('\n'));
  await foto(seite, 'stufe-F');
  await antworte(seite, false); await seite.waitForSelector('.hinweis');
  await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig');
  await seite.click('#weiter'); await seite.waitForSelector('#pruefen');
  await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig'); // Auswahl mit mehrzeiligen Antworten
  await seite.click('.ergebnis button:has-text("Zur Regionskarte")'); await seite.waitForSelector('svg.regionskarte');
  // G: drei Kärtchen, Wortspeicher mit Quotient. E: ein Kärtchen, Wortspeicher zugeklappt.
  await oeffne('G', 1);
  assert.equal(await seite.locator('[data-hilfe]').count(), 3);
  assert.match(await seite.innerText('.wortspeicher'), /Quotient/);
  await foto(seite, 'stufe-G');
  await zurueck();
  await oeffne('E', 1);
  assert.equal(await seite.locator('[data-hilfe]').count(), 1);
  assert.equal(await seite.locator('.wortspeicher dl').isVisible(), false);
  await foto(seite, 'stufe-E');
  await zurueck();
  // M: zwei Kärtchen. Drei richtige in der Folge AFB I, II, II bringen den Stern.
  await oeffne('M', 3);
  assert.deepEqual(await seite.locator('[data-hilfe]').evaluateAll((k) => k.map((x) => x.dataset.hilfe)), ['tipp', 'loesungsschritt']);
  await foto(seite, 'stufe-M');
  const folge = [];
  for (let i = 0; i < 3; i++) {
    folge.push((await antworte(seite, true)).afb);
    await seite.waitForSelector('.ergebnis.richtig');
    if (i < 2) { await seite.click('#weiter, .vorschlag .schlicht'); await seite.waitForSelector('#pruefen'); }
  }
  assert.deepEqual(folge, [1, 2, 2]);
  await seite.waitForSelector('.lohn.neu');
  assert.equal(await seite.innerText('#siegel'), '1');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1d. Kronen: ein Weg, Kronenwahl, Bronze unter dem Ziel Gold, Selbsteinschätzung ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-kron');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.locator('#kronen [data-krone]').count(), 4);
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.locator('.regionskarte path.weg').count(), 1, 'nur noch ein Weg');
  assert.equal(await seite.locator('.kronenwahl button').count(), 4);
  assert.equal(await seite.getAttribute('.kronenwahl button[data-krone="M"]', 'aria-pressed'), 'true', 'voreingestellt ist das Zielniveau Gold');
  assert.doesNotMatch(await seite.innerText('main'), /Förderniveau|Feldweg|Königsweg|\b[FGME] ·/);
  await seite.click('.kronenwahl button[data-krone="F"]');
  assert.equal(await seite.getAttribute('.kronenwahl button[data-krone="F"]', 'aria-pressed'), 'true');
  await foto(seite, 'kronenwahl');
  await seite.click('#aufbrechen');
  assert.match(await seite.innerText('.kronenmarke'), /Spiel um Bronze/);
  for (let i = 0; i < 40 && !(await seite.locator('#neue-krone').count()); i++) {
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
    if (await seite.locator('#neue-krone').count()) break;
    await seite.click('#weiter, .vorschlag button.schlicht');
  }
  assert.match(await seite.innerText('#neue-krone'), /Neue Krone: Bronze/);
  assert.match(await seite.innerText('#einschaetzung'), /um Bronze gespielt. Geschafft hast du Bronze/);
  assert.match(await seite.innerText('.ergebnis'), /brauchst du Gold/);
  assert.equal(await seite.innerText('#siegel'), '0', 'kein Siegel unter dem Zielniveau');
  await foto(seite, 'krone-bronze');
  await seite.click('.ergebnis button:has-text("Zur Regionskarte")');
  await seite.waitForSelector('svg.regionskarte');
  assert.match(await seite.innerText('#meine-krone'), /Deine Krone: Bronze. Für den Meilenstein brauchst du Gold/);
  assert.equal(await seite.locator('.regionskarte .meilenstein .krone-F').count(), 1);
  assert.equal(await seite.locator('#kronen [data-krone="F"] b').innerText(), '1');
  await foto(seite, 'regionskarte-krone');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 2. Speichern im Ordner, Neuladen, falscher Ordner ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1200, height: 800 } });
  const seite = await kontext.newPage();
  await seite.addInitScript(ordnerErsatz('5a'));
  await seite.goto(`${basis}dist/Mathekingdom-ohne-Netz.html`);
  await seite.fill('#code', '5B-AAAA');
  await seite.click('#ordner');
  await seite.waitForSelector('.fehler');
  assert.match(await seite.innerText('.fehler'), /Klasse 5b/);
  await seite.fill('#code', '5A-K4M2');
  await seite.click('#ordner');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.4"]');
  await seite.click('#aufbrechen');
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  await seite.waitForFunction(() => document.getElementById('speicherstatus').textContent.startsWith('Gespeichert'));
  // Der Status steht schon seit der Anmeldung auf "Gespeichert": auf den Versuch in der Datei warten.
  const gespeichert = await seite.evaluate(async () => {
    const ordner = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    for (let i = 0; ; i++) {
      try {
        const stand = JSON.parse(await (await (await ordner.getFileHandle('5A-K4M2.json')).getFile()).text());
        if (stand.versuche.length || i > 40) return stand;
      } catch (e) { if (i > 40) throw e; }
      await new Promise((r) => setTimeout(r, 100));
    }
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
  assert.match(await seite.innerText('.unter'), /spielst um Gold/);
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
  // Betriebsprotokoll: Der Start aus der Kopie steht als Problem mit Grund im Speicherstand.
  const betrieb = await seite.evaluate(async () => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    for (let i = 0; i < 40; i++) {
      try { const s = JSON.parse(await (await (await o.getFileHandle('5A-K4M2.json')).getFile()).text()); if (s.betrieb?.length) return s.betrieb; } catch { /* noch nicht geschrieben */ }
      await new Promise((r) => setTimeout(r, 250));
    }
    return [];
  });
  assert.equal(betrieb[0]?.art, 'problem');
  assert.match(betrieb[0].text, /Kopie im Klassenordner/);
  assert.match(betrieb[0].text, /Grund: GitHub/);
  await kontext.close();
}

// ---------- 4. Lehrer-Dashboard mit Beispielklasse, als lokale Datei ----------
{
  const seite = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.addInitScript(() => { window.print = () => { window.gedruckt = (window.gedruckt ?? 0) + 1; }; });
  await seite.goto(new URL('dist/Mathekingdom-Lehrer-ohne-Netz.html', wurzel).href);
  await foto(seite, 'lehrer-start');
  await seite.click('#beispiel');
  await seite.waitForSelector('.schlange li');
  assert.equal(await seite.locator('.tabs.bereiche button').count(), 4);
  assert.equal(await seite.locator('[data-tab=jetzt].aktiv').count(), 1); // im Unterricht öffnet „Jetzt“
  await foto(seite, 'lehrer-jetzt');
  assert.match(await seite.innerText('.impulse'), /Selbsteinschätzung: Carla Rossi hat sich an den letzten 3 Meilensteinen unterschätzt/);
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
  await seite.waitForSelector('.overlay .kennzahlen');
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
  await foto(seite, 'lehrer-jetzt-neu');
  await seite.setViewportSize({ width: 820, height: 1100 });
  await foto(seite, 'lehrer-jetzt-tablet');
  await seite.setViewportSize({ width: 1400, height: 900 });
  // Lernstand: Heatmap der Klasse, ein Lernziel, ein Schüler.
  await seite.click('[data-tab=lernstand]');
  await seite.waitForSelector('.heatmap');
  assert.equal(await seite.locator('.heatmap tbody tr').count(), 14);
  assert.ok(await seite.locator('.heatmap td.zelle.siegel').count() > 0);
  assert.ok(await seite.locator('.stapel li').count() > 5);
  await foto(seite, 'lehrer-lernstand');
  // Selbsteinschätzung: Tendenz je Schüler, Impuls bei Carla (dreimal unterschätzt), keine Kronen beim Lehrer.
  assert.equal(await seite.locator('#selbsteinschaetzung tbody tr').count(), 14);
  assert.match(await seite.innerText('#selbsteinschaetzung'), /eher zu niedrig[\s\S]*eher zu hoch|eher zu hoch[\s\S]*eher zu niedrig/);
  await seite.locator('#selbsteinschaetzung').screenshot(bilder ? { path: `${bilder}/lehrer-selbsteinschaetzung.png` } : {});
  assert.equal(await seite.locator('.krone').count(), 0, 'die Lehrkraft sieht Niveaustufen, keine Kronen');
  await seite.locator('.heatmap [data-lernziel]').first().click();
  await seite.waitForSelector('.vierspaltig');
  assert.equal(await seite.locator('.gruppenliste').count(), 4);
  await foto(seite, 'lehrer-lernziel');
  await seite.click('.brotkrumen button');
  await seite.locator('[data-schueler-zeile]').first().click();
  await seite.waitForSelector('.weg');
  assert.equal(await seite.locator('.schuelerseite .kennzahl').count(), 3);
  await foto(seite, 'lehrer-schueler');
  assert.match(await seite.innerText('#meilensteine-schueler'), /Gewählt beim Start/);
  await seite.click('#einzelbericht');
  assert.ok(await seite.locator('#mk-druck .kennzahl').count() >= 3);
  // Meilensteine für eine ganze Gruppe sperren.
  await seite.click('.brotkrumen button');
  await seite.click('summary:has-text("Meilensteine öffnen und sperren")');
  await seite.selectOption('#pfad-kapitel', '5.3');
  await seite.selectOption('[data-masse="5.3.3"]', 'zu|alle');
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 14);
  await seite.locator('.sperre.zu').first().click();
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 13);
  await foto(seite, 'lehrer-meilensteine-sperren');
  // Aufgaben: Auswertung nach AFB, Typ und Linie, Liste mit Sichten und Filtern.
  await seite.click('[data-tab=aufgaben]');
  await seite.waitForSelector('#aufg-liste');
  assert.equal(await seite.locator('.tabelle.gruppen').count(), 3);
  assert.match(await seite.innerText('.tabelle.gruppen >> nth=0'), /AFB I[\s\S]*AFB II[\s\S]*AFB III/);
  await foto(seite, 'lehrer-aufgaben');
  const schwierig = await seite.locator('#aufg-liste tbody tr').first().getAttribute('data-aufgabe');
  await seite.selectOption('#aufg-sicht', 'geloest');
  assert.notEqual(await seite.locator('#aufg-liste tbody tr').first().getAttribute('data-aufgabe'), schwierig);
  await seite.selectOption('#aufg-sicht', 'nie');
  await seite.waitForSelector('#aufg-liste');
  assert.equal(await seite.locator('#aufg-liste tbody tr').first().locator('td.zahl').nth(1).innerText(), '0');
  await seite.selectOption('#aufg-niveau', 'G');
  assert.equal(await seite.inputValue('#aufg-sicht'), 'nie'); // Die Auswahl bleibt beim Neuzeichnen erhalten.
  await seite.click('[data-tab=verwaltung]');
  await seite.click('#pdf');
  assert.equal(await seite.locator('#mk-druck .heatmap').count(), 1);
  assert.equal(await seite.evaluate(() => window.gedruckt), 2);
  await seite.emulateMedia({ media: 'print' });
  await foto(seite, 'lehrer-klassenbericht-druck');
  await seite.emulateMedia({ media: 'screen' });
  const [excel] = await Promise.all([seite.waitForEvent('download'), seite.click('#excel')]);
  assert.match(excel.suggestedFilename(), /^Mathekingdom_5a_.*\.xlsx$/);
  assert.equal(readFileSync(await excel.path()).subarray(0, 2).toString(), 'PK');
  await seite.waitForSelector('td.code');
  await foto(seite, 'lehrer-klasse');
  await seite.click('#kaertchen');
  assert.equal(await seite.locator('#mk-druck .kaertchen > div').count(), 14);
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
  await lehrer.goto(`${basis}dist/Mathekingdom-Lehrer-ohne-Netz.html`);
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
    // Wird die Datei gerade geschrieben, scheitert das Lesen kurz: dann noch einmal versuchen.
    for (let i = 0; ; i++) {
      try { return await (await (await o.getFileHandle(teile.at(-1))).getFile()).text(); }
      catch (e) { if (i >= 20) throw e; await new Promise((r) => setTimeout(r, 50)); }
    }
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
  await schueler.goto(`${basis}dist/Mathekingdom-ohne-Netz.html`);
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
  assert.match(await schueler.innerText('.unter'), /spielst um Gold/);
  await schueler.click('#aufbrechen');
  await antworte(schueler, true);
  await schueler.waitForSelector('.ergebnis.richtig');
  await schueler.click('#weiter');
  await schueler.click('#hilferuf');
  await schueler.waitForSelector('.hilfebanner');

  // Der Hilferuf erscheint bei der Lehrkraft, die Antwort beim Schüler.
  await lehrer.click('[data-tab=jetzt]');
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
  await lehrer.click('[data-tab=lernstand]');
  await lehrer.click('summary:has-text("Meilensteine öffnen und sperren")');
  await lehrer.click(`[data-sperre="5.4.5|${aylin}"]`);
  await warteAuf((k) => k.sperren?.['5.4.5']?.includes(aylin));
  await schueler.click('.pfad button');
  await schueler.waitForSelector('.tafel.gesperrt', { timeout: 15000 });
  assert.equal(await schueler.locator('#aufbrechen').count(), 0);
  await foto(schueler, 'schueler-meilenstein-gesperrt');
  await lehrer.click(`[data-sperre="5.4.5|${aylin}"]`);
  await schueler.waitForSelector('#aufbrechen', { timeout: 15000 });
  assert.equal(JSON.parse(await lies(`5a/${aylin}.json`)).abbrueche.length, 1);

  // Spielpause wirkt beim Schüler.
  await lehrer.check('#spielpause');
  await warteAuf((k) => k.spielpause === true);

  // Backup und Wiederherstellen.
  await lehrer.click('[data-tab=verwaltung]');
  await lehrer.waitForSelector('#backup-wahl');
  const stempel = await lehrer.inputValue('#backup-wahl');
  assert.equal(JSON.parse(await lies(`lehrer/backup/5a/${stempel}/${aylin}.json`)).code, aylin);
  await schreibe(`5a/${aylin}.json`, JSON.stringify({ ...JSON.parse(await lies(`5a/${aylin}.json`)), muenzen: 99999 }));
  await lehrer.selectOption('#backup-schueler', aylin);
  await lehrer.click('#wiederherstellen');
  await lehrer.waitForFunction(() => /wiederhergestellt/.test(document.querySelector('.meldung.warnung')?.textContent ?? ''));
  assert.ok(JSON.parse(await lies(`5a/${aylin}.json`)).muenzen < 1000);

  // Eine ältere, aber echt unterschriebene Klassendatei (etwa ein Überbleibsel eines überholten Schreibvorgangs)
  // wird still ersetzt, ohne Warnung.
  const warnungenVorher = await lehrer.locator('.meldung.warnung li').count();
  await schreibe('5a/klassendatei.json', klassendatei);
  for (let i = 0; i < 100 && (await lies('5a/klassendatei.json')) === klassendatei; i++) await lehrer.waitForTimeout(200);
  assert.notEqual(await lies('5a/klassendatei.json'), klassendatei);
  assert.equal(await lehrer.locator('.meldung.warnung li').count(), warnungenVorher);

  // Eine von außen veränderte Klassendatei erkennt die Lehrkraft und stellt sie wieder her.
  const gefaelscht = JSON.stringify({ inhalt: JSON.stringify({ klasse: '5a', aktuellesKapitel: null, codes: [aylin, '5A-ZZZZ'], zielniveaus: {}, spielpause: true, hilfe: {} }), signatur: JSON.parse(klassendatei).signatur });
  await schreibe('5a/klassendatei.json', gefaelscht);
  await lehrer.waitForFunction(() => /von außen verändert/.test(document.querySelector('.meldung.warnung')?.textContent ?? ''), null, { timeout: 25000 });
  assert.notEqual(await lies('5a/klassendatei.json'), gefaelscht);
  // Betriebsprotokoll: Starts der Schüler und das Problem der Lehrkraft stehen in der Verwaltung.
  await lehrer.waitForFunction(() => /von außen/.test(document.getElementById('protokoll')?.textContent ?? ''), null, { timeout: 15000 });
  assert.ok(await lehrer.locator('#protokoll tbody tr').count() >= 3);
  assert.ok(JSON.parse(await lies('lehrer/lehrerdaten.json')).protokoll.some((e) => /von außen/.test(e.text)));
  assert.ok(JSON.parse(await lies(`5a/${aylin}.json`)).betrieb.some((e) => e.art === 'start'));
  await foto(lehrer, 'lehrer-protokoll');
  await foto(lehrer, 'lehrer-warnung');

  // Ohne offenes Lehrer-Dashboard: Das Schüler-Dashboard lehnt die gefälschte Datei ab.
  await lehrer.goto('about:blank');
  await schueler.goto(`${basis}dist/Mathekingdom-ohne-Netz.html`);
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

// ---------- 7. Startdatei der Lehrkraft: online laden, Kopie ablegen, ohne Netz aus der Kopie starten ----------
{
  const kontext = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const fehler = [];
  const paket = readFileSync(new URL('dist/lehrer-paket.js', wurzel), 'utf8');
  let netz = true;
  await kontext.route(/github\.io/, (r) => {
    if (netz === '404') return r.fulfill({ status: 404, body: 'nicht da', headers: { 'access-control-allow-origin': '*' } });
    if (!netz) return r.abort();
    if (r.request().url().endsWith('dist/lehrer-paket.js')) return r.fulfill({ body: paket, contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } });
    return r.abort();
  });
  await kontext.addInitScript(ordnerErsatz('lehrer'));
  const seite = await kontext.newPage();
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(`${basis}dist/Mathekingdom-Lehrer.html`);
  await seite.waitForSelector('#lehrerordner');
  const version = readFileSync(new URL('VERSIONEN.md', wurzel), 'utf8').match(/^## (\d+\.\d+)/m)[1];
  assert.match(await seite.innerText('#version'), new RegExp(`^Version ${version.replace('.', '\\.')} vom \\d\\d\\.\\d\\d\\.\\d{4}$`));
  await seite.click('#version');
  assert.ok(await seite.locator('.mk-version-tafel li').count() > 0);
  await foto(seite, 'lehrer-version');
  await seite.click('#lehrerordner');
  await seite.waitForSelector('#neue-klasse');
  const kopie = await seite.evaluate(async () => {
    const o = await (await (await navigator.storage.getDirectory()).getDirectoryHandle('lehrer')).getDirectoryHandle('_mathekingdom');
    return (await (await o.getFileHandle('lehrer-paket.js')).getFile()).size;
  });
  assert.equal(kopie, Buffer.byteLength(paket));

  // Ohne Netz: Ordner wählen, die Kopie startet und öffnet gleich die Klassenübersicht.
  netz = false;
  await seite.reload();
  await seite.waitForSelector('#mk-lehrerordner', { timeout: 15000 });
  await foto(seite, 'lehrer-startdatei-ohne-netz');
  await seite.click('#mk-lehrerordner');
  await seite.waitForSelector('#neue-klasse');
  assert.match(await seite.innerText('#version'), /Kopie vom Lehrerlaufwerk/);
  // Der Grund steht auf der Seite und im Betriebsprotokoll der Lehrerdaten.
  const protokoll = await seite.evaluate(async () => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('lehrer');
    return JSON.parse(await (await (await o.getFileHandle('lehrerdaten.json')).getFile()).text()).protokoll;
  });
  assert.equal(protokoll.at(-1).art, 'problem');
  assert.match(protokoll.at(-1).text, /Kopie auf dem Lehrerlaufwerk.*GitHub nicht erreichbar/);
  // GitHub antwortet, aber Pages fehlt: Die Startdatei nennt 404.
  netz = '404';
  await seite.reload();
  await seite.waitForSelector('#mk-lehrerordner', { timeout: 15000 });
  assert.match(await seite.innerText('#mk-grund'), /404.*Pages/);
  assert.deepEqual(fehler, []);
  await kontext.close();
}

// ---------- 8. Versionsanzeige im Schüler-Dashboard ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  assert.match(await seite.innerText('#version'), /^Version \d+\.\d+ vom .*\(Datei ohne Netz/);
  await seite.close();
}

await browser.close();
server.close();
console.log('Browsertest bestanden.');
