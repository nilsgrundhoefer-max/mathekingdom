# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz. Begriffe stehen in [CONTEXT.md](CONTEXT.md), Grundsatzentscheidungen in [docs/adr/](docs/adr/). Das Setting ist eine mittelalterliche Landkarte (ADR 0010): Schlossgarten, Regionskarte mit einem Weg, Meilensteine mit Kronen (ADR 0012), Siegel, Wappen.

## Stand

| Teil | Stand |
|---|---|
| Jahresplan Klasse 5 | [docs/jahresplan-klasse-5.md](docs/jahresplan-klasse-5.md) |
| Aufgabenpool Klasse 5 | Kapitel 3 Addieren und Subtrahieren und Kapitel 4 Multiplizieren und Dividieren vollständig (3.1 bis 3.5, 4.1 bis 4.7 und Abstecher Zahlenmuster), 1056 Aufgaben, [Übersicht](docs/aufgaben-klasse-5-pilot.md), [Aufbau](docs/aufgabenpool-format.md) |
| Schüler-Dashboard | erste Version, siehe unten |
| Lehrer-Dashboard | erste Version, siehe unten |

## Schüler-Dashboard ausprobieren

`dist/Mathekingdom-ohne-Netz.html` herunterladen und in Edge oder Chrome öffnen. Einen Schülercode wie `5A-K4M2` eingeben. Die PIN wird nur verlangt, wenn die Klasse im Lehrer-Dashboard eingerichtet ist.

- **Ohne Ordner ausprobieren** speichert nur im Browser.
- **Klassenordner wählen** speichert wie im Unterricht: Der Ordner muss wie die Klasse heißen (`5a`). Darin entsteht der Speicherstand `5A-K4M2.json`.

Die Startseite ist der Schlossgarten: oben die Etappe (das Kapitel, an dem gerade gearbeitet wird, wie viele Meilensteine gemeistert sind, und ein Knopf direkt zur nächsten Aufgabe), darunter ein Gartentor je Kapitel. Hinter jedem Tor liegt die Regionskarte mit einem Weg. Am Meilenstein wählt der Schüler, um welche Krone er spielt (Silber G, Gold M, Purpur E; die Kronen tragen ein bis vier Edelsteine, damit man sie auch ohne Farbe unterscheidet). Bronze (F) steht nicht zur Wahl: Kommt ein Kind auf Silber bei einem Lernziel nicht weiter, übt es von selbst drei Aufgaben zur Grundlage und kehrt dann zurück (Grundlagen-Schleife, ADR 0015). Meilensteine zeigen ihren Zustand: Wegstein, Kompassnadel (begonnen), Krone in der erreichten Farbe, Schloss (gesperrt). Gemeistert ist ein Meilenstein erst mit der Krone des Zielniveaus. Schüler sehen nie F, G, M, E, nur Kronenfarben; die Lehrkraft sieht nur die Niveaustufen. Jeder Meilenstein hat einen Merkzettel mit Regeln, Beispiel und Hinweis fürs Heft. Nach dem ersten Fehlversuch öffnet sich der Tipp von selbst; Fehlversuch und Tipp kosten keine Münzen.

Lernpsychologische Ergänzungen (ADR 0014, Version 0.5): Auf der Startseite erscheint etwa 2, 7 und 21 Tage nach einem Siegel ein freiwilliger **Rückblick** mit drei bis fünf gemischten Aufgaben (höchstens einer am Tag; ein Fehler nimmt kein Siegel weg, das Lernziel gilt dann für die Lehrkraft als „aufzufrischen“). Die Regionskarte liegt im **Nebel**, den jeder gemeisterte Meilenstein lichtet. Hat die Lehrkraft eine **Expedition** gestartet, zeigt die Startseite den Stand der Klasse und den eigenen Beitrag. Seit Version 0.6 trägt jede gelöste Aufgabe ab Gold einen **Heftcode** (H1, H2, …); etwa jede achte fragt der **Heftcheck** nach einem Ergebnis aus dem Heft. Hat die Lehrkraft die **Sicherheitsangabe** eingeschaltet, gibt es beim ersten Versuch die Knöpfe „ich bin sicher“ und „ich bin unsicher“. Seit Version 0.7 bietet die Regionskarte vor der ersten Aufgabe eines Kapitels einen **Einstiegscheck** an (sechs bis acht Aufgaben, Vorschlag für die Kronenwahl, keine Münzen und Siegel; die Lehrkraft kann ihn je Kapitel zur Pflicht machen). Wird ein Lernziel wackelig, schlägt das Dashboard eine **Brücke** vor: drei Aufgaben zu einer Voraussetzung, eine Krone tiefer. Die Voraussetzungen stehen im Erzeuger `tools/jahresplan-klasse-5.mjs`. Seit Version 0.8 gibt es in Kapitel 4 den Meilenstein „Kopfrechnen“ mit dem kleinen Einmaleins (`tools/einmaleins-5-4-1.mjs`); er ist die Basis-Brücke für das schriftliche Dividieren. Seit Version 0.9 sind alle Aufgaben neu abgestuft (G Hauptschulabschluss, M Realschulabschluss, E Zugabe, F Grundlage), viele haben ein schematisches Bild, und der Prüfer rechnet jede Aufgabe unabhängig nach. Seit Version 0.10 ist Kapitel 4 vollständig; Malkreuz und Zahlenmauer sind Aufgabenformate, in deren Felder und Steine direkt eingetragen wird.

Ohne Klassendatei sind alle Kapitel offen, das Zielniveau ist M, und jeder Code mit passender Klasse wird angenommen. Sobald die Startdatei aus dem Lehrer-Dashboard stammt, ist eine gültig signierte Klassendatei Pflicht.

## Lehrer-Dashboard ausprobieren

`dist/Mathekingdom-Lehrer-ohne-Netz.html` herunterladen und in Edge oder Chrome öffnen. Für den Unterricht gehört stattdessen `dist/Mathekingdom-Lehrer.html` auf den Lehrer-PC: Diese Startdatei lädt bei jedem Öffnen die neueste Version und legt eine Kopie auf das Lehrerlaufwerk.

- **Mit einer Beispielklasse ausprobieren** zeigt alle Ansichten mit 14 erfundenen Schülern. Nichts wird gespeichert.
- **Ordner auf dem Lehrerlaufwerk wählen** richtet den echten Betrieb ein: Dort entstehen `lehrerdaten.json` (Namenslisten, Notizen, Schlüssel) und der Ordner `backup/`. Danach eine Klasse anlegen, ihren Klassenordner wählen, Namen eintragen, Codes und PINs erzeugen, Code-Kärtchen drucken und die Startdatei für die Schülerlaufwerke herunterladen.

Vier Bereiche (beim Öffnen „Jetzt“, wenn in den letzten 10 Minuten jemand gearbeitet hat, sonst „Lernstand“):

- **Jetzt:** Akut-Zone (Hilferufe und blockierte Schüler mit Aufgabe, Fehlversuchen, gezogenen Hilfekärtchen und möglichen Lernbegleitern), Impulse (Mini-Workshop bei gehäuftem Fehler, Brücke bei wackeligem Lernziel mit offener Voraussetzung, Schnellläufer), Klassenraum als Sitzplan mit Ampel. Ein Tipp auf einen Schüler öffnet die Detailansicht über dem Sitzplan.
- **Lernstand:** Kennzahlen der Klasse, Heatmap Schüler × Lernziel mit vier Zuständen (Siegel, wackelig, begonnen, nicht begonnen), gestapelte Balken je Lernziel, Selbsteinschätzung je Schüler (erste Wahl am Meilenstein gegen das erste erreichte Niveau), Vorwissen aus dem Einstiegscheck, Auffälligkeiten, Meilensteine öffnen und sperren. Ein Lernziel öffnet seine Seite (wer steht wo, häufigste typische Fehler, Lösungsquote nach Niveau, schwierigste Aufgaben), ein Name die Seite des Schülers (Siegel, Zielniveau, zuletzt aktiv, Weg über die Lernziele, AFB, Hilfekärtchen, typische Fehler, Versuchsprotokoll zugeklappt, Notiz).
- **Aufgaben:** Auswertung nach Anforderungsbereich, Aufgabentyp und Niveau, dazu einzelne Aufgaben: schwierigste, nie gelöste, am häufigsten gelöste, bearbeitete oder abgebrochene sowie nie bearbeitete, obwohl sie hätten drankommen können.
- **Verwaltung:** Namensliste, Codes und PINs, Expedition (Ziel, Enddatum, Belohnung), Sicherheitsangabe (Probe), Einstiegscheck als Pflicht je Kapitel, Startdatei, Berichte, Backup.
- **Tafelbild:** aus dem Mini-Workshop-Impuls oder der Lernziel-Seite, Vollbild für den Beamer mit den häufigsten falschen Antworten ohne Namen.

Berichte: Klassenbericht und einseitiger Diagnosebericht je Schüler über den Druckdialog als PDF, Rohdaten als Excel-Datei mit acht Blättern.

„Wackelig“ heißt: mindestens 4 Aufgaben zum Lernziel und weniger als die Hälfte gelöst, oder zweimal das Lösungsschritt-Kärtchen. Schwellen der Ampel (in `src/lehrer/auswertung.js`): blockiert ab 3 Fehlversuchen in Folge oder 5 Minuten an einer Aufgabe, inaktiv ab 5 Minuten ohne Eingabe, im Flow ab 80 % der letzten fünf Aufgaben. Daten, die älter als 90 Minuten sind, zählen nicht zur laufenden Stunde.

Noch nicht gebaut: Schuljahreswechsel, weitere Berichte.

## Dateien im Schulnetz

| Wo | Was |
|---|---|
| Lehrer-PC | `Mathekingdom-Lehrer.html` (Startdatei der Lehrkraft, einmal aus `dist/` herunterladen) |
| Lehrerlaufwerk | `lehrerdaten.json`, `backup/<Klasse>/<Zeitpunkt>/`, `_mathekingdom/lehrer-paket.js` (Kopie des Lehrer-Dashboards für Tage ohne Internet) |
| Schülerlaufwerk | `Mathekingdom.html` (Startdatei aus dem Lehrer-Dashboard, enthält den öffentlichen Schlüssel der Lehrkraft) |
| Klassenordner `5a/` | `5A-K4M2.json` (ein Speicherstand pro Schüler), `klassendatei.json` |
| Klassenordner `5a/_mathekingdom/` | `schueler-dashboard.js`, `klasse-5.json`: Kopien für den Fall, dass das Internet fehlt |

Beide Startdateien laden ihr Dashboard von GitHub Pages (ADR 0005 und 0011). Dafür muss das Repository öffentlich und Pages für den Branch `main` eingeschaltet sein; die Adresse steht in `tools/baue.mjs`.

## Versionen

Beide Dashboards tragen dieselbe Versionsnummer und zeigen sie unten rechts an; ein Klick zeigt die Neuerungen. Das Versionslog steht in [VERSIONEN.md](VERSIONEN.md). Für eine neue Version oben einen Eintrag ergänzen, `npm run build` ausführen und per Pull Request nach `main` bringen. Mit dem Zusammenführen ist die Version veröffentlicht.

## Entwickeln

```
npm install
npm run pool     # Aufgabenpool erzeugen, prüfen, Übersicht schreiben
npm test         # Auswertungslogik testen
npm run build    # dist/ bauen
NODE_PATH=<Pfad zu Playwright> node tests/browser.mjs   # Dashboard im Browser durchfahren
```

Quelltext des Schüler-Dashboards: `src/schueler/` (`logik.js` Regeln, `speicher.js` Dateizugriff, `app.js` Oberfläche, `bilder.js` Wappen, Siegel, Kronen, Regionskarte und Schlossgarten).
Quelltext des Lehrer-Dashboards: `src/lehrer/` (`auswertung.js` Kennzahlen und Berichte, `xlsx.js` Excel-Ausgabe, `beispiel.js` Beispielklasse, `app.js` Oberfläche). Die Signatur der Klassendatei steht in `src/gemeinsam/krypto.js`.
