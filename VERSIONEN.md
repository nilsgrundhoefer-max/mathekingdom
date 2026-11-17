# Versionen

Gemeinsames Versionslog für das Schüler-Dashboard (`Mathekingdom.html`) und das Lehrer-Dashboard (`Mathekingdom-Lehrer.html`). Beide tragen dieselbe Nummer, weil das Lehrer-Dashboard die Klassendatei schreibt, die das Schüler-Dashboard liest.

Die erste Ziffer steigt nur, wenn alte Speicherstände oder Klassendateien nicht mehr passen. Sonst steigt die zweite.

Die oberste Version gilt. `npm run build` liest Nummer, Datum und Punkte von hier und zeigt sie in beiden Dashboards unten in der Ecke an. Aufbau eines Eintrags: Überschrift `## <Nummer> vom <TT.MM.JJJJ>`, darunter die Abschnitte `### Schüler` und `### Lehrkraft` mit je einer Liste.

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
