# Lernen sichtbar machen: Fehlvorstellungen, Hilfebedarf, Festigung und Kompetenzprofil

Nils möchte nach Hatties „Visible Learning“ Lernen statt Performanz sichtbar machen. Am 19.11.2026 hat Claude Version 0.11 gegen drei Dimensionen geprüft: Kompetenz und Struktur, Prozess und Denken, Reflexion und Metakognition. Vieles war schon da: Mastery-Regel für Siegel, Kronen als Tiefenstufen, AFB je Aufgabe, 47 benannte Fehlvorstellungen mit diagnostischen Distraktoren, Sicherheitsangabe mit Vier-Felder-Profil, Selbsteinschätzung, gestufte Hilfekärtchen. Es fehlte vor allem die zeitliche Entwicklung (wird ein Fehler überwunden, sinkt der Hilfebedarf, hält ein Siegel) und eine Sicht des Kindes auf das eigene Lernen. Nils hat in zwei Fragerunden alle Empfehlungen übernommen und Audio-Erklärungen und Portfolio abgelehnt.

**Überwunden statt nur falsch.** Eine Fehlvorstellung gilt als überwunden, wenn danach drei Aufgaben desselben Lernziels richtig und ohne sie gelöst sind; taucht sie wieder auf, ist sie für die Lehrkraft wieder aktiv. Das Kind sieht beim Wappen nur seine Aha-Momente, also Überwundenes in einem eigenen Kindersatz je Fehlvorstellung, nie offene Fehler, ohne Münzen, und ein einmal erreichter Aha-Moment bleibt stehen. Die Lehrkraft schaltet die Heatmap im Lernstand von Lernzielen auf die Fehlvorstellungen des Kapitels um (aktiv oder überwunden).

**Hilfebedarf über die Zeit.** Gezählt werden nur Beispiel und Lösungsschritt, weil sich der Tipp auf F, G und M von selbst öffnet. „Braucht viel Hilfe“ heißt Beispiel oder Lösungsschritt in mindestens der Hälfte der letzten 10 Aufgaben eines Lernziels; der Trend vergleicht ab 6 Aufgaben die erste mit der zweiten Hälfte. Das Kind bekommt einen kurzen Satz, wenn es bei einem Lernziel erstmals ohne beide auskommt.

**Diskrepanz.** Überschätzt: mindestens 3 „sicher falsch“ unter den letzten 20 Aufgaben oder Selbsteinschätzung „eher zu hoch“. Unterschätzt: mindestens die Hälfte von mindestens 6 „unsicher“-Antworten richtig oder Selbsteinschätzung „eher zu niedrig“. Ohne Sicherheitsangabe arbeitet der Filter nur mit der Selbsteinschätzung. Das Kind sieht nach „unsicher, aber richtig“ höchstens einmal je Wegstück „Du kannst mehr, als du denkst“.

**Gefestigt.** Nach dem Siegel folgt die Stufe gefestigt, wenn das Lernziel mindestens 7 Tage nach dem Siegel im Rückblick oder im Seitenblick richtig gelöst ist. Ein Fehler im Seitenblick macht es nicht aufzufrischen; das bleibt Sache des Rückblicks. Gefestigt bringt keine Münzen und ändert den Rang nicht.

**Kompetenzprofil.** Jede Aufgabe trägt eine prozessbezogene Kompetenz des Bildungsplans 2016 als Haupt- und höchstens eine als Nebenkompetenz, festgelegt je Aufgabenmuster in den Erzeugern und vom Prüfer verlangt. Das Profil zeigt je Kompetenz den Anteil der Aufgaben, die im ersten Versuch ohne Beispiel oder Lösungsschritt richtig waren, über das Schuljahr; unter 6 Aufgaben bleibt die Achse grau. Es erscheint zuerst nur im Lehrer-Dashboard, weil dünne Achsen Kindern Zufall als Schwäche zeigen würden.

**Versuchsverlauf und Voraussetzungen nur für die Lehrkraft.** Die Schüleransicht zeigt die letzten Aufgaben mit erstem und zweitem Versuch, Ergebnis und Fehlvorstellung; dem Kind bleibt eine solche Fehlerliste erspart. Beim Lernziel zeigt eine Liste, worauf es aufbaut; dafür bekommen die übrigen 50 von 85 Lernzielen ihre Voraussetzungen in den Erzeugern. Kinder bekommen keinen Graphen, die Regionskarte mit Nebel und Brücke reicht.

**Verworfen.** Audio- oder Skizzen-Erklärungen (keine verlässlichen Mikrofone, Dateien mit Stimmen im Klassenordner, keine Zeit zum Anhören), E-Portfolio (ohne Freitext kaum eigene Artefakte), Wissensgraph für Kinder, Kompetenzprofil für Kinder vor genügend Daten, Liste offener Fehler für Kinder.

## Consequences

- Bau in zwei Versionen: 0.12 mit den vorhandenen Daten (Versuchsverlauf, Heatmap nach Fehlvorstellung, Hilfebedarf, Diskrepanz-Filter, gefestigt), 0.13 mit Arbeit am Pool (Kompetenzen und Kompetenzprofil, Kindersätze und Aha-Momente, Voraussetzungen und „baut auf“).
- Der Pool bekommt je Aufgabe `kompetenz` und je Fehlvorstellung einen Kindersatz; beides nur in den Erzeugern unter tools/, Nils liest es in der Übersicht gegen.
- Überwunden, Hilfebedarf, Diskrepanz und gefestigt werden aus dem Versuchsprotokoll berechnet, der Speicherstand braucht dafür nur die bereits gesehenen Aha-Momente und Sätze.
