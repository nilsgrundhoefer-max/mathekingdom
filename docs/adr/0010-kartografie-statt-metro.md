# Mittelalterliche Landkarte statt Metro

Der Name Mathekingdom und das Metro-Setting passten nicht zusammen. Das Zug-Setting (Metrokarte, Linien, Stationen, Lokführer, Lok-Werkstatt, Ränge von Rangierlok bis Königszug) wird deshalb vollständig durch eine zurückhaltende Landkarte im Stil alter Kartografie ersetzt: Pergament als Fläche, Tinte für Wege und Schrift, kein Comic- und kein Fantasy-Stil, tauglich für Klasse 5 bis 10. Grundlage ist Nils' Arbeitsanweisung „Neukonzeption UI/UX & Gamification“ vom 17.11.2026, geklärt in drei Fragerunden.

**Das Modell bleibt.** Eine Regionskarte zeigt wie bisher vier parallele Straßen F, G, M, E (Feldweg, Talweg, Königsweg, Bergpfad). Jedes Unterkapitel ist ein Meilenstein auf allen vier Straßen, und ein Niveauwechsel ist ein Straßenwechsel. Ein allgemeiner Graph mit frei verzweigten Routen, Querverbindungen und Voraussetzungen wurde verworfen. Jedes Kapitel hätte sonst von Hand als Netz geplant werden müssen, die Lernziel-Regel und das Lehrer-Dashboard hätten sich mit geändert, und die vier Straßen bilden die Differenzierung nach Niveau schon ab. Meilensteine gehen nicht nacheinander auf, damit die Schüler ihren Weg selbst wählen. Die Karte zeigt nur eine empfohlene Reihenfolge, und die Sperre durch die Lehrkraft bleibt. Begriffe der Anweisung ohne Entsprechung im Modell (Knotenpunkt, Passierschein, Etappe als Wegstück) werden nicht eingeführt. „Etappe“ behält seine bisherige Bedeutung.

**Namen.** Die Übersicht aller Kapitel heißt Schlossgarten: ein Gartentor je Region, dahinter die Regionskarte. „Reichskarte“ war zu martialisch. Der Stern heißt Siegel, der Lokführer heißt Kundschafter, die Ränge heißen Wanderer, Kundschafter, Wegmeister und Hofkartograf (Schwellen unverändert), und statt der Lok gestalten die Schüler ein Wappen. Im Code stehen für die Karte die Namen aus der Anweisung (`world_map`, `region_map`, `route`, `milestone`), alles andere bleibt deutsch.

**Straßen erkennt man ohne Farbe.** Reine Tintentöne lassen vier Straßen nicht unterscheiden. Jede Straße hat deshalb eine gedämpfte Farbe und zusätzlich ein eigenes Strichmuster: Feldweg gestrichelt, Talweg durchgezogen, Königsweg doppelt, Bergpfad gepunktet.

**Fehler kosten nichts.** Der zweite Versuch bringt so viele Münzen wie der erste, und der Tipp kostet nichts. Nach dem ersten falschen Versuch öffnet sich der Tipp von selbst. Beispiel und Lösungsschritt senken die Münzen weiter, und der Lösungsschritt zählt weiter nicht fürs Siegel, weil das Siegel ein Nachweis ist und keine Strafe. Öffentliche Bestenlisten und künstliche Wartezeiten gibt es nicht und wird es nicht geben. Münzen bleiben, rücken aber hinter Siegel und Karte zurück.

**Lehrer-Dashboard.** Es übernimmt nur die Begriffe, nicht das Aussehen. Zugleich wird es aufgeräumt: vier Bereiche (Jetzt, Lernstand, Aufgaben, Verwaltung) statt sieben Reiter, und jeder Bereich geht beim Anklicken in die Tiefe. Der Lernstand zeigt eine Heatmap aus Schülern und Lernzielen mit vier deutlich verschiedenen Zuständen statt einer stufenlosen Skala.

Tablets für Schüler bleiben außen vor. Das Speichern in den Klassenordner (ADR 0001) geht nur mit Edge oder Chrome am PC.

## Consequences

- Speicherstände werden beim Laden umgestellt: Lok-Farben und Lok-Extras werden Wappen-Teile mit demselben Preis, Sterne werden Siegel. Münzen und Lernziele bleiben unverändert.
- Bisher vergebene Münzen werden nicht nachberechnet.
