# Aufgabenführung durch den Meilenstein und Meilensteinfreigabe

Nils beobachtete am 19.11.2026, dass das Schüler-Dashboard nach einem fertigen Lernziel in einen anderen Meilenstein springt. Er wünschte sich, dass die Führung erst alle Lernziele eines Meilensteins abarbeitet und dann zum nächsten bringt, dass die Lehrkraft Meilensteine zurückhalten kann und dass Schüler auf einer eigenen Seite sehen, was sie schon können. Zwei Fragerunden, alle Antworten von Nils.

Der Knopf „Nächste Aufgabe“ blieb schon im Meilenstein. Herausgeführt haben der Seitenblick (ADR 0016), „Hier geht es weiter“ und der Kartenstandort, die den ersten angefangenen Meilenstein in Kapitelreihenfolge nahmen statt des zuletzt bearbeiteten. Nach dem Meistern lief „Nächste Aufgabe“ im selben Meilenstein im Kreis.

**Aufgabenführung.** Startseite und Karte führen zum zuletzt bearbeiteten Meilenstein, solange er nicht gemeistert ist, sonst zum nächsten nicht gemeisterten in Kapitelreihenfolge. Weiter geht es, wenn die Krone in der gewählten Farbe da ist; wer um Purpur spielt, wird erst nach Purpur weitergeführt, auch wenn der Meilenstein mit Gold schon gemeistert ist. Danach kommt ein kurzer Moment „Weiter zu …“ und die erste Aufgabe dort. Abstecher überspringt die Führung, bietet sie auf diesem Moment aber per Knopf an. Die freie Wahl jedes offenen Meilensteins und jedes Lernziels darin bleibt; innerhalb eines Meilensteins wird nichts gesperrt.

**Seitenblick bleibt.** Er darf weiter ein besiegeltes Lernziel eines anderen Meilensteins zeigen, sagt aber dazu, wo es danach weitergeht („Kurzer Blick zurück, danach geht es mit Multiplizieren weiter“). Eine Beschränkung auf den laufenden Meilenstein hat Nils verworfen.

**Meilensteinfreigabe statt Reihenzwang.** Standard bleibt: alle Meilensteine eines Kapitels offen (ADR 0012). Nils' erster Gedanke, alle Meilensteine standardmäßig zu schließen, hat er selbst zurückgenommen. Die Lehrkraft kann je Klasse und Kapitel im Bereich Klasse unter „Tore“ den Schalter „Alle Meilensteine offen“ ausschalten und Meilensteine anhaken. Die übrigen liegen im Nebel, als Umriss mit Nummer ohne Namen und nicht wählbar; angeklickt sagen sie, dass erst die offenen Meilensteine zu meistern sind. Hat ein Schüler alle freigegebenen gemeistert (Krone auf Zielniveau), gehen für ihn alle übrigen auf einmal auf. Ein Abstecher geht auf, wenn sein Meilenstein gemeistert ist, und ist für die übrigen nicht nötig. Was ein Schüler schon begonnen hat oder wofür er eine Krone hat, bleibt für ihn offen. Der gesperrte Meilenstein für einen einzelnen Schüler bleibt als eigenes Mittel bestehen.

**Grenzen.** Ein Sonderauftrag geht auch zu einem Meilenstein im Nebel, öffnet ihn aber nicht. Der Einstiegscheck fragt wie bisher über das ganze Kapitel und öffnet nichts. Rückblick und Seitenblick betreffen nur Lernziele mit Siegel.

**Das kannst du schon.** Ein Klick auf die Siegelzahl in der Kopfzeile öffnet eine eigene Seite mit allen Lernzielen der aktuellen Klassenstufe, die ein Siegel haben, als „Ich kann“-Sätze nach Kapitel und Meilenstein, mit Krone, Datum und „gefestigt“, oben ein Zähler wie „12 von 41 Lernzielen in Klasse 5“. Beim Drüberfahren steht nur „Klick: Das kannst du schon“, weil eine lange Liste nur beim Drüberfahren an Schul-PCs fummelig ist. Frühere Klassenstufen erscheinen nicht.

## Consequences

- Die Klassendatei trägt je Kapitel eine optionale Menge freigegebener Meilensteine; fehlt sie, sind alle offen. Alte Klassendateien bleiben gültig.
- Der Speicherstand merkt sich den zuletzt bearbeiteten Meilenstein je Kapitel, oder er wird aus dem Versuchsprotokoll abgeleitet.
