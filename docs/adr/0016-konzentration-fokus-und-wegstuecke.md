# Konzentration über eine Stunde: Fokus-Modus, Wegstücke und ruhige Rückmeldung

Nils möchte, dass Schüler bis zu 60 Minuten am Stück konzentriert in Mathekingdom arbeiten. Am 19.11.2026 hat Claude das Schüler-Dashboard (Version 0.10) auf fünf Mechanismen geprüft: kognitive Entlastung, Microlearning und Interaktionsdichte, unmittelbares Feedback mit gestuften Hilfen, sichtbare Progression und Adaptivität. Feedback, Hilfestufen und Adaptivität (Kronenvorschlag, Grundlagen-Schleife, Brücke) waren schon tragfähig. Passiven Konsum gibt es nicht, das Kind ist alle 30 bis 90 Sekunden aktiv. Die Lücken lagen in der Ökonomie der Aufmerksamkeit: dauernd sichtbare Zähler und Navigation, ein Tipp außerhalb des Bildschirms, kein Tastaturfluss, überladene Ergebnistafeln, keine Gliederung unterhalb des Kapitels. Nils hat in zwei Fragerunden alle Empfehlungen übernommen.

**Fokus in der Aufgabe.** Während einer Aufgabe schrumpft die Kopfzeile von selbst auf Wappen (zurück), Lernziel-Punkte und eine Speicherwarnung nur im Fehlerfall; Antwort auf den Hilferuf und Nachricht der Lehrkraft bleiben sichtbar. Kein Schalter, weil ein Schalter selbst eine Entscheidung ist. Ein geöffnetes Hilfekärtchen erscheint unter dem Eingabefeld in der Aufgabenkarte, die Seitenleiste behält Wortspeicher, Merkzettel und Hilferuf. Das erste Eingabefeld hat den Fokus, Enter prüft, Enter nach dem Ergebnis führt weiter.

**Ruhige Rückmeldung.** Die Ergebnistafel zeigt höchstens zwei Zeilen und einen Knopf: Richtig oder falsch mit Münzen, dazu der Heftcode. Siegel, Krone und Meilenstein bekommen einen kurzen eigenen Moment, Kronenvorschlag und Brücke kommen nacheinander statt gleichzeitig. Nach zwei Fehlversuchen liegen Beispiel und Lösungsschritt aufgedeckt neben der Lösung; ein eigenes Feld „Lösungsweg“ kommt erst mit neuen Kapiteln, damit keine ungeprüften Texte in den Pool gelangen (ADR 0015). Belohnung ist rein visuell (Münze fliegt, Punkt füllt sich); ein dezenter Ton ist ein Klassenschalter der Lehrkraft und standardmäßig aus, weil 28 PCs ohne Kopfhörer sonst selbst stören.

**Wegstücke statt endloser Folge.** Aufgaben kommen in Wegstücken zu fünf (etwa fünf Minuten), mit „Aufgabe 3 von 5“ und einem kurzen Abschluss ohne Extra-Münzen, damit Durchklicken sich nicht lohnt (ADR 0014). Ein Wegstück zählt Aufgaben, nicht Lernziele; Grundlagen-Schleife und Brücke zählen mit, Rückblick, Einstiegscheck und Heftcheck nicht. Eine der fünf Aufgaben ist ein Seitenblick auf ein schon besiegeltes Lernziel desselben Kapitels (gemischtes Üben im Kleinen), ohne Wirkung auf Siegel. Nach jedem vierten Wegstück schlägt das Dashboard eine Rast von 60 Sekunden vor, abschaltbar pro Klasse.

**Ermüdung entscheidet die Lehrkraft.** Im Bereich Jetzt zeigt jede Schülerkachel die heutigen Wegstücke nach Quote gefärbt; sinkt die Quote über zwei Wegstücke deutlich, gibt es den Live-Status „lässt nach“. Das Kind bekommt dazu keine automatische Meldung, weil Ermüdung eine pädagogische Entscheidung ist.

**Verworfen.** Fokus-Modus per Klick, Ton immer an, Wegstücke nach festem Zeitfenster, Seitenblicke aus früheren Kapiteln, Extra-Münzen fürs Wegstück, automatische Ermüdungsmeldung an das Kind.

## Consequences

- Der Speicherstand bekommt das laufende Wegstück (Aufgaben, Stand) und die abgeschlossenen Wegstücke mit Quote; die Klassendatei die Schalter für Ton und Rast.
- Seitenblicke kommen nur aus Lernzielen mit Siegel; ohne Siegel im Kapitel hat ein Wegstück fünf Aufgaben zum laufenden Lernziel.
