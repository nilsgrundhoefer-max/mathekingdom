// Aufgabentester (0.37, CONTEXT.md „Aufgabentester“, „Kontrolliert“, „Kontrollliste“).
// Der Administrator sieht jede Aufgabe einmal so, wie ein Schüler sie sieht und bedient: Das Schüler-Dashboard läuft
// in einem Rahmen im Probemodus (window.MK_PROBE). Daneben stehen Lösung, typische Fehler und Kennung.
// Er hakt die Aufgabe als kontrolliert ab, meldet einen Fehler oder überspringt sie.
// Die Häkchen liegen auf dem Lehrertauschlaufwerk (K.LAUFWERK_DATEI); die mit der Version ausgelieferte Liste
// aus aufgabenpool/kontrolliert.json steht in window.MK_KONTROLLIERT.
import { h } from '../schueler/dom.js';
import * as K from '../gemeinsam/kontrolle.js';
import * as M from '../gemeinsam/meldungen.js';
import * as L from '../schueler/logik.js';

export const ADMIN_MELDUNGEN = 'aufgabenmeldungen-admin.json';
const sicher = (text) => text.replace(/<\/script/gi, '<\\/script');

// Alle Aufgaben in fester Reihenfolge: Kapitel, Lernziel wie im Pool, dann Niveau F, G, M, E, dann Nummer.
export function reihenfolge(pools) {
  const liste = [];
  for (const pool of Object.values(pools ?? {})) {
    const rang = new Map();
    pool.kapitel.forEach((k) => k.unterkapitel.forEach((u) => u.lernziele.forEach((l) => rang.set(l.id, rang.size))));
    liste.push(...[...pool.aufgaben].sort((a, b) => (rang.get(a.lernziel) ?? 1e9) - (rang.get(b.lernziel) ?? 1e9)
      || L.NIVEAUS.indexOf(a.niveau) - L.NIVEAUS.indexOf(b.niveau) || a.id.localeCompare(b.id)).map((a) => ({ a, pool })));
  }
  return liste;
}

export function aufgabentesterKarte(api) {
  const { z } = api;
  const t = (z.tester ??= { filter: { kapitel: '', niveau: '', nurOffen: true }, kennung: null, laufwerk: null, laedt: false, melden: false });
  if (!t.laufwerk) {
    if (!t.laedt) {
      t.laedt = true;
      z.lehrer.lies(K.LAUFWERK_DATEI).then((text) => { t.laufwerk = (text && JSON.parse(text)) || {}; })
        .catch(() => { t.laufwerk = {}; }).finally(() => { t.laedt = false; api.male(); });
    }
    return h('section', { class: 'karte', id: 'aufgabentester' }, h('h2', {}, 'Aufgabentester'), h('p', { class: 'klein' }, 'Häkchen werden gelesen …'));
  }
  const repo = window.MK_KONTROLLIERT ?? {};
  const alle = reihenfolge(window.MK_POOLS);
  const zustand = (a) => K.zustand(a, repo, t.laufwerk);
  const kontrolliert = alle.filter(({ a }) => zustand(a).kontrolliert).length;
  const f = t.filter;
  const passt = ({ a }) => (!f.kapitel || L.kapitelVon(a.lernziel) === f.kapitel) && (!f.niveau || a.niveau === f.niveau) && (!f.nurOffen || !zustand(a).kontrolliert);
  const auswahl = alle.filter(passt);
  // Die aktuelle Aufgabe bleibt stehen, bis der Administrator weitergeht, auch wenn sie nach dem Abhaken nicht mehr zum Filter passt.
  let eintrag = alle.find(({ a }) => a.id === t.kennung);
  if (!eintrag || (!passt(eintrag) && !t.festhalten)) { eintrag = auswahl[0] ?? null; t.kennung = eintrag?.a.id ?? null; }
  const nachIhr = (richtung) => {
    const pos = alle.indexOf(eintrag);
    const folge = richtung > 0 ? [...alle.slice(pos + 1), ...alle.slice(0, pos)] : [...alle.slice(0, pos)].reverse();
    const n = folge.find(passt);
    t.kennung = n?.a.id ?? null; t.festhalten = false; t.melden = false; t.ergebnis = null;
  };
  const speichere = async (neu) => { t.laufwerk = neu; await z.lehrer.schreibe(K.LAUFWERK_DATEI, JSON.stringify(neu, null, 1)); };
  const kapitel = Object.values(window.MK_POOLS ?? {}).flatMap((p) => p.kapitel);

  const kopf = [
    h('div', { class: 'reihe' }, h('h2', {}, 'Aufgabentester'),
      h('span', { class: 'marke', id: 'tester-fortschritt' }, `${kontrolliert} von ${alle.length} kontrolliert`),
      h('span', { class: 'rechts' }, h('button', { class: 'schlicht', id: 'kontrollliste-export', onclick: api.tue(async () => {
        const daten = K.alsExport(alle.map(({ a }) => a), repo, t.laufwerk, api.jetzt());
        api.ladeHerunter(`Mathekingdom_Kontrollliste_${new Date().toLocaleDateString('sv-SE')}.json`, JSON.stringify(daten, null, 1), 'application/json');
        z.hinweis = `Kontrollliste mit ${daten.anzahl} Aufgaben gespeichert. Gib die Datei Claude, damit die Häkchen ins Repository kommen.`;
      }) }, 'Kontrollliste exportieren'))),
    h('p', { class: 'klein' }, 'Jede Aufgabe einmal ansehen und ausprobieren, so wie ein Schüler sie sieht. Stimmt sie, hake sie als kontrolliert ab. Die Schüler bekommen kontrollierte und nicht kontrollierte Aufgaben gleichermaßen; das Häkchen ist eine zweite Sicherheitsstufe. Ändert sich eine Aufgabe in einer späteren Version, verliert sie ihr Häkchen. Die Kontrollliste enthält immer alle Häkchen.'),
    h('div', { class: 'reihe' },
      h('label', {}, 'Kapitel ', h('select', { id: 'tester-kapitel', onchange: (ev) => { f.kapitel = ev.target.value; t.kennung = null; api.male(); } },
        h('option', { value: '' }, 'alle'), kapitel.map((k) => h('option', { value: k.id, selected: f.kapitel === k.id }, `${k.id} ${k.titel}`)))),
      h('label', {}, 'Niveau ', h('select', { id: 'tester-niveau', onchange: (ev) => { f.niveau = ev.target.value; t.kennung = null; api.male(); } },
        h('option', { value: '' }, 'alle'), L.NIVEAUS.map((n) => h('option', { value: n, selected: f.niveau === n }, n)))),
      h('label', { class: 'schalter' }, h('input', { type: 'checkbox', id: 'tester-offen', checked: f.nurOffen, onchange: (ev) => { f.nurOffen = ev.target.checked; t.kennung = null; api.male(); } }), ' Nur nicht kontrollierte'),
      h('span', { class: 'klein' }, `${auswahl.length} passen`),
      h('form', { class: 'reihe', onsubmit: (ev) => { ev.preventDefault(); const k = ev.target.elements.kennung.value.trim();
        if (alle.some(({ a }) => a.id === k)) { t.kennung = k; t.festhalten = true; t.melden = false; z.fehler = null; } else z.fehler = `Die Kennung ${k || '(leer)'} steht nicht im Aufgabenpool.`; api.male(); } },
      h('input', { name: 'kennung', id: 'tester-kennung', size: 16, placeholder: 'Kennung' }), h('button', { class: 'schlicht', type: 'submit' }, 'Zeigen'))),
  ];
  if (!eintrag) return h('section', { class: 'karte', id: 'aufgabentester' }, ...kopf, h('p', { id: 'tester-fertig' }, f.nurOffen ? 'Alle Aufgaben in dieser Auswahl sind kontrolliert.' : 'Keine Aufgabe passt zur Auswahl.'));

  const { a, pool } = eintrag, st = zustand(a);
  const gesperrt = (z.v.gesperrt ?? []).includes(a.id);
  const lernziel = pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).find((l) => l.id === a.lernziel);
  // Das Schüler-Dashboard im Rahmen: dieselbe Seite wie beim Schüler, die Aufgabenpools leiht es sich vom Admin-Dashboard.
  const rahmen = h('iframe', { class: 'tester-rahmen', id: 'tester-rahmen', title: `Aufgabe ${a.id} wie beim Schüler`,
    srcdoc: `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="mathekingdom"></div>`
      + `<script>try { window.MK_POOLS = parent.MK_POOLS; } catch (e) {} window.MK_PROBE = ${JSON.stringify(a.id)};</script><script>${sicher(window.MK_SCHUELER_JS ?? '')}</script></body></html>` });
  const fehler = (a.typischeFehler ?? []).map((x) => h('li', {}, h('b', {}, String(x.wert ?? x.werte ?? JSON.stringify(x.eingabe ?? ''))), ': ', pool.fehlvorstellungen?.[x.fehlvorstellung]?.beschreibung ?? x.fehlvorstellung ?? ''));
  const meldeFormular = t.melden && h('form', { class: 'tester-melden', id: 'tester-melden', onsubmit: api.tue(async (ev) => {
    ev.preventDefault();
    const e = ev.target.elements;
    const m = M.neueMeldung({ kennung: a.id, art: e.art.value, satz: e.satz.value, t: api.jetzt() });
    let liste = [];
    try { liste = JSON.parse(await z.lehrer.lies(ADMIN_MELDUNGEN)) ?? []; } catch { /* neu */ }
    await z.lehrer.schreibe(ADMIN_MELDUNGEN, JSON.stringify([...liste, m], null, 1));
    if (e.sperren.checked && !gesperrt) await api.setzeSperre(a.id, true);
    z.betrieb = null; // Meldungen neu lesen
    z.hinweis = `Aufgabe ${a.id} ist gemeldet${e.sperren.checked ? ' und gesperrt' : ''}. Du findest sie unter Aufgabenmeldungen.`;
    nachIhr(1);
  }) },
  h('label', {}, 'Was stimmt nicht? ', h('select', { name: 'art' }, Object.entries(M.ARTEN).map(([w, txt]) => h('option', { value: w }, txt)))),
  h('label', {}, 'Ein Satz dazu ', h('input', { name: 'satz', size: 40, maxlength: M.MAX_SATZ })),
  h('label', { class: 'schalter' }, h('input', { type: 'checkbox', name: 'sperren', checked: !gesperrt }), ' gleich sperren'),
  h('button', { class: 'haupt', type: 'submit', id: 'tester-melden-ok' }, 'Melden'),
  h('button', { class: 'schlicht', type: 'button', onclick: () => { t.melden = false; api.male(); } }, 'Abbrechen'));

  return h('section', { class: 'karte', id: 'aufgabentester' }, ...kopf,
    h('div', { class: 'tester' },
      rahmen,
      h('aside', { class: 'tester-info', id: 'tester-info', 'data-kennung': a.id },
        h('p', {}, h('code', { class: 'kennung' }, a.id), ' ',
          st.kontrolliert ? h('span', { class: 'marke gut', id: 'tester-zustand' }, 'kontrolliert')
            : h('span', { class: 'marke', id: 'tester-zustand' }, st.veraltet ? 'geändert seit dem Häkchen' : 'nicht kontrolliert'),
          gesperrt && [' ', h('span', { class: 'marke schlecht' }, 'gesperrt')]),
        h('p', { class: 'klein' }, `${lernziel?.text ?? a.lernziel} · Niveau ${a.niveau} · AFB ${a.afb ?? '–'} · ${api.formatName(a.format)}`),
        h('h3', {}, 'Lösung'), h('p', { id: 'tester-loesung' }, M.loesungVon(a)),
        h('h3', {}, 'Typische Fehler'), fehler.length ? h('ul', { class: 'liste klein' }, fehler) : h('p', { class: 'klein' }, 'Keine hinterlegt.'),
        a.hilfen && [h('h3', {}, 'Hilfekärtchen'), h('ul', { class: 'liste klein' }, Object.entries(a.hilfen).map(([n, txt]) => h('li', {}, h('b', {}, { tipp: 'Tipp', beispiel: 'Beispiel', loesungsschritt: 'Lösungsschritt' }[n] ?? n), ': ', txt)))],
        h('div', { class: 'knoepfe tester-knoepfe' },
          st.kontrolliert
            ? h('button', { class: 'schlicht', id: 'tester-zurueck', onclick: api.tue(async () => { await speichere(K.nimmZurueck(t.laufwerk, a, api.jetzt())); t.festhalten = true; }) }, 'Häkchen zurücknehmen')
            : h('button', { class: 'haupt', id: 'tester-kontrolliert', onclick: api.tue(async () => { await speichere(K.hake(t.laufwerk, a, api.jetzt())); nachIhr(1); }) }, '✓ Kontrolliert'),
          h('button', { class: 'schlicht', id: 'tester-fehler', onclick: () => { t.melden = true; t.festhalten = true; api.male(); } }, 'Fehler melden'),
          h('button', { class: 'schlicht', id: 'tester-ueberspringen', onclick: () => { nachIhr(1); api.male(); } }, 'Überspringen'),
          h('button', { class: 'schlicht', id: 'tester-vorige', onclick: () => { nachIhr(-1); api.male(); } }, 'Vorige')),
        meldeFormular)));
}

export const TESTER_STIL = `
#mathekingdom-lehrer .tester { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 340px); gap: 16px; align-items: start; margin-top: 12px; }
#mathekingdom-lehrer .tester-rahmen { width: 100%; height: 680px; border: 1px solid #d9d4c7; border-radius: 10px; background: #fbf7ee; }
#mathekingdom-lehrer .tester-info h3 { font-size: .95rem; margin: 14px 0 4px; }
#mathekingdom-lehrer .tester-info p { margin: 4px 0; }
#mathekingdom-lehrer .tester-knoepfe { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
#mathekingdom-lehrer .tester-melden { display: grid; gap: 8px; margin-top: 12px; padding: 10px; border: 1px solid #e0c98c; border-radius: 8px; background: #fdf6df; }
@media (max-width: 900px) { #mathekingdom-lehrer .tester { grid-template-columns: 1fr; } #mathekingdom-lehrer .tester-rahmen { height: 600px; } }
`;
