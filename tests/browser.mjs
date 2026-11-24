// Fährt das gebaute Schüler-Dashboard in einem echten Browser durch.
// Aufruf: node tools/baue.mjs && node tests/browser.mjs   (braucht Playwright)
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { schreibe, artVon, faktorVon, EINHEITEN } from '../src/schueler/groessen.js';

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
// Der Aufgabentester des Administrators zählt die Aufgaben aller Klassenstufen (seit 0.43 auch Klasse 6).
const alleAufgaben = pool.aufgaben.length + JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8')).aufgaben.length;
const browser = await chromium.launch();
// Seit 0.32 sind die Karten in Lehrer- und Administrator-Dashboard anfangs zugeklappt. Die Tests arbeiten mit allem
// offen; das Auf- und Zuklappen selbst prüft Teil 8.
const alleOffen = () => { try { for (const n of ['lehrer', 'admin']) if (!localStorage.getItem(`mk-aufgeklappt-${n}`)) localStorage.setItem(`mk-aufgeklappt-${n}`, '{"*":true}'); } catch { /* about:blank */ } };
{
  const neueSeite = browser.newPage.bind(browser), neuerKontext = browser.newContext.bind(browser);
  browser.newPage = async (o) => { const p = await neueSeite(o); await p.addInitScript(alleOffen); return p; };
  browser.newContext = async (o) => { const k = await neuerKontext(o); await k.addInitScript(alleOffen); return k; };
}
let nr = 0;
// Bild eines Elements, das sich alle paar Sekunden neu zeichnet: aus einem Bild der ganzen Seite ausgeschnitten.
const fotoStabil = async (seite, sel, name) => {
  if (!bilder) return;
  const box = await seite.evaluate((q) => { const r = document.querySelector(q)?.getBoundingClientRect(); return r && { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; }, sel);
  if (box) await seite.screenshot({ path: `${bilder}/${name}.png`, fullPage: true, clip: box });
};
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

// Kapitel 6: tippt eine Größe als Zahl mit Einheit ein. Geht der Wert in der Einheit der Aufgabe nicht als Kommazahl auf (Zeit), nimmt der Test eine kleinere.
async function tippeGroesse(ziel, auf, wert) {
  const passt = (e) => /^[\d\s\u00a0,]+\s\S+$/.test(schreibe(wert, e)) && schreibe(wert, e).split(/\s/).at(-1) === e;
  const einheit = passt(auf.einheit) ? auf.einheit : Object.keys(EINHEITEN).find((e) => artVon(e) === auf.groesse && (!auf.einheiten || auf.einheiten.includes(e)) && passt(e));
  assert.ok(einheit, `${auf.id}: keine Einheit für die Eingabe`);
  await ziel.locator('input[name=zahl]').fill(schreibe(wert, einheit).replace(/\s\S+$/, ''));
  if (auf.einheiten) await ziel.locator('select[name=einheit]').selectOption(einheit);
}

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
  } else if (auf.format === 'strichliste') {
    // Mit der Maus Striche setzen: auf F und G bündelt das Programm, ab M setzt das Kind den Querstrich selbst.
    for (const [i, z] of auf.zeilen.entries()) {
      const ziel = 'IIII/'.repeat(Math.floor(z.loesung / 5)) + 'I'.repeat(z.loesung % 5), start = 'IIII/'.repeat(Math.floor((z.start ?? 0) / 5)) + 'I'.repeat((z.start ?? 0) % 5);
      const knoepfe = auf.buendeln === 'selbst' ? [...ziel.slice(start.length)].map((c) => (c === '/' ? 'quer' : 'plus')) : Array(z.loesung - (z.start ?? 0)).fill('plus');
      if (!richtig && i === 0) knoepfe.push('plus');
      for (const k of knoepfe) await seite.click(`button.strichknopf[data-zeile="${i}"][data-knopf="${k}"]`);
    }
  } else if (auf.format === 'ordnen') {
    // Kapitel 2: Karte für Karte mit dem Knopf „nach links“ an ihren Platz schieben. Falsch ist die umgekehrte Reihenfolge.
    const ziel = richtig ? auf.loesung : [...auf.loesung].reverse();
    for (const [platz, karte] of ziel.entries()) {
      for (let k = 0; k < auf.karten.length; k++) {
        const jetzt = JSON.parse(await seite.inputValue('input[name=ordnung]'));
        const i = jetzt.indexOf(karte);
        if (i <= platz) break;
        await seite.click(`ol.ordnen li:nth-child(${i + 1}) button.links`);
      }
    }
    // Lag schon alles richtig, zählt erst eine Bewegung als Eingabe: einmal hin und zurück.
    if (await seite.evaluate(() => document.querySelector('input[name=ordnung]').dataset.bewegt !== '1')) {
      await seite.click('ol.ordnen li:nth-child(1) button.rechts');
      await seite.click('ol.ordnen li:nth-child(2) button.links');
    }
  } else if (auf.format === 'zeichen') {
    // Kapitel 2: über die Tasten auf dem Bildschirm tippen.
    for (const c of richtig ? auf.loesung : auf.loesung + auf.tasten[0]) await seite.locator('.zeichentasten button', { hasText: c }).first().click();
  } else if (auf.format === 'schaetzen') {
    await seite.fill('input[name=zahl]', String(richtig ? auf.loesung : auf.bereich[1] + 1));
  } else if (auf.format === 'zeichnen') {
    // Mit der Tastatur: Pos1 setzt auf 0, jeder Pfeil nach oben eine Linie höher.
    const d = auf.diagramm;
    for (const [i, sa] of d.saeulen.entries()) {
      if (!sa.offen) continue;
      const ziel = richtig ? sa.wert : sa.wert + (sa.wert + d.fein <= d.max ? d.fein : -d.fein);
      await seite.focus(`[data-saeule="${i}"]`);
      await seite.keyboard.press('Home');
      for (let k = 0; k < ziel / d.fein; k++) await seite.keyboard.press('ArrowUp');
    }
  } else if (auf.format === 'groesse') {
    await tippeGroesse(seite, auf, richtig ? auf.loesung : auf.loesung + faktorVon(auf.einheit));
  } else for (const [i, t] of auf.teile.entries()) {
    // Kapitel 6: Teilaufgaben einer Sachaufgabe können auch angekreuzt werden.
    if (t.optionen) for (const o of t.optionen) await seite.locator(`input[name="teil-${i}"][value="${o.text}"]`).setChecked(o.richtig === richtig).catch(() => {});
    else await seite.fill(`input[name="teil-${i}"]`, wert(t.loesung));
  }
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
  await seite.click('#wappen-knopf');
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
  // Startseite: Knopf „Weitermachen“ mit kleiner Zielzeile (0.37), ein Tipp führt direkt in die nächste Aufgabe. Dort liegt der Merkzettel bereit.
  assert.match(await seite.innerText('.etappe'), /Weitermachen[\s\S]*Daten und Diagramme · Strichlisten und Häufigkeitstabellen/);
  assert.equal(await seite.locator('.etappe .balken').count(), 0);
  await foto(seite, 'startseite-etappe');
  // Vor der ersten Aufgabe im Kapitel führt der Weg über den Einstiegscheck, den man überspringen darf.
  await seite.click('#weiter-wandern');
  await seite.waitForSelector('#einstieg');
  await seite.click('#einstieg-ueberspringen');
  assert.equal(await seite.locator('#einstieg').count(), 0);
  await seite.click('#aufbrechen');
  await seite.waitForSelector('section.aufgabe[data-aufgabe^="5.1.1-H1"]');
  assert.equal(await seite.locator('.merkzettel ul').isVisible(), false);
  await seite.click('.merkzettel summary');
  assert.match(await seite.innerText('.merkzettel'), /Bündeln: Vier Striche[\s\S]*Beispiel[\s\S]*Im Heft/);
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
  // Schriftlich multiplizieren: ohne Karo, alle Zeilen als echte Tabellenzeilen, jede Spalte genau untereinander,
  // über dem Ergebnis kleine Übertragsfelder, die nicht bewertet werden (antworte füllt sie nicht aus und löst trotzdem richtig).
  await finde('Multiplizieren', 2, 'raster', 'malraster', async (a) => {
    assert.equal(await seite.locator('table.malraster').count(), 1);
    assert.equal(await seite.locator('table.malraster').evaluate((t) => getComputedStyle(t).backgroundImage), 'none');
    assert.deepEqual([...new Set(await seite.locator('table.malraster tr').evaluateAll((z) => z.map((x) => getComputedStyle(x).display)))], ['table-row']);
    const ergebnis = a.tabelle.zeilen.at(-1), erste = ergebnis.findIndex((c) => typeof c === 'object');
    assert.equal(await seite.locator('table.malraster input.uebertrag').count(), ergebnis.length - 1 - erste);
    const mitten = await seite.locator('table.malraster tr').evaluateAll((z) => z.map((x) => [...x.cells].map((c) => Math.round(c.getBoundingClientRect().x + c.getBoundingClientRect().width / 2))));
    for (const zeile of mitten) assert.deepEqual(zeile, mitten[0]);
    assert.equal(await seite.locator('.bildrahmen input.ziffer').count(), Object.keys(a.luecken).length);
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
    wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [], heftNr: 8, heftSeitCheck: 8, heftchecks: [],
    einstieg: { '5.1': { uebersprungen: true } } }; // Ohne Vorgabe beginnt die Etappe in Kapitel 1; der Einstiegscheck dort ist übersprungen.
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
  // Kapitel 1 und 2 sind schon gemeistert: Die Etappe führt nach Kapitel 3, um dessen Einstiegscheck und Grundlagen es hier geht.
  {
    const t = new Date(Date.now() - 86400000).toISOString();
    const lernziele = Object.fromEntries(pool.kapitel.slice(0, 2).flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, { erreichtAm: t }]));
    const stand = { version: 2, code: '5A-EINS', klasse: '5a', erstellt: t, geaendert: t, muenzen: 0, niveau: {}, niveauMarke: {}, lernziele, versuche: [], hilferuf: null, hilferufe: [],
      wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [], heftNr: 0, heftSeitCheck: 0, heftchecks: [],
      einstieg: { '5.1': { uebersprungen: true }, '5.2': { uebersprungen: true } } };
    await seite.addInitScript((text) => { if (!localStorage.getItem('mk-demo-5a/5A-EINS.json')) localStorage.setItem('mk-demo-5a/5A-EINS.json', text); }, JSON.stringify(stand));
  }
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
  assert.equal(await seite.locator('.tabs.bereiche > button').count(), 4);
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
  // Seit 0.35 nur die festen Auswertungen und anfangs das Aktuelle Kapitel; hat dort noch niemand gearbeitet (Beispielklasse: 5.4), die Kapitel mit Daten.
  assert.equal(await seite.locator('#kompetenz-klasse, #selbsteinschaetzung, #vorwissen, #heft-sicherheit, #hoftitel-lehrer, #meilensteine-sperren').count(), 0);
  assert.equal(await seite.inputValue('#ls-kapitel'), 'daten');
  assert.match(await seite.innerText('#ausgeblendet'), /^4 Auswertungen ausgeblendet/);
  assert.ok(await seite.locator('#foerderung #ls-filter').count());
  assert.ok(await seite.locator('#wiederholen .stapel li').count() > 0);
  await foto(seite, 'lehrer-lernstand-schlank');
  await seite.click('#ansicht-anpassen');
  assert.equal(await seite.locator('#ansicht fieldset').count(), 3);
  await foto(seite, 'lehrer-ansicht-anpassen');
  for (const schalter of await seite.locator('#ansicht input[data-auswertung]').all()) await schalter.check();
  await seite.click('#ansicht-fertig');
  assert.equal(await seite.locator('#ausgeblendet').count(), 0);
  await seite.selectOption('#ls-kapitel', 'daten');
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
  await seite.locator('#wer-steht-wo').screenshot(bilder ? { path: `${bilder}/lehrer-fehlvorstellungen.png` } : {});
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
  // Meilensteine für eine ganze Gruppe sperren (seit 0.35 unter Klasse › Unterricht), Hoftitel unter Klasse › Schüler.
  await seite.click('[data-tab=klasse]');
  await seite.click('[data-abschnitt=schueler]');
  assert.ok(await seite.locator('#hoftitel-lehrer tbody tr').count() >= 1);
  assert.match(await seite.innerText('#hoftitel-lehrer tbody tr >> nth=0'), /^1\s+Klassenkönig/);
  await seite.locator('#hoftitel-lehrer').screenshot(bilder ? { path: `${bilder}/lehrer-hoftitel.png` } : {});
  await seite.click('[data-abschnitt=unterricht]');
  await seite.waitForSelector('#meilensteine-sperren:not(.zu)'); // seit 0.32 eine aufklappbare Karte, im Test offen
  await seite.selectOption('#pfad-kapitel', '5.3');
  await seite.selectOption('[data-masse="5.3.3"]', 'zu|alle');
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 14);
  await seite.locator('.sperre.zu').first().click();
  await seite.waitForFunction(() => document.querySelectorAll('.sperre.zu').length === 13);
  await foto(seite, 'lehrer-meilensteine-sperren');
  // Aufgaben: Auswertung nach AFB, Typ und Linie, Liste mit Sichten und Filtern.
  await seite.click('[data-tab=aufgaben]');
  await seite.waitForSelector('#aufg-liste');
  // Seit 0.35: oben die Aufgaben zum Ansehen mit Tafelbild, darunter sechs Spalten; Gruppen und weitere Spalten über die Ansicht.
  assert.ok(await seite.locator('#ansehen li [data-tafelbild]').count() > 0);
  assert.equal(await seite.locator('#aufg-liste thead th').count(), 6);
  assert.equal(await seite.locator('.tabelle.gruppen').count(), 0);
  await foto(seite, 'lehrer-aufgaben-schlank');
  await seite.click('#ansicht-anpassen');
  for (const schalter of await seite.locator('#ansicht input[data-auswertung]').all()) await schalter.check();
  await seite.click('#ansicht-fertig');
  assert.equal(await seite.locator('#aufg-liste thead th').count(), 11);
  assert.equal(await seite.locator('.tabelle.gruppen').count(), 1);
  assert.match(await seite.innerText('.tabelle.gruppen'), /AFB I[\s\S]*AFB II[\s\S]*AFB III/);
  await seite.click('[data-gruppe=niveau]');
  assert.match(await seite.innerText('.tabelle.gruppen'), /Förderniveau[\s\S]*Erweitertes Niveau/);
  await foto(seite, 'lehrer-aufgaben');
  const schwierig = await seite.locator('#aufg-liste tbody tr').first().getAttribute('data-aufgabe');
  await seite.selectOption('#aufg-sicht', 'geloest');
  assert.notEqual(await seite.locator('#aufg-liste tbody tr').first().getAttribute('data-aufgabe'), schwierig);
  await seite.selectOption('#aufg-sicht', 'nie');
  await seite.waitForSelector('#aufg-liste');
  assert.equal(await seite.locator('#aufg-liste tbody tr').first().locator('td.zahl').nth(0).innerText(), '0');
  await seite.selectOption('#aufg-niveau', 'G');
  assert.equal(await seite.inputValue('#aufg-sicht'), 'nie'); // Die Auswahl bleibt beim Neuzeichnen erhalten.
  await seite.click('[data-tab=klasse]');
  await seite.click('[data-abschnitt=unterricht]');
  assert.ok(await seite.locator('#einstieg-karte [data-einstieg-pflicht]').count() >= 2);
  await seite.locator('#einstieg-karte').screenshot(bilder ? { path: `${bilder}/lehrer-einstieg-pflicht.png` } : {});
  await seite.click('[data-abschnitt=berichte]');
  await seite.click('#pdf');
  assert.equal(await seite.locator('#mk-druck .heatmap').count(), 1);
  assert.equal(await seite.evaluate(() => window.gedruckt), 2);
  await seite.emulateMedia({ media: 'print' });
  await foto(seite, 'lehrer-klassenbericht-druck');
  await seite.emulateMedia({ media: 'screen' });
  const [excel] = await Promise.all([seite.waitForEvent('download'), seite.click('#excel')]);
  assert.match(excel.suggestedFilename(), /^Mathekingdom_5a_.*\.xlsx$/);
  assert.equal(readFileSync(await excel.path()).subarray(0, 2).toString(), 'PK');
  await seite.click('[data-abschnitt=schueler]');
  await seite.waitForSelector('td.code');
  await foto(seite, 'lehrer-klasse');
  await seite.click('#kaertchen');
  assert.equal(await seite.locator('#mk-druck .kaertchen > div').count(), 14);
  await seite.click('[data-abschnitt=sicherung]');
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
  // Neue Klasse: nur Tor 1, dazu das Aktuelle Kapitel 5.4 (ADR 0022). Die anderen Tore fehlen ganz.
  assert.deepEqual(await schueler.locator('.region').evaluateAll((b) => b.map((x) => x.dataset.kapitel)), ['5.1', '5.4']);
  assert.match(await schueler.innerText('.region[data-kapitel="5.4"] .nummer'), /Tor 4/i);
  assert.match(await schueler.innerText('#weitere-tore'), /Weitere Tore öffnet deine Lehrkraft/);
  assert.equal(await schueler.locator('#neues-tor').count(), 0, 'beim ersten Start keine Ankündigung');
  await foto(schueler, 'schlossgarten-tore');
  // Die Lehrkraft öffnet Aylin zusätzlich Tor 3: Die Ankündigung kommt beim nächsten Lesen der Klassendatei.
  const tabVorher = await lehrer.getAttribute('.bereiche button.aktiv', 'data-tab');
  await lehrer.click('[data-tab="klasse"]');
  await lehrer.click('[data-abschnitt="unterricht"]');
  await lehrer.waitForSelector('#tore-karte');
  assert.equal(await lehrer.locator('[data-tor-klasse="5.4"]').isChecked(), true);
  await lehrer.check(`[data-tor="5.3|${aylin}"]`);
  await warteAuf((k) => k.toreEinzeln?.[aylin]?.includes('5.3'));
  assert.match(await lehrer.innerText('#tore-karte'), /1 von 3 offen/);
  await lehrer.locator('#tore-karte').screenshot(bilder ? { path: `${bilder}/lehrer-tore.png` } : {});
  await schueler.waitForSelector('#neues-tor', { timeout: 20000 });
  assert.match(await schueler.innerText('#neues-tor'), /Addieren und Subtrahieren/);
  assert.equal(await schueler.locator('.region.neu[data-kapitel="5.3"]').count(), 1);
  await foto(schueler, 'neues-tor');
  await lehrer.click(`[data-tab="${tabVorher}"]`);
  await schueler.locator('.schlosskopf').evaluate((x) => x.scrollIntoView());
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

  // Sonderauftrag (ADR 0021): Die Lehrkraft stellt im Schülerprofil drei Aufgaben zusammen. Der Brief kommt nicht mitten in der Aufgabe,
  // sondern nach dem Ergebnis. Am Ende gibt es 100 Münzen, und es geht zurück an den Meilenstein, an dem die Schülerin war.
  await lehrer.click(`.sitzplan [data-schueler="${aylin}"]`);
  await lehrer.click('.overlay details.sonderauftrag summary');
  await lehrer.selectOption(`[data-sa-lernziel="${aylin}"]`, '5.4.1-K1');
  await lehrer.selectOption(`[data-sa-anzahl="${aylin}"]`, '3');
  assert.equal(await lehrer.locator('.overlay .sa-aufgaben li').count(), 3);
  assert.equal(await lehrer.inputValue(`[data-sa-niveau="${aylin}"]`), 'G', 'vorbelegt eine Stufe unter dem Zielniveau M');
  await lehrer.click('.overlay .sonderauftrag button:has-text("Das schaffst du!")');
  await lehrer.locator('.overlay div.sonderauftrag').screenshot(bilder ? { path: `${bilder}/lehrer-sonderauftrag.png` } : {});
  await lehrer.click(`[data-sa-senden="${aylin}"]`);
  await warteAuf((k) => k.sonderauftraege?.[aylin]?.aufgaben.length === 3 && k.sonderauftraege[aylin].satz === 'Das schaffst du!');
  await lehrer.waitForSelector('#sonderauftrag-stand');
  assert.match(await lehrer.innerText('#sonderauftrag-stand'), /gesendet, noch nicht geöffnet/);
  await lehrer.click('#overlay-zu');
  const vorherAufgabe = await schueler.getAttribute('section.aufgabe', 'data-aufgabe');
  await schueler.waitForTimeout(11000);
  assert.equal(await schueler.locator('#brief').count(), 0, 'kein Brief mitten in einer Aufgabe');
  await antworte(schueler, true);
  await schueler.waitForSelector('#brief.einflug', { timeout: 15000 });
  assert.match(await schueler.innerText('#brief'), /Sonderauftrag für dich[\s\S]*3 Aufgaben[\s\S]*100 Münzen[\s\S]*Das schaffst du!/);
  await schueler.waitForTimeout(800);
  await foto(schueler, 'schueler-brief');
  await schueler.locator('#brief').screenshot(bilder ? { path: `${bilder}/brief.png` } : {});
  await schueler.click('#brief-spaeter');
  await schueler.waitForSelector('#brief-klein');
  const muenzenVorher = JSON.parse(await lies(`5a/${aylin}.json`)).muenzen;
  await schueler.click('#brief-oeffnen');
  for (let i = 0; i < 3; i++) {
    await schueler.waitForSelector('#sonderauftrag-marke');
    assert.match(await schueler.innerText('#sonderauftrag-marke'), new RegExp(`Sonderauftrag ${i + 1} von 3`));
    assert.equal(await schueler.locator('#brief, #brief-klein').count(), 0, 'kein Brief während des Auftrags');
    if (i === 1) { await antworte(schueler, false); await schueler.waitForSelector('.hinweis'); await antworte(schueler, false); } else await antworte(schueler, true);
    await schueler.waitForSelector('.ergebnis');
    if (i < 2) await weiter(schueler);
  }
  await schueler.waitForSelector('#sonderauftrag-fertig');
  assert.match(await schueler.innerText('#sonderauftrag-fertig'), /2 von 3 richtig[\s\S]*100 Münzen/);
  await schueler.waitForTimeout(600);
  await foto(schueler, 'schueler-sonderauftrag-fertig');
  await weiter(schueler);
  await schueler.waitForSelector('section.aufgabe:not(:has(#sonderauftrag-marke))');
  const zurueckAufgabe = await schueler.getAttribute('section.aufgabe', 'data-aufgabe');
  const msVon = (id) => pool.aufgaben.find((a) => a.id === id).lernziel.split('-')[0];
  assert.equal(msVon(zurueckAufgabe), msVon(vorherAufgabe), 'zurück am selben Meilenstein');
  assert.equal(await schueler.locator('#brief, #brief-klein').count(), 0);
  for (let i = 0; i < 50 && !(JSON.parse(await lies(`5a/${aylin}.json`)).sonderauftraege ?? []).length; i++) await lehrer.waitForTimeout(100);
  const nachher = JSON.parse(await lies(`5a/${aylin}.json`));
  assert.equal(nachher.sonderauftraege.length, 1);
  assert.ok(nachher.muenzen >= muenzenVorher + 100);
  assert.equal(nachher.versuche.filter((v) => v.sonderauftrag).length, 3);
  await lehrer.waitForSelector(`[data-sa-erledigt="${aylin}"]`, { timeout: 15000 });
  assert.match(await lehrer.innerText(`[data-sa-erledigt="${aylin}"]`), /2 von 3 Aufgaben/);
  await lehrer.click(`[data-sa-erledigt="${aylin}"] button:has-text("Ansehen")`);
  assert.match(await lehrer.innerText('#sonderauftrag-stand'), /erledigt[\s\S]*2 von 3 richtig/);
  await lehrer.click('#overlay-zu');

  // Station sperren: Die Schülerin sieht das Schloss und kann dort nichts starten. Öffnen macht es rückgängig.
  await lehrer.click('[data-tab=klasse]');
  await lehrer.click('[data-abschnitt=unterricht]');
  await lehrer.waitForSelector('#meilensteine-sperren:not(.zu)'); // seit 0.32 eine aufklappbare Karte, im Test offen
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
  await lehrer.click('[data-tab=klasse]');
  await lehrer.click('[data-abschnitt=unterricht]');
  await lehrer.fill('#expedition-ziel', '2');
  await lehrer.click('#expedition-starten');
  await warteAuf((k) => k.expedition?.ziel === 2);
  await schueler.click('nav button:has-text("Schlossgarten")');
  await schueler.waitForSelector('#expedition', { timeout: 15000 });
  assert.match(await schueler.innerText('#expedition-stand'), /Die Klasse hat \d von 2\. Davon/);

  // Meilensteinfreigabe (ADR 0026): Die Lehrkraft lässt in Kapitel 4 nur den ersten Meilenstein offen. Der Rest liegt im Nebel.
  await lehrer.waitForSelector('#meilenstein-freigabe');
  await lehrer.uncheck('#alle-meilensteine');
  await warteAuf((k) => Array.isArray(k.meilensteinFreigabe?.['5.4']));
  assert.deepEqual((await inhalt()).meilensteinFreigabe['5.4'], ['5.4.1']);
  await lehrer.check('[data-freigabe="5.4.2"]');
  await warteAuf((k) => k.meilensteinFreigabe['5.4'].includes('5.4.2'));
  assert.match(await lehrer.innerText('#meilenstein-freigabe'), /von 3 offen/);
  await lehrer.locator('#meilenstein-freigabe').screenshot(bilder ? { path: `${bilder}/lehrer-meilensteinfreigabe.png` } : {});
  // Die Klassendatei wird etwa alle zehn Sekunden neu gelesen.
  for (let i = 0; i < 30 && !(await schueler.locator('.regionskarte .meilenstein.imnebel').count()); i++) {
    await schueler.waitForTimeout(1000);
    await schueler.click('nav button:has-text("Schlossgarten")');
    await schueler.click('[data-kapitel="5.4"]');
  }
  assert.equal(await schueler.locator('.regionskarte .meilenstein.imnebel .meilensteinname').count(), 0, 'im Nebel ohne Namen');
  assert.match(await schueler.innerText('.unter'), /im Nebel öffnen sich/);
  await schueler.locator('.regionskarte .meilenstein.imnebel').nth(1).click();
  await schueler.waitForSelector('#nebel-tafel');
  assert.match(await schueler.innerText('#nebel-tafel'), /liegt noch im Nebel/);
  assert.equal(await schueler.locator('#aufbrechen').count(), 0);
  await foto(schueler, 'meilenstein-im-nebel');
  await lehrer.check('#alle-meilensteine');
  await warteAuf((k) => !k.meilensteinFreigabe?.['5.4']);
  await schueler.click('nav button:has-text("Schlossgarten")');
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
  await lehrer.click('[data-tab=klasse]');
  await lehrer.click('[data-abschnitt=sicherung]');
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

// ---------- 7. Administrator, Lehrkraft und Schüler mit gemerkten Ordnern (ADR 0024) ----------
// Drei Ordner im privaten Browser-Dateisystem spielen die Laufwerke: S (Schülertauschlaufwerk), L (Lehrertauschlaufwerk),
// P (persönliches Lehrerlaufwerk). Welcher Ordner im Auswahlfenster „gewählt“ wird, steht in localStorage.
{
  const kontext = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const fehler = [];
  let netz = true;
  await kontext.route(/github\.io/, (r) => {
    const datei = r.request().url().match(/dist\/(admin|lehrer|schueler)\.js$/)?.[1];
    if (netz && datei) return r.fulfill({ body: readFileSync(new URL(`dist/${datei}.js`, wurzel), 'utf8'), contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } });
    if (netz && r.request().url().includes('aufgabenpool/klasse-5.json')) return r.fulfill({ body: JSON.stringify(pool), contentType: 'application/json', headers: { 'access-control-allow-origin': '*' } });
    return r.abort();
  });
  await kontext.addInitScript(() => {
    window.showDirectoryPicker = async () => {
      let o = await navigator.storage.getDirectory();
      for (const t of (localStorage.getItem('mk-test-wahl') ?? 'X').split('/')) o = await o.getDirectoryHandle(t, { create: true });
      return o;
    };
  });
  const lies = (seite, pfad) => seite.evaluate(async (p) => {
    let o = await navigator.storage.getDirectory();
    const teile = p.split('/');
    try {
      for (const t of teile.slice(0, -1)) o = await o.getDirectoryHandle(t);
      return await (await (await o.getFileHandle(teile.at(-1))).getFile()).text();
    } catch { return null; }
  }, pfad);
  const waehle = (seite, pfad) => seite.evaluate((p) => localStorage.setItem('mk-test-wahl', p), pfad);
  // Startdateien, die das Administrator-Dashboard abgelegt hat, unter einer Adresse ausliefern.
  const dateien = {};
  await kontext.route(/\/test\//, (r) => r.fulfill({ body: dateien[r.request().url().split('/test/')[1]], contentType: 'text/html' }));
  const d = new Date(), j = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
  const jahr = `${j}-${String((j + 1) % 100).padStart(2, '0')}`, naechstes = `${j + 1}-${String((j + 2) % 100).padStart(2, '0')}`;

  // Administrator: drei Ordner, Lehrkräfte, Pfade, Klasse mit Namen.
  const admin = await kontext.newPage();
  admin.on('pageerror', (e) => fehler.push(`admin: ${e.message}`));
  let antwort = ''; // für Rückfragen, bei denen man etwas eintippt
  admin.on('dialog', (dlg) => dlg.accept(dlg.type() === 'prompt' ? antwort : undefined));
  await admin.goto(`${basis}dist/Mathekingdom-Admin.html`);
  await admin.waitForSelector('#wahl-persoenlich');
  for (const [art, pfad] of [['persoenlich', 'P'], ['schueler', 'S'], ['lehrer', 'L']]) { await waehle(admin, pfad); await admin.click(`#wahl-${art}`); await admin.waitForSelector(`#wahl-${art}.schlicht`); }
  await admin.click('#weiter');
  await admin.waitForSelector('#neues-kuerzel');
  assert.ok(await lies(admin, 'P/mathekingdom-admin.json'));
  assert.ok(await lies(admin, 'S/Mathekingdom/schulverzeichnis.json'));
  assert.ok(await lies(admin, 'L/Mathekingdom/schulverzeichnis.json'));
  for (const k of ['NG', 'HR']) { await admin.fill('#neues-kuerzel', k); await admin.click('#lehrkraft-anlegen'); await admin.waitForSelector(`[data-admin="${k}"]`); }
  assert.ok(JSON.parse(await lies(admin, 'L/Mathekingdom/NG/lehrer.json')).schluessel.privat);
  await admin.click('[data-tab="schule"]');
  await admin.fill('#pfad-schueler', 'S:\\Mathekingdom');
  await admin.fill('#pfad-lehrer', 'L:\\Mathekingdom');
  await admin.click('#pfade-speichern');
  await admin.waitForSelector('#hinweis');
  await admin.click('#schueler-startdatei-ablegen');
  await admin.waitForFunction(() => document.getElementById('hinweis')?.textContent.includes('kopieren'));
  await admin.click('[data-tab="klassen"]');
  await admin.fill('#neue-klasse', '5a');
  await admin.click('#klasse-anlegen');
  await admin.waitForSelector('[data-lehrkraft="5a|NG"]');
  await admin.check('[data-lehrkraft="5a|NG"]');
  await admin.waitForFunction(() => document.querySelector('[data-lehrkraft="5a|NG"]')?.checked);
  await admin.click('[data-namen="5a"]');
  await admin.fill('#namen', 'Lena Müller\nTim Schmidt');
  await admin.click('#codes');
  await admin.waitForFunction(() => document.querySelectorAll('#namen-karte td.code.pin').length === 2 && ![...document.querySelectorAll('#namen-karte td.code.pin')].some((t) => t.textContent === '…'));
  await foto(admin, 'admin-klasse');
  const zeile = admin.locator('#namen-karte tr', { hasText: 'Lena Müller' });
  const code = await zeile.locator('td.code').first().innerText(), pin = await zeile.locator('td.pin').innerText();
  assert.match(code, /^5A-[A-Z0-9]{4}$/);
  assert.ok(await lies(admin, `S/Mathekingdom/${jahr}/5a/klassendatei.json`));
  assert.equal(JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`)).namen[code], 'Lena Müller');
  const verzeichnis = JSON.parse(JSON.parse(await lies(admin, 'S/Mathekingdom/schulverzeichnis.json')).inhalt);
  assert.deepEqual(verzeichnis.klassen[jahr]['5a'].lehrkraefte, ['NG']);
  dateien['Mathekingdom.html'] = await lies(admin, 'S/Mathekingdom/Mathekingdom.html');
  dateien['Lehrer-NG.html'] = await lies(admin, 'L/Mathekingdom/NG/Mathekingdom-Lehrer.html');
  assert.ok(dateien['Mathekingdom.html'].includes('S:\\\\Mathekingdom'));

  // Schüler: zuerst der Klassenordner (zu tief), dann das Laufwerk. Danach ohne Auswahlfenster.
  const schueler = await kontext.newPage();
  schueler.on('pageerror', (e) => fehler.push(`schüler: ${e.message}`));
  await schueler.goto(`${basis}test/Mathekingdom.html`);
  await schueler.waitForSelector('#code');
  // Mit der Startdatei des Administrators gibt es kein Ausprobieren ohne Ordner (Version 0.32).
  assert.equal(await schueler.locator('#demo').count(), 0);
  assert.match(await schueler.innerText('#ordner-hinweis'), /Nur beim ersten Mal.*„Mathekingdom“ \(S:\\Mathekingdom\)/);
  await schueler.fill('#code', code); await schueler.fill('#pin', pin);
  await waehle(schueler, `S/Mathekingdom/${jahr}/5a`);
  await schueler.click('#ordner');
  await schueler.waitForSelector('.fehler[role=alert]');
  assert.match(await schueler.innerText('.fehler[role=alert]'), /nicht der richtige Ordner.*S:\\Mathekingdom/);
  await waehle(schueler, 'S');
  await schueler.fill('#pin', pin);
  await schueler.click('#ordner');
  await schueler.waitForSelector('.regionen', { timeout: 15000 });
  await schueler.waitForFunction(async ([p]) => {
    let o = await navigator.storage.getDirectory();
    for (const t of p) o = await o.getDirectoryHandle(t);
    for await (const [n] of o.entries()) if (/^5A-.{4}\.json$/.test(n)) return true;
    return false;
  }, [['S', 'Mathekingdom', jahr, '5a']], { timeout: 15000 });
  await waehle(schueler, 'X');
  await schueler.reload();
  await schueler.waitForSelector('#code');
  await schueler.waitForFunction(() => document.getElementById('ordner')?.textContent === 'Aufbrechen');
  await schueler.fill('#code', code); await schueler.fill('#pin', pin);
  await schueler.click('#ordner');
  await schueler.waitForSelector('.regionen', { timeout: 15000 });
  await foto(schueler, 'schueler-gemerkt');

  // Lehrkraft NG: Kürzel aus der Startdatei, zwei Ordner, Klasse ohne Auswahlfenster.
  const lehrer = await kontext.newPage();
  lehrer.on('pageerror', (e) => fehler.push(`lehrer: ${e.message}`));
  lehrer.on('dialog', (dlg) => dlg.accept());
  // Wie die Schulrichtlinie: Skriptdateien dürfen nicht geschrieben werden (Version 0.29).
  await lehrer.addInitScript(() => {
    const echt = FileSystemFileHandle.prototype.createWritable;
    FileSystemFileHandle.prototype.createWritable = async function (...a) {
      const strom = await echt.apply(this, a);
      if (this.name.endsWith('.js')) strom.close = async () => { await strom.abort(); throw new DOMException('Aborted due to security policy', 'AbortError'); };
      return strom;
    };
  });
  await lehrer.goto(`${basis}test/Lehrer-NG.html`);
  await lehrer.waitForSelector('#wahl-schueler');
  assert.match(await lehrer.innerText('main'), /Dein Kürzel: NG/);
  const version = readFileSync(new URL('VERSIONEN.md', wurzel), 'utf8').match(/^## (\d+\.\d+)/m)[1];
  assert.match(await lehrer.innerText('#version'), new RegExp(`^Version ${version.replace('.', '\\.')} vom`));
  await waehle(lehrer, 'S/Mathekingdom'); await lehrer.click('#wahl-schueler'); await lehrer.waitForSelector('#wahl-schueler.schlicht');
  await waehle(lehrer, 'L'); await lehrer.click('#wahl-lehrer'); await lehrer.waitForSelector('#wahl-lehrer.schlicht');
  await lehrer.click('#weiter');
  // NG hat nur eine Klasse: Sie öffnet sich gleich (ADR 0025).
  await lehrer.waitForSelector('nav.bereiche');
  assert.match(await lehrer.innerText('h1'), /Klasse 5a/);
  assert.ok(await lies(lehrer, 'L/Mathekingdom/_mathekingdom/lehrer-kopie.txt'));
  assert.ok(await lies(lehrer, 'S/Mathekingdom/_mathekingdom/schueler-kopie.txt'));
  // Im Schulbetrieb keine Kopie mehr im Klassenordner (seit 0.29).
  assert.ok(!(await lies(lehrer, `S/Mathekingdom/${jahr}/5a/_mathekingdom/schueler-dashboard.js`).catch(() => null)));
  await lehrer.click('[data-tab="klasse"]');
  await lehrer.waitForSelector('#codes');
  // Backup und Protokoll gibt es mit Schulverzeichnis nur im Administrator-Dashboard.
  assert.deepEqual(await lehrer.$$eval('.abschnitte button', (b) => b.map((x) => x.textContent)), ['Schüler', 'Unterricht', 'Berichte']);
  assert.equal(await lehrer.locator('#backup, #protokoll, #klassenwahl').count(), 0);
  // Nur eine eigene Klasse: Statt der Auswahl steht ihr Name oben.
  assert.equal(await lehrer.innerText('#klassenname'), 'Klasse 5a');
  assert.match(await lehrer.innerText('main'), /Lena Müller/);
  // Eine zweite Lehrkraft hat die Klasse offen: Das steht oben.
  await lehrer.evaluate(async ([j]) => {
    let o = await navigator.storage.getDirectory();
    for (const t of ['L', 'Mathekingdom', j, '5a']) o = await o.getDirectoryHandle(t);
    const strom = await (await o.getFileHandle('offen-HR.json', { create: true })).createWritable();
    await strom.write(JSON.stringify({ t: new Date().toISOString() })); await strom.close();
  }, [jahr]);
  await lehrer.waitForSelector('#andere-offen', { timeout: 15000 });
  assert.match(await lehrer.innerText('#andere-offen'), /Auch HR hat die Klasse gerade offen/);
  // Das stündliche Backup läuft still beim ersten Lesen der Klasse.
  await lehrer.waitForFunction(async ([j]) => {
    let o = await navigator.storage.getDirectory();
    try { for (const t of ['L', 'Mathekingdom', j, '5a', 'backup']) o = await o.getDirectoryHandle(t); } catch { return false; }
    for await (const [, e] of o.entries()) if (e.kind === 'directory') return true;
    return false;
  }, [jahr], { timeout: 15000 });
  await foto(lehrer, 'lehrer-schule');
  // Nach dem Neuladen sind beide Ordner gemerkt. Hat der Browser die Erlaubnis noch, geht es ohne Zwischenschritt
  // in die Klasse (Version 0.32); oben rechts steht das Schild „Laufwerke verbunden“.
  await lehrer.reload();
  await lehrer.waitForSelector('nav.bereiche');
  assert.equal(await lehrer.innerText('#laufwerke'), '✓ Laufwerke verbunden');
  assert.match(await lehrer.getAttribute('#laufwerke', 'title'), /Lehrertauschlaufwerk: Ordner „Mathekingdom“, Ordner „NG“ mit deinem Schlüssel gefunden/);
  await lehrer.click('#laufwerke');
  assert.equal(await lehrer.locator('#laufwerk-panel [data-anderer]').count(), 2);
  await foto(lehrer, 'laufwerke-verbunden');
  await lehrer.click('#laufwerk-panel-zu');
  // Ohne Erlaubnis: Karte mit den hinterlegten Ordnern, ein Klick darauf öffnet die Klasse.
  {
    const ohne = await kontext.newPage();
    ohne.on('pageerror', (e) => fehler.push(`lehrer ohne Erlaubnis: ${e.message}`));
    await ohne.addInitScript(() => {
      FileSystemHandle.prototype.queryPermission = async () => (window.mkErlaubt ? 'granted' : 'prompt');
      FileSystemHandle.prototype.requestPermission = async () => { window.mkErlaubt = true; return 'granted'; };
    });
    await ohne.goto(`${basis}test/Lehrer-NG.html`);
    await ohne.waitForSelector('#hinterlegt');
    assert.match(await ohne.innerText('#hinterlegt'), /Deine Laufwerke sind hinterlegt[\s\S]*Schülertauschlaufwerk · Ordner „Mathekingdom“[\s\S]*Zum Öffnen klicken/);
    assert.equal(await ohne.locator('#hinterlegt button, #wahl-schueler, #kuerzel').count(), 0);
    await foto(ohne, 'laufwerke-hinterlegt');
    await ohne.click('#hinterlegt h1');
    await ohne.waitForSelector('nav.bereiche');
    await ohne.close();
  }
  // Zu Hause (Version 0.46): Die gemerkten Ordner liegen auf Tauschlaufwerken, die nicht erreichbar sind, und der
  // Browser antwortet auf die Frage nach der Erlaubnis nie. Dann bleibt nicht „Mathekingdom öffnet …“ stehen.
  {
    const weg = await kontext.newPage();
    weg.on('pageerror', (e) => fehler.push(`lehrer ohne Laufwerk: ${e.message}`));
    await weg.addInitScript(() => {
      FileSystemHandle.prototype.queryPermission = () => new Promise(() => {});
      FileSystemHandle.prototype.requestPermission = () => new Promise(() => {});
    });
    await weg.goto(`${basis}test/Lehrer-NG.html`);
    // Nach der Frist kommt die Karte mit den hinterlegten Ordnern.
    await weg.waitForSelector('#hinterlegt', { timeout: 10000 });
    // Ein Klick darauf hängt wieder: Nach einer Weile kommt die Wahl der Ordner mit dem Schritt, der klemmt.
    await weg.click('#hinterlegt h1');
    await weg.waitForSelector('.meldung.fehler', { timeout: 20000 });
    assert.match(await weg.innerText('.meldung.fehler'), /kommt beim Schritt „Zugriff auf die Ordner prüfen“ nicht weiter/);
    assert.ok(await weg.locator('#wahl-schueler').count());
    assert.doesNotMatch(await weg.innerText('main'), /Mathekingdom öffnet/);
    await foto(weg, 'lehrer-laufwerk-nicht-erreichbar');
    await weg.close();
    const adminWeg = await kontext.newPage();
    adminWeg.on('pageerror', (e) => fehler.push(`admin ohne Laufwerk: ${e.message}`));
    await adminWeg.addInitScript(() => {
      FileSystemHandle.prototype.queryPermission = () => new Promise(() => {});
      FileSystemHandle.prototype.requestPermission = () => new Promise(() => {});
    });
    await adminWeg.goto(`${basis}dist/Mathekingdom-Admin.html`);
    await adminWeg.waitForSelector('#hinterlegt', { timeout: 10000 });
    await adminWeg.click('#hinterlegt h1');
    await adminWeg.waitForSelector('.meldung.fehler, .fehler', { timeout: 20000 });
    assert.match(await adminWeg.innerText('body'), /kommt beim Schritt „Zugriff auf die Ordner prüfen“ nicht weiter/);
    assert.ok(await adminWeg.locator('#wahl-schueler').count());
    await adminWeg.close();
  }

  // Münzgabe (ADR 0027): Der Administrator schickt Lena 500 Münzen. Sie kommen als Brief, gutgeschrieben beim Öffnen.
  // Eine zweite Gabe zieht er zurück, bevor sie geöffnet ist. Die Lehrkraft sieht die Gabe im Schülerprofil.
  await admin.click('[data-tab="klassen"]');
  await admin.click('[data-namen="5a"]');
  await admin.waitForSelector(`[data-muenzen="${code}"]`);
  await admin.click(`[data-muenzen="${code}"]`);
  await admin.check('input[name="gabe-muenzen"][value="500"]');
  await admin.fill('#gabe-satz', 'Für deine Hilfe beim Aufräumen.');
  await admin.click('#gabe-schicken');
  await admin.waitForFunction(() => /500 Münzen an Lena Müller geschickt/.test(document.getElementById('hinweis')?.textContent ?? ''));
  await admin.waitForFunction(() => /noch nicht geöffnet/.test(document.getElementById('gaben-liste')?.textContent ?? ''));
  await admin.locator('#gabe-karte').screenshot(bilder ? { path: `${bilder}/admin-muenzgabe.png` } : {});
  const klasseMitGabe = JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`));
  assert.equal(klasseMitGabe.einst.muenzgaben[code][0].muenzen, 500);
  const vorGabe = JSON.parse(await lies(admin, `S/Mathekingdom/${jahr}/5a/${code}.json`)).muenzen;
  await schueler.waitForSelector('#gabe', { timeout: 20000 });
  assert.match(await schueler.innerText('#gabe'), /Eine Gabe des Königs/);
  assert.doesNotMatch(await schueler.innerText('#gabe'), /Administrator/);
  await schueler.waitForTimeout(800);
  await schueler.locator('#gabe').screenshot(bilder ? { path: `${bilder}/gabe-brief.png` } : {});
  await schueler.click('#gabe-oeffnen');
  await schueler.waitForSelector('#gabe-geoeffnet');
  assert.match(await schueler.innerText('#gabe-geoeffnet'), /\+500 Münzen[\s\S]*Für deine Hilfe beim Aufräumen/);
  await schueler.waitForTimeout(1000);
  await schueler.locator('#gabe-geoeffnet').screenshot(bilder ? { path: `${bilder}/gabe-geoeffnet.png` } : {});
  await schueler.click('#gabe-ok');
  await schueler.waitForFunction(async ([p]) => {
    let o = await navigator.storage.getDirectory();
    for (const t of p.slice(0, -1)) o = await o.getDirectoryHandle(t);
    try { return (JSON.parse(await (await (await o.getFileHandle(p.at(-1))).getFile()).text()).muenzgaben ?? []).length === 1; } catch { return false; }
  }, [['S', 'Mathekingdom', jahr, '5a', `${code}.json`]], { timeout: 15000 });
  assert.equal(JSON.parse(await lies(admin, `S/Mathekingdom/${jahr}/5a/${code}.json`)).muenzen, vorGabe + 500);
  // Geöffnet: kein Zurückziehen mehr. Eine zweite, ungeöffnete Gabe lässt sich zurückziehen.
  await admin.click(`[data-muenzen="${code}"]`);
  await admin.waitForFunction(() => /geöffnet am/.test(document.getElementById('gaben-liste')?.textContent ?? ''));
  assert.equal(await admin.locator('#gaben-liste [data-zurueck]').count(), 0);
  await admin.check('input[name="gabe-muenzen"][value="50"]');
  await admin.click('#gabe-schicken');
  await admin.waitForSelector('#gaben-liste [data-zurueck]');
  await admin.click('#gaben-liste [data-zurueck]');
  await admin.waitForFunction(() => /Gabe zurückgezogen/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.equal(JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`)).einst.muenzgaben[code].length, 1);
  // Lehrkraft: Belohnung des Sonderauftrags für die Klasse auf 250 stellen, Münzgabe im Schülerprofil sehen.
  await lehrer.click('[data-tab="klasse"]');
  await lehrer.click('.abschnitte button:has-text("Unterricht")');
  await lehrer.waitForSelector('#sonderauftrag-belohnung');
  assert.equal(await lehrer.inputValue('#sonderauftrag-belohnung'), '100');
  await lehrer.selectOption('#sonderauftrag-belohnung', '250');
  await lehrer.waitForFunction(async ([j]) => {
    let o = await navigator.storage.getDirectory(), k;
    try {
      for (const t of ['L', 'Mathekingdom', j, '5a']) o = await o.getDirectoryHandle(t);
      k = JSON.parse(await (await (await o.getFileHandle('klasse.json')).getFile()).text());
    } catch { return false; } // gerade im Schreiben
    return k.einst.sonderauftragBelohnung === 250 && k.einst.muenzgaben?.[Object.keys(k.namen).find((c) => k.namen[c] === 'Lena Müller')]?.length === 1;
  }, [jahr], { timeout: 15000 });
  await fotoStabil(lehrer, '#belohnung-karte', 'lehrer-belohnung');
  await lehrer.click('[data-tab="jetzt"]');
  await lehrer.click(`.sitzplan [data-schueler="${code}"]`);
  await lehrer.waitForSelector('#muenzgaben');
  // Das Lehrer-Dashboard liest die Speicherstände alle 5 Sekunden: auf den geöffneten Stand warten.
  await lehrer.waitForFunction(() => /Münzgabe \+500, geöffnet am/.test(document.getElementById('muenzgaben')?.textContent ?? ''), null, { timeout: 15000 });
  await lehrer.click('.overlay details.sonderauftrag summary');
  assert.match(await lehrer.innerText('.overlay details.sonderauftrag'), /250 Münzen dazu/);
  await fotoStabil(lehrer, '.overlay-inhalt', 'lehrer-muenzgabe');
  await lehrer.click('#overlay-zu');

  // Aufgabenmeldung (ADR 0025): Die Lehrkraft meldet eine Aufgabe mit ihrer Kennung.
  const gemeldet = pool.aufgaben[0].id;
  await lehrer.click('[data-tab="aufgaben"]');
  await lehrer.click('#melden-frei');
  await lehrer.fill('#melde-kennung', gemeldet);
  await lehrer.click('#melde-senden');
  await lehrer.waitForSelector('#melde-dialog .fehlertext');
  await lehrer.check('input[name="melde-art"][value="loesung"]');
  await lehrer.fill('#melde-satz', 'Die Lösung im Pool stimmt nicht.');
  await foto(lehrer, 'lehrer-meldung');
  await lehrer.click('#melde-senden');
  await lehrer.waitForSelector('#meldung-gesendet');
  const meldung = JSON.parse(await lies(lehrer, 'L/Mathekingdom/NG/lehrer.json')).meldungen[0];
  assert.equal(meldung.kennung, gemeldet); assert.equal(meldung.art, 'loesung'); assert.equal(meldung.klasse, '5a');
  assert.match(await lehrer.innerText('#meldungen'), /offen/);

  // Administrator: neues Schuljahr, 5a wird 6a.
  await admin.click('[data-tab="schule"]');
  await admin.fill('#neues-schuljahr', naechstes);
  await admin.click('#schuljahr-anlegen');
  await admin.waitForSelector('#uebernahme-start');
  await admin.click('#uebernahme-start');
  await admin.waitForSelector(`[data-ziel="${code}"]`);
  assert.equal(await admin.inputValue(`[data-ziel="${code}"]`), '6a');
  await admin.click('#uebernehmen');
  await admin.waitForFunction(() => document.getElementById('hinweis')?.textContent.includes('2 Schüler übernommen'));
  const neuerCode = `6A-${code.split('-')[1]}`;
  const neu = JSON.parse(await lies(admin, `S/Mathekingdom/${naechstes}/6a/${neuerCode}.json`));
  assert.equal(neu.code, neuerCode); assert.equal(neu.klasse, '6a');
  const klasse6 = JSON.parse(await lies(admin, `L/Mathekingdom/${naechstes}/6a/klasse.json`));
  assert.equal(klasse6.namen[neuerCode], 'Lena Müller');
  assert.equal(klasse6.pins[neuerCode].pin, pin);

  // Alte Lehrerdaten (bis 0.20) ziehen um: Namensliste und Backups der Klasse 5b.
  await admin.evaluate(async () => {
    const schreibe = async (pfad, text) => {
      let o = await navigator.storage.getDirectory();
      const teile = pfad.split('/');
      for (const t of teile.slice(0, -1)) o = await o.getDirectoryHandle(t, { create: true });
      const strom = await (await o.getFileHandle(teile.at(-1), { create: true })).createWritable();
      await strom.write(text); await strom.close();
    };
    await schreibe('ALT/lehrerdaten.json', JSON.stringify({ version: 1, schluessel: {}, klassen: { '5b': { namen: { '5B-ALT1': 'Ali Alt' }, notizen: {}, pins: {}, einst: { aktuellesKapitel: null, tore: ['5.1'], toreEinzeln: {}, zielniveaus: {}, hilfe: {}, nachrichten: {}, sperren: {} } } } }));
    await schreibe('ALT/backup/5b/2026-11-01_10-00/5B-ALT1.json', '{"code":"5B-ALT1"}');
  });
  await admin.click('[data-tab="schule"]');
  await waehle(admin, 'ALT');
  await admin.click('#alt-waehlen');
  await admin.waitForSelector('[data-alt-uebernehmen="5b"]');
  await admin.selectOption('[data-alt-lehrkraft="5b"]', 'HR');
  await admin.click('[data-alt-uebernehmen="5b"]');
  await admin.waitForFunction(() => document.getElementById('hinweis')?.textContent.includes('Klasse 5b übernommen'));
  assert.match(await admin.innerText('#hinweis'), /1 Schüler, 1 Backups/);
  assert.equal(JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5b/klasse.json`)).namen['5B-ALT1'], 'Ali Alt');
  assert.ok(await lies(admin, `L/Mathekingdom/${jahr}/5b/backup/2026-11-01_10-00/5B-ALT1.json`));
  assert.ok(await lies(admin, `S/Mathekingdom/${jahr}/5b/klassendatei.json`));

  // Betrieb (ADR 0025): Backups und Betriebsprotokoll aller Klassen, Sichern und Wiederherstellen.
  const schreibe = (pfad, text) => admin.evaluate(async ([p, t]) => {
    let o = await navigator.storage.getDirectory();
    const teile = p.split('/');
    for (const x of teile.slice(0, -1)) o = await o.getDirectoryHandle(x, { create: true });
    const strom = await (await o.getFileHandle(teile.at(-1), { create: true })).createWritable();
    await strom.write(t); await strom.close();
  }, [pfad, text]);
  await admin.click('[data-tab="schule"]');
  await admin.selectOption('#schuljahr-wahl', jahr);
  await admin.click('[data-tab="betrieb"]');
  await admin.waitForSelector('[data-sichern="5a"]', { timeout: 15000 });
  await admin.click('[data-sichern="5a"]');
  await admin.waitForFunction(() => /Klasse 5a gesichert/.test(document.getElementById('hinweis')?.textContent ?? ''));
  await admin.waitForSelector('#protokoll');
  await admin.uncheck('#protokoll-probleme');
  await admin.waitForFunction(() => /Lehrkraft NG/.test(document.getElementById('protokoll')?.textContent ?? ''));
  assert.match(await admin.innerText('#protokoll'), /Lena Müller/);
  // Nutzungsstatistik: je Klasse und für alle, ohne Namen.
  await admin.waitForSelector('[data-nutzung="5a"]');
  assert.match(await admin.innerText('#nutzung'), /Alle Klassen/);
  assert.doesNotMatch(await admin.innerText('#nutzung'), /Lena/);
  await foto(admin, 'admin-betrieb');
  const pfadLena = `S/Mathekingdom/${jahr}/5a/${code}.json`;
  await schreibe(pfadLena, JSON.stringify({ ...JSON.parse(await lies(admin, pfadLena)), muenzen: 99999 }));
  await admin.selectOption('#backup-klasse', '5a');
  await admin.waitForSelector('#backup-schueler');
  await admin.selectOption('#backup-schueler', code);
  await admin.click('#wiederherstellen');
  await admin.waitForFunction(() => /Lena Müller aus dem Backup/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.ok(JSON.parse(await lies(admin, pfadLena)).muenzen < 99999);
  // Ganze Klasse: Speicherstände und Namensliste kommen zurück, die Klassendatei ist neu unterschrieben.
  await admin.waitForSelector('#backup-schueler');
  await admin.selectOption('#backup-schueler', '');
  await admin.click('#wiederherstellen');
  await admin.waitForFunction(() => /Klasse 5a aus dem Backup .* wiederhergestellt: 1 Speicherstände/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.equal(JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`)).namen[code], 'Lena Müller');

  // Neue PIN und Schüler endgültig löschen: Tim mit Speicherstand und Backup.
  await admin.click('[data-tab="klassen"]');
  await admin.click('[data-namen="5a"]');
  await admin.waitForSelector('#namen-karte [data-loeschen]');
  const tim = await admin.locator('#namen-karte tr', { hasText: 'Tim Schmidt' }).locator('td.code').first().innerText();
  const timPin = JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`)).pins[tim].pin;
  await admin.click(`[data-neue-pin="${tim}"]`);
  await admin.waitForFunction(([c, alt]) => { const t = [...document.querySelectorAll('#namen-karte tr')].find((r) => r.textContent.includes(c)); const p = t?.querySelector('td.pin')?.textContent; return p && p !== alt && p !== '…'; }, [tim, timPin]);
  await schreibe(`S/Mathekingdom/${jahr}/5a/${tim}.json`, JSON.stringify({ code: tim }));
  const bstempel = (await admin.evaluate(async ([j]) => { let o = await navigator.storage.getDirectory(); for (const t of ['L', 'Mathekingdom', j, '5a', 'backup']) o = await o.getDirectoryHandle(t); const n = []; for await (const [x] of o.entries()) n.push(x); return n.sort(); }, [jahr])).at(-1);
  await schreibe(`L/Mathekingdom/${jahr}/5a/backup/${bstempel}/${tim}.json`, JSON.stringify({ code: tim }));
  antwort = 'FALSCH';
  await admin.click(`[data-loeschen="${tim}"]`);
  await admin.waitForSelector('.meldung.fehler');
  assert.ok(await lies(admin, `S/Mathekingdom/${jahr}/5a/${tim}.json`));
  antwort = tim;
  await admin.waitForSelector(`[data-loeschen="${tim}"]`);
  await admin.click(`[data-loeschen="${tim}"]`);
  await admin.waitForFunction(() => /ist gelöscht/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.equal(await lies(admin, `S/Mathekingdom/${jahr}/5a/${tim}.json`), null);
  assert.equal(await lies(admin, `L/Mathekingdom/${jahr}/5a/backup/${bstempel}/${tim}.json`), null);
  assert.equal(JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5a/klasse.json`)).namen[tim], undefined);

  // Lehrkraft löschen: HR ist allein in 5b. Die Klassendatei von 5b wird vom Administrator neu unterschrieben.
  const vorher5b = await lies(admin, `S/Mathekingdom/${jahr}/5b/klassendatei.json`);
  antwort = 'HR';
  await admin.click('[data-lehrkraft-loeschen="HR"]');
  await admin.waitForFunction(() => /Lehrkraft HR gelöscht.*Ohne Lehrkraft: 5b/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.notEqual(await lies(admin, `S/Mathekingdom/${jahr}/5b/klassendatei.json`), vorher5b);
  assert.equal(await lies(admin, 'L/Mathekingdom/HR/lehrer.json'), null);
  const vNachher = JSON.parse(JSON.parse(await lies(admin, 'S/Mathekingdom/schulverzeichnis.json')).inhalt);
  assert.equal(vNachher.lehrkraefte.HR, undefined);
  assert.deepEqual(vNachher.klassen[jahr]['5b'].lehrkraefte, []);

  // Klasse auflösen, dann ihre Daten löschen.
  await admin.click('[data-aufloesen="5b"]');
  await admin.waitForSelector('[data-daten-loeschen="5b"]');
  await foto(admin, 'admin-klassen');
  antwort = '5b';
  await admin.click('[data-daten-loeschen="5b"]');
  await admin.waitForFunction(() => /Daten der Klasse 5b sind gelöscht/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.equal(await lies(admin, `L/Mathekingdom/${jahr}/5b/klasse.json`), null);
  assert.equal(await lies(admin, `S/Mathekingdom/${jahr}/5b/klassendatei.json`), null);
  // Auffällige Aufgabe: Fünf Schüler geben dieselbe falsche Antwort, die kein typischer Fehler ist.
  const auffaellig = pool.aufgaben.find((a) => a.format === 'zahl' && a.id !== gemeldet);
  for (const c of ['AUF1', 'AUF2', 'AUF3', 'AUF4', 'AUF5']) {
    await schreibe(`S/Mathekingdom/${jahr}/5a/5A-${c}.json`, JSON.stringify({ code: `5A-${c}`, versuche: [{ t: new Date().toISOString(), aufgabe: auffaellig.id, lernziel: auffaellig.lernziel, niveau: auffaellig.niveau, richtig: false, eingaben: ['424242'] }], abbrueche: [] }));
  }
  await admin.click('[data-tab="uebersicht"]');
  await admin.waitForSelector('#uebersicht');
  assert.match(await admin.innerText('#uebersicht'), /1 offene Aufgabenmeldung/);
  assert.match(await admin.innerText('#uebersicht'), /1 auffällige Aufgabe/);
  await foto(admin, 'admin-uebersicht');

  // Aufgaben: Meldung ansehen, Aufgabe sperren, als behoben markieren.
  await admin.click('[data-tab="aufgaben"]');
  await admin.waitForSelector(`[data-meldung="${gemeldet}"]`, { timeout: 15000 });
  assert.match(await admin.innerText(`[data-meldung="${gemeldet}"]`), /NG \(5a\): Lösung falsch\. Die Lösung im Pool stimmt nicht/);
  await admin.check(`[data-sperre="${gemeldet}"]`);
  await admin.waitForFunction(([k]) => [...document.querySelectorAll('#gesperrt code')].some((c) => c.textContent === k), [gemeldet]);
  assert.deepEqual(JSON.parse(JSON.parse(await lies(admin, 'S/Mathekingdom/schulverzeichnis.json')).inhalt).gesperrt, [gemeldet]);
  await foto(admin, 'admin-aufgaben');
  await admin.waitForSelector(`[data-auffaellig="${auffaellig.id}"]`);
  assert.match(await admin.innerText(`[data-auffaellig="${auffaellig.id}"]`), /5 Schüler antworten „424242“/);
  assert.match(await admin.innerText('#aufgabentypen'), /Zahl eingeben/);
  if (bilder) await admin.locator('#auffaellig').screenshot({ path: `${bilder}/${String(++nr).padStart(2, '0')}-admin-auffaellig.png` });
  const [exportDatei] = await Promise.all([admin.waitForEvent('download'), admin.click('#meldungen-export')]);
  assert.match(readFileSync(await exportDatei.path(), 'utf8'), new RegExp(`## ${gemeldet.replace(/\./g, '\\.')} \\(gesperrt\\)[\\s\\S]*Lösung im Pool`));
  await admin.selectOption(`[data-status="${gemeldet}"]`, 'behoben');
  await admin.waitForSelector('#meldungen-leer', { timeout: 15000 });
  assert.equal(JSON.parse(await lies(admin, 'L/Mathekingdom/aufgabenmeldungen.json'))[gemeldet].status, 'behoben');
  // Die Lehrkraft sieht die Sperre bei ihrer Meldung.
  await lehrer.reload();
  await lehrer.click('[data-tab="aufgaben"]');
  await lehrer.waitForFunction(() => /behoben/.test(document.getElementById('meldungen')?.textContent ?? ''));
  assert.match(await lehrer.innerText('#meldungen'), /gesperrt/);

  // Testklasse mit simulierten Schülern (ADR 0028): anlegen mit Vorlauf, live simulieren, im Lehrer-Dashboard sehen, anhalten.
  await admin.click('[data-tab="klassen"]');
  await admin.waitForSelector('#test-anlegen');
  await admin.fill('#test-name', '5t');
  await admin.selectOption('#test-lehrkraft', 'NG');
  await admin.fill('#test-anzahl', '8'); await admin.dispatchEvent('#test-anzahl', 'change');
  await admin.selectOption('#test-vorlauf', '1');
  await admin.click('#test-anlegen');
  await admin.waitForFunction(() => /Testklasse 5t angelegt: 8 simulierte Schüler/.test(document.getElementById('hinweis')?.textContent ?? ''), null, { timeout: 30000 });
  assert.equal(JSON.parse(JSON.parse(await lies(admin, 'S/Mathekingdom/schulverzeichnis.json')).inhalt).klassen[jahr]['5t'].test, true);
  const testDaten = JSON.parse(await lies(admin, `L/Mathekingdom/${jahr}/5t/klasse.json`));
  assert.equal(Object.keys(testDaten.test.profile).length, 8);
  assert.equal(testDaten.test.probe.length, 3);
  assert.match(testDaten.notizen[Object.keys(testDaten.test.profile)[3]], /Profil: rät/);
  const ersterBot = Object.keys(testDaten.test.profile)[0];
  assert.ok(JSON.parse(await lies(admin, `S/Mathekingdom/${jahr}/5t/${ersterBot}.json`)).versuche.length > 10, 'Vorlauf');
  await admin.selectOption('[data-test-tempo="5t"]', '3');
  await admin.click('[data-sim-start="5t"]');
  await admin.waitForSelector('#sim-status');
  await admin.waitForFunction(() => /[1-9]\d* an einer Aufgabe/.test(document.getElementById('sim-status')?.textContent ?? ''), null, { timeout: 60000 });
  await foto(admin, 'admin-testklasse');
  // Die Lehrkraft öffnet die Testklasse und sieht die simulierten Schüler live.
  await lehrer.reload();
  await lehrer.waitForSelector('#klassenwahl, [data-klasse="5t"]');
  if (await lehrer.locator('#klassenwahl').count()) await lehrer.selectOption('#klassenwahl', '5t'); else await lehrer.click('[data-klasse="5t"]');
  await lehrer.waitForSelector('#testklasse');
  // Die Klassenwahl im dunklen Kopf ist lesbar: dunkle Schrift auf hellem Feld, auch in der aufgeklappten Liste.
  if (await lehrer.locator('#klassenwahl').count()) {
    const farben = await lehrer.$eval('#klassenwahl', (s) => [s, s.options[0]].map((e) => [getComputedStyle(e).color, getComputedStyle(e).backgroundColor]));
    for (const [schrift, grund] of farben) assert.notEqual(schrift, grund);
    assert.equal(await lehrer.$eval('#klassenwahl', (s) => s.selectedOptions[0].value), '5t');
  }
  await lehrer.click('[data-tab="jetzt"]');
  await lehrer.waitForFunction(() => /Ayla/.test(document.querySelector('main')?.textContent ?? '') && /arbeitet|im Flow|beobachten|an dieser Aufgabe|kommt nicht weiter/.test(document.querySelector('main')?.textContent ?? ''), null, { timeout: 30000 });
  await foto(lehrer, 'lehrer-testklasse');
  // Testklassen zählen nicht in der Nutzungsstatistik.
  await admin.click('[data-tab="betrieb"]');
  await admin.waitForSelector('#nutzung');
  assert.equal(await admin.locator('[data-nutzung="5t"]').count(), 0);
  await admin.click('[data-tab="klassen"]');
  await admin.waitForSelector('#sim-anhalten');
  await admin.click('#sim-anhalten');
  await admin.waitForFunction(() => /Simulation in 5t beendet/.test(document.getElementById('hinweis')?.textContent ?? ''));
  assert.equal(JSON.parse(await lies(admin, `S/Mathekingdom/${jahr}/5t/${ersterBot}.json`)).aktiv, null);

  // Administrator nach dem Neuladen: ohne Laufwerkswahl gleich in die Übersicht, mit grünem Schild (Version 0.32).
  // Dabei anfangs alles zugeklappt, eine Karte allein im Reiter offen; der Zustand bleibt nach dem Neuladen.
  await admin.evaluate(() => localStorage.setItem('mk-aufgeklappt-admin', '{}'));
  await admin.reload();
  await admin.waitForSelector('nav.bereiche');
  assert.equal(await admin.innerText('#laufwerke'), '✓ Laufwerke verbunden');
  assert.match(await admin.getAttribute('#laufwerke', 'title'), /Persönliches Lehrerlaufwerk: Ordner „P“, Administrator-Schlüssel gefunden/);
  await admin.waitForSelector('#uebersicht.klappbar:not(.zu)');
  await admin.click('[data-tab="aufgaben"]');
  await admin.waitForSelector('#aufgabenmeldungen.klappbar.zu');
  assert.equal(await admin.locator('main section.klappbar:not(.zu)').count(), 0);
  assert.ok(!(await admin.isVisible('#aufgabenmeldungen #meldungen-leer, #aufgabenmeldungen table')));
  await foto(admin, 'admin-aufgaben-zugeklappt');
  await admin.click('#aufgabenmeldungen h2');
  await admin.waitForSelector('#aufgabenmeldungen.klappbar:not(.zu)');
  await admin.reload();
  await admin.waitForSelector('nav.bereiche');
  await admin.click('[data-tab="aufgaben"]');
  await admin.waitForSelector('#aufgabenmeldungen.klappbar:not(.zu)');
  assert.ok(await admin.locator('#auffaellig.klappbar.zu').count());
  await admin.click('#alle-auf');
  assert.equal(await admin.locator('main section.klappbar.zu').count(), 0);
  await admin.click('#alle-zu');
  assert.equal(await admin.locator('main section.klappbar:not(.zu)').count(), 0);
  // Lehrkraft: im Reiter „Jetzt“ sind Klassenraum und Akut-Zone anfangs offen, in „Aufgaben“ ist alles zu.
  await lehrer.evaluate(() => localStorage.setItem('mk-aufgeklappt-lehrer', '{}'));
  await lehrer.reload();
  await lehrer.waitForSelector('nav.bereiche, [data-klasse="5a"]');
  if (await lehrer.locator('[data-klasse="5a"]').count()) {
    // Mehrere Klassen: Unten auf „Deine Klassen“ steht die Beispielklasse als kleiner Link.
    assert.equal(await lehrer.innerText('#beispiel'), 'Mit einer Beispielklasse ausprobieren');
    await lehrer.click('[data-klasse="5a"]');
  }
  await lehrer.waitForSelector('nav.bereiche');
  if (await lehrer.locator('[data-tab="jetzt"]:not(.aktiv)').count()) await lehrer.click('[data-tab="jetzt"]');
  await lehrer.waitForSelector('section.klappbar[data-klapp="jetzt|Klassenraum"]:not(.zu)');
  await lehrer.waitForSelector('section.klappbar[data-klapp="jetzt|Akut-Zone"]:not(.zu)');
  await lehrer.click('[data-tab="aufgaben"]');
  await lehrer.waitForSelector('#meldungen.klappbar.zu');
  assert.equal(await lehrer.locator('main section.klappbar:not(.zu)').count(), 0);
  await foto(lehrer, 'lehrer-aufgaben-zugeklappt');
  await lehrer.click('#alle-auf');
  // Auch nach dem Neuzeichnen (alle 5 Sekunden) bleibt alles offen.
  await lehrer.waitForTimeout(5500);
  assert.equal(await lehrer.locator('main section.klappbar.zu').count(), 0);
  await foto(lehrer, 'lehrer-aufgaben-aufgeklappt');

  // Aufgabentester (0.37): Der Administrator sieht die Aufgabe wie ein Schüler, probiert sie aus und hakt sie ab.
  await admin.click('#alle-auf');
  await admin.waitForSelector('#tester-rahmen');
  const erste = await admin.getAttribute('#tester-info', 'data-kennung');
  assert.equal(erste, '5.1.1-H1-F-01');
  assert.equal(await admin.innerText('#tester-fortschritt'), `0 von ${alleAufgaben} kontrolliert`);
  assert.match(await admin.innerText('#tester-loesung'), /^7/);
  const probe = admin.frameLocator('#tester-rahmen');
  await probe.locator('form.antwort input').first().fill('7');
  await probe.locator('#pruefen').click();
  await probe.locator('text=Richtig!').waitFor();
  assert.equal(await probe.locator('#weiter').count() ? await probe.locator('#weiter').isVisible() : false, false, 'Weitergehen steuert das Admin-Dashboard');
  await foto(admin, 'admin-aufgabentester');
  await admin.click('#tester-kontrolliert');
  await admin.waitForSelector(`#tester-info:not([data-kennung="${erste}"])`);
  assert.equal(await admin.innerText('#tester-fortschritt'), `1 von ${alleAufgaben} kontrolliert`);
  const zweite = await admin.getAttribute('#tester-info', 'data-kennung');
  await probe.locator('form.antwort').waitFor();
  // Fehler melden: wird eine Aufgabenmeldung des Administrators, auf Wunsch gleich gesperrt.
  await admin.click('#tester-fehler');
  await admin.fill('#tester-melden [name=satz]', 'Probe aus dem Aufgabentester');
  await admin.click('#tester-melden-ok');
  await admin.waitForSelector(`#tester-info:not([data-kennung="${zweite}"])`);
  assert.match(await admin.innerText('#hinweis'), new RegExp(`Aufgabe ${zweite.replace(/\./g, '\\.')} ist gemeldet und gesperrt`));
  await admin.waitForSelector(`[data-meldung="${zweite}"]`);
  assert.match(await admin.innerText(`[data-meldung="${zweite}"]`), /Administrator: Lösung falsch\. Probe aus dem Aufgabentester/);
  // Export: alle Häkchen, als Datei für Claude.
  const [kontrollliste] = await Promise.all([admin.waitForEvent('download'), admin.click('#kontrollliste-export')]);
  const liste = JSON.parse(readFileSync(await kontrollliste.path(), 'utf8'));
  assert.equal(liste.art, 'mathekingdom-kontrollliste');
  assert.deepEqual(Object.keys(liste.aufgaben), [erste]);
  // Häkchen zurücknehmen: über die Kennung zur Aufgabe springen.
  await admin.fill('#tester-kennung', erste);
  await admin.press('#tester-kennung', 'Enter');
  await admin.waitForSelector(`#tester-info[data-kennung="${erste}"] #tester-zurueck`);
  await admin.click('#tester-zurueck');
  await admin.waitForSelector(`#tester-info[data-kennung="${erste}"] #tester-kontrolliert`);
  assert.equal(await admin.innerText('#tester-fortschritt'), `0 von ${alleAufgaben} kontrolliert`);
  // Die Häkchen liegen auf dem Lehrertauschlaufwerk und überstehen das Neuladen.
  await admin.click('#tester-kontrolliert');
  await admin.waitForFunction((n) => document.querySelector('#tester-fortschritt')?.textContent === `1 von ${n} kontrolliert`, alleAufgaben);
  await admin.reload();
  await admin.waitForSelector('nav.bereiche');
  await admin.click('[data-tab="aufgaben"]');
  await admin.click('#alle-auf');
  await admin.waitForSelector('#tester-fortschritt');
  assert.equal(await admin.innerText('#tester-fortschritt'), `1 von ${alleAufgaben} kontrolliert`);

  // Gitterzeichnen (0.38, ADR 0032): Punkte, Linie und Kästchen, mit der Tastatur und mit dem Zeiger gesetzt.
  {
    const rahmenTest = admin.frameLocator('#tester-rahmen');
    // Das Admin-Dashboard zeichnet sich alle paar Sekunden neu; geht dabei die getippte Kennung verloren, wird sie noch einmal eingegeben.
    const zeige = async (a) => {
      for (let versuch = 0; ; versuch++) {
        await admin.fill('#tester-kennung', a.id);
        await admin.press('#tester-kennung', 'Enter');
        const da = await admin.waitForSelector(`#tester-info[data-kennung="${a.id}"]`, { timeout: 8000 }).catch((e) => { if (versuch >= 2) throw e; return null; });
        if (da) break;
      }
      await rahmenTest.locator('svg.gitterbild.eingabe').waitFor();
    };
    const tastatur = async (a, punkte) => {
      const g = a.gitter, zellen = a.eingabe === 'zellen';
      let z = zellen ? [Math.floor((g.b - 1) / 2), Math.floor((g.h - 1) / 2)] : [Math.round(g.b / 2), Math.round(g.h / 2)];
      await rahmenTest.locator('svg.gitterbild.eingabe').focus();
      for (const p of punkte) {
        for (let k = 0; k < Math.abs(p[0] - z[0]); k++) await admin.keyboard.press(p[0] > z[0] ? 'ArrowRight' : 'ArrowLeft');
        for (let k = 0; k < Math.abs(p[1] - z[1]); k++) await admin.keyboard.press(p[1] > z[1] ? 'ArrowUp' : 'ArrowDown');
        await admin.keyboard.press('Space');
        z = p;
      }
    };
    // Mit dem Zeiger: Die Stelle im Bild folgt aus dem Blatt (Rechteck hinter dem Karo) und der Größe des Bildes.
    const zeiger = async (a, punkte) => {
      for (const p of punkte) {
        const svg = rahmenTest.locator('svg.gitterbild.eingabe');
        const ort = await svg.evaluate((el, [x, y, b, h, mitte]) => {
          const blatt = el.querySelector('.blatt'), u = Number(blatt.getAttribute('width')) / b, box = el.getBoundingClientRect(), k = box.width / el.viewBox.baseVal.width;
          return { x: (Number(blatt.getAttribute('x')) + (x + mitte) * u) * k, y: (Number(blatt.getAttribute('y')) + (h - y - mitte) * u) * k };
        }, [p[0], p[1], a.gitter.b, a.gitter.h, a.eingabe === 'zellen' ? 0.5 : 0]);
        await svg.click({ position: ort });
      }
    };
    const loese = async (a, setze, klasse, anzahl) => {
      await zeige(a);
      await setze(a, a.eingabe === 'linie' ? a.beispiel : a.loesung);
      assert.equal(await rahmenTest.locator(`svg.gitterbild.eingabe ${klasse}`).count(), anzahl, `${a.id}: ${klasse}`);
      assert.equal(await rahmenTest.locator('input[name=gitter]').inputValue(), (a.eingabe === 'linie' ? a.beispiel : a.loesung).map((q) => `(${q[0]}|${q[1]})`).join(' '), a.id);
      await rahmenTest.locator('#pruefen').click();
      await rahmenTest.locator('text=Richtig!').waitFor();
    };
    const gitter = pool.aufgaben.filter((a) => a.format === 'gitter');
    const punkte = gitter.find((a) => a.eingabe === 'punkte' && !a.offen && a.loesung.length >= 2);
    const linie = gitter.find((a) => a.eingabe === 'linie');
    const zellen = gitter.find((a) => a.eingabe === 'zellen' && a.loesung.length <= 6);
    await loese(punkte, tastatur, '.gesetzterpunkt', punkte.loesung.length);
    await loese(linie, tastatur, '.linie.gesetzt', 1);
    await foto(admin, 'admin-gitterzeichnen-linie');
    await loese(zellen, tastatur, '.zelle.gesetzt', zellen.loesung.length);
    const punkte2 = gitter.find((a) => a.eingabe === 'punkte' && !a.offen && a.loesung.length >= 2 && a.id !== punkte.id);
    await loese(punkte2, zeiger, '.gesetzterpunkt', punkte2.loesung.length);
    const zellen2 = gitter.find((a) => a.eingabe === 'zellen' && a.loesung.length <= 6 && a.id !== zellen.id);
    await loese(zellen2, zeiger, '.zelle.gesetzt', zellen2.loesung.length);
    // Ein zweiter Tipp nimmt einen Punkt wieder weg, „Neu beginnen“ leert das Gitter, und eine falsche Eingabe ist nicht richtig.
    await zeige(punkte);
    await zeiger(punkte, [punkte.loesung[0]]);
    assert.equal(await rahmenTest.locator('svg.gitterbild.eingabe .gesetzterpunkt').count(), 1);
    await zeiger(punkte, [punkte.loesung[0]]);
    assert.equal(await rahmenTest.locator('svg.gitterbild.eingabe .gesetzterpunkt').count(), 0);
    await zeiger(punkte, [punkte.loesung[0]]);
    await rahmenTest.locator('#gitter-neu').click();
    assert.equal(await rahmenTest.locator('input[name=gitter]').inputValue(), '');
    await zeiger(punkte, [punkte.loesung[0]]);
    await rahmenTest.locator('#pruefen').click();
    await admin.waitForTimeout(500);
    assert.equal(await rahmenTest.locator('text=Richtig!').count(), 0);
  }

  // Kapitel 6 (0.39, ADR 0033): Größen mit Einheit, Sachaufgaben zum Ankreuzen und die neuen Bilder.
  {
    const rahmenTest = admin.frameLocator('#tester-rahmen');
    const zeige = async (a) => {
      for (let versuch = 0; ; versuch++) {
        await admin.fill('#tester-kennung', a.id);
        await admin.press('#tester-kennung', 'Enter');
        const da = await admin.waitForSelector(`#tester-info[data-kennung="${a.id}"]`, { timeout: 8000 }).catch((e) => { if (versuch >= 2) throw e; return null; });
        if (da) break;
      }
      await rahmenTest.locator(`section.aufgabe[data-aufgabe="${a.id}"]`).waitFor();
    };
    const kapitel6 = pool.aufgaben.filter((a) => a.lernziel.startsWith('5.6.'));
    // Größe mit Einheitenwahl: erst ohne Einheit (zählt nicht als richtig), dann mit der richtigen.
    const mitWahl = kapitel6.find((a) => a.format === 'groesse' && a.einheiten);
    await zeige(mitWahl);
    assert.equal(await rahmenTest.locator('select[name=einheit] option').count(), mitWahl.einheiten.length + 1, 'Einheitenwahl');
    await rahmenTest.locator('input[name=zahl]').fill('1');
    await rahmenTest.locator('#pruefen').click();
    await admin.waitForTimeout(500);
    assert.equal(await rahmenTest.locator('text=Richtig!').count(), 0, 'ohne Einheit ist es nicht richtig');
    await zeige(mitWahl);
    await tippeGroesse(rahmenTest, mitWahl, mitWahl.loesung);
    await rahmenTest.locator('#pruefen').click();
    await rahmenTest.locator('text=Richtig!').waitFor();
    await foto(admin, 'admin-groesse-einheitenwahl');
    // Größe mit fester Einheit.
    const fest = kapitel6.find((a) => a.format === 'groesse' && !a.einheiten);
    await zeige(fest);
    assert.equal(await rahmenTest.locator('select[name=einheit]').count(), 0);
    await tippeGroesse(rahmenTest, fest, fest.loesung);
    await rahmenTest.locator('#pruefen').click();
    await rahmenTest.locator('text=Richtig!').waitFor();
    // Sachaufgabe: Angaben und Rechnung ankreuzen, dann rechnen.
    const sach = kapitel6.find((a) => a.format === 'sachaufgabe' && a.teile.some((t) => t.optionen?.length && t.mehrfach) && a.teile.some((t) => !t.optionen));
    await zeige(sach);
    for (const [i, t] of sach.teile.entries()) {
      if (t.optionen) for (const o of t.optionen) await rahmenTest.locator(`input[name="teil-${i}"][value="${o.text}"]`).setChecked(o.richtig).catch(() => {});
      else await rahmenTest.locator(`input[name="teil-${i}"]`).fill(String(t.loesung));
    }
    await foto(admin, 'admin-sachaufgabe-ankreuzen');
    await rahmenTest.locator('#pruefen').click();
    await rahmenTest.locator('text=Richtig!').waitFor();
    // Jede neue Bildart wird gezeichnet und hat eine Beschreibung in Worten.
    for (const art of ['geld', 'uhr', 'waage', 'einheitentafel', 'vergleichsbild', 'karte', 'grundriss', 'zeitleiste']) {
      const a = kapitel6.find((x) => x.bild?.art === art);
      assert.ok(a, `kein Bild der Art ${art}`);
      await zeige(a);
      const bild = rahmenTest.locator('section.aufgabe [role=img]').first();
      await bild.waitFor();
      assert.ok((await bild.getAttribute('aria-label'))?.length > 10, `${a.id}: Beschreibung fehlt`);
      await foto(admin, `admin-bild-${art}`);
    }
  }

  // Schüler ohne Internet: Die Startdatei nimmt die Kopie aus dem gemerkten Mathekingdom-Ordner.
  netz = false;
  await schueler.reload();
  await schueler.waitForSelector('#mk-weiter-knopf', { timeout: 15000 });
  await schueler.click('#mk-weiter-knopf');
  await schueler.waitForSelector('#code');
  assert.match(await schueler.innerText('#version'), /Kopie/);
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
  // Die Aufgabenkennung steht klein unten links (ADR 0025).
  assert.equal(await seite.innerText('#kennung'), await seite.getAttribute('section.aufgabe', 'data-aufgabe'));
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
  await fotoStabil(seite, '.kopf', 'kopfzeile-marke-am-wappen');
  await seite.click('#wappen-knopf');
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
  await seite.click('#wappen-knopf');
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

// ---------- 10. Hoftitel nur in der Kopfzeile (ADR 0023, Version 0.20) ----------
{
  const L = await import('../src/schueler/logik.js');
  const index = L.indexiere(pool);
  const ok = { geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, dauer: 20 };
  const meilensteine = pool.kapitel[2].unterkapitel.slice(0, 3);
  // Kronen entstehen wie im Unterricht aus gelösten Aufgaben: je Lernziel die drei schwersten richtig.
  const stand = (code, kronen, extra = {}) => {
    const st = { ...leererStand(code), ...extra };
    kronen.forEach(([m, n, ziel = 'M']) => meilensteine[m].lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id)).forEach((l) =>
      [...index.nach.get(`${l.id}|${n}`)].sort((a, b) => b.afb - a.afb).slice(0, 3).forEach((a) => L.verbuche(st, a, ok, ziel, t0, index))));
    return st;
  };
  const heute = new Date(Date.now() - 60000).toISOString();
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await mitStand(seite, stand('5A-EHRE', [[0, 'M']], { spiele: [{ spiel: 'botenritt', t: heute, punkte: 9 }] }));
  await mitStand(seite, stand('5A-KKKK', [[0, 'E'], [1, 'M']], { spiele: [{ spiel: 'botenritt', t: heute, punkte: 12 }] }));
  await mitStand(seite, stand('5A-LLLL', [[0, 'G']]));
  await mitStand(seite, stand('5A-NNNN', [[0, 'F', 'F']]));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-ehre');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  // Der Titel steht nur in der Kopfzeile, immer in der männlichen Form, ohne Meldung und ohne Tafel.
  await seite.waitForSelector('#hoftitel-kopf');
  assert.equal(await seite.innerText('#hoftitel-kopf'), 'Herzog');
  assert.equal(await seite.locator('#hoftitel-kopf .hofsymbol-herzog').count(), 1);
  assert.equal(await seite.locator('#ehrentafel, #hoftitel-neu').count(), 0);
  await seite.locator('.kopf').screenshot(bilder ? { path: `${bilder}/kopfzeile-hoftitel.png` } : {});
  await seite.click('#nav-spiele');
  await seite.waitForSelector('#bestenliste-botenritt li');
  assert.equal(await seite.locator('#bestenliste-botenritt .hofsymbol').count(), 0, 'kein Symbol in der Bestenliste');
  assert.equal(await seite.locator('#beiname [data-titelform]').count(), 0);
  assert.equal(await seite.innerText('#hoftitel-kopf'), 'Herzog');
  assert.deepEqual(fehler, []);
  await seite.close();
}

// ---------- 11. Aufgabenführung und „Das kannst du schon“ (ADR 0026) ----------
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  const vor = new Date(Date.now() - 10 * 86400000).toISOString();
  const potenzen = pool.kapitel.find((k) => k.id === '5.4').unterkapitel.find((u) => u.id === '5.4.4');
  const kopf = pool.kapitel.find((k) => k.id === '5.3').unterkapitel[0];
  const stand = leererStand('5A-FUEH');
  stand.lernziele = Object.fromEntries([potenzen.lernziele[0], ...kopf.lernziele].map((l) => [l.id, { erreichtAm: vor }]));
  await mitStand(seite, stand);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '5a-fueh');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  // Siegel oben anklicken: alle Lernziele mit Siegel als Ich-kann-Sätze, nach Kapitel geordnet.
  assert.match(await seite.getAttribute('#siegel-knopf', 'title'), /^\d+ Siegel\. Klick: Das kannst du schon$/);
  await seite.click('#siegel-knopf');
  await seite.waitForSelector('#koennen');
  const alle = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => pool.aufgaben.some((a) => a.lernziel === l.id)).length;
  assert.equal(await seite.innerText('#koennen-zaehler'), `${1 + kopf.lernziele.length} von ${alle} Lernzielen in Klasse 5`);
  assert.deepEqual(await seite.locator('.koennen-kapitel').evaluateAll((d) => d.map((x) => x.dataset.kapitel)), ['5.3', '5.4']);
  assert.match(await seite.innerText('#koennen'), new RegExp(potenzen.lernziele[0].text.slice(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.equal(await seite.locator(`[data-lernziel="${potenzen.lernziele[1].id}"]`).count(), 0, 'ohne Siegel steht es nicht da');
  await foto(seite, 'das-kannst-du-schon');
  // Potenzen fertig machen: Danach führt „Nächste Aufgabe“ zum nächsten Meilenstein, nicht im Kreis.
  await seite.click('nav button:has-text("Schlossgarten")');
  await seite.click('[data-kapitel="5.4"]');
  await seite.locator('.regionskarte .meilenstein[aria-label^="Meilenstein Potenzen"]').click();
  await seite.locator('.lernziele li', { hasText: potenzen.lernziele[1].text }).locator('button').click();
  for (let i = 0; i < 3; i++) {
    if (i > 0) await weiter(seite, '#weiter');
    await antworte(seite, true);
    await seite.waitForSelector('.ergebnis.richtig');
  }
  if (await seite.locator('#krone-wechseln').count()) await seite.click('button:has-text("Bei Gold bleiben")');
  else { assert.equal(await seite.innerText('#weiter'), 'Weiter zu Dividieren'); await foto(seite, 'weiter-zu-dividieren'); await weiter(seite, '#weiter'); }
  // Jetzt ist ein Seitenblick fällig: Er sagt, wo es danach weitergeht.
  await seite.waitForSelector('section.aufgabe');
  if (await seite.locator('#seitenblick-marke').count()) {
    assert.equal(await seite.innerText('#seitenblick-satz'), 'Kurzer Blick zurück, danach geht es mit Dividieren weiter.');
    await foto(seite, 'seitenblick-satz');
    await antworte(seite, true);
    await weiter(seite, '#weiter');
  }
  const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
  assert.match(pool.aufgaben.find((a) => a.id === id).lernziel, /^5\.4\.5-/, 'die Führung ist bei Dividieren');
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
