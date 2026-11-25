// Prüfungen für Klasse 6, Kapitel 6 „Berechnungen am Quader“ (ADR 0049).
// Der Prüfer rechnet unabhängig von den Erzeugern: Er liest Größen aus Texten, rechnet mit Länge, Fläche und Volumen als Brüchen
// in Millimetern (mm, mm², mm³), bestimmt Volumen und Oberflächeninhalt aus den Bildern und vergleicht mit Lösung und Nachweis.
// tools/pruefe-pool.mjs ruft pruefeQuaderAufgabe für jede Aufgabe mit einem Lernziel 6.6.… auf.

import { EINHEITEN } from '../src/schueler/groessen.js';
import { koerperBildMaengel } from './pruefe-koerper.mjs';

const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };
const DIM = { laenge: 1, flaeche: 2, volumen: 3 };
// Einheiten des Kapitels: Länge mm bis m, Fläche mm² bis m², Volumen mm³ bis m³ und ml, l, hl.
const ERLAUBT = ['mm', 'cm', 'dm', 'm', 'mm²', 'cm²', 'dm²', 'm²', 'mm³', 'cm³', 'dm³', 'm³', 'ml', 'l', 'hl'];
const dimVon = (e) => DIM[EINHEITEN[e]?.[0]] ?? null;
const faktorVon = (e) => EINHEITEN[e][1];
const NAMEN = { mm: 'Millimeter', cm: 'Zentimeter', dm: 'Dezimeter', m: 'Meter', 'mm²': 'Quadratmillimeter', 'cm²': 'Quadratzentimeter', 'dm²': 'Quadratdezimeter', 'm²': 'Quadratmeter',
  'mm³': 'Kubikmillimeter', 'cm³': 'Kubikzentimeter', 'dm³': 'Kubikdezimeter', 'm³': 'Kubikmeter', ml: 'Milliliter', l: 'Liter', hl: 'Hektoliter' };

// ---------- Rechnen mit Brüchen und Dimension ----------
const ggT = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const W = (z, n = 1, dim = 0) => { if (n < 0) { z = -z; n = -n; } const g = ggT(z, n); return { z: z / g, n: n / g, dim }; };
const gleich = (x, y) => Boolean(x && y) && x.dim === y.dim && x.z === y.z && x.n === y.n;
const kleiner = (x, y) => x.z * y.n < y.z * x.n;
const schl = (x) => `${x.dim}:${x.z}/${x.n}`;
const plus = (x, y, v = 1) => { if (x.dim !== y.dim) throw new Error('Einheiten passen nicht'); return W(x.z * y.n + v * y.z * x.n, x.n * y.n, x.dim); };
const mal = (x, y) => W(x.z * y.z, x.n * y.n, x.dim + y.dim);
const durch = (x, y) => { if (y.z === 0) throw new Error('durch 0'); return W(x.z * y.n, x.n * y.z, x.dim - y.dim); };

const NUM = '(?:\\d{1,3}(?:\\u00a0\\d{3})+|\\d+)(?:,\\d+)?';
const UNIT = '(?:(?:mm|cm|dm|m)[²³]?|ml|hl|l)(?![A-Za-zÄÖÜäöüß²³])';
const GROESSE = `${NUM}(?: ${UNIT})?(?: ${NUM} ${UNIT})*`;
const TERM = `\\(*${GROESSE}\\)*`;
const AUSDRUCK = `${TERM}(?: [+−·:] ${TERM})*`;
// Zwischen Zahl und Einheit steht oft ein geschütztes Leerzeichen; zum Lesen wird es ein gewöhnliches. In Zahlen (12 500) bleibt es.
const lies = (t) => String(t ?? '').replace(/\u00a0(?=\D)/g, ' ');
const zahlWert = (t) => { const [g, k = ''] = t.replace(/ /g, '').split(','); return W(Number(g + k), 10 ** k.length); };
const groesseWert = (zahl, einheit) => (einheit ? mal(zahlWert(zahl), W(faktorVon(einheit), 1, dimVon(einheit))) : zahlWert(zahl));

// Rechnet einen Ausdruck wie „2 · (20 cm² + 10 cm²)“ oder „2 dm³ 500 cm³“ aus. null, wenn er sich nicht lesen lässt.
export function qRechne(text) {
  const t = lies(text).trim().match(new RegExp(`${NUM}|${UNIT}|[+−·:()]|\\S+`, 'g')) ?? [];
  let i = 0;
  const istZahl = (x) => x != null && new RegExp(`^${NUM}$`).test(x), istEinheit = (x) => x != null && new RegExp(`^${UNIT}$`).test(x);
  const groesse = () => {
    if (!istZahl(t[i])) throw new Error('Zahl erwartet');
    let w = istEinheit(t[i + 1]) ? groesseWert(t[i], t[i + 1]) : zahlWert(t[i]);
    i += istEinheit(t[i + 1]) ? 2 : 1;
    // gemischte Schreibweise: „2 dm³ 500 cm³“
    while (w.dim > 0 && istZahl(t[i]) && istEinheit(t[i + 1])) { w = plus(w, groesseWert(t[i], t[i + 1])); i += 2; }
    return w;
  };
  const faktor = () => { if (t[i] === '(') { i++; const w = summe(); if (t[i] !== ')') throw new Error('Klammer'); i++; return w; } return groesse(); };
  const produkt = () => { let w = faktor(); while (t[i] === '·' || t[i] === ':') { const op = t[i++]; const r = faktor(); w = op === '·' ? mal(w, r) : durch(w, r); } return w; };
  function summe() { let w = produkt(); while (t[i] === '+' || t[i] === '−') { const op = t[i++]; w = plus(w, produkt(), op === '+' ? 1 : -1); } return w; }
  try { const w = summe(); return i === t.length ? w : null; } catch { return null; }
}
// Alle Gleichungen in einem Text, mit Einheiten: „5 cm · 4 cm = 20 cm²“, „3,5 l = 3500 ml“, „4 · 3 · 2 = 24“.
const GLEICHUNG = new RegExp(`(?<![\\d,\\u00a0(])(${AUSDRUCK})((?: = ${AUSDRUCK})+)(?![\\d,\\u00a0]| (?:${UNIT}|[+−·:=] ))`, 'g');
export function qGleichungen(text) {
  const t = lies(text), liste = [];
  for (const m of t.matchAll(GLEICHUNG)) {
    if (/ [+−·:] $/.test(t.slice(0, m.index))) continue; // Teil eines Ausdrucks mit Buchstaben („a · 3 = …“)
    const seiten = [m[1], ...m[2].split(' = ').slice(1)], werte = seiten.map(qRechne);
    liste.push({ ganz: m[0], seiten, werte, groesse: true, rest: null, ok: werte.every((w) => w && gleich(w, werte[0])), danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1) });
  }
  return liste;
}
// Alle Zahlen und Größen eines Textes als Werte: die Größe selbst und ihre Maßzahl.
function atome(text) {
  const liste = [];
  for (const m of lies(text).matchAll(new RegExp(`(?<![\\d,\\u00a0])${GROESSE}`, 'g'))) {
    const w = qRechne(m[0]); if (w) liste.push(w);
    for (const z of m[0].matchAll(new RegExp(NUM, 'g'))) liste.push(zahlWert(z[0]));
    for (const g of m[0].matchAll(new RegExp(`(${NUM}) (${UNIT})`, 'g'))) liste.push(groesseWert(g[1], g[2]));
  }
  return liste;
}
// Nur die Größen selbst (ohne ihre Maßzahlen): die Werte, mit denen eine Rechnung rechnet.
const operanden = (text) => [...lies(text).matchAll(new RegExp(`(?<![\\d,\\u00a0])${GROESSE}`, 'g'))].map((m) => qRechne(m[0])).filter(Boolean);
const zahlenIn = (text) => [...lies(text).matchAll(new RegExp(NUM, 'g'))].map((z) => zahlWert(z[0])).filter((w) => w.n === 1).map((w) => w.z);
const wertAus = (x) => (typeof x === 'number' ? W(x) : qRechne(x));

// ---------- Bilder ----------
// Volumen und Oberflächeninhalt eines Körpers aus Quadern, in Einheiten des Bildes (eigene Rechnung über ein Raster aus allen Schnittebenen).
function koerperAusQuadern(teile) {
  const achse = (p, l) => [...new Set(teile.flatMap((t) => [t[p], t[p] + t[l]]))].sort((x, y) => x - y);
  const X = achse('x', 'a'), Y = achse('y', 'b'), Zs = achse('z', 'c');
  const in1 = (lo, hi, a, b) => (lo + hi) / 2 > a && (lo + hi) / 2 < b;
  const belegt = (i, j, k) => i >= 0 && j >= 0 && k >= 0 && i < X.length - 1 && j < Y.length - 1 && k < Zs.length - 1
    && teile.filter((t) => in1(X[i], X[i + 1], t.x, t.x + t.a) && in1(Y[j], Y[j + 1], t.y, t.y + t.b) && in1(Zs[k], Zs[k + 1], t.z, t.z + t.c)).length;
  let V = 0, O = 0, doppelt = false;
  for (let i = 0; i < X.length - 1; i++) for (let j = 0; j < Y.length - 1; j++) for (let k = 0; k < Zs.length - 1; k++) {
    const n = belegt(i, j, k); if (!n) continue; if (n > 1) doppelt = true;
    const [dx, dy, dz] = [X[i + 1] - X[i], Y[j + 1] - Y[j], Zs[k + 1] - Zs[k]];
    V += dx * dy * dz;
    O += (belegt(i - 1, j, k) ? 0 : dy * dz) + (belegt(i + 1, j, k) ? 0 : dy * dz) + (belegt(i, j - 1, k) ? 0 : dx * dz) + (belegt(i, j + 1, k) ? 0 : dx * dz) + (belegt(i, j, k - 1) ? 0 : dx * dy) + (belegt(i, j, k + 1) ? 0 : dx * dy);
  }
  return { V, O, doppelt };
}
const zehntel = (x) => W(Math.round(x * 1000), 1000); // Maße im Bild: höchstens drei Nachkommastellen
const einheitDesBildes = (b) => b.einheit ?? lies(b.masse?.[0]?.t).match(new RegExp(`(${UNIT})$`))?.[1] ?? null;
// Was ein Bild zeigt: 'volumen', 'oberflaeche' (Größe), 'wuerfel', 'aussen' (Anzahl). null, wenn das Bild es nicht hergibt.
export function bildWert(b, was) {
  if (!b) return null;
  if (b.art === 'risse') return was === 'wuerfel' ? W(b.risse.flatMap((r) => r.zahlen ?? []).reduce((s, z) => s + z[2], 0)) : null;
  if (b.art === 'netz') {
    const e = b.einheit; if (was !== 'oberflaeche' || !dimVon(e)) return null;
    const flaeche = (p) => Math.abs(p.reduce((s, [x, y], i) => s + x * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * y, 0)) / 2;
    return mal(zehntel(b.flaechen.reduce((s, f) => s + flaeche(f.ecken), 0)), W(faktorVon(e) ** 2, 1, 2));
  }
  if (b.art !== 'koerper') return null;
  if (b.form === 'wuerfelbau') {
    const s = new Set(b.wuerfel.map((p) => p.join(',')));
    if (was === 'wuerfel') return W(s.size);
    if (was === 'aussen') return W(b.wuerfel.reduce((n, [x, y, z]) => n + [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].filter(([dx, dy, dz]) => !s.has([x + dx, y + dy, z + dz].join(','))).length, 0));
    return null;
  }
  const e = einheitDesBildes(b), teile = b.form === 'quaderbau' ? b.teile : b.form === 'quader' ? [{ x: 0, y: 0, z: 0, a: b.a, b: b.b, c: b.c }] : null;
  if (!teile) return null;
  const { V, O } = koerperAusQuadern(teile);
  if (was === 'wuerfel' || was === 'aussen') return b.raster ? zehntel(was === 'wuerfel' ? V : O) : null;
  if (!e || dimVon(e) !== 1) return null;
  return was === 'volumen' ? mal(zehntel(V), W(faktorVon(e) ** 3, 1, 3)) : was === 'oberflaeche' ? mal(zehntel(O), W(faktorVon(e) ** 2, 1, 2)) : null;
}
const KANTE = { AB: 'a', BA: 'a', BC: 'b', CB: 'b', AE: 'c', EA: 'c', DC: 'a', CD: 'a', AD: 'b', DA: 'b', BF: 'c', FB: 'c' };
export function quaderBildMaengel(b, niveau) {
  const m = [];
  if (!b || typeof b !== 'object') return ['Bild fehlt'];
  if (b.art === 'einheitentafel') {
    if (!Array.isArray(b.gruppen) || b.gruppen.length !== 2 || b.gruppen.some((g) => g.spalten !== 3 || dimVon(g.name) !== 3) || faktorVon(b.gruppen[0].name) !== 1000 * faktorVon(b.gruppen[1].name)) m.push('Einheitentafel: zwei benachbarte Volumeneinheiten mit je drei Spalten');
    if ((b.spalten ?? []).join('') !== 'HZEHZE' || b.werte?.length !== 6) m.push('Einheitentafel: Kopfzeile H, Z, E je Einheit');
    else { const erste = b.werte.findIndex((x) => x != null); if (erste < 0 || b.werte.slice(erste).some((x) => !Number.isInteger(x) || x < 0 || x > 9) || (b.werte[erste] === 0 && erste < 5)) m.push('Einheitentafel: Ziffern passen nicht'); }
    if (!['F', 'G'].includes(niveau)) m.push('Einheitentafel als Bild nur auf F und G');
    return m;
  }
  if (b.art === 'risse' || (b.art === 'koerper' && b.form === 'wuerfelbau')) return koerperBildMaengel(b);
  if (b.art === 'netz') {
    m.push(...koerperBildMaengel(b));
    if (!dimVon(b.einheit) || dimVon(b.einheit) !== 1) m.push('Netz: Einheit fehlt');
    else for (const x of b.masse ?? []) { const l = Math.hypot(x.bis[0] - x.von[0], x.bis[1] - x.von[1]); if (!gleich(qRechne(x.t), mal(zehntel(l), W(faktorVon(b.einheit), 1, 1)))) m.push(`Netz: Maß ${x.t} passt nicht zur Strecke (${l} ${b.einheit})`); }
    return m;
  }
  if (b.art !== 'koerper') return [`Bildart ${b.art} gibt es in diesem Kapitel nicht`];
  if (b.form === 'quader') {
    if (![b.a, b.b, b.c].every((x) => x > 0 && x <= 20)) m.push('Quader: Maße von 0 bis 20');
    const e = einheitDesBildes(b);
    if (!b.masse?.length || !e) m.push('Quader: Maße fehlen');
    else for (const x of b.masse) {
      const k = KANTE[`${x.von}${x.bis}`];
      if (!k) m.push(`Quader: Maß an ${x.von}${x.bis} ist keine Kante vorn`);
      else if (!gleich(qRechne(x.t), mal(zehntel(b[k]), W(faktorVon(e), 1, 1)))) m.push(`Quader: Maß ${x.t} an ${x.von}${x.bis} passt nicht zur Kante ${b[k]}`);
    }
    if (b.masse?.length === 1 && !(b.a === b.b && b.b === b.c)) m.push('Quader: nur ein Maß gibt es am Würfel');
    return m;
  }
  if (b.form === 'quaderbau') {
    if (!Array.isArray(b.teile) || !b.teile.length || b.teile.some((t) => ![t.a, t.b, t.c].every((x) => x > 0) || ![t.x, t.y, t.z].every((x) => x >= 0))) return ['Körper aus Quadern: Teile fehlen oder haben kein Maß'];
    if (koerperAusQuadern(b.teile).doppelt) m.push('Körper aus Quadern: Teile überschneiden sich');
    if (dimVon(b.einheit) !== 1) m.push('Körper aus Quadern: Einheit fehlt');
    if (b.raster && b.teile.some((t) => ![t.a, t.b, t.c, t.x, t.y, t.z].every(Number.isInteger))) m.push('Körper aus Quadern: Einheitswürfel nur bei ganzen Maßen');
    if (b.raster && b.teile.some((t) => Math.max(t.a, t.b, t.c) > 6)) m.push('Körper aus Quadern: Einheitswürfel nur bis 6 je Kante');
    if (b.zerlegt && !['F', 'G', 'M'].includes(niveau)) m.push('Körper aus Quadern: gezeigte Zerlegung nur bis M');
    for (const x of b.masse ?? []) {
      const d = x.bis.map((v, i) => Math.abs(v - x.von[i])).filter((v) => v > 1e-9);
      if (d.length !== 1) m.push(`Körper aus Quadern: Maß ${x.t} liegt nicht an einer Kante`);
      else if (dimVon(b.einheit) === 1 && !gleich(qRechne(x.t), mal(zehntel(d[0]), W(faktorVon(b.einheit), 1, 1)))) m.push(`Körper aus Quadern: Maß ${x.t} passt nicht zur Strecke ${d[0]} ${b.einheit}`);
    }
    return m;
  }
  return [`Körperform ${b.form} gibt es in diesem Kapitel nicht`];
}
// Werte, die ein Bild zeigt (für die Frage: Kommt eine Zahl der Rechnung in der Aufgabe vor?).
function bildAtome(b) {
  if (!b) return [];
  const liste = [];
  for (const x of b.masse ?? []) liste.push(...atome(x.t));
  for (const f of b.flaechen ?? []) if (f.n != null) liste.push(...atome(String(f.n)));
  if (b.titel) liste.push(...atome(b.titel));
  if (b.art === 'einheitentafel') { const n = Number(b.werte.map((x) => x ?? 0).join('')); liste.push(W(n), W(n * faktorVon(b.gruppen[1].name), 1, 3)); }
  return liste;
}

// ---------- Sprache ----------
function sprachMaengel(a) {
  const m = [], texte = [a.text, ...(a.optionen ?? []).map((o) => o.text), ...Object.values(a.hilfen ?? {}), ...(a.karten ?? [])].join('\n');
  if (/Rauminhalt/.test(texte)) m.push('Das Wort heißt „Volumen“ („Rauminhalt“ steht nur im Merkzettel)');
  if (/\b[abcVO]³|\d³|\b[abc]²/.test(texte)) m.push('Kein Hochzeichen außer in Einheiten: a · a · a statt a³');
  if (['F', 'G'].includes(a.niveau) && /\d,\d/.test(texte)) m.push('Kommazahlen gibt es erst ab M');
  if (['F', 'G'].includes(a.niveau) && /(?<![A-Za-zÄÖÜäöüß])hl(?![A-Za-zÄÖÜäöüß])|Hektoliter/.test(texte)) m.push('Hektoliter gibt es erst ab M');
  if (/(?<![A-Za-zÄÖÜäöüß])(cl|km³|km²|km)(?![A-Za-zÄÖÜäöüß²³])/.test(texte)) m.push('Einheit kommt in diesem Kapitel nicht vor (cl, km)');
  if (/\b[Rr]unde\b|gerundet|ungefähr/.test(texte)) m.push('In diesem Kapitel wird nicht gerundet');
  if (/,\d{4,}/.test(texte)) m.push('höchstens drei Stellen nach dem Komma');
  return m;
}

// ---------- Formate ----------
function fehlerMaengel(l, fv, was = 'Lösung') {
  const m = [];
  if (!Number.isInteger(l.loesung) || l.loesung < 0) m.push(`${was} ist keine natürliche Zahl`);
  const werte = (l.typischeFehler ?? []).map((f) => f.wert);
  if (new Set(werte).size !== werte.length) m.push(`${was}: typischer Fehler doppelt`);
  for (const f of l.typischeFehler ?? []) {
    if (!Number.isInteger(f.wert) || f.wert < 0) m.push(`${was}: typischer Fehler ${f.wert} ist keine natürliche Zahl`);
    if (f.wert === l.loesung) m.push(`${was}: typischer Fehler ist gleich der Lösung`);
    if (!(f.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  return m;
}
const lueckenNamen = (a) => [...[...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]), ...(a.tabelle?.zeilen ?? []).flat().filter((c) => typeof c === 'object').map((c) => c.luecke), ...(a.tabelle?.ablesen ? [a.tabelle.ablesen.luecke] : [])];
const eingesetzt = (a) => a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken?.[n]?.loesung ?? '?');
const ohneLuecken = (a) => a.text.replace(/\{\{(\w+)\}\}/g, '▢');
const glatt = (t) => lies(t).replace(/\s+/g, ' ').trim();

function formatMaengel(a, fv) {
  const m = [];
  if (a.format === 'zahl') m.push(...fehlerMaengel(a, fv));
  else if (a.format === 'groesse') {
    const d = DIM[a.groesse];
    if (!d) return ['Größenart: Länge, Fläche oder Volumen'];
    if (!ERLAUBT.includes(a.einheit) || dimVon(a.einheit) !== d) m.push(`Einheit ${a.einheit} passt nicht zur Größenart ${a.groesse}`);
    else if ((a.loesung * 1000) % faktorVon(a.einheit) !== 0) m.push(`Lösung geht in ${a.einheit} nicht mit höchstens drei Nachkommastellen auf`);
    if (!Number.isInteger(a.loesung) || a.loesung <= 0) m.push('Lösung ist keine positive ganze Zahl in der Grundeinheit');
    m.push(...fehlerMaengel({ loesung: a.loesung, typischeFehler: a.typischeFehler }, fv).filter((x) => !/natürliche Zahl$/.test(x) || /Fehler/.test(x)));
    if (a.niveau === 'F' && a.einheiten) m.push('auf F steht die Einheit fest hinter dem Feld');
    if (a.niveau !== 'F' && !a.einheiten) m.push('ab G wählt das Kind die Einheit aus einer Liste');
    if (a.einheiten) {
      if (a.einheiten.length < 3 || a.einheiten.length > 5 || new Set(a.einheiten).size !== a.einheiten.length || a.einheiten.some((e) => !ERLAUBT.includes(e))) m.push('Einheitenliste: drei bis fünf verschiedene Einheiten des Kapitels');
      if (!a.einheiten.includes(a.einheit)) m.push('Einheitenliste enthält die Einheit der Lösung nicht');
      if (!a.verlangt && !a.einheiten.some((e) => dimVon(e) !== d)) m.push('Einheitenliste: Es fehlt eine Einheit einer anderen Größenart');
      if (['F', 'G'].includes(a.niveau) && a.einheiten.includes('hl')) m.push('Hektoliter gibt es erst ab M');
    }
    if (a.verlangt != null && a.verlangt !== true) m.push('verlangt ist true oder fehlt');
    const nennt = ERLAUBT.filter((e) => new RegExp(`\\b(?:in|viele) ${NAMEN[e]}n?\\b`).test(a.text));
    if (a.verlangt && (nennt.length !== 1 || nennt[0] !== a.einheit)) m.push(`verlangte Einheit: Der Text nennt nicht genau „in ${NAMEN[a.einheit]}“`);
    if (!a.verlangt && nennt.length) m.push(`Der Text verlangt eine Einheit (${nennt.join(', ')}), aber das Kennzeichen verlangt fehlt`);
    if (a.verlangt && !a.einheiten) m.push('verlangte Einheit nur mit Einheitenliste');
  } else if (a.format === 'auswahl') {
    const richtige = a.optionen.filter((o) => o.richtig).length;
    if (a.optionen.length < 2) m.push('weniger als zwei Antworten');
    if (a.optionen.length > MAX_OPTIONEN[a.niveau] + (a.mehrfach ? 1 : 0)) m.push(`zu viele Antworten auf Niveaustufe ${a.niveau}`);
    if (!a.mehrfach && richtige !== 1) m.push('Einfachauswahl braucht genau eine richtige Antwort');
    if (a.mehrfach && (richtige < 1 || richtige === a.optionen.length)) m.push('Mehrfachauswahl: mindestens eine, aber nicht jede Antwort ist richtig');
    if (new Set(a.optionen.map((o) => glatt(o.text))).size !== a.optionen.length) m.push('Antwort doppelt');
    for (const o of a.optionen) {
      if (o.fehlvorstellung && !(o.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${o.fehlvorstellung}`);
      if (o.richtig && o.fehlvorstellung) m.push('richtige Antwort mit Fehlvorstellung');
      if (o.richtig) for (const g of qGleichungen(o.text)) if (!g.ok) m.push(`Gleichung in der richtigen Antwort stimmt nicht: ${g.ganz}`);
      if (o.bild) m.push(...quaderBildMaengel(o.bild, a.niveau).map((x) => `Bildkarte ${o.text}: ${x}`));
    }
    if (a.optionen.some((o) => o.bild) && (!a.optionen.every((o) => o.bild) || a.optionen.some((o, i) => o.text !== 'ABCDE'[i]))) m.push('Bildkarten: jede Antwort hat ein Bild und heißt A, B, C …');
  } else if (a.format === 'luecken' || a.format === 'tabelle') {
    const namen = lueckenNamen(a);
    if (!namen.length) m.push('keine Lücke');
    if (new Set(namen).size !== namen.length) m.push('Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) m.push(`Lücke ${n} hat keine Lösung`); else m.push(...fehlerMaengel(a.luecken[n], fv, `Lücke ${n}`));
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) m.push(`Lösung ${n} ohne Lücke`);
    for (const zeile of eingesetzt(a).split('\n').filter((z) => !/rechnet|behauptet|sagt|meint|schreibt/.test(z))) for (const g of qGleichungen(zeile)) if (!g.ok) m.push(`mit den Lösungen stimmt die Gleichung nicht: ${g.ganz}`);
    if (a.reihenfolgeEgal && (!Array.isArray(a.reihenfolgeEgal) || a.reihenfolgeEgal.length < 2 || a.reihenfolgeEgal.some((n) => !a.luecken?.[n]))) m.push('reihenfolgeEgal nennt Lücken der Aufgabe');
    if (a.format === 'tabelle' && a.tabelle?.art === 'einheitentafel') m.push(...tafelMaengel(a));
    else if (a.format === 'tabelle' && a.tabelle.zeilen.some((z) => z.length !== a.tabelle.kopf.length)) m.push('Tabelle: Zeile passt nicht zur Kopfzeile');
  } else if (a.format === 'ordnen') {
    if (!Array.isArray(a.karten) || !Array.isArray(a.loesung) || [...a.karten].sort().join('|') !== [...a.loesung].sort().join('|')) m.push('Ordnen: Karten und Lösung passen nicht zusammen');
    else if (a.karten.join('|') === a.loesung.join('|')) m.push('Ordnen: Die Karten liegen schon richtig');
    if ((a.loesung?.length ?? 0) < 3 || a.loesung.length > 5) m.push('Ordnen: drei bis fünf Karten');
  } else m.push(`Format ${a.format} gibt es in diesem Kapitel nicht`);
  return m;
}
// Einheitentafel zum Eintragen (F, G): zwei benachbarte Volumeneinheiten mit je drei Spalten, eine Ziffer je Feld.
function tafelMaengel(a) {
  const m = [], t = a.tabelle;
  if (!['F', 'G'].includes(a.niveau)) m.push('Einheitentafel zum Eintragen nur auf F und G');
  if (!Array.isArray(t.gruppen) || t.gruppen.length !== 2 || t.gruppen.some((g) => g.spalten !== 3 || dimVon(g.name) !== 3) || t.kopf.join('') !== 'HZEHZE') return ['Einheitentafel: zwei Volumeneinheiten mit je drei Spalten H, Z, E'];
  const klein = t.gruppen[1].name;
  if (faktorVon(t.gruppen[0].name) !== 1000 * faktorVon(klein)) m.push('Einheitentafel: Die Einheiten sind nicht benachbart');
  t.zeilen.forEach((zeile, i) => {
    const z = zeile.map((c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c === '' ? null : Number(c))), erste = z.findIndex((x) => x != null);
    if (erste < 0 || z.slice(erste).some((x) => !Number.isInteger(x) || x < 0 || x > 9) || (z[erste] === 0 && erste < 5)) { m.push(`Einheitentafel: Zeile ${i + 1} hat ein leeres Feld mitten in der Zahl, eine führende Null oder mehr als eine Ziffer im Feld`); return; }
    const wert = W(Number(z.map((x) => x ?? 0).join('')) * faktorVon(klein), 1, 3), n = (a.nachweis ?? []).filter((x) => x?.art === 'einheitentafel' && (x.zeile ?? 0) === i);
    if (n.length !== 1 || !gleich(qRechne(n[0].groesse), wert)) m.push(`Einheitentafel: Zeile ${i + 1} zeigt nicht die Größe aus dem Nachweis`);
    else if (!atome(a.text).some((x) => gleich(x, wert))) m.push(`Einheitentafel: ${n[0].groesse} steht nicht im Text`);
    if (t.ablesen && i === t.zeilen.length - 1) {
      const l = a.luecken?.[t.ablesen.luecke]?.loesung;
      if (t.ablesen.einheit !== klein || !gleich(W(l * faktorVon(klein), 1, 3), wert)) m.push('Einheitentafel: Die abgelesene Größe passt nicht zur Tafel');
    }
  });
  return m;
}

// ---------- Nachweis ----------
const polaritaet = (text) => (/^(Falsch|Nein)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Ja|Richtig)(?![a-zäöü])/.test(text) ? true : null);
// Wert einer Antwort: das Ergebnis ihrer Gleichung oder ihr erster Rechenausdruck.
function antwortWert(text) {
  const g = qGleichungen(text);
  if (g.length) return g.every((x) => x.ok) ? g[0].werte.at(-1) : null;
  const m = lies(text).match(new RegExp(`(?<![\\d,\\u00a0])${AUSDRUCK}`));
  return m ? qRechne(m[0]) : null;
}
const istKonstante = (w) => (w.dim === 0 && w.n === 1 && (w.z <= 10 || /^10+$/.test(String(w.z)))) || (w.dim > 0 && w.n === 1 && [1, 10, 100, 1000, 10000, 100000, 1000000, 1000000000, 100000000].includes(w.z));
function alleQuader(v) {
  const liste = [];
  for (let x = 1; x <= v; x++) for (let y = x; y <= v; y++) for (let z = y; z <= v; z++) if (x * y * z === v) liste.push({ k: [x, y, z], O: 2 * (x * y + x * z + y * z) });
  return liste;
}

function nachweisMaengel(a) {
  const m = [], n = a.nachweis;
  if (!Array.isArray(n) || !n.length) return ['Nachweis fehlt'];
  const bekannt = new Set(), ergebnisse = [], zahlen = new Set();
  const merke = (w) => { if (w) bekannt.add(schl(w)); };
  for (const w of [...atome(ohneLuecken(a)), ...bildAtome(a.bild), ...(a.tabelle ? [...a.tabelle.kopf, ...a.tabelle.zeilen.flat()].filter((c) => typeof c === 'string').flatMap(atome) : [])]) merke(w);
  // Werte aus den Antworten: Mit ihnen darf der Nachweis rechnen, die richtige Antwort belegen sie aber nicht.
  const ausAntworten = new Set((a.optionen ?? []).flatMap((o) => atome(o.text)).map(schl));
  const kennt = (w, mitAntworten = true) => Boolean(w) && (bekannt.has(schl(w)) || istKonstante(w) || (mitAntworten && ausAntworten.has(schl(w))));
  const ergebnis = (w) => { if (w) { ergebnisse.push(w); merke(w); if (w.n === 1) zahlen.add(w.z); } };
  const arten = new Set();
  for (const e of n) {
    if (typeof e === 'string') {
      const g = qGleichungen(e);
      if (g.length !== 1 || g[0].ganz !== lies(e)) { m.push(`Nachweis: „${e}“ ist keine Gleichung`); continue; }
      if (!g[0].ok) { m.push(`Nachweis: Gleichung stimmt nicht: ${e}`); continue; }
      for (const w of operanden(g[0].seiten[0])) if (!kennt(w)) { m.push(`Nachweis: ${e} rechnet mit einem Wert, der in der Aufgabe nicht vorkommt`); break; }
      for (const z of zahlenIn(e)) zahlen.add(z);
      for (const s of g[0].seiten) for (const w of atome(s)) merke(w);
      g[0].werte.forEach(ergebnis);
      continue;
    }
    if (!e || typeof e !== 'object') { m.push('Nachweis: unbekannter Eintrag'); continue; }
    if (!e.art && e.wert != null && e.grund) { const w = wertAus(e.wert); if (!w) m.push(`Nachweis: Hilfsgröße ${e.wert} lässt sich nicht lesen`); ergebnis(w); for (const z of zahlenIn(String(e.wert))) zahlen.add(z); arten.add('hilfsgroesse'); continue; }
    arten.add(e.art);
    switch (e.art) {
      case 'quader': {
        const k = (e.kanten ?? []).map(qRechne), w = qRechne(e.wert);
        if (k.length !== 3 || k.some((x) => !x || x.dim !== 1)) { m.push('Nachweis Quader: drei Kanten als Längen'); break; }
        if (k.some((x) => !kennt(x))) m.push(`Nachweis Quader: Kante kommt in der Aufgabe nicht vor (${e.kanten.join(', ')})`);
        const soll = e.was === 'volumen' ? mal(mal(k[0], k[1]), k[2]) : e.was === 'oberflaeche' ? mal(W(2), plus(plus(mal(k[0], k[1]), mal(k[0], k[2])), mal(k[1], k[2]))) : null;
        if (!soll || !gleich(soll, w)) m.push(`Nachweis Quader: ${e.was} ist nicht ${e.wert}`);
        ergebnis(w); for (const x of atome(e.wert)) merke(x); for (const z of zahlenIn(e.wert)) zahlen.add(z);
        break;
      }
      case 'bild': {
        const soll = bildWert(a.bild, e.was), w = wertAus(e.wert);
        if (!soll) m.push(`Nachweis Bild: Das Bild zeigt kein(e) ${e.was}`);
        else if (!gleich(soll, w)) m.push(`Nachweis Bild: ${e.was} im Bild ist nicht ${e.wert}`);
        ergebnis(w); for (const x of atome(String(e.wert))) merke(x); for (const z of zahlenIn(String(e.wert))) zahlen.add(z);
        break;
      }
      case 'wert': case 'urteil': case 'vergleich': case 'extrem': case 'einheitenart': case 'karten': case 'frei': case 'ordnen': case 'einheitentafel': break;
      case 'alleQuader': {
        const alle = alleQuader(e.volumen), min = Math.min(...alle.map((q) => q.O)), max = Math.max(...alle.map((q) => q.O)), beste = alle.filter((q) => q.O === min);
        if (!zahlenIn(a.text).includes(e.volumen)) m.push('Nachweis alle Quader: Das Volumen steht nicht im Text');
        if (e.anzahl != null && e.anzahl !== alle.length) m.push(`Nachweis alle Quader: Es gibt ${alle.length} Quader`);
        if (e.kanten && (beste.length !== 1 || beste[0].k.join() !== [...e.kanten].sort((x, y) => x - y).join())) m.push('Nachweis alle Quader: Quader mit dem kleinsten Oberflächeninhalt stimmt nicht oder ist nicht eindeutig');
        if (e.min != null && e.min !== min) m.push(`Nachweis alle Quader: kleinster Oberflächeninhalt ist ${min}`);
        if (e.max != null && e.max !== max) m.push(`Nachweis alle Quader: größter Oberflächeninhalt ist ${max}`);
        for (const z of [e.anzahl, ...(e.kanten ?? []), e.min, e.max]) if (z != null) { zahlen.add(z); ergebnis(W(z)); }
        break;
      }
      default: m.push(`Nachweis: unbekannte Art ${e.art}`);
    }
  }
  const von = (art) => n.filter((e) => e?.art === art);

  // Die Lösung muss sich aus dem Nachweis ergeben.
  if (a.format === 'groesse') { if (!ergebnisse.some((w) => gleich(w, W(a.loesung, 1, DIM[a.groesse])))) m.push('Nachweis: Die Lösung ergibt sich nicht aus dem Nachweis'); }
  else if (a.format === 'zahl') { if (!ergebnisse.some((w) => gleich(w, W(a.loesung)))) m.push('Nachweis: Die Lösung ergibt sich nicht aus dem Nachweis'); }
  else if (a.format === 'luecken' || a.format === 'tabelle') {
    const tafel = a.tabelle?.art === 'einheitentafel';
    if (tafel && !arten.has('einheitentafel')) m.push('Nachweis: Einheitentafel fehlt');
    if (!tafel) for (const [name, l] of Object.entries(a.luecken ?? {})) if (!zahlen.has(l.loesung)) m.push(`Nachweis: Lücke ${name} (${l.loesung}) kommt im Nachweis nicht vor`);
    if (a.reihenfolgeEgal && !arten.has('alleQuader')) m.push('reihenfolgeEgal braucht einen Nachweis, der die Werte als Menge prüft');
    for (const e of von('alleQuader')) {
      const l = (k) => a.luecken?.[k]?.loesung;
      if (e.kanten && [l('a'), l('b'), l('c')].sort((x, y) => x - y).join() !== [...e.kanten].sort((x, y) => x - y).join()) m.push('alle Quader: Die Lücken a, b, c nennen nicht die Kanten');
      if (e.anzahl != null && l('n') !== e.anzahl) m.push('alle Quader: Die Lücke n nennt nicht die Anzahl');
      if (e.min != null && (l('min') !== e.min || l('max') !== e.max)) m.push('alle Quader: Die Lücken min und max stimmen nicht');
    }
  } else if (a.format === 'ordnen') {
    const o = von('ordnen')[0], werte = (a.loesung ?? []).map(antwortWert);
    if (!o) m.push('Nachweis: Ordnen fehlt');
    else if (werte.some((w) => !w) || new Set(werte.map((w) => w?.dim)).size !== 1) m.push('Ordnen: Karten lassen sich nicht vergleichen');
    else for (let i = 1; i < werte.length; i++) if (!(o.richtung === 'ab' ? kleiner(werte[i], werte[i - 1]) : kleiner(werte[i - 1], werte[i]))) m.push(`Ordnen: ${a.loesung[i - 1]} und ${a.loesung[i]} stehen falsch herum oder sind gleich`);
    if (o && !new RegExp(o.richtung === 'ab' ? 'größten' : 'kleinsten').test(a.text)) m.push('Ordnen: Der Text nennt die Richtung nicht');
  } else if (a.format === 'auswahl') {
    const wahlArten = ['wert', 'urteil', 'vergleich', 'extrem', 'einheitenart', 'karten', 'frei'].filter((x) => arten.has(x));
    if (!wahlArten.length) m.push('Nachweis: Für die Auswahl fehlt ein Nachweis (Wert, Urteil, Vergleich, Extrem, Einheitenart, Karten oder frei)');
    const soll = (regel, name) => a.optionen.forEach((o) => { const r = regel(o); if (r == null) m.push(`${name}: Antwort „${glatt(o.text)}“ lässt sich nicht prüfen`); else if (r !== o.richtig) m.push(`${name}: Antwort „${glatt(o.text)}“ ist falsch eingestuft`); });
    for (const e of von('wert')) { const w = wertAus(e.wert); if (!w) { m.push('Nachweis Wert: nicht lesbar'); continue; } if (!kennt(w)) m.push(`Nachweis Wert: ${e.wert} ergibt sich nicht aus der Aufgabe`);
      soll((o) => { const v = antwortWert(o.text); return v == null ? (e.nicht ? null : false) : gleich(v, w) !== Boolean(e.nicht); }, 'Wert'); }
    for (const e of von('vergleich')) {
      const [l, r] = [qRechne(e.links), qRechne(e.rechts)];
      if (!l || !r || l.dim !== r.dim) { m.push('Nachweis Vergleich: Seiten lassen sich nicht vergleichen'); continue; }
      if (!kennt(l) || !kennt(r)) m.push(`Nachweis Vergleich: ${e.links} oder ${e.rechts} ergibt sich nicht aus der Aufgabe`);
      const text = gleich(l, r) ? e.wenn.gleich : kleiner(l, r) ? e.wenn.kleiner : e.wenn.groesser;
      if (!a.optionen.some((o) => glatt(o.text) === glatt(text))) m.push(`Vergleich: Die Antwort „${text}“ fehlt`);
      soll((o) => glatt(o.text) === glatt(text), 'Vergleich');
    }
    for (const e of von('extrem')) {
      const werte = a.optionen.map((o) => antwortWert(o.text)).filter(Boolean), ziel = werte.reduce((p, w) => (p == null || (e.was === 'kleinste' ? kleiner(w, p) : kleiner(p, w)) ? w : p), null);
      if (werte.length < 2 || werte.filter((w) => gleich(w, ziel)).length !== 1) { m.push('Extrem: nicht eindeutig'); continue; }
      soll((o) => gleich(antwortWert(o.text), ziel), 'Extrem');
    }
    for (const e of von('einheitenart')) soll((o) => { const d = dimVon(glatt(o.text)); return d == null ? null : d === DIM[e.groesse]; }, 'Einheitenart');
    for (const e of von('karten')) {
      const werte = a.optionen.map((o) => bildWert(o.bild, e.was));
      if (werte.some((w) => !w)) { m.push(`Karten: Ein Bild zeigt kein(e) ${e.was}`); continue; }
      const ziel = e.regel === 'gleich' ? W(e.wert) : werte.reduce((p, w) => (p == null || (e.regel === 'min' ? kleiner(w, p) : kleiner(p, w)) ? w : p), null);
      if (werte.filter((w) => gleich(w, ziel)).length !== 1) { m.push('Karten: nicht eindeutig'); continue; }
      if (e.regel === 'gleich' && !atome(a.text).some((w) => w.n === 1 && w.z === e.wert)) m.push('Karten: Der gesuchte Wert steht nicht im Text');
      if (!new RegExp({ max: 'größten|meisten', min: 'kleinsten|wenigsten', gleich: '.' }[e.regel]).test(a.text)) m.push('Karten: Der Text passt nicht zur Regel');
      a.optionen.forEach((o, i) => { if (gleich(werte[i], ziel) !== o.richtig) m.push(`Karten: Antwort ${o.text} ist falsch eingestuft`); });
    }
    for (const e of von('urteil')) {
      const r = a.optionen.find((o) => o.richtig);
      if (r && polaritaet(r.text) !== e.stimmt) m.push('Urteil: Die richtige Antwort beginnt nicht mit dem passenden Urteil');
      if (!/Beurteile|Kreuze die Erklärung/.test(a.text)) m.push('Urteil: Der Auftrag heißt „Beurteile …“');
    }
    // Die richtige Antwort nennt nur Werte, die sich aus der Aufgabe ergeben (außer wenn die Antworten selbst die Werte sind).
    if (!['wert', 'extrem', 'einheitenart', 'karten'].some((x) => arten.has(x))) for (const o of a.optionen.filter((x) => x.richtig)) for (const w of operanden(o.text)) if (!kennt(w, false)) { m.push(`richtige Antwort nennt einen Wert, der sich nicht aus dem Nachweis ergibt („${glatt(o.text).slice(0, 60)}“)`); break; }
  }
  return m;
}

// ---------- Eine Aufgabe ----------
export function pruefeQuaderAufgabe(a, fehlvorstellungen) {
  const m = [];
  const f = formatMaengel(a, fehlvorstellungen);
  m.push(...f);
  if (f.some((x) => /^Format|Größenart/.test(x))) return m;
  m.push(...sprachMaengel(a));
  if (a.bild) m.push(...quaderBildMaengel(a.bild, a.niveau).map((x) => `Bild: ${x}`));
  if (a.tippBild && (a.tippBild.art !== 'einheitentafel' || a.niveau !== 'G' || quaderBildMaengel(a.tippBild, a.niveau).length)) m.push('Bild im Tipp: nur die Einheitentafel auf G');
  if (a.bild && a.optionen?.some((o) => o.bild)) m.push('Bildkarten brauchen kein weiteres Bild');
  m.push(...nachweisMaengel(a));
  return m;
}
