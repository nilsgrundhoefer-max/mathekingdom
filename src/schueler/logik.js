// Reine Auswertungslogik des Schüler-Dashboards: keine Oberfläche, kein Dateizugriff.
// Begriffe wie in CONTEXT.md.

export const NIVEAUS = ['F', 'G', 'M', 'E'];
export const NIVEAU_NAMEN = { F: 'Förderniveau', G: 'Grundlegendes Niveau', M: 'Mittleres Niveau', E: 'Erweitertes Niveau' };
// Münzen am Zielniveau des Schülers (ADR 0018): auf dem Ziel bekommt jeder gleich viel, darüber mehr, im Training weniger.
export const MUENZEN = { ziel: 20, darueber: 25, training: 10 };
// Zwölf Ränge über sechs Schuljahre (ADR 0018). Die ersten vier bleiben, die Abstände wachsen mit den Jahren.
export const RAENGE = [
  { ab: 0, name: 'Wanderer' },
  { ab: 5, name: 'Kundschafter' },
  { ab: 15, name: 'Wegmeister' },
  { ab: 30, name: 'Hofkartograf' },
  { ab: 50, name: 'Fährtenleser' },
  { ab: 75, name: 'Landvermesser' },
  { ab: 105, name: 'Burgvogt' },
  { ab: 140, name: 'Kartenmeister' },
  { ab: 180, name: 'Hofgelehrter' },
  { ab: 225, name: 'Großkartograf' },
  { ab: 275, name: 'Kanzler des Reiches' },
  { ab: 330, name: 'Ritter der Karte' },
];

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
    wegstueck: null,   // laufendes Wegstück: { t, aufgaben: [{ aufgabe, richtig, muenzen, seitenblick? }] } (ADR 0016)
    wegstuecke: [],    // abgeschlossene Wegstücke: { t, bis, tag, richtig, gesamt, muenzen }
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
// Mit Lösungsschritt-Kärtchen gelöst zählt nicht, Aufgaben aus dem Einstiegscheck (ADR 0014) und Seitenblicke (ADR 0016) zählen nie.
const zaehlt = (v) => v.richtig && !v.einstieg && !v.seitenblick && !hatKarte(v, 'loesungsschritt');
// Wackelig: mindestens 4 Aufgaben zum Lernziel, davon weniger als die Hälfte gelöst, oder zwei Mal das Lösungsschritt-Kärtchen.
export const WACKELIG_AB = 4;
export function istWackelig(stand, lernzielId) {
  const v = stand.versuche.filter((x) => x.lernziel === lernzielId && !x.einstieg && !x.seitenblick && !x.gesperrt); // gesperrte Aufgaben zählen nicht (ADR 0025)
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
  // Ist das Klassenkapitel geschafft, kommt zuerst ein zusätzlich geöffnetes Tor (ADR 0022).
  const extra = offene.find((l) => l.milestone && einst.zusaetzlicheKapitel?.has(l.kapitel.id));
  return (aktuell?.milestone ? aktuell : null) ?? extra ?? offene.find((l) => l.milestone) ?? aktuell ?? offene.at(-1);
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
  const abstand = NIVEAUS.indexOf(aufgabe.niveau) - NIVEAUS.indexOf(zielniveau);
  let m = abstand === 0 ? MUENZEN.ziel : abstand > 0 ? MUENZEN.darueber : MUENZEN.training;
  if (aufgabe.afb === 3) m *= AFB3_ZUSCHLAG; // Aufgaben zum Beurteilen und Begründen bringen die Hälfte mehr
  // Ein Fehlversuch und der Tipp kosten nichts (ADR 0010). Nur Beispiel und Lösungsschritt senken die Münzen.
  const karten = bearbeitung.karten ?? KARTEN.slice(0, bearbeitung.hilfen ?? 0);
  m *= 1 - 0.2 * karten.filter((k) => k !== 'tipp').length;
  return Math.max(1, Math.round(m));
}

// ---------- Bearbeitung verbuchen ----------
// bearbeitung: { geloest, versuche, eingaben, fehlvorstellungen, hilfen, karten, dauer }
// Mit `index` verlangt das Siegel auch eine Aufgabe aus AFB II oder III (siehe lernzielStand).
// Mit `{ rueckblick: true }` zählt die Aufgabe zum Rückblick und nicht zur Selbsteinschätzung.
// Mit `{ seitenblick: true }` bringt sie nur Münzen: kein Siegel, keine Krone, keine Selbsteinschätzung, keine Grundlagen-Schleife (ADR 0016).
// Mit `{ sonderauftrag: id }` zählt sie wie die Brücke fürs Lernziel, aber nicht für Selbsteinschätzung und Grundlagen-Schleife (ADR 0021).
export function verbuche(stand, aufgabe, bearbeitung, zielniveau, jetzt, index = null, { rueckblick = false, bruecke = false, seitenblick = false, sonderauftrag = null } = {}) {
  const eigen = !rueckblick && !bruecke && !seitenblick && !sonderauftrag;
  const muenzen = muenzenFuer(stand, aufgabe, bearbeitung, zielniveau);
  const meilenstein = index?.meilensteinVon?.get(aufgabe.lernziel) ?? null;
  const kroneVorher = meilenstein ? krone(index, stand, meilenstein) : null;
  stand.versuche.push({
    t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau,
    richtig: bearbeitung.geloest, versuche: bearbeitung.versuche, eingaben: bearbeitung.eingaben,
    fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: bearbeitung.hilfen, dauer: bearbeitung.dauer, muenzen,
    ...(aufgabe.afb && { afb: aufgabe.afb }), ...(bearbeitung.karten && { karten: bearbeitung.karten }),
    ...(rueckblick && { rueckblick: true }), ...(bruecke && { bruecke: true }), ...(seitenblick && { seitenblick: true }), ...(sonderauftrag && { sonderauftrag }), ...(bearbeitung.sicher != null && { sicher: bearbeitung.sicher }),
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
  const e = meilenstein && eigen ? stand.einschaetzung?.[meilenstein.id] : null;
  let ersteKrone = false;
  if (e && !e.krone) {
    if (unterZiel(aufgabe.niveau, e.gewaehlt)) e.abstieg = true;
    if (kroneJetzt) { e.krone = kroneJetzt; e.kroneAm = jetzt; ersteKrone = true; }
  }
  const neueKrone = kroneJetzt && kroneJetzt !== kroneVorher ? { niveau: kroneJetzt, vorher: kroneVorher } : null;
  // Grundlagen-Schleife (ADR 0015): nur beim Üben am Meilenstein und nur, wenn das Ziel nicht ohnehin F ist.
  const grundlage = eigen && zielniveau !== 'F' ? pruefeGrundlage(stand, aufgabe, jetzt, index) : null;
  // Erstmals ohne Beispiel und Lösungsschritt (ADR 0017): nur beim Üben am Meilenstein.
  const ohneHilfe = eigen && erstmalsOhneHilfe(stand);
  return { muenzen, neuesLernziel, training: unterZiel(aufgabe.niveau, zielniveau), neueKrone, ersteKrone, einschaetzung: ersteKrone ? { ...e } : null, heft, grundlage, ohneHilfe };
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
  if (expedition.belohnung === 'fahne' && !stand.wappen.gekauft.includes('fahne')) { stand.wappen.gekauft.push('fahne'); (stand.neueEhre ??= []).push('fahne'); }
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
const eigenerVersuch = (v) => !v.einstieg && !v.rueckblick && !v.bruecke && !v.seitenblick && !v.sonderauftrag && !v.gesperrt;
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

// ---------- Sonderauftrag (ADR 0021) ----------
// Die Lehrkraft schickt einem Schüler drei bis fünf Aufgaben zu einem Lernziel über die Klassendatei:
// { id, lernziel, niveau, aufgaben: [Aufgaben-Ids], satz? }. Zurückziehen heißt: Der Eintrag fehlt.
// Der Speicherstand merkt sich den laufenden Auftrag (sonderauftrag) und die erledigten (sonderauftraege).
export const SONDERAUFTRAG_BONUS = 100;
export const SONDERAUFTRAG_MIN = 3, SONDERAUFTRAG_MAX = 5;
function gueltigerAuftrag(a) {
  if (!a?.id || !Array.isArray(a.aufgaben) || a.aufgaben.length === 0) return null;
  return { id: String(a.id), lernziel: a.lernziel, niveau: a.niveau, aufgaben: a.aufgaben.slice(0, SONDERAUFTRAG_MAX), satz: a.satz ? String(a.satz).slice(0, 200) : null, t: a.t ?? a.id };
}
const erledigterAuftrag = (stand, id) => (stand.sonderauftraege ?? []).some((x) => x.id === id);
// Stimmt der laufende Auftrag im Speicherstand nicht mehr mit der Klassendatei überein (zurückgezogen oder ersetzt),
// wird er verworfen. Gelöste Aufgaben behalten ihre Münzen, einen Bonus gibt es nicht.
export function gleicheSonderauftragAb(stand, auftrag) {
  if (stand.sonderauftrag && stand.sonderauftrag.id !== auftrag?.id) { stand.sonderauftrag = null; return true; }
  return false;
}
// Offener Auftrag für die Anzeige: null, wenn keiner da oder schon erledigt ist.
export function offenerSonderauftrag(stand, auftrag) {
  if (!auftrag || erledigterAuftrag(stand, auftrag.id)) return null;
  const lauf = stand.sonderauftrag?.id === auftrag.id ? stand.sonderauftrag : null;
  const erledigt = lauf?.erledigt.length ?? 0;
  return { ...auftrag, geoeffnet: Boolean(lauf), erledigt, offen: auftrag.aufgaben.length - erledigt, gesamt: auftrag.aufgaben.length };
}
// Öffnen: Ab jetzt sieht die Lehrkraft „geöffnet“. `zurueck` sagt, wohin es danach geht.
export function oeffneSonderauftrag(stand, auftrag, zurueck, jetzt) {
  if (!auftrag || erledigterAuftrag(stand, auftrag.id)) return null;
  if (stand.sonderauftrag?.id !== auftrag.id) stand.sonderauftrag = { id: auftrag.id, t: jetzt, erledigt: [], zurueck: zurueck ?? null };
  else if (zurueck && !stand.sonderauftrag.zurueck) stand.sonderauftrag.zurueck = zurueck; // der erste Ort gilt
  return stand.sonderauftrag;
}
export function naechsteSonderauftragAufgabe(stand, auftrag) {
  const lauf = stand.sonderauftrag;
  if (!auftrag || lauf?.id !== auftrag.id) return null;
  return auftrag.aufgaben.find((id) => !lauf.erledigt.some((e) => e.aufgabe === id)) ?? null;
}
// Nach dem Verbuchen einer Aufgabe. Ist die letzte bearbeitet, gibt es den Bonus, egal wie viele richtig sind.
export function trageSonderauftragEin(stand, auftrag, aufgabe, richtig, jetzt) {
  const lauf = stand.sonderauftrag;
  if (!auftrag || lauf?.id !== auftrag.id || !auftrag.aufgaben.includes(aufgabe.id) || lauf.erledigt.some((e) => e.aufgabe === aufgabe.id)) return null;
  lauf.erledigt.push({ aufgabe: aufgabe.id, richtig });
  const ergebnis = { fertig: lauf.erledigt.length >= auftrag.aufgaben.length, nummer: lauf.erledigt.length, gesamt: auftrag.aufgaben.length,
    richtig: lauf.erledigt.filter((e) => e.richtig).length, bonus: 0, zurueck: lauf.zurueck ?? null };
  if (ergebnis.fertig) {
    ergebnis.bonus = SONDERAUFTRAG_BONUS;
    stand.muenzen += SONDERAUFTRAG_BONUS;
    (stand.sonderauftraege ??= []).push({ id: auftrag.id, t: jetzt, lernziel: auftrag.lernziel, niveau: auftrag.niveau, richtig: ergebnis.richtig, gesamt: ergebnis.gesamt, bonus: SONDERAUFTRAG_BONUS });
    stand.sonderauftrag = null;
  }
  return ergebnis;
}

// ---------- Wegstück (ADR 0016) ----------
// Fünf Aufgaben, etwa fünf Minuten. Es zählt Aufgaben, nicht Lernziele: Grundlagen-Schleife, Brücke und Seitenblick zählen mit,
// Rückblick, Einstiegscheck und Heftcheck nicht. Der Stand bleibt im Speicherstand, bis das Wegstück fertig ist.
export const WEGSTUECK_AUFGABEN = 5;
export const SEITENBLICK_AB = 3;   // frühestens die vierte Aufgabe eines Wegstücks ist der Seitenblick
export const RAST_NACH = 4;        // nach jedem vierten Wegstück des Tages schlägt das Dashboard eine Rast vor
export const RAST_SEKUNDEN = 60;
// Nummer der Aufgabe, die gerade läuft oder als nächste kommt (1 bis 5).
export const wegstueckNummer = (stand) => Math.min(WEGSTUECK_AUFGABEN, (stand.wegstueck?.aufgaben.length ?? 0) + 1);
export const wegstueckeAm = (stand, tag) => (stand.wegstuecke ?? []).filter((w) => w.tag === tag);
export function trageWegstueckEin(stand, aufgabe, { richtig, muenzen = 0, seitenblick = false }, jetzt) {
  const w = (stand.wegstueck ??= { t: jetzt, aufgaben: [] });
  w.aufgaben.push({ aufgabe: aufgabe.id, richtig, muenzen, ...(seitenblick && { seitenblick: true }) });
  const ergebnis = {
    nummer: w.aufgaben.length, gesamt: WEGSTUECK_AUFGABEN, fertig: w.aufgaben.length >= WEGSTUECK_AUFGABEN,
    richtig: w.aufgaben.filter((a) => a.richtig).length, muenzen: w.aufgaben.reduce((s, a) => s + (a.muenzen ?? 0), 0),
    punkte: w.aufgaben.map((a) => a.richtig),
  };
  if (ergebnis.fertig) {
    const tag = tagVon(jetzt);
    (stand.wegstuecke ??= []).push({ t: w.t, bis: jetzt, tag, richtig: ergebnis.richtig, gesamt: ergebnis.gesamt, muenzen: ergebnis.muenzen });
    stand.wegstueck = null;
    ergebnis.heute = wegstueckeAm(stand, tag).length;
    ergebnis.rast = ergebnis.heute % RAST_NACH === 0;
    // Mit der Spielfreigabe „verdient“ gibt es zur selben Zeit ein Belohnungsspiel (ADR 0018). Es sammelt sich nicht an.
    if (ergebnis.rast) stand.spielGutschrift = 1;
  }
  return ergebnis;
}
// Ein Seitenblick ist fällig ab der vierten Aufgabe, solange das laufende Wegstück noch keinen hatte.
export function seitenblickFaellig(stand) {
  const w = stand.wegstueck;
  return Boolean(w) && w.aufgaben.length >= SEITENBLICK_AB && !w.aufgaben.some((a) => a.seitenblick);
}
// Aufgabe zu einem schon besiegelten Lernziel desselben Kapitels, das am längsten nicht mehr dran war. Ohne Siegel: null.
export function waehleSeitenblick(index, stand, lernzielId, niveau, zufall = Math.random) {
  const kapitel = kapitelVon(lernzielId);
  const kandidaten = Object.keys(stand.lernziele).filter((id) => id !== lernzielId && kapitelVon(id) === kapitel && (index.nach.get(`${id}|${niveau}`) ?? []).length);
  if (!kandidaten.length) return null;
  const zuletzt = new Map(kandidaten.map((id) => [id, '']));
  for (const v of stand.versuche) if (zuletzt.has(v.lernziel) && v.t > zuletzt.get(v.lernziel)) zuletzt.set(v.lernziel, v.t);
  kandidaten.sort((a, b) => (zuletzt.get(a) < zuletzt.get(b) ? -1 : zuletzt.get(a) > zuletzt.get(b) ? 1 : 0));
  return naechsteAufgabe(index, stand, kandidaten[0], niveau, zufall);
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
  const eigene = stand.versuche.slice(seit).filter((v) => !v.einstieg && !v.bruecke && !v.seitenblick && !v.sonderauftrag && kapitelVon(v.lernziel) === kapitelId && v.niveau === niveau);
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

// ---------- Wappen (ADR 0018) ----------
// Der Wappenschrank wächst mit der Klassenstufe: Jede öffnet beim Schuljahreswechsel einen neuen Wappenbereich.
// Gebaut ist bisher der Bereich von Klasse 5 (Farben und Zeichen); die späteren zeigt der Schrank nur als Ausblick.
export const WAPPENBEREICHE = [
  { klasse: 5, name: 'Farben und Zeichen' },
  { klasse: 6, name: 'Schildteilung' },
  { klasse: 7, name: 'Helmzier' },
  { klasse: 8, name: 'Schildhalter' },
  { klasse: 9, name: 'Wahlspruch' },
  { klasse: 10, name: 'Prunkrahmen' },
];
export const ZEICHEN_GRUPPEN = { formen: 'Formen', natur: 'Natur', werkzeuge: 'Werkzeuge', bauwerke: 'Bauwerke', tiere: 'Tiere', ehre: 'Ehrenzeichen' };
// Ein Wappen trägt ein Hauptzeichen und bis zu zwei Beizeichen: zeichen[0] ist das Hauptzeichen.
export const MAX_ZEICHEN = 3;
// Preise für ein Schuljahr: zusammen etwa 5.000 Münzen, einzeln 50 bis 600. `rang` ist die Rangstufe, ab der ein Teil kaufbar ist.
// `metall`: helle Farbe, auf der die Zeichen dunkel stehen.
export const WAPPEN_TEILE = [
  { id: 'rot', art: 'farbe', klasse: 5, name: 'Siegelrot', wert: '#9e2f28', preis: 0, rang: 0 },
  { id: 'blau', art: 'farbe', klasse: 5, name: 'Seeblau', wert: '#2f5f8a', preis: 60, rang: 0 },
  { id: 'gruen', art: 'farbe', klasse: 5, name: 'Waldgrün', wert: '#3e6b3a', preis: 60, rang: 0 },
  { id: 'himmel', art: 'farbe', klasse: 5, name: 'Himmelblau', wert: '#4f86b0', preis: 90, rang: 0 },
  { id: 'braun', art: 'farbe', klasse: 5, name: 'Erdbraun', wert: '#7a5232', preis: 90, rang: 0 },
  { id: 'rost', art: 'farbe', klasse: 5, name: 'Rostorange', wert: '#b0592a', preis: 120, rang: 1 },
  { id: 'weinrot', art: 'farbe', klasse: 5, name: 'Weinrot', wert: '#6e2233', preis: 120, rang: 1 },
  { id: 'violett', art: 'farbe', klasse: 5, name: 'Königsviolett', wert: '#5e4280', preis: 160, rang: 1 },
  { id: 'moos', art: 'farbe', klasse: 5, name: 'Moosgrün', wert: '#5b6b2e', preis: 160, rang: 2 },
  { id: 'schwarz', art: 'farbe', klasse: 5, name: 'Tintenschwarz', wert: '#2c2a2e', preis: 220, rang: 2 },
  { id: 'silber', art: 'farbe', klasse: 5, name: 'Silber', wert: '#c9ccc8', preis: 320, rang: 2, metall: true },
  { id: 'gold', art: 'farbe', klasse: 5, name: 'Gold', wert: '#d2a93c', preis: 450, rang: 3, metall: true },
  { id: 'kreis', art: 'zeichen', gruppe: 'formen', klasse: 5, name: 'Kugel', preis: 50, rang: 0 },
  { id: 'raute', art: 'zeichen', gruppe: 'formen', klasse: 5, name: 'Raute', preis: 60, rang: 0 },
  { id: 'balken', art: 'zeichen', gruppe: 'formen', klasse: 5, name: 'Querbalken', preis: 70, rang: 0 },
  { id: 'stern', art: 'zeichen', gruppe: 'formen', klasse: 5, name: 'Stern', preis: 90, rang: 0 },
  { id: 'eichenlaub', art: 'zeichen', gruppe: 'natur', klasse: 5, name: 'Eichenlaub', preis: 80, rang: 0 },
  { id: 'lilie', art: 'zeichen', gruppe: 'natur', klasse: 5, name: 'Lilie', preis: 500, rang: 4 },
  { id: 'feder', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Schreibfeder', preis: 100, rang: 0 },
  { id: 'buch', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Buch', preis: 110, rang: 0 },
  { id: 'schluessel', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Schlüssel', preis: 120, rang: 1 },
  { id: 'zirkel', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Zirkel', preis: 150, rang: 1 },
  { id: 'winkel', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Winkelmaß', preis: 150, rang: 1 },
  { id: 'sanduhr', art: 'zeichen', gruppe: 'werkzeuge', klasse: 5, name: 'Sanduhr', preis: 180, rang: 2 },
  { id: 'tor', art: 'zeichen', gruppe: 'bauwerke', klasse: 5, name: 'Tor', preis: 140, rang: 1 },
  { id: 'bruecke', art: 'zeichen', gruppe: 'bauwerke', klasse: 5, name: 'Brücke', preis: 160, rang: 1 },
  { id: 'turm', art: 'zeichen', gruppe: 'bauwerke', klasse: 5, name: 'Turm', preis: 200, rang: 2 },
  { id: 'eule', art: 'zeichen', gruppe: 'tiere', klasse: 5, name: 'Eule', preis: 160, rang: 1 },
  { id: 'hirsch', art: 'zeichen', gruppe: 'tiere', klasse: 5, name: 'Hirsch', preis: 220, rang: 2 },
  { id: 'baer', art: 'zeichen', gruppe: 'tiere', klasse: 5, name: 'Bär', preis: 240, rang: 2 },
  { id: 'adler', art: 'zeichen', gruppe: 'tiere', klasse: 5, name: 'Adler', preis: 300, rang: 3 },
  { id: 'loewe', art: 'zeichen', gruppe: 'tiere', klasse: 5, name: 'Löwe', preis: 350, rang: 3 },
  // Ehrenzeichen: nicht zu kaufen, nur zu verdienen (ADR 0014, 0018). Nichts davon belohnt tägliches Erscheinen.
  { id: 'fahne', art: 'zeichen', gruppe: 'ehre', klasse: 5, name: 'Expeditionsfahne', preis: null, rang: 0, ehre: 'Für eine geschaffte Expedition der Klasse' },
  { id: 'purpurrose', art: 'zeichen', gruppe: 'ehre', klasse: 5, name: 'Purpurrose', preis: null, rang: 0, ehre: 'Für deine erste Purpurkrone' },
  { id: 'kapitelband', art: 'zeichen', gruppe: 'ehre', klasse: 5, name: 'Kapitelband', preis: null, rang: 0, ehre: 'Für ein Kapitel, in dem du jedes Lernziel besiegelt hast' },
  { id: 'wegstern', art: 'zeichen', gruppe: 'ehre', klasse: 5, name: 'Wegstern', preis: null, rang: 0, ehre: 'Für 25 Wegstücke mit mindestens 4 von 5 richtig' },
];
export const WEGSTERN_WEGSTUECKE = 25;
export const klassenstufe = (stand) => Number.parseInt(stand?.klasse, 10) || 5;
export const teil = (id) => WAPPEN_TEILE.find((w) => w.id === id) ?? null;

export function kaufe(stand, id) {
  const t = teil(id);
  if (!t) return 'unbekannt';
  if (t.preis == null) return 'ehrenzeichen';
  if (stand.wappen.gekauft.includes(id)) return 'vorhanden';
  if (t.klasse > klassenstufe(stand)) return 'klasse';
  if (rang(siegel(stand)).stufe < t.rang) return 'rang';
  if (stand.muenzen < t.preis) return 'muenzen';
  stand.muenzen -= t.preis;
  stand.wappen.gekauft.push(id);
  return 'ok';
}
// Farbe wählen; ein Zeichen anbringen oder abnehmen. Ein neues Zeichen wird Hauptzeichen, wenn noch keines da ist,
// sonst Beizeichen; sind schon zwei Beizeichen da, ersetzt es das letzte.
export function legeAn(stand, id) {
  const t = teil(id);
  if (!t || !stand.wappen.gekauft.includes(id)) return;
  const w = stand.wappen;
  if (t.art === 'farbe') w.farbe = id;
  else if (w.zeichen.includes(id)) w.zeichen = w.zeichen.filter((x) => x !== id);
  else if (w.zeichen.length < MAX_ZEICHEN) w.zeichen.push(id);
  else w.zeichen[MAX_ZEICHEN - 1] = id;
}
// Ein angebrachtes Beizeichen wird Hauptzeichen; das bisherige Hauptzeichen wird Beizeichen.
export function macheHauptzeichen(stand, id) {
  const z = stand.wappen.zeichen;
  if (!z.includes(id)) return;
  stand.wappen.zeichen = [id, ...z.filter((x) => x !== id)];
}

// Ehrenzeichen vergeben, die der Schüler inzwischen verdient hat. Liefert die neuen Ids.
// Die Expeditionsfahne kommt über holeBelohnung.
export function vergebeEhrenzeichen(stand, pool, index) {
  const neu = [];
  const gib = (id) => { if (!stand.wappen.gekauft.includes(id)) { stand.wappen.gekauft.push(id); neu.push(id); } };
  if (Object.values(kronen(pool, index, stand)).includes('E')) gib('purpurrose');
  const ganz = pool.kapitel.some((k) => {
    const ziele = k.unterkapitel.flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id));
    return ziele.length > 0 && ziele.every((l) => stand.lernziele[l.id]);
  });
  if (ganz) gib('kapitelband');
  if ((stand.wegstuecke ?? []).filter((w) => w.gesamt >= WEGSTUECK_AUFGABEN && w.richtig >= 4).length >= WEGSTERN_WEGSTUECKE) gib('wegstern');
  if (neu.length) (stand.neueEhre ??= []).push(...neu);
  return neu;
}

// Version 1 hatte eine Lok: Jedes Lok-Teil wird das Wappen-Teil mit demselben Namen (ADR 0010).
const LOK_ZU_WAPPEN = { dampf: 'eichenlaub', streifen: 'balken', fahne: 'zirkel', laterne: 'winkel', krone: 'lilie' };
// Seit ADR 0018 trägt ein Wappen höchstens drei Zeichen. Bei mehr bleiben die teuersten, das teuerste wird Hauptzeichen.
function ordneZeichen(wappen) {
  if (wappen.zeichen.length <= MAX_ZEICHEN) return;
  const wert = (id) => teil(id)?.preis ?? 1000;
  wappen.zeichen = [...wappen.zeichen].sort((a, b) => wert(b) - wert(a)).slice(0, MAX_ZEICHEN);
}
export function migriere(stand) {
  if (!stand) return stand;
  // Das Wappen-Zeichen Krone heißt seit ADR 0012 Lilie, damit „Krone“ eindeutig der Lohn am Meilenstein ist.
  if (stand.wappen) {
    const neu = (id) => (id === 'krone' ? 'lilie' : id);
    stand.wappen.zeichen = stand.wappen.zeichen.map(neu);
    stand.wappen.gekauft = stand.wappen.gekauft.map(neu);
    ordneZeichen(stand.wappen);
    return stand;
  }
  const lok = stand.lok ?? { farbe: 'rot', extras: [], gekauft: ['rot'] };
  const neu = (id) => LOK_ZU_WAPPEN[id] ?? id;
  stand.wappen = { farbe: lok.farbe, zeichen: lok.extras.map(neu), gekauft: lok.gekauft.map(neu) };
  ordneZeichen(stand.wappen);
  delete stand.lok;
  stand.version = 2;
  return stand;
}

// ---------- Minispiele (ADR 0018) ----------
// Rechenpause: kurz, billig, mit Mathematik. Belohnungsspiel: reiner Spaß, eine Runde von höchstens drei Minuten, mit Bestenliste.
export const SPIELE = [
  { id: 'kopfrechnen', art: 'rechenpause', name: 'Kopfrechen-Sprint', preis: 20, sekunden: 90, einheit: 'richtige Aufgaben', text: 'Löse in 90 Sekunden so viele Aufgaben wie möglich.' },
  { id: 'botenritt', art: 'belohnung', name: 'Botenritt', preis: 100, sekunden: 180, einheit: 'Briefe', text: 'Reite mit den Pfeiltasten über die Karte und sammle Briefe. Mit jedem Brief wird dein Gefolge länger. Stoß nicht an den Rand und nicht an dein Gefolge.' },
  { id: 'burgmauer', art: 'belohnung', name: 'Burgmauer', preis: 100, sekunden: 180, einheit: 'Raben', text: 'Schieb die Armbrust mit ← und → über die Mauer und schieß mit ↑ die Raben ab, bevor sie die Mauer erreichen. Drei Banner hast du.' },
  // ADR 0019
  { id: 'steinmetz', art: 'belohnung', name: 'Steinmetz', preis: 100, sekunden: 180, einheit: 'Reihen', text: 'Bausteine der Burg fallen von oben. Schieb sie mit ← und →, dreh sie mit ↑ und lass sie mit ↓ schneller fallen. Eine volle Reihe wird zur fertigen Mauer und verschwindet.' },
  { id: 'grenzlauf', art: 'belohnung', name: 'Grenzlauf', preis: 100, sekunden: 180, einheit: 'Meilen', text: 'Lauf über die Landstraße. Spring mit ↑ über Steine, Zäune und Gräben und duck dich mit ↓ unter den Raben. Drei Banner hast du.' },
  { id: 'kellerjagd', art: 'belohnung', name: 'Kellerjagd', preis: 100, sekunden: 180, einheit: 'Rollen', text: 'Lauf mit den Pfeiltasten durch den Burgkeller und sammle alle Pergamentrollen. Dann geht es über die Treppe in den nächsten Keller. Weich den Ratten aus, drei Banner hast du.' },
];
export const spiel = (id) => SPIELE.find((x) => x.id === id) ?? null;
// Für alte Tests und Aufrufe: der Kopfrechen-Sprint.
export const MINISPIEL_PREIS = SPIELE[0].preis;
export const MINISPIEL_SEKUNDEN = SPIELE[0].sekunden;
export const SPIELFREIGABEN = { aus: 'Aus', spielpause: 'Nur in der Spielpause', verdient: 'Verdient' };

// Darf der Schüler dieses Spiel jetzt spielen? 'ok' | 'aus' | 'keine-spielpause' | 'nicht-verdient'
// In der Spielpause gehen alle Spiele. Bei „verdient“ geht die Rechenpause immer, ein Belohnungsspiel mit Gutschrift aus einem vierten Wegstück.
export function spielErlaubt(stand, einst, spielId) {
  const s = spiel(spielId);
  const freigabe = einst.spielfreigabe ?? 'spielpause';
  if (!s || freigabe === 'aus') return 'aus';
  if (einst.spielpause) return 'ok';
  if (freigabe === 'verdient') return s.art === 'rechenpause' || (stand.spielGutschrift ?? 0) > 0 ? 'ok' : 'nicht-verdient';
  return 'keine-spielpause';
}
export function starteMinispiel(stand, einst, spielId = 'kopfrechnen') {
  const s = spiel(spielId);
  const erlaubt = spielErlaubt(stand, einst, spielId);
  if (erlaubt !== 'ok') return erlaubt;
  if (stand.muenzen < s.preis) return 'muenzen';
  stand.muenzen -= s.preis;
  if (s.art === 'belohnung' && !einst.spielpause) stand.spielGutschrift = 0;
  return 'ok';
}
export function trageSpielEin(stand, spielId, punkte, jetzt) {
  (stand.spiele ??= []).push({ spiel: spielId, t: jetzt, punkte });
}
// Alte Einträge ohne Spiel-Id stammen aus dem Kopfrechen-Sprint.
const spielVon = (e) => e.spiel ?? 'kopfrechnen';
export const bestwert = (stand, spielId) => Math.max(0, ...(stand.spiele ?? []).filter((e) => spielVon(e) === spielId).map((e) => e.punkte));
export function kopfrechenAufgabe(zufall = Math.random) {
  const zz = (a, b) => a + Math.floor(zufall() * (b - a + 1));
  const art = zz(0, 3);
  if (art === 0) { const a = zz(11, 89), b = zz(11, 99 - a + 10); return { text: `${a} + ${b}`, loesung: a + b }; }
  if (art === 1) { const a = zz(30, 99), b = zz(11, a - 5); return { text: `${a} − ${b}`, loesung: a - b }; }
  if (art === 2) { const a = zz(2, 12), b = zz(2, 10); return { text: `${a} · ${b}`, loesung: a * b }; }
  const b = zz(2, 10), q = zz(2, 12); return { text: `${b * q} : ${b}`, loesung: q };
}

// ---------- Bestenliste (ADR 0018) ----------
// Nur für Belohnungsspiele. Die fünf Besten der Klasse in dieser Woche (ab Montag), dazu der eigene Platz.
// Schüler erscheinen mit Wappen und Beinamen, nie mit Namen oder Code.
export const BESTENLISTE_PLAETZE = 5;
export const BEINAME_VORNE = ['Seeblauer', 'Goldener', 'Stiller', 'Flinker', 'Kluger', 'Tapferer', 'Wachsamer', 'Fröhlicher', 'Silberner', 'Grüner', 'Roter', 'Weiser', 'Mutiger', 'Schneller'];
export const BEINAME_HINTEN = ['Falke', 'Fuchs', 'Bär', 'Hirsch', 'Luchs', 'Adler', 'Rabe', 'Wolf', 'Biber', 'Dachs', 'Igel', 'Otter', 'Kranich', 'Steinbock'];
// Ohne eigene Wahl bekommt jeder einen festen Beinamen aus seinem Code.
export function beiname(stand) {
  const b = stand.beiname;
  if (b && BEINAME_VORNE.includes(b.vorne) && BEINAME_HINTEN.includes(b.hinten)) return `${b.vorne} ${b.hinten}`;
  let h = 0;
  for (const c of String(stand.code ?? '')) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return `${BEINAME_VORNE[h % BEINAME_VORNE.length]} ${BEINAME_HINTEN[Math.floor(h / BEINAME_VORNE.length) % BEINAME_HINTEN.length]}`;
}
// Die erste eigene Wahl ist kostenlos, jede weitere kostet fest 50 Münzen (ADR 0020).
// Alte Stände ohne Merker haben die kostenlose Änderung noch, auch wenn sie schon gewählt haben.
export const BEINAME_PREIS = 50;
export const preisBeiname = (stand) => (stand.beinameFreiVerbraucht ? BEINAME_PREIS : 0);
// Ändert beide Bausteine auf einmal. Liefert 'ok', 'gleich', 'ungueltig' oder 'zu-wenig'.
export function aendereBeiname(stand, vorne, hinten) {
  if (!BEINAME_VORNE.includes(vorne) || !BEINAME_HINTEN.includes(hinten)) return 'ungueltig';
  if (beiname(stand) === `${vorne} ${hinten}`) return 'gleich';
  const preis = preisBeiname(stand);
  if ((stand.muenzen ?? 0) < preis) return 'zu-wenig';
  stand.muenzen -= preis;
  stand.beiname = { vorne, hinten };
  stand.beinameFreiVerbraucht = true;
  return 'ok';
}
// Montag der Woche von `iso`, als JJJJ-MM-TT in Ortszeit.
export function wocheVon(iso) {
  const d = new Date(iso);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toLocaleDateString('sv-SE');
}
// eigener: Speicherstand des Schülers; andere: die der Mitschüler.
// Liefert { plaetze: [{ platz, beiname, wappen, punkte, eigen }], eigenerPlatz, eigenerWert, ausgeblendet }.
export function bestenliste(eigener, andere, spielId, jetzt) {
  const woche = wocheVon(jetzt);
  const besterDerWoche = (st) => Math.max(0, ...(st.spiele ?? []).filter((e) => spielVon(e) === spielId && wocheVon(e.t) === woche).map((e) => e.punkte));
  const eintraege = [eigener, ...andere]
    .filter((st) => st === eigener || !st.bestenlisteAus)
    .map((st) => ({ beiname: beiname(st), wappen: st.wappen, punkte: besterDerWoche(st), eigen: st === eigener }))
    .filter((e) => e.punkte > 0)
    .sort((a, b) => b.punkte - a.punkte || Number(b.eigen) - Number(a.eigen));
  // Wer sich ausgeblendet hat, sieht seinen Platz, steht aber für die anderen nicht in der Liste.
  const sichtbar = eigener.bestenlisteAus ? eintraege.filter((e) => !e.eigen) : eintraege;
  const plaetze = sichtbar.slice(0, BESTENLISTE_PLAETZE).map((e, i) => ({ platz: i + 1, beiname: e.beiname, wappen: e.wappen, punkte: e.punkte, eigen: e.eigen }));
  const i = eintraege.findIndex((e) => e.eigen);
  return { plaetze, eigenerPlatz: i >= 0 ? i + 1 : null, eigenerWert: i >= 0 ? eintraege[i].punkte : 0, ausgeblendet: Boolean(eigener.bestenlisteAus) };
}

// ---------- Torfreigabe (ADR 0022) ----------
// Die Klasse hat eine Menge offener Tore (`tore`), einzelne Schüler zusätzliche (`toreEinzeln`).
// Alte Klassendateien ohne `tore`: offen sind alle Kapitel bis zum Aktuellen Kapitel, ohne Aktuelles Kapitel alle.
export function toreDerKlasse(k, pool) {
  const ids = pool.kapitel.map((x) => x.id);
  if (Array.isArray(k?.tore)) {
    const menge = new Set(k.tore.filter((id) => ids.includes(id)));
    if (k.aktuellesKapitel && ids.includes(k.aktuellesKapitel)) menge.add(k.aktuellesKapitel);
    return menge;
  }
  const bis = k?.aktuellesKapitel ? ids.indexOf(k.aktuellesKapitel) : ids.length - 1;
  return new Set(ids.slice(0, bis + 1));
}
export function offeneTore(k, code, pool) {
  const ids = pool.kapitel.map((x) => x.id);
  const klasse = toreDerKlasse(k, pool);
  const einzeln = new Set((k?.toreEinzeln?.[code] ?? []).filter((id) => ids.includes(id) && !klasse.has(id)));
  // In Buchreihenfolge, damit die Tore im Schlossgarten der Reihe nach stehen.
  return { klasse, einzeln, alle: new Set(ids.filter((id) => klasse.has(id) || einzeln.has(id))) };
}
// Neu geöffnete Tore, die der Schüler noch nicht gesehen hat. Beim allerersten Start gibt es keine Ankündigung.
export function neueTore(stand, offene) {
  if (!Array.isArray(stand.toreGesehen)) { stand.toreGesehen = [...offene]; return []; }
  return [...offene].filter((id) => !stand.toreGesehen.includes(id));
}
export function merkeToreGesehen(stand, ids) {
  stand.toreGesehen = [...new Set([...(stand.toreGesehen ?? []), ...ids])];
}

// ---------- Klassendatei ----------
// Ohne Klassendatei gelten Standardwerte: alle Kapitel offen, Zielniveau G, keine Spielpause.
export function einstellungen(klassendatei, code, pool) {
  const k = klassendatei ?? {};
  const tore = offeneTore(k, code, pool);
  return {
    zielniveau: k.zielniveaus?.[code] ?? STANDARD_ZIELNIVEAU,
    aktuellesKapitel: k.aktuellesKapitel ?? null,
    offeneKapitel: tore.alle,
    zusaetzlicheKapitel: tore.einzeln, // nur für diesen Schüler zusätzlich geöffnet (ADR 0022)
    spielpause: Boolean(k.spielpause),
    spielfreigabe: SPIELFREIGABEN[k.spielfreigabe] ? k.spielfreigabe : 'spielpause', // ADR 0018
    bestenliste: k.bestenliste !== false, // Bestenliste der Belohnungsspiele, standardmäßig an
    hoftitel: k.ehrentafel !== false,     // Hoftitel in der Kopfzeile, standardmäßig an (ADR 0023; Feld heißt in der Klassendatei noch ehrentafel)
    expedition: k.expedition ?? null,
    sicherheitsangabe: Boolean(k.sicherheitsangabe),
    ton: Boolean(k.ton),          // dezenter Ton bei richtigen Aufgaben, standardmäßig aus (ADR 0016)
    rast: k.rast !== false,       // Rast nach jedem vierten Wegstück, standardmäßig an (ADR 0016)
    einstiegPflicht: new Set(k.einstiegPflicht ?? []),
    hilfeAntwort: k.hilfe?.[code] ?? null,
    nachricht: k.nachrichten?.[code] ?? null,
    sonderauftrag: gueltigerAuftrag(k.sonderauftraege?.[code]), // ADR 0021
    pin: k.pins?.[code] ?? null, // { salz, wert }: Prüfwert der PIN, nicht die PIN selbst
    gesperrteMeilensteine: new Set(Object.entries(k.sperren ?? {}).filter(([, codes]) => codes.includes(code)).map(([meilenstein]) => meilenstein)),
    codeBekannt: k.codes ? k.codes.includes(code) : true,
  };
}

// ---------- Lernen sichtbar machen (ADR 0017) ----------
// Alles wird aus dem Versuchsprotokoll berechnet; der Speicherstand merkt sich nur, welcher Satz schon gezeigt wurde.
export const FESTIGUNG_TAGE = 7;     // so viele Tage nach dem Siegel festigt eine richtige Lösung im Rückblick oder Seitenblick
export const UEBERWUNDEN_NACH = 3;   // so viele richtige Aufgaben desselben Lernziels ohne die Fehlvorstellung
export const HILFE_FENSTER = 10;     // Hilfebedarf: die letzten 10 Aufgaben eines Lernziels
export const HILFE_MIN = 4;          // „braucht viel Hilfe“ erst ab 4 Aufgaben
export const HILFE_TREND_AB = 6;     // Trend erste gegen zweite Hälfte ab 6 Aufgaben
export const HILFE_TREND_SCHRITT = 0.2;
// Beispiel und Lösungsschritt zählen als Hilfe. Der Tipp nicht, weil er sich auf F, G und M von selbst öffnet.
export const brauchteHilfe = (v) => hatKarte(v, 'beispiel') || hatKarte(v, 'loesungsschritt');

// Gefestigt: Siegel vorhanden, nicht aufzufrischen, und mindestens 7 Tage nach dem Siegel im Rückblick oder Seitenblick richtig gelöst.
export function istGefestigt(stand, lernzielId) {
  const s = stand.lernziele?.[lernzielId];
  if (!s || stand.rueckblick?.[lernzielId]?.aufzufrischen) return false;
  const ab = new Date(s.erreichtAm).getTime() + FESTIGUNG_TAGE * TAG_MS;
  return stand.versuche.some((v) => v.lernziel === lernzielId && v.richtig && (v.rueckblick || v.seitenblick) && new Date(v.t).getTime() >= ab);
}

// Fehlvorstellungen eines Schülers mit ihrem Zustand, in der Reihenfolge des ersten Auftretens:
// [{ fehlvorstellung, anzahl, lernziel, zuletzt, status: 'aktiv' | 'ueberwunden', ueberwundenAm }]
// Überwunden nach drei richtigen Aufgaben desselben Lernziels ohne sie; taucht sie wieder auf, ist sie wieder aktiv.
// ueberwundenAm bleibt beim ersten Mal stehen: Daraus wird später der Aha-Moment des Schülers.
export function fehlvorstellungsStand(versuche) {
  const je = new Map();
  for (const v of [...versuche].sort((a, b) => String(a.t).localeCompare(String(b.t)))) {
    const eigene = v.fehlvorstellungen ?? [];
    for (const e of je.values()) {
      if (e.status !== 'aktiv' || e.lernziel !== v.lernziel || !v.richtig || eigene.includes(e.fehlvorstellung)) continue;
      if (++e.sauber >= UEBERWUNDEN_NACH) { e.status = 'ueberwunden'; e.ueberwundenAm ??= v.t; }
    }
    for (const f of eigene) {
      const e = je.get(f) ?? { fehlvorstellung: f, anzahl: 0, ueberwundenAm: null };
      Object.assign(e, { anzahl: e.anzahl + 1, lernziel: v.lernziel, zuletzt: v.t, status: 'aktiv', sauber: 0 });
      je.set(f, e);
    }
  }
  return [...je.values()].map(({ sauber, ...e }) => e);
}

// Hilfebedarf bei einem Lernziel: Wie oft Beispiel oder Lösungsschritt, und wird es mit der Zeit weniger?
// trend: 'weniger' | 'gleich' | 'mehr' | null (unter 6 Aufgaben)
export function hilfebedarf(stand, lernzielId) {
  const v = stand.versuche.filter((x) => x.lernziel === lernzielId && !x.einstieg);
  const anteilMit = (liste) => (liste.length ? liste.filter(brauchteHilfe).length / liste.length : 0);
  const letzte = v.slice(-HILFE_FENSTER);
  const mitHilfe = letzte.filter(brauchteHilfe).length;
  let vorher = null, nachher = null, trend = null;
  if (v.length >= HILFE_TREND_AB) {
    const mitte = Math.floor(v.length / 2);
    vorher = anteilMit(v.slice(0, mitte)); nachher = anteilMit(v.slice(mitte));
    trend = nachher <= vorher - HILFE_TREND_SCHRITT ? 'weniger' : nachher >= vorher + HILFE_TREND_SCHRITT ? 'mehr' : 'gleich';
  }
  return { bearbeitet: v.length, letzte: letzte.length, mitHilfe, viel: letzte.length >= HILFE_MIN && mitHilfe * 2 >= letzte.length, vorher, nachher, trend };
}

// Kommt der Schüler bei diesem Lernziel zum ersten Mal ohne Beispiel und Lösungsschritt aus, nachdem er sie gebraucht hat?
// Prüft den zuletzt verbuchten Versuch.
export function erstmalsOhneHilfe(stand) {
  const v = stand.versuche.at(-1);
  if (!v || !v.richtig || v.einstieg || brauchteHilfe(v)) return false;
  const vorher = stand.versuche.slice(0, -1).filter((x) => x.lernziel === v.lernziel && !x.einstieg);
  return vorher.some(brauchteHilfe) && !vorher.some((x) => x.richtig && !brauchteHilfe(x));
}

// „Du kannst mehr, als du denkst“: nach „unsicher“ und im ersten Versuch richtig, höchstens einmal je Wegstück.
// Merkt sich das Wegstück im Speicherstand. Aufruf nach trageWegstueckEin.
export function mutSatzFaellig(stand) {
  const v = stand.versuche.at(-1);
  if (!v || v.sicher !== false || !v.richtig || v.versuche !== 1) return false;
  const wegstueck = stand.wegstueck?.t ?? stand.wegstuecke?.at(-1)?.t ?? null;
  if (!wegstueck || stand.mutSatz === wegstueck) return false;
  stand.mutSatz = wegstueck;
  return true;
}

// Aha-Momente (ADR 0017): überwundene Fehlvorstellungen, neueste zuerst. Ein einmal erreichter Aha-Moment bleibt stehen,
// auch wenn der Fehler später wieder auftaucht. `neu`: noch nicht beim Wappen angesehen (stand.ahaGesehen).
export function ahaMomente(stand) {
  const gesehen = new Set(stand.ahaGesehen ?? []);
  return fehlvorstellungsStand(stand.versuche).filter((e) => e.ueberwundenAm)
    .sort((a, b) => String(b.ueberwundenAm).localeCompare(String(a.ueberwundenAm)))
    .map((e) => ({ fehlvorstellung: e.fehlvorstellung, lernziel: e.lernziel, am: e.ueberwundenAm, neu: !gesehen.has(e.fehlvorstellung) }));
}
export function merkeAhaGesehen(stand) {
  const alle = ahaMomente(stand).map((a) => a.fehlvorstellung);
  if (alle.every((f) => (stand.ahaGesehen ?? []).includes(f))) return false;
  stand.ahaGesehen = [...new Set([...(stand.ahaGesehen ?? []), ...alle])];
  return true;
}

// ---------- Hoftitel (ADR 0023) ----------
// Die fünf Besten des Schuljahrs nach Kronen und Siegeln der aktuellen Klassenstufe, für alle gleich gewertet.
// Seit Version 0.20 sieht jeder Schüler nur seinen eigenen Titel in der Kopfzeile, immer in der männlichen Form.
export const KRONEN_PUNKTE = { F: 1, G: 2, M: 4, E: 6 };
export const HOFTITEL_PLAETZE = 5;
export const HOFTITEL = [
  { platz: 1, id: 'koenig', name: 'Klassenkönig' },
  { platz: 2, id: 'herzog', name: 'Herzog' },
  { platz: 3, id: 'graf', name: 'Graf' },
  { platz: 4, id: 'ritter', name: 'Ritter' },
  { platz: 5, id: 'knappe', name: 'Knappe' },
];
export const hoftitelVon = (platz) => HOFTITEL[platz - 1] ?? null;
// Kronen je Niveau, Siegel und Punkte eines Speicherstands. Nur der Pool der Klassenstufe zählt.
export function ehrenwert(pool, index, stand) {
  const kr = Object.values(kronen(pool, index, stand));
  const je = Object.fromEntries(NIVEAUS.map((n) => [n, kr.filter((k) => k === n).length]));
  const ziele = new Set(pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele.map((l) => l.id)));
  const anzahlSiegel = Object.keys(stand.lernziele ?? {}).filter((id) => ziele.has(id)).length;
  const punkte = NIVEAUS.reduce((p, n) => p + je[n] * KRONEN_PUNKTE[n], 0) + anzahlSiegel;
  return { kronen: je, siegel: anzahlSiegel, punkte };
}
// Einen Titel bekommt nur, wer mindestens eine Krone auf Silber oder besser hat.
export const titelfaehig = (w) => w.kronen.G + w.kronen.M + w.kronen.E > 0;
// Gleichstand: zuerst Punkte, dann mehr Purpur, Gold, Silber, Bronze. Danach teilen sich beide den Platz.
function vergleicheEhre(a, b) {
  if (b.punkte !== a.punkte) return b.punkte - a.punkte;
  for (const n of [...NIVEAUS].reverse()) if (b.kronen[n] !== a.kronen[n]) return b.kronen[n] - a.kronen[n];
  return 0;
}
// eintraege: [{ id, stand, wert? }]. Liefert die Titelträger (bei geteiltem Platz auch mehr als fünf)
// als [{ id, stand, wert, platz, titel }], gezählt wie im Sport (1, 1, 3).
export function hoftitelVergabe(pool, index, eintraege) {
  const liste = eintraege
    .map((e) => ({ ...e, wert: e.wert ?? ehrenwert(pool, index, e.stand) }))
    .filter((e) => titelfaehig(e.wert))
    .sort((a, b) => vergleicheEhre(a.wert, b.wert));
  return liste
    .map((e) => ({ ...e, platz: 1 + liste.filter((x) => vergleicheEhre(x.wert, e.wert) < 0).length }))
    .filter((e) => e.platz <= HOFTITEL_PLAETZE)
    .map((e) => ({ ...e, titel: hoftitelVon(e.platz) }));
}
