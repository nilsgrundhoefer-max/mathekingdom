// Aufgaben zu 5.5.1 „Strecke und Gerade“ (Lernziele B1 und B2) nach ADR 0015 und ADR 0032.
// B1 Strecke, Strahl und Gerade unterscheiden, B2 Strecken messen und zeichnen.
// Längen ohne Kommazahlen: am Lineal in cm und mm, am Karogitter in Kästchen (2 Kästchen sind 1 cm).
import { sechs, zahl, auswahl, opt, luecken, zuordnen, gitterPunkte, gitterLinie, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind, zweiKinder } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, plus, drin, WAAGERECHT, LOTRECHT, DIAGONAL, SCHRAEG, cmmm } from './5-5-geo.mjs';

const L_ = (kurz) => `5.5.1-${kurz}`;
const KAESTCHEN = HILFSZAHL(1, '2 Kästchen sind 1 cm');
const ARTWORT = { strecke: 'Strecke', strahl: 'Strahl', gerade: 'Gerade' };
// Linien für „Welche Linie ist …?“: untereinander, jede mit einem Namen a, b, c, in gemischter Reihenfolge der Arten.
function linienBild(arten, schraeg = false) {
  const b = 12, h = arten.length * 2 + 1, reihen = mische(arten);
  const linien = reihen.map((art, i) => { const y = h - 1 - i * 2, x = zz(1, 3), n = zz(5, 7), dy = schraeg ? wahl([-1, 0, 1]) : 0; return LN('abcd'[i], [x, y], [x + n, Math.max(0, Math.min(h, y + dy))], art); });
  return { g: GT(b, h, { linien }), namen: Object.fromEntries(linien.map((l) => [l.art, l.n])), linien };
}
const welche = (was, arten, text, hilfen, schraeg) => {
  const { g, linien } = linienBild(arten, schraeg);
  return auswahl(text, linien.map((l) => opt(`Linie ${l.n}`, l.art === was, l.art === was ? undefined : 'gerade-begrenzt')), hilfen, { bild: B.gitter(g), nachweis: [{ art: 'linienart', was }] });
};
// Zwei Punkte A und B auf einem Gitter, nebeneinander oder schräg.
function zweiPunkte(b = 10, h = 6, richtungen = [WAAGERECHT, LOTRECHT]) {
  const v = wahl(richtungen), n = zz(3, 6);
  const a = suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => drin(b - 1, h - 1, plus(p, v, n)) && plus(p, v, n).every((x) => x >= 1));
  return { a, b: plus(a, v, n), g: GT(b, h, { punkte: [PT('A', ...a, 'lo'), PT('B', ...plus(a, v, n), 'ro')] }) };
}
// Lineal von `von` bis `bis` mm. cm und mm der Länge sind verschieden, damit zwei Lücken nie dieselbe Lösung haben.
const laengeMm = (min, max, ganz = false) => suche(() => zz(min, max), (x) => (ganz ? x % 10 === 0 : x % 10 !== 0 && Math.floor(x / 10) !== x % 10));

export function streckeUndGerade() {
  // =====================================================================
  // B1 Strecke, Strahl und Gerade unterscheiden und benennen
  // =====================================================================
  sechs(L_('B1'), 'F', [
    () => welche('strecke', ['strecke', 'gerade'], Z('Schau dir die Linien an.', 'Welche Linie ist eine Strecke?'),
      h3('Eine Strecke hat einen Anfang und ein Ende.', 'Die Kante deines Tisches ist eine Strecke. Sie hat zwei Enden.', 'Suche die Linie mit zwei kleinen Strichen an den Enden.')),
    () => welche('gerade', ['strecke', 'gerade', 'strecke'], Z('Schau dir die Linien an.', 'Welche Linie ist eine Gerade?'),
      h3('Eine Gerade hat keinen Anfang und kein Ende.', 'Im Bild geht eine Gerade bis zum Rand und noch weiter.', 'Suche die Linie ohne Striche an den Enden.')),
    () => { const { g, linien } = linienBild(wahl([['strecke', 'strecke', 'gerade'], ['strecke', 'gerade', 'gerade', 'strecke'], ['strecke', 'strecke', 'strecke', 'gerade']])), n = linien.filter((l) => l.art === 'strecke').length;
      return zahl(Z('Schau dir die Linien an.', 'Wie viele Strecken siehst du?'), n, fehlerliste(n, [[linien.length, 'gerade-begrenzt'], [linien.length - n, 'gerade-begrenzt']]),
        h3('Eine Strecke hat zwei Enden. Zähle nur diese Linien.', 'Eine Linie bis zum Rand ohne Endstriche ist eine Gerade. Sie zählt nicht mit.', 'Geh die Linien der Reihe nach durch: Hat die Linie zwei Enden?'),
        { bild: B.gitter(g), nachweis: [{ art: 'linienzahl', was: 'strecke', wert: n }] }); },
    () => { const art = wahl(['strecke', 'gerade']), p = zweiPunkte(), g = GT(p.g.b, p.g.h, { punkte: p.g.punkte, linien: [LN('a', p.a, p.b, art)] });
      return auswahl(Z('Die Linie a geht durch A und B.', 'Was stimmt?'), [
        opt('Die Linie a ist eine Strecke. Sie hat einen Anfang und ein Ende.', art === 'strecke', art === 'strecke' ? undefined : 'gerade-begrenzt'),
        opt('Die Linie a ist eine Gerade. Sie hat kein Ende.', art === 'gerade', art === 'gerade' ? undefined : 'gerade-begrenzt')],
      h3('Schau auf die Enden der Linie.', 'Hört eine Linie bei zwei Punkten auf, dann ist sie eine Strecke.', art === 'strecke' ? 'Die Linie hört bei A und bei B auf.' : 'Die Linie geht über A und B hinaus bis zum Rand.'),
      { bild: B.gitter(g), nachweis: [{ art: 'linienart', linie: 'a', was: art }] }); },
    () => { const p = zweiPunkte();
      return gitterLinie(Z('Zeichne die Strecke von A nach B.'), p.g, 'strecke', { art: 'strecke', a: p.a, b: p.b }, [p.a, p.b], [],
        h3('Eine Strecke verbindet zwei Punkte auf dem kürzesten Weg.', 'Tippe erst auf den einen Punkt und dann auf den anderen.', 'Tippe auf A und danach auf B.')); },
    () => welche('strecke', ['gerade', 'strecke'], Z('Du willst eine Linie mit dem Lineal messen.', 'Bei welcher Linie geht das?'),
      h3('Messen kannst du nur eine Linie mit zwei Enden.', 'Eine Gerade hört nie auf. Darum hat sie keine Länge.', 'Suche die Strecke. Sie hat zwei Enden.')),
  ]);
  sechs(L_('B1'), 'G', [
    () => welche('strahl', ['strecke', 'strahl', 'gerade'], Z('Schau dir die Linien an.', 'Welche Linie ist ein Strahl?'),
      h3('Ein Strahl hat einen Anfangspunkt. Auf der anderen Seite hört er nicht auf.', 'Das Licht einer Taschenlampe ist wie ein Strahl: Es beginnt an der Lampe.', 'Suche die Linie mit genau einem Endstrich.'), true),
    () => { const { g, linien } = linienBild(['strecke', 'strahl', 'gerade'], true);
      return zuordnen(Z('Ordne jeder Linie den richtigen Namen zu.'), linien.map((l) => [`Linie ${l.n}`, ARTWORT[l.art]]),
        h3('Zähle die Endpunkte: zwei, einer oder keiner.', 'Zwei Endpunkte: Strecke. Ein Endpunkt: Strahl. Kein Endpunkt: Gerade.', 'Beginne mit der Linie, die zwei Endpunkte hat. Das ist die Strecke.'), { bild: B.gitter(g), nachweis: [{ art: 'linienart' }] }); },
    () => { const pts = suche(() => [[zz(1, 3), zz(1, 2)], [zz(6, 9), zz(1, 3)], [zz(3, 7), zz(4, 5)]], ([a, b, c]) => (b[0] - a[0]) * (c[1] - a[1]) !== (b[1] - a[1]) * (c[0] - a[0]));
      return zahl(Z('Du siehst die Punkte A, B und C.', 'Verbinde immer zwei Punkte durch eine Strecke.', 'Wie viele Strecken entstehen?'), 3, fehlerliste(3, [[2, 'gerade-begrenzt'], [6, 'gerade-begrenzt']]),
        h3('Schreibe alle Paare von Punkten auf.', 'Bei den Punkten P und Q gibt es nur eine Strecke: PQ.', 'Die Strecken heißen AB, AC und BC.'),
        { bild: B.gitter(GT(10, 6, { punkte: pts.map((p, i) => PT('ABC'[i], ...p)) })), nachweis: [{ art: 'verbindungen', wert: 3 }] }); },
    () => { const art = wahl(['strecke', 'strahl', 'gerade']), p = zweiPunkte(10, 6, [WAAGERECHT, LOTRECHT, ...DIAGONAL]), g = GT(p.g.b, p.g.h, { punkte: p.g.punkte, linien: [LN('a', p.a, p.b, art)] });
      return auswahl(Z('Schau dir die Linie a an.', 'Wie heißt so eine Linie?'), Object.entries(ARTWORT).map(([k, w]) => opt(w, k === art, k === art ? undefined : 'gerade-begrenzt')),
        h3('Schau auf beide Enden der Linie.', 'Beginnt eine Linie in einem Punkt und geht dann immer weiter, ist sie ein Strahl.', { strecke: 'Die Linie hört bei A und bei B auf.', strahl: 'Die Linie beginnt in A und geht über B hinaus.', gerade: 'Die Linie geht über A und über B hinaus.' }[art]),
        { bild: B.gitter(g), nachweis: [{ art: 'linienart', linie: 'a', was: art }] }); },
    () => { const s = [zz(3, 7), zz(2, 4)], [u, v] = wahl([[[1, 1], [1, -1]], [[1, 0], [0, 1]], [[1, 0], [1, 1]], [[0, 1], [1, -1]]]);
      const g = GT(10, 6, { linien: [LN('g', plus(s, u, -2), plus(s, u, 2)), LN('h', plus(s, v, -2), plus(s, v, 2))] });
      return gitterPunkte(Z('Die Geraden g und h schneiden sich.', 'Markiere den Schnittpunkt.'), g, [s], [],
        h3('Der Schnittpunkt liegt auf beiden Geraden.', 'Zwei Straßen kreuzen sich an genau einer Stelle. Das ist ihr Schnittpunkt.', 'Folge g mit dem Finger bis zu der Stelle, an der h kreuzt.'), { nachweis: [{ art: 'schnittpunkt', linien: ['g', 'h'] }] }); },
    () => { const k = kind(), n = zz(5, 8), y = zz(2, 4), g = GT(10, 6, { linien: [LN('g', [1, y], [1 + n, y])] });
      return auswahl(Z(`${k} sagt: „Die Gerade g ist ${n} Kästchen lang.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'gerade-begrenzt'), opt('Falsch. Eine Gerade hat kein Ende. Sie hat keine Länge.', true), opt(`Falsch. Die Gerade ist ${n + 4} Kästchen lang.`, false, 'gerade-begrenzt')],
        h3('Überlege: Wo hört eine Gerade auf?', 'Nur eine Strecke kannst du messen. Sie hat zwei Endpunkte.', 'Das Bild zeigt nur ein Stück der Geraden. Sie geht auf beiden Seiten weiter.'), { bild: B.gitter(g), nachweis: [U(false), { art: 'linienart', linie: 'g', was: 'gerade' }] }); },
  ]);
  sechs(L_('B1'), 'M', [
    () => { const { g, linien } = linienBild(wahl([['strecke', 'strahl', 'gerade', 'strahl'], ['strahl', 'strecke', 'strecke', 'gerade'], ['strahl', 'strahl', 'gerade', 'strecke']]), true);
      return auswahl('Welche Linien sind Strahlen? Kreuze alle an.', linien.map((l) => opt(`Linie ${l.n}`, l.art === 'strahl', l.art === 'strahl' ? undefined : 'gerade-begrenzt')),
        h2('Ein Strahl hat genau einen Anfangspunkt und kein Ende.', 'Prüfe bei jeder Linie, wie viele Endstriche sie hat. Ein Strahl hat genau einen.'), { mehrfach: true, bild: B.gitter(g), nachweis: [{ art: 'linienart', was: 'strahl' }] }); },
    () => { const y = zz(2, 4), xs = suche(() => [zz(1, 3), zz(4, 6), zz(7, 9)], () => true), g = GT(10, 6, { linien: [LN('g', [0, y], [10, y])], punkte: xs.map((x, i) => PT('ABC'[i], x, y, 'o')) });
      return zahl('Auf der Geraden g liegen die Punkte A, B und C. Wie viele verschiedene Strecken legen diese drei Punkte fest?', 3, fehlerliste(3, [[2, 'gerade-begrenzt'], [1, 'gerade-begrenzt']]),
        h2('Auch zwei Punkte, die nicht nebeneinander liegen, begrenzen eine Strecke.', 'Die Strecken sind AB, BC und AC.'), { bild: B.gitter(g), nachweis: [{ art: 'verbindungen', wert: 3 }] }); },
    () => { const pts = wahl([[[1, 1], [8, 2], [7, 6], [2, 5]], [[2, 1], [9, 3], [6, 6], [1, 4]], [[1, 2], [6, 1], [9, 5], [3, 6]]]);
      return zahl('Durch je zwei der Punkte A, B, C und D wird eine Gerade gezeichnet. Wie viele Geraden entstehen?', 6, fehlerliste(6, [[4, 'gerade-begrenzt'], [8, 'gerade-begrenzt'], [12, 'gerade-begrenzt']]),
        h2('Zähle geordnet: erst alle Geraden durch A, dann die neuen durch B, dann die neue durch C.', 'Durch A gehen 3 Geraden, durch B kommen 2 neue dazu, durch C noch 1.'), { bild: B.gitter(GT(10, 7, { punkte: pts.map((p, i) => PT('ABCD'[i], ...p)) })), nachweis: [{ art: 'verbindungen', wert: 6 }] }); },
    () => { const s = [zz(3, 7), zz(2, 5)], [u, v] = wahl([[[2, 1], [1, -1]], [[1, 2], [1, -1]], [[2, 1], [1, -2]], [[1, 1], [2, -1]]]);
      const p1 = suche(() => zz(1, 2), (k) => drin(10, 7, plus(s, u, -k), plus(s, u, k))), p2 = suche(() => zz(1, 2), (k) => drin(10, 7, plus(s, v, -k), plus(s, v, k)));
      const g = GT(10, 7, { linien: [LN('g', plus(s, u, -p1), plus(s, u, p1)), LN('h', plus(s, v, -p2), plus(s, v, p2))] });
      return gitterPunkte('Markiere den Schnittpunkt der Geraden g und h.', g, [s], [],
        h2('Der Schnittpunkt ist der einzige Punkt, der auf beiden Geraden liegt.', 'Suche den Gitterpunkt, durch den beide Geraden gehen.'), { nachweis: [{ art: 'schnittpunkt', linien: ['g', 'h'] }] }); },
    () => { const v = wahl([[1, 0], [1, 1], [2, 1], [1, -1]]), a = suche(() => [zz(3, 5), zz(2, 5)], (p) => drin(11, 7, plus(p, v, -2), plus(p, v, 4))), b = plus(a, v, 1);
      const vorn = plus(a, v, zz(2, 4)), hinten = plus(a, v, -zz(1, 2)), neben = suche(() => [zz(1, 10), zz(1, 6)], (p) => (p[0] - a[0]) * v[1] !== (p[1] - a[1]) * v[0] && Math.abs(p[0] - vorn[0]) + Math.abs(p[1] - vorn[1]) > 1);
      const namen = mische(['C', 'D', 'E']), punkte = [[vorn, true], [hinten, false], [neben, false]].map(([p, r], i) => ({ p, r, n: namen[i] })).sort((x, y) => x.n.localeCompare(y.n));
      const g = GT(11, 7, { punkte: [PT('A', ...a, 'lo'), PT('B', ...b, 'lo'), ...punkte.map((x) => PT(x.n, ...x.p))] });
      return auswahl('Ein Strahl beginnt im Punkt A und geht durch den Punkt B. Welcher der Punkte liegt auf diesem Strahl?', punkte.map((x) => opt(`Punkt ${x.n}`, x.r, x.r ? undefined : 'gerade-begrenzt')),
        h2('Der Strahl beginnt in A und läuft nur in die Richtung von B weiter.', 'Verlängere die Linie von A über B hinaus. Hinter A liegt kein Punkt des Strahls.'), { bild: B.gitter(g), nachweis: [{ art: 'punktwahl', von: 'A', durch: 'B', linienart: 'strahl' }] }); },
    () => { const [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Jede Strecke ist ein Teil einer Geraden.“ ${k2} sagt: „Jede Gerade ist ein Teil einer Strecke.“ Wer hat recht?`, [opt(`Nur ${k1}.`, true), opt(`Nur ${k2}.`, false, 'gerade-begrenzt'), opt('Beide.', false, 'gerade-begrenzt'), opt('Keiner von beiden.', false)],
        h2('Überlege, welche der beiden Linien länger ist.', 'Verlängert man eine Strecke über beide Endpunkte hinaus, entsteht eine Gerade. Umgekehrt passt eine Gerade in keine Strecke.')); },
  ]);
  sechs(L_('B1'), 'E', [
    () => { const { g, linien } = linienBild(['strecke', 'strahl', 'gerade', 'strahl'], true), was = wahl(['strecke', 'gerade']);
      return auswahl(`Welche Linie ist eine ${ARTWORT[was]}?`, linien.map((l) => opt(`Linie ${l.n}`, l.art === was, l.art === was ? undefined : 'gerade-begrenzt')), h1('Zähle bei jeder Linie die Endpunkte.'), { bild: B.gitter(g), nachweis: [{ art: 'linienart', was }] }); },
    () => { const n = wahl([5, 6]), w = n * (n - 1) / 2;
      return zahl(`Auf einem Blatt liegen ${n} Punkte. Keine drei davon liegen auf einer gemeinsamen Geraden. Wie viele Strecken kann man zwischen je zwei Punkten zeichnen?`, w, fehlerliste(w, [[n, 'gerade-begrenzt'], [n * (n - 1), 'gerade-begrenzt'], [2 * n, 'gerade-begrenzt']]),
        h1('Zähle geordnet: Von jedem Punkt gehen Strecken zu allen anderen. So wird aber jede Strecke doppelt gezählt.'), { nachweis: [{ art: 'verbindungen', n, wert: w }] }); },
    () => { const v = wahl([[2, 1], [1, 2], [1, 1], [3, 1]]), a = suche(() => [zz(3, 6), zz(2, 5)], (p) => drin(12, 8, plus(p, v, -2), plus(p, v, 3))), b = plus(a, v, 1);
      const auf1 = plus(a, v, wahl([2, 3])), auf2 = plus(a, v, -wahl([1, 2])), neben = suche(() => [[zz(1, 11), zz(1, 7)], [zz(1, 11), zz(1, 7)]], (ps) => ps.every((p) => (p[0] - a[0]) * v[1] !== (p[1] - a[1]) * v[0]) && String(ps[0]) !== String(ps[1]));
      const namen = mische(['C', 'D', 'E', 'F']), punkte = [[auf1, true], [auf2, true], [neben[0], false], [neben[1], false]].map(([p, r], i) => ({ p, r, n: namen[i] })).sort((x, y) => x.n.localeCompare(y.n));
      return auswahl('Welche Punkte liegen auf der Geraden durch A und B? Kreuze alle an.', punkte.map((x) => opt(`Punkt ${x.n}`, x.r)),
        h1('Bestimme, um wie viele Kästchen es von A nach B nach rechts und nach oben geht. Dieses Muster setzt sich in beide Richtungen fort.'),
        { mehrfach: true, bild: B.gitter(GT(12, 8, { punkte: [PT('A', ...a, 'lo'), PT('B', ...b, 'lo'), ...punkte.map((x) => PT(x.n, ...x.p))] })), nachweis: [{ art: 'punktwahl', von: 'A', durch: 'B', linienart: 'gerade' }] }); },
    () => { const n = wahl([4, 5]), w = n * (n - 1) / 2;
      return zahl(`${n} Geraden werden so gezeichnet, dass möglichst viele Schnittpunkte entstehen. Wie viele Schnittpunkte sind es höchstens?`, w, fehlerliste(w, [[n, 'gerade-begrenzt'], [n - 1, 'gerade-begrenzt'], [n * (n - 1), 'gerade-begrenzt']]),
        h1('Jede neue Gerade kann jede schon gezeichnete Gerade höchstens einmal schneiden.'), { nachweis: [{ art: 'verbindungen', n, wert: w }] }); },
    () => { const s = [zz(4, 8), zz(3, 5)], [u, v] = wahl([[[2, 1], [1, -2]], [[1, 2], [2, -1]], [[3, 1], [1, -1]], [[1, 1], [2, -1]]]);
      const f = (r, k) => plus(s, r, k), k = suche(() => [zz(1, 2), zz(2, 3), zz(1, 2), zz(2, 3)], ([a, b, c, d]) => drin(12, 8, f(u, -a), f(u, -b), f(v, c), f(v, d)) && a !== b && c !== d);
      const g = GT(12, 8, { punkte: [PT('A', ...f(u, -k[1])), PT('B', ...f(u, -k[0])), PT('C', ...f(v, k[3])), PT('D', ...f(v, k[2]))] });
      return gitterPunkte('Die Gerade durch A und B schneidet die Gerade durch C und D. Die Geraden sind nicht gezeichnet. Markiere ihren Schnittpunkt.', g, [s], [],
        h1('Setze das Schrittmuster von A nach B über B hinaus fort, ebenso das von C nach D.'), { nachweis: [{ art: 'schnittpunkt', punkte: [['A', 'B'], ['C', 'D']] }] }); },
    () => auswahl('Wie viele gemeinsame Punkte können zwei verschiedene Geraden haben?', [opt('Keinen oder genau einen.', true), opt('Immer genau einen.', false, 'parallel-gleichlang'), opt('Keinen, einen oder zwei.', false, 'gerade-begrenzt'), opt('Beliebig viele.', false, 'gerade-begrenzt')],
      h1('Denke an Geraden, die sich kreuzen, und an Geraden, die nebeneinander herlaufen.')),
  ]);

  // =====================================================================
  // B2 Strecken messen und in einer vorgegebenen Länge zeichnen
  // =====================================================================
  const streckeBild = (n, v = WAAGERECHT, b = 12, h = 5) => { const a = suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => drin(b - 1, h - 1, plus(p, v, n)) && plus(p, v, n).every((x) => x >= 1)); const e = plus(a, v, n);
    return { a, e, g: GT(b, h, { punkte: [PT('A', ...a, v[0] ? 'lo' : 'l'), PT('B', ...e, v[0] ? 'ro' : 'r')], linien: [LN(null, a, e, 'strecke')] }) }; };
  // Von A aus eine Strecke mit n Kästchen: A liegt so, dass mindestens eine Richtung entlang der Linien passt.
  const startPunkt = (n, b = 12, h = 6) => { const a = suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => p[0] + n <= b || p[0] - n >= 0); return { a, g: GT(b, h, { punkte: [PT('A', ...a, 'lo')] }), bsp: [a, a[0] + n <= b ? [a[0] + n, a[1]] : [a[0] - n, a[1]]] }; };
  sechs(L_('B2'), 'F', [
    () => { const l = laengeMm(30, 90, true);
      return zahl(Z('Die Strecke liegt am Lineal.', 'Wie lang ist die Strecke von A nach B?'), l / 10, fehlerliste(l / 10, [[l / 10 + 1, 'koord-ab-eins'], [l / 10 - 1, 'koord-ab-eins']]),
        h3('Die Strecke beginnt bei 0. Lies die Zahl am Ende ab.', 'Endet eine Strecke bei der 5, dann ist sie 5 cm lang.', 'Schau, bei welcher Zahl der Punkt B liegt.'), { einheit: 'cm', bild: B.lineal(0, l), nachweis: [{ art: 'messen', wert: l, cm: l / 10 }] }); },
    () => { const n = zz(4, 9), s = streckeBild(n);
      return zahl(Z('Zähle die Kästchen.', 'Wie lang ist die Strecke von A nach B?'), n, fehlerliste(n, [[n + 1, 'koord-ab-eins'], [n - 1, 'koord-ab-eins']]),
        h3('Zähle die Kästchen zwischen A und B, nicht die Linien.', 'Von einer Linie zur nächsten ist es 1 Kästchen.', 'Beginne bei A und zähle Kästchen für Kästchen bis B.'), { einheit: 'Kästchen', bild: B.gitter(s.g), nachweis: [{ art: 'strecke', von: 'A', nach: 'B', wert: n, einheit: 'kaestchen' }] }); },
    () => { const n = zz(3, 7), s = startPunkt(n);
      return gitterLinie(Z('Zeichne eine Strecke.', 'Sie beginnt in A.', `Sie ist ${n} Kästchen lang.`), s.g, 'strecke', { art: 'laenge', laenge: n, von: s.a }, s.bsp, [[{ art: 'laenge', laenge: n - 1, von: s.a }, 'koord-ab-eins'], [{ art: 'laenge', laenge: n + 1, von: s.a }, 'koord-ab-eins']],
        h3('Zähle von A aus die Kästchen ab.', 'Für 3 Kästchen gehst du von A aus 3 Schritte an einer Linie entlang.', `Tippe auf A. Zähle dann ${n} Kästchen weit und tippe dort.`)); },
    () => { const n = wahl([4, 6, 8, 10]), s = streckeBild(n);
      return zahl(Z('2 Kästchen sind 1 cm lang.', `Die Strecke ist ${n} Kästchen lang.`, 'Wie viele cm sind das?'), n / 2, fehlerliste(n / 2, [[n, 'laenge-kaestchen'], [n * 2, 'laenge-kaestchen']]),
        h3('Immer 2 Kästchen zusammen sind 1 cm.', '6 Kästchen sind 3 cm, denn 6 : 2 = 3.', `Teile ${n} durch 2.`), { einheit: 'cm', bild: B.gitter(s.g), nachweis: [KAESTCHEN, ...N(`${n} : 2`), { art: 'strecke', von: 'A', nach: 'B', wert: n / 2, einheit: 'cm' }] }); },
    () => { const [n1, n2] = suche(() => [zz(3, 8), zz(3, 6)], ([x, y]) => x !== y), y1 = 5, x1 = zz(1, 2), x2 = zz(1, 3);
      const g = GT(11, 6, { punkte: [PT('A', x1, y1, 'lo'), PT('B', x1 + n1, y1, 'ro'), PT('C', x2, 1, 'l'), PT('D', x2, 1 + n2 > 4 ? 4 : 1 + n2, 'l')], linien: [LN(null, [x1, y1], [x1 + n1, y1], 'strecke'), LN(null, [x2, 1], [x2, 1 + n2 > 4 ? 4 : 1 + n2], 'strecke')] });
      const l2 = (1 + n2 > 4 ? 4 : 1 + n2) - 1;
      if (l2 === n1) return null;
      return auswahl(Z('Vergleiche die beiden Strecken.', 'Welche Strecke ist länger?'), [opt('Strecke AB', n1 > l2), opt('Strecke CD', l2 > n1)],
        h3('Zähle bei beiden Strecken die Kästchen.', 'Eine Strecke mit 5 Kästchen ist länger als eine mit 3 Kästchen.', `Die Strecke AB ist ${n1} Kästchen lang. Zähle jetzt CD.`), { bild: B.gitter(g), nachweis: [{ art: 'streckenwahl', was: 'laengste' }] }); },
    () => { const c = zz(2, 5), s = startPunkt(c * 2);
      return gitterLinie(Z('2 Kästchen sind 1 cm lang.', 'Zeichne eine Strecke.', `Sie beginnt in A und ist ${c} cm lang.`), s.g, 'strecke', { art: 'laenge', laenge: c * 2, von: s.a }, s.bsp, [[{ art: 'laenge', laenge: c, von: s.a }, 'laenge-kaestchen']],
        h3('Für jeden Zentimeter brauchst du 2 Kästchen.', '3 cm sind 6 Kästchen, denn 3 · 2 = 6.', `Rechne ${c} · 2. So viele Kästchen ist die Strecke lang.`), { nachweis: [{ art: 'linie' }, KAESTCHEN, ...N(`${c} · 2`)] }); },
  ]);
  sechs(L_('B2'), 'G', [
    () => { const l = laengeMm(32, 96);
      return luecken(Z('Die Strecke liegt am Lineal.', 'Sie ist {{a}} cm und {{b}} mm lang.'), { a: [Math.floor(l / 10), fehlerliste(Math.floor(l / 10), [[Math.floor(l / 10) + 1, 'einheit-mm-cm']])], b: [l % 10, []] },
        h3('Lies erst die ganzen Zentimeter ab. Zähle dann die kleinen Striche dazu.', 'Endet eine Strecke 3 kleine Striche nach der 5, ist sie 5 cm 3 mm lang.', `Der Punkt B liegt zwischen ${Math.floor(l / 10)} und ${Math.floor(l / 10) + 1}.`), { bild: B.lineal(0, l), nachweis: [{ art: 'messen', wert: l, cm: Math.floor(l / 10), mm: l % 10 }] }); },
    () => { const l = laengeMm(24, 88), c = Math.floor(l / 10), m = l % 10;
      return zahl(Z('Die Strecke liegt am Lineal.', 'Wie viele mm ist sie lang?'), l, fehlerliste(l, [[c + m, 'einheit-mm-cm'], [c, 'einheit-mm-cm'], [c * 10, 'einheit-mm-cm']]),
        h3('1 cm sind 10 mm. Jeder kleine Strich ist 1 mm.', '4 cm und 3 mm sind 43 mm, denn 4 · 10 + 3 = 43.', `Die Strecke ist ${c} cm und ${m} mm lang. Rechne in mm um.`), { einheit: 'mm', bild: B.lineal(0, l), nachweis: [{ art: 'messen', wert: l }] }); },
    () => { const c = zz(3, 12), m = suche(() => zz(1, 9), (x) => x !== c), l = c * 10 + m;
      return zahl(Z(`Eine Strecke ist ${c} cm ${m} mm lang.`, 'Wie viele mm sind das?'), l, fehlerliste(l, [[c + m, 'einheit-mm-cm'], [c * 100 + m, 'einheit-mm-cm']]),
        h3('Rechne die Zentimeter in Millimeter um. Zähle dann die Millimeter dazu.', '2 cm 7 mm sind 27 mm, denn 2 · 10 + 7 = 27.', `${c} cm sind ${c * 10} mm.`), { einheit: 'mm', nachweis: N(`${c} · 10 + ${m}`) }); },
    () => { const c = zz(2, 5), s = startPunkt(c * 2);
      return gitterLinie(Z('Zeichne eine Strecke von A aus.', `Sie ist ${c} cm lang.`, 'Denke daran: 2 Kästchen sind 1 cm.'), s.g, 'strecke', { art: 'laenge', laenge: c * 2, von: s.a }, s.bsp, [[{ art: 'laenge', laenge: c, von: s.a }, 'laenge-kaestchen']],
        h3('Rechne die Länge zuerst in Kästchen um.', '4 cm sind 8 Kästchen, denn 4 · 2 = 8.', `Die Strecke ist ${c * 2} Kästchen lang.`), { nachweis: [{ art: 'linie' }, KAESTCHEN, ...N(`${c} · 2`)] }); },
    () => { const [n1, n2] = [wahl([4, 6, 8]), wahl([2, 4])], a = [zz(1, 2), 1], b = [a[0] + n1, 1], c = [b[0], 1 + n2];
      const g = GT(11, 6, { punkte: [PT('A', ...a, 'lo'), PT('B', ...b, 'ru'), PT('C', ...c, 'ro')], linien: [LN(null, a, b, 'strecke'), LN(null, b, c, 'strecke')] });
      return zahl(Z('Ein Weg führt von A über B nach C.', '2 Kästchen sind 1 cm lang.', 'Wie viele cm ist der ganze Weg lang?'), (n1 + n2) / 2, fehlerliste((n1 + n2) / 2, [[n1 + n2, 'laenge-kaestchen'], [n1 / 2, 'sach-schritt-vergessen']]),
        h3('Bestimme beide Strecken einzeln. Zähle sie dann zusammen.', 'Ein Weg aus 3 cm und 2 cm ist 5 cm lang.', `Die Strecke AB ist ${n1} Kästchen lang. Das sind ${n1 / 2} cm.`),
        { einheit: 'cm', bild: B.gitter(g), nachweis: [KAESTCHEN, { art: 'strecke', von: 'A', nach: 'B', wert: n1 / 2, einheit: 'cm' }, { art: 'strecke', von: 'B', nach: 'C', wert: n2 / 2, einheit: 'cm' }, ...N(`${n1 / 2} + ${n2 / 2}`)] }); },
    () => { const k = kind(), von = wahl([10, 20]), l = laengeMm(30, 70, true);
      return zahl(Z(`${k} hat das Lineal nicht bei 0 angelegt.`, 'Wie viele cm ist die Strecke wirklich lang?'), l / 10, fehlerliste(l / 10, [[(von + l) / 10, 'lineal-nicht-null']]),
        h3('Schau auf den Anfang und auf das Ende der Strecke.', 'Von der 2 bis zur 7 sind es 5 cm, denn 7 − 2 = 5.', `Die Strecke beginnt bei ${von / 10} und endet bei ${(von + l) / 10}.`), { einheit: 'cm', bild: B.lineal(von, von + l), nachweis: [{ art: 'messen', wert: l, cm: l / 10 }] }); },
  ]);
  sechs(L_('B2'), 'M', [
    () => { const von = wahl([10, 20, 30]), l = laengeMm(24, 68);
      return zahl('Das Lineal liegt nicht bei 0 an. Wie viele mm ist die Strecke lang?', l, fehlerliste(l, [[von + l, 'lineal-nicht-null'], [Math.floor(l / 10) + (l % 10), 'einheit-mm-cm']]),
        h2('Lies Anfang und Ende der Strecke in Millimetern ab.', `Die Strecke beginnt bei ${von} mm und endet bei ${von + l} mm. Bilde den Unterschied.`), { einheit: 'mm', bild: B.lineal(von, von + l), nachweis: [{ art: 'messen', wert: l }] }); },
    () => { const c = zz(6, 11), m = zz(1, 9), l1 = c * 10 + m, l2 = suche(() => zz(31, l1 - 6), (x) => x % 10 !== 0);
      return zahl(`Die Strecke AB ist ${c} cm ${m} mm lang, die Strecke CD ist ${l2} mm lang. Um wie viele mm ist AB länger als CD?`, l1 - l2, fehlerliste(l1 - l2, [[Math.abs(c + m - l2), 'einheit-mm-cm'], [l1 + l2, 'sub-addiert']]),
        h2('Rechne beide Längen in dieselbe Einheit um.', `${c} cm ${m} mm sind ${l1} mm.`), { einheit: 'mm', nachweis: N(`${c} · 10 + ${m}`, `${l1} − ${l2}`) }); },
    () => { const c1 = zz(8, 11), m1 = zz(1, 9), c2 = zz(2, 5), m2 = zz(1, 9), l1 = c1 * 10 + m1, l2 = c2 * 10 + m2;
      return zahl(`Im Heft: Zeichne mit dem Geodreieck eine Strecke AB, die ${c1} cm ${m1} mm lang ist. Markiere auf ihr den Punkt C, der ${c2} cm ${m2} mm von A entfernt ist. Miss die Strecke von C nach B in mm.`, l1 - l2, fehlerliste(l1 - l2, [[l1 + l2, 'sub-addiert']]),
        h2('Zeichne genau und miss vom Punkt C bis zum Punkt B.', `Zur Kontrolle kannst du rechnen: ${l1} mm − ${l2} mm.`), { einheit: 'mm', toleranz: 2, nachweis: N(`${c1} · 10 + ${m1}`, `${c2} · 10 + ${m2}`, `${l1} − ${l2}`) }); },
    () => { const n = wahl([5, 7, 9, 11]), c = Math.floor(n / 2), s = startPunkt(n, 13, 6);
      return gitterLinie(`Zeichne von A aus eine Strecke, die ${c} cm 5 mm lang ist. Ein Kästchen ist 5 mm lang.`, s.g, 'strecke', { art: 'laenge', laenge: n, von: s.a }, s.bsp, [[{ art: 'laenge', laenge: n - 1, von: s.a }, 'laenge-kaestchen'], [{ art: 'laenge', laenge: c, von: s.a }, 'laenge-kaestchen']],
        h2('Rechne die Länge in Millimeter um und teile durch die Länge eines Kästchens.', `${c} cm 5 mm sind ${n * 5} mm. Das sind ${n} Kästchen.`), { nachweis: [{ art: 'linie' }, ...N(`${c} · 10 + 5`, `${n * 5} : 5`)] }); },
    () => { const c1 = zz(3, 5), m1 = zz(1, 9), l2 = suche(() => zz(21, 39), (x) => x % 10 !== 0), c3 = zz(2, 4), m3 = zz(1, 9), l1 = c1 * 10 + m1, l3 = c3 * 10 + m3;
      return zahl(`Im Heft: Zeichne auf einer Geraden drei Strecken direkt hintereinander. Sie sind ${c1} cm ${m1} mm, ${l2} mm und ${c3} cm ${m3} mm lang. Miss die gesamte Länge in mm.`, l1 + l2 + l3, fehlerliste(l1 + l2 + l3, [[c1 + m1 + l2 + c3 + m3, 'einheit-mm-cm']]),
        h2('Setze jede neue Strecke genau am Ende der vorigen an.', `Zur Kontrolle: ${l1} mm + ${l2} mm + ${l3} mm.`), { einheit: 'mm', toleranz: 2, nachweis: N(`${c1} · 10 + ${m1}`, `${c3} · 10 + ${m3}`, `${l1} + ${l2} + ${l3}`) }); },
    () => { const c0 = zz(1, 4), m0 = wahl([5, 4, 6, 8]), c = zz(4, 7), von = c0 * 10 + m0;
      return zahl(`Eine Strecke soll genau ${c} cm lang werden. Sie beginnt am Lineal bei ${c0} cm ${m0} mm. Bei wie vielen mm endet sie?`, von + c * 10, fehlerliste(von + c * 10, [[c * 10, 'lineal-nicht-null'], [von + c, 'einheit-mm-cm']]),
        h2('Rechne Anfang und Länge in Millimeter um.', `Der Anfang liegt bei ${von} mm. Die Strecke ist ${c * 10} mm lang.`), { einheit: 'mm', nachweis: N(`${c0} · 10 + ${m0}`, `${c} · 10`, `${von} + ${c * 10}`) }); },
  ]);
  sechs(L_('B2'), 'E', [
    () => { const von = suche(() => zz(12, 38), (x) => x % 10 !== 0), l = suche(() => laengeMm(34, 76), (x) => (von + x) % 10 !== 0);
      return luecken('Das Lineal liegt nicht bei 0 an. Die Strecke ist {{a}} cm und {{b}} mm lang.', { a: [Math.floor(l / 10), fehlerliste(Math.floor(l / 10), [[Math.floor((von + l) / 10), 'lineal-nicht-null']])], b: [l % 10, []] },
        h1('Lies Anfang und Ende in Millimetern ab und bilde den Unterschied.'), { bild: B.lineal(von, von + l), nachweis: [{ art: 'messen', wert: l, cm: Math.floor(l / 10), mm: l % 10 }] }); },
    () => { const ab = wahl([110, 120, 130, 140]), c1 = zz(3, 4), m1 = zz(1, 9), c2 = zz(2, 4), m2 = zz(1, 9), x = c1 * 10 + m1, y = c2 * 10 + m2;
      return zahl(`Die Strecke AB ist ${ab / 10} cm lang. Auf ihr liegt der Punkt C ${c1} cm ${m1} mm von A entfernt und der Punkt D ${c2} cm ${m2} mm von B entfernt. Wie viele mm ist die Strecke CD lang?`, ab - x - y, fehlerliste(ab - x - y, [[ab - x, 'sach-schritt-vergessen'], [Math.abs(x - y), 'sach-falsche-rechnung']]),
        h1('Zeichne eine Skizze und trage alle Längen in Millimetern ein.'), { einheit: 'mm', nachweis: N(`${ab / 10} · 10`, `${c1} · 10 + ${m1}`, `${c2} · 10 + ${m2}`, `${ab} − ${x} − ${y}`) }); },
    () => { const c = zz(8, 12), m = wahl([2, 4, 6, 8]), l = c * 10 + m;
      return zahl(`Im Heft: Zeichne eine Strecke AB, die ${c} cm ${m} mm lang ist. Finde durch Messen ihren Mittelpunkt M. Wie viele mm ist die Strecke AM lang?`, l / 2, fehlerliste(l / 2, [[l, 'sach-schritt-vergessen']]),
        h1('Der Mittelpunkt teilt die Strecke in zwei gleich lange Teile.'), { einheit: 'mm', toleranz: 2, nachweis: N(`${c} · 10 + ${m}`, `${l} : 2`) }); },
    () => { const k = wahl([3, 4, 6]), c = zz(2, 3), m = suche(() => zz(2, 8), (x) => Math.floor(k * (c * 10 + x) / 10) !== (k * (c * 10 + x)) % 10 && (k * (c * 10 + x)) % 10 !== 0), teil = c * 10 + m, l = k * teil;
      return luecken(`Eine Strecke wird in ${k} gleich lange Teile geteilt. Jeder Teil ist ${c} cm ${m} mm lang. Die ganze Strecke ist {{a}} cm und {{b}} mm lang.`, { a: [Math.floor(l / 10), fehlerliste(Math.floor(l / 10), [[k * c, 'einheit-mm-cm']])], b: [l % 10, fehlerliste(l % 10, [[k * m, 'einheit-mm-cm']])] },
        h1('Rechne in Millimetern und wandle erst das Ergebnis wieder in cm und mm um.'), { nachweis: N(`${c} · 10 + ${m}`, `${k} · ${teil}`, `${l} : 10 = ${Math.floor(l / 10)} Rest ${l % 10}`) }); },
    () => { const [x, y, z_] = wahl([[6, 8, 10], [3, 4, 5], [8, 6, 10], [12, 5, 13], [5, 12, 13], [9, 12, 15]]);
      return zahl(`Im Heft: Zeichne entlang der Kästchenlinien eine Strecke AB, die ${x} cm lang ist und nach rechts verläuft. Zeichne von B aus eine Strecke BC, die ${y} cm lang ist und nach oben verläuft. Miss die Strecke AC in mm.`, z_ * 10, fehlerliste(z_ * 10, [[(x + y) * 10, 'abstand-schraeg']]),
        h1('Die Strecke AC ist der direkte Weg von A nach C. Sie ist kürzer als der Weg über B.'), { einheit: 'mm', toleranz: 2, nachweis: [...N(`${x} · 10`, `${y} · 10`), { art: 'dreieck', a: x * 10, b: y * 10, c: z_ * 10 }] }); },
    () => { const a = wahl([35, 45, 55, 25]), d = wahl([2, 3, 4]), ges = 4 * a + d * 10;
      return zahl(`Drei Strecken a, b und c sind zusammen ${ges / 10} cm lang. Die Strecke b ist doppelt so lang wie a. Die Strecke c ist ${d} cm länger als a. Wie viele mm ist die Strecke a lang?`, a, fehlerliste(a, [[ges / 4, 'sach-schritt-vergessen'], [Math.round(ges / 3), 'sach-falsche-rechnung']]),
        h1('Lege in Gedanken die drei Strecken aus Stücken der Länge a zusammen. Was bleibt übrig?'), { einheit: 'mm', nachweis: N(`${ges / 10} · 10`, `${d} · 10`, `${ges} − ${d * 10}`, `${ges - d * 10} : 4`) }); },
  ]);
}
