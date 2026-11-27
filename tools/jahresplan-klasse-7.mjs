import { merkzettel7 } from './merkzettel/klasse-7.mjs';
// Jahresplan Klasse 7 nach Schnittpunkt Mathematik 7, Differenzierende Ausgabe Baden-Württemberg (ISBN 978-3-12-744372-1).
// Quelle und Erläuterungen: docs/jahresplan-klasse-7.md und ADR 0043. Die „Ich kann“-Sätze folgen dem Kompetenzraster des Verlags (2017).
// Die Nummern der Unterkapitel stehen wie im Buch. EXTRA-Einheiten mit Mathe-Inhalt sind Abstecher für alle (`extra`), die am Computer entfallen.
// `pflicht`: Einheiten mit Sternchen sind für den Hauptschulabschluss nicht verbindlich. Sie haben Aufgaben auf allen Stufen und sind
// ab dieser Stufe Pflicht, darunter ein freiwilliger Abstecher (Pflicht-ab-Marke, ADR 0044). `ab` hebt dagegen alle Aufgaben auf die Marke (ADR 0038).
// `bp`: der Standard im Bildungsplan 2016 je Lernziel (ADR 0044, Quelle docs/quellen/aufgabenniveaus-klasse-7.md).

const b = (z, n) => `${z}⁄${n}`;
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });
const uk = (nr, titel, lernziele, ab = null, { pflicht = null } = {}) => ({ nr, titel, lernziele, ab, pflicht, extra: false });
// Ein Abstecher mit `ab: 'E'` ist ein Purpur-Abstecher: nur Aufgaben auf E, freiwillig für alle (ADR 0044).
const ex = (titel, lernziele, ab = null) => ({ nr: null, titel, lernziele, ab, pflicht: null, extra: true });

const roh = [
  ['Rationale Zahlen', [
    // Feinere Lernziele (Grilling mit Nils, 2026-11-24). Die Kürzel meiden F, G, M und E.
    uk(1, 'Rationale Zahlen', {
      Z1: 'Ich kann negative Zahlen im Alltag deuten und an der Zahlengeraden ablesen und eintragen.',
      Z2: 'Ich kann Gegenzahl und Betrag einer Zahl angeben und erklären, was rationale Zahlen sind.',
    }),
    ex('Das Koordinatensystem', { K1: 'Ich kann Punkte im Koordinatensystem mit vier Quadranten ablesen und eintragen.' }),
    uk(2, 'Rationale Zahlen vergleichen und ordnen', {
      V1: 'Ich kann rationale Zahlen vergleichen.',
      V2: 'Ich kann rationale Zahlen ordnen und Abstand und Mitte zweier Zahlen bestimmen.',
    }),
    ex('Auf Zahlen gehen', { W1: 'Ich kann Wege auf der Zahlengeraden gehen: Start, Schritte und Ziel bestimmen.' }),
    uk(3, 'Addieren', {
      A1: 'Ich kann ganze Zahlen addieren.',
      A2: 'Ich kann rationale Zahlen als Dezimalzahlen und Brüche addieren.',
    }),
    uk(4, 'Subtrahieren', {
      S1: 'Ich kann ganze Zahlen subtrahieren.',
      S2: 'Ich kann rationale Zahlen als Dezimalzahlen und Brüche subtrahieren.',
    }),
    uk(5, 'Rechenvorteile', {
      R1: 'Ich kann Klammern auflösen und Rechenzeichen und Vorzeichen zusammenfassen.',
      R2: 'Ich kann Summen vorteilhaft ordnen und geschickt rechnen.',
    }),
    uk(6, 'Multiplizieren', {
      P1: 'Ich kann ganze Zahlen multiplizieren.',
      P2: 'Ich kann rationale Zahlen multiplizieren, auch mit mehreren Faktoren.',
    }),
    uk(7, 'Dividieren', {
      D1: 'Ich kann ganze Zahlen dividieren.',
      D2: 'Ich kann rationale Zahlen dividieren und fehlende Zahlen in Mal- und Geteilt-Aufgaben finden.',
    }),
    uk(8, 'Verbindung der Rechenarten', {
      T1: 'Ich kann Rechenausdrücke mit rationalen Zahlen berechnen: Klammern zuerst, dann Punkt vor Strich.',
      T2: 'Ich kann ausmultiplizieren und ausklammern und damit Rechenausdrücke vereinfachen.',
    }),
    ex('Celsius und Fahrenheit', { C1: 'Ich kann mit Temperaturen in Grad Celsius rechnen und kenne die Umrechnung in Fahrenheit und Kelvin.' }),
    ex('Girokonto', { B1: 'Ich kann einen Kontoauszug lesen und Kontostände mit Guthaben und Schulden berechnen.' }),
  ]],
  ['Dreiecke', [
    // Feinere Lernziele und Marken (Grilling mit Nils, 2026-11-25, ADR 0044). 2.1 und 2.5 tragen im Buch ein Sternchen,
    // im Bildungsplan auf G [MSA]: Aufgaben auf allen Stufen, Pflicht erst ab M. Die Abstecher sind nur E (Purpur-Abstecher).
    uk(1, 'Winkel im Schnittpunkt von Geraden', {
      W1: 'Ich kann Scheitelwinkel und Nebenwinkel an zwei sich schneidenden Geraden erkennen und berechnen.',
      W2: 'Ich kann Stufenwinkel und Wechselwinkel an geschnittenen Parallelen erkennen und berechnen.',
    }, null, { pflicht: 'M' }),
    uk(2, 'Winkelsumme im Dreieck', {
      S1: 'Ich kann mit dem Winkelsummensatz fehlende Winkel im Dreieck berechnen.',
      S2: 'Ich kann den Winkelsummensatz begründen und in zusammengesetzten Figuren anwenden.',
    }),
    uk(3, 'Dreiecksformen', {
      D1: 'Ich kann Dreiecke nach Seiten und Winkeln einteilen und richtig beschriften.',
      D2: 'Ich kann Eigenschaften gleichschenkliger und gleichseitiger Dreiecke nutzen, auch den Basiswinkelsatz.',
    }),
    uk(4, 'Dreiecke konstruieren', {
      K1: 'Ich kann erkennen, welcher Kongruenzsatz passt, und eine Planfigur skizzieren.',
      K2: 'Ich kann Dreiecke aus drei gegebenen Größen konstruieren.',
    }),
    uk(5, 'Der Satz des Thales', {
      T1: 'Ich kann den Satz des Thales erkennen und damit Winkel berechnen.',
      T2: 'Ich kann mit dem Thaleskreis rechtwinklige Dreiecke konstruieren.',
    }, null, { pflicht: 'M' }),
    ex('Kreis und Tangenten', { T1: 'Ich kann Tangenten an einen Kreis konstruieren.' }, 'E'),
    uk(6, 'Höhen', {
      H1: 'Ich kann zu den Seiten eines Dreiecks die Höhen einzeichnen.',
      H2: 'Ich kann Höhen auch im stumpfwinkligen Dreieck zeichnen und den Höhenschnittpunkt finden.',
    }),
    uk(7, 'Mittelsenkrechte. Winkelhalbierende', {
      O1: 'Ich kann die Mittelsenkrechte zeichnen und Kreis und Mittelsenkrechte als Ortslinien nutzen.',
      O2: 'Ich kann die Winkelhalbierende zeichnen und Punkte finden, die zwei Bedingungen erfüllen.',
    }),
    ex('Mit Zirkel und Lineal: Mittelsenkrechte. Umkreis', { U1: 'Ich kann die Mittelsenkrechte mit Zirkel und Lineal konstruieren und den Umkreis eines Dreiecks zeichnen.' }, 'E'),
    ex('Mit Zirkel und Lineal: Winkelhalbierende. Inkreis', { I1: 'Ich kann die Winkelhalbierende mit Zirkel und Lineal konstruieren und den Inkreis eines Dreiecks zeichnen.' }, 'E'),
  ]],
  ['Rechnen mit Termen', [
    uk(1, 'Terme und Variablen', ['Ich kann erläutern, was Terme und Variablen sind.']),
    uk(2, 'Terme addieren und subtrahieren', ['Ich kann Terme aufstellen und vereinfachen.']),
    uk(3, 'Terme multiplizieren und dividieren', ['Ich kann Terme multiplizieren und dividieren.']),
    uk(4, 'Terme mit Plus- und Minusklammern', ['Ich kann Klammern in Termen unter Beachtung des Zeichenwechsels auflösen.']),
    uk(5, 'Terme ausmultiplizieren', ['Ich kann Terme unter Verwendung des Distributivgesetzes ausmultiplizieren.']),
  ]],
  ['Gleichungen', [
    uk(1, 'Gleichungen durch Probieren lösen', ['Ich kann Gleichungen durch Probieren lösen.']),
    uk(2, 'Gleichungen durch Umformen lösen', ['Ich kann Gleichungen durch Äquivalenzumformungen lösen.']),
    uk(3, 'Gleichungen mit Klammern', ['Ich kann Gleichungen mit Klammern durch Äquivalenzumformungen lösen.']),
    uk(4, 'Mit Gleichungen Fragen beantworten', ['Ich kann Sachsituationen mithilfe von Gleichungen lösen.']),
  ]],
  ['Vierecke', [
    uk(1, 'Vierecksformen', ['Ich kann Vierecke anhand ihrer Eigenschaften unterscheiden.']),
    ex('Haus der Vierecke', ['Ich kann beschreiben, in welcher Beziehung Vierecke zueinander stehen.']),
    uk(2, 'Winkelsumme im Viereck', ['Ich kann Winkel mit dem Winkelsummensatz im Viereck berechnen.']),
    uk(3, 'Vierecke zeichnen', ['Ich kann Vierecke unter Vorgaben konstruieren.']),
    ex('Regelmäßige Vielecke', ['Ich kann mit Zirkel und Lineal regelmäßige Vielecke konstruieren.']),
  ]],
  ['Proportional und antiproportional', [
    uk(1, 'Proportionale Zuordnungen', ['Ich kann proportionale Zuordnungen erläutern und darstellen.']),
    uk(2, 'Dreisatz', ['Ich kann proportionale Dreisatzberechnungen durchführen.']),
    ex('Schätzen mithilfe von Proportionen', ['Ich kann Ergebnisse mithilfe von Proportionen unter Anwendung des Dreisatzes berechnen.']),
    uk(3, 'Antiproportionale Zuordnungen', ['Ich kann antiproportionale Zuordnungen erläutern und darstellen.']),
    uk(4, 'Umgekehrter Dreisatz', ['Ich kann antiproportionale Dreisatzberechnungen mit dem umgekehrten Dreisatz durchführen.']),
    uk(5, 'Zuordnungen darstellen', ['Ich kann Zuordnungen grafisch, tabellarisch und verbal darstellen.']),
  ]],
  ['Prozente', [
    uk(1, 'Prozente', ['Ich kann Anteile in der Prozentschreibweise notieren.']),
    uk(2, 'Absoluter und relativer Vergleich', ['Ich kann den Unterschied zwischen absolutem und relativem Vergleich erklären.']),
    ex('Prozentband', ['Ich kann mithilfe eines Prozentbandes Anteile an Längenmaßen bestimmen.']),
    uk(3, 'Prozentsatz', ['Ich kann Aufgaben zum Prozentsatz mit der Formel oder dem Dreisatz lösen.']),
    uk(4, 'Prozentwert', ['Ich kann Aufgaben zum Prozentwert mit der Formel oder dem Dreisatz lösen.']),
    uk(5, 'Grundwert', ['Ich kann Aufgaben zum Grundwert mit der Formel oder dem Dreisatz lösen.']),
    uk(6, 'Prozentdiagramme', ['Ich kann Balken-, Streifen- und Kreisdiagramme per Hand zur Veranschaulichung von Anteilen darstellen.']),
    ex('Rabatt, Skonto und Mehrwertsteuer', ['Ich kann mein Wissen zur Prozentrechnung im Sachkontext Rabatt, Skonto und Mehrwertsteuer anwenden.']),
  ]],
  ['Wahrscheinlichkeit', [
    uk(1, 'Zufallsexperimente', ['Ich kann Zufallsgeräte und Zufallsexperimente benennen.']),
    uk(2, 'Wahrscheinlichkeiten', ['Ich kann die Wahrscheinlichkeit eines Laplace-Experimentes berechnen.']),
    uk(3, 'Ereignisse', ['Ich kann zwischen Ergebnis und Ereignis unterscheiden und die Wahrscheinlichkeiten berechnen.']),
  ]],
];

// Merkzettel (ADR 0016): Regeln, ein Beispiel und ein Tipp fürs Heft. Jede Rechnung darin rechnet der Prüfer nach.
const merkzettel = {
  '7.1.1': {
    heft: 'Zeichne eine Zahlengerade mit der Null in der Mitte. Schreibe die Zahlen mit Vorzeichen daran.',
  },
  '7.1.X1': {
    heft: 'Gehe immer zuerst an der x-Achse entlang und dann nach oben oder unten.',
  },
  '7.1.2': {
    heft: 'Markiere beide Zahlen auf einer Zahlengeraden. Die linke Zahl ist die kleinere.',
  },
  '7.1.X2': {
    heft: 'Zeichne jeden Schritt als Bogen über die Zahlengerade und schreibe die Zahl daran.',
  },
  '7.1.3': {
    heft: 'Schreibe eine negative Zahl nach dem Pluszeichen immer in Klammern: 4 + (−9).',
  },
  '7.1.4': {
    heft: 'Schreibe zuerst die Plusaufgabe mit der Gegenzahl hin. Rechne dann.',
  },
  '7.1.5': {
    heft: 'Schreibe die Aufgabe erst ohne Klammern. Das Vorzeichen wandert immer mit seiner Zahl.',
  },
  '7.1.6': {
    heft: 'Schreibe zuerst das Vorzeichen des Ergebnisses hin. Rechne dann mit den Zahlen ohne Vorzeichen.',
  },
  '7.1.7': {
    heft: 'Bestimme zuerst das Vorzeichen. Mache danach immer die Probe mit der Malaufgabe.',
  },
  '7.1.8': {
    heft: 'Unterstreiche, was du zuerst rechnest. Schreibe jeden Schritt in eine neue Zeile.',
  },
  '7.1.X3': {
    heft: 'Skizziere ein Thermometer. Markiere beide Temperaturen und zähle die Grade dazwischen.',
  },
  '7.1.X4': {
    heft: 'Schreibe die Buchungen untereinander, jede mit Plus oder Minus davor.',
  },
  // Kapitel 2 Dreiecke (ADR 0044). Basiswinkelsatz, Begründen, Kongruenzsätze und Thales als Satz erst ab M (Niveauübersicht K02).
  '7.2.1': {
    heft: 'Markiere gleich große Winkel mit derselben Farbe. Stufenwinkel bilden ein F, Wechselwinkel ein Z.',
  },
  '7.2.2': {
    heft: 'Mache immer die Probe: Die drei Winkel zusammen müssen 180° ergeben.',
  },
  '7.2.3': {
    heft: 'Markiere gleich lange Seiten mit Strichen und gleich große Winkel mit Bögen.',
  },
  '7.2.4': {
    heft: 'Arbeite mit spitzem Bleistift. Miss am Ende nach: Seiten auf 2 mm genau, Winkel auf 2° genau.',
  },
  '7.2.5': {
    heft: 'Stich den Zirkel genau in die Mitte von AB.',
  },
  '7.2.X1': {
    heft: 'Prüfe mit dem Geodreieck: Radius und Tangente bilden einen rechten Winkel.',
  },
  '7.2.6': {
    heft: 'Zeichne verlängerte Seiten dünn und gestrichelt.',
  },
  '7.2.7': {
    heft: 'Schreibe zu jeder Bedingung, welche Ortslinie dazu gehört.',
  },
  '7.2.X2': {
    heft: 'Lass den Zirkel zwischen den beiden Bögen offen: Beide brauchen denselben Radius.',
  },
  '7.2.X3': {
    heft: 'Den Radius des Inkreises misst du senkrecht zu einer Seite.',
  },
};

// Wortspeicher: Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
const wortspeicher = {
  '7.1.1': [
    w('negative Zahl', 'F', 'Eine Zahl unter null. Sie trägt ein Minuszeichen: −3.'),
    w('positive Zahl', 'F', 'Eine Zahl über null, zum Beispiel 5.'),
    w('Vorzeichen', 'F', 'Das Plus oder Minus vor einer Zahl.'),
    w('Zahlengerade', 'F', 'Eine Linie mit Strichen in gleichen Abständen. Links von der Null stehen die negativen Zahlen.'),
    w('Gegenzahl', 'F', 'Die Zahl auf der anderen Seite der Null, gleich weit entfernt. Die Gegenzahl von 3 ist −3.'),
    w('Abstand zur Null', 'F', 'So viele Schritte ist eine Zahl von der Null entfernt.'),
    w('ganze Zahl', 'G', 'Eine Zahl ohne Komma und ohne Bruch, positiv, negativ oder null: … −2, −1, 0, 1, 2 …'),
    w('Betrag', 'M', 'Der Abstand einer Zahl zur Null. Er ist nie negativ: |−7| = 7.'),
    w('natürliche Zahl', 'M', 'Eine Zahl zum Zählen: 0, 1, 2, 3 … Das Zeichen für alle natürlichen Zahlen ist ℕ.'),
    w('rationale Zahl', 'M', 'Jede Zahl, die sich als Bruch schreiben lässt, positiv oder negativ. Das Zeichen ist ℚ. Für die ganzen Zahlen steht ℤ.'),
  ],
  '7.1.X1': [
    w('Koordinatensystem', 'F', 'Ein Gitter mit zwei Achsen. Damit findest du jeden Punkt.'),
    w('x-Achse', 'F', 'Die Achse nach rechts und links.'),
    w('y-Achse', 'F', 'Die Achse nach oben und unten.'),
    w('Nullpunkt', 'F', 'Der Punkt (0|0). Hier kreuzen sich die Achsen.'),
    w('Koordinaten', 'F', 'Die zwei Zahlen eines Punktes: P(x|y).'),
    w('x-Koordinate', 'G', 'Die erste Zahl eines Punktes. Sie sagt, wie weit es nach rechts oder links geht.'),
    w('y-Koordinate', 'G', 'Die zweite Zahl eines Punktes. Sie sagt, wie weit es nach oben oder unten geht.'),
    w('Quadrant', 'M', 'Eines der vier Felder, in die die Achsen das Blatt teilen. Gezählt wird I, II, III, IV gegen den Uhrzeigersinn.'),
    w('Spiegelpunkt', 'E', 'Der Punkt, der beim Spiegeln an einer Achse entsteht. Er liegt gleich weit von der Achse entfernt.'),
  ],
  '7.1.2': [
    w('kleiner als', 'F', 'Das Zeichen <. Die kleinere Zahl liegt auf der Zahlengeraden links.'),
    w('größer als', 'F', 'Das Zeichen >. Die größere Zahl liegt auf der Zahlengeraden rechts.'),
    w('ordnen', 'F', 'Zahlen der Größe nach in eine Reihe bringen.'),
    w('Abstand', 'F', 'So viele Schritte liegen zwei Zahlen auseinander.'),
    w('Mitte', 'G', 'Die Zahl, die von zwei Zahlen gleich weit entfernt ist.'),
    w('Ungleichung', 'M', 'Zwei Zahlen oder Rechenausdrücke mit dem Zeichen < oder > dazwischen: −5 < −2.'),
  ],
  '7.1.X2': [
    w('Start', 'F', 'Die Zahl, bei der der Weg beginnt.'),
    w('Ziel', 'F', 'Die Zahl, bei der der Weg endet.'),
    w('Schritt', 'F', 'Ein Stück des Weges. Plus geht nach rechts, Minus geht nach links.'),
    w('Rechenpfeil', 'G', 'Ein Bogen über der Zahlengeraden. Er zeigt einen Schritt mit seiner Zahl.'),
    w('Umkehraufgabe', 'M', 'Die Aufgabe rückwärts: Vom Ziel aus gehst du jeden Schritt in die andere Richtung.'),
  ],
  '7.1.3': [
    w('addieren', 'F', 'Zusammenzählen, plus rechnen.'),
    w('Zahlenmauer', 'F', 'Jeder Stein ist die Summe der beiden Steine darunter.'),
    w('Summand', 'G', 'Eine Zahl, die addiert wird.'),
    w('Summe', 'F', 'Das Ergebnis beim Addieren.'),
    w('gleichnamig', 'M', 'Brüche mit demselben Nenner heißen gleichnamig.'),
  ],
  '7.1.4': [
    w('subtrahieren', 'F', 'Abziehen, minus rechnen.'),
    w('Differenz', 'G', 'Das Ergebnis beim Subtrahieren.'),
    w('Minuend', 'M', 'Die Zahl, von der abgezogen wird.'),
    w('Subtrahend', 'M', 'Die Zahl, die abgezogen wird.'),
  ],
  '7.1.5': [
    w('Klammer', 'F', 'Eine negative Zahl steht nach einem Rechenzeichen in einer Klammer: 3 + (−5).'),
    w('Rechenzeichen', 'F', 'Das Plus oder Minus zwischen zwei Zahlen. Es sagt, was gerechnet wird.'),
    w('Minusklammer', 'G', 'Eine Klammer, vor der ein Minus steht. Beim Auflösen drehen sich alle Zeichen in der Klammer um.'),
    w('Plusklammer', 'G', 'Eine Klammer, vor der ein Plus steht. Sie darf einfach wegfallen.'),
    w('vorteilhaft', 'G', 'So geordnet, dass das Rechnen leicht wird.'),
    w('Vertauschungsgesetz', 'M', 'In einer Summe dürfen die Zahlen mit ihren Vorzeichen die Plätze tauschen.'),
    w('Verbindungsgesetz', 'M', 'In einer Summe dürfen Zahlen beliebig zusammengefasst werden.'),
  ],
  '7.1.6': [
    w('multiplizieren', 'F', 'Malnehmen, mal rechnen.'),
    w('malnehmen', 'F', 'Mal rechnen.'),
    w('Faktor', 'G', 'Eine Zahl, die malgenommen wird.'),
    w('Produkt', 'G', 'Das Ergebnis beim Multiplizieren.'),
    w('Vorzeichenregel', 'M', 'Gleiche Vorzeichen ergeben Plus, verschiedene Vorzeichen ergeben Minus.'),
    w('Potenz', 'E', 'Ein Produkt aus gleichen Faktoren: (−2)³ = (−2) · (−2) · (−2) = −8.'),
  ],
  '7.1.7': [
    w('dividieren', 'F', 'Teilen, geteilt rechnen.'),
    w('teilen', 'F', 'Gerecht in gleich große Teile aufteilen.'),
    w('Quotient', 'G', 'Das Ergebnis beim Dividieren.'),
    w('Probe', 'G', 'Mit der Malaufgabe prüfen: Ergebnis mal Teiler ergibt die erste Zahl.'),
    w('Dividend', 'M', 'Die Zahl, die geteilt wird.'),
    w('Divisor', 'M', 'Die Zahl, durch die geteilt wird.'),
    w('Kehrwert', 'M', 'Der Bruch mit vertauschtem Zähler und Nenner. Der Kehrwert von 2⁄3 ist 3⁄2.'),
  ],
  '7.1.8': [
    w('Punktrechnung', 'F', 'Mal und geteilt.'),
    w('Strichrechnung', 'F', 'Plus und minus.'),
    w('Rechenausdruck', 'G', 'Eine Rechnung aus mehreren Zahlen und Rechenzeichen.'),
    w('ausmultiplizieren', 'G', 'Die Zahl vor der Klammer mit jeder Zahl in der Klammer malnehmen.'),
    w('ausklammern', 'M', 'Einen gemeinsamen Faktor vor eine Klammer schreiben.'),
    w('Verteilungsgesetz', 'M', 'Die Regel für das Ausmultiplizieren und das Ausklammern.'),
  ],
  '7.1.X3': [
    w('Temperatur', 'F', 'Sie sagt, wie warm oder kalt es ist.'),
    w('Grad Celsius', 'F', 'Die Einheit der Temperatur bei uns, kurz °C.'),
    w('Frost', 'F', 'Temperaturen unter 0 °C. Wasser wird zu Eis.'),
    w('Temperaturunterschied', 'G', 'So viele Grad liegen zwei Temperaturen auseinander.'),
    w('Fahrenheit', 'M', 'Die Einheit der Temperatur in den USA, kurz °F.'),
    w('Kelvin', 'M', 'Die Einheit der Temperatur in der Wissenschaft, kurz K. Negative Temperaturen gibt es in Kelvin nicht.'),
  ],
  '7.1.X4': [
    w('Kontostand', 'F', 'So viel Geld ist gerade auf dem Konto.'),
    w('Guthaben', 'F', 'Geld, das dir auf dem Konto gehört. Der Kontostand ist positiv.'),
    w('Schulden', 'F', 'Geld, das du der Bank zurückgeben musst. Der Kontostand ist negativ.'),
    w('Buchung', 'F', 'Geld kommt auf das Konto oder geht vom Konto ab.'),
    w('Kontoauszug', 'G', 'Die Liste aller Buchungen mit dem alten und dem neuen Kontostand.'),
    w('Gutschrift', 'G', 'Eine Buchung, bei der Geld auf das Konto kommt.'),
    w('Abbuchung', 'G', 'Eine Buchung, bei der Geld vom Konto abgeht.'),
    w('Soll', 'M', 'Die Minus-Seite des Kontos, auf dem Auszug kurz S.'),
    w('Haben', 'M', 'Die Plus-Seite des Kontos, auf dem Auszug kurz H.'),
    w('überziehen', 'M', 'Mehr Geld abheben, als auf dem Konto ist. Der Kontostand wird negativ.'),
  ],
  '7.2.1': [
    w('Scheitelwinkel', 'F', 'Zwei Winkel, die sich an einer Geradenkreuzung gegenüberliegen. Sie sind gleich groß.'),
    w('Nebenwinkel', 'F', 'Zwei Winkel, die nebeneinander an einer Geraden liegen. Zusammen sind sie 180°.'),
    w('Stufenwinkel', 'F', 'Zwei Winkel an zwei Parallelen, die an derselben Stelle liegen. Sie sind gleich groß.'),
    w('Wechselwinkel', 'F', 'Zwei Winkel an zwei Parallelen auf verschiedenen Seiten der schneidenden Geraden. Sie sind gleich groß.'),
    w('parallel', 'F', 'Zwei Geraden sind parallel, wenn sie überall den gleichen Abstand haben.'),
    w('Begründung', 'G', 'Du sagst, warum etwas stimmt. Zum Beispiel: Die Winkel sind gleich groß, denn sie sind Scheitelwinkel.'),
    w('Fachbegriff', 'M', 'Das Fachwort für eine Sache, zum Beispiel Nebenwinkel. Mit ihm nennst du den Grund.'),
  ],
  '7.2.2': [
    w('Winkelsumme', 'F', 'Alle Winkel einer Figur zusammen. Im Dreieck sind es 180°.'),
    w('Innenwinkel', 'F', 'Ein Winkel innen im Dreieck, an einer Ecke.'),
    w('Diagonale', 'G', 'Eine Strecke im Viereck von einer Ecke zur gegenüberliegenden Ecke.'),
    w('Außenwinkel', 'M', 'Der Nebenwinkel eines Innenwinkels. Er liegt außen am Dreieck.'),
    w('Winkelsummensatz', 'M', 'Der Satz: Im Dreieck sind die Innenwinkel zusammen 180°.'),
  ],
  '7.2.3': [
    w('gleichschenklig', 'F', 'Ein Dreieck mit zwei gleich langen Seiten.'),
    w('gleichseitig', 'F', 'Ein Dreieck mit drei gleich langen Seiten.'),
    w('spitzwinklig', 'F', 'Alle drei Winkel sind kleiner als 90°.'),
    w('rechtwinklig', 'F', 'Ein Winkel ist genau 90°.'),
    w('stumpfwinklig', 'F', 'Ein Winkel ist größer als 90°.'),
    w('Schenkel', 'F', 'Im gleichschenkligen Dreieck die beiden gleich langen Seiten.'),
    w('Basis', 'G', 'Im gleichschenkligen Dreieck die dritte Seite, die nicht Schenkel ist.'),
    w('Spitze', 'F', 'Im gleichschenkligen Dreieck die Ecke gegenüber der Basis.'),
    w('Basiswinkel', 'F', 'Die beiden gleich großen Winkel im gleichschenkligen Dreieck. Sie liegen an der Basis.'),
    w('Basiswinkelsatz', 'M', 'Der Satz: Im gleichschenkligen Dreieck sind die Basiswinkel gleich groß.'),
  ],
  '7.2.4': [
    w('Planfigur', 'F', 'Eine schnelle Skizze, in der du alles Gegebene markierst. Sie muss nicht genau sein.'),
    w('konstruieren', 'F', 'Genau zeichnen mit Geodreieck und Zirkel.'),
    w('Zirkel', 'F', 'Mit ihm zeichnest du Kreise und Kreisbögen.'),
    w('antragen', 'G', 'Einen Winkel an einer Seite mit dem Geodreieck einzeichnen.'),
    w('kongruent', 'M', 'Deckungsgleich: Die Figuren passen genau aufeinander.'),
    w('Kongruenzsatz', 'M', 'Eine Regel, welche drei Angaben ein Dreieck festlegen: sss, sws, wsw.'),
    w('eindeutig', 'M', 'Es gibt genau ein Dreieck, bis auf seine Lage.'),
    w('Dreiecksungleichung', 'E', 'Zwei Seiten eines Dreiecks sind zusammen immer länger als die dritte.'),
  ],
  '7.2.5': [
    w('Halbkreis', 'F', 'Ein halber Kreis über einem Durchmesser.'),
    w('Durchmesser', 'G', 'Eine Strecke durch den Mittelpunkt von Rand zu Rand. Sie ist doppelt so lang wie der Radius.'),
    w('Thaleskreis', 'F', 'Der Halbkreis über einer Strecke AB. Jeder Punkt darauf bildet mit A und B einen rechten Winkel.'),
    w('Satz des Thales', 'M', 'Der Satz: Liegt C auf dem Halbkreis über AB, ist der Winkel bei C ein rechter Winkel.'),
  ],
  '7.2.X1': [
    w('Tangente', 'E', 'Eine Gerade, die den Kreis in genau einem Punkt berührt.'),
    w('Sekante', 'E', 'Eine Gerade, die den Kreis in zwei Punkten schneidet.'),
    w('Passante', 'E', 'Eine Gerade, die am Kreis vorbeigeht.'),
    w('Berührpunkt', 'E', 'Der Punkt, in dem die Tangente den Kreis berührt.'),
  ],
  '7.2.6': [
    w('Höhe', 'F', 'Eine Strecke von einer Ecke senkrecht zur gegenüberliegenden Seite.'),
    w('senkrecht', 'F', 'Zwei Linien bilden einen rechten Winkel.'),
    w('Fußpunkt', 'F', 'Der Punkt, in dem die Höhe auf die Seite trifft.'),
    w('Höhenschnittpunkt', 'G', 'Der Punkt, in dem sich die drei Höhen schneiden.'),
    w('Lot', 'M', 'Eine Senkrechte von einem Punkt auf eine Gerade. Jede Höhe ist ein Lot.'),
  ],
  '7.2.7': [
    w('Mittelsenkrechte', 'F', 'Eine Gerade durch die Mitte einer Strecke, senkrecht zu ihr.'),
    w('Winkelhalbierende', 'F', 'Ein Strahl, der einen Winkel in zwei gleich große Winkel teilt.'),
    w('Abstand', 'F', 'Der kürzeste Weg zwischen einem Punkt und einem anderen Punkt oder einer Geraden.'),
    w('Mittelparallele', 'G', 'Die Gerade genau in der Mitte zwischen zwei Parallelen. Jeder Punkt darauf ist von beiden gleich weit entfernt.'),
    w('Ortslinie', 'M', 'Eine Linie, auf der alle Punkte mit einer bestimmten Eigenschaft liegen.'),
  ],
  '7.2.X2': [
    w('Umkreis', 'E', 'Der Kreis durch alle drei Ecken eines Dreiecks.'),
    w('Umkreismittelpunkt', 'E', 'Der Schnittpunkt der Mittelsenkrechten. Er ist von allen Ecken gleich weit entfernt.'),
  ],
  '7.2.X3': [
    w('Inkreis', 'E', 'Der Kreis im Dreieck, der alle drei Seiten berührt.'),
    w('Inkreismittelpunkt', 'E', 'Der Schnittpunkt der Winkelhalbierenden. Er ist von allen Seiten gleich weit entfernt.'),
  ],
};

// Voraussetzungen (ADR 0017): Lernziele, auf denen ein Lernziel aufbaut. Sie dürfen in Klasse 5 und 6 liegen (ADR 0037).
const voraussetzungen = {
  '7.1.1-Z1': ['5.2.1-N1', '5.9.3-K2'],
  '7.1.1-Z2': ['7.1.1-Z1'],
  '7.1.X1-K1': ['7.1.1-Z1', '5.5.4-K1', '5.5.4-K2'],
  '7.1.2-V1': ['7.1.1-Z1', '5.2.1-N2'],
  '7.1.2-V2': ['7.1.2-V1', '6.1.4-V2'],
  '7.1.X2-W1': ['7.1.1-Z1', '5.3.1-K1'],
  '7.1.3-A1': ['7.1.1-Z2', '5.3.1-K1'],
  '7.1.3-A2': ['7.1.3-A1', '6.2.1-A1'],
  '7.1.4-S1': ['7.1.3-A1', '5.3.1-K2'],
  '7.1.4-S2': ['7.1.4-S1', '6.2.2-U1'],
  '7.1.5-R1': ['7.1.4-S1', '5.3.4-B1'],
  '7.1.5-R2': ['7.1.5-R1', '5.3.5-R2'],
  '7.1.6-P1': ['7.1.3-A1', '5.4.1-K1'],
  '7.1.6-P2': ['7.1.6-P1', '6.2.5-P1'],
  '7.1.7-D1': ['7.1.6-P1', '5.4.1-K2'],
  '7.1.7-D2': ['7.1.7-D1', '6.2.4-T1'],
  '7.1.8-T1': ['7.1.6-P1', '7.1.4-S1', '5.4.6-T1'],
  '7.1.8-T2': ['7.1.8-T1', '5.4.7-V1', '5.4.7-V2'],
  '7.1.X3-C1': ['7.1.4-S1'],
  '7.1.X4-B1': ['7.1.4-S1', '5.6.2-B2'],
  '7.2.1-W1': ['5.7.4-W1', '5.7.3-A1', '5.5.1-B1'],
  '7.2.1-W2': ['7.2.1-W1', '5.5.3-P1'],
  '7.2.2-S1': ['5.7.X2-D1', '5.7.4-W1'],
  '7.2.2-S2': ['7.2.2-S1', '7.2.1-W2'],
  '7.2.3-D1': ['5.7.X2-D1', '5.7.3-A1'],
  '7.2.3-D2': ['7.2.3-D1', '7.2.2-S1'],
  '7.2.4-K1': ['7.2.3-D1', '5.7.X2-D2'],
  '7.2.4-K2': ['7.2.4-K1', '5.7.4-W2', '5.5.1-B2', '5.7.1-R2'],
  '7.2.5-T1': ['7.2.2-S1', '5.7.1-R1'],
  '7.2.5-T2': ['7.2.5-T1', '5.7.1-R2', '5.5.4-K2'],
  '7.2.X1-T1': ['7.2.5-T2', '5.5.2-S2'],
  '7.2.6-H1': ['7.2.3-D1', '5.5.2-S2'],
  '7.2.6-H2': ['7.2.6-H1'],
  '7.2.7-O1': ['5.5.2-S2', '5.7.1-R2', '5.5.5-D1'],
  '7.2.7-O2': ['7.2.7-O1', '5.7.4-W2'],
  '7.2.X2-U1': ['7.2.7-O1'],
  '7.2.X3-I1': ['7.2.7-O2'],
};

// Grundlage (ADR 0015): der Baustein, den die Förderstufe F übt. Er steht im Hinweis für die Lehrkraft.
const grundlagen = {
  '7.1.1-Z1': 'Am Thermometer und an der Zahlengeraden von −10 bis 10 ganze Zahlen ablesen und antippen',
  '7.1.1-Z2': 'An der Zahlengeraden die Schritte bis zur Null zählen und die Zahl auf der anderen Seite finden',
  '7.1.X1-K1': 'Vom Nullpunkt aus erst nach rechts oder links, dann nach oben oder unten gehen',
  '7.1.2-V1': 'Zwei Zahlen an der Zahlengeraden vergleichen: Die linke Zahl ist die kleinere',
  '7.1.2-V2': 'Drei Zahlen von −10 bis 10 an der Zahlengeraden ordnen und Schritte zwischen zwei Zahlen zählen',
  '7.1.X2-W1': 'An der Zahlengeraden vom Start aus einen Schritt nach rechts oder links gehen und das Ziel ablesen',
  '7.1.3-A1': 'Eine Plusaufgabe als Sprung an der Zahlengeraden lesen: bei der ersten Zahl starten, dann nach rechts oder links',
  '7.1.3-A2': 'Zwei Sprünge an der Zahlengeraden hintereinander ausführen und das Ziel ablesen',
  '7.1.4-S1': 'Eine Minusaufgabe als Sprung nach links an der Zahlengeraden lesen, auch über die Null hinweg',
  '7.1.4-S2': 'Den Unterschied zweier Temperaturen am Thermometer abzählen',
  '7.1.5-R1': 'Zwei Zeichen vor einer Zahl zu einem Zeichen zusammenfassen: aus + (−3) wird − 3',
  '7.1.5-R2': 'In einer Rechnung mit drei Zahlen zuerst die zwei Zahlen verrechnen, die gut zusammenpassen',
  '7.1.6-P1': 'Eine Malaufgabe als gleich lange Sprünge nach links an der Zahlengeraden lesen: 3 · (−4)',
  '7.1.6-P2': 'Erst das Vorzeichen bestimmen, dann die Aufgabe aus dem kleinen Einmaleins rechnen',
  '7.1.7-D1': 'Einen Weg an der Zahlengeraden in gleich lange Sprünge teilen: (−12) : 3',
  '7.1.7-D2': 'Zu einer Malaufgabe mit negativen Zahlen die Umkehraufgabe finden',
  '7.1.8-T1': 'In einer Rechnung mit Plus und Mal zuerst die Malaufgabe rechnen, am Bild der Sprünge',
  '7.1.8-T2': 'Eine Zahl mal eine Klammer in zwei Malaufgaben zerlegen, mit Lücken zum Ausfüllen',
  '7.1.X3-C1': 'Am Thermometer ablesen und abzählen, um wie viel Grad es wärmer oder kälter wird',
  '7.1.X4-B1': 'Am Kontoauszug mit einer Buchung den neuen Kontostand an der Zahlengeraden bestimmen',
  '7.2.1-W1': 'An einer Geradenkreuzung mit Winkeln in Zehnerschritten erkennen, welcher Winkel gegenüber und welcher daneben liegt',
  '7.2.1-W2': 'An zwei Parallelen den Winkel an derselben Stelle finden und abschreiben',
  '7.2.2-S1': 'Zwei Winkel im Bild addieren und das Ergebnis von 180° abziehen',
  '7.2.2-S2': 'Die drei Winkel eines Dreiecks im Bild zusammenzählen und mit 180° vergleichen',
  '7.2.3-D1': 'Am Bild zählen, wie viele Seiten gleich lang sind, und den größten Winkel mit 90° vergleichen',
  '7.2.3-D2': 'Im Bild die markierten gleich langen Seiten und gleich großen Winkel finden',
  '7.2.4-K1': 'In der Planfigur die gegebenen Seiten und Winkel markieren',
  '7.2.4-K2': 'Am Karogitter mit vorgegebenen Kreisbögen die dritte Ecke antippen',
  '7.2.5-T1': 'Im Bild den rechten Winkel auf dem Halbkreis finden',
  '7.2.5-T2': 'Am Karogitter den Mittelpunkt von AB finden und den Halbkreis zeichnen',
  '7.2.6-H1': 'Am Karogitter von einer Ecke aus senkrecht zu einer waagerechten Seite gehen',
  '7.2.6-H2': 'Am Karogitter die Seite verlängern und von der Ecke aus senkrecht darauf gehen',
  '7.2.7-O1': 'Am Karogitter die Mitte einer waagerechten Strecke finden und senkrecht durchgehen',
  '7.2.7-O2': 'Am Karogitter einen Winkel an einer Gitterecke halbieren (Diagonale)',
  '7.2.X1-T1': 'Am Karogitter prüfen, ob eine Gerade den Kreis trifft, berührt oder verfehlt',
  '7.2.X2-U1': 'Den Punkt finden, der von drei Ecken gleich weit entfernt ist, durch Kästchenzählen',
  '7.2.X3-I1': 'Den Punkt im Dreieck finden, der von allen Seiten gleich weit entfernt ist, durch Abzählen',
};

// Bildungsplan 2016, Standards der Klassen 7/8/9 (ADR 0044). Quelle: Niveauübersicht der Lehrkraft (docs/quellen/aufgabenniveaus-klasse-7.md).
// „aus Kl. 5/6“ heißt: ein Standard der Klassen 5/6, den das Kapitel wieder aufgreift.
const bp = {
  '7.1.1-Z1': '3.1.1 (4), (7) aus Kl. 5/6',
  '7.1.1-Z2': '3.1.1 (7) aus Kl. 5/6, Betrag 3.1.1 (8) nur E',
  '7.1.X1-K1': '3.1.1 (7) aus Kl. 5/6',
  '7.1.2-V1': '3.1.1 (7) aus Kl. 5/6',
  '7.1.2-V2': '3.1.1 (7) aus Kl. 5/6',
  '7.1.X2-W1': '3.2.1 (1)',
  '7.1.3-A1': '3.2.1 (1)',
  '7.1.3-A2': '3.2.1 (1)',
  '7.1.4-S1': '3.2.1 (1)',
  '7.1.4-S2': '3.2.1 (1)',
  '7.1.5-R1': '3.2.1 (2), (11)',
  '7.1.5-R2': '3.2.1 (11), 3.1.1 (25) aus Kl. 5/6',
  '7.1.6-P1': '3.2.1 (1)',
  '7.1.6-P2': '3.2.1 (1)',
  '7.1.7-D1': '3.2.1 (1)',
  '7.1.7-D2': '3.2.1 (1)',
  '7.1.8-T1': '3.2.1 (2)',
  '7.1.8-T2': '3.2.1 (10), (11)',
  '7.1.X3-C1': '3.2.1 (1)',
  '7.1.X4-B1': '3.2.1 (1)',
  '7.2.1-W1': '3.2.3 (3), auf G [MSA]',
  '7.2.1-W2': '3.2.3 (3), auf G [MSA]',
  '7.2.2-S1': '3.2.3 (4), (5)',
  '7.2.2-S2': '3.2.3 (4)',
  '7.2.3-D1': '3.2.3 (1)',
  '7.2.3-D2': '3.2.3 (5)',
  '7.2.4-K1': '3.2.3 (7)',
  '7.2.4-K2': '3.2.3 (7), (8)',
  '7.2.5-T1': '3.2.3 (6), auf G [MSA]',
  '7.2.5-T2': '3.2.3 (6), (10)',
  '7.2.X1-T1': '3.2.3 (12), nur E',
  '7.2.6-H1': '3.2.3 (9)',
  '7.2.6-H2': '3.2.3 (9)',
  '7.2.7-O1': '3.2.3 (9), (10)',
  '7.2.7-O2': '3.2.3 (9), (10)',
  '7.2.X2-U1': '3.2.3 (9), (11), nur E',
  '7.2.X3-I1': '3.2.3 (9), (11), nur E',
};

// IDs: Kapitel "7.1", Unterkapitel "7.1.3", Abstecher "7.1.X2", Lernziel "7.1.3-A2". Unterkapitel ohne feine Lernziele haben "7.2.1-L1".
export const kapitel = roh.map(([titel, unterkapitel], k) => {
  let extraNr = 0;
  return {
    id: `7.${k + 1}`,
    titel,
    unterkapitel: unterkapitel.map((u) => {
      const id = u.extra ? `7.${k + 1}.X${++extraNr}` : `7.${k + 1}.${u.nr}`;
      const paare = Array.isArray(u.lernziele) ? u.lernziele.map((text, i) => [`L${i + 1}`, text]) : Object.entries(u.lernziele);
      const lernziele = paare.map(([kurz, text]) => ({ id: `${id}-${kurz}`, text, ...(merkzettel7[`${id}-${kurz}`] && { merkzettel: merkzettel7[`${id}-${kurz}`] }), voraussetzungen: voraussetzungen[`${id}-${kurz}`] ?? [], ...(grundlagen[`${id}-${kurz}`] && { grundlage: grundlagen[`${id}-${kurz}`] }), ...(bp[`${id}-${kurz}`] && { bp: bp[`${id}-${kurz}`] }) }));
      return { id, titel: u.titel, extra: u.extra, ...(u.ab && { ab: u.ab }), ...(u.pflicht && { pflicht: u.pflicht }), lernziele, ...(merkzettel[id]?.heft && { heft: merkzettel[id].heft }), ...(wortspeicher[id] && { wortspeicher: wortspeicher[id] }) };
    }),
  };
});
