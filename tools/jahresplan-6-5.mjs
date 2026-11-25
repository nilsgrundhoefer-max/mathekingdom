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
    regeln: [
      'Rechne mit Zehnteln wie mit Einern: 0,7 + 0,5 sind 7 Zehntel und 5 Zehntel, also 12 Zehntel = 1,2.',
      'Schriftlich: Schreibe Komma unter Komma. Dann stehen Zehntel unter Zehnteln.',
      'Fehlen Stellen nach dem Komma, ergänze Endnullen: 5 = 5,00.',
      'Im Ergebnis steht das Komma unter den anderen Kommas.',
      'Ab G: Ergänze zum nächsten Ganzen: 3,6 + 0,4 = 4.',
      'Ab M: Prüfe mit einem Überschlag: 12,48 + 7,6 ist etwa 12 + 8 = 20.',
    ],
    beispiel: '5 − 2,35: Schreibe 5,00 − 2,35. Dann rechne wie gewohnt: 5,00 − 2,35 = 2,65.',
    heft: 'Schreibe jede Ziffer in ein eigenes Kästchen. Das Komma bekommt ein eigenes Kästchen.',
  },
  '6.5.2': {
    regeln: [
      'Mal 10 verschiebt das Komma um eine Stelle nach rechts: 3,45 · 10 = 34,5.',
      'Mal 100 verschiebt es um zwei Stellen, mal 1000 um drei Stellen nach rechts.',
      'Durch 10, 100, 1000 verschiebt das Komma nach links: 72,1 : 100 = 0,721.',
      'Fehlen Stellen, ergänze Nullen: 0,8 · 100 = 80.',
      'Ab G: Mit der Stufenzahl rechnest du Größen um: 2,5 m = 250 cm, denn 2,5 · 100 = 250.',
      'Ab M: Mal 0,1 ist dasselbe wie durch 10.',
    ],
    beispiel: '0,36 · 100: Das Komma rückt zwei Stellen nach rechts. Also 0,36 · 100 = 36.',
    heft: 'Zeichne einen kleinen Bogen unter jede Stelle, über die das Komma springt.',
  },
  '6.5.3': {
    regeln: [
      'Rechne zuerst ohne Komma: 4,6 · 3 wird zu 46 · 3 = 138.',
      'Setze dann das Komma: Das Ergebnis hat so viele Stellen nach dem Komma wie beide Zahlen zusammen. 4,6 · 3 = 13,8.',
      'Ab G: 0,4 · 0,2 = 0,08, denn 1 + 1 = 2 Stellen nach dem Komma.',
      'Ab G: Prüfe mit einem Überschlag: 4,9 · 6,1 ist etwa 5 · 6 = 30. Also stimmt 29,89.',
      'Ab E: Mal eine Zahl kleiner als 1 macht das Ergebnis kleiner.',
    ],
    beispiel: '2,35 · 1,4: Ohne Komma 235 · 14 = 3290. Stellen nach dem Komma: 2 + 1 = 3. Also 2,35 · 1,4 = 3,29.',
    heft: 'Schreibe die Stellen nach dem Komma klein über die Zahlen und zähle sie zusammen.',
  },
  '6.5.4': {
    regeln: [
      'Durch eine natürliche Zahl: Teile wie gewohnt. Wenn du das Komma überschreitest, setzt du im Ergebnis das Komma. 9,6 : 4 = 2,4.',
      'Geht die Division nicht auf, hänge Nullen an: 7 : 4 = 1,75.',
      'Durch eine Dezimalzahl: Verschiebe das Komma in beiden Zahlen gleich weit nach rechts, bis der Divisor keine Stelle nach dem Komma hat. 7,8 : 0,3 = 78 : 3 = 26.',
      'Ab G: Prüfe mit einem Überschlag: 14,7 : 3 ist etwa 15 : 3 = 5.',
      'Ab E: Teilen durch eine Zahl kleiner als 1 macht das Ergebnis größer.',
    ],
    beispiel: '4,8 : 0,4: Beide Kommas um eine Stelle nach rechts. 48 : 4 = 12. Also 4,8 : 0,4 = 12.',
    heft: 'Ziehe einen Strich unter dem Dividenden, wenn du das Komma überschreitest. Dann setze sofort das Komma im Ergebnis.',
  },
  '6.5.5': {
    regeln: [
      'Was in Klammern steht, rechnest du zuerst.',
      'Punkt vor Strich: Mal und geteilt kommen vor plus und minus.',
      'Sonst rechnest du von links nach rechts.',
      'Ab G: Tausche Summanden, wenn es leichter wird: 2,7 + 4,5 + 0,3 = 2,7 + 0,3 + 4,5 = 7,5.',
      'Ab M: Verteilungsgesetz: 4 · 2,5 + 4 · 7,5 = 4 · (2,5 + 7,5) = 40.',
    ],
    beispiel: '1,5 + 2 · 0,4: Zuerst 2 · 0,4 = 0,8. Dann 1,5 + 0,8 = 2,3.',
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
