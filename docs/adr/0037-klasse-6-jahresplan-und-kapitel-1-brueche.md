# Klasse 6: Jahresplan nach dem Buch der Lehrkraft, Niveau-Meilensteine und Kapitel 1 „Brüche“

Nils bat am 24.11.2026 darum, mit den Kapiteln in Klasse 6 weiterzumachen. Drei Fragerunden (Q1 bis Q20), fast alle Empfehlungen übernommen.

**Quelle ist das Buch, nicht das alte Raster.** Der Jahresplan folgt dem Inhaltsverzeichnis von Schnittpunkt Mathematik 6, Differenzierende Ausgabe Baden-Württemberg (ISBN 978-3-12-745361-4), das Nils als Bild geschickt hat. Das frei verfügbare Kompetenzraster des Verlags gehört zur Ausgabe von 2016 (ISBN 978-3-12-744361-5) und hat andere Kapitel (Teilbarkeit, Terme und Gleichungen); es gilt nicht. Zur neuen Ausgabe gibt es kein Raster, deshalb stammen alle „Ich kann“-Sätze von uns, angelehnt an den Bildungsplan 2016. Der Plan steht in `docs/jahresplan-klasse-6.md`.

**Marken des Buchs.** Lerneinheiten mit MK (Medienkompetenz) entfallen, weil sie nicht automatisch auswertbar sind; die Nummern der übrigen bleiben wie im Buch, mit Lücken, damit Dashboard und Buch dieselbe Nummer meinen. Einheiten mit M oder E werden Niveau-Meilensteine: M hat Aufgaben nur auf M und E (je zwölf), E nur auf E (24). Für Schüler mit niedrigerem Zielniveau sind sie Abstecher. Kapitel 10 ist als Ganzes E; das Tor öffnet die Lehrkraft für einzelne Schüler, gebaut wird es zuletzt. Die Alternative, solche Einheiten für alle auf vier Niveaus anzubieten, hätte Schülern auf G Stoff abverlangt, den Buch und Bildungsplan für sie nicht vorsehen.

**Eigene Aufgabendatei, Brücken über Klassenstufen.** Klasse 6 liegt in `aufgabenpool/klasse-6.json`. Ein Sechstklässler sieht nur die Tore von Klasse 6. Voraussetzungen dürfen auf Lernziele aus Klasse 5 zeigen, Brücken und Grundlagen-Schleifen dürfen deren Aufgaben zeigen. Die Niveaustufen eines Kapitels richten sich immer nach der eigenen Klassenstufe (Nils: „das Niveau soll auf jeden Fall an der jeweiligen Klassenstufe orientiert sein“). Wo sich der Stoff mit Klasse 5 Kapitel 9 überschneidet (1.1, 1.5, 4.1), bleiben die Meilensteine und bekommen neue, anspruchsvollere Aufgaben („Überschneidungen schaden nicht“).

**Kapitel 1 „Brüche“.** Zwölf Lernziele, je 24 Aufgaben, zusammen 288:
- 1.1 Brüche: Bruchteile an Bildern erkennen und darstellen, auch über 1; gemischte Zahl und unechten Bruch umwandeln.
- 1.2 Erweitern: mit gegebener Zahl; auf gegebenen Nenner und gleichwertige Brüche erkennen.
- 1.3 Kürzen: mit gegebener Zahl; vollständig.
- 1.4 Vergleichen und ordnen: gleicher Nenner oder gleicher Zähler; ungleichnamig.
- 1.5 Brüche und Größen: Bruchteil berechnen; auf das Ganze schließen und Anteile angeben.
- 1.6 Zahlenstrahl: ablesen; eintragen.

**Staffel.** Nenner F bis 10, G bis 20, M bis 50 und 100, E bis 200. Erweitern und Kürzen: F mit 2, 3, 5 und 10, G bis 10, M bis 12, E in mehreren Schritten (84/126). Vergleichen: F gleicher Nenner oder Zähler, am Bild gestützt; G ein Nenner Vielfaches des anderen; M beliebig gleichnamig machen, bis zu vier Brüche ordnen; E geschickt vergleichen (mit 1/2 und 1, Rest zum Ganzen) und Fehlersuche.

**Kürzen ohne Teilbarkeitskapitel.** Das Buch hat in Klasse 6 kein Kapitel zu Teilern. Schrittweises Kürzen ist der Normalweg; die Regeln für 2, 3, 5 und 10 stehen auf Hilfekärtchen und Merkzettel. „Größter gemeinsamer Teiler“ nur auf E.

**Prüfregeln.** Bis 1.2 zählt jeder gleichwertige Bruch. Ab 1.3 muss das Ergebnis vollständig gekürzt sein; ungekürzt ist fast richtig mit „Kürze noch“, ohne Abzug eines Versuchs. Unechter Bruch und gemischte Zahl zählen gleich, außer die Aufgabe verlangt eine Form. In 1.5 sind Ergebnisse ganze Zahlen in der kleineren Einheit (3/4 von 2 km = 1500 m), weil Dezimalzahlen erst in Kapitel 4 kommen; auf M und E wählt der Schüler die Einheit selbst.

**Heftaufgaben.** Nur im Lernziel „Brüche eintragen“ (1.6): auf M und E je zwei von sechs, der Zahlenstrahl wird im Heft selbst eingeteilt.

**Lieferung.** Kapitel 1 kommt mit dem Unterbau für die zweite Klassenstufe als Version 0.43. Der Wappenbereich Klasse 6 (Schildteilung) ist ein eigener, späterer Auftrag.

## Nachtrag zum Bau von Version 0.43 (24.11.2026)

Entscheidungen, die beim Bauen fielen und nicht in den Fragerunden standen:

**Vorstufe im Pool.** `klasse-6.json` trägt unter `vorstufe` Kopien der Aufgaben aus Klasse 5 (Niveaus F, G und M) zu genau den Lernzielen, auf die eine Voraussetzung aus Klasse 6 zeigt. So braucht das Schüler-Dashboard für eine Brücke keine zweite Datei, auch nicht im Schulnetz und ohne Netz. Die Alternative, beide Pools zu laden, hätte jeden Sechstklässler den ganzen Pool der Klasse 5 laden lassen und die Abhängigkeit unsichtbar gemacht. Die Prüfung stellt sicher, dass jede Kopie der Aufgabe im Pool der Klasse 5 gleicht. Lernziele der Vorstufe sind kein eigener Stoff der Klasse: Sie erscheinen auf keiner Karte und in keinem Lernstand.

**Fast richtig ist begrenzt.** Der Hinweis „Fast richtig“ kostet keinen Versuch, aber höchstens zweimal je Aufgabe. Danach zählt die Eingabe als Fehlversuch mit der Fehlvorstellung „nicht vollständig gekürzt“ oder „gemischte Zahl nicht umgewandelt“. Ohne Grenze ließe sich eine Aufgabe beliebig oft ohne Folgen abschicken.

**Größere Nenner beim Erweitern und Kürzen.** Die Staffel der Nenner gilt für die Brüche, mit denen eine Aufgabe beginnt. Der erweiterte oder ungekürzte Bruch darf größer sein: F bis 100, G bis 200, M bis 600, E bis 1000. Sonst ließe sich auf F nicht einmal 3/4 mit 5 erweitern.

**Brüche über 1 auf F** gibt es nur im Lernziel „gemischte Zahl und unechter Bruch“, weil es ohne sie leer wäre.

**Niveau-Meilensteine** sind in Kapitel 1 nicht nötig (keine Lerneinheit mit M oder E). Ihre Logik wird mit Kapitel 2 gebaut.

**Kennungen der Lernziele:** B1, B2 (Brüche), W1, W2 (Erweitern), K1, K2 (Kürzen), V1, V2 (Vergleichen), T1, T2 (Brüche und Größen), Z1, Z2 (Zahlenstrahl).
