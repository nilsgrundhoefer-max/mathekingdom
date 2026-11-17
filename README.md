# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz. Begriffe stehen in [CONTEXT.md](CONTEXT.md), Grundsatzentscheidungen in [docs/adr/](docs/adr/).

## Stand

| Teil | Stand |
|---|---|
| Jahresplan Klasse 5 | [docs/jahresplan-klasse-5.md](docs/jahresplan-klasse-5.md) |
| Aufgabenpool Klasse 5 | Pilot: Subtrahieren (3.3) und Dividieren (4.5), [Übersicht](docs/aufgaben-klasse-5-pilot.md), [Aufbau](docs/aufgabenpool-format.md) |
| Schüler-Dashboard | erste Version, siehe unten |
| Lehrer-Dashboard | erste Version, siehe unten |

## Schüler-Dashboard ausprobieren

`dist/Schueler-Dashboard-komplett.html` herunterladen und in Edge oder Chrome öffnen. Einen Schülercode wie `5A-K4M2` eingeben.

- **Ohne Ordner ausprobieren** speichert nur im Browser.
- **Klassenordner wählen** speichert wie im Unterricht: Der Ordner muss wie die Klasse heißen (`5a`). Darin entsteht der Speicherstand `5A-K4M2.json`.

Ohne Klassendatei sind alle Kapitel offen, das Zielniveau ist G, und jeder Code mit passender Klasse wird angenommen. Sobald die Startdatei aus dem Lehrer-Dashboard stammt, ist eine gültig signierte Klassendatei Pflicht.

## Lehrer-Dashboard ausprobieren

`dist/Lehrer-Dashboard.html` herunterladen und in Edge oder Chrome öffnen.

- **Mit einer Beispielklasse ausprobieren** zeigt alle Ansichten mit 14 erfundenen Schülern. Nichts wird gespeichert.
- **Ordner auf dem Lehrerlaufwerk wählen** richtet den echten Betrieb ein: Dort entstehen `lehrerdaten.json` (Namenslisten, Notizen, Schlüssel) und der Ordner `backup/`. Danach eine Klasse anlegen, ihren Klassenordner wählen, Namen eintragen, Codes erzeugen, Code-Kärtchen drucken und die Startdatei für die Schülerlaufwerke herunterladen.

Ansichten: Live (Hilfe-Warteschlange, Lernstand, Hinweise), Diagnose (Auffälligkeiten, Lernzielmatrix, Lernziele im Vergleich, typische Fehler, schwierige Aufgaben, Hilfen), Einzelne Schüler, Klasse und Codes, Backup. Berichte: Klassenbericht und Einzelbericht über den Druckdialog als PDF, Rohdaten als Excel-Datei mit fünf Blättern.

Noch nicht gebaut: Schuljahreswechsel, weitere Berichte, Aufgabenformate Zahlenstrahl, Diagramm und Tabelle.

## Dateien im Schulnetz

| Wo | Was |
|---|---|
| Lehrer-PC | `Lehrer-Dashboard.html` |
| Lehrerlaufwerk | `lehrerdaten.json`, `backup/<Klasse>/<Zeitpunkt>/` |
| Schülerlaufwerk | `Mathekingdom.html` (Startdatei aus dem Lehrer-Dashboard, enthält den öffentlichen Schlüssel der Lehrkraft) |
| Klassenordner `5a/` | `5A-K4M2.json` (ein Speicherstand pro Schüler), `klassendatei.json` |
| Klassenordner `5a/_mathekingdom/` | `schueler-dashboard.js`, `klasse-5.json`: Kopien für den Fall, dass das Internet fehlt |

Die Startdatei lädt das Dashboard von GitHub Pages. Dafür muss Pages für dieses Repository eingeschaltet sein; die Adresse steht in `tools/baue.mjs`.

## Entwickeln

```
npm install
npm run pool     # Aufgabenpool erzeugen, prüfen, Übersicht schreiben
npm test         # Auswertungslogik testen
npm run build    # dist/ bauen
NODE_PATH=<Pfad zu Playwright> node tests/browser.mjs   # Dashboard im Browser durchfahren
```

Quelltext des Schüler-Dashboards: `src/schueler/` (`logik.js` Regeln, `speicher.js` Dateizugriff, `app.js` Oberfläche, `bilder.js` Lok und Metrokarte).
Quelltext des Lehrer-Dashboards: `src/lehrer/` (`auswertung.js` Kennzahlen und Berichte, `xlsx.js` Excel-Ausgabe, `beispiel.js` Beispielklasse, `app.js` Oberfläche). Die Signatur der Klassendatei steht in `src/gemeinsam/krypto.js`.
