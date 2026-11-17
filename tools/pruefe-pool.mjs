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
  for (const h of ['tipp', 'beispiel', 'loesungsschritt']) if (!a.hilfen?.[h]?.trim()) melde(a.id, `Hilfekärtchen ${h} fehlt`);
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

if (fehler.length) { console.error(fehler.join('\n')); console.error(`\n${fehler.length} Fehler.`); process.exit(1); }
console.log(`In Ordnung: ${pool.aufgaben.length} Aufgaben zu ${mitAufgaben.size} Lernzielen, ${lernziele.size} Lernziele im Jahresplan.`);
