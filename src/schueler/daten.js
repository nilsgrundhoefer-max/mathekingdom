// Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058): Prüfungen ohne Oberfläche.
// - Streifen färben: Je Farbe zählt nur die Anzahl der Kästchen, nicht wo sie liegen.
// - Datensatz erfinden: Das Kind tippt Zahlen ein; stimmen Anzahl und verlangte Kenngrößen, ist jede Lösung richtig.

// ---------- Kenngrößen (mit ganzen Zahlen in Zehnteln gerechnet, damit nichts ungenau wird) ----------
export const summe = (l) => l.reduce((x, y) => x + y, 0);
export const sortiert = (l) => [...l].sort((x, y) => x - y);
export function zentralwert(l) { const s = sortiert(l), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; }
export const spannweite = (l) => Math.max(...l) - Math.min(...l);
export const mittelwert = (l) => summe(l) / l.length;

// ---------- Streifen färben ----------
// Eingabe: je Kästchen die Nummer der Farbe oder „-“, durch Kommas getrennt.
export const leseStreifen = (text, n) => { const l = String(text ?? '').split(',').map((x) => (/^\d+$/.test(x.trim()) ? Number(x) : null)); return Array.from({ length: n }, (_, i) => l[i] ?? null); };
export const streifenAnzahlen = (auf, eingabe) => { const l = leseStreifen(eingabe, auf.streifen.kaestchen); return auf.farben.map((_, i) => l.filter((x) => x === i).length); };
export function pruefeStreifenFaerben(auf, eingabe) {
  const ist = streifenAnzahlen(auf, eingabe);
  if (auf.farben.every((f, i) => f.loesung === ist[i])) return { richtig: true, fehlvorstellung: null };
  const treffer = (auf.typischeFehler ?? []).find((f) => f.werte.every((w, i) => w === ist[i]));
  return { richtig: false, fehlvorstellung: treffer?.fehlvorstellung ?? null };
}
export const streifenFaerbenLoesung = (auf) => auf.farben.map((f) => `${f.name} ${f.loesung} Kästchen`).join(', ');

// ---------- Datensatz erfinden ----------
// datensatz: { anzahl, von, bis, mittelwert?, spannweite?, zentralwert?, minimum?, maximum? } mit natürlichen Zahlen.
// Erkannte Fehler: Spannweite als größter Wert, Zentralwert statt Mittelwert.
const zahlAus = (x) => (/^\d+$/.test(String(x ?? '').trim()) ? Number(String(x).trim()) : null);
export function pruefeDatensatz(auf, eingabe) {
  const d = auf.datensatz, namen = Object.keys(auf.luecken), werte = namen.map((n) => zahlAus(eingabe?.[n]));
  if (werte.some((w) => w == null || w < d.von || w > d.bis)) return { richtig: false, fehlvorstellung: null };
  const ist = { mittelwert: mittelwert(werte), spannweite: spannweite(werte), zentralwert: zentralwert(werte), minimum: Math.min(...werte), maximum: Math.max(...werte) };
  const passt = (k) => d[k] == null || ist[k] === d[k];
  if (['mittelwert', 'spannweite', 'zentralwert', 'minimum', 'maximum'].every(passt)) return { richtig: true, fehlvorstellung: null };
  if (d.spannweite != null && ist.spannweite !== d.spannweite && ist.maximum === d.spannweite) return { richtig: false, fehlvorstellung: 'spannweite-groesster-wert' };
  if (d.mittelwert != null && ist.mittelwert !== d.mittelwert && ist.zentralwert === d.mittelwert) return { richtig: false, fehlvorstellung: 'mittelwert-mitte' };
  return { richtig: false, fehlvorstellung: null };
}
