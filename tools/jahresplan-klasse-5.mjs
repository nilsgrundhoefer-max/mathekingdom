// Jahresplan Klasse 5 nach Schnittpunkt 5 (Baden-Württemberg).
// Quelle und Erläuterungen: docs/jahresplan-klasse-5.md

const uk = (titel, lernziele, extra = false) => ({ titel, lernziele, extra });

const roh = [
  ['Daten und Diagramme', [
    uk('Strichlisten und Häufigkeitstabellen', ['Ich kann mit Strichlisten und Häufigkeitstabellen umgehen.']),
    uk('Diagramme lesen', ['Ich kann Informationen aus Diagrammen ablesen.']),
    uk('Diagramme zeichnen', ['Ich kann Diagramme anfertigen.']),
    uk('Daten vergleichen', ['Ich kann Daten miteinander vergleichen.']),
    uk('Daten erheben', ['Ich kann Daten erheben.']),
  ]],
  ['Natürliche Zahlen', [
    uk('Natürliche Zahlen', ['Ich kann mit natürlichen Zahlen umgehen.']),
    uk('Große Zahlen', ['Ich kann mit großen Zahlen umgehen.']),
    uk('Runden', ['Ich kann Zahlen runden.']),
    uk('Schätzen', ['Ich kann eine Anzahl auf Bildern schätzen.']),
    uk('Zweiersystem', ['Ich kann Zahlen im Zweiersystem verwenden.']),
    uk('Römische Zahlzeichen', ['Ich kann römische Zahlzeichen verwenden.'], true),
  ]],
  ['Addieren und Subtrahieren', [
    uk('Kopfrechnen', {
      K1: 'Ich kann im Kopf addieren.',
      K2: 'Ich kann im Kopf subtrahieren.',
      K3: 'Ich kann beim Kopfrechnen geschickt vorgehen.',
    }),
    uk('Addieren', {
      A1: 'Ich kann die Fachbegriffe Summand und Summe verwenden.',
      A2: 'Ich kann schriftlich addieren, auch mit Übertrag.',
      A3: 'Ich kann mehrere Zahlen schriftlich addieren.',
      A4: 'Ich kann ein Ergebnis mit Überschlag und Probe prüfen.',
      A5: 'Ich kann Sachaufgaben zur Addition lösen, auch mit Tabellen und Diagrammen.',
    }),
    uk('Subtrahieren', {
      S1: 'Ich kann die Fachbegriffe Minuend, Subtrahend und Differenz verwenden.',
      S2: 'Ich kann schriftlich subtrahieren, auch mit Übertrag.',
      S3: 'Ich kann mehrere Zahlen schriftlich subtrahieren.',
      S4: 'Ich kann ein Ergebnis mit Überschlag und Probe prüfen.',
      S5: 'Ich kann Sachaufgaben zur Subtraktion lösen.',
    }),
    uk('Klammern', {
      B1: 'Ich kann Rechenausdrücke mit Klammern berechnen.',
      B2: 'Ich kann zu einem Text den passenden Rechenausdruck mit Klammern finden.',
    }),
    uk('Rechengesetze', {
      R1: 'Ich kann das Vertauschungsgesetz und das Verbindungsgesetz erkennen.',
      R2: 'Ich kann mit den Rechengesetzen vorteilhaft rechnen.',
    }),
  ]],
  ['Multiplizieren und Dividieren', [
    uk('Kopfrechnen', {
      K1: 'Ich kann die Aufgaben des kleinen Einmaleins sicher lösen.',
      K2: 'Ich kann Geteilt-Aufgaben aus dem kleinen Einmaleins lösen.',
      K3: 'Ich kann im Kopf multiplizieren und dividieren und dabei geschickt vorgehen.',
    }),
    uk('Multiplizieren', ['Ich kann Multiplikationsaufgaben berechnen.']),
    uk('Rechenvorteile', ['Ich kann Rechengesetze anwenden und somit Rechenvorteile nutzen.']),
    uk('Potenzen', ['Ich kann Potenzen berechnen.']),
    uk('Dividieren', {
      D1: 'Ich kann die Fachbegriffe Dividend, Divisor und Quotient verwenden.',
      D2: 'Ich kann schriftlich durch einstellige Zahlen dividieren.',
      D3: 'Ich kann schriftlich durch zweistellige Zahlen dividieren.',
      D4: 'Ich kann Divisionen mit Rest berechnen und den Rest deuten.',
      D5: 'Ich kann ein Ergebnis mit Überschlag und Probe prüfen.',
      D6: 'Ich kann Sachaufgaben zur Division lösen.',
    }),
    uk('Punkt vor Strich, Klammern zuerst', ['Ich kann die Rechenregeln „Punkt vor Strich“ und „Klammern zuerst“ anwenden.']),
    uk('Verteilungsgesetz', ['Ich kann das Verteilungsgesetz anwenden, indem ich ausklammere und ausmultipliziere.']),
    uk('Zahlenmuster', ['Ich kann Zahlenmuster erkennen.'], true),
  ]],
  ['Geometrische Grundbegriffe und ebene Figuren', [
    uk('Strecke und Gerade', ['Ich kann die Begriffe Strecke und Gerade anwenden.']),
    uk('Senkrechten', ['Ich kann Senkrechten erkennen und zeichnen.']),
    uk('Parallelen', ['Ich kann Parallelen erkennen und zeichnen.']),
    uk('Koordinatensystem', ['Ich kann Punkte im Koordinatensystem ablesen und darstellen.']),
    uk('Entfernung und Abstand', ['Ich kann die Begriffe Entfernung und Abstand richtig anwenden.']),
    uk('Symmetrie', ['Ich kann symmetrische Figuren erkennen und zeichnen.']),
    uk('Rechteck und Quadrat', ['Ich kann Rechteck und Quadrat erkennen, unterscheiden und zeichnen.']),
    uk('Parallelogramm und Raute', ['Ich kann Parallelogramm und Raute erkennen, unterscheiden und zeichnen.']),
    uk('Drachen und Trapez', ['Ich kann Drachen und Trapez erkennen, unterscheiden und zeichnen.']),
  ]],
  ['Größen und Sachaufgaben', [
    uk('Größen schätzen', ['Ich kann Größen schätzen.']),
    uk('Geld', ['Ich kann mit Geldbeträgen und Geldeinheiten rechnen.']),
    uk('Zeit', ['Ich kann mit Zeitpunkten, Zeitspannen und Zeiteinheiten umgehen.']),
    uk('Gewicht', ['Ich kann mit Gewichten und Gewichtseinheiten umgehen.']),
    uk('Länge', ['Ich kann mit Längen und Längeneinheiten umgehen.']),
    uk('Maßstab', ['Ich kann mit Maßstäben und maßstäblichen Zeichnungen umgehen.']),
    uk('Sachaufgaben', ['Ich kann Sachaufgaben sicher lösen.']),
    uk('Sachaufgaben zu Beruf und Alltag', ['Ich kann Sachaufgaben zu Beruf und Alltag lösen.'], true),
  ]],
  ['Kreis und Winkel', [
    uk('Kreise', ['Ich kann Kreise anhand verschiedener Vorgaben zeichnen.']),
    uk('Winkel vergleichen', ['Ich kann Winkel zeichnen und Winkelgrößen vergleichen.']),
    uk('Winkelarten', ['Ich kann Winkelarten angeben sowie Winkelgrößen schätzen und auch bestimmen.']),
    uk('Winkel messen und zeichnen', ['Ich kann Winkel zeichnen, schätzen und messen.']),
    uk('Dreiecke', ['Ich kann Dreiecke nach Winkelart oder Seitenbeziehung einteilen und selbst zeichnen.'], true),
    uk('Gradnetz', ['Ich kann mithilfe des Gradnetzes Aussagen treffen.'], true),
  ]],
  ['Flächeninhalt und Umfang', [
    uk('Flächen vergleichen', ['Ich kann Flächeninhalte durch Abzählen von Kästchen angeben und vergleichen.']),
    uk('Flächenmaße', ['Ich kann sicher mit Flächenmaßen umgehen.']),
    uk('Rechteck', ['Ich kann die Berechnung von Flächeninhalt und Umfang bei Rechtecken sicher durchführen und anwenden.']),
    uk('Zusammengesetzte Figuren', ['Ich kann die Berechnung von Flächeninhalt und Umfang auch bei zusammengesetzten Figuren durchführen und anwenden.']),
  ]],
  ['Brüche und Dezimalzahlen', [
    uk('Bruchschreibweise', ['Ich kann die Bruchschreibweise verwenden.']),
    uk('Bruchteile von Größen', ['Ich kann mit Bruchteilen von Größen umgehen.']),
    uk('Dezimalschreibweise', ['Ich kann die Dezimalschreibweise verwenden.']),
  ]],
];

// Merkzettel je Station: die Regeln des Unterkapitels in Kürze, ein vorgerechnetes Beispiel und ein Hinweis fürs Heft.
// Der Merkzettel ist frei zugänglich und kostet keine Münzen.
export const merkzettel = {
  '5.3.1': {
    regeln: [
      'Rechne in Schritten: erst bis zum nächsten Zehner oder Hunderter, dann den Rest.',
      'Liegt eine Zahl knapp neben einem Hunderter, rechne mit dem Hunderter und gleiche danach aus.',
      'Suche Zahlen, die zusammen einen glatten Zehner oder Hunderter ergeben.',
    ],
    beispiel: '67 + 48 = 67 + 3 + 45 = 115 und 83 − 27 = 83 − 3 − 24 = 56. Geschickt: 298 + 137 = 300 + 137 − 2 = 435.',
    heft: 'Schreibe bei schwierigen Aufgaben deine Zwischenschritte auf.',
  },
  '5.3.2': {
    regeln: [
      'Summand + Summand = Summe. Bei 34 + 12 = 46 sind 34 und 12 die Summanden, 46 ist der Wert der Summe.',
      'Schriftlich addieren: Schreibe stellengerecht untereinander, Einer unter Einer. Addiere von rechts nach links.',
      'Ist das Ergebnis einer Spalte 10 oder größer, schreibst du den Übertrag klein in die nächste Spalte und rechnest ihn dort mit.',
      'Überschlage vorher mit gerundeten Zahlen. Prüfe danach mit der Probe: Summe − Summand = anderer Summand.',
    ],
    beispiel: '467 + 285: Einer 7 + 5 = 12, schreibe 2, Übertrag 1. Zehner 6 + 8 + 1 = 15, schreibe 5, Übertrag 1. Hunderter 4 + 2 + 1 = 7. Ergebnis 752.',
    heft: 'Rechne schriftliche Aufgaben im Heft, ein Kästchen pro Ziffer.',
  },
  '5.3.3': {
    regeln: [
      'Minuend − Subtrahend = Differenz. Bei 46 − 12 = 34 ist 46 der Minuend, 12 der Subtrahend, 34 der Wert der Differenz.',
      'Schriftlich subtrahieren: Schreibe stellengerecht untereinander und beginne bei den Einern.',
      'Ist die obere Ziffer zu klein, rechnest du mit 10 mehr und merkst dir den Übertrag 1 für die nächste Spalte.',
      'Mehrere Subtrahenden kannst du zuerst addieren und ihre Summe dann abziehen.',
      'Probe: Differenz + Subtrahend = Minuend.',
    ],
    beispiel: '532 − 218: Einer 12 − 8 = 4, Übertrag 1. Zehner 3 − 1 − 1 = 1. Hunderter 5 − 2 = 3. Ergebnis 314. Probe: 314 + 218 = 532.',
    heft: 'Rechne schriftliche Aufgaben im Heft und schreibe den Übertrag immer mit.',
  },
  '5.3.4': {
    regeln: [
      'Was in der Klammer steht, wird zuerst berechnet.',
      'Ohne Klammern rechnest du bei Plus und Minus von links nach rechts.',
      'Eine Klammer hinter einem Minus fasst zusammen, was insgesamt abgezogen wird.',
    ],
    beispiel: '80 − (25 + 15) = 80 − 40 = 40. Ohne Klammer kommt etwas anderes heraus: 80 − 25 + 15 = 55 + 15 = 70.',
    heft: 'Schreibe jeden Rechenschritt in eine neue Zeile und unterstreiche, was du als Nächstes rechnest.',
  },
  '5.3.5': {
    regeln: [
      'Vertauschungsgesetz: Beim Addieren darfst du die Summanden vertauschen. 17 + 48 = 48 + 17.',
      'Verbindungsgesetz: Beim Addieren darfst du Klammern beliebig setzen. (17 + 48) + 52 = 17 + (48 + 52).',
      'Beide Gesetze gelten nicht beim Subtrahieren: 9 − 4 ist nicht dasselbe wie 4 − 9.',
      'Nutze die Gesetze, um zuerst die Zahlen zu addieren, die gut zusammenpassen.',
    ],
    beispiel: '37 + 48 + 63 = 37 + 63 + 48 = 100 + 48 = 148.',
    heft: 'Schreibe auf, wie du umgestellt hast, bevor du rechnest.',
  },
  '5.4.1': {
    regeln: [
      'Kernaufgaben helfen: mal 1, mal 2, mal 5 und mal 10 kannst du schnell.',
      'Schwere Aufgaben zerlegst du: 7 · 8 ist 5 · 8 und noch 2 · 8, also 40 + 16 = 56.',
      'Nachbaraufgaben: Kennst du 6 · 8 = 48, dann ist 7 · 8 eine Acht mehr, also 56.',
      'Tauschaufgaben haben dasselbe Ergebnis: 3 · 9 = 27 und 9 · 3 = 27.',
      'Geteilt rechnest du mit der Mal-Aufgabe: 56 : 8 = 7, denn 7 · 8 = 56.',
    ],
    beispiel: '63 : 9: Welche Zahl mal 9 ergibt 63? 5 · 9 = 45, 6 · 9 = 54, 7 · 9 = 63. Also 63 : 9 = 7.',
    heft: 'Schreibe die Reihen, die du noch nicht sicher kannst, ins Heft und sage sie dir laut vor.',
  },
  '5.4.5': {
    regeln: [
      'Dividend : Divisor = Quotient. Bei 48 : 6 = 8 ist 48 der Dividend, 6 der Divisor, 8 der Wert des Quotienten.',
      'Schriftlich dividieren: Beginne links. Teile, multipliziere zurück, ziehe ab und hole die nächste Ziffer herunter.',
      'Bleibt am Ende etwas übrig, ist das der Rest. Der Rest ist immer kleiner als der Divisor.',
      'Probe: Quotient · Divisor, dazu der Rest, ergibt den Dividenden.',
      'Durch 0 kann man nicht dividieren.',
    ],
    beispiel: '952 : 4: 9 : 4 = 2 Rest 1. Dann 15 : 4 = 3 Rest 3. Dann 32 : 4 = 8. Ergebnis 238. Probe: 238 · 4 = 952.',
    heft: 'Rechne schriftliche Divisionen im Heft und schreibe die Probe dazu.',
  },
};

// Wortspeicher je Station: Wort, Erklärung in einfacher Sprache und die Niveaustufe, ab der das Wort verwendet wird.
// Eine Aufgabe zeigt nur die Wörter bis zu ihrer eigenen Stufe. Die Aufgabentexte einer Stufe benutzen keine Wörter höherer Stufen.
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });
export const wortspeicher = {
  '5.3.1': [
    w('plus', 'F', 'So liest du das Zeichen +. Es kommt etwas dazu.'),
    w('minus', 'F', 'So liest du das Zeichen −. Es geht etwas weg.'),
    w('Zehner', 'F', 'Zehn Einer sind ein Zehner. Die Zahl 34 hat 3 Zehner und 4 Einer.'),
    w('Nachbarzehner', 'F', 'Die glatte Zehnerzahl davor oder danach. Die Nachbarzehner von 34 sind 30 und 40.'),
    w('Tauschaufgabe', 'F', 'Die Zahlen tauschen den Platz. 3 + 9 und 9 + 3 ergeben beide 12.'),
    w('addieren', 'G', 'Plus rechnen.'),
    w('subtrahieren', 'G', 'Minus rechnen.'),
    w('ergänzen', 'G', 'Ausrechnen, wie viel bis zu einer Zahl noch fehlt.'),
    w('Rechenvorteil', 'M', 'Ein geschickter Weg, der das Rechnen leichter macht.'),
    w('Umkehraufgabe', 'M', 'Die Rechnung, die eine andere rückgängig macht. Zu 52 − 4 = 48 gehört 48 + 4 = 52.'),
    w('Summand', 'E', 'Eine Zahl, die addiert wird. Bei 34 + 12 sind 34 und 12 die Summanden.'),
  ],
  '5.3.2': [
    w('plus', 'F', 'So liest du das Zeichen +. Es kommt etwas dazu.'),
    w('zusammen', 'F', 'Alles wird zusammengezählt.'),
    w('Zehner', 'F', 'Zehn Einer sind ein Zehner. Die Zahl 34 hat 3 Zehner und 4 Einer.'),
    w('Ergebnis', 'F', 'Die Zahl hinter dem Zeichen =.'),
    w('addieren', 'G', 'Plus rechnen.'),
    w('Summand', 'G', 'Eine Zahl, die addiert wird. Bei 34 + 12 sind 34 und 12 die Summanden.'),
    w('Summe', 'G', 'Das Ergebnis einer Plus-Aufgabe. Bei 34 + 12 = 46 ist 46 die Summe.'),
    w('schriftlich addieren', 'G', 'Die Zahlen stehen untereinander. Du rechnest Stelle für Stelle von rechts nach links.'),
    w('Übertrag', 'G', 'Der Zehner, den du in die nächste Spalte mitnimmst.'),
    w('Überschlag', 'G', 'Du rechnest mit runden Zahlen. So siehst du, wie groß das Ergebnis ungefähr ist.'),
    w('runden', 'G', 'Eine Zahl durch eine glatte Zahl in der Nähe ersetzen. Aus 48 wird 50.'),
    w('Probe', 'G', 'Du prüfst dein Ergebnis mit der Minus-Aufgabe. Zu 34 + 12 = 46 gehört 46 − 12 = 34.'),
    w('Umkehraufgabe', 'M', 'Die Rechnung, die eine andere rückgängig macht. Zur Addition gehört die Subtraktion.'),
    w('Term', 'E', 'Ein Rechenausdruck aus Zahlen, Rechenzeichen und Klammern, zum Beispiel 34 + 12.'),
  ],
  '5.3.3': [
    w('minus', 'F', 'So liest du das Zeichen −. Es geht etwas weg.'),
    w('wegnehmen', 'F', 'Etwas geht weg. Danach ist es weniger.'),
    w('tauschen', 'F', 'Du wechselst 1 Zehner in 10 Einer. Der Wert bleibt gleich.'),
    w('Ergebnis', 'F', 'Die Zahl hinter dem Zeichen =.'),
    w('subtrahieren', 'G', 'Minus rechnen.'),
    w('Minuend', 'G', 'Die Zahl, von der abgezogen wird. Bei 46 − 12 ist 46 der Minuend.'),
    w('Subtrahend', 'G', 'Die Zahl, die abgezogen wird. Bei 46 − 12 ist 12 der Subtrahend.'),
    w('Differenz', 'G', 'Das Ergebnis einer Minus-Aufgabe. Bei 46 − 12 = 34 ist 34 die Differenz.'),
    w('schriftlich subtrahieren', 'G', 'Die Zahlen stehen untereinander. Du rechnest Stelle für Stelle von rechts nach links.'),
    w('Übertrag', 'G', 'Die 1, die du dir für die nächste Spalte merkst.'),
    w('Überschlag', 'G', 'Du rechnest mit runden Zahlen. So siehst du, wie groß das Ergebnis ungefähr ist.'),
    w('Probe', 'G', 'Du prüfst dein Ergebnis mit der Plus-Aufgabe. Zu 46 − 12 = 34 gehört 34 + 12 = 46.'),
    w('Umkehraufgabe', 'M', 'Die Rechnung, die eine andere rückgängig macht. Zur Subtraktion gehört die Addition.'),
    w('Term', 'E', 'Ein Rechenausdruck aus Zahlen, Rechenzeichen und Klammern, zum Beispiel 46 − 12.'),
  ],
  '5.3.4': [
    w('Klammer', 'F', 'Die Zeichen ( und ). Was in der Klammer steht, rechnest du zuerst.'),
    w('zuerst', 'F', 'Das kommt als Erstes dran.'),
    w('Rechenausdruck', 'G', 'Eine Rechnung aus Zahlen, Rechenzeichen und Klammern, zum Beispiel 20 − (5 + 3).'),
    w('Summe', 'G', 'Das Ergebnis einer Plus-Aufgabe.'),
    w('Differenz', 'G', 'Das Ergebnis einer Minus-Aufgabe.'),
    w('Minusklammer', 'M', 'Eine Klammer hinter einem Minus. Alles in ihr wird zusammen abgezogen.'),
    w('Term', 'E', 'Ein anderes Wort für Rechenausdruck.'),
  ],
  '5.3.5': [
    w('Tauschaufgabe', 'F', 'Die Zahlen tauschen den Platz. 3 + 9 und 9 + 3 ergeben beide 12.'),
    w('zusammen', 'F', 'Alles wird zusammengezählt.'),
    w('Vertauschungsgesetz', 'G', 'Beim Addieren darfst du die Zahlen vertauschen. 17 + 48 = 48 + 17.'),
    w('Verbindungsgesetz', 'G', 'Beim Addieren darfst du die Klammern beliebig setzen. (17 + 48) + 52 = 17 + (48 + 52).'),
    w('Rechenvorteil', 'M', 'Ein geschickter Weg, der das Rechnen leichter macht.'),
    w('Term', 'E', 'Ein Rechenausdruck aus Zahlen, Rechenzeichen und Klammern.'),
  ],
  '5.4.1': [
    w('mal', 'F', 'So liest du das Zeichen ·. 3 · 4 heißt: 3 Päckchen mit je 4.'),
    w('geteilt durch', 'F', 'So liest du das Zeichen :. 12 : 3 heißt: 12 gerecht in 3 Teile.'),
    w('Kernaufgabe', 'F', 'Eine leichte Aufgabe mit 1, 2, 5 oder 10. Von ihr aus rechnest du weiter.'),
    w('Tauschaufgabe', 'F', 'Die Zahlen tauschen den Platz. 3 · 4 und 4 · 3 ergeben beide 12.'),
    w('Nachbaraufgabe', 'G', 'Eine Reihe mehr oder weniger. Zu 6 · 7 gehören 5 · 7 und 7 · 7.'),
    w('Produkt', 'G', 'Das Ergebnis einer Mal-Aufgabe. Bei 4 · 5 = 20 ist 20 das Produkt.'),
    w('Probe', 'G', 'Du prüfst eine Geteilt-Aufgabe mit der Mal-Aufgabe.'),
    w('zerlegen', 'M', 'Eine schwere Aufgabe in zwei leichte teilen. 7 · 6 ist 5 · 6 und 2 · 6.'),
    w('Umkehraufgabe', 'M', 'Die Rechnung, die eine andere rückgängig macht. Zu 56 : 8 gehört 7 · 8.'),
    w('Quadratzahl', 'E', 'Eine Zahl mal sich selbst. 6 · 6 = 36, also ist 36 eine Quadratzahl.'),
    w('teilbar', 'E', 'Eine Zahl ist durch 6 teilbar, wenn beim Teilen durch 6 kein Rest bleibt.'),
  ],
  '5.4.5': [
    w('geteilt durch', 'F', 'So liest du das Zeichen : vor. 12 : 3 heißt: 12 geteilt durch 3.'),
    w('teilen', 'F', 'Gerecht verteilen oder gleich große Gruppen bilden.'),
    w('mal', 'F', 'So liest du das Zeichen · vor. Mal ist das Gegenteil von geteilt.'),
    w('Ergebnis', 'F', 'Die Zahl hinter dem Zeichen =.'),
    w('Probe', 'F', 'Du prüfst dein Ergebnis mit der Mal-Aufgabe. Zu 12 : 3 = 4 gehört 4 · 3 = 12.'),
    w('Rest', 'F', 'Was beim Teilen übrig bleibt. 14 : 4 = 3 Rest 2.'),
    w('Quotient', 'G', 'Das Ergebnis einer Geteilt-Aufgabe. Bei 12 : 3 = 4 ist 4 der Quotient.'),
    w('Überschlag', 'G', 'Du rechnest mit runden Zahlen. So siehst du, wie groß das Ergebnis ungefähr ist.'),
    w('schriftlich dividieren', 'G', 'Schritt für Schritt teilen: teilen, malnehmen, abziehen, nächste Ziffer herunterholen.'),
    w('Dividend', 'M', 'Die Zahl, die geteilt wird. Bei 12 : 3 ist 12 der Dividend.'),
    w('Divisor', 'M', 'Die Zahl, durch die geteilt wird. Bei 12 : 3 ist 3 der Divisor.'),
    w('Umkehraufgabe', 'M', 'Die Rechnung, die eine andere rückgängig macht. Zur Division gehört die Multiplikation.'),
    w('Term', 'E', 'Ein Rechenausdruck aus Zahlen, Rechenzeichen und Klammern, zum Beispiel (12 + 8) : 4.'),
    w('Wert', 'E', 'Die Zahl, die herauskommt, wenn man einen Term ausrechnet.'),
    w('teilbar', 'E', 'Eine Zahl ist durch 7 teilbar, wenn beim Dividieren durch 7 kein Rest bleibt.'),
    w('Vielfaches', 'E', 'Die Vielfachen von 7 sind 7, 14, 21, 28 und so weiter.'),
  ],
};

// Voraussetzungen (ADR 0014): Lernziel → Lernziele, auf denen es aufbaut. Daraus schlägt das Schüler-Dashboard eine Brücke vor,
// wenn ein Lernziel wackelig wird. Vorerst nur Lernziele, zu denen es schon Aufgaben gibt.
// Das kleine Einmaleins (5.4.1-K1, -K2) ist Grundschulstoff und die Basis-Brücke für das Dividieren.
const voraussetzungen = {
  '5.3.2-A2': ['5.3.1-K1'],
  '5.3.2-A3': ['5.3.2-A2'],
  '5.3.2-A4': ['5.3.2-A2', '5.3.1-K1'],
  '5.3.2-A5': ['5.3.2-A2'],
  '5.3.3-S2': ['5.3.1-K2', '5.3.2-A2'],
  '5.3.3-S3': ['5.3.3-S2'],
  '5.3.3-S4': ['5.3.3-S2', '5.3.2-A4'],
  '5.3.3-S5': ['5.3.3-S2'],
  '5.3.4-B1': ['5.3.1-K1', '5.3.1-K2'],
  '5.3.4-B2': ['5.3.4-B1'],
  '5.3.5-R2': ['5.3.5-R1', '5.3.1-K3'],
  '5.4.5-D2': ['5.4.1-K2', '5.4.5-D1', '5.3.1-K2'],
  '5.4.5-D3': ['5.4.5-D2', '5.4.1-K1'],
  '5.4.5-D4': ['5.4.5-D2', '5.4.1-K2'],
  '5.4.5-D5': ['5.4.5-D2', '5.3.2-A4'],
  '5.4.5-D6': ['5.4.5-D2', '5.4.5-D4'],
  '5.4.1-K2': ['5.4.1-K1'],
};

// Grundlage (ADR 0015): der Baustein, den die Förderstufe F zu diesem Lernziel übt. Das Lehrer-Dashboard nennt ihn,
// wenn ein Kind zum zweiten Mal auf die Grundlage zurückfällt. Die Zuordnung lehnt sich an „Mathe sicher können“ an.
const grundlagen = {
  '5.3.1-K1': 'Zerlegen und bis zum Zehner ergänzen, Zahlenraum bis 100',
  '5.3.1-K2': 'Wegnehmen und Ergänzen in Schritten bis 100',
  '5.3.1-K3': 'Zahlen, die zusammen 10 oder 100 ergeben',
  '5.3.2-A1': 'Plus als „zusammen“ und „dazu“: Aufgabe und Bild zuordnen',
  '5.3.2-A2': 'Bündeln: 10 Einer sind 1 Zehner, dann Rechnen im Stellenraster',
  '5.3.2-A3': 'Drei Zahlen im Raster ohne Übertrag, passende Zehner zuerst',
  '5.3.2-A4': 'Nachbarzehner finden, Plus mit Minus rückgängig machen',
  '5.3.2-A5': 'Dazukommen und Zusammenlegen am Bild, Rechnung zuordnen',
  '5.3.3-S1': 'Minus als „wegnehmen“: Aufgabe und Bild zuordnen',
  '5.3.3-S2': 'Entbündeln: 1 Zehner sind 10 Einer, dann Rechnen im Stellenraster',
  '5.3.3-S3': 'Zweimal nacheinander wegnehmen',
  '5.3.3-S4': 'Minus mit Plus rückgängig machen, Nachbarzehner',
  '5.3.3-S5': 'Wegnehmen am Bild, Rechnung und Geschichte zuordnen',
  '5.3.4-B1': 'In zwei Schritten rechnen: erst zusammenfassen, dann weiter',
  '5.3.4-B2': 'Geschichte mit zwei Schritten der passenden Rechnung zuordnen',
  '5.3.5-R1': 'Tauschaufgaben wie 3 + 5 und 5 + 3',
  '5.3.5-R2': 'Passende Zehner suchen, zum Beispiel 7 + 5 + 3',
  '5.4.1-K1': 'Mal-Aufgaben im Punktefeld sehen, Kernaufgaben mit 2, 5 und 10',
  '5.4.1-K2': 'Gerecht verteilen im Punktefeld, Mal-Aufgabe als Hilfe',
  '5.4.5-D1': 'Teilen als Verteilen und als Aufteilen in Gruppen',
  '5.4.5-D2': 'Einmaleins rückwärts, dann mit Zehnerzahlen (12 : 3 und 120 : 3)',
  '5.4.5-D3': 'Durch 10 teilen',
  '5.4.5-D4': 'Plättchen verteilen, einige bleiben übrig',
  '5.4.5-D5': 'Geteilt mit Mal rückgängig machen',
  '5.4.5-D6': 'Verteil- und Aufteil-Geschichten, Rechnung zuordnen',
};

// IDs: Kapitel "5.3", Unterkapitel "5.3.3" (Extras "5.2.X1"), Lernziel "5.3.3-S2".
export const kapitel = roh.map(([titel, unterkapitel], k) => {
  let nr = 0;
  let extraNr = 0;
  return {
    id: `5.${k + 1}`,
    titel,
    unterkapitel: unterkapitel.map((u) => {
      const id = u.extra ? `5.${k + 1}.X${++extraNr}` : `5.${k + 1}.${++nr}`;
      const lernziele = Array.isArray(u.lernziele)
        ? u.lernziele.map((text, i) => ({ id: `${id}-L${i + 1}`, text }))
        : Object.entries(u.lernziele).map(([kurz, text]) => ({ id: `${id}-${kurz}`, text, ...(voraussetzungen[`${id}-${kurz}`] && { voraussetzungen: voraussetzungen[`${id}-${kurz}`] }), ...(grundlagen[`${id}-${kurz}`] && { grundlage: grundlagen[`${id}-${kurz}`] }) }));
      return { id, titel: u.titel, extra: u.extra, lernziele, ...(merkzettel[id] && { merkzettel: merkzettel[id] }), ...(wortspeicher[id] && { wortspeicher: wortspeicher[id] }) };
    }),
  };
});
