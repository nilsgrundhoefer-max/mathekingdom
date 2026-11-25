# Klasse 6, Kapitel 6 „Berechnungen am Quader“

Klasse 6 bekommt ihr sechstes Kapitel nach dem Jahresplan (Schnittpunkt 6): 5 Meilensteine mit je 2 Lernzielen und 24 Aufgaben, zusammen 240 Aufgaben. 6.6 „Tabellenkalkulation: Berechnungen am Quader“ entfällt als Medienkompetenz. Grundlage sind zwei Fragerunden mit Nils am 25.11.2026 (Fragen 1 bis 18): Runde 1 „alle übernehmen“, Runde 2 „alle wie empfohlen, passt dann“. Es gibt keinen Niveau-Meilenstein und keine Pflicht ab M.

**Lernziele.** 6.1 O1 Oberflächeninhalt berechnen, O2 Sachaufgaben und fehlende Kante. 6.2 W1 Einheitswürfel zählen, W2 Volumen vergleichen und in Schichten zählen. 6.3 U1 benachbarte Volumeneinheiten, U2 Liter, mehrere Stufen und Komma. 6.4 V1 Volumen berechnen, V2 Sachaufgaben und fehlende Kante. 6.5 Z1 Volumen, Z2 Oberflächeninhalt zusammengesetzter Körper.

**Staffel.** F: ganze Kanten bis 10 in einer Einheit. G: Kanten bis 20, auch m und dm. M: eine Stelle nach dem Komma, Kanten in verschiedenen Einheiten angleichen. E bekommt keine längeren Zahlen, sondern Umkehraufgaben, Verdoppeln der Kanten, Fehlersuche und „alle Quader mit diesem Volumen“. Die fehlende Kante aus dem Volumen kommt ab M, aus dem Oberflächeninhalt nur auf E. Alles geht auf, mit höchstens drei Stellen nach dem Komma; gerundet wird nie.

**Sprache.** Es heißt „Volumen“, nie „Rauminhalt“ (das Wort steht nur im Merkzettel). Kanten heißen a, b, c, dazu O und V; a³ kommt nicht vor. Die Formel O = 2 · (a · b + a · c + b · c) steht ab G. Auf F füllt das Kind eine Tabelle mit den drei Flächenpaaren, auf G trägt es ein Zwischenergebnis ein, ab M nur das Ergebnis.

**Einheiten.** Neu in der Größeneingabe ist die Größenart Volumen mit mm³, cm³, dm³, m³, ml, l und hl (hl erst ab M; cl und km³ gibt es nicht). Die Grundeinheit ist mm³, 1 l ist 1 dm³. Auf F steht die Einheit fest hinter dem Feld. Ab G wählt das Kind aus drei bis fünf Einheiten, darunter mindestens eine einer anderen Art (cm² neben cm³). Drei Fälle:

- Ohne genannte Einheit zählt jede gleichwertige Angabe: 2,5 dm³, 2500 cm³ und 2,5 l.
- Verlangt die Aufgabe eine Einheit („Gib das Volumen in Litern an“, Feld `verlangt`), ist der richtige Wert in einer anderen Einheit „fast richtig“: Das Kind bekommt einen Hinweis und bessert nach, ohne dass ein Versuch zählt (wie beim Kürzen in ADR 0037).
- Eine Einheit der falschen Art (cm² für ein Volumen) ist falsch, mit der eigenen Fehlvorstellung `einheit-art`.

Ab Klasse 6 steht eine Fläche in der Lösung mit Komma (3,75 cm²). In Klasse 5 bleibt sie gemischt (ADR 0035).

**Umwandeln.** F wandelt benachbarte Einheiten mit ganzen Zahlen um und trägt die Ziffern in die Einheitentafel ein, die für Volumen drei Spalten je Einheit hat. G bekommt l und ml und die Tafel als Hilfsbild. M rechnet mit Komma und über mehrere Stufen. E sucht Fehler, ordnet und begründet.

**Volumen vergleichen.** F zählt Würfel, die alle sichtbar sind. G zählt verdeckte Würfel mit. M zählt in Schichten und vergleicht Körper aus verschieden großen Einheitswürfeln. E ergänzt Lücken zum vollen Quader.

**Zusammengesetzte Körper.** Neu ist das Körperbild `quaderbau`: ein Körper aus Quadern im Schrägbild, mit Maßen an den Kanten. Auf F und G ist die Zerlegung gezeigt, in zwei Farben mit gestrichelter Schnittlinie und allen Maßen. Auf M fehlt die Zerlegung, und eine Länge muss das Kind herleiten. E ergänzt zum vollen Quader und zieht ab (Quader mit Loch, U-Form, Treppe). Den Oberflächeninhalt zusammengesetzter Körper rechnen erst M und E (Bildungsplan: Niveau M). F und G zählen stattdessen die Quadrate außen an einem Würfelbau.

**Bilder.** Dazu kommen der Quader aus Einheitswürfeln (`raster`), das Netz mit Maßen oder mit dem Flächeninhalt in jeder Fläche und Bildkarten mit Quadern und Würfelbauten. 109 der 240 Aufgaben haben ein Bild.

**Heftaufgaben.** Nur auf M und E, je 2 von 6 Aufgaben in O2, V2, Z1 und Z2, zusammen 16. „Finde alle Quader mit dem Volumen …“ ist eine Heftaufgabe auf E: Das Kind gibt die Anzahl ein und die drei Kanten des Quaders mit dem kleinsten Oberflächeninhalt. Die Reihenfolge der drei Kanten ist frei (`reihenfolgeEgal`).

**Fehlvorstellungen.** Zehn neue: nur drei Flächen statt sechs, Volumen und Oberflächeninhalt verwechselt, Einheit der falschen Art, nicht die verlangte Einheit, Kanten addiert statt multipliziert, Einheiten nicht angeglichen, Klebefläche mitgezählt, Liter nicht als dm³ erkannt, Deckel mitgerechnet, „doppelte Kante gibt doppeltes Volumen“. Die Umrechnungszahl 10 oder 100 statt 1000 läuft unter der vorhandenen `umrechnungszahl`.

**Prüfung.** Ein eigenes Prüfprogramm (`tools/pruefe-quader.mjs`) rechnet jede Aufgabe mit Brüchen und Einheiten nach. Jede Gleichung im Nachweis muss stimmen, auch in der Dimension (cm · cm gibt cm²), und darf nur Größen benutzen, die im Text, im Bild, in der Tabelle oder in einem früheren Schritt stehen. Volumen und Oberflächeninhalt eines Körperbilds rechnet der Prüfer aus dem Bild selbst nach. Er erzwingt auch die Sprachregeln und die Regeln zur Einheitenwahl. Zwölf Begründungsaufgaben lassen sich nicht nachrechnen; ihr Nachweis ist als frei gekennzeichnet.

**Voraussetzungen.** O1 braucht den Flächeninhalt des Rechtecks (5.8.3-R1) und das Quadernetz (6.3.1-Q2), W1 den Würfelbau (6.3.8-K2), U1 die Flächeneinheiten (5.8.2-H2) und die Stufenzahlen (6.5.2-S1), V1 dazu W2 und das Multiplizieren von Dezimalzahlen (6.5.3-M1), Z1 zusammengesetzte Flächen (5.8.4-S1).

**Bildungsplan.** Leitidee Messen: O, V und Z: MES (15), Sachaufgaben: MES (8), W: MES (14), U: MES (5). Die Veränderung bei doppelten Kanten (FZ 6) kommt nur auf E. Die Operatorregel aus Kapitel 3 gilt auch hier.
