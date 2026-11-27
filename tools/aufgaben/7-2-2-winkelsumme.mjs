// Aufgaben zu 7.2.2 „Winkelsumme im Dreieck“ (Lernziele S1 und S2) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25), Niveauübersicht K02: G gibt den Winkelsummensatz an und wendet ihn an, ohne Basiswinkelsatz
// (gleich große Winkel sind markiert). M begründet ihn, E nutzt Gleichungen, Fehlersuche und Beweisschritte.
// S1: fehlende Winkel berechnen. S2: Begründung mit der Parallelen und zusammengesetzte Figuren (Vierecke, Außenwinkel).
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, figur, dreieckAus, dreieckBild, viereckAus, viereckBild, plus, vek, WERT, GESUCHT, NAME, H, grad, auswahl, opt, luecken, lk, Z, sach, teil, teilWahl, ordnen, FIG, R, winkelFuer, dreiWinkel, drehFuer, kind } from './7-2-figur.mjs';

const S1 = '7.2.2-S1', S2 = '7.2.2-S2';
const ECKE = ['A', 'B', 'C'], NAMEN = { A: 'α', B: 'β', C: 'γ' };
const SUMME = 'Die drei Winkel im Dreieck sind zusammen 180°.';
const fl3 = (a, b) => [[360 - a - b, 'winkelsumme'], [a + b, 'winkelsumme'], [180 - a, 'winkelsumme']];
const hSumme = (n, a, b) => H(n, 'Im Dreieck sind die drei Winkel zusammen 180°.', 'α = 50° und β = 60°. Dann ist γ = 180° − 50° − 60° = 70°.', `Rechne 180° − ${a}° − ${b}°.`);
// Ein Dreieck mit den Winkeln w (bei A, B, C); gesucht ist der Winkel an der Ecke `ecke`.
function fehlt(n, w, ecke, text, o = {}) {
  const i = ECKE.indexOf(ecke), andere = [0, 1, 2].filter((k) => k !== i), E = dreieckAus(w[0], w[1], o.dreh ?? drehFuer(n));
  const zeige = Object.fromEntries(ECKE.map((p, k) => [p, k === i ? GESUCHT(NAMEN[p], w[k]) : WERT(w[k])]));
  const [x, y] = andere.map((k) => w[k]);
  return grad(text(NAMEN[ecke]), w[i], fl3(x, y), o.hilfen ?? hSumme(n, x, y), { bild: dreieckBild(E, zeige, o.bild), nachweis: [R(`180° − ${x}° − ${y}° = ${w[i]}°`), FIG(NAMEN[ecke])] });
}
const recht = (n, wo) => { const a = winkelFuer(n, 25, 65); const w = [0, 0, 0]; const rest = [0, 1, 2].filter((k) => k !== wo); w[wo] = 90; w[rest[0]] = a; w[rest[1]] = 90 - a; return w; };
const stumpf = (n) => dreiWinkel(n, { min: 20, max: 130, stumpf: true });

// ---------- S1: fehlende Winkel berechnen ----------
function s1() {
  sechs(S1, 'F', [
    () => fehlt('F', dreiWinkel('F'), 'C', (x) => Z(SUMME, `Berechne ${x}.`)),
    () => fehlt('F', dreiWinkel('F'), 'A', (x) => Z(SUMME, `Berechne ${x}.`)),
    () => fehlt('F', recht('F', 1), wahl(['A', 'C']), (x) => Z('Das Dreieck hat einen rechten Winkel.', SUMME, `Berechne ${x}.`)),
    () => fehlt('F', dreiWinkel('F'), 'B', (x) => Z(SUMME, `Berechne ${x}.`)),
    () => { const w = dreiWinkel('F'), E = dreieckAus(w[0], w[1], 0), s = w[0] + w[1];
      return luecken(Z('Rechne in zwei Schritten.', 'Zähle zuerst α und β zusammen.', 'Berechne dann γ.', 'α + β = {{s}}°', 'γ = {{g}}°'), { s: lk(s, [[180 - s, 'winkelsumme']]), g: lk(w[2], [[360 - s, 'winkelsumme'], [s, 'winkelsumme']]) }, hSumme('F', w[0], w[1]),
        { bild: dreieckBild(E, { A: WERT(w[0]), B: WERT(w[1]), C: GESUCHT('γ', w[2]) }), nachweis: [R(`${w[0]}° + ${w[1]}° = ${s}°`), R(`180° − ${s}° = ${w[2]}°`), FIG('γ', { luecke: 'g' })] }); },
    () => { const a = 10 * zz(4, 7), w = [a, a, 180 - 2 * a], E = dreieckAus(a, a, 0, 6);
      return grad(Z('Ein Dach hat die Form eines Dreiecks.', `Unten sind beide Winkel ${a}° groß.`, 'Berechne den Winkel γ oben am Giebel.'), w[2], fl3(a, a), hSumme('F', a, a),
        { bild: dreieckBild(E, { A: WERT(a), B: WERT(a), C: GESUCHT('γ', w[2]) }, { titel: 'Dachgiebel' }), nachweis: [R(`180° − ${a}° − ${a}° = ${w[2]}°`), FIG('γ')] }); },
  ]);
  sechs(S1, 'G', [
    () => fehlt('G', dreiWinkel('G'), wahl(ECKE), (x) => Z(SUMME, `Berechne ${x}.`)),
    () => fehlt('G', recht('G', zz(0, 2)), wahl(['A', 'B', 'C']), (x) => Z('Berechne den fehlenden Winkel.'), { bild: {} }),
    () => { const s = 5 * zz(4, 20), a = (180 - s) / 2; if (!Number.isInteger(a) || a < 25) return null;
      const E = dreieckAus(a, a, drehFuer('G'));
      return grad(Z('Die beiden markierten Winkel sind gleich groß.', `Der Winkel γ ist ${s}° groß.`, 'Berechne α.'), a, [[180 - s, 'winkelsumme'], [(360 - s) / 2, 'winkelsumme']],
        H('G', 'Nimm γ von 180° weg. Der Rest wird gerecht auf zwei Winkel verteilt.', 'γ = 40°: 180° − 40° = 140°, und 140° : 2 = 70°.', `Rechne 180° − ${s}° = ${180 - s}°. Teile dann durch 2.`),
        { bild: dreieckBild(E, { A: GESUCHT('α', a, { gleich: 1 }), B: WERT(a, { gleich: 1, frage: true, n: 'β' }), C: WERT(s) }), nachweis: [R(`180° − ${s}° = ${180 - s}°`), `${180 - s}° : 2 = ${a}°`, FIG('α')] }); },
    () => { const w = dreiWinkel('G');
      return grad(Z(`Im Dreieck ABC ist α = ${w[0]}° und β = ${w[1]}°.`, 'Berechne γ.'), w[2], fl3(w[0], w[1]), hSumme('G', w[0], w[1]),
        { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer('G')), { A: WERT(w[0]), B: WERT(w[1]), C: GESUCHT('γ', w[2]) }), nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), FIG('γ')] }); },
    () => { const art = wahl(['spitz', 'recht', 'stumpf']), w = art === 'recht' ? recht('G', 2) : art === 'stumpf' ? stumpf('G') : dreiWinkel('G', { max: 85 });
      if (art === 'stumpf' && w[2] <= 90) return null; if (art === 'spitz' && Math.max(...w) >= 90) return null;
      const ARTEN = { spitz: 'spitzwinklig', recht: 'rechtwinklig', stumpf: 'stumpfwinklig' };
      return sach(Z(`Im Dreieck ist α = ${w[0]}° und β = ${w[1]}°.`, 'Berechne γ.', 'Gib dann die Art des Dreiecks an.'), [teil('γ =', w[2], '°', fl3(w[0], w[1]).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung })).filter((f) => f.wert !== w[2])),
        teilWahl('antwort', 'Das Dreieck ist', Object.entries(ARTEN).map(([k, t]) => opt(t, k === art, k === art ? undefined : 'dreieck-art')))],
        H('G', 'Berechne zuerst γ. Schau dann auf den größten Winkel.', 'Ist ein Winkel größer als 90°, ist das Dreieck stumpfwinklig.', `γ = 180° − ${w[0]}° − ${w[1]}° = ${w[2]}°.`),
        { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer('G')), { A: WERT(w[0]), B: WERT(w[1]), C: NAME('γ') }), nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), { art: 'klasse', winkel: w, teil: 1 }] }); },
    () => { const k = kind(), [a, b] = wahl([[90, 90], [100, 90], [95, 100], [120, 70]]);
      return auswahl(Z(`${k} will ein Dreieck mit α = ${a}° und β = ${b}° zeichnen.`, 'Das klappt nicht.', 'Kreuze die richtige Begründung an.'),
        [opt(`α und β sind zusammen schon ${a + b}°. Für γ bleibt nichts übrig.`, true), opt('Die Winkel sind zu groß zum Zeichnen.', false, 'winkelsumme'), opt(`Die drei Winkel ergeben zusammen 360°. Dann ist γ = ${360 - a - b}°.`, false, 'winkelsumme')],
        H('G', 'Zähle α und β zusammen. Vergleiche mit 180°.', 'α = 100° und β = 90° sind schon 190°.', `${a}° + ${b}° = ${a + b}°.`), { nachweis: [R(`${a}° + ${b}° = ${a + b}°`), { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(S1, 'M', [
    () => fehlt('M', dreiWinkel('M', { min: 20, max: 120 }), wahl(ECKE), (x) => `${SUMME} Berechne ${x}.`),
    () => { const w = dreiWinkel('M', { min: 25, max: 110 }), E = dreieckAus(w[0], w[1], drehFuer('M')), D = plus(E.C, vek(E.A, E.C), 0.45), aw = 180 - w[2];
      return grad('Die Seite b ist über C hinaus verlängert. Berechne den Außenwinkel δ bei C.', aw, [[w[2], 'nebenwinkel-gleich'], [180 - w[0], 'winkelsumme']],
        H('M', 'Berechne zuerst γ. Der Außenwinkel ist der Nebenwinkel von γ.', `γ = 180° − ${w[0]}° − ${w[1]}° = ${w[2]}°.`),
        { bild: dreieckBild(E, { A: WERT(w[0]), B: WERT(w[1]) }, { extra: { punkte: { D }, versteckt: ['D'], linien: [['C', 'D']], winkel: [['C', 'D', 'B', { n: 'δ', wert: aw, frage: true, farbe: 2 }]] } }),
          nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), R(`180° − ${w[2]}° = ${aw}°`), FIG('δ')] }); },
    () => { const w = dreiWinkel('M', { min: 25, max: 110 }), E = dreieckAus(w[0], w[1], drehFuer('M')), D = plus(E.B, vek(E.A, E.B), 0.45), aw = 180 - w[1];
      return grad(`Die Seite c ist über B hinaus verlängert. Der Außenwinkel bei B ist ${aw}° groß. Berechne γ.`, w[2], [[180 - w[0] - aw, 'nebenwinkel-gleich'], [aw, 'nebenwinkel-gleich']],
        H('M', 'Berechne zuerst β als Nebenwinkel des Außenwinkels.', `β = 180° − ${aw}° = ${w[1]}°.`),
        { bild: dreieckBild(E, { A: WERT(w[0]), C: GESUCHT('γ', w[2]) }, { extra: { punkte: { D }, versteckt: ['D'], linien: [['B', 'D']], winkel: [['B', 'D', 'C', { wert: aw, farbe: 1 }]] } }),
          nachweis: [R(`180° − ${aw}° = ${w[1]}°`), R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), FIG('γ')] }); },
    () => { const w = recht('M', zz(0, 2)), i = w.indexOf(90), j = wahl([0, 1, 2].filter((k) => k !== i)), m = 3 - i - j, nm = { [j]: 'p', [m]: 'q' };
      const E = dreieckAus(w[0], w[1], drehFuer('M'));
      return luecken(Z(`Im Dreieck ABC ist ${NAMEN[ECKE[i]]} = 90° und ${NAMEN[ECKE[j]]} = ${w[j]}°. Berechne den dritten Winkel.`, `${NAMEN[ECKE[m]]} = {{q}}°`), { q: lk(w[m], [[180 - w[j], 'winkelsumme'], [270 - w[j], 'winkelsumme']]) },
        H('M', 'Im rechtwinkligen Dreieck sind die beiden anderen Winkel zusammen 90°.', `90° − ${w[j]}° = ${w[m]}°.`),
        { bild: dreieckBild(E, { [ECKE[i]]: WERT(90), [ECKE[j]]: WERT(w[j]), [ECKE[m]]: GESUCHT(NAMEN[ECKE[m]], w[m]) }), nachweis: [R(`180° − 90° − ${w[j]}° = ${w[m]}°`), FIG(NAMEN[ECKE[m]], { luecke: 'q' })] }); },
    () => { const a = zz(62, 78), b = 90 - a, E = dreieckAus(a, 90, 0, 3);
      return grad(`Eine Leiter lehnt an einer senkrechten Wand. Mit dem Boden bildet sie einen Winkel von ${a}°. Berechne den Winkel zwischen Leiter und Wand.`, b, [[180 - a, 'winkelsumme'], [90 + a, 'winkelsumme']],
        H('M', 'Boden, Wand und Leiter bilden ein rechtwinkliges Dreieck.', `180° − 90° − ${a}° = ${b}°.`),
        { bild: dreieckBild(E, { A: WERT(a), B: WERT(90), C: GESUCHT('γ', b) }, { titel: 'Leiter an der Wand' }), nachweis: [R(`180° − 90° − ${a}° = ${b}°`), FIG('γ')] }); },
    () => { const k = kind(), w = dreiWinkel('M', { min: 25, max: 100 }), d = wahl([-6, -4, 4, 6, 10]), f = [w[0], w[1], w[2] + d];
      return auswahl(`${k} hat in einem Dreieck gemessen: α = ${f[0]}°, β = ${f[1]}° und γ = ${f[2]}°. Überprüfe, ob das stimmen kann. Kreuze die richtige Antwort an.`,
        [opt(`Nein. Zusammen sind das ${180 + d}°, im Dreieck müssen es genau 180° sein.`, true), opt('Ja. Gemessene Winkel dürfen zusammen ungefähr 180° ergeben.', false, 'winkelsumme'), opt('Ja. Jeder Winkel ist kleiner als 180°.', false, 'winkelsumme'), opt(`Nein. Zusammen müssten es 360° sein.`, false, 'winkelsumme')],
        H('M', 'Zähle die drei Winkel zusammen.', `${f[0]}° + ${f[1]}° + ${f[2]}° = ${180 + d}°.`), { nachweis: [R(`${f[0]}° + ${f[1]}° + ${f[2]}° = ${180 + d}°`), { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(S1, 'E', [
    () => { const w = dreiWinkel('E', { min: 15, max: 125 });
      return grad(`Im Dreieck ABC ist β = ${w[1]}° und γ = ${w[2]}°. Bestimme α.`, w[0], fl3(w[1], w[2]), H('E', 'Ziehe die beiden bekannten Winkel von 180° ab.'),
        { nachweis: [R(`180° − ${w[1]}° − ${w[2]}° = ${w[0]}°`)] }); },
    () => { const g = suche(() => zz(30, 120), (x) => (180 - x) % 3 === 0 && x !== 60), a = (180 - g) / 3, E = dreieckAus(a, 2 * a, drehFuer('E'));
      return grad(`Im Dreieck ABC ist β doppelt so groß wie α. Es ist γ = ${g}°. Bestimme α.`, a, [[(180 - g) / 2, 'winkelsumme'], [2 * a, 'seite-ecke-vertauscht']],
        H('E', 'α und β sind zusammen drei gleich große Teile.'), { bild: dreieckBild(E, { A: GESUCHT('α', a), B: NAME('β'), C: WERT(g) }), nachweis: [R(`180° − ${g}° = ${180 - g}°`), `${180 - g}° : 3 = ${a}°`, FIG('α')] }); },
    () => { const [g, d] = suche(() => [zz(30, 110), 2 * zz(3, 20)], ([x, y]) => (180 - x - y) % 2 === 0 && (180 - x - y) / 2 >= 15), a = (180 - g - d) / 2, E = dreieckAus(a, a + d, drehFuer('E'));
      return grad(`Im Dreieck ABC ist β um ${d}° größer als α. Es ist γ = ${g}°. Bestimme α.`, a, [[(180 - g) / 2, 'winkelsumme'], [a + d, 'seite-ecke-vertauscht']],
        H('E', `Nimm von α + β zuerst die ${d}° weg. Dann bleiben zwei gleich große Teile.`), { bild: dreieckBild(E, { A: GESUCHT('α', a), B: NAME('β'), C: WERT(g) }), nachweis: [R(`180° − ${g}° − ${d}° = ${180 - g - d}°`), `${180 - g - d}° : 2 = ${a}°`, FIG('α')] }); },
    () => { const w = dreiWinkel('E', { min: 25, max: 100 }), k = kind();
      return auswahl(`${k} rechnet: „γ = 360° − ${w[0]}° − ${w[1]}° = ${360 - w[0] - w[1]}°.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt(`Im Dreieck sind die Winkel zusammen 180°, nicht 360°. Richtig ist γ = ${w[2]}°.`, true), opt('Die Rechnung stimmt, weil ein Kreis 360° hat und die Ecken zusammen einen Kreis bilden.', false, 'gestreckt-voll'), opt(`Man muss addieren: γ = ${w[0]}° + ${w[1]}° = ${w[0] + w[1]}°.`, false, 'winkelsumme'), opt('Man darf γ nur messen, nicht rechnen.', false, 'winkelsumme')],
        H('E', 'Prüfe: Ergeben die drei Winkel mit dem Ergebnis zusammen 180°?'), { nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), { art: 'urteil', stimmt: false }] }); },
    () => { const w = dreiWinkel('E', { min: 25, max: 110 }), aa = 180 - w[0], ab = 180 - w[1], E = dreieckAus(w[0], w[1], drehFuer('E'));
      const D1 = plus(E.A, vek(E.B, E.A), 0.35), D2 = plus(E.B, vek(E.A, E.B), 0.35);
      return grad(`Die Seite c ist nach beiden Seiten verlängert. Die Außenwinkel bei A und B sind ${aa}° und ${ab}° groß. Bestimme γ.`, w[2], [[aa + ab, 'winkelsumme'], [360 - aa - ab, 'nebenwinkel-gleich']],
        H('E', 'Berechne zuerst α und β als Nebenwinkel der Außenwinkel.'),
        { bild: dreieckBild(E, { C: GESUCHT('γ', w[2]) }, { extra: { punkte: { D1, D2 }, versteckt: ['D1', 'D2'], linien: [['A', 'D1'], ['B', 'D2']], winkel: [['A', 'D1', 'C', { wert: aa, farbe: 0 }], ['B', 'D2', 'C', { wert: ab, farbe: 1 }]] } }),
          nachweis: [R(`180° − ${aa}° = ${w[0]}°`), R(`180° − ${ab}° = ${w[1]}°`), R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), FIG('γ')] }); },
    () => { const [x, k] = wahl([[2, 3], [1, 2], [1, 3], [2, 5], [1, 4], [3, 5], [2, 7], [1, 5]]), t = 180 / (x + k + 1); if (!Number.isInteger(t)) return null;
      const w = [x * t, k * t, t];
      return grad(`In einem Dreieck ist α ${x === 1 ? 'genauso groß wie γ' : `${x}-mal so groß wie γ`}, und β ist ${k}-mal so groß wie γ. Bestimme γ.`, t, [[180 / (x + k), 'winkelsumme'], [360 / (x + k + 1), 'winkelsumme']].filter(([w]) => Number.isInteger(w)),
        H('E', 'Zähle, aus wie vielen gleich großen Teilen der Größe γ die drei Winkel zusammen bestehen.'), { nachweis: [`180° : ${x + k + 1} = ${t}°`, R(`${w[0]}° + ${w[1]}° + ${w[2]}° = 180°`)] }); },
  ]);
}

// ---------- S2: Winkelsumme begründen, zusammengesetzte Figuren ----------
// Dreieck mit der Parallelen zu AB durch C: links bei C der Wechselwinkel zu α, rechts der zu β.
function mitParallele(E, zeige, o = {}) {
  const u = vek(E.A, E.B), L = Math.hypot(...u), e = [u[0] / L, u[1] / L];
  const P = plus(E.C, e, -2.4), Q = plus(E.C, e, 2.4);
  const winkel = [zeige.links && ['C', 'P', 'A', { farbe: 0, ...zeige.links }], zeige.mitte && ['C', 'A', 'B', { farbe: 2, ...zeige.mitte }], zeige.rechts && ['C', 'B', 'Q', { farbe: 1, ...zeige.rechts }]].filter(Boolean);
  return dreieckBild(E, o.ecken ?? {}, { extra: { punkte: { P, Q }, versteckt: ['P', 'Q'], linien: [['P', 'Q', { n: 'p', stil: 'hilfs' }]], winkel } });
}
// Dreieck ABC mit einem Punkt D auf AB und der Strecke CD.
function geteilt(n) {
  return suche(() => { const a = winkelFuer(n, 35, 70), b = winkelFuer(n, 35, 70), d = winkelFuer(n, 60, 120); return { a, b, d, x: 180 - a - d, y: d - b, e: 180 - d }; },
    (t) => t.x >= 20 && t.y >= 20 && t.a + t.b < 140);
}
function geteiltBild(n, t, zeige) {
  const E = dreieckAus(t.a, t.b, n === 'F' ? 0 : drehFuer(n), 6);
  // D auf AB mit Winkel ADC = d: Abstand von A aus dem Sinussatz im Dreieck ADC.
  const AC = Math.hypot(...vek(E.A, E.C)), AD = (AC * Math.sin((t.x * Math.PI) / 180)) / Math.sin((t.d * Math.PI) / 180);
  const D = plus(E.A, vek(E.A, E.B), AD / Math.hypot(...vek(E.A, E.B)));
  const w = { a: ['A', 'B', 'C'], b: ['B', 'C', 'A'], d: ['D', 'A', 'C'], e: ['D', 'C', 'B'], x: ['C', 'A', 'D'], y: ['C', 'D', 'B'] };
  return figur({ punkte: { ...E, D }, linien: [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D']], winkel: Object.entries(zeige).map(([k, o], i) => [...w[k], { farbe: i % 4, ...o }]) });
}
function s2() {
  const hPar = (n) => H(n, 'An der Geraden p liegen bei C drei Winkel nebeneinander. Zusammen sind sie 180°.', 'Links liegt 50°, rechts 60°. Dann ist der mittlere Winkel 180° − 50° − 60° = 70°.', 'Der linke Winkel ist so groß wie α, der rechte so groß wie β.');
  const hVier = (n) => H(n, n === 'F' ? 'Die Linie AC teilt das Viereck in zwei Dreiecke.' : 'Eine Diagonale teilt das Viereck in zwei Dreiecke.', 'Zwei Dreiecke haben zusammen 180° + 180° = 360°.', 'Ziehe die drei bekannten Winkel von 360° ab.');
  const vier = (n) => suche(() => [winkelFuer(n, 25, 70), winkelFuer(n, 25, 70), winkelFuer(n, 25, 70), winkelFuer(n, 25, 70)], ([a1, c1, a2, c2]) => a1 + c1 <= 130 && a2 + c2 <= 130 && a1 + a2 >= 60 && c1 + c2 >= 60);
  const viereckFehlt = (n, text, hilfen) => { const [a1, c1, a2, c2] = vier(n), W = { A: a1 + a2, B: 180 - a1 - c1, C: c1 + c2, D: 180 - a2 - c2 }, p = wahl(['A', 'B', 'C', 'D']), nm = { A: 'α', B: 'β', C: 'γ', D: 'δ' };
    const andere = Object.keys(W).filter((k) => k !== p), s = andere.reduce((x, k) => x + W[k], 0);
    return grad(text(nm[p]), W[p], [[180 - s > 0 ? 180 - s : 0, 'winkelsumme'], [540 - s, 'winkelsumme']].filter(([x]) => x > 0), hilfen,
      { bild: viereckBild(viereckAus(a1, c1, a2, c2, drehFuer(n)), Object.fromEntries(Object.keys(W).map((k) => [k, k === p ? GESUCHT(nm[k], W[k]) : WERT(W[k])]))), nachweis: [R(`360° − ${andere.map((k) => `${W[k]}°`).join(' − ')} = ${W[p]}°`), FIG(nm[p])] }); };
  sechs(S2, 'F', [
    () => { const w = dreiWinkel('F', { max: 90 }), E = dreieckAus(w[0], w[1], 0);
      return grad(Z('Die Gerade p ist parallel zu AB.', 'Bei C liegen drei Winkel an p.', 'Zusammen sind sie 180°.', 'Berechne γ.'), w[2], fl3(w[0], w[1]), hPar('F'),
        { bild: mitParallele(E, { links: WERT(w[0]), mitte: GESUCHT('γ', w[2]), rechts: WERT(w[1]) }), nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), FIG('γ')] }); },
    () => { const [a1, c1, a2, c2] = vier('F');
      return auswahl(Z('Die Linie AC teilt das Viereck in zwei Dreiecke.', 'Wie groß sind alle Winkel im Viereck zusammen?', 'Kreuze an.'), [opt('180°', false, 'winkelsumme'), opt('360°', true), opt('540°', false, 'winkelsumme')], hVier('F'),
        { bild: viereckBild(viereckAus(a1, c1, a2, c2, 0), {}, { linien: [['A', 'C', { stil: 'hilfs' }]] }), nachweis: [R('180° + 180° = 360°')] }); },
    () => { const t = geteilt('F');
      return grad(Z('Schau auf das linke Dreieck ADC.', SUMME, 'Berechne den Winkel bei C.'), t.x, fl3(t.a, t.d), hSumme('F', t.a, t.d),
        { bild: geteiltBild('F', t, { a: WERT(t.a), d: WERT(t.d), x: GESUCHT('φ', t.x) }), nachweis: [R(`180° − ${t.a}° − ${t.d}° = ${t.x}°`), FIG('φ')] }); },
    () => { const k = kind(), w = dreiWinkel('F', { max: 90 }), d = wahl([10, 20, -10]), f = [w[0], w[1], w[2] + d];
      return auswahl(Z(`${k} misst die Winkel in einem Dreieck.`, `α = ${f[0]}°, β = ${f[1]}°, γ = ${f[2]}°`, `Hat ${k} richtig gemessen?`, 'Kreuze an.'), [opt(`Nein. Zusammen sind das ${180 + d}° und nicht 180°.`, true), opt('Ja. Die Winkel sehen richtig aus.', false, 'winkelsumme'), opt(`Ja. Zusammen sind es ${180 + d}°. Das passt.`, false, 'winkelsumme')],
        H('F', 'Zähle die drei Winkel zusammen.', 'Im Dreieck müssen es genau 180° sein.', `${f[0]}° + ${f[1]}° + ${f[2]}° = ${180 + d}°.`), { bild: dreieckBild(dreieckAus(w[0], w[1], drehFuer('F')), { A: NAME('α'), B: NAME('β'), C: NAME('γ') }), nachweis: [R(`${f[0]}° + ${f[1]}° + ${f[2]}° = ${180 + d}°`), { art: 'urteil', stimmt: false }] }); },
    () => { const t = geteilt('F');
      return luecken(Z('Rechne in zwei Schritten.', 'Berechne zuerst den Nebenwinkel ε bei D.', 'Berechne dann φ im rechten Dreieck.', 'ε = {{e}}°', 'φ = {{y}}°'), { e: lk(t.e, [[t.d, 'nebenwinkel-gleich']]), y: lk(t.y, [[180 - t.b - t.d, 'nebenwinkel-gleich']]) },
        H('F', 'ε und der Winkel bei D liegen nebeneinander an AB. Zusammen sind sie 180°.', 'Ist der linke Winkel bei D 100°, ist ε = 80°.', `ε = 180° − ${t.d}° = ${t.e}°.`),
        { bild: geteiltBild('F', t, { d: WERT(t.d), e: GESUCHT('ε', t.e), b: WERT(t.b), y: GESUCHT('φ', t.y) }), nachweis: [R(`180° − ${t.d}° = ${t.e}°`), R(`180° − ${t.e}° − ${t.b}° = ${t.y}°`), FIG('ε', { luecke: 'e' }), FIG('φ', { luecke: 'y' })] }); },
    () => { const a = 10 * zz(3, 6), E = dreieckAus(a, 90, 0, 4);
      return grad(Z('Ein Fachwerk hat eine schräge Strebe.', 'Sie bildet mit dem Balken unten einen rechten Winkel.', 'Berechne den Winkel γ oben.'), 90 - a, fl3(a, 90), hSumme('F', a, 90),
        { bild: dreieckBild(E, { A: WERT(a), B: WERT(90), C: GESUCHT('γ', 90 - a) }, { titel: 'Fachwerk' }), nachweis: [R(`180° − ${a}° − 90° = ${90 - a}°`), FIG('γ')] }); },
  ]);
  sechs(S2, 'G', [
    () => { const w = dreiWinkel('G', { max: 95 }), E = dreieckAus(w[0], w[1], drehFuer('G'));
      return grad(Z('Die Gerade p ist parallel zu AB.', 'Berechne γ mit den Winkeln an p.'), w[2], fl3(w[0], w[1]), hPar('G'),
        { bild: mitParallele(E, { links: WERT(w[0]), mitte: GESUCHT('γ', w[2]), rechts: WERT(w[1]) }), nachweis: [R(`180° − ${w[0]}° − ${w[1]}° = ${w[2]}°`), FIG('γ')] }); },
    () => viereckFehlt('G', (x) => Z('Im Viereck sind alle Winkel zusammen 360°.', `Berechne ${x}.`), hVier('G')),
    () => { const t = geteilt('G');
      return luecken(Z('Berechne die Winkel ε und φ.', 'ε = {{e}}°', 'φ = {{y}}°'), { e: lk(t.e, [[t.d, 'nebenwinkel-gleich']]), y: lk(t.y, [[180 - t.b - t.d, 'nebenwinkel-gleich']]) },
        H('G', 'Beginne bei D: ε ist der Nebenwinkel.', 'Ist der Winkel bei D 100°, ist ε = 80°.', `ε = 180° − ${t.d}° = ${t.e}°.`),
        { bild: geteiltBild('G', t, { d: WERT(t.d), e: GESUCHT('ε', t.e), b: WERT(t.b), y: GESUCHT('φ', t.y) }), nachweis: [R(`180° − ${t.d}° = ${t.e}°`), R(`180° − ${t.e}° − ${t.b}° = ${t.y}°`), FIG('ε', { luecke: 'e' }), FIG('φ', { luecke: 'y' })] }); },
    () => { const t = geteilt('G');
      return grad(Z('Schau auf das Dreieck ADC.', 'Berechne den Winkel φ bei C.'), t.x, fl3(t.a, t.d), hSumme('G', t.a, t.d),
        { bild: geteiltBild('G', t, { a: WERT(t.a), d: WERT(t.d), x: GESUCHT('φ', t.x) }), nachweis: [R(`180° − ${t.a}° − ${t.d}° = ${t.x}°`), FIG('φ')] }); },
    () => { const n = wahl([5, 6]), s = (n - 2) * 180;
      return auswahl(Z(`Ein ${n === 5 ? 'Fünfeck' : 'Sechseck'} lässt sich in ${n - 2} Dreiecke zerlegen.`, 'Wie groß sind alle Winkel zusammen?', 'Kreuze an.'), [opt(`${s}°`, true), opt('360°', false, 'winkelsumme'), opt(`${n * 180}°`, false, 'winkelsumme')],
        H('G', 'Jedes Dreieck hat 180°.', 'Zwei Dreiecke haben 2 · 180° = 360°.', `Rechne ${n - 2} · 180°.`), { nachweis: [`${n} − 2 = ${n - 2}`, `${n - 2} · 180° = ${s}°`] }); },
    () => { const w = dreiWinkel('G', { max: 95 }), E = dreieckAus(w[0], w[1], drehFuer('G'));
      return auswahl(Z('Die Gerade p ist parallel zu AB.', 'Warum ist der linke Winkel an p so groß wie α?', 'Kreuze die richtige Begründung an.'),
        [opt('Die beiden Winkel sind Wechselwinkel an Parallelen.', true), opt('Die beiden Winkel sind Nebenwinkel an einer Geraden.', false, 'scheitel-neben-verwechselt'), opt('Alle Winkel im Bild sind gleich groß.', false, 'stufen-wechsel-verwechselt')],
        H('G', 'Die Geraden p und AB sind parallel. Die Seite b schneidet beide.', 'Wechselwinkel bilden zusammen ein Z.', 'Fahre mit dem Finger von α zum linken Winkel an p.'),
        { bild: mitParallele(E, { links: NAME('α′') }, { ecken: { A: NAME('α') } }), nachweis: [{ art: 'beziehung', paar: ['α', 'α′'], welche: 'wechsel' }] }); },
  ]);
  sechs(S2, 'M', [
    () => viereckFehlt('M', (x) => `Berechne ${x} im Viereck ABCD.`, hVier('M')),
    () => { const w = dreiWinkel('M', { max: 100 }), E = dreieckAus(w[0], w[1], drehFuer('M'));
      return sach('Die Gerade p ist parallel zu AB. Begründe, warum α + β + γ = 180° ist. Wähle die passenden Gründe.',
        [teilWahl('antwort', 'Der linke Winkel an p ist so groß wie α, denn es sind', [opt('Wechselwinkel', true), opt('Nebenwinkel', false, 'scheitel-neben-verwechselt'), opt('Scheitelwinkel', false, 'scheitel-neben-verwechselt')]),
          teilWahl('antwort', 'Der rechte Winkel an p ist so groß wie β, denn es sind', [opt('Wechselwinkel', true), opt('Stufenwinkel', false, 'stufen-wechsel-verwechselt'), opt('Nebenwinkel', false, 'scheitel-neben-verwechselt')]),
          teilWahl('antwort', 'Die drei Winkel an p sind zusammen 180°, denn', [opt('sie bilden einen gestreckten Winkel', true), opt('sie bilden einen Vollwinkel', false, 'gestreckt-voll'), opt('sie sind gleich groß', false, 'nebenwinkel-gleich')])],
        H('M', 'Die Seiten b und a schneiden die Parallelen p und AB.', 'Wechselwinkel bilden ein Z.'),
        { bild: mitParallele(E, { links: NAME('α′'), mitte: NAME('γ'), rechts: NAME('β′') }, { ecken: { A: NAME('α'), B: NAME('β') } }), nachweis: [{ art: 'beziehung', paar: ['α', 'α′'], welche: 'wechsel', teil: 0 }, { art: 'beziehung', paar: ['β', 'β′'], welche: 'wechsel', teil: 1 }] }); },
    () => { const t = geteilt('M');
      return grad('Berechne den Winkel φ im Dreieck DBC.', t.y, [[180 - t.b - t.d, 'nebenwinkel-gleich'], [t.d - t.b === t.y ? 0 : t.d - t.b, 'winkelsumme']].filter(([x]) => x > 0),
        H('M', 'Berechne zuerst den Nebenwinkel bei D.', `180° − ${t.d}° = ${t.e}°.`),
        { bild: geteiltBild('M', t, { d: WERT(t.d), b: WERT(t.b), y: GESUCHT('φ', t.y) }), nachweis: [R(`180° − ${t.d}° = ${t.e}°`), R(`180° − ${t.e}° − ${t.b}° = ${t.y}°`), FIG('φ')] }); },
    () => { const n = wahl([5, 6, 7, 8]), s = (n - 2) * 180;
      return grad(`Von einer Ecke aus zerlegen die Diagonalen ein ${n}-Eck in Dreiecke. Berechne die Winkelsumme im ${n}-Eck.`, s, [[n * 180, 'winkelsumme'], [360, 'winkelsumme'], [(n - 1) * 180, 'winkelsumme']],
        H('M', `Zähle die Dreiecke. Ein ${n}-Eck zerfällt in ${n - 2} Dreiecke.`, `${n - 2} · 180°.`), { nachweis: [`${n} − 2 = ${n - 2}`, `${n - 2} · 180° = ${s}°`] }); },
    () => { const w = dreiWinkel('M', { min: 25, max: 105 }), E = dreieckAus(w[0], w[1], drehFuer('M')), D = plus(E.C, vek(E.B, E.C), 0.45), aw = w[0] + w[1];
      return grad(`Die Seite a ist über C hinaus verlängert. Berechne den Außenwinkel ε bei C, ohne γ zu berechnen.`, aw, [[w[2], 'nebenwinkel-gleich'], [180 - w[0], 'winkelsumme']],
        H('M', 'Der Außenwinkel ist so groß wie die beiden Innenwinkel, die nicht an C liegen.', `${w[0]}° + ${w[1]}°.`),
        { bild: dreieckBild(E, { A: WERT(w[0]), B: WERT(w[1]) }, { extra: { punkte: { D }, versteckt: ['D'], linien: [['C', 'D']], winkel: [['C', 'D', 'A', { n: 'ε', wert: aw, frage: true, farbe: 2 }]] } }), nachweis: [R(`${w[0]}° + ${w[1]}° = ${aw}°`), FIG('ε')] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Ein Viereck hat die Winkelsumme 360°, weil man es in vier Dreiecke zerlegen kann.“ Überprüfe die Begründung. Kreuze die richtige Antwort an.`,
        [opt('Falsch begründet. Eine Diagonale zerlegt es in zwei Dreiecke: 2 · 180° = 360°.', true), opt('Richtig. 4 · 90° = 360°.', false, 'winkelsumme'), opt('Richtig. Das Viereck besteht aus vier Dreiecken, und die haben zusammen 360°.', false, 'winkelsumme'), opt('Falsch. Ein Viereck hat die Winkelsumme 720°.', false, 'winkelsumme')],
        H('M', 'Rechne nach: Wie viel Grad haben vier Dreiecke zusammen?', '4 · 180° = 720°.'), { nachweis: ['4 · 180° = 720°', '2 · 180° = 360°', { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(S2, 'E', [
    () => { const [a1, c1, a2, c2] = vier('E'), W = { A: a1 + a2, B: 180 - a1 - c1, C: c1 + c2, D: 180 - a2 - c2 }, x = W.A - W.C; if (Math.abs(x) < 4) return null;
      return grad(`Im Viereck ABCD ist β = ${W.B}° und δ = ${W.D}°. Der Winkel α ist um ${x > 0 ? x : -x}° ${x > 0 ? 'größer' : 'kleiner'} als γ. Bestimme γ.`, W.C, [[W.A, 'seite-ecke-vertauscht'], [(360 - W.B - W.D) / 2, 'seite-ecke-vertauscht']].filter(([v]) => Number.isInteger(v)),
        H('E', 'α und γ sind zusammen 360° − β − δ. Verteile den Rest wie bei einer Summe mit Unterschied.'),
        { bild: viereckBild(viereckAus(a1, c1, a2, c2, drehFuer('E')), { A: NAME('α'), B: WERT(W.B), C: GESUCHT('γ', W.C), D: WERT(W.D) }), nachweis: [R(`360° − ${W.B}° − ${W.D}° = ${W.A + W.C}°`), R(`${W.A + W.C}° ${x > 0 ? '−' : '+'} ${Math.abs(x)}° = ${2 * W.C}°`), `${2 * W.C}° : 2 = ${W.C}°`, FIG('γ')] }); },
    () => { const n = suche(() => zz(5, 12), (x) => ((x - 2) * 180) % x === 0), s = ((n - 2) * 180) / n;
      return grad(`Ein regelmäßiges ${n}-Eck hat lauter gleich große Winkel. Bestimme die Größe eines Winkels.`, s, [[360 / n, 'winkelsumme'], [180 * n / n === s ? 0 : (n * 180) / n, 'winkelsumme']].filter(([v]) => Number.isInteger(v) && v > 0 && v !== s),
        H('E', `Berechne zuerst die Winkelsumme im ${n}-Eck.`), { nachweis: [`${n - 2} · 180° = ${(n - 2) * 180}°`, `${(n - 2) * 180}° : ${n} = ${s}°`] }); },
    () => { const t = geteilt('E');
      return grad('Im Dreieck ABC liegt D auf der Seite AB. Bestimme den Winkel φ bei C im Dreieck DBC.', t.y, [[180 - t.b - t.d, 'nebenwinkel-gleich']],
        H('E', 'Arbeite dich über den Winkel bei D ins rechte Dreieck.'),
        { bild: geteiltBild('E', t, { a: WERT(t.a), x: WERT(t.x), b: WERT(t.b), y: GESUCHT('φ', t.y) }), nachweis: [R(`180° − ${t.a}° − ${t.x}° = ${t.d}°`), R(`180° − ${t.d}° = ${t.e}°`), R(`180° − ${t.e}° − ${t.b}° = ${t.y}°`), FIG('φ')] }); },
    () => { const k = kind();
      return auswahl(`${k} begründet: „Ich habe in drei Dreiecken die Winkel gemessen. Immer kam 180° heraus. Also gilt der Winkelsummensatz.“ Beurteile die Begründung. Kreuze die richtige Antwort an.`,
        [opt('Messen zeigt nur Beispiele. Ein Beweis muss für jedes Dreieck gelten, zum Beispiel mit Wechselwinkeln an einer Parallelen.', true), opt('Drei Beispiele reichen als Beweis.', false, 'winkelsumme'), opt('Die Begründung ist richtig, wenn man genau misst. Dann zeigen drei verschiedene Dreiecke, dass es immer gilt.', false, 'winkelsumme'), opt('Man müsste in vier Dreiecken messen.', false, 'winkelsumme'), opt('Der Satz gilt nur für gemessene Dreiecke.', false, 'winkelsumme')],
        H('E', 'Gilt eine Aussage für alle Dreiecke, wenn sie für drei stimmt?'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const w = dreiWinkel('E', { min: 25, max: 110 });
      return grad('Bestimme die Summe der drei Außenwinkel eines Dreiecks (an jeder Ecke einer).', 360, [[180, 'winkelsumme'], [540, 'gestreckt-voll']],
        H('E', `Jeder Außenwinkel ist 180° minus Innenwinkel. Probiere es an α = ${w[0]}°, β = ${w[1]}°, γ = ${w[2]}°.`), { nachweis: ['3 · 180° = 540°', R('540° − 180° = 360°')] }); },
    () => { const w = dreiWinkel('E', { max: 100 });
      return ordnen('Die Gerade p ist parallel zu AB und geht durch C. Beweise den Winkelsummensatz. Ordne die Schritte.',
        ['Zeichne durch C die Parallele p zu AB.', 'Der linke Winkel an p ist Wechselwinkel zu α, also gleich groß.', 'Der rechte Winkel an p ist Wechselwinkel zu β, also gleich groß.', 'Die drei Winkel an p bilden einen gestreckten Winkel: α + γ + β = 180°.'],
        H('E', 'Ohne die Parallele gibt es keine Wechselwinkel.'), { bild: mitParallele(dreieckAus(w[0], w[1], drehFuer('E')), { links: NAME('α′'), mitte: NAME('γ'), rechts: NAME('β′') }, { ecken: { A: NAME('α'), B: NAME('β') } }) }); },
  ]);
}

export function winkelsumme() { s1(); s2(); }
