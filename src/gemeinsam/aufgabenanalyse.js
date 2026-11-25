// Aufgabenanalyse, Feedback und Export „Teststunde“ für das Administrator-Dashboard (ADR 0042). Reine Logik.
// Nie mit Namen oder Schülercodes: Gezählt werden Speicherstände, Versuche und Antworten.
//
// klassen: [{ klasse, staende: [{ code, stand }] }]   aufgaben: alle Aufgaben aus allen Pools

import { falscheTeile } from './statistik.js';
import { FEEDBACK_FRAGEN, NIVEAUS, tagVon } from '../schueler/logik.js';
import { loesungVon } from './meldungen.js';

export const MIN_BEARBEITUNGEN = 3;   // ab so vielen Bearbeitungen wird eine Aufgabe markiert
export const MIN_SCHUELER = 3;        // und nur, wenn so viele verschiedene Schüler sie bearbeitet haben (Version 0.54)
export const DAUER_FAKTOR = 2;        // doppelt so lange wie die übrigen Aufgaben ihres Lernziels und Niveaus
export const DAUER_MIN_PLUS = 20;     // und mindestens 20 Sekunden länger
export const QUOTE_ABSTAND = 0.35;    // so viel seltener gelöst als die übrigen

// Feedbackfragen zur Aufgabe, die in die Aufgabenzeile eingehen (Version 0.54: alle, nicht nur „zu schwer“).
export const AUFGABEN_FRAGEN = FEEDBACK_FRAGEN.filter((f) => f.zurAufgabe).map((f) => f.id);
// Ab so vielen Stimmen und Mehrheit wird eine Aufgabe auffällig. „zu leicht“ ist kein Fehler der Aufgabe.
const FEEDBACK_GRUND = { schwer: (n) => `im Feedback ${n}-mal „zu schwer“`, text: (n) => `im Feedback ${n}-mal „Text nicht verstanden“`,
  eingabe: (n) => `im Feedback ${n}-mal „Eingeben hat nicht geklappt“`, bild: (n) => `im Feedback ${n}-mal „Bild schlecht zu erkennen“` };
// Welche Antwort auf eine Frage zur Aufgabe auf ein Problem zeigt: bei „zu schwer“ die erste (Ja), sonst die zweite (Nein).
const problemAntwort = (frage) => (frage === 'schwer' || frage === 'leicht' ? 0 : 1);

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
// Version 0.54: Je Klasse eine Zeile (Schüler, Bearbeitungen, Feedback, Versionen), je falsche Antwort die bekannte Fehlvorstellung,
// „schueler“ zählt nur, wer abgegeben hat, „angefangen“ auch, wer nur abgebrochen hat.
export function aufgabenanalyse(klassen, aufgaben, zeitraum = {}) {
  const nach = new Map(aufgaben.map((a) => [a.id, a]));
  const je = new Map();
  const e = (id) => {
    if (!je.has(id)) je.set(id, { aufgabe: id, bearbeitet: 0, ersterVersuch: 0, geloest: 0, dauern: [], hilfen: 0, abbrueche: 0, wer: new Set(), abgegeben: new Set(), falsch: new Map(), fb: new Map() });
    return je.get(id);
  };
  let nr = 0;
  const schueler = new Set(), bearbeiter = new Set(), jeKlasse = [];
  for (const k of klassen) {
    const kl = { klasse: k.klasse, schueler: 0, aktiv: 0, bearbeitungen: 0, feedback: 0, versionen: new Map() };
    for (const { stand } of k.staende ?? []) {
      const wer = ++nr; // nur eine laufende Nummer, kein Code
      schueler.add(wer); kl.schueler++;
      let aktiv = false;
      for (const v of stand.versuche ?? []) {
        if (v.gesperrt || !imZeitraum(v.t, zeitraum)) continue;
        const x = e(v.aufgabe);
        x.bearbeitet++; x.wer.add(wer); x.abgegeben.add(wer); bearbeiter.add(wer); aktiv = true; kl.bearbeitungen++;
        const ver = v.version ?? 'vor 0.54';
        kl.versionen.set(ver, (kl.versionen.get(ver) ?? 0) + 1);
        if (v.richtig) x.geloest++;
        if (v.richtig && (v.versuche ?? 1) === 1) x.ersterVersuch++;
        if (typeof v.dauer === 'number') x.dauern.push(v.dauer);
        x.hilfen += v.hilfen ?? 0;
        const falsche = v.richtig ? (v.eingaben ?? []).slice(0, -1) : v.eingaben ?? [];
        for (const f of falsche) for (const { text, fehlvorstellung } of sichereTeile(nach.get(v.aufgabe), f)) {
          const alt = x.falsch.get(text);
          x.falsch.set(text, { n: (alt?.n ?? 0) + 1, fehlvorstellung: alt?.fehlvorstellung ?? fehlvorstellung ?? null });
        }
      }
      if (aktiv) kl.aktiv++;
      for (const ab of stand.abbrueche ?? []) if (imZeitraum(ab.t, zeitraum)) { const x = e(ab.aufgabe); x.abbrueche++; x.wer.add(wer); }
      for (const f of stand.feedback ?? []) {
        if (!imZeitraum(f.t, zeitraum)) continue;
        kl.feedback++;
        if (f.aufgabe && AUFGABEN_FRAGEN.includes(f.frage)) {
          const fb = e(f.aufgabe).fb;
          if (!fb.has(f.frage)) fb.set(f.frage, [0, 0]);
          fb.get(f.frage)[f.antwort === 0 ? 0 : 1]++;
        }
      }
    }
    jeKlasse.push({ ...kl, versionen: [...kl.versionen].sort((a, b) => b[1] - a[1]) });
  }
  const zeilen = [...je.values()].map((x) => {
    const a = nach.get(x.aufgabe);
    const feedback = Object.fromEntries([...x.fb].map(([id, [ja, nein]]) => [id, { ja, nein }]));
    return { aufgabe: x.aufgabe, lernziel: a?.lernziel ?? null, niveau: a?.niveau ?? null, format: a?.format ?? null, afb: a?.afb ?? null,
      bearbeitet: x.bearbeitet, schueler: x.abgegeben.size, angefangen: x.wer.size, quote: anteil(x.geloest, x.bearbeitet), ersterVersuch: anteil(x.ersterVersuch, x.bearbeitet),
      dauer: median(x.dauern), hilfen: anteil(x.hilfen, x.bearbeitet), abbrueche: x.abbrueche,
      falsch: [...x.falsch].sort((p, q) => q[1].n - p[1].n).slice(0, 3).map(([t, w]) => [t, w.n, w.fehlvorstellung]),
      feedback, zuSchwer: { ja: feedback.schwer?.ja ?? 0, nein: feedback.schwer?.nein ?? 0 }, gruende: [] };
  });
  // Vergleichsgruppe: Lernziel und Niveau.
  const gruppen = new Map();
  for (const z of zeilen) if (z.lernziel && z.bearbeitet >= MIN_BEARBEITUNGEN) { const k = `${z.lernziel}|${z.niveau}`; if (!gruppen.has(k)) gruppen.set(k, []); gruppen.get(k).push(z); }
  for (const z of zeilen) {
    const andere = (gruppen.get(`${z.lernziel}|${z.niveau}`) ?? []).filter((x) => x !== z);
    z.vergleichDauer = median(andere.map((x) => x.dauer));
    z.vergleichQuote = median(andere.map((x) => x.quote));
    // Ein einzelner Schüler, der dieselbe Aufgabe oft probiert, macht sie nicht auffällig (Version 0.54).
    if (z.angefangen < MIN_SCHUELER) continue;
    if (z.bearbeitet >= MIN_BEARBEITUNGEN && z.schueler >= MIN_SCHUELER) {
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
    for (const [frage, satz] of Object.entries(FEEDBACK_GRUND)) {
      const f = z.feedback[frage];
      if (!f) continue;
      const [problem, sonst] = problemAntwort(frage) === 0 ? [f.ja, f.nein] : [f.nein, f.ja];
      if (problem >= 2 && problem > sonst) z.gruende.push(satz(problem));
    }
  }
  zeilen.sort((a, b) => b.gruende.length - a.gruende.length || b.bearbeitet - a.bearbeitet || String(a.aufgabe).localeCompare(String(b.aufgabe)));
  return { zeilen, klassen: jeKlasse, schueler: schueler.size, aktiv: bearbeiter.size, bearbeitungen: zeilen.reduce((n, z) => n + z.bearbeitet, 0), auffaellig: zeilen.filter((z) => z.gruende.length).length };
}

// Antworten auf die Feedbackfragen im Zeitraum: je Frage die beiden Zahlen, dazu (Version 0.54) die Fragen zur Aufgabe
// nach dem Niveau der Aufgabe. aufgaben: alle Aufgaben aus allen Pools (für das Niveau).
export function feedbackAuswertung(klassen, zeitraum = {}, aufgaben = []) {
  const zahlen = new Map(FEEDBACK_FRAGEN.map((f) => [f.id, [0, 0]]));
  const niveauVon = new Map(aufgaben.map((a) => [a.id, a.niveau]));
  const nachNiveau = new Map(); // frage → niveau → [ja, nein]
  let antworten = 0;
  for (const k of klassen) for (const { stand } of k.staende ?? []) for (const f of stand.feedback ?? []) {
    if (!zahlen.has(f.frage) || !imZeitraum(f.t, zeitraum)) continue;
    const nr = f.antwort === 0 ? 0 : 1;
    zahlen.get(f.frage)[nr]++;
    antworten++;
    const niveau = f.aufgabe && niveauVon.get(f.aufgabe);
    if (!niveau) continue;
    if (!nachNiveau.has(f.frage)) nachNiveau.set(f.frage, new Map());
    const m = nachNiveau.get(f.frage);
    if (!m.has(niveau)) m.set(niveau, [0, 0]);
    m.get(niveau)[nr]++;
  }
  return { antworten, fragen: FEEDBACK_FRAGEN.map((f) => ({ id: f.id, text: f.text, antworten: f.antworten, zahlen: zahlen.get(f.id),
    ...(f.zurAufgabe && { nachNiveau: Object.fromEntries(NIVEAUS.map((n) => [n, nachNiveau.get(f.id)?.get(n) ?? [0, 0]])) }) })) };
}

// Die Datei für Claude nach einer Teststunde: Markdown, ohne Namen und Codes.
// kopf: { klassen: 'Klasse 5a', zeitraum: 'Tag 24.11.2026', version, erstellt }  aufgabeZu: Kennung → Aufgabe
// fehlvorstellungZu: Kennung einer Fehlvorstellung → { beschreibung } oder null
const FRAGE_KURZ = { schwer: 'zu schwer', leicht: 'zu leicht', text: 'Text verstanden', tipp: 'Tipp geholfen', bild: 'Bild gut zu erkennen', eingabe: 'Eingeben geklappt' };
const loesungSicher = (a) => { try { return loesungVon(a); } catch { return ''; } };
export function teststundeMarkdown(kopf, analyse, feedback, aufgabeZu = () => null, fehlvorstellungZu = () => null) {
  const zelle = (x) => String(x ?? '').replace(/\|/g, '/').replace(/\s*\n\s*/g, ' ').trim();
  const kurz = (t, n = 140) => { const s = zelle(String(t ?? '').replace(/\{\{\w+\}\}/g, '▢')); return s.length > n ? `${s.slice(0, n - 2)} …` : s; };
  const versionen = (liste) => liste.map(([v, n]) => `${v} (${n})`).join(', ') || '–';
  const alleVersionen = new Map();
  for (const k of analyse.klassen ?? []) for (const [v, n] of k.versionen) alleVersionen.set(v, (alleVersionen.get(v) ?? 0) + n);
  const falschText = ([t, n, fv]) => {
    const name = fv ? `bekannte Fehlvorstellung ${fv}${fehlvorstellungZu(fv)?.beschreibung ? `: ${fehlvorstellungZu(fv).beschreibung}` : ''}` : 'unbekannt';
    return `„${zelle(t)}“ (${n}, ${name})`;
  };
  const fbText = (fb) => AUFGABEN_FRAGEN.map((id) => [id, fb?.[id]]).filter(([, f]) => f && f.ja + f.nein).map(([id, f]) => `${FRAGE_KURZ[id] ?? id} ${f.ja}/${f.nein}`).join(', ');
  const z = [];
  z.push(`# Mathekingdom: Teststunde`, '');
  z.push(`- Klassen: ${kopf.klassen}`, `- Zeitraum: ${kopf.zeitraum}`);
  z.push(`- Schüler-Dashboard bei den Bearbeitungen: ${versionen([...alleVersionen].sort((a, b) => b[1] - a[1]))}`, `- Exportiert mit: ${kopf.version ?? 'unbekannt'}`, `- Erstellt: ${kopf.erstellt}`);
  z.push(`- Schüler mit Speicherstand: ${analyse.schueler}, davon mit Aufgaben im Zeitraum: ${analyse.aktiv}`);
  z.push(`- Bearbeitungen: ${analyse.bearbeitungen} an ${analyse.zeilen.length} Aufgaben, auffällig: ${analyse.auffaellig}`, `- Feedback-Antworten: ${feedback.antworten}`, '');
  z.push(`Ohne Namen und Schülercodes. Dauer ist der Median in Sekunden; „Vergleich“ ist der Median der übrigen Aufgaben desselben Lernziels und Niveaus. Auffällig wird eine Aufgabe erst, wenn mindestens ${MIN_SCHUELER} verschiedene Schüler sie bearbeitet haben. Bei falschen Antworten steht, ob sie zu einer im Pool hinterlegten Fehlvorstellung passen; „unbekannt“ kann auf einen Fehler in der Aufgabe zeigen.`, '');
  if ((analyse.klassen ?? []).length) {
    z.push('## Klassen', '', '| Klasse | Schüler | mit Aufgaben | Bearbeitungen | Feedback | Schüler-Dashboard |', '|---|---|---|---|---|---|');
    for (const k of analyse.klassen) z.push(`| ${k.klasse} | ${k.schueler} | ${k.aktiv} | ${k.bearbeitungen} | ${k.feedback} | ${versionen(k.versionen)} |`);
    z.push('');
  }
  z.push('## Feedback', '');
  if (!feedback.antworten) z.push('Keine Antworten im Zeitraum.', '');
  else {
    z.push('| Frage | Antwort 1 | Antwort 2 |', '|---|---|---|');
    for (const f of feedback.fragen) if (f.zahlen[0] + f.zahlen[1]) z.push(`| ${zelle(f.text)} | ${f.antworten[0]}: ${f.zahlen[0]} | ${f.antworten[1]}: ${f.zahlen[1]} |`);
    z.push('');
    const zurAufgabe = feedback.fragen.filter((f) => f.nachNiveau && Object.values(f.nachNiveau).some(([a, b]) => a + b));
    if (zurAufgabe.length) {
      z.push('### Fragen zur Aufgabe nach Niveau', '', 'Je Niveau der Aufgabe: Antwort 1 / Antwort 2.', '', '| Frage | F | G | M | E |', '|---|---|---|---|---|');
      for (const f of zurAufgabe) z.push(`| ${zelle(f.text)} (${f.antworten.join('/')}) | ${NIVEAUS.map((n) => { const [a, b] = f.nachNiveau[n]; return a + b ? `${a}/${b}` : '–'; }).join(' | ')} |`);
      z.push('');
    }
  }
  z.push('## Auffällige Aufgaben', '');
  const auff = analyse.zeilen.filter((x) => x.gruende.length);
  if (!auff.length) z.push('Keine Aufgabe fällt auf.', '');
  for (const x of auff) {
    const a = aufgabeZu(x.aufgabe);
    z.push(`### ${x.aufgabe} (${x.niveau ?? '?'}, ${x.format ?? '?'})`, '');
    if (a) z.push(`- Text: ${kurz(a.text, 300)}`);
    const l = a && loesungSicher(a);
    if (l) z.push(`- Lösung im Pool: ${kurz(l, 200)}`);
    for (const g of x.gruende) z.push(`- ${g}`);
    const nurAb = x.angefangen - x.schueler;
    z.push(`- Bearbeitet: ${x.bearbeitet}-mal von ${x.schueler} ${x.schueler === 1 ? 'Schüler' : 'Schülern'}${nurAb > 0 ? `, angefangen von ${x.angefangen} (${nurAb} nur abgebrochen)` : ''}, gelöst ${prozent(x.quote)}, im ersten Versuch ${prozent(x.ersterVersuch)}, Hilfekärtchen je Bearbeitung ${x.hilfen == null ? '–' : x.hilfen.toFixed(1)}`);
    if (x.falsch.length) z.push(`- Häufigste falsche Antworten: ${x.falsch.map(falschText).join(', ')}`);
    const fb = fbText(x.feedback);
    if (fb) z.push(`- Feedback zur Aufgabe (ja/nein): ${fb}`);
    z.push('');
  }
  z.push('## Alle Aufgaben', '');
  z.push('Schüler: die abgegeben haben, in Klammern alle, die angefangen haben. Feedback: ja/nein je Frage zur Aufgabe.', '');
  z.push('| Kennung | Niveau | Format | Bearbeitet | Schüler | Gelöst | 1. Versuch | Dauer | Vergleich | Hilfen | Abbrüche | Feedback | Häufigste falsche Antwort | Auffällig |');
  z.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const x of analyse.zeilen) {
    const f0 = x.falsch[0];
    z.push(`| ${x.aufgabe} | ${x.niveau ?? ''} | ${x.format ?? ''} | ${x.bearbeitet} | ${x.schueler}${x.angefangen > x.schueler ? ` (${x.angefangen})` : ''} | ${prozent(x.quote)} | ${prozent(x.ersterVersuch)} | ${sekunden(x.dauer)} | ${sekunden(x.vergleichDauer)} | ${x.hilfen == null ? '–' : x.hilfen.toFixed(1)} | ${x.abbrueche} | ${zelle(fbText(x.feedback))} | ${f0 ? `${zelle(f0[0])} (${f0[1]}${f0[2] ? `, ${f0[2]}` : ', unbekannt'})` : ''} | ${x.gruende.length ? 'ja' : ''} |`);
  }
  z.push('');
  return z.join('\n');
}
