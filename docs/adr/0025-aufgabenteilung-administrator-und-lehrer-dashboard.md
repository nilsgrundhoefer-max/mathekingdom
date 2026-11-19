# Aufgabenteilung zwischen Administrator-Dashboard und Lehrer-Dashboard

Seit ADR 0024 gibt es ein Administrator-Dashboard, aber das Lehrer-Dashboard trug weiter Backup, Betriebsprotokoll und den alten Weg „Neue Klasse einrichten“. Für Kolleginnen und Kollegen war es zu voll. Die Grenze ist jetzt: Das Lehrer-Dashboard ist für den Unterricht und die Förderung einzelner Schüler, das Administrator-Dashboard für Einrichtung, Betrieb und Aufgabenpflege. Das Lehrer-Dashboard soll intuitiv und übersichtlich bleiben und trotzdem diagnostische Analysen und Fördermöglichkeiten bieten.

**Lehrer-Dashboard**, vier Bereiche: Jetzt, Lernstand, Aufgaben, Klasse. „Klasse“ ersetzt „Verwaltung“ und hat drei Abschnitte: Schüler (Namensliste, Schüler hinzufügen und entfernen, neue PIN, Zielniveau, Code-Kärtchen, Schüler-Startdatei), Unterricht (Tore, Expedition, Einstiegscheck, Sicherheitsangabe, Rast und Ton, Spiele, Bestenliste, Hoftitel) und Berichte (Klassenbericht, Excel). Schülerberichte bleiben auf der Schülerseite im Lernstand. Zwischen den eigenen Klassen wechselt man oben in der Kopfzeile. Das Dashboard sichert weiter stündlich, ohne eigene Karte. Von technischen Problemen sieht die Lehrkraft nur Warnungen, bei denen sie im Unterricht selbst handeln kann. Sie meldet fehlerhafte Aufgaben als Aufgabenmeldung. Der alte Weg ohne Schulverzeichnis entfällt, sobald 5a umgezogen ist.

**Administrator-Dashboard**, fünf Bereiche: Übersicht (was jetzt Aufmerksamkeit braucht), Schule (Schuljahr, Wechsel, Übernahme, Ordner und Pfade, Startdateien, Schlüssel sichern), Klassen und Lehrkräfte (anlegen, auflösen, löschen, zuordnen, Einblick in alle Klassen, Namen, PIN), Betrieb (Nutzungsstatistik, Betriebsprotokoll mit Filter „nur Probleme“, Backups wiederherstellen) und Aufgaben (Aufgabenmeldungen, Auffällige Aufgaben, Sperren, Export der Meldungen).

Weitere Regeln:

- Ein Schüler wird von der Lehrkraft entfernt (Speicherstand bleibt) und nur vom Administrator gelöscht (Speicherstand und Backups endgültig weg, Bestätigung durch Eintippen des Codes). Eine Klasse wird erst aufgelöst (aus dem Schulverzeichnis) und danach, auf Wunsch, ihre Daten gelöscht (Bestätigung durch Eintippen des Klassennamens).
- Wird eine Lehrkraft gelöscht, unterschreibt das Administrator-Dashboard die Klassendateien ihrer Klassen sofort selbst neu; ihr Ordner auf dem Lehrertauschlaufwerk wird gelöscht. Vor dem Löschen der letzten Lehrkraft einer Klasse kommt eine Warnung.
- „Einblick in alle Klassen“ öffnet im Lehrer-Dashboard jede Klasse, mehr nicht. Administrator ist nur, wer die Schlüsseldatei hat.
- Je Klasse höchstens fünf Backup-Stände: der neueste, stündlich überschrieben, und je einer der letzten vier Unterrichtstage.
- Die Nutzungsstatistik enthält keine Namen und keine Lernstände. Lernstände sieht der Administrator im Lehrer-Dashboard. Ausnahme ohne Namen: Auffällige Aufgaben über alle Klassen und eine Zusammenfassung je Aufgabentyp.
- Die Aufgabenkennung (etwa `5.3.1-K1-F-01`) steht klein und grau unten links beim Schüler und im Lehrer-Dashboard bei der Aufgabe, an der ein Schüler gerade sitzt. Es gibt keine zusätzliche Nummer.
- Eine Aufgabenmeldung hat Kennung, Art (Lösung falsch, nicht lösbar, unklar formuliert, Bild falsch) und einen Satz; Schüler melden nicht. Der Administrator setzt offen, behoben oder kein Fehler; die Lehrkraft sieht den Stand. Behoben wird im Erzeuger im Repo, dafür exportiert das Administrator-Dashboard die offenen Meldungen als Text.
- Der Administrator kann eine Aufgabe schulweit sperren (im Schulverzeichnis). Schüler bekommen dann eine andere Aufgabe desselben Lernziels und Niveaus, Fehlversuche an ihr zählen nicht.

Gebaut wird in drei Versionen: 0.22 Abgrenzung, 0.23 Aufgabenkennung, Aufgabenmeldungen und Sperren, 0.24 Nutzungsstatistik und Auffällige Aufgaben.

## Considered Options

- Lernstände auch im Administrator-Dashboard: die Heatmap und alle Diagnosen gäbe es doppelt; das Lehrer-Dashboard mit Einblick in alle Klassen reicht.
- Neue sechsstellige Aufgabennummer: die vorhandene Kennung ist schon eindeutig, und die Speicherstände hängen an ihr.
- Schüler melden Aufgaben selbst: die Liste liefe mit „ich weiß es nicht“ voll.
- Nur die letzten fünf stündlichen Backups: der Rückweg reichte nur fünf Unterrichtsstunden zurück.
- Aufgaben im Administrator-Dashboard bearbeiten: der Pool entsteht in den Erzeugern und kommt über GitHub; ein Editor wäre ein eigenes, großes Vorhaben.

## Consequences

- Wer kein Administrator ist, kann keine Backups wiederherstellen; im Notfall muss ein Administrator erreichbar sein.
- Backups entstehen nur, solange ein Lehrer- oder Administrator-Dashboard offen ist.
- Die Ablage braucht eine Funktion zum Löschen von Dateien und Ordnern.
