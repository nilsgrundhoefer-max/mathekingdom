# Kapitel 2 „Natürliche Zahlen“: vier neue Eingaben und nachgerechnete Zahlsysteme

Nils bat am 21.11.2026 um die Aufgaben zu Klasse 5, Kapitel 2, für alle Niveaus. Zwei Fragerunden (Q1 bis Q15), alle Empfehlungen übernommen.

**Umfang.** Dreizehn Lernziele, je sechs Aufgaben auf F, G, M und E, zusammen 312: 5.2.1-N1 bis N3 (Zahlenstrahl, Vergleichen und Ordnen, Stellenwerte), 5.2.2-B1 und B2 (große Zahlen lesen und schreiben, Stufenzahlen und Größenordnung), 5.2.3-R1 und R2 (runden, Rundungsgrenzen und sinnvolle Genauigkeit), 5.2.4-S1 und S2 (Anzahlen im Bild schätzen, Schätzwege beurteilen), 5.2.5-Z1 und Z2 (Zweiersystem lesen und schreiben) und der Abstecher 5.2.X1-X1 und X2 (römische Zahlzeichen lesen und schreiben). Die Lernziele zu großen Zahlen heißen B1 und B2 und nicht G1 und G2, weil G schon für die Niveaustufe steht. Das Unterkapitel 2.1 heißt „Zahlenstrahl und Stellenwerte“, damit Tor und erster Meilenstein nicht gleich heißen. Der Abstecher zählt nicht für den Abschluss des Kapitels.

**Zahlenraum.** In diesem Kapitel ist die Zahlengröße selbst der Stoff, deshalb gilt eine eigene Staffel: 2.1 bis 1 Million (F bis 10 000), 2.2 bis zur Billion (F Millionen an der gezeichneten Stellenwerttafel), Runden auf F und G auf Zehner, Hunderter und Tausender, ab M bis zur Million mit Übertrag, Zweiersystem F bis 15, G bis 31, M bis 255, römische Zahlzeichen F bis 20 (I, V, X, nur zusammenzählen), G bis 100, M bis 3000 mit Subtraktionsregel, E bis 3999. Die 0 ist eine natürliche Zahl.

**Vier neue Eingaben.** „Ordnen“ (`ordnen`): Karten in eine Reihenfolge bringen, mit den Pfeilknöpfen an jeder Karte oder mit den Pfeiltasten. „Zeichen tippen“ (`zeichen`): römische Zahlzeichen über sieben Tasten oder eine Dualzahl über die Tasten 0 und 1, nie über die Tastatur, damit kein Kind an der Schreibweise des Geräts scheitert. „Schätzen“ (`schaetzen`, erst ab M): Richtig ist jeder Wert im Schätzbereich, ein Fünftel über oder unter der wahren Anzahl. Die wahre Anzahl wird nach der Antwort immer gezeigt. „Stellenwerttafel“: eine Tabelle mit einem Ziffernfeld je Stelle, im Zehnersystem mit den Köpfen E, Z, H, T und so weiter, im Zweiersystem mit 1, 2, 4, 8 und ab M ohne Köpfe. Zahlwörter werden nie getippt, nur zugeordnet oder ausgewählt. Das Zahlenfeld gliedert große Zahlen beim Tippen in Dreierblöcke.

**Vier neue Bilder.** Stellenwerttafel mit Ziffern oder Plättchen (`tafel`, auch mit mehreren Zeilen und zur Basis 2), Schätzbild (`schaetzbild`), Zeichentafel der römischen Zahlzeichen (`zeichentafel`) und am Zahlenstrahl ein Ausschnitt mit Bruchzeichen sowie benannte Punkte. Das Schätzbild streut ein Symbol mit festem Startwert, sodass es bei jedem Kind gleich aussieht: F mit Raster und einem ausgezählten Feld, G mit Raster, M mit Raster zum Ein- und Ausschalten, E ungleich dicht.

**Schätzen bewerten.** Auf F und G zählt der Rechenweg (ein Feld zählen, mit der Zahl der Felder malnehmen) und ist exakt. Erst ab M zählt der Schätzbereich. So bleibt auf F und G jede Aufgabe eindeutig richtig oder falsch.

**Nachrechnen der Zahlsysteme.** Der Prüfer rechnet unabhängig vom Erzeuger nach: Zahlwort zu Zahl, Stellenwerte, Runden und Rundungsgrenzen, Vergleichsketten und Reihenfolgen, Zweiersystem, römische Zahlzeichen samt Gültigkeit der Schreibweise. Neue Prüfarten im `nachweis`: `zahlwort`, `stelle`, `ziffernzahl`, `tafel`, `schrittweite`, `vergleich`, `ketten`, `ordnung`, `extremwert`, `naechste`, `runden`, `rundenwahl`, `rundungsstelle`, `rundungsgrenze`, `dual`, `roemisch`, `roemischGueltig`, `bildwert`, `strahl`.

**Schreibweisen.** Große Zahlen mit schmaler Lücke (1 250 000), „Mio.“, „Mrd.“ und ≈ ab G, keine Dezimalzahlen, „eine halbe Million“ ab M. Dualzahlen mit tiefgestellter 2 (1011₂) ab G. Echte Zahlen aus der Welt stehen nur gerundet und mit „rund“.

## Consequences

- Tor 2 bleibt für Klassen mit Klassendatei geschlossen, bis die Lehrkraft es öffnet (ADR 0022). Ohne Klassendatei ist es offen.
- 5.3.1 baut auf 5.2.1-N3 auf. Seit es dazu Aufgaben gibt, kann die Brücke dorthin führen (ADR 0017).
- Neue Bildarten für Zahlen gehören in `src/schueler/zahlenbilder.js` und brauchen im Prüfer eine Regel in `pruefeBild` und einen Eintrag in `bildZahlen`.
- Der Schätzbereich steht als `bereich` in der Aufgabe. Wer das Fünftel ändert, ändert `SCHAETZ_ANTEIL` in `tools/werkzeug.mjs` und erzeugt den Pool neu.
