// Aufgaben zu 5.7.2 „Winkel vergleichen“ (Lernziele V1 und V2) nach ADR 0034.
// V1: Scheitel, Schenkel und Winkel erkennen und benennen. Griechische Buchstaben ab F, die Schreibweise ∢ASB ab M (gegen den Uhrzeigersinn).
// V2: Winkel ohne Messen vergleichen. Längere Schenkel und größere Bögen machen einen Winkel nicht größer: Die Bilder legen diese Falle absichtlich.
import { sechs, auswahl, opt, U, Z, h1, h2, h3, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, W, bildAus, reihe, GRIECH, PUNKTSAETZE, punkteVon, richtungFuer, verschieden, art } from './5-7-winkel.mjs';

const BV = 'winkel-bezeichnung';
// Ein Winkel mit Punktnamen, Größe und Richtung je Niveaustufe.
function einer(niveau, { g = null, satz = wahl(PUNKTSAETZE), n = 'α' } = {}) {
  const groesse = g ?? (niveau === 'F' ? 10 * zz(3, 15) : 5 * zz(5, 32)), w = W(groesse, richtungFuer(niveau, groesse), { l1: zz(110, 140), l2: zz(110, 140), n, punkte: punkteVon(satz) });
  return { w, satz, bild: bildAus([[w]]) };
}
// Zwei oder drei Winkel nebeneinander an einem Scheitel: α zwischen den Schenkeln zu A und B, β zwischen B und C, γ zwischen C und D.
function nachbarn(niveau, anzahl, { buchstaben = wahl([['S', 'A', 'B', 'C', 'D'], ['O', 'P', 'Q', 'R', 'T'], ['M', 'K', 'L', 'N', 'U']]) } = {}) {
  const groessen = suche(() => Array.from({ length: anzahl }, () => (niveau === 'F' ? 10 * zz(3, 7) : 5 * zz(7, 14))), (l) => l.reduce((x, y) => x + y, 0) <= 240);
  const gesamt = groessen.reduce((x, y) => x + y, 0), von = niveau === 'F' ? 0 : niveau === 'G' ? 5 * zz(0, 71) : zz(0, 359), L = 125;
  let r = von;
  const winkel = groessen.map((g, i) => { const w = W(g, r, { l1: L, l2: L, n: GRIECH[i], punkte: { s: buchstaben[0], a: buchstaben[i + 1], b: buchstaben[i + 2] }, spos: von + gesamt / 2 + 180, rb: 48 }); r += g; return w; });
  return { winkel, b: buchstaben, bild: bildAus([winkel]) };
}
const schenkelText = (S, A, B) => `${S}${A} und ${S}${B}`;
// Antworten: der Scheitel.
const scheitelFrage = (text, x, hilfen, n = 'α') => { const { s: S, a: A, b: B } = (x.w ?? x.winkel.find((w) => w.n === n)).punkte;
  return auswahl(text, [opt(S, true), opt(A, false, BV), opt(B, false, BV)], hilfen, { bild: x.bild, nachweis: [{ art: 'benennen', winkel: n, was: 'scheitel' }] }); };
const schenkelFrage = (text, x, hilfen, n = 'α') => { const { s: S, a: A, b: B } = (x.w ?? x.winkel.find((w) => w.n === n)).punkte;
  return auswahl(text, [opt(schenkelText(S, A, B), true), opt(`${A}${B} und ${S}${B}`, false, BV), opt(`${A}${B} und ${S}${A}`, false, BV), opt(`${A}${S} und ${A}${B}`, false, BV)], hilfen, { bild: x.bild, nachweis: [{ art: 'benennen', winkel: n, was: 'schenkel' }] }); };
const nameFrage = (text, x, hilfen, n = 'α') => { const { s: S, a: A, b: B } = (x.w ?? x.winkel.find((w) => w.n === n)).punkte;
  return auswahl(text, [opt(`∢${A}${S}${B}`, true), opt(`∢${B}${S}${A}`, false, BV), opt(`∢${S}${A}${B}`, false, BV), opt(`∢${A}${B}${S}`, false, BV), opt(`∢${S}${B}${A}`, false, BV)], hilfen, { bild: x.bild, nachweis: [{ art: 'benennen', winkel: n, was: 'name' }] }); };
// Welcher Winkel liegt zwischen den Schenkeln zu den Punkten p und q?
const zwischenFrage = (text, x, i, hilfen) => { const S = x.b[0], A = x.b[i + 1], B = x.b[i + 2];
  return auswahl(text(S, A, B), x.winkel.map((w, k) => opt(w.n, k === i, k === i ? undefined : BV)), hilfen, { bild: x.bild, nachweis: [{ art: 'winkelPunkte', s: S, a: A, b: B }] }); };
// Mehrere Winkel mit eigenen Scheiteln: Welcher hat den Scheitel …?
function scheitelWahl(text, niveau, hilfen) {
  const saetze = mische([['S', 'A', 'B'], ['P', 'Q', 'R'], ['K', 'L', 'N'], ['T', 'U', 'V']]).slice(0, 3);
  const winkel = saetze.map((satz, i) => { const g = niveau === 'F' ? 10 * zz(4, 13) : 5 * zz(8, 30); return W(g, richtungFuer(niveau, g), { l1: zz(95, 115), l2: zz(95, 115), n: GRIECH[i], punkte: punkteVon(satz) }); });
  const i = zz(0, 2), S = saetze[i][0];
  return auswahl(text(S), winkel.map((w, k) => opt(w.n, k === i, k === i ? undefined : BV)), hilfen, { bild: reihe(winkel), nachweis: [{ art: 'scheitelVon', scheitel: S }] });
}
// Ein einzelner Winkel mit einem der Buchstaben α, β, γ im Bogen: Wie heißt er?
function buchstabe(text, niveau, hilfen) {
  const n = wahl(GRIECH.slice(0, 3)), x = einer(niveau, { n });
  return auswahl(text, GRIECH.slice(0, 3).map((g) => opt(g, g === n, g === n ? undefined : BV)), hilfen, { bild: x.bild, nachweis: [{ art: 'scheitelVon', scheitel: x.w.punkte.s }] });
}

// ---------- V2: Vergleichen ohne Messen ----------
// Bilder mit Falle: Der größere Winkel bekommt die kürzeren Schenkel und den kleineren Bogen.
function vergleichsbild(groessen, niveau, { falle = true, eng = false } = {}) {
  const min = Math.min(...groessen), max = Math.max(...groessen), t = (g) => (max === min ? zz(0, 10) / 10 : (g - min) / (max - min));
  const winkel = groessen.map((g) => { const k = falle ? t(g) : 1 - t(g), l = Math.round(150 - 70 * k);
    return W(g, richtungFuer(niveau, g), { l1: l, l2: l + zz(-10, 10), rb: Math.round(46 - 20 * k) }); });
  return reihe(winkel, eng ? { luecke: 26 } : {});
}
function vergleich(text, groessen, was, niveau, hilfen, { mehrfach = false, ref = null, rang = null, beide = false, falle = true } = {}) {
  const bild = vergleichsbild(groessen, niveau, { falle }), winkel = bild.winkel, max = Math.max(...groessen), min = Math.min(...groessen);
  const refW = ref != null ? winkel[ref] : null, sortiert = [...groessen].sort((a, b) => b - a);
  const trifft = (w) => (was === 'groesster' || was === 'vergleich' ? w.groesse === max : was === 'kleinster' ? w.groesse === min : was === 'gleich' ? groessen.filter((x) => x === w.groesse).length > 1
    : was === 'groesserAls' ? w.groesse > refW.groesse : was === 'kleinerAls' ? w.groesse < refW.groesse : was === 'rang' ? w.groesse === sortiert[rang - 1] : art(w.groesse) === was);
  const kandidaten = winkel.filter((w) => w !== refW);
  const eindeutig = was === 'vergleich' ? groessen.filter((x) => x === max).length === 1 : true;
  const optionen = kandidaten.map((w) => { const ok = trifft(w) && eindeutig; return opt(w.n, ok, ok ? undefined : 'winkel-schenkellaenge'); });
  if (beide) optionen.push(opt('Beide sind gleich groß.', !eindeutig, !eindeutig ? undefined : 'winkel-schenkellaenge'));
  return auswahl(text, optionen, hilfen, { mehrfach, bild, nachweis: [{ art: 'winkelwahl', was, ...(refW ? { ref: refW.n } : {}), ...(rang ? { rang } : {}) }] });
}
const zehner = (n, ab = 3, bis = 15, abstand = 3) => verschieden(n, () => zz(ab, bis), abstand).map((x) => 10 * x);
const fuenfer = (n, ab, bis, abstand) => verschieden(n, () => zz(ab, bis), abstand).map((x) => 5 * x);
const grad = (n, ab, bis, abstand) => verschieden(n, () => zz(ab, bis), abstand);
// Ein Kind behauptet etwas über zwei Winkel im Bild. Die Behauptung beruht auf Schenkeln oder Bögen und stimmt nicht.
function behauptung(zeilen, niveau, wahr, falsch, hilfen, { bogen = false } = {}) {
  const [klein, gross] = niveau === 'F' ? [10 * zz(3, 6), 10 * zz(9, 14)] : [5 * zz(8, 14), 5 * zz(18, 28)];
  const bild = reihe([W(klein, richtungFuer(niveau, klein), { l1: bogen ? 100 : 160, l2: bogen ? 100 : 155, rb: bogen ? 52 : 40 }), W(gross, richtungFuer(niveau, gross), { l1: bogen ? 100 : 78, l2: bogen ? 100 : 82, rb: bogen ? 22 : 30 })]);
  return auswahl(zeilen, [opt(wahr, true), opt(falsch, false, 'winkel-schenkellaenge')], hilfen, { bild, nachweis: [U(false)] });
}

export function winkelVergleichen() {
  const V1 = '5.7.2-V1';
  sechs(V1, 'F', [
    () => scheitelFrage(Z('Schau dir den Winkel α an.', 'Welcher Punkt ist der Scheitel?'), einer('F'),
      h3('Der Scheitel ist die Spitze des Winkels.', 'Dort beginnen beide Schenkel.', 'Suche den Punkt, an dem die zwei Linien zusammenstoßen.')),
    () => schenkelFrage(Z('Schau dir den Winkel α an.', 'Welche Linien sind die Schenkel?'), einer('F'),
      h3('Die Schenkel beginnen beide im Scheitel.', 'Ein Schenkel heißt nach dem Scheitel und seinem zweiten Punkt.', 'Beide Namen fangen mit dem Scheitel an.')),
    () => scheitelWahl((S) => Z('Im Bild siehst du drei Winkel.', `Welcher Winkel hat den Scheitel ${S}?`), 'F',
      h3('Der Scheitel ist die Spitze eines Winkels.', 'Schau bei jedem Winkel auf den Punkt an der Spitze.', 'Lies den Buchstaben im Bogen dieses Winkels ab.')),
    () => buchstabe(Z('Im Bogen steht ein griechischer Buchstabe.', 'Wie heißt der Winkel?'), 'F',
      h3('Winkel bekommen griechische Buchstaben.', 'Der Buchstabe steht im Bogen.', 'Vergleiche ihn mit den Antworten.')),
    () => scheitelFrage(Z('Die Winkel α und β liegen nebeneinander.', 'Welcher Punkt ist der Scheitel von beiden?'), nachbarn('F', 2),
      h3('Beide Winkel haben dieselbe Spitze.', 'Der Scheitel ist die Spitze.', 'Der Punkt dazwischen liegt nur auf einem Schenkel.')),
    () => schenkelFrage(Z('Schau dir den Winkel α an.', 'Wie heißen seine Schenkel?'), einer('F', { satz: wahl(PUNKTSAETZE.slice(1)) }),
      h3('Jeder Schenkel beginnt im Scheitel.', 'Schreibe zuerst den Scheitel, dann den Punkt am Ende.', 'Ein Winkel hat genau zwei Schenkel.')),
  ]);
  sechs(V1, 'G', [
    () => scheitelFrage(Z('Schau dir den Winkel α an.', 'Welcher Punkt ist der Scheitel?'), einer('G'),
      h3('Der Winkel liegt schräg.', 'Der Scheitel ist trotzdem die Spitze.', 'Dort beginnen beide Schenkel.')),
    () => schenkelFrage(Z('Schau dir den Winkel α an.', 'Welche Linien sind die Schenkel?'), einer('G'),
      h3('Beide Schenkel beginnen im Scheitel.', 'Beide Namen fangen mit dem Scheitel an.', 'Die Linie zwischen den Endpunkten gehört nicht zum Winkel.')),
    () => zwischenFrage((S, A, B) => Z('Drei Winkel liegen nebeneinander.', `Welcher Winkel liegt zwischen ${S}${A} und ${S}${B}?`), nachbarn('G', 3), zz(0, 2),
      h3('Suche zuerst die beiden Schenkel.', 'Fahre mit dem Finger beide Linien entlang.', 'Der Winkel dazwischen ist gesucht.')),
    () => scheitelWahl((S) => Z('Im Bild siehst du drei Winkel.', `Welcher Winkel hat den Scheitel ${S}?`), 'G',
      h3('Der Scheitel ist die Spitze eines Winkels.', 'Die Winkel liegen schräg.', 'Suche den Punkt an der Spitze.')),
    () => schenkelFrage(Z('Die Winkel α und β liegen nebeneinander.', 'Welche Linien sind die Schenkel von β?'), nachbarn('G', 2),
      h3('Der Winkel β hat einen eigenen Bogen.', 'Seine Schenkel begrenzen diesen Bogen.', 'Ein Schenkel gehört zu α und zu β.'), 'β'),
    () => { const x = einer('G'), { s: S, a: A } = x.w.punkte, k = kind();
      return auswahl(Z(`${k} sagt: „Der Scheitel von α ist ${A}.“`, `Hat ${k} recht?`), [opt(`Nein.\n${A} liegt am Ende eines Schenkels.\nDer Scheitel ist ${S}.`, true), opt(`Ja.\n${A} steht als erster Buchstabe da.`, false, BV)],
        h3('Der Scheitel ist die Spitze des Winkels.', 'Die Punkte am Ende der Schenkel sind keine Scheitel.', `Prüfe, wo die beiden Schenkel beginnen.`), { bild: x.bild, nachweis: [U(false)] }); },
  ]);
  sechs(V1, 'M', [
    () => nameFrage('Wie heißt der Winkel α mit drei Buchstaben? Gehe gegen den Uhrzeigersinn vom ersten zum zweiten Schenkel.', einer('M'),
      h2('Der Scheitel steht immer in der Mitte.', 'Vorne steht der Punkt auf dem Schenkel, von dem du gegen den Uhrzeigersinn losgehst.')),
    () => zwischenFrage((S, A, B) => `Drei Winkel liegen an einem Scheitel nebeneinander. Welcher Winkel ist ∢${A}${S}${B}?`, nachbarn('M', 3), zz(0, 2),
      h2(`Der mittlere Buchstabe ist der Scheitel. Die beiden anderen nennen die Schenkel.`, 'Suche die beiden Schenkel und den Bogen zwischen ihnen.')),
    () => nameFrage('Wie heißt der Winkel β mit drei Buchstaben? Gehe gegen den Uhrzeigersinn vom ersten zum zweiten Schenkel.', nachbarn('M', 2),
      h2('Der Scheitel steht in der Mitte.', 'Gehe gegen den Uhrzeigersinn vom ersten Schenkel von β zum zweiten.'), 'β'),
    () => schenkelFrage('Welche Strecken sind die Schenkel des Winkels α?', einer('M'),
      h2('Beide Schenkel beginnen im Scheitel.', 'Die Verbindung der beiden Endpunkte ist kein Schenkel.')),
    () => schenkelFrage('Wie heißen die Schenkel von γ?', nachbarn('M', 3),
      h2('Jeder Schenkel beginnt im gemeinsamen Scheitel.', 'Suche die beiden Linien, die den Bogen von γ begrenzen.'), 'γ'),
    () => { const x = einer('M', { satz: ['S', 'A', 'B'] }), k = kind();
      return auswahl(`${k} schreibt für den Winkel α: ∢BSA. Hat ${k} recht?`, [opt('Nein. Gegen den Uhrzeigersinn geht es von SA nach SB. Richtig ist ∢ASB.', true), opt('Ja. Die Reihenfolge der Buchstaben ist egal.', false, BV), opt('Nein. Der Scheitel muss immer vorne stehen. Richtig ist ∢SAB.', false, BV)],
        h2('Bei ∢ASB steht der Scheitel in der Mitte. Vorne steht der Schenkel, von dem man gegen den Uhrzeigersinn losgeht.', '∢BSA wäre der Winkel außen herum.'), { bild: x.bild, nachweis: [U(false)] }); },
  ]);
  sechs(V1, 'E', [
    () => nameFrage('Wie heißt der Winkel α mit drei Buchstaben?', einer('E', { satz: wahl(PUNKTSAETZE.slice(1)) }),
      h1('Der Scheitel steht in der Mitte, gelesen wird gegen den Uhrzeigersinn.')),
    () => zwischenFrage((S, A, B) => `Welcher der drei Winkel ist ∢${A}${S}${B}?`, nachbarn('E', 3), zz(0, 2),
      h1('Der mittlere Buchstabe ist der Scheitel, die äußeren nennen die Schenkel.')),
    () => nameFrage('Wie heißt der Winkel γ mit drei Buchstaben?', nachbarn('E', 3),
      h1('Gehe von dem Schenkel aus los, von dem γ sich gegen den Uhrzeigersinn öffnet.'), 'γ'),
    () => { const x = nachbarn('E', 3), S = x.b[0], start = zz(0, 1), A = x.b[1 + start], Z2 = x.b[3 + start], drin = (k) => k === start || k === start + 1;
      return auswahl(`Der Winkel ∢${A}${S}${Z2} setzt sich aus Winkeln im Bild zusammen. Aus welchen? Kreuze alle an.`, x.winkel.map((w, k) => opt(w.n, drin(k), drin(k) ? undefined : BV)),
        h1('Gehe gegen den Uhrzeigersinn vom ersten bis zum letzten genannten Schenkel.'), { mehrfach: true, bild: x.bild, nachweis: [{ art: 'teilwinkel', s: S, a: A, b: Z2 }] }); },
    () => schenkelFrage('Wie heißen die Schenkel des Winkels β?', nachbarn('E', 3),
      h1('Suche die beiden Linien, die den Bogen von β begrenzen.'), 'β'),
    () => { const x = einer('E', { g: 5 * zz(6, 14), satz: ['S', 'A', 'B'] }), k = kind();
      return auswahl(`${k} sagt: „∢ASB und ∢BSA sind gleich groß, sie haben ja dieselben Schenkel.“ Stimmt das?`, [opt('Nein. ∢BSA ist der überstumpfe Winkel außen herum.', true), opt('Ja. Es kommt nur auf die beiden Schenkel an.', false, BV)],
        h1('Gegen den Uhrzeigersinn von SB nach SA ist ein anderer Weg als von SA nach SB.'), { bild: x.bild, nachweis: [U(false)] }); },
  ]);

  const V2 = '5.7.2-V2';
  sechs(V2, 'F', [
    () => vergleich(Z('Schau dir die beiden Winkel an.', 'Welcher Winkel ist größer?'), zehner(2, 3, 15, 4), 'groesster', 'F',
      h3('Lange Schenkel machen einen Winkel nicht größer.', 'Schau, wie weit sich die Schenkel öffnen.', 'Der Winkel mit der größeren Öffnung ist größer.')),
    () => vergleich(Z('Schau dir die beiden Winkel an.', 'Welcher Winkel ist kleiner?'), zehner(2, 3, 15, 4), 'kleinster', 'F',
      h3('Ein großer Bogen macht einen Winkel nicht größer.', 'Schau, wie weit sich die Schenkel öffnen.', 'Der Winkel mit der kleineren Öffnung ist kleiner.')),
    () => vergleich(Z('Schau dir die drei Winkel an.', 'Welcher Winkel ist am größten?'), zehner(3, 3, 15, 3), 'groesster', 'F',
      h3('Achte nur auf die Öffnung zwischen den Schenkeln.', 'Vergleiche immer zwei Winkel miteinander.', 'Der Winkel mit der größten Öffnung ist am größten.')),
    () => { const g = 10 * zz(4, 12), andere = g <= 80 ? g + 10 * zz(3, 5) : g - 10 * zz(3, 5);
      return vergleich(Z('Schau dir die beiden Winkel an.', 'Welcher Winkel ist größer?'), mische(wahl([[g, g], [g, andere]])), 'vergleich', 'F',
        h3('Lange Schenkel machen einen Winkel nicht größer.', 'Vergleiche nur die Öffnung.', 'Manchmal sind beide Winkel gleich groß.'), { beide: true }); },
    () => behauptung(Z(`${kind()} sagt: „α hat die längeren Schenkel.“`, '„Also ist α größer.“', 'Stimmt das?'), 'F', 'Nein.\nβ öffnet sich weiter.\nAlso ist β größer.', 'Ja.\nLange Schenkel machen einen Winkel groß.',
      h3('Die Länge der Schenkel ist egal.', 'Nur die Öffnung zählt.', 'Vergleiche, wie weit sich die Schenkel öffnen.')),
    () => vergleich(Z('Schau dir die drei Winkel an.', 'Welcher Winkel ist am kleinsten?'), zehner(3, 3, 15, 3), 'kleinster', 'F',
      h3('Achte nur auf die Öffnung zwischen den Schenkeln.', 'Ein kurzer Schenkel macht einen Winkel nicht klein.', 'Der Winkel mit der kleinsten Öffnung ist am kleinsten.')),
  ]);
  sechs(V2, 'G', [
    () => vergleich(Z('Die drei Winkel liegen verschieden.', 'Welcher Winkel ist am größten?'), fuenfer(3, 6, 32, 3), 'groesster', 'G',
      h3('Dreh die Winkel in Gedanken.', 'Lege einen Schenkel immer waagerecht.', 'Vergleiche dann die Öffnungen.')),
    () => vergleich(Z('Die drei Winkel liegen verschieden.', 'Welcher Winkel ist am kleinsten?'), fuenfer(3, 6, 32, 3), 'kleinster', 'G',
      h3('Die Lage eines Winkels ist egal.', 'Dreh die Winkel in Gedanken.', 'Vergleiche dann die Öffnungen.')),
    () => { const g = 5 * zz(8, 28), rest = suche(() => [5 * zz(6, 32), 5 * zz(6, 32)], ([a, b]) => Math.abs(a - b) >= 15 && Math.abs(a - g) >= 15 && Math.abs(b - g) >= 15);
      return vergleich(Z('Zwei der Winkel sind gleich groß.', 'Welche sind es?', 'Kreuze beide an.'), mische([g, g, ...rest]), 'gleich', 'G',
        h3('Gleich große Winkel können verschieden liegen.', 'Auch die Schenkel können verschieden lang sein.', 'Vergleiche nur die Öffnungen.'), { mehrfach: true }); },
    () => vergleich(Z('Schau dir die beiden Winkel an.', 'Welcher Winkel ist größer?'), fuenfer(2, 6, 32, 4), 'groesster', 'G',
      h3('Ein großer Bogen macht einen Winkel nicht größer.', 'Schau nur auf die Schenkel.', 'Vergleiche, wie weit sie sich öffnen.')),
    () => { const gs = mische([5 * zz(6, 17), 5 * zz(20, 34), wahl([5 * zz(6, 17), 5 * zz(20, 34)])]);
      return vergleich(Z('Welche Winkel sind kleiner als ein rechter Winkel?', 'Kreuze alle an.'), gs, 'spitz', 'G',
        h3('Ein rechter Winkel sieht aus wie eine Heftecke.', 'Halte eine Heftecke an jeden Winkel.', 'Passt der Winkel in die Ecke, ist er kleiner.'), { mehrfach: true }); },
    () => behauptung(((k) => Z(`${k} sagt: „Der Bogen von α ist größer.“`, '„Also ist α der größere Winkel.“', `Hat ${k} recht?`))(kind()), 'G', 'Nein.\nDie Größe des Bogens ist egal.\nβ öffnet sich weiter.', 'Ja.\nEin großer Bogen gehört zu einem großen Winkel.',
      h3('Der Bogen zeigt nur, welcher Winkel gemeint ist.', 'Er kann groß oder klein gezeichnet sein.', 'Vergleiche die Öffnung der Schenkel.'), { bogen: true }),
  ]);
  sechs(V2, 'M', [
    () => vergleich('Welcher der vier Winkel ist am größten?', grad(4, 30, 165, 8), 'groesster', 'M',
      h2('Lage, Schenkellänge und Bogen sind egal.', 'Dreh die Winkel in Gedanken so, dass ein Schenkel waagerecht liegt.')),
    () => { const g = zz(35, 150), rest = suche(() => [zz(30, 160), zz(30, 160)], ([a, b]) => Math.abs(a - b) >= 10 && Math.abs(a - g) >= 10 && Math.abs(b - g) >= 10);
      return vergleich('Zwei der vier Winkel sind gleich groß. Kreuze beide an.', mische([g, g, ...rest]), 'gleich', 'M', h2('Gleich große Winkel können verschieden liegen und verschieden lange Schenkel haben.', 'Pause die Winkel in Gedanken ab und lege sie aufeinander.'), { mehrfach: true }); },
    () => { const gs = grad(4, 30, 160, 10);
      return vergleich('Welche Winkel sind größer als α? Kreuze alle an.', gs, 'groesserAls', 'M', h2('Vergleiche jeden Winkel einzeln mit α.', 'Lege in Gedanken den Scheitel auf den Scheitel von α und einen Schenkel auf einen Schenkel.'), { mehrfach: true, ref: 0 }); },
    () => vergleich('Welcher der vier Winkel ist am kleinsten?', grad(4, 25, 165, 8), 'kleinster', 'M',
      h2('Lage, Schenkellänge und Bogen sind egal.', 'Vergleiche die Öffnungen der Winkel paarweise.')),
    () => vergleich('Welche Winkel sind kleiner als δ? Kreuze alle an.', grad(4, 30, 160, 10), 'kleinerAls', 'M',
      h2('Vergleiche jeden Winkel einzeln mit δ.', 'Lass dich von langen Schenkeln nicht täuschen.'), { mehrfach: true, ref: 3 }),
    () => { const [a, b] = suche(() => [zz(50, 85), zz(70, 140)], ([x, y]) => y - x >= 20 && Math.abs(y / 2 - x) >= 14), k = kind();
      const bild = bildAus([[W(a, 0, { l1: 215, l2: 215, n: 'α', rb: 30 }), W(b, 0, { l1: 160, l2: 160, n: 'β', rb: 125 })]], {});
      return auswahl(`${k} legt die Winkel α und β mit dem Scheitel und einem Schenkel aufeinander. Der zweite Schenkel von α liegt innerhalb von β. Was folgt daraus?`,
        [opt('α ist kleiner als β.', true), opt('α ist größer als β, denn seine Schenkel sind länger.', false, 'winkel-schenkellaenge'), opt('Man kann es nicht sagen, denn die Schenkel sind verschieden lang.', false, 'winkel-schenkellaenge')],
        h2('Beim Aufeinanderlegen zählt nur, wo der zweite Schenkel liegt.', 'Liegt er innerhalb des anderen Winkels, ist der Winkel kleiner.'), { bild, nachweis: [U(true)] }); },
  ]);
  sechs(V2, 'E', [
    () => vergleich('Welcher der vier Winkel ist am größten?', grad(4, 30, 170, 5), 'groesster', 'E', h1('Lage, Schenkellänge und Bogen sind egal. Vergleiche nur die Öffnungen.')),
    () => { const g = zz(35, 150), rest = suche(() => [zz(30, 160), zz(30, 160)], ([a, b]) => Math.abs(a - b) >= 6 && Math.abs(a - g) >= 6 && Math.abs(b - g) >= 6);
      return vergleich('Zwei der vier Winkel sind gleich groß. Kreuze beide an.', mische([g, g, ...rest]), 'gleich', 'E', h1('Pause die Winkel in Gedanken ab und lege sie aufeinander.'), { mehrfach: true }); },
    () => vergleich('Welche Winkel sind größer als β? Kreuze alle an.', grad(4, 30, 165, 7), 'groesserAls', 'E', h1('Vergleiche jeden Winkel einzeln mit β, ohne dich von der Lage täuschen zu lassen.'), { mehrfach: true, ref: 1 }),
    () => vergleich('Welcher Winkel ist der zweitgrößte?', grad(4, 30, 165, 7), 'rang', 'E', h1('Bringe die Winkel der Größe nach in eine Reihenfolge.'), { rang: 2 }),
    () => vergleich('Welcher der vier Winkel ist am kleinsten?', grad(4, 25, 170, 5), 'kleinster', 'E', h1('Lass dich von kurzen Schenkeln und kleinen Bögen nicht täuschen.')),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Ein Winkel mit kurzen Schenkeln kann größer sein als ein Winkel mit langen Schenkeln.“ Stimmt das?`, [opt('Ja. Die Größe hängt nur von der Öffnung ab. Im Bild ist β größer als α.', true), opt('Nein. Kurze Schenkel gehören immer zu den kleinen Winkeln.', false, 'winkel-schenkellaenge')],
        h1('Schau dir die Schenkel und die Öffnungen im Bild an.'), { bild: reihe([W(zz(30, 50), zz(0, 359), { l1: 165, l2: 160, rb: 44 }), W(zz(100, 140), zz(0, 359), { l1: 70, l2: 72, rb: 24 })]), nachweis: [U(true)] }); },
  ]);
}
