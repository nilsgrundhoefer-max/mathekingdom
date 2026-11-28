// Schüler-Dashboard: Oberfläche. Die Regeln stehen in logik.js, der Dateizugriff in speicher.js.
import { pruefePin } from '../gemeinsam/krypto.js';
import { versionsHinweis, versionstext, versionsnummer, VERSION_STIL } from '../gemeinsam/version.js';
import * as P from '../gemeinsam/protokoll.js';
import * as M from '../gemeinsam/meldungen.js';
import stil from './stil.css';
import { h, mische } from './dom.js';
import { wortVerzeichnis, findeWoerter } from '../gemeinsam/woerter.js';
import * as L from './logik.js';
import * as S from './speicher.js';
import * as SCH from '../gemeinsam/schule.js';
import { gemerkteOrdner, zugriff, ordnersaetze } from '../gemeinsam/gemerkt.js';
// Zwei Ordnersätze, etwa Schule und zu Hause (Version 0.47, ADR 0040).
const satzSchule = ordnersaetze(gemerkteOrdner('mathekingdom-schueler'), ['schule']);
import { wappenBild, wappenVoll, regionMap, muenze, siegel, gabeSiegel, kroneBild, gartentor, schlossBild, turmZeichen, wuerfelZeichen, zahlenstrahl, saeulendiagramm, hoftitelBild } from './bilder.js';
import { aufgabenBild } from './aufgabenbilder.js';
import { kartenBild } from './koerperbilder.js';
import { streifenFaerbenEingabe, streifenFaerbenLoesungBild, streifenFaerbenLoesung } from './datenbilder6.js';
import { strichlisteEingabe, zeichnenEingabe, zeichnenLoesung, urlisteBild, datenTabelle, striche, buendle } from './datenbilder.js';
import { ordnenEingabe, liesOrdnung, zeichenEingabe, gliedereEingabe, gliedere, tafelBild, mitVorzeichen, abKlasse7, vorzeichenKnopf } from './zahlenbilder.js';
import { gitterEingabe, gitterLoesungBild } from './geobilder.js';
import { werteTabelle, dreisatzTabelle } from './zuordnungsbilder.js';
import { gitterLoesung } from './geo.js';
import { winkelEingabe, winkelLoesungBild } from './winkelbilder.js';
import { winkelLoesung } from './winkel.js';
import { groesseEingabe, liesGroesse, einheitentafelBild } from './groessenbilder.js';
import { loesungGroesse } from './groessen.js';
import { bruchEingabe, liesBruch, faerbenEingabe, faerbenLoesungBild } from './bruchbilder.js';
import { NACHBESSERN, NACHBESSERN_HOECHSTENS } from './bruch.js';
import { faerbenLoesung, bruchLoesung } from './bruch.js';
import { periodeEingabe, liesPeriode, divisionBild } from './dezimalbilder.js';
import { klinge } from './ton.js';
import { starteSpiel } from './spiele.js';

const jetzt = () => new Date().toISOString();
const z = { // Zustand der laufenden Sitzung
  ablage: null, stand: null, pool: null, index: null, klassendatei: null, einst: null, dienst: null,
  ansicht: { name: 'anmeldung' }, speicherstatus: null, meldung: null, wartePlatz: null,
};
let wurzel;

// ---------- Rahmen ----------
function zeige(ansicht) {
  // Wer ein laufendes Belohnungsspiel verlässt, beendet die Runde.
  if (z.ansicht.name === 'minispiel' && ansicht.name !== 'minispiel') { spielStopp?.(); spielStopp = null; clearInterval(spieluhr); }
  if (z.meldungHier) { z.meldung = null; z.meldungHier = false; }
  z.ansicht = { ...ansicht, seit: Date.now() };
  if (z.hilfeErledigtWartet && ansicht.name !== 'minispiel') meldeErledigt(); // Version 0.68: erst nach dem Spiel
  if (ansicht.name !== 'aufgabe' && z.stand?.aktiv) {
    // Aufgabe ohne Ergebnis verlassen: für das Aufgaben-Audit der Lehrkraft festhalten.
    const a = z.stand.aktiv;
    (z.stand.abbrueche ??= []).push({ t: jetzt(), aufgabe: a.aufgabe, fehlversuche: a.fehlversuche ?? 0, hilfen: a.hilfen ?? 0, ...(z.stand.dashboardVersion && { version: z.stand.dashboardVersion }) });
    z.stand.aktiv = null; z.dienst.markiere();
  }
  male();
}
function geaendert() { z.dienst?.markiere(); }
// Betriebsprotokoll im Speicherstand: nur Starts und technische Probleme, nie Lerndaten (ADR 0013).
function notiere(art, text) {
  P.trage((z.stand.betrieb ??= []), { t: jetzt(), art, text }, P.MAX_SCHUELER);
  geaendert();
}
// Ein zweites Fenster desselben Schülers erkennen (Version 0.54): Wer angemeldet ist, hält eine Sperre mit seinem Code,
// solange das Fenster offen ist. Ein zweites Fenster bekommt sie nicht und sagt dem ersten Bescheid, damit es im Protokoll steht.
async function sichereFenster(code) {
  if (!navigator.locks?.request) return 'ohne';
  const kanalName = `mathekingdom-${code}`;
  const ergebnis = await new Promise((fertig) => {
    navigator.locks.request(kanalName, { ifAvailable: true }, (sperre) => {
      if (!sperre) { fertig('besetzt'); return null; }
      fertig('meins');
      return new Promise(() => {}); // bis das Fenster zugeht
    }).catch(() => fertig('ohne'));
  });
  if (typeof BroadcastChannel !== 'function') return ergebnis;
  try {
    const kanal = new BroadcastChannel(kanalName);
    if (ergebnis === 'besetzt') { kanal.postMessage({ zweitesFenster: true }); kanal.close(); }
    else kanal.onmessage = (e) => { if (e.data?.zweitesFenster && z.stand) notiere('problem', 'Ein zweites Fenster mit diesem Code wurde geöffnet und dort gesperrt'); };
  } catch { /* nur für das Protokoll */ }
  return ergebnis;
}
// Programmfehler ins Betriebsprotokoll (Version 0.54): höchstens 5 je Sitzung, jeder nur einmal.
const gemeldeteFehler = new Set();
function meldeProgrammfehler(meldung, stelle) {
  if (!z.stand || z.ablage?.demo || gemeldeteFehler.size >= 5) return;
  const text = P.programmfehlerText(meldung, z.ansicht?.name, stelle);
  if (gemeldeteFehler.has(text)) return;
  gemeldeteFehler.add(text);
  notiere('problem', text);
}
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => meldeProgrammfehler(e.message, e.filename ? `${e.filename.split('/').at(-1)}:${e.lineno}` : ''));
  window.addEventListener('unhandledrejection', (e) => meldeProgrammfehler(e.reason?.message ?? String(e.reason), ''));
}
// Ein Speicherfehler wird nur beim Wechsel notiert, nicht bei jedem neuen Versuch alle 10 Sekunden.
function speicherMeldung(status) {
  const vorher = z.speicherstatus;
  z.speicherstatus = status;
  if (!status.ok && vorher?.ok !== false) notiere('problem', `Speichern im Klassenordner fehlgeschlagen: ${status.fehler?.name ?? ''} ${status.fehler?.message ?? ''}`.trim());
  if (status.ok && vorher?.ok === false) notiere('ok', 'Speichern im Klassenordner klappt wieder');
  maleStatus();
}
// Fokus-Modus (ADR 0016): In Aufgabe, Heftcheck und Wegstück-Abschluss bleibt nur das Nötige sichtbar.
const FOKUS = new Set(['aufgabe', 'heftcheck', 'wegstueck']);
const imFokus = () => Boolean(z.stand) && FOKUS.has(z.ansicht.name);
function male() {
  const ansichten = { anmeldung, schlossgarten, region: regionsAnsicht, kapitelende: kapitelendeAnsicht, aufgabe: aufgabenAnsicht, heftcheck: heftcheckAnsicht, wegstueck: wegstueckAnsicht, feedback: feedbackAnsicht, wappen: wappenAnsicht, koennen: koennenAnsicht, spiele: spieleAnsicht, minispiel };
  const fokus = imFokus();
  wurzel.classList.toggle('fokus', fokus);
  // Neu verdiente Ehrenzeichen (ADR 0018) zeigt das Zeichen am Knopf „Wappen“ an. Nicht mitten in einer Aufgabe prüfen.
  if (z.stand && z.index && !fokus && L.vergebeEhrenzeichen(z.stand, z.pool, z.index, z.einst?.zielniveau).length) geaendert();
  wurzel.replaceChildren(...[
    z.stand && (fokus ? fokusKopf() : kopf()),
    z.stand && hilfeBanner(),
    z.stand && nachrichtBanner(),
    z.stand && gabeBanner(),
    z.stand && briefBanner(),
    z.meldung && h('div', { class: 'meldung', role: 'status' }, z.meldung, h('button', { class: 'schlicht', onclick: () => { z.meldung = null; male(); } }, 'Schließen')),
    h('main', {}, ansichten[z.ansicht.name]()),
    // Version 0.66 (Audit L049): Der Versionshinweis steht nur noch bei der Anmeldung und im Schlossgarten, dort am Seitenende.
    ['anmeldung', 'schlossgarten'].includes(z.ansicht.name) && versionsHinweis('schueler'),
    z.stand && z.ansicht.name === 'schlossgarten' && speicherHinweis(),
  ].filter(Boolean));
  fokussiere();
}

// Arbeiten ohne Maus: Das erste leere Eingabefeld hat den Fokus, nach dem Ergebnis der Knopf zum Weitergehen.
function fokussiere() {
  const n = z.ansicht.name;
  let ziel = null;
  if (n === 'aufgabe' && !z.ansicht.ergebnis) {
    const felder = [...wurzel.querySelectorAll('form.antwort input:not([type=hidden]):not(:disabled), form.antwort select:not(:disabled), form.antwort .bildrahmen [tabindex="0"]')];
    ziel = felder.find((f) => 'value' in f && f.type !== 'radio' && f.type !== 'checkbox' && f.value === '') ?? felder[0];
  } else if (FOKUS.has(n)) ziel = wurzel.querySelector('main .haupt:not(:disabled)');
  if (ziel) setTimeout(() => { if (ziel.isConnected) ziel.focus({ preventScroll: n !== 'aufgabe' }); });
}
// Per Tastatur reagiert ein Knopf nach dem Ergebnis erst nach einem kurzen Moment. Sonst überspringt ein doppeltes Enter
// die Lösung. Ein Mausklick (detail ≥ 1) gilt sofort.
const BEDENKZEIT_MS = 600;
const bereit = (tun) => (ev) => { if (ev?.detail === 0 && Date.now() - (z.ansicht.seit ?? 0) < BEDENKZEIT_MS) return; tun(); };
// Enter ohne Fokus (etwa nach einem Klick ins Leere) drückt den Hauptknopf nach dem Ergebnis.
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || !wurzel || (document.activeElement && document.activeElement !== document.body)) return;
    const fertig = (z.ansicht.name === 'aufgabe' && z.ansicht.ergebnis) || ['wegstueck', 'heftcheck'].includes(z.ansicht.name);
    if (fertig) wurzel.querySelector('main .haupt:not(:disabled)')?.click();
  });
}

// Schmale Kopfzeile im Fokus-Modus: Wappen als Weg zurück, das laufende Wegstück und eine Speicherwarnung nur im Fehlerfall.
function zurueckVon(a) {
  if (a.name === 'aufgabe' && !a.rueckblick && !a.sonderauftrag) {
    if (a.einstieg) return { text: 'Regionskarte', tun: () => zeige({ name: 'region', kapitel: a.einstieg }) };
    const ms = meilensteinVon(a.aufgabe);
    return { text: ms.titel, tun: () => zeige({ name: 'region', kapitel: L.kapitelVon(a.aufgabe.lernziel), milestone: ms.id }) };
  }
  if (a.kapitel) return { text: 'Regionskarte', tun: () => zeige({ name: 'region', kapitel: a.kapitel }) };
  return { text: 'Schlossgarten', tun: () => zeige({ name: 'schlossgarten' }) };
}
function fokusKopf() {
  const zurueck = zurueckVon(z.ansicht), status = z.speicherstatus;
  return h('header', { class: 'kopf fokus' },
    h('button', { class: 'wappenknopf zurueck', id: 'zurueck', title: `Zurück: ${zurueck.text}`, onclick: zurueck.tun }, wappenBild(z.stand.wappen, 30), h('span', {}, `← ${zurueck.text}`)),
    wegstueckAnzeige(),
    h('div', { class: 'speicher fehler', id: 'speicherstatus', role: 'status' }, status && !status.ok ? 'Speichern fehlgeschlagen. Sag deiner Lehrkraft Bescheid.' : ''));
}
// „Aufgabe 3 von 5“ mit fünf Punkten: grün gelöst, hell nicht gelöst, umrandet die laufende Aufgabe.
function wegstueckAnzeige() {
  const a = z.ansicht;
  if (a.name !== 'aufgabe' || !zaehltFuerWegstueck(a)) return null;
  const fertig = a.ergebnis?.wegstueck;
  const punkte = fertig?.punkte ?? (z.stand.wegstueck?.aufgaben ?? []).map((x) => x.richtig);
  const nummer = fertig ? fertig.nummer : punkte.length + 1;
  return h('div', { class: 'wegstueck-anzeige', id: 'wegstueck', 'aria-label': `Wegstück: Aufgabe ${nummer} von ${L.WEGSTUECK_AUFGABEN}` },
    h('span', {}, `Aufgabe ${nummer} von ${L.WEGSTUECK_AUFGABEN}`),
    h('span', { class: 'wegpunkte' }, Array.from({ length: L.WEGSTUECK_AUFGABEN }, (_, i) => h('i', { class: i < punkte.length
      ? `${punkte[i] ? 'voll' : 'daneben'}${fertig && i === punkte.length - 1 ? ' neu' : ''}` : !fertig && i === punkte.length ? 'jetzt' : '' }))));
}
// Rückblick, Einstiegscheck und Heftcheck sind eigene Päckchen und zählen nicht zum Wegstück (ADR 0016).
const zaehltFuerWegstueck = (a) => !a.rueckblick && !a.einstieg && !a.heftNachloesen;

function kopf() {
  const anzahl = L.siegel(z.stand), r = L.rang(L.rangSiegel(z.stand), L.titelform(z.stand));
  const status = z.speicherstatus;
  // Siegel und Karte stehen vorn, die Münzen dahinter als kleinstes Symbol (ADR 0010). Seit 0.37 sind alle Symbole etwa ein Viertel größer.
  return h('header', { class: 'kopf' },
    h('button', { class: `wappenknopf${z.ansicht.name === 'wappen' ? ' aktiv' : ''}`, id: 'wappen-knopf', title: 'Zu deinem Wappen', 'aria-label': 'Zu deinem Wappen', onclick: () => zeige({ name: 'wappen' }) },
      wappenBild(z.stand.wappen, 48), neuesBeimWappen()),
    h('div', { class: 'wer' },
      h('strong', {}, `${r.name} ${z.stand.code}`, hoftitelKopf())),
    h('div', { class: 'konto' },
      h('button', { class: `wert siegelwert${z.ansicht.name === 'koennen' ? ' aktiv' : ''}`, id: 'siegel-knopf', title: `${anzahl} Siegel. Klick: Das kannst du schon`, 'aria-label': `${anzahl} Siegel. Das kannst du schon`, onclick: () => zeige({ name: 'koennen' }) }, siegel(30), h('b', { id: 'siegel' }, anzahl)),
      kronenZaehler(),
      h('span', { class: 'wert muenzwert', title: 'Münzen zum Ausgeben' }, muenze(22), h('b', { id: 'muenzen' }, z.stand.muenzen))),
    h('nav', {},
      h('button', { class: ['schlossgarten', 'region'].includes(z.ansicht.name) ? 'aktiv' : '', id: 'nav-schlossgarten', onclick: () => zeige({ name: 'schlossgarten' }) }, turmZeichen(20), 'Schlossgarten'),
      h('button', { class: ['spiele', 'minispiel'].includes(z.ansicht.name) ? 'aktiv' : '', id: 'nav-spiele', onclick: () => zeige({ name: 'spiele' }) }, wuerfelZeichen(20), 'Spiele')),
    // Seit 0.35 zeigt die Kopfzeile nur noch Speicherfehler. „Gespeichert um …“ steht klein unten links im Schlossgarten.
    h('div', { class: 'speicher fehler', id: 'speicherstatus', role: 'status' }, status && !status.ok ? 'Speichern fehlgeschlagen. Sag deiner Lehrkraft Bescheid.' : ''));
}
// Klein unten links, wo in einer Aufgabe die Kennung steht, und nur auf der Startseite Schlossgarten.
function speicherHinweis() {
  const status = z.speicherstatus;
  return h('p', { class: 'speicherhinweis', id: 'speicherhinweis' },
    !status ? 'Noch nichts zu speichern'
      : status.ok ? `Gespeichert um ${status.um.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : '',
    z.ablage.demo && h('span', { class: 'demo' }, `${status && !status.ok ? '' : ' · '}Demo: nur in diesem Browser`));
}

// Neue Aha-Momente und Ehrenzeichen als goldene Marke an der Ecke des Wappens (seit 0.34 gibt es keinen Knopf „Wappen“ mehr).
function neuesBeimWappen() {
  const n = z.ansicht.name === 'wappen' ? 0 : L.ahaMomente(z.stand).filter((a) => a.neu).length + (z.stand.neueEhre?.length ?? 0);
  return n > 0 && h('span', { class: 'aha-neu', id: 'aha-neu', title: `${n} Neues beim Wappen` }, `✦ ${n}`);
}

// Kronen je Farbe: Bronze, Silber, Gold, Purpur (ADR 0012).
function kronenZaehler() {
  const alle = Object.values(L.kronen(z.pool, z.index, z.stand));
  const je = Object.fromEntries(L.NIVEAUS.map((n) => [n, alle.filter((k) => k === n).length]));
  return h('span', { class: 'wert kronenwert', id: 'kronen', title: `Kronen: ${L.NIVEAUS.map((n) => `${je[n]} ${L.KRONEN[n]}`).join(', ')}` },
    L.NIVEAUS.map((n) => h('span', { class: `je${je[n] ? '' : ' null'}`, 'data-krone': n }, kroneBild(n, 26), h('b', {}, je[n]))));
}

function nachrichtBanner() {
  const n = z.einst.nachricht;
  if (!n || z.stand.gelesen === n.t) return null;
  return h('div', { class: 'hilfebanner nachricht', role: 'status' }, h('span', {}, h('b', {}, 'Nachricht von deiner Lehrkraft: '), n.text),
    h('button', { class: 'schlicht', id: 'nachricht-ok', onclick: (e) => { z.stand.gelesen = n.t; geaendert(); z.dienst.sofort(); e.target.closest('.hilfebanner').remove(); } }, 'Verstanden'));
}
// ---------- Sonderauftrag (ADR 0021) ----------
// Ein Brief des Königs: nie mitten in einer Aufgabe, beim ersten Mal groß, danach klein oben, bis der Auftrag erledigt ist.
const offenerAuftrag = () => L.offenerSonderauftrag(z.stand, z.einst.sonderauftrag);
function briefErlaubt() {
  const a = z.ansicht;
  if (['anmeldung', 'minispiel', 'heftcheck'].includes(a.name)) return false;
  return a.name !== 'aufgabe' || (Boolean(a.ergebnis) && !a.sonderauftrag);
}
function briefBanner() {
  const sa = offenerAuftrag();
  if (!sa || !briefErlaubt()) return null;
  const oeffnen = () => {
    const zurueck = rueckkehrPunkt(), a = z.ansicht;
    const los = () => starteSonderauftrag(zurueck);
    if (a.name === 'aufgabe') danach(a, los)(); else los();
  };
  const knopf = h('button', { class: 'haupt', id: 'brief-oeffnen', onclick: oeffnen }, sa.geoeffnet ? 'Weitermachen' : 'Öffnen');
  if (sa.geoeffnet || z.briefSpaeter?.has(sa.id)) {
    return h('div', { class: 'hilfebanner brief-klein', id: 'brief-klein', role: 'status' },
      h('span', { class: 'briefzeichen', 'aria-hidden': 'true' }, '✉'),
      h('span', {}, h('b', {}, 'Sonderauftrag: '), `noch ${sa.offen} von ${sa.gesamt} ${sa.gesamt === 1 ? 'Aufgabe' : 'Aufgaben'}, danach ${sa.belohnung} Münzen.`), knopf);
  }
  const einflug = z.briefGezeigt !== sa.id;
  z.briefGezeigt = sa.id;
  return h('div', { class: `brief${einflug ? ' einflug' : ''}`, id: 'brief', role: 'status' },
    h('div', { class: 'briefsiegel' }, siegel(44)),
    h('div', { class: 'brieftext' },
      h('span', { class: 'klein' }, 'Ein Brief des Königs'),
      h('h2', {}, 'Ein Sonderauftrag für dich'),
      h('p', {}, `${sa.gesamt} Aufgaben zu „${lernzielText(sa.lernziel)}“. Wenn du alle bearbeitet hast, bekommst du die Belohnung dazu, egal wie viele richtig sind.`),
      h('p', { class: 'briefbelohnung', id: 'brief-belohnung' }, h('b', {}, 'Belohnung: '), muenze(16), ` ${sa.belohnung} Münzen`),
      sa.satz && h('p', { class: 'briefsatz' }, h('b', {}, 'Deine Lehrkraft schreibt: '), `„${sa.satz}“`),
      h('div', { class: 'knoepfe' }, knopf,
        h('button', { class: 'schlicht', id: 'brief-spaeter', onclick: () => { (z.briefSpaeter ??= new Set()).add(sa.id); male(); } }, 'Später'))));
}
// ---------- Münzgabe (ADR 0027) ----------
// Eine Gabe des Königs: Brief mit goldenem Siegel, ohne Absender, nie mitten in einer Aufgabe. Gutgeschrieben wird beim Öffnen.
function gabeBanner() {
  if (z.gabeOffen) {
    const g = z.gabeOffen;
    return h('div', { class: 'brief gabe geoeffnet', id: 'gabe-geoeffnet', role: 'status' },
      h('div', { class: 'briefsiegel' }, gabeSiegel(44)),
      h('div', { class: 'brieftext' },
        h('span', { class: 'klein' }, 'Eine Gabe des Königs'),
        h('h2', { class: 'gabe-betrag' }, h('span', { class: 'muenzregen', 'aria-hidden': 'true' }, muenze(20), muenze(16), muenze(22)), `+${g.muenzen} Münzen`),
        g.satz && h('p', { class: 'briefsatz' }, `„${g.satz}“`),
        h('div', { class: 'knoepfe' }, h('button', { class: 'haupt', id: 'gabe-ok', onclick: () => { z.gabeOffen = null; male(); } }, 'Danke'))));
  }
  const offen = L.offeneMuenzgaben(z.stand, z.einst.muenzgaben);
  if (offen.length === 0 || !briefErlaubt()) return null;
  const g = offen[0];
  const oeffnen = () => {
    const muenzen = L.oeffneMuenzgabe(z.stand, g, jetzt());
    if (muenzen) { geaendert(); z.dienst.sofort(); }
    z.gabeOffen = muenzen ? g : null;
    male();
  };
  const knopf = h('button', { class: 'haupt', id: 'gabe-oeffnen', onclick: oeffnen }, 'Öffnen');
  const mehr = offen.length > 1 ? ` (${offen.length} Briefe)` : '';
  if (z.gabeSpaeter?.has(g.id)) {
    return h('div', { class: 'hilfebanner brief-klein gabe-klein', id: 'gabe-klein', role: 'status' },
      h('span', { class: 'briefzeichen', 'aria-hidden': 'true' }, '✉'),
      h('span', {}, h('b', {}, 'Eine Gabe des Königs'), ` wartet auf dich${mehr}.`), knopf);
  }
  const einflug = z.gabeGezeigt !== g.id;
  z.gabeGezeigt = g.id;
  return h('div', { class: `brief gabe${einflug ? ' einflug' : ''}`, id: 'gabe', role: 'status' },
    h('div', { class: 'briefsiegel' }, gabeSiegel(44)),
    h('div', { class: 'brieftext' },
      h('span', { class: 'klein' }, `Eine Gabe des Königs${mehr}`),
      h('h2', {}, 'Der König schickt dir etwas'),
      h('p', {}, 'Ein versiegelter Beutel ist angekommen. Öffne ihn!'),
      h('div', { class: 'knoepfe' }, knopf,
        h('button', { class: 'schlicht', id: 'gabe-spaeter', onclick: () => { (z.gabeSpaeter ??= new Set()).add(g.id); male(); } }, 'Später'))));
}
// Wohin es nach dem Sonderauftrag zurückgeht: an das Lernziel, an dem der Schüler gerade war, sonst auf seine Karte.
function rueckkehrPunkt() {
  const a = z.ansicht;
  if (a.name === 'aufgabe') {
    if (a.seitenblick) return { lernziel: a.seitenblick.zurueck };
    if (a.einstieg) return { kapitel: a.einstieg };
    if (!a.rueckblick && !a.bruecke && !a.heftNachloesen) return { lernziel: a.aufgabe.lernziel };
    return null;
  }
  if (a.name === 'region') return { kapitel: a.kapitel, ...(a.milestone && { milestone: a.milestone }) };
  if (a.name === 'wegstueck' && a.kapitel) return { kapitel: a.kapitel };
  return null;
}
function kehreZurueck(r) {
  if (r?.lernziel && z.index.lernziel.has(r.lernziel)) {
    const kap = L.kapitelVon(r.lernziel), n = L.arbeitsniveau(z.stand, kap, z.einst.zielniveau), ms = z.index.meilensteinVon.get(r.lernziel);
    const lz = ms && L.lernzielErledigt(z.index, z.stand, r.lernziel, n, z.einst.zielniveau) ? L.naechstesLernziel(z.index, z.stand, ms, n, z.einst.zielniveau)?.id ?? r.lernziel : r.lernziel;
    z.ansicht = { name: 'region', kapitel: kap, ...(ms && { milestone: ms.id }) };
    return starteAufgabe(lz, L.arbeitsniveau(z.stand, kap, z.einst.zielniveau, lz));
  }
  if (r?.kapitel) return zeige({ name: 'region', kapitel: r.kapitel, ...(r.milestone && { milestone: r.milestone }) });
  zeige({ name: 'schlossgarten' });
}
function starteSonderauftrag(zurueck = null) {
  const auftrag = z.einst.sonderauftrag;
  if (!auftrag || !L.oeffneSonderauftrag(z.stand, auftrag, zurueck, jetzt())) return zeige({ name: 'schlossgarten' });
  geaendert(); z.dienst.sofort();
  let id = L.naechsteSonderauftragAufgabe(z.stand, auftrag);
  // Fehlt eine Aufgabe im Pool (neue Version), wird sie übersprungen.
  while (id && !z.index.aufgabe.has(id)) {
    const r = L.trageSonderauftragEin(z.stand, auftrag, { id }, false, jetzt());
    if (r?.fertig) return kehreZurueck(r.zurueck);
    id = L.naechsteSonderauftragAufgabe(z.stand, auftrag);
  }
  if (!id) return zeige({ name: 'schlossgarten' });
  zeigeAufgabe(z.index.aufgabe.get(id), { sonderauftrag: auftrag.id });
}
function sonderauftragNummer(a, fertig) {
  const sa = offenerAuftrag();
  if (sa?.geoeffnet) return `Sonderauftrag ${Math.min(sa.gesamt, sa.erledigt + (fertig ? 0 : 1))} von ${sa.gesamt}`;
  const g = a.ergebnis?.sonderauftrag?.gesamt;
  return g ? `Sonderauftrag ${g} von ${g}` : 'Sonderauftrag';
}
function sonderauftragErgebnis(a) {
  const e = a.ergebnis, auf = a.aufgabe, r = e.sonderauftrag;
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, 'Schau sie dir in Ruhe an.'),
    heftHinweis(e),
    !e.richtig && soGehtEs(auf),
    e.neuesLernziel && h('div', { class: 'moment', id: 'neues-siegel' }, siegel(48), h('div', {}, h('b', {}, 'Lernziel erreicht!'), h('p', {}, 'Du bekommst ein Siegel.'))),
    r?.fertig && h('div', { class: 'moment', id: 'sonderauftrag-fertig' }, siegel(48),
      h('div', {}, h('b', {}, 'Sonderauftrag erfüllt!'), h('p', {}, `${r.richtig} von ${r.gesamt} richtig. Der König schickt dir `, muenze(18), h('b', {}, ` ${r.bonus} Münzen`), '.'))),
    !r ? h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => zeige({ name: 'schlossgarten' })) }, 'Zum Schlossgarten')
      : r.fertig ? h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => kehreZurueck(r.zurueck)) }, 'Zurück auf deinen Weg')
        : h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => starteSonderauftrag()) }, 'Nächste Aufgabe im Sonderauftrag'));
}

// Version 0.68 (ADR 0057): Die Meldung „erledigt“ bleibt 20 Sekunden stehen. Läuft gerade ein Belohnungsspiel, kommt sie erst danach.
function meldeErledigt() {
  if (z.ansicht.name === 'minispiel') { z.hilfeErledigtWartet = true; return; }
  z.hilfeErledigtWartet = false;
  z.hilfeErledigt = true;
  setTimeout(() => { z.hilfeErledigt = false; wurzel.querySelector('.hilfebanner.erledigt')?.remove(); }, 20000);
}
const uhrzeit = (t) => new Date(t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
function hilfeBanner() {
  if (!z.stand.hilferuf) {
    // Ein Hilferuf von gestern ist abgelaufen: Das Kind wird einmal gefragt, ob es noch Hilfe braucht.
    const alt = z.stand.hilferufAbgelaufen;
    if (alt && z.ansicht.name !== 'minispiel') {
      const antworte = (ja) => { L.beantworteAbgelaufen(z.stand, ja, jetzt(), z.ansicht.name === 'aufgabe' ? z.ansicht.aufgabe?.id : null); z.wartePlatz = null; geaendert(); z.dienst.sofort(); if (z.ansicht.name === 'aufgabe' && !z.ansicht.ergebnis) maleMitEntwurf(liesEingabe(z.ansicht.aufgabe, wurzel.querySelector('form.antwort')).eingabe); else male(); if (ja) takt(); };
      return h('div', { class: 'hilfebanner abgelaufen', id: 'hilferuf-abgelaufen', role: 'status' },
        h('span', {}, `Dein Hilferuf vom ${new Date(alt.seit).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' })} ist abgelaufen. Brauchst du noch Hilfe?`),
        h('button', { class: 'schlicht', id: 'abgelaufen-ja', onclick: () => antworte(true) }, 'Ja, ich brauche Hilfe'),
        h('button', { class: 'schlicht', id: 'abgelaufen-nein', onclick: () => antworte(false) }, 'Nein, danke'));
    }
    return z.hilfeErledigt ? h('div', { class: 'hilfebanner erledigt', role: 'status' }, h('span', {}, 'Deine Lehrkraft hat deinen Hilferuf als erledigt abgehakt.')) : null;
  }
  const antwort = z.einst.hilfeAntwort;
  const kommt = antwort?.zu === z.stand.hilferuf.seit && antwort.status === 'unterwegs';
  return h('div', { class: 'hilfebanner', role: 'status' },
    h('span', {}, kommt ? 'Deine Lehrkraft kommt gleich zu dir.'
      : `Du wartest seit ${uhrzeit(z.stand.hilferuf.seit)} Uhr auf Hilfe${z.wartePlatz ? ` und bist auf Platz ${z.wartePlatz} der Warteschlange` : ''}. Arbeite ruhig weiter.`),
    h('button', { class: 'schlicht', onclick: () => { L.beendeHilferuf(z.stand, 'zurueckgezogen', jetzt()); geaendert(); male(); } }, 'Hilferuf zurückziehen'));
}

// ---------- Anmeldung ----------
function anmeldung() {
  const a = z.ansicht;
  const eingabe = h('input', { id: 'code', type: 'text', autocomplete: 'off', spellcheck: false, placeholder: 'z. B. 5A-K4M2', value: a.code ?? '', maxLength: 9,
    onkeydown: (e) => { if (e.key === 'Enter') pinFeld.focus(); } });
  const pinFeld = h('input', { id: 'pin', type: 'password', inputMode: 'numeric', autocomplete: 'off', placeholder: '4 Ziffern', maxLength: 4,
    onkeydown: (e) => { if (e.key === 'Enter') starte(false); } });
  // Nur eine Anmeldung zur Zeit (Version 0.54): Ein Doppelklick oder Enter und Klick startete sonst zwei Sitzungen,
  // die gleichzeitig in dieselbe Datei schrieben (InvalidStateError im Betriebsprotokoll vom 25.11.2026).
  const starte = async (demo, anderer = false) => {
    if (z.anmeldungLaeuft || z.stand) return;
    z.anmeldungLaeuft = true;
    for (const k of document.querySelectorAll('section.anmeldung button')) k.disabled = true;
    try { await starteEinmal(demo, anderer); } finally {
      z.anmeldungLaeuft = false;
      for (const k of document.querySelectorAll('section.anmeldung button')) k.disabled = false;
    }
  };
  const starteEinmal = async (demo, anderer) => {
    const gelesen = L.leseCode(eingabe.value);
    if (!gelesen) return zeige({ name: 'anmeldung', code: eingabe.value, fehler: 'Diesen Schülercode gibt es nicht. Er sieht so aus: 5A-K4M2.' });
    const fehler = (text) => zeige({ name: 'anmeldung', code: eingabe.value, fehler: text });
    try {
      if (demo) return await melde({ ...gelesen, pin: pinFeld.value }, S.demoAblage(gelesen.klasse));
      if (window.MK_ORDNER) return await melde({ ...gelesen, pin: pinFeld.value }, S.ordnerAblage(window.MK_ORDNER));
      // Der Mathekingdom-Ordner (ADR 0024): aus der Startdatei, gemerkt oder einmal gewählt.
      let schule = window.MK_WURZEL ? S.ordnerAblage(window.MK_WURZEL) : null;
      if (!schule && z.gemerkt && !anderer) {
        const stand = await zugriff(z.gemerkt);
        if (stand === 'ja') schule = S.ordnerAblage(z.gemerkt);
        else if (stand === 'stumm') {
          // Laufwerk nicht erreichbar (Version 0.47): Der gemerkte Ordner bleibt, gewählt wird in den anderen Satz.
          const name = z.gemerkt.name; z.gemerkt = null; z.satzNr = 1 - (z.satzNr ?? 0);
          return fehler(`Der gemerkte Ordner „${name}“ antwortet gerade nicht. Ist das Laufwerk verbunden? Sonst klicke noch einmal und wähle den Ordner „Mathekingdom“, mit dem du jetzt arbeitest.`);
        } else { z.gemerkt = null; return fehler(`Ohne deine Erlaubnis kann Mathekingdom nicht speichern. Klicke noch einmal und wähle den Ordner „Mathekingdom“${pfadHinweis()}.`); }
      }
      if (!schule) {
        const gewaehlt = await S.waehleOrdner();
        const gefunden = await SCH.findeSchule(gewaehlt);
        if (gefunden.wurzel) {
          schule = gefunden.wurzel;
          await satzSchule.merke(z.satzNr ?? 0, 'schule', schule.handle);
          z.gemerkt = schule.handle;
        } else if (window.MK_SCHULE) {
          return fehler(`Das ist nicht der richtige Ordner. Wähle den Ordner „Mathekingdom“${pfadHinweis()}.`);
        } else {
          // Ohne Schulverzeichnis: wie bisher direkt der Klassenordner (alte Startdateien, Ausprobieren).
          return await melde({ ...gelesen, pin: pinFeld.value }, gewaehlt);
        }
      }
      await meldeInSchule({ ...gelesen, pin: pinFeld.value }, schule, fehler);
    } catch (e) {
      if (e.name === 'AbortError') return;
      fehler(`Das hat nicht geklappt: ${e.message}`);
    }
  };
  const ohneWahl = Boolean(window.MK_ORDNER || window.MK_WURZEL || z.gemerkt);
  if (z.gemerkt === undefined) {
    z.gemerkt = null;
    satzSchule.finde().then(({ nr, ordner, stumm }) => {
      z.gemerkt = ordner.schule; z.satzNr = nr;
      if (z.ansicht?.name !== 'anmeldung' || window.MK_ORDNER || window.MK_WURZEL) return;
      const k = document.getElementById('ordner');
      if (z.gemerkt) { if (k) k.textContent = 'Aufbrechen'; document.getElementById('ordner-hinweis')?.remove(); document.getElementById('anderer-ordner')?.removeAttribute('hidden'); }
      // Antwortet der gemerkte Ordner nicht, steht es gleich unter dem Knopf (Version 0.47).
      if (stumm.length && k) k.after(h('p', { class: 'klein', id: 'ordner-stumm' }, `Der gemerkte Ordner „${stumm[0].name}“ antwortet gerade nicht. Bist du nicht in der Schule? Dann wähle den Ordner „Mathekingdom“, mit dem du jetzt arbeitest. Der gemerkte bleibt erhalten.`));
    });
  }
  return h('section', { class: 'karte anmeldung' },
    h('h1', {}, 'Mathekingdom'),
    h('p', { class: 'unter' }, 'Der König sucht Kundschafter, die sein Reich erkunden.'),
    h('label', { for: 'code' }, 'Dein Schülercode'),
    eingabe,
    h('label', { for: 'pin' }, 'Deine PIN'),
    pinFeld,
    a.fehler && h('p', { class: 'fehler', role: 'alert' }, a.fehler),
    S.kannOrdner()
      ? h('button', { class: 'haupt', id: 'ordner', onclick: () => starte(false) }, ohneWahl ? 'Aufbrechen' : window.MK_SCHULE ? 'Ordner wählen und aufbrechen' : 'Klassenordner wählen und aufbrechen')
      : h('p', { class: 'fehler' }, 'Dieser Browser kann nicht im Klassenordner speichern. Öffne die Datei bitte mit Edge oder Chrome.'),
    !ohneWahl && h('p', { class: 'klein', id: 'ordner-hinweis' }, window.MK_SCHULE
      ? `Nur beim ersten Mal: Im nächsten Fenster wählst du den Ordner „Mathekingdom“${pfadHinweis()} und erlaubst das Speichern.`
      : 'Im nächsten Fenster wählst du den Ordner deiner Klasse aus und erlaubst das Speichern.'),
    // Ausprobieren ohne Ordner nur in der Datei ohne Schuleinrichtung (Version 0.32): Mit der Startdatei des
    // Administrators würde ein Schüler sonst unbemerkt nur im Browser arbeiten, und die Lehrkraft sähe nichts.
    // Einen anderen Ordner wählen, auch wenn einer gemerkt ist (Version 0.47).
    S.kannOrdner() && !window.MK_ORDNER && !window.MK_WURZEL && h('button', { class: 'schlicht', id: 'anderer-ordner', hidden: !z.gemerkt, onclick: () => starte(false, true) }, 'Anderen Ordner wählen'),
    !window.MK_SCHULE && h('button', { class: 'schlicht', id: 'demo', onclick: () => starte(true) }, 'Ohne Ordner ausprobieren'));
}
const pfadHinweis = () => (window.MK_PFAD ? ` (${window.MK_PFAD})` : '');

// Anmeldung über den Mathekingdom-Ordner: Schulverzeichnis prüfen, Klassenordner aus dem Code finden.
async function meldeInSchule(gelesen, schule, fehler) {
  const v = await SCH.ladeVerzeichnis(schule, window.MK_SCHLUESSEL);
  if (v.status === 'fehlt') {
    // Ein gemerkter Ordner, der nicht mehr passt, wird vergessen: Beim nächsten Klick wird neu gewählt.
    z.gemerkt = null; await satzSchule.vergiss(z.satzNr ?? 0, 'schule');
    return fehler(`In diesem Ordner fehlt das Schulverzeichnis. Wähle den Ordner „Mathekingdom“${pfadHinweis()}.`);
  }
  if (v.status === 'ungueltig') return fehler('Das Schulverzeichnis wurde verändert und ist ungültig. Sag deiner Lehrkraft Bescheid.');
  let ort = await SCH.findeKlassenordner(schule, v.daten.schuljahr, gelesen.klasse);
  // Klassen- oder Schuljahreswechsel (ADR 0054): Steht der Code nicht im aktuellen Schuljahr, führt der hintere Teil
  // zum neuen Code. Die PIN gehört trotzdem dazu.
  const schluessel = (k) => (v.status === 'ok' ? SCH.schluesselDerKlasse(v.daten, v.daten.schuljahr, k) : undefined);
  const steht = async (ablage, k) => ((await S.ladeKlassendatei(ablage, ...(schluessel(k) ? [schluessel(k)] : []))).daten?.codes ?? []).includes(gelesen.code);
  if (!ort || ort.schuljahr !== v.daten.schuljahr || !(await steht(ort.ablage, gelesen.klasse))) {
    const jahr = await schule.ordner(v.daten.schuljahr);
    for (const k of Object.keys(v.daten.klassen?.[v.daten.schuljahr] ?? {})) {
      const ablage = jahr && await jahr.ordner(k);
      const daten = ablage && (await S.ladeKlassendatei(ablage, ...(schluessel(k) ? [schluessel(k)] : []))).daten;
      const treffer = SCH.neuerCodeZu(gelesen.code, { [k]: daten?.codes ?? [] });
      if (!treffer || treffer.code === gelesen.code) continue;
      z.codeHinweis = treffer.code;
      gelesen = { ...gelesen, code: treffer.code, klasse: k };
      ort = { ablage, schuljahr: v.daten.schuljahr };
      break;
    }
  }
  if (!ort) return fehler(`Für die Klasse ${gelesen.klasse} gibt es noch keinen Ordner. Sag deiner Lehrkraft Bescheid.`);
  z.schule = schule;
  satzSchule.benutzt(z.satzNr ?? 0);
  z.klassenSchluessel = v.status === 'ok' ? SCH.schluesselDerKlasse(v.daten, ort.schuljahr, gelesen.klasse) : null;
  // Vom Administrator gesperrte Aufgaben kommen nicht mehr dran (ADR 0025).
  z.gesperrt = v.status === 'ok' ? v.daten.gesperrt ?? [] : [];
  await melde(gelesen, ort.ablage);
}

async function melde({ code, klasse, pin }, ablage) {
  if (ablage.name.toLowerCase() !== klasse) {
    return zeige({ name: 'anmeldung', code, fehler: `Dein Code gehört zur Klasse ${klasse}, du hast aber den Ordner „${ablage.name}“ gewählt. Wähle den Ordner „${klasse}“.` });
  }
  const klassenstufe = parseInt(klasse, 10);
  const { pool, quelle: poolQuelle, grund: poolGrund } = await S.ladePool(ablage, klassenstufe);
  if (!pool) return zeige({ name: 'anmeldung', code, fehler: `Für Klasse ${klassenstufe} gibt es noch keine Aufgaben.` });
  const gelesen = await S.ladeKlassendatei(ablage, ...(z.klassenSchluessel !== undefined ? [z.klassenSchluessel] : []));
  if (gelesen.status === 'fehlt' || gelesen.status === 'ungueltig') {
    return zeige({ name: 'anmeldung', code, fehler: gelesen.status === 'fehlt'
      ? 'In diesem Ordner fehlt die Klassendatei. Sag deiner Lehrkraft Bescheid.'
      : 'Die Klassendatei wurde verändert und ist ungültig. Sag deiner Lehrkraft Bescheid.' });
  }
  const klassendatei = gelesen.daten;
  const einst = L.einstellungen(klassendatei, code, pool);
  if (!einst.codeBekannt) return zeige({ name: 'anmeldung', code, fehler: 'Dieser Schülercode steht nicht in der Klassenliste. Prüfe, ob du dich vertippt hast.' });
  // Hat die Lehrkraft eine PIN vergeben, gehört sie zur Anmeldung. Eine falsche PIN kostet absichtlich etwas Zeit.
  if (einst.pin && !(await pruefePin(pin, einst.pin))) {
    await new Promise((weiter) => setTimeout(weiter, 1500));
    return zeige({ name: 'anmeldung', code, fehler: pin ? 'Die PIN stimmt nicht. Schau auf dein Code-Kärtchen.' : 'Gib auch deine PIN ein. Sie steht auf deinem Code-Kärtchen.' });
  }
  // Ein zweites Fenster mit demselben Code darf nicht mitschreiben (Version 0.54).
  if (!ablage.demo && (await sichereFenster(code)) === 'besetzt') {
    return zeige({ name: 'anmeldung', code, fehler: 'Du bist mit diesem Code schon in einem anderen Fenster angemeldet. Arbeite dort weiter und schließe dieses Fenster.' });
  }
  if (z.stand) return; // schon angemeldet
  const geladen = await S.ladeStand(ablage, code);
  // Endete die vorige Sitzung ordentlich und fehlten der Datei nur ihre letzten Sekunden, ist das kein Problem (Version 0.54).
  const nurSchluss = geladen.hinweis === 'sicherung-neuer' && geladen.stand.betrieb?.at(-1)?.art === 'ende';
  const offenerPool = M.ohneGesperrte(pool, z.gesperrt);
  Object.assign(z, { ablage, pool: offenerPool, woerter: null, index: L.indexiere(offenerPool), klassendatei, einst, stand: geladen.stand ?? L.neuerSpeicherstand(code, klasse, jetzt()) });
  const sperrenBeachtet = M.beachteSperren(z.stand, z.gesperrt);
  z.meldung = geladen.hinweis && !nurSchluss ? 'Dein Speicherstand im Klassenordner fehlte oder war veraltet. Er wurde aus der Sicherung dieses Computers wiederhergestellt.' : null;
  if (z.codeHinweis === code) { z.meldung = `Dein Code heißt jetzt ${code}. Du bist jetzt in der Klasse ${klasse}. Melde dich ab jetzt mit dem neuen Code an.`; z.codeHinweis = null; }
  z.dienst = S.speicherdienst(ablage, () => z.stand, speicherMeldung);
  if (sperrenBeachtet) z.dienst.markiere();
  z.sitzungStart = jetzt();
  z.stand.dashboardVersion = versionsnummer(); // jede Bearbeitung merkt sich ihre Version (Version 0.54)
  if (!ablage.demo) {
    const vorige = P.vorigeSitzung(z.stand.betrieb);
    const e = P.starteintrag({ t: jetzt(), version: versionstext(), dashboard: window.MK_QUELLE ?? 'ohne-netz', grund: window.MK_GRUND,
      aufgaben: poolQuelle, aufgabenGrund: poolGrund, klassendatei: gelesen.status, browser: P.browserName(navigator.userAgent) });
    notiere(e.art, vorige === 'ohne-ende' ? `${e.text}, vorige Sitzung ohne Ende` : e.text);
    if (nurSchluss) notiere('info', 'Die letzten Sekunden der vorigen Sitzung aus der Sicherung dieses Computers übernommen (Fenster geschlossen, bevor der Klassenordner fertig war)');
    else if (geladen.hinweis) notiere('problem', geladen.hinweis === 'datei-fehlte'
      ? 'Speicherstand fehlte im Klassenordner, aus der Sicherung dieses Computers wiederhergestellt'
      : 'Speicherstand im Klassenordner war älter als die Sicherung dieses Computers, Sicherung übernommen');
  }
  z.dienst.markiere(); z.dienst.sofort();
  // Hat die Lehrkraft das Zielniveau gesenkt, kommen die Siegel jetzt dazu. Weggenommen wird nie etwas (ADR 0012).
  if (L.trageSiegelNach(z.stand, z.index, einst.zielniveau, jetzt())) { z.dienst.markiere(); z.dienst.sofort(); }
  if (L.gleicheSonderauftragAb(z.stand, einst.sonderauftrag)) z.dienst.markiere();
  if (L.lasseHilferufAblaufen(z.stand, jetzt())) z.dienst.markiere(); // Version 0.68: Ein Hilferuf gilt für den Tag.
  // Vorgaben der Lehrkraft alle 10 Sekunden lesen. Wartet der Schüler auf Hilfe, alle 3 Sekunden,
  // und sofort, wenn er zum Fenster zurückkehrt (im Hintergrund bremst der Browser die Uhr).
  let schlag = 0;
  setInterval(() => { if (z.stand.hilferuf || ++schlag % 3 === 0) takt(); }, 3300);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) takt(); });
  // Sitzungsende ins Betriebsprotokoll (Version 0.54). Die Sicherung im Browser wird sofort geschrieben, der Klassenordner so weit es geht.
  window.addEventListener('pagehide', () => {
    if (!ablage.demo && !z.endeNotiert) { z.endeNotiert = true; notiere('ende', P.endeText(z.sitzungStart, jetzt())); }
    z.dienst.zumSchluss();
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted && z.endeNotiert) { z.endeNotiert = false; z.sitzungStart = jetzt(); notiere('info', 'Fenster wieder geöffnet'); } });
  zeige({ name: 'schlossgarten' });
}
function maleStatus() {
  const alt = document.getElementById('speicherstatus');
  if (alt) alt.replaceWith((imFokus() ? fokusKopf() : kopf()).querySelector('#speicherstatus'));
  document.getElementById('speicherhinweis')?.replaceWith(speicherHinweis());
}

// Alle 10 Sekunden: Vorgaben der Lehrkraft neu lesen und die Warteschlange prüfen.
async function takt() {
  try {
    const gelesen = await S.ladeKlassendatei(z.ablage, ...(z.klassenSchluessel !== undefined ? [z.klassenSchluessel] : []));
    // Eine fehlende oder veränderte Klassendatei ändert nichts: Es gilt weiter die letzte gültige.
    if (gelesen.status === 'ok' || gelesen.status === 'ungeprueft') { z.klassendatei = gelesen.daten; z.klassendateiGemeldet = false; }
    else if (!z.klassendateiGemeldet) { z.klassendateiGemeldet = true; notiere('problem', gelesen.status === 'fehlt' ? 'Klassendatei fehlt im Klassenordner' : 'Klassendatei ungültig (Unterschrift passt nicht), es gilt die zuletzt gültige'); }
    const bild = (e) => JSON.stringify([...e.offeneKapitel, e.spielpause, e.zielniveau, e.hilfeAntwort, e.nachricht, [...e.gesperrteMeilensteine], e.expedition, e.sicherheitsangabe, e.ton, e.rast, [...e.einstiegPflicht], e.spielfreigabe, e.bestenliste, e.hoftitel, e.sonderauftrag?.id, e.sonderauftrag?.belohnung, e.muenzgaben.map((g) => g.id).join()]);
    const vorher = bild(z.einst);
    z.einst = einstellungenJetzt();
    if (L.trageSiegelNach(z.stand, z.index, z.einst.zielniveau, jetzt())) geaendert();
    if (L.gleicheSonderauftragAb(z.stand, z.einst.sonderauftrag)) geaendert(); // zurückgezogen oder ersetzt
    let neu = vorher !== bild(z.einst);
    if (L.lasseHilferufAblaufen(z.stand, jetzt())) { geaendert(); z.dienst.sofort(); neu = true; } // über Mitternacht offen gelassen
    const ruf = z.stand.hilferuf, antwort = z.einst.hilfeAntwort;
    if (ruf && antwort?.zu === ruf.seit && antwort.status === 'erledigt') {
      L.beendeHilferuf(z.stand, 'erledigt', jetzt()); geaendert(); z.dienst.sofort(); neu = true;
      meldeErledigt();
    }
    // Stand der Expedition höchstens jede Minute neu zählen, und nur auf der Startseite.
    if (z.einst.expedition && z.ansicht.name === 'schlossgarten' && Date.now() - (z.klasseGelesen ?? 0) > 60000) {
      const vorher = expeditionsSumme();
      await ladeKlasse();
      if (expeditionsSumme() !== vorher) neu = true;
    }
    if (z.stand.hilferuf) {
      const platz = L.wartePlatz(z.stand, await S.ladeAndereHilferufe(z.ablage, z.stand.code), jetzt());
      if (platz !== z.wartePlatz) { z.wartePlatz = platz; neu = true; }
    }
    // Nicht mitten in einer Eingabe neu zeichnen.
    if (neu && !['aufgabe', 'minispiel'].includes(z.ansicht.name)) male();
    else if (neu) {
      // Mitten in einer Aufgabe nur die Banner austauschen.
      wurzel.querySelectorAll('.hilfebanner, .brief').forEach((b) => b.remove());
      wurzel.querySelector('.kopf').after(...[hilfeBanner(), nachrichtBanner(), gabeBanner(), briefBanner()].filter(Boolean));
    }
    // In der Aufgabe erscheint der Knopf für einen neuen Hilferuf wieder, ohne die Eingabe zu verlieren.
    if (neu && z.ansicht.name === 'aufgabe' && !z.stand.hilferuf && !wurzel.querySelector('#hilferuf')) wurzel.querySelector('aside.hilfen')?.replaceWith(hilfen(z.ansicht));
  } catch { /* Ordner kurz nicht erreichbar: beim nächsten Takt erneut */ }
}
function einstellungenJetzt() {
  const e = L.einstellungen(z.klassendatei, z.stand.code, z.pool);
  if (z.ablage.demo) e.spielpause = true;
  // Version 0.67 (ADR 0057): Wer mit dem Aktuellen Kapitel fertig ist, darf ein Kapitel vorausarbeiten, wenn die Klasse es erlaubt.
  return z.stand && z.index ? L.mitVorausarbeiten(z.pool, z.index, z.stand, e) : e;
}

// ---------- Schlossgarten ----------
// Ausgangsort in der Mitte des Königreichs: ein Gartentor je freigegebenem Kapitel, dahinter die Regionskarte.
// Nicht freigegebene Tore fehlen ganz; die Nummer ist die des Kapitels im Lehrwerk (ADR 0022).
function schlossgarten() {
  z.einst = einstellungenJetzt();
  const neu = L.neueTore(z.stand, z.einst.offeneKapitel);
  if (neu.length) { z.toreNeu = new Set(neu); L.merkeToreGesehen(z.stand, neu); geaendert(); }
  const offene = z.pool.kapitel.map((k, i) => ({ k, nr: i + 1 })).filter(({ k }) => z.einst.offeneKapitel.has(k.id));
  const verborgen = offene.length < z.pool.kapitel.length;
  const neuTitel = offene.filter(({ k }) => z.toreNeu?.has(k.id)).map(({ k }) => k.titel);
  hoftitelLaden();
  // Seit 0.48 leuchtet das Tor der Etappe statt eines Knopfs „Weitermachen“ (ADR 0041): das Aktuelle Kapitel, solange es dort etwas gibt.
  const etappe = L.etappe(z.pool, z.index, z.stand, z.einst);
  const leuchtet = etappe?.milestone ? etappe.kapitel.id : null;
  const weiterKarte = etappe?.milestone ? h('div', { class: 'karte weiter-karte', id: 'weiter-karte' },
    h('div', {}, h('span', { class: 'klein' }, 'Hier geht es weiter'), h('h2', {}, etappe.kapitel.titel), h('p', {}, `Nächster Meilenstein: ${etappe.milestone.titel}`)),
    h('button', { class: 'haupt', id: 'weiter-knopf', onclick: () => zeige({ name: 'region', kapitel: etappe.kapitel.id }) }, 'Weiter')) : null;
  const endeKapitel = !weiterKarte && (z.pool.kapitel.find((k) => k.id === z.einst.aktuellesKapitel && z.einst.offeneKapitel.has(k.id)) ?? etappe?.kapitel);
  const endeKarte = endeKapitel ? kapitelendeKarte(endeKapitel) : null;
  return h('section', {},
    neuTitel.length > 0 && h('div', { class: 'karte neues-tor', id: 'neues-tor', role: 'status' },
      h('p', {}, h('strong', {}, neuTitel.length === 1 ? 'Ein neues Tor hat sich geöffnet: ' : 'Neue Tore haben sich geöffnet: '), neuTitel.join(', '))),
    // Version 0.67 (Audit L085): „Hier geht es weiter“ steht oben, der Rückblick gleich groß daneben. Ist nichts mehr offen, steht dort das Kapitelende.
    h('div', { class: 'oben-zeile' }, weiterKarte ?? endeKarte, rueckblickKarte()),
    brueckeKarte(),
    expeditionKarte(),
    h('div', { class: 'schlosskopf' }, schlossBild(),
      h('h1', {}, 'Der Schlossgarten'),
      h('p', { class: 'unter' }, `Klasse ${z.pool.klassenstufe}: Hinter jedem Tor liegt eine Region des Königreichs. Wähle ein Tor und erkunde die Region.`)),
    h('ol', { class: 'regionen' }, offene.map(({ k, nr }) => {
      const mit = k.unterkapitel.filter((u) => !L.istNiveauAbstecher(u, z.einst.zielniveau) && L.milestoneStatus(z.index, z.stand, u) !== 'leer');
      const gemeistert = mit.filter((u) => L.milestoneStatus(z.index, z.stand, u) === 'gemeistert').length;
      const hier = k.id === leuchtet;
      return h('li', {}, h('button', { class: `region${z.toreNeu?.has(k.id) ? ' neu' : ''}${hier ? ' leuchtet' : ''}`, 'data-kapitel': k.id, ...(hier && { 'aria-current': 'step', id: 'tor-hier' }), onclick: () => zeige({ name: 'region', kapitel: k.id }) },
        gartentor(true),
        h('span', { class: 'nummer' }, `Tor ${nr}`, hier && h('span', { class: 'hier-weiter' }, ' · Hier geht es weiter')),
        h('span', { class: 'titel' }, k.titel),
        k.id === z.einst.aktuellesKapitel && h('span', { class: 'marke' }, 'Aktuelles Kapitel'),
        k.id === z.einst.vorausKapitel && h('span', { class: 'marke', id: 'voraus-marke' }, 'Vorausarbeiten'),
        L.kapitelStand(z.index, z.stand, k, z.einst) && h('span', { class: 'marke gut' }, 'geschafft'),
        h('span', { class: 'stand' }, mit.length === 0 ? 'Aufgaben folgen' : `${gemeistert} von ${mit.length} Meilensteinen gemeistert`)));
    })),
    verborgen && h('p', { class: 'klein weitere-tore', id: 'weitere-tore' }, 'Weitere Tore öffnet deine Lehrkraft, wenn es so weit ist.'));
}

// Startseite: Wo stehe ich, was tue ich jetzt? Ein Tipp führt direkt zur nächsten Aufgabe.
// ---------- Rückblick (ADR 0014) ----------
// Gemischte Aufgaben zu älteren Siegeln. Freiwillig, höchstens einmal am Tag. Siegel gehen nie verloren.
function rueckblickKarte() {
  const angebot = L.rueckblickAngebot(z.stand, z.index, jetzt());
  if (!angebot) return null;
  return h('div', { class: 'karte rueckblick', id: 'rueckblick' },
    h('div', {},
      h('span', { class: 'klein' }, 'Rückblick'),
      h('h2', {}, angebot.art === 'fortsetzen' ? 'Dein Rückblick wartet' : 'Weißt du es noch?'),
      h('p', {}, angebot.art === 'fortsetzen'
        ? `Noch ${angebot.offen} ${angebot.offen === 1 ? 'Aufgabe' : 'Aufgaben'} aus deinem Rückblick.`
        : 'Ein paar gemischte Aufgaben zu Lernzielen, die du schon geschafft hast. Wer regelmäßig zurückblickt, vergisst weniger. Deine Siegel behältst du in jedem Fall.')),
    h('button', { class: 'haupt', id: 'rueckblick-start', onclick: starteRueckblick }, angebot.art === 'fortsetzen' ? 'Weitermachen' : 'Rückblick starten'));
}
function starteRueckblick() {
  if (!z.stand.rueckblickAktiv && !L.stelleRueckblick(z.stand, z.index, z.einst.zielniveau, jetzt())) return male();
  geaendert();
  const id = L.naechsteRueckblickAufgabe(z.stand);
  const aufgabe = id && z.index.aufgabe.get(id);
  if (!aufgabe) { z.stand.rueckblickAktiv = null; geaendert(); return zeige({ name: 'schlossgarten' }); }
  zeigeAufgabe(aufgabe, { rueckblick: true });
}

// ---------- Einstiegscheck (ADR 0014) ----------
// Vor dem ersten Meilenstein eines Kapitels: ein paar Aufgaben, die eine Krone vorschlagen. Keine Münzen, keine Siegel.
function einstiegKarte(kapitel) {
  const zustand = L.einstiegsZustand(z.stand, z.index, kapitel);
  if (!zustand) return null;
  const pflicht = z.einst.einstiegPflicht.has(kapitel.id);
  const e = z.stand.einstieg?.[kapitel.id];
  return h('div', { class: 'karte einstieg', id: 'einstieg' },
    h('div', {},
      h('span', { class: 'klein' }, 'Einstiegscheck'),
      h('h2', {}, zustand === 'laeuft' ? 'Dein Einstiegscheck wartet' : 'Was weißt du schon?'),
      h('p', {}, zustand === 'laeuft'
        ? `Noch ${e.aufgaben.length - e.erledigt.length} von ${e.aufgaben.length} Aufgaben.`
        : `Ein paar Aufgaben aus der ganzen Region, je ein Versuch, ohne Hilfekärtchen. Danach schlagen wir dir vor, um welche Krone du spielen könntest. Es gibt keine Münzen und nichts zu verlieren.${pflicht ? ' Deine Lehrkraft möchte, dass du ihn machst, bevor du losgehst.' : ''}`)),
    h('div', { class: 'knoepfe' },
      h('button', { class: 'haupt', id: 'einstieg-start', onclick: () => starteEinstieg(kapitel) }, zustand === 'laeuft' ? 'Weitermachen' : 'Einstiegscheck starten'),
      !pflicht && zustand === 'offen' && h('button', { class: 'schlicht', id: 'einstieg-ueberspringen', onclick: () => { L.ueberspringeEinstieg(z.stand, kapitel.id, jetzt()); geaendert(); male(); } }, 'Überspringen')));
}
function starteEinstieg(kapitel) {
  if (!z.stand.einstieg?.[kapitel.id]) { L.stelleEinstieg(z.stand, z.index, kapitel, jetzt()); geaendert(); }
  const id = L.naechsteEinstiegsAufgabe(z.stand, kapitel.id);
  const aufgabe = id && z.index.aufgabe.get(id);
  if (!aufgabe) return zeige({ name: 'region', kapitel: kapitel.id });
  zeigeAufgabe(aufgabe, { einstieg: kapitel.id });
}

// ---------- Brücke (ADR 0014) ----------
// Wird ein Lernziel wackelig, schlägt das Dashboard drei Aufgaben zu einer Voraussetzung vor. Freiwillig.
function brueckeKarte() {
  const b = z.stand.brueckeAktiv;
  if (!b) return null;
  return h('div', { class: 'karte bruecke', id: 'bruecke' },
    h('div', {}, h('span', { class: 'klein' }, 'Brücke'), h('h2', {}, 'Deine Brücke wartet'),
      h('p', {}, `Noch ${b.aufgaben.length - b.erledigt.length} von ${b.aufgaben.length} Aufgaben zu „${lernzielText(b.zu)}“.`)),
    h('button', { class: 'haupt', id: 'bruecke-weiter', onclick: starteBruecke }, 'Weitermachen'));
}
const lernzielText = (id) => (z.index.lernziel.get(id)?.text ?? id).replace(/\.$/, ''); // ohne Schlusspunkt, für Zitate im Satz
// Brücken nur zu Lernzielen, die der Schüler auch öffnen darf.
function brueckeAngebot(lernzielId) {
  // Die Brücke gibt es ab Gold. Wer um Silber spielt, übt stattdessen die Grundlage (ADR 0015).
  if (L.NIVEAUS.indexOf(L.arbeitsniveau(z.stand, L.kapitelVon(lernzielId), z.einst.zielniveau, lernzielId)) < L.NIVEAUS.indexOf('M')) return null;
  if ((z.brueckeAbgelehnt ??= new Set()).has(lernzielId)) return null;
  const v = L.brueckeVorschlag(z.stand, z.index, lernzielId, jetzt());
  // Klasse 6 (ADR 0037): Eine Brücke darf zu einem Lernziel der vorigen Klassenstufe führen. Das ist immer offen.
  if (v && z.index.vorstufe.has(v.zu)) return v;
  if (!v || !z.einst.offeneKapitel.has(L.kapitelVon(v.zu))) return null;
  const ms = z.index.meilensteinVon.get(v.zu);
  return ms && z.einst.gesperrteMeilensteine.has(ms.id) ? null : v;
}
function starteBruecke(vorschlag) {
  if (!z.stand.brueckeAktiv) {
    if (!vorschlag?.zu || !L.stelleBruecke(z.stand, z.index, vorschlag, z.einst.zielniveau, jetzt())) return male();
    geaendert();
  }
  const id = L.naechsteBrueckenAufgabe(z.stand);
  const aufgabe = id && z.index.aufgabe.get(id);
  if (!aufgabe) { z.stand.brueckeAktiv = null; geaendert(); return zeige({ name: 'schlossgarten' }); }
  zeigeAufgabe(aufgabe, { bruecke: true });
}

// ---------- Hoftitel (ADR 0023) ----------
// Die fünf Besten des Schuljahrs nach Kronen und Siegeln, berechnet aus den Speicherständen der Klasse.
// Jeder sieht nur seinen eigenen Titel, in der Kopfzeile (seit Version 0.20).
const ehreCache = new WeakMap();
function wertVon(stand) {
  const schluessel = `${stand.versuche?.length ?? 0}|${Object.keys(stand.lernziele ?? {}).length}`;
  const c = ehreCache.get(stand);
  if (c?.schluessel === schluessel) return c.wert;
  const wert = L.ehrenwert(z.pool, z.index, stand);
  ehreCache.set(stand, { schluessel, wert });
  return wert;
}
const eintrag = (st) => ({ id: st.code, stand: st, wert: wertVon(st) });
function eigenerTitel() {
  if (!z.einst?.hoftitel || !z.andere || !z.index) return null;
  const v = L.hoftitelVergabe(z.pool, z.index, [eintrag(z.stand), ...z.andere.filter((st) => st.code !== z.stand.code).map(eintrag)]);
  return v.find((e) => e.id === z.stand.code)?.titel ?? null;
}
function hoftitelKopf() {
  const titel = eigenerTitel();
  if (!titel) return null;
  return h('span', { class: 'hoftitel-kopf', id: 'hoftitel-kopf', title: `${titel.name}: einer der fünf Besten der Klasse in diesem Schuljahr` }, hoftitelBild(titel.id, 26, { titel: titel.name }), titel.name);
}
// Lädt die Stände der Mitschüler höchstens einmal pro Minute, damit die Kopfzeile den Titel kennt.
function hoftitelLaden() {
  if (!z.einst.hoftitel || z.klasseLaedt || Date.now() - (z.klasseGelesen ?? 0) <= 60000) return;
  z.klasseLaedt = true;
  ladeKlasse().then(() => { z.klasseLaedt = false; if (z.ansicht.name === 'schlossgarten') male(); });
}

// ---------- Expedition (ADR 0014) ----------
// Gemeinsames Ziel der Klasse. Jeder sieht den Stand der Klasse und nur seinen eigenen Beitrag.
async function ladeKlasse() {
  z.klasseGelesen = Date.now();
  try { z.andere = await S.ladeAndereStaende(z.ablage, z.stand.code); } catch { /* beim nächsten Mal */ }
}
function expeditionsSumme() {
  const ex = z.einst.expedition;
  return ex ? L.expeditionsStand([z.stand, ...(z.andere ?? [])], ex, jetzt()).summe : 0;
}
function expeditionKarte() {
  const ex = z.einst.expedition;
  if (!ex) return null;
  if (!z.andere && !z.klasseLaedt) { z.klasseLaedt = true; ladeKlasse().then(() => { z.klasseLaedt = false; if (z.ansicht.name === 'schlossgarten') male(); }); }
  const st = L.expeditionsStand([z.stand, ...(z.andere ?? [])], ex, jetzt());
  const meine = L.expeditionsZeichen(z.stand, ex);
  const lohn = ex.belohnung === 'spielpause' ? 'eine Spielpause für alle' : 'die Expeditionsfahne fürs Wappen, für alle';
  if (st.geschafft && L.holeBelohnung(z.stand, ex, jetzt())) geaendert();
  const bis = new Date(`${ex.bis}T12:00:00`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  const anteil = Math.min(1, st.summe / ex.ziel);
  return h('div', { class: `karte expedition${st.geschafft ? ' geschafft' : ''}`, id: 'expedition' },
    h('span', { class: 'klein' }, `Expedition der Klasse ${z.stand.klasse}`),
    h('h2', {}, st.geschafft ? 'Die Expedition ist geschafft!' : st.vorbei ? 'Die Expedition ist vorbei' : `Gemeinsam ${ex.ziel} Expeditionszeichen bis zum ${bis}`),
    h('div', { class: 'expeditionsbalken', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ex.ziel, 'aria-valuenow': Math.min(st.summe, ex.ziel), 'aria-label': 'Stand der Klasse' },
      h('i', { style: `width:${Math.round(anteil * 100)}%` })),
    h('p', { id: 'expedition-stand' }, h('b', {}, `Die Klasse hat ${Math.min(st.summe, ex.ziel)} von ${ex.ziel}.`), ` Davon ${meine === 1 ? 'ist 1 deins' : `sind ${meine} deine`}.`),
    h('p', { class: 'klein' }, st.geschafft
      ? (ex.belohnung === 'spielpause' ? 'Eure Belohnung ist eine Spielpause. Deine Lehrkraft schaltet sie frei.' : 'Eure Belohnung: Die Expeditionsfahne liegt jetzt bei deinem Wappen.')
      : st.vorbei ? 'Das Ziel wurde diesmal nicht erreicht. Beim nächsten Mal klappt es.'
        : `Jedes neue Siegel und jeder Rückblick bringt ein Zeichen. Belohnung: ${lohn}.`));
}

// Merkzettel (ADR 0056): je Lernziel eine Regel und ein Beispiel. Frei zugänglich, kostet nichts.
// Eine Rechnung im Beispiel steht wie im Heft: Stelle unter Stelle, in fester Zeichenbreite. Eine Zeile aus Strichen wird zum Rechenstrich.
export function merkzettelInhalt(m) {
  // Ein Rechenstrich reicht nur so weit wie seine Striche („ --“ unter „15“), wie im Heft.
  const zeile = (text) => { const st = text.match(/^( *)(-+) *$/); return st ? h('span', { class: 'mz-strichzeile' }, st[1], h('i', { class: 'mz-strich' }, ' '.repeat(st[2].length))) : h('span', {}, text.replace(/ +$/, '') || ' '); };
  return [h('p', { class: 'mz-regel' }, m.regel),
    h('div', { class: 'mz-beispiel' }, h('b', {}, 'Beispiel'),
      m.rechnung && h('div', { class: 'mz-rechnung', role: 'img', 'aria-label': m.rechnung.filter((text) => !/^[ -]*$/.test(text)).map((text) => text.trim()).join(', ') }, m.rechnung.map(zeile)),
      m.beispiel && h('p', {}, m.beispiel.split('\n').map((text) => h('span', { class: 'mz-zeile' }, text))))];
}
// In der Aufgabe: der Merkzettel des Lernziels dieser Aufgabe. Der Hinweis fürs Heft steht nur bei einer Heftaufgabe.
function merkzettel(lernziel, meilenstein, a) {
  const m = lernziel?.merkzettel;
  if (!m) return null;
  return h('details', { class: 'merkzettel', open: Boolean(a.merkzettelOffen), ontoggle: (e) => { a.merkzettelOffen = e.target.open; } },
    h('summary', {}, 'Merkzettel'),
    merkzettelInhalt(m),
    a.aufgabe.heftaufgabe && meilenstein?.heft && h('p', { class: 'heft' }, h('b', {}, 'Im Heft: '), meilenstein.heft));
}
// An der Meilenstein-Tafel: die Merkzettel aller Lernziele des Meilensteins untereinander, je unter seinem Ich-kann-Satz.
function merkzettelTafel(meilenstein, halter) {
  const ziele = meilenstein.lernziele.filter((l) => l.merkzettel && z.index.lernzielMitAufgaben.has(l.id));
  if (!ziele.length) return null;
  return h('details', { class: 'merkzettel', open: Boolean(halter?.merkzettelOffen), ontoggle: (e) => { if (halter) halter.merkzettelOffen = e.target.open; } },
    h('summary', {}, ziele.length === 1 ? 'Merkzettel' : `Merkzettel (${ziele.length})`),
    ziele.map((l) => h('section', { class: 'mz-ziel', 'data-merkzettel': l.id }, h('h3', {}, l.text), merkzettelInhalt(l.merkzettel))));
}

// Worterklärung am Wort (ADR 0056): Wörter aus den Wortspeichern sind in der Aufgabe gepunktet unterstrichen.
// Die Erklärung erscheint beim Darüberfahren und beim Anklicken; nach einem Klick bleibt sie stehen. Einen Kasten gibt es nicht mehr.
const WORT_STELLEN = '.aufgabentext, .option > span:not(.kartenname), .teile li > span, .zuordnen b, .kaertchen-offen p';
const WORT_HINWEISE = 3; // So oft steht der Satz unter der Aufgabe, der das Unterstreichen erklärt.
function wortOrt(auf) {
  const m = z.index.meilensteinVon.get(auf.lernziel);
  return { meilenstein: m?.id ?? auf.lernziel.split('-')[0], kapitel: L.kapitelVon(auf.lernziel), vorstufe: !m };
}
export function markiereWoerter(karte, verzeichnis, ort) {
  const schon = new Set();
  let blase = null, fest = null;
  const schliesse = () => { blase?.remove(); blase = null; fest?.classList.remove('fest'); fest = null; };
  const zeige = (el) => {
    blase?.remove();
    blase = h('div', { class: 'worterklaerung', id: 'worterklaerung', role: 'tooltip' }, h('b', {}, el.dataset.wort), h('span', {}, el.dataset.erklaerung));
    karte.append(blase);
    // Über dem Wort, damit Rechnung und Eingabefeld darunter frei bleiben; die Blase darf dabei über den Kartenrand ragen.
    // Ist im Fenster oben kein Platz, steht sie unter dem Wort.
    const k = karte.getBoundingClientRect(), w = el.getBoundingClientRect(), b = blase.getBoundingClientRect();
    const oben = w.top - k.top - b.height - 6;
    blase.style.left = `${Math.max(8, Math.min(w.left - k.left, k.width - b.width - 8))}px`;
    blase.style.top = `${w.top - b.height - 6 >= 4 ? oben : w.bottom - k.top + 6}px`;
  };
  const wortEl = (text, f) => h('span', { class: 'wort', tabIndex: 0, role: 'button', 'aria-describedby': 'worterklaerung', 'data-wort': f.wort, 'data-erklaerung': f.erklaerung,
    onmouseenter: (e) => { if (!fest) zeige(e.currentTarget); }, onmouseleave: () => { if (!fest) schliesse(); },
    onfocus: (e) => { if (!fest) zeige(e.currentTarget); }, onblur: () => { if (!fest) schliesse(); },
    onkeydown: (e) => { if (e.key === 'Escape') schliesse(); else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.currentTarget.click(); } },
    onclick: (e) => { const el = e.currentTarget, war = fest === el; schliesse(); if (!war) { zeige(el); fest = el; el.classList.add('fest'); } e.stopPropagation(); } }, text);
  for (const stelle of karte.querySelectorAll(WORT_STELLEN)) {
    const knoten = [];
    const gang = document.createTreeWalker(stelle, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest('.bruch, .wort, svg, select, .zahlfeld') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    while (gang.nextNode()) knoten.push(gang.currentNode);
    for (const n of knoten) {
      const funde = findeWoerter(n.data, verzeichnis, ort).filter((f) => !schon.has(f.wort) && schon.add(f.wort));
      if (!funde.length) continue;
      const teile = [];
      let ende = 0;
      for (const f of funde) { if (f.start > ende) teile.push(n.data.slice(ende, f.start)); teile.push(wortEl(n.data.slice(f.start, f.ende), f)); ende = f.ende; }
      if (ende < n.data.length) teile.push(n.data.slice(ende));
      n.replaceWith(...teile);
    }
  }
  // Ein Klick neben das Wort schließt die Erklärung wieder.
  if (schon.size) karte.addEventListener('click', (e) => { if (!e.target.closest('.wort')) schliesse(); });
  return schon.size;
}

// ---------- Das kannst du schon (ADR 0026) ----------
// Alle Lernziele der aktuellen Klassenstufe mit Siegel, als Ich-kann-Sätze nach Kapitel und Meilenstein.
function koennenAnsicht() {
  const mitAufgaben = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).filter((l) => z.index.lernzielMitAufgaben.has(l.id));
  const geschafft = mitAufgaben.filter((l) => z.stand.lernziele[l.id]);
  const datum = (t) => { const d = new Date(t); return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('de-DE'); };
  const kapitel = z.pool.kapitel.map((k) => ({ k, meilensteine: k.unterkapitel.map((u) => ({ u, ziele: u.lernziele.filter((l) => z.stand.lernziele[l.id] && z.index.lernzielMitAufgaben.has(l.id)) })).filter((m) => m.ziele.length) }))
    .filter((x) => x.meilensteine.length);
  return h('section', { class: 'koennen', id: 'koennen' },
    h('h1', {}, 'Das kannst du schon'),
    h('p', { class: 'unter', id: 'koennen-zaehler' }, `${geschafft.length} von ${mitAufgaben.length} Lernzielen in Klasse ${z.pool.klassenstufe}`),
    kapitel.length === 0 && h('div', { class: 'karte' }, h('p', {}, 'Noch hast du kein Siegel. Für jedes Lernziel, das du schaffst, steht hier ein Satz, was du jetzt kannst.')),
    kapitel.map(({ k, meilensteine }) => h('div', { class: 'karte koennen-kapitel', 'data-kapitel': k.id },
      h('h2', {}, k.titel),
      meilensteine.map(({ u, ziele }) => {
        const krone = L.krone(z.index, z.stand, u);
        return h('div', { class: 'koennen-meilenstein' },
          h('h3', {}, krone && kroneBild(krone, 22), u.titel, krone && h('span', { class: 'klein' }, ` Krone ${L.KRONEN[krone]}`)),
          h('ul', { class: 'lernziele' }, ziele.map((l) => {
            const fest = L.istGefestigt(z.stand, l.id);
            return h('li', { class: `erreicht${fest ? ' gefestigt' : ''}`, 'data-lernziel': l.id }, siegel(22, true),
              h('span', { class: 'text' }, l.text, fest && h('span', { class: 'fest', title: 'Auch nach mehr als einer Woche noch gewusst.' }, 'gefestigt')),
              h('small', { class: 'datum' }, datum(z.stand.lernziele[l.id].erreichtAm)));
          })));
      }))));
}

// ---------- Regionskarte ----------
function regionsAnsicht() {
  z.toreNeu = null; // Die Ankündigung neuer Tore gilt nur bis zum ersten Gang durch ein Tor.
  // Hat die Lehrkraft das Tor inzwischen geschlossen, geht es zurück in den Schlossgarten (ADR 0022).
  if (!z.einst.offeneKapitel.has(z.ansicht.kapitel)) { z.ansicht = { name: 'schlossgarten', seit: Date.now() }; return schlossgarten(); }
  const kapitel = z.pool.kapitel.find((k) => k.id === z.ansicht.kapitel);
  // Version 0.67 (ADR 0057): Eine eigene Purpur-Wahl aus dem letzten Kapitel gilt hier weiter.
  if (L.erbeWahl(z.stand, kapitel.id, z.einst.zielniveau)) geaendert();
  const niveau = L.arbeitsniveau(z.stand, kapitel.id, z.einst.zielniveau);
  const zu = z.einst.gesperrteMeilensteine, nebel = L.imNebel(z.index, z.stand, kapitel, z.einst);
  const milestones = kapitel.unterkapitel.map((u) => ({ id: u.id, titel: u.titel, extra: L.istAbstecher(u, z.einst.zielniveau), ab: u.ab, krone: L.krone(z.index, z.stand, u),
    status: zu.has(u.id) ? 'gesperrt' : nebel.has(u.id) ? 'imnebel' : L.milestoneStatus(z.index, z.stand, u) }));
  // Standort ist, wohin die Aufgabenführung gerade führt (ADR 0026).
  // Version 0.67 (Audit L206): Ohne Führung steht der Standort nie von selbst auf einem Abstecher, außer das Kind hat selbst Purpur gewählt.
  const wahl = milestones.filter((m) => !m.extra || niveau === 'E');
  const standort = (L.fuehrungsMeilenstein(z.index, z.stand, kapitel, z.einst, niveau, jetzt()) ?? wahl.find((m) => m.status === 'begonnen') ?? wahl.find((m) => m.status === 'offen') ?? wahl.at(-1) ?? milestones[0]).id;
  const gewaehlt = z.ansicht.milestone ?? standort;
  const meilenstein = kapitel.unterkapitel.find((u) => u.id === gewaehlt);
  const einstieg = einstiegKarte(kapitel);
  const wartet = einstieg && z.einst.einstiegPflicht.has(kapitel.id);
  const karte = regionMap({ milestones, standort, gewaehlt, wappen: z.stand.wappen,
    beiMeilenstein: (id) => zeige({ ...z.ansicht, milestone: id }) });
  return h('section', {},
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'schlossgarten' }) }, '← Schlossgarten')),
    h('h1', {}, kapitel.titel),
    h('p', { class: 'unter' }, `Du spielst um ${L.KRONEN[niveau]}. Für einen Meilenstein brauchst du mindestens ${L.KRONEN[z.einst.zielniveau]}. ${nebel.size ? 'Die Meilensteine im Nebel öffnen sich, wenn du alle offenen gemeistert hast.' : 'Die Nummern auf den Meilensteinen sind ein Vorschlag: Du darfst jeden offenen Meilenstein wählen.'}`),
    einstieg,
    !einstieg && kapitelendeKarte(kapitel),
    h('div', { class: 'kartenrahmen' }, karte),
    legende(),
    wartet ? h('div', { class: 'karte tafel' }, h('p', {}, 'Mach zuerst den Einstiegscheck. Danach öffnen sich die Meilensteine.')) : meilensteinTafel(kapitel, meilenstein, niveau));
}
// ---------- Kapitel geschafft (Version 0.67, ADR 0057) ----------
// Sind alle Pflicht-Meilensteine gemeistert, zeigt der Lernpfad diesen Bildschirm statt neuer Aufgaben. Der Hauptknopf nimmt das
// erste Angebot, das zutrifft (siehe L.kapitelendeAngebot). Dieselbe Karte steht klein über der Regionskarte und im Schlossgarten.
function kapitelendeKarte(kapitel, gross = false) {
  const an = L.kapitelendeAngebot(z.pool, z.index, z.stand, z.einst, kapitel, jetzt());
  if (!an) return null;
  const hp = an.haupt, niveau = L.arbeitsniveau(z.stand, kapitel.id, z.einst.zielniveau);
  // Wer schon um die höhere Krone spielt, braucht das Angebot nicht noch einmal.
  const unterwegs = hp.art === 'krone' && L.NIVEAUS.indexOf(niveau) >= L.NIVEAUS.indexOf(hp.niveau);
  if (unterwegs && !gross) return null;
  const zustand = unterwegs ? 'heute' : an.zustand;
  const titel = { geschafft: 'Kapitel geschafft!', lernpfad: 'Lernpfad geschafft!', heute: 'Für heute geschafft!' }[zustand];
  const text = { geschafft: `Du hast alle Meilensteine von „${kapitel.titel}“ gemeistert.`,
    lernpfad: `Du bist den Lernpfad von „${kapitel.titel}“ zu Ende gegangen. Einige Lernziele schaut sich deine Lehrkraft noch mit dir an.`,
    heute: 'Du hast heute alle Aufgaben gelöst, die auf deinem Weg liegen. Morgen zählen sie wieder.' }[zustand];
  const tor = (k) => `Tor ${z.pool.kapitel.indexOf(k) + 1}: ${k.titel}`;
  const angebot = unterwegs ? null : {
    kapitel: () => [hp.kapitel.id === z.einst.vorausKapitel ? 'Du darfst schon im nächsten Kapitel weiterarbeiten.' : 'Das nächste Tor ist offen.', `Weiter mit ${tor(hp.kapitel)}`, () => zeige({ name: 'region', kapitel: hp.kapitel.id })],
    rueckblick: () => ['Ein Rückblick ist dran: gemischte Aufgaben zu Lernzielen, die du schon geschafft hast.', 'Rückblick starten', starteRueckblick],
    frueher: () => ['In einem früheren Kapitel sind noch Lernziele offen.', `Weiter mit ${tor(hp.kapitel)}`, () => zeige({ name: 'region', kapitel: hp.kapitel.id })],
    krone: () => [hp.niveau === 'E' ? 'Wenn du magst, hol dir jetzt die Kronen in Purpur. Das ist freiwillig.' : `Hol dir jetzt die Kronen in ${L.KRONEN[hp.niveau]}.`, `Um ${L.KRONEN[hp.niveau]} spielen`,
      () => { L.setzeNiveau(z.stand, kapitel.id, hp.niveau); geaendert(); zeige({ name: 'region', kapitel: kapitel.id }); }],
    fertig: () => null,
  }[hp.art]();
  return h('div', { class: `karte kapitelende${gross ? ' ganz' : ''}`, id: 'kapitelende', 'data-zustand': zustand, 'data-angebot': unterwegs ? 'unterwegs' : hp.art, role: gross ? 'status' : null },
    h('div', {},
      h('span', { class: 'klein' }, kapitel.titel),
      h(gross ? 'h1' : 'h2', {}, zustand !== 'heute' && kroneBild(niveau, gross ? 40 : 26), ` ${titel}`.trimStart()),
      h('p', {}, text),
      angebot ? h('p', {}, angebot[0]) : h('p', { id: 'kapitelende-fertig' }, h('b', {}, zustand === 'heute' ? 'Für heute bist du fertig. ' : 'Du bist fertig. '), 'Sag deiner Lehrkraft Bescheid.')),
    h('div', { class: 'knoepfe' },
      angebot && h('button', { class: 'haupt', id: 'kapitelende-haupt', onclick: angebot[2] }, hp.art === 'krone' && kroneBild(hp.niveau, 20), ` ${angebot[1]}`.trimStart()),
      an.abstecher.map((u) => h('button', { class: 'schlicht', 'data-abstecher': u.id, onclick: () => zeige({ name: 'region', kapitel: kapitel.id, milestone: u.id }) },
        `Abstecher: ${u.titel}${L.istNiveauAbstecher(u, z.einst.zielniveau) ? ` (freiwillig${u.ab ? `, ${L.KRONEN[u.ab]}` : ''})` : ''}`)),
      gross && h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitel.id }) }, 'Zur Regionskarte')));
}
function kapitelendeAnsicht() {
  z.einst = einstellungenJetzt(); // das Tor zum Vorausarbeiten geht in diesem Moment auf
  const kapitel = z.pool.kapitel.find((k) => k.id === z.ansicht.kapitel);
  const karte = kapitel && kapitelendeKarte(kapitel, true);
  if (!karte) { z.ansicht = { name: 'region', kapitel: z.ansicht.kapitel, seit: Date.now() }; return regionsAnsicht(); }
  return h('section', {}, h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'schlossgarten' }) }, '← Schlossgarten')), karte);
}
function legende() {
  return h('ul', { class: 'legende', 'aria-label': 'Zeichenerklärung' },
    L.NIVEAUS.map((n) => h('li', {}, kroneBild(n, 18), `Krone ${L.KRONEN[n]}`)));
}

function meilensteinTafel(kapitel, meilenstein, kapitelNiveau) {
  // Niveau-Meilenstein (ADR 0038): Gespielt wird mindestens um die Krone seiner Marke.
  const niveau = L.stufeAb(kapitelNiveau, meilenstein.ab), seitenweg = L.istNiveauAbstecher(meilenstein, z.einst.zielniveau);
  const abstecher = L.istAbstecher(meilenstein, z.einst.zielniveau);
  const status = L.milestoneStatus(z.index, z.stand, meilenstein);
  if (z.einst.gesperrteMeilensteine.has(meilenstein.id)) {
    return h('div', { class: 'karte tafel gesperrt' }, h('h2', {}, `${meilenstein.titel} 🔒`), h('p', {}, 'Diesen Meilenstein hat deine Lehrkraft für dich noch nicht geöffnet. Wähle einen anderen Meilenstein.'));
  }
  if (L.imNebel(z.index, z.stand, kapitel, z.einst).has(meilenstein.id)) {
    const nr = kapitel.unterkapitel.filter((u) => !L.istAbstecher(u, z.einst.zielniveau)).indexOf(meilenstein) + 1;
    const wirt = abstecher && L.wirtVon(kapitel, meilenstein, z.einst.zielniveau);
    return h('div', { class: 'karte tafel nebeltafel', id: 'nebel-tafel' }, h('h2', {}, abstecher ? 'Ein Abstecher im Nebel' : `Meilenstein ${nr} im Nebel`),
      h('p', {}, wirt ? `Dieser Abstecher liegt noch im Nebel. Meistere zuerst ${wirt.titel}.` : 'Dieser Meilenstein liegt noch im Nebel. Meistere zuerst die offenen Meilensteine, dann lichtet er sich.'));
  }
  if (status === 'leer') {
    return h('div', { class: 'karte tafel' }, h('h2', {}, meilenstein.titel), h('p', {}, 'An diesem Meilenstein gibt es noch keine Aufgaben. Er wird bald eröffnet.'));
  }
  const naechstes = L.naechstesLernziel(z.index, z.stand, meilenstein, niveau, z.einst.zielniveau, jetzt());
  const lzNiveau = (id) => L.arbeitsniveau(z.stand, kapitel.id, z.einst.zielniveau, id); // Version 0.60: je Lernziel
  const zweiteRunde = L.runde(z.stand, kapitel.id) > 1;
  const meine = L.krone(z.index, z.stand, meilenstein), ziel = L.stufeAb(z.einst.zielniveau, meilenstein.ab);
  return h('div', { class: 'karte tafel' },
    h('h2', {}, meilenstein.titel, L.pflichtAb(meilenstein) && h('span', { class: 'marke niveaumarke', id: 'niveau-marke' }, seitenweg && meilenstein.ab ? `freiwillig, ${L.KRONEN[meilenstein.ab]}` : `${meilenstein.ab ? '' : 'Pflicht '}ab ${L.KRONEN[L.pflichtAb(meilenstein)]}`), status === 'gemeistert' && h('span', { class: 'marke gut' }, 'Meilenstein gemeistert')),
    seitenweg && h('p', { class: 'klein niveau-abstecher', id: 'niveau-abstecher' }, h('b', {}, 'Ein Abstecher für dich. '),
      meilenstein.ab ? `Hier gibt es nur Aufgaben um ${L.KRONEN[meilenstein.ab]}. Du musst ihn nicht gehen: Dein Kapitel schaffst du auch ohne ihn. Wenn du magst, hol dir hier eine Krone in ${L.KRONEN[meilenstein.ab]}.`
        : `Pflicht ist er erst ab ${L.KRONEN[meilenstein.pflicht]}. Du musst ihn nicht gehen: Dein Kapitel schaffst du auch ohne ihn. Wenn du magst, hol dir hier eine Krone.`),
    h('p', { class: 'meinekrone', id: 'meine-krone' }, meine
      ? [kroneBild(meine, 30), h('span', {}, h('b', {}, `Deine Krone: ${L.KRONEN[meine]}.`), L.unterZiel(meine, ziel) ? ` Für den Meilenstein brauchst du ${L.KRONEN[ziel]}.` : meine !== 'E' ? ' Du kannst sie noch aufwerten.' : '')]
      : [kroneBild(null, 30, { voll: false }), h('span', {}, seitenweg ? `Noch keine Krone. Hier gibt es sie ab ${L.KRONEN[ziel]}.` : `Noch keine Krone. Für den Meilenstein brauchst du ${L.KRONEN[ziel]}.`)]),
    (!seitenweg || !meilenstein.ab) && kronenWahl(kapitel, niveau, meilenstein.ab),
    h('ul', { class: 'lernziele' }, meilenstein.lernziele.filter((l) => z.index.lernzielMitAufgaben.has(l.id)).map((l) => {
      // Die Punkte zeigen den Weg zur Krone, um die der Schüler gerade spielt. Das Siegel gibt es fürs Zielniveau.
      const st = L.lernzielStand(z.stand, l.id, niveau, z.index);
      const erreicht = Boolean(z.stand.lernziele[l.id]);
      const fest = erreicht && L.istGefestigt(z.stand, l.id);
      // Version 0.60: unter dem Ziel geschafft, in der nächsten Runde holt sich das Kind hier sein Ziel.
      const unter = !erreicht && L.unterZielGeschafft(z.stand, l.id);
      return h('li', { class: `${erreicht ? 'erreicht' : ''}${fest ? ' gefestigt' : ''}${unter ? ' unter-ziel' : ''}`, 'data-lernziel': l.id },
        siegel(24, erreicht),
        h('span', { class: 'text' }, l.text, fest && h('span', { class: 'fest', title: 'Auch nach mehr als einer Woche noch gewusst.' }, 'gefestigt'),
          unter && h('span', { class: 'fest unterziel', 'data-unter-ziel': l.id }, kroneBild(unter.niveau, 14), ` ${L.KRONEN[unter.niveau]} geschafft${zweiteRunde ? ` · hol dir ${L.KRONEN[L.stufeAb(z.einst.zielniveau, meilenstein.ab)]}` : ''}`)),
        h('span', { class: 'punkte', title: `${st.erreicht ? 3 : st.fortschritt} von ${L.LERNZIEL_RICHTIGE} für ${L.KRONEN[niveau]}` }, [0, 1, 2].map((i) => h('i', { class: i < (st.erreicht ? 3 : st.fortschritt) ? 'voll' : '' }))),
        h('button', { class: 'schlicht', onclick: () => starteAufgabe(l.id, lzNiveau(l.id)) }, erreicht ? 'Weiter üben' : 'Üben'));
    })),
    zweiteRunde && status !== 'gemeistert' && h('p', { class: 'klein', id: 'hol-dir-gold' }, h('b', {}, `Hol dir ${L.KRONEN[L.stufeAb(z.einst.zielniveau, meilenstein.ab)]}! `), 'Du bist den Weg schon einmal gegangen. Jetzt geht es um die Siegel, die noch fehlen.'),
    h('button', { class: 'haupt', id: 'aufbrechen', onclick: () => starteAufgabe(naechstes.id, lzNiveau(naechstes.id)) },
      // Version 0.67: Wer nach dem Siegel um eine höhere Krone spielt, bricht wieder auf.
      status === 'gemeistert' && L.fuehrungFertig(z.index, z.stand, meilenstein, kapitelNiveau, z.einst.zielniveau) ? 'Noch eine Runde' : 'Aufbrechen'),
    merkzettelTafel(meilenstein, z.ansicht));
}

// Kronenwahl: „Spiele um …“. Voreingestellt ist das Zielniveau (ADR 0012). Die Wahl gilt als Start für jedes Lernziel des
// Kapitels; sinkt das Kind bei einem Lernziel ab, gilt das nur dort (Version 0.60, ADR 0052).
// Bronze steht nicht zur Wahl, außer die Lehrkraft hat das Ziel auf F gesetzt (ADR 0015).
// An einem Niveau-Meilenstein stehen nur die Kronen ab seiner Marke zur Wahl.
function kronenWahl(kapitel, niveau, ab = null) {
  return h('div', { class: 'kronenwahl', role: 'group', 'aria-label': 'Um welche Krone spielst du?' },
    h('b', {}, 'Spiele um'),
    h('div', { class: 'wahl' }, L.wahlNiveaus(z.einst.zielniveau).filter((n) => L.stufeAb(n, ab) === n).map((n) => h('button', { 'data-krone': n, 'aria-pressed': String(n === niveau),
      onclick: () => { if (n !== niveau) { L.setzeNiveau(z.stand, kapitel.id, n); geaendert(); male(); } } },
      kroneBild(n, 28), h('span', {}, L.KRONEN[n]), n === z.einst.zielniveau && h('span', { class: 'ziel' }, 'dein Ziel')))));
}

// ---------- Aufgabe ----------
function starteAufgabe(lernzielId, niveau) {
  // In der Grundlagen-Schleife kommt die Aufgabe von F, bis drei davon richtig sind (ADR 0015).
  // Version 0.67 (Tagessperre): Eine heute gelöste Aufgabe kommt heute nicht wieder. Ist alles gelöst, darf das Kind trotzdem üben
  // (`heuteAlles`): Dann steht ein Hinweis über der Aufgabe, es gibt 1 Münze und keinen Heftcode.
  const jz = jetzt(), stufe = L.aufgabenNiveau(z.stand, lernzielId, niveau), kap = L.kapitelVon(lernzielId);
  // Selbst gewählt (`frei`): Das Lernziel ist für die Führung schon erledigt. Dann gibt es danach „Noch eine Aufgabe hier“.
  const frei = !L.inGrundlage(z.stand, lernzielId) && L.lernzielErledigt(z.index, z.stand, lernzielId, L.arbeitsniveau(z.stand, kap, z.einst.zielniveau), z.einst.zielniveau, jz);
  let aufgabe = L.naechsteAufgabe(z.index, z.stand, lernzielId, stufe, Math.random, jz), heuteAlles = false;
  if (!aufgabe) { aufgabe = L.naechsteAufgabe(z.index, z.stand, lernzielId, stufe, Math.random, jz, true); heuteAlles = Boolean(aufgabe); }
  // Die Kronenwahl beim ersten Start eines Meilensteins ist die Selbsteinschätzung.
  const ms = z.index.meilensteinVon.get(lernzielId);
  if (ms) L.merkeWahl(z.stand, z.index, ms, L.stufeAb(niveau, ms.ab), jetzt());
  // Seitenblick (ADR 0016): ab der vierten Aufgabe eines Wegstücks einmal ein schon besiegeltes Lernziel des Kapitels.
  if (!L.inGrundlage(z.stand, lernzielId) && L.seitenblickFaellig(z.stand)) {
    const blick = L.waehleSeitenblick(z.index, z.stand, lernzielId, niveau);
    if (blick && !heuteAlles) return zeigeAufgabe(blick, { seitenblick: { zurueck: lernzielId, niveau } });
  }
  zeigeAufgabe(aufgabe, { ...(frei && { frei: true }), ...(heuteAlles && { heuteAlles: true }) });
}
function zeigeAufgabe(aufgabe, extra = {}) {
  // Heftcheck vor der nächsten Aufgabe, nicht mitten im Rückblick und nicht beim Nachlösen.
  if (!extra.rueckblick && !extra.heftNachloesen && !extra.einstieg && !extra.bruecke && !extra.sonderauftrag) {
    const frage = L.heftcheckFrage(z.stand, z.index);
    if (frage) return zeige({ name: 'heftcheck', frage, danach: { aufgabe, extra }, gewaehlt: null });
  }
  const offen = L.kartenZuBeginn(aufgabe); // auf F liegt der Tipp von Anfang an offen
  z.stand.aktiv = { aufgabe: aufgabe.id, seit: jetzt(), fehlversuche: 0, hilfen: offen };
  geaendert();
  zeige({ name: 'aufgabe', aufgabe, beginn: Date.now(), versuch: 0, hilfen: offen, eingaben: [], fehlvorstellungen: [], hinweis: null, ergebnis: null,
    reihenfolge: aufgabe.format === 'zuordnen' ? mische(aufgabe.paare.map((p) => p.rechts)) : null, ...extra });
}

// Version 0.66: Ein Bild gilt als hoch, wenn es nicht flach wie ein Zahlenstrahl oder ein Lineal ist. Nur hohe Bilder stehen links neben der Aufgabe.
function hohesBild(el) {
  const svg = el?.querySelector?.('svg[viewBox]');
  if (!svg) return false;
  const [, , b, hoch] = svg.getAttribute('viewBox').split(/[\s,]+/).map(Number);
  return hoch >= 150 && hoch / b >= 0.45;
}

function aufgabenAnsicht() {
  const a = z.ansicht, auf = a.aufgabe;
  const kapitelId = L.kapitelVon(auf.lernziel);
  // Klasse 6 (ADR 0037): Eine Brückenaufgabe aus der Vorstufe hat keinen Meilenstein in dieser Klasse.
  // Sie gehört dann zum Meilenstein des Lernziels, von dem die Brücke ausgeht (Wortspeicher, Merkzettel, Rückweg).
  const lernziel = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === auf.lernziel) ?? z.index.lernziel.get(auf.lernziel);
  const meilenstein = meilensteinVon(auf);
  const st = L.lernzielStand(z.stand, auf.lernziel, auf.niveau, z.index); // Fortschritt zur Krone dieser Farbe
  // Eine F-Aufgabe beim Üben am Meilenstein gehört zur Grundlagen-Schleife, außer das Ziel des Kindes ist F (ADR 0015).
  const grundlage = !a.rueckblick && !a.bruecke && !a.sonderauftrag && !a.einstieg && !a.seitenblick && auf.niveau === 'F' && z.einst.zielniveau !== 'F';
  const training = !grundlage && L.NIVEAUS.indexOf(auf.niveau) < L.NIVEAUS.indexOf(z.einst.zielniveau);
  const punkte = grundlage ? (L.inGrundlage(z.stand, auf.lernziel) ? L.grundlageRichtige(z.stand, auf.lernziel) : L.GRUNDLAGE_RICHTIGE) : st.erreicht ? 3 : st.fortschritt;
  const fertig = Boolean(a.ergebnis);
  // Sicherheitsangabe (ADR 0014): Beim ersten Versuch gibt es zwei Prüfen-Knöpfe, wenn die Lehrkraft sie eingeschaltet hat.
  const zweiKnoepfe = !fertig && a.versuch === 0 && z.einst.sicherheitsangabe && !a.einstieg;
  // Version 0.66 (ADR 0057): Ein hohes Bild steht links, Text und Antworten stehen rechts daneben. In einem schmalen Fenster bleibt alles untereinander.
  const felder = eingabefelder(auf, a, fertig);
  const text = auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, rechnungen(auf.text).map((r) => (r.fest ? h('span', { class: 'rechnung' }, r.text) : r.text)));
  const bild = auf.bild && h('div', { class: 'bildrahmen zumtext' }, aufgabenBild(auf.bild));
  // Kapitel 1: die Antworten einer Umfrage und eine Tabelle, aus denen abgelesen wird.
  const beigaben = [auf.urliste && urlisteBild(auf.urliste, fertig), auf.daten && h('div', { class: 'bildrahmen zumtext' }, datenTabelle(auf.daten))];
  const eingabeBild = felder?.matches?.('.mitbild') ? felder.querySelector(':scope > .bildrahmen, :scope > figure') : null;
  const links = [eingabeBild, bild].find(hohesBild);
  const pruefleiste = !fertig && h('div', { class: 'pruefleiste', id: 'pruefleiste' },
    zweiKnoepfe ? h('div', { class: 'sicherwahl' },
      h('button', { class: 'haupt', id: 'pruefen', type: 'submit', 'data-sicher': 'ja' }, 'Prüfen – ich bin sicher'),
      h('button', { class: 'haupt hell', id: 'pruefen-unsicher', type: 'submit', 'data-sicher': 'nein' }, 'Prüfen – ich bin unsicher'))
      : h('button', { class: 'haupt', id: 'pruefen', type: 'submit' }, a.versuch === 0 ? 'Prüfen' : 'Noch einmal prüfen'),
    // Liegen die Hilfekärtchen unter dem Fensterrand, führt dieser Knopf hin (Audit L169).
    !a.einstieg && kartenVon(auf).length > 0 && h('button', { type: 'button', class: 'schlicht zur-hilfe', id: 'zur-hilfe', hidden: true,
      onclick: () => wurzel.querySelector('.karte > .kaertchen')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }, 'Hilfekärtchen ↓'));
  const heftfeld = auf.heftaufgabe && h('p', { class: 'heftfeld', id: 'heftfeld' }, 'Ergebnis aus deinem Heft:');
  const formular = h('form', { class: 'antwort', onsubmit: (e) => { e.preventDefault(); if (!fertig) pruefe(formular, zweiKnoepfe ? e.submitter?.dataset.sicher === 'ja' : null); } },
    links ? h('div', { class: 'zweispaltig' },
      h('div', { class: 'zs-text' }, text, links !== bild && bild, beigaben),
      h('div', { class: 'zs-bild' }, links),
      h('div', { class: 'zs-antwort' }, heftfeld, felder))
      // Text und Bild stehen mit im Formular, damit die Leiste mit „Prüfen“ auch dann unten klebt, wenn die Antwortfelder erst weit unten beginnen.
      : [(text || bild || beigaben.some(Boolean)) && h('div', { class: 'vorspann' }, text, bild, beigaben), heftfeld, felder],
    pruefleiste);
  const karte = h('div', { class: `karte${links ? ' breit' : ''}` },
      h('div', { class: 'aufgabenkopf' },
        a.rueckblick && h('span', { class: 'marke rueckblickmarke' }, rueckblickNummer(a, fertig)),
        a.seitenblick && h('span', { class: 'marke seitenblickmarke', id: 'seitenblick-marke', title: 'Eine Aufgabe zu einem Lernziel, das du schon kannst. Dein Siegel behältst du in jedem Fall.' }, 'Seitenblick'),
        a.seitenblick && h('span', { class: 'seitenblick-satz', id: 'seitenblick-satz' }, seitenblickSatz(z.index.meilensteinVon.get(a.seitenblick.zurueck)?.titel)),
        a.bruecke && h('span', { class: 'marke brueckenmarke' }, brueckeNummer(a, fertig)),
        a.sonderauftrag && h('span', { class: 'marke sonderauftragmarke', id: 'sonderauftrag-marke' }, '✉ ', sonderauftragNummer(a, fertig)),
        a.einstieg ? h('span', { class: 'marke einstiegmarke' }, einstiegNummer(a, fertig))
          : grundlage ? h('span', { class: 'marke grundlagenmarke', id: 'grundlage-marke' }, 'Grundlage')
          : h('span', { class: 'kronenmarke' }, kroneBild(auf.niveau, 22), `Spiel um ${L.KRONEN[auf.niveau]}`),
        // Version 0.66 (Audit L097): Die drei Punkte stehen direkt an der Krone, zu der sie gehören.
        !a.einstieg && h('span', { class: 'punkte', title: grundlage ? `${punkte} von ${L.GRUNDLAGE_RICHTIGE} Aufgaben zur Grundlage` : `Fortschritt beim Lernziel für ${L.KRONEN[auf.niveau]}` }, [0, 1, 2].map((i) => h('i', { class: i < punkte ? 'voll' : '' }))),
        !a.einstieg && !a.seitenblick && training && h('span', { class: 'marke', title: `Unter deinem Ziel ${L.KRONEN[z.einst.zielniveau]} gibt es weniger Münzen und kein Siegel.` }, 'Training'),
        h('span', { class: 'ziel' }, lernziel.text),
        ),
      a.heuteAlles && h('p', { class: 'klein heute-geloest', id: 'heute-geloest', role: 'note' }, 'Hier hast du heute alles gelöst. Morgen zählt es wieder.'),
      // Heftaufgabe (Nils, 2026-11-25, ADR 0047): Das Band sagt vor dem Text, dass im Heft gearbeitet wird.
      auf.heftaufgabe && heftband(auf),
      formular,
      a.ueberraschung && !fertig && h('p', { class: 'hinweis ueberraschung', id: 'ueberraschung' }, a.ueberraschung),
      a.hinweis && !fertig && h('p', { class: 'hinweis', role: 'alert' }, a.hinweis),
      !fertig && !a.einstieg && kaertchen(a),
      fertig && ergebnisTafel(a, kapitelId, meilenstein));
  // Version 0.66: Die Leiste mit „Prüfen“ klebt am unteren Fensterrand. Sie bekommt dann einen Rand, und der Knopf zu den Hilfekärtchen erscheint, solange diese nicht zu sehen sind.
  if (pruefleiste && typeof IntersectionObserver !== 'undefined') {
    new IntersectionObserver(([e]) => pruefleiste.classList.toggle('klebt', e.intersectionRatio < 1 && e.boundingClientRect.top > 0), { threshold: 1 }).observe(pruefleiste);
    const stapel = karte.querySelector(':scope > .kaertchen'), knopf = pruefleiste.querySelector('#zur-hilfe');
    if (stapel && knopf) new IntersectionObserver(([e]) => { knopf.hidden = e.isIntersecting; }, { rootMargin: '0px 0px -70px 0px' }).observe(stapel);
  }
  // Worterklärung am Wort (ADR 0056). Bei den ersten Aufgaben mit unterstrichenen Wörtern sagt ein Satz, wozu die Linie da ist.
  if (!fertig) {
    z.woerter ??= wortVerzeichnis(z.pool);
    if (markiereWoerter(karte, z.woerter, wortOrt(auf)) && (a.wortHinweis || (z.stand.wortHinweise ?? 0) < WORT_HINWEISE)) {
      if (!a.wortHinweis) { a.wortHinweis = true; z.stand.wortHinweise = (z.stand.wortHinweise ?? 0) + 1; geaendert(); }
      const satz = h('p', { class: 'klein worthinweis', id: 'worthinweis' }, 'Fahre mit der Maus über ein unterstrichenes Wort. Dann siehst du die Erklärung.');
      const absatz = karte.querySelector('.aufgabentext:not(.luecken)');
      if (absatz) absatz.after(satz); else karte.querySelector('form.antwort').before(satz);
    }
  }
  return h('section', { class: 'aufgabe', 'data-aufgabe': auf.id },
    karte,
    !fertig && !a.einstieg && hilfen(a, meilenstein, lernziel),
    // Klein unten links, damit die Lehrkraft eine fehlerhafte Aufgabe melden kann (ADR 0025).
    h('p', { class: 'kennung', id: 'kennung', title: 'Kennung dieser Aufgabe' }, auf.id));
}

// Version 0.66 (Audit L071, L141): Zerlegt einen Lückentext in Fließtext und Rechnungen. Eine Rechnung ist eine Folge aus Zahlen, Lücken,
// Rechenzeichen und Einheiten mit mindestens einem Rechenzeichen. Sie bleibt beim Umbruch zusammen, solange sie kurz ist.
const WORT_ZAHL = /^\(?[−-]?(?:\d|\{\{\w+\}\})(?:[\d\u202f.,\u2044]|\{\{\w+\}\})*\)?[%°²³]?[.,;:!?]?$/;
const WORT_ZEICHEN = /^[=+−·:<>≈▢☐]$/;
const WORT_EINHEIT = /^(?:mm|cm|dm|m|km|g|kg|t|ml|l|€|ct|min|h|s|°C|[mcdk]?m[²³])[.,;:!?]?$/;
const RECHNUNG_HOECHSTENS = 30; // Zeichen; eine Lücke zählt wie sieben
export function rechnungen(text) {
  const teile = [];
  const fliess = (t) => { if (teile.length && !teile.at(-1).fest) teile.at(-1).text += t; else teile.push({ text: t, fest: false }); };
  const laenge = (w) => w.reduce((n, x) => n + x.replace(/\{\{\w+\}\}/g, '1234567').length + 1, 0);
  const schliesse = (lauf, davor) => {
    if (!lauf.length) return;
    const istRechnung = lauf.length >= 3 && lauf.some((w) => WORT_ZEICHEN.test(w));
    // Zu lang: an jedem Gleichheitszeichen teilen, damit wenigstens jede Seite zusammenbleibt.
    const stuecke = !istRechnung ? [lauf] : laenge(lauf) <= RECHNUNG_HOECHSTENS ? [lauf] : lauf.reduce((a, w) => { if (w === '=' && a.at(-1).length) a.push([]); a.at(-1).push(w); return a; }, [[]]);
    stuecke.forEach((st, i) => {
      const vor = i === 0 ? davor : ' ';
      if (istRechnung && st.length >= 2 && laenge(st) <= RECHNUNG_HOECHSTENS) { if (vor) fliess(vor); teile.push({ text: st.join(' '), fest: true }); } else fliess(vor + st.join(' '));
    });
  };
  let lauf = [], davor = '';
  String(text).split(' ').forEach((wort, i) => {
    const zwischen = i === 0 ? '' : ' ';
    const passt = WORT_ZAHL.test(wort) || WORT_ZEICHEN.test(wort) || (lauf.length > 0 && WORT_EINHEIT.test(wort));
    if (!passt) { schliesse(lauf, davor); lauf = []; fliess(zwischen + wort); return; }
    if (!lauf.length) davor = zwischen;
    lauf.push(wort);
    if (/[.,;!?]$/.test(wort)) { schliesse(lauf, davor); lauf = []; }
  });
  schliesse(lauf, davor);
  return teile;
}
// Version 0.66 (Audit L016, L098): Ein Zahlenfeld in einem Lückentext wächst mit der Eingabe, damit das Kind seine Zahl ganz sieht.
function passeBreiteAn(feld) {
  const n = feld.value.length;
  feld.style.minWidth = n > 3 ? `${Math.min(n + 2.5, 18)}ch` : '';
}
// Auch für den Bilderbogen (tools/bilderbogen.mjs) ausgeführt.
export function eingabefelder(auf, a, gesperrt) {
  // Klasse 7 Kapitel 1 (ADR 0043, 0051): Jedes Zahlenfeld hat den Knopf „±“, und die Tastatur am Handy zeigt das Komma.
  const vorzeichen = mitVorzeichen(auf);
  const zahlfeld = (name, einheit, wert, ohneKnopf = false) => {
    const feld = h('input', { name, type: 'text', inputMode: abKlasse7(auf) || auf.lernziel?.startsWith('5.9.3') || /^6\.[457]\./.test(auf.lernziel ?? '') ? 'decimal' : 'numeric', autocomplete: 'off', size: auf.lang ? 18 : 9, class: auf.lang ? 'lang' : null, disabled: gesperrt, value: wert ?? '', 'aria-label': 'Deine Antwort',
      oninput: (e) => { gliedereEingabe(e.target); passeBreiteAn(e.target); } });
    passeBreiteAn(feld);
    const knopf = vorzeichen && !ohneKnopf;
    return h('span', { class: `zahlfeld${knopf ? ' mit-vorzeichen' : ''}` }, knopf && vorzeichenKnopf(feld, gesperrt), feld, einheit && h('span', { class: 'einheit' }, einheit));
  };
  // Ziffernfeld: genau eine Ziffer, ohne Abstand mitten in einer Zahl (Ziffernrätsel) oder in einem Rechenraster.
  const ziffernfeld = (name, wert, stellen = 1) => h('input', { class: 'ziffer', name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: stellen, maxLength: stellen, disabled: gesperrt, value: wert ?? '', 'aria-label': 'Fehlende Ziffer' });
  const letzte = a.eingaben.at(-1);
  switch (auf.format) {
    case 'zahl': return zahlfeld('zahl', auf.einheit, letzte);
    case 'auswahl': return h('div', { class: 'optionen' },
      auf.mehrfach && h('p', { class: 'klein' }, 'Kreuze alle passenden Antworten an.'),
      // Klasse 6 Kapitel 3 (ADR 0045): Bildkarten. Jede Antwort ist ein kleines Bild mit dem Buchstaben A, B, C …, am Handy zwei je Reihe.
      auf.optionen.some((o) => o.bild) ? h('div', { class: 'bildkarten' }, auf.optionen.map((o) => h('label', { class: 'option bildkarte' },
        h('input', { type: auf.mehrfach ? 'checkbox' : 'radio', name: 'option', value: o.text, disabled: gesperrt, checked: Boolean(letzte?.includes(o.text)) }),
        h('span', { class: 'kartenname' }, o.text), h('span', { class: 'kartenbild' }, o.bild && kartenBild(o.bild)))))
        : auf.optionen.map((o) => h('label', { class: 'option' },
          h('input', { type: auf.mehrfach ? 'checkbox' : 'radio', name: 'option', value: o.text, disabled: gesperrt, checked: Boolean(letzte?.includes(o.text)) }), h('span', {}, o.text))));
    case 'luecken': {
      // Version 0.69 (ADR 0057, Audit L135): Steht die Lücke ohne Klammer direkt hinter „+“ oder „−“, gehört dorthin eine Zahl ohne Vorzeichen.
      // Der Knopf „±“ fehlt dort, damit nicht zwei Zeichen hintereinander stehen. Eine negative Zahl stünde in Klammern.
      const nachZeichen = new Set([...auf.text.matchAll(/[+−] \{\{(\w+)\}\}/g)].map((m) => m[1]));
      const luecke = (name) => (auf.ziffernfelder ? ziffernfeld(`luecke-${name}`, letzte?.[name]) : zahlfeld(`luecke-${name}`, null, letzte?.[name], nachZeichen.has(name)));
      const einfach = (text) => text.split(/(\{\{\w+\}\})/).map((stueck) => { const m = stueck.match(/^\{\{(\w+)\}\}$/); return m ? luecke(m[1]) : stueck; });
      // Klasse 7 (ADR 0043), seit Version 0.66 in allen Klassen: Rechenzeichen, Klammer, Lücke, Einheit und Satzzeichen bleiben beim Umbruch zusammen.
      // Eine Zeile endet so nie mit „=“ oder „(“ und beginnt nie mit einem Punkt (Audit L051).
      const mitLuecken = (text) => text.split(/((?:[=+−·:<>] )?\(?\{\{\w+\}\}\)?(?: (?:€|°C|°F|K|Grad|mm|cm|dm|m|km|g|kg|t|ml|l|min|h|s)(?![\wäöü]))?[.,;!?]?)/).map((stueck, i) => (i % 2 ? h('span', { class: 'lueckensatz' }, einfach(stueck)) : stueck));
      // Klasse 6 (ADR 0037): Steht eine Lücke im Zähler oder im Nenner, wird der Bruch gestapelt gezeichnet, mit dem Feld an seinem Platz.
      const BRUCH = /((?:\d+\u202f)?(?:\{\{\w+\}\}|\d+)\u2044(?:\{\{\w+\}\}|\d+))/;
      const setze = (text) => text.split(BRUCH).map((stueck, i) => {
        if (i % 2 === 0 || !stueck.includes('{{')) return mitLuecken(stueck);
        const [, ganze, oben, unten] = stueck.match(/^(?:(\d+)\u202f)?(.+)\u2044(.+)$/);
        const bruch = h('span', { class: 'bruch lueckenbruch' }, h('span', { class: 'bz' }, mitLuecken(oben)), h('span', { class: 'bn' }, mitLuecken(unten)));
        return ganze ? h('span', { class: 'gemischt' }, ganze, bruch) : bruch;
      });
      // Version 0.66 (Audit L071, L141): Eine kurze Rechnung bleibt als Ganzes in einer Zeile.
      return h('p', { class: 'aufgabentext luecken' }, rechnungen(auf.text).map((r) => (r.fest ? h('span', { class: 'rechnung' }, setze(r.text)) : setze(r.text))));
    }
    // Version 0.66 (ADR 0057): Die Möglichkeiten stehen als sichtbare Liste über den Auswahlfeldern.
    case 'zuordnen': return h('div', { class: 'zuordnenfeld' }, h('p', { class: 'klein zuordnen-kopf' }, 'Diese Möglichkeiten gibt es:'),
      h('ul', { class: 'zuordnen-liste', id: 'zuordnen-liste' }, a.reihenfolge.map((r) => h('li', {}, r))), h('div', { class: 'zuordnen' }, auf.paare.map((p) => h('label', {}, h('b', {}, p.links),
      h('select', { name: `paar-${p.links}`, disabled: gesperrt }, h('option', { value: '' }, 'bitte wählen'),
        a.reihenfolge.map((r) => h('option', { value: r, selected: letzte?.[p.links] === r }, r)))))));
    // Kapitel 6: Ein Teil kann auch eine Auswahl sein (wichtige Angaben, passende Rechnung, Antwortsatz).
    case 'sachaufgabe': return h('ol', { class: 'teile' }, auf.teile.map((t, i) => h('li', { class: t.optionen ? 'teil-auswahl' : null }, h('span', {}, t.text), t.optionen
      ? h('div', { class: 'optionen' }, t.optionen.map((o) => h('label', { class: 'option' },
        h('input', { type: t.mehrfach ? 'checkbox' : 'radio', name: `teil-${i}`, value: o.text, disabled: gesperrt, checked: Boolean(Array.isArray(letzte?.[i]) && letzte[i].includes(o.text)) }), h('span', {}, o.text))))
      : zahlfeld(`teil-${i}`, t.einheit, letzte?.[i]))));
    case 'groesse': return groesseEingabe(auf, letzte, gesperrt);
    case 'diagramm': return h('div', { class: 'mitbild' }, h('div', { class: 'bildrahmen' }, saeulendiagramm(auf.diagramm)),
      h('ol', { class: `teile${auf.teile.length === 1 ? ' einzeln' : ''}` }, auf.teile.map((t, i) => h('li', {}, h('span', {}, t.text), zahlfeld(`teil-${i}`, t.einheit, letzte?.[i])))));
    case 'zahlenstrahl': {
      if (auf.eingabe !== 'markieren') return h('div', { class: 'mitbild' }, h('div', { class: 'bildrahmen' }, zahlenstrahl(auf.strahl)), zahlfeld('zahl', auf.einheit, letzte));
      // Antippen: Der gewählte Wert steht in einem versteckten Feld, das Bild wird an Ort und Stelle neu gezeichnet.
      const wert = h('input', { type: 'hidden', name: 'strahl', value: letzte ?? '' });
      const rahmen = h('div', { class: 'bildrahmen' });
      const zeichne = () => rahmen.replaceChildren(zahlenstrahl(auf.strahl, { gewaehlt: wert.value === '' ? null : Number(wert.value),
        beiWahl: gesperrt ? null : (w) => { wert.value = String(w); zeichne(); rahmen.querySelector('.gewaehlt')?.focus(); } }));
      zeichne();
      return h('div', { class: 'mitbild' }, rahmen, wert, !gesperrt && h('p', { class: 'klein' }, 'Tippe auf den passenden Teilstrich.'));
    }
    case 'tabelle': {
      const t = auf.tabelle;
      const feld = (c) => zahlfeld(`luecke-${c.luecke}`, null, letzte?.[c.luecke]);
      // Klasse 6, Kapitel 7 (ADR 0050): Wertetabelle (waagrecht, zwei Zeilen) und Dreisatztabelle mit Rechenpfeilen.
      if (t.art === 'werte' || t.art === 'dreisatz') {
        const f = (name, einheit, klasse) => { const e = zahlfeld(`luecke-${name}`, einheit, letzte?.[name]); if (klasse) e.classList.add(klasse); return e; };
        return h('div', { class: 'bildrahmen' }, t.art === 'werte' ? werteTabelle(t, f) : dreisatzTabelle(t, f));
      }
      // Zahlenmauer: Steine in Reihen, in die leeren Steine wird direkt eingetragen.
      if (t.art === 'mauer') return h('div', { class: 'bildrahmen' }, h('div', { class: `mauer${t.rechenart === '·' ? ' malmauer' : ''}`, role: 'group', 'aria-label': t.rechenart === '·' ? 'Mal-Mauer' : 'Zahlenmauer' },
        t.zeilen.map((reihe) => h('div', { class: 'mauerreihe' }, reihe.map((c) => h('span', { class: `stein${typeof c === 'object' ? ' offen' : ''}` }, typeof c === 'object' ? feld(c) : c))))));
      // Malkreuz: Zerlegung oben und links, Teilprodukte in den Feldern, darunter die Summe.
      if (t.art === 'malkreuz') return h('div', { class: 'bildrahmen' }, h('table', { class: 'aufgabentabelle malkreuz' },
        h('thead', {}, h('tr', {}, t.kopf.map((k, i) => h('th', { scope: 'col', class: i === 0 ? 'zeichen' : '' }, k)))),
        h('tbody', {}, t.zeilen.map((zeile) => h('tr', {}, zeile.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', {}, typeof c === 'object' ? feld(c) : c))))))),
        h('p', { class: 'malkreuzsumme' }, `${t.rechnung.faktoren[0]} · ${t.rechnung.faktoren[1]} = `, feld({ luecke: t.rechnung.summe })));
      // Rechenraster beim Multiplizieren: wie im Heft, ohne Kopfzeile; Striche unter der Aufgabe und über dem Ergebnis.
      // Über dem Ergebnis steht eine Zeile kleiner Übertragsfelder, je eine über jeder Ergebnisziffer außer den Einern.
      // Sie sind nur Notizhilfe: Sie gehören nicht zu den Lücken und werden nicht bewertet.
      // Die Zeilenklassen beginnen mit `rz-`, damit sie nicht mit Seitenbausteinen wie .aufgabe oder .ergebnis zusammenstoßen.
      if (t.art === 'raster' && t.rechnung?.zeichen === '·') {
        const ergebnis = t.zeilen.at(-1), anfang = ergebnis.findIndex((c) => typeof c === 'object');
        const uebertrag = h('tr', { class: 'rz-uebertrag' }, ergebnis.map((c, i) => h('td', {}, i >= anfang && i < ergebnis.length - 1
          ? h('input', { class: 'uebertrag', name: `uebertrag-${i}`, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 1, maxLength: 1, disabled: gesperrt, 'aria-label': 'Übertrag, wird nicht bewertet' })
          : null)));
        const zeilen = t.zeilen.map((zeile, r) => h('tr', { class: r === 0 ? 'rz-aufgabe' : r === t.zeilen.length - 1 ? 'rz-ergebnis' : 'rz-teil' }, zeile.map((c) => h('td', {},
          typeof c === 'object' ? ziffernfeld(`luecke-${c.luecke}`, letzte?.[c.luecke]) : c))));
        zeilen.splice(zeilen.length - 1, 0, uebertrag);
        return h('div', { class: 'bildrahmen' }, h('table', { class: `aufgabentabelle raster malraster${t.zeilen.length === 2 ? ' ohne-teile' : ''}` }, h('tbody', {}, zeilen)),
          // Klasse 6, Kapitel 5 (ADR 0048): Im Raster wird ohne Komma gerechnet, darunter setzt das Kind das Komma.
          t.ablesen && h('p', { class: 'malkreuzsumme tafel-ablesen' }, `${t.ablesen.text} `, zahlfeld(`luecke-${t.ablesen.luecke}`, null, letzte?.[t.ablesen.luecke])),
          !gesperrt && h('p', { class: 'klein rasterhinweis' }, 'In die kleinen Felder kannst du Überträge schreiben. Sie werden nicht bewertet.'));
      }
      // Klasse 6, Kapitel 5 (ADR 0048): Rechenraster mit Kommaspalte, Komma unter Komma. Endnullen sind auf F grau vorgezeichnet,
      // auf G ergänzt das Kind sie in kleinen Notizfeldern. Über dem Ergebnis stehen Übertragsfelder. Notiz- und Übertragsfelder werden nicht bewertet.
      if (t.art === 'raster' && t.komma != null) {
        const notiz = (name, label) => h('input', { class: 'uebertrag', name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 1, maxLength: 1, disabled: gesperrt, 'aria-label': label });
        const zelle = (c, r, i) => (c === ',' ? h('td', { class: 'kommaspalte' }, ',') : typeof c !== 'object' ? h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, c)
          : c.endnull ? h('td', { class: 'endnull', title: 'Endnull' }, '0') : c.notiz ? h('td', {}, notiz(`notiz-${r}-${i}`, 'Endnull, wird nicht bewertet'))
          : h('td', {}, ziffernfeld(`luecke-${c.luecke}`, letzte?.[c.luecke])));
        const ergebnis = t.zeilen.at(-1);
        const uebertrag = h('tr', { class: 'rz-uebertrag' }, ergebnis.map((c, i) => h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row', class: 'klein' } : {}, i === 0 ? 'Übertrag' : c === ',' || i === ergebnis.length - 1 ? null : notiz(`uebertrag-${i}`, 'Übertrag, wird nicht bewertet'))));
        const zeilen = t.zeilen.map((zeile, r) => h('tr', { class: r === t.zeilen.length - 1 ? 'rz-ergebnis' : r === t.zeilen.length - 2 ? 'rz-letzte' : null }, zeile.map((c, i) => zelle(c, r, i))));
        zeilen.splice(zeilen.length - 1, 0, uebertrag);
        return h('div', { class: 'bildrahmen' }, h('table', { class: 'aufgabentabelle raster malraster kommaraster' },
          h('thead', {}, h('tr', {}, t.kopf.map((k) => h('th', { scope: 'col', class: k === ',' ? 'kommaspalte' : null }, k)))), h('tbody', {}, zeilen)),
          !gesperrt && h('p', { class: 'klein rasterhinweis' }, t.zeilen.flat().some((c) => c?.notiz) ? 'Ergänze in den kleinen Feldern die Endnullen. Auch Überträge kannst du dort notieren. Sie werden nicht bewertet.' : 'In die kleinen Felder kannst du Überträge schreiben. Sie werden nicht bewertet.'));
      }
      // Stellenwerttafel (Kapitel 2): ein Feld je Ziffer, bei großen Zahlen mit den Dreierblöcken als zweiter Kopfzeile.
      if (t.art === 'stellentafel' || t.art === 'einheitentafel') {
        let ende = 0;
        const enden = new Set((t.gruppen ?? []).map((g) => (ende += g.spalten) - 1).slice(0, -1));
        const rand = (i) => (t.komma === i ? 'blockende kommaspalte' : enden.has(i) ? 'blockende' : null);
        return h('div', { class: 'bildrahmen' }, h('table', { class: `stellentafel eingabe${t.art === 'einheitentafel' ? ' einheitentafel' : ''}` },
          h('thead', {}, t.gruppen && h('tr', { class: 'gruppen' }, t.gruppen.map((g) => h('th', { colSpan: g.spalten, scope: 'colgroup' }, g.name))),
            t.kopf.some(Boolean) && h('tr', {}, t.kopf.map((k, i) => h('th', { scope: 'col', class: rand(i) }, k)))),
          h('tbody', {}, t.zeilen.map((zeile) => h('tr', {}, zeile.map((c, i) => h('td', { class: rand(i) }, typeof c === 'object' ? ziffernfeld(`luecke-${c.luecke}`, letzte?.[c.luecke]) : c)))))),
          // Kapitel 6: Unter der Einheitentafel wird die Größe in einer Einheit abgelesen.
          t.ablesen && h('p', { class: 'malkreuzsumme tafel-ablesen' }, `${t.ablesen.text} `, zahlfeld(`luecke-${t.ablesen.luecke}`, t.ablesen.einheit, letzte?.[t.ablesen.luecke])));
      }
      return h('div', { class: 'bildrahmen' }, h('table', { class: `aufgabentabelle${auf.tabelle.art === 'raster' ? ' raster' : ''}` },
      h('thead', {}, h('tr', {}, auf.tabelle.kopf.map((k) => h('th', { scope: 'col' }, k)))),
      h('tbody', {}, auf.tabelle.zeilen.map((zeile) => h('tr', {}, zeile.map((zelle, i) => (typeof zelle === 'object'
        ? h('td', {}, auf.tabelle.art === 'raster' ? ziffernfeld(`luecke-${zelle.luecke}`, letzte?.[zelle.luecke], String(auf.luecken[zelle.luecke].loesung).length > 1 ? 2 : 1) : zahlfeld(`luecke-${zelle.luecke}`, null, letzte?.[zelle.luecke]))
        : h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, zelle))))))));
    }
    case 'strichliste': return strichlisteEingabe(auf, letzte, gesperrt);
    case 'zeichnen': return zeichnenEingabe(auf, letzte, gesperrt);
    case 'ordnen': return ordnenEingabe(auf, letzte, gesperrt);
    case 'zeichen': return zeichenEingabe(auf, letzte, gesperrt);
    case 'schaetzen': return zahlfeld('zahl', auf.einheit, letzte);
    case 'gitter': return gitterEingabe(auf, letzte, gesperrt);
    case 'winkel': return winkelEingabe(auf, letzte, gesperrt);
    case 'bruch': return bruchEingabe(auf, letzte, gesperrt, L.mitGanzenFeld(z.index, auf));
    case 'faerben': return faerbenEingabe(auf, letzte, gesperrt);
    // Klasse 6, Kapitel 8 (ADR 0058): Streifendiagramm durch Färben von Kästchen erstellen.
    case 'streifenfaerben': return streifenFaerbenEingabe(auf, letzte, gesperrt);
    case 'periode': return periodeEingabe(auf, letzte, gesperrt);
    default: return null;
  }
}
function liesEingabe(auf, formular) {
  const feld = (name) => formular.elements[name]?.value.trim() ?? '';
  switch (auf.format) {
    case 'zahl': { const v = feld('zahl'); return { eingabe: v, leer: !v }; }
    case 'zahlenstrahl': { const v = feld(auf.eingabe === 'markieren' ? 'strahl' : 'zahl'); return { eingabe: v, leer: !v }; }
    case 'tabelle': { const v = Object.fromEntries(Object.keys(auf.luecken).map((n) => [n, feld(`luecke-${n}`)])); return { eingabe: v, leer: Object.values(v).some((x) => !x) }; }
    case 'diagramm': { const v = auf.teile.map((_, i) => feld(`teil-${i}`)); return { eingabe: v, leer: v.some((x) => !x) }; }
    case 'auswahl': { const v = [...formular.querySelectorAll('input[name=option]:checked')].map((i) => i.value); return { eingabe: v, leer: v.length === 0 }; }
    case 'luecken': { const v = Object.fromEntries(Object.keys(auf.luecken).map((n) => [n, feld(`luecke-${n}`)])); return { eingabe: v, leer: Object.values(v).some((x) => !x) }; }
    case 'zuordnen': { const v = Object.fromEntries(auf.paare.map((p) => [p.links, feld(`paar-${p.links}`)])); return { eingabe: v, leer: Object.values(v).some((x) => !x) }; }
    case 'sachaufgabe': { const v = auf.teile.map((t, i) => (t.optionen ? [...formular.querySelectorAll(`input[name="teil-${i}"]:checked`)].map((x) => x.value) : feld(`teil-${i}`))); return { eingabe: v, leer: v.some((x) => !x || x.length === 0) }; }
    case 'groesse': return liesGroesse(auf, formular);
    // Strichliste: je Zeile das Strichmuster. Leer ist sie, solange noch kein neuer Strich gesetzt ist.
    case 'strichliste': { const v = auf.zeilen.map((_, i) => feld(`strich-${i}`)); return { eingabe: v, leer: v.every((x, i) => x === buendle(auf.zeilen[i].start ?? 0)) }; }
    // Säulen zeichnen: je offene Säule die Höhe. Eine Säule auf 0 ist noch nicht gezeichnet.
    case 'zeichnen': { const v = auf.diagramm.saeulen.map((sa, i) => (sa.offen ? Number(feld(`saeule-${i}`)) : null)); return { eingabe: v, leer: v.some((x, i) => auf.diagramm.saeulen[i].offen && !(x > 0)) }; }
    // Ordnen: Leer ist die Eingabe, solange noch keine Karte bewegt wurde.
    case 'ordnen': { const v = liesOrdnung(formular); return { eingabe: v, leer: formular.elements.ordnung?.dataset.bewegt !== '1' }; }
    case 'zeichen': { const v = feld('zeichen'); return { eingabe: v, leer: !v }; }
    case 'schaetzen': { const v = feld('zahl'); return { eingabe: v, leer: !v }; }
    // Gitterzeichnen: Es fehlt etwas, solange nicht alle Punkte gesetzt sind (bei Kästchen: solange keines gefärbt ist).
    // Winkeldrehen (Kapitel 7): leer, solange der zweite Schenkel noch nicht bewegt wurde.
    case 'winkel': { const v = feld('winkel'); return { eingabe: v, leer: v === '' }; }
    // Kapitel 9: Bruch aus Zähler und Nenner; beim Färben fehlt etwas, solange kein Teil gefärbt ist.
    case 'bruch': return liesBruch(auf, formular);
    case 'faerben': { const v = feld('faerben'); return { eingabe: v, leer: v === '' }; }
    case 'streifenfaerben': { const v = feld('streifenfaerben'); return { eingabe: v, leer: !/\d/.test(v) }; }
    case 'periode': return liesPeriode(formular);
    case 'gitter': { const frage = auf.nachfrage ? formular.querySelector('input[name=nachfrage]:checked')?.value ?? null : null;
      const v = `${feld('gitter')}${frage != null ? ` [${frage}]` : ''}`, n = (feld('gitter').match(/\(/g) ?? []).length; return { eingabe: v, leer: (auf.nachfrage && frage == null) || n < (auf.eingabe === 'linie' || auf.eingabe === 'kreis' ? 2 : auf.eingabe === 'zellen' || auf.offen ? 1 : auf.loesung.length) }; }
    default: return { eingabe: null, leer: true };
  }
}

function pruefe(formular, sicher = null) {
  const a = z.ansicht, auf = a.aufgabe;
  const { eingabe, leer } = liesEingabe(auf, formular);
  if (leer) { a.hinweis = ['gitter', 'zeichnen', 'winkel', 'faerben', 'streifenfaerben', 'zahlenstrahl'].includes(auf.format) ? 'Da fehlt noch etwas. Tippe oder zeichne erst deine Lösung ins Bild, bevor du prüfst.' : auf.format === 'auswahl' ? 'Da fehlt noch etwas. Kreuze erst eine Antwort an, bevor du prüfst.' : 'Da fehlt noch etwas. Fülle alles aus, bevor du prüfst.'; return maleMitEntwurf(eingabe); }
  if (a.versuch === 0 && sicher != null) a.sicher = sicher;
  const ergebnis = L.pruefeAntwort(auf, eingabe);
  // Klasse 6 (ADR 0037): Der Wert stimmt, aber der Bruch ist noch nicht gekürzt oder keine gemischte Zahl. Das ist „fast richtig“ und kostet keinen Versuch.
  if (ergebnis.nachbessern && (a.nachbesserungen ?? 0) < NACHBESSERN_HOECHSTENS) {
    a.nachbesserungen = (a.nachbesserungen ?? 0) + 1;
    a.hinweis = ergebnis.nachbessern === 'endnull' ? endnullHinweis(ergebnis.stellen) : NACHBESSERN[ergebnis.nachbessern];
    return maleMitEntwurf(eingabe);
  }
  a.versuch++;
  a.eingaben.push(eingabe);
  if (ergebnis.fehlvorstellung) a.fehlvorstellungen.push(ergebnis.fehlvorstellung);
  // Einstiegscheck: ein Versuch, keine Münzen, zählt für kein Lernziel.
  if (a.einstieg) {
    const einstieg = L.trageEinstiegEin(z.stand, a.einstieg, auf, { geloest: ergebnis.richtig, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen, dauer: Math.round((Date.now() - a.beginn) / 1000) }, jetzt());
    z.stand.aktiv = null;
    a.ergebnis = { richtig: ergebnis.richtig, einstieg };
    geaendert(); z.dienst.sofort();
    male();
    return zeigeRueckmeldung();
  }
  if (!ergebnis.richtig && a.versuch < 2) {
    // Version 0.65: Eine Aufgabe kann zu einer Fehlvorstellung einen eigenen Hinweis tragen (`hinweise`), wenn der allgemeine nicht passt.
    const gezielt = ergebnis.fehlvorstellung && (auf.hinweise?.[ergebnis.fehlvorstellung] ?? z.pool.fehlvorstellungen[ergebnis.fehlvorstellung]?.hinweis);
    // Nach dem ersten Fehlversuch geht der Tipp von selbst auf. Er kostet nichts (ADR 0010). Auf E bleibt er zu (ADR 0015).
    const tippNeu = a.hilfen === 0 && L.tippVonSelbst(auf);
    if (tippNeu) a.hilfen = 1;
    a.hinweis = `Das stimmt noch nicht. ${gezielt || L.allgemeinerHinweis(auf)}${tippNeu ? ' Unten liegt jetzt ein Tipp für dich.' : ''} Du hast noch einen Versuch, und er kostet dich nichts.`;
    // Sicher, aber falsch: Hier lohnt genaues Hinschauen besonders (Hyperkorrektur, ADR 0014).
    if (a.sicher === true) {
      const typisch = ergebnis.fehlvorstellung && z.pool.fehlvorstellungen[ergebnis.fehlvorstellung]?.beschreibung;
      a.ueberraschung = `Überraschung! Du warst dir sicher, aber das stimmt noch nicht. Schau genau hin.${typisch ? ` Typischer Fehler: ${typisch}` : ''}`;
    }
    if (z.stand.aktiv) { z.stand.aktiv.fehlversuche = a.versuch; z.stand.aktiv.hilfen = a.hilfen; geaendert(); }
    male();
    return zeigeRueckmeldung();
  }
  const buchung = L.verbuche(z.stand, auf, { geloest: ergebnis.richtig, versuche: a.versuch, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen,
    hilfen: a.hilfen, karten: kartenVon(auf).slice(0, a.hilfen), dauer: Math.round((Date.now() - a.beginn) / 1000), ...(a.sicher != null && { sicher: a.sicher }) },
  z.einst.zielniveau, jetzt(), z.index, { rueckblick: Boolean(a.rueckblick), bruecke: Boolean(a.bruecke), seitenblick: Boolean(a.seitenblick), sonderauftrag: a.sonderauftrag ?? null, nachloesen: Boolean(a.heftNachloesen) });
  if (a.rueckblick) buchung.rueckblick = L.trageRueckblickEin(z.stand, auf, ergebnis.richtig, jetzt());
  if (a.bruecke) buchung.bruecke = L.trageBrueckeEin(z.stand, auf, ergebnis.richtig, jetzt());
  if (a.sonderauftrag) buchung.sonderauftrag = L.trageSonderauftragEin(z.stand, z.einst.sonderauftrag, auf, ergebnis.richtig, jetzt());
  if (zaehltFuerWegstueck(a)) buchung.wegstueck = L.trageWegstueckEin(z.stand, auf, { richtig: ergebnis.richtig, muenzen: buchung.muenzen, seitenblick: Boolean(a.seitenblick) }, jetzt());
  // „Du kannst mehr, als du denkst“ (ADR 0017): nach „unsicher“ und richtig, höchstens einmal je Wegstück.
  if (zaehltFuerWegstueck(a)) buchung.mut = L.mutSatzFaellig(z.stand);
  // Feedbackfrage (ADR 0042): Rückblick und Einstiegscheck zählen nicht.
  if (!a.rueckblick && !a.einstieg && !a.heftNachloesen) L.zaehleFuerFeedback(z.stand, z.einst.feedback);
  if (ergebnis.richtig && z.einst.ton) klinge(buchung.wegstueck?.fertig || buchung.neuesLernziel ? 'gross' : 'klein');
  buchung.anspruchFehlt = !buchung.neuesLernziel && L.lernzielStand(z.stand, auf.lernziel, z.einst.zielniveau, z.index).anspruchFehlt;
  z.stand.aktiv = null;
  a.ergebnis = { ...buchung, richtig: ergebnis.richtig };
  a.seit = Date.now();
  if (z.probe) window.parent?.postMessage({ mkProbeErgebnis: { kennung: z.probe, richtig: ergebnis.richtig } }, '*');
  geaendert();
  z.dienst.sofort();
  male();
  zeigeRueckmeldung();
}
// Unvollständige Eingabe: Hinweis zeigen, ohne schon Getipptes zu verlieren.
function maleMitEntwurf(eingabe) {
  const a = z.ansicht;
  a.eingaben.push(eingabe); male(); a.eingaben.pop();
  zeigeRueckmeldung();
}
// Version 0.66: Weil „Prüfen“ jetzt immer zu sehen ist, kann die Rückmeldung unter dem Fensterrand liegen. Sie wird in den Blick geholt.
function zeigeRueckmeldung() {
  const el = wurzel.querySelector('.karte > .ergebnis') ?? wurzel.querySelector('.karte > .hinweis[role=alert]');
  if (!el?.scrollIntoView) return;
  const r = el.getBoundingClientRect();
  if (r.top >= 0 && r.bottom <= window.innerHeight - 70) return;
  el.scrollIntoView({ block: r.height > window.innerHeight - 90 ? 'start' : 'nearest' });
}

// Version 0.65: Der Titel steht in Anführungszeichen hinter dem Doppelpunkt, damit kein Fall gebeugt werden muss („mit Brüche“).
// Version 0.67 (Audit L088): Der Satz sagt, was ein Seitenblick ist und wo es danach weitergeht.
export const seitenblickSatz = (titel) => (titel ? `Eine Aufgabe zu einem Lernziel, das du schon kannst. Danach geht es hier weiter: „${titel.replace(/\.$/, '')}“.` : 'Eine Aufgabe zu einem Lernziel, das du schon kannst. Danach geht es bei deinem Meilenstein weiter.');
function loesungstext(auf) {
  // Version 0.65: Das Gradzeichen steht ohne Lücke an der Zahl („36°“), wie in den Aufgaben.
  const zahl = (t) => `${gliedere(t.loesung)}${t.einheit ? `${t.einheit === '°' ? '' : ' '}${t.einheit}` : ''}`;
  // Version 0.65: Fragt die Aufgabe nach „ungefähr“ und hat einen Bereich, steht der Bereich bei der Lösung.
  if (auf.format === 'zahl' && auf.toleranz && /ungefähr/.test(auf.text ?? '')) return `ungefähr ${zahl(auf)} (richtig ist alles von ${gliedere(auf.loesung - auf.toleranz)} bis ${gliedere(auf.loesung + auf.toleranz)})`;
  switch (auf.format) {
    case 'zahlenstrahl': {
      // Kapitel 9: Am Strahl mit Teiler ist die Lösung die Nummer des Teilstrichs. Gezeigt wird die Zahl, die dort steht.
      const T = auf.strahl?.teiler ?? 1;
      if (T === 1 || typeof auf.loesung !== 'number') return zahl(auf);
      // Klasse 7 (ADR 0043): Links von der Null steht das Minus vor der Zahl, gerechnet wird mit dem Abstand zur Null.
      const minus = auf.loesung < 0 ? '−' : '', n = Math.abs(auf.loesung);
      if (!/^10*$/.test(String(T))) return minus + (n % T === 0 ? String(n / T) : `${n}\u2044${T}`);
      const nach = String(n % T).padStart(String(T).length - 1, '0').replace(/0+$/, '');
      return `${minus}${Math.floor(n / T)}${nach ? `,${nach}` : ''}`;
    }
    case 'zahl': return zahl(auf);
    case 'ordnen': return auf.loesung.join(', ');
    case 'zeichen': return zahl(auf);
    case 'schaetzen': return `ungefähr ${zahl(auf)} (richtig ist alles von ${gliedere(auf.bereich[0])} bis ${gliedere(auf.bereich[1])})`;
    case 'diagramm': return auf.teile.length === 1 ? zahl(auf.teile[0]) : auf.teile.map((t, i) => `${'abcdef'[i]}) ${zahl(t)}`).join('  ');
    case 'tabelle': if (auf.tabelle.art === 'stellentafel') return 'siehe Tafel';
      if (auf.tabelle.art === 'werte' || auf.tabelle.art === 'dreisatz') return 'siehe Tabelle';
      // Klasse 6, Kapitel 5 (ADR 0048): Rechenraster mit Komma nennen die ganze Rechnung.
      if (auf.tabelle.art === 'raster' && auf.tabelle.komma != null) { const r = auf.tabelle.rechnung; return `${r.zahlen.join(` ${r.zeichen} `)} = ${r.ergebnis}`; }
      if (auf.tabelle.art === 'raster' && auf.tabelle.ablesen) { const r = auf.tabelle.rechnung; return `${r.zahlen[0]} · ${r.zahlen[1]} = ${r.ergebnis}, also ${auf.tabelle.ablesen.text} ${auf.luecken[auf.tabelle.ablesen.luecke].loesung}`; }
      if (auf.tabelle.art === 'einheitentafel') return auf.tabelle.ablesen ? `${auf.tabelle.ablesen.text} ${gliedere(auf.luecken[auf.tabelle.ablesen.luecke].loesung)} ${auf.tabelle.ablesen.einheit} (siehe Tafel)` : 'siehe Tafel'; return `Die fehlenden Zahlen der Reihe nach: ${auf.tabelle.zeilen.flat().filter((c) => typeof c === 'object').map((c) => gliedere(auf.luecken[c.luecke].loesung)).join(', ')}`;
    case 'auswahl': return auf.optionen.filter((o) => o.richtig).map((o) => o.text).join(' · ');
    // Version 0.66 (Audit L083): Gezeigt werden nur die Sätze mit Lücke, nicht noch einmal die ganze Aufgabe. Der Schlusspunkt kommt vom Satz „Die Lösung ist: … .“
    case 'luecken': {
      // Klasse 6, Kapitel 8 (ADR 0058): Beim erfundenen Datensatz ist die Lösung nur ein Beispiel.
      if (auf.datensatz) return `zum Beispiel ${Object.values(auf.luecken).map((l) => gliedere(l.loesung)).join(', ')}`;
      const saetze = auf.text.split(/(?<=[.?!:])\s+(?=\S)/), mit = saetze.filter((t) => t.includes('{{'));
      return (mit.length ? mit : saetze).join(' ').replace(/\{\{(\w+)\}\}/g, (_, n) => gliedere(auf.luecken[n].loesung)).replace(/[\s.]+$/, '');
    }
    case 'zuordnen': return auf.paare.map((p) => `${p.links} ist ${p.rechts}`).join(', ');
    case 'sachaufgabe': return auf.teile.map((t, i) => `${'abcdef'[i]}) ${t.optionen ? t.optionen.filter((o) => o.richtig).map((o) => o.text).join(' · ') : zahl(t)}`).join('  ');
    case 'groesse': return loesungGroesse(auf);
    case 'strichliste': return auf.zeilen.map((x) => `${x.name} ${x.loesung} Striche`).join(', ');
    case 'zeichnen': return auf.diagramm.saeulen.filter((x) => x.offen).map((x) => `${x.name} bis ${x.wert}`).join(', ');
    case 'gitter': return gitterLoesung(auf);
    case 'winkel': return winkelLoesung(auf);
    case 'bruch': return `${bruchLoesung(auf)}${auf.einheit ? ` ${auf.einheit}` : ''}`;
    case 'faerben': return faerbenLoesung(auf);
    case 'streifenfaerben': return streifenFaerbenLoesung(auf);
    case 'periode': return String(auf.loesung);
    default: return '';
  }
}

// Nach dem Ergebnis: Ist gerade ein Wegstück fertig geworden, kommt erst sein Abschluss (ADR 0016).
function danach(a, fortsetzung) {
  return bereit(() => {
    // Feedbackfrage nach dem Ergebnis, vor allem anderen (ADR 0042). Danach geht es weiter wie ohne sie.
    if (!a.rueckblick && !a.einstieg && L.feedbackFaellig(z.stand, z.einst.feedback, jetzt())) {
      const frage = L.naechsteFeedbackFrage(z.stand, { tipp: (a.hilfen ?? 0) >= 1, bild: Boolean(a.aufgabe?.bild) }, jetzt());
      if (frage) return zeige({ name: 'feedback', frage, aufgabe: a.aufgabe.id, kapitel: L.kapitelVon(a.aufgabe.lernziel), weiter: () => danach(a, fortsetzung)() });
    }
    const w = a.ergebnis?.wegstueck;
    if (!w?.fertig) return fortsetzung();
    const kapitel = L.kapitelVon(a.aufgabe.lernziel);
    zeige({ name: 'wegstueck', bilanz: w, fortsetzung, kapitel, rastBis: w.rast && z.einst.rast ? Date.now() + L.RAST_SEKUNDEN * 1000 : null });
  });
}
// Falsch nach zwei Versuchen (ADR 0016): Lösung, dazu Beispiel und Lösungsschritt aufgedeckt. Gibt es beide nicht, der Tipp.
function soGehtEs(auf) {
  const felder = ['beispiel', 'loesungsschritt'].filter((f) => auf.hilfen?.[f]);
  const zeigen = felder.length ? felder : ['tipp'].filter((f) => auf.hilfen?.[f]);
  if (!zeigen.length) return null;
  const titel = { tipp: 'Tipp', beispiel: 'Beispiel', loesungsschritt: 'Lösungsschritt' };
  return h('div', { class: 'so-geht-es', id: 'so-geht-es' }, zeigen.map((f) => h('div', { class: 'kaertchen-offen' }, h('b', {}, titel[f]), h('p', {}, auf.hilfen[f]), f === 'tipp' && auf.tippBild && h('div', { class: 'bildrahmen tippbild' }, aufgabenBild(auf.tippBild)))));
}
// Erste Zeile des Ergebnisses: richtig mit Münzen oder falsch mit Lösung.
function urteilZeile(e, auf, nachsatz) {
  return e.richtig
    ? [h('h2', {}, 'Richtig!', h('span', { class: 'lohn' }, muenze(22), h('b', { class: 'plus' }, `+${e.muenzen}`), e.muenzen === 1 ? ' Münze' : ' Münzen'), lernsatz(e, auf)), wahreAnzahl(auf), endnullSatz(auf)]
    : [h('h2', {}, 'Das war noch nicht richtig.'), h('p', {}, 'Die Lösung ist: ', h('b', {}, loesungstext(auf)), `${/[.!?][“”"')]*$/.test(loesungstext(auf)) ? '' : '.'} ${nachsatz ?? ''}`.trimEnd()), endnullSatz(auf), wahreAnzahl(auf), loesungsbild(auf)];
}
// Klasse 6, Kapitel 4 (ADR 0047): Beim Runden wird keine Endnull verlangt (4 ist so richtig wie 4,0).
// Steht in der Lösung eine Endnull, sagt ein Satz, wozu sie da ist.
// Version 0.69 (ADR 0057): Fehlt beim Runden die Endnull, bittet ein Hinweis darum, ohne einen Versuch zu zählen.
const STELLEN_WORT = { 1: 'eine Stelle', 2: 'zwei Stellen', 3: 'drei Stellen', 4: 'vier Stellen' };
export const endnullHinweis = (stellen) => (STELLEN_WORT[stellen]
  ? `Fast richtig: Der Wert stimmt. Schreibe ${STELLEN_WORT[stellen]} nach dem Komma, auch wenn ${stellen === 1 ? 'dort' : 'am Ende'} eine Null steht. So sieht man, wie genau gerundet wurde. Das kostet dich keinen Versuch.`
  : 'Fast richtig: Die Werte stimmen. Schreibe so viele Stellen nach dem Komma, wie gerundet wurde, auch wenn am Ende eine Null steht. Das kostet dich keinen Versuch.');
export function endnullSatz(auf) {
  // Klasse 6, Kapitel 5 (ADR 0048): 4,5 € zählt wie 4,50 €. Der Satz zeigt, wie man Geld schreibt.
  if (/^6\.[57]\./.test(auf.lernziel ?? '') && auf.einheit === '€' && /,\d0$/.test(String(auf.loesung ?? ''))) return h('p', { class: 'endnull', id: 'endnull' }, `Bei Geld schreibt man zwei Stellen nach dem Komma: ${auf.loesung} €.`);
  if (!auf.lernziel?.startsWith('6.4.3')) return null;
  const werte = auf.format === 'zahl' ? [auf.loesung] : auf.format === 'luecken' ? Object.values(auf.luecken ?? {}).map((l) => l.loesung) : [];
  const mit = werte.map(String).find((w) => /,\d*0$/.test(w));
  return mit ? h('p', { class: 'endnull', id: 'endnull' }, `Beim Runden schreibt man die Null mit. Sie zeigt, wie genau gerundet wurde: ${mit}${auf.einheit ? ` ${auf.einheit}` : ''}.`) : null;
}
// Kapitel 2: Nach jeder Aufgabe mit Schätzbild steht die wahre Anzahl da, damit das Kind seine Schätzung einordnen kann (ADR 0030).
export function wahreAnzahl(auf) {
  // Kapitel 6: Nach dem Schätzen mit Vergleichsgröße steht das genaue Maß da.
  if (auf.format === 'schaetzen' && auf.bild?.art === 'vergleichsbild') return h('p', { class: 'wahre-anzahl', id: 'wahre-anzahl' }, `Nachgemessen: Es sind ${gliedere(auf.loesung)} ${auf.einheit}.`);
  // Kapitel 7: Nach dem Schätzen eines Winkels steht seine genaue Größe da (ADR 0034).
  if (auf.lernziel?.startsWith('5.7.3-A2') && auf.bild?.art === 'winkel') {
    const name = (auf.nachweis ?? []).find((x) => x?.winkel)?.winkel, w = auf.bild.winkel.find((x) => x.n === name) ?? auf.bild.winkel[0];
    return h('p', { class: 'wahre-anzahl', id: 'wahre-anzahl' }, `Nachgemessen: Der Winkel ${w.n ? `${w.n} ` : ''}ist genau ${w.groesse}° groß.`);
  }
  if (auf.bild?.art !== 'schaetzbild') return null;
  const n = auf.bild.felder.flat().reduce((x, y) => x + y, 0);
  return h('p', { class: 'wahre-anzahl', id: 'wahre-anzahl' }, `Nachgezählt: Auf dem Bild sind es genau ${gliedere(n)}.`);
}
// Kapitel 1: Bei Strichliste und Diagramm zeigt ein Bild die Lösung.
export function loesungsbild(auf) {
  // Klasse 6, Kapitel 4 (ADR 0047): die schriftliche Division, aus der die Dezimalzahl kommt.
  if (auf.division) return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, divisionBild(auf.division));
  if (auf.format === 'zeichnen') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, zeichnenLoesung(auf));
  // Kapitel 5: das Gitter mit der eingezeichneten Lösung.
  if (auf.format === 'gitter') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, gitterLoesungBild(auf));
  // Kapitel 7: der Winkel mit dem zweiten Schenkel in der richtigen Lage.
  if (auf.format === 'winkel') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, winkelLoesungBild(auf));
  if (auf.format === 'faerben') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, faerbenLoesungBild(auf));
  if (auf.format === 'streifenfaerben') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, streifenFaerbenLoesungBild(auf));
  // Klasse 6, Kapitel 7 (ADR 0050): die ausgefüllte Wertetabelle oder Dreisatztabelle.
  if (auf.tabelle?.art === 'werte' || auf.tabelle?.art === 'dreisatz') {
    const voll = (c) => (typeof c === 'object' && c !== null ? `${gliedere(auf.luecken[c.luecke].loesung)}${c.einheit ? ` ${c.einheit}` : ''}` : c);
    const t = { ...auf.tabelle, zeilen: auf.tabelle.zeilen.map((z) => z.map(voll)), pfeile: auf.tabelle.pfeile?.map((p) => p && Object.fromEntries(Object.entries(p).map(([k, v]) => [k, typeof v === 'object' && v !== null ? `${v.zeichen} ${gliedere(auf.luecken[v.luecke].loesung)}` : v]))) };
    return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, auf.tabelle.art === 'werte' ? werteTabelle(t) : dreisatzTabelle(t));
  }
  // Kapitel 2: Die ausgefüllte Stellenwerttafel.
  if (auf.tabelle?.art === 'einheitentafel') {
    const t = auf.tabelle;
    return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, t.zeilen.map((zeile) => einheitentafelBild({ spalten: t.kopf, gruppen: t.gruppen, werte: zeile.map((c) => (typeof c === 'object' ? auf.luecken[c.luecke].loesung : c === '' ? null : c)) })));
  }
  if (auf.tabelle?.art === 'stellentafel') {
    const t = auf.tabelle;
    return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, t.zeilen.map((zeile) => tafelBild({ spalten: t.kopf, gruppen: t.gruppen, komma: t.komma, werte: zeile.map((c) => (typeof c === 'object' ? auf.luecken[c.luecke].loesung : c === '' ? null : c)) })));
  }
  if (auf.format === 'strichliste') return h('div', { class: 'bildrahmen loesungsbild', id: 'loesungsbild' }, h('table', { class: 'strichtabelle' }, h('tbody', {},
    auf.zeilen.map((x) => h('tr', {}, h('th', { scope: 'row' }, x.name), h('td', {}, striche(buendle(x.loesung))))))));
  return null;
}
// Ein kurzer Satz in der Urteilszeile, wenn sich am Lernen etwas zeigt (ADR 0017). Höchstens einer, damit es zwei Zeilen bleiben.
function lernsatz(e, auf) {
  // ADR 0031: Lösung heute schon gesehen. Ohne den Satz wundert sich das Kind über die eine Münze.
  if (e.bekannt) return h('small', { class: 'lernsatz', id: 'kanntest-du' }, 'Diese Aufgabe kanntest du schon. Ab morgen zählt sie wieder für dein Siegel.');
  // Version 0.67 (Audit L177): Immer wenn es nur 1 Münze gibt, steht der Grund dabei.
  const grund = { wiederholt: 'Diese Aufgabe hast du schon einmal gelöst. Deshalb gibt es 1 Münze.',
    nachgewiesen: `Dieses Lernziel hast du auf ${L.KRONEN[auf?.niveau] ?? 'dieser Krone'} schon geschafft. Deshalb gibt es 1 Münze.`,
    loesungsschritt: 'Mit dem Lösungsschritt-Kärtchen gibt es 1 Münze.' }[e.einMuenze];
  if (grund) return h('small', { class: 'lernsatz', id: 'eine-muenze' }, grund);
  const text = e.ohneHilfe ? 'Diesmal ganz ohne Beispiel und Lösungsschritt!' : e.mut ? 'Du warst unsicher, aber es stimmt. Du kannst mehr, als du denkst.' : null;
  return text && h('small', { class: 'lernsatz', id: e.ohneHilfe ? 'ohne-hilfe' : 'mut-satz' }, text);
}
// Siegel, Krone und Meilenstein bekommen einen kurzen eigenen Moment, immer nur der wichtigste.
function moment(e, meilenstein) {
  const gemeistert = e.neuesLernziel && L.milestoneStatus(z.index, z.stand, meilenstein) === 'gemeistert';
  // Version 0.67 (Audit L145): Der Satz zur Selbsteinschätzung steht nur da, wenn Wahl und Krone sich unterscheiden.
  const satz = e.einschaetzung && e.einschaetzung.gewaehlt !== e.einschaetzung.krone ? `Du hattest um ${L.KRONEN[e.einschaetzung.gewaehlt]} gespielt. Geschafft hast du ${L.KRONEN[e.einschaetzung.krone]}.` : null;
  // Bronze aus der Grundlagen-Schleife wird nicht als neue Krone gefeiert, wenn das Kind Bronze gar nicht wählen kann.
  const feiern = e.neueKrone && !(e.neueKrone.niveau === 'F' && z.einst.zielniveau !== 'F');
  if (gemeistert || feiern) {
    const n = e.neueKrone?.niveau ?? L.krone(z.index, z.stand, meilenstein);
    return h('div', { class: 'moment', id: e.neueKrone ? 'neue-krone' : 'meilenstein-gemeistert' }, kroneBild(n, 48),
      h('div', {},
        h('b', {}, gemeistert ? `Meilenstein „${meilenstein.titel}“ gemeistert!` : `${e.neueKrone.vorher ? 'Krone aufgewertet' : 'Neue Krone'}: ${L.KRONEN[n]}!`),
        h('p', {}, gemeistert ? (e.neueKrone ? `Deine Krone: ${L.KRONEN[n]}.` : 'Alle Lernziele haben ihr Siegel.')
          : L.unterZiel(n, L.stufeAb(z.einst.zielniveau, meilenstein.ab)) ? `Am Meilenstein „${meilenstein.titel}“. Ein guter Zwischenschritt: Später holst du dir hier ${L.KRONEN[L.stufeAb(z.einst.zielniveau, meilenstein.ab)]}.` : `Am Meilenstein „${meilenstein.titel}“.`),
        satz && h('p', { class: 'klein', id: 'einschaetzung' }, satz)));
  }
  if (e.neuesLernziel) return h('div', { class: 'moment', id: 'neues-siegel' }, siegel(48), h('div', {}, h('b', {}, 'Lernziel erreicht!'), h('p', {}, 'Du bekommst ein Siegel.')));
  // Version 0.60 (ADR 0052): unter dem Ziel geschafft. Weiter geht es mit dem nächsten Lernziel, das Siegel kommt in der nächsten Runde.
  if (e.unterZielNeu) {
    const ziel = L.KRONEN[L.stufeAb(z.einst.zielniveau, meilenstein?.ab)];
    return h('div', { class: 'moment', id: 'unter-ziel-geschafft' }, kroneBild(e.unterZielNeu.niveau, 40), h('div', {},
      h('b', {}, `${L.KRONEN[e.unterZielNeu.niveau]} geschafft!`),
      h('p', {}, e.unterZielNeu.mal >= L.UNTER_ZIEL_HOECHSTENS ? 'Weiter geht es mit dem nächsten Lernziel. Deine Lehrkraft schaut sich dieses Lernziel mit dir an.'
        : `Weiter geht es mit dem nächsten Lernziel. Wenn du den Weg einmal geschafft hast, holst du dir hier ${ziel} und das Siegel.`)));
  }
  return null;
}
function ergebnisTafel(a, kapitelId, meilenstein) {
  if (a.rueckblick) return rueckblickErgebnis(a);
  if (a.einstieg) return einstiegErgebnis(a);
  if (a.bruecke) return brueckeErgebnis(a, meilenstein);
  if (a.sonderauftrag) return sonderauftragErgebnis(a);
  if (a.seitenblick) return seitenblickErgebnis(a, meilenstein);
  const e = a.ergebnis, auf = a.aufgabe, zielniveau = z.einst.zielniveau;
  // Version 0.60 (ADR 0052): Die Kronenwahl gilt je Lernziel. `kapNiveau` ist die Wahl des Kapitels, mit der jedes neue Lernziel beginnt.
  const kapNiveau = L.arbeitsniveau(z.stand, kapitelId, zielniveau);
  const niveau = L.arbeitsniveau(z.stand, kapitelId, zielniveau, auf.lernziel);
  const nivVon = (lz) => L.arbeitsniveau(z.stand, kapitelId, zielniveau, lz);
  const startNaechstes = L.NIVEAUS.indexOf(kapNiveau) > L.NIVEAUS.indexOf(zielniveau) ? zielniveau : kapNiveau;
  // In der Grundlagen-Schleife gibt es weder Kronenwechsel noch Brücke: Der Weg zurück ist schon festgelegt.
  const schleife = L.inGrundlage(z.stand, auf.lernziel);
  let vorschlag = schleife ? null : L.niveauVorschlag(z.stand, kapitelId, niveau, zielniveau, auf.lernziel);
  const ziel = L.NIVEAUS[L.NIVEAUS.indexOf(niveau) + (vorschlag === 'hoch' ? 1 : -1)];
  // Wer das Absinken schon einmal abgelehnt hat, sinkt jetzt von selbst (Version 0.60).
  let vonSelbst = false;
  if (vorschlag === 'runter' && L.sinktVonSelbst(z.stand, auf.lernziel) && !a.vonSelbst) {
    L.sinkeAb(z.stand, auf.lernziel, ziel, zielniveau); geaendert();
    a.vonSelbst = ziel; vorschlag = null;
  }
  if (a.vonSelbst) { vonSelbst = a.vonSelbst; vorschlag = null; }
  // Aufgabenführung (ADR 0026, 0052): erst jedes Lernziel des Meilensteins einmal, dann der nächste Meilenstein, am Ende die nächste Runde.
  const kapitel = z.pool.kapitel.find((k) => k.id === kapitelId);
  // Version 0.67: Die Führung beachtet die Tagessperre (`jz`). Gibt es im Kapitel nichts mehr, folgt der Bildschirm „Kapitel geschafft“.
  const jz = jetzt();
  const fertigHier = () => !schleife && L.fuehrungFertig(z.index, z.stand, meilenstein, kapNiveau, zielniveau, jz);
  const naechsterMeilenstein = () => (fertigHier() ? L.fuehrungsMeilenstein(z.index, z.stand, kapitel, z.einst, L.arbeitsniveau(z.stand, kapitelId, zielniveau), jz) : null);
  const geheZu = (ms) => { z.ansicht = { name: 'region', kapitel: kapitelId, milestone: ms.id }; const lz = L.naechstesLernziel(z.index, z.stand, ms, L.arbeitsniveau(z.stand, kapitelId, zielniveau), zielniveau, jz).id; starteAufgabe(lz, nivVon(lz)); };
  // Nach dem Nachlösen aus dem Heftcheck geht es dort weiter, wo das Kind vorher war (Audit L015).
  const zurueckZu = a.heftNachloesen && a.dann?.aufgabe ? a.dann : null;
  const weiter = () => {
    if (zurueckZu) return zeigeAufgabe(zurueckZu.aufgabe, zurueckZu.extra);
    if (fertigHier()) {
      const anderer = naechsterMeilenstein();
      if (!anderer) return zeige({ name: 'kapitelende', kapitel: kapitelId });
      if (anderer.id !== meilenstein.id) return geheZu(anderer);
    }
    const fertig = !schleife && L.lernzielErledigt(z.index, z.stand, auf.lernziel, L.arbeitsniveau(z.stand, kapitelId, zielniveau), zielniveau, jz);
    const lz = fertig ? L.naechstesLernziel(z.index, z.stand, meilenstein, L.arbeitsniveau(z.stand, kapitelId, zielniveau), zielniveau, jz).id : auf.lernziel;
    starteAufgabe(lz, nivVon(lz));
  };
  const danachZu = naechsterMeilenstein();
  const weiterZu = danachZu && danachZu.id !== meilenstein.id ? danachZu : null;
  const zumEnde = !zurueckZu && fertigHier() && !danachZu;
  const abstecher = fertigHier() ? L.abstecherAm(z.index, z.stand, kapitel, meilenstein, z.einst, kapNiveau, jz) : [];
  // Kronenvorschlag und Brücke kommen nacheinander, nie zugleich (ADR 0016).
  const bruecke = !vorschlag && !schleife && !z.stand.lernziele[auf.lernziel] && brueckeAngebot(auf.lernziel);
  // Zweite Zeile: was sich jetzt ändert (Grundlage), sonst der Heftcode.
  const zweite = e.grundlage?.art === 'beginnt' ? h('p', { class: 'grundlage', id: 'grundlage-beginnt' }, h('b', {}, 'Wir üben erst die Grundlage. '), `Die nächsten Aufgaben sind leichter. Nach ${L.GRUNDLAGE_RICHTIGE} richtigen Aufgaben geht es hier weiter.`)
    : e.grundlage?.art === 'endet' ? h('p', { class: 'grundlage', id: 'grundlage-endet' }, h('b', {}, 'Jetzt klappt auch der nächste Schritt. '), `Du spielst wieder um ${L.KRONEN[niveau]}.`)
      : heftHinweis(e);
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, e.grundlage?.art === 'beginnt' || zurueckZu || zumEnde ? null : 'Gleich kommt eine ähnliche Aufgabe.'),
    zweite,
    e.anspruchFehlt && h('p', { class: 'klein', id: 'anspruch' }, 'Für das Siegel fehlt noch eine Aufgabe, bei der du mehr als nur rechnen musst.'),
    !e.richtig && soGehtEs(auf),
    moment(e, meilenstein),
    vonSelbst && h('p', { class: 'vorschlag', id: 'von-selbst-silber' }, kroneBild(vonSelbst, 20), ` Diese Aufgaben sind gerade ganz schön schwer. Bei diesem Lernziel spielst du jetzt um ${L.KRONEN[vonSelbst]}.${startNaechstes === vonSelbst ? '' : ` Das nächste Lernziel beginnt wieder bei ${L.KRONEN[startNaechstes]}.`}`),
    vorschlag && h('div', { class: `vorschlag${vorschlag === 'hoch' ? ' gleich' : ''}` },
      h('p', {}, vorschlag === 'hoch'
        ? `Das läuft richtig gut. Du kannst bei ${L.KRONEN[niveau]} bleiben oder um ${L.KRONEN[ziel]} spielen. Dort sind die Aufgaben anspruchsvoller und bringen mehr Münzen.`
        // Version 0.67 (Audit L178): „wieder“ steht nur da, wenn das nächste Lernziel wirklich auf der bisherigen Krone beginnt.
        : `Diese Aufgaben sind gerade ganz schön schwer. Möchtest du bei diesem Lernziel um ${L.KRONEN[ziel]} spielen und dort Sicherheit sammeln?${startNaechstes === ziel ? '' : ` Das nächste Lernziel beginnt ${startNaechstes === niveau ? 'wieder ' : ''}bei ${L.KRONEN[startNaechstes]}.`}`),
      // Version 0.67 (Audit L202): Beim Gold-Angebot sind beide Knöpfe gleich gewichtet, „Bei Silber bleiben“ steht zuerst.
      [h('button', { class: vorschlag === 'hoch' ? 'gleich' : 'haupt', id: 'krone-wechseln', onclick: danach(a, () => {
        if (vorschlag === 'hoch') L.setzeNiveau(z.stand, kapitelId, ziel); else L.sinkeAb(z.stand, auf.lernziel, ziel, zielniveau);
        geaendert(); weiter(); }) }, kroneBild(ziel, 20), ` Um ${L.KRONEN[ziel]} spielen`),
      h('button', { class: vorschlag === 'hoch' ? 'gleich' : 'schlicht', id: 'krone-bleiben', onclick: danach(a, () => {
        if (vorschlag === 'hoch') L.lehneVorschlagAb(z.stand, kapitelId); else L.lehneAbsinkenAb(z.stand, auf.lernziel);
        geaendert(); weiter(); }) }, vorschlag === 'hoch' && kroneBild(niveau, 20), ` Bei ${L.KRONEN[niveau]} bleiben`.trimStart())][vorschlag === 'hoch' ? 'reverse' : 'slice']()),
    bruecke && h('div', { class: 'vorschlag bruecke', id: 'bruecke-angebot' },
      h('p', {}, h('b', {}, 'Wie wäre es mit einer Brücke? '), `Für „${lernzielText(auf.lernziel)}“ hilft es, zuerst „${lernzielText(bruecke.zu)}“ zu festigen. Das sind ${L.BRUECKE_AUFGABEN} kurze Aufgaben um ${L.KRONEN[L.brueckenNiveau(z.einst.zielniveau)]}, danach geht es hier weiter.`),
      h('button', { class: 'haupt', id: 'bruecke-start', onclick: danach(a, () => starteBruecke(bruecke)) }, 'Brücke gehen'),
      h('button', { class: 'schlicht', id: 'bruecke-nein', onclick: () => { z.brueckeAbgelehnt.add(auf.lernziel); male(); } }, 'Nein danke')),
    !vorschlag && !bruecke && h('div', { class: 'knoepfe' },
      h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => weiter()) }, zurueckZu ? 'Weiter, wo du warst' : weiterZu ? `Weiter zu ${weiterZu.titel}` : zumEnde ? 'Weiter' : a.frei ? 'Weiter auf dem Lernpfad' : 'Nächste Aufgabe'),
      // Selbst gewähltes Üben an einem erledigten Lernziel: Das Kind darf hier bleiben (Version 0.67).
      a.frei && !zurueckZu && h('button', { class: 'schlicht', id: 'noch-eine-hier', onclick: danach(a, () => starteAufgabe(auf.lernziel, nivVon(auf.lernziel))) }, 'Noch eine Aufgabe hier'),
      // Ein Abstecher über dem eigenen Ziel ist freiwillig und sagt, um welche Krone es dort geht (Audit L206).
      !zurueckZu && abstecher.map((u) => h('button', { class: 'schlicht', 'data-abstecher': u.id, onclick: danach(a, () => geheZu(u)) }, `Abstecher: ${u.titel}${L.istNiveauAbstecher(u, zielniveau) ? ` (freiwillig${u.ab ? `, ${L.KRONEN[u.ab]}` : ''})` : ''}`)),
      h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitelId, milestone: meilenstein.id }) }, 'Zur Regionskarte')),
    (vorschlag || bruecke) && h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitelId, milestone: meilenstein.id }) }, 'Zur Regionskarte'));
}
// Seitenblick: kurze Rückmeldung, dann zurück zum Lernziel, an dem der Schüler gerade arbeitet.
function seitenblickErgebnis(a, meilenstein) {
  const e = a.ergebnis, auf = a.aufgabe, { zurueck, niveau } = a.seitenblick;
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, 'Dein Siegel behältst du.'),
    heftHinweis(e),
    !e.richtig && soGehtEs(auf),
    h('div', { class: 'knoepfe' },
      h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => starteAufgabe(zurueck, niveau)) }, 'Nächste Aufgabe'),
      h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: L.kapitelVon(auf.lernziel), milestone: meilenstein.id }) }, 'Zur Regionskarte')));
}

// ---------- Wegstück (ADR 0016) ----------
// Abschluss nach fünf Aufgaben: Punkte, Münzen, weiter. Nach jedem vierten Wegstück des Tages eine Rast, überspringbar.
let rastUhr = null;
// Feedbackfrage (ADR 0042): eine Frage, zwei Knöpfe, kein Überspringen, keine Münzen.
function feedbackAnsicht() {
  const a = z.ansicht, f = a.frage;
  // Version 0.68 (ADR 0057): „Lieber etwas anderes“ wird eingelöst. Das Kind kommt auf die Regionskarte und wählt selbst.
  const antworte = (nr) => {
    L.trageFeedbackEin(z.stand, f, nr, a.aufgabe, jetzt()); geaendert(); z.dienst.sofort();
    const kapitel = f.id === 'weiter' && nr === 1 && z.pool.kapitel.find((k) => k.id === a.kapitel);
    if (!kapitel) return a.weiter();
    zeige({ name: 'region', kapitel: kapitel.id });
    z.meldung = 'Such dir auf der Karte aus, woran du jetzt arbeiten möchtest.'; z.meldungHier = true; // verschwindet beim Weitergehen
    male();
  };
  return h('section', { class: 'karte feedbackfrage', id: 'feedbackfrage' },
    h('span', { class: 'klein' }, 'Kurze Frage'),
    h('h1', {}, f.text),
    f.zurAufgabe && h('p', { class: 'klein' }, 'Es geht um die Aufgabe, die du gerade gelöst hast.'),
    h('div', { class: 'knoepfe' }, f.antworten.map((t, nr) => h('button', { class: 'schlicht', 'data-feedback': nr, onclick: () => antworte(nr) }, t))),
    h('p', { class: 'klein' }, 'Deine Antwort hilft, Mathekingdom besser zu machen. Sie zählt nicht für Siegel oder Münzen.'));
}
function wegstueckAnsicht() {
  const a = z.ansicht, b = a.bilanz;
  clearInterval(rastUhr);
  const rest = () => Math.max(0, Math.ceil((a.rastBis - Date.now()) / 1000));
  const rast = a.rastBis && !a.rastVorbei;
  const merke = (wie) => { const w = z.stand.wegstuecke?.at(-1); if (w && !w.rast) { w.rast = wie; geaendert(); z.dienst.sofort(); } };
  let rastKarte = null;
  if (rast) {
    const uhr = h('b', { class: 'uhr', id: 'rast-uhr' }, `${rest()} s`);
    rastUhr = setInterval(() => {
      uhr.textContent = `${rest()} s`;
      if (rest() === 0) { clearInterval(rastUhr); a.rastVorbei = true; merke('gemacht'); male(); }
    }, 250);
    rastKarte = h('div', { class: 'rast', id: 'rast' }, sanduhr(),
      h('div', {}, h('b', {}, 'Zeit für eine Rast.'), h('p', {}, 'Schau eine Minute aus dem Fenster in die Ferne, streck dich und atme tief durch.'), h('p', {}, 'Noch ', uhr)));
  }
  return h('section', { class: 'karte wegstueck-ende', id: 'wegstueck-ende' },
    h('span', { class: 'klein' }, 'Wegstück geschafft'),
    h('h1', {}, `${b.richtig} von ${b.gesamt} richtig`),
    h('div', { class: 'wegpunkte gross', 'aria-hidden': 'true' }, b.punkte.map((r) => h('i', { class: r ? 'voll' : 'daneben' }))),
    b.muenzen > 0 && h('p', { class: 'lohn' }, muenze(22), h('b', {}, `+${b.muenzen}`), ' Münzen in diesem Wegstück'),
    rastKarte,
    // Version 0.67 (Audit L137): Während der Rast steht der Weg zu den Spielen nicht da, und „Rast überspringen“ ist kein Hauptknopf.
    !rast && b.rast && z.einst.spielfreigabe === 'verdient' && (z.stand.spielGutschrift ?? 0) > 0 && h('p', { class: 'verdient', id: 'spiel-verdient' }, `${SPIELE_FREI} ${rundePreis()} `,
      h('button', { class: 'schlicht', onclick: () => { clearInterval(rastUhr); if (rast) merke('uebersprungen'); zeige({ name: 'spiele' }); } }, 'Zu den Spielen')),
    h('div', { class: 'knoepfe' },
      h('button', { class: rast ? 'schlicht' : 'haupt', id: 'weiter', onclick: bereit(() => { clearInterval(rastUhr); if (rast) merke('uebersprungen'); a.fortsetzung(); }) }, rast ? 'Rast überspringen' : 'Nächstes Wegstück'),
      h('button', { class: 'schlicht', onclick: () => { clearInterval(rastUhr); if (rast) merke('uebersprungen'); zeige({ name: 'region', kapitel: a.kapitel }); } }, 'Zur Regionskarte')));
}
function sanduhr() {
  return h('span', { class: 'sanduhr', 'aria-hidden': 'true' }, '⌛');
}

// „Rückblick 2 von 4“: Nach der letzten Aufgabe ist der laufende Rückblick schon abgeschlossen.
function rueckblickNummer(a, fertig) {
  const r = z.stand.rueckblickAktiv;
  if (r) return `Rückblick ${Math.min(r.aufgaben.length, r.erledigt.length + (fertig ? 0 : 1))} von ${r.aufgaben.length}`;
  const g = a.ergebnis?.rueckblick?.gesamt;
  return g ? `Rückblick ${g} von ${g}` : 'Rückblick';
}
// Ergebnis einer Rückblick-Aufgabe: ohne Kronenvorschlag, danach die nächste Rückblick-Aufgabe oder die Bilanz.
function rueckblickErgebnis(a) {
  const e = a.ergebnis, auf = a.aufgabe, r = e.rueckblick;
  const lernziel = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === auf.lernziel);
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, `Dein Siegel behältst du. „${lernziel?.text ?? ''}“ kommt beim nächsten Rückblick noch einmal dran.`),
    heftHinweis(e),
    !e.richtig && soGehtEs(auf),
    r?.fertig && h('p', { class: 'lohn neu', id: 'rueckblick-fertig' }, h('b', {}, 'Rückblick geschafft!'), ` ${r.richtig} von ${r.gesamt} richtig.`,
      z.einst.expedition && !L.expeditionsStand([z.stand], z.einst.expedition, jetzt()).vorbei ? ' Das bringt der Klasse ein Expeditionszeichen.' : ''),
    r && !r.fertig
      ? h('button', { class: 'haupt', id: 'weiter', onclick: bereit(starteRueckblick) }, 'Nächste Aufgabe im Rückblick')
      : h('button', { class: 'haupt', id: 'weiter', onclick: bereit(() => zeige({ name: 'schlossgarten' })) }, 'Zum Schlossgarten'));
}

// Einstiegscheck: neutrale Rückmeldung je Aufgabe, am Ende der Kronenvorschlag.
function einstiegNummer(a, fertig) {
  const e = z.stand.einstieg?.[a.einstieg];
  if (!e?.aufgaben) return 'Einstiegscheck';
  // Version 0.67 (Audit L026): „Aufgabe 5 von 8“, damit niemand die Nummer als Punktzahl liest.
  return `Einstiegscheck · Aufgabe ${Math.min(e.aufgaben.length, e.erledigt.length + (fertig ? 0 : 1))} von ${e.aufgaben.length}`;
}
function einstiegErgebnis(a) {
  const r = a.ergebnis.einstieg;
  const kapitel = z.pool.kapitel.find((k) => k.id === a.einstieg);
  if (!r?.fertig) {
    return h('div', { class: 'ergebnis neutral', role: 'status' },
      h('p', {}, 'Deine Antwort ist notiert. Am Ende siehst du, wie es gelaufen ist.'),
      h('button', { class: 'haupt', id: 'weiter', onclick: bereit(() => starteEinstieg(kapitel)) }, 'Nächste Aufgabe'));
  }
  const n = r.empfehlung;
  // Version 0.67 (ADR 0057): Der Vorschlag nennt seinen Grund. Eine eigene Purpur-Wahl aus dem letzten Kapitel gilt weiter.
  const geerbt = z.stand.wahlGeerbt?.[kapitel.id] && z.stand.niveau[kapitel.id] === 'E';
  const grund = r.gold?.gesamt ? ` Du hast ${r.gold.richtig} von ${r.gold.gesamt} Gold-Aufgaben gelöst.` : '';
  const waehle = (krone) => () => { L.setzeNiveau(z.stand, kapitel.id, krone); geaendert(); zeige({ name: 'region', kapitel: kapitel.id }); };
  return h('div', { class: 'ergebnis neutral', role: 'status', id: 'einstieg-fertig' },
    h('h2', {}, 'Einstiegscheck geschafft!'),
    h('p', {}, `Du hast ${r.richtig} von ${r.gesamt} Aufgaben gelöst.`),
    geerbt
      ? h('p', { class: 'lohn neu', id: 'wahl-geerbt' }, kroneBild('E', 32), h('b', {}, 'Du spielst weiter um Purpur.'), ` Das hast du im letzten Kapitel selbst gewählt.${grund}`)
      : h('p', { class: 'lohn neu', id: 'einstieg-vorschlag' }, kroneBild(n, 32), h('b', {}, `Unser Vorschlag: Spiel um ${L.KRONEN[n]}.`), h('span', { id: 'einstieg-grund' }, grund),
        L.unterZiel(n, z.einst.zielniveau) ? ` Dort sammelst du erst Sicherheit. Für die Meilensteine brauchst du später ${L.KRONEN[z.einst.zielniveau]}.` : ''),
    geerbt ? [h('button', { class: 'haupt', id: 'einstieg-krone', onclick: () => zeige({ name: 'region', kapitel: kapitel.id }) }, kroneBild('E', 20), ' Weiter um Purpur'),
      h('button', { class: 'schlicht', onclick: waehle(n) }, kroneBild(n, 20), ` Um ${L.KRONEN[n]} spielen`)]
      : h('button', { class: 'haupt', id: 'einstieg-krone', onclick: waehle(n) }, kroneBild(n, 20), ` Um ${L.KRONEN[n]} spielen`),
    h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitel.id }) }, 'Selbst wählen'));
}

// Brücke: „Brücke 2 von 3“, am Ende zurück zum Lernziel, für das sie gebaut wurde.
function brueckeNummer(a, fertig) {
  const b = z.stand.brueckeAktiv;
  if (b) return `Brücke ${Math.min(b.aufgaben.length, b.erledigt.length + (fertig ? 0 : 1))} von ${b.aufgaben.length}`;
  const g = a.ergebnis?.bruecke?.gesamt;
  return g ? `Brücke ${g} von ${g}` : 'Brücke';
}
function brueckeErgebnis(a, meilenstein) {
  const e = a.ergebnis, auf = a.aufgabe, r = e.bruecke;
  const zurueck = () => {
    const kap = L.kapitelVon(r.fuer);
    starteAufgabe(r.fuer, L.arbeitsniveau(z.stand, kap, z.einst.zielniveau, r.fuer));
  };
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, 'Schau sie dir in Ruhe an.'),
    r?.fertig ? h('p', { class: 'lohn neu', id: 'bruecke-fertig' }, h('b', {}, 'Brücke geschafft!'), ` ${r.richtig} von ${r.gesamt} richtig. Jetzt zurück zu „${lernzielText(r.fuer)}“.`) : heftHinweis(e),
    !e.richtig && soGehtEs(auf),
    e.neuesLernziel && h('div', { class: 'moment', id: 'neues-siegel' }, siegel(48), h('div', {}, h('b', {}, 'Lernziel erreicht!'), h('p', {}, 'Du bekommst ein Siegel.'))),
    !r ? h('button', { class: 'haupt', id: 'weiter', onclick: bereit(() => zeige({ name: 'region', kapitel: L.kapitelVon(auf.lernziel), milestone: meilenstein.id })) }, 'Zur Regionskarte')
      : r.fertig ? h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, zurueck) }, 'Zurück zum Lernziel')
        : h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => starteBruecke()) }, 'Nächste Aufgabe der Brücke'));
}

// Heftcode unter jeder gelösten Aufgabe ab Gold.
// Nils, 2026-11-25 (ADR 0047): klein und grau, damit er nicht wie eine Heftaufgabe aussieht.
const heftHinweis = (e) => e.heft && h('p', { class: 'heftcode', id: 'heftcode' }, 'Notiere im Heft: ', h('b', { class: 'code' }, e.heft), ' und dein Ergebnis. Ab und zu fragt dich der Heftcheck danach.');
// Das Heftband über einer Heftaufgabe. Bei Zeichenaufgaben heißt es „Zeichne“, sonst „Rechne“.
export const heftband = (auf) => h('p', { class: 'heftband', id: 'heftband', role: 'note' },
  h('span', { class: 'heftsymbol', 'aria-hidden': 'true' }, '✎'), h('b', {}, 'Heftaufgabe: '),
  `${/\b(Zeichne|Konstruiere|Zeichnet)\b/.test(auf.text) ? 'Zeichne' : 'Rechne'} im Heft. Gib danach nur dein Ergebnis ein.`);

// ---------- Heftcheck (ADR 0014) ----------
function heftcheckAnsicht() {
  const a = z.ansicht, f = a.frage;
  const weiter = () => zeigeAufgabe(a.danach.aufgabe, a.danach.extra); // der Zähler steht wieder auf null
  if (a.gewaehlt == null) {
    // Version 0.68 (ADR 0057): Die Aufgabe steht noch einmal da, damit das Kind sie im Heft wiederfindet.
    const alt = z.index.aufgabe.get(f.aufgabe), teil = alt?.teile?.at(-1)?.text;
    return h('section', { class: 'karte heftcheck' },
      h('span', { class: 'klein' }, 'Heftcheck'),
      h('h1', {}, `Schau in dein Heft: Was hattest du bei ${f.heft} heraus?`),
      alt?.text && h('p', { class: 'heftaufgabe', id: 'heftaufgabe' }, h('b', {}, `Aufgabe ${f.heft}: `), alt.text.replace(/\{\{\w+\}\}/g, '▢'), teil && alt.teile.length > 1 ? ` Gefragt ist das letzte Ergebnis (${teil.replace(/\{\{\w+\}\}/g, '▢')}).` : ''),
      h('div', { class: 'heftwahl' }, f.optionen.map((o, i) => h('button', { class: 'schlicht', 'data-heftwahl': i, onclick: () => {
        L.trageHeftcheckEin(z.stand, f, o.richtig, jetzt()); geaendert(); z.dienst.sofort();
        zeige({ ...a, gewaehlt: i });
      } }, o.text))));
  }
  const richtig = f.optionen[a.gewaehlt].richtig;
  const aufgabe = z.index.aufgabe.get(f.aufgabe);
  return h('section', { class: `karte heftcheck ${richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    h('span', { class: 'klein' }, 'Heftcheck'),
    h('h1', {}, richtig ? 'Stimmt, genau das steht in deinem Heft.' : `Das passt nicht zu ${f.heft}.`),
    richtig ? h('button', { class: 'haupt', id: 'heftcheck-weiter', onclick: weiter }, 'Weiter')
      : [h('p', {}, `Löse die Aufgabe ${f.heft} bitte noch einmal und schreib den Rechenweg ordentlich ins Heft. Du verlierst dabei keine Münzen.`),
        h('button', { class: 'haupt', id: 'heftcheck-nachloesen', onclick: () => zeigeAufgabe(aufgabe, { heftNachloesen: true, heftAufgabe: f.heft, dann: a.danach }) }, `Aufgabe ${f.heft} lösen`)]);
}

const kartenVon = (auf) => L.KARTEN.filter((feld) => auf.hilfen[feld]);
const meilensteinVon = (auf) => z.index.meilensteinVon.get(auf.lernziel) ?? z.index.meilensteinVon.get(z.stand.brueckeAktiv?.fuer ?? z.ansicht?.bruecke?.fuer ?? z.ansicht?.ergebnis?.bruecke?.fuer) ?? z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.merkzettel) ?? z.pool.kapitel[0].unterkapitel[0];
// Hilfekärtchen liegen in der Aufgabenkarte unter dem Eingabefeld, dort wo gerechnet wird (ADR 0016).
// Je Niveaustufe gibt es unterschiedlich viele Kärtchen: F und G drei, M zwei, E eines.
function kaertchen(a) {
  const karten = [
    ['tipp', 'Tipp', 'Ein Denkanstoß. Kostet nichts.'],
    ['beispiel', 'Beispiel', 'Eine ähnliche Aufgabe, vorgerechnet. Kostet weitere Münzen.'],
    ['loesungsschritt', 'Lösungsschritt', 'Der Anfang des Rechenwegs. Danach zählt die Aufgabe nicht mehr für dein Lernziel.'],
  ].filter(([feld]) => a.aufgabe.hilfen[feld]);
  if (!karten.length) return null;
  // Zugedeckt zeigt sich nur das nächste Kärtchen; die übrigen stehen klein dahinter.
  return h('div', { class: 'kaertchen', 'aria-label': 'Hilfekärtchen' }, karten.map(([feld, titel, kosten], i) => i < a.hilfen
    ? h('div', { class: 'kaertchen-offen' }, h('b', {}, titel), h('p', {}, a.aufgabe.hilfen[feld]), feld === 'tipp' && a.aufgabe.tippBild && h('div', { class: 'bildrahmen tippbild', id: 'tippbild' }, aufgabenBild(a.aufgabe.tippBild)))
    : h('button', { class: `kaertchen-zu${i > a.hilfen ? ' spaeter' : ''}`, type: 'button', disabled: i > a.hilfen, 'data-hilfe': feld, onclick: () => { a.hilfen++; if (z.stand.aktiv) { z.stand.aktiv.hilfen = a.hilfen; geaendert(); } maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); } },
      h('b', {}, titel), h('span', {}, i > a.hilfen ? 'Erst das Kärtchen davor.' : kosten))));
}
// Seitenleiste: Merkzettel und der Hilferuf an die Lehrkraft. Den Wortspeicher-Kasten gibt es nicht mehr (ADR 0056).
function hilfen(a, meilenstein = meilensteinVon(a.aufgabe), lernziel = z.index.lernziel.get(a.aufgabe.lernziel)) {
  return h('aside', { class: 'hilfen' },
    merkzettel(lernziel, meilenstein, a),
    !z.stand.hilferuf && hilferufKnopf(a));
}
// Erst der Knopf, dann die Wahl des Grundes (Pflicht, ADR 0041). Der Entwurf in der Aufgabe bleibt erhalten.
function hilferufKnopf(a) {
  const neuMalen = () => maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe);
  if (z.hilfeGrundWahl !== a.aufgabe.id) {
    return h('button', { class: 'schlicht hilferuf', id: 'hilferuf', onclick: () => { z.hilfeGrundWahl = a.aufgabe.id; neuMalen(); } }, 'Ich brauche Hilfe von meiner Lehrkraft');
  }
  const rufe = (grund) => { L.rufeHilfe(z.stand, a.aufgabe.id, jetzt(), grund); z.hilfeGrundWahl = null; z.wartePlatz = null; geaendert(); z.dienst.sofort(); neuMalen(); takt(); };
  return h('div', { class: 'hilfegrund', id: 'hilfegrund', role: 'group', 'aria-label': 'Warum rufst du deine Lehrkraft?' },
    h('b', {}, 'Warum rufst du deine Lehrkraft?'),
    Object.entries(L.HILFERUF_GRUENDE).map(([grund, g]) => h('button', { class: 'schlicht', type: 'button', 'data-hilfegrund': grund, onclick: () => rufe(grund) }, h('span', { class: 'hilfegrund-zeichen', 'aria-hidden': 'true' }, g.zeichen), g.text)),
    h('button', { class: 'link klein', type: 'button', id: 'hilfegrund-abbrechen', onclick: () => { z.hilfeGrundWahl = null; neuMalen(); } }, 'Doch nicht'));
}

// ---------- Wappen ----------
// Aha-Momente (ADR 0017): nur Überwundenes, nie offene Fehler, ohne Münzen. Beim Ansehen gelten sie als gesehen.
function ahaKarte() {
  const liste = L.ahaMomente(z.stand);
  if (L.merkeAhaGesehen(z.stand)) geaendert();
  return h('section', { class: 'karte aha', id: 'aha' }, h('h2', {}, 'Deine Aha-Momente'),
    liste.length === 0
      ? h('p', { class: 'klein' }, 'Hier sammelst du Fehler, die du hinter dir gelassen hast. Wer Fehler macht und sie dann nicht mehr macht, hat etwas gelernt.')
      : [h('p', { class: 'klein' }, 'Diese Fehler hast du einmal gemacht. Jetzt machst du sie nicht mehr.'),
        h('ul', { class: 'aha-liste' }, liste.map((a) => h('li', { class: a.neu ? 'neu' : '' }, h('span', { class: 'funke', 'aria-hidden': 'true' }, '✦'),
          h('span', {}, z.pool.fehlvorstellungen[a.fehlvorstellung]?.kind ?? a.fehlvorstellung,
            h('small', {}, ` ${lernzielText(a.lernziel)} · ${new Date(a.am).toLocaleDateString('de-DE')}`)),
          a.neu && h('span', { class: 'marke-neu' }, 'neu'))))]);
}
function wappenAnsicht() {
  const r = L.rang(L.rangSiegel(z.stand), L.titelform(z.stand));
  const w = z.stand.wappen;
  const stufe = L.klassenstufe(z.stand);
  L.vergebeEhrenzeichen(z.stand, z.pool, z.index, z.einst?.zielniveau);
  const neueEhre = z.stand.neueEhre ?? [];
  if (neueEhre.length) { z.stand.neueEhre = []; geaendert(); }
  const teilKarte = (teil) => {
    const gekauft = w.gekauft.includes(teil.id);
    const platz = teil.art === 'zeichen' ? w.zeichen.indexOf(teil.id) : -1;
    const an = L.traegt(w, teil.id), neuerBereich = teil.klasse > 5;
    // Vorschau eines Teils der späteren Bereiche (ADR 0039): der eigene Schild mit genau diesem Teil.
    const probe = () => (teil.art === 'teilung' ? wappenBild({ ...w, teilung: teil.id }, 50)
      : teil.art === 'helm' ? wappenVoll({ farbe: w.farbe, gekauft: w.gekauft, zeichen: [], helm: teil.id }, 54)
        : teil.art === 'helmdecke' ? wappenVoll({ farbe: w.farbe, farbe2: w.farbe2, gekauft: w.gekauft, zeichen: [], helm: w.helm ?? 'topfhelm', helmdecke: teil.id }, 78)
          : teil.art === 'helmschmuck' ? wappenVoll({ farbe: w.farbe, farbe2: w.farbe2, gekauft: w.gekauft, zeichen: [], helm: w.helm ?? 'topfhelm', helmschmuck: teil.id }, 50)
            : teil.art === 'halter' ? wappenVoll({ farbe: w.farbe, gekauft: w.gekauft, zeichen: [], halter: { links: teil.id } }, 84)
              : teil.art === 'prunk' ? wappenVoll({ farbe: w.farbe, gekauft: w.gekauft, zeichen: [], prunk: [teil.id] }, 96) : null);
    const seite = (name, wort) => h('button', { class: w.halter?.[name] === teil.id ? 'haupt' : 'schlicht', 'data-halter': `${teil.id}|${name}`, 'aria-pressed': String(w.halter?.[name] === teil.id),
      onclick: () => { L.stelleHalter(z.stand, teil.id, name); geaendert(); male(); } }, wort);
    const rangFehlt = r.stufe < teil.rang;
    const kaufen = () => { if (L.kaufe(z.stand, teil.id) === 'ok') { L.legeAn(z.stand, teil.id); geaendert(); male(); } };
    const lege = () => { L.legeAn(z.stand, teil.id); geaendert(); male(); };
    return h('li', { class: `teil ${an ? 'an' : ''} ${teil.ehre ? 'ehre' : ''} ${teil.art === 'spruch' ? 'spruch' : ''}` },
      teil.art === 'farbe' ? h('span', { class: 'farbfeld', style: `background:${teil.wert}` })
        : neuerBereich ? (teil.art !== 'spruch' && h('span', { class: 'vorschau' }, probe()))
          : h('span', { class: 'vorschau' }, wappenBild({ farbe: w.farbe, zeichen: [teil.id] }, 44)),
      h('b', {}, teil.art === 'spruch' ? `„${teil.name}“` : teil.name),
      teil.deutsch && h('span', { class: 'klein' }, `Latein: ${teil.deutsch}`),
      an && platz >= 0 && h('span', { class: 'klein' }, platz === 0 ? 'Hauptzeichen' : 'Beizeichen'),
      gekauft
        ? h('div', { class: 'teil-knoepfe' },
          teil.art === 'halter' ? [seite('links', 'Links'), seite('rechts', 'Rechts')]
            : h('button', { class: an ? 'haupt' : 'schlicht', 'data-teil': teil.id, onclick: lege }, teil.art === 'farbe' ? (an ? 'Gewählt' : 'Wählen') : (an ? 'Abnehmen' : 'Anbringen')),
          platz > 0 && h('button', { class: 'schlicht', 'data-haupt': teil.id, onclick: () => { L.macheHauptzeichen(z.stand, teil.id); geaendert(); male(); } }, 'Als Hauptzeichen'))
        : teil.ehre ? h('span', { class: 'klein' }, teil.ehre)
          : rangFehlt ? h('span', { class: 'klein' }, `Ab Rang ${L.inForm(L.RAENGE[teil.rang], L.titelform(z.stand))}`)
            : h('button', { class: 'schlicht', 'data-teil': teil.id, disabled: z.stand.muenzen < teil.preis, onclick: kaufen }, muenze(16), ` ${teil.preis} kaufen`));
  };
  const imSchrank = L.WAPPEN_TEILE.filter((t) => t.klasse <= stufe);
  // Die Bereiche ab Klasse 6 (ADR 0039): je Teileart eine Liste. Was noch nicht offen ist, steht unten als Ausblick mit Vorschaubild.
  const zweite = L.zweiteFarbe(w), farben = w.gekauft.map(L.teil).filter((t) => t?.art === 'farbe' && t.id !== w.farbe);
  const hinweis = { teilung: !zweite && 'Für eine Schildteilung brauchst du eine zweite Farbe. Kaufe oben noch eine Farbe.',
    helmdecke: !w.helm && 'Die Helmdecke zeigt sich, sobald dein Wappen einen Helm trägt.', helmschmuck: !w.helm && 'Der Helmschmuck zeigt sich, sobald dein Wappen einen Helm trägt.',
    halter: 'Stelle ein Tier nach links, nach rechts oder auf beide Seiten.', spruch: 'Wähle einen Wahlspruch für das Band unter deinem Schild.' };
  const bereich = (b) => [h('h2', { id: `bereich-${b.klasse}` }, b.name),
    Object.entries(b.arten).map(([art, titel]) => [
      Object.keys(b.arten).length > 1 && h('h3', {}, titel),
      hinweis[art] && h('p', { class: 'klein' }, hinweis[art]),
      art === 'teilung' && farben.length > 1 && h('div', { class: 'zweite-farbe', id: 'zweite-farbe', role: 'group', 'aria-label': 'Zweite Farbe' }, h('b', {}, 'Zweite Farbe'),
        farben.map((f) => h('button', { class: `farbwahl${f.id === zweite ? ' an' : ''}`, 'data-farbe2': f.id, 'aria-pressed': String(f.id === zweite), title: f.name, style: `background:${f.wert}`,
          onclick: () => { L.waehleZweiteFarbe(z.stand, f.id); geaendert(); male(); } }))),
      h('ul', { class: `teile-liste${art === 'spruch' ? ' sprueche' : ''}` }, imSchrank.filter((t) => t.art === art).map(teilKarte))])];
  const BEISPIEL = { 6: { teilung: 'geviert' }, 7: { helm: 'spangenhelm', helmdecke: 'decke-gezaddelt', helmschmuck: 'federbusch' }, 8: { halter: { links: 'halter-loewe', rechts: 'halter-einhorn' } },
    9: { spruch: 'spruch-1' }, 10: { prunk: ['lorbeer', 'kette', 'postament'] } };
  // Das Vorschaubild zeigt das eigene Wappen mit einem Beispiel aus dem Bereich. Fehlt die zweite Farbe, leiht es sich Gold oder Silber.
  const vorschau = (b) => wappenVoll({ ...w, gekauft: [...w.gekauft, w.farbe === 'gold' ? 'silber' : 'gold'], ...(b.klasse > 6 && !w.teilung ? {} : { farbe2: zweite ?? (w.farbe === 'gold' ? 'silber' : 'gold') }), ...BEISPIEL[b.klasse] }, 120);
  const voll = Boolean(w.helm || w.spruch || w.prunk?.length || w.halter?.links || w.halter?.rechts);
  const gruppen = Object.entries(L.ZEICHEN_GRUPPEN).map(([id, titel]) => [titel, imSchrank.filter((t) => t.art === 'zeichen' && t.gruppe === id)]).filter(([, liste]) => liste.length);
  return h('section', {},
    h('h1', {}, 'Dein Wappen'),
    h('div', { class: 'werkbank' }, voll ? wappenVoll(w, 270) : wappenBild(w, 150),
      h('div', {}, h('p', { class: 'unter' }, `Rang: ${r.name}`),
        h('p', {}, r.naechster ? `Noch ${r.naechster.ab - L.rangSiegel(z.stand)} Siegel, dann wirst du ${r.naechster.name} und schaltest neue Teile frei.` : 'Du hast den höchsten Rang erreicht.'),
        h('p', { class: 'klein' }, 'Dein Wappen trägt ein großes Hauptzeichen und bis zu zwei kleine Beizeichen. Münzen bekommst du für gelöste Aufgaben, Ehrenzeichen kannst du nur verdienen.'),
        titelformWahl())),
    neueEhre.length > 0 && h('div', { class: 'karte neue-ehre', id: 'neue-ehre', role: 'status' },
      h('b', {}, neueEhre.length === 1 ? 'Neues Ehrenzeichen: ' : 'Neue Ehrenzeichen: '), neueEhre.map((id) => L.teil(id)?.name).join(', '),
      '. Du findest es unten bei den Ehrenzeichen.'),
    ahaKarte(),
    h('h2', {}, 'Farben'), h('ul', { class: 'teile-liste' }, imSchrank.filter((x) => x.art === 'farbe').map(teilKarte)),
    gruppen.map(([titel, liste]) => [h('h2', {}, titel), h('ul', { class: 'teile-liste' }, liste.map(teilKarte))]),
    L.WAPPENBEREICHE.filter((b) => b.arten && b.klasse <= stufe).map(bereich),
    stufe < 10 && h('h2', {}, 'Später im Wappenschrank'),
    stufe < 10 && h('ul', { class: 'ausblick', id: 'ausblick' }, L.WAPPENBEREICHE.filter((b) => b.klasse > stufe).map((b) => h('li', { 'data-bereich': b.klasse },
      h('span', { class: 'vorschau' }, vorschau(b)), h('span', {}, h('b', {}, b.name), ` öffnet sich in Klasse ${b.klasse}. `, b.satz)))));
}

// ---------- Spiele (ADR 0018) ----------
const SPERRE = {
  aus: 'Spiele sind in deiner Klasse gerade ausgeschaltet.',
  'keine-spielpause': 'Gerade ist keine Spielpause. Deine Lehrkraft schaltet sie frei.',
  'nicht-verdient': 'Nach jedem vierten Wegstück sind die Belohnungsspiele für eine Runde frei.',
};
// Version 0.69 (ADR 0057): Der Text sagt ehrlich, was „verdient“ heißt. Die Spiele sind dann frei, eine Runde kostet weiter Münzen.
const SPIELE_FREI = 'Die Spiele sind für dich frei.';
const rundePreis = () => `Eine Runde kostet ${Math.min(...L.SPIELE.filter((sp) => sp.art === 'belohnung').map((sp) => sp.preis))} Münzen.`;
function spieleAnsicht() {
  z.einst = einstellungenJetzt();
  if (z.einst.bestenliste && !z.klasseLaedt && Date.now() - (z.klasseGelesen ?? 0) > 60000) {
    z.klasseLaedt = true;
    ladeKlasse().then(() => { z.klasseLaedt = false; if (z.ansicht.name === 'spiele') male(); });
  }
  const verdient = z.einst.spielfreigabe === 'verdient' && !z.einst.spielpause && (z.stand.spielGutschrift ?? 0) > 0;
  const karte = (sp) => {
    const erlaubt = L.spielErlaubt(z.stand, z.einst, sp.id);
    const best = L.bestwert(z.stand, sp.id);
    return h('li', { class: `karte spielkarte ${sp.art}`, id: `spiel-${sp.id}` },
      h('h3', {}, sp.name, h('span', { class: 'klein' }, sp.art === 'rechenpause' ? ' · Rechenpause' : ' · Belohnungsspiel')),
      h('p', {}, sp.text),
      best > 0 && h('p', { class: 'klein' }, `Dein Bestwert: ${best}`),
      erlaubt === 'ok'
        ? h('button', { class: 'haupt', 'data-spiel': sp.id, disabled: z.stand.muenzen < sp.preis, onclick: () => starte(sp) }, muenze(16), ` ${sp.preis} Münzen: Spiel starten`)
        : h('p', { class: 'klein gesperrt' }, SPERRE[erlaubt]),
      sp.art === 'belohnung' && z.einst.bestenliste && bestenlisteKarte(sp));
  };
  const starte = (sp) => {
    if (L.starteMinispiel(z.stand, z.einst, sp.id) !== 'ok') return male();
    geaendert(); z.dienst.sofort();
    zeige(sp.art === 'rechenpause'
      ? { name: 'minispiel', spiel: sp.id, ende: Date.now() + sp.sekunden * 1000, punkte: 0, frage: L.kopfrechenAufgabe() }
      : { name: 'minispiel', spiel: sp.id, punkte: 0, rest: sp.sekunden });
  };
  return h('section', {},
    h('h1', {}, 'Spiele'),
    h('p', { class: 'unter' }, 'Hier löst du Münzen für eine kurze Pause ein. Die Rechenpause hält den Kopf in Schwung, ein Belohnungsspiel ist reiner Spaß.'),
    verdient && h('div', { class: 'karte verdient', id: 'verdient', role: 'status' }, h('b', {}, SPIELE_FREI), ` ${rundePreis()} Das gilt, bis du eine Runde gespielt hast.`),
    h('ul', { class: 'spiele-liste' }, L.SPIELE.map(karte)),
    z.einst.bestenliste && beinameKarte());
}
function bestenlisteKarte(sp) {
  const b = L.bestenliste(z.stand, z.andere ?? [], sp.id, jetzt());
  return h('div', { class: 'bestenliste', id: `bestenliste-${sp.id}` },
    h('b', {}, `Bestenliste der Klasse für „${sp.name}“, diese Woche`),
    b.plaetze.length === 0 ? h('p', { class: 'klein' }, 'Bei diesem Spiel hat diese Woche noch niemand Punkte geholt. Die Liste beginnt jeden Montag neu.')
      : h('ol', {}, b.plaetze.map((p) => h('li', { class: p.eigen ? 'eigen' : '' }, h('span', { class: 'platz' }, `${p.platz}.`), wappenBild(p.wappen ?? { farbe: 'rot', zeichen: [] }, 22), h('span', { class: 'beiname' }, p.beiname), h('b', {}, p.punkte)))),
    b.eigenerPlatz && b.eigenerPlatz > L.BESTENLISTE_PLAETZE && h('p', { class: 'klein' }, `Du bist auf Platz ${b.eigenerPlatz} mit ${b.eigenerWert}.`),
    b.ausgeblendet && b.eigenerPlatz && h('p', { class: 'klein' }, `Du bist ausgeblendet. Dein Platz wäre ${b.eigenerPlatz} mit ${b.eigenerWert}.`));
}
// Version 0.69 (ADR 0057): Das Kind wählt, wie seine Titel heißen. Die Wahl gilt für Rang und Hoftitel, überall.
function titelformWahl() {
  const form = L.titelform(z.stand);
  const beispiele = (f) => [L.rang(L.rangSiegel(z.stand), f).name, L.inForm(L.HOFTITEL[3], f), L.inForm(L.HOFTITEL[0], f)].join(', ');
  const waehle = (f) => { if (f === form) return; L.setzeTitelform(z.stand, f); geaendert(); z.dienst.sofort(); male(); };
  return h('div', { class: 'titelform', id: 'titelform', role: 'group', 'aria-label': 'So sollen deine Titel heißen' },
    h('b', {}, 'So sollen deine Titel heißen:'),
    h('div', { class: 'reihe' }, ['m', 'w'].map((f) => h('button', { type: 'button', class: `schlicht${f === form ? ' aktiv' : ''}`, 'data-titelform': f, 'aria-pressed': String(f === form), onclick: () => waehle(f) }, beispiele(f)))));
}
function beinameKarte() {
  // Beide Bausteine werden erst eingestellt und dann mit einem Knopf gemeinsam gespeichert (ADR 0020).
  const [vorne, hinten] = L.beiname(z.stand).split(' ');
  const e = (z.ansicht.beiname ??= { vorne, hinten, frage: false });
  const preis = L.preisBeiname(z.stand);
  const neu = `${e.vorne} ${e.hinten}`, anders = neu !== `${vorne} ${hinten}`;
  const wahl = (liste, aktuell, id, feld) => h('select', { id, onchange: (ev) => { e[feld] = ev.target.value; e.frage = false; male(); } }, liste.map((x) => h('option', { value: x, selected: x === aktuell }, x)));
  const aendern = () => { if (L.aendereBeiname(z.stand, e.vorne, e.hinten) === 'ok') { geaendert(); z.dienst.sofort(); z.ansicht.beiname = null; z.meldungBeiname = `Du heißt jetzt „${neu}“.`; } male(); };
  const meldung = z.meldungBeiname; z.meldungBeiname = null;
  return h('div', { class: 'karte beiname-karte', id: 'beiname' },
    h('h2', {}, 'Dein Beiname'),
    h('p', { class: 'klein' }, 'Auf der Bestenliste stehst du mit deinem Wappen und diesem Beinamen, nie mit deinem Namen.'),
    h('p', { class: 'klein', id: 'beiname-preis' }, preis === 0
      ? 'Die erste Änderung ist kostenlos. Danach kostet jede Änderung 50 Münzen.'
      : `Jede Änderung kostet ${preis} Münzen.`),
    h('div', { class: 'beiname-wahl' }, wappenBild(z.stand.wappen, 36),
      wahl(L.BEINAME_VORNE, e.vorne, 'beiname-vorne', 'vorne'),
      wahl(L.BEINAME_HINTEN, e.hinten, 'beiname-hinten', 'hinten')),
    meldung && h('p', { class: 'klein', role: 'status', id: 'beiname-meldung' }, meldung),
    anders && !e.frage && h('div', { class: 'beiname-aendern' },
      h('p', {}, 'Neu: ', h('b', {}, neu)),
      h('button', { class: 'haupt', id: 'beiname-aendern', disabled: z.stand.muenzen < preis, onclick: () => { e.frage = true; male(); } },
        preis === 0 ? 'Beiname ändern: kostenlos' : [muenze(16), ` ${preis} Münzen: Beiname ändern`]),
      z.stand.muenzen < preis && h('p', { class: 'klein gesperrt' }, `Dafür brauchst du ${preis} Münzen.`)),
    anders && e.frage && h('div', { class: 'beiname-aendern', role: 'alertdialog', id: 'beiname-frage' },
      h('p', {}, preis === 0
        ? `Willst du wirklich „${neu}“ heißen? Danach kostet jede Änderung ${L.BEINAME_PREIS} Münzen.`
        : `Willst du wirklich „${neu}“ heißen? Das kostet ${preis} Münzen.`),
      h('button', { class: 'haupt', id: 'beiname-ja', onclick: aendern }, 'Ja, ändern'), ' ',
      h('button', { class: 'schlicht', id: 'beiname-nein', onclick: () => { z.ansicht.beiname = null; male(); } }, 'Abbrechen')),
    h('label', { class: 'schalter' }, h('input', { type: 'checkbox', id: 'ausblenden', checked: Boolean(z.stand.bestenlisteAus), onchange: (e) => { z.stand.bestenlisteAus = e.target.checked; geaendert(); male(); } }), ' Mich in der Bestenliste ausblenden'));
}

// ---------- Minispiel ----------
let spieluhr = null, spielStopp = null;
function minispiel() {
  const a = z.ansicht;
  const sp = L.spiel(a.spiel ?? 'kopfrechnen');
  clearInterval(spieluhr);
  const fertig = () => { a.vorbei = true; L.trageSpielEin(z.stand, sp.id, a.punkte, jetzt()); geaendert(); z.dienst.sofort(); male(); };
  if (a.vorbei) {
    spielStopp?.(); spielStopp = null;
    const best = L.bestwert(z.stand, sp.id);
    return h('section', { class: 'karte spiel', id: 'spiel-ende' }, h('h1', {}, sp.art === 'rechenpause' ? 'Zeit ist um!' : 'Runde vorbei!'),
      h('p', { class: 'gross' }, `${a.punkte} ${sp.einheit}`),
      a.punkte > 0 && a.punkte >= best && h('p', {}, 'Neuer Bestwert!'),
      sp.art === 'belohnung' && z.einst.bestenliste && bestenlisteKarte(sp),
      h('div', { class: 'knoepfe' },
        h('button', { class: 'haupt', onclick: () => zeige({ name: 'schlossgarten' }) }, 'Zurück an die Arbeit'),
        h('button', { class: 'schlicht', onclick: () => zeige({ name: 'spiele' }) }, 'Zu den Spielen')));
  }
  if (sp.art === 'belohnung') {
    // Das Canvas bleibt beim Neuzeichnen dasselbe, damit das Spiel weiterläuft.
    if (!a.canvas) {
      a.canvas = h('canvas', { class: 'spielfeld', id: 'spielfeld', 'aria-label': sp.name });
      a.anzeige = h('p', { class: 'spielanzeige' });
      spielStopp = starteSpiel(sp.id, a.canvas, { sekunden: sp.sekunden, melde: (m) => {
        a.punkte = m.punkte;
        a.anzeige.textContent = `Noch ${m.rest} s · ${sp.einheit}: ${m.punkte}${m.banner != null ? ` · Banner: ${m.banner}` : ''}`;
        if (m.vorbei && !a.vorbei) fertig();
      } });
    }
    return h('section', { class: 'karte spiel belohnungsspiel' }, h('h1', {}, sp.name), a.anzeige, a.canvas, h('p', { class: 'klein' }, sp.text));
  }
  const rest = () => Math.max(0, Math.ceil((a.ende - Date.now()) / 1000));
  const uhr = h('b', { class: 'uhr' }, `${rest()} s`);
  spieluhr = setInterval(() => {
    uhr.textContent = `${rest()} s`;
    if (rest() === 0) { clearInterval(spieluhr); fertig(); }
  }, 250);
  const eingabe = h('input', { type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 5, 'aria-label': 'Ergebnis' });
  const formular = h('form', { onsubmit: (e) => {
    e.preventDefault();
    if (L.leseZahl(eingabe.value) === a.frage.loesung) a.punkte++;
    a.frage = L.kopfrechenAufgabe();
    male();
  } }, h('span', { class: 'gross' }, `${a.frage.text} = `), eingabe, h('button', { class: 'haupt', type: 'submit' }, 'Weiter'));
  setTimeout(() => eingabe.focus());
  return h('section', { class: 'karte spiel' }, h('p', {}, 'Zeit: ', uhr, ' · Richtig: ', h('b', {}, a.punkte)), formular);
}

// ---------- Aufgabentester (0.37) ----------
// Im Admin-Dashboard läuft dieses Dashboard in einem Rahmen (window.MK_PROBE). Es zeigt eine Aufgabe nach ihrer Kennung so,
// wie ein Schüler sie sieht und bedient, mit einem frischen Speicherstand, der nirgends gespeichert wird.
// Das Admin-Dashboard schickt { mkProbe: kennung }; nach dem Prüfen meldet der Rahmen { mkProbeErgebnis: { kennung, richtig } }.
function probeAblage(klasse) {
  const dateien = new Map();
  return { name: klasse, demo: true, probe: true, lies: async (p) => dateien.get(p) ?? null, schreibe: async (p, t) => { dateien.set(p, t); }, liste: async () => [] };
}
export function zeigeProbe(kennung) {
  const pool = Object.values(window.MK_POOLS ?? {}).find((p) => p.aufgaben.some((a) => a.id === kennung));
  const aufgabe = pool?.aufgaben.find((a) => a.id === kennung);
  if (!aufgabe) { wurzel.replaceChildren(h('p', { class: 'karte' }, `Die Aufgabe ${kennung} steht nicht im Aufgabenpool.`)); return; }
  const klasse = `${pool.klassenstufe}a`, code = `${pool.klassenstufe}A-PROB`;
  // Zielniveau = Niveau der Aufgabe, damit sie weder als Training noch als Grundlage erscheint.
  const klassendatei = { zielniveaus: { [code]: aufgabe.niveau }, aktuellesKapitel: L.kapitelVon(aufgabe.lernziel), tore: pool.kapitel.map((k) => k.id) };
  Object.assign(z, { probe: kennung, ablage: probeAblage(klasse), pool, index: L.indexiere(pool), klassendatei, einst: L.einstellungen(klassendatei, code, pool),
    stand: L.neuerSpeicherstand(code, klasse, jetzt()), speicherstatus: null, meldung: null });
  z.einst.spielpause = true;
  z.dienst = { markiere() {}, sofort() {} };
  zeigeAufgabe(aufgabe);
}

// ---------- Start ----------
export function starte(ziel) {
  wurzel = ziel;
  document.head.append(h('style', {}, stil + VERSION_STIL));
  if (window.MK_PROBE) {
    wurzel.classList.add('probe');
    window.addEventListener('message', (ev) => { if (ev.source === window.parent && typeof ev.data?.mkProbe === 'string') zeigeProbe(ev.data.mkProbe); });
    window.parent?.postMessage({ mkProbeBereit: true }, '*');
    if (typeof window.MK_PROBE === 'string') zeigeProbe(window.MK_PROBE);
    return;
  }
  male();
  setTimeout(() => wurzel.querySelector('#code')?.focus());
}
if (typeof document !== 'undefined') {
  const ziel = document.getElementById('mathekingdom') ?? document.body.appendChild(h('div', { id: 'mathekingdom' }));
  starte(ziel);
}
