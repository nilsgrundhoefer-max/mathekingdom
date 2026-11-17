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

const ids = new Set();
const anzahl = new Map();
for (const a of pool.aufgaben) {
  if (ids.has(a.id)) melde(a.id, 'ID doppelt');
  ids.add(a.id);
  if (!lernziele.has(a.lernziel)) melde(a.id, `unbekanntes Lernziel ${a.lernziel}`);
  if (!NIVEAUS.includes(a.niveau)) melde(a.id, `unbekannte Niveaustufe ${a.niveau}`);
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
    if ((m = a.text.match(/^Berechne: (.+)$/))) {
      const [erste, ...rest] = m[1].split(' − ').map(zahlAus);
      if (rest.reduce((s, x) => s - x, erste) !== a.loesung) melde(a.id, 'Kettenrechnung falsch');
    }
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
      if (a.mehrfach && (m = o.text.match(/^(.+) ([−:]) (.+) = (.+)$/))) {
        const [x, y, r] = [m[1], m[3], m[4]].map(zahlAus);
        const stimmt = (m[2] === '−' ? x - y : x / y) === r;
        if (stimmt === o.richtig) melde(a.id, `Option "${o.text}" ist falsch eingestuft`);
      }
    }
  } else if (a.format === 'luecken') {
    const namen = [...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]);
    if (namen.length === 0) melde(a.id, 'keine Lücke im Text');
    for (const n of namen) if (!a.luecken?.[n]) melde(a.id, `Lücke ${n} hat keine Lösung`); else pruefeZahl(a.id, a.luecken[n]);
    const m = a.text.match(/^(\d+) : (\d+) = \{\{q\}\} Rest \{\{r\}\}$/);
    if (m && (Math.floor(m[1] / m[2]) !== a.luecken.q.loesung || m[1] % m[2] !== a.luecken.r.loesung)) melde(a.id, 'Division mit Rest falsch');
  } else if (a.format === 'zuordnen') {
    if ((a.paare?.length ?? 0) < 2) melde(a.id, 'zu wenige Paare');
    for (const seite of ['links', 'rechts']) if (new Set(a.paare.map((p) => p[seite])).size !== a.paare.length) melde(a.id, `Paare ${seite} nicht eindeutig`);
  } else if (a.format === 'sachaufgabe') {
    if ((a.teile?.length ?? 0) < 2) melde(a.id, 'Sachaufgabe braucht mindestens zwei Teile');
    for (const t of a.teile ?? []) { if (!t.text?.trim()) melde(a.id, 'Teilfrage fehlt'); pruefeZahl(a.id, t); }
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
