// Prüft eine Aufgabenpool-Datei: Aufbau, Regeln der Niveaustufen (ADR 0015), Rechnungen und Bilder.
// Der Prüfer rechnet alles selbst nach und benutzt nichts aus den Erzeugern (tools/werkzeug.mjs, tools/aufgaben/).
// Aufruf: node tools/pruefe-pool.mjs [aufgabenpool/klasse-5.json]

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Liefert die Liste aller Fehler im Pool. Eine leere Liste heißt: in Ordnung.
export function pruefePool(pool) {
const fehler = [];
const melde = (id, text) => fehler.push(`${id}: ${text}`);

const NIVEAUS = ['F', 'G', 'M', 'E'];
const PRO_GRUPPE = 6;
const AFB_FOLGE = { F: [1, 1, 1, 1, 2, 1], G: [1, 1, 2, 1, 2, 3], M: [1, 2, 2, 1, 2, 3], E: [1, 2, 2, 3, 2, 3] };
const KARTEN = { F: ['tipp', 'beispiel', 'loesungsschritt'], G: ['tipp', 'beispiel', 'loesungsschritt'], M: ['tipp', 'loesungsschritt'], E: ['tipp'] };
const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };
const BILDER_JE_GRUPPE = { F: 6, G: 3 };
const FORMATE = ['zahl', 'zahlenstrahl', 'auswahl', 'luecken', 'tabelle', 'zuordnen', 'sachaufgabe', 'diagramm'];
const SCHLUESSEL = ['id', 'lernziel', 'niveau', 'afb', 'format', 'text', 'loesung', 'typischeFehler', 'hilfen', 'bild', 'nachweis', 'eingabe', 'strahl',
  'luecken', 'mehrfach', 'optionen', 'teile', 'paare', 'tabelle', 'ziffernfelder', 'einheit', 'diagramm'];
// Die Prüfung arbeitet auf einer Kopie, damit sie am Pool nichts verändert.

// ---------- Rechnen ----------
const zahlAus = (s) => Number(String(s).replace(/[\s\u00a0\u202f]/g, ''));
const NUM = '\\d+(?:\\u00a0\\d{3})*';
const ATOM = `[(\\[]*${NUM}[)\\]]*`;
const AUSDRUCK = `${ATOM}(?: [+−·:] ${ATOM})*`;
const zahlenIn = (s) => [...String(s).matchAll(new RegExp(NUM, 'g'))].map((m) => zahlAus(m[0]));
const norm = (s) => String(s).replace(/[\s\u00a0\u202f]/g, '');

// Rechnet einen Ausdruck aus Zahlen, +, −, ·, : und Klammern aus. NaN, wenn es kein Ausdruck ist oder eine Division nicht aufgeht.
function rechne(ausdruck) {
  const t = norm(ausdruck).replace(/\[/g, '(').replace(/\]/g, ')').match(/\d+|[+−·:()]|./g) ?? [];
  let i = 0;
  const faktor = () => {
    if (t[i] === '(') { i++; const w = strich(); if (t[i++] !== ')') return NaN; return w; }
    if (!/^\d+$/.test(t[i] ?? '')) return NaN;
    return Number(t[i++]);
  };
  const punkt = () => {
    let w = faktor();
    while (t[i] === '·' || t[i] === ':') {
      const z = t[i++], r = faktor();
      if (z === ':' && (r === 0 || w % r !== 0)) return NaN;
      w = z === '·' ? w * r : w / r;
    }
    return w;
  };
  const strich = () => {
    let w = punkt();
    while (t[i] === '+' || t[i] === '−') { const z = t[i++], r = punkt(); w = z === '+' ? w + r : w - r; }
    return w;
  };
  const w = strich();
  return i === t.length ? w : NaN;
}
const istAusdruck = (s) => new RegExp(`^${AUSDRUCK}$`).test(String(s).trim()) && !Number.isNaN(rechne(s));
const hatZeichen = (s) => /[+−·:]/.test(s);

// Alle Gleichungen in einem Text: „12 + 3 = 15“, „7 · 8 = 56 = 50 + 6“, „14 : 4 = 3 Rest 2“.
const EINHEITEN = /(?<=\d) (?:€|Euro|Cent|ct|cm|mm|km|m|kg|g|l|min|h|Einer|Zehner|Hunderter|Tausender)(?=[\s.,;:!?)]|$)/g;
const GLEICHUNG = new RegExp(`(?<! [+−·:=≈] )(?<![\\d▢_(\\[A-Za-zÄÖÜäöüß\\u00a0])(${AUSDRUCK})((?: = ${AUSDRUCK})+)(?: Rest (\\d+))?(?! ?[+−·:=▢_\\d]| Rest)`, 'g');
function gleichungenIn(text) {
  const t = String(text).replace(EINHEITEN, '');
  return [...t.matchAll(GLEICHUNG)].map((m) => ({ ganz: m[0], seiten: [m[1], ...m[2].split(' = ').slice(1)], rest: m[3] == null ? null : Number(m[3]), danach: t.slice(m.index + m[0].length, m.index + m[0].length + 1) }));
}
// Stimmt die Gleichung? Mit Rest: Dividend : Divisor = Quotient Rest r.
function stimmt(g) {
  if (g.rest != null) {
    const m = g.seiten.length === 2 && g.seiten[0].match(new RegExp(`^(${NUM}) : (${NUM})$`));
    if (!m) return false;
    const [a, d, q] = [zahlAus(m[1]), zahlAus(m[2]), rechne(g.seiten[1])];
    return d > 0 && g.rest < d && q * d + g.rest === a;
  }
  const werte = g.seiten.map(rechne);
  return werte.every((w) => !Number.isNaN(w) && w === werte[0]);
}
// Der Rechenausdruck, mit dem ein Text beginnt („574 + 277, denn …“).
const anfang = (text) => String(text).match(new RegExp(`^${AUSDRUCK}(?= = |[,.;]|$)`))?.[0] ?? null;
// Beginnt eine Antwort mit Zustimmung (true) oder Ablehnung (false)? Sonst null.
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nie|Stimmt nie|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false
  : /^(Stimmt|Richtig|Ja|Das stimmt immer)(?![a-zäöü])(?!, aber| nur)/.test(text) ? true : null);
const rundet = (a, b) => [10, 100, 1000, 10000].some((p) => Math.round(a / p) * p === b);

// ---------- Jahresplan ----------
const lernziele = new Map();
const kapitelVon = new Map();
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  if (lernziele.has(l.id)) melde(l.id, 'Lernziel-ID doppelt');
  lernziele.set(l.id, u);
  kapitelVon.set(l.id, k);
}
// Wörter, die erst ab einer höheren Stufe im Wortspeicher stehen. Es zählt die früheste Stufe im ganzen Kapitel.
const wortAb = new Map();
for (const k of pool.kapitel) {
  const ab = new Map();
  for (const u of k.unterkapitel) for (const w of u.wortspeicher ?? []) for (const wort of w.wort.split(' ')) {
    if (!ab.has(wort) || NIVEAUS.indexOf(w.ab) < NIVEAUS.indexOf(ab.get(wort))) ab.set(wort, w.ab);
  }
  wortAb.set(k.id, ab);
}
const B_ = 'A-Za-zÄÖÜäöüß';
const wortMuster = (wort) => (/^[A-ZÄÖÜ]/.test(wort)
  ? new RegExp(`(?<![${B_}])${wort}(?:e|en|n|s|es)?(?![${B_}])`)
  : new RegExp(wort.replace(/e?n$/, ''), 'i'));

// ---------- Einzelprüfungen ----------
const pruefeZahl = (id, a, was = 'Lösung') => {
  if (!Number.isInteger(a.loesung) || a.loesung < 0) melde(id, `${was} ist keine natürliche Zahl`);
  for (const f of a.typischeFehler ?? []) {
    if (f.wert === a.loesung) melde(id, 'typischer Fehler ist gleich der Lösung');
    if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  const werte = (a.typischeFehler ?? []).map((f) => f.wert);
  if (new Set(werte).size !== werte.length) melde(id, 'typischer Fehler doppelt');
};
const sichtbareTexte = (a) => [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.teile ?? []).map((t) => t.text), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts])];
const loesungenVon = (a) => [
  ...(typeof a.loesung === 'number' ? [a.loesung] : []),
  ...Object.values(a.luecken ?? {}).map((l) => l.loesung),
  ...(a.teile ?? []).map((t) => t.loesung),
];
const wertVon = (x) => (typeof x === 'object' && x !== null ? x.wert : x);
const istFrage = (x) => typeof x === 'object' && x !== null && x.frage === true;

function pruefeHilfen(a) {
  const soll = KARTEN[a.niveau] ?? [];
  for (const h of soll) if (!a.hilfen?.[h]?.trim()) melde(a.id, `Hilfekärtchen ${h} fehlt`);
  for (const h of Object.keys(a.hilfen ?? {})) if (!soll.includes(h)) melde(a.id, `Hilfekärtchen ${h} ist auf Niveaustufe ${a.niveau} nicht vorgesehen`);
  for (const [name, h] of Object.entries(a.hilfen ?? {})) for (const g of gleichungenIn(h)) {
    if (g.danach === '?') continue; // vorgeführte Rechnung, die geprüft werden soll („20 : 4 = 6?“)
    if (!stimmt(g)) melde(a.id, `Gleichung im Hilfekärtchen ${name} stimmt nicht: ${g.ganz}`);
  }
}

const NEBENSATZ = /,\s(weil|dass|wenn|damit|obwohl|sodass|ob|der|die|das|denen|deren)\s/;
function pruefeSprache(a) {
  const stufe = NIVEAUS.indexOf(a.niveau);
  const texte = sichtbareTexte(a), mitHilfen = [...texte, ...Object.values(a.hilfen ?? {})];
  // Wortschatz: keine Fachwörter höherer Stufen, auch nicht in den Hilfekärtchen.
  for (const [wort, ab] of wortAb.get(kapitelVon.get(a.lernziel)?.id) ?? []) if (NIVEAUS.indexOf(ab) > stufe) {
    const muster = wortMuster(wort);
    const stelle = mitHilfen.find((t) => muster.test(t));
    if (stelle) melde(a.id, `Wort „${wort}“ steht erst ab Niveaustufe ${ab} im Wortspeicher („${stelle.replace(/\n/g, ' / ').slice(0, 70)}“)`);
  }
  if (stufe === 0 && mitHilfen.some((t) => /schriftlich/i.test(t))) melde(a.id, 'auf F wird nicht schriftlich gerechnet');
  // Einfache Sprache auf F und G: kurze Sätze, jeder Satz in einer eigenen Zeile, keine Nebensätze.
  if (stufe <= 1) for (const t of texte) for (const zeile of t.split('\n')) {
    const saetze = zeile.replace(/\{\{\w+\}\}/g, 'x').split(/(?<=[.?!])\s+(?=[A-ZÄÖÜ„])/).filter(Boolean);
    if (saetze.length > 1) melde(a.id, `einfache Sprache: mehrere Sätze in einer Zeile („${zeile}“)`);
    if (zeile.split(/\s+/).filter((w) => /[\dA-Za-zÄÖÜäöüß]/.test(w)).length > 14) melde(a.id, `einfache Sprache: Zeile mit mehr als 14 Wörtern („${zeile}“)`);
    if (NEBENSATZ.test(zeile)) melde(a.id, `einfache Sprache: Nebensatz („${zeile}“)`);
  }
}

// Zahlenraum (ADR 0015): Die Zahlengröße trennt die Stufen nicht, aber F bleibt im Hunderterraum.
function pruefeZahlenraum(a) {
  const kapitel = kapitelVon.get(a.lernziel)?.id;
  const stufe = NIVEAUS.indexOf(a.niveau);
  const raster = a.tabelle?.art === 'raster';
  const zahlen = [...[a.text, ...(a.teile ?? []).map((t) => t.text), ...(a.optionen ?? []).filter((o) => o.richtig).map((o) => o.text)].flatMap(zahlenIn), ...(raster ? [...a.tabelle.rechnung.zahlen, a.tabelle.rechnung.ergebnis] : loesungenVon(a))];
  for (const n of zahlen) {
    let ok = true;
    if (kapitel === '5.3') ok = stufe === 0 ? n <= (raster ? 999 : 100) : n <= 20000;
    if (kapitel === '5.4') ok = stufe === 0 ? n <= 100 || (n <= 1000 && n % 10 === 0) : stufe === 1 ? n <= 1000 : n <= 10000;
    if (!ok) melde(a.id, `Zahl ${n} liegt außerhalb des Zahlenraums der Niveaustufe ${a.niveau}`);
  }
}

// Zahlen im Aufgabentext, die zur Rechnung gehören. Zählwörter des Auftrags („in 2 Schritten“, „Klasse 5a“, „1 Kind“) gehören nicht dazu.
const OHNE_RECHENWERT = /\d+ Schritten|\d+-mal|auf \d+ Wegen|[Ww]elche \d+ (?:Zahlen|Aufgaben)|erst \d+ Zahlen|Weg \d+|\d+[a-d](?![a-zäöü])|\d+ Uhr|in \d+ Klassen|aus \d+ Feldern|\d+er-|(?<![\d\u00a0])1 (?=[A-ZÄÖÜ])/g;
const textZahlen = (a) => [a.text, ...(a.teile ?? []).map((t) => t.text)].flatMap((t) => zahlenIn(t.replace(OHNE_RECHENWERT, ' ')));

// ---------- Nachweis ----------
// Sonderfälle, die sich nicht als einzelne Rechnung schreiben lassen. Jede Art wird hier durch Ausprobieren aller Fälle bestätigt.
const permutationen = (liste) => (liste.length <= 1 ? [liste] : liste.flatMap((x, i) => permutationen([...liste.slice(0, i), ...liste.slice(i + 1)]).map((p) => [x, ...p])));
const kombinationen = (anzahl) => (anzahl === 0 ? [[]] : kombinationen(anzahl - 1).flatMap((k) => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((z) => [...k, z])));
const einsetzen = (muster, ziffern) => { let i = 0; return muster.replace(/▢/g, () => ziffern[i++]); };
const gleich = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SONDER = {
  // Ziffernrätsel: Genau eine Belegung der Kästchen macht die Rechnung wahr.
  ziffern: (n, a) => {
    const g = gleichungenIn(n.muster.replace(/▢/g, '0'));
    if (g.length !== 1) return 'Muster ist keine Rechnung';
    const passend = kombinationen((n.muster.match(/▢/g) ?? []).length).filter((k) => { const [l, r] = einsetzen(n.muster, k).split(' = ').map(rechne); return l === r; });
    if (passend.length !== 1 || !gleich(passend[0], n.ziffern)) return `Ziffernrätsel hat die Lösungen ${JSON.stringify(passend)}`;
    if (!norm(a.text.replace(/\{\{\w+\}\}/g, '▢')).includes(norm(n.muster))) return 'Muster steht nicht im Text';
    if (!gleich(Object.values(a.luecken ?? {}).map((l) => l.loesung), n.ziffern)) return 'Lücken passen nicht zu den Ziffern';
    return null;
  },
  extremzahlen: (n) => {
    const alle = permutationen(n.ziffern).filter((p) => p[0] !== 0).map((p) => Number(p.join('')));
    return Math.max(...alle) === n.gross && Math.min(...alle) === n.klein ? null : 'größte oder kleinste Zahl falsch';
  },
  kleinsteDifferenz: (n, a) => {
    const alle = permutationen(n.ziffern).filter((p) => p[0] !== 0 && p[2] !== 0).map((p) => Math.abs(p[0] * 10 + p[1] - p[2] * 10 - p[3]));
    return Math.min(...alle) === n.differenz ? null : `kleinste Differenz ist ${Math.min(...alle)}`;
  },
  zwischen: (n, a) => {
    const w = rechne(n.ausdruck);
    if (Number.isNaN(w) && !/:/.test(n.ausdruck)) return 'Ausdruck lässt sich nicht berechnen';
    const [x, d] = n.ausdruck.split(' : ').map(zahlAus);
    const liegt = Number.isNaN(w) ? x > n.von * d && x < n.bis * d : w > n.von && w < n.bis;
    if (liegt !== n.gilt) return `„${n.ausdruck} liegt zwischen ${n.von} und ${n.bis}“ ist ${liegt ? 'wahr' : 'falsch'}`;
    const o = (a.optionen ?? []).find((x_) => norm(x_.text) === norm(n.ausdruck));
    if (o && o.richtig !== n.gilt) return `Option „${o.text}“ ist falsch eingestuft`;
    return null;
  },
  // Jede Antwort ist eine Gleichung. Richtig ist sie genau dann, wenn beide Seiten gleich sind.
  gleichungen: (n, a) => {
    // Mit falsche: true ist die Antwort richtig, deren Gleichung nicht stimmt („Welche Rechnung ist falsch?“).
    const soll = (o) => (n.falsche ? !o.richtig : o.richtig);
    for (const o of a.optionen ?? []) {
      const seiten = o.text.split(' = ');
      if (seiten.length !== 2 || seiten.some((s) => Number.isNaN(rechne(s)))) {
        const g = gleichungenIn(o.text);
        if (g.length !== 1 || stimmt(g[0]) !== soll(o)) return `Gleichung „${o.text}“ ist falsch eingestuft oder nicht lesbar`;
      } else if ((rechne(seiten[0]) === rechne(seiten[1])) !== soll(o)) return `Gleichung „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Jede Antwort ist ein Rechenausdruck. Richtig ist er genau dann, wenn er den Wert hat.
  wert: (n, a) => {
    for (const o of a.optionen ?? []) {
      const w = rechne(anfang(o.text) ?? '');
      if (Number.isNaN(w)) { if (o.richtig) return `Antwort „${o.text}“ ist kein Rechenausdruck`; continue; }
      if ((w === n.wert) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  anzahlProdukte: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) for (let y = n.von ?? 1; y <= n.bis; y++) if (x * y === n.produkt) k++;
    return k === n.anzahl ? null : `es gibt ${k} Aufgaben mit dem Ergebnis ${n.produkt}`;
  },
  anzahlTeiler: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) if (n.zahl % x === 0) k++;
    return k === n.anzahl ? null : `${n.zahl} hat ${k} Teiler bis ${n.bis}`;
  },
  ziffernTeilbar: (n, a) => {
    const passend = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((z) => Number(n.muster.replace('▢', z)) % n.durch === 0);
    if (!gleich(passend, n.ziffern)) return `passende Ziffern sind ${passend}`;
    if (n.anzahl != null && n.anzahl !== passend.length) return 'Anzahl der Ziffern falsch';
    if (n.anzahl == null && passend.length !== 1) return 'Ziffer ist nicht eindeutig';
    return a.text.includes(n.muster) ? null : 'Muster steht nicht im Text';
  },
  ziffernZahlen: (n) => {
    const k = permutationen(n.ziffern).filter((p) => p[0] !== 0 && Number(p.join('')) % n.durch === 0).length;
    return k === n.anzahl ? null : `${k} Zahlen sind teilbar`;
  },
  // Größtes Vielfaches bis zur Grenze (999) oder kleinstes ab der Grenze (1000).
  grenzVielfaches: (n) => {
    const w = n.grenze % 10 === 9 ? Math.floor(n.grenze / n.durch) * n.durch : Math.ceil(n.grenze / n.durch) * n.durch;
    return w === n.zahl ? null : `gesuchtes Vielfaches ist ${w}`;
  },
  vielfachesZwischen: (n) => {
    const alle = [];
    for (let x = n.von + 1; x < n.bis; x++) if (x % n.durch === 0) alle.push(x);
    return alle.length === 1 && alle[0] === n.zahl ? null : `Vielfache dazwischen: ${alle}`;
  },
  grenzRest: (n) => {
    let x = n.grenze;
    while (x % n.durch !== n.rest) x--;
    return x === n.zahl && n.rest < n.durch ? null : `gesuchte Zahl ist ${x}`;
  },
  anzahlMitRest: (n) => {
    let k = 0;
    for (let x = n.von ?? 1; x <= n.bis; x++) if (x % n.durch === n.rest) k++;
    return k === n.anzahl && n.rest < n.durch ? null : `es sind ${k} Zahlen`;
  },
  kleinsteMitResten: (n) => {
    if (n.bedingungen.some(([m, r]) => r >= m)) return 'Rest ist nicht kleiner als der Divisor';
    let x = 1;
    while (!n.bedingungen.every(([m, r]) => x % m === r) && x < 100000) x++;
    return x === n.zahl ? null : `kleinste Zahl ist ${x}`;
  },
  teilerZwischen: (n) => {
    const alle = [];
    for (let x = n.von + 1; x < n.bis; x++) if (n.zahl % x === 0) alle.push(x);
    return alle.length === 1 && alle[0] === n.teiler ? null : `Teiler dazwischen: ${alle}`;
  },
  // Genau ein Zahlenpaar von 1 bis 10 hat dieses Produkt und diese Summe.
  zahlenpaar: (n) => {
    const alle = [];
    for (let x = 1; x <= 10; x++) for (let y = x; y <= 10; y++) if (x * y === n.produkt && x + y === n.summe) alle.push([x, y]);
    return alle.length === 1 && gleich(alle[0], n.paar) ? null : `Paare: ${JSON.stringify(alle)}`;
  },
  // Urteil über eine Behauptung: „Stimmt das?“ Mit Rechnung wird nachgerechnet, ob das behauptete Ergebnis stimmt.
  // Die richtige Antwort muss mit dem passenden Wort beginnen (Stimmt, Richtig, Ja oder Falsch, Nein).
  urteil: (n, a) => {
    if (typeof n.stimmt !== 'boolean') return 'stimmt fehlt';
    if (n.rechnung != null) {
      if (n.rest != null) {
        const [x, d] = n.rechnung.split(' : ').map(zahlAus);
        if ((n.behauptet * d + n.rest === x && n.rest < d) !== n.stimmt) return `„${n.rechnung} = ${n.behauptet} Rest ${n.rest}“ ist ${n.stimmt ? 'falsch' : 'richtig'}`;
      } else {
        const w = rechne(n.rechnung);
        if (Number.isNaN(w)) return 'Rechnung lässt sich nicht berechnen';
        if ((w === n.behauptet) !== n.stimmt) return `„${n.rechnung} = ${n.behauptet}“ ist ${w === n.behauptet ? 'richtig' : 'falsch'}`;
      }
      const imText = new Set(zahlenIn(a.text));
      for (const z of [...zahlenIn(n.rechnung), n.behauptet, ...(n.rest != null ? [n.rest] : [])]) if (!imText.has(z)) return `${z} steht nicht im Text`;
    }
    for (const o of a.optionen ?? []) {
      const p = polaritaet(o.text);
      if (o.richtig && p !== null && p !== n.stimmt) return `richtige Antwort „${o.text.slice(0, 30)}“ passt nicht zum Urteil`;
    }
    // Ist die Rechnung falsch, nennt genau die richtige Antwort das richtige Ergebnis.
    if (n.rechnung != null && !n.stimmt) {
      const [x, d] = n.rechnung.split(' : ').map(zahlAus);
      const soll = n.rest != null ? [Math.floor(x / d), x % d] : [rechne(n.rechnung)];
      const nenntEs = (o) => soll.every((z) => zahlenIn(o.text).includes(z));
      // Nennt keine Antwort das genaue Ergebnis (Überschlag), entfällt die Regel.
      if ((a.optionen ?? []).some(nenntEs)) for (const o of a.optionen) {
        const nennt = nenntEs(o);
        if (nennt !== o.richtig) return o.richtig ? `richtige Antwort nennt das richtige Ergebnis ${soll.join(' Rest ')} nicht` : `falsche Antwort „${o.text.slice(0, 30)}“ nennt das richtige Ergebnis`;
      }
    }
    return null;
  },
  // Antworten der Form „7 und 3“: Richtig ist das Paar mit der Zielsumme.
  paarsumme: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(/^(\d+) und (\d+)$/);
      if (!m) return `Antwort „${o.text}“ ist kein Zahlenpaar`;
      if ((Number(m[1]) + Number(m[2]) === n.ziel) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „8 + 2 und 2 + 8“: Richtig ist das Paar mit gleichem Wert.
  gleicheWerte: (n, a) => {
    for (const o of a.optionen ?? []) {
      const [l, r] = o.text.split(' und ').map(rechne);
      if (Number.isNaN(l) || Number.isNaN(r)) return `Antwort „${o.text}“ besteht nicht aus zwei Rechnungen`;
      if ((l === r) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „6956 : 65“: Richtig ist die Aufgabe, deren Quotient über der Grenze liegt.
  quotientUeber: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(new RegExp(`^(${NUM}) : (${NUM})$`));
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((zahlAus(m[1]) > n.grenze * zahlAus(m[2])) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „6111 : 28“: Richtig ist die Aufgabe, deren Zahlen auf die führende Stelle gerundet den Überschlag ergeben.
  ueberschlagVon: (n, a) => {
    const fuehrend = (x) => { const p = 10 ** (String(x).length - 1); return Math.round(x / p) * p; };
    for (const o of a.optionen ?? []) {
      const m = o.text.match(new RegExp(`^(${NUM}) : (${NUM})$`));
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((fuehrend(zahlAus(m[1])) === n.dividend && fuehrend(zahlAus(m[2])) === n.divisor) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Antworten der Form „14 : 5“: Richtig ist die Aufgabe, bei der ein Rest bleibt.
  restBleibt: (n, a) => {
    for (const o of a.optionen ?? []) {
      const m = o.text.match(/^(\d+) : (\d+)$/);
      if (!m) return `Antwort „${o.text}“ ist keine Geteilt-Aufgabe`;
      if ((Number(m[1]) % Number(m[2]) !== 0) !== o.richtig) return `Antwort „${o.text}“ ist falsch eingestuft`;
    }
    return null;
  },
  // Jede Antwort ist eine Zahl. Richtig ist sie genau dann, wenn die Eigenschaft (nicht) zutrifft.
  zahlenwahl: (n, a) => {
    const TEST = {
      teilt: (x) => n.zahl % x === 0,
      einmaleins: (x) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some((u) => x % u === 0 && x / u <= 10),
      rest: (x) => x < n.durch,
    };
    if (!TEST[n.eigenschaft]) return 'unbekannte Eigenschaft';
    for (const o of a.optionen ?? []) {
      if (!/^\d+$/.test(o.text)) return `Antwort „${o.text}“ ist keine Zahl`;
      if ((TEST[n.eigenschaft](Number(o.text)) === n.gilt) !== o.richtig) return `Antwort ${o.text} ist falsch eingestuft`;
    }
    return null;
  },
  // Die Antworten beginnen mit einem Rechenausdruck. Richtig ist der mit dem größten (kleinsten) Wert.
  extrem: (n, a) => {
    const werte = (a.optionen ?? []).map((o) => ({ o, w: rechne(anfang(o.text) ?? '') })).filter((x) => !Number.isNaN(x.w));
    if (werte.length < 2) return 'zu wenige Rechenausdrücke';
    const ziel = n.was === 'groesstes' ? Math.max(...werte.map((x) => x.w)) : Math.min(...werte.map((x) => x.w));
    if (werte.filter((x) => x.w === ziel).length !== 1) return 'zwei Antworten haben denselben Wert';
    for (const { o, w } of werte) if ((w === ziel) !== o.richtig) return `Antwort „${o.text.slice(0, 30)}“ ist falsch eingestuft`;
    for (const o of a.optionen) if (o.richtig && Number.isNaN(rechne(anfang(o.text) ?? ''))) return 'richtige Antwort ist kein Rechenausdruck';
    return null;
  },
  // Genau eine Art, das Ziel aus Vielfachen der beiden Werte zusammenzusetzen (Dartscheibe).
  kombination: (n) => {
    const alle = [];
    for (let x = 0; x * n.werte[0] <= n.ziel; x++) for (let y = 0; x * n.werte[0] + y * n.werte[1] <= n.ziel; y++) if (x * n.werte[0] + y * n.werte[1] === n.ziel) alle.push([x, y]);
    return alle.length === 1 && gleich(alle[0], n.anzahl) ? null : `Möglichkeiten: ${JSON.stringify(alle)}`;
  },
  // Welche der Aufgaben braucht beim schriftlichen Rechnen einen Übertrag?
  uebertrag: (n) => {
    const braucht = ([x, y]) => {
      let u = 0, je = false;
      for (; x > 0 || y > 0; x = Math.floor(x / 10), y = Math.floor(y / 10)) {
        u = n.zeichen === '+' ? (x % 10 + y % 10 + u >= 10 ? 1 : 0) : (x % 10 < y % 10 + u ? 1 : 0);
        if (u) je = true;
      }
      return je;
    };
    return gleich(n.aufgaben.map(braucht), n.mit) ? null : `Überträge: ${n.aufgaben.map(braucht)}`;
  },
  // Nach wie vielen Schritten liegt der Betrag zum ersten Mal unter der Grenze?
  ersteUnterschreitung: (n) => {
    let k = 0, x = n.start;
    while (x >= n.grenze && x - n.schritt >= 0) { x -= n.schritt; k++; }
    return x < n.grenze && k === n.anzahl ? null : `es sind ${k} Schritte`;
  },
  quadrat: (n) => {
    const alle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((x) => x * x === n.zahl);
    return alle.length === 1 && alle[0] === n.wurzel ? null : 'keine Quadratzahl';
  },
  // Überschlag mit einer glatten Zahl in der Nähe, die nicht durch Runden entsteht (963 : 3 mit 900 : 3).
  naheBei: (n) => {
    const stellen = String(n.rund).replace(/0+$/, '').length;
    return stellen <= 2 && Math.abs(n.zahl - n.rund) / n.zahl <= 0.15 ? null : `${n.rund} ist keine glatte Zahl nahe bei ${n.zahl}`;
  },
};
// Was eine Sonderprüfung als Ergebnis bestätigt. Nur das zählt als Lösung, nicht jede Zahl in der Beschreibung.
const ERGEBNIS = {
  kleinsteDifferenz: (n) => n.differenz,
  ziffern: (n) => n.ziffern, extremzahlen: (n) => [n.gross, n.klein], anzahlProdukte: (n) => n.anzahl, anzahlTeiler: (n) => n.anzahl,
  ziffernTeilbar: (n) => n.anzahl ?? n.ziffern, ziffernZahlen: (n) => n.anzahl, grenzVielfaches: (n) => n.zahl, vielfachesZwischen: (n) => n.zahl,
  grenzRest: (n) => n.zahl, anzahlMitRest: (n) => n.anzahl, kleinsteMitResten: (n) => n.zahl, teilerZwischen: (n) => n.teiler,
  kombination: (n) => n.anzahl, uebertrag: (n) => n.aufgaben.filter((_, i) => n.mit[i]).map((x) => x[0]), ersteUnterschreitung: (n) => n.anzahl, quadrat: (n) => n.wurzel, zahlenpaar: (n) => n.paar,
};
const zahlenImObjekt = (x) => (typeof x === 'number' ? [x] : typeof x === 'string' ? zahlenIn(x) : x && typeof x === 'object' ? Object.values(x).flatMap(zahlenImObjekt) : []);

// Zahlen, die ein Bild zeigt (ohne die Unbekannten).
function bildZahlen(b) {
  if (!b) return [];
  const w = (x) => (istFrage(x) ? [] : [wertVon(x)]);
  switch (b.art) {
    case 'stellenwerttafel': return [...b.plaettchen, b.plaettchen.reduce((s, x, i) => s + x * 10 ** (b.plaettchen.length - 1 - i), 0)];
    case 'zehnermaterial': {
      const wert = (m) => 100 * m.h + 10 * m.z + m.e;
      return [b.h, b.z, b.e, wert(b), 10 * b.z, 100 * b.h, ...(b.weg ? [b.weg.h, b.weg.z, b.weg.e, wert(b.weg), wert(b) - wert(b.weg)] : [])];
    }
    case 'punktefeld': return [b.reihen, b.spalten, b.reihen * b.spalten, ...(b.trenn ? [b.trenn, b.reihen - b.trenn, b.trenn * b.spalten, (b.reihen - b.trenn) * b.spalten] : [])];
    case 'mengenbild': return [b.anzahl, b.weg ?? 0, b.dazu ?? 0, b.anzahl + (b.dazu ?? 0), b.anzahl + (b.dazu ?? 0) - (b.weg ?? 0)];
    case 'gruppenbild': return [b.gruppen, b.je, b.rest ?? 0, b.gruppen * b.je, b.gruppen * b.je + (b.rest ?? 0)];
    case 'streifen': return [...w(b.ganz), ...b.teile.flatMap(w)];
    case 'vergleich': return [...w(b.oben.wert), ...w(b.unten.wert), ...w(b.unterschied)];
    case 'zehnerfeld': return [b.felder, b.belegt, b.dazu ?? 0, b.belegt + (b.dazu ?? 0), b.felder - b.belegt];
    case 'zahlenstrahl': return [b.von, b.bis, ...(b.start != null ? [b.start] : []), ...(b.spruenge ?? []).flatMap((s) => [s.von, s.nach, Math.abs(s.nach - s.von)])];
    default: return [];
  }
}

function pruefeNachweis(a) {
  const pflicht = ['zahl', 'luecken', 'tabelle', 'sachaufgabe'].includes(a.format);
  if (!a.nachweis) {
    if (pflicht) melde(a.id, 'Nachweis fehlt');
    if ((a.optionen ?? []).some((o) => polaritaet(o.text) !== null) && !a.begriffGeprueft) melde(a.id, 'Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
    return;
  }
  if (!Array.isArray(a.nachweis) || a.nachweis.length === 0) { melde(a.id, 'Nachweis ist leer'); return; }
  const loesungen = loesungenVon(a);
  // Bekannt ist, was die Aufgabe zeigt: Text, Antworten, Tabelle, Diagramm, Zahlenstrahl, Bild. Dazu 10, 100, 1000.
  // Die Lösung selbst ist nicht bekannt: Sie muss als Ergebnis einer Rechnung aus bekannten Zahlen entstehen.
  // Ausnahme Lücken und Tabellen: Dort werden die Lösungen in den Text eingesetzt und jede Gleichung geprüft (pruefeFormat).
  const frei = a.format === 'auswahl' || a.format === 'zuordnen'; // Beispiele zu einer allgemeinen Aussage sind frei wählbar
  const eingesetzt = a.format === 'luecken' ? a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => a.luecken?.[n]?.loesung ?? '?') : '';
  const bekannt = new Set([10, 100, 1000, ...sichtbareTexte(a).flatMap(zahlenIn), ...bildZahlen(a.bild),
    ...zahlenImObjekt(a.tabelle), ...zahlenImObjekt(a.diagramm), ...zahlenImObjekt(a.strahl), ...zahlenIn(eingesetzt),
    ...(['luecken', 'tabelle'].includes(a.format) ? loesungen : []),
    // Ab M gehören kleine Zahlen zum Text („doppelt“, „dreimal“, „die Hälfte“).
    ...(NIVEAUS.indexOf(a.niveau) >= 2 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [])]);
  const gegeben = new Set(bekannt);
  const ergebnisse = new Set();
  const vorkommen = new Set();
  const offen = [];
  for (const n of a.nachweis) {
    if (typeof n === 'object' && n !== null) {
      if (n.art == null) {
        if (typeof n.zahl !== 'number' || !n.grund) melde(a.id, 'Nachweis: Hilfszahl ohne Zahl oder Grund');
        if (loesungen.includes(n.zahl) && a.format !== 'luecken') melde(a.id, 'Nachweis: Die Lösung darf keine Hilfszahl sein');
        bekannt.add(n.zahl);
        continue;
      }
      const pruefe = SONDER[n.art];
      if (!pruefe) { melde(a.id, `Nachweis: unbekannte Art ${n.art}`); continue; }
      const meldung = pruefe(n, a);
      if (meldung) melde(a.id, `Nachweis ${n.art}: ${meldung}`);
      for (const z of zahlenImObjekt(n)) { bekannt.add(z); vorkommen.add(z); }
      for (const z of [ERGEBNIS[n.art]?.(n) ?? []].flat()) ergebnisse.add(z);
      continue;
    }
    if (n.includes('≈')) {
      const [l, r] = n.split(' ≈ ');
      const [x, y] = [zahlAus(l), zahlAus(r)];
      if (!/^[\d\u00a0]+$/.test(l) || !/^[\d\u00a0]+$/.test(r) || !rundet(x, y)) melde(a.id, `Nachweis: ${n} ist nicht richtig gerundet`);
      offen.push({ n, ein: [x], aus: [y], wert: y });
      continue;
    }
    // Division mit Rest: „14 : 4 = 3 Rest 2“. Quotient und Rest sind die Ergebnisse.
    const mr = n.match(new RegExp(`^(${NUM}) : (${NUM}) = (${NUM}) Rest (${NUM})$`));
    if (mr) {
      const [x, d, q, r] = mr.slice(1).map(zahlAus);
      if (!(d > 0) || r >= d || q * d + r !== x) melde(a.id, `Nachweis: „${n}“ stimmt nicht`);
      offen.push({ n, ein: [x, d], aus: [x, d, q, r], wert: q, werte: [q, r] });
      continue;
    }
    const seiten = n.split(' = ');
    const werte = seiten.map(rechne);
    if (seiten.length < 2 || werte.some((w) => Number.isNaN(w))) { melde(a.id, `Nachweis: „${n}“ ist keine Rechnung`); continue; }
    if (werte.some((w) => w !== werte[0])) melde(a.id, `Nachweis: „${n}“ stimmt nicht (${werte.join(' und ')})`);
    if (werte[0] < 0) melde(a.id, `Nachweis: „${n}“ hat ein negatives Ergebnis`);
    offen.push({ n, ein: zahlenIn(seiten[0]), aus: zahlenIn(n), wert: werte[0] });
  }
  // Zeilen der Reihe nach auflösen: Eine Rechnung zählt, sobald alle ihre Zahlen bekannt sind. Ihr Ergebnis ist danach bekannt.
  for (let weiter = true; weiter;) {
    weiter = false;
    for (const z of offen) if (!z.fertig && (frei || z.ein.every((x) => bekannt.has(x)))) {
      z.fertig = true; weiter = true;
      for (const x of z.aus) { bekannt.add(x); vorkommen.add(x); }
      for (const w of z.werte ?? [z.wert]) ergebnisse.add(w);
    }
  }
  // Ein zweiter Rechenweg mit Hilfszahlen (400 + 213 − 3 statt 397 + 213) zählt, wenn er zu einem schon bestätigten Ergebnis führt.
  for (const z of offen) if (!z.fertig) {
    if (ergebnisse.has(z.wert) || bekannt.has(z.wert)) { for (const x of z.aus) vorkommen.add(x); continue; }
    melde(a.id, `Nachweis: ${z.ein.filter((x) => !bekannt.has(x)).join(', ')} kommt in der Aufgabe nicht vor (${z.n})`);
  }
  // Jede Lösung muss sich aus dem Nachweis ergeben.
  if (a.tabelle?.art === 'raster') return;
  for (const l of loesungen) {
    const menge = ['zahl', 'sachaufgabe', 'diagramm', 'zahlenstrahl'].includes(a.format) ? ergebnisse : vorkommen;
    if (!menge.has(l)) melde(a.id, `Lösung ${l} ergibt sich nicht aus dem Nachweis`);
  }
  // Lücken ohne eigene Gleichung: Fragt die Lücke nach einem Fachbegriff („Der erste Summand ist ▢“), zählt die Gleichung im Text. Sonst muss die Zahl ein Ergebnis im Nachweis sein.
  for (const n of a.lueckenOhneGleichung ?? []) {
    const wert = a.luecken[n].loesung;
    const g = a.text.match(new RegExp(`(${NUM}) ([+−·:]) (${NUM}) = (${NUM})`));
    const frage = a.text.match(new RegExp(`(erste |zweite )?(${Object.values(BEGRIFFE).flat().join('|')}) ist \\{\\{${n}\\}\\}\\.?(\n|$)`));
    if (g && frage && gleichungenIn(a.text).length === 1) {
      const namen = BEGRIFFE[g[2]], zahlen = [zahlAus(g[1]), zahlAus(g[3]), zahlAus(g[4])];
      const stelle = frage[1] === 'zweite ' ? 1 : namen.indexOf(frage[2]);
      if (namen[stelle] !== frage[2] || zahlen[stelle] !== wert) melde(a.id, `Lücke ${n}: ${frage[2]} ist ${zahlen[stelle] ?? 'in der Gleichung nicht zu finden'}, nicht ${wert}`);
    } else if (!ergebnisse.has(wert)) melde(a.id, `Lücke ${n}: ${wert} ist kein Ergebnis im Nachweis`);
  }
  // Die Lösung ist das Endergebnis, kein Zwischenergebnis: Sie wird nicht in einer späteren Rechnung zu etwas Neuem weiterverrechnet.
  if (a.format === 'zahl' && !a.nachweis.some((n) => typeof n === 'object' && [ERGEBNIS[n.art]?.(n) ?? []].flat().includes(a.loesung))) {
    const zeilen = offen.filter((z) => z.fertig);
    const stellen = zeilen.map((z, i) => ((z.werte ?? [z.wert]).includes(a.loesung) ? i : -1)).filter((i) => i >= 0);
    const weiter = (i) => zeilen.slice(i + 1).some((z) => z.ein.includes(a.loesung) && !gegeben.has(z.wert) && z.wert !== a.loesung);
    if (stellen.length && stellen.every(weiter)) melde(a.id, `Lösung ${a.loesung} ist im Nachweis nur ein Zwischenergebnis`);
  }
  // Jede Zahl aus dem Text gehört zur Rechnung: Sie steht im Nachweis oder im Bild, oder sie ist als Hilfszahl mit Grund genannt.
  const benutzt = new Set([...zahlenImObjekt(a.nachweis), ...bildZahlen(a.bild), ...zahlenImObjekt(a.tabelle), ...zahlenImObjekt(a.diagramm), ...zahlenImObjekt(a.strahl)]);
  const mitUrteil = a.nachweis.some((n) => n?.art === 'urteil');
  if (!mitUrteil) for (const z of textZahlen(a)) if (!benutzt.has(z)) melde(a.id, `Zahl ${z} aus dem Text kommt im Nachweis nicht vor`);
  for (const o of (a.optionen ?? []).filter((x) => x.richtig && /^[\d\u00a0]+$/.test(x.text))) {
    if (!vorkommen.has(zahlAus(o.text))) melde(a.id, `richtige Antwort ${o.text} ergibt sich nicht aus dem Nachweis`);
  }
  if (a.format === 'auswahl') pruefeAuswahlNachweis(a, ergebnisse);
  // Steht im Text eine Gleichung mit Platzhalter („15 : ▢ = 3“), muss sie mit der eingesetzten Lösung stimmen.
  if (a.format === 'zahl' && (a.text.match(/▢/g) ?? []).length === 1) {
    for (const zeile of a.text.split('\n').filter((z) => z.includes('▢') && z.includes(' = '))) {
      const g = gleichungenIn(zeile.replace('▢', String(a.loesung)));
      if (g.length === 1 && !stimmt(g[0])) melde(a.id, `Mit der Lösung ${a.loesung} stimmt „${zeile.trim()}“ nicht`);
    }
  }
  // Steht im Text eine fertige Rechnung, muss sie im Nachweis vorkommen oder direkt die Lösung sein.
  if (a.format === 'zahl') {
    const imNachweis = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? n.split(/ [=≈] /).map(norm) : n.ausdruck ? [norm(n.ausdruck)] : [])));
    const gerundet = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' && n.includes('≈') ? [zahlAus(n.split(' ≈ ')[0])] : n.art === 'naheBei' ? [n.zahl] : [])));
    for (const zeile of a.text.split('\n')) {
      if (/[▢]|\{\{/.test(zeile)) continue;
      for (const m of zeile.replace(EINHEITEN, '').matchAll(new RegExp(`(?<! [+−·:=] )(?<![\\d▢(\\[])${AUSDRUCK}`, 'g'))) {
        if (!hatZeichen(m[0])) continue;
        // Beim Überschlag wird nicht die Rechnung aus dem Text gerechnet, sondern die gerundete.
        if (zahlenIn(m[0]).some((z) => gerundet.has(z))) continue;
        const klammern = (t) => norm(t).replace(/\[/g, '(').replace(/\]/g, ')');
        if (![...imNachweis].some((n) => klammern(n).includes(klammern(m[0]))) && rechne(m[0]) !== a.loesung) melde(a.id, `Rechnung „${m[0]}“ aus dem Text fehlt im Nachweis`);
      }
    }
  }
}

// Auswahlaufgaben: Die richtige Antwort muss an den Nachweis gebunden sein.
const ARTEN_AUSWAHL = ['quotientUeber', 'ueberschlagVon', 'wert', 'gleichungen', 'zwischen', 'extrem', 'zahlenwahl', 'urteil', 'paarsumme', 'gleicheWerte', 'restBleibt'];
function pruefeAuswahlNachweis(a, ergebnisse) {
  const arten = a.nachweis.filter((n) => typeof n === 'object').map((n) => n.art);
  const gebunden = arten.some((x) => ARTEN_AUSWAHL.includes(x));
  const richtige = a.optionen.filter((o) => o.richtig);
  // Zahlen in der richtigen Antwort stehen im Text oder im Nachweis.
  const erlaubt = new Set([...zahlenIn(a.text), ...zahlenImObjekt(a.nachweis), ...bildZahlen(a.bild)]);
  // Rechnet eine Sonderart jede Antwort selbst nach, sind deren Zahlen schon geprüft.
  const selbstGeprueft = arten.some((x) => ['gleichungen', 'wert', 'extrem', 'zahlenwahl', 'paarsumme', 'gleicheWerte', 'restBleibt', 'quotientUeber', 'ueberschlagVon'].includes(x));
  if (!selbstGeprueft) for (const o of richtige) for (const z of zahlenIn(o.text)) if (!erlaubt.has(z)) melde(a.id, `Zahl ${z} in der richtigen Antwort kommt weder im Text noch im Nachweis vor`);
  // Antworten mit Zustimmung oder Ablehnung brauchen ein Urteil.
  if (a.optionen.some((o) => polaritaet(o.text) !== null) && !arten.includes('urteil') && !a.begriffGeprueft) melde(a.id, 'Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
  if (gebunden || a.mehrfach) return;
  const seiten = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? n.split(/ [=≈] /).map(norm) : [])));
  const ersteSeiten = new Set(a.nachweis.flatMap((n) => (typeof n === 'string' ? [norm(n.split(/ [=≈] /)[0])] : [])));
  // Reine Rechenausdrücke: Nur der richtige steht im Nachweis. Werden auch die falschen nachgerechnet, braucht es eine Sonderart.
  if (a.optionen.every((o) => new RegExp(`^${AUSDRUCK}$`).test(o.text.trim()) && hatZeichen(o.text))) {
    if (!seiten.has(norm(richtige[0].text))) melde(a.id, `richtige Antwort „${richtige[0].text}“ steht nicht im Nachweis`);
    for (const o of a.optionen) if (!o.richtig && ersteSeiten.has(norm(o.text))) melde(a.id, `falsche Antwort „${o.text}“ steht im Nachweis (Sonderart wert oder extrem nötig)`);
    return;
  }
  // Reine Gleichungen: Die richtige steht wörtlich im Nachweis.
  if (a.optionen.every((o) => gleichungenIn(o.text).length === 1 && gleichungenIn(o.text)[0].ganz === o.text)) {
    if (!a.nachweis.some((n) => typeof n === 'string' && norm(n) === norm(richtige[0].text))) melde(a.id, `richtige Antwort „${richtige[0].text}“ steht nicht im Nachweis`);
    return;
  }
  // Reine Zahlen: Die richtige ist ein Ergebnis im Nachweis, die falschen sind es nicht.
  if (a.optionen.every((o) => /^(etwa )?\d[\d\u00a0]*$/.test(o.text))) {
    const z = (o) => zahlAus(o.text.replace('etwa ', ''));
    if (!ergebnisse.has(z(richtige[0]))) melde(a.id, `richtige Antwort ${richtige[0].text} ist kein Ergebnis im Nachweis`);
    // Ist die richtige Antwort das Ergebnis der letzten Zeile, dürfen falsche Antworten Zwischenergebnisse sein (typische Fehler).
    const letzteZeile = a.nachweis.filter((n) => typeof n === 'string').at(-1);
    const endwert = letzteZeile ? zahlAus(letzteZeile.split(/ [=≈] /).at(-1)) : NaN;
    if (z(richtige[0]) !== endwert) for (const o of a.optionen) if (!o.richtig && ergebnisse.has(z(o))) melde(a.id, `falsche Antwort ${o.text} ist ein Ergebnis im Nachweis`);
  }
}

// Fachbegriffe: „Wie heißt die Zahl 65 in 24 + 65 = 89?“ wird aus der Gleichung im Text bestimmt.
const BEGRIFFE = { '+': ['Summand', 'Summand', 'Summe'], '−': ['Minuend', 'Subtrahend', 'Differenz'], '·': ['Faktor', 'Faktor', 'Produkt'], ':': ['Dividend', 'Divisor', 'Quotient'] };
function pruefeBegriff(a) {
  if (a.format !== 'auswahl') return;
  const g = a.text.match(new RegExp(`(${NUM}) ([+−·:]) (${NUM}) = (${NUM})`));
  if (!g) return;
  const zahlen = [zahlAus(g[1]), zahlAus(g[3]), zahlAus(g[4])];
  const begriffVon = (z) => { const i = zahlen.indexOf(z); return i < 0 || zahlen.indexOf(z, i + 1) >= 0 ? null : BEGRIFFE[g[2]][i]; };
  const alle = [...new Set(Object.values(BEGRIFFE).flat())];
  const frage = a.text.match(/Wie heißt die Zahl (\d+)/);
  if (frage) {
    const soll = begriffVon(Number(frage[1]));
    if (!soll) { melde(a.id, 'Fachbegriff: Zahl ist in der Gleichung nicht eindeutig'); return; }
    for (const o of a.optionen) if ((o.text === soll) !== o.richtig) melde(a.id, `Fachbegriff: „${o.text}“ ist falsch eingestuft (richtig ist ${soll})`);
    a.begriffGeprueft = true;
    return;
  }
  // Behauptung im Text: „Bei 41 + 46 = 87 ist 87 ein Summand.“
  const beh = a.text.match(new RegExp(`ist (\\d+) (?:ein|eine|der|die|das) (${alle.join('|')})`));
  if (beh) {
    const soll = begriffVon(Number(beh[1]));
    if (!soll) { melde(a.id, 'Fachbegriff: Zahl ist in der Gleichung nicht eindeutig'); return; }
    const stimmtBeh = soll === beh[2];
    for (const o of a.optionen) {
      const genannt = alle.filter((b) => o.text.includes(b));
      const passt = polaritaet(o.text) === stimmtBeh && (stimmtBeh || genannt.includes(soll));
      if (passt !== o.richtig) melde(a.id, `Fachbegriff: „${o.text.slice(0, 40)}“ ist falsch eingestuft (richtig ist ${soll})`);
    }
    a.begriffGeprueft = true;
  }
}

// ---------- Bilder ----------
const ganz = (x, von, bis) => Number.isInteger(x) && x >= von && x <= bis;
function pruefeBild(a) {
  const b = a.bild;
  if (!b) return;
  const m = (text) => melde(a.id, `Bild ${b.art}: ${text}`);
  const kern = []; // Zahlen, die das Bild zeigt und die zur Aufgabe gehören müssen
  const unbekannte = [];
  const w = (x) => { if (istFrage(x)) unbekannte.push(x.wert); else kern.push(x); return wertVon(x); };
  switch (b.art) {
    case 'stellenwerttafel': {
      const erlaubt = ['T', 'H', 'Z', 'E'];
      if (!Array.isArray(b.spalten) || b.spalten.length !== b.plaettchen?.length || b.spalten.join('') !== erlaubt.slice(-b.spalten.length).join('')) { m('Spalten passen nicht'); break; }
      if (b.plaettchen.some((x) => !ganz(x, 0, 19))) m('zu viele Plättchen in einer Spalte');
      kern.push(b.plaettchen.reduce((s, x, i) => s + x * 10 ** (b.plaettchen.length - 1 - i), 0));
      break;
    }
    case 'zehnermaterial': {
      if (!ganz(b.h, 0, 9) || !ganz(b.z, 0, 20) || !ganz(b.e, 0, 20) || b.h + b.z + b.e === 0) m('Anzahl der Platten, Stangen oder Würfel passt nicht');
      if (b.weg && (b.weg.h > b.h || b.weg.z > b.z || b.weg.e > b.e || b.weg.h + b.weg.z + b.weg.e === 0)) m('es wird mehr weggenommen, als da ist');
      kern.push({ wert: 100 * b.h + 10 * b.z + b.e, teile: [b.h, b.z, b.e].filter((x) => x > 0) });
      if (b.weg) kern.push({ wert: 100 * b.weg.h + 10 * b.weg.z + b.weg.e, teile: [b.weg.h, b.weg.z, b.weg.e].filter((x) => x > 0) });
      break;
    }
    case 'punktefeld':
      if (!ganz(b.reihen, 1, 10) || !ganz(b.spalten, 1, 10)) m('Feld ist größer als 10 mal 10');
      if (b.trenn != null && !ganz(b.trenn, 1, b.reihen - 1)) m('Trennlinie liegt nicht im Feld');
      kern.push({ faktoren: [b.reihen, b.spalten] });
      break;
    case 'mengenbild':
      if (!ganz(b.anzahl, 1, 30) || !ganz(b.dazu ?? 0, 0, 20) || !ganz(b.weg ?? 0, 0, b.anzahl + (b.dazu ?? 0))) m('Anzahl passt nicht');
      kern.push(b.anzahl); if (b.weg) kern.push(b.weg); if (b.dazu) kern.push(b.dazu);
      if (b.weg || b.dazu) kern.push(b.anzahl + (b.dazu ?? 0) - (b.weg ?? 0));
      break;
    case 'gruppenbild':
      if (!ganz(b.gruppen, 1, 12) || !ganz(b.je, 1, 12) || !ganz(b.rest ?? 0, 0, b.je - 1)) m('Gruppen passen nicht (Rest muss kleiner sein als eine Gruppe)');
      if (b.rest) kern.push(b.je, b.gruppen * b.je + b.rest); else kern.push({ faktoren: [b.gruppen, b.je] });
      break;
    case 'streifen': {
      if (!Array.isArray(b.teile) || b.teile.length < 2 || b.teile.length > 4) { m('braucht zwei bis vier Teile'); break; }
      const g = w(b.ganz), teile = b.teile.map(w);
      if (teile.some((t) => !(t > 0)) || teile.reduce((s, x) => s + x, 0) !== g) m(`Teile ergeben zusammen nicht das Ganze (${teile.join(' + ')} und ${g})`);
      break;
    }
    case 'vergleich': {
      const o = w(b.oben?.wert), u = w(b.unten?.wert), d = w(b.unterschied);
      if (!b.oben?.name || !b.unten?.name) m('Name fehlt');
      if (!(o > u) || o - u !== d) m(`Unterschied stimmt nicht (${o} − ${u} und ${d})`);
      for (const name of [b.oben?.name, b.unten?.name]) if (name && !a.text.includes(name)) m(`Name ${name} steht nicht im Text`);
      break;
    }
    case 'zehnerfeld':
      if (![10, 20].includes(b.felder) || !ganz(b.belegt, 0, b.felder) || !ganz(b.dazu ?? 0, 0, b.felder - b.belegt)) m('Plättchen passen nicht ins Feld');
      kern.push(b.belegt); if (b.dazu) kern.push(b.dazu, b.belegt + b.dazu);
      break;
    case 'zahlenstrahl': {
      if (!(b.von < b.bis) || !(b.schritt > 0) || (b.bis - b.von) % b.schritt !== 0 || b.beschriftung % b.schritt !== 0) { m('Einteilung geht nicht auf'); break; }
      if ((b.bis - b.von) / b.schritt > 60) m('zu viele Teilstriche');
      const aufStrich = (v) => v >= b.von && v <= b.bis && (v - b.von) % b.schritt === 0;
      if (b.start != null) { if (!aufStrich(b.start)) m(`Start ${b.start} liegt nicht auf einem Teilstrich`); if (b.start !== 0) kern.push(b.start); }
      for (const s of b.spruenge ?? []) {
        if (!aufStrich(s.von) || !aufStrich(s.nach)) m(`Sprung ${s.von} nach ${s.nach} liegt nicht auf Teilstrichen`);
        const t = String(s.text ?? '').match(/^([+−]) (\d+)$/);
        if (s.text !== '?' && (!t || s.von + (t[1] === '+' ? 1 : -1) * Number(t[2]) !== s.nach)) m(`Sprung ${s.von} nach ${s.nach} passt nicht zur Beschriftung „${s.text}“`);
        if (s.von === s.nach) m('Sprung ohne Länge');
      }
      if (b.start != null && b.spruenge?.length && b.spruenge[0].von !== b.start) m('erster Sprung beginnt nicht am Start');
      break;
    }
    default: m('unbekannte Bildart');
  }
  // Das Bild muss zur Aufgabe gehören: Seine Zahlen stehen im Text, in den Antworten, im Nachweis oder sind die Lösung.
  const bekannt = new Set([...sichtbareTexte(a).flatMap(zahlenIn), ...loesungenVon(a), ...zahlenImObjekt(a.nachweis), ...zahlenImObjekt(a.tabelle)]);
  for (const k of kern) {
    if (k.faktoren) { const [x, y] = k.faktoren; if (!bekannt.has(x * y) || !(bekannt.has(x) || bekannt.has(y))) m(`${x} mal ${y} kommt in der Aufgabe nicht vor`); }
    else if (typeof k === 'object') { if (!bekannt.has(k.wert) && !k.teile.every((x) => bekannt.has(x))) m(`${k.wert} kommt in der Aufgabe nicht vor`); }
    else if (!bekannt.has(k)) m(`${k} kommt in der Aufgabe nicht vor`);
  }
  // Eine Unbekannte im Bild ist nie eine Zahl, die schon im Text steht, und sie gehört zur Lösung oder zum Nachweis.
  for (const u of unbekannte) if (!bekannt.has(u)) m(`Unbekannte ${u} gehört nicht zur Aufgabe`);
  if (unbekannte.length > 1) m('mehr als eine Unbekannte');
}
const hatBild = (a) => Boolean(a.bild) || a.format === 'zahlenstrahl' || a.format === 'diagramm' || a.tabelle?.art === 'raster';

// ---------- Formate ----------
function pruefeFormat(a) {
  if (a.format === 'zahl') {
    pruefeZahl(a.id, a);
  } else if (a.format === 'auswahl') {
    const richtige = a.optionen.filter((o) => o.richtig).length;
    if (a.optionen.length < 2) melde(a.id, 'weniger als zwei Optionen');
    if (!a.mehrfach && a.optionen.length > MAX_OPTIONEN[a.niveau]) melde(a.id, `mehr als ${MAX_OPTIONEN[a.niveau]} Antworten auf Niveaustufe ${a.niveau}`);
    if (a.mehrfach && a.optionen.length > MAX_OPTIONEN[a.niveau] + 1) melde(a.id, `zu viele Antworten auf Niveaustufe ${a.niveau}`);
    if (richtige < 1) melde(a.id, 'keine richtige Option');
    if (!a.mehrfach && richtige !== 1) melde(a.id, 'Einfachauswahl braucht genau eine richtige Option');
    if (a.mehrfach && richtige === a.optionen.length) melde(a.id, 'Mehrfachauswahl: alle Antworten sind richtig');
    if (new Set(a.optionen.map((o) => norm(o.text))).size !== a.optionen.length) melde(a.id, 'Option doppelt');
    for (const o of a.optionen) {
      if (o.fehlvorstellung && !(o.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${o.fehlvorstellung}`);
      if (o.richtig && o.fehlvorstellung) melde(a.id, 'richtige Antwort mit Fehlvorstellung');
      // Rechnungen in richtigen Antworten müssen stimmen, außer es wird gerade die falsche Rechnung gesucht.
      const falscheGesucht = /falsch|Fehler|stimmt nicht|nicht richtig/i.test(a.text);
      if (o.richtig && !falscheGesucht) for (const g of gleichungenIn(o.text)) if (g.danach !== '?' && !stimmt(g)) melde(a.id, `Gleichung in der richtigen Antwort stimmt nicht: ${g.ganz}`);
      // Wird die falsche Rechnung gesucht, ist genau sie falsch.
      if (falscheGesucht && a.optionen.every((x) => gleichungenIn(x.text).length === 1 && gleichungenIn(x.text)[0].ganz === x.text.replace(EINHEITEN, ''))) {
        if (stimmt(gleichungenIn(o.text)[0]) === o.richtig) melde(a.id, `Option „${o.text}“ ist falsch eingestuft`);
      }
    }
    // Sind alle Antworten reine Rechenausdrücke oder Zahlen, darf keine falsche denselben Wert haben wie die richtige.
    if (!a.mehrfach && a.optionen.every((o) => istAusdruck(o.text)) && !/Rechnung|Rechenweg|Aufgabe|Ausdruck|Term|passt|Klammer|Probe|Überschlag|zeigt|gehört/i.test(a.text)) {
      const r = rechne(a.optionen.find((o) => o.richtig).text);
      for (const o of a.optionen) if (!o.richtig && rechne(o.text) === r) melde(a.id, `falsche Antwort „${o.text}“ hat denselben Wert wie die richtige`);
    }
  } else if (a.format === 'luecken') {
    const namen = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
    if (namen.length === 0) melde(a.id, 'keine Lücke im Text');
    if (new Set(namen).size !== namen.length) melde(a.id, 'Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n], `Lücke ${n}`);
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) melde(a.id, `Lösung ${n} ohne Lücke im Text`);
    if (a.ziffernfelder) for (const l of Object.values(a.luecken ?? {})) if (!ganz(l.loesung, 0, 9)) melde(a.id, 'Ziffernfeld mit mehrstelliger Lösung');
    // Lösungen einsetzen: Jede Gleichung im Text muss dann stimmen. Ausnahme: eine vorgeführte Rechnung, die geprüft werden soll.
    const setze = (anders) => a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => (n === anders ? a.luecken[n].loesung + 1 : a.luecken?.[n]?.loesung ?? '?'));
    const falsche = (text) => text.split('\n').filter((z) => !/rechnet|behauptet|sagt|meint/.test(z)).flatMap(gleichungenIn).filter((g) => !stimmt(g));
    for (const g of falsche(setze(null))) melde(a.id, `mit den Lösungen stimmt die Gleichung nicht: ${g.ganz}`);
    // Eine Lücke, die in keiner Gleichung des Textes steht, muss sich als Ergebnis aus dem Nachweis ergeben (pruefeNachweis).
    a.lueckenOhneGleichung = namen.filter((n) => a.luecken?.[n] && falsche(setze(n)).length === 0);
  } else if (a.format === 'zuordnen') {
    if ((a.paare?.length ?? 0) < 2) melde(a.id, 'zu wenige Paare');
    for (const seite of ['links', 'rechts']) if (new Set(a.paare.map((p) => norm(p[seite]))).size !== a.paare.length) melde(a.id, `Paare ${seite} nicht eindeutig`);
    // Sind beide Seiten Rechenausdrücke oder Zahlen, müssen sie gleich viel wert sein, und kein anderes Paar passt auch.
    if (a.paare.every((p) => istAusdruck(p.links) && istAusdruck(p.rechts)) && a.paare.some((p) => hatZeichen(p.links + p.rechts))) {
      for (const p of a.paare) if (rechne(p.links) !== rechne(p.rechts)) melde(a.id, `Paar „${p.links}“ und „${p.rechts}“ passt nicht zusammen`);
      if (new Set(a.paare.map((p) => rechne(p.rechts))).size !== a.paare.length) melde(a.id, 'zwei Paare haben denselben Wert');
    }
    // Mit Nachweis: Zu jedem Paar gehört eine Rechnung, in der seine Zahlen vorkommen.
    if (a.nachweis) for (const p of a.paare) {
      const z = zahlenIn(`${p.links} ${p.rechts}`);
      if (z.length && !a.nachweis.some((n) => typeof n === 'string' && z.every((x) => zahlenIn(n).includes(x)))) melde(a.id, `Paar „${p.links}“ und „${p.rechts}“ steht nicht im Nachweis`);
    }
    for (const p of a.paare) for (const g of gleichungenIn(`${p.links} ${p.rechts}`)) if (!stimmt(g)) melde(a.id, `Gleichung im Paar stimmt nicht: ${g.ganz}`);
  } else if (a.format === 'sachaufgabe') {
    if ((a.teile?.length ?? 0) < 2) melde(a.id, 'Sachaufgabe braucht mindestens zwei Teile');
    for (const t of a.teile ?? []) { if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt'); pruefeZahl(a.id, t); }
  } else if (a.format === 'zahlenstrahl') {
    pruefeZahl(a.id, a);
    const st = a.strahl ?? {};
    if (!['markieren', 'ablesen'].includes(a.eingabe)) melde(a.id, 'Zahlenstrahl: eingabe muss markieren oder ablesen sein');
    if (!(st.von < st.bis) || !(st.schritt > 0) || (st.bis - st.von) % st.schritt !== 0 || st.beschriftung % st.schritt !== 0) melde(a.id, 'Zahlenstrahl: Einteilung geht nicht auf');
    if ((st.bis - st.von) / st.schritt > 40) melde(a.id, 'Zahlenstrahl: zu viele Teilstriche zum Antippen');
    const aufStrich = (v) => v >= st.von && v <= st.bis && (v - st.von) % st.schritt === 0;
    for (const [was, v] of [['Lösung', a.loesung], ['Start', st.start ?? st.von], ['Pfeil', st.pfeil ?? st.von], ...(st.spruenge ?? []).flatMap((sp) => [['Sprung', sp.von], ['Sprung', sp.nach]])]) {
      if (!aufStrich(v)) melde(a.id, `Zahlenstrahl: ${was} ${v} liegt nicht auf einem Teilstrich`);
    }
    if (a.eingabe === 'ablesen' && st.pfeil !== a.loesung) melde(a.id, 'Zahlenstrahl: Pfeil zeigt nicht auf die Lösung');
    if (a.eingabe === 'markieren' && st.pfeil != null) melde(a.id, 'Zahlenstrahl: Pfeil verrät die Lösung');
    if (a.loesung % st.beschriftung === 0 && a.eingabe === 'ablesen') melde(a.id, 'Zahlenstrahl: Lösung steht als Beschriftung am Strahl');
    for (const sp of st.spruenge ?? []) {
      const m = String(sp.text).match(/^([+−]) (\d+)$/);
      if (!m || sp.von + (m[1] === '+' ? 1 : -1) * Number(m[2]) !== sp.nach) melde(a.id, 'Zahlenstrahl: Sprung passt nicht zu seiner Beschriftung');
      if (a.eingabe === 'markieren' && sp.nach === a.loesung) melde(a.id, 'Zahlenstrahl: Sprung verrät die Lösung');
    }
    if (!a.nachweis) melde(a.id, 'Nachweis fehlt');
  } else if (a.format === 'diagramm') {
    const d = a.diagramm ?? {};
    if (!d.titel || !d.einheit || !(d.max > 0) || !(d.schritt > 0) || d.max % d.schritt !== 0) melde(a.id, 'Diagramm: Titel, Einheit oder Achse fehlt');
    if ((d.saeulen?.length ?? 0) < 2) melde(a.id, 'Diagramm braucht mindestens zwei Säulen');
    // Ablesbar ist ein Wert nur auf einer Linie, einer Hilfslinie oder genau in der Mitte dazwischen.
    const raster = d.werteZeigen ? 1 : d.hilfslinien ? d.schritt / 4 : d.schritt / 2;
    for (const sa of d.saeulen ?? []) if (!(sa.wert > 0) || sa.wert > d.max || sa.wert % raster !== 0) melde(a.id, `Diagramm: Wert ${sa.wert} lässt sich nicht ablesen`);
    if ((a.teile?.length ?? 0) < 1) melde(a.id, 'Diagramm braucht mindestens eine Frage');
    for (const t of a.teile ?? []) { if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt'); pruefeZahl(a.id, t); }
    if (!a.nachweis) melde(a.id, 'Nachweis fehlt');
  } else if (a.format === 'tabelle') {
    const t = a.tabelle ?? {};
    const zellen = (t.zeilen ?? []).flat();
    if (!t.kopf?.length || (t.zeilen ?? []).some((z) => z.length !== t.kopf.length)) melde(a.id, 'Tabelle: Zeilen passen nicht zur Kopfzeile');
    const namen = zellen.filter((c) => typeof c === 'object').map((c) => c.luecke);
    if (namen.length === 0) melde(a.id, 'Tabelle ohne Lücke');
    if (new Set(namen).size !== namen.length) melde(a.id, 'Tabelle: Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n], `Lücke ${n}`);
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) melde(a.id, `Lösung ${n} ohne Lücke in der Tabelle`);
    if (t.art === 'raster') pruefeRaster(a);
    else {
      // Bekannte Tabellenarten zusätzlich nachrechnen.
      const zeichen = t.kopf?.[0];
      for (const zeile of t.zeilen ?? []) zeile.forEach((c, k) => {
        if (typeof c !== 'object') return;
        const l = a.luecken?.[c.luecke]?.loesung, links = zahlAus(String(zeile[0])), oben = zahlAus(String(t.kopf[k]));
        if (zeichen === '+' && links + oben !== l) melde(a.id, 'Additionstabelle falsch');
        if (zeichen === '−' && links - oben !== l) melde(a.id, 'Subtraktionstabelle falsch');
        if (zeichen === '·' && links * oben !== l) melde(a.id, 'Maltabelle falsch');
        if (t.kopf[k] === 'Gesamt' && zeile.slice(1, k).reduce((s, x) => s + zahlAus(String(x)), 0) !== l) melde(a.id, 'Tabelle: Gesamt falsch');
        if (t.kopf[k] === 'fehlt bis 1000' && 1000 - links !== l) melde(a.id, 'Tabelle: Ergänzung falsch');
        if (t.kopf[k] === 'a − (b + c)' && Number(zeile[0]) - (Number(zeile[1]) + Number(zeile[2])) !== l) melde(a.id, 'Tabelle: Rechenausdruck falsch');
      });
    }
  } else melde(a.id, `unbekanntes Format ${a.format}`);
}

// Stellenraster: Die Ziffern in den Zeilen und die Lösungsziffern müssen genau die Rechnung ergeben.
function pruefeRaster(a) {
  const t = a.tabelle, r = t.rechnung;
  const m = (text) => melde(a.id, `Raster: ${text}`);
  if (!r || !['+', '−'].includes(r.zeichen) || !Array.isArray(r.zahlen) || r.zahlen.length < 2) { m('Rechnung fehlt'); return; }
  const soll = r.zeichen === '+' ? r.zahlen.reduce((s, x) => s + x, 0) : r.zahlen[0] - r.zahlen.slice(1).reduce((s, x) => s + x, 0);
  if (soll !== r.ergebnis || soll < 0) m(`Ergebnis stimmt nicht (${soll} und ${r.ergebnis})`);
  const stellen = t.kopf.slice(1);
  if (stellen.join('') !== ['T', 'H', 'Z', 'E'].slice(-stellen.length).join('')) m('Kopfzeile ist keine Stellenwerttafel');
  const zahl = (zeile) => Number(zeile.slice(1).map((c) => (c === '' ? '0' : String(c))).join(''));
  const zeilen = t.zeilen.filter((z) => !['getauscht', 'gemerkt', 'Ergebnis'].includes(z[0]));
  if (!gleich(zeilen.map(zahl), r.zahlen)) m('Zeilen zeigen nicht die Zahlen der Rechnung');
  if (zeilen.slice(1).some((z) => z[0] !== r.zeichen) || zeilen[0][0] !== '') m('Rechenzeichen steht falsch');
  for (const z of zeilen) if (/^0\d/.test(z.slice(1).join(''))) m('führende Null');
  const ergebnis = t.zeilen.find((z) => z[0] === 'Ergebnis');
  if (!ergebnis || t.zeilen.at(-1) !== ergebnis) { m('Ergebniszeile fehlt'); return; }
  const ziffern = ergebnis.slice(1).map((c) => a.luecken?.[c.luecke]?.loesung);
  if (Number(ziffern.join('')) !== r.ergebnis || ziffern.some((z) => !ganz(z, 0, 9))) m('Lösungsziffern ergeben nicht das Ergebnis');
  const ziff = (x) => String(x).padStart(stellen.length, '0').split('').map(Number);
  // Hilfszeile „gemerkt“: der Zehner aus der Spalte rechts daneben.
  const gemerkt = t.zeilen.find((z) => z[0] === 'gemerkt');
  if (gemerkt) {
    const soll_ = Array(stellen.length).fill('');
    let u = 0;
    for (let i = stellen.length - 1; i >= 0; i--) { const s = r.zahlen.reduce((x, y) => x + ziff(y)[i], 0) + u; u = Math.floor(s / 10); if (u && i > 0) soll_[i - 1] = u; }
    if (!gleich(gemerkt.slice(1).map(String), soll_.map(String))) m('Zeile „gemerkt“ stimmt nicht');
  }
  // Hilfszeile „getauscht“: Sie hat denselben Wert wie die obere Zahl, und jede Stelle reicht zum Abziehen.
  const getauscht = t.zeilen.find((z) => z[0] === 'getauscht');
  if (getauscht) {
    const oben = getauscht.slice(1).map((c) => (c === '' ? 0 : Number(c))), unten = ziff(r.zahlen[1]);
    if (oben.reduce((s, x, i) => s + x * 10 ** (stellen.length - 1 - i), 0) !== r.zahlen[0]) m('Zeile „getauscht“ hat nicht den Wert der oberen Zahl');
    if (oben.some((x, i) => x < unten[i] || x - unten[i] > 9)) m('Zeile „getauscht“ reicht nicht zum Abziehen');
    if (!gleich(oben.map((x, i) => x - unten[i]), ziffern)) m('Zeile „getauscht“ führt nicht zum Ergebnis');
  }
  if (r.zeichen === '−' && !getauscht && ziff(r.zahlen[0]).some((x, i) => x < ziff(r.zahlen[1])[i])) m('Tausch nötig, aber die Zeile „getauscht“ fehlt');
  if (r.zeichen === '+' && !gemerkt && ziff(r.ergebnis).some((x, i) => r.zahlen.reduce((s, y) => s + ziff(y)[i], 0) !== x)) m('Übertrag nötig, aber die Zeile „gemerkt“ fehlt');
}

// ---------- Durchlauf ----------
const ids = new Set();
const gruppen = new Map();
for (const a of pool.aufgaben.map((x) => ({ ...x }))) {
  if (ids.has(a.id)) melde(a.id, 'ID doppelt');
  ids.add(a.id);
  for (const k of Object.keys(a)) if (!SCHLUESSEL.includes(k)) melde(a.id, `unbekanntes Feld ${k}`);
  if (!lernziele.has(a.lernziel)) melde(a.id, `unbekanntes Lernziel ${a.lernziel}`);
  if (!NIVEAUS.includes(a.niveau)) { melde(a.id, `unbekannte Niveaustufe ${a.niveau}`); continue; }
  if (!FORMATE.includes(a.format)) { melde(a.id, `unbekanntes Format ${a.format}`); continue; }
  if (![1, 2, 3].includes(a.afb)) melde(a.id, `Anforderungsbereich fehlt oder ist ungültig: ${a.afb}`);
  if (!a.id.startsWith(`${a.lernziel}-${a.niveau}-`)) melde(a.id, 'ID passt nicht zu Lernziel und Niveaustufe');
  if (!a.text?.trim()) { melde(a.id, 'Text fehlt'); continue; }
  if (/undefined|NaN|null|\[object/.test(JSON.stringify([sichtbareTexte(a), a.hilfen]))) melde(a.id, 'Text enthält einen Platzhalter (undefined, NaN)');
  if (sichtbareTexte(a).concat(Object.values(a.hilfen ?? {})).some((t) => / {2}|^ | $|\d-\d| - /.test(t))) melde(a.id, 'Text mit doppeltem Leerzeichen oder Bindestrich statt Minuszeichen');
  const schluessel = `${a.lernziel} ${a.niveau}`;
  if (!gruppen.has(schluessel)) gruppen.set(schluessel, []);
  gruppen.get(schluessel).push(a);
  pruefeHilfen(a);
  pruefeSprache(a);
  pruefeZahlenraum(a);
  pruefeFormat(a);
  pruefeBegriff(a);
  pruefeNachweis(a);
  pruefeBild(a);
  if (a.niveau === 'F' && !hatBild(a)) melde(a.id, 'auf F braucht jede Aufgabe ein Bild');
  if (a.niveau === 'F' && a.afb === 3) melde(a.id, 'auf F gibt es keinen Anforderungsbereich III');
}

// Abdeckung: Jedes Lernziel mit Aufgaben hat auf jeder Niveaustufe genau sechs Aufgaben in der festen Folge der Anforderungsbereiche.
const mitAufgaben = new Set(pool.aufgaben.map((a) => a.lernziel));
for (const l of mitAufgaben) for (const n of NIVEAUS) {
  const gruppe = (gruppen.get(`${l} ${n}`) ?? []).sort((a, b) => a.id.localeCompare(b.id));
  if (gruppe.length !== PRO_GRUPPE) { melde(`${l} ${n}`, `${gruppe.length} Aufgaben statt ${PRO_GRUPPE}`); continue; }
  const folge = gruppe.map((a) => a.afb);
  if (folge.join() !== AFB_FOLGE[n].join()) melde(`${l} ${n}`, `Anforderungsbereiche ${folge.join(', ')} statt ${AFB_FOLGE[n].join(', ')}`);
  const bilder = gruppe.filter(hatBild).length;
  if (bilder < (BILDER_JE_GRUPPE[n] ?? 0)) melde(`${l} ${n}`, `nur ${bilder} Aufgaben mit Bild, nötig sind ${BILDER_JE_GRUPPE[n]}`);
  // Keine zwei Aufgaben einer Gruppe mit demselben Text und denselben Antworten.
  const gesehen = new Set();
  for (const a of gruppe) {
    const k = JSON.stringify([a.text, (a.optionen ?? []).map((o) => o.text).sort(), a.tabelle, a.strahl, a.bild]);
    if (gesehen.has(k)) melde(a.id, 'Aufgabe kommt in der Gruppe doppelt vor');
    gesehen.add(k);
  }
}
// Grundlage: Jedes Lernziel mit Aufgaben nennt den Baustein, den die Förderstufe übt (für den Hinweis im Lehrer-Dashboard).
for (const l of pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele)) if (mitAufgaben.has(l.id) && !l.grundlage) melde(l.id, 'Lernziel ohne Grundlage');
// Wortspeicher: Jede Station mit Aufgaben braucht einen, mit Wörtern mindestens für F, G und M.
for (const k of pool.kapitel) for (const u of k.unterkapitel) if (u.lernziele.some((l) => mitAufgaben.has(l.id))) {
  for (const n of ['F', 'G', 'M']) if (!(u.wortspeicher ?? []).some((w) => w.ab === n && w.wort && w.erklaerung)) melde(u.id, `Wortspeicher ohne Wörter ab Niveaustufe ${n}`);
  for (const w of u.wortspeicher ?? []) {
    if (!NIVEAUS.includes(w.ab)) melde(u.id, `Wortspeicher: unbekannte Stufe bei ${w.wort}`);
    for (const g of gleichungenIn(w.erklaerung)) if (!stimmt(g)) melde(u.id, `Wortspeicher: Gleichung stimmt nicht: ${g.ganz}`);
  }
  for (const text of [...(u.merkzettel?.regeln ?? []), u.merkzettel?.beispiel ?? '']) for (const g of gleichungenIn(text)) if (!stimmt(g)) melde(u.id, `Merkzettel: Gleichung stimmt nicht: ${g.ganz}`);
}
for (const [id, f] of Object.entries(pool.fehlvorstellungen)) if (!f.beschreibung || !f.hinweis) melde(id, 'Fehlvorstellung ohne Beschreibung oder Hinweis');

return { fehler, mitAufgaben, lernziele, hatBild };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pool = JSON.parse(readFileSync(process.argv[2] ?? 'aufgabenpool/klasse-5.json', 'utf8'));
  const { fehler, mitAufgaben, lernziele, hatBild } = pruefePool(pool);
  if (fehler.length) { console.error(fehler.join('\n')); console.error(`\n${fehler.length} Fehler.`); process.exit(1); }
  const mitNachweis = pool.aufgaben.filter((a) => a.nachweis).length, mitBild = pool.aufgaben.filter(hatBild).length;
  console.log(`In Ordnung: ${pool.aufgaben.length} Aufgaben zu ${mitAufgaben.size} Lernzielen, ${mitNachweis} nachgerechnet, ${mitBild} mit Bild, ${lernziele.size} Lernziele im Jahresplan.`);
}
