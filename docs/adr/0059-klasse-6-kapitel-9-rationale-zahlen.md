# Klasse 6, Kapitel 9 „Rationale Zahlen“

Klasse 6 bekommt ihr neuntes Kapitel nach dem Jahresplan (Schnittpunkt 6): sechs Meilensteine mit je zwei Lernzielen, zusammen 288 Aufgaben. Grundlage ist eine Fragerunde mit Nils am 28.11.2026 (Fragen 1 bis 14), beantwortet mit „alle wie empfohlen passt“ als Freigabe zum Bau. Kleinere Entscheidungen beim Bau stehen unten. Quelle für die Niveaustufen ist die Niveauübersicht T09 (Leitidee Zahl, Variable, Operation).

**Eigene Aufgaben.** Klasse 7 Kapitel 1 (ADR 0043) behandelt rationale Zahlen vollständig. Klasse 6 bekommt trotzdem eigene Aufgaben auf ihrem Niveau, aber mit derselben Technik: dieselben Bilder (Zahlengerade, Thermometer, Kontoauszug), dieselben Rechenhelfer (`tools/aufgaben/7-1-rational.mjs`), dieselbe Nachrechnung (`tools/pruefe-rational.mjs`) und der ±-Knopf. Klasse 7 bleibt unverändert, bis auf neue Voraussetzungen (siehe unten).

**Lernziele.** 9.1 N1 negative Zahlen im Alltag deuten und mit Vorzeichen schreiben, N2 ganze Zahlen an der Zahlengerade ablesen und eintragen. 9.2 R1 negative Dezimalzahlen und Brüche an der Zahlengerade, R2 Gegenzahl und rationale Zahlen erkennen. 9.3 V1 vergleichen, V2 ordnen und Zahlen dazwischen angeben. 9.4 Z1 Zunahme und Abnahme an Zahlengerade und Thermometer, Z2 in Sachaufgaben. 9.5 A1 ganze Zahlen addieren und subtrahieren, A2 Dezimalzahlen und Brüche mit Vorzeichen. 9.6 P1 multiplizieren, D1 dividieren. In der Fragerunde hießen die Lernziele von 9.1 und 9.6 noch G1/G2 und M1/M2; beim Bau heißen sie N1/N2 und P1/D1, damit sie nicht mit den Niveaustufen G und M verwechselt werden.

**Marken.** 9.1 bis 9.4 haben je 6 Aufgaben auf F, G, M und E. 9.5 und 9.6 tragen im Buch die Marke E: 24 Aufgaben je Lernziel, nur auf E; für alle anderen sind sie ein Abstecher. Damit hat jedes Lernziel 24 Aufgaben.

**Staffel.** F ganze Zahlen bis ±20, immer mit Bild. G bis ±100 und eine Stelle nach dem Komma, Halbe nur in 9.2 und 9.3. M zwei Stellen nach dem Komma, Brüche mit den Nennern 2, 4, 5 und 10, Zahlen „dazwischen“ finden. E andere Nenner, der Betrag mit Betragsstrichen, Aussagen prüfen, Fehlersuche und Rückwärtsaufgaben. Auf E sind bis zu drei Stellen nach dem Komma erlaubt. Es gibt keine Potenzen und kein Koordinatensystem (beides bleibt Klasse 7).

**Sprache.** Positive und negative Zahl, ganze Zahl, Vorzeichen, Gegenzahl und Zahlengerade stehen auf allen Stufen. „Rationale Zahl“ ab M. „Betrag“, die Betragsstriche und die Zeichen ℕ, ℤ und ℚ nur auf E; vorher heißt es „Abstand zur Null“. Fragen mit Fragezeichen gibt es wie in den übrigen Kapiteln der Klasse 6 nicht; jeder Auftrag beginnt mit einem Operator.

**Schreibweise.** Es steht immer das echte Minuszeichen „−“. Eine negative Zahl nach einem Rechenzeichen steht in Klammern: 4 + (−9). Ein Plus vor positiven Zahlen gibt es nicht, „+7“ zählt als Eingabe wie „7“. Fehlt in einem Lückentext eine Zahl, steht die Lücke vorn, damit eine negative Lösung nicht ohne Klammer hinter einem Rechenzeichen landet. Der ±-Knopf (Vorzeichenknopf) gilt nun auch für 6.9.

**Zunahme und Abnahme.** Die Antwort auf „Um wie viel Grad wird es wärmer?“ ist eine positive Zahl. Wo die Richtung offen ist, wählt das Kind dazu wärmer oder kälter beziehungsweise mehr oder weniger. F und G zeigen die Änderung als Pfeil, M geht mit Dezimalzahlen über die Null, E rechnet rückwärts. „Summe statt Abstand über die Null“ ist ein eigener typischer Fehler mit eigener Rückmeldung.

**Heftaufgaben.** Keine. Begründungen kommen als Auswahl.

**Fehlvorstellungen.** Keine neuen Einträge im Katalog: Die Aufgaben nutzen die Fehlvorstellungen aus Klasse 7 Kapitel 1 und früheren Kapiteln, etwa „negative Zahl mit größerem Betrag ist größer“, „Vorzeichen vergessen“, „Zahlengerade gespiegelt“, „Beträge addiert“, „Minus und Minus übersehen“, „Minus mal Minus bleibt Minus“, „Richtung vertauscht“ und „Abstand über die Null als Summe“.

**Kontexte.** Alltag (Temperatur, Konto, Höhe über dem Meeresspiegel, Stockwerke, Tauchen) und Burg (Keller und Türme).

**Prüfung.** `tools/pruefe-rational.mjs` prüft 6.9 mit eigenen Regeln für Klasse 6: Klammer nach Rechenzeichen, keine Schrägstrich-Brüche, kein „+15“, Betrag und ℕℤℚ nur auf E, „rationale Zahl“ erst ab M, keine Potenzen, Stellen nach dem Komma je Stufe (Geldbeträge ausgenommen), Nenner je Stufe und Größe der Zahlen (20, 100, 1000, eine Million). `tools/pruefe-pool.mjs` behandelt 6.9 wie 7.1 als Kapitel mit rationalen Zahlen.

**Voraussetzungen.** N1 baut auf den natürlichen Zahlen (5.2.1-N1), R1 auf Bruch und Dezimalzahl am Zahlenstrahl (6.1.6-Z2, 6.4.2-V2), V1 und V2 auf dem Vergleichen und Ordnen von Brüchen und Dezimalzahlen (6.1.4, 6.4.2), Z1 auf dem Kopfrechnen (5.3.1-K1), Z2 und A2 auf dem Addieren von Dezimalzahlen (6.5.1-A1), P1 und D1 auf dem Multiplizieren und Dividieren von Brüchen und Dezimalzahlen (6.2.5, 6.2.6, 6.5.3, 6.5.4). Klasse 7 bekommt Verweise zurück: 7.1.1-Z1 auf 6.9.1-N1 und N2, 7.1.1-Z2 auf 6.9.2-R2, 7.1.2-V1 und V2 auf 6.9.3-V1 und V2. Dadurch kommen in Klasse 7 Aufgaben aus 6.9 als Brücken.

**Glossar.** „Zahlengerade“ gilt ab Klasse 6 Kapitel 9, sobald negative Zahlen vorkommen. „Vorzeichenknopf“ gilt auch für 6.9.

**Bildungsplan.** Leitidee Zahl, Variable, Operation: N1 und Z1/Z2 ZVO (4), N2 und R1 ZVO (4), (7), R2 ZVO (7) und den Betrag ZVO (8) nur auf E, V1 ZVO (7), V2 ZVO (7), (9), 9.5 und 9.6 ZVO (18) nur auf E.
