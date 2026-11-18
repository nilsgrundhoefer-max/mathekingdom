# Betriebsprotokoll im Speicherstand statt eigener Logdatei

Beim ersten Probelauf im Schulnetz am 18.11.2026 schalteten beide Startdateien still auf ihre Kopien um, weil GitHub Pages nicht eingeschaltet war. Niemand konnte sehen, warum. Nils hat deshalb entschieden, dass die Dashboards ihren Zustand festhalten: **jeden Start mit Quelle (online, Kopie, ohne Netz), Version, Herkunft der Aufgaben, Zustand der Klassendatei und Browser, dazu jedes technische Problem** (GitHub nicht erreichbar mit Grund, Speichern fehlgeschlagen und wieder in Ordnung, Klassendatei fehlt oder ungültig, Speicherstand aus der Sicherung des Browsers wiederhergestellt, Backup fehlgeschlagen). Normale Speichervorgänge kommen nicht hinein.

**Wo.** Das Schüler-Dashboard schreibt seine Einträge in den eigenen Speicherstand (Feld `betrieb`, die neuesten 50). Das Lehrer-Dashboard schreibt seine in die Lehrerdaten (Feld `protokoll`, die neuesten 200) und sammelt unter Verwaltung → Protokoll alle Einträge der Klasse. Verworfen wurde eine gemeinsame Logdatei im Klassenordner: Viele Schüler würden gleichzeitig in dieselbe Datei schreiben, genau das vermeidet ADR 0001. Eine eigene Logdatei je Schüler hätte die Zahl der Dateien im Klassenordner verdoppelt, ohne etwas zu gewinnen.

**Weitergabe.** Die Textdatei aus „Protokoll als Textdatei speichern“ nennt Schüler nur mit Code, damit sie an die Schul-IT gehen kann, ohne Namen preiszugeben.

## Consequences

- Ein Speicherfehler wird nur beim Wechsel notiert („fehlgeschlagen“, „klappt wieder“), nicht bei jedem neuen Versuch alle 10 Sekunden. Die Einträge erreichen den Klassenordner erst, wenn das Speichern wieder klappt; bis dahin liegen sie in der Sicherung des Browsers.
- Den Grund, warum GitHub nicht erreichbar war, kennt nur die Startdatei. Startdateien, die vor Version 0.3 heruntergeladen wurden, melden deshalb nur „GitHub nicht erreichbar“ ohne Einzelheiten.
