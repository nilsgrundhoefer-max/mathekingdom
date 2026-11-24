// Klasse 6 (ADR 0037 und 0038) im echten Browser: Jede Aufgabe wird im gebauten Schüler-Dashboard (Probeansicht des Aufgabentesters)
// gezeigt und über die Oberfläche gelöst, bei 420 Pixel Breite. Die richtige Lösung muss als richtig gelten, der erste typische Fehler als falsch.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import { schreibe } from '../src/schueler/groessen.js';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
// KAPITEL=2 prüft nur die Aufgaben eines Kapitels, ohne Angabe alle.
const neun = pool.aufgaben.filter((a) => process.env.KAPITEL === "0" ? false : !process.env.KAPITEL || a.lernziel.startsWith(`6.${process.env.KAPITEL}.`));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '6.2.1-A1-F-05': 'akku-F', '6.2.1-A2-F-03': 'ueber-ein-ganzes-F', '6.2.2-U1-F-01': 'zwei-schritte-F', '6.2.2-U1-M-01': 'hauptnenner-M', '6.2.3-V1-F-01': 'vervielfachen-F', '6.2.4-T1-F-01': 'teilen-F',
  '6.2.5-P1-F-01': 'rechteckbild-F', '6.2.6-D1-M-04': 'dividieren-M', '6.2.6-D2-E-01': 'dividieren-E', '6.2.7-R1-G-01': 'punkt-vor-strich-G', '6.2.7-R2-E-01': 'klammern-E',
  '6.1.1-B2-G-04': 'gemischte-zahl-G', '6.1.2-W1-F-01': 'erweitern-F', '6.1.3-K2-F-04': 'kuerzen-in-schritten-F', '6.1.4-V1-F-04': 'ordnen-F', '6.1.4-V2-M-02': 'gleichnamig-M', '6.1.5-T1-M-01': 'groesse-einheit-waehlen-M', '6.1.6-Z1-F-06': 'zahlenstrahl-ablesen-F', '6.1.6-Z2-M-04': 'zahlenstrahl-eintragen-M' };

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
  else if (auf.format === 'groesse') {
    const [zahl, einheit] = schreibe(falsch ?? auf.loesung, auf.einheit).split(/\s(?=\S+$)/);
    await seite.fill('input[name=zahl]', zahl); if (auf.einheiten) await seite.selectOption('select[name=einheit]', einheit);
  } else if (auf.format === 'zahlenstrahl') await seite.click(`svg.zahlenstrahl [data-wert="${falsch ?? auf.loesung}"]`);
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
  const f = ['zahl', 'zahlenstrahl', 'bruch', 'faerben', 'groesse'].includes(auf.format) ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(seite, auf.id); assert.equal(await antworte(seite, auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
}
assert.deepEqual(fehler, []);
// Fast richtig (ADR 0037): Ein ungekürzter Bruch mit richtigem Wert bekommt zweimal den Hinweis und kostet keinen Versuch, beim dritten Mal zählt er als Fehlversuch.
const eins = pool.aufgaben.filter((a) => a.lernziel.startsWith('6.1.'));
const kurz = eins.find((a) => a.format === 'bruch' && a.gekuerzt && !a.gemischt && /^\d+⁄\d+$/.test(a.loesung));
const k = teileBruch(kurz.loesung);
await zeige(seite, kurz.id);
for (let mal = 1; mal <= 2; mal++) {
  await seite.fill('input[name=bruch-z]', String(k.z * 2 * mal)); await seite.fill('input[name=bruch-n]', String(k.n * 2 * mal));
  await seite.click('#pruefen');
  await seite.waitForFunction(() => document.querySelector('section.aufgabe')?.innerText.includes('Fast richtig'));
  assert.equal(await seite.evaluate(() => window.ergebnisse.length), 0);
  assert.equal(await seite.locator('section.aufgabe').innerText().then((t) => t.includes('Das stimmt noch nicht')), false, 'Fast richtig zählt nicht als Fehlversuch');
  assert.equal(await seite.inputValue('input[name=bruch-z]'), String(k.z * 2 * mal), 'die Eingabe bleibt zum Nachbessern stehen');
  if (bilder && mal === 1) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/fast-richtig-420.png` });
}
await seite.fill('input[name=bruch-z]', String(k.z * 6)); await seite.fill('input[name=bruch-n]', String(k.n * 6));
await seite.click('#pruefen');
await seite.waitForFunction(() => document.querySelector('section.aufgabe')?.innerText.includes('Das stimmt noch nicht'));
await seite.fill('input[name=bruch-z]', k.z); await seite.fill('input[name=bruch-n]', k.n);
await seite.click('#pruefen');
await seite.waitForFunction(() => window.ergebnisse.length > 0);
assert.equal(await seite.evaluate(() => window.ergebnisse.at(-1).richtig), true);
// Eine Lücke im Zähler oder Nenner steht im gestapelten Bruch: Feld über oder unter dem Bruchstrich.
const luecke = eins.find((a) => a.format === 'luecken' && /\{\{\w+\}\}⁄\d/.test(a.text));
await zeige(seite, luecke.id);
assert.ok(await seite.evaluate(() => { const b = document.querySelector('.lueckenbruch'); if (!b) return false; const z = b.querySelector('.bz input')?.getBoundingClientRect(), n = b.querySelector('.bn').getBoundingClientRect(); return z && n.top >= z.bottom - 1; }), `${luecke.id}: Lücke steht nicht über dem Bruchstrich`);
if (bilder) {
  const breit = await seiteMit(1200);
  for (const [id, name] of Object.entries(FOTOS)) { await zeige(breit.seite, id); await breit.seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${name}-1200.png` }); }
  assert.deepEqual(breit.fehler, []);
}
// Brücke in die Vorstufe (ADR 0037): Ein Schüler der Klasse 6 wird auf Gold bei „Bruchteile an Bildern“ wackelig,
// geht die Brücke und löst drei Aufgaben aus Klasse 5. Danach führt der Weg zurück zum Lernziel der Klasse 6.
{
  const seite = await browser.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
  const fehlerB = [];
  seite.on('pageerror', (e) => fehlerB.push(e.message));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '6a-eins');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  assert.ok(await seite.locator('.region').count() >= 1);
  assert.equal(await seite.locator('[data-kapitel^="5."]').count(), 0, 'eine Klasse 6 sieht keine Tore der Klasse 5');
  if (bilder) await seite.screenshot({ path: `${bilder}/schlossgarten-klasse-6-420.png`, fullPage: true });
  await seite.click('[data-kapitel="6.1"]');
  await seite.waitForSelector('svg.regionskarte');
  if (bilder) await seite.screenshot({ path: `${bilder}/regionskarte-klasse-6-420.png`, fullPage: true });
  await seite.locator('.meilenstein .stein').nth(0).click();
  if (await seite.locator('#einstieg-ueberspringen').count()) await seite.click('#einstieg-ueberspringen');
  await seite.click('.kronenwahl button[data-krone="M"]');
  await seite.locator('.lernziele li').nth(0).locator('button').click();
  const alle = new Map([...pool.aufgaben, ...pool.vorstufe.aufgaben].map((a) => [a.id, a]));
  const aktuelle = async () => { await seite.waitForSelector('section.aufgabe #pruefen'); return alle.get(await seite.getAttribute('section.aufgabe', 'data-aufgabe')); };
  const loese = async (auf, richtig) => {
    if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(richtig ? auf.loesung : Number(auf.loesung) + 1));
    else if (auf.format === 'bruch') { const b = richtig ? teileBruch(auf.loesung) : { g: '', z: '97', n: '98' }; if (auf.gemischt) await seite.fill('input[name=bruch-g]', b.g ?? ''); await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n); }
    else if (auf.format === 'faerben') { await seite.evaluate(() => { for (const el of document.querySelectorAll('svg.bruchbild.eingabe .bruchteil.voll')) el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); for (let i = 0; i < auf.loesung + (richtig ? 0 : 1); i++) await seite.click(`svg.bruchbild.eingabe [data-nr="${i}"]`); }
    else if (auf.format === 'auswahl') await kreuze(seite, 'option', auf.optionen.filter((o) => (auf.mehrfach ? o.richtig === richtig || (!richtig && o.richtig) : o.richtig === richtig)).slice(0, auf.mehrfach && richtig ? 99 : 1).map((o) => o.text));
    else if (auf.format === 'luecken') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, String(richtig ? l.loesung : Number(l.loesung) + 1)); }
    else throw new Error(`${auf.id}: Format ${auf.format} kennt die Brückenprobe nicht`);
    await seite.click('#pruefen');
  };
  // Nach fünf Aufgaben macht das Dashboard eine Rast („Wegstück geschafft“). Von dort geht es weiter.
  const rast = async () => { await seite.waitForSelector('section.aufgabe #pruefen, button:has-text("Nächstes Wegstück")'); const knopf = seite.locator('button:has-text("Nächstes Wegstück")'); if (await knopf.count()) await knopf.click(); };
  const weiter = async () => { await seite.click('#weiter'); await rast(); };
  let angebot = false;
  for (let i = 0; i < 6 && !angebot; i++) {
    const auf = await aktuelle();
    assert.match(auf.id, /^6\.1\.1-B1-M/);
    await loese(auf, false); await seite.waitForSelector('.hinweis');
    await loese(auf, false); await seite.waitForSelector('.ergebnis.falsch');
    angebot = (await seite.locator('#bruecke-angebot').count()) > 0;
    // Zwischendurch schlägt das Dashboard vor, um Silber zu spielen. Der Schüler bleibt bei Gold.
    if (!angebot) { await seite.locator('#weiter, button:has-text("Bei Gold bleiben")').first().click(); await rast(); }
  }
  assert.ok(angebot, 'nach mehreren Fehlversuchen bietet das Dashboard eine Brücke an');
  assert.match(await seite.innerText('#bruecke-angebot'), /Brücke/);
  await seite.waitForTimeout(800);
  if (bilder) await seite.screenshot({ path: `${bilder}/bruecke-angebot-klasse-6-420.png`, fullPage: true });
  await seite.click('#bruecke-start');
  await rast();
  for (let i = 0; i < 3; i++) {
    const auf = await aktuelle();
    assert.match(auf.id, /^5\.9\.1-B[12]-G/, 'die Brücke zeigt Aufgaben aus Klasse 5, eine Stufe tiefer');
    assert.match(await seite.innerText('.brueckenmarke'), new RegExp(`Brücke ${i + 1} von 3`));
    assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
    if (bilder && i === 0) await seite.screenshot({ path: `${bilder}/bruecke-aufgabe-klasse-5-420.png`, fullPage: true });
    await loese(auf, true);
    await seite.waitForSelector('.ergebnis.richtig');
    if (i < 2) await weiter();
  }
  assert.match(await seite.innerText('#bruecke-fertig'), /Brücke geschafft!\s+3 von 3 richtig/);
  await weiter();
  assert.match((await aktuelle()).id, /^6\.1\.1-B1/);
  // Zurück im Schlossgarten: weiterhin nur Klasse 6, und nichts ist abgestürzt.
  const stand = JSON.parse(await seite.evaluate(() => localStorage.getItem('mk-demo-6a/6A-EINS.json')));
  assert.equal(stand.bruecken.length, 1);
  assert.ok(stand.versuche.some((v) => v.lernziel.startsWith('5.9.1')));
  await seite.click('#zurueck');
  await seite.waitForSelector('svg.regionskarte');
  assert.deepEqual(fehlerB, []);
}
// Niveau-Meilenstein (ADR 0038): Mit Zielniveau Silber ist „Brüche dividieren“ ein freiwilliger Abstecher mit Aufgaben von Gold.
{
  const seite = await browser.newPage({ viewport: { width: 420, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
  const fehlerN = [];
  seite.on('pageerror', (e) => fehlerN.push(e.message));
  // Die Klassendatei der Demo-Klasse setzt das Zielniveau dieses Schülers auf Silber.
  await seite.addInitScript(() => localStorage.setItem('mk-demo-6a/klassendatei.json', JSON.stringify({ zielniveaus: { '6A-ZWEI': 'G' } })));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '6a-zwei');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('[data-kapitel="6.2"]');
  await seite.waitForSelector('svg.regionskarte');
  if (await seite.locator('#einstieg-ueberspringen').count()) await seite.click('#einstieg-ueberspringen');
  assert.equal(await seite.locator('svg.regionskarte .meilenstein').count(), 7);
  assert.equal(await seite.locator('svg.regionskarte path.abstecher').count(), 1, 'der Niveau-Meilenstein hängt als Abstecher unter dem Weg');
  assert.deepEqual(await seite.locator('svg.regionskarte .steinnummer').allTextContents(), ['1', '2', '3', '4', '5', '6'], 'der Weg zählt ohne den Abstecher');
  if (bilder) await seite.locator('.kartenrahmen').screenshot({ path: `${bilder}/regionskarte-niveau-abstecher-420.png` });
  await seite.locator('svg.regionskarte .meilenstein[aria-label*="Brüche dividieren"] .stein').click();
  await seite.waitForSelector('#niveau-abstecher');
  assert.equal(await seite.locator('#niveau-marke').innerText(), 'ab Gold');
  assert.equal(await seite.locator('.tafel .kronenwahl').count(), 0, 'am Abstecher gibt es keine Kronenwahl');
  if (bilder) await seite.locator('.karte.tafel').screenshot({ path: `${bilder}/tafel-niveau-abstecher-420.png` });
  await seite.click('#aufbrechen');
  await seite.waitForSelector('section.aufgabe #pruefen');
  const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
  assert.match(id, /^6\.2\.6-D1-M-/, 'die Aufgabe kommt von Gold');
  assert.deepEqual(fehlerN, []);
}
// Wappenbereich Klasse 6 (ADR 0039): Schildteilung kaufen, zweite Farbe wählen; die späteren Bereiche stehen als Ausblick mit Vorschaubild da.
{
  const seite = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: bilder ? 2 : 1 });
  const fehlerW = [];
  seite.on('pageerror', (e) => fehlerW.push(e.message));
  const t0 = new Date(Date.now() - 60000).toISOString();
  // 50 Siegel (Rang Fährtenleser) und 3.000 Münzen, dazu zwei gekaufte Farben.
  const stand = { version: 2, code: '6A-WAPP', klasse: '6a', erstellt: t0, geaendert: t0, muenzen: 3000, niveau: {}, niveauMarke: {}, versuche: [], hilferuf: null, hilferufe: [],
    lernziele: Object.fromEntries(Array.from({ length: 50 }, (_, i) => [`x.${i}`, { erreichtAm: t0 }])),
    wappen: { farbe: 'blau', zeichen: ['lilie'], gekauft: ['rot', 'blau', 'gold', 'silber', 'lilie'] }, spiele: [], aktiv: null, abbrueche: [], gelesen: null, einschaetzung: {}, betrieb: [], grundlage: {} };
  await seite.addInitScript((text) => { if (!localStorage.getItem('mk-demo-6a/6A-WAPP.json')) localStorage.setItem('mk-demo-6a/6A-WAPP.json', text); }, JSON.stringify(stand));
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', '6a-wapp');
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  await seite.click('#wappen-knopf');
  await seite.waitForSelector('#bereich-6');
  assert.equal(await seite.locator('#bereich-6 ~ .teile-liste li.teil').count(), 10);
  assert.equal(await seite.locator('.werkbank svg .teilung').count(), 0);
  await seite.click('[data-teil=geviert]:has-text("kaufen")');
  assert.equal(await seite.innerText('#muenzen'), String(3000 - 550));
  assert.equal(await seite.locator('.werkbank svg .schild[data-teilung=geviert] .teilung').count(), 1, 'der Schild ist geviert');
  assert.equal(await seite.locator('#kopf svg.wappen .teilung, header svg.wappen .teilung').count() >= 1, true, 'auch das kleine Wappen in der Kopfzeile zeigt die Teilung');
  // Zweite Farbe: voreingestellt die erste gekaufte, die nicht die Schildfarbe ist; wählbar ist jede andere gekaufte.
  const farbe2 = () => seite.getAttribute('.werkbank svg .teilung', 'fill');
  const vorher = await farbe2();
  await seite.click('[data-farbe2=gold]');
  assert.equal(await farbe2(), '#d2a93c');
  assert.notEqual(vorher, '#d2a93c');
  assert.equal(await seite.locator('[data-farbe2=blau]').count(), 0, 'die Schildfarbe steht nicht zur Wahl');
  // Teile über dem Rang sind noch nicht kaufbar; Teile späterer Klassenstufen stehen nur im Ausblick.
  assert.match(await seite.innerText('li:has([data-teil=geviert]) ~ li:has-text("Geständert")'), /Ab Rang Landvermesser/);
  assert.equal(await seite.locator('[data-teil=topfhelm]').count(), 0);
  assert.equal(await seite.locator('#ausblick li').count(), 4);
  assert.equal(await seite.locator('#ausblick li svg.volles-wappen').count(), 4, 'jeder spätere Bereich hat ein Vorschaubild');
  assert.match(await seite.innerText('#ausblick'), /Helmzier öffnet sich in Klasse 7[\s\S]*Prunkrahmen öffnet sich in Klasse 10/);
  assert.doesNotMatch(await seite.innerText('#ausblick'), /Krone/);
  if (bilder) await seite.screenshot({ path: `${bilder}/wappenschrank-klasse-6.png`, fullPage: true });
  await seite.click('[data-teil=geviert]');
  assert.equal(await seite.locator('.werkbank svg .teilung').count(), 0, 'Abnehmen macht den Schild wieder einfarbig');
  assert.deepEqual(fehlerW, []);
}
await browser.close();
console.log(`Klasse 6 im Browser in Ordnung: ${neun.length} Aufgaben gelöst, ${falschGeprueft} typische Fehler als falsch erkannt, „Fast richtig“, eine Brücke in die Klasse 5, der Niveau-Meilenstein und der Wappenbereich geprüft.`);
