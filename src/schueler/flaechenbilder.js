// Kapitel 8 „Flächeninhalt und Umfang“ (ADR 0035): Figuren aus Rechtecken auf einem Raster oder als Skizze.
// Grilling mit Nils, 2026-11-22:
// - In 8.1 wird in Kästchen gezählt, ohne Einheit. Ab 8.2 ist das Raster ein Zentimeterraster: ein Feld ist 1 cm².
// - Bis G ist die Figur maßstäblich am Raster gezeichnet, ab M ist sie eine Skizze mit Maßen und dem Hinweis „Skizze, nicht maßstäblich“.
// - Maße stehen außen mittig an der Seite und berühren keine Linie. Zerlegungslinien sind gestrichelt,
//   Teilflächen haben verschiedene helle Farben und eine Nummer. Ein Loch ist weiß.
import { s } from './dom.js';
import { rand, inFigur } from './flaeche.js';

export const TEILFARBEN = ['#f6d7a7', '#cfe3f5', '#d6ecd2', '#ecd5ec', '#f7e3c0'];
const FIGURFARBEN = ['#f6d7a7', '#cfe3f5', '#d6ecd2'];
const RAND = 40; // Platz für Maße und Namen
const Z = (x) => Math.round(x * 100) / 100;

function massstab(b) {
  const alle = b.figuren.flatMap((f) => f.rechtecke);
  const x0 = b.raster ? 0 : Math.min(...alle.map((r) => r[0])), y0 = b.raster ? 0 : Math.min(...alle.map((r) => r[1]));
  const x1 = b.raster ? b.b : Math.max(...alle.map((r) => r[2])), y1 = b.raster ? b.h : Math.max(...alle.map((r) => r[3]));
  const w = x1 - x0, hh = y1 - y0;
  // Raster: ein Feld 22 bis 34 Pixel. Skizze: höchstens 380 · 230 Pixel.
  const u = b.raster ? Math.max(22, Math.min(34, Math.floor(520 / w))) : Math.min(380 / w, 230 / hh);
  const unten = b.raster === 'cm' || b.raster === 'm' || b.legende ? u + 6 : b.skizze ? 24 : 0;
  // Seitlich so viel Platz, dass das längste Maß an einer senkrechten Seite hineinpasst (etwa 8,5 Pixel je Zeichen).
  const senkrecht = (b.masse ?? []).filter((x) => x.p[0] === x.q[0]).map((x) => (x.frage ? '?' : x.text ?? laengeText(b, Math.abs(x.q[1] - x.p[1]))).length);
  const RX = Math.max(RAND, 16 + Math.ceil(8.5 * Math.max(0, ...senkrecht)));
  // Eine schmale Skizze wird mittig auf ein Blatt gesetzt, auf das der Hinweis „Skizze, nicht maßstäblich“ passt.
  const breite = w * u + 2 * RX, B = Math.max(breite, b.skizze ? 260 : 0), dx = (B - breite) / 2;
  return { u, x0, y0, RX, B: Z(B), H: Z(hh * u + 2 * RAND + unten), X: (x) => Z(dx + RX + (x - x0) * u), Y: (y) => Z(RAND + (y1 - y) * u) };
}
const rechteckPfad = (m, [x0, y0, x1, y1]) => `M${m.X(x0)} ${m.Y(y0)} H${m.X(x1)} V${m.Y(y1)} H${m.X(x0)} Z`;
const laengeText = (b, l) => `${l} ${b.einheit === 'kaestchen' ? 'Kästchen' : b.einheit}`;

// Ein Maß an einer Seite: auf der Seite außerhalb der Figur, mittig.
function massTeile(b, m, mass) {
  const [p, q] = [mass.p, mass.q], waagerecht = p[1] === q[1];
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, e = 0.001;
  // Auf welcher Seite der Kante liegt die Figur? Geprüft an drei Stellen der Kante, nicht nur in der Mitte:
  // Die Mitte kann genau auf der Höhe einer Ecke liegen (beim L die linke Seite auf Höhe der Stufe).
  const drin = (f, dx, dy) => [0.3, 0.5, 0.7].some((t) => inFigur(f, p[0] + t * (q[0] - p[0]) + dx, p[1] + t * (q[1] - p[1]) + dy));
  const figur = b.figuren.find((f) => (waagerecht ? drin(f, 0, e) || drin(f, 0, -e) : drin(f, e, 0) || drin(f, -e, 0))) ?? b.figuren[0];
  const text = mass.frage ? '?' : mass.text ?? laengeText(b, Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]));
  if (waagerecht) {
    const oben = !drin(figur, 0, e);
    return s('text', { x: m.X(mx), y: Z(m.Y(my) + (oben ? -9 : 22)), 'text-anchor': 'middle', class: `masszahl${mass.frage ? ' frage' : ''}` }, text);
  }
  const rechts = !drin(figur, e, 0);
  return s('text', { x: Z(m.X(mx) + (rechts ? 8 : -8)), y: Z(m.Y(my) + 5), 'text-anchor': rechts ? 'start' : 'end', class: `masszahl${mass.frage ? ' frage' : ''}` }, text);
}

function beschreibung(b) {
  const was = b.raster === 'cm' ? 'Zentimeterraster' : b.raster ? 'Karogitter' : 'Skizze';
  return `${was} mit ${b.figuren.length === 1 ? 'einer Figur' : `${b.figuren.length} Figuren`}${(b.masse ?? []).length ? `, Maße ${(b.masse ?? []).map((x) => (x.frage ? '?' : x.text ?? laengeText(b, Math.abs(x.q[0] - x.p[0]) + Math.abs(x.q[1] - x.p[1])))).join(', ')}` : ''}`;
}

// Gemeinsame Kanten zweier Rechtecke [x1, y1, x2, y2] als Strecken.
function trennlinien(rs) {
  const out = [];
  rs.forEach((a, i) => rs.slice(i + 1).forEach((b) => {
    for (const x of [a[0], a[2]]) if (x === b[0] || x === b[2]) { const y1 = Math.max(a[1], b[1]), y2 = Math.min(a[3], b[3]); if (y2 > y1 && (x === a[0]) !== (x === b[0])) out.push([[x, y1], [x, y2]]); }
    for (const y of [a[1], a[3]]) if (y === b[1] || y === b[3]) { const x1 = Math.max(a[0], b[0]), x2 = Math.min(a[2], b[2]); if (x2 > x1 && (y === a[1]) !== (y === b[1])) out.push([[x1, y], [x2, y]]); }
  }));
  return out;
}

export function flaechenBild(b) {
  const m = massstab(b);
  const svg = s('svg', { class: `flaechenbild${b.skizze ? ' skizze' : ''}`, viewBox: `0 0 ${m.B} ${m.H}`, role: 'img', 'aria-label': beschreibung(b) });
  svg.style.maxWidth = `${Math.max(320, m.B)}px`;
  svg.append(s('rect', { x: 0, y: 0, width: m.B, height: m.H, class: 'blatt' }));
  if (b.raster) {
    for (let x = 0; x <= b.b; x++) svg.append(s('line', { x1: m.X(x), y1: m.Y(0), x2: m.X(x), y2: m.Y(b.h), class: 'rasterlinie' }));
    for (let y = 0; y <= b.h; y++) svg.append(s('line', { x1: m.X(0), y1: m.Y(y), x2: m.X(b.b), y2: m.Y(y), class: 'rasterlinie' }));
  }
  b.figuren.forEach((f, k) => {
    // Füllung: zerlegt jede Teilfläche in eigener Farbe, sonst die ganze Figur in einer Farbe.
    f.rechtecke.forEach((r, i) => { const farbe = f.zerlegt ? TEILFARBEN[i % TEILFARBEN.length] : FIGURFARBEN[k % FIGURFARBEN.length]; svg.append(s('path', { d: rechteckPfad(m, r), class: 'flaechenfuell', fill: farbe, stroke: farbe })); });
    for (const r of f.loecher ?? []) svg.append(s('path', { d: rechteckPfad(m, r), class: 'loch' }));
    if (b.raster) for (let x = 0; x <= b.b; x++) for (const r of f.rechtecke) if (x > r[0] && x < r[2]) svg.append(s('line', { x1: m.X(x), y1: m.Y(r[1]), x2: m.X(x), y2: m.Y(r[3]), class: 'rasterlinie auf' }));
    if (b.raster) for (let y = 0; y <= b.h; y++) for (const r of f.rechtecke) if (y > r[1] && y < r[3]) svg.append(s('line', { x1: m.X(r[0]), y1: m.Y(y), x2: m.X(r[2]), y2: m.Y(y), class: 'rasterlinie auf' }));
    // Zerlegung: nur die Stücke, an denen zwei Teilflächen aneinanderstoßen, je einmal gestrichelt (doppelte Striche würden die Lücken füllen).
    if (f.zerlegt) for (const [p, q] of trennlinien(f.rechtecke)) svg.append(s('line', { x1: m.X(p[0]), y1: m.Y(p[1]), x2: m.X(q[0]), y2: m.Y(q[1]), class: 'zerlegung' }));
    for (const [p, q] of rand(f)) svg.append(s('line', { x1: m.X(p[0]), y1: m.Y(p[1]), x2: m.X(q[0]), y2: m.Y(q[1]), class: 'kante' }));
    if (f.zerlegt) f.rechtecke.forEach((r, i) => {
      const cx = m.X((r[0] + r[2]) / 2), cy = m.Y((r[1] + r[3]) / 2);
      svg.append(s('circle', { cx, cy, r: 11, class: 'teilkreis' }), s('text', { x: cx, y: Z(cy + 5), 'text-anchor': 'middle', class: 'teilnummer' }, String(i + 1)));
    });
    if (f.n) {
      // Der Name steht über der linken oberen Ecke der Figur.
      const oben = Math.max(...f.rechtecke.map((r) => r[3])), links = Math.min(...f.rechtecke.filter((r) => r[3] === oben).map((r) => r[0]));
      svg.append(s('text', { x: Z(m.X(links) + 2), y: Z(m.Y(oben) - 8), class: 'figurname' }, f.n));
    }
  });
  for (const mass of b.masse ?? []) svg.append(massTeile(b, m, mass));
  const legende = b.legende ?? (b.raster === 'cm' ? '1 cm²' : b.raster === 'm' ? '1 m²' : null);
  if (legende) {
    // Legende: ein Feld ist 1 cm² (Zentimeterraster), 1 m² (Plan) oder ein Ding (Abstecher „Flächen schätzen“).
    // Das Legendenfeld ist genau so groß wie ein Feld des Rasters.
    const k = m.u, y = Z(m.H - 8 - k / 2);
    svg.append(s('rect', { x: m.RX, y: Z(y - k / 2), width: k, height: k, class: 'legendenfeld' }),
      s('text', { x: Z(m.RX + k + 8), y: Z(y + 5), class: 'bildtext' }, `= ${legende}`));
  }
  if (b.skizze) svg.append(s('text', { x: Math.min(m.RX, 16), y: Z(m.H - 12), class: 'bildtext skizzenhinweis' }, 'Skizze, nicht maßstäblich'));
  return svg;
}

export const FLAECHENBILDER = { flaeche: flaechenBild };
