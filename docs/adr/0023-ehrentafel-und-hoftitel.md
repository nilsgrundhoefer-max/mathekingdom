# Ehrentafel mit Hoftiteln: die fünf Besten der Klasse nach Kronen und Siegeln

Nils möchte die Spitze der Klasse würdigen. Am 19.11.2026 (Version 0.18) hat er in zwei Fragerunden entschieden: Die fünf besten Schüler eines Schuljahrs stehen auf einer Ehrentafel und tragen einen Hoftitel mit Symbol. Begriffe und Regeln stehen in CONTEXT.md unter Ehrentafel und Hoftitel.

**Bewusste Ausnahme von ADR 0014 und 0018.** Dort gilt: Alles Mathematische bleibt ohne Vergleich. Die Ehrentafel ist der erste Vergleich nach Mathe-Leistung. Nils lässt ihn zu, weil nur die besten fünf erscheinen: Leistung wird gewürdigt, ohne die Schwächeren bloßzustellen. Deshalb sieht niemand außerhalb der Tafel einen Platz oder eine Punktzahl, nur den Satz „Jede Krone bringt dich nach vorn“. Auch auf der Tafel stehen keine Punkte, nur Kronen je Farbe und Siegel.

**Absolut statt relativ zum Zielniveau.** Anders als bei den Münzen zählt eine Purpurkrone für alle gleich viel. Es geht um Spitzenförderung. Kinder mit Zielniveau G kommen dadurch selten auf die Tafel. Das nimmt Nils in Kauf.

**Schuljahr und live.** Gewertet werden die Kronen und Siegel der aktuellen Klassenstufe. Die Tafel beginnt mit dem Schuljahreswechsel neu und ändert sich laufend: Holt jemand auf, wechselt der Titel. Jedes Schüler-Dashboard berechnet die Tafel aus den Speicherständen der Mitschüler, wie bei Expedition und Bestenliste. Deshalb ist sie nicht fälschungssicher. Verworfen wurde ein Stichtag, an dem die Lehrkraft die Titel über die signierte Klassendatei bestätigt. Er wäre sicher gewesen, aber nicht lebendig. Die Lehrkraft sieht die Tafel mit echten Namen im Lernstand und kann so prüfen.

**Verworfen.** Eine ewige Wertung (die Spitze stünde nach wenigen Wochen fest), eine Wertung je Monat oder je Kapitel, Münzen oder ein bleibendes Ehrenzeichen für einen Titel, eine Platzzahl für alle, die männliche Form als einzige.

## Folgen

- Kein neues Feld für die Wertung: Kronen und Siegel werden wie bisher aus dem Versuchsprotokoll berechnet.
- Der Speicherstand bekommt die gewählte Titelform, das Ausblenden von der Ehrentafel und den zuletzt gemeldeten Titel (für die einmalige Meldung).
- Die Klassendatei bekommt den Schalter für die Ehrentafel (standardmäßig an).
- Neue Zeichnungen: Königskrone (größer, mit Hermelin, ohne Kronenfarbe), Zepter, Schwert, Helm, Wimpel.

## Geändert am 19.11.2026 (Version 0.20)

Nach dem ersten Ausprobieren hat Nils drei Dinge zurückgenommen: Die **Ehrentafel** im Schlossgarten entfällt, der **Hoftitel** erscheint nur noch in der eigenen Kopfzeile (nicht mehr in den Bestenlisten), und es gibt nur die **männliche Form** (keine Wahl König oder Königin). Damit entfallen auch die Meldung bei einem neuen Titel und das Ausblenden. Weil kein Schüler mehr den Titel eines anderen sieht, ist die Ausnahme von „Mathematik ohne Vergleich“ (ADR 0014, 0018) deutlich kleiner: Verglichen wird nur noch im Hintergrund, sichtbar ist allein der eigene Titel. Wertung, Schwelle, Gleichstand, Schuljahr und Lehrer-Übersicht bleiben wie oben. Der Schalter in der Klassendatei heißt weiter `ehrentafel`, damit bestehende Klassendateien gelten.
