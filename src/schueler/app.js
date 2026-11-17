// Schüler-Dashboard: Oberfläche. Die Regeln stehen in logik.js, der Dateizugriff in speicher.js.
import stil from './stil.css';
import { h, mische } from './dom.js';
import * as L from './logik.js';
import * as S from './speicher.js';
import { lokBild, metrokarte, muenze, stern, LINIENFARBE } from './bilder.js';

const jetzt = () => new Date().toISOString();
const z = { // Zustand der laufenden Sitzung
  ablage: null, stand: null, pool: null, index: null, klassendatei: null, einst: null, dienst: null,
  ansicht: { name: 'anmeldung' }, speicherstatus: null, meldung: null, wartePlatz: null,
};
let wurzel;

// ---------- Rahmen ----------
function zeige(ansicht) { z.ansicht = ansicht; if (ansicht.name !== 'aufgabe' && z.stand?.aktiv) { z.stand.aktiv = null; z.dienst.markiere(); } male(); }
function geaendert() { z.dienst?.markiere(); }
function male() {
  const ansichten = { anmeldung, jahresplan, metro, aufgabe: aufgabenAnsicht, werkstatt, minispiel };
  wurzel.replaceChildren(...[
    z.stand && kopf(),
    z.stand && hilfeBanner(),
    z.meldung && h('div', { class: 'meldung', role: 'status' }, z.meldung, h('button', { class: 'schlicht', onclick: () => { z.meldung = null; male(); } }, 'Schließen')),
    h('main', {}, ansichten[z.ansicht.name]()),
  ].filter(Boolean));
}

function kopf() {
  const anzahl = L.sterne(z.stand), r = L.rang(anzahl);
  const status = z.speicherstatus;
  return h('header', { class: 'kopf' },
    h('button', { class: 'lokknopf', title: 'Zur Lok-Werkstatt', onclick: () => zeige({ name: 'werkstatt' }) }, lokBild(z.stand.lok, 66)),
    h('div', { class: 'wer' },
      h('strong', {}, `Lokführer ${z.stand.code}`),
      h('span', {}, r.name, r.naechster ? ` · noch ${r.naechster.ab - anzahl} Sterne bis ${r.naechster.name}` : '')),
    h('div', { class: 'konto' },
      h('span', { class: 'wert', title: 'Sterne: einer pro erreichtem Lernziel' }, stern(20), h('b', { id: 'sterne' }, anzahl)),
      h('span', { class: 'wert', title: 'Münzen zum Ausgeben' }, muenze(20), h('b', { id: 'muenzen' }, z.stand.muenzen))),
    h('nav', {},
      h('button', { class: z.ansicht.name === 'jahresplan' ? 'aktiv' : '', onclick: () => zeige({ name: 'jahresplan' }) }, 'Jahresplan'),
      h('button', { class: z.ansicht.name === 'werkstatt' ? 'aktiv' : '', onclick: () => zeige({ name: 'werkstatt' }) }, 'Werkstatt')),
    h('div', { class: `speicher ${status && !status.ok ? 'fehler' : ''}`, id: 'speicherstatus' },
      !status ? 'Noch nichts zu speichern'
        : status.ok ? `Gespeichert um ${status.um.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
          : 'Speichern fehlgeschlagen. Sag deiner Lehrkraft Bescheid.',
      z.ablage.demo && h('span', { class: 'demo' }, 'Demo: nur in diesem Browser')));
}

function hilfeBanner() {
  if (!z.stand.hilferuf) return null;
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
    onkeydown: (e) => { if (e.key === 'Enter') starte(false); } });
  const starte = async (demo) => {
    const gelesen = L.leseCode(eingabe.value);
    if (!gelesen) return zeige({ name: 'anmeldung', code: eingabe.value, fehler: 'Diesen Schülercode gibt es nicht. Er sieht so aus: 5A-K4M2.' });
    try {
      const ablage = demo ? S.demoAblage(gelesen.klasse) : window.MK_ORDNER ? S.ordnerAblage(window.MK_ORDNER) : await S.waehleOrdner();
      await melde(gelesen, ablage);
    } catch (e) {
      if (e.name === 'AbortError') return;
      zeige({ name: 'anmeldung', code: eingabe.value, fehler: `Das hat nicht geklappt: ${e.message}` });
    }
  };
  return h('section', { class: 'karte anmeldung' },
    h('h1', {}, 'Mathekingdom'),
    h('p', { class: 'unter' }, 'Die Königliche Metro wartet auf ihren Lokführer.'),
    h('label', { for: 'code' }, 'Dein Schülercode'),
    eingabe,
    a.fehler && h('p', { class: 'fehler', role: 'alert' }, a.fehler),
    S.kannOrdner()
      ? h('button', { class: 'haupt', id: 'ordner', onclick: () => starte(false) }, window.MK_ORDNER ? 'Einsteigen' : 'Klassenordner wählen und einsteigen')
      : h('p', { class: 'fehler' }, 'Dieser Browser kann nicht im Klassenordner speichern. Öffne die Datei bitte mit Edge oder Chrome.'),
    !window.MK_ORDNER && h('p', { class: 'klein' }, 'Im nächsten Fenster wählst du den Ordner deiner Klasse aus und erlaubst das Speichern.'),
    h('button', { class: 'schlicht', id: 'demo', onclick: () => starte(true) }, 'Ohne Ordner ausprobieren'));
}

async function melde({ code, klasse }, ablage) {
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
  const geladen = await S.ladeStand(ablage, code);
  Object.assign(z, { ablage, pool, index: L.indexiere(pool), klassendatei, einst, stand: geladen.stand ?? L.neuerSpeicherstand(code, klasse, jetzt()) });
  z.meldung = geladen.hinweis ? 'Dein Speicherstand im Klassenordner fehlte oder war veraltet. Er wurde aus der Sicherung dieses Computers wiederhergestellt.' : null;
  z.dienst = S.speicherdienst(ablage, () => z.stand, (status) => { z.speicherstatus = status; maleStatus(); });
  if (!geladen.stand || geladen.hinweis) { z.dienst.markiere(); z.dienst.sofort(); }
  setInterval(takt, 10000);
  window.addEventListener('pagehide', () => z.dienst.sofort());
  zeige({ name: 'jahresplan' });
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
    const vorher = JSON.stringify([...z.einst.offeneKapitel, z.einst.spielpause, z.einst.zielniveau, z.einst.hilfeAntwort]);
    z.einst = einstellungenJetzt();
    const ruf = z.stand.hilferuf, antwort = z.einst.hilfeAntwort;
    let neu = vorher !== JSON.stringify([...z.einst.offeneKapitel, z.einst.spielpause, z.einst.zielniveau, z.einst.hilfeAntwort]);
    if (ruf && antwort?.zu === ruf.seit && antwort.status === 'erledigt') { L.beendeHilferuf(z.stand, 'erledigt', jetzt()); geaendert(); neu = true; }
    if (z.stand.hilferuf) {
      const platz = L.wartePlatz(z.stand, await S.ladeAndereHilferufe(z.ablage, z.stand.code));
      if (platz !== z.wartePlatz) { z.wartePlatz = platz; neu = true; }
    }
    // Nicht mitten in einer Eingabe neu zeichnen.
    if (neu && !['aufgabe', 'minispiel'].includes(z.ansicht.name)) male();
    else if (neu) { const alt = wurzel.querySelector('.hilfebanner'); const frisch = hilfeBanner(); if (alt && frisch) alt.replaceWith(frisch); else if (alt) alt.remove(); }
  } catch { /* Ordner kurz nicht erreichbar: beim nächsten Takt erneut */ }
}
function einstellungenJetzt() {
  const e = L.einstellungen(z.klassendatei, z.stand.code, z.pool);
  if (z.ablage.demo) e.spielpause = true;
  return e;
}

// ---------- Jahresplan ----------
function jahresplan() {
  z.einst = einstellungenJetzt();
  return h('section', {},
    h('h1', {}, `Jahresplan Klasse ${z.pool.klassenstufe}`),
    h('p', { class: 'unter' }, 'Jedes Kapitel ist eine Region des Reiches. Wähle eine Region und erschließe sie mit deinem Zug.'),
    h('ol', { class: 'regionen' }, z.pool.kapitel.map((k, i) => {
      const offen = z.einst.offeneKapitel.has(k.id);
      const mit = k.unterkapitel.filter((u) => L.stationStatus(z.index, z.stand, u) !== 'leer');
      const erreicht = mit.filter((u) => L.stationStatus(z.index, z.stand, u) === 'erreicht').length;
      return h('li', {}, h('button', { class: `region ${offen ? '' : 'gesperrt'}`, disabled: !offen, 'data-kapitel': k.id, onclick: () => zeige({ name: 'metro', kapitel: k.id }) },
        h('span', { class: 'nummer' }, i + 1),
        h('span', { class: 'titel' }, k.titel),
        k.id === z.einst.aktuellesKapitel && h('span', { class: 'marke' }, 'Aktuelles Kapitel'),
        h('span', { class: 'stand' }, !offen ? 'Noch gesperrt' : mit.length === 0 ? 'Aufgaben folgen' : `${erreicht} von ${mit.length} Stationen erreicht`)));
    })));
}

// ---------- Metrokarte ----------
function metro() {
  const kapitel = z.pool.kapitel.find((k) => k.id === z.ansicht.kapitel);
  const niveau = L.arbeitsniveau(z.stand, kapitel.id, z.einst.zielniveau);
  const stationen = kapitel.unterkapitel.map((u) => ({ id: u.id, titel: u.titel, extra: u.extra, status: L.stationStatus(z.index, z.stand, u) }));
  const standort = (stationen.find((st) => st.status === 'begonnen') ?? stationen.find((st) => st.status === 'offen') ?? stationen[0]).id;
  const gewaehlt = z.ansicht.station ?? standort;
  const station = kapitel.unterkapitel.find((u) => u.id === gewaehlt);
  const karte = metrokarte({ stationen, niveau, zielniveau: z.einst.zielniveau, standort, gewaehlt, lok: z.stand.lok,
    beiStation: (id) => zeige({ ...z.ansicht, station: id }),
    beiLinie: (n) => { if (n !== niveau) { L.setzeNiveau(z.stand, kapitel.id, n); geaendert(); male(); } } });
  return h('section', {},
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'jahresplan' }) }, '← Jahresplan')),
    h('h1', {}, kapitel.titel),
    h('p', { class: 'unter' }, `Du fährst auf Linie ${niveau} (${L.NIVEAU_NAMEN[niveau]}). Tippe links auf eine andere Linie, um umzusteigen.`),
    h('div', { class: 'kartenrahmen' }, karte),
    stationsTafel(kapitel, station, niveau));
}

function stationsTafel(kapitel, station, niveau) {
  const status = L.stationStatus(z.index, z.stand, station);
  if (status === 'leer') {
    return h('div', { class: 'karte tafel' }, h('h2', {}, station.titel), h('p', {}, 'An dieser Station gibt es noch keine Aufgaben. Sie wird bald eröffnet.'));
  }
  const naechstes = L.naechstesLernziel(z.index, z.stand, station);
  return h('div', { class: 'karte tafel' },
    h('h2', {}, station.titel, status === 'erreicht' && h('span', { class: 'marke gut' }, 'Station erreicht')),
    h('ul', { class: 'lernziele' }, station.lernziele.filter((l) => z.index.lernzielMitAufgaben.has(l.id)).map((l) => {
      const st = L.lernzielStand(z.stand, l.id, z.einst.zielniveau);
      const erreicht = Boolean(z.stand.lernziele[l.id]);
      return h('li', { class: erreicht ? 'erreicht' : '' },
        stern(22, erreicht),
        h('span', { class: 'text' }, l.text),
        h('span', { class: 'punkte', title: `${st.fortschritt} von ${L.LERNZIEL_RICHTIGE}` }, [0, 1, 2].map((i) => h('i', { class: i < (erreicht ? 3 : st.fortschritt) ? 'voll' : '' }))),
        h('button', { class: 'schlicht', onclick: () => starteAufgabe(l.id, niveau) }, erreicht ? 'Weiter üben' : 'Üben'));
    })),
    h('button', { class: 'haupt', id: 'losfahren', onclick: () => starteAufgabe(naechstes.id, niveau) }, status === 'erreicht' ? 'Noch eine Runde fahren' : 'Losfahren'));
}

// ---------- Aufgabe ----------
function starteAufgabe(lernzielId, niveau) {
  const aufgabe = L.naechsteAufgabe(z.index, z.stand, lernzielId, niveau);
  z.stand.aktiv = { aufgabe: aufgabe.id, seit: jetzt() };
  geaendert();
  zeige({ name: 'aufgabe', aufgabe, beginn: Date.now(), versuch: 0, hilfen: 0, eingaben: [], fehlvorstellungen: [], hinweis: null, ergebnis: null,
    reihenfolge: aufgabe.format === 'zuordnen' ? mische(aufgabe.paare.map((p) => p.rechts)) : null });
}

function aufgabenAnsicht() {
  const a = z.ansicht, auf = a.aufgabe;
  const kapitelId = L.kapitelVon(auf.lernziel);
  const lernziel = z.pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === auf.lernziel);
  const station = z.pool.kapitel.flatMap((k) => k.unterkapitel).find((u) => u.lernziele.includes(lernziel));
  const st = L.lernzielStand(z.stand, auf.lernziel, z.einst.zielniveau);
  const training = L.NIVEAUS.indexOf(auf.niveau) < L.NIVEAUS.indexOf(z.einst.zielniveau);
  const fertig = Boolean(a.ergebnis);
  const formular = h('form', { class: 'antwort', onsubmit: (e) => { e.preventDefault(); if (!fertig) pruefe(formular); } },
    eingabefelder(auf, a, fertig),
    !fertig && h('button', { class: 'haupt', id: 'pruefen', type: 'submit' }, a.versuch === 0 ? 'Prüfen' : 'Noch einmal prüfen'));
  return h('section', { class: 'aufgabe', 'data-aufgabe': auf.id },
    h('p', { class: 'pfad' }, h('button', { class: 'schlicht', onclick: () => zeige({ name: 'metro', kapitel: kapitelId, station: station.id }) }, `← ${station.titel}`)),
    h('div', { class: 'karte' },
      h('div', { class: 'aufgabenkopf' },
        h('span', { class: 'linie', style: `background:${LINIENFARBE[auf.niveau]}` }, `Linie ${auf.niveau}`),
        training && h('span', { class: 'marke' }, 'Training'),
        h('span', { class: 'ziel' }, lernziel.text),
        h('span', { class: 'punkte', title: 'Fortschritt beim Lernziel' }, [0, 1, 2].map((i) => h('i', { class: i < (z.stand.lernziele[auf.lernziel] ? 3 : st.fortschritt) ? 'voll' : '' })))),
      auf.format !== 'luecken' && h('p', { class: 'aufgabentext' }, auf.text),
      formular,
      a.hinweis && !fertig && h('p', { class: 'hinweis', role: 'alert' }, a.hinweis),
      fertig && ergebnisTafel(a, kapitelId, station)),
    !fertig && hilfen(a));
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
    default: return null;
  }
}
function liesEingabe(auf, formular) {
  const feld = (name) => formular.elements[name]?.value.trim() ?? '';
  switch (auf.format) {
    case 'zahl': { const v = feld('zahl'); return { eingabe: v, leer: !v }; }
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
    a.hinweis = `Das stimmt noch nicht. ${gezielt ?? 'Rechne noch einmal in Ruhe nach.'} Du hast noch einen Versuch.`;
    return male();
  }
  const buchung = L.verbuche(z.stand, auf, { geloest: ergebnis.richtig, versuche: a.versuch, eingaben: a.eingaben, fehlvorstellungen: a.fehlvorstellungen,
    hilfen: a.hilfen, dauer: Math.round((Date.now() - a.beginn) / 1000) }, z.einst.zielniveau, jetzt());
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
    case 'zahl': return zahl(auf);
    case 'auswahl': return auf.optionen.filter((o) => o.richtig).map((o) => o.text).join(' · ');
    case 'luecken': return auf.text.replace(/\{\{(\w+)\}\}/g, (_, n) => auf.luecken[n].loesung);
    case 'zuordnen': return auf.paare.map((p) => `${p.links} ist ${p.rechts}`).join(', ');
    case 'sachaufgabe': return auf.teile.map((t, i) => `${'abcdef'[i]}) ${zahl(t)}`).join('  ');
    default: return '';
  }
}

function ergebnisTafel(a, kapitelId, station) {
  const e = a.ergebnis, auf = a.aufgabe;
  const niveau = L.arbeitsniveau(z.stand, kapitelId, z.einst.zielniveau);
  const vorschlag = L.niveauVorschlag(z.stand, kapitelId, niveau);
  const stationFertig = L.stationStatus(z.index, z.stand, station) === 'erreicht';
  const weiter = (n = niveau) => {
    const lz = z.stand.lernziele[auf.lernziel] ? L.naechstesLernziel(z.index, z.stand, station).id : auf.lernziel;
    starteAufgabe(lz, n);
  };
  const ziel = L.NIVEAUS[L.NIVEAUS.indexOf(niveau) + (vorschlag === 'hoch' ? 1 : -1)];
  return h('div', { class: `ergebnis ${e.richtig ? 'richtig' : 'falsch'}`, role: 'status' },
    h('h2', {}, e.richtig ? 'Richtig!' : 'Leider nicht richtig.'),
    !e.richtig && h('p', {}, 'Die Lösung ist: ', h('b', {}, loesungstext(auf)), '. Gleich kommt eine ähnliche Aufgabe.'),
    e.richtig && h('p', { class: 'lohn' }, muenze(22), h('b', {}, `+${e.muenzen}`), e.muenzen === 1 ? ' Münze' : ' Münzen',
      e.training && ' (Training unter deinem Zielniveau bringt weniger)'),
    e.neuesLernziel && h('p', { class: 'lohn neu' }, stern(26), h('b', {}, 'Lernziel erreicht!'), ' Du bekommst einen Stern.'),
    e.neuesLernziel && stationFertig && h('p', { class: 'lohn neu' }, h('b', {}, `Station „${station.titel}“ erreicht!`)),
    vorschlag && h('div', { class: 'vorschlag' },
      h('p', {}, vorschlag === 'hoch'
        ? `Das läuft richtig gut. Möchtest du auf Linie ${ziel} umsteigen? Dort sind die Aufgaben anspruchsvoller und bringen mehr Münzen.`
        : `Diese Aufgaben sind gerade ganz schön schwer. Möchtest du auf Linie ${ziel} umsteigen und dort Sicherheit sammeln?`),
      h('button', { class: 'haupt', id: 'umsteigen', onclick: () => { L.setzeNiveau(z.stand, kapitelId, ziel); geaendert(); weiter(ziel); } }, `Auf Linie ${ziel} umsteigen`),
      h('button', { class: 'schlicht', onclick: () => { L.lehneVorschlagAb(z.stand, kapitelId); geaendert(); weiter(); } }, `Auf Linie ${niveau} bleiben`)),
    !vorschlag && h('button', { class: 'haupt', id: 'weiter', onclick: () => weiter() }, 'Nächste Aufgabe'),
    h('button', { class: 'schlicht', onclick: () => zeige({ name: 'metro', kapitel: kapitelId, station: station.id }) }, 'Zur Metrokarte'));
}

function hilfen(a) {
  const karten = [
    ['tipp', 'Tipp', 'Ein Denkanstoß. Kostet einen Teil der Münzen.'],
    ['beispiel', 'Beispiel', 'Eine ähnliche Aufgabe, vorgerechnet. Kostet weitere Münzen.'],
    ['loesungsschritt', 'Lösungsschritt', 'Der erste Schritt dieser Aufgabe. Danach zählt sie nicht mehr für dein Lernziel.'],
  ];
  return h('aside', { class: 'hilfen' },
    h('h2', {}, 'Hilfekärtchen'),
    h('div', { class: 'kaertchen' }, karten.map(([feld, titel, kosten], i) => i < a.hilfen
      ? h('div', { class: 'kaertchen-offen' }, h('b', {}, titel), h('p', {}, a.aufgabe.hilfen[feld]))
      : h('button', { class: 'kaertchen-zu', disabled: i > a.hilfen, 'data-hilfe': feld, onclick: () => { a.hilfen++; maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); } },
        h('b', {}, titel), h('span', {}, i > a.hilfen ? 'Erst das Kärtchen davor aufdecken.' : kosten)))),
    !z.stand.hilferuf && h('button', { class: 'schlicht hilferuf', id: 'hilferuf', onclick: () => { L.rufeHilfe(z.stand, a.aufgabe.id, jetzt()); z.wartePlatz = null; geaendert(); z.dienst.sofort(); maleMitEntwurf(liesEingabe(a.aufgabe, wurzel.querySelector('form.antwort')).eingabe); takt(); } },
      'Ich brauche Hilfe von meiner Lehrkraft'));
}

// ---------- Werkstatt ----------
function werkstatt() {
  const r = L.rang(L.sterne(z.stand));
  const teilKarte = (w) => {
    const gekauft = z.stand.lok.gekauft.includes(w.id);
    const an = w.art === 'farbe' ? z.stand.lok.farbe === w.id : z.stand.lok.extras.includes(w.id);
    const rangFehlt = r.stufe < w.rang;
    return h('li', { class: `teil ${an ? 'an' : ''}` },
      w.art === 'farbe' ? h('span', { class: 'farbfeld', style: `background:${w.wert}` }) : h('span', { class: 'vorschau' }, lokBild({ farbe: z.stand.lok.farbe, extras: [w.id] }, 60)),
      h('b', {}, w.name),
      gekauft
        ? h('button', { class: an ? 'haupt' : 'schlicht', 'data-teil': w.id, onclick: () => { L.ruesteAus(z.stand, w.id); geaendert(); male(); } }, w.art === 'farbe' ? (an ? 'Gewählt' : 'Wählen') : (an ? 'Abnehmen' : 'Anbringen'))
        : rangFehlt ? h('span', { class: 'klein' }, `Ab Rang ${L.RAENGE[w.rang].name}`)
          : h('button', { class: 'schlicht', 'data-teil': w.id, disabled: z.stand.muenzen < w.preis, onclick: () => { L.kaufe(z.stand, w.id); L.ruesteAus(z.stand, w.id); geaendert(); male(); } }, muenze(16), ` ${w.preis} kaufen`));
  };
  const bestwert = Math.max(0, ...z.stand.spiele.map((x) => x.punkte));
  return h('section', {},
    h('h1', {}, 'Lok-Werkstatt'),
    h('div', { class: 'werkbank' }, lokBild(z.stand.lok, 260),
      h('div', {}, h('p', { class: 'unter' }, `Rang: ${r.name}`),
        h('p', {}, r.naechster ? `Mit ${r.naechster.ab} Sternen wirst du ${r.naechster.name} und schaltest neue Teile frei.` : 'Du hast den höchsten Rang erreicht.'),
        h('p', { class: 'klein' }, 'Sterne bekommst du für erreichte Lernziele. Münzen gibst du hier aus.'))),
    h('h2', {}, 'Farben'), h('ul', { class: 'teile-liste' }, L.WERKSTATT.filter((w) => w.art === 'farbe').map(teilKarte)),
    h('h2', {}, 'Zubehör'), h('ul', { class: 'teile-liste' }, L.WERKSTATT.filter((w) => w.art === 'extra').map(teilKarte)),
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
      h('button', { class: 'haupt', onclick: () => zeige({ name: 'werkstatt' }) }, 'Zurück zur Werkstatt'));
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
