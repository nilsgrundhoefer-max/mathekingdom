// Kapitel 2 „Natürliche Zahlen“: Stellenwerttafel mit Ziffern oder Plättchen, Schätzbild mit Raster,
// dazu die Eingaben „Ordnen“ (Zahlenkarten in eine Reihenfolge bringen) und „Zeichen“ (römische Zahlzeichen, Zweiersystem).
// Grilling mit Nils, 2026-11-21 (ADR 0030):
// - Schätzbild: Jedes Kind sieht dasselbe Bild. Die Plätze der Symbole folgen aus der Saat der Aufgabe.
//   Auf F und G liegt das Raster fest über dem Bild, ab M blendet das Kind es selbst ein und wählt grob oder fein.
// - Ordnen: Karten tauschen mit den Pfeilknöpfen oder den Pfeiltasten. Richtig ist nur die ganze Reihenfolge.
// - Römische Zahlzeichen werden über sieben Knöpfe eingegeben, damit kein kleines l als I durchgeht.
import { h, s } from './dom.js';
import { SYMBOLE } from './datenbilder.js';

// Tausenderlücke ab fünf Stellen, wie im Aufgabentext.
// Klasse 7 (ADR 0043): Eine negative Zahl bekommt das echte Minuszeichen.
export const gliedere = (n) => (typeof n === 'number' && n < 0 ? `−${gliedere(-n)}` : Number(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;

// ---------- Stellenwerttafel ----------
// b: { spalten: ['T', 'H', 'Z', 'E'], werte: [3, 0, 5, null], plaettchen?, gruppen?: [{ name, spalten }] }
// Ein Wert null ist ein leeres Feld, { wert, frage: true } ein Fragezeichen. Mit plaettchen liegen Plättchen statt Ziffern in den Feldern.
function plaettchenReihe(n) {
  const r = 9, k = 24, proReihe = 5, reihen = Math.max(1, Math.ceil(n / proReihe));
  const svg = s('svg', { class: 'tafelplaettchen', viewBox: `0 0 ${proReihe * k} ${reihen * k}`, width: proReihe * k, height: reihen * k, 'aria-hidden': 'true' });
  for (let i = 0; i < n; i++) svg.append(s('circle', { cx: (i % proReihe) * k + k / 2, cy: Math.floor(i / proReihe) * k + k / 2, r }));
  return svg;
}
export function tafelBild(b) {
  const zelle = (w) => (w == null ? '' : istFrage(w) ? h('span', { class: 'bildfrage' }, '?') : b.plaettchen ? plaettchenReihe(w) : String(w));
  const lies = (w) => (w == null ? 'leer' : istFrage(w) ? 'gesucht' : String(w));
  return h('figure', { class: 'datenbild', role: 'img',
    'aria-label': `Stellenwerttafel: ${[b.werte, ...(b.weitere ?? [])].map((zeile) => b.spalten.map((n, i) => `${n} ${lies(zeile[i])}`).join(', ')).join('; ')}` }, h('table', { class: `stellentafel${b.plaettchen ? ' mit-plaettchen' : ''}` },
  h('thead', {},
    b.gruppen && h('tr', { class: 'gruppen' }, b.gruppen.map((g) => h('th', { colSpan: g.spalten, scope: 'colgroup' }, g.name))),
    h('tr', {}, b.spalten.map((n, i) => h('th', { scope: 'col', class: blockRand(b, i) }, n)))),
  // weitere: zusätzliche Zeilen, um zwei oder mehr Zahlen Stelle für Stelle zu vergleichen.
  h('tbody', {}, [b.werte, ...(b.weitere ?? [])].map((zeile) => h('tr', {}, zeile.map((w, i) => h('td', { class: blockRand(b, i) }, zelle(w))))))),
  // Klasse 6, Kapitel 5 (ADR 0048): Verschiebepfeile. Mit einer Stufenzahl malnehmen oder durch sie teilen: Jede Ziffer rückt in der Tafel weiter.
  b.schieben && h('figcaption', { class: 'schiebepfeil' }, h('span', { class: 'pfeile', 'aria-hidden': 'true' }, (b.schieben.richtung === 'links' ? '⟵' : '⟶').repeat(b.schieben.stellen)),
    ` ${b.schieben.rechnung}: Jede Ziffer rückt ${b.schieben.stellen === 1 ? 'eine Stelle' : `${b.schieben.stellen} Stellen`} nach ${b.schieben.richtung}.`));
}
// Dicke Linie zwischen den Dreierblöcken einer großen Stellenwerttafel.
function blockRand(b, i) {
  // Kapitel 9: Nach den Einern steht das Komma auf einer kräftigen Trennlinie.
  if (b.komma === i) return 'blockende kommaspalte';
  if (!b.gruppen) return null;
  let ende = 0;
  for (const g of b.gruppen) { ende += g.spalten; if (i === ende - 1 && ende < b.spalten.length) return 'blockende'; }
  return null;
}

// ---------- Schätzbild ----------
// b: { symbol, felder: [[Anzahl je Feld]], raster: 'fest' | 'wahl' | 'ohne', grob?: [spalten, reihen], markiert?: [reihe, spalte], gezaehlt?, saat }
// Der Zufall ist fest geimpft, damit jedes Kind dasselbe Bild sieht (derselbe Generator wie im Erzeuger).
function zufallVon(saat) {
  let x = saat | 0;
  return () => {
    x = (x + 0x6d2b79f5) | 0;
    let t = Math.imul(x ^ (x >>> 15), 1 | x);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const SCHAETZNAME = { punkt: 'Punkte', schaf: 'Schafe', apfel: 'Äpfel', kind: 'Menschen', vogel: 'Vögel', stern: 'Sterne' };
const EIGENE = {
  punkt: () => [s('circle', { cx: 14, cy: 14, r: 9, class: 'sym-punkt' })],
  vogel: () => [s('path', { d: 'M2 12 Q8 4 14 12 Q20 4 26 12', class: 'sym-vogel' })],
  stern: () => [s('path', { d: 'M14 2 L17 11 L26 11 L19 16 L22 25 L14 19 L6 25 L9 16 L2 11 L11 11 Z', class: 'sym-stern' })],
};
const zeichne = (art) => (EIGENE[art] ?? SYMBOLE[art] ?? EIGENE.punkt)();
// Plätze der Symbole: Jedes Feld wird in kleine Kästchen geteilt, jedes Symbol bekommt ein eigenes Kästchen und wackelt darin etwas.
// So überdeckt kein Symbol ein anderes, und keines liegt auf einer Rasterlinie.
export function schaetzPlaetze(b, breite, hoehe) {
  const reihen = b.felder.length, spalten = b.felder[0].length, fb = breite / spalten, fh = hoehe / reihen;
  const zufall = zufallVon(b.saat ?? 1), plaetze = [];
  const groesste = Math.max(1, ...b.felder.flat());
  const k = Math.ceil(Math.sqrt(groesste * 1.35));
  const kb = (fb - 8) / k, kh = (fh - 8) / k, groesse = Math.min(22, kb - 2, kh - 2);
  b.felder.forEach((zeile, r) => zeile.forEach((n, c) => {
    const frei = Array.from({ length: k * k }, (_, i) => i);
    for (let i = 0; i < n; i++) {
      const j = Math.floor(zufall() * frei.length), platz = frei.splice(j, 1)[0];
      const x = c * fb + 4 + (platz % k) * kb + zufall() * (kb - groesse), y = r * fh + 4 + Math.floor(platz / k) * kh + zufall() * (kh - groesse);
      plaetze.push({ x, y, groesse });
    }
  }));
  return plaetze;
}
export function schaetzBild(b) {
  const reihen = b.felder.length, spalten = b.felder[0].length;
  const B = 660, H = Math.round((B / spalten) * reihen * (b.flach ?? 0.8)), fb = B / spalten, fh = H / reihen;
  const name = SCHAETZNAME[b.symbol] ?? 'Dinge';
  const svg = s('svg', { class: 'schaetzbild', viewBox: `-2 -2 ${B + 4} ${H + 4}`, role: 'img', 'aria-label': `Schätzbild: viele ${name} auf einer Fläche` },
    s('rect', { x: 0, y: 0, width: B, height: H, class: 'flaeche' }));
  for (const p of schaetzPlaetze(b, B, H)) svg.append(s('g', { transform: `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(p.groesse / 28).toFixed(3)})`, class: 'symbol' }, zeichne(b.symbol)));
  const linien = s('g', { class: 'rasterlinien' });
  const male = (sp, re) => {
    linien.replaceChildren();
    for (let c = 1; c < sp; c++) linien.append(s('line', { x1: (B / sp) * c, x2: (B / sp) * c, y1: 0, y2: H }));
    for (let r = 1; r < re; r++) linien.append(s('line', { x1: 0, x2: B, y1: (H / re) * r, y2: (H / re) * r }));
  };
  svg.append(linien);
  if (b.raster === 'fest') male(spalten, reihen);
  if (b.markiert) svg.append(s('rect', { x: b.markiert[1] * fb, y: b.markiert[0] * fh, width: fb, height: fh, class: 'markiert' }));
  svg.append(s('rect', { x: 0, y: 0, width: B, height: H, class: 'rand' }));
  const figur = h('figure', { class: 'datenbild schaetzfigur' }, svg);
  if (b.markiert && b.gezaehlt) figur.append(h('figcaption', { class: 'schaetzhinweis' }, `Im gelben Feld sind es ${b.felder[b.markiert[0]][b.markiert[1]]} ${name}.`));
  // Ab M: Das Kind blendet das Raster selbst ein und wählt die Feldgröße.
  if (b.raster === 'wahl') {
    const grob = b.grob ?? [spalten / 2, reihen / 2];
    const stufen = [['Kein Raster', 0, 0], [`Grobes Raster (${grob[0] * grob[1]} Felder)`, grob[0], grob[1]], [`Feines Raster (${spalten * reihen} Felder)`, spalten, reihen]];
    const knoepfe = stufen.map(([text, sp, re], i) => h('button', { type: 'button', class: 'schlicht rasterknopf', 'aria-pressed': String(i === 0),
      onclick: (e) => { male(sp, re); for (const k of knoepfe) k.setAttribute('aria-pressed', String(k === e.currentTarget)); } }, text));
    figur.append(h('div', { class: 'rasterwahl', role: 'group', 'aria-label': 'Raster einblenden' }, knoepfe));
  }
  return figur;
}

// ---------- Ordnen ----------
// Die Reihenfolge steht als JSON in einem versteckten Feld. Die Karten stehen untereinander (Version 0.66, ADR 0057).
// Jede Karte hat zwei Pfeilknöpfe, lässt sich mit der Maus oder dem Finger ziehen und wandert mit den Pfeiltasten.
export function ordnenEingabe(auf, letzte, gesperrt) {
  let reihe = Array.isArray(letzte) && letzte.length === auf.karten.length ? [...letzte] : [...auf.karten];
  const feld = h('input', { type: 'hidden', name: 'ordnung', value: JSON.stringify(reihe) });
  // Nach einem Fehlversuch liegt die Reihenfolge des Kindes schon da und darf so noch einmal geprüft werden.
  if (Array.isArray(letzte)) feld.dataset.bewegt = '1';
  // Klasse 7 Kapitel 2 (ADR 0044): Konstruktionsschritte sind ganze Sätze. Sie brechen um.
  const saetze = auf.karten.some((k) => String(k).length > 24);
  const liste = h('ol', { class: `ordnen${saetze ? ' saetze' : ''}`, 'aria-label': saetze ? 'Karten in ihrer jetzigen Reihenfolge' : 'Zahlenkarten in ihrer jetzigen Reihenfolge' });
  const lege = (i, j) => {
    if (j < 0 || j >= reihe.length || i === j) return false;
    reihe.splice(j, 0, ...reihe.splice(i, 1));
    feld.value = JSON.stringify(reihe);
    feld.dataset.bewegt = '1';
    male();
    return true;
  };
  const tausche = (i, j, fokus) => { if (lege(i, j)) liste.children[j]?.querySelector(fokus)?.focus(); };
  // Ziehen: Die Karte folgt dem Zeiger, die anderen rücken zur Seite. Beim Loslassen liegt sie an ihrem neuen Platz.
  const ziehe = (li, i, start) => {
    if (gesperrt || start.button > 0 || start.target.closest('button')) return;
    const karten = [...liste.children], kasten = karten.map((k) => k.getBoundingClientRect());
    const schritt = kasten[i].height + (karten.length > 1 ? Math.abs(kasten[1].top - kasten[0].bottom) : 0);
    let ziel = i, bewegt = false;
    const bewege = (e) => {
      const dy = e.clientY - start.clientY;
      if (!bewegt && Math.abs(dy) < 5) return;
      if (!bewegt) { bewegt = true; li.classList.add('zieht'); li.setPointerCapture?.(start.pointerId); }
      e.preventDefault();
      li.style.transform = `translateY(${dy}px)`;
      const mitte = kasten[i].top + kasten[i].height / 2 + dy;
      ziel = kasten.filter((k, n) => n !== i && (k.top + k.height / 2 < mitte)).length;
      karten.forEach((k, n) => { if (n !== i) k.style.transform = n > i && n <= ziel ? `translateY(${-schritt}px)` : n < i && n >= ziel ? `translateY(${schritt}px)` : ''; });
    };
    const ende = () => {
      li.removeEventListener('pointermove', bewege); li.removeEventListener('pointerup', ende); li.removeEventListener('pointercancel', ende);
      if (!bewegt) return;
      if (!lege(i, ziel)) male();
      liste.children[ziel]?.querySelector('.kartenwert')?.focus({ preventScroll: true });
    };
    li.addEventListener('pointermove', bewege); li.addEventListener('pointerup', ende); li.addEventListener('pointercancel', ende);
  };
  const male = () => liste.replaceChildren(...reihe.map((karte, i) => {
    const li = h('li', { class: 'ordnenkarte' },
      !gesperrt && h('span', { class: 'ziehgriff', 'aria-hidden': 'true' }, '⠿'),
      h('span', { class: 'kartenwert', tabindex: gesperrt ? null : 0, role: 'group', 'aria-label': `Karte ${karte}, Platz ${i + 1} von ${reihe.length}. Mit den Pfeiltasten verschieben.`,
        onkeydown: (e) => { if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); tausche(i, i - 1, '.kartenwert'); } if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); tausche(i, i + 1, '.kartenwert'); } } }, karte),
      h('button', { type: 'button', class: 'schieb links', disabled: gesperrt || i === 0, 'aria-label': `${karte} nach oben`, onclick: () => tausche(i, i - 1, '.links:not(:disabled), .rechts') }, '▲'),
      h('button', { type: 'button', class: 'schieb rechts', disabled: gesperrt || i === reihe.length - 1, 'aria-label': `${karte} nach unten`, onclick: () => tausche(i, i + 1, '.rechts:not(:disabled), .links') }, '▼'));
    li.addEventListener('pointerdown', (e) => ziehe(li, i, e));
    return li;
  }));
  male();
  return h('div', { class: 'ordnenfeld' }, feld,
    h('p', { class: 'klein ordnen-oben' }, '↑ ', auf.links ?? 'zuerst'), liste, h('p', { class: 'klein ordnen-unten' }, '↓ ', auf.rechts ?? 'zuletzt'),
    !gesperrt && h('p', { class: 'klein' }, 'Ziehe die Karten an ihren Platz oder verschiebe sie mit den Pfeilen.'));
}
export const liesOrdnung = (formular) => { try { return JSON.parse(formular.elements.ordnung?.value ?? '[]'); } catch { return []; } };

// ---------- Zeichen ----------
// Ein Feld für eine Zeichenfolge und je Zeichen ein Knopf. Getippt werden kann auch, aber nur die erlaubten Zeichen bleiben stehen.
export function zeichenEingabe(auf, letzte, gesperrt) {
  const erlaubt = new Set(auf.tasten);
  const sauber = (t) => [...String(t).toUpperCase()].filter((c) => erlaubt.has(c)).join('');
  const feld = h('input', { name: 'zeichen', class: 'zeichenfeld', type: 'text', autocomplete: 'off', spellcheck: false, size: 12, disabled: gesperrt, value: letzte ?? '',
    'aria-label': 'Deine Antwort', oninput: (e) => { const neu = sauber(e.target.value); if (neu !== e.target.value) e.target.value = neu; } });
  const knopf = (text, tue, label) => h('button', { type: 'button', class: 'schlicht zeichentaste', disabled: gesperrt, 'aria-label': label ?? `Zeichen ${text}`, onclick: () => { tue(); feld.focus(); } }, text);
  return h('div', { class: 'zeicheneingabe' },
    h('span', { class: 'zahlfeld' }, feld, auf.einheit && h('span', { class: 'einheit' }, auf.einheit)),
    h('div', { class: 'zeichentasten', role: 'group', 'aria-label': 'Zeichen eintippen' },
      auf.tasten.map((t) => knopf(t, () => { feld.value += t; })),
      knopf('⌫', () => { feld.value = feld.value.slice(0, -1); }, 'Letztes Zeichen löschen')));
}

// ---------- Zahlenfeld ----------
// Lange Zahlen gliedert das Feld beim Tippen von selbst in Dreierblöcke. Punkte und Leerzeichen des Kindes stören nicht.
export function gliedereEingabe(feld) {
  const roh = feld.value;
  if (!/^[\d\s. ]*$/.test(roh)) return;
  const vor = roh.slice(0, feld.selectionStart ?? roh.length).replace(/\D/g, '').length;
  const ziffern = roh.replace(/\D/g, '');
  const neu = ziffern.length >= 5 ? ziffern.replace(/\B(?=(\d{3})+$)/g, ' ') : ziffern;
  if (neu === roh) return;
  feld.value = neu;
  // Die Schreibmarke bleibt hinter derselben Ziffer.
  let stelle = 0, gezaehlt = 0;
  while (stelle < neu.length && gezaehlt < vor) { if (/\d/.test(neu[stelle])) gezaehlt++; stelle++; }
  try { feld.setSelectionRange(stelle, stelle); } catch { /* Feld ohne Auswahl */ }
}

// ---------- Zeichentafel ----------
// Römische Zahlzeichen mit ihrem Wert, als Spickzettel über der Aufgabe. b: { zeichen: ['I', 'V', 'X'] }
const ROEMISCH_WERT = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
export function zeichentafelBild(b) {
  return h('figure', { class: 'datenbild', role: 'img', 'aria-label': `Römische Zahlzeichen: ${b.zeichen.map((z) => `${z} ist ${ROEMISCH_WERT[z]}`).join(', ')}` }, h('table', { class: 'stellentafel zeichentafel' },
    h('thead', {}, h('tr', {}, b.zeichen.map((z) => h('th', { scope: 'col' }, z)))),
    h('tbody', {}, h('tr', {}, b.zeichen.map((z) => h('td', {}, String(ROEMISCH_WERT[z])))))));
}

// ---------- Vorzeichen (Klasse 7, ADR 0043) ----------
// Die Zifferntastatur am Handy hat kein Minuszeichen. Der Knopf „±“ neben dem Feld wechselt das Vorzeichen der Eingabe.
export const MINUS = '−';
// Den Knopf „±“ gibt es nur in Klasse 7 Kapitel 1 „Rationale Zahlen“ samt Abstechern, auch als Brücke (Version 0.59).
// In allen anderen Kapiteln tippt der Schüler das Minus selbst; getippt zählt es überall.
export const mitVorzeichen = (auf) => String(auf?.lernziel ?? '').startsWith('7.1.');
export const abKlasse7 = (auf) => parseInt(auf?.lernziel, 10) >= 7;
export function vorzeichenKnopf(feld, gesperrt) {
  return h('button', { type: 'button', class: 'schlicht vorzeichen', disabled: gesperrt, 'aria-label': 'Vorzeichen wechseln', title: 'Vorzeichen wechseln',
    onclick: () => { const v = feld.value.trim(); feld.value = /^[-−–]/.test(v) ? v.replace(/^[-−–]\s*/, '') : `${MINUS}${v.replace(/^\+\s*/, '')}`; feld.focus(); } }, '±');
}

export const ZAHLENBILDER = { tafel: tafelBild, schaetzbild: schaetzBild, zeichentafel: zeichentafelBild };
