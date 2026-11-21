# Kapitel 5 „Geometrische Grundbegriffe und ebene Figuren“: Gitterzeichnen statt Konstruieren

Nils bat am 21.11.2026 um die Aufgaben zu Klasse 5, Kapitel 5, für alle Niveaus. Zwei Fragerunden, alle Empfehlungen übernommen; in 5.5.6 kam auf seinen Wunsch die Punktsymmetrie dazu.

**Umfang.** Sechzehn Lernziele, je sechs Aufgaben auf F, G, M und E, zusammen 384: 5.5.1-B1 und B2 (Strecke, Strahl, Gerade erkennen; Strecken messen und zeichnen), 5.5.2-S1 und S2 (Senkrechte erkennen und zeichnen), 5.5.3-P1 und P2 (Parallelen erkennen und zeichnen), 5.5.4-K1 und K2 (Punkte ablesen und eintragen), 5.5.5-D1 (Entfernung und Abstand), 5.5.6-A1 bis A3 (Symmetrieachsen, an einer Achse spiegeln, Punktsymmetrie), 5.5.7-V1 (Rechteck und Quadrat), 5.5.8-V2 (Parallelogramm und Raute), 5.5.9-V3 und V4 (Trapez und Drachen, Haus der Vierecke).

**Gitterzeichnen statt Konstruieren.** Am Bildschirm lässt sich mit Geodreieck und Bleistift nicht arbeiten, und eine frei gezogene Linie lässt sich nicht gerecht bewerten. Deshalb tippt das Kind Gitterpunkte auf einem Karogitter an (`format: "gitter"`): einzelne Punkte, zwei Punkte für eine Linie oder Kästchen zum Färben. Geprüft wird die Lage der Punkte, nie die Linienführung. Bei einer Linie gilt eine Bedingung (zum Beispiel „senkrecht zu g durch P“), sodass jede richtige Linie zählt, egal welche zwei Punkte das Kind wählt. Verworfen: Freihandzeichnen mit Toleranz (ungerecht an der Grenze, am Tablet anders als mit der Maus) und ein nachgebautes Geodreieck (zu aufwendig zu bedienen, lenkt vom Begriff ab).

**Zeichnen im Heft.** Das Zeichnen mit dem Geodreieck bleibt im Heft. Bei B2, S2 und P2 sind auf M und E je zwei von sechs Aufgaben Heftaufgaben mit Kontrollwert: Das Kind zeichnet im Heft, misst eine Länge nach und tippt sie in Millimetern ein. 2 mm Abweichung gelten als richtig (`toleranz: 2`), weil genauer niemand misst. Die Kontrollwerte sind ganzzahlig, weil die Dreiecke dahinter pythagoreisch sind.

**Messen ohne Kommazahlen.** Gemessen wird am gezeichneten Lineal (`bild.art: "lineal"`) und an Kästchen: 2 Kästchen sind 1 cm, 1 Kästchen ist 5 mm. Längen stehen als „3 cm 5 mm“ oder in Millimetern, weil Dezimalzahlen erst in Klasse 6 kommen.

**Staffel.** Koordinaten nur im ersten Quadranten: F bis 6, G bis 10, M bis 15, E mit Mustern und fehlenden Ecken. ⊥ und ∥ ab G, „orthogonal“ nur auf E, „Diagonale“ erst ab M. Symmetrie: auf F und G liegen die Achsen auf Kästchenlinien, und das Kind färbt Kästchen; ab M gibt es schräge Achsen, und es setzt Eckpunkte. Punktsymmetrie auf F und G als halbe Drehung am Bild, ab M wird am Symmetriezentrum gespiegelt, auf E werden Achsen- und Punktsymmetrie verglichen. Vierecke werden über Seiten, rechte Winkel und Symmetrieachsen beschrieben, Diagonalen erst ab M. Ecken heißen gegen den Uhrzeigersinn A, B, C, D.

**Haus der Vierecke.** Die Namen schließen einander ein: Ein Quadrat ist auch Rechteck, Raute, Parallelogramm, Trapez und Drachen. Ein Trapez hat also mindestens ein Paar paralleler Seiten. Fragt eine Aufgabe „Wie heißt es genau?“, ist der engste Name gemeint; fragt sie „Welche Namen passen?“, sind es alle. Auf F und G kommen Sonderfälle nur als ausdrückliche Frage vor („Ist ein Quadrat auch ein Rechteck?“), nie als Falle.

**Nachrechnen.** Der Prüfer rechnet die Geometrie unabhängig vom Erzeuger nach, mit ganzen Zahlen und ohne Wurzeln: Lage von Linien, Schnittpunkte, Lotfußpunkte, Abstände, Spiegelbilder, Symmetrieachsen und Symmetriezentren, Namen und Eigenschaften von Vierecken. Bei Aufgaben mit einem gesuchten Punkt prüft er auch, dass kein zweiter Gitterpunkt die Bedingung erfüllt. Die Prüfarten stehen in `GEO_SONDER` in `tools/pruefe-pool.mjs`.

## Consequences

- Tor 5 bleibt für Klassen mit Klassendatei geschlossen, bis die Lehrkraft es öffnet (ADR 0022).
- Neue Geometrie-Bilder gehören in `src/schueler/geobilder.js`, die Rechnung dazu in `src/schueler/geo.js`. Beides kommt ohne Kommazahlen aus; wer schräge Längen braucht, vergleicht Quadrate.
- Eine Gitteraufgabe mit `offen: true` verrät nicht, wie viele Punkte gesucht sind („Markiere alle Punkte, die …“).
- Winkel messen, Kreise und Flächeninhalt gehören nicht in dieses Kapitel. Kommen sie später, braucht das Gitterzeichnen dafür keine Änderung, wohl aber neue Bilder.
- Die Heftaufgaben vertrauen dem Kind: Wer nicht zeichnet, kann den Kontrollwert auch ausrechnen oder raten. Das ist gewollt, denn die Zahl ist nur die Rückmeldung zur Zeichnung.
