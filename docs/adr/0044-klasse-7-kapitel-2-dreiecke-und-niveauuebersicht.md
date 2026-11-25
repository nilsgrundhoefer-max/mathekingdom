# Klasse 7 Kapitel 2 „Dreiecke“ und die Niveauübersicht Klasse 7

Nils bat am 25.11.2026 um Kapitel 2 der Klasse 7 und lieferte dazu seine Niveauübersicht Klasse 7 („Aufgabenniveaus Mathematik Klasse 7 (G / M / E) mit Beispielaufgaben“, Stand 24.11.2026). Sie liegt jetzt unter `docs/quellen/aufgabenniveaus-klasse-7.md`. Eine Fragerunde mit 12 Fragen zu Kapitel 2 und 7 Fragen zum Abgleich mit der Übersicht; Nils hat alle Empfehlungen übernommen.

**Kapitel 2.** Sieben Meilensteine nach den Lerneinheiten 2.1 bis 2.7 mit je zwei Lernzielen und drei Abstecher mit je einem, je Lernziel 24 Aufgaben, zusammen 408:
- 2.1 Winkel an Geraden (W1 Scheitel- und Nebenwinkel, W2 Stufen- und Wechselwinkel an Parallelen)
- 2.2 Winkelsumme (S1 fehlende Winkel, S2 Begründung mit der Parallelen, Vierecke, Außenwinkel)
- 2.3 Dreiecksformen (D1 einteilen und beschriften, D2 gleichschenklig und gleichseitig, Basiswinkelsatz ab M)
- 2.4 Konstruieren (K1 Kongruenzsatz erkennen und Planfigur, K2 konstruieren am Gitter und im Heft)
- 2.5 Thales (T1 erkennen und rechnen, T2 rechtwinklige Dreiecke konstruieren), daran X1 „Kreis und Tangenten“
- 2.6 Höhen (H1 einzeichnen, H2 stumpfwinklig und Höhenschnittpunkt)
- 2.7 Ortslinien (O1 Mittelsenkrechte und Kreis, O2 Winkelhalbierende und zwei Bedingungen), daran X2 „Umkreis“ und X3 „Inkreis“

**Pflicht-ab-Marke.** 2.1 und 2.5 tragen im Buch ein Sternchen, sind im Bildungsplan aber Standards auf G mit [MSA]. Sie bekommen deshalb Aufgaben auf allen vier Stufen und die neue Marke `pflicht: 'M'`: Für ein Zielniveau unter M sind sie ein freiwilliger Abstecher auf der eigenen Stufe. Anders als `ab` hebt `pflicht` die Stufe nicht an. Schüler-Dashboard, Lernpfad im Lehrer-Dashboard, Heatmap und Freigaben zeigen „Pflicht ab Gold“. Was laut Übersicht nur E ist (Tangenten, Umkreis, Inkreis), ist ein Abstecher mit `ab: 'E'` und 24 Aufgaben auf E, ein Purpur-Abstecher.

**Staffel nach der Übersicht.** G berechnet und erkennt, ohne Basiswinkelsatz und ohne Begründen; Ortslinien auf G nur Kreis und Mittelsenkrechte. M begründet mit Fachbegriff, nutzt Basiswinkelsatz, Kongruenzsätze und Thales als Satz und zeichnet maßstäblich. E: Dreiecksungleichung, SsW, Beweise, Gleichungen mit Winkeln, Fehlersuche, Umkehrung des Thales. AFB III nach der ★-Tabelle der Übersicht. Im Wortspeicher stehen Spitze und Basiswinkel ab F, Basis, antragen und Durchmesser ab G, Kongruenzsatz, Satz des Thales und Ortslinie ab M. Hypotenuse und Kathete kommen nicht vor (Klasse 8).

**Konstruieren.** Gezeichnet wird am Karogitter: Ecke antippen, Linie mit Bedingung (senkrecht, parallel, durch einen Punkt), Kreis mit Mittelpunkt und Radius. Auf F und G sind die Zirkelbögen vorgegeben; einen Bildschirmzirkel gibt es nicht. Konstruktionsschritte werden geordnet. Auf G bis E sind in K2 und T2 je zwei von sechs Aufgaben Heftaufgaben mit Kontrollwert (2 mm oder 2°), immer mit Planfigur. Im Maßstab zeigt die Planfigur die echten Längen in Metern.

**Bilder.** Neu ist `bild.art: "figur"` (`src/schueler/figurbilder.js`): Geradenkreuzung, Parallelen mit schneidender Gerade (α bis δ an g, α′ bis δ′ an h), freie Dreiecke, Thaleskreis, Höhen, Winkelhalbierende. Jede Figur ist maßstabsgetreu, jeder Winkel hat die Größe aus dem Pool. Ecken heißen gegen den Uhrzeigersinn A, B, C. Rechte Winkel haben ein Quadrat mit Punkt. Im Gitter dürfen Zirkelbögen und Thaleskreis über den Rand gehen und werden dort abgeschnitten.

**Prüfung.** `tools/pruefe-dreiecke.mjs` misst jede Figur nach (Winkel auf 0,6°, Maße im selben Maßstab, gleich markierte Seiten gleich lang) und kennt 21 benannte Prüfarten, zum Beispiel `beziehung` (Winkelpaare nach ihrer Lage im Bild), `kongruenz`, `heft` (Kontrollwert aus der Konstruktion berechnet) und `ort` (alle Gitterpunkte, die die Bedingungen erfüllen, sind genau die Lösung). Die Layoutprüfung läuft für 7.2 bei 420 und 1200 Pixeln ohne Mangel.

**Abgleich mit der Übersicht.** Jedes Lernziel der Kapitel 1 und 2 trägt `bp`, den Standard im Bildungsplan 2016; das Lehrer-Dashboard zeigt ihn über dem Lernziel. Die AFB-Folge je Niveau bleibt, weil die Übersicht AFB und Niveau ausdrücklich trennt. Stolpersteine als Pflicht im Fehlvorstellungskatalog, Operator am Anfang des Auftrags und die Angleichung der Staffel von Kapitel 1 kommen als Version 0.52.

**Eigene Entscheidungen beim Bau** (nicht gefragt, weil umkehrbar):
- Kennungen der Lernziele nach dem Inhalt (W, S, D, K, T, H, O; Abstecher T, U, I).
- Im Karogitter setzt der Erzeuger die Lage jedes Punktnamens so, dass er auf keiner Linie, keinem Kreis und keinem anderen Namen steht.
- Ordnen-Karten mit ganzen Sätzen stehen untereinander und werden mit ▲ und ▼ verschoben.
- Bei der Winkelhalbierenden steht der ganze Winkel im Text, nicht im Bild: Sein Name läge sonst genau auf der Halbierenden.
- Gleichschenklige Dreiecke haben Basiswinkel bis 74°, damit die Winkelnamen an der Basis Platz haben.

**Verworfen.** Ein Zirkel am Bildschirm wäre auf dem Handy ungenau und für die Prüfung nicht eindeutig. Konstruktionen mit beliebigen Längen statt am Gitter ließen sich nicht automatisch prüfen; sie gibt es nur als Heftaufgabe mit Kontrollwert.
