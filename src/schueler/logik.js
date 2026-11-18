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
// Anforderungsbereiche: Reihenfolge der sechs Aufgaben einer Gruppe je Niveaustufe (ADR 0015), Mindestanspruch für das Siegel, Zuschlag für AFB III.
// F bleibt beim Wiedergeben und Anwenden, E hat zwei Aufgaben zum Begründen und Verallgemeinern.
export const AFB_FOLGEN = { F: [1, 1, 1, 1, 2, 1], G: [1, 1, 2, 1, 2, 3], M: [1, 2, 2, 1, 2, 3], E: [1, 2, 2, 3, 2, 3] };
export const AFB_FUER_STERN = 2;
export const AFB3_ZUSCHLAG = 1.5;
export const STANDARD_ZIELNIVEAU = 'M';
export const KARTEN = ['tipp', 'beispiel', 'loesungsschritt'];
// Auf F liegt das erste Hilfekärtchen von Anfang an offen. Auf E geht nach einem Fehlversuch keines von selbst auf (ADR 0015).
export const kartenZuBeginn = (aufgabe) => (aufgabe.niveau === 'F' && aufgabe.hilfen?.tipp ? 1 : 0);
export const tippVonSelbst = (aufgabe) => aufgabe.niveau !== 'E' && Boolean(aufgabe.hilfen?.tipp);
// Um diese Kronen kann ein Schüler spielen. Bronze steht nur zur Wahl, wenn die Lehrkraft das Ziel auf F gesetzt hat (ADR 0015).
export const wahlNiveaus = (zielniveau) => (zielniveau === 'F' ? NIVEAUS : NIVEAUS.slice(1));
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
    betrieb: [],       // Betriebsprotokoll: Starts und technische Probleme, die neuesten 50 (ADR 0013)
    rueckblick: {},    // Lernziel → { stufe, zuletzt?, aufzufrischen? }: verteiltes Wiederholen (ADR 0014)
    rueckblickAktiv: null, // laufender Rückblick: { tag, aufgaben: [id], erledigt: [{ aufgabe, lernziel, richtig }] }
    rueckblicke: [],   // abgeschlossene Rückblicke: { t, tag }
    expeditionen: {},  // Expedition → { geschafftAm }: Belohnung erhalten
    heftNr: 0,         // letzter vergebener Heftcode (H1, H2, …)
    heftSeitCheck: 0,  // Heftcodes seit dem letzten Heftcheck
    heftchecks: [],    // { t, heft, aufgabe, richtig }
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
  const lernziel = new Map((pool.kapitel ?? []).flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l]));
  // Lernziele, die auf jeder Niveaustufe Aufgaben aus AFB II oder III haben: Nur dort kann das Siegel eine solche Aufgabe verlangen.
  const mitAnspruch = new Set([...lernzielMitAufgaben].filter((l) => NIVEAUS.every((n) => (nach.get(`${l}|${n}`) ?? []).some((a) => a.afb >= AFB_FUER_STERN))));
  return { nach, lernzielMitAufgaben, aufgabe, mitAnspruch, meilensteinVon, lernziel };
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
// Mit Lösungsschritt-Kärtchen gelöst zählt nicht, Aufgaben aus dem Einstiegscheck zählen nie (ADR 0014).
const zaehlt = (v) => v.richtig && !v.einstieg && !hatKarte(v, 'loesungsschritt');
// Wackelig: mindestens 4 Aufgaben zum Lernziel, davon weniger als die Hälfte gelöst, oder zwei Mal das Lösungsschritt-Kärtchen.
export const WACKELIG_AB = 4;
export function istWackelig(stand, lernzielId) {
  const v = stand.versuche.filter((x) => x.lernziel === lernzielId && !x.einstieg);
  const geloest = v.filter((x) => x.richtig).length;
  const schritte = v.filter((x) => hatKarte(x, 'loesungsschritt')).length;
  return (v.length >= WACKELIG_AB && geloest / v.length < 0.5) || schritte >= 2;
}
// Mit `index` gilt zusätzlich: Mindestens eine der richtigen Aufgaben stammt aus AFB II oder III,
// sofern das Lernziel solche Aufgaben hat. Ohne `index` (reine Anzeige) wird das nicht geprüft.
// Auf F gilt diese Bedingung nicht: Bronze gibt es für drei richtige Aufgaben (ADR 0015).
export function lernzielStand(stand, lernzielId, zielniveau, index = null) {
  const ziel = NIVEAUS.indexOf(zielniveau);
  const alle = new Set(), aufZiel = new Set();
  let anspruch = zielniveau === 'F' || !index?.mitAnspruch.has(lernzielId);
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
  return stand.versuche.some((v) => !v.einstieg && mit.some((l) => l.id === v.lernziel)) ? 'begonnen' : 'offen';
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
  if (stand.versuche.some((v) => !v.einstieg && ids.has(v.lernziel))) return;
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
// Mit `niveau`: zuerst ein Lernziel, das für die Krone dieser Farbe noch fehlt (ADR 0012).
export function naechstesLernziel(index, stand, unterkapitel, niveau = null) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  const fehlt = niveau && mit.find((l) => !lernzielStand(stand, l.id, niveau, index).erreicht);
  return fehlt || mit.find((l) => !stand.lernziele[l.id]) || mit[0] || null;
}

// ---------- Aufgabe auswählen ----------
// Reihenfolge: noch nie bearbeitet, dann bearbeitet aber nicht gelöst, dann schon gelöst.
export function naechsteAufgabe(index, stand, lernzielId, niveau, zufall = Math.random) {
  const kandidaten = index.nach.get(`${lernzielId}|${niveau}`) ?? [];
  if (kandidaten.length === 0) return null;
  const geloest = new Set(), bearbeitet = new Set();
  for (const v of stand.versuche) { if (v.einstieg) continue; bearbeitet.add(v.aufgabe); if (v.richtig) geloest.add(v.aufgabe); }
  const letzte = stand.versuche.at(-1)?.aufgabe;
  const stufen = [
    kandidaten.filter((a) => !bearbeitet.has(a.id)),
    kandidaten.filter((a) => bearbeitet.has(a.id) && !geloest.has(a.id)),
    kandidaten,
  ];
  // Neue Aufgaben kommen in der Reihenfolge ihrer Nummern. So folgen die Anforderungsbereiche der festen Folge der Niveaustufe
  // (AFB_FOLGEN), und die Aufgaben einer Gruppe bauen aufeinander auf.
  const erste = [...stufen[0]].sort((a, b) => a.id.localeCompare(b.id)).slice(0, 1);
  for (const stufe of [erste, ...stufen]) {
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
// Mit `{ rueckblick: true }` zählt die Aufgabe zum Rückblick und nicht zur Selbsteinschätzung.
export function verbuche(stand, aufgabe, bearbeitung, zielniveau, jetzt, index = null, { rueckblick = false, bruecke = false } = {}) {
  const muenzen = muenzenFuer(stand, aufgabe, bearbeitung, zielniveau);
  const meilenstein = index?.meilensteinVon?.get(aufgabe.lernziel) ?? null;
  const kroneVorher = meilenstein ? krone(index, stand, meilenstein) : null;
  stand.versuche.push({
    t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau,
    richtig: bearbeitung.geloest, versuche: bearbeitung.versuche, eingaben: bearbeitung.eingaben,
    fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: bearbeitung.hilfen, dauer: bearbeitung.dauer, muenzen,
    ...(aufgabe.afb && { afb: aufgabe.afb }), ...(bearbeitung.karten && { karten: bearbeitung.karten }),
    ...(rueckblick && { rueckblick: true }), ...(bruecke && { bruecke: true }), ...(bearbeitung.sicher != null && { sicher: bearbeitung.sicher }),
  });
  // Heftcode für gelöste Aufgaben ab M (ADR 0014): Der Schüler schreibt ihn mit dem Ergebnis ins Heft.
  let heft = null;
  if (bearbeitung.geloest && NIVEAUS.indexOf(aufgabe.niveau) >= NIVEAUS.indexOf(HEFT_AB)) {
    stand.heftNr = (stand.heftNr ?? 0) + 1;
    heft = `H${stand.heftNr}`;
    stand.versuche.at(-1).heft = heft;
    stand.heftSeitCheck = (stand.heftSeitCheck ?? 0) + 1;
  }
  stand.muenzen += muenzen;
  let neuesLernziel = false;
  if (!stand.lernziele[aufgabe.lernziel] && lernzielStand(stand, aufgabe.lernziel, zielniveau, index).erreicht) {
    stand.lernziele[aufgabe.lernziel] = { erreichtAm: jetzt };
    neuesLernziel = true;
  }
  // Krone und Selbsteinschätzung: Wer unter der gewählten Krone arbeitet, bevor er dort eine Krone hat, ist abgestiegen.
  const kroneJetzt = meilenstein ? krone(index, stand, meilenstein) : null;
  const e = meilenstein && !rueckblick && !bruecke ? stand.einschaetzung?.[meilenstein.id] : null;
  let ersteKrone = false;
  if (e && !e.krone) {
    if (unterZiel(aufgabe.niveau, e.gewaehlt)) e.abstieg = true;
    if (kroneJetzt) { e.krone = kroneJetzt; e.kroneAm = jetzt; ersteKrone = true; }
  }
  const neueKrone = kroneJetzt && kroneJetzt !== kroneVorher ? { niveau: kroneJetzt, vorher: kroneVorher } : null;
  // Grundlagen-Schleife (ADR 0015): nur beim Üben am Meilenstein und nur, wenn das Ziel nicht ohnehin F ist.
  const grundlage = !rueckblick && !bruecke && zielniveau !== 'F' ? pruefeGrundlage(stand, aufgabe, jetzt, index) : null;
  return { muenzen, neuesLernziel, training: unterZiel(aufgabe.niveau, zielniveau), neueKrone, ersteKrone, einschaetzung: ersteKrone ? { ...e } : null, heft, grundlage };
}

// ---------- Rückblick (ADR 0014) ----------
// Verteiltes, gemischtes Wiederholen: Etwa 2, 7 und 21 Tage nach dem Siegel kommt ein Lernziel in den Rückblick.
// Ein Fehler nimmt nie ein Siegel weg; das Lernziel kommt im nächsten Rückblick wieder und gilt als aufzufrischen.
export const RUECKBLICK_TAGE = [2, 7, 21];
export const RUECKBLICK_MIN = 3, RUECKBLICK_MAX = 5;
const TAG_MS = 86400000;
export const tagVon = (iso) => new Date(iso).toLocaleDateString('sv-SE'); // JJJJ-MM-TT in Ortszeit
export function faelligeLernziele(stand, index, jetzt) {
  const r = stand.rueckblick ?? {};
  const faellig = [];
  for (const [id, { erreichtAm }] of Object.entries(stand.lernziele)) {
    if (!index.lernzielMitAufgaben.has(id)) continue;
    const e = r[id] ?? { stufe: 0 };
    if (e.aufzufrischen) { faellig.push({ id, seit: Infinity }); continue; }
    if (e.stufe >= RUECKBLICK_TAGE.length) continue;
    const alter = (new Date(jetzt) - new Date(erreichtAm)) / TAG_MS;
    if (alter >= RUECKBLICK_TAGE[e.stufe]) faellig.push({ id, seit: alter });
  }
  // Aufzufrischende zuerst, dann die ältesten Siegel.
  return faellig.sort((a, b) => (b.seit === a.seit ? 0 : b.seit > a.seit ? 1 : -1)).map((f) => f.id);
}
// Höchstens ein Rückblick am Tag: Wer heute schon einen begonnen hat, bekommt keinen neuen.
export const rueckblickHeuteBegonnen = (stand, jetzt) => stand.rueckblickAktiv?.tag === tagVon(jetzt) || (stand.rueckblicke ?? []).some((r) => r.tag === tagVon(jetzt));
export function rueckblickAngebot(stand, index, jetzt) {
  if (stand.rueckblickAktiv) return { art: 'fortsetzen', offen: stand.rueckblickAktiv.aufgaben.length - stand.rueckblickAktiv.erledigt.length };
  if (rueckblickHeuteBegonnen(stand, jetzt)) return null;
  const faellig = faelligeLernziele(stand, index, jetzt);
  return faellig.length ? { art: 'neu', lernziele: faellig.length } : null;
}
// Stellt drei bis fünf Aufgaben auf dem Zielniveau zusammen, abwechselnd aus verschiedenen Lernzielen.
export function stelleRueckblick(stand, index, zielniveau, jetzt, zufall = Math.random) {
  const faellig = faelligeLernziele(stand, index, jetzt).slice(0, RUECKBLICK_MAX);
  if (!faellig.length) return null;
  const anzahl = Math.max(RUECKBLICK_MIN, Math.min(RUECKBLICK_MAX, faellig.length));
  const bearbeitet = new Set(stand.versuche.map((v) => v.aufgabe));
  const gewaehlt = [];
  for (let i = 0; gewaehlt.length < anzahl && i < anzahl * 3; i++) {
    const lz = faellig[i % faellig.length];
    const alle = (index.nach.get(`${lz}|${zielniveau}`) ?? []).filter((a) => !gewaehlt.includes(a.id));
    const frisch = alle.filter((a) => !bearbeitet.has(a.id));
    const auswahl = frisch.length ? frisch : alle;
    if (auswahl.length) gewaehlt.push(auswahl[Math.floor(zufall() * auswahl.length)].id);
  }
  if (!gewaehlt.length) return null;
  stand.rueckblickAktiv = { tag: tagVon(jetzt), t: jetzt, aufgaben: gewaehlt, erledigt: [] };
  return stand.rueckblickAktiv;
}
export const naechsteRueckblickAufgabe = (stand) => {
  const r = stand.rueckblickAktiv;
  return r ? r.aufgaben.find((id) => !r.erledigt.some((e) => e.aufgabe === id)) ?? null : null;
};
// Nach jeder Rückblick-Aufgabe. Ist der Rückblick fertig, rücken richtig gelöste Lernziele eine Stufe weiter,
// Lernziele mit einem Fehler bleiben stehen und gelten als aufzufrischen. Ergebnis: null oder { fertig, richtig, gesamt, aufzufrischen: [id] }.
export function trageRueckblickEin(stand, aufgabe, richtig, jetzt) {
  const r = stand.rueckblickAktiv;
  if (!r || !r.aufgaben.includes(aufgabe.id) || r.erledigt.some((e) => e.aufgabe === aufgabe.id)) return null;
  r.erledigt.push({ aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, richtig });
  if (r.erledigt.length < r.aufgaben.length) return { fertig: false, richtig: r.erledigt.filter((e) => e.richtig).length, gesamt: r.aufgaben.length };
  stand.rueckblick ??= {};
  const aufzufrischen = [];
  for (const lz of new Set(r.erledigt.map((e) => e.lernziel))) {
    const e = (stand.rueckblick[lz] ??= { stufe: 0 });
    e.zuletzt = jetzt;
    if (r.erledigt.some((x) => x.lernziel === lz && !x.richtig)) { e.aufzufrischen = true; aufzufrischen.push(lz); }
    else { e.stufe = Math.min(RUECKBLICK_TAGE.length, e.stufe + 1); e.aufzufrischen = false; }
  }
  (stand.rueckblicke ??= []).push({ t: jetzt, tag: r.tag });
  stand.rueckblickAktiv = null;
  return { fertig: true, richtig: r.erledigt.filter((e) => e.richtig).length, gesamt: r.aufgaben.length, aufzufrischen };
}

// ---------- Expedition (ADR 0014) ----------
// Gemeinsames Klassenziel. Expeditionszeichen: eines je Siegel und eines je Tag mit abgeschlossenem Rückblick,
// gezählt zwischen Start und Enddatum der Expedition. expedition: { id, ziel, start, bis (JJJJ-MM-TT), belohnung: 'fahne' | 'spielpause' }
export function expeditionsZeichen(stand, expedition) {
  if (!stand || !expedition) return 0;
  const drin = (t) => t >= expedition.start && tagVon(t) <= expedition.bis;
  const siegelZahl = Object.values(stand.lernziele ?? {}).filter((l) => drin(l.erreichtAm)).length;
  const tage = new Set((stand.rueckblicke ?? []).filter((r) => drin(r.t)).map((r) => r.tag));
  return siegelZahl + tage.size;
}
// Stand der Klasse: alle Speicherstände zusammen. vorbei = Enddatum überschritten.
export function expeditionsStand(staende, expedition, jetzt) {
  const summe = staende.reduce((n, st) => n + expeditionsZeichen(st, expedition), 0);
  return { summe, ziel: expedition.ziel, geschafft: summe >= expedition.ziel, vorbei: tagVon(jetzt) > expedition.bis };
}
// Belohnung abholen, sobald die Klasse das Ziel erreicht hat. Die Expeditionsfahne gibt es nur so.
export function holeBelohnung(stand, expedition, jetzt) {
  stand.expeditionen ??= {};
  if (stand.expeditionen[expedition.id]) return false;
  stand.expeditionen[expedition.id] = { geschafftAm: jetzt };
  if (expedition.belohnung === 'fahne' && !stand.wappen.gekauft.includes('fahne')) stand.wappen.gekauft.push('fahne');
  return true;
}

// ---------- Einstiegscheck (ADR 0014) ----------
// Sechs bis acht Aufgaben über alle Meilensteine eines Kapitels, abwechselnd G und M, AFB I und II.
// Er stellt nur die Kronenwahl vor: keine Münzen, keine Siegel, zählt für kein Lernziel.
export const EINSTIEG_MIN = 6, EINSTIEG_MAX = 8;
const lernzieleMitAufgabenIn = (index, kapitel) => kapitel.unterkapitel.map((u) => u.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id))).filter((x) => x.length);
// offen: noch nicht gemacht und im Kapitel noch nichts gearbeitet | laeuft | null (fertig, übersprungen oder nicht nötig)
export function einstiegsZustand(stand, index, kapitel) {
  const e = stand.einstieg?.[kapitel.id];
  if (e) return e.fertig || e.uebersprungen ? null : 'laeuft';
  const gruppen = lernzieleMitAufgabenIn(index, kapitel);
  if (!gruppen.length) return null;
  const ids = new Set(gruppen.flat().map((l) => l.id));
  return stand.versuche.some((v) => ids.has(v.lernziel)) ? null : 'offen';
}
export function stelleEinstieg(stand, index, kapitel, jetzt, zufall = Math.random) {
  const gruppen = lernzieleMitAufgabenIn(index, kapitel);
  const alle = gruppen.flat().length;
  const anzahl = Math.max(EINSTIEG_MIN, Math.min(EINSTIEG_MAX, alle));
  // Reihum je Meilenstein ein Lernziel, damit jeder Meilenstein vorkommt.
  const folge = [];
  for (let runde = 0; folge.length < anzahl && runde < 20; runde++) for (const g of gruppen) if (folge.length < anzahl) folge.push(g[runde % g.length]);
  const aufgaben = [];
  folge.forEach((l, i) => {
    const niveau = i % 2 ? 'M' : 'G';
    const kandidaten = (index.nach.get(`${l.id}|${niveau}`) ?? []).filter((a) => (a.afb ?? 1) <= 2 && !aufgaben.includes(a.id));
    if (kandidaten.length) aufgaben.push(kandidaten[Math.floor(zufall() * kandidaten.length)].id);
  });
  (stand.einstieg ??= {})[kapitel.id] = { t: jetzt, aufgaben, erledigt: [] };
  return stand.einstieg[kapitel.id];
}
export const naechsteEinstiegsAufgabe = (stand, kapitelId) => {
  const e = stand.einstieg?.[kapitelId];
  return e && !e.fertig ? e.aufgaben.find((id) => !e.erledigt.some((x) => x.aufgabe === id)) ?? null : null;
};
// Vorschlag für die Kronenwahl aus den Ergebnissen: alles richtig → E, M mindestens zur Hälfte → M, G mindestens zur Hälfte → G, sonst F.
// Die unterste Empfehlung ist G. F wird nie empfohlen: Dorthin führt nur die Grundlagen-Schleife (ADR 0015).
export function einstiegsEmpfehlung(erledigt) {
  const quote = (n) => { const x = erledigt.filter((e) => e.niveau === n); return x.length ? x.filter((e) => e.richtig).length / x.length : 0; };
  const g = quote('G'), m = quote('M');
  if (g === 1 && m === 1) return 'E';
  if (m >= 0.5) return 'M';
  return 'G';
}
export function trageEinstiegEin(stand, kapitelId, aufgabe, bearbeitung, jetzt) {
  const e = stand.einstieg?.[kapitelId];
  if (!e || e.fertig || e.erledigt.some((x) => x.aufgabe === aufgabe.id)) return null;
  stand.versuche.push({ t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau, richtig: bearbeitung.geloest, versuche: 1,
    eingaben: bearbeitung.eingaben, fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: 0, dauer: bearbeitung.dauer, muenzen: 0, einstieg: true, ...(aufgabe.afb && { afb: aufgabe.afb }) });
  e.erledigt.push({ aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau, richtig: bearbeitung.geloest });
  if (e.erledigt.length < e.aufgaben.length) return { fertig: false, nummer: e.erledigt.length, gesamt: e.aufgaben.length };
  e.fertig = jetzt;
  e.empfehlung = einstiegsEmpfehlung(e.erledigt);
  return { fertig: true, gesamt: e.aufgaben.length, richtig: e.erledigt.filter((x) => x.richtig).length, empfehlung: e.empfehlung };
}
export function ueberspringeEinstieg(stand, kapitelId, jetzt) {
  (stand.einstieg ??= {})[kapitelId] = { uebersprungen: jetzt };
}

// ---------- Grundlagen-Schleife (ADR 0015) ----------
// Kommt ein Kind auf G bei einem Lernziel nicht weiter, übt es zuerst die Grundlage auf F und kehrt nach drei richtigen
// Aufgaben von selbst zurück. Die Schleife gilt je Lernziel. F wird nie gewählt oder empfohlen.
// stand.grundlage[lernziel] = { aktiv, ab, mal, t, zurueckAb? }: ab und zurueckAb sind Stellen im Versuchsprotokoll.
export const GRUNDLAGE_RICHTIGE = 3;
export const GRUNDLAGE_OHNE_ERFOLG = 2; // so viele Aufgaben trotz Lösungsschritt-Kärtchen nicht gelöst
export const GRUNDLAGE_HINWEIS_AB = 2; // ab dem zweiten Mal erfährt es die Lehrkraft
export const inGrundlage = (stand, lernzielId) => Boolean(stand.grundlage?.[lernzielId]?.aktiv);
// Niveaustufe der nächsten Aufgabe zu diesem Lernziel.
export const aufgabenNiveau = (stand, lernzielId, niveau) => (inGrundlage(stand, lernzielId) ? 'F' : niveau);
const eigenerVersuch = (v) => !v.einstieg && !v.rueckblick && !v.bruecke;
// Wie viele verschiedene F-Aufgaben in der laufenden Schleife schon richtig sind.
export function grundlageRichtige(stand, lernzielId) {
  const g = stand.grundlage?.[lernzielId];
  if (!g?.aktiv) return 0;
  return new Set(stand.versuche.slice(g.ab).filter((v) => v.lernziel === lernzielId && v.niveau === 'F' && eigenerVersuch(v) && zaehlt(v)).map((v) => v.aufgabe)).size;
}
// Nach dem Verbuchen einer Aufgabe: beginnt die Schleife, läuft sie weiter oder endet sie?
// Liefert null oder { art: 'beginnt' | 'laeuft' | 'endet', richtige, mal }.
export function pruefeGrundlage(stand, aufgabe, jetzt, index = null) {
  const id = aufgabe.lernziel, g = stand.grundlage?.[id];
  if (g?.aktiv) {
    const richtige = grundlageRichtige(stand, id);
    if (richtige < GRUNDLAGE_RICHTIGE) return { art: 'laeuft', richtige, mal: g.mal };
    g.aktiv = false; g.zurueckAb = stand.versuche.length; g.zurueckAm = jetzt;
    return { art: 'endet', richtige, mal: g.mal };
  }
  if (aufgabe.niveau !== 'G' || (index && !(index.nach.get(`${id}|F`) ?? []).length)) return null;
  const v = stand.versuche.slice(g?.zurueckAb ?? 0).filter((x) => x.lernziel === id && x.niveau === 'G' && eigenerVersuch(x));
  const ohneErfolg = v.filter((x) => !x.richtig && hatKarte(x, 'loesungsschritt')).length;
  const schritte = v.filter((x) => hatKarte(x, 'loesungsschritt')).length;
  const wackelig = (v.length >= WACKELIG_AB && v.filter((x) => x.richtig).length / v.length < 0.5) || schritte >= 2;
  if (ohneErfolg < GRUNDLAGE_OHNE_ERFOLG && !wackelig) return null;
  (stand.grundlage ??= {})[id] = { aktiv: true, ab: stand.versuche.length, mal: (g?.mal ?? 0) + 1, t: jetzt };
  return { art: 'beginnt', richtige: 0, mal: stand.grundlage[id].mal };
}

// ---------- Brücke (ADR 0014) ----------
// Wird ein Lernziel wackelig, schlägt das Dashboard drei Aufgaben zu einer Voraussetzung vor, eine Stufe unter dem Zielniveau.
// Höchstens eine Brücke je Lernziel und Tag; freiwillig.
export const BRUECKE_AUFGABEN = 3;
export function brueckeVorschlag(stand, index, lernzielId, jetzt) {
  if (stand.brueckeAktiv || inGrundlage(stand, lernzielId) || !istWackelig(stand, lernzielId)) return null;
  if ((stand.bruecken ?? []).some((b) => b.fuer === lernzielId && b.tag === tagVon(jetzt))) return null;
  const vor = (index.lernziel?.get(lernzielId)?.voraussetzungen ?? []).filter((id) => index.lernzielMitAufgaben.has(id));
  if (!vor.length) return null;
  const zu = vor.find((id) => !stand.lernziele[id] || stand.rueckblick?.[id]?.aufzufrischen) ?? vor[0];
  return { fuer: lernzielId, zu, text: index.lernziel.get(zu)?.text ?? zu };
}
export const brueckenNiveau = (zielniveau) => NIVEAUS[Math.max(0, NIVEAUS.indexOf(zielniveau) - 1)];
export function stelleBruecke(stand, index, vorschlag, zielniveau, jetzt, zufall = Math.random) {
  const niveau = brueckenNiveau(zielniveau);
  const geloest = new Set(stand.versuche.filter((v) => v.richtig).map((v) => v.aufgabe));
  const alle = index.nach.get(`${vorschlag.zu}|${niveau}`) ?? [];
  const frisch = alle.filter((a) => !geloest.has(a.id));
  const quelle = [...(frisch.length >= BRUECKE_AUFGABEN ? frisch : alle)];
  const aufgaben = [];
  while (aufgaben.length < BRUECKE_AUFGABEN && quelle.length) aufgaben.push(quelle.splice(Math.floor(zufall() * quelle.length), 1)[0].id);
  if (!aufgaben.length) return null;
  stand.brueckeAktiv = { t: jetzt, tag: tagVon(jetzt), fuer: vorschlag.fuer, zu: vorschlag.zu, aufgaben, erledigt: [] };
  return stand.brueckeAktiv;
}
export const naechsteBrueckenAufgabe = (stand) => {
  const b = stand.brueckeAktiv;
  return b ? b.aufgaben.find((id) => !b.erledigt.some((e) => e.aufgabe === id)) ?? null : null;
};
export function trageBrueckeEin(stand, aufgabe, richtig, jetzt) {
  const b = stand.brueckeAktiv;
  if (!b || !b.aufgaben.includes(aufgabe.id) || b.erledigt.some((e) => e.aufgabe === aufgabe.id)) return null;
  b.erledigt.push({ aufgabe: aufgabe.id, richtig });
  const ergebnis = { fertig: b.erledigt.length === b.aufgaben.length, nummer: b.erledigt.length, gesamt: b.aufgaben.length, richtig: b.erledigt.filter((e) => e.richtig).length, fuer: b.fuer, zu: b.zu };
  if (ergebnis.fertig) {
    (stand.bruecken ??= []).push({ t: jetzt, tag: b.tag, fuer: b.fuer, zu: b.zu, richtig: ergebnis.richtig, gesamt: ergebnis.gesamt });
    stand.brueckeAktiv = null;
  }
  return ergebnis;
}

// ---------- Sicherheitsangabe (ADR 0014) ----------
// „Sicher falsch“: beim ersten Versuch sicher geprüft, aber nicht im ersten Versuch gelöst. Stärkstes Zeichen einer Fehlvorstellung.
export const sicherFalsch = (v) => v.sicher === true && !(v.richtig && v.versuche === 1);

// ---------- Heftcheck (ADR 0014) ----------
// Etwa jede achte Aufgabe ab M fragt nach einem Ergebnis aus dem Heft. Falsch heißt: Die Aufgabe noch einmal lösen, ohne Münzverlust.
export const HEFT_AB = 'M';
export const HEFT_TAKT = 8;
// Der Wert, nach dem der Heftcheck fragt: bei Zahl und Zahlenstrahl die Lösung, bei Sachaufgabe und Diagramm die letzte Teilantwort.
export function heftWert(aufgabe) {
  if (['zahl', 'zahlenstrahl'].includes(aufgabe.format)) return { wert: aufgabe.loesung, einheit: aufgabe.einheit ?? null, fehler: (aufgabe.typischeFehler ?? []).map((f) => f.wert) };
  if (['sachaufgabe', 'diagramm'].includes(aufgabe.format) && aufgabe.teile?.length) {
    const t = aufgabe.teile.at(-1);
    return { wert: t.loesung, einheit: t.einheit ?? null, fehler: (t.typischeFehler ?? []).map((f) => f.wert) };
  }
  return null;
}
const mitEinheit = (w, einheit) => `${w >= 10000 ? String(w).replace(/\B(?=(\d{3})+$)/g, ' ') : w}${einheit ? ` ${einheit}` : ''}`;
export function heftcheckFrage(stand, index, zufall = Math.random) {
  if ((stand.heftSeitCheck ?? 0) < HEFT_TAKT) return null;
  // Gefragt wird nach einer der letzten Aufgaben mit Heftcode, nicht nach der allerletzten.
  const mitCode = stand.versuche.filter((v) => v.heft).slice(-HEFT_TAKT, -1)
    .map((v) => ({ v, a: index.aufgabe.get(v.aufgabe) })).filter(({ a }) => a && heftWert(a));
  if (!mitCode.length) return null;
  const { v, a } = mitCode[Math.floor(zufall() * mitCode.length)];
  const { wert, einheit, fehler } = heftWert(a);
  const falsche = [...new Set([...fehler, wert + 1, wert - 1, wert + 10, wert - 10, wert * 10, wert + 100])].filter((x) => Number.isInteger(x) && x >= 0 && x !== wert);
  const auswahl = [];
  for (const x of falsche) { if (auswahl.length < 3) auswahl.push(x); }
  const optionen = [wert, ...auswahl].map((x) => ({ text: mitEinheit(x, einheit), richtig: x === wert }));
  for (let i = optionen.length - 1; i > 0; i--) { const j = Math.floor(zufall() * (i + 1)); [optionen[i], optionen[j]] = [optionen[j], optionen[i]]; }
  return { heft: v.heft, aufgabe: a.id, optionen };
}
export function trageHeftcheckEin(stand, frage, richtig, jetzt) {
  (stand.heftchecks ??= []).push({ t: jetzt, heft: frage.heft, aufgabe: frage.aufgabe, richtig });
  stand.heftSeitCheck = 0;
}

// ---------- Niveaustufe ----------
// Wer früher um Bronze gespielt hat, spielt jetzt um Silber, außer die Lehrkraft hat das Ziel auf F gesetzt (ADR 0015).
export const arbeitsniveau = (stand, kapitelId, zielniveau) => {
  const n = stand.niveau[kapitelId] ?? zielniveau;
  return wahlNiveaus(zielniveau).includes(n) ? n : 'G';
};
// 'hoch' nach 4 von 5 guten Aufgaben, 'runter' nach 3 nicht gelösten in Folge, sonst null.
// 'runter' gibt es nur zu einer Krone, die zur Wahl steht: nie von Silber auf Bronze, außer das Ziel ist F.
export function niveauVorschlag(stand, kapitelId, niveau, zielniveau = STANDARD_ZIELNIVEAU) {
  const seit = stand.niveauMarke[kapitelId] ?? 0;
  const eigene = stand.versuche.slice(seit).filter((v) => !v.einstieg && !v.bruecke && kapitelVon(v.lernziel) === kapitelId && v.niveau === niveau);
  const stufe = NIVEAUS.indexOf(niveau);
  if (stufe < 3 && eigene.length >= 5 && eigene.slice(-5).filter(zaehlt).length >= 4) return 'hoch';
  if (stufe > NIVEAUS.indexOf(wahlNiveaus(zielniveau)[0]) && eigene.length >= 3 && eigene.slice(-3).every((v) => !v.richtig)) return 'runter';
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
  // Nicht zu kaufen: Belohnung einer geschafften Expedition (ADR 0014).
  { id: 'fahne', art: 'zeichen', name: 'Expeditionsfahne', preis: null, rang: 0, expedition: true },
];
export function kaufe(stand, id) {
  const teil = WAPPEN_TEILE.find((w) => w.id === id);
  if (!teil) return 'unbekannt';
  if (stand.wappen.gekauft.includes(id)) return 'vorhanden';
  if (teil.expedition) return 'expedition';
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
    expedition: k.expedition ?? null,
    sicherheitsangabe: Boolean(k.sicherheitsangabe),
    einstiegPflicht: new Set(k.einstiegPflicht ?? []),
    hilfeAntwort: k.hilfe?.[code] ?? null,
    nachricht: k.nachrichten?.[code] ?? null,
    pin: k.pins?.[code] ?? null, // { salz, wert }: Prüfwert der PIN, nicht die PIN selbst
    gesperrteMeilensteine: new Set(Object.entries(k.sperren ?? {}).filter(([, codes]) => codes.includes(code)).map(([meilenstein]) => meilenstein)),
    codeBekannt: k.codes ? k.codes.includes(code) : true,
  };
}
