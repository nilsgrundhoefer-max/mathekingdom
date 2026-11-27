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

**Prüfgröße.** Zur Prüfbreite aus ADR 0055 (690 und 560 Pixel) kommt die Prüfgröße 1366 × 650 Pixel dazu. Das ist ein Schul-Notebook mit Browserleisten. Der feste Browsertest `tests/browser-alle-aufgaben.mjs` geht alle Aufgaben bei dieser Größe durch. Er verlangt: „Prüfen“ ist ohne Scrollen zu sehen, die Seite ist nicht breiter als das Fenster, ein Bild in der linken Spalte ist nicht höher als das Fenster, und ein Zahlenfeld im Lückentext fasst mindestens drei Ziffern.

**Prüfleiste.** Die Leiste mit „Prüfen“ klebt bei allen Aufgaben am unteren Fensterrand, solange ihr eigentlicher Platz darunter liegt. Text, Bild und Antwortfelder stehen dafür gemeinsam im Formular der Aufgabe. Nach „Prüfen“ holt die Seite den Hinweis oder die Rückmeldung in den Blick. Liegen die Hilfekärtchen unter dem Fensterrand, zeigt die Leiste rechts den Knopf „Hilfekärtchen“, der dorthin führt.

**Zwei Spalten.** Hat eine Aufgabe ein hohes Bild, steht das Bild links und Text und Antworten stehen rechts. Hoch ist ein Bild, wenn es mindestens 150 Einheiten hoch ist und seine Höhe mindestens 45 % der Breite beträgt. Flache Bilder wie Zahlenstrahl, Lineal und Tabellen bleiben über die ganze Breite. Ist das Bild selbst die Eingabe (Gitter, Säulen zeichnen, Winkel drehen, Teile färben), steht es links, und ein zweites Bild steht rechts unter dem Text. Unter 1100 Pixel Fensterbreite bleibt alles untereinander: Text, Bild, Antworten. Die Aufgabenseite ist mit zwei Spalten bis zu 1340 Pixel breit, sonst wie bisher 1040.

**Ordnen und Zuordnen.** Beim Ordnen stehen die Karten immer untereinander. Sie lassen sich mit Maus oder Finger ziehen, mit den Pfeilknöpfen und mit den Pfeiltasten verschieben. Beim Zuordnen stehen die Möglichkeiten als sichtbare Liste über den Auswahlfeldern.

**Lückentexte.** Ein Zahlenfeld fasst drei Ziffern mit Luft und wächst mit der Eingabe. Rechenzeichen, Lücke, Einheit und Satzzeichen bleiben in allen Klassen zusammen (bisher nur Klasse 7, ADR 0043). Eine kurze Rechnung (höchstens 30 Zeichen, eine Lücke zählt sieben) bleibt in einer Zeile, auch im gewöhnlichen Aufgabentext. Die Lösung eines Lückentexts zeigt nur die Sätze mit Lücke.

**Regionskarte.** Die Karte ist immer ganz zu sehen: Die Seite ist dort bis 1340 Pixel breit, ab neun Meilensteinen rücken sie enger zusammen, und sonst wird die Karte verkleinert. Namen über 24 Zeichen stehen in zwei Zeilen. Die Windrose steht oben rechts.

**Versionshinweis.** Im Schüler-Dashboard steht er nur noch bei der Anmeldung und im Schlossgarten, am Ende der Seite statt fest über dem Inhalt. Der Wortlaut bleibt, weil die Lehrkraft daran erkennt, welche Datei geöffnet ist. Der Anmeldecode bleibt in der Kopfleiste.

**Worterklärung.** Der Satz zur Worterklärung erscheint nur, wenn in der Aufgabe wirklich ein Wort unterstrichen ist; das kann auch ein Wort im offenen Tipp sein. Die Erklärung selbst bleibt über dem Wort (Audit L164): Sie verdeckt dort kurz Text, lässt aber Rechnung und Eingabefeld frei.

**Nicht geändert.** Hilfslinien und Strahlen, die über das Gitter hinausgehen, bleiben (Audit L167): Ein Strahl endet nicht am Gitterrand. Große Gitter mit wenig Figur (Audit L086) bleiben, die zwei Spalten fangen die Länge der Seite ab.

## 0.67 Führung

**Kapitel geschafft.** Sind alle Pflicht-Meilensteine eines Kapitels gemeistert, führt „Weiter“ nach der letzten Aufgabe zum Bildschirm „Kapitel geschafft“ statt zu alten Aufgaben. Dieselbe Karte steht klein über der Regionskarte und, wenn sonst nichts offen ist, im Schlossgarten. Gesperrte Meilensteine und Abstecher zählen nicht. Wer einen Meilenstein nur unter dem Ziel geschafft hat, geht in Runde 2 (ADR 0052). Wer ihn zweimal nur unter dem Ziel schafft, gilt für das Kapitelende als fertig („Lernpfad geschafft“); die Lehrkraft bekommt wie bisher den Impuls „Unter dem Ziel“. Ein solcher Meilenstein hält auch den Nebel der Meilensteinfreigabe nicht mehr fest.

**Angebote am Kapitelende.** Der Hauptknopf nimmt das erste, was zutrifft: nächstes Kapitel (wenn das Tor offen ist und dort etwas zu tun ist), fälliger Rückblick, offene Lernziele früherer Kapitel, nächsthöhere Krone. Abstecher sind ein Nebenangebot. Trifft nichts zu, steht dort „Du bist fertig. Sag deiner Lehrkraft Bescheid.“ Die nächsthöhere Krone richtet sich nach der niedrigsten Krone der Pflicht-Meilensteine. Am Kapitelende ist das auch Purpur, mit dem Zusatz „Das ist freiwillig“: Das ist die einzige Stelle, an der das Programm Purpur nennt, ohne dass das Kind es gewählt hat (Ergänzung zu ADR 0041). Bei „Lernpfad geschafft“ gibt es das Kronenangebot nicht. Wer schon um die höhere Krone spielt, sieht die Karte nicht noch einmal.

**Vorausarbeiten.** Je Klasse gibt es die Einstellung „Wer fertig ist, darf ein Kapitel vorausarbeiten“ (Klassendatei: `vorausarbeiten`, Standard an, auch für alte Klassendateien). Das Tor zum nächsten Kapitel öffnet sich im Schüler-Dashboard nur für das Kind, das mit dem Aktuellen Kapitel fertig ist; die Klassendatei ändert sich dadurch nicht. Erlaubt ist höchstens das Aktuelle Kapitel plus eins; die Grenze rückt mit dem Aktuellen Kapitel weiter. Ohne Aktuelles Kapitel gibt es kein Vorausarbeiten. Das neue Kapitel beginnt mit dem Einstiegscheck (dort Pflicht). In ein Kapitel ohne Aufgaben geht es nicht. Die Sitzplan-Kachel zeigt „fertig“ oder „voraus“ (voraus heißt: im nächsten Kapitel ist schon etwas bearbeitet), der Bereich „Jetzt“ den Impuls „3 Kinder sind mit Kapitel 2 fertig“ mit Namen.

**Tagessperre.** Eine am selben Tag gelöste Aufgabe kommt an diesem Tag nicht wieder, auch nicht, wenn sie im Einstiegscheck gelöst wurde. Das gilt für das Üben am Meilenstein und für „ähnliche Aufgabe“ (dort kommt eine andere Aufgabe des Lernziels, eine gerade bearbeitete frühestens nach zwei anderen). Sind alle Aufgaben eines Lernziels auf der Stufe des Kindes heute gelöst, ist das Lernziel für heute fertig: Die Aufgabenführung geht zum nächsten Lernziel oder Meilenstein, ohne deshalb eine neue Runde zu beginnen. Ist auf dem ganzen Weg heute alles gelöst, steht dort „Für heute geschafft!“. Wählt das Kind ein solches Lernziel selbst, steht über der Aufgabe „Hier hast du heute alles gelöst. Morgen zählt es wieder.“; es darf üben, bekommt 1 Münze und keinen neuen Heftcode (außer beim Nachlösen aus dem Heftcheck). Nach einer selbst gewählten Aufgabe an einem erledigten Lernziel gibt es neben dem Weg zurück auf den Lernpfad den Knopf „Noch eine Aufgabe hier“. Rückblick, Seitenblick, Brücke und Sonderauftrag bleiben unverändert. Eine im Einstiegscheck gelöste Aufgabe gilt später nicht als Wiederholung und bringt die vollen Münzen.

**Eine Münze mit Grund.** Bringt eine gelöste Aufgabe nur 1 Münze, steht der Grund unter „Richtig!“: Lösung heute schon gesehen, Aufgabe schon einmal gelöst, Lernziel auf dieser Krone schon geschafft oder mit dem Lösungsschritt-Kärtchen gelöst.

**Kronen.** Beim Gold-Angebot sind beide Knöpfe gleich gewichtet, „Bei Silber bleiben“ steht zuerst. Ohne Aufgabenführung steht der Standort der Regionskarte nie von selbst auf einem Abstecher, außer das Kind hat selbst Purpur gewählt; „Aufbrechen“ führt also nur dann in einen Purpur-Abstecher. Sonst ist er auf der Karte wählbar und trägt „freiwillig, Purpur“, auch auf dem Knopf nach dem Meilenstein. Eine eigene Purpur-Wahl gilt im neuen Kapitel weiter, wenn die Wahl im zuletzt bearbeiteten Kapitel noch auf Purpur steht (beim Absinken setzt das Programm sie auf das Zielniveau zurück). Gold über dem Ziel Silber wird nicht übernommen. Der Vorschlag nach dem Einstiegscheck nennt seinen Grund („Du hast 3 von 4 Gold-Aufgaben gelöst.“), der Einstiegscheck zeigt „Aufgabe 5 von 8“. Die Regel des Vorschlags bleibt (Gold ab der Hälfte der Gold-Aufgaben).

**Meldungen zur Krone.** Eine Krone unter dem Ziel heißt „ein guter Zwischenschritt“ und sagt, dass das Kind später die Krone seines Ziels holt. Der Satz zur Selbsteinschätzung steht nur da, wenn Wahl und Krone sich unterscheiden. Bronze aus der Grundlagen-Schleife wird nicht als neue Krone gemeldet, wenn Bronze nicht zur Wahl steht. Beim Absinken steht „beginnt wieder bei …“ nur, wenn das nächste Lernziel wirklich auf der bisherigen Krone beginnt.

**Rückblick.** Er bleibt freiwillig (ADR 0041). Im Schlossgarten steht die Karte „Hier geht es weiter“ oben, der Rückblick gleich groß daneben. Das leuchtende Tor bleibt.

**Kleineres.** Nach dem Nachlösen aus dem Heftcheck geht es dort weiter, wo das Kind vorher war. Während der Rast gibt es keinen Weg zu den Spielen, und „Rast überspringen“ ist kein Hauptknopf. Der Seitenblick sagt, was er ist („Eine Aufgabe zu einem Lernziel, das du schon kannst.“).

**Fester Test.** `tests/browser-fuehrung.mjs` spielt Kapitelende, Vorausarbeiten, Einstiegscheck, Gold-Angebot, Purpur-Wahl, Abstecher, Tagessperre und die Signale für die Lehrkraft bei 1366 × 650 Pixeln durch. `tests/kapitelende.test.js` prüft die Regeln ohne Browser.

**Nicht geändert.** Die simulierten Schüler (ADR 0028) kennen Kapitelende und Tagessperre nicht; sie arbeiten weiter wie bisher. Die Feedbackfrage „Lieber etwas anderes“ (L022) folgt mit 0.68.

## 0.68 Hilfe

**Der Hilferuf gilt für den Tag.** Ein Ruf von einem früheren Tag läuft ab, sobald das Kind sich anmeldet oder das Dashboard über Mitternacht offen bleibt (`L.lasseHilferufAblaufen`). Er wandert mit dem Grund „abgelaufen“ in den Verlauf, und das Kind liest einmal „Dein Hilferuf vom … ist abgelaufen. Brauchst du noch Hilfe?“. „Ja“ ruft neu von heute, zum selben Hilferuf-Grund und zur Aufgabe, an der das Kind gerade sitzt; „Nein, danke“ räumt nur auf. Solange ein Ruf läuft, steht im Balken, seit wann das Kind wartet.

**Lehrkraft.** Rufe von gestern stehen nicht mehr in der Akut-Zone, zählen nicht als „braucht Hilfe“ und verlängern die Warteschlange der anderen Kinder nicht, auch wenn das Kind sich noch nicht wieder angemeldet hat. Unter der Akut-Zone steht die Zeile „Abgelaufene Hilferufe“ mit Namen, Datum und Grund: offene Rufe früherer Tage und Rufe, die heute abgelaufen sind, bis das Kind neu ruft.

**Erledigt nach dem Spiel.** Hakt die Lehrkraft einen Hilferuf ab, während das Kind ein Belohnungsspiel spielt, erscheint die Meldung erst, wenn das Spiel verlassen ist, und bleibt dann 20 Sekunden stehen.

**Heftcheck.** Die falschen Antworten entstehen aus den typischen Fehlern der Aufgabe, aus Nachbarn in der letzten Stelle, dem Zehnfachen, bei Dezimalzahlen dem Zehntel und bei negativen Zahlen dem anderen Vorzeichen (`L.heftAntworten`). Es sind immer drei, alle verschieden von der Lösung und voneinander; negative Antworten gibt es nur, wenn die Aufgabe selbst negative Zahlen kennt. Alle Antworten stehen mit Komma und echtem Minuszeichen da. Über den Antworten steht der Aufgabentext noch einmal, damit das Kind die Aufgabe im Heft wiederfindet. Ein Test geht alle Aufgaben mit Heftwert in Klasse 5 bis 7 durch.

**Feedbackfrage.** Höchstens sechs Fragen je Kind und Tag, dieselbe Frage nie zweimal am Tag. Beide Antwortknöpfe sind gleich gewichtet. Antwortet das Kind auf „Möchtest du so weiterarbeiten?“ mit „Lieber etwas anderes“, kommt es auf die Regionskarte des Kapitels und liest „Such dir auf der Karte aus, woran du jetzt arbeiten möchtest.“

**Fester Test.** `tests/hilfe.test.js` prüft die Regeln ohne Browser, `tests/browser-hilfe.mjs` spielt sie bei 1366 × 650 Pixeln durch.

**Nicht geändert.** Brüche fragt der Heftcheck weiter nicht ab: Im Pool hat keine Aufgabe mit Heftwert einen Bruch als Ergebnis. Der Temperaturunterschied bleibt in „Grad“ (L175): Ein Unterschied ist keine Temperatur in °C. Auf Purpur bleibt es bei einem Tippkärtchen (L129, ADR 0016). Die Lösungsanzeige bei Zeichenaufgaben (L188) bleibt, wie sie ist.

## 0.69 Belohnung und Eingabe

**Runden.** Wer beim Runden auf zwei Stellen 4,7 statt 4,70 schreibt, bekommt „Fast richtig: Der Wert stimmt. Schreibe zwei Stellen nach dem Komma …“ und verliert keinen Versuch (`L.endnullFehlt`, `nachbessern: 'endnull'`). Das gilt nur für die Lernziele zum Runden (6.4.3) und nur, wenn die Lösung selbst auf eine Null endet. Die Antwort bleibt richtig: Nach zwei Bitten zählt sie auch ohne Null. Das ändert die Regel aus ADR 0047, nach der die Endnull nie verlangt wird, nur für Rundungsaufgaben; Geld (4,5 € wie 4,50 €) und alle anderen Dezimalzahlen bleiben wie bisher.

**Belohnungsspiel.** Es kostet weiter 100 Münzen, Münzpreise bleiben. Der Text sagt das ehrlich: „Die Spiele sind für dich frei. Eine Runde kostet 100 Münzen.“ Das Wort „verdient“ steht nicht mehr da, weil es wie „geschenkt“ klang.

**Titelform.** Das Kind wählt im Wappenschrank, wie seine Titel heißen sollen (`stand.titelform`: `'w'`, sonst die bisherige Form). Die Wahl gilt für Ränge und Hoftitel, in Kopfleiste, Wappenschrank und Lehrer-Dashboard (Wanderin, Ritterin, Klassenkönigin). Der Standard bleibt die bisherige Form; niemand muss wählen, und die Lehrkraft stellt nichts ein.

**Bestenliste.** Nach einer eigenen Runde mit 0 Punkten steht der eigene Eintrag in der Liste. Fremde Runden mit 0 Punkten bleiben draußen. Die Überschrift nennt das Spiel, weil jedes Spiel seine eigene Liste hat.

**Knopf „±“ (L135).** Steht eine Lücke ohne Klammer direkt hinter „+“ oder „−“, hat sie keinen Knopf „±“. Dort gehört eine Zahl ohne Vorzeichen hin; eine negative Zahl stünde in Klammern. Im Pool ist an diesen Stellen keine Lösung negativ.

**Bruch-Eingabe (L170).** Kommen in einem Lernziel bei „Kürze vollständig“ auch gemischte Zahlen heraus, hat jede solche Aufgabe des Lernziels das Feld für die Ganzen (`L.mitGanzenFeld`). Das Feld verrät so nicht mehr, ob eine gemischte Zahl herauskommt, und es darf leer bleiben.

**Fester Test.** `tests/belohnung-eingabe.test.js` und `tests/klasse-6-dezimal.test.js` prüfen die Regeln ohne Browser, `tests/browser-belohnung.mjs` spielt sie bei 1366 × 650 Pixeln durch.

**Nicht geändert.** Die zwei Titelsysteme (L064), mehrere Kinder mit demselben Hoftitel bei Gleichstand (L194), die Menge der Zeichen in der Kopfleiste (L095, L196) und der Münzwert (L018, L195) bleiben, wie sie sind. Dass in 7.1.5-R1-G-03 die Zeichnung das Ergebnis zeigt, ist auf Silber gewollt.

## Verworfen

- Eine neue Simulation mit zwölf Kindern nach jeder Version. Der feste Browsertest und die Tests zur Aufgabenqualität prüfen dieselben Fehlerarten billiger.
- Den Rückblick zur Pflicht machen. Er bleibt freiwillig, wird aber sichtbarer.
- Das Belohnungsspiel nach der Freigabe kostenlos machen. Dann fehlte das Sparziel.
- Vornamen aus Aufgaben streichen, um Texte zu kürzen.
