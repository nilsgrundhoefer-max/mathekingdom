// Kapitel 6 „Größen und Sachaufgaben“ (ADR 0033): Der Prüfer rechnet mit Größen.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Jede Größe wird in ihrer kleinsten Einheit geführt: Cent, Millimeter, Milligramm, Sekunde. Eine Uhrzeit sind die Sekunden seit Mitternacht.

const B_ = 'A-Za-zÄÖÜäöüß';
const EINHEIT = {
  ct: ['geld', 1], Cent: ['geld', 1], '€': ['geld', 100], Euro: ['geld', 100],
  mm: ['laenge', 1], cm: ['laenge', 10], dm: ['laenge', 100], m: ['laenge', 1000], km: ['laenge', 1000000],
  mg: ['gewicht', 1], g: ['gewicht', 1000], kg: ['gewicht', 1000000], t: ['gewicht', 1000000000],
  s: ['zeit', 1], Sekunde: ['zeit', 1], Sekunden: ['zeit', 1], min: ['zeit', 60], Minute: ['zeit', 60], Minuten: ['zeit', 60],
  h: ['zeit', 3600], Stunde: ['zeit', 3600], Stunden: ['zeit', 3600], d: ['zeit', 86400], Tag: ['zeit', 86400], Tage: ['zeit', 86400], Tagen: ['zeit', 86400],
  Woche: ['zeit', 604800], Wochen: ['zeit', 604800],
};
export const einheitArt = (e) => EINHEIT[e]?.[0] ?? null;
export const einheitFaktor = (e) => EINHEIT[e]?.[1] ?? null;
const EINH = Object.keys(EINHEIT).sort((x, y) => y.length - x.length).join('|');
const ZAHLK = '\\d+(?:\\u00a0\\d{3})*(?:,\\d+)?';
const BRUCH = '\\d*[½¼¾]';
const GTEIL = `(?:${BRUCH}|${ZAHLK}) (?:${EINH})(?![${B_}])`;
const GROESSE = `${GTEIL}(?: ${GTEIL})*`;
const UHR = '\\d{1,2}:\\d{2} Uhr|\\d{1,2} Uhr';
const MASSSTAB = '\\d+(?:\\u00a0\\d{3})*:\\d+(?:\\u00a0\\d{3})*';
const TOKEN = `(${UHR})|(${MASSSTAB})|(${GROESSE})|(${ZAHLK})`;
const BRUECHE = { '½': [1, 2], '¼': [1, 4], '¾': [3, 4] };
const ganzeZahl = (t) => Number(String(t).replace(/[\s ]/g, ''));
export const gKey = (v) => `${v.art}:${v.w}`;
export const gGleich = (x, y) => Boolean(x && y) && x.art === y.art && x.w === y.w;
const norm = (s) => String(s).replace(/[\s  ]/g, '');

// Ein Stück einer Größe: „2,5 km“, „¾ h“, „1 250 g“. null, wenn es in der kleinsten Einheit nicht aufgeht.
function gTeil(text) {
  const m = text.match(new RegExp(`^(${BRUCH}|${ZAHLK}) (${EINH})$`));
  if (!m) return null;
  const [art, f] = EINHEIT[m[2]];
  const bruch = m[1].match(/^(\d*)([½¼¾])$/);
  if (bruch) {
    const [z, n] = BRUECHE[bruch[2]];
    if ((f * z) % n !== 0) return null;
    return { art, f, w: Number(bruch[1] || 0) * f + (f * z) / n, glatt: false };
  }
  const [vor, nach = ''] = m[1].split(',');
  const z = ganzeZahl(vor + nach), n = 10 ** nach.length;
  if ((z * f) % n !== 0) return null;
  return { art, f, w: (z * f) / n, glatt: nach === '' };
}
// Eine ganze Größe, auch gemischt: „3 € 50 ct“, „2 h 15 min“. Gemischt steht die größere Einheit vorn, und der hintere Teil bleibt unter der Umrechnungszahl.
function gLiteral(text) {
  const teile = [...text.matchAll(new RegExp(GTEIL, 'g'))].map((m) => gTeil(m[0]));
  if (!teile.length || teile.some((t) => !t)) return null;
  for (let i = 1; i < teile.length; i++) {
    if (teile[i].art !== teile[0].art || teile[i].f >= teile[i - 1].f || teile[i].w >= teile[i - 1].f) return null;
  }
  if (teile.length > 1 && teile.some((t) => !t.glatt)) return null;
  return { art: teile[0].art, w: teile.reduce((s, t) => s + t.w, 0) };
}
function gUhr(text) {
  const m = text.match(/^(\d{1,2})(?::(\d{2}))? Uhr$/) ?? text.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const [st, mi] = [Number(m[1]), Number(m[2] ?? 0)];
  if (st > 24 || mi > 59 || (st === 24 && mi > 0)) return null;
  return { art: 'uhr', w: ((st * 60 + mi) * 60) % 86400 };
}
const zahlWert = (text) => (text.includes(',') ? null : { art: 'zahl', w: ganzeZahl(text) });

// Rechnet einen Ausdruck mit Größen aus: „3 · 250 g“, „14:35 Uhr + 50 min“, „6 m : 50 cm“. null, wenn er nicht aufgeht oder die Größen nicht zusammenpassen.
const GROESSEN = ['geld', 'laenge', 'gewicht', 'zeit'];
function strichRechnung(x, y, plus) {
  if (!x || !y) return null;
  if (x.art === 'uhr' && y.art === 'zeit') return { art: 'uhr', w: (((plus ? x.w + y.w : x.w - y.w) % 86400) + 86400) % 86400 };
  if (x.art === 'uhr' && y.art === 'uhr' && !plus) return { art: 'zeit', w: (x.w - y.w + 86400) % 86400 };
  if (x.art !== y.art || x.art === 'uhr') return null;
  const w = plus ? x.w + y.w : x.w - y.w;
  return w < 0 ? null : { art: x.art, w };
}
function punktRechnung(x, y, mal) {
  if (!x || !y || x.art === 'uhr' || y.art === 'uhr') return null;
  if (mal) {
    if (x.art !== 'zahl' && y.art !== 'zahl') return null;
    return { art: x.art === 'zahl' ? y.art : x.art, w: x.w * y.w };
  }
  if (y.w === 0 || x.w % y.w !== 0) return null;
  if (y.art === 'zahl') return { art: x.art, w: x.w / y.w };
  return x.art === y.art ? { art: 'zahl', w: x.w / y.w } : null;
}
export function gRechne(ausdruck) {
  const t = String(ausdruck).trim(), marken = [];
  const muster = new RegExp(`\\s*(?:${TOKEN}|([+−·:()]))`, 'y');
  let p = 0;
  while (p < t.length) {
    muster.lastIndex = p;
    const m = muster.exec(t);
    if (!m) return null;
    p = muster.lastIndex;
    if (m[5]) marken.push(m[5]);
    else if (m[1]) marken.push(gUhr(m[1]));
    else if (m[2]) return null;
    else if (m[3]) marken.push(gLiteral(m[3]));
    else marken.push(zahlWert(m[4]));
    if (marken.at(-1) === null) return null;
  }
  let i = 0;
  const faktor = () => {
    if (marken[i] === '(') { i++; const w = strich(); if (marken[i++] !== ')') return null; return w; }
    return typeof marken[i] === 'object' ? marken[i++] ?? null : null;
  };
  const punkt = () => {
    let w = faktor();
    while (marken[i] === '·' || marken[i] === ':') { const z = marken[i++]; w = punktRechnung(w, faktor(), z === '·'); }
    return w;
  };
  function strich() {
    let w = punkt();
    while (marken[i] === '+' || marken[i] === '−') { const z = marken[i++]; w = strichRechnung(w, punkt(), z === '+'); }
    return w;
  }
  const w = strich();
  return i === marken.length ? w : null;
}

// Alle Größen, Uhrzeiten und Zahlen in einem Text. Ein Maßstab „1:25 000“ zählt als die Zahl 25 000.
// Was sich nicht lesen lässt (2,5 ohne Einheit, 3 m 250 cm), kommt als { art: 'fehler' } zurück.
export function gAtome(text) {
  const liste = [];
  for (const m of String(text ?? '').matchAll(new RegExp(TOKEN, 'g'))) {
    if (m[1]) liste.push(gUhr(m[1]) ?? { art: 'fehler', roh: m[0] });
    else if (m[2]) for (const x of m[2].split(':').map(ganzeZahl)) { if (x !== 1) liste.push({ art: 'zahl', w: x }); }
    else if (m[3]) liste.push(gLiteral(m[3]) ?? { art: 'fehler', roh: m[0] });
    else liste.push(zahlWert(m[4]) ?? { art: 'fehler', roh: m[0] });
  }
  return liste;
}
// Eine Zelle einer Tabelle: eine Größe, eine Zahl oder eine Uhrzeit ohne das Wort „Uhr“ (Fahrplan).
export const gZelle = (text) => gUhr(String(text).trim()) ?? gRechne(text);

// Alle Gleichungen mit Größen in einem Text: „3 m = 300 cm“, „2 € 50 ct + 1,20 € = 3,70 €“, „14:35 Uhr + 50 min = 15:25 Uhr“.
const TERM = `\\(*(?:${UHR}|${GROESSE}|${ZAHLK})\\)*`;
const SEITE = `${TERM}(?: [+−·:] ${TERM})*`;
const GLEICHUNG = new RegExp(`(?<![+−·=≈] )(?<! : )(?<![\\d▢_(\\[${B_}\\u00a0,:½¼¾])(${SEITE})((?: = ${SEITE})+)(?! ?[+−·=▢_\\d]| : )`, 'g');
const MIT_EINHEIT = new RegExp(`(?:${UHR})|(?:${GTEIL})`);
export function gGleichungen(text) {
  const t = String(text ?? '');
  return [...t.matchAll(GLEICHUNG)].filter((m) => MIT_EINHEIT.test(m[0])).map((m) => {
    const seiten = [m[1], ...m[2].split(' = ').slice(1)], werte = seiten.map(gRechne);
    return { ganz: m[0], seiten, rest: null, groesse: true, stelle: m.index, danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1), ok: werte.every((w) => w && gGleich(w, werte[0])) };
  });
}

// ---------- Stützgrößen ----------
// Eigene Liste des Prüfers: In welchem Bereich liegt die Größe eines Gegenstands aus dem Alltag?
const ber = (von, bis) => [gRechne(von), gRechne(bis)];
export const STUETZ = {
  'Fingerbreite': ber('8 mm', '2 cm'), 'Handbreite': ber('7 cm', '12 cm'), 'Handspanne': ber('13 cm', '22 cm'), 'Bleistift': ber('12 cm', '20 cm'), 'Schulheft': ber('28 cm', '31 cm'),
  'Schritt': ber('50 cm', '1 m'), 'Tür': ber('190 cm', '220 cm'), 'Kind': ber('130 cm', '160 cm'), 'Zimmer': ber('220 cm', '3 m'), 'Auto': ber('350 cm', '5 m'), 'Bus': ber('10 m', '14 m'),
  'Stockwerk': ber('250 cm', '350 cm'), 'Fußballfeld': ber('90 m', '120 m'), 'Münze': ber('1 mm', '3 mm'), 'Schulweg': ber('500 m', '5 km'), 'Tisch': ber('70 cm', '80 cm'),
  'Büroklammer': ber('500 mg', '2 g'), 'Brief': ber('10 g', '30 g'), 'Ei': ber('50 g', '70 g'), 'Tafel Schokolade': ber('100 g', '100 g'), 'Apfel': ber('120 g', '250 g'), 'Packung Butter': ber('250 g', '250 g'),
  'Liter Milch': ber('1 kg', '1 kg'), 'Packung Mehl': ber('1 kg', '1 kg'), 'Schulranzen': ber('3 kg', '7 kg'), 'Fahrrad': ber('10 kg', '20 kg'), 'Kind (Gewicht)': ber('30 kg', '50 kg'),
  'Auto (Gewicht)': ber('1 t', '2 t'), 'Elefant': ber('3 t', '6 t'), 'Pferd': ber('400 kg', '800 kg'), 'Feder': ber('1 mg', '100 mg'),
  'Händeklatschen': ber('1 s', '1 s'), 'Zähneputzen': ber('2 min', '3 min'), 'Schulstunde': ber('45 min', '45 min'), 'große Pause': ber('15 min', '25 min'), 'Fußballspiel': ber('90 min', '90 min'),
  'Nachtschlaf': ber('8 h', '11 h'), 'Schultag': ber('5 h', '7 h'), 'Sommerferien': ber('6 Wochen', '6 Wochen'), 'Spielfilm': ber('80 min', '2 h'),
  'Brötchen': ber('30 ct', '90 ct'), 'Kugel Eis': ber('1 €', '250 ct'), 'Kinokarte': ber('6 €', '12 €'), 'Fahrrad (Preis)': ber('150 €', '900 €'), 'Schulheft (Preis)': ber('50 ct', '2 €'), 'Brot': ber('2 €', '5 €'),
};
// „Auto“ hat eine Länge, ein Gewicht und einen Preis: Es zählt der Eintrag, der zur Größenart passt.
const stuetzVon = (ding, art) => [ding, `${ding} (Gewicht)`, `${ding} (Preis)`].map((k) => STUETZ[k]).find((b) => b && (!art || b[0].art === art)) ?? null;
const imBereich = (ding, v) => { if (!v || ![ding, `${ding} (Gewicht)`, `${ding} (Preis)`].some((k) => STUETZ[k])) return undefined; const b = stuetzVon(ding, v.art); return b ? v.w >= b[0].w && v.w <= b[1].w : false; };
const ART_NAME = { geld: 'Geld', laenge: 'Länge', gewicht: 'Gewicht', zeit: 'Zeit' };

// ---------- Bilder ----------
export const GROESSENBILDER = ['geld', 'uhr', 'waage', 'einheitentafel', 'vergleichsbild', 'karte', 'grundriss', 'zeitleiste'];
const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;
const STUECKE = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
const GEWICHTSSTUECKE = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
const VERGLEICHSFORMEN = ['kind', 'tuer', 'auto', 'turm', 'baum', 'haus', 'mast', 'leuchtturm', 'bus', 'lkw', 'schiff', 'bruecke'];
const ORTSZEICHEN = ['burg', 'dorf', 'muehle', 'hafen', 'wald', 'turm', 'bruecke'];
// Wert einer Zeile der Einheitentafel. Jede Gruppe ist eine Einheit, ihre Spalten sind deren Einer, Zehner und Hunderter.
export function tafelWert(gruppen, ziffern) {
  let i = 0, w = 0, art = null;
  for (const g of gruppen) {
    const e = EINHEIT[g.name];
    if (!e || (art && e[0] !== art) || !ganz(g.spalten, 1, 3)) return null;
    art = e[0];
    for (let k = g.spalten - 1; k >= 0; k--) { const z = ziffern[i++]; if (z != null && !ganz(z, 0, 9)) return null; w += (z ?? 0) * e[1] * 10 ** k; }
  }
  return i === ziffern.length ? { art, w } : null;
}
// Die Spalten der Gruppen müssen lückenlos aneinander anschließen (km mit 1 Spalte, m mit 3 Spalten).
const tafelLueckenlos = (gruppen) => gruppen.every((g, i) => i === gruppen.length - 1 || EINHEIT[g.name]?.[1] === EINHEIT[gruppen[i + 1].name]?.[1] * 10 ** gruppen[i + 1].spalten);
// Mängel im Aufbau eines Bildes.
export function bildMaengel(b, niveau) {
  const m = [];
  switch (b.art) {
    case 'geld':
      if (!Array.isArray(b.stuecke) || !ganz(b.stuecke.length, 1, 14) || b.stuecke.some((x) => !STUECKE.includes(x))) m.push('Münzen oder Scheine gibt es nicht');
      break;
    case 'uhr':
      if (niveau !== 'F') m.push('die Zeigeruhr gibt es nur auf F');
      if (!Array.isArray(b.uhren) || !ganz(b.uhren.length, 1, 2) || b.uhren.some((u) => !ganz(u.h, 0, 23) || !ganz(u.min, 0, 55) || u.min % 5 !== 0)) m.push('Uhrzeit passt nicht (volle fünf Minuten)');
      break;
    case 'waage':
      if (!b.links || !Array.isArray(b.gewichte) || !ganz(b.gewichte.length, 1, 4) || [...b.gewichte, ...(b.linksDazu ?? [])].some((x) => !GEWICHTSSTUECKE.includes(x))) m.push('Gewichtsstücke gibt es nicht');
      else if (b.gewichte.reduce((s, x) => s + x, 0) <= (b.linksDazu ?? []).reduce((s, x) => s + x, 0)) m.push('links liegt schon mehr als rechts');
      break;
    case 'einheitentafel': {
      const zeilen = [b.werte, ...(b.weitere ?? [])];
      if (!Array.isArray(b.gruppen) || !tafelLueckenlos(b.gruppen) || zeilen.some((z) => !Array.isArray(z) || tafelWert(b.gruppen, z.map((x) => (istFrage(x) ? x.wert : x))) == null)) m.push('Spalten oder Ziffern passen nicht');
      if (b.spalten?.length !== b.werte?.length) m.push('Kopfzeile passt nicht zu den Spalten');
      break;
    }
    case 'vergleichsbild':
      if (!VERGLEICHSFORMEN.includes(b.klein) || !VERGLEICHSFORMEN.includes(b.gross) || b.klein === b.gross || !['hoch', 'lang'].includes(b.richtung)) m.push('Formen fehlen');
      if (!ganz(b.zehntel, 20, 120)) m.push('das Große ist 2-mal bis 12-mal so groß wie das Kleine');
      if (niveau !== 'E' && b.zehntel % 5 !== 0) m.push('halbe Vergleichsgrößen sind das Feinste');
      if (b.hilfslinien && !['F', 'G'].includes(niveau)) m.push('Hilfslinien gibt es nur auf F und G');
      if (b.hilfslinien && b.zehntel % 10 !== 0) m.push('mit Hilfslinien passt die Vergleichsgröße ganz hinein');
      break;
    case 'karte':
      if (!ganz(b.lang, 50, 120) || b.lang % 10 !== 0) m.push('Lineal ist 5 cm bis 12 cm lang');
      if (!Array.isArray(b.orte) || !ganz(b.orte.length, 2, 4) || b.orte.some((o, i) => !o.n || !ganz(o.mm, 0, b.lang) || (i > 0 && o.mm < b.orte[i - 1].mm + 15) || (o.zeichen && !ORTSZEICHEN.includes(o.zeichen)))) m.push('Orte liegen nicht am Lineal oder zu dicht');
      if (new Set((b.orte ?? []).map((o) => o.n)).size !== (b.orte ?? []).length) m.push('Ort doppelt');
      // falls through
    case 'grundriss': {
      if (b.art === 'grundriss' && (!b.name || !ganz(b.b, 15, 120) || !ganz(b.h, 10, 90))) m.push('Maße im Plan passen nicht');
      if (b.massstab != null && !ganz(b.massstab, 2, 1000000)) m.push('Maßstab passt nicht');
      if (b.leiste) {
        const w = gRechne(b.leiste.text);
        if (!ganz(b.leiste.mm, 10, 50) || b.leiste.mm % 10 !== 0 || !w || w.art !== 'laenge') m.push('Maßstabsleiste passt nicht');
        else if (b.massstab != null && w.w !== b.leiste.mm * b.massstab) m.push('Maßstabsleiste und Maßstab widersprechen sich');
      }
      if (b.massstab == null && !b.leiste && b.art === 'grundriss') m.push('Grundriss ohne Maßstab');
      break;
    }
    case 'zeitleiste': {
      const p = (b.punkte ?? []).map((x) => gUhr(String(istFrage(x) ? x.wert : x))), sp = (b.spruenge ?? []).map((x) => gRechne(String(istFrage(x) ? x.wert : x)));
      if (!ganz(p.length, 2, 4) || sp.length !== p.length - 1 || p.some((x) => !x) || sp.some((x) => !x || x.art !== 'zeit')) { m.push('Zeitpunkte oder Zeitspannen lassen sich nicht lesen'); break; }
      sp.forEach((x, i) => { if (!gGleich(strichRechnung(p[i], x, true), p[i + 1])) m.push(`Zeitspanne ${i + 1} führt nicht zum nächsten Zeitpunkt`); });
      if ([...(b.punkte ?? []), ...(b.spruenge ?? [])].filter(istFrage).length !== 1) m.push('genau ein Fragezeichen');
      break;
    }
    default: m.push('unbekannte Bildart');
  }
  return m;
}
// Was ein Bild zeigt: Größen und Zahlen, die das Kind ablesen kann (ohne das Gesuchte).
export function bildGroessen(b) {
  if (!b) return [];
  const G = (art, w) => ({ art, w }), Z = (w) => G('zahl', w), summe = (l) => l.reduce((s, x) => s + x, 0);
  switch (b.art) {
    case 'geld': { const sorten = [...new Set(b.stuecke)];
      return [...b.stuecke.map((x) => G('geld', x)), G('geld', summe(b.stuecke)), Z(b.stuecke.length), ...sorten.flatMap((x) => { const n = b.stuecke.filter((y) => y === x).length; return [Z(n), G('geld', n * x)]; })]; }
    case 'uhr': return b.uhren.map((u) => G('uhr', (u.h * 60 + u.min) * 60));
    case 'waage': { const r = summe(b.gewichte), l = summe(b.linksDazu ?? []);
      return [...b.gewichte, ...(b.linksDazu ?? [])].map((x) => G('gewicht', x * 1000)).concat([G('gewicht', r * 1000), G('gewicht', (r - l) * 1000), Z(b.gewichte.length)]); }
    case 'einheitentafel': return [b.werte, ...(b.weitere ?? [])].filter((z) => !z.some(istFrage)).map((z) => tafelWert(b.gruppen, z)).filter(Boolean);
    case 'karte': { const o = b.orte, liste = [];
      for (let i = 0; i < o.length; i++) { liste.push(G('laenge', o[i].mm)); for (let k = i + 1; k < o.length; k++) liste.push(G('laenge', o[k].mm - o[i].mm)); }
      return [...liste, ...massstabGroessen(b)]; }
    case 'grundriss': return [G('laenge', b.b), G('laenge', b.h), ...massstabGroessen(b)];
    case 'lineal': return [G('laenge', b.bis - b.von), G('laenge', b.von), G('laenge', b.bis)];
    case 'zeitleiste': return [...b.punkte.filter((x) => !istFrage(x)).map((x) => gUhr(String(x))), ...b.spruenge.filter((x) => !istFrage(x)).map((x) => gRechne(String(x)))].filter(Boolean);
    default: return [];
  }
}
const massstabGroessen = (b) => [...(b.massstab != null ? [{ art: 'zahl', w: b.massstab }] : []), ...(b.leiste ? [{ art: 'laenge', w: b.leiste.mm }, gRechne(b.leiste.text)].filter(Boolean) : [])];

// ---------- Sprache ----------
// Regeln aus dem Grilling mit Nils (2026-11-21): Wann Komma, Brüche und seltene Einheiten vorkommen dürfen.
export function sprachMaengel(niveau, texte) {
  const m = [], stufe = ['F', 'G', 'M', 'E'].indexOf(niveau), alle = texte.join('\n');
  if (stufe === 0 && /\d,\d/.test(alle)) m.push('auf F steht keine Kommazahl (gemischte Schreibweise: 3 € 50 ct)');
  if (stufe === 1 && /\d,\d+(?! €)/.test(alle.replace(/\d,\d\d €/g, ''))) m.push('auf G steht das Komma nur bei Geld');
  if (/\d,\d(?:\d\d+)? €|\d,\d €/.test(alle)) m.push('Geld hat immer zwei Stellen nach dem Komma');
  if (stufe < 2 && /\d mg(?![a-zäöü])|[½¼¾]/.test(alle)) m.push('Milligramm und die Brüche ½, ¼, ¾ gibt es erst ab M');
  if (stufe < 3 && /\d,\d+ (?:h|min|d|s)(?![a-zäöü])/.test(alle)) m.push('Kommazahlen bei der Zeit gibt es nur auf E');
  if (stufe === 0 && /\d d(?![a-zäöü])/.test(alle)) m.push('die Einheit d gibt es erst ab G (auf F: Tag)');
  if (/\d (?:l|ml|Liter)(?![a-zäöü])|\bMasse\b/.test(alle)) m.push('Liter als Einheit und das Wort Masse gehören nicht in die Aufgaben von Kapitel 6');
  if (/\d(?:€|ct|mm|cm|dm|km|kg|mg|min)(?![a-zäöü])|\d[mgh](?![a-zäöü\d])/.test(alle)) m.push('zwischen Zahl und Einheit steht ein Leerzeichen');
  return m;
}

// ---------- Nachweis ----------
const OHNE6 = /\d+ Schritten|[Ww]elche \d+ |Weg \d+|\d+[a-d](?![a-zäöü])|\d+er-|(?:Gleis|Linie|Bus|Zug|Klasse|Bahnsteig|Tor|Nummer|Nr\.) \d+|(?<![\d ,:])1 (?=[A-ZÄÖÜ])(?!Uhr)/g;
const textAtome = (t) => gAtome(String(t ?? '').replace(OHNE6, ' '));
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Richtig|Ja)(?![a-zäöü])(?!, aber| nur)/.test(text) ? true : null);
const AUF = /kleinsten|kürzesten|leichtesten|billigsten|frühesten|günstigsten/, AB = /größten|längsten|schwersten|teuersten|spätesten/;
const sollWert = (zahl, einheit) => (EINHEIT[einheit] ? { art: EINHEIT[einheit][0], w: zahl * EINHEIT[einheit][1] } : { art: 'zahl', w: zahl });

// Prüft Nachweis und Lösung einer Aufgabe aus Kapitel 6. Liefert die Liste der Mängel.
// `lueckenOhneGleichung`: Lücken, deren Lösung in keiner Gleichung des Textes steckt (bestimmt der Formatprüfer).
export function pruefeGroessenNachweis(a) {
  const m = [], stufe = ['F', 'G', 'M', 'E'].indexOf(a.niveau);
  const frei = ['auswahl', 'zuordnen'].includes(a.format);
  const optWerte = (a.optionen ?? []).map((o) => gRechne(o.text.replace(/^(ungefähr|etwa|rund) /, '')));
  const paarWerte = (a.paare ?? []).map((p) => [gRechne(p.links), gRechne(p.rechts)]);
  // Zuordnen ohne Nachweis: Beide Seiten sind Größen. Dann müssen sie gleich sein, und kein zweites Paar hat denselben Wert.
  const paarePruefen = () => {
    for (const [i, [l, r]] of paarWerte.entries()) if (!gGleich(l, r)) m.push(`Paar „${a.paare[i].links}“ und „${a.paare[i].rechts}“ passt nicht zusammen`);
    if (new Set(paarWerte.map(([l]) => gKey(l))).size !== paarWerte.length) m.push('zwei Paare haben denselben Wert');
  };
  if (!a.nachweis) {
    if (!frei) m.push('Nachweis fehlt');
    else if (a.format === 'auswahl' && optWerte.every(Boolean)) m.push('die Antworten sind Größen oder Zahlen: Nachweis fehlt');
    else if (a.format === 'auswahl' && a.optionen.some((o) => polaritaet(o.text) !== null)) m.push('Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
    else if (a.format === 'zuordnen' && paarWerte.length && paarWerte.every(([l, r]) => l && r)) paarePruefen();
    return m;
  }
  if (!Array.isArray(a.nachweis) || a.nachweis.length === 0) return ['Nachweis ist leer'];

  // Bekannt ist, was die Aufgabe zeigt: Text, Teilfragen, Tabellen, Bild; beim Zuordnen und Ordnen auch die Karten.
  const bekannt = new Set(['zahl:10', 'zahl:100', 'zahl:1000', ...(stufe >= 2 ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => `zahl:${x}`) : [])]);
  const gezeigt = new Set();
  const zeige = (v) => { if (v && v.art !== 'fehler') { bekannt.add(gKey(v)); gezeigt.add(gKey(v)); } };
  const eingesetzt = a.format === 'luecken' ? a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken?.[n]?.loesung ?? '?') : a.text;
  const fragen = [a.text, ...(a.teile ?? []).map((t) => t.text)];
  for (const t of [eingesetzt, ...fragen.slice(1), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts]), ...(a.karten ?? [])]) textAtome(t).forEach(zeige);
  for (const zeile of [a.daten?.kopf ?? [], ...(a.daten?.zeilen ?? [])]) for (const c of zeile) { zeige(gZelle(String(c))); textAtome(String(c)).forEach(zeige); }
  const imBild = bildGroessen(a.bild);
  imBild.forEach(zeige);
  if (a.tabelle) {
    const t = a.tabelle, wert = (c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c);
    if (t.art === 'einheitentafel') t.zeilen.forEach((z) => zeige(tafelWert(t.gruppen, z.map((c) => (wert(c) === '' ? null : Number(wert(c)))))));
    else for (const z of t.zeilen) z.forEach((c, k) => zeige(gRechne(`${wert(c)} ${t.kopf[k]}`) ?? gZelle(String(wert(c)))));
  }

  const benutzt = new Set(), zeilen = [], bindungen = [];
  let ende = null;
  const nutze = (v) => { if (v) { benutzt.add(gKey(v)); bekannt.add(gKey(v)); } };
  const rechnung = (text, teil) => {
    const naehe = text.includes(' ≈ ');
    const seiten = text.split(naehe ? ' ≈ ' : ' = '), werte = seiten.map(gRechne);
    if (seiten.length < 2 || werte.some((w) => !w)) { m.push(`Nachweis: „${text}“ ist keine Rechnung mit Größen`); return; }
    if (naehe) { if (seiten.length !== 2 || werte[0].art !== werte[1].art || Math.abs(werte[0].w - werte[1].w) > werte[0].w * 0.15) m.push(`Nachweis: „${text}“ ist kein Überschlag`); }
    else if (werte.some((w) => !gGleich(w, werte[0]))) m.push(`Nachweis: „${text}“ stimmt nicht`);
    for (const v of gAtome(seiten[0])) if (!bekannt.has(gKey(v))) m.push(`Nachweis: ${gKey(v)} kommt in der Aufgabe nicht vor (${text})`);
    for (const s of seiten) gAtome(s).forEach(nutze);
    werte.forEach(nutze);
    ende = werte.at(-1);
    zeilen.push({ wert: ende, teil, erste: norm(seiten[0]), alle: werte });
  };
  for (const n of a.nachweis) {
    if (typeof n === 'string') { rechnung(n, null); continue; }
    if (n === null || typeof n !== 'object') { m.push('Nachweis: Eintrag lässt sich nicht lesen'); continue; }
    if (n.art == null) {
      // Hilfszahl oder Hilfsgröße mit Grund: eine überflüssige Angabe oder Wissen aus dem Alltag (Eine Woche hat 7 Tage).
      const v = n.groesse != null ? gRechne(n.groesse) : typeof n.zahl === 'number' ? { art: 'zahl', w: n.zahl } : null;
      if (!v || !n.grund) m.push('Nachweis: Hilfszahl ohne Zahl oder Grund');
      else { nutze(v); bindungen.push({ art: 'hilfe', wert: v, ueberfluessig: /überflüssig/.test(n.grund) }); }
      continue;
    }
    switch (n.art) {
      case 'groesse': rechnung(String(n.rechnung), n.teil ?? null); break;
      case 'bildgroesse': {
        const v = gRechne(n.groesse);
        if (!v || !imBild.some((x) => gGleich(x, v))) m.push(`Nachweis: ${n.groesse} zeigt das Bild nicht`);
        nutze(v); ende = v; zeilen.push({ wert: v, teil: n.teil ?? null, erste: null, alle: [v] });
        break;
      }
      case 'vergleichsbild': {
        if (a.bild?.art !== 'vergleichsbild' || a.bild.zehntel !== n.zehntel) { m.push('Nachweis: Vergleichsbild passt nicht'); break; }
        nutze({ art: 'zahl', w: n.zehntel }); nutze({ art: 'zahl', w: 10 });
        if (n.mal != null) {
          if (n.mal * 10 !== n.zehntel) { m.push(`Nachweis: Die Vergleichsgröße passt nicht ${n.mal}-mal hinein`); break; }
          const v = { art: 'zahl', w: n.mal };
          nutze(v); ende = v; zeilen.push({ wert: v, teil: n.teil ?? null, erste: null, alle: [v] });
        }
        break;
      }
      case 'einheitentafel': { const v = gRechne(n.groesse); if (!v) m.push('Nachweis: Größe der Einheitentafel lässt sich nicht lesen'); nutze(v); bindungen.push(n); break; }
      case 'groessenart': case 'gleichwert':
      case 'stuetzgroesse': case 'extrem': case 'rechnungswahl': case 'gleichungswahl': case 'massstab': case 'vergleich': case 'urteil': case 'ordnung': case 'umwandeln':
        for (const k of ['groesse', 'plan', 'wirklich', 'links', 'rechts', 'behauptet']) if (typeof n[k] === 'string') nutze(gRechne(n[k]));
        if (typeof n.zahl === 'number') nutze({ art: 'zahl', w: n.zahl });
        bindungen.push(n);
        break;
      default: m.push(`Nachweis: unbekannte Art ${n.art}`);
    }
  }
  const bindung = (art) => bindungen.find((b) => b.art === art);
  const hilfen = bindungen.filter((b) => b.art === 'hilfe');
  if (ende && hilfen.some((h) => gGleich(h.wert, ende)) && !frei) m.push('Nachweis: Die Lösung darf keine Hilfszahl sein');

  // Jede Größe und jede Zahl aus dem Text gehört zur Rechnung, steht im Bild oder ist als überflüssig genannt.
  const imMaterial = new Set([...imBild.map(gKey)]);
  for (const t of fragen) for (const v of textAtome(t)) {
    if (v.art === 'fehler') m.push(`„${v.roh}“ lässt sich nicht als Größe lesen`);
    else if (!benutzt.has(gKey(v)) && !imMaterial.has(gKey(v))) m.push(`${gKey(v)} aus dem Text kommt im Nachweis nicht vor`);
  }

  // ----- Lösungen -----
  const ergebnisse = zeilen.flatMap((z) => z.alle.slice(z.erste === null ? 0 : 1));
  const istErgebnis = (v) => ergebnisse.some((x) => gGleich(x, v));
  const endeIst = (v, was) => { if (!ende) m.push(`${was}: Der Nachweis endet mit keiner Rechnung`); else if (!gGleich(ende, v)) m.push(`${was} ${gKey(v)} ist nicht das Ergebnis des Nachweises (${gKey(ende)})`); };
  switch (a.format) {
    case 'zahl': case 'schaetzen': endeIst(sollWert(a.loesung, a.einheit), 'Lösung'); break;
    case 'groesse': endeIst({ art: a.groesse, w: a.loesung }, 'Lösung'); break;
    case 'sachaufgabe': {
      (a.teile ?? []).forEach((t, i) => {
        if (t.optionen) return;
        const z = zeilen.filter((x) => x.teil === i + 1);
        if (z.length !== 1) m.push(`Teil ${i + 1}: genau eine Rechnung im Nachweis gehört dazu (gefunden: ${z.length})`);
        else if (!gGleich(z[0].wert, sollWert(t.loesung, t.einheit))) m.push(`Teil ${i + 1}: Lösung ${t.loesung} ist nicht das Ergebnis der Rechnung`);
      });
      const ueberfluessig = new Set(hilfen.filter((h) => h.ueberfluessig).map((h) => gKey(h.wert)));
      const gerechnet = new Set(zeilen.flatMap((z) => z.alle.map(gKey)));
      for (const k of ueberfluessig) gerechnet.delete(k);
      const ersteSeiten = new Set(zeilen.map((z) => z.erste).filter(Boolean));
      (a.teile ?? []).forEach((t, i) => {
        if (!t.optionen) return;
        const was = `Teil ${i + 1}`;
        if (t.art === 'angaben') {
          // Wichtige Angaben antippen: wichtig ist, womit gerechnet wird.
          for (const o of t.optionen) { const v = gRechne(o.text); if (!v) m.push(`${was}: „${o.text}“ ist keine Angabe`); else if ((benutzt.has(gKey(v)) && !ueberfluessig.has(gKey(v))) !== o.richtig) m.push(`${was}: „${o.text}“ ist falsch eingestuft`);
            else if (!gezeigt.has(gKey(v))) m.push(`${was}: „${o.text}“ steht nicht in der Aufgabe`); }
        } else if (t.art === 'rechnung') {
          for (const o of t.optionen) if (ersteSeiten.has(norm(o.text)) !== o.richtig) m.push(`${was}: Rechnung „${o.text}“ ist falsch eingestuft`);
        } else if (t.art === 'antwort') {
          for (const o of t.optionen.filter((x) => x.richtig)) if (!ende || !gAtome(o.text).some((v) => gGleich(v, ende))) m.push(`${was}: Der Antwortsatz nennt das Ergebnis nicht`);
        } else if (t.art === 'fehlt') {
          // Welche Angabe fehlt? Das lässt sich nicht nachrechnen, die Antworten sind gegengelesen.
        } else m.push(`${was}: unbekannte Art der Auswahl`);
      });
      break;
    }
    case 'luecken': {
      // Eine Lücke ohne eigene Gleichung („Es sind ▢ € ▢ ct.“): Die Größe, in der sie steht, muss ein Ergebnis des Nachweises sein.
      const setze = (anders) => a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => (n === anders ? a.luecken[n].loesung + 1 : a.luecken?.[n]?.loesung ?? '?'));
      const richtig = textAtome(setze(null));
      for (const n of a.lueckenOhneGleichung ?? []) {
        const anders = textAtome(setze(n)), i = richtig.findIndex((v, k) => !anders[k] || gKey(anders[k]) !== gKey(v));
        if (i < 0 || richtig.length !== anders.length || richtig[i].art === 'fehler') m.push(`Lücke ${n}: steht in keiner lesbaren Größe`);
        else if (!istErgebnis(richtig[i])) m.push(`Lücke ${n}: ${gKey(richtig[i])} ist kein Ergebnis im Nachweis`);
      }
      break;
    }
    case 'ordnen': {
      const b = bindung('ordnung'), werte = (a.loesung ?? []).map(gRechne);
      if (!b) { m.push('Ordnen: Nachweis der Reihenfolge fehlt'); break; }
      if (werte.some((w) => !w || w.art !== werte[0]?.art)) { m.push('Ordnen: eine Karte lässt sich nicht als Größe lesen'); break; }
      for (let i = 1; i < werte.length; i++) if (b.richtung === 'auf' ? !(werte[i - 1].w < werte[i].w) : !(werte[i - 1].w > werte[i].w)) m.push(`Ordnen: Reihenfolge stimmt nicht bei ${a.loesung[i - 1]} und ${a.loesung[i]}`);
      if ((AUF.test(a.text) ? 'auf' : AB.test(a.text) ? 'ab' : null) !== b.richtung) m.push('Ordnen: Der Text verlangt eine andere Richtung');
      break;
    }
    case 'zuordnen': {
      const b = bindung('stuetzgroesse');
      if (b) {
        for (const [i, p] of a.paare.entries()) {
          const v = paarWerte[i][1];
          if (imBereich(p.links, v) !== true) m.push(`Zuordnen: ${p.rechts} passt nicht zu ${p.links}`);
          for (const q of a.paare) if (q !== p && imBereich(q.links, v) !== false) m.push(`Zuordnen: ${p.rechts} passt auch zu ${q.links}`);
        }
      } else if (paarWerte.every(([l, r]) => l && r)) paarePruefen();
      break;
    }
    case 'auswahl': {
      const stufeEin = (trifft) => { let richtige = 0;
        for (const [i, o] of a.optionen.entries()) { const w = trifft(o.text, optWerte[i]); if (w === undefined) { m.push(`Antwort „${o.text}“ lässt sich nicht prüfen`); return; } if (w !== o.richtig) m.push(`Antwort „${o.text}“ ist falsch eingestuft`); if (w) richtige++; }
        if (!richtige) m.push('keine Antwort trifft zu'); };
      const imText = (v) => v && fragen.some((t) => gAtome(t).some((x) => gGleich(x, v)));
      let b;
      if ((b = bindung('groessenart'))) {
        // Was misst man mit dieser Einheit? Die Antworten nennen Länge, Gewicht, Zeit und Geld.
        if (!EINHEIT[b.einheit] || !new RegExp(`(?<![${B_}])${b.einheit}(?![${B_}])`).test(a.text)) { m.push('Größenart: Die Einheit steht nicht im Text'); break; }
        stufeEin((t) => (Object.values(ART_NAME).includes(t) ? t === ART_NAME[EINHEIT[b.einheit][0]] : undefined));
      } else if ((b = bindung('gleichwert'))) {
        // Richtig ist jede Antwort, die so viel wert ist wie die Größe aus dem Text.
        const v = gRechne(b.groesse);
        if (!imText(v)) { m.push(`${b.groesse} steht nicht im Text`); break; }
        stufeEin((_, w) => (w ? gGleich(w, v) : undefined));
      } else if ((b = bindung('extrem'))) {
        if (optWerte.some((w) => !w || w.art !== optWerte[0]?.art)) { m.push('Antworten lassen sich nicht vergleichen'); break; }
        const ziel = (b.was === 'groesste' ? Math.max : Math.min)(...optWerte.map((w) => w.w));
        if (optWerte.filter((w) => w.w === ziel).length !== 1) m.push('der Wert kommt doppelt vor');
        if ((b.was === 'groesste' ? AB : AUF).test(a.text) === false) m.push('der Text verlangt eine andere Richtung');
        stufeEin((_, w) => w.w === ziel);
      } else if ((b = bindung('stuetzgroesse'))) {
        if (b.saetze) {
          // Antworten der Form „Tür: 2 m“. Richtig ist, was zur Stützgröße passt.
          stufeEin((t) => { const x = t.match(/^(.+): (.+)$/); return x ? imBereich(x[1], gRechne(x[2])) : undefined; });
        } else if (b.ding) {
          if (!a.text.includes(b.ding)) { m.push(`${b.ding} steht nicht im Text`); break; }
          stufeEin((t, w) => imBereich(b.ding, b.zahl != null ? gRechne(`${b.zahl} ${t}`) : w));
        } else {
          const v = gRechne(b.groesse);
          if (!imText(v)) m.push(`${b.groesse} steht nicht im Text`);
          stufeEin((t) => imBereich(t, v));
        }
      } else if (bindung('rechnungswahl')) {
        const erste = new Set(zeilen.map((z) => z.erste).filter(Boolean));
        stufeEin((t) => erste.has(norm(t)));
      } else if ((b = bindung('gleichungswahl'))) {
        stufeEin((t) => { const g = gGleichungen(t); return g.length === 1 && g[0].ganz === t ? g[0].ok !== Boolean(b.falsche) : undefined; });
      } else if ((b = bindung('massstab'))) {
        const [p, w] = [gRechne(b.plan), gRechne(b.wirklich)];
        if (!p || !w || p.art !== 'laenge' || w.art !== 'laenge' || !bekannt.has(gKey(p)) || !bekannt.has(gKey(w))) { m.push('Maßstab: Plan und Wirklichkeit stehen nicht in der Aufgabe'); break; }
        stufeEin((t) => { const x = t.match(/^(\d[\d ]*):(\d[\d ]*)$/); return x ? ganzeZahl(x[1]) * w.w === ganzeZahl(x[2]) * p.w : undefined; });
      } else if ((b = bindung('vergleich'))) {
        const [l, r] = [gRechne(b.links), gRechne(b.rechts)];
        if (!l || !r || l.art !== r.art || !imText(l) || !imText(r)) { m.push('Vergleich: Größen stehen nicht im Text oder passen nicht zusammen'); break; }
        const zeichen = l.w < r.w ? '<' : l.w > r.w ? '>' : '=';
        stufeEin((t) => (['<', '>', '='].includes(t) ? t === zeichen : undefined));
      } else if ((b = bindung('urteil'))) {
        // Behauptung prüfen: als Gleichung im Text („3 m = 30 cm“) oder als behauptetes Ergebnis einer Rechnung.
        let wahr;
        if (b.behauptung) { const g = gGleichungen(b.behauptung); wahr = g.length === 1 ? g[0].ok : undefined; if (!norm(a.text).includes(norm(b.behauptung))) m.push('Urteil: Die Behauptung steht nicht im Text'); }
        else if (b.ding) { const v = gRechne(b.groesse); wahr = imBereich(b.ding, v); if (!imText(v) || !a.text.includes(b.ding)) m.push('Urteil: Ding oder Größe stehen nicht im Text'); }
        else if (b.behauptet) { const v = gRechne(b.behauptet); wahr = v && ende ? gGleich(v, ende) : undefined; if (!imText(v)) m.push('Urteil: Das behauptete Ergebnis steht nicht im Text'); }
        if (wahr === undefined || wahr !== b.stimmt) m.push(`Urteil: Die Behauptung ist ${wahr === undefined ? 'nicht prüfbar' : wahr ? 'richtig' : 'falsch'}`);
        for (const o of a.optionen) { const pol = polaritaet(o.text); if (pol === null) m.push(`Urteil: „${o.text.slice(0, 30)}“ beginnt nicht mit Stimmt oder Falsch`); else if (o.richtig && pol !== b.stimmt) m.push('Urteil: Die richtige Antwort widerspricht dem Urteil'); }
        for (const o of a.optionen.filter((x) => x.richtig)) for (const v of gAtome(o.text)) if (!bekannt.has(gKey(v))) m.push(`${gKey(v)} in der richtigen Antwort kommt weder im Text noch im Nachweis vor`);
      } else if (optWerte.every(Boolean)) {
        // Alle Antworten sind Größen, Zahlen oder Rechnungen: Richtig ist genau, was so viel wert ist wie das Ergebnis des Nachweises.
        if (!ende) m.push('Der Nachweis endet mit keiner Rechnung');
        else stufeEin((_, w) => gGleich(w, ende));
      } else {
        if (a.optionen.some((o) => polaritaet(o.text) !== null)) m.push('Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
        for (const o of a.optionen.filter((x) => x.richtig)) for (const v of gAtome(o.text)) if (v.art !== 'fehler' && !bekannt.has(gKey(v))) m.push(`${gKey(v)} in der richtigen Antwort kommt weder im Text noch im Nachweis vor`);
      }
      break;
    }
    default:
  }
  return m;
}

// ---------- Aufbau der neuen Formate ----------
// Format „groesse“: Lösung in der kleinsten Einheit, dazu die Einheit der Anzeige und, wenn das Kind sie wählt, die Auswahl der Einheiten.
export function groesseMaengel(a, fehlvorstellungen) {
  const m = [];
  if (!GROESSEN.includes(a.groesse)) return ['Größe: unbekannte Größenart'];
  if (einheitArt(a.einheit) !== a.groesse || !['ct', '€', 'mm', 'cm', 'dm', 'm', 'km', 'mg', 'g', 'kg', 't', 's', 'min', 'h', 'd'].includes(a.einheit)) m.push('Größe: Einheit passt nicht zur Größenart');
  if (!Number.isInteger(a.loesung) || a.loesung <= 0) m.push('Größe: Lösung ist keine natürliche Zahl in der kleinsten Einheit');
  else if (a.groesse !== 'zeit' && (a.loesung * 1000) % einheitFaktor(a.einheit) !== 0) m.push('Größe: Lösung hat in ihrer Einheit mehr als drei Stellen nach dem Komma');
  if (a.einheiten) {
    if (!Array.isArray(a.einheiten) || a.einheiten.length < 3 || a.einheiten.length > 6 || !a.einheiten.includes(a.einheit) || a.einheiten.some((e) => !EINHEIT[e]) || new Set(a.einheiten).size !== a.einheiten.length) m.push('Größe: Auswahl der Einheiten passt nicht');
    if (!['M', 'E'].includes(a.niveau)) m.push('Größe: Die Einheit wählt das Kind erst ab M selbst');
  }
  const werte = (a.typischeFehler ?? []).map((f) => f.wert);
  if (new Set(werte).size !== werte.length) m.push('typischer Fehler doppelt');
  for (const f of a.typischeFehler ?? []) {
    if (f.wert === a.loesung || !Number.isInteger(f.wert) || f.wert <= 0) m.push('typischer Fehler ist gleich der Lösung oder keine Größe');
    if (!(f.fehlvorstellung in fehlvorstellungen)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  return m;
}
// Tabelle „einheitentafel“: ein Feld je Ziffer. Jede Zeile zeigt die Größe aus ihrem Nachweis; darunter kann die Größe in einer Einheit abgelesen werden.
export function tafelMaengel(a) {
  const m = [], t = a.tabelle, wert = (c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c === '' ? null : Number(c));
  if (!Array.isArray(t.gruppen) || !tafelLueckenlos(t.gruppen) || t.gruppen.reduce((n, g) => n + g.spalten, 0) !== t.kopf.length) return ['Einheitentafel: Gruppen passen nicht zu den Spalten'];
  if (!['F', 'G'].includes(a.niveau)) m.push('Einheitentafel: Die Tafel zum Eintragen gibt es nur auf F und G');
  const nachweise = (a.nachweis ?? []).filter((n) => n?.art === 'einheitentafel');
  const werte = t.zeilen.map((zeile, i) => {
    const ziffern = zeile.map(wert), v = tafelWert(t.gruppen, ziffern), n = nachweise.filter((x) => (x.zeile ?? 0) === i);
    if (!v) { m.push(`Einheitentafel: Zeile ${i + 1} hat ein Feld mit mehr als einer Ziffer`); return null; }
    const erste = ziffern.findIndex((z) => z != null);
    if (erste < 0 || ziffern.slice(erste).some((z) => z == null) || (ziffern[erste] === 0 && erste < ziffern.length - 1)) m.push(`Einheitentafel: Zeile ${i + 1} hat ein leeres Feld mitten in der Zahl oder eine führende Null`);
    if (n.length !== 1) m.push(`Einheitentafel: Zeile ${i + 1} ohne Nachweis`);
    else if (!gGleich(gRechne(n[0].groesse), v)) m.push(`Einheitentafel: Zeile ${i + 1} zeigt nicht ${n[0].groesse}`);
    else if (!textAtome(a.text).some((x) => gGleich(x, v))) m.push(`Einheitentafel: ${n[0].groesse} steht nicht im Text`);
    return v;
  });
  if (t.ablesen) {
    const l = a.luecken?.[t.ablesen.luecke]?.loesung, v = werte.at(-1);
    if (!EINHEIT[t.ablesen.einheit] || !v || !gGleich(sollWert(l, t.ablesen.einheit), v)) m.push('Einheitentafel: Die abgelesene Größe passt nicht zur Tafel');
  }
  return m;
}
// Tabelle „umwandeln“: In jeder Zeile steht dieselbe Größe in den Einheiten der Kopfzeile.
export function umwandelMaengel(a) {
  const m = [], t = a.tabelle, wert = (c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c);
  if (t.kopf.some((k) => !EINHEIT[k])) return ['Umwandeln: Die Kopfzeile nennt Einheiten'];
  t.zeilen.forEach((zeile, i) => {
    const werte = zeile.map((c, k) => gRechne(`${wert(c)} ${t.kopf[k]}`));
    if (werte.some((w) => !w || !gGleich(w, werte[0]))) m.push(`Umwandeln: Zeile ${i + 1} zeigt nicht überall dieselbe Größe`);
    if (zeile.every((c) => typeof c === 'object')) m.push(`Umwandeln: Zeile ${i + 1} gibt nichts vor`);
  });
  return m;
}
// Schätzen mit Vergleichsgröße: Die Lösung ist das Ergebnis des Nachweises (pruefeGroessenNachweis), der Schätzbereich ein Fünftel darüber und darunter.
export function schaetzMaengel(a, fehlvorstellungen) {
  const m = [], n = a.loesung;
  if (!['M', 'E'].includes(a.niveau)) m.push('Schätzen mit Schätzbereich gibt es erst ab M');
  if (!Number.isInteger(n) || n < 5) m.push('Schätzen: Lösung ist zu klein für einen Schätzbereich');
  if (!EINHEIT[a.einheit]) m.push('Schätzen: Einheit fehlt');
  if (JSON.stringify(a.bereich) !== JSON.stringify([Math.ceil(n * 0.8), Math.floor(n * 1.2)])) m.push(`Schätzen: Schätzbereich ist ${Math.ceil(n * 0.8)} bis ${Math.floor(n * 1.2)}`);
  if (a.bild.hilfslinien) m.push('Schätzen: ab M ohne Hilfslinien');
  for (const f of a.typischeFehler ?? []) {
    if (!(f.von <= f.bis) || (f.von <= a.bereich?.[1] && f.bis >= a.bereich?.[0])) m.push('Schätzen: typischer Fehler liegt im Schätzbereich');
    if (!(f.fehlvorstellung in fehlvorstellungen)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  if (!(a.nachweis ?? []).some((x) => x?.art === 'vergleichsbild')) m.push('Schätzen: Nachweis zum Vergleichsbild fehlt');
  return m;
}
// Auswahl als Teil einer Sachaufgabe (wichtige Angaben, passende Rechnung, Antwortsatz).
export function teilAuswahlMaengel(t, niveau, fehlvorstellungen) {
  const m = [], richtige = (t.optionen ?? []).filter((o) => o.richtig).length, max = { F: 3, G: 3, M: 4, E: 5 }[niveau] + (t.mehrfach ? 1 : 0);
  if ('loesung' in t) m.push('eine Auswahl hat keine Zahl als Lösung');
  if (!Array.isArray(t.optionen) || t.optionen.length < 2 || t.optionen.length > max) return [...m, 'Auswahl: Anzahl der Antworten passt nicht'];
  if (richtige < 1 || (!t.mehrfach && richtige !== 1) || (t.mehrfach && richtige === t.optionen.length)) m.push('Auswahl: Anzahl der richtigen Antworten passt nicht');
  if (new Set(t.optionen.map((o) => norm(o.text))).size !== t.optionen.length) m.push('Auswahl: Antwort doppelt');
  for (const o of t.optionen) {
    if (o.fehlvorstellung && (o.richtig || !(o.fehlvorstellung in fehlvorstellungen))) m.push(`Auswahl: Fehlvorstellung ${o.fehlvorstellung} passt nicht`);
    if (o.richtig) for (const g of gGleichungen(o.text)) if (!g.ok) m.push(`Auswahl: Gleichung in der richtigen Antwort stimmt nicht: ${g.ganz}`);
  }
  return m;
}
