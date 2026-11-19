# Beiname ändern kostet nach der ersten Wahl Münzen

Nils wünschte sich am 19.11.2026, dass Schüler ihren Namen für die Spiele einmal kostenlos ändern können und danach jede Änderung Münzen kostet, damit niemand dauernd wechselt. Gemeint ist der Beiname auf der Bestenliste (ADR 0018). Er hat in einer Fragerunde alle Empfehlungen übernommen.

**Erste Wahl frei, dann fest 50 Münzen.** Der Beiname aus dem Code, den jeder ohne eigene Wahl bekommt, zählt nicht als Wahl. Die erste eigene Wahl ist kostenlos, jede weitere kostet 50 Münzen, immer gleich viel. Ein steigender Preis (50, 100, 150 …) wurde verworfen, weil er schwerer zu verstehen ist und eher bestraft als bremst.

**Auch wer schon gewählt hat, bekommt die freie Wahl.** Mit 0.14 und 0.15 konnten Schüler den Beinamen beliebig oft wechseln, ohne zu wissen, dass das einmal etwas kostet. Damit sich niemand reingelegt fühlt, hat ab dieser Version jeder genau eine kostenlose Änderung, egal ob er schon gewählt hat.

**Eine Änderung umfasst beide Bausteine.** Bisher speicherte jede der beiden Auswahllisten sofort. Jetzt stellt der Schüler Vorder- und Hinterteil in Ruhe ein, sieht eine Vorschau und speichert erst mit „Beiname ändern“ (mit Preis, beim ersten Mal „kostenlos“). Davor kommt eine kurze Rückfrage, dass danach jede Änderung 50 Münzen kostet.

**Verworfen.** Eine Lehrkraft-Funktion (Änderung schenken, Preis einstellen): Die Bausteine sind harmlos, das Lehrer-Dashboard bleibt schlank. Eine Sperre für schon vergebene Beinamen: Sie bräuchte aktuelle Stände aller Mitschüler und wäre ohne Netz unzuverlässig; auf der Bestenliste unterscheidet das Wappen zwei gleiche Beinamen. Kosten für das Umlegen von Wappenteilen: Die Teile sind schon bezahlt, und das Wappen ist kein Name.

## Consequences

- Der Speicherstand merkt sich, ob die kostenlose Änderung schon verbraucht ist. Alte Stände gelten als „noch nicht verbraucht“, auch wenn ein Beiname gewählt ist.
- Die Beiname-Karte bekommt einen Knopf mit Preis und eine Rückfrage; reicht das Münzgeld nicht, ist der Knopf gesperrt.
- Die 50 Münzen sind ausgegeben wie bei einem Wappenteil, es gibt nichts zurück.
