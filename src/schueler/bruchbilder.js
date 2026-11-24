// Kapitel 9 „Brüche und Dezimalzahlen“ (ADR 0036): Bruchbilder und die Eingabe „Teile färben“.
// Grilling mit Nils, 2026-11-22:
// - Ein Bruchbild zeigt ein Ganzes in Teilen: Kreis, Rechteck, Streifen oder Mengenbild. Gefärbt ist eine Farbe mit Rand, ungefärbt bleibt weiß.
// - Kreis: Die erste Teillinie zeigt nach oben, höchstens 12 Teile. Rechteck und Streifen höchstens 20 Teile, Mengenbild höchstens 20 Kugeln in Reihen.
// - Zwei Ganze stehen nebeneinander mit Abstand. Mehrere Figuren tragen die Namen A, B, C über dem Bild.
// - „Ungleich“ geteilte Figuren sind eine Falle: Ihre Teile sind deutlich verschieden groß.
// Klasse 6, Kapitel 2 (ADR 0038): Der Akku ist ein Ladebalken in gleich großen Teilen. Im Rechteckbild für „Bruch von Bruch“
// sind die Felder des ersten Bruchteils hell gefärbt (`hell`), die des Bruchteils davon kräftig.
// Eine Figur: { n?, form: 'kreis' | 'rechteck' | 'streifen' | 'menge' | 'hundert' | 'akku', teile | reihen + spalten, ganze?, gefaerbt: [Nummern der Teile], ungleich? }
import { h, s } from './dom.js';
import { leseTeile } from './bruch.js';
import { mitVorzeichen, MINUS } from './zahlenbilder.js';

const Z = (x) => Math.round(x * 100) / 100;
const ABSTAND = 28, RAND = 14, KOPF = 26;
// Ungleiche Teile: abwechselnd breit und schmal, damit man es sofort sieht.
const gewichte = (n, ungleich) => Array.from({ length: n }, (_, i) => (ungleich ? [1.9, 0.6, 1.2, 0.5, 1.6, 0.8][i % 6] : 1));
const anteile = (n, ungleich) => { const g = gewichte(n, ungleich), sum = g.reduce((a, b) => a + b, 0); let lauf = 0; return g.map((x) => { const von = lauf / sum; lauf += x; return [von, lauf / sum]; }); };

// Größe eines Ganzen in Pixeln und die Umrisse seiner Teile (als Pfad oder Kreis) in eigenen Koordinaten.
function ganzes(f) {
  if (f.form === 'kreis') {
    const r = 62, c = r + 2, teile = anteile(f.teile, f.ungleich).map(([a, b]) => {
      const p = (t) => { const w = -Math.PI / 2 + t * 2 * Math.PI; return `${Z(c + r * Math.cos(w))} ${Z(c + r * Math.sin(w))}`; };
      return { d: f.teile === 1 ? `M${c - r} ${c} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z` : `M${c} ${c} L${p(a)} A${r} ${r} 0 ${b - a > 0.5 ? 1 : 0} 1 ${p(b)} Z` };
    });
    return { b: 2 * c, h: 2 * c, teile };
  }
  if (f.form === 'menge') {
    const je = f.teile <= 5 ? f.teile : f.teile <= 12 ? Math.ceil(f.teile / 2) : Math.ceil(f.teile / (f.teile > 15 ? 4 : 3)), k = 34, r = 13;
    return { b: je * k, h: Math.ceil(f.teile / je) * k, teile: Array.from({ length: f.teile }, (_, i) => ({ cx: (i % je) * k + k / 2, cy: Math.floor(i / je) * k + k / 2, r })) };
  }
  if (f.form === 'akku') {
    const B = Math.min(300, Math.max(170, f.teile * 40)), H = 76, innen = 8, spalt = 4, w = (B - 2 * innen - (f.teile - 1) * spalt) / f.teile;
    return { b: B + 12, h: H, akku: B, teile: Array.from({ length: f.teile }, (_, i) => ({ d: `M${Z(innen + i * (w + spalt))} ${innen} h${Z(w)} v${H - 2 * innen} h${Z(-w)} Z` })) };
  }
  if (f.form === 'hundert') {
    const k = 17;
    // Spaltenweise gezählt: Jede volle Spalte ist ein Zehntel.
    return { b: 10 * k, h: 10 * k, teile: Array.from({ length: 100 }, (_, i) => ({ d: `M${Math.floor(i / 10) * k} ${(i % 10) * k} h${k} v${k} h${-k} Z` })), zehner: k };
  }
  const reihen = f.form === 'streifen' ? 1 : f.reihen, spalten = f.form === 'streifen' ? f.teile : f.spalten;
  const B = f.form === 'streifen' ? 320 : Math.min(200, spalten * 44), H = f.form === 'streifen' ? 46 : Math.min(160, reihen * Math.min(44, B / spalten));
  const xs = anteile(spalten, f.ungleich), teile = [];
  for (let r = 0; r < reihen; r++) for (let c = 0; c < spalten; c++) teile.push({ d: `M${Z(xs[c][0] * B)} ${Z((r * H) / reihen)} H${Z(xs[c][1] * B)} V${Z(((r + 1) * H) / reihen)} H${Z(xs[c][0] * B)} Z` });
  return { b: B, h: H, teile };
}
const jeGanzes = (f) => (f.form === 'rechteck' ? f.reihen * f.spalten : f.form === 'hundert' ? 100 : f.teile);
const FORMNAME = { kreis: 'Kreis', rechteck: 'Rechteck', streifen: 'Streifen', menge: 'Kugeln', hundert: 'Hunderterfeld', akku: 'Akku' };

// Zeichnet die Figuren nebeneinander (Streifen untereinander). beiWahl(nummer) macht die Teile der ersten Figur antippbar.
export function bruchSvg(figuren, { beiWahl = null, gewaehlt = null } = {}) {
  const liste = figuren.map((f) => ({ f, g: ganzes(f), ganze: f.ganze ?? 1 }));
  const unter = liste.some((x) => x.f.form === 'streifen') && liste.length > 1;
  const namen = liste.some((x) => x.f.n);
  // Platz jeder Figur: Streifen untereinander, sonst nebeneinander. Vier Figuren stehen in zwei Reihen, damit sie am Handy groß bleiben.
  for (const e of liste) { e.breite = e.ganze * e.g.b + (e.ganze - 1) * ABSTAND; }
  const proZeile = unter ? 1 : liste.length >= 4 ? 2 : liste.length;
  const spaltenB = Array.from({ length: proZeile }, (_, c) => Math.max(...liste.filter((_, i) => i % proZeile === c).map((e) => e.breite)));
  const zeilenH = Array.from({ length: Math.ceil(liste.length / proZeile) }, (_, r) => Math.max(...liste.slice(r * proZeile, (r + 1) * proZeile).map((e) => e.g.h)));
  const LUECKE = ABSTAND + 8, kopf = !unter && namen ? KOPF : 0, rand = unter && namen ? 26 : 0;
  const B = RAND + rand + spaltenB.reduce((a, b) => a + b, 0) + (proZeile - 1) * LUECKE;
  const H = RAND + zeilenH.reduce((a, b) => a + b + kopf, 0) + (zeilenH.length - 1) * 18;
  // Schmale Bilder werden nicht über die ganze Breite gezogen: Die Teile sollen so groß sein wie gezeichnet.
  const svg = s('svg', { class: `bruchbild${beiWahl ? ' eingabe' : ''}`, role: beiWahl ? 'group' : 'img', viewBox: `0 0 ${Z(B + RAND)} ${Z(H + RAND)}` },
    s('rect', { x: 0, y: 0, width: Z(B + RAND), height: Z(H + RAND), class: 'blatt' }));
  svg.style.maxWidth = `${Math.round((B + RAND) * 1.25)}px`;
  const texte = [];
  liste.forEach(({ f, g, ganze, breite }, nrFigur) => {
    const c = nrFigur % proZeile, r = Math.floor(nrFigur / proZeile);
    const x = RAND + spaltenB.slice(0, c).reduce((a, b) => a + b + LUECKE, 0), y = RAND + zeilenH.slice(0, r).reduce((a, b) => a + b + kopf + 18, 0);
    const voll = new Set(gewaehlt ?? f.gefaerbt ?? []), hell = new Set(gewaehlt ? [] : f.hell ?? []), n = jeGanzes(f);
    const links = unter ? x + rand : x + (spaltenB[c] - breite) / 2, oben = y + kopf + (unter ? 0 : (zeilenH[r] - g.h) / 2);
    if (f.n) svg.append(unter ? s('text', { x: x + 8, y: Z(oben + g.h / 2 + 6), 'text-anchor': 'middle', class: 'figurname' }, f.n) : s('text', { x: Z(links + breite / 2), y: y + 16, 'text-anchor': 'middle', class: 'figurname' }, f.n));
    const gruppe = s('g', { class: 'bruchfigur', 'data-teile': n * ganze, 'data-form': f.form });
    for (let w = 0; w < ganze; w++) {
      const dx = links + w * (g.b + ABSTAND);
      const ganz = s('g', { transform: `translate(${Z(dx)} ${Z(oben)})`, class: 'ganzes' });
      g.teile.forEach((t, i) => {
        const nr = w * n + i, an = voll.has(nr);
        const el = t.d ? s('path', { d: t.d, class: `bruchteil${an ? ' voll' : hell.has(nr) ? ' hell' : ''}` }) : s('circle', { cx: t.cx, cy: t.cy, r: t.r, class: `bruchteil kugel${an ? ' voll' : ''}` });
        if (beiWahl) {
          el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-pressed', an ? 'true' : 'false'); el.setAttribute('aria-label', `Teil ${nr + 1} von ${n * ganze}`);
          el.setAttribute('data-nr', nr);
          el.addEventListener('click', () => beiWahl(nr));
          el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); beiWahl(nr); } });
        }
        ganz.append(el);
      });
      // Das Hunderterfeld bekommt kräftige Linien zwischen den Zehnerspalten, der Umriss jedes Ganzen ist immer kräftig.
      if (f.form === 'hundert') for (let c = 1; c < 10; c++) ganz.append(s('line', { x1: c * g.zehner, y1: 0, x2: c * g.zehner, y2: g.h, class: 'zehnerlinie' }));
      if (f.form === 'akku') ganz.append(s('rect', { x: 0, y: 0, width: g.akku, height: g.h, rx: 9, class: 'umriss' }), s('rect', { x: g.akku, y: g.h / 2 - 14, width: 10, height: 28, rx: 3, class: 'akkupol' }));
      else if (f.form !== 'menge' && f.form !== 'kreis') ganz.append(s('rect', { x: 0, y: 0, width: g.b, height: g.h, class: 'umriss' }));
      gruppe.append(ganz);
    }
    svg.append(gruppe);
    const gefaerbt = [...voll].length;
    texte.push(`${f.n ? `${f.n}: ` : ''}${FORMNAME[f.form]}${ganze > 1 ? ` (${ganze} Ganze)` : ''} mit ${n} ${f.ungleich ? 'ungleich großen ' : ''}Teilen${beiWahl ? '' : hell.size ? `, ${hell.size + gefaerbt} hell gefärbt, davon ${gefaerbt} kräftig` : `, ${gefaerbt} gefärbt`}`);
  });
  svg.setAttribute('aria-label', `Bruchbild: ${texte.join('; ')}`);
  return svg;
}
export const BRUCHBILDER = { bruch: (b) => bruchSvg(b.figuren) };

// Eingabe „Teile färben“: Antippen färbt ein Teil, noch einmal antippen macht es wieder weiß.
export function faerbenEingabe(auf, letzte, gesperrt) {
  let gewaehlt = leseTeile(letzte);
  const feld = h('input', { type: 'hidden', name: 'faerben', value: gewaehlt.join(' ') });
  const rahmen = h('div', { class: 'bildrahmen' });
  const zeichne = (fokus = null) => {
    rahmen.replaceChildren(bruchSvg([auf.faerben], { gewaehlt, beiWahl: gesperrt ? null : (nr) => {
      gewaehlt = gewaehlt.includes(nr) ? gewaehlt.filter((x) => x !== nr) : [...gewaehlt, nr].sort((a, b) => a - b);
      feld.value = gewaehlt.join(' ');
      zeichne(nr);
    } }));
    if (fokus != null) rahmen.querySelector(`[data-nr="${fokus}"]`)?.focus();
  };
  zeichne();
  return h('div', { class: 'mitbild faerben' }, rahmen, feld, !gesperrt && h('p', { class: 'klein' }, 'Tippe die Teile an, die du färben willst. Noch einmal tippen macht ein Teil wieder weiß.'));
}
// Lösungsbild: die verlangte Anzahl, von vorn gefärbt.
export const faerbenLoesungBild = (auf) => bruchSvg([auf.faerben], { gewaehlt: Array.from({ length: auf.loesung }, (_, i) => i) });

// Brucheingabe: Zähler über Nenner mit Bruchstrich, bei gemischten Zahlen davor ein Feld für die Ganzen.
export function bruchEingabe(auf, letzte, gesperrt) {
  const m = String(letzte ?? '').match(/^(-?)(?:(\d*) )?(\d*)\/(\d*)$/) ?? [];
  const feld = (name, wert, etikett) => h('input', { name, type: 'text', inputMode: 'numeric', autocomplete: 'off', size: 3, maxLength: 4, disabled: gesperrt, value: wert ?? '', 'aria-label': etikett });
  // Klasse 7 (ADR 0043): Der Knopf „±“ setzt ein Minus vor den ganzen Bruch.
  const vorzeichen = mitVorzeichen(auf);
  const v = h('input', { type: 'hidden', name: 'bruch-v', value: m[1] ?? '' });
  const zeichen = h('span', { class: 'bruchvorzeichen', 'aria-live': 'polite' }, v.value ? MINUS : '');
  const knopf = h('button', { type: 'button', class: 'schlicht vorzeichen', disabled: gesperrt, 'aria-label': 'Vorzeichen wechseln', title: 'Vorzeichen wechseln',
    onclick: () => { v.value = v.value ? '' : '-'; zeichen.textContent = v.value ? MINUS : ''; } }, '±');
  return h('span', { class: 'brucheingabe' },
    vorzeichen && knopf, vorzeichen && v, vorzeichen && zeichen,
    auf.gemischt && feld('bruch-g', m[2], 'Ganze'),
    h('span', { class: 'bruchfelder' }, feld('bruch-z', m[3], 'Zähler'), h('span', { class: 'bruchstrich', 'aria-hidden': 'true' }), feld('bruch-n', m[4], 'Nenner')),
    auf.einheit && h('span', { class: 'einheit' }, auf.einheit));
}
export function liesBruch(auf, formular) {
  const w = (n) => formular.elements[n]?.value.trim() ?? '';
  const g = auf.gemischt ? w('bruch-g') : '', z = w('bruch-z'), n = w('bruch-n');
  return { eingabe: `${w('bruch-v')}${g ? `${g} ` : ''}${z}/${n}`, leer: !z || !n };
}
