# Speichern per File System Access API, ein Speicherstand pro Schüler

Die Dashboards sind reine HTML-Dateien ohne Server. Sie schreiben über die File System Access API von Edge oder Chrome direkt in den Klassenordner; der Schüler erlaubt den Ordnerzugriff einmal pro Sitzung. Jeder Schüler hat eine eigene Datei, weil viele Schüler, die alle 10 Sekunden in eine gemeinsame Datei schreiben, sich gegenseitig überschreiben würden.

## Considered Options

- Kleiner Server auf dem Lehrer-PC: bräuchte Installation und Firewall-Freigabe durch die Schul-IT.
- Speichern per Download-Dialog: macht automatisches Speichern unmöglich.

## Consequences

- Firefox und Safari werden nicht unterstützt.
- „Vier Dateien“ heißt vier Dateiarten: Lehrer-Dashboard, Schüler-Dashboard, Aufgabenpool und viele Speicherstände.
