// Gemeinsame Bausteine der Erzeuger zu Kapitel 7 „Kreis und Winkel“ (ADR 0034).
// Winkel stehen in Grad. Eine Richtung zählt gegen den Uhrzeigersinn von „nach rechts“ (0°), Punkte im Bild sind Pixel mit y nach oben.
// Die Erzeuger legen nur Größe, Richtung und Schenkellänge fest. Wo der Scheitel liegt und wie groß das Bild wird, rechnet `bildAus` aus:
// So ragt nichts aus dem Bild, und mehrere Winkel stehen mit Abstand nebeneinander.
import { zz, wahl, mische, suche, B } from '../werkzeug.mjs';

export const GEO_R = 230; // halbe lange Seite des Geodreiecks (8 cm), wie im Dashboard
export const BOGEN_R = 34;
export const GRIECH = ['α', 'β', 'γ', 'δ'];
export const norm = (w) => ((w % 360) + 360) % 360;
const rad = (g) => (g * Math.PI) / 180;
export const dir = (g) => [Math.cos(rad(g)), Math.sin(rad(g))];
const plus = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
const r1 = (x) => Math.round(x);
export const art = (g) => (g > 0 && g < 90 ? 'spitz' : g === 90 ? 'recht' : g < 180 ? 'stumpf' : g === 180 ? 'gestreckt' : g < 360 ? 'überstumpf' : 'voll');
export const ARTNAME = { spitz: 'spitzer Winkel', recht: 'rechter Winkel', stumpf: 'stumpfer Winkel', gestreckt: 'gestreckter Winkel', 'überstumpf': 'überstumpfer Winkel', voll: 'Vollwinkel' };
// Wo trifft ein Strahl unter dem Winkel t zur langen Seite die kurzen Seiten des Geodreiecks?
export const kante = (t) => GEO_R / (Math.abs(Math.cos(rad(t))) + Math.sin(rad(t)));

// Ein Winkel ohne Lage: Größe, Richtung des ersten Schenkels, Schenkellängen, Name und Punktnamen.
export const W = (groesse, von, { l1 = 120, l2 = l1, n = null, punkte = null, rb = null, spos = null, farbe = null } = {}) =>
  ({ von: norm(von), groesse, l1, l2, ...(n ? { n } : {}), ...(punkte ? { punkte } : {}), ...(rb ? { rb } : {}), ...(spos != null ? { spos: norm(spos) } : {}), ...(farbe != null ? { farbe } : {}) });

// Punkte, die ein Winkel belegt, vom Scheitel aus gesehen (mit Platz für Namen und Bogen).
function huelle(w) {
  const pts = [], add = (p, r) => pts.push([p[0] - r, p[1] - r], [p[0] + r, p[1] + r]);
  add([0, 0], 14);
  for (const [r, l, name] of [[w.von, w.l1, w.punkte?.a], [w.von + w.groesse, w.l2, w.punkte?.b]]) add(plus([0, 0], dir(r), l + (name ? 16 : 2)), name ? 12 : 3);
  const rb = w.n && w.groesse === 90 ? 48 : w.n && !(w.groesse > 90 && (w.rb ?? BOGEN_R) >= 40) ? Math.max((w.rb ?? BOGEN_R) + 13, 13 / Math.sin((Math.min(w.groesse, 180) * Math.PI) / 360)) + 10 : (w.rb ?? BOGEN_R) + 4;
  for (let t = 0; t <= Math.min(w.groesse, 360); t += 5) add(plus([0, 0], dir(w.von + t), rb), 2);
  if (w.punkte?.s) add(plus([0, 0], dir(w.spos ?? w.von + w.groesse / 2 + 180), 15), 12);
  return pts;
}
const geoHuelle = (geo) => { const n0 = geo.versatz ?? [0, 0]; return [plus(n0, dir(geo.grund), GEO_R), plus(n0, dir(geo.grund + 90), GEO_R), plus(n0, dir(geo.grund), -GEO_R)].flatMap((p) => [[p[0] - 4, p[1] - 4], [p[0] + 4, p[1] + 4]]); };
const kasten = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), x1: Math.max(...pts.map((p) => p[0])), y1: Math.max(...pts.map((p) => p[1])) });

// Ein Bild aus Gruppen: Jede Gruppe ist eine Liste von Winkeln mit gemeinsamem Scheitel. Die Gruppen stehen nebeneinander.
// geo: { grund, versatz? } legt das Geodreieck an den Scheitel der ersten Gruppe.
export function bildAus(gruppen, { geo = null, rand = 16, luecke = 34, minB = 260, minH = 150 } = {}) {
  const kaesten = gruppen.map((g, i) => kasten([...g.flatMap(huelle), ...(i === 0 && geo ? geoHuelle(geo) : [])]));
  const zeilen = [[]];
  let breite = rand;
  kaesten.forEach((k, i) => { const w = k.x1 - k.x0; if (zeilen.at(-1).length && breite + w + rand > 700) { zeilen.push([]); breite = rand; } zeilen.at(-1).push(i); breite += w + luecke; });
  const hoehe = zeilen.map((z) => Math.max(...z.map((i) => kaesten[i].y1 - kaesten[i].y0)));
  const b = Math.max(minB, ...zeilen.map((z) => rand * 2 + z.reduce((s, i) => s + kaesten[i].x1 - kaesten[i].x0, 0) + luecke * (z.length - 1)));
  const h = Math.max(minH, rand * 2 + hoehe.reduce((s, x) => s + x, 0) + luecke * (zeilen.length - 1));
  const winkel = [];
  let y = h - rand; // von oben nach unten
  zeilen.forEach((z, zi) => {
    const zb = z.reduce((s, i) => s + kaesten[i].x1 - kaesten[i].x0, 0) + luecke * (z.length - 1);
    let x = (b - zb) / 2;
    for (const i of z) {
      const k = kaesten[i], s = [r1(x - k.x0), r1(y - hoehe[zi] + (hoehe[zi] - (k.y1 - k.y0)) / 2 - k.y0)];
      for (const w of gruppen[i]) winkel.push({ s, ...w });
      x += k.x1 - k.x0 + luecke;
    }
    y -= hoehe[zi] + luecke;
  });
  const g = geo ? { s: winkel[0].s, grund: norm(geo.grund), ...(geo.versatz ? { versatz: geo.versatz } : {}) } : null;
  return B.winkel(r1(b), r1(h), winkel, { geo: g });
}
// Mehrere einzelne Winkel nebeneinander, mit Namen α, β, γ, δ.
export const reihe = (winkel, o) => bildAus(winkel.map((w, i) => [{ ...w, n: w.n ?? GRIECH[i] }]), o);
// Ein Winkel mit Geodreieck: Der Nullpunkt liegt auf dem Scheitel, die lange Seite auf dem Schenkel in Richtung grund.
// Die Schenkel reichen über die Skala hinaus, damit man ablesen kann.
export const mitGeo = (w, grund = w.von, versatz = null) => bildAus([[{ ...w, l1: Math.max(w.l1, 262), l2: Math.max(w.l2, 262) }]], { geo: { grund, versatz } });

// Richtung des ersten Schenkels je Niveaustufe: F ein Schenkel waagerecht, G gedreht in 5er-Schritten, M und E beliebig.
export function richtungFuer(niveau, g) {
  if (niveau === 'F') return wahl(g <= 180 ? [0, 180 - g] : [0]);
  if (niveau === 'G') return 5 * zz(0, 71);
  return zz(0, 359);
}
// Punktnamen für einen Winkel: Scheitel und zwei Schenkelpunkte, drei verschiedene Buchstaben.
export const PUNKTSAETZE = [['S', 'A', 'B'], ['S', 'P', 'Q'], ['M', 'A', 'B'], ['B', 'A', 'C'], ['O', 'P', 'R'], ['T', 'U', 'V'], ['K', 'L', 'N']];
export const punkteVon = (satz) => ({ s: satz[0], a: satz[1], b: satz[2] });
// Zahlen ohne Wiederholung, mindestens `abstand` auseinander.
export function verschieden(n, ziehe, abstand) {
  return suche(() => Array.from({ length: n }, ziehe), (l) => l.every((x, i) => l.every((y, j) => i === j || Math.abs(x - y) >= abstand)));
}
export { zz, wahl, mische, suche };
