# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz. Begriffe stehen in [CONTEXT.md](CONTEXT.md), Grundsatzentscheidungen in [docs/adr/](docs/adr/).

## Stand

| Teil | Stand |
|---|---|
| Jahresplan Klasse 5 | [docs/jahresplan-klasse-5.md](docs/jahresplan-klasse-5.md) |
| Aufgabenpool Klasse 5 | Kapitel 3 Addieren und Subtrahieren vollständig (3.1 bis 3.5) und Dividieren (4.5), 552 Aufgaben, [Übersicht](docs/aufgaben-klasse-5-pilot.md), [Aufbau](docs/aufgabenpool-format.md) |
| Schüler-Dashboard | erste Version, siehe unten |
| Lehrer-Dashboard | erste Version, siehe unten |

## Schüler-Dashboard ausprobieren

`dist/Schueler-Dashboard-komplett.html` herunterladen und in Edge oder Chrome öffnen. Einen Schülercode wie `5A-K4M2` eingeben. Die PIN wird nur verlangt, wenn die Klasse im Lehrer-Dashboard eingerichtet ist.

- **Ohne Ordner ausprobieren** speichert nur im Browser.
- **Klassenordner wählen** speichert wie im Unterricht: Der Ordner muss wie die Klasse heißen (`5a`). Darin entsteht der Speicherstand `5A-K4M2.json`.

Die Startseite zeigt oben die Etappe: das Kapitel, an dem gerade gearbeitet wird, wie viele Stationen geschafft sind, und einen Knopf, der direkt zur nächsten Aufgabe führt. Auf der Metrokarte ist die Station markiert, an der es weitergeht. Jede Station hat einen Merkzettel mit Regeln, Beispiel und Hinweis fürs Heft. Er ist frei und kostet keine Münzen.

Ohne Klassendatei sind alle Kapitel offen, das Zielniveau ist M, und jeder Code mit passender Klasse wird angenommen. Sobald die Startdatei aus dem Lehrer-Dashboard stammt, ist eine gültig signierte Klassendatei Pflicht.

## Lehrer-Dashboard ausprobieren

`dist/Lehrer-Dashboard.html` herunterladen und in Edge oder Chrome öffnen.

- **Mit einer Beispielklasse ausprobieren** zeigt alle Ansichten mit 14 erfundenen Schülern. Nichts wird gespeichert.
- **Ordner auf dem Lehrerlaufwerk wählen** richtet den echten Betrieb ein: Dort entstehen `lehrerdaten.json` (Namenslisten, Notizen, Schlüssel) und der Ordner `backup/`. Danach eine Klasse anlegen, ihren Klassenordner wählen, Namen eintragen, Codes und PINs erzeugen, Code-Kärtchen drucken und die Startdatei für die Schülerlaufwerke herunterladen.

Ansichten:

- **Live:** Akut-Zone (Hilferufe und blockierte Schüler mit Aufgabe, Fehlversuchen, gezogenen Hilfekärtchen und möglichen Lernbegleitern), Impulse (Mini-Workshop bei gehäuftem Fehler, Schnellläufer), Klassenraum als Sitzplan mit Ampel, Lernstand als Tabelle. Ein Tipp auf einen Schüler öffnet die Detailansicht über dem Sitzplan.
- **Lernpfad:** Stationen für einzelne Schüler, die ganze Klasse oder ein Zielniveau sperren und öffnen.
- **Diagnose:** Auffälligkeiten, Lernzielmatrix, Lernziele im Vergleich, typische Fehler, Aufgaben-Audit, Hilfen.
- **Einzelne Schüler:** Kennzahlen, Lösungsquote nach Anforderungsbereich (AFB I bis III), Wirkung der Hilfekärtchen, typische Fehler, Niveauverlauf, Lernziele, Versuchsprotokoll, Notiz.
- **Klasse und Codes**, **Backup**.

Der Reiter **Aufgaben** wertet die Klasse nach Anforderungsbereich, Aufgabentyp und Linie aus und listet einzelne Aufgaben: schwierigste, nie gelöste, am häufigsten gelöste, bearbeitete oder abgebrochene sowie nie bearbeitete, obwohl sie hätten drankommen können.

Berichte: Klassenbericht und einseitiger Diagnosebericht je Schüler über den Druckdialog als PDF, Rohdaten als Excel-Datei mit acht Blättern.

Schwellen der Ampel (in `src/lehrer/auswertung.js`): blockiert ab 3 Fehlversuchen in Folge oder 5 Minuten an einer Aufgabe, inaktiv ab 5 Minuten ohne Eingabe, im Flow ab 80 % der letzten fünf Aufgaben. Daten, die älter als 90 Minuten sind, zählen nicht zur laufenden Stunde.

Noch nicht gebaut: Schuljahreswechsel, weitere Berichte.

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
