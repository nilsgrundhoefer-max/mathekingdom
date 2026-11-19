# Testklasse mit simulierten Schülern

Nils fragte am 19.11.2026, ob er als Administrator eine Testklasse anlegen kann, in der simulierte Schüler arbeiten, um Mathekingdom zu testen, und ob das auch als Live-Test funktioniert. Drei Fragerunden (Q1 bis Q19), alle Empfehlungen übernommen außer Q19: alles in einer Version statt in zwei.

**Zweck.** Die Testklasse prüft vor allem das Lehrer-Dashboard live und seine Diagnose mit glaubwürdigen Daten. Für die Schüleroberfläche bleibt der Browsertest zuständig. Ein Lasttest des Schulnetzes ist sie nicht: Ein PC schreibt alle Speicherstände, nicht 25 PCs gleichzeitig.

**Gleicher Weg wie echte Schüler.** Das Lehrer-Dashboard liest alle 5 Sekunden die Speicherstände im Klassenordner und fragt nicht, wer sie geschrieben hat. Deshalb schreibt das Administrator-Dashboard für jeden simulierten Schüler einen gewöhnlichen Speicherstand, erzeugt mit derselben Spiellogik (`logik.js`: Etappe, Kronenwahl, nächste Aufgabe, verbuchen, Wegstück, Rückblick, Einstiegscheck, Sonderauftrag, Münzgabe, Spiele). Das Lehrer-Dashboard braucht dafür keinen Sonderweg; was es bei der Testklasse zeigt, zeigt es genauso bei einer echten. Ein eigenes Testformat oder Daten nur im Arbeitsspeicher (wie die Beispielklasse) wurden verworfen, weil sie genau den Weg über die Laufwerke nicht prüfen würden.

**Ausnahme vom Grundsatz „ein Schreiber je Speicherstand“ (ADR 0027).** Den Speicherstand eines simulierten Schülers schreibt nur das Administrator-Dashboard; ein echtes Schüler-Dashboard meldet sich mit diesen Codes nie an (die PINs kennt niemand). Die drei echten Probe-Codes der Testklasse schreibt wie üblich nur das Schüler-Dashboard.

**Gleicher PC wie das Lehrer-Dashboard.** Nils lässt die Simulation auf dem PC laufen, an dem er auch das Lehrer-Dashboard bedient. Browser bremsen Zeitgeber in Hintergrund-Tabs (Chrome und Edge nach etwa fünf Minuten auf etwa einmal pro Minute). Deshalb gibt ein Worker den Takt (seine Nachrichten werden kaum gebremst), und jeder simulierte Schüler holt verpasste Zeit nach: Alle Ereignisse bekommen ihre richtige Zeit, auch wenn sie in einem Schub geschrieben werden. Ein Test sichert, dass ein großer Schritt dasselbe ergibt wie viele kleine. Das Administrator-Dashboard zeigt „letzter Takt vor … s“, damit eine Bremse sichtbar wird.

**Kennzeichnung.** Die Testklasse ist eine gewöhnliche Klasse mit freiem Namen, im Schulverzeichnis mit `test: true`. Sie zählt nicht in Nutzungsstatistik, Auffällige Aufgaben und Aufgabenmeldungen und wird nicht ins neue Schuljahr übernommen. Im Lehrer-Dashboard trägt sie das Schild „Testklasse“. Sie hat eine Lehrkraft wie jede Klasse; es darf mehrere geben.

**Simulierte Schüler.** 5 bis 30, Standard 25, mit erfundenen Vornamen und einem Profil in der Notiz: sicher, schnell (unterschätzt sich), durchschnittlich, wackelig, rät, blockiert oft, ruft oft Hilfe, wird oft inaktiv. Die ersten acht decken jedes Profil ab. Ein Zufallswert macht Anlegen und Lauf wiederholbar. Dazu drei Probe-Codes mit PIN, mit denen Nils selbst als Schüler mitarbeitet.

**Reaktionen auf die Lehrkraft.** Antwort auf einen Hilferuf: weiter nach ein bis zwei Minuten, danach mit besserer Lösungsquote. Ohne Antwort wartet der Schüler. Torfreigabe und Meilensteinfreigabe: über die Etappe wie bei echten Schülern. Sonderauftrag: starke Schüler erfüllen ihn, schwache lassen ihn teils liegen. Münzgabe: Der Brief wird geöffnet. Nachricht: wird bestätigt. Spielpause und Spielfreigabe: Es wird gespielt, die Bestenliste füllt sich; ab und zu wird ein Wappenteil gekauft.

**Tempo, Dauer, Vorlauf.** Echtes Tempo oder dreifach. Dauer 45 Minuten, 90 Minuten (Standard) oder bis zum Anhalten; zum Ende hören die Schüler gestaffelt auf. Der Vorlauf erzeugt beim Anlegen 1, 3 (Standard) oder 6 Schulwochen Vergangenheit, drei Stunden je Woche, mit demselben Motor ohne Lehrkraft (Hilfe kommt nach zwei bis vier Minuten), damit Lernstand, Rückblick, „gefestigt“ und Selbsteinschätzung sofort etwas zeigen. Die Testklasse bekommt dafür alle Kapitel mit Aufgaben als Tore, das erste als aktuelles Kapitel. Wer alles gemeistert hat, spielt um die nächsthöhere Krone.

**Ende und Fortsetzen.** Anhalten lässt alles liegen. Schließt Nils das Administrator-Dashboard, hält die Simulation an; beim nächsten Start setzt sie dort fort, wo die Speicherstände stehen, ohne die Lücke nachzuholen. „Zurücksetzen“ löscht die Speicherstände der simulierten Schüler und erzeugt sie mit Vorlauf neu. Auflösen und Löschen wie bei jeder Klasse.

## Consequences

- Technische Störungen (Speichern schlägt fehl, alte Version, ein Code auf zwei PCs) simuliert die Testklasse nicht. Das wäre eine eigene Ausbaustufe für das Betriebsprotokoll.
- Weil derselbe Motor auch im Vorlauf läuft, ändert jede Änderung der Spiellogik auch die Testdaten. Das ist gewollt: Die Testklasse altert mit dem Spiel mit.
- Die Profile sind von Claude gewählte Annahmen, keine Messung. Passen sie im Probelauf nicht zu echten Klassen, werden die Zahlen in `src/gemeinsam/simulation.js` angepasst.
