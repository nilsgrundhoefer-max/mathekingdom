// Nutzungsstatistik und Auffällige Aufgaben für das Administrator-Dashboard (ADR 0025). Reine Logik.
// Nie mit Namen: Es zählen Speicherstände und Versuche, keine Personen.
//
// klassen: [{ klasse, namen: { code: name }, staende: [{ code, stand }], backups: [stempel] }]

const TAG = 86400000;
const anteil = (a, b) => (b ? a / b : null);
const median = (werte) => {
  const w = werte.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!w.length) return null;
  const m = Math.floor(w.length / 2);
  return w.length % 2 ? w[m] : (w[m - 1] + w[m]) / 2;
};

// „Start online von GitHub, Version 0.22 vom 19.11.2026, …, Chrome 157“ → { version, browser, kopie }  (kopie: nicht online gestartet)
export function liesStart(e) {
  const version = e.text?.match(/Version (\d+\.\d+)/)?.[1] ?? null;
  const browser = e.text?.match(/\b(Edge|Chrome|Firefox|Opera) \d+/)?.[0] ?? null;
  const kopie = !/^Start online/.test(e.text ?? '');
  return { version, browser, kopie };
}
const zaehle = (liste) => { const m = new Map(); for (const x of liste) if (x) m.set(x, (m.get(x) ?? 0) + 1); return [...m].sort((a, b) => b[1] - a[1]); };

// Kennzahlen einer Klasse (oder aller Klassen) für die letzten `tage` Tage.
export function nutzung(klassen, jetzt, tage = 7) {
  const grenze = new Date(jetzt).getTime() - tage * TAG;
  const neu = (t) => t && new Date(t).getTime() >= grenze;
  const zeilen = klassen.map((k) => {
    const staende = k.staende ?? [];
    const versuche = staende.flatMap(({ stand }) => (stand.versuche ?? []).filter((v) => neu(v.t)));
    const betrieb = staende.flatMap(({ stand }) => (stand.betrieb ?? []).filter((e) => neu(e.t)));
    const starts = betrieb.filter((e) => /^Start /.test(e.text ?? ''));
    // Je Speicherstand der jüngste Start: welche Version und welcher Browser gerade laufen.
    const letzte = staende.map(({ stand }) => [...(stand.betrieb ?? [])].reverse().find((e) => /^Start /.test(e.text ?? ''))).filter(Boolean).map(liesStart);
    return {
      klasse: k.klasse, schueler: Object.keys(k.namen ?? {}).length, staende: staende.length,
      aktiv: staende.filter(({ stand }) => (stand.versuche ?? []).some((v) => neu(v.t))).length,
      aufgaben: versuche.length, quote: anteil(versuche.filter((v) => v.richtig).length, versuche.length),
      starts: starts.length, ohneNetz: starts.filter((e) => liesStart(e).kopie).length, probleme: betrieb.filter((e) => e.art === 'problem').length,
      versionen: zaehle(letzte.map((s) => s.version)), browser: zaehle(letzte.map((s) => s.browser)),
      letztesBackup: k.backups?.[0] ?? null,
    };
  });
  const summe = (feld) => zeilen.reduce((n, z) => n + z[feld], 0);
  const alleVersuche = summe('aufgaben');
  const gesamt = { klasse: 'alle', schueler: summe('schueler'), staende: summe('staende'), aktiv: summe('aktiv'), aufgaben: alleVersuche,
    quote: anteil(zeilen.reduce((n, z) => n + (z.quote ?? 0) * z.aufgaben, 0), alleVersuche), starts: summe('starts'), ohneNetz: summe('ohneNetz'), probleme: summe('probleme'),
    versionen: zaehle(zeilen.flatMap((z) => z.versionen.flatMap(([v, n]) => Array(n).fill(v)))), browser: zaehle(zeilen.flatMap((z) => z.browser.flatMap(([b, n]) => Array(n).fill(b)))) };
  return { zeilen, gesamt };
}

// ---------- Auffällige Aufgaben über alle Klassen ----------
export const MINDESTENS = 5;      // Bearbeitungen, ab denen eine Aufgabe beurteilt wird
export const MIN_SCHUELER = 3;    // verschiedene Speicherstände
const norm = (x) => String(x ?? '').replace(/[\s.']/g, '');
const als = (x) => (x == null ? '' : typeof x === 'string' ? x : Array.isArray(x) ? x.join(' + ') : Object.entries(x).map(([k, w]) => `${k}: ${w}`).join(', '));
// Die falschen Teile einer Eingabe, jeweils mit der Angabe, ob sie als typischer Fehler hinterlegt sind (dann sind sie erwartet).
export function falscheTeile(a, eingabe) {
  if (!a) return als(eingabe) ? [{ text: als(eingabe), erwartet: false }] : [];
  const zahl = (teil, wert, vor = '') => {
    const n = norm(wert);
    if (!n || n === '?' || Number(n) === teil.loesung || n === String(teil.loesung)) return [];
    return [{ text: `${vor}${n}`, erwartet: (teil.typischeFehler ?? []).some((f) => String(f.wert) === n) }];
  };
  switch (a.format) {
    case 'zahl': case 'zahlenstrahl': return zahl(a, eingabe);
    case 'sachaufgabe': case 'diagramm': return a.teile.flatMap((t, i) => zahl(t, eingabe?.[i], a.teile.length > 1 ? `${'abcdef'[i]}) ` : ''));
    case 'luecken': case 'tabelle': { const n = Object.keys(a.luecken); return n.flatMap((k) => zahl(a.luecken[k], eingabe?.[k], n.length > 1 ? `${k}: ` : '')); }
    case 'auswahl': return (eingabe ?? []).map((t) => a.optionen.find((o) => o.text === t)).filter((o) => o && !o.richtig).map((o) => ({ text: o.text, erwartet: !!o.fehlvorstellung }));
    // Kapitel 1: Strichliste und Säulen zeichnen, je falsche Zeile oder Säule.
    case 'strichliste': return a.zeilen.flatMap((z, i) => {
      const m = String(eingabe?.[i] ?? ''), n = [...m].filter((c) => c === 'I' || c === '/').length;
      const buendel = a.buendeln === 'selbst' && !/^(IIII\/)*I{0,4}$/.test(m);
      return n !== z.loesung || buendel ? [{ text: `${z.name}: ${n} Striche${buendel ? ', falsch gebündelt' : ''}`, erwartet: false }] : [];
    });
    case 'zeichnen': return a.diagramm.saeulen.flatMap((sa, i) => (sa.offen && Number(eingabe?.[i]) !== sa.wert ? [{ text: `${sa.name}: ${eingabe?.[i] ?? 0}`, erwartet: false }] : []));
    // Kapitel 2: Reihenfolge der Karten, Zeichenfolge, Schätzung außerhalb des Schätzbereichs.
    case 'ordnen': return Array.isArray(eingabe) && eingabe.join() !== a.loesung.join() ? [{ text: eingabe.join(', '), erwartet: false }] : [];
    case 'zeichen': { const n = String(eingabe ?? '').replace(/\s/g, '').toUpperCase(); return !n || n === a.loesung ? [] : [{ text: n, erwartet: (a.typischeFehler ?? []).some((f) => f.wert === n) }]; }
    case 'schaetzen': { const n = Number(norm(eingabe)); return !norm(eingabe) || (n >= a.bereich[0] && n <= a.bereich[1]) ? [] : [{ text: norm(eingabe), erwartet: (a.typischeFehler ?? []).some((f) => n >= f.von && n <= f.bis) }]; }
    case 'zuordnen': return a.paare.filter((p) => eingabe?.[p.links] && eingabe[p.links] !== p.rechts).map((p) => ({ text: `${p.links} → ${eingabe[p.links]}`, erwartet: false }));
    default: return [];
  }
}

// Je Aufgabe: Bearbeitungen, gelöst, Abbrüche, falsche Abgaben, unerwartete falsche Antworten, verschiedene Speicherstände.
// nach: Map Kennung → Aufgabe (für den Vergleich mit den hinterlegten typischen Fehlern).
export function zahlenJeAufgabe(alleStaende, nach = new Map()) {
  const je = new Map();
  const e = (id) => { if (!je.has(id)) je.set(id, { aufgabe: id, bearbeitet: 0, geloest: 0, abbrueche: 0, falscheAbgaben: 0, wer: new Set(), unerwartet: new Map(), werUnerwartet: new Map() }); return je.get(id); };
  for (const { code, stand } of alleStaende) {
    for (const v of stand.versuche ?? []) {
      if (v.gesperrt) continue;
      const x = e(v.aufgabe);
      x.bearbeitet++; x.wer.add(code); if (v.richtig) x.geloest++;
      const falsche = v.richtig ? (v.eingaben ?? []).slice(0, -1) : v.eingaben ?? [];
      for (const f of falsche) {
        x.falscheAbgaben++;
        for (const { text: t, erwartet } of falscheTeile(nach.get(v.aufgabe), f)) {
          if (erwartet) continue;
          x.unerwartet.set(t, (x.unerwartet.get(t) ?? 0) + 1);
          if (!x.werUnerwartet.has(t)) x.werUnerwartet.set(t, new Set());
          x.werUnerwartet.get(t).add(code);
        }
      }
    }
    for (const a of stand.abbrueche ?? []) { const x = e(a.aufgabe); x.abbrueche++; x.wer.add(code); }
  }
  return je;
}

// pool: alle Aufgaben (aus allen Klassenstufen). Liefert [{ aufgabe, lernziel, niveau, format, afb, bearbeitet, schueler, quote, gruende: [text] }].
export function auffaelligeAufgaben(alleStaende, aufgaben) {
  const nach = new Map(aufgaben.map((a) => [a.id, a]));
  const zahlen = zahlenJeAufgabe(alleStaende, nach);
  const quoteVon = (z) => anteil(z.geloest, z.bearbeitet);
  // Vergleich innerhalb desselben Lernziels und derselben Niveaustufe.
  const gruppen = new Map();
  for (const z of zahlen.values()) {
    const a = nach.get(z.aufgabe);
    if (!a || z.bearbeitet < MINDESTENS) continue;
    const k = `${a.lernziel}|${a.niveau}`;
    if (!gruppen.has(k)) gruppen.set(k, []);
    gruppen.get(k).push(z);
  }
  const liste = [];
  for (const z of zahlen.values()) {
    const a = nach.get(z.aufgabe);
    if (!a || z.wer.size < MIN_SCHUELER || z.bearbeitet + z.abbrueche < MINDESTENS) continue;
    const gruende = [];
    const quote = quoteVon(z);
    if (z.bearbeitet >= MINDESTENS) {
      // Dieselbe falsche Antwort von mehreren, die kein hinterlegter typischer Fehler ist: Vielleicht stimmt die Lösung im Pool nicht.
      const [antwort, anzahl] = [...z.unerwartet].sort((x, y) => y[1] - x[1])[0] ?? [null, 0];
      const wer = z.werUnerwartet.get(antwort)?.size ?? 0;
      if (antwort && anzahl >= 3 && wer >= MIN_SCHUELER && anzahl / z.falscheAbgaben >= 0.4) {
        gruende.push(`${wer} Schüler antworten „${antwort}“, das ist kein hinterlegter typischer Fehler. Stimmt die Lösung?`);
      }
      const andere = (gruppen.get(`${a.lernziel}|${a.niveau}`) ?? []).filter((x) => x !== z).map(quoteVon);
      const vergleich = median(andere);
      if (andere.length >= 2 && vergleich != null && quote != null && vergleich - quote >= 0.35) {
        gruende.push(`Gelöst in ${Math.round(quote * 100)} % der Fälle, die übrigen Aufgaben dieses Lernziels und Niveaus in ${Math.round(vergleich * 100)} %.`);
      }
    }
    const abbruch = anteil(z.abbrueche, z.bearbeitet + z.abbrueche);
    if (z.abbrueche >= 3 && abbruch >= 0.4) gruende.push(`${Math.round(abbruch * 100)} % brechen sie ab.`);
    if (gruende.length) liste.push({ aufgabe: a.id, lernziel: a.lernziel, niveau: a.niveau, format: a.format, afb: a.afb, bearbeitet: z.bearbeitet, schueler: z.wer.size, quote, gruende });
  }
  return liste.sort((x, y) => y.gruende.length - x.gruende.length || (x.quote ?? 1) - (y.quote ?? 1));
}

// Zusammenfassung je Aufgabentyp: Bearbeitungen, Lösungsquote, Abbrüche, Zahl der auffälligen Aufgaben.
export function jeAufgabentyp(alleStaende, aufgaben, auffaellige, namen = {}) {
  const zahlen = zahlenJeAufgabe(alleStaende);  // ohne Aufgaben: nur Zählungen, keine Fehleranalyse
  const formate = [...new Set(aufgaben.map((a) => a.format))];
  return formate.map((f) => {
    const teil = aufgaben.filter((a) => a.format === f).map((a) => zahlen.get(a.id)).filter(Boolean);
    const bearbeitet = teil.reduce((n, z) => n + z.bearbeitet, 0), abbrueche = teil.reduce((n, z) => n + z.abbrueche, 0);
    return { format: f, name: namen[f] ?? f, imPool: aufgaben.filter((a) => a.format === f).length, genutzt: teil.filter((z) => z.bearbeitet).length, bearbeitet,
      quote: anteil(teil.reduce((n, z) => n + z.geloest, 0), bearbeitet), abbruchquote: anteil(abbrueche, bearbeitet + abbrueche),
      auffaellig: auffaellige.filter((x) => x.format === f).length };
  }).sort((a, b) => b.bearbeitet - a.bearbeitet);
}
