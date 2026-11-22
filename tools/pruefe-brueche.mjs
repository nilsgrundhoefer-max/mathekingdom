// Kapitel 9 „Brüche und Dezimalzahlen“ (ADR 0036): Der Prüfer rechnet mit Brüchen.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Jede Zahl ist ein Bruch aus ganzem Zähler und Nenner: „3⁄4“, „1 3⁄4“ (gemischt), „0,25“, „12“. Eine Größe („3⁄4 km“, „2,5 kg“)
// wird in ihrer kleinsten Einheit geführt. Gerechnet wird genau, nie mit Kommazahlen des Rechners.

import { bildMaengel as groessenBildMaengel, tafelWert as einheitentafelWert } from './pruefe-groessen.mjs';

const B_ = 'A-Za-zÄÖÜäöüß';
const EINHEIT = {
  ct: ['geld', 1, 1], '€': ['geld', 100, 1],
  mm: ['laenge', 1, 1], cm: ['laenge', 10, 1], dm: ['laenge', 100, 1], m: ['laenge', 1000, 1], km: ['laenge', 1000000, 1],
  mg: ['gewicht', 1, 1], g: ['gewicht', 1000, 1], kg: ['gewicht', 1000000, 1], t: ['gewicht', 1000000000, 1],
  s: ['zeit', 1, 1], min: ['zeit', 60, 1], h: ['zeit', 3600, 1],
  // Stellenwerte als Wörter: „7 Zehntel“ ist 7⁄10.
  Zehntel: ['zahl', 1, 10], Hundertstel: ['zahl', 1, 100], Tausendstel: ['zahl', 1, 1000], Einer: ['zahl', 1, 1], Zehner: ['zahl', 10, 1], Hunderter: ['zahl', 100, 1],
  // Bruchwörter: „3 Viertel“ ist 3⁄4.
  Halbe: ['zahl', 1, 2], Drittel: ['zahl', 1, 3], Viertel: ['zahl', 1, 4], Fünftel: ['zahl', 1, 5], Sechstel: ['zahl', 1, 6], Achtel: ['zahl', 1, 8],
};
const EINH = Object.keys(EINHEIT).sort((x, y) => y.length - x.length).join('|');
const ZAHL = '(?:\\d+\\u202f)?\\d+\\u2044\\d+|\\d+(?:\\u00a0\\d{3})*(?:,\\d+)?';
const TEIL = `(?:${ZAHL})(?:[ \\u00a0](?:${EINH})(?![${B_}²]))?`;
const TERM = `\\(*${TEIL}(?: ${TEIL})*\\)*`;
const SEITE = `${TERM}(?: (?:[+−·:]|von) ${TERM})*`;

// ---------- Brüche ----------
const ggt = (a, b) => (b ? ggt(b, a % b) : Math.abs(a));
const Q = (z, n = 1) => { if (!Number.isSafeInteger(z) || !Number.isSafeInteger(n) || n === 0) return null; const g = ggt(z, n) || 1, v = n < 0 ? -1 : 1; return { z: (v * z) / g, n: (v * n) / g }; };
const qPlus = (a, b) => Q(a.z * b.n + b.z * a.n, a.n * b.n), qMinus = (a, b) => Q(a.z * b.n - b.z * a.n, a.n * b.n);
const qMal = (a, b) => Q(a.z * b.z, a.n * b.n), qDurch = (a, b) => (b.z === 0 ? null : Q(a.z * b.n, a.n * b.z));
const qVgl = (a, b) => a.z * b.n - b.z * a.n;
export const schluessel = (v) => `${v.art}:${v.w.z}/${v.w.n}`;
export const gleich = (x, y) => Boolean(x && y) && x.art === y.art && qVgl(x.w, y.w) === 0;
const zahl = (z, n = 1) => ({ art: 'zahl', w: Q(z, n) });

// Eine einzelne Zahl ohne Einheit.
function leseZahl(text) {
  const b = text.match(/^(?:(\d+) )?(\d+)⁄(\d+)$/);
  if (b) return Number(b[3]) > 0 ? Q(Number(b[1] ?? 0) * Number(b[3]) + Number(b[2]), Number(b[3])) : null;
  const d = text.replace(/ /g, '').match(/^(\d+)(?:,(\d+))?$/);
  return d ? Q(Number(d[1] + (d[2] ?? '')), 10 ** (d[2]?.length ?? 0)) : null;
}
// Ein Stück wie „3⁄4 km“, „0,25“ oder „7 Zehntel“.
function leseTeil(text) {
  const m = text.match(new RegExp(`^(${ZAHL})(?:[ \\u00a0](${EINH}))?$`));
  if (!m) return null;
  const w = leseZahl(m[1]);
  if (!w) return null;
  if (!m[2]) return { art: 'zahl', w, f: 0 };
  const [art, mal, durch] = EINHEIT[m[2]];
  return { art, w: qMal(w, Q(mal, durch)), f: art === 'zahl' ? 0 : mal };
}
// Ein Term: ein Stück oder eine gemischte Größe („2 m 5 cm“, „1 h 30 min“). Gemischt steht die größere Einheit vorn.
function leseTerm(text) {
  const teile = [...text.matchAll(new RegExp(TEIL, 'g'))].map((m) => leseTeil(m[0]));
  if (!teile.length || teile.some((t) => !t)) return null;
  for (let i = 1; i < teile.length; i++) if (teile[i].art === 'zahl' || teile[i].art !== teile[0].art || teile[i].f >= teile[i - 1].f) return null;
  return { art: teile[0].art, w: teile.reduce((s, t) => qPlus(s, t.w), Q(0)) };
}

// Rechnet einen Ausdruck aus: „3⁄4 von 20 kg“, „1 − 3⁄8“, „2,5 km : 5“, „(3 + 5) : 8“. null, wenn er sich nicht lesen lässt.
export function rechne(ausdruck) {
  const t = String(ausdruck).trim(), marken = [];
  const muster = new RegExp(`\\s*(?:(${TEIL}(?: ${TEIL})*)|(von|[+−·:()]))`, 'y');
  let p = 0;
  while (p < t.length) {
    muster.lastIndex = p;
    const m = muster.exec(t);
    if (!m) return null;
    p = muster.lastIndex;
    marken.push(m[2] ?? leseTerm(m[1]));
    if (marken.at(-1) === null) return null;
  }
  let i = 0;
  const faktor = () => {
    if (marken[i] === '(') { i++; const w = strich(); if (marken[i++] !== ')') return null; return w; }
    return typeof marken[i] === 'object' ? marken[i++] ?? null : null;
  };
  const punkt = () => {
    let w = faktor();
    while (marken[i] === '·' || marken[i] === ':' || marken[i] === 'von') {
      const z = marken[i++], r = faktor();
      if (!w || !r) return null;
      if (z === ':') w = r.art === 'zahl' ? { art: w.art, w: qDurch(w.w, r.w) } : w.art === r.art ? { art: 'zahl', w: qDurch(w.w, r.w) } : null;
      else w = w.art === 'zahl' ? { art: r.art, w: qMal(w.w, r.w) } : r.art === 'zahl' && z === '·' ? { art: w.art, w: qMal(w.w, r.w) } : null;
      if (!w?.w) return null;
    }
    return w;
  };
  function strich() {
    let w = punkt();
    while (marken[i] === '+' || marken[i] === '−') {
      const z = marken[i++], r = punkt();
      if (!w || !r || w.art !== r.art) return null;
      w = { art: w.art, w: z === '+' ? qPlus(w.w, r.w) : qMinus(w.w, r.w) };
      if (!w.w || w.w.z < 0) return null;
    }
    return w;
  }
  const w = strich();
  return i === marken.length ? w : null;
}
// Alle Zahlen und Größen in einem Text. Was sich nicht lesen lässt („3 m 250 cm“), kommt als { art: 'fehler' } zurück.
export function atome(text) {
  return [...String(text ?? '').matchAll(new RegExp(`(?<![\\d\\u2044,])${TEIL}(?: ${TEIL})*`, 'g'))].flatMap((m) => {
    const ganz = leseTerm(m[0]);
    if (ganz) return [{ ...ganz, roh: m[0] }];
    // Zwei Zahlen hintereinander („Platz 3 4 Kinder“) sind einzelne Zahlen.
    return [...m[0].matchAll(new RegExp(TEIL, 'g'))].map((x) => { const v = leseTeil(x[0]); return v ? { art: v.art, w: v.w, roh: x[0] } : { art: 'fehler', roh: x[0] }; });
  });
}
// Eine Kette aus Gleichungen und Vergleichen: „3⁄4 km = 750 m“, „0,15 < 0,5“, „1⁄4 von 20 = 20 : 4 = 5“.
export function kette(text) {
  const stuecke = String(text).trim().split(/ ([=<>]) /);
  const werte = stuecke.filter((_, i) => i % 2 === 0).map(rechne), zeichen = stuecke.filter((_, i) => i % 2 === 1);
  if (werte.length < 2 || werte.some((w) => !w)) return { lesbar: false, ok: false, werte };
  const ok = zeichen.every((z, i) => werte[i].art === werte[i + 1].art && (z === '=' ? qVgl(werte[i].w, werte[i + 1].w) === 0 : z === '<' ? qVgl(werte[i].w, werte[i + 1].w) < 0 : qVgl(werte[i].w, werte[i + 1].w) > 0));
  return { lesbar: true, ok, werte, seiten: stuecke.filter((_, i) => i % 2 === 0), zeichen };
}
// Alle Ketten in einem freien Text, im Format des Prüfers (ganz, seiten, ok, danach).
const KETTE = new RegExp(`(?<![+−·=<>] )(?<! : )(?<! von )(?<![\\d▢_(\\[${B_}\\u00a0\\u202f\\u2044,])(${SEITE})((?: [=<>] ${SEITE})+)(?! ?[+−·=<>▢_\\d\\u2044]| : | von )`, 'g');
export function bGleichungen(text) {
  const t = String(text ?? '');
  return [...t.matchAll(KETTE)].map((m) => {
    const k = kette(m[0]);
    return { ganz: m[0], seiten: k.seiten ?? [m[1]], rest: null, groesse: true, stelle: m.index, danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1), ok: k.ok };
  });
}

// ---------- Bilder ----------
const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
const jeGanzes = (f) => (f.form === 'rechteck' ? f.reihen * f.spalten : f.form === 'hundert' ? 100 : f.teile);
const HOECHSTENS = { kreis: 12, rechteck: 20, streifen: 20, menge: 20, hundert: 100 };
function figurMaengel(f, zumFaerben = false) {
  const m = [];
  if (!(f.form in HOECHSTENS)) return [`unbekannte Form ${f.form}`];
  if (f.form === 'rechteck' ? !ganz(f.reihen, 1, 5) || !ganz(f.spalten, 1, 10) : f.form !== 'hundert' && !ganz(f.teile, 2, 20)) m.push('Teile fehlen');
  const n = jeGanzes(f);
  if (!(n >= 2) || n > HOECHSTENS[f.form]) m.push(`${n} Teile sind für ${f.form} zu viele oder zu wenige`);
  if (f.ganze != null && (!ganz(f.ganze, 2, 3) || !['kreis', 'rechteck'].includes(f.form))) m.push('mehrere Ganze gibt es nur als Kreis oder Rechteck, höchstens drei');
  if (f.ungleich && !['kreis', 'rechteck', 'streifen'].includes(f.form)) m.push('ungleiche Teile gibt es nur bei Kreis, Rechteck und Streifen');
  if (f.ungleich && f.form === 'rechteck' && f.reihen !== 1) m.push('ein ungleich geteiltes Rechteck hat nur eine Reihe');
  if (zumFaerben) { if (f.gefaerbt || f.ungleich || f.n || f.form === 'hundert') m.push('zum Färben: ohne Vorgabe, ohne Namen, mit gleich großen Teilen'); return m; }
  const alle = n * (f.ganze ?? 1);
  if (!Array.isArray(f.gefaerbt) || f.gefaerbt.some((i) => !ganz(i, 0, alle - 1)) || new Set(f.gefaerbt).size !== f.gefaerbt.length) m.push('gefärbte Teile passen nicht zur Figur');
  return m;
}
// Der Bruchteil, den eine Figur zeigt. null bei ungleich großen Teilen: Die zeigen keinen Bruchteil.
const figurWert = (f) => (f.ungleich ? null : Q(f.gefaerbt.length, jeGanzes(f)));
const figurVon = (a, name) => { const fs = a.bild?.art === 'bruch' ? a.bild.figuren : []; return name == null || name === '' ? (fs.length === 1 ? fs[0] : null) : fs.find((f) => f.n === name) ?? null; };
// Wert einer Zeile der Stellenwerttafel. Spalten: T, H, Z, E und nach dem Komma z, h, t.
const STELLE = { T: [1000, 1], H: [100, 1], Z: [10, 1], E: [1, 1], z: [1, 10], h: [1, 100], t: [1, 1000] };
function tafelWert(spalten, ziffern) {
  let w = Q(0);
  for (let i = 0; i < spalten.length; i++) {
    const s = STELLE[spalten[i]], z = ziffern[i] ?? 0;
    if (!s || !ganz(z, 0, 9)) return null;
    w = qPlus(w, Q(z * s[0], s[1]));
  }
  return w;
}
function tafelMaengel(spalten, komma) {
  const m = [];
  if (!Array.isArray(spalten) || spalten.some((s) => !STELLE[s])) return ['Stellenwerttafel: unbekannte Spalte'];
  const werte = spalten.map((s) => STELLE[s][0] / STELLE[s][1]);
  if (werte.some((w, i) => i > 0 && Math.abs(werte[i - 1] / w - 10) > 1e-9)) m.push('Stellenwerttafel: Spalten schließen nicht aneinander an');
  if (spalten[komma] !== 'E' || komma === spalten.length - 1) m.push('Stellenwerttafel: Das Komma steht nach den Einern');
  return m;
}
const strahlVon = (a) => a.strahl ?? (a.bild?.art === 'zahlenstrahl' ? a.bild : null);
// Was ein Bild, ein Zahlenstrahl, eine Tafel oder eine Tabelle zeigt.
function gezeigt(a) {
  const liste = [];
  for (const f of a.bild?.art === 'bruch' ? a.bild.figuren : []) {
    const n = jeGanzes(f), k = f.gefaerbt?.length ?? 0;
    liste.push(zahl(n), zahl(k), zahl(n * (f.ganze ?? 1) - k), zahl(n - k));
    if (!f.ungleich) liste.push(zahl(k, n), zahl(n - k, n));
  }
  if (a.faerben) { const n = jeGanzes(a.faerben); liste.push(zahl(n), zahl(n * (a.faerben.ganze ?? 1)), zahl(a.faerben.ganze ?? 1)); if (a.faerben.form === 'rechteck') liste.push(zahl(a.faerben.reihen), zahl(a.faerben.spalten)); }
  const st = strahlVon(a);
  if (st) { const T = st.teiler ?? 1; for (const x of [st.von, st.bis, st.schritt, st.beschriftung, st.pfeil, ...(st.punkte ?? [])]) if (x != null) liste.push(zahl(x, T)); }
  if (a.bild?.art === 'tafel') for (const zeile of [a.bild.werte, ...(a.bild.weitere ?? [])]) { const w = tafelWert(a.bild.spalten, zeile); if (w) liste.push({ art: 'zahl', w }); for (const z of zeile) if (z != null) liste.push(zahl(z)); }
  if (a.bild?.art === 'einheitentafel') for (const zeile of [a.bild.werte, ...(a.bild.weitere ?? [])]) { const v = einheitentafelWert(a.bild.gruppen, zeile); if (v) liste.push({ art: v.art, w: Q(v.w) }); }
  if (a.tabelle) for (const c of a.tabelle.zeilen.flat()) if (typeof c !== 'object') liste.push(...atome(c));
  if (a.tabelle?.kopf) for (const c of a.tabelle.kopf) liste.push(...atome(c));
  for (const zeile of [a.daten?.kopf ?? [], ...(a.daten?.zeilen ?? [])]) for (const c of zeile) liste.push(...atome(c));
  return liste.filter((v) => v.w);
}

// ---------- Sprache ----------
// Nenner, Nachkommastellen und Brüche über 1 je Niveaustufe (Grilling mit Nils, 2026-11-22).
export function bruchSprachMaengel(a, texte) {
  const m = [], stufe = ['F', 'G', 'M', 'E'].indexOf(a.niveau), dezimal = a.lernziel.startsWith('5.9.3');
  const alle = texte.join(' \n ');
  if (/(?<![\d⁄])\d+\/\d+/.test(alle)) m.push('ein Bruch steht mit Schrägstrich statt mit Bruchstrich');
  if (/[½¼¾]/.test(alle)) m.push('Brüche stehen als Zähler und Nenner, nicht als einzelnes Zeichen');
  const erlaubt = dezimal ? [(n) => n === 10, (n) => [2, 10, 100].includes(n), (n) => [2, 4, 5, 10, 100, 1000].includes(n), (n) => n <= 1000][stufe]
    : [(n) => n <= 4, (n) => n <= 8 || n === 10, (n) => n <= 12 || n === 100, (n) => n <= 20 || n === 100][stufe];
  for (const x of alle.matchAll(/(?:(\d+) )?(\d+)⁄(\d+)/g)) {
    const [g, z, n] = [Number(x[1] ?? 0), Number(x[2]), Number(x[3])];
    if (n < 2) m.push(`Bruch mit Nenner ${n}`);
    else if (!erlaubt(n)) m.push(`Nenner ${n} gibt es auf Niveaustufe ${a.niveau} hier noch nicht`);
    if (!dezimal && stufe < 2 && (g > 0 || z > n)) m.push(`Brüche über 1 gibt es erst ab M („${x[0]}“)`);
    if (g > 0 && z >= n) m.push(`gemischte Zahl mit unechtem Bruch („${x[0]}“)`);
  }
  // Geld steht immer mit zwei Stellen nach dem Komma („2,50 €“).
  const stellen = [...alle.replace(/\d+,\d{2}[ \u00a0]€/g, ' ').matchAll(/\d,(\d+)/g)].map((x) => x[1].length);
  if (!dezimal && stellen.length) m.push('Dezimalzahlen gibt es erst in der Dezimalschreibweise');
  if (dezimal && stellen.some((s) => s > [1, 2, 3, 4][stufe])) m.push(`zu viele Nachkommastellen für Niveaustufe ${a.niveau}`);
  if (/Dezimalbruch|Kommazahl/.test(alle)) m.push('es heißt „Dezimalzahl“');
  return m;
}

// ---------- Aufgaben ----------
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Richtig|Ja)(?![a-zäöü])(?!, aber| nur)/.test(text) ? true : null);
const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };
const istDezimal = (x) => typeof x === 'string' && /^\d+,\d{1,4}$/.test(x);
const loesungOk = (x) => (Number.isInteger(x) && x >= 0) || istDezimal(x);
const mitEinheit = (x, einheit) => rechne(`${String(x)}${einheit && EINHEIT[einheit] ? ` ${einheit}` : ''}`);
const norm = (s) => String(s).replace(/[\s  ]/g, '');

// Prüft eine Aufgabe aus Kapitel 9 ganz: Format, Bild, Nachweis. Liefert die Liste der Mängel.
export function pruefeBruchAufgabe(a, fehlvorstellungen) {
  const m = [], M = (t) => m.push(t);
  const fvOk = (f) => { if (f && !(f in fehlvorstellungen)) M(`unbekannte Fehlvorstellung ${f}`); };
  const stufe = ['F', 'G', 'M', 'E'].indexOf(a.niveau);
  const nachweis = Array.isArray(a.nachweis) ? a.nachweis : [];
  if (!nachweis.length) { M('Nachweis fehlt'); return m; }
  const texte = [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.teile ?? []).map((t) => t.text), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts]), ...(a.karten ?? [])];
  const fehlerhaft = texte.flatMap(atome).filter((v) => v.art === 'fehler');
  for (const f of fehlerhaft) M(`„${f.roh}“ lässt sich nicht lesen`);

  // ----- Bilder -----
  if (a.bild?.art === 'bruch') {
    if (!Array.isArray(a.bild.figuren) || a.bild.figuren.length < 1 || a.bild.figuren.length > 4) M('Bruchbild: eine bis vier Figuren');
    else {
      for (const f of a.bild.figuren) for (const x of figurMaengel(f)) M(`Bruchbild: ${x}`);
      const namen = a.bild.figuren.map((f) => f.n ?? '');
      if (a.bild.figuren.length > 1 && (namen.some((n) => !/^[A-D]$/.test(n)) || new Set(namen).size !== namen.length)) M('Bruchbild: Mehrere Figuren brauchen die Namen A, B, C');
      if (stufe === 0 && a.bild.figuren.some((f) => f.ganze)) M('Bruchbild: mehrere Ganze erst ab M');
      // Jede Figur muss zur Aufgabe passen: Ihr gefärbter Bruchteil steht im Aufgabentext (ohne Bruch im Text: in den Antworten oder der Lösung).
      // Liest der Nachweis das Bild selbst ab oder wählt das Kind unter den Figuren, ist das Bild die Angabe und wird dort geprüft.
      const amBild = nachweis.some((n) => ['bild', 'figurwahl', 'figurextrem'].includes(n?.art));
      if (!amBild) {
        const werteIn = (liste) => liste.flatMap(atome).filter((v) => v.w && v.art === 'zahl' && (v.w.n !== 1 || /\u2044/.test(v.roh))).map((v) => ({ w: v.w, roh: v.roh }));
        const imText = werteIn([a.text]);
        const quellen = imText.length ? imText : werteIn([...texte.slice(1), typeof a.loesung === 'string' ? a.loesung : '']);
        const frei = quellen.map((q) => q.w);
        for (const f of a.bild.figuren) {
          const k = f.gefaerbt?.length ?? 0, n = jeGanzes(f);
          if (f.ungleich) continue;
          if (!k) { if (f.form !== 'menge') M(`Bruchbild: Figur ${f.n ?? ''} ist ganz weiß`); continue; }
          // Jede Figur braucht ihre eigene Angabe: Zwei Figuren mit demselben Bruchteil brauchen ihn zweimal.
          const i = frei.findIndex((w) => qVgl(w, Q(k, n)) === 0);
          // Oder die Aufgabe nennt beide Anzahlen als Zahlen („4 Teile sind gefärbt“, Nenner der Lösung).
          const ganzeZahlen = (x) => (String(x).match(/\d+/g) ?? []).map(Number);
          if (i < 0 && ganzeZahlen(a.text).includes(k) && [...ganzeZahlen(a.text), ...ganzeZahlen(typeof a.loesung === 'string' ? a.loesung : '')].includes(n)) continue;
          if (i < 0) M(`Bruchbild: Figur ${f.n ?? ''} zeigt ${k} von ${n} Teilen, das kommt in der Aufgabe nicht vor`); else if (a.bild.figuren.length > 1) frei.splice(i, 1);
        }
      }
    }
  } else if (a.bild?.art === 'tafel') {
    for (const x of tafelMaengel(a.bild.spalten, a.bild.komma)) M(x);
    for (const zeile of [a.bild.werte, ...(a.bild.weitere ?? [])]) if (zeile.length !== a.bild.spalten.length || !tafelWert(a.bild.spalten, zeile)) M('Stellenwerttafel: Zeile passt nicht zu den Spalten');
  } else if (a.bild?.art === 'einheitentafel') {
    for (const x of groessenBildMaengel(a.bild, a.niveau)) M(`Bild einheitentafel: ${x}`);
  } else if (a.bild && a.bild.art !== 'zahlenstrahl') M(`Bild ${a.bild.art} gibt es in Kapitel 9 nicht`);
  const st = strahlVon(a);
  if (st) {
    const T = st.teiler ?? 1, zehner = /^10*$/.test(String(T));
    if (!ganz(T, 1, 1000) || !(st.von < st.bis) || !(st.schritt > 0) || (st.bis - st.von) % st.schritt !== 0 || st.beschriftung % st.schritt !== 0) M('Zahlenstrahl: Einteilung geht nicht auf');
    if ((st.bis - st.von) / st.schritt > 40) M('Zahlenstrahl: zu viele Teilstriche');
    if (!zehner && (st.beschriftung % T !== 0 || st.von % T !== 0)) M('Zahlenstrahl: Mit Bruchteilen stehen nur die Ganzen am Strahl');
    for (const x of [st.pfeil, ...(st.punkte ?? [])]) if (x != null && (x < st.von || x > st.bis || (x - st.von) % st.schritt !== 0)) M('Zahlenstrahl: Pfeil oder Punkt liegt nicht auf einem Teilstrich');
    if (st.ausschnitt !== undefined && Boolean(st.ausschnitt) !== st.von > 0) M('Zahlenstrahl: Ausschnitt heißt, der Strahl beginnt nicht bei 0');
    if (st.von > 0 && !st.ausschnitt) M('Zahlenstrahl: Beginnt er nicht bei 0, ist er ein Ausschnitt');
  }

  // ----- Nachweis: Was ist bekannt, was ist ein Ergebnis? -----
  const bekannt = new Map(), ergebnisse = new Map(), benutzt = new Set(), formen = new Set();
  const kenne = (v) => { if (v?.w) bekannt.set(schluessel(v), v); };
  for (const v of [...texte.flatMap(atome), ...gezeigt(a)]) kenne(v);
  // Zähler, Nenner und Ganze eines Bruchs aus dem Text sind als Zahlen bekannt.
  for (const t of texte) for (const b of String(t).matchAll(/(?:(\d+)\u202f)?(\d+)\u2044(\d+)/g)) for (const x of [b[1], b[2], b[3]]) if (x != null) kenne(zahl(Number(x)));
  for (const n of [1, 10, 100, 1000, ...(stufe >= 2 ? [2, 3, 4, 5, 6, 7, 8, 9] : [])]) kenne(zahl(n));
  if (a.format === 'luecken') for (const v of atome(a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken?.[n]?.loesung ?? '?'))) kenne(v);
  // Ein Bruch aus zwei bekannten Zahlen („3 von 8 Kugeln“) ist bekannt. Eine Einheit allein („1 km“) ist immer bekannt.
  const istBekannt = (v) => bekannt.has(schluessel(v)) || ergebnisse.has(schluessel(v))
    || (v.art !== 'zahl' && Object.values(EINHEIT).some(([art, mal]) => art === v.art && v.w.n === 1 && v.w.z === mal))
    || (v.art === 'zahl' && v.w.n !== 1 && [...bekannt.values()].some((x) => x.art === 'zahl' && x.w.n === 1 && x.w.z !== 0 && (() => { const q = qMal(v.w, x.w); return q && q.n === 1 && bekannt.has(schluessel(zahl(q.z))); })()));
  const brauche = (text, wo) => { for (const v of atome(text)) { benutzt.add(schluessel(v)); if (v.art === 'fehler') M(`Nachweis: „${v.roh}“ lässt sich nicht lesen`); else if (!istBekannt(v)) M(`Nachweis: ${v.roh} kommt in der Aufgabe nicht vor (${wo})`); } };
  const ergibt = (v, form) => { if (v?.w) { ergebnisse.set(schluessel(v), v); benutzt.add(schluessel(v)); } if (form != null) formen.add(norm(form)); };
  const optionen = a.optionen ?? [];
  const stufeEin = (trifft, was) => { for (const o of optionen) { const t = trifft(o); if (t == null) M(`Nachweis ${was}: Antwort „${o.text}“ lässt sich nicht einstufen`); else if (t !== o.richtig) M(`Nachweis ${was}: Antwort „${o.text}“ ist falsch eingestuft`); } };
  let gebunden = false;
  for (const n of nachweis) {
    if (typeof n === 'string') {
      const k = kette(n);
      if (!k.lesbar) { M(`Nachweis: „${n}“ ist keine Rechnung`); continue; }
      if (!k.ok) M(`Nachweis: „${n}“ stimmt nicht`);
      // Umrechnungen („1 h = 60 min“) sind frei. Sonst kommen die Zahlen der ersten Seite aus der Aufgabe.
      brauche(k.seiten[0], n);
      for (const s of k.seiten.slice(1)) for (const v of atome(s)) { benutzt.add(schluessel(v)); kenne(v); }
      k.werte.forEach((w, i) => { if (i > 0) ergibt(w, k.seiten[i]); else kenne(w); });
      continue;
    }
    if (!n || typeof n !== 'object') { M('Nachweis: unlesbarer Eintrag'); continue; }
    if (n.art == null) { // Hilfszahl mit Grund
      const v = rechne(String(n.wert ?? ''));
      if (!v || !n.grund) M('Nachweis: Hilfszahl ohne Wert oder Grund'); else { kenne(v); benutzt.add(schluessel(v)); }
      continue;
    }
    const wert = (t, wo) => { const v = rechne(String(t ?? '')); if (!v) { M(`Nachweis ${n.art}: „${t}“ lässt sich nicht lesen`); return null; } brauche(String(t), wo ?? n.art); return v; };
    switch (n.art) {
      case 'bild': { // Was eine Figur zeigt: ihren Bruchteil oder eine Anzahl.
        const f = figurVon(a, n.figur);
        if (!f) { M('Nachweis bild: Figur fehlt'); break; }
        const je = jeGanzes(f), k = f.gefaerbt.length;
        if (n.bruch != null) {
          const v = rechne(n.bruch), soll = n.rest ? Q(je - k, je) : figurWert(f);
          if (!soll) M('Nachweis bild: Die Figur hat ungleich große Teile und zeigt keinen Bruchteil');
          else if (!v || v.art !== 'zahl' || qVgl(v.w, soll) !== 0) M(`Nachweis bild: Die Figur zeigt ${soll.z}⁄${soll.n}, nicht ${n.bruch}`);
          else if (n.form && norm(n.bruch) !== `${n.rest ? je - k : k}⁄${je}`) M(`Nachweis bild: Abgezählt ist es ${n.rest ? je - k : k}⁄${je}, nicht ${n.bruch}`);
          ergibt(v, n.bruch); for (const x of atome(n.bruch)) benutzt.add(schluessel(x));
        } else {
          const soll = { gefaerbt: k, teile: je, weiss: je * (f.ganze ?? 1) - k }[n.was];
          if (soll == null || soll !== n.zahl) M(`Nachweis bild: ${n.was} ist ${soll}, nicht ${n.zahl}`);
          ergibt(zahl(n.zahl), String(n.zahl));
        }
        break;
      }
      case 'teil': { // Zähler oder Nenner eines Bruchs aus der Aufgabe.
        const b = String(n.bruch ?? '').match(/^(\d+)⁄(\d+)$/);
        if (!b) { M('Nachweis teil: Bruch fehlt'); break; }
        wert(n.bruch);
        if (Number(n.was === 'zaehler' ? b[1] : n.was === 'nenner' ? b[2] : NaN) !== n.zahl) M(`Nachweis teil: ${n.was} von ${n.bruch} ist nicht ${n.zahl}`);
        ergibt(zahl(n.zahl), String(n.zahl));
        break;
      }
      case 'faerben': { // Teile färben: Die Anzahl ist der Bruchteil aller Teile eines Ganzen.
        const v = wert(n.ziel), je = a.faerben ? jeGanzes(a.faerben) : 0;
        if (a.format !== 'faerben' || !v) { M('Nachweis faerben: passt nicht zum Format'); break; }
        const soll = qMal(v.w, Q(je));
        if (v.art !== 'zahl' || soll.n !== 1 || soll.z !== a.loesung) M(`Nachweis faerben: ${n.ziel} von ${je} Teilen sind ${soll.z}${soll.n === 1 ? '' : `⁄${soll.n}`}, nicht ${a.loesung}`);
        if (!atome(a.text).some((x) => gleich(x, v))) M(`Nachweis faerben: ${n.ziel} steht nicht im Text`);
        gebunden = true;
        break;
      }
      case 'tafel': case 'tafelbild': { // Eine Zeile der Stellenwerttafel ist diese Zahl.
        const v = wert(n.zahl);
        const t = n.art === 'tafel' ? a.tabelle : a.bild, spalten = n.art === 'tafel' ? t?.kopf : t?.spalten;
        const zeile = n.art === 'tafel' ? t?.zeilen?.[n.zeile ?? 0]?.map((c) => (typeof c === 'object' ? a.luecken?.[c.luecke]?.loesung : c === '' ? null : Number(c))) : [t?.werte, ...(t?.weitere ?? [])][n.zeile ?? 0];
        const ist = spalten && zeile ? tafelWert(spalten, zeile) : null;
        if (!v || !ist || v.art !== 'zahl' || qVgl(v.w, ist) !== 0) M(`Nachweis ${n.art}: Die Zeile zeigt nicht ${n.zahl}`);
        ergibt(v, n.zahl);
        break;
      }
      case 'stelle': { // Die Ziffer einer Dezimalzahl an einer Stelle.
        const v = wert(n.zahl), s = STELLE[n.stelle];
        if (!v || !s || v.art !== 'zahl') { M('Nachweis stelle: Zahl oder Stelle fehlt'); break; }
        const q = qMal(v.w, Q(s[1] * 1000, s[0])), ziffer = q && q.n === 1 ? Math.floor(q.z / 1000) % 10 : null;
        if (ziffer !== n.ziffer) M(`Nachweis stelle: An der Stelle ${n.stelle} von ${n.zahl} steht ${ziffer}, nicht ${n.ziffer}`);
        ergibt(zahl(n.ziffer), String(n.ziffer));
        break;
      }
      case 'strahl': { // Die Zahl am Pfeil oder die Zahl, deren Teilstrich angetippt wird.
        const v = rechne(String(n.zahl ?? ''));
        if (!st || !v || v.art !== 'zahl') { M('Nachweis strahl: Zahlenstrahl oder Zahl fehlt'); break; }
        const T = st.teiler ?? 1, stelle = a.format === 'zahlenstrahl' && a.eingabe === 'markieren' ? a.loesung : st.pfeil;
        if (stelle == null || qVgl(v.w, Q(stelle, T)) !== 0) M(`Nachweis strahl: ${n.zahl} liegt nicht an der Stelle ${stelle}`);
        if (a.format === 'zahlenstrahl' && a.eingabe === 'markieren') { if (!atome(a.text).some((x) => gleich(x, v))) M(`Nachweis strahl: ${n.zahl} steht nicht im Text`); gebunden = true; }
        ergibt(v, n.zahl); for (const x of atome(String(n.zahl))) benutzt.add(schluessel(x));
        break;
      }
      case 'wert': { // Richtig ist genau die Antwort mit diesem Wert.
        const v = wert(n.wert);
        if (!v) break;
        const form = n.form ? norm(n.wert) : null;
        if (a.format === 'auswahl') { stufeEin((o) => { const w = rechne(o.text); return w ? gleich(w, v) && (!form || norm(o.text) === form) : false; }, 'wert'); gebunden = true; }
        ergibt(v, n.wert);
        break;
      }
      case 'vergleich': { // Welches Zeichen passt zwischen zwei Zahlen?
        const l = wert(n.links), r = wert(n.rechts);
        if (!l || !r || l.art !== r.art) { M('Nachweis vergleich: Die Seiten passen nicht zusammen'); break; }
        const z = qVgl(l.w, r.w) < 0 ? '<' : qVgl(l.w, r.w) > 0 ? '>' : '=';
        stufeEin((o) => (['<', '>', '='].includes(o.text.trim()) ? o.text.trim() === z : null), 'vergleich'); gebunden = true;
        break;
      }
      case 'extrem': { // Die größte oder kleinste Antwort.
        const werte = optionen.map((o) => rechne(o.text));
        if (werte.some((w) => !w || w.art !== werte[0].art)) { M('Nachweis extrem: Die Antworten lassen sich nicht vergleichen'); break; }
        const sortiert = [...werte].sort((x, y) => qVgl(x.w, y.w)), ziel = n.was === 'kleinste' ? sortiert[0] : sortiert.at(-1);
        if (werte.filter((w) => gleich(w, ziel)).length !== 1) M('Nachweis extrem: Der äußerste Wert kommt mehrfach vor');
        stufeEin((o) => gleich(rechne(o.text), ziel), 'extrem'); gebunden = true;
        for (const w of werte) benutzt.add(schluessel(w));
        break;
      }
      case 'schwelle': case 'zwischen': { // Richtig sind die Antworten über oder unter einer Zahl oder zwischen zwei Zahlen.
        const u = wert(n.art === 'zwischen' ? n.von : n.wert), o2 = n.art === 'zwischen' ? wert(n.bis) : null;
        if (!u || (n.art === 'zwischen' && (!o2 || qVgl(u.w, o2.w) >= 0)) || (n.art === 'schwelle' && !['<', '>'].includes(n.zeichen))) { M(`Nachweis ${n.art}: Grenzen fehlen`); break; }
        stufeEin((o) => { const w = rechne(o.text); if (!w || w.art !== u.art) return null; const d = qVgl(w.w, u.w); return n.art === 'zwischen' ? d > 0 && qVgl(w.w, o2.w) < 0 : n.zeichen === '>' ? d > 0 : d < 0; }, n.art); gebunden = true;
        for (const o of optionen) for (const v of atome(o.text)) benutzt.add(schluessel(v));
        break;
      }
      case 'figurextrem': { // Die Antworten nennen Figuren. Richtig ist die mit dem größten (oder kleinsten) gefärbten Bruchteil.
        const fs = (a.bild?.art === 'bruch' ? a.bild.figuren : []).filter((f) => !f.ungleich), werte = fs.map(figurWert).sort(qVgl), ziel = n.was === 'kleinste' ? werte[0] : werte.at(-1);
        if (fs.length < 2 || werte.filter((w) => qVgl(w, ziel) === 0).length !== 1) { M('Nachweis figurextrem: Der äußerste Wert fehlt oder kommt mehrfach vor'); break; }
        stufeEin((o) => { const f = figurVon(a, o.text.trim().slice(-1)); return f ? !f.ungleich && qVgl(figurWert(f), ziel) === 0 : null; }, 'figurextrem'); gebunden = true;
        break;
      }
      case 'ordnung': { // Die Karten liegen in der Lösung der Größe nach.
        const werte = (Array.isArray(a.loesung) ? a.loesung : []).map(rechne);
        if (a.format !== 'ordnen' || werte.some((w) => !w || w.art !== werte[0].art)) { M('Nachweis ordnung: Die Karten lassen sich nicht vergleichen'); break; }
        for (let i = 1; i < werte.length; i++) { const d = qVgl(werte[i - 1].w, werte[i].w); if (n.richtung === 'ab' ? d <= 0 : d >= 0) M(`Nachweis ordnung: „${a.loesung[i - 1]}“ und „${a.loesung[i]}“ liegen falsch herum oder sind gleich`); }
        if (!['auf', 'ab'].includes(n.richtung)) M('Nachweis ordnung: Richtung fehlt');
        gebunden = true;
        break;
      }
      case 'urteil': { // Stimmt die Behauptung? Die Antworten mit „Stimmt“ und „Falsch“ richten sich danach.
        const k = kette(String(n.behauptung ?? ''));
        if (!k.lesbar) { M(`Nachweis urteil: „${n.behauptung}“ ist keine Behauptung`); break; }
        if (k.ok !== n.stimmt) M(`Nachweis urteil: „${n.behauptung}“ ist ${k.ok ? 'richtig' : 'falsch'}`);
        for (const s of k.seiten) for (const v of atome(s)) { benutzt.add(schluessel(v)); kenne(v); }
        stufeEin((o) => { const p = polaritaet(o.text); if (p == null) return null; if (p) return k.ok; return !k.ok && bGleichungen(o.text).every((g) => g.ok); }, 'urteil'); gebunden = true;
        break;
      }
      case 'aussagen': { // Jede Antwort ist eine Gleichung oder ein Vergleich. Richtig sind die wahren (oder, wenn die falsche gesucht ist, die falsche).
        stufeEin((o) => { const k = kette(o.text.replace(/[.]$/, '')); return k.lesbar ? k.ok !== Boolean(n.falsche) : null; }, 'aussagen'); gebunden = true;
        for (const o of optionen) for (const v of atome(o.text)) benutzt.add(schluessel(v));
        break;
      }
      case 'figurwahl': { // Die Antworten nennen Figuren. Richtig sind die mit diesem Bruchteil (oder die mit ungleichen Teilen).
        const v = n.bruch != null ? wert(n.bruch) : null;
        if (n.bruch == null && !n.ungleich && !n.gleich) { M('Nachweis figurwahl: Bruch fehlt'); break; }
        stufeEin((o) => { const f = figurVon(a, o.text.trim().slice(-1)); if (!f) return null; return n.ungleich ? Boolean(f.ungleich) : n.gleich ? !f.ungleich : !f.ungleich && Boolean(v) && qVgl(figurWert(f), v.w) === 0; }, 'figurwahl'); gebunden = true;
        break;
      }
      case 'paare': { // Zuordnen: Beide Seiten eines Paares sind gleich viel, und kein anderes Paar hat denselben Wert.
        const seite = (t) => { const f = /^[A-D]$/.test(t.trim()) ? figurVon(a, t.trim()) : null; return f ? (f.ungleich ? null : { art: 'zahl', w: figurWert(f) }) : rechne(t); };
        const werte = (a.paare ?? []).map((p) => [seite(p.links), seite(p.rechts)]);
        werte.forEach(([l, r], i) => { if (!l || !r || !gleich(l, r)) M(`Nachweis paare: „${a.paare[i].links}“ und „${a.paare[i].rechts}“ sind nicht gleich viel`); });
        if (new Set(werte.filter(([l]) => l).map(([l]) => schluessel(l))).size !== werte.length) M('Nachweis paare: Zwei Paare haben denselben Wert');
        for (const [l, r] of werte) for (const v of [l, r]) if (v) benutzt.add(schluessel(v));
        gebunden = true;
        break;
      }
      case 'frei': { // Begriffsfrage ohne Rechnung („Wie heißt die Zahl unter dem Bruchstrich?“).
        if (!n.grund || !['auswahl', 'zuordnen'].includes(a.format)) M('Nachweis frei: nur für Begriffsfragen mit Grund');
        if (optionen.filter((o) => o.richtig).some((o) => /\d/.test(o.text))) M('Nachweis frei: Die richtige Antwort enthält eine Zahl und braucht einen echten Nachweis');
        gebunden = true;
        break;
      }
      default: M(`Nachweis: unbekannte Art ${n.art}`);
    }
  }
  const istErgebnis = (v) => Boolean(v) && ergebnisse.has(schluessel(v));
  const pruefeTeil = (t, was) => {
    if (!loesungOk(t.loesung)) M(`${was} ist weder eine natürliche Zahl noch eine Dezimalzahl`);
    const werte = (t.typischeFehler ?? []).map((f) => { fvOk(f.fehlvorstellung); if (!loesungOk(f.wert)) M(`${was}: typischer Fehler ${f.wert} ist keine Zahl`); return rechne(String(f.wert)); });
    const soll = rechne(String(t.loesung));
    if (werte.some((w) => w && soll && gleich(w, soll))) M(`${was}: typischer Fehler ist gleich der Lösung`);
    if (new Set(werte.filter(Boolean).map(schluessel)).size !== werte.length) M(`${was}: typischer Fehler doppelt`);
  };

  // ----- Formate -----
  switch (a.format) {
    case 'zahl': {
      pruefeTeil(a, 'Lösung');
      if (!istErgebnis(mitEinheit(a.loesung, a.einheit))) M(`Lösung ${a.loesung}${a.einheit ? ` ${a.einheit}` : ''} ergibt sich nicht aus dem Nachweis`);
      break;
    }
    case 'bruch': {
      const lies = (t) => { const x = String(t).match(/^(?:(\d+) )?(\d+)⁄(\d+)$/); return x && Number(x[3]) > 0 ? rechne(String(t)) : null; };
      const soll = lies(a.loesung);
      if (!soll) { M('Brucheingabe: Lösung ist kein Bruch'); break; }
      if (/ /.test(a.loesung) !== Boolean(a.gemischt)) M('Brucheingabe: Das Feld für die Ganzen gibt es genau bei einer gemischten Zahl als Lösung');
      const fehler = (a.typischeFehler ?? []).map((f) => { fvOk(f.fehlvorstellung); const w = lies(f.wert); if (!w) M(`Brucheingabe: typischer Fehler ${f.wert} ist kein Bruch`); return w; });
      if (fehler.some((w) => w && gleich(w, soll) && !a.genau)) M('Brucheingabe: typischer Fehler hat denselben Wert wie die Lösung');
      if (new Set((a.typischeFehler ?? []).map((f) => norm(f.wert))).size !== fehler.length) M('Brucheingabe: typischer Fehler doppelt');
      const v = a.einheit && EINHEIT[a.einheit] ? rechne(`${a.loesung} ${a.einheit}`) : soll;
      if (!istErgebnis(v)) M(`Lösung ${a.loesung} ergibt sich nicht aus dem Nachweis`);
      if (a.genau && !formen.has(norm(a.loesung)) && !formen.has(norm(`${a.loesung} ${a.einheit ?? ''}`))) M(`Brucheingabe: Verlangt ist genau ${a.loesung}, im Nachweis steht diese Schreibweise nicht`);
      break;
    }
    case 'faerben': {
      for (const x of figurMaengel(a.faerben ?? {}, true)) M(`Teile färben: ${x}`);
      const alle = a.faerben ? jeGanzes(a.faerben) * (a.faerben.ganze ?? 1) : 0;
      if (!ganz(a.loesung, 1, alle)) M('Teile färben: Die Anzahl passt nicht zur Figur');
      for (const f of a.typischeFehler ?? []) { fvOk(f.fehlvorstellung); if (!ganz(f.wert, 0, alle) || f.wert === a.loesung) M('Teile färben: typischer Fehler passt nicht'); }
      if (new Set((a.typischeFehler ?? []).map((f) => f.wert)).size !== (a.typischeFehler ?? []).length) M('Teile färben: typischer Fehler doppelt');
      if (a.bild) M('Teile färben zeigt schon ein Bild und braucht kein weiteres');
      if (!nachweis.some((n) => n?.art === 'faerben')) M('Teile färben: Nachweis fehlt');
      break;
    }
    case 'auswahl': {
      const richtige = optionen.filter((o) => o.richtig).length;
      if (optionen.length < 2) M('weniger als zwei Optionen');
      if (optionen.length > MAX_OPTIONEN[a.niveau] + (a.mehrfach ? 1 : 0)) M(`zu viele Antworten auf Niveaustufe ${a.niveau}`);
      if (richtige < 1 || (!a.mehrfach && richtige !== 1)) M('Auswahl braucht genau eine richtige Option (Mehrfachauswahl mindestens eine)');
      if (a.mehrfach && richtige === optionen.length) M('Mehrfachauswahl: alle Antworten sind richtig');
      if (new Set(optionen.map((o) => norm(o.text))).size !== optionen.length) M('Option doppelt');
      for (const o of optionen) { fvOk(o.fehlvorstellung); if (o.richtig && o.fehlvorstellung) M('richtige Antwort mit Fehlvorstellung'); }
      if (!gebunden) M('Auswahl: Die richtige Antwort ist nicht an den Nachweis gebunden');
      if (optionen.some((o) => polaritaet(o.text) !== null) && !nachweis.some((n) => n?.art === 'urteil')) M('Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
      break;
    }
    case 'luecken': {
      const namen = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
      if (!namen.length || new Set(namen).size !== namen.length) M('Lückentext: keine Lücke oder Lücke doppelt');
      for (const n of namen) if (!a.luecken?.[n]) M(`Lücke ${n} hat keine Lösung`); else pruefeTeil(a.luecken[n], `Lücke ${n}`);
      for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) M(`Lösung ${n} ohne Lücke im Text`);
      if (namen.some((n) => !a.luecken?.[n])) break;
      const setze = (anders) => a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => (n === anders ? '987' : a.luecken[n].loesung));
      const falsche = (text) => text.split('\n').filter((z) => !/rechnet|behauptet|sagt|meint/.test(z)).flatMap(bGleichungen).filter((g) => !g.ok);
      for (const g of falsche(setze(null))) M(`mit den Lösungen stimmt die Gleichung nicht: ${g.ganz}`);
      // Eine Lücke, die in keiner Gleichung des Textes steht, muss ein Ergebnis im Nachweis sein.
      for (const n of namen) if (falsche(setze(n)).length === 0 && !istErgebnis(rechne(String(a.luecken[n].loesung)))) M(`Lücke ${n}: ${a.luecken[n].loesung} ist kein Ergebnis im Nachweis`);
      break;
    }
    case 'tabelle': {
      const t = a.tabelle ?? {}, zellen = (t.zeilen ?? []).flat();
      if (!t.kopf?.length || (t.zeilen ?? []).some((z) => z.length !== t.kopf.length)) M('Tabelle: Zeilen passen nicht zur Kopfzeile');
      const namen = zellen.filter((c) => typeof c === 'object').map((c) => c.luecke);
      if (!namen.length || new Set(namen).size !== namen.length) M('Tabelle: keine Lücke oder Lücke doppelt');
      for (const n of namen) if (!a.luecken?.[n]) M(`Lücke ${n} hat keine Lösung`); else pruefeTeil(a.luecken[n], `Lücke ${n}`);
      for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) M(`Lösung ${n} ohne Lücke in der Tabelle`);
      if (t.art === 'stellentafel') {
        for (const x of tafelMaengel(t.kopf, t.komma)) M(x);
        for (const c of zellen) if (typeof c === 'object' ? !ganz(a.luecken?.[c.luecke]?.loesung, 0, 9) : !/^\d?$/.test(c)) M('Stellenwerttafel: Feld mit mehr als einer Ziffer');
        (t.zeilen ?? []).forEach((_, i) => { if (!nachweis.some((n) => n?.art === 'tafel' && (n.zeile ?? 0) === i)) M(`Stellenwerttafel: Zeile ${i + 1} ohne Nachweis`); });
      } else if (t.art) M(`Tabelle der Art ${t.art} gibt es in Kapitel 9 nicht`);
      else for (const n of namen) if (a.luecken?.[n] && !istErgebnis(rechne(String(a.luecken[n].loesung)))) M(`Lücke ${n}: ${a.luecken[n].loesung} ist kein Ergebnis im Nachweis`);
      break;
    }
    case 'zuordnen': {
      if ((a.paare?.length ?? 0) < 2) M('zu wenige Paare');
      for (const seite of ['links', 'rechts']) if (new Set((a.paare ?? []).map((p) => norm(p[seite]))).size !== (a.paare ?? []).length) M(`Paare ${seite} nicht eindeutig`);
      if ((a.paare ?? []).some((p) => /⁄/.test(p.rechts))) M('Zuordnen: Rechts steht kein Bruch, weil die Auswahlliste ihn nicht gestapelt zeigen kann');
      if (!gebunden) M('Zuordnen: Nachweis der Paare fehlt');
      break;
    }
    case 'ordnen': {
      if (!Array.isArray(a.karten) || a.karten.length < 3 || a.karten.length > 6) { M('Ordnen: drei bis sechs Karten'); break; }
      if (new Set(a.karten.map(norm)).size !== a.karten.length) M('Ordnen: Karte doppelt');
      if (!Array.isArray(a.loesung) || JSON.stringify([...a.loesung].sort()) !== JSON.stringify([...a.karten].sort())) M('Ordnen: Lösung nennt nicht genau die Karten');
      if (JSON.stringify(a.loesung) === JSON.stringify(a.karten)) M('Ordnen: Die Karten liegen schon richtig');
      for (const f of [a.umgekehrt, a.sonst]) fvOk(f);
      if (!nachweis.some((n) => n?.art === 'ordnung')) M('Ordnen: Nachweis der Reihenfolge fehlt');
      break;
    }
    case 'zahlenstrahl': {
      if (!st) { M('Zahlenstrahl fehlt'); break; }
      const T = st.teiler ?? 1;
      if (!['ablesen', 'markieren'].includes(a.eingabe)) M('Zahlenstrahl: Eingabe muss ablesen oder markieren sein');
      if (a.eingabe === 'markieren') {
        if (!ganz(a.loesung, st.von, st.bis) || (a.loesung - st.von) % st.schritt !== 0) M('Zahlenstrahl: Lösung liegt nicht auf einem Teilstrich');
        if (st.pfeil != null) M('Zahlenstrahl: Pfeil verrät die Lösung');
        if (a.loesung % st.beschriftung === 0) M('Zahlenstrahl: Die Lösung ist am Strahl beschriftet');
        for (const f of a.typischeFehler ?? []) { fvOk(f.fehlvorstellung); if (!ganz(f.wert, st.von, st.bis) || (f.wert - st.von) % st.schritt !== 0 || f.wert === a.loesung) M('Zahlenstrahl: typischer Fehler liegt nicht auf einem anderen Teilstrich'); }
      } else {
        pruefeTeil(a, 'Lösung');
        const v = rechne(String(a.loesung));
        if (st.pfeil == null || !v || qVgl(v.w, Q(st.pfeil, T)) !== 0) M('Zahlenstrahl: Pfeil zeigt nicht auf die Lösung');
        if (st.pfeil != null && st.pfeil % st.beschriftung === 0) M('Zahlenstrahl: Die Lösung steht als Beschriftung am Strahl');
        if (!istErgebnis(v)) M('Zahlenstrahl: Nachweis der Zahl am Pfeil fehlt');
      }
      if (!nachweis.some((n) => n?.art === 'strahl')) M('Zahlenstrahl: Nachweis fehlt');
      break;
    }
    case 'sachaufgabe': {
      if ((a.teile?.length ?? 0) < 2) M('Sachaufgabe braucht mindestens zwei Teile');
      for (const [i, t] of (a.teile ?? []).entries()) {
        if (!t.text?.trim() || t.optionen) { M('Sachaufgabe: Teilfrage fehlt oder ist eine Auswahl'); continue; }
        pruefeTeil(t, `Teil ${i + 1}`);
        if (!istErgebnis(mitEinheit(t.loesung, t.einheit))) M(`Teil ${i + 1}: Lösung ${t.loesung}${t.einheit ? ` ${t.einheit}` : ''} ergibt sich nicht aus dem Nachweis`);
      }
      break;
    }
    default: M(`Format ${a.format} gibt es in Kapitel 9 nicht`);
  }
  if (a.daten && (!Array.isArray(a.daten.kopf) || a.daten.kopf.length < 2 || !Array.isArray(a.daten.zeilen) || a.daten.zeilen.some((z) => z.length !== a.daten.kopf.length))) M('Daten: Zeilen passen nicht zur Kopfzeile');
  // Jede Zahl aus dem Text gehört zur Aufgabe: Sie steht im Nachweis oder im Bild. Bei einem Urteil und einer Begriffsfrage stehen Beispiele im Text.
  if (!nachweis.some((n) => ['urteil', 'frei', 'aussagen', 'extrem', 'ordnung', 'paare', 'figurwahl', 'schwelle', 'zwischen', 'figurextrem'].includes(n?.art))) {
    const imBild = new Set(gezeigt(a).map(schluessel));
    // Der Zähler und der Nenner eines benutzten Bruchs zählen als benutzt („3 von 8 Kugeln“ und 3⁄8).
    const teile = new Set([...benutzt, ...imBild].flatMap((k) => { const x = k.match(/^zahl:(\d+)\/(\d+)$/); return x ? [`zahl:${x[1]}/1`, `zahl:${x[2]}/1`] : []; }));
    for (const n of nachweis) if (typeof n === 'object' && n) for (const v of Object.values(n)) if (typeof v === 'string' || typeof v === 'number') for (const x of atome(String(v))) { benutzt.add(schluessel(x)); const b = String(x.roh).match(/(\d+)⁄(\d+)/); if (b) { teile.add(`zahl:${Number(b[1])}/1`); teile.add(`zahl:${Number(b[2])}/1`); } }
    for (const n of nachweis) if (typeof n === 'string') for (const b of n.matchAll(/(?:(\d+) )?(\d+)⁄(\d+)/g)) for (const x of [b[1], b[2], b[3]]) if (x != null) teile.add(`zahl:${Number(x)}/1`);
    for (const v of [a.text, ...(a.teile ?? []).map((t) => t.text)].flatMap((t) => atome(String(t).replace(/\{\{\w+\}\}/g, ' ▢ ')))) {
      if (v.art === 'fehler') continue;
      const k = schluessel(v);
      // Ein Bruch aus dem Text zählt auch, wenn mit seinem Zähler und seinem Nenner gerechnet wird (rückwärts zum Ganzen).
      const hat = (x) => x === 1 || [benutzt, imBild, teile].some((s) => s.has(`zahl:${x}/1`));
      const b = String(v.roh).match(/^(\d+)\u2044(\d+)(?:[ \u00a0]|$)/);
      if (!benutzt.has(k) && !imBild.has(k) && !teile.has(k) && !(b && hat(Number(b[1])) && hat(Number(b[2])))) M(`${v.roh} aus dem Text kommt im Nachweis nicht vor`);
    }
  }
  return m;
}
// Hat die Aufgabe ein Bild? Auf F braucht jede eines.
export const bruchHatBild = (a) => a.format === 'faerben' || Boolean(a.daten);
