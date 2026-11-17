# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz: Schüler bearbeiten Aufgaben, die Lehrkraft verfolgt den Lernstand ihrer Klassen.

## Personen und Gruppen

**Schüler**:
Ein Lernender, der über seinen Schülercode am Schüler-Dashboard angemeldet ist. Er gehört genau einer Klasse an.
_Avoid_: User, Account, Nutzer

**Schülercode**:
Ein von der Lehrkraft vergebener, nicht erratbarer Code (z. B. `7B-K4M2`), der einen Schüler anmeldet und seine Klasse festlegt. Nur die Lehrkraft kennt die Zuordnung zum echten Namen.
_Avoid_: Login, Benutzername, PIN, ID

**Lehrkraft**:
Die Person, die Klassen betreut, Freigaben erteilt und den Lernstand auswertet.
_Avoid_: Admin, Lehrer-Account

**Klasse**:
Die konkrete Lerngruppe eines Schuljahres (z. B. 7b). Sie wird beim ersten Öffnen festgelegt und ändert sich nur zum neuen Schuljahr.
_Avoid_: Kurs, Gruppe

**Klassenstufe**:
Der Jahrgang (5 bis 10), der sich aus der Klasse ergibt und bestimmt, welche Kapitel geladen werden.
_Avoid_: Jahrgangsstufe, Level

## Inhalte

**Aufgabenpool**:
Die Gesamtheit aller Aufgaben, nach Klassenstufe, Kapitel und Unterkapitel geordnet. Er enthält keine personenbezogenen Daten.
_Avoid_: Datenbank, Aufgabensammlung

**Kapitel**:
Ein Stoffgebiet einer Klassenstufe (z. B. „Brüche“).
_Avoid_: Themenbereich, Modul

**Unterkapitel**:
Ein abgegrenztes Thema innerhalb eines Kapitels (z. B. „Brüche erweitern“), das Aufgaben bündelt.
_Avoid_: Themenbereich, Lektion

**Aufgabe**:
Eine einzelne zu lösende Einheit in einem Unterkapitel, mit festem Aufgabenformat.
_Avoid_: Übung, Item

**Niveaustufe**:
Eine von vier Anforderungsstufen einer Aufgabe: F (Förderniveau), G (grundlegendes Niveau), M (mittleres Niveau), E (erweitertes Niveau).
_Avoid_: Schwierigkeit, Level, Sterne

**Jahresplan**:
Die Folge der Kapitel einer Klassenstufe über das Schuljahr; alle Kapitel bis zum aktuellen Kapitel sind freigeschaltet.
_Avoid_: Lernpfad (für diese Ebene), Stoffverteilungsplan

**Aktuelles Kapitel**:
Das Kapitel, das die Lehrkraft für eine Klasse gerade als laufendes Thema gesetzt hat.
_Avoid_: aktuelles Thema

**Lernpfad**:
Der Weg durch die Unterkapitel eines einzelnen Kapitels.
_Avoid_: Kurs, Weg, Themenbereich

**Metrokarte**:
Die Darstellung eines Lernpfads mit vier parallelen Linien (F, G, M, E), auf denen die Unterkapitel Stationen sind. Ein Niveauwechsel ist ein Umsteigen.
_Avoid_: Lernlandkarte, Fortschrittsbalken

**Station**:
Ein Unterkapitel auf der Metrokarte. Sie gilt als erreicht, wenn der Schüler die Lernziele des Unterkapitels erreicht hat.
_Avoid_: Level, Haltestelle

**Lernziel**:
Eine überprüfbare Kompetenz, festgelegt pro Klassenstufe und Kapitel und einem Unterkapitel zugeordnet. Aufgaben weisen Lernziele nach.
_Avoid_: Kompetenz (allein), Ziel

## Hilfe

**Hilfekärtchen**:
Eine von drei aufeinander aufbauenden Hilfen zu einer Aufgabe: Tipp, Beispiel, Lösungsschritt. Jede genutzte Stufe senkt die Punkte der Aufgabe.
_Avoid_: Joker, Hinweis

**Hilferuf**:
Die Bitte eines Schülers um persönliche Hilfe durch die Lehrkraft, jederzeit und unabhängig von Hilfekärtchen möglich.
_Avoid_: Meldung, Ticket

**Hilfe-Warteschlange**:
Die nach Eingang geordnete Liste offener Hilferufe einer Klasse im Lehrer-Dashboard.
_Avoid_: Queue

## Speichern

**Lehrerlaufwerk**:
Das persönliche Netzlaufwerk der Lehrkraft; nur sie hat Zugriff.
_Avoid_: Lehrer-PC (für Daten)

**Schülerlaufwerk**:
Das persönliche Netzlaufwerk eines Schülers, auf dem sein Schüler-Dashboard liegt.
_Avoid_: Home-Laufwerk

**Klassenlaufwerk**:
Das gemeinsame Netzlaufwerk einer Klasse, auf das alle Schüler der Klasse schreiben dürfen.
_Avoid_: Tauschlaufwerk, Share

**Speicherstand**:
Die Datei eines einzelnen Schülers im Klassenordner, die seinen gesamten Lernstand enthält.
_Avoid_: Spielstand, Save, Profil

**Klassenordner**:
Der Ordner einer Klasse auf dem Klassenlaufwerk, in dem die Speicherstände der Schüler liegen.
_Avoid_: Laufwerk, Share

**Klassendatei**:
Die Datei im Klassenordner, die nur die Lehrkraft schreibt und die Schüler lesen: Freigaben, aktuelles Kapitel, Antworten auf Hilferufe.
_Avoid_: Konfiguration, Einstellungen

**Namensliste**:
Die Zuordnung von Schülercodes zu echten Namen, die nur auf dem Laufwerk der Lehrkraft liegt.
_Avoid_: Klassenliste (für die Datei)
