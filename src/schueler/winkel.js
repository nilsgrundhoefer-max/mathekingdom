// Kapitel 7 „Kreis und Winkel“ (ADR 0034): Rechnen mit Winkeln ohne Oberfläche.
// Winkel stehen in Grad. Eine Richtung ist ein Winkel gegen den Uhrzeigersinn, gemessen von „nach rechts“ (0°), wie am Geodreieck.
// Ein Winkel im Bild beginnt am ersten Schenkel (Richtung `von`) und öffnet sich gegen den Uhrzeigersinn um `groesse` Grad.
// Beim Winkeldrehen ist die Eingabe ein Text mit der Gradzahl gegen den Uhrzeigersinn vom festen Schenkel aus („137“).

export const rund = (w) => ((Math.round(w) % 360) + 360) % 360;
// Abstand zweier Richtungen auf dem Kreis, immer zwischen 0° und 180°.
export const kreisAbstand = (a, b) => { const d = Math.abs((((a - b) % 360) + 360) % 360); return Math.min(d, 360 - d); };
export const bogenmass = (grad) => (grad * Math.PI) / 180;
export const richtungVon = (grad) => [Math.cos(bogenmass(grad)), Math.sin(bogenmass(grad))];

// Winkelarten (Nils, 2026-11-21): spitz, recht und stumpf ab F, gestreckt und Vollwinkel ab G, überstumpf ab M. Den Nullwinkel gibt es nicht.
export function winkelart(grad) {
  if (grad > 0 && grad < 90) return 'spitz';
  if (grad === 90) return 'recht';
  if (grad > 90 && grad < 180) return 'stumpf';
  if (grad === 180) return 'gestreckt';
  if (grad > 180 && grad < 360) return 'überstumpf';
  if (grad === 360) return 'voll';
  return null;
}
export const ARTNAME = { spitz: 'spitzer Winkel', recht: 'rechter Winkel', stumpf: 'stumpfer Winkel', gestreckt: 'gestreckter Winkel', 'überstumpf': 'überstumpfer Winkel', voll: 'Vollwinkel' };

export function leseGrad(text) {
  const s = String(text ?? '').replace(/[\s°]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}
// Winkeldrehen prüfen: richtig ist jede Lage des zweiten Schenkels, die höchstens `toleranz` Grad von der Lösung abweicht.
// Typische Fehler gelten mit demselben Spielraum.
export function pruefeWinkel(aufgabe, eingabe) {
  const wert = leseGrad(eingabe);
  if (Number.isNaN(wert)) return { richtig: false, fehlvorstellung: null };
  const spiel = aufgabe.toleranz ?? 2;
  if (kreisAbstand(wert, aufgabe.loesung) <= spiel) return { richtig: true, fehlvorstellung: null };
  const f = (aufgabe.typischeFehler ?? []).find((x) => kreisAbstand(wert, x.wert) <= spiel);
  return { richtig: false, fehlvorstellung: f?.fehlvorstellung ?? null };
}
export const winkelLoesung = (aufgabe) => `${aufgabe.loesung}°`;
