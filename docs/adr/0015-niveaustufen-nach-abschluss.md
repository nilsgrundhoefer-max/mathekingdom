# Niveaustufen nach Abschluss, F als Grundlagen-Schleife, Aufgaben mit Nachweis und Bild

Nach ADR 0009 waren F und G immer noch zu schwer und zu ähnlich: Ein Kind, das um Bronze spielte, scheiterte an F, und zwischen G, M und E war nicht klar, wofür die Stufe steht. Jetzt hat jede Niveaustufe eine feste Bedeutung, F ist keine wählbare Stufe mehr, und alle 600 Aufgaben der Klasse 5 sind neu erzeugt. Dieses ADR ersetzt in ADR 0009 die Tabelle der Niveaustufen, die AFB-Folge und den Satz „Keine Bilder auf F“. ADR 0012 gilt weiter, nur steht Bronze nicht mehr zur Wahl.

| | F | G | M | E |
|---|---|---|---|---|
| Steht für | Basiskompetenzen, die G voraussetzt, mit größtmöglicher Unterstützung | Hauptschulabschluss | Realschulabschluss | Zugabe Richtung Gymnasium |
| Anforderung | ein Schritt, an Material oder Bild abzulesen oder zu handeln | ein Standardverfahren, ein bis zwei Schritte, klarer Text | mehrschrittig, Text in Rechnung übersetzen, Ergebnis deuten | Struktur erkennen, verallgemeinern, begründen |
| AFB der sechs Aufgaben | I, I, I, I, II, I | I, I, II, I, II, III | I, II, II, I, II, III | I, II, II, III, II, III |
| Auswahlantworten | höchstens 3 | höchstens 3 | bis 4 | bis 4 |
| Hilfekärtchen | drei, das erste liegt von Anfang an offen | drei | zwei: Tipp, Lösungsschritt | eines: Tipp |
| Bild | jede Aufgabe | mindestens drei von sechs | wo es passt | wo es passt |

Die Zahlengröße ist nicht das Kriterium. Sie darf von F nach E wachsen, trennt die Stufen aber nicht.

## Grundlagen-Schleife

- **F wird nie gewählt und nie empfohlen.** Die unterste Kronenwahl ist Silber (G). Der Einstiegscheck schlägt mindestens Silber vor. Eine alte Wahl „Bronze“ zählt als Silber.
- Kommt ein Kind auf G bei einem Lernziel nicht weiter, übt es zuerst die **Grundlage** dieses Lernziels auf F. Das ist der Fall, wenn es zwei Aufgaben trotz Lösungsschritt-Kärtchen nicht gelöst hat oder wenn das Lernziel auf G wackelig ist (mindestens vier Aufgaben und weniger als die Hälfte gelöst, oder zweimal das Lösungsschritt-Kärtchen).
- Nach **drei richtigen F-Aufgaben** geht es von selbst zurück auf G. Gezählt werden nur Versuche auf G nach der Rückkehr, sonst begänne die Schleife sofort wieder.
- Die Schleife gilt **je Lernziel**, nicht für das Kapitel. Solange sie läuft, kommen zu diesem Lernziel F-Aufgaben, auch wenn das Kind die Krone wechselt. Kronenvorschlag und Brücke ruhen so lange.
- Das Kind liest: „Wir üben erst die Grundlage.“ und danach „Jetzt klappt auch der nächste Schritt.“ Im Aufgabenkopf steht „Grundlage“ statt einer Krone. Das Wort Bronze fällt dabei nicht.
- Rutscht ein Kind beim selben Lernziel **zum zweiten Mal** in die Schleife, steht das im Lehrer-Dashboard unter „Impulse“, mit dem Baustein, der fehlt. Jedes Lernziel nennt dafür im Jahresplan seine `grundlage` in einem Satz.
- **Bronze bleibt als Anerkennung**: Die Bronze-Krone gibt es für drei richtige F-Aufgaben, ohne Bedingung an den AFB.
- **Zielniveau F** kann die Lehrkraft weiterhin fest setzen. Dann arbeitet das Kind auf F wie bisher, Bronze steht zur Wahl, und es gibt keine Schleife.
- Die **Brücke** (ADR 0014) bleibt für M und E. Auf G übernimmt die Schleife ihre Aufgabe.

## Keine fachlichen Fehler: Nachweis und unabhängiger Prüfer

Jede Aufgabe trägt ein Feld `nachweis`: die Rechnungen, die zur Lösung führen, oder eine benannte Prüfart (zum Beispiel „welche Zahl ist ein Vielfaches“, „Urteil über eine Rechnung“). `tools/pruefe-pool.mjs` kennt den Erzeuger nicht. Er rechnet jeden Nachweis selbst nach und verlangt, dass

- die Lösung das Ergebnis des Nachweises ist und jede Zahl des Nachweises aus dem Aufgabentext, dem Bild oder einer früheren Zeile stammt,
- jede Gleichung im Aufgabentext, in den Hilfekärtchen, im Merkzettel und im Wortspeicher stimmt,
- das Bild genau die Zahlen der Aufgabe zeigt und zur Rechnung passt,
- bei Auswahlaufgaben mit Zahlen oder Rechnungen genau die angekreuzte Antwort stimmt,
- die Regeln der Tabelle oben eingehalten sind.

Zwölf Aufgaben zu Fachbegriffen und Begründungen in Worten haben keinen Nachweis. Dazu kommen rund 60 Auswahlaufgaben, deren Antworten Sätze sind: Dort prüft der Prüfer die Zahlen und Rechnungen, aber nicht den Satz. Alle diese Aufgaben sind von Hand gegengelesen. `tests/pruefer.test.js` baut absichtlich Fehler in den Pool ein und verlangt, dass der Prüfer sie meldet. `tests/bilder.test.js` zeichnet jedes Bild und zählt nach.

## Bilder

Die Bilder sind schematisch und werden im Dashboard aus dem Feld `bild` gezeichnet (`src/schueler/aufgabenbilder.js`): Zehnerfeld, Mengenbild, Gruppenbild, Punktefeld, Zehnermaterial, Stellenwerttafel, Streifenbild, Vergleichsbild, Zahlenstrahl. Dazu kommen das Rechenraster (Tabelle mit einem Feld je Ziffer) und Ziffernfelder in Lückenaufgaben. Jedes Bild hat eine Beschreibung in Worten für Vorleseprogramme. Auf F darf das Bild die Lösung ablesbar machen: Das ist die Unterstützung, um die es dort geht.

## Consequences

- Alle 600 Aufgaben haben neue Inhalte unter den alten Kennungen. Alte Versuche in Speicherständen bleiben lesbar, beziehen sich aber auf die früheren Aufgaben.
- Neue Aufgaben einer Gruppe kommen in der Reihenfolge ihrer Nummern, weil sie aufeinander aufbauen.
- Auf E öffnet sich nach einem Fehlversuch kein Kärtchen von selbst. Das Kind kann den Tipp jederzeit selbst aufdecken.
- Sternregel: Auf G, M und E bleibt die Bedingung „mindestens eine Aufgabe aus AFB II oder III“. Bei Zielniveau F entfällt sie.
- Der Speicherstand bekommt das Feld `grundlage` je Lernziel (`aktiv`, `ab`, `mal`, `t`, `zurueckAb`, `zurueckAm`). Alte Speicherstände ohne das Feld funktionieren unverändert, die Versionsnummer des Speicherstands bleibt.
