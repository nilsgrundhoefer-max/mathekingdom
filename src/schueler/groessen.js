// Rechnen mit Größen (Kapitel 6, ADR 0033): Geld, Länge, Gewicht und Zeit. Kapitel 8 (ADR 0035): Flächeninhalt in mm² bis km².
// Jede Größe wird als ganze Zahl in ihrer Grundeinheit geführt: Cent, Millimeter, Milligramm, Sekunde.
// So braucht das Programm keine Kommazahlen. Das Komma ist nur eine Schreibweise für zwei Einheiten (3,50 € sind 350 ct).

export const EINHEITEN = {
  ct: ['geld', 1], '€': ['geld', 100],
  mm: ['laenge', 1], cm: ['laenge', 10], dm: ['laenge', 100], m: ['laenge', 1000], km: ['laenge', 1000000],
  mg: ['gewicht', 1], g: ['gewicht', 1000], kg: ['gewicht', 1000000], t: ['gewicht', 1000000000],
  s: ['zeit', 1], min: ['zeit', 60], h: ['zeit', 3600], d: ['zeit', 86400],
  // Kapitel 8: Grundeinheit ist der Quadratmillimeter, die Umrechnungszahl 100.
  'mm²': ['flaeche', 1], 'cm²': ['flaeche', 100], 'dm²': ['flaeche', 10000], 'm²': ['flaeche', 1000000], a: ['flaeche', 100000000], ha: ['flaeche', 10000000000], 'km²': ['flaeche', 1000000000000],
  // Klasse 6, Kapitel 6 (ADR 0049): Grundeinheit ist der Kubikmillimeter, die Umrechnungszahl 1000. 1 l = 1 dm³, 1 ml = 1 cm³.
  'mm³': ['volumen', 1], 'cm³': ['volumen', 1000], 'dm³': ['volumen', 1000000], 'm³': ['volumen', 1000000000], ml: ['volumen', 1000], l: ['volumen', 1000000], hl: ['volumen', 100000000],
};
export const ART_NAMEN = { geld: 'Geld', laenge: 'Länge', gewicht: 'Gewicht', zeit: 'Zeit', flaeche: 'Flächeninhalt', volumen: 'Volumen' };
export const artVon = (einheit) => EINHEITEN[einheit]?.[0] ?? null;
export const faktorVon = (einheit) => EINHEITEN[einheit]?.[1] ?? null;
const gliedere = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));

// Liest „2,5“, „2.5“, „1 250“ oder „1.250“ als Bruch { z, n }: 2,5 ist 25 Zehntel. Ein Punkt vor genau drei Ziffern gliedert nur,
// außer nach einer einzelnen Null: „0.125“ ist 0,125 (Klasse 6, ADR 0049).
export function leseKommazahl(text) {
  const s = String(text ?? '').replace(/[\s  ']/g, '').replace(/^0\./, '0,').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace('.', ',');
  const m = s.match(/^(\d+)(?:,(\d{1,3}))?$/);
  return m ? { z: Number(m[1] + (m[2] ?? '')), n: 10 ** (m[2]?.length ?? 0) } : null;
}
// Wert einer Angabe in der Grundeinheit. null, wenn die Zahl nicht lesbar ist oder nicht aufgeht (0,5 ct).
export function inGrundeinheit(text, einheit) {
  const k = leseKommazahl(text), f = faktorVon(einheit);
  if (!k || !f || (k.z * f) % k.n !== 0) return null;
  return (k.z * f) / k.n;
}
// Trennt eine Eingabe wie „2,5 km“ in Zahl und Einheit. Ohne Einheit bleibt sie leer.
export function teileEingabe(eingabe) {
  const t = String(eingabe ?? '').trim(), m = t.match(/^(.*?)\s*(€|[a-z]+[²³]?)$/);
  return m && EINHEITEN[m[2]] ? { zahl: m[1].trim(), einheit: m[2] } : { zahl: t, einheit: '' };
}

// Schreibt einen Wert der Grundeinheit in einer Einheit: 2500000 mm in km wird „2,5 km“, 350 ct in € wird „3,50 €“.
// Geht es in der Einheit nicht als Kommazahl auf (Zeit), steht die Größe gemischt da: „1 h 30 min“.
// `komma`: Ab Klasse 6 steht auch eine Fläche mit Komma da (ADR 0049): „3,75 cm²“.
export function schreibe(wert, einheit, komma = false) {
  const [art, f] = EINHEITEN[einheit];
  if (wert % f === 0) return `${gliedere(wert / f)} ${einheit}`;
  if (art === 'zeit') return gemischt(wert, Object.keys(EINHEITEN).filter((e) => artVon(e) === 'zeit' && faktorVon(e) <= f).reverse());
  // Flächen stehen in Klasse 5 nie mit Komma (ADR 0035), sondern gemischt: „3 m² 25 dm²“.
  if (art === 'flaeche' && !komma) {
    const kleiner = Object.keys(EINHEITEN).filter((e) => artVon(e) === 'flaeche' && faktorVon(e) < f).sort((x, y) => faktorVon(y) - faktorVon(x));
    return gemischt(wert, [einheit, kleiner.find((e) => wert % faktorVon(e) === 0)]);
  }
  let nach = String(wert % f).padStart(String(f).length - 1, '0').replace(/0+$/, '');
  if (einheit === '€') nach = nach.padEnd(2, '0');
  return `${gliedere(Math.floor(wert / f))},${nach} ${einheit}`;
}
// Gemischte Schreibweise mit den genannten Einheiten von groß nach klein: gemischt(350, ['€', 'ct']) wird „3 € 50 ct“.
export function gemischt(wert, einheiten) {
  const teile = [];
  let rest = wert;
  einheiten.forEach((e, i) => {
    const f = faktorVon(e), n = i === einheiten.length - 1 ? rest / f : Math.floor(rest / f);
    rest -= n * f;
    if (n) teile.push(`${gliedere(n)} ${e}`);
  });
  return teile.length ? teile.join(' ') : `0 ${einheiten.at(-1)}`;
}
// Uhrzeit aus Minuten seit Mitternacht: 875 wird „14:35 Uhr“.
export const uhrzeit = (minuten) => `${Math.floor(minuten / 60)}:${String(minuten % 60).padStart(2, '0')} Uhr`;

// Prüft die Eingabe einer Größenaufgabe. Richtig ist jede Schreibweise mit demselben Wert: 2,5 km, 2500 m oder 2 500 m.
// Fehlt die Einheit oder gehört sie zu einer anderen Größenart, ist das der typische Fehler „einheit-fehlt“.
// Klasse 6, Kapitel 6 (ADR 0049): Länge, Fläche und Volumen verwechselt (cm² statt cm³) ist der Fehler „einheit-art“.
// Mit `verlangt` nennt die Aufgabe ihre Einheit („Gib das Volumen in Litern an“): Der richtige Wert in einer anderen Einheit
// ist dann „fast richtig“ (`nachbessern: 'einheit'`) und kostet keinen Versuch.
const RAUM = ['laenge', 'flaeche', 'volumen'];
export function pruefeGroesse(aufgabe, eingabe) {
  const { zahl, einheit } = teileEingabe(eingabe);
  if (!einheit || artVon(einheit) !== aufgabe.groesse) {
    const verwechselt = einheit && RAUM.includes(artVon(einheit)) && RAUM.includes(aufgabe.groesse) && aufgabe.groesse !== 'laenge';
    return { richtig: false, fehlvorstellung: verwechselt ? 'einheit-art' : 'einheit-fehlt' };
  }
  const wert = inGrundeinheit(zahl, einheit);
  if (wert === aufgabe.loesung) {
    if (aufgabe.verlangt && einheit !== aufgabe.einheit) return { richtig: false, fehlvorstellung: 'einheit-verlangt', nachbessern: 'einheit' };
    return { richtig: true, fehlvorstellung: null };
  }
  return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => f.wert === wert)?.fehlvorstellung ?? null };
}
// Die Lösung einer Größenaufgabe in ihrer Einheit, für Lösungstext und Auswertung.
export const loesungGroesse = (aufgabe) => schreibe(aufgabe.loesung, aufgabe.einheit, !String(aufgabe.lernziel ?? '5.').startsWith('5.'));
