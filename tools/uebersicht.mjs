// Schreibt eine lesbare Übersicht aller Aufgaben zur Durchsicht durch die Lehrkraft.
// Aufruf: node tools/uebersicht.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const pool = JSON.parse(readFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), 'utf8'));
const NAMEN = { F: 'Förderniveau', G: 'Grundlegendes Niveau', M: 'Mittleres Niveau', E: 'Erweitertes Niveau' };
const fehler = (liste) => (liste?.length ? ` Typische Fehler: ${liste.map((f) => `${f.wert} (${f.fehlvorstellung})`).join(', ')}.` : '');
const zahl = (a) => `**${a.loesung}${a.einheit ? ' ' + a.einheit : ''}**.${fehler(a.typischeFehler)}`;

const loesung = (a) => {
  if (a.format === 'zahl') return `Lösung: ${zahl(a)}`;
  if (a.format === 'auswahl') return a.optionen.map((o) => `  - ${o.richtig ? '☑' : '☐'} ${o.text}`).join('\n');
  if (a.format === 'luecken') return `Lösung: ${Object.entries(a.luecken).map(([n, l]) => `${n} = **${l.loesung}**`).join(', ')}`;
  if (a.format === 'zuordnen') return `Lösung: ${a.paare.map((p) => `${p.links} → ${p.rechts}`).join(', ')}`;
  return a.teile.map((t, i) => `  - ${'abcdef'[i]}) ${t.text} ${zahl(t)}`).join('\n');
};

let md = `# Aufgaben Klasse 5, Pilot: Übersicht zur Durchsicht\n\nAutomatisch erzeugt aus \`aufgabenpool/klasse-5.json\` (${pool.aufgaben.length} Aufgaben). Nicht von Hand bearbeiten.\n\nBei Auswahlaufgaben ist ☑ die Antwort, die der Schüler ankreuzen muss.\n`;
for (const k of pool.kapitel) for (const u of k.unterkapitel) for (const l of u.lernziele) {
  const eigene = pool.aufgaben.filter((a) => a.lernziel === l.id);
  if (!eigene.length) continue;
  md += `\n## ${l.id}: ${l.text}\n`;
  for (const n of Object.keys(NAMEN)) {
    const gruppe = eigene.filter((a) => a.niveau === n);
    md += `\n### ${n} · ${NAMEN[n]}\n\n`;
    const h = gruppe[0].hilfen;
    md += `Hilfekärtchen der ersten Aufgabe: *Tipp:* ${h.tipp} *Beispiel:* ${h.beispiel} *Lösungsschritt:* ${h.loesungsschritt}\n\n`;
    for (const a of gruppe) {
      const mehrzeilig = a.format === 'auswahl' || a.format === 'sachaufgabe';
      md += `- \`${a.id.split('-').pop()}\` ${a.text.replace(/\{\{(\w+)\}\}/g, '▢')}${mehrzeilig ? '\n' : ' '}${loesung(a)}\n`;
    }
  }
}
writeFileSync(new URL('../docs/aufgaben-klasse-5-pilot.md', import.meta.url), md);
console.log('Übersicht geschrieben.');
