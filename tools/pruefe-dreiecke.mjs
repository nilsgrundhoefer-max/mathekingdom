// Klasse 7, Kapitel 2 „Dreiecke“ (ADR 0044): Der Prüfer misst die Figuren nach und rechnet Beziehungen, Kongruenzsätze und Ortslinien nach.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Eine Figur (Bildart „figur“) ist maßstabsgetreu (Grilling mit Nils, 2026-11-25): Jeder angeschriebene Winkel wird aus den Koordinaten
// nachgemessen, gleich viele Striche heißen gleich lang oder gleich groß, und Maße in cm passen zu einem gemeinsamen Maßstab.
// Ein Winkel liegt zwischen den Strahlen s→a und s→b, und zwar der kleinere (mit `ueber` der größere).
// Auf dem Karogitter sind alle Punkte ganzzahlig. Dort rechnet der Prüfer genau.
import { dreieckRechnen } from './pruefe-winkel.mjs';

const rad = (g) => (g * Math.PI) / 180, deg = (x) => (x * 180) / Math.PI;
const V = (p, q) => [q[0] - p[0], q[1] - p[1]];
const det = (u, v) => u[0] * v[1] - u[1] * v[0];
const sp = (u, v) => u[0] * v[0] + u[1] * v[1];
const len = (v) => Math.hypot(v[0], v[1]);
const d2 = (p, q) => sp(V(p, q), V(p, q));
const pGleich = (p, q) => Boolean(p && q) && Math.abs(p[0] - q[0]) < 1e-9 && Math.abs(p[1] - q[1]) < 1e-9;
const mengeGleich = (A, B) => A.length === B.length && A.every((p) => B.some((q) => pGleich(p, q))) && B.every((p) => A.some((q) => pGleich(p, q)));
// Richtungen in der Figur sind auf Tausendstel gerundet: Bis etwa 0,3° Abweichung zählen sie als gleich.
const WINKEL_EPS = 0.005;
const gleichGerichtet = (u, v) => Math.abs(det(u, v)) < WINKEL_EPS * len(u) * len(v) && sp(u, v) > 0;
const gegen = (u) => [-u[0], -u[1]];
const zahlenIn = (s) => [...String(s ?? '').matchAll(/\d+(?:,\d+)?/g)].map((m) => Number(m[0].replace(',', '.')));
// Gemessene Winkel dürfen um so viel von der Angabe abweichen (Koordinaten auf Tausendstel gerundet).
const TOL = 0.6;
export const GRIECH = { A: 'α', B: 'β', C: 'γ' };
const ECKE_VON = { α: 'A', β: 'B', γ: 'C' };
const RELATION = { neben: 'Nebenwinkel', scheitel: 'Scheitelwinkel', stufen: 'Stufenwinkel', wechsel: 'Wechselwinkel' };

// ---------- Figur ----------
export const FIGURBILD = 'figur';
const figurVon = (a) => (a.bild?.art === FIGURBILD ? a.bild : null);
const punkt = (b, n) => b?.punkte?.find((p) => p.n === n)?.p ?? null;
const winkelNamens = (b, n) => (b?.winkel ?? []).find((w) => w.n === n) ?? null;
export function winkelMass(b, w) {
  const S = punkt(b, w.s), A = punkt(b, w.a), B = punkt(b, w.b);
  if (!S || !A || !B) return NaN;
  const u = V(S, A), v = V(S, B), g = deg(Math.acos(Math.max(-1, Math.min(1, sp(u, v) / len(u) / len(v)))));
  return w.ueber ? 360 - g : g;
}
// Innenwinkel des Dreiecks ABC einer Figur bei der Ecke p.
const innen = (b, p) => { const [q, r] = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }[p]; return winkelMass(b, { s: p, a: q, b: r }); };
const seiteEcken = { a: ['B', 'C'], b: ['C', 'A'], c: ['A', 'B'] };
// Maßstab der Figur aus den Maßen „5 cm“ (Einheiten je cm). null, wenn kein Maß dasteht.
function massstab(b) {
  const k = (b.masse ?? []).filter((m) => !m.frage && /^(\w = )?\d+(,\d+)? cm$/.test(m.t)).map((m) => len(V(punkt(b, m.a), punkt(b, m.b))) / zahlenIn(m.t)[0]);
  return k.length ? k : null;
}
export function figurBildMaengel(b) {
  const m = [], namen = (b.punkte ?? []).map((p) => p.n);
  if (!namen.length || new Set(namen).size !== namen.length) m.push('Figur: Punkte fehlen oder sind doppelt benannt');
  for (const p of b.punkte ?? []) if (!Array.isArray(p.p) || p.p.length !== 2 || !p.p.every(Number.isFinite)) m.push(`Figur: Punkt ${p.n} hat keine Koordinaten`);
  const da = (n) => namen.includes(n);
  for (const l of b.linien ?? []) if (!da(l.a) || !da(l.b) || pGleich(punkt(b, l.a), punkt(b, l.b))) m.push('Figur: Linie zu einem fehlenden Punkt');
  for (const w of b.winkel ?? []) {
    if (![w.s, w.a, w.b].every(da)) { m.push('Figur: Winkel zu einem fehlenden Punkt'); continue; }
    const g = winkelMass(b, w);
    if (w.wert != null && Math.abs(g - w.wert) > TOL) m.push(`Figur: Der Winkel ${w.n ?? `bei ${w.s}`} ist ${g.toFixed(1)}° groß, angeschrieben sind ${w.wert}°`);
    if (w.wert == null && !w.n) m.push(`Figur: Winkel bei ${w.s} ohne Namen und ohne Größe`);
  }
  for (const k of b.kreise ?? []) if (!da(k.m) || !(k.r > 0)) m.push('Figur: Kreis ohne Mittelpunkt oder Radius');
  for (const x of b.masse ?? []) if (!da(x.a) || !da(x.b) || !x.t) m.push('Figur: Maß zu einem fehlenden Punkt');
  // Gleich viele Striche: gleich lang (Linien) oder gleich groß (Winkel).
  for (const s of [1, 2, 3]) {
    const l = (b.linien ?? []).filter((x) => x.gleich === s).map((x) => len(V(punkt(b, x.a), punkt(b, x.b))));
    if (l.length && (l.length < 2 || l.some((x) => Math.abs(x - l[0]) > 0.01 * l[0]))) m.push(`Figur: Die Linien mit ${s} Strich${s > 1 ? 'en' : ''} sind nicht gleich lang`);
    const w = (b.winkel ?? []).filter((x) => x.gleich === s).map((x) => winkelMass(b, x));
    if (w.length && (w.length < 2 || w.some((x) => Math.abs(x - w[0]) > TOL))) m.push(`Figur: Die Winkel mit ${s} Strich${s > 1 ? 'en' : ''} sind nicht gleich groß`);
  }
  // Alle Maße in cm passen zu einem Maßstab (auch die Planfigur ist maßstabsgetreu).
  const k = massstab(b);
  if (k && k.some((x) => Math.abs(x - k[0]) > 0.02 * k[0])) m.push('Figur: Die Maße passen nicht zu einem gemeinsamen Maßstab');
  return m;
}
// Zahlen, die die Figur zeigt (ohne Gesuchtes).
export const figurBildZahlen = (b) => [...(b.winkel ?? []).filter((w) => w.wert != null && !w.frage).map((w) => w.wert), ...(b.masse ?? []).filter((x) => !x.frage).flatMap((x) => zahlenIn(x.t))];

// Beziehung zweier Winkel einer Figur: am selben Scheitel Neben- oder Scheitelwinkel, an zwei Scheiteln auf einer Geraden Stufen- oder Wechselwinkel.
// Stufen- und Wechselwinkel sind eine Lage: Sie gelten auch an Geraden, die nicht parallel sind.
function beziehungVon(b, w1, w2) {
  const S1 = punkt(b, w1.s), S2 = punkt(b, w2.s), r1 = [V(S1, punkt(b, w1.a)), V(S1, punkt(b, w1.b))], r2 = [V(S2, punkt(b, w2.a)), V(S2, punkt(b, w2.b))];
  const paar = (f, g, x, y) => (f(r1[0], x) && g(r1[1], y)) || (g(r1[0], x) && f(r1[1], y));
  const passt = (f, g) => paar(f, g, r2[0], r2[1]) || paar(f, g, r2[1], r2[0]);
  const gl = (x, y) => gleichGerichtet(x, y), ge = (x, y) => gleichGerichtet(x, gegen(y));
  if (len(V(S1, S2)) < 0.01) return passt(gl, gl) ? 'selbst' : passt(gl, ge) ? 'neben' : passt(ge, ge) ? 'scheitel' : null;
  const d = V(S1, S2);
  const teile = (r) => { const i = r.findIndex((x) => Math.abs(det(x, d)) < WINKEL_EPS * len(x) * len(d)); return i < 0 ? null : { q: r[i], l: r[1 - i] }; };
  const t1 = teile(r1), t2 = teile(r2);
  if (!t1 || !t2) return null;
  const gleicheRichtung = sp(t1.q, t2.q) > 0, s1 = Math.sign(det(d, t1.l)), s2 = Math.sign(det(d, t2.l));
  if (gleicheRichtung && s1 === s2) return 'stufen';
  if (!gleicheRichtung && s1 !== s2) return 'wechsel';
  return null;
}
const relationIn = (t) => { const f = Object.entries(RELATION).filter(([, w]) => t.includes(w)); return f.length === 1 ? f[0][0] : undefined; };
// Ja/Nein am Anfang einer Antwort.
const polar = (t) => (/^(Nein|Falsch|Stimmt nicht|Nicht eindeutig)(?![a-zäöü])/.test(t) ? false : /^(Ja|Stimmt|Richtig|Eindeutig)(?![a-zäöü])/.test(t) ? true : undefined);

// Antworten einstufen. Streng: Jede Antwort muss sich prüfen lassen. Locker: Antworten in freien Sätzen, die sich nicht lesen lassen,
// bleiben ungeprüft, mindestens eine Antwort muss sich aber prüfen lassen. Hat die Aufgabe ein Urteil im Nachweis, stuft das Urteil die Sätze ein.
let mitUrteil = false;
function stufe(optionen, trifft, locker = false) {
  if (!Array.isArray(optionen) || !optionen.length) return 'Antworten fehlen';
  let geprueft = 0;
  for (const o of optionen) {
    const w = trifft(String(o.text).replace(/\n/g, ' ').trim());
    if (w === undefined) { if (locker) continue; return `Antwort „${o.text}“ lässt sich nicht prüfen`; }
    geprueft++;
    if (w !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
  }
  return geprueft || mitUrteil ? null : 'keine Antwort lässt sich prüfen';
}
const optionenVon = (a, n) => (n.teil != null ? a.teile?.[n.teil]?.optionen : a.optionen);
// Die Lösung, die eine Nachweiszeile bestätigt: die ganze Aufgabe, ein Teil oder eine Lücke.
const loesungVon = (a, n) => (n.teil != null ? a.teile?.[n.teil]?.loesung : n.luecke != null ? a.luecken?.[n.luecke]?.loesung : a.loesung);

// ---------- Gitter ----------
const gitterVon = (a) => a.gitter ?? (a.bild?.art === 'gitter' ? a.bild : null);
const abstandZurGeraden = (p, a, b) => Math.abs(det(V(a, b), V(a, p))) / len(V(a, b));
const lotfuss = (p, a, b) => { const d = V(a, b), t = sp(V(a, p), d) / sp(d, d); return [a[0] + t * d[0], a[1] + t * d[1]]; };
function hoehenschnittpunkt([A, B, C]) { // Schnitt der Höhen durch A und B
  const u = V(B, C), v = V(A, C), r1 = sp(u, A), r2 = sp(v, B), d = det(u, v);
  return d === 0 ? null : [(r1 * v[1] - r2 * u[1]) / d, (u[0] * r2 - v[0] * r1) / d];
}
function inkreismitte([A, B, C]) { const a = len(V(B, C)), b = len(V(A, C)), c = len(V(A, B)), s = a + b + c; return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]; }
const nahe = (p, q) => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6;
// Erfüllt der Gitterpunkt p eine Bedingung einer Ortsaufgabe?
function erfuellt(bed, p) {
  switch (bed.art) {
    case 'abstand': return d2(p, bed.von) === bed.r ** 2;
    case 'ueber': return det(V(bed.a, bed.b), V(bed.a, p)) > 0;
    case 'auf': return det(V(bed.a, bed.b), V(bed.a, p)) === 0;
    case 'mitte': return nahe(p, [(bed.a[0] + bed.b[0]) / 2, (bed.a[1] + bed.b[1]) / 2]);
    case 'gleichweit': return d2(p, bed.a) === d2(p, bed.b);
    case 'rechter': return !pGleich(p, bed.a) && !pGleich(p, bed.b) && sp(V(p, bed.a), V(p, bed.b)) === 0;
    case 'hoehe': return bed.werte.some((h) => Math.abs(abstandZurGeraden(p, bed.a, bed.b) - h) < 1e-9);
    case 'abstandGerade': return Math.abs(abstandZurGeraden(p, bed.a, bed.b) - bed.d) < 1e-9;
    case 'hoehenschnitt': { const H = hoehenschnittpunkt(bed.ecken); return Boolean(H) && nahe(p, H); }
    case 'inkreis': return nahe(p, inkreismitte(bed.ecken));
    case 'gleichweitGeraden': { // gleich weit von den beiden Schenkeln, im Winkelfeld
      const w = V(bed.s, p), x = det(w, bed.v) / det(bed.u, bed.v), y = det(bed.u, w) / det(bed.u, bed.v);
      return x >= 0 && y >= 0 && Math.abs(abstandZurGeraden(p, bed.s, [bed.s[0] + bed.u[0], bed.s[1] + bed.u[1]]) - abstandZurGeraden(p, bed.s, [bed.s[0] + bed.v[0], bed.s[1] + bed.v[1]])) < 1e-9;
    }
    default: return undefined;
  }
}

// ---------- Kongruenzsätze ----------
// Angaben wie „a = 4 cm, c = 5 cm, β = 40°“, „b, c, γ mit c < b“ oder „a, α, β“. Liefert den Satz und, bei zwei Winkeln ohne den passenden, den fehlenden Winkel.
export function satzVon(angaben, kontext = '') {
  const t = `${angaben} ${kontext}`, seiten = [...new Set([...String(angaben).matchAll(/(?<![A-Za-zäöüß_])([abc])(?![A-Za-zäöüß_])/g)].map((x) => x[1]))], winkel = [...new Set(String(angaben).match(/[αβγ]/g) ?? [])];
  const wert = (x) => { const m = t.match(new RegExp(`${x} = (\\d+(?:,\\d+)?) cm`)); return m ? Number(m[1].replace(',', '.')) : null; };
  const kleiner = (x, y) => (wert(x) != null && wert(y) != null ? wert(x) < wert(y) : new RegExp(`${x} < ${y}`).test(t) ? true : new RegExp(`${y} < ${x}`).test(t) ? false : null);
  if (seiten.length === 3) return { satz: 'sss' };
  if (seiten.length === 2 && winkel.length === 1) {
    const e = ECKE_VON[winkel[0]], gegenueber = e.toLowerCase();
    if (!seiten.includes(gegenueber)) return { satz: 'sws' };
    const andere = seiten.find((s) => s !== gegenueber), k = kleiner(andere, gegenueber);
    return k == null ? { satz: null } : { satz: k ? 'SsW' : 'SsW-kurz' };
  }
  if (seiten.length === 1 && winkel.length === 2) {
    const enden = seiteEcken[seiten[0]];
    if (winkel.every((w) => enden.includes(ECKE_VON[w]))) return { satz: 'wsw' };
    return { satz: 'wsw-rechnen', fehlt: ['α', 'β', 'γ'].find((w) => enden.includes(ECKE_VON[w]) && !winkel.includes(w)) };
  }
  return { satz: 'keiner' };
}
const SATZWORT = [[/^drei Seiten$/, 'sss'], [/^zwei Seiten und der Winkel dazwischen$/, 'sws'], [/^eine Seite und die beiden Winkel daran$/, 'wsw'], [/^(sss|sws|wsw|SsW)$/, null]];
const satzIn = (t) => { for (const [re, s] of SATZWORT) { const m = t.match(re); if (m) return s ?? m[1]; } return undefined; };

// Eine Seite und alle drei Winkel: Sinussatz.
function wsw(g) {
  const s = ['a', 'b', 'c'].find((x) => g[x] != null), W = { a: 'α', b: 'β', c: 'γ' }, k = g[s] / Math.sin(rad(g[W[s]]));
  return { a: k * Math.sin(rad(g.α)), b: k * Math.sin(rad(g.β)), c: k * Math.sin(rad(g.γ)), alpha: g.α, beta: g.β, gamma: g.γ };
}
// Zwei Seiten und der Winkel, der der längeren gegenüberliegt (SsW, auch der rechte Winkel beim Thaleskreis): Sinussatz.
function ssw(g) {
  const w = ['α', 'β', 'γ'].find((x) => g[x] != null), x = w && ECKE_VON[w].toLowerCase(), y = ['a', 'b', 'c'].find((s) => s !== x && g[s] != null);
  if (!w || g[x] == null || !y || g[x] < g[y]) return null;
  const W = { a: 'alpha', b: 'beta', c: 'gamma' }, Y = deg(Math.asin((g[y] * Math.sin(rad(g[w]))) / g[x])), Z = 180 - g[w] - Y;
  const z = ['a', 'b', 'c'].find((s) => s !== x && s !== y);
  return { [x]: g[x], [y]: g[y], [z]: (g[x] * Math.sin(rad(Z))) / Math.sin(rad(g[w])), [W[x]]: g[w], [W[y]]: Y, [W[z]]: Z };
}

// ---------- Sonderprüfungen ----------
// Jede Prüfung liefert eine Meldung oder null. Was sie als Ergebnis bestätigt, legt sie in n.ergebnis ab (die Prüfung arbeitet auf einer Kopie).
const erg = (n, w) => { n.ergebnis = [...(n.ergebnis ?? []), ...[w].flat()]; return null; };
export const DREIECK_SONDER = {
  // Der Winkel mit diesem Namen, in der Figur nachgemessen. Er muss die Lösung (der Aufgabe, des Teils, der Lücke) sein.
  figur: (n, a) => {
    const b = figurVon(a), w = winkelNamens(b, n.winkel);
    if (!w) return `der Winkel ${n.winkel} steht nicht in der Figur`;
    const g = Math.round(winkelMass(b, w)), l = loesungVon(a, n);
    if (l != null && Math.abs(winkelMass(b, w) - l) > TOL) return `${n.winkel} ist in der Figur ${winkelMass(b, w).toFixed(1)}° groß, die Lösung ist ${l}°`;
    return erg(n, g);
  },
  // Lage zweier Winkel zueinander. Mit `frage` nennen die Antworten Winkel, sonst die Beziehung.
  beziehung: (n, a) => {
    const b = figurVon(a), optionen = optionenVon(a, n);
    if (!b) return 'braucht eine Figur';
    if (!RELATION[n.welche] && n.welche !== 'gleich') return `unbekannte Beziehung ${n.welche}`;
    const rel = (x, y) => {
      const w1 = winkelNamens(b, x), w2 = winkelNamens(b, y);
      if (!w1 || !w2) return undefined;
      if (n.welche === 'gleich') return w1 !== w2 && Math.abs(winkelMass(b, w1) - winkelMass(b, w2)) < TOL;
      return beziehungVon(b, w1, w2) === n.welche;
    };
    if (n.frage) return stufe(optionen, (t) => rel(n.frage, t));
    const [x, y] = n.paar, r = rel(x, y);
    if (r === false) return `${x} und ${y} sind in der Figur keine ${RELATION[n.welche]}`;
    if (n.parallel === false) {
      if (r) { const g = Math.abs(winkelMass(b, winkelNamens(b, x)) - winkelMass(b, winkelNamens(b, y))); if (g < TOL) return 'die Figur zeigt doch gleich große Winkel'; }
      return optionen && a.format === 'auswahl' ? stufe(optionen, (t) => (polar(t) === undefined ? undefined : !polar(t)), true) : null;
    }
    if (optionen && (a.format === 'auswahl' || n.teil != null)) return stufe(optionen, (t) => { const w = relationIn(t); return w === undefined ? undefined : w === n.welche; }, true);
    return null;
  },
  // Einteilen nach Winkeln oder Seiten. Die Winkel ergeben 180°, die Ecken (auf dem Gitter) werden nachgerechnet.
  klasse: (n, a) => {
    let w = n.winkel, s = n.seiten;
    if (n.ecken) {
      const [A, B, C] = n.ecken, q = [d2(B, C), d2(A, C), d2(A, B)];
      s = q; w = [[A, B, C], [B, C, A], [C, A, B]].map(([P, Q, R]) => deg(Math.acos(sp(V(P, Q), V(P, R)) / Math.sqrt(d2(P, Q) * d2(P, R)))));
    }
    if (!s && w) s = w; // gleich große Winkel liegen gleich langen Seiten gegenüber
    if (w && Math.abs(w.reduce((x, y) => x + y, 0) - 180) > TOL) return `die Winkel ${w.join(', ')} ergeben nicht 180°`;
    const b = figurVon(a);
    if (w && b && ['A', 'B', 'C'].every((p) => punkt(b, p))) { const ist = ['A', 'B', 'C'].map((p) => innen(b, p)).sort((x, y) => x - y), soll = [...w].sort((x, y) => x - y); if (ist.some((x, i) => Math.abs(x - soll[i]) > TOL)) return 'die Winkel passen nicht zur Figur'; }
    const nachWinkel = w ? (w.some((x) => Math.abs(x - 90) < 1e-6) ? 'rechtwinklig' : w.some((x) => x > 90) ? 'stumpfwinklig' : 'spitzwinklig') : null;
    const gleiche = s ? Math.max(...s.map((x) => s.filter((y) => Math.abs(x - y) < 1e-9).length)) : null;
    const nachSeiten = s ? (gleiche === 3 ? 'gleichseitig' : gleiche === 2 ? 'gleichschenklig' : 'unregelmäßig') : null;
    const WOERTER = ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig', 'gleichseitig', 'gleichschenklig', 'unregelmäßig'];
    const optionen = optionenVon(a, n);
    if (!optionen) return null;
    return stufe(optionen, (t) => {
      const ws = WOERTER.filter((x) => new RegExp(`(?<![a-zäöü])${x}`).test(t));
      if (!ws.length) return undefined;
      return ws.every((x) => (WOERTER.indexOf(x) < 3 ? x === nachWinkel : x === nachSeiten));
    }, true);
  },
  // Namen im Dreieck: Die Seite a liegt A gegenüber, α liegt bei A, h_a geht von A aus und steht senkrecht auf a.
  name: (n, a) => {
    const ecken = n.dreieck ?? ['A', 'B', 'C'], klein = (e) => e.toLowerCase();
    const griech = n.dreieck ? null : GRIECH;
    const dritte = (xs) => ecken.find((e) => !xs.includes(e));
    if (n.seite && n.ecken && n.seite !== klein(dritte(n.ecken))) return `die Seite von ${n.ecken.join('')} heißt ${klein(dritte(n.ecken))}`;
    if (n.seite && typeof n.ecke === 'string' && n.seite !== klein(n.ecke)) return `der Ecke ${n.ecke} liegt ${klein(n.ecke)} gegenüber`;
    if (n.winkel && typeof n.winkel === 'string' && n.ecke && griech?.[n.ecke] !== n.winkel) return `bei ${n.ecke} liegt ${griech?.[n.ecke]}`;
    if (n.seite && Array.isArray(n.winkel) && n.seite !== klein(dritte(n.winkel.map((x) => ECKE_VON[x])))) return 'die Seite liegt nicht zwischen den beiden Winkeln';
    if (typeof n.winkel === 'string' && Array.isArray(n.seiten) && ECKE_VON[n.winkel] !== ecken.find((e) => n.seiten.every((s) => s !== klein(e)))) return 'der Winkel liegt nicht zwischen den beiden Seiten';
    if (n.winkelGleich && n.seiten !== n.winkelGleich.map((x) => klein(ECKE_VON[x])).join(' und ')) return 'gleich großen Winkeln liegen die gleich langen Seiten gegenüber';
    if (n.hoehe && n.ecke && n.ecke !== n.hoehe.toUpperCase()) return `h_${n.hoehe} geht von ${n.hoehe.toUpperCase()} aus`;
    if (n.hoehe && n.ist && (!/bei C|γ = 90°/.test(a.text) || n.hoehe === 'c' || n.ist === 'c' || n.hoehe === n.ist)) return 'im rechtwinkligen Dreieck mit dem rechten Winkel bei C ist h_a = b und h_b = a';
    if (n.ist) erg(n, zahlenIn((a.text.match(new RegExp(`${n.ist} = (\\d+) cm`)) ?? [])[1]));
    const optionen = optionenVon(a, n);
    if (!optionen || a.format === 'zahl') return null;
    const werte = [n.seite, typeof n.winkel === 'string' ? n.winkel : null, typeof n.ecke === 'string' && !n.seite && !n.hoehe ? n.ecke : null, typeof n.seiten === 'string' ? n.seiten : null, n.ist].filter(Boolean);
    return stufe(optionen, (t) => {
      const h = t.match(/^von ([A-Z]), (senkrecht auf|zur Mitte von) ([a-z])$/);
      if (h) return h[1] === n.ecke && h[2] === 'senkrecht auf' && h[3] === n.hoehe;
      if (/^([a-z]|[A-Z]|[αβγ]|[a-c] und [a-c])$/.test(t)) return werte.includes(t);
      return undefined;
    }, true);
  },
  // Eine Seite der Figur: Länge über den Maßstab der angeschriebenen Maße.
  seite: (n, a) => {
    const b = figurVon(a), k = b && massstab(b), [p, q] = seiteEcken[n.seite] ?? [];
    if (!k || !punkt(b, p)) return 'Figur oder Maße fehlen';
    const l = len(V(punkt(b, p), punkt(b, q))) / k[0];
    return Math.abs(l - n.wert) > 0.02 * n.wert ? `${n.seite} ist in der Figur ${l.toFixed(1)} cm lang, nicht ${n.wert} cm` : erg(n, n.wert);
  },
  // Welcher Kongruenzsatz zu den Angaben gehört. Antworten nennen den Satz oder beschreiben ihn.
  kongruenz: (n, a) => {
    const s = satzVon(n.angaben, a.text);
    if (s.satz !== n.satz) return `zu „${n.angaben}“ gehört ${s.satz ?? 'kein bestimmter Satz'}, nicht ${n.satz}`;
    if (n.fehlt && n.fehlt !== s.fehlt) return `es fehlt ${s.fehlt}, nicht ${n.fehlt}`;
    const b = figurVon(a), texte = [a.text, ...(b?.masse ?? []).map((x) => `${{ BC: 'a', CB: 'a', AC: 'b', CA: 'b', AB: 'c', BA: 'c' }[x.a + x.b]} = ${x.t}`), ...(b?.winkel ?? []).filter((w) => w.wert != null).map((w) => `${GRIECH[w.s]} = ${w.wert}°`)].join(' ');
    for (const x of String(n.angaben).split(/, | und /)) if (/=/.test(x) && !texte.includes(x.trim())) return `die Angabe ${x} steht weder im Text noch in der Figur`;
    const optionen = a.optionen;
    if (a.format !== 'auswahl') return null;
    const eindeutig = ['sss', 'sws', 'wsw', 'SsW', 'wsw-rechnen'].includes(n.satz);
    // „Ergänze eine Seite“: Die Antwort ist die fehlende Angabe. Mit ihr muss der Satz passen.
    const fest = String(n.angaben).split(/, | und /).filter((x) => /=/.test(x) || !/^[a-cαβγ]$/.test(x.trim()));
    return stufe(optionen, (t) => {
      if (n.satz === 'wsw-rechnen' && /^[αβγ]$/.test(t)) return t === s.fehlt;
      if (/^[a-cαβγ]$/.test(t)) return satzVon([...fest, t].join(', '), a.text).satz === n.satz;
      const k = t.match(/^Ja\. .*Kongruenzsatz (\w+)/);
      if (k) return k[1] === n.satz;
      if (/^Eindeutig\./.test(t)) return eindeutig && (!satzIn(t.match(/\((\w+)\)/)?.[1] ?? '') || t.includes(`(${n.satz})`));
      if (/^Nicht eindeutig\./.test(t)) return !eindeutig;
      const x = satzIn(t);
      return x === undefined ? undefined : x === n.satz;
    }, true);
  },
  // Dreiecksungleichung: Jede Seite ist kürzer als die beiden anderen zusammen.
  konstruierbar: (n, a) => {
    const [x, y, z] = n.seiten, geht = x + y > z && x + z > y && y + z > x;
    if (geht !== n.geht) return `mit ${n.seiten.join(', ')} ${geht ? 'geht' : 'geht kein'} Dreieck`;
    if (a.format === 'auswahl') { const r = stufe(a.optionen, (t) => (polar(t) !== undefined ? polar(t) === geht : /ist nicht länger als/.test(t) ? !geht : / ist länger als /.test(t) ? geht : undefined), true); if (r) return r; }
    return n.geht ? erg(n, z) : null;
  },
  // Konstruktion im Heft: Das Dreieck wird aus den Angaben berechnet, die Lösung ist der gemessene Wert (Toleranz 2 mm oder 2°).
  heft: (n, a) => {
    const g = n.gegeben, satz = satzVon(Object.keys(g).join(', ')).satz;
    if (n.satz !== 'thales' && satz !== n.satz && !(satz === 'wsw-rechnen' && n.satz === 'wsw')) return `die Angaben passen zu ${satz}, nicht zu ${n.satz}`;
    for (const [k, v] of Object.entries(g)) if (!/Maßstab/.test(a.text) && !a.text.includes(`${k} = ${String(v).replace('.', ',')}${['α', 'β', 'γ'].includes(k) ? '°' : ' cm'}`)) return `die Angabe ${k} = ${v} steht nicht im Text`;
    const w = { α: g.α, β: g.β, γ: g.γ }, bekannt = Object.values(w).filter((x) => x != null);
    if (bekannt.length === 2) for (const k of Object.keys(w)) if (w[k] == null) w[k] = 180 - bekannt[0] - bekannt[1];
    const d = (bekannt.length === 2 && Object.keys(g).some((k) => ['a', 'b', 'c'].includes(k)) ? wsw({ ...g, ...w }) : null) ?? dreieckRechnen({ a: g.a, b: g.b, c: g.c, alpha: g.α, beta: g.β, gamma: g.γ }) ?? ssw(g);
    if (!d) return 'das Dreieck lässt sich so nicht zeichnen';
    const hoehe = { h_a: d.b * Math.sin(rad(d.gamma)), h_b: d.a * Math.sin(rad(d.gamma)), h_c: d.a * Math.sin(rad(d.beta)) };
    const soll = { α: d.alpha, β: d.beta, γ: d.gamma }[n.gesucht] ?? (d[n.gesucht] ?? hoehe[n.gesucht]) * 10;
    if (!Number.isFinite(soll)) return `unbekannte Größe ${n.gesucht}`;
    if (Math.abs(soll - a.loesung) > 0.5 + 1e-9) return `${n.gesucht} ist ${soll.toFixed(1)}, nicht ${a.loesung}`;
    if (a.toleranz !== 2) return 'eine Heftaufgabe hat die Toleranz 2 (mm oder °)';
    return erg(n, a.loesung);
  },
  // Satz des Thales: C auf dem Kreis über AB hat bei C einen rechten Winkel.
  thales: (n, a) => {
    const b = figurVon(a);
    // Liegt C innerhalb des Thaleskreises, ist γ größer als 90°, außerhalb kleiner.
    if (n.lage) return stufe(a.optionen, (t) => (/größer als 90°/.test(t) ? n.lage === 'innen' : /kleiner als 90°/.test(t) ? n.lage === 'aussen' : /genau 90°/.test(t) ? false : undefined));
    if (b) {
      const k = (b.kreise ?? [])[0], M = k && punkt(b, k.m), A = punkt(b, 'A'), B = punkt(b, 'B');
      if (!M || !A || !B || len(V(M, [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2])) > 0.01 || Math.abs(len(V(M, A)) - k.r) > 0.01) return 'der Kreis ist nicht der Thaleskreis über AB';
      const C = punkt(b, 'C');
      if (C && !n.nicht && Math.abs(len(V(M, C)) - k.r) > 0.01) return 'C liegt nicht auf dem Thaleskreis';
      if (n.aufKreis) {
        for (const x of [...n.aufKreis, ...(n.nicht ?? [])]) { const P = punkt(b, x); if (!P) return `${x} fehlt in der Figur`; if ((Math.abs(len(V(M, P)) - k.r) < 0.01) !== n.aufKreis.includes(x)) return `${x} liegt ${n.aufKreis.includes(x) ? 'nicht ' : ''}auf dem Thaleskreis`; }
        return stufe(a.optionen, (t) => ([...n.aufKreis, ...(n.nicht ?? [])].includes(t) ? n.aufKreis.includes(t) : undefined));
      }
      if (a.format === 'auswahl' && a.optionen.every((o) => /^[A-Z]$/.test(o.text))) return stufe(a.optionen, (t) => (['A', 'B', 'C'].includes(t) ? Math.abs(innen(b, t) - 90) < TOL : t === 'M' ? false : undefined));
    }
    return erg(n, 90);
  },
  // Lage einer Geraden zum Kreis: Abstand d vom Mittelpunkt und Radius r.
  kreislage: (n, a) => {
    const was = n.d > n.r ? 'Passante' : n.d === n.r ? 'Tangente' : 'Sekante';
    if (was !== n.was) return `bei d = ${n.d} und r = ${n.r} ist die Gerade eine ${was}`;
    if (!zahlenIn(a.text).includes(n.r) || !zahlenIn(a.text).includes(n.d)) return 'r oder d steht nicht im Text';
    return a.format === 'auswahl' ? stufe(a.optionen, (t) => (['Passante', 'Tangente', 'Sekante'].includes(t) ? t === was : undefined)) : null;
  },
  // Tangente im Punkt P: senkrecht zum Radius MP durch P.
  tangente: (n, a) => {
    if (!n.m) return erg(n, 90); // Wissen: Radius und Tangente stehen senkrecht aufeinander
    const g = gitterVon(a), bed = a.bedingung;
    if (!(g?.kreise ?? []).some((k) => pGleich(k.m, n.m) && d2(n.m, n.p) === k.r ** 2)) return 'P liegt nicht auf dem Kreis um M';
    if (bed?.art !== 'senkrecht' || !mengeGleich(bed.zu, [n.m, n.p]) || !pGleich(bed.durch, n.p)) return 'die Bedingung ist nicht „senkrecht zu MP durch P“';
    return null;
  },
  // Länge einer Strecke auf dem Gitter zwischen zwei Gitterpunkten des Bildes.
  gitterlaenge: (n, a) => {
    const g = gitterVon(a), punkte = [...(g?.punkte ?? []).map((p) => [p.x, p.y]), ...(g?.linien ?? []).flatMap((l) => [l.a, l.b])];
    const kanten = [...(g?.linien ?? []).map((l) => [l.a, l.b]), ...(g?.figuren ?? []).flatMap((f) => f.ecken.map((e, i) => [e, f.ecken[(i + 1) % f.ecken.length]]))];
    const aufKante = (p) => kanten.some(([x, y]) => det(V(x, y), V(x, p)) === 0 && sp(V(x, p), V(y, p)) <= 0);
    if (!punkte.some((q) => pGleich(n.a, q)) || !(punkte.some((q) => pGleich(n.b, q)) || aufKante(n.b))) return 'die Endpunkte stehen nicht im Bild';
    // diagonal: gezählt in Kästchendiagonalen (die Strecke läuft unter 45°)
    if (n.diagonal) return Math.abs(n.a[0] - n.b[0]) === n.wert && Math.abs(n.a[1] - n.b[1]) === n.wert ? erg(n, n.wert) : `die Strecke ist nicht ${n.wert} Kästchendiagonalen lang`;
    return d2(n.a, n.b) === n.wert ** 2 ? erg(n, n.wert) : `die Strecke ist ${Math.sqrt(d2(n.a, n.b)).toFixed(2)} Kästchen lang, nicht ${n.wert}`;
  },
  // Höhe von einer Ecke auf eine Seite: Der Fußpunkt ist der Lotfußpunkt (auf dem Gitter ein Gitterpunkt).
  hoehe: (n, a) => {
    const f = lotfuss(n.ecke, ...n.seite);
    if (!pGleich(f, n.fuss)) return `der Fußpunkt ist (${f.join('|')})`;
    const t = sp(V(n.seite[0], f), V(...n.seite)) / d2(...n.seite), aussen = t < -1e-9 || t > 1 + 1e-9;
    if (n.aussen != null && n.aussen !== aussen) return `der Fußpunkt liegt ${aussen ? 'außerhalb' : 'auf'} der Seite`;
    const g = gitterVon(a), bed = a.bedingung;
    if (a.format === 'gitter' && a.eingabe === 'punkte' && !mengeGleich(a.loesung, [n.fuss])) return 'die Lösung ist nicht der Fußpunkt';
    if (a.format === 'gitter' && a.eingabe === 'linie') {
      const ok = (bed.art === 'strecke' && mengeGleich([bed.a, bed.b], [n.ecke, n.fuss])) || (bed.art === 'senkrecht' && mengeGleich(bed.zu, n.seite) && pGleich(bed.durch, n.ecke)) || (bed.art === 'gerade' && [bed.a, bed.b].every((p) => det(V(n.ecke, n.fuss), V(n.ecke, p)) === 0));
      if (!ok) return 'die Bedingung ist nicht die Höhe';
    }
    if (n.linie && a.format === 'auswahl') return stufe(a.optionen, (x) => { const l = (g?.linien ?? []).find((y) => y.n === x); return l ? det(V(n.ecke, n.fuss), V(n.ecke, l.a)) === 0 && det(V(n.ecke, n.fuss), V(n.ecke, l.b)) === 0 : undefined; });
    return null;
  },
  // Lage des Höhenschnittpunkts: im spitzwinkligen Dreieck innen, im rechtwinkligen in der Ecke mit dem rechten Winkel, im stumpfwinkligen außen.
  hoehenschnitt: (n, a) => stufe(a.optionen, (t) => {
    const x = /außerhalb/.test(t) ? 'stumpf' : /innerhalb/.test(t) ? 'spitz' : /Ecke mit dem rechten Winkel|H = C/.test(t) ? 'recht' : /Mitte von|keinen Höhenschnittpunkt/.test(t) ? 'nie' : undefined;
    return x === undefined ? undefined : x === n.dreieck;
  }),
  umkreislage: (n, a) => {
    if (!a.text.includes({ spitz: 'spitzwinklig', recht: 'rechtwinklig', stumpf: 'stumpfwinklig' }[n.dreieck])) return 'die Art des Dreiecks steht nicht im Text';
    return stufe(a.optionen, (t) => { const x = /außerhalb/.test(t) ? 'stumpf' : /innerhalb/.test(t) ? 'spitz' : /Mitte der längsten Seite/.test(t) ? 'recht' : undefined; return x === undefined ? undefined : x === n.dreieck; });
  },
  // Welche Ortslinie zu einer Bedingung gehört.
  ortslinie: (n, a) => stufe(a.optionen, (t) => {
    const x = /Winkelhalbierende/.test(t) ? 'wh' : /Mittelsenkrechte/.test(t) ? 'ms' : /Kreis/.test(t) ? 'kreis' : /Parallele/.test(t) ? 'par' : /Höhe|Seitenmitte|Schenkel/.test(t) ? 'andere' : undefined;
    return x === undefined ? undefined : x === n.was;
  }),
  // Mittelsenkrechte von AB (Koordinaten). Auf dem Gitter: die gezeichnete Gerade. In der Auswahl: die Linie im Bild.
  mittelsenkrechteAB: (n, a) => {
    const g = gitterVon(a), gleichWeit = (x) => d2(x, n.a) === d2(x, n.b), ist = (l) => l && gleichWeit(l.a) && gleichWeit(l.b) && !pGleich(l.a, l.b);
    const bed = a.bedingung, mitte = [(n.a[0] + n.b[0]) / 2, (n.a[1] + n.b[1]) / 2];
    if (a.format === 'gitter') return ((bed?.art === 'gerade' && ist(bed)) || (bed?.art === 'senkrecht' && mengeGleich(bed.zu, [n.a, n.b]) && pGleich(bed.durch, mitte))) && a.beispiel?.every(gleichWeit) ? null : 'die Bedingung ist nicht die Mittelsenkrechte';
    if (Array.isArray(n.punkt)) {
      if (!gleichWeit(n.punkt)) return 'der Punkt liegt nicht auf der Mittelsenkrechten';
      const d = zahlenIn(a.text.match(/(\d+(?:,\d+)?) cm/)?.[0])[0];
      return stufe(a.optionen, (t) => (/^\d+(,\d+)? cm$/.test(t) ? zahlenIn(t)[0] === d : /nicht wissen/.test(t) ? false : undefined));
    }
    if (n.linie) return stufe(a.optionen, (t) => { const l = (g?.linien ?? []).find((x) => x.n === t); return l ? Boolean(ist(l)) : undefined; });
    if (n.punkt) return stufe(a.optionen, (t) => { const p = (g?.punkte ?? []).find((x) => x.n === t); return p ? gleichWeit([p.x, p.y]) : undefined; });
    return null;
  },
  // Winkelhalbierende: w halbiert den Winkel zwischen u und v. Auf dem Gitter die gezeichnete Linie, in der Auswahl der Strahl im Bild.
  winkelhalbierende: (n, a) => {
    const e = (v) => [v[0] / len(v), v[1] / len(v)], s = [e(n.u)[0] + e(n.v)[0], e(n.u)[1] + e(n.v)[1]];
    const halbiert = len(s) < 1e-9 ? Math.abs(sp(n.w, n.u)) < 1e-9 : gleichGerichtet(s, n.w);
    if (!halbiert) return 'w halbiert den Winkel nicht';
    const g = gitterVon(a), aufW = (p) => Math.abs(det(n.w, V(n.s, p))) < 1e-9;
    if (a.format === 'gitter') { const bed = a.bedingung; return bed && ['gerade', 'strahl', 'strecke'].includes(bed.art) && aufW(bed.a) && aufW(bed.b) && !pGleich(bed.a, bed.b) ? null : 'die Bedingung ist nicht die Winkelhalbierende'; }
    if (n.linie) return stufe(a.optionen, (t) => { const l = (g?.linien ?? []).find((x) => x.n === t); return l ? pGleich(l.a, n.s) && gleichGerichtet(V(l.a, l.b), n.w) : undefined; });
    return null;
  },
  // Mittelparallele zweier waagerechter Parallelen y = y1 und y = y2.
  mittelparallele: (n, a) => {
    const g = gitterVon(a), y = (n.y[0] + n.y[1]) / 2;
    if (!n.y.every((h) => (g?.linien ?? []).some((l) => l.a[1] === h && l.b[1] === h))) return 'die Parallelen stehen nicht im Bild';
    return a.beispiel?.every((p) => p[1] === y) ? null : 'das Beispiel liegt nicht auf der Mittelparallelen';
  },
  // Ortsaufgabe auf dem Gitter: Die Lösung ist genau die Menge der Gitterpunkte, die alle Bedingungen erfüllen.
  ort: (n, a) => {
    const g = gitterVon(a);
    if (!g) return 'braucht ein Gitter';
    const kandidaten = n.bedingungen.find((x) => x.kandidaten)?.kandidaten;
    const alle = kandidaten ?? Array.from({ length: (g.b + 1) * (g.h + 1) }, (_, i) => [i % (g.b + 1), Math.floor(i / (g.b + 1))]);
    const soll = [];
    for (const p of alle) {
      const w = n.bedingungen.map((x) => erfuellt(x, p));
      if (w.includes(undefined)) return `unbekannte Bedingung ${n.bedingungen[w.indexOf(undefined)].art}`;
      if (w.every(Boolean)) soll.push(p);
    }
    if (!soll.length) return 'kein Gitterpunkt erfüllt die Bedingungen';
    const ist = a.eingabe === 'kreis' ? [a.bedingung?.m] : a.loesung ?? [];
    return mengeGleich(soll, ist) ? null : `die Bedingungen erfüllen ${soll.map((p) => `(${p.join('|')})`).join(', ')}`;
  },
  // Konstruktionsschritte in fester Reihenfolge: Die Lösung ist die Reihenfolge der Schritte, die Karten sind gemischt.
  schritte: (n, a) => (a.format === 'ordnen' && (a.loesung ?? []).length >= 3 && a.karten?.join('|') !== a.loesung.join('|') && [...a.karten].sort().join('|') === [...a.loesung].sort().join('|') ? null : 'Karten und Schritte passen nicht zusammen'),
};
for (const [k, f] of Object.entries(DREIECK_SONDER)) DREIECK_SONDER[k] = (n, a) => { mitUrteil = (a.nachweis ?? []).some((x) => x?.art === 'urteil'); return f(n, a); };
export const DREIECK_ERGEBNIS = Object.fromEntries(Object.keys(DREIECK_SONDER).map((k) => [k, (n) => n.ergebnis ?? []]));
export const DREIECK_ARTEN = Object.keys(DREIECK_SONDER);

// ---------- Sprache ----------
// Fachsprache in Klasse 7 Kapitel 2: keine Hypotenuse und keine Katheten (Grilling mit Nils, 2026-11-25), Winkel mit griechischen Buchstaben.
export function dreieckSprachMaengel(a, texte) {
  const m = [], alle = texte.join(' \n ');
  if (/Hypotenuse|Kathete/.test(alle)) m.push('Hypotenuse und Kathete kommen erst in Klasse 9');
  if (/(?<![A-Za-zÄÖÜäöüß])(alpha|beta|gamma)(?![A-Za-zäöü])/i.test(alle)) m.push('Winkel heißen α, β, γ');
  if (/\d,\d{3,}/.test(alle)) m.push('eine Zahl hat mehr als zwei Nachkommastellen');
  if (/\d\.\d/.test(alle)) m.push('eine Zahl steht mit Punkt statt Komma');
  return m;
}
