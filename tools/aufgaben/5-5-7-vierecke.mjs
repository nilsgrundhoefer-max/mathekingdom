// Aufgaben zu 5.5.7 bis 5.5.9 „Vierecke“ (Lernziele V1 bis V4) nach ADR 0015 und ADR 0032.
// V1 Rechteck und Quadrat, V2 Parallelogramm und Raute, V3 Trapez und Drachen, V4 Haus der Vierecke.
// Vierecke werden über Seiten, rechte Winkel und Symmetrieachsen beschrieben; Diagonalen kommen erst ab M vor.
// Die Ecken laufen gegen den Uhrzeigersinn. Ein Trapez hat mindestens ein Paar paralleler Seiten (Haus der Vierecke).
import { sechs, zahl, auswahl, opt, luecken, zuordnen, gitterPunkte, gitterLinie, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind, zweiKinder } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, FG, plus, minus, senk, drin, kreuzP, skalarP, schiebe } from './5-5-geo.mjs';
import { ACHSE } from '../werkzeug.mjs';

const P = (p) => `(${p[0]}|${p[1]})`;
const KAESTCHEN = HILFSZAHL(1, '2 Kästchen sind 1 cm');
const norm = (e) => { const mx = Math.min(...e.map((p) => p[0])), my = Math.min(...e.map((p) => p[1])); return e.map((p) => [p[0] - mx, p[1] - my]); };
const groesse = (e) => [Math.max(...e.map((p) => p[0])), Math.max(...e.map((p) => p[1]))];
const l2 = (a, b) => skalarP(minus(b, a), minus(b, a));
// Eigenschaften eines Vierecks aus seinen Ecken (wie der Prüfer, hier für Antworten und Hinweise).
function eig(e) {
  const s = [0, 1, 2, 3].map((i) => minus(e[(i + 1) % 4], e[i])), len = s.map((v) => skalarP(v, v));
  const par = [kreuzP(s[0], s[2]) === 0, kreuzP(s[1], s[3]) === 0], rechte = [0, 1, 2, 3].filter((i) => skalarP(s[i], s[(i + 1) % 4]) === 0).length;
  const gleichlang = len.every((x) => x === len[0]), drachen = (len[0] === len[3] && len[1] === len[2]) || (len[0] === len[1] && len[2] === len[3]);
  const namen = [];
  if (rechte === 4 && gleichlang) namen.push('Quadrat');
  if (rechte === 4) namen.push('Rechteck');
  if (gleichlang) namen.push('Raute');
  if (par[0] && par[1]) namen.push('Parallelogramm');
  if (drachen) namen.push('Drachen');
  if (par[0] || par[1]) namen.push('Trapez');
  const paare = par.filter(Boolean).length, d1 = minus(e[2], e[0]), d2 = minus(e[3], e[1]);
  const gleichschenklig = paare === 1 && (par[0] ? len[1] === len[3] : len[0] === len[2]);
  const achsen = namen.includes('Quadrat') ? 4 : namen.includes('Rechteck') || namen.includes('Raute') ? 2 : drachen || gleichschenklig ? 1 : 0;
  return { namen, genau: namen[0] ?? 'Viereck', paare, par, rechte, gleichlang, achsen, punkt: paare === 2,
    dGleich: skalarP(d1, d1) === skalarP(d2, d2), dSenkrecht: skalarP(d1, d2) === 0, dHalb: e[0][0] + e[2][0] === e[1][0] + e[3][0] && e[0][1] + e[2][1] === e[1][1] + e[3][1] };
}
// Vierecke, Ecken gegen den Uhrzeigersinn, linke untere Ecke des Rahmens bei (0|0).
const V = {
  rechteck: () => { const [w, h] = suche(() => [zz(2, 6), zz(2, 5)], ([a, b]) => a !== b); return [[0, 0], [w, 0], [w, h], [0, h]]; },
  quadrat: () => { const s = zz(2, 4); return [[0, 0], [s, 0], [s, s], [0, s]]; },
  quadratSchraeg: () => { const v = wahl([[1, 1], [2, 2], [2, 1], [1, 2], [3, 1]]), u = senk(v); return norm([[0, 0], v, plus(v, u), u]); },
  rechteckSchraeg: () => { const [k, m] = wahl([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3]]), v = [k, k], u = [-m, m]; return norm([[0, 0], v, plus(v, u), u]); },
  parallelogramm: () => { const [w, s, h] = suche(() => [zz(2, 5), wahl([-2, -1, 1, 2, 3]), zz(2, 4)], ([a, b, c]) => a * a !== b * b + c * c); return norm([[0, 0], [w, 0], [w + s, h], [s, h]]); },
  parallelogrammSchief: () => { const [v, u] = suche(() => [wahl([[3, 1], [4, 1], [2, 1], [3, -1]]), wahl([[1, 2], [1, 3], [-1, 3], [2, 3]])], ([a, b]) => skalarP(a, b) !== 0 && skalarP(a, a) !== skalarP(b, b) && kreuzP(a, b) > 0); return norm([[0, 0], v, plus(v, u), u]); },
  raute: () => { const [a, b] = suche(() => [zz(1, 3), zz(1, 3)], ([x, y]) => x !== y); return [[a, 0], [2 * a, b], [a, 2 * b], [0, b]]; },
  rauteSchief: () => { const [v, u] = wahl([[[3, 1], [1, 3]], [[2, 1], [1, 2]], [[5, 0], [3, 4]], [[4, 1], [1, 4]]]); return norm([[0, 0], v, plus(v, u), u]); },
  trapez: () => { const [w, d, h] = suche(() => [zz(4, 7), zz(1, 2), zz(2, 4)], ([a, b]) => a - 2 * b >= 1); return [[0, 0], [w, 0], [w - d, h], [d, h]]; },
  trapezRecht: () => { const [w, t, h] = suche(() => [zz(3, 6), zz(1, 5), zz(2, 4)], ([a, b]) => a !== b && b < a); return [[0, 0], [w, 0], [t, h], [0, h]]; },
  trapezSchief: () => { const [w, l, r, h] = suche(() => [zz(4, 7), zz(1, 3), zz(2, 7), zz(2, 4)], ([a, b, c]) => c - b >= 1 && c - b !== a && a - c !== b && c <= a + 1 && a - c >= 0); return [[0, 0], [w, 0], [r, h], [l, h]]; },
  drachen: () => { const [a, c, d] = suche(() => [zz(1, 3), zz(1, 4), zz(1, 4)], ([, x, y]) => x !== y && x + y <= 6); return [[a, 0], [2 * a, c], [a, c + d], [0, c]]; },
  drachenQuer: () => { const [a, c, d] = suche(() => [zz(1, 2), zz(1, 4), zz(1, 4)], ([, x, y]) => x !== y && x + y <= 6); return [[0, a], [c, 0], [c + d, a], [c, 2 * a]]; },
  drachenSchraeg: () => wahl([[[0, 0], [3, 1], [5, 5], [1, 3]], [[0, 0], [2, 1], [5, 5], [1, 2]], [[0, 0], [4, 1], [5, 5], [1, 4]]]),
  allgemein: () => suche(() => [[0, 0], [zz(3, 5), zz(0, 1)], [zz(3, 5), zz(3, 4)], [zz(0, 2), zz(2, 4)]], (e) => { const x = eig(e), s = [0, 1, 2, 3].map((i) => minus(e[(i + 1) % 4], e[i]));
    return x.namen.length === 0 && x.rechte === 0 && s.every((v, i) => kreuzP(v, s[(i + 1) % 4]) > 2) && e[3][0] < e[2][0] - 1; }),
};
const form = (key, maxB = 9, maxH = 9) => suche(() => V[key](), (e) => groesse(e)[0] <= maxB && groesse(e)[1] <= maxH);
const lage = (e, i) => { const c = [e.reduce((s, p) => s + p[0], 0) / e.length, e.reduce((s, p) => s + p[1], 0) / e.length], dx = e[i][0] - c[0], dy = e[i][1] - c[1];
  return ((Math.abs(dx) < 0.6 ? '' : dx > 0 ? 'r' : 'l') + (Math.abs(dy) < 0.6 ? '' : dy > 0 ? 'o' : 'u')) || 'ro'; };
const ecknamen = (e, ohne = -1) => e.map((q, i) => PT('ABCD'[i], ...q, lage(e, i))).filter((_, i) => i !== ohne);
// Ein Viereck im Gitter: als Figur F oder mit benannten Ecken A bis D, auf Wunsch mit Diagonalen oder im Koordinatensystem.
function bild(key, { b = 9, h = 8, namen = false, ks = false, diag = false, passt = () => true } = {}) {
  const e0 = suche(() => form(key, b - 2, h - 2), passt), [w, hh] = groesse(e0), e = schiebe(e0, [zz(1, b - w - 1), zz(1, h - hh - 1)]);
  const g = GT(b, h, { ...(ks ? { achsen: true } : {}), figuren: [FG(namen ? null : 'F', e)], ...(namen ? { punkte: ecknamen(e) } : {}), ...(diag ? { linien: [LN(null, e[0], e[2], 'strecke', 'hilfs'), LN(null, e[1], e[3], 'strecke', 'hilfs')] } : {}) });
  return { e, g, x: eig(e), wer: namen ? { ecken: ['A', 'B', 'C', 'D'] } : { figur: 'F' } };
}
// Figuren A, B, C (, D) nebeneinander; vier Figuren stehen in zwei Reihen.
function reihe(schluessel) {
  const zwei = schluessel.length === 4, formen = schluessel.map((k) => form(k, 4, 4));
  const figuren = formen.map((e, i) => { const [w, hh] = groesse(e), sp = zwei ? i % 2 : i, zeile = zwei ? 1 - Math.floor(i / 2) : 0; return FG('ABCD'[i], schiebe(e, [sp * 6 + 1 + Math.floor((5 - w) / 2), zeile * 6 + 1 + Math.floor((4 - hh) / 2)])); });
  return { g: GT(zwei ? 12 : schluessel.length * 6, zwei ? 12 : 6, { figuren }), x: formen.map(eig) };
}
const ARTIKEL = { Quadrat: 'ein Quadrat', Rechteck: 'ein Rechteck', Raute: 'eine Raute', Parallelogramm: 'ein Parallelogramm', Trapez: 'ein Trapez', Drachen: 'ein Drachen', Viereck: 'ein Viereck' };

// ---------- Aufgabenbausteine ----------
// Welche Figur hat die Eigenschaft? trifft(x) entscheidet am Viereck, `was` nennt dem Prüfer dieselbe Eigenschaft.
function figWahl(text, schluessel, was, trifft, hilfen, { mehrfach = false, fv = () => 'viereck-eigenschaft' } = {}) {
  const ks = mische(schluessel), r = reihe(ks);
  return auswahl(text, ks.map((k, i) => opt(`Figur ${'ABCD'[i]}`, trifft(r.x[i]), trifft(r.x[i]) ? undefined : fv(k, r.x[i]))), hilfen, { ...(mehrfach ? { mehrfach: true } : {}), bild: B.gitter(r.g), nachweis: [{ art: 'figurenwahl', was }] });
}
// Wie heißt das Viereck? Antworten sind Vierecksnamen; der Prüfer stuft sie selbst ein.
function benenne(text, key, namen, hilfen, { fv = () => 'viereck-eigenschaft', alle = false, ...o } = {}) {
  const v = bild(key, o);
  const richtig = (n) => (alle ? v.x.namen.includes(n) : v.x.genau === n);
  return auswahl(text, namen.map((n) => opt(n, richtig(n), richtig(n) ? undefined : fv(n, v.x))), hilfen, { ...(alle ? { mehrfach: true } : {}), bild: B.gitter(v.g), nachweis: [{ art: 'viereck', ...v.wer, typ: v.x.genau }] });
}
// Eine Anzahl am Viereck: rechte Winkel, Paare paralleler Seiten oder Symmetrieachsen.
const FELD = { rechte: 'rechteWinkel', paare: 'parallelPaare', achsen: 'achsen' };
function anzahl(text, key, feld, fehler, hilfen, o = {}) {
  const v = bild(key, o), n = v.x[feld];
  return zahl(text, n, fehlerliste(n, fehler(n, v.x)), hilfen, { bild: B.gitter(v.g), nachweis: [{ art: 'viereck', ...v.wer, [FELD[feld]]: n }] });
}
// Drei Ecken sind gegeben, die vierte wird gesetzt. `fehlt` wählt die fehlende Ecke.
function ecke(text, key, typ, hilfen, { b = 10, h = 9, fehlt = () => zz(0, 3), ks = false, genau = false } = {}) {
  const e0 = form(key, b - 2, h - 2), [w, hh] = groesse(e0), e = schiebe(e0, [zz(1, b - w - 1), zz(1, h - hh - 1)]), i = fehlt(e), da = e.filter((_, k) => k !== i);
  const linien = [0, 1, 2, 3].filter((k) => k !== i && (k + 1) % 4 !== i).map((k) => LN(null, e[k], e[(k + 1) % 4], 'strecke'));
  const vor = e[(i + 3) % 4], nach = e[(i + 1) % 4], falsch = [[[vor[0], nach[1]]], [[nach[0], vor[1]]]].filter(([q]) => drin(b, h, q) && !e.some((p) => p[0] === q[0] && p[1] === q[1]));
  return gitterPunkte(text, GT(b, h, { ...(ks ? { achsen: true } : {}), punkte: ecknamen(e, i), linien }), [e[i]], falsch.slice(0, 1).map(([q]) => [[q], 'viereck-eigenschaft']), hilfen, { nachweis: [{ art: 'ergaenzen', ecken: e, typ, ...(genau ? { genau: true } : {}) }]});
}
// Die vierte Ecke eines Parallelogramms als Koordinaten.
function vierte(text, key, max, hilfen) {
  const e0 = form(key, max - 1, max - 3), [w, hh] = groesse(e0), e = schiebe(e0, [zz(1, Math.min(3, max - w)), zz(1, Math.min(3, max - 2 - hh))]), [a, b, c, d] = e;
  return luecken(text(a, b, c), { x: [d[0], fehlerliste(d[0], [[d[1], 'koord-vertauscht'], [a[0], 'viereck-eigenschaft'], [c[0], 'viereck-eigenschaft']])], y: [d[1], fehlerliste(d[1], [[d[0], 'koord-vertauscht'], [a[1], 'viereck-eigenschaft']])] }, hilfen(a, b, c, d),
    { bild: B.gitter(GT(max, max - 2, { achsen: true, punkte: ecknamen(e, 3), linien: [LN(null, a, b, 'strecke'), LN(null, b, c, 'strecke')] })), nachweis: [{ art: 'vierteEcke', ecken: ['A', 'B', 'C'], x: d[0], y: d[1], luecken: ['x', 'y'] }] });
}
// Aussagen über die Diagonalen, alle zutreffenden werden angekreuzt.
function diagonalen(text, key, hilfen, o = {}) {
  const v = bild(key, { namen: true, diag: true, ...o }), x = v.x;
  const reihen = mische([['Die Diagonalen sind gleich lang.', x.dGleich, 'viereck-eigenschaft'], ['Die Diagonalen halbieren sich.', x.dHalb, 'viereck-eigenschaft'], ['Die Diagonalen sind senkrecht zueinander.', x.dSenkrecht, 'viereck-eigenschaft'], ['Beide Diagonalen sind Symmetrieachsen.', x.namen.includes('Raute'), 'diagonale-als-achse']]);
  if (reihen.every((r) => r[1])) reihen.splice(reihen.findIndex((r) => r[0].startsWith('Beide')), 1, ['Die Diagonalen sind verschieden lang.', false, 'viereck-eigenschaft']);
  if (!reihen.some((r) => r[1])) reihen.push(['Keine dieser Aussagen stimmt.', true]);
  return auswahl(text, reihen.map(([t, ok, fv]) => opt(t, ok, ok ? undefined : fv)), hilfen, { mehrfach: true, bild: B.gitter(v.g), nachweis: [{ art: 'viereck', ...v.wer, typ: x.genau, diagonalenGleich: x.dGleich, diagonalenHalbieren: x.dHalb, diagonalenSenkrecht: x.dSenkrecht }] });
}
// Der Schnittpunkt der Diagonalen wird markiert (er liegt auf einem Gitterpunkt).
function mittelpunkt(text, key, hilfen, o = {}) {
  const v = bild(key, { namen: true, diag: true, passt: (e) => (e[0][0] + e[2][0]) % 2 === 0 && (e[0][1] + e[2][1]) % 2 === 0 && eig(e).dHalb, ...o }), m = [(v.e[0][0] + v.e[2][0]) / 2, (v.e[0][1] + v.e[2][1]) / 2];
  return gitterPunkte(text, v.g, [m], [], hilfen, { nachweis: [{ art: 'mitte', von: 'A', nach: 'C' }] });
}
// Behauptung eines Kindes über ein gezeigtes Viereck.
function urteil(text, key, stimmt, ja, nein, fakten, hilfen, { fv = 'viereck-eigenschaft', ...o } = {}) {
  const v = bild(key, o);
  return auswahl(text, [opt(ja, stimmt, stimmt ? undefined : fv), opt(nein, !stimmt, stimmt ? fv : undefined)], hilfen, { bild: B.gitter(v.g), nachweis: [U(stimmt), { art: 'viereck', ...v.wer, typ: v.x.genau, ...fakten(v.x) }] });
}
// Welche Seiten sind parallel (oder gleich lang)? Antworten nennen Seitenpaare.
function seitenpaar(text, key, hilfen, o = {}) {
  const v = bild(key, { namen: true, ...o }), paar = v.x.par[0] ? 'AB und CD' : 'BC und AD', anderes = v.x.par[0] ? 'BC und AD' : 'AB und CD';
  return auswahl(text, mische([opt(`${paar}`, true), opt(`${anderes}`, v.x.paare === 2, v.x.paare === 2 ? undefined : 'viereck-eigenschaft'), opt('AB und BC', false, 'senkrecht-parallel-verwechselt')]), hilfen, { ...(v.x.paare === 2 ? { mehrfach: true } : {}), bild: B.gitter(v.g), nachweis: [{ art: 'viereck', ...v.wer, parallelPaare: v.x.paare }] });
}
// Seitenlänge ablesen: waagerechte Seite AB oder CD in Kästchen oder cm.
function seitenlaenge(text, key, seite, einheit, hilfen) {
  const v = bild(key, { namen: true, passt: (e) => einheit !== 'cm' || (Math.abs(e[1][0] - e[0][0]) % 2 === 0 && Math.abs(e[1][0] - e[0][0]) >= 4) }), [i, j] = seite === 'AB' ? [0, 1] : [2, 3], k = Math.abs(v.e[i][0] - v.e[j][0]), n = einheit === 'cm' ? k / 2 : k;
  return zahl(text, n, fehlerliste(n, einheit === 'cm' ? [[k, 'laenge-kaestchen'], [k * 2, 'laenge-kaestchen']] : [[k + 1, 'koord-ab-eins'], [k - 1, 'koord-ab-eins']]), hilfen(k, n),
    { einheit, bild: B.gitter(v.g), nachweis: einheit === 'cm' ? [KAESTCHEN, ...N(`${k} : 2`), { art: 'strecke', von: 'ABCD'[i], nach: 'ABCD'[j], wert: n, einheit: 'cm' }] : [{ art: 'strecke', von: 'ABCD'[i], nach: 'ABCD'[j], wert: n, einheit: 'kaestchen' }] });
}
const text3 = (a, b, c, wort, zeilen) => [`Drei Ecken ${wort} ABCD sind A${P(a)}, B${P(b)} und C${P(c)}.`, 'Die Ecke D hat die Koordinaten ({{x}}|{{y}}).'].join(zeilen ? '\n' : ' ');
const schritt = (a, b) => { const v = minus(a, b), t = []; if (v[0]) t.push(`${Math.abs(v[0])} nach ${v[0] > 0 ? 'rechts' : 'links'}`); if (v[1]) t.push(`${Math.abs(v[1])} nach ${v[1] > 0 ? 'oben' : 'unten'}`); return t.join(' und '); };

export function vierecke() {
  // =====================================================================
  // 5.5.7 V1 Rechteck und Quadrat
  // =====================================================================
  const V1 = '5.5.7-V1';
  sechs(V1, 'F', [
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Rechteck?'), ['rechteck', 'parallelogramm', wahl(['trapezRecht', 'allgemein'])], 'Rechteck', (x) => x.namen.includes('Rechteck'),
      h3('Ein Rechteck hat vier rechte Winkel.', 'Prüfe bei jeder Figur alle vier Ecken.', 'Nur bei einer Figur sind alle Ecken rechte Winkel.')),
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele rechte Winkel hat es?'), wahl(['rechteck', 'trapezRecht', 'parallelogramm', 'quadrat']), 'rechte', (n) => [[n === 4 ? 2 : 4, 'viereck-eigenschaft'], [n === 0 ? 2 : n - 1, 'viereck-eigenschaft']],
      h3('Bei einem rechten Winkel treffen sich zwei Seiten wie bei einer Heftecke.', 'Prüfe jede der vier Ecken einzeln.', 'Zähle nur die Ecken, in die eine Heftecke genau passt.')),
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es genau?'), wahl(['quadrat', 'rechteck']), ['Quadrat', 'Rechteck'],
      h3('Beide Vierecke haben vier rechte Winkel.', 'Im Quadrat sind alle vier Seiten gleich lang.', 'Zähle die Kästchen an zwei Seiten und vergleiche.')),
    () => ecke(Z('Drei Ecken von einem Rechteck sind markiert.', 'Markiere die vierte Ecke.'), 'rechteck', 'Rechteck',
      h3('Ein Rechteck hat vier rechte Winkel.', 'Die Seiten gegenüber sind gleich lang.', 'Geh von einer Ecke so weit wie die Seite gegenüber.')),
    () => seitenlaenge(Z('Du siehst das Rechteck ABCD.', 'Wie viele Kästchen ist die Seite CD lang?'), 'rechteck', 'CD', 'Kästchen',
      () => h3('Zähle die Kästchen zwischen C und D.', 'Die Seite CD ist so lang wie die Seite AB.', 'Zähle Kästchen für Kästchen von D bis C.')),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Quadrat?'), ['quadrat', 'rechteck', 'raute'], 'Quadrat', (x) => x.namen.includes('Quadrat'),
      h3('Ein Quadrat hat vier rechte Winkel.', 'Im Quadrat sind alle vier Seiten gleich lang.', 'Suche die Figur mit rechten Winkeln und gleich langen Seiten.')),
  ]);
  sechs(V1, 'G', [
    () => { const v = bild('rechteck');
      return auswahl(Z('Das Viereck F ist ein Rechteck.', 'Welche Eigenschaft hat jedes Rechteck?'), mische([opt('Es hat vier rechte Winkel.', true), opt('Alle vier Seiten sind gleich lang.', false, 'viereck-eigenschaft'), opt('Es hat nur zwei rechte Winkel.', false, 'viereck-eigenschaft')]),
        h3('Schau dir die Ecken des Rechtecks an.', 'Vergleiche auch die Längen der Seiten.', 'In einem Rechteck sind alle Ecken rechte Winkel.'), { bild: B.gitter(v.g), nachweis: [{ art: 'viereck', figur: 'F', typ: 'Rechteck', rechteWinkel: 4, gleichlang: false }] }); },
    () => seitenlaenge(Z('Du siehst das Rechteck ABCD.', '2 Kästchen sind 1 cm lang.', 'Wie lang ist die Seite AB?'), 'rechteck', 'AB', 'cm',
      (k) => h3('Zähle zuerst die Kästchen von A bis B.', 'Immer 2 Kästchen zusammen sind 1 cm.', `Teile ${k} durch 2.`)),
    () => ecke(Z('Drei Ecken eines Quadrats sind markiert.', 'Markiere die vierte Ecke.'), 'quadrat', 'Quadrat',
      h3('Im Quadrat sind alle vier Seiten gleich lang.', 'Alle Ecken sind rechte Winkel.', 'Geh von einer Ecke so viele Kästchen wie eine Seite lang ist.')),
    () => benenne(Z('Das Viereck F steht auf einer Ecke.', 'Wie heißt es genau?'), 'quadratSchraeg', ['Quadrat', 'Rechteck', 'Raute'],
      h3('Dreh das Bild in Gedanken.', 'Prüfe die Ecken: Sind es rechte Winkel?', 'Vier rechte Winkel und vier gleich lange Seiten ergeben ein Quadrat.'), { fv: (n) => (n === 'Raute' ? 'lage-prototyp' : 'viereck-eigenschaft'), passt: (e) => groesse(e)[0] <= 4 }),
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Ein Quadrat ist auch ein Rechteck.“`, 'Stimmt das?'), [opt('Stimmt. Ein Quadrat hat vier rechte Winkel.', true), opt('Falsch. Im Rechteck sind zwei Seiten länger.', false, 'sonderfall-uebersehen')],
        h3('Was braucht ein Viereck, damit es ein Rechteck ist?', 'Ein Rechteck braucht vier rechte Winkel.', 'Das Quadrat hat vier rechte Winkel und sogar noch gleich lange Seiten.'), { nachweis: [U(true)] }); },
    () => vierte((a, b, c) => text3(a, b, c, 'des Rechtecks', true), 'rechteck', 10,
      (a, b, c) => h3('Im Rechteck liegen die Seiten gegenüber parallel.', 'D liegt genau über A und auf gleicher Höhe wie C.', `D hat die x-Koordinate von A und die y-Koordinate von C: ${a[0]} und ${c[1]}.`)),
  ]);
  sechs(V1, 'M', [
    () => diagonalen('Im Bild sind die Diagonalen eingezeichnet. Welche Aussagen stimmen für dieses Viereck? Kreuze alle an.', wahl(['rechteck', 'quadrat']),
      h2('Eine Diagonale verbindet zwei gegenüberliegende Ecken.', 'Im Rechteck sind die Diagonalen gleich lang und halbieren sich. Nur im Quadrat sind sie auch senkrecht zueinander.')),
    () => mittelpunkt('Die Diagonalen des Rechtecks ABCD schneiden sich in einem Punkt. Markiere diesen Punkt.', 'rechteck',
      h2('Die Diagonalen verbinden A mit C und B mit D.', 'Die Diagonalen halbieren sich. Der Schnittpunkt liegt genau in der Mitte des Rechtecks.')),
    () => ecke('Drei Ecken eines Quadrats sind markiert. Das Quadrat steht schräg. Markiere die vierte Ecke.', 'quadratSchraeg', 'Quadrat',
      h2('Auch im schrägen Quadrat sind gegenüberliegende Seiten parallel und gleich lang.', 'Zähle die Schritte nach rechts und nach oben entlang einer Seite. Die Seite gegenüber hat dieselben Schritte.')),
    () => { const v = bild(wahl(['quadrat', 'rechteck', 'quadratSchraeg']));
      return auswahl('Welche Namen passen zu dem Viereck F? Kreuze alle an.', mische([opt('Viereck', true), opt('Rechteck', true), opt('Quadrat', v.x.genau === 'Quadrat', v.x.genau === 'Quadrat' ? undefined : 'viereck-eigenschaft'), opt('Dreieck', false, 'viereck-eigenschaft')]),
        h2('Eine Figur kann mehrere Namen haben.', 'Jedes Quadrat ist auch ein Rechteck, und jedes Rechteck ist ein Viereck.'), { mehrfach: true, bild: B.gitter(v.g), nachweis: [{ art: 'viereck', figur: 'F', typ: v.x.genau, rechteWinkel: 4 }] }); },
    () => urteil(`${kind()} sagt: „Ein Viereck mit vier gleich langen Seiten ist immer ein Quadrat.“ Schau dir das Viereck F an. Stimmt das?`, 'raute', false, 'Stimmt. Vier gleich lange Seiten reichen aus.', 'Falsch. Ein Quadrat braucht auch vier rechte Winkel.', () => ({ gleichlang: true, rechteWinkel: 0 }),
      h2('Prüfe am Viereck F beide Eigenschaften eines Quadrats.', 'Das Viereck F hat vier gleich lange Seiten, aber keine rechten Winkel.')),
    () => { const [a, b] = suche(() => [zz(5, 12), zz(2, 9)], ([x, y]) => x > y + 1);
      return zahl(`Im Rechteck ABCD ist die Seite AB ${a} cm lang und die Seite BC ${b} cm lang. Wie lang sind die Seiten AB und CD zusammen?`, 2 * a, fehlerliste(2 * a, [[a + b, 'viereck-eigenschaft'], [a, 'viereck-eigenschaft']]),
        h2('Im Rechteck sind gegenüberliegende Seiten gleich lang.', 'Die Seite CD liegt gegenüber von AB. Sie ist genauso lang.'), { einheit: 'cm', nachweis: [HILFSZAHL(b, 'Länge der Seite BC'), ...N(`${a} + ${a}`)] }); },
  ]);
  sechs(V1, 'E', [
    () => vierte((a, b, c) => text3(a, b, c, 'des Quadrats'), 'quadratSchraeg', 12,
      (a, b) => h1(`Von B nach A geht es ${schritt(a, b)}. Geh von C aus dieselben Schritte.`)),
    () => auswahl('Welche Aussage stimmt?', mische([opt('Jedes Quadrat ist ein Rechteck.', true), opt('Jedes Rechteck ist ein Quadrat.', false, 'sonderfall-uebersehen'), opt('Kein Quadrat ist ein Rechteck.', false, 'sonderfall-uebersehen'), opt('Ein Rechteck hat immer zwei längere Seiten.', false, 'sonderfall-uebersehen')]),
      h1('Ein Rechteck braucht nur vier rechte Winkel. Prüfe, ob das Quadrat diese Eigenschaft hat.'), { nachweis: [U(true)] }),
    () => benenne('Das Viereck ABCD ist im Koordinatensystem eingezeichnet. Wie heißt es genau?', wahl(['quadratSchraeg', 'rechteckSchraeg']), ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm'],
      h1('Prüfe zuerst die Winkel und vergleiche dann die Schritte entlang zweier Nachbarseiten.'), { namen: true, ks: true, b: 10, h: 9, fv: (n) => (n === 'Raute' ? 'lage-prototyp' : 'viereck-eigenschaft') }),
    () => auswahl('Die Diagonalen eines Vierecks sind gleich lang und halbieren sich. Welche Figur ist es sicher?', mische([opt('Ein Rechteck.', true), opt('Ein Quadrat.', false, 'sonderfall-uebersehen'), opt('Ein Viereck ohne rechte Winkel.', false, 'viereck-eigenschaft')]),
      h1('Die Eigenschaft gilt für jedes Rechteck. Ein Quadrat hat zusätzlich senkrechte Diagonalen.'), { nachweis: [U(true)] }),
    () => mittelpunkt('Das Quadrat ABCD steht schräg. Markiere den Schnittpunkt seiner Diagonalen.', 'quadratSchraeg',
      h1('Der Schnittpunkt ist die Mitte zwischen A und C. Geh von A aus die halben Schritte bis C.')),
    () => { const v = bild('rechteckSchraeg', { namen: true });
      return auswahl('Das Rechteck ABCD steht schräg. Welche Seiten sind orthogonal zueinander? Kreuze alle an.', mische([opt('AB und BC', true), opt('BC und CD', true), opt('AB und CD', false, 'senkrecht-parallel-verwechselt'), opt('BC und AD', false, 'senkrecht-parallel-verwechselt')]),
        h1('Orthogonal heißt senkrecht. Im Rechteck stehen Nachbarseiten senkrecht aufeinander, gegenüberliegende Seiten sind parallel.'), { mehrfach: true, bild: B.gitter(v.g), nachweis: [{ art: 'viereck', ecken: ['A', 'B', 'C', 'D'], typ: 'Rechteck', rechteWinkel: 4 }] }); },
  ]);

  // =====================================================================
  // 5.5.8 V2 Parallelogramm und Raute
  // =====================================================================
  const V2 = '5.5.8-V2';
  sechs(V2, 'F', [
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Parallelogramm?'), ['parallelogramm', 'trapez', wahl(['allgemein', 'drachen'])], 'Parallelogramm', (x) => x.namen.includes('Parallelogramm'),
      h3('Im Parallelogramm sind die Seiten gegenüber parallel.', 'Das gilt für beide Paare von Seiten.', 'Suche die Figur mit zwei Paaren paralleler Seiten.')),
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es genau?'), wahl(['parallelogramm', 'raute']), ['Parallelogramm', 'Raute'],
      h3('In beiden Vierecken sind die Seiten gegenüber parallel.', 'In der Raute sind alle vier Seiten gleich lang.', 'Vergleiche zwei Seiten an einer Ecke.')),
    () => ecke(Z('Drei Ecken von einem Parallelogramm sind markiert.', 'Markiere die vierte Ecke.'), 'parallelogramm', 'Parallelogramm',
      h3('Im Parallelogramm sind die Seiten gegenüber parallel.', 'Sie sind auch gleich lang.', 'Zähle die Schritte an einer Seite und geh sie gegenüber genauso.'), { fehlt: () => wahl([2, 3]) }),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist eine Raute?'), ['raute', 'parallelogramm', 'drachen'], 'Raute', (x) => x.namen.includes('Raute'),
      h3('In der Raute sind alle vier Seiten gleich lang.', 'Die Seiten gegenüber sind parallel.', 'Suche die Figur mit vier gleich langen Seiten.')),
    () => seitenpaar(Z('Du siehst das Parallelogramm ABCD.', 'Welche Seiten sind parallel?', 'Kreuze alle Paare an.'), 'parallelogramm',
      h3('Parallel sind Seiten mit überall gleichem Abstand.', 'Im Parallelogramm gibt es zwei solche Paare.', 'Prüfe die Seiten gegenüber: AB und CD, dann BC und AD.')),
    () => seitenlaenge(Z('Du siehst das Parallelogramm ABCD.', 'Wie viele Kästchen ist die Seite CD lang?'), 'parallelogramm', 'CD', 'Kästchen',
      () => h3('Zähle die Kästchen zwischen C und D.', 'Die Seite CD ist so lang wie die Seite AB.', 'Zähle Kästchen für Kästchen von D bis C.')),
  ]);
  sechs(V2, 'G', [
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele Paare paralleler Seiten hat es?'), wahl(['parallelogramm', 'trapez', 'raute', 'allgemein']), 'paare', (n) => [[n === 2 ? 4 : 2, 'viereck-eigenschaft'], [n === 1 ? 0 : 1, 'viereck-eigenschaft']],
      h3('Ein Paar sind zwei Seiten, die zueinander parallel sind.', 'Prüfe erst die Seiten oben und unten, dann links und rechts.', 'Zähle nur die Paare, bei denen der Abstand überall gleich bleibt.')),
    () => vierte((a, b, c) => text3(a, b, c, 'des Parallelogramms', true), 'parallelogramm', 10,
      (a, b) => h3('Im Parallelogramm sind gegenüberliegende Seiten parallel und gleich lang.', 'Die Seite von C nach D verläuft wie die Seite von B nach A.', `Von B nach A geht es ${schritt(a, b)}. Geh von C aus genauso.`)),
    () => benenne(Z('Das Viereck F steht schräg im Gitter.', 'Wie heißt es genau?'), 'rauteSchief', ['Raute', 'Parallelogramm', 'Quadrat'],
      h3('Vergleiche die Längen der Seiten.', 'Prüfe dann die Ecken: Sind es rechte Winkel?', 'Vier gleich lange Seiten ohne rechte Winkel ergeben eine Raute.'), { b: 10, h: 9 }),
    () => ecke(Z('Drei Ecken einer Raute sind markiert.', 'Markiere die vierte Ecke.'), 'raute', 'Raute',
      h3('In der Raute sind alle vier Seiten gleich lang.', 'Die Raute ist symmetrisch.', 'Die fehlende Ecke liegt genau gegenüber von einer markierten Ecke.')),
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Eine Raute ist auch ein Parallelogramm.“`, 'Stimmt das?'), [opt('Stimmt. In der Raute sind gegenüberliegende Seiten parallel.', true), opt('Falsch. Im Parallelogramm sind zwei Seiten länger.', false, 'sonderfall-uebersehen')],
        h3('Was braucht ein Viereck, damit es ein Parallelogramm ist?', 'Ein Parallelogramm braucht zwei Paare paralleler Seiten.', 'Die Raute hat zwei Paare paralleler Seiten und sogar noch gleich lange Seiten.'), { nachweis: [U(true)] }); },
    () => { const v = bild('parallelogramm');
      return auswahl(Z('Das Viereck F ist ein Parallelogramm.', 'Was stimmt für jedes Parallelogramm?'), mische([opt('Gegenüberliegende Seiten sind gleich lang.', true), opt('Alle vier Seiten sind gleich lang.', false, 'viereck-eigenschaft'), opt('Es hat vier rechte Winkel.', false, 'viereck-eigenschaft')]),
        h3('Schau dir die Seiten des Parallelogramms an.', 'Vergleiche immer die zwei Seiten, die gegenüberliegen.', 'Nur die gegenüberliegenden Seiten sind sicher gleich lang.'), { bild: B.gitter(v.g), nachweis: [{ art: 'viereck', figur: 'F', typ: 'Parallelogramm', gegenGleich: true, gleichlang: false, rechteWinkel: 0 }] }); },
  ]);
  sechs(V2, 'M', [
    () => diagonalen('Im Bild sind die Diagonalen eingezeichnet. Welche Aussagen stimmen für dieses Viereck? Kreuze alle an.', wahl(['parallelogramm', 'raute']),
      h2('Im Parallelogramm halbieren sich die Diagonalen.', 'In der Raute sind die Diagonalen außerdem senkrecht zueinander und Symmetrieachsen.')),
    () => mittelpunkt('Die Diagonalen des Parallelogramms ABCD schneiden sich in einem Punkt. Markiere diesen Punkt.', 'parallelogramm',
      h2('Die Diagonalen verbinden A mit C und B mit D.', 'Die Diagonalen halbieren sich. Der Schnittpunkt ist die Mitte zwischen A und C.')),
    () => anzahl('Wie viele Symmetrieachsen hat das Viereck F?', wahl(['parallelogramm', 'raute', 'parallelogramm']), 'achsen', (n) => [[n === 0 ? 2 : 4, 'diagonale-als-achse'], [n === 0 ? 1 : 0, 'viereck-eigenschaft']],
      h2('Falte in Gedanken an jeder Diagonale und an jeder Linie durch die Mitten der Seiten.', 'Ein Parallelogramm ohne gleich lange Seiten hat keine Symmetrieachse. Bei der Raute sind beide Diagonalen Symmetrieachsen.')),
    () => benenne('Welche Namen passen zu dem Viereck F? Kreuze alle an.', wahl(['raute', 'rechteck', 'parallelogramm']), ['Raute', 'Parallelogramm', 'Rechteck', 'Quadrat'],
      h2('Ein Viereck kann mehrere Namen haben.', 'Prüfe für jeden Namen einzeln: Hat das Viereck alle Eigenschaften, die dieser Name verlangt?'), { alle: true, fv: () => 'sonderfall-uebersehen' }),
    () => { const [a, b] = suche(() => [zz(5, 12), zz(2, 9)], ([x, y]) => x > y + 1);
      return zahl(`Im Parallelogramm ABCD ist die Seite AB ${a} cm lang und die Seite BC ${b} cm lang. Wie lang sind die Seiten BC und AD zusammen?`, 2 * b, fehlerliste(2 * b, [[a + b, 'viereck-eigenschaft'], [b, 'viereck-eigenschaft']]),
        h2('Im Parallelogramm sind gegenüberliegende Seiten gleich lang.', 'Die Seite AD liegt gegenüber von BC. Sie ist genauso lang.'), { einheit: 'cm', nachweis: [HILFSZAHL(a, 'Länge der Seite AB'), ...N(`${b} + ${b}`)] }); },
    () => ecke('Drei Ecken eines Parallelogramms sind markiert. Markiere die vierte Ecke.', 'parallelogrammSchief', 'Parallelogramm',
      h2('Gegenüberliegende Seiten sind parallel und gleich lang.', 'Zähle entlang einer Seite die Schritte nach rechts und nach oben. Die Seite gegenüber hat dieselben Schritte.'), { b: 10, h: 10 }),
  ]);
  sechs(V2, 'E', [
    () => vierte((a, b, c) => text3(a, b, c, 'des Parallelogramms'), 'parallelogrammSchief', 14,
      (a, b) => h1(`Von B nach A geht es ${schritt(a, b)}. Geh von C aus dieselben Schritte.`)),
    () => auswahl('Welche Aussage stimmt?', mische([opt('Jede Raute ist ein Parallelogramm.', true), opt('Jedes Parallelogramm ist eine Raute.', false, 'sonderfall-uebersehen'), opt('Keine Raute ist ein Parallelogramm.', false, 'sonderfall-uebersehen'), opt('Ein Parallelogramm hat nie rechte Winkel.', false, 'sonderfall-uebersehen')]),
      h1('Ein Parallelogramm braucht nur zwei Paare paralleler Seiten. Prüfe, ob die Raute diese Eigenschaft hat.'), { nachweis: [U(true)] }),
    () => figWahl('Welche Vierecke sind punktsymmetrisch? Kreuze alle an.', ['parallelogramm', 'raute', 'trapez', 'drachen'], 'punktsymmetrisch', (x) => x.punkt,
      h1('Dreh jede Figur in Gedanken halb herum. Punktsymmetrisch sind genau die Vierecke mit zwei Paaren paralleler Seiten.'), { mehrfach: true, fv: () => 'punkt-achsen-verwechselt' }),
    () => benenne('Das Viereck ABCD ist im Koordinatensystem eingezeichnet. Welche Namen passen? Kreuze alle an.', wahl(['rauteSchief', 'parallelogrammSchief', 'rechteckSchraeg']), ['Parallelogramm', 'Raute', 'Rechteck', 'Quadrat'],
      h1('Prüfe der Reihe nach: Sind gegenüberliegende Seiten parallel? Sind alle Seiten gleich lang? Gibt es rechte Winkel?'), { alle: true, namen: true, ks: true, b: 10, h: 10, fv: () => 'viereck-eigenschaft' }),
    () => auswahl('Die Diagonalen eines Parallelogramms sind senkrecht zueinander. Welche Figur ist es sicher?', mische([opt('Eine Raute.', true), opt('Ein Rechteck.', false, 'viereck-eigenschaft'), opt('Ein Quadrat.', false, 'sonderfall-uebersehen')]),
      h1('Senkrechte Diagonalen hat jede Raute. Ein Quadrat ist nur ein Sonderfall davon.'), { nachweis: [U(true)] }),
    () => urteil(`${kind()} sagt: „In jedem Parallelogramm sind die Diagonalen gleich lang.“ Im Bild siehst du ein Parallelogramm mit seinen Diagonalen. Stimmt das?`, 'parallelogramm', false, 'Stimmt. Gegenüberliegende Seiten sind ja auch gleich lang.', 'Falsch. Hier ist eine Diagonale länger als die andere.', (x) => ({ diagonalenGleich: x.dGleich }),
      h1('Vergleiche die beiden Diagonalen im Bild. Gleich lang sind sie nur im Rechteck.'), { namen: true, diag: true }),
  ]);

  // =====================================================================
  // 5.5.9 V3 Trapez und Drachen
  // =====================================================================
  const V3 = '5.5.9-V3';
  sechs(V3, 'F', [
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Trapez?'), [wahl(['trapez', 'trapezRecht']), 'drachen', 'allgemein'], 'Trapez', (x) => x.namen.includes('Trapez'),
      h3('Ein Trapez hat zwei parallele Seiten.', 'Die beiden anderen Seiten dürfen schräg sein.', 'Suche die Figur mit zwei parallelen Seiten.')),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Drachen?'), ['drachen', 'trapez', 'parallelogramm'], 'Drachen', (x) => x.namen.includes('Drachen'),
      h3('Ein Drachen ist symmetrisch.', 'Er hat zwei kurze Seiten nebeneinander und zwei lange Seiten nebeneinander.', 'Suche die Figur mit einer Symmetrieachse von Ecke zu Ecke.')),
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es?'), wahl(['trapez', 'drachen', 'trapezRecht']), ['Trapez', 'Drachen'],
      h3('Ein Trapez hat zwei parallele Seiten.', 'Ein Drachen hat eine Symmetrieachse von Ecke zu Ecke.', 'Prüfe zuerst: Gibt es zwei parallele Seiten?')),
    () => seitenpaar(Z('Du siehst das Trapez ABCD.', 'Welche Seiten sind parallel?'), 'trapez',
      h3('Parallel sind Seiten mit überall gleichem Abstand.', 'Im Trapez gibt es ein solches Paar.', 'Vergleiche die Seite unten mit der Seite oben.')),
    () => ecke(Z('Drei Ecken von einem Drachen sind markiert.', 'Der Drachen ist symmetrisch.', 'Markiere die vierte Ecke.'), 'drachen', 'Drachen',
      h3('Die Symmetrieachse geht von der Ecke unten zur Ecke oben.', 'Die fehlende Ecke ist das Spiegelbild einer markierten Ecke.', 'Zähle die Kästchen bis zur Achse und geh auf der anderen Seite genauso weit.'), { fehlt: () => wahl([1, 3]) }),
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele Symmetrieachsen hat es?'), wahl(['trapez', 'drachen', 'trapezSchief', 'trapezRecht']), 'achsen', (n) => [[n === 1 ? 2 : 1, 'diagonale-als-achse'], [n === 1 ? 0 : 2, 'diagonale-als-achse']],
      h3('Falte die Figur in Gedanken.', 'Bei einer Symmetrieachse liegen beide Hälften genau aufeinander.', 'Probiere die Linie durch die Mitte der Figur.')),
  ]);
  sechs(V3, 'G', [
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele Paare paralleler Seiten hat es?'), wahl(['trapez', 'drachen', 'parallelogramm', 'trapezRecht']), 'paare', (n) => [[n === 2 ? 4 : 2, 'viereck-eigenschaft'], [n === 1 ? 0 : 1, 'viereck-eigenschaft']],
      h3('Ein Paar sind zwei Seiten, die zueinander parallel sind.', 'Prüfe erst die Seiten oben und unten, dann links und rechts.', 'Ein Trapez hat ein Paar, ein Drachen hat keines.')),
    () => benenne(Z('Schau dir das Viereck F genau an.', 'Wie heißt es?'), wahl(['trapezRecht', 'drachenQuer', 'trapezSchief']), ['Trapez', 'Drachen', 'Rechteck'],
      h3('Prüfe zuerst: Gibt es parallele Seiten?', 'Ein Rechteck braucht vier rechte Winkel.', 'Ein Drachen kann auch auf der Seite liegen.'), { fv: (n) => (n === 'Rechteck' ? 'viereck-eigenschaft' : 'lage-prototyp') }),
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele rechte Winkel hat es?'), wahl(['trapezRecht', 'trapez', 'rechteck', 'trapezRecht']), 'rechte', (n) => [[n === 4 ? 2 : 4, 'viereck-eigenschaft'], [n === 0 ? 2 : n === 2 ? 1 : 3, 'viereck-eigenschaft']],
      h3('Bei einem rechten Winkel treffen sich zwei Seiten wie bei einer Heftecke.', 'Prüfe jede der vier Ecken einzeln.', 'Ein Trapez kann zwei rechte Winkel haben.')),
    () => ecke(Z('Drei Ecken eines Drachens sind markiert.', 'Der Drachen liegt auf der Seite.', 'Markiere die vierte Ecke.'), 'drachenQuer', 'Drachen',
      h3('Die Symmetrieachse geht von der Ecke links zur Ecke rechts.', 'Die fehlende Ecke ist das Spiegelbild einer markierten Ecke.', 'Zähle die Kästchen bis zur Achse und geh auf der anderen Seite genauso weit.'), { fehlt: () => wahl([1, 3]) }),
    () => { const v = bild('drachen');
      return auswahl(Z('Das Viereck F ist ein Drachen.', 'Was stimmt für jeden Drachen?'), mische([opt('Er hat zwei Paare gleich langer Nachbarseiten.', true), opt('Er hat zwei Paare paralleler Seiten.', false, 'viereck-eigenschaft'), opt('Er hat vier rechte Winkel.', false, 'viereck-eigenschaft')]),
        h3('Nachbarseiten treffen sich an einer Ecke.', 'Vergleiche die beiden Seiten oben und die beiden Seiten unten.', 'Oben sind zwei Seiten gleich lang, unten auch.'), { bild: B.gitter(v.g), nachweis: [{ art: 'viereck', figur: 'F', typ: 'Drachen', parallelPaare: 0, achsen: 1 }] }); },
    () => urteil(Z(`${kind()} sagt: „Jedes Trapez hat eine Symmetrieachse.“`, 'Schau dir das Trapez F an.', 'Stimmt das?'), 'trapezSchief', false, 'Stimmt. Jedes Trapez hat eine Symmetrieachse.', 'Falsch. Dieses Trapez hat keine Symmetrieachse.', () => ({ achsen: 0 }),
      h3('Falte das Trapez F in Gedanken in der Mitte.', 'Die beiden schrägen Seiten sind verschieden lang.', 'Die Hälften liegen nicht aufeinander.'), { fv: 'diagonale-als-achse' }),
  ]);
  sechs(V3, 'M', [
    () => diagonalen('Im Bild sind die Diagonalen eingezeichnet. Welche Aussagen stimmen für dieses Viereck? Kreuze alle an.', wahl(['drachen', 'trapez', 'drachenQuer']),
      h2('Im Drachen sind die Diagonalen senkrecht zueinander. Nur eine von ihnen ist eine Symmetrieachse.', 'Im symmetrischen Trapez sind die Diagonalen gleich lang, aber sie halbieren sich nicht.')),
    () => benenne('Welche Namen passen zu dem Viereck F? Kreuze alle an.', wahl(['trapez', 'drachen', 'parallelogramm', 'raute']), ['Trapez', 'Drachen', 'Parallelogramm', 'Rechteck'],
      h2('Ein Trapez hat mindestens ein Paar paralleler Seiten. Ein Drachen hat zwei Paare gleich langer Nachbarseiten.', 'Ein Parallelogramm ist auch ein Trapez. Eine Raute ist auch ein Drachen.'), { alle: true, fv: () => 'sonderfall-uebersehen' }),
    () => { const v = bild(wahl(['drachen', 'drachenQuer', 'trapez']), { b: 10, h: 9 }), quer = v.e[0][1] === v.e[2][1], m = quer ? v.e[0][1] : (v.e[0][0] + v.e[1][0]) / 2, drachen = v.x.genau === 'Drachen';
      const a = drachen ? v.e[0] : [m, 0], b_ = drachen ? v.e[2] : [m, 1];
      if (!Number.isInteger(m)) return null;
      return gitterLinie(`Das Viereck F ist ${drachen ? 'ein Drachen' : 'ein symmetrisches Trapez'}. Zeichne seine Symmetrieachse ein.`, v.g, 'gerade', { art: 'gerade', a, b: b_ }, [a, b_], [],
        h2(drachen ? 'Beim Drachen geht die Symmetrieachse durch zwei Ecken.' : 'Beim Trapez geht die Symmetrieachse durch die Mitten der parallelen Seiten.', 'Falte in Gedanken: Beide Hälften müssen genau aufeinanderliegen.'), { nachweis: [{ art: 'achseZeichnen', figur: 'F' }] }); },
    () => { const [a, b] = suche(() => [zz(3, 9), zz(5, 14)], ([x, y]) => y > x + 1);
      return zahl(`Im Drachen ABCD ist die Diagonale AC die Symmetrieachse. Die Seite AB ist ${a} cm lang und die Seite BC ${b} cm lang. Wie lang sind die Seiten BC und CD zusammen?`, 2 * b, fehlerliste(2 * b, [[a + b, 'viereck-eigenschaft'], [b, 'viereck-eigenschaft']]),
        h2('Beim Spiegeln an AC landet B auf D.', 'Die Seite CD ist das Spiegelbild der Seite CB. Sie ist genauso lang.'), { einheit: 'cm', nachweis: [HILFSZAHL(a, 'Länge der Seite AB'), ...N(`${b} + ${b}`)] }); },
    () => figWahl('Welche Vierecke haben genau eine Symmetrieachse? Kreuze alle an.', ['trapez', 'drachen', 'parallelogramm', 'trapezSchief'], '1 Achse', (x) => x.achsen === 1,
      h2('Falte jede Figur in Gedanken.', 'Ein Drachen und ein symmetrisches Trapez haben je eine Symmetrieachse. Ein Parallelogramm hat keine.'), { mehrfach: true, fv: () => 'diagonale-als-achse' }),
    () => urteil(`${kind()} sagt: „Im Drachen sind die Diagonalen senkrecht zueinander.“ Im Bild siehst du einen Drachen mit seinen Diagonalen. Stimmt das?`, wahl(['drachen', 'drachenQuer']), true, 'Stimmt. Die Diagonalen bilden rechte Winkel.', 'Falsch. Die Diagonalen sind nur gleich lang.', () => ({ diagonalenSenkrecht: true }),
      h2('Eine Diagonale ist die Symmetrieachse.', 'Die andere Diagonale verbindet einen Punkt mit seinem Spiegelbild. Sie steht deshalb senkrecht auf der Achse.'), { namen: true, diag: true }),
  ]);
  sechs(V3, 'E', [
    () => benenne('Das Viereck ABCD ist im Koordinatensystem eingezeichnet. Wie heißt es genau?', wahl(['drachenSchraeg', 'trapezSchief', 'drachenQuer']), ['Drachen', 'Raute', 'Trapez', 'Parallelogramm'],
      h1('Prüfe zuerst, ob es parallele Seiten gibt. Vergleiche danach die Längen der Nachbarseiten über die Schritte nach rechts und nach oben.'), { namen: true, ks: true, b: 10, h: 9 }),
    () => auswahl('Ein Viereck hat genau ein Paar paralleler Seiten. Welche Figur kann es sein?', mische([opt('Ein Trapez.', true), opt('Ein Parallelogramm.', false, 'viereck-eigenschaft'), opt('Eine Raute.', false, 'viereck-eigenschaft'), opt('Ein Drachen.', false, 'viereck-eigenschaft')]),
      h1('Parallelogramm und Raute haben zwei Paare paralleler Seiten. Ein Drachen mit parallelen Seiten ist schon eine Raute.'), { nachweis: [U(true)] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Jede Raute ist auch ein Drachen.“ Stimmt das?`, [opt('Stimmt. In der Raute sind Nachbarseiten gleich lang.', true), opt('Falsch. Ein Drachen hat immer zwei kurze und zwei lange Seiten.', false, 'sonderfall-uebersehen')],
        h1('Ein Drachen braucht zwei Paare gleich langer Nachbarseiten. In der Raute sind sogar alle vier Seiten gleich lang.'), { nachweis: [U(true)] }); },
    () => { const [w, d, h] = suche(() => [zz(4, 8), zz(1, 3), zz(2, 5)], ([a, b]) => a - 2 * b >= 2 && a % 2 === 0), p = [zz(1, 2), zz(1, 2)], e = schiebe([[0, 0], [w, 0], [w - d, h], [d, h]], p), ax = p[0] + w / 2, b = w + 4, hh = h + 4;
      return gitterPunkte('Das Trapez ABCD ist symmetrisch zur gestrichelten Achse. Die Ecken A, B und C sind markiert. Setze die Ecke D.', GT(b, hh, { punkte: ecknamen(e, 3), linien: [LN(null, e[0], e[1], 'strecke'), LN(null, e[1], e[2], 'strecke'), ACHSE([ax, 0], [ax, 1])] }), [e[3]], [[[[e[0][0], e[2][1]]], 'spiegel-abstand']],
        h1('Die Ecke D ist das Spiegelbild der Ecke C. Zähle die Kästchen von C bis zur Achse und geh auf der anderen Seite genauso weit.'), { nachweis: [{ art: 'spiegeln', an: 'achse', von: [e[2]] }] }); },
    () => figWahl('Bei welchen Vierecken sind die Diagonalen orthogonal zueinander? Kreuze alle an.', ['drachen', 'raute', 'trapez', 'rechteck'], 'diagonalenSenkrecht', (x) => x.dSenkrecht,
      h1('Zeichne in Gedanken beide Diagonalen ein. Orthogonal sind sie im Drachen und in der Raute, denn dort ist eine Diagonale die Symmetrieachse.'), { mehrfach: true }),
    () => { const [a, b] = suche(() => [zz(3, 9), zz(5, 14)], ([x, y]) => y > x + 1), u = 2 * a + 2 * b;
      return zahl(`Im Drachen ABCD ist die Diagonale AC die Symmetrieachse. Die Seite AB ist ${a} cm lang und die Seite BC ${b} cm lang. Wie lang sind alle vier Seiten zusammen?`, u, fehlerliste(u, [[a + b, 'viereck-eigenschaft'], [2 * a + b, 'viereck-eigenschaft']]),
        h1('Wegen der Symmetrie ist AD so lang wie AB und CD so lang wie BC. Addiere alle vier Längen.'), { einheit: 'cm', nachweis: N(`${a} + ${a} + ${b} + ${b}`) }); },
  ]);

  // =====================================================================
  // 5.5.9 V4 Haus der Vierecke
  // =====================================================================
  const V4 = '5.5.9-V4';
  sechs(V4, 'F', [
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es?'), wahl(['rechteck', 'parallelogramm', 'trapez', 'drachen']), ['Rechteck', 'Parallelogramm', 'Trapez', 'Drachen'],
      h3('Prüfe zuerst die parallelen Seiten.', 'Prüfe dann die rechten Winkel.', 'Zwei Paare paralleler Seiten ohne rechte Winkel ergeben ein Parallelogramm.')),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist ein Quadrat?'), ['quadratSchraeg', 'raute', 'rechteck'], 'Quadrat', (x) => x.namen.includes('Quadrat'),
      h3('Ein Quadrat darf auch auf einer Ecke stehen.', 'Es hat vier rechte Winkel und vier gleich lange Seiten.', 'Dreh das Bild in Gedanken.'), { fv: () => 'lage-prototyp' }),
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele rechte Winkel hat es?'), wahl(['quadrat', 'raute', 'trapezRecht', 'drachen', 'rechteck']), 'rechte', (n) => [[n === 4 ? 2 : 4, 'viereck-eigenschaft'], [n === 0 ? 2 : n - 1, 'viereck-eigenschaft']],
      h3('Bei einem rechten Winkel treffen sich zwei Seiten wie bei einer Heftecke.', 'Prüfe jede der vier Ecken einzeln.', 'Zähle nur die Ecken, in die eine Heftecke genau passt.')),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur hat vier gleich lange Seiten?'), ['raute', 'parallelogramm', 'rechteck'], 'gleichlang', (x) => x.gleichlang,
      h3('Vergleiche bei jeder Figur zwei Seiten an einer Ecke.', 'Zähle die Kästchen oder die Schritte.', 'Bei einer Figur sind alle vier Seiten gleich lang.')),
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es genau?'), wahl(['quadratSchraeg', 'raute']), ['Quadrat', 'Raute'],
      h3('Beide Vierecke haben vier gleich lange Seiten.', 'Nur das Quadrat hat vier rechte Winkel.', 'Prüfe eine Ecke mit der Heftecke.'), { fv: () => 'lage-prototyp' }),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur hat keine parallelen Seiten?'), ['drachen', 'trapez', 'parallelogramm'], 'nicht Trapez', (x) => x.paare === 0,
      h3('Parallel sind Seiten mit überall gleichem Abstand.', 'Prüfe bei jeder Figur die Seiten gegenüber.', 'Beim Drachen laufen alle Seiten schräg zueinander.')),
  ]);
  sechs(V4, 'G', [
    () => figWahl(Z('Schau dir die vier Figuren an.', 'Welche Figuren haben zwei Paare paralleler Seiten?', 'Kreuze alle an.'), ['rechteck', 'parallelogramm', 'trapez', 'drachen'], 'Parallelogramm', (x) => x.paare === 2,
      h3('Prüfe bei jeder Figur die Seiten gegenüber.', 'Zwei Paare paralleler Seiten hat jedes Parallelogramm.', 'Auch das Rechteck hat zwei Paare paralleler Seiten.'), { mehrfach: true }),
    () => { const k = kind();
      return auswahl(Z(`${k} sagt: „Jedes Rechteck ist auch ein Parallelogramm.“`, 'Stimmt das?'), [opt('Stimmt. Im Rechteck sind gegenüberliegende Seiten parallel.', true), opt('Falsch. Ein Parallelogramm ist immer schief.', false, 'sonderfall-uebersehen')],
        h3('Was braucht ein Viereck, damit es ein Parallelogramm ist?', 'Ein Parallelogramm braucht zwei Paare paralleler Seiten.', 'Das Rechteck hat zwei Paare paralleler Seiten und sogar noch rechte Winkel.'), { nachweis: [U(true)] }); },
    () => benenne(Z('Schau dir das Viereck F an.', 'Wie heißt es genau?'), wahl(['quadrat', 'rechteck', 'raute', 'parallelogramm', 'trapez', 'drachen']), ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'],
      h3('Zähle zuerst die Paare paralleler Seiten.', 'Prüfe dann rechte Winkel und gleich lange Seiten.', 'Wähle den Namen, zu dem alle Eigenschaften passen.')),
    () => auswahl(Z('Ein Viereck hat vier rechte Winkel.', 'Alle vier Seiten sind gleich lang.', 'Wie heißt das Viereck genau?'), mische([opt('Quadrat', true), opt('Rechteck', false, 'sonderfall-uebersehen'), opt('Raute', false, 'viereck-eigenschaft'), opt('Trapez', false, 'viereck-eigenschaft')]),
      h3('Vier rechte Winkel hat jedes Rechteck.', 'Vier gleich lange Seiten hat jede Raute.', 'Beides zusammen hat nur das Quadrat.'), { nachweis: [U(true)] }),
    () => anzahl(Z('Schau dir das Viereck F an.', 'Wie viele Symmetrieachsen hat es?'), wahl(['quadrat', 'rechteck', 'raute', 'drachen', 'parallelogramm']), 'achsen', (n) => [[n === 4 ? 2 : n === 2 ? 4 : n === 1 ? 2 : 2, 'diagonale-als-achse'], [n === 0 ? 1 : n - 1, 'viereck-eigenschaft']],
      h3('Falte die Figur in Gedanken an verschiedenen Linien.', 'Prüfe Linien durch die Mitten der Seiten und Linien von Ecke zu Ecke.', 'Zähle nur die Linien, bei denen beide Hälften genau aufeinanderliegen.')),
    () => figWahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist punktsymmetrisch?'), ['parallelogramm', 'trapez', 'drachen'], 'punktsymmetrisch', (x) => x.punkt,
      h3('Dreh jede Figur in Gedanken halb herum.', 'Eine punktsymmetrische Figur sieht danach genauso aus wie vorher.', 'Das Parallelogramm sieht nach der halben Drehung genauso aus.'), { fv: () => 'punkt-achsen-verwechselt' }),
  ]);
  sechs(V4, 'M', [
    () => benenne('Welche Namen passen zu dem Viereck F? Kreuze alle an.', wahl(['rechteck', 'raute', 'parallelogramm', 'drachen']), ['Rechteck', 'Raute', 'Trapez', 'Drachen'],
      h2('Im Haus der Vierecke erbt jede Figur die Namen der Figuren, die weniger Eigenschaften verlangen.', 'Prüfe für jeden Namen einzeln, ob das Viereck F seine Eigenschaften hat.'), { alle: true, fv: () => 'sonderfall-uebersehen' }),
    () => auswahl('Welches Viereck ist zugleich ein Rechteck und eine Raute?', mische([opt('Quadrat', true), opt('Parallelogramm', false, 'sonderfall-uebersehen'), opt('Trapez', false, 'viereck-eigenschaft'), opt('Drachen', false, 'viereck-eigenschaft')]),
      h2('Ein Rechteck hat vier rechte Winkel, eine Raute hat vier gleich lange Seiten.', 'Gesucht ist das Viereck, das beide Eigenschaften zugleich hat.'), { nachweis: [U(true)] }),
    () => auswahl('Welche Aussagen stimmen? Kreuze alle an.', mische([opt('Jedes Quadrat ist eine Raute.', true), opt('Jede Raute ist ein Quadrat.', false, 'sonderfall-uebersehen'), opt('Jedes Rechteck ist ein Parallelogramm.', true), opt('Jedes Parallelogramm ist ein Rechteck.', false, 'sonderfall-uebersehen')]),
      h2('Ein Sonderfall hat alle Eigenschaften der allgemeineren Figur und noch weitere.', 'Umgekehrt gilt das nicht: Die allgemeinere Figur hat nicht alle Eigenschaften des Sonderfalls.'), { mehrfach: true, nachweis: [U(true)] }),
    () => figWahl('Welche Figuren sind Trapeze? Ein Trapez hat mindestens ein Paar paralleler Seiten. Kreuze alle an.', ['rechteck', 'trapez', 'drachen', 'parallelogramm'], 'Trapez', (x) => x.paare >= 1,
      h2('Prüfe bei jeder Figur, ob es mindestens ein Paar paralleler Seiten gibt.', 'Auch Parallelogramm und Rechteck erfüllen diese Bedingung. Sie sind besondere Trapeze.'), { mehrfach: true, fv: () => 'sonderfall-uebersehen' }),
    () => zuordnen('Ordne jedem Viereck die passende Beschreibung zu. Jede Beschreibung kommt genau einmal vor.', mische([['Rechteck', 'vier rechte Winkel'], ['Raute', 'vier gleich lange Seiten'], ['Trapez', 'genau ein Paar paralleler Seiten'], ['Drachen', 'zwei Paare gleich langer Nachbarseiten']]),
      h2('Beginne mit dem Viereck, bei dem nur eine Beschreibung passt.', 'Auch die Raute hat gleich lange Nachbarseiten. Sie bekommt aber die Beschreibung, die nur zu ihr passt.')),
    () => urteil(`${kind()} sagt: „Ein Viereck mit zwei gleich langen Diagonalen ist immer ein Rechteck.“ Schau dir das Viereck im Bild an. Stimmt das?`, 'trapez', false, 'Stimmt. Gleich lange Diagonalen gibt es nur im Rechteck.', 'Falsch. Auch dieses Trapez hat gleich lange Diagonalen.', () => ({ diagonalenGleich: true }),
      h2('Vergleiche die beiden Diagonalen im Bild.', 'Das symmetrische Trapez hat gleich lange Diagonalen, aber keine vier rechten Winkel.'), { namen: true, diag: true }),
  ]);
  sechs(V4, 'E', [
    () => benenne('Das Viereck ABCD ist im Koordinatensystem eingezeichnet. Welche Namen passen? Kreuze alle an.', wahl(['rauteSchief', 'rechteckSchraeg', 'parallelogrammSchief', 'drachenSchraeg']), ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Trapez', 'Drachen'],
      h1('Bestimme zuerst den genauen Namen über parallele Seiten, Seitenlängen und rechte Winkel. Alle Namen, die weniger verlangen, passen dann auch.'), { alle: true, namen: true, ks: true, b: 10, h: 10, fv: () => 'sonderfall-uebersehen' }),
    () => auswahl('Ein Viereck ist zugleich ein Drachen und ein Parallelogramm. Welche Figur ist es sicher?', mische([opt('Eine Raute.', true), opt('Ein Rechteck.', false, 'viereck-eigenschaft'), opt('Ein Quadrat.', false, 'sonderfall-uebersehen'), opt('Ein Viereck ohne parallele Seiten.', false, 'viereck-eigenschaft')]),
      h1('Im Drachen sind Nachbarseiten gleich lang, im Parallelogramm gegenüberliegende Seiten. Zusammen sind alle vier Seiten gleich lang.'), { nachweis: [U(true)] }),
    () => auswahl('Welche Aussagen stimmen? Kreuze alle an.', mische([opt('Jede Raute ist ein Drachen.', true), opt('Jeder Drachen ist eine Raute.', false, 'sonderfall-uebersehen'), opt('Jedes Parallelogramm ist ein Trapez.', true), opt('Jedes Trapez ist ein Parallelogramm.', false, 'sonderfall-uebersehen')]),
      h1('Ein Sonderfall hat alle Eigenschaften der allgemeineren Figur. Prüfe bei jeder Aussage, welche Figur mehr Eigenschaften verlangt.'), { mehrfach: true, nachweis: [U(true)] }),
    () => figWahl('Welche Figuren sind Drachen? Ein Drachen hat zwei Paare gleich langer Nachbarseiten. Kreuze alle an.', ['quadratSchraeg', 'raute', 'drachen', 'rechteck'], 'Drachen', (x) => x.namen.includes('Drachen'),
      h1('Prüfe an jeder Figur die Nachbarseiten. Auch Raute und Quadrat erfüllen die Bedingung, das Rechteck nicht.'), { mehrfach: true, fv: () => 'sonderfall-uebersehen' }),
    () => auswahl('Ein Viereck hat genau zwei Symmetrieachsen. Beide gehen durch Ecken. Welche Figur ist es?', mische([opt('Eine Raute, die kein Quadrat ist.', true), opt('Ein Rechteck, das kein Quadrat ist.', false, 'diagonale-als-achse'), opt('Ein Quadrat.', false, 'viereck-eigenschaft'), opt('Ein Trapez mit genau einem Paar paralleler Seiten.', false, 'viereck-eigenschaft')]),
      h1('Beim Rechteck gehen die Symmetrieachsen durch die Mitten der Seiten. Das Quadrat hat vier Symmetrieachsen.'), { nachweis: [U(true)] }),
    () => { const [k1, k2] = zweiKinder(), v = bild(wahl(['raute', 'rauteSchief']), { b: 10, h: 9 });
      return auswahl(`${k1} sagt: „Das Viereck F ist eine Raute.“ ${k2} sagt: „Das Viereck F ist ein Parallelogramm.“ Wer hat recht?`, mische([opt('Beide haben recht.', true), opt(`Nur ${k1} hat recht.`, false, 'sonderfall-uebersehen'), opt(`Nur ${k2} hat recht.`, false, 'viereck-eigenschaft'), opt('Keiner von beiden hat recht.', false, 'viereck-eigenschaft')]),
        h1('Prüfe die Eigenschaften beider Namen am Viereck F. Jede Raute ist auch ein Parallelogramm.'), { bild: B.gitter(v.g), nachweis: [{ art: 'viereck', figur: 'F', typ: 'Raute', parallelPaare: 2, gleichlang: true }] }); },
  ]);
}
