// Schüler-Dashboard: Oberfläche. Die Regeln stehen in logik.js, der Dateizugriff in speicher.js.
import { pruefePin } from '../gemeinsam/krypto.js';
import { versionsHinweis, versionstext, VERSION_STIL } from '../gemeinsam/version.js';
import * as P from '../gemeinsam/protokoll.js';
import stil from './stil.css';
import { h, mische } from './dom.js';
import * as L from './logik.js';
import * as S from './speicher.js';
import { wappenBild, regionMap, muenze, siegel, kroneBild, gartentor, schlossBild, zahlenstrahl, saeulendiagramm } from './bilder.js';
import { aufgabenBild } from './aufgabenbilder.js';
import { klinge } from './ton.js';

const jetzt = () => new Date().toISOString();
const z = { // Zustand der laufenden Sitzung
  ablage: null, stand: null, pool: null, index: null, klassendatei: null, einst: null, dienst: null,
  ansicht: { name: 'anmeldung' }, speicherstatus: null, meldung: null, wartePlatz: null,
};
let wurzel;

// ---------- Rahmen ----------
function zeige(ansicht) {
  z.ansicht = { ...ansicht, seit: Date.now() };
  if (ansicht.name !== 'aufgabe' && z.stand?.aktiv) {
    // Aufgabe ohne Ergebnis verlassen: für das Aufgaben-Audit der Lehrkraft festhalten.
    const a = z.stand.aktiv;
    (z.stand.abbrueche ??= []).push({ t: jetzt(), aufgabe: a.aufgabe, fehlversuche: a.fehlversuche ?? 0, hilfen: a.hilfen ?? 0 });
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
  const ansichten = { anmeldung, schlossgarten, region: regionsAnsicht, aufgabe: aufgabenAnsicht, heftcheck: heftcheckAnsicht, wegstueck: wegstueckAnsicht, wappen: wappenAnsicht, minispiel };
  const fokus = imFokus();
  wurzel.classList.toggle('fokus', fokus);
  wurzel.replaceChildren(...[
    z.stand && (fokus ? fokusKopf() : kopf()),
    z.stand && hilfeBanner(),
    z.stand && nachrichtBanner(),
    z.meldung && h('div', { class: 'meldung', role: 'status' }, z.meldung, h('button', { class: 'schlicht', onclick: () => { z.meldung = null; male(); } }, 'Schließen')),
    h('main', {}, ansichten[z.ansicht.name]()),
    !fokus && versionsHinweis('schueler'),
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
  if (a.name === 'aufgabe' && !a.rueckblick) {
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
  const anzahl = L.siegel(z.stand), r = L.rang(anzahl);
  const status = z.speicherstatus;
  // Siegel und Karte stehen vorn, die Münzen klein dahinter (ADR 0010).
  return h('header', { class: 'kopf' },
    h('button', { class: 'wappenknopf', title: 'Zu deinem Wappen', onclick: () => zeige({ name: 'wappen' }) }, wappenBild(z.stand.wappen, 40)),
    h('div', { class: 'wer' },
      h('strong', {}, `${r.name} ${z.stand.code}`),
      h('span', {}, r.naechster ? `Noch ${r.naechster.ab - anzahl} Siegel bis ${r.naechster.name}` : 'Höchster Rang erreicht')),
    h('div', { class: 'konto' },
      h('span', { class: 'wert siegelwert', title: 'Siegel: eines pro erreichtem Lernziel' }, siegel(24), h('b', { id: 'siegel' }, anzahl), h('span', { class: 'wort' }, 'Siegel')),
      kronenZaehler(),
      h('span', { class: 'wert klein-wert', title: 'Münzen zum Ausgeben' }, muenze(16), h('b', { id: 'muenzen' }, z.stand.muenzen))),
    h('nav', {},
      h('button', { class: ['schlossgarten', 'region'].includes(z.ansicht.name) ? 'aktiv' : '', onclick: () => zeige({ name: 'schlossgarten' }) }, 'Schlossgarten'),
      h('button', { class: z.ansicht.name === 'wappen' ? 'aktiv' : '', onclick: () => zeige({ name: 'wappen' }) }, 'Wappen')),
    h('div', { class: `speicher ${status && !status.ok ? 'fehler' : ''}`, id: 'speicherstatus' },
      !status ? 'Noch nichts zu speichern'
        : status.ok ? `Gespeichert um ${status.um.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
          : 'Speichern fehlgeschlagen. Sag deiner Lehrkraft Bescheid.',
      z.ablage.demo && h('span', { class: 'demo' }, 'Demo: nur in diesem Browser')));
}

// Kronen je Farbe: Bronze, Silber, Gold, Purpur (ADR 0012).
function kronenZaehler() {
  const alle = Object.values(L.kronen(z.pool, z.index, z.stand));
  const je = Object.fromEntries(L.NIVEAUS.map((n) => [n, alle.filter((k) => k === n).length]));
  return h('span', { class: 'wert kronenwert', id: 'kronen', title: `Kronen: ${L.NIVEAUS.map((n) => `${je[n]} ${L.KRONEN[n]}`).join(', ')}` },
    L.NIVEAUS.map((n) => h('span', { class: `je${je[n] ? '' : ' null'}`, 'data-krone': n }, kroneBild(n, 20), h('b', {}, je[n]))));
}

function nachrichtBanner() {
  const n = z.einst.nachricht;
  if (!n || z.stand.gelesen === n.t) return null;
  return h('div', { class: 'hilfebanner nachricht', role: 'status' }, h('span', {}, h('b', {}, 'Nachricht von deiner Lehrkraft: '), n.text),
    h('button', { class: 'schlicht', id: 'nachricht-ok', onclick: (e) => { z.stand.gelesen = n.t; geaendert(); z.dienst.sofort(); e.target.closest('.hilfebanner').remove(); } }, 'Verstanden'));
}
function hilfeBanner() {
  if (!z.stand.hilferuf) {
    return z.hilfeErledigt ? h('div', { class: 'hilfebanner erledigt', role: 'status' }, h('span', {}, 'Deine Lehrkraft hat deinen Hilferuf als erledigt abgehakt.')) : null;
  }
  const antwort = z.einst.hilfeAntwort;
  const kommt = antwort?.zu === z.stand.hilferuf.seit && antwort.status === 'unterwegs';
  return h('div', { class: 'hilfebanner', role: 'status' },
    h('span', {}, kommt ? 'Deine Lehrkraft kommt gleich zu dir.'
      : `Du wartest auf Hilfe${z.wartePlatz ? ` und bist auf Platz ${z.wartePlatz} der Warteschlange` : ''}. Arbeite ruhig weiter.`),
    h('button', { class: 'schlicht', onclick: () => { L.beendeHilferuf(z.stand, 'zurueckgezogen', jetzt()); geaendert(); male(); } }, 'Hilferuf zurückziehen'));
}

// ---------- Anmeldung ----------
function anmeldung() {
  const a = z.ansicht;
  const eingabe = h('input', { id: 'code', type: 'text', autocomplete: 'off', spellcheck: false, placeholder: 'z. B. 5A-K4M2', value: a.code ?? '', maxLength: 9,
    onkeydown: (e) => { if (e.key === 'Enter') pinFeld.focus(); } });
  const pinFeld = h('input', { id: 'pin', type: 'password', inputMode: 'numeric', autocomplete: 'off', placeholder: '4 Ziffern', maxLength: 4,
    onkeydown: (e) => { if (e.key === 'Enter') starte(false); } });
  const starte = async (demo) => {
    const gelesen = L.leseCode(eingabe.value);
    if (!gelesen) return zeige({ name: 'anmeldung', code: eingabe.value, fehler: 'Diesen Schülercode gibt es nicht. Er sieht so aus: 5A-K4M2.' });
    try {
      const ablage = demo ? S.demoAblage(gelesen.klasse) : window.MK_ORDNER ? S.ordnerAblage(window.MK_ORDNER) : await S.waehleOrdner();
      await melde({ ...gelesen, pin: pinFeld.value }, ablage);
    } catch (e) {
      if (e.name === 'AbortError') return;
      zeige({ name: 'anmeldung', code: eingabe.value, fehler: `Das hat nicht geklappt: ${e.message}` });
    }
  };
  return h('section', { class: 'karte anmeldung' },
    h('h1', {}, 'Mathekingdom'),
    h('p', { class: 'unter' }, 'Der König sucht Kundschafter, die sein Reich erkunden.'),
    h('label', { for: 'code' }, 'Dein Schülercode'),
    eingabe,
    h('label', { for: 'pin' }, 'Deine PIN'),
    pinFeld,
    a.fehler && h('p', { class: 'fehler', role: 'alert' }, a.fehler),
    S.kannOrdner()
      ? h('button', { class: 'haupt', id: 'ordner', onclick: () => starte(false) }, window.MK_ORDNER ? 'Aufbrechen' : 'Klassenordner wählen und aufbrechen')
      : h('p', { class: 'fehler' }, 'Dieser Browser kann nicht im Klassenordner speichern. Öffne die Datei bitte mit Edge oder Chrome.'),
    !window.MK_ORDNER && h('p', { class: 'klein' }, 'Im nächsten Fenster wählst du den Ordner deiner Klasse aus und erlaubst das Speichern.'),
    h('button', { class: 'schlicht', id: 'demo', onclick: () => starte(true) }, 'Ohne Ordner ausprobieren'));
}

async function melde({ code, klasse, pin }, ablage) {
  if (ablage.name.toLowerCase() !== klasse) {
    return zeige({ name: 'anmeldung', code, fehler: `Dein Code gehört zur Klasse ${klasse}, du hast aber den Ordner „${ablage.name}“ gewählt. Wähle den Ordner „${klasse}“.` });
  }
  const klassenstufe = parseInt(klasse, 10);
  const { pool, quelle: poolQuelle, grund: poolGrund } = await S.ladePool(ablage, klassenstufe);
  if (!pool) return zeige({ name: 'anmeldung', code, fehler: `Für Klasse ${klassenstufe} gibt es noch keine Aufgaben.` });
  const gelesen = await S.ladeKlassendatei(ablage);
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
  const geladen = await S.ladeStand(ablage, code);
  Object.assign(z, { ablage, pool, index: L.indexiere(pool), klassendatei, einst, stand: geladen.stand ?? L.neuerSpeicherstand(code, klasse, jetzt()) });
  z.meldung = geladen.hinweis ? 'Dein Speicherstand im Klassenordner fehlte oder war veraltet. Er wurde aus der Sicherung dieses Computers wiederhergestellt.' : null;
  z.dienst = S.speicherdienst(ablage, () => z.stand, speicherMeldung);
  if (!ablage.demo) {
    const e = P.starteintrag({ t: jetzt(), version: versionstext(), dashboard: window.MK_QUELLE ?? 'ohne-netz', grund: window.MK_GRUND,
      aufgaben: poolQuelle, aufgabenGrund: poolGrund, klassendatei: gelesen.status, browser: P.browserName(navigator.userAgent) });
    notiere(e.art, e.text);
    if (geladen.hinweis) notiere('problem', geladen.hinweis === 'datei-fehlte'
      ? 'Speicherstand fehlte im Klassenordner, aus der Sicherung dieses Computers wiederhergestellt'
      : 'Speicherstand im Klassenordner war älter als die Sicherung dieses Computers, Sicherung übernommen');
  }
  z.dienst.markiere(); z.dienst.sofort();
  // Hat die Lehrkraft das Zielniveau gesenkt, kommen die Siegel jetzt dazu. Weggenommen wird nie etwas (ADR 0012).
  if (L.trageSiegelNach(z.stand, z.index, einst.zielniveau, jetzt())) { z.dienst.markiere(); z.dienst.sofort(); }
  // Vorgaben der Lehrkraft alle 10 Sekunden lesen. Wartet der Schüler auf Hilfe, alle 3 Sekunden,
  // und sofort, wenn er zum Fenster zurückkehrt (im Hintergrund bremst der Browser die Uhr).
  let schlag = 0;
  setInterval(() => { if (z.stand.hilferuf || ++schlag % 3 === 0) takt(); }, 3300);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) takt(); });
  window.addEventListener('pagehide', () => z.dienst.sofort());
  zeige({ name: 'schlossgarten' });
}
function maleStatus() {
  const alt = document.getElementById('speicherstatus');
  if (alt) alt.replaceWith((imFokus() ? fokusKopf() : kopf()).querySelector('#speicherstatus'));
}

// Alle 10 Sekunden: Vorgaben der Lehrkraft neu lesen und die Warteschlange prüfen.
async function takt() {
  try {
    const gelesen = await S.ladeKlassendatei(z.ablage);
    // Eine fehlende oder veränderte Klassendatei ändert nichts: Es gilt weiter die letzte gültige.
    if (gelesen.status === 'ok' || gelesen.status === 'ungeprueft') { z.klassendatei = gelesen.daten; z.klassendateiGemeldet = false; }
    else if (!z.klassendateiGemeldet) { z.klassendateiGemeldet = true; notiere('problem', gelesen.status === 'fehlt' ? 'Klassendatei fehlt im Klassenordner' : 'Klassendatei ungültig (Unterschrift passt nicht), es gilt die zuletzt gültige'); }
    const bild = (e) => JSON.stringify([...e.offeneKapitel, e.spielpause, e.zielniveau, e.hilfeAntwort, e.nachricht, [...e.gesperrteMeilensteine], e.expedition, e.sicherheitsangabe, e.ton, e.rast, [...e.einstiegPflicht]]);
    const vorher = bild(z.einst);
    z.einst = einstellungenJetzt();
    if (L.trageSiegelNach(z.stand, z.index, z.einst.zielniveau, jetzt())) geaendert();
    const ruf = z.stand.hilferuf, antwort = z.einst.hilfeAntwort;
    let neu = vorher !== bild(z.einst);
    if (ruf && antwort?.zu === ruf.seit && antwort.status === 'erledigt') {
      L.beendeHilferuf(z.stand, 'erledigt', jetzt()); geaendert(); z.dienst.sofort(); neu = true;
      z.hilfeErledigt = true;
      setTimeout(() => { z.hilfeErledigt = false; wurzel.querySelector('.hilfebanner.erledigt')?.remove(); }, 20000);
    }
    // Stand der Expedition höchstens jede Minute neu zählen, und nur auf der Startseite.
    if (z.einst.expedition && z.ansicht.name === 'schlossgarten' && Date.now() - (z.klasseGelesen ?? 0) > 60000) {
      const vorher = expeditionsSumme();
      await ladeKlasse();
      if (expeditionsSumme() !== vorher) neu = true;
    }
    if (z.stand.hilferuf) {
      const platz = L.wartePlatz(z.stand, await S.ladeAndereHilferufe(z.ablage, z.stand.code));
      if (platz !== z.wartePlatz) { z.wartePlatz = platz; neu = true; }
    }
    // Nicht mitten in einer Eingabe neu zeichnen.
    if (neu && !['aufgabe', 'minispiel'].includes(z.ansicht.name)) male();
    else if (neu) {
      // Mitten in einer Aufgabe nur die Banner austauschen.
      wurzel.querySelectorAll('.hilfebanner').forEach((b) => b.remove());
      wurzel.querySelector('.kopf').after(...[hilfeBanner(), nachrichtBanner()].filter(Boolean));
    }
    // In der Aufgabe erscheint der Knopf für einen neuen Hilferuf wieder, ohne die Eingabe zu verlieren.
    if (neu && z.ansicht.name === 'aufgabe' && !z.stand.hilferuf && !wurzel.querySelector('#hilferuf')) wurzel.querySelector('aside.hilfen')?.replaceWith(hilfen(z.ansicht));
  } catch { /* Ordner kurz nicht erreichbar: beim nächsten Takt erneut */ }
}
function einstellungenJetzt() {
  const e = L.einstellungen(z.klassendatei, z.stand.code, z.pool);
  if (z.ablage.demo) e.spielpause = true;
  return e;
}

// ---------- Schlossgarten ----------
// Ausgangsort in der Mitte des Königreichs: ein Gartentor je Kapitel, dahinter die Regionskarte.
function schlossgarten() {
  z.einst = einstellungenJetzt();
  return h('section', {},
    etappenKarte(),
    rueckblickKarte(),
    brueckeKarte(),
    expeditionKarte(),
    h('div', { class: 'schlosskopf' }, schlossBild(),
      h('h1', {}, 'Der Schlossgarten'),
      h('p', { class: 'unter' }, `Klasse ${z.pool.klassenstufe}: Hinter jedem Tor liegt eine Region des Königreichs. Wähle ein offenes Tor und erkunde die Region.`)),
    h('ol', { class: 'regionen' }, z.pool.kapitel.map((k, i) => {
      const offen = z.einst.offeneKapitel.has(k.id);
      const mit = k.unterkapitel.filter((u) => L.milestoneStatus(z.index, z.stand, u) !== 'leer');
      const gemeistert = mit.filter((u) => L.milestoneStatus(z.index, z.stand, u) === 'gemeistert').length;
      return h('li', {}, h('button', { class: `region ${offen ? '' : 'gesperrt'}`, disabled: !offen, 'data-kapitel': k.id, onclick: () => zeige({ name: 'region', kapitel: k.id }) },
        gartentor(offen),
        h('span', { class: 'nummer' }, `Tor ${i + 1}`),
        h('span', { class: 'titel' }, k.titel),
        k.id === z.einst.aktuellesKapitel && h('span', { class: 'marke' }, 'Aktuelles Kapitel'),
        h('span', { class: 'stand' }, !offen ? 'Tor noch geschlossen' : mit.length === 0 ? 'Aufgaben folgen' : `${gemeistert} von ${mit.length} Meilensteinen gemeistert`)));
    })));
}

// Startseite: Wo stehe ich, was tue ich jetzt? Ein Tipp führt direkt zur nächsten Aufgabe.
function etappenKarte() {
  const e = L.etappe(z.pool, z.index, z.stand, z.einst);
  if (!e) return null;
  const k = e.kapitel, fertig = !e.milestone;
  const los = () => {
    // Ein offener Einstiegscheck kommt vor der ersten Aufgabe des Kapitels: dafür auf die Regionskarte.
    if (L.einstiegsZustand(z.stand, z.index, k)) return zeige({ name: 'region', kapitel: k.id });
    z.ansicht = { name: 'region', kapitel: k.id, milestone: e.milestone.id };
    const n = L.arbeitsniveau(z.stand, k.id, z.einst.zielniveau);
    starteAufgabe(L.naechstesLernziel(z.index, z.stand, e.milestone, n).id, n);
  };
  return h('div', { class: 'karte etappe' },
    h('div', { class: 'etappe-text' },
      h('span', { class: 'klein' }, fertig ? 'Etappe geschafft' : 'Hier geht es weiter'),
      h('h2', {}, fertig ? `${k.titel}: alle Meilensteine gemeistert` : `${k.titel}: Meilenstein ${e.milestone.titel}`),
      h('div', { class: 'balken', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': e.gesamt, 'aria-valuenow': e.geschafft, 'aria-label': 'Etappenziel' },
        Array.from({ length: e.gesamt }, (_, i) => h('i', { class: i < e.geschafft ? 'voll' : '' }))),
      h('span', { class: 'etappe-stand' }, `${e.geschafft} von ${e.gesamt} Meilensteinen gemeistert`)),
    fertig
      ? h('button', { class: 'schlicht', id: 'weiter-wandern', onclick: () => zeige({ name: 'region', kapitel: k.id }) }, 'Zur Regionskarte')
      : h('button', { class: 'haupt', id: 'weiter-wandern', onclick: los }, 'Weiter wandern'));
}

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
  if (L.NIVEAUS.indexOf(L.arbeitsniveau(z.stand, L.kapitelVon(lernzielId), z.einst.zielniveau)) < L.NIVEAUS.indexOf('M')) return null;
  if ((z.brueckeAbgelehnt ??= new Set()).has(lernzielId)) return null;
  const v = L.brueckeVorschlag(z.stand, z.index, lernzielId, jetzt());
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

// Merkzettel des Meilensteins: Regeln, Beispiel, Hinweis fürs Heft. Frei zugänglich, kostet nichts.
function merkzettel(meilenstein, halter) {
  const m = meilenstein.merkzettel;
  if (!m) return null;
  return h('details', { class: 'merkzettel', open: Boolean(halter?.merkzettelOffen), ontoggle: (e) => { if (halter) halter.merkzettelOffen = e.target.open; } },
    h('summary', {}, 'Merkzettel'),
    h('ul', {}, m.regeln.map((r) => h('li', {}, r))),
    h('p', {}, h('b', {}, 'Beispiel: '), m.beispiel),
    m.heft && h('p', { class: 'heft' }, h('b', {}, 'Im Heft: '), m.heft));
}

// Wortspeicher des Meilensteins: nur die Wörter bis zur Niveaustufe der Aufgabe. Auf F und G ist er aufgeklappt.
function wortspeicher(meilenstein, a) {
  const stufe = L.NIVEAUS.indexOf(a.aufgabe.niveau);
  const woerter = (meilenstein.wortspeicher ?? []).filter((w) => L.NIVEAUS.indexOf(w.ab) <= stufe);
  if (woerter.length === 0) return null;
  a.wortspeicherOffen ??= stufe <= 1;
  return h('details', { class: 'wortspeicher', open: a.wortspeicherOffen, ontoggle: (e) => { a.wortspeicherOffen = e.target.open; } },
    h('summary', {}, 'Wortspeicher'),
    h('dl', {}, woerter.map((w) => [h('dt', {}, w.wort), h('dd', {}, w.erklaerung)])));
}

// ---------- Regionskarte ----------
function regionsAnsicht() {
  const kapitel = z.pool.kapitel.find((k) => k.id === z.ansicht.kapitel);
  const niveau = L.arbeitsniveau(z.stand, kapitel.id, z.einst.zielniveau);
  const zu = z.einst.gesperrteMeilensteine;
  const milestones = kapitel.unterkapitel.map((u) => ({ id: u.id, titel: u.titel, extra: u.extra, krone: L.krone(z.index, z.stand, u), status: zu.has(u.id) ? 'gesperrt' : L.milestoneStatus(z.index, z.stand, u) }));
  const standort = (milestones.find((m) => m.status === 'begonnen') ?? milestones.find((m) => m.status === 'offen') ?? milestones[0]).id;
  const gewaehlt = z.ansicht.milestone ?? standort;
  const meilenstein = kapitel.unterkapitel.find((u) => u.id === gewaehlt);
  const einstieg = einstiegKarte(kapitel);
  const wartet = einstieg && z.einst.einstiegPflicht.has(kapitel.id);
  const karte = regionMap({ milestones, standort, gewaehlt, wappen: z.stand.wappen,
    beiMeilenstein: (id) => zeige({ ...z.ansicht, milestone: id }) });
  return h('section', {},
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'schlossgarten' }) }, '← Schlossgarten')),
    h('h1', {}, kapitel.titel),
    h('p', { class: 'unter' }, `Du spielst um ${L.KRONEN[niveau]}. Für einen Meilenstein brauchst du mindestens ${L.KRONEN[z.einst.zielniveau]}. Die Nummern auf den Meilensteinen sind ein Vorschlag: Du darfst jeden offenen Meilenstein wählen.`),
    einstieg,
    h('div', { class: 'kartenrahmen' }, karte),
    legende(),
    wartet ? h('div', { class: 'karte tafel' }, h('p', {}, 'Mach zuerst den Einstiegscheck. Danach öffnen sich die Meilensteine.')) : meilensteinTafel(kapitel, meilenstein, niveau));
}
function legende() {
  return h('ul', { class: 'legende', 'aria-label': 'Zeichenerklärung' },
    L.NIVEAUS.map((n) => h('li', {}, kroneBild(n, 18), `Krone ${L.KRONEN[n]}`)));
}

function meilensteinTafel(kapitel, meilenstein, niveau) {
  const status = L.milestoneStatus(z.index, z.stand, meilenstein);
  if (z.einst.gesperrteMeilensteine.has(meilenstein.id)) {
    return h('div', { class: 'karte tafel gesperrt' }, h('h2', {}, `${meilenstein.titel} 🔒`), h('p', {}, 'Diesen Meilenstein hat deine Lehrkraft für dich noch nicht geöffnet. Wähle einen anderen Meilenstein.'));
  }
  if (status === 'leer') {
    return h('div', { class: 'karte tafel' }, h('h2', {}, meilenstein.titel), h('p', {}, 'An diesem Meilenstein gibt es noch keine Aufgaben. Er wird bald eröffnet.'));
  }
  const naechstes = L.naechstesLernziel(z.index, z.stand, meilenstein, niveau);
  const meine = L.krone(z.index, z.stand, meilenstein), ziel = z.einst.zielniveau;
  return h('div', { class: 'karte tafel' },
    h('h2', {}, meilenstein.titel, status === 'gemeistert' && h('span', { class: 'marke gut' }, 'Meilenstein gemeistert')),
    h('p', { class: 'meinekrone', id: 'meine-krone' }, meine
      ? [kroneBild(meine, 30), h('span', {}, h('b', {}, `Deine Krone: ${L.KRONEN[meine]}.`), L.unterZiel(meine, ziel) ? ` Für den Meilenstein brauchst du ${L.KRONEN[ziel]}.` : meine !== 'E' ? ' Du kannst sie noch aufwerten.' : '')]
      : [kroneBild(null, 30, { voll: false }), h('span', {}, `Noch keine Krone. Für den Meilenstein brauchst du ${L.KRONEN[ziel]}.`)]),
    kronenWahl(kapitel, niveau),
    h('ul', { class: 'lernziele' }, meilenstein.lernziele.filter((l) => z.index.lernzielMitAufgaben.has(l.id)).map((l) => {
      // Die Punkte zeigen den Weg zur Krone, um die der Schüler gerade spielt. Das Siegel gibt es fürs Zielniveau.
      const st = L.lernzielStand(z.stand, l.id, niveau, z.index);
      const erreicht = Boolean(z.stand.lernziele[l.id]);
      const fest = erreicht && L.istGefestigt(z.stand, l.id);
      return h('li', { class: `${erreicht ? 'erreicht' : ''}${fest ? ' gefestigt' : ''}` },
        siegel(24, erreicht),
        h('span', { class: 'text' }, l.text, fest && h('span', { class: 'fest', title: 'Auch nach mehr als einer Woche noch gewusst.' }, 'gefestigt')),
        h('span', { class: 'punkte', title: `${st.erreicht ? 3 : st.fortschritt} von ${L.LERNZIEL_RICHTIGE} für ${L.KRONEN[niveau]}` }, [0, 1, 2].map((i) => h('i', { class: i < (st.erreicht ? 3 : st.fortschritt) ? 'voll' : '' }))),
        h('button', { class: 'schlicht', onclick: () => starteAufgabe(l.id, niveau) }, erreicht ? 'Weiter üben' : 'Üben'));
    })),
    h('button', { class: 'haupt', id: 'aufbrechen', onclick: () => starteAufgabe(naechstes.id, niveau) }, status === 'gemeistert' ? 'Noch eine Runde' : 'Aufbrechen'),
    merkzettel(meilenstein, z.ansicht));
}

// Kronenwahl: „Spiele um …“. Sie gilt für das ganze Kapitel; voreingestellt ist das Zielniveau (ADR 0012).
// Bronze steht nicht zur Wahl, außer die Lehrkraft hat das Ziel auf F gesetzt (ADR 0015).
function kronenWahl(kapitel, niveau) {
  return h('div', { class: 'kronenwahl', role: 'group', 'aria-label': 'Um welche Krone spielst du?' },
    h('b', {}, 'Spiele um'),
    h('div', { class: 'wahl' }, L.wahlNiveaus(z.einst.zielniveau).map((n) => h('button', { 'data-krone': n, 'aria-pressed': String(n === niveau),
      onclick: () => { if (n !== niveau) { L.setzeNiveau(z.stand, kapitel.id, n); geaendert(); male(); } } },
      kroneBild(n, 28), h('span', {}, L.KRONEN[n]), n === z.einst.zielniveau && h('span', { class: 'ziel' }, 'dein Ziel')))));
}

// ---------- Aufgabe ----------
function starteAufgabe(lernzielId, niveau) {
  // In der Grundlagen-Schleife kommt die Aufgabe von F, bis drei davon richtig sind (ADR 0015).
  const aufgabe = L.naechsteAufgabe(z.index, z.stand, lernzielId, L.aufgabenNiveau(z.stand, lernzielId, niveau));
  // Die Kronenwahl beim ersten Start eines Meilensteins ist die Selbsteinschätzung.
  const ms = z.index.meilensteinVon.get(lernzielId);
  if (ms) L.merkeWahl(z.stand, z.index, ms, niveau, jetzt());
  // Seitenblick (ADR 0016): ab der vierten Aufgabe eines Wegstücks einmal ein schon besiegeltes Lernziel des Kapitels.
  if (!L.inGrundlage(z.stand, lernzielId) && L.seitenblickFaellig(z.stand)) {
    const blick = L.waehleSeitenblick(z.index, z.stand, lernzielId, niveau);
    if (blick) return zeigeAufgabe(blick, { seitenblick: { zurueck: lernzielId, niveau } });
  }
  zeigeAufgabe(aufgabe);
}
function zeigeAufgabe(aufgabe, extra = {}) {
  // Heftcheck vor der nächsten Aufgabe, nicht mitten im Rückblick und nicht beim Nachlösen.
  if (!extra.rueckblick && !extra.heftNachloesen && !extra.einstieg && !extra.bruecke) {
    const frage = L.heftcheckFrage(z.stand, z.index);
    if (frage) return zeige({ name: 'heftcheck', frage, danach: { aufgabe, extra }, gewaehlt: null });
  }
  const offen = L.kartenZuBeginn(aufgabe); // auf F liegt der Tipp von Anfang an offen
  z.stand.aktiv = { aufgabe: aufgabe.id, seit: jetzt(), fehlversuche: 0, hilfen: offen };
  geaendert();
  zeige({ name: 'aufgabe', aufgabe, beginn: Date.now(), versuch: 0, hilfen: offen, eingaben: [], fehlvorstellungen: [], hinweis: null, ergebnis: null,
    reihenfolge: aufgabe.format === 'zuordnen' ? mische(aufgabe.paare.map((p) => p.rechts)) : null, ...extra });
}

function aufgabenAnsicht() {
  const a = z.ansicht, auf = a.aufgabe;
  const kapitelId = L.kapitelVon(auf.lernziel);
  const lernziel = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === auf.lernziel);
  const meilenstein = z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.lernziele.includes(lernziel));
  const st = L.lernzielStand(z.stand, auf.lernziel, auf.niveau, z.index); // Fortschritt zur Krone dieser Farbe
  // Eine F-Aufgabe beim Üben am Meilenstein gehört zur Grundlagen-Schleife, außer das Ziel des Kindes ist F (ADR 0015).
  const grundlage = !a.rueckblick && !a.bruecke && !a.einstieg && !a.seitenblick && auf.niveau === 'F' && z.einst.zielniveau !== 'F';
  const training = !grundlage && L.NIVEAUS.indexOf(auf.niveau) < L.NIVEAUS.indexOf(z.einst.zielniveau);
  const punkte = grundlage ? (L.inGrundlage(z.stand, auf.lernziel) ? L.grundlageRichtige(z.stand, auf.lernziel) : L.GRUNDLAGE_RICHTIGE) : st.erreicht ? 3 : st.fortschritt;
  const fertig = Boolean(a.ergebnis);
  // Sicherheitsangabe (ADR 0014): Beim ersten Versuch gibt es zwei Prüfen-Knöpfe, wenn die Lehrkraft sie eingeschaltet hat.
  const zweiKnoepfe = !fertig && a.versuch === 0 && z.einst.sicherheitsangabe && !a.einstieg;
  const formular = h('form', { class: 'antwort', onsubmit: (e) => { e.preventDefault(); if (!fertig) pruefe(formular, zweiKnoepfe ? e.submitter?.dataset.sicher === 'ja' : null); } },
    eingabefelder(auf, a, fertig),
    zweiKnoepfe ? h('div', { class: 'sicherwahl' },
      h('button', { class: 'haupt', id: 'pruefen', type: 'submit', 'data-sicher': 'ja' }, 'Prüfen – ich bin sicher'),
      h('button', { class: 'haupt hell', id: 'pruefen-unsicher', type: 'submit', 'data-sicher': 'nein' }, 'Prüfen – ich bin unsicher'))
      : !fertig && h('button', { class: 'haupt', id: 'pruefen', type: 'submit' }, a.versuch === 0 ? 'Prüfen' : 'Noch einmal prüfen'));
  return h('section', { class: 'aufgabe', 'data-aufgabe': auf.id },
    h('div', { class: 'karte' },
      h('div', { class: 'aufgabenkopf' },
        a.rueckblick && h('span', { class: 'marke rueckblickmarke' }, rueckblickNummer(a, fertig)),
        a.seitenblick && h('span', { class: 'marke seitenblickmarke', id: 'seitenblick-marke', title: 'Ein Blick zurück auf ein Lernziel, das du schon kannst. Dein Siegel behältst du in jedem Fall.' }, 'Seitenblick'),
        a.bruecke && h('span', { class: 'marke brueckenmarke' }, brueckeNummer(a, fertig)),
        a.einstieg ? h('span', { class: 'marke einstiegmarke' }, einstiegNummer(a, fertig))
          : grundlage ? h('span', { class: 'marke grundlagenmarke', id: 'grundlage-marke' }, 'Grundlage')
          : h('span', { class: 'kronenmarke' }, kroneBild(auf.niveau, 22), `Spiel um ${L.KRONEN[auf.niveau]}`),
        !a.einstieg && !a.seitenblick && training && h('span', { class: 'marke', title: `Unter deinem Ziel ${L.KRONEN[z.einst.zielniveau]} gibt es weniger Münzen und kein Siegel.` }, 'Training'),
        h('span', { class: 'ziel' }, lernziel.text),
        !a.einstieg && h('span', { class: 'punkte', title: grundlage ? `${punkte} von ${L.GRUNDLAGE_RICHTIGE} Aufgaben zur Grundlage` : `Fortschritt beim Lernziel für ${L.KRONEN[auf.niveau]}` }, [0, 1, 2].map((i) => h('i', { class: i < punkte ? 'voll' : '' })))),
      auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
      auf.bild && h('div', { class: 'bildrahmen zumtext' }, aufgabenBild(auf.bild)),
      formular,
      a.ueberraschung && !fertig && h('p', { class: 'hinweis ueberraschung', id: 'ueberraschung' }, a.ueberraschung),
      a.hinweis && !fertig && h('p', { class: 'hinweis', role: 'alert' }, a.hinweis),
      !fertig && !a.einstieg && kaertchen(a),
      fertig && ergebnisTafel(a, kapitelId, meilenstein)),
    !fertig && !a.einstieg && hilfen(a, meilenstein));
}

function eingabefelder(auf, a, gesperrt) {
  const zahlfeld = (name, einheit, wert) => h('span', { class: 'zahlfeld' },
    h('input', { name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 9, disabled: gesperrt, value: wert ?? '', 'aria-label': 'Deine Antwort' }),
    einheit && h('span', { class: 'einheit' }, einheit));
  // Ziffernfeld: genau eine Ziffer, ohne Abstand mitten in einer Zahl (Ziffernrätsel) oder in einem Rechenraster.
  const ziffernfeld = (name, wert, stellen = 1) => h('input', { class: 'ziffer', name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: stellen, maxLength: stellen, disabled: gesperrt, value: wert ?? '', 'aria-label': 'Fehlende Ziffer' });
  const letzte = a.eingaben.at(-1);
  switch (auf.format) {
    case 'zahl': return zahlfeld('zahl', auf.einheit, letzte);
    case 'auswahl': return h('div', { class: 'optionen' },
      auf.mehrfach && h('p', { class: 'klein' }, 'Kreuze alle passenden Antworten an.'),
      auf.optionen.map((o) => h('label', { class: 'option' },
        h('input', { type: auf.mehrfach ? 'checkbox' : 'radio', name: 'option', value: o.text, disabled: gesperrt, checked: Boolean(letzte?.includes(o.text)) }), h('span', {}, o.text))));
    case 'luecken': return h('p', { class: 'aufgabentext luecken' }, auf.text.split(/(\{\{\w+\}\})/).map((stueck) => {
      const m = stueck.match(/^\{\{(\w+)\}\}$/);
      if (!m) return stueck;
      return auf.ziffernfelder ? ziffernfeld(`luecke-${m[1]}`, letzte?.[m[1]]) : zahlfeld(`luecke-${m[1]}`, null, letzte?.[m[1]]);
    }));
    case 'zuordnen': return h('div', { class: 'zuordnen' }, auf.paare.map((p) => h('label', {}, h('b', {}, p.links),
      h('select', { name: `paar-${p.links}`, disabled: gesperrt }, h('option', { value: '' }, 'bitte wählen'),
        a.reihenfolge.map((r) => h('option', { value: r, selected: letzte?.[p.links] === r }, r))))));
    case 'sachaufgabe': return h('ol', { class: 'teile' }, auf.teile.map((t, i) => h('li', {}, h('span', {}, t.text), zahlfeld(`teil-${i}`, t.einheit, letzte?.[i]))));
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
      // Zahlenmauer: Steine in Reihen, in die leeren Steine wird direkt eingetragen.
      if (t.art === 'mauer') return h('div', { class: 'bildrahmen' }, h('div', { class: `mauer${t.rechenart === '·' ? ' malmauer' : ''}`, role: 'group', 'aria-label': t.rechenart === '·' ? 'Mal-Mauer' : 'Zahlenmauer' },
        t.zeilen.map((reihe) => h('div', { class: 'mauerreihe' }, reihe.map((c) => h('span', { class: `stein${typeof c === 'object' ? ' offen' : ''}` }, typeof c === 'object' ? feld(c) : c))))));
      // Malkreuz: Zerlegung oben und links, Teilprodukte in den Feldern, darunter die Summe.
      if (t.art === 'malkreuz') return h('div', { class: 'bildrahmen' }, h('table', { class: 'aufgabentabelle malkreuz' },
        h('thead', {}, h('tr', {}, t.kopf.map((k, i) => h('th', { scope: 'col', class: i === 0 ? 'zeichen' : '' }, k)))),
        h('tbody', {}, t.zeilen.map((zeile) => h('tr', {}, zeile.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', {}, typeof c === 'object' ? feld(c) : c))))))),
        h('p', { class: 'malkreuzsumme' }, `${t.rechnung.faktoren[0]} · ${t.rechnung.faktoren[1]} = `, feld({ luecke: t.rechnung.summe })));
      // Rechenraster beim Multiplizieren: wie im Heft, ohne Kopfzeile; Striche unter der Aufgabe und über dem Ergebnis.
      if (t.art === 'raster' && t.rechnung?.zeichen === '·') return h('div', { class: 'bildrahmen' }, h('table', { class: 'aufgabentabelle raster malraster' },
        h('tbody', {}, t.zeilen.map((zeile, r) => h('tr', { class: r === 0 ? 'aufgabe' : r === t.zeilen.length - 1 ? 'ergebnis' : 'teil' }, zeile.map((c) => h('td', {},
          typeof c === 'object' ? ziffernfeld(`luecke-${c.luecke}`, letzte?.[c.luecke]) : c)))))));
      return h('div', { class: 'bildrahmen' }, h('table', { class: `aufgabentabelle${auf.tabelle.art === 'raster' ? ' raster' : ''}` },
      h('thead', {}, h('tr', {}, auf.tabelle.kopf.map((k) => h('th', { scope: 'col' }, k)))),
      h('tbody', {}, auf.tabelle.zeilen.map((zeile) => h('tr', {}, zeile.map((zelle, i) => (typeof zelle === 'object'
        ? h('td', {}, auf.tabelle.art === 'raster' ? ziffernfeld(`luecke-${zelle.luecke}`, letzte?.[zelle.luecke], String(auf.luecken[zelle.luecke].loesung).length > 1 ? 2 : 1) : zahlfeld(`luecke-${zelle.luecke}`, null, letzte?.[zelle.luecke]))
        : h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, zelle))))))));
    }
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
    case 'sachaufgabe': { const v = auf.teile.map((_, i) => feld(`teil-${i}`)); return { eingabe: v, leer: v.some((x) => !x) }; }
    default: return { eingabe: null, leer: true };
  }
}

function pruefe(formular, sicher = null) {
  const a = z.ansicht, auf = a.aufgabe;
  const { eingabe, leer } = liesEingabe(auf, formular);
  if (leer) { a.hinweis = 'Da fehlt noch etwas. Fülle alles aus, bevor du prüfst.'; return maleMitEntwurf(eingabe); }
  if (a.versuch === 0 && sicher != null) a.sicher = sicher;
  const ergebnis = L.pruefeAntwort(auf, eingabe);
  a.versuch++;
  a.eingaben.push(eingabe);
  if (ergebnis.fehlvorstellung) a.fehlvorstellungen.push(ergebnis.fehlvorstellung);
  // Einstiegscheck: ein Versuch, keine Münzen, zählt für kein Lernziel.
  if (a.einstieg) {
    const einstieg = L.trageEinstiegEin(z.stand, a.einstieg, auf, { geloest: ergebnis.richtig, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen, dauer: Math.round((Date.now() - a.beginn) / 1000) }, jetzt());
    z.stand.aktiv = null;
    a.ergebnis = { richtig: ergebnis.richtig, einstieg };
    geaendert(); z.dienst.sofort();
    return male();
  }
  if (!ergebnis.richtig && a.versuch < 2) {
    const gezielt = ergebnis.fehlvorstellung && z.pool.fehlvorstellungen[ergebnis.fehlvorstellung]?.hinweis;
    // Nach dem ersten Fehlversuch geht der Tipp von selbst auf. Er kostet nichts (ADR 0010). Auf E bleibt er zu (ADR 0015).
    const tippNeu = a.hilfen === 0 && L.tippVonSelbst(auf);
    if (tippNeu) a.hilfen = 1;
    a.hinweis = `Das stimmt noch nicht. ${gezielt ?? 'Rechne noch einmal in Ruhe nach.'}${tippNeu ? ' Unten liegt jetzt ein Tipp für dich.' : ''} Du hast noch einen Versuch, und er kostet dich nichts.`;
    // Sicher, aber falsch: Hier lohnt genaues Hinschauen besonders (Hyperkorrektur, ADR 0014).
    if (a.sicher === true) {
      const typisch = ergebnis.fehlvorstellung && z.pool.fehlvorstellungen[ergebnis.fehlvorstellung]?.beschreibung;
      a.ueberraschung = `Überraschung! Du warst dir sicher, aber das stimmt noch nicht. Schau genau hin.${typisch ? ` Typischer Fehler: ${typisch}` : ''}`;
    }
    if (z.stand.aktiv) { z.stand.aktiv.fehlversuche = a.versuch; z.stand.aktiv.hilfen = a.hilfen; geaendert(); }
    return male();
  }
  const buchung = L.verbuche(z.stand, auf, { geloest: ergebnis.richtig, versuche: a.versuch, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen,
    hilfen: a.hilfen, karten: kartenVon(auf).slice(0, a.hilfen), dauer: Math.round((Date.now() - a.beginn) / 1000), ...(a.sicher != null && { sicher: a.sicher }) },
  z.einst.zielniveau, jetzt(), z.index, { rueckblick: Boolean(a.rueckblick), bruecke: Boolean(a.bruecke), seitenblick: Boolean(a.seitenblick) });
  if (a.rueckblick) buchung.rueckblick = L.trageRueckblickEin(z.stand, auf, ergebnis.richtig, jetzt());
  if (a.bruecke) buchung.bruecke = L.trageBrueckeEin(z.stand, auf, ergebnis.richtig, jetzt());
  if (zaehltFuerWegstueck(a)) buchung.wegstueck = L.trageWegstueckEin(z.stand, auf, { richtig: ergebnis.richtig, muenzen: buchung.muenzen, seitenblick: Boolean(a.seitenblick) }, jetzt());
  // „Du kannst mehr, als du denkst“ (ADR 0017): nach „unsicher“ und richtig, höchstens einmal je Wegstück.
  if (zaehltFuerWegstueck(a)) buchung.mut = L.mutSatzFaellig(z.stand);
  if (ergebnis.richtig && z.einst.ton) klinge(buchung.wegstueck?.fertig || buchung.neuesLernziel ? 'gross' : 'klein');
  buchung.anspruchFehlt = !buchung.neuesLernziel && L.lernzielStand(z.stand, auf.lernziel, z.einst.zielniveau, z.index).anspruchFehlt;
  z.stand.aktiv = null;
  a.ergebnis = { ...buchung, richtig: ergebnis.richtig };
  a.seit = Date.now();
  geaendert();
  z.dienst.sofort();
  male();
}
// Unvollständige Eingabe: Hinweis zeigen, ohne schon Getipptes zu verlieren.
function maleMitEntwurf(eingabe) {
  const a = z.ansicht;
  a.eingaben.push(eingabe); male(); a.eingaben.pop();
}

function loesungstext(auf) {
  const zahl = (t) => `${t.loesung}${t.einheit ? ` ${t.einheit}` : ''}`;
  switch (auf.format) {
    case 'zahl': case 'zahlenstrahl': return zahl(auf);
    case 'diagramm': return auf.teile.length === 1 ? zahl(auf.teile[0]) : auf.teile.map((t, i) => `${'abcdef'[i]}) ${zahl(t)}`).join('  ');
    case 'tabelle': return `Die fehlenden Zahlen der Reihe nach: ${auf.tabelle.zeilen.flat().filter((c) => typeof c === 'object').map((c) => auf.luecken[c.luecke].loesung).join(', ')}`;
    case 'auswahl': return auf.optionen.filter((o) => o.richtig).map((o) => o.text).join(' · ');
    case 'luecken': return auf.text.replace(/\{\{(\w+)\}\}/g, (_, n) => auf.luecken[n].loesung);
    case 'zuordnen': return auf.paare.map((p) => `${p.links} ist ${p.rechts}`).join(', ');
    case 'sachaufgabe': return auf.teile.map((t, i) => `${'abcdef'[i]}) ${zahl(t)}`).join('  ');
    default: return '';
  }
}

// Nach dem Ergebnis: Ist gerade ein Wegstück fertig geworden, kommt erst sein Abschluss (ADR 0016).
function danach(a, fortsetzung) {
  return bereit(() => {
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
  return h('div', { class: 'so-geht-es', id: 'so-geht-es' }, zeigen.map((f) => h('div', { class: 'kaertchen-offen' }, h('b', {}, titel[f]), h('p', {}, auf.hilfen[f]))));
}
// Erste Zeile des Ergebnisses: richtig mit Münzen oder falsch mit Lösung.
function urteilZeile(e, auf, nachsatz) {
  return e.richtig
    ? h('h2', {}, 'Richtig!', h('span', { class: 'lohn' }, muenze(22), h('b', { class: 'plus' }, `+${e.muenzen}`), e.muenzen === 1 ? ' Münze' : ' Münzen'), lernsatz(e))
    : [h('h2', {}, 'Das war noch nicht richtig.'), h('p', {}, 'Die Lösung ist: ', h('b', {}, loesungstext(auf)), `. ${nachsatz ?? ''}`.trimEnd())];
}
// Ein kurzer Satz in der Urteilszeile, wenn sich am Lernen etwas zeigt (ADR 0017). Höchstens einer, damit es zwei Zeilen bleiben.
function lernsatz(e) {
  const text = e.ohneHilfe ? 'Diesmal ganz ohne Beispiel und Lösungsschritt!' : e.mut ? 'Du warst unsicher, aber es stimmt. Du kannst mehr, als du denkst.' : null;
  return text && h('small', { class: 'lernsatz', id: e.ohneHilfe ? 'ohne-hilfe' : 'mut-satz' }, text);
}
// Siegel, Krone und Meilenstein bekommen einen kurzen eigenen Moment, immer nur der wichtigste.
function moment(e, meilenstein) {
  const gemeistert = e.neuesLernziel && L.milestoneStatus(z.index, z.stand, meilenstein) === 'gemeistert';
  const satz = e.einschaetzung ? `Du hattest um ${L.KRONEN[e.einschaetzung.gewaehlt]} gespielt. Geschafft hast du ${L.KRONEN[e.einschaetzung.krone]}.` : null;
  if (gemeistert || e.neueKrone) {
    const n = e.neueKrone?.niveau ?? L.krone(z.index, z.stand, meilenstein);
    return h('div', { class: 'moment', id: e.neueKrone ? 'neue-krone' : 'meilenstein-gemeistert' }, kroneBild(n, 48),
      h('div', {},
        h('b', {}, gemeistert ? `Meilenstein „${meilenstein.titel}“ gemeistert!` : `${e.neueKrone.vorher ? 'Krone aufgewertet' : 'Neue Krone'}: ${L.KRONEN[n]}!`),
        h('p', {}, gemeistert ? (e.neueKrone ? `Deine Krone: ${L.KRONEN[n]}.` : 'Alle Lernziele haben ihr Siegel.')
          : L.unterZiel(n, z.einst.zielniveau) ? `Am Meilenstein „${meilenstein.titel}“. Für den Meilenstein brauchst du ${L.KRONEN[z.einst.zielniveau]}.` : `Am Meilenstein „${meilenstein.titel}“.`),
        satz && h('p', { class: 'klein', id: 'einschaetzung' }, satz)));
  }
  if (e.neuesLernziel) return h('div', { class: 'moment', id: 'neues-siegel' }, siegel(48), h('div', {}, h('b', {}, 'Lernziel erreicht!'), h('p', {}, 'Du bekommst ein Siegel.')));
  return null;
}
function ergebnisTafel(a, kapitelId, meilenstein) {
  if (a.rueckblick) return rueckblickErgebnis(a);
  if (a.einstieg) return einstiegErgebnis(a);
  if (a.bruecke) return brueckeErgebnis(a, meilenstein);
  if (a.seitenblick) return seitenblickErgebnis(a, meilenstein);
  const e = a.ergebnis, auf = a.aufgabe;
  const niveau = L.arbeitsniveau(z.stand, kapitelId, z.einst.zielniveau);
  // In der Grundlagen-Schleife gibt es weder Kronenwechsel noch Brücke: Der Weg zurück ist schon festgelegt.
  const schleife = L.inGrundlage(z.stand, auf.lernziel);
  const vorschlag = schleife ? null : L.niveauVorschlag(z.stand, kapitelId, niveau, z.einst.zielniveau);
  const weiter = (n = niveau) => {
    const fertig = !schleife && (z.stand.lernziele[auf.lernziel] || L.lernzielStand(z.stand, auf.lernziel, n, z.index).erreicht);
    const lz = fertig ? L.naechstesLernziel(z.index, z.stand, meilenstein, n).id : auf.lernziel;
    starteAufgabe(lz, n);
  };
  const ziel = L.NIVEAUS[L.NIVEAUS.indexOf(niveau) + (vorschlag === 'hoch' ? 1 : -1)];
  // Kronenvorschlag und Brücke kommen nacheinander, nie zugleich (ADR 0016).
  const bruecke = !vorschlag && !schleife && !z.stand.lernziele[auf.lernziel] && brueckeAngebot(auf.lernziel);
  // Zweite Zeile: was sich jetzt ändert (Grundlage), sonst der Heftcode.
  const zweite = e.grundlage?.art === 'beginnt' ? h('p', { class: 'grundlage', id: 'grundlage-beginnt' }, h('b', {}, 'Wir üben erst die Grundlage. '), `Die nächsten Aufgaben sind leichter. Nach ${L.GRUNDLAGE_RICHTIGE} richtigen Aufgaben geht es hier weiter.`)
    : e.grundlage?.art === 'endet' ? h('p', { class: 'grundlage', id: 'grundlage-endet' }, h('b', {}, 'Jetzt klappt auch der nächste Schritt. '), `Du spielst wieder um ${L.KRONEN[niveau]}.`)
      : heftHinweis(e);
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    urteilZeile(e, auf, e.grundlage?.art === 'beginnt' ? null : 'Gleich kommt eine ähnliche Aufgabe.'),
    zweite,
    e.anspruchFehlt && h('p', { class: 'klein', id: 'anspruch' }, 'Für das Siegel fehlt noch eine Aufgabe, bei der du mehr als nur rechnen musst.'),
    !e.richtig && soGehtEs(auf),
    moment(e, meilenstein),
    vorschlag && h('div', { class: 'vorschlag' },
      h('p', {}, vorschlag === 'hoch'
        ? `Das läuft richtig gut. Möchtest du um ${L.KRONEN[ziel]} spielen? Dort sind die Aufgaben anspruchsvoller und bringen mehr Münzen.`
        : `Diese Aufgaben sind gerade ganz schön schwer. Möchtest du um ${L.KRONEN[ziel]} spielen und dort Sicherheit sammeln?`),
      h('button', { class: 'haupt', id: 'krone-wechseln', onclick: danach(a, () => { L.setzeNiveau(z.stand, kapitelId, ziel); geaendert(); weiter(ziel); }) }, kroneBild(ziel, 20), ` Um ${L.KRONEN[ziel]} spielen`),
      h('button', { class: 'schlicht', onclick: danach(a, () => { L.lehneVorschlagAb(z.stand, kapitelId); geaendert(); weiter(); }) }, `Bei ${L.KRONEN[niveau]} bleiben`)),
    bruecke && h('div', { class: 'vorschlag bruecke', id: 'bruecke-angebot' },
      h('p', {}, h('b', {}, 'Wie wäre es mit einer Brücke? '), `Für „${lernzielText(auf.lernziel)}“ hilft es, zuerst „${lernzielText(bruecke.zu)}“ zu festigen. Das sind ${L.BRUECKE_AUFGABEN} kurze Aufgaben um ${L.KRONEN[L.brueckenNiveau(z.einst.zielniveau)]}, danach geht es hier weiter.`),
      h('button', { class: 'haupt', id: 'bruecke-start', onclick: danach(a, () => starteBruecke(bruecke)) }, 'Brücke gehen'),
      h('button', { class: 'schlicht', id: 'bruecke-nein', onclick: () => { z.brueckeAbgelehnt.add(auf.lernziel); male(); } }, 'Nein danke')),
    !vorschlag && !bruecke && h('div', { class: 'knoepfe' },
      h('button', { class: 'haupt', id: 'weiter', onclick: danach(a, () => weiter()) }, 'Nächste Aufgabe'),
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
    h('div', { class: 'knoepfe' },
      h('button', { class: 'haupt', id: 'weiter', onclick: bereit(() => { clearInterval(rastUhr); if (rast) merke('uebersprungen'); a.fortsetzung(); }) }, rast ? 'Rast überspringen' : 'Nächstes Wegstück'),
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
  return `Einstiegscheck ${Math.min(e.aufgaben.length, e.erledigt.length + (fertig ? 0 : 1))} von ${e.aufgaben.length}`;
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
  return h('div', { class: 'ergebnis neutral', role: 'status', id: 'einstieg-fertig' },
    h('h2', {}, 'Einstiegscheck geschafft!'),
    h('p', {}, `Du hast ${r.richtig} von ${r.gesamt} Aufgaben gelöst.`),
    h('p', { class: 'lohn neu' }, kroneBild(n, 32), h('b', {}, `Unser Vorschlag: Spiel um ${L.KRONEN[n]}.`),
      L.unterZiel(n, z.einst.zielniveau) ? ` Dort sammelst du erst Sicherheit. Für die Meilensteine brauchst du später ${L.KRONEN[z.einst.zielniveau]}.` : ''),
    h('button', { class: 'haupt', id: 'einstieg-krone', onclick: () => { L.setzeNiveau(z.stand, kapitel.id, n); geaendert(); zeige({ name: 'region', kapitel: kapitel.id }); } }, kroneBild(n, 20), ` Um ${L.KRONEN[n]} spielen`),
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
    starteAufgabe(r.fuer, L.arbeitsniveau(z.stand, kap, z.einst.zielniveau));
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
const heftHinweis = (e) => e.heft && h('p', { class: 'heftcode', id: 'heftcode' }, h('b', { class: 'code' }, e.heft), ' Schreib den Code und dein Ergebnis ins Heft. Ab und zu fragt dich der Heftcheck danach.');

// ---------- Heftcheck (ADR 0014) ----------
function heftcheckAnsicht() {
  const a = z.ansicht, f = a.frage;
  const weiter = () => zeigeAufgabe(a.danach.aufgabe, a.danach.extra); // der Zähler steht wieder auf null
  if (a.gewaehlt == null) {
    return h('section', { class: 'karte heftcheck' },
      h('span', { class: 'klein' }, 'Heftcheck'),
      h('h1', {}, `Schau in dein Heft: Was hattest du bei ${f.heft} heraus?`),
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
        h('button', { class: 'haupt', id: 'heftcheck-nachloesen', onclick: () => zeigeAufgabe(aufgabe, { heftNachloesen: true, heftAufgabe: f.heft }) }, `Aufgabe ${f.heft} lösen`)]);
}

const kartenVon = (auf) => L.KARTEN.filter((feld) => auf.hilfen[feld]);
const meilensteinVon = (auf) => z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.lernziele.some((l) => l.id === auf.lernziel));
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
    ? h('div', { class: 'kaertchen-offen' }, h('b', {}, titel), h('p', {}, a.aufgabe.hilfen[feld]))
    : h('button', { class: `kaertchen-zu${i > a.hilfen ? ' spaeter' : ''}`, type: 'button', disabled: i > a.hilfen, 'data-hilfe': feld, onclick: () => { a.hilfen++; if (z.stand.aktiv) { z.stand.aktiv.hilfen = a.hilfen; geaendert(); } maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); } },
      h('b', {}, titel), h('span', {}, i > a.hilfen ? 'Erst das Kärtchen davor.' : kosten))));
}
// Seitenleiste: Wortspeicher, Merkzettel und der Hilferuf an die Lehrkraft.
function hilfen(a, meilenstein = meilensteinVon(a.aufgabe)) {
  return h('aside', { class: 'hilfen' },
    wortspeicher(meilenstein, a),
    merkzettel(meilenstein, a),
    !z.stand.hilferuf && h('button', { class: 'schlicht hilferuf', id: 'hilferuf', onclick: () => { L.rufeHilfe(z.stand, a.aufgabe.id, jetzt()); z.wartePlatz = null; geaendert(); z.dienst.sofort(); maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); takt(); } },
      'Ich brauche Hilfe von meiner Lehrkraft'));
}

// ---------- Wappen ----------
function wappenAnsicht() {
  const r = L.rang(L.siegel(z.stand));
  const w = z.stand.wappen;
  const teilKarte = (teil) => {
    const gekauft = w.gekauft.includes(teil.id);
    const an = teil.art === 'farbe' ? w.farbe === teil.id : w.zeichen.includes(teil.id);
    const rangFehlt = r.stufe < teil.rang;
    return h('li', { class: `teil ${an ? 'an' : ''}` },
      teil.art === 'farbe' ? h('span', { class: 'farbfeld', style: `background:${teil.wert}` }) : h('span', { class: 'vorschau' }, wappenBild({ farbe: w.farbe, zeichen: [teil.id] }, 44)),
      h('b', {}, teil.name),
      gekauft
        ? h('button', { class: an ? 'haupt' : 'schlicht', 'data-teil': teil.id, onclick: () => { L.legeAn(z.stand, teil.id); geaendert(); male(); } }, teil.art === 'farbe' ? (an ? 'Gewählt' : 'Wählen') : (an ? 'Abnehmen' : 'Anbringen'))
        : teil.expedition ? h('span', { class: 'klein' }, 'Belohnung einer geschafften Expedition')
        : rangFehlt ? h('span', { class: 'klein' }, `Ab Rang ${L.RAENGE[teil.rang].name}`)
          : h('button', { class: 'schlicht', 'data-teil': teil.id, disabled: z.stand.muenzen < teil.preis, onclick: () => { L.kaufe(z.stand, teil.id); L.legeAn(z.stand, teil.id); geaendert(); male(); } }, muenze(16), ` ${teil.preis} kaufen`));
  };
  const bestwert = Math.max(0, ...z.stand.spiele.map((x) => x.punkte));
  return h('section', {},
    h('h1', {}, 'Dein Wappen'),
    h('div', { class: 'werkbank' }, wappenBild(w, 150),
      h('div', {}, h('p', { class: 'unter' }, `Rang: ${r.name}`),
        h('p', {}, r.naechster ? `Mit ${r.naechster.ab} Siegeln wirst du ${r.naechster.name} und schaltest neue Teile frei.` : 'Du hast den höchsten Rang erreicht.'),
        h('p', { class: 'klein' }, 'Siegel bekommst du für erreichte Lernziele, Kronen an den Meilensteinen. Münzen gibst du hier für dein Wappen aus.'))),
    h('h2', {}, 'Farben'), h('ul', { class: 'teile-liste' }, L.WAPPEN_TEILE.filter((x) => x.art === 'farbe').map(teilKarte)),
    h('h2', {}, 'Zeichen'), h('ul', { class: 'teile-liste' }, L.WAPPEN_TEILE.filter((x) => x.art === 'zeichen').map(teilKarte)),
    h('h2', {}, 'Spielpause'),
    h('div', { class: 'karte' },
      h('p', {}, h('b', {}, 'Kopfrechen-Sprint: '), `Löse in ${L.MINISPIEL_SEKUNDEN} Sekunden so viele Aufgaben wie möglich.`, bestwert ? ` Dein Bestwert: ${bestwert}.` : ''),
      !z.einst.spielpause ? h('p', { class: 'klein' }, 'Gerade ist keine Spielpause. Deine Lehrkraft schaltet sie frei.')
        : h('button', { class: 'haupt', id: 'spiel', disabled: z.stand.muenzen < L.MINISPIEL_PREIS, onclick: () => {
          if (L.starteMinispiel(z.stand, z.einst.spielpause) === 'ok') { geaendert(); zeige({ name: 'minispiel', ende: Date.now() + L.MINISPIEL_SEKUNDEN * 1000, punkte: 0, frage: L.kopfrechenAufgabe() }); }
        } }, muenze(16), ` ${L.MINISPIEL_PREIS} Münzen: Spiel starten`)));
}

// ---------- Minispiel ----------
let spieluhr = null;
function minispiel() {
  const a = z.ansicht;
  clearInterval(spieluhr);
  if (a.vorbei) {
    return h('section', { class: 'karte spiel' }, h('h1', {}, 'Zeit ist um!'), h('p', { class: 'gross' }, `${a.punkte} richtige Aufgaben`),
      h('button', { class: 'haupt', onclick: () => zeige({ name: 'wappen' }) }, 'Zurück zum Wappen'));
  }
  const rest = () => Math.max(0, Math.ceil((a.ende - Date.now()) / 1000));
  const uhr = h('b', { class: 'uhr' }, `${rest()} s`);
  spieluhr = setInterval(() => {
    uhr.textContent = `${rest()} s`;
    if (rest() === 0) { clearInterval(spieluhr); a.vorbei = true; z.stand.spiele.push({ t: jetzt(), punkte: a.punkte }); geaendert(); male(); }
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

// ---------- Start ----------
export function starte(ziel) {
  wurzel = ziel;
  document.head.append(h('style', {}, stil + VERSION_STIL));
  male();
  setTimeout(() => wurzel.querySelector('#code')?.focus());
}
if (typeof document !== 'undefined') {
  const ziel = document.getElementById('mathekingdom') ?? document.body.appendChild(h('div', { id: 'mathekingdom' }));
  starte(ziel);
}
