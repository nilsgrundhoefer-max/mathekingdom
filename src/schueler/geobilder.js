// Kapitel 5 „Geometrische Grundbegriffe und ebene Figuren“ (ADR 0032): das Karogitter als Bild und als Eingabe „Gitterzeichnen“,
// dazu das Lineal zum Ablesen von Längen.
// Grilling mit Nils, 2026-11-21:
// - Gezeichnet wird durch Antippen von Gitterpunkten. Das Dashboard verbindet sie; geprüft wird die Lage der Punkte.
// - Echte Zentimeter gibt es am Bildschirm nicht. Längen stehen in Kästchen (2 Kästchen = 1 cm) oder werden am gezeichneten Lineal abgelesen.
// - Beim Ergänzen symmetrischer Figuren tippt das Kind auf F und G Kästchen an, ab M setzt es Eckpunkte.
import { h, s } from './dom.js';
import { lesePunkte, alsEingabe, gleich } from './geo.js';

// ---------- Karogitter ----------
// g: { b, h, achsen?, punkte?: [{ n, x, y, pos? }], linien?: [{ n?, a, b, art, stil? }], figuren?: [{ n?, ecken, stil? }],
//      zellen?: [[x, y]], zentrum?: [x, y], rechte?: [{ p, u, v }], texte?: [{ x, y, t }] }
// dazu (für Eingabe und Lösung): { punkte, linie: { p, q, art }, zellen, vieleck, klasse }
const RAND = 1; // ein Kästchen Rand für Namen und Achsenzahlen
// Klasse 7 (ADR 0043): Mit `ursprung: [ox, oy]` liegt der Nullpunkt nicht unten links, sondern ox Kästchen nach rechts und oy nach oben.
// Alle Koordinaten zählen dann vom Nullpunkt aus und dürfen negativ sein (Koordinatensystem mit vier Quadranten).
const bereich = (g) => { const [ox, oy] = g.ursprung ?? [0, 0]; return { x0: -ox, x1: g.b - ox, y0: -oy, y1: g.h - oy }; };
const mz = (n) => (n < 0 ? `−${-n}` : String(n));
// Klasse 6, Kapitel 7 (ADR 0050): Schaubild einer Zuordnung. Mit `skala: { x: { name, schritt, jede?, stellen? }, y: { … } }` tragen die Achsen
// den Namen der Größe mit Einheit, und ein Kästchen ist `schritt` wert. Punkte und Lösungen stehen weiter in Kästchen.
// `zuege: [{ punkte: [[x, y]], n?, stil? }]` sind Linienzüge durch die Punkte (Gerade durch den Nullpunkt, Kurve, Temperaturverlauf).
export const skalaZahl = (sk, kaestchen) => (kaestchen * sk.schritt).toFixed(sk.stellen ?? 0).replace('.', ',');
function masse(g) {
  const sk = g.skala, [rl, rr, ro, ru] = sk ? [2.3, 1.3, 1.7, 2.2] : [RAND, RAND, RAND, RAND];
  const u = Math.max(22, Math.min(40, Math.floor((sk ? 560 : 600) / (g.b + rl + rr))));
  const { x0, y1 } = bereich(g);
  // Kapitel 8: Mit Legende („▢ = 1 cm²“) bekommt das Gitter unten eine Zeile mehr.
  return { u, B: (g.b + rl + rr) * u, H: (g.h + ro + ru + (g.legende ? 1 : 0)) * u, X: (x) => (x - x0 + rl) * u, Y: (y) => (y1 - y + ro) * u,
    // Vom Bild zurück ins Gitter (für das Antippen).
    zurueck: (px, py) => [px / u - rl + x0, y1 - (py / u - ro)] };
}
// Eine Gerade durch a und b, bis zum Rand des Gitters verlängert. strahl: nur über b hinaus.
function bisZumRand(g, a, b, strahl = false) {
  const d = [b[0] - a[0], b[1] - a[1]], grenzen = [];
  const r = bereich(g), lo = r.x0 - 0.6, hx = r.x1 + 0.6, ly = r.y0 - 0.6, hy = r.y1 + 0.6;
  for (const [i, lim] of [[0, lo], [0, hx], [1, ly], [1, hy]]) if (d[i] !== 0) grenzen.push((lim - a[i]) / d[i]);
  const drin = grenzen.filter((t) => { const x = a[0] + t * d[0], y = a[1] + t * d[1]; return x >= lo - 1e-9 && x <= hx + 1e-9 && y >= ly - 1e-9 && y <= hy + 1e-9; }).sort((p, q) => p - q);
  const t0 = strahl ? 0 : drin[0], t1 = drin.at(-1);
  return [[a[0] + t0 * d[0], a[1] + t0 * d[1]], [a[0] + t1 * d[0], a[1] + t1 * d[1]]];
}
const VERSATZ = { ro: [0.3, 0.32], lo: [-0.3, 0.32], ru: [0.3, -0.42], lu: [-0.3, -0.42], o: [0, 0.42], u: [0, -0.5], r: [0.42, -0.05], l: [-0.42, -0.05] };
function linieSvg(g, m, l, klasse = '', namensort = null) {
  const [p, q] = l.art === 'strecke' ? [l.a, l.b] : bisZumRand(g, l.a, l.b, l.art === 'strahl');
  const teile = [s('line', { x1: m.X(p[0]), y1: m.Y(p[1]), x2: m.X(q[0]), y2: m.Y(q[1]), class: `linie ${l.art}${l.stil ? ` ${l.stil}` : ''}${klasse ? ` ${klasse}` : ''}` })];
  // Strecke und Strahl zeigen ihre Endpunkte als kleine Querstriche.
  const d = [q[0] - p[0], q[1] - p[1]], len = Math.hypot(d[0], d[1]) || 1, n = [-d[1] / len * 0.16, d[0] / len * 0.16];
  const ende = (e) => s('line', { x1: m.X(e[0] - n[0]), y1: m.Y(e[1] - n[1]), x2: m.X(e[0] + n[0]), y2: m.Y(e[1] + n[1]), class: `linienende${klasse ? ` ${klasse}` : ''}` });
  // Klasse 6 Kapitel 3 (ADR 0045): Kanten eines Schrägbilds haben keine Endstriche.
  if (l.art === 'strecke' && !['achse', 'kante', 'verdeckt'].includes(l.stil)) teile.push(ende(l.a), ende(l.b));
  if (l.art === 'strahl') teile.push(ende(l.a));
  if (l.n) {
    // Der Name steht nahe am zweiten Punkt, ein Stück neben der Linie; der Beschriftungsplan (ADR 0055) weicht bei Bedarf aus.
    const [x, y] = namensort ?? linienOrte(g, m, l)[0];
    teile.push(s('text', { x: ZL(x), y: ZL(y + 5), 'text-anchor': 'middle', class: 'linienname' }, l.n));
  }
  return teile;
}
function punktSvg(m, p, klasse = 'punkt', namensort = null) {
  const x = m.X(p.x), y = m.Y(p.y), k = 5;
  const teile = [s('path', { d: `M${x - k} ${y - k} L${x + k} ${y + k} M${x - k} ${y + k} L${x + k} ${y - k}`, class: klasse })];
  if (p.n) { const [dx, dy] = VERSATZ[p.pos ?? 'ro'], [nx, ny] = namensort ?? [m.X(p.x + dx), m.Y(p.y + dy)]; teile.push(s('text', { x: ZL(nx), y: ZL(ny + 5), 'text-anchor': 'middle', class: 'punktname' }, p.n)); }
  return teile;
}
const ZL = (n) => Math.round(n * 100) / 100;
// Mögliche Orte für den Namen einer Linie, der liebste zuerst (in Bildpunkten): nahe am Ende der Linie, erst auf der einen, dann auf der
// anderen Seite, danach weiter innen. Gehen mehrere benannte Strecken vom selben Punkt aus, steht der Name am anderen Ende.
function linienOrte(g, m, l, amEnde = false) {
  const [p, q] = l.art === 'strecke' ? [l.a, l.b] : bisZumRand(g, l.a, l.b, l.art === 'strahl');
  const d = [q[0] - p[0], q[1] - p[1]], len = Math.hypot(d[0], d[1]) || 1, n = [-d[1] / len * 0.384, d[0] / len * 0.384];
  const stellen = l.art === 'strecke' ? (amEnde ? [0.78, 0.6, 0.5, 0.4, 0.22] : [0.22, 0.78, 0.5, 0.36, 0.64]) : [0.86, 0.92, 0.78, 0.7, 0.14, 0.08, 0.22, 0.3, 0.6, 0.4, 0.5];
  return stellen.flatMap((t) => [1, -1].map((seite) => [m.X(p[0] + d[0] * t + n[0] * seite), m.Y(p[1] + d[1] * t + n[1] * seite)]));
}
// ---------- Beschriftungsplan (ADR 0055) ----------
// Jeder Name im Gitterbild bekommt seinen Platz, bevor gezeichnet wird: Zwei Namen halten Abstand voneinander, kein Name liegt auf einer Linie
// oder auf einem fremden Punkt. Jeder Name hat eine Liste möglicher Orte, der gewohnte Ort steht vorn. Genommen wird der erste freie Ort;
// ist keiner frei, der mit dem kleinsten Mangel. So bleibt ein Bild, das schon gut war, unverändert.
const kasten = (x, y, text, hoch = 14) => { const breit = 5 + 9.5 * String(text).length; return { x0: x - breit / 2, x1: x + breit / 2, y0: y - hoch / 2, y1: y + hoch / 2 }; };
// Schneidet die Strecke a–b den Kasten (um `rand` vergrößert)?
function trifft(k, a, b, rand = 1) {
  const x0 = k.x0 - rand, x1 = k.x1 + rand, y0 = k.y0 - rand, y1 = k.y1 + rand, dx = b[0] - a[0], dy = b[1] - a[1];
  let t0 = 0, t1 = 1;
  for (const [pp, qq] of [[-dx, a[0] - x0], [dx, x1 - a[0]], [-dy, a[1] - y0], [dy, y1 - a[1]]]) {
    if (pp === 0) { if (qq < 0) return false; continue; }
    const t = qq / pp;
    if (pp < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
  }
  return true;
}
// Für Tests: der Plan eines Gitterbilds in Bildpunkten.
export const beschriftungsorte = (g) => beschriftungsplan(g, masse(g));
function beschriftungsplan(g, m) {
  const { X, Y, B, H } = m, P = ([x, y]) => [X(x), Y(y)];
  const strecken = [], belegt = [], marken = (g.punkte ?? []).map((p) => P([p.x, p.y]));
  const plan = { punkte: [], linien: [], figuren: [], zuege: [] };
  (g.linien ?? []).forEach((l, i) => { const [p, q] = l.art === 'strecke' ? [l.a, l.b] : bisZumRand(g, l.a, l.b, l.art === 'strahl'); strecken.push({ a: P(p), b: P(q), linie: i }); });
  (g.figuren ?? []).forEach((f, i) => f.ecken.forEach((e, j) => strecken.push({ a: P(e), b: P(f.ecken[(j + 1) % f.ecken.length]), figur: i })));
  (g.zuege ?? []).forEach((z, i) => z.punkte.slice(1).forEach((e, j) => strecken.push({ a: P(z.punkte[j]), b: P(e), zug: i })));
  const r = bereich(g);
  if (g.achsen || g.skala) strecken.push({ a: P([g.skala ? 0 : r.x0, 0]), b: P([r.x1, 0]) }, { a: P([0, g.skala ? 0 : r.y0]), b: P([0, r.y1]) });
  if (g.zentrum) { marken.push(P(g.zentrum)); belegt.push(kasten(X(g.zentrum[0] + 0.32), Y(g.zentrum[1] + 0.3), 'Z')); }
  for (const t of g.texte ?? []) belegt.push(kasten(X(t.x), Y(t.y), t.t));
  // Mangel eines Orts: Überdeckung wiegt am schwersten, dann ein fremder Punkt, dann eine Linie, zuletzt der Bildrand.
  const mangel = (k, eigen, eigenerPunkt, frei = 6) => {
    let n = 0;
    for (const b of belegt) if (Math.min(k.x1, b.x1) - Math.max(k.x0, b.x0) > -6 && Math.min(k.y1, b.y1) - Math.max(k.y0, b.y0) > -6) n += 100;
    marken.forEach((p, i) => { if (i !== eigenerPunkt && p[0] > k.x0 - frei && p[0] < k.x1 + frei && p[1] > k.y0 - frei && p[1] < k.y1 + frei) n += 60; });
    for (const st of strecken) if (!eigen(st) && trifft(k, st.a, st.b)) n += 40;
    if (k.x0 < 1 || k.x1 > B - 1 || k.y0 < 1 || k.y1 > H - 1) n += 30;
    return n;
  };
  const waehle = (orte, text, eigen = () => false, eigenerPunkt = -1, frei = 6) => {
    let bester = null;
    orte.some((o, i) => { const k = kasten(o[0], o[1], text), n = mangel(k, eigen, eigenerPunkt, frei) + i * 0.01; if (!bester || n < bester.n) bester = { o, k, n }; return n < 1; });
    belegt.push(bester.k);
    return bester.o;
  };
  // 1. Punktnamen: erst die gewünschte Ecke, dann die anderen sieben Richtungen, danach dieselben etwas weiter außen.
  (g.punkte ?? []).forEach((p, i) => {
    if (!p.n) return;
    const zuerst = p.pos ?? 'ro', richtungen = [zuerst, ...Object.keys(VERSATZ).filter((v) => v !== zuerst)];
    plan.punkte[i] = waehle([1, 1.45].flatMap((f) => richtungen.map((v) => [X(p.x + VERSATZ[v][0] * f), Y(p.y + VERSATZ[v][1] * f)])), p.n, () => false, i);
  });
  // 2. Figurnamen: in der Mitte der Figur, sonst ein Stück daneben.
  (g.figuren ?? []).forEach((f, i) => {
    if (!f.n) return;
    const c = f.ecken.reduce((a, e) => [a[0] + e[0] / f.ecken.length, a[1] + e[1] / f.ecken.length], [0, 0]);
    const neben = [[0, 0], [0.45, 0.4], [-0.45, 0.4], [0.45, -0.4], [-0.45, -0.4], [0.6, 0], [-0.6, 0], [0, 0.55], [0, -0.55], [0.9, 0.5], [-0.9, 0.5], [0.9, -0.5], [-0.9, -0.5]];
    plan.figuren[i] = waehle(neben.map(([dx, dy]) => [X(c[0] + dx), Y(c[1] + dy) + 1]), f.n);
  });
  // 3. Liniennamen. Sie halten mehr Abstand zu Punkten, damit ein Linienname nie wie ein Punktname aussieht.
  const gleich = (a, b) => a[0] === b[0] && a[1] === b[1];
  (g.linien ?? []).forEach((l, i) => {
    if (!l.n) return;
    const buendel = l.art === 'strecke' && g.linien.some((x, j) => j !== i && x.n && x.art === 'strecke' && gleich(x.a, l.a));
    plan.linien[i] = waehle(linienOrte(g, m, l, buendel), l.n, (st) => st.linie === i, -1, 13);
  });
  // 4. Namen der Linienzüge im Schaubild: am Ende des Zugs, sonst neben dem Zug weiter innen.
  (g.zuege ?? []).forEach((z, i) => {
    if (!z.n) return;
    // Enden zwei Züge im selben Punkt, wäre ein Name am Ende nicht zuzuordnen: Dann steht er gleich neben dem Zug.
    const gemeinsam = g.zuege.some((x, j) => j !== i && gleich(x.punkte.at(-1), z.punkte.at(-1)));
    const e = P(z.punkte.at(-1)), orte = gemeinsam ? [] : [[e[0] + 4 - (5 + 9.5 * z.n.length) / 2, e[1] - 13]];
    const laengen = z.punkte.slice(1).map((q, j) => Math.hypot(X(q[0]) - X(z.punkte[j][0]), Y(q[1]) - Y(z.punkte[j][1]))), gesamt = laengen.reduce((a, b) => a + b, 0);
    for (const t of [0.85, 0.7, 0.55, 0.4, 0.25]) {
      let rest = gesamt * t, j = 0;
      while (j < laengen.length - 1 && rest > laengen[j]) rest -= laengen[j++];
      const a = P(z.punkte[j]), b = P(z.punkte[j + 1]), len = laengen[j] || 1, d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      for (const seite of [1, -1]) orte.push([a[0] + d[0] * rest + d[1] * 15 * seite, a[1] + d[1] * rest - d[0] * 15 * seite]);
    }
    plan.zuege[i] = waehle(orte, z.n, (st) => st.zug === i);
  });
  return plan;
}
const eckenText = (m, ecken) => ecken.map(([x, y]) => `${m.X(x)},${m.Y(y)}`).join(' ');
const beschreibung = (g) => [g.skala ? `Schaubild: nach rechts ${g.skala.x.name}, nach oben ${g.skala.y.name}` : g.achsen ? 'Koordinatensystem' : 'Karogitter',
  g.skala && g.punkte?.length && `Punkte ${g.punkte.map((p) => `(${skalaZahl(g.skala.x, p.x)}|${skalaZahl(g.skala.y, p.y)})`).join(', ')}`,
  g.skala && g.zuege?.length && `${g.zuege.length === 1 ? 'eine Linie' : `${g.zuege.length} Linien`}`,
  !g.skala && g.punkte?.length && `Punkte ${g.punkte.map((p) => (g.achsen ? `${p.n ?? ''}(${mz(p.x)}|${mz(p.y)})` : p.n)).filter(Boolean).join(', ')}`,
  g.linien?.some((l) => l.n) && `Linien ${g.linien.filter((l) => l.n).map((l) => l.n).join(', ')}`,
  g.figuren?.length && `${g.figuren.length === 1 ? 'eine Figur' : `${g.figuren.length} Figuren`}`,
  g.zellen?.length && `${g.zellen.length} gefärbte Kästchen`].filter(Boolean).join(', ');

let gitterId = 0;
export function gitterSvg(g, dazu = {}) {
  const m = masse(g), { u, X, Y } = m;
  const svg = s('svg', { class: `gitterbild${g.achsen ? ' mit-achsen' : ''}${dazu.klasse ? ` ${dazu.klasse}` : ''}`, viewBox: `0 0 ${m.B} ${m.H}`, role: 'img', 'aria-label': beschreibung(g) });
  svg.style.maxWidth = `${m.B}px`;
  const r = bereich(g), plan = beschriftungsplan(g, m);
  svg.append(s('rect', { x: X(r.x0), y: Y(r.y1), width: g.b * u, height: g.h * u, class: 'blatt' }));
  // Gefärbte Kästchen liegen unter den Karolinien.
  for (const [x, y] of g.zellen ?? []) svg.append(s('rect', { x: X(x), y: Y(y + 1), width: u, height: u, class: 'zelle' }));
  for (const [x, y] of dazu.zellen ?? []) svg.append(s('rect', { x: X(x), y: Y(y + 1), width: u, height: u, class: 'zelle gesetzt' }));
  for (let x = r.x0; x <= r.x1; x++) svg.append(s('line', { x1: X(x), y1: Y(r.y0), x2: X(x), y2: Y(r.y1), class: 'karo' }));
  for (let y = r.y0; y <= r.y1; y++) svg.append(s('line', { x1: X(r.x0), y1: Y(y), x2: X(r.x1), y2: Y(y), class: 'karo' }));
  if (g.skala) {
    const sk = g.skala;
    svg.setAttribute('class', `${svg.getAttribute('class') ?? ''} schaubild`.trim());
    svg.append(s('line', { x1: X(0), y1: Y(0), x2: X(r.x1) + u * 0.7, y2: Y(0), class: 'achse' }), s('line', { x1: X(0), y1: Y(0), x2: X(0), y2: Y(r.y1) - u * 0.7, class: 'achse' }),
      s('path', { d: `M${X(r.x1) + u * 0.7} ${Y(0)} l-9 -5 v10 Z`, class: 'achsenspitze' }), s('path', { d: `M${X(0)} ${Y(r.y1) - u * 0.7} l-5 9 h10 Z`, class: 'achsenspitze' }),
      s('text', { x: X(r.x1) + u * 0.9, y: Y(0) + u * 1.75, 'text-anchor': 'end', class: 'achsenname' }, sk.x.name), s('text', { x: X(0) - u * 0.9, y: Y(r.y1) - u * 0.95, 'text-anchor': 'start', class: 'achsenname' }, sk.y.name));
    for (let x = 0; x <= r.x1; x++) if (x % (sk.x.jede ?? 1) === 0) svg.append(s('line', { x1: X(x), y1: Y(0), x2: X(x), y2: Y(0) + 5, class: 'achsenstrich' }), s('text', { x: X(x), y: Y(0) + 20, 'text-anchor': 'middle', class: 'achsenzahl' }, skalaZahl(sk.x, x)));
    for (let y = 1; y <= r.y1; y++) if (y % (sk.y.jede ?? 1) === 0) svg.append(s('line', { x1: X(0) - 5, y1: Y(y), x2: X(0), y2: Y(y), class: 'achsenstrich' }), s('text', { x: X(0) - 9, y: Y(y) + 5, 'text-anchor': 'end', class: 'achsenzahl' }, skalaZahl(sk.y, y)));
  } else if (g.achsen) {
    const jede = Math.max(g.b, g.h) > 16 ? 2 : 1;
    svg.append(s('line', { x1: X(r.x0), y1: Y(0), x2: X(r.x1) + u * 0.7, y2: Y(0), class: 'achse' }), s('line', { x1: X(0), y1: Y(r.y0), x2: X(0), y2: Y(r.y1) - u * 0.7, class: 'achse' }),
      s('path', { d: `M${X(r.x1) + u * 0.7} ${Y(0)} l-9 -5 v10 Z`, class: 'achsenspitze' }), s('path', { d: `M${X(0)} ${Y(r.y1) - u * 0.7} l-5 9 h10 Z`, class: 'achsenspitze' }),
      s('text', { x: X(r.x1) + u * 0.72, y: Y(0) + 20, 'text-anchor': 'middle', class: 'achsenname' }, 'x'), s('text', { x: X(0) - 14, y: Y(r.y1) - u * 0.55, 'text-anchor': 'middle', class: 'achsenname' }, 'y'));
    // Mit vier Quadranten steht die Null nur einmal, links unter dem Nullpunkt.
    const mitte = r.x0 < 0 || r.y0 < 0;
    // Am Nullpunkt wird es eng: Mit vier Quadranten stehen die Zahlen der x-Achse etwas näher an der Achse und die erste Zahl
    // unter dem Nullpunkt etwas tiefer, damit „−1“ nicht an „−1 0“ klebt (ADR 0055).
    const yx = Y(0) + (mitte ? 17 : 19);
    for (let x = r.x0; x <= r.x1; x++) if (x % jede === 0 && !(mitte && x === 0)) svg.append(s('text', { x: X(x), y: yx, 'text-anchor': 'middle', class: 'achsenzahl' }, mz(x)));
    for (let y = r.y0; y <= r.y1; y++) if (y % jede === 0 && y !== 0) svg.append(s('text', { x: X(0) - 9, y: Y(y) + (mitte && y === -jede ? 7 : 5), 'text-anchor': 'end', class: 'achsenzahl' }, mz(y)));
    if (mitte) svg.append(s('text', { x: X(0) - 9, y: yx, 'text-anchor': 'end', class: 'achsenzahl' }, '0'));
  }
  (g.figuren ?? []).forEach((f, i) => {
    svg.append(s('polygon', { points: eckenText(m, f.ecken), class: `figur${f.stil ? ` ${f.stil}` : ''}` }));
    if (f.n) svg.append(s('text', { x: ZL(plan.figuren[i][0]), y: ZL(plan.figuren[i][1] + 5), 'text-anchor': 'middle', class: 'figurname' }, f.n));
  });
  // Kapitel 7: Kreise (Mittelpunkt und Radius in Kästchen). Klasse 7 Kapitel 2: Zirkelbögen und der Thaleskreis dürfen über den Rand gehen,
  // sie enden dann am Rand des Gitters (wie ein Bogen im Heft).
  if (g.kreise?.length) {
    const id = `mk-gitter-${++gitterId}`;
    svg.append(s('clipPath', { id }, s('rect', { x: X(r.x0), y: Y(r.y1), width: g.b * u, height: g.h * u })));
    for (const k of g.kreise) svg.append(s('circle', { cx: X(k.m[0]), cy: Y(k.m[1]), r: k.r * u, class: `kreis${k.stil ? ` ${k.stil}` : ''}`, 'clip-path': `url(#${id})` }));
  }
  (g.linien ?? []).forEach((l, i) => svg.append(...linieSvg(g, m, l, '', plan.linien[i])));
  (g.zuege ?? []).forEach((z, i) => {
    svg.append(s('polyline', { points: eckenText(m, z.punkte), class: `linie zug${z.stil ? ` ${z.stil}` : ''}` }));
    if (z.n) svg.append(s('text', { x: ZL(plan.zuege[i][0]), y: ZL(plan.zuege[i][1] + 5), 'text-anchor': 'middle', class: 'linienname' }, z.n));
  });
  for (const r of g.rechte ?? []) {
    const e = (v) => { const len = Math.hypot(v[0], v[1]); return [v[0] / len * 0.45, v[1] / len * 0.45]; }, a = e(r.u), b = e(r.v), p = r.p;
    svg.append(s('path', { d: `M${X(p[0] + a[0])} ${Y(p[1] + a[1])} L${X(p[0] + a[0] + b[0])} ${Y(p[1] + a[1] + b[1])} L${X(p[0] + b[0])} ${Y(p[1] + b[1])}`, class: 'rechter' }),
      s('circle', { cx: X(p[0] + (a[0] + b[0]) / 2), cy: Y(p[1] + (a[1] + b[1]) / 2), r: 1.8, class: 'rechterpunkt' }));
  }
  if (g.zentrum) svg.append(s('circle', { cx: X(g.zentrum[0]), cy: Y(g.zentrum[1]), r: 5, class: 'zentrum' }), s('text', { x: X(g.zentrum[0] + 0.32), y: Y(g.zentrum[1] + 0.3) + 5, 'text-anchor': 'middle', class: 'punktname' }, 'Z'));
  for (const t of g.texte ?? []) svg.append(s('text', { x: X(t.x), y: Y(t.y) + 5, 'text-anchor': 'middle', class: 'masstext' }, t.t));
  (g.punkte ?? []).forEach((p, i) => svg.append(...punktSvg(m, p, 'punkt', plan.punkte[i])));
  if (g.legende) {
    const y = Y(-1) + u * 0.2, k = u * 0.8;
    svg.append(s('rect', { x: X(0), y: y - k / 2, width: k, height: k, class: 'legendenfeld' }), s('text', { x: X(0) + k + 8, y: y + 5, class: 'bildtext' }, `= ${g.legende}`));
  }
  // Was das Kind gezeichnet hat (oder die Lösung): Vieleck, Linie, Punkte.
  if (dazu.vieleck?.length > 1) svg.append(s(dazu.vieleck.length > 2 ? 'polygon' : 'polyline', { points: eckenText(m, dazu.vieleck), class: 'figur gesetzt' }));
  if (dazu.linie) svg.append(...linieSvg(g, m, { a: dazu.linie.p, b: dazu.linie.q, art: dazu.linie.art }, 'gesetzt'));
  if (dazu.kreis) {
    const [p, q] = dazu.kreis, r = Math.hypot(q[0] - p[0], q[1] - p[1]) * u;
    svg.append(s('circle', { cx: X(p[0]), cy: Y(p[1]), r, class: 'kreis gesetzt' }), s('line', { x1: X(p[0]), y1: Y(p[1]), x2: X(q[0]), y2: Y(q[1]), class: 'linie hilfs gesetzt' }));
  }
  for (const p of dazu.punkte ?? []) svg.append(s('circle', { cx: X(p[0]), cy: Y(p[1]), r: 7, class: 'gesetzterpunkt' }));
  return svg;
}
export const gitterBild = (g) => h('figure', { class: 'datenbild geobild' }, gitterSvg(g));

// ---------- Gitterzeichnen ----------
// Die Eingabe steht als Text „(3|5) (4|1)“ im versteckten Feld `gitter`. Bedienung mit Maus, Finger oder Tastatur
// (Pfeiltasten bewegen den Zeiger, Leertaste oder Eingabetaste setzt).
// punkte: so viele Punkte wie die Lösung hat; ein gesetzter Punkt lässt sich wieder wegtippen. linie: zwei Punkte, ein dritter beginnt neu.
// zellen: Kästchen an- und abwählen.
export function gitterEingabe(auf, letzte, gesperrt) {
  const g = auf.gitter, m = masse(g), art = auf.eingabe, zellen = art === 'zellen';
  // offen: Die Aufgabe verrät nicht, wie viele Punkte es sind („Markiere alle Punkte, die …“).
  const soll = art === 'linie' || art === 'kreis' ? 2 : zellen || auf.offen ? Infinity : auf.loesung.length;
  let gesetzt = lesePunkte(letzte);
  const r = bereich(g);
  let zeiger = zellen ? [r.x0 + Math.floor((g.b - 1) / 2), r.y0 + Math.floor((g.h - 1) / 2)] : [r.x0 + Math.round(g.b / 2), r.y0 + Math.round(g.h / 2)];
  let zeigerAn = false;
  const feld = h('input', { type: 'hidden', name: 'gitter', value: alsEingabe(gesetzt) });
  const meldung = h('p', { class: 'klein gitterhinweis', 'aria-live': 'polite' });
  const rahmen = h('figure', { class: 'datenbild geobild' });
  const anweisung = { punkte: auf.offen ? 'Tippe alle passenden Gitterpunkte an. Ein zweiter Tipp auf einen Punkt nimmt ihn wieder weg.' : soll === 1 ? 'Tippe auf den Gitterpunkt, an dem der Punkt liegen soll.' : `Tippe ${soll} Gitterpunkte an. Ein zweiter Tipp auf einen Punkt nimmt ihn wieder weg.`,
    linie: 'Tippe zwei Gitterpunkte an. Das Programm zeichnet die Linie durch beide Punkte.',
    kreis: 'Tippe zuerst den Mittelpunkt an und dann einen Punkt auf der Kreislinie. Das Programm zeichnet den Kreis.', zellen: 'Tippe die Kästchen an, die gefärbt sein sollen. Ein zweiter Tipp macht ein Kästchen wieder leer.' }[art];
  const stand = () => (zellen ? `${gesetzt.length} Kästchen gefärbt` : art === 'kreis' ? (gesetzt.length === 2 ? 'Der Kreis ist gezeichnet. Ein neuer Tipp beginnt von vorn.' : gesetzt.length === 1 ? 'Der Mittelpunkt ist gesetzt. Tippe einen Punkt auf der Kreislinie an.' : '') : art === 'linie' ? (gesetzt.length === 2 ? 'Die Linie ist gezeichnet. Ein neuer Tipp beginnt von vorn.' : gesetzt.length === 1 ? 'Ein Punkt ist gesetzt. Tippe den zweiten an.' : '')
    : auf.offen ? `${gesetzt.length} ${gesetzt.length === 1 ? 'Punkt' : 'Punkte'} gesetzt` : soll > 1 ? `${gesetzt.length} von ${soll} Punkten gesetzt` : '');
  const tippe = (p) => {
    if (gesperrt) return;
    const i = gesetzt.findIndex((q) => gleich(p, q));
    let hinweis = null;
    if (art === 'linie' || art === 'kreis') { if (i >= 0) return; gesetzt = gesetzt.length >= 2 ? [p] : [...gesetzt, p]; }
    else if (i >= 0) gesetzt = gesetzt.filter((_, k) => k !== i);
    else if (soll === 1) gesetzt = [p];
    else if (gesetzt.length >= soll) hinweis = `Du hast schon ${soll} Punkte gesetzt. Tippe einen davon an, dann ist er wieder weg.`;
    else gesetzt = [...gesetzt, p];
    feld.value = alsEingabe(gesetzt);
    zeichne(hinweis);
  };
  const zeichne = (hinweis = null) => {
    const dazu = zellen ? { zellen: gesetzt } : art === 'kreis' ? { punkte: gesetzt, kreis: gesetzt.length === 2 ? gesetzt : null } : art === 'linie' ? { punkte: gesetzt, linie: gesetzt.length === 2 ? { p: gesetzt[0], q: gesetzt[1], art: auf.linie ?? 'gerade' } : null }
      : { punkte: gesetzt, vieleck: auf.verbinden ? gesetzt : null };
    const svg = gitterSvg(g, { ...dazu, klasse: `eingabe${gesperrt ? ' gesperrt' : ''}` });
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', `${svg.getAttribute('aria-label')}. ${anweisung} Mit der Tastatur: Pfeiltasten bewegen den Zeiger, die Leertaste setzt.`);
    if (!gesperrt) {
      svg.setAttribute('tabindex', '0');
      if (zeigerAn) svg.append(zellen ? s('rect', { x: m.X(zeiger[0]) + 3, y: m.Y(zeiger[1] + 1) + 3, width: m.u - 6, height: m.u - 6, class: 'zeiger' }) : s('circle', { cx: m.X(zeiger[0]), cy: m.Y(zeiger[1]), r: 11, class: 'zeiger' }));
      svg.addEventListener('pointerdown', (e) => {
        const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(svg.getScreenCTM().inverse()), [x, y] = m.zurueck(q.x, q.y);
        const ziel = zellen ? [Math.floor(x), Math.floor(y)] : [Math.round(x), Math.round(y)];
        const max = zellen ? [r.x1 - 1, r.y1 - 1] : [r.x1, r.y1];
        if (ziel[0] < r.x0 || ziel[1] < r.y0 || ziel[0] > max[0] || ziel[1] > max[1]) return;
        e.preventDefault(); zeiger = ziel; zeigerAn = false; tippe(ziel);
      });
      svg.addEventListener('keydown', (e) => {
        const schritt = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
        const max = zellen ? [r.x1 - 1, r.y1 - 1] : [r.x1, r.y1];
        if (schritt) { e.preventDefault(); zeigerAn = true; zeiger = [Math.max(r.x0, Math.min(max[0], zeiger[0] + schritt[0])), Math.max(r.y0, Math.min(max[1], zeiger[1] + schritt[1]))]; zeichne(); }
        else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); zeigerAn = true; tippe(zeiger); }
      });
    }
    const fokus = rahmen.contains(document.activeElement);
    rahmen.replaceChildren(svg);
    if (fokus) svg.focus({ preventScroll: true });
    meldung.textContent = hinweis ?? stand();
    neu.disabled = gesperrt || gesetzt.length === 0;
  };
  const neu = h('button', { type: 'button', class: 'schlicht', id: 'gitter-neu', onclick: () => { gesetzt = []; feld.value = ''; zeichne(); } }, 'Neu beginnen');
  zeichne();
  // Klasse 6, Kapitel 7 (ADR 0050): Nach dem Eintragen folgt eine Frage zum Bild („Liegen die Punkte auf einer Geraden durch den Nullpunkt?“).
  const gewaehlt = String(letzte ?? '').match(/\[(.*)\]$/)?.[1] ?? null;
  const nachfrage = auf.nachfrage && h('fieldset', { class: 'nachfrage' }, h('legend', {}, auf.nachfrage.text),
    h('div', { class: 'optionen' }, auf.nachfrage.optionen.map((o) => h('label', { class: 'option' }, h('input', { type: 'radio', name: 'nachfrage', value: o.text, disabled: gesperrt, checked: gewaehlt === o.text }), h('span', {}, o.text)))));
  return h('div', { class: 'mitbild gitter-eingabe' }, h('div', { class: 'bildrahmen' }, rahmen), feld,
    !gesperrt && h('div', { class: 'zeichnen-leiste' }, h('p', { class: 'klein' }, anweisung), neu), meldung, nachfrage);
}
// Das Gitter mit eingezeichneter Lösung.
export function gitterLoesungBild(auf) {
  const dazu = auf.eingabe === 'zellen' ? { zellen: auf.loesung }
    : auf.eingabe === 'kreis' ? { punkte: auf.beispiel, kreis: auf.beispiel }
    : auf.eingabe === 'linie' ? { punkte: auf.beispiel, linie: { p: auf.beispiel[0], q: auf.beispiel[1], art: auf.linie ?? 'gerade' } }
      : { punkte: auf.loesung, vieleck: auf.verbinden ? auf.loesung : null };
  return h('figure', { class: 'datenbild geobild' }, gitterSvg(auf.gitter, { ...dazu, klasse: 'loesung' }));
}

// ---------- Lineal ----------
// b: { von, bis (mm am Lineal, Anfang und Ende der Strecke), lang (Länge des Lineals in mm), namen?: ['A', 'B'] }
export function linealBild(b) {
  const mm = 6, links = 30, B = links * 2 + b.lang * mm, yS = 34, yL = 58, hoch = 62;
  const X = (w) => links + w * mm;
  const svg = s('svg', { class: 'linealbild', viewBox: `0 0 ${B} ${yL + hoch + 8}`, role: 'img',
    'aria-label': `Eine Strecke liegt an einem Lineal. Sie beginnt bei ${b.von} Millimetern und endet bei ${b.bis} Millimetern.` });
  svg.style.maxWidth = `${Math.min(B, 760)}px`;
  svg.append(s('rect', { x: X(0) - 14, y: yL, width: b.lang * mm + 28, height: hoch, rx: 5, class: 'lineal' }));
  for (let w = 0; w <= b.lang; w++) {
    const lang = w % 10 === 0 ? 24 : w % 5 === 0 ? 17 : 11;
    svg.append(s('line', { x1: X(w), y1: yL, x2: X(w), y2: yL + lang, class: `mm${w % 10 === 0 ? ' cm' : ''}` }));
    if (w % 10 === 0) svg.append(s('text', { x: X(w), y: yL + 43, 'text-anchor': 'middle', class: 'cmzahl' }, String(w / 10)));
  }
  svg.append(s('text', { x: X(b.lang) + 4, y: yL + 57, 'text-anchor': 'end', class: 'cmwort' }, 'cm'));
  svg.append(s('line', { x1: X(b.von), y1: yS, x2: X(b.bis), y2: yS, class: 'strecke' }),
    s('line', { x1: X(b.von), y1: yS - 9, x2: X(b.von), y2: yL, class: 'streckenende' }), s('line', { x1: X(b.bis), y1: yS - 9, x2: X(b.bis), y2: yL, class: 'streckenende' }),
    s('text', { x: X(b.von), y: yS - 14, 'text-anchor': 'middle', class: 'punktname' }, b.namen?.[0] ?? 'A'), s('text', { x: X(b.bis), y: yS - 14, 'text-anchor': 'middle', class: 'punktname' }, b.namen?.[1] ?? 'B'));
  return h('figure', { class: 'datenbild geobild' }, svg);
}

export const GEOBILDER = { gitter: gitterBild, lineal: linealBild };
