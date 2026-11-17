# Schüler-Dashboard über eine Startdatei laden

Auf jedem Schülerlaufwerk liegt nur eine kleine Startdatei, die sich nie ändert. Sie lädt das eigentliche Schüler-Dashboard von GitHub Pages und greift auf eine Kopie im Klassenordner zurück, wenn GitHub nicht erreichbar ist. So kommen Verbesserungen bei allen Schülern gleichzeitig an, ohne dass die Lehrkraft Dateien auf viele Schülerlaufwerke verteilen muss.

## Considered Options

- Kopie des Dashboards auf jedem Schülerlaufwerk: jede Änderung müsste auf alle Laufwerke verteilt werden, Versionen laufen auseinander.
- Eine gemeinsame Dashboard-Datei im Klassenordner: Schüler haben dort Schreibrechte und könnten sie verändern.
