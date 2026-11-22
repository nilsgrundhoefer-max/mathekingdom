// Kapitel 8 „Flächeninhalt und Umfang“ (ADR 0035): Rechnung mit Figuren aus Rechtecken, ohne Oberfläche.
// Eine Figur besteht aus Rechtecken [x0, y0, x1, y1], die sich nicht überdecken, und aus Löchern, die ganz in der Figur liegen.
// Koordinaten sind ganze Zahlen in der Einheit des Bildes (Feld des Rasters, cm, m …), die y-Achse zeigt nach oben.

const sortiert = (liste) => [...new Set(liste)].sort((a, b) => a - b);
// Liegt der Punkt (x, y) in der Figur (in einem Rechteck und in keinem Loch)? Punkte auf dem Rand zählen nicht.
const innen = ([x0, y0, x1, y1], x, y) => x > x0 && x < x1 && y > y0 && y < y1;
export const inFigur = (f, x, y) => f.rechtecke.some((r) => innen(r, x, y)) && !(f.loecher ?? []).some((r) => innen(r, x, y));

// Der Rand einer Figur als Liste waagerechter und senkrechter Strecken, zusammengefasst, wo sie in einer Linie weiterlaufen.
// Gerechnet wird auf dem Gitter aller vorkommenden x- und y-Werte: Eine Gitterkante gehört zum Rand, wenn auf genau einer Seite Figur ist.
export function rand(f) {
  const alle = [...f.rechtecke, ...(f.loecher ?? [])];
  const xs = sortiert(alle.flatMap((r) => [r[0], r[2]])), ys = sortiert(alle.flatMap((r) => [r[1], r[3]]));
  const voll = (i, j) => i >= 0 && j >= 0 && i < xs.length - 1 && j < ys.length - 1 && inFigur(f, (xs[i] + xs[i + 1]) / 2, (ys[j] + ys[j + 1]) / 2);
  const strecken = [];
  // Waagerechte Kanten auf der Höhe ys[j], zwischen den Zellen (i, j − 1) und (i, j).
  for (let j = 0; j < ys.length; j++) {
    let start = null;
    for (let i = 0; i <= xs.length - 1; i++) {
      const kante = i < xs.length - 1 && voll(i, j - 1) !== voll(i, j);
      if (kante && start === null) start = xs[i];
      if (!kante && start !== null) { strecken.push([[start, ys[j]], [xs[i], ys[j]]]); start = null; }
    }
  }
  for (let i = 0; i < xs.length; i++) {
    let start = null;
    for (let j = 0; j <= ys.length - 1; j++) {
      const kante = j < ys.length - 1 && voll(i - 1, j) !== voll(i, j);
      if (kante && start === null) start = ys[j];
      if (!kante && start !== null) { strecken.push([[xs[i], start], [xs[i], ys[j]]]); start = null; }
    }
  }
  return strecken;
}
const flaecheVon = ([x0, y0, x1, y1]) => (x1 - x0) * (y1 - y0);
export const inhalt = (f) => f.rechtecke.reduce((s, r) => s + flaecheVon(r), 0) - (f.loecher ?? []).reduce((s, r) => s + flaecheVon(r), 0);
export const umfang = (f) => rand(f).reduce((s, [p, q]) => s + Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]), 0);

// ---------- Kästchen färben mit Bedingung ----------
// Kästchen [x, y] (linke untere Ecke). bedingung { n?, umfang?, rechteck? }: so viele Kästchen, dieser Umfang in Kästchenseiten,
// oder die Kästchen bilden ein ganzes Rechteck. Die Kästchen müssen zusammenhängen (über Seiten, nicht nur über Ecken).
export function zellenFigur(zellen) { return { rechtecke: zellen.map(([x, y]) => [x, y, x + 1, y + 1]) }; }
function zusammen(zellen) {
  if (!zellen.length) return false;
  const k = new Set(zellen.map(String)), gesehen = new Set([String(zellen[0])]), offen = [zellen[0]];
  while (offen.length) {
    const [x, y] = offen.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const n = String([x + dx, y + dy]); if (k.has(n) && !gesehen.has(n)) { gesehen.add(n); offen.push([x + dx, y + dy]); } }
  }
  return gesehen.size === k.size;
}
export function zellenErfuellt(bed, zellen) {
  if (!Array.isArray(zellen) || new Set(zellen.map(String)).size !== zellen.length || !zusammen(zellen)) return false;
  if (bed.n != null && zellen.length !== bed.n) return false;
  if (bed.umfang != null && umfang(zellenFigur(zellen)) !== bed.umfang) return false;
  if (bed.rechteck) {
    const xs = zellen.map((z) => z[0]), ys = zellen.map((z) => z[1]);
    if ((Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1) !== zellen.length) return false;
  }
  return true;
}
