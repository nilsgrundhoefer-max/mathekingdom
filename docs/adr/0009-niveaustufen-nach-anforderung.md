# Niveaustufen unterscheiden sich in der Art der Anforderung

Die Aufgaben auf F und G waren zu schwer: Die vier Niveaustufen unterschieden sich fast nur in der Größe der Zahlen. Jetzt trennt zuerst die **Art der Anforderung**, die Zahlengröße folgt erst an zweiter Stelle. Für F ist der Bildungsplan SBBZ Lernen Mathematik (Baden-Württemberg 2022) die Quelle. Er nennt keinen festen Zahlenraum, sondern Handlungsvorstellungen, ein automatisiertes kleines Einmaleins und halbschriftliches Rechnen als Kern.

| | F | G | M | E |
|---|---|---|---|---|
| Anforderung | eine Handlung, ein Schritt | ein Standardverfahren, ein Schritt, klarer Text | mehrschrittig, Text in Rechnung übersetzen, Ergebnis deuten | Struktur erkennen, Lücken und Ziffernrätsel, Behauptungen beurteilen |
| Zahlenraum Klasse 5 | bis 100, dazu glatte Zehner und Hunderter bis 1000 | bis 1000, schriftlich bis 10 000 | bis 1 Million | wie M, keine größeren Zahlen |
| Rechenweg | im Kopf oder halbschriftlich, nie schriftlich | schriftlich nur mit einstelligem Divisor und ohne Rest | alle Verfahren | alle Verfahren |
| Sprache | einfache Sprache, Alltagswörter | einfache Sprache, erste Fachwörter | Fachwörter | Fachsprache |
| Hilfekärtchen | drei: Handlung mit Material, vorgerechnetes ähnliches Beispiel, Weg dieser Aufgabe bis kurz vor das Ergebnis | drei: Verfahrenshinweis, vorgerechnetes Beispiel, erster Schritt | zwei: Denkanstoß, erster Schritt | eines: eine Frage, die auf die Struktur zeigt |
| Wortspeicher | aufgeklappt | aufgeklappt | zugeklappt | zugeklappt |

Weitere Festlegungen:

- **Jedes Lernziel gibt es auf jeder Niveaustufe**, auf F und G in vereinfachter Fassung.
- **M ist das Standard-Zielniveau** in Klasse 5 und 6 (vorher G).
- **Anforderungsbereiche in jeder Niveaustufe**: Je Lernziel und Niveaustufe sechs Aufgaben in der Folge AFB I, II, II, I, II, III. Das ergibt rund 35 % AFB I, 50 % AFB II und 15 % AFB III. Der AFB wird relativ zur Niveaustufe gelesen: AFB III heißt auf F und G „eine Rechnung beurteilen und den Fehler finden“, auf M „ein Ergebnis im Sachzusammenhang deuten oder prüfen“, auf E „verallgemeinern und begründen“.
- **Sternregel**: Ein Lernziel ist erreicht mit drei richtigen Aufgaben, davon zwei auf dem Zielniveau, ohne Lösungsschritt-Kärtchen und mindestens eine aus AFB II oder III. AFB III ist keine Pflicht, bringt aber 50 % mehr Münzen.
- **Begründen auf E** geschieht über Auswahl (Behauptung und passende Begründung wählen), Ziffernrätsel sind Lückenaufgaben. Freitext bleibt ausgeschlossen, weil jede Aufgabe automatisch auswertbar sein muss.
- **Einfache Sprache auf F und G**: ein Gedanke pro Satz, keine Nebensätze, jeder Satz in einer eigenen Zeile, Alltagswörter, Zahlen als Ziffern, die Frage am Schluss. Keine Silbentrennung mit Bindestrich.
- **Keine Bilder** auf F (vielleicht später). Zahlenstrahl, Tabelle und Diagramm bleiben auf allen Niveaustufen. Als Material werden nur Wendeplättchen und Schmierblatt genannt.
- **Wortspeicher** je Station: Wort und Erklärung in einem Satz, die Fachwörter nehmen von F nach E zu. Aufgaben und Hilfekärtchen verwenden nur Wörter, die bis zu ihrer Niveaustufe im Wortspeicher stehen.

## Consequences

- Der ganze Aufgabenpool wird neu erzeugt, auch die 264 schon freigegebenen Aufgaben. Dividieren (5.4.5) ist das Muster; Kapitel 3 folgt nach der Durchsicht und läuft bis dahin nach den alten Regeln. Die neuen Prüfungen in `tools/pruefe-pool.mjs` gelten deshalb vorerst nur für 5.4.5, und die neue Sternregel greift nur bei Lernzielen, die auf jeder Niveaustufe Aufgaben aus AFB II oder III haben.
- Schüler ohne eigene Einstellung der Lehrkraft arbeiten ab jetzt auf M. Wer bisher stillschweigend auf G stand, muss von der Lehrkraft ausdrücklich auf G oder F gesetzt werden.
- Speicherstände mit Versuchen zu alten Aufgaben bleiben lesbar. Bereits vergebene Sterne bleiben bestehen.
- Abweichung vom ersten Entwurf des Wortspeichers: „Rest“ und „Probe“ stehen schon ab F, weil es die Lernziele „Division mit Rest“ und „Probe“ auch auf F gibt und die Aufgaben ohne diese Wörter nicht auskommen.
