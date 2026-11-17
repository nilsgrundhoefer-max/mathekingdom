// Schüler-Dashboard: Oberfläche. Die Regeln stehen in logik.js, der Dateizugriff in speicher.js.
import { pruefePin } from '../gemeinsam/krypto.js';
import stil from './stil.css';
import { h, mische } from './dom.js';
import * as L from './logik.js';
import * as S from './speicher.js';
import { wappenBild, regionMap, muenze, siegel, routeMuster, gartentor, schlossBild, zahlenstrahl, saeulendiagramm } from './bilder.js';

const jetzt = () => new Date().toISOString();
const z = { // Zustand der laufenden Sitzung
  ablage: null, stand: null, pool: null, index: null, klassendatei: null, einst: null, dienst: null,
  ansicht: { name: 'anmeldung' }, speicherstatus: null, meldung: null, wartePlatz: null,
};
let wurzel;

// ---------- Rahmen ----------
function zeige(ansicht) {
  z.ansicht = ansicht;
  if (ansicht.name !== 'aufgabe' && z.stand?.aktiv) {
    // Aufgabe ohne Ergebnis verlassen: für das Aufgaben-Audit der Lehrkraft festhalten.
    const a = z.stand.aktiv;
    (z.stand.abbrueche ??= []).push({ t: jetzt(), aufgabe: a.aufgabe, fehlversuche: a.fehlversuche ?? 0, hilfen: a.hilfen ?? 0 });
    z.stand.aktiv = null; z.dienst.markiere();
  }
  male();
}
function geaendert() { z.dienst?.markiere(); }
function male() {
  const ansichten = { anmeldung, schlossgarten, region: regionsAnsicht, aufgabe: aufgabenAnsicht, wappen: wappenAnsicht, minispiel };
  wurzel.replaceChildren(...[
    z.stand && kopf(),
    z.stand && hilfeBanner(),
    z.stand && nachrichtBanner(),
    z.meldung && h('div', { class: 'meldung', role: 'status' }, z.meldung, h('button', { class: 'schlicht', onclick: () => { z.meldung = null; male(); } }, 'Schließen')),
    h('main', {}, ansichten[z.ansicht.name]()),
  ].filter(Boolean));
}

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
  const { pool } = await S.ladePool(ablage, klassenstufe);
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
  z.dienst = S.speicherdienst(ablage, () => z.stand, (status) => { z.speicherstatus = status; maleStatus(); });
  if (!geladen.stand || geladen.hinweis) { z.dienst.markiere(); z.dienst.sofort(); }
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
  if (alt) alt.replaceWith(kopf().querySelector('#speicherstatus'));
}

// Alle 10 Sekunden: Vorgaben der Lehrkraft neu lesen und die Warteschlange prüfen.
async function takt() {
  try {
    const gelesen = await S.ladeKlassendatei(z.ablage);
    // Eine fehlende oder veränderte Klassendatei ändert nichts: Es gilt weiter die letzte gültige.
    if (gelesen.status === 'ok' || gelesen.status === 'ungeprueft') z.klassendatei = gelesen.daten;
    const bild = (e) => JSON.stringify([...e.offeneKapitel, e.spielpause, e.zielniveau, e.hilfeAntwort, e.nachricht, [...e.gesperrteMeilensteine]]);
    const vorher = bild(z.einst);
    z.einst = einstellungenJetzt();
    const ruf = z.stand.hilferuf, antwort = z.einst.hilfeAntwort;
    let neu = vorher !== bild(z.einst);
    if (ruf && antwort?.zu === ruf.seit && antwort.status === 'erledigt') {
      L.beendeHilferuf(z.stand, 'erledigt', jetzt()); geaendert(); z.dienst.sofort(); neu = true;
      z.hilfeErledigt = true;
      setTimeout(() => { z.hilfeErledigt = false; wurzel.querySelector('.hilfebanner.erledigt')?.remove(); }, 20000);
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
    z.ansicht = { name: 'region', kapitel: k.id, milestone: e.milestone.id };
    starteAufgabe(L.naechstesLernziel(z.index, z.stand, e.milestone).id, L.arbeitsniveau(z.stand, k.id, z.einst.zielniveau));
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
  const milestones = kapitel.unterkapitel.map((u) => ({ id: u.id, titel: u.titel, extra: u.extra, status: zu.has(u.id) ? 'gesperrt' : L.milestoneStatus(z.index, z.stand, u) }));
  const standort = (milestones.find((m) => m.status === 'begonnen') ?? milestones.find((m) => m.status === 'offen') ?? milestones[0]).id;
  const gewaehlt = z.ansicht.milestone ?? standort;
  const meilenstein = kapitel.unterkapitel.find((u) => u.id === gewaehlt);
  const karte = regionMap({ milestones, niveau, zielniveau: z.einst.zielniveau, standort, gewaehlt, wappen: z.stand.wappen,
    beiMeilenstein: (id) => zeige({ ...z.ansicht, milestone: id }),
    beiStrasse: (n) => { if (n !== niveau) { L.setzeNiveau(z.stand, kapitel.id, n); geaendert(); male(); } } });
  return h('section', {},
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'schlossgarten' }) }, '← Schlossgarten')),
    h('h1', {}, kapitel.titel),
    h('p', { class: 'unter' }, `Du wanderst auf dem ${L.ROUTE_NAMEN[niveau]} (${niveau}, ${L.NIVEAU_NAMEN[niveau]}). Tippe links auf eine andere Straße, um die Straße zu wechseln. Die Nummern auf den Meilensteinen sind ein Vorschlag: Du darfst jeden offenen Meilenstein wählen.`),
    h('div', { class: 'kartenrahmen' }, karte),
    legende(),
    meilensteinTafel(kapitel, meilenstein, niveau));
}
function legende() {
  return h('ul', { class: 'legende', 'aria-label': 'Zeichenerklärung' },
    L.NIVEAUS.map((n) => h('li', {}, routeMuster(n), `${n} ${L.ROUTE_NAMEN[n]}`)),
    h('li', {}, siegel(16), 'gemeistert'));
}

function meilensteinTafel(kapitel, meilenstein, niveau) {
  const status = L.milestoneStatus(z.index, z.stand, meilenstein);
  if (z.einst.gesperrteMeilensteine.has(meilenstein.id)) {
    return h('div', { class: 'karte tafel gesperrt' }, h('h2', {}, `${meilenstein.titel} 🔒`), h('p', {}, 'Diesen Meilenstein hat deine Lehrkraft für dich noch nicht geöffnet. Wähle einen anderen Meilenstein.'));
  }
  if (status === 'leer') {
    return h('div', { class: 'karte tafel' }, h('h2', {}, meilenstein.titel), h('p', {}, 'An diesem Meilenstein gibt es noch keine Aufgaben. Er wird bald eröffnet.'));
  }
  const naechstes = L.naechstesLernziel(z.index, z.stand, meilenstein);
  return h('div', { class: 'karte tafel' },
    h('h2', {}, meilenstein.titel, status === 'gemeistert' && h('span', { class: 'marke gut' }, 'Meilenstein gemeistert')),
    h('ul', { class: 'lernziele' }, meilenstein.lernziele.filter((l) => z.index.lernzielMitAufgaben.has(l.id)).map((l) => {
      const st = L.lernzielStand(z.stand, l.id, z.einst.zielniveau, z.index);
      const erreicht = Boolean(z.stand.lernziele[l.id]);
      return h('li', { class: erreicht ? 'erreicht' : '' },
        siegel(24, erreicht),
        h('span', { class: 'text' }, l.text),
        h('span', { class: 'punkte', title: `${st.fortschritt} von ${L.LERNZIEL_RICHTIGE}` }, [0, 1, 2].map((i) => h('i', { class: i < (erreicht ? 3 : st.fortschritt) ? 'voll' : '' }))),
        h('button', { class: 'schlicht', onclick: () => starteAufgabe(l.id, niveau) }, erreicht ? 'Weiter üben' : 'Üben'));
    })),
    h('button', { class: 'haupt', id: 'aufbrechen', onclick: () => starteAufgabe(naechstes.id, niveau) }, status === 'gemeistert' ? 'Noch eine Runde' : 'Aufbrechen'),
    merkzettel(meilenstein, z.ansicht));
}

// ---------- Aufgabe ----------
function starteAufgabe(lernzielId, niveau) {
  const aufgabe = L.naechsteAufgabe(z.index, z.stand, lernzielId, niveau);
  z.stand.aktiv = { aufgabe: aufgabe.id, seit: jetzt(), fehlversuche: 0, hilfen: 0 };
  geaendert();
  zeige({ name: 'aufgabe', aufgabe, beginn: Date.now(), versuch: 0, hilfen: 0, eingaben: [], fehlvorstellungen: [], hinweis: null, ergebnis: null,
    reihenfolge: aufgabe.format === 'zuordnen' ? mische(aufgabe.paare.map((p) => p.rechts)) : null });
}

function aufgabenAnsicht() {
  const a = z.ansicht, auf = a.aufgabe;
  const kapitelId = L.kapitelVon(auf.lernziel);
  const lernziel = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === auf.lernziel);
  const meilenstein = z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.lernziele.includes(lernziel));
  const st = L.lernzielStand(z.stand, auf.lernziel, z.einst.zielniveau, z.index);
  const training = L.NIVEAUS.indexOf(auf.niveau) < L.NIVEAUS.indexOf(z.einst.zielniveau);
  const fertig = Boolean(a.ergebnis);
  const formular = h('form', { class: 'antwort', onsubmit: (e) => { e.preventDefault(); if (!fertig) pruefe(formular); } },
    eingabefelder(auf, a, fertig),
    !fertig && h('button', { class: 'haupt', id: 'pruefen', type: 'submit' }, a.versuch === 0 ? 'Prüfen' : 'Noch einmal prüfen'));
  return h('section', { class: 'aufgabe', 'data-aufgabe': auf.id },
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitelId, milestone: meilenstein.id }) }, `← ${meilenstein.titel}`)),
    h('div', { class: 'karte' },
      h('div', { class: 'aufgabenkopf' },
        h('span', { class: 'strasse' }, routeMuster(auf.niveau, 34), `${auf.niveau} ${L.ROUTE_NAMEN[auf.niveau]}`),
        training && h('span', { class: 'marke' }, 'Training'),
        h('span', { class: 'ziel' }, lernziel.text),
        h('span', { class: 'punkte', title: 'Fortschritt beim Lernziel' }, [0, 1, 2].map((i) => h('i', { class: i < (z.stand.lernziele[auf.lernziel] ? 3 : st.fortschritt) ? 'voll' : '' })))),
      auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
      formular,
      a.hinweis && !fertig && h('p', { class: 'hinweis', role: 'alert' }, a.hinweis),
      fertig && ergebnisTafel(a, kapitelId, meilenstein)),
    !fertig && hilfen(a, meilenstein));
}

function eingabefelder(auf, a, gesperrt) {
  const zahlfeld = (name, einheit, wert) => h('span', { class: 'zahlfeld' },
    h('input', { name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 9, disabled: gesperrt, value: wert ?? '', 'aria-label': 'Deine Antwort' }),
    einheit && h('span', { class: 'einheit' }, einheit));
  const letzte = a.eingaben.at(-1);
  switch (auf.format) {
    case 'zahl': return zahlfeld('zahl', auf.einheit, letzte);
    case 'auswahl': return h('div', { class: 'optionen' },
      auf.mehrfach && h('p', { class: 'klein' }, 'Kreuze alle passenden Antworten an.'),
      auf.optionen.map((o) => h('label', { class: 'option' },
        h('input', { type: auf.mehrfach ? 'checkbox' : 'radio', name: 'option', value: o.text, disabled: gesperrt, checked: Boolean(letzte?.includes(o.text)) }), h('span', {}, o.text))));
    case 'luecken': return h('p', { class: 'aufgabentext luecken' }, auf.text.split(/(\{\{\w+\}\})/).map((stueck) => {
      const m = stueck.match(/^\{\{(\w+)\}\}$/);
      return m ? zahlfeld(`luecke-${m[1]}`, null, letzte?.[m[1]]) : stueck;
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
    case 'tabelle': return h('div', { class: 'bildrahmen' }, h('table', { class: 'aufgabentabelle' },
      h('thead', {}, h('tr', {}, auf.tabelle.kopf.map((k) => h('th', { scope: 'col' }, k)))),
      h('tbody', {}, auf.tabelle.zeilen.map((zeile) => h('tr', {}, zeile.map((zelle, i) => (typeof zelle === 'object'
        ? h('td', {}, zahlfeld(`luecke-${zelle.luecke}`, null, letzte?.[zelle.luecke]))
        : h(i === 0 ? 'th' : 'td', i === 0 ? { scope: 'row' } : {}, zelle))))))));
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

function pruefe(formular) {
  const a = z.ansicht, auf = a.aufgabe;
  const { eingabe, leer } = liesEingabe(auf, formular);
  if (leer) { a.hinweis = 'Da fehlt noch etwas. Fülle alles aus, bevor du prüfst.'; return maleMitEntwurf(eingabe); }
  const ergebnis = L.pruefeAntwort(auf, eingabe);
  a.versuch++;
  a.eingaben.push(eingabe);
  if (ergebnis.fehlvorstellung) a.fehlvorstellungen.push(ergebnis.fehlvorstellung);
  if (!ergebnis.richtig && a.versuch < 2) {
    const gezielt = ergebnis.fehlvorstellung && z.pool.fehlvorstellungen[ergebnis.fehlvorstellung]?.hinweis;
    // Nach dem ersten Fehlversuch geht der Tipp von selbst auf. Er kostet nichts (ADR 0010).
    const tippNeu = a.hilfen === 0 && Boolean(auf.hilfen.tipp);
    if (tippNeu) a.hilfen = 1;
    a.hinweis = `Das stimmt noch nicht. ${gezielt ?? 'Rechne noch einmal in Ruhe nach.'}${tippNeu ? ' Rechts liegt jetzt ein Tipp für dich.' : ''} Du hast noch einen Versuch, und er kostet dich nichts.`;
    if (z.stand.aktiv) { z.stand.aktiv.fehlversuche = a.versuch; z.stand.aktiv.hilfen = a.hilfen; geaendert(); }
    return male();
  }
  const buchung = L.verbuche(z.stand, auf, { geloest: ergebnis.richtig, versuche: a.versuch, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen,
    hilfen: a.hilfen, karten: kartenVon(auf).slice(0, a.hilfen), dauer: Math.round((Date.now() - a.beginn) / 1000) }, z.einst.zielniveau, jetzt(), z.index);
  buchung.anspruchFehlt = !buchung.neuesLernziel && L.lernzielStand(z.stand, auf.lernziel, z.einst.zielniveau, z.index).anspruchFehlt;
  z.stand.aktiv = null;
  a.ergebnis = { ...buchung, richtig: ergebnis.richtig };
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

function ergebnisTafel(a, kapitelId, meilenstein) {
  const e = a.ergebnis, auf = a.aufgabe;
  const niveau = L.arbeitsniveau(z.stand, kapitelId, z.einst.zielniveau);
  const vorschlag = L.niveauVorschlag(z.stand, kapitelId, niveau);
  const gemeistert = L.milestoneStatus(z.index, z.stand, meilenstein) === 'gemeistert';
  const weiter = (n = niveau) => {
    const lz = z.stand.lernziele[auf.lernziel] ? L.naechstesLernziel(z.index, z.stand, meilenstein).id : auf.lernziel;
    starteAufgabe(lz, n);
  };
  const ziel = L.NIVEAUS[L.NIVEAUS.indexOf(niveau) + (vorschlag === 'hoch' ? 1 : -1)];
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    h('h2', {}, e.richtig ? 'Richtig!' : 'Das war noch nicht richtig.'),
    !e.richtig && h('p', {}, 'Die Lösung ist: ', h('b', {}, loesungstext(auf)), '. Schau sie dir in Ruhe an. Gleich kommt eine ähnliche Aufgabe, bei der du es noch einmal versuchen kannst.'),
    e.richtig && h('p', { class: 'lohn' }, muenze(22), h('b', {}, `+${e.muenzen}`), e.muenzen === 1 ? ' Münze' : ' Münzen',
      e.training && ' (Training unter deinem Zielniveau bringt weniger)'),
    e.richtig && auf.afb === 3 && e.muenzen > 1 && h('p', { class: 'klein' }, 'Knobelaufgabe: Dafür gibt es die Hälfte mehr Münzen.'),
    e.neuesLernziel && h('p', { class: 'lohn neu' }, siegel(30), h('b', {}, 'Lernziel erreicht!'), ' Du bekommst ein Siegel.'),
    e.anspruchFehlt && h('p', { class: 'klein', id: 'anspruch' }, 'Für das Siegel fehlt noch eine Aufgabe, bei der du mehr als nur rechnen musst.'),
    e.neuesLernziel && gemeistert && h('p', { class: 'lohn neu' }, h('b', {}, `Meilenstein „${meilenstein.titel}“ gemeistert!`)),
    vorschlag && h('div', { class: 'vorschlag' },
      h('p', {}, vorschlag === 'hoch'
        ? `Das läuft richtig gut. Möchtest du auf den ${L.ROUTE_NAMEN[ziel]} (${ziel}) wechseln? Dort sind die Aufgaben anspruchsvoller und bringen mehr Münzen.`
        : `Diese Aufgaben sind gerade ganz schön schwer. Möchtest du auf den ${L.ROUTE_NAMEN[ziel]} (${ziel}) wechseln und dort Sicherheit sammeln?`),
      h('button', { class: 'haupt', id: 'strasse-wechseln', onclick: () => { L.setzeNiveau(z.stand, kapitelId, ziel); geaendert(); weiter(ziel); } }, `Auf den ${L.ROUTE_NAMEN[ziel]} wechseln`),
      h('button', { class: 'schlicht', onclick: () => { L.lehneVorschlagAb(z.stand, kapitelId); geaendert(); weiter(); } }, `Auf dem ${L.ROUTE_NAMEN[niveau]} bleiben`)),
    !vorschlag && h('button', { class: 'haupt', id: 'weiter', onclick: () => weiter() }, 'Nächste Aufgabe'),
    h('button', { class: 'schlicht', onclick: () => zeige({ name: 'region', kapitel: kapitelId, milestone: meilenstein.id }) }, 'Zur Regionskarte'));
}

const kartenVon = (auf) => L.KARTEN.filter((feld) => auf.hilfen[feld]);
const meilensteinVon = (auf) => z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.lernziele.some((l) => l.id === auf.lernziel));
function hilfen(a, meilenstein = meilensteinVon(a.aufgabe)) {
  // Je Niveaustufe gibt es unterschiedlich viele Kärtchen: F und G drei, M zwei, E eines.
  const karten = [
    ['tipp', 'Tipp', 'Ein Denkanstoß. Kostet nichts.'],
    ['beispiel', 'Beispiel', 'Eine ähnliche Aufgabe, vorgerechnet. Kostet weitere Münzen.'],
    ['loesungsschritt', 'Lösungsschritt', 'Der Anfang des Rechenwegs. Danach zählt die Aufgabe nicht mehr für dein Lernziel.'],
  ].filter(([feld]) => a.aufgabe.hilfen[feld]);
  return h('aside', { class: 'hilfen' },
    wortspeicher(meilenstein, a),
    merkzettel(meilenstein, a),
    h('h2', {}, 'Hilfekärtchen'),
    h('div', { class: 'kaertchen' }, karten.map(([feld, titel, kosten], i) => i < a.hilfen
      ? h('div', { class: 'kaertchen-offen' }, h('b', {}, titel), h('p', {}, a.aufgabe.hilfen[feld]))
      : h('button', { class: 'kaertchen-zu', disabled: i > a.hilfen, 'data-hilfe': feld, onclick: () => { a.hilfen++; if (z.stand.aktiv) { z.stand.aktiv.hilfen = a.hilfen; geaendert(); } maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); } },
        h('b', {}, titel), h('span', {}, i > a.hilfen ? 'Erst das Kärtchen davor aufdecken.' : kosten)))),
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
        : rangFehlt ? h('span', { class: 'klein' }, `Ab Rang ${L.RAENGE[teil.rang].name}`)
          : h('button', { class: 'schlicht', 'data-teil': teil.id, disabled: z.stand.muenzen < teil.preis, onclick: () => { L.kaufe(z.stand, teil.id); L.legeAn(z.stand, teil.id); geaendert(); male(); } }, muenze(16), ` ${teil.preis} kaufen`));
  };
  const bestwert = Math.max(0, ...z.stand.spiele.map((x) => x.punkte));
  return h('section', {},
    h('h1', {}, 'Dein Wappen'),
    h('div', { class: 'werkbank' }, wappenBild(w, 150),
      h('div', {}, h('p', { class: 'unter' }, `Rang: ${r.name}`),
        h('p', {}, r.naechster ? `Mit ${r.naechster.ab} Siegeln wirst du ${r.naechster.name} und schaltest neue Teile frei.` : 'Du hast den höchsten Rang erreicht.'),
        h('p', { class: 'klein' }, 'Siegel bekommst du für erreichte Lernziele. Münzen gibst du hier für dein Wappen aus.'))),
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
  document.head.append(h('style', {}, stil));
  male();
  setTimeout(() => wurzel.querySelector('#code')?.focus());
}
if (typeof document !== 'undefined') {
  const ziel = document.getElementById('mathekingdom') ?? document.body.appendChild(h('div', { id: 'mathekingdom' }));
  starte(ziel);
}
