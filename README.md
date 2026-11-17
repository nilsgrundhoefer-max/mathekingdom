# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz. Begriffe stehen in [CONTEXT.md](CONTEXT.md), Grundsatzentscheidungen in [docs/adr/](docs/adr/).

## Stand

| Teil | Stand |
|---|---|
| Jahresplan Klasse 5 | [docs/jahresplan-klasse-5.md](docs/jahresplan-klasse-5.md) |
| Aufgabenpool Klasse 5 | Pilot: Subtrahieren (3.3) und Dividieren (4.5), [Übersicht](docs/aufgaben-klasse-5-pilot.md), [Aufbau](docs/aufgabenpool-format.md) |
| Schüler-Dashboard | erste Version, siehe unten |
| Lehrer-Dashboard | noch nicht begonnen |

## Schüler-Dashboard ausprobieren

`dist/Schueler-Dashboard-komplett.html` herunterladen und in Edge oder Chrome öffnen. Einen Schülercode wie `5A-K4M2` eingeben.

- **Ohne Ordner ausprobieren** speichert nur im Browser.
- **Klassenordner wählen** speichert wie im Unterricht: Der Ordner muss wie die Klasse heißen (`5a`). Darin entsteht der Speicherstand `5A-K4M2.json`.

Was die erste Version noch nicht kann, weil das Lehrer-Dashboard fehlt:

- Die Klassendatei wird gelesen (aktuelles Kapitel, Zielniveaus, Spielpause, Antworten auf Hilferufe, Liste gültiger Codes), ihre Signatur aber noch nicht geprüft.
- Ohne Klassendatei sind alle Kapitel offen, das Zielniveau ist G, und jeder Code mit passender Klasse wird angenommen.

## Dateien im Schulnetz

| Wo | Was |
|---|---|
| Schülerlaufwerk | `Mathekingdom.html` (Startdatei, ändert sich nie) |
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
