// Die Wappenbereiche der Klassen 6 bis 10 (ADR 0039): Schildteilung, Helmzier, Schildhalter, Wahlspruch und Prunkrahmen.
// Wie die Zeichen sind es schlichte Federzeichnungen. Der Schild liegt im Feld von 0 bis 100 (Breite) und 8 bis 104 (Höhe);
// alles andere wird um ihn herum gezeichnet. Nichts davon heißt „Krone“: Die Krone ist der Lohn am Meilenstein (ADR 0012).
import { s } from './dom.js';

const TINTE = '#2f2820', STAHL = '#b9bec4', STAHL_DUNKEL = '#868d95', GOLD = '#d2a93c', HELL = '#f3e7c9';
const rand = (breite = 1.5) => ({ stroke: TINTE, 'stroke-width': breite, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
const Z = (x) => Math.round(x * 10) / 10;

// ---------- Klasse 6: Schildteilung ----------
// Flächen der zweiten Farbe, im Feld des Schildes. Der Schild schneidet sie zu.
export const TEILUNGEN = {
  gespalten: 'M50 0 H100 V110 H50 Z',
  geteilt: 'M0 52 H100 V110 H0 Z',
  schraeg: 'M10 8 L90 104 H10 Z',
  schraeglinks: 'M90 8 L10 104 H90 Z',
  pfahl: 'M37 0 H63 V110 H37 Z',
  schildhaupt: 'M0 0 H100 V36 H0 Z',
  geviert: 'M50 0 H100 V52 H50 Z M0 52 H50 V110 H0 Z',
  sparren: 'M10 76 L50 36 L90 76 V96 L50 56 L10 96 Z',
  schach: Array.from({ length: 20 }, (_, i) => [i % 4, Math.floor(i / 4)]).filter(([c, r]) => (c + r) % 2 === 1).map(([c, r]) => `M${10 + c * 20} ${8 + r * 20} h20 v20 h-20 Z`).join(' '),
  gestaendert: [[50, 8, 90, 8], [90, 52, 90, 104], [50, 104, 10, 104], [10, 52, 10, 8]].map(([a, b, c, d]) => `M50 52 L${a} ${b} L${c} ${d} Z`).join(' '),
};

// ---------- Klasse 7: Helmzier ----------
// Helm im Feld um (0, 0), etwa 48 breit und 56 hoch. Er sitzt mittig auf der Oberkante des Schildes.
const hals = () => s('path', { d: 'M-17 20 L-23 33 H23 L17 20 Z', fill: STAHL_DUNKEL, ...rand() });
export const HELME = {
  topfhelm: () => s('g', {}, hals(),
    s('path', { d: 'M-19 -22 Q-19 -28 0 -29 Q19 -28 19 -22 L21 22 Q0 28 -21 22 Z', fill: STAHL, ...rand() }),
    s('path', { d: 'M0 -28 V25 M-19 -5 H19', fill: 'none', stroke: GOLD, 'stroke-width': 3.2 }),
    s('path', { d: 'M-16 -5 H-4 M4 -5 H16', fill: 'none', stroke: TINTE, 'stroke-width': 2 }),
    [[-11, 8], [-6, 14], [-12, 16], [11, 8], [6, 14], [12, 16]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 1.3, fill: TINTE }))),
  stechhelm: () => s('g', {}, hals(),
    s('path', { d: 'M-25 3 L-19 24 Q0 30 19 24 L25 3 Z', fill: STAHL, ...rand() }),
    s('path', { d: 'M-21 -4 Q-21 -29 0 -29 Q21 -29 21 -4 L26 3 H-26 Z', fill: STAHL, ...rand() }),
    s('path', { d: 'M-22 0 H22', fill: 'none', stroke: TINTE, 'stroke-width': 3 }),
    s('path', { d: 'M0 -28 V-3 M0 6 V26', fill: 'none', stroke: STAHL_DUNKEL, 'stroke-width': 1.6 }),
    [[-14, 13], [-9, 18], [14, 13], [9, 18]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 1.3, fill: TINTE }))),
  spangenhelm: () => s('g', {}, hals(),
    s('path', { d: 'M-21 4 Q-21 -29 0 -29 Q21 -29 21 4 L17 23 Q0 29 -17 23 Z', fill: STAHL, ...rand() }),
    s('path', { d: 'M-13 -7 Q0 -14 13 -7 L11 15 Q0 20 -11 15 Z', fill: '#3a3530', stroke: GOLD, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }),
    s('path', { d: 'M-6.5 -10 V17 M0 -11 V18 M6.5 -10 V17', fill: 'none', stroke: GOLD, 'stroke-width': 2 }),
    s('path', { d: 'M-21 -1 Q0 -9 21 -1', fill: 'none', stroke: GOLD, 'stroke-width': 2 })),
};
// Helmdecke: zwei Tücher, die vom Helm links und rechts herabfallen. Außen die Schildfarbe, innen die zweite Farbe.
// Gezeichnet ist die linke Hälfte im Feld des Wappens; die rechte ist gespiegelt.
const DECKEN = {
  'decke-schlicht': ['M40 -40 C10 -46 -18 -30 -20 0 C-21 16 -12 30 -2 36 C-6 22 -2 8 8 2 C14 -4 26 -8 38 -8 Z', 'M36 -30 C16 -34 -6 -22 -8 0 C-8 10 -6 18 -3 24 C-2 12 4 2 12 -4 C20 -9 28 -11 36 -11 Z'],
  'decke-gezaddelt': ['M40 -42 C20 -52 -4 -48 -14 -34 C-22 -38 -30 -30 -26 -20 C-34 -14 -34 -2 -24 2 C-30 12 -24 24 -12 22 C-12 32 -2 40 6 34 C2 26 4 16 12 12 C4 8 6 -2 16 -2 C16 -8 26 -12 38 -8 Z',
    'M36 -32 C22 -38 4 -36 -4 -26 C-12 -28 -16 -20 -12 -14 C-18 -8 -16 0 -9 2 C-13 10 -8 16 -1 15 C0 22 4 26 8 24 C7 18 9 12 14 9 C10 4 12 -4 19 -5 C20 -9 28 -11 36 -11 Z'],
};
export function helmdecke(id, aussen, innen) {
  const [a, i] = DECKEN[id] ?? DECKEN['decke-schlicht'];
  const haelfte = () => [s('path', { d: a, fill: aussen, ...rand() }), s('path', { d: i, fill: innen, ...rand(1) })];
  return s('g', { class: 'helmdecke' }, s('g', {}, haelfte()), s('g', { transform: 'translate(100 0) scale(-1 1)' }, haelfte()));
}
// Helmschmuck im Feld um (0, 0): Er steht auf dem Scheitel des Helms.
export const HELMSCHMUCK = {
  federbusch: (c, c2) => s('g', {},
    s('path', { d: 'M-3 2 C-22 -4 -30 -24 -22 -40 C-12 -30 -4 -16 -1 2 Z', fill: c2, ...rand() }),
    s('path', { d: 'M3 2 C22 -4 30 -24 22 -40 C12 -30 4 -16 1 2 Z', fill: c2, ...rand() }),
    s('path', { d: 'M0 4 C-12 -10 -10 -36 0 -48 C10 -36 12 -10 0 4 Z', fill: c, ...rand() }),
    s('path', { d: 'M0 2 V-42 M-2 0 C-10 -12 -16 -24 -20 -34 M2 0 C10 -12 16 -24 20 -34', fill: 'none', stroke: TINTE, 'stroke-width': 0.8 }),
    s('circle', { cx: 0, cy: 3, r: 4, fill: GOLD, ...rand(1.2) })),
  fluegel: (c, c2) => {
    const einer = () => [
      s('path', { d: 'M-2 4 C-8 -8 -12 -22 -10 -40 C-18 -34 -22 -30 -24 -22 C-28 -26 -32 -22 -32 -14 C-36 -16 -38 -10 -36 -4 C-26 4 -12 6 -2 4 Z', fill: c2, ...rand() }),
      s('path', { d: 'M-4 2 C-10 -8 -13 -18 -12 -30 M-10 2 C-18 -4 -23 -12 -24 -20 M-16 3 C-24 0 -30 -6 -32 -12', fill: 'none', stroke: c, 'stroke-width': 2 })];
    return s('g', {}, s('g', {}, einer()), s('g', { transform: 'scale(-1 1)' }, einer()), s('circle', { cx: 0, cy: 3, r: 4, fill: GOLD, ...rand(1.2) }));
  },
  hoerner: (c, c2) => {
    const eins = 'M-4 4 C-22 4 -30 -12 -24 -40 C-18 -26 -14 -14 -3 -8 Z';
    return s('g', {}, s('path', { d: eins, fill: c2, ...rand() }), s('path', { d: eins, fill: c2, ...rand(), transform: 'scale(-1 1)' }),
      s('path', { d: 'M-17 -4 L-10 -10 M-24 -16 L-17 -20 M17 -4 L10 -10 M24 -16 L17 -20', fill: 'none', stroke: c, 'stroke-width': 3 }),
      s('circle', { cx: 0, cy: 2, r: 5, fill: GOLD, ...rand(1.2) }));
  },
};

// ---------- Klasse 8: Schildhalter ----------
// Ein aufgerichtetes Tier im Feld 0 bis 70 (Breite) und 0 bis 114 (Höhe), den Blick nach rechts zum Schild.
// Alle fünf haben denselben Bau: Hinterbeine, Rumpf, Vorderbeine am Schild, Kopf. Kopf, Schweif und Farbe machen das Tier.
const glied = (d, farbe, breite) => [s('path', { d, fill: 'none', stroke: TINTE, 'stroke-width': breite + 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  s('path', { d, fill: 'none', stroke: farbe, 'stroke-width': breite, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })];
const auge = (x, y) => s('circle', { cx: x, cy: y, r: 1.5, fill: TINTE });
function tier({ fell, dick = 8, schweif, kopf, hinten = [], fuss = fell }) {
  return s('g', {}, schweif, hinten,
    glied('M24 80 L13 96 L18 110 H26', fell, dick), glied('M30 82 L38 98 L32 110 H40', fell, dick),
    s('path', { d: `M${14 - (dick - 8)} 84 C6 62 18 38 38 28 C52 30 54 46 46 60 C42 76 36 90 26 92 C20 92 16 90 ${14 - (dick - 8)} 84 Z`, fill: fell, ...rand() }),
    glied('M44 40 L58 30 L68 32', fell, dick - 1.5), glied('M44 52 L58 54 L68 50', fell, dick - 1.5),
    s('path', { d: 'M18 107 h9 v5 h-9 Z M32 107 h9 v5 h-9 Z', fill: fuss, ...rand(1) }),
    kopf);
}
const HALTER = {
  'halter-loewe': () => {
    const fell = '#d6a046', maehne = '#a56a24';
    return tier({ fell,
      schweif: [glied('M14 86 C-2 84 -6 62 4 50 C8 46 10 50 8 54', fell, 3.5), s('path', { d: 'M8 54 C2 50 4 42 10 44 C14 46 13 53 8 54 Z', fill: maehne, ...rand(1) })],
      kopf: [s('path', { d: 'M40 6 C30 2 20 10 22 20 C16 24 18 34 26 36 C28 44 40 46 44 38 C50 40 56 34 52 28 C56 20 50 6 40 6 Z', fill: maehne, ...rand() }),
        s('path', { d: 'M38 12 C46 10 54 14 56 20 L64 24 C66 28 62 32 56 32 C50 36 40 34 37 28 C34 22 34 16 38 12 Z', fill: fell, ...rand() }),
        s('path', { d: 'M38 12 L36 6 L43 10 Z', fill: fell, ...rand(1) }), auge(50, 20), s('path', { d: 'M61 25 l3 1 M56 29 h6', fill: 'none', ...rand(1) })] });
  },
  'halter-hirsch': () => {
    const fell = '#9a6a3e';
    return tier({ fell, dick: 7, fuss: TINTE,
      schweif: s('path', { d: 'M13 82 C6 78 6 72 10 70 C14 72 16 78 13 82 Z', fill: HELL, ...rand(1) }),
      kopf: [s('path', { d: 'M40 14 C36 6 30 2 24 -4 M34 6 L28 8 M30 1 L32 -6 M44 12 C44 2 50 -2 52 -10 M46 3 L52 4 M49 -4 L44 -8', fill: 'none', stroke: TINTE, 'stroke-width': 2.4, 'stroke-linecap': 'round' }),
        s('path', { d: 'M38 26 C34 20 36 12 44 12 C50 12 54 16 58 20 L67 26 C69 30 66 33 62 32 L50 30 C46 34 40 32 38 26 Z', fill: fell, ...rand() }),
        s('path', { d: 'M38 14 L32 10 L37 19 Z', fill: fell, ...rand(1) }), auge(49, 19), s('circle', { cx: 66, cy: 28, r: 1.6, fill: TINTE })] });
  },
  'halter-baer': () => {
    const fell = '#6a4a35';
    return tier({ fell, dick: 11,
      schweif: s('circle', { cx: 8, cy: 82, r: 4, fill: fell, ...rand(1) }),
      kopf: [s('circle', { cx: 37, cy: 9, r: 5, fill: fell, ...rand() }), s('circle', { cx: 51, cy: 8, r: 5, fill: fell, ...rand() }),
        s('path', { d: 'M32 22 C32 12 40 8 46 8 C54 8 60 14 60 22 C60 30 54 36 46 36 C38 36 32 30 32 22 Z', fill: fell, ...rand() }),
        s('path', { d: 'M52 20 C58 18 66 22 66 26 C66 31 60 33 54 32 Z', fill: '#c9a57c', ...rand(1.2) }), auge(48, 18), s('circle', { cx: 65, cy: 25, r: 1.8, fill: TINTE })] });
  },
  'halter-greif': () => {
    const fell = '#c99a4a', feder = '#8a6a3a', schnabel = '#e2b23c';
    return tier({ fell, fuss: schnabel,
      schweif: [glied('M14 86 C-2 84 -6 62 4 50', fell, 3.5), s('path', { d: 'M4 50 C-2 46 2 38 8 42 Z', fill: feder, ...rand(1) })],
      hinten: [s('path', { d: 'M30 50 C20 36 8 22 2 -4 C12 2 18 4 22 12 C24 6 28 8 30 16 C34 12 38 16 38 24 C40 32 38 44 30 50 Z', fill: feder, ...rand() }),
        s('path', { d: 'M28 44 C20 32 12 20 8 6 M32 40 C28 30 24 22 22 14', fill: 'none', stroke: HELL, 'stroke-width': 1.2 })],
      kopf: [s('path', { d: 'M36 26 C32 18 36 8 46 8 C52 8 56 12 58 16 L52 18 L58 20 C56 28 48 34 42 32 C39 31 37 29 36 26 Z', fill: HELL, ...rand() }),
        s('path', { d: 'M56 15 C62 15 68 19 67 28 C64 24 60 22 55 22 Z', fill: schnabel, ...rand(1.2) }),
        s('path', { d: 'M40 10 L37 2 L45 8 Z', fill: HELL, ...rand(1) }), auge(50, 16)] });
  },
  'halter-einhorn': () => {
    const fell = '#f2ede0', maehne = '#7d8fb0';
    return tier({ fell, fuss: GOLD,
      schweif: [glied('M14 86 C-2 84 -6 62 4 50', fell, 3.5), s('path', { d: 'M4 50 C-4 48 -4 36 4 34 C10 38 10 46 4 50 Z', fill: maehne, ...rand(1) })],
      kopf: [s('path', { d: 'M50 10 L62 -14 L55 12 Z', fill: GOLD, ...rand(1.2) }),
        s('path', { d: 'M40 10 C30 10 24 20 26 30 C20 34 22 44 30 46 C34 40 36 32 40 26 Z', fill: maehne, ...rand() }),
        s('path', { d: 'M38 28 C34 20 38 10 46 10 C52 10 56 14 58 20 L66 30 C68 34 64 38 60 36 L52 32 C46 36 40 34 38 28 Z', fill: fell, ...rand() }),
        s('path', { d: 'M42 11 L40 3 L47 9 Z', fill: fell, ...rand(1) }), auge(51, 19), s('circle', { cx: 64, cy: 32, r: 1.3, fill: TINTE })] });
  },
};

// ---------- Klasse 9: Wahlspruch ----------
// Spruchband unter dem Schild, mittig bei x = 50. Der längste Spruch der Liste passt in das Band.
function spruchband(text, y) {
  const halb = 78, t = String(text);
  return s('g', { class: 'spruchband' },
    s('path', { d: `M${50 - halb} ${y + 3} l-14 5 l6 7 l-6 8 l18 -3 Z M${50 + halb} ${y + 3} l14 5 l-6 7 l6 8 l-18 -3 Z`, fill: '#d9c9a0', ...rand(1.2) }),
    s('path', { d: `M${50 - halb} ${y} H${50 + halb} V${y + 18} H${50 - halb} Z`, fill: HELL, ...rand(1.4) }),
    s('text', { x: 50, y: y + 12.6, 'text-anchor': 'middle', 'font-size': 9.5, 'font-family': 'Georgia, serif', 'font-style': 'italic', fill: TINTE }, t));
}

// ---------- Klasse 10: Prunkrahmen ----------
const blatt = (x, y, winkel, farbe) => s('path', { d: 'M0 0 C4 -5 12 -5 16 0 C12 5 4 5 0 0 Z', fill: farbe, stroke: TINTE, 'stroke-width': 0.8, transform: `translate(${Z(x)} ${Z(y)}) rotate(${Z(winkel)})` });
// Lorbeerkranz: zwei Zweige, die sich unter dem Schild kreuzen und an seinen Seiten hochwachsen.
function lorbeer() {
  const zweig = (seite) => {
    const teile = [];
    for (let i = 0; i <= 8; i++) {
      const w = (20 + i * 15) * (Math.PI / 180), x = 50 + seite * 58 * Math.sin(w), y = 52 + 66 * Math.cos(w);
      const richtung = (Math.atan2(-66 * Math.sin(w), seite * 58 * Math.cos(w)) * 180) / Math.PI;
      teile.push(blatt(x, y, richtung - 28 * seite, '#587f3c'), blatt(x, y, richtung + 28 * seite, '#6f9a4a'));
    }
    return teile;
  };
  return s('g', { class: 'lorbeer' }, zweig(-1), zweig(1), s('path', { d: 'M44 118 L56 124 M56 118 L44 124', fill: 'none', stroke: '#6b4a2a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }));
}
// Kette: Glieder um den unteren Rand des Schildes, unten hängt ein Kleinod.
function kette() {
  const glieder = [];
  for (let a = -96; a <= 96; a += 12) {
    const w = (a * Math.PI) / 180, x = 50 + 46 * Math.sin(w), y = 46 + 62 * Math.cos(w);
    glieder.push(s('ellipse', { cx: Z(x), cy: Z(y), rx: 4.2, ry: 3, fill: a % 24 ? GOLD : '#f0d98a', stroke: TINTE, 'stroke-width': 0.9, transform: `rotate(${Z(-a)} ${Z(x)} ${Z(y)})` }));
  }
  return s('g', { class: 'kette' }, glieder,
    s('path', { d: 'M50 110 L57 118 L50 128 L43 118 Z', fill: GOLD, ...rand(1.2) }), s('circle', { cx: 50, cy: 118.5, r: 2.6, fill: '#9e2f28', stroke: TINTE, 'stroke-width': 0.8 }));
}
// Postament: der steinerne Sockel, auf dem Schild und Schildhalter stehen.
const postament = () => s('g', { class: 'postament' },
  s('path', { d: 'M-66 112 H166 L174 124 H-74 Z', fill: '#d6cfbd', ...rand() }),
  s('path', { d: 'M-74 124 H174 V136 H-74 Z', fill: '#bdb5a0', ...rand() }),
  s('path', { d: 'M-40 124 V136 M10 124 V136 M90 124 V136 M140 124 V136 M-10 112 L-12 124 M60 112 V124 M120 112 L122 124', fill: 'none', stroke: TINTE, 'stroke-width': 0.7 }));
// Wappenmantel: ein Tuch hinter dem ganzen Wappen, außen in der Schildfarbe, innen hell mit dunklen Tupfen, oben ein Knauf.
function mantel(farbe) {
  const tupfen = [];
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const x = -58 + c * 27 + (r % 2) * 13, y = -64 + r * 22;
    if (x > -62 && x < 162) tupfen.push(s('path', { d: `M${x} ${y} l1.6 5 l-1.6 2 l-1.6 -2 Z`, fill: TINTE }));
  }
  const id = `mk-mantel-${Math.random().toString(36).slice(2, 8)}`, innen = 'M50 -84 C6 -84 -52 -62 -62 -14 L-64 112 H164 L162 -14 C152 -62 94 -84 50 -84 Z';
  return s('g', { class: 'wappenmantel' },
    s('path', { d: 'M50 -98 C0 -98 -70 -74 -78 -16 C-92 -6 -92 18 -80 28 L-84 126 C-76 118 -68 118 -62 124 L-58 112 H158 L162 124 C168 118 176 118 184 126 L180 28 C192 18 192 -6 178 -16 C170 -74 100 -98 50 -98 Z', fill: farbe, ...rand() }),
    s('defs', {}, s('clipPath', { id }, s('path', { d: innen }))),
    s('path', { d: innen, fill: '#f6efdf', ...rand(1.2) }), s('g', { 'clip-path': `url(#${id})` }, tupfen),
    s('path', { d: 'M-80 22 C-70 10 -66 -4 -72 -14 M180 22 C170 10 166 -4 172 -14', fill: 'none', stroke: GOLD, 'stroke-width': 3.2, 'stroke-linecap': 'round' }),
    s('path', { d: 'M42 -98 C42 -108 58 -108 58 -98 Z', fill: GOLD, ...rand(1.2) }), s('circle', { cx: 50, cy: -110, r: 5, fill: GOLD, ...rand(1.2) }));
}

// Das volle Wappen: der Schild (als fertiges Bild im Feld 0 bis 100) mit allem, was der Schüler darum angelegt hat.
// farbe und farbe2 sind die Farbwerte des Schildes; spruch ist der Text des Wahlspruchs.
export function vollesWappen(wappen, { schild, farbe, farbe2, spruch, breite = 240 }) {
  const prunk = new Set(wappen.prunk ?? []), halter = wappen.halter ?? {};
  const helm = HELME[wappen.helm] ? wappen.helm : null, hatHalter = HALTER[halter.links] || HALTER[halter.rechts];
  const innen = farbe2 ?? HELL;
  let links = -6, rechts = 106, oben = -14, unten = 110;
  const ebenen = [];
  if (prunk.has('mantel')) { ebenen.push(mantel(farbe)); links = -96; rechts = 196; oben = -118; unten = 130; }
  if (prunk.has('postament')) { ebenen.push(postament()); links = Math.min(links, -78); rechts = Math.max(rechts, 178); unten = Math.max(unten, 140); }
  if (prunk.has('lorbeer')) { ebenen.push(lorbeer()); links = Math.min(links, -24); rechts = Math.max(rechts, 124); unten = Math.max(unten, 128); }
  if (HALTER[halter.links]) { ebenen.push(s('g', { class: 'schildhalter', 'data-halter': halter.links, transform: 'translate(-62 0)' }, HALTER[halter.links]())); links = Math.min(links, -72); unten = Math.max(unten, 116); }
  if (HALTER[halter.rechts]) { ebenen.push(s('g', { class: 'schildhalter', 'data-halter': halter.rechts, transform: 'translate(162 0) scale(-1 1)' }, HALTER[halter.rechts]())); rechts = Math.max(rechts, 172); unten = Math.max(unten, 116); }
  if (hatHalter) oben = Math.min(oben, -18);
  if (helm && wappen.helmdecke) { ebenen.push(helmdecke(wappen.helmdecke, farbe, innen)); links = Math.min(links, -38); rechts = Math.max(rechts, 138); }
  ebenen.push(schild);
  if (prunk.has('kette')) { ebenen.push(kette()); unten = Math.max(unten, 132); }
  if (helm) {
    ebenen.push(s('g', { class: 'helm', 'data-helm': helm, transform: 'translate(50 -22)' }, HELME[helm]()));
    oben = Math.min(oben, -56);
    if (HELMSCHMUCK[wappen.helmschmuck]) { ebenen.push(s('g', { class: 'helmschmuck', 'data-schmuck': wappen.helmschmuck, transform: 'translate(50 -52)' }, HELMSCHMUCK[wappen.helmschmuck](farbe, innen))); oben = Math.min(oben, -104); }
  }
  if (spruch) {
    const y = prunk.has('postament') ? 140 : prunk.has('kette') || prunk.has('lorbeer') ? 131 : 112;
    ebenen.push(spruchband(spruch, y)); links = Math.min(links, -46); rechts = Math.max(rechts, 146); unten = Math.max(unten, y + 26);
  }
  const b = rechts - links, hoch = unten - oben;
  return s('svg', { viewBox: `${links} ${oben} ${b} ${hoch}`, width: breite, height: Z((breite * hoch) / b), role: 'img', class: 'wappen volles-wappen',
    'aria-label': 'Dein Wappen' }, ebenen);
}
