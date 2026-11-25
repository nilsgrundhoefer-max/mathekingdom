# Klasse 6 Kapitel 3 „Körper“ und die Niveauübersicht Klasse 6

Nils bat am 25.11.2026 um Kapitel 3 der Klasse 6 und lieferte dazu seine Niveauübersicht Klasse 6 („Niveaustufen und Beispielaufgaben Mathematik Klasse 6“, Version 1, Stand 24.11.2026). Sie liegt jetzt unter `docs/quellen/niveaustufen-klasse-6.md`. Die Fragerunde hatte 10 Fragen zu Kapitel 3 und 6 Fragen zum Abgleich mit der Übersicht. Nils hat alle Empfehlungen übernommen und bei der Eingabe die Bildkarten gewählt.

**Kapitel 3.** Es gibt sieben Meilensteine nach den Lerneinheiten 3.1 bis 3.8. Die Einheit 3.7 (Präsentieren, MK) entfällt. Jeder Meilenstein hat zwei Lernziele mit je 24 Aufgaben, sechs auf jeder Stufe, zusammen 336:
- 3.1 Quader und ihre Netze (Q1 Ecken, Kanten, Flächen beschreiben; Q2 Netze erkennen und ergänzen)
- 3.2 Schrägbilder von Quadern (S1 lesen; S2 im Gitter vervollständigen)
- 3.3 Grundriss und Aufriss (A1 Ansichten zuordnen; A2 Ansichten zeichnen)
- 3.4 Prisma (P1 erkennen und beschreiben; P2 Netze)
- 3.5 Pyramide (Y1 erkennen und beschreiben; Y2 Netze)
- 3.6 Zylinder, Kegel und Kugel (R1 erkennen; R2 Netze und Eigenschaften)
- 3.8 Kopfgeometrie im Raum (K1 Würfelnetze falten und Spielwürfel; K2 Würfelbauten zählen, ergänzen und kippen)

**Pflicht ab M.** Der Bildungsplan verlangt das Zeichnen von Schrägbildern und Ansichten erst auf M. Deshalb tragen 3.2 und 3.3 die Marke `pflicht: 'M'` aus Klasse 7 (ADR 0044). Sie haben Aufgaben auf allen vier Stufen. Für ein Zielniveau unter M sind sie ein freiwilliger Abstecher auf der eigenen Stufe. Das Dashboard zeigt „Pflicht ab Gold“.

**Bilder.** `src/schueler/koerperbilder.js` zeichnet drei neue Bildarten.
- `koerper`: Quader, Prisma, Pyramide, Zylinder, Kegel, Kugel und Würfelbau, alle im Schrägbild nach der Kavalierperspektive. Die Tiefe ist halb so lang, also eine Kästchendiagonale je Zentimeter. Verdeckte Kanten sind gestrichelt. Die Ecken heißen unten ABCD gegen den Uhrzeigersinn, vorne links beginnend, und oben EFGH. Würfelbauten haben drei Töne für vorne, oben und rechts. Ein Spielwürfel mit Augenzahlen ist undurchsichtig und hat keine gestrichelten Kanten.
- `netz`: Würfel-, Quader-, Prismen- und Pyramidennetze aus Vielecken. Bei Prisma und Pyramide ist die Grundfläche getönt. Zylinder- und Kegelnetze haben Kreise und Kreisausschnitte.
- `risse`: Ansichten von vorne, von oben und von links, auch als Grundriss mit Turmhöhen.

Prismennetze sind immer Streifen, Pyramidennetze immer Sterne. Ein vierseitiges Prisma kommt nicht vor, weil sein Netz wie ein Quadernetz aussieht.

**Bildkarten.** Eine Auswahlaufgabe kann Bilder als Antworten haben (`optionen[].bild`). Die Antworten heißen dann A, B, C … nach dem Mischen. Am Handy stehen zwei Karten in einer Reihe. Netze mit Zahlen oder Buchstaben bekommen breitere Karten und größere Kästchen, damit die Zahlen lesbar bleiben. Kapitel 3 hat 61 Aufgaben mit Bildkarten. Auf F zählen Bildkarten als Bild, und jede Aufgabe auf F hat ein Bild, Bildkarten oder ein Gitter.

**Eingabe am Gitter.** 48 Aufgaben werden am Karogitter gelöst. Man färbt Kästchen (ein Netz ergänzen, eine Ansicht zeichnen), zeichnet verdeckte Kanten als Linie oder tippt eine Ecke an. Beim Ergänzen eines Netzes gilt jede Lösung, die faltet (`bedingung.art: 'netz'`). In 3.2 sind auf M und E je zwei von sechs Aufgaben Heftaufgaben. Ihr Kontrollwert ist die Breite des Schrägbilds in Kästchen, also 2a + b.

**Prüfung.** `tools/pruefe-koerper.mjs` rechnet jedes Bild unabhängig nach. Es zählt Ecken, Kanten und Flächen und bestimmt aus der Projektion, was verdeckt ist. Es faltet jedes Netz und berechnet jede Ansicht aus dem Würfelbau. Würfel zählt es nur, wenn der Bau ohne versteckte Würfel zählbar ist: Jeder Turm muss höher sein als alle Türme davor. Es prüft Spielwürfel (Gegenüber ergibt 7) und rechnet das Kippen Schritt für Schritt nach. Dazu kommen benannte Arten wie `eigenschaft` (gekrümmte Fläche, Spitze, ohne Ecke), `netzteile` und `spielnetz`. Die Layoutprüfung läuft für 6.3 bei 420 und 1200 Pixeln ohne Mangel. Der Browsertest löst alle 336 Aufgaben über die Oberfläche.

**Sprache.** Der Wortspeicher staffelt die Fachwörter:
- Ansicht auf F; Grundriss und Aufriss auf G; Seitenriss auf M.
- Prisma und Grundfläche auf G; Mantelfläche auf M.
- Pyramide und Spitze auf G; Seitendreieck auf M.
- Kreisausschnitt auf M.
- Würfelnetz auf G.

„Von der Seite“ heißt immer „von links“. Am Kegel werden keine Ecken gezählt. Kontexte sind der Alltag und Burgtürme, ohne Marken.

**Abgleich mit der Übersicht.**
- Jedes gebaute Lernziel der Klasse 6 trägt jetzt `bp`, den Standard im Bildungsplan 2016. Das gilt auch rückwirkend für die Kapitel 1 und 2. Der Jahresplan zeigt ihn in der Spalte „Bildungsplan“. Die späteren Kapitel bekommen ihn, wenn sie gebaut werden.
- Stufen und AFB bleiben, wie sie sind.
- Neue Prüfregel ab Kapitel 3: Der Auftrag beginnt mit dem Operator („Kreuze …“, „Gib … an.“), und es gibt keinen Auftrag als Frage mit Fragezeichen.
- Für Kapitel 1 und 2 folgt ein eigener Pull Request. Er bringt die Umstellung auf den Operator am Satzanfang, den Stolperstein „Verhältnis als Anteil“ mit E-Aufgaben in 1.5 und einen Abstecher „Teiler und Teilbarkeit“ an 1.3.
- Für die Kapitel 4 bis 10 gilt die Liste der Übersicht. Sie wird je Kapitel in dessen Fragerunde bestätigt. Kapitel 10 bleibt nur E.

**Eigene Entscheidungen beim Bau** (nicht gefragt, weil umkehrbar):
- Die Kennungen der Lernziele folgen dem Inhalt (Q, S, A, P, Y, R, K).
- Die Seitenflächen von Prisma und Pyramide werden so gedreht (`dreh`), dass keine Fläche genau von der Kante zu sehen ist.
- Ein Quader im Schrägbild hat a > b und b ≠ 2c, damit D und F nicht aufeinander und D nicht auf EF liegen.
- Ja-, Nein- und Stimmt-Antworten brauchen ein Urteil im Nachweis. Bei mehreren „Nein, weil …“-Antworten zu einem Netz passt genau eine (`gruende`).
- Das Kegelnetz legt den Grundkreis an den Bogen des Kreisausschnitts, nicht an die Spitze.

**Verworfen.** Ein Zeichenwerkzeug für freie Schrägbilder am Bildschirm wäre auf dem Handy ungenau. Schrägbilder werden deshalb am Gitter vervollständigt oder im Heft gezeichnet und mit einem Kontrollwert geprüft. Ein drehbares 3D-Modell ließe sich nicht im Schulnetz ohne Internet betreiben und nicht automatisch prüfen.
