// Kapitel 9 „Brüche und Dezimalzahlen“ (ADR 0036): reine Rechnung ohne Oberfläche.
// Ein Bruch steht im Text mit dem Bruchstrich-Zeichen „⁄“ (U+2044): „3⁄4“. Eine gemischte Zahl hat davor die Ganzen
// und ein schmales geschütztes Leerzeichen: „1 3⁄4“. Das Dashboard zeichnet beides gestapelt (dom.js).
// Eine Dezimalzahl steht mit Komma: „0,25“. Gerechnet wird mit ganzen Zählern und Nennern, nie mit Kommazahlen des Rechners.

export const STRICH = '⁄';
export const SCHMAL = ' ';
const ggt = (a, b) => (b ? ggt(b, a % b) : Math.abs(a));
export const kuerze = ({ z, n }) => { const g = ggt(z, n) || 1; return { z: z / g, n: n / g }; };
export const wertGleich = (a, b) => Boolean(a && b) && a.z * b.n === b.z * a.n;

// „2,5“, „2.5“ oder „12“ als Bruch: 2,5 ist 25 Zehntel. Höchstens vier Nachkommastellen.
// Klasse 7 (ADR 0043): Ein Vorzeichen davor zählt mit („−2,5“, „-2,5“, „+3“). Der Zähler trägt es.
const VORZEICHEN = '[+\\-−–]';
const minus = (zeichen) => Boolean(zeichen) && zeichen !== '+';
export function leseDezimal(text) {
  const s = String(text ?? '').replace(/[\s\u00a0\u202f']/g, '').replace('.', ',');
  const m = s.match(new RegExp(`^(${VORZEICHEN}?)(\\d+)(?:,(\\d{1,4}))?$`));
  return m ? { z: (minus(m[1]) ? -1 : 1) * Number(m[2] + (m[3] ?? '')), n: 10 ** (m[3]?.length ?? 0), stellen: m[3]?.length ?? 0 } : null;
}
// „3⁄4“, „3/4“, „1 3⁄4“ oder eine ganze Zahl als { g, z, n }: Ganze, Zähler, Nenner. null, wenn es kein Bruch ist.
// Mit Vorzeichen („−3⁄4“, „−1 3⁄4“) kommt v: -1 dazu, sonst fehlt v; das Minus gilt für die ganze Zahl.
export function leseBruch(text) {
  const s = String(text ?? '').trim().replace(/\//g, STRICH).replace(/[\s\u00a0\u202f]+/g, ' ');
  const m = s.match(new RegExp(`^(${VORZEICHEN}?) ?(?:(\\d+) )?(\\d+) ?${STRICH} ?(\\d+)$`));
  if (m) return Number(m[4]) > 0 ? { g: Number(m[2] ?? 0), z: Number(m[3]), n: Number(m[4]), ...(minus(m[1]) ? { v: -1 } : {}) } : null;
  const g = s.match(new RegExp(`^(${VORZEICHEN}?) ?(\\d+)$`));
  return g ? { g: Number(g[2]), z: 0, n: 1, ...(minus(g[1]) && Number(g[2]) !== 0 ? { v: -1 } : {}) } : null;
}
export const alsWert = (b) => (b ? { z: (b.v ?? 1) * (b.g * b.n + b.z), n: b.n } : null);
// Wert eines Textes: Bruch, gemischte Zahl, Dezimalzahl oder natürliche Zahl.
export const wertVon = (text) => (String(text).includes(',') || String(text).includes('.') ? leseDezimal(text) : alsWert(leseBruch(text)));
export const bruchText = (z, n, g = 0) => `${g ? `${g}${SCHMAL}` : ''}${z}${STRICH}${n}`;

// Eine Zahl prüfen, deren Lösung eine Dezimalzahl ist (Lösung als Text: „0,25“). Endnullen ändern den Wert nicht.
export function pruefeDezimal(teil, eingabe) {
  const wert = leseDezimal(eingabe), soll = leseDezimal(teil.loesung);
  if (wert && wertGleich(wert, soll)) return { richtig: true, fehlvorstellung: null };
  const treffer = wert && (teil.typischeFehler ?? []).find((f) => wertGleich(leseDezimal(f.wert), wert));
  return { richtig: false, fehlvorstellung: treffer?.fehlvorstellung ?? null };
}
// Brucheingabe: Die Eingabe ist ein Text wie „3/4“ oder „1 3/4“. Ein gleichwertiger Bruch zählt, außer die Aufgabe verlangt `genau` diesen Bruch.
// Klasse 6 (ADR 0037): Mit `gekuerzt` muss der Bruch vollständig gekürzt sein, mit `form: 'gemischt'` eine gemischte Zahl.
// Stimmt nur der Wert, meldet `nachbessern`, was noch fehlt ('kuerzen' oder 'gemischt'): Das Dashboard gibt dann einen Hinweis, ohne einen Versuch zu zählen.
// Unechter Bruch und gemischte Zahl zählen gleich, solange keine Form verlangt ist.
export function pruefeBruch(aufgabe, eingabe) {
  const ist = leseBruch(eingabe), soll = leseBruch(aufgabe.loesung);
  const gleicheForm = (a, b) => a.g === b.g && a.z === b.z && a.n === b.n && (a.v ?? 1) === (b.v ?? 1);
  if (ist && soll && (aufgabe.genau ? gleicheForm(ist, soll) : wertGleich(alsWert(ist), alsWert(soll)))) {
    const echt = ist.z < ist.n;
    if (aufgabe.form === 'gemischt' && !(ist.g > 0 && echt)) return { richtig: false, fehlvorstellung: 'gemischt-umwandeln', nachbessern: 'gemischt' };
    if (aufgabe.gekuerzt && ist.g > 0 && !echt) return { richtig: false, fehlvorstellung: 'gemischt-umwandeln', nachbessern: 'gemischt' };
    if (aufgabe.gekuerzt && ist.z > 0 && ggt(ist.z, ist.n) !== 1) return { richtig: false, fehlvorstellung: 'kuerzen-nicht-vollstaendig', nachbessern: 'kuerzen' };
    return { richtig: true, fehlvorstellung: null };
  }
  const fehler = (aufgabe.typischeFehler ?? []).map((f) => ({ ...f, b: leseBruch(f.wert) })).filter((f) => f.b);
  const treffer = ist && (fehler.find((f) => gleicheForm(f.b, ist)) ?? fehler.find((f) => wertGleich(alsWert(f.b), alsWert(ist))));
  return { richtig: false, fehlvorstellung: treffer?.fehlvorstellung ?? null };
}
// Hinweise zum Nachbessern. Sie kosten keinen Versuch (höchstens zweimal je Aufgabe, danach zählt die Eingabe als Fehlversuch).
export const NACHBESSERN = {
  kuerzen: 'Fast richtig: Dein Bruch hat den richtigen Wert. Kürze ihn noch so weit wie möglich. Das kostet dich keinen Versuch.',
  gemischt: 'Fast richtig: Der Wert stimmt. Schreibe die Zahl noch als gemischte Zahl: erst die Ganzen, dahinter einen Bruch, der kleiner als 1 ist. Das kostet dich keinen Versuch.',
};
export const NACHBESSERN_HOECHSTENS = 2;
// Teile färben: Die Eingabe nennt die gefärbten Teile („0 3 5“). Richtig ist jede Auswahl mit der verlangten Anzahl.
export const leseTeile = (text) => [...new Set(String(text ?? '').split(/\s+/).filter((x) => /^\d+$/.test(x)).map(Number))].sort((a, b) => a - b);
export function pruefeFaerben(aufgabe, eingabe) {
  const n = leseTeile(eingabe).length;
  if (n === aufgabe.loesung) return { richtig: true, fehlvorstellung: null };
  return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => f.wert === n)?.fehlvorstellung ?? null };
}
// Anzahl aller Teile eines Bildes zum Färben (über alle Ganzen).
export const teileVon = (f) => (f.form === 'rechteck' ? f.reihen * f.spalten : f.teile) * (f.ganze ?? 1);
export const faerbenLoesung = (a) => `${a.loesung} von ${teileVon(a.faerben)} Teilen färben, zum Beispiel wie im Bild`;
export const bruchLoesung = (a) => String(a.loesung);
