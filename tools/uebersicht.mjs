// Schreibt eine lesbare Übersicht aller Aufgaben zur Durchsicht durch die Lehrkraft.
// Aufruf: node tools/uebersicht.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const NAMEN = { F: 'Grundlage (Basiskompetenzen, nur über die Grundlagen-Schleife)', G: 'Grundlegendes Niveau (Hauptschulabschluss)', M: 'Mittleres Niveau (Realschulabschluss)', E: 'Erweitertes Niveau (Zugabe Richtung Gymnasium)' };
const flach = (t) => String(t).replace(/\n/g, ' / ');
const fehler = (liste) => (liste?.length ? ` Typische Fehler: ${liste.map((f) => `${f.wert} (${f.fehlvorstellung})`).join(', ')}.` : '');
const zahl = (a) => `**${a.loesung}${a.einheit ? ' ' + a.einheit : ''}**.${fehler(a.typischeFehler)}`;

// Bild zur Aufgabe in Worten, damit die Durchsicht auch ohne Dashboard sieht, was gezeichnet wird.
const wert = (w) => (typeof w === 'object' ? (w.frage ? '?' : w.wert) : w);
const bild = (b) => {
  if (!b) return '';
  const text = {
    zehnerfeld: () => `Zehnerfeld mit ${b.felder} Feldern, ${b.belegt} belegt${b.dazu ? `, ${b.dazu} dazu` : ''}${b.weg ? `, ${b.weg} durchgestrichen` : ''}`,
    mengenbild: () => `Mengenbild: ${b.anzahl} Plättchen${b.dazu ? `, ${b.dazu} dazu` : ''}${b.weg ? `, ${b.weg} durchgestrichen` : ''}`,
    gruppenbild: () => `${b.gruppen} Gruppen mit je ${b.je} Plättchen${b.rest ? `, ${b.rest} einzeln daneben` : ''}`,
    quadratbild: () => (b.schichten ? `Würfel aus ${b.schichten} Schichten mit je ${b.seite} · ${b.seite} Würfelchen` : `Quadrat aus ${b.seite} · ${b.seite} Kästchen`),
    paeckchen: () => `${b.einzeln ? `${b.einzeln} einzelne Plättchen und ` : ''}${b.paeckchen} Päckchen mit je ${b.je} Plättchen`,
    punktefeld: () => `Punktefeld mit ${b.reihen} Reihen zu je ${b.spalten} Punkten${b.trenn ? `, Trennlinie nach ${b.trenn} Reihen` : ''}`,
    zehnermaterial: () => `Zehnermaterial: ${b.h ? `${b.h} Hunderterplatten, ` : ''}${b.z} Zehnerstangen, ${b.e} Einerwürfel${b.weg ? `, durchgestrichen: ${JSON.stringify(b.weg)}` : ''}`,
    stellenwerttafel: () => `Stellenwerttafel ${b.spalten.map((x, i) => `${x}: ${b.plaettchen[i]}`).join(', ')}`,
    streifen: () => `Streifenbild: Ganzes ${wert(b.ganz)}, Teile ${b.teile.map(wert).join(' und ')}`,
    vergleich: () => `Vergleichsbild: ${b.oben.name} ${wert(b.oben.wert)}, ${b.unten.name} ${wert(b.unten.wert)}${b.unterschied != null ? `, Unterschied ${wert(b.unterschied)}` : ''}`,
    zahlenstrahl: () => `Zahlenstrahl ${b.von} bis ${b.bis}${b.spruenge?.length ? `, Sprünge ${b.spruenge.map((x) => `${x.von} nach ${x.nach} (${x.text})`).join(', ')}` : ''}`,
  }[b.art];
  return ` _(Bild: ${text ? text() : b.art})_`;
};

const loesung = (a) => {
  if (a.format === 'zahl') return `Lösung: ${zahl(a)}`;
  if (a.format === 'zahlenstrahl') {
    const st = a.strahl;
    return `_(Zahlenstrahl ${st.von} bis ${st.bis}, Teilstriche alle ${st.schritt}${st.spruenge ? `, Sprung ${st.spruenge.map((x) => `von ${x.von}: ${x.text}`).join('; ')}` : ''}; ${a.eingabe === 'markieren' ? 'antippen' : 'Zahl eintragen'})_ Lösung: ${zahl(a)}`;
  }
  if (a.format === 'diagramm') return `\n  _(Säulendiagramm „${a.diagramm.titel}“: ${a.diagramm.saeulen.map((x) => `${x.name} ${x.wert}`).join(', ')}; Werte ${a.diagramm.werteZeigen ? 'stehen an den Säulen' : 'müssen abgelesen werden'})_\n${a.teile.map((t, i) => `  - ${'abcdef'[i]}) ${flach(t.text)} ${zahl(t)}`).join('\n')}`;
  if (a.format === 'tabelle') {
    const zelle = (c) => (typeof c === 'object' ? `**${a.luecken[c.luecke].loesung}**` : c);
    const t = a.tabelle;
    if (t.art === 'mauer') return `_(${t.rechenart === '·' ? 'Mal-Mauer' : 'Zahlenmauer'}, von oben nach unten; fett = Eingabefeld)_ ${t.zeilen.map((r) => r.map(zelle).join(' · ')).join(' / ')}`;
    if (t.art === 'malkreuz') return `_(Malkreuz; fett = Eingabefeld)_\n\n  | ${t.kopf.join(' | ')} |\n  |${t.kopf.map(() => '---').join('|')}|\n${t.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n\n  ${t.rechnung.faktoren.join(' · ')} = **${a.luecken[t.rechnung.summe].loesung}**\n`;
    if (t.art === 'raster' && t.rechnung?.zeichen === '·') return ` _(Rechenraster wie im Heft, hier mit Lösung)_\n\n\`\`\`\n${t.zeilen.map((z) => z.map((c) => (typeof c === 'object' ? a.luecken[c.luecke].loesung : c || ' ')).join(' ')).join('\n')}\n\`\`\`\n`;
    return `${a.tabelle.art === 'raster' ? ' _(Rechenraster mit Ziffernfeldern)_' : ''}\n\n  | ${a.tabelle.kopf.join(' | ')} |\n  |${a.tabelle.kopf.map(() => '---').join('|')}|\n${a.tabelle.zeilen.map((z) => `  | ${z.map(zelle).join(' | ')} |`).join('\n')}\n`;
  }
  if (a.format === 'auswahl') return a.optionen.map((o) => `  - ${o.richtig ? '☑' : '☐'} ${flach(o.text)}`).join('\n');
  if (a.format === 'luecken') return `Lösung: ${Object.entries(a.luecken).map(([n, l]) => `${n} = **${l.loesung}**`).join(', ')}`;
  if (a.format === 'zuordnen') return `Lösung: ${a.paare.map((p) => `${p.links} → ${p.rechts}`).join(', ')}`;
  return a.teile.map((t, i) => `  - ${'abcdef'[i]}) ${flach(t.text)} ${zahl(t)}`).join('\n');
};

const alleLernziele = new Map(pool.kapitel.flatMap((k) => k.unterkapitel).flatMap((u) => u.lernziele).map((l) => [l.id, l.text]));
// Prozessbezogene Kompetenz (ADR 0017): Haupt, in Klammern die Nebenkompetenz.
const kompetenzText = (a) => `${pool.kompetenzen[a.kompetenz[0]]}${a.kompetenz[1] ? ` (+ ${pool.kompetenzen[a.kompetenz[1]]})` : ''}`;
let md = `# Aufgaben Klasse 5: Übersicht zur Durchsicht\n\nAutomatisch erzeugt aus \`aufgabenpool/klasse-5.json\` (${pool.aufgaben.length} Aufgaben). Nicht von Hand bearbeiten.\n\nBei Auswahlaufgaben ist ☑ die Antwort, die der Schüler ankreuzen muss.\n`;
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  const eigene = pool.aufgaben.filter((a) => a.lernziel === l.id);
  if (!eigene.length) continue;
  const vor = l.voraussetzungen?.length ? l.voraussetzungen.map((v) => `${v} (${alleLernziele.get(v)})`).join(', ') : 'nur Grundschulstoff';
  md += `\n## ${l.id}: ${l.text}\n\nGrundlage, die F übt: ${l.grundlage}\n\nBaut auf: ${vor}\n`;
  for (const n of Object.keys(NAMEN)) {
    const gruppe = eigene.filter((a) => a.niveau === n);
    md += `\n### ${n} · ${NAMEN[n]}\n\n`;
    // Je Niveaustufe gibt es unterschiedlich viele Hilfekärtchen (ADR 0015). Zeilenumbrüche der einfachen Sprache werden zu " / ".
    const karten = (h) => [['tipp', 'Tipp'], ['beispiel', 'Beispiel'], ['loesungsschritt', 'Lösungsschritt']].filter(([f]) => h[f]).map(([f, n]) => `*${n}:* ${flach(h[f])}`).join(' ');
    if (!gruppe.length) continue;
    md += `Hilfekärtchen der ersten Aufgabe: ${karten(gruppe[0].hilfen)}\n\n`;
    for (const a of gruppe) {
      const mehrzeilig = a.format === 'auswahl' || a.format === 'sachaufgabe';
      md += `- \`${a.id.split('-').pop()}\` AFB ${'I'.repeat(a.afb)} · _${kompetenzText(a)}_ · ${flach(a.text).replace(/\{\{(\w+)\}\}/g, '▢')}${bild(a.bild)}${mehrzeilig ? '\n' : ' '}${loesung(a)}\n`;
    }
  }
}
md += `\n## Typische Fehler und Aha-Momente\n\nJe Fehlvorstellung: was die Lehrkraft liest, was der Schüler nach dem ersten Fehlversuch liest, und der Satz für den Aha-Moment, wenn er den Fehler überwunden hat (ADR 0017).\n\n| Kürzel | Für die Lehrkraft | Hinweis an den Schüler | Aha-Moment |\n|---|---|---|---|\n`;
for (const [id, f] of Object.entries(pool.fehlvorstellungen)) md += `| \`${id}\` | ${f.beschreibung} | ${f.hinweis} | ${f.kind} |\n`;
md += `\n## Voraussetzungen der Lernziele ohne Aufgaben\n\n`;
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  if (pool.aufgaben.some((a) => a.lernziel === l.id)) continue;
  md += `- ${l.id} ${l.text} Baut auf: ${l.voraussetzungen?.length ? l.voraussetzungen.map((v) => `${v} (${alleLernziele.get(v)})`).join(', ') : 'nur Grundschulstoff'}\n`;
}
writeFileSync(new URL('../docs/aufgaben-klasse-5-pilot.md', import.meta.url), md);
console.log('Übersicht geschrieben.');
