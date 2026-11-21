// Aufgaben zu 5.5.6 „Achsensymmetrie und Punktsymmetrie“ (Lernziele A1, A2 und A3) nach ADR 0015 und ADR 0032.
// A1 Symmetrieachsen erkennen und einzeichnen, A2 an einer Achse spiegeln und Figuren ergänzen, A3 Punktsymmetrie.
// F und G: Achsen entlang der Kästchenlinien, ergänzt wird durch Antippen von Kästchen. Ab M: schräge Achsen (Gitterdiagonale), gesetzt werden Eckpunkte.
// A3: F und G entscheiden am Bild („halbe Drehung“), ab M wird am Symmetriezentrum gespiegelt, E vergleicht Achsen- und Punktsymmetrie.
import { sechs, zahl, auswahl, opt, luecken, gitterPunkte, gitterZellen, gitterLinie, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, FG, plus, minus, drin, kreuzP, spiegleX, spiegleY, spieglePunkt, spiegleDiag } from './5-5-geo.mjs';
import { ACHSE } from '../werkzeug.mjs';

const L_ = (kurz) => `5.5.6-${kurz}`;
const P = (p) => `(${p[0]}|${p[1]})`;
// Vielecke mit bekannter Symmetrie: e Ecken, a Anzahl der Achsen, p punktsymmetrisch, achsen: je zwei Gitterpunkte auf einer Achse.
const FORMEN = {
  rechteck: { e: [[0, 0], [4, 0], [4, 2], [0, 2]], a: 2, p: true, achsen: [[[2, 0], [2, 1]], [[0, 1], [1, 1]]] },
  quadrat: { e: [[0, 0], [4, 0], [4, 4], [0, 4]], a: 4, p: true, achsen: [[[2, 0], [2, 1]], [[0, 2], [1, 2]], [[0, 0], [1, 1]], [[0, 4], [1, 3]]] },
  dreieck: { e: [[0, 0], [4, 0], [2, 3]], a: 1, p: false, achsen: [[[2, 0], [2, 1]]] },
  schief: { e: [[0, 0], [4, 0], [0, 3]], a: 0, p: false },
  parallelogramm: { e: [[0, 0], [3, 0], [4, 2], [1, 2]], a: 0, p: true },
  raute: { e: [[1, 0], [2, 2], [1, 4], [0, 2]], a: 2, p: true, achsen: [[[1, 0], [1, 1]], [[0, 2], [1, 2]]] },
  drachen: { e: [[2, 0], [4, 3], [2, 4], [0, 3]], a: 1, p: false, achsen: [[[2, 0], [2, 1]]] },
  trapez: { e: [[0, 0], [4, 0], [3, 2], [1, 2]], a: 1, p: false, achsen: [[[2, 0], [2, 1]]] },
  trapezSchief: { e: [[0, 0], [4, 0], [2, 2], [0, 2]], a: 0, p: false },
  haus: { e: [[0, 0], [2, 0], [2, 2], [1, 3], [0, 2]], a: 1, p: false, achsen: [[[1, 0], [1, 1]]] },
  lForm: { e: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 4], [0, 4]], a: 0, p: false },
  sForm: { e: [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [1, 2], [1, 1], [0, 1]], a: 0, p: true },
  tForm: { e: [[1, 0], [2, 0], [2, 2], [3, 2], [3, 3], [0, 3], [0, 2], [1, 2]], a: 1, p: false },
  kreuz: { e: [[1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [2, 2], [2, 3], [1, 3], [1, 2], [0, 2], [0, 1], [1, 1]], a: 4, p: true },
  pfeil: { e: [[0, 1], [2, 1], [2, 0], [4, 2], [2, 4], [2, 3], [0, 3]], a: 1, p: false, achsen: [[[0, 2], [1, 2]]] },
  drachenD: { e: [[0, 0], [3, 1], [5, 5], [1, 3]], a: 1, p: false, achsen: [[[0, 0], [1, 1]]] },
  rauteD: { e: [[0, 0], [3, 1], [4, 4], [1, 3]], a: 2, p: true, achsen: [[[0, 0], [1, 1]], [[3, 1], [2, 2]]] },
  lGleich: { e: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], a: 1, p: false, achsen: [[[0, 0], [1, 1]]] },
  dreieckD: { e: [[0, 0], [4, 1], [1, 4]], a: 1, p: false, achsen: [[[0, 0], [1, 1]]] },
};
const setze = (k, p) => FORMEN[k].e.map((q) => plus(q, p));
const achsenVon = (k, p) => (FORMEN[k].achsen ?? []).map(([a, b]) => [plus(a, p), plus(b, p)]);
const masse = (k) => [Math.max(...FORMEN[k].e.map((q) => q[0])), Math.max(...FORMEN[k].e.map((q) => q[1]))];
// Figuren A, B, C (, D) nebeneinander; vier Figuren stehen in zwei Reihen.
function nebeneinander(schluessel) {
  const zwei = schluessel.length === 4;
  const figuren = schluessel.map((k, i) => { const [w, hh] = masse(k), sp = zwei ? i % 2 : i, zeile = zwei ? 1 - Math.floor(i / 2) : 0; return FG('ABCD'[i], setze(k, [sp * 6 + 1 + Math.floor((5 - w) / 2), zeile * 6 + 1 + Math.floor((5 - hh) / 2)])); });
  return GT(zwei ? 12 : schluessel.length * 6, zwei ? 13 : 7, { figuren });
}
const figurOptionen = (schluessel, trifft, fv) => schluessel.map((k, i) => opt(`Figur ${'ABCD'[i]}`, trifft(FORMEN[k]), trifft(FORMEN[k]) ? undefined : fv?.(k)));
// Eine einzelne Figur F mitten im Gitter.
function einzeln(k, b = 8, h = 7, rand = 1) { const [w, hh] = masse(k), p = [zz(rand, b - w - rand), zz(rand, h - hh - rand)]; return { p, ecken: setze(k, p), g: (teile = {}) => GT(b, h, { figuren: [FG('F', setze(k, p))], ...teile }) }; }

// Kästchenfiguren. Halbe Figur neben einer Achse: je Reihe ein Streifen aus k Kästchen, `luecke` Kästchen von der Achse entfernt.
function halbfigur({ senkrecht = true, reihen = 3, breit = 3, luecke = 0, rechts = false } = {}) {
  const ks = suche(() => Array.from({ length: reihen }, () => zz(1, breit)), (x) => new Set(x).size > 1 && String(x) !== String([...x].reverse()) && Math.max(...x) === breit);
  const halbB = breit + luecke + 1, ax = halbB, b = senkrecht ? 2 * halbB : reihen + 2, h = senkrecht ? reihen + 2 : 2 * halbB;
  const roh = ks.flatMap((k, r) => Array.from({ length: k }, (_, j) => (senkrecht ? [ax - luecke - 1 - j, 1 + r] : [1 + r, ax - luecke - 1 - j])));
  const spiegel = (c) => (senkrecht ? [2 * ax - c[0] - 1, c[1]] : [c[0], 2 * ax - c[1] - 1]);
  const zellen = rechts ? roh.map(spiegel) : roh, bild = zellen.map(spiegel);
  // Typische Fehler: verschoben statt gespiegelt (dieselbe Form im Feld des Spiegelbilds), zu nah an der Achse.
  const v = 2 * luecke + breit, verschoben = zellen.map((c) => (senkrecht ? [c[0] + (rechts ? -v : v), c[1]] : [c[0], c[1] + (rechts ? -v : v)]));
  const nah = luecke ? bild.map((c) => (senkrecht ? [c[0] + (rechts ? luecke : -luecke), c[1]] : [c[0], c[1] + (rechts ? luecke : -luecke)])) : [];
  const achse = senkrecht ? ACHSE([ax, 0], [ax, 1]) : ACHSE([0, ax], [1, ax]);
  return { zellen, bild, verschoben, nah, achse, ax, b, h, senkrecht };
}
const BUCHSTABEN = { H: ['#.#', '#.#', '###', '#.#', '#.#'], T: ['###', '.#.', '.#.', '.#.', '.#.'], E: ['###', '#..', '###', '#..', '###'], U: ['#.#', '#.#', '#.#', '#.#', '###'], L: ['#..', '#..', '#..', '#..', '###'],
  F: ['###', '#..', '###', '#..', '#..'], S: ['###', '#..', '###', '..#', '###'], Z: ['###', '..#', '.#.', '#..', '###'], I: ['###', '.#.', '.#.', '.#.', '###'], A: ['###', '#.#', '###', '#.#', '#.#'], C: ['###', '#..', '#..', '#..', '###'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'] };
const ACHSEN_BUCHSTABE = { H: 2, T: 1, E: 1, U: 1, L: 0, F: 0, S: 0, Z: 0, I: 2, A: 1, C: 1, X: 2 }, PUNKT_BUCHSTABE = { H: true, T: false, E: false, U: false, L: false, F: false, S: true, Z: true, I: true, A: false, C: false, X: true };
const buchstabe = (k, x0 = 2, y0 = 1) => BUCHSTABEN[k].flatMap((zeile, r) => [...zeile].map((c, s) => (c === '#' ? [x0 + s, y0 + 4 - r] : null)).filter(Boolean));
const buchstabenBild = (k) => GT(7, 7, { zellen: buchstabe(k) });
// Punkte auf einer Seite einer Achse, mit Spiegelbildern im Gitter.
function achsenlage(art, b, h) {
  if (art === 'senkrecht') { const ax = Math.floor(b / 2); return { achse: ACHSE([ax, 0], [ax, 1]), f: (p) => spiegleX(p, ax), seite: (p) => p[0] - ax, ax }; }
  if (art === 'waagerecht') { const ay = Math.floor(h / 2); return { achse: ACHSE([0, ay], [1, ay]), f: (p) => spiegleY(p, ay), seite: (p) => p[1] - ay, ay }; }
  const a = art === 'steigt' ? [0, 0] : [0, h];
  return { achse: ACHSE(a, plus(a, art === 'steigt' ? [1, 1] : [1, -1])), f: (p) => spiegleDiag(p, a, art === 'steigt'), seite: (p) => (art === 'steigt' ? p[1] - p[0] : p[0] + p[1] - h) };
}
// n Punkte auf derselben Seite der Achse, nicht auf ihr, Bilder im Gitter, alle paarweise verschieden und nicht auf einer Geraden (ab drei Punkten).
function urbilder(lage, n, b, h, min = 1) {
  return suche(() => Array.from({ length: n }, () => [zz(0, b), zz(0, h)]), (ps) => { const alle = [...ps, ...ps.map(lage.f)];
    return drin(b, h, ...alle) && new Set(alle.map(String)).size === 2 * n && ps.every((p) => Math.sign(lage.seite(p)) === Math.sign(lage.seite(ps[0])) && Math.abs(lage.seite(p)) >= min)
      && (n < 3 || kreuzP(minus(ps[1], ps[0]), minus(ps[2], ps[0])) !== 0) && ps.every((p, i) => ps.every((q, j) => i >= j || Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1])) >= 2)); });
}

export function symmetrie() {
  // =====================================================================
  // A1 Symmetrieachsen erkennen und einzeichnen
  // =====================================================================
  const symFigur = (opts) => { const x = halbfigur(opts); return { ...x, alle: [...x.zellen, ...x.bild] }; };
  const achseZeichnen = (text, k, b, h, hilfen, fehler = []) => { const f = einzeln(k, b, h), achsen = achsenVon(k, f.p);
    return gitterLinie(text, f.g(), 'gerade', achsen.length === 1 ? { art: 'gerade', a: achsen[0][0], b: achsen[0][1] } : { art: 'eine', linien: achsen }, achsen[0], fehler.map((x) => x(f)), hilfen, { nachweis: [{ art: 'achseZeichnen', figur: 'F' }] }); };
  sechs(L_('A1'), 'F', [
    () => { const x = symFigur({ reihen: zz(3, 4), breit: 3 }), ok = wahl([true, true, false]), ax = ok ? x.ax : x.ax + wahl([-1, 1]);
      return auswahl(Z('Falte die Figur in Gedanken an der Linie g.', 'Liegen beide Hälften genau aufeinander?'), [opt('Die Hälften liegen genau aufeinander.', ok), opt('Die Hälften passen nicht aufeinander.', !ok)],
        h3('Eine Symmetrieachse teilt die Figur in zwei gleiche Hälften.', 'Auf beiden Seiten der Linie liegen gleich viele Kästchen in jeder Reihe.', 'Zähle in jeder Reihe die Kästchen links und rechts von g.'), { bild: B.gitter(GT(x.b, x.h, { zellen: x.alle, linien: [LN('g', [ax, 0], [ax, 1], 'gerade', 'achse')] })), nachweis: [{ art: 'istAchse', figur: 'zellen', linie: 'g', wert: ok }] }); },
    () => { const ks = mische([wahl(['rechteck', 'dreieck', 'trapez', 'haus']), wahl(['schief', 'trapezSchief']), wahl(['parallelogramm', 'lForm'])]);
      return auswahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist symmetrisch?'), figurOptionen(ks, (f) => f.a > 0, (k) => (k === 'parallelogramm' ? 'diagonale-als-achse' : undefined)),
        h3('Eine symmetrische Figur kannst du in der Mitte falten.', 'Beide Hälften liegen dann genau aufeinander.', 'Suche die Figur mit zwei gleichen Hälften.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: 'achsensymmetrisch' }] }); },
    () => { const x = symFigur({ reihen: zz(3, 4), breit: zz(2, 3) });
      return gitterLinie(Z('Die Figur ist symmetrisch.', 'Zeichne ihre Symmetrieachse ein.'), GT(x.b, x.h, { zellen: x.alle }), 'gerade', { art: 'gerade', a: [x.ax, 0], b: [x.ax, 1] }, [[x.ax, 0], [x.ax, x.h]], [[{ art: 'gerade', a: [x.ax - 1, 0], b: [x.ax - 1, 1] }, 'spiegel-abstand'], [{ art: 'gerade', a: [x.ax + 1, 0], b: [x.ax + 1, 1] }, 'spiegel-abstand']],
        h3('Die Symmetrieachse liegt genau in der Mitte der Figur.', 'Links und rechts von der Achse liegen gleich viele Kästchen.', 'Tippe zwei Punkte auf der Linie in der Mitte an: einen oben und einen unten.'), { nachweis: [{ art: 'achseZeichnen', figur: 'zellen' }] }); },
    () => { const art = wahl(['eine', 'zwei', 'keine']), x = symFigur({ reihen: 3, breit: 3 }), w = zz(4, 5), hh = zz(2, 3);
      const zellen = art === 'eine' ? x.alle : art === 'zwei' ? Array.from({ length: w * hh }, (_, i) => [1 + (i % w), 1 + Math.floor(i / w)]) : buchstabe(wahl(['L', 'F']));
      const g = art === 'eine' ? GT(x.b, x.h, { zellen }) : GT(7, 7, { zellen }), n = { eine: 1, zwei: 2, keine: 0 }[art];
      return zahl(Z('Schau dir die Figur an.', 'Wie viele Symmetrieachsen hat sie?'), n, fehlerliste(n, [[n + 1, 'diagonale-als-achse'], [4, 'diagonale-als-achse']]),
        h3('Probiere in Gedanken verschiedene Faltlinien aus.', 'Du kannst von links nach rechts falten oder von oben nach unten.', 'Prüfe erst die Linie von oben nach unten, dann die Linie von links nach rechts.'), { bild: B.gitter(g), nachweis: [{ art: 'achsen', figur: 'zellen', wert: n }] }); },
    () => { const k = wahl(['dreieck', 'trapez', 'haus', 'drachen']), f = einzeln(k, 8, 7), [achse] = achsenVon(k, f.p), [, hh] = masse(k), namen = mische(['a', 'b']), quer = [[0, f.p[1] + Math.floor(hh / 2)], [1, f.p[1] + Math.floor(hh / 2)]];
      return auswahl(Z('Du siehst die Figur F und zwei Linien.', 'Welche Linie ist die Symmetrieachse?'), ['a', 'b'].map((n) => opt(`Linie ${n}`, n === namen[0])),
        h3('An der Symmetrieachse kannst du die Figur falten.', 'Beide Hälften liegen dann genau aufeinander.', 'Prüfe bei jeder Linie: Sehen beide Seiten gleich aus?'), { bild: B.gitter(f.g({ linien: [LN(namen[0], ...achse, 'gerade', 'hilfs'), LN(namen[1], ...quer, 'gerade', 'hilfs')] })), nachweis: [{ art: 'achsenwahl', figur: 'F' }] }); },
    () => { const k = wahl(['H', 'T', 'E', 'U', 'A', 'C', 'I', 'L', 'F']), n = ACHSEN_BUCHSTABE[k];
      return zahl(Z(`Die Figur sieht aus wie der Buchstabe ${k}.`, 'Wie viele Symmetrieachsen hat sie?'), n, fehlerliste(n, [[n + 1, 'diagonale-als-achse']]),
        h3('Probiere in Gedanken verschiedene Faltlinien aus.', 'Du kannst von links nach rechts falten oder von oben nach unten.', 'Prüfe beide Faltlinien einzeln.'), { bild: B.gitter(buchstabenBild(k)), nachweis: [{ art: 'achsen', figur: 'zellen', wert: n }] }); },
  ]);
  sechs(L_('A1'), 'G', [
    () => { const ks = mische([wahl(['rechteck', 'trapez']), wahl(['dreieck', 'haus', 'drachen']), wahl(['parallelogramm', 'schief', 'trapezSchief'])]);
      return auswahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist nicht achsensymmetrisch?'), figurOptionen(ks, (f) => f.a === 0),
        h3('Eine achsensymmetrische Figur hat mindestens eine Symmetrieachse.', 'Suche bei jeder Figur nach einer Faltlinie.', 'Bei einer der Figuren passt keine Faltlinie.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: 'nicht achsensymmetrisch' }] }); },
    () => { const k = wahl(['rechteck', 'dreieck', 'trapez', 'parallelogramm', 'schief', 'haus']), f = einzeln(k), n = FORMEN[k].a;
      return zahl(Z('Schau dir die Figur F an.', 'Wie viele Symmetrieachsen hat sie?'), n, fehlerliste(n, [[k === 'rechteck' ? 4 : 2, 'diagonale-als-achse'], [n + 1, 'diagonale-als-achse']]),
        h3('Prüfe jede mögliche Faltlinie einzeln.', 'Eine Linie von Ecke zu Ecke ist nicht immer eine Symmetrieachse.', 'Falte in Gedanken: Liegen wirklich alle Ecken aufeinander?'), { bild: B.gitter(f.g()), nachweis: [{ art: 'achsen', figur: 'F', wert: n }] }); },
    () => { const x = symFigur({ senkrecht: false, reihen: zz(3, 4), breit: zz(2, 3) });
      return gitterLinie(Z('Die Figur ist achsensymmetrisch.', 'Zeichne ihre Symmetrieachse ein.'), GT(x.b, x.h, { zellen: x.alle }), 'gerade', { art: 'gerade', a: [0, x.ax], b: [1, x.ax] }, [[0, x.ax], [x.b, x.ax]], [[{ art: 'gerade', a: [0, x.ax - 1], b: [1, x.ax - 1] }, 'spiegel-abstand'], [{ art: 'gerade', a: [0, x.ax + 1], b: [1, x.ax + 1] }, 'spiegel-abstand']],
        h3('Die Symmetrieachse muss nicht von oben nach unten laufen.', 'Über und unter der Achse liegen gleich viele Kästchen.', 'Tippe zwei Punkte auf der Linie in der Mitte an: einen links und einen rechts.'), { nachweis: [{ art: 'achseZeichnen', figur: 'zellen' }] }); },
    () => { const f = einzeln('rechteck'), schraeg = wahl([true, true, false]), linie = schraeg ? [f.p, plus(f.p, [2, 1])] : achsenVon('rechteck', f.p)[0];
      return auswahl(Z(schraeg ? 'Die Linie g geht von Ecke zu Ecke.' : 'Die Linie g geht durch die Mitte der Figur.', 'Ist g eine Symmetrieachse der Figur F?'), [opt('Die Linie g ist eine Symmetrieachse.', !schraeg, schraeg ? 'diagonale-als-achse' : undefined), opt('Die Linie g ist keine Symmetrieachse.', schraeg)],
        h3('Falte die Figur in Gedanken an der Linie g.', 'Bei einer Symmetrieachse liegt jede Ecke genau auf einer anderen Ecke.', schraeg ? 'Beim Falten an g stehen zwei Ecken über den Rand hinaus.' : 'Beim Falten an g liegen die Ecken genau aufeinander.'), { bild: B.gitter(f.g({ linien: [LN('g', ...linie, 'gerade', 'achse')] })), nachweis: [{ art: 'istAchse', figur: 'F', linie: 'g', wert: !schraeg }] }); },
    () => { const k = wahl(['dreieck', 'trapez', 'drachen']), f = einzeln(k, 9, 7), [achse] = achsenVon(k, f.p), [w, hh] = masse(k), namen = mische(['a', 'b', 'c']);
      const quer = [[0, f.p[1] + Math.ceil(hh / 2)], [1, f.p[1] + Math.ceil(hh / 2)]], schraeg = [f.p, plus(f.p, [1, 1])];
      return auswahl(Z('Du siehst die Figur F und drei Linien.', 'Welche Linie ist die Symmetrieachse?'), ['a', 'b', 'c'].map((n) => opt(`Linie ${n}`, n === namen[0], n === namen[2] ? 'diagonale-als-achse' : undefined)),
        h3('An der Symmetrieachse kannst du die Figur falten.', 'Beide Hälften liegen dann genau aufeinander.', 'Prüfe bei jeder Linie: Sehen beide Seiten gleich aus?'), { bild: B.gitter(f.g({ linien: [LN(namen[0], ...achse, 'gerade', 'hilfs'), LN(namen[1], ...quer, 'gerade', 'hilfs'), LN(namen[2], ...schraeg, 'gerade', 'hilfs')] })), nachweis: [{ art: 'achsenwahl', figur: 'F' }, HILFSZAHL(w, 'Breite der Figur')] }); },
    () => { const k = kind(), f = einzeln('rechteck');
      return auswahl(Z(`${k} sagt: „Dieses Rechteck hat 4 Symmetrieachsen.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'diagonale-als-achse'), opt('Falsch. Es hat 2 Symmetrieachsen.', true), opt('Falsch. Es hat keine Symmetrieachse.', false)],
        h3('Prüfe auch die Linien von Ecke zu Ecke.', 'Beim Falten von Ecke zu Ecke liegen die Hälften nicht aufeinander.', 'Nur die beiden Linien durch die Mitten der Seiten sind Symmetrieachsen.'), { bild: B.gitter(f.g()), nachweis: [U(false), { art: 'achsen', figur: 'F', wert: 2 }] }); },
  ]);
  sechs(L_('A1'), 'M', [
    () => { const k = wahl(['quadrat', 'raute', 'drachen', 'lGleich', 'rauteD', 'drachenD']), f = einzeln(k, 9, 8), n = FORMEN[k].a;
      return zahl('Wie viele Symmetrieachsen hat die Figur F? Denke auch an schräge Achsen.', n, fehlerliste(n, [[n === 4 ? 2 : n + 1, 'diagonale-als-achse'], [n === 1 ? 0 : n - 1, 'lage-prototyp']]),
        h2('Eine Symmetrieachse kann auch schräg durch die Figur laufen.', 'Prüfe jede Linie durch die Mitte: Liegt jede Ecke nach dem Falten auf einer anderen Ecke?'), { bild: B.gitter(f.g()), nachweis: [{ art: 'achsen', figur: 'F', wert: n }] }); },
    () => achseZeichnen('Die Figur F hat genau eine Symmetrieachse. Sie verläuft schräg. Zeichne sie ein.', wahl(['drachenD', 'lGleich', 'dreieckD']), 9, 8,
      h2('Suche eine Ecke, die beim Falten auf sich selbst liegen bleibt.', 'Die Achse läuft von Ecke zu Ecke schräg durch die Kästchen.')),
    () => achseZeichnen('Die Figur F hat mehrere Symmetrieachsen. Zeichne eine davon ein.', wahl(['rechteck', 'raute']), 9, 8,
      h2('Eine Symmetrieachse geht immer durch die Mitte der Figur.', 'Probiere die Linie von oben nach unten durch die Mitte.')),
    () => { const k = wahl(['quadrat', 'rechteck']), f = einzeln(k, 10, 8, 2), [w, hh] = masse(k), m = plus(f.p, [w / 2, hh / 2]);
      const linien = k === 'quadrat' ? [[...achsenVon(k, f.p)[0], true], [...achsenVon(k, f.p)[2], true], [[f.p[0] + 1, 0], [f.p[0] + 1, 1], false], [m, plus(m, [2, 1]), false]] : [[...achsenVon(k, f.p)[0], true], [...achsenVon(k, f.p)[1], true], [f.p, plus(f.p, [2, 1]), false], [plus(f.p, [0, 2]), plus(f.p, [2, 1]), false]];
      const reihen = mische(linien).map((l, i) => ({ l, n: 'abcd'[i] }));
      return auswahl('Welche der Linien sind Symmetrieachsen der Figur F? Kreuze alle an.', reihen.map((x) => opt(`Linie ${x.n}`, x.l[2], x.l[2] ? undefined : 'diagonale-als-achse')),
        h2('Prüfe jede Linie einzeln durch Falten in Gedanken.', k === 'quadrat' ? 'Im Quadrat sind auch die Linien von Ecke zu Ecke Symmetrieachsen.' : 'Im Rechteck sind die Linien von Ecke zu Ecke keine Symmetrieachsen.'), { mehrfach: true, bild: B.gitter(f.g({ linien: reihen.map((x) => LN(x.n, x.l[0], x.l[1], 'gerade', 'hilfs')) })), nachweis: [{ art: 'achsenwahl', figur: 'F' }] }); },
    () => { const ks = mische([wahl(['rechteck', 'raute']), 'quadrat', wahl(['dreieck', 'drachen', 'trapez']), 'parallelogramm']);
      return auswahl('Welche Figur hat genau 2 Symmetrieachsen?', figurOptionen(ks, (f) => f.a === 2, (k) => (k === 'parallelogramm' ? 'diagonale-als-achse' : k === 'quadrat' ? 'sonderfall-uebersehen' : undefined)),
        h2('Bestimme für jede Figur die Anzahl der Symmetrieachsen.', 'Das Quadrat hat mehr als 2 Symmetrieachsen, das Parallelogramm hat keine.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: '2 Achsen' }] }); },
    () => { const k = kind(), f = einzeln('parallelogramm', 9, 6);
      return auswahl(`${k} sagt: „Die Linie g geht durch zwei Ecken des Parallelogramms F. Also ist sie eine Symmetrieachse.“ Stimmt das?`, [opt('Falsch. Beim Falten an g liegen die beiden anderen Ecken nicht aufeinander.', true), opt('Stimmt. Jede Linie durch zwei Ecken ist eine Symmetrieachse.', false, 'diagonale-als-achse'), opt('Stimmt. Die Linie teilt die Figur in zwei gleich große Teile.', false, 'diagonale-als-achse')],
        h2('Zwei gleich große Teile reichen nicht. Die Teile müssen beim Falten genau aufeinander liegen.', 'Spiegle eine der beiden anderen Ecken an g und prüfe, wo sie landet.'), { bild: B.gitter(f.g({ linien: [LN('g', f.ecken[0], f.ecken[2], 'gerade', 'achse')] })), nachweis: [U(false), { art: 'istAchse', figur: 'F', linie: 'g', wert: false }] }); },
  ]);
  sechs(L_('A1'), 'E', [
    () => { const k = wahl(['kreuz', 'pfeil', 'sForm', 'tForm', 'lForm', 'rauteD', 'quadrat']), f = einzeln(k, 9, 8), n = FORMEN[k].a;
      return zahl('Wie viele Symmetrieachsen hat die Figur F?', n, fehlerliste(n, [[n + 1, 'diagonale-als-achse'], [n === 4 ? 2 : n + 2, 'diagonale-als-achse']]), h1('Prüfe der Reihe nach vier Richtungen: von oben nach unten, von links nach rechts und die beiden schrägen Richtungen.'), { bild: B.gitter(f.g()), nachweis: [{ art: 'achsen', figur: 'F', wert: n }] }); },
    () => { const ks = suche(() => mische([...mische(['drachen', 'trapez', 'haus', 'pfeil', 'dreieck']).slice(0, wahl([1, 2])), ...mische(['rechteck', 'parallelogramm', 'sForm', 'lForm', 'raute'])]).slice(0, 4), (x) => x.some((k) => FORMEN[k].a === 1) && x.some((k) => FORMEN[k].a !== 1));
      return auswahl('Welche Figuren haben genau eine Symmetrieachse? Kreuze alle an.', figurOptionen(ks, (f) => f.a === 1, (k) => (FORMEN[k].a === 0 ? 'diagonale-als-achse' : 'sonderfall-uebersehen')), h1('Bestimme für jede Figur alle Symmetrieachsen, bevor du ankreuzt.'), { mehrfach: true, bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: '1 Achse' }] }); },
    () => { const k = wahl(['quadrat', 'rechteck', 'raute', 'drachen']), p = [zz(1, 5), zz(1, 4)], e = setze(k, p), n = FORMEN[k].a;
      return zahl(`Ein Viereck hat die Ecken A${P(e[0])}, B${P(e[1])}, C${P(e[2])} und D${P(e[3])}. Wie viele Symmetrieachsen hat es?`, n, fehlerliste(n, [[n === 4 ? 2 : 4, 'diagonale-als-achse'], [n === 1 ? 2 : 0, 'diagonale-als-achse']]),
        h1('Zeichne das Viereck in dein Heft und prüfe auch die Linien von Ecke zu Ecke.'), { bild: B.gitter(GT(10, 9, { achsen: true, figuren: [FG('F', e)], punkte: e.map((q, i) => PT('ABCD'[i], ...q, ['lu', 'ru', 'ro', 'lo'][i])) })), nachweis: [{ art: 'achsen', figur: 'F', wert: n }] }); },
    () => achseZeichnen('Die Figur F hat zwei Symmetrieachsen. Beide verlaufen schräg. Zeichne eine davon ein.', 'rauteD', 9, 8, h1('Die beiden Achsen laufen durch gegenüberliegende Ecken.')),
    () => auswahl('Eine Figur hat genau 3 Symmetrieachsen. Welche Figur kann das sein?', [opt('Ein Dreieck mit drei gleich langen Seiten.', true), opt('Ein Quadrat.', false, 'diagonale-als-achse'), opt('Ein Rechteck, das kein Quadrat ist.', false), opt('Ein Dreieck mit zwei gleich langen Seiten.', false)],
      h1('Überlege für jede Figur, durch welche Ecken und Seitenmitten eine Symmetrieachse laufen kann.'), { nachweis: [HILFSZAHL(3, 'Ein gleichseitiges Dreieck hat durch jede Ecke eine Symmetrieachse.')] }),
    () => { const ks = mische(['quadrat', 'rechteck']), g = nebeneinander(ks);
      return zahl('Im Bild siehst du ein Quadrat und ein Rechteck. Wie viele Symmetrieachsen hat das Quadrat mehr als das Rechteck?', 2, fehlerliste(2, [[0, 'diagonale-als-achse'], [4, 'sach-schritt-vergessen']]), h1('Bestimme für beide Figuren alle Symmetrieachsen. Achte auf die Linien von Ecke zu Ecke.'),
        { bild: B.gitter(g), nachweis: [{ art: 'achsen', figur: 'AB'[ks.indexOf('quadrat')], wert: 4 }, { art: 'achsen', figur: 'AB'[ks.indexOf('rechteck')], wert: 2 }, ...N('4 − 2')] }); },
  ]);

  // =====================================================================
  // A2 An einer Achse spiegeln und Figuren achsensymmetrisch ergänzen
  // =====================================================================
  const ergaenze = (text, opts, hilfen) => { const x = halbfigur(opts);
    return gitterZellen(text, GT(x.b, x.h, { zellen: x.zellen, linien: [x.achse] }), x.bild, [[x.verschoben, 'spiegel-verschoben'], [x.nah, 'spiegel-abstand']], hilfen, { nachweis: [{ art: 'spiegeln', an: 'achse' }] }); };
  const spiegelPunkte = (text, art, n, b, h, hilfen, { koord = false, verbinden = n > 2, min = 1 } = {}) => { const lage = achsenlage(art, b, h), ps = urbilder(lage, n, b, h, min), bilder = ps.map(lage.f);
    const schub = minus(lage.f(ps[0]), ps[0]), verschoben = ps.map((p) => plus(p, schub));
    return gitterPunkte(text(ps), GT(b, h, { ...(koord ? { achsen: true } : {}), linien: [lage.achse], ...(n > 2 ? { figuren: [FG(null, ps)] } : n === 2 ? { linien: [lage.achse, LN(null, ps[0], ps[1], 'strecke')] } : {}), punkte: ps.map((p, i) => PT(n === 1 ? 'P' : 'ABCDE'[i], ...p)) }), bilder,
      [[verschoben.every((p) => drin(b, h, p)) ? verschoben : [], 'spiegel-verschoben']], hilfen, { ...(verbinden ? { verbinden: true } : {}), nachweis: [{ art: 'spiegeln', an: 'achse', von: ps }] }); };
  const bildpunktWahl = (text, art, b, h, hilfen) => { const lage = achsenlage(art, b, h), [p] = urbilder(lage, 1, b, h, 2), bild = lage.f(p), d = art === 'senkrecht' ? [1, 0] : [0, 1], s = Math.sign(lage.seite(bild));
    const nah = plus(bild, d, -s), schief = plus(bild, art === 'senkrecht' ? [0, wahl([-2, 2])] : [wahl([-2, 2]), 0]);
    if (!drin(b, h, nah, schief) || lage.seite(nah) === 0) return null;
    const namen = mische(['A', 'B', 'C']), pts = [[bild, undefined], [nah, 'spiegel-abstand'], [schief, 'spiegel-verschoben']].map(([q, fv], i) => ({ q, fv, n: namen[i] })).sort((x, y) => x.n.localeCompare(y.n));
    return auswahl(text, pts.map((x) => opt(`Punkt ${x.n}`, x.q === bild, x.fv)), hilfen, { bild: B.gitter(GT(b, h, { linien: [lage.achse], punkte: [PT('P', ...p, 'lo'), ...pts.map((x) => PT(x.n, ...x.q))] })), nachweis: [{ art: 'spiegeln', an: 'achse', von: [p], bild }] }); };
  const spiegelKoord = (text, art, b, h, hilfen) => { const lage = achsenlage(art, b, h), [p] = suche(() => urbilder(lage, 1, b, h), ([q]) => { const z = lage.f(q); return z[0] !== z[1] && q[0] !== q[1] && q[0] >= 1 && q[1] >= 1; }), bild = lage.f(p);
    return luecken(text(p), { x: [bild[0], fehlerliste(bild[0], [[bild[1], 'koord-vertauscht'], [p[0], 'spiegel-verschoben']])], y: [bild[1], fehlerliste(bild[1], [[bild[0], 'koord-vertauscht'], [p[1], 'spiegel-verschoben']])] }, hilfen,
      { bild: B.gitter(GT(b, h, { achsen: true, linien: [lage.achse], punkte: [PT('P', ...p)] })), nachweis: [{ art: 'spiegeln', an: 'achse', von: [p], bild, luecken: ['x', 'y'] }] }); };
  sechs(L_('A2'), 'F', [
    () => ergaenze(Z('Die Figur soll symmetrisch werden.', 'Färbe die fehlenden Kästchen auf der anderen Seite der Achse.'), { reihen: 3, breit: 2 },
      h3('Die rote Linie ist die Symmetrieachse.', 'Jedes Kästchen bekommt ein Spiegelbild auf der anderen Seite.', 'Arbeite Reihe für Reihe: gleich viele Kästchen links und rechts.')),
    () => ergaenze(Z('Die Symmetrieachse läuft von links nach rechts.', 'Färbe die fehlenden Kästchen auf der anderen Seite der Achse.'), { senkrecht: false, reihen: 3, breit: 2 },
      h3('Hier spiegelst du nach oben oder nach unten.', 'Jedes Kästchen bekommt ein Spiegelbild auf der anderen Seite.', 'Arbeite Spalte für Spalte: gleich viele Kästchen über und unter der Achse.')),
    () => { const d = zz(1, 2), ax = 4, y = zz(1, 3), rechts = wahl([false, true]), z = rechts ? [ax + d, y] : [ax - d - 1, y], bild = [2 * ax - z[0] - 1, y];
      return gitterZellen(Z('Ein Kästchen ist gefärbt.', 'Färbe sein Spiegelbild auf der anderen Seite der Achse.'), GT(8, 5, { zellen: [z], linien: [ACHSE([ax, 0], [ax, 1])] }), [bild], [[[[rechts ? ax - 1 : ax, y]], 'spiegel-abstand'], [[[bild[0] + (rechts ? -1 : 1), y]], 'spiegel-abstand']],
        h3('Das Spiegelbild ist genauso weit von der Achse entfernt.', 'Liegt ein Kästchen 2 Kästchen links von der Achse, liegt sein Spiegelbild 2 Kästchen rechts davon.', 'Zähle die freien Kästchen zwischen dem gefärbten Kästchen und der Achse.'), { nachweis: [{ art: 'spiegeln', an: 'achse' }] }); },
    () => spiegelPunkte(() => Z('Spiegle den Punkt P an der Achse.', 'Markiere sein Spiegelbild.'), 'senkrecht', 1, 10, 5,
      h3('Das Spiegelbild liegt auf der anderen Seite der Achse.', 'Es ist genauso weit von der Achse entfernt wie der Punkt P.', 'Zähle die Kästchen von P bis zur Achse. Geh genauso weit auf der anderen Seite weiter.')),
    () => bildpunktWahl(Z('Der Punkt P wird an der Achse gespiegelt.', 'Welcher Punkt ist sein Spiegelbild?'), 'senkrecht', 12, 6,
      h3('Punkt und Spiegelbild liegen gleich weit von der Achse entfernt.', 'Beide liegen auf derselben Höhe.', 'Zähle die Kästchen von P bis zur Achse.')),
    () => ergaenze(Z('Die Figur berührt die Achse nicht.', 'Färbe ihr Spiegelbild auf der anderen Seite der Achse.'), { reihen: 3, breit: 2, luecke: 1, rechts: wahl([false, true]) },
      h3('Auch der Abstand zur Achse wird gespiegelt.', 'Zwischen der Figur und der Achse ist 1 Kästchen frei. Beim Spiegelbild ist es genauso.', 'Beginne mit dem Kästchen, das der Achse am nächsten liegt.')),
  ]);
  sechs(L_('A2'), 'G', [
    () => ergaenze(Z('Die Figur soll achsensymmetrisch werden.', 'Färbe die fehlenden Kästchen.'), { reihen: 4, breit: 3, rechts: wahl([false, true]) },
      h3('Jedes Kästchen bekommt ein Spiegelbild auf der anderen Seite der Achse.', 'Das Spiegelbild liegt in derselben Reihe und ist gleich weit von der Achse entfernt.', 'Arbeite Reihe für Reihe von der Achse nach außen.')),
    () => ergaenze(Z('Die Figur berührt die Achse nicht.', 'Färbe ihr Spiegelbild.'), { senkrecht: false, reihen: 4, breit: 2, luecke: zz(1, 2) },
      h3('Auch der Abstand zur Achse wird gespiegelt.', 'Jedes Kästchen ist nach dem Spiegeln genauso weit von der Achse entfernt wie vorher.', 'Beginne mit den Kästchen, die der Achse am nächsten liegen.')),
    () => spiegelKoord((p) => Z(`Der Punkt P${P(p)} wird an der Achse gespiegelt.`, 'Der Bildpunkt hat die Koordinaten ({{x}}|{{y}}).'), 'senkrecht', 10, 8,
      h3('Der Bildpunkt liegt auf derselben Höhe wie P.', 'Nur die x-Koordinate ändert sich.', 'Zähle die Kästchen von P bis zur Achse und geh genauso weit weiter.')),
    () => spiegelPunkte(() => Z('Spiegle die Strecke AB an der Achse.', 'Markiere die Bildpunkte von A und von B.'), wahl(['senkrecht', 'waagerecht']), 2, 10, 8,
      h3('Spiegle jeden Endpunkt einzeln.', 'Ein Bildpunkt ist genauso weit von der Achse entfernt wie sein Punkt.', 'Beginne mit A: Zähle die Kästchen bis zur Achse.'), { verbinden: true }),
    () => bildpunktWahl(Z('Die Achse läuft von links nach rechts.', 'Welcher Punkt ist der Bildpunkt von P?'), 'waagerecht', 10, 10,
      h3('Punkt und Bildpunkt liegen genau übereinander.', 'Beide sind gleich weit von der Achse entfernt.', 'Zähle die Kästchen von P bis zur Achse.')),
    () => ergaenze(Z('Die Figur soll achsensymmetrisch werden.', 'Färbe die fehlenden Kästchen.', 'Achte auf jede Reihe.'), { reihen: 5, breit: 3, rechts: wahl([false, true]) },
      h3('Zähle in jeder Reihe die gefärbten Kästchen.', 'Auf der anderen Seite der Achse sind es in dieser Reihe genauso viele.', 'Arbeite Reihe für Reihe von der Achse nach außen.')),
  ]);
  sechs(L_('A2'), 'M', [
    () => spiegelPunkte(() => 'Spiegle das Dreieck ABC an der Achse. Setze die drei Bildpunkte.', wahl(['senkrecht', 'waagerecht']), 3, 12, 8,
      h2('Spiegle jede Ecke einzeln: senkrecht zur Achse und gleich weit auf die andere Seite.', 'Verbinde die Bildpunkte in Gedanken. Das Bilddreieck sieht aus wie das Dreieck in einem Spiegel.')),
    () => { const ax = 6, y0 = zz(0, 2), x = suche(() => [[ax, y0], [ax - zz(1, 4), y0 + zz(1, 2)], [ax - zz(1, 5), y0 + zz(3, 4)], [ax, y0 + zz(5, 6)]], (q) => q[1][0] !== q[2][0] && q[3][1] <= 8 && kreuzP(minus(q[2], q[1]), minus(q[3], q[2])) !== 0 && kreuzP(minus(q[1], q[0]), minus(q[2], q[1])) !== 0);
      return gitterPunkte('Die Figur soll achsensymmetrisch werden. Die linke Hälfte ist gezeichnet. Setze die fehlenden Eckpunkte der rechten Hälfte.', GT(12, 8, { linien: [ACHSE([ax, 0], [ax, 1]), LN(null, x[0], x[1], 'strecke'), LN(null, x[1], x[2], 'strecke'), LN(null, x[2], x[3], 'strecke')] }), [spiegleX(x[1], ax), spiegleX(x[2], ax)], [[[spiegleX(x[1], ax)], 'sach-schritt-vergessen']],
        h2('Die Punkte auf der Achse bleiben, wo sie sind.', 'Spiegle die beiden Ecken, die nicht auf der Achse liegen.'), { verbinden: false, nachweis: [{ art: 'spiegeln', an: 'achse', von: x }] }); },
    () => spiegelPunkte(() => 'Die Achse verläuft schräg. Spiegle den Punkt P an der Achse.', wahl(['steigt', 'faellt']), 1, 9, 9,
      h2('Die Verbindung von Punkt und Bildpunkt ist senkrecht zur Achse.', 'Gehe von P aus schräg von Ecke zu Ecke bis zur Achse und genauso weit weiter.'), { min: 2 }),
    () => spiegelPunkte(() => 'Die Achse verläuft schräg. Spiegle das Dreieck ABC an der Achse.', wahl(['steigt', 'faellt']), 3, 10, 10,
      h2('Spiegle jede Ecke einzeln. Der Weg zur Achse ist senkrecht zur Achse.', 'Bei einer Achse von links unten nach rechts oben tauschen die Schritte nach rechts und nach oben ihre Rollen.')),
    () => spiegelKoord((p) => `Der Punkt P${P(p)} wird an der eingezeichneten Achse gespiegelt. Der Bildpunkt P′ hat die Koordinaten ({{x}}|{{y}}).`, wahl(['senkrecht', 'waagerecht']), 14, 12,
      h2('Bestimme den Abstand von P zur Achse.', 'Der Bildpunkt hat auf der anderen Seite denselben Abstand. Eine der beiden Koordinaten bleibt gleich.')),
    () => { const lage = achsenlage('waagerecht', 12, 10), x = suche(() => { const a = [zz(1, 4), lage.ay], rest = [[zz(5, 7), lage.ay + zz(1, 2)], [zz(8, 11), lage.ay + zz(2, 4)], [zz(2, 5), lage.ay + zz(3, 4)]]; return [a, ...rest]; }, (q) => { const k = [0, 1, 2, 3].map((i) => kreuzP(minus(q[(i + 1) % 4], q[i]), minus(q[(i + 2) % 4], q[(i + 1) % 4]))); return k.every((z) => z > 0); });
      return gitterPunkte('Spiegle das Viereck ABCD an der Achse. Die Ecke A liegt auf der Achse. Setze die Bildpunkte der anderen Ecken.', GT(12, 10, { linien: [lage.achse], figuren: [FG(null, x)], punkte: x.map((p, i) => PT('ABCD'[i], ...p)) }), x.slice(1).map(lage.f), [[[...x.slice(1).map(lage.f), x[0]], 'sach-falsche-rechnung']],
        h2('Ein Punkt auf der Achse ist sein eigener Bildpunkt.', 'Spiegle B, C und D einzeln: senkrecht zur Achse und gleich weit auf die andere Seite.'), { nachweis: [{ art: 'spiegeln', an: 'achse', von: x }] }); },
  ]);
  sechs(L_('A2'), 'E', [
    () => { const lage = achsenlage(wahl(['steigt', 'faellt']), 10, 10), x = suche(() => urbilder(lage, 4, 10, 10), (q) => { const k = [0, 1, 2, 3].map((i) => kreuzP(minus(q[(i + 1) % 4], q[i]), minus(q[(i + 2) % 4], q[(i + 1) % 4]))); return k.every((z) => z > 0) || k.every((z) => z < 0); });
      return gitterPunkte('Spiegle das Viereck ABCD an der schrägen Achse. Setze die vier Bildpunkte.', GT(10, 10, { linien: [lage.achse], figuren: [FG(null, x)], punkte: x.map((p, i) => PT('ABCD'[i], ...p)) }), x.map(lage.f), [],
        h1('Spiegle Ecke für Ecke. Der Weg jeder Ecke zur Achse steht senkrecht auf der Achse.'), { verbinden: true, nachweis: [{ art: 'spiegeln', an: 'achse', von: x }] }); },
    () => { const xg = zz(3, 4), d = zz(2, 4), p = [zz(1, xg - 1), zz(1, 6)], p1 = spiegleX(p, xg), p2 = spiegleX(p1, xg + d);
      return gitterPunkte('Spiegle den Punkt P zuerst an der Geraden g. Spiegle den Bildpunkt danach an der Geraden h. Markiere nur den Endpunkt.', GT(14, 7, { linien: [LN('g', [xg, 0], [xg, 1]), LN('h', [xg + d, 0], [xg + d, 1])], punkte: [PT('P', ...p, 'lo')] }), [p2], [[[p1], 'sach-schritt-vergessen'], [[spiegleX(p, xg + d)], 'sach-schritt-vergessen']],
        h1('Markiere den ersten Bildpunkt in Gedanken und spiegle von dort aus weiter. Vergleiche am Ende den Weg von P zum Endpunkt mit dem Abstand der beiden Geraden.'), { nachweis: [{ art: 'doppelspiegelung', punkt: 'P', linien: ['g', 'h'] }] }); },
    () => { const art = wahl(['senkrecht', 'waagerecht', 'steigt', 'faellt']), lage = achsenlage(art, 10, 10), [p] = urbilder(lage, 1, 10, 10, 2), q = lage.f(p), a = lage.achse;
      return gitterLinie('Der Punkt Q ist das Spiegelbild des Punktes P. Die Symmetrieachse fehlt. Zeichne sie ein.', GT(10, 10, { punkte: [PT('P', ...p), PT('Q', ...q)] }), 'gerade', { art: 'gerade', a: a.a, b: a.b }, [a.a, a.b], [[{ art: 'gerade', a: p, b: q }, 'senkrecht-parallel-verwechselt']],
        h1('Die Achse geht durch die Mitte der Strecke PQ und steht senkrecht auf ihr.'), { nachweis: [{ art: 'mittelsenkrechte', von: 'P', nach: 'Q' }] }); },
    () => spiegelKoord((p) => `Die Symmetrieachse geht durch die Punkte (0|0) und (1|1). Der Punkt P${P(p)} wird an ihr gespiegelt. Der Bildpunkt P′ hat die Koordinaten ({{x}}|{{y}}).`, 'steigt', 10, 10,
      h1('Untersuche an einem einfachen Punkt, was diese Spiegelung mit den beiden Koordinaten macht.')),
    () => { const art = wahl(['senkrecht', 'waagerecht', 'steigt']), lage = achsenlage(art, 10, 10), ps = urbilder(lage, 2, 10, 10, 1), bilder = ps.map(lage.f);
      return gitterPunkte('Die Punkte P′ und Q′ sind Bildpunkte einer Spiegelung an der Achse. Die Punkte P und Q fehlen. Setze sie.', GT(10, 10, { linien: [lage.achse], punkte: [PT('P′', ...bilder[0]), PT('Q′', ...bilder[1])] }), ps, [],
        h1('Eine Spiegelung lässt sich umkehren: Spiegelt man einen Bildpunkt noch einmal an derselben Achse, erhält man den ursprünglichen Punkt.'), { nachweis: [{ art: 'spiegeln', an: 'achse', von: bilder }] }); },
    () => auswahl('Ein Punkt P liegt genau auf der Symmetrieachse. Wo liegt sein Bildpunkt P′?', [opt('P′ liegt an derselben Stelle wie P.', true), opt('P′ liegt gegenüber auf der anderen Seite der Achse.', false, 'spiegel-verschoben'), opt('Es gibt keinen Bildpunkt.', false), opt('Das hängt von der Richtung der Achse ab.', false)],
      h1('Überlege, wie groß der Abstand von P zur Achse ist und was das für den Bildpunkt bedeutet.')),
  ]);

  // =====================================================================
  // A3 Punktsymmetrie
  // =====================================================================
  const drehZellen = (zellen, c) => zellen.map((q) => [2 * c[0] - q[0] - 1, 2 * c[1] - q[1] - 1]);
  const amZentrum = (text, n, b, h, hilfen, { koord = false, verbinden = n > 2 } = {}) => { const c = [Math.floor(b / 2), Math.floor(h / 2)], lage = { f: (p) => spieglePunkt(p, c), seite: (p) => (p[0] - c[0]) * 100 + (p[1] - c[1]) + (p[0] === c[0] ? 0 : 0) };
    const ps = suche(() => Array.from({ length: n }, () => [zz(0, b), zz(0, h)]), (q) => { const alle = [...q, ...q.map(lage.f)]; return drin(b, h, ...alle) && new Set([...alle, c].map(String)).size === 2 * n + 1 && (n < 3 || kreuzP(minus(q[1], q[0]), minus(q[2], q[0])) !== 0) && (n < 2 || kreuzP(minus(q[0], c), minus(q[1], c)) !== 0)
      && q.every((p, i) => q.every((r, j) => i >= j || Math.max(Math.abs(p[0] - r[0]), Math.abs(p[1] - r[1])) >= 2)) && q.every((p) => Math.max(Math.abs(p[0] - c[0]), Math.abs(p[1] - c[1])) >= 2) && (n < 3 || q.every((p) => p[0] <= c[0])); });
    return { c, ps, bilder: ps.map(lage.f), g: GT(b, h, { ...(koord ? { achsen: true } : {}), zentrum: c, ...(n > 2 ? { figuren: [FG(null, ps)] } : n === 2 ? { linien: [LN(null, ps[0], ps[1], 'strecke')] } : {}), punkte: ps.map((p, i) => PT(n === 1 ? 'P' : 'ABCD'[i], ...p)) }) }; };
  const punktSpiegeln = (text, n, b, h, hilfen, extra = {}) => { const x = amZentrum(text, n, b, h, hilfen, extra);
    return gitterPunkte(text, x.g, x.bilder, [[x.ps.map((p) => spiegleX(p, x.c[0])), 'punkt-achsen-verwechselt'], [x.ps.map((p) => spiegleY(p, x.c[1])), 'punkt-achsen-verwechselt']], hilfen, { ...(n > 2 || extra.verbinden ? { verbinden: true } : {}), nachweis: [{ art: 'spiegeln', an: 'zentrum', von: x.ps }] }); };
  const drehFrage = (text, zellenOderForm, wert, hilfen) => auswahl(text, [opt('Sie sieht genauso aus wie vorher.', wert), opt('Sie sieht anders aus als vorher.', !wert, wert ? undefined : undefined)], hilfen, zellenOderForm);
  sechs(L_('A3'), 'F', [
    () => { const k = wahl(['S', 'Z', 'H', 'L', 'T', 'U']), wert = PUNKT_BUCHSTABE[k];
      return drehFrage(Z('Dreh die Figur in Gedanken halb herum.', 'Wie sieht sie danach aus?'), { bild: B.gitter(buchstabenBild(k)), nachweis: [{ art: 'punktsymmetrie', figur: 'zellen', wert }] }, wert,
        h3('Bei einer halben Drehung kommt oben nach unten und links nach rechts.', 'Dreh dein Heft einmal auf den Kopf. Das ist eine halbe Drehung.', 'Vergleiche die Ecke oben links mit der Ecke unten rechts.')); },
    () => { const ks = mische([wahl(['parallelogramm', 'rechteck', 'sForm']), wahl(['dreieck', 'haus']), wahl(['trapez', 'drachen', 'schief'])]);
      return auswahl(Z('Dreh jede Figur in Gedanken halb herum.', 'Welche Figur sieht danach genauso aus wie vorher?'), figurOptionen(ks, (f) => f.p, () => 'punkt-achsen-verwechselt'),
        h3('Bei einer halben Drehung steht die Figur auf dem Kopf.', 'Dreh dein Heft einmal auf den Kopf. Das ist eine halbe Drehung.', 'Eine Figur mit einer Spitze oben zeigt danach nach unten.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: 'punktsymmetrisch' }] }); },
    () => { const k = wahl(['I', 'X', 'S', 'E', 'A', 'F', 'C']), wert = PUNKT_BUCHSTABE[k];
      return drehFrage(Z(`Die Figur sieht aus wie der Buchstabe ${k}.`, 'Dreh sie in Gedanken halb herum.', 'Wie sieht sie danach aus?'), { bild: B.gitter(buchstabenBild(k)), nachweis: [{ art: 'punktsymmetrie', figur: 'zellen', wert }] }, wert,
        h3('Bei einer halben Drehung steht die Figur auf dem Kopf.', 'Schreib den Buchstaben auf und dreh das Blatt auf den Kopf.', 'Vergleiche die Ecke oben links mit der Ecke unten rechts.')); },
    () => { const k = wahl(['rechteck', 'parallelogramm', 'dreieck', 'trapez', 'haus']), f = einzeln(k), wert = FORMEN[k].p;
      return drehFrage(Z('Dreh die Figur F in Gedanken halb herum.', 'Wie sieht sie danach aus?'), { bild: B.gitter(f.g()), nachweis: [{ art: 'punktsymmetrie', figur: 'F', wert }] }, wert,
        h3('Bei einer halben Drehung kommt oben nach unten und links nach rechts.', 'Dreh dein Heft einmal auf den Kopf. Das ist eine halbe Drehung.', 'Schau auf die Ecken: Wo landet die Ecke oben links?')); },
    () => { const windrad = [[2, 3], [3, 3], [3, 4], [3, 2], [4, 2], [2, 2]], treppe = [[2, 2], [3, 2], [3, 3], [4, 3], [4, 4]], haken = [[2, 2], [3, 2], [4, 2], [4, 3], [4, 4]], zellen = wahl([treppe, haken, [[2, 2], [3, 2], [3, 3], [4, 3]], [[2, 2], [2, 3], [2, 4], [3, 4]]]), c = [(Math.min(...zellen.map((q) => q[0])) + Math.max(...zellen.map((q) => q[0])) + 1) / 2, (Math.min(...zellen.map((q) => q[1])) + Math.max(...zellen.map((q) => q[1])) + 1) / 2];
      const wert = String(drehZellen(zellen, c).map(String).sort()) === String(zellen.map(String).sort()); void windrad;
      return drehFrage(Z('Die Figur besteht aus Kästchen.', 'Dreh sie in Gedanken halb herum.', 'Wie sieht sie danach aus?'), { bild: B.gitter(GT(7, 7, { zellen })), nachweis: [{ art: 'punktsymmetrie', figur: 'zellen', wert }] }, wert,
        h3('Bei einer halben Drehung steht die Figur auf dem Kopf.', 'Dreh dein Heft einmal auf den Kopf. Das ist eine halbe Drehung.', 'Vergleiche das erste Kästchen unten links mit dem letzten oben rechts.')); },
    () => { const ks = mische([wahl(['parallelogramm', 'sForm']), 'rechteck', wahl(['dreieck', 'trapez', 'haus', 'drachen'])]);
      return auswahl(Z('Dreh jede Figur in Gedanken halb herum.', 'Welche Figur sieht danach anders aus als vorher?'), figurOptionen(ks, (f) => !f.p),
        h3('Bei einer halben Drehung steht die Figur auf dem Kopf.', 'Dreh dein Heft einmal auf den Kopf. Das ist eine halbe Drehung.', 'Eine Figur mit einer Spitze oben zeigt danach nach unten.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: 'nicht punktsymmetrisch' }] }); },
  ]);
  sechs(L_('A3'), 'G', [
    () => { const ks = mische([wahl(['parallelogramm', 'sForm', 'raute']), wahl(['dreieck', 'haus', 'drachen']), wahl(['trapez', 'schief', 'lForm'])]);
      return auswahl(Z('Schau dir die drei Figuren an.', 'Welche Figur ist punktsymmetrisch?'), figurOptionen(ks, (f) => f.p, (k) => (FORMEN[k].a ? 'punkt-achsen-verwechselt' : undefined)),
        h3('Eine punktsymmetrische Figur sieht nach einer halben Drehung genauso aus wie vorher.', 'Dreh dein Heft auf den Kopf und vergleiche.', 'Eine Symmetrieachse reicht dafür nicht aus.'), { bild: B.gitter(nebeneinander(ks)), nachweis: [{ art: 'figurenwahl', was: 'punktsymmetrisch' }] }); },
    () => { const k = wahl(['parallelogramm', 'parallelogramm', 'trapez', 'dreieck', 'raute']), f = einzeln(k), wert = FORMEN[k].p;
      return auswahl(Z('Schau dir die Figur F an.', 'Was stimmt?'), [opt('Die Figur ist punktsymmetrisch.', wert, wert ? undefined : 'punkt-achsen-verwechselt'), opt('Die Figur ist nicht punktsymmetrisch.', !wert, wert ? 'punkt-achsen-verwechselt' : undefined)],
        h3('Dreh die Figur in Gedanken halb herum.', 'Punktsymmetrisch heißt: Nach der halben Drehung sieht die Figur genauso aus.', 'Schau auf die Ecken: Wo landet die Ecke oben links?'), { bild: B.gitter(f.g()), nachweis: [{ art: 'punktsymmetrie', figur: 'F', wert }] }); },
    () => { const c = [4, 3], zellen = suche(() => mische([[1, 3], [2, 3], [3, 3], [1, 4], [2, 4], [3, 4], [3, 5], [2, 5]]).slice(0, zz(3, 4)), (q) => q.some(([x, y]) => x === 3 && y === 3) && q.every(([x, y]) => q.some(([u, v]) => Math.abs(x - u) + Math.abs(y - v) === 1)));
      return gitterZellen(Z('Die Figur soll punktsymmetrisch zum Punkt Z werden.', 'Färbe die fehlenden Kästchen.'), GT(8, 6, { zellen, zentrum: c }), drehZellen(zellen, c), [[zellen.map((q) => [2 * c[0] - q[0] - 1, q[1]]), 'punkt-achsen-verwechselt']],
        h3('Jedes Kästchen wandert bei der halben Drehung auf die andere Seite von Z.', 'Ein Kästchen links oben von Z landet rechts unten von Z.', 'Geh von einem Kästchen aus durch Z hindurch und genauso weit weiter.'), { nachweis: [{ art: 'spiegeln', an: 'zentrum' }] }); },
    () => { const x = amZentrum('', 1, 10, 8), p = x.ps[0], bild = x.bilder[0], quer = spiegleX(p, x.c[0]), hoch = spiegleY(p, x.c[1]);
      if (new Set([p, bild, quer, hoch].map(String)).size < 4) return null;
      const namen = mische(['A', 'B', 'C']), pts = [bild, quer, hoch].map((q, i) => ({ q, n: namen[i] })).sort((a, b) => a.n.localeCompare(b.n));
      return auswahl(Z('Der Punkt P wird halb um den Punkt Z gedreht.', 'Auf welchem Punkt landet er?'), pts.map((y) => opt(`Punkt ${y.n}`, y.q === bild, y.q === bild ? undefined : 'punkt-achsen-verwechselt')),
        h3('Der Bildpunkt liegt genau gegenüber von P, auf der anderen Seite von Z.', 'P, Z und der Bildpunkt liegen auf einer Geraden.', 'Geh von P aus durch Z hindurch und genauso weit weiter.'), { bild: B.gitter(GT(10, 8, { zentrum: x.c, punkte: [PT('P', ...p, 'lo'), ...pts.map((y) => PT(y.n, ...y.q))] })), nachweis: [{ art: 'spiegeln', an: 'zentrum', von: [p], bild }] }); },
    () => { const k = wahl(['S', 'Z', 'H', 'I', 'X', 'A', 'T', 'C']), wert = PUNKT_BUCHSTABE[k];
      return auswahl(Z(`Die Figur sieht aus wie der Buchstabe ${k}.`, 'Was stimmt?'), [opt('Die Figur ist punktsymmetrisch.', wert, wert ? undefined : 'punkt-achsen-verwechselt'), opt('Die Figur ist nicht punktsymmetrisch.', !wert, wert ? 'punkt-achsen-verwechselt' : undefined)],
        h3('Dreh die Figur in Gedanken halb herum.', 'Schreib den Buchstaben auf und dreh das Blatt auf den Kopf.', 'Vergleiche die Ecke oben links mit der Ecke unten rechts.'), { bild: B.gitter(buchstabenBild(k)), nachweis: [{ art: 'punktsymmetrie', figur: 'zellen', wert }] }); },
    () => { const k = kind(), f = einzeln('parallelogramm');
      return auswahl(Z(`${k} sagt: „Die Figur F hat keine Symmetrieachse.“`, `${k} meint: „Also ist sie auch nicht punktsymmetrisch.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'punkt-achsen-verwechselt'), opt('Falsch. Nach einer halben Drehung sieht die Figur genauso aus.', true), opt('Falsch. Die Figur hat zwei Symmetrieachsen.', false, 'diagonale-als-achse')],
        h3('Punktsymmetrie und Achsensymmetrie sind zwei verschiedene Dinge.', 'Eine Figur kann punktsymmetrisch sein, ohne eine Symmetrieachse zu haben.', 'Dreh die Figur in Gedanken halb herum und vergleiche.'), { bild: B.gitter(f.g()), nachweis: [U(false), { art: 'punktsymmetrie', figur: 'F', wert: true }, { art: 'achsen', figur: 'F', wert: 0 }] }); },
  ]);
  sechs(L_('A3'), 'M', [
    () => punktSpiegeln('Spiegle den Punkt P am Symmetriezentrum Z. Markiere den Bildpunkt.', 1, 12, 8,
      h2('Zeichne in Gedanken die Gerade von P durch Z.', 'Der Bildpunkt liegt auf dieser Geraden, auf der anderen Seite von Z und gleich weit entfernt.')),
    () => punktSpiegeln('Spiegle das Dreieck ABC am Symmetriezentrum Z. Setze die drei Bildpunkte.', 3, 12, 10,
      h2('Spiegle jede Ecke einzeln an Z.', 'Zähle die Schritte von einer Ecke bis Z nach rechts und nach oben. Gehe von Z aus dieselben Schritte weiter.')),
    () => { const x = suche(() => amZentrum('', 1, 14, 12), (q) => q.bilder[0][0] !== q.bilder[0][1] && q.ps[0][0] !== q.ps[0][1] && q.ps[0][0] >= 1 && q.ps[0][1] >= 1), p = x.ps[0], bild = x.bilder[0];
      return luecken(`Der Punkt P${P(p)} wird am Punkt Z${P(x.c)} gespiegelt. Der Bildpunkt P′ hat die Koordinaten ({{x}}|{{y}}).`, { x: [bild[0], fehlerliste(bild[0], [[bild[1], 'koord-vertauscht'], [p[0], 'punkt-achsen-verwechselt']])], y: [bild[1], fehlerliste(bild[1], [[bild[0], 'koord-vertauscht'], [p[1], 'punkt-achsen-verwechselt']])] },
        h2('Beim Spiegeln am Symmetriezentrum ändern sich beide Koordinaten.', 'Bestimme die Schritte von P nach Z und gehe von Z aus dieselben Schritte weiter.'), { bild: B.gitter(GT(14, 12, { achsen: true, zentrum: x.c, punkte: [PT('P', ...p)] })), nachweis: [{ art: 'spiegeln', an: 'zentrum', von: [p], bild, luecken: ['x', 'y'] }] }); },
    () => punktSpiegeln('Spiegle die Strecke AB am Symmetriezentrum Z. Setze die Bildpunkte von A und B.', 2, 12, 10,
      h2('Spiegle beide Endpunkte einzeln an Z.', 'Die Bildstrecke ist parallel zur Strecke AB und gleich lang.'), { verbinden: true }),
    () => { const k = wahl(['rechteck', 'raute', 'parallelogrammGross']), e = k === 'parallelogrammGross' ? [[0, 0], [4, 0], [6, 2], [2, 2]] : FORMEN[k].e, p = [zz(1, 4), zz(1, 3)], ecken = e.map((q) => plus(q, p)), c = [(ecken[0][0] + ecken[2][0]) / 2, (ecken[0][1] + ecken[2][1]) / 2];
      return gitterPunkte('Die Figur F ist punktsymmetrisch. Markiere ihr Symmetriezentrum.', GT(12, 8, { figuren: [FG('F', ecken)] }), [c], [[[ecken[0]], 'punkt-achsen-verwechselt']],
        h2('Das Symmetriezentrum liegt genau in der Mitte der Figur.', 'Verbinde in Gedanken gegenüberliegende Ecken. Die beiden Linien schneiden sich im Symmetriezentrum.'), { nachweis: [{ art: 'zentrum', figur: 'F' }] }); },
    () => { const x = suche(() => { const p = [zz(1, 8), zz(1, 6)], d = wahl([[1, 2], [2, 1], [3, 1], [2, 2], [1, 3], [3, 2], [2, -1], [3, -1]]); return { p, m: plus(p, d), q: plus(p, d, 2) }; }, (z) => drin(12, 9, z.q));
      return gitterPunkte('Der Punkt P wird an einem Symmetriezentrum gespiegelt. Sein Bildpunkt ist Q. Markiere das Symmetriezentrum.', GT(12, 9, { punkte: [PT('P', ...x.p), PT('Q', ...x.q)] }), [x.m], [],
        h2('Punkt und Bildpunkt sind vom Symmetriezentrum gleich weit entfernt.', 'Das Symmetriezentrum ist der Mittelpunkt der Strecke PQ.'), { nachweis: [{ art: 'mitte', von: 'P', nach: 'Q' }] }); },
  ]);
  sechs(L_('A3'), 'E', [
    () => { const ks = suche(() => mische([...mische(['parallelogramm', 'sForm']).slice(0, wahl([1, 2])), ...mische(['rechteck', 'dreieck', 'drachen', 'raute', 'trapez', 'quadrat'])]).slice(0, 4), (x) => x.some((k) => FORMEN[k].p && !FORMEN[k].a) && x.some((k) => FORMEN[k].p && FORMEN[k].a) && x.some((k) => !FORMEN[k].p));
      const reihen = mische(ks);
      return auswahl('Welche Figuren sind punktsymmetrisch, aber nicht achsensymmetrisch? Kreuze alle an.', figurOptionen(reihen, (f) => f.p && f.a === 0, (k) => (FORMEN[k].p ? 'sonderfall-uebersehen' : 'punkt-achsen-verwechselt')), h1('Prüfe jede Figur zweimal: erst auf Symmetrieachsen, dann mit einer halben Drehung.'), { mehrfach: true, bild: B.gitter(nebeneinander(reihen)), nachweis: [{ art: 'figurenwahl', was: 'punktsymmetrisch und nicht achsensymmetrisch' }] }); },
    () => { const x = amZentrum('', 2, 12, 10);
      return gitterPunkte('Das Viereck ABCD soll punktsymmetrisch zum Punkt Z sein. Die Ecken A und B sind gegeben. Setze die Ecken C und D.', GT(12, 10, { zentrum: x.c, linien: [LN(null, x.ps[0], x.ps[1], 'strecke')], punkte: [PT('A', ...x.ps[0]), PT('B', ...x.ps[1])] }), x.bilder, [[x.ps.map((p) => spiegleX(p, x.c[0])), 'punkt-achsen-verwechselt']],
        h1('Die Ecke C ist der Bildpunkt von A, die Ecke D ist der Bildpunkt von B. Es entsteht ein Parallelogramm.'), { nachweis: [{ art: 'spiegeln', an: 'zentrum', von: x.ps }] }); },
    () => auswahl('Eine Figur hat genau zwei Symmetrieachsen. Die Achsen sind senkrecht zueinander. Was gilt dann?', [opt('Die Figur ist auch punktsymmetrisch. Das Symmetriezentrum ist der Schnittpunkt der Achsen.', true), opt('Die Figur ist nicht punktsymmetrisch.', false, 'punkt-achsen-verwechselt'), opt('Die Figur ist ein Quadrat.', false, 'sonderfall-uebersehen'), opt('Darüber lässt sich nichts sagen.', false)],
      h1('Spiegle einen Punkt nacheinander an beiden Achsen und vergleiche mit einer halben Drehung um den Schnittpunkt.')),
    () => { const k = wahl(['rechteck', 'raute', 'parallelogramm', 'drachen', 'quadrat']), p = [zz(1, 5), zz(1, 4)], e = setze(k, p), f = FORMEN[k];
      return auswahl(`Das Viereck hat die Ecken A${P(e[0])}, B${P(e[1])}, C${P(e[2])} und D${P(e[3])}. Welche Aussagen treffen zu? Kreuze alle an.`, [opt('Das Viereck ist achsensymmetrisch.', f.a > 0, f.a > 0 ? undefined : 'diagonale-als-achse'), opt('Das Viereck ist punktsymmetrisch.', f.p, f.p ? undefined : 'punkt-achsen-verwechselt'), opt('Das Viereck hat genau zwei Symmetrieachsen.', f.a === 2, f.a === 2 ? undefined : 'diagonale-als-achse'), opt('Das Viereck hat keine Symmetrieachse.', f.a === 0, f.a === 0 ? undefined : 'diagonale-als-achse')],
        h1('Prüfe Achsensymmetrie und Punktsymmetrie getrennt voneinander.'), { mehrfach: true, bild: B.gitter(GT(10, 9, { achsen: true, figuren: [FG('F', e)], punkte: e.map((q, i) => PT('ABCD'[i], ...q, ['lu', 'ru', 'ro', 'lo'][i])) })), nachweis: [{ art: 'achsen', figur: 'F', wert: f.a }, { art: 'punktsymmetrie', figur: 'F', wert: f.p }] }); },
    () => { const s = [zz(4, 6), zz(4, 5)], p = suche(() => [zz(1, 9), zz(1, 8)], (q) => Math.abs(q[0] - s[0]) >= 2 && Math.abs(q[1] - s[1]) >= 1 && drin(10, 9, spieglePunkt(q, s))), ziel = spieglePunkt(p, s);
      return gitterPunkte('Die Geraden g und h sind senkrecht zueinander. Spiegle den Punkt P zuerst an g und den Bildpunkt danach an h. Markiere nur den Endpunkt.', GT(10, 9, { linien: [LN('g', [s[0], 0], [s[0], 1]), LN('h', [0, s[1]], [1, s[1]])], punkte: [PT('P', ...p)] }), [ziel], [[[spiegleX(p, s[0])], 'sach-schritt-vergessen'], [[spiegleY(p, s[1])], 'sach-schritt-vergessen']],
        h1('Führe beide Spiegelungen nacheinander aus. Vergleiche danach die Lage des Endpunkts mit einer Punktspiegelung am Schnittpunkt der Geraden.'), { nachweis: [{ art: 'doppelspiegelung', punkt: 'P', linien: ['g', 'h'] }] }); },
    () => { const x = suche(() => { const p = [zz(1, 6), zz(1, 5)], d = [zz(1, 4), zz(1, 3)]; return { p, m: plus(p, d), q: plus(p, d, 2) }; }, (z) => drin(14, 12, z.q) && z.m[0] !== z.m[1]);
      return luecken(`Bei einer Punktspiegelung wird der Punkt P${P(x.p)} auf den Punkt Q${P(x.q)} abgebildet. Das Symmetriezentrum hat die Koordinaten ({{x}}|{{y}}).`, { x: [x.m[0], fehlerliste(x.m[0], [[x.m[1], 'koord-vertauscht'], [x.q[0] - x.p[0], 'sach-schritt-vergessen']])], y: [x.m[1], fehlerliste(x.m[1], [[x.m[0], 'koord-vertauscht'], [x.q[1] - x.p[1], 'sach-schritt-vergessen']])] },
        h1('Das Symmetriezentrum liegt genau in der Mitte zwischen einem Punkt und seinem Bildpunkt.'), { bild: B.gitter(GT(14, 12, { achsen: true, punkte: [PT('P', ...x.p), PT('Q', ...x.q)] })), nachweis: [{ art: 'mitte', von: 'P', nach: 'Q', x: x.m[0], y: x.m[1], luecken: ['x', 'y'] }] }); },
  ]);
}
