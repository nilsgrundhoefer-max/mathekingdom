// Klasse 6, Kapitel 2 „Rechnen mit Brüchen“ (ADR 0038): Merkzettel, Wortspeicher, Voraussetzungen und Grundlagen.
// Ein Bruch steht als „3⁄4“ (U+2044), eine gemischte Zahl mit schmalem geschütztem Leerzeichen davor.

const b = (z, n) => `${z}⁄${n}`;
const g = (ganze, z, n) => `${ganze} ${z}⁄${n}`;
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const merkzettel2 = {
  '6.2.1': {
    regeln: [
      'Gleichnamige Brüche haben denselben Nenner.',
      'Addieren: Zähle die Zähler zusammen. Der Nenner bleibt gleich.',
      'Subtrahieren: Ziehe die Zähler voneinander ab. Der Nenner bleibt gleich.',
      'Kürze das Ergebnis so weit wie möglich.',
      'Bei gemischten Zahlen rechnest du die Ganzen und die Brüche einzeln.',
      `Ab G: Reicht der Bruch beim Abziehen nicht, wandle ein Ganzes um: ${g(3, 1, 4)} = ${g(2, 5, 4)}.`,
    ],
    beispiel: `${b(3, 8)} + ${b(1, 8)} = ${b(4, 8)} = ${b(1, 2)}. Drei Achtel und ein Achtel sind vier Achtel. Das ist eine halbe Pizza.`,
    heft: 'Schreibe zuerst das Ergebnis mit dem alten Nenner. Kürze dann in einem zweiten Schritt.',
  },
  '6.2.2': {
    regeln: [
      'Ungleichnamige Brüche haben verschiedene Nenner. Du kannst sie nicht sofort addieren.',
      'Mache die Brüche zuerst gleichnamig: Erweitere sie auf einen gemeinsamen Nenner.',
      'Addiere oder subtrahiere dann die Zähler. Der gemeinsame Nenner bleibt.',
      `Passt ein Nenner in den anderen, musst du nur einen Bruch erweitern: ${b(1, 2)} + ${b(1, 4)} = ${b(2, 4)} + ${b(1, 4)} = ${b(3, 4)}.`,
      'Ab G: Ein gemeinsamer Nenner ist immer das Produkt der beiden Nenner.',
      'Ab M: Der kleinste gemeinsame Nenner heißt Hauptnenner. Mit ihm bleiben die Zahlen klein.',
    ],
    beispiel: `${b(1, 2)} + ${b(1, 3)} = ${b(3, 6)} + ${b(2, 6)} = ${b(5, 6)}. Halbe und Drittel werden beide zu Sechsteln.`,
    heft: 'Schreibe die erweiterten Brüche hin, bevor du addierst. Nie die Nenner addieren.',
  },
  '6.2.3': {
    regeln: [
      'Vervielfachen heißt: Ein Bruch wird mehrmals genommen.',
      'Nimm nur den Zähler mit der Zahl mal. Der Nenner bleibt gleich.',
      `3 · ${b(2, 7)} = ${b(6, 7)}, denn 3 · 2 = 6.`,
      'Ist das Ergebnis größer als 1, schreibe es als gemischte Zahl.',
      'Ab G: Du darfst vor dem Malnehmen kürzen: die Zahl mit dem Nenner.',
      'Ab M: Eine gemischte Zahl wandelst du zuerst in einen Bruch um.',
    ],
    beispiel: `Vier Kinder essen je ${b(3, 8)} Pizza. Das sind 4 · ${b(3, 8)} = ${b(12, 8)} = ${g(1, 1, 2)} Pizzen.`,
    heft: 'Schreibe die Malaufgabe für den Zähler auf den Bruchstrich: 4 · 3 über 8.',
  },
  '6.2.4': {
    regeln: [
      'Teilen heißt: Ein Bruch wird gerecht verteilt.',
      `Lässt sich der Zähler teilen, dann teile ihn. Der Nenner bleibt: ${b(6, 7)} : 3 = ${b(2, 7)}.`,
      `Sonst nimm den Nenner mit der Zahl mal. Der Zähler bleibt: ${b(1, 2)} : 3 = ${b(1, 6)}.`,
      'Beim Teilen werden die Teile kleiner. Deshalb wird der Nenner größer.',
      'Den Nenner malnehmen geht immer. Kürze dann das Ergebnis.',
    ],
    beispiel: `Eine halbe Pizza wird an 3 Kinder verteilt. Jedes Kind bekommt ${b(1, 2)} : 3 = ${b(1, 6)} Pizza.`,
    heft: 'Prüfe mit der Malaufgabe: Ergebnis mal die Zahl muss den alten Bruch ergeben.',
  },
  '6.2.5': {
    regeln: [
      'Bruch mal Bruch: Zähler mal Zähler und Nenner mal Nenner.',
      `${b(2, 3)} · ${b(4, 5)} = ${b(8, 15)}, denn 2 · 4 = 8 und 3 · 5 = 15.`,
      `Das Wort „von“ bedeutet mal: ${b(1, 2)} von ${b(1, 4)} ist ${b(1, 2)} · ${b(1, 4)} = ${b(1, 8)}.`,
      'Ab G: Kürze vor dem Malnehmen: einen Zähler mit einem Nenner. Dann bleiben die Zahlen klein.',
      'Ab M: Gemischte Zahlen wandelst du zuerst in Brüche um.',
      'Malnehmen mit einem Bruch, der kleiner als 1 ist, macht kleiner.',
    ],
    beispiel: `Von einer Pizza sind noch ${b(3, 4)} da. Mia isst ${b(2, 3)} davon. Das sind ${b(2, 3)} · ${b(3, 4)} = ${b(6, 12)} = ${b(1, 2)} Pizza.`,
    heft: 'Schreibe beide Brüche auf einen gemeinsamen Bruchstrich. Kürze dort, bevor du rechnest.',
  },
  '6.2.6': {
    regeln: [
      'Den Kehrwert eines Bruchs bekommst du, wenn du Zähler und Nenner vertauschst.',
      'Durch einen Bruch dividieren heißt: mit seinem Kehrwert multiplizieren.',
      `${b(3, 4)} : ${b(2, 5)} = ${b(3, 4)} · ${b(5, 2)} = ${b(15, 8)} = ${g(1, 7, 8)}.`,
      'Nur der zweite Bruch wird umgedreht, der erste bleibt.',
      'Teilen durch einen Bruch, der kleiner als 1 ist, macht größer.',
      `Die Frage dahinter: Wie oft passt der Bruch hinein? ${b(1, 4)} passt in 2 genau achtmal.`,
    ],
    beispiel: `Aus ${b(3, 4)} l Saft werden Gläser mit ${b(1, 8)} l gefüllt. Das reicht für ${b(3, 4)} : ${b(1, 8)} = ${b(3, 4)} · ${b(8, 1)} = 6 Gläser.`,
    heft: 'Schreibe die Malaufgabe mit dem Kehrwert als Zwischenschritt hin.',
  },
  '6.2.7': {
    regeln: [
      'Klammern zuerst.',
      'Dann Punkt vor Strich: Mal und geteilt kommen vor plus und minus.',
      'Sonst rechnest du von links nach rechts.',
      `${b(1, 2)} + ${b(1, 2)} · ${b(1, 3)} = ${b(1, 2)} + ${b(1, 6)} = ${b(4, 6)} = ${b(2, 3)}.`,
      'Ab M: Manchmal geht es geschickter: Klammere eine gemeinsame Zahl aus oder vertausche.',
    ],
    beispiel: `(${b(1, 2)} + ${b(1, 4)}) · 2 = ${b(3, 4)} · 2 = ${b(6, 4)} = ${g(1, 1, 2)}. Zuerst wird die Klammer berechnet.`,
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
