# Torfreigabe: Die Lehrkraft öffnet Tore je Klasse und einzeln

Bisher wählte die Lehrkraft ein Aktuelles Kapitel, und offen waren alle Kapitel bis dorthin in der Reihenfolge des Pools. Spätere Tore sahen die Schüler im Schlossgarten schon, geschlossen und mit Namen. Nils wünschte sich am 19.11.2026, dass Schüler nur die Tore sehen, die schon geöffnet sind, und dass die Lehrkraft neue Tore je Klasse freigibt. In zwei Fragerunden hat er alle Empfehlungen übernommen und ergänzt, dass auch einzelne Schüler zusätzliche Tore bekommen können.

**Unsichtbar statt geschlossen.** Ein nicht freigegebenes Tor fehlt im Schlossgarten ganz. Unter dem letzten Tor steht nur ein Satz ohne Namen und Anzahl („Weitere Tore öffnet deine Lehrkraft, wenn es so weit ist“). So bleibt Neugier, ohne den Jahresplan zu verraten. Die Nummer ist die des Kapitels im Lehrwerk (Tor 5 = Kapitel 5), angezeigt in Buchreihenfolge, auch wenn dadurch Lücken entstehen.

**Freie Reihenfolge statt Folge.** Die Lehrkraft hakt Tore einzeln an, in beliebiger Reihenfolge. Die Folge „alles bis zum Aktuellen Kapitel“ wurde verworfen, weil Lehrkräfte Kapitel umstellen (etwa Geometrie vorziehen). Das Aktuelle Kapitel bleibt eine eigene Wahl; wählt die Lehrkraft eines, dessen Tor zu ist, öffnet es sich für die Klasse. „Alle Kapitel offen“ wird ein Knopf „Alle Tore öffnen“.

**Klasse und einzelne Schüler.** In der Verwaltung steht unter „Tore“ eine Liste: Zeilen sind Schüler, Spalten Tore, oben die Zeile „ganze Klasse“, je Spalte ein Zähler. Ein Klassenhaken hakt alle Schüler automatisch an. Einzeln kann die Lehrkraft nur zusätzlich öffnen, nicht ein Klassentor für ein Kind schließen; dafür gibt es gesperrte Meilensteine. Klassen- und Einzelhaken werden getrennt gespeichert und in der Liste unterschieden. Schließt die Lehrkraft ein Tor für die Klasse, bleibt es bei Schülern mit Einzelhaken offen.

**Zurücknehmen ohne Verlust.** Ein Tor kann wieder geschlossen werden, mit einer Warnung, wenn schon jemand darin gearbeitet hat. Siegel, Kronen und Münzen bleiben erhalten; das Tor ist nur unsichtbar.

**Ankündigung.** Ein neu geöffnetes Tor fällt beim nächsten Start einmal auf („Ein neues Tor hat sich geöffnet: …“, kurzes Leuchten), ohne Münzen oder andere Belohnung.

**Startseite.** Sie führt weiter zum Aktuellen Kapitel der Klasse. Ist es gemeistert und hat der Schüler ein zusätzliches Tor, wird dieses das nächste Ziel.

**Grenzen.** Ein Sonderauftrag öffnet kein Tor und läuft für sich. Die Vorwissen-Brücke verweist nur auf offene Kapitel.

## Consequences

- Die Klassendatei (ADR 0004) trägt statt der Folge eine Menge offener Kapitel für die Klasse und je Schülercode eine Menge zusätzlicher Kapitel. Alte Klassendateien mit nur einem Aktuellen Kapitel werden beim Lesen so gedeutet wie bisher: offen sind alle Kapitel bis dorthin, ohne Aktuelles Kapitel alle.
- Eine neue Klasse hat nur Tor 1 offen. Ohne Klassendatei („Ohne Ordner ausprobieren“) sind weiter alle Tore offen.
- Das Lehrer-Dashboard zeigt in Lernstand und Aufgaben weiterhin alle Kapitel; die Freigabe betrifft nur die Sicht der Schüler.
