# Münzgabe des Administrators und einstellbare Belohnung des Sonderauftrags

Nils wünschte sich am 19.11.2026 zwei Dinge: Der Administrator soll einzelnen Schülern Münzen schicken dürfen, zum Testen und als Besonderheit. Und die Lehrkraft einer Klasse soll die Münzen für einen erledigten Sonderauftrag selbst einstellen, wählbar 50, 100, 250, 500 oder 1000, Standard 100. Bisher war die Belohnung fest 100 Münzen (ADR 0021). Eine Fragerunde, alle Empfehlungen von Nils übernommen.

**Weg über die Klassendatei.** Münzen stehen nur im Speicherstand, und den schreibt allein das Schüler-Dashboard. Von oben kommt etwas nur über die Klassendatei (ADR 0004). Der Administrator unterschreibt Klassendateien schon selbst, deshalb braucht die Münzgabe keinen neuen Kanal: Er trägt sie je Schülercode mit einer eigenen Kennung ein, das Schüler-Dashboard schreibt sie genau einmal gut und merkt sich die Kennung. Ein direktes Schreiben in den Speicherstand wurde nicht erwogen, weil es den Grundsatz brechen würde, dass jeder Speicherstand nur einen Schreiber hat.

**Münzgabe.** Im Glossar „Münzgabe“, für den Schüler „Eine Gabe des Königs“, ohne Absender. Feste Stufen 50, 100, 250, 500, 1000 und 5.000 als Teststufe, um etwa den Wappenschrank schnell durchzuprobieren; keine freie Zahl, damit kein Tippfehler 50.000 Münzen verschickt. Abgeschickt wird im Administrator-Dashboard im Bereich Klassen und Lehrkräfte, in der Schülerliste mit „Münzen schicken“ in jeder Zeile, für genau einen Schüler, mit einem optionalen kurzen Satz. Sie kommt als Brief mit eigenem Siegel, damit sie nicht wie ein Sonderauftrag aussieht, nie mitten in einer Aufgabe; gutgeschrieben wird beim Öffnen mit kurzer Münz-Animation. Mehrere ungeöffnete Gaben liegen nacheinander im Briefsymbol.

**Kein Abziehen.** Zurückziehen geht nur, solange die Gabe ungeöffnet ist. Danach gehören die Münzen dem Schüler; Münzen abziehen kann niemand. Ein Kontostand, der von oben sinkt, kostet Vertrauen, und Testmünzen auf einem echten Schülercode nimmt der Administrator dafür in Kauf.

**Transparenz für die Lehrkraft.** Im Schülerprofil steht „Münzgabe +500, geöffnet am …“, damit sich niemand über einen plötzlichen Münzberg wundert. Die Lehrkraft kann die Gabe weder ändern noch zurückziehen. Im Betriebsprotokoll steht ein Eintrag.

**Belohnung des Sonderauftrags je Klasse.** Eine Klasseneinstellung unter Klasse › Unterricht, Standard 100, wählbar 50, 100, 250, 500, 1000. Den Betrag bei jedem Auftrag neu zu wählen wurde verworfen: Alle Schüler einer Klasse sollen gleich viel bekommen, damit niemand ungleiche Belohnungen vergleicht. Der Betrag wird beim Abschicken in den Auftrag geschrieben und steht auf dem Brief („Belohnung: 250 Münzen“); ändert die Lehrkraft später die Einstellung, gilt für verschickte Aufträge weiter der angekündigte Betrag.

## Consequences

- Der Münzhaushalt aus ADR 0018 (Wappenschrank etwa 5.000 Münzen je Klassenstufe und Schuljahr) gerät mit hohen Beträgen ins Rutschen: Ein Sonderauftrag für 1000 Münzen ist ein Fünftel des Jahresschranks. Das ist bewusst in die Hand der Lehrkraft gelegt. Hoftitel und Ränge hängen nicht an Münzen und bleiben unberührt.
- Aufträge ohne Betrag (vor dieser Entscheidung verschickt) bringen weiter 100 Münzen.
- Lehrkräfte schicken keine Münzgaben; dieses Mittel bleibt beim Administrator.
