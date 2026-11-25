// Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050) im echten Browser: Jede der 288 Aufgaben wird im gebauten Schüler-Dashboard
// (Probeansicht des Aufgabentesters) bei 1200 Pixel Breite gezeigt und über die Oberfläche gelöst, denn die Kinder arbeiten am PC.
// Die richtige Lösung gilt als richtig, bei Zahlen auch der erste typische Fehler als falsch. Jede Heftaufgabe trägt das Heftband.
// Schaubild: Achsennamen und Einteilung stehen im Bild, Punkte werden angetippt, die Nachfrage gehört zur Antwort,
// und vertauschte Achsen sind ein eigener Fehler (geprüft, wo der vertauschte Punkt ins Gitter passt; sonst in tests/klasse-6-zuordnungen.test.js). Dreisatztabelle: Auf F stehen die Rechenpfeile da, auf G trägt das Kind sie ein.
// Aufruf: node tools/baue.mjs && node tests/browser-klasse-6-zuordnungen.mjs   (braucht Playwright; BILDER=Ordner speichert Bildschirmfotos)
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const { chromium } = createRequire(import.meta.url)('playwright');
const wurzel = new URL('../', import.meta.url);
const pool = JSON.parse(readFileSync(new URL('aufgabenpool/klasse-6.json', wurzel), 'utf8'));
const aufgaben = pool.aufgaben.filter((a) => a.id.startsWith('6.7.'));
const bilder = process.env.BILDER;
if (bilder) mkdirSync(bilder, { recursive: true });
const FOTOS = { '6.7.1-D1-F-02': 'schaubild-punkte-F', '6.7.1-D1-M-02': 'zwei-linien-M', '6.7.1-D2-G-01': 'punkte-eintragen-G', '6.7.1-D2-G-05': 'bildkarten-schaubilder-G',
  '6.7.2-P1-G-04': 'drei-tabellen-G', '6.7.2-P2-G-03': 'wertetabelle-G', '6.7.5-S2-M-04': 'heftaufgabe-M', '6.7.6-R1-F-01': 'dreisatztabelle-F', '6.7.6-R1-G-01': 'dreisatztabelle-rechenpfeile-G',
  '6.7.6-R1-F-05': 'dreisatz-letzte-zeile-F', '6.7.7-A1-E-03': 'bildkarten-kurve-E', '6.7.7-A1-E-05': 'kurve-ablesen-E', '6.7.8-U1-E-01': 'dreisatz-antiproportional-E' };

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
const tippe = async (auf, punkt) => {
  const svg = seite.locator('svg.gitterbild.eingabe');
  const ort = await svg.evaluate((el, [x, y, h]) => {
    const blatt = el.querySelector('.blatt'), u = Number(blatt.getAttribute('height')) / h, box = el.getBoundingClientRect(), k = box.width / el.viewBox.baseVal.width;
    return { x: (Number(blatt.getAttribute('x')) + x * u) * k, y: (Number(blatt.getAttribute('y')) + (h - y) * u) * k };
  }, [punkt[0], punkt[1], auf.gitter.h]);
  await svg.click({ position: ort });
};
async function antworte(auf, falsch = null) {
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(falsch ?? auf.loesung));
  else if (auf.format === 'auswahl') await kreuze('option', auf.optionen.filter((o) => o.richtig).map((o) => o.text));
  else if (auf.format === 'luecken' || auf.format === 'tabelle') { for (const [n, l] of Object.entries(auf.luecken)) await seite.fill(`input[name="luecke-${n}"]`, String(l.loesung)); }
  else if (auf.format === 'gitter') {
    for (const p of falsch ?? auf.loesung) await tippe(auf, p);
    if (auf.nachfrage) await kreuze('nachfrage', [auf.nachfrage.optionen.find((o) => o.richtig).text]);
  } else throw new Error(`${auf.id}: Format ${auf.format} kennt dieser Test nicht`);
  await seite.click('#pruefen');
  await seite.waitForFunction(() => window.ergebnisse.length > 0 || /Das stimmt noch nicht|Fast richtig/.test(document.querySelector('section.aufgabe')?.innerText ?? ''));
  return seite.evaluate(() => (window.ergebnisse.length ? window.ergebnisse.at(-1).richtig : false));
}

let falschGeprueft = 0, heft = 0, mitBild = 0, schaubilder = 0, nachfragen = 0, vertauscht = 0, pfeilfelder = 0;
for (const auf of aufgaben) {
  if (process.env.LAUT) console.log(auf.id);
  await zeige(auf.id);
  assert.ok(await seite.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${auf.id}: Seite ist breiter als der Bildschirm`);
  if (auf.bild) {
    mitBild++;
    assert.ok(await seite.locator('section.aufgabe .bildrahmen svg, section.aufgabe .bildrahmen table, section.aufgabe .bildrahmen .dreisatz').count() >= 1, `${auf.id}: Bild fehlt`);
  }
  // Kein Text ragt aus einem Schaubild, und kein Bild ist breiter als die Karte.
  const draussen = await seite.evaluate(() => {
    const karte = document.querySelector('section.aufgabe').getBoundingClientRect(), aus = [];
    for (const el of document.querySelectorAll('section.aufgabe svg.gitterbild, section.aufgabe table, section.aufgabe .dreisatz')) {
      const r = el.getBoundingClientRect();
      if (r.left < karte.left - 1 || r.right > karte.right + 1) aus.push(`${el.tagName} breiter als die Karte`);
      if (el.tagName.toLowerCase() === 'svg') for (const t of el.querySelectorAll('text')) { const b = t.getBoundingClientRect(); if (b.width && (b.left < r.left - 1 || b.right > r.right + 1 || b.top < r.top - 1 || b.bottom > r.bottom + 1)) aus.push(`„${t.textContent}“ ragt aus dem Bild`); }
    }
    return aus;
  });
  assert.deepEqual(draussen, [], auf.id);
  // Schaubild: Beide Achsennamen stehen im Bild, bei der Aufgabe wie bei der Eingabe.
  for (const g of [auf.bild?.art === 'gitter' && auf.bild, auf.format === 'gitter' && auf.gitter].filter(Boolean)) {
    const texte = await seite.evaluate(() => [...document.querySelectorAll('section.aufgabe svg.gitterbild text')].map((t) => t.textContent));
    for (const n of [g.skala.x.name, g.skala.y.name]) assert.ok(texte.includes(n), `${auf.id}: Achsenname „${n}“ fehlt im Schaubild`);
    schaubilder++;
  }
  const band = await seite.locator('section.aufgabe #heftband').count();
  assert.equal(band, auf.heftaufgabe ? 1 : 0, `${auf.id}: Heftband ${band ? 'zu viel' : 'fehlt'}`);
  if (band) heft++;
  if (auf.format === 'auswahl' && auf.optionen.some((o) => o.bild)) assert.equal(await seite.locator('section.aufgabe form.antwort svg').count(), auf.optionen.length, `${auf.id}: Bildkarten`);
  if (auf.tabelle?.art === 'dreisatz') {
    const felder = (auf.tabelle.pfeile ?? []).flatMap((p) => [p.links, p.rechts]).filter((p) => typeof p === 'object').length;
    assert.equal(await seite.locator('section.aufgabe .dreisatz .rechenpfeil input').count(), felder, `${auf.id}: Felder in den Rechenpfeilen`);
    assert.equal(await seite.locator('section.aufgabe .dreisatz .rechenpfeil').count(), (auf.tabelle.pfeile ?? []).length * 2, `${auf.id}: Rechenpfeile`);
    pfeilfelder += felder;
  }
  if (auf.nachfrage) { assert.equal(await seite.locator('section.aufgabe fieldset.nachfrage input[type=radio]').count(), auf.nachfrage.optionen.length, `${auf.id}: Nachfrage`); nachfragen++; }
  if (bilder && FOTOS[auf.id]) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/${FOTOS[auf.id]}-1200.png` });
  assert.equal(await antworte(auf), true, `${auf.id}: Die richtige Lösung gilt nicht als richtig`);
  const f = auf.format === 'zahl' ? auf.typischeFehler?.[0] : null;
  if (f) { await zeige(auf.id); assert.equal(await antworte(auf, f.wert), false, `${auf.id}: Der typische Fehler ${f.wert} gilt als richtig`); falschGeprueft++; }
  // Punkte mit vertauschten Achsen eintragen: falsch, und die Rückmeldung nennt die Achsen.
  if (auf.format === 'gitter') {
    const { x, y } = auf.gitter.skala, tausch = auf.loesung.map(([px, py]) => [py * y.schritt / x.schritt, px * x.schritt / y.schritt]);
    const frei = new Set((auf.gitter.punkte ?? []).map((p) => `${p.x}|${p.y}`));
    if (tausch.every(([px, py]) => Number.isInteger(px) && Number.isInteger(py) && px <= auf.gitter.b && py <= auf.gitter.h && !frei.has(`${px}|${py}`)) && tausch.some(([px, py], i) => px !== auf.loesung[i][0] || py !== auf.loesung[i][1])) {
      await zeige(auf.id);
      assert.equal(await antworte(auf, tausch), false, `${auf.id}: vertauschte Achsen gelten als richtig`);
      assert.match(await seite.locator('section.aufgabe').innerText(), /Achse nach rechts/, `${auf.id}: Hinweis auf die Achsen fehlt`);
      if (bilder && !vertauscht) await seite.locator('section.aufgabe').screenshot({ path: `${bilder}/achsen-vertauscht-1200.png` });
      vertauscht++;
    }
  }
}
assert.equal(heft, aufgaben.filter((a) => a.heftaufgabe).length);
assert.ok(nachfragen >= 6 && pfeilfelder >= 20, `Nachfragen ${nachfragen}, Felder in Rechenpfeilen ${pfeilfelder}`);
assert.deepEqual(fehler, []);
await browser.close();
console.log(`Klasse 6 Kapitel 7 im Browser bei 1200 Pixel: ${aufgaben.length} Aufgaben gelöst, ${mitBild} mit Bild, ${schaubilder} Schaubilder mit Achsennamen, ${nachfragen} Nachfragen, ${pfeilfelder} Felder in Rechenpfeilen, ${heft} Heftaufgaben mit Heftband, ${vertauscht}-mal vertauschte Achsen und ${falschGeprueft} typische Fehler geprüft.`);
