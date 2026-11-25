// Klasse 7, Kapitel 2 „Dreiecke“ (ADR 0044): die Figur. Dreiecke, Geradenkreuzungen, Parallelen mit einer schneidenden Geraden,
// Thaleskreis, Höhen, Mittelsenkrechte und Winkelhalbierende außerhalb des Karogitters.
// Grilling mit Nils, 2026-11-25:
// - Die gezeichneten Winkel und Längen stimmen immer. Das Bild ist maßstabsgetreu, nur kleiner oder größer.
// - Jeder Winkel hat einen farbigen Bogen mit Namen oder Größe, ein rechter Winkel ein Quadrat mit Punkt.
// - Gleich große Winkel und gleich lange Seiten tragen Striche (auf G ersetzen sie den Basiswinkelsatz).
// - Beschriftungen überdecken keine Linie und keine andere Beschriftung (geprüft von tools/pruefe-layout.mjs).
// b: { art: 'figur', punkte: [{ n, p: [x, y], zeigen?: false, pos?: Richtung des Namens in Grad, rand?: true (Punkt auf einem Kreis) }],
//      linien: [{ a, b, n?, stil?: 'hilfs' | 'hoehe' | 'ort' | 'dick', gleich?: 1 | 2 }],
//      winkel: [{ s, a, b, n?, wert?, frage?, gleich?: 1 | 2, farbe?, ueber?: true }], masse: [{ a, b, t, seite?: 1 | −1 }],
//      kreise: [{ m, r, stil? }], titel? }
// Koordinaten in Einheiten (meist Zentimeter), y nach oben. Ein Winkel liegt zwischen den Strahlen s→a und s→b, und zwar der kleinere.
import { h, s } from './dom.js';

export const FIGURFARBEN = ['#0072b2', '#c0392b', '#1e8449', '#7d3c98'];
const Z = (x) => Math.round(x * 100) / 100;
const RAND = 34, BREITE = 320, HOEHE = 230, KMAX = 56;
const grad = (v) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
const norm = (w) => ((w % 360) + 360) % 360;
const richtung = (g) => [Math.cos((g * Math.PI) / 180), Math.sin((g * Math.PI) / 180)];
const plus = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];

// Ein Winkel als Richtung des ersten Strahls und Größe (gegen den Uhrzeigersinn), in Grad.
export function winkelLage(P, w) {
  const S = P(w.s), da = grad([P(w.a)[0] - S[0], P(w.a)[1] - S[1]]), db = grad([P(w.b)[0] - S[0], P(w.b)[1] - S[1]]);
  let von = da, g = norm(db - da);
  if ((g > 180 && !w.ueber) || (g < 180 && w.ueber)) { von = db; g = 360 - g; }
  return { von: norm(von), groesse: g };
}
export const winkelText = (w) => (w.wert != null && !w.frage ? `${w.wert}°` : w.n ?? '?');

export function figurMasse(b) {
  const P0 = new Map(b.punkte.map((p) => [p.n, p.p]));
  const xs = [], ys = [];
  for (const p of b.punkte) { xs.push(p.p[0]); ys.push(p.p[1]); }
  for (const k of b.kreise ?? []) { const m = P0.get(k.m); xs.push(m[0] - k.r, m[0] + k.r); ys.push(m[1] - k.r, m[1] + k.r); }
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min(KMAX, BREITE / Math.max(x1 - x0, 1e-6), HOEHE / Math.max(y1 - y0, 1e-6));
  const B = Math.max(260, 2 * RAND + (x1 - x0) * k), H = 2 * RAND + (y1 - y0) * k, dx = (B - 2 * RAND - (x1 - x0) * k) / 2;
  const X = (x) => RAND + dx + (x - x0) * k, Y = (y) => RAND + (y1 - y) * k;
  // Punkte in Bildkoordinaten mit y nach oben (für Richtungen), Umrechnung ins SVG mit Y.
  const P = (n) => { const p = P0.get(n); if (!p) throw new Error(`Punkt ${n} fehlt in der Figur`); return [X(p[0]), H - Y(p[1])]; };
  return { k, B: Z(B), H: Z(H), P, SY: (y) => H - y };
}

// Freie Richtung für einen Punktnamen: die Mitte der größten Lücke zwischen den Linien, die vom Punkt ausgehen.
function freieRichtung(b, P, n, belegt) {
  const p = P(n), dirs = [...(belegt.get(n) ?? [])];
  for (const l of b.linien ?? []) {
    const a = P(l.a), q = P(l.b);
    if (l.a === n) dirs.push(grad([q[0] - p[0], q[1] - p[1]]));
    else if (l.b === n) dirs.push(grad([a[0] - p[0], a[1] - p[1]]));
    else { // Liegt der Punkt mitten auf der Linie, gehen zwei Richtungen von ihm aus.
      const d = [q[0] - a[0], q[1] - a[1]], t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
      const f = Math.abs((p[0] - a[0]) * d[1] - (p[1] - a[1]) * d[0]) / Math.hypot(...d);
      if (f < 1.5 && t > 0 && t < 1) dirs.push(grad(d), grad(d) + 180);
    }
  }
  for (const k of b.kreise ?? []) {
    const m = P(k.m), r = Math.hypot(p[0] - m[0], p[1] - m[1]);
    if (Math.abs(r - k.r * figurMasse(b).k) < 1.5) { const g = grad([p[0] - m[0], p[1] - m[1]]); dirs.push(g + 90, g - 90, g + 180); }
  }
  if (!dirs.length) return 45;
  const d = dirs.map(norm).sort((x, y) => x - y);
  let best = 0, mitte = d[0] + 180;
  d.forEach((x, i) => { const y = i + 1 < d.length ? d[i + 1] : d[0] + 360; if (y - x > best) { best = y - x; mitte = (x + y) / 2; } });
  return norm(mitte);
}

export function figurSvg(b, dazu = {}) {
  const m = figurMasse(b), { P, SY } = m;
  const svg = s('svg', { class: `figurbild${dazu.klasse ? ` ${dazu.klasse}` : ''}`, viewBox: `0 0 ${m.B} ${m.H}`, role: 'img', 'aria-label': beschreibung(b) });
  svg.style.maxWidth = `${m.B}px`;
  svg.append(s('rect', { x: 0, y: 0, width: m.B, height: m.H, class: 'blatt' }));
  const namen = [], belegt = new Map();
  const merke = (n, g) => { if (!belegt.has(n)) belegt.set(n, []); belegt.get(n).push(g); };
  const linie = (p, q, klasse, extra = {}) => s('line', { x1: Z(p[0]), y1: Z(SY(p[1])), x2: Z(q[0]), y2: Z(SY(q[1])), class: klasse, ...extra });
  const text = (p, t, klasse, farbe) => s('text', { x: Z(p[0]), y: Z(SY(p[1]) + 6), 'text-anchor': 'middle', class: klasse, ...(farbe ? { fill: farbe } : {}) }, t);
  for (const k of b.kreise ?? []) { const c = P(k.m); svg.append(s('circle', { cx: Z(c[0]), cy: Z(SY(c[1])), r: Z(k.r * m.k), class: `kreis${k.stil ? ` ${k.stil}` : ''}` })); }
  // Winkelbögen liegen unter den Linien.
  (b.winkel ?? []).forEach((w, i) => {
    const S = P(w.s), { von, groesse } = winkelLage(P, w), farbe = FIGURFARBEN[w.farbe ?? i % FIGURFARBEN.length];
    const u = richtung(von), v = richtung(von + groesse), mitte = richtung(von + groesse / 2);
    const PS = (p) => `${Z(p[0])} ${Z(SY(p[1]))}`;
    merke(w.s, von + groesse / 2);
    const recht = Math.abs(groesse - 90) < 0.5 && w.wert === 90 && !w.frage; // gerundete Koordinaten: knapp 90° ist auch ein rechter Winkel
    if (recht) {
      const k = 15, e1 = plus(S, u, k), e2 = plus(e1, v, k), e3 = plus(S, v, k), mp = plus(plus(S, u, k / 2), v, k / 2);
      svg.append(s('path', { d: `M${PS(S)} L${PS(e1)} L${PS(e2)} L${PS(e3)} Z`, class: 'winkelflaeche', fill: farbe }),
        s('path', { d: `M${PS(e1)} L${PS(e2)} L${PS(e3)}`, class: 'winkelbogen rechter', stroke: farbe }), s('circle', { cx: Z(mp[0]), cy: Z(SY(mp[1])), r: 2.2, fill: farbe, class: 'rechterpunkt' }));
      if (w.n) namen.push(text(plus(S, mitte, 34), w.n, 'winkelname', farbe));
      return;
    }
    const rb = w.r ?? (groesse < 40 ? 36 : 26), p = plus(S, u, rb), q = plus(S, v, rb);
    svg.append(s('path', { d: `M${PS(S)} L${PS(p)} A${rb} ${rb} 0 ${groesse > 180 ? 1 : 0} 0 ${PS(q)} Z`, class: 'winkelflaeche', fill: farbe }),
      s('path', { d: `M${PS(p)} A${rb} ${rb} 0 ${groesse > 180 ? 1 : 0} 0 ${PS(q)}`, class: 'winkelbogen', stroke: farbe, 'data-grad': Z(groesse) }));
    for (let j = 0; j < (w.gleich ?? 0); j++) { const d = richtung(von + groesse / 2 + (j - ((w.gleich ?? 1) - 1) / 2) * Math.min(8, groesse / 4)); svg.append(linie(plus(S, d, rb - 6), plus(S, d, rb + 6), 'gleichstrich', { stroke: farbe })); }
    const t = winkelText(w), breit = 5 + 4.6 * t.length;
    const abstand = Math.max(rb + 10 + breit / 2, (breit / 2 + 7) / Math.sin((Math.min(groesse, 179) * Math.PI) / 360));
    namen.push(text(plus(S, mitte, abstand), t, `winkelname${w.wert != null && !w.frage ? ' wert' : ''}`, farbe));
  });
  for (const l of b.linien ?? []) {
    const a = P(l.a), q = P(l.b);
    svg.append(linie(a, q, `kante${l.stil ? ` ${l.stil}` : ''}`));
    const d = [q[0] - a[0], q[1] - a[1]], len = Math.hypot(...d), e = [d[0] / len, d[1] / len], nrm = [-e[1], e[0]], mp = plus(a, d, 0.5);
    for (let j = 0; j < (l.gleich ?? 0); j++) { const c = plus(mp, e, (j - ((l.gleich ?? 1) - 1) / 2) * 5); svg.append(linie(plus(c, nrm, -6), plus(c, nrm, 6), 'gleichstrich')); }
    if (l.n) namen.push(text(plus(plus(q, e, -14), nrm, 14), l.n, 'linienname'));
  }
  // Maße stehen außen an der Seite: auf der Seite, die vom Schwerpunkt der Figur weg zeigt.
  const sichtbar = b.punkte.filter((p) => p.zeigen !== false).map((p) => P(p.n));
  const sp = sichtbar.reduce((a, p) => [a[0] + p[0] / sichtbar.length, a[1] + p[1] / sichtbar.length], [0, 0]);
  for (const ms of b.masse ?? []) {
    const a = P(ms.a), q = P(ms.b), d = [q[0] - a[0], q[1] - a[1]], len = Math.hypot(...d), mp = plus(a, d, 0.5);
    let nrm = [-d[1] / len, d[0] / len];
    const aussen = (nrm[0] * (mp[0] - sp[0]) + nrm[1] * (mp[1] - sp[1])) >= 0 ? 1 : -1;
    nrm = [nrm[0] * (ms.seite ?? aussen), nrm[1] * (ms.seite ?? aussen)];
    const breit = 6 + 4.3 * ms.t.length, abstand = 9 + Math.abs(nrm[0]) * breit / 2 + Math.abs(nrm[1]) * 8;
    namen.push(text(plus(mp, nrm, abstand), ms.t, `masszahl${ms.frage ? ' frage' : ''}`));
  }
  for (const p of b.punkte.filter((x) => x.zeigen !== false)) {
    const q = P(p.n);
    svg.append(s('circle', { cx: Z(q[0]), cy: Z(SY(q[1])), r: 3, class: 'ecke' }));
    if (p.name === false) continue;
    const g = p.pos ?? freieRichtung(b, P, p.n, belegt);
    namen.push(text(plus(q, richtung(g), 16), p.n, 'punktname'));
  }
  svg.append(...namen);
  return svg;
}
function beschreibung(b) {
  const sichtbar = b.punkte.filter((p) => p.zeigen !== false && p.name !== false).map((p) => p.n);
  return [`Figur mit den Punkten ${sichtbar.join(', ')}`, (b.winkel ?? []).length && `Winkel ${(b.winkel ?? []).map(winkelText).join(', ')}`,
    (b.masse ?? []).length && `Maße ${(b.masse ?? []).map((x) => x.t).join(', ')}`].filter(Boolean).join('. ');
}
const figurBild = (b) => h('figure', { class: 'datenbild geobild' }, figurSvg(b), b.titel && h('figcaption', { class: 'klein' }, b.titel));
export const FIGURBILDER = { figur: figurBild };
