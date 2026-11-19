# Administrator-Dashboard, Mathekingdom-Ordner auf beiden Tauschlaufwerken und gemerkte Ordner

Schüler und Lehrkräfte mussten bei jedem Öffnen einen Ordner wählen, und die Daten einer Klasse hingen an der einzelnen Lehrkraft. Künftig beginnt alles mit einem dritten Programm, dem Administrator-Dashboard. Ein Administrator wählt einmal den Ordner `Mathekingdom` auf dem Schülertauschlaufwerk und auf dem Lehrertauschlaufwerk. Er legt Schuljahre (`2026-27`), Klassen und Lehrkräfte (Kürzel) an, ordnet einer Klasse eine oder mehrere Lehrkräfte zu, wechselt im August das Schuljahr und übernimmt Klassen ins neue Jahr (5A-K4M2 wird 6A-K4M2). Er erstellt auch die Startdateien. Er hat alle Rechte und sieht auch Namen und Lernstände, diese über das Lehrer-Dashboard.

Aufbau:

- Schülertauschlaufwerk `Mathekingdom/`: `schulverzeichnis.json`, `_mathekingdom/` (Kopien für Tage ohne Internet), `2026-27/5a/` (Speicherstände, Klassendatei).
- Lehrertauschlaufwerk `Mathekingdom/`: `schulverzeichnis.json` (Kopie), `<Kürzel>/lehrer.json` (Schlüssel und Betriebsprotokoll der Lehrkraft), `2026-27/5a/klasse.json` (Namensliste, PINs, Einstellungen, Notizen der Klasse) und `2026-27/5a/backup/`.
- Persönliches Lehrerlaufwerk des Administrators: `mathekingdom-admin.json` mit dem privaten Schlüssel des Administrators.

Vertrauen läuft über eine Kette. In jeder Startdatei steckt nur der öffentliche Schlüssel des Administrators. Er unterschreibt das Schulverzeichnis: aktuelles Schuljahr, Klassen, Lehrkräfte je Klasse und deren öffentliche Schlüssel. Ein Schüler-Dashboard nimmt eine Klassendatei an, wenn eine Lehrkraft der Klasse, eine als Administrator markierte Lehrkraft oder der Administrator selbst sie unterschrieben hat. So gibt es eine einzige Schüler-Startdatei für die ganze Schule, die einen Lehrerwechsel übersteht.

Ein Browser kann einen Ordnerzugriff nicht als Text in einer Datei speichern, nur als Eintrag in seinem eigenen Profil (IndexedDB). Die Startdatei bringt deshalb nur den Pfad als Hinweis mit („Wähle S:\Mathekingdom“). Gemerkt wird der Ordner im Browser. Ob das bei wechselnden PCs hält, hängt am Schulnetz und wird mit einer Probe-Datei geprüft. Schüler wählen den Ordner `Mathekingdom`, nie den Klassenordner, damit die Wahl über den Schuljahreswechsel gilt. Die Klasse ergibt sich aus dem Code, das Schuljahr aus dem Schulverzeichnis. Fehlt der Klassenordner dort, gilt das neueste Schuljahr, in dem es ihn gibt.

Die bisherigen Online-Dateien bleiben eingefroren auf Version 0.20, bis die laufende Klasse umgezogen ist. Die neuen Startdateien laden neue Dateinamen.

## Considered Options

- Ordnerwahl weiter je Klasse und je Lehrkraft: Schüler müssten jedes Mal einen Ordner suchen, und eine Klasse mit zwei Lehrkräften ginge nicht.
- Klassendaten in den Lehrerdaten jeder Lehrkraft: zwei Lehrkräfte einer Klasse hätten zwei Namenslisten, die auseinanderlaufen.
- Schlüssel der Lehrkraft in der Startdatei (bisher): jede Klasse bräuchte eine eigene Startdatei, und jeder Lehrerwechsel hieße neu verteilen.
- Administrator-Schlüssel auf dem Lehrertauschlaufwerk: bequemer, aber jede Lehrkraft könnte dann Schulverzeichnis und Klassendateien fälschen.

## Consequences

- Wer den Administrator-Schlüssel verliert, kann das Schulverzeichnis nicht mehr ändern und muss neue Startdateien verteilen. Das Administrator-Dashboard bietet deshalb an, die Schlüsseldatei zu sichern; weitere Administratoren legen eine Kopie auf ihr eigenes Lehrerlaufwerk.
- Alle Lehrkräfte können auf dem Lehrertauschlaufwerk Namenslisten und Lehrerschlüssel anderer Lehrkräfte lesen. Das ist gewollt; Schüler haben dort keinen Zugriff.
- Haben zwei Lehrkräfte dieselbe Klasse offen, liest jedes Dashboard die Klassendaten vor einer Änderung neu und zeigt an, wer noch offen hat. Ändern beide im selben Moment dieselbe Einstellung, gilt die letzte.
- Der hintere Teil eines Schülercodes ist schulweit einmalig, damit Schüler beim Übernehmen in gemischte Klassen nicht zusammenstoßen.
