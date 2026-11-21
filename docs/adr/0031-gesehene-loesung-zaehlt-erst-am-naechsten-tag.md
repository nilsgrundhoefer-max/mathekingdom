# Gesehene Lösung zählt erst am nächsten Tag

Nils fragte am 21.11.2026, ob ein Kind einfach alle Tipps und Lösungen öffnen und so durch die Aufgaben rennen kann. Durchklicken brachte schon vorher kein Siegel: Wer das Lösungsschritt-Kärtchen öffnet, bekommt 1 Münze, und die Aufgabe zählt nicht fürs Lernziel; wer zweimal falsch antwortet, sieht die Lösung und bekommt keine Münzen. Es gab aber eine Lücke. Je Lernziel und Niveaustufe gibt es nur sechs Aufgaben. Sind die neuen aufgebraucht, kommen die nicht gelösten zurück. Das Kind kannte dann die Lösung, und die Aufgabe zählte voll, mit Siegel und vollen Münzen.

**Entscheidung.** Eine Aufgabe, deren Lösung ein Schüler gesehen hat, zählt am selben Tag nicht fürs Lernziel (und damit nicht für Siegel und Krone) und bringt höchstens 1 Münze. Ab dem nächsten Tag zählt sie wieder normal. „Lösung gesehen“ heißt: die Aufgabe nach zwei Fehlversuchen nicht gelöst (dann steht die Lösung da) oder das Lösungsschritt-Kärtchen geöffnet. Tipp und Beispiel zählen nicht dazu, der Einstiegscheck zeigt keine Lösung. Das Ergebnis sagt dem Kind: „Diese Aufgabe kanntest du schon. Ab morgen zählt sie wieder für dein Siegel.“ Im Versuchsprotokoll steht der Versuch mit `bekannt: true`.

**Die Lehrkraft** bekommt kein Werkzeug zum Zurücksetzen einzelner Lernziele; es bleibt bei „Siegel gehen nie verloren“ (ADR 0014). Stattdessen gibt es unter Lernstand › Auffälligkeiten den Hinweis „Lösungen durchgeklickt“, wenn mindestens 5 der letzten 10 Aufgaben mit gesehener Lösung enden und jede in unter 30 Sekunden erledigt war. Greift schon „Rät vermutlich“ (schnell falsch), erscheint er nicht zusätzlich.

## Considered Options

- **Nie wieder zählen.** Bei sechs Aufgaben je Niveau säße ein schwaches Kind bald fest, das zu Beginn viele Lösungen gebraucht hat.
- **Lernziel durch die Lehrkraft zurücksetzen.** Bricht die Regel, dass Siegel nie verloren gehen, und wird nach dieser Regel nicht mehr gebraucht: Durchklicken bringt nichts mehr.
- **Am nächsten Tag zählen (gewählt).** Wer eine Lösung am nächsten Tag noch weiß, hat tatsächlich etwas behalten. Das ist verteiltes Üben, wie beim Rückblick.

## Consequences

Ein Kind kann an einem Tag nicht mehr Siegel sammeln, indem es Lösungen ansieht und dieselben Aufgaben gleich danach noch einmal löst. Wer sehr viele Lösungen braucht, kommt an einem Tag langsamer voran; dafür springt ohnehin die Grundlagen-Schleife an (ADR 0015). Die Regel steht in `src/schueler/logik.js` (`loesungGesehen`, `kenntLoesung`, `zaehlt`).
