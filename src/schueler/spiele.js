// Belohnungsspiele (ADR 0018): reiner Spaß, eine Runde von höchstens drei Minuten, nur Pfeiltasten, ohne Ton.
// Eigene Spiele im Stil der Karte, keine Nachbauten bekannter Spiele. Die Spielregeln sind reine Funktionen
// (testbar ohne Browser); `starteSpiel` zeichnet sie auf ein Canvas.

const PERGAMENT = '#f6efdf', TINTE = '#2f2820', SEPIA = '#5b4632', ROT = '#9e2f28', BLAU = '#2f5f8a', GRUEN = '#3e6b3a';

// ---------- Botenritt: Schlangenspiel ----------
// Ein Reiter sammelt Briefe; mit jedem Brief wird sein Gefolge länger und er ein wenig schneller.
export const RITT = { spalten: 24, zeilen: 16, start: 7, schrittMs: 150, schnellerJeBrief: 4, schnellstens: 70 };
const RICHTUNG = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };

export function neuerRitt(zufall = Math.random) {
  const y = Math.floor(RITT.zeilen / 2);
  const zustand = { glieder: [[5, y], [4, y], [3, y]], richtung: [1, 0], naechste: [1, 0], brief: null, punkte: 0, vorbei: false };
  zustand.brief = freiesFeld(zustand.glieder, zufall);
  return zustand;
}
function freiesFeld(belegt, zufall) {
  const frei = [];
  for (let x = 0; x < RITT.spalten; x++) for (let y = 0; y < RITT.zeilen; y++) if (!belegt.some(([a, b]) => a === x && b === y)) frei.push([x, y]);
  return frei[Math.floor(zufall() * frei.length)] ?? null;
}
// Richtungswechsel gilt erst beim nächsten Schritt; umkehren geht nicht.
export function lenkeRitt(zustand, taste) {
  const r = RICHTUNG[taste];
  if (!r) return false;
  if (r[0] === -zustand.richtung[0] && r[1] === -zustand.richtung[1]) return true;
  zustand.naechste = r;
  return true;
}
export function rittSchritt(zustand, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  zustand.richtung = zustand.naechste;
  const [kx, ky] = zustand.glieder[0];
  const kopf = [kx + zustand.richtung[0], ky + zustand.richtung[1]];
  const frisst = zustand.brief && kopf[0] === zustand.brief[0] && kopf[1] === zustand.brief[1];
  const koerper = frisst ? zustand.glieder : zustand.glieder.slice(0, -1);
  const draussen = kopf[0] < 0 || kopf[1] < 0 || kopf[0] >= RITT.spalten || kopf[1] >= RITT.zeilen;
  if (draussen || koerper.some(([a, b]) => a === kopf[0] && b === kopf[1])) { zustand.vorbei = true; return zustand; }
  zustand.glieder = [kopf, ...koerper];
  if (frisst) { zustand.punkte++; zustand.brief = freiesFeld(zustand.glieder, zufall); }
  return zustand;
}
export const rittTakt = (zustand) => Math.max(RITT.schnellstens, RITT.schrittMs - zustand.punkte * RITT.schnellerJeBrief);

// ---------- Burgmauer: Abwehrspiel ----------
// Raben stoßen einzeln in Bögen auf die Mauer herab; die Armbrust fährt unten hin und her und schießt nach oben.
// Erreicht ein Rabe die Mauer, ist ein Banner verloren. Mit der Zeit kommen sie öfter und schneller.
export const MAUER = { breite: 480, hoehe: 320, mauerY: 286, banner: 3, armbrustTempo: 260, bolzenTempo: 420, nachladenMs: 320, rabeTempo: 46, abstandMs: 1500 };

export function neueMauer() {
  return { x: MAUER.breite / 2, raben: [], bolzen: [], banner: MAUER.banner, punkte: 0, zeit: 0, bisRabe: 600, nachladen: 0, vorbei: false };
}
// eingabe: { links, rechts, schiessen } (gedrückte Tasten), dt in Millisekunden.
export function mauerSchritt(zustand, dt, eingabe = {}, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  const s = dt / 1000;
  zustand.zeit += dt;
  const stufe = 1 + zustand.zeit / 60000; // nach einer Minute doppelt so lebhaft wie am Anfang
  zustand.x = Math.min(MAUER.breite - 20, Math.max(20, zustand.x + ((eingabe.rechts ? 1 : 0) - (eingabe.links ? 1 : 0)) * MAUER.armbrustTempo * s));
  zustand.nachladen = Math.max(0, zustand.nachladen - dt);
  if (eingabe.schiessen && zustand.nachladen === 0) { zustand.bolzen.push({ x: zustand.x, y: MAUER.mauerY - 18 }); zustand.nachladen = MAUER.nachladenMs; }
  zustand.bisRabe -= dt;
  if (zustand.bisRabe <= 0) {
    zustand.raben.push({ x0: 40 + zufall() * (MAUER.breite - 80), y: -16, weite: 30 + zufall() * 70, phase: zufall() * Math.PI * 2, tempo: MAUER.rabeTempo * (0.8 + zufall() * 0.5) * stufe, t: 0 });
    zustand.bisRabe = MAUER.abstandMs / stufe;
  }
  for (const r of zustand.raben) { r.t += s; r.y += r.tempo * s; r.x = Math.min(MAUER.breite - 14, Math.max(14, r.x0 + Math.sin(r.phase + r.t * 1.8) * r.weite)); }
  for (const b of zustand.bolzen) b.y -= MAUER.bolzenTempo * s;
  for (const b of zustand.bolzen) {
    const treffer = zustand.raben.find((r) => !r.weg && Math.abs(r.x - b.x) < 16 && Math.abs(r.y - b.y) < 14);
    if (treffer) { treffer.weg = true; b.weg = true; zustand.punkte++; }
  }
  for (const r of zustand.raben) if (!r.weg && r.y >= MAUER.mauerY - 6) { r.weg = true; zustand.banner--; }
  zustand.raben = zustand.raben.filter((r) => !r.weg);
  zustand.bolzen = zustand.bolzen.filter((b) => !b.weg && b.y > -10);
  if (zustand.banner <= 0) zustand.vorbei = true;
  return zustand;
}

// ---------- Steinmetz: fallende Bausteine (ADR 0019) ----------
// Bausteine der Burg fallen von oben. ← → schieben, ↑ dreht, ↓ lässt schneller fallen.
// Eine volle Reihe wird zur fertigen Mauerlage und verschwindet; jede Reihe zählt einen Punkt. Alle fünf Reihen wird es schneller.
export const STEIN = { spalten: 10, zeilen: 18, fallMs: 800, schnellerJeStufe: 0.8, reihenJeStufe: 5, schnellstens: 110, schubMs: 40 };
// Die sieben Formen aus je vier Quadraten, als Felder in einem n×n-Kasten.
const FORMEN = [
  { n: 4, felder: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  { n: 2, felder: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  { n: 3, felder: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  { n: 3, felder: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  { n: 3, felder: [[2, 0], [0, 1], [1, 1], [2, 1]] },
  { n: 3, felder: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  { n: 3, felder: [[0, 0], [1, 0], [1, 1], [2, 1]] },
];
export const STEIN_FORMEN = FORMEN.length;
// Gemischt wird in Säckchen zu sieben, damit keine Form lange ausbleibt.
function zieheForm(zustand, zufall) {
  if (!zustand.sack.length) {
    const sack = FORMEN.map((_, i) => i);
    for (let i = sack.length - 1; i > 0; i--) { const j = Math.floor(zufall() * (i + 1)); [sack[i], sack[j]] = [sack[j], sack[i]]; }
    zustand.sack = sack;
  }
  return zustand.sack.pop();
}
const neuerStein = (form) => ({ form, felder: FORMEN[form].felder.map(([x, y]) => [x, y]), x: Math.floor((STEIN.spalten - FORMEN[form].n) / 2), y: form === 0 ? -1 : 0 });
export const steinFelder = (s) => s.felder.map(([x, y]) => [s.x + x, s.y + y]);
export const steinPasst = (zustand, s) => steinFelder(s).every(([x, y]) => x >= 0 && x < STEIN.spalten && y < STEIN.zeilen && (y < 0 || zustand.feld[y][x] === null));
export function neuerSteinmetz(zufall = Math.random) {
  const zustand = { feld: Array.from({ length: STEIN.zeilen }, () => Array(STEIN.spalten).fill(null)), sack: [], punkte: 0, sammel: 0, vorbei: false };
  zustand.stein = neuerStein(zieheForm(zustand, zufall));
  zustand.naechste = zieheForm(zustand, zufall);
  return zustand;
}
export const steinTakt = (zustand) => Math.max(STEIN.schnellstens, STEIN.fallMs * STEIN.schnellerJeStufe ** Math.floor(zustand.punkte / STEIN.reihenJeStufe));
// ← → schieben, ↑ dreht im Uhrzeigersinn; stößt der gedrehte Stein an, rückt er bis zu zwei Felder zur Seite.
export function lenkeStein(zustand, taste) {
  if (zustand.vorbei) return false;
  const s = zustand.stein;
  if (taste === 'ArrowLeft' || taste === 'ArrowRight') {
    const probe = { ...s, x: s.x + (taste === 'ArrowLeft' ? -1 : 1) };
    if (steinPasst(zustand, probe)) zustand.stein = probe;
    return true;
  }
  if (taste === 'ArrowUp') {
    const n = FORMEN[s.form].n;
    if (n === 2) return true;
    const gedreht = { ...s, felder: s.felder.map(([x, y]) => [n - 1 - y, x]) };
    for (const dx of [0, -1, 1, -2, 2]) {
      const probe = { ...gedreht, x: gedreht.x + dx };
      if (steinPasst(zustand, probe)) { zustand.stein = probe; break; }
    }
    return true;
  }
  return taste === 'ArrowDown';
}
// Lässt den Stein eine Zeile fallen. Liegt er auf, wird er Teil der Mauer, volle Reihen verschwinden, der nächste Stein kommt.
export function steinFallen(zustand, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  const tiefer = { ...zustand.stein, y: zustand.stein.y + 1 };
  if (steinPasst(zustand, tiefer)) { zustand.stein = tiefer; return zustand; }
  for (const [x, y] of steinFelder(zustand.stein)) {
    if (y < 0) { zustand.vorbei = true; return zustand; }
    zustand.feld[y][x] = zustand.stein.form;
  }
  const bleibt = zustand.feld.filter((reihe) => reihe.some((f) => f === null));
  const voll = STEIN.zeilen - bleibt.length;
  zustand.feld = [...Array.from({ length: voll }, () => Array(STEIN.spalten).fill(null)), ...bleibt];
  zustand.punkte += voll;
  zustand.stein = neuerStein(zustand.naechste);
  zustand.naechste = zieheForm(zustand, zufall);
  if (!steinPasst(zustand, zustand.stein)) zustand.vorbei = true;
  return zustand;
}
export function steinmetzSchritt(zustand, dt, eingabe = {}, zufall = Math.random) {
  zustand.sammel += dt;
  const takt = eingabe.runter ? Math.min(STEIN.schubMs, steinTakt(zustand)) : steinTakt(zustand);
  while (zustand.sammel >= takt && !zustand.vorbei) { zustand.sammel -= takt; steinFallen(zustand, zufall); }
  return zustand;
}

// ---------- Grenzlauf: Laufen und Springen (ADR 0019) ----------
// Der Kundschafter läuft über die Landstraße; ↑ springt über Steine, Zäune und Gräben, ↓ duckt unter tief fliegenden Raben.
// Gezählt werden Meilen. Drei Banner; nach einem Treffer ist er kurz geschützt.
export const LAUF = { breite: 560, hoehe: 220, bodenY: 180, x: 80, tempo: 200, beschleunigung: 1.2, schnellstens: 420, meile: 600, sprung: 560, schwere: 1700, banner: 3, schutzMs: 1200, stehen: 40, ducken: 22 };
const HINDERNIS = {
  stein: { breite: 20, hoehe: 18 },
  zaun: { breite: 28, hoehe: 30 },
  graben: { breite: 36, hoehe: 0 },
  rabe: { breite: 30, hoehe: 14, ueber: 28 }, // fliegt so hoch, dass man sich ducken oder hoch springen muss
};
export function neuerLauf() {
  return { y: 0, vy: 0, duckt: false, tempo: LAUF.tempo, strecke: 0, bisHindernis: 360, hindernisse: [], banner: LAUF.banner, schutz: 0, punkte: 0, zeit: 0, vorbei: false };
}
// Raben gibt es erst nach ein paar Meilen, damit der Anfang leicht ist.
function neuesHindernis(zustand, zufall) {
  const arten = zustand.punkte >= 3 ? ['stein', 'zaun', 'graben', 'rabe'] : ['stein', 'zaun', 'graben'];
  const art = arten[Math.floor(zufall() * arten.length)];
  return { art, x: LAUF.breite + 10, ...HINDERNIS[art] };
}
// Liegt der Kundschafter gerade an diesem Hindernis an?
export function stoesstAn(zustand, h) {
  const links = LAUF.x - 10, rechts = LAUF.x + 10;
  if (h.x + h.breite < links || h.x > rechts) return false;
  if (h.art === 'graben') return zustand.y <= 0 && h.x + 8 < LAUF.x && LAUF.x < h.x + h.breite - 8;
  const kopf = zustand.y + (zustand.duckt ? LAUF.ducken : LAUF.stehen);
  if (h.art === 'rabe') return kopf > h.ueber && zustand.y < h.ueber + h.hoehe;
  return zustand.y < h.hoehe;
}
// eingabe: { springen, ducken } (gedrückte Tasten), dt in Millisekunden.
export function laufSchritt(zustand, dt, eingabe = {}, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  const s = dt / 1000;
  zustand.zeit += dt;
  zustand.tempo = Math.min(LAUF.schnellstens, LAUF.tempo + LAUF.beschleunigung * zustand.zeit / 1000);
  const amBoden = zustand.y <= 0;
  if (amBoden && eingabe.springen) zustand.vy = LAUF.sprung;
  zustand.duckt = Boolean(eingabe.ducken) && amBoden && !eingabe.springen;
  zustand.vy -= LAUF.schwere * (eingabe.ducken && !amBoden ? 2 : 1) * s; // in der Luft zieht ↓ schneller nach unten
  zustand.y = Math.max(0, zustand.y + zustand.vy * s);
  if (zustand.y === 0 && zustand.vy < 0) zustand.vy = 0;
  const weg = zustand.tempo * s;
  zustand.strecke += weg;
  zustand.punkte = Math.floor(zustand.strecke / LAUF.meile);
  for (const h of zustand.hindernisse) h.x -= weg;
  zustand.bisHindernis -= weg;
  if (zustand.bisHindernis <= 0) {
    zustand.hindernisse.push(neuesHindernis(zustand, zufall));
    zustand.bisHindernis = zustand.tempo * (0.9 + zufall() * 1.1); // mindestens knapp eine Sekunde Abstand
  }
  zustand.schutz = Math.max(0, zustand.schutz - dt);
  if (zustand.schutz === 0) {
    const h = zustand.hindernisse.find((x) => !x.getroffen && stoesstAn(zustand, x));
    if (h) { h.getroffen = true; zustand.banner--; zustand.schutz = LAUF.schutzMs; }
  }
  zustand.hindernisse = zustand.hindernisse.filter((h) => h.x + h.breite > -20);
  if (zustand.banner <= 0) zustand.vorbei = true;
  return zustand;
}

// ---------- Kellerjagd: Labyrinth (ADR 0019) ----------
// Der Kundschafter sucht im Burgkeller Pergamentrollen, Ratten streifen durch die Gänge.
// Sind alle Rollen gefunden, öffnet sich die Treppe in den nächsten Keller, dort ist eine Ratte mehr.
// Eine Ratte läuft zufällig; sieht sie den Kundschafter im selben geraden Gang, folgt sie ihm.
// Plan: # Mauer, . Gang, o Rolle, E Eingang, T Treppe (erscheint, wenn alle Rollen gefunden sind), R Rattenloch.
export const KELLERPLAENE = [
  [
    '###################',
    '#o.......#.......o#',
    '#.##.###.#.###.##.#',
    '#.......o...o.....#',
    '#.##.#.#####.#.##.#',
    '#o...#...R...#...o#',
    '####.###.#.###.####',
    '#o...#.R...R.#...o#',
    '#..#.#.##.##.#.#..#',
    '#o.#.....T.....#.o#',
    '#.##.#.#####.#.##.#',
    '#....#...E...#....#',
    '###################',
  ],
  [
    '###################',
    '#o...#.......#...o#',
    '#.#..#.#####.#..#.#',
    '#.#.....o.o.....#.#',
    '#.#.###.#.#.###.#.#',
    '#...#R..#.#..R#...#',
    '###.#.###.###.#.###',
    '#o....o.....o....o#',
    '#.###.##.#.##.###.#',
    '#...#....T....#...#',
    '#.#.#.#.###.#.#.#.#',
    '#o....#..E..#....o#',
    '###################',
  ],
  [
    '###################',
    '#o.....#...#.....o#',
    '#.###..#.#.#..###.#',
    '#.#.......o.......#',
    '#.#.##.##.##.##.#.#',
    '#o..#....R....#..o#',
    '##.##.##.#.##.##.##',
    '#.....#R...R#.....#',
    '#.###.#.#.#.#.###.#',
    '#o..#....T....#..o#',
    '#.#.#.##...##.#.#.#',
    '#o.......E.......o#',
    '###################',
  ]
];
export const KELLER = { zelle: 24, schrittMs: 170, ratteMs: 300, ratteSchneller: 20, ratteSchnellstens: 190, ratten: 2, banner: 3, pauseMs: 900 };
const RICHTUNGEN = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const finde = (plan, zeichen) => plan.flatMap((reihe, y) => [...reihe].map((c, x) => (c === zeichen ? [x, y] : null)).filter(Boolean));
export const kellerFrei = (zustand, x, y) => zustand.plan[y]?.[x] !== undefined && zustand.plan[y][x] !== '#';
function betrittKeller(zustand) {
  const plan = KELLERPLAENE[(zustand.keller - 1) % KELLERPLAENE.length];
  zustand.plan = plan;
  zustand.rollen = finde(plan, 'o');
  zustand.treppe = finde(plan, 'T')[0];
  zustand.eingang = finde(plan, 'E')[0];
  zustand.loecher = finde(plan, 'R');
  zustand.ratten = Array.from({ length: KELLER.ratten + zustand.keller - 1 }, (_, i) => ({ pos: [...zustand.loecher[i % zustand.loecher.length]], richtung: null }));
  zustand.pos = [...zustand.eingang];
  zustand.richtung = null; zustand.naechste = null;
  zustand.pause = KELLER.pauseMs;
}
export function neueKellerjagd() {
  const zustand = { keller: 1, punkte: 0, banner: KELLER.banner, sammel: 0, sammelRatte: 0, vorbei: false };
  betrittKeller(zustand);
  return zustand;
}
export const ratteTakt = (zustand) => Math.max(KELLER.ratteSchnellstens, KELLER.ratteMs - (zustand.keller - 1) * KELLER.ratteSchneller);
export function lenkeKeller(zustand, taste) {
  const r = RICHTUNG[taste];
  if (!r) return false;
  zustand.naechste = r;
  return true;
}
// Sieht die Ratte den Kundschafter im selben Gang ohne Mauer dazwischen? Dann die Richtung zu ihm, sonst null.
export function sichtRichtung(zustand, [rx, ry]) {
  const [px, py] = zustand.pos;
  if (rx !== px && ry !== py) return null;
  const r = [Math.sign(px - rx), Math.sign(py - ry)];
  if (!r[0] && !r[1]) return null;
  for (let x = rx + r[0], y = ry + r[1]; x !== px || y !== py; x += r[0], y += r[1]) if (!kellerFrei(zustand, x, y)) return null;
  return r;
}
export function kundschafterSchritt(zustand) {
  if (zustand.vorbei || zustand.pause > 0) return zustand;
  const [x, y] = zustand.pos;
  if (zustand.naechste && kellerFrei(zustand, x + zustand.naechste[0], y + zustand.naechste[1])) zustand.richtung = zustand.naechste;
  const r = zustand.richtung;
  if (r && kellerFrei(zustand, x + r[0], y + r[1])) zustand.pos = [x + r[0], y + r[1]];
  const [nx, ny] = zustand.pos;
  const i = zustand.rollen.findIndex(([a, b]) => a === nx && b === ny);
  if (i >= 0) { zustand.rollen.splice(i, 1); zustand.punkte++; }
  if (!zustand.rollen.length && nx === zustand.treppe[0] && ny === zustand.treppe[1]) { zustand.keller++; betrittKeller(zustand); }
  return zustand;
}
export function rattenSchritt(zustand, zufall = Math.random) {
  if (zustand.vorbei || zustand.pause > 0) return zustand;
  for (const ratte of zustand.ratten) {
    const [x, y] = ratte.pos;
    const wege = RICHTUNGEN.filter(([dx, dy]) => kellerFrei(zustand, x + dx, y + dy));
    const zurueck = ratte.richtung && wege.length > 1 ? wege.filter(([dx, dy]) => dx !== -ratte.richtung[0] || dy !== -ratte.richtung[1]) : wege;
    const r = sichtRichtung(zustand, ratte.pos) ?? zurueck[Math.floor(zufall() * zurueck.length)];
    ratte.vorher = ratte.pos;
    ratte.richtung = r;
    ratte.pos = [x + r[0], y + r[1]];
  }
  return zustand;
}
// Treffen sich Kundschafter und Ratte auf einem Feld (oder laufen sie aneinander vorbei), ist ein Banner verloren.
export function rattenTreffer(zustand, vorher) {
  const [px, py] = zustand.pos;
  return zustand.ratten.some((r) => (r.pos[0] === px && r.pos[1] === py)
    || (vorher && r.vorher && r.pos[0] === vorher[0] && r.pos[1] === vorher[1] && r.vorher[0] === px && r.vorher[1] === py));
}
export function kellerSchritt(zustand, dt, zufall = Math.random) {
  if (zustand.vorbei) return zustand;
  if (zustand.pause > 0) { zustand.pause = Math.max(0, zustand.pause - dt); return zustand; }
  zustand.sammel += dt; zustand.sammelRatte += dt;
  while (zustand.sammel >= KELLER.schrittMs || zustand.sammelRatte >= ratteTakt(zustand)) {
    const vorher = zustand.pos;
    let rattenGingen = false;
    if (zustand.sammel >= KELLER.schrittMs) { zustand.sammel -= KELLER.schrittMs; kundschafterSchritt(zustand); }
    if (zustand.pause > 0) return zustand; // neuer Keller
    if (zustand.sammelRatte >= ratteTakt(zustand)) { zustand.sammelRatte -= ratteTakt(zustand); rattenSchritt(zustand, zufall); rattenGingen = true; }
    if (rattenTreffer(zustand, rattenGingen ? vorher : null)) {
      zustand.banner--;
      if (zustand.banner <= 0) { zustand.vorbei = true; return zustand; }
      zustand.pos = [...zustand.eingang]; zustand.richtung = null; zustand.naechste = null;
      zustand.ratten.forEach((r, i) => { r.pos = [...zustand.loecher[i % zustand.loecher.length]]; r.richtung = null; r.vorher = null; });
      zustand.pause = KELLER.pauseMs;
      return zustand;
    }
    for (const r of zustand.ratten) r.vorher = null;
  }
  return zustand;
}

// ---------- Zeichnen ----------
function rittMalen(g, zustand, zelle) {
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, RITT.spalten * zelle, RITT.zeilen * zelle);
  g.strokeStyle = 'rgba(91,70,50,.12)'; g.lineWidth = 1;
  for (let x = 0; x <= RITT.spalten; x++) { g.beginPath(); g.moveTo(x * zelle, 0); g.lineTo(x * zelle, RITT.zeilen * zelle); g.stroke(); }
  for (let y = 0; y <= RITT.zeilen; y++) { g.beginPath(); g.moveTo(0, y * zelle); g.lineTo(RITT.spalten * zelle, y * zelle); g.stroke(); }
  if (zustand.brief) {
    const [bx, by] = zustand.brief, x = bx * zelle + 3, y = by * zelle + 5, b = zelle - 6, hh = zelle - 10;
    g.fillStyle = '#fffaf0'; g.strokeStyle = SEPIA; g.lineWidth = 1.5; g.fillRect(x, y, b, hh); g.strokeRect(x, y, b, hh);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + b / 2, y + hh / 2); g.lineTo(x + b, y); g.stroke();
    g.fillStyle = ROT; g.beginPath(); g.arc(x + b / 2, y + hh / 2, 3, 0, Math.PI * 2); g.fill();
  }
  zustand.glieder.forEach(([gx, gy], i) => {
    const mx = gx * zelle + zelle / 2, my = gy * zelle + zelle / 2;
    g.fillStyle = i === 0 ? ROT : i % 2 ? BLAU : GRUEN; g.strokeStyle = TINTE; g.lineWidth = 1.5;
    g.beginPath(); g.arc(mx, my, i === 0 ? zelle / 2 - 1 : zelle / 2 - 3, 0, Math.PI * 2); g.fill(); g.stroke();
    if (i === 0) { // Wimpel des Boten in Laufrichtung
      const [rx, ry] = zustand.richtung;
      g.fillStyle = '#f3e7c9'; g.beginPath(); g.moveTo(mx + rx * 4 - ry * 4, my + ry * 4 + rx * 4); g.lineTo(mx + rx * 9, my + ry * 9); g.lineTo(mx + rx * 4 + ry * 4, my + ry * 4 - rx * 4); g.fill();
    }
  });
}
function rabe(g, x, y, t) {
  const schlag = Math.sin(t * 12) * 5;
  g.fillStyle = TINTE;
  g.beginPath(); g.ellipse(x, y, 7, 5, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(x - 4, y - 1); g.quadraticCurveTo(x - 12, y - 8 - schlag, x - 18, y - 2 - schlag); g.quadraticCurveTo(x - 10, y + 1, x - 4, y + 2); g.fill();
  g.beginPath(); g.moveTo(x + 4, y - 1); g.quadraticCurveTo(x + 12, y - 8 - schlag, x + 18, y - 2 - schlag); g.quadraticCurveTo(x + 10, y + 1, x + 4, y + 2); g.fill();
  g.fillStyle = '#c39a2c'; g.beginPath(); g.moveTo(x - 2, y + 4); g.lineTo(x, y + 9); g.lineTo(x + 2, y + 4); g.fill();
}
function mauerMalen(g, zustand) {
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, MAUER.breite, MAUER.hoehe);
  g.strokeStyle = 'rgba(91,70,50,.25)'; g.lineWidth = 1.2; // ferne Hügel
  g.beginPath(); g.moveTo(0, 200); g.quadraticCurveTo(120, 150, 240, 190); g.quadraticCurveTo(360, 230, 480, 170); g.stroke();
  const y = MAUER.mauerY;
  g.fillStyle = '#d9cbb0'; g.strokeStyle = SEPIA; g.lineWidth = 1.5;
  g.fillRect(0, y, MAUER.breite, MAUER.hoehe - y);
  for (let x = 0; x < MAUER.breite; x += 32) { g.fillRect(x, y - 10, 18, 10); g.strokeRect(x, y - 10, 18, 10); }
  g.beginPath(); g.moveTo(0, y); g.lineTo(MAUER.breite, y); g.stroke();
  for (let i = 0; i < MAUER.banner; i++) { // Banner rechts unten
    const bx = MAUER.breite - 26 - i * 22, by = y + 8;
    g.strokeStyle = TINTE; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + 22); g.stroke();
    g.fillStyle = i < zustand.banner ? ROT : 'rgba(91,70,50,.25)'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 14, by + 4); g.lineTo(bx, by + 10); g.fill();
  }
  const ax = zustand.x; // Armbrust
  g.strokeStyle = TINTE; g.lineWidth = 3;
  g.beginPath(); g.moveTo(ax, y - 4); g.lineTo(ax, y - 24); g.stroke();
  g.lineWidth = 2.5; g.beginPath(); g.moveTo(ax - 13, y - 12); g.quadraticCurveTo(ax, y - 22, ax + 13, y - 12); g.stroke();
  g.fillStyle = SEPIA; g.fillRect(ax - 6, y - 6, 12, 6);
  g.strokeStyle = TINTE; g.lineWidth = 2;
  for (const b of zustand.bolzen) { g.beginPath(); g.moveTo(b.x, b.y); g.lineTo(b.x, b.y + 12); g.stroke(); g.beginPath(); g.moveTo(b.x - 3, b.y + 3); g.lineTo(b.x, b.y - 1); g.lineTo(b.x + 3, b.y + 3); g.stroke(); }
  for (const r of zustand.raben) rabe(g, r.x, r.y, r.t);
}

const STEINFARBEN = ['#c9b48a', '#b7745e', '#8fa3b5', '#9fae84', '#d1a865', '#a99482', '#c49a9a']; // Sandstein, Ziegel, Schiefer, Moos, Ocker, Tuff, Rosenquarz
function quader(g, x, y, z, farbe) {
  g.fillStyle = farbe; g.fillRect(x, y, z, z);
  g.strokeStyle = SEPIA; g.lineWidth = 1.2; g.strokeRect(x + 0.5, y + 0.5, z - 1, z - 1);
  g.strokeStyle = 'rgba(255,250,235,.55)'; g.beginPath(); g.moveTo(x + 2, y + z - 3); g.lineTo(x + 2, y + 2); g.lineTo(x + z - 3, y + 2); g.stroke();
}
function steinmetzMalen(g, zustand, z) {
  const b = STEIN.spalten * z, hh = STEIN.zeilen * z;
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, g.canvas.width, g.canvas.height);
  g.fillStyle = '#efe5cf'; g.fillRect(0, 0, b, hh);
  g.strokeStyle = 'rgba(91,70,50,.10)'; g.lineWidth = 1;
  for (let x = 0; x <= STEIN.spalten; x++) { g.beginPath(); g.moveTo(x * z, 0); g.lineTo(x * z, hh); g.stroke(); }
  zustand.feld.forEach((reihe, y) => reihe.forEach((f, x) => { if (f !== null) quader(g, x * z, y * z, z, STEINFARBEN[f]); }));
  if (!zustand.vorbei) for (const [x, y] of steinFelder(zustand.stein)) if (y >= 0) quader(g, x * z, y * z, z, STEINFARBEN[zustand.stein.form]);
  g.strokeStyle = SEPIA; g.lineWidth = 2; g.strokeRect(1, 1, b - 2, hh - 2);
  const px = b + 18; // Vorschau
  g.fillStyle = TINTE; g.font = '14px Georgia, serif'; g.fillText('Als Nächstes', px, 24);
  const form = FORMEN[zustand.naechste], k = 16;
  for (const [x, y] of form.felder) quader(g, px + 10 + x * k, 40 + y * k, k, STEINFARBEN[zustand.naechste]);
  g.fillStyle = TINTE; g.fillText('Reihen', px, 140);
  g.font = 'bold 28px Georgia, serif'; g.fillText(String(zustand.punkte), px, 172);
}
function kundschafter(g, x, boden, zustand, t) {
  const hoch = zustand.duckt ? LAUF.ducken : LAUF.stehen, fuss = boden - zustand.y;
  if (zustand.schutz > 0 && Math.floor(t / 120) % 2) return; // blinkt nach einem Treffer
  const schritt = zustand.y > 0 ? 0 : Math.sin(t / 60) * 5;
  g.strokeStyle = TINTE; g.lineWidth = 3; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x, fuss - hoch * 0.45); g.lineTo(x - 4 + schritt, fuss); g.moveTo(x, fuss - hoch * 0.45); g.lineTo(x + 4 - schritt, fuss); g.stroke();
  g.fillStyle = BLAU; g.beginPath(); g.moveTo(x - 7, fuss - hoch * 0.4); g.lineTo(x + 7, fuss - hoch * 0.4); g.lineTo(x + 5, fuss - hoch * 0.85); g.lineTo(x - 5, fuss - hoch * 0.85); g.fill();
  g.fillStyle = '#e9c9a0'; g.beginPath(); g.arc(x + 1, fuss - hoch + 5, 5, 0, Math.PI * 2); g.fill();
  g.fillStyle = ROT; g.beginPath(); g.moveTo(x - 6, fuss - hoch + 3); g.lineTo(x + 7, fuss - hoch + 3); g.lineTo(x - 2, fuss - hoch - 5); g.fill();
  g.lineCap = 'butt';
}
function laufMalen(g, zustand, t) {
  const boden = LAUF.bodenY;
  g.fillStyle = PERGAMENT; g.fillRect(0, 0, LAUF.breite, LAUF.hoehe);
  const fern = (zustand.strecke * 0.2) % 320; // ferne Hügel ziehen langsamer vorbei
  g.strokeStyle = 'rgba(91,70,50,.22)'; g.lineWidth = 1.2; g.beginPath();
  for (let x = -fern; x < LAUF.breite + 320; x += 320) { g.moveTo(x, 120); g.quadraticCurveTo(x + 80, 70, x + 160, 115); g.quadraticCurveTo(x + 240, 150, x + 320, 120); }
  g.stroke();
  g.strokeStyle = SEPIA; g.lineWidth = 2; g.beginPath(); g.moveTo(0, boden); g.lineTo(LAUF.breite, boden); g.stroke();
  const strich = zustand.strecke % 40; g.lineWidth = 1; g.strokeStyle = 'rgba(91,70,50,.35)';
  for (let x = -strich; x < LAUF.breite; x += 40) { g.beginPath(); g.moveTo(x, boden + 9); g.lineTo(x + 12, boden + 9); g.stroke(); }
  const naechsteMeile = (Math.floor(zustand.strecke / LAUF.meile) + 1) * LAUF.meile; // Meilenstein am Wegrand
  const mx = LAUF.x + (naechsteMeile - zustand.strecke);
  if (mx < LAUF.breite + 20) { g.fillStyle = '#d9cbb0'; g.strokeStyle = SEPIA; g.fillRect(mx - 6, boden - 16, 12, 16); g.strokeRect(mx - 6, boden - 16, 12, 16); }
  for (const h of zustand.hindernisse) {
    g.strokeStyle = SEPIA; g.lineWidth = 1.5;
    if (h.art === 'stein') { g.fillStyle = '#bfae92'; g.beginPath(); g.moveTo(h.x, boden); g.quadraticCurveTo(h.x + 2, boden - h.hoehe, h.x + h.breite / 2, boden - h.hoehe); g.quadraticCurveTo(h.x + h.breite, boden - h.hoehe + 2, h.x + h.breite, boden); g.fill(); g.stroke(); }
    else if (h.art === 'zaun') { g.strokeStyle = '#7a5a3a'; g.lineWidth = 3; for (const dx of [3, h.breite / 2, h.breite - 3]) { g.beginPath(); g.moveTo(h.x + dx, boden); g.lineTo(h.x + dx, boden - h.hoehe); g.stroke(); } g.lineWidth = 2.5; for (const dy of [10, 22]) { g.beginPath(); g.moveTo(h.x, boden - dy); g.lineTo(h.x + h.breite, boden - dy); g.stroke(); } }
    else if (h.art === 'graben') { g.fillStyle = PERGAMENT; g.fillRect(h.x, boden - 1, h.breite, 4); g.fillStyle = BLAU; g.globalAlpha = 0.5; g.fillRect(h.x + 2, boden + 2, h.breite - 4, 12); g.globalAlpha = 1; g.strokeRect(h.x, boden, h.breite, 14); }
    else rabe(g, h.x + h.breite / 2, boden - h.ueber - h.hoehe / 2, t / 1000);
  }
  kundschafter(g, LAUF.x, boden, zustand, t);
  for (let i = 0; i < LAUF.banner; i++) {
    const bx = LAUF.breite - 26 - i * 22, by = 12;
    g.strokeStyle = TINTE; g.lineWidth = 1.5; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + 22); g.stroke();
    g.fillStyle = i < zustand.banner ? ROT : 'rgba(91,70,50,.25)'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 14, by + 4); g.lineTo(bx, by + 10); g.fill();
  }
}
function kellerMalen(g, zustand, t) {
  const z = KELLER.zelle, plan = zustand.plan;
  g.fillStyle = '#e8dcc2'; g.fillRect(0, 0, g.canvas.width, g.canvas.height);
  plan.forEach((reihe, y) => [...reihe].forEach((c, x) => {
    if (c !== '#') return;
    g.fillStyle = '#8c7457'; g.fillRect(x * z, y * z, z, z);
    g.strokeStyle = 'rgba(47,40,32,.45)'; g.lineWidth = 1; // Fugen der Kellermauer
    g.beginPath(); g.moveTo(x * z, y * z + z / 2); g.lineTo(x * z + z, y * z + z / 2); const v = (x + y) % 2 ? z / 2 : z / 4;
    g.moveTo(x * z + v, y * z); g.lineTo(x * z + v, y * z + z / 2); g.moveTo(x * z + (v + z / 2) % z, y * z + z / 2); g.lineTo(x * z + (v + z / 2) % z, y * z + z); g.stroke();
  }));
  const [tx, ty] = zustand.treppe; // Treppe: zu, bis alle Rollen gefunden sind
  if (!zustand.rollen.length) { g.fillStyle = SEPIA; for (let i = 0; i < 4; i++) g.fillRect(tx * z + 3 + i * 2, ty * z + 4 + i * 4, z - 6 - i * 4, 3); }
  else { g.strokeStyle = 'rgba(91,70,50,.35)'; g.strokeRect(tx * z + 4, ty * z + 4, z - 8, z - 8); }
  for (const [x, y] of zustand.loecher) { g.fillStyle = 'rgba(47,40,32,.35)'; g.beginPath(); g.ellipse(x * z + z / 2, y * z + z - 5, 6, 3, 0, 0, Math.PI * 2); g.fill(); }
  for (const [x, y] of zustand.rollen) { // Pergamentrolle
    const mx = x * z + z / 2, my = y * z + z / 2;
    g.fillStyle = '#fffaf0'; g.strokeStyle = SEPIA; g.lineWidth = 1.2; g.fillRect(mx - 7, my - 4, 14, 8); g.strokeRect(mx - 7, my - 4, 14, 8);
    g.fillStyle = '#d9cbb0'; g.beginPath(); g.arc(mx - 7, my, 4, 0, Math.PI * 2); g.arc(mx + 7, my, 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = ROT; g.fillRect(mx - 1, my - 4, 2, 8);
  }
  for (const r of zustand.ratten) { // Ratte mit Schwanz
    const mx = r.pos[0] * z + z / 2, my = r.pos[1] * z + z / 2, [dx, dy] = r.richtung ?? [1, 0];
    g.strokeStyle = '#5a5048'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(mx - dx * 6, my - dy * 6); g.quadraticCurveTo(mx - dx * 12 + dy * 4, my - dy * 12 + dx * 4, mx - dx * 14, my - dy * 14); g.stroke();
    g.fillStyle = '#6f655c'; g.beginPath(); g.ellipse(mx, my, dx ? 8 : 5, dx ? 5 : 8, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = TINTE; g.beginPath(); g.arc(mx + dx * 6, my + dy * 6, 1.6, 0, Math.PI * 2); g.fill();
  }
  if (!(zustand.pause > 0 && Math.floor(t / 150) % 2)) { // Kundschafter, blinkt beim Betreten
    const mx = zustand.pos[0] * z + z / 2, my = zustand.pos[1] * z + z / 2;
    g.fillStyle = BLAU; g.strokeStyle = TINTE; g.lineWidth = 1.5; g.beginPath(); g.arc(mx, my + 2, 7, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = ROT; g.beginPath(); g.moveTo(mx - 7, my - 2); g.lineTo(mx + 7, my - 2); g.lineTo(mx, my - 11); g.fill();
  }
  const unten = plan.length * z; // Leiste unten: Keller und Banner
  g.fillStyle = PERGAMENT; g.fillRect(0, unten, g.canvas.width, 28);
  g.fillStyle = TINTE; g.font = '14px Georgia, serif'; g.fillText(`Keller ${zustand.keller} · noch ${zustand.rollen.length} Rollen${zustand.rollen.length ? '' : ': zur Treppe!'}`, 8, unten + 19);
  for (let i = 0; i < KELLER.banner; i++) {
    const bx = g.canvas.width - 26 - i * 22, by = unten + 4;
    g.strokeStyle = TINTE; g.lineWidth = 1.5; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by + 20); g.stroke();
    g.fillStyle = i < zustand.banner ? ROT : 'rgba(91,70,50,.25)'; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx + 14, by + 4); g.lineTo(bx, by + 10); g.fill();
  }
}

// Wie jedes Belohnungsspiel aufgebaut, bewegt und gezeichnet wird.
const ARTEN = {
  botenritt: {
    groesse: () => [RITT.spalten * 20, RITT.zeilen * 20], neu: (zufall) => neuerRitt(zufall), taste: lenkeRitt,
    schritt: (zustand, dt, tasten, zufall) => {
      zustand.sammel = (zustand.sammel ?? 0) + dt;
      while (zustand.sammel >= rittTakt(zustand) && !zustand.vorbei) { zustand.sammel -= rittTakt(zustand); rittSchritt(zustand, zufall); }
    },
    malen: (g, zustand) => rittMalen(g, zustand, 20),
  },
  burgmauer: {
    groesse: () => [MAUER.breite, MAUER.hoehe], neu: () => neueMauer(),
    schritt: (zustand, dt, tasten, zufall) => mauerSchritt(zustand, dt, { links: tasten.ArrowLeft, rechts: tasten.ArrowRight, schiessen: tasten.ArrowUp }, zufall),
    malen: mauerMalen,
  },
  steinmetz: {
    groesse: () => [STEIN.spalten * 20 + 130, STEIN.zeilen * 20], neu: (zufall) => neuerSteinmetz(zufall), taste: lenkeStein,
    schritt: (zustand, dt, tasten, zufall) => steinmetzSchritt(zustand, dt, { runter: tasten.ArrowDown }, zufall),
    malen: (g, zustand) => steinmetzMalen(g, zustand, 20),
  },
  grenzlauf: {
    groesse: () => [LAUF.breite, LAUF.hoehe], neu: () => neuerLauf(),
    schritt: (zustand, dt, tasten, zufall) => laufSchritt(zustand, dt, { springen: tasten.ArrowUp, ducken: tasten.ArrowDown }, zufall),
    malen: laufMalen,
  },
  kellerjagd: {
    groesse: () => [KELLERPLAENE[0][0].length * KELLER.zelle, KELLERPLAENE[0].length * KELLER.zelle + 28], neu: () => neueKellerjagd(), taste: lenkeKeller,
    schritt: (zustand, dt, tasten, zufall) => kellerSchritt(zustand, dt, zufall),
    malen: kellerMalen,
  },
};
export const SPIEL_ARTEN = Object.keys(ARTEN);

// Startet ein Belohnungsspiel auf `canvas`. melde(stand) bekommt { punkte, rest, vorbei, banner } nach jedem Bild.
// Die Runde endet nach `sekunden` oder wenn das Spiel vorbei ist. Liefert eine Funktion zum Abbrechen.
export function starteSpiel(id, canvas, { sekunden = 180, melde = () => {}, zufall = Math.random } = {}) {
  const art = ARTEN[id];
  const g = canvas.getContext('2d');
  const ende = Date.now() + sekunden * 1000;
  const tasten = {};
  [canvas.width, canvas.height] = art.groesse();
  const zustand = art.neu(zufall);
  let letzte = performance.now(), laeuft = true, rahmen = 0;
  const unten = (e) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    tasten[e.key] = true;
    art.taste?.(zustand, e.key);
  };
  const oben = (e) => { tasten[e.key] = false; };
  window.addEventListener('keydown', unten);
  window.addEventListener('keyup', oben);
  const stopp = () => { laeuft = false; cancelAnimationFrame(rahmen); window.removeEventListener('keydown', unten); window.removeEventListener('keyup', oben); };
  const bild = (t) => {
    if (!laeuft) return;
    const dt = Math.min(100, t - letzte); letzte = t;
    art.schritt(zustand, dt, tasten, zufall);
    art.malen(g, zustand, t);
    const rest = Math.max(0, Math.ceil((ende - Date.now()) / 1000));
    const vorbei = zustand.vorbei || rest === 0;
    melde({ punkte: zustand.punkte, rest, vorbei, banner: zustand.banner });
    if (vorbei) stopp(); else rahmen = requestAnimationFrame(bild);
  };
  rahmen = requestAnimationFrame(bild);
  return stopp;
}
