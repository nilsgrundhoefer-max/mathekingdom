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
Eine einzelne zu lösende Einheit in einem Unterkapitel, mit festem Aufgabenformat, Niveaustufe und Lernziel. Jede Aufgabe ist automatisch auswertbar.
_Avoid_: Übung, Item

**Versuch**:
Eine abgegebene Antwort auf eine Aufgabe. Ein Schüler hat zwei Versuche; sind beide falsch, gilt die Aufgabe als nicht gelöst und die Lösung wird gezeigt.
_Avoid_: Eingabe, Abgabe

**Niveaustufe**:
Eine von vier Anforderungsstufen einer Aufgabe: F (Förderniveau), G (grundlegendes Niveau), M (mittleres Niveau), E (erweitertes Niveau).
_Avoid_: Schwierigkeit, Level, Sterne

**Zielniveau**:
Die Niveaustufe, auf der ein Schüler Lernziele nachweisen muss; Standard G, von der Lehrkraft pro Schüler anpassbar.
_Avoid_: Leistungsstufe, Einstufung

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
Eine überprüfbare Kompetenz, festgelegt pro Klassenstufe und Kapitel nach dem Bildungsplan 2016 Baden-Württemberg und einem Unterkapitel zugeordnet. Es ist erreicht, wenn der Schüler drei Aufgaben dazu richtig löst, davon mindestens zwei auf oder über seinem Zielniveau und ohne Lösungsschritt-Kärtchen.
_Avoid_: Kompetenz (allein), Ziel

**Training**:
Aufgaben unter dem Zielniveau eines Schülers; sie bringen weniger Münzen und schließen kein Lernziel ab.
_Avoid_: Übungsmodus

## Belohnung

**Münze**:
Die ausgebbare Währung für richtig gelöste Aufgaben; höhere Niveaustufen bringen mehr, Training weniger.
_Avoid_: Punkte, Coins, Taler

**Stern**:
Eine nicht ausgebbare Auszeichnung, genau eine pro erreichtem Lernziel.
_Avoid_: Punkte, Abzeichen

**Rang**:
Die Stufe des Lokführers (Rangierlok, Regionalzug, Express, Königszug), die sich allein aus der Zahl seiner Sterne ergibt und neue Loks und Avatar-Teile zum Kauf freischaltet.
_Avoid_: Level, Stufe

**Minispiel**:
Ein kurzes, mathematiknahes Spiel von höchstens drei Minuten, das Münzen kostet und nur während einer Spielpause spielbar ist.
_Avoid_: Belohnungsspiel, Game

**Spielpause**:
Ein von der Lehrkraft pro Klasse eingeschaltetes Zeitfenster, in dem Minispiele erlaubt sind; standardmäßig aus.
_Avoid_: Freizeit, Pause

**Lokführer**:
Die Rolle des Schülers in der Rahmenhandlung: Er erschließt mit seinem Zug der Königlichen Metro die Regionen des Reiches; jedes Kapitel ist eine Region.
_Avoid_: Held, Spieler

## Hilfe und Diagnose

**Typischer Fehler**:
Eine vorab bei der Aufgabe hinterlegte falsche Antwort samt der Fehlvorstellung, die sie verrät (z. B. „Zähler und Nenner addiert“).
_Avoid_: Fehlertyp, Distraktor

**Diagnose**:
Die Auswertung des Lernstands im Lehrer-Dashboard: was Schüler und Klasse bearbeitet haben, wo sie hängen, welche Hilfen sie nutzen und welche typischen Fehler sie machen.
_Avoid_: Statistik, Analyse

**Bericht**:
Ein Export der Diagnose als PDF oder Excel-Datei; Namen werden erst beim Export aus der Namensliste eingesetzt.
_Avoid_: Report, Ausdruck

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

**Startdatei**:
Die unveränderliche HTML-Datei auf dem Schülerlaufwerk, die das jeweils aktuelle Schüler-Dashboard lädt.
_Avoid_: Launcher, Verknüpfung

**Lehrerlaufwerk**:
Das persönliche Netzlaufwerk der Lehrkraft; nur sie hat Zugriff.
_Avoid_: Lehrer-PC (für Daten)

**Schülerlaufwerk**:
Das persönliche Netzlaufwerk eines Schülers, auf dem seine Startdatei liegt.
_Avoid_: Home-Laufwerk

**Klassenlaufwerk**:
Das gemeinsame Netzlaufwerk einer Klasse, auf das alle Schüler der Klasse schreiben dürfen.
_Avoid_: Tauschlaufwerk, Share

**Speicherstand**:
Die Datei eines einzelnen Schülers im Klassenordner, die seinen gesamten Lernstand und sein Versuchsprotokoll enthält.
_Avoid_: Spielstand, Save, Profil

**Versuchsprotokoll**:
Die lückenlose Liste aller Versuche eines Schülers im laufenden Schuljahr, Grundlage der Diagnose. Beim Schuljahreswechsel wird es in die Lehrerdaten archiviert und ein Jahr später gelöscht.
_Avoid_: Log, Verlauf

**Schuljahreswechsel**:
Der von der Lehrkraft ausgelöste Übergang in die nächste Klassenstufe; Münzen, Sterne, Rang, Avatar und erreichte Lernziele bleiben erhalten.
_Avoid_: Versetzung, Reset

**Klassenordner**:
Der Ordner einer Klasse auf dem Klassenlaufwerk, in dem die Speicherstände der Schüler liegen.
_Avoid_: Laufwerk, Share

**Klassendatei**:
Die Datei im Klassenordner, die nur die Lehrkraft schreibt und die Schüler lesen: Freigaben, aktuelles Kapitel, Zielniveaus, Antworten auf Hilferufe. Sie enthält keine Namen.
_Avoid_: Konfiguration, Einstellungen

**Lehrerdaten**:
Die Datei auf dem Lehrerlaufwerk mit allem, was nur die Lehrkraft sehen darf: Namensliste, Notizen, Diagnosen.
_Avoid_: Lehrer-Klassendatei

**Namensliste**:
Die Zuordnung von Schülercodes zu echten Namen, Teil der Lehrerdaten.
_Avoid_: Klassenliste (für die Datei)
