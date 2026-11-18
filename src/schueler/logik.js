// Reine Auswertungslogik des Schüler-Dashboards: keine Oberfläche, kein Dateizugriff.
// Begriffe wie in CONTEXT.md.

export const NIVEAUS = ['F', 'G', 'M', 'E'];
export const NIVEAU_NAMEN = { F: 'Förderniveau', G: 'Grundlegendes Niveau', M: 'Mittleres Niveau', E: 'Erweitertes Niveau' };
export const MUENZEN_BASIS = { F: 10, G: 15, M: 20, E: 25 };
export const RAENGE = [
  { ab: 0, name: 'Wanderer' },
  { ab: 5, name: 'Kundschafter' },
  { ab: 15, name: 'Wegmeister' },
  { ab: 30, name: 'Hofkartograf' },
];
export const MINISPIEL_PREIS = 20;
export const MINISPIEL_SEKUNDEN = 90;

// Kronenfarben: So sehen Schüler die Niveaustufen (ADR 0012). Die Lehrkraft sieht nur F, G, M, E.
export const KRONEN = { F: 'Bronze', G: 'Silber', M: 'Gold', E: 'Purpur' };
// Lernziel-Regel (Startwerte, später pro Klasse einstellbar).
export const LERNZIEL_RICHTIGE = 3;
export const LERNZIEL_AUF_ZIELNIVEAU = 2;
// Anforderungsbereiche: Reihenfolge der sechs Aufgaben einer Gruppe, Mindestanspruch für das Siegel, Zuschlag für AFB III.
export const AFB_FOLGE = [1, 2, 2, 1, 2, 3];
export const AFB_FUER_STERN = 2;
export const AFB3_ZUSCHLAG = 1.5;
export const STANDARD_ZIELNIVEAU = 'M';
export const KARTEN = ['tipp', 'beispiel', 'loesungsschritt'];
// Welche Hilfekärtchen bei einem Versuch aufgedeckt wurden. Alte Einträge kennen nur die Anzahl.
export const hatKarte = (v, name) => (v.karten ? v.karten.includes(name) : (v.hilfen ?? 0) > KARTEN.indexOf(name));

// ---------- Schülercode ----------
export function leseCode(eingabe) {
  const code = String(eingabe ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const m = code.match(/^(\d{1,2}[A-Z])-([A-Z0-9]{4})$/);
  return m ? { code, klasse: m[1].toLowerCase() } : null;
}

// ---------- Speicherstand ----------
export function neuerSpeicherstand(code, klasse, jetzt) {
  return {
    version: 2, code, klasse, erstellt: jetzt, geaendert: jetzt,
    muenzen: 0,
    niveau: {},        // Kapitel → Niveaustufe, auf der gerade gearbeitet wird
    niveauMarke: {},   // Kapitel → Länge des Versuchsprotokolls beim letzten Wechsel oder abgelehnten Vorschlag
    lernziele: {},     // Lernziel → { erreichtAm }
    versuche: [],      // Versuchsprotokoll: ein Eintrag je bearbeiteter Aufgabe
    hilferuf: null,    // offener Hilferuf: { seit, aufgabe }
    hilferufe: [],     // abgeschlossene Hilferufe
    wappen: { farbe: 'rot', zeichen: [], gekauft: ['rot'] },
    spiele: [],
    aktiv: null,       // { aufgabe, seit, fehlversuche, hilfen } für die Live-Ansicht der Lehrkraft
    abbrueche: [],     // verlassene Aufgaben ohne Ergebnis: { t, aufgabe, fehlversuche, hilfen }
    gelesen: null,     // Zeitpunkt der letzten Nachricht der Lehrkraft, die der Schüler bestätigt hat
    einschaetzung: {}, // Meilenstein → { gewaehlt, t, abstieg?, krone?, kroneAm? }: Selbsteinschätzung (ADR 0012)
  };
}
// Ein Siegel je erreichtem Lernziel. Es wird nicht gespeichert, sondern aus den Lernzielen gezählt.
export const siegel = (stand) => Object.keys(stand.lernziele).length;
export function rang(anzahlSiegel) {
  let stufe = 0;
  RAENGE.forEach((r, i) => { if (anzahlSiegel >= r.ab) stufe = i; });
  const naechster = RAENGE[stufe + 1] ?? null;
  return { stufe, name: RAENGE[stufe].name, naechster };
}

// ---------- Pool ----------
export const kapitelVon = (lernzielId) => lernzielId.split('.').slice(0, 2).join('.');
export function indexiere(pool) {
  const nach = new Map();
  for (const a of pool.aufgaben) {
    const k = `${a.lernziel}|${a.niveau}`;
    if (!nach.has(k)) nach.set(k, []);
    nach.get(k).push(a);
  }
  const lernzielMitAufgaben = new Set(pool.aufgaben.map((a) => a.lernziel));
  // Lernziel → Unterkapitel (Meilenstein), für Kronen und Selbsteinschätzung.
  const meilensteinVon = new Map((pool.kapitel ?? []).flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele.map((l) => [l.id, u])));
  const aufgabe = new Map(pool.aufgaben.map((a) => [a.id, a]));
  // Lernziele, die auf jeder Niveaustufe Aufgaben aus AFB II oder III haben: Nur dort kann das Siegel eine solche Aufgabe verlangen.
  const mitAnspruch = new Set([...lernzielMitAufgaben].filter((l) => NIVEAUS.every((n) => (nach.get(`${l}|${n}`) ?? []).some((a) => a.afb >= AFB_FUER_STERN))));
  return { nach, lernzielMitAufgaben, aufgabe, mitAnspruch, meilensteinVon };
}

// ---------- Antworten prüfen ----------
export function leseZahl(text) {
  const s = String(text ?? '').replace(/[\s .']/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}
function pruefeZahl(teil, eingabe) {
  const wert = leseZahl(eingabe);
  if (wert === teil.loesung) return { richtig: true, fehlvorstellung: null };
  const treffer = (teil.typischeFehler ?? []).find((f) => f.wert === wert);
  return { richtig: false, fehlvorstellung: treffer?.fehlvorstellung ?? null };
}
// Fasst Teilergebnisse zusammen: richtig nur, wenn alles stimmt; erste erkannte Fehlvorstellung zählt.
function zusammen(teile) {
  return {
    richtig: teile.every((t) => t.richtig),
    fehlvorstellung: teile.find((t) => !t.richtig && t.fehlvorstellung)?.fehlvorstellung ?? null,
  };
}
export function pruefeAntwort(aufgabe, eingabe) {
  switch (aufgabe.format) {
    case 'zahl': case 'zahlenstrahl': return pruefeZahl(aufgabe, eingabe);
    case 'auswahl': {
      const gewaehlt = new Set(eingabe ?? []);
      const richtig = aufgabe.optionen.every((o) => gewaehlt.has(o.text) === o.richtig);
      const falsche = aufgabe.optionen.find((o) => gewaehlt.has(o.text) && !o.richtig && o.fehlvorstellung);
      return { richtig, fehlvorstellung: richtig ? null : falsche?.fehlvorstellung ?? null };
    }
    case 'luecken': case 'tabelle': return zusammen(Object.entries(aufgabe.luecken).map(([name, l]) => pruefeZahl(l, eingabe?.[name])));
    case 'zuordnen': return { richtig: aufgabe.paare.every((p) => eingabe?.[p.links] === p.rechts), fehlvorstellung: null };
    case 'sachaufgabe': case 'diagramm': return zusammen(aufgabe.teile.map((t, i) => pruefeZahl(t, eingabe?.[i])));
    default: throw new Error(`Unbekanntes Aufgabenformat: ${aufgabe.format}`);
  }
}

// ---------- Lernziele ----------
const zaehlt = (v) => v.richtig && !hatKarte(v, 'loesungsschritt'); // mit Lösungsschritt-Kärtchen gelöst zählt nicht
// Mit `index` gilt zusätzlich: Mindestens eine der richtigen Aufgaben stammt aus AFB II oder III,
// sofern das Lernziel solche Aufgaben hat. Ohne `index` (reine Anzeige) wird das nicht geprüft.
export function lernzielStand(stand, lernzielId, zielniveau, index = null) {
  const ziel = NIVEAUS.indexOf(zielniveau);
  const alle = new Set(), aufZiel = new Set();
  let anspruch = !index?.mitAnspruch.has(lernzielId);
  for (const v of stand.versuche) {
    if (v.lernziel !== lernzielId || !zaehlt(v)) continue;
    alle.add(v.aufgabe);
    if (NIVEAUS.indexOf(v.niveau) >= ziel) aufZiel.add(v.aufgabe);
    if ((v.afb ?? index?.aufgabe.get(v.aufgabe)?.afb ?? AFB_FUER_STERN) >= AFB_FUER_STERN) anspruch = true;
  }
  const genug = alle.size >= LERNZIEL_RICHTIGE && aufZiel.size >= LERNZIEL_AUF_ZIELNIVEAU;
  // Fortschritt für die Anzeige: höchstens eine Trainingsaufgabe zählt mit. Fehlt nur noch der Anspruch, bleibt ein Punkt offen.
  const punkte = Math.min(LERNZIEL_RICHTIGE, aufZiel.size + Math.min(alle.size - aufZiel.size, LERNZIEL_RICHTIGE - LERNZIEL_AUF_ZIELNIVEAU));
  return {
    richtige: alle.size, aufZiel: aufZiel.size, fortschritt: genug && !anspruch ? LERNZIEL_RICHTIGE - 1 : punkte,
    erreicht: genug && anspruch, anspruchFehlt: genug && !anspruch,
  };
}
// Zustand eines Meilensteins: leer (noch ohne Aufgaben) | offen | begonnen | gemeistert.
export function milestoneStatus(index, stand, unterkapitel) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  if (mit.length === 0) return 'leer';
  const erreicht = mit.filter((l) => stand.lernziele[l.id]).length;
  if (erreicht === mit.length) return 'gemeistert';
  return stand.versuche.some((v) => mit.some((l) => l.id === v.lernziel)) ? 'begonnen' : 'offen';
}
// Krone eines Meilensteins: das höchste Niveau, auf dem alle seine Lernziele nachgewiesen sind, sonst null.
// Nachgewiesen heißt: dieselbe Regel wie beim Lernziel, mit diesem Niveau statt dem Zielniveau (ADR 0012).
// Sie wird wie das Siegel nicht gespeichert, sondern aus dem Versuchsprotokoll berechnet.
export function krone(index, stand, unterkapitel) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  if (mit.length === 0) return null;
  for (const n of [...NIVEAUS].reverse()) {
    if (mit.every((l) => lernzielStand(stand, l.id, n, index).erreicht)) return n;
  }
  return null;
}
// Alle Kronen eines Schülers: Meilenstein → Niveaustufe.
export function kronen(pool, index, stand) {
  const alle = {};
  for (const u of pool.kapitel.flatMap((k) => k.unterkapitel)) { const n = krone(index, stand, u); if (n) alle[u.id] = n; }
  return alle;
}
export const unterZiel = (niveau, zielniveau) => NIVEAUS.indexOf(niveau) < NIVEAUS.indexOf(zielniveau);

// ---------- Selbsteinschätzung ----------
// Die Kronenwahl beim ersten Start eines Meilensteins wird festgehalten. Wer dort schon vor dieser Version gearbeitet hat, bekommt keine.
export function merkeWahl(stand, index, unterkapitel, niveau, jetzt) {
  stand.einschaetzung ??= {};
  if (stand.einschaetzung[unterkapitel.id]) return;
  const ids = new Set(unterkapitel.lernziele.map((l) => l.id));
  if (stand.versuche.some((v) => ids.has(v.lernziel))) return;
  stand.einschaetzung[unterkapitel.id] = { gewaehlt: niveau, t: jetzt };
}
// unterschaetzt | passend | ueberschaetzt, oder null, solange noch keine Krone da ist und kein Abstieg.
export function urteil(e) {
  if (!e) return null;
  if (e.abstieg) return 'ueberschaetzt';
  if (!e.krone) return null;
  const d = NIVEAUS.indexOf(e.krone) - NIVEAUS.indexOf(e.gewaehlt);
  return d > 0 ? 'unterschaetzt' : d < 0 ? 'ueberschaetzt' : 'passend';
}

// Siegel nachtragen, etwa nachdem die Lehrkraft das Zielniveau gesenkt hat. Siegel werden nie weggenommen.
export function trageSiegelNach(stand, index, zielniveau, jetzt) {
  let neu = 0;
  for (const id of index.lernzielMitAufgaben) {
    if (stand.lernziele[id] || !stand.versuche.some((v) => v.lernziel === id)) continue;
    if (lernzielStand(stand, id, zielniveau, index).erreicht) { stand.lernziele[id] = { erreichtAm: jetzt }; neu++; }
  }
  return neu;
}

// Etappe für die Startseite: das Kapitel, an dem gerade gearbeitet wird, mit Fortschritt und nächstem Meilenstein.
// Gesperrte Meilensteine und Meilensteine ohne Aufgaben zählen nicht mit.
export function etappe(pool, index, stand, einst) {
  const zu = einst.gesperrteMeilensteine ?? new Set();
  const lage = (k) => {
    const meilensteine = k.unterkapitel.filter((u) => !zu.has(u.id) && milestoneStatus(index, stand, u) !== 'leer');
    const offen = meilensteine.filter((u) => milestoneStatus(index, stand, u) !== 'gemeistert');
    const naechste = offen.find((u) => milestoneStatus(index, stand, u) === 'begonnen') ?? offen[0] ?? null;
    return { kapitel: k, gesamt: meilensteine.length, geschafft: meilensteine.length - offen.length, milestone: naechste };
  };
  const offene = pool.kapitel.filter((k) => einst.offeneKapitel.has(k.id)).map(lage).filter((l) => l.gesamt > 0);
  if (offene.length === 0) return null;
  const aktuell = offene.find((l) => l.kapitel.id === einst.aktuellesKapitel);
  return (aktuell?.milestone ? aktuell : null) ?? offene.find((l) => l.milestone) ?? aktuell ?? offene.at(-1);
}
export function naechstesLernziel(index, stand, unterkapitel) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  return mit.find((l) => !stand.lernziele[l.id]) ?? mit[0] ?? null;
}

// ---------- Aufgabe auswählen ----------
// Reihenfolge: noch nie bearbeitet, dann bearbeitet aber nicht gelöst, dann schon gelöst.
export function naechsteAufgabe(index, stand, lernzielId, niveau, zufall = Math.random) {
  const kandidaten = index.nach.get(`${lernzielId}|${niveau}`) ?? [];
  if (kandidaten.length === 0) return null;
  const geloest = new Set(), bearbeitet = new Set();
  for (const v of stand.versuche) { bearbeitet.add(v.aufgabe); if (v.richtig) geloest.add(v.aufgabe); }
  const letzte = stand.versuche.at(-1)?.aufgabe;
  const stufen = [
    kandidaten.filter((a) => !bearbeitet.has(a.id)),
    kandidaten.filter((a) => bearbeitet.has(a.id) && !geloest.has(a.id)),
    kandidaten,
  ];
  // Unter den neuen Aufgaben zuerst den Anforderungsbereich, der in der Folge I, II, II, I, II, III an der Reihe ist.
  const wunsch = AFB_FOLGE[kandidaten.filter((a) => bearbeitet.has(a.id)).length];
  const passend = stufen[0].filter((a) => a.afb === wunsch);
  for (const stufe of [passend, ...stufen]) {
    const ohneLetzte = stufe.filter((a) => a.id !== letzte);
    const auswahl = ohneLetzte.length ? ohneLetzte : stufe;
    if (auswahl.length) return auswahl[Math.floor(zufall() * auswahl.length)];
  }
  return null;
}

// ---------- Münzen ----------
export function muenzenFuer(stand, aufgabe, bearbeitung, zielniveau) {
  if (!bearbeitung.geloest) return 0;
  if (stand.versuche.some((v) => v.aufgabe === aufgabe.id && v.richtig)) return 1; // Wiederholung
  if (hatKarte(bearbeitung, 'loesungsschritt')) return 1;
  let m = MUENZEN_BASIS[aufgabe.niveau];
  if (aufgabe.afb === 3) m *= AFB3_ZUSCHLAG; // Aufgaben zum Beurteilen und Begründen bringen die Hälfte mehr
  if (NIVEAUS.indexOf(aufgabe.niveau) < NIVEAUS.indexOf(zielniveau)) m /= 2; // Training
  // Ein Fehlversuch und der Tipp kosten nichts (ADR 0010). Nur Beispiel und Lösungsschritt senken die Münzen.
  const karten = bearbeitung.karten ?? KARTEN.slice(0, bearbeitung.hilfen ?? 0);
  m *= 1 - 0.2 * karten.filter((k) => k !== 'tipp').length;
  return Math.max(1, Math.round(m));
}

// ---------- Bearbeitung verbuchen ----------
// bearbeitung: { geloest, versuche, eingaben, fehlvorstellungen, hilfen, karten, dauer }
// Mit `index` verlangt das Siegel auch eine Aufgabe aus AFB II oder III (siehe lernzielStand).
export function verbuche(stand, aufgabe, bearbeitung, zielniveau, jetzt, index = null) {
  const muenzen = muenzenFuer(stand, aufgabe, bearbeitung, zielniveau);
  const meilenstein = index?.meilensteinVon?.get(aufgabe.lernziel) ?? null;
  const kroneVorher = meilenstein ? krone(index, stand, meilenstein) : null;
  stand.versuche.push({
    t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau,
    richtig: bearbeitung.geloest, versuche: bearbeitung.versuche, eingaben: bearbeitung.eingaben,
    fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: bearbeitung.hilfen, dauer: bearbeitung.dauer, muenzen,
    ...(aufgabe.afb && { afb: aufgabe.afb }), ...(bearbeitung.karten && { karten: bearbeitung.karten }),
  });
  stand.muenzen += muenzen;
  let neuesLernziel = false;
  if (!stand.lernziele[aufgabe.lernziel] && lernzielStand(stand, aufgabe.lernziel, zielniveau, index).erreicht) {
    stand.lernziele[aufgabe.lernziel] = { erreichtAm: jetzt };
    neuesLernziel = true;
  }
  // Krone und Selbsteinschätzung: Wer unter der gewählten Krone arbeitet, bevor er dort eine Krone hat, ist abgestiegen.
  const kroneJetzt = meilenstein ? krone(index, stand, meilenstein) : null;
  const e = meilenstein ? stand.einschaetzung?.[meilenstein.id] : null;
  let ersteKrone = false;
  if (e && !e.krone) {
    if (unterZiel(aufgabe.niveau, e.gewaehlt)) e.abstieg = true;
    if (kroneJetzt) { e.krone = kroneJetzt; e.kroneAm = jetzt; ersteKrone = true; }
  }
  const neueKrone = kroneJetzt && kroneJetzt !== kroneVorher ? { niveau: kroneJetzt, vorher: kroneVorher } : null;
  return { muenzen, neuesLernziel, training: unterZiel(aufgabe.niveau, zielniveau), neueKrone, ersteKrone, einschaetzung: ersteKrone ? { ...e } : null };
}

// ---------- Niveaustufe ----------
export const arbeitsniveau = (stand, kapitelId, zielniveau) => stand.niveau[kapitelId] ?? zielniveau;
// 'hoch' nach 4 von 5 guten Aufgaben, 'runter' nach 3 nicht gelösten in Folge, sonst null.
export function niveauVorschlag(stand, kapitelId, niveau) {
  const seit = stand.niveauMarke[kapitelId] ?? 0;
  const eigene = stand.versuche.slice(seit).filter((v) => kapitelVon(v.lernziel) === kapitelId && v.niveau === niveau);
  const stufe = NIVEAUS.indexOf(niveau);
  if (stufe < 3 && eigene.length >= 5 && eigene.slice(-5).filter(zaehlt).length >= 4) return 'hoch';
  if (stufe > 0 && eigene.length >= 3 && eigene.slice(-3).every((v) => !v.richtig)) return 'runter';
  return null;
}
export function setzeNiveau(stand, kapitelId, niveau) {
  stand.niveau[kapitelId] = niveau;
  stand.niveauMarke[kapitelId] = stand.versuche.length;
}
export function lehneVorschlagAb(stand, kapitelId) {
  stand.niveauMarke[kapitelId] = stand.versuche.length;
}

// ---------- Hilferuf ----------
export function rufeHilfe(stand, aufgabeId, jetzt) {
  if (!stand.hilferuf) stand.hilferuf = { seit: jetzt, aufgabe: aufgabeId };
}
export function beendeHilferuf(stand, grund, jetzt) {
  if (!stand.hilferuf) return;
  stand.hilferufe.push({ ...stand.hilferuf, bis: jetzt, grund });
  stand.hilferuf = null;
}
// Platz in der Hilfe-Warteschlange: 1 = als Nächster dran.
export function wartePlatz(stand, andereHilferufe) {
  if (!stand.hilferuf) return null;
  return 1 + andereHilferufe.filter((h) => h && h.seit < stand.hilferuf.seit).length;
}

// ---------- Wappen ----------
// Farben und Zeichen fürs eigene Wappen. Preise und Rangstufen wie bei den früheren Lok-Teilen.
export const WAPPEN_TEILE = [
  { id: 'rot', art: 'farbe', name: 'Siegelrot', wert: '#9e2f28', preis: 0, rang: 0 },
  { id: 'blau', art: 'farbe', name: 'Seeblau', wert: '#2f5f8a', preis: 30, rang: 0 },
  { id: 'gruen', art: 'farbe', name: 'Waldgrün', wert: '#3e6b3a', preis: 30, rang: 0 },
  { id: 'violett', art: 'farbe', name: 'Königsviolett', wert: '#5e4280', preis: 60, rang: 1 },
  { id: 'schwarz', art: 'farbe', name: 'Tintenschwarz', wert: '#2c2a2e', preis: 90, rang: 2 },
  { id: 'gold', art: 'farbe', name: 'Goldgelb', wert: '#c39a2c', preis: 200, rang: 3 },
  { id: 'eichenlaub', art: 'zeichen', name: 'Eichenlaub', preis: 20, rang: 0 },
  { id: 'balken', art: 'zeichen', name: 'Querbalken', preis: 40, rang: 0 },
  { id: 'zirkel', art: 'zeichen', name: 'Zirkel', preis: 50, rang: 1 },
  { id: 'winkel', art: 'zeichen', name: 'Winkelmaß', preis: 70, rang: 2 },
  { id: 'lilie', art: 'zeichen', name: 'Lilie', preis: 250, rang: 3 },
];
export function kaufe(stand, id) {
  const teil = WAPPEN_TEILE.find((w) => w.id === id);
  if (!teil) return 'unbekannt';
  if (stand.wappen.gekauft.includes(id)) return 'vorhanden';
  if (rang(siegel(stand)).stufe < teil.rang) return 'rang';
  if (stand.muenzen < teil.preis) return 'muenzen';
  stand.muenzen -= teil.preis;
  stand.wappen.gekauft.push(id);
  return 'ok';
}
export function legeAn(stand, id) {
  const teil = WAPPEN_TEILE.find((w) => w.id === id);
  if (!teil || !stand.wappen.gekauft.includes(id)) return;
  if (teil.art === 'farbe') stand.wappen.farbe = id;
  else if (stand.wappen.zeichen.includes(id)) stand.wappen.zeichen = stand.wappen.zeichen.filter((x) => x !== id);
  else stand.wappen.zeichen.push(id);
}

// ---------- Alte Speicherstände ----------
// Version 1 hatte eine Lok: Jedes Lok-Teil wird das Wappen-Teil mit demselben Preis (ADR 0010).
const LOK_ZU_WAPPEN = { dampf: 'eichenlaub', streifen: 'balken', fahne: 'zirkel', laterne: 'winkel', krone: 'lilie' };
export function migriere(stand) {
  if (!stand) return stand;
  // Das Wappen-Zeichen Krone heißt seit ADR 0012 Lilie, damit „Krone“ eindeutig der Lohn am Meilenstein ist.
  if (stand.wappen) {
    const neu = (id) => (id === 'krone' ? 'lilie' : id);
    stand.wappen.zeichen = stand.wappen.zeichen.map(neu);
    stand.wappen.gekauft = stand.wappen.gekauft.map(neu);
    return stand;
  }
  const lok = stand.lok ?? { farbe: 'rot', extras: [], gekauft: ['rot'] };
  const neu = (id) => LOK_ZU_WAPPEN[id] ?? id;
  stand.wappen = { farbe: lok.farbe, zeichen: lok.extras.map(neu), gekauft: lok.gekauft.map(neu) };
  delete stand.lok;
  stand.version = 2;
  return stand;
}

// ---------- Minispiel ----------
export function starteMinispiel(stand, spielpauseErlaubt) {
  if (!spielpauseErlaubt) return 'keine-spielpause';
  if (stand.muenzen < MINISPIEL_PREIS) return 'muenzen';
  stand.muenzen -= MINISPIEL_PREIS;
  return 'ok';
}
export function kopfrechenAufgabe(zufall = Math.random) {
  const zz = (a, b) => a + Math.floor(zufall() * (b - a + 1));
  const art = zz(0, 3);
  if (art === 0) { const a = zz(11, 89), b = zz(11, 99 - a + 10); return { text: `${a} + ${b}`, loesung: a + b }; }
  if (art === 1) { const a = zz(30, 99), b = zz(11, a - 5); return { text: `${a} − ${b}`, loesung: a - b }; }
  if (art === 2) { const a = zz(2, 12), b = zz(2, 10); return { text: `${a} · ${b}`, loesung: a * b }; }
  const b = zz(2, 10), q = zz(2, 12); return { text: `${b * q} : ${b}`, loesung: q };
}

// ---------- Klassendatei ----------
// Ohne Klassendatei gelten Standardwerte: alle Kapitel offen, Zielniveau G, keine Spielpause.
export function einstellungen(klassendatei, code, pool) {
  const k = klassendatei ?? {};
  const kapitelIds = pool.kapitel.map((x) => x.id);
  const bis = k.aktuellesKapitel ? kapitelIds.indexOf(k.aktuellesKapitel) : kapitelIds.length - 1;
  return {
    zielniveau: k.zielniveaus?.[code] ?? STANDARD_ZIELNIVEAU,
    aktuellesKapitel: k.aktuellesKapitel ?? null,
    offeneKapitel: new Set(kapitelIds.slice(0, bis + 1)),
    spielpause: Boolean(k.spielpause),
    hilfeAntwort: k.hilfe?.[code] ?? null,
    nachricht: k.nachrichten?.[code] ?? null,
    pin: k.pins?.[code] ?? null, // { salz, wert }: Prüfwert der PIN, nicht die PIN selbst
    gesperrteMeilensteine: new Set(Object.entries(k.sperren ?? {}).filter(([, codes]) => codes.includes(code)).map(([meilenstein]) => meilenstein)),
    codeBekannt: k.codes ? k.codes.includes(code) : true,
  };
}
