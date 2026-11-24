// Aufgaben zu 6.1.4 „Brüche vergleichen und ordnen“ (Lernziele V1, V2) nach ADR 0015 und ADR 0037.
// V1: gleicher Nenner oder gleicher Zähler. V2: verschiedene Nenner.
// Grilling mit Nils (2026-11-24): F vergleicht am Bild, G erweitert einen der beiden Brüche (ein Nenner ist Vielfaches des anderen),
// M macht beliebige Brüche gleichnamig und ordnet bis zu vier, E vergleicht geschickt (mit 1⁄2, mit 1, über den Rest zum Ganzen).

import { sechs, auswahl, luecken, zahl, ordnen, bruch, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { vorn, fig, benenne, bild, NB, UMF, VGL, HILFS, ZEICHEN, gekuerzt, b2, sortiere, ggt, br, opt, zz, wahl, mische } from './6-1-brueche.mjs';

const V1 = '6.1.4-V1', V2 = '6.1.4-V2';
const w = ([z, n, g = 0]) => (g * n + z) / n;
const verschieden = (liste) => new Set(liste.map(w)).size === liste.length;
const figuren = (form, liste) => benenne(liste.map(([z, n]) => fig(form, n, vorn(z))));
const zeichenText = (l, r) => `${b2(l)} ▢ ${b2(r)}`;
const gr = (l, r) => (w(l) > w(r) ? '>' : w(l) < w(r) ? '<' : '=');
const wort = { '>': 'größer als', '<': 'kleiner als', '=': 'genauso groß wie' };
// Urteil über einen Vergleich: gesagt ist das Zeichen der Behauptung.
const urteil = (text, l, r, gesagt, fv, hilfen, extra = {}) => { const wahr = gr(l, r), stimmt = gesagt === wahr, drittes = ['<', '>', '='].find((x) => x !== wahr && x !== gesagt) ?? (wahr === '<' ? '>' : '<');
  return auswahl(text, [opt('Stimmt.', stimmt, stimmt ? undefined : fv), opt(`Falsch. Es gilt ${b2(l)} ${stimmt ? drittes : wahr} ${b2(r)}.`, !stimmt, stimmt ? fv : undefined), ...(stimmt ? [] : [opt(`Falsch. Es gilt ${b2(l)} ${drittes} ${b2(r)}.`, false, fv)])], hilfen, { ...extra, nachweis: [{ art: 'urteil', stimmt, behauptung: `${b2(l)} ${gesagt} ${b2(r)}` }] }); };
const kgv = (a, c) => (a * c) / ggt(a, c);

export function vergleichen() {
  // ================= V1: gleicher Nenner oder gleicher Zähler =================
  const tGleichN = h3('Die Teile sind gleich groß. Mehr Teile sind mehr.', 'Es gilt 3⁄8 < 5⁄8. Denn 3 Teile sind weniger als 5 Teile.', 'Der Nenner ist gleich. Vergleiche nur die Zähler.');
  const tGleichZ = h3('Die Zahl der Teile ist gleich. Schau auf die Größe der Teile.', 'Es gilt 3⁄4 > 3⁄8. Denn Viertel sind größer als Achtel.', 'Der Zähler ist gleich. Der Bruch mit dem kleineren Nenner ist größer.');
  sechs(V1, 'F', [
    () => { const n = zz(5, 10), [a, c] = mische(vorn(n - 1, 1)).slice(0, 2), l = [a, n], r = [c, n];
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r), tGleichN, { bild: bild(...figuren('streifen', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const z = zz(1, 3), [n1, n2] = mische(vorn(10 - z, z + 1)).slice(0, 2), l = [z, n1], r = [z, n2];
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nenner-groesse'), tGleichZ, { bild: bild(...figuren('streifen', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const n = zz(6, 10), zs = mische(vorn(n - 1, 1)).slice(0, 3), gross = wahl([true, false]), ziel = gross ? Math.max(...zs) : Math.min(...zs);
      return auswahl(Z('Die Streifen zeigen drei Brüche.', `Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), zs.map((k) => opt(br(k, n), k === ziel)), tGleichN, { bild: bild(...figuren('streifen', zs.map((k) => [k, n]))), nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const n = zz(6, 10), zs = mische(vorn(n - 1, 1)).slice(0, wahl([3, 4])), sort = [...zs].sort((a, c) => a - c);
      return ordnen(Z('Die Streifen zeigen die Brüche.', 'Ordne die Brüche.', 'Beginne mit dem kleinsten.'), sort.map((k) => br(k, n)), tGleichN, { bild: bild(...figuren('streifen', zs.map((k) => [k, n]))), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt' }); },
    () => { const z = zz(1, 3), [n1, n2] = mische(vorn(10 - z, z + 1)).slice(0, 2), l = [z, n1], r = [z, n2], kn = kind(), gesagt = n1 > n2 ? wahl(['>', '>', '<']) : wahl(['<', '<', '>']);
      return urteil(Z(`${kn} sagt: „${b2(l)} ist ${wort[gesagt]} ${b2(r)}.“`, 'Stimmt das?', 'Schau auf die Streifen.'), l, r, gesagt, 'bruch-nenner-groesse', tGleichZ, { bild: bild(...figuren('streifen', [l, r])) }); },
    () => { const z = zz(1, 3), ns = mische(vorn(10 - z, z + 1)).slice(0, 3), gross = wahl([true, false]), ziel = gross ? Math.min(...ns) : Math.max(...ns);
      return auswahl(Z('Alle Brüche haben denselben Zähler.', `Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), ns.map((n) => opt(br(z, n), n === ziel, n === ziel ? undefined : 'bruch-nenner-groesse')), tGleichZ, { bild: bild(...figuren('streifen', ns.map((n) => [z, n]))), nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
  ]);
  sechs(V1, 'G', [
    () => { const n = zz(11, 20), [a, c] = mische(vorn(n - 1, 1)).slice(0, 2), l = [a, n], r = [c, n];
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r), tGleichN, { nachweis: [VGL(b2(l), b2(r))] }); },
    () => { const z = zz(2, 7), [n1, n2] = mische(vorn(20 - z, z + 1)).slice(0, 2), l = [z, n1], r = [z, n2];
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nenner-groesse'), tGleichZ, { bild: bild(...figuren('streifen', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const z = zz(1, 4), ns = mische(vorn(12 - z, z + 1)).slice(0, 4).sort((a, c) => c - a);
      return ordnen(Z('Die Kreise zeigen die Brüche.', 'Ordne die Brüche.', 'Beginne mit dem kleinsten.'), ns.map((n) => br(z, n)), tGleichZ, { bild: bild(...figuren('kreis', mische(ns).map((n) => [z, n]))), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'bruch-nenner-groesse' }); },
    () => { const n = wahl([5, 6, 7, 8, 9, 11, 12]), zs = [zz(1, n - 1), n + zz(1, n - 1), n + zz(1, n - 1)], gross = wahl([true, false]), ziel = gross ? Math.max(...zs) : Math.min(...zs);
      if (new Set(zs).size < 3) return null;
      return auswahl(Z(`Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), zs.map((k) => opt(br(k, n), k === ziel)), h3('Auch Brüche über 1 vergleichst du so: gleicher Nenner, also zählen die Zähler.', 'Es gilt 5⁄4 < 7⁄4. Denn 5 Viertel sind weniger als 7 Viertel.', 'Der Nenner ist gleich. Vergleiche nur die Zähler.'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const n = zz(7, 20), a = zz(2, n - 4);
      return luecken(Z('Welcher Zähler passt?', `${br(a, n)} < {{a}}⁄${n} < ${br(a + 2, n)}`), { a: [a + 1, fehlerliste(a + 1, [[a, 'zeichen-verwechselt'], [a + 2, 'zeichen-verwechselt']])] },
        h3('Alle drei Brüche haben denselben Nenner. Dann zählen nur die Zähler.', 'Zwischen 3⁄8 und 5⁄8 liegt 4⁄8. Denn 4 liegt zwischen 3 und 5.', `Welche Zahl liegt zwischen ${a} und ${a + 2}?`), { nachweis: [`${a} + 1 = ${a + 1}`, HILFS(br(a, n), 'untere Grenze'), HILFS(br(a + 2, n), 'obere Grenze')] }); },
    () => { const z = zz(2, 7), [n1, n2] = mische(vorn(20 - z, z + 1)).slice(0, 2), l = [z, n1], r = [z, n2], kn = kind(), gesagt = n1 > n2 ? wahl(['>', '>', '<']) : wahl(['<', '<', '>']);
      return urteil(Z(`${kn} sagt: „${b2(l)} ist ${wort[gesagt]} ${b2(r)}.“`, 'Stimmt das?'), l, r, gesagt, 'bruch-nenner-groesse',
        h3('Mehr Teile im Ganzen heißt: Jedes Teil ist kleiner.', 'Es gilt 5⁄12 < 5⁄8. Denn Zwölftel sind kleiner als Achtel.', 'Der Zähler ist gleich. Der Bruch mit dem kleineren Nenner ist größer.'), { bild: bild(...figuren('streifen', [l, r])) }); },
  ]);
  const tV1M = h2('Gleicher Nenner: Der größere Zähler gewinnt. Gleicher Zähler: Der kleinere Nenner gewinnt, denn seine Teile sind größer.', 'Schau zuerst, was bei den Brüchen gleich ist: der Zähler oder der Nenner?');
  sechs(V1, 'M', [
    () => { const z = zz(7, 23), [n1, n2] = mische([25, 30, 32, 36, 40, 45, 48, 50].filter((n) => n > z)).slice(0, 2), l = [z, n1], r = [z, n2];
      return auswahl(`Welches Zeichen passt? ${zeichenText(l, r)}`, ZEICHEN(l, r, 'bruch-nenner-groesse'), tV1M, { nachweis: [VGL(b2(l), b2(r))] }); },
    () => { const n = wahl([7, 8, 9, 11, 12, 15]), k1 = zz(1, n - 1), k2 = zz(1, n - 1), roh = [[zz(2, n - 1), n], [k1, n, 1], [n + k2, n], [2 * n + zz(1, n - 1), n], [zz(1, n - 1), n, 2]];
      if (!verschieden(roh)) return null;
      return ordnen('Ordne die Zahlen. Beginne mit der kleinsten.', sortiere(roh.map((x) => [x[0] + (x[2] ?? 0) * x[1], x[1], x])).map(([, , x]) => b2(x)), h2('Schreibe die gemischten Zahlen als Brüche. Dann haben alle Zahlen denselben Nenner.', `Alle Zahlen haben den Nenner ${n}. Vergleiche nach dem Umwandeln nur noch die Zähler.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'gemischt-umwandeln' }); },
    () => { const z = zz(3, 9), u = zz(z + 6, 30), o = wahl(vorn(u - z - 4, z + 1)), drin = mische(vorn(u - o - 1, o + 1)).slice(0, zz(2, 3)), draussen = mische([...vorn(o - z, z + 1).filter((n) => n < o), ...vorn(8, u + 1)]).slice(0, 5 - drin.length);
      if (drin.length < 2 || drin.length + draussen.length !== 5) return null;
      return auswahl(`Welche Brüche liegen zwischen ${br(z, u)} und ${br(z, o)}? Kreuze alle an.`, [...drin.map((n) => opt(br(z, n), true)), ...draussen.map((n) => opt(br(z, n), false, 'bruch-nenner-groesse'))],
        h2('Alle Brüche haben denselben Zähler. Dann entscheidet der Nenner: je größer der Nenner, desto kleiner der Bruch.', `Gesucht sind die Brüche mit einem Nenner zwischen ${o} und ${u}.`), { mehrfach: true, nachweis: [{ art: 'zwischen', von: br(z, u), bis: br(z, o) }] }); },
    () => { const z = zz(5, 19), ns = mische([20, 24, 25, 27, 30, 32, 35, 36, 40, 42, 45, 48, 50].filter((n) => n > z)).slice(0, 4), gross = wahl([true, false]), ziel = gross ? Math.min(...ns) : Math.max(...ns);
      return auswahl(`Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`, ns.map((n) => opt(br(z, n), n === ziel, n === ziel ? undefined : 'bruch-nenner-groesse')), tV1M, { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const z = wahl([3, 5, 7, 11, 13, 17, 19]), n = wahl(vorn(46 - z, z + 3).filter((x) => x % z !== 0 && (x + 2) % z !== 0));
      return luecken(`Welcher Nenner passt? ${br(z, n + 2)} < ${z}⁄{{a}} < ${br(z, n)}`, { a: [n + 1, fehlerliste(n + 1, [[n, 'zeichen-verwechselt'], [n + 2, 'zeichen-verwechselt'], [z, 'bruch-vertauscht']])] },
        h2('Alle drei Brüche haben denselben Zähler. Der Bruch mit dem größeren Nenner ist kleiner.', `Der gesuchte Nenner liegt zwischen ${n} und ${n + 2}.`), { nachweis: [`${n} + 1 = ${n + 1}`, HILFS(br(z, n + 2), 'untere Grenze'), HILFS(br(z, n), 'obere Grenze')] }); },
    () => { const z = wahl([3, 7, 9]), ns = mische([4, 5, 8, 10, 12, 20, 25].filter((n) => n > z)).slice(0, 3), kinder = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Ida']).slice(0, 3), gross = wahl([true, false]), ziel = gross ? Math.min(...ns) : Math.max(...ns);
      if (ns.length < 3) return null;
      return auswahl(`${kinder[0]} läuft ${br(z, ns[0])} km, ${kinder[1]} läuft ${br(z, ns[1])} km und ${kinder[2]} läuft ${br(z, ns[2])} km. Welche Strecke ist am ${gross ? 'längsten' : 'kürzesten'}?`, ns.map((n) => opt(`${br(z, n)} km`, n === ziel, n === ziel ? undefined : 'bruch-nenner-groesse')),
        h2('Alle drei Strecken haben denselben Zähler. Welcher Nenner macht die größten Teile?', 'Bei gleichem Zähler ist der Bruch mit dem kleinsten Nenner am größten.'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
  ]);
  sechs(V1, 'E', [
    () => { const z = zz(23, 95), [n1, n2] = mische([96, 108, 112, 120, 125, 128, 144, 150, 160, 180, 200].filter((n) => n > z)).slice(0, 2), l = [z, n1], r = [z, n2];
      return auswahl(`Welches Zeichen passt? ${zeichenText(l, r)}`, ZEICHEN(l, r, 'bruch-nenner-groesse'), h1('Was ist bei beiden Brüchen gleich? Überlege dann, welcher Bruch die größeren Teile hat.'), { nachweis: [VGL(b2(l), b2(r))] }); },
    () => { const z = zz(11, 45), ns = mische([48, 56, 60, 64, 72, 75, 90, 96, 120, 125, 144, 150, 180].filter((n) => n > z)).slice(0, 5).sort((a, c) => a - c);
      return ordnen('Ordne die Brüche. Beginne mit dem größten.', ns.map((n) => br(z, n)), h1('Alle Brüche haben denselben Zähler. Dann entscheidet allein der Nenner.'), { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'bruch-nenner-groesse' }); },
    () => { const n = wahl([8, 9, 12, 15, 16]), g = zz(2, 6), drin = mische([[g * n + zz(1, n - 1), n], [zz(1, n - 1), n, g], [(g + 1) * n - 1, n]]), draussen = mische([[g * n - 1, n], [(g + 1) * n + 1, n], [zz(1, n - 1), n, g + 1], [zz(1, n - 1), n, g - 1]]), r = zz(2, 3), alle = [...drin.slice(0, r), ...draussen.slice(0, 6 - r)];
      if (!verschieden(alle) || alle.length !== 6) return null;
      return auswahl(`Welche Zahlen liegen zwischen ${g} und ${g + 1}? Kreuze alle an.`, alle.map((x, i) => opt(b2(x), i < r, i < r ? undefined : 'gemischt-umwandeln')), h1(`Schreibe ${g} und ${g + 1} als Brüche mit dem Nenner ${n}. Wandle die gemischten Zahlen genauso um.`), { mehrfach: true, nachweis: [{ art: 'zwischen', von: String(g), bis: String(g + 1) }] }); },
    () => { const z = zz(7, 30), [n1, n2] = mische(vorn(40, z + 3)).slice(0, 2), l = [z, n1], r = [z, n2], kn = kind(), gesagt = n1 > n2 ? wahl(['>', '>', '<']) : wahl(['<', '<', '>']), falsch = gesagt !== gr(l, r);
      return urteil(`${kn} behauptet: „${b2(l)} ist ${wort[gesagt]} ${b2(r)}, denn ${falsch ? `${Math.max(n1, n2)} ist größer als ${Math.min(n1, n2)}` : 'bei gleichem Zähler hat der Bruch mit dem kleineren Nenner die größeren Teile'}.“ Stimmt das?`, l, r, gesagt, 'bruch-nenner-groesse', h1('Bei gleichem Zähler nimmst du gleich viele Teile. Wo sind die Teile größer?')); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const gleichN = i % 2 === 0, x = zz(7, 40), [p, q] = mische(vorn(30, x + 2)).slice(0, 2), l = gleichN ? [Math.min(p, q) - x + 1, x + 31] : [x, p], r = gleichN ? [Math.max(p, q) - x + 1, x + 31] : [x, q], stimmt = i < 2 ? i === 0 : wahl([true, false]), wahr = gr(l, r); roh.push([`${b2(l)} ${stimmt ? wahr : wahr === '<' ? '>' : '<'} ${b2(r)}`, stimmt, gleichN]); }
      return auswahl('Welche Vergleiche stimmen? Kreuze alle an.', roh.map(([t, r, gleichN]) => opt(t, r, r ? undefined : gleichN ? 'zeichen-verwechselt' : 'bruch-nenner-groesse')), h1('Prüfe bei jedem Paar zuerst, was gleich ist: der Zähler oder der Nenner.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
    () => { const z = zz(4, 12), n = zz(z + 5, z + 14), anzahl = n - z - 1;
      return zahl(`Ein Bruch hat den Zähler ${z}. Er ist größer als ${br(z, n)}, aber kleiner als 1. Wie viele solche Brüche gibt es?`, anzahl, fehlerliste(anzahl, [[anzahl + 1, 'bruchstrahl-striche'], [anzahl + 2, 'bruchstrahl-striche'], [n - 1, 'bruch-nenner-groesse']]),
        h1(`Kleiner als 1 heißt: Der Nenner ist größer als ${z}. Größer als ${br(z, n)} heißt: Der Nenner ist kleiner als ${n}.`), { nachweis: [`${n} − ${z} − 1 = ${anzahl}`] }); },
  ]);

  // ================= V2: verschiedene Nenner =================
  const tV2 = h3('Die Streifen sind gleich lang. Schau, welcher Streifen weiter gefärbt ist.', '1⁄2 und 3⁄8: Der Streifen mit 1⁄2 ist weiter gefärbt. Also 1⁄2 > 3⁄8.', 'Vergleiche die gefärbten Stücke im Bild.');
  const paarBild = () => { const [n1, n2] = wahl([[2, 4], [2, 6], [2, 8], [2, 10], [3, 6], [3, 9], [4, 8], [5, 10], [2, 3], [3, 4], [2, 5], [4, 6], [3, 5]]); const l = [zz(1, n1 - 1), n1], r = [zz(1, n2 - 1), n2]; return wahl([true, false]) ? [l, r] : [r, l]; };
  sechs(V2, 'F', [
    () => { const [l, r] = paarBild();
      if (w(l) === w(r)) return null;
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), tV2, { bild: bild(...figuren('streifen', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const [l, r] = paarBild();
      if (w(l) === w(r)) return null;
      return auswahl(Z('Die Kreise sind gleich groß.', 'Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), h3('Schau, in welchem Kreis mehr gefärbt ist.', '1⁄2 und 1⁄4: Im Kreis mit 1⁄2 ist mehr gefärbt. Also 1⁄2 > 1⁄4.', 'Vergleiche die gefärbten Stücke im Bild.'), { bild: bild(...figuren('kreis', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const liste = wahl([[[1, 2], [1, 4], [5, 8]], [[1, 2], [3, 4], [3, 8]], [[1, 3], [5, 6], [1, 2]], [[2, 3], [1, 6], [1, 2]], [[1, 2], [2, 5], [7, 10]], [[3, 4], [5, 8], [1, 2]], [[1, 5], [3, 10], [1, 2]], [[2, 3], [5, 9], [1, 3]]]), gross = wahl([true, false]), werte = liste.map(w), ziel = gross ? Math.max(...werte) : Math.min(...werte), gemischt = mische(liste);
      return auswahl(Z('Die Streifen zeigen drei Brüche.', `Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), gemischt.map((x) => opt(b2(x), w(x) === ziel, w(x) === ziel ? undefined : 'bruch-nur-zaehler-verglichen')), tV2, { bild: bild(...figuren('streifen', gemischt)), nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const [a, k] = wahl([[[1, 2], 2], [[1, 2], 3], [[1, 2], 4], [[1, 2], 5], [[1, 3], 2], [[2, 3], 2], [[1, 3], 3], [[1, 4], 2], [[3, 4], 2], [[1, 5], 2], [[2, 5], 2]]), d = zz(-1, 1), r = [a[0] * k + d, a[1] * k];
      if (r[0] < 1 || r[0] >= r[1]) return null;
      return auswahl(Z('Die Streifen sind gleich lang.', 'Welches Zeichen passt?', zeichenText(a, r)), ZEICHEN(a, r, 'bruch-nur-zaehler-verglichen'), h3('Schau genau hin. Die Streifen können auch gleich weit gefärbt sein.', '1⁄2 und 2⁄4 sind gleich weit gefärbt. Also 1⁄2 = 2⁄4.', 'Vergleiche die gefärbten Stücke im Bild.'), { bild: bild(...figuren('streifen', [a, r])), nachweis: [NB(b2(a), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(a), b2(r))] }); },
    () => { const liste = mische(wahl([[[1, 2], [1, 4], [5, 8]], [[1, 2], [3, 4], [3, 8]], [[1, 3], [5, 6], [1, 2]], [[2, 3], [1, 6], [1, 2]], [[3, 4], [5, 8], [1, 2]], [[1, 4], [3, 8], [1, 2]]])), fs = figuren('kreis', liste), gross = wahl([true, false]), werte = liste.map(w), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      return auswahl(Z('Die Kreise sind gleich groß.', `In welcher Figur ist am ${gross ? 'meisten' : 'wenigsten'} gefärbt?`), fs.map((f, i) => opt(`Figur ${f.n}`, werte[i] === ziel)), h3('Die Teile sind verschieden groß. Zähle also nicht nur die Teile.', 'Ein halber Kreis ist mehr als 3 Achtel vom Kreis.', 'Vergleiche die gefärbten Flächen im Bild.'), { bild: bild(...fs), nachweis: [{ art: 'figurextrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const liste = wahl([[[1, 4], [1, 2], [5, 8]], [[3, 8], [1, 2], [3, 4]], [[1, 3], [1, 2], [5, 6]], [[1, 6], [1, 2], [2, 3]], [[2, 5], [1, 2], [7, 10]], [[1, 2], [5, 8], [3, 4]], [[1, 5], [3, 10], [1, 2]]]);
      return ordnen(Z('Die Streifen zeigen die Brüche.', 'Ordne die Brüche.', 'Beginne mit dem kleinsten.'), liste.map(b2), tV2, { bild: bild(...figuren('streifen', mische(liste))), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-nur-zaehler-verglichen' }); },
  ]);
  const tV2G = h3('Mache die Nenner gleich. Erweitere dazu den Bruch mit dem kleineren Nenner.', '2⁄3 und 7⁄12: 2⁄3 = 8⁄12. Es gilt 8⁄12 > 7⁄12. Also 2⁄3 > 7⁄12.', 'Erweitere auf den größeren Nenner. Vergleiche dann die Zähler.');
  const paarG = (max = 20) => { const n1 = wahl([2, 3, 4, 5, 6]), k = wahl([2, 3, 4, 5].filter((x) => n1 * x <= max)), a = gekuerzt([n1]), d = wahl([-2, -1, 1, 2]), r = [a[0] * k + d, n1 * k]; return r[0] < 1 || r[0] >= r[1] ? null : { a, r, k }; };
  sechs(V2, 'G', [
    () => { const p = paarG(); if (!p) return null; const [l, r] = wahl([true, false]) ? [p.a, p.r] : [p.r, p.a];
      return auswahl(Z('Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), tV2G, { nachweis: [UMF(p.a, p.k, 'erweitern', true), VGL(b2(l), b2(r))] }); },
    () => { const p = paarG(); if (!p) return null; const [l, r] = wahl([true, false]) ? [p.a, p.r] : [p.r, p.a];
      return auswahl(Z('Die Streifen sind gleich lang.', 'Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), tV2G, { bild: bild(...figuren('streifen', [l, r])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const [n, k, j] = wahl([[2, 2, 4], [2, 3, 6], [3, 2, 4], [3, 2, 6], [4, 2, 4], [5, 2, 4], [2, 4, 8], [2, 5, 10], [3, 3, 6]]), a = gekuerzt([n]), N = n * j, c = [a[0] * k + wahl([-1, 1]), n * k], e = [a[0] * j + wahl([-3, -1, 1, 3]), N], liste = [a, c, e], gross = wahl([true, false]), werte = liste.map(w), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      if (N > 20 || !verschieden(liste) || liste.some((x) => x[0] < 1 || x[0] >= x[1])) return null;
      return auswahl(Z(`Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`), mische(liste).map((x) => opt(b2(x), w(x) === ziel, w(x) === ziel ? undefined : 'bruch-nur-zaehler-verglichen')), h3(`Bringe alle drei Brüche auf den Nenner ${N}.`, '1⁄2 = 6⁄12 und 2⁄3 = 8⁄12. Jetzt kannst du die Zähler vergleichen.', `Erweitere jeden Bruch auf den Nenner ${N}. Vergleiche dann die Zähler.`), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const n = wahl([2, 3, 4, 5, 6]), l = [n + zz(1, n - 1), n], r = [2 * l[0] + wahl([-1, 1]), 2 * n];
      return auswahl(Z('Jeder Kreis ist ein Ganzes.', 'Welches Zeichen passt?', zeichenText(l, r)), ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), h3('Auch Brüche über 1 vergleichst du so: erst die Nenner gleich machen.', '5⁄4 = 10⁄8. Es gilt 10⁄8 < 11⁄8. Also 5⁄4 < 11⁄8.', `Erweitere ${b2(l)} mit 2. Vergleiche dann die Zähler.`),
        { bild: bild(...benenne([fig('kreis', n, vorn(l[0]), { ganze: 2 }), fig('kreis', 2 * n, vorn(r[0]), { ganze: 2 })])), nachweis: [NB(b2(l), { figur: 'A' }), NB(b2(r), { figur: 'B' }), VGL(b2(l), b2(r))] }); },
    () => { const [n, k, j] = wahl([[2, 2, 4], [2, 2, 8], [3, 2, 4], [3, 2, 6], [4, 2, 4], [5, 2, 4], [2, 5, 10], [2, 3, 6]]), a = gekuerzt([n]), c = [a[0] * k + wahl([-1, 1]), n * k], e = [a[0] * j + wahl([-3, 3, 5, -5]), n * j], liste = [a, c, e];
      if (n * j > 20 || !verschieden(liste) || liste.some((x) => x[0] < 1 || x[0] >= x[1])) return null;
      return ordnen(Z('Die Streifen zeigen die Brüche.', 'Ordne die Brüche.', 'Beginne mit dem kleinsten.'), sortiere(liste).map(b2), tV2G, { bild: bild(...figuren('streifen', mische(liste))), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-nur-zaehler-verglichen' }); },
    () => { const p = paarG(); if (!p) return null; const l = p.a, r = p.r, kn = kind(), wahr = gr(l, r), gesagt = wahl([wahr, wahr === '<' ? '>' : '<', wahr === '<' ? '>' : '<']);
      return urteil(Z(`${kn} sagt: „${b2(l)} ist ${wort[gesagt]} ${b2(r)}.“`, 'Stimmt das?'), l, r, gesagt, 'bruch-nur-zaehler-verglichen', tV2G); },
  ]);
  const paarM = () => { const [n1, n2] = wahl([[3, 4], [4, 6], [3, 5], [4, 5], [6, 8], [3, 8], [4, 10], [6, 9], [5, 6], [8, 12], [9, 12], [6, 10], [5, 8], [4, 9], [10, 15], [8, 10], [3, 7], [12, 16]]), l = gekuerzt([n1]), r = gekuerzt([n2]); return w(l) === w(r) || l[0] === r[0] || Math.abs(w(l) - w(r)) > 0.2 ? null : { l, r, N: kgv(n1, n2) }; };
  sechs(V2, 'M', [
    () => { const p = paarM(); if (!p) return null; const { l, r, N } = p;
      return auswahl(`Welches Zeichen passt? ${zeichenText(l, r)}`, ZEICHEN(l, r, 'bruch-nur-zaehler-verglichen'), h2('Mache die Brüche gleichnamig: Erweitere beide auf einen gemeinsamen Nenner.', `Ein gemeinsamer Nenner ist ${N}. Erweitere beide Brüche darauf und vergleiche die Zähler.`), { nachweis: [VGL(b2(l), b2(r))] }); },
    () => { const p = paarM(); if (!p) return null; const { l, r, N } = p, kl = N / l[1], kr = N / r[1];
      return luecken(Z(`Mache die Brüche gleichnamig. Der gemeinsame Nenner ist ${N}.`, `${b2(l)} = {{a}}⁄${N}`, `${b2(r)} = {{b}}⁄${N}`), { a: [l[0] * kl, fehlerliste(l[0] * kl, [[l[0], 'erweitern-nur-ein-teil'], [kl, 'sach-schritt-vergessen'], [l[0] * kr, 'sach-falsche-rechnung']])], b: [r[0] * kr, fehlerliste(r[0] * kr, [[r[0], 'erweitern-nur-ein-teil'], [kr, 'sach-schritt-vergessen'], [r[0] * kl, 'sach-falsche-rechnung']])] },
        h2('Jeder Bruch hat seine eigene Erweiterungszahl: gemeinsamer Nenner geteilt durch den alten Nenner.', `Rechne ${N} : ${l[1]} = ${kl} für den ersten Bruch und ${N} : ${r[1]} = ${kr} für den zweiten.`), { nachweis: [`${N} : ${l[1]} = ${kl}`, UMF(l, kl, 'erweitern'), `${N} : ${r[1]} = ${kr}`, UMF(r, kr, 'erweitern')] }); },
    () => { const N = wahl([12, 24, 30, 36, 40, 48]), ns = mische(vorn(N - 2, 3).filter((n) => N % n === 0 && n < N)).slice(0, 4), liste = ns.map((n) => gekuerzt([n], Math.floor(n / 3) || 1));
      if (ns.length < 4 || !verschieden(liste) || Math.max(...liste.map(w)) - Math.min(...liste.map(w)) > 0.45) return null;
      return ordnen('Ordne die Brüche. Beginne mit dem kleinsten.', sortiere(liste).map(b2), h2('Mache alle Brüche gleichnamig. Dann zählen nur noch die Zähler.', `Ein gemeinsamer Nenner für alle vier Brüche ist ${N}.`), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-nur-zaehler-verglichen' }); },
    () => { const N = wahl([24, 30, 36, 40]), ns = mische(vorn(N - 2, 3).filter((n) => N % n === 0 && n < N)).slice(0, 4), liste = ns.map((n) => gekuerzt([n], Math.floor(n / 2) || 1)), gross = wahl([true, false]), werte = liste.map(w), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      if (ns.length < 4 || !verschieden(liste)) return null;
      return auswahl(`Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}?`, liste.map((x) => opt(b2(x), w(x) === ziel, w(x) === ziel ? undefined : 'bruch-nur-zaehler-verglichen')), h2('Mache alle Brüche gleichnamig. Dann zählen nur noch die Zähler.', `Ein gemeinsamer Nenner für alle vier Brüche ist ${N}.`), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const [u, o] = wahl([[[1, 2], [3, 4]], [[1, 3], [1, 2]], [[2, 3], [5, 6]], [[1, 4], [1, 2]], [[1, 2], [2, 3]], [[3, 5], [4, 5]]]), alle = mische([[5, 8], [7, 12], [2, 3], [3, 5], [5, 12], [3, 8], [4, 9], [7, 10], [11, 15], [5, 6], [7, 9], [1, 3], [9, 20], [13, 18], [4, 5], [7, 8], [11, 12], [3, 10]]), drin = alle.filter((x) => w(x) > w(u) && w(x) < w(o)).slice(0, zz(2, 3)), draussen = alle.filter((x) => w(x) < w(u) || w(x) > w(o)).slice(0, 5 - drin.length);
      if (drin.length < 2) return null;
      return auswahl(`Welche Brüche liegen zwischen ${b2(u)} und ${b2(o)}? Kreuze alle an.`, [...drin.map((x) => opt(b2(x), true)), ...draussen.map((x) => opt(b2(x), false, 'bruch-nur-zaehler-verglichen'))], h2('Vergleiche jeden Bruch mit beiden Grenzen. Mache dazu gleichnamig.', `Prüfe für jeden Bruch: Ist er größer als ${b2(u)}? Ist er kleiner als ${b2(o)}?`), { mehrfach: true, nachweis: [{ art: 'zwischen', von: b2(u), bis: b2(o) }] }); },
    () => { const [n1, n2, n3] = wahl([[4, 6, 8], [3, 4, 6], [5, 6, 10], [4, 6, 9], [3, 5, 6], [6, 8, 12], [4, 5, 8]]), liste = [gekuerzt([n1], Math.floor(n1 / 2)), gekuerzt([n2], Math.floor(n2 / 2)), gekuerzt([n3], Math.floor(n3 / 2))], kinder = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Ida']).slice(0, 3), werte = liste.map(w), gross = wahl([true, false]), ziel = gross ? Math.max(...werte) : Math.min(...werte), was = wahl(['ihres Buches gelesen', 'ihrer Strecke geschafft', 'ihres Puzzles gelegt']);
      if (!verschieden(liste)) return null;
      return auswahl(`${kinder[0]} hat schon ${b2(liste[0])} ${was}, ${kinder[1]} hat ${b2(liste[1])} und ${kinder[2]} hat ${b2(liste[2])}. Welcher Anteil ist am ${gross ? 'größten' : 'kleinsten'}?`, liste.map((x) => opt(b2(x), w(x) === ziel, w(x) === ziel ? undefined : 'bruch-nur-zaehler-verglichen')),
        h2('Die Anteile haben verschiedene Nenner. Mache sie gleichnamig, bevor du vergleichst.', `Ein gemeinsamer Nenner ist ${kgv(kgv(n1, n2), n3)}.`), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
  ]);
  sechs(V2, 'E', [
    () => { const n1 = wahl([13, 15, 17, 19, 21, 25, 27]), n2 = wahl([14, 16, 18, 22, 24, 26].filter((x) => ggt(x, n1) === 1)), l = [(n1 - 1) / 2, n1], r = [n2 / 2 + 1, n2], [a, c] = wahl([true, false]) ? [l, r] : [r, l];
      return auswahl(`Welches Zeichen passt? Vergleiche geschickt. ${zeichenText(a, c)}`, ZEICHEN(a, c, 'bruch-nur-zaehler-verglichen'), h1('Vergleiche beide Brüche mit 1⁄2: Ist der Zähler kleiner oder größer als die Hälfte des Nenners?'), { nachweis: [VGL(b2(a), b2(c))] }); },
    () => { const ns = mische([5, 7, 8, 9, 11, 12, 15, 16, 20, 25]).slice(0, 5), gross = wahl([true, false]), ziel = gross ? Math.max(...ns) : Math.min(...ns);
      return auswahl(`Welcher Bruch ist am ${gross ? 'größten' : 'kleinsten'}? Vergleiche geschickt.`, ns.map((n) => opt(br(n - 1, n), n === ziel, n === ziel ? undefined : 'bruch-nenner-groesse')), h1('Jedem Bruch fehlt genau ein Teil bis zum Ganzen. Wo ist das fehlende Teil am kleinsten?'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const liste = [gekuerzt([7, 9, 11], 1).map((x, i, a) => (i === 0 ? Math.floor(a[1] / 2) : x)), [wahl([5, 7]), wahl([9, 11, 13])], [wahl([11, 14]), 15], [wahl([1, 2]), wahl([7, 9]), 1], [wahl([8, 9]), wahl([7, 5])]];
      liste[1][0] = Math.ceil(liste[1][1] / 2) + (liste[1][1] > 9 ? 1 : 0);
      if (!verschieden(liste) || liste.some((x) => ggt(x[0], x[1]) !== 1)) return null;
      return ordnen('Ordne die Zahlen. Beginne mit der kleinsten.', [...liste].sort((a, c) => w(a) - w(c)).map(b2), h1('Sortiere zuerst grob: Welche Zahlen sind kleiner als 1⁄2, welche liegen zwischen 1⁄2 und 1, welche sind größer als 1?'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-nur-zaehler-verglichen' }); },
    () => { const roh = [], falschAn = zz(0, 4);
      for (let i = 0; i < 5; i++) { let p = null; while (!p) p = paarM(); const wahr = gr(p.l, p.r), t = `${b2(p.l)} ${i === falschAn ? (wahr === '<' ? '>' : '<') : wahr} ${b2(p.r)}`; if (roh.some(([x]) => x.slice(0, 6) === t.slice(0, 6))) return null; roh.push([t, i === falschAn]); }
      return auswahl('Vier Vergleiche stimmen, einer ist falsch. Welcher Vergleich ist falsch?', roh.map(([t, r]) => opt(t, r)), h1('Mache bei jedem Paar die Brüche gleichnamig, oder vergleiche geschickt mit 1⁄2.'), { nachweis: [{ art: 'aussagen', falsche: true }] }); },
    () => { const alle = mische([[17, 35], [19, 36], [23, 45], [26, 51], [31, 60], [29, 60], [37, 75], [41, 80], [43, 90], [51, 100], [49, 100], [13, 27], [16, 31], [24, 49], [33, 64], [61, 120]]), r = zz(2, 4), drueber = alle.filter((x) => 2 * x[0] > x[1]).slice(0, r), drunter = alle.filter((x) => 2 * x[0] < x[1]).slice(0, 6 - r);
      return auswahl('Welche Brüche sind größer als 1⁄2? Kreuze alle an.', [...drueber.map((x) => opt(b2(x), true)), ...drunter.map((x) => opt(b2(x), false, 'bruch-nur-zaehler-verglichen'))], h1('Ein Bruch ist größer als 1⁄2, wenn sein Zähler größer ist als die Hälfte seines Nenners.'), { mehrfach: true, nachweis: [{ art: 'schwelle', wert: br(1, 2), zeichen: '>' }] }); },
    () => { const [l, r] = wahl([[[2, 3], [3, 4]], [[1, 2], [2, 3]], [[3, 4], [4, 5]], [[1, 3], [1, 2]], [[2, 5], [1, 2]], [[3, 5], [2, 3]], [[1, 4], [1, 3]], [[5, 6], [7, 8]], [[1, 2], [3, 5]]]), z = l[0] * r[1] + r[0] * l[1], n = 2 * l[1] * r[1], g = ggt(z, n);
      return bruch(`Welcher Bruch liegt genau in der Mitte zwischen ${b2(l)} und ${b2(r)}? Kürze vollständig.`, br(z / g, n / g), [[br(l[0] + r[0], l[1] + r[1]), 'erweitern-addiert']].filter(([x]) => { const [p, q] = x.split('⁄').map(Number); return p * n !== q * z; }),
        h1('Mache beide Brüche gleichnamig. Liegt kein Zähler genau in der Mitte, dann erweitere beide Brüche noch einmal mit 2.'), { gekuerzt: true, nachweis: [`(${b2(l)} + ${b2(r)}) : 2 = ${br(z / g, n / g)}`] }); },
  ]);
}
