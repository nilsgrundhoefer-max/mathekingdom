# Klasse 7: Jahresplan und Kapitel 1 „Rationale Zahlen“

Nils bat am 24.11.2026 um das erste Kapitel der Klasse 7 mit einem neuen Aufgabenpool. Er lieferte das Inhaltsverzeichnis von Schnittpunkt 7, das Kompetenzraster des Verlags und die Kopiervorlagen „Was kann ich?“ zu Kapitel 1 in drei Schwierigkeitsstufen. Zwei Fragerunden mit 21 Fragen, alle Empfehlungen übernommen bis auf eine: Fahrenheit und Kelvin kommen nur als Ausnahme für eine Umrechnung vor.

**Jahresplan.** `aufgabenpool/klasse-7.json` ist der dritte Pool. Der Plan hat die acht Kapitel des Buchs mit 61 Lernzielen; die „Ich kann“-Sätze der Kapitel 2 bis 8 stammen aus dem Raster. Gebaut ist Kapitel 1. EXTRA-Einheiten mit Mathe-Inhalt sind Abstecher für alle auf vier Niveaustufen, EXTRA-Einheiten am Computer entfallen. Die beiden Sternchen-Einheiten (2.1 und 2.5) sind als Niveau-Meilenstein ab M vorgemerkt; entschieden wird beim Bau von Kapitel 2.

**Kapitel 1.** Acht Meilensteine nach den Lerneinheiten 1 bis 8 mit je zwei Lernzielen und vier Abstecher mit je einem, je Lernziel 24 Aufgaben, zusammen 480:
- 1.1 Rationale Zahlen (Z1 Alltag und Zahlengerade, Z2 Gegenzahl, Betrag, Zahlbereiche), daran der Abstecher X1 „Das Koordinatensystem“
- 1.2 Vergleichen und ordnen (V1, V2 mit Abstand und Mitte), daran X2 „Auf Zahlen gehen“
- 1.3 Addieren und 1.4 Subtrahieren (jeweils erst ganze Zahlen, dann Dezimalzahlen und Brüche)
- 1.5 Rechenvorteile (R1 Klammern und Vorzeichen auflösen, R2 vorteilhaft ordnen)
- 1.6 Multiplizieren und 1.7 Dividieren (erst ganze, dann rationale Zahlen)
- 1.8 Verbindung der Rechenarten (T1 Klammern und Punkt vor Strich, T2 Ausmultiplizieren und Ausklammern), daran X3 „Celsius und Fahrenheit“ und X4 „Girokonto“

**Staffel.** F rechnet mit ganzen Zahlen bis ±20 und hat immer ein Bild. G: ganze Zahlen bis ±100, Dezimalzahlen mit einer Stelle, Brüche nur beim Vergleichen. M: zwei Stellen nach dem Komma, gleichnamige Brüche, Betragsstriche und ℕ, ℤ, ℚ. E: ungleichnamige Brüche, große Zahlen, Fehlersuche, Rückwärtsaufgaben, Potenzen wie (−2)³. Auf F und G heißt der Betrag „Abstand zur Null“. Eine Division geht immer auf; durch null wird nur in einer Fehlersuche auf E geteilt.

**Schreibweise.** Im Pool steht immer das echte Minuszeichen „−“, nie der Bindestrich. Eine negative Zahl nach einem Rechenzeichen steht in Klammern. Das Plus vor einer positiven Zahl, „(+15)“, gibt es nur in 1.3 bis 1.5 und dort nicht auf F. Der Auftrag am Ende einer Aufgabe („Kürze vollständig.“, „Schreibe das Ergebnis mit Vorzeichen.“) steht in einer eigenen Zeile. Die Prüfung erzwingt das alles.

**Eingabe.** Neben jedem Zahlenfeld der Klasse 7 steht der Knopf „±“; er setzt das Minus und nimmt es wieder weg. Getippt zählen „-“, „−“ und „–“ gleich, „+7“ ist 7. Eine ganze Lösung gilt auch als „−4,0“, ein Geldbetrag mit und ohne Endnull. Bei der Brucheingabe gilt das Minus für die ganze Zahl; sonst prüft sie wie in Klasse 6 (vollständig gekürzt, „fast richtig“). Die Zahl ohne Minus ist fast überall als typischer Fehler `vorzeichen-vergessen` hinterlegt.

**Bilder.** Der Zahlenstrahl kann negative Zahlen und heißt dann Zahlengerade; die Null ist hervorgehoben, Brüche stehen als „−7/8“ an den Strichen. Rechenpfeile suchen sich die niedrigste freie Höhe, ihre Beschriftung eine freie Stelle am Bogen. Das Koordinatensystem hat mit `ursprung` vier Quadranten; getippt wird wie in Klasse 5 Kapitel 5. Neu sind das senkrechte Thermometer und der Kontoauszug als Tabelle, auch mit Spalte „S/H“ und mit „?“ für die gesuchte Zeile. Zahlenmauern nutzen das Format `tabelle`.

**Brücken in zwei Vorstufen.** Die Voraussetzungen liegen in Klasse 5 (natürliche Zahlen, Rechnen, Koordinatensystem, Dezimalzahlen) und Klasse 6 (Brüche vergleichen, Rechnen mit Brüchen). Die Vorstufe des Pools bringt deshalb Kopien aus beiden Pools mit, 20 Lernziele und 360 Aufgaben. Der Erzeuger liest die Kopien aus `klasse-5.json` und `klasse-6.json`; die Prüfung vergleicht sie mit beiden.

**Eigene Entscheidungen beim Bau** (nicht gefragt, weil umkehrbar):
- Kennungen der Lernziele nach dem Inhalt (Z, V, A, S, R, P, D, T; Abstecher K, W, C, B).
- Weitere Fehlvorstellungen über die zehn aus der Fragerunde hinaus, unter anderem `vorzeichen-vergessen`, `richtung-vertauscht`, `abstand-ueber-null`, `koord-vorzeichen`, `klammer-ignoriert`, `potenz-mal-exponent`.
- Eine eigene Prüfung `tools/pruefe-rational.mjs`: Sie rechnet jede Gleichung im Nachweis mit Vorzeichen, Brüchen und Dezimalzahlen nach und kennt 27 benannte Prüfarten (zum Beispiel `mauer`, `punkt`, `spiegeln`, `ordnung`, `thermowahl`).
- Triviale Ergebnisse werden neu gezogen: eine Bruchsumme 0, eine Mitte, die eine ganze Zahl ist, ein Punkt auf der Achsenbeschriftung.
- Im Format `luecken` bleibt eine Lücke mit dem Zeichen davor und der Einheit dahinter in einer Zeile.
- Fahrenheit und Kelvin: fünf Aufgaben auf M und E, immer mit der Formel im Text. Alles andere im Abstecher rechnet in Grad Celsius.

**Verworfen.** Ein eigenes Format für Zahlen mit Vorzeichen hätte Lehrer-Dashboard, Auswertung und Aufgabentester verdoppelt; das Format `zahl` liest das Vorzeichen jetzt mit. Heftaufgaben für Rechenwege gibt es weiterhin nicht: In 1.5 und 1.8 stehen die Schritte auf F und G als Lücken.

**Grenzen.** Zahlengeraden mit vielen Strichen lassen sich am Handy seitlich schieben, wie die Zahlenstrahlen bisher. Für Klasse 6 fehlen im Pool noch die Kapitel zu Dezimalzahlen; die Brücken für Dezimalzahlen führen deshalb nach Klasse 5 Kapitel 9.
