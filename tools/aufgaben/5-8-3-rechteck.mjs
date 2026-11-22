// Aufgaben zu 5.8.3 „Rechteck und Quadrat“ (Lernziele R1 und R2) nach ADR 0015 und ADR 0035.
// R1: Flächeninhalt und Umfang von Rechteck und Quadrat berechnen. R2: rückwärts rechnen und Sachaufgaben.
// Grilling mit Nils (2026-11-22): F in Worten am Zentimeterraster, ab G A = a · b und u = 2 · a + 2 · b, ab M Skizzen mit Maßen
// und rückwärts, E Wirkung („doppelt so lang“). Zahlen: F Einmaleins, G Zehnerzahlen, M schriftlich, E groß.
// Auf M und E sind in R1 je zwei Aufgaben Heftaufgaben mit Kontrollwert: Das Kind zeichnet und misst den Umfang in mm.

import { sechs, zahl, auswahl, opt, luecken, groesse, Z, G, HILFSGROESSE, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { QF, LF, q, lmix, R, setze, rasterBild, skizze, unten, links, NF, zz, wahl, mische } from './5-8-flaechen.mjs';

const R1 = '5.8.3-R1', R2 = '5.8.3-R2';
const l = (n, e) => `${n} ${e}`; // Länge als Text (kleine Zahlen)
// Ein Rechteck w · h auf dem Raster ('cm' oder 'm'), mit Maßen unten und links. frage: 'unten' oder 'links' bekommt ein Fragezeichen.
function amRaster(art, w, h, { frage = null, masse = true } = {}) {
  const g = setze([{ rechtecke: [R(0, 0, w, h)] }], { maxB: 16, maxH: 11 });
  if (!g) return null;
  const r = g.figuren[0].rechtecke[0];
  return rasterBild(art, g, masse ? [unten(r, frage === 'unten' ? { frage: true } : {}), links(r, frage === 'links' ? { frage: true } : {})] : null);
}
// Skizze eines Rechtecks a · b in der Einheit e. texte: eigene Beschriftungen (z. B. „2 m 50 cm“), frage: Seite mit „?“.
function alsSkizze(e, a, b, { texte = {}, frage = null } = {}) {
  if (Math.max(a, b) / Math.min(a, b) > 4) return null; // zu lang und schmal für eine Skizze
  const r = [0, 0, a, b];
  return skizze(e, [{ rechtecke: [r] }], [unten(r, frage === 'unten' ? { frage: true } : texte.a ? { text: texte.a } : {}), links(r, frage === 'links' ? { frage: true } : texte.b ? { text: texte.b } : {})]);
}
// Wie alsSkizze, bricht aber ab (der Erzeuger zieht neu), wenn die Skizze nicht passt.
const mussSkizze = (...x) => { const b = alsSkizze(...x); if (!b) throw new NochmalFehler(); return b; };
class NochmalFehler extends Error {}
const S = (lz, n, fs) => sechs(lz, n, fs.map((f) => () => { try { return f(); } catch (e) { if (e instanceof NochmalFehler) return null; throw e; } }));
const uFehler = (a, b, u) => fehlerliste(u, [[a + b, 'umfang-halb'], [a * b, 'umfang-flaeche-verwechselt']]);
const aFehler = (a, b, A) => fehlerliste(A, [[2 * a + 2 * b, 'umfang-flaeche-verwechselt'], [a + b, 'umfang-flaeche-verwechselt']]);
const GQ = (w, e) => q(w / QF[e], e);

export function rechteck() {
  // ---------- R1: Flächeninhalt und Umfang ----------
  const tippA = h3('Der Flächeninhalt ist Länge mal Breite.', 'Ein Rechteck, 4 cm lang und 3 cm breit: 4 cm · 3 cm = 12 cm².', 'Zähle die Felder in einer Reihe und die Reihen. Rechne dann mal.');
  const tippU = h3('Der Umfang ist der Weg einmal ganz um das Rechteck.', 'Ein Rechteck, 4 cm lang und 3 cm breit: 4 cm + 3 cm + 4 cm + 3 cm = 14 cm.', 'Zähle alle vier Seiten zusammen.');
  S(R1, 'F', [
    () => { const a = zz(3, 9), b = zz(2, Math.min(a - 1, 6)), bild = amRaster('cm', a, b);
      return bild && zahl(Z(`Das Rechteck ist ${l(a, 'cm')} lang und ${l(b, 'cm')} breit.`, 'Wie groß ist sein Flächeninhalt?'), a * b, aFehler(a, b, a * b), tippA, { einheit: 'cm²', bild, nachweis: [G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`)] }); },
    () => { const a = zz(3, 9), b = zz(2, Math.min(a - 1, 6)), bild = amRaster('cm', a, b);
      return bild && zahl(Z(`Das Rechteck ist ${l(a, 'cm')} lang und ${l(b, 'cm')} breit.`, 'Wie lang ist sein Umfang?'), 2 * a + 2 * b, uFehler(a, b, 2 * a + 2 * b), tippU, { einheit: 'cm', bild, nachweis: [G(`${a} cm + ${b} cm + ${a} cm + ${b} cm = ${2 * a + 2 * b} cm`)] }); },
    () => { const s = zz(3, 7), bild = amRaster('cm', s, s);
      return bild && zahl(Z(`Das Quadrat ist ${l(s, 'cm')} lang und ${l(s, 'cm')} breit.`, 'Wie groß ist sein Flächeninhalt?'), s * s, aFehler(s, s, s * s), h3('Beim Quadrat sind Länge und Breite gleich.', 'Ein Quadrat, 3 cm lang und 3 cm breit: 3 cm · 3 cm = 9 cm².', 'Rechne Länge mal Breite.'), { einheit: 'cm²', bild, nachweis: [G(`${s} cm · ${s} cm = ${q(s * s, 'cm²')}`)] }); },
    () => { const a = zz(3, 9), b = zz(2, Math.min(a - 1, 6)), bild = amRaster('cm', a, b);
      return bild && luecken(Z('Bestimme beim Rechteck:', 'Flächeninhalt: {{a}} cm²', 'Umfang: {{b}} cm'), { a: [a * b, aFehler(a, b, a * b)], b: [2 * a + 2 * b, uFehler(a, b, 2 * a + 2 * b)] },
        h3('Der Flächeninhalt hat cm², der Umfang cm.', 'Ein Rechteck, 3 cm lang und 2 cm breit: 6 cm² und 10 cm.', 'Rechne zuerst Länge mal Breite. Zähle dann alle Seiten zusammen.'), { bild, nachweis: [G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`), G(`${a} cm + ${b} cm + ${a} cm + ${b} cm = ${2 * a + 2 * b} cm`)] }); },
    () => { const a = zz(4, 9), b = zz(2, 5), bild = amRaster('m', a, b);
      return bild && zahl(Z('Der Plan zeigt ein Beet im Burggarten.', `Das Beet ist ${l(a, 'm')} lang und ${l(b, 'm')} breit.`, 'Wie groß ist das Beet?'), a * b, aFehler(a, b, a * b), h3('Auf dem Plan ist jedes Feld 1 m² groß.', 'Ein Beet, 5 m lang und 2 m breit: 5 m · 2 m = 10 m².', 'Rechne Länge mal Breite.'), { einheit: 'm²', bild, nachweis: [G(`${a} m · ${b} m = ${q(a * b, 'm²')}`)] }); },
    () => { const s = zz(3, 8), bild = amRaster('cm', s, s);
      return bild && zahl(Z(`Das Quadrat ist ${l(s, 'cm')} lang und ${l(s, 'cm')} breit.`, 'Wie lang ist sein Umfang?'), 4 * s, uFehler(s, s, 4 * s), h3('Ein Quadrat hat vier gleich lange Seiten.', 'Bei 3 cm: 3 cm + 3 cm + 3 cm + 3 cm = 12 cm.', 'Rechne 4 mal die Länge einer Seite.'), { einheit: 'cm', bild, nachweis: [G(`4 · ${s} cm = ${4 * s} cm`)] }); },
  ]);
  const tippAG = h3('A = a · b: Länge mal Breite.', 'a = 6 cm, b = 4 cm: A = 6 cm · 4 cm = 24 cm².', 'Setze die Maße in die Formel ein.');
  const tippUG = h3('u = 2 · a + 2 · b: zwei Längen und zwei Breiten.', 'a = 6 cm, b = 4 cm: u = 2 · 6 cm + 2 · 4 cm = 20 cm.', 'Setze die Maße in die Formel ein.');
  S(R1, 'G', [
    () => { const a = zz(5, 12), b = zz(3, 8), bild = a !== b && amRaster('cm', a, b);
      return bild && zahl(Z('Berechne den Flächeninhalt A des Rechtecks.', 'Rechne mit A = a · b.'), a * b, aFehler(a, b, a * b), tippAG, { einheit: 'cm²', bild, nachweis: [G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`)] }); },
    () => { const a = zz(5, 12), b = zz(3, 8), bild = a !== b && amRaster('cm', a, b);
      return bild && zahl(Z('Berechne den Umfang u des Rechtecks.', 'Rechne mit u = 2 · a + 2 · b.'), 2 * a + 2 * b, uFehler(a, b, 2 * a + 2 * b), tippUG, { einheit: 'cm', bild, nachweis: [G(`2 · ${a} cm + 2 · ${b} cm = ${2 * a + 2 * b} cm`)] }); },
    () => { const a = zz(2, 9) * 10, b = zz(2, 9);
      return luecken(Z(`Ein Rechteck ist ${l(a, 'cm')} lang und ${l(b, 'cm')} breit.`, 'A = {{a}} cm²', 'u = {{b}} cm'), { a: [a * b, aFehler(a, b, a * b)], b: [2 * a + 2 * b, uFehler(a, b, 2 * a + 2 * b)] }, h3('A = a · b und u = 2 · a + 2 · b.', 'a = 20 cm, b = 3 cm: A = 60 cm², u = 46 cm.', 'Rechne beides getrennt.'),
        { nachweis: [G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`), G(`2 · ${a} cm + 2 · ${b} cm = ${2 * a + 2 * b} cm`)] }); },
    () => { const s = zz(4, 9), bild = amRaster('m', s, s);
      return bild && zahl(Z('Der Plan zeigt einen Hof der Burg.', 'Er ist ein Quadrat.', 'Wie groß ist der Hof?'), s * s, aFehler(s, s, s * s), h3('Beim Quadrat sind a und b gleich lang.', 'Seite 5 m: A = 5 m · 5 m = 25 m².', 'Rechne a · a.'), { einheit: 'm²', bild, nachweis: [G(`${s} m · ${s} m = ${q(s * s, 'm²')}`)] }); },
    () => { // Zwei Rechtecke: Welches hat den größeren Flächeninhalt? Gleicher Umfang macht die Verwechslung sichtbar.
      for (let i = 0; i < 100; i++) { const u2 = zz(7, 9), a1 = zz(2, u2 - 2), a2 = zz(2, u2 - 2), b1 = u2 - a1, b2 = u2 - a2;
        if (a1 * b1 === a2 * b2 || a1 + 2 + a2 + 2 > 16) continue;
        const g = setze([{ rechtecke: [R(0, 0, a1, b1)] }, { rechtecke: [R(0, 0, a2, b2)] }], { namen: 'AB', maxB: 16, maxH: 11 });
        if (!g) continue;
        const masse = g.figuren.flatMap((f) => [unten(f.rechtecke[0]), links(f.rechtecke[0])]);
        return auswahl(Z('A und B haben den gleichen Umfang.', 'Welches Rechteck hat den größeren Flächeninhalt?'), mische([opt('A', a1 * b1 > a2 * b2), opt('B', a2 * b2 > a1 * b1), opt('Beide sind gleich groß.', false, 'gleicher-umfang-gleiche-flaeche')]),
          h3('Rechne für beide Rechtecke A = a · b.', '6 cm · 2 cm = 12 cm², aber 4 cm · 4 cm = 16 cm².', 'Gleicher Umfang heißt nicht gleicher Flächeninhalt.'), { bild: rasterBild('cm', g, masse), nachweis: [NF('inhalt', q(a1 * b1, 'cm²'), 'A'), NF('inhalt', q(a2 * b2, 'cm²'), 'B'), { art: 'figurwahl', was: 'inhalt', ziel: 'groesste' }] }); }
      return null; },
    () => { const a = zz(3, 9) * 10, b = zz(2, 9) * 10, u = 2 * a + 2 * b, kn = kind(), stimmt = wahl([true, false, false]), behauptet = stimmt ? u : a + b;
      return auswahl(Z(`Ein Rechteck ist ${l(a, 'cm')} lang und ${l(b, 'cm')} breit.`, `${kn} sagt: Der Umfang ist ${l(behauptet, 'cm')}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt, stimmt ? undefined : 'umfang-halb'), opt(`Falsch. Der Umfang ist ${l(stimmt ? a + b : u, 'cm')}.`, !stimmt, stimmt ? 'umfang-halb' : undefined), opt(`Falsch. Der Umfang ist ${l(a * b, 'cm')}.`, false, 'flaecheneinheit-laenge')],
        tippUG, { nachweis: [{ art: 'urteil', stimmt, behauptet: l(behauptet, 'cm') }, HILFSGROESSE(l(a + b, 'cm'), 'halber Umfang'), HILFSGROESSE(l(a * b, 'cm'), 'falsche Rechnung'), G(`2 · ${a} cm + 2 · ${b} cm = ${u} cm`)] }); },
  ]);
  // Heftaufgabe mit Kontrollwert: Rechteck zeichnen, Umfang in mm messen.
  const heft = (text, a, b, hilfen) => zahl(text, 2 * a + 2 * b, fehlerliste(2 * a + 2 * b, [[a + b, 'umfang-halb'], [(2 * a + 2 * b) * 10, 'einheit-mm-cm']]), hilfen, { einheit: 'mm', toleranz: 2, nachweis: [...(a === 2 * b ? [G(`2 · ${lmix(b, 'cm', 'mm')} = ${lmix(a, 'cm', 'mm')}`)] : []), G(`2 · ${lmix(a, 'cm', 'mm')} + 2 · ${lmix(b, 'cm', 'mm')} = ${2 * a + 2 * b} mm`)] });
  S(R1, 'M', [
    () => { const a = zz(12, 40), b = zz(11, a - 1), A = a * b;
      return groesse('Berechne den Flächeninhalt des Grundstücks.', 'flaeche', A * QF['m²'], 'm²', [[(2 * a + 2 * b) * QF['m²'], 'umfang-flaeche-verwechselt']], h2('A = a · b. Rechne schriftlich, wenn nötig.', 'Achte auf die Einheit: m · m ergibt m².'),
        { einheiten: ['m²', 'a', 'dm²'], bild: mussSkizze('m', a, b), nachweis: [G(`${a} m · ${b} m = ${q(A, 'm²')}`)] }); },
    () => { const a = zz(5, 9) * 10 + wahl([0, 5]), b = zz(2, 4) * 10 + 5;
      return heft(`Im Heft: Zeichne ein Rechteck, das ${lmix(a, 'cm', 'mm')} lang und ${lmix(b, 'cm', 'mm')} breit ist. Miss alle vier Seiten. Wie viele mm ist der Umfang lang?`, a, b, h2('Zeichne mit dem Geodreieck rechte Winkel.', 'Zur Kontrolle: u = 2 · a + 2 · b, alles in mm.')); },
    () => { const a = zz(2, 3) * 100 + 50, b = wahl([40, 60, 80]), A = a * b * QF['cm²'];
      if (A % QF['dm²']) return null;
      return groesse('Berechne den Flächeninhalt der Tischplatte. Achte auf die Einheiten.', 'flaeche', A, 'dm²', [[Math.floor(a / 100) * b * QF['cm²'], 'einheiten-gemischt-multipliziert'], [(2 * a + 2 * b) * QF['cm²'], 'umfang-flaeche-verwechselt']],
        h2('Wandle zuerst beide Seiten in dieselbe Einheit um.', `${lmix(a * 10, 'm', 'cm')} sind ${a} cm.`), { einheiten: ['cm²', 'dm²', 'm²'], bild: mussSkizze('cm', a, b, { texte: { a: lmix(a * 10, 'm', 'cm') } }), nachweis: [G(`${lmix(a * 10, 'm', 'cm')} = ${a} cm`), G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`), G(`${q(a * b, 'cm²')} = ${GQ(A, 'dm²')}`)] }); },
    () => { const a = zz(101, 180), b = zz(35, 90), u = 2 * a + 2 * b;
      return zahl('Um den Acker kommt ein Zaun. Wie lang wird der Zaun?', u, uFehler(a, b, u), h2('Der Zaun läuft einmal ganz herum: u = 2 · a + 2 · b.', 'Rechne schriftlich und denke an beide Längen und beide Breiten.'), { einheit: 'm', bild: mussSkizze('m', a, b), nachweis: [G(`2 · ${a} m + 2 · ${b} m = ${u} m`)] }); },
    () => { const s = zz(3, 6) * 10 + 5;
      return heft(`Im Heft: Zeichne ein Quadrat mit der Seitenlänge ${lmix(s, 'cm', 'mm')}. Miss alle vier Seiten. Wie viele mm ist der Umfang lang?`, s, s, h2('Zeichne mit dem Geodreieck rechte Winkel.', 'Zur Kontrolle: 4 · Seitenlänge in mm.')); },
    () => { const u2 = wahl([20, 24, 28]), a = u2 / 2 + wahl([2, 4]), b = u2 - a, s = u2 / 2, A1 = a * b, A2 = s * s;
      return zahl(`Ein Rechteck ist ${l(a, 'm')} lang und ${l(b, 'm')} breit. Ein Quadrat hat die Seitenlänge ${l(s, 'm')}. Beide haben den gleichen Umfang. Um wie viel m² ist das Quadrat größer?`, A2 - A1, fehlerliste(A2 - A1, [[0, 'gleicher-umfang-gleiche-flaeche'], [A2, 'sach-schritt-vergessen']]),
        h2('Berechne beide Flächeninhalte.', 'Gleicher Umfang heißt nicht gleicher Flächeninhalt.'), { einheit: 'm²', nachweis: [G(`2 · ${a} m + 2 · ${b} m = ${2 * a + 2 * b} m`), G(`4 · ${s} m = ${4 * s} m`), G(`${a} m · ${b} m = ${q(A1, 'm²')}`), G(`${s} m · ${s} m = ${q(A2, 'm²')}`), G(`${q(A2, 'm²')} − ${q(A1, 'm²')} = ${q(A2 - A1, 'm²')}`)] }); },
  ]);
  S(R1, 'E', [
    () => { const a = wahl([125, 150, 175, 200, 250]), b = wahl([40, 60, 80, 84]), A = a * b;
      if (A % 100) return null;
      return groesse('Berechne den Flächeninhalt der Wiese. Wähle eine passende Einheit.', 'flaeche', A * QF['m²'], 'a', [[(2 * a + 2 * b) * QF['m²'], 'umfang-flaeche-verwechselt'], [A * QF['m²'] * 100, 'umrechnungszahl-flaeche']], h1('A = a · b, danach in eine passende Einheit umwandeln.'),
        { einheiten: ['m²', 'a', 'ha'], bild: mussSkizze('m', a, b), nachweis: [G(`${a} m · ${b} m = ${q(A, 'm²')}`), G(`${q(A, 'm²')} = ${q(A / 100, 'a')}`)] }); },
    () => { const b = zz(2, 4) * 10 + 5, a = 2 * b;
      return heft(`Im Heft: Zeichne ein Rechteck, das ${lmix(b, 'cm', 'mm')} breit und doppelt so lang wie breit ist. Wie viele mm ist der Umfang lang?`, a, b, h1('Rechne zuerst die Länge aus und zeichne genau. Zur Kontrolle: u = 2 · a + 2 · b.')); },
    () => { const a = zz(3, 4) * 100 + wahl([20, 40, 60]), b = zz(55, 95), u = 2 * a + 2 * b;
      return zahl('Um das Beet kommt eine Kante aus Holz. Wie viele cm ist sie lang?', u, fehlerliste(u, [[2 * Math.floor(a / 100) + 2 * b, 'einheiten-gemischt-multipliziert'], [a + b, 'umfang-halb']]), h1('Wandle zuerst alle Längen in cm um.'),
        { einheit: 'cm', bild: mussSkizze('cm', a, b, { texte: { a: lmix(a * 10, 'm', 'cm') } }), nachweis: [G(`${lmix(a * 10, 'm', 'cm')} = ${a} cm`), G(`2 · ${a} cm + 2 · ${b} cm = ${u} cm`)] }); },
    () => { const a = zz(3, 9), b = zz(2, a - 1), A = a * b, A2 = 4 * A;
      return zahl(`Ein Rechteck ist ${l(a, 'cm')} lang und ${l(b, 'cm')} breit. Länge und Breite werden verdoppelt. Wie oft passt das alte Rechteck in das neue?`, 4, fehlerliste(4, [[2, 'sach-schritt-vergessen']]), h1('Rechne beide Flächeninhalte aus und vergleiche.'),
        { nachweis: [G(`2 · ${a} cm = ${2 * a} cm`), G(`2 · ${b} cm = ${2 * b} cm`), G(`${2 * a} cm · ${2 * b} cm = ${q(A2, 'cm²')}`), G(`${a} cm · ${b} cm = ${q(A, 'cm²')}`), G(`${q(A2, 'cm²')} : ${q(A, 'cm²')} = 4`)] }); },
    () => { const s = zz(105, 240), u = 4 * s;
      return groesse('Ein Platz ist ein Quadrat. Wie lang ist der Weg einmal ganz um den Platz? Wähle eine passende Einheit.', 'laenge', u * LF.m, 'm', [[2 * s * LF.m, 'umfang-halb'], [s * s * LF.m, 'umfang-flaeche-verwechselt']], h1('Ein Quadrat hat vier gleich lange Seiten.'),
        { einheiten: ['cm', 'm', 'km'], bild: mussSkizze('m', s, s), nachweis: [G(`4 · ${s} m = ${u} m`)] }); },
    () => { const a = zz(5, 8), b = zz(2, a - 2), A = a * b, u = 20 * a + 20 * b;
      return zahl(`Im Heft: Zeichne ein Rechteck, das ${l(a, 'cm')} lang und ${q(A, 'cm²')} groß ist. Wie viele mm ist der Umfang lang?`, u, fehlerliste(u, [[10 * a + 10 * b, 'umfang-halb'], [u / 10, 'einheit-mm-cm']]), h1('Rechne zuerst rückwärts die Breite aus: A : a. Zeichne dann genau.'),
        { einheit: 'mm', toleranz: 2, nachweis: [G(`${q(A, 'cm²')} : ${a} cm = ${b} cm`), G(`2 · ${a} cm + 2 · ${b} cm = ${2 * a + 2 * b} cm`), G(`${2 * a + 2 * b} cm = ${u} mm`)] }); },
  ]);

  // ---------- R2: rückwärts und Sachaufgaben ----------
  S(R2, 'F', [
    () => { const a = zz(3, 8), b = zz(2, Math.min(a, 6)), bild = amRaster('cm', a, b, { frage: 'links' });
      return bild && zahl(Z(`Das Rechteck ist ${q(a * b, 'cm²')} groß und ${l(a, 'cm')} lang.`, 'Wie breit ist es?'), b, fehlerliste(b, [[a * b - a, 'div-falsche-rechenart'], [a * b * a, 'div-falsche-rechenart']]),
        h3('Flächeninhalt = Länge mal Breite. Rechne rückwärts mit Geteilt.', '12 cm² und 4 cm lang: 12 : 4 = 3. Es ist 3 cm breit.', 'Wie oft passt die Länge in den Flächeninhalt?'), { einheit: 'cm', bild, nachweis: [G(`${q(a * b, 'cm²')} : ${a} cm = ${b} cm`)] }); },
    () => { const a = zz(3, 8), b = zz(2, Math.min(a, 5)), u = 2 * a + 2 * b, bild = amRaster('cm', a, b, { frage: 'links' });
      return bild && zahl(Z(`Das Rechteck hat einen Umfang von ${l(u, 'cm')}.`, `Es ist ${l(a, 'cm')} lang.`, 'Wie breit ist es?'), b, fehlerliste(b, [[u - a, 'umfang-halb'], [u - 2 * a, 'sach-schritt-vergessen']]),
        h3('Der Umfang sind zwei Längen und zwei Breiten.', 'Umfang 14 cm, Länge 4 cm: 14 cm − 8 cm = 6 cm. Eine Breite ist 6 cm : 2 = 3 cm.', 'Ziehe zuerst die beiden Längen ab. Teile dann durch 2.'), { einheit: 'cm', bild, nachweis: [G(`2 · ${a} cm = ${2 * a} cm`), G(`${u} cm − ${2 * a} cm = ${u - 2 * a} cm`), G(`${u - 2 * a} cm : 2 = ${b} cm`)] }); },
    () => { const a = zz(4, 9), b = zz(2, 5), bild = amRaster('m', a, b);
      return bild && zahl(Z('Der Plan zeigt ein Beet.', `Es ist ${l(a, 'm')} lang und ${l(b, 'm')} breit.`, 'Um das Beet kommt ein Zaun.', 'Wie lang ist der Zaun?'), 2 * a + 2 * b, uFehler(a, b, 2 * a + 2 * b), tippU, { einheit: 'm', bild, nachweis: [G(`${a} m + ${b} m + ${a} m + ${b} m = ${2 * a + 2 * b} m`)] }); },
    () => { const s = zz(2, 6), bild = amRaster('cm', s, s, { masse: false });
      return bild && zahl(Z(`Das Quadrat hat einen Umfang von ${l(4 * s, 'cm')}.`, 'Wie lang ist eine Seite?'), s, fehlerliste(s, [[2 * s, 'umfang-halb'], [4 * s - 4, 'div-falsche-rechenart']]),
        h3('Ein Quadrat hat vier gleich lange Seiten.', 'Umfang 12 cm: 12 cm : 4 = 3 cm.', 'Teile den Umfang durch 4.'), { einheit: 'cm', bild, nachweis: [G(`${4 * s} cm : 4 = ${s} cm`)] }); },
    () => { const a = zz(4, 9), b = zz(3, 6), bild = amRaster('m', a, b);
      return bild && zahl(Z(`Der Burghof ist ${l(a, 'm')} lang und ${l(b, 'm')} breit.`, 'Er wird mit Platten belegt.', 'Jede Platte ist 1 m² groß.', 'Wie viele Platten braucht man?'), a * b, aFehler(a, b, a * b),
        h3('Für jedes Feld auf dem Plan braucht man eine Platte.', 'Ein Hof, 5 m lang und 3 m breit: 5 · 3 = 15 Platten.', 'Rechne Länge mal Breite.'), { einheit: 'Platten', bild, nachweis: [G(`${a} m · ${b} m = ${q(a * b, 'm²')}`), G(`${q(a * b, 'm²')} : 1 m² = ${a * b}`)] }); },
    () => { const a = zz(3, 7), b = zz(3, 7), bild = a !== b && amRaster('cm', a, b, { frage: 'unten' });
      return bild && zahl(Z(`Das Rechteck ist ${q(a * b, 'cm²')} groß und ${l(b, 'cm')} breit.`, 'Wie lang ist es?'), a, fehlerliste(a, [[a * b - b, 'div-falsche-rechenart']]),
        h3('Flächeninhalt = Länge mal Breite. Rechne rückwärts.', '15 cm² und 3 cm breit: 15 : 3 = 5. Es ist 5 cm lang.', 'Teile den Flächeninhalt durch die Breite.'), { einheit: 'cm', bild, nachweis: [G(`${q(a * b, 'cm²')} : ${b} cm = ${a} cm`)] }); },
  ]);
  S(R2, 'G', [
    () => { const a = zz(4, 12), b = zz(3, 8), bild = a !== b && amRaster('cm', a, b, { frage: 'links' });
      return bild && zahl(Z(`Das Rechteck hat A = ${q(a * b, 'cm²')}.`, `Es ist a = ${l(a, 'cm')} lang.`, 'Wie breit ist es?'), b, fehlerliste(b, [[a * b - a, 'div-falsche-rechenart']]),
        h3('A = a · b. Rückwärts: b = A : a.', 'A = 24 cm², a = 6 cm: b = 24 cm² : 6 cm = 4 cm.', 'Teile den Flächeninhalt durch die Länge.'), { einheit: 'cm', bild, nachweis: [G(`${q(a * b, 'cm²')} : ${a} cm = ${b} cm`)] }); },
    () => { const a = zz(6, 12), b = zz(3, 7), t = wahl([1, 2]), bild = amRaster('m', a, b);
      return bild && zahl(Z(`Der Garten ist ${l(a, 'm')} lang und ${l(b, 'm')} breit.`, 'Um den Garten kommt ein Zaun.', `Das Tor ist ${l(t, 'm')} breit und braucht keinen Zaun.`, 'Wie viel m Zaun braucht man?'), 2 * a + 2 * b - t, fehlerliste(2 * a + 2 * b - t, [[2 * a + 2 * b, 'sach-schritt-vergessen'], [a + b - t, 'umfang-halb']]),
        h3('Rechne zuerst den Umfang aus.', 'Umfang 30 m, Tor 2 m: 30 m − 2 m = 28 m.', 'Ziehe dann das Tor ab.'), { einheit: 'm', bild, nachweis: [G(`2 · ${a} m + 2 · ${b} m = ${2 * a + 2 * b} m`), G(`${2 * a + 2 * b} m − ${t} m = ${2 * a + 2 * b - t} m`)] }); },
    () => { const a = zz(2, 9) * 10, b = zz(2, 9);
      return zahl(Z(`Ein Rechteck hat A = ${q(a * b, 'cm²')} und ist ${l(a, 'cm')} lang.`, 'Wie breit ist es?'), b, fehlerliste(b, [[a * b - a, 'div-falsche-rechenart'], [b * 10, 'div-falsche-rechenart']]),
        h3('b = A : a.', 'A = 120 cm², a = 20 cm: 120 : 20 = 6, also b = 6 cm.', 'Teile den Flächeninhalt durch die Länge.'), { einheit: 'cm', nachweis: [G(`${q(a * b, 'cm²')} : ${a} cm = ${b} cm`)] }); },
    () => { const s = zz(3, 9), bild = amRaster('m', s, s, { masse: false });
      return bild && zahl(Z('Der Plan zeigt einen quadratischen Platz.', `Sein Umfang ist ${l(4 * s, 'm')}.`, 'Wie groß ist der Platz?'), s * s, fehlerliste(s * s, [[4 * s, 'umfang-flaeche-verwechselt'], [s, 'sach-schritt-vergessen']]),
        h3('Rechne zuerst eine Seite aus: u : 4.', 'u = 20 m: Seite 5 m, A = 5 m · 5 m = 25 m².', 'Rechne dann A = a · a.'), { einheit: 'm²', bild, nachweis: [G(`${4 * s} m : 4 = ${s} m`), G(`${s} m · ${s} m = ${q(s * s, 'm²')}`)] }); },
    () => { const a = zz(2, 5) * 10, b = zz(1, 3) * 10, p = wahl([2, 3, 4]), A = a * b;
      return zahl(Z(`Ein Feld ist ${l(a, 'm')} lang und ${l(b, 'm')} breit.`, `Auf 1 m² wachsen ${p} Kohlköpfe.`, 'Wie viele Kohlköpfe wachsen auf dem Feld?'), A * p, fehlerliste(A * p, [[A, 'sach-schritt-vergessen'], [(2 * a + 2 * b) * p, 'umfang-flaeche-verwechselt']]),
        h3('Rechne zuerst den Flächeninhalt aus.', '20 m · 10 m = 200 m². Bei 3 Kohlköpfen auf 1 m² sind das 200 · 3 = 600.', 'Nimm dann mal die Zahl der Kohlköpfe.'), { einheit: 'Kohlköpfe', nachweis: [G(`${a} m · ${b} m = ${q(A, 'm²')}`), G(`${q(A, 'm²')} : 1 m² = ${A}`), G(`${A} · ${p} = ${A * p}`)] }); },
    () => { const s = zz(3, 9), u = 4 * s, kn = kind(), falsch = u, stimmt = false;
      return auswahl(Z(`Ein Quadrat hat den Umfang ${l(u, 'cm')}.`, `${kn} sagt: Dann ist sein Flächeninhalt ${q(falsch, 'cm²')}.`, 'Stimmt das?'), [opt('Stimmt.', stimmt, 'umfang-flaeche-verwechselt'), opt(`Falsch. Es sind ${q(s * s, 'cm²')}.`, true), opt(`Falsch. Es sind ${q(2 * u, 'cm²')}.`, false, 'umfang-flaeche-verwechselt')],
        h3('Rechne zuerst eine Seite aus.', 'u = 12 cm: Seite 3 cm, A = 3 cm · 3 cm = 9 cm².', 'Teile den Umfang durch 4 und rechne dann a · a.'), { nachweis: [{ art: 'urteil', stimmt, behauptet: q(falsch, 'cm²') }, HILFSGROESSE(q(2 * u, 'cm²'), 'falsche Rechnung'), G(`${u} cm : 4 = ${s} cm`), G(`${s} cm · ${s} cm = ${q(s * s, 'cm²')}`)] }); },
  ]);
  S(R2, 'M', [
    () => { const a = zz(14, 32), b = zz(11, a - 1);
      return zahl(`Ein Grundstück ist ${q(a * b, 'm²')} groß und ${l(a, 'm')} lang. Wie breit ist es?`, b, fehlerliste(b, [[a * b - a, 'div-falsche-rechenart']]), h2('b = A : a.', 'Rechne schriftlich und mache die Probe mit a · b.'), { einheit: 'm', bild: mussSkizze('m', a, b, { frage: 'links' }), nachweis: [G(`${q(a * b, 'm²')} : ${a} m = ${b} m`)] }); },
    () => { const a = zz(18, 35), b = zz(11, 17), t = wahl([2, 3, 4]), z = 2 * a + 2 * b - t;
      return zahl(`Um einen Garten kommt ein Zaun. Das Tor ist ${l(t, 'm')} breit. Wie viel m Zaun braucht man?`, z, fehlerliste(z, [[z + t, 'sach-schritt-vergessen'], [a + b - t, 'umfang-halb']]), h2('Rechne zuerst den Umfang aus.', 'Ziehe dann die Breite des Tors ab.'), { einheit: 'm', bild: mussSkizze('m', a, b), nachweis: [G(`2 · ${a} m + 2 · ${b} m = ${2 * a + 2 * b} m`), G(`${2 * a + 2 * b} m − ${t} m = ${z} m`)] }); },
    () => { const a = wahl([400, 500, 600]), b = wahl([300, 350, 450]), f = 50, n = (a * b) / (f * f);
      return zahl(`Ein Zimmer wird mit Teppichfliesen ausgelegt. Eine Fliese ist ${l(f, 'cm')} lang und ${l(f, 'cm')} breit. Wie viele Fliesen braucht man?`, n, fehlerliste(n, [[(a / 100) * (b / 100), 'einheiten-gemischt-multipliziert'], [(a + b) * 2 / f, 'umfang-flaeche-verwechselt']]), h2('Rechne beide Flächen in cm² aus.', 'Teile dann die Fläche des Zimmers durch die Fläche einer Fliese.'),
        { einheit: 'Fliesen', bild: mussSkizze('cm', a, b, { texte: { a: lmix(a * 10, 'm', 'cm'), b: lmix(b * 10, 'm', 'cm') } }), nachweis: [G(`${lmix(a * 10, 'm', 'cm')} = ${a} cm`), G(`${lmix(b * 10, 'm', 'cm')} = ${b} cm`), G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`), G(`${f} cm · ${f} cm = ${q(f * f, 'cm²')}`), G(`${q(a * b, 'cm²')} : ${q(f * f, 'cm²')} = ${n}`)] }); },
    () => { const s = zz(6, 19), u = 4 * s;
      return zahl(`Ein Quadrat hat den Umfang ${l(u, 'm')}. Wie groß ist sein Flächeninhalt?`, s * s, fehlerliste(s * s, [[u, 'umfang-flaeche-verwechselt'], [(u / 2) * (u / 2), 'umfang-halb']]), h2('Rechne zuerst die Seitenlänge aus: u : 4.', 'Rechne dann A = a · a.'), { einheit: 'm²', nachweis: [G(`${u} m : 4 = ${s} m`), G(`${s} m · ${s} m = ${q(s * s, 'm²')}`)] }); },
    () => { const a = zz(12, 25), b = zz(5, a - 2), u = 2 * a + 2 * b;
      return zahl(`Ein Rechteck hat den Umfang ${l(u, 'cm')} und ist ${l(a, 'cm')} lang. Wie groß ist sein Flächeninhalt?`, a * b, fehlerliste(a * b, [[a * (u - a), 'umfang-halb'], [u, 'umfang-flaeche-verwechselt']]), h2('Rechne zuerst die Breite aus.', 'u − 2 · a ergibt zwei Breiten.'),
        { einheit: 'cm²', bild: mussSkizze('cm', a, b, { frage: 'links' }), nachweis: [G(`2 · ${a} cm = ${2 * a} cm`), G(`${u} cm − ${2 * a} cm = ${u - 2 * a} cm`), G(`${u - 2 * a} cm : 2 = ${b} cm`), G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`)] }); },
    () => { const A = wahl([24, 36, 48]), paare = []; for (let x = 2; x * x <= A; x++) if (A % x === 0) paare.push([A / x, x]);
      // Falsche Antworten haben denselben Umfang wie eine richtige: (a + 1) · (b − 1).
      const richtig = mische(paare).slice(0, 2), falsch = richtig.map(([x, y]) => [x + 1, y - 1]).filter(([x, y]) => y >= 1 && x * y !== A);
      const opts = [...richtig.map(([x, y]) => opt(`${x} cm · ${y} cm`, true)), ...falsch.map(([x, y]) => opt(`${x} cm · ${y} cm`, false, 'gleicher-umfang-gleiche-flaeche'))];
      return auswahl(`Welche Rechtecke haben den Flächeninhalt ${q(A, 'cm²')}? Kreuze alle Rechnungen an, die passen.`, mische(opts), h2('Rechne bei jeder Antwort a · b.', 'Es gibt mehr als eine richtige Antwort.'), { mehrfach: true, nachweis: [G(`${q(A, 'cm²')} = ${q(A * 100, 'mm²')}`)] }); },
  ]);
  S(R2, 'E', [
    () => { const ha = wahl([2, 3, 4, 6]), a = wahl([200, 300, 400]), w = ha * 10000, b = w / a;
      if (!Number.isInteger(b)) return null;
      return zahl(`Ein Feld ist ${q(ha, 'ha')} groß und ${l(a, 'm')} lang. Wie breit ist es?`, b, fehlerliste(b, [[(ha * 100) / a * 100, 'umrechnungszahl-flaeche'], [b * 10, 'umrechnungszahl-flaeche']].filter(([x]) => Number.isInteger(x))), h1('Wandle zuerst die Fläche in m² um.'),
        { einheit: 'm', nachweis: [G(`${q(ha, 'ha')} = ${q(w, 'm²')}`), G(`${q(w, 'm²')} : ${a} m = ${b} m`)] }); },
    () => { const a = zz(4, 7), b = zz(3, a - 1), t = wahl([150, 250]), s = 2, f = (s * t) / 100;
      if (!Number.isInteger(f)) return null;
      return zahl(`Ein Zimmer ist ${l(a, 'm')} lang und ${l(b, 'm')} breit. Darin liegt ein Teppich, ${l(s, 'm')} lang und ${l(t, 'cm')} breit. Wie viel m² Boden sind nicht bedeckt?`, a * b - f, fehlerliste(a * b - f, [[a * b - s * t, 'einheiten-gemischt-multipliziert'], [a * b, 'sach-schritt-vergessen']].filter(([x]) => x > 0)), h1('Rechne beide Flächen in m² aus. Achte beim Teppich auf die Einheiten.'),
        { einheit: 'm²', nachweis: [G(`${a} m · ${b} m = ${q(a * b, 'm²')}`), G(`${s} m · ${t} cm = ${q(f, 'm²')}`), G(`${q(a * b, 'm²')} − ${q(f, 'm²')} = ${q(a * b - f, 'm²')}`)] }); },
    () => { const u = wahl([40, 48, 56]), s = u / 4, a = s + wahl([2, 4]), b = u / 2 - a, d = s * s - a * b;
      return zahl(`Ein Quadrat und ein Rechteck haben beide den Umfang ${l(u, 'cm')}. Das Rechteck ist ${l(a, 'cm')} lang. Um wie viel cm² ist das Quadrat größer?`, d, fehlerliste(d, [[0, 'gleicher-umfang-gleiche-flaeche'], [s * s, 'sach-schritt-vergessen']]), h1('Rechne bei beiden Figuren zuerst die fehlende Seite aus.'),
        { einheit: 'cm²', nachweis: [G(`${u} cm : 4 = ${s} cm`), G(`${u} cm : 2 = ${u / 2} cm`), G(`${u / 2} cm − ${a} cm = ${b} cm`), G(`${s} cm · ${s} cm = ${q(s * s, 'cm²')}`), G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`), G(`${q(s * s, 'cm²')} − ${q(a * b, 'cm²')} = ${q(d, 'cm²')}`)] }); },
    () => { const s = zz(3, 8), u = 4 * s, kn = kind(), stimmt = false, beh = 2 * s * s;
      return auswahl(`Ein Quadrat hat den Umfang ${l(u, 'cm')}. ${kn} verdoppelt den Umfang auf ${l(2 * u, 'cm')} und sagt: Jetzt ist der Flächeninhalt ${q(beh, 'cm²')}. Stimmt das?`,
        [opt('Stimmt, denn der Flächeninhalt verdoppelt sich auch.', stimmt, 'gleicher-umfang-gleiche-flaeche'), opt(`Falsch, denn die Seite ist jetzt ${l(2 * s, 'cm')} lang und der Flächeninhalt ${q(4 * s * s, 'cm²')}.`, true), opt(`Falsch, denn der Flächeninhalt ist ${q(2 * u, 'cm²')}.`, false, 'umfang-flaeche-verwechselt')],
        h1('Rechne die neue Seitenlänge aus.'), { nachweis: [{ art: 'urteil', stimmt, behauptet: q(beh, 'cm²') }, G(`${u} cm : 4 = ${s} cm`), G(`${2 * u} cm : 4 = ${2 * s} cm`), G(`${2 * s} cm · ${2 * s} cm = ${q(4 * s * s, 'cm²')}`), HILFSGROESSE(q(2 * u, 'cm²'), 'falsche Rechnung')] }); },
    () => { const a = wahl([100, 105, 110]), b = wahl([60, 64, 70]), r = wahl([3, 4, 5]), u = 2 * a + 2 * b;
      return zahl(`Ein Sportplatz ist ${l(a, 'm')} lang und ${l(b, 'm')} breit. Lena läuft ${r} Runden um den Platz. Wie viele m läuft sie?`, r * u, fehlerliste(r * u, [[r * (a + b), 'umfang-halb'], [u, 'sach-schritt-vergessen']]), h1('Eine Runde ist der Umfang.'),
        { einheit: 'm', nachweis: [G(`2 · ${a} m + 2 · ${b} m = ${u} m`), G(`${r} · ${u} m = ${r * u} m`)] }); },
    () => { const b = zz(3, 12), a = 2 * b, u = 2 * a + 2 * b;
      return zahl(`Ein Rechteck hat den Umfang ${l(u, 'cm')}. Es ist doppelt so lang wie breit. Wie groß ist sein Flächeninhalt?`, a * b, fehlerliste(a * b, [[(u / 4) * (u / 4), 'umfang-halb'], [u, 'umfang-flaeche-verwechselt']]), h1('Der halbe Umfang ist Länge plus Breite, also drei Breiten.'),
        { einheit: 'cm²', nachweis: [G(`${u} cm : 2 = ${u / 2} cm`), G(`${u / 2} cm : 3 = ${b} cm`), G(`2 · ${b} cm = ${a} cm`), G(`${a} cm · ${b} cm = ${q(a * b, 'cm²')}`)] }); },
  ]);
}
