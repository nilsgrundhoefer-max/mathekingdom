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
// „Lösungen durchgeklickt“ (ADR 0031): mindestens 5 der letzten 10 Aufgaben mit gesehener Lösung, jede in unter 30 Sekunden.
export const DURCHKLICKEN_AB = 5;
export const DURCHKLICKEN_SEKUNDEN = 30;

// ---------- Schülercodes ----------
// Ohne leicht verwechselbare Zeichen (0/O, 1/I/L) und nicht aufzählbar.
const ZEICHEN = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function erzeugeCode(klasse, vorhandene, zufall = Math.random) {
  for (;;) {
    let ende = '';
    for (let i = 0; i < 4; i++) ende += ZEICHEN[Math.floor(zufall() * ZEICHEN.length)];
    // Der hintere Teil ist schulweit einmalig (ADR 0024), damit beim Übernehmen niemand zusammenstößt.
    if (!vorhandene.some((c) => c.split('-')[1] === ende)) return `${klasse.toUpperCase()}-${ende}`;
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
    siegel: L.siegel(stand), muenzen: stand.muenzen, rang: L.rang(L.siegel(stand)).name,
    bearbeitet: v.length, geloest: geloest.length, quote: anteil(geloest.length, v.length),
    ersterVersuch: anteil(v.filter((x) => x.richtig && x.versuche === 1).length, v.length),
    tipp: v.filter((x) => L.hatKarte(x, 'tipp')).length, beispiel: v.filter((x) => L.hatKarte(x, 'beispiel')).length, loesungsschritt: v.filter((x) => L.hatKarte(x, 'loesungsschritt')).length,
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
  // Wer schnell falsch rät, bekommt schon „Rät vermutlich“. „Durchgeklickt“ erfasst vor allem das Lösungsschritt-Kärtchen.
  const geklickt = letzte.filter((x) => L.loesungGesehen(x) && (x.dauer ?? Infinity) < DURCHKLICKEN_SEKUNDEN);
  if (geklickt.length >= DURCHKLICKEN_AB && geraten < 3) {
    const am = new Date(geklickt.at(-1).t).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    liste.push({ art: 'durchgeklickt', text: `Lösungen durchgeklickt: ${geklickt.length} der letzten ${letzte.length} Aufgaben mit gesehener Lösung, jede in unter ${DURCHKLICKEN_SEKUNDEN} Sekunden (zuletzt am ${am})` });
  }
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
  // Verdient: Aufgaben, dazu Belohnungen erledigter Sonderaufträge (ADR 0021) und geöffnete Münzgaben (ADR 0027).
  const verdient = stand.versuche.reduce((s, x) => s + (x.muenzen ?? 0), 0)
    + (stand.sonderauftraege ?? []).reduce((s, x) => s + (x.bonus ?? 0), 0)
    + (stand.muenzgaben ?? []).reduce((s, x) => s + (x.muenzen ?? 0), 0);
  if (stand.muenzen > verdient) maengel.push(`Mehr Münzen (${stand.muenzen}) als je verdient (${verdient})`);
  // Lernziele dürfen nur stehen, wenn sie auf irgendeinem Zielniveau ab F belegt sind.
  for (const lz of Object.keys(stand.lernziele)) {
    if (!L.lernzielStand(stand, lz, 'F').erreicht) maengel.push(`Siegel für ${lz} ohne passende Aufgaben im Protokoll`);
  }
  return maengel;
}

// ---------- Die Klasse ----------
// staende: [{ code, stand }]; zielniveaus: code → Niveaustufe
const zielVon = (zielniveaus, code) => zielniveaus?.[code] ?? L.STANDARD_ZIELNIVEAU;

export function lernzieleMitAufgaben(pool, index) {
  return pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele
    .filter((l) => index.lernzielMitAufgaben.has(l.id))
    .map((l) => ({ ...l, kapitel: k.id, unterkapitel: u.id, milestone: u.titel, ...(u.ab && { ab: u.ab }), ...(u.pflicht && { pflicht: u.pflicht }) }))));
}

// Lernzielstand eines Schülers: siegel | aufzufrischen | wackelig | begonnen | offen.
// Aufzufrischen: Siegel vorhanden, aber im Rückblick falsch gelöst (ADR 0014). Das Siegel bleibt.
// Wackelig: mindestens WACKELIG_AB Aufgaben, davon weniger als die Hälfte gelöst, oder zwei Mal das Lösungsschritt-Kärtchen.
export const WACKELIG_AB = L.WACKELIG_AB;
// Aufgaben aus dem Einstiegscheck zählen für den Lernzielstand nicht (ADR 0014).
export function lernzielZustand(stand, lernzielId) {
  if (stand.lernziele[lernzielId]) return stand.rueckblick?.[lernzielId]?.aufzufrischen ? 'aufzufrischen' : L.istGefestigt(stand, lernzielId) ? 'gefestigt' : 'siegel';
  if (!stand.versuche.some((x) => x.lernziel === lernzielId && !x.einstieg)) return 'offen';
  return L.istWackelig(stand, lernzielId) ? 'wackelig' : 'begonnen';
}

export function lernzielmatrix(staende, lernziele, zielniveaus) {
  return staende.map(({ code, stand }) => ({
    code,
    zellen: lernziele.map((l) => {
      // Niveau-Meilenstein (ADR 0038): Es gilt mindestens seine Marke. Für ein Zielniveau darunter ist er ein Abstecher, keine Lücke.
      const ziel = zielVon(zielniveaus, code);
      const st = L.lernzielStand(stand, l.id, L.stufeAb(ziel, l.ab));
      const bearbeitet = stand.versuche.filter((x) => x.lernziel === l.id).length;
      return { lernziel: l.id, status: lernzielZustand(stand, l.id), fortschritt: st.fortschritt, bearbeitet, ...(L.istNiveauAbstecher(l, ziel) && { abstecher: true }) };
    }),
  }));
}

export function lernzielStatistik(staende, lernziele) {
  return lernziele.map((l) => {
    const v = staende.flatMap(({ stand }) => stand.versuche.filter((x) => x.lernziel === l.id));
    return {
      lernziel: l.id, text: l.text, milestone: l.milestone,
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

// Typische Fehler zu einem Lernziel, häufigste zuerst: [{ fehlvorstellung, anzahl, schueler }]
export function fehlerZuLernziel(staende, lernzielId) {
  return fehlerStatistik(staende.map(({ code, stand }) => ({ code, stand: { ...stand, versuche: stand.versuche.filter((x) => x.lernziel === lernzielId) } })));
}
// Hat in der Klasse in den letzten `minuten` Minuten jemand gearbeitet? Entscheidet, welcher Bereich beim Öffnen erscheint.
export function jemandAktiv(staende, jetzt, minuten = 10) {
  const grenze = new Date(jetzt).getTime() - minuten * 60000;
  return staende.some(({ stand }) => [stand.geaendert, stand.aktiv?.seit, stand.versuche.at(-1)?.t].some((t) => t && new Date(t).getTime() >= grenze));
}

// Hilfe-Warteschlange: offene Hilferufe nach Eingang. `gleiche` zählt Rufe zum selben Lernziel.
export function warteschlange(staende, index, jetzt) {
  const rufe = staende.filter(({ stand }) => stand.hilferuf).map(({ code, stand }) => ({
    code, seit: stand.hilferuf.seit, aufgabe: stand.hilferuf.aufgabe, anlass: stand.hilferuf.anlass ?? null,
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
const KAERTCHEN = ['', '1 Hilfekärtchen gezogen', '2 Hilfekärtchen gezogen', '3 Hilfekärtchen gezogen'];

// ---------- Wegstücke (ADR 0016) ----------
// Lässt nach: Die letzten zwei Wegstücke von heute liegen beide deutlich (0,4, also zwei von fünf Aufgaben) unter dem Schnitt
// der Wegstücke davor. Dafür braucht es mindestens drei Wegstücke am Tag. Der Schüler sieht davon nichts.
export const LAESST_NACH_UM = 0.4;
export const wegstueckeHeute = (stand, jetzt) => L.wegstueckeAm(stand, L.tagVon(jetzt));
const quoteVon = (w) => w.richtig / w.gesamt;
export function laesstNach(stand, jetzt) {
  const w = wegstueckeHeute(stand, jetzt);
  if (w.length < 3) return null;
  const vorher = w.slice(0, -2), letzte = w.slice(-2);
  const schnitt = vorher.reduce((s, x) => s + quoteVon(x), 0) / vorher.length;
  return letzte.every((x) => quoteVon(x) <= schnitt - LAESST_NACH_UM + 1e-9) ? { schnitt, letzte, anzahl: w.length } : null;
}

// Ampel für die Live-Ansicht. status: hilfe | blockiert | beobachten | laesstnach | flow | arbeitet | inaktiv | fehlt
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
  if (stand.hilferuf) {
    const anlass = stand.hilferuf.anlass ?? null;
    return { ...basis, status: 'hilfe', anlass, text: anlass && L.HILFERUF_GRUENDE[anlass] ? `braucht Hilfe: ${L.HILFERUF_GRUENDE[anlass].kurz}` : 'braucht Hilfe', seit: stand.hilferuf.seit, minuten: minutenSeit(stand.hilferuf.seit, jetzt) };
  }
  if (fehl >= BLOCKIERT_FEHLVERSUCHE) return { ...basis, status: 'blockiert', text: 'kommt nicht weiter', seit: heute.at(-ungeloest)?.t ?? stand.aktiv?.seit };
  if (anAufgabe != null && anAufgabe >= BLOCKIERT_MINUTEN) return { ...basis, status: 'blockiert', text: `seit ${anAufgabe} min an einer Aufgabe`, seit: stand.aktiv.seit };
  if (!stand.aktiv && k.minutenStill >= INAKTIV_MINUTEN) return { ...basis, status: 'inaktiv', text: `still seit ${k.minutenStill} min` };
  if (heute.length === 0 && !stand.aktiv) return { ...basis, status: 'inaktiv', text: 'noch keine Aufgabe' };
  const letzte = heute.slice(-5);
  const geraten = letzte.filter((x) => !x.richtig && x.dauer <= RATEN_SEKUNDEN).length;
  if (geraten >= 3) return { ...basis, status: 'beobachten', text: 'rät vermutlich' };
  if (hilfen >= 1) return { ...basis, status: 'beobachten', text: KAERTCHEN[Math.min(hilfen, 3)] };
  if (fehl >= 2) return { ...basis, status: 'beobachten', text: `${fehl} Fehlversuche in Folge` };
  if (laesstNach(stand, jetzt)) return { ...basis, status: 'laesstnach', text: 'lässt nach' };
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

// Schnellläufer: hat in der laufenden Stunde einen Meilenstein gemeistert.
export function schnelllaeufer(staende, pool, index, zielniveaus, jetzt) {
  const grenze = new Date(jetzt).getTime() - SITZUNG_MINUTEN * 60000;
  const liste = [];
  for (const { code, stand } of staende) for (const u of pool.kapitel.flatMap((k) => k.unterkapitel)) {
    if (L.milestoneStatus(index, stand, u) !== 'gemeistert') continue;
    const fertig = u.lernziele.map((l) => stand.lernziele[l.id]?.erreichtAm).filter(Boolean).sort().at(-1);
    if (new Date(fertig).getTime() < grenze) continue;
    const ziel = zielVon(zielniveaus, code);
    liste.push({ code, milestone: u.id, titel: u.titel, fertig, zielniveau: ziel, naechstes: L.NIVEAUS[L.NIVEAUS.indexOf(ziel) + 1] ?? null });
  }
  return liste;
}

// ---------- Selbsteinschätzung (ADR 0012) ----------
// Erste Kronenwahl je Meilenstein gegen die erste Krone dort. Die Lehrkraft sieht Niveaustufen, keine Kronen.
export const URTEIL_TEXT = { unterschaetzt: 'unterschätzt', passend: 'passend', ueberschaetzt: 'überschätzt' };
export const SELBSTEINSCHAETZUNG_AB = 3;
export function selbsteinschaetzung(stand, pool) {
  const titel = new Map(pool.kapitel.flatMap((k) => k.unterkapitel).map((u) => [u.id, u.titel]));
  const liste = Object.entries(stand.einschaetzung ?? {}).map(([id, e]) => ({ meilenstein: id, titel: titel.get(id) ?? id, gewaehlt: e.gewaehlt, krone: e.krone ?? null,
    abstieg: Boolean(e.abstieg), urteil: L.urteil(e), t: e.kroneAm ?? e.t })).sort((a, b) => String(a.t).localeCompare(String(b.t)));
  const bewertet = liste.filter((x) => x.urteil);
  const zahl = (u) => bewertet.filter((x) => x.urteil === u).length;
  const unter = zahl('unterschaetzt'), ueber = zahl('ueberschaetzt'), passend = zahl('passend');
  const tendenz = bewertet.length < SELBSTEINSCHAETZUNG_AB ? null
    : unter > ueber && unter > passend ? 'eher zu niedrig' : ueber > unter && ueber > passend ? 'eher zu hoch' : 'passend';
  return { liste, bewertet: bewertet.length, unter, ueber, passend, tendenz };
}
// Impuls: Wer sich dreimal in Folge unterschätzt hat, könnte ein höheres Zielniveau vertragen.
export function unterschaetzer(staende, pool, zielniveaus, folge = 3) {
  return staende.flatMap(({ code, stand }) => {
    const letzte = selbsteinschaetzung(stand, pool).liste.filter((x) => x.urteil).slice(-folge);
    if (letzte.length < folge || !letzte.every((x) => x.urteil === 'unterschaetzt')) return [];
    const ziel = zielVon(zielniveaus, code);
    return [{ code, zielniveau: ziel, naechstes: L.NIVEAUS[L.NIVEAUS.indexOf(ziel) + 1] ?? null, meilensteine: letzte.map((x) => x.meilenstein) }];
  });
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
export const alsText = (e) => (e == null ? '' : typeof e === 'string' ? e : Array.isArray(e) ? e.join(' + ') : Object.entries(e).map(([a, b]) => `${a}: ${b}`).join(', '));
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
    return { aufgabe: e.aufgabe, lernziel: a?.lernziel ?? null, niveau: a?.niveau ?? null, afb: a?.afb ?? null, bearbeitet: e.bearbeitet, geloest: e.geloest, erster: e.erster, quote: anteil(e.geloest, e.bearbeitet),
      ersterVersuch: anteil(e.erster, e.bearbeitet), abbrueche: e.abbrueche, abbruchquote: anteil(e.abbrueche, e.bearbeitet + e.abbrueche),
      zeitMedian: median(e.dauern), haeufigsteFalsche: antwort, haeufigsteAnzahl: anzahl,
      // Viele scheitern, und fast alle mit derselben Antwort: Die Aufgabe ist womöglich missverständlich.
      auffaellig: e.bearbeitet >= mindestens && e.geloest / e.bearbeitet < 0.4 && anzahl >= 3 && anzahl / falscheGesamt >= 0.6 };
  }).sort((a, b) => (a.quote ?? 1) - (b.quote ?? 1) || b.bearbeitet - a.bearbeitet);
}

// ---------- Auswertung nach Aufgaben, Aufgabentyp, AFB und Niveau ----------
export const FORMAT_NAMEN = { zahl: 'Zahl eingeben', auswahl: 'Auswahl', luecken: 'Lückentext', zuordnen: 'Zuordnen', sachaufgabe: 'Sachaufgabe',
  zahlenstrahl: 'Zahlenstrahl', diagramm: 'Diagramm', tabelle: 'Tabelle', strichliste: 'Strichliste anlegen', zeichnen: 'Säulen zeichnen',
  ordnen: 'Ordnen', zeichen: 'Zeichen eingeben', schaetzen: 'Schätzen', gitter: 'Gitterzeichnen', groesse: 'Größe eingeben', winkel: 'Winkeldrehen', bruch: 'Bruch eingeben', faerben: 'Teile färben' };
export const AFB_NAMEN = { 1: 'AFB I', 2: 'AFB II', 3: 'AFB III' };
// Jede Aufgabe des Pools mit ihren Zahlen, auch die nie bearbeiteten. `angeboten` heißt: Im selben Lernziel auf derselben Niveaustufe
// hat die Klasse schon gearbeitet, die Aufgabe hätte also drankommen können.
export function aufgabenUebersicht(staende, pool, index) {
  const zahlen = new Map(aufgabenAudit(staende, index, 0).map((a) => [a.aufgabe, a]));
  const meilenstein = new Map(pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele.map((l) => [l.id, { id: u.id, titel: u.titel }]))));
  const begonnen = new Set(staende.flatMap(({ stand }) => stand.versuche.map((x) => `${x.lernziel}|${x.niveau}`)));
  const aufgaben = pool.aufgaben.map((a) => {
    const e = zahlen.get(a.id);
    return { aufgabe: a.id, lernziel: a.lernziel, milestone: meilenstein.get(a.lernziel) ?? null, niveau: a.niveau, afb: a.afb, format: a.format,
      bearbeitet: e?.bearbeitet ?? 0, geloest: e?.geloest ?? 0, erster: e?.erster ?? 0, abbrueche: e?.abbrueche ?? 0,
      quote: e?.quote ?? null, ersterVersuch: e?.ersterVersuch ?? null, zeitMedian: e?.zeitMedian ?? null,
      haeufigsteFalsche: e?.haeufigsteFalsche ?? null, haeufigsteAnzahl: e?.haeufigsteAnzahl ?? 0, auffaellig: e?.auffaellig ?? false,
      angeboten: begonnen.has(`${a.lernziel}|${a.niveau}`) };
  });
  const gruppe = (feld, reihenfolge, namen) => reihenfolge.map((wert) => {
    const teil = aufgaben.filter((a) => a[feld] === wert);
    const n = teil.reduce((sum, a) => sum + a.bearbeitet, 0), ab = teil.reduce((sum, a) => sum + a.abbrueche, 0);
    return { wert, name: namen?.[wert] ?? String(wert), imPool: teil.length, genutzt: teil.filter((a) => a.bearbeitet > 0).length, bearbeitet: n,
      quote: anteil(teil.reduce((sum, a) => sum + a.geloest, 0), n), ersterVersuch: anteil(teil.reduce((sum, a) => sum + a.erster, 0), n),
      abbrueche: ab, abbruchquote: anteil(ab, n + ab),
      zeitMedian: median(staende.flatMap(({ stand }) => stand.versuche.filter((x) => index.aufgabe.get(x.aufgabe)?.[feld] === wert).map((x) => x.dauer))) };
  }).filter((g) => g.imPool > 0);
  return { aufgaben, afb: gruppe('afb', [1, 2, 3], AFB_NAMEN), format: gruppe('format', Object.keys(FORMAT_NAMEN), FORMAT_NAMEN), niveau: gruppe('niveau', L.NIVEAUS) };
}
// Sichten auf die Aufgabenliste. Jede liefert die passenden Aufgaben in sinnvoller Reihenfolge.
export const AUFGABEN_SICHTEN = {
  schwierig: { titel: 'Schwierigste zuerst', wahl: (a) => a.bearbeitet > 0, ordnung: (a, b) => a.quote - b.quote || b.bearbeitet - a.bearbeitet },
  nieGeloest: { titel: 'Bearbeitet, aber nie gelöst', wahl: (a) => a.bearbeitet > 0 && a.geloest === 0, ordnung: (a, b) => b.bearbeitet - a.bearbeitet },
  geloest: { titel: 'Am häufigsten gelöst', wahl: (a) => a.geloest > 0, ordnung: (a, b) => b.geloest - a.geloest || b.quote - a.quote },
  bearbeitet: { titel: 'Am häufigsten bearbeitet', wahl: (a) => a.bearbeitet > 0, ordnung: (a, b) => b.bearbeitet - a.bearbeitet },
  abgebrochen: { titel: 'Am häufigsten abgebrochen', wahl: (a) => a.abbrueche > 0, ordnung: (a, b) => b.abbrueche - a.abbrueche },
  nie: { titel: 'Nie bearbeitet (obwohl angeboten)', wahl: (a) => a.bearbeitet === 0 && a.abbrueche === 0 && a.angeboten, ordnung: (a, b) => a.aufgabe.localeCompare(b.aufgabe) },
};
export function aufgabenSicht(aufgaben, sicht, filter = {}) {
  const s = AUFGABEN_SICHTEN[sicht] ?? AUFGABEN_SICHTEN.schwierig;
  return aufgaben.filter((a) => s.wahl(a) && (!filter.milestone || a.milestone?.id === filter.milestone) && (!filter.afb || a.afb === Number(filter.afb))
    && (!filter.format || a.format === filter.format) && (!filter.niveau || a.niveau === filter.niveau)).sort(s.ordnung);
}

// ---------- Tabellen für die Berichte ----------
const prozent = (x) => (x == null ? '' : Math.round(x * 100));
export function berichtstabellen(staende, pool, index, zielniveaus, name, jetzt) {
  const lernziele = lernzieleMitAufgaben(pool, index);
  const uebersicht = [['Name', 'Schülercode', 'Zielniveau', 'Rang', 'Siegel', 'Münzen', 'Aufgaben bearbeitet', 'davon gelöst', 'Lösungsquote in %',
    'Im ersten Versuch in %', 'Tipp', 'Beispiel', 'Lösungsschritt', 'Hilferufe', 'Zeit pro Aufgabe (Median, s)', 'Training in %', 'Letzte Aktivität',
    'AFB I in %', 'AFB II in %', 'AFB III in %', 'Lösungsquote ohne Hilfekärtchen in %', 'Lösungsquote mit Hilfekärtchen in %']];
  for (const { code, stand } of staende) {
    const k = kennzahlen(stand, zielVon(zielniveaus, code), jetzt);
    uebersicht.push([name(code), code, zielVon(zielniveaus, code), k.rang, k.siegel, k.muenzen, k.bearbeitet, k.geloest, prozent(k.quote),
      prozent(k.ersterVersuch), k.tipp, k.beispiel, k.loesungsschritt, k.hilferufe, k.zeitMedian ?? '', prozent(k.trainingAnteil), k.letzteAktivitaet ?? '',
      ...[1, 2, 3].map((n) => prozent(afbProfil(stand, index)[n].quote)), prozent(hilfenWirkung(stand).ohne.quote), prozent(hilfenWirkung(stand).mit.quote)]);
  }
  const matrix = [['Name', 'Schülercode', ...lernziele.map((l) => l.id)], ['', 'Lernziel', ...lernziele.map((l) => l.text)]];
  for (const zeile of lernzielmatrix(staende, lernziele, zielniveaus)) {
    matrix.push([name(zeile.code), zeile.code, ...zeile.zellen.map((c) => (c.status === 'siegel' ? 'Siegel' : c.status === 'gefestigt' ? 'Siegel, gefestigt' : c.status === 'aufzufrischen' ? 'Siegel, aufzufrischen' : c.status === 'begonnen' || c.status === 'wackelig' ? `${c.fortschritt} von ${L.LERNZIEL_RICHTIGE}` : c.abstecher ? 'Abstecher' : ''))]);
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
  const ziele = [['Lernziel', 'Text', 'Meilenstein', 'Schüler daran', 'erreicht von', 'Aufgaben bearbeitet', 'Lösungsquote in %', 'Zeit (Median, s)', 'mit Hilfekärtchen in %']];
  for (const l of lernzielStatistik(staende, lernziele)) {
    ziele.push([l.lernziel, l.text, l.milestone, l.schueler, l.erreicht, l.bearbeitet, prozent(l.quote), l.zeitMedian ?? '', prozent(l.hilfenAnteil)]);
  }
  const audit = [['Aufgabe', 'Text', 'Niveaustufe', 'AFB', 'Bearbeitet', 'Lösungsquote in %', 'Im ersten Versuch in %', 'Abgebrochen', 'Zeit (Median, s)', 'Häufigste falsche Antwort', 'wie oft', 'Prüfen?']];
  for (const a of aufgabenAudit(staende, index, 1)) {
    audit.push([a.aufgabe, index.aufgabe.get(a.aufgabe)?.text ?? '', a.niveau ?? '', a.afb ?? '', a.bearbeitet, prozent(a.quote), prozent(a.ersterVersuch), a.abbrueche, a.zeitMedian ?? '', a.haeufigsteFalsche ?? '', a.haeufigsteAnzahl || '', a.auffaellig ? 'ja' : '']);
  }
  const ueb = aufgabenUebersicht(staende, pool, index);
  const gruppen = [['Gruppe', 'Wert', 'Aufgaben im Pool', 'davon bearbeitet', 'Bearbeitungen', 'Lösungsquote in %', 'Im ersten Versuch in %', 'Abgebrochen', 'Zeit (Median, s)']];
  for (const [titel, liste] of [['Anforderungsbereich', ueb.afb], ['Aufgabentyp', ueb.format], ['Niveau', ueb.niveau]]) for (const g of liste) {
    gruppen.push([titel, g.name, g.imPool, g.genutzt, g.bearbeitet, prozent(g.quote), prozent(g.ersterVersuch), g.abbrueche, g.zeitMedian ?? '']);
  }
  const alle = [['Aufgabe', 'Text', 'Meilenstein', 'Lernziel', 'Niveaustufe', 'AFB', 'Aufgabentyp', 'Bearbeitet', 'Gelöst', 'Lösungsquote in %', 'Im ersten Versuch in %', 'Abgebrochen', 'Zeit (Median, s)', 'Status']];
  for (const a of ueb.aufgaben.filter((x) => x.bearbeitet || x.abbrueche || x.angeboten)) {
    alle.push([a.aufgabe, index.aufgabe.get(a.aufgabe)?.text ?? '', a.milestone?.titel ?? '', a.lernziel, a.niveau, a.afb, FORMAT_NAMEN[a.format] ?? a.format, a.bearbeitet, a.geloest,
      prozent(a.quote), prozent(a.ersterVersuch), a.abbrueche, a.zeitMedian ?? '', a.bearbeitet === 0 ? (a.abbrueche ? 'nur abgebrochen' : 'nie bearbeitet') : a.geloest === 0 ? 'nie gelöst' : '']);
  }
  return [
    { name: 'Übersicht', zeilen: uebersicht }, { name: 'Lernzielmatrix', zeilen: matrix }, { name: 'Lernziele', zeilen: ziele },
    { name: 'Typische Fehler', zeilen: fehler }, { name: 'Aufgaben-Audit', zeilen: audit }, { name: 'Versuchsprotokoll', zeilen: versuche },
    { name: 'Nach AFB, Typ, Niveau', zeilen: gruppen }, { name: 'Alle Aufgaben', zeilen: alle },
  ];
}

// ---------- Backups aufräumen ----------
// Behält alles der letzten 14 Tage und danach das jeweils erste Backup jeder Kalenderwoche.
// namen: Ordnernamen im Format JJJJ-MM-TT_HH-MM. Liefert die Namen, die gelöscht werden dürfen.
// Siegel zählen auch, wenn sie gerade aufzufrischen oder schon gefestigt sind.
export const hatSiegel = (status) => status === 'siegel' || status === 'gefestigt' || status === 'aufzufrischen';

// Expedition: Beitrag jedes Schülers und Stand der Klasse (ADR 0014). Nur die Lehrkraft sieht die Einzelbeiträge.
export function expeditionUebersicht(staende, expedition, jetzt) {
  const beitraege = staende.map(({ code, stand }) => ({ code, zeichen: L.expeditionsZeichen(stand, expedition) }));
  return { ...L.expeditionsStand(staende.map((x) => x.stand), expedition, jetzt), beitraege };
}

// ---------- Sicherheitsangabe und Heftcheck (ADR 0014) ----------
// Vier Felder je Versuch mit Sicherheitsangabe: sicher/unsicher × im ersten Versuch richtig/nicht.
export function sicherheitsProfil(versuche) {
  const mit = versuche.filter((v) => v.sicher != null);
  const ersterRichtig = (v) => v.richtig && v.versuche === 1;
  const p = { gesamt: mit.length, sicherRichtig: 0, sicherFalsch: 0, unsicherRichtig: 0, unsicherFalsch: 0, fehler: new Map() };
  for (const v of mit) {
    const feld = `${v.sicher ? 'sicher' : 'unsicher'}${ersterRichtig(v) ? 'Richtig' : 'Falsch'}`;
    p[feld]++;
    if (L.sicherFalsch(v)) for (const f of v.fehlvorstellungen ?? []) p.fehler.set(f, (p.fehler.get(f) ?? 0) + 1);
  }
  p.fehler = [...p.fehler].map(([fehlvorstellung, anzahl]) => ({ fehlvorstellung, anzahl })).sort((a, b) => b.anzahl - a.anzahl);
  return p;
}
export function heftQuote(stand) {
  const c = stand.heftchecks ?? [];
  return { gesamt: c.length, richtig: c.filter((x) => x.richtig).length, quote: anteil(c.filter((x) => x.richtig).length, c.length) };
}

// ---------- Tafelbild (ADR 0014) ----------
// Die Aufgabe, an der die Klasse eine Fehlvorstellung am häufigsten gezeigt hat, mit allen Antworten ohne Namen.
export function tafelAufgabe(staende, fehlvorstellung) {
  const je = new Map();
  for (const { stand } of staende) for (const v of stand.versuche) if ((v.fehlvorstellungen ?? []).includes(fehlvorstellung)) je.set(v.aufgabe, (je.get(v.aufgabe) ?? 0) + 1);
  return [...je].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
export function tafelbild(staende, aufgabeId) {
  const falsch = new Map();
  let richtig = 0, bearbeitet = 0;
  for (const { stand } of staende) for (const v of stand.versuche) {
    if (v.aufgabe !== aufgabeId) continue;
    bearbeitet++;
    if (v.richtig && v.versuche === 1) richtig++;
    const erste = (v.eingaben ?? [])[0];
    if (!(v.richtig && v.versuche === 1) && erste != null) { const t = alsText(erste); if (t) falsch.set(t, (falsch.get(t) ?? 0) + 1); }
  }
  return { bearbeitet, richtig, falsche: [...falsch].map(([antwort, anzahl]) => ({ antwort, anzahl })).sort((a, b) => b.anzahl - a.anzahl).slice(0, 5) };
}

// ---------- Einstiegscheck und Brücken (ADR 0014) ----------
// Vorwissen der Klasse je Meilenstein eines Kapitels: Anteil richtiger Einstiegsaufgaben, dazu wer fertig ist und wer übersprungen hat.
export function vorwissen(staende, pool, kapitelId) {
  const kapitel = pool.kapitel.find((k) => k.id === kapitelId);
  const meilensteinVon = new Map(kapitel.unterkapitel.flatMap((u) => u.lernziele.map((l) => [l.id, u])));
  const je = new Map();
  let fertig = 0, uebersprungen = 0;
  const empfehlungen = {};
  for (const { stand } of staende) {
    const e = stand.einstieg?.[kapitelId];
    if (!e) continue;
    if (e.uebersprungen) { uebersprungen++; continue; }
    if (e.fertig) { fertig++; empfehlungen[e.empfehlung] = (empfehlungen[e.empfehlung] ?? 0) + 1; }
    for (const x of e.erledigt ?? []) {
      const u = meilensteinVon.get(x.lernziel);
      if (!u) continue;
      if (!je.has(u.id)) je.set(u.id, { meilenstein: u.id, titel: u.titel, richtig: 0, gesamt: 0 });
      const z = je.get(u.id); z.gesamt++; if (x.richtig) z.richtig++;
    }
  }
  return { fertig, uebersprungen, empfehlungen, meilensteine: kapitel.unterkapitel.map((u) => je.get(u.id)).filter(Boolean).map((z) => ({ ...z, quote: anteil(z.richtig, z.gesamt) })) };
}
// Brücken-Impulse: In der laufenden Stunde ist ein Lernziel wackelig, und eine Voraussetzung hat noch kein Siegel (oder ist aufzufrischen).
export function brueckenImpulse(staende, index, jetzt) {
  const grenze = new Date(jetzt).getTime() - SITZUNG_MINUTEN * 60000;
  const liste = [];
  for (const { code, stand } of staende) {
    const heute = new Set(stand.versuche.filter((v) => !v.einstieg && new Date(v.t).getTime() >= grenze).map((v) => v.lernziel));
    for (const lz of heute) {
      if (stand.lernziele[lz] || !L.istWackelig(stand, lz)) continue;
      const vor = (index.lernziel.get(lz)?.voraussetzungen ?? []).filter((id) => index.lernzielMitAufgaben.has(id));
      const offen = vor.filter((id) => ['offen', 'begonnen', 'wackelig', 'aufzufrischen'].includes(lernzielZustand(stand, id)));
      if (!offen.length) continue;
      const genommen = (stand.bruecken ?? []).some((b) => b.fuer === lz && new Date(b.t).getTime() >= grenze);
      liste.push({ code, lernziel: lz, voraussetzungen: offen.map((id) => ({ id, zustand: lernzielZustand(stand, id) })), genommen });
    }
  }
  return liste;
}

// Grundlagen-Hinweise (ADR 0015): Ein Kind ist bei einem Lernziel zum zweiten Mal von G auf die Grundlage (F) zurückgefallen.
// Die Lehrkraft erfährt, welcher Baustein dort geübt wird. Beim ersten Mal bleibt es still: Die Schleife ist der normale Weg.
export function grundlagenHinweise(staende, index) {
  const liste = [];
  for (const { code, stand } of staende) {
    for (const [lernziel, g] of Object.entries(stand.grundlage ?? {})) {
      if (g.mal < L.GRUNDLAGE_HINWEIS_AB) continue;
      liste.push({ code, lernziel, mal: g.mal, aktiv: Boolean(g.aktiv), baustein: index.lernziel.get(lernziel)?.grundlage ?? null });
    }
  }
  return liste;
}

// ---------- Lernen sichtbar machen (ADR 0017) ----------
// Fehlvorstellungen, die in den Aufgaben der gegebenen Lernziele hinterlegt sind (typische Fehler und Auswahl-Antworten).
export function fehlvorstellungenZu(pool, lernzielIds) {
  const ids = new Set(lernzielIds), da = new Set();
  for (const a of pool.aufgaben) {
    if (!ids.has(a.lernziel)) continue;
    for (const f of a.typischeFehler ?? []) if (f.fehlvorstellung) da.add(f.fehlvorstellung);
    for (const o of a.optionen ?? []) if (o.fehlvorstellung) da.add(o.fehlvorstellung);
  }
  return da;
}
// Heatmap Schüler × Fehlvorstellung für die gegebenen Lernziele. Spalten nur für Fehlvorstellungen, die in der Klasse vorkamen,
// häufigste zuerst. Zelle: null (nie gezeigt) oder { status: 'aktiv' | 'ueberwunden', anzahl, zuletzt }.
export function fehlvorstellungsMatrix(staende, pool, lernzielIds) {
  const ids = new Set(lernzielIds);
  const moeglich = fehlvorstellungenZu(pool, lernzielIds);
  const zeilen = staende.map(({ code, stand }) => ({
    code, stand: new Map(L.fehlvorstellungsStand(stand.versuche.filter((v) => ids.has(v.lernziel))).map((e) => [e.fehlvorstellung, e])),
  }));
  const zahl = new Map();
  for (const z of zeilen) for (const [f, e] of z.stand) {
    const x = zahl.get(f) ?? { anzahl: 0, aktiv: 0, ueberwunden: 0 };
    x.anzahl += e.anzahl; x[e.status]++; zahl.set(f, x);
  }
  const spalten = [...zahl].sort((a, b) => b[1].aktiv - a[1].aktiv || b[1].anzahl - a[1].anzahl).map(([f, x]) => ({ fehlvorstellung: f, ...x }));
  return {
    spalten,
    nieGezeigt: [...moeglich].filter((f) => !zahl.has(f)).length,
    zeilen: zeilen.map((z) => ({ code: z.code, zellen: spalten.map((s) => z.stand.get(s.fehlvorstellung) ?? null) })),
  };
}

// Lernziele, bei denen ein Schüler viel Hilfe braucht (Beispiel oder Lösungsschritt in mindestens der Hälfte der letzten 10 Aufgaben).
export function vielHilfe(stand, lernzielIds) {
  return lernzielIds.map((id) => ({ lernziel: id, ...L.hilfebedarf(stand, id) })).filter((x) => x.viel);
}

// Diskrepanz: Einschätzung passt nicht zum Ergebnis.
// Überschätzt: mindestens 3 „sicher falsch“ unter den letzten 20 Aufgaben oder Selbsteinschätzung „eher zu hoch“.
// Unterschätzt: unter den letzten 20 Aufgaben mindestens 6 „unsicher“, davon mindestens die Hälfte im ersten Versuch richtig,
// oder Selbsteinschätzung „eher zu niedrig“. Ohne Sicherheitsangabe zählt nur die Selbsteinschätzung.
export const DISKREPANZ_FENSTER = 20, DISKREPANZ_SICHER_FALSCH = 3, DISKREPANZ_UNSICHER_AB = 6;
export function diskrepanz(stand, pool) {
  const letzte = stand.versuche.filter((v) => !v.einstieg).slice(-DISKREPANZ_FENSTER);
  const sicherFalsch = letzte.filter(L.sicherFalsch).length;
  const unsicher = letzte.filter((v) => v.sicher === false);
  const unsicherRichtig = unsicher.filter((v) => v.richtig && v.versuche === 1).length;
  const tendenz = selbsteinschaetzung(stand, pool).tendenz;
  const ueber = [], unter = [];
  if (sicherFalsch >= DISKREPANZ_SICHER_FALSCH) ueber.push(`${sicherFalsch}-mal sicher falsch in den letzten ${letzte.length} Aufgaben`);
  if (tendenz === 'eher zu hoch') ueber.push('wählt am Meilenstein eher zu hoch');
  if (unsicher.length >= DISKREPANZ_UNSICHER_AB && unsicherRichtig * 2 >= unsicher.length) unter.push(`${unsicherRichtig} von ${unsicher.length}-mal unsicher, aber richtig`);
  if (tendenz === 'eher zu niedrig') unter.push('wählt am Meilenstein eher zu niedrig');
  return { ueberschaetzt: ueber.length > 0, unterschaetzt: unter.length > 0, gruende: { ueber, unter } };
}

// Versuchsverlauf: die letzten Aufgaben mit erstem und zweitem Versuch, Ergebnis, Fehlvorstellung und Hilfen, neueste zuerst.
export function versuchsverlauf(stand, anzahl = 20) {
  const zeitlich = [...stand.versuche].sort((a, b) => String(a.t).localeCompare(String(b.t)));
  return zeitlich.slice(-anzahl).reverse().map((v) => {
    const e = v.eingaben ?? [];
    return {
      t: v.t, aufgabe: v.aufgabe, lernziel: v.lernziel, niveau: v.niveau, richtig: v.richtig,
      erster: e.length ? alsText(e[0]) : null, zweiter: e.length > 1 ? alsText(e[1]) : null,
      fehlvorstellungen: v.fehlvorstellungen ?? [], karten: L.KARTEN.filter((k) => L.hatKarte(v, k)), sicher: v.sicher ?? null,
      art: v.rueckblick ? 'Rückblick' : v.seitenblick ? 'Seitenblick' : v.bruecke ? 'Brücke' : v.sonderauftrag ? 'Sonderauftrag' : v.einstieg ? 'Einstiegscheck' : null,
    };
  });
}

// Kompetenzprofil (ADR 0017): je prozessbezogener Kompetenz der Anteil der Aufgaben, die im ersten Versuch
// ohne Beispiel und Lösungsschritt richtig waren. Haupt- und Nebenkompetenz zählen beide. Unter 6 Aufgaben: quote null.
export const KOMPETENZ_AB = 6;
export const KOMPETENZ_REIHE = ['symbolisch', 'probleme-loesen', 'modellieren', 'argumentieren', 'kommunizieren'];
export function kompetenzProfil(versuche, index) {
  const je = Object.fromEntries(KOMPETENZ_REIHE.map((k) => [k, { bearbeitet: 0, gut: 0, quote: null }]));
  for (const v of versuche) {
    for (const k of index.aufgabe.get(v.aufgabe)?.kompetenz ?? []) {
      if (!je[k]) continue;
      je[k].bearbeitet++;
      if (v.richtig && v.versuche === 1 && !L.brauchteHilfe(v)) je[k].gut++;
    }
  }
  for (const e of Object.values(je)) e.quote = e.bearbeitet >= KOMPETENZ_AB ? e.gut / e.bearbeitet : null;
  return je;
}

// Voraussetzungen eines Lernziels und Lernziele, die darauf aufbauen (Liste „baut auf“, ADR 0017).
export function bautAuf(pool, lernzielId) {
  const alle = pool.kapitel.flatMap((k) => k.unterkapitel.flatMap((u) => u.lernziele.map((l) => ({ ...l, milestone: u.titel }))));
  const von = alle.find((l) => l.id === lernzielId);
  return { auf: (von?.voraussetzungen ?? []).map((id) => alle.find((l) => l.id === id)).filter(Boolean), darauf: alle.filter((l) => l.voraussetzungen?.includes(lernzielId)) };
}

// ---------- Sonderauftrag (ADR 0021) ----------
// Die schwächsten Lernziele eines Schülers: wackelig, viele Fehlversuche, aktive Fehlvorstellung, aufzufrischen.
// Lernziele mit Siegel zählen nur, wenn sie aufzufrischen sind.
export function schwaechsteLernziele(stand, index, anzahl = 3) {
  const aktiv = new Map();
  for (const f of L.fehlvorstellungsStand(stand.versuche.filter((v) => !v.einstieg))) if (f.status === 'aktiv') aktiv.set(f.lernziel, (aktiv.get(f.lernziel) ?? 0) + 1);
  const je = new Map();
  for (const v of stand.versuche) {
    if (v.einstieg || !index.lernzielMitAufgaben.has(v.lernziel)) continue;
    const e = je.get(v.lernziel) ?? { lernziel: v.lernziel, versuche: 0, falsch: 0 };
    e.versuche++; if (!v.richtig) e.falsch++;
    je.set(v.lernziel, e);
  }
  return [...je.values()].map((e) => {
    const zustand = lernzielZustand(stand, e.lernziel);
    const fehlvorstellungen = aktiv.get(e.lernziel) ?? 0;
    const wert = (zustand === 'wackelig' ? 100 : 0) + (zustand === 'aufzufrischen' ? 50 : 0) + fehlvorstellungen * 10 + e.falsch * 5;
    return { ...e, zustand, fehlvorstellungen, wert };
  }).filter((e) => !['siegel', 'gefestigt'].includes(e.zustand) && (e.falsch > 0 || e.zustand !== 'begonnen'))
    .sort((a, b) => b.wert - a.wert || a.lernziel.localeCompare(b.lernziel)).slice(0, anzahl);
}
// Voraussetzungen der schwächsten Lernziele, ohne die Lernziele selbst und nur solche mit Aufgaben.
export function voraussetzungenVon(index, lernziele) {
  const schon = new Set(lernziele);
  const raus = [];
  for (const id of lernziele) for (const v of index.lernziel.get(id)?.voraussetzungen ?? []) {
    if (schon.has(v) || !index.lernzielMitAufgaben.has(v)) continue;
    schon.add(v); raus.push(v);
  }
  return raus;
}
// Aufgaben für einen Sonderauftrag: zuerst nie bearbeitete, dann nicht gelöste, zuletzt schon gelöste, je in der Folge des Pools.
// Liefert auch, wie viele ungelöste es gibt und welches Nachbarniveau mehr hätte.
export function sonderauftragAufgaben(index, stand, lernziel, niveau, anzahl, ohne = []) {
  const geloest = new Set(), bearbeitet = new Set();
  for (const v of stand.versuche) { if (v.einstieg) continue; bearbeitet.add(v.aufgabe); if (v.richtig) geloest.add(v.aufgabe); }
  const rang = (a) => (!bearbeitet.has(a.id) ? 0 : !geloest.has(a.id) ? 1 : 2);
  const ungeloest = (n) => (index.nach.get(`${lernziel}|${n}`) ?? []).filter((a) => !geloest.has(a.id)).length;
  const kandidaten = [...(index.nach.get(`${lernziel}|${niveau}`) ?? [])].filter((a) => !ohne.includes(a.id))
    .sort((a, b) => rang(a) - rang(b) || a.id.localeCompare(b.id));
  const frei = ungeloest(niveau);
  const stufe = L.NIVEAUS.indexOf(niveau);
  const nachbarn = [L.NIVEAUS[stufe - 1], L.NIVEAUS[stufe + 1]].filter(Boolean);
  const nachbar = frei >= anzahl ? null : nachbarn.filter((n) => ungeloest(n) >= anzahl).sort((a, b) => ungeloest(b) - ungeloest(a))[0] ?? null;
  return { aufgaben: kandidaten.slice(0, anzahl).map((a) => a.id), ungeloest: frei, vorrat: kandidaten.map((a) => a.id), nachbar };
}
// Zustand eines verschickten Sonderauftrags aus Sicht der Lehrkraft: gesendet | geoeffnet | erledigt.
// Münzgaben des Administrators an einen Schüler (ADR 0027), die neueste zuerst: geschickt, Betrag, geöffnet oder nicht.
// Auch Gaben, die nicht mehr in der Klassendatei stehen, aber geöffnet wurden, bleiben sichtbar.
export function muenzgabenStand(stand, gaben = []) {
  const geoeffnet = new Map((stand?.muenzgaben ?? []).map((g) => [g.id, g]));
  const liste = gaben.map((g) => ({ id: g.id, t: g.t, muenzen: g.muenzen, satz: g.satz ?? null, anKlasse: Boolean(g.anKlasse), geoeffnet: geoeffnet.get(g.id)?.t ?? null }));
  for (const [id, g] of geoeffnet) if (!liste.some((x) => x.id === id)) liste.push({ id, t: null, muenzen: g.muenzen, satz: null, geoeffnet: g.t });
  return liste.sort((a, b) => String(b.geoeffnet ?? b.t).localeCompare(String(a.geoeffnet ?? a.t)));
}
export function sonderauftragStand(stand, auftrag) {
  if (!auftrag) return null;
  const fertig = (stand?.sonderauftraege ?? []).find((x) => x.id === auftrag.id);
  const versuche = (stand?.versuche ?? []).filter((v) => v.sonderauftrag === auftrag.id);
  const fehlvorstellungen = [...new Set(versuche.flatMap((v) => v.fehlvorstellungen ?? []))];
  if (fertig) return { status: 'erledigt', richtig: fertig.richtig, gesamt: fertig.gesamt, am: fertig.t, fehlvorstellungen };
  const lauf = stand?.sonderauftrag?.id === auftrag.id ? stand.sonderauftrag : null;
  if (lauf) return { status: 'geoeffnet', erledigt: lauf.erledigt.length, richtig: lauf.erledigt.filter((e) => e.richtig).length, gesamt: auftrag.aufgaben.length, fehlvorstellungen };
  return { status: 'gesendet', erledigt: 0, gesamt: auftrag.aufgaben.length, fehlvorstellungen };
}
