# Klasse 6, Kapitel 7 „Zuordnungen“

Klasse 6 bekommt ihr siebtes Kapitel nach dem Jahresplan (Schnittpunkt 6): 6 Meilensteine mit je 2 Lernzielen und 24 Aufgaben, zusammen 288 Aufgaben. 7.3 „Tabellenkalkulation“ und 7.4 „Ein Rechenschieber für die Zukunft“ entfallen als Medienkompetenz. Grundlage sind zwei Fragerunden mit Nils am 25.11.2026 (Fragen 1 bis 18): Runde 1 „alle wie empfohlen“, Runde 2 „alle wie empfohlen, rest passt“.

**Lernziele.** 7.1 D1 Zuordnungen aus Text, Tabelle und Schaubild lesen, D2 zwischen den Darstellungen wechseln. 7.2 P1 erkennen, ob eine Zuordnung proportional ist, P2 Tabellen ergänzen. 7.5 S1 proportionale Zuordnungen am Schaubild erkennen, S2 Werte ablesen und Punkte eintragen. 7.6 R1 mit dem Dreisatz rechnen, R2 Sachaufgaben. 7.7 A1 antiproportionale Zuordnungen erkennen, A2 Tabellen ergänzen. 7.8 U1 Dreisatz bei antiproportionalen Zuordnungen, U2 entscheiden, welche Zuordnung vorliegt, und passend rechnen.

**Marken.** 7.7 und 7.8 sind Niveau-Meilensteine nur für E (Bildungsplan: antiproportional nur E) mit 24 E-Aufgaben je Lernziel; Klasse 7 wiederholt das Thema für alle. 7.6 Dreisatz trägt „Pflicht ab M“: Der Bildungsplan verlangt den Dreisatz erst auf M, F und G üben ihn als freiwilligen Abstecher an der Tabelle.

**Staffel.** F: ganze Zahlen, Faktor höchstens 5, Geld ganz oder mit ,50. G: Faktor bis 10, Centbeträge. M: Quotientengleichheit, Einheitswert als Dezimalzahl, Dreisatz über einen gemeinsamen Teiler, Einheiten angleichen. E bekommt keine längeren Zahlen, sondern Begründungen, Fehlersuche, „keines von beiden“ und Rückwärtsaufgaben. Alles geht auf, gerundet wird nie; 4,5 € und 4,50 € sind dieselbe Antwort.

**Sprache.** „Zuordnung“, „proportional“, „Schaubild“ und „Dreisatz“ stehen auf allen Stufen, „Wertepaar“ und „Einteilung“ ab G, „Quotient“ ab M, „antiproportional“ und „Produkt“ nur auf E. Es heißt „Nullpunkt“, nicht „Ursprung“, und es gibt keinen Proportionalitätsfaktor. Ein Wertepaar steht mit Pfeil da („2 Hefte → 3 €“). Wertetabellen liegen waagrecht.

**Schaubild.** Neu ist das Schaubild: das Koordinatengitter aus Kapitel 5.5 mit erstem Quadranten, Achsennamen samt Einheit und einer Einteilung (`skala`). Erlaubt sind die Schritte 1, 2, 5, 10 und ihre Zehnfachen, ab G auch 0,5; die beiden Achsen dürfen verschieden eingeteilt sein. Stückzahlen zeigt das Schaubild nur als Punkte, messbare Größen als Linie. Abgelesen wird nur auf Gitterlinien. Ein Schaubild ist 3 bis 14 Kästchen breit und hoch, auf einer Bildkarte höchstens 8, damit es am PC ohne Scrollen lesbar bleibt.

**Punkte eintragen.** Das Kind tippt die Punkte im Schaubild an: F 2 Punkte, G 3, M 3 bis 4, immer genau auf Gitterpunkten. Ab G folgt die Nachfrage „Liegen die Punkte auf einer Geraden durch den Nullpunkt?“; sie gehört zur Antwort. Vertauschte Achsen und gezählte Kästchen (Einteilung übersehen) erkennt die Prüfung als eigene Fehler, auch wenn die Aufgabe sie nicht einzeln nennt. Ein Schaubild mit eigener Achseneinteilung zeichnet das Kind im Heft (ab M). Die ungleichmäßig eingeteilte Achse ist eine Fehlersuche auf E.

**Dreisatztabelle.** Neu ist die Dreisatztabelle mit Rechenpfeilen an beiden Rändern. F: Die Rechenpfeile stehen da, die mittlere Zeile ist „für 1“. G: Das Kind trägt auch die Zahlen in die Rechenpfeile ein. M: nur das Ergebnis, dazu einzelne Tabellen mit vorgegebener Mittelzeile für den gemeinsamen Teiler. E: mehrschrittig und rückwärts. Der Zwischenwert „für 1“ als Ergebnis ist ein eigener typischer Fehler. Bei antiproportionalen Zuordnungen stehen links und rechts Gegenrechnungen (links geteilt, rechts malgenommen).

**Erkennen.** Etwa die Hälfte der Erkenn-Aufgaben ist nicht proportional. Die Aufgabe nennt die Bedingung („Jedes Brötchen kostet gleich viel“) oder zeigt Werte, die das Kind prüfen kann. „3 zum Preis von 2“ und die Grundgebühr sind Gegenbeispiele ab G. In 7.7 sieht das Kind die gekrümmte Kurve nur zum Erkennen und Ablesen, dazu die fallende Gerade als Gegenbeispiel. In 7.8 U2 wählt das Kind erst aus drei Antworten und rechnet dann; bei etwa einem Viertel ist die Antwort „keines von beiden“.

**Heftaufgaben.** Nur auf M und E: je 4 in S2, R1 und R2, 8 in U1, zusammen 20. Jede hat einen Kontrollwert zum Eingeben.

**Fehlvorstellungen.** Elf neue: „je mehr, desto mehr“ gilt als proportional, addiert statt vervielfacht, Dreisatz falsch herum, Zwischenwert als Ergebnis, Achsen vertauscht, Achse ungleichmäßig eingeteilt, Grundgebühr übersehen, antiproportional wie proportional gerechnet und umgekehrt, Einteilung übersehen, in der Tabelle in der falschen Spalte abgelesen. Vereinbart waren neun; die beiden letzten kamen beim Bau dazu, weil das Ablesen sie verlangt.

**Prüfung.** Ein eigenes Prüfprogramm (`tools/pruefe-zuordnungen.mjs`) rechnet jede Aufgabe mit Brüchen nach: Tabellen gegen ihre Regel (proportional, antiproportional, Gerade), Dreisätze aus dem gegebenen Wertepaar, abgelesene Werte und eingetragene Punkte gegen das Schaubild, und die Art einer Zuordnung aus den Wertepaaren oder dem Schaubild selbst. Es erzwingt auch die Wortstufen, die Regeln zum Schaubild und die Achsennamen mit Einheit. 28 Begründungsaufgaben lassen sich nicht vollständig nachrechnen; ihr Nachweis ist als frei oder als Urteil gekennzeichnet.

**Voraussetzungen.** D1 braucht das Ablesen aus Diagrammen (5.1.2-L1) und Punkte im Koordinatensystem (5.5.4-K1, D2: 5.5.4-K2), P2 das Multiplizieren von Dezimalzahlen (6.5.3-M1), R1 das Dividieren einer Dezimalzahl (6.5.4-D1). Innerhalb des Kapitels bauen die Lernziele in der Reihenfolge des Buchs aufeinander auf.

**Bildungsplan.** Leitidee Funktionaler Zusammenhang: D und S: FZ (1), (3), (4), P, R, A und U: FZ (5). Die Operatorregel aus Kapitel 3 gilt auch hier.
