// Kapitel 5 „Geometrische Grundbegriffe und ebene Figuren“: Rechnen auf dem Karogitter (ADR 0032).
// Ein Punkt ist [x, y] in Kästchen, die y-Achse zeigt nach oben. Alles hier ist reine Rechnung ohne Oberfläche.
// Eine Eingabe im Gitterzeichnen ist ein Text aus Punkten: „(3|5) (4|1)“. So bleibt sie im Protokoll und in der Auswertung lesbar.

export const punktText = (p) => `(${p[0]}|${p[1]})`;
export const alsEingabe = (punkte) => punkte.map(punktText).join(' ');
export const lesePunkte = (text) => [...String(text ?? '').matchAll(/\((-?\d+)\|(-?\d+)\)/g)].map((m) => [Number(m[1]), Number(m[2])]);

export const gleich = (p, q) => p[0] === q[0] && p[1] === q[1];
const richtung = (a, b) => [b[0] - a[0], b[1] - a[1]];
const kreuz = (u, v) => u[0] * v[1] - u[1] * v[0];
const skalar = (u, v) => u[0] * v[0] + u[1] * v[1];
export const aufGerade = (p, a, b) => kreuz(richtung(a, b), richtung(a, p)) === 0;
const gleicheMenge = (a, b) => a.length === b.length && a.every((p) => b.some((q) => gleich(p, q))) && b.every((p) => a.some((q) => gleich(p, q)));

// Erfüllt die gezeichnete Linie durch p und q die Bedingung? Arten:
// strecke { a, b }: genau diese Strecke. gerade { a, b }: irgendzwei Punkte dieser Geraden. eine { linien: [[a, b], …] }: eine dieser Geraden.
// senkrecht { zu: [a, b], durch? }, parallel { zu: [a, b], durch?, abstand? (in Kästchen) }: Lage zu einer Linie, nie die Linie selbst.
// laenge { laenge (in Kästchen), von?, auf?: [a, b] }: eine Strecke dieser Länge, mit festem Anfang oder auf einer Linie.
export function erfuellt(bed, linie) {
  const [p, q] = linie ?? [];
  if (!p || !q || gleich(p, q)) return false;
  const r = richtung(p, q);
  switch (bed.art) {
    case 'strecke': return (gleich(p, bed.a) && gleich(q, bed.b)) || (gleich(p, bed.b) && gleich(q, bed.a));
    case 'gerade': return aufGerade(p, bed.a, bed.b) && aufGerade(q, bed.a, bed.b);
    case 'eine': return bed.linien.some(([a, b]) => aufGerade(p, a, b) && aufGerade(q, a, b));
    case 'senkrecht': return skalar(r, richtung(...bed.zu)) === 0 && (!bed.durch || aufGerade(bed.durch, p, q));
    case 'parallel': {
      const z = richtung(...bed.zu);
      if (kreuz(r, z) !== 0 || aufGerade(p, ...bed.zu)) return false;
      if (bed.durch && !aufGerade(bed.durch, p, q)) return false;
      // Abstand: Fläche des Parallelogramms durch die Grundseite, ohne Wurzel verglichen.
      if (bed.abstand != null && kreuz(z, richtung(bed.zu[0], p)) ** 2 !== bed.abstand ** 2 * skalar(z, z)) return false;
      return true;
    }
    case 'laenge': {
      if (skalar(r, r) !== bed.laenge ** 2) return false;
      if (bed.von && !gleich(p, bed.von) && !gleich(q, bed.von)) return false;
      if (bed.auf && !(aufGerade(p, ...bed.auf) && aufGerade(q, ...bed.auf))) return false;
      return true;
    }
    default: return false;
  }
}

// Gitterzeichnen prüfen. Punkte und Kästchen: genau die verlangte Menge. Linie: die Bedingung der Aufgabe.
// Kapitel 7 (ADR 0034): Kreis am Gitter. Der erste Punkt ist der Mittelpunkt, der zweite liegt auf der Kreislinie.
// bedingung { art: 'kreis', m, r } mit r in Kästchen. Ein typischer Fehler nennt einen anderen Mittelpunkt oder Radius.
const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
export const kreisPasst = (bed, punkte) => punkte.length === 2 && gleich(punkte[0], bed.m) && d2(punkte[0], punkte[1]) === bed.r ** 2;
export function pruefeGitter(aufgabe, eingabe) {
  const punkte = lesePunkte(eingabe);
  if (aufgabe.eingabe === 'kreis') {
    if (kreisPasst(aufgabe.bedingung, punkte)) return { richtig: true, fehlvorstellung: null };
    return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => kreisPasst({ m: aufgabe.bedingung.m, ...f.bedingung }, punkte))?.fehlvorstellung ?? null };
  }
  if (aufgabe.eingabe === 'linie') {
    if (erfuellt(aufgabe.bedingung, punkte)) return { richtig: true, fehlvorstellung: null };
    return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => erfuellt(f.bedingung, punkte))?.fehlvorstellung ?? null };
  }
  if (gleicheMenge(punkte, aufgabe.loesung)) return { richtig: true, fehlvorstellung: null };
  return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => gleicheMenge(punkte, f.punkte))?.fehlvorstellung ?? null };
}
// Die Lösung in Worten, für Ergebniszeile, Tafelbild und Meldungen.
export function gitterLoesung(aufgabe) {
  if (aufgabe.eingabe === 'kreis') return aufgabe.gitter.achsen ? `Kreis um ${punktText(aufgabe.bedingung.m)} durch ${punktText(aufgabe.beispiel[1])}` : 'siehe Bild';
  if (aufgabe.eingabe === 'linie') return !aufgabe.gitter.achsen ? 'siehe Bild' : `zum Beispiel die Linie durch ${alsEingabe(aufgabe.beispiel).replace(' ', ' und ')}`;
  if (aufgabe.eingabe === 'zellen') return `${aufgabe.loesung.length} Kästchen, siehe Bild`;
  return aufgabe.gitter.achsen ? aufgabe.loesung.map(punktText).join(', ') : 'siehe Bild';
}
