// Gemeinsame Bausteine für Klasse 7, Kapitel 1 „Rationale Zahlen“ (ADR 0043).
// Grilling mit Nils (2026-11-24): F rechnet mit ganzen Zahlen bis ±20 und hat immer ein Bild. G: ganze Zahlen bis ±100 und Dezimalzahlen
// mit einer Stelle, Brüche nur beim Vergleichen. M: zwei Stellen und gleichnamige Brüche. E: ungleichnamige Brüche, Fehlersuche, Rückwärtsaufgaben.
// Schreibweise: echtes Minuszeichen „−“. Nach einem Rechenzeichen steht eine negative Zahl in Klammern: 3 + (−5).
// In 1.3 bis 1.5 zeigen G bis E auch das Pluszeichen: (+15). Ab 1.6 entfällt es.
// Eine rationale Zahl ist hier ein Paar [Zähler, Nenner] mit positivem Nenner, immer gekürzt. Gerechnet wird genau.

import { B, br, opt, zz, wahl, mische, zahl, bruch, dezimal, auswahl, luecken, GT, PT } from '../werkzeug.mjs';

export const MINUS = '−';
export const ggt = (a, b) => (b ? ggt(b, a % b) : Math.abs(a));
export const Q = (z, n = 1) => { if (n < 0) { z = -z; n = -n; } const g = ggt(z, n) || 1; return [z / g, n / g]; };
// Dezimalzahl aus Zehnteln (oder Hundertsteln): D(-25) ist −2,5, D(-125, 2) ist −1,25.
export const D = (x, stellen = 1) => Q(x, 10 ** stellen);
const q = (x) => (Array.isArray(x) ? x : Q(x));
export const plus = (a, b) => { [a, b] = [q(a), q(b)]; return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); };
export const minus = (a, b) => { [a, b] = [q(a), q(b)]; return Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); };
export const mal = (a, b) => { [a, b] = [q(a), q(b)]; return Q(a[0] * b[0], a[1] * b[1]); };
export const durch = (a, b) => { [a, b] = [q(a), q(b)]; return Q(a[0] * b[1], a[1] * b[0]); };
export const neg = (a) => { a = q(a); return Q(-a[0], a[1]); };
export const betrag = (a) => { a = q(a); return Q(Math.abs(a[0]), a[1]); };
export const vgl = (a, b) => { [a, b] = [q(a), q(b)]; return Math.sign(a[0] * b[1] - b[0] * a[1]); };
export const gleich = (a, b) => vgl(a, b) === 0;
export const istGanz = (a) => q(a)[1] === 1;
export const istDezimal = (a, stellen = 4) => (10 ** stellen) % q(a)[1] === 0;
export const summe = (liste) => liste.reduce((s, x) => plus(s, x), Q(0));

// ---------- Texte ----------
export const zt = (n) => (n < 0 ? `${MINUS}${-n}` : String(n));
// Dezimalzahl mit so vielen Stellen wie nötig (oder genau `stellen`, etwa für Geld).
export const dt = (a, stellen = null) => {
  const [z, n] = q(a);
  let k = 0;
  while ((10 ** k) % n !== 0) { k++; if (k > 6) throw new Error(`keine Dezimalzahl: ${z}/${n}`); }
  if (stellen != null && stellen > k) k = stellen;
  const ganzzahl = (Math.abs(z) * 10 ** k) / n, vor = Math.floor(ganzzahl / 10 ** k), nach = String(ganzzahl % 10 ** k).padStart(k, '0');
  return `${z < 0 ? MINUS : ''}${vor}${k ? `,${nach}` : ''}`;
};
// Bruch, über 1 als gemischte Zahl. Das Minus gilt für die ganze Zahl.
export const bt = (a) => { const [z, n] = q(a), b = Math.abs(z); return n === 1 ? zt(z) : `${z < 0 ? MINUS : ''}${b > n ? br(b % n, n, Math.floor(b / n)) : br(b, n)}`; };
// Unechter Bruch, ohne Umwandeln.
export const ut = (a) => { const [z, n] = q(a); return `${z < 0 ? MINUS : ''}${br(Math.abs(z), n)}`; };
// form: 'd' Dezimalzahl, 'b' Bruch; ganze Zahlen stehen immer ohne Komma.
export const T = (a, form = 'd') => (istGanz(a) ? zt(q(a)[0]) : form === 'b' ? bt(a) : dt(a));
// Nach einem Rechenzeichen: eine negative Zahl in Klammern.
export const kl = (text) => (/^[−+]/.test(String(text)) ? `(${text})` : String(text));
// Mit ausdrücklichem Vorzeichen in Klammern: (+15), (−8).
export const vz = (text) => (/^−/.test(String(text)) ? `(${text})` : `(+${String(text).replace(/^\+/, '')})`);
// Mit ausdrücklichem Vorzeichen ohne Klammern: +15, −8.
export const pv = (text) => (/^−/.test(String(text)) ? String(text) : `+${text}`);
// „a + b“ ohne Klammern geschrieben: 5 − 8, −3 + 4.
export const ohneKlammern = (teile) => teile.map((t, i) => { const s = String(t), m = /^−/.test(s); return i === 0 ? s : m ? `− ${s.slice(1)}` : `+ ${s.replace(/^\+/, '')}`; }).join(' ');

// ---------- Antworten ----------
// Typische Fehler als [[Zahl, Fehlvorstellung]]. Es bleibt, was sich von der Lösung unterscheidet und nicht doppelt ist.
const sieb = (loesung, liste) => { const gesehen = [q(loesung)]; return (liste ?? []).filter(([f]) => f != null).map(([f, fv]) => [q(f), fv]).filter(([f]) => Number.isFinite(f[0]) && Number.isFinite(f[1]) && f[1] !== 0 && !gesehen.some((x) => gleich(x, f)) && gesehen.push(f)); };
export const fl = (loesung, liste) => sieb(loesung, liste).filter(([f]) => istGanz(f)).map(([f, fv]) => ({ wert: f[0], fehlvorstellung: fv }));
// Eine Zahl als Antwort: ganze Zahl, Dezimalzahl (form 'd') oder vollständig gekürzter Bruch (form 'b').
export function antwort(text, wert, form, fehler, hilfen, nachweis, extra = {}) {
  const w = q(wert), { geld, ...rest } = extra;
  if (istGanz(w)) return zahl(text, w[0], fl(w, fehler), hilfen, { nachweis, ...rest });
  if (form === 'b') return bruch(text, bt(w), sieb(w, fehler).filter(([f]) => !istGanz(f)).map(([f, fv]) => [bt(f), fv]), hilfen, { gekuerzt: true, nachweis, ...rest });
  // Geld steht mit zwei Nachkommastellen da: −113,90.
  const d = (x) => dt(x, geld ? 2 : null);
  return dezimal(text, d(w), sieb(w, fehler).filter(([f]) => istDezimal(f)).map(([f, fv]) => [d(f), fv]), hilfen, { nachweis, ...rest });
}
// Auswahl aus Zahlen (als Text): richtig, dann die falschen mit ihrer Fehlvorstellung. Doppelte Texte fallen weg.
export function wahlAus(text, richtig, falsche, hilfen, extra = {}) {
  const gesehen = new Set([String(richtig)]);
  const rest = falsche.filter(([t]) => t != null && !gesehen.has(String(t)) && gesehen.add(String(t)));
  return auswahl(text, [opt(String(richtig), true), ...rest.map(([t, fv]) => opt(String(t), false, fv))], hilfen, extra);
}
// Lücke mit ganzer Zahl und typischen Fehlern.
export const lk = (wert, fehler = []) => [wert, fl(wert, fehler)];
// Lücke mit Dezimalzahl (als Text).
export const lkd = (wert, fehler = []) => { const w = q(wert); return istGanz(w) ? lk(w[0], fehler) : [dt(w), sieb(w, fehler).filter(([f]) => istDezimal(f)).map(([f, fv]) => ({ wert: dt(f), fehlvorstellung: fv }))]; };
export const ZEICHEN = (d, fv) => [opt('<', d < 0, d < 0 ? undefined : fv), opt('>', d > 0, d > 0 ? undefined : fv), opt('=', d === 0, d === 0 ? undefined : fv)];
export const VGL = (links, rechts) => ({ art: 'vergleich', links, rechts });
export const WERT = (wert) => ({ art: 'wert', wert: String(wert) });
export const FREI = (grund) => ({ art: 'frei', grund });
export const URTEIL = (stimmt, behauptung) => ({ art: 'urteil', stimmt, behauptung });
export const AUSSAGEN = { art: 'aussagen' };
// „Stimmt das?“: richtig ist „Stimmt.“ oder die Antwort mit der richtigen Rechnung.
export function urteil(text, stimmt, behauptung, richtigGlg, falschGlg, fv, hilfen, extra = {}) {
  return auswahl(text, [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Richtig ist: ${richtigGlg}.`, !stimmt, stimmt ? fv : undefined), ...falschGlg.filter((g) => g && g !== richtigGlg).map((g) => opt(`Falsch. Richtig ist: ${g}.`, false, fv))],
    hilfen, { ...extra, nachweis: [URTEIL(stimmt, behauptung), ...(extra.nachweis ?? [])] });
}
// „Welche Aussagen stimmen?“ mit Gleichungen oder Vergleichen: erzeuge(stimmt) liefert den Text einer wahren oder falschen Aussage.
export function aussagen(text, anzahl, erzeuge, fv, hilfen) {
  const roh = [];
  for (let i = 0; i < anzahl; i++) { const stimmt = i < 2 ? i === 0 : wahl([true, false]), t = erzeuge(stimmt, i); if (!t || roh.some(([x]) => x === t)) return null; roh.push([t, stimmt]); }
  return auswahl(text, roh.map(([t, r]) => opt(t, r, r ? undefined : fv)), hilfen, { mehrfach: true, nachweis: [AUSSAGEN] });
}

// ---------- Bilder ----------
// Zahlengerade: von, bis, schritt und beschriftung in Schritten des Teilers (teiler 10: 7 steht für 0,7).
export const gerade = (von, bis, schritt, beschriftung, extra = {}) => B.strahl({ von, bis, schritt, beschriftung, ...extra });
// Ein Sprung an der Zahlengeraden mit Beschriftung „+3“ oder „−5“.
export const sprung = (von, nach) => ({ von, nach, text: nach >= von ? `+${nach - von}` : `${MINUS}${von - nach}` });
// Rechnung an der Zahlengeraden: Start und Sprünge nacheinander.
export const weg = (von, bis, start, schritte, extra = {}) => { let p = start; return gerade(von, bis, 1, 5, { start, spruenge: schritte.map((s) => { const sp = sprung(p, p + s); p += s; return sp; }), ...extra }); };
export const thermo = (von, bis, schritt, beschriftung, ...saeulen) => ({ art: 'thermometer', von, bis, schritt, beschriftung, saeulen: saeulen.map((s) => (typeof s === 'number' ? { wert: s } : { wert: s[0], name: s[1] })) });
// Koordinatensystem mit vier Quadranten von −r bis r.
export const koord = (r, punkte = [], extra = {}) => GT(2 * r, 2 * r, { achsen: true, ursprung: [r, r], ...(punkte.length ? { punkte: punkte.map(([n, x, y, pos]) => PT(n, x, y, pos)) } : {}), ...extra });
export const pkt = ([x, y]) => `(${zt(x)}|${zt(y)})`;
// Kontoauszug: Zeilen [Text, Betrag in Euro (ganze Zahl oder Dezimalzahl)]. Ein Betrag null steht als Fragezeichen.
export const euro = (a, komma = false) => { const w = q(a); return `${komma ? dt(w, 2) : T(w)} €`; };
export const konto = (kopf, zeilen) => ({ art: 'auszug', kopf, zeilen: zeilen.map((z) => z.map(String)) });

// ---------- Zufall ----------
// Eine ganze Zahl ungleich null mit Betrag von a bis b.
export const zn = (a, b) => zz(a, b) * wahl([1, -1]);
export const negz = (a, b) => -zz(a, b);
export { B, br, opt, zz, wahl, mische };

// ---------- Hilfekärtchen je Niveaustufe ----------
// n: 0 = F, 1 = G, 2 = M, 3 = E. F und G bekommen Tipp, Beispiel und Lösungsschritt, M Tipp und Lösungsschritt, E nur den Tipp.
export const NIV = ['F', 'G', 'M', 'E'];
export const H = (n, tipp, beispiel, schritt) => (n <= 1 ? { tipp, beispiel, loesungsschritt: schritt } : n === 2 ? { tipp, loesungsschritt: schritt ?? beispiel } : { tipp });

// ---------- Rechenausdrücke als Baum ----------
// Ein Blatt ist eine Zahl, ein Knoten { op, l, r }. KL(e) setzt eine Klammer, die stehen bleibt, auch wenn sie nicht nötig wäre.
const knoten = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : { q: q(x) });
export const X = (op, l, r) => ({ op, l: knoten(l), r: knoten(r) });
export const KL = (e) => ({ kl: knoten(e) });
export const AB = (e) => ({ ab: knoten(e) });
export const kette = (op, ...teile) => teile.slice(1).reduce((b, t) => X(op, b, t), knoten(teile[0]));
export function val(e) {
  e = knoten(e);
  if (e.q) return e.q;
  if (e.kl) return val(e.kl);
  if (e.ab) return betrag(val(e.ab));
  const l = val(e.l), r = val(e.r);
  return e.op === '+' ? plus(l, r) : e.op === '−' ? minus(l, r) : e.op === '·' ? mal(l, r) : durch(l, r);
}
// o: { form: 'd' | 'b', plus: true schreibt jede Zahl mit Vorzeichen in Klammern, (+15) und (−8) }
export function txt(e, o = {}, erste = true) {
  e = knoten(e);
  if (e.q) { const s = T(e.q, o.form ?? 'd'); return o.plus ? vz(s) : erste ? s : kl(s); }
  if (e.kl) return `(${txt(e.kl, o, true)})`;
  if (e.ab) return `|${txt(e.ab, o, true)}|`;
  const strich = (x) => x.op === '+' || x.op === '−';
  // In einem Produkt oder Quotienten steht auch die erste negative Zahl in Klammern: (−3) · 4.
  const links = strich(e.l) && !strich(e) ? `(${txt(e.l, o, true)})` : txt(e.l, o, erste && !(e.l.q && !strich(e)));
  const rechts = e.r.op && (strich(e.r) ? e.op !== '+' : e.op === ':') ? `(${txt(e.r, o, true)})` : txt(e.r, o, false);
  return `${links} ${e.op} ${rechts}`;
}
// „Rechnung = Ergebnis“ für den Nachweis.
export const glg = (e, o = {}) => `${txt(e, o)} = ${T(val(e), o.form ?? 'd')}`;
// Berechne einen Ausdruck: eine Zahl als Antwort.
export function rechne(text, e, o, fehler, hilfen, extra = {}) {
  const w = val(e);
  if (o?.form === 'b' && !istGanz(w) && w[1] > (o.nenner ?? 400)) return null;
  if (o?.form !== 'b' && !istDezimal(w, o?.stellen ?? 4)) return null;
  const { nachweis: mehr = [], ...rest } = extra;
  return antwort(text, w, o?.form ?? 'd', fehler, hilfen, [glg(e, o), ...mehr], rest);
}
// „Stimmt das?“ zu einer Rechnung: Die Behauptung nennt das richtige oder ein falsches Ergebnis.
export function pruefe(text, e, o, falsch, fv, hilfen, extra = {}) {
  const w = val(e), stimmt = falsch == null, f = o?.form ?? 'd';
  if (!stimmt && gleich(falsch, w)) return null;
  const beh = `${txt(e, o)} = ${T(stimmt ? w : falsch, f)}`;
  const andere = (extra.andere ?? []).filter((x) => x != null && !gleich(x, w) && (stimmt || !gleich(x, falsch)));
  if (!andere.length) return null;
  // Stimmt die Behauptung, nennen die Antworten „Falsch“ zwei falsche Ergebnisse. Sonst steht das richtige Ergebnis neben einem falschen.
  const falschOpt = (x) => opt(`Falsch. Richtig ist: ${txt(e, o)} = ${T(x, f)}.`, false, fv);
  const { andere: _weg, ...rest } = extra;
  return auswahl(text(beh), [opt('Stimmt.', stimmt, stimmt ? undefined : fv), ...(stimmt ? andere.slice(0, 2).map(falschOpt) : [opt(`Falsch. Richtig ist: ${txt(e, o)} = ${T(w, f)}.`, true), falschOpt(andere[0])])], hilfen, { ...rest, nachweis: [URTEIL(stimmt, beh)] });
}
// Markieren an der Zahlengeraden: `tick` ist der Teilstrich, `beweis` der Nachweis dafür.
export const markiere = (text, bild, tick, fehler, hilfen, beweis) => ({ format: 'zahlenstrahl', eingabe: 'markieren', text, strahl: bild, loesung: tick,
  typischeFehler: (fehler ?? []).filter(([w], i, l) => Number.isInteger(w) && w !== tick && w >= bild.von && w <= bild.bis && (w - bild.von) % bild.schritt === 0 && l.findIndex(([x]) => x === w) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung })), hilfen, nachweis: beweis });
export const ANGABE = (wert) => ({ art: 'angabe', wert: String(wert) });
export const BILD = (wert, extra = {}) => ({ art: 'bild', wert: String(wert), ...extra });
export const KONTEXT = (betrag, wort, negativ) => ({ art: 'kontext', betrag: String(betrag), wort, negativ });
export const ORDNUNG = (ab = false) => ({ art: 'ordnung', ...(ab ? { ab: true } : {}) });
// Zahlenmauer mit Vorzeichen: `unten` ist die unterste Reihe (ganze Zahlen oder Brüche als Paar), `offen` nennt die leeren Steine [reihe, stelle].
export function mauerR(text, unten, offen, hilfen, extra = {}) {
  const reihen = [unten.map(q)];
  while (reihen.at(-1).length > 1) { const r = reihen.at(-1); reihen.push(r.slice(1).map((x, i) => plus(r[i], x))); }
  const frei = new Set(offen.map(([r, st]) => `${r},${st}`)), werte = {};
  let k = 0;
  const f = extra.form ?? 'd';
  const zeilen = [...reihen.keys()].reverse().map((ri) => reihen[ri].map((x, st) => {
    if (!frei.has(`${ri},${st}`)) return T(x, f);
    const name = 'abcdefghij'[k++]; werte[name] = istGanz(x) ? [x[0], extra.fehler?.(x, ri, st) ?? []] : T(x, f); return { luecke: name };
  }));
  if (reihen.flat().some((x) => !istGanz(x) && (f === 'b' || !istDezimal(x)))) return null;
  const t = luecken(text, werte, hilfen, { nachweis: [{ art: 'mauer' }] });
  return { ...t, format: 'tabelle', tabelle: { kopf: [], zeilen, art: 'mauer', rechenart: '+' } };
}
// Ein Weg an der Zahlengeraden: Start und Schritte mit Vorzeichen. Liefert das Ziel und die Rechnung „−3 + 5 − 4 = −2“.
export const lauf = (start, schritte, form = 'd') => { let z = q(start); const t = [T(z, form)]; for (const k of schritte.map(q)) { z = plus(z, k); t.push(`${k[0] < 0 ? '−' : '+'} ${T(betrag(k), form)}`); } return [z, `${t.join(' ')} = ${T(z, form)}`]; };
// Rechnung an der Zehntel-Zahlengeraden von −2 bis 2: Start und Schritte in Zehnteln. Ein Schritt null steht als Fragezeichen bis zum Ziel `bis`.
export const wegZ = (start, schritte, extra = {}) => { let p = start; return gerade(-20, 20, 1, 10, { teiler: 10, start, spruenge: schritte.map((k) => { const sp = { von: p, nach: p + k, text: pv(dt(D(k))) }; p += k; return sp; }), ...extra }); };
// Typische Fehler beim Addieren a + b und Subtrahieren a − b.
export const fAdd = (a, b) => { const z = plus(a, b), s = plus(betrag(a), betrag(b)); return [[neg(z), 'vorzeichen-vergessen'], [s, 'betraege-addiert'], [neg(s), 'betraege-addiert'], [minus(a, b), 'richtung-vertauscht']]; };
export const fSub = (a, b) => { const z = minus(a, b), bn = q(b)[0] < 0; return [[plus(a, b), bn ? 'minus-minus-uebersehen' : 'richtung-vertauscht'], [neg(z), 'vorzeichen-vergessen'], [minus(betrag(a), betrag(b)), 'betraege-addiert'], [neg(plus(betrag(a), betrag(b))), 'betraege-addiert']]; };
// Typische Fehler beim Multiplizieren a · b und Dividieren a : b.
export const fMal = (a, b) => { const z = mal(a, b), beide = q(a)[0] < 0 && q(b)[0] < 0; return [[neg(z), beide ? 'minus-mal-minus' : 'vorzeichen-vergessen'], [plus(a, b), '1x1-addiert']]; };
export const fDiv = (a, b) => { const z = durch(a, b); return [[neg(z), 'vorzeichen-division'], [mal(a, b), 'div-falsche-rechenart'], [minus(a, b), 'div-falsche-rechenart']]; };
// Gleiche Sprünge von der Null aus: k-mal der Schritt n (Malaufgabe an der Zahlengeraden).
export const huepfer = (k, n, von = -20, bis = 0, extra = {}) => weg(von, bis, 0, Array(k).fill(n), extra);
// Namen und Orte für Sachaufgaben.
export const KINDER = ['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara', 'Jonas', 'Finn', 'Ida', 'Ole', 'Lina', 'Paul', 'Emre', 'Noah', 'Elif', 'Sara'];
export const kind = () => wahl(KINDER);
export const zweiKinder = () => mische(KINDER).slice(0, 2);
export const ORTE = ['Oslo', 'Moskau', 'Kiruna', 'Zermatt', 'Oberstdorf', 'Helsinki', 'Winnipeg', 'Tromsø'];
export const TAGESZEITEN = ['morgens', 'mittags', 'abends'];
