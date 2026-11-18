# Verteiltes Wiederholen, Diagnose und kooperative statt wettbewerbliche Gamification

Am 18.11.2026 hat Nils in zwei Fragerunden aus einem Vergleich mit Khan Academy, ALEKS, Eedi, bettermarks, Sparx Maths und Desmos Classroom ausgewählt, was Mathekingdom noch fehlt. Leitlinie: lernpsychologisch gut belegte Bausteine (verteiltes und gemischtes Üben, Vorwissensdiagnose, Rückgriff auf Voraussetzungen, Hyperkorrektur) ergänzen, bei der Gamification nur Elemente, die Kompetenzerleben und Zusammenhalt stärken und zur Kundschafter-Erzählung passen.

**Entschieden.** Rückblick, Einstiegscheck, Brücken zu Voraussetzungen, Sicherheitsangabe (als Probe pro Klasse), Heftcode und Heftcheck, Nebel auf der Regionskarte, Expedition als gemeinsames Klassenziel, Tafelbild für die Lehrkraft und das Aufgabenformat „Wer hat recht?“ auf M und E (AFB III, erst in den Erzeugern künftiger Kapitel). Begriffe und Regeln stehen in CONTEXT.md.

**Siegel gehen nie verloren.** Khan Academy senkt den Mastery-Stand, wenn eine Wiederholung misslingt. Wir nicht: Ein Fehler im Rückblick macht das Lernziel nur für die Lehrkraft „aufzufrischen“. Das folgt der Regel aus ADR 0012, dass Änderungen immer zugunsten des Schülers ausfallen.

**Einstiegscheck schließt nichts ab.** Er stellt nur die Kronenwahl vor. Sonst gäbe es zwei Wege zu einem Siegel, und die Lernziel-Regel (drei Aufgaben, zwei auf Zielniveau, eine aus AFB II/III) würde unterlaufen.

**Sicherheitsangabe ohne Extra-Klick.** Zwei Prüfen-Knöpfe statt eines, nur beim ersten Versuch, ohne Wirkung auf Münzen. Claude hatte davon abgeraten, weil die Selbsteinschätzung schon Metakognition fördert; Nils will den Hyperkorrektur-Effekt ausprobieren. Nach etwa vier Wochen werten wir die Probe aus.

**Expedition ohne Einzelvergleich.** Jeder sieht den Klassenstand und nur seinen eigenen Beitrag. Bloßes Durchklicken zählt nicht, nur Siegel und höchstens ein Rückblick am Tag.

**Jetzt nicht gebaut.** Streaks, Bestenlisten und Zufallsbelohnungen (Truhen, Lootboxen), weil sie laut Forschung (Selbstbestimmungstheorie, Hanus & Fox 2015) die intrinsische Motivation schwächerer Schüler untergraben können. Nils hat das „erstmal“ zurückgestellt, nicht für immer ausgeschlossen. Ebenfalls verworfen: Siegel verblassen lassen.

## Consequences

- Der Aufgabenpool braucht für jedes Lernziel Verweise auf seine Voraussetzungen; sie entstehen in den Erzeugern unter tools/, nie von Hand in der JSON.
- Der Speicherstand bekommt Felder für Rückblick-Fälligkeiten, Sicherheitsangaben, Heftcodes und Expeditionszeichen; die Klassendatei Felder für Expedition, Pflicht-Einstiegschecks und den Schalter der Sicherheitsangabe.
- Bau in drei Versionen, je ein PR nach main: (1) Nebel, Expedition, Rückblick; (2) Sicherheitsangabe, Heftcheck, Tafelbild; (3) Einstiegscheck und Brücken.
