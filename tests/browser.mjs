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

// Vorbereiteter Speicherstand für die Demo. `grundlage`: Lernziele, die gerade in der Grundlagen-Schleife sind (ADR 0015).
const t0 = new Date(Date.now() - 3600000).toISOString();
const leererStand = (code, grundlage = []) => ({ version: 2, code, klasse: '5a', erstellt: t0, geaendert: t0, muenzen: 0, niveau: {}, niveauMarke: {}, lernziele: {}, versuche: [], hilferuf: null, hilferufe: [],
  wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [],
  grundlage: Object.fromEntries(grundlage.map((id) => [id, { aktiv: true, ab: 0, mal: 1, t: t0 }])) });
const mitStand = (seite, stand) => seite.addInitScript(([name, text]) => { if (!localStorage.getItem(name)) localStorage.setItem(name, text); }, [`mk-demo-5a/${stand.code}.json`, JSON.stringify(stand)]);

// Löst die gerade angezeigte Aufgabe richtig (oder absichtlich falsch).
async function antworte(seite, richtig = true, { taste = false } = {}) {
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
  // Mit `taste`: Enter im Textfeld prüft, ohne Maus (ADR 0016).
  if (taste && await seite.evaluate(() => document.activeElement?.matches('form.antwort input[type=text]'))) await seite.keyboard.press('Enter');
  else await seite.click('#pruefen');
  return auf;
}

// Weiter nach dem Ergebnis. Ist gerade ein Wegstück fertig, kommt erst sein Abschluss (ADR 0016): dort ebenfalls weiter.
async function weiter(seite, wahl = '#weiter') {
  await seite.click(wahl);
  if (await seite.locator('#wegstueck-ende').count()) await seite.click('#weiter');
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
  assert.equal(await seite.innerText('.ergebnis .plus'), '+20'); // Kopfzeile im Fokus-Modus ohne Münzen (ADR 0016)
  await foto(seite, 'aufgabe-richtig');

  // Zwei weitere richtige Aufgaben: Lernziel erreicht, ein Stern.
  for (let i = 0; i < 2; i++) { await weiter(seite, '#weiter'); await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig'); }
  await seite.waitForSelector('#neues-siegel');
  await foto(seite, 'lernziel-erreicht');

  // Hilfekärtchen der Reihe nach, dann zweimal falsch: Lösung wird gezeigt.
  await weiter(seite, '#weiter');
  await seite.fill('input[name=zahl], input[type=text]', '7').catch(() => {});
  // Auf M gibt es zwei Kärtchen: Tipp und Lösungsschritt. Das zweite geht erst nach dem ersten auf.
  assert.equal(await seite.locator('[data-hilfe]').count(), 2);
  assert.ok(await seite.locator('[data-hilfe=loesungsschritt]').isDisabled());
  await seite.click('[data-hilfe=tipp]');
  await seite.click('[data-hilfe=loesungsschritt]');
  assert.equal(await seite.locator('.kaertchen-offen').count(), 2);
  await foto(seite, 'hilfekaertchen');
  await antworte(seite, false); await seite.waitForSelector('.hinweis');
  await antworte(seite, false); await seite.waitForSelector('.ergebnis.falsch');
  await foto(seite, 'aufgabe-falsch');

  // Hilferuf und Werkstatt.
  await weiter(seite, '#weiter');
  await seite.click('#hilferuf');
  await seite.waitForSelector('.hilfebanner');
  await seite.click('#zurueck');
  await seite.click('.kopf nav button:has-text("Wappen")');
  await seite.waitForSelector('.werkbank');
  await seite.click('[data-teil=blau]');
  await foto(seite, 'wappen');
  await seite.click('#spiel').catch(() => {});
  await foto(seite, 'spiel');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1b. Formate und Bilder: Zahlenstrahl, Rechenraster, Ziffernrätsel, Tabelle, Diagramm ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  // Zahlenstrahl und Rechenraster gibt es nur auf F. Dorthin führt die Grundlagen-Schleife, hier schon vorbereitet.
  await mitStand(seite, leererStand('5A-FORM', ['5.3.1-K2', '5.3.2-A2']));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-form');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  // Startseite: Etappe mit Fortschritt, ein Tipp führt direkt in die nächste Aufgabe. Dort liegt der Merkzettel bereit.
  assert.match(await seite.innerText('.etappe'), /Addieren und Subtrahieren: Meilenstein Kopfrechnen[\s\S]*0 von 5 Meilensteinen gemeistert/);
  await foto(seite, 'startseite-etappe');
  // Vor der ersten Aufgabe im Kapitel führt der Weg über den Einstiegscheck, den man überspringen darf.
  await seite.click('#weiter-wandern');
  await seite.waitForSelector('#einstieg');
  await seite.click('#einstieg-ueberspringen');
  assert.equal(await seite.locator('#einstieg').count(), 0);
  await seite.click('#aufbrechen');
  await seite.waitForSelector('section.aufgabe[data-aufgabe^="5.3.1-K1"]');
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), false);
  await seite.click('.merkzettel summary');
  assert.match(await seite.innerText('.merkzettel'), /Rechne in Schritten[\s\S]*Beispiel[\s\S]*Im Heft/);
  await seite.click('[data-hilfe=tipp]'); // Neuzeichnen: der Merkzettel bleibt offen
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), true);
  await foto(seite, 'merkzettel');
  await seite.click('#zurueck');
  await seite.click('.kopf nav button:has-text("Schlossgarten")');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.locator('.meilenstein:not(.leer)').count(), 5); // alle fünf Stationen haben jetzt Aufgaben
  assert.equal(await seite.locator('.meilenstein.standort').count(), 1);
  assert.match(await seite.textContent('.meilenstein.standort'), /Hier weiter/);
  await foto(seite, 'regionskarte-standort');
  // Übt an einer Station ein Lernziel, bis eine Aufgabe des gesuchten Formats kommt, und löst sie. Andere Aufgaben werden falsch beantwortet,
  // damit die nächste neue Aufgabe kommt. `pruefe` schaut sich die gefundene Aufgabe an.
  const suche = async (station, krone, lernzielNr, passt, name, pruefe = null) => {
    for (let i = 0; i < 8; i++) {
      await seite.click(`.meilenstein[aria-label^="Meilenstein ${station}"] .stein`);
      await seite.click(`.kronenwahl button[data-krone="${krone}"]`);
      await seite.locator('.lernziele li button').nth(lernzielNr).click();
      const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
      if (process.env.SPUR) console.log(name, id);
      const treffer = passt(pool.aufgaben.find((a) => a.id === id));
      if (treffer) {
        if (pruefe) await pruefe();
        await foto(seite, `format-${name}`);
        await antworte(seite, false);
        await seite.waitForSelector('.hinweis');
        await antworte(seite, true);
        await seite.waitForSelector('.ergebnis.richtig');
        await foto(seite, `format-${name}-geloest`);
      } else {
        await antworte(seite, false); await seite.waitForSelector('.hinweis');
        await antworte(seite, false); await seite.waitForSelector('.ergebnis.falsch');
      }
      await seite.click('.ergebnis button:has-text("Zur Regionskarte")');
      await seite.waitForSelector('svg.regionskarte');
      if (treffer) return;
    }
    assert.fail(`Keine Aufgabe im Format ${name} gefunden`);
  };
  // Grundlage: Marke statt Krone, der Tipp liegt sofort offen, jede Aufgabe hat ein Bild oder ein Raster.
  const grundlage = async () => {
    assert.match(await seite.innerText('#grundlage-marke'), /Grundlage/);
    assert.equal(await seite.locator('.kronenmarke').count(), 0);
    assert.equal(await seite.locator('.kaertchen-offen').count(), 1);
    assert.equal(await seite.locator('.kaertchen > *').count(), 3);
  };
  await suche('Kopfrechnen', 'G', 1, (a) => a.format === 'zahlenstrahl' && a.eingabe === 'markieren', 'zahlenstrahl-antippen', grundlage);
  await suche('Kopfrechnen', 'G', 1, (a) => a.format === 'zahlenstrahl' && a.eingabe === 'ablesen', 'zahlenstrahl-ablesen', grundlage);
  await suche('Addieren', 'G', 1, (a) => a.tabelle?.art === 'raster', 'rechenraster', async () => {
    await grundlage();
    assert.equal(await seite.locator('table.aufgabentabelle.raster').count(), 1);
    assert.ok(await seite.locator('table.raster input.ziffer').count() >= 2);
  });
  await suche('Addieren', 'G', 1, (a) => Boolean(a.bild) && a.niveau === 'F', 'bild-grundlage', async () => {
    assert.equal(await seite.locator('.bildrahmen.zumtext svg').count(), 1);
    assert.ok((await seite.getAttribute('.bildrahmen.zumtext svg', 'aria-label')).length > 5);
  });
  await suche('Subtrahieren', 'G', 1, (a) => a.ziffernfelder, 'ziffernraetsel', async () => {
    assert.ok(await seite.locator('.aufgabentext.luecken input.ziffer').count() >= 1);
    assert.equal(await seite.locator('#grundlage-marke').count(), 0);
  });
  await suche('Kopfrechnen', 'M', 2, (a) => a.format === 'tabelle', 'tabelle');
  // Erst Gold: Auf Silber führen die falschen Antworten in die Grundlagen-Schleife, und die gilt dann für das Lernziel.
  await suche('Addieren', 'M', 4, (a) => a.format === 'diagramm' && a.teile.length === 2, 'diagramm-zwei-fragen');
  await suche('Addieren', 'G', 4, (a) => a.format === 'diagramm', 'diagramm', async () => {
    assert.equal(await seite.locator('svg.diagramm').count(), 1);
  });
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1b2. Kapitel 4: Malkreuz und Mal-Mauer zum Eintragen ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await mitStand(seite, leererStand('5A-MALK', ['5.4.2-M2'])); // F-Aufgaben zum Malkreuz über die Grundlagen-Schleife
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-malk');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.4"]');
  await seite.waitForSelector('svg.regionskarte');
  // Übt ein Lernziel, bis eine Aufgabe mit der gesuchten Tabelle kommt, und löst sie erst falsch, dann richtig. Andere Aufgaben löst es richtig.
  const finde = async (station, lernzielNr, art, name, pruefe) => {
    for (let i = 0; i < 8; i++) {
      await seite.click(`.meilenstein[aria-label^="Meilenstein ${station}"] .stein`);
      await seite.click('.kronenwahl button[data-krone="G"]');
      await seite.locator('.lernziele li button').nth(lernzielNr).click();
      const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
      if (process.env.SPUR) console.log(name, id);
      const treffer = pool.aufgaben.find((a) => a.id === id)?.tabelle?.art === art;
      if (treffer) {
        await pruefe(pool.aufgaben.find((a) => a.id === id));
        await foto(seite, `format-${name}`);
        await antworte(seite, false); await seite.waitForSelector('.hinweis');
        await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig');
        await foto(seite, `format-${name}-geloest`);
      } else {
        await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig'); // richtig lösen, sonst beginnt die Grundlagen-Schleife
      }
      await seite.click('.ergebnis button:has-text("Zur Regionskarte")');
      await seite.waitForSelector('svg.regionskarte');
      if (treffer) return;
    }
    assert.fail(`Keine Aufgabe mit ${art} gefunden`);
  };
  await finde('Multiplizieren', 1, 'malkreuz', 'malkreuz', async (a) => {
    assert.equal(await seite.locator('table.aufgabentabelle.malkreuz').count(), 1);
    assert.equal(await seite.locator('.bildrahmen input').count(), Object.keys(a.luecken).length);
  });
  await finde('Zahlenmuster', 0, 'mauer', 'malmauer', async (a) => {
    assert.equal(await seite.locator('.mauer.malmauer[aria-label="Mal-Mauer"]').count(), 1);
    assert.equal(await seite.locator('.mauer .stein.offen input').count(), Object.keys(a.luecken).length);
    assert.equal(await seite.locator('.mauer .mauerreihe').count(), 3);
  });
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1c. Niveaustufen: Hilfen, Wortspeicher und Sternregel je Stufe (Dividieren) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await mitStand(seite, leererStand('5A-STUF', ['5.4.5-D6'])); // F ist nur über die Grundlagen-Schleife erreichbar
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
  const zurueck = async () => { await seite.click('#zurueck'); await seite.waitForSelector('svg.regionskarte'); };
  // F: drei Kärtchen, das erste liegt offen. Wortspeicher offen und nur mit Alltagswörtern, jeder Satz in einer eigenen Zeile, mit Bild.
  await oeffne('G', 5);
  assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.4\.5-D6-F/);
  assert.equal(await seite.locator('.kaertchen > *').count(), 3);
  assert.equal(await seite.locator('.kaertchen-offen').count(), 1);
  assert.equal(await seite.locator('.bildrahmen.zumtext svg.aufgabenbild').count(), 1);
  assert.equal(await seite.locator('.wortspeicher dl').isVisible(), true);
  assert.doesNotMatch(await seite.innerText('.wortspeicher'), /Quotient|Dividend/);
  assert.ok((await seite.innerText('.aufgabentext')).includes('\n'));
  await foto(seite, 'stufe-F');
  await antworte(seite, false); await seite.waitForSelector('.hinweis');
  await antworte(seite, true); await seite.waitForSelector('.ergebnis.richtig');
  await weiter(seite, '#weiter'); await seite.waitForSelector('#pruefen');
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
    if (i < 2) { await weiter(seite, '#weiter, .vorschlag .schlicht'); await seite.waitForSelector('#pruefen'); }
  }
  assert.deepEqual(folge, [1, 2, 2]);
  await seite.waitForSelector('#neues-siegel');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1d. Kronen: ein Weg, Kronenwahl ohne Bronze, Silber unter dem Ziel Gold, Selbsteinschätzung ----------
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
  assert.deepEqual(await seite.locator('.kronenwahl button').evaluateAll((k) => k.map((x) => x.dataset.krone)), ['G', 'M', 'E'], 'Bronze steht nicht zur Wahl (ADR 0015)');
  assert.equal(await seite.getAttribute('.kronenwahl button[data-krone="M"]', 'aria-pressed'), 'true', 'voreingestellt ist das Zielniveau Gold');
  assert.doesNotMatch(await seite.innerText('main'), /Förderniveau|Feldweg|Königsweg|\b[FGME] ·/);
  await seite.click('.kronenwahl button[data-krone="G"]');
  assert.equal(await seite.getAttribute('.kronenwahl button[data-krone="G"]', 'aria-pressed'), 'true');
  await foto(seite, 'kronenwahl');
  await seite.click('#aufbrechen');
  assert.match(await seite.innerText('.kronenmarke'), /Spiel um Silber/);
  for (let i = 0; i < 40 && !(await seite.locator('#neue-krone').count()); i++) {
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
    if (await seite.locator('#neue-krone').count()) break;
    await weiter(seite, '#weiter, .vorschlag button.schlicht');
  }
  assert.match(await seite.innerText('#neue-krone'), /Neue Krone: Silber/);
  assert.match(await seite.innerText('#einschaetzung'), /um Silber gespielt. Geschafft hast du Silber/);
  assert.match(await seite.innerText('.ergebnis'), /brauchst du Gold/);
  assert.equal(await seite.locator('#neues-siegel').count(), 0, 'kein Siegel unter dem Zielniveau');
  await foto(seite, 'krone-silber');
  await seite.click('.ergebnis button:has-text("Zur Regionskarte")');
  await seite.waitForSelector('svg.regionskarte');
  assert.match(await seite.innerText('#meine-krone'), /Deine Krone: Silber. Für den Meilenstein brauchst du Gold/);
  assert.equal(await seite.locator('.regionskarte .meilenstein .krone-G').count(), 1);
  assert.equal(await seite.locator('#kronen [data-krone="G"] b').innerText(), '1');
  assert.equal(await seite.getAttribute('.regionskarte .nebel', 'data-frei'), '0', 'Silber unter dem Ziel lichtet keinen Nebel');
  await foto(seite, 'regionskarte-krone');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1e. Rückblick und Nebel (ADR 0014) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  // Vorbereiteter Speicherstand: alle Lernziele von 5.3.1 vor drei Tagen erreicht, der Meilenstein ist gemeistert.
  const ms = pool.kapitel.find((k) => k.id === '5.3').unterkapitel[0];
  const vor3Tagen = new Date(Date.now() - 3 * 86400000).toISOString();
  const stand = { version: 2, code: '5A-RUEK', klasse: '5a', erstellt: vor3Tagen, geaendert: vor3Tagen, muenzen: 0, niveau: {}, niveauMarke: {},
    lernziele: Object.fromEntries(ms.lernziele.map((l) => [l.id, { erreichtAm: vor3Tagen }])), versuche: [], hilferuf: null, hilferufe: [],
    wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [] };
  await seite.addInitScript((text) => { if (!localStorage.getItem('mk-demo-5a/5A-RUEK.json')) localStorage.setItem('mk-demo-5a/5A-RUEK.json', text); }, JSON.stringify(stand));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-ruek');
  await seite.click('#demo');
  await seite.waitForSelector('#rueckblick');
  assert.match(await seite.innerText('#rueckblick'), /Weißt du es noch\?/);
  await foto(seite, 'rueckblick-angebot');
  await seite.click('#rueckblick-start');
  assert.match(await seite.innerText('.rueckblickmarke'), /Rückblick 1 von 3/);
  // Erste Aufgabe absichtlich zweimal falsch: Siegel bleibt, Lernziel kommt wieder.
  await antworte(seite, false); await antworte(seite, false);
  await seite.waitForSelector('.ergebnis.falsch');
  assert.match(await seite.innerText('.ergebnis'), /Dein Siegel behältst du/);
  for (let i = 0; i < 2; i++) {
    await weiter(seite, '#weiter');
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
  }
  assert.match(await seite.innerText('#rueckblick-fertig'), /Rückblick geschafft!\s+2 von 3 richtig/);
  await weiter(seite, '#weiter');
  await seite.waitForSelector('.regionen');
  assert.equal(await seite.innerText('#siegel'), String(ms.lernziele.length));
  assert.equal(await seite.locator('#rueckblick').count(), 0, 'höchstens ein Rückblick am Tag');
  // Nebel: Der gemeisterte Meilenstein lichtet ihn, die Landschaft liegt darunter.
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.getAttribute('.regionskarte .nebel', 'data-frei'), '1');
  assert.ok(await seite.locator('.regionskarte .zeichnung').count() >= 5);
  await foto(seite, 'regionskarte-nebel');
  const gespeichert = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-RUEK.json')));
  assert.equal(gespeichert.rueckblicke.length, 1);
  assert.ok(Object.values(gespeichert.rueckblick).some((r) => r.aufzufrischen));
  assert.ok(gespeichert.versuche.every((v) => v.rueckblick));
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1f. Heftcheck: Heftcode nach gelösten Aufgaben ab Gold, Stichprobe nach acht Codes (ADR 0014) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  const t = new Date(Date.now() - 3600000).toISOString();
  const mitWert = pool.aufgaben.filter((a) => a.niveau === 'M' && a.format === 'zahl' && a.lernziel.startsWith('5.3.2')).slice(0, 8);
  const versuche = mitWert.map((a, i) => ({ t, aufgabe: a.id, lernziel: a.lernziel, niveau: 'M', richtig: true, versuche: 1, eingaben: [String(a.loesung)], fehlvorstellungen: [], hilfen: 0, dauer: 30, muenzen: 20, heft: `H${i + 1}` }));
  const stand = { version: 2, code: '5A-HEFT', klasse: '5a', erstellt: t, geaendert: t, muenzen: 160, niveau: {}, niveauMarke: {}, lernziele: {}, versuche, hilferuf: null, hilferufe: [],
    wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [], heftNr: 8, heftSeitCheck: 8, heftchecks: [] };
  await seite.addInitScript((text) => { if (!localStorage.getItem('mk-demo-5a/5A-HEFT.json')) localStorage.setItem('mk-demo-5a/5A-HEFT.json', text); }, JSON.stringify(stand));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-heft');
  await seite.click('#demo');
  await seite.click('#weiter-wandern');
  await seite.waitForSelector('.heftcheck');
  const heft = (await seite.innerText('.heftcheck h1')).match(/H\d+/)[0];
  const gefragt = mitWert[Number(heft.slice(1)) - 1];
  assert.notEqual(heft, 'H8', 'gefragt wird nicht nach der allerletzten Aufgabe');
  assert.equal(await seite.locator('[data-heftwahl]').count(), 4);
  await foto(seite, 'heftcheck');
  // Absichtlich eine falsche Antwort: Die Aufgabe muss noch einmal gelöst werden.
  const richtigText = `${gefragt.loesung}${gefragt.einheit ? ` ${gefragt.einheit}` : ''}`.replace(/^(\d+)/, (z) => (Number(z) >= 10000 ? z.replace(/\B(?=(\d{3})+$)/g, ' ') : z));
  const texte = await seite.locator('[data-heftwahl]').allInnerTexts();
  await seite.locator('[data-heftwahl]').nth(texte.findIndex((x) => x.trim() !== richtigText)).click();
  await seite.click('#heftcheck-nachloesen');
  assert.equal(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), gefragt.id);
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  assert.match(await seite.innerText('#heftcode'), /H9/);
  const gespeichert = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-HEFT.json')));
  assert.deepEqual(gespeichert.heftchecks.map((c) => [c.heft, c.richtig]), [[heft, false]]);
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 1g. Einstiegscheck, Grundlagen-Schleife (ADR 0015) und Brücke (ADR 0014) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-eins');
  await seite.click('#demo');
  await seite.click('#weiter-wandern');
  await seite.waitForSelector('#einstieg');
  await foto(seite, 'einstieg-angebot');
  await seite.click('#einstieg-start');
  // G richtig, M falsch: Vorschlag Silber. Ein Versuch, keine Hilfekärtchen, keine Münzen.
  for (let i = 0; i < 8; i++) {
    await seite.waitForSelector('section.aufgabe');
    assert.equal(await seite.locator('aside.hilfen').count(), 0);
    assert.match(await seite.innerText('.einstiegmarke'), /Einstiegscheck \d von \d/);
    if (i === 0) await foto(seite, 'einstieg-aufgabe');
    const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
    await antworte(seite, pool.aufgaben.find((a) => a.id === id).niveau === 'G');
    await seite.waitForSelector('.ergebnis.neutral');
    if (await seite.locator('#einstieg-fertig').count()) break;
    await weiter(seite, '#weiter');
  }
  assert.match(await seite.innerText('#einstieg-fertig'), /Unser Vorschlag: Spiel um Silber/);
  assert.equal(await seite.locator('.ergebnis .plus').count(), 0, 'keine Münzen im Einstiegscheck');
  await seite.waitForTimeout(800);
  await foto(seite, 'einstieg-fertig');
  await seite.click('#einstieg-krone');
  await seite.waitForSelector('svg.regionskarte');
  assert.equal(await seite.getAttribute('.kronenwahl button[data-krone="G"]', 'aria-pressed'), 'true');
  assert.equal(await seite.locator('#einstieg').count(), 0);

  // Grundlagen-Schleife (ADR 0015): Subtrahieren S2 klappt auf Silber nicht. Nach vier ungelösten Aufgaben geht es zur Grundlage.
  await seite.locator('.meilenstein .stein').nth(2).click();
  await seite.locator('.lernziele li').nth(1).locator('button').click();
  for (let i = 0; i < 4; i++) {
    await seite.waitForSelector('section.aufgabe');
    assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.3\.3-S2-G/);
    await antworte(seite, false); await seite.waitForSelector('.hinweis');
    await antworte(seite, false); await seite.waitForSelector('.ergebnis.falsch');
    assert.equal(await seite.locator('#bruecke-angebot').count(), 0, 'auf Silber gibt es keine Brücke');
    assert.equal(await seite.locator('#krone-wechseln').count(), 0, 'und keinen Vorschlag, um Bronze zu spielen');
    if (i < 3) await weiter(seite, '#weiter');
  }
  assert.match(await seite.innerText('#grundlage-beginnt'), /Wir üben erst die Grundlage\./);
  await seite.waitForTimeout(800);
  await foto(seite, 'grundlage-beginnt');
  for (let i = 0; i < 3; i++) {
    await weiter(seite, '#weiter');
    await seite.waitForSelector('section.aufgabe #pruefen');
    assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.3\.3-S2-F/);
    assert.match(await seite.innerText('#grundlage-marke'), /Grundlage/);
    assert.equal(await seite.locator('.punkte i.voll').count(), i);
    if (i === 0) await foto(seite, 'grundlage-aufgabe');
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
  }
  assert.match(await seite.innerText('#grundlage-endet'), /Jetzt klappt auch der nächste Schritt\.[\s\S]*wieder um Silber/);
  await seite.waitForTimeout(800);
  await foto(seite, 'grundlage-endet');
  await weiter(seite, '#weiter');
  await seite.waitForSelector('section.aufgabe #pruefen');
  assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.3\.3-S2-G/);
  assert.equal(await seite.locator('#grundlage-marke').count(), 0);
  {
    const g = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-EINS.json'))).grundlage['5.3.3-S2'];
    assert.deepEqual([g.aktiv, g.mal], [false, 1]);
  }

  // Brücke: Auf Gold bietet das Dashboard bei einem wackeligen Lernziel drei Aufgaben zur Voraussetzung an.
  await seite.click('#zurueck');
  await seite.waitForSelector('svg.regionskarte');
  await seite.locator('.meilenstein .stein').nth(2).click();
  await seite.click('.kronenwahl button[data-krone="M"]');
  await seite.locator('.lernziele li').nth(1).locator('button').click();
  await seite.waitForSelector('section.aufgabe');
  assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.3\.3-S2-M/);
  await antworte(seite, false); await seite.waitForSelector('.hinweis');
  await antworte(seite, false); await seite.waitForSelector('.ergebnis.falsch');
  assert.match(await seite.innerText('#bruecke-angebot'), /Wie wäre es mit einer Brücke\?/);
  await seite.waitForTimeout(800); // Einblenden abwarten
  await foto(seite, 'bruecke-angebot');
  await seite.click('#bruecke-start');
  for (let i = 0; i < 3; i++) {
    await seite.waitForSelector('section.aufgabe');
    assert.match(await seite.innerText('.brueckenmarke'), new RegExp(`Brücke ${i + 1} von 3`));
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
    if (i < 2) await weiter(seite, '#weiter');
  }
  assert.match(await seite.innerText('#bruecke-fertig'), /Brücke geschafft!\s+3 von 3 richtig/);
  await foto(seite, 'bruecke-fertig');
  await weiter(seite, '#weiter');
  await seite.waitForSelector('section.aufgabe');
  assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), /^5\.3\.3-S2/);
  const gespeichert = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-EINS.json')));
  assert.equal(gespeichert.bruecken.length, 1);
  assert.equal(gespeichert.einstieg['5.3'].empfehlung, 'G');
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
  // Im Fokus-Modus zeigt die Kopfzeile nur Speicherfehler (ADR 0016): auf den Versuch in der Datei warten.
  assert.equal(await seite.innerText('#speicherstatus'), '');
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
  // Lernen sichtbar machen (ADR 0017): gefestigt, Filter, Heatmap nach Fehlvorstellung.
  assert.ok(await seite.locator('.heatmap td.zelle.gefestigt').count() > 0, 'Rückblick nach mehr als 7 Tagen festigt');
  await seite.click('[data-filter=hilfe]');
  const hilfeZeilen = await seite.locator('.heatmap tbody tr').count();
  assert.ok(hilfeZeilen > 0 && hilfeZeilen < 14, `Filter viel Hilfe: ${hilfeZeilen}`);
  assert.match(await seite.innerText('.filtergruende'), /von \d+\)/);
  await seite.locator('.karte:has(#ls-filter)').screenshot(bilder ? { path: `${bilder}/lehrer-filter-hilfe.png` } : {});
  await seite.click('[data-filter=ueber]');
  assert.match(await seite.innerText('.filtergruende'), /Ida Schneider: \d+-mal sicher falsch/);
  await seite.click('[data-filter=alle]');
  assert.equal(await seite.locator('.heatmap tbody tr').count(), 14);
  await seite.click('[data-sicht=fehler]');
  await seite.waitForSelector('.fehlermap');
  assert.equal(await seite.locator('.fehlermap tbody tr').count(), 14);
  assert.ok(await seite.locator('.fehlermap td.fv-aktiv').count() > 0);
  assert.ok(await seite.locator('.fehlermap td.fv-ueberwunden').count() > 0);
  await seite.locator('.karte:has(#ls-filter)').screenshot(bilder ? { path: `${bilder}/lehrer-fehlvorstellungen.png` } : {});
  await seite.click('[data-sicht=lernziele]');
  // Kompetenzprofil der Klasse (ADR 0017): fünf Achsen, Tabelle daneben.
  assert.equal(await seite.locator('#kompetenz-klasse .kompetenztabelle tbody tr').count(), 5);
  assert.equal(await seite.locator('#kompetenz-klasse svg.netz polygon.schueler').count(), 1);
  await seite.locator('#kompetenz-klasse').screenshot(bilder ? { path: `${bilder}/lehrer-kompetenz-klasse.png` } : {});
  // Selbsteinschätzung: Tendenz je Schüler, Impuls bei Carla (dreimal unterschätzt), keine Kronen beim Lehrer.
  assert.equal(await seite.locator('#selbsteinschaetzung tbody tr').count(), 14);
  assert.match(await seite.innerText('#selbsteinschaetzung'), /eher zu niedrig[\s\S]*eher zu hoch|eher zu hoch[\s\S]*eher zu niedrig/);
  await seite.locator('#selbsteinschaetzung').screenshot(bilder ? { path: `${bilder}/lehrer-selbsteinschaetzung.png` } : {});
  assert.equal(await seite.locator('.krone').count(), 0, 'die Lehrkraft sieht Niveaustufen, keine Kronen');
  // Vorwissen aus dem Einstiegscheck: 13 gemacht, einer übersprungen, Anteil je Meilenstein.
  assert.match(await seite.innerText('#vorwissen'), /13 Schüler haben den Einstiegscheck gemacht, 1 übersprungen/);
  assert.equal(await seite.locator('#vorwissen .balkenliste li').count(), 5);
  await seite.locator('#vorwissen').screenshot(bilder ? { path: `${bilder}/lehrer-vorwissen.png` } : {});
  await seite.locator('.heatmap [data-lernziel]').first().click();
  await seite.waitForSelector('.vierspaltig');
  assert.equal(await seite.locator('.gruppenliste').count(), 6);
  assert.ok(await seite.locator('#hilfebedarf tbody tr').count() > 0);
  assert.match(await seite.innerText('#baut-auf'), /Baut auf/);
  // Tafelbild: eine Aufgabe mit den häufigsten falschen Antworten, ohne Namen, Lösung auf Knopfdruck.
  await seite.locator('[data-tafelbild]').first().click();
  await seite.waitForSelector('.tafelbild');
  assert.equal(await seite.locator('.tafelbild .tafel-loesung').count(), 0);
  await seite.click('#tafel-loesung');
  assert.match(await seite.innerText('.tafel-loesung'), /Lösung:/);
  const namen = Object.values(JSON.parse(await seite.evaluate(() => JSON.stringify(window.MK_BEISPIEL_NAMEN ?? {}))));
  for (const n of namen) assert.doesNotMatch(await seite.innerText('.tafelbild'), new RegExp(n));
  await foto(seite, 'lehrer-tafelbild');
  await seite.click('#tafel-zu');
  assert.equal(await seite.locator('.tafelbild').count(), 0);
  await foto(seite, 'lehrer-lernziel');
  await seite.click('.brotkrumen button');
  await seite.locator('[data-schueler-zeile]').first().click();
  await seite.waitForSelector('.weg');
  assert.equal(await seite.locator('.schuelerseite .kennzahl').count(), 3);
  await foto(seite, 'lehrer-schueler');
  assert.ok(await seite.locator('#versuchsverlauf tbody tr').count() > 0);
  assert.equal(await seite.locator('#kompetenz-schueler svg.netz polygon.klasse').count(), 1);
  await seite.locator('#kompetenz-schueler').screenshot(bilder ? { path: `${bilder}/lehrer-kompetenz-schueler.png` } : {});
  assert.match(await seite.innerText('#versuchsverlauf thead'), /1\. Versuch[\s\S]*2\. Versuch/);
  await seite.locator('#versuchsverlauf').screenshot(bilder ? { path: `${bilder}/lehrer-versuchsverlauf.png` } : {});
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
  assert.ok(await seite.locator('#einstieg-karte [data-einstieg-pflicht]').count() >= 2);
  await seite.locator('#einstieg-karte').screenshot(bilder ? { path: `${bilder}/lehrer-einstieg-pflicht.png` } : {});
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
  await weiter(schueler, '#weiter');
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
  await lehrer.click(`[data-sperre="5.4.1|${aylin}"]`);
  await warteAuf((k) => k.sperren?.['5.4.1']?.includes(aylin));
  await schueler.click('#zurueck');
  await schueler.waitForSelector('.tafel.gesperrt', { timeout: 15000 });
  assert.equal(await schueler.locator('#aufbrechen').count(), 0);
  await foto(schueler, 'schueler-meilenstein-gesperrt');
  await lehrer.click(`[data-sperre="5.4.1|${aylin}"]`);
  await schueler.waitForSelector('#aufbrechen', { timeout: 15000 });
  assert.equal(JSON.parse(await lies(`5a/${aylin}.json`)).abbrueche.length, 1);

  // Spielpause wirkt beim Schüler.
  await lehrer.check('#spielpause');
  await warteAuf((k) => k.spielpause === true);

  // Expedition: Die Lehrkraft setzt ein Ziel, die Schülerin sieht den Stand der Klasse und ihren eigenen Beitrag.
  await lehrer.click('[data-tab=verwaltung]');
  await lehrer.fill('#expedition-ziel', '2');
  await lehrer.click('#expedition-starten');
  await warteAuf((k) => k.expedition?.ziel === 2);
  await schueler.click('nav button:has-text("Schlossgarten")');
  await schueler.waitForSelector('#expedition', { timeout: 15000 });
  assert.match(await schueler.innerText('#expedition-stand'), /Die Klasse hat \d von 2\. Davon/);
  await foto(schueler, 'schueler-expedition');
  assert.match(await lehrer.innerText('#expedition'), /von 2 Expeditionszeichen/);

  // Sicherheitsangabe: Die Lehrkraft schaltet sie ein, die Schülerin prüft mit „ich bin sicher“ und bekommt bei Fehlern den deutlichen Hinweis.
  await lehrer.check('#sicherheitsangabe');
  await warteAuf((k) => k.sicherheitsangabe === true);
  await lehrer.check('[data-einstieg-pflicht="5.4"]');
  await warteAuf((k) => k.einstiegPflicht?.includes('5.4'));
  await schueler.waitForTimeout(11000); // das Schüler-Dashboard liest die Klassendatei alle 10 Sekunden
  await schueler.click('#weiter-wandern');
  await schueler.waitForSelector('#pruefen-unsicher', { timeout: 15000 });
  await antworte(schueler, false);
  await schueler.waitForSelector('#ueberraschung');
  assert.match(await schueler.innerText('#ueberraschung'), /Überraschung! Du warst dir sicher/);
  assert.equal(await schueler.locator('#pruefen-unsicher').count(), 0, 'nur beim ersten Versuch');
  await foto(schueler, 'schueler-sicher-falsch');
  await schueler.click('#zurueck');
  // Warten, bis der Abbruch im Speicherstand steht, damit das folgende Backup nicht überholt wird.
  for (let i = 0; i < 150 && JSON.parse(await lies(`5a/${aylin}.json`)).abbrueche.length < 2; i++) await lehrer.waitForTimeout(100);
  assert.equal(JSON.parse(await lies(`5a/${aylin}.json`)).abbrueche.length, 2);

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

// ---------- 7b. Konzentration (ADR 0016): Fokus-Modus, Tastatur, Wegstück, Seitenblick, Rast ----------
{
  const seite = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  const ms = pool.kapitel.find((k) => k.id === '5.3').unterkapitel.find((u) => u.id === '5.3.3');
  const [erstes] = ms.lernziele.filter((l) => pool.aufgaben.some((a) => a.lernziel === l.id && a.niveau === 'M'));
  const tag = new Date().toLocaleDateString('sv-SE');
  const stand = { ...leererStand('5A-FOKU'), lernziele: { [erstes.id]: { erreichtAm: t0 } },
    wegstuecke: [0, 1, 2].map(() => ({ t: t0, bis: t0, tag, richtig: 5, gesamt: 5, muenzen: 100 })) };
  await mitStand(seite, stand);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-foku');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.3"]');
  await seite.click('#einstieg-ueberspringen');
  await seite.locator('.meilenstein .stein').nth(2).click();
  await seite.locator('.lernziele li').nth(1).locator('button').click(); // am zweiten Lernziel üben, das erste hat schon sein Siegel
  await seite.waitForSelector('section.aufgabe');
  // Fokus-Modus: schmale Kopfzeile, keine Zähler, keine Versionsanzeige; Wegstück 1 von 5; das Eingabefeld hat den Fokus.
  assert.equal(await seite.locator('.kopf.fokus').count(), 1);
  assert.equal(await seite.locator('#muenzen, #siegel, #kronen, .kopf nav').count(), 0);
  assert.equal(await seite.locator('#version').isVisible().catch(() => false), false);
  assert.match(await seite.innerText('#wegstueck'), /Aufgabe 1 von 5/);
  await seite.waitForFunction(() => document.activeElement?.closest('form.antwort'));
  await foto(seite, 'fokus-aufgabe');
  // Erste Aufgabe zweimal falsch: Lösung mit Beispiel und Lösungsschritt. Der Tipp lag nach dem ersten Fehlversuch unter dem Eingabefeld.
  await antworte(seite, false, { taste: true }); await seite.waitForSelector('.hinweis');
  assert.equal(await seite.locator('.karte .kaertchen .kaertchen-offen').count(), 1);
  assert.match(await seite.innerText('.hinweis'), /Unten liegt jetzt ein Tipp/);
  await foto(seite, 'fokus-tipp-unten');
  await antworte(seite, false, { taste: true }); await seite.waitForSelector('.ergebnis.falsch');
  assert.ok(await seite.locator('#so-geht-es .kaertchen-offen').count() >= 1);
  await foto(seite, 'fokus-so-geht-es');
  // Enter führt weiter; zu schnell nach dem Ergebnis zählt ein Enter noch nicht.
  await seite.waitForFunction(() => document.activeElement?.id === 'weiter');
  await seite.keyboard.press('Enter');
  assert.equal(await seite.locator('.ergebnis').count(), 1, 'doppeltes Enter überspringt die Lösung nicht');
  await seite.waitForTimeout(700);
  await seite.keyboard.press('Enter');
  await seite.waitForSelector('section.aufgabe #pruefen');
  for (let i = 2; i <= 5; i++) {
    assert.match(await seite.innerText('#wegstueck'), new RegExp(`Aufgabe ${i} von 5`));
    // Die vierte Aufgabe ist der Seitenblick auf das schon besiegelte Lernziel.
    if (i === 4) {
      assert.equal(await seite.locator('#seitenblick-marke').count(), 1);
      assert.match(await seite.getAttribute('section.aufgabe', 'data-aufgabe'), new RegExp(`^${erstes.id.replace(/\./g, '\\.')}`));
      await foto(seite, 'seitenblick');
    } else assert.equal(await seite.locator('#seitenblick-marke').count(), 0);
    await seite.waitForFunction(() => document.activeElement?.closest('form.antwort'));
    await antworte(seite, true, { taste: true });
    await seite.waitForSelector('.ergebnis.richtig');
    if (i === 2) await foto(seite, 'fokus-richtig');
    await seite.waitForTimeout(700);
    await seite.keyboard.press('Enter');
  }
  // Abschluss des vierten Wegstücks heute: Bilanz und Rast.
  await seite.waitForSelector('#wegstueck-ende');
  assert.match(await seite.innerText('#wegstueck-ende'), /Wegstück geschafft[\s\S]*4 von 5 richtig/);
  assert.equal(await seite.locator('#wegstueck-ende .wegpunkte i.voll').count(), 4);
  assert.match(await seite.innerText('#rast'), /Zeit für eine Rast/);
  assert.equal(await seite.innerText('#weiter'), 'Rast überspringen');
  await foto(seite, 'wegstueck-rast');
  await seite.click('#weiter');
  await seite.waitForSelector('section.aufgabe #pruefen');
  assert.match(await seite.innerText('#wegstueck'), /Aufgabe 1 von 5/);
  const gespeichert = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-FOKU.json')));
  assert.equal(gespeichert.wegstuecke.length, 4);
  assert.equal(gespeichert.wegstuecke.at(-1).rast, 'uebersprungen');
  assert.equal(gespeichert.versuche.filter((v) => v.seitenblick).length, 1);
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 7b. Lernen sichtbar machen (ADR 0017): gefestigt und erstmals ohne Hilfe ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  const tag = 86400000, vor = (ms) => new Date(Date.now() - ms).toISOString();
  const stand = leererStand('5A-SICH');
  const k1 = pool.aufgaben.filter((a) => a.lernziel === '5.3.1-K1' && a.niveau === 'M');
  const k2 = pool.aufgaben.find((a) => a.lernziel === '5.3.1-K2' && a.niveau === 'M');
  const versuch = (a, t, extra = {}) => ({ t, aufgabe: a.id, lernziel: a.lernziel, niveau: a.niveau, richtig: true, versuche: 1, eingaben: [String(a.loesung ?? '')], fehlvorstellungen: [], hilfen: 0, dauer: 30, muenzen: 3, ...extra });
  stand.versuche = [...k1.slice(0, 3).map((a) => versuch(a, vor(10 * tag), { afb: a.afb })), versuch(k1[3], vor(2 * tag), { seitenblick: true }),
    versuch(k2, vor(3600000), { hilfen: 2, karten: ['tipp', 'beispiel'] })];
  stand.lernziele = { '5.3.1-K1': { erreichtAm: vor(10 * tag) } };
  // Ein überwundener Fehler für die Aha-Momente: einmal falsch, danach dreimal richtig ohne ihn.
  const s2 = pool.aufgaben.filter((a) => a.lernziel === '5.3.3-S2' && a.niveau === 'G');
  stand.versuche.unshift(versuch(s2[0], vor(5 * tag), { richtig: false, versuche: 2, fehlvorstellungen: ['sub-uebertrag-vergessen'] }),
    ...s2.slice(1, 4).map((a, i) => versuch(a, vor(5 * tag - (i + 1) * 60000))));
  stand.einstieg = { '5.3': { uebersprungen: vor(10 * tag) } };
  await mitStand(seite, stand);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-sich');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="5.3"]');
  await seite.waitForSelector('svg.regionskarte');
  await seite.click('.meilenstein[aria-label^="Meilenstein Kopfrechnen"] .stein');
  await seite.waitForSelector('.lernziele');
  assert.equal(await seite.locator('.lernziele li.gefestigt .fest').count(), 1);
  assert.match(await seite.innerText('.lernziele li.gefestigt'), /gefestigt/);
  await foto(seite, 'meilenstein-gefestigt');
  await seite.click('#aufbrechen');
  await seite.waitForSelector('section.aufgabe[data-aufgabe^="5.3.1-K2"]');
  await antworte(seite, true);
  await seite.waitForSelector('.ergebnis.richtig');
  assert.match(await seite.innerText('#ohne-hilfe'), /ohne Beispiel und Lösungsschritt/);
  await seite.waitForTimeout(800);
  await foto(seite, 'erstmals-ohne-hilfe');
  // Aha-Momente beim Wappen: Zeichen in der Kopfzeile, Liste, danach gesehen.
  await seite.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Zur Regionskarte')?.click());
  await seite.waitForSelector('#aha-neu');
  assert.match(await seite.innerText('#aha-neu'), /1/);
  await seite.click('.kopf nav button:has-text("Wappen")');
  await seite.waitForSelector('#aha');
  assert.match(await seite.innerText('#aha'), /Du denkst jetzt an den Übertrag in der nächsten Stelle\.[\s\S]*neu/);
  await seite.locator('#aha').screenshot(bilder ? { path: `${bilder}/aha-momente.png` } : {});
  assert.equal(await seite.locator('#aha-neu').count(), 0);
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 9. Münzen einlösen: Wappenschrank, Ehrenzeichen, Spiele, Bestenliste (ADR 0018) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  const heute = new Date(Date.now() - 60000).toISOString();
  // 30 Siegel (Rang Hofkartograf), 2.000 Münzen, 25 gute Wegstücke: Der Wegstern ist verdient.
  const ich = { ...leererStand('5A-WAPP'), muenzen: 2000, lernziele: Object.fromEntries(Array.from({ length: 30 }, (_, i) => [`x.${i}`, { erreichtAm: heute }])),
    wegstuecke: Array.from({ length: 25 }, () => ({ t: heute, bis: heute, tag: '2026-01-05', richtig: 5, gesamt: 5, muenzen: 100 })),
    spiele: [{ spiel: 'botenritt', t: heute, punkte: 9 }], beiname: { vorne: 'Kluger', hinten: 'Otter' } };
  await mitStand(seite, ich);
  // Mitschüler mit Wappen und Ergebnissen dieser Woche.
  const andere = [['5A-BBBB', 'blau', ['adler'], 14], ['5A-CCCC', 'gruen', ['turm', 'stern'], 11], ['5A-DDDD', 'gold', ['loewe'], 7], ['5A-EEEE', 'schwarz', ['eule'], 21, true]];
  for (const [code, farbe, zeichen, punkte, aus] of andere) {
    await mitStand(seite, { ...leererStand(code), wappen: { farbe, zeichen, gekauft: ['rot', farbe, ...zeichen] }, spiele: [{ spiel: 'botenritt', t: heute, punkte }], ...(aus && { bestenlisteAus: true }) });
  }
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-wapp');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.match(await seite.innerText('#aha-neu'), /1/, 'ein neues Ehrenzeichen wartet beim Wappen');
  await seite.click('.kopf nav button:has-text("Wappen")');
  await seite.waitForSelector('#neue-ehre');
  assert.match(await seite.innerText('#neue-ehre'), /Wegstern/);
  // Hauptzeichen und zwei Beizeichen kaufen und anbringen.
  for (const id of ['blau', 'loewe', 'stern', 'schluessel']) await seite.click(`[data-teil=${id}]:has-text("kaufen")`);
  assert.equal(await seite.innerText('#muenzen'), String(2000 - 60 - 350 - 90 - 120));
  await seite.click('[data-teil=wegstern]');
  assert.equal(await seite.locator('.werkbank svg [class^=zeichen-]').count(), 3, 'ein Hauptzeichen und zwei Beizeichen');
  await seite.click('[data-haupt=stern]');
  assert.equal(await seite.getAttribute('.werkbank svg g[class^=zeichen-]', 'class'), 'zeichen-stern');
  await seite.click('[data-haupt=loewe]');
  assert.match(await seite.innerText('#ausblick'), /Schildteilung öffnet sich in Klasse 6/);
  assert.match(await seite.innerText('.teile-liste >> nth=0'), /Gold[\s\S]*Ab Rang Hofkartograf|Gold/);
  await foto(seite, 'wappenschrank');
  await seite.locator('.werkbank').screenshot(bilder ? { path: `${bilder}/wappen-werkbank.png` } : {});
  // Spiele: Bestenliste mit Wappen und Beinamen, die Ausgeblendete fehlt.
  await seite.click('#nav-spiele');
  await seite.waitForSelector('#bestenliste-botenritt li');
  const liste = await seite.innerText('#bestenliste-botenritt');
  assert.match(liste, /1\.\s*\S+ \S+\s*14[\s\S]*Kluger Otter\s*9/);
  assert.doesNotMatch(liste, /21/, 'wer sich ausblendet, steht nicht in der Liste');
  assert.doesNotMatch(liste, /5A-/);
  await foto(seite, 'spiele');
  await seite.locator('#spiel-botenritt').screenshot(bilder ? { path: `${bilder}/bestenliste.png` } : {});
  // Botenritt: Der Reiter läuft geradeaus gegen den Rand, dann ist die Runde vorbei.
  await seite.click('[data-spiel=botenritt]');
  await seite.waitForSelector('#spielfeld');
  await seite.waitForTimeout(700);
  await foto(seite, 'botenritt');
  await seite.waitForSelector('#spiel-ende', { timeout: 15000 });
  assert.match(await seite.innerText('#spiel-ende'), /Runde vorbei!/);
  const gespeichert = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-WAPP.json')));
  assert.equal(gespeichert.spiele.filter((e) => e.spiel === 'botenritt').length, 2);
  assert.equal(gespeichert.muenzen, 2000 - 620 - 100);
  // Burgmauer: Armbrust schießt, Raben fliegen.
  await seite.click('button:has-text("Zu den Spielen")');
  await seite.click('[data-spiel=burgmauer]');
  await seite.waitForSelector('#spielfeld');
  await seite.keyboard.down('ArrowUp');
  await seite.keyboard.down('ArrowLeft');
  await seite.waitForTimeout(2500);
  await seite.keyboard.up('ArrowLeft');
  await seite.waitForTimeout(1200);
  await foto(seite, 'burgmauer');
  await seite.keyboard.up('ArrowUp');
  await seite.click('#nav-spiele');
  await seite.waitForSelector('.spiele-liste');
  // Steinmetz, Grenzlauf, Kellerjagd (ADR 0019): jedes Spiel läuft an und zeigt seine Punkt-Einheit.
  for (const [id, einheit, tasten] of [['steinmetz', 'Reihen', ['ArrowLeft', 'ArrowUp', 'ArrowDown']], ['grenzlauf', 'Meilen', ['ArrowUp']], ['kellerjagd', 'Rollen', ['ArrowLeft', 'ArrowUp']]]) {
    await seite.click(`[data-spiel=${id}]`);
    await seite.waitForSelector('#spielfeld');
    for (const t of tasten) { await seite.keyboard.press(t); await seite.waitForTimeout(400); }
    await seite.waitForTimeout(id === 'grenzlauf' ? 2600 : 1200);
    assert.match(await seite.innerText('.spielanzeige'), new RegExp(`Noch \\d+ s · ${einheit}: \\d+`));
    await foto(seite, id);
    await seite.locator('#spielfeld').screenshot(bilder ? { path: `${bilder}/${id}.png` } : {});
    await seite.click('#nav-spiele');
    await seite.waitForSelector('.spiele-liste');
  }
  assert.equal(JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-5a/5A-WAPP.json'))).muenzen, 2000 - 620 - 100 - 100 - 300);
  // Beiname wählen.
  // Beiname ändern: die erste Änderung ist frei, dann 50 Münzen (ADR 0020).
  const muenzenVorher = 2000 - 620 - 100 - 100 - 300;
  const standJetzt = async () => JSON.parse(await seite.evaluate(() => localStorage.getItem("mk-demo-5a/5A-WAPP.json")));
  await seite.selectOption('#beiname-vorne', 'Flinker');
  assert.doesNotMatch(await seite.innerText('#bestenliste-botenritt'), /Flinker Otter/, 'erst der Knopf speichert');
  assert.match(await seite.innerText('#beiname-aendern'), /kostenlos/);
  await seite.click('#beiname-aendern');
  assert.match(await seite.innerText('#beiname-frage'), /Danach kostet jede Änderung 50 Münzen/);
  await seite.click('#beiname-ja');
  assert.match(await seite.innerText('#bestenliste-botenritt'), /Flinker Otter/);
  await seite.selectOption('#beiname-hinten', 'Fuchs');
  assert.match(await seite.innerText('#beiname-aendern'), /50 Münzen/);
  await seite.click('#beiname-aendern');
  await foto(seite, 'beiname-frage');
  await seite.locator('#beiname').screenshot(bilder ? { path: `${bilder}/beiname-aendern.png` } : {});
  await seite.click('#beiname-ja');
  assert.match(await seite.innerText('#bestenliste-botenritt'), /Flinker Fuchs/);
  await seite.waitForFunction((m) => JSON.parse(localStorage.getItem('mk-demo-5a/5A-WAPP.json')).muenzen === m, muenzenVorher - 50);
  assert.equal((await standJetzt()).muenzen, muenzenVorher - 50);
  assert.deepEqual(fehler, []);
  await seite.close();
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
