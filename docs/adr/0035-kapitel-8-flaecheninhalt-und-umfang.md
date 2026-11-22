# Kapitel 8 „Flächeninhalt und Umfang“: Figuren aus Rechtecken, Raster bis G, Skizzen ab M

Nils bat am 22.11.2026 um die Aufgaben zu Klasse 5, Kapitel 8. Zwei Fragerunden, alle Empfehlungen übernommen, danach das Gesamtbild freigegeben. Sein Auftrag aus Kapitel 7 gilt weiter: „Achte besonders auf die korrekte Darstellung und das Layout der Aufgaben.“

**Umfang.** Neun Lernziele, je sechs Aufgaben auf F, G, M und E, zusammen 216: 5.8.1-Z1 und Z2 (Flächeninhalte durch Abzählen vergleichen; Umfang bestimmen und vom Flächeninhalt unterscheiden), 5.8.2-H1 und H2 (Flächeneinheiten wählen; umwandeln), der Abstecher 5.8.X1-A1 (Flächen mit Stützgrößen schätzen), 5.8.3-R1 und R2 (Rechteck und Quadrat berechnen; fehlende Seiten und Sachaufgaben) und 5.8.4-S1 und S2 (zusammengesetzte Figuren: Flächeninhalt; Umfang). Der Pool wächst von 2592 auf 2808 Aufgaben. Tor 8 bleibt zu, bis die Lehrkraft es öffnet.

**Staffel.** 8.1 zählt Kästchen ohne Einheit. Ab 8.2 liegt ein Zentimeterraster darunter, ein Feld ist 1 cm². Einheiten: F cm², dm² und m², G dazu mm² und km², ab M dazu a und ha. Umwandeln: F benachbarte Einheiten, G gemischte Schreibweise (5 m² 17 dm²), M zwei Schritte, E Fehlersuche (Umrechnungszahl 10 statt 100). Flächen kommen ohne Komma aus. Zusammengesetzte Figuren bestehen nur aus Rechtecken: F zeigt die Zerlegung, G zerlegt das Kind selbst, M hat fehlende Seiten, E rechnet auf zwei Wegen (Zerlegen und Ergänzen) und mit Rahmen.

**Raster bis G, Skizze ab M.** Bis G steht jede Figur maßstäblich auf dem Raster, das Kind kann nachzählen. Ab M sind Maße zu groß für ein Raster; die Figur steht als Skizze mit dem Hinweis „Skizze, nicht maßstäblich“. Eine Skizze bleibt in ihren Seitenverhältnissen nahe an der echten Figur (höchstens 1 : 4), sonst wird die Aufgabe neu gewürfelt. Auf M und E sind bei R1 zwei von sechs Aufgaben Heftaufgaben mit Kontrollwert (Umfang in mm, 2 mm Spielraum) wie in Kapitel 5 und 7.

**Bildregeln.** Maße stehen außen, mittig an der Seite; eine gefragte Seite trägt ein rotes Fragezeichen. Die Zerlegung ist gestrichelt, und zwar nur dort, wo zwei Teilflächen aneinanderstoßen, je Strecke genau einmal (zwei übereinanderliegende Strichmuster füllten sich gegenseitig die Lücken und sahen durchgezogen aus). Teilflächen sind farbig und nummeriert, ein Loch ist weiß. Die Seite für ein Maß an einer Stufe (L, T, Treppe) wird an mehreren Stellen der Kante geprüft, damit die Zahl nicht auf der Fläche landet.

**Kästchen färben mit Bedingung.** Neue Variante im Gitterzeichnen (`bedingung.art: 'flaeche'`): Das Kind färbt eine Figur mit so vielen Kästchen, mit diesem Umfang oder als Rechteck. Jede passende Figur ist richtig, die Kästchen müssen über Seiten zusammenhängen. Rechnung in `src/schueler/flaeche.js`, Bilder in `src/schueler/flaechenbilder.js`.

**Stützgrößen.** Heftseite etwa 6 dm², aufgeklappte Zeitung etwa 1 m², Postkarte etwa 150 cm², Klassenzimmer etwa 60 bis 80 m², Fußballfeld etwa 70 a. Auf F und G zeigt ein Raster, wie oft die Stützgröße hineinpasst; die Legende nennt das Ding („= 1 Heftseite“). Bei der Wahl der Einheit gibt es keine Antwort, die auch stimmen könnte (ein Wald kann 30 ha oder 30 km² groß sein, also steht ha dort nicht zur Wahl).

**Prüfung.** Der Prüfer rechnet Flächeninhalt und Umfang jeder Figur unabhängig vom Erzeuger nach (`tools/pruefe-flaechen.mjs`). `node tools/pruefe-layout.mjs 5.8.` prüft alle 216 Aufgaben bei 420 und 1200 Pixel Breite und kennt jetzt auch Maßzahlen, Figurnamen und Teilnummern; neu ist die Regel, dass keine Maßzahl auf der Fläche steht (außer in einem Loch). Claude hat jede Seite des Bilderbogens angesehen und dabei unter anderem die durchgezogen wirkende Zerlegung, eine Maßzahl auf der Stufe einer L-Figur und zu schmale Skizzen behoben.

**Fehlvorstellungen.** Zehn neue, darunter „Umfang und Flächeninhalt verwechselt“, „gleicher Umfang, gleiche Fläche“, „Umrechnungszahl 10 statt 100“, „innere Linie zum Umfang gezählt“ und „Loch nicht abgezogen“.

## Consequences

- Flächen rechnen gehört in `src/schueler/flaeche.js`, die Bilder dazu in `src/schueler/flaechenbilder.js`.
- Figuren sind Listen von Rechtecken. Schräge Seiten, Dreiecke und Parallelogramme kommen erst in Klasse 6 und brauchen dann ein eigenes Modell.
- Die Heftaufgaben vertrauen dem Kind wie in Kapitel 5 bis 7.
