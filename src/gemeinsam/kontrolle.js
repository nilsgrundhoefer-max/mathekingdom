// Kontrollierte Aufgaben (0.37, CONTEXT.md „Kontrolliert“, „Kontrollliste“).
// Der Administrator hakt im Aufgabentester Aufgaben als kontrolliert ab. Das Häkchen gilt für genau einen Inhalt:
// Ändert sich die Aufgabe, passt ihr Fingerabdruck nicht mehr, und sie ist wieder nicht kontrolliert.
//
// Zwei Listen kommen zusammen:
//   repo      aufgabenpool/kontrolliert.json, mit der Version ausgeliefert: { kennung: fingerabdruck }
//   laufwerk  Datei auf dem Lehrertauschlaufwerk: { kennung: { fp, t } } oder { kennung: { zurueck: true, t } }
// Eine Aufgabe ist kontrolliert, wenn eine der beiden Listen ihren aktuellen Fingerabdruck trägt, außer der
// Administrator hat das Häkchen auf dem Laufwerk zurückgenommen. Der Export enthält immer alle Häkchen.

export const LAUFWERK_DATEI = 'aufgaben-kontrolliert.json';
export const EXPORT_ART = 'mathekingdom-kontrollliste';

// Feste Reihenfolge der Schlüssel, damit derselbe Inhalt immer denselben Text ergibt.
function stabil(wert) {
  if (Array.isArray(wert)) return `[${wert.map(stabil).join(',')}]`;
  if (wert && typeof wert === 'object') return `{${Object.keys(wert).sort().map((k) => `${JSON.stringify(k)}:${stabil(wert[k])}`).join(',')}}`;
  return JSON.stringify(wert ?? null);
}
// FNV-1a über den ganzen Inhalt der Aufgabe, zweimal mit verschiedenem Startwert: 16 Hexadezimalzeichen.
export function fingerabdruck(aufgabe) {
  const text = stabil(aufgabe);
  const lauf = (start) => {
    let x = start;
    for (let i = 0; i < text.length; i++) { x ^= text.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
    return x.toString(16).padStart(8, '0');
  };
  return lauf(0x811c9dc5) + lauf(0x01234567);
}

// Zustand je Aufgabe: { kontrolliert, quelle: 'laufwerk' | 'repo' | null, veraltet, t }
// veraltet: Es gab ein Häkchen, aber die Aufgabe hat sich seitdem geändert.
export function zustand(aufgabe, repo = {}, laufwerk = {}) {
  const fp = fingerabdruck(aufgabe), l = laufwerk[aufgabe.id], r = repo[aufgabe.id];
  if (l?.zurueck) return { kontrolliert: false, quelle: null, veraltet: false, t: l.t ?? null };
  if (l?.fp === fp) return { kontrolliert: true, quelle: 'laufwerk', veraltet: false, t: l.t ?? null };
  if (r === fp) return { kontrolliert: true, quelle: 'repo', veraltet: false, t: null };
  return { kontrolliert: false, quelle: null, veraltet: Boolean(l?.fp || r), t: null };
}

export function hake(laufwerk, aufgabe, jetzt) {
  return { ...laufwerk, [aufgabe.id]: { fp: fingerabdruck(aufgabe), t: jetzt } };
}
export function nimmZurueck(laufwerk, aufgabe, jetzt) {
  return { ...laufwerk, [aufgabe.id]: { zurueck: true, t: jetzt } };
}

// Alle kontrollierten Aufgaben mit aktuellem Fingerabdruck, nach Kennung sortiert.
export function kontrollierte(aufgaben, repo, laufwerk) {
  return Object.fromEntries(aufgaben.filter((a) => zustand(a, repo, laufwerk).kontrolliert)
    .map((a) => [a.id, fingerabdruck(a)]).sort(([a], [b]) => a.localeCompare(b)));
}
export function alsExport(aufgaben, repo, laufwerk, jetzt) {
  const liste = kontrollierte(aufgaben, repo, laufwerk);
  return { art: EXPORT_ART, erstellt: jetzt, anzahl: Object.keys(liste).length, von: aufgaben.length, aufgaben: liste };
}
// Liest eine exportierte Kontrollliste. Wirft bei einer fremden Datei.
export function liesExport(text) {
  const d = JSON.parse(text);
  if (d?.art !== EXPORT_ART || typeof d.aufgaben !== 'object') throw new Error('Das ist keine Kontrollliste aus dem Aufgabentester.');
  return d.aufgaben;
}
