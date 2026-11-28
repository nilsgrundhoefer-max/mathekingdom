// Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058) im echten Browser: Jede der 240 Aufgaben wird im gebauten Schüler-Dashboard
// (Probeansicht des Aufgabentesters) bei 1200 Pixel Breite gezeigt und über die Oberfläche gelöst, denn die Kinder arbeiten am PC.
// Die richtige Lösung gilt als richtig, bei Zahlen und beim Streifen färben auch der erste typische Fehler als falsch. Jede Heftaufgabe trägt das Heftband.
// Kreis- und Streifendiagramm: Jeder Ausschnitt und jeder Abschnitt steht im Bild, keine Beschriftung ragt hinaus.
// Streifen färben: Farbe wählen, Kästchen antippen. Datensatz erfinden: Eine andere passende Reihe als das Beispiel gilt auch als richtig.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-daten.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.8.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
// Beispielbilder für Nils: je ein typisches Bild der neuen Darstellungen.
const FOTOS = { '6.8.1-E1-F-01': 'urliste-tabelle-F', '6.8.2-K2-G-01': 'mittelwert-G', '6.8.2-K2-E-03': 'datensatz-erfinden-E', '6.8.4-H1-G-01': 'relative-haeufigkeit-G',
  '6.8.5-L1-F-01': 'kreisdiagramm-F', '6.8.5-L1-M-01': 'kreisdiagramm-winkel-M', '6.8.5-L2-G-01': 'streifendiagramm-G', '6.8.5-L2-E-04': 'abgeschnittene-achse-E',
  '6.8.6-D1-M-01': 'streifen-faerben-M', '6.8.6-D1-E-06': 'streifen-irrefuehrend-E', '6.8.6-D2-M-01': 'winkeltabelle-M', '6.8.6-D2-M-06': 'heftaufgabe-kreisdiagramm-M', '6.8.6-D2-E-04': 'kreis-irrefuehrend-E' };

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
const kreuze = (name, richtige) => seite.evaluate(([n, r]) => { for (const i of document.querySelectorAll(`form.antwort input[name="${n}"]`)) if (i.checked !== r.includes(i.value)) i.click(); }, [name, richtige]);
const teileBruch = (text) => { const m = String(text).match(/^(\d+)⁄(\d+)$/); return { z: m[1], n: m[2] }; };
// Streifen färben über die Knöpfe: je Farbe so viele Kästchen, von links nach rechts.
async function faerbe(anzahlen) {
  let nr = 0;
  for (const [i, k] of anzahlen.entries()) {
    await seite.click(`section.aufgabe .farbknopf[data-farbe="${i}"]`);
    for (let j = 0; j < k; j++) await seite.click(`section.aufgabe .streifenkaestchen[data-nr="${nr++}"]`);
  }
}
// Eine andere Reihe mit demselben Mittelwert und derselben Spannweite: kleinsten und größten Wert behalten, zwei innere Werte auseinanderschieben.
function andereReihe(auf) {
  const l = Object.values(auf.luecken).map((x) => Number(x.loesung)), s = [...l].sort((a, b) => a - b), d = auf.datensatz;
  if (s.length < 4) return null;
  const neu = [...s];
  // Mit Zentralwert: den mittleren Wert behalten, die beiden unteren auseinanderschieben.
  if (d.zentralwert != null) { if (neu[0] - 1 >= d.von && neu[1] + 1 <= neu[2]) { neu[0] -= 1; neu[1] += 1; return neu; } return null; }
  if (neu[1] - 1 >= neu[0] && neu[2] + 1 <= neu.at(-1)) { neu[1] -= 1; neu[2] += 1; } else return null;
  return neu.join(',') === s.join(',') ? null : neu;
}
async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(falsch ?? auf.loesung));
  else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') {
    const werte = falsch ?? Object.values(auf.luecken).map((l) => l.loesung);
    for (const [i, n] of Object.keys(auf.luecken).entries()) await seite.fill(`input[name="luecke-${n}"]`, String(werte[i]));
  } else if (auf.format === 'bruch') { const b = teileBruch(falsch ?? auf.loesung); await seite.fill('input[name=bruch-z]', b.z); await seite.fill('input[name=bruch-n]', b.n); }
  else if (auf.format === 'streifenfaerben') await faerbe(falsch ?? auf.farben.map((f) => f.loesung));
  else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || /Das stimmt noch nicht|Fast richtig/.test(document.querySelector('section.aufgabe')?.innerText ?? ''));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, heft = 0, kreise = 0, streifen = 0, gefaerbt = 0, andere = 0, tabellen = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  // Kein Bild ist breiter als die Karte, und keine Beschriftung ragt aus einem Diagramm.
  const draussen = await seite.evaluate(() => {
    const karte = document.querySelector('section.aufgabe').getBoundingClientRect(), aus = [];
    for (const el of document.querySelectorAll('section.aufgabe svg, section.aufgabe table, section.aufgabe .faerbestreifen')) {
      const r = el.getBoundingClientRect();
      if (r.left < karte.left - 1 || r.right > karte.right + 1) aus.push(`${el.tagName} breiter als die Karte`);
      if (el.tagName.toLowerCase() === 'svg') for (const t of el.querySelectorAll('text')) { const b = t.getBoundingClientRect(); if (b.width && (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1)) aus.push(`„${t.textContent}“ ragt aus dem Bild`); }
    }
    return aus;
  });
  assert.deepEqual(draussen, [], auf.id);
  if (auf.bild?.art === 'kreisdiagramm') {
    assert.equal(await seite.locator('section.aufgabe svg.kreisdiagramm .ausschnitt').count(), auf.bild.teile.length, `${auf.id}: Ausschnitte im Kreisdiagramm`);
    const text = await seite.locator('section.aufgabe svg.kreisdiagramm').textContent();
    for (const t of auf.bild.teile) assert.ok(text.includes(t.name), `${auf.id}: ${t.name} fehlt in der Legende`);
    kreise++;
  }
  if (auf.bild?.art === 'streifendiagramm') {
    assert.equal(await seite.locator('section.aufgabe svg.streifendiagramm .abschnitt').count(), auf.bild.teile.length, `${auf.id}: Abschnitte im Streifendiagramm`);
    streifen++;
  }
  if (auf.daten) { assert.ok(await seite.locator('section.aufgabe .bildrahmen table').count() >= 1, `${auf.id}: Datentabelle fehlt`); tabellen++; }
  if (auf.format === 'streifenfaerben') {
    assert.equal(await seite.locator('section.aufgabe .streifenkaestchen').count(), 20, `${auf.id}: 20 Kästchen`);
    assert.equal(await seite.locator('section.aufgabe .farbknopf').count(), auf.farben.length, `${auf.id}: Farbknöpfe`);
  }
  const band = await seite.locator('section.aufgabe #heftband').count();
  assert.equal(band, auf.heftaufgabe ? 1 : 0, `${auf.id}: Heftband ${band ? 'zu viel' : 'fehlt'}`);
  if (band) heft++;
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-1200.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = ['zahl', 'streifenfaerben'].includes(auf.format) ? auf.typischeFehler?.[0] : null;
  if (f) {
    await zeige(auf.id);
    assert.equal(await antworte(auf, f.werte ?? f.wert), false, `${auf.id}: Der typische Fehler ${f.werte ?? f.wert} gilt als richtig`);
    falschGeprueft++;
    if (auf.format === 'streifenfaerben') gefaerbt++;
  }
  if (auf.datensatz) {
    const neu = andereReihe(auf);
    if (neu) { await zeige(auf.id); assert.equal(await antworte(auf, neu), true, `${auf.id}: Die andere passende Reihe ${neu} gilt nicht als richtig`); andere++; }
  }
}
assert.equal(heft, aufgaben.filter((a) => a.heftaufgabe).length);
assert.ok(kreise >= 20 && streifen >= 20 && gefaerbt >= 10, `Kreise ${kreise}, Streifen ${streifen}, gefärbt ${gefaerbt}`);
assert.deepEqual(fehler, []);
await browser.close();
console.log(`Klasse 6 Kapitel 8 im Browser bei 1200 Pixel: ${aufgaben.length} Aufgaben gelöst, ${kreise} Kreisdiagramme, ${streifen} Streifendiagramme, ${tabellen} Datentabellen, ${heft} Heftaufgaben mit Heftband, ${falschGeprueft} typische Fehler geprüft (${gefaerbt} beim Streifen färben), ${andere} andere passende Datensätze.`);
