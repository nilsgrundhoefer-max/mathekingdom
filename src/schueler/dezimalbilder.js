// Klasse 6, Kapitel 4 „Dezimalzahlen“ (ADR 0047): Eingabe periodischer Dezimalzahlen, Zahlenstrahl mit Lupe und schriftliche Division.
// Grilling mit Nils, 2026-11-25: Die Periode wird in einem eigenen Feld eingegeben, die Vorschau zeigt sie mit Überstrich.
// Die Kinder arbeiten am PC; die Bilder sind für die volle Breite gemacht und bleiben am Handy nur lesbar.
import { h, s } from './dom.js';
import { teilePeriode, PERIODE } from './bruch.js';

// ---------- Eingabe: Ziffern vor der Periode und Periode ----------
const zeigePeriode = (vor, periode) => [vor || '…', periode ? h('span', { class: 'periode' }, periode) : ''];
export function periodeEingabe(auf, letzte, gesperrt) {
  const feld = (name, wert, etikett, groesse) => h('input', { name, type: 'text', inputMode: 'decimal', autocomplete: 'off', size: groesse, maxLength: 12, disabled: gesperrt, value: wert ?? '', 'aria-label': etikett,
    oninput: () => { vorschau.replaceChildren(...zeigePeriode(vor.value.trim(), per.value.trim())); } });
  const vor = feld('periode-vor', letzte?.vor, 'Ziffern vor der Periode', 8), per = feld('periode-per', letzte?.periode, 'Periode: die Ziffern, die sich wiederholen', 5);
  const vorschau = h('span', { class: 'periodevorschau', 'aria-live': 'polite' }, ...zeigePeriode(letzte?.vor ?? '', letzte?.periode ?? ''));
  return h('div', { class: 'periodeeingabe' },
    h('label', { class: 'periodefeld' }, h('span', { class: 'klein' }, 'vor der Periode'), vor),
    h('label', { class: 'periodefeld' }, h('span', { class: 'klein' }, 'Periode'), per),
    h('span', { class: 'periodeziel' }, h('span', { class: 'klein' }, 'So sieht deine Zahl aus:'), vorschau));
}
export function liesPeriode(formular) {
  const w = (n) => formular.elements[n]?.value.trim() ?? '';
  return { eingabe: { vor: w('periode-vor'), periode: w('periode-per') }, leer: !w('periode-vor') };
}

// ---------- Zahlenstrahl mit Lupe ----------
// b: { oben, unten } mit Zahlenstrahlen wie B.strahl ({ von, bis, schritt, beschriftung, teiler, pfeil?, punkte? }).
// Der untere Strahl zeigt den Abschnitt von unten.von bis unten.bis vergrößert. Oben ist dieser Abschnitt mit einem Rahmen markiert.
const zahlText = (w, T) => {
  if (T === 1) return String(w);
  const stellen = String(T).length - 1, ganz = Math.floor(w / T), nach = String(w % T).padStart(stellen, '0').replace(/0+$/, '');
  return nach ? `${ganz},${nach}` : String(ganz);
};
export function lupeBild(b) {
  const B = 720, links = 40, rechts = 40, yO = 58, yU = 196, H = 270;
  const svg = s('svg', { class: 'lupe', viewBox: `0 0 ${B} ${H}`, role: 'img',
    'aria-label': `Zahlenstrahl von ${zahlText(b.oben.von, b.oben.teiler)} bis ${zahlText(b.oben.bis, b.oben.teiler)}, darunter vergrößert der Abschnitt von ${zahlText(b.unten.von, b.unten.teiler)} bis ${zahlText(b.unten.bis, b.unten.teiler)}` });
  const strahl = (st, y) => {
    const T = st.teiler ?? 1, x = (w) => links + ((w - st.von) / (st.bis - st.von)) * (B - links - rechts);
    svg.append(s('line', { x1: links - 14, y1: y, x2: B - 16, y2: y, class: 'achse' }), s('path', { d: `M${B - 18} ${y - 7} L${B - 4} ${y} L${B - 18} ${y + 7} Z`, class: 'spitze' }));
    for (let w = st.von; w <= st.bis; w += st.schritt) {
      const gross = (w - st.von) % st.beschriftung === 0;
      svg.append(s('line', { x1: x(w), y1: y - (gross ? 12 : 7), x2: x(w), y2: y + (gross ? 12 : 7), class: `strich${gross ? ' gross' : ''}` }));
      if (gross) svg.append(s('text', { x: x(w), y: y + 32, 'text-anchor': 'middle', class: 'zahl' }, zahlText(w, T)));
    }
    for (const p of st.punkte ?? []) svg.append(s('circle', { cx: x(p), cy: y, r: 6, class: 'punkt' }), s('text', { x: x(p), y: y - 18, 'text-anchor': 'middle', class: 'punktzahl' }, zahlText(p, T)));
    if (st.pfeil != null) svg.append(s('path', { d: `M${x(st.pfeil)} ${y - 16} l-7 -13 h14 Z`, class: 'fragepfeil' }), s('text', { x: x(st.pfeil), y: y - 34, 'text-anchor': 'middle', class: 'frage' }, '?'));
    return x;
  };
  // Oben: der Abschnitt, den die Lupe vergrößert (in der Einheit des oberen Strahls).
  const f = b.unten.teiler / b.oben.teiler, a = b.unten.von / f, e = b.unten.bis / f;
  const xO = strahl(b.oben, yO);
  svg.append(s('rect', { x: xO(a) - 4, y: yO - 20, width: xO(e) - xO(a) + 8, height: 40, rx: 6, class: 'lupenrahmen' }),
    s('path', { d: `M${xO(a) - 4} ${yO + 20} L${links} ${yU - 22} M${xO(e) + 4} ${yO + 20} L${B - rechts} ${yU - 22}`, class: 'lupenlinie' }));
  strahl(b.unten, yU);
  return h('figure', { class: 'datenbild lupenfigur' }, svg);
}

// ---------- Schriftliche Division als Lösungsbild ----------
// d: { dividend, divisor }. Der Divisor ist eine natürliche Zahl, der Dividend auch oder (Klasse 6, Kapitel 5, ADR 0048) eine Dezimalzahl
// als Text („9,6“). Gerechnet wird, bis die Division aufgeht oder ein Rest zum zweiten Mal kommt. Dann wiederholen sich die Ziffern:
// Der Satz darunter nennt die Periode. Mit `vorher` („7,8 : 0,3“) stand die Aufgabe zuerst mit einem Dezimalbruch als Divisor da.
export function divisionSchritte(dividend, divisor, hoechstens = 12) {
  const [g, nachKomma = ''] = String(dividend).split(',');
  const ganz = Math.floor(Number(g) / divisor), stellen = [];
  let rest = Number(g) % divisor;
  const gesehen = new Map();
  // Erst die Ziffern des Dividenden nach dem Komma herunterholen, dann Nullen. Eine Periode gibt es erst bei den Nullen.
  for (let i = 0; stellen.length < hoechstens; i++) {
    if (i >= nachKomma.length) { if (rest === 0 || gesehen.has(rest)) break; gesehen.set(rest, stellen.length); }
    const z = rest * 10 + (i < nachKomma.length ? Number(nachKomma[i]) : 0), ziffer = Math.floor(z / divisor);
    stellen.push({ zahl: z, ziffer, produkt: ziffer * divisor, rest: z % divisor });
    rest = z % divisor;
  }
  const start = rest !== 0 && gesehen.has(rest) ? gesehen.get(rest) : null;
  return { ganz, stellen, start, rest, nachKomma: nachKomma.length };
}
export function divisionBild(d) {
  const { ganz, stellen, start, nachKomma } = divisionSchritte(d.dividend, d.divisor);
  const [kopfZahl, kopfNach = ''] = String(d.dividend).split(','), nach = stellen.length;
  // Spalten: die Ziffern des Dividenden, das Komma, dann eine Spalte je Stelle nach dem Komma.
  const komma = kopfZahl.length, breite = komma + 1 + nach;
  const spalteVon = (ende) => (ende < komma ? ende : ende + 1); // Ende 0 … komma-1 vor dem Komma, danach eine Spalte weiter
  const zeilen = [];
  const zeile = (text, ende, art) => { const ziffern = String(text), cells = Array(breite + 2).fill(''); let sp = spalteVon(ende);
    for (let i = ziffern.length - 1; i >= 0; i--) { if (sp === komma) sp--; cells[sp + 1] = ziffern[i]; sp--; }
    if (art === 'minus') cells[Math.max(0, sp + 1)] = '−';
    zeilen.push({ cells, art: `division-${art}` }); };
  // Die Zeilen heißen division-…, denn .kopf ist schon die Kopfleiste des Dashboards.
  // Kopf: Dividend mit Komma und Nullen, dann „: Divisor = Ergebnis“.
  const per = (i) => start != null && i >= start;
  const ergebnis = [String(ganz), nach ? ',' : '', ...stellen.map((x, i) => (per(i) ? h('span', { class: 'periode' }, String(x.ziffer)) : String(x.ziffer)))];
  const kopf = Array(breite + 2).fill('');
  [...kopfZahl].forEach((c, i) => { kopf[i + 1] = c; });
  if (nach) { kopf[komma + 1] = ','; for (let i = 0; i < nach; i++) kopf[komma + 2 + i] = i < kopfNach.length ? kopfNach[i] : '0'; }
  // Erster Schritt: die Ganzen. Ihr Produkt steht unter dem Dividenden, der Rest mit der nächsten Ziffer daneben.
  zeile(ganz * d.divisor, komma - 1, 'minus');
  stellen.forEach((x, i) => { zeile(x.zahl, komma + i, 'rest'); zeile(x.produkt, komma + i, 'minus'); });
  zeile(stellen.length ? stellen.at(-1).rest : Number(kopfZahl) % d.divisor, komma - 1 + nach, 'ende');
  // Die Kommaspalte ist schmal. In einer Minuszeile läuft der Strich durch sie hindurch, wenn links und rechts Ziffern stehen.
  const kommaZelle = (z, i) => (nach && i === komma + 1 ? { class: `kommaspalte${z.art === 'division-minus' && z.cells[i - 1] && z.cells[i + 1] ? ' durch' : ''}` } : {});
  const tabelle = h('table', { class: 'division', 'aria-label': `Schriftliche Division ${d.dividend} : ${d.divisor}` },
    h('tbody', {},
      h('tr', { class: 'division-kopf' }, kopf.map((c, i) => h('td', nach && i === komma + 1 ? { class: 'kommaspalte' } : {}, c)), h('td', { class: 'rechnung' }, ` : ${d.divisor} = `, ...ergebnis)),
      zeilen.map((z) => h('tr', { class: z.art }, z.cells.map((c, i) => h('td', kommaZelle(z, i), c)), h('td', {})))));
  const satz = start != null
    ? `Der Rest ${stellen[start].zahl / 10} kommt zum zweiten Mal. Ab hier wiederholen sich die Ziffern: Die Periode ist ${stellen.slice(start).map((x) => x.ziffer).join('')}.`
    : 'Der Rest ist 0. Die Division geht auf.';
  const vorher = d.vorher ? `Verschiebe zuerst das Komma in beiden Zahlen gleich weit nach rechts: ${d.vorher} = ${d.dividend} : ${d.divisor}. ` : '';
  const kommaSatz = nachKomma ? 'Wenn du das Komma überschreitest, setzt du im Ergebnis das Komma. ' : '';
  return h('figure', { class: 'divisionsbild' }, tabelle, h('figcaption', {}, vorher + kommaSatz + satz));
}

// Der Lösungstext einer periodischen Dezimalzahl, mit Überstrich gezeichnet (dom.js macht das für jeden Text).
export const periodeLoesung = (auf) => String(auf.loesung);
export const istPeriodisch = (text) => String(text).includes(PERIODE) && Boolean(teilePeriode(text));

export const DEZIMALBILDER = { lupe: lupeBild };
