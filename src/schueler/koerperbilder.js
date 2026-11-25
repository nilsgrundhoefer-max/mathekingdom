// Klasse 6, Kapitel 3 „Körper“ (ADR 0045): Körper im Schrägbild, Würfelbauten, Netze und Ansichten (Risse).
// Grilling mit Nils, 2026-11-25:
// - Schrägbild in 45°: Die Vorderfläche hat ihre wahre Größe, 1 cm Tiefe ist eine Kästchendiagonale (halbe Länge nach rechts und oben).
// - Verdeckte Kanten sind gestrichelt. Die Ecken des Quaders heißen unten ABCD gegen den Uhrzeigersinn, vorne links beginnend, oben EFGH.
// - Würfelbauten haben drei Töne: vorne, oben und rechts. Zylinder, Kegel und Kugel haben Ellipsen, die hintere Hälfte gestrichelt.
// Ein Körper ist reine Beschreibung (Maße in cm). Das Bild rechnet die Ecken selbst aus; tools/pruefe-koerper.mjs rechnet unabhängig nach.
//
// b: { art: 'koerper', form: 'quader' | 'prisma' | 'pyramide' | 'zylinder' | 'kegel' | 'kugel' | 'wuerfelbau',
//      a, b, c (Quader: Länge, Tiefe, Höhe), n, r, h, dreh, liegend (Prisma, Pyramide), r, h (rund), wuerfel: [[x, y, z]] (Würfelbau),
//      namen?: true, verdeckt?: 'gestrichelt' | 'ohne' | 'durchgezogen', tiefe?: 0.5 (nur für Fehlerbilder anders),
//      markiert?: { ecken?: [n], kanten?: [[n, n]], flaechen?: [[n, …]] }, masse?: [{ von, bis, t }], augen?: { oben, vorne, rechts }, vorne?: true, titel? }
// b: { art: 'netz', flaechen: [{ ecken: [[x, y]], n?, farbe? }], kreise?: [{ m, r, n? }], sektoren?: [{ m, r, von, bis, n? }], titel? }  (Einheit Kästchen)
// b: { art: 'risse', risse: [{ n, b, h, zellen: [[x, y]], zahlen?: [[x, y, z]] }] }  (Kästchen, x nach rechts, y nach oben)
import { h, s } from './dom.js';

const Z = (x) => Math.round(x * 100) / 100;
export const TIEFE = 0.5; // 1 cm nach hinten wird eine halbe Kästchendiagonale, also 0,5 cm nach rechts und 0,5 cm nach oben
const BUCHSTABEN = 'ABCDEFGHIJKLMNOPQR';

// ---------- Geometrie der eckigen Körper ----------
const rad = (g) => (g * Math.PI) / 180;
function ring(n, r, dreh, ebene, verschoben) {
  // Ein regelmäßiges n-Eck. Die erste Seite liegt vorne (oder unten) und waagerecht, die Ecken laufen gegen den Uhrzeigersinn.
  const p = [];
  for (let i = 0; i < n; i++) {
    const w = rad(-90 - 180 / n + (i * 360) / n + dreh);
    const u = r + r * Math.cos(w), v = r + r * Math.sin(w);
    p.push(ebene === 'xz' ? [u, verschoben, v] : [u, v, verschoben]);
  }
  return p;
}
export function eckigerKoerper(b) {
  const punkte = new Map(), flaechen = [];
  const setze = (liste, start) => liste.map((p, i) => { const n = BUCHSTABEN[start + i]; punkte.set(n, p); return n; });
  if (b.form === 'quader') {
    const { a, b: t, c } = b;
    const unten = setze([[0, 0, 0], [a, 0, 0], [a, t, 0], [0, t, 0]], 0), oben = setze([[0, 0, c], [a, 0, c], [a, t, c], [0, t, c]], 4);
    flaechen.push(unten, oben, ...unten.map((x, i) => [x, unten[(i + 1) % 4], oben[(i + 1) % 4], oben[i]]));
  } else if (b.form === 'prisma') {
    const liegend = Boolean(b.liegend), e = liegend ? 'xz' : 'xy';
    const unten = setze(ring(b.n, b.r, b.dreh ?? 0, e, 0), 0), oben = setze(ring(b.n, b.r, b.dreh ?? 0, e, b.h), b.n);
    flaechen.push(unten, oben, ...unten.map((x, i) => [x, unten[(i + 1) % b.n], oben[(i + 1) % b.n], oben[i]]));
  } else if (b.form === 'pyramide') {
    const unten = setze(ring(b.n, b.r, b.dreh ?? 0, 'xy', 0), 0);
    punkte.set('S', [b.r, b.r, b.h]);
    flaechen.push(unten, ...unten.map((x, i) => [x, unten[(i + 1) % b.n], 'S']));
  } else return null;
  const kanten = [];
  for (const f of flaechen) f.forEach((x, i) => { const y = f[(i + 1) % f.length]; if (!kanten.some(([p, q]) => (p === x && q === y) || (p === y && q === x))) kanten.push([x, y]); });
  return { punkte, flaechen, kanten };
}
const minus = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const kreuz = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const skal = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const mitte3 = (liste) => liste.reduce((s, p) => [s[0] + p[0] / liste.length, s[1] + p[1] / liste.length, s[2] + p[2] / liste.length], [0, 0, 0]);
// Blickrichtung des Schrägbilds: Ein Punkt weiter hinten (größeres y) liegt im Bild weiter rechts und oben.
const blick = (q) => [-q, 1, -q];
export function sichtbarkeit(k, q = TIEFE) {
  const m = mitte3([...k.punkte.values()]);
  const sicht = k.flaechen.map((f) => {
    const p = f.map((n) => k.punkte.get(n));
    let nv = kreuz(minus(p[1], p[0]), minus(p[2], p[0]));
    if (skal(nv, minus(mitte3(p), m)) < 0) nv = nv.map((x) => -x);
    return skal(nv, blick(q)) < -1e-9;
  });
  const verdeckt = k.kanten.map(([x, y]) => !k.flaechen.some((f, i) => sicht[i] && f.includes(x) && f.includes(y) && Math.abs(f.indexOf(x) - f.indexOf(y)) % (f.length - 1) <= 1 && (Math.abs(f.indexOf(x) - f.indexOf(y)) === 1 || Math.abs(f.indexOf(x) - f.indexOf(y)) === f.length - 1)));
  const sichtbarePunkte = new Set(k.kanten.filter((_, i) => !verdeckt[i]).flat());
  return { flaechen: sicht, kanten: verdeckt, verdeckteEcken: [...k.punkte.keys()].filter((n) => !sichtbarePunkte.has(n)) };
}

// ---------- Zeichnen ----------
const RAND = 30, KMAX = 64, BREITE = 300, HOEHE = 210;
function rahmen(punkte2, { breite = BREITE, hoehe = HOEHE, kmax = KMAX, rand = RAND } = {}) {
  const xs = punkte2.map((p) => p[0]), ys = punkte2.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min(kmax, breite / Math.max(x1 - x0, 1e-6), hoehe / Math.max(y1 - y0, 1e-6));
  const B = Math.max(2 * rand + (x1 - x0) * k, 160), H = 2 * rand + (y1 - y0) * k, dx = (B - 2 * rand - (x1 - x0) * k) / 2;
  return { k, B: Z(B), H: Z(H), X: (x) => Z(rand + dx + (x - x0) * k), Y: (y) => Z(rand + (y1 - y) * k) };
}
const pfad = (m, liste) => `M${liste.map((p) => `${m.X(p[0])} ${m.Y(p[1])}`).join(' L')} Z`;
const svgVon = (m, klasse, titel) => {
  const svg = s('svg', { class: `koerperbild ${klasse}`, viewBox: `0 0 ${m.B} ${m.H}`, role: 'img', 'aria-label': titel });
  svg.style.maxWidth = `${m.B}px`;
  svg.append(s('rect', { x: 0, y: 0, width: m.B, height: m.H, class: 'blatt' }));
  return svg;
};
const TON = (nv) => (nv[2] > 0.5 ? 'oben' : nv[1] < -0.5 ? 'vorne' : nv[0] > 0.3 ? 'rechts' : 'schraeg');

function eckigBild(b) {
  const k = eckigerKoerper(b), q = b.tiefe ?? TIEFE, P = (p) => [p[0] + q * p[1], p[2] + q * p[1]];
  const alle = [...k.punkte.values()].map(P), m = rahmen(alle, b.masse?.length ? { rand: 46 } : {});
  const sicht = sichtbarkeit(k, q), mark = b.markiert ?? {};
  const svg = svgVon(m, `form-${b.form}`, beschreibung(b));
  const markFl = (f) => (mark.flaechen ?? []).some((g) => g.length === f.length && g.every((n) => f.includes(n)));
  const mc = mitte3([...k.punkte.values()]);
  k.flaechen.forEach((f, i) => {
    if (!sicht.flaechen[i] && !markFl(f)) return;
    const p = f.map((n) => k.punkte.get(n));
    let nv = kreuz(minus(p[1], p[0]), minus(p[2], p[0])); if (skal(nv, minus(mitte3(p), mc)) < 0) nv = nv.map((x) => -x);
    const l = Math.hypot(...nv);
    svg.append(s('path', { d: pfad(m, p.map(P)), class: `flaeche ton-${TON(nv.map((x) => x / l))}${markFl(f) ? ' markiert' : ''}${sicht.flaechen[i] ? '' : ' hinten'}` }));
  });
  const markK = (x, y) => (mark.kanten ?? []).some(([p, r]) => (p === x && r === y) || (p === y && r === x));
  const linien = [];
  k.kanten.forEach(([x, y], i) => {
    const hinten = sicht.kanten[i];
    if (hinten && b.verdeckt === 'ohne') return;
    const p = P(k.punkte.get(x)), r = P(k.punkte.get(y));
    const kl = `kante${hinten && b.verdeckt !== 'durchgezogen' ? ' verdeckt' : ''}${markK(x, y) ? ' markiert' : ''}`;
    linien.push(s('line', { x1: m.X(p[0]), y1: m.Y(p[1]), x2: m.X(r[0]), y2: m.Y(r[1]), class: kl, 'data-kante': `${x}${y}` }));
  });
  // Verdeckte Kanten zuerst, damit sichtbare über ihnen liegen.
  linien.sort((u, v) => (u.getAttribute('class').includes('verdeckt') ? 0 : 1) - (v.getAttribute('class').includes('verdeckt') ? 0 : 1));
  svg.append(...linien);
  const c2 = P(mc);
  const texte = [];
  for (const [n, p3] of k.punkte) {
    const p = P(p3);
    if ((mark.ecken ?? []).includes(n) || b.alleEcken) svg.append(s('circle', { cx: m.X(p[0]), cy: m.Y(p[1]), r: 4.2, class: `ecke markiert${sicht.verdeckteEcken.includes(n) ? ' hinten' : ''}` }));
    if (!b.namen) continue;
    texte.push(b.form === 'quader' ? festerName(m, p, n) : namenText(m, p, c2, n, k, P));
  }
  for (const ms of b.masse ?? []) texte.push(massText(m, P(k.punkte.get(ms.von)), P(k.punkte.get(ms.bis)), c2, ms.t));
  if (b.augen) texte.push(...augenTexte(m, k, P, b.augen));
  if (b.vorne) texte.push(...vornePfeil(m, k, P));
  svg.append(...texte.flat());
  return svg;
}
// Der Name einer Ecke steht außen: in der Richtung vom Mittelpunkt des Körpers weg, um die Kanten an dieser Ecke herum gedreht.
function namenText(m, p, c2, n, k, P) {
  const richt = (u) => Math.atan2(u[1], u[0]);
  const raus = richt([p[0] - c2[0], p[1] - c2[1]]);
  const kantenRicht = k.kanten.filter((e) => e.includes(n)).map((e) => { const o = P(k.punkte.get(e[0] === n ? e[1] : e[0])); return richt([o[0] - p[0], o[1] - p[1]]); });
  // Die Richtung mit dem größten Abstand zu allen Kanten, nahe an „raus“.
  let best = raus, gut = -1;
  for (let d = -80; d <= 80; d += 5) {
    const w = raus + rad(d), abst = Math.min(...kantenRicht.map((x) => { const t = Math.abs(((w - x) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); return t; }));
    const wert = abst - Math.abs(rad(d)) * 0.25;
    if (wert > gut) { gut = wert; best = w; }
  }
  const x = m.X(p[0]) + 15 * Math.cos(best), y = m.Y(p[1]) - 15 * Math.sin(best);
  return s('text', { x: Z(x), y: Z(y + 5.5), 'text-anchor': 'middle', class: 'punktname' }, n);
}
// Beim Quader stehen die Namen fest: D und F liegen im Bild innerhalb der Vorderfläche, ihre Namen stehen dort neben der Ecke.
const QUADERNAMEN = { A: 225, B: 315, C: 0, D: 135, E: 180, F: 225, G: 45, H: 135 };
function festerName(m, p, n) {
  const w = rad(QUADERNAMEN[n]), x = m.X(p[0]) + 14 * Math.cos(w), y = m.Y(p[1]) - 14 * Math.sin(w);
  return s('text', { x: Z(x), y: Z(y + 5.5), 'text-anchor': 'middle', class: 'punktname' }, n);
}
function massText(m, p, r, c2, t) {
  const mx = (p[0] + r[0]) / 2, my = (p[1] + r[1]) / 2, d = [r[0] - p[0], r[1] - p[1]], l = Math.hypot(...d) || 1;
  let nv = [-d[1] / l, d[0] / l];
  if (nv[0] * (mx - c2[0]) + nv[1] * (my - c2[1]) < 0) nv = [-nv[0], -nv[1]];
  const breit = 6 + 4.3 * t.length, abst = 10 + Math.abs(nv[0]) * breit / 2 + Math.abs(nv[1]) * 7;
  return s('text', { x: Z(m.X(mx) + abst * nv[0]), y: Z(m.Y(my) - abst * nv[1] + 5), 'text-anchor': 'middle', class: 'masszahl' }, t);
}
function augenTexte(m, k, P, augen) {
  const fl = { oben: ['E', 'F', 'G', 'H'], vorne: ['A', 'B', 'F', 'E'], rechts: ['B', 'C', 'G', 'F'] };
  return Object.entries(augen).filter(([, z]) => z != null).map(([w, z]) => { const c = P(mitte3(fl[w].map((n) => k.punkte.get(n)))); return s('text', { x: m.X(c[0]), y: Z(m.Y(c[1]) + 7), 'text-anchor': 'middle', class: 'augenzahl' }, String(z)); });
}
function vornePfeil(m, k, P) {
  const ps = [...k.punkte.values()], x0 = Math.min(...ps.map((p) => p[0])), x1 = Math.max(...ps.map((p) => p[0]));
  const u = P([(x0 + x1) / 2, 0, 0]);
  const x = m.X(u[0]), y = m.Y(u[1]) + 8;
  return [s('path', { d: `M${x} ${y + 16} L${x} ${y + 2} M${x - 5} ${y + 8} L${x} ${y + 2} L${x + 5} ${y + 8}`, class: 'pfeil' }), s('text', { x: x + 8, y: y + 18, class: 'bildtext' }, 'vorne')];
}

// ---------- Würfelbau ----------
export function wuerfelbauBild(b, { klein = false } = {}) {
  const q = TIEFE, P = (p) => [p[0] + q * p[1], p[2] + q * p[1]];
  const ecken = b.wuerfel.flatMap(([x, y, z]) => [[x, y, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1], [x + 1, y, z]]).map(P);
  const m = rahmen(ecken, klein ? { breite: 150, hoehe: 120, kmax: 30, rand: 14 } : { kmax: 40 });
  const svg = svgVon(m, 'form-wuerfelbau', beschreibung(b));
  const sortiert = [...b.wuerfel].sort((u, v) => v[1] - u[1] || u[2] - v[2] || u[0] - v[0]);
  for (const [x, y, z] of sortiert) {
    const vorne = [[x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]], oben = [[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], rechts = [[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]];
    for (const [f, t] of [[vorne, 'vorne'], [oben, 'oben'], [rechts, 'rechts']]) svg.append(s('path', { d: pfad(m, f.map(P)), class: `wuerfelflaeche ton-${t}` }));
  }
  if (b.vorne) svg.append(...vornePfeil(m, { punkte: new Map(b.wuerfel.flatMap(([x, y, z]) => [[`${x}${y}${z}a`, [x, y, z]], [`${x}${y}${z}b`, [x + 1, y, z]]])) }, P));
  return svg;
}

// ---------- Runde Körper ----------
// Ellipsen ohne Schrägbild: Die Grundfläche ist eine liegende Ellipse (Höhe 0,4 · Radius), die hintere Hälfte ist gestrichelt.
function rundBild(b) {
  const r = b.r, ry = 0.4 * r, hoch = b.form === 'kugel' ? 2 * r : b.h;
  const m = rahmen([[-r, -ry], [r, -ry], [r, hoch + (b.form === 'zylinder' ? ry : 0)], [-r, hoch]], { kmax: 40 });
  const svg = svgVon(m, `form-${b.form}`, beschreibung(b));
  const bogen = (cy, von, bis, kl) => { // Ellipsenbogen von Winkel von bis bis (Grad, gegen den Uhrzeigersinn, 0 rechts)
    const pkt = []; for (let i = 0; i <= 48; i++) { const w = rad(von + ((bis - von) * i) / 48); pkt.push([r * Math.cos(w), cy + ry * Math.sin(w)]); }
    return s('path', { d: `M${pkt.map((p) => `${m.X(p[0])} ${m.Y(p[1])}`).join(' L')}`, class: kl });
  };
  const ell = (cy, kl) => s('ellipse', { cx: m.X(0), cy: m.Y(cy), rx: Z(r * m.k), ry: Z(ry * m.k), class: kl });
  if (b.form === 'zylinder') {
    svg.append(s('path', { d: `M${m.X(-r)} ${m.Y(0)} L${m.X(-r)} ${m.Y(b.h)} L${m.X(r)} ${m.Y(b.h)} L${m.X(r)} ${m.Y(0)} A${Z(r * m.k)} ${Z(ry * m.k)} 0 0 1 ${m.X(-r)} ${m.Y(0)} Z`, class: 'flaeche ton-vorne' }));
    svg.append(ell(b.h, `flaeche ton-oben${b.markiert?.flaechen?.includes('oben') ? ' markiert' : ''}`));
    svg.append(bogen(0, 0, 180, 'kante verdeckt'), bogen(0, 180, 360, 'kante'));
    svg.append(s('line', { x1: m.X(-r), y1: m.Y(0), x2: m.X(-r), y2: m.Y(b.h), class: 'kante' }), s('line', { x1: m.X(r), y1: m.Y(0), x2: m.X(r), y2: m.Y(b.h), class: 'kante' }), ell(b.h, 'kante rund'));
  } else if (b.form === 'kegel') {
    const H = b.h, yt = (ry * ry) / H, xt = r * Math.sqrt(Math.max(0, 1 - (yt * yt) / (ry * ry))), wt = (Math.atan2(yt / ry, xt / r) * 180) / Math.PI;
    svg.append(s('path', { d: `M${m.X(-xt)} ${m.Y(yt)} L${m.X(0)} ${m.Y(H)} L${m.X(xt)} ${m.Y(yt)} A${Z(r * m.k)} ${Z(ry * m.k)} 0 1 1 ${m.X(-xt)} ${m.Y(yt)} Z`, class: 'flaeche ton-vorne' }));
    svg.append(bogen(0, wt, 180 - wt, 'kante verdeckt'), bogen(0, 180 - wt, 360 + wt, 'kante'));
    svg.append(s('line', { x1: m.X(-xt), y1: m.Y(yt), x2: m.X(0), y2: m.Y(H), class: 'kante' }), s('line', { x1: m.X(xt), y1: m.Y(yt), x2: m.X(0), y2: m.Y(H), class: 'kante' }));
    if (b.spitze) svg.append(s('circle', { cx: m.X(0), cy: m.Y(H), r: 4.2, class: 'ecke markiert' }));
  } else {
    svg.append(s('circle', { cx: m.X(0), cy: m.Y(r), r: Z(r * m.k), class: 'flaeche ton-vorne kante' }));
    svg.append(bogen(r, 0, 180, 'kante verdeckt duenn'), bogen(r, 180, 360, 'kante duenn'));
  }
  return svg;
}

// ---------- Netz ----------
export function netzSvg(b, { klein = false } = {}) {
  const punkte = [...(b.flaechen ?? []).flatMap((f) => f.ecken), ...(b.kreise ?? []).flatMap((k) => [[k.m[0] - k.r, k.m[1] - k.r], [k.m[0] + k.r, k.m[1] + k.r]]),
    ...(b.sektoren ?? []).flatMap((k) => { const p = [k.m]; for (let i = 0; i <= 24; i++) { const w = rad(k.von + ((k.bis - k.von) * i) / 24); p.push([k.m[0] + k.r * Math.cos(w), k.m[1] + k.r * Math.sin(w)]); } return p; })];
  const m = rahmen(punkte, klein ? { breite: 150, hoehe: 120, kmax: 28, rand: 10 } : { breite: 320, hoehe: 240, kmax: 42, rand: 16 });
  const svg = svgVon(m, `netzbild${klein ? ' klein' : ''}`, beschreibung(b));
  // Karolinien unter dem Netz, eine Linie je Kästchen.
  const xs = punkte.map((p) => p[0]), ys = punkte.map((p) => p[1]);
  const gx0 = Math.floor(Math.min(...xs)) - 1, gx1 = Math.ceil(Math.max(...xs)) + 1, gy0 = Math.floor(Math.min(...ys)) - 1, gy1 = Math.ceil(Math.max(...ys)) + 1;
  for (let x = gx0; x <= gx1; x++) svg.append(s('line', { x1: m.X(x), y1: 0, x2: m.X(x), y2: m.H, class: 'karo' }));
  for (let y = gy0; y <= gy1; y++) svg.append(s('line', { x1: 0, y1: m.Y(y), x2: m.B, y2: m.Y(y), class: 'karo' }));
  const namen = [];
  for (const f of b.flaechen ?? []) {
    svg.append(s('path', { d: pfad(m, f.ecken), class: `netzflaeche${f.farbe != null ? ` farbe-${f.farbe}` : ''}` }));
    if (f.n != null) { const c = f.ecken.reduce((a, p) => [a[0] + p[0] / f.ecken.length, a[1] + p[1] / f.ecken.length], [0, 0]); namen.push(s('text', { x: m.X(c[0]), y: Z(m.Y(c[1]) + 6), 'text-anchor': 'middle', class: 'netzname' }, String(f.n))); }
  }
  for (const k of b.kreise ?? []) {
    svg.append(s('circle', { cx: m.X(k.m[0]), cy: m.Y(k.m[1]), r: Z(k.r * m.k), class: 'netzflaeche' }));
    if (k.n != null) namen.push(s('text', { x: m.X(k.m[0]), y: Z(m.Y(k.m[1]) + 6), 'text-anchor': 'middle', class: 'netzname' }, String(k.n)));
  }
  for (const k of b.sektoren ?? []) {
    const a = [k.m[0] + k.r * Math.cos(rad(k.von)), k.m[1] + k.r * Math.sin(rad(k.von))], e = [k.m[0] + k.r * Math.cos(rad(k.bis)), k.m[1] + k.r * Math.sin(rad(k.bis))];
    svg.append(s('path', { d: `M${m.X(k.m[0])} ${m.Y(k.m[1])} L${m.X(a[0])} ${m.Y(a[1])} A${Z(k.r * m.k)} ${Z(k.r * m.k)} 0 ${k.bis - k.von > 180 ? 1 : 0} 0 ${m.X(e[0])} ${m.Y(e[1])} Z`, class: 'netzflaeche' }));
  }
  svg.append(...namen);
  return svg;
}

// ---------- Risse (Ansichten) ----------
export function risseSvg(b, { klein = false } = {}) {
  const u = klein ? 18 : 32, abstand = 28, unten = 26, rand = 8;
  const breiten = b.risse.map((r) => r.b * u), B = Math.max(rand * 2 + breiten.reduce((x, y) => x + y, 0) + abstand * (b.risse.length - 1), 120), H = rand * 2 + Math.max(...b.risse.map((r) => r.h)) * u + (b.risse.some((r) => r.n) ? unten : 0);
  const svg = s('svg', { class: `koerperbild rissebild${klein ? ' klein' : ''}`, viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': beschreibung(b) });
  svg.style.maxWidth = `${B}px`;
  svg.append(s('rect', { x: 0, y: 0, width: B, height: H, class: 'blatt' }));
  let x0 = (B - (breiten.reduce((x, y) => x + y, 0) + abstand * (b.risse.length - 1))) / 2;
  const hMax = Math.max(...b.risse.map((r) => r.h));
  for (const r of b.risse) {
    const y0 = rand + (hMax - r.h) * u, X = (x) => Z(x0 + x * u), Y = (y) => Z(y0 + (r.h - y) * u);
    for (const [x, y] of r.zellen) svg.append(s('rect', { x: X(x), y: Y(y + 1), width: u, height: u, class: 'risszelle' }));
    for (let x = 0; x <= r.b; x++) svg.append(s('line', { x1: X(x), y1: Y(0), x2: X(x), y2: Y(r.h), class: 'karo' }));
    for (let y = 0; y <= r.h; y++) svg.append(s('line', { x1: X(0), y1: Y(y), x2: X(r.b), y2: Y(y), class: 'karo' }));
    // Umriss der gefärbten Kästchen: jede Kante, an der ein gefärbtes an ein leeres Kästchen grenzt.
    const voll = new Set(r.zellen.map(String));
    for (const [x, y] of r.zellen) for (const [dx, dy, l] of [[0, -1, [[x, y], [x + 1, y]]], [0, 1, [[x, y + 1], [x + 1, y + 1]]], [-1, 0, [[x, y], [x, y + 1]]], [1, 0, [[x + 1, y], [x + 1, y + 1]]]]) {
      if (!voll.has(String([x + dx, y + dy]))) svg.append(s('line', { x1: X(l[0][0]), y1: Y(l[0][1]), x2: X(l[1][0]), y2: Y(l[1][1]), class: 'rissrand' }));
    }
    for (const [x, y, z] of r.zahlen ?? []) svg.append(s('text', { x: Z(X(x) + u / 2), y: Z(Y(y) - u / 2 + 6), 'text-anchor': 'middle', class: 'risszahl' }, String(z)));
    if (r.n) svg.append(s('text', { x: Z(x0 + (r.b * u) / 2), y: Z(rand + hMax * u + 19), 'text-anchor': 'middle', class: 'bildtext rissname' }, r.n));
    x0 += r.b * u + abstand;
  }
  return svg;
}

const NAMEN = { quader: 'Quader', prisma: 'Prisma', pyramide: 'Pyramide', zylinder: 'Zylinder', kegel: 'Kegel', kugel: 'Kugel', wuerfelbau: 'Würfelbau' };
function beschreibung(b) {
  if (b.art === 'netz') return `Netz aus ${(b.flaechen ?? []).length + (b.kreise ?? []).length + (b.sektoren ?? []).length} Flächen`;
  if (b.art === 'risse') return b.risse.map((r) => `${r.n ?? 'Ansicht'} mit ${r.zellen.length} Kästchen`).join(', ');
  if (b.form === 'wuerfelbau') return `Würfelbau aus ${b.wuerfel.length} Würfeln`;
  return `${b.form === 'quader' && b.a === b.b && b.b === b.c ? 'Würfel' : NAMEN[b.form]}${b.titel ? `: ${b.titel}` : ''}`;
}
export function koerperSvg(b, o = {}) {
  if (b.form === 'wuerfelbau') return wuerfelbauBild(b, o);
  if (['zylinder', 'kegel', 'kugel'].includes(b.form)) return rundBild(b);
  return eckigBild(b);
}
const mitTitel = (svg, b) => h('figure', { class: 'datenbild koerperfigur' }, svg, b.titel && h('figcaption', { class: 'klein' }, b.titel));
export const KOERPERBILDER = {
  koerper: (b) => mitTitel(koerperSvg(b), b),
  netz: (b) => mitTitel(netzSvg(b), b),
  risse: (b) => mitTitel(risseSvg(b), b),
};
// Kleine Fassung für Bildkarten (Auswahl mit Bildern).
export function kartenBild(b) {
  if (b.art === 'netz') return netzSvg(b, { klein: true });
  if (b.art === 'risse') return risseSvg(b, { klein: true });
  if (b.art === 'koerper' && b.form === 'wuerfelbau') return wuerfelbauBild(b, { klein: true });
  if (b.art === 'koerper') { const svg = koerperSvg(b); svg.classList.add('klein'); return svg; }
  return null;
}
