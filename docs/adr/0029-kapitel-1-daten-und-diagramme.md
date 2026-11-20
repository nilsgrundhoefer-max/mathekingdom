# Kapitel 1 „Daten und Diagramme“: neue Formate und feste Regeln für Diagramme

Nils bat am 20.11.2026 um eine vollständige Aufgabensammlung zu Klasse 5, Kapitel 1, für alle Niveaus. Zwei Fragerunden (Q1 bis Q10), alle Empfehlungen übernommen. Seine Bedingung: „Die Darstellung muss 100 % sauber, intuitiv und richtig sein.“

**Umfang.** Neun Lernziele (5.1.1-H1 und H2 Strichliste und Häufigkeitstabelle, 5.1.2-L1 und L2 Säulen- und Bilddiagramm lesen, 5.1.3-Z1 und Z2 Diagramme zeichnen, 5.1.4-V1 und V2 vergleichen und prüfen, 5.1.5-U1 eigene Umfrage), je sechs Aufgaben auf F, G, M und E, zusammen 216. Das Lernziel zur Umfrage heißt U1, weil E schon für die Niveaustufe steht. Die Sachkontexte stammen meist aus dem Alltag (Umfragen in der Klasse, Bücherei, Besucher), einige aus dem Königreich (Burghof, Ernte, Kundschafter).

**Zwei neue Eingaben.** „Strichliste anlegen“ (`strichliste`) und „Säulen zeichnen“ (`zeichnen`). Beide bedient das Kind mit Maus und Tastatur. Auf F und G legt das Programm den fünften Strich quer; ab M setzt das Kind den Querstrich selbst, und ein falsches Bündel zählt als Fehler (Q8). Säulen rasten auf den Linien ein. Beim Ziehen läuft keine Zahl mit, damit das Kind wirklich an der Achse abliest; „Säule zurücksetzen“ stellt die gewählte Säule zurück (Q6).

**Drei neue Bilder.** Strichliste, Säulen- oder Balkendiagramm, Bilddiagramm. Ein Symbol je Bilddiagramm, der Schlüssel oben. Auf F und G nur ganze Bilder, ab M auch halbe, senkrecht in der Mitte geteilt (Q7).

**Achsen.** Jede Achse beginnt bei 0 und geht in gleichen Schritten; jeder Wert liegt auf einer Linie. Auf F ist jede Linie beschriftet, ab G jede zweite oder fünfte. Die einzige Ausnahme sind die Aufgaben zu täuschenden Diagrammen in V2 auf M und E, die gerade die abgeschnittene Achse zum Thema haben (Q9). Der Prüfer erzwingt das.

**Nachrechnen an den Daten.** Weil viele Antworten Namen statt Zahlen sind („Welches Tier wurde am häufigsten gewählt?“), liest der Prüfer sie selbst aus Bild, Urliste oder Tabelle nach. Neue Prüfarten im `nachweis`: `ablesen`, `zeile`, `aussage`, `aussagen`, `rangfolge`, `datenwahl`, `einteilung`, `mangel`, `schluessel`, `linienabstand`. Eine falsch angekreuzte Antwort fällt bei diesen Aufgaben immer auf; das sichert `tests/pruefer.test.js`.

**Bilderbogen.** `tools/bilderbogen.mjs` zeichnet jede Aufgabe mit den echten Eingaben und dem Stil der App und schreibt ein PDF zur Durchsicht vor dem Zusammenführen (Q10).

## Consequences

- Ohne Vorgabe der Lehrkraft beginnt die Etappe der Startseite jetzt in Kapitel 1, weil es das erste Kapitel mit Aufgaben ist. Auch die Testklasse startet dort.
- Die Urliste ist nur eine Zählhilfe: Das Abhaken einer Antwortkarte wird nicht gespeichert und nicht bewertet.
- Neue Bildarten für Daten gehören in `src/schueler/datenbilder.js` und brauchen im Prüfer eine Regel in `pruefeBild`.
