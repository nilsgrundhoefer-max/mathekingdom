// Version 0.67 (ADR 0057): Führung im echten Browser bei 1366 × 650. Kapitelende, Vorausarbeiten, Tagessperre,
// Kronen-Angebote, Einstiegscheck und die Signale für die Lehrkraft.
// Aufruf: node tools/baue.mjs && node tests/browser-fuehrung.mjs   (braucht Playwright; BILDER=<Ordner> für Fotos)
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

const leer = (code, klasse = '5a') => ({ ...L.neuerSpeicherstand(code, klasse, vor(200)), toreGesehen: ['5.1'] });
const ok = (extra = {}) => ({ geloest: true, versuche: 1, eingaben: [], fehlvorstellungen: [], hilfen: 0, karten: [], dauer: 30, ...extra });
const lernziele = (kap, ziel = 'M') => pool.kapitel.find((k) => k.id === kap).unterkapitel.filter((u) => !L.istAbstecher(u, ziel)).flatMap((u) => u.lernziele).map((l) => l.id).filter((id) => index.lernzielMitAufgaben.has(id));
// Löst je Lernziel `n` Aufgaben der Stufe, darunter eine mit Anspruch. Der Heftcheck bleibt danach aus.
function loese(stand, ids, niveau, t, ziel = 'M', n = 3) {
  for (const lz of ids) {
    const k = [...index.nach.get(`${lz}|${niveau}`)].sort((a, b) => a.id.localeCompare(b.id));
    for (const a of [...k.slice(0, n - 1), k.find((x, i) => i >= n - 1 && (x.afb ?? 1) >= 2) ?? k[n - 1]]) L.verbuche(stand, a, ok(), ziel, t, index);
  }
  stand.heftSeitCheck = 0;
}
const klassendatei = (x = {}) => ({ aktuellesKapitel: '5.1', tore: ['5.1'], zielniveaus: {}, ...x });
async function schueler(stand, kd) {
  const seite = await browser.newPage({ viewport: GROESSE });
  seite.on('pageerror', (e) => fehler.push(`${stand.code}: ${e.message}`));
  await seite.addInitScript(([s, k]) => { localStorage.setItem(`mk-demo-5a/${s.code}.json`, JSON.stringify(s)); localStorage.setItem('mk-demo-5a/klassendatei.json', JSON.stringify(k)); }, [stand, kd]);
  await seite.goto(new URL('dist/Mathekingdom-ohne-Netz.html', wurzel).href);
  await seite.fill('#code', stand.code);
  await seite.click('#demo');
  await seite.waitForSelector('.regionen');
  return seite;
}
const foto = async (seite, name, ganz = false) => { if (bilder) await seite.screenshot({ path: `${bilder}/${name}.png`, fullPage: ganz }); };
// Löst die angezeigte Aufgabe, wenn sie eine Zahl oder eine Auswahl verlangt. Sonst gibt es false zurück.
async function antworte(seite) {
  const auf = index.aufgabe.get(await seite.getAttribute('section.aufgabe', 'data-aufgabe'));
  if (auf.format === 'zahl') await seite.fill('input[name=zahl]', String(auf.loesung));
  else if (auf.format === 'auswahl') { for (const o of auf.optionen) await seite.locator('label.option', { hasText: o.text }).first().locator('input').setChecked(Boolean(o.richtig)).catch(() => {}); }
  else return false;
  await seite.click('#pruefen');
  await seite.waitForSelector('.ergebnis');
  return true;
}
const imFenster = async (seite, sel) => { const b = await seite.locator(sel).boundingBox(); return b && b.y >= 0 && b.y + b.height <= GROESSE.height; };

// ---------- 1. Die letzte Aufgabe des Kapitels: „Weiter“ führt zu „Kapitel geschafft“, das nächste Tor geht auf ----------
{
  const st = leer('5A-ENDE'), ids = lernziele('5.1');
  loese(st, ids.slice(0, -1), 'M', vor(30)); loese(st, ids.slice(-1), 'M', vor(30), 'M', 2);
  st.einstieg = { '5.1': { uebersprungen: vor(40) } };
  const seite = await schueler(st, klassendatei());
  assert.match(await seite.innerText('#weiter-karte'), /Hier geht es weiter\s+Daten und Diagramme/);
  assert.equal(await seite.locator('.oben-zeile > *').first().getAttribute('id'), 'weiter-karte', '„Hier geht es weiter“ steht oben');
  await seite.click('#weiter-knopf');
  await seite.click('#aufbrechen');
  assert.ok(await antworte(seite), 'die letzte offene Aufgabe lässt sich im Test lösen');
  assert.match(await seite.innerText('.ergebnis'), /Meilenstein „Daten erheben“ gemeistert/);
  assert.equal(await seite.innerText('#weiter'), 'Weiter');
  assert.doesNotMatch(await seite.innerText('.ergebnis'), /ähnliche Aufgabe/);
  await seite.click('#weiter');
  await seite.waitForSelector('#kapitelende.ganz');
  assert.match(await seite.innerText('#kapitelende'), /Kapitel geschafft!/);
  assert.equal(await seite.getAttribute('#kapitelende', 'data-angebot'), 'kapitel');
  assert.match(await seite.innerText('#kapitelende-haupt'), /Weiter mit Tor 2: Natürliche Zahlen/);
  assert.ok(await imFenster(seite, '#kapitelende-haupt'), 'der Hauptknopf ist ohne Scrollen zu sehen');
  await foto(seite, '01-kapitel-geschafft');
  await seite.click('#kapitelende-haupt');
  await seite.waitForSelector('#einstieg');
  assert.match(await seite.innerText('h1'), /Natürliche Zahlen/);
  assert.equal(await seite.locator('#einstieg-ueberspringen').count(), 0, 'das neue Kapitel beginnt mit dem Einstiegscheck');
  await seite.click('.pfad button');
  await seite.waitForSelector('#voraus-marke');
  assert.match(await seite.innerText('#neues-tor'), /Ein neues Tor hat sich geöffnet: Natürliche Zahlen/);
  assert.match(await seite.innerText('[data-kapitel="5.1"]'), /geschafft/);
  await foto(seite, '02-schlossgarten-voraus', true);
  // Im fertigen Kapitel steht die Karte klein über der Regionskarte; alte Aufgaben kommen nur noch, wenn das Kind sie selbst wählt.
  await seite.click('[data-kapitel="5.1"]');
  assert.match(await seite.innerText('#kapitelende'), /Kapitel geschafft!/);
  assert.equal(await seite.innerText('#aufbrechen'), 'Noch eine Runde');
  await seite.close();
}

// ---------- 2. Ohne Vorausarbeiten: höhere Krone, danach „Du bist fertig“ ----------
{
  const st = leer('5A-KRON'); loese(st, lernziele('5.1'), 'M', vor(30));
  const seite = await schueler(st, klassendatei({ vorausarbeiten: false }));
  assert.equal(await seite.locator('#voraus-marke').count(), 0);
  assert.equal(await seite.locator('.region').count(), 1, 'kein zweites Tor');
  assert.equal(await seite.getAttribute('#kapitelende', 'data-angebot'), 'krone');
  assert.match(await seite.innerText('#kapitelende'), /Wenn du magst, hol dir jetzt die Kronen in Purpur\. Das ist freiwillig\./);
  await foto(seite, '03-kapitelende-krone', true);
  await seite.click('#kapitelende-haupt');
  assert.match(await seite.innerText('main .unter'), /Du spielst um Purpur/);
  assert.equal(await seite.locator('#kapitelende').count(), 0, 'wer schon um die höhere Krone spielt, bekommt das Angebot nicht noch einmal');
  assert.equal(await seite.innerText('#aufbrechen'), 'Aufbrechen');
  await seite.close();

  const lea = leer('5A-LEAP'); lea.niveau['5.1'] = 'E'; loese(lea, lernziele('5.1'), 'E', vor(30));
  const s2 = await schueler(lea, klassendatei({ vorausarbeiten: false }));
  assert.equal(await s2.getAttribute('#kapitelende', 'data-angebot'), 'fertig');
  assert.match(await s2.innerText('#kapitelende-fertig'), /Du bist fertig\. Sag deiner Lehrkraft Bescheid\./);
  await s2.close();
}

// ---------- 3. Einstiegscheck: „Aufgabe 8 von 8“ und ein Vorschlag mit Grund ----------
{
  let st, e;
  for (let versuch = 0; ; versuch++) {
    assert.ok(versuch < 200, 'ein Einstiegscheck, dessen letzte Aufgabe der Test lösen kann');
    st = leer('5A-EINS'); e = L.stelleEinstieg(st, index, pool.kapitel[0], vor(1));
    if (['zahl', 'auswahl'].includes(index.aufgabe.get(e.aufgaben.at(-1)).format)) break;
  }
  e.aufgaben.slice(0, -1).forEach((id, i) => L.trageEinstiegEin(st, '5.1', index.aufgabe.get(id), { geloest: i % 3 !== 0, eingaben: [], fehlvorstellungen: [], dauer: 20 }, vor(1)));
  const gold = e.erledigt.filter((x) => x.niveau === 'M'), letzte = index.aufgabe.get(e.aufgaben.at(-1));
  const richtig = gold.filter((x) => x.richtig).length + (letzte.niveau === 'M' ? 1 : 0), gesamt = gold.length + (letzte.niveau === 'M' ? 1 : 0);
  const seite = await schueler(st, klassendatei());
  await seite.click('[data-kapitel="5.1"]');
  await seite.click('#einstieg-start');
  assert.equal(await seite.innerText('.einstiegmarke'), `Einstiegscheck · Aufgabe ${e.aufgaben.length} von ${e.aufgaben.length}`);
  assert.ok(await antworte(seite));
  await seite.waitForSelector('#einstieg-fertig');
  assert.match(await seite.innerText('#einstieg-grund'), new RegExp(`Du hast ${richtig} von ${gesamt} Gold-Aufgaben gelöst\\.`));
  await foto(seite, '04-einstieg-vorschlag');
  // Die im Einstiegscheck gelösten Aufgaben kommen heute nicht noch einmal (Audit L002).
  const geloest = new Set(st.einstieg['5.1'].erledigt.filter((x) => x.richtig).map((x) => x.aufgabe)); geloest.add(letzte.id);
  await seite.click('#einstieg-krone');
  await seite.click('#aufbrechen');
  for (let i = 0; i < 4; i++) {
    const id = await seite.getAttribute('section.aufgabe', 'data-aufgabe');
    assert.ok(!geloest.has(id), `${id} war heute schon im Einstiegscheck gelöst`);
    if (!(await antworte(seite))) break;
    geloest.add(id);
    await seite.click('#weiter');
    await seite.waitForSelector('section.aufgabe, .heftcheck, #wegstueck-ende');
    if (!(await seite.locator('section.aufgabe').count())) break;
  }
  await seite.close();
}

// ---------- 4. Gold-Angebot bei Ziel Silber: zwei gleiche Knöpfe, „Bei Silber bleiben“ zuerst ----------
{
  const st = leer('5A-GOLD'); st.einstieg = { '5.1': { uebersprungen: vor(40) } };
  loese(st, lernziele('5.1', 'G').slice(0, 3), 'G', vor(30), 'G');
  const seite = await schueler(st, klassendatei({ zielniveaus: { '5A-GOLD': 'G' } }));
  await seite.click('#weiter-knopf');
  await seite.click('#aufbrechen');
  for (let i = 0; i < 8 && !(await seite.locator('#krone-wechseln').count()); i++) {
    if (i) await seite.click('#weiter');
    assert.ok(await antworte(seite), 'die Aufgaben auf Silber lassen sich im Test lösen');
  }
  const knoepfe = await seite.locator('.vorschlag button').allInnerTexts();
  assert.deepEqual(knoepfe.map((t) => t.trim()), ['Bei Silber bleiben', 'Um Gold spielen']);
  assert.deepEqual(await seite.locator('.vorschlag button').evaluateAll((l) => l.map((b) => b.className)), ['gleich', 'gleich'], 'keiner ist der Hauptknopf');
  const [a, b] = await seite.locator('.vorschlag button').evaluateAll((l) => l.map((x) => getComputedStyle(x).backgroundColor));
  assert.equal(a, b);
  await foto(seite, '05-gold-angebot');
  await seite.close();
}

// ---------- 5. Eine eigene Purpur-Wahl gilt im neuen Kapitel weiter ----------
{
  const st = leer('5A-PURP'); st.niveau['5.1'] = 'E'; loese(st, lernziele('5.1'), 'E', vor(30)); st.toreGesehen = ['5.1', '5.2'];
  st.einstieg = { '5.2': { uebersprungen: vor(1) } };
  const seite = await schueler(st, klassendatei({ aktuellesKapitel: '5.2', tore: ['5.1', '5.2'] }));
  await seite.click('[data-kapitel="5.2"]');
  assert.match(await seite.innerText('main .unter'), /Du spielst um Purpur/);
  assert.equal(await seite.getAttribute('.kronenwahl [aria-pressed=true]', 'data-krone'), 'E');
  await seite.close();
}

// ---------- 6. Abstecher: Nebenangebot am Kapitelende, „Aufbrechen“ führt nicht von selbst hinein ----------
{
  const st = leer('5A-ABST'); loese(st, lernziele('5.1'), 'M', vor(60)); loese(st, lernziele('5.2'), 'M', vor(30)); st.toreGesehen = ['5.1', '5.2'];
  const seite = await schueler(st, klassendatei({ aktuellesKapitel: '5.2', tore: ['5.1', '5.2'], vorausarbeiten: false }));
  await seite.click('[data-kapitel="5.2"]');
  assert.match(await seite.innerText('#kapitelende [data-abstecher]'), /Abstecher: Römische Zahlzeichen/);
  assert.doesNotMatch(await seite.innerText('.karte.tafel h2'), /Römische Zahlzeichen/, 'der Standort ist ein Pflicht-Meilenstein');
  await foto(seite, '06-kapitelende-abstecher', true);
  await seite.click('#kapitelende [data-abstecher]');
  assert.match(await seite.innerText('.karte.tafel h2'), /Römische Zahlzeichen/);
  await seite.close();
}

// ---------- 7. Tagessperre: heute alles gelöst, die Führung geht weiter, selbst gewählt gibt es 1 Münze ohne Heftcode ----------
{
  const st = leer('5A-TAGS'); st.einstieg = { '5.1': { uebersprungen: vor(40) } };
  const lz = lernziele('5.1')[0];
  for (const a of index.nach.get(`${lz}|M`)) L.verbuche(st, a, ok({ hilfen: 3, karten: ['tipp', 'beispiel', 'loesungsschritt'] }), 'M', vor(0.2), index);
  st.heftSeitCheck = 0;
  const heute = new Set(index.nach.get(`${lz}|M`).map((a) => a.id));
  const seite = await schueler(st, klassendatei());
  await seite.click('#weiter-knopf');
  await seite.click('#aufbrechen');
  assert.ok(!heute.has(await seite.getAttribute('section.aufgabe', 'data-aufgabe')), 'die Führung bringt keine heute gelöste Aufgabe');
  assert.equal(await seite.locator('#heute-geloest').count(), 0);
  await seite.click('#zurueck');
  await seite.locator(`[data-lernziel="${lz}"] button`).click();
  assert.ok(heute.has(await seite.getAttribute('section.aufgabe', 'data-aufgabe')));
  assert.equal(await seite.innerText('#heute-geloest'), 'Hier hast du heute alles gelöst. Morgen zählt es wieder.');
  await foto(seite, '07-heute-alles-geloest', true);
  if (await antworte(seite)) {
    assert.match(await seite.innerText('.ergebnis h2'), /\+1\s+Münze/);
    assert.equal(await seite.locator('#heftcode').count(), 0, 'kein neuer Heftcode');
    assert.equal(await seite.locator('#kanntest-du, #eine-muenze').count(), 1, 'der Grund für die eine Münze steht dabei');
    assert.equal(await seite.innerText('#weiter'), 'Weiter auf dem Lernpfad');
    assert.equal(await seite.innerText('#noch-eine-hier'), 'Noch eine Aufgabe hier');
    await foto(seite, '08-eine-muenze');
  }
  await seite.close();
}

// ---------- 8. Lehrkraft: Einstellung, Sitzplan-Marke und Impuls ----------
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
  // Lea ist fertig und schon im nächsten Kapitel, Tim ist fertig, Mia noch nicht.
  const staende = [lea, tim, mia].map((c) => leer(c));
  loese(staende[0], lernziele('5.1'), 'M', vor(30)); L.stelleEinstieg(staende[0], index, pool.kapitel[1], vor(0.1));
  loese(staende[1], lernziele('5.1'), 'M', vor(30));
  loese(staende[2], lernziele('5.1').slice(0, 2), 'M', vor(30));
  for (const s of staende) s.geaendert = new Date().toISOString();
  await lehrer.evaluate(async (liste) => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    for (const s of liste) { const w = await (await o.getFileHandle(`${s.code}.json`, { create: true })).createWritable(); await w.write(JSON.stringify(s)); await w.close(); }
  }, staende);
  await lehrer.click('[data-tab=jetzt]');
  await lehrer.waitForSelector('[data-kapitelmarke]', { timeout: 20000 });
  const marke = async (code) => ((await lehrer.locator(`[data-schueler="${code}"] [data-kapitelmarke]`).count()) ? lehrer.locator(`[data-schueler="${code}"] [data-kapitelmarke]`).innerText() : null);
  assert.deepEqual([await marke(lea), await marke(tim), await marke(mia)], ['voraus', 'fertig', null]);
  assert.match(await lehrer.innerText('#impuls-kapitel-fertig'), /Kapitel fertig: 2 Kinder sind mit Kapitel 1 fertig \(.*\)\. Sie dürfen in Kapitel 2 vorausarbeiten\./);
  if (bilder) await lehrer.screenshot({ path: `${bilder}/09-lehrkraft-jetzt.png`, fullPage: true });
  // Die Einstellung steht unter Klasse › Unterricht und landet in der Klassendatei.
  await lehrer.click('[data-tab=klasse]');
  if (!(await lehrer.locator('#vorausarbeiten').count())) await lehrer.locator('button', { hasText: /^Unterricht$/ }).first().click();
  assert.equal(await lehrer.isChecked('#vorausarbeiten'), true, 'Standard an');
  if (bilder) await lehrer.locator('#voraus-karte').screenshot({ path: `${bilder}/10-lehrkraft-einstellung.png` });
  await lehrer.uncheck('#vorausarbeiten');
  const liesDatei = () => lehrer.evaluate(async () => {
    const o = await (await navigator.storage.getDirectory()).getDirectoryHandle('5a');
    try { return JSON.parse(JSON.parse(await (await (await o.getFileHandle('klassendatei.json')).getFile()).text()).inhalt); } catch { return null; }
  });
  let inhalt = null;
  for (let i = 0; i < 50 && inhalt?.vorausarbeiten !== false; i++) { await lehrer.waitForTimeout(200); inhalt = await liesDatei(); }
  assert.equal(inhalt?.vorausarbeiten, false);
  await lehrer.click('[data-tab=jetzt]');
  assert.match(await lehrer.innerText('#impuls-kapitel-fertig'), /Vorausarbeiten ist ausgeschaltet/);
  await kontext.close();
}

await browser.close();
server.close();
assert.deepEqual(fehler, [], 'keine Fehler in der Konsole');
console.log('Browsertest Führung bestanden.');
