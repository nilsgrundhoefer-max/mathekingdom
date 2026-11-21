// Aufgaben zu 5.7.1 „Kreise“ (Lernziele R1 und R2) nach ADR 0034.
// R1: Mittelpunkt, Radius und Durchmesser erkennen und bestimmen. R2: Kreise und Kreismuster zeichnen.
// Im Gitter sind 2 Kästchen 1 cm. Am Lineal wird in Millimetern abgelesen. Es gilt d = 2 · r.
import { sechs, zahl, auswahl, opt, gitterKreis, B, N, U, HILFSZAHL, Z, h1, h2, h3, fehlerliste, kind, GT, PT, LN } from '../werkzeug.mjs';
import { zz, wahl, mische, suche } from './5-7-winkel.mjs';

const KAESTCHEN = HILFSZAHL(1, '2 Kästchen sind 1 cm');
const DOPPELT = HILFSZAHL(2, 'Der Durchmesser ist doppelt so lang wie der Radius');
const FUENF = HILFSZAHL(5, 'Ein Kästchen ist 5 mm lang');
const P = (p) => `(${p[0]}|${p[1]})`;
const q2 = (p, m) => (p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2;
// Ein Kreis im Gitter mit Mittelpunkt M. Auf Wunsch mit eingezeichnetem Radius oder Durchmesser.
function kreisbild(r, { radius = false, durchmesser = false, punkte = [], achsen = false, mName = 'M', mZeigen = true, rand = 1 } = {}) {
  const b = 2 * r + 2 * rand + zz(0, 2), h = 2 * r + 2 * rand, m = [zz(r + rand, b - r - rand), r + rand];
  const richtung = wahl([[1, 0], [0, 1], [-1, 0]]), p = [m[0] + r * richtung[0], m[1] + r * richtung[1]], gegen = [2 * m[0] - p[0], 2 * m[1] - p[1]];
  const linien = [...(radius ? [LN(null, m, p, 'strecke')] : []), ...(durchmesser ? [LN(null, gegen, p, 'strecke')] : [])];
  return { b, h, m, p, g: (extra = []) => GT(b, h, { ...(achsen ? { achsen: true } : {}), kreise: [{ m, r }], punkte: [...(mZeigen ? [PT(mName, ...m, 'lu')] : []), ...punkte, ...extra], linien }) };
}
// Gitterpunkte auf, in und außerhalb eines Kreises (ohne den Mittelpunkt).
function lagen(m, r, b, h) {
  const alle = [];
  for (let x = 1; x < b; x++) for (let y = 1; y < h; y++) if (x !== m[0] || y !== m[1]) alle.push([x, y]); // nicht auf dem Rand des Gitters
  return { auf: alle.filter((p) => q2(p, m) === r * r), innen: alle.filter((p) => q2(p, m) < r * r && q2(p, m) >= 2), aussen: alle.filter((p) => q2(p, m) > r * r && q2(p, m) <= (r + 2) ** 2) };
}
const lage = (p, m) => { const dx = p[0] - m[0], dy = p[1] - m[1]; return (dx > 0 ? 'r' : dx < 0 ? 'l' : '') + (dy > 0 ? 'o' : dy < 0 ? 'u' : '') || 'ro'; };
// Ein Kreis mit benannten Punkten; die Antworten sind Punktnamen.
function punktwahl(text, r, was, sorten, hilfen, { mehrfach = false } = {}) {
  // Den Mittelpunkt M zeigt das Bild nur, wenn er nicht selbst gesucht ist. Punkte innen und außen liegen deutlich neben der Kreislinie.
  const k = kreisbild(r, { mZeigen: was !== 'mittelpunkt', rand: 2 }), l = lagen(k.m, r, k.b, k.h);
  for (const s of ['innen', 'aussen']) l[s] = l[s].filter((p) => Math.abs(Math.sqrt(q2(p, k.m)) - r) >= 0.7);
  const namen = mische(['A', 'B', 'C', 'D']).slice(0, sorten.length);
  const gewaehlt = sorten.map((s) => (s === 'mitte' ? k.m : wahl(l[s])));
  if (new Set(gewaehlt.map(String)).size !== gewaehlt.length) return null;
  const punkte = gewaehlt.map((p, i) => PT(namen[i], ...p, lage(p, k.m)));
  const sorte = { mittelpunkt: 'mitte', aufKreis: 'auf', innen: 'innen', aussen: 'aussen' }[was];
  const richtig = (i) => sorten[i] === sorte;
  const fv = (i) => (sorten[i] === 'mitte' || was === 'mittelpunkt' ? 'kreis-mittelpunkt' : 'radius-durchmesser');
  return auswahl(text, namen.map((n, i) => opt(n, richtig(i), richtig(i) ? undefined : fv(i))), hilfen, { mehrfach, bild: B.gitter(k.g(punkte)), nachweis: [{ art: 'kreisBild', was }] });
}
// Radius oder Durchmesser am Gitterkreis ablesen, in Kästchen oder cm.
function ablesen(text, r, was, einheit, hilfen, o = {}) {
  const k = kreisbild(r, o), kae = was === 'd' ? 2 * r : r, wert = einheit === 'cm' ? kae / 2 : kae;
  const fehler = fehlerliste(wert, [[was === 'd' ? wert / 2 : wert * 2, 'radius-durchmesser'], [einheit === 'cm' ? kae : wert + 1, einheit === 'cm' ? 'laenge-kaestchen' : 'kreis-mittelpunkt']].filter(([x]) => Number.isInteger(x)));
  return zahl(text, wert, fehler, hilfen, { einheit: einheit === 'cm' ? 'cm' : 'Kästchen', bild: B.gitter(k.g()), nachweis: [...(einheit === 'cm' ? [KAESTCHEN, ...N(`${kae} : 2`)] : []), { art: 'kreisBild', was, einheit: einheit === 'cm' ? 'cm' : 'kaestchen', wert }] });
}
// Kreis über dem Lineal: Durchmesser oder Radius in mm.
function lineal(text, was, { von = null, d = null, radius = false, durchmesser = false } = {}, hilfen) {
  const dm = d ?? 2 * zz(10, 34), v = Math.min(von ?? zz(0, 100 - dm), 100 - dm), wert = was === 'r' ? dm / 2 : dm;
  const fehler = fehlerliste(wert, [[was === 'r' ? dm : dm / 2, 'radius-durchmesser'], [v + dm, v > 0 ? 'lineal-nicht-null' : 'radius-durchmesser'], [was === 'r' ? (v + dm) / 2 : v + dm, 'lineal-nicht-null']].filter(([x]) => Number.isInteger(x)));
  return zahl(text, wert, fehler, hilfen, { einheit: 'mm', bild: B.kreislineal(v, v + dm, { radius, durchmesser }), nachweis: [{ art: 'kreislineal', was, wert }] });
}
// Rechnen mit d = 2 · r im Sachzusammenhang.
const DINGE = [['Der runde Brunnen im Schlossgarten', 'cm', 120, 400], ['Der runde Tisch der Ritter', 'cm', 100, 300], ['Ein Wagenrad', 'cm', 60, 140], ['Eine runde Torte', 'cm', 20, 36], ['Ein runder Teppich', 'cm', 100, 240], ['Das runde Turmfenster', 'cm', 40, 90]];
function rechne(text, wasGegeben, hilfen, { stufe = 'G' } = {}) {
  const [ding, einheit, min, max] = wahl(DINGE), d = 2 * zz(min / 2, max / 2), r = d / 2;
  const gegeben = wasGegeben === 'r' ? r : d, gesucht = wasGegeben === 'r' ? d : r;
  return zahl(text(ding, gegeben, einheit), gesucht, fehlerliste(gesucht, [[gegeben, 'radius-durchmesser'], [wasGegeben === 'r' ? r / 2 : d * 2, 'radius-durchmesser']].filter(([x]) => Number.isInteger(x))), hilfen(gegeben, gesucht),
    { einheit, nachweis: [...(stufe === 'G' ? [DOPPELT] : []), ...N(wasGegeben === 'r' ? `2 · ${r}` : `${d} : 2`)] });
}

export function kreise() {
  const R1 = '5.7.1-R1';
  sechs(R1, 'F', [
    () => lineal(Z('Der Kreis liegt über einem Lineal.', 'Wie lang ist sein Durchmesser?'), 'd', { von: 10 * zz(0, 3), d: 10 * zz(2, 5) },
      h3('Der Durchmesser geht einmal quer durch den Kreis.', 'Schau, wo der Kreis links und rechts endet.', 'Zähle die Millimeter vom linken bis zum rechten Rand.')),
    () => ablesen(Z('Der Kreis hat den Mittelpunkt M.', 'Wie lang ist der Radius?'), zz(2, 5), 'r', 'kaestchen',
      h3('Der Radius geht vom Mittelpunkt bis zur Kreislinie.', 'Die Linie im Bild ist ein Radius.', 'Zähle die Kästchen entlang dieser Linie.'), { radius: true }),
    () => punktwahl(Z('Schau dir den Kreis an.', 'Welcher Punkt ist der Mittelpunkt?'), zz(3, 4), 'mittelpunkt', ['mitte', 'auf', 'innen'],
      h3('Der Mittelpunkt liegt genau in der Mitte des Kreises.', 'Von dort ist es überall gleich weit bis zur Kreislinie.', 'Zähle von jedem Punkt die Kästchen nach links und nach rechts.')),
    () => lineal(Z('Der Kreis liegt über einem Lineal.', 'Die Linie im Kreis ist sein Durchmesser.', 'Wie lang ist der Radius?'), 'r', { von: 0, d: 10 * zz(2, 6) },
      h3('Der Radius ist halb so lang wie der Durchmesser.', 'Lies zuerst den Durchmesser am Lineal ab.', 'Teile den Durchmesser durch 2.'), { durchmesser: true }),
    () => ablesen(Z('Die Linie im Kreis ist ein Radius.', 'Wie lang ist der Durchmesser?'), zz(2, 4), 'd', 'kaestchen',
      h3('Der Durchmesser ist doppelt so lang wie der Radius.', 'Zähle zuerst die Kästchen des Radius.', 'Nimm die Zahl mal 2.'), { radius: true }),
    () => punktwahl(Z('Schau dir den Kreis um M an.', 'Welche Punkte liegen auf der Kreislinie?', 'Kreuze alle an.'), zz(2, 4), 'aufKreis', mische(['auf', 'auf', 'innen', 'aussen']),
      h3('Ein Punkt auf der Kreislinie liegt genau auf dem Rand.', 'Schau bei jedem Punkt genau hin.', 'Punkte innen oder außen gehören nicht dazu.'), { mehrfach: true }),
  ]);
  sechs(R1, 'G', [
    () => lineal(Z('Der Kreis liegt über einem Lineal.', 'Wie groß ist sein Radius?'), 'r', { von: zz(3, 40) },
      h3('Lies ab, wo der Kreis links und rechts endet.', 'Der Unterschied ist der Durchmesser.', 'Der Radius ist die Hälfte davon.')),
    () => ablesen(Z('Im Gitter sind 2 Kästchen 1 cm.', 'Wie lang ist der Radius in cm?'), 2 * zz(1, 3), 'r', 'cm',
      h3('Zähle zuerst die Kästchen des Radius.', '2 Kästchen sind 1 cm.', 'Teile die Zahl der Kästchen durch 2.'), { radius: true }),
    () => rechne((ding, d, e) => Z(`${ding} hat einen Durchmesser von ${d} ${e}.`, 'Wie groß ist sein Radius?'), 'd',
      (d, r) => h3('Der Radius ist halb so lang wie der Durchmesser.', 'Ein Durchmesser von 10 cm gehört zu einem Radius von 5 cm.', `Rechne ${d} : 2.`)),
    () => { const k = kreisbild(zz(2, 4), { radius: true });
      return auswahl(Z('Die Linie im Bild geht vom Mittelpunkt M bis zur Kreislinie.', 'Wie heißt sie?'), [opt('Radius', true), opt('Durchmesser', false, 'radius-durchmesser'), opt('Kreislinie', false, 'kreis-mittelpunkt')],
        h3('Denk an den Zirkel.', 'Die Spitze steht im Mittelpunkt, die Mine malt die Kreislinie.', 'Der Abstand zwischen Spitze und Mine ist der Radius.'), { bild: B.gitter(k.g()), nachweis: [U(true)] }); },
    () => rechne((ding, r, e) => Z(`${ding} hat einen Radius von ${r} ${e}.`, 'Wie groß ist sein Durchmesser?'), 'r',
      (r) => h3('Der Durchmesser ist doppelt so lang wie der Radius.', 'Zu einem Radius von 5 cm gehört ein Durchmesser von 10 cm.', `Rechne 2 · ${r}.`)),
    () => { const d = 2 * zz(3, 9);
      return zahl(Z(`In eine quadratische Schachtel passt genau ein runder Käse.`, `Die Schachtel ist ${d} cm breit.`, 'Wie groß ist der Radius des Käses?'), d / 2, fehlerliste(d / 2, [[d, 'radius-durchmesser'], [d * 2, 'radius-durchmesser']]),
        h3('Der Käse berührt die Schachtel links und rechts.', 'Die Breite der Schachtel ist also der Durchmesser.', `Rechne ${d} : 2.`), { einheit: 'cm', nachweis: [DOPPELT, ...N(`${d} : 2`)] }); },
  ]);
  sechs(R1, 'M', [
    () => lineal('Der Kreis liegt über einem Lineal. Wie groß ist sein Radius in Millimetern?', 'r', { von: zz(5, 45) },
      h2('Lies den linken und den rechten Rand des Kreises ab. Der Unterschied ist der Durchmesser.', 'Der Radius ist halb so lang wie der Durchmesser.')),
    () => ablesen('Im Gitter sind 2 Kästchen 1 cm. Wie lang ist der Durchmesser des Kreises in cm?', zz(2, 5), 'd', 'cm',
      h2('Zähle die Kästchen des Radius. Der Durchmesser ist doppelt so lang.', 'Teile die Kästchen des Durchmessers durch 2, dann hast du cm.'), { radius: true }),
    () => { const m = zz(2, 6), r = m * 50;
      return zahl(`Der runde Springbrunnen im Schlossgarten hat einen Durchmesser von ${m} m. Wie groß ist sein Radius in cm?`, r, fehlerliste(r, [[m * 100, 'radius-durchmesser'], [m * 200, 'radius-durchmesser'], [m * 5, 'umrechnungszahl']].filter(([x]) => x !== r)),
        h2('Rechne den Durchmesser zuerst in cm um: 1 m sind 100 cm.', `${m} m sind ${m * 100} cm. Der Radius ist die Hälfte davon.`), { einheit: 'cm', nachweis: N(`${m} · 100`, `${m * 100} : 2`) }); },
    () => auswahl('Welche Aussagen über einen Kreis stimmen? Kreuze alle an.', mische([opt('Der Durchmesser ist doppelt so lang wie der Radius.', true), opt('Jeder Durchmesser geht durch den Mittelpunkt.', true), opt('Ein Kreis hat genau einen Radius.', false, 'kreis-mittelpunkt'), opt('Der Radius ist doppelt so lang wie der Durchmesser.', false, 'radius-durchmesser')]),
      h2('Stell dir den Zirkel vor: Die Spitze steht im Mittelpunkt.', 'Du kannst vom Mittelpunkt aus viele Radien in alle Richtungen zeichnen. Zwei Radien in entgegengesetzte Richtungen bilden einen Durchmesser.'), { mehrfach: true, nachweis: [U(true)] }),
    () => { const r = zz(8, 16), n = wahl([3, 4]), lang = n * 2 * r;
      return zahl(`${n} gleich große Münzen liegen in einer Reihe nebeneinander und berühren sich. Die Reihe ist ${lang} mm lang. Wie groß ist der Radius einer Münze?`, r, fehlerliste(r, [[2 * r, 'radius-durchmesser'], [lang / 2, 'radius-durchmesser']]),
        h2('Die Länge der Reihe besteht aus lauter Durchmessern.', `Teile zuerst durch ${n}, dann hast du den Durchmesser einer Münze.`), { einheit: 'mm', nachweis: N(`${lang} : ${n}`, `${2 * r} : 2`) }); },
    () => { const r1 = zz(2, 6), d2 = 2 * zz(1, 5), a = r1 + d2 / 2;
      return zahl(`Zwei Kreise berühren sich von außen. Der eine hat den Radius ${r1} cm, der andere den Durchmesser ${d2} cm. Wie weit sind die beiden Mittelpunkte voneinander entfernt?`, a, fehlerliste(a, [[r1 + d2, 'radius-durchmesser'], [2 * r1 + d2, 'radius-durchmesser']]),
        h2('Zeichne eine Skizze: Von einem Mittelpunkt zum anderen gehst du zweimal einen Radius entlang.', `Rechne den Durchmesser zuerst in den Radius um: ${d2} : 2 = ${d2 / 2}.`), { einheit: 'cm', nachweis: N(`${d2} : 2`, `${r1} + ${d2 / 2}`) }); },
  ]);
  sechs(R1, 'E', [
    () => lineal('Wie groß ist der Radius des Kreises über dem Lineal in Millimetern?', 'r', { von: zz(11, 49), d: 2 * zz(11, 25) },
      h1('Lies beide Ränder genau ab und bilde den Unterschied. Das ist der Durchmesser.')),
    () => { const r = zz(3, 9), mm = r * 10 * 2;
      return zahl(`Ein Kreis hat den Radius ${r} cm. Wie lang ist sein Durchmesser in mm?`, mm, fehlerliste(mm, [[r * 10, 'radius-durchmesser'], [r * 2, 'umrechnungszahl']]), h1('Erst verdoppeln, dann in mm umrechnen. 1 cm sind 10 mm.'), { einheit: 'mm', nachweis: N(`2 · ${r}`, `${2 * r} · 10`) }); },
    () => { const r = zz(2, 6), n = wahl([2, 3]), lang = 2 * r * n;
      return zahl(`In eine ${lang} cm lange Dose passen genau ${n} Tennisbälle hintereinander. Sie berühren sich und die Enden der Dose. Wie groß ist der Radius eines Balls?`, r, fehlerliste(r, [[2 * r, 'radius-durchmesser'], [lang / 2, 'radius-durchmesser']]),
        h1('Die Länge der Dose besteht aus lauter Durchmessern.'), { einheit: 'cm', nachweis: N(`${lang} : ${n}`, `${2 * r} : 2`) }); },
    () => { const k = kreisbild(5, { achsen: true, mZeigen: true, rand: 1 }), m = k.m, l = lagen(m, 5, k.b, k.h);
      const auf = mische(l.auf.filter((p) => p[0] !== m[0] && p[1] !== m[1])).slice(0, 1), falsch = mische([...l.innen.filter((p) => q2(p, m) >= 16), ...l.aussen.filter((p) => q2(p, m) <= 30)]).slice(0, 2);
      if (auf.length < 1 || falsch.length < 2) return null;
      const punkte = mische([...auf, ...falsch]).map((p, i) => PT('ABC'[i], ...p, lage(p, m)));
      return auswahl(`Der Kreis hat den Mittelpunkt M${P(m)} und den Radius 5 Kästchen. Welcher der Punkte A, B und C liegt genau auf der Kreislinie?`,
        punkte.map((p) => { const ok = q2([p.x, p.y], m) === 25; return opt(p.n, ok, ok ? undefined : 'kreis-mittelpunkt'); }),
        h1('Ein Schritt 3 nach rechts und 4 nach oben ist genau 5 Kästchen lang. Prüfe die Schritte von M zu jedem Punkt.'), { bild: B.gitter(k.g(punkte)), nachweis: [{ art: 'kreisBild', was: 'aufKreis', r: 5 }] }); },
    () => { const r = zz(1, 4), lang = 2 * r * zz(3, 8), n = lang / (2 * r);
      return zahl(`Wie viele Kreise mit dem Radius ${r} cm passen in einer Reihe auf eine ${lang} cm lange Strecke, wenn sie sich nur berühren?`, n, fehlerliste(n, [[lang / r, 'radius-durchmesser'], [n - 1, 'radius-durchmesser']]),
        h1('Jeder Kreis braucht in der Reihe so viel Platz wie sein Durchmesser.'), { nachweis: N(`2 · ${r}`, `${lang} : ${2 * r}`) }); },
    () => { const k = wahl([3, 4, 5]), kl = 2 * zz(1, 3), R = (k * kl) / 2;
      return zahl(`In einem großen Kreis mit dem Radius ${R} cm liegen ${k} kleine, gleich große Kreise auf einem Durchmesser in einer Reihe. Sie berühren sich und den großen Kreis. Wie groß ist der Radius eines kleinen Kreises?`, kl / 2, fehlerliste(kl / 2, [[kl, 'radius-durchmesser'], [R / k, 'radius-durchmesser']].filter(([x]) => Number.isInteger(x))),
        h1('Die kleinen Kreise füllen zusammen den Durchmesser des großen Kreises aus.'), { einheit: 'cm', nachweis: N(`${R} · 2`, `${2 * R} : ${k}`, `${kl} : 2`) }); },
  ]);

  // ---------- R2: Kreise zeichnen ----------
  const R2 = '5.7.1-R2';
  // Ein Kreis um einen benannten Punkt. Der Radius steht in Kästchen oder cm im Text.
  const zeichne = (text, r, hilfen, { name = 'M', andere = false, durch = false, einheit = 'kaestchen', dGegeben = false, achsen = false, linieG = false, b: bb = null, h: hh = null, rechnung = null } = {}) => {
    const b = bb ?? 2 * r + 2 + zz(0, 3), h = hh ?? 2 * r + 2 + zz(0, 1), m = [zz(r + 1, b - r - 1), zz(r + 1, h - r - 1)];
    const anderer = andere ? suche(() => [zz(1, b - 1), zz(1, h - 1)], (p) => q2(p, m) >= 4 && q2(p, m) !== r * r) : null;
    const p = [m[0] + r, m[1]], beruehr = [m[0], m[1] - r];
    const punkte = [PT(name, ...m, 'lu'), ...(anderer ? [PT(name === 'A' ? 'B' : 'A', ...anderer, 'ru')] : []), ...(durch ? [PT('P', ...p, 'r')] : [])];
    const linien = linieG ? [LN('g', [0, m[1] - r], [b, m[1] - r], 'gerade')] : [];
    const zahlen = einheit === 'cm' ? { cm: r / 2 } : einheit === 'mm' ? { mm: r * 5 } : {};
    const fehler = [[{ r: 2 * r }, 'radius-durchmesser'], ...(r % 2 === 0 ? [[{ r: r / 2 }, 'radius-durchmesser']] : []), ...(anderer ? [[{ r, m: anderer }, 'kreis-mittelpunkt']] : []), ...(einheit === 'cm' ? [[{ r: r / 2 }, 'laenge-kaestchen']] : [])];
    const fertig = fehler.filter(([f], i, l) => l.findIndex(([g]) => JSON.stringify(g) === JSON.stringify(f)) === i);
    return gitterKreis(text(r, { m, cm: r / 2, mm: r * 5, d: 2 * r }), GT(b, h, { ...(achsen ? { achsen: true } : {}), punkte, linien }), m, r, linieG ? beruehr : p, fertig, hilfen,
      { nachweis: [...(einheit === 'cm' ? [KAESTCHEN] : []), ...(einheit === 'mm' ? [FUENF] : []), ...(dGegeben ? N(`${2 * r} : 2`) : []), ...(rechnung ? N(...rechnung(r, m)) : []), { art: 'kreisGitter', r, ...zahlen }] });
  };
  // Ein Kreismuster wird fortgesetzt: Die gezeichneten Kreise folgen einer Regel, der nächste Mittelpunkt ist gesetzt.
  const muster = (text, art, hilfen) => {
    if (art === 'ring') {
      const r0 = zz(1, 2), schritt = 1, rs = [r0, r0 + schritt, r0 + 2 * schritt], r = r0 + 3 * schritt, b = 2 * r + 2, h = 2 * r + 2, m = [r + 1, r + 1];
      return gitterKreis(text, GT(b, h, { kreise: rs.map((x) => ({ m, r: x })), punkte: [PT('M', ...m, 'lu')] }), m, r, [m[0] + r, m[1]], [[{ r: r + 1 }, 'kreis-mittelpunkt'], [{ r: rs[2] }, 'kreis-mittelpunkt']], hilfen, { nachweis: [{ art: 'kreisGitter', r }] });
    }
    const r = zz(1, 2), abstand = 2 * r + wahl([0, 1]), b = 4 * abstand + 2 * r, h = 2 * r + 2, y = r + 1, xs = [0, 1, 2, 3].map((i) => r + i * abstand);
    if (b > 18) return null;
    const m = [xs[3], y];
    return gitterKreis(text, GT(b, h, { kreise: xs.slice(0, 3).map((x) => ({ m: [x, y], r })), punkte: [PT('M', ...m, 'lu')] }), m, r, [m[0], m[1] + r], [[{ r: 2 * r }, 'radius-durchmesser'], [{ r: r + 1 }, 'kreis-mittelpunkt']], hilfen, { nachweis: [{ art: 'kreisGitter', r }] });
  };
  // Heftaufgabe mit Kontrollwert: zwei Kreise mit gleichem Radius, die Mittelpunkte d auseinander. Gemessen wird der Abstand der Schnittpunkte.
  const SCHNITTE = [[50, 60, 80], [50, 80, 60], [34, 32, 60], [34, 60, 32], [29, 40, 42], [29, 42, 40], [25, 14, 48], [25, 48, 14], [41, 18, 80], [41, 80, 18], [37, 24, 70], [37, 70, 24], [65, 50, 120]];
  const cmText = (mm) => (mm % 10 === 0 ? `${mm / 10} cm` : `${Math.floor(mm / 10)} cm ${mm % 10} mm`);
  const cmZeile = (mm) => (mm % 10 === 0 ? `${mm / 10} · 10` : `${Math.floor(mm / 10)} · 10 + ${mm % 10}`);
  const heft = (text, hilfen) => { const [r, d, w] = wahl(SCHNITTE);
    return zahl(text(cmText(r), cmText(d)), w, fehlerliste(w, [[2 * r, 'radius-durchmesser'], [d, 'kreis-mittelpunkt']]), hilfen, { einheit: 'mm', toleranz: 2, nachweis: [...N(cmZeile(r), cmZeile(d)), { art: 'kreisschnitt', r, d, wert: w }] }); };

  sechs(R2, 'F', [
    () => zeichne((r) => Z(`Zeichne einen Kreis um M.`, `Der Radius ist ${r} Kästchen lang.`, 'Tippe zuerst auf M, dann auf einen Punkt der Kreislinie.'), zz(2, 4),
      h3('Der Mittelpunkt M bleibt fest wie die Zirkelspitze.', 'Zähle von M aus die Kästchen nach rechts.', 'Dort liegt ein Punkt der Kreislinie.')),
    () => zeichne((r) => Z(`Zeichne einen Kreis um den Punkt A.`, `Der Radius ist ${r} Kästchen lang.`), zz(2, 4),
      h3('A ist der Mittelpunkt.', 'Achte darauf, dass du nicht um B zeichnest.', 'Zähle von A aus die Kästchen nach rechts.'), { name: 'A', andere: true }),
    () => zeichne((r, x) => Z(`Zeichne einen Kreis um M.`, `Der Radius ist ${x.cm} cm lang.`, 'Im Gitter sind 2 Kästchen 1 cm.'), 2 * zz(1, 2),
      h3('Rechne zuerst um.', '1 cm sind 2 Kästchen.', 'Zähle von M aus so viele Kästchen nach rechts.'), { einheit: 'cm' }),
    () => zeichne(() => Z('Zeichne einen Kreis um M.', 'Er soll durch den Punkt P gehen.'), zz(2, 4),
      h3('Der Abstand von M bis P ist der Radius.', 'Setze den Zirkel in M ein.', 'Tippe dann auf P.'), { durch: true }),
    () => zeichne((r, x) => Z(`Der Durchmesser eines Kreises ist ${x.d} Kästchen lang.`, 'Zeichne den Kreis um M.'), zz(2, 3),
      h3('Der Radius ist halb so lang wie der Durchmesser.', 'Teile den Durchmesser durch 2.', 'Zähle dann von M aus so viele Kästchen.'), { dGegeben: true }),
    () => muster(Z('Die Kreise bilden ein Muster.', 'Zeichne den nächsten Kreis um M.'), 'reihe',
      h3('Schau dir die drei Kreise an.', 'Alle Kreise sind gleich groß.', 'Zeichne um M einen Kreis mit demselben Radius.')),
  ]);
  sechs(R2, 'G', [
    () => zeichne((r, x) => Z(`Zeichne einen Kreis um M mit dem Radius ${x.cm} cm.`, 'Im Gitter sind 2 Kästchen 1 cm.'), 2 * zz(1, 3),
      h3('Rechne den Radius in Kästchen um.', '2 cm sind 4 Kästchen.', 'Zähle von M aus so viele Kästchen.'), { einheit: 'cm' }),
    () => zeichne((r, x) => Z(`Zeichne einen Kreis um M mit dem Radius ${x.mm} mm.`, 'Ein Kästchen ist 5 mm lang.'), zz(2, 5),
      h3('Rechne den Radius in Kästchen um.', '10 mm sind 2 Kästchen.', 'Teile die Millimeter durch 5.'), { einheit: 'mm' }),
    () => muster(Z('Die drei Kreise um M bilden ein Kreismuster.', 'Jeder Kreis ist ein Kästchen größer als der vorige.', 'Zeichne den nächsten Kreis.'), 'ring',
      h3('Die Kreise haben alle denselben Mittelpunkt M.', 'Zähle den Radius des größten Kreises.', 'Der neue Kreis hat ein Kästchen mehr.')),
    () => zeichne((r, x) => Z(`Zeichne einen Kreis um den Punkt B.`, `Der Radius ist ${x.cm} cm lang.`, 'Im Gitter sind 2 Kästchen 1 cm.'), 2 * zz(1, 3),
      h3('B ist der Mittelpunkt.', 'Rechne den Radius in Kästchen um.', 'Zähle von B aus so viele Kästchen.'), { name: 'B', andere: true, einheit: 'cm' }),
    () => zeichne((r, x) => Z(`Ein Kreis hat den Durchmesser ${x.d} Kästchen.`, 'Zeichne ihn um M.'), zz(2, 5),
      h3('Halbiere zuerst den Durchmesser.', 'Ein Durchmesser von 6 Kästchen gehört zu einem Radius von 3 Kästchen.', 'Zähle von M aus so viele Kästchen.'), { dGegeben: true }),
    () => muster(Z('Die Kreise bilden ein Kreismuster.', 'Finde die Regel.', 'Zeichne den nächsten Kreis um M.'), 'reihe',
      h3('Vergleiche die Kreise miteinander.', 'Prüfe die Größe und den Abstand.', 'Der neue Kreis passt in die Reihe.')),
  ]);
  sechs(R2, 'M', [
    () => zeichne((r, x) => `Zeichne den Kreis um M${P(x.m)} mit dem Radius ${r} Einheiten.`, zz(2, 4),
      h2('Suche zuerst den Mittelpunkt im Koordinatensystem.', 'Gehe von M aus so viele Einheiten nach rechts. Dort liegt ein Punkt der Kreislinie.'), { achsen: true }),
    () => zeichne((r, x) => `Zeichne einen Kreis mit dem Durchmesser ${x.d * 5} mm um M. Ein Kästchen ist 5 mm lang.`, zz(2, 4),
      h2('Rechne den Durchmesser in Kästchen um und halbiere ihn.', 'Dann hast du den Radius in Kästchen.'), { einheit: 'mm', rechnung: (r) => [`${r * 10} : 5`, `${2 * r} : 2`] }),
    () => heft((r, d) => `Zeichne in dein Heft zwei Kreise mit dem Radius ${r}. Ihre Mittelpunkte sollen ${d} voneinander entfernt sein. Die Kreise schneiden sich in zwei Punkten. Wie weit liegen die beiden Schnittpunkte auseinander? Miss in mm.`,
      h2('Zeichne zuerst die Strecke zwischen den Mittelpunkten. Setze dann den Zirkel nacheinander in beiden Endpunkten ein.', 'Verbinde die Schnittpunkte und miss die Strecke genau.')),
    () => muster('Die Kreise um M bilden ein Kreismuster. Jeder Kreis hat einen um 1 Kästchen größeren Radius. Zeichne den nächsten Kreis.', 'ring',
      h2('Alle Kreise haben denselben Mittelpunkt M.', 'Der neue Kreis hat ein Kästchen mehr Radius als der größte.')),
    () => zeichne(() => 'Zeichne einen Kreis um M, der durch den Punkt P geht. Gib nur den Mittelpunkt und einen Punkt der Kreislinie an.', zz(3, 5),
      h2('Der Abstand von M bis P ist der Radius.', 'Ein Kreis um M durch P hat genau diesen Radius.'), { durch: true }),
    () => heft((r, d) => `Zeichne in dein Heft eine Strecke AB von ${d}. Zeichne Kreise um A und um B mit dem Radius ${r}. Verbinde die beiden Schnittpunkte. Wie lang ist diese Verbindung in mm?`,
      h2('Die Verbindung der Schnittpunkte steht senkrecht auf AB.', 'Zeichne sorgfältig: Ein spitzer Bleistift macht den Kontrollwert genau.')),
  ]);
  sechs(R2, 'E', [
    () => zeichne((r, x) => `Zeichne den Kreis um M${P(x.m)}, der durch den Punkt (${x.m[0] + r}|${x.m[1]}) geht.`, zz(2, 5),
      h1('Der Abstand von M bis zu dem Punkt ist der Radius.'), { achsen: true, rechnung: (r, m) => [`${m[0]} + ${r}`] }),
    () => heft((r, d) => `Zeichne in dein Heft zwei Kreise mit dem Radius ${r}, deren Mittelpunkte ${d} auseinanderliegen. Wie weit sind die beiden Schnittpunkte voneinander entfernt? Miss in mm.`,
      h1('Zeichne zuerst die Strecke zwischen den Mittelpunkten und setze den Zirkel genau in ihre Endpunkte.')),
    () => zeichne((r, x) => `Zeichne einen Kreis mit dem Durchmesser ${x.d / 2} cm um M. Im Gitter sind 2 Kästchen 1 cm.`, 2 * zz(1, 2) + 0,
      h1('Rechne zuerst den Radius in Kästchen aus.'), { einheit: 'cm' }),
    () => zeichne(() => 'Zeichne um M den Kreis, der die Gerade g genau berührt. Er hat mit g nur einen Punkt gemeinsam.', zz(2, 4),
      h1('Der kürzeste Weg von M zur Geraden g ist der Radius.'), { linieG: true }),
    () => muster('Die Kreise bilden ein Kreismuster. Finde die Regel und zeichne den nächsten Kreis um M.', 'reihe',
      h1('Vergleiche Größe und Abstand der Kreise.')),
    () => heft((r, d) => `Zeichne in dein Heft eine Strecke AB von ${d}. Zeichne um A und um B Kreise mit dem Radius ${r}. Wie lang ist die Strecke zwischen den beiden Schnittpunkten in mm?`,
      h1('Je genauer du die Mittelpunkte triffst, desto genauer stimmt dein Ergebnis.')),
  ]);
}
