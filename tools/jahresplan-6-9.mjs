// Klasse 6, Kapitel 9 „Rationale Zahlen“ (ADR 0059): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-28: sechs Meilensteine mit je zwei Lernzielen. 9.5 und 9.6 tragen im Buch die Marke E:
// Aufgaben nur auf E (24 je Lernziel), für alle anderen ein Abstecher. Klasse 7 Kapitel 1 nimmt das Thema vollständig wieder auf.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele69 = {
  1: {
    N1: 'Ich kann negative Zahlen im Alltag deuten und mit Vorzeichen schreiben.',
    N2: 'Ich kann ganze Zahlen an der Zahlengerade ablesen und eintragen.',
  },
  2: {
    R1: 'Ich kann negative Dezimalzahlen und Brüche an der Zahlengerade ablesen und eintragen.',
    R2: 'Ich kann die Gegenzahl einer Zahl angeben und rationale Zahlen erkennen.',
  },
  3: {
    V1: 'Ich kann rationale Zahlen vergleichen.',
    V2: 'Ich kann rationale Zahlen ordnen und Zahlen angeben, die dazwischen liegen.',
  },
  4: {
    Z1: 'Ich kann Zunahmen und Abnahmen an der Zahlengerade und am Thermometer bestimmen.',
    Z2: 'Ich kann Zunahmen und Abnahmen in Sachaufgaben berechnen.',
  },
  5: {
    A1: 'Ich kann ganze Zahlen addieren und subtrahieren.',
    A2: 'Ich kann Dezimalzahlen und Brüche mit Vorzeichen addieren und subtrahieren.',
  },
  6: {
    P1: 'Ich kann rationale Zahlen multiplizieren.',
    D1: 'Ich kann rationale Zahlen dividieren.',
  },
};

export const merkzettel69 = {
  '6.9.1': { heft: 'Zeichne eine Zahlengerade mit der Null in der Mitte. Rechts stehen die positiven Zahlen, links die negativen.' },
  '6.9.2': { heft: 'Schreibe zu jeder Zahl ihre Gegenzahl. Beide liegen gleich weit von der Null entfernt.' },
  '6.9.3': { heft: 'Trage die Zahlen auf einer Zahlengeraden ein. Die Zahl weiter links ist die kleinere.' },
  '6.9.4': { heft: 'Zeichne die Änderung als Pfeil an die Zahlengerade. Zähle erst bis zur Null und dann weiter.' },
  '6.9.5': { heft: 'Schreibe eine negative Zahl nach einem Rechenzeichen immer in Klammern: 4 + (−9).' },
  '6.9.6': { heft: 'Bestimme zuerst das Vorzeichen, dann rechne mit den Zahlen ohne Vorzeichen.' },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort (Grilling Q5).
export const wortspeicher69 = {
  '6.9.1': [
    w('negative Zahl', 'F', 'Eine Zahl unter null. Sie trägt ein Minuszeichen: −3.'),
    w('positive Zahl', 'F', 'Eine Zahl über null, zum Beispiel 5.'),
    w('Vorzeichen', 'F', 'Das Plus oder Minus vor einer Zahl.'),
    w('Zahlengerade', 'F', 'Eine Linie mit Strichen in gleichen Abständen. Links von der Null stehen die negativen Zahlen.'),
    w('ganze Zahl', 'F', 'Eine Zahl ohne Komma und ohne Bruch, positiv, negativ oder null: … −2, −1, 0, 1, 2 …'),
    w('Schulden', 'F', 'Geld, das man jemandem zurückgeben muss. Auf dem Konto steht dann ein Minus.'),
    w('Guthaben', 'G', 'Geld, das auf dem Konto liegt. Der Kontostand ist positiv.'),
    w('Meeresspiegel', 'G', 'Die Höhe des Meeres. Sie hat die Höhe 0 m. Berge liegen darüber, manche Seen darunter.'),
    w('Verlust', 'M', 'Ein Laden nimmt weniger ein, als er ausgibt. Ein Verlust ist negativ.'),
    w('Untergeschoss', 'M', 'Ein Stockwerk unter dem Erdgeschoss, zum Beispiel ein Keller oder eine Tiefgarage.'),
  ],
  '6.9.2': [
    w('Gegenzahl', 'F', 'Die Zahl auf der anderen Seite der Null, gleich weit entfernt. Die Gegenzahl von 3 ist −3.'),
    w('Abstand zur Null', 'F', 'So viele Schritte ist eine Zahl von der Null entfernt.'),
    w('Zehntel', 'G', 'Ein Zehntel ist 0,1. Zwischen zwei ganzen Zahlen liegen zehn Zehntel.'),
    w('rationale Zahl', 'M', 'Jede Zahl, die sich als Bruch schreiben lässt, positiv oder negativ, zum Beispiel −2,5 oder 3⁄4.'),
    w('Betrag', 'E', 'Der Abstand einer Zahl zur Null. Er ist nie negativ: |−7| = 7.'),
    w('natürliche Zahl', 'E', 'Eine Zahl zum Zählen: 0, 1, 2, 3 … Das Zeichen für alle natürlichen Zahlen ist ℕ. Für die ganzen Zahlen steht ℤ, für die rationalen ℚ.'),
  ],
  '6.9.3': [
    w('kleiner als', 'F', 'Das Zeichen <. Die kleinere Zahl liegt auf der Zahlengeraden links.'),
    w('größer als', 'F', 'Das Zeichen >. Die größere Zahl liegt auf der Zahlengeraden rechts.'),
    w('ordnen', 'F', 'Zahlen der Größe nach in eine Reihe bringen.'),
    w('Reihenfolge', 'G', 'Wie die Zahlen nacheinander stehen, zum Beispiel von der kleinsten zur größten.'),
    w('Ungleichung', 'M', 'Zwei Zahlen mit dem Zeichen < oder > dazwischen: −5 < −2.'),
  ],
  '6.9.4': [
    w('Zunahme', 'F', 'Ein Wert wird größer, zum Beispiel wird es wärmer oder mehr Geld kommt aufs Konto.'),
    w('Abnahme', 'F', 'Ein Wert wird kleiner, zum Beispiel wird es kälter oder Geld wird abgebucht.'),
    w('Kontostand', 'F', 'So viel Geld ist auf dem Konto. Ein negativer Kontostand bedeutet Schulden.'),
    w('Änderung', 'F', 'Um wie viel ein Wert größer oder kleiner wird.'),
    w('Abbuchung', 'F', 'Geld geht vom Konto weg. Im Kontoauszug steht der Betrag mit Minus.'),
    w('Gutschrift', 'G', 'Geld kommt auf das Konto. Im Kontoauszug steht der Betrag ohne Minus.'),
    w('Höhenunterschied', 'F', 'Wie weit zwei Höhen auseinanderliegen, zum Beispiel ein Keller und eine Turmspitze.'),
    w('Temperaturunterschied', 'M', 'Wie viele Grad zwei Temperaturen auseinanderliegen.'),
  ],
  '6.9.5': [
    w('Summe', 'E', 'Das Ergebnis beim Addieren.'),
    w('Differenz', 'E', 'Das Ergebnis beim Subtrahieren.'),
    w('Zahlenmauer', 'E', 'Jeder Stein ist die Summe der beiden Steine darunter.'),
  ],
  '6.9.6': [
    w('Produkt', 'E', 'Das Ergebnis beim Multiplizieren.'),
    w('Quotient', 'E', 'Das Ergebnis beim Dividieren.'),
  ],
};

// Voraussetzungen (Grilling Q12). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
export const voraussetzungen69 = {
  '6.9.1-N1': ['5.2.1-N1'],
  '6.9.1-N2': ['6.9.1-N1', '5.2.1-N2'],
  '6.9.2-R1': ['6.9.1-N2', '6.1.6-Z2', '6.4.2-V2'],
  '6.9.2-R2': ['6.9.2-R1'],
  '6.9.3-V1': ['6.9.2-R1', '6.1.4-V1', '6.4.2-V1'],
  '6.9.3-V2': ['6.9.3-V1', '6.1.4-V2'],
  '6.9.4-Z1': ['6.9.1-N2', '5.3.1-K1'],
  '6.9.4-Z2': ['6.9.4-Z1', '6.5.1-A1'],
  '6.9.5-A1': ['6.9.4-Z1'],
  '6.9.5-A2': ['6.9.5-A1', '6.2.2-U1', '6.5.1-A1'],
  '6.9.6-P1': ['6.9.5-A1', '6.2.5-P1', '6.5.3-M1'],
  '6.9.6-D1': ['6.9.6-P1', '6.2.6-D1', '6.5.4-D1'],
};

export const grundlagen69 = {
  '6.9.1-N1': 'Am Thermometer Temperaturen unter null ablesen und mit Minus schreiben',
  '6.9.1-N2': 'An der Zahlengeraden von −20 bis 20 ganze Zahlen ablesen und antippen',
  '6.9.2-R1': 'Zwischen zwei ganzen Zahlen die Teilstriche zählen',
  '6.9.2-R2': 'An der Zahlengeraden die Schritte bis zur Null zählen und die Zahl auf der anderen Seite finden',
  '6.9.3-V1': 'Zwei Zahlen an der Zahlengeraden vergleichen: Die linke Zahl ist die kleinere',
  '6.9.3-V2': 'Drei Zahlen von −10 bis 10 an der Zahlengeraden ordnen',
  '6.9.4-Z1': 'Am Thermometer die Grade zwischen zwei Temperaturen über die Null hinweg zählen',
  '6.9.4-Z2': 'Einen Kontostand nach einer Abbuchung mit Bild bestimmen',
  '6.9.5-A1': 'An der Zahlengeraden von einer ganzen Zahl aus nach rechts und links gehen',
  '6.9.5-A2': 'Zwei Dezimalzahlen mit einer Stelle nach dem Komma addieren und subtrahieren',
  '6.9.6-P1': 'Eine Zahl mehrmals addieren und als Malaufgabe schreiben',
  '6.9.6-D1': 'Eine Malaufgabe mit der Umkehraufgabe zur Geteiltaufgabe machen',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T09).
export const bp69 = {
  '6.9.1-N1': 'ZVO (4)',
  '6.9.1-N2': 'ZVO (4), (7)',
  '6.9.2-R1': 'ZVO (4), (7)',
  '6.9.2-R2': 'ZVO (7), Betrag ZVO (8) nur E',
  '6.9.3-V1': 'ZVO (7)',
  '6.9.3-V2': 'ZVO (7), (9)',
  '6.9.4-Z1': 'ZVO (4)',
  '6.9.4-Z2': 'ZVO (4)',
  '6.9.5-A1': 'ZVO (18) E',
  '6.9.5-A2': 'ZVO (18) E',
  '6.9.6-P1': 'ZVO (18) E',
  '6.9.6-D1': 'ZVO (18) E',
};
