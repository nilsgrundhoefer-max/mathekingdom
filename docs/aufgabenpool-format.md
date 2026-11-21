# Aufbau des Aufgabenpools

Pro Klassenstufe gibt es eine Datei `aufgabenpool/klasse-N.json`. Sie enthält den Jahresplan und alle Aufgaben der Klassenstufe und keine personenbezogenen Daten.

## Arbeitsablauf

Die Datei wird nicht von Hand geschrieben, sondern erzeugt:

```
node tools/erzeuge-klasse-5.mjs   # schreibt aufgabenpool/klasse-5.json
node tools/pruefe-pool.mjs        # prüft Aufbau, Abdeckung und rechnet Rechenaufgaben nach
node tools/uebersicht.mjs         # schreibt docs/aufgaben-klasse-5-pilot.md zur Durchsicht
```

Der Zufall im Erzeuger ist fest geimpft: Gleicher Code ergibt dieselbe Datei. Einzelne Aufgaben korrigiert man deshalb im Erzeuger, nicht in der JSON-Datei. Der Jahresplan steht in `tools/jahresplan-klasse-5.mjs`.

## Oberste Ebene

| Feld | Inhalt |
|---|---|
| `version` | Version des Dateiaufbaus |
| `klassenstufe` | 5 bis 10 |
| `fehlvorstellungen` | Katalog: Kürzel → `beschreibung` (für die Diagnose) `hinweis` (Rückmeldung an den Schüler nach dem ersten falschen Versuch) und `kind` (Satz in einfacher Sprache für den Aha-Moment, ADR 0017) |
| `kompetenzen` | Die fünf prozessbezogenen Kompetenzen: Kürzel → Name (ADR 0017) |
| `kapitel` | Jahresplan: Kapitel → Unterkapitel → Lernziele. Jedes Lernziel trägt `voraussetzungen` (Liste, leer heißt: nur Grundschulstoff). Ein Unterkapitel mit Aufgaben trägt einen `merkzettel` mit `regeln` (Liste), `beispiel` und `heft`. Die Texte stehen in `tools/jahresplan-klasse-5.mjs`. |
| `aufgaben` | Liste aller Aufgaben |

Kennungen: Kapitel `5.3`, Unterkapitel `5.3.3` (Extras `5.2.X1`), Lernziel `5.3.3-S2`, Aufgabe `5.3.3-S2-G-01`.

## Felder jeder Aufgabe

| Feld | Inhalt |
|---|---|
| `id` | Lernziel, Niveaustufe und laufende Nummer |
| `lernziel` | Kennung des Lernziels, das die Aufgabe nachweist |
| `niveau` | `F`, `G`, `M` oder `E` |
| `afb` | Anforderungsbereich `1`, `2` oder `3`. Der Erzeuger setzt ihn nach einer Faustregel je Lernziel und Niveaustufe (Kopfrechnen und schriftliches Rechnen I; Klammern berechnen I, auf E II; geschickt und vorteilhaft rechnen, Gesetze erkennen wie Fachbegriffe; Rechenausdruck aufstellen wie Sachaufgaben; Fachbegriffe, Überschlag, Probe, Rest deuten auf F und G I, auf M und E II; Sachaufgaben II, auf E III). Eine Aufgabe kann davon abweichen. Seit ADR 0015 gilt für alle Lernziele die feste Folge je Niveaustufe: F I, I, I, I, II, I; G I, I, II, I, II, III; M I, II, II, I, II, III; E I, II, II, III, II, III. |
| `kompetenz` | Prozessbezogene Kompetenz nach Bildungsplan 2016: `[haupt]` oder `[haupt, neben]` aus `argumentieren`, `probleme-loesen`, `modellieren`, `symbolisch`, `kommunizieren`. Der Erzeuger setzt sie je Aufgabenmuster (`kompetenzVon` in `tools/werkzeug.mjs`): zuerst nach Lernziel (Fachbegriffe Kommunizieren, Sachaufgaben und Rechenausdruck aufstellen Modellieren), dann „Wer hat recht?“, „Warum“ und Urteile als Argumentieren, Knobel-Nachweise als Probleme lösen. `extra.kompetenz` geht vor. |
| `format` | Aufgabenformat, siehe unten |
| `text` | Aufgabentext |
| `hilfen` | die Hilfekärtchen: auf F und G `tipp`, `beispiel`, `loesungsschritt`, auf M `tipp` und `loesungsschritt`, auf E nur `tipp` (ADR 0015) |
| `nachweis` | Liste der Rechnungen, die zur Lösung führen (`"62 + 15 = 77"`), oder Einträge mit benannter Prüfart (`{ "art": "ziffern", … }`). Der Prüfer rechnet sie unabhängig nach. Fehlt nur bei Aufgaben zu Fachbegriffen und Begründungen in Worten. |
| `bild` | optional: ein schematisches Bild, siehe unten. Auf F Pflicht, wenn die Aufgabe nicht schon Zahlenstrahl, Diagramm oder Rechenraster zeigt. |

## Aufgabenformate

**`zahl`**: Eine natürliche Zahl wird eingegeben. `loesung` ist die Zahl, `einheit` (optional) wird hinter dem Eingabefeld angezeigt und nicht getippt. `typischeFehler` ist eine Liste aus `wert` und `fehlvorstellung`.

**`auswahl`**: `optionen` mit `text`, `richtig` und optional `fehlvorstellung`. Bei `mehrfach: true` müssen genau alle richtigen Optionen angekreuzt werden.

**`luecken`**: Im `text` stehen Lücken als `{{name}}`. `luecken` ordnet jedem Namen `loesung` und `typischeFehler` zu. Alle Lücken müssen stimmen.

**`zuordnen`**: `paare` aus `links` und `rechts`. Das Dashboard mischt die rechte Seite.

**`sachaufgabe`**: Ein gemeinsamer `text` und mehrere `teile`. Jeder Teil ist wie eine `zahl`-Aufgabe aufgebaut. Alle Teile müssen stimmen.

**`zahlenstrahl`**: `strahl` beschreibt den Strahl mit `von`, `bis`, `schritt` (Abstand der Teilstriche) und `beschriftung` (Abstand der beschrifteten Striche). Optional markiert `start` einen Punkt, `spruenge` (Liste aus `von`, `nach`, `text`) zeichnet Bögen und `pfeil` zeigt mit einem Fragezeichen auf eine Stelle. Bei `eingabe: "markieren"` tippt der Schüler auf einen Teilstrich, bei `eingabe: "ablesen"` gibt er die Zahl ein. `loesung` und `typischeFehler` wie bei `zahl`. Die Lösung muss auf einem Teilstrich liegen.

**`diagramm`**: `diagramm` beschreibt ein Säulendiagramm mit `titel`, `einheit`, `max`, `schritt` (Beschriftung der Achse), `hilfslinien` (Abstand feinerer Linien, optional), `werteZeigen` (Werte über den Säulen, sonst muss abgelesen werden) und `saeulen` aus `name` und `wert`. Dazu `teile` wie bei der `sachaufgabe`. Jeder Wert muss auf einer Linie liegen, damit er sich ablesen lässt.

**`tabelle`**: `tabelle` hat einen `kopf` und `zeilen`. Eine Zelle ist ein Text oder eine Lücke `{ "luecke": "name" }`. `luecken` ordnet jedem Namen `loesung` und `typischeFehler` zu, wie beim Format `luecken`. Alle Lücken müssen stimmen. Mit `art: "raster"` wird die Tabelle als Rechenraster gezeichnet (Spalten H, Z, E, ein Feld je Ziffer); `rechnung` nennt dann `zeichen`, `zahlen` und `ergebnis`, und der Prüfer vergleicht die Ziffern der Lücken mit dem Ergebnis.

**`strichliste`** (Kapitel 1, ADR 0029): Das Kind legt eine Strichliste an. `zeilen` aus `name`, `loesung` (Anzahl der Striche am Ende) und optional `start` (so viele Striche stehen schon da und lassen sich nicht wegnehmen). `buendeln` ist auf F und G `"auto"` (das Programm legt den fünften Strich quer) und ab M `"selbst"` (das Kind setzt den Querstrich, ein falsches Bündel ist ein Fehler). Die Antworten stehen meist als `urliste` dabei; dann ist `start` plus Anzahl in der Urliste die Lösung.

**`zeichnen`** (Kapitel 1, ADR 0029): Das Kind zieht Säulen auf die richtige Höhe. `diagramm` wie beim Bild `saeulen`; Säulen mit `offen: true` sind zu zeichnen, ihr `wert` ist die Lösung, `start` (optional) die Höhe zu Beginn. Jeder Wert und jeder Start liegt auf einer Linie (`fein`), mindestens eine Säule muss bewegt werden. Steht eine Tabelle `daten` dabei, muss das Diagramm zu ihr passen.

**`ordnen`** (Kapitel 2, ADR 0030): `karten` liegen gemischt da, `loesung` nennt dieselben Karten in der verlangten Reihenfolge (drei bis sechs). Der Text sagt „Beginne mit der kleinsten“ oder „mit der größten“. Optional `umgekehrt` (Fehlvorstellung, wenn genau falsch herum geordnet wurde), `sonst` (Fehlvorstellung für jede andere falsche Reihenfolge), `links` und `rechts` (Beschriftung der Enden). Der Nachweis `ordnung` mit `richtung` und optional `system` (`roemisch`, `dual`, `wort`) ist Pflicht.

**`zeichen`** (Kapitel 2, ADR 0030): Das Kind tippt eine Zeichenfolge über `tasten`, entweder die sieben römischen Zahlzeichen oder `0` und `1`. `loesung` und die `wert` der `typischeFehler` sind Zeichenfolgen aus diesen Tasten. Der Nachweis `roemisch` oder `dual` zur Lösung ist Pflicht.

**`schaetzen`** (Kapitel 2, ADR 0030, erst ab M): `bild` ist ein `schaetzbild`, `loesung` die wahre Anzahl, `bereich` der Schätzbereich aus kleinstem und größtem richtigen Wert (ein Fünftel darunter und darüber). `typischeFehler` sind Bereiche aus `von`, `bis` und `fehlvorstellung`. Nach der Antwort zeigt das Dashboard immer die wahre Anzahl.

**`gitter`** (Kapitel 5, ADR 0032): Gitterzeichnen. `gitter` beschreibt das Karogitter wie das Bild `gitter`, `eingabe` ist `punkte`, `linie` oder `zellen`. Bei `punkte` und `zellen` ist `loesung` die Liste der Gitterpunkte oder Kästchen (`[x, y]`, ein Kästchen heißt nach seiner linken unteren Ecke); richtig ist genau diese Menge, die Reihenfolge ist gleichgültig. `typischeFehler` sind Listen aus `punkte` und `fehlvorstellung`. Mit `offen: true` verrät die Eingabe nicht, wie viele Punkte gesucht sind, mit `verbinden: true` verbindet das Dashboard die gesetzten Punkte zu einer Figur. Bei `linie` tippt das Kind zwei Punkte, `linie` nennt die Art (`strecke`, `strahl`, `gerade`), und richtig ist jede Linie, die die `bedingung` erfüllt: `strecke` (`a`, `b`), `gerade` (`a`, `b`), `eine` (`linien`, eine von mehreren Geraden), `senkrecht` (`zu`, optional `durch`), `parallel` (`zu`, optional `durch`, `abstand` in Kästchen) oder `laenge` (`laenge` in Kästchen, optional `von`, `auf`). `beispiel` ist eine richtige Linie für das Lösungsbild; `typischeFehler` sind Listen aus `bedingung` und `fehlvorstellung`. Die Eingabe steht als Text `(3|5) (4|1)` im Speicherstand.

**`groesse`** (Kapitel 6, ADR 0033): Das Kind tippt eine Zahl mit Einheit. `groesse` ist die Größenart (`geld`, `laenge`, `gewicht`, `zeit`), `loesung` der Wert als ganze Zahl in der Grundeinheit (Cent, Millimeter, Milligramm, Sekunde) und `einheit` die Einheit, in der die Lösung gezeigt wird. Mit `einheiten` wählt das Kind die Einheit selbst aus dieser Liste, sonst steht `einheit` fest neben dem Feld. Richtig ist jede Schreibweise mit demselben Wert (2,5 km, 2500 m). Die `wert` der `typischeFehler` stehen ebenfalls in der Grundeinheit. Ohne Einheit oder mit einer Einheit einer anderen Größenart gilt die Fehlvorstellung `einheit-fehlt`.

In einer `sachaufgabe` darf eine Teilaufgabe seit Kapitel 6 Auswahlantworten haben: `optionen` wie bei `auswahl`, wahlweise `mehrfach`, dazu `art` (`angaben`, `rechnung`, `antwort` oder `fehlt`). So kreuzt das Kind die wichtigen Angaben an, wählt die Rechnung und den Antwortsatz.

Eine `tabelle` mit `art: "einheitentafel"` (Kapitel 6) ist eine Einheitentafel zum Eintragen: `gruppen` nennt die Einheiten mit ihrer Spaltenzahl, je Lücke steht genau eine Ziffer, und `ablesen` (`text`, `luecke`, `einheit`) fragt darunter den Wert in der kleineren Einheit ab.

Neben `hilfen` darf `tippBild` stehen: ein Bild, das erst mit dem Tipp erscheint (Kapitel 6: die Einheitentafel auf G).

Bei `zahl` erlaubt `toleranz` eine Abweichung (Kapitel 5: Heftaufgaben mit Kontrollwert, immer 2 mm).

Eine `tabelle` mit `art: "stellentafel"` (Kapitel 2) ist eine Stellenwerttafel zum Eintragen: je Lücke genau eine Ziffer, die Köpfe sind E, Z, H, T und so weiter oder im Zweiersystem 1, 2, 4, 8, ab M auch leer. `gruppen` fasst je drei Spalten zu Tausendern, Millionen und Milliarden zusammen.

Zu jedem Format darf in Kapitel 1 eine `urliste` (Liste der einzelnen Antworten, als Karten zum Abhaken gezeigt) und eine Tabelle `daten` (`kopf`, `zeilen`) stehen. Der Prüfer liest Antworten aus ihnen und aus dem Bild nach (Prüfarten `ablesen`, `zeile`, `aussage`, `aussagen`, `rangfolge`, `datenwahl`, `einteilung`, `mangel`, `schluessel`, `linienabstand`).

Bei `luecken` macht `ziffernfelder: true` aus jeder Lücke ein Feld für genau eine Ziffer (Ziffernrätsel).

## Bilder

`bild` hat eine `art` und die Zahlen, die gezeichnet werden. Eine Unbekannte steht als `{ "wert": 79, "frage": true }` und erscheint als Fragezeichen.

| `art` | Felder |
|---|---|
| `zehnerfeld` | `felder` (10 oder 20), `belegt`, optional `dazu` (helle Plättchen) |
| `mengenbild` | `anzahl`, optional `dazu`, `weg` (durchgestrichen) |
| `gruppenbild` | `gruppen`, `je`, optional `rest` |
| `punktefeld` | `reihen`, `spalten`, optional `trenn` (Linie nach so vielen Reihen) |
| `zehnermaterial` | `h`, `z`, `e`, optional `weg` mit `h`, `z`, `e` |
| `stellenwerttafel` | `spalten` (Namen), `plaettchen` (Anzahl je Spalte) |
| `streifen` | `ganz`, `teile` (das Ganze ist die Summe der Teile) |
| `vergleich` | `oben` und `unten` mit `name` und `wert`, `unterschied` |
| `zahlenstrahl` | wie `strahl` beim Format `zahlenstrahl` |
| `strichliste` | `titel`, `zeilen` aus `name` und `anzahl`, optional `striche` (ein Muster aus `I` und `/`, zum Beispiel für ein falsch gebündeltes `IIIII/`) |
| `saeulen` | `titel`, `einheit`, `max`, `schritt` (beschriftete Linien), optional `fein` (alle Linien), `ab` (Beginn der Achse, nur V2 auf M und E), `liegend` (Balkendiagramm), `werteZeigen`, `ohne` (fehlende Teile wie `titel`), `saeulen` aus `name` und `wert` |
| `bilddiagramm` | `titel`, `einheit`, `symbol` (`kind`, `buch`, `schaf`, `apfel`), `je` (so viel steht ein Bild), `zeilen` aus `name` und `wert` |
| `tafel` | Stellenwerttafel mit Ziffern (Kapitel 2): `spalten` (Namen der Spalten), `werte` (eine Ziffer je Spalte, `null` ist ein leeres Feld), optional `weitere` (weitere Zeilen), `basis` (2 für das Zweiersystem), `plaettchen` (Plättchen statt Ziffern), `gruppen` (Name und Zahl der Spalten je Block) |
| `schaetzbild` | `symbol` (`punkt`, `schaf`, `apfel`, `kind`, `vogel`, `stern`), `felder` (Anzahl je Feld, 2 bis 6 Reihen und 2 bis 8 Spalten), `saat` (Startwert der Streuung), `raster` (`fest`, `wahl` mit Schalter, `ohne`), optional, `markiert` (Reihe und Spalte eines hervorgehobenen Feldes), `gezaehlt` (die Zahl steht im markierten Feld), `grob` (gröbere Einteilung) |
| `zeichentafel` | `zeichen`: die römischen Zahlzeichen, die mit ihrem Wert gezeigt werden, in der Reihenfolge I, V, X, L, C, D, M |

| `gitter` | Karogitter (Kapitel 5): `b` und `h` in Kästchen (höchstens 18 und 14), optional `achsen` (Koordinatensystem im ersten Quadranten), `punkte` (`n`, `x`, `y`, optional `pos` für die Lage des Namens), `linien` (`n`, `a`, `b`, `art` Strecke, Strahl oder Gerade, optional `stil` wie `achse` oder `hilfs`), `figuren` (`n`, `ecken`), `zellen` (gefärbte Kästchen), `zentrum` (Symmetriezentrum Z), `rechte` (Zeichen für rechte Winkel), `texte` |
| `lineal` | Strecke an einem Lineal: `von` und `bis` in Millimetern, `lang` (Länge des Lineals in Millimetern), optional `namen` |
| `geld` | Münzen und Scheine (Kapitel 6): `stuecke` in Cent, zum Beispiel `[100, 20]` |
| `uhr` | Zeigeruhren: `uhren` aus `h` und `min`, optional mit Namen |
| `waage` | Waage im Gleichgewicht: `links` (Name des Gegenstands), `gewichte` (Gewichtsstücke in Gramm) |
| `einheitentafel` | Einheitentafel mit Ziffern: `gruppen` (`name`, `spalten`), `spalten` (Köpfe), `werte` (eine Ziffer je Spalte, `null` ist leer), optional `weitere` |
| `vergleichsbild` | Zwei Dinge zum Schätzen: `klein` und `gross` (Formen), `richtung` (`hoch` oder `lang`), `zehntel` (wie oft das Kleine ins Große passt, in Zehnteln), optional `hilfslinien` |
| `karte` | Orte an einem Lineal: `orte` (`n`, `mm`, `zeichen`), `lang` (Länge des Lineals in Millimetern), dazu `leiste` (`mm`, `text`) oder `massstab` |
| `grundriss` | Rechteckiger Raum: `name`, `b` und `h` in Millimetern, dazu `leiste` oder `massstab` |
| `zeitleiste` | Zeitpunkte mit Sprüngen: `punkte` (Uhrzeit oder `wert` mit `frage`), `spruenge` (Zeitspannen zwischen den Punkten) |

Am Bild `zahlenstrahl` gibt es seit Kapitel 2 zusätzlich `punkte` (ein bis sechs benannte Zahlen auf dem Strahl) und `ausschnitt` (der Strahl beginnt nicht bei 0 und zeigt links ein Bruchzeichen).

## Regeln, die die Prüfung erzwingt

- Jedes Lernziel mit Aufgaben hat auf jeder Niveaustufe mindestens 6 Aufgaben. Sonst könnte ein Schüler mit diesem Zielniveau das Lernziel nie erreichen.
- Hilfekärtchen: F und G drei, M zwei, E eines. Auf F und G höchstens drei Auswahlantworten.
- Jede F-Aufgabe hat ein Bild, auf G mindestens drei von sechs je Lernziel.
- Ein typischer Fehler ist nie gleich der Lösung, und seine Fehlvorstellung steht im Katalog.
- Die Lösung ist das Ergebnis des Nachweises, und jede Zahl des Nachweises kommt aus dem Aufgabentext, dem Bild oder einer früheren Zeile.
- Jede Gleichung in Aufgabentext, Hilfekärtchen, Merkzettel und Wortspeicher stimmt.
- Das Bild zeigt nur Zahlen der Aufgabe und passt zur Rechnung.
- Jedes Lernziel mit Aufgaben nennt seine `grundlage` (ADR 0015).
- Kapitel 1: Achsen beginnen bei 0 und gehen in gleichen Schritten, jeder Wert liegt auf einer Linie, höchstens 20 Linien. Nur V2 auf M und E darf eine abgeschnittene Achse zeigen. Halbe Bilder im Bilddiagramm erst ab M und genau halb. Auf F und G bündelt das Programm die Strichliste, ab M das Kind. Jede genannte Klasse ist 5a bis 5e, und Text und Bildtitel nennen dieselbe.
- Kapitel 2: eigener Zahlenraum je Unterkapitel und Niveaustufe (ADR 0030). Zahlwörter, Stellenwerte, gerundete Werte, Reihenfolgen, Dualzahlen und römische Zahlzeichen rechnet die Prüfung selbst nach. Jedes Zeichen einer Aufgabe steht auf ihrer Zeichentafel. Schätzen mit Schätzbereich gibt es erst ab M.
- Kapitel 5: Koordinaten nur im ersten Quadranten und nach Niveaustufe begrenzt (ADR 0032). Lage, Abstände, Spiegelbilder, Symmetrie und die Namen der Vierecke rechnet die Prüfung selbst nach, mit ganzen Zahlen. Ist ein Punkt gesucht, darf kein zweiter Gitterpunkt die Bedingung erfüllen. Jede Zahl im Text steht im Bild oder im Nachweis. „Diagonale“ und schräge Symmetrieachsen erst ab M, „orthogonal“ nur auf E.
- Kapitel 6: Größen rechnet die Prüfung in Grundeinheiten nach (ADR 0033): Umwandlungen, Rechnungen, Vergleiche, Maßstab und Einheitentafel. Jede Größe im Text kommt im Nachweis oder im Bild vor. Kommazahlen auf F gibt es nicht, Geld hat ab G zwei Nachkommastellen. Auf F und G steht je Zeile ein Satz mit höchstens 14 Wörtern.
- `tests/pruefer.test.js` baut absichtlich Fehler ein und verlangt, dass die Prüfung sie meldet.

## Wortspeicher

Ein Unterkapitel kann `wortspeicher` tragen: eine Liste aus `{ wort, ab, erklaerung }`. `ab` ist die Niveaustufe, ab der das Wort gezeigt wird und in Aufgaben und Hilfekärtchen vorkommen darf. Zeilenumbrüche (`\n`) im Aufgabentext sind auf F und G gewollt: jeder Satz steht in einer eigenen Zeile.
