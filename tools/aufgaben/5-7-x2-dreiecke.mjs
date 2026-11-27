// Aufgaben zum Abstecher 5.7.X2 „Dreiecke“ (Lernziele D1 und D2) nach ADR 0034.
// D1: nach Seiten (gleichseitig, gleichschenklig, unregelmäßig) und nach Winkeln (spitzwinklig ab G, rechtwinklig, stumpfwinklig ab G) einteilen.
//     Die Namen schließen sich ein wie im Haus der Vierecke: Ein gleichseitiges Dreieck ist auch gleichschenklig. Die Winkelsumme kommt nur auf E vor.
// D2: F und G setzen die dritte Ecke im Gitter, M und E zeichnen im Heft und messen einen Kontrollwert. Die Begriffe SWS und WSW kommen nicht vor.
// Auf dem Karogitter gibt es kein gleichseitiges Dreieck: Gleichseitige Dreiecke stehen nur im Text.
import { sechs, zahl, auswahl, opt, gitterPunkte, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind, GT, PT, FG } from '../werkzeug.mjs';
import { zz, wahl, mische, suche } from './5-7-winkel.mjs';

const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
const kreuz = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
function eig(e) {
  const s = [d2(e[1], e[2]), d2(e[0], e[2]), d2(e[0], e[1])].sort((x, y) => x - y), gleich = (s[0] === s[1]) + (s[1] === s[2]);
  return { seiten: gleich === 2 ? 'gleichseitig' : gleich === 1 ? 'gleichschenklig' : 'unregelmäßig', winkel: s[0] + s[1] === s[2] ? 'rechtwinklig' : s[0] + s[1] < s[2] ? 'stumpfwinklig' : 'spitzwinklig' };
}
const passt = (x, name) => name === x.winkel || name === x.seiten || (name === 'gleichschenklig' && x.seiten === 'gleichseitig');
const norm = (e) => { const mx = Math.min(...e.map((p) => p[0])), my = Math.min(...e.map((p) => p[1])); return e.map((p) => [p[0] - mx, p[1] - my]); };
const groesse = (e) => [Math.max(...e.map((p) => p[0])), Math.max(...e.map((p) => p[1]))];
// Dreiecke auf dem Gitter, Ecken gegen den Uhrzeigersinn. schraeg: keine Seite waagerecht oder senkrecht am rechten Winkel.
const BAU = {
  zufall: () => [[0, 0], [zz(2, 5), zz(-1, 2)], [zz(-1, 4), zz(2, 5)]],
  spitze: () => { const k = zz(1, 3), h = zz(2, 5); return [[0, 0], [2 * k, 0], [k, h]]; },
  spitzeQuer: () => { const k = zz(1, 2), w = zz(2, 5); return [[0, k], [w, 0], [w, 2 * k]].reverse(); },
  gleichDreh: () => { const [v, u] = wahl([[[3, 1], [1, 3]], [[4, 1], [1, 4]], [[2, 1], [1, 2]], [[3, 2], [2, 3]], [[4, 2], [2, 4]]]); return [[0, 0], v, u]; },
  rechtAchse: () => [[0, 0], [zz(2, 5), 0], [0, zz(2, 5)]],
  rechtDreh: () => { const v = wahl([[2, 1], [3, 1], [1, 2], [3, 2], [2, -1]]), t = wahl([1, 2]), u = [-v[1] * t, v[0] * t]; return [[0, 0], v, u]; },
  stumpf: () => [[0, 0], [zz(4, 5), 0], [zz(-2, -1), zz(1, 3)]],
};
// Keine Splitter: Jeder Winkel hat mindestens 15°, damit man das Dreieck und seinen Namen im Bild gut sieht.
const kleinsterWinkel = (e) => Math.min(...e.map((p, i) => { const q = e[(i + 1) % 3], r = e[(i + 2) % 3], u = [q[0] - p[0], q[1] - p[1]], v = [r[0] - p[0], r[1] - p[1]];
  return (Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180) / Math.PI; }));
// Der rechte Winkel liegt an den Gitterlinien: Ein Schenkel ist waagerecht, der andere senkrecht.
const achsenRecht = (e) => e.some((p, i) => { const q = e[(i + 1) % 3], r = e[(i + 2) % 3]; return (q[1] === p[1] && r[0] === p[0]) || (q[0] === p[0] && r[1] === p[1]); });
// Auf F sind die Seiten eines unregelmäßigen Dreiecks deutlich verschieden lang (mindestens etwa 14 %), damit es nicht gleichschenklig aussieht.
const deutlichVerschieden = (e) => { const q = [d2(e[1], e[2]), d2(e[0], e[2]), d2(e[0], e[1])].sort((x, y) => x - y); return q[1] >= 1.3 * q[0] && q[2] >= 1.3 * q[1]; };
// gerade (Niveau F): nur Dreiecke, deren gleiche Seiten oder rechter Winkel an den Gitterlinien abzulesen sind, keine gedrehten.
function dreieck(soll = {}, { schraeg = false, max = 5, gerade = false } = {}) {
  const bauer = Object.keys(BAU).filter((k) => !gerade || !k.endsWith('Dreh'));
  return suche(() => { const e = norm(BAU[wahl(bauer)]()); return kreuz(...e) > 0 ? e : [e[0], e[2], e[1]]; }, (e) => { const x = eig(e), [w, h] = groesse(e);
    return Math.abs(kreuz(...e)) >= 3 && kleinsterWinkel(e) >= 15 && (!gerade || x.winkel !== 'rechtwinklig' || achsenRecht(e)) && (!gerade || x.seiten !== 'unregelmäßig' || deutlichVerschieden(e)) && w <= max && h <= max && (!soll.seiten || x.seiten === soll.seiten) && (!soll.winkel || x.winkel === soll.winkel) && (!schraeg || !e.some((p, i) => e.some((q, j) => i !== j && (p[0] === q[0] || p[1] === q[1])))); });
}
const schiebe = (e, v) => e.map((p) => [p[0] + v[0], p[1] + v[1]]);
// Ein Dreieck im Gitter (ohne Namen) oder mehrere mit den Namen A, B, C, D.
function einBild(e) { const [w, h] = groesse(e), b = w + 2 + zz(0, 2), hh = h + 2; return B.gitter(GT(b, hh, { figuren: [FG(null, schiebe(e, [zz(1, b - w - 1), 1]))] })); }
function reiheBild(liste) {
  const vier = liste.length === 4;
  const figuren = liste.map((e, i) => { const [w, h] = groesse(e), sp = vier ? i % 2 : i, zeile = vier ? 1 - Math.floor(i / 2) : 0; return FG('ABCD'[i], schiebe(e, [sp * 6 + 1 + Math.floor((5 - w) / 2), zeile * 6 + 1 + Math.floor((5 - h) / 2)])); });
  return B.gitter(GT(vier ? 12 : liste.length * 6, vier ? 12 : 7, { figuren }));
}
const FV = (richtig, name) => (name === 'gleichschenklig' && richtig === 'gleichseitig' ? 'dreieck-sonderfall' : name === 'rechtwinklig' || richtig === 'rechtwinklig' ? 'rechter-winkel-lage' : 'dreieck-art');
// Wie heißt das Dreieck? frage: 'seiten' oder 'winkel' (genau eine Antwort) oder alle passenden Namen (mehrfach).
function benenne(text, soll, namen, hilfen, { frage = null, schraeg = false, gerade = false } = {}) {
  const e = dreieck(soll, { schraeg, gerade }), x = eig(e), mehrfach = !frage;
  const ok = (n) => (frage === 'seiten' ? n === x.seiten : frage === 'winkel' ? n === x.winkel : passt(x, n));
  if (mehrfach && namen.every(ok)) return null;
  return auswahl(text, namen.map((n) => opt(n, ok(n), ok(n) ? undefined : FV(frage === 'winkel' ? x.winkel : x.seiten, n))), hilfen, { mehrfach, bild: einBild(e), nachweis: [{ art: 'dreieckGitter', figur: '', ...(frage ? { frage } : {}) }] });
}
// Welche Dreiecke haben die Eigenschaft? Antworten wie „Dreieck B“.
function welche(text, sorten, was, hilfen, { mehrfach = false, schraeg = false, gerade = false } = {}) {
  const liste = sorten.map((s) => dreieck(s, { schraeg, max: 4, gerade })), x = liste.map(eig);
  const ok = (i) => passt(x[i], was), anzahl = liste.filter((_, i) => ok(i)).length;
  if (anzahl === 0 || (!mehrfach && anzahl !== 1) || anzahl === liste.length) return null;
  return auswahl(text, liste.map((_, i) => opt(`Dreieck ${'ABCD'[i]}`, ok(i), ok(i) ? undefined : FV(was, x[i].seiten))), hilfen, { mehrfach, bild: reiheBild(liste), nachweis: [{ art: 'dreieckGitter', was }] });
}
// Dreieck aus Angaben im Text.
function ausDaten(text, daten, namen, hilfen, { frage = null, vorher = [] } = {}) {
  let x;
  if (daten.winkel) { const s = [...daten.winkel].sort((a, b) => a - b), g = (s[0] === s[1]) + (s[1] === s[2]); x = { seiten: g === 2 ? 'gleichseitig' : g === 1 ? 'gleichschenklig' : 'unregelmäßig', winkel: s[2] === 90 ? 'rechtwinklig' : s[2] > 90 ? 'stumpfwinklig' : 'spitzwinklig' }; }
  else { const s = [...daten.seiten].sort((a, b) => a - b), g = (s[0] === s[1]) + (s[1] === s[2]); x = { seiten: g === 2 ? 'gleichseitig' : g === 1 ? 'gleichschenklig' : 'unregelmäßig', winkel: s[0] ** 2 + s[1] ** 2 === s[2] ** 2 ? 'rechtwinklig' : s[0] ** 2 + s[1] ** 2 < s[2] ** 2 ? 'stumpfwinklig' : 'spitzwinklig' }; }
  const ok = (n) => (frage === 'seiten' ? n === x.seiten : frage === 'winkel' ? n === x.winkel : passt(x, n));
  return auswahl(text, namen.map((n) => opt(n, ok(n), ok(n) ? undefined : FV(frage === 'winkel' ? x.winkel : x.seiten, n))), hilfen, { mehrfach: !frage, nachweis: [...vorher, { art: 'dreieckDaten', ...daten, ...(frage ? { frage } : {}) }] });
}
const seitenSatz = (s) => `${s[0]} cm, ${s[1]} cm und ${s[2]} cm`;

// ---------- D2: dritte Ecke im Gitter ----------
const rot = (v, k = 1) => [-v[1] * k, v[0] * k];
const plus = (p, v) => [p[0] + v[0], p[1] + v[1]];
// AB liegt im Gitter; C wird aus den Bedingungen gesetzt. fehler: andere Punkte, die einen typischen Fehler zeigen.
function dritte(text, aufbau, hilfen, { achsen = false } = {}) {
  const r = aufbau();
  if (!r) return null;
  const { A, B: Bp, C, bed, fehler = [], b, h } = r;
  if ([A, Bp, C, ...fehler.map(([p]) => p)].some((p) => p[0] < 0 || p[1] < 0 || p[0] > b || p[1] > h)) return null;
  const g = GT(b, h, { ...(achsen ? { achsen: true } : {}), punkte: [PT('A', ...A, 'lu'), PT('B', ...Bp, 'ru')], linien: [{ a: A, b: Bp, art: 'strecke' }] });
  return gitterPunkte(text(A, Bp), g, [C], fehler.filter(([p]) => !(p[0] === C[0] && p[1] === C[1])).map(([p, fv]) => [[p], fv]), hilfen, { nachweis: [{ art: 'dritteEcke', a: A, b: Bp, ...bed }] });
}
const waagerecht = (len, { b = 12, h = 8, y0 = null } = {}) => { const A = [zz(1, b - len - 1), y0 ?? zz(1, 2)]; return { A, B: [A[0] + len, A[1]], b, h }; };
const AUFBAU = {
  rechtA: (k = zz(2, 5)) => () => { const g = waagerecht(zz(3, 7)); return { ...g, C: [g.A[0], g.A[1] + k], bed: { rechtBei: 'A', laenge: [[['A', 'C'], k * k]], oben: true, k }, fehler: [[[g.B[0], g.B[1] + k], 'rechter-winkel-lage'], [[g.A[0] + 1, g.A[1] + k], 'rechter-winkel-lage']] }; },
  rechtB: (k = zz(2, 5)) => () => { const g = waagerecht(zz(3, 7)); return { ...g, C: [g.B[0], g.B[1] + k], bed: { rechtBei: 'B', laenge: [[['B', 'C'], k * k]], oben: true, k }, fehler: [[[g.A[0], g.A[1] + k], 'rechter-winkel-lage']] }; },
  spitze: (hh = zz(2, 5)) => () => { const g = waagerecht(2 * zz(2, 4)); return { ...g, C: [(g.A[0] + g.B[0]) / 2, g.A[1] + hh], bed: { gleich: [[['A', 'C'], ['B', 'C']]], hoehe: hh, oben: true }, fehler: [[[g.A[0], g.A[1] + hh], 'dreieck-art'], [[(g.A[0] + g.B[0]) / 2 + 1, g.A[1] + hh], 'dreieck-art']] }; },
  rechtGleich: () => () => { const g = waagerecht(zz(2, 5)), len = g.B[0] - g.A[0]; return { ...g, h: Math.max(g.h, g.A[1] + len + 1), C: [g.A[0], g.A[1] + len], bed: { rechtBei: 'A', gleich: [[['A', 'C'], ['A', 'B']]], oben: true }, fehler: [[[g.B[0], g.B[1] + len], 'rechter-winkel-lage'], [[g.A[0], g.A[1] + len - 1], 'dreieck-art']] }; },
  thales: () => () => { const g = waagerecht(2 * zz(2, 3)), m = (g.B[0] - g.A[0]) / 2; return { ...g, C: [g.A[0] + m, g.A[1] + m], bed: { rechtBei: 'C', gleich: [[['A', 'C'], ['B', 'C']]], oben: true }, fehler: [[[g.A[0] + m, g.A[1] + 2 * m], 'dreieck-art'], [[g.A[0], g.A[1] + m], 'rechter-winkel-lage']] }; },
  drehRechtGleich: () => () => { const v = wahl([[3, 1], [2, 1], [3, 2], [4, 1], [1, 2]]), A = [zz(2, 5), zz(1, 3)], Bp = plus(A, v), C = plus(A, rot(v)); return { A, B: Bp, C, b: 12, h: 9, bed: { rechtBei: 'A', gleich: [[['A', 'C'], ['A', 'B']]], oben: true }, fehler: [[plus(Bp, rot(v)), 'rechter-winkel-lage'], [[A[0], A[1] + Math.abs(v[0])], 'rechter-winkel-lage']] }; },
  drehSpitze: () => () => { const v = wahl([[2, 2], [4, 2], [2, 4], [4, 0], [6, 2]]), A = [zz(1, 4), zz(1, 3)], Bp = plus(A, v), M = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2], k = wahl([1, 2]), C = plus(M, rot([v[0] / 2, v[1] / 2], k));
    return { A, B: Bp, C, b: 12, h: 10, bed: { gleich: [[['A', 'C'], ['B', 'C']]], hoehe: Math.round(Math.sqrt(d2(C, M))) === Math.sqrt(d2(C, M)) ? Math.sqrt(d2(C, M)) : undefined, laenge: [[['A', 'C'], d2(A, C)]], oben: true }, fehler: [[plus(A, rot([v[0] / 2, v[1] / 2], k)), 'dreieck-art']] }; },
};
// Heftaufgabe: Dreieck aus Seiten (cm) und Winkeln (Grad) zeichnen und eine Seite (mm) oder einen Winkel messen.
const rad = (g) => (g * Math.PI) / 180;
function heftDreieck(text, art, hilfen) {
  const versuch = () => {
    if (art === 'wsw') { const c = zz(5, 9), al = zz(30, 80), be = zz(30, 80), ga = 180 - al - be; if (ga < 25) return null; const a = (10 * c * Math.sin(rad(al))) / Math.sin(rad(ga)); return { gegeben: { c: 10 * c, alpha: al, beta: be }, zeige: { c, al, be }, gesucht: 'a', wert: a }; }
    if (art === 'sws') { const b = zz(4, 8), c = zz(5, 9), al = zz(35, 120); const a = Math.sqrt(100 * b * b + 100 * c * c - 200 * b * c * Math.cos(rad(al))); return { gegeben: { b: 10 * b, c: 10 * c, alpha: al }, zeige: { b, c, al }, gesucht: 'a', wert: a }; }
    const a = zz(4, 9), b = zz(4, 9), c = zz(4, 9); if (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1) return null;
    const ga = (Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180) / Math.PI; return { gegeben: { a: 10 * a, b: 10 * b, c: 10 * c }, zeige: { a, b, c }, gesucht: 'gamma', wert: ga };
  };
  const d = suche(versuch, (x) => x && Math.abs(x.wert - Math.round(x.wert)) <= 0.3 && (x.gesucht !== 'gamma' || (Math.round(x.wert) !== 90 && Math.round(x.wert) !== 60)));
  const wert = Math.round(d.wert), z = d.zeige, cmZeilen = ['a', 'b', 'c'].filter((k) => z[k] != null).map((k) => `${z[k]} · 10`);
  return zahl(text(z), wert, fehlerliste(wert, d.gesucht === 'gamma' ? [[180 - wert, 'skala-falsch']] : [[Math.round(wert / 10), 'einheit-mm-cm']]), hilfen,
    { einheit: d.gesucht === 'gamma' ? '°' : 'mm', toleranz: 2, nachweis: [...N(...cmZeilen), { art: 'heftDreieck', gegeben: d.gegeben, gesucht: d.gesucht, wert }] });
}

const P = (p) => `(${p[0]}|${p[1]})`;
export function dreiecke() {
  const D1 = '5.7.X2-D1';
  sechs(D1, 'F', [
    () => welche(Z('Schau dir die drei Dreiecke an.', 'Welches Dreieck hat einen rechten Winkel?'), [{ winkel: 'rechtwinklig' }, { winkel: 'spitzwinklig' }, { winkel: 'stumpfwinklig' }], 'rechtwinklig',
      h3('Ein rechter Winkel ist so groß wie eine Heftecke.', 'Prüfe jede Ecke der Dreiecke.', 'Folge den Gitterlinien: Treffen sich zwei Seiten wie eine Heftecke?'), { gerade: true }),
    () => welche(Z('Schau dir die drei Dreiecke an.', 'Welches Dreieck hat zwei gleich lange Seiten?'), [{ seiten: 'gleichschenklig' }, { seiten: 'unregelmäßig' }, { seiten: 'unregelmäßig' }], 'gleichschenklig',
      h3('Vergleiche die Seiten jedes Dreiecks.', 'Zähle die Kästchen oder die Schritte.', 'Ein Dreieck hat zwei gleich lange Seiten.'), { gerade: true }),
    () => benenne(Z('Schau dir das Dreieck an.', 'Wie heißt es nach seinen Seiten?'), { seiten: 'gleichschenklig' }, ['gleichseitig', 'gleichschenklig', 'unregelmäßig'],
      h3('Vergleiche die drei Seiten.', 'Zwei gleich lange Seiten heißen Schenkel.', 'Ist keine Seite gleich lang wie eine andere, ist es unregelmäßig.'), { frage: 'seiten', gerade: true }),
    () => benenne(Z('Schau dir das Dreieck an.', 'Wie heißt es nach seinen Seiten?'), { seiten: 'unregelmäßig' }, ['gleichseitig', 'gleichschenklig', 'unregelmäßig'],
      h3('Vergleiche die drei Seiten.', 'Zähle die Schritte im Gitter.', 'Sind alle Seiten verschieden lang?'), { frage: 'seiten', gerade: true }),
    () => benenne(Z('Welche Wörter passen zu dem Dreieck?', 'Kreuze alle an.'), { seiten: 'gleichschenklig', winkel: 'rechtwinklig' }, mische(['gleichschenklig', 'rechtwinklig', 'gleichseitig', 'unregelmäßig']),
      h3('Prüfe zuerst die Seiten.', 'Prüfe dann die Ecken mit der Heftecke.', 'Ein Dreieck kann zwei Namen haben.'), { gerade: true }),
    () => welche(Z('Schau dir die drei Dreiecke an.', 'Welches Dreieck ist unregelmäßig?'), [{ seiten: 'unregelmäßig' }, { seiten: 'gleichschenklig' }, { seiten: 'gleichschenklig' }], 'unregelmäßig',
      h3('Unregelmäßig heißt: Alle Seiten sind verschieden lang.', 'Vergleiche bei jedem Dreieck die Seiten.', 'Bei zwei Dreiecken sind zwei Seiten gleich lang.'), { gerade: true }),
  ]);
  sechs(D1, 'G', [
    () => benenne(Z('Das Dreieck liegt schräg.', 'Wie heißt es nach seinen Winkeln?'), { winkel: 'rechtwinklig' }, ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'],
      h3('Dreh das Bild in Gedanken.', 'Prüfe jede Ecke mit einer Heftecke.', 'Ein rechter Winkel bleibt in jeder Lage ein rechter Winkel.'), { frage: 'winkel', schraeg: true }),
    () => welche(Z('Schau dir die drei Dreiecke an.', 'Welches Dreieck ist stumpfwinklig?'), [{ winkel: 'stumpfwinklig' }, { winkel: 'spitzwinklig' }, { winkel: 'rechtwinklig' }], 'stumpfwinklig',
      h3('Ein stumpfwinkliges Dreieck hat einen stumpfen Winkel.', 'Ein stumpfer Winkel ist größer als eine Heftecke.', 'Suche die Ecke mit der weitesten Öffnung.')),
    () => { const s = zz(3, 9); return ausDaten(Z(`Ein Dreieck hat drei Seiten von je ${s} cm.`, 'Wie heißt es nach seinen Seiten?'), { seiten: [s, s, s] }, ['gleichseitig', 'unregelmäßig', 'rechtwinklig'],
      h3('Vergleiche die drei Seiten.', 'Alle drei Seiten sind gleich lang.', 'Ein Dreieck mit drei gleich langen Seiten heißt gleichseitig.'), { frage: 'seiten' }); },
    () => welche(Z('Welche Dreiecke sind rechtwinklig?', 'Kreuze alle an.'), mische([{ winkel: 'rechtwinklig' }, { winkel: 'rechtwinklig' }, { winkel: 'spitzwinklig' }, { winkel: 'stumpfwinklig' }]), 'rechtwinklig',
      h3('Prüfe jede Ecke mit der Heftecke.', 'Auch schräge Dreiecke können einen rechten Winkel haben.', 'Kreuze jedes Dreieck mit einem rechten Winkel an.'), { mehrfach: true }),
    () => benenne(Z('Welche Namen passen zu dem Dreieck?', 'Kreuze alle an.'), wahl([{ seiten: 'gleichschenklig', winkel: 'stumpfwinklig' }, { seiten: 'gleichschenklig', winkel: 'spitzwinklig' }, { seiten: 'unregelmäßig', winkel: 'stumpfwinklig' }]), mische(['gleichschenklig', 'unregelmäßig', 'spitzwinklig', 'stumpfwinklig']),
      h3('Ein Name kommt von den Seiten.', 'Ein Name kommt von den Winkeln.', 'Prüfe beides nacheinander.')),
    () => { const k = kind(); return auswahl(Z(`${k} sagt: „Ein gleichseitiges Dreieck ist auch gleichschenklig.“`, 'Stimmt das?'), [opt('Stimmt.\nEs hat sogar drei gleich lange Seiten.\nAlso hat es auch zwei.', true), opt('Falsch.\nGleichschenklig heißt genau zwei gleich lange Seiten.', false, 'dreieck-sonderfall')],
      h3('Gleichschenklig heißt: mindestens zwei Seiten sind gleich lang.', 'Zähle die gleich langen Seiten beim gleichseitigen Dreieck.', 'Drei gleich lange Seiten sind auch mindestens zwei.'), { nachweis: [U(true)] }); },
  ]);
  sechs(D1, 'M', [
    () => { const w = suche(() => [zz(20, 80), zz(20, 80)], ([a, b]) => a !== b && a + b < 160 && a + b > 100 && 180 - a - b !== a && 180 - a - b !== b); const g = [...w, 180 - w[0] - w[1]];
      return ausDaten(`Ein Dreieck hat die Winkel ${g[0]}°, ${g[1]}° und ${g[2]}°. Wie heißt es nach seinen Winkeln?`, { winkel: g }, ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'], h2('Entscheidend ist der größte Winkel.', 'Ist er kleiner als 90°, ist das Dreieck spitzwinklig.'), { frage: 'winkel' }); },
    () => benenne('Welche Namen passen zu dem Dreieck? Kreuze alle an.', wahl([{ seiten: 'gleichschenklig', winkel: 'rechtwinklig' }, { seiten: 'gleichschenklig', winkel: 'stumpfwinklig' }, { seiten: 'unregelmäßig', winkel: 'rechtwinklig' }]), mische(['gleichschenklig', 'unregelmäßig', 'rechtwinklig', 'spitzwinklig', 'stumpfwinklig']),
      h2('Prüfe die Seiten und die Winkel getrennt.', 'Zu den Seiten passt genau ein Name, zu den Winkeln auch.'), { schraeg: true }),
    () => welche('Welche Dreiecke sind gleichschenklig? Kreuze alle an.', mische([{ seiten: 'gleichschenklig' }, { seiten: 'gleichschenklig' }, { seiten: 'unregelmäßig' }, { seiten: 'unregelmäßig' }]), 'gleichschenklig',
      h2('Vergleiche die Seitenlängen über die Schritte im Gitter.', 'Eine schräge Seite mit 3 nach rechts und 1 nach oben ist so lang wie eine mit 1 nach rechts und 3 nach oben.'), { mehrfach: true }),
    () => benenne('Wie heißt das Dreieck nach seinen Winkeln?', wahl([{ winkel: 'stumpfwinklig' }, { winkel: 'spitzwinklig' }, { winkel: 'rechtwinklig' }]), ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig', 'gleichschenklig'],
      h2('Suche den größten Winkel des Dreiecks.', 'Vergleiche ihn mit einem rechten Winkel.'), { frage: 'winkel' }),
    () => { const a = zz(3, 9), b = suche(() => zz(2, 12), (x) => x !== a && x < 2 * a); return ausDaten(`Ein Dreieck hat die Seiten ${seitenSatz(mische([a, a, b]))}. Welche Namen passen? Kreuze alle an.`, { seiten: [a, a, b] }, ['gleichseitig', 'gleichschenklig', 'unregelmäßig'],
      h2('Vergleiche die drei Seitenlängen.', 'Zwei gleich lange Seiten heißen Schenkel, die dritte heißt Basis.')); },
    () => { const k = kind(); return auswahl(`${k} behauptet: „Ein Dreieck kann zwei rechte Winkel haben.“ Hat ${k} recht?`, [opt('Nein. Die beiden Seiten an der dritten Ecke wären parallel und würden sich nie treffen.', true), opt('Ja. Zum Beispiel, wenn man ein Quadrat halbiert. Dann bleiben zwei rechte Winkel.', false, 'dreieck-art'), opt('Ja, aber nur bei einem gleichseitigen Dreieck.', false, 'dreieck-art')],
      h2('Zeichne eine Strecke und an beiden Enden eine Senkrechte.', 'Prüfe, ob sich die beiden Senkrechten treffen.'), { nachweis: [U(false)] }); },
  ]);
  sechs(D1, 'E', [
    () => { const [a, b] = suche(() => [zz(25, 95), zz(25, 95)], ([x, y]) => x + y < 165 && x !== y), c = 180 - a - b;
      return zahl(`Zwei Winkel eines Dreiecks sind ${a}° und ${b}° groß. Wie groß ist der dritte Winkel?`, c, fehlerliste(c, [[360 - a - b, 'winkelsumme'], [a + b, 'winkelsumme']]), h1('Die drei Winkel eines Dreiecks ergeben zusammen 180°.'),
        { einheit: '°', nachweis: [HILFSZAHL(180, 'Winkelsumme im Dreieck'), ...N(`${a} + ${b}`, `180 − ${a + b}`)] }); },
    () => { const a = wahl([30, 40, 50, 55, 65, 70, 75, 80]), b = 180 - 2 * a;
      return ausDaten(`Ein Dreieck hat die Winkel ${a}° und ${b}°. Welche Namen passen? Kreuze alle an.`, { winkel: [a, a, b] }, mische(['gleichschenklig', 'gleichseitig', 'spitzwinklig', 'stumpfwinklig', 'rechtwinklig']),
        h1('Rechne zuerst den dritten Winkel aus. Gleich große Winkel liegen gegenüber gleich langen Seiten.'), { vorher: [HILFSZAHL(180, 'Winkelsumme im Dreieck'), ...N(`${a} + ${b}`, `180 − ${a + b}`)] }); },
    () => benenne('Welche Namen passen zu dem Dreieck? Kreuze alle an.', { seiten: 'gleichschenklig', winkel: 'rechtwinklig' }, mische(['gleichschenklig', 'gleichseitig', 'rechtwinklig', 'spitzwinklig', 'unregelmäßig']), h1('Das Dreieck liegt schräg. Vergleiche die Schritte im Gitter.'), { schraeg: true }),
    () => { const sp = suche(() => zz(20, 140), (x) => x % 2 === 0 && x !== 60 && x !== 90), b = (180 - sp) / 2;
      return zahl(`In einem gleichschenkligen Dreieck ist der Winkel an der Spitze ${sp}° groß. Wie groß ist ein Basiswinkel?`, b, fehlerliste(b, [[180 - sp, 'winkelsumme'], [sp, 'dreieck-art'], [(360 - sp) / 2, 'winkelsumme']]), h1('Die beiden Basiswinkel sind gleich groß.'),
        { einheit: '°', nachweis: [HILFSZAHL(180, 'Winkelsumme im Dreieck'), ...N(`180 − ${sp}`, `${180 - sp} : 2`)] }); },
    () => welche('Welche Dreiecke sind stumpfwinklig? Kreuze alle an.', mische([{ winkel: 'stumpfwinklig' }, { winkel: 'stumpfwinklig' }, { winkel: 'rechtwinklig' }, { winkel: 'spitzwinklig' }]), 'stumpfwinklig', h1('Suche in jedem Dreieck den größten Winkel.'), { mehrfach: true }),
    () => { const [a, b] = suche(() => [5 * zz(10, 22), 5 * zz(6, 12)], ([x, y]) => x + y < 180), c = suche(() => 5 * zz(6, 16), (x) => a + b + x !== 180), s = a + b + c, k = kind();
      return auswahl(`${k} zeichnet ein Dreieck mit den Winkeln ${a}°, ${b}° und ${c}°. Geht das?`, [opt(`Nein. Die Winkel ergeben zusammen ${s}°, nicht 180°.`, true), opt('Ja. Jeder Winkel ist kleiner als 180°.', false, 'winkelsumme'), opt('Ja. Es ist dann ein stumpfwinkliges Dreieck.', false, 'winkelsumme')],
        h1('Rechne die drei Winkel zusammen.'), { nachweis: [U(false), HILFSZAHL(180, 'Winkelsumme im Dreieck'), ...N(`${a} + ${b} + ${c}`)] }); },
  ]);

  const D2 = '5.7.X2-D2';
  sechs(D2, 'F', [
    () => dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC hat bei A einen rechten Winkel.', 'Die Seite AC ist 3 Kästchen lang.', 'C liegt über AB.'), AUFBAU.rechtA(3),
      h3('Ein rechter Winkel bei A: AC steht wie eine Heftecke auf AB.', 'Gehe von A aus senkrecht nach oben.', 'Zähle 3 Kästchen.')),
    () => dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC soll gleichschenklig sein.', 'AC und BC sind gleich lang.', 'C liegt 3 Kästchen über AB.'), AUFBAU.spitze(3),
      h3('C liegt genau über der Mitte von AB.', 'Suche zuerst die Mitte von AB.', 'Gehe von dort 3 Kästchen nach oben.')),
    () => { const k = zz(2, 4); return dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC hat bei B einen rechten Winkel.', `Die Seite BC ist ${k} Kästchen lang.`, 'C liegt über AB.'), AUFBAU.rechtB(k),
      h3('Der rechte Winkel liegt bei B.', 'Gehe von B aus senkrecht nach oben.', `Zähle ${k} Kästchen.`)); },
    () => { const hh = zz(2, 5); return dritte(() => Z('Setze den Punkt C.', 'AC und BC sollen gleich lang sein.', `C liegt ${hh} Kästchen über AB.`), AUFBAU.spitze(hh),
      h3('Gleich lange Seiten AC und BC treffen sich über der Mitte.', 'Suche die Mitte von AB.', `Gehe ${hh} Kästchen nach oben.`)); },
    () => dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC soll rechtwinklig und gleichschenklig sein.', 'Der rechte Winkel liegt bei A.', 'C liegt über AB.'), AUFBAU.rechtGleich(),
      h3('AC steht senkrecht auf AB.', 'AC ist genauso lang wie AB.', 'Zähle die Kästchen von AB und gehe so weit nach oben.')),
    () => { const k = zz(2, 4); return dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC hat bei A einen rechten Winkel.', `AC ist ${k} Kästchen lang.`, 'C liegt über AB.'), AUFBAU.rechtA(k),
      h3('Der rechte Winkel liegt bei A.', 'Gehe von A senkrecht nach oben.', `Zähle ${k} Kästchen.`)); },
  ]);
  sechs(D2, 'G', [
    () => dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC hat bei A einen rechten Winkel.', 'AC ist so lang wie AB.', 'C liegt links von AB.'), AUFBAU.drehRechtGleich(),
      h3('AB liegt schräg.', 'Drehe den Weg von A nach B um eine Heftecke.', 'Gehe diesen gedrehten Weg von A aus.')),
    () => { const k = 2 * zz(1, 2); return dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC hat bei A einen rechten Winkel.', `AC ist ${k / 2} cm lang.`, 'C liegt über AB.', 'Im Gitter sind 2 Kästchen 1 cm.'), () => { const r = AUFBAU.rechtA(k)(); return { ...r, bed: { ...r.bed, cm: k / 2, kaestchen: 2 } }; },
      h3('Rechne zuerst in Kästchen um.', '1 cm sind 2 Kästchen.', 'Gehe von A aus senkrecht nach oben.')); },
    () => dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC soll gleichschenklig sein.', 'AC und BC sind gleich lang.', 'Der Winkel bei C ist ein rechter Winkel.'), AUFBAU.thales(),
      h3('C liegt über der Mitte von AB.', 'Der Winkel bei C soll eine Heftecke sein.', 'Probiere verschiedene Höhen aus.')),
    () => { const hh = zz(2, 5); return dritte(() => Z('Setze den Punkt C.', 'Das Dreieck ABC ist gleichschenklig mit AC gleich BC.', `C liegt ${hh} Kästchen über AB.`), AUFBAU.spitze(hh),
      h3('Gleich lange Schenkel treffen sich über der Mitte.', 'Suche die Mitte von AB.', `Gehe ${hh} Kästchen nach oben.`)); },
    () => { const hh = 2 * zz(1, 2); return dritte(() => Z('Setze den Punkt C.', 'AC und BC sind gleich lang.', `C liegt ${hh / 2} cm über AB.`, 'Im Gitter sind 2 Kästchen 1 cm.'), () => { const r = AUFBAU.spitze(hh)(); return { ...r, bed: { ...r.bed, cm: hh / 2, kaestchen: 2 } }; },
      h3('Rechne zuerst in Kästchen um.', 'C liegt über der Mitte von AB.', 'Gehe von der Mitte so viele Kästchen nach oben.')); },
    () => dritte(() => Z('Setze den Punkt C.', 'Der rechte Winkel liegt bei A.', 'AC ist so lang wie AB.', 'C liegt links von AB.'), AUFBAU.drehRechtGleich(),
      h3('Der Weg von A nach B wird gedreht.', 'Aus 3 nach rechts und 1 nach oben wird 1 nach links und 3 nach oben.', 'Gehe den gedrehten Weg von A aus.')),
  ]);
  const ks = (t) => (A, Bp) => `Im Koordinatensystem ist A${P(A)} und B${P(Bp)}. ${t}`;
  sechs(D2, 'M', [
    () => { const k = zz(2, 5); return dritte(ks(`Setze C so, dass das Dreieck ABC bei A einen rechten Winkel hat, AC ${k} Einheiten lang ist und C über AB liegt.`), AUFBAU.rechtA(k),
      h2('AC steht senkrecht auf AB.', `Gehe von A aus ${k} Einheiten nach oben.`), { achsen: true }); },
    () => heftDreieck((z) => `Zeichne in dein Heft ein Dreieck ABC mit c = ${z.c} cm, α = ${z.al}° und β = ${z.be}°. Miss die Seite a in mm.`, 'wsw',
      h2('Zeichne zuerst c = AB. Trage dann α bei A und β bei B an.', 'Der Schnittpunkt der freien Schenkel ist C. Du darfst 2 mm daneben liegen.')),
    () => heftDreieck((z) => `Zeichne in dein Heft ein Dreieck ABC mit b = ${z.b} cm, c = ${z.c} cm und α = ${z.al}°. Wie lang ist die Seite a in mm?`, 'sws',
      h2('Zeichne zuerst c = AB und trage bei A den Winkel α an.', 'Miss auf dem freien Schenkel b ab, so erhältst du C. Du darfst 2 mm daneben liegen.')),
    () => dritte(ks('Setze C so, dass AC und BC gleich lang sind und der Winkel bei C ein rechter Winkel ist. C liegt über AB.'), AUFBAU.thales(),
      h2('C liegt über der Mitte von AB.', 'Bei einem rechten Winkel an C ist C so weit über der Mitte wie die halbe Strecke AB.'), { achsen: true }),
    () => dritte(ks('Setze C so, dass das Dreieck ABC bei A einen rechten Winkel hat, AC so lang wie AB ist und C links von AB liegt.'), AUFBAU.drehRechtGleich(),
      h2('Drehe den Weg von A nach B gegen den Uhrzeigersinn um einen rechten Winkel.', 'Gehe den gedrehten Weg von A aus.'), { achsen: true }),
    () => heftDreieck((z) => `Zeichne in dein Heft ein Dreieck mit den Seiten a = ${z.a} cm, b = ${z.b} cm und c = ${z.c} cm. Miss den Winkel γ bei C.`, 'sss',
      h2('Zeichne zuerst eine Seite. Die dritte Ecke findest du mit dem Zirkel: zwei Kreisbögen mit den anderen Seitenlängen.', 'Du darfst 2° daneben liegen.')),
  ]);
  sechs(D2, 'E', [
    () => dritte(ks('Setze C so, dass ABC bei A rechtwinklig und gleichschenklig ist und C links von AB liegt.'), AUFBAU.drehRechtGleich(), h1('Drehe den Weg von A nach B um einen rechten Winkel.'), { achsen: true }),
    () => heftDreieck((z) => `Zeichne ein Dreieck ABC mit b = ${z.b} cm, c = ${z.c} cm und α = ${z.al}° in dein Heft. Miss a in mm.`, 'sws', h1('Beginne mit der Seite, an der der Winkel liegt. Du darfst 2 mm daneben liegen.')),
    () => heftDreieck((z) => `Zeichne ein Dreieck ABC mit c = ${z.c} cm, α = ${z.al}° und β = ${z.be}° in dein Heft. Miss a in mm.`, 'wsw', h1('Trage beide Winkel an der Seite c an. Du darfst 2 mm daneben liegen.')),
    () => heftDreieck((z) => `Zeichne ein Dreieck aus den Seiten a = ${z.a} cm, b = ${z.b} cm und c = ${z.c} cm. Miss den Winkel γ.`, 'sss', h1('Die dritte Ecke findest du mit zwei Kreisbögen. Du darfst 2° daneben liegen.')),
    () => { const k = zz(2, 5); return dritte(ks(`Setze C so, dass ABC bei B rechtwinklig ist, BC ${k} Einheiten lang ist und C über AB liegt.`), AUFBAU.rechtB(k), h1('BC steht senkrecht auf AB.'), { achsen: true }); },
    () => dritte(ks('Setze C so, dass ABC gleichschenklig ist und bei C einen rechten Winkel hat. C liegt über AB.'), AUFBAU.thales(), h1('C liegt über der Mitte von AB. Wie hoch?'), { achsen: true }),
  ]);
}
