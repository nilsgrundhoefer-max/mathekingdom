// Klasse 7, Kapitel 1 „Rationale Zahlen“ (ADR 0043): Der Prüfer rechnet mit Vorzeichen.
// Wie der übrige Prüfer benutzt diese Datei nichts aus den Erzeugern und nichts aus dem Dashboard.
// Jede Zahl ist ein Bruch aus ganzem Zähler und positivem Nenner: „−3“, „2,5“, „−3⁄4“, „−1 3⁄4“. Gerechnet wird genau.
// Gelesen werden +, −, ·, :, runde und eckige Klammern, Betragsstriche und Hochzahlen. Nach einem Rechenzeichen steht eine
// negative Zahl in Klammern; „3 + −5“ lässt sich deshalb nicht lesen und fällt als Fehler auf.

const NIVEAUS = ['F', 'G', 'M', 'E'];
const HOCH = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ggt = (a, b) => (b ? ggt(b, a % b) : Math.abs(a));
const Q = (z, n = 1) => { if (!Number.isSafeInteger(z) || !Number.isSafeInteger(n) || n === 0) return null; const g = ggt(z, n) || 1, v = n < 0 ? -1 : 1; return { z: (v * z) / g, n: (v * n) / g }; };
const plus = (a, b) => Q(a.z * b.n + b.z * a.n, a.n * b.n), minus = (a, b) => Q(a.z * b.n - b.z * a.n, a.n * b.n);
const mal = (a, b) => Q(a.z * b.z, a.n * b.n), durch = (a, b) => (b.z === 0 ? null : Q(a.z * b.n, a.n * b.z));
const vgl = (a, b) => Math.sign(a.z * b.n - b.z * a.n);
const gleich = (a, b) => Boolean(a && b) && vgl(a, b) === 0;
const abs = (a) => Q(Math.abs(a.z), a.n);
const key = (a) => `${a.z}/${a.n}`;

// Einheiten hinter einer Zahl zählen beim Rechnen nicht mit.
const EINHEIT = /(?<=[\d)]) ?(?:°C|°F|€|ct|km|cm|mm|kg|K|m|g|l)(?![A-Za-zÄÖÜäöüß²³])/g;
const ohneEinheiten = (s) => String(s ?? '').replace(EINHEIT, '');
const MARKE = new RegExp(`\\s*(?:((?:\\d+\\u202f)?\\d+\\u2044\\d+|\\d+(?:\\u00a0\\d{3})*(?:,\\d+)?)|([${HOCH}]+)|([+−·:()\\[\\]|=<>]))`, 'y');
function marken(text) {
  const t = ohneEinheiten(text).trim(), liste = [];
  let p = 0;
  while (p < t.length) {
    MARKE.lastIndex = p;
    const m = MARKE.exec(t);
    if (!m) return null;
    p = MARKE.lastIndex;
    if (m[1] != null) {
      const b = m[1].match(/^(?:(\d+) )?(\d+)⁄(\d+)$/);
      if (b) { if (Number(b[3]) === 0) return null; liste.push({ w: Q(Number(b[1] ?? 0) * Number(b[3]) + Number(b[2]), Number(b[3])) }); }
      else { const [g, k = ''] = m[1].replace(/ /g, '').split(','); liste.push({ w: Q(Number(g + k), 10 ** k.length) }); }
    } else if (m[2] != null) liste.push({ hoch: Number([...m[2]].map((c) => HOCH.indexOf(c)).join('')) });
    else liste.push(m[3]);
  }
  return liste;
}
// Liest eine Kette: Ausdrücke, getrennt durch =, < oder >. Liefert { werte, zeichen } oder null.
function lies(text) {
  const t = marken(text);
  if (!t || !t.length) return null;
  let i = 0, kaputt = false;
  const primaer = () => {
    const x = t[i];
    let w = null;
    if (x && typeof x === 'object' && x.w) { i++; w = x.w; }
    else if (x === '(' || x === '[') { i++; w = strich(); if (t[i++] !== (x === '(' ? ')' : ']')) kaputt = true; }
    else if (x === '|') { i++; w = strich(); if (t[i++] !== '|') kaputt = true; else if (w) w = abs(w); }
    else { kaputt = true; return null; }
    if (t[i] && typeof t[i] === 'object' && t[i].hoch != null && w) { let p = Q(1); for (let k = 0; k < t[i].hoch; k++) p = mal(p, w); w = p; i++; }
    return w;
  };
  const punkt = () => {
    let w = primaer();
    while ((t[i] === '·' || t[i] === ':') && !kaputt) { const z = t[i++], r = primaer(); if (!w || !r) { kaputt = true; return null; } w = z === '·' ? mal(w, r) : durch(w, r); if (!w) kaputt = true; }
    return w;
  };
  function strich() {
    let v = 1;
    if (t[i] === '+' || t[i] === '−') { v = t[i] === '−' ? -1 : 1; i++; }
    let w = punkt();
    if (w && v < 0) w = Q(-w.z, w.n);
    while ((t[i] === '+' || t[i] === '−') && !kaputt) { const z = t[i++], r = punkt(); if (!w || !r) { kaputt = true; return null; } w = z === '+' ? plus(w, r) : minus(w, r); }
    return w;
  }
  const werte = [strich()], zeichen = [];
  while (!kaputt && ['=', '<', '>'].includes(t[i])) { zeichen.push(t[i++]); werte.push(strich()); }
  if (kaputt || i !== t.length || werte.some((w) => !w)) return null;
  return { werte, zeichen };
}
export const wert = (text) => { const k = lies(text); return k && k.werte.length === 1 ? k.werte[0] : null; };
const ketteOk = (k) => k.zeichen.every((z, i) => { const d = vgl(k.werte[i], k.werte[i + 1]); return z === '=' ? d === 0 : z === '<' ? d < 0 : d > 0; });
const seiten = (text) => ohneEinheiten(text).split(/ ?[=<>] ?/);
// Alle Zahlen eines Textes, ohne Vorzeichen.
const ZAHL = /(?:\d+ )?\d+⁄\d+|\d+(?: \d{3})*(?:,\d+)?/g;
const zahlenIn = (text) => (String(text ?? '').match(ZAHL) ?? []).map((x) => wert(x)).filter(Boolean);

// Alle Ketten in einem freien Text (Hilfekärtchen, Merkzettel, Wortspeicher), im Format des Prüfers.
const RECHENZEICHEN = new Set([...'0123456789   ⁄+−·()[]|=<>', ...HOCH]);
export function rGleichungen(text) {
  const t = ohneEinheiten(text), liste = [];
  let start = -1;
  const ende = (bis) => {
    if (start < 0) return;
    let roh = t.slice(start, bis); const von = start; start = -1;
    // Neben einem Kästchen steht keine fertige Rechnung: „▢ + (−3) = 5“ ist eine Frage.
    if (t.slice(0, von).trimEnd().endsWith('▢') || t.slice(bis).trimStart().startsWith('▢')) return;
    const vorn = roh.match(/^[\s)\]=<>·:]*/)[0].length;
    roh = roh.slice(vorn).replace(/[\s(\[=<>+−·:]*$/, '');
    if (!/[=<>]/.test(roh) || !/\d/.test(roh)) return;
    const danach = t.slice(von + vorn + roh.length).trimStart()[0] ?? '';
    const davor = t.slice(0, von + vorn);
    if (/(?:Falsch|Nicht|nicht): ?$/.test(davor)) return;
    const k = lies(roh);
    liste.push({ ganz: roh, seiten: seiten(roh), rest: null, groesse: true, danach, ok: Boolean(k) && ketteOk(k), lesbar: Boolean(k) });
  };
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    const drin = RECHENZEICHEN.has(c) || (c === ',' && /\d/.test(t[i - 1] ?? '') && /\d/.test(t[i + 1] ?? '')) || (c === ':' && t[i - 1] === ' ' && t[i + 1] === ' ');
    if (drin) { if (start < 0 && c !== ' ') start = i; } else ende(i);
  }
  ende(t.length);
  return liste;
}

// ---------- Sprache und Staffel ----------
// Grilling mit Nils (2026-11-24): F ganze Zahlen bis ±20, G bis ±100 und eine Nachkommastelle, Brüche nur beim Vergleichen,
// M zwei Nachkommastellen und Brüche, E frei. In 1.6 bis 1.8 und beim Girokonto dürfen die Zahlen größer sein (Produkte, Geld).
const GROSS = /^7\.1\.(?:[678]|X[34])-/;
export function rationalSprachMaengel(a, texte) {
  const m = [], stufe = NIVEAUS.indexOf(a.niveau), alle = texte.join(' \n ');
  if (/(?:[+−·]| :) [−+]\d/.test(alle)) m.push('nach einem Rechenzeichen steht eine Zahl mit Vorzeichen in Klammern');
  if (/(?<![\d⁄])\d+\/\d+/.test(alle)) m.push('ein Bruch steht mit Schrägstrich statt mit Bruchstrich');
  if (/Kommazahl|Dezimalbruch/.test(alle)) m.push('es heißt „Dezimalzahl“');
  if (/\(\+\d/.test(alle) && (stufe === 0 || !/^7\.1\.[345]-/.test(a.lernziel))) m.push('die Schreibweise (+15) gibt es nur in 1.3 bis 1.5 und erst ab G');
  if (stufe < 2 && /\|[−\d][^|(]*\|(?!\d)/.test(alle.replace(/\([−\d]+\|[−\d]+\)/g, ''))) m.push('Betragsstriche gibt es erst ab M');
  if (stufe < 2 && /[ℕℤℚ]/.test(alle)) m.push('die Zeichen ℕ, ℤ und ℚ gibt es erst ab M');
  if (stufe < 3 && new RegExp(`[\\d)][${HOCH}]`).test(alle)) m.push('Potenzen gibt es hier erst auf E');
  const ohneGeld = alle.replace(/\d+,\d{2}[  ]€/g, ' ');
  const stellen = [...ohneGeld.matchAll(/\d,(\d+)/g)].map((x) => x[1].length);
  if (stellen.some((s) => s > [0, 1, 2, 3][stufe])) m.push(stufe === 0 ? 'auf F gibt es keine Dezimalzahlen' : `zu viele Nachkommastellen für Niveaustufe ${a.niveau}`);
  const brueche = /\d⁄\d/.test(alle);
  if (brueche && (stufe === 0 || (stufe === 1 && !a.lernziel.startsWith('7.1.2-')))) m.push(`Brüche gibt es auf Niveaustufe ${a.niveau} hier noch nicht`);
  for (const x of alle.matchAll(/(?:(\d+) )?(\d+)⁄(\d+)/g)) if (Number(x[3]) < 2 || (x[1] && Number(x[2]) >= Number(x[3]))) m.push(`Bruch „${x[0]}“ ist nicht sauber geschrieben`);
  const grenze = GROSS.test(a.lernziel) ? [100, 1000, 10000, 1000000][stufe] : [20, 100, 1000, 1000000][stufe];
  const zuGross = [...alle.replace(/\d+⁄\d+/g, ' ').matchAll(/\d+(?: \d{3})*/g)].map((x) => Number(x[0].replace(/ /g, ''))).find((n) => n > grenze);
  if (zuGross != null) m.push(`die Zahl ${zuGross} ist für Niveaustufe ${a.niveau} hier zu groß (Grenze ${grenze})`);
  return m;
}

// ---------- Bilder ----------
const ganz = (x) => Number.isInteger(x);
const strahlVon = (a) => a.strahl ?? (a.bild?.art === 'zahlenstrahl' ? a.bild : null);
export const rationalHatBild = (a) => Boolean(a.bild) || ['zahlenstrahl', 'gitter'].includes(a.format) || a.tabelle?.art === 'mauer' || Boolean(a.daten);
function bildMaengel(a) {
  const m = [];
  const st = strahlVon(a);
  if (st) {
    const T = st.teiler ?? 1;
    if (![st.von, st.bis, st.schritt, st.beschriftung, T].every(ganz) || !(st.von < st.bis) || !(st.schritt > 0) || (st.bis - st.von) % st.schritt !== 0 || st.beschriftung % st.schritt !== 0) m.push('Zahlengerade: Einteilung geht nicht auf');
    else {
      if ((st.bis - st.von) / st.schritt > 40) m.push('Zahlengerade: zu viele Teilstriche');
      if ((st.bis - st.von) / st.beschriftung > 13) m.push('Zahlengerade: zu viele beschriftete Striche');
      if (st.von <= 0 && st.bis >= 0 && (0 - st.von) % st.beschriftung !== 0) m.push('Zahlengerade: Die Null ist nicht beschriftet');
      if (!/^10*$/.test(String(T)) && (st.beschriftung % T !== 0 || st.von % T !== 0)) m.push('Zahlengerade: Mit Bruchteilen stehen nur die ganzen Zahlen an der Geraden');
      const aufStrich = (x) => ganz(x) && x >= st.von && x <= st.bis && (x - st.von) % st.schritt === 0;
      for (const x of [st.pfeil, st.start, ...(st.punkte ?? []), ...(st.spruenge ?? []).flatMap((s) => [s.von, s.nach])]) if (x != null && !aufStrich(x)) m.push(`Zahlengerade: ${x} liegt nicht auf einem Teilstrich`);
      for (const s of st.spruenge ?? []) if (s.text !== '?' && !gleich(wert(s.text), Q(s.nach - s.von, T))) m.push(`Zahlengerade: Sprung „${s.text}“ passt nicht zu seinem Bogen`);
      if (a.format === 'zahlenstrahl' && a.eingabe === 'markieren' && !aufStrich(a.loesung)) m.push('Zahlengerade: Die Lösung liegt nicht auf einem Teilstrich');
    }
  }
  const b = a.bild;
  if (b?.art === 'thermometer') {
    if (![b.von, b.bis, b.schritt, b.beschriftung].every(ganz) || !(b.von < 0 && b.bis > 0) || b.schritt < 1 || (b.bis - b.von) % b.schritt !== 0 || b.beschriftung % b.schritt !== 0 || b.von % b.beschriftung !== 0) m.push('Thermometer: Skala geht nicht auf');
    else {
      if ((b.bis - b.von) / b.schritt > 40 || (b.bis - b.von) / b.beschriftung > 10) m.push('Thermometer: zu viele Striche');
      if (!Array.isArray(b.saeulen) || b.saeulen.length < 1 || b.saeulen.length > 3) m.push('Thermometer: ein bis drei Thermometer');
      for (const s of b.saeulen ?? []) if (!ganz(s.wert) || s.wert < b.von || s.wert > b.bis || (s.wert - b.von) % b.schritt !== 0) m.push(`Thermometer: ${s.wert} liegt nicht auf einem Teilstrich`);
      if ((b.saeulen ?? []).length > 1 && new Set(b.saeulen.map((s) => s.name)).size !== b.saeulen.length) m.push('Thermometer: Mehrere Thermometer brauchen verschiedene Namen');
    }
  } else if (b?.art === 'gitter') m.push(...gitterMaengel(b));
  else if (b && b.art !== 'zahlenstrahl') m.push(`Bild ${b.art} gibt es in diesem Kapitel nicht`);
  if (a.gitter) m.push(...gitterMaengel(a.gitter));
  if (a.daten && (a.daten.art !== 'auszug' || !Array.isArray(a.daten.kopf) || !a.daten.zeilen?.length || a.daten.zeilen.some((z) => z.length !== a.daten.kopf.length))) m.push('Tabelle: Der Kontoauszug hat Kopf und gleich lange Zeilen');
  return m;
}
const imGitter = (g, p) => { const [ox, oy] = g.ursprung ?? [0, 0]; return Array.isArray(p) && ganz(p[0]) && ganz(p[1]) && p[0] >= -ox && p[0] <= g.b - ox && p[1] >= -oy && p[1] <= g.h - oy; };
function gitterMaengel(g) {
  const m = [];
  if (!ganz(g.b) || !ganz(g.h) || g.b < 4 || g.b > 20 || g.h < 4 || g.h > 20 || !g.achsen) m.push('Koordinatensystem: Größe oder Achsen fehlen');
  if (g.ursprung && !(ganz(g.ursprung[0]) && ganz(g.ursprung[1]) && g.ursprung[0] >= 0 && g.ursprung[0] <= g.b && g.ursprung[1] >= 0 && g.ursprung[1] <= g.h)) m.push('Koordinatensystem: Der Nullpunkt liegt außerhalb');
  for (const p of g.punkte ?? []) if (!imGitter(g, [p.x, p.y])) m.push(`Koordinatensystem: Punkt ${p.n} liegt außerhalb`);
  const orte = (g.punkte ?? []).map((p) => `${p.x},${p.y}`), namen = (g.punkte ?? []).map((p) => p.n);
  if (new Set(orte).size !== orte.length || new Set(namen).size !== namen.length) m.push('Koordinatensystem: Punkte oder Namen doppelt');
  return m;
}
// Was Bilder und Tabellen zeigen, als Zahlen ohne Vorzeichen.
function gezeigt(a) {
  const liste = [];
  const st = strahlVon(a);
  if (st) { const T = st.teiler ?? 1; for (const x of [st.von, st.bis, st.schritt, st.beschriftung, st.pfeil, st.start, ...(st.punkte ?? []), ...(st.spruenge ?? []).flatMap((s) => [s.von, s.nach, s.nach - s.von])]) if (x != null) liste.push(Q(Math.abs(x), T)); }
  if (a.bild?.art === 'thermometer') for (const s of a.bild.saeulen) liste.push(Q(Math.abs(s.wert)));
  for (const g of [a.gitter, a.bild?.art === 'gitter' ? a.bild : null]) for (const p of g?.punkte ?? []) liste.push(Q(Math.abs(p.x)), Q(Math.abs(p.y)));
  for (const zeile of [a.daten?.kopf ?? [], ...(a.daten?.zeilen ?? []), a.tabelle?.kopf ?? [], ...(a.tabelle?.zeilen ?? [])]) for (const c of zeile) if (typeof c !== 'object') liste.push(...zahlenIn(c));
  return liste.filter(Boolean);
}
const NEGATIV = /unter|Schulden|minus|Minus|Soll|tief|Keller|Untergeschoss|Tiefgarage|Verlust|Frost|kälter|Abbuchung|abgebucht|sinkt|fällt|weniger|links|vor Christus|zurück|überzogen/;
const POSITIV = /über|Guthaben|plus|Plus|Haben|Gewinn|wärmer|Gutschrift|steigt|mehr|rechts|nach Christus|vorwärts|Obergeschoss/;
const ROEMISCH = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] };
const polaritaet = (text) => (/^(Falsch|Nein|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Richtig|Ja)(?![a-zäöü])(?!, aber| nur)/.test(text) ? true : null);
const loesungsText = (x) => (typeof x === 'number' ? (x < 0 ? `−${-x}` : String(x)) : String(x));

// Prüft eine Aufgabe des Kapitels ganz: Format, Bild, Nachweis. Liefert die Liste der Mängel.
export function pruefeRationalAufgabe(a, fehlvorstellungen) {
  const m = [], M = (t) => m.push(t);
  const fvOk = (f) => { if (f && !(f in fehlvorstellungen)) M(`unbekannte Fehlvorstellung ${f}`); };
  const stufe = NIVEAUS.indexOf(a.niveau);
  const nachweis = Array.isArray(a.nachweis) ? a.nachweis : [];
  if (!nachweis.length) { M('Nachweis fehlt'); return m; }
  for (const x of bildMaengel(a)) M(x);
  const optionen = a.optionen ?? [];
  const texte = [a.text, ...optionen.map((o) => o.text), ...(a.teile ?? []).map((t) => t.text), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts]), ...(a.karten ?? [])];
  const gefuellt = a.format === 'luecken' ? a.text.replace(/\{\{(\w+)\}\}/g, (_, n) => (a.luecken?.[n] ? loesungsText(a.luecken[n].loesung) : '?')) : null;
  // Bekannt ist, was in der Aufgabe steht oder im Bild zu sehen ist (ohne Vorzeichen). Kleine feste Zahlen sind frei.
  const bekannt = new Set([0, 1, 2, 10, 100].map((n) => key(Q(n))));
  for (const v of [...texte.flatMap(zahlenIn), ...gezeigt(a), ...(gefuellt ? zahlenIn(gefuellt) : [])]) bekannt.add(key(v));
  for (const t of texte) for (const b of String(t).matchAll(/(?:(\d+) )?(\d+)⁄(\d+)/g)) for (const x of [b[1], b[2], b[3]]) if (x != null) bekannt.add(key(Q(Number(x))));
  const ergebnisse = new Map();
  const ergibt = (w) => { if (w) { ergebnisse.set(key(w), w); bekannt.add(key(abs(w))); } };
  const arten = new Set();
  const stufeEin = (trifft, was) => { for (const o of optionen) { const t = trifft(o); if (t == null) M(`Nachweis ${was}: Antwort „${o.text}“ lässt sich nicht einstufen`); else if (t !== o.richtig) M(`Nachweis ${was}: Antwort „${o.text}“ ist falsch eingestuft`); } };
  const punktVon = (name) => [a.gitter, a.bild?.art === 'gitter' ? a.bild : null].flatMap((g) => g?.punkte ?? []).find((p) => p.n === name);
  for (const n of nachweis) {
    if (typeof n === 'string') {
      arten.add('rechnung');
      const k = lies(n);
      if (!k || k.werte.length < 2) { M(`Nachweis: „${n}“ ist keine Rechnung`); continue; }
      if (!ketteOk(k)) M(`Nachweis: „${n}“ stimmt nicht`);
      for (const v of zahlenIn(seiten(n)[0])) if (!bekannt.has(key(v))) M(`Nachweis: ${v.z}${v.n > 1 ? `⁄${v.n}` : ''} kommt in der Aufgabe nicht vor („${n}“)`);
      k.werte.forEach((w, i) => { if (i > 0) ergibt(w); });
      continue;
    }
    if (!n || typeof n !== 'object' || !n.art) { M('Nachweis: unlesbarer Eintrag'); continue; }
    arten.add(n.art);
    switch (n.art) {
      case 'bild': { // Was das Bild zeigt: der Pfeil an der Zahlengeraden, ein Thermometer oder ein Punkt.
        const st = strahlVon(a), w = wert(String(n.wert));
        const zeigt = n.punkt ? (() => { const p = punktVon(n.punkt); return p ? [Q(p.x), Q(p.y)] : []; })()
          : a.bild?.art === 'thermometer' ? a.bild.saeulen.filter((s) => n.name == null || s.name === n.name).map((s) => Q(s.wert))
          : st ? [st.pfeil, st.start, ...(st.punkte ?? [])].filter((x) => x != null).map((x) => Q(x, st.teiler ?? 1)) : [];
        if (!w || !zeigt.some((z) => gleich(z, w))) M(`Nachweis bild: ${n.wert} ist im Bild nicht zu sehen`); else ergibt(w);
        break;
      }
      case 'angabe': { // Die Zahl steht so in der Aufgabe.
        const w = wert(String(n.wert));
        if (!w || !a.text.includes(String(n.wert))) M(`Nachweis angabe: ${n.wert} steht nicht in der Aufgabe`); else ergibt(w);
        break;
      }
      case 'kontext': { // Eine Angabe aus dem Alltag als Zahl mit Vorzeichen: Das Wort entscheidet über das Vorzeichen.
        const w = wert(String(n.betrag));
        if (!w || !bekannt.has(key(w)) || !a.text.includes(n.wort) || !(n.negativ ? NEGATIV : POSITIV).test(n.wort)) M('Nachweis kontext: Betrag oder Wort passt nicht zur Aufgabe');
        else ergibt(n.negativ ? Q(-w.z, w.n) : w);
        break;
      }
      case 'wert': { // Auswahl: Richtig ist genau die Antwort mit diesem Wert.
        const w = wert(String(n.wert));
        if (!w) { M(`Nachweis wert: „${n.wert}“ lässt sich nicht lesen`); break; }
        if (!ergebnisse.has(key(w))) M(`Nachweis wert: ${n.wert} ist kein Ergebnis einer Rechnung`);
        stufeEin((o) => { const v = wert(o.text.replace(/\.$/, '')); return v ? gleich(v, w) : null; }, 'wert');
        break;
      }
      case 'vergleich': {
        const l = wert(String(n.links)), r = wert(String(n.rechts));
        if (!l || !r) { M('Nachweis vergleich: Seite lässt sich nicht lesen'); break; }
        for (const s of [n.links, n.rechts]) for (const v of zahlenIn(String(s))) if (!bekannt.has(key(v))) M(`Nachweis vergleich: ${s} kommt in der Aufgabe nicht vor`);
        const d = vgl(l, r);
        stufeEin((o) => (['<', '>', '='].includes(o.text) ? o.text === (d < 0 ? '<' : d > 0 ? '>' : '=') : null), 'vergleich');
        break;
      }
      case 'urteil': { // „Stimmt das?“: Die Behauptung ist eine Kette. Eine Antwort „Falsch. Richtig ist: …“ nennt eine wahre Kette.
        const k = lies(n.behauptung);
        if (!k || k.werte.length < 2) { M(`Nachweis urteil: „${n.behauptung}“ ist keine Rechnung`); break; }
        if (ketteOk(k) !== n.stimmt) M('Nachweis urteil: Die Behauptung ist anders als angegeben');
        if (!ohneEinheiten(texte.join(' ')).replace(/\s/g, '').includes(ohneEinheiten(seiten(n.behauptung)[0]).replace(/\s/g, '')) && !n.ausBild) for (const v of zahlenIn(seiten(n.behauptung)[0])) if (!bekannt.has(key(v))) M('Nachweis urteil: Die Behauptung kommt in der Aufgabe nicht vor');
        stufeEin((o) => {
          const p = polaritaet(o.text);
          if (p == null) return null;
          if (p) return n.stimmt;
          const ks = rGleichungen(o.text);
          if (!ks.length) return !n.stimmt;
          return !n.stimmt && ks.every((x) => x.ok);
        }, 'urteil');
        if (!n.stimmt && optionen.filter((o) => polaritaet(o.text) === false).some((o) => !rGleichungen(o.text).length) && optionen.filter((o) => polaritaet(o.text) === false).length > 1) M('Nachweis urteil: Jede Antwort „Falsch“ braucht eine Rechnung');
        break;
      }
      case 'aussagen': // Jede Antwort ist eine Kette: richtig, wenn sie stimmt.
        stufeEin((o) => { const ks = rGleichungen(o.text); return ks.length === 1 && ks[0].lesbar ? ks[0].ok : null; }, 'aussagen');
        break;
      case 'extrem': { // Die größte oder kleinste Zahl unter den Antworten.
        const ws = optionen.map((o) => wert(o.text));
        if (ws.some((w) => !w)) { M('Nachweis extrem: Antwort lässt sich nicht lesen'); break; }
        const ziel = ws.reduce((x, y) => ((n.was === 'groesstes' ? vgl(y, x) > 0 : vgl(y, x) < 0) ? y : x));
        stufeEin((o) => gleich(wert(o.text), ziel), 'extrem');
        break;
      }
      case 'bereich': { // Zu welchen Zahlbereichen gehört die Zahl?
        const w = wert(String(n.zahl));
        if (!w || !a.text.includes(String(n.zahl))) { M('Nachweis bereich: Zahl fehlt in der Aufgabe'); break; }
        const inN = w.n === 1 && w.z >= 0, inZ = w.n === 1;
        stufeEin((o) => (/ℕ|natürliche/.test(o.text) ? inN : /ℤ|ganze/.test(o.text) ? inZ : /ℚ|rationale/.test(o.text) ? true : /keine/.test(o.text) ? false : null), 'bereich');
        break;
      }
      case 'quadrant': { // In welchem Quadranten liegt der Punkt?
        const p = n.punkt;
        // Mit `von` und `achse` ist der Punkt das Spiegelbild eines Punktes aus dem Text.
        const sp = n.von ? (n.achse === 'x' ? [n.von[0], -n.von[1]] : [-n.von[0], n.von[1]]) : null, quelle = n.von ?? p;
        if (!Array.isArray(p) || !a.text.includes(`(${loesungsText(quelle[0])}|${loesungsText(quelle[1])})`) || (sp && (sp[0] !== p[0] || sp[1] !== p[1] || !a.text.includes(`${n.achse}-Achse`)))) { M('Nachweis quadrant: Punkt fehlt in der Aufgabe'); break; }
        stufeEin((o) => { const r = o.text.match(/^(IV|III|II|I)\./)?.[1]; if (r) return p[0] !== 0 && p[1] !== 0 && Math.sign(p[0]) === ROEMISCH[r][0] && Math.sign(p[1]) === ROEMISCH[r][1]; return /x-Achse/.test(o.text) ? p[1] === 0 : /y-Achse/.test(o.text) ? p[0] === 0 : null; }, 'quadrant');
        break;
      }
      case 'punkt': { // Welche Koordinaten hat der Punkt im Bild?
        const p = punktVon(n.name);
        if (!p) { M(`Nachweis punkt: Punkt ${n.name} fehlt im Bild`); break; }
        stufeEin((o) => o.text === `(${loesungsText(p.x)}|${loesungsText(p.y)})`, 'punkt');
        break;
      }
      case 'punktwahl': { // Welcher Punkt im Bild hat diese Koordinaten?
        const p = n.punkt;
        if (!a.text.includes(`(${loesungsText(p[0])}|${loesungsText(p[1])})`)) { M('Nachweis punktwahl: Koordinaten fehlen in der Aufgabe'); break; }
        stufeEin((o) => { const q = punktVon(o.text); return q ? q.x === p[0] && q.y === p[1] : null; }, 'punktwahl');
        break;
      }
      case 'thermowahl': { // Welches Thermometer zeigt die höchste oder tiefste Temperatur?
        const ss = a.bild?.art === 'thermometer' ? a.bild.saeulen : [];
        if (ss.length < 2 || new Set(ss.map((s) => s.wert)).size !== ss.length) { M('Nachweis thermowahl: Es braucht mehrere verschiedene Thermometer'); break; }
        const ziel = ss.reduce((x, y) => ((n.was === 'waermstes' ? y.wert > x.wert : y.wert < x.wert) ? y : x));
        stufeEin((o) => { const s = ss.find((x) => o.text.replace(/\.$/, '') === x.name); return s ? s === ziel : null; }, 'thermowahl');
        break;
      }
      case 'nullfern': { // Welche Zahl ist am weitesten von der Null entfernt (oder am nächsten)?
        const ws = optionen.map((o) => wert(o.text));
        if (ws.some((w) => !w) || new Set(ws.map((w) => key(abs(w)))).size !== ws.length) { M('Nachweis nullfern: Antworten lassen sich nicht lesen oder sind gleich weit entfernt'); break; }
        const ziel = ws.reduce((x, y) => ((n.nah ? vgl(abs(y), abs(x)) < 0 : vgl(abs(y), abs(x)) > 0) ? y : x));
        stufeEin((o) => gleich(wert(o.text), ziel), 'nullfern');
        break;
      }
      case 'betragwahl': { // Welche Zahlen haben diesen Betrag?
        const w = wert(String(n.betrag));
        if (!w || !a.text.includes(String(n.betrag))) { M('Nachweis betragwahl: Betrag fehlt in der Aufgabe'); break; }
        stufeEin((o) => { const v = wert(o.text); return v ? gleich(abs(v), w) : null; }, 'betragwahl');
        break;
      }
      case 'spiegelwahl': { // Welche Koordinaten hat der Spiegelpunkt?
        const [x, y] = n.punkt, soll = n.achse === 'x' ? [x, -y] : n.achse === 'y' ? [-x, y] : [-x, -y];
        if (!a.text.includes(`(${loesungsText(x)}|${loesungsText(y)})`) || !a.text.includes(`${n.achse}-Achse`)) { M('Nachweis spiegelwahl: Punkt oder Achse fehlt in der Aufgabe'); break; }
        stufeEin((o) => o.text === `(${loesungsText(soll[0])}|${loesungsText(soll[1])})`, 'spiegelwahl');
        break;
      }
      case 'einsetzen': { // Welche Antwort macht die Kette wahr, wenn sie für das Kästchen eingesetzt wird?
        if (!a.text.includes(n.muster) || !n.muster.includes('▢')) { M('Nachweis einsetzen: Das Muster steht nicht in der Aufgabe'); break; }
        stufeEin((o) => { const k = lies(n.muster.replace('▢', o.text)); return k && k.werte.length > 1 ? ketteOk(k) : null; }, 'einsetzen');
        break;
      }
      case 'zaehle': { // Wie viele ganze Zahlen liegen zwischen zwei Zahlen?
        const u = wert(String(n.von)), o = wert(String(n.bis));
        if (!u || !o || !a.text.includes(String(n.von)) || !a.text.includes(String(n.bis)) || vgl(u, o) >= 0) { M('Nachweis zaehle: Grenzen fehlen in der Aufgabe'); break; }
        let anzahl = 0;
        for (let k = Math.ceil(u.z / u.n); k <= Math.floor(o.z / o.n); k++) if (vgl(Q(k), u) > 0 && vgl(Q(k), o) < 0) anzahl++;
        ergibt(Q(anzahl));
        break;
      }
      case 'frei': if (!n.grund) M('Nachweis frei: Grund fehlt'); break;
      case 'ordnung': case 'paare': case 'mauer': case 'eintragen': case 'spiegeln': case 'rechteck': case 'verschieben': case 'luecken': break;
      default: M(`Nachweis: unbekannte Art ${n.art}`);
    }
  }
  const istErgebnis = (x) => { const w = wert(loesungsText(x)); return Boolean(w) && ergebnisse.has(key(w)); };
  const pruefeFehler = (loesung, liste, was = '') => {
    const soll = wert(loesungsText(loesung));
    if (!soll) { M(`${was}Lösung „${loesung}“ lässt sich nicht lesen`); return; }
    if (typeof loesung === 'string' && !/^−?\d+,\d{1,4}$/.test(loesung) && a.format !== 'bruch') M(`${was}Lösung „${loesung}“ ist keine Dezimalzahl`);
    const gesehen = [];
    for (const f of liste ?? []) {
      const w = wert(loesungsText(f.wert));
      if (!w) M(`${was}typischer Fehler „${f.wert}“ lässt sich nicht lesen`);
      else if (gleich(w, soll)) M(`${was}typischer Fehler ist gleich der Lösung`);
      else if (gesehen.some((x) => gleich(x, w))) M(`${was}typischer Fehler doppelt`);
      else gesehen.push(w);
      fvOk(f.fehlvorstellung);
      if (!f.fehlvorstellung) M(`${was}typischer Fehler ohne Fehlvorstellung`);
    }
  };

  // ----- Formate -----
  switch (a.format) {
    case 'zahl':
      pruefeFehler(a.loesung, a.typischeFehler);
      if (!istErgebnis(a.loesung)) M('Nachweis: Die Lösung ist kein Ergebnis einer Rechnung');
      break;
    case 'bruch': {
      pruefeFehler(a.loesung, a.typischeFehler);
      if (!istErgebnis(a.loesung)) M('Nachweis: Die Lösung ist kein Ergebnis einer Rechnung');
      const b = String(a.loesung).match(/^−?(?:(\d+) )?(\d+)⁄(\d+)$/);
      if (!b) M('Bruch: Die Lösung ist kein Bruch'); else {
        if (ggt(Number(b[2]), Number(b[3])) !== 1) M('Bruch: Die Lösung ist nicht vollständig gekürzt');
        if (Number(b[2]) >= Number(b[3])) M('Bruch: Die Lösung steht als gemischte Zahl');
        if (Boolean(a.gemischt) !== Boolean(b[1])) M('Bruch: Merkmal „gemischt“ passt nicht zur Lösung');
      }
      if (!a.gekuerzt) M('Bruch: Das Ergebnis muss vollständig gekürzt sein (gekuerzt fehlt)');
      break;
    }
    case 'zahlenstrahl': {
      if (a.eingabe !== 'markieren') { M('Zahlengerade: In diesem Kapitel wird markiert'); break; }
      const T = a.strahl?.teiler ?? 1;
      if (!ganz(a.loesung)) { M('Zahlengerade: Lösung fehlt'); break; }
      if (!ergebnisse.has(key(Q(a.loesung, T)))) M('Nachweis: Die Lösung ist kein Ergebnis einer Rechnung');
      for (const f of a.typischeFehler ?? []) { fvOk(f.fehlvorstellung); if (f.wert === a.loesung || !ganz(f.wert) || f.wert < a.strahl.von || f.wert > a.strahl.bis) M('Zahlengerade: typischer Fehler ist gleich der Lösung oder liegt außerhalb'); }
      if (a.strahl?.pfeil != null || (a.strahl?.punkte ?? []).includes(a.loesung)) M('Zahlengerade: Das Bild verrät die Lösung');
      break;
    }
    case 'auswahl': {
      if (optionen.length < 2 || optionen.length > (a.mehrfach ? 5 : { F: 3, G: 3, M: 4, E: 5 }[a.niveau])) M('Auswahl: Anzahl der Antworten passt nicht');
      const richtige = optionen.filter((o) => o.richtig).length;
      if (a.mehrfach ? richtige < 1 : richtige !== 1) M('Auswahl: Anzahl der richtigen Antworten passt nicht');
      if (new Set(optionen.map((o) => o.text)).size !== optionen.length) M('Auswahl: Antwort doppelt');
      for (const o of optionen) { fvOk(o.fehlvorstellung); if (o.richtig && o.fehlvorstellung) M('Auswahl: richtige Antwort mit Fehlvorstellung'); }
      if (!a.mehrfach && !optionen.some((o) => o.fehlvorstellung)) M('Auswahl: keine falsche Antwort mit Fehlvorstellung');
      if (![...arten].some((x) => ['wert', 'vergleich', 'urteil', 'aussagen', 'extrem', 'bereich', 'quadrant', 'punkt', 'punktwahl', 'thermowahl', 'nullfern', 'betragwahl', 'spiegelwahl', 'einsetzen', 'frei'].includes(x))) M('Nachweis: Für die Auswahl fehlt eine Einstufung');
      break;
    }
    case 'luecken': case 'tabelle': {
      const namen = Object.keys(a.luecken ?? {});
      if (!namen.length) { M('Lücken fehlen'); break; }
      for (const n of namen) pruefeFehler(a.luecken[n].loesung, a.luecken[n].typischeFehler, `Lücke ${n}: `);
      if (a.format === 'luecken') {
        const imText = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
        if (imText.length !== namen.length || imText.some((n) => !namen.includes(n))) M('Lücken im Text und in der Lösung passen nicht zusammen');
        for (const g of rGleichungen(gefuellt)) if (!g.ok) M(`Lückentext: Mit den Lösungen stimmt „${g.ganz}“ nicht`);
        for (const n of namen) {
          const zeile = a.text.split('\n').find((z) => z.includes(`{{${n}}}`)) ?? '';
          if (!istErgebnis(a.luecken[n].loesung) && !(/[=<>]/.test(zeile) && /\d/.test(zeile))) M(`Nachweis: Lücke ${n} ist kein Ergebnis einer Rechnung`);
        }
      } else if (a.tabelle?.art === 'mauer') {
        // Zahlenmauer: Jeder Stein ist die Summe der beiden Steine darunter. Die oberste Reihe steht zuerst.
        const reihen = a.tabelle.zeilen.map((r) => r.map((c) => wert(loesungsText(typeof c === 'object' ? a.luecken[c.luecke]?.loesung : c))));
        if (reihen.flat().some((w) => !w) || reihen.some((r, i) => r.length !== i + 1)) M('Zahlenmauer: Stein lässt sich nicht lesen');
        else for (let i = 0; i < reihen.length - 1; i++) reihen[i].forEach((w, j) => { if (!gleich(w, plus(reihen[i + 1][j], reihen[i + 1][j + 1]))) M('Zahlenmauer: Ein Stein ist nicht die Summe der Steine darunter'); });
        // Eindeutig lösbar: Von unten oder von oben lässt sich jeder Stein erreichen (so viele feste Steine wie die unterste Reihe lang ist).
        const fest = a.tabelle.zeilen.flat().filter((c) => typeof c !== 'object').length;
        if (fest !== a.tabelle.zeilen.length) M('Zahlenmauer: Es stehen nicht genau so viele Steine fest, wie die unterste Reihe lang ist');
      } else {
        for (const n of namen) if (!istErgebnis(a.luecken[n].loesung)) M(`Nachweis: Lücke ${n} ist kein Ergebnis einer Rechnung`);
        const inTabelle = a.tabelle.zeilen.flat().filter((c) => typeof c === 'object').map((c) => c.luecke);
        if (inTabelle.length !== namen.length || inTabelle.some((n) => !namen.includes(n))) M('Lücken in der Tabelle und in der Lösung passen nicht zusammen');
      }
      break;
    }
    case 'ordnen': {
      const ws = (a.loesung ?? []).map((k) => wert(k));
      if (ws.length < 3 || ws.some((w) => !w)) { M('Ordnen: Karte lässt sich nicht lesen'); break; }
      if ([...(a.karten ?? [])].sort().join('|') !== [...a.loesung].sort().join('|') || a.karten.join('|') === a.loesung.join('|')) M('Ordnen: Karten und Lösung passen nicht zusammen');
      const ab = nachweis.find((n) => n?.art === 'ordnung')?.ab === true;
      if (!nachweis.some((n) => n?.art === 'ordnung')) M('Nachweis: Für das Ordnen fehlt die Richtung');
      for (let i = 1; i < ws.length; i++) if (ab ? vgl(ws[i - 1], ws[i]) <= 0 : vgl(ws[i - 1], ws[i]) >= 0) M('Ordnen: Die Lösung ist nicht richtig geordnet');
      if (ab ? !/größten/.test(a.text) : !/kleinsten/.test(a.text)) M('Ordnen: Der Text nennt die Richtung nicht');
      if (a.umgekehrt) fvOk(a.umgekehrt);
      break;
    }
    case 'zuordnen': {
      if ((a.paare ?? []).length < 3 || a.paare.length > 5) M('Zuordnen: drei bis fünf Paare');
      const frei = arten.has('frei');
      const rechts = [];
      for (const p of a.paare ?? []) {
        const l = wert(p.links), r = wert(p.rechts);
        if (l && r) { if (!gleich(l, r)) M(`Zuordnen: „${p.links}“ ist nicht ${p.rechts}`); rechts.push(key(r)); } else if (!frei) M(`Zuordnen: Paar „${p.links}“ lässt sich nicht nachrechnen`); else rechts.push(p.rechts);
      }
      if (new Set(rechts).size !== rechts.length) M('Zuordnen: Zwei Karten haben denselben Wert');
      break;
    }
    case 'gitter': {
      if (a.eingabe !== 'punkte' || !Array.isArray(a.loesung) || !a.loesung.length) { M('Koordinatensystem: Hier werden Punkte gesetzt'); break; }
      for (const p of a.loesung) if (!imGitter(a.gitter, p)) M('Koordinatensystem: Die Lösung liegt außerhalb');
      for (const f of a.typischeFehler ?? []) { fvOk(f.fehlvorstellung); for (const p of f.punkte) if (!imGitter(a.gitter, p)) M('Koordinatensystem: Ein typischer Fehler liegt außerhalb'); if (JSON.stringify(f.punkte) === JSON.stringify(a.loesung)) M('Koordinatensystem: typischer Fehler ist gleich der Lösung'); }
      const gegeben = (a.gitter.punkte ?? []).map((p) => [p.x, p.y]);
      if (a.loesung.some((p) => gegeben.some((q) => q[0] === p[0] && q[1] === p[1]))) M('Koordinatensystem: Das Bild verrät die Lösung');
      const n = nachweis.find((x) => ['eintragen', 'spiegeln', 'rechteck', 'verschieben'].includes(x?.art));
      const imText = [...a.text.matchAll(/\((−?\d+)\|(−?\d+)\)/g)].map((x) => [Number(x[1].replace('−', '-')), Number(x[2].replace('−', '-'))]);
      const selbe = (ps, qs) => ps.length === qs.length && ps.every((p) => qs.some((q) => q[0] === p[0] && q[1] === p[1]));
      if (!n) M('Nachweis: Für das Eintragen fehlt die Art');
      else if (n.art === 'eintragen') { if (!selbe(imText, a.loesung)) M('Nachweis eintragen: Die Punkte der Lösung stehen nicht im Text'); }
      else if (n.art === 'spiegeln') {
        const quelle = gegeben.length ? gegeben : imText;
        const soll = quelle.map(([x, y]) => (n.achse === 'x' ? [x, -y] : n.achse === 'y' ? [-x, y] : [-x, -y]));
        if (!selbe(soll, a.loesung) || (n.achse !== 'y' && !/x-Achse/.test(a.text)) || (n.achse !== 'x' && !/y-Achse/.test(a.text))) M('Nachweis spiegeln: Die Lösung ist nicht das Spiegelbild');
      } else if (n.art === 'rechteck') {
        const ps = [...(gegeben.length ? gegeben : imText), ...a.loesung];
        const xs = [...new Set(ps.map((p) => p[0]))], ys = [...new Set(ps.map((p) => p[1]))];
        if (ps.length !== 4 || xs.length !== 2 || ys.length !== 2 || new Set(ps.map(String)).size !== 4) M('Nachweis rechteck: Die vier Punkte bilden kein Rechteck an den Gitterlinien');
      } else if (n.art === 'verschieben') {
        const von = punktVon(n.name);
        if (!von || a.loesung.length !== 1 || a.loesung[0][0] !== von.x + n.um[0] || a.loesung[0][1] !== von.y + n.um[1] || !zahlenIn(a.text).some((v) => gleich(v, Q(Math.abs(n.um[0] || n.um[1]))))) M('Nachweis verschieben: Die Lösung passt nicht zum Weg');
      }
      break;
    }
    case 'sachaufgabe': {
      if (!(a.teile ?? []).length) M('Sachaufgabe ohne Teile');
      (a.teile ?? []).forEach((t, i) => {
        if (t.optionen) { M('Sachaufgabe: In diesem Kapitel sind die Teile Zahlen'); return; }
        pruefeFehler(t.loesung, t.typischeFehler, `Teil ${i + 1}: `);
        if (!istErgebnis(t.loesung)) M(`Nachweis: Teil ${i + 1} ist kein Ergebnis einer Rechnung`);
      });
      break;
    }
    default: M(`Format ${a.format} gibt es in diesem Kapitel nicht`);
  }
  // Was in der Aufgabe als Rechnung dasteht, muss stimmen, außer es wird gerade geprüft („Stimmt das?“) oder verglichen.
  if (['zahl', 'bruch', 'sachaufgabe', 'zahlenstrahl', 'gitter'].includes(a.format)) for (const g of rGleichungen(a.text)) if (!g.ok && g.danach !== '?') M(`Im Aufgabentext stimmt „${g.ganz}“ nicht`);
  return m;
}
