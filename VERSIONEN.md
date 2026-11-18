# Versionen

Gemeinsames Versionslog für das Schüler-Dashboard (`Mathekingdom.html`) und das Lehrer-Dashboard (`Mathekingdom-Lehrer.html`). Beide tragen dieselbe Nummer, weil das Lehrer-Dashboard die Klassendatei schreibt, die das Schüler-Dashboard liest.

Die erste Ziffer steigt nur, wenn alte Speicherstände oder Klassendateien nicht mehr passen. Sonst steigt die zweite.

Die oberste Version gilt. `npm run build` liest Nummer, Datum und Punkte von hier und zeigt sie in beiden Dashboards unten in der Ecke an. Aufbau eines Eintrags: Überschrift `## <Nummer> vom <TT.MM.JJJJ>`, darunter die Abschnitte `### Schüler` und `### Lehrkraft` mit je einer Liste.

## 0.7 vom 18.11.2026

### Schüler

- Einstiegscheck: Bevor du in einem Kapitel die erste Aufgabe bearbeitest, bietet dir die Regionskarte sechs bis acht Aufgaben aus allen Meilensteinen an, je ein Versuch, ohne Hilfekärtchen. Danach bekommst du einen Vorschlag, um welche Krone du spielen könntest. Es gibt dabei keine Münzen und keine Siegel, und meistens darfst du ihn überspringen.
- Brücke: Wird ein Lernziel wackelig, schlägt dir das Dashboard drei kurze Aufgaben zu einem Lernziel vor, das du dafür brauchst, eine Krone tiefer. Danach geht es zurück zu deinem Lernziel. Die Brücke ist freiwillig.

### Lehrkraft

- Einstiegscheck: unter Verwaltung je Kapitel als Pflicht einstellbar. Im Lernstand zeigt die neue Karte „Vorwissen aus dem Einstiegscheck“, wie viele ihn gemacht oder übersprungen haben, welche Kronen vorgeschlagen wurden und wie gut jeder Meilenstein schon sitzt.
- Brücken-Impuls: Ist ein Schüler in der laufenden Stunde bei einem Lernziel wackelig und eine Voraussetzung sitzt noch nicht, steht das unter „Impulse“, mit dem Hinweis, ob die Brücke schon gegangen wurde.
- Aufgaben aus dem Einstiegscheck zählen für kein Lernziel: Ein Lernziel wird dadurch nicht „begonnen“ oder „wackelig“.

## 0.6 vom 18.11.2026

### Schüler

- Heftcode: Unter jeder gelösten Aufgabe auf Gold oder Purpur steht ein kurzer Code wie „H7“. Schreib ihn mit deinem Ergebnis ins Heft.
- Heftcheck: Ungefähr nach jeder achten solchen Aufgabe fragt dich das Dashboard, was du bei einem Heftcode herausbekommen hast. Passt deine Antwort nicht, löst du die Aufgabe noch einmal. Münzen verlierst du dabei nicht.
- Wenn deine Lehrkraft es einschaltet: Beim ersten Versuch prüfst du mit „ich bin sicher“ oder „ich bin unsicher“. Warst du sicher und es stimmt nicht, bekommst du einen deutlichen Hinweis zum Hinschauen.

### Lehrkraft

- Sicherheitsangabe als Probe: unter Verwaltung pro Klasse einschalten. Im Lernstand zeigt die neue Karte „Heftcheck und Sicherheitsangabe“ eine Vierfeldertafel (sicher/unsicher × richtig/falsch), die häufigsten Fehler bei „sicher falsch“ und wer am häufigsten sicher falsch lag.
- Heftcheck: Quote der Klasse und Schüler unter 70 % in derselben Karte, auf der Schülerseite „Heftcheck x von y richtig“.
- Tafelbild: Aus dem Mini-Workshop-Impuls oder bei den schwierigsten Aufgaben eines Lernziels öffnet „Tafelbild“ eine Vollbild-Ansicht für den Beamer: Aufgabe, häufigste falsche Antworten der Klasse, Lösung auf Knopfdruck, ohne Namen und Codes. Schließen mit Esc.

## 0.5 vom 18.11.2026

### Schüler

- Rückblick: Ein paar Tage und Wochen nach einem Siegel erscheint auf der Startseite ein kurzer Rückblick mit gemischten Aufgaben zu Lernzielen, die du schon geschafft hast. Er ist freiwillig, kommt höchstens einmal am Tag und bringt die normalen Münzen. Deine Siegel behältst du in jedem Fall.
- Nebel auf der Regionskarte: Am Anfang liegt die Region im Nebel. Jeder gemeisterte Meilenstein lichtet ihn und zeigt dir ein Stück Landschaft.
- Expedition: Hat deine Lehrkraft eine Expedition gestartet, sammelt die ganze Klasse gemeinsam Expeditionszeichen, für jedes neue Siegel und jeden Rückblick. Du siehst den Stand der Klasse und deinen eigenen Beitrag. Ist das Ziel erreicht, bekommen alle die Belohnung, zum Beispiel die Expeditionsfahne fürs Wappen.

### Lehrkraft

- Neue Karte „Expedition“ in der Verwaltung: Ziel, Enddatum und Belohnung (Expeditionsfahne oder Spielpause) festlegen. Du siehst den Stand der Klasse und die Beiträge aller Schüler, die Schüler nur den Stand der Klasse und ihren eigenen.
- Neuer Lernzielstand „aufzufrischen“ (↻) in Heatmap, Balken und Lernziel-Seite: Der Schüler hat das Siegel, hat das Lernziel aber im Rückblick falsch gelöst. Das Siegel bleibt, das Lernziel kommt beim nächsten Rückblick wieder.
- Rückblick-Aufgaben stehen im Versuchsprotokoll und zählen nicht zur Selbsteinschätzung.
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
