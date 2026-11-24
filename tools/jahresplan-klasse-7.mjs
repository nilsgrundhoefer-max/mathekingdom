// Jahresplan Klasse 7 nach Schnittpunkt Mathematik 7, Differenzierende Ausgabe Baden-Württemberg (ISBN 978-3-12-744372-1).
// Quelle und Erläuterungen: docs/jahresplan-klasse-7.md und ADR 0043. Die „Ich kann“-Sätze folgen dem Kompetenzraster des Verlags (2017).
// Die Nummern der Unterkapitel stehen wie im Buch. EXTRA-Einheiten mit Mathe-Inhalt sind Abstecher für alle (`extra`), die am Computer entfallen.
// `ab`: Einheiten mit Sternchen sind für den Hauptschulabschluss nicht verbindlich und deshalb als Niveau-Meilenstein M vorgemerkt.

const b = (z, n) => `${z}⁄${n}`;
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });
const uk = (nr, titel, lernziele, ab = null) => ({ nr, titel, lernziele, ab, extra: false });
const ex = (titel, lernziele) => ({ nr: null, titel, lernziele, ab: null, extra: true });

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
    uk(1, 'Winkel im Schnittpunkt von Geraden', ['Ich kann die Winkel im Schnittpunkt von Geraden benennen.'], 'M'),
    uk(2, 'Winkelsumme im Dreieck', ['Ich kann mithilfe des Winkelsummensatzes Berechnungen am Dreieck vornehmen.']),
    uk(3, 'Dreiecksformen', ['Ich kann Dreiecksformen anhand von Seiten und Winkeln unterscheiden.']),
    uk(4, 'Dreiecke konstruieren', ['Ich kann mithilfe der Kongruenzsätze Dreiecke konstruieren.']),
    uk(5, 'Der Satz des Thales', ['Ich kann mit dem Satz des Thales rechtwinklige Dreiecke konstruieren.'], 'M'),
    ex('Kreis und Tangenten', ['Ich kann Tangenten an einen Kreis konstruieren.']),
    uk(6, 'Höhen', ['Ich kann zu den Dreiecksseiten Höhen einzeichnen.']),
    uk(7, 'Mittelsenkrechte. Winkelhalbierende', ['Ich kann Mittelsenkrechte und Winkelhalbierende zeichnen.']),
    ex('Mit Zirkel und Lineal: Mittelsenkrechte. Umkreis', ['Ich kann Mittelsenkrechte mit Zirkel und Lineal konstruieren.']),
    ex('Mit Zirkel und Lineal: Winkelhalbierende. Inkreis', ['Ich kann Winkelhalbierende mit Zirkel und Lineal konstruieren.']),
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
    regeln: [
      'Zahlen unter null heißen negative Zahlen. Sie tragen ein Minuszeichen: −3.',
      'Zahlen über null heißen positive Zahlen. Die Null ist weder positiv noch negativ.',
      'Auf der Zahlengeraden stehen die negativen Zahlen links von der Null.',
      'Die Gegenzahl liegt gleich weit von der Null entfernt, aber auf der anderen Seite: Die Gegenzahl von 4 ist −4.',
      'Der Abstand einer Zahl zur Null ist nie negativ. Bei −4 und bei 4 ist er 4.',
      'Ab M: Der Abstand zur Null heißt Betrag. Man schreibt |−4| = 4.',
      'Ab M: Die ganzen Zahlen und alle Brüche und Dezimalzahlen mit Plus oder Minus heißen rationale Zahlen.',
    ],
    beispiel: 'Das Thermometer zeigt −5 °C. Das sind 5 Grad unter null. Bei 5 °C ist es gleich weit über null.',
    heft: 'Zeichne eine Zahlengerade mit der Null in der Mitte. Schreibe die Zahlen mit Vorzeichen daran.',
  },
  '7.1.X1': {
    regeln: [
      'Das Koordinatensystem hat zwei Achsen: die x-Achse nach rechts und die y-Achse nach oben. Sie kreuzen sich im Nullpunkt.',
      'Jeder Punkt hat zwei Koordinaten: P(x|y). Erst kommt die x-Koordinate, dann die y-Koordinate.',
      'Ist die x-Koordinate negativ, gehst du vom Nullpunkt nach links. Ist die y-Koordinate negativ, gehst du nach unten.',
      'Ab M: Die Achsen teilen das Blatt in vier Quadranten. Gezählt wird oben rechts beginnend gegen den Uhrzeigersinn: I, II, III, IV.',
      'Ab E: Beim Spiegeln an der x-Achse wechselt die y-Koordinate ihr Vorzeichen, beim Spiegeln an der y-Achse die x-Koordinate.',
    ],
    beispiel: 'P(−3|2): Gehe vom Nullpunkt 3 nach links und 2 nach oben.',
    heft: 'Gehe immer zuerst an der x-Achse entlang und dann nach oben oder unten.',
  },
  '7.1.2': {
    regeln: [
      'Von zwei Zahlen ist die kleiner, die auf der Zahlengeraden weiter links liegt.',
      'Jede negative Zahl ist kleiner als null und kleiner als jede positive Zahl.',
      'Bei zwei negativen Zahlen ist die kleiner, die weiter von der Null entfernt ist: −8 < −3.',
      'Den Abstand zweier Zahlen findest du durch Zählen der Schritte auf der Zahlengeraden.',
      'Ab G: Die Mitte zweier Zahlen liegt von beiden gleich weit entfernt.',
      `Ab M: Brüche und Dezimalzahlen vergleichst du zuerst ohne Vorzeichen. Bei negativen Zahlen dreht sich das Zeichen um: ${b(1, 2)} > ${b(1, 4)}, aber −${b(1, 2)} < −${b(1, 4)}.`,
    ],
    beispiel: 'Bei −8 °C ist es kälter als bei −3 °C. Also gilt −8 < −3.',
    heft: 'Markiere beide Zahlen auf einer Zahlengeraden. Die linke Zahl ist die kleinere.',
  },
  '7.1.X2': {
    regeln: [
      'Ein Weg auf der Zahlengeraden hat einen Start, einen oder mehrere Schritte und ein Ziel.',
      'Ein Schritt mit Plus geht nach rechts. Ein Schritt mit Minus geht nach links.',
      'Start −3, Schritt +5: Du landest bei 2.',
      'Ab M: Suchst du den Start, gehst du vom Ziel aus alle Schritte rückwärts.',
      'Ab E: Fehlt ein Schritt, zählst du von der letzten bekannten Stelle bis zum Ziel.',
    ],
    beispiel: 'Start bei 2, dann 6 Schritte nach links: Du gehst über die Null und landest bei −4.',
    heft: 'Zeichne jeden Schritt als Bogen über die Zahlengerade und schreibe die Zahl daran.',
  },
  '7.1.3': {
    regeln: [
      'Addieren an der Zahlengeraden: Starte bei der ersten Zahl.',
      'Eine positive Zahl addieren heißt: nach rechts gehen. −5 + 3 = −2.',
      'Eine negative Zahl addieren heißt: nach links gehen. 2 + (−6) = −4.',
      'Zwei negative Zahlen: Es wird noch weniger. −2 + (−3) = −5.',
      'Ab G: Gleiche Vorzeichen: Abstände zur Null addieren, das Vorzeichen bleibt. Verschiedene Vorzeichen: Abstände subtrahieren, das Vorzeichen der Zahl mit dem größeren Abstand gilt.',
      `Ab M: Dieselben Regeln gelten für Dezimalzahlen und Brüche: −1,5 + 0,7 = −0,8 und −${b(3, 5)} + ${b(1, 5)} = −${b(2, 5)}.`,
    ],
    beispiel: 'Morgens sind es −5 °C. Bis mittags wird es 8 Grad wärmer: −5 + 8 = 3. Mittags sind es 3 °C.',
    heft: 'Schreibe eine negative Zahl nach dem Pluszeichen immer in Klammern: 4 + (−9).',
  },
  '7.1.4': {
    regeln: [
      'Subtrahieren an der Zahlengeraden: Starte bei der ersten Zahl und gehe nach links. 3 − 5 = −2.',
      'Eine negative Zahl subtrahieren heißt: ihre Gegenzahl addieren. 3 − (−5) = 3 + 5 = 8.',
      'Aus Minus und Minus wird Plus.',
      'Ab G: Jede Minusaufgabe lässt sich als Plusaufgabe schreiben: −4 − 6 = −4 + (−6) = −10.',
      `Ab M: Dieselben Regeln gelten für Dezimalzahlen und Brüche: 0,5 − 1,2 = −0,7 und ${b(1, 7)} − ${b(4, 7)} = −${b(3, 7)}.`,
    ],
    beispiel: 'Der Unterschied zwischen 4 °C und −3 °C: 4 − (−3) = 4 + 3 = 7. Es sind 7 Grad Unterschied.',
    heft: 'Schreibe zuerst die Plusaufgabe mit der Gegenzahl hin. Rechne dann.',
  },
  '7.1.5': {
    regeln: [
      'Plus und Plus wird Plus: 5 + (+3) = 5 + 3.',
      'Plus und Minus wird Minus: 5 + (−3) = 5 − 3.',
      'Minus und Plus wird Minus: 5 − (+3) = 5 − 3.',
      'Minus und Minus wird Plus: 5 − (−3) = 5 + 3.',
      'Ab G: Steht ein Plus vor einer Klammer, darfst du die Klammer weglassen. Steht ein Minus davor, drehen sich alle Zeichen in der Klammer um: 10 − (4 − 6) = 10 − 4 + 6 = 12.',
      'Ab G: In einer Summe darfst du die Zahlen mit ihrem Vorzeichen vertauschen. Ordne so, dass es leicht wird: 17 − 8 + 3 = 17 + 3 − 8 = 12.',
      'Ab M: Fasse erst alle positiven und alle negativen Zahlen zusammen. Zahlen und ihre Gegenzahlen heben sich auf.',
    ],
    beispiel: '(+15) + (−8) − (−5) = 15 − 8 + 5 = 12. Erst fallen die Klammern weg, dann wird gerechnet.',
    heft: 'Schreibe die Aufgabe erst ohne Klammern. Das Vorzeichen wandert immer mit seiner Zahl.',
  },
  '7.1.6': {
    regeln: [
      'Malnehmen heißt: mehrmals dasselbe addieren. 3 · (−4) = (−4) + (−4) + (−4) = −12.',
      'Plus mal Minus ergibt Minus. Minus mal Plus ergibt Minus.',
      'Minus mal Minus ergibt Plus: (−3) · (−4) = 12.',
      'Rechne so: erst das Vorzeichen bestimmen, dann die Zahlen ohne Vorzeichen malnehmen.',
      'Eine Zahl mal 0 ist immer 0.',
      'Ab M: Bei mehreren Faktoren zählst du die Minuszeichen. Eine gerade Anzahl ergibt Plus, eine ungerade Anzahl ergibt Minus.',
      `Ab M: Dieselben Regeln gelten für Dezimalzahlen und Brüche: (−0,5) · 4 = −2 und (−${b(2, 3)}) · (−${b(1, 5)}) = ${b(2, 15)}.`,
    ],
    beispiel: 'Ein Taucher sinkt in jeder Minute 4 m. Nach 3 Minuten: 3 · (−4) = −12. Er ist 12 m unter der Oberfläche.',
    heft: 'Schreibe zuerst das Vorzeichen des Ergebnisses hin. Rechne dann mit den Zahlen ohne Vorzeichen.',
  },
  '7.1.7': {
    regeln: [
      'Beim Dividieren gelten dieselben Vorzeichenregeln wie beim Multiplizieren.',
      'Gleiche Vorzeichen ergeben Plus: (−12) : (−3) = 4.',
      'Verschiedene Vorzeichen ergeben Minus: (−12) : 3 = −4 und 12 : (−3) = −4.',
      'Null geteilt durch eine Zahl ist null: 0 : (−17) = 0. Durch null kann man nicht teilen.',
      'Prüfe mit der Malaufgabe: (−4) · 3 = −12.',
      `Ab M: Durch einen Bruch dividierst du, indem du mit dem Kehrwert multiplizierst: (−${b(3, 4)}) : ${b(1, 2)} = (−${b(3, 4)}) · 2 = −${b(3, 2)}.`,
    ],
    beispiel: '−20 € Schulden werden auf 4 Personen verteilt: (−20) : 4 = −5. Jede Person hat 5 € Schulden.',
    heft: 'Bestimme zuerst das Vorzeichen. Mache danach immer die Probe mit der Malaufgabe.',
  },
  '7.1.8': {
    regeln: [
      'Klammern zuerst.',
      'Dann Punkt vor Strich: Mal und geteilt kommen vor plus und minus.',
      'Sonst rechnest du von links nach rechts.',
      '2 + 3 · (−4) = 2 + (−12) = −10.',
      'Ab G: Ausmultiplizieren: Jede Zahl in der Klammer wird mit der Zahl vor der Klammer malgenommen. 2 · (3 + (−5)) = 2 · 3 + 2 · (−5) = −4.',
      'Ab M: Ausklammern: Steckt in jedem Teil derselbe Faktor, darf er vor eine Klammer. (−7) · 13 + (−7) · 7 = (−7) · (13 + 7) = −140.',
    ],
    beispiel: '(−2 + 5) · (−4) = 3 · (−4) = −12. Zuerst wird die Klammer berechnet.',
    heft: 'Unterstreiche, was du zuerst rechnest. Schreibe jeden Schritt in eine neue Zeile.',
  },
  '7.1.X3': {
    regeln: [
      'Temperaturen misst man bei uns in Grad Celsius: °C. Wasser gefriert bei 0 °C und siedet bei 100 °C.',
      'Temperaturen unter null sind negativ. Dann herrscht Frost.',
      'Steigt die Temperatur, rechnest du plus. Sinkt sie, rechnest du minus.',
      'Den Temperaturunterschied findest du durch Zählen an der Skala: von −3 °C bis 4 °C sind es 7 Grad.',
      'Ab M: In den USA misst man in Grad Fahrenheit. Umrechnung: Grad Celsius mal 1,8 plus 32. Aus 10 °C werden 50 °F, denn 10 · 1,8 + 32 = 50.',
      'Ab M: In der Wissenschaft misst man in Kelvin. Umrechnung: Grad Celsius plus 273. Aus −3 °C werden 270 K, denn −3 + 273 = 270.',
    ],
    beispiel: 'Nachts sind es −6 °C, mittags 5 °C. Die Temperatur ist um 11 Grad gestiegen, denn 5 − (−6) = 11.',
    heft: 'Skizziere ein Thermometer. Markiere beide Temperaturen und zähle die Grade dazwischen.',
  },
  '7.1.X4': {
    regeln: [
      'Auf einem Girokonto liegt dein Geld bei der Bank. Der Kontostand sagt, wie viel Geld auf dem Konto ist.',
      'Ein positiver Kontostand ist ein Guthaben. Ein negativer Kontostand bedeutet Schulden bei der Bank.',
      'Kommt Geld auf das Konto, rechnest du plus. Geht Geld vom Konto ab, rechnest du minus.',
      'Neuer Kontostand: alter Kontostand und alle Buchungen der Reihe nach verrechnen.',
      'Ab G: Geld, das dazukommt, heißt Gutschrift. Geld, das abgeht, heißt Abbuchung.',
      'Ab M: Auf dem Kontoauszug steht S für Soll (Minus) und H für Haben (Plus). Wer mehr abhebt, als er hat, überzieht sein Konto.',
    ],
    beispiel: 'Kontostand 40 €, dann eine Abbuchung von 65 €: 40 − 65 = −25. Das Konto ist mit 25 € im Minus.',
    heft: 'Schreibe die Buchungen untereinander, jede mit Plus oder Minus davor.',
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
      const lernziele = paare.map(([kurz, text]) => ({ id: `${id}-${kurz}`, text, voraussetzungen: voraussetzungen[`${id}-${kurz}`] ?? [], ...(grundlagen[`${id}-${kurz}`] && { grundlage: grundlagen[`${id}-${kurz}`] }) }));
      return { id, titel: u.titel, extra: u.extra, ...(u.ab && { ab: u.ab }), lernziele, ...(merkzettel[id] && { merkzettel: merkzettel[id] }), ...(wortspeicher[id] && { wortspeicher: wortspeicher[id] }) };
    }),
  };
});
