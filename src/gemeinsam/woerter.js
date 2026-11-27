// Worterklärung am Wort (ADR 0056): Welche Wörter aus den Wortspeichern stehen in einem Text?
// Gebraucht vom Schüler-Dashboard (unterstrichene Wörter in der Aufgabe) und von der Poolprüfung.
// Ein Eintrag ist { wort, erklaerung, formen? }. `formen` nennt Wortformen, die die Regeln unten nicht finden
// (Umlaut im Plural wie „Brüche“, unregelmäßige Verben wie „miss“).

const B = 'A-Za-zÄÖÜäöüß';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const erster = (s) => (/^[a-zäöü]/.test(s) ? `[${s[0]}${s[0].toUpperCase()}]${esc(s.slice(1))}` : esc(s));

// Alltagswörter aus einem Wortspeicher: Sie werden nur im eigenen Kapitel erklärt. In einem anderen Kapitel stehen sie
// meist in einem anderen Sinn im Text („Ziel“ am Zahlenstrahl, „Ziel“ einer Reise).
export const NUR_IM_KAPITEL = new Set(['höher', 'zusammen', 'zuerst', 'mal', 'hoch', 'davon', 'gegenüber', 'rückwärts', 'ungefähr', 'teilen', 'verteilen', 'tauschen', 'wegnehmen',
  'Start', 'Ziel', 'Schritt', 'Weg', 'Teil', 'Rest', 'Stück', 'Reihe', 'Spalte', 'Zeile', 'Feld', 'Linie', 'Ecke', 'Seite', 'Punkt', 'Stelle', 'Muster', 'Regel', 'Paar', 'Preis', 'Menge', 'Kästchen', 'Wert', 'Frage', 'Antwort', 'Angabe', 'Aussage', 'Zeichen', 'Mitte', 'Euro', 'Cent', 'Anzahl', 'Deckel', 'Betrag', 'Tabelle', 'Balken', 'Minute', 'Sekunde',
  'messen', 'falten', 'kippen', 'verschieben', 'vergleichen', 'ordnen', 'ergänzen', 'zerlegen', 'gemischt', 'vollständig', 'gestrichelt', 'überflüssig', 'eindeutig', 'spitz', 'stumpf', 'gestreckt', 'verdoppelt']);

// Wortformen mit Umlaut, die die Endungsregeln nicht finden.
const FORMEN = { Bruch: 'Brüche', Stammbruch: 'Stammbrüche', Abstand: 'Abstände', Betrag: 'Beträge', Übertrag: 'Überträge', Überschlag: 'Überschläge', Dreierblock: 'Dreierblöcke',
  Rechenausdruck: 'Rechenausdrücke', Maßstab: 'Maßstäbe', Bogen: 'Bögen', Rand: 'Ränder', Radius: 'Radien', Satz: 'Sätze' };

// Wortformen, die wie ein Treffer aussehen, aber etwas anderes bedeuten.
const KEIN_TREFFER = { spitz: ['Spitze', 'Spitzen'], Übertrag: ['Übertrage'], stumpf: ['Stumpf'] };

// Muster für ein einzelnes Wort.
function wortMuster(teil, { inPhrase = false } = {}) {
  // Nomen: mit den üblichen Endungen, Groß- und Kleinschreibung zählt („Summe“, „Summen“; „Ergebnis“, „Ergebnisse“).
  if (/^[A-ZÄÖÜ]/.test(teil) || /[^A-Za-zÄÖÜäöüß]/.test(teil)) return `(?:${esc(teil)}(?:e|en|n|s|es|er|ern|se|sen|nen)?${FORMEN[teil] ? `|${FORMEN[teil]}n?` : ''})`;
  // Kurze Wörter („mal“, „plus“, „hoch“, „ggT“): nur genau so.
  if (teil.length <= 4 || /[A-Z]/.test(teil)) return erster(teil);
  // Verb: Stamm mit Endung („addiere“, „addiert“), auch als Mittelwort („gerundet“, „gekürzt“).
  if (/(?:ieren|[^i]en|eln|ern)$/.test(teil) && !inPhrase) {
    // Großgeschrieben zählt ein Verb nur am Satzanfang („Teile durch 4.“), sonst wäre „drei Teile“ ein Treffer für „teilen“.
    const stamm = teil.replace(/e?n$/, ''), gross = stamm[0].toUpperCase() + esc(stamm.slice(1));
    const endung = '(?:e|en|n|t|st|et|te|ten|est)';
    return `(?:${esc(stamm)}${endung}|(?:(?<=^|[.!?:]\\s+|\\n)${gross}${endung})|[Gg]e${esc(stamm)}e?t|${esc(teil)})`;
  }
  // Eigenschaftswort: mit Endung („gleichnamige“, „gemischten“).
  const stamm = inPhrase ? teil.replace(/(?:e|er|es|en)$/, '') : teil;
  return `${erster(stamm)}(?:e|en|er|es|em)?`;
}

// Muster für einen Eintrag. Mehrere Wörter stehen in dieser Reihenfolge; „schriftlich addieren“ auch umgekehrt („Addiere schriftlich“).
function eintragMuster(e) {
  const formen = (e.formen ?? []).map(esc);
  const teile = e.wort.replace(/^(?:das|der|die) /, '').split(' ');
  let haupt;
  if (teile.length === 1) haupt = wortMuster(teile[0]);
  else {
    const letztes = teile.at(-1), verb = /^[a-zäöü]/.test(letztes) && /en$/.test(letztes);
    if (verb && teile.length === 2) {
      const v = wortMuster(letztes), a = erster(teile[0]);
      haupt = `(?:${a}\\s+${v}|${v}\\s+${teile[0]})`;
    } else haupt = teile.map((t, i) => (i === teile.length - 1 ? wortMuster(t) : /^[a-zäöü]/.test(t) && t.length > 4 ? wortMuster(t, { inPhrase: true }) : erster(t))).join('\\s+');
  }
  return new RegExp(`(?<![${B}\\d])(?:${[haupt, ...formen].join('|')})(?![${B}])`, 'g');
}

// Baut das Verzeichnis: alle Einträge der Klassenstufe (und der Vorstufe), jeder mit seinem Muster und seinem Ort.
export function wortVerzeichnis(pool) {
  const eintraege = [];
  for (const k of pool.kapitel ?? []) for (const u of k.unterkapitel) for (const w of u.wortspeicher ?? []) {
    eintraege.push({ wort: w.wort, erklaerung: w.erklaerung, meilenstein: u.id, kapitel: k.id, muster: eintragMuster(w) });
  }
  // Grundwörter gehören zu keinem Meilenstein. Die Wörter früherer Klassenstufen stehen als Kopie in der Vorstufe.
  for (const w of pool.grundwoerter ?? []) eintraege.push({ wort: w.wort, erklaerung: w.erklaerung, meilenstein: null, kapitel: null, muster: eintragMuster(w) });
  for (const w of pool.vorstufe?.woerter ?? []) eintraege.push({ wort: w.wort, erklaerung: w.erklaerung, meilenstein: w.meilenstein ?? null, kapitel: w.meilenstein?.split('.').slice(0, 2).join('.') ?? null, vorstufe: true, muster: eintragMuster(w) });
  return eintraege;
}

// Wie gut passt ein Eintrag zum Ort der Aufgabe? Eigener Meilenstein vor eigenem Kapitel vor dem Rest der Klassenstufe.
function rang(e, ort) {
  if (e.meilenstein && e.meilenstein === ort.meilenstein) return 0;
  if (e.kapitel && e.kapitel === ort.kapitel) return 1;
  if (NUR_IM_KAPITEL.has(e.wort)) return null;
  // Eine Aufgabe aus der Vorstufe (Brücke) nimmt zuerst die Wörter ihrer eigenen Klassenstufe.
  return Boolean(e.vorstufe) === Boolean(ort.vorstufe) ? 2 : 3;
}

// Findet die Wörter in einem Text. Ergebnis: Fundstellen { start, ende, wort, erklaerung }, von links nach rechts, ohne Überschneidung.
// Bei Überschneidung gewinnt die längere Fundstelle („gemischte Zahl“ vor „Zahl“), bei gleicher Länge der nähere Wortspeicher.
// `ort` ist { meilenstein, kapitel, vorstufe? } der Aufgabe.
export function findeWoerter(text, verzeichnis, ort) {
  const funde = [];
  for (const e of verzeichnis) {
    const r = rang(e, ort);
    if (r == null) continue;
    e.muster.lastIndex = 0;
    for (const m of text.matchAll(e.muster)) funde.push({ start: m.index, ende: m.index + m[0].length, wort: e.wort, erklaerung: e.erklaerung, rang: r });
  }
  funde.sort((a, b) => (b.ende - b.start) - (a.ende - a.start) || a.rang - b.rang || a.start - b.start);
  const frei = [];
  for (const f of funde) if (KEIN_TREFFER[f.wort]?.includes(text.slice(f.start, f.ende))) f.rang = null;
  for (const f of funde.filter((x) => x.rang != null)) if (!frei.some((g) => f.start < g.ende && g.start < f.ende)) frei.push(f);
  return frei.sort((a, b) => a.start - b.start);
}

// Alle sichtbaren Texte der Aufgabenstellung (ohne Hilfekärtchen).
export const aufgabenTexte = (a) => [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.teile ?? []).flatMap((t) => [t.text, ...(t.optionen ?? []).map((o) => o.text)]),
  ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts])].filter((t) => typeof t === 'string');
