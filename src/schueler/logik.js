// Reine Auswertungslogik des Schüler-Dashboards: keine Oberfläche, kein Dateizugriff.
// Begriffe wie in CONTEXT.md.

export const NIVEAUS = ['F', 'G', 'M', 'E'];
export const NIVEAU_NAMEN = { F: 'Förderniveau', G: 'Grundlegendes Niveau', M: 'Mittleres Niveau', E: 'Erweitertes Niveau' };
export const MUENZEN_BASIS = { F: 10, G: 15, M: 20, E: 25 };
export const RAENGE = [
  { ab: 0, name: 'Rangierlok' },
  { ab: 5, name: 'Regionalzug' },
  { ab: 15, name: 'Express' },
  { ab: 30, name: 'Königszug' },
];
export const MINISPIEL_PREIS = 20;
export const MINISPIEL_SEKUNDEN = 90;

// Lernziel-Regel (Startwerte, später pro Klasse einstellbar).
export const LERNZIEL_RICHTIGE = 3;
export const LERNZIEL_AUF_ZIELNIVEAU = 2;

// ---------- Schülercode ----------
export function leseCode(eingabe) {
  const code = String(eingabe ?? '').trim().toUpperCase().replace(/\s+/g, '');
  const m = code.match(/^(\d{1,2}[A-Z])-([A-Z0-9]{4})$/);
  return m ? { code, klasse: m[1].toLowerCase() } : null;
}

// ---------- Speicherstand ----------
export function neuerSpeicherstand(code, klasse, jetzt) {
  return {
    version: 1, code, klasse, erstellt: jetzt, geaendert: jetzt,
    muenzen: 0,
    niveau: {},        // Kapitel → Niveaustufe, auf der gerade gearbeitet wird
    niveauMarke: {},   // Kapitel → Länge des Versuchsprotokolls beim letzten Wechsel oder abgelehnten Vorschlag
    lernziele: {},     // Lernziel → { erreichtAm }
    versuche: [],      // Versuchsprotokoll: ein Eintrag je bearbeiteter Aufgabe
    hilferuf: null,    // offener Hilferuf: { seit, aufgabe }
    hilferufe: [],     // abgeschlossene Hilferufe
    lok: { farbe: 'rot', extras: [], gekauft: ['rot'] },
    spiele: [],
    aktiv: null,       // { aufgabe, seit, fehlversuche, hilfen } für die Live-Ansicht der Lehrkraft
    abbrueche: [],     // verlassene Aufgaben ohne Ergebnis: { t, aufgabe, fehlversuche, hilfen }
    gelesen: null,     // Zeitpunkt der letzten Nachricht der Lehrkraft, die der Schüler bestätigt hat
  };
}
export const sterne = (stand) => Object.keys(stand.lernziele).length;
export function rang(anzahlSterne) {
  let stufe = 0;
  RAENGE.forEach((r, i) => { if (anzahlSterne >= r.ab) stufe = i; });
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
  const aufgabe = new Map(pool.aufgaben.map((a) => [a.id, a]));
  return { nach, lernzielMitAufgaben, aufgabe };
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
const zaehlt = (v) => v.richtig && v.hilfen < 3; // mit Lösungsschritt-Kärtchen gelöst zählt nicht
export function lernzielStand(stand, lernzielId, zielniveau) {
  const ziel = NIVEAUS.indexOf(zielniveau);
  const alle = new Set(), aufZiel = new Set();
  for (const v of stand.versuche) {
    if (v.lernziel !== lernzielId || !zaehlt(v)) continue;
    alle.add(v.aufgabe);
    if (NIVEAUS.indexOf(v.niveau) >= ziel) aufZiel.add(v.aufgabe);
  }
  // Fortschritt für die Anzeige: höchstens eine Trainingsaufgabe zählt mit.
  const fortschritt = Math.min(LERNZIEL_RICHTIGE, aufZiel.size + Math.min(alle.size - aufZiel.size, LERNZIEL_RICHTIGE - LERNZIEL_AUF_ZIELNIVEAU));
  return {
    richtige: alle.size, aufZiel: aufZiel.size, fortschritt,
    erreicht: alle.size >= LERNZIEL_RICHTIGE && aufZiel.size >= LERNZIEL_AUF_ZIELNIVEAU,
  };
}
export function stationStatus(index, stand, unterkapitel) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  if (mit.length === 0) return 'leer';
  const erreicht = mit.filter((l) => stand.lernziele[l.id]).length;
  if (erreicht === mit.length) return 'erreicht';
  return stand.versuche.some((v) => mit.some((l) => l.id === v.lernziel)) ? 'begonnen' : 'offen';
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
  for (const stufe of stufen) {
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
  if (bearbeitung.hilfen >= 3) return 1;
  let m = MUENZEN_BASIS[aufgabe.niveau];
  if (NIVEAUS.indexOf(aufgabe.niveau) < NIVEAUS.indexOf(zielniveau)) m /= 2; // Training
  if (bearbeitung.versuche > 1) m *= 0.6;
  m *= 1 - 0.2 * bearbeitung.hilfen;
  return Math.max(1, Math.round(m));
}

// ---------- Bearbeitung verbuchen ----------
// bearbeitung: { geloest, versuche, eingaben, fehlvorstellungen, hilfen, dauer }
export function verbuche(stand, aufgabe, bearbeitung, zielniveau, jetzt) {
  const muenzen = muenzenFuer(stand, aufgabe, bearbeitung, zielniveau);
  stand.versuche.push({
    t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau,
    richtig: bearbeitung.geloest, versuche: bearbeitung.versuche, eingaben: bearbeitung.eingaben,
    fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: bearbeitung.hilfen, dauer: bearbeitung.dauer, muenzen,
  });
  stand.muenzen += muenzen;
  let neuesLernziel = false;
  if (!stand.lernziele[aufgabe.lernziel] && lernzielStand(stand, aufgabe.lernziel, zielniveau).erreicht) {
    stand.lernziele[aufgabe.lernziel] = { erreichtAm: jetzt };
    neuesLernziel = true;
  }
  return { muenzen, neuesLernziel, training: NIVEAUS.indexOf(aufgabe.niveau) < NIVEAUS.indexOf(zielniveau) };
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

// ---------- Lok-Werkstatt ----------
export const WERKSTATT = [
  { id: 'rot', art: 'farbe', name: 'Signalrot', wert: '#d9413a', preis: 0, rang: 0 },
  { id: 'blau', art: 'farbe', name: 'Seeblau', wert: '#2f6fb5', preis: 30, rang: 0 },
  { id: 'gruen', art: 'farbe', name: 'Waldgrün', wert: '#2e8b57', preis: 30, rang: 0 },
  { id: 'violett', art: 'farbe', name: 'Königsviolett', wert: '#7a4fb3', preis: 60, rang: 1 },
  { id: 'schwarz', art: 'farbe', name: 'Nachtschwarz', wert: '#2b2f3a', preis: 90, rang: 2 },
  { id: 'gold', art: 'farbe', name: 'Königsgold', wert: '#d4a419', preis: 200, rang: 3 },
  { id: 'dampf', art: 'extra', name: 'Dampfwolke', preis: 20, rang: 0 },
  { id: 'streifen', art: 'extra', name: 'Rennstreifen', preis: 40, rang: 0 },
  { id: 'fahne', art: 'extra', name: 'Fahne', preis: 50, rang: 1 },
  { id: 'laterne', art: 'extra', name: 'Laterne', preis: 70, rang: 2 },
  { id: 'krone', art: 'extra', name: 'Krone', preis: 250, rang: 3 },
];
export function kaufe(stand, id) {
  const teil = WERKSTATT.find((w) => w.id === id);
  if (!teil) return 'unbekannt';
  if (stand.lok.gekauft.includes(id)) return 'vorhanden';
  if (rang(sterne(stand)).stufe < teil.rang) return 'rang';
  if (stand.muenzen < teil.preis) return 'muenzen';
  stand.muenzen -= teil.preis;
  stand.lok.gekauft.push(id);
  return 'ok';
}
export function ruesteAus(stand, id) {
  const teil = WERKSTATT.find((w) => w.id === id);
  if (!teil || !stand.lok.gekauft.includes(id)) return;
  if (teil.art === 'farbe') stand.lok.farbe = id;
  else if (stand.lok.extras.includes(id)) stand.lok.extras = stand.lok.extras.filter((x) => x !== id);
  else stand.lok.extras.push(id);
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
    zielniveau: k.zielniveaus?.[code] ?? 'G',
    aktuellesKapitel: k.aktuellesKapitel ?? null,
    offeneKapitel: new Set(kapitelIds.slice(0, bis + 1)),
    spielpause: Boolean(k.spielpause),
    hilfeAntwort: k.hilfe?.[code] ?? null,
    nachricht: k.nachrichten?.[code] ?? null,
    pin: k.pins?.[code] ?? null, // { salz, wert }: Prüfwert der PIN, nicht die PIN selbst
    gesperrteStationen: new Set(Object.entries(k.sperren ?? {}).filter(([, codes]) => codes.includes(code)).map(([station]) => station)),
    codeBekannt: k.codes ? k.codes.includes(code) : true,
  };
}
