# Lehrer-Dashboard über eine Startdatei laden, veröffentlicht aus einem öffentlichen `main`

Auch das Lehrer-Dashboard aktualisiert sich jetzt selbst, nach demselben Muster wie das Schüler-Dashboard (ADR 0005). Auf dem Lehrer-PC liegt nur die Startdatei `Mathekingdom-Lehrer.html`. Sie lädt bei jedem Öffnen das Lehrer-Paket (Dashboard, Aufgabenpools, Schüler-Dashboard und Schüler-Startdatei) von GitHub Pages. Das Dashboard legt davon eine Kopie in `_mathekingdom/` auf dem Lehrerlaufwerk ab, und ohne Internet startet die Startdatei diese Kopie. Die Datei `Mathekingdom-Lehrer-ohne-Netz.html` bleibt nur zum Ausprobieren und aktualisiert sich nicht.

Damit ein Browser die Dateien laden kann, ist das Repository öffentlich und GitHub Pages liest den Branch `main`. Sichtbar werden Code, Aufgaben und Dokumentation, nie Schülerdaten, die das Schulnetz nicht verlassen. `main` ist der veröffentlichte Stand: Neue Arbeit kommt per Pull Request, den die Lehrkraft freigibt, und jede Freigabe ist eine neue Version. Beide Dashboards tragen dieselbe Versionsnummer aus `VERSIONEN.md`, weil das Lehrer-Dashboard die Klassendatei schreibt, die das Schüler-Dashboard liest.

Wer das GitHub-Konto kontrolliert, kontrolliert damit den Code, der den Signaturschlüssel der Lehrkraft sieht. Für die Schülerseite galt das schon. Das Konto braucht deshalb ein starkes Passwort und Zwei-Faktor-Anmeldung.

## Considered Options

- Vollständige Datei, die beim Öffnen online nach einer neueren Nummer fragt und zum Herunterladen auffordert: sicherer gegen ein übernommenes Konto, aber die Lehrkraft muss jede Version selbst austauschen.
- Zweites, öffentliches Repository nur für die fertigen Dateien: hält Quelltext und Planung privat, verdoppelt aber den Weg jeder Änderung.
- GitHub Pro für Pages aus einem privaten Repository: kostet Geld, und die Seite selbst ist trotzdem öffentlich.
