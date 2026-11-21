// Kapitel 1 „Daten und Diagramme“: Strichliste, Säulen- und Balkendiagramm, Bilddiagramm, Liste der Antworten und Tabelle.
// Dazu die beiden Eingaben „Strichliste anlegen“ und „Säulen zeichnen“ (Grilling mit Nils, 2026-11-20):
// - Achsen beginnen bei 0 und gehen in gleichen Schritten. Auf F ist jede Linie beschriftet, ab G jede 2. oder 5.
// - Beim Ziehen einer Säule steht keine mitlaufende Zahl: Das Kind liest selbst an der Achse ab.
// - Säulen rasten auf den Linien ein. Bedienung mit Maus (klicken oder ziehen) und Tastatur (Pfeile, Bild auf/ab, Pos1, Ende).
// - Strichliste: Auf F und G setzt das Programm den fünften Strich quer, ab M setzt das Kind den Querstrich selbst.
// - Bilddiagramm: ein Bild je Diagramm, der Schlüssel steht oben, halbe Bilder sind senkrecht in der Mitte geteilt.
import { h, s } from './dom.js';

const gliedere = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;
const wertVon = (x) => (istFrage(x) ? x.wert : x);
let naechsteId = 0;
const neueId = (vor) => `${vor}-${++naechsteId}`;

// ---------- Strichliste ----------
// Ein Strichmuster ist eine Folge aus „I“ (gerader Strich) und „/“ (Querstrich über die geraden Striche seit dem letzten Querstrich).
// „IIII/“ ist ein richtiges Bündel aus 5 Strichen.
export const buendle = (n) => 'IIII/'.repeat(Math.floor(n / 5)) + 'I'.repeat(n % 5);
export const strichAnzahl = (muster) => [...muster].filter((c) => c === 'I' || c === '/').length;
export const richtigGebuendelt = (muster) => /^(IIII\/)*I{0,4}$/.test(muster);

const STRICH = { abstand: 10, hoehe: 28, luecke: 12, rand: 6 };
// Zeichnet ein Strichmuster. alt: so viele Zeichen am Anfang gehören zur vorgegebenen Liste (etwas heller).
export function striche(muster, { alt = 0, breiteMin = 0 } = {}) {
  const { abstand, hoehe, luecke, rand } = STRICH;
  const teile = [];
  let x = rand, gruppe = [];
  [...muster].forEach((c, i) => {
    const klasse = `strich${i < alt ? ' alt' : ''}`;
    if (c === 'I') {
      teile.push(s('line', { x1: x, x2: x, y1: rand, y2: rand + hoehe, class: klasse }));
      gruppe.push(x); x += abstand;
    } else {
      // Querstrich von links unten nach rechts oben über alle geraden Striche der Gruppe.
      const von = (gruppe[0] ?? x) - 5, bis = (gruppe.at(-1) ?? x) + 5;
      teile.push(s('line', { x1: von, x2: bis, y1: rand + hoehe - 3, y2: rand + 3, class: `${klasse} quer` }));
      gruppe = []; x += luecke;
    }
  });
  const breite = Math.max(breiteMin, x + rand);
  return s('svg', { class: 'striche', viewBox: `0 0 ${breite} ${hoehe + 2 * rand}`, width: breite, height: hoehe + 2 * rand, 'aria-hidden': 'true' }, teile);
}
const strichBreite = (n) => STRICH.rand * 2 + n * STRICH.abstand + Math.ceil(n / 4) * STRICH.luecke;

// Strichliste als Bild: Titel, dann je Zeile Name und Striche.
function strichlisteBild(b) {
  const zeilen = b.zeilen.map((z) => ({ name: z.name, muster: z.striche ?? buendle(z.anzahl) }));
  const breite = Math.max(...zeilen.map((z) => strichBreite(strichAnzahl(z.muster))));
  return h('figure', { class: 'datenbild strichliste', role: 'img', 'aria-label': `Strichliste${b.titel ? `: ${b.titel}` : ''}` },
    b.titel && h('figcaption', { class: 'datentitel' }, b.titel),
    h('table', { class: 'strichtabelle' }, h('tbody', {}, zeilen.map((z) => h('tr', {}, h('th', { scope: 'row' }, z.name), h('td', {}, striche(z.muster, { breiteMin: breite })))))));
}

// Strichliste anlegen. Je Zeile ein verstecktes Feld mit dem Strichmuster.
// buendeln 'auto': „+ Strich“ setzt den fünften Strich von selbst quer. 'selbst': Das Kind drückt „Querstrich“.
export function strichlisteEingabe(auf, letzte, gesperrt) {
  const selbst = auf.buendeln === 'selbst';
  const startMuster = auf.zeilen.map((z) => buendle(z.start ?? 0));
  const muster = auf.zeilen.map((z, i) => (typeof letzte?.[i] === 'string' ? letzte[i] : startMuster[i]));
  const felder = muster.map((m, i) => h('input', { type: 'hidden', name: `strich-${i}`, value: m }));
  const zellen = muster.map(() => h('td', { class: 'strichzelle' }));
  const breite = strichBreite(Math.max(10, ...auf.zeilen.map((z) => z.loesung + 2)));
  const knoepfe = [];
  const zeichne = (i) => {
    const m = felder[i].value, alt = startMuster[i].length;
    zellen[i].replaceChildren(striche(m, { alt, breiteMin: breite }));
    const [plus, quer, minus] = knoepfe[i];
    // Querstrich nur, wenn seit dem letzten Querstrich gerade Striche stehen.
    if (quer) quer.disabled = gesperrt || !/I$/.test(m);
    minus.disabled = gesperrt || m.length <= alt;
    plus.disabled = gesperrt || strichAnzahl(m) >= 40;
  };
  const setze = (i, m) => { felder[i].value = m; zeichne(i); };
  const zeilen = auf.zeilen.map((z, i) => {
    const plus = h('button', { type: 'button', class: 'strichknopf', 'data-zeile': i, 'data-knopf': 'plus', 'aria-label': `Strich bei ${z.name}`,
      onclick: () => { const m = felder[i].value; setze(i, selbst ? `${m}I` : buendle(strichAnzahl(m) + 1)); } }, '+ Strich');
    const quer = selbst && h('button', { type: 'button', class: 'strichknopf', 'data-zeile': i, 'data-knopf': 'quer', 'aria-label': `Querstrich bei ${z.name}`,
      onclick: () => setze(i, `${felder[i].value}/`) }, 'Querstrich');
    const minus = h('button', { type: 'button', class: 'strichknopf leise', 'data-zeile': i, 'data-knopf': 'minus', 'aria-label': `Letzten Strich bei ${z.name} wegnehmen`,
      onclick: () => { const m = felder[i].value; setze(i, selbst ? m.slice(0, -1) : buendle(Math.max(z.start ?? 0, strichAnzahl(m) - 1))); } }, '−');
    knoepfe[i] = [plus, quer, minus];
    return h('tr', { 'data-name': z.name }, h('th', { scope: 'row' }, z.name), h('td', { class: 'strichknoepfe' }, plus, quer, minus), zellen[i]);
  });
  muster.forEach((_, i) => zeichne(i));
  return h('div', { class: 'strichliste-anlegen' },
    h('table', { class: 'strichtabelle eingabe' }, h('tbody', {}, zeilen)), felder,
    !gesperrt && h('p', { class: 'klein' }, selbst
      ? 'Mit „+ Strich“ machst du einen geraden Strich. Den fünften Strich setzt du mit „Querstrich“ quer über die vier.'
      : 'Mit „+ Strich“ machst du einen Strich. Der fünfte Strich wird von selbst quer gesetzt.'));
}

// ---------- Säulen- und Balkendiagramm ----------
// d: { titel, einheit, max, schritt (beschriftete Linien), fein (alle Linien), ab (Beginn der Achse, sonst 0), liegend, werteZeigen, ohne, saeulen }
// Gezeichnet wird mit festen Maßen im viewBox, das Bild wird über CSS auf die Breite der Karte gebracht.
function masse(d) {
  const ab = d.ab ?? 0, fein = d.fein ?? d.schritt, linien = (d.max - ab) / fein;
  const n = d.saeulen.length;
  if (d.liegend) {
    const namen = 118, oben = d.ohne?.includes('titel') ? 14 : 42, zeile = 46, unten = 52, rechts = 26;
    const B = 600, plot = B - namen - rechts, H = oben + n * zeile + unten;
    return { ab, fein, linien, B, H, namen, oben, zeile, rechts, plot, x: (w) => namen + ((w - ab) / (d.max - ab)) * plot };
  }
  const links = 62, oben = d.ohne?.includes('titel') ? 34 : 58, rechts = 14, unten = 44;
  const plotH = Math.min(320, Math.max(220, linien * 14)), B = 560, H = oben + plotH + unten;
  const platz = (B - links - rechts) / n, breit = Math.min(66, platz * 0.58);
  return { ab, fein, linien, B, H, links, oben, rechts, unten, plotH, platz, breit, y: (w) => oben + plotH - ((w - ab) / (d.max - ab)) * plotH };
}
// Achse und Linien. Jede Linie ist ein feiner Strich, jede beschriftete etwas kräftiger.
function achse(d, m) {
  const teile = [];
  for (let w = m.ab; w <= d.max + 1e-9; w += m.fein) {
    const beschriftet = (w - m.ab) % d.schritt === 0, grund = w === m.ab;
    const klasse = grund ? 'grund' : beschriftet ? 'gitter stark' : 'gitter';
    if (d.liegend) {
      const x = m.x(w);
      teile.push(s('line', { x1: x, x2: x, y1: m.oben - 4, y2: m.oben + d.saeulen.length * m.zeile, class: klasse }));
      if (beschriftet) teile.push(s('text', { x, y: m.oben + d.saeulen.length * m.zeile + 20, 'text-anchor': 'middle', class: 'achsenzahl' }, gliedere(w)));
    } else {
      const y = m.y(w);
      teile.push(s('line', { x1: m.links, x2: m.B - m.rechts, y1: y, y2: y, class: klasse }));
      if (beschriftet) teile.push(s('text', { x: m.links - 8, y: y + 5, 'text-anchor': 'end', class: 'achsenzahl' }, gliedere(w)));
    }
  }
  // Senkrechte (liegend: waagerechte) Achse am Rand.
  teile.push(d.liegend
    ? s('line', { x1: m.namen, x2: m.namen, y1: m.oben - 4, y2: m.oben + d.saeulen.length * m.zeile, class: 'grund' })
    : s('line', { x1: m.links, x2: m.links, y1: m.oben - 6, y2: m.oben + m.plotH, class: 'grund' }));
  if (!d.ohne?.includes('einheit')) teile.push(d.liegend
    ? s('text', { x: m.B - m.rechts, y: m.oben + d.saeulen.length * m.zeile + 42, 'text-anchor': 'end', class: 'einheit' }, d.einheit)
    : s('text', { x: 4, y: m.oben - 16, class: 'einheit' }, d.einheit));
  if (!d.ohne?.includes('titel')) teile.push(s('text', { x: m.B / 2, y: 22, 'text-anchor': 'middle', class: 'titel' }, d.titel));
  return teile;
}
// Eine Säule (oder ein Balken) von der Achse bis zum Wert.
function balken(d, m, i, wert, klasse = 'saeule') {
  if (wert == null || wert <= m.ab) return null;
  if (d.liegend) {
    const y = m.oben + i * m.zeile + m.zeile * 0.2, hoch = m.zeile * 0.6;
    return s('rect', { x: m.x(m.ab), y, width: m.x(wert) - m.x(m.ab), height: hoch, rx: 2, class: klasse });
  }
  const x = m.links + m.platz * i + (m.platz - m.breit) / 2;
  return s('rect', { x, y: m.y(wert), width: m.breit, height: m.y(m.ab) - m.y(wert), rx: 2, class: klasse });
}
function name(d, m, i, text) {
  return d.liegend
    ? s('text', { x: m.namen - 10, y: m.oben + i * m.zeile + m.zeile / 2 + 5, 'text-anchor': 'end', class: 'name' }, text)
    : s('text', { x: m.links + m.platz * i + m.platz / 2, y: m.oben + m.plotH + 22, 'text-anchor': 'middle', class: 'name' }, text);
}
const beschreibung = (d) => `${d.liegend ? 'Balkendiagramm' : 'Säulendiagramm'}${d.ohne?.includes('titel') ? ' ohne Titel' : `: ${d.titel}`}`;

// Säulen- oder Balkendiagramm als Bild. Eine Säule mit { frage: true } fehlt: An ihrer Stelle steht ein Fragezeichen.
export function saeulenBild(d) {
  const m = masse(d);
  const svg = s('svg', { class: 'datendiagramm', viewBox: `0 0 ${m.B} ${m.H}`, role: 'img', 'aria-label': beschreibung(d) }, achse(d, m));
  d.saeulen.forEach((sa, i) => {
    if (istFrage(sa.wert)) {
      svg.append(d.liegend
        ? s('text', { x: m.x(m.ab) + 14, y: m.oben + i * m.zeile + m.zeile / 2 + 8, class: 'frage' }, '?')
        : s('text', { x: m.links + m.platz * i + m.platz / 2, y: m.y(m.ab) - 10, 'text-anchor': 'middle', class: 'frage' }, '?'));
    } else {
      svg.append(balken(d, m, i, sa.wert));
      if (d.werteZeigen) svg.append(d.liegend
        ? s('text', { x: m.x(sa.wert) + 8, y: m.oben + i * m.zeile + m.zeile / 2 + 5, class: 'wert' }, gliedere(sa.wert))
        : s('text', { x: m.links + m.platz * i + m.platz / 2, y: m.y(sa.wert) - 7, 'text-anchor': 'middle', class: 'wert' }, gliedere(sa.wert)));
    }
    svg.append(name(d, m, i, sa.name));
  });
  return h('figure', { class: 'datenbild' }, svg);
}

// Säulen zeichnen: Offene Säulen lassen sich mit der Maus ziehen oder mit der Tastatur verstellen.
// Der Wert jeder offenen Säule steht in einem versteckten Feld (saeule-i). 0 heißt: noch nicht gezeichnet.
export function zeichnenEingabe(auf, letzte, gesperrt) {
  const d = { ...auf.diagramm, ab: 0 };
  const m = masse(d), fein = d.fein;
  const offen = d.saeulen.map((sa) => Boolean(sa.offen));
  const start = d.saeulen.map((sa) => (sa.offen ? sa.start ?? 0 : sa.wert));
  const werte = d.saeulen.map((sa, i) => (sa.offen && Number.isFinite(Number(letzte?.[i])) && letzte?.[i] !== '' && letzte?.[i] != null ? Number(letzte[i]) : start[i]));
  const felder = d.saeulen.map((sa, i) => sa.offen && h('input', { type: 'hidden', name: `saeule-${i}`, value: String(werte[i]) }));
  let gewaehlt = null, zieht = null;
  const svg = s('svg', { class: `datendiagramm zeichnen${gesperrt ? ' gesperrt' : ''}`, viewBox: `0 0 ${m.B} ${m.H}`, role: 'group', 'aria-label': `${beschreibung(d)}. Ziehe die offenen Säulen auf die richtige Höhe.` });
  const zuruecksetzen = h('button', { type: 'button', class: 'schlicht', id: 'saeule-zuruecksetzen', disabled: true,
    onclick: () => { if (gewaehlt == null) return; setze(gewaehlt, start[gewaehlt]); svg.querySelector(`[data-saeule="${gewaehlt}"]`)?.focus(); } }, 'Säule zurücksetzen');
  const einrasten = (w) => Math.max(0, Math.min(d.max, Math.round(w / fein) * fein));
  // Wert aus der Mausposition: die nächste Linie.
  const wertAus = (ereignis) => {
    const p = svg.createSVGPoint(); p.x = ereignis.clientX; p.y = ereignis.clientY;
    const q = p.matrixTransform(svg.getScreenCTM().inverse());
    return einrasten(m.ab + ((m.y(m.ab) - q.y) / m.plotH) * (d.max - m.ab));
  };
  const zeichne = () => {
    svg.replaceChildren(...achse(d, m));
    d.saeulen.forEach((sa, i) => {
      const x = m.links + m.platz * i + (m.platz - m.breit) / 2;
      if (!offen[i]) { svg.append(balken(d, m, i, werte[i]), name(d, m, i, sa.name)); return; }
      const w = werte[i], oben = m.y(w);
      const g = s('g', { class: `offen${gewaehlt === i ? ' gewaehlt' : ''}`, 'data-saeule': i, tabindex: gesperrt ? null : 0, role: 'slider',
        'aria-label': `Säule ${sa.name}`, 'aria-valuemin': 0, 'aria-valuemax': d.max, 'aria-valuenow': w, 'aria-disabled': gesperrt ? 'true' : null });
      // Die ganze Spalte nimmt Klicks an: Ein Klick setzt die Säule auf die nächste Linie.
      g.append(s('rect', { x: m.links + m.platz * i + 2, y: m.oben - 8, width: m.platz - 4, height: m.plotH + 8, class: 'spalte' }));
      if (w > 0) g.append(balken(d, m, i, w, 'saeule gezogen'));
      else g.append(s('rect', { x, y: m.y(m.ab) - 4, width: m.breit, height: 4, class: 'platzhalter' }));
      // Griff an der Oberkante: zeigt, dass man hier ziehen kann.
      const gy = w > 0 ? oben : m.y(m.ab);
      g.append(s('g', { class: 'griff' },
        s('rect', { x: x + m.breit / 2 - 16, y: gy - 9, width: 32, height: 14, rx: 4 }),
        s('line', { x1: x + m.breit / 2 - 8, x2: x + m.breit / 2 + 8, y1: gy - 4.5, y2: gy - 4.5 }),
        s('line', { x1: x + m.breit / 2 - 8, x2: x + m.breit / 2 + 8, y1: gy + 0.5, y2: gy + 0.5 })));
      if (!gesperrt) {
        g.addEventListener('pointerdown', (e) => { e.preventDefault(); zieht = i; waehle(i); svg.setPointerCapture?.(e.pointerId); setze(i, wertAus(e)); svg.querySelector(`[data-saeule="${i}"]`)?.focus({ preventScroll: true }); });
        g.addEventListener('keydown', (e) => {
          const schritt = { ArrowUp: fein, ArrowRight: fein, ArrowDown: -fein, ArrowLeft: -fein, PageUp: d.schritt, PageDown: -d.schritt }[e.key];
          if (schritt != null) { e.preventDefault(); waehle(i); setze(i, einrasten(werte[i] + schritt)); }
          else if (e.key === 'Home') { e.preventDefault(); waehle(i); setze(i, 0); }
          else if (e.key === 'End') { e.preventDefault(); waehle(i); setze(i, d.max); }
        });
        g.addEventListener('focus', () => { if (gewaehlt !== i) { gewaehlt = i; zuruecksetzen.disabled = false; g.classList.add('gewaehlt'); } });
      }
      svg.append(g, name(d, m, i, sa.name));
    });
  };
  const waehle = (i) => { gewaehlt = i; zuruecksetzen.disabled = gesperrt; };
  const setze = (i, w) => {
    if (werte[i] === w && svg.childNodes.length) return;
    werte[i] = w; felder[i].value = String(w);
    const fokus = document.activeElement?.closest?.('[data-saeule]')?.dataset.saeule;
    zeichne();
    if (fokus != null) svg.querySelector(`[data-saeule="${fokus}"]`)?.focus({ preventScroll: true });
  };
  if (!gesperrt) {
    svg.addEventListener('pointermove', (e) => { if (zieht != null) setze(zieht, wertAus(e)); });
    const ende = () => { zieht = null; };
    svg.addEventListener('pointerup', ende);
    svg.addEventListener('pointercancel', ende);
  }
  zeichne();
  return h('div', { class: 'mitbild zeichnen-eingabe' }, h('div', { class: 'bildrahmen' }, h('figure', { class: 'datenbild' }, svg)), felder.filter(Boolean),
    !gesperrt && h('div', { class: 'zeichnen-leiste' },
      h('p', { class: 'klein' }, 'Ziehe jede offene Säule an ihrem Griff nach oben oder klicke auf die richtige Höhe. Mit der Tastatur: Pfeiltasten.'),
      zuruecksetzen));
}
// Das fertige Diagramm zu einer Zeichenaufgabe (für die Lösung).
export function zeichnenLoesung(auf) {
  return saeulenBild({ ...auf.diagramm, saeulen: auf.diagramm.saeulen.map((sa) => ({ name: sa.name, wert: sa.wert })) });
}

// ---------- Bilddiagramm ----------
export const SYMBOLE = {
  // Kind: Kopf und Körper.
  kind: () => [s('circle', { cx: 14, cy: 7, r: 5.5, class: 'sym-haut' }), s('path', { d: 'M5 27 Q5 14 14 14 Q23 14 23 27 Z', class: 'sym-kleid' })],
  // Buch: Einband mit Rücken und Seiten.
  buch: () => [s('rect', { x: 4, y: 4, width: 20, height: 22, rx: 2, class: 'sym-einband' }), s('rect', { x: 4, y: 4, width: 4, height: 22, class: 'sym-ruecken' }),
    s('line', { x1: 11, x2: 21, y1: 10, y2: 10, class: 'sym-zeile' }), s('line', { x1: 11, x2: 21, y1: 14, y2: 14, class: 'sym-zeile' })],
  // Schaf: Wolle, Kopf und Beine.
  schaf: () => [s('line', { x1: 9, x2: 9, y1: 19, y2: 26, class: 'sym-bein' }), s('line', { x1: 18, x2: 18, y1: 19, y2: 26, class: 'sym-bein' }),
    s('ellipse', { cx: 13, cy: 15, rx: 10, ry: 7, class: 'sym-wolle' }), s('circle', { cx: 23, cy: 11, r: 4, class: 'sym-kopf' })],
  // Apfel: rund, mit Stiel und Blatt.
  apfel: () => [s('path', { d: 'M14 9 Q4 5 4 16 Q5 27 14 26 Q23 27 24 16 Q24 5 14 9 Z', class: 'sym-apfel' }), s('line', { x1: 14, x2: 15, y1: 9, y2: 3, class: 'sym-stiel' }),
    s('path', { d: 'M15 5 Q20 1 22 5 Q18 7 15 5 Z', class: 'sym-blatt' })],
};
const SYMBOLNAME = { kind: 'Kind', buch: 'Buch', schaf: 'Schaf', apfel: 'Apfel' };
const GROESSE = 28;
// Ein Symbol an der Stelle x, y. halb: nur die linke Hälfte, senkrecht in der Mitte abgeschnitten.
function symbol(art, x, y, halb = false) {
  const g = s('g', { transform: `translate(${x} ${y})`, class: `symbol${halb ? ' halb' : ''}` });
  if (halb) {
    const id = neueId('halb');
    g.append(s('clipPath', { id }, s('rect', { x: 0, y: 0, width: GROESSE / 2, height: GROESSE })));
    g.append(s('g', { 'clip-path': `url(#${id})` }, SYMBOLE[art]()));
    g.append(s('line', { x1: GROESSE / 2, x2: GROESSE / 2, y1: 2, y2: GROESSE - 2, class: 'schnitt' }));
  } else g.append(...SYMBOLE[art]());
  return g;
}
function bilddiagrammBild(b) {
  const namen = 120, abstand = 34, zeile = 40, oben = 92, rand = 10;
  const anzahl = b.zeilen.map((z) => (istFrage(z.wert) ? 0 : wertVon(z.wert) / b.je));
  const B = Math.max(420, namen + Math.max(...anzahl.map(Math.ceil), 1) * abstand + rand * 2);
  const H = oben + b.zeilen.length * zeile + rand;
  const svg = s('svg', { class: 'datendiagramm bilddiagramm', viewBox: `0 0 ${B} ${H}`, role: 'img',
    'aria-label': `Bilddiagramm: ${b.titel}. Ein Bild ${SYMBOLNAME[b.symbol]} steht für ${b.je} ${b.einheit}.` },
  s('text', { x: B / 2, y: 22, 'text-anchor': 'middle', class: 'titel' }, b.titel),
  // Schlüssel oben, in einem Kasten.
  s('rect', { x: rand, y: 36, width: 250, height: 40, rx: 6, class: 'schluessel' }),
  s('text', { x: rand + 12, y: 61, class: 'schluesseltext' }, 'Schlüssel:'),
  symbol(b.symbol, rand + 96, 42),
  s('text', { x: rand + 132, y: 61, class: 'schluesseltext' }, `= ${gliedere(b.je)} ${b.einheit}`));
  b.zeilen.forEach((z, i) => {
    const y = oben + i * zeile;
    if (i > 0) svg.append(s('line', { x1: rand, x2: B - rand, y1: y - 3, y2: y - 3, class: 'zeilenlinie' }));
    svg.append(s('text', { x: namen - 12, y: y + 22, 'text-anchor': 'end', class: 'name' }, z.name));
    if (istFrage(z.wert)) { svg.append(s('text', { x: namen + 6, y: y + 24, class: 'frage' }, '?')); return; }
    const ganz = Math.floor(anzahl[i]), halb = anzahl[i] - ganz > 0;
    for (let k = 0; k < ganz; k++) svg.append(symbol(b.symbol, namen + k * abstand, y + 2));
    if (halb) svg.append(symbol(b.symbol, namen + ganz * abstand, y + 2, true));
  });
  svg.append(s('line', { x1: namen - 4, x2: namen - 4, y1: oben - 4, y2: H - rand, class: 'grund' }));
  return h('figure', { class: 'datenbild' }, svg);
}

// ---------- Liste der Antworten und Tabelle ----------
// Antwortkärtchen einer Umfrage. Ein Klick hakt ein Kärtchen ab (nur als Zählhilfe, es wird nicht bewertet).
export function urlisteBild(liste, gesperrt = false) {
  return h('div', { class: 'urliste' },
    h('ul', { class: 'antwortkarten', 'aria-label': `${liste.length} Antworten` }, liste.map((x) => h('li', {},
      h('button', { type: 'button', class: 'antwortkarte', 'aria-pressed': 'false', disabled: gesperrt,
        onclick: (e) => { const b = e.currentTarget; const an = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(an)); } }, x)))),
    !gesperrt && h('p', { class: 'klein' }, 'Tipp: Klicke ein Kärtchen an, wenn du es gezählt hast.'));
}
export function datenTabelle(t) {
  return h('table', { class: 'aufgabentabelle datentabelle' },
    h('thead', {}, h('tr', {}, t.kopf.map((k) => h('th', { scope: 'col' }, k)))),
    h('tbody', {}, t.zeilen.map((z) => h('tr', { class: z[0] === 'Gesamt' ? 'gesamt' : null }, z.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, c) : h('td', { class: c === '?' ? 'frage' : null }, c)))))));
}

export const DATENBILDER = { strichliste: strichlisteBild, saeulen: saeulenBild, bilddiagramm: bilddiagrammBild };
