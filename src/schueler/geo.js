// Kapitel 5 „Geometrische Grundbegriffe und ebene Figuren“: Rechnen auf dem Karogitter (ADR 0032).
// Ein Punkt ist [x, y] in Kästchen, die y-Achse zeigt nach oben. Alles hier ist reine Rechnung ohne Oberfläche.
// Eine Eingabe im Gitterzeichnen ist ein Text aus Punkten: „(3|5) (4|1)“. So bleibt sie im Protokoll und in der Auswertung lesbar.

import { zellenErfuellt } from './flaeche.js';

// Klasse 7 (ADR 0043): Koordinaten dürfen negativ sein. Geschrieben werden sie mit dem echten Minuszeichen, gelesen auch mit Bindestrich.
const mz = (n) => (n < 0 ? `−${-n}` : String(n));
export const punktText = (p) => `(${mz(p[0])}|${mz(p[1])})`;
export const alsEingabe = (punkte) => punkte.map(punktText).join(' ');
export const lesePunkte = (text) => [...String(text ?? '').matchAll(/\(([-−]?\d+)\|([-−]?\d+)\)/g)].map((m) => [Number(m[1].replace('−', '-')), Number(m[2].replace('−', '-'))]);

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
  // Kapitel 8 (ADR 0035): Kästchen färben mit Bedingung (so viele Kästchen, dieser Umfang, ein Rechteck). Jede passende Figur zählt.
  if (aufgabe.eingabe === 'zellen' && aufgabe.bedingung?.art === 'flaeche') {
    if (zellenErfuellt(aufgabe.bedingung, punkte)) return { richtig: true, fehlvorstellung: null };
    return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => zellenErfuellt(f.bedingung, punkte))?.fehlvorstellung ?? null };
  }
  // Klasse 6 Kapitel 3 (ADR 0045): ein Würfelnetz ergänzen (jedes passende Kästchen zählt) oder eine Ansicht zeichnen (an jeder Stelle im Gitter).
  if (aufgabe.eingabe === 'zellen' && ['netz', 'form'].includes(aufgabe.bedingung?.art)) {
    if (koerperZellen(aufgabe.bedingung, punkte)) return { richtig: true, fehlvorstellung: null };
    return { richtig: false, fehlvorstellung: (aufgabe.typischeFehler ?? []).find((f) => (f.bedingung ? koerperZellen(f.bedingung, punkte) : f.punkte && (aufgabe.bedingung.art === 'form' ? verschoben(punkte, f.punkte) : gleicheMenge(punkte, f.punkte))))?.fehlvorstellung ?? null };
  }
  if (gleicheMenge(punkte, aufgabe.loesung)) return { richtig: true, fehlvorstellung: null };
  const bekannt = (aufgabe.typischeFehler ?? []).find((f) => gleicheMenge(punkte, f.punkte))?.fehlvorstellung ?? null;
  // Klasse 6, Kapitel 7 (ADR 0050): Im Schaubild sind vertauschte Achsen ein eigener Fehler, auch bei verschiedener Einteilung der Achsen.
  const sk = aufgabe.gitter?.skala;
  if (!bekannt && sk && aufgabe.eingabe === 'punkte' && punkte.length) {
    const wert = (p) => [Math.round(p[0] * sk.x.schritt * 1000), Math.round(p[1] * sk.y.schritt * 1000)];
    if (gleicheMenge(punkte.map(wert).map(([x, y]) => [y, x]), aufgabe.loesung.map(wert))) return { richtig: false, fehlvorstellung: 'schaubild-achsen-vertauscht' };
    // Kästchen gezählt statt an der Achse abgelesen: Der Punkt liegt so viele Kästchen weit, wie der Wert groß ist.
    if ((sk.x.schritt !== 1 || sk.y.schritt !== 1) && gleicheMenge(punkte.map((p) => [p[0] * 1000, p[1] * 1000]), aufgabe.loesung.map(wert))) return { richtig: false, fehlvorstellung: 'einteilung-uebersehen' };
  }
  return { richtig: false, fehlvorstellung: bekannt };
}
// ---------- Klasse 6 Kapitel 3: Netze und Ansichten (ADR 0045) ----------
// Ein Würfelnetz wird gefaltet, indem der Würfel über die Kästchen abrollt: Jedes Kästchen bekommt so eine Seite des Würfels.
// Es ist ein Würfelnetz, wenn die sechs Kästchen zusammenhängen und sechs verschiedene Seiten treffen.
const neg = (v) => v.map((x) => -x);
const SCHRITTE = [[1, 0], [-1, 0], [0, 1], [0, -1]];
export function faltung(zellen) {
  const schl = (p) => `${p[0]},${p[1]}`, frei = new Map(zellen.map((p) => [schl(p), p])), seite = new Map();
  if (!zellen.length || frei.size !== zellen.length) return null;
  const start = zellen[0], liste = [[start, { n: [0, 0, -1], r: [1, 0, 0], u: [0, 1, 0] }]];
  seite.set(schl(start), liste[0][1]);
  while (liste.length) {
    const [p, o] = liste.pop();
    for (const [dx, dy] of SCHRITTE) {
      const q = [p[0] + dx, p[1] + dy];
      if (!frei.has(schl(q)) || seite.has(schl(q))) continue;
      const neu = dx === 1 ? { n: o.r, r: neg(o.n), u: o.u } : dx === -1 ? { n: neg(o.r), r: o.n, u: o.u } : dy === 1 ? { n: o.u, r: o.r, u: neg(o.n) } : { n: neg(o.u), r: o.r, u: o.n };
      seite.set(schl(q), neu); liste.push([q, neu]);
    }
  }
  if (seite.size !== zellen.length) return null; // nicht zusammenhängend
  return zellen.map((p) => seite.get(schl(p)).n.join(','));
}
export const istWuerfelnetz = (zellen) => { const f = zellen.length === 6 && faltung(zellen); return Boolean(f) && new Set(f).size === 6; };
const verschoben = (a, b) => {
  if (a.length !== b.length || !a.length) return false;
  const mx = (l) => [Math.min(...l.map((p) => p[0])), Math.min(...l.map((p) => p[1]))], [ax, ay] = mx(a), [bx, by] = mx(b);
  return gleicheMenge(a.map((p) => [p[0] - ax, p[1] - ay]), b.map((p) => [p[0] - bx, p[1] - by]));
};
// bedingung { art: 'netz', gegeben: [[x, y]], fehlt } oder { art: 'form', zellen: [[x, y]] }.
export function koerperZellen(bed, punkte) {
  if (bed.art === 'form') return verschoben(punkte, bed.zellen);
  const neu = punkte.filter((p) => !bed.gegeben.some((q) => gleich(p, q)));
  return neu.length === punkte.length && neu.length === bed.fehlt && istWuerfelnetz([...bed.gegeben, ...neu]);
}

// Die Lösung in Worten, für Ergebniszeile, Tafelbild und Meldungen.
export function gitterLoesung(aufgabe) {
  if (aufgabe.eingabe === 'kreis') return aufgabe.gitter.achsen ? `Kreis um ${punktText(aufgabe.bedingung.m)} durch ${punktText(aufgabe.beispiel[1])}` : 'siehe Bild';
  if (aufgabe.eingabe === 'linie') return !aufgabe.gitter.achsen ? 'siehe Bild' : `zum Beispiel die Linie durch ${alsEingabe(aufgabe.beispiel).replace(' ', ' und ')}`;
  if (aufgabe.eingabe === 'zellen' && aufgabe.bedingung?.art === 'flaeche') return `zum Beispiel ${aufgabe.loesung.length} Kästchen wie im Bild`;
  if (aufgabe.eingabe === 'zellen' && aufgabe.bedingung?.art === 'netz') return `zum Beispiel ${aufgabe.loesung.length === 1 ? 'das Kästchen' : `die ${aufgabe.loesung.length} Kästchen`} im Bild`;
  if (aufgabe.eingabe === 'zellen' && aufgabe.bedingung?.art === 'form') return `${aufgabe.loesung.length} Kästchen wie im Bild, an jeder Stelle im Gitter`;
  if (aufgabe.eingabe === 'zellen') return `${aufgabe.loesung.length} Kästchen, siehe Bild`;
  // Klasse 6, Kapitel 7 (ADR 0050): Im Schaubild stehen die Punkte mit den Werten der Achsen, dazu die Antwort auf die Nachfrage.
  if (aufgabe.gitter.skala) { const sk = aufgabe.gitter.skala, z = (a, n) => (n * a.schritt).toFixed(a.stellen ?? 0).replace('.', ',');
    return `${aufgabe.loesung.map((p) => `(${z(sk.x, p[0])}|${z(sk.y, p[1])})`).join(', ')}${aufgabe.nachfrage ? `; ${aufgabe.nachfrage.optionen.find((o) => o.richtig).text}` : ''}`; }
  return aufgabe.gitter.achsen ? aufgabe.loesung.map(punktText).join(', ') : 'siehe Bild';
}
