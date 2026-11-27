// Reine Auswertungslogik des Schüler-Dashboards: keine Oberfläche, kein Dateizugriff.
// Begriffe wie in CONTEXT.md.

import { pruefeGitter } from './geo.js';
import { pruefeWinkel } from './winkel.js';
import { pruefeGroesse } from './groessen.js';
import { pruefeDezimal, pruefeBruch, pruefeFaerben, leseDezimal, pruefePeriode } from './bruch.js';

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
  // An einem Niveau-Meilenstein (ADR 0038) zählen nur die Niveaustufen, auf denen es Aufgaben gibt.
  const mitAnspruch = new Set([...lernzielMitAufgaben].filter((l) => NIVEAUS.filter((n) => nach.has(`${l}|${n}`)).every((n) => nach.get(`${l}|${n}`).some((a) => a.afb >= AFB_FUER_STERN))));
  // Klasse 6 (ADR 0037): Aufgaben der vorigen Klassenstufe, nur für Brücken. Sie zählen nicht als Lernziele dieser Klassenstufe.
  const vorstufe = new Set();
  for (const a of pool.vorstufe?.aufgaben ?? []) {
    const k = `${a.lernziel}|${a.niveau}`;
    if (!nach.has(k)) nach.set(k, []);
    nach.get(k).push(a); aufgabe.set(a.id, a); vorstufe.add(a.lernziel);
  }
  for (const l of pool.vorstufe?.lernziele ?? []) if (!lernziel.has(l.id)) lernziel.set(l.id, l);
  return { nach, lernzielMitAufgaben, aufgabe, mitAnspruch, meilensteinVon, lernziel, vorstufe };
}

// ---------- Antworten prüfen ----------
// Klasse 7 (ADR 0043): Ein Vorzeichen vor der Zahl zählt mit. „-5“, „−5“ und „– 5“ sind minus fünf, „+7“ ist 7.
export function leseZahl(text) {
  const m = String(text ?? '').replace(/[\s\u00a0\u202f.']/g, '').match(/^([+\-−–]?)(\d+)$/);
  if (!m) return NaN;
  return m[1] && m[1] !== '+' ? -Number(m[2]) || 0 : Number(m[2]);
}
function pruefeZahl(teil, eingabe) {
  // Klasse 6, Kapitel 5 (ADR 0048): Ein Überschlag darf mehrere richtige Werte haben (je nachdem, wie gerundet wurde).
  if (teil.auch?.length) { const e = pruefeZahl({ ...teil, auch: undefined }, eingabe); return e.richtig || teil.auch.some((w) => pruefeZahl({ loesung: w }, eingabe).richtig) ? { richtig: true, fehlvorstellung: null } : e; }
  // Kapitel 9: Eine Lösung als Text („0,25“) ist eine Dezimalzahl.
  if (typeof teil.loesung === 'string') return pruefeDezimal(teil, eingabe);
  let wert = leseZahl(eingabe);
  // Eine ganze Zahl mit Komma geschrieben („−4,0“) hat denselben Wert.
  if (Number.isNaN(wert)) { const d = leseDezimal(eingabe); if (d && d.z % d.n === 0) wert = d.z / d.n; }
  // Heftaufgaben mit Geodreieck (Kapitel 5): Ein gemessener Kontrollwert darf um die Toleranz abweichen.
  if (wert === teil.loesung || (teil.toleranz && Math.abs(wert - teil.loesung) <= teil.toleranz)) return { richtig: true, fehlvorstellung: null };
  // Ein typischer Fehler kann eine Dezimalzahl sein, auch wenn die Lösung eine natürliche Zahl ist (Überschlag statt genau gerechnet).
  const alsWert = (x) => { if (typeof x === 'number') return x; const d = leseDezimal(String(x ?? '')); return d ? d.z / d.n : NaN; };
  const ein = Number.isNaN(wert) ? alsWert(eingabe) : wert;
  const treffer = (teil.typischeFehler ?? []).find((f) => f.wert === wert || alsWert(f.wert) === ein);
  return { richtig: false, fehlvorstellung: treffer?.fehlvorstellung ?? null };
}
// Kapitel 6: Ein Teil einer Sachaufgabe kann eine Auswahl sein. Richtig ist sie, wenn genau die richtigen Antworten angekreuzt sind.
function pruefeTeil(teil, eingabe) {
  if (!teil.optionen) return pruefeZahl(teil, eingabe);
  const gewaehlt = new Set(Array.isArray(eingabe) ? eingabe : []);
  const richtig = teil.optionen.every((o) => gewaehlt.has(o.text) === o.richtig);
  const falsche = teil.optionen.find((o) => gewaehlt.has(o.text) && !o.richtig && o.fehlvorstellung);
  return { richtig, fehlvorstellung: richtig ? null : falsche?.fehlvorstellung ?? null };
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
    case 'luecken': case 'tabelle': {
      // Klasse 6, Kapitel 6 (ADR 0049): Bei `reihenfolgeEgal` dürfen die Zahlen dieser Lücken in beliebiger Reihenfolge stehen (die drei Kanten eines Quaders).
      const frei = aufgabe.reihenfolgeEgal ?? [];
      const ist = frei.map((n) => leseZahl(eingabe?.[n])).sort((x, y) => x - y), soll = frei.map((n) => aufgabe.luecken[n].loesung).sort((x, y) => x - y);
      const ein = frei.length && ist.every((w, i) => w === soll[i]) ? { ...eingabe, ...Object.fromEntries(frei.map((n) => [n, String(aufgabe.luecken[n].loesung)])) } : eingabe;
      return zusammen(Object.entries(aufgabe.luecken).map(([name, l]) => pruefeZahl(l, ein?.[name])));
    }
    case 'zuordnen': return { richtig: aufgabe.paare.every((p) => eingabe?.[p.links] === p.rechts), fehlvorstellung: null };
    case 'sachaufgabe': case 'diagramm': return zusammen(aufgabe.teile.map((t, i) => pruefeTeil(t, eingabe?.[i])));
    case 'groesse': return pruefeGroesse(aufgabe, eingabe);
    case 'strichliste': return pruefeStrichliste(aufgabe, eingabe);
    case 'zeichnen': return pruefeZeichnung(aufgabe, eingabe);
    case 'ordnen': return pruefeOrdnung(aufgabe, eingabe);
    case 'zeichen': return pruefeZeichen(aufgabe, eingabe);
    case 'schaetzen': return pruefeSchaetzung(aufgabe, eingabe);
    case 'gitter': {
      // Klasse 6, Kapitel 7 (ADR 0050): Punkte im Schaubild mit Nachfrage. Die Antwort steht in eckigen Klammern hinter den Punkten.
      if (!aufgabe.nachfrage) return pruefeGitter(aufgabe, eingabe);
      const [, punkte, antwort] = String(eingabe ?? '').match(/^(.*?)(?: \[(.*)\])?$/s);
      const p = pruefeGitter(aufgabe, punkte), o = aufgabe.nachfrage.optionen.find((x) => x.text === antwort);
      return zusammen([p, { richtig: Boolean(o?.richtig), fehlvorstellung: o && !o.richtig ? o.fehlvorstellung ?? null : null }]);
    }
    case 'winkel': return pruefeWinkel(aufgabe, eingabe);
    case 'bruch': return pruefeBruch(aufgabe, eingabe);
    case 'faerben': return pruefeFaerben(aufgabe, eingabe);
    case 'periode': return pruefePeriode(aufgabe, eingabe);
    default: throw new Error(`Unbekanntes Aufgabenformat: ${aufgabe.format}`);
  }
}
// Ordnen (Kapitel 2): Die Karten müssen genau in der verlangten Reihenfolge liegen.
// Liegen sie genau andersherum, hat das Kind die Richtung verwechselt.
function pruefeOrdnung(aufgabe, eingabe) {
  const ist = (eingabe ?? []).map(String), soll = aufgabe.loesung;
  if (ist.length === soll.length && soll.every((x, i) => x === ist[i])) return { richtig: true, fehlvorstellung: null };
  const umgekehrt = ist.length === soll.length && soll.every((x, i) => x === ist[soll.length - 1 - i]);
  return { richtig: false, fehlvorstellung: umgekehrt ? aufgabe.umgekehrt ?? null : aufgabe.sonst ?? null };
}
// Zeichenfolge (Kapitel 2): römische Zahlzeichen und Zahlen im Zweiersystem. Leerzeichen und Kleinschreibung stören nicht.
export const leseZeichen = (text) => String(text ?? '').replace(/\s/g, '').toUpperCase();
function pruefeZeichen(aufgabe, eingabe) {
  const wert = leseZeichen(eingabe);
  if (wert === aufgabe.loesung) return { richtig: true, fehlvorstellung: null };
  return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => f.wert === wert)?.fehlvorstellung ?? null };
}
// Schätzen (Kapitel 2, ab M): Richtig ist jede Zahl im Schätzbereich. Typische Fehler sind ebenfalls Bereiche.
function pruefeSchaetzung(aufgabe, eingabe) {
  const wert = leseZahl(eingabe), [von, bis] = aufgabe.bereich;
  if (wert >= von && wert <= bis) return { richtig: true, fehlvorstellung: null };
  return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => wert >= f.von && wert <= f.bis)?.fehlvorstellung ?? null };
}
// Strichliste (Kapitel 1): je Zeile ein Strichmuster aus „I“ und „/“. „IIII/“ ist ein richtiges Bündel.
// Ab M bündelt das Kind selbst: Ein falsch gesetzter Querstrich ist ein Fehler, auch wenn die Zahl stimmt.
export const strichAnzahl = (muster) => [...String(muster ?? '')].filter((c) => c === 'I' || c === '/').length;
export const richtigGebuendelt = (muster) => /^(IIII\/)*I{0,4}$/.test(String(muster ?? ''));
function pruefeStrichliste(aufgabe, eingabe) {
  const zeilen = aufgabe.zeilen.map((z, i) => ({ z, m: String(eingabe?.[i] ?? '') }));
  const zahlStimmt = zeilen.every(({ z, m }) => strichAnzahl(m) === z.loesung);
  const buendelStimmt = aufgabe.buendeln !== 'selbst' || zeilen.every(({ m }) => richtigGebuendelt(m));
  if (zahlStimmt && buendelStimmt) return { richtig: true, fehlvorstellung: null };
  const fehlvorstellung = !buendelStimmt ? 'strich-buendel-falsch'
    : zeilen.some(({ z, m }) => Math.abs(strichAnzahl(m) - z.loesung) === 1) ? 'liste-verzaehlt' : null;
  return { richtig: false, fehlvorstellung };
}
// Säulen zeichnen (Kapitel 1): je offene Säule die gezogene Höhe.
function pruefeZeichnung(aufgabe, eingabe) {
  const d = aufgabe.diagramm, offen = d.saeulen.map((sa, i) => ({ sa, w: Number(eingabe?.[i]) })).filter((x) => x.sa.offen);
  if (offen.every(({ sa, w }) => w === sa.wert)) return { richtig: true, fehlvorstellung: null };
  // Linien als Einerschritte gezählt: Die Säule steht bei wert : fein.
  const einer = d.fein > 1 && offen.some(({ sa, w }) => w !== sa.wert && w === sa.wert / d.fein);
  // Alle Höhen richtig, aber an den falschen Säulen.
  const soll = offen.map(({ sa }) => sa.wert).sort((a, b) => a - b), ist = offen.map(({ w }) => w).sort((a, b) => a - b);
  const vertauscht = offen.length > 1 && soll.every((x, i) => x === ist[i]);
  return { richtig: false, fehlvorstellung: einer ? 'skala-einerschritte' : vertauscht ? 'diagramm-vertauscht' : null };
}

// ---------- Lernziele ----------
// Mit Lösungsschritt-Kärtchen gelöst zählt nicht, Aufgaben aus dem Einstiegscheck (ADR 0014) und Seitenblicke (ADR 0016) zählen nie.
// Seit 0.37 zählt auch eine Aufgabe nicht, deren Lösung der Schüler am selben Tag schon gesehen hatte (ADR 0031).
const zaehlt = (v) => v.richtig && !v.einstieg && !v.seitenblick && !v.bekannt && !hatKarte(v, 'loesungsschritt');
// Wackelig: mindestens 4 Aufgaben zum Lernziel, davon weniger als die Hälfte gelöst, oder zwei Mal das Lösungsschritt-Kärtchen.
export const WACKELIG_AB = 4;
export function istWackelig(stand, lernzielId) {
  const v = stand.versuche.filter((x) => x.lernziel === lernzielId && !x.einstieg && !x.seitenblick && !x.gesperrt); // gesperrte Aufgaben zählen nicht (ADR 0025)
  const geloest = v.filter((x) => x.richtig).length;
  const schritte = v.filter((x) => hatKarte(x, 'loesungsschritt')).length;
  return (v.length >= WACKELIG_AB && geloest / v.length < 0.5) || schritte >= 2;
}
// ---------- Niveau-Meilenstein (ADR 0038) ----------
// Ein Niveau-Meilenstein trägt eine Marke (`ab`: M oder E) und hat nur ab dieser Niveaustufe Aufgaben.
// Wer ein Zielniveau darunter hat, erlebt ihn als Abstecher: Er zählt nicht für das Kapitel, und gearbeitet wird auf der Marke.
export const stufeAb = (niveau, ab) => (ab && NIVEAUS.indexOf(niveau) < NIVEAUS.indexOf(ab) ? ab : niveau);
export const stufeFuer = (index, lernzielId, niveau) => stufeAb(niveau, index?.meilensteinVon.get(lernzielId)?.ab);
// Pflicht-ab-Marke (ADR 0044): `pflicht` (M oder E) macht eine Einheit erst ab dieser Stufe verbindlich. Sie hat aber Aufgaben auf allen Stufen:
// Wer ein Zielniveau darunter hat, erlebt sie als freiwilligen Abstecher auf seiner eigenen Stufe (stufeAb hebt nicht an).
export const pflichtAb = (u) => u?.ab ?? u?.pflicht ?? null;
export const istNiveauAbstecher = (u, zielniveau) => Boolean(pflichtAb(u) && zielniveau && NIVEAUS.indexOf(zielniveau) < NIVEAUS.indexOf(pflichtAb(u)));
export const istAbstecher = (u, zielniveau) => Boolean(u.extra) || istNiveauAbstecher(u, zielniveau);

// Mit `index` gilt zusätzlich: Mindestens eine der richtigen Aufgaben stammt aus AFB II oder III,
// sofern das Lernziel solche Aufgaben hat. Ohne `index` (reine Anzeige) wird das nicht geprüft.
// Auf F gilt diese Bedingung nicht: Bronze gibt es für drei richtige Aufgaben (ADR 0015).
// An einem Niveau-Meilenstein gilt mindestens seine Marke: Siegel und Krone gibt es dort erst ab dieser Niveaustufe.
// Mit `ab` zählen nur Versuche ab dieser Stelle im Versuchsprotokoll (Version 0.60: „unter dem Ziel geschafft“ je Runde).
export function lernzielStand(stand, lernzielId, zielniveau, index = null, ab = 0) {
  zielniveau = stufeFuer(index, lernzielId, zielniveau);
  const ziel = NIVEAUS.indexOf(zielniveau);
  const alle = new Set(), aufZiel = new Set();
  let anspruch = zielniveau === 'F' || !index?.mitAnspruch.has(lernzielId);
  for (let i = ab; i < stand.versuche.length; i++) {
    const v = stand.versuche[i];
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

// ---------- Meilensteinfreigabe und Aufgabenführung (ADR 0026) ----------
const hatAufgabenIn = (index, u) => u.lernziele.some((l) => index.lernzielMitAufgaben.has(l.id));
// Eigene Arbeit an einem Meilenstein zählt nach eigenerVersuch (weiter unten): ohne Einstiegscheck, Sonderauftrag, Rückblick, Seitenblick, Brücke.
// Der Meilenstein auf dem Weg, an dem ein Abstecher hängt: der letzte davor, der kein Abstecher ist.
export function wirtVon(kapitel, abstecher, zielniveau = null) {
  const i = kapitel.unterkapitel.findIndex((u) => u.id === abstecher.id);
  for (let j = i - 1; j >= 0; j--) if (!istAbstecher(kapitel.unterkapitel[j], zielniveau)) return kapitel.unterkapitel[j];
  return null;
}
// Meilensteine eines Kapitels, die für diesen Schüler noch im Nebel liegen. Ohne Meilensteinfreigabe: keine.
// Mit Freigabe gehen die übrigen alle auf einmal auf, sobald alle freigegebenen gemeistert sind (gesperrte zählen nicht).
// Ein Abstecher geht auf, wenn sein Meilenstein gemeistert ist. Wo der Schüler schon selbst gearbeitet hat, bleibt es offen.
export function imNebel(index, stand, kapitel, einst) {
  const frei = einst.meilensteinFreigabe?.[kapitel.id];
  if (!Array.isArray(frei)) return new Set();
  const offen = new Set(frei), zu = einst.gesperrteMeilensteine ?? new Set();
  const gemeistert = (u) => milestoneStatus(index, stand, u) === 'gemeistert';
  const ziel = einst.zielniveau;
  const erledigt = kapitel.unterkapitel.filter((u) => !istAbstecher(u, ziel) && offen.has(u.id) && !zu.has(u.id) && hatAufgabenIn(index, u)).every(gemeistert);
  const angefangen = new Set(stand.versuche.filter(eigenerVersuch).map((v) => index.meilensteinVon.get(v.lernziel)?.id).filter(Boolean));
  const nebel = new Set();
  for (const u of kapitel.unterkapitel) {
    if (offen.has(u.id) || angefangen.has(u.id)) continue;
    if (istAbstecher(u, ziel)) { const w = wirtVon(kapitel, u, ziel); if (w && gemeistert(w)) continue; } else if (erledigt) continue;
    nebel.add(u.id);
  }
  return nebel;
}
// ---------- Aufgabenführung in Runden (Version 0.60, ADR 0052) ----------
// Lieber den ganzen Lernpfad auf Silber als lange in einem Lernziel: Ein Lernziel ist für die Führung in dieser Runde erledigt,
// wenn es ein Siegel hat (wer über seinem Ziel spielt: die Krone in der gewählten Farbe) oder in dieser Runde unter dem Ziel
// geschafft ist. Ist der Lernpfad einmal durch, beginnt die nächste Runde bei den Lernzielen ohne Siegel wieder auf dem Zielniveau.
// Ein Lernziel, das zweimal nur unter dem Ziel geschafft ist, schlägt die Führung nicht mehr vor.
export const UNTER_ZIEL_HOECHSTENS = 2;
export const runde = (stand, kapitelId) => stand.runde?.[kapitelId]?.nr ?? 1;
export const rundeAb = (stand, kapitelId) => stand.runde?.[kapitelId]?.ab ?? 0;
export const unterZielGeschafft = (stand, lernzielId) => stand.unterZiel?.[lernzielId] ?? null; // { mal, niveau, t }
export const unterZielAufgegeben = (stand, lernzielId) => (unterZielGeschafft(stand, lernzielId)?.mal ?? 0) >= UNTER_ZIEL_HOECHSTENS;
export function lernzielErledigt(index, stand, lernzielId, niveau, zielniveau) {
  const mal = unterZielGeschafft(stand, lernzielId)?.mal ?? 0;
  if (!stand.lernziele[lernzielId] && (mal >= UNTER_ZIEL_HOECHSTENS || mal >= runde(stand, kapitelVon(lernzielId)))) return true;
  if (NIVEAUS.indexOf(niveau) > NIVEAUS.indexOf(zielniveau)) return lernzielStand(stand, lernzielId, niveau, index).erreicht || mal >= runde(stand, kapitelVon(lernzielId));
  return Boolean(stand.lernziele[lernzielId]);
}
// Fertig für die Aufgabenführung: alle Lernziele mit Aufgaben erledigt (siehe lernzielErledigt).
export function fuehrungFertig(index, stand, unterkapitel, niveau, zielniveau) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  return mit.length > 0 && mit.every((l) => lernzielErledigt(index, stand, l.id, niveau, zielniveau));
}
// Ist der Lernpfad in dieser Runde durch, aber fehlen noch Siegel, beginnt die nächste Runde (gibt true zurück).
// Wer sich selbst unter seinem Ziel eingeordnet hat, spielt in der neuen Runde wieder um sein Ziel.
export function naechsteRunde(index, stand, kapitel, weg, zielniveau) {
  const offen = weg.flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id) && !stand.lernziele[l.id] && !unterZielAufgegeben(stand, l.id));
  if (!offen.length) return false;
  (stand.runde ??= {})[kapitel.id] = { nr: runde(stand, kapitel.id) + 1, ab: stand.versuche.length };
  if (stand.niveau[kapitel.id] && unterZiel(stand.niveau[kapitel.id], zielniveau)) delete stand.niveau[kapitel.id];
  for (const l of offen) delete stand.lernzielNiveau?.[l.id];
  return true;
}
// Wohin die Aufgabenführung in einem Kapitel führt: zum zuletzt bearbeiteten Meilenstein, solange er nicht fertig ist,
// sonst zum nächsten nicht fertigen danach in Kapitelreihenfolge, am Ende wieder von vorn. Abstecher nur, wenn der Schüler dort zuletzt war.
export function fuehrungsMeilenstein(index, stand, kapitel, einst, niveau) {
  const zu = einst.gesperrteMeilensteine ?? new Set(), nebel = imNebel(index, stand, kapitel, einst);
  const offen = (u) => !zu.has(u.id) && !nebel.has(u.id) && hatAufgabenIn(index, u) && !fuehrungFertig(index, stand, u, niveau, einst.zielniveau);
  const ziel = einst.zielniveau;
  const weg = kapitel.unterkapitel.filter((u) => !istAbstecher(u, ziel));
  // Version 0.60: Ist der Lernpfad in dieser Runde durch, beginnt die nächste Runde vorn (siehe naechsteRunde).
  if (ziel && !weg.some(offen) && naechsteRunde(index, stand, kapitel, weg.filter((u) => !zu.has(u.id) && !nebel.has(u.id)), ziel)) {
    return fuehrungsMeilenstein(index, stand, kapitel, einst, arbeitsniveau(stand, kapitel.id, ziel));
  }
  let zuletzt = null;
  // Eine neue Runde beginnt vorn: Nur Arbeit aus dieser Runde zählt als „zuletzt“ (Version 0.60).
  for (let i = stand.versuche.length - 1; i >= rundeAb(stand, kapitel.id) && !zuletzt; i--) {
    const v = stand.versuche[i];
    if (eigenerVersuch(v) && kapitelVon(v.lernziel ?? '') === kapitel.id) zuletzt = index.meilensteinVon.get(v.lernziel) ?? null;
  }
  // Von einem Niveau-Meilenstein über dem Zielniveau führt der Weg von selbst zurück auf das Kapitel (ADR 0038).
  if (zuletzt && !istNiveauAbstecher(zuletzt, ziel) && offen(zuletzt)) return zuletzt;
  const ab = zuletzt ? Math.max(0, weg.indexOf(istAbstecher(zuletzt, ziel) ? wirtVon(kapitel, zuletzt, ziel) : zuletzt) + 1) : 0;
  return [...weg.slice(ab), ...weg.slice(0, ab)].find(offen) ?? null;
}
// Abstecher, die an diesem Meilenstein hängen und noch offen sind: Sie bietet die Führung nach dem Meilenstein an.
export function abstecherAm(index, stand, kapitel, unterkapitel, einst, niveau) {
  const zu = einst.gesperrteMeilensteine ?? new Set(), nebel = imNebel(index, stand, kapitel, einst);
  return kapitel.unterkapitel.filter((u) => istAbstecher(u, einst.zielniveau) && wirtVon(kapitel, u, einst.zielniveau)?.id === unterkapitel.id && !zu.has(u.id) && !nebel.has(u.id)
    && hatAufgabenIn(index, u) && !fuehrungFertig(index, stand, u, niveau, einst.zielniveau));
}

// Etappe für die Startseite: das Kapitel, an dem gerade gearbeitet wird, mit Fortschritt und nächstem Meilenstein.
// Gesperrte Meilensteine, Meilensteine ohne Aufgaben und Niveau-Meilensteine über dem Zielniveau zählen nicht mit.
export function etappe(pool, index, stand, einst) {
  const zu = einst.gesperrteMeilensteine ?? new Set();
  const lage = (k) => {
    const meilensteine = k.unterkapitel.filter((u) => !zu.has(u.id) && !istNiveauAbstecher(u, einst.zielniveau) && milestoneStatus(index, stand, u) !== 'leer');
    const offen = meilensteine.filter((u) => milestoneStatus(index, stand, u) !== 'gemeistert');
    const naechste = einst.zielniveau ? fuehrungsMeilenstein(index, stand, k, einst, arbeitsniveau(stand, k.id, einst.zielniveau))
      : offen.find((u) => milestoneStatus(index, stand, u) === 'begonnen') ?? offen[0] ?? null;
    return { kapitel: k, gesamt: meilensteine.length, geschafft: meilensteine.length - offen.length, milestone: naechste };
  };
  const offene = pool.kapitel.filter((k) => einst.offeneKapitel.has(k.id)).map(lage).filter((l) => l.gesamt > 0);
  if (offene.length === 0) return null;
  const aktuell = offene.find((l) => l.kapitel.id === einst.aktuellesKapitel);
  // Ist das Klassenkapitel geschafft, kommt zuerst ein zusätzlich geöffnetes Tor (ADR 0022).
  const extra = offene.find((l) => l.milestone && einst.zusaetzlicheKapitel?.has(l.kapitel.id));
  return (aktuell?.milestone ? aktuell : null) ?? extra ?? offene.find((l) => l.milestone) ?? aktuell ?? offene.at(-1);
}
// Mit `niveau` und `zielniveau`: zuerst ein Lernziel, das die Führung in dieser Runde noch nicht erledigt hat (Version 0.60).
// Mit `niveau` allein: zuerst ein Lernziel, das für die Krone dieser Farbe noch fehlt (ADR 0012).
export function naechstesLernziel(index, stand, unterkapitel, niveau = null, zielniveau = null) {
  const mit = unterkapitel.lernziele.filter((l) => index.lernzielMitAufgaben.has(l.id));
  const fehlt = niveau && (zielniveau ? mit.find((l) => !lernzielErledigt(index, stand, l.id, niveau, zielniveau))
    : mit.find((l) => !lernzielStand(stand, l.id, niveau, index).erreicht));
  return fehlt || mit.find((l) => !stand.lernziele[l.id] && !unterZielAufgegeben(stand, l.id)) || mit.find((l) => !stand.lernziele[l.id]) || mit[0] || null;
}

// ---------- Aufgabe auswählen ----------
// Reihenfolge: noch nie bearbeitet, dann bearbeitet aber nicht gelöst, dann schon gelöst.
// An einem Niveau-Meilenstein kommen die Aufgaben mindestens von seiner Marke.
export function naechsteAufgabe(index, stand, lernzielId, niveau, zufall = Math.random) {
  const kandidaten = index.nach.get(`${lernzielId}|${stufeFuer(index, lernzielId, niveau)}`) ?? [];
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

// ---------- Gesehene Lösung (ADR 0031) ----------
// Die Lösung hat gesehen, wer eine Aufgabe nach zwei Fehlversuchen nicht gelöst hat (dann steht die Lösung da)
// oder das Lösungsschritt-Kärtchen geöffnet hat. Tipp und Beispiel zählen nicht. Der Einstiegscheck zeigt keine Lösung.
export const loesungGesehen = (v) => !v.einstieg && (!v.richtig || hatKarte(v, 'loesungsschritt'));
// Kennt der Schüler die Lösung dieser Aufgabe von heute? Dann bringt sie 1 Münze und zählt nicht fürs Siegel. Ab dem nächsten Tag zählt sie wieder.
export function kenntLoesung(stand, aufgabeId, jetzt) {
  const heute = tagVon(jetzt);
  return stand.versuche.some((v) => v.aufgabe === aufgabeId && loesungGesehen(v) && v.t && tagVon(v.t) === heute);
}

// ---------- Münzen ----------
// Version 0.60 (ADR 0052): Mit `index` beim Üben am Meilenstein bringt eine Aufgabe nur 1 Münze, wenn ihr Lernziel auf ihrer
// Niveaustufe schon nachgewiesen ist: Silber nach „Silber geschafft“, Gold nach dem Siegel. Volle Münzen gibt es nur für eine bessere Krone.
export function muenzenFuer(stand, aufgabe, bearbeitung, zielniveau, index = null) {
  if (!bearbeitung.geloest) return 0;
  if (bearbeitung.bekannt) return 1; // Lösung heute schon gesehen (ADR 0031)
  if (stand.versuche.some((v) => v.aufgabe === aufgabe.id && v.richtig)) return 1; // Wiederholung
  if (index && aufgabe.niveau !== 'F' && lernzielStand(stand, aufgabe.lernziel, aufgabe.niveau, index).erreicht) return 1; // schon nachgewiesen
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
  const bekannt = bearbeitung.geloest && kenntLoesung(stand, aufgabe.id, jetzt);
  const muenzen = muenzenFuer(stand, aufgabe, { ...bearbeitung, bekannt }, zielniveau, eigen ? index : null);
  const meilenstein = index?.meilensteinVon?.get(aufgabe.lernziel) ?? null;
  const kroneVorher = meilenstein ? krone(index, stand, meilenstein) : null;
  stand.versuche.push({
    t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau,
    richtig: bearbeitung.geloest, versuche: bearbeitung.versuche, eingaben: bearbeitung.eingaben,
    fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: bearbeitung.hilfen, dauer: bearbeitung.dauer, muenzen,
    ...(aufgabe.afb && { afb: aufgabe.afb }), ...(bearbeitung.karten && { karten: bearbeitung.karten }),
    ...(rueckblick && { rueckblick: true }), ...(bruecke && { bruecke: true }), ...(seitenblick && { seitenblick: true }), ...(sonderauftrag && { sonderauftrag }), ...(bearbeitung.sicher != null && { sicher: bearbeitung.sicher }), ...(bekannt && { bekannt: true }),
    ...(stand.dashboardVersion && { version: stand.dashboardVersion }),
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
  // Unter dem Ziel geschafft (Version 0.60): beim Üben am Meilenstein, ohne Siegel, auf Silber (bei Ziel Gold) oder einer anderen
  // Stufe unter dem Ziel, nur Versuche dieser Runde. Bronze aus der Grundlagen-Schleife zählt nicht, außer das Ziel ist F.
  let unterZielNeu = null;
  const lzZiel = stufeFuer(index, aufgabe.lernziel, zielniveau);
  if (eigen && index && !stand.lernziele[aufgabe.lernziel] && bearbeitung.geloest && unterZiel(aufgabe.niveau, lzZiel) && aufgabe.niveau !== 'F') {
    const kap = kapitelVon(aufgabe.lernziel), bisher = unterZielGeschafft(stand, aufgabe.lernziel)?.mal ?? 0;
    const ab = Math.max(rundeAb(stand, kap), stand.lernzielNiveau?.[aufgabe.lernziel]?.ab ?? 0);
    if (bisher < runde(stand, kap) && lernzielStand(stand, aufgabe.lernziel, aufgabe.niveau, index, ab).erreicht) {
      (stand.unterZiel ??= {})[aufgabe.lernziel] = { mal: bisher + 1, niveau: aufgabe.niveau, t: jetzt };
      delete stand.lernzielNiveau?.[aufgabe.lernziel]; // das nächste Mal beginnt es wieder auf dem Zielniveau
      unterZielNeu = { niveau: aufgabe.niveau, mal: bisher + 1 };
    }
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
  return { muenzen, neuesLernziel, unterZielNeu, training: unterZiel(aufgabe.niveau, zielniveau), neueKrone, ersteKrone, einschaetzung: ersteKrone ? { ...e } : null, heft, grundlage, ohneHilfe, bekannt };
}

// ---------- Rückblick (ADR 0014) ----------
// Verteiltes, gemischtes Wiederholen: Etwa 14, 35 und 90 Tage nach dem Siegel kommt ein Lernziel in den Rückblick (seit 0.48, ADR 0041).
// Ein Fehler nimmt nie ein Siegel weg; das Lernziel kommt im nächsten Rückblick wieder und gilt als aufzufrischen.
export const RUECKBLICK_TAGE = [14, 35, 90];
// Auffrischen (Rückblick und Seitenblick) kommt erst ab 10 Siegeln in der aktuellen Klassenstufe, damit wer gerade anfängt nach vorn kommt.
export const AUFFRISCHEN_AB_SIEGELN = 10;
export const SEITENBLICK_AB_SIEGELN_IM_KAPITEL = 3;
export const siegelDerKlassenstufe = (stand) => Object.keys(stand.lernziele ?? {}).filter((id) => Number.parseInt(id, 10) === klassenstufe(stand)).length;
export const auffrischenErlaubt = (stand) => siegelDerKlassenstufe(stand) >= AUFFRISCHEN_AB_SIEGELN;
export const RUECKBLICK_MIN = 3, RUECKBLICK_MAX = 5;
const TAG_MS = 86400000;
export const tagVon = (iso) => new Date(iso).toLocaleDateString('sv-SE'); // JJJJ-MM-TT in Ortszeit
export function faelligeLernziele(stand, index, jetzt) {
  if (!auffrischenErlaubt(stand)) return [];
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
    const alle = (index.nach.get(`${lz}|${stufeFuer(index, lz, zielniveau)}`) ?? []).filter((a) => !gewaehlt.includes(a.id));
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
// Vorschlag für die Kronenwahl aus den Ergebnissen: M mindestens zur Hälfte → M, sonst G.
// Die unterste Empfehlung ist G. F wird nie empfohlen: Dorthin führt nur die Grundlagen-Schleife (ADR 0015).
// Purpur wird nie empfohlen, auch nicht ohne Fehler: Purpur wählt das Kind selbst (ADR 0041).
export function einstiegsEmpfehlung(erledigt) {
  const quote = (n) => { const x = erledigt.filter((e) => e.niveau === n); return x.length ? x.filter((e) => e.richtig).length / x.length : 0; };
  const m = quote('M');
  if (m >= 0.5) return 'M';
  return 'G';
}
export function trageEinstiegEin(stand, kapitelId, aufgabe, bearbeitung, jetzt) {
  const e = stand.einstieg?.[kapitelId];
  if (!e || e.fertig || e.erledigt.some((x) => x.aufgabe === aufgabe.id)) return null;
  stand.versuche.push({ t: jetzt, aufgabe: aufgabe.id, lernziel: aufgabe.lernziel, niveau: aufgabe.niveau, richtig: bearbeitung.geloest, versuche: 1,
    eingaben: bearbeitung.eingaben, fehlvorstellungen: bearbeitung.fehlvorstellungen, hilfen: 0, dauer: bearbeitung.dauer, muenzen: 0, einstieg: true, ...(aufgabe.afb && { afb: aufgabe.afb }), ...(stand.dashboardVersion && { version: stand.dashboardVersion }) });
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
  const vor = (index.lernziel?.get(lernzielId)?.voraussetzungen ?? []).filter((id) => index.lernzielMitAufgaben.has(id) || index.vorstufe?.has(id));
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
// Die Belohnung stellt die Lehrkraft je Klasse ein (ADR 0027); sie steht im Auftrag. Fehlt sie (vor 0.27 verschickt), gilt 100.
export const SONDERAUFTRAG_BONUS = 100;
export const SONDERAUFTRAG_BELOHNUNGEN = [50, 100, 250, 500, 1000];
export const sonderauftragBelohnung = (wert) => SONDERAUFTRAG_BELOHNUNGEN.includes(Number(wert)) ? Number(wert) : SONDERAUFTRAG_BONUS;
export const SONDERAUFTRAG_MIN = 3, SONDERAUFTRAG_MAX = 5;
function gueltigerAuftrag(a) {
  if (!a?.id || !Array.isArray(a.aufgaben) || a.aufgaben.length === 0) return null;
  return { id: String(a.id), lernziel: a.lernziel, niveau: a.niveau, aufgaben: a.aufgaben.slice(0, SONDERAUFTRAG_MAX), satz: a.satz ? String(a.satz).slice(0, 200) : null, t: a.t ?? a.id, belohnung: sonderauftragBelohnung(a.belohnung) };
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
    ergebnis.bonus = sonderauftragBelohnung(auftrag.belohnung);
    stand.muenzen += ergebnis.bonus;
    (stand.sonderauftraege ??= []).push({ id: auftrag.id, t: jetzt, lernziel: auftrag.lernziel, niveau: auftrag.niveau, richtig: ergebnis.richtig, gesamt: ergebnis.gesamt, bonus: ergebnis.bonus });
    stand.sonderauftrag = null;
  }
  return ergebnis;
}

// ---------- Münzgabe (ADR 0027) ----------
// Der Administrator schickt einem Schüler Münzen über die Klassendatei: muenzgaben[code] = [{ id, t, muenzen, satz? }].
// Gutgeschrieben wird beim Öffnen, genau einmal je Kennung; der Speicherstand merkt sich die geöffneten (muenzgaben).
// Zurückziehen heißt: Der Eintrag fehlt. Abziehen gibt es nicht.
export const MUENZGABEN = [50, 100, 250, 500, 1000, 5000];
export function gueltigeMuenzgaben(liste) {
  if (!Array.isArray(liste)) return [];
  return liste.filter((g) => g?.id && MUENZGABEN.includes(Number(g.muenzen)))
    .map((g) => ({ id: String(g.id), t: g.t ?? g.id, muenzen: Number(g.muenzen), satz: g.satz ? String(g.satz).slice(0, 200) : null, ...(g.anKlasse && { anKlasse: String(g.anKlasse) }) }));
}
export const geoeffneteMuenzgabe = (stand, id) => (stand.muenzgaben ?? []).find((x) => x.id === id) ?? null;
// Ungeöffnete Gaben, die älteste zuerst.
export const offeneMuenzgaben = (stand, gaben) => (gaben ?? []).filter((g) => !geoeffneteMuenzgabe(stand, g.id))
  .sort((a, b) => String(a.t).localeCompare(String(b.t)));
export function oeffneMuenzgabe(stand, gabe, jetzt) {
  if (!gabe || !MUENZGABEN.includes(gabe.muenzen) || geoeffneteMuenzgabe(stand, gabe.id)) return 0;
  stand.muenzen += gabe.muenzen;
  (stand.muenzgaben ??= []).push({ id: gabe.id, t: jetzt, muenzen: gabe.muenzen });
  return gabe.muenzen;
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
// Erst ab 10 Siegeln in der Klassenstufe (ADR 0041); die 3 Siegel im Kapitel prüft waehleSeitenblick.
export function seitenblickFaellig(stand) {
  const w = stand.wegstueck;
  return Boolean(w) && w.aufgaben.length >= SEITENBLICK_AB && !w.aufgaben.some((a) => a.seitenblick) && auffrischenErlaubt(stand);
}
// Aufgabe zu einem schon besiegelten Lernziel desselben Kapitels, das am längsten nicht mehr dran war. Ohne Siegel: null.
export function waehleSeitenblick(index, stand, lernzielId, niveau, zufall = Math.random) {
  const kapitel = kapitelVon(lernzielId);
  if (Object.keys(stand.lernziele).filter((id) => kapitelVon(id) === kapitel).length < SEITENBLICK_AB_SIEGELN_IM_KAPITEL) return null;
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
    if (typeof t.loesung !== 'number') return null; // Kapitel 6: Der letzte Teil ist eine Auswahl (Antwortsatz).
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
// Version 0.60 (ADR 0052): Die Kronenwahl gilt je Lernziel. Mit `lernzielId` zählt zuerst, ob der Schüler bei diesem Lernziel
// abgesunken ist; sonst gilt die Wahl des Kapitels (voreingestellt das Zielniveau, darüber nur selbst gewählt).
export const arbeitsniveau = (stand, kapitelId, zielniveau, lernzielId = null) => {
  const n = (lernzielId && stand.lernzielNiveau?.[lernzielId]?.niveau) || (stand.niveau[kapitelId] ?? zielniveau);
  return wahlNiveaus(zielniveau).includes(n) ? n : 'G';
};
// 'hoch' nach 8 guten von 10 Aufgaben, 'runter', wenn 3 der letzten 5 nicht gelöst sind, sonst null (ADR 0041).
// 'hoch' führt nie zu Purpur: Purpur wählt das Kind selbst.
// 'runter' gibt es nur zu einer Krone, die zur Wahl steht: nie von Silber auf Bronze, außer das Ziel ist F.
// Version 0.60 (ADR 0052): 'runter' zählt mit `lernzielId` nur Aufgaben dieses Lernziels. 'hoch' gibt es nur noch bei Zielniveau
// F oder G (bis Gold); wer Gold als Ziel hat, beginnt ohnehin jedes Lernziel auf Gold.
export const HOCH_NACH = 10, HOCH_GUTE = 8, RUNTER_AUS = 5, RUNTER_FALSCH = 3;
const eigeneAufgabe = (v) => !v.einstieg && !v.bruecke && !v.seitenblick && !v.sonderauftrag && !v.rueckblick;
export function niveauVorschlag(stand, kapitelId, niveau, zielniveau = STANDARD_ZIELNIVEAU, lernzielId = null) {
  const stufe = NIVEAUS.indexOf(niveau);
  const seit = stand.niveauMarke[kapitelId] ?? 0;
  const imKapitel = stand.versuche.slice(seit).filter((v) => eigeneAufgabe(v) && kapitelVon(v.lernziel) === kapitelId && v.niveau === niveau);
  if (NIVEAUS.indexOf(zielniveau) < NIVEAUS.indexOf('M') && stufe < NIVEAUS.indexOf('M') && imKapitel.length >= HOCH_NACH && imKapitel.slice(-HOCH_NACH).filter(zaehlt).length >= HOCH_GUTE) return 'hoch';
  const seitLz = lernzielId ? Math.max(seit, stand.niveauMarkeLz?.[lernzielId] ?? 0) : seit;
  const eigene = lernzielId ? stand.versuche.slice(seitLz).filter((v) => eigeneAufgabe(v) && v.lernziel === lernzielId && v.niveau === niveau) : imKapitel;
  if (stufe > NIVEAUS.indexOf(wahlNiveaus(zielniveau)[0]) && eigene.slice(-RUNTER_AUS).filter((v) => !v.richtig).length >= RUNTER_FALSCH) return 'runter';
  return null;
}
// Die Kronenwahl des Kapitels, selbst gewählt auf der Karte, nach dem Einstiegscheck oder nach dem Vorschlag „hoch“.
// Sie gilt wieder für alle Lernziele des Kapitels: Ein Absinken einzelner Lernziele ist damit vergessen.
export function setzeNiveau(stand, kapitelId, niveau) {
  stand.niveau[kapitelId] = niveau;
  stand.niveauMarke[kapitelId] = stand.versuche.length;
  for (const id of Object.keys(stand.lernzielNiveau ?? {})) if (kapitelVon(id) === kapitelId) delete stand.lernzielNiveau[id];
}
// Absinken bei einem Lernziel (Version 0.60): nur dieses Lernziel, bis es unter dem Ziel geschafft ist. Eine selbst gewählte
// höhere Krone des Kapitels ist damit vorbei: Die nächsten Lernziele beginnen wieder auf dem Zielniveau.
export function sinkeAb(stand, lernzielId, niveau, zielniveau) {
  const kap = kapitelVon(lernzielId);
  (stand.lernzielNiveau ??= {})[lernzielId] = { niveau, ab: stand.versuche.length };
  (stand.niveauMarkeLz ??= {})[lernzielId] = stand.versuche.length;
  if (stand.niveau[kap] && NIVEAUS.indexOf(stand.niveau[kap]) > NIVEAUS.indexOf(zielniveau)) { stand.niveau[kap] = zielniveau; stand.niveauMarke[kap] = stand.versuche.length; }
  delete stand.absinkenAbgelehnt?.[lernzielId];
}
// Wer das Absinken einmal ablehnt und wieder drei der letzten fünf nicht löst, sinkt von selbst (Version 0.60).
export const sinktVonSelbst = (stand, lernzielId) => Boolean(stand.absinkenAbgelehnt?.[lernzielId]);
export function lehneAbsinkenAb(stand, lernzielId) {
  (stand.absinkenAbgelehnt ??= {})[lernzielId] = true;
  (stand.niveauMarkeLz ??= {})[lernzielId] = stand.versuche.length;
}
export function lehneVorschlagAb(stand, kapitelId) {
  stand.niveauMarke[kapitelId] = stand.versuche.length;
}

// ---------- Hilferuf ----------
// Seit 0.48 wählt das Kind einen Grund (ADR 0041), gespeichert als `anlass`, weil `grund` im Verlauf sagt, wie der Ruf endete.
// Ältere Hilferufe ohne Anlass bleiben gültig.
export const HILFERUF_GRUENDE = {
  verstehe: { text: 'Ich verstehe die Aufgabe nicht.', kurz: 'versteht die Aufgabe nicht', zeichen: '?' },
  schwer: { text: 'Die Aufgabe ist mir zu schwer.', kurz: 'Aufgabe zu schwer', zeichen: '▲' },
  falsch: { text: 'Ich glaube, die Aufgabe ist falsch.', kurz: 'Aufgabe falsch?', zeichen: '!' },
  technik: { text: 'Technisches Problem.', kurz: 'Technik', zeichen: '⚙' },
  anderes: { text: 'Etwas anderes.', kurz: 'etwas anderes', zeichen: '…' },
};
export function rufeHilfe(stand, aufgabeId, jetzt, anlass = null) {
  if (!stand.hilferuf) stand.hilferuf = { seit: jetzt, aufgabe: aufgabeId, ...(HILFERUF_GRUENDE[anlass] && { anlass }) };
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
// Seit ADR 0039 sind alle sechs Bereiche gebaut. Bereiche über der eigenen Klassenstufe zeigt der Schrank als Ausblick mit Vorschaubild.
// `arten`: die Teilearten des Bereichs mit ihrer Überschrift im Schrank.
export const WAPPENBEREICHE = [
  { klasse: 5, name: 'Farben und Zeichen' },
  { klasse: 6, name: 'Schildteilung', arten: { teilung: 'Schildteilung' }, satz: 'Dein Schild bekommt zwei Farben.' },
  { klasse: 7, name: 'Helmzier', arten: { helm: 'Helm', helmdecke: 'Helmdecke', helmschmuck: 'Helmschmuck' }, satz: 'Über deinem Schild sitzt ein Helm mit Decke und Schmuck.' },
  { klasse: 8, name: 'Schildhalter', arten: { halter: 'Schildhalter' }, satz: 'Zwei Tiere halten deinen Schild.' },
  { klasse: 9, name: 'Wahlspruch', arten: { spruch: 'Wahlspruch' }, satz: 'Unter deinem Schild steht dein Wahlspruch auf einem Band.' },
  { klasse: 10, name: 'Prunkrahmen', arten: { prunk: 'Prunkrahmen' }, satz: 'Mantel, Kranz, Kette und Postament rahmen dein Wappen.' },
];
// Teilearten, von denen das Wappen höchstens eines trägt: Das Feld im Wappen heißt wie die Art.
export const EINZELTEILE = ['teilung', 'helm', 'helmdecke', 'helmschmuck', 'spruch'];
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
// ---------- Wappenbereiche Klasse 6 bis 10 (ADR 0039) ----------
// Je Klassenstufe etwa 5.000 Münzen. Spätere Bereiche haben weniger Teile, die dafür mehr kosten. Nichts davon heißt „Krone“.
const T6 = [['gespalten', 'Gespalten', 300, 3], ['geteilt', 'Geteilt', 300, 3], ['schraeg', 'Schräg geteilt', 400, 3], ['schraeglinks', 'Schräglinks geteilt', 400, 3], ['pfahl', 'Pfahl', 500, 4],
  ['schildhaupt', 'Schildhaupt', 500, 4], ['geviert', 'Geviert', 550, 4], ['sparren', 'Sparren', 600, 5], ['schach', 'Geschacht', 700, 5], ['gestaendert', 'Geständert', 750, 5]];
const T7 = [['helm', 'topfhelm', 'Topfhelm', 550, 4], ['helm', 'stechhelm', 'Stechhelm', 600, 5], ['helm', 'spangenhelm', 'Spangenhelm', 650, 6], ['helmdecke', 'decke-schlicht', 'Schlichte Helmdecke', 500, 4],
  ['helmdecke', 'decke-gezaddelt', 'Gezaddelte Helmdecke', 650, 5], ['helmschmuck', 'federbusch', 'Federbusch', 600, 5], ['helmschmuck', 'fluegel', 'Flügel', 700, 6], ['helmschmuck', 'hoerner', 'Hörner', 750, 6]];
const T8 = [['loewe', 'Löwe', 800, 5], ['hirsch', 'Hirsch', 900, 6], ['baer', 'Bär', 1000, 6], ['greif', 'Greif', 1100, 7], ['einhorn', 'Einhorn', 1200, 8]];
// Wahlsprüche: eine feste Liste, kein Freitext. Die lateinischen stehen mit Übersetzung im Schrank.
const T9 = ['Schritt für Schritt', 'Mut tut gut', 'Übung macht den Meister', 'Wer fragt, gewinnt', 'Immer weiter', 'Mit Herz und Verstand', 'Fehler sind Helfer', 'Erst denken, dann rechnen',
  'Gemeinsam stark', 'Nie aufgeben', 'Neugier führt weit', 'Klug und kühn', 'Stein auf Stein', 'Mit Ruhe und Kraft', 'Ich schaffe das', 'Der Weg ist das Ziel', 'Wissen ist Macht',
  'Ehrlich währt am längsten', 'Treu und tapfer', 'Kopf hoch', 'Heute besser als gestern', 'Wer wagt, gewinnt', 'Geduld bringt Rosen', 'Ohne Fleiß kein Preis',
  ['Per aspera ad astra', 'Durch Mühe zu den Sternen'], ['Carpe diem', 'Nutze den Tag'], ['Sapere aude', 'Wage es, zu denken'], ['Veni, vidi, vici', 'Ich kam, sah und siegte'],
  ['Festina lente', 'Eile mit Weile'], ['Nil desperandum', 'Nur nicht verzweifeln']];
const T10 = [['lorbeer', 'Lorbeerkranz', 1100, 8], ['kette', 'Kette', 1200, 9], ['postament', 'Postament', 1300, 10], ['mantel', 'Wappenmantel', 1400, 11]];
WAPPEN_TEILE.push(
  ...T6.map(([id, name, preis, rang]) => ({ id, art: 'teilung', klasse: 6, name, preis, rang })),
  ...T7.map(([art, id, name, preis, rang]) => ({ id, art, klasse: 7, name, preis, rang })),
  ...T8.map(([id, name, preis, rang]) => ({ id: `halter-${id}`, art: 'halter', klasse: 8, name, preis, rang })),
  ...T9.map((t, i) => (Array.isArray(t) ? { id: `spruch-${i + 1}`, art: 'spruch', klasse: 9, name: t[0], deutsch: t[1], preis: 230, rang: i < 27 ? 8 : 9 }
    : { id: `spruch-${i + 1}`, art: 'spruch', klasse: 9, name: t, preis: 150, rang: i < 12 ? 6 : 7 })),
  ...T10.map(([id, name, preis, rang]) => ({ id, art: 'prunk', klasse: 10, name, preis, rang })),
);
// Die zweite Farbe eines geteilten Schildes: die gewählte, sonst die erste gekaufte, die nicht die Schildfarbe ist. Ohne zweite Farbe: null.
export function zweiteFarbe(wappen) {
  const farben = (wappen.gekauft ?? []).filter((id) => id !== wappen.farbe && WAPPEN_TEILE.some((t) => t.id === id && t.art === 'farbe'));
  return farben.includes(wappen.farbe2) ? wappen.farbe2 : farben[0] ?? null;
}
export function waehleZweiteFarbe(stand, id) {
  const t = teil(id), w = stand.wappen;
  if (t?.art === 'farbe' && w.gekauft.includes(id) && id !== w.farbe) w.farbe2 = id;
}
// Schildhalter stehen links und rechts, gleich oder verschieden. Noch einmal wählen nimmt das Tier von dieser Seite.
export function stelleHalter(stand, id, seite) {
  const t = teil(id), w = stand.wappen;
  if (t?.art !== 'halter' || !w.gekauft.includes(id) || !['links', 'rechts'].includes(seite)) return;
  w.halter = { ...(w.halter ?? {}) };
  if (w.halter[seite] === id) delete w.halter[seite]; else w.halter[seite] = id;
}
// Trägt das Wappen dieses Teil gerade?
export function traegt(wappen, id) {
  const t = teil(id);
  if (!t) return false;
  if (t.art === 'farbe') return wappen.farbe === id;
  if (t.art === 'zeichen') return (wappen.zeichen ?? []).includes(id);
  if (EINZELTEILE.includes(t.art)) return wappen[t.art] === id;
  if (t.art === 'halter') return wappen.halter?.links === id || wappen.halter?.rechts === id;
  return (wappen.prunk ?? []).includes(id);
}
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
// Farbe wählen; ein Zeichen anbringen oder abnehmen. Teile der späteren Bereiche (ADR 0039): anlegen oder wieder abnehmen.
// Farbe wählen; ein Zeichen anbringen oder abnehmen. Ein neues Zeichen wird Hauptzeichen, wenn noch keines da ist,
// sonst Beizeichen; sind schon zwei Beizeichen da, ersetzt es das letzte.
export function legeAn(stand, id) {
  const t = teil(id);
  if (!t || !stand.wappen.gekauft.includes(id)) return;
  const w = stand.wappen;
  if (t.art === 'farbe') w.farbe = id;
  else if (EINZELTEILE.includes(t.art)) { if (w[t.art] === id) delete w[t.art]; else w[t.art] = id; }
  // Ein neuer Schildhalter stellt sich auf beide Seiten, wenn noch keiner da ist; sonst nimmt „Abnehmen“ ihn von beiden Seiten.
  else if (t.art === 'halter') {
    const h = { ...(w.halter ?? {}) };
    if (h.links === id || h.rechts === id) { for (const seite of ['links', 'rechts']) if (h[seite] === id) delete h[seite]; }
    else { for (const seite of ['links', 'rechts']) if (!h[seite]) h[seite] = id; if (h.links !== id && h.rechts !== id) h.links = h.rechts = id; }
    w.halter = h;
  } else if (t.art === 'prunk') w.prunk = (w.prunk ?? []).includes(id) ? w.prunk.filter((x) => x !== id) : [...(w.prunk ?? []), id];
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
// Niveau-Meilensteine über dem Zielniveau zählen nicht für das Kapitelband (ADR 0038).
export function vergebeEhrenzeichen(stand, pool, index, zielniveau = null) {
  const neu = [];
  const gib = (id) => { if (!stand.wappen.gekauft.includes(id)) { stand.wappen.gekauft.push(id); neu.push(id); } };
  if (Object.values(kronen(pool, index, stand)).includes('E')) gib('purpurrose');
  const ganz = pool.kapitel.some((k) => {
    const ziele = k.unterkapitel.filter((u) => !istNiveauAbstecher(u, zielniveau)).flatMap((u) => u.lernziele).filter((l) => index.lernzielMitAufgaben.has(l.id));
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
    muenzgaben: gueltigeMuenzgaben(k.muenzgaben?.[code]), // ADR 0027
    feedback: gueltigesFeedback(k.feedback), // ADR 0042: null oder { alle }
    pin: k.pins?.[code] ?? null, // { salz, wert }: Prüfwert der PIN, nicht die PIN selbst
    meilensteinFreigabe: k.meilensteinFreigabe ?? {}, // ADR 0026: je Kapitel die freigegebenen Meilensteine; fehlt ein Kapitel, ist alles offen
    gesperrteMeilensteine: new Set(Object.entries(k.sperren ?? {}).filter(([, codes]) => codes.includes(code)).map(([meilenstein]) => meilenstein)),
    codeBekannt: k.codes ? k.codes.includes(code) : true,
  };
}

// ---------- Feedbackfragen (ADR 0042) ----------
// In der Erprobung fragt das Schüler-Dashboard nach jeder n-ten Aufgabe eine kurze Frage mit zwei Antworten.
// Der Administrator schaltet das je Klasse ein (anfangs aus) und wählt n. Die Antworten liegen im Speicherstand (stand.feedback).
export const FEEDBACK_ABSTAENDE = [3, 5, 10, 20];
export const FEEDBACK_STANDARD = 5;
export const FEEDBACK_FRAGEN = [
  { id: 'aussehen', text: 'Wie gefällt dir das Aussehen von Mathekingdom?', antworten: ['Gut', 'Nicht gut'] },
  { id: 'schwer', text: 'War diese Aufgabe zu schwer?', antworten: ['Ja', 'Nein'], zurAufgabe: true },
  { id: 'leicht', text: 'War diese Aufgabe zu leicht?', antworten: ['Ja', 'Nein'], zurAufgabe: true },
  { id: 'text', text: 'Hast du den Aufgabentext verstanden?', antworten: ['Ja', 'Nein'], zurAufgabe: true },
  { id: 'spass', text: 'Macht dir Mathekingdom gerade Spaß?', antworten: ['Ja', 'Nein'] },
  { id: 'tipp', text: 'Hat dir der Tipp geholfen?', antworten: ['Ja', 'Nein'], zurAufgabe: true, nur: 'tipp' },
  { id: 'karte', text: 'Findest du dich auf der Karte zurecht?', antworten: ['Ja', 'Nein'] },
  { id: 'bild', text: 'Ist das Bild in der Aufgabe gut zu erkennen?', antworten: ['Ja', 'Nein'], zurAufgabe: true, nur: 'bild' },
  { id: 'eingabe', text: 'Hat das Eingeben der Antwort gut geklappt?', antworten: ['Ja', 'Nein'], zurAufgabe: true },
  { id: 'weiter', text: 'Möchtest du so weiterarbeiten?', antworten: ['Ja', 'Lieber etwas anderes'] },
];
export function gueltigesFeedback(f) {
  if (!f || f.an !== true) return null;
  return { alle: FEEDBACK_ABSTAENDE.includes(Number(f.alle)) ? Number(f.alle) : FEEDBACK_STANDARD };
}
// Nach jeder Aufgabe außer Rückblick und Einstiegscheck: einen weiter zählen. Nur wenn die Abfrage an ist.
export function zaehleFuerFeedback(stand, feedback) {
  if (!feedback) return;
  stand.feedbackSeit = (stand.feedbackSeit ?? 0) + 1;
}
export const feedbackFaellig = (stand, feedback) => Boolean(feedback) && (stand.feedbackSeit ?? 0) >= feedback.alle;
// Mit welcher Frage ein Schüler beginnt (Version 0.54): versetzt nach seinem Code, damit in einer Stunde alle Fragen
// vorkommen und nicht jeder mit derselben ersten Frage anfängt.
export function feedbackStart(code = '') {
  let summe = 0;
  for (const c of String(code)) summe = (summe * 31 + c.charCodeAt(0)) % 9973;
  return summe % FEEDBACK_FRAGEN.length;
}
// Reihum die nächste passende Frage. kontext: { tipp: Tipp war offen, bild: Aufgabe hat ein Bild }.
export function naechsteFeedbackFrage(stand, kontext = {}) {
  const start = stand.feedbackNaechste ?? feedbackStart(stand.code);
  for (let i = 0; i < FEEDBACK_FRAGEN.length; i++) {
    const nr = (start + i) % FEEDBACK_FRAGEN.length, f = FEEDBACK_FRAGEN[nr];
    if (f.nur && !kontext[f.nur]) continue;
    return { ...f, nr };
  }
  return null;
}
export function trageFeedbackEin(stand, frage, antwort, aufgabeId, jetzt) {
  (stand.feedback ??= []).push({ t: jetzt, frage: frage.id, antwort: Number(antwort) === 1 ? 1 : 0, ...(frage.zurAufgabe && aufgabeId && { aufgabe: aufgabeId }),
    ...(stand.dashboardVersion && { version: stand.dashboardVersion }) }); // Version 0.59: auch Feedback trägt die Version
  stand.feedbackSeit = 0;
  stand.feedbackNaechste = (frage.nr + 1) % FEEDBACK_FRAGEN.length;
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
