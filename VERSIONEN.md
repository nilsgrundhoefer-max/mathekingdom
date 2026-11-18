# Versionen

Gemeinsames Versionslog für das Schüler-Dashboard (`Mathekingdom.html`) und das Lehrer-Dashboard (`Mathekingdom-Lehrer.html`). Beide tragen dieselbe Nummer, weil das Lehrer-Dashboard die Klassendatei schreibt, die das Schüler-Dashboard liest.

Die erste Ziffer steigt nur, wenn alte Speicherstände oder Klassendateien nicht mehr passen. Sonst steigt die zweite.

Die oberste Version gilt. `npm run build` liest Nummer, Datum und Punkte von hier und zeigt sie in beiden Dashboards unten in der Ecke an. Aufbau eines Eintrags: Überschrift `## <Nummer> vom <TT.MM.JJJJ>`, darunter die Abschnitte `### Schüler` und `### Lehrkraft` mit je einer Liste.

## 0.4 vom 18.11.2026

### Schüler

- Keine Änderungen.

### Lehrkraft

- Die Meldung „Klassendatei wurde von außen verändert“ kam im Schulnetz regelmäßig, obwohl niemand die Datei angefasst hatte: Das Dashboard hatte sich beim Schreiben selbst überholt. Jetzt laufen alle Schreibvorgänge nacheinander, und gewarnt wird nur noch, wenn die Unterschrift der Datei nicht passt oder sie fehlt.
- Sind zwei Lehrer-Dashboards für dieselbe Klasse offen, etwa in zwei Tabs oder an zwei PCs, erscheint einmal ein Hinweis, weil sie sich sonst gegenseitig überschreiben.

## 0.3 vom 18.11.2026

### Schüler

- Im Hintergrund wird jetzt festgehalten, ob das Dashboard richtig geladen wurde und ob das Speichern klappt. Für dich ändert sich nichts.

### Lehrkraft

- Neues Protokoll unter Verwaltung: Jeder Start eines Dashboards steht dort mit Quelle (online von GitHub, Kopie oder Datei ohne Netz), Version und Browser, dazu jedes technische Problem, etwa GitHub nicht erreichbar, Speichern fehlgeschlagen, Klassendatei verändert oder Backup fehlgeschlagen.
- „Nur Probleme“ blendet die normalen Starts aus. „Protokoll als Textdatei speichern“ gibt alles zum Weitergeben aus, zum Beispiel an die Schul-IT; Schüler stehen darin nur mit Code.
- Ist GitHub nicht erreichbar, nennt die Lehrer-Startdatei jetzt den Grund, zum Beispiel „GitHub antwortet 404“.
- Damit auch die Schüler-Startdatei den Grund nennt, lade sie unter Verwaltung neu herunter und lege sie auf die Schülerlaufwerke. Die alte Startdatei funktioniert weiter.

## 0.2 vom 18.11.2026

### Schüler

- Die Regionskarte hat nur noch einen Weg. Statt die Straße zu wechseln, wählst du am Meilenstein, um welche Krone du spielst: Bronze, Silber, Gold oder Purpur.
- Jeder Meilenstein bekommt eine Krone in der Farbe, auf der du alle seine Lernziele geschafft hast. Du kannst sie später aufwerten.
- Gemeistert ist ein Meilenstein erst mit der Krone deines Ziels.
- Oben stehen jetzt neben Siegeln und Münzen deine Kronen, gezählt nach Farbe.
- Beim ersten Mal siehst du, um welche Krone du gespielt hast und welche du geschafft hast.
- Das Wappen-Zeichen Krone heißt jetzt Lilie.

### Lehrkraft

- Neue Auswertung „Selbsteinschätzung“ im Lernstand: Wer schätzt sich zu niedrig, passend oder zu hoch ein?
- Neuer Impuls: Wer sich dreimal in Folge unterschätzt, dem kann man das Zielniveau anheben.
- Auf der Seite eines Schülers stehen seine Meilensteine mit erreichtem Niveau, Ziel und erster Wahl. Unter dem Ziel heißt es zum Beispiel „F erreicht, Ziel M“.
- Senkst du ein Zielniveau, bekommt der Schüler beim nächsten Öffnen die Siegel, die er damit schon verdient hat. Siegel werden nie weggenommen.
- „Niveau“ statt „Straße“ in allen Auswertungen.

## 0.1 vom 17.11.2026

### Schüler

- Mittelalterliche Landkarte: Schlossgarten mit einem Gartentor je Kapitel, Regionskarte mit vier Straßen (Feldweg, Talweg, Königsweg, Bergpfad) und Meilensteinen.
- Siegel für erreichte Lernziele, Ränge vom Wanderer bis zum Hofkartografen, eigenes Wappen.
- Fehlversuche und Tipps kosten keine Münzen. Der Tipp öffnet sich nach dem ersten Fehlversuch.
- Merkzettel und Wortspeicher an jedem Meilenstein.
- Aufgaben für Kapitel 3 (Addieren und Subtrahieren) und Dividieren (4.5).
- Die Versionsnummer steht unten rechts.

### Lehrkraft

- Lehrer-Dashboard in vier Bereichen: Jetzt, Lernstand, Aufgaben, Verwaltung.
- Schülercode mit vierstelliger PIN, signierte Klassendatei, stündliches Backup aufs Lehrerlaufwerk.
- Berichte als PDF und Rohdaten als Excel-Datei.
- Das Lehrer-Dashboard lädt sich wie das Schüler-Dashboard bei jedem Öffnen neu von GitHub und legt eine Kopie aufs Lehrerlaufwerk für Tage ohne Internet.
- Neue Dateinamen: `Mathekingdom.html` für Schüler, `Mathekingdom-Lehrer.html` für die Lehrkraft.
- Die Versionsnummer steht unten rechts. Ein Klick zeigt, was neu ist.
