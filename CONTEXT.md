# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz: Schüler bearbeiten Aufgaben, die Lehrkraft verfolgt den Lernstand ihrer Klassen.

## Personen und Gruppen

**Schüler**:
Ein Lernender, der über Name und PIN am Schüler-Dashboard angemeldet ist. Er gehört genau einer Klasse an.
_Avoid_: User, Account, Nutzer

**Lehrkraft**:
Die Person, die Klassen betreut, Freigaben erteilt und den Lernstand auswertet.
_Avoid_: Admin, Lehrer-Account

**Klasse**:
Die konkrete Lerngruppe eines Schuljahres (z. B. 7b). Sie wird beim ersten Öffnen festgelegt und ändert sich nur zum neuen Schuljahr.
_Avoid_: Kurs, Gruppe

**Klassenstufe**:
Der Jahrgang (5 bis 10), der sich aus der Klasse ergibt und bestimmt, welche Kapitel geladen werden.
_Avoid_: Jahrgangsstufe, Level

**PIN**:
Ein vierstelliger Code, den die Lehrkraft vergibt und der zusammen mit dem Namen einen Schüler anmeldet.
_Avoid_: Passwort

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

**Lernpfad**:
Eine von der Lehrkraft freigegebene, geordnete Folge von Unterkapiteln, auch kapitelübergreifend.
_Avoid_: Kurs, Weg, Themenbereich

**Metrokarte**:
Die Darstellung des Lernstands, in der jeder Lernpfad eine Linie und jedes Unterkapitel eine Station ist.
_Avoid_: Lernlandkarte, Fortschrittsbalken

## Speichern

**Speicherstand**:
Die Datei eines einzelnen Schülers im Klassenordner, die seinen gesamten Lernstand enthält.
_Avoid_: Spielstand, Save, Profil

**Klassenordner**:
Der Netzwerkordner einer Klasse, auf den Schüler und Lehrkraft Zugriff haben und in dem die Speicherstände liegen.
_Avoid_: Laufwerk, Share
