# Klasse 6, Kapitel 4 „Dezimalzahlen“ und gekennzeichnete Heftaufgaben

Klasse 6 bekommt ihr viertes Kapitel nach dem Jahresplan (Schnittpunkt 6): 6 Meilensteine mit je 2 Lernzielen und 24 Aufgaben, zusammen 288 Aufgaben. 4.4 „Runden mit der Tabellenkalkulation“ entfällt als Medienkompetenz. Grundlage sind zwei Fragerunden mit Nils am 25.11.2026 (Fragen 1 bis 20), das Gesamtbild hat er mit „Passt“ bestätigt.

**Staffel nach Stellen.** F rechnet mit Zehnteln und Hundertsteln, G bis zu Tausendsteln, M bis zu Zehntausendsteln. E bekommt keine längeren Zahlen, sondern andere Aufgaben: Dichte (zwischen zwei Dezimalzahlen liegt immer eine weitere), Fehlersuche und Rückwärtsaufgaben. Der Prüfer kennt die Grenzen je Stufe (2, 3, 4, 4 Stellen nach dem Komma) und die erlaubten Nenner beim Umwandeln: F 2, 4, 5, 10, 20, 25; G dazu 8 und 50; M dazu 40, 125, 250; E auch Brüche, die sich nicht auf eine Zehnerpotenz erweitern lassen („geht nicht“).

**4.6 Umwandeln durch Dividieren ist ein Abstecher ab M.** Wie im Buch (Marke M) gibt es dort nur Aufgaben auf M und E, je Lernziel zwölf, und `ab: "M"` macht den Meilenstein für F und G zum freiwilligen Abstecher. D1 behandelt abbrechende, D2 periodische Dezimalzahlen.

**Periodische Dezimalzahlen in zwei Feldern.** Das neue Format `periode` hat ein Feld „vor der Periode“ und eines „Periode“, daneben eine Vorschau mit Überstrich. Nils wählte das, weil die Kinder am PC arbeiten; eine Tastatur für den Überstrich gibt es nicht. Jede Schreibweise mit dem richtigen Wert zählt (0,3̅ wie 0,33̅). Im Pool steht nach jeder Ziffer der Periode das Zeichen U+0305 („0,16̅“), der Prüfer verlangt die kürzeste Schreibweise. Typische Fehler sind die abgebrochene Zahl (`periode-abgebrochen`) und der Strich über zu vielen Ziffern (`periode-zu-frueh`).

**Schriftliche Division als Lösungsbild.** Eine Aufgabe mit `division: { dividend, divisor }` zeigt nach zwei Fehlversuchen die ganze schriftliche Division mit Komma, Resten und dem Satz, ob sie aufgeht oder welcher Rest sich wiederholt. Der Prüfer rechnet nach, dass Dividend durch Divisor die Lösung ergibt.

**Endnullen sind nie verlangt.** Nils: „4 ist ebenfalls richtig.“ Beim Runden auf Zehntel gilt „4“ wie „4,0“, überall gilt 2,5 = 2,50. Hat die Lösung beim Runden eine Endnull, steht nach der Antwort der Satz „Man darf die Null schreiben, um zu zeigen, wie genau gerundet wurde“ mit der Zahl.

**Prozent ohne Grundwert.** F und G lesen Prozent am Hunderterfeld ab (Prozent heißt Hundertstel), M nimmt Nenner, die in 100 aufgehen, auch über 100 %, E 12,5 % und gerundete Werte wie 33,3 %. Grundwert und Prozentwert kommen erst in Klasse 7. Ein Hunderterfeld zum Färben gibt es nicht: 35 Kästchen einzeln anzutippen kostet Zeit ohne Lerngewinn, F und G wählen stattdessen das passende Feld unter dreien.

**Zahlenstrahl mit Lupe.** Auf M und E vergrößert ein zweiter Zahlenstrahl einen Schritt des ersten zehnfach (`bild.art: "lupe"` mit `oben` und `unten`). Der Prüfer verlangt genau einen Schritt und den Faktor 10.

**Heftaufgaben sind gekennzeichnet, in Klasse 5, 6 und 7.** In den Teststunden wussten Kinder nicht, welche Aufgaben ins Heft gehören. Jede Heftaufgabe trägt jetzt `heftaufgabe: true`. Das Dashboard zeigt darüber ein blaues Band mit Heftsymbol, „Heftaufgabe: Rechne im Heft. Gib danach nur dein Ergebnis ein.“, und das Eingabefeld heißt „Ergebnis aus deinem Heft“. Abweichung von der Fragerunde: Bei Zeichenaufgaben (Zeichne, Konstruiere) heißt das Band „Zeichne im Heft“, denn dort wird nichts gerechnet. Der Prüfer erkennt einen Heftauftrag am Text (ein Satz, der mit „Im Heft:“ beginnt, oder ein Aufforderungssatz mit „ins Heft“, „in dein Heft“ oder „im Heft“) und meldet jede Aufgabe, bei der Text und Kennzeichen nicht zusammenpassen. In Kapitel 4 gibt es Heftaufgaben nur beim schriftlichen Dividieren.

**Heftcode leiser.** Der Hinweis unter jeder gelösten Aufgabe ab Gold („Notiere im Heft: H7 und dein Ergebnis“) ist jetzt klein und grau, damit er nicht wie eine Heftaufgabe aussieht.

**Bildschirm.** Nils: „die Schüler arbeiten in Mathekingdom hauptsächlich am PC/Notebook die Darstellung an Tablet und Handy ist im Normalfall zu vernachlässigen.“ Der Browsertest des Kapitels und die Beispielbilder laufen deshalb bei 1200 Pixel Breite; die Layoutprüfung bei 420 Pixel bleibt als Absicherung.

**Prüfregeln.** Neu im Nachweis: `runden` (`zahl`, `stelle`, `ergebnis`, optional `einheit` und `behauptet` für Urteile), `rundenwahl` und `abbrechend` (gekürzter Nenner nur mit den Faktoren 2 und 5). Die Operatorregel aus Kapitel 3 (Satzanfang mit Verb, keine Frage im Aufgabentext) gilt auch hier. Das Bruchfeld nimmt fünf Stellen, damit der Nenner 10000 passt.
