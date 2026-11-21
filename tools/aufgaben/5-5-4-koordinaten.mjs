// Aufgaben zu 5.5.4 „Das Koordinatensystem“ (Lernziele K1 und K2) nach ADR 0015 und ADR 0032.
// K1 Koordinaten ablesen, K2 Punkte eintragen (Gitterzeichnen). Nur der erste Quadrant, nur ganze Zahlen, Schreibweise A(3|5).
// Zahlenraum: F bis 6, G bis 10, M bis 15, E Muster und fehlende Eckpunkte. Kontexte: Karten des Königreichs und Schatzkarten.
import { sechs, zahl, auswahl, opt, luecken, zuordnen, gitterPunkte, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, GT, PT, LN, FG, plus, minus, senk, drin, kreuzP } from './5-5-geo.mjs';

const L_ = (kurz) => `5.5.4-${kurz}`;
const KS = (b, h, teile = {}) => GT(b, h, { achsen: true, ...teile });
const P = (p) => `(${p[0]}|${p[1]})`;
const fern = (ps, d = 2) => ps.every((p, i) => ps.every((q, j) => i >= j || Math.max(Math.abs(p[0] - q[0]), Math.abs(p[1] - q[1])) >= d));
// n verschiedene Punkte mit Abstand; bei jedem sind x und y verschieden (sonst fiele ein Vertauschen nicht auf).
const punkte = (n, maxX, maxY = maxX, ok = () => true, min = 1) => suche(() => Array.from({ length: n }, () => [zz(min, maxX), zz(min, maxY)]), (ps) => fern(ps) && ps.every((p) => p[0] !== p[1]) && ok(ps));
const tausch = (p) => [p[1], p[0]];
const benannt = (ps, namen = 'ABCDEF') => ps.map((p, i) => PT(namen[i], ...p));
const koordOptionen = (p, max) => [opt(P(p), true), opt(P(tausch(p)), false, 'koord-vertauscht'), opt(P(p[0] < max && p[1] < max ? [p[0] + 1, p[1] + 1] : [p[0] - 1, p[1] - 1]), false, 'koord-ab-eins')];
const fehlerPunkt = (p) => [[[tausch(p)], 'koord-vertauscht'], [[[p[0] - 1, p[1] - 1]].filter((q) => q[0] >= 0 && q[1] >= 0), 'koord-ab-eins'], [[[p[0] + 1, p[1] + 1]], 'koord-ab-eins']];
const eintragen = (text, b, h, ps, hilfen, extra = {}) => gitterPunkte(text, KS(b, h), ps, ps.length === 1 ? fehlerPunkt(ps[0]).filter(([q]) => q.every((z) => z[0] <= b && z[1] <= h)) : [[ps.map(tausch).filter((q) => q[0] <= b && q[1] <= h), 'koord-vertauscht']].filter(([q]) => q.length === ps.length), hilfen, { nachweis: [{ art: 'eintragen', punkte: ps }], ...extra });

export function koordinatensystem() {
  // =====================================================================
  // K1 Koordinaten eines Punktes ablesen
  // =====================================================================
  const ablesen = (text, max, hoch, hilfen, name = 'P') => { const [p] = punkte(1, max, hoch);
    return luecken(text, { x: [p[0], fehlerliste(p[0], [[p[1], 'koord-vertauscht'], [p[0] + 1, 'koord-ab-eins']])], y: [p[1], fehlerliste(p[1], [[p[0], 'koord-vertauscht'], [p[1] + 1, 'koord-ab-eins']])] }, hilfen(p),
      { bild: B.gitter(KS(max, hoch, { punkte: [PT(name, ...p)] })), nachweis: [{ art: 'koordinaten', punkt: name, x: p[0], y: p[1], luecken: ['x', 'y'] }] }); };
  const welcherPunkt = (text, max, hoch, n, hilfen, namen = 'ABCD') => { const [p] = punkte(1, Math.min(max, hoch), Math.min(max, hoch), ([q]) => Math.abs(q[0] - q[1]) >= 2), andere = suche(() => [tausch(p), ...punkte(n - 2, max, hoch)], (ps) => fern([p, ...ps]) && ps.every((q) => q[0] <= max && q[1] <= hoch));
    const reihen = mische([p, ...andere]), g = KS(max, hoch, { punkte: benannt(reihen, namen) });
    return auswahl(text(p), reihen.map((q, i) => opt(`Punkt ${namen[i]}`, q === p, q === p ? undefined : q === andere[0] ? 'koord-vertauscht' : undefined)), hilfen(p), { bild: B.gitter(g), nachweis: [{ art: 'koordinaten', punkt: namen[reihen.indexOf(p)], x: p[0], y: p[1] }] }); };
  const paare = (text, max, hoch, n, hilfen, mitAchse = false) => { const [p] = punkte(1, Math.min(max, hoch), Math.min(max, hoch), ([q]) => Math.abs(q[0] - q[1]) >= 2), rest = suche(() => [tausch(p), ...punkte(n - 2 - (mitAchse ? 2 : 0), max, hoch), ...(mitAchse ? [[0, zz(1, hoch)], [zz(1, max), 0]] : [])], (ps) => fern([p, ...ps]) && ps.every((q) => q[0] <= max && q[1] <= hoch));
    const reihen = mische([p, ...rest]);
    return zuordnen(text, reihen.map((q, i) => ['ABCDEF'[i], P(q)]), hilfen, { bild: B.gitter(KS(max, hoch, { punkte: benannt(reihen) })), nachweis: [{ art: 'koordinatenpaare', punkte: reihen }] }); };
  sechs(L_('K1'), 'F', [
    () => ablesen(Z('Du startest unten links in der Ecke.', 'Bis zum Punkt P gehst du {{x}} nach rechts und {{y}} nach oben.'), 6, 6,
      (p) => h3('Geh zuerst an der x-Achse entlang nach rechts. Geh dann nach oben.', 'Für einen Punkt bei (2|4) gehst du 2 nach rechts und 4 nach oben.', `Unter dem Punkt P steht an der x-Achse die Zahl ${p[0]}.`)),
    () => { const [p] = punkte(1, 5, 5);
      return auswahl(Z('Schau dir den Punkt A an.', 'Wo liegt er?'), koordOptionen(p, 6),
        h3('Die erste Zahl sagt: so weit nach rechts. Die zweite Zahl sagt: so weit nach oben.', 'Der Punkt (2|4) liegt 2 nach rechts und 4 nach oben.', `Unter dem Punkt A steht an der x-Achse die Zahl ${p[0]}.`), { bild: B.gitter(KS(6, 6, { punkte: [PT('A', ...p)] })), nachweis: [{ art: 'koordinaten', punkt: 'A', x: p[0], y: p[1] }] }); },
    () => welcherPunkt((p) => Z('Schau dir die Punkte an.', `Welcher Punkt liegt bei ${P(p)}?`), 6, 6, 3,
      (p) => h3('Die erste Zahl sagt: so weit nach rechts.', 'Zum Punkt (2|4) gehst du erst 2 nach rechts und dann 4 nach oben.', `Geh ${p[0]} nach rechts und dann ${p[1]} nach oben.`)),
    () => { const [p] = punkte(1, 6, 6), nachRechts = wahl([true, false]), w = nachRechts ? p[0] : p[1];
      return zahl(Z('Die Karte zeigt einen Schatz beim Punkt S.', 'Du startest unten links in der Ecke.', `Wie viele Schritte gehst du nach ${nachRechts ? 'rechts' : 'oben'}?`), w, fehlerliste(w, [[nachRechts ? p[1] : p[0], 'koord-vertauscht'], [w + 1, 'koord-ab-eins']]),
        h3('Lies die Zahl an der passenden Achse ab.', 'Nach rechts zählst du an der x-Achse. Nach oben zählst du an der y-Achse.', nachRechts ? 'Schau genau unter den Punkt S auf die x-Achse.' : 'Schau genau links vom Punkt S auf die y-Achse.'), { bild: B.gitter(KS(6, 6, { punkte: [PT('S', ...p)] })), nachweis: [{ art: 'koordinaten', punkt: 'S', x: p[0], y: p[1] }] }); },
    () => paare(Z('Ordne jedem Punkt seine Stelle zu.'), 6, 6, 3,
      h3('Die erste Zahl sagt: so weit nach rechts. Die zweite Zahl sagt: so weit nach oben.', 'Der Punkt (2|4) liegt 2 nach rechts und 4 nach oben.', 'Beginne mit dem Punkt A. Lies erst unten an der x-Achse ab.')),
    () => { const a = [zz(2, 5), 0], b = [0, zz(2, 5)], [c] = punkte(1, 5, 5, ([q]) => fern([a, b, q])), reihen = mische([a, b, c]), achse = wahl(['x', 'y']);
      return auswahl(Z('Schau dir die Punkte an.', `Welcher Punkt liegt auf der ${achse}-Achse?`), reihen.map((q, i) => opt(`Punkt ${'ABC'[i]}`, q === (achse === 'x' ? a : b), q === (achse === 'x' ? b : a) ? 'koord-vertauscht' : undefined)),
        h3('Die x-Achse läuft nach rechts. Die y-Achse läuft nach oben.', 'Ein Punkt auf der x-Achse liegt ganz unten auf der Linie.', achse === 'x' ? 'Suche den Punkt auf der unteren Linie.' : 'Suche den Punkt auf der linken Linie.'), { bild: B.gitter(KS(6, 6, { punkte: benannt(reihen) })), nachweis: [{ art: 'punktwahl', was: achse === 'x' ? 'y' : 'x', wert: 0 }] }); },
  ]);
  sechs(L_('K1'), 'G', [
    () => ablesen(Z('Schau dir den Punkt P an.', 'Er hat die Koordinaten ({{x}}|{{y}}).'), 10, 10,
      (p) => h3('Zuerst kommt die x-Koordinate, dann die y-Koordinate.', 'Beim Punkt (2|7) ist 2 die x-Koordinate und 7 die y-Koordinate.', `Die x-Koordinate liest du unten ab. Sie ist ${p[0]}.`)),
    () => { const [p] = punkte(1, 9, 9);
      return auswahl(Z('Schau dir den Punkt Q an.', 'Welche Koordinaten hat er?'), koordOptionen(p, 10),
        h3('Lies zuerst an der x-Achse ab und dann an der y-Achse.', 'Die x-Koordinate steht immer vorn.', `Unter dem Punkt Q steht an der x-Achse die Zahl ${p[0]}.`), { bild: B.gitter(KS(10, 10, { punkte: [PT('Q', ...p)] })), nachweis: [{ art: 'koordinaten', punkt: 'Q', x: p[0], y: p[1] }] }); },
    () => paare(Z('Ordne jedem Punkt seine Koordinaten zu.', 'Achte auf die Punkte auf den Achsen.'), 10, 10, 5,
      h3('Zuerst kommt die x-Koordinate, dann die y-Koordinate.', 'Ein Punkt auf der y-Achse hat die x-Koordinate 0.', 'Beginne mit dem Punkt A. Lies erst unten an der x-Achse ab.'), true),
    () => welcherPunkt((p) => Z('Die Karte zeigt drei Orte im Königreich.', `Welcher Punkt liegt bei ${P(p)}?`), 10, 10, 3,
      (p) => h3('Die x-Koordinate steht vorn.', 'Zum Punkt (2|7) gehst du 2 nach rechts und 7 nach oben.', `Geh ${p[0]} nach rechts und dann ${p[1]} nach oben.`), 'BMT'),
    () => { const [p] = punkte(1, 9, 9, ([q]) => Math.abs(q[0] - q[1]) >= 2), achse = wahl(['x', 'y']), w = achse === 'x' ? p[0] : p[1], andere = suche(() => [tausch(p), ...punkte(1, 9, 9)], (ps) => fern([p, ...ps]) && (achse === 'x' ? ps[1][0] !== w : ps[1][1] !== w)), reihen = mische([p, ...andere]);
      return auswahl(Z('Schau dir die Punkte an.', `Welcher Punkt hat die ${achse}-Koordinate ${w}?`), reihen.map((q, i) => opt(`Punkt ${'ABC'[i]}`, q === p, q === andere[0] ? 'koord-vertauscht' : undefined)),
        h3(achse === 'x' ? 'Die x-Koordinate liest du unten an der x-Achse ab.' : 'Die y-Koordinate liest du links an der y-Achse ab.', 'Beim Punkt (2|7) ist 2 die x-Koordinate und 7 die y-Koordinate.', achse === 'x' ? `Suche den Punkt genau über der Zahl ${w}.` : `Suche den Punkt genau rechts neben der Zahl ${w}.`), { bild: B.gitter(KS(10, 10, { punkte: benannt(reihen) })), nachweis: [{ art: 'punktwahl', was: achse, wert: w }] }); },
    () => { const k = kind(), [p] = punkte(1, 9, 9), q = tausch(p);
      return auswahl(Z(`${k} sagt: „Der Punkt P liegt bei ${P(q)}.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'koord-vertauscht'), opt(`Falsch. P liegt bei ${P(p)}.`, true), opt(`Falsch. P liegt bei ${P([p[0] + 1, p[1] + 1])}.`, false, 'koord-ab-eins')],
        h3('Prüfe, welche Zahl vorn stehen muss.', 'Zuerst kommt die x-Koordinate, dann die y-Koordinate.', `Unter dem Punkt P steht an der x-Achse die Zahl ${p[0]}.`), { bild: B.gitter(KS(10, 10, { punkte: [PT('P', ...p)] })), nachweis: [U(false), { art: 'koordinaten', punkt: 'P', x: p[0], y: p[1] }] }); },
  ]);
  sechs(L_('K1'), 'M', [
    () => ablesen('Der Punkt P hat die Koordinaten ({{x}}|{{y}}).', 15, 12, () => h2('Die Kästchen sind klein. Fahre vom Punkt aus genau nach unten bis zur x-Achse und genau nach links bis zur y-Achse.', 'Lies zuerst die x-Koordinate unten ab, dann die y-Koordinate links.')),
    () => { const ps = suche(() => punkte(4, 14, 11), (q) => q.some((p) => p[0] > p[1]) && q.some((p) => p[0] < p[1])), regel = wahl(['x>y', 'x<y']);
      return auswahl(`Bei welchen Punkten ist die x-Koordinate ${regel === 'x>y' ? 'größer' : 'kleiner'} als die y-Koordinate? Kreuze alle an.`, ps.map((p, i) => opt(`Punkt ${'ABCD'[i]}`, (regel === 'x>y') === (p[0] > p[1]), (regel === 'x>y') === (p[0] > p[1]) ? undefined : 'koord-vertauscht')),
        h2('Lies für jeden Punkt beide Koordinaten ab und schreibe sie auf.', 'Vergleiche bei jedem Punkt die erste Zahl mit der zweiten.'), { mehrfach: true, bild: B.gitter(KS(15, 12, { punkte: benannt(ps) })), nachweis: [{ art: 'punktwahl', was: regel }] }); },
    () => { const x = suche(() => { const a = [zz(1, 9), zz(1, 9)], d = wahl([[2, 0], [4, 2], [6, 2], [2, 4], [4, 4], [0, 6], [6, 4]]); return { a, b: plus(a, d), m: plus(a, d.map((z) => z / 2)) }; }, (q) => drin(15, 12, q.b) && q.m[0] !== q.m[1]);
      return luecken('Der Mittelpunkt der Strecke AB hat die Koordinaten ({{x}}|{{y}}).', { x: [x.m[0], fehlerliste(x.m[0], [[x.m[1], 'koord-vertauscht']])], y: [x.m[1], fehlerliste(x.m[1], [[x.m[0], 'koord-vertauscht']])] },
        h2('Der Mittelpunkt liegt genau in der Mitte zwischen A und B.', 'Gehe von A aus nur die halben Schritte nach rechts und nach oben.'), { bild: B.gitter(KS(15, 12, { linien: [LN(null, x.a, x.b, 'strecke')], punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'ro')] })), nachweis: [{ art: 'mitte', von: 'A', nach: 'B', x: x.m[0], y: x.m[1], luecken: ['x', 'y'] }] }); },
    () => { const k = zz(3, 12), achse = wahl(['x', 'y']);
      return auswahl(`Der Punkt Q liegt auf der ${achse}-Achse. Welche Koordinaten kann Q haben?`, [opt(achse === 'y' ? `(0|${k})` : `(${k}|0)`, true), opt(achse === 'y' ? `(${k}|0)` : `(0|${k})`, false, 'koord-vertauscht'), opt(`(${k}|${k})`, false), opt(achse === 'y' ? `(1|${k})` : `(${k}|1)`, false, 'koord-ab-eins')],
        h2(`Überlege, wie weit ein Punkt auf der ${achse}-Achse nach ${achse === 'y' ? 'rechts' : 'oben'} geht.`, 'Auf einer Achse ist immer eine der beiden Koordinaten 0.')); },
    () => { const [s] = punkte(1, 6, 5), d = suche(() => [zz(2, 8), zz(2, 6)], (q) => s[0] + q[0] !== s[1] + q[1] && s[0] + q[0] <= 15);
      return luecken(`Ein Ritter startet im Punkt S${P(s)}. Er reitet ${d[0]} Einheiten nach rechts und ${d[1]} Einheiten nach oben. Er kommt im Punkt ({{x}}|{{y}}) an.`, { x: [s[0] + d[0], fehlerliste(s[0] + d[0], [[s[0] + d[1], 'koord-vertauscht'], [d[0], 'sach-schritt-vergessen']])], y: [s[1] + d[1], fehlerliste(s[1] + d[1], [[s[1] + d[0], 'koord-vertauscht'], [d[1], 'sach-schritt-vergessen']])] },
        h2('Nach rechts ändert sich nur die x-Koordinate, nach oben nur die y-Koordinate.', `Rechne für die x-Koordinate ${s[0]} + ${d[0]}.`), { nachweis: N(`${s[0]} + ${d[0]}`, `${s[1]} + ${d[1]}`) }); },
    () => { const k = kind(), [p] = punkte(1, 14, 11, ([q]) => q[1] <= 14 && q[0] <= 11 && Math.abs(q[0] - q[1]) >= 2), q = tausch(p);
      return auswahl(`${k} soll den Punkt P${P(q)} eintragen. Das Bild zeigt, wo ${k} den Punkt gezeichnet hat. Welcher Fehler ist passiert?`, [opt('Die x-Koordinate und die y-Koordinate wurden vertauscht.', true), opt('Es wurde bei 1 statt bei 0 mit dem Zählen begonnen.', false, 'koord-ab-eins'), opt('Es ist kein Fehler passiert.', false, 'koord-vertauscht')],
        h2('Lies die Koordinaten des gezeichneten Punktes ab.', `Der gezeichnete Punkt liegt bei ${P(p)}. Vergleiche mit ${P(q)}.`), { bild: B.gitter(KS(15, 12, { punkte: [PT('P', ...p)] })), nachweis: [{ art: 'koordinaten', punkt: 'P', x: p[0], y: p[1] }] }); },
  ]);
  sechs(L_('K1'), 'E', [
    () => { const d = wahl([[1, 2], [2, 1], [3, 1], [2, 3], [3, 2], [1, 3]]), a = suche(() => [zz(0, 3), zz(0, 3)], (p) => p[0] + 3 * d[0] !== p[1] + 3 * d[1] && p[0] !== p[1]), ps = [0, 1, 2, 3].map((i) => plus(a, d, i));
      return luecken(`Die Punkte A${P(ps[0])}, B${P(ps[1])} und C${P(ps[2])} folgen einem Muster. Der nächste Punkt D hat die Koordinaten ({{x}}|{{y}}).`, { x: [ps[3][0], fehlerliste(ps[3][0], [[ps[3][1], 'koord-vertauscht'], [ps[2][0] + 1, 'sach-falsche-rechnung']])], y: [ps[3][1], fehlerliste(ps[3][1], [[ps[3][0], 'koord-vertauscht'], [ps[2][1] + 1, 'sach-falsche-rechnung']])] },
        h1('Untersuche getrennt, wie sich die x-Koordinate und wie sich die y-Koordinate von Punkt zu Punkt ändert.'), { nachweis: N(`${ps[1][0]} − ${ps[0][0]}`, `${ps[1][1]} − ${ps[0][1]}`, `${ps[2][0]} + ${d[0]}`, `${ps[2][1]} + ${d[1]}`) }); },
    () => { const x = suche(() => { const a = [zz(1, 5), zz(1, 4)], u = [zz(3, 8), 0], w = [zz(0, 3), zz(2, 6)]; return { e: [a, plus(a, u), plus(plus(a, u), w), plus(a, w)] }; }, (q) => drin(15, 12, ...q.e) && q.e[3][0] !== q.e[3][1]), [a, b, c, d] = x.e;
      return luecken(`Die Punkte A${P(a)}, B${P(b)} und C${P(c)} sind drei Ecken des Parallelogramms ABCD. Die vierte Ecke D hat die Koordinaten ({{x}}|{{y}}).`, { x: [d[0], fehlerliste(d[0], [[d[1], 'koord-vertauscht'], [c[0], 'viereck-eigenschaft']])], y: [d[1], fehlerliste(d[1], [[d[0], 'koord-vertauscht']])] },
        h1('Von B nach C geht es genauso weit nach rechts und nach oben wie von A nach D.'), { bild: B.gitter(KS(15, 12, { punkte: [PT('A', ...a, 'lu'), PT('B', ...b, 'ru'), PT('C', ...c, 'ro')] })), nachweis: [{ art: 'vierteEcke', ecken: ['A', 'B', 'C'], x: d[0], y: d[1], luecken: ['x', 'y'] }] }); },
    () => { const x = suche(() => { const s = [zz(3, 11), zz(3, 8)], [u, v] = wahl([[[1, 1], [1, -1]], [[2, 1], [1, -1]], [[1, 2], [2, -1]], [[1, 0], [1, 2]], [[3, 1], [1, -2]]]), k = [zz(1, 2), zz(2, 3), zz(1, 2), zz(2, 3)]; return { s, pts: [plus(s, u, -k[1]), plus(s, u, -k[0]), plus(s, v, k[3]), plus(s, v, k[2])] }; }, (q) => drin(15, 12, ...q.pts) && q.s[0] !== q.s[1] && new Set(q.pts.map(String)).size === 4 && q.pts.every((p) => p[0] >= 1 && p[1] >= 1));
      return luecken('Die Gerade durch A und B und die Gerade durch C und D sind nicht gezeichnet. Sie schneiden sich im Punkt ({{x}}|{{y}}).', { x: [x.s[0], fehlerliste(x.s[0], [[x.s[1], 'koord-vertauscht']])], y: [x.s[1], fehlerliste(x.s[1], [[x.s[0], 'koord-vertauscht']])] },
        h1('Setze das Schrittmuster von A nach B über B hinaus fort, ebenso das von C nach D.'), { bild: B.gitter(KS(15, 12, { punkte: benannt(x.pts) })), nachweis: [{ art: 'schnittpunkt', punkte: [['A', 'B'], ['C', 'D']], x: x.s[0], y: x.s[1], luecken: ['x', 'y'] }] }); },
    () => { const a = [zz(1, 5), zz(1, 4)], s = suche(() => zz(3, 7), (z) => a[1] + z !== z && a[0] + z !== a[1] + z), b = [a[0] + s, a[1]];
      return luecken(`Die Punkte A${P(a)} und B${P(b)} sind die unteren Ecken eines Quadrats ABCD. Jede Seite ist {{s}} Einheiten lang. Die oberen Ecken C und D haben beide die y-Koordinate {{y}}.`, { s: [s, fehlerliste(s, [[b[0], 'sach-schritt-vergessen']])], y: [a[1] + s, fehlerliste(a[1] + s, [[s, 'sach-schritt-vergessen'], [a[0] + s, 'koord-vertauscht']])] },
        h1('Die Seitenlänge ist der Unterschied der x-Koordinaten von A und B. Im Quadrat sind alle Seiten gleich lang.'), { nachweis: N(`${b[0]} − ${a[0]}`, `${a[1]} + ${s}`) }); },
    () => { const s = [zz(1, 4), zz(1, 4)], r = zz(5, 9), o = zz(3, 7), l = suche(() => zz(2, 4), (z) => s[0] + r - z !== s[1] + o);
      return luecken(`Ein Bote startet bei der Burg B${P(s)}. Er reitet ${r} Einheiten nach rechts, dann ${o} Einheiten nach oben und zuletzt ${l} Einheiten nach links. Sein Ziel hat die Koordinaten ({{x}}|{{y}}).`, { x: [s[0] + r - l, fehlerliste(s[0] + r - l, [[s[0] + r + l, 'sub-addiert'], [s[0] + r, 'sach-schritt-vergessen']])], y: [s[1] + o, fehlerliste(s[1] + o, [[s[1] + o - l, 'koord-vertauscht']])] },
        h1('Verfolge jede Koordinate einzeln: Welche Wegstücke ändern die x-Koordinate, welche die y-Koordinate?'), { nachweis: N(`${s[0]} + ${r} − ${l}`, `${s[1]} + ${o}`) }); },
    () => auswahl('Ein Punkt P hat die Koordinaten (a|0). Die Zahl a ist größer als 0. Wo liegt P?', [opt('Auf der x-Achse, rechts vom Ursprung.', true), opt('Auf der y-Achse, oberhalb des Ursprungs.', false, 'koord-vertauscht'), opt('Im Ursprung.', false), opt('Das hängt von der Zahl a ab.', false)],
      h1('Die zweite Koordinate sagt, wie weit der Punkt nach oben geht.'), { nachweis: [HILFSZAHL(0, 'Ein Punkt mit der y-Koordinate 0 liegt auf der x-Achse.')] }),
  ]);

  // =====================================================================
  // K2 Punkte in ein Koordinatensystem eintragen
  // =====================================================================
  sechs(L_('K2'), 'F', [
    () => { const [p] = punkte(1, 6);
      return eintragen(Z('Trage den Punkt A ein.', `A liegt bei ${P(p)}.`), 6, 6, [p], h3('Du startest unten links in der Ecke.', 'Zum Punkt (2|4) gehst du 2 nach rechts und 4 nach oben.', `Geh ${p[0]} nach rechts und dann ${p[1]} nach oben.`)); },
    () => { const [p] = punkte(1, 6);
      return eintragen(Z(`Trage den Punkt B${P(p)} ein.`, `Du gehst ${p[0]} nach rechts und ${p[1]} nach oben.`), 6, 6, [p], h3('Geh zuerst an der x-Achse entlang nach rechts.', 'Die erste Zahl sagt: so weit nach rechts. Die zweite Zahl sagt: so weit nach oben.', `Tippe auf den Punkt über der ${p[0]} und neben der ${p[1]}.`)); },
    () => { const p = wahl([[zz(1, 6), 0], [0, zz(1, 6)]]);
      return eintragen(Z(`Trage den Punkt C${P(p)} ein.`, 'Achtung: Eine der Zahlen ist 0.'), 6, 6, [p], h3('Bei einer 0 gehst du in diese Richtung gar nicht.', 'Der Punkt (3|0) liegt auf der x-Achse.', p[1] === 0 ? `Geh ${p[0]} nach rechts und bleib unten auf der Achse.` : `Bleib links auf der Achse und geh ${p[1]} nach oben.`)); },
    () => { const ps = punkte(2, 6);
      return eintragen(Z('Trage zwei Punkte ein.', `A liegt bei ${P(ps[0])} und B liegt bei ${P(ps[1])}.`), 6, 6, ps, h3('Trage die Punkte nacheinander ein.', 'Zum Punkt (2|4) gehst du 2 nach rechts und 4 nach oben.', `Beginne mit A: ${ps[0][0]} nach rechts und ${ps[0][1]} nach oben.`)); },
    () => { const [p] = punkte(1, 6);
      return eintragen(Z(`Auf der Karte liegt ein Schatz bei S${P(p)}.`, 'Markiere die Stelle.'), 6, 6, [p], h3('Du startest unten links in der Ecke der Karte.', 'Die erste Zahl sagt: so weit nach rechts. Die zweite Zahl sagt: so weit nach oben.', `Geh ${p[0]} nach rechts und dann ${p[1]} nach oben.`)); },
    () => { const [p] = punkte(1, 6, 6, ([q]) => Math.abs(q[0] - q[1]) >= 2), q = tausch(p);
      return eintragen(Z(`Trage die Punkte A${P(p)} und B${P(q)} ein.`, 'Pass auf: Die beiden Punkte sind verschieden.'), 6, 6, [p, q], h3('Die Reihenfolge der beiden Zahlen ist wichtig.', 'Die erste Zahl sagt immer: so weit nach rechts.', `Für A gehst du ${p[0]} nach rechts und ${p[1]} nach oben.`)); },
  ]);
  sechs(L_('K2'), 'G', [
    () => { const [p] = punkte(1, 10);
      return eintragen(Z(`Trage den Punkt P${P(p)} ein.`), 10, 10, [p], h3('Zuerst kommt die x-Koordinate, dann die y-Koordinate.', 'Zum Punkt (2|7) gehst du 2 nach rechts und 7 nach oben.', `Geh vom Punkt (0|0) aus ${p[0]} nach rechts und dann ${p[1]} nach oben.`)); },
    () => { const a = [zz(2, 10), 0], b = [0, suche(() => zz(2, 10), (z) => z !== a[0])];
      return eintragen(Z(`Trage die Punkte A${P(a)} und B${P(b)} ein.`, 'Beide Punkte liegen auf einer Achse.'), 10, 10, [a, b], h3('Eine Koordinate 0 bedeutet: In diese Richtung gehst du nicht.', 'Der Punkt (3|0) liegt auf der x-Achse. Der Punkt (0|3) liegt auf der y-Achse.', `Für A gehst du ${a[0]} nach rechts und bleibst auf der x-Achse.`)); },
    () => { const ps = punkte(3, 10);
      return eintragen(Z('Trage drei Punkte ein.', `Es sind A${P(ps[0])}, B${P(ps[1])} und C${P(ps[2])}.`), 10, 10, ps, h3('Trage die Punkte nacheinander ein.', 'Die x-Koordinate steht immer vorn.', `Beginne mit A: ${ps[0][0]} nach rechts und ${ps[0][1]} nach oben.`)); },
    () => { const ps = punkte(2, 10);
      return eintragen(Z(`Die Burg des Königs liegt bei B${P(ps[0])}.`, `Die Mühle liegt bei M${P(ps[1])}.`, 'Markiere beide Orte auf der Karte.'), 10, 10, ps, h3('Jeder Ort hat zwei Koordinaten.', 'Zum Punkt (2|7) gehst du 2 nach rechts und 7 nach oben.', `Die Burg: ${ps[0][0]} nach rechts und ${ps[0][1]} nach oben.`)); },
    () => { const [a] = punkte(1, 7, 7), d = wahl([[zz(2, 3), 0], [0, zz(2, 3)]]), z = plus(a, d);
      return gitterPunkte(Z('Schau dir den Punkt A an.', d[1] === 0 ? `Der Punkt P liegt ${d[0]} Einheiten rechts von A.` : `Der Punkt P liegt ${d[1]} Einheiten über A.`, 'Trage P ein.'), KS(10, 10, { punkte: [PT('A', ...a, 'lo')] }), [z], [[[tausch(z)], 'koord-vertauscht'], [[plus(a, tausch(d))], 'koord-vertauscht']],
        h3('Starte beim Punkt A, nicht in der Ecke.', 'Nach rechts ändert sich nur die x-Koordinate. Nach oben ändert sich nur die y-Koordinate.', d[1] === 0 ? `Geh von A aus ${d[0]} Kästchen nach rechts.` : `Geh von A aus ${d[1]} Kästchen nach oben.`), { nachweis: [{ art: 'versetzt', punkt: 'A', schritt: d }] }); },
    () => { const a = [zz(1, 4), zz(1, 4)], w = zz(3, 5), hh = suche(() => zz(2, 5), (z) => z !== w), ps = [a, plus(a, [w, 0]), plus(a, [w, hh]), plus(a, [0, hh])];
      return eintragen(Z('Trage vier Punkte ein.', `Es sind A${P(ps[0])}, B${P(ps[1])}, C${P(ps[2])} und D${P(ps[3])}.`, 'Verbinde sie in Gedanken zu einem Viereck.'), 10, 10, ps, h3('Trage die Punkte nacheinander ein.', 'Die x-Koordinate steht immer vorn.', 'Zur Kontrolle: Es entsteht ein Rechteck.'), { verbinden: true }); },
  ]);
  sechs(L_('K2'), 'M', [
    () => { const ps = punkte(3, 15, 12, (q) => q.some((p) => p[0] > 10));
      return eintragen(`Trage die Punkte A${P(ps[0])}, B${P(ps[1])} und C${P(ps[2])} ein.`, 15, 12, ps, h2('Die Kästchen sind klein. Achte bei großen Zahlen genau auf die richtige Linie.', 'Die x-Koordinate steht vorn: Gehe zuerst nach rechts, dann nach oben.')); },
    () => { const x = zz(8, 15), y = suche(() => zz(5, 12), (z) => z !== x), ps = [[x, 0], [0, y], [x, y]];
      return eintragen(`Trage die Punkte P${P(ps[0])}, Q${P(ps[1])} und R${P(ps[2])} ein.`, 15, 12, ps, h2('Zwei der Punkte liegen auf einer Achse.', 'Ist die y-Koordinate 0, liegt der Punkt auf der x-Achse.')); },
    () => { const x = suche(() => { const a = [zz(1, 10), zz(1, 8)], d = wahl([[4, 2], [6, 2], [2, 4], [4, 4], [6, 4], [2, 6], [8, 2]]); return { a, b: plus(a, d), m: plus(a, d.map((z) => z / 2)) }; }, (q) => drin(15, 12, q.b));
      return gitterPunkte('Trage den Mittelpunkt M der Strecke AB ein.', KS(15, 12, { linien: [LN(null, x.a, x.b, 'strecke')], punkte: [PT('A', ...x.a, 'lo'), PT('B', ...x.b, 'ro')] }), [x.m], [[[tausch(x.m)], 'koord-vertauscht']],
        h2('Der Mittelpunkt ist von A und von B gleich weit entfernt.', 'Gehe von A aus nur die Hälfte der Schritte nach rechts und nach oben.'), { nachweis: [{ art: 'mitte', von: 'A', nach: 'B' }] }); },
    () => { const a = [zz(1, 6), zz(1, 5)], w = zz(4, 8), hh = suche(() => zz(3, 6), (z) => z !== w), e = [a, plus(a, [w, 0]), plus(a, [w, hh]), plus(a, [0, hh])];
      return gitterPunkte(`Die Punkte A${P(e[0])}, B${P(e[1])} und C${P(e[2])} sind drei Ecken eines Rechtecks ABCD. Trage die vierte Ecke D ein.`, KS(15, 12, { punkte: [PT('A', ...e[0], 'lu'), PT('B', ...e[1], 'ru'), PT('C', ...e[2], 'ro')] }), [e[3]], [[[tausch(e[3])], 'koord-vertauscht']],
        h2('Im Rechteck liegen gegenüberliegende Seiten parallel und sind gleich lang.', 'D liegt genau über A und auf gleicher Höhe wie C.'), { verbinden: true, nachweis: [{ art: 'ergaenzen', ecken: e, typ: 'Rechteck' }] }); },
    () => { const [a] = punkte(1, 8, 11, ([q]) => q[1] >= 5), d = [zz(3, 6), -zz(2, 4)], z = plus(a, d);
      return gitterPunkte(`Die Burg liegt im Punkt B. Der Brunnen liegt ${d[0]} Einheiten rechts von der Burg und ${-d[1]} Einheiten unterhalb. Trage den Brunnen ein.`, KS(15, 12, { punkte: [PT('B', ...a, 'lo')] }), [z], [[[plus(a, [d[0], -d[1]])], 'sub-addiert'], [[plus(a, [d[1], d[0]])].filter((q) => q[0] >= 0), 'koord-vertauscht']],
        h2('Starte bei der Burg. Nach rechts wird die x-Koordinate größer, nach unten wird die y-Koordinate kleiner.', `Gehe von B aus ${d[0]} nach rechts und dann ${-d[1]} nach unten.`), { nachweis: [{ art: 'versetzt', punkt: 'B', schritt: d }, HILFSZAHL(-d[1], 'Schritte nach unten')] }); },
    () => { const a = [zz(1, 7), zz(1, 5)], s = zz(3, 6), e = [a, plus(a, [s, 0]), plus(a, [s, s]), plus(a, [0, s])], i = wahl([2, 3]), namen = 'ABCD';
      return gitterPunkte(`Drei Ecken eines Quadrats ABCD sind eingezeichnet. Trage die fehlende Ecke ${namen[i]} ein.`, KS(15, 12, { punkte: e.map((p, k) => PT(namen[k], ...p, ['lu', 'ru', 'ro', 'lo'][k])).filter((_, k) => k !== i) }), [e[i]], [],
        h2('Im Quadrat sind alle vier Seiten gleich lang, und alle Winkel sind rechte Winkel.', `Bestimme die Seitenlänge aus den Ecken A und B. Sie beträgt ${s} Einheiten.`), { verbinden: true, nachweis: [{ art: 'ergaenzen', ecken: e, typ: 'Quadrat' }, HILFSZAHL(s, 'Seitenlänge des Quadrats')] }); },
  ]);
  sechs(L_('K2'), 'E', [
    () => { const d = wahl([[2, 1], [1, 2], [3, 1], [2, 2], [3, 2], [1, 1]]), a = [zz(0, 3), zz(0, 2)], ps = [0, 1, 2, 3, 4].map((i) => plus(a, d, i));
      if (!drin(15, 12, ps[4])) return null;
      return gitterPunkte('Die Punkte A, B und C folgen einem Muster. Setze das Muster fort und trage die nächsten beiden Punkte D und E ein.', KS(15, 12, { punkte: benannt(ps.slice(0, 3)) }), ps.slice(3), [[[ps[3]], 'sach-schritt-vergessen']],
        h1('Untersuche getrennt, wie sich die x-Koordinate und wie sich die y-Koordinate von Punkt zu Punkt ändert.'), { nachweis: [{ art: 'muster', punkte: ['A', 'B', 'C'], anzahl: 2 }] }); },
    () => { const u = wahl([[2, 1], [1, 2], [3, 1], [2, 2], [3, 2]]), n = senk(u), e = suche(() => { const a = [zz(2, 12), zz(0, 8)]; return [a, plus(a, u), plus(plus(a, u), n), plus(a, n)]; }, (q) => drin(15, 12, ...q)), i = wahl([2, 3]), namen = 'ABCD';
      return gitterPunkte(`Drei Ecken eines Quadrats ABCD sind eingezeichnet. Das Quadrat liegt schräg. Trage die fehlende Ecke ${namen[i]} ein.`, KS(15, 12, { punkte: e.map((p, k) => PT(namen[k], ...p)).filter((_, k) => k !== i) }), [e[i]], [],
        h1('Bestimme das Schrittmuster einer Seite. Die Nachbarseite hat das um einen rechten Winkel gedrehte Muster.'), { verbinden: true, nachweis: [{ art: 'ergaenzen', ecken: e, typ: 'Quadrat' }] }); },
    () => { const x = suche(() => { const a = [zz(1, 8), zz(1, 7)], d = wahl([[2, 1], [3, 2], [1, 3], [4, 1], [2, 3], [3, -1], [2, -2]]); return { a, m: plus(a, d), b: plus(a, d, 2) }; }, (q) => drin(15, 12, q.b));
      return gitterPunkte('Der Punkt M ist der Mittelpunkt der Strecke AB. Der Punkt B fehlt. Trage B ein.', KS(15, 12, { punkte: [PT('A', ...x.a, 'lo'), PT('M', ...x.m, 'lo')] }), [x.b], [[[plus(x.a, minus(x.m, x.a).map((z) => z / 2)).map(Math.round)], 'sach-falsche-rechnung']].filter(([q]) => String(q[0]) !== String(x.m)),
        h1('Von A nach M geht es genauso weit nach rechts und nach oben wie von M nach B.'), { nachweis: [{ art: 'mitteUmkehr', von: 'A', mitte: 'M' }] }); },
    () => { const a = [zz(1, 5), zz(1, 4)], c = suche(() => [zz(8, 14), zz(6, 11)], (q) => q[0] - a[0] !== q[1] - a[1]);
      return gitterPunkte('Die Punkte A und C sind gegenüberliegende Ecken eines Rechtecks ABCD. Die Seiten des Rechtecks sind parallel zu den Achsen. Trage die Ecken B und D ein.', KS(15, 12, { punkte: [PT('A', ...a, 'lu'), PT('C', ...c, 'ro')] }), [[c[0], a[1]], [a[0], c[1]]], [[[[c[0], a[1]]], 'sach-schritt-vergessen'], [[[a[0], c[1]]], 'sach-schritt-vergessen']],
        h1('Die Ecke B hat die x-Koordinate von C und die y-Koordinate von A.'), { verbinden: false, nachweis: [{ art: 'achsenRechteck', a: 'A', c: 'C' }] }); },
    () => { const x = suche(() => { const s = [zz(3, 11), zz(3, 8)], [u, v] = wahl([[[1, 1], [1, -1]], [[2, 1], [1, -1]], [[1, 2], [2, -1]], [[1, 0], [1, 2]], [[3, 1], [1, -2]]]), k = [zz(1, 2), zz(2, 3), zz(1, 2), zz(2, 3)]; return { s, pts: [plus(s, u, -k[1]), plus(s, u, -k[0]), plus(s, v, k[3]), plus(s, v, k[2])] }; }, (q) => drin(15, 12, ...q.pts) && new Set(q.pts.map(String)).size === 4 && q.pts.every((p) => p[0] >= 1 && p[1] >= 1));
      return gitterPunkte('Die Gerade durch A und B und die Gerade durch C und D sind nicht gezeichnet. Trage ihren Schnittpunkt S ein.', KS(15, 12, { punkte: benannt(x.pts) }), [x.s], [[[tausch(x.s)], 'koord-vertauscht']],
        h1('Setze das Schrittmuster von A nach B über B hinaus fort, ebenso das von C nach D.'), { nachweis: [{ art: 'schnittpunkt', punkte: [['A', 'B'], ['C', 'D']] }] }); },
    () => { const fest = wahl(['x', 'y']), w = zz(3, 11), von = zz(1, 4), bis = von + zz(2, 4), soll = []; for (let k = von; k <= bis; k++) soll.push(fest === 'x' ? [w, k] : [k, w]);
      const quer = []; for (let k = von; k <= bis; k++) quer.push(fest === 'x' ? [k, w] : [w, k]);
      return gitterPunkte(`Trage alle Gitterpunkte ein, die die ${fest}-Koordinate ${w} haben und deren ${fest === 'x' ? 'y' : 'x'}-Koordinate mindestens ${von} und höchstens ${bis} ist.`, KS(15, 12), soll, [[quer, 'koord-vertauscht'], [soll.slice(1, -1), 'sach-schritt-vergessen']],
        h1('Überlege zuerst, auf welcher Linie alle gesuchten Punkte liegen. Die Grenzen gehören dazu.'), { nachweis: [{ art: 'bereich', fest, wert: w, von, bis }] }); },
  ]);
}
