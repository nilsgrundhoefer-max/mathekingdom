// Grundwörter (ADR 0056): Wörter, die in vielen Aufgaben stehen, aber in keinem Wortspeicher eines Meilensteins.
// Sie gehören zu keinem Meilenstein und werden in der ganzen Klassenstufe am Wort erklärt.
// Gefunden mit `node tools/wortbericht.mjs <Klasse> --fehlend`.
export const grundwoerter = {
  5: [
    { wort: 'Einer', erklaerung: 'Die letzte Ziffer einer Zahl. Die Zahl 34 hat 4 Einer.' },
    { wort: 'Hunderter', erklaerung: 'Zehn Zehner sind ein Hunderter. Die Zahl 234 hat 2 Hunderter.' },
    { wort: 'Tausender', erklaerung: 'Zehn Hunderter sind ein Tausender. Die Zahl 5234 hat 5 Tausender.' },
    { wort: 'Addition', erklaerung: 'Das Plus-Rechnen. 34 + 12 ist eine Addition.' },
    { wort: 'Subtraktion', erklaerung: 'Das Minus-Rechnen. 34 − 12 ist eine Subtraktion.' },
    { wort: 'Multiplikation', erklaerung: 'Das Mal-Rechnen. 4 · 6 ist eine Multiplikation.' },
    { wort: 'Division', erklaerung: 'Das Geteilt-Rechnen. 24 : 6 ist eine Division.' },
    { wort: 'Gleichung', erklaerung: 'Eine Rechnung mit dem Zeichen =. Links und rechts steht derselbe Wert.' },
    { wort: 'gerade Zahl', erklaerung: 'Eine Zahl, die du ohne Rest durch 2 teilen kannst: 2, 4, 6, 8 …' },
    { wort: 'ungerade', erklaerung: 'Beim Teilen durch 2 bleibt 1 übrig: 1, 3, 5, 7 …' },
    { wort: 'schriftlich', erklaerung: 'Du schreibst die Zahlen untereinander und rechnest Stelle für Stelle.' },
    { wort: 'Schätzung', erklaerung: 'Eine Zahl, die ungefähr stimmt. Du zählst oder misst nicht genau.' },
    { wort: 'höchstens', erklaerung: 'Nicht mehr als. Höchstens 5 heißt: 5 oder weniger.' },
    { wort: 'mindestens', erklaerung: 'Nicht weniger als. Mindestens 5 heißt: 5 oder mehr.' },
    { wort: 'doppelt', erklaerung: 'Zweimal so viel. Doppelt so viel wie 6 ist 12.' },
    { wort: 'insgesamt', erklaerung: 'Alles zusammengezählt.' },
    { wort: 'Diagramm', erklaerung: 'Ein Bild, das Zahlen zeigt, zum Beispiel mit Säulen oder Balken.' },
    { wort: 'Hälfte', erklaerung: 'Eines von zwei gleich großen Teilen. Die Hälfte von 12 ist 6.' },
    { wort: 'Viertel', erklaerung: 'Eines von vier gleich großen Teilen. Ein Viertel von 12 ist 3.' },
    { wort: 'Drittel', erklaerung: 'Eines von drei gleich großen Teilen. Ein Drittel von 12 ist 4.' },
    { wort: 'Vielfache', erklaerung: 'Die Zahlen einer Einmaleins-Reihe. Vielfache von 4 sind 4, 8, 12, 16 …', formen: ['Vielfaches', 'Vielfachen'] },
    { wort: 'Meter', erklaerung: 'Eine Einheit für Längen. 1 m sind 100 cm. Eine Tür ist etwa 2 m hoch.' },
    { wort: 'Millimeter', erklaerung: 'Eine kleine Einheit für Längen. 10 mm sind 1 cm.' },
  ],
  6: [
    { wort: 'Körper', erklaerung: 'Eine Form, die man anfassen kann, zum Beispiel ein Würfel oder eine Kugel.' },
    { wort: 'Spielwürfel', erklaerung: 'Ein Würfel mit den Augenzahlen 1 bis 6. Gegenüberliegende Seiten haben zusammen 7 Augen.' },
    { wort: 'gleichmäßig', erklaerung: 'Immer gleich viel. Jeder Schritt ist gleich groß.' },
    { wort: 'Oberfläche', erklaerung: 'Alle Flächen eines Körpers zusammen.' },
  ],
  7: [
    { wort: 'schneiden', erklaerung: 'Zwei Linien schneiden sich, wenn sie sich in einem Punkt treffen.', formen: ['schneiden sich', 'schneidet'] },
    { wort: 'Konto', erklaerung: 'Hier steht, wie viel Geld jemand bei der Bank hat. Bei Schulden ist die Zahl negativ.' },
    { wort: 'Thermometer', erklaerung: 'Ein Messgerät für die Temperatur.' },
  ],
};

// Die Wörter früherer Klassenstufen für die Vorstufe eines Pools: jedes Wort einmal, die erste Erklärung gilt.
export function fruehereWoerter(pools) {
  const woerter = new Map();
  for (const p of pools) {
    for (const k of p.kapitel) for (const u of k.unterkapitel) for (const w of u.wortspeicher ?? []) if (!woerter.has(w.wort)) woerter.set(w.wort, { wort: w.wort, erklaerung: w.erklaerung, meilenstein: u.id, ...(w.formen && { formen: w.formen }) });
    for (const w of p.grundwoerter ?? []) if (!woerter.has(w.wort)) woerter.set(w.wort, { wort: w.wort, erklaerung: w.erklaerung, ...(w.formen && { formen: w.formen }) });
  }
  return [...woerter.values()];
}
