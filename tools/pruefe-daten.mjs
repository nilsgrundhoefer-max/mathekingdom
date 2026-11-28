// Prüfprogramm für Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058).
// Es rechnet jede Aufgabe unabhängig vom Erzeuger nach: Kenngrößen aus der Datenreihe, Zählen in der Urliste, Anteile als Bruch, Prozent,
// Dezimalzahl und Winkel, Anzahlen aus Anteilen, Ablesen im Kreis- und Streifendiagramm, Streifen färben und erfundene Datensätze.
// Gerechnet wird mit Brüchen aus ganzen Zahlen, nie mit Kommazahlen des Rechners.

import { zahlWert, zGleichungen } from './pruefe-zuordnungen.mjs';
import { pruefeDatensatz, mittelwert, spannweite, zentralwert } from '../src/schueler/daten.js';

const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };
const ggT = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const Q = (z, n = 1) => { if (n < 0) { z = -z; n = -n; } const d = ggT(z, n); return { z: z / d, n: n / d }; };
const gleich = (x, y) => Boolean(x && y) && x.z === y.z && x.n === y.n;
const mal = (x, y) => Q(x.z * y.z, x.n * y.n);
const durch = (x, y) => (y.z === 0 ? null : Q(x.z * y.n, x.n * y.z));
const schl = (q) => `${q.z}/${q.n}`;
const zeige = (q) => (q ? (q.n === 1 ? String(q.z) : (q.z / q.n).toString().replace('.', ',')) : '?');
const NUM = '(?:\\d{1,3}(?:\\u00a0\\d{3})+|\\d+)(?:,\\d+)?';
const alleZahlen = (text) => [...String(text ?? '').matchAll(new RegExp(`(?<![\\d,⁄])${NUM}(?![⁄\\d])`, 'g'))].map((m) => zahlWert(m[0])).filter(Boolean);
const BRUCH = /^(\d+)⁄(\d+)$/;
const bruchWert = (s) => { const m = String(s ?? '').trim().match(BRUCH); return m ? Q(Number(m[1]), Number(m[2])) : null; };
const istGekuerzt = (s) => { const m = String(s).match(BRUCH); return Boolean(m) && ggT(Number(m[1]), Number(m[2])) === 1; };
// Ein Wert als Bruch: Zahl, Text mit Komma oder Bruch.
const wertVon = (x) => bruchWert(x) ?? zahlWert(x);
// Gerundet auf `stellen` Stellen (kaufmännisch).
const runde = (q, stellen) => { const f = 10 ** stellen, z = q.z * f, ganz = Math.floor(z / q.n), rest = z - ganz * q.n; return Q(2 * rest >= q.n ? ganz + 1 : ganz, f); };
const polaritaet = (text) => (/^(Falsch|Fehlerhaft|Irreführend|Nein|Das stimmt nicht|Stimmt nicht)(?![a-zäöü])/.test(text) ? false : /^(Stimmt|Ja|Richtig|In Ordnung)(?![a-zäöü])/.test(text) ? true : null);

// ---------- Sprache ----------
function sprachMaengel(a) {
  const m = [], texte = [a.text, ...(a.optionen ?? []).map((o) => o.text), ...Object.values(a.hilfen ?? {})].join('\n');
  if (/Median|arithmetische[sn]? Mittel|Tortendiagramm|Kuchendiagramm|Durchschnitt/i.test(texte)) m.push('Wort kommt in diesem Kapitel nicht vor (Median, arithmetisches Mittel, Durchschnitt, Torten- oder Kuchendiagramm)');
  if (/Ausreißer/.test(texte) && a.niveau !== 'E') m.push('„Ausreißer“ gibt es erst auf E');
  if (/,\d{3,}/.test(texte)) m.push('höchstens zwei Stellen nach dem Komma');
  if (a.niveau === 'F' && /relative Häufigkeit|absolute Häufigkeit|Stichprobe|Ausschnitt/.test(texte)) m.push('Wort gibt es auf F noch nicht (relative, absolute Häufigkeit, Stichprobe, Ausschnitt)');
  return m;
}

// ---------- Bilder ----------
function bildMaengel(a, b) {
  const m = [];
  if (b.art === 'kreisdiagramm') {
    const w = (b.teile ?? []).map((t) => t.winkel);
    if (w.length < 2 || w.length > 6) m.push(`Kreisdiagramm mit ${w.length} Ausschnitten (2 bis 6)`);
    if (w.some((x) => !(x > 0))) m.push('Kreisdiagramm: Winkel fehlt oder ist nicht positiv');
    if (Math.abs(w.reduce((x, y) => x + y, 0) - 360) > 1e-9) m.push(`Kreisdiagramm: Die Winkel ergeben ${w.reduce((x, y) => x + y, 0)}°, nicht 360°`);
    if (new Set(b.teile.map((t) => t.name)).size !== w.length) m.push('Kreisdiagramm: Name doppelt');
    // Beschriftung mit Prozent oder Grad passt zum Winkel, außer die Aufgabe fragt gerade nach einer irreführenden Darstellung.
    const urteil = (a.nachweis ?? []).some((n) => n?.art === 'urteil');
    for (const t of b.teile) {
      const p = String(t.text ?? '').match(/^(\d+(?:,\d)?) %$/), g = String(t.text ?? '').match(/^(\d+)°$/);
      if (p && !urteil && !gleich(mal(zahlWert(p[1]), Q(36, 10)), alsQ(t.winkel))) m.push(`Kreisdiagramm: ${t.name} hat ${t.text}, aber ${t.winkel}°`);
      if (g && Number(g[1]) !== t.winkel) m.push(`Kreisdiagramm: ${t.name} ist mit ${t.text} beschriftet, aber ${t.winkel}° groß`);
    }
  } else if (b.art === 'streifendiagramm') {
    const mm = (b.teile ?? []).map((t) => t.mm);
    if (![10, 20].includes(b.laenge)) m.push(`Streifendiagramm ist ${b.laenge} cm lang (10 oder 20 cm)`);
    if (mm.length < 2 || mm.length > 6 || mm.some((x) => !Number.isInteger(x) || x <= 0 || x % 5)) m.push('Streifendiagramm: 2 bis 6 Abschnitte, jeder ein Vielfaches von 5 mm');
    if (mm.reduce((x, y) => x + y, 0) !== b.laenge * 10) m.push(`Streifendiagramm: Die Abschnitte ergeben ${mm.reduce((x, y) => x + y, 0)} mm, nicht ${b.laenge * 10} mm`);
    if (a.niveau === 'F' && mm.some((x) => x % 10)) m.push('Streifendiagramm auf F nur mit vollen Zentimetern');
    const urteil = (a.nachweis ?? []).some((n) => n?.art === 'urteil');
    for (const t of b.teile) { const p = String(t.text ?? '').match(/^(\d+(?:,\d)?) %$/); if (p && !urteil && !gleich(zahlWert(p[1]), Q(t.mm * 100, b.laenge * 10))) m.push(`Streifendiagramm: ${t.name} hat ${t.text}, aber ${t.mm} mm`); }
  } else if (b.art !== 'saeulen') m.push(`Bild der Art ${b.art} gibt es in diesem Kapitel nicht`);
  return m;
}
const alsQ = (x) => (Number.isInteger(x) ? Q(x) : zahlWert(String(x).replace('.', ',')));

// ---------- Formate ----------
// Höchstens zwei Stellen, eine Dezimalzahl als Anteil auch drei (3⁄8 = 0,375).
const loesungOk = (x) => (Number.isInteger(x) && x >= 0) || (typeof x === 'string' && /^\d+,\d{1,3}$/.test(x));
function fehlerMaengel(l, fv, was = 'Lösung') {
  const m = [];
  if (!loesungOk(l.loesung)) m.push(`${was} ist keine Zahl mit höchstens drei Stellen nach dem Komma: ${l.loesung}`);
  const lw = zahlWert(l.loesung), werte = (l.typischeFehler ?? []).map((f) => zahlWert(f.wert));
  if (werte.some((w) => !w)) m.push(`${was}: typischer Fehler ist keine Zahl`);
  else if (new Set(werte.map(schl)).size !== werte.length) m.push(`${was}: typischer Fehler doppelt`);
  for (const f of l.typischeFehler ?? []) {
    if (lw && gleich(zahlWert(f.wert), lw)) m.push(`${was}: typischer Fehler ist gleich der Lösung`);
    if (!(f.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`);
  }
  return m;
}
const lueckenNamen = (a) => [...[...a.text.matchAll(/\{\{(\w+)\}\}/g)].map((x) => x[1]), ...(a.tabelle?.zeilen ?? []).flat().filter((c) => typeof c === 'object' && c !== null).map((c) => c.luecke)];

function formatMaengel(a, fv) {
  const m = [];
  if (!['zahl', 'luecken', 'tabelle', 'auswahl', 'bruch', 'streifenfaerben'].includes(a.format)) return [`Format ${a.format} gibt es in diesem Kapitel nicht`];
  if (a.format === 'zahl') m.push(...fehlerMaengel(a, fv));
  if (a.format === 'bruch') {
    if (!BRUCH.test(String(a.loesung)) || (a.gekuerzt && !istGekuerzt(a.loesung))) m.push(`Lösung ist kein vollständig gekürzter Bruch: ${a.loesung}`);
    for (const f of a.typischeFehler ?? []) { if (!bruchWert(f.wert)) m.push(`typischer Fehler ist kein Bruch: ${f.wert}`); if (f.wert === a.loesung) m.push('typischer Fehler ist gleich der Lösung'); if (!(f.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${f.fehlvorstellung}`); }
  }
  if (a.format === 'luecken' || a.format === 'tabelle') {
    const namen = lueckenNamen(a), keys = Object.keys(a.luecken ?? {});
    if (!keys.length) m.push('Format: keine Lücke');
    if (new Set(namen).size !== namen.length || namen.length !== keys.length || namen.some((n) => !keys.includes(n))) m.push('Format: Lücken im Text oder in der Tabelle passen nicht zu den Lösungen');
    for (const [n, l] of Object.entries(a.luecken ?? {})) m.push(...fehlerMaengel(l, fv, `Lücke ${n}`));
    if (a.format === 'tabelle' && (!a.tabelle?.kopf?.length || a.tabelle.zeilen.some((z) => z.length !== a.tabelle.kopf.length))) m.push('Tabelle: Jede Zeile hat so viele Zellen wie der Kopf');
  }
  if (a.datensatz) {
    const d = a.datensatz, namen = Object.keys(a.luecken ?? {});
    if (a.format !== 'luecken' || namen.length !== d.anzahl) m.push('Datensatz: so viele Lücken wie verlangte Zahlen');
    if (!['mittelwert', 'spannweite', 'zentralwert', 'minimum', 'maximum'].some((k) => d[k] != null)) m.push('Datensatz: keine Bedingung');
    const beispiel = Object.fromEntries(namen.map((n) => [n, String(a.luecken[n].loesung)]));
    if (!pruefeDatensatz(a, beispiel).richtig) m.push('Datensatz: Das Beispiel erfüllt die Bedingung nicht');
    if (!['E'].includes(a.niveau)) m.push('Datensätze erfinden gibt es nur auf E');
  }
  if (a.format === 'auswahl') {
    const o = a.optionen ?? [], richtige = o.filter((x) => x.richtig).length;
    if (o.length < 2 || o.length > MAX_OPTIONEN[a.niveau]) m.push(`Format: ${o.length} Antworten (2 bis ${MAX_OPTIONEN[a.niveau]})`);
    if (a.mehrfach ? richtige < 1 || richtige === o.length : richtige !== 1) m.push('Format: Anzahl der richtigen Antworten');
    if (new Set(o.map((x) => x.text)).size !== o.length) m.push('Format: Antwort doppelt');
    for (const x of o) if (x.fehlvorstellung && (x.richtig || !(x.fehlvorstellung in fv))) m.push(`Antwort „${x.text}“: Fehlvorstellung unbekannt oder an der richtigen Antwort`);
  }
  if (a.format === 'streifenfaerben') {
    const f = a.farben ?? [], l = f.map((x) => x.loesung);
    if (a.streifen?.kaestchen !== 20) m.push('Streifen färben: Der Streifen hat 20 Kästchen');
    if (f.length < 2 || f.length > 5) m.push(`Streifen färben: ${f.length} Farben (2 bis 5)`);
    if (l.some((x) => !Number.isInteger(x) || x < 1) || l.reduce((x, y) => x + y, 0) !== 20) m.push(`Streifen färben: Die Kästchen ${l.join(', ')} füllen den Streifen nicht genau`);
    if (new Set(f.map((x) => x.name)).size !== f.length) m.push('Streifen färben: Farbe doppelt');
    if (!(a.typischeFehler ?? []).length) m.push('Streifen färben: kein typischer Fehler');
    for (const t of a.typischeFehler ?? []) {
      if (!Array.isArray(t.werte) || t.werte.length !== f.length || t.werte.every((w, i) => w === l[i])) m.push('Streifen färben: typischer Fehler passt nicht oder ist die Lösung');
      if (!(t.fehlvorstellung in fv)) m.push(`unbekannte Fehlvorstellung ${t.fehlvorstellung}`);
    }
    if (!['M', 'E'].includes(a.niveau)) m.push('Streifen färben gibt es erst ab M');
  }
  return m;
}

// ---------- Nachweise ----------
// Alle Zahlen, die die Aufgabe zeigt: Text, Antworten, Datentabelle, Tabelle, Bild.
function gezeigt(a) {
  const liste = [...alleZahlen(a.text), ...(a.optionen ?? []).flatMap((o) => alleZahlen(o.text))];
  for (const tab of [a.daten, a.tabelle].filter(Boolean)) for (const c of [...(tab.kopf ?? []), ...tab.zeilen.flat()]) if (typeof c === 'string') liste.push(...alleZahlen(c));
  if (a.bild?.teile) for (const t of a.bild.teile) liste.push(...alleZahlen(t.text));
  if (a.bild?.saeulen) for (const s of a.bild.saeulen) liste.push(Q(s.wert));
  return new Set(liste.map(schl));
}
const KENN = { minimum: (l) => Math.min(...l), maximum: (l) => Math.max(...l), spannweite, mittelwert, zentralwert, summe: (l) => l.reduce((x, y) => x + y, 0), anzahl: (l) => l.length };
function nachweisMaengel(a) {
  const m = [], M = (x) => m.push(x), nachweis = a.nachweis ?? [];
  if (!nachweis.length) return ['Nachweis fehlt'];
  const bekannt = gezeigt(a), kennt = (x) => { const w = wertVon(x); return Boolean(w) && bekannt.has(schl(w)); };
  const optionen = a.optionen ?? [], richtige = optionen.filter((o) => o.richtig);
  const offen = new Set(a.datensatz ? [] : Object.keys(a.luecken ?? {}));
  const farbenOffen = new Set((a.farben ?? []).map((_, i) => i));
  let belegt = false;
  const trifft = (w, n, bruchText = null) => {
    if (n.hilf) return;
    if (n.luecke) { if (!gleich(w, zahlWert(a.luecken?.[n.luecke]?.loesung))) M(`Nachweis ${n.art}: Lücke ${n.luecke} ist ${a.luecken?.[n.luecke]?.loesung}, nachgerechnet ${zeige(w)}`); else { offen.delete(n.luecke); belegt = true; } return; }
    if (n.zwischen) return;
    if (a.format === 'zahl') { if (gleich(w, zahlWert(a.loesung))) belegt = true; else M(`Nachweis ${n.art}: Die Lösung ist ${a.loesung}, nachgerechnet ${zeige(w)}`); return; }
    if (a.format === 'bruch') { if (gleich(w, bruchWert(a.loesung))) belegt = true; else M(`Nachweis ${n.art}: Die Lösung ist ${a.loesung}, nachgerechnet ${zeige(w)}`); return; }
    if (a.format === 'luecken' || a.format === 'tabelle') {
      const k = [...offen].find((x) => gleich(w, zahlWert(a.luecken[x].loesung)));
      if (k) { offen.delete(k); belegt = true; } else if (!a.datensatz) M(`Nachweis ${n.art}: Keine offene Lücke hat den Wert ${zeige(w)}`);
      return;
    }
    if (a.format === 'streifenfaerben') { const i = [...farbenOffen].find((x) => w.n === 1 && a.farben[x].loesung === w.z); if (i != null) { farbenOffen.delete(i); belegt = true; } else M(`Nachweis ${n.art}: Keine Farbe hat ${zeige(w)} Kästchen`); return; }
    if (a.format === 'auswahl') {
      const hat = (o) => (bruchText ? o.text.includes(bruchText) : false) || alleZahlen(o.text).some((z) => gleich(z, w));
      if (!richtige.length || !richtige.every(hat)) M(`Nachweis ${n.art}: Die richtige Antwort nennt ${bruchText ?? zeige(w)} nicht`); else belegt = true;
    }
  };
  for (const n of nachweis) {
    if (typeof n === 'string') {
      const g = zGleichungen(n.replace(/°/g, ''));
      if (g.length !== 1 || g[0].ganz.length < n.replace(/°/g, '').trim().length - 1) { M(`Nachweis: „${n}“ ist keine Gleichung`); continue; }
      if (!g[0].ok) { M(`Nachweis: Gleichung stimmt nicht: ${n}`); continue; }
      // Das Ergebnis der letzten Gleichung belegt die Lösung, wenn es passt (ohne Meldung, wenn nicht: Es kann ein Zwischenschritt sein).
      const w = g[0].werte?.at(-1) ?? null;
      if (w && a.format === 'zahl' && gleich(w, zahlWert(a.loesung))) belegt = true;
      if (w && (a.format === 'luecken' || a.format === 'tabelle')) { const k = [...offen].find((x) => gleich(w, zahlWert(a.luecken[x].loesung))); if (k) { offen.delete(k); belegt = true; } }
      if (w && a.format === 'auswahl' && richtige.length && richtige.every((o) => alleZahlen(o.text).some((z) => gleich(z, w)))) belegt = true;
      continue;
    }
    switch (n?.art) {
      case 'kenngroesse': {
        const werte = n.werte.map(zahlWert), f = KENN[n.was];
        if (!f || werte.some((w) => !w)) { M(`Nachweis kenngroesse: unbekannte Kenngröße oder Werte ${n.werte.join(', ')}`); break; }
        if (!n.beispiel && !n.frei && n.was !== 'anzahl') { const fehlt = n.werte.filter((x) => !kennt(x)); if (fehlt.length) M(`Nachweis kenngroesse: ${fehlt.join(', ')} steht nicht in der Aufgabe`); }
        // In Hundertsteln rechnen, damit 3,2 und 4,15 genau bleiben.
        const h = werte.map((w) => (w.z * 100) / w.n);
        if (h.some((x) => !Number.isInteger(x))) { M('Nachweis kenngroesse: Werte mit mehr als zwei Stellen'); break; }
        let ist = n.was === 'anzahl' ? Q(h.length) : n.was === 'mittelwert' ? Q(h.reduce((x, y) => x + y, 0), 100 * h.length) : Q(f(h) * 2, 200);
        if (n.gerundet != null) ist = runde(ist, n.gerundet);
        const soll = zahlWert(n.wert);
        if (!gleich(ist, soll)) { M(`Nachweis kenngroesse: ${n.was} von ${n.werte.join(', ')} ist ${zeige(ist)}, nicht ${n.wert}`); break; }
        if (n.beispiel) { belegt = true; break; }
        trifft(ist, n); break;
      }
      case 'zaehlen': {
        if (!a.urliste) { M('Nachweis zaehlen: Die Aufgabe hat keine Urliste'); break; }
        const ist = a.urliste.filter((x) => x === n.name).length;
        if (ist !== n.anzahl) { M(`Nachweis zaehlen: ${n.name} kommt ${ist}-mal vor, nicht ${n.anzahl}-mal`); break; }
        trifft(Q(ist), n); break;
      }
      case 'anteil': {
        const anz = Q(n.anzahl), ges = Q(n.gesamt), q = durch(anz, ges);
        if (!q || n.anzahl < 0 || n.anzahl > n.gesamt) { M('Nachweis anteil: Anzahl oder Gesamtzahl passt nicht'); break; }
        const faktor = { bruch: 1, dezimal: 1, prozent: 100, grad: 360 }[n.als];
        if (!faktor) { M(`Nachweis anteil: unbekannte Form ${n.als}`); break; }
        const ist = mal(q, Q(faktor)), soll = wertVon(n.wert);
        if (n.als === 'bruch' && !istGekuerzt(n.wert)) M(`Nachweis anteil: ${n.wert} ist nicht gekürzt`);
        if (!gleich(ist, soll)) { M(`Nachweis anteil: ${n.anzahl} von ${n.gesamt} sind ${zeige(ist)} (${n.als}), nicht ${n.wert}`); break; }
        // Rückwärts: Gesucht ist die Gesamtzahl.
        if (a.format === 'zahl' && !n.luecke && !n.zwischen && gleich(ges, zahlWert(a.loesung))) { belegt = true; break; }
        trifft(ist, n, n.als === 'bruch' ? n.wert : null); break;
      }
      case 'anzahl': {
        const ant = wertVon(n.anteil), ges = Q(n.gesamt), mm = String(n.als).match(/^mm von (\d+)$/);
        const ganz = n.als === 'prozent' ? Q(100) : n.als === 'grad' ? Q(360) : mm ? Q(Number(mm[1])) : null;
        if (!ant || !ganz) { M(`Nachweis anzahl: unbekannte Form ${n.als}`); break; }
        const ist = mal(durch(ant, ganz), ges);
        if (!gleich(ist, Q(n.anzahl))) { M(`Nachweis anzahl: ${n.anteil} (${n.als}) von ${n.gesamt} sind ${zeige(ist)}, nicht ${n.anzahl}`); break; }
        // Gesucht ist die Gesamtzahl, wenn die Lösung sie nennt (rückwärts).
        if (a.format === 'zahl' && !n.luecke && !n.zwischen && gleich(ges, zahlWert(a.loesung)) && !gleich(ist, ges)) { belegt = true; break; }
        // Länge im Streifen: Die Lösung steht in cm.
        if (n.einheit === 'mm' && a.einheit === 'cm') { trifft(Q(n.anzahl, 10), n); break; }
        trifft(ist, n); break;
      }
      case 'lesen': {
        const t = a.bild?.teile?.find((x) => x.name === n.name);
        if (!t) { M(`Nachweis lesen: ${n.name} steht nicht im Diagramm`); break; }
        const anteil = a.bild.art === 'kreisdiagramm' ? durch(alsQ(t.winkel), Q(360)) : Q(t.mm, a.bild.laenge * 10);
        const ist = n.als === 'bruch' ? anteil : n.als === 'prozent' ? mal(anteil, Q(100)) : n.als === 'grad' ? mal(anteil, Q(360)) : null;
        if (!ist || !gleich(ist, wertVon(n.wert))) { M(`Nachweis lesen: ${n.name} ist ${zeige(ist)} (${n.als}), nicht ${n.wert}`); break; }
        // Auswahl nach dem Namen („Kreuze die häufigste Antwort an“).
        if (a.format === 'auswahl' && richtige.length === 1 && richtige[0].text === n.name) { belegt = true; break; }
        trifft(ist, n, n.als === 'bruch' ? n.wert : null); break;
      }
      case 'wert': { const w = wertVon(n.wert); if (!w) { M('Nachweis wert: keine Zahl'); break; } trifft(w, n); break; }
      case 'urteil': {
        const pol = optionen.map((o) => polaritaet(o.text));
        if (!pol.some((p) => p !== null)) { M('Nachweis urteil: keine Antwort mit „Stimmt“ oder „Falsch“'); break; }
        if (!richtige.some((o) => polaritaet(o.text) === n.stimmt)) M('Nachweis urteil: Keine richtige Antwort passt zum Urteil');
        belegt = true; break;
      }
      case 'frei': if (!n.grund && !n.text) M('Nachweis frei: Grund fehlt'); belegt = true; break;
      default: M(`Nachweis: unbekannte Art ${n?.art}`);
    }
  }
  if (a.format === 'luecken' && !a.datensatz) {
    const voll = a.text.replace(/\{\{(\w+)\}\}/g, (_, x) => String(a.luecken?.[x]?.loesung ?? '?'));
    const gl = zGleichungen(voll.replace(/°/g, ''));
    for (const x of gl) if (!x.ok) M(`Lückentext: Gleichung stimmt nicht: ${x.ganz}`);
  }
  if (offen.size) M(`Nachweis: Lücke ${[...offen].join(', ')} ist nicht nachgerechnet`);
  if (a.format === 'streifenfaerben' && farbenOffen.size) M(`Nachweis: Farbe ${[...farbenOffen].map((i) => a.farben[i].name).join(', ')} ist nicht nachgerechnet`);
  if (a.datensatz && !nachweis.some((n) => n?.art === 'kenngroesse' && n.beispiel)) M('Datensatz: Das Beispiel ist nicht nachgerechnet');
  if (optionen.some((o) => polaritaet(o.text) !== null) && !nachweis.some((n) => n?.art === 'urteil')) M('Antworten mit „Stimmt“ oder „Falsch“ brauchen ein Urteil im Nachweis');
  if (!belegt) M('Nachweis: Die Lösung ist nicht nachgerechnet');
  return m;
}

export function pruefeDatenAufgabe(a, fehlvorstellungen) {
  const m = [];
  const f = formatMaengel(a, fehlvorstellungen);
  m.push(...f);
  if (f.some((x) => /^Format/.test(x))) return m;
  m.push(...sprachMaengel(a));
  if (a.bild) m.push(...bildMaengel(a, a.bild).map((x) => `Bild: ${x}`));
  if (a.urliste && (!Array.isArray(a.urliste) || a.urliste.length < 8 || a.urliste.length > 40)) m.push('Urliste mit 8 bis 40 Antworten');
  if (a.heftaufgabe && !['M', 'E'].includes(a.niveau)) m.push('Heftaufgaben gibt es nur auf M und E');
  m.push(...nachweisMaengel(a));
  return m;
}
// Zählt als Bild: Datentabelle, Urliste, Streifen zum Färben.
export const datenHatBild = (a) => Boolean(a.daten) || Boolean(a.urliste) || a.format === 'streifenfaerben';
