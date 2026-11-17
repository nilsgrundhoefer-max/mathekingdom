// Diagnose: reine Auswertung der Speicherstände einer Klasse. Keine Oberfläche, kein Dateizugriff.
import * as L from '../schueler/logik.js';

const median = (werte) => {
  if (!werte.length) return null;
  const s = [...werte].sort((a, b) => a - b), m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};
const anteil = (teil, ganz) => (ganz ? teil / ganz : null);
const minutenSeit = (zeit, jetzt) => (zeit ? Math.max(0, Math.round((new Date(jetzt) - new Date(zeit)) / 60000)) : null);

export const INAKTIV_MINUTEN = 5;
export const RATEN_SEKUNDEN = 6;

// ---------- Schülercodes ----------
// Ohne leicht verwechselbare Zeichen (0/O, 1/I/L) und nicht aufzählbar.
const ZEICHEN = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function erzeugeCode(klasse, vorhandene, zufall = Math.random) {
  for (;;) {
    let ende = '';
    for (let i = 0; i < 4; i++) ende += ZEICHEN[Math.floor(zufall() * ZEICHEN.length)];
    const code = `${klasse.toUpperCase()}-${ende}`;
    if (!vorhandene.includes(code)) return code;
  }
}

// ---------- Ein Schüler ----------
export function kennzahlen(stand, zielniveau, jetzt) {
  const v = stand.versuche;
  const geloest = v.filter((x) => x.richtig);
  const zeiten = [stand.geaendert, stand.aktiv?.seit, v.at(-1)?.t].filter(Boolean).sort();
  const letzte = zeiten.at(-1) ?? null;
  const ziel = L.NIVEAUS.indexOf(zielniveau);
  const training = v.filter((x) => L.NIVEAUS.indexOf(x.niveau) < ziel).length;
  return {
    sterne: L.sterne(stand), muenzen: stand.muenzen, rang: L.rang(L.sterne(stand)).name,
    bearbeitet: v.length, geloest: geloest.length, quote: anteil(geloest.length, v.length),
    ersterVersuch: anteil(v.filter((x) => x.richtig && x.versuche === 1).length, v.length),
    tipp: v.filter((x) => x.hilfen >= 1).length, beispiel: v.filter((x) => x.hilfen >= 2).length, loesungsschritt: v.filter((x) => x.hilfen >= 3).length,
    hilfekaertchen: v.reduce((s, x) => s + x.hilfen, 0),
    hilferufe: stand.hilferufe.length + (stand.hilferuf ? 1 : 0),
    zeitMedian: median(v.map((x) => x.dauer)),
    trainingAnteil: anteil(training, v.length),
    letzteAktivitaet: letzte, minutenStill: minutenSeit(letzte, jetzt),
    aktiveAufgabe: stand.aktiv?.aufgabe ?? null,
    niveauverlauf: v.map((x) => x.niveau),
    niveaus: { ...stand.niveau },
  };
}

// Auffälligkeiten, auf die die Lehrkraft schauen sollte.
export function auffaelligkeiten(stand, zielniveau, jetzt, sitzungLaeuft = true) {
  const liste = [];
  const v = stand.versuche;
  const k = kennzahlen(stand, zielniveau, jetzt);
  if (sitzungLaeuft && v.length && k.minutenStill >= INAKTIV_MINUTEN && k.minutenStill < 90) {
    liste.push({ art: 'inaktiv', text: `Seit ${k.minutenStill} Minuten keine Eingabe` });
  }
  const letzte = v.slice(-10);
  const geraten = letzte.filter((x) => !x.richtig && x.dauer <= RATEN_SEKUNDEN).length;
  if (geraten >= 3) liste.push({ art: 'raten', text: `Rät vermutlich: ${geraten} der letzten ${letzte.length} Aufgaben in wenigen Sekunden falsch` });
  if (v.length >= 8 && k.trainingAnteil >= 0.6) liste.push({ art: 'training', text: `Arbeitet überwiegend unter dem Zielniveau (${Math.round(k.trainingAnteil * 100)} % Training)` });
  const jeLernziel = new Map();
  for (const x of v) jeLernziel.set(x.lernziel, (jeLernziel.get(x.lernziel) ?? 0) + 1);
  for (const [lz, n] of jeLernziel) {
    if (n >= 8 && !stand.lernziele[lz]) liste.push({ art: 'ohne-erfolg', lernziel: lz, text: `${n} Aufgaben zu ${lz} bearbeitet, Lernziel noch nicht erreicht` });
  }
  if (v.length >= 5 && k.loesungsschritt / v.length >= 0.4) liste.push({ art: 'hilfen', text: 'Nutzt bei vielen Aufgaben das Lösungsschritt-Kärtchen' });
  return liste;
}

// Stimmt der Speicherstand mit seinem eigenen Versuchsprotokoll überein? Sonst wurde er wohl von Hand verändert.
export function pruefeStand(stand, zielniveau) {
  const maengel = [];
  const verdient = stand.versuche.reduce((s, x) => s + (x.muenzen ?? 0), 0);
  if (stand.muenzen > verdient) maengel.push(`Mehr Münzen (${stand.muenzen}) als je verdient (${verdient})`);
  // Lernziele dürfen nur stehen, wenn sie auf irgendeinem Zielniveau ab F belegt sind.
  for (const lz of Object.keys(stand.lernziele)) {
    if (!L.lernzielStand(stand, lz, 'F').erreicht) maengel.push(`Stern für ${lz} ohne passende Aufgaben im Protokoll`);
  }
  return maengel;
}

// ---------- Die Klasse ----------
// staende: [{ code, stand }]; zielniveaus: code → Niveaustufe
const zielVon = (zielniveaus, code) => zielniveaus?.[code] ?? 'G';

export function lernzieleMitAufgaben(pool, index) {
  return pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele
    .filter((l) => index.lernzielMitAufgaben.has(l.id))
    .map((l) => ({ ...l, kapitel: k.id, unterkapitel: u.id, station: u.titel }))));
}

export function lernzielmatrix(staende, lernziele, zielniveaus) {
  return staende.map(({ code, stand }) => ({
    code,
    zellen: lernziele.map((l) => {
      const st = L.lernzielStand(stand, l.id, zielVon(zielniveaus, code));
      const bearbeitet = stand.versuche.filter((x) => x.lernziel === l.id).length;
      return { lernziel: l.id, status: stand.lernziele[l.id] ? 'erreicht' : bearbeitet ? 'begonnen' : 'offen', fortschritt: st.fortschritt, bearbeitet };
    }),
  }));
}

export function lernzielStatistik(staende, lernziele) {
  return lernziele.map((l) => {
    const v = staende.flatMap(({ stand }) => stand.versuche.filter((x) => x.lernziel === l.id));
    return {
      lernziel: l.id, text: l.text, station: l.station,
      bearbeitet: v.length, quote: anteil(v.filter((x) => x.richtig).length, v.length),
      zeitMedian: median(v.map((x) => x.dauer)), hilfenAnteil: anteil(v.filter((x) => x.hilfen > 0).length, v.length),
      schueler: staende.filter(({ stand }) => stand.versuche.some((x) => x.lernziel === l.id)).length,
      erreicht: staende.filter(({ stand }) => stand.lernziele[l.id]).length,
    };
  });
}

// Aufgaben, an denen die Klasse hängt: niedrigste Lösungsquote zuerst, ab `mindestens` Bearbeitungen.
export function aufgabenStatistik(staende, mindestens = 3) {
  const je = new Map();
  for (const { code, stand } of staende) for (const x of stand.versuche) {
    if (!je.has(x.aufgabe)) je.set(x.aufgabe, { aufgabe: x.aufgabe, lernziel: x.lernziel, niveau: x.niveau, bearbeitet: 0, geloest: 0, schueler: new Set(), dauern: [] });
    const e = je.get(x.aufgabe);
    e.bearbeitet++; if (x.richtig) e.geloest++; e.schueler.add(code); e.dauern.push(x.dauer);
  }
  return [...je.values()].filter((e) => e.bearbeitet >= mindestens)
    .map((e) => ({ aufgabe: e.aufgabe, lernziel: e.lernziel, niveau: e.niveau, bearbeitet: e.bearbeitet, quote: e.geloest / e.bearbeitet, schueler: e.schueler.size, zeitMedian: median(e.dauern) }))
    .sort((a, b) => a.quote - b.quote || b.bearbeitet - a.bearbeitet);
}

export function fehlerStatistik(staende) {
  const je = new Map();
  for (const { code, stand } of staende) for (const x of stand.versuche) for (const f of x.fehlvorstellungen ?? []) {
    if (!je.has(f)) je.set(f, { fehlvorstellung: f, anzahl: 0, schueler: new Map() });
    const e = je.get(f);
    e.anzahl++; e.schueler.set(code, (e.schueler.get(code) ?? 0) + 1);
  }
  return [...je.values()].map((e) => ({ ...e, schueler: [...e.schueler].sort((a, b) => b[1] - a[1]).map(([code, anzahl]) => ({ code, anzahl })) }))
    .sort((a, b) => b.anzahl - a.anzahl);
}

// Hilfe-Warteschlange: offene Hilferufe nach Eingang. `gleiche` zählt Rufe zum selben Lernziel.
export function warteschlange(staende, index, jetzt) {
  const rufe = staende.filter(({ stand }) => stand.hilferuf).map(({ code, stand }) => ({
    code, seit: stand.hilferuf.seit, aufgabe: stand.hilferuf.aufgabe,
    lernziel: index.aufgabe.get(stand.hilferuf.aufgabe)?.lernziel ?? null,
    wartetMinuten: minutenSeit(stand.hilferuf.seit, jetzt),
  })).sort((a, b) => (a.seit < b.seit ? -1 : 1));
  for (const r of rufe) r.gleiche = rufe.filter((x) => x.lernziel && x.lernziel === r.lernziel).length;
  return rufe;
}

// Woran arbeitet die Klasse gerade? Lernziele mit mehreren Schülern, die dort gerade wenig Erfolg haben.
export function klasseHaengt(staende, index, mindestens = 3) {
  const je = new Map();
  for (const { code, stand } of staende) {
    const letzte = stand.versuche.slice(-3);
    if (letzte.length < 2 || letzte.some((x) => x.richtig)) continue;
    const lz = letzte.at(-1).lernziel;
    if (!letzte.every((x) => x.lernziel === lz)) continue;
    je.set(lz, [...(je.get(lz) ?? []), code]);
  }
  return [...je].filter(([, codes]) => codes.length >= mindestens).map(([lernziel, codes]) => ({ lernziel, codes }));
}

// ---------- Live-Status ----------
export const SITZUNG_MINUTEN = 90;   // ältere Daten zählen nicht mehr zur laufenden Stunde
export const BLOCKIERT_FEHLVERSUCHE = 3;
export const BLOCKIERT_MINUTEN = 5;
const KAERTCHEN = ['', 'Tipp gezogen', 'Tipp und Beispiel gezogen', 'alle drei Hilfekärtchen gezogen'];

// Ampel für die Live-Ansicht. status: hilfe | blockiert | beobachten | flow | arbeitet | inaktiv | fehlt
export function livestatus(stand, zielniveau, jetzt) {
  if (!stand) return { status: 'fehlt', text: 'noch nie angemeldet' };
  const k = kennzahlen(stand, zielniveau, jetzt);
  if (k.minutenStill == null || k.minutenStill >= SITZUNG_MINUTEN) return { status: 'fehlt', text: 'nicht angemeldet' };
  const grenze = new Date(jetzt).getTime() - SITZUNG_MINUTEN * 60000;
  const heute = stand.versuche.filter((x) => new Date(x.t).getTime() >= grenze);
  // Fehlversuche in Folge: die laufende Aufgabe und alle ungelösten direkt davor.
  let fehl = stand.aktiv?.fehlversuche ?? 0, ungeloest = 0;
  for (let i = heute.length - 1; i >= 0 && !heute[i].richtig; i--) { fehl += heute[i].versuche; ungeloest++; }
  const hilfen = stand.aktiv?.hilfen ?? 0;
  const anAufgabe = stand.aktiv ? minutenSeit(stand.aktiv.seit, jetzt) : null;
  const aufgabe = stand.hilferuf?.aufgabe ?? stand.aktiv?.aufgabe ?? heute.at(-1)?.aufgabe ?? null;
  const lernziel = stand.aktiv ? null : heute.at(-1)?.lernziel ?? null;
  const kontext = [KAERTCHEN[Math.min(hilfen, 3)], fehl ? `${fehl} Fehlversuche in Folge` : '', anAufgabe >= 2 ? `seit ${anAufgabe} min an dieser Aufgabe` : ''].filter(Boolean).join(', ');
  const basis = { aufgabe, lernziel, kontext, fehlversuche: fehl, hilfen, minuten: anAufgabe };
  if (stand.hilferuf) return { ...basis, status: 'hilfe', text: 'braucht Hilfe', seit: stand.hilferuf.seit, minuten: minutenSeit(stand.hilferuf.seit, jetzt) };
  if (fehl >= BLOCKIERT_FEHLVERSUCHE) return { ...basis, status: 'blockiert', text: 'kommt nicht weiter', seit: heute.at(-ungeloest)?.t ?? stand.aktiv?.seit };
  if (anAufgabe != null && anAufgabe >= BLOCKIERT_MINUTEN) return { ...basis, status: 'blockiert', text: `seit ${anAufgabe} min an einer Aufgabe`, seit: stand.aktiv.seit };
  if (!stand.aktiv && k.minutenStill >= INAKTIV_MINUTEN) return { ...basis, status: 'inaktiv', text: `still seit ${k.minutenStill} min` };
  if (heute.length === 0 && !stand.aktiv) return { ...basis, status: 'inaktiv', text: 'noch keine Aufgabe' };
  const letzte = heute.slice(-5);
  const geraten = letzte.filter((x) => !x.richtig && x.dauer <= RATEN_SEKUNDEN).length;
  if (geraten >= 3) return { ...basis, status: 'beobachten', text: 'rät vermutlich' };
  if (hilfen >= 1) return { ...basis, status: 'beobachten', text: KAERTCHEN[Math.min(hilfen, 3)] };
  if (fehl >= 2) return { ...basis, status: 'beobachten', text: `${fehl} Fehlversuche in Folge` };
  const quote = anteil(letzte.filter((x) => x.richtig).length, letzte.length);
  if (letzte.length >= 3 && quote >= 0.8) return { ...basis, status: 'flow', text: 'im Flow' };
  return { ...basis, status: 'arbeitet', text: 'arbeitet' };
}

// Wer könnte helfen? Anwesende Schüler, die das Lernziel schon erreicht haben und selbst gut vorankommen.
export function lernbegleiter(staende, lernziel, zielniveaus, jetzt, ausser, hoechstens = 2) {
  if (!lernziel) return [];
  return staende.filter(({ code, stand }) => code !== ausser && stand.lernziele[lernziel]
    && ['flow', 'arbeitet'].includes(livestatus(stand, zielVon(zielniveaus, code), jetzt).status))
    .sort((a, b) => (a.stand.lernziele[lernziel].erreichtAm < b.stand.lernziele[lernziel].erreichtAm ? -1 : 1))
    .slice(0, hoechstens).map(({ code }) => code);
}

// Dieselbe Fehlvorstellung bei mehreren Schülern in der laufenden Stunde: Anlass für einen Mini-Workshop.
export function fehlerHaeufung(staende, jetzt, mindestens = 3) {
  const grenze = new Date(jetzt).getTime() - SITZUNG_MINUTEN * 60000;
  const je = new Map();
  for (const { code, stand } of staende) for (const x of stand.versuche) {
    if (new Date(x.t).getTime() < grenze) continue;
    for (const f of x.fehlvorstellungen ?? []) { if (!je.has(f)) je.set(f, new Set()); je.get(f).add(code); }
  }
  return [...je].filter(([, codes]) => codes.size >= mindestens).map(([fehlvorstellung, codes]) => ({ fehlvorstellung, codes: [...codes] }))
    .sort((a, b) => b.codes.length - a.codes.length);
}

// Schnellläufer: hat in der laufenden Stunde eine Station abgeschlossen.
export function schnelllaeufer(staende, pool, index, zielniveaus, jetzt) {
  const grenze = new Date(jetzt).getTime() - SITZUNG_MINUTEN * 60000;
  const liste = [];
  for (const { code, stand } of staende) for (const u of pool.kapitel.flatMap((k) => k.unterkapitel)) {
    if (L.stationStatus(index, stand, u) !== 'erreicht') continue;
    const fertig = u.lernziele.map((l) => stand.lernziele[l.id]?.erreichtAm).filter(Boolean).sort().at(-1);
    if (new Date(fertig).getTime() < grenze) continue;
    const ziel = zielVon(zielniveaus, code);
    liste.push({ code, station: u.id, titel: u.titel, fertig, zielniveau: ziel, naechstes: L.NIVEAUS[L.NIVEAUS.indexOf(ziel) + 1] ?? null });
  }
  return liste;
}

// ---------- Anforderungsbereiche und Wirkung der Hilfen ----------
// Lösungsquote je Anforderungsbereich: { 1: { bearbeitet, quote }, 2: …, 3: … }
export function afbProfil(stand, index) {
  const je = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
  for (const x of stand.versuche) {
    const afb = index.aufgabe.get(x.aufgabe)?.afb;
    if (!je[afb]) continue;
    je[afb][0]++; if (x.richtig) je[afb][1]++;
  }
  return Object.fromEntries(Object.entries(je).map(([afb, [n, r]]) => [afb, { bearbeitet: n, quote: anteil(r, n) }]));
}
export function hilfenWirkung(stand) {
  const ohne = stand.versuche.filter((x) => !x.hilfen), mit = stand.versuche.filter((x) => x.hilfen);
  return {
    ohne: { bearbeitet: ohne.length, quote: anteil(ohne.filter((x) => x.richtig).length, ohne.length) },
    mit: { bearbeitet: mit.length, quote: anteil(mit.filter((x) => x.richtig).length, mit.length) },
  };
}
export function fehlerVon(stand) {
  const je = new Map();
  for (const x of stand.versuche) for (const f of x.fehlvorstellungen ?? []) je.set(f, (je.get(f) ?? 0) + 1);
  return [...je].sort((a, b) => b[1] - a[1]).map(([fehlvorstellung, anzahl]) => ({ fehlvorstellung, anzahl }));
}

// ---------- Aufgaben-Audit ----------
// Je Aufgabe: Schwierigkeit (Lösungsquote), Quote im ersten Versuch, Abbrüche und die häufigste falsche Antwort.
const alsText = (e) => (e == null ? '' : typeof e === 'string' ? e : Array.isArray(e) ? e.join(' + ') : Object.entries(e).map(([a, b]) => `${a}: ${b}`).join(', '));
export function aufgabenAudit(staende, index, mindestens = 3) {
  const je = new Map();
  const eintrag = (id) => {
    if (!je.has(id)) je.set(id, { aufgabe: id, bearbeitet: 0, geloest: 0, erster: 0, abbrueche: 0, dauern: [], falsch: new Map() });
    return je.get(id);
  };
  for (const { stand } of staende) {
    for (const x of stand.versuche) {
      const e = eintrag(x.aufgabe);
      e.bearbeitet++; if (x.richtig) e.geloest++; if (x.richtig && x.versuche === 1) e.erster++; e.dauern.push(x.dauer);
      const falsche = x.richtig ? (x.eingaben ?? []).slice(0, -1) : x.eingaben ?? [];
      for (const f of falsche) { const t = alsText(f); if (t && t !== '?') e.falsch.set(t, (e.falsch.get(t) ?? 0) + 1); }
    }
    for (const a of stand.abbrueche ?? []) eintrag(a.aufgabe).abbrueche++;
  }
  return [...je.values()].filter((e) => e.bearbeitet + e.abbrueche >= mindestens).map((e) => {
    const [antwort, anzahl] = [...e.falsch].sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
    const falscheGesamt = [...e.falsch.values()].reduce((s, n) => s + n, 0);
    const a = index.aufgabe.get(e.aufgabe);
    return { aufgabe: e.aufgabe, niveau: a?.niveau ?? null, afb: a?.afb ?? null, bearbeitet: e.bearbeitet, quote: anteil(e.geloest, e.bearbeitet),
      ersterVersuch: anteil(e.erster, e.bearbeitet), abbrueche: e.abbrueche, abbruchquote: anteil(e.abbrueche, e.bearbeitet + e.abbrueche),
      zeitMedian: median(e.dauern), haeufigsteFalsche: antwort, haeufigsteAnzahl: anzahl,
      // Viele scheitern, und fast alle mit derselben Antwort: Die Aufgabe ist womöglich missverständlich.
      auffaellig: e.bearbeitet >= mindestens && e.geloest / e.bearbeitet < 0.4 && anzahl >= 3 && anzahl / falscheGesamt >= 0.6 };
  }).sort((a, b) => (a.quote ?? 1) - (b.quote ?? 1) || b.bearbeitet - a.bearbeitet);
}

// ---------- Tabellen für die Berichte ----------
const prozent = (x) => (x == null ? '' : Math.round(x * 100));
export function berichtstabellen(staende, pool, index, zielniveaus, name, jetzt) {
  const lernziele = lernzieleMitAufgaben(pool, index);
  const uebersicht = [['Name', 'Schülercode', 'Zielniveau', 'Rang', 'Sterne', 'Münzen', 'Aufgaben bearbeitet', 'davon gelöst', 'Lösungsquote in %',
    'Im ersten Versuch in %', 'Tipp', 'Beispiel', 'Lösungsschritt', 'Hilferufe', 'Zeit pro Aufgabe (Median, s)', 'Training in %', 'Letzte Aktivität',
    'AFB I in %', 'AFB II in %', 'AFB III in %', 'Lösungsquote ohne Hilfekärtchen in %', 'Lösungsquote mit Hilfekärtchen in %']];
  for (const { code, stand } of staende) {
    const k = kennzahlen(stand, zielVon(zielniveaus, code), jetzt);
    uebersicht.push([name(code), code, zielVon(zielniveaus, code), k.rang, k.sterne, k.muenzen, k.bearbeitet, k.geloest, prozent(k.quote),
      prozent(k.ersterVersuch), k.tipp, k.beispiel, k.loesungsschritt, k.hilferufe, k.zeitMedian ?? '', prozent(k.trainingAnteil), k.letzteAktivitaet ?? '',
      ...[1, 2, 3].map((n) => prozent(afbProfil(stand, index)[n].quote)), prozent(hilfenWirkung(stand).ohne.quote), prozent(hilfenWirkung(stand).mit.quote)]);
  }
  const matrix = [['Name', 'Schülercode', ...lernziele.map((l) => l.id)], ['', 'Lernziel', ...lernziele.map((l) => l.text)]];
  for (const zeile of lernzielmatrix(staende, lernziele, zielniveaus)) {
    matrix.push([name(zeile.code), zeile.code, ...zeile.zellen.map((c) => (c.status === 'erreicht' ? 'erreicht' : c.status === 'begonnen' ? `${c.fortschritt} von ${L.LERNZIEL_RICHTIGE}` : ''))]);
  }
  const versuche = [['Name', 'Schülercode', 'Zeitpunkt', 'Aufgabe', 'Lernziel', 'Niveaustufe', 'Gelöst', 'Versuche', 'Hilfekärtchen', 'Dauer (s)', 'Münzen', 'Erkannte Fehlvorstellungen', 'Eingaben']];
  for (const { code, stand } of staende) for (const x of stand.versuche) {
    versuche.push([name(code), code, x.t, x.aufgabe, x.lernziel, x.niveau, x.richtig ? 'ja' : 'nein', x.versuche, x.hilfen, x.dauer, x.muenzen,
      (x.fehlvorstellungen ?? []).join(', '), (x.eingaben ?? []).map((e) => (typeof e === 'string' ? e : JSON.stringify(e))).join(' | ')]);
  }
  const fehler = [['Fehlvorstellung', 'Beschreibung', 'Anzahl', 'Schüler (Anzahl)']];
  for (const f of fehlerStatistik(staende)) {
    fehler.push([f.fehlvorstellung, pool.fehlvorstellungen[f.fehlvorstellung]?.beschreibung ?? '', f.anzahl, f.schueler.map((s) => `${name(s.code)} (${s.anzahl})`).join(', ')]);
  }
  const ziele = [['Lernziel', 'Text', 'Station', 'Schüler daran', 'erreicht von', 'Aufgaben bearbeitet', 'Lösungsquote in %', 'Zeit (Median, s)', 'mit Hilfekärtchen in %']];
  for (const l of lernzielStatistik(staende, lernziele)) {
    ziele.push([l.lernziel, l.text, l.station, l.schueler, l.erreicht, l.bearbeitet, prozent(l.quote), l.zeitMedian ?? '', prozent(l.hilfenAnteil)]);
  }
  const audit = [['Aufgabe', 'Text', 'Niveaustufe', 'AFB', 'Bearbeitet', 'Lösungsquote in %', 'Im ersten Versuch in %', 'Abgebrochen', 'Zeit (Median, s)', 'Häufigste falsche Antwort', 'wie oft', 'Prüfen?']];
  for (const a of aufgabenAudit(staende, index, 1)) {
    audit.push([a.aufgabe, index.aufgabe.get(a.aufgabe)?.text ?? '', a.niveau ?? '', a.afb ?? '', a.bearbeitet, prozent(a.quote), prozent(a.ersterVersuch), a.abbrueche, a.zeitMedian ?? '', a.haeufigsteFalsche ?? '', a.haeufigsteAnzahl || '', a.auffaellig ? 'ja' : '']);
  }
  return [
    { name: 'Übersicht', zeilen: uebersicht }, { name: 'Lernzielmatrix', zeilen: matrix }, { name: 'Lernziele', zeilen: ziele },
    { name: 'Typische Fehler', zeilen: fehler }, { name: 'Aufgaben-Audit', zeilen: audit }, { name: 'Versuchsprotokoll', zeilen: versuche },
  ];
}

// ---------- Backups aufräumen ----------
// Behält alles der letzten 14 Tage und danach das jeweils erste Backup jeder Kalenderwoche.
// namen: Ordnernamen im Format JJJJ-MM-TT_HH-MM. Liefert die Namen, die gelöscht werden dürfen.
export function alteBackups(namen, jetzt, tage = 14) {
  const zeit = (n) => new Date(`${n.slice(0, 10)}T${n.slice(11, 13)}:${n.slice(14, 16)}:00`);
  const grenze = new Date(jetzt).getTime() - tage * 86400000;
  const woche = (d) => { const t = new Date(d); t.setHours(0, 0, 0, 0); t.setDate(t.getDate() - ((t.getDay() + 6) % 7)); return t.getTime(); };
  const behalten = new Set(), wochen = new Set();
  for (const n of [...namen].sort()) {
    const d = zeit(n);
    if (Number.isNaN(d.getTime()) || d.getTime() >= grenze) { behalten.add(n); continue; }
    if (!wochen.has(woche(d))) { wochen.add(woche(d)); behalten.add(n); }
  }
  return namen.filter((n) => !behalten.has(n));
}
