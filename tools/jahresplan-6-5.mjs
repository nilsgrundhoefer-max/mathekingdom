// Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-25: fünf Meilensteine mit je zwei Lernzielen und 24 Aufgaben. 5.6 (Medienkompetenz) entfällt wie im ganzen Jahresplan.
// Das Buch setzt hier keine Marke M oder E: Alle Meilensteine haben Aufgaben auf allen vier Niveaustufen.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele5 = {
  1: {
    A1: 'Ich kann Dezimalzahlen im Kopf addieren und subtrahieren.',
    A2: 'Ich kann Dezimalzahlen schriftlich addieren und subtrahieren: Komma unter Komma.',
  },
  2: {
    S1: 'Ich kann Dezimalzahlen mit 10, 100 und 1000 multiplizieren und durch sie dividieren.',
    S2: 'Ich kann mit Stufenzahlen Größen umrechnen und Sachaufgaben lösen.',
  },
  3: {
    M1: 'Ich kann eine Dezimalzahl mit einer natürlichen Zahl multiplizieren.',
    M2: 'Ich kann zwei Dezimalzahlen multiplizieren und das Ergebnis mit einem Überschlag prüfen.',
  },
  4: {
    D1: 'Ich kann eine Dezimalzahl durch eine natürliche Zahl dividieren.',
    D2: 'Ich kann durch eine Dezimalzahl dividieren und das Ergebnis mit einem Überschlag prüfen.',
  },
  5: {
    V1: 'Ich kann Rechenausdrücke mit Dezimalzahlen berechnen: Klammern zuerst, Punkt vor Strich.',
    V2: 'Ich kann mit Dezimalzahlen geschickt rechnen und Sachaufgaben mit mehreren Schritten lösen.',
  },
};

export const merkzettel5 = {
  '6.5.1': {
    heft: 'Schreibe jede Ziffer in ein eigenes Kästchen. Das Komma bekommt ein eigenes Kästchen.',
  },
  '6.5.2': {
    heft: 'Zeichne einen kleinen Bogen unter jede Stelle, über die das Komma springt.',
  },
  '6.5.3': {
    heft: 'Schreibe die Stellen nach dem Komma klein über die Zahlen und zähle sie zusammen.',
  },
  '6.5.4': {
    heft: 'Ziehe einen Strich unter dem Dividenden, wenn du das Komma überschreitest. Dann setze sofort das Komma im Ergebnis.',
  },
  '6.5.5': {
    heft: 'Unterstreiche zuerst, was du als Erstes rechnest. Schreibe jeden Schritt in eine neue Zeile.',
  },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
export const wortspeicher5 = {
  '6.5.1': [
    w('addieren', 'F', 'Plus rechnen.'),
    w('subtrahieren', 'F', 'Minus rechnen.'),
    w('Komma', 'F', 'Es trennt die Ganzen von den Zehnteln.'),
    w('Endnull', 'F', 'Eine Null ganz hinten nach dem Komma. Sie ändert den Wert nicht: 5 = 5,00.'),
    w('Übertrag', 'F', 'Eine Zehn, die du in die nächste Stelle mitnimmst.'),
    w('Summe', 'G', 'Das Ergebnis beim Addieren.'),
    w('Differenz', 'G', 'Das Ergebnis beim Subtrahieren.'),
    w('ergänzen', 'G', 'So viel dazurechnen, bis eine glatte Zahl erreicht ist.'),
    w('Rückgeld', 'M', 'Das Geld, das du zurückbekommst, wenn du mit einem größeren Betrag bezahlst.'),
  ],
  '6.5.2': [
    w('Stufenzahl', 'F', 'Eine der Zahlen 10, 100, 1000.'),
    w('verschieben', 'F', 'Das Komma rückt um Stellen nach rechts oder nach links.'),
    w('Stellenwerttafel', 'F', 'Eine Tabelle mit einer Spalte für jede Stelle: Einer, Zehntel, Hundertstel.'),
    w('umrechnen', 'G', 'Eine Größe in einer anderen Einheit schreiben.'),
    w('Umrechnungszahl', 'G', 'Die Zahl, mit der du beim Umrechnen malnimmst oder teilst, zum Beispiel 100 bei m und cm.'),
    w('Kommaverschiebung', 'M', 'Mal oder durch eine Stufenzahl rechnen, indem du das Komma verschiebst. Auch mal 0,1 ist eine Kommaverschiebung.'),
  ],
  '6.5.3': [
    w('multiplizieren', 'F', 'Malnehmen.'),
    w('Faktor', 'G', 'Eine Zahl, die malgenommen wird.'),
    w('Produkt', 'G', 'Das Ergebnis beim Multiplizieren.'),
    w('Überschlag', 'G', 'Eine schnelle Rechnung mit gerundeten Zahlen. Sie zeigt, ob ein Ergebnis ungefähr stimmt.'),
    w('Nachkommastelle', 'M', 'Eine Stelle nach dem Komma.'),
  ],
  '6.5.4': [
    w('dividieren', 'F', 'Teilen.'),
    w('Divisor', 'G', 'Die Zahl, durch die geteilt wird.'),
    w('Dividend', 'M', 'Die Zahl, die geteilt wird.'),
    w('Quotient', 'M', 'Das Ergebnis beim Dividieren.'),
  ],
  '6.5.5': [
    w('Klammer', 'F', 'Was in Klammern steht, rechnest du zuerst.'),
    w('Punkt vor Strich', 'F', 'Mal und geteilt rechnest du vor plus und minus.'),
    w('geschickt rechnen', 'G', 'Zahlen so tauschen oder zusammenfassen, dass die Rechnung leichter wird.'),
    w('Rechenausdruck', 'G', 'Eine Rechnung mit mehreren Rechenzeichen, zum Beispiel 2 + 3 · 0,5.'),
    w('Verteilungsgesetz', 'M', 'Gleiche Faktoren lassen sich ausklammern: 4 · 2,5 + 4 · 7,5 = 4 · (2,5 + 7,5).'),
  ],
};

// Voraussetzungen (Nils, 2026-11-25, Q10). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
// Abweichung: Voraussetzungen gelten je Lernziel, nicht je Niveaustufe. D1 baut deshalb für alle auf 5.4.5-D2 und S1,
// nicht auf 6.4.6-D1 (das ist für F und G ein Abstecher).
export const voraussetzungen5 = {
  '6.5.1-A1': ['6.4.1-S1', '5.3.1-K1', '5.3.1-K2'],
  '6.5.1-A2': ['6.5.1-A1', '5.3.2-A2', '5.3.3-S2'],
  '6.5.2-S1': ['6.4.1-S1', '5.4.1-K3'],
  '6.5.2-S2': ['6.5.2-S1', '6.4.1-S2'],
  '6.5.3-M1': ['6.5.2-S1', '5.4.2-M2'],
  '6.5.3-M2': ['6.5.3-M1', '5.4.2-M3', '6.4.3-R1'],
  '6.5.4-D1': ['6.5.2-S1', '5.4.5-D2'],
  '6.5.4-D2': ['6.5.4-D1'],
  '6.5.5-V1': ['6.5.1-A2', '6.5.3-M1', '5.4.6-T1', '5.4.6-T2'],
  '6.5.5-V2': ['6.5.5-V1', '5.4.7-V3', '5.3.5-R2'],
};

export const grundlagen5 = {
  '6.5.1-A1': 'Zehntel wie Einer zusammenzählen: 7 Zehntel und 5 Zehntel sind 12 Zehntel',
  '6.5.1-A2': 'Im Raster Komma unter Komma rechnen, die Endnullen sind schon da',
  '6.5.2-S1': 'In der Stellenwerttafel jede Ziffer eine Stelle weiterrücken',
  '6.5.2-S2': 'Euro und Cent umrechnen: 1 € = 100 ct',
  '6.5.3-M1': 'Ohne Komma rechnen und das Komma danach setzen',
  '6.5.3-M2': 'Im Hunderterfeld sehen: Zehntel mal Zehntel gibt Hundertstel',
  '6.5.4-D1': 'Einen Geldbetrag gerecht teilen: erst die Euro, dann die Cent',
  '6.5.4-D2': 'Zählen, wie oft 0,5 in eine Zahl passt',
  '6.5.5-V1': 'Zuerst die Klammer ausrechnen, dann den Rest',
  '6.5.5-V2': 'Zwei Zahlen suchen, die zusammen ein Ganzes ergeben',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T05).
export const bp5 = {
  '6.5.1-A1': 'ZVO (13)',
  '6.5.1-A2': 'ZVO (13), Überschlag ZVO (12)',
  '6.5.2-S1': 'ZVO (14)',
  '6.5.2-S2': 'ZVO (14), Sachaufgaben ZVO (18)',
  '6.5.3-M1': 'ZVO (13)',
  '6.5.3-M2': 'ZVO (12), (13), Begründen der Kommaregel ZVO (22) nur E',
  '6.5.4-D1': 'ZVO (13)',
  '6.5.4-D2': 'ZVO (12), (13), (14), Divisor kleiner als 1 ZVO (22) nur E',
  '6.5.5-V1': 'ZVO (26)',
  '6.5.5-V2': 'ZVO (26), Sachaufgaben ZVO (18)',
};
