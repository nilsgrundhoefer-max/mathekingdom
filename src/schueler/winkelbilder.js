// Kapitel 7 „Kreis und Winkel“ (ADR 0034): Winkel mit Bogen und Geodreieck, Kreis am Lineal, Gradnetz und die Eingabe „Winkeldrehen“.
// Grilling mit Nils, 2026-11-21:
// - Gemessen wird an einem maßstabsgetreuen Geodreieck im Bild: Nullpunkt in der Mitte der langen Seite, mm-Skala, zwei gegenläufige Gradskalen,
//   Striche alle 1°, längere bei 5° und 10°.
// - Jeder Winkel bekommt einen farbigen Bogen mit seinem Buchstaben, der rechte Winkel ein Quadrat mit Punkt.
// - Beschriftungen überdecken nie Linien, Skala oder andere Beschriftungen (geprüft von tools/pruefe-layout.mjs).
// - Gezeichnet wird mit dem Winkeldrehen: Der zweite Schenkel wird am aufgelegten Geodreieck gedreht, ohne Gradanzeige.
// Koordinaten im Bild: Pixel, y nach oben, Ursprung unten links. Richtungen in Grad gegen den Uhrzeigersinn, 0° zeigt nach rechts.
import { h, s } from './dom.js';
import { richtungVon, leseGrad } from './winkel.js';

export const FARBEN = ['#0072b2', '#c0392b', '#1e8449', '#7d3c98'];
const ZAHL = (x) => Math.round(x * 100) / 100;
const plus = (p, v, k = 1) => [p[0] + k * v[0], p[1] + k * v[1]];
// Halbe Länge der langen Seite des Geodreiecks in Pixeln. Die lange Seite ist 16 cm lang, also sind 8 cm genau R Pixel.
export const GEO_R = 230;
export const BOGEN_R = 34;

function rahmen(b, klasse, titel) {
  const svg = s('svg', { class: `winkelbild${klasse ? ` ${klasse}` : ''}`, viewBox: `0 0 ${b.b} ${b.h}`, role: 'img', 'aria-label': titel });
  svg.style.maxWidth = `${b.b}px`;
  svg.append(s('rect', { x: 0, y: 0, width: b.b, height: b.h, class: 'blatt' }));
  return svg;
}

// ---------- Geodreieck ----------
// geo: { s: [x, y] Nullpunkt (ohne versatz: der Scheitel), grund: Richtung der langen Seite, versatz?: [dx, dy] }
// Das Dreieck liegt links der Grundrichtung: Es deckt die Richtungen grund bis grund + 180° ab.
// Außen steht die Skala, die bei der Grundrichtung mit 0 beginnt, innen die Gegenskala (180° minus).
export function geodreieckTeile(geo, Y, R = GEO_R) {
  const n0 = plus(geo.s, geo.versatz ?? [0, 0]), u = richtungVon(geo.grund), n = richtungVon(geo.grund + 90);
  const P = (p) => `${ZAHL(p[0])},${ZAHL(Y(p[1]))}`;
  const ecken = [plus(n0, u, R), plus(n0, n, R), plus(n0, u, -R)];
  const teile = [s('polygon', { points: ecken.map(P).join(' '), class: 'geodreieck' })];
  const linie = (a, b, klasse) => s('line', { x1: ZAHL(a[0]), y1: ZAHL(Y(a[1])), x2: ZAHL(b[0]), y2: ZAHL(Y(b[1])), class: klasse });
  // mm-Skala auf der langen Seite, 6 cm zu jeder Seite.
  const mm = R / 80;
  for (let k = -60; k <= 60; k++) {
    if (k === 0) continue;
    const p = plus(n0, u, k * mm), lang = k % 10 === 0 ? 10 : k % 5 === 0 ? 7 : 4;
    teile.push(linie(p, plus(p, n, lang), 'geo-mm'));
  }
  // Nullpunkt: ein kurzer Strich senkrecht zur langen Seite und eine kleine Null.
  teile.push(linie(n0, plus(n0, n, 16), 'geo-null'));
  // Gradskalen an den kurzen Seiten: Ein Strahl vom Nullpunkt in Richtung grund + θ trifft die Kante im Abstand R / (|cos θ| + sin θ).
  for (let t = 0; t <= 180; t++) {
    const d = richtungVon(geo.grund + t), c = Math.cos((t * Math.PI) / 180), sn = Math.sin((t * Math.PI) / 180);
    const kante = R / (Math.abs(c) + sn), lang = t % 10 === 0 ? 15 : t % 5 === 0 ? 11 : 6;
    teile.push(linie(plus(n0, d, kante), plus(n0, d, kante - lang), `geo-grad${t % 10 === 0 ? ' zehn' : ''}`));
    if (t % 10 === 0 && t > 0 && t < 180) {
      const aussen = plus(n0, d, kante - 26), innen = plus(n0, d, kante - 45);
      teile.push(s('text', { x: ZAHL(aussen[0]), y: ZAHL(Y(aussen[1]) + 4), 'text-anchor': 'middle', class: 'geo-zahl aussen' }, String(t)),
        s('text', { x: ZAHL(innen[0]), y: ZAHL(Y(innen[1]) + 4), 'text-anchor': 'middle', class: 'geo-zahl innen' }, String(180 - t)));
    }
  }
  return teile;
}

// ---------- Winkel ----------
// w: { s, von, groesse, l1, l2, n?, bogen? (false: ohne Bogen), farbe?, rb? (Radius des Bogens), punkte?: { s, a, b }, spos? (Richtung des Scheitelnamens) }
// gezeigt: Punktnamen, die schon im Bild stehen. Zwei Winkel mit einem gemeinsamen Schenkel nennen dessen Punkt nur einmal.
export function winkelTeile(w, Y, i = 0, gezeigt = new Set()) {
  const teile = [], namen = [];
  const farbe = FARBEN[w.farbe ?? i % FARBEN.length], rb = w.rb ?? BOGEN_R;
  const u = richtungVon(w.von), v = richtungVon(w.von + w.groesse);
  const A = plus(w.s, u, w.l1), B = plus(w.s, v, w.l2);
  const P = (p) => `${ZAHL(p[0])} ${ZAHL(Y(p[1]))}`;
  if (w.bogen !== false) {
    if (w.groesse === 90) {
      const k = 17, e1 = plus(w.s, u, k), e2 = plus(plus(w.s, u, k), v, k), e3 = plus(w.s, v, k), m = plus(plus(w.s, u, k / 2), v, k / 2);
      teile.push(s('path', { d: `M${P(w.s)} L${P(e1)} L${P(e2)} L${P(e3)} Z`, class: 'winkelflaeche', fill: farbe }),
        s('path', { d: `M${P(e1)} L${P(e2)} L${P(e3)}`, class: 'winkelbogen rechter', stroke: farbe }), s('circle', { cx: ZAHL(m[0]), cy: ZAHL(Y(m[1])), r: 2.2, fill: farbe, class: 'rechterpunkt' }));
    } else if (w.groesse >= 360) {
      const p = plus(w.s, u, rb), q = plus(w.s, u, -rb);
      teile.push(s('circle', { cx: ZAHL(w.s[0]), cy: ZAHL(Y(w.s[1])), r: rb, class: 'winkelflaeche', fill: farbe }),
        s('path', { d: `M${P(p)} A${rb} ${rb} 0 1 0 ${P(q)} A${rb} ${rb} 0 1 0 ${P(p)}`, class: 'winkelbogen', stroke: farbe }));
    } else {
      const p = plus(w.s, u, rb), q = plus(w.s, v, rb), gross = w.groesse > 180 ? 1 : 0;
      teile.push(s('path', { d: `M${P(w.s)} L${P(p)} A${rb} ${rb} 0 ${gross} 0 ${P(q)} Z`, class: 'winkelflaeche', fill: farbe }),
        s('path', { d: `M${P(p)} A${rb} ${rb} 0 ${gross} 0 ${P(q)}`, class: 'winkelbogen', stroke: farbe }));
    }
  }
  teile.push(s('line', { x1: ZAHL(w.s[0]), y1: ZAHL(Y(w.s[1])), x2: ZAHL(A[0]), y2: ZAHL(Y(A[1])), class: 'schenkel', 'data-winkel': i, 'data-schenkel': 1 }),
    s('line', { x1: ZAHL(w.s[0]), y1: ZAHL(Y(w.s[1])), x2: ZAHL(B[0]), y2: ZAHL(Y(B[1])), class: 'schenkel', 'data-winkel': i, 'data-schenkel': 2 }),
    s('circle', { cx: ZAHL(w.s[0]), cy: ZAHL(Y(w.s[1])), r: 3.2, class: 'scheitel' }));
  if (w.n && w.bogen !== false) {
    // Der Buchstabe steht knapp außerhalb des Bogens, nur in großen Bögen (ab Radius 40) stumpfer Winkel darin, beim rechten Winkel neben dem Quadrat.
    // Bei kleinen Winkeln rückt er so weit hinaus, dass er zwischen die Schenkel passt.
    const mitte = richtungVon(w.von + w.groesse / 2), abstand = w.groesse === 90 ? 38 : w.groesse > 90 && rb >= 40 ? rb * 0.58 : Math.max(rb + 13, 13 / Math.sin((Math.min(w.groesse, 180) * Math.PI) / 360));
    const q = plus(w.s, mitte, abstand);
    namen.push(s('text', { x: ZAHL(q[0]), y: ZAHL(Y(q[1]) + 6), 'text-anchor': 'middle', class: 'winkelname', fill: farbe }, w.n));
  }
  const name = (p, d, t) => { if (gezeigt.has(t)) return; gezeigt.add(t); const q = plus(p, d, 15); namen.push(s('text', { x: ZAHL(q[0]), y: ZAHL(Y(q[1]) + 6), 'text-anchor': 'middle', class: 'punktname' }, t)); };
  if (w.punkte?.a) name(A, u, w.punkte.a);
  if (w.punkte?.b) name(B, v, w.punkte.b);
  if (w.punkte?.s) name(w.s, richtungVon(w.spos ?? (w.von + w.groesse / 2 + 180)), w.punkte.s);
  return { teile, namen };
}
const winkelWort = (w) => `${w.n ? `Winkel ${w.n}` : 'ein Winkel'}${w.punkte?.s ? ` mit dem Scheitel ${w.punkte.s}` : ''}`;
export function winkelSvg(b, dazu = {}) {
  const Y = (y) => b.h - y;
  const svg = rahmen(b, dazu.klasse, [`Bild mit ${b.winkel.map(winkelWort).join(', ')}`, b.geo && 'Ein Geodreieck liegt auf dem Bild'].filter(Boolean).join('. '));
  // Wie im Heft: Das durchsichtige Geodreieck liegt auf der Zeichnung, die Namen stehen obenauf.
  const alleNamen = [], gezeigt = new Set();
  b.winkel.forEach((w, i) => { const { teile, namen } = winkelTeile(w, Y, i, gezeigt); svg.append(...teile); alleNamen.push(...namen); });
  if (b.geo) svg.append(...geodreieckTeile(b.geo, Y));
  for (const t of b.texte ?? []) alleNamen.push(s('text', { x: t.x, y: Y(t.y) + 5, 'text-anchor': 'middle', class: 'bildtext' }, t.t));
  svg.append(...alleNamen);
  return svg;
}
const winkelBild = (b) => h('figure', { class: 'datenbild geobild' }, winkelSvg(b));

// ---------- Kreis am Lineal ----------
// b: { von, bis (mm am Lineal: linker und rechter Rand des Kreises), lang (mm), radius?: true (Radius einzeichnen), durchmesser?: true }
function kreislinealBild(b) {
  const mm = 5, links = 30, r = ((b.bis - b.von) / 2) * mm, oben = 34, B = links * 2 + b.lang * mm;
  const yM = oben + r, yL = oben + 2 * r + 26, hoch = 62, H = yL + hoch + 8;
  const X = (w) => links + w * mm, mx = X((b.von + b.bis) / 2);
  const svg = s('svg', { class: 'linealbild kreislineal', viewBox: `0 0 ${B} ${H}`, role: 'img',
    'aria-label': `Ein Kreis liegt über einem Lineal. Sein linker Rand ist bei ${b.von} Millimetern, sein rechter Rand bei ${b.bis} Millimetern.` });
  svg.style.maxWidth = `${Math.min(B, 640)}px`;
  svg.append(s('circle', { cx: mx, cy: yM, r, class: 'kreis' }), s('circle', { cx: mx, cy: yM, r: 3.2, class: 'mittelpunkt' }));
  if (b.radius) svg.append(s('line', { x1: mx, y1: yM, x2: mx + r, y2: yM, class: 'radius' }));
  if (b.durchmesser) svg.append(s('line', { x1: mx - r, y1: yM, x2: mx + r, y2: yM, class: 'radius' }));
  svg.append(s('text', { x: mx, y: yM - 12, 'text-anchor': 'middle', class: 'punktname' }, 'M'));
  svg.append(s('rect', { x: X(0) - 14, y: yL, width: b.lang * mm + 28, height: hoch, rx: 5, class: 'lineal' }));
  for (let w = 0; w <= b.lang; w++) {
    const lang = w % 10 === 0 ? 24 : w % 5 === 0 ? 17 : 11;
    svg.append(s('line', { x1: X(w), y1: yL, x2: X(w), y2: yL + lang, class: `mm${w % 10 === 0 ? ' cm' : ''}` }));
    if (w % 10 === 0) svg.append(s('text', { x: X(w), y: yL + 43, 'text-anchor': 'middle', class: 'cmzahl' }, String(w / 10)));
  }
  svg.append(s('text', { x: X(b.lang) + 4, y: yL + 57, 'text-anchor': 'end', class: 'cmwort' }, 'cm'));
  // Senkrechte Hilfslinien vom linken und rechten Rand des Kreises bis zum Lineal.
  svg.append(s('line', { x1: X(b.von), y1: yM, x2: X(b.von), y2: yL, class: 'streckenende hilfs' }), s('line', { x1: X(b.bis), y1: yM, x2: X(b.bis), y2: yL, class: 'streckenende hilfs' }));
  return h('figure', { class: 'datenbild geobild' }, svg, h('figcaption', { class: 'klein' }, 'M ist der Mittelpunkt des Kreises.'));
}

// ---------- Gradnetz ----------
// b: { breite: [süd, nord], laenge: [west, ost] in Grad (Süden und Westen negativ), schritt, namen?: true (Äquator und Nullmeridian beschriften),
//      orte: [{ n, b, l, pos? ('r' | 'l' | 'o' | 'u') }] }
export const gradText = (wert, achse) => (wert === 0 ? '0°' : `${Math.abs(wert)}° ${achse === 'b' ? (wert > 0 ? 'N' : 'S') : wert > 0 ? 'O' : 'W'}`);
export function gradnetzMasse(b) {
  const L = 64, R = 34, O = 16, U = 30, breitePlot = 560, k = breitePlot / (b.laenge[1] - b.laenge[0]);
  const hoehePlot = (b.breite[1] - b.breite[0]) * k;
  return { L, O, k, B: L + breitePlot + R, H: O + hoehePlot + U, X: (l) => L + (l - b.laenge[0]) * k, Y: (br) => O + (b.breite[1] - br) * k };
}
function gradnetzBild(b) {
  const m = gradnetzMasse(b), { X, Y } = m;
  const svg = s('svg', { class: 'gradnetzbild', viewBox: `0 0 ${m.B} ${m.H}`, role: 'img',
    'aria-label': `Gradnetz von ${gradText(b.breite[0], 'b')} bis ${gradText(b.breite[1], 'b')} und von ${gradText(b.laenge[0], 'l')} bis ${gradText(b.laenge[1], 'l')}. Orte: ${b.orte.map((o) => o.n).join(', ')}` });
  svg.style.maxWidth = `${m.B}px`;
  svg.append(s('rect', { x: X(b.laenge[0]), y: Y(b.breite[1]), width: X(b.laenge[1]) - X(b.laenge[0]), height: Y(b.breite[0]) - Y(b.breite[1]), class: 'meer' }));
  for (let br = Math.ceil(b.breite[0] / b.schritt) * b.schritt; br <= b.breite[1]; br += b.schritt) {
    svg.append(s('line', { x1: X(b.laenge[0]), y1: Y(br), x2: X(b.laenge[1]), y2: Y(br), class: br === 0 ? 'aequator' : 'gradlinie' }),
      s('text', { x: X(b.laenge[0]) - 6, y: Y(br) + 4.5, 'text-anchor': 'end', class: 'gradzahl' }, gradText(br, 'b')));
  }
  for (let l = Math.ceil(b.laenge[0] / b.schritt) * b.schritt; l <= b.laenge[1]; l += b.schritt) {
    svg.append(s('line', { x1: X(l), y1: Y(b.breite[0]), x2: X(l), y2: Y(b.breite[1]), class: l === 0 ? 'nullmeridian' : 'gradlinie' }),
      s('text', { x: X(l), y: Y(b.breite[0]) + 18, 'text-anchor': 'middle', class: 'gradzahl' }, gradText(l, 'l')));
  }
  if (b.namen && b.breite[0] < 0 && b.breite[1] > 0) svg.append(s('text', { x: X(b.laenge[1]) - 6, y: Y(0) - 6, 'text-anchor': 'end', class: 'netzname' }, 'Äquator'));
  if (b.namen && b.laenge[0] < 0 && b.laenge[1] > 0) svg.append(s('text', { x: X(0) + 6, y: Y(b.breite[1]) + 16, 'text-anchor': 'start', class: 'netzname' }, 'Nullmeridian'));
  const VERSATZ = { r: [9, 5, 'start'], l: [-9, 5, 'end'], o: [0, -9, 'middle'], u: [0, 19, 'middle'] };
  for (const o of b.orte) {
    const [dx, dy, anker] = VERSATZ[o.pos ?? 'r'];
    svg.append(s('circle', { cx: X(o.l), cy: Y(o.b), r: 4.5, class: 'ort' }), s('text', { x: X(o.l) + dx, y: Y(o.b) + dy, 'text-anchor': anker, class: 'ortsname' }, o.n));
  }
  return h('figure', { class: 'datenbild geobild' }, svg);
}

export const WINKELBILDER = { winkel: winkelBild, kreislineal: kreislinealBild, gradnetz: gradnetzBild };

// ---------- Winkeldrehen ----------
// auf.winkelfeld: { b, h, s, von, l, punkte?: { s, a, b }, umlegen?: true }. Der feste Schenkel zeigt in Richtung von.
// Die Eingabe ist die Gradzahl gegen den Uhrzeigersinn vom festen Schenkel aus. Das Dashboard zeigt sie nicht an.
const zweiterSchenkel = (f, grad, klasse) => winkelTeile({ s: f.s, von: f.von, groesse: grad, l1: f.l, l2: f.l, n: null, farbe: 3, rb: BOGEN_R, punkte: f.punkte }, (y) => f.h - y, 0);
function winkelfeldSvg(f, grad, { gedreht = false, klasse = '', griff = true } = {}) {
  // Vor dem ersten Ziehen liegt der Griff am Ende des festen Schenkels.
  const Y = (y) => f.h - y;
  const svg = rahmen(f, `eingabe${klasse ? ` ${klasse}` : ''}`, `Ein Schenkel liegt fest${f.punkte?.s ? ` am Scheitel ${f.punkte.s}` : ''}. Ein Geodreieck liegt mit dem Nullpunkt auf dem Scheitel.`);
  const geo = geodreieckTeile({ s: f.s, grund: gedreht ? f.von + 180 : f.von }, Y);
  if (grad == null) {
    const u = richtungVon(f.von), A = plus(f.s, u, f.l);
    svg.append(s('line', { x1: f.s[0], y1: Y(f.s[1]), x2: ZAHL(A[0]), y2: ZAHL(Y(A[1])), class: 'schenkel fest' }), s('circle', { cx: f.s[0], cy: Y(f.s[1]), r: 3.2, class: 'scheitel' }), ...geo);
    if (griff) svg.append(s('circle', { cx: ZAHL(A[0]), cy: ZAHL(Y(A[1])), r: 11, class: 'griff' }));
    if (f.punkte?.a) { const q = plus(A, u, 15); svg.append(s('text', { x: ZAHL(q[0]), y: ZAHL(Y(q[1]) + 6), 'text-anchor': 'middle', class: 'punktname' }, f.punkte.a)); }
    if (f.punkte?.s) { const q = plus(f.s, richtungVon(f.von - 135), 18); svg.append(s('text', { x: ZAHL(q[0]), y: ZAHL(Y(q[1]) + 6), 'text-anchor': 'middle', class: 'punktname' }, f.punkte.s)); }
    return svg;
  }
  const { teile, namen } = zweiterSchenkel(f, grad);
  svg.append(...teile, ...geo, ...namen);
  for (const t of teile) if (t.getAttribute?.('data-schenkel') === '2') t.setAttribute('class', 'schenkel gedreht');
  if (griff) { const B = plus(f.s, richtungVon(f.von + grad), f.l); svg.append(s('circle', { cx: ZAHL(B[0]), cy: ZAHL(Y(B[1])), r: 11, class: 'griff' })); }
  return svg;
}
export function winkelEingabe(auf, letzte, gesperrt) {
  const f = auf.winkelfeld;
  let grad = Number.isNaN(leseGrad(letzte)) ? null : leseGrad(letzte), gedreht = false;
  const feld = h('input', { type: 'hidden', name: 'winkel', value: grad == null ? '' : String(grad) });
  const rahmenEl = h('figure', { class: 'datenbild geobild' });
  const setze = (g) => { grad = ((Math.round(g) % 360) + 360) % 360; feld.value = String(grad); zeichne(); };
  const zeichne = () => {
    const svg = winkelfeldSvg(f, grad, { gedreht, klasse: gesperrt ? 'gesperrt' : '', griff: !gesperrt });
    svg.setAttribute('role', 'application');
    svg.setAttribute('aria-label', `${svg.getAttribute('aria-label')} Zieh den zweiten Schenkel. Mit der Tastatur: Pfeiltasten drehen um 1 Grad, Bild auf und Bild ab um 10 Grad.`);
    if (!gesperrt) {
      svg.setAttribute('tabindex', '0');
      const richtung = (e) => {
        const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const q = p.matrixTransform(svg.getScreenCTM().inverse()), dx = q.x - f.s[0], dy = (f.h - q.y) - f.s[1];
        if (Math.hypot(dx, dy) < 12) return;
        setze((Math.atan2(dy, dx) * 180) / Math.PI - f.von);
      };
      svg.addEventListener('pointerdown', (e) => { e.preventDefault(); svg.setPointerCapture?.(e.pointerId); svg.dataset.zieht = '1'; richtung(e); });
      svg.addEventListener('pointermove', (e) => { if (svg.dataset.zieht === '1') richtung(e); });
      svg.addEventListener('pointerup', () => { delete svg.dataset.zieht; });
      svg.addEventListener('keydown', (e) => {
        const schritt = { ArrowLeft: 1, ArrowUp: 1, ArrowRight: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key];
        if (schritt) { e.preventDefault(); setze((grad ?? 0) + schritt); }
      });
    }
    const fokus = rahmenEl.contains(document.activeElement);
    rahmenEl.replaceChildren(svg);
    if (fokus) svg.focus({ preventScroll: true });
  };
  zeichne();
  const umlegen = f.umlegen && !gesperrt && h('button', { type: 'button', class: 'schlicht', id: 'geodreieck-umlegen', onclick: () => { gedreht = !gedreht; zeichne(); } }, 'Geodreieck umlegen');
  return h('div', { class: 'mitbild winkel-eingabe' }, h('div', { class: 'bildrahmen' }, rahmenEl), feld,
    !gesperrt && h('div', { class: 'zeichnen-leiste' }, h('p', { class: 'klein' }, 'Zieh den Punkt am zweiten Schenkel, bis der Winkel stimmt. Lies dabei am Geodreieck ab.'), umlegen));
}
export const winkelLoesungBild = (auf) => h('figure', { class: 'datenbild geobild' }, winkelfeldSvg(auf.winkelfeld, auf.loesung, { klasse: 'loesung', griff: false }));
