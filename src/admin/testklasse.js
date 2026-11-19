// Testklasse mit simulierten Schülern im Administrator-Dashboard (ADR 0028).
// Anlegen mit Vorlauf, Simulation starten und anhalten, zurücksetzen, Probe-Kärtchen drucken.
// Die Logik der simulierten Schüler steht in src/gemeinsam/simulation.js; hier geht es um Dateien und Takt.
import { h } from '../schueler/dom.js';
import * as S from '../schueler/speicher.js';
import * as SCH from '../gemeinsam/schule.js';
import * as M from '../gemeinsam/meldungen.js';
import * as L from '../schueler/logik.js';
import * as SIM from '../gemeinsam/simulation.js';
import { erzeugeCode } from '../lehrer/auswertung.js';

const SEK = 1000, MIN = 60000;
const iso = (ms) => new Date(ms).toISOString();
const DAUER_TEXT = { 45: '45 Minuten', 90: '90 Minuten', 0: 'bis ich anhalte' };
// Die laufende Simulation. Es läuft höchstens eine; sie lebt nur, solange das Administrator-Dashboard offen ist.
let lauf = null;
export const laeuft = (klasse) => lauf?.klasse === klasse;

// api: { z, tue, male, ladeKlasse, speichereKlasse, klassenOrdner, speichereVerzeichnis, alleCodes, drucke }
export function testklassenKarte(api) {
  const { z } = api, v = z.v, jahr = z.jahr;
  const tests = Object.keys(v.klassen[jahr] ?? {}).filter((k) => v.klassen[jahr][k].test).sort(SCH.vergleicheKlassen);
  const f = (z.testForm ??= { anzahl: SIM.ANZAHL_STANDARD, vorlauf: 3, zufall: 1000 + Math.floor(Math.random() * 9000), dauer: 90, tempo: 1 });
  const name = h('input', { id: 'test-name', type: 'text', size: 5, maxLength: 3, placeholder: 'z. B. 5t' });
  const lehrkraft = h('select', { id: 'test-lehrkraft' }, h('option', { value: '' }, 'keine'), Object.keys(v.lehrkraefte).sort().map((k) => h('option', { value: k }, k)));
  const zahl = (id, wert, min, max, setze) => h('input', { id, type: 'number', min, max, value: wert, style: 'width:5em', onchange: (ev) => setze(Number(ev.target.value)) });
  const auswahl = (id, wert, liste, setze) => h('select', { id, onchange: (ev) => setze(Number(ev.target.value)) }, liste.map(([w, t]) => h('option', { value: w, selected: wert === w }, t)));
  return h('section', { class: 'karte', id: 'testklassen' }, h('h2', {}, 'Testklassen'),
    h('p', { class: 'klein' }, 'Eine Testklasse ist eine Klasse mit erfundenen Schülern, die nach der echten Spiellogik arbeiten. Die zugeordnete Lehrkraft sieht sie im Lehrer-Dashboard live, mit Ampel, Hilferufen und Lernstand, und kann alles ausprobieren: Hilferufe beantworten, Tore öffnen, Sonderaufträge und Münzgaben schicken. Dazu gibt es drei Probe-Codes, mit denen du selbst als Schüler mitarbeitest. Testklassen zählen nicht in Nutzungsstatistik, Auffällige Aufgaben und Aufgabenmeldungen.'),
    h('p', { class: 'klein' }, 'Die Simulation läuft, solange dieses Fenster offen ist, auch auf demselben PC wie das Lehrer-Dashboard. Bremst der Browser das Fenster im Hintergrund, holen die Schüler die Zeit nach. Ein PC schreibt alle Speicherstände: Das prüft das Lehrer-Dashboard, nicht die Belastung des Schulnetzes durch 25 PCs.'),
    tests.length > 0 && h('ul', { class: 'klassenliste', id: 'testklassen-liste' }, tests.map((k) => testklasseZeile(api, k, f))),
    h('h3', {}, 'Neue Testklasse'),
    h('div', { class: 'reihe' },
      h('label', {}, 'Name ', name), h('label', {}, 'Lehrkraft ', lehrkraft),
      h('label', {}, 'Simulierte Schüler ', zahl('test-anzahl', f.anzahl, SIM.ANZAHL_MIN, SIM.ANZAHL_MAX, (x) => { f.anzahl = x; })),
      h('label', {}, 'Vorlauf ', auswahl('test-vorlauf', f.vorlauf, SIM.VORLAUF_WOCHEN.map((w) => [w, w ? `${w} ${w === 1 ? 'Woche' : 'Wochen'}` : 'keiner']), (x) => { f.vorlauf = x; })),
      h('label', {}, 'Zufallswert ', zahl('test-zufall', f.zufall, 1, 99999, (x) => { f.zufall = x; }))),
    h('div', { class: 'reihe' }, h('button', { class: 'haupt', id: 'test-anlegen', onclick: api.tue(async () => {
      const k = name.value.trim().toLowerCase();
      if (!SCH.istKlasse(k)) throw new Error('Ein Klassenname sieht so aus: 5t.');
      if (v.klassen[jahr]?.[k]) throw new Error(`Die Klasse ${k} gibt es schon.`);
      if (!window.MK_POOLS?.[parseInt(k, 10)]) throw new Error(`Für Klassenstufe ${parseInt(k, 10)} gibt es noch keine Aufgaben.`);
      const n = await legeTestklasseAn(api, k, lehrkraft.value ? [lehrkraft.value] : [], f);
      z.hinweis = `Testklasse ${k} angelegt: ${n.anzahl} simulierte Schüler${n.stunden ? ` mit ${n.stunden} Unterrichtsstunden Vorlauf` : ''} und ${SIM.PROBE_CODES} Probe-Codes. Starte die Simulation, wenn die Lehrkraft die Klasse offen hat.`;
      f.zufall = 1000 + Math.floor(Math.random() * 9000);
    }) }, 'Testklasse anlegen')));
}

function testklasseZeile(api, k, f) {
  const { z } = api;
  const lehr = (z.v.klassen[z.jahr][k].lehrkraefte ?? []).join(', ') || 'keine Lehrkraft';
  const dauer = h('select', { 'data-test-dauer': k, onchange: (ev) => { f.dauer = Number(ev.target.value); } }, SIM.DAUERN.map((d) => h('option', { value: d ?? 0, selected: (f.dauer || 0) === (d ?? 0) }, DAUER_TEXT[d ?? 0])));
  const tempo = h('select', { 'data-test-tempo': k, onchange: (ev) => { f.tempo = Number(ev.target.value); } }, SIM.TEMPI.map((t) => h('option', { value: t, selected: f.tempo === t }, t === 1 ? 'echtes Tempo' : `${t}-fach`)));
  return h('li', { 'data-testklasse': k }, h('b', {}, k), h('span', { class: 'klein' }, lehr),
    laeuft(k)
      ? h('span', {}, h('span', { id: 'sim-status', class: 'klein' }, statusText()), ' ', h('button', { class: 'haupt', id: 'sim-anhalten', onclick: api.tue(async () => { await halteAn(); }) }, 'Anhalten'))
      : h('span', { class: 'reihe' }, dauer, tempo,
        h('button', { class: 'haupt', 'data-sim-start': k, disabled: Boolean(lauf), title: lauf ? `In ${lauf.klasse} läuft schon eine Simulation.` : '', onclick: api.tue(async () => { await starte(api, k, f.dauer || null, f.tempo); }) }, 'Simulation starten')),
    h('button', { class: 'schlicht', 'data-probe': k, onclick: api.tue(async () => druckeProbe(api, k)) }, 'Probe-Kärtchen drucken'),
    h('button', { class: 'schlicht', 'data-zuruecksetzen': k, disabled: laeuft(k), onclick: api.tue(async () => {
      if (!confirm(`Testklasse ${k} zurücksetzen? Die Speicherstände der simulierten Schüler werden gelöscht und mit Vorlauf neu erzeugt. Die Probe-Codes behalten ihren Stand.`)) return;
      const n = await setzeZurueck(api, k);
      z.hinweis = `Testklasse ${k} zurückgesetzt${n ? `, ${n} Unterrichtsstunden Vorlauf neu erzeugt` : ''}.`;
    }) }, 'Zurücksetzen'));
}

// ---------- Anlegen und Zurücksetzen ----------
const poolVon = (api, klasse) => M.ohneGesperrte(window.MK_POOLS[parseInt(klasse, 10)], api.z.v.gesperrt ?? []);
const kapitelMitAufgaben = (pool) => { const mit = new Set(pool.aufgaben.map((a) => L.kapitelVon(a.lernziel))); return pool.kapitel.filter((k) => mit.has(k.id)).map((k) => k.id); };

async function legeTestklasseAn(api, k, lehrkraefte, f) {
  const { z } = api, pool = poolVon(api, k);
  const tore = kapitelMitAufgaben(pool);
  z.v.klassen[z.jahr] ??= {};
  z.v.klassen[z.jahr][k] = { lehrkraefte, test: true };
  const daten = SCH.neueKlassendaten(tore);
  daten.einst.aktuellesKapitel = tore[0] ?? null;
  const vergeben = await api.alleCodes();
  const neu = () => { const c = erzeugeCode(k, vergeben); vergeben.push(c); return c; };
  const profile = {};
  for (const s of SIM.besetzung(f.anzahl)) {
    const c = neu();
    daten.namen[c] = s.name; daten.notizen[c] = SIM.notizFuer(s.profil);
    daten.einst.zielniveaus[c] = SIM.PROFILE[s.profil].ziel;
    profile[c] = s.profil;
  }
  const probe = Array.from({ length: SIM.PROBE_CODES }, (_, i) => { const c = neu(); daten.namen[c] = `Probe ${i + 1}`; return c; });
  daten.test = { zufallswert: f.zufall, vorlauf: f.vorlauf, profile, probe, angelegt: iso(Date.now()) };
  await api.speichereKlasse(k, daten);
  await api.speichereVerzeichnis();
  const stunden = await schreibeVorlauf(api, k, daten);
  return { anzahl: Object.keys(profile).length, stunden };
}

// Neue Speicherstände für alle simulierten Schüler, mit Vorlauf; sie überschreiben vorhandene.
async function schreibeVorlauf(api, k, daten) {
  const pool = poolVon(api, k), index = L.indexiere(pool), jetzt = Date.now();
  const t = daten.test, beginn = iso(jetzt - ((t.vorlauf ?? 0) * 7 + 1) * 86400000);
  const bots = Object.entries(t.profile).map(([code, profil]) => SIM.neuerBot(code, profil, L.neuerSpeicherstand(code, k, beginn), t.zufallswert));
  const klassendatei = SCH.klassendateiInhalt(k, daten, iso(jetzt));
  const stunden = t.vorlauf ? SIM.vorlauf(bots, { pool, index, klassendatei, tempo: 1 }, t.vorlauf, jetzt) : 0;
  const ordner = await api.klassenOrdner(api.z.schueler, k);
  for (const b of bots) await ordner.schreibe(`${b.code}.json`, JSON.stringify(b.stand));
  return stunden;
}
async function setzeZurueck(api, k) {
  const daten = await api.ladeKlasse(k);
  if (!daten?.test) throw new Error(`${k} ist keine Testklasse.`);
  const ordner = await api.klassenOrdner(api.z.schueler, k);
  for (const code of Object.keys(daten.test.profile)) await ordner.entferne(`${code}.json`).catch(() => {});
  return schreibeVorlauf(api, k, daten);
}

async function druckeProbe(api, k) {
  const daten = await api.ladeKlasse(k);
  const codes = daten?.test?.probe ?? [];
  if (!codes.length) throw new Error('Diese Testklasse hat keine Probe-Codes.');
  api.drucke(h('div', { class: 'kaertchen' }, codes.map((c) => h('div', {}, h('small', {}, `Mathekingdom · Testklasse ${k}`), h('b', {}, c), h('small', {}, 'PIN'), h('b', { class: 'pin' }, daten.pins?.[c]?.pin ?? ''), h('span', {}, daten.namen[c])))));
}

// ---------- Simulation ----------
// Ein Worker gibt jede Sekunde den Takt: Seine Nachrichten bremst der Browser im Hintergrund kaum, anders als setInterval.
// Geht das nicht (etwa wegen einer Richtlinie), übernimmt setInterval; die Schüler holen verpasste Zeit dann nach.
function taktgeber(fn) {
  try {
    const url = URL.createObjectURL(new Blob(['setInterval(() => postMessage(0), 1000);'], { type: 'text/javascript' }));
    const w = new Worker(url);
    w.onmessage = fn;
    return { art: 'worker', stopp: () => { w.terminate(); URL.revokeObjectURL(url); } };
  } catch {
    const id = setInterval(fn, 1000);
    return { art: 'uhr', stopp: () => clearInterval(id) };
  }
}

async function starte(api, k, dauerMin, tempo) {
  if (lauf) throw new Error(`In ${lauf.klasse} läuft schon eine Simulation.`);
  const { z } = api;
  const daten = await api.ladeKlasse(k);
  if (!daten?.test) throw new Error(`${k} ist keine Testklasse.`);
  const pool = poolVon(api, k), index = L.indexiere(pool);
  const ordner = await api.klassenOrdner(z.schueler, k);
  const jetzt = Date.now();
  const bots = [];
  for (const [code, profil] of Object.entries(daten.test.profile)) {
    let stand = null;
    try { stand = JSON.parse(await ordner.lies(`${code}.json`)); } catch { /* fehlt */ }
    bots.push(SIM.neuerBot(code, profil, stand ?? L.neuerSpeicherstand(code, k, iso(jetzt)), daten.test.zufallswert));
  }
  SIM.starteStunde(bots, jetzt, dauerMin);
  lauf = { klasse: k, ordner, bots, ctx: { pool, index, klassendatei: null, tempo }, beginn: jetzt, dauerMin, tempo, letzterTakt: jetzt, gelesen: 0, geschrieben: 0, beschaeftigt: false, fehler: null, api };
  await liesKlassendatei();
  lauf.takt = taktgeber(() => { takt().catch((e) => { if (lauf) lauf.fehler = e.message; }); });
  lauf.sichtbar = () => { if (!document.hidden) takt().catch(() => {}); };
  document.addEventListener('visibilitychange', lauf.sichtbar);
  window.addEventListener('beforeunload', warnung);
  await takt();
}
// Schließen hält die Simulation an; der Browser fragt vorher nach.
function warnung(ev) { ev.preventDefault(); ev.returnValue = ''; }
async function liesKlassendatei() {
  const gelesen = await S.ladeKlassendatei(lauf.ordner, null);
  if (gelesen.daten) lauf.ctx.klassendatei = gelesen.daten;
  lauf.gelesen = Date.now();
}
// Ein Takt: Klassendatei alle 10 Sekunden neu lesen, alle Schüler bis jetzt rechnen, Geänderte alle 5 Sekunden schreiben.
async function takt() {
  if (!lauf || lauf.beschaeftigt) return;
  lauf.beschaeftigt = true;
  try {
    const jetzt = Date.now();
    const pause = jetzt - lauf.letzterTakt;
    lauf.letzterTakt = jetzt;
    lauf.gebremst = pause > 5 * SEK ? pause : 0;
    if (jetzt - lauf.gelesen >= 10 * SEK) await liesKlassendatei();
    for (const b of lauf.bots) SIM.schritt(b, lauf.ctx, jetzt);
    if (jetzt - lauf.geschrieben >= 5 * SEK || lauf.bots.every((b) => b.fertig)) await schreibe();
    if (lauf.bots.every((b) => b.fertig)) { await halteAn(); lauf = null; return; }
  } finally {
    if (lauf) lauf.beschaeftigt = false;
  }
  const el = document.getElementById('sim-status');
  if (el) el.textContent = statusText();
}
async function schreibe() {
  for (const b of lauf.bots.filter((x) => x.geaendert)) {
    b.geaendert = false;
    try { await lauf.ordner.schreibe(`${b.code}.json`, JSON.stringify(b.stand)); lauf.fehler = null; }
    catch (e) { b.geaendert = true; lauf.fehler = `Speichern fehlgeschlagen: ${e.message}`; }
  }
  lauf.geschrieben = Date.now();
}
async function halteAn() {
  if (!lauf) return;
  const l = lauf;
  l.takt?.stopp();
  document.removeEventListener('visibilitychange', l.sichtbar);
  window.removeEventListener('beforeunload', warnung);
  // Wer gerade an einer Aufgabe sitzt oder auf Hilfe wartet, hört auf: So bleibt im Lehrer-Dashboard nichts hängen.
  const jetzt = Date.now();
  for (const b of l.bots) if (!b.fertig) { b.ende = jetzt; SIM.schritt(b, l.ctx, jetzt); }
  lauf = { ...l, beschaeftigt: true };
  await schreibe();
  const api = l.api;
  lauf = null;
  api.z.hinweis = `Simulation in ${l.klasse} beendet.`;
  api.male();
}

function statusText() {
  if (!lauf) return '';
  const jetzt = Date.now(), b = lauf.bots;
  const seit = Math.round((jetzt - lauf.beginn) / MIN);
  const rest = lauf.dauerMin ? Math.max(0, Math.round(lauf.dauerMin - (jetzt - lauf.beginn) / MIN)) : null;
  const arbeiten = b.filter((x) => x.stand.aktiv).length, hilfe = b.filter((x) => x.stand.hilferuf).length, fertig = b.filter((x) => x.fertig).length;
  return [`läuft seit ${seit} min${rest != null ? `, noch etwa ${rest} min` : ''}${lauf.tempo > 1 ? `, ${lauf.tempo}-fach` : ''}`,
    `${arbeiten} an einer Aufgabe, ${hilfe} warten auf Hilfe${fertig ? `, ${fertig} fertig` : ''}`,
    `letzter Takt vor ${Math.round((jetzt - lauf.letzterTakt) / SEK)} s${lauf.takt?.art === 'uhr' ? ' (ohne Worker)' : ''}${lauf.gebremst ? `, zuletzt ${Math.round(lauf.gebremst / SEK)} s gebremst und nachgeholt` : ''}`,
    lauf.fehler].filter(Boolean).join(' · ');
}
