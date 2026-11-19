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

Die Startseite ist der Schlossgarten: oben die Etappe (das Kapitel, an dem gerade gearbeitet wird, wie viele Meilensteine gemeistert sind, und ein Knopf direkt zur nächsten Aufgabe), darunter ein Gartentor je Kapitel, das die Lehrkraft freigegeben hat (ADR 0022); nicht freigegebene Tore fehlen ganz. Hinter jedem Tor liegt die Regionskarte mit einem Weg. Am Meilenstein wählt der Schüler, um welche Krone er spielt (Silber G, Gold M, Purpur E; die Kronen tragen ein bis vier Edelsteine, damit man sie auch ohne Farbe unterscheidet). Bronze (F) steht nicht zur Wahl: Kommt ein Kind auf Silber bei einem Lernziel nicht weiter, übt es von selbst drei Aufgaben zur Grundlage und kehrt dann zurück (Grundlagen-Schleife, ADR 0015). Meilensteine zeigen ihren Zustand: Wegstein, Kompassnadel (begonnen), Krone in der erreichten Farbe, Schloss (gesperrt). Gemeistert ist ein Meilenstein erst mit der Krone des Zielniveaus. Schüler sehen nie F, G, M, E, nur Kronenfarben; die Lehrkraft sieht nur die Niveaustufen. Jeder Meilenstein hat einen Merkzettel mit Regeln, Beispiel und Hinweis fürs Heft. Nach dem ersten Fehlversuch öffnet sich der Tipp von selbst; Fehlversuch und Tipp kosten keine Münzen.

Lernpsychologische Ergänzungen (ADR 0014, Version 0.5): Auf der Startseite erscheint etwa 2, 7 und 21 Tage nach einem Siegel ein freiwilliger **Rückblick** mit drei bis fünf gemischten Aufgaben (höchstens einer am Tag; ein Fehler nimmt kein Siegel weg, das Lernziel gilt dann für die Lehrkraft als „aufzufrischen“). Die Regionskarte liegt im **Nebel**, den jeder gemeisterte Meilenstein lichtet. Hat die Lehrkraft eine **Expedition** gestartet, zeigt die Startseite den Stand der Klasse und den eigenen Beitrag. Seit Version 0.6 trägt jede gelöste Aufgabe ab Gold einen **Heftcode** (H1, H2, …); etwa jede achte fragt der **Heftcheck** nach einem Ergebnis aus dem Heft. Hat die Lehrkraft die **Sicherheitsangabe** eingeschaltet, gibt es beim ersten Versuch die Knöpfe „ich bin sicher“ und „ich bin unsicher“. Seit Version 0.7 bietet die Regionskarte vor der ersten Aufgabe eines Kapitels einen **Einstiegscheck** an (sechs bis acht Aufgaben, Vorschlag für die Kronenwahl, keine Münzen und Siegel; die Lehrkraft kann ihn je Kapitel zur Pflicht machen). Wird ein Lernziel wackelig, schlägt das Dashboard eine **Brücke** vor: drei Aufgaben zu einer Voraussetzung, eine Krone tiefer. Die Voraussetzungen stehen im Erzeuger `tools/jahresplan-klasse-5.mjs`. Seit Version 0.8 gibt es in Kapitel 4 den Meilenstein „Kopfrechnen“ mit dem kleinen Einmaleins (`tools/einmaleins-5-4-1.mjs`); er ist die Basis-Brücke für das schriftliche Dividieren. Seit Version 0.9 sind alle Aufgaben neu abgestuft (G Hauptschulabschluss, M Realschulabschluss, E Zugabe, F Grundlage), viele haben ein schematisches Bild, und der Prüfer rechnet jede Aufgabe unabhängig nach. Seit Version 0.10 ist Kapitel 4 vollständig; Malkreuz und Zahlenmauer sind Aufgabenformate, in deren Felder und Steine direkt eingetragen wird. Seit Version 0.14 (ADR 0018) lösen die Schüler Münzen im **Wappenschrank** ein (je Klassenstufe ein neuer Wappenbereich, in Klasse 5 zwölf Farben und zwanzig Zeichen, ein Hauptzeichen und zwei Beizeichen, vier **Ehrenzeichen** nur zum Verdienen, zwölf Ränge über sechs Schuljahre) und unter „Spiele“ für die **Rechenpause** (Kopfrechen-Sprint) oder ein **Belohnungsspiel** (Botenritt, Burgmauer; `src/schueler/spiele.js`) mit wöchentlicher **Bestenliste** unter Wappen und Beinamen; wann Spiele gehen, stellt die Lehrkraft mit der **Spielfreigabe** ein. Seit Version 0.19 (ADR 0023, seit 0.20 vereinfacht) tragen die fünf Besten des Schuljahrs nach Kronen und Siegeln einen **Hoftitel** mit Symbol (Klassenkönig, Herzog, Graf, Ritter, Knappe), den nur sie selbst in ihrer Kopfzeile sehen; die Lehrkraft sieht alle Titel mit Namen im Lernstand und kann sie je Klasse abschalten. Seit Version 0.17 (ADR 0021) kann die Lehrkraft einem Schüler einen **Sonderauftrag** schicken: drei bis fünf Aufgaben zu einem Lernziel als Brief des Königs, der nach dem Ergebnis der laufenden Aufgabe hereingleitet; sind alle bearbeitet, gibt es Münzen dazu (seit 0.27 stellt die Lehrkraft unter Klasse › Unterricht 50 bis 1000 ein, Standard 100, ADR 0027), und es geht zurück an die Stelle davor. Seit 0.27 kann der Administrator einem Schüler in der Schülerliste der Klasse eine **Münzgabe** schicken, die als Brief „Eine Gabe des Königs“ ankommt. Seit Version 0.13 sammelt das Wappen die **Aha-Momente**: Fehler, die das Kind gemacht und danach überwunden hat. Seit Version 0.12 (ADR 0017) sagt das Ergebnis Bescheid, wenn ein Kind bei einem Lernziel zum ersten Mal ohne Beispiel und Lösungsschritt auskommt oder unsicher war und trotzdem recht hatte, und am Meilenstein steht „gefestigt“, wenn ein Siegel mehr als eine Woche später noch hält. Seit Version 0.11 (ADR 0016) ist die Aufgabe im **Fokus-Modus** (schmale Kopfzeile, Hilfekärtchen unter dem Eingabefeld, Enter prüft und führt weiter), die Aufgaben kommen in **Wegstücken** zu fünf mit einem **Seitenblick** auf ein besiegeltes Lernziel, und nach jedem vierten Wegstück am Tag schlägt das Dashboard eine **Rast** vor.

Ohne Klassendatei sind alle Kapitel offen, das Zielniveau ist M, und jeder Code mit passender Klasse wird angenommen. Sobald die Startdatei aus dem Lehrer-Dashboard stammt, ist eine gültig signierte Klassendatei Pflicht.

## Lehrer-Dashboard ausprobieren

`dist/Mathekingdom-Lehrer-ohne-Netz.html` herunterladen und in Edge oder Chrome öffnen (nur zum Ausprobieren und für die Tests). Für den Unterricht bekommt jede Lehrkraft ihre Startdatei aus dem Administrator-Dashboard, siehe „Einrichtung im Schulnetz“.

- **Mit einer Beispielklasse ausprobieren** zeigt alle Ansichten mit 14 erfundenen Schülern. Nichts wird gespeichert.
- **Ordner auf dem Lehrerlaufwerk wählen** richtet den echten Betrieb ein: Dort entstehen `lehrerdaten.json` (Namenslisten, Notizen, Schlüssel) und der Ordner `backup/`. Danach eine Klasse anlegen, ihren Klassenordner wählen, Namen eintragen, Codes und PINs erzeugen, Code-Kärtchen drucken und die Startdatei für die Schülerlaufwerke herunterladen.

Vier Bereiche (beim Öffnen „Jetzt“, wenn in den letzten 10 Minuten jemand gearbeitet hat, sonst „Lernstand“):

- **Jetzt:** Akut-Zone (Hilferufe und blockierte Schüler mit Aufgabe, Fehlversuchen, gezogenen Hilfekärtchen und möglichen Lernbegleitern), Impulse (Mini-Workshop bei gehäuftem Fehler, Brücke bei wackeligem Lernziel mit offener Voraussetzung, Schnellläufer), Klassenraum als Sitzplan mit Ampel. Ein Tipp auf einen Schüler öffnet die Detailansicht über dem Sitzplan, mit „Nachricht senden“ und „Sonderauftrag schicken“ (Lernziel aus den schwächsten und ihren Voraussetzungen, Niveau F bis E, 3 bis 5 Aufgaben, Stand und Rückzug).
- **Lernstand:** Kennzahlen der Klasse, Heatmap Schüler × Lernziel mit den Zuständen gefestigt, Siegel, aufzufrischen, wackelig, begonnen und nicht begonnen, umschaltbar auf Schüler × Fehlvorstellung (aktiv oder überwunden), darüber die Filter „Braucht viel Hilfe“, „Überschätzt sich“ und „Unterschätzt sich“ (ADR 0017), gestapelte Balken je Lernziel, Selbsteinschätzung je Schüler (erste Wahl am Meilenstein gegen das erste erreichte Niveau), Vorwissen aus dem Einstiegscheck, Auffälligkeiten, Meilensteine öffnen und sperren. Ein Lernziel öffnet seine Seite (wer steht wo, häufigste typische Fehler, Lösungsquote nach Niveau, schwierigste Aufgaben), ein Name die Seite des Schülers (Siegel, Zielniveau, zuletzt aktiv, Weg über die Lernziele, AFB, Hilfekärtchen, typische Fehler mit „überwunden“, Hilfebedarf je Lernziel, Versuchsverlauf der letzten 20 Aufgaben mit erstem und zweitem Versuch, Versuchsprotokoll zugeklappt, Notiz). Die Lernziel-Seite zeigt zusätzlich den Hilfebedarf je Schüler mit Trend und die Liste „baut auf“. Lernstand und Schüler-Seite zeigen das Kompetenzprofil über die fünf prozessbezogenen Kompetenzen (seit 0.13); die Kompetenz jeder Aufgabe legt `kompetenzVon` in `tools/werkzeug.mjs` je Aufgabenmuster fest, ein Erzeuger kann sie mit `extra.kompetenz` selbst setzen.
- **Aufgaben:** Auswertung nach Anforderungsbereich, Aufgabentyp und Niveau, dazu einzelne Aufgaben: schwierigste, nie gelöste, am häufigsten gelöste, bearbeitete oder abgebrochene sowie nie bearbeitete, obwohl sie hätten drankommen können.
- **Klasse** (bis 0.21 „Verwaltung“, ADR 0025) mit drei Abschnitten: Schüler (Namensliste, Codes und PINs, Zielniveau, Code-Kärtchen, Startdatei), Unterricht (Tore als Liste Schüler × Tor, Expedition, Einstiegscheck als Pflicht je Kapitel, Sicherheitsangabe, Rast und Ton, Spiele, Bestenliste, Hoftitel) und Berichte. Backup und Betriebsprotokoll liegen im Administrator-Dashboard; nur ohne Schulverzeichnis (bis 0.20) gibt es dafür noch einen vierten Abschnitt.
- **Tafelbild:** aus dem Mini-Workshop-Impuls oder der Lernziel-Seite, Vollbild für den Beamer mit den häufigsten falschen Antworten ohne Namen.

Berichte: Klassenbericht und einseitiger Diagnosebericht je Schüler über den Druckdialog als PDF, Rohdaten als Excel-Datei mit acht Blättern.

„Wackelig“ heißt: mindestens 4 Aufgaben zum Lernziel und weniger als die Hälfte gelöst, oder zweimal das Lösungsschritt-Kärtchen. Schwellen der Ampel (in `src/lehrer/auswertung.js`): blockiert ab 3 Fehlversuchen in Folge oder 5 Minuten an einer Aufgabe, inaktiv ab 5 Minuten ohne Eingabe, im Flow ab 80 % der letzten fünf Aufgaben, lässt nach, wenn die letzten zwei Wegstücke von heute je mindestens zwei von fünf Aufgaben unter dem Schnitt der Wegstücke davor liegen. Daten, die älter als 90 Minuten sind, zählen nicht zur laufenden Stunde.

Seit 0.23: Aufgabenkennung beim Schüler, Aufgabenmeldungen der Lehrkräfte, gesperrte Aufgaben (Administrator-Dashboard, Bereich Aufgaben). Seit 0.24: Nutzungsstatistik (Bereich Betrieb) sowie Auffällige Aufgaben und Auswertung je Aufgabentyp (Bereich Aufgaben), Logik in `src/gemeinsam/statistik.js`. Seit 0.30 (ADR 0028): **Testklassen** im Bereich Klassen und Lehrkräfte, mit simulierten Schülern, Vorlauf und Live-Simulation (Logik in `src/gemeinsam/simulation.js`, Takt und Dateien in `src/admin/testklasse.js`). Noch nicht gebaut: weitere Berichte.

## Einrichtung im Schulnetz (seit 0.21, ADR 0024)

Alles beginnt mit dem **Administrator-Dashboard** `dist/Mathekingdom-Admin.html`. Beim ersten Öffnen wählt der Administrator drei Ordner: einen auf seinem persönlichen Lehrerlaufwerk (für den Administrator-Schlüssel) und auf dem Schüler- und dem Lehrertauschlaufwerk jeweils den Ordner `Mathekingdom` (fehlt er, wird er angelegt). Danach: Lehrkräfte mit Kürzel anlegen, Pfade für die Hinweise eintragen (z. B. `S:\Mathekingdom`), Klassen anlegen, Lehrkräfte zuordnen, Namen eintragen, Code-Kärtchen drucken. Die Schüler-Startdatei (eine für die ganze Schule) und die Lehrer-Startdatei je Kürzel erstellt das Administrator-Dashboard. Im August legt der Administrator das neue Schuljahr an, übernimmt die Klassen (5A-K4M2 wird 6A-K4M2) und macht es zum aktuellen. Das Administrator-Dashboard hat die Bereiche Übersicht, Schule, Klassen und Lehrkräfte sowie Betrieb (Backups sichern und wiederherstellen, Betriebsprotokoll aller Klassen). Dort werden auch Klassen aufgelöst und gelöscht, Schüler und Lehrkräfte endgültig gelöscht (ADR 0025).

Schüler und Lehrkräfte wählen nur beim ersten Öffnen den Ordner `Mathekingdom`; danach merkt sich der Browser ihn. Die Klasse eines Schülers ergibt sich aus seinem Code.

## Dateien im Schulnetz

| Wo | Was |
|---|---|
| Persönliches Lehrerlaufwerk des Administrators | `mathekingdom-admin.json` (privater Schlüssel des Administrators) |
| Lehrertauschlaufwerk `Mathekingdom/` | `schulverzeichnis.json` (Kopie), `<Kürzel>/lehrer.json` (Schlüssel und Protokoll der Lehrkraft), `<Kürzel>/Mathekingdom-Lehrer.html` (ihre Startdatei), `2026-27/5a/klasse.json` (Namensliste, PINs, Einstellungen, Notizen), `2026-27/5a/backup/<Zeitpunkt>/`, `_mathekingdom/lehrer-kopie.txt` (Kopie für Tage ohne Internet) |
| Schülertauschlaufwerk `Mathekingdom/` | `schulverzeichnis.json` (vom Administrator unterschrieben: Schuljahr, Klassen, Lehrkräfte und ihre Schlüssel), `Mathekingdom.html` (zum Kopieren), `_mathekingdom/schueler-kopie.txt` (Kopie für Tage ohne Internet), `2026-27/5a/5A-K4M2.json` (ein Speicherstand pro Schüler), `2026-27/5a/klassendatei.json`, `2026-27/5a/_mathekingdom/klasse-5.json` |
| Schülerlaufwerk | `Mathekingdom.html` (Startdatei, enthält den öffentlichen Schlüssel des Administrators) |

Die Startdateien laden ihr Dashboard von GitHub Pages (`dist/schueler.js`, `dist/lehrer.js`, `dist/admin.js`). Dafür muss das Repository öffentlich und Pages für den Branch `main` eingeschaltet sein; die Adresse steht in `tools/baue.mjs`. Die Dateien von Version 0.20 (`dist/schueler-dashboard.js`, `dist/lehrer-paket.js` und ihre Startdateien) bleiben eingefroren liegen, damit alte Startdateien bis zum Umzug weiterlaufen.

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

Quelltext des Schüler-Dashboards: `src/schueler/` (`logik.js` Regeln, `speicher.js` Dateizugriff, `app.js` Oberfläche, `bilder.js` Wappen, Siegel, Kronen, Regionskarte und Schlossgarten, `wappenzeichen.js` die Zeichen des Wappens, `spiele.js` die Belohnungsspiele).
Quelltext des Lehrer-Dashboards: `src/lehrer/` (`auswertung.js` Kennzahlen und Berichte, `xlsx.js` Excel-Ausgabe, `beispiel.js` Beispielklasse, `app.js` Oberfläche). Die Signatur der Klassendatei steht in `src/gemeinsam/krypto.js`.
