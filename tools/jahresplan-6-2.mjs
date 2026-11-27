// Klasse 6, Kapitel 2 „Rechnen mit Brüchen“ (ADR 0038): Merkzettel, Wortspeicher, Voraussetzungen und Grundlagen.
// Ein Bruch steht als „3⁄4“ (U+2044), eine gemischte Zahl mit schmalem geschütztem Leerzeichen davor.

const b = (z, n) => `${z}⁄${n}`;
const g = (ganze, z, n) => `${ganze} ${z}⁄${n}`;
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const merkzettel2 = {
  '6.2.1': {
    heft: 'Schreibe zuerst das Ergebnis mit dem alten Nenner. Kürze dann in einem zweiten Schritt.',
  },
  '6.2.2': {
    heft: 'Schreibe die erweiterten Brüche hin, bevor du addierst. Nie die Nenner addieren.',
  },
  '6.2.3': {
    heft: 'Schreibe die Malaufgabe für den Zähler auf den Bruchstrich: 4 · 3 über 8.',
  },
  '6.2.4': {
    heft: 'Prüfe mit der Malaufgabe: Ergebnis mal die Zahl muss den alten Bruch ergeben.',
  },
  '6.2.5': {
    heft: 'Schreibe beide Brüche auf einen gemeinsamen Bruchstrich. Kürze dort, bevor du rechnest.',
  },
  '6.2.6': {
    heft: 'Schreibe die Malaufgabe mit dem Kehrwert als Zwischenschritt hin.',
  },
  '6.2.7': {
    heft: 'Unterstreiche, was du zuerst rechnest. Schreibe jeden Schritt in eine neue Zeile.',
  },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort. Deshalb stehen Bruch, Zähler und Nenner hier auf F.
export const wortspeicher2 = {
  '6.2.1': [
    w('Bruch', 'F', 'Eine Zahl aus Zähler und Nenner. Sie nennt einen Teil vom Ganzen.'),
    w('Zähler', 'F', 'Die Zahl über dem Bruchstrich. Sie zählt die Teile.'),
    w('Nenner', 'F', 'Die Zahl unter dem Bruchstrich. Sie sagt, wie groß die Teile sind.'),
    w('gleichnamig', 'F', 'Brüche mit demselben Nenner heißen gleichnamig.'),
    w('addieren', 'F', 'Zusammenzählen, plus rechnen.'),
    w('subtrahieren', 'F', 'Abziehen, minus rechnen.'),
    w('kürzen', 'F', 'Zähler und Nenner durch dieselbe Zahl teilen. Der Wert bleibt gleich.'),
    w('gemischte Zahl', 'F', 'Eine Zahl aus Ganzen und einem Bruch, zum Beispiel 1 1⁄2.'),
    w('Summe', 'G', 'Das Ergebnis beim Addieren.'),
    w('Differenz', 'G', 'Das Ergebnis beim Subtrahieren.'),
    w('umwandeln', 'G', 'Dieselbe Zahl anders schreiben: Aus einem Ganzen werden vier Viertel.'),
    w('Scheinbruch', 'M', 'Ein Bruch, der eine natürliche Zahl ist, zum Beispiel 8⁄4 = 2.'),
  ],
  '6.2.2': [
    w('ungleichnamig', 'F', 'Brüche mit verschiedenen Nennern heißen ungleichnamig.'),
    w('erweitern', 'F', 'Zähler und Nenner mit derselben Zahl malnehmen. Der Wert bleibt gleich.'),
    w('gemeinsamer Nenner', 'F', 'Ein Nenner, auf den du beide Brüche erweitern kannst.'),
    w('Vielfaches', 'G', 'Das Ergebnis, wenn du eine Zahl mit 1, 2, 3 und so weiter malnimmst. 12 ist ein Vielfaches von 4.'),
    w('Hauptnenner', 'M', 'Der kleinste gemeinsame Nenner von zwei oder mehr Brüchen.'),
    w('kgV', 'E', 'Das kleinste gemeinsame Vielfache von zwei Zahlen. Es ist der Hauptnenner.'),
  ],
  '6.2.3': [
    w('vervielfachen', 'F', 'Einen Bruch mehrmals nehmen: mit einer Zahl malnehmen.'),
    w('malnehmen', 'F', 'Mal rechnen.'),
    w('multiplizieren', 'G', 'Das Fachwort für malnehmen.'),
    w('Produkt', 'G', 'Das Ergebnis beim Multiplizieren.'),
    w('Faktor', 'M', 'Eine Zahl, die malgenommen wird.'),
  ],
  '6.2.4': [
    w('teilen', 'F', 'Gerecht in gleich große Teile aufteilen.'),
    w('verteilen', 'F', 'Jeder bekommt gleich viel.'),
    w('dividieren', 'G', 'Das Fachwort für teilen.'),
    w('Probe', 'G', 'Mit der Umkehraufgabe prüfen: Ergebnis mal die Zahl ergibt den alten Bruch.'),
    w('Quotient', 'M', 'Das Ergebnis beim Dividieren.'),
  ],
  '6.2.5': [
    w('Bruchteil', 'F', 'Ein Teil vom Ganzen, mit einem Bruch angegeben.'),
    w('davon', 'F', 'Vom Rest oder vom Teil, nicht vom Ganzen: „2⁄3 davon“ heißt mal 2⁄3.'),
    w('Rechteckbild', 'G', 'Ein Rechteck, in dem Zeilen und Spalten gefärbt sind. Die doppelt gefärbten Felder zeigen das Produkt.'),
    w('Kürzungszahl', 'M', 'Die Zahl, durch die du einen Zähler und einen Nenner teilst.'),
  ],
  '6.2.6': [
    w('Kehrwert', 'M', 'Der Bruch mit vertauschtem Zähler und Nenner. Der Kehrwert von 2⁄3 ist 3⁄2.'),
    w('Divisor', 'M', 'Die Zahl, durch die geteilt wird. Sie steht hinter dem Geteiltzeichen.'),
    w('Doppelbruch', 'E', 'Ein Bruch, in dessen Zähler oder Nenner wieder ein Bruch steht. Der große Bruchstrich bedeutet geteilt.'),
  ],
  '6.2.7': [
    w('Klammer', 'F', 'Was in der Klammer steht, wird zuerst gerechnet.'),
    w('Punktrechnung', 'F', 'Mal und geteilt.'),
    w('Strichrechnung', 'F', 'Plus und minus.'),
    w('Rechenausdruck', 'G', 'Eine Rechnung aus mehreren Zahlen und Rechenzeichen.'),
    w('Verteilungsgesetz', 'M', 'Eine Zahl mal eine Klammer: Jede Zahl in der Klammer wird malgenommen.'),
    w('ausklammern', 'M', 'Einen gemeinsamen Faktor vor eine Klammer schreiben.'),
  ],
};

export const voraussetzungen2 = {
  '6.2.1-A1': ['6.1.1-B1', '6.1.3-K2'],
  '6.2.1-A2': ['6.2.1-A1', '6.1.1-B2'],
  '6.2.2-U1': ['6.2.1-A1', '6.1.2-W2'],
  '6.2.2-U2': ['6.2.2-U1', '6.1.4-V2'],
  '6.2.3-V1': ['6.2.1-A1'],
  '6.2.3-V2': ['6.2.3-V1', '6.1.1-B2'],
  '6.2.4-T1': ['6.1.2-W1'],
  '6.2.4-T2': ['6.2.4-T1'],
  '6.2.5-P1': ['6.2.3-V1', '6.1.3-K2'],
  '6.2.5-P2': ['6.2.5-P1', '6.1.5-T1'],
  '6.2.6-D1': ['6.2.5-P1'],
  '6.2.6-D2': ['6.2.6-D1', '6.1.1-B2'],
  '6.2.7-R1': ['6.2.2-U2', '6.2.5-P1', '5.4.6-T1'],
  '6.2.7-R2': ['6.2.7-R1', '5.4.6-T2'],
};

export const grundlagen2 = {
  '6.2.1-A1': 'An zwei Kreisen mit gleich vielen Teilen die gefärbten Teile zusammenzählen: zwei Achtel und drei Achtel',
  '6.2.1-A2': 'An ganzen und angeschnittenen Kreisen zählen: ein Ganzes und ein Viertel und noch zwei Viertel',
  '6.2.2-U1': 'Am Streifen aus einem Halben zwei Viertel machen und dann die Viertel zusammenzählen',
  '6.2.2-U2': 'Zwei Streifen auf dieselbe Einteilung bringen, wenn der gemeinsame Nenner genannt ist',
  '6.2.3-V1': 'Denselben Bruch mehrmals nebeneinander legen und die Teile zählen: dreimal zwei Siebtel',
  '6.2.3-V2': 'Mehrere gleiche Portionen als Bild zusammenzählen: dreimal ein halber Liter',
  '6.2.4-T1': 'Gefärbte Teile gerecht verteilen: sechs Achtel an drei Kinder, jedes bekommt zwei Achtel',
  '6.2.4-T2': 'Eine halbe Pizza am Bild an zwei Kinder verteilen',
  '6.2.5-P1': 'Im Rechteckbild die doppelt gefärbten Felder zählen',
  '6.2.5-P2': 'Am Bild die Hälfte von einem halben Streifen finden',
  '6.2.6-D1': 'Zählen, wie oft ein Viertel in drei Viertel passt',
  '6.2.6-D2': 'Zählen, wie viele halbe Liter in drei Liter passen',
  '6.2.7-R1': 'In einer Rechnung mit Plus und Mal zuerst die Malaufgabe unterstreichen und rechnen',
  '6.2.7-R2': 'In einer Rechnung zuerst die Klammer ausrechnen, bei gleichnamigen Brüchen',
};
