// Prüfprogramm für Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050).
// Es rechnet jede Aufgabe unabhängig vom Erzeuger nach: Wertetabellen und Dreisatztabellen gegen ihre Regel (proportional: gleicher Quotient,
// antiproportional: gleiches Produkt), den Dreisatz aus dem Wertepaar im Text, Schaubilder Punkt für Punkt, Einordnungen aus den Wertepaaren.
// Gerechnet wird mit Brüchen aus ganzen Zahlen, nie mit Kommazahlen des Rechners.

const NIVEAUS = ['F', 'G', 'M', 'E'];
const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };

// ---------- Rechnen ----------
const ggT = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (z, n = 1) => { if (n < 0) { z = -z; n = -n; } const d = ggT(z, n); return { z: z / d, n: n / d }; };
const gleich = (x, y) => Boolean(x && y) && x.z === y.z && x.n === y.n;
const plus = (x, y, v = 1) => Q(x.z * y.n + v * y.z * x.n, x.n * y.n);
const mal = (x, y) => Q(x.z * y.z, x.n * y.n);
const durch = (x, y) => (y.z === 0 ? null : Q(x.z * y.n, x.n * y.z));
const NUM = '(?:\\d{1,3}(?:\\u00a0\\d{3})+|\\d+)(?:,\\d+)?';
const UNIT = '(?:€|kg|g|km\\/h|km|cm|m|ml|l|h|min|%)(?![A-Za-zÄÖÜäöüß])';
// Zahl aus einem Text („1,50“, „12 500“) oder einer Zahl. null, wenn es keine ist.
export function zahlWert(x) {
  if (typeof x === 'number') return Number.isInteger(x) ? Q(x) : zahlWert(String(x).replace('.', ','));
  const m = String(x ?? '').trim().match(new RegExp(`^(${NUM})$`));
  if (!m) return null;
  const [gz, k = ''] = m[1].replace(/ /g, '').split(',');
  return Q(Number(gz + k), 10 ** k.length);
}
// Die erste Zahl eines Textes mit Einheit („4 kg“, „1,50 €“).
const ersteZahl = (text) => { const m = String(text ?? '').match(new RegExp(NUM)); return m ? zahlWert(m[0]) : null; };
const alleZahlen = (text) => [...String(text ?? '').matchAll(new RegExp(`(?<![\\d,])${NUM}`, 'g'))].map((m) => zahlWert(m[0])).filter(Boolean);
const schl = (q) => `${q.z}/${q.n}`;
const zeige = (q) => (q.n === 1 ? String(q.z) : (q.z / q.n).toString().replace('.', ','));

// Rechnet einen Ausdruck wie „6 € : 4“ oder „(3 + 2) · 1,50 €“. Einheiten werden überlesen.
export function zRechne(text) {
  const tk = String(text).trim().match(new RegExp(`${NUM}|${UNIT}|[+−·:()]|\\S+`, 'g')) ?? [];
  const teile = tk.filter((x) => !new RegExp(`^${UNIT}$`).test(x));
  let i = 0;
  const istZahl = (x) => x != null && new RegExp(`^${NUM}$`).test(x);
  const faktor = () => { if (teile[i] === '(') { i++; const w = summe(); if (teile[i] !== ')') throw new Error('Klammer'); i++; return w; } if (!istZahl(teile[i])) throw new Error('Zahl'); return zahlWert(teile[i++]); };
  const produkt = () => { let w = faktor(); while (teile[i] === '·' || teile[i] === ':') { const op = teile[i++], r = faktor(); w = op === '·' ? mal(w, r) : durch(w, r); if (!w) throw new Error('durch 0'); } return w; };
  function summe() { let w = produkt(); while (teile[i] === '+' || teile[i] === '−') { const op = teile[i++]; w = plus(w, produkt(), op === '+' ? 1 : -1); } return w; }
  try { const w = summe(); return i === teile.length ? w : null; } catch { return null; }
}
const GROESSE = `${NUM}(?: ${UNIT})?`;
const TERM = `\\(*${GROESSE}\\)*`;
const AUSDRUCK = `${TERM}(?: [+−·:] ${TERM})*`;
const GLEICHUNG = new RegExp(`(?<![\\d,\\u00a0(])(${AUSDRUCK})((?: = ${AUSDRUCK})+)(?![\\d,\\u00a0]| (?:${UNIT}|[+−·:=] ))`, 'g');
// Alle Gleichungen eines Textes: „6 € : 4 = 1,50 €“, „3 · 8 = 24“.
export function zGleichungen(text) {
  const tx = String(text ?? '').replace(/ (?=\D)/g, ' '), liste = [];
  for (const m of tx.matchAll(GLEICHUNG)) {
    if (/ [+−·:] $/.test(tx.slice(0, m.index))) continue; // Teil eines Ausdrucks mit Buchstaben („x · 3 = …“)
    const seiten = [m[1], ...m[2].split(' = ').slice(1)], werte = seiten.map(zRechne);
    liste.push({ ganz: m[0], seiten, werte, groesse: true, rest: null, ok: werte.every((w) => w && gleich(w, werte[0])), danach: tx.slice(m.index + m[0].length, m.index + m[0].length + 1) });
  }
  return liste;
}

// ---------- Zuordnungen ----------
// Wie sind die Paare zugeordnet? 'prop' (gleicher Quotient), 'anti' (gleiches Produkt), sonst 'keines'. Mindestens zwei Paare mit x > 0.
export function ordneEin(paare) {
  const p = paare.filter(([x]) => x.z !== 0);
  if (p.length < 2) return null;
  if (p.every(([x, y]) => gleich(durch(y, x), durch(p[0][1], p[0][0]))) && paare.every(([x, y]) => x.z !== 0 || y.z === 0)) return 'prop';
  if (p.length === paare.length && p.every(([x, y]) => gleich(mal(x, y), mal(p[0][0], p[0][1])))) return 'anti';
  return 'keines';
}
const paarWerte = (paare) => paare.map((p) => p.map(zahlWert));
const loesungWert = (l) => zahlWert(l);

// ---------- Tabellen ----------
const zellWert = (a, c) => (typeof c === 'object' && c !== null ? loesungWert(a.luecken?.[c.luecke]?.loesung) : ersteZahl(c));
// Die Wertepaare einer Wertetabelle (Spalten) oder einer Dreisatztabelle (Zeilen), Lücken mit ihrer Lösung.
function tabellenPaare(a, tab = a.tabelle) {
  if (tab.art === 'werte' || !tab.art) return tab.zeilen[0].slice(1).map((c, i) => [zellWert(a, c), zellWert(a, tab.zeilen[1][i + 1])]);
  return tab.zeilen.map((z) => [zellWert(a, z[0]), zellWert(a, z[1])]);
}
function tabellenMaengel(a) {
  const m = [], tab = a.tabelle;
  if (tab.art === 'werte') {
    if (tab.zeilen?.length !== 2 || tab.zeilen[0].length !== tab.zeilen[1].length || tab.zeilen[0].length < 3) return ['Wertetabelle: zwei gleich lange Zeilen mit mindestens zwei Wertepaaren'];
    if (tab.zeilen.some((z) => typeof z[0] !== 'string' || !z[0].trim())) m.push('Wertetabelle: Jede Zeile beginnt mit dem Namen der Größe');
    if (tab.zeilen[0].length > 8) m.push('Wertetabelle: höchstens sieben Wertepaare');
  } else if (tab.art === 'dreisatz') {
    if (tab.kopf?.length !== 2 || tab.zeilen?.length !== 3 || tab.zeilen.some((z) => z.length !== 2) || tab.pfeile?.length !== 2) return ['Dreisatztabelle: zwei Spalten, drei Zeilen, zwei Rechenpfeile'];
  } else return [`Tabelle der Art ${tab.art} gibt es in diesem Kapitel nicht`];
  if (tabellenPaare(a).flat().some((w) => !w)) m.push('Tabelle: Ein Wert lässt sich nicht lesen');
  return m;
}
// Rechenpfeile einer Dreisatztabelle (als Aufgabe oder als Bild): Sie führen von Zeile zu Zeile, links wie rechts.
function pfeilMaengel(a, tab, regel, fehlerbild = false) {
  const m = [], paare = tabellenPaare(a, tab);
  if (paare.flat().some((w) => !w)) return ['Dreisatztabelle: Ein Wert lässt sich nicht lesen'];
  const lies = (p) => { if (p == null) return null; const [zeichen, zahl] = typeof p === 'object' ? [p.zeichen, loesungWert(a.luecken?.[p.luecke]?.loesung)] : [String(p).trim().slice(0, 1), ersteZahl(p)]; return zahl && [':', '·'].includes(zeichen) ? { zeichen, zahl } : false; };
  const wende = (w, p) => (p.zeichen === ':' ? durch(w, p.zahl) : mal(w, p.zahl));
  tab.pfeile.forEach((pf, j) => {
    const l = lies(pf?.links), r = lies(pf?.rechts);
    if (l === false || r === false) { m.push(`Rechenpfeil ${j + 1} lässt sich nicht lesen`); return; }
    if (fehlerbild) return;
    if (l && !gleich(wende(paare[j][0], l), paare[j + 1][0])) m.push(`Rechenpfeil ${j + 1} links führt nicht zur nächsten Zeile`);
    if (r && !gleich(wende(paare[j][1], r), paare[j + 1][1])) m.push(`Rechenpfeil ${j + 1} rechts führt nicht zur nächsten Zeile`);
    if (l && r && (!gleich(l.zahl, r.zahl) || (regel === 'prop') !== (l.zeichen === r.zeichen))) m.push(`Rechenpfeil ${j + 1}: ${regel === 'prop' ? 'links und rechts dieselbe Rechnung' : 'rechts die Gegenrechnung mit derselben Zahl'}`);
  });
  return m;
}
function folgtRegel(paare, regel) {
  if (paare.flat().some((w) => !w)) return false;
  if (regel === 'prop' || regel === 'anti') return ordneEin(paare) === regel;
  if (regel && typeof regel === 'object') { const mm = zahlWert(regel.m), b = zahlWert(regel.b ?? 0); return Boolean(mm && b) && paare.every(([x, y]) => gleich(plus(b, mal(mm, x), regel.fallend ? -1 : 1), y)); }
  return false;
}

// ---------- Schaubild ----------
const alsBruch = (zahl) => { const s = Number(zahl).toFixed(6).replace(/0+$/, '').replace(/\.$/, ''); return zahlWert(s.replace('.', ',')); };
const schaubildVon = (a) => (a.format === 'gitter' ? a.gitter : a.bild?.art === 'gitter' ? a.bild : null);
function schaubildMaengel(b, niveau) {
  const m = [], sk = b.skala;
  if (!sk || !b.achsen) return ['Schaubild ohne Achsen und Einteilung'];
  if (!Number.isInteger(b.b) || !Number.isInteger(b.h) || b.b < 3 || b.h < 3 || b.b > 14 || b.h > 14) m.push('Schaubild: 3 bis 14 Kästchen breit und hoch');
  for (const [n, s] of Object.entries(sk)) {
    if (!s.name?.trim() || !(s.schritt > 0)) m.push(`Achse ${n}: Name oder Einteilung fehlt`);
    else if (!/ in \S+$|^Anzahl |^Alter|^Uhrzeit|^Tag$|^Monat$/.test(s.name)) m.push(`Achse ${n}: Der Name „${s.name}“ nennt keine Einheit`);
    if (niveau === 'F' && !Number.isInteger(s.schritt)) m.push(`Achse ${n}: auf F nur ganze Schritte`);
    // Einteilung wie vereinbart: 1, 2, 5, 10 und ihre Zehnfachen, dazu 0,5 (ADR 0050).
    if (s.schritt > 0 && ![0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].includes(s.schritt)) m.push(`Achse ${n}: Einteilung ${s.schritt} ist nicht 1, 2, 5, 10 (oder ein Zehnfaches) oder 0,5`);
    if (!Number.isInteger(s.jede ?? 1) || (s.jede ?? 1) < 1) m.push(`Achse ${n}: Beschriftung`);
    // Die Beschriftung zeigt jeden Wert genau (keine abgeschnittenen Stellen).
    const st = s.stellen ?? 0; for (let i = 0; i <= Math.max(b.b, b.h); i += s.jede ?? 1) if (Math.abs(Number((i * s.schritt).toFixed(st)) - i * s.schritt) > 1e-9) { m.push(`Achse ${n}: Die Beschriftung schneidet Stellen ab`); break; }
  }
  for (const p of b.punkte ?? []) if (!Number.isInteger(p.x) || !Number.isInteger(p.y) || p.x < 0 || p.y < 0 || p.x > b.b || p.y > b.h) m.push(`Schaubild: Punkt (${p.x}|${p.y}) liegt nicht auf einem Gitterpunkt im Bild`);
  for (const z of b.zuege ?? []) {
    if (!Array.isArray(z.punkte) || z.punkte.length < 2) { m.push('Schaubild: Linie mit weniger als zwei Punkten'); continue; }
    if (z.punkte.some(([x, y]) => !(x >= -1e-9 && y >= -1e-9 && x <= b.b + 1e-9 && y <= b.h + 1e-9))) m.push('Schaubild: Die Linie verlässt das Bild');
    if (z.punkte.some(([x], i) => i > 0 && x <= z.punkte[i - 1][0])) m.push('Schaubild: Die Linie läuft nicht von links nach rechts');
  }
  return m;
}
// Liegt der Punkt (in Kästchen) auf einem eingezeichneten Punkt oder auf einer Linie des Schaubilds?
function imBild(b, cx, cy, zug = null) {
  if (zug == null && (b.punkte ?? []).some((p) => Math.abs(p.x - cx) < 1e-9 && Math.abs(p.y - cy) < 1e-9)) return true;
  const zuege = zug == null ? b.zuege ?? [] : [b.zuege?.[zug]].filter(Boolean);
  return zuege.some((z) => z.punkte.some(([x0, y0], i) => { if (i === 0) return Math.abs(x0 - cx) < 1e-9 && Math.abs(y0 - cy) < 1e-9; const [x1, y1] = z.punkte[i - 1]; return cx >= x1 - 1e-9 && cx <= x0 + 1e-9 && Math.abs(y1 + ((y0 - y1) * (cx - x1)) / (x0 - x1) - cy) < 1e-6; }));
}
const kaestchen = (b, x, y) => { const sx = alsBruch(b.skala.x.schritt), sy = alsBruch(b.skala.y.schritt), cx = durch(x, sx), cy = durch(y, sy); return [cx.z / cx.n, cy.z / cy.n, cx.n === 1 && cy.n === 1]; };
// Was zeigt ein Schaubild? 'prop': Punkte oder Gerade durch den Nullpunkt. 'anti': Produkt gleich. 'gerade': Gerade, die nicht durch den Nullpunkt geht
// (steigend oder fallend). 'sonst': alles andere.
export function schaubildArt(b) {
  const sx = b.skala.x.schritt, sy = b.skala.y.schritt, nah = (u, v) => Math.abs(u - v) <= 1e-6 * Math.max(1, Math.abs(u), Math.abs(v));
  const alle = [...(b.punkte ?? []).map((p) => [p.x * sx, p.y * sy]), ...(b.zuege ?? []).flatMap((z) => z.punkte.map(([x, y]) => [x * sx, y * sy]))];
  const pos = alle.filter(([x]) => x > 1e-9);
  if ((b.zuege ?? []).length > 1 || ((b.zuege ?? []).length === 1 && (b.punkte ?? []).length)) return 'sonst';
  if ((b.zuege ?? []).length === 1) { // eine Linie: Gerade durch den Nullpunkt, andere Gerade, Kurve mit gleichem Produkt oder etwas anderes
    const st = (p, q) => (q[1] - p[1]) / (q[0] - p[0]), gerade = alle.every((p, i) => i === 0 || nah(st(alle[0], p), st(alle[0], alle[1])));
    if (gerade) return nah(alle[0][0], 0) && nah(alle[0][1], 0) && alle[1][1] > 0 ? 'prop' : 'gerade';
    return pos.length === alle.length && pos.every(([x, y]) => nah(x * y, pos[0][0] * pos[0][1])) ? 'anti' : 'sonst';
  }
  if (pos.length < 2) return 'sonst';
  const durchNull = alle.every(([x, y]) => x > 1e-9 || nah(y, 0));
  if (pos.every(([x, y]) => nah(y / x, pos[0][1] / pos[0][0])) && durchNull) return 'prop';
  if (pos.length === alle.length && pos.every(([x, y]) => nah(x * y, pos[0][0] * pos[0][1]))) return 'anti';
  const steig = (p, q) => (q[1] - p[1]) / (q[0] - p[0]);
  if (alle.length >= 2 && alle.every((p, i) => i === 0 || nah(steig(alle[0], p), steig(alle[0], alle[1])))) return 'gerade';
  return 'sonst';
}

// ---------- Sprache ----------
function sprachMaengel(a) {
  const m = [], texte = [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.nachfrage ? [a.nachfrage.text, ...a.nachfrage.optionen.map((o) => o.text)] : []), ...Object.values(a.hilfen ?? {})].join('\n');
  // Alle Zahlen, die Bilder und Tabellen zeigen: Texte in den Zellen und die Beschriftung der Achsen.
  const teile = [], sammle = (x) => { if (typeof x === 'string') teile.push(x); else if (Array.isArray(x)) x.forEach(sammle); else if (x && typeof x === 'object') { if (x.skala) for (const [n, sk] of Object.entries(x.skala)) for (let i = 0; i <= (n === 'x' ? x.b : x.h); i += sk.jede ?? 1) teile.push((i * sk.schritt).toFixed(sk.stellen ?? 0).replace('.', ',')); for (const [k, v] of Object.entries(x)) if (!['punkte', 'zuege', 'skala'].includes(k)) sammle(v); } };
  sammle([a.bild, a.tabelle, a.format === 'gitter' ? a.gitter : null, ...(a.optionen ?? []).map((o) => o.bild)]);
  const bilder = teile.join('\n');
  if (/Ursprung/.test(texte)) m.push('Der Punkt (0|0) heißt „Nullpunkt“ („Ursprung“ steht nur im Merkzettel)');
  if (/Proportionalitätsfaktor|\bGraph|Funktion|umgekehrt proportional|indirekt proportional/.test(texte)) m.push('Wort kommt in diesem Kapitel nicht vor (Proportionalitätsfaktor, Graph, Funktion, umgekehrt proportional)');
  if (/antiproportional/i.test(texte) && !/^6\.7\.[78]-/.test(a.lernziel)) m.push('„antiproportional“ gibt es nur in 7.7 und 7.8');
  if (/\b[Rr]unde\b|gerundet|ungefähr/.test(texte)) m.push('In diesem Kapitel wird nicht gerundet');
  if (/,\d{4,}/.test(texte)) m.push('höchstens drei Stellen nach dem Komma');
  // F: ganze Zahlen, Geld auch mit ,50. G: Geld mit Cent (zwei Stellen), sonst höchstens eine Stelle.
  if (a.niveau === 'F' && /\d,(?!50(?!\d))\d/.test(`${texte}\n${bilder}`)) m.push('auf F nur ganze Zahlen und Geld mit ,50');
  if (a.niveau === 'G' && /\d,\d{3}/.test(`${texte}\n${bilder}`)) m.push('auf G höchstens zwei Stellen nach dem Komma');
  if (/\S→|→\S/.test(texte)) m.push('Der Zuordnungspfeil steht zwischen zwei Leerzeichen');
  return m;
}

// ---------- Formate ----------
const loesungOk = (x) => (Number.isInteger(x) && x >= 0) || (typeof x === 'string' && /^\d+,\d{1,3}$/.test(x));
function fehlerMaengel(l, fv, was = 'Lösung') {
  const m = [];
  if (!loesungOk(l.loesung)) m.push(`${was} ist keine Zahl mit höchstens drei Stellen nach dem Komma: ${l.loesung}`);
  const lw = loesungWert(l.loesung), werte = (l.typischeFehler ?? []).map((f) => zahlWert(f.wert));
  if (werte.some((w) => !w)) m.push(`${was}: typischer Fehler ist keine Zahl`);
  else if (new Set(werte.map(schl)).size !== werte.length) m.push(`${was}: typischer Fehler doppelt`);
  for (const f of l.typischeFehler ?? []) {
    if (lw && gleich(zahlWert(f.wert), lw)) m.push(`${was}: typischer Fehler ist gleich der Lösung`);
    if (!(f.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  return m;
}
const lueckenNamen = (a) => [...[...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]), ...(a.tabelle?.zeilen ?? []).flat().filter((c) => typeof c === 'object' && c !== null).map((c) => c.luecke),
  ...(a.tabelle?.pfeile ?? []).flatMap((p) => [p?.links, p?.rechts]).filter((c) => typeof c === 'object' && c !== null).map((c) => c.luecke)];
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Ja|Richtig)(?![a-zäöü])/.test(text) ? true : null);

function formatMaengel(a, fv) {
  const m = [];
  if (!['zahl', 'luecken', 'tabelle', 'auswahl', 'gitter'].includes(a.format)) return [`Format ${a.format} gibt es in diesem Kapitel nicht`];
  if (a.format === 'zahl') { m.push(...fehlerMaengel(a, fv)); if (a.einheit === '€' && typeof a.loesung === 'string' && !/,\d\d$/.test(a.loesung)) m.push('Geld hat zwei Stellen nach dem Komma'); }
  if (a.format === 'luecken' || a.format === 'tabelle') {
    const namen = lueckenNamen(a), keys = Object.keys(a.luecken ?? {});
    if (!keys.length) m.push('Format: keine Lücke');
    if (new Set(namen).size !== namen.length || namen.length !== keys.length || namen.some((n) => !keys.includes(n))) m.push('Format: Lücken im Text oder in der Tabelle passen nicht zu den Lösungen');
    for (const [n, l] of Object.entries(a.luecken ?? {})) m.push(...fehlerMaengel(l, fv, `Lücke ${n}`));
    if (a.format === 'tabelle') m.push(...tabellenMaengel(a));
  }
  if (a.format === 'auswahl') {
    const o = a.optionen ?? [], richtige = o.filter((x) => x.richtig).length;
    if (o.length < 2 || o.length > MAX_OPTIONEN[a.niveau]) m.push(`Format: ${o.length} Antworten (2 bis ${MAX_OPTIONEN[a.niveau]})`);
    if (a.mehrfach ? richtige < 1 || richtige === o.length : richtige !== 1) m.push('Format: Anzahl der richtigen Antworten');
    if (new Set(o.map((x) => x.text)).size !== o.length) m.push('Format: Antwort doppelt');
    for (const x of o) if (x.fehlvorstellung && (x.richtig || !(x.fehlvorstellung in fv))) m.push(`Antwort „${x.text}“: Fehlvorstellung unbekannt oder an der richtigen Antwort`);
    if (o.some((x) => x.bild) && !o.every((x) => x.bild)) m.push('Bildkarten: Jede Antwort braucht ein Bild');
    if (o.some((x) => x.bild) && a.bild) m.push('Bildkarten brauchen kein weiteres Bild');
    if (o.some((x) => x.bild?.skala && (x.bild.b > 8 || x.bild.h > 8))) m.push('Bildkarten: Ein Schaubild auf einer Karte hat höchstens 8 Kästchen je Achse (sonst wird die Beschriftung zu klein)');
  }
  if (a.format === 'gitter') {
    const b = a.gitter, l = a.loesung ?? [];
    if (a.eingabe !== 'punkte' || !b?.skala) return ['Format: Im Schaubild werden Punkte eingetragen'];
    if (!l.length || l.some(([x, y]) => !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x > b.b || y > b.h)) m.push('Lösung: Punkt liegt nicht auf einem Gitterpunkt im Bild');
    if (new Set(l.map((p) => p.join())).size !== l.length) m.push('Lösung: Punkt doppelt');
    const soll = { F: [2, 2], G: [3, 3], M: [3, 4], E: [3, 5] }[a.niveau]; if (l.length < soll[0] || l.length > soll[1]) m.push(`Punkte eintragen: ${l.length} Punkte auf ${a.niveau}`);
    for (const f of a.typischeFehler ?? []) if (!(f.fehlvorstellung in fv) || !Array.isArray(f.punkte)) m.push('typischer Fehler im Schaubild ohne Punkte oder Fehlvorstellung');
    if ((b.punkte ?? []).some((p) => l.some((q) => q[0] === p.x && q[1] === p.y))) m.push('Lösung: Ein Punkt ist schon eingezeichnet');
    if (a.nachfrage) { const o = a.nachfrage.optionen ?? []; if (!a.nachfrage.text?.trim() || o.length < 2 || o.filter((x) => x.richtig).length !== 1) m.push('Nachfrage: Text und genau eine richtige Antwort');
      for (const x of o) if (x.fehlvorstellung && !(x.fehlvorstellung in fv)) m.push('Nachfrage: unbekannte Fehlvorstellung'); }
    if (a.niveau === 'F' && a.nachfrage) m.push('Die Nachfrage zum Schaubild gibt es erst ab G');
  }
  return m;
}

// ---------- Nachweise ----------
// Alle Zahlen, die die Aufgabe zeigt: im Text, im Bild, in der Tabelle, an den Achsen.
function gezeigt(a) {
  const liste = [...alleZahlen(a.text), ...(a.optionen ?? []).flatMap((o) => alleZahlen(o.text))];
  const ausTab = (tab) => { for (const c of [...(tab.kopf ?? []), ...tab.zeilen.flat(), ...(tab.pfeile ?? []).flatMap((p) => [p?.links, p?.rechts])]) if (typeof c === 'string') liste.push(...alleZahlen(c)); };
  if (a.tabelle) ausTab(a.tabelle);
  const ausBild = (b) => { if (!b) return; if (b.art === 'wertetabellen') b.tabellen.forEach(ausTab); if (b.art === 'dreisatz') ausTab(b);
    if (b.skala) { for (const p of b.punkte ?? []) liste.push(alsBruch(p.x * b.skala.x.schritt), alsBruch(p.y * b.skala.y.schritt)); for (let i = 0; i <= b.b; i++) liste.push(alsBruch(i * b.skala.x.schritt)); for (let i = 0; i <= b.h; i++) liste.push(alsBruch(i * b.skala.y.schritt)); } };
  ausBild(a.bild); ausBild(a.format === 'gitter' ? a.gitter : null);
  return new Set(liste.map(schl));
}
function nachweisMaengel(a) {
  const m = [], M = (x) => m.push(x), nachweis = a.nachweis ?? [];
  if (!nachweis.length) return ['Nachweis fehlt'];
  const bekannt = gezeigt(a), kennt = (x) => { const w = zahlWert(x); return Boolean(w) && bekannt.has(schl(w)); };
  const optionen = a.optionen ?? [], richtige = optionen.filter((o) => o.richtig);
  // Welche Zahl verlangt die Aufgabe am Ende? (Zahl, einzige Lücke im Lückentext)
  const ziel = a.format === 'zahl' ? loesungWert(a.loesung) : null;
  let belegt = false; // Ist die Lösung nachgerechnet?
  const trifft = (w, n) => {
    if (n.luecke) { if (!gleich(w, loesungWert(a.luecken?.[n.luecke]?.loesung))) M(`Nachweis ${n.art}: Lücke ${n.luecke} ist ${a.luecken?.[n.luecke]?.loesung}, nachgerechnet ${zeige(w)}`); else belegt = true; return; }
    if (n.hilf) return;
    if (ziel) { if (gleich(w, ziel)) belegt = true; else if (!n.zwischen) M(`Nachweis ${n.art}: Die Lösung ist ${a.loesung}, nachgerechnet ${zeige(w)}`); return; }
    if (a.format === 'auswahl' && !n.zwischen) {
      const hat = (o) => alleZahlen(o.text).some((z) => gleich(z, w));
      if (n.nicht) { if (richtige.some(hat)) M(`Nachweis ${n.art}: Die richtige Antwort nennt den falschen Wert ${zeige(w)}`); else belegt = true; return; }
      if (!richtige.length || !richtige.every(hat)) M(`Nachweis ${n.art}: Die richtige Antwort nennt ${zeige(w)} nicht`); else belegt = true;
    }
  };
  for (const n of nachweis) {
    if (typeof n === 'string') {
      const g = zGleichungen(n);
      if (g.length !== 1 || g[0].ganz.length < n.trim().length - 1) { M(`Nachweis: „${n}“ ist keine Gleichung`); continue; }
      if (!g[0].ok) M(`Nachweis: Gleichung stimmt nicht: ${n}`);
      continue;
    }
    switch (n?.art) {
      case 'tabelle': {
        if (a.format !== 'tabelle') { M('Nachweis tabelle: Die Aufgabe hat keine Tabelle'); break; }
        const paare = tabellenPaare(a);
        if (n.regel === 'bild') { const b = schaubildVon(a); if (!b) { M('Nachweis tabelle: Das Schaubild fehlt'); break; }
          for (const [x, y] of paare) { if (!x || !y) continue; const [cx, cy] = kaestchen(b, x, y); if (!imBild(b, cx, cy)) M(`Nachweis tabelle: (${zeige(x)}|${zeige(y)}) steht nicht im Schaubild`); } }
        else if (!folgtRegel(paare, n.regel)) M(`Nachweis tabelle: Die Tabelle folgt nicht der Regel ${JSON.stringify(n.regel)}`);
        if (a.tabelle.art === 'dreisatz') m.push(...pfeilMaengel(a, a.tabelle, n.regel));
        belegt = true; break;
      }
      case 'dreisatz': {
        const [x0, y0] = paarWerte([n.von])[0], x = zahlWert(n.x), y = zahlWert(n.y);
        if (!x0 || !y0 || !x || !y || !['prop', 'anti'].includes(n.regel)) { M('Nachweis dreisatz: Werte fehlen'); break; }
        if (!n.frei && [n.von[0], n.von[1], n.gesucht === 'x' ? n.y : n.x].some((w) => !kennt(w))) M(`Nachweis dreisatz: ${n.von.join(' → ')} oder ${n.gesucht === 'x' ? n.y : n.x} steht nicht in der Aufgabe`);
        const soll = n.regel === 'prop' ? mal(durch(y0, x0), x) : durch(mal(x0, y0), x);
        if (!gleich(soll, y)) { M(`Nachweis dreisatz: ${n.von.join(' → ')}, also ${n.x} → ${zeige(soll)}, nicht ${n.y}`); break; }
        trifft(n.gesucht === 'x' ? x : y, n); break;
      }
      case 'einordnung': {
        let paare;
        if (n.regel) {
          const r = n.regel, xs = [1, 2, 3, 4].map((v) => Q(v));
          for (const w of [r.m, r.b, r.k].filter((v) => v != null)) if (!kennt(w) && !n.frei) M(`Nachweis einordnung: ${w} steht nicht in der Aufgabe`);
          paare = r.art === 'linear' ? xs.map((x) => [x, plus(mal(zahlWert(r.m), x), zahlWert(r.b ?? 0))]) : r.art === 'anti' ? xs.map((x) => [x, durch(zahlWert(r.k), x)]) : r.art === 'quadrat' ? xs.map((x) => [x, mal(x, x)]) : r.art === 'fallend' ? xs.map((x) => [x, plus(zahlWert(r.b), mal(zahlWert(r.m), x), -1)]) : null;
          if (!paare) { M('Nachweis einordnung: unbekannte Regel'); break; }
        } else {
          paare = paarWerte(n.paare ?? []);
          if (paare.flat().some((w) => !w)) { M('Nachweis einordnung: Wertepaare lassen sich nicht lesen'); break; }
          if (!n.frei) for (const w of n.paare.flat()) if (!kennt(w)) { M(`Nachweis einordnung: ${w} steht nicht in der Aufgabe`); break; }
        }
        const ist = ordneEin(paare);
        if (n.ist && n.ist !== ist) M(`Nachweis einordnung: Die Paare sind ${ist}, nicht ${n.ist}`);
        if (n.wenn) { const soll = n.wenn[ist]; if (soll == null) M(`Nachweis einordnung: Für ${ist} ist keine Antwort genannt`); else if (richtige.length !== 1 || richtige[0].text !== soll) M(`Nachweis einordnung: Die Paare sind ${ist}, richtig wäre „${soll}“`); else belegt = true; }
        if (n.teil != null) belegt = true;
        break;
      }
      case 'ablesen': {
        const b = n.karte != null ? optionen.find((o) => o.text === n.karte)?.bild : schaubildVon(a), x = zahlWert(n.x), y = zahlWert(n.y);
        if (!b?.skala || !x || !y) { M('Nachweis ablesen: Schaubild oder Werte fehlen'); break; }
        const [cx, cy, glatt] = kaestchen(b, x, y);
        if (!glatt) M(`Nachweis ablesen: (${n.x}|${n.y}) liegt nicht auf zwei Gitterlinien`);
        if (!imBild(b, cx, cy, n.zug ?? null)) M(`Nachweis ablesen: (${n.x}|${n.y}) liegt nicht auf der Linie und ist kein eingezeichneter Punkt`);
        else trifft(n.gesucht === 'x' ? x : y, n);
        break;
      }
      case 'punkte': {
        if (a.format !== 'gitter') { M('Nachweis punkte: Die Aufgabe ist kein Schaubild zum Eintragen'); break; }
        const soll = paarWerte(n.paare).map(([x, y]) => kaestchen(a.gitter, x, y));
        if (soll.some((p) => !p[2])) M('Nachweis punkte: Ein Punkt liegt nicht auf einem Gitterpunkt');
        const s1 = soll.map((p) => `${p[0]},${p[1]}`).sort().join(' '), s2 = (a.loesung ?? []).map((p) => p.join(',')).sort().join(' ');
        if (s1 !== s2) M(`Nachweis punkte: Die Lösung im Gitter (${s2}) passt nicht zu den Wertepaaren (${s1})`); else belegt = true;
        if (!n.frei) for (const w of n.paare.flat()) if (!kennt(w)) { M(`Nachweis punkte: ${w} steht nicht in der Aufgabe`); break; }
        break;
      }
      case 'karte': {
        const arten = optionen.map((o) => (o.bild?.skala ? schaubildArt(o.bild) : null));
        if (arten.some((x) => !x)) { M('Nachweis karte: Bildkarten mit Schaubild fehlen'); break; }
        optionen.forEach((o, i) => { if ((arten[i] === n.regel) !== Boolean(o.richtig)) M(`Nachweis karte: Karte ${o.text} zeigt ${arten[i]}, richtig ist ${n.regel}`); });
        belegt = true; break;
      }
      case 'bildart': { // Das Schaubild der Aufgabe zeigt diese Art von Zuordnung.
        const b = schaubildVon(a); if (!b) { M('Nachweis bildart: Schaubild fehlt'); break; }
        const ist = schaubildArt(b); if (ist !== n.ist) M(`Nachweis bildart: Das Schaubild zeigt ${ist}, nicht ${n.ist}`);
        if (n.wenn) { const soll = n.wenn[ist]; if (richtige.length !== 1 || richtige[0].text !== soll) M(`Nachweis bildart: richtig wäre „${soll}“`); else belegt = true; }
        break;
      }
      case 'tabellenwert': { // Ein Wertepaar steht in einer Wertetabelle des Bildes (oder der Aufgabe) in einer Spalte.
        const tabs = a.bild?.art === 'wertetabellen' ? a.bild.tabellen : a.tabelle?.art === 'werte' ? [a.tabelle] : [], x = zahlWert(n.x), y = zahlWert(n.y);
        if (!tabs.length || !x || !y) { M('Nachweis tabellenwert: Tabelle oder Werte fehlen'); break; }
        const da = tabs.some((tb) => tb.zeilen[0].slice(1).some((c, i) => gleich(zellWert(a, c), x) && gleich(zellWert(a, tb.zeilen[1][i + 1]), y)));
        if (!da) { M(`Nachweis tabellenwert: ${n.x} → ${n.y} steht nicht in der Tabelle`); break; }
        if (n.luecken) { if (!gleich(loesungWert(a.luecken?.[n.luecken[0]]?.loesung), x) || !gleich(loesungWert(a.luecken?.[n.luecken[1]]?.loesung), y)) M('Nachweis tabellenwert: Die Lücken nennen ein anderes Wertepaar'); else belegt = true; break; }
        trifft(n.gesucht === 'x' ? x : y, n); break;
      }
      case 'bildextrem': case 'flach': case 'steilst': { // Eigenschaften einer Linie im Schaubild: höchster oder tiefster Punkt, waagrechtes Stück, steilster Abschnitt.
        const b = schaubildVon(a), z = b?.zuege?.[n.zug ?? 0];
        if (!b?.skala || !z) { M(`Nachweis ${n.art}: Schaubild mit Linie fehlt`); break; }
        const sx = alsBruch(b.skala.x.schritt), sy = alsBruch(b.skala.y.schritt), pts = z.punkte.map(([px, py]) => [mal(alsBruch(px), sx), mal(alsBruch(py), sy)]), wert = (q) => q.z / q.n;
        if (n.art === 'bildextrem') {
          const x = zahlWert(n.x), y = zahlWert(n.y), ys = pts.map((p) => wert(p[1])), ext = n.was === 'max' ? Math.max(...ys) : Math.min(...ys);
          const treffer = pts.filter((p) => wert(p[1]) === ext);
          if (treffer.length !== 1 || !gleich(treffer[0][0], x) || !gleich(treffer[0][1], y)) { M(`Nachweis bildextrem: (${n.x}|${n.y}) ist nicht der einzige ${n.was === 'max' ? 'höchste' : 'tiefste'} Punkt`); break; }
          trifft(n.gesucht === 'x' ? x : y, n); break;
        }
        const von = zahlWert(n.von), bis = zahlWert(n.bis), stuecke = pts.slice(1).map((p, i) => ({ von: pts[i][0], bis: p[0], d: wert(p[1]) - wert(pts[i][1]), l: wert(p[0]) - wert(pts[i][0]) }));
        if (n.art === 'flach') {
          const fl = stuecke.filter((s) => s.d === 0);
          if (!fl.length || !gleich(fl[0].von, von) || !gleich(fl.at(-1).bis, bis) || fl.some((s, i) => i > 0 && !gleich(s.von, fl[i - 1].bis))) { M(`Nachweis flach: Die Linie ist nicht genau von ${n.von} bis ${n.bis} waagrecht`); break; }
        } else {
          const st = stuecke.map((s) => s.d / s.l), max = Math.max(...st), tr = stuecke.filter((s, i) => Math.abs(st[i] - max) < 1e-9);
          if (tr.length !== 1 || !gleich(tr[0].von, von) || !gleich(tr[0].bis, bis)) { M(`Nachweis steilst: Der steilste Abschnitt ist nicht genau der von ${n.von} bis ${n.bis}`); break; }
        }
        if (n.hilf) break;
        if (a.format === 'auswahl') { const hat = (o) => [von, bis].every((w) => alleZahlen(o.text).some((q) => gleich(q, w))); if (richtige.length !== 1 || !hat(richtige[0]) || optionen.filter(hat).length !== 1) M(`Nachweis ${n.art}: Genau die richtige Antwort nennt ${n.von} und ${n.bis}`); else belegt = true; }
        break;
      }
      case 'tabwahl': { // Genau die Tabelle der richtigen Antwort folgt der Regel.
        const tabs = a.bild?.art === 'wertetabellen' ? a.bild.tabellen : [];
        if (tabs.length < 2 || tabs.some((tb) => !tb.n)) { M('Nachweis tabwahl: mehrere benannte Tabellen im Bild fehlen'); break; }
        const passt = tabs.filter((tb) => folgtRegel(tabellenPaare(a, { art: 'werte', zeilen: tb.zeilen }), n.regel));
        if (n.mehrere) { if (passt.length < 2 || passt.length === tabs.length || richtige.length !== passt.length || !passt.every((tb) => richtige.some((o) => o.text === tb.n))) M('Nachweis tabwahl: Die richtigen Antworten sind nicht genau die Tabellen, die der Regel folgen'); else belegt = true; break; }
        if (passt.length !== 1) { M(`Nachweis tabwahl: ${passt.length} Tabellen folgen der Regel`); break; }
        if (richtige.length !== 1 || richtige[0].text !== passt[0].n) M(`Nachweis tabwahl: Richtig ist „${passt[0].n}“`); else belegt = true;
        break;
      }
      case 'kartenpaare': { // Bildkarten: Genau die richtige Karte zeigt alle Wertepaare (als Punkt oder auf der Linie).
        const paare = paarWerte(n.paare ?? []);
        if (!paare.length || paare.flat().some((w) => !w) || optionen.some((o) => !o.bild?.skala)) { M('Nachweis kartenpaare: Wertepaare oder Bildkarten fehlen'); break; }
        if (!n.frei) for (const w of n.paare.flat()) if (!kennt(w)) { M(`Nachweis kartenpaare: ${w} steht nicht in der Aufgabe`); break; }
        const zeigt = (o) => paare.every(([x, y]) => { const [cx, cy] = kaestchen(o.bild, x, y); return imBild(o.bild, cx, cy); });
        optionen.forEach((o) => { if (zeigt(o) !== Boolean(o.richtig)) M(`Nachweis kartenpaare: Karte ${o.text} ${zeigt(o) ? 'zeigt alle Wertepaare' : 'zeigt nicht alle Wertepaare'}`); });
        belegt = true; break;
      }
      case 'wert': { const w = zahlWert(n.wert); if (!w) { M('Nachweis wert: keine Zahl'); break; } trifft(w, n); break; }
      case 'urteil': {
        const pol = optionen.map((o) => polaritaet(o.text));
        if (!pol.some((p) => p !== null)) { M('Nachweis urteil: keine Antwort mit „Stimmt“ oder „Falsch“'); break; }
        optionen.forEach((o, i) => { if (pol[i] !== null && o.richtig && pol[i] !== n.stimmt) M(`Nachweis urteil: Die richtige Antwort „${o.text.slice(0, 40)}“ widerspricht dem Urteil`); });
        if (!richtige.some((o) => polaritaet(o.text) === n.stimmt)) M('Nachweis urteil: Keine richtige Antwort passt zum Urteil');
        belegt = true; break;
      }
      case 'frei': if (!n.grund && !n.text) M('Nachweis frei: Grund fehlt'); belegt = true; break;
      default: M(`Nachweis: unbekannte Art ${n?.art}`);
    }
  }
  // Lückentext: Mit den Lösungen eingesetzt stimmen alle Gleichungen, und jede Lücke steht in einer Gleichung oder ist eigens belegt.
  if (a.format === 'luecken') {
    const voll = a.text.replace(/\{\{(\w+)\}\}/g, (_, x) => String(a.luecken?.[x]?.loesung ?? '?'));
    const gl = zGleichungen(voll);
    for (const x of gl) if (!x.ok) M(`Lückentext: Gleichung stimmt nicht: ${x.ganz}`);
    if (gl.length) belegt = true;
  }
  if (optionen.some((o) => polaritaet(o.text) !== null) && !nachweis.some((n) => n?.art === 'urteil')) M('Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
  if (a.format === 'tabelle' && !nachweis.some((n) => n?.art === 'tabelle')) M('Tabelle: Nachweis der Regel fehlt');
  if (a.format === 'gitter' && !nachweis.some((n) => n?.art === 'punkte')) M('Schaubild: Nachweis der Punkte fehlt');
  if (!belegt) M('Nachweis: Die Lösung ist nicht nachgerechnet');
  return m;
}

export function pruefeZuordnungAufgabe(a, fehlvorstellungen) {
  const m = [];
  const f = formatMaengel(a, fehlvorstellungen);
  m.push(...f);
  if (f.some((x) => /^Format|Tabelle der Art|Wertetabelle:|Dreisatztabelle:/.test(x))) return m;
  m.push(...sprachMaengel(a));
  for (const b of [a.bild, a.format === 'gitter' ? a.gitter : null, ...(a.optionen ?? []).map((o) => o.bild)].filter(Boolean)) {
    if (b.skala || b.art === 'gitter') m.push(...schaubildMaengel(b, a.niveau).map((x) => `Bild: ${x}`));
    else if (b.art === 'wertetabellen') { if (!b.tabellen?.length || b.tabellen.some((tb) => tb.zeilen?.length !== 2 || tb.zeilen[0].length !== tb.zeilen[1].length || tb.zeilen[0].length < 2)) m.push('Bild: Wertetabelle mit zwei gleich langen Zeilen'); }
    else if (b.art === 'dreisatz') { if (b.kopf?.length !== 2 || b.zeilen?.length !== 3 || b.pfeile?.length !== 2) m.push('Bild: Dreisatztabelle mit drei Zeilen und zwei Rechenpfeilen'); else if (!b.zeilen.flat().some((c) => typeof c === 'object')) m.push(...pfeilMaengel(a, b, b.regel ?? 'prop', Boolean(b.fehler)).map((x) => `Bild: ${x}`)); }
    else m.push(`Bild der Art ${b.art} gibt es in diesem Kapitel nicht`);
  }
  if (a.heftaufgabe && !['M', 'E'].includes(a.niveau)) m.push('Heftaufgaben gibt es nur auf M und E');
  m.push(...nachweisMaengel(a));
  return m;
}
// Zählt auf F als Bild: Schaubild, Wertetabelle, Dreisatztabelle.
export const zuordnungHatBild = (a) => ['werte', 'dreisatz'].includes(a.tabelle?.art);
