// Aufgabenanalyse, Feedback und Export „Teststunde“ für das Administrator-Dashboard (ADR 0042). Reine Logik.
// Nie mit Namen oder Schülercodes: Gezählt werden Speicherstände, Versuche und Antworten.
//
// klassen: [{ klasse, staende: [{ code, stand }] }]   aufgaben: alle Aufgaben aus allen Pools

import { falscheTeile } from './statistik.js';
import { FEEDBACK_FRAGEN, tagVon } from '../schueler/logik.js';

export const MIN_BEARBEITUNGEN = 3;   // ab so vielen Bearbeitungen wird eine Aufgabe markiert
export const DAUER_FAKTOR = 2;        // doppelt so lange wie die übrigen Aufgaben ihres Lernziels und Niveaus
export const DAUER_MIN_PLUS = 20;     // und mindestens 20 Sekunden länger
export const QUOTE_ABSTAND = 0.35;    // so viel seltener gelöst als die übrigen

const anteil = (a, b) => (b ? a / b : null);
const median = (werte) => {
  const w = werte.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!w.length) return null;
  const m = Math.floor(w.length / 2);
  return w.length % 2 ? w[m] : (w[m - 1] + w[m]) / 2;
};
const prozent = (x) => (x == null ? '–' : `${Math.round(x * 100)} %`);
const sekunden = (x) => (x == null ? '–' : `${Math.round(x)} s`);

// Eine ungewöhnliche Eingabe (etwa von simulierten Schülern einer Testklasse) darf die Analyse nicht abbrechen.
const sichereTeile = (a, eingabe) => { try { return falscheTeile(a, eingabe); } catch { return []; } };

// Zeitraum: { tag: 'JJJJ-MM-TT' } für einen Tag (Ortszeit), sonst alles.
export const imZeitraum = (t, zeitraum = {}) => !zeitraum.tag || (t && tagVon(t) === zeitraum.tag);

// Je Aufgabe die Zahlen im Zeitraum, dazu Vergleich mit den übrigen Aufgaben desselben Lernziels und Niveaus.
export function aufgabenanalyse(klassen, aufgaben, zeitraum = {}) {
  const nach = new Map(aufgaben.map((a) => [a.id, a]));
  const je = new Map();
  const e = (id) => {
    if (!je.has(id)) je.set(id, { aufgabe: id, bearbeitet: 0, ersterVersuch: 0, geloest: 0, dauern: [], hilfen: 0, abbrueche: 0, wer: new Set(), falsch: new Map(), schwer: [0, 0] });
    return je.get(id);
  };
  let nr = 0;
  const schueler = new Set(), bearbeiter = new Set();
  for (const k of klassen) for (const { stand } of k.staende ?? []) {
    const wer = ++nr; // nur eine laufende Nummer, kein Code
    schueler.add(wer);
    for (const v of stand.versuche ?? []) {
      if (v.gesperrt || !imZeitraum(v.t, zeitraum)) continue;
      const x = e(v.aufgabe);
      x.bearbeitet++; x.wer.add(wer); bearbeiter.add(wer);
      if (v.richtig) x.geloest++;
      if (v.richtig && (v.versuche ?? 1) === 1) x.ersterVersuch++;
      if (typeof v.dauer === 'number') x.dauern.push(v.dauer);
      x.hilfen += v.hilfen ?? 0;
      const falsche = v.richtig ? (v.eingaben ?? []).slice(0, -1) : v.eingaben ?? [];
      for (const f of falsche) for (const { text } of sichereTeile(nach.get(v.aufgabe), f)) x.falsch.set(text, (x.falsch.get(text) ?? 0) + 1);
    }
    for (const ab of stand.abbrueche ?? []) if (imZeitraum(ab.t, zeitraum)) { const x = e(ab.aufgabe); x.abbrueche++; x.wer.add(wer); }
    for (const f of stand.feedback ?? []) if (f.frage === 'schwer' && f.aufgabe && imZeitraum(f.t, zeitraum)) e(f.aufgabe).schwer[f.antwort === 0 ? 0 : 1]++;
  }
  const zeilen = [...je.values()].map((x) => {
    const a = nach.get(x.aufgabe);
    return { aufgabe: x.aufgabe, lernziel: a?.lernziel ?? null, niveau: a?.niveau ?? null, format: a?.format ?? null, afb: a?.afb ?? null,
      bearbeitet: x.bearbeitet, schueler: x.wer.size, quote: anteil(x.geloest, x.bearbeitet), ersterVersuch: anteil(x.ersterVersuch, x.bearbeitet),
      dauer: median(x.dauern), hilfen: anteil(x.hilfen, x.bearbeitet), abbrueche: x.abbrueche,
      falsch: [...x.falsch].sort((p, q) => q[1] - p[1]).slice(0, 3), zuSchwer: { ja: x.schwer[0], nein: x.schwer[1] }, gruende: [] };
  });
  // Vergleichsgruppe: Lernziel und Niveau.
  const gruppen = new Map();
  for (const z of zeilen) if (z.lernziel && z.bearbeitet >= MIN_BEARBEITUNGEN) { const k = `${z.lernziel}|${z.niveau}`; if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(z); }
  for (const z of zeilen) {
    const andere = (gruppen.get(`${z.lernziel}|${z.niveau}`) ?? []).filter((x) => x !== z);
    z.vergleichDauer = median(andere.map((x) => x.dauer));
    z.vergleichQuote = median(andere.map((x) => x.quote));
    if (z.bearbeitet >= MIN_BEARBEITUNGEN) {
      if (z.dauer != null && z.vergleichDauer != null && z.dauer >= DAUER_FAKTOR * z.vergleichDauer && z.dauer - z.vergleichDauer >= DAUER_MIN_PLUS) {
        z.gruende.push(`dauert lange: im Mittel ${sekunden(z.dauer)}, die übrigen Aufgaben dieses Lernziels und Niveaus ${sekunden(z.vergleichDauer)}`);
      }
      if (z.quote != null && z.vergleichQuote != null && z.vergleichQuote - z.quote >= QUOTE_ABSTAND) {
        z.gruende.push(`viele Fehler: gelöst in ${prozent(z.quote)}, die übrigen in ${prozent(z.vergleichQuote)}`);
      } else if (z.quote != null && z.quote <= 0.4) {
        z.gruende.push(`viele Fehler: nur ${prozent(z.quote)} gelöst`);
      }
    }
    if (z.abbrueche >= 2 && z.abbrueche >= 0.3 * (z.bearbeitet + z.abbrueche)) z.gruende.push(`oft abgebrochen: ${z.abbrueche}-mal`);
    if (z.zuSchwer.ja >= 2 && z.zuSchwer.ja > z.zuSchwer.nein) z.gruende.push(`im Feedback ${z.zuSchwer.ja}-mal „zu schwer“`);
  }
  zeilen.sort((a, b) => b.gruende.length - a.gruende.length || b.bearbeitet - a.bearbeitet || String(a.aufgabe).localeCompare(String(b.aufgabe)));
  return { zeilen, schueler: schueler.size, aktiv: bearbeiter.size, bearbeitungen: zeilen.reduce((n, z) => n + z.bearbeitet, 0), auffaellig: zeilen.filter((z) => z.gruende.length).length };
}

// Antworten auf die Feedbackfragen im Zeitraum: je Frage die beiden Zahlen.
export function feedbackAuswertung(klassen, zeitraum = {}) {
  const zahlen = new Map(FEEDBACK_FRAGEN.map((f) => [f.id, [0, 0]]));
  let antworten = 0;
  for (const k of klassen) for (const { stand } of k.staende ?? []) for (const f of stand.feedback ?? []) {
    if (!zahlen.has(f.frage) || !imZeitraum(f.t, zeitraum)) continue;
    zahlen.get(f.frage)[f.antwort === 0 ? 0 : 1]++;
    antworten++;
  }
  return { antworten, fragen: FEEDBACK_FRAGEN.map((f) => ({ id: f.id, text: f.text, antworten: f.antworten, zahlen: zahlen.get(f.id) })) };
}

// Die Datei für Claude nach einer Teststunde: Markdown, ohne Namen und Codes.
// kopf: { klassen: 'Klasse 5a', zeitraum: 'Tag 24.11.2026', version, erstellt }  aufgabeZu: Kennung → Aufgabe
export function teststundeMarkdown(kopf, analyse, feedback, aufgabeZu = () => null) {
  const zelle = (x) => String(x ?? '').replace(/\|/g, '/').replace(/\s*\n\s*/g, ' ').trim();
  const kurz = (t, n = 140) => { const s = zelle(String(t ?? '').replace(/\{\{\w+\}\}/g, '▢')); return s.length > n ? `${s.slice(0, n - 2)} …` : s; };
  const z = [];
  z.push(`# Mathekingdom: Teststunde`, '');
  z.push(`- Klassen: ${kopf.klassen}`, `- Zeitraum: ${kopf.zeitraum}`, `- Version: ${kopf.version ?? 'unbekannt'}`, `- Erstellt: ${kopf.erstellt}`);
  z.push(`- Schüler mit Speicherstand: ${analyse.schueler}, davon mit Aufgaben im Zeitraum: ${analyse.aktiv}`);
  z.push(`- Bearbeitungen: ${analyse.bearbeitungen} an ${analyse.zeilen.length} Aufgaben, auffällig: ${analyse.auffaellig}`, `- Feedback-Antworten: ${feedback.antworten}`, '');
  z.push('Ohne Namen und Schülercodes. Dauer ist der Median in Sekunden; „Vergleich“ ist der Median der übrigen Aufgaben desselben Lernziels und Niveaus.', '');
  z.push('## Feedback', '');
  if (!feedback.antworten) z.push('Keine Antworten im Zeitraum.', '');
  else {
    z.push('| Frage | Antwort 1 | Antwort 2 |', '|---|---|---|');
    for (const f of feedback.fragen) if (f.zahlen[0] + f.zahlen[1]) z.push(`| ${zelle(f.text)} | ${f.antworten[0]}: ${f.zahlen[0]} | ${f.antworten[1]}: ${f.zahlen[1]} |`);
    z.push('');
  }
  z.push('## Auffällige Aufgaben', '');
  const auff = analyse.zeilen.filter((x) => x.gruende.length);
  if (!auff.length) z.push('Keine Aufgabe fällt auf.', '');
  for (const x of auff) {
    const a = aufgabeZu(x.aufgabe);
    z.push(`### ${x.aufgabe} (${x.niveau ?? '?'}, ${x.format ?? '?'})`, '');
    if (a) z.push(`- Text: ${kurz(a.text, 300)}`);
    for (const g of x.gruende) z.push(`- ${g}`);
    z.push(`- Bearbeitet: ${x.bearbeitet}-mal von ${x.schueler} ${x.schueler === 1 ? 'Schüler' : 'Schülern'}, gelöst ${prozent(x.quote)}, im ersten Versuch ${prozent(x.ersterVersuch)}, Hilfekärtchen je Bearbeitung ${x.hilfen == null ? '–' : x.hilfen.toFixed(1)}`);
    if (x.falsch.length) z.push(`- Häufigste falsche Antworten: ${x.falsch.map(([t, n]) => `„${zelle(t)}“ (${n})`).join(', ')}`);
    z.push('');
  }
  z.push('## Alle Aufgaben', '');
  z.push('| Kennung | Niveau | Format | Bearbeitet | Schüler | Gelöst | 1. Versuch | Dauer | Vergleich | Hilfen | Abbrüche | Zu schwer (ja/nein) | Häufigste falsche Antwort | Auffällig |');
  z.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const x of analyse.zeilen) {
    z.push(`| ${x.aufgabe} | ${x.niveau ?? ''} | ${x.format ?? ''} | ${x.bearbeitet} | ${x.schueler} | ${prozent(x.quote)} | ${prozent(x.ersterVersuch)} | ${sekunden(x.dauer)} | ${sekunden(x.vergleichDauer)} | ${x.hilfen == null ? '–' : x.hilfen.toFixed(1)} | ${x.abbrueche} | ${x.zuSchwer.ja}/${x.zuSchwer.nein} | ${x.falsch[0] ? `${zelle(x.falsch[0][0])} (${x.falsch[0][1]})` : ''} | ${x.gruende.length ? 'ja' : ''} |`);
  }
  z.push('');
  return z.join('\n');
}
