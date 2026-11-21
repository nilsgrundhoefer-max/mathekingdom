# Kapitel 6 „Größen und Sachaufgaben“: Größen als ganze Zahlen, das Komma nur als Schreibweise

Nils bat am 21.11.2026 um die Aufgaben zu Klasse 5, Kapitel 6. Zwei Fragerunden, alle Empfehlungen übernommen, danach das Gesamtbild freigegeben.

**Umfang.** Fünfzehn Lernziele, je sechs Aufgaben auf F, G, M und E, zusammen 360: 5.6.1-S1 und S2 (passende Einheit und Vergleich aus dem Alltag; mit einer Vergleichsgröße schätzen), 5.6.2-B1 und B2 (Geldbeträge schreiben und umwandeln; mit Geld rechnen), 5.6.3-Z1 und Z2 (Zeiteinheiten umwandeln; Zeitpunkte und Zeitspannen), 5.6.4-W1 und W2 (Gewichtseinheiten umwandeln; mit Gewichten rechnen), 5.6.5-L1 und L2 (Längeneinheiten umwandeln; mit Längen rechnen), 5.6.6-K1 und K2 (von der Karte in die Wirklichkeit; von der Wirklichkeit in den Maßstab und Maßstab bestimmen), 5.6.7-A1 und A2 (Sachaufgaben Schritt für Schritt; mehrere Schritte und überflüssige Angaben) und der Abstecher 5.6.X1 (Beruf und Alltag). Der Pool wächst von 1968 auf 2328 Aufgaben.

**Das Komma ist nur eine Schreibweise.** Dezimalzahlen kommen erst in Klasse 6. In Klasse 5 steht „3,50 €“ für 3 € und 50 ct, „2,5 km“ für 2 km und 500 m. Gerechnet wird deshalb nie mit Kommazahlen: Wer mit Kommagrößen rechnen soll, wandelt zuerst in die kleinere Einheit um. Das Programm hält es genauso und führt jede Größe als ganze Zahl in ihrer Grundeinheit (Cent, Millimeter, Milligramm, Sekunde). Die Alternative, echte Dezimalzahlen mit Rundung, hätte dem Lehrplan vorgegriffen und Rundungsfehler in den Vergleich von Eingaben gebracht.

**Eingabe einer Größe.** Im neuen Format `groesse` tippt das Kind eine Zahl und wählt oder sieht die Einheit. Richtig ist jede Schreibweise mit demselben Wert: 2,5 km, 2500 m oder 2 500 m. Fehlt die Einheit oder gehört sie zu einer anderen Größenart, ist das der typische Fehler „Einheit fehlt“. So wird die Einheit Teil der Antwort, ohne dass eine von mehreren richtigen Schreibweisen als falsch gilt.

**Staffel.** Geld steht auf F gemischt („3 € 50 ct“), ab G mit Komma und zwei Nachkommastellen. Länge und Gewicht stehen bis G gemischt oder in einer Einheit, das Komma kommt ab M. Die Brüche ½, ¼ und ¾ (eine halbe Stunde, ein Viertel Kilogramm) und das Milligramm gibt es ab M, den Tag als Einheit ab G. Die Zeigeruhr gibt es nur auf F. Die Einheitentafel füllt das Kind auf F selbst aus, auf G steht sie im Tipp. Maßstab: auf F eine Maßstabsleiste, auf G 1:100 und 1:1000, auf M 1:25 000 und 1:50 000, auf E den Maßstab bestimmen und Vergrößerungen wie 10:1. Bei K2 sind auf M und E je zwei von sechs Aufgaben Heftaufgaben mit Kontrollwert. Liter und Hohlmaße gehören nicht in dieses Kapitel. Es heißt durchgehend „Gewicht“, nicht „Masse“.

**Sachaufgaben.** Auf F und G sind sie geführt: wichtige Angaben ankreuzen, Rechnung wählen, ausrechnen, Antwortsatz wählen. Auf M kommen zwei Größenarten in einer Aufgabe vor, auf E überflüssige oder fehlende Angaben und ein Überschlag. Der Antwortsatz wird gewählt und nicht frei geschrieben, weil das Programm einen freien Satz nicht gerecht bewerten kann. Die Teilaufgaben einer Sachaufgabe dürfen dafür Auswahlantworten haben (`optionen`, wahlweise `mehrfach`).

**Bilder.** Neu sind Münzen und Scheine (`geld`), Zeigeruhr (`uhr`), Waage mit Gewichtsstücken (`waage`), Einheitentafel (`einheitentafel`), Vergleichsbild zum Schätzen (`vergleichsbild`), Karte mit Lineal (`karte`), Grundriss (`grundriss`) und Zeitleiste (`zeitleiste`). Ein Bild darf auch im Tipp stehen (`tippBild`).

**Nachrechnen.** Der Prüfer rechnet Kapitel 6 unabhängig vom Erzeuger in Grundeinheiten nach (`tools/pruefe-groessen.mjs`): Umwandlungen, Rechnungen mit Größen, Vergleiche, Reihenfolgen, Maßstab und die Ziffern der Einheitentafel. Jede Größe im Aufgabentext muss im Nachweis vorkommen oder im Bild stehen, außer die Aufgabe weist sie ausdrücklich als überflüssig aus. Auf F und G steht je Zeile ein Satz mit höchstens 14 Wörtern.

## Consequences

- Tor 6 bleibt für Klassen mit Klassendatei geschlossen, bis die Lehrkraft es öffnet (ADR 0022).
- Rechnen mit Größen gehört in `src/schueler/groessen.js`, die Bilder dazu in `src/schueler/groessenbilder.js`. Beides kommt ohne Kommazahlen aus.
- Kapitel 9 (Brüche und Dezimalzahlen) kann auf dieser Grundlage aufbauen, braucht für echtes Rechnen mit Kommazahlen aber eine eigene Entscheidung.
- Flächeneinheiten (Kapitel 8) lassen sich als weitere Größenart ergänzen; ihre Umrechnungszahl 100 ist in `EINHEITEN` noch nicht vorgesehen.
- Uhrzeiten werden als zwei Lücken eingegeben (`{{a}}:{{b}} Uhr`), nicht als Größe, weil ein Zeitpunkt keine Zeitspanne ist.
- Die Heftaufgaben beim Maßstab vertrauen dem Kind wie in Kapitel 5 (ADR 0032).
