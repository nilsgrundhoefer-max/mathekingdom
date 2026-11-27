# Audit aus Schülersicht umsetzen

Das Audit aus Schülersicht (Stand 0.64, 27.11.2026) lieferte 213 Befunde aus simulierten Lernwegen der Klassen 5 bis 7. Etwa 60 davon sind Lob und brauchen keine Änderung; sie dienen als Liste dessen, was nicht kaputtgehen darf. Nils wollte Fehler, Hindernisse, Verbesserungen und Anmerkungen umgesetzt haben. Entschieden in zwei Fragerunden (24 Fragen) am 27.11.2026 und danach als Gesamtbild bestätigt.

**Fünf Versionen.** 0.65 Korrekturen an Aufgaben und Texten und automatische Prüfungen. 0.66 Layout. 0.67 Führung. 0.68 Hilfe. 0.69 Belohnung und Eingabe. Jede Version kommt als eigener Pull Request mit Fotos.

## 0.65 Aufgaben und Texte

**Beurteile-Aufgaben.** In vielen Aufgaben der Form „Stimmt das?“ war die richtige Antwort als einzige begründet und damit die längste. Ein Kind konnte ohne Rechnen die längste Antwort wählen. Jetzt bekommen auch falsche Antworten eine Begründung in ähnlicher Länge, und zwar eine, die zur Fehlvorstellung passt. Ein Test hält fest: Je Kapitel ist höchstens in einem Drittel der Auswahlaufgaben die längste Antwort die richtige (länger als 25 Zeichen und mindestens ein Viertel länger als die zweitlängste).

**Gezielter Hinweis passt zur Aufgabe.** Der Hinweis nach einer falschen Antwort kam bisher allein aus der Fehlvorstellung des Pools. Bei manchen Aufgaben passte er nicht zum Bild oder zur Frage. Jetzt gilt: Eine Aufgabe kann unter `hinweise` einen eigenen Satz je Fehlvorstellung tragen; fehlt er, gilt der Satz des Pools; ohne Fehlvorstellung richtet sich der allgemeine Hinweis nach dem Aufgabenformat. Beim Ordnen heißt die umgekehrte Reihenfolge `reihenfolge-umgekehrt`, wo keine genauere Fehlvorstellung passt.

**Beispiel ungleich Aufgabe.** Zieht der Zufall genau die Zahlen des festen Beispiels, verriet das Hilfekärtchen „Beispiel“ die Lösung. Der Erzeuger tauscht das Beispiel dann gegen ein Ersatzbeispiel (`ERSATZBEISPIEL` in `tools/werkzeug.mjs`). Ein Test prüft alle Aufgaben.

**Schreibweise.** Indizes wie h_c stehen tiefgestellt. Das Gradzeichen steht ohne Leerzeichen an der Zahl. Pronomen passen zum Vornamen. Lange Texte werden nur unterhalb von Purpur gekürzt, Vornamen bleiben.

**Schätzen.** Rechenaufgaben, die nach „ungefähr“ fragen, nehmen einen Bereich an (12 % um das genaue Ergebnis) und nennen ihn bei der Lösung.

## 0.66 Layout

Die Leiste mit „Prüfen“ bleibt bei allen Aufgaben am unteren Fensterrand sichtbar. Aufgaben mit Gitter, Diagramm oder Schaubild stehen in zwei Spalten: Bild links, Antworten rechts. Zur Prüfbreite aus ADR 0055 (690 und 560 Pixel) kommt die Prüfgröße 1366×650 Pixel dazu, das ist ein Schul-Notebook mit Browserleisten. Ein fester Browsertest geht alle Aufgaben bei dieser Größe durch. Ordnen: Karten untereinander, Ziehen mit der Maus zusätzlich zu den Pfeilen. Zuordnen: Die Möglichkeiten stehen als sichtbare Liste über den Auswahlfeldern. Der Anmeldecode bleibt in der Kopfleiste. Der Satz zur Worterklärung erscheint nur, wenn wirklich ein Wort unterstrichen ist.

## 0.67 Führung

**Kapitel geschafft.** Sind alle Pflicht-Meilensteine des Aktuellen Kapitels gemeistert, zeigt der Lernpfad den Bildschirm „Kapitel geschafft“ statt neuer Aufgaben. Wer einen Meilenstein nur unter dem Ziel geschafft hat, geht in Runde 2 (ADR 0052). Wer ihn zweimal nur unter dem Ziel schafft, gilt für das Kapitelende als fertig („Lernpfad geschafft“); die Lehrkraft bekommt einen Impuls.

**Angebote am Kapitelende.** Der Hauptknopf nimmt das erste, was zutrifft: nächstes Kapitel (wenn erlaubt und das Tor offen ist), fälliger Rückblick, offene Lernziele früherer Kapitel, nächsthöhere Krone. Abstecher sind ein Nebenangebot. Trifft nichts zu, steht dort „Du bist fertig. Sag deiner Lehrkraft Bescheid.“

**Vorausarbeiten.** Je Klasse gibt es die Einstellung „Wer fertig ist, darf ein Kapitel vorausarbeiten“, Standard an. Erlaubt ist höchstens das Aktuelle Kapitel plus eins; die Grenze rückt mit dem Aktuellen Kapitel weiter. Das neue Kapitel beginnt mit dem Einstiegscheck. In Kapitel ohne Aufgaben geht es nicht. Die Sitzplan-Kachel zeigt „fertig“ oder „voraus“, der Bereich „Jetzt“ einen Impuls wie „3 Kinder sind mit Kapitel 2 fertig“.

**Tagessperre.** Eine am selben Tag gelöste Aufgabe kommt an diesem Tag nicht wieder. Das gilt für das Üben am Meilenstein und für „ähnliche Aufgabe“ (dort kommt eine andere Aufgabe des Lernziels, eine falsch gelöste frühestens nach zwei anderen). Sind alle sechs Aufgaben eines Lernziels gelöst, ist das Lernziel für heute fertig. Wählt das Kind es trotzdem selbst, steht dort „Hier hast du heute alles gelöst. Morgen zählt es wieder.“; es darf üben, bekommt 1 Münze und keinen Heftcode. Rückblick, Seitenblick, Brücke und Sonderauftrag bleiben unverändert.

**Kronen.** Beim Gold-Angebot sind beide Knöpfe gleich gewichtet, „Bei Silber bleiben“ steht zuerst. „Aufbrechen“ führt nur dann in einen Purpur-Abstecher, wenn das Kind selbst Purpur gewählt hat oder Zielniveau E hat; sonst ist er auf der Karte wählbar und trägt „freiwillig, Purpur“. Eine eigene Purpur-Wahl gilt im neuen Kapitel weiter, wenn das Kind im letzten Kapitel nie abgesunken ist. Der Vorschlag nach dem Einstiegscheck nennt seinen Grund („3 von 4 Gold-Aufgaben richtig“), der Einstiegscheck zeigt „Aufgabe 5 von 8“.

**Rückblick.** Er bleibt freiwillig (ADR 0041). „Hier geht es weiter“ steht oben, der Rückblick gleich groß daneben.

## 0.68 Hilfe

Der Hilferuf gilt für den Tag. Am nächsten Tag ist er weg, das Kind liest „Dein Hilferuf vom … ist abgelaufen. Brauchst du noch Hilfe?“, die Lehrkraft sieht ihn als abgelaufen. Die Meldung „erledigt“ kommt erst nach einem laufenden Spiel. Der Heftcheck bietet auch Dezimalzahlen, Brüche und negative Zahlen als falsche Antworten an, immer mindestens drei. Die Feedbackfrage kommt höchstens sechsmal je Kind und Tag und dieselbe nie zweimal am Tag; „Lieber etwas anderes“ führt zur Regionskarte.

## 0.69 Belohnung und Eingabe

**Runden.** Wer beim Runden auf zwei Stellen 4,7 statt 4,70 schreibt, bekommt „Fast richtig, schreibe zwei Stellen nach dem Komma“ und verliert keinen Versuch. Das ändert die Regel aus ADR 0047, nach der die Endnull nie verlangt wird, nur für Rundungsaufgaben.

Das Belohnungsspiel kostet weiter 100 Münzen. Der Text sagt das ehrlich: „Die Spiele sind für dich frei. Eine Runde kostet 100 Münzen.“ Münzpreise bleiben. Das Kind wählt im Wappenbereich, wie seine Titel heißen sollen; die Wahl gilt für Hoftitel und Ränge, in Kopfleiste, Wappen und Lehrer-Dashboard (Knappin, Klassenkönigin). Der Standard bleibt die bisherige Form. Nach einer Runde mit 0 Punkten steht ein eigener Eintrag in der Bestenliste.

## Verworfen

- Eine neue Simulation mit zwölf Kindern nach jeder Version. Der feste Browsertest und die Tests zur Aufgabenqualität prüfen dieselben Fehlerarten billiger.
- Den Rückblick zur Pflicht machen. Er bleibt freiwillig, wird aber sichtbarer.
- Das Belohnungsspiel nach der Freigabe kostenlos machen. Dann fehlte das Sparziel.
- Vornamen aus Aufgaben streichen, um Texte zu kürzen.
