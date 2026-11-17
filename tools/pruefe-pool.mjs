// Prüft eine Aufgabenpool-Datei auf Aufbau, Abdeckung und Rechenfehler.
// Aufruf: node tools/pruefe-pool.mjs aufgabenpool/klasse-5.json

import { readFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(process.argv[2] ?? 'aufgabenpool/klasse-5.json', 'utf8'));
const fehler = [];
const melde = (id, text) => fehler.push(`${id}: ${text}`);
const NIVEAUS = ['F', 'G', 'M', 'E'];
const MINDESTENS = 6;
const zahlAus = (s) => Number(s.replace(/[  ]/g, ''));

const lernziele = new Map();
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  if (lernziele.has(l.id)) melde(l.id, 'Lernziel-ID doppelt');
  lernziele.set(l.id, 0);
}

const pruefeZahl = (id, a) => {
  if (!Number.isInteger(a.loesung) || a.loesung < 0) melde(id, 'Lösung ist keine natürliche Zahl');
  for (const f of a.typischeFehler ?? []) {
    if (f.wert === a.loesung) melde(id, 'typischer Fehler ist gleich der Lösung');
    if (!(f.fehlvorstellung in pool.fehlvorstellungen)) melde(id, `unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  const werte = (a.typischeFehler ?? []).map((f) => f.wert);
  if (new Set(werte).size !== werte.length) melde(id, 'typischer Fehler doppelt');
};

// Rechnet einen Ausdruck aus Zahlen, +, − und Klammern unabhängig vom Erzeuger nach.
const rechne = (ausdruck) => {
  const js = ausdruck.replace(/[\s\u00a0\u202f]/g, '').replace(/−/g, '-').replace(/\[/g, '(').replace(/\]/g, ')');
  if (!/^[\d+\-() ]+$/.test(js)) return NaN;
  try { return Function(`"use strict"; return (${js});`)(); } catch { return NaN; }
};
const NUR_ZAHLEN = /^([\d\s\u00a0\u202f]+) ([−:+]) ([\d\s\u00a0\u202f]+) = ([\d\s\u00a0\u202f]+)$/;

// ---------- Regeln für klar getrennte Niveaustufen (docs/adr/0009) ----------
// Sie gelten für die Stationen, die schon nach den neuen Regeln erzeugt sind.
const NEUE_REGELN = (lernziel) => lernziel.startsWith('5.4.5');
const AFB_FOLGE = [1, 2, 2, 1, 2, 3];
const KARTEN = { F: ['tipp', 'beispiel', 'loesungsschritt'], G: ['tipp', 'beispiel', 'loesungsschritt'], M: ['tipp', 'loesungsschritt'], E: ['tipp'] };
const pruefeHilfen = (a) => {
  const soll = NEUE_REGELN(a.lernziel) ? KARTEN[a.niveau] ?? [] : KARTEN.F;
  for (const h of soll) if (!a.hilfen?.[h]?.trim()) melde(a.id, `Hilfekärtchen ${h} fehlt`);
  for (const h of Object.keys(a.hilfen ?? {})) if (!soll.includes(h)) melde(a.id, `Hilfekärtchen ${h} ist auf Niveaustufe ${a.niveau} nicht vorgesehen`);
};
// Fachwörter, die erst ab einer höheren Stufe im Wortspeicher stehen.
const ERST_AB = { G: ['Quotient', 'Überschlag', 'schriftlich'], M: ['Dividend', 'Divisor', 'Umkehraufgabe'], E: ['Term', 'teilbar', 'Vielfache'] };
const NEBENSATZ = /,\s(weil|dass|wenn|damit|obwohl|sodass|ob|der|die|das|denen|deren)\s/;
const alleTexte = (a) => [a.text, ...(a.optionen ?? []).map((o) => o.text), ...(a.teile ?? []).map((t) => t.text), ...(a.paare ?? []).flatMap((p) => [p.links, p.rechts])];
const pruefeStufe = (a) => {
  const stufe = NIVEAUS.indexOf(a.niveau);
  const texte = alleTexte(a), mitHilfen = [...texte, ...Object.values(a.hilfen ?? {})];
  // Wortschatz: keine Fachwörter höherer Stufen, auch nicht in den Hilfekärtchen.
  for (const [ab, woerter] of Object.entries(ERST_AB)) if (NIVEAUS.indexOf(ab) > stufe) {
    for (const wort of woerter) if (mitHilfen.some((t) => t.includes(wort))) melde(a.id, `Wort „${wort}“ gehört erst ab Niveaustufe ${ab} in den Wortspeicher`);
  }
  // Einfache Sprache auf F und G: kurze Sätze, jeder Satz in einer eigenen Zeile, keine Nebensätze.
  if (stufe <= 1) for (const t of texte) for (const zeile of t.split('\n')) {
    const saetze = zeile.replace(/\{\{\w+\}\}/g, 'x').split(/(?<=[.?!])\s+(?=[A-ZÄÖÜ„])/).filter(Boolean);
    if (saetze.length > 1) melde(a.id, `einfache Sprache: mehrere Sätze in einer Zeile („${zeile}“)`);
    if (zeile.split(/\s+/).length > 14) melde(a.id, `einfache Sprache: Zeile mit mehr als 14 Wörtern („${zeile}“)`);
    if (NEBENSATZ.test(zeile)) melde(a.id, `einfache Sprache: Nebensatz („${zeile}“)`);
  }
  // Zahlenraum: F bis 100 und glatte Zehner bis 1000, G bis 1000 (schriftlich bis 10 000), M und E bis 1 Million.
  const zahlen = [...texte.join(' ').matchAll(/\d[\d\u00a0]*/g)].map((m) => zahlAus(m[0]));
  for (const n of [...zahlen, a.loesung, ...Object.values(a.luecken ?? {}).map((l) => l.loesung), ...(a.teile ?? []).map((t) => t.loesung)].filter((n) => typeof n === 'number')) {
    const ok = stufe === 0 ? n <= 100 || (n <= 1000 && n % 10 === 0) : stufe === 1 ? n <= (a.text.includes('schriftlich') ? 10000 : 1000) : n <= 1000000;
    if (!ok) melde(a.id, `Zahl ${n} liegt außerhalb des Zahlenraums der Niveaustufe ${a.niveau}`);
  }
  // Nie schriftlich auf F.
  if (stufe === 0 && mitHilfen.some((t) => /schriftlich/i.test(t))) melde(a.id, 'auf F wird nicht schriftlich gerechnet');
  // Nachrechnen: reine Divisionen, Lückenaufgaben und alle Gleichungen in richtigen Antworten.
  const letzte = a.text.split('\n').at(-1);
  let m;
  if (a.format === 'zahl' && (m = letzte.match(/^(?:Dividiere schriftlich: )?([\d\u00a0]+) : (\d+)$/)) && zahlAus(m[1]) / Number(m[2]) !== a.loesung) melde(a.id, 'Quotient falsch');
  if (a.format === 'zahl' && (m = a.text.match(/▢ : (\d+) = (\d+)(?: Rest (\d+))?$/)) && Number(m[1]) * Number(m[2]) + Number(m[3] ?? 0) !== a.loesung) melde(a.id, 'Umkehraufgabe falsch');
  if (a.format === 'zahl' && (m = a.text.match(/(\d+) : ▢ = (\d+)$/)) && Number(m[1]) / Number(m[2]) !== a.loesung) melde(a.id, 'fehlender Divisor falsch');
  if (a.format === 'luecken' && (m = a.text.match(/^([\d\u00a0]+) : (\d+) = \{\{q\}\} Rest \{\{r\}\}$/))) {
    const [x, d] = [zahlAus(m[1]), Number(m[2])];
    if (Math.floor(x / d) !== a.luecken.q.loesung || x % d !== a.luecken.r.loesung || a.luecken.r.loesung >= d) melde(a.id, 'Division mit Rest falsch');
  }
  const GLEICHUNG = /([\d\u00a0]+) ([:·+−]) ([\d\u00a0]+)(?: ([+−]) ([\d\u00a0]+))? (?:€ )?= ([\d\u00a0]+)(?: Rest (\d+))?/g;
  for (const o of (a.optionen ?? []).filter((x) => x.richtig)) for (const g of o.text.matchAll(GLEICHUNG)) {
    const [x, y, r] = [g[1], g[3], g[6]].map(zahlAus);
    let wert = g[2] === ':' ? Math.floor(x / y) : g[2] === '·' ? x * y : g[2] === '+' ? x + y : x - y;
    if (g[4]) wert += (g[4] === '+' ? 1 : -1) * zahlAus(g[5]);
    if (wert !== r || (g[2] === ':' && x % y !== Number(g[7] ?? 0))) melde(a.id, `Gleichung in der richtigen Antwort stimmt nicht: ${g[0]}`);
  }
  for (const h of Object.values(a.hilfen ?? {})) for (const g of h.matchAll(GLEICHUNG)) {
    if (/= \d+(?: Rest \d+)?\?/.test(h)) continue; // vorgeführte falsche Rechnung („20 : 4 = 6?“)
    const [x, y, r] = [g[1], g[3], g[6]].map(zahlAus);
    let wert = g[2] === ':' ? Math.floor(x / y) : g[2] === '·' ? x * y : g[2] === '+' ? x + y : x - y;
    if (g[4]) wert += (g[4] === '+' ? 1 : -1) * zahlAus(g[5]);
    if (wert !== r || (g[2] === ':' && x % y !== Number(g[7] ?? 0))) melde(a.id, `Gleichung im Hilfekärtchen stimmt nicht: ${g[0]}`);
  }
};

const ids = new Set();
const anzahl = new Map();
for (const a of pool.aufgaben) {
  if (ids.has(a.id)) melde(a.id, 'ID doppelt');
  ids.add(a.id);
  if (!lernziele.has(a.lernziel)) melde(a.id, `unbekanntes Lernziel ${a.lernziel}`);
  if (!NIVEAUS.includes(a.niveau)) melde(a.id, `unbekannte Niveaustufe ${a.niveau}`);
  if (![1, 2, 3].includes(a.afb)) melde(a.id, `Anforderungsbereich fehlt oder ist ungültig: ${a.afb}`);
  if (!a.id.startsWith(`${a.lernziel}-${a.niveau}-`)) melde(a.id, 'ID passt nicht zu Lernziel und Niveaustufe');
  if (!a.text?.trim()) melde(a.id, 'Text fehlt');
  pruefeHilfen(a);
  if (NEUE_REGELN(a.lernziel)) pruefeStufe(a);
  const schluessel = `${a.lernziel} ${a.niveau}`;
  anzahl.set(schluessel, (anzahl.get(schluessel) ?? 0) + 1);

  if (a.format === 'zahl') {
    pruefeZahl(a.id, a);
    // Reine Rechenaufgaben unabhängig nachrechnen.
    let m;
    if ((m = a.text.match(/^Subtrahiere schriftlich: (.+) − (.+)$/)) && zahlAus(m[1]) - zahlAus(m[2]) !== a.loesung) melde(a.id, 'Differenz falsch');
    if ((m = a.text.match(/^Dividiere schriftlich: (.+) : (.+)$/)) && zahlAus(m[1]) / zahlAus(m[2]) !== a.loesung) melde(a.id, 'Quotient falsch');
    if ((m = a.text.match(/^(?:Berechne|Rechne im Kopf|Rechne geschickt|Rechne vorteilhaft|Addiere schriftlich): (.+)$/)) && rechne(m[1]) !== a.loesung) melde(a.id, `Rechnung falsch: ${m[1]} ist ${rechne(m[1])}`);
    if ((m = a.text.match(/^Wie viel fehlt von (.+) bis (.+)\?$/)) && zahlAus(m[2]) - zahlAus(m[1]) !== a.loesung) melde(a.id, 'Ergänzung falsch');
  } else if (a.format === 'auswahl') {
    const richtige = a.optionen.filter((o) => o.richtig).length;
    if (a.optionen.length < 3) melde(a.id, 'weniger als drei Optionen');
    if (richtige < 1) melde(a.id, 'keine richtige Option');
    if (!a.mehrfach && richtige !== 1) melde(a.id, 'Einfachauswahl braucht genau eine richtige Option');
    if (new Set(a.optionen.map((o) => o.text)).size !== a.optionen.length) melde(a.id, 'Option doppelt');
    for (const o of a.optionen) {
      if (o.fehlvorstellung && !(o.fehlvorstellung in pool.fehlvorstellungen)) melde(a.id, `unbekannte Fehlvorstellung ${o.fehlvorstellung}`);
      // Rechnungen in den Optionen nachrechnen: "falsch" muss wirklich falsch sein.
      let m;
      if (a.mehrfach && a.text.includes('falsch') && (m = o.text.match(NUR_ZAHLEN))) {
        const [x, y, r] = [m[1], m[3], m[4]].map(zahlAus);
        const stimmt = (m[2] === '−' ? x - y : m[2] === '+' ? x + y : x / y) === r;
        if (stimmt === o.richtig) melde(a.id, `Option "${o.text}" ist falsch eingestuft`);
      }
      // "Welche Gleichungen stimmen?": beide Seiten ausrechnen.
      if (a.text.startsWith('Welche Gleichungen stimmen')) {
        const [links, rechts] = o.text.split(' = ').map(rechne);
        if (Number.isNaN(links) || Number.isNaN(rechts) || (links === rechts) !== o.richtig) melde(a.id, `Gleichung "${o.text}" ist falsch eingestuft`);
      }
    }
  } else if (a.format === 'luecken') {
    const namen = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
    if (namen.length === 0) melde(a.id, 'keine Lücke im Text');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n]);
    // Gleichungen mit einer Lücke: Lösung einsetzen und beide Seiten ausrechnen.
    if (namen.length === 1 && a.text.includes(' = ') && /[+−]/.test(a.text) && !a.text.includes('Rest')) {
      const [links, rechts] = a.text.replace(/\{\{\w+\}\}/, String(a.luecken[namen[0]]?.loesung)).split(' = ').map(rechne);
      if (Number.isNaN(links) || links !== rechts) melde(a.id, 'Lückengleichung geht nicht auf');
    }
    const m = a.text.match(/^(\d+) : (\d+) = \{\{q\}\} Rest \{\{r\}\}$/);
    if (m && (Math.floor(m[1] / m[2]) !== a.luecken.q.loesung || m[1] % m[2] !== a.luecken.r.loesung)) melde(a.id, 'Division mit Rest falsch');
  } else if (a.format === 'zuordnen') {
    if ((a.paare?.length ?? 0) < 2) melde(a.id, 'zu wenige Paare');
    for (const seite of ['links', 'rechts']) if (new Set(a.paare.map((p) => p[seite])).size !== a.paare.length) melde(a.id, `Paare ${seite} nicht eindeutig`);
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
    for (const sp of st.spruenge ?? []) {
      const m = sp.text.match(/^([+−]) (\d+)$/);
      if (!m || sp.von + (m[1] === '+' ? 1 : -1) * Number(m[2]) !== sp.nach) melde(a.id, 'Zahlenstrahl: Sprung passt nicht zu seiner Beschriftung');
    }
    let m;
    if ((m = a.text.match(/^Starte bei (\d+) und springe (\d+) (weiter|zurück)/))) {
      if (Number(m[1]) !== st.start || Number(m[1]) + (m[3] === 'weiter' ? 1 : -1) * Number(m[2]) !== a.loesung) melde(a.id, 'Zahlenstrahl: Sprung im Text passt nicht zur Lösung');
    }
  } else if (a.format === 'diagramm') {
    const d = a.diagramm ?? {};
    if (!d.titel || !d.einheit || !(d.max > 0) || !(d.schritt > 0) || d.max % d.schritt !== 0) melde(a.id, 'Diagramm: Titel, Einheit oder Achse fehlt');
    if ((d.saeulen?.length ?? 0) < 2) melde(a.id, 'Diagramm braucht mindestens zwei Säulen');
    // Ablesbar ist ein Wert nur auf einer Linie, einer Hilfslinie oder genau in der Mitte dazwischen.
    const raster = d.werteZeigen ? 1 : d.hilfslinien ? d.schritt / 4 : d.schritt / 2;
    for (const sa of d.saeulen ?? []) if (!(sa.wert > 0) || sa.wert > d.max || sa.wert % raster !== 0) melde(a.id, `Diagramm: Wert ${sa.wert} lässt sich nicht ablesen`);
    if ((a.teile?.length ?? 0) < 1) melde(a.id, 'Diagramm braucht mindestens eine Frage');
    for (const t of a.teile ?? []) { if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt'); pruefeZahl(a.id, t); }
    // Standardfragen nachrechnen.
    const werte = (d.saeulen ?? []).map((sa) => sa.wert);
    for (const t of a.teile ?? []) {
      if (/an allen vier|in allen vier/.test(t.text) && werte.reduce((s, x) => s + x, 0) !== t.loesung) melde(a.id, 'Diagramm: Gesamtsumme falsch');
    }
  } else if (a.format === 'tabelle') {
    const t = a.tabelle ?? {};
    const zellen = (t.zeilen ?? []).flat();
    if (!t.kopf?.length || (t.zeilen ?? []).some((z) => z.length !== t.kopf.length)) melde(a.id, 'Tabelle: Zeilen passen nicht zur Kopfzeile');
    const namen = zellen.filter((c) => typeof c === 'object').map((c) => c.luecke);
    if (namen.length === 0) melde(a.id, 'Tabelle ohne Lücke');
    if (new Set(namen).size !== namen.length) melde(a.id, 'Tabelle: Lücke doppelt');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n]);
    for (const n of Object.keys(a.luecken ?? {})) if (!namen.includes(n)) melde(a.id, `Lösung ${n} ohne Lücke in der Tabelle`);
    // Bekannte Tabellenarten nachrechnen.
    const zeichen = t.kopf?.[0];
    for (const zeile of t.zeilen ?? []) zeile.forEach((c, k) => {
      if (typeof c !== 'object') return;
      const l = a.luecken?.[c.luecke]?.loesung, links = zahlAus(String(zeile[0])), oben = zahlAus(String(t.kopf[k]));
      if (zeichen === '+' && links + oben !== l) melde(a.id, 'Additionstabelle falsch');
      if (zeichen === '−' && links - oben !== l) melde(a.id, 'Subtraktionstabelle falsch');
      if (t.kopf[k] === 'Gesamt' && zeile.slice(1, k).reduce((s, x) => s + zahlAus(String(x)), 0) !== l) melde(a.id, 'Tabelle: Gesamt falsch');
      if (t.kopf[k] === 'fehlt bis 1000' && 1000 - links !== l) melde(a.id, 'Tabelle: Ergänzung falsch');
      if (t.kopf[k] === 'a − (b + c)' && Number(zeile[0]) - (Number(zeile[1]) + Number(zeile[2])) !== l) melde(a.id, 'Tabelle: Rechenausdruck falsch');
    });
  } else melde(a.id, `unbekanntes Format ${a.format}`);
}

// Abdeckung: Jedes Lernziel mit Aufgaben braucht auf jeder Niveaustufe genug Aufgaben.
const mitAufgaben = new Set(pool.aufgaben.map((a) => a.lernziel));
for (const l of mitAufgaben) for (const n of NIVEAUS) {
  const k = anzahl.get(`${l} ${n}`) ?? 0;
  if (k < MINDESTENS) melde(l, `nur ${k} Aufgaben auf Niveaustufe ${n}, nötig sind ${MINDESTENS}`);
}

// Anforderungsbereiche: je Lernziel und Stufe die Folge I, II, II, I, II, III.
for (const l of mitAufgaben) if (NEUE_REGELN(l)) for (const n of NIVEAUS) {
  const folge = pool.aufgaben.filter((a) => a.lernziel === l && a.niveau === n).sort((a, b) => a.id.localeCompare(b.id)).map((a) => a.afb);
  if (folge.join() !== AFB_FOLGE.join()) melde(`${l} ${n}`, `Anforderungsbereiche ${folge.join(', ')} statt ${AFB_FOLGE.join(', ')}`);
}
// Wortspeicher: Stationen nach den neuen Regeln brauchen einen, mit Wörtern für jede Stufe.
for (const k of pool.kapitel) for (const u of k.unterkapitel) if (u.lernziele.some((l) => NEUE_REGELN(l.id) && mitAufgaben.has(l.id))) {
  for (const n of NIVEAUS) if (!(u.wortspeicher ?? []).some((w) => w.ab === n && w.wort && w.erklaerung)) melde(u.id, `Wortspeicher ohne Wörter ab Niveaustufe ${n}`);
}

if (fehler.length) { console.error(fehler.join('\n')); console.error(`\n${fehler.length} Fehler.`); process.exit(1); }
console.log(`In Ordnung: ${pool.aufgaben.length} Aufgaben zu ${mitAufgaben.size} Lernzielen, ${lernziele.size} Lernziele im Jahresplan.`);
