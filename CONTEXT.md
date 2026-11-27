# Mathekingdom

Lernplattform für den Mathematikunterricht im Schulnetz: Schüler bearbeiten Aufgaben, die Lehrkraft verfolgt den Lernstand ihrer Klassen.

## Personen und Gruppen

**Schüler**:
Ein Lernender, der über seinen Schülercode am Schüler-Dashboard angemeldet ist. Er gehört genau einer Klasse an.
_Avoid_: User, Account, Nutzer

**Schülercode**:
Ein von der Lehrkraft vergebener, nicht erratbarer Code (z. B. `7B-K4M2`), der zusammen mit der PIN einen Schüler anmeldet und seine Klasse festlegt. Nur die Lehrkraft kennt die Zuordnung zum echten Namen.
_Avoid_: Login, Benutzername, ID

**PIN**:
Vier Ziffern, die ein Schüler zusätzlich zu seinem Schülercode eingibt. Die Lehrkraft vergibt sie und kann sie nachlesen oder erneuern. Sie steht mit dem Schülercode auf dem Code-Kärtchen.
_Avoid_: Passwort, Kennwort

**Lehrkraft**:
Die Person, die Klassen betreut, Freigaben erteilt und den Lernstand auswertet.
_Avoid_: Admin, Lehrer-Account

**Klasse**:
Die konkrete Lerngruppe eines Schuljahres (z. B. 7b). Ein Schüler gehört ihr an, bis der Administrator ihn mit einem Klassenwechsel oder dem Schuljahreswechsel in eine andere Klasse bringt.
_Avoid_: Kurs, Gruppe

**Klassenwechsel**:
Der Umzug eines Schülers in eine andere Klasse während des Schuljahres, nur durch den Administrator. Der vordere Teil des Schülercodes wird zur neuen Klasse (aus 5A-K4M2 wird 5C-K4M2), die PIN bleibt. Mit ihm ziehen Name, PIN, Speicherstand, Zielniveau und die Notiz der Lehrkraft; ein offener Sonderauftrag, eine Nachricht und ein Hilferuf verfallen, in der neuen Klasse bekommt er einen freien Platz im Sitzplan. Wer sich mit dem alten Code anmeldet, wird über den hinteren Teil gefunden und erfährt einmal seinen neuen Code. Führt der Wechsel in eine niedrigere Klassenstufe, gilt er als Wiederholung.
_Avoid_: Umschulung, Versetzung

**Wiederholung** (einer Klassenstufe):
Ein Schüler kommt in eine Klasse derselben oder einer niedrigeren Klassenstufe, die er schon besucht hat. Seine Siegel und Kronen dieser Klassenstufe kommen ins Archiv, und er arbeitet sie neu durch; Münzen, Wappen und Rang bleiben, der Rang sinkt nie. Die Lehrkraft sieht das archivierte Jahr weiter.
_Avoid_: Sitzenbleiben, Zurückstufen, Reset

**Testklasse**:
Eine Klasse, die der Administrator zum Ausprobieren anlegt und im Schulverzeichnis als solche markiert. In ihr arbeiten simulierte Schüler und bis zu drei echte Probe-Codes. Sie trägt im Lehrer-Dashboard das Schild „Testklasse“ und zählt nicht in Nutzungsstatistik, Auffällige Aufgaben und Aufgabenmeldungen. Sonst verhält sie sich wie jede Klasse: eine Lehrkraft ist ihr zugeordnet, sie lässt sich zurücksetzen, auflösen und löschen.
_Avoid_: Demo-Klasse, Beispielklasse (die gibt es nur im Lehrer-Dashboard, ohne Ordner und ohne Bewegung)

**Beispielklasse**:
Eine erfundene Klasse mit vierzehn Schülern, die das Lehrer-Dashboard auf Knopfdruck zeigt, ohne Ordner und ohne dass etwas gespeichert wird. Sie dient zum Ansehen und Vorführen; nichts in ihr bewegt sich.
_Avoid_: Testklasse, Demo-Klasse

**Ausprobieren ohne Ordner**:
Ein Schüler arbeitet, ohne dass sein Speicherstand in den Klassenordner kommt; alles bleibt im Browser dieses einen Geräts, und keine Lehrkraft sieht es. Es gibt das nur in der Schüler-Datei ohne Schuleinrichtung, nie in der Startdatei des Administrators.
_Avoid_: Demo, Gastmodus

**Simulierter Schüler**:
Ein erfundener Schüler einer Testklasse, dessen Speicherstand das Administrator-Dashboard schreibt, nach derselben Spiellogik wie bei echten Schülern. Er hat einen Vornamen und ein Profil (etwa sicher, wackelig, rät, blockiert oft), das in seiner Notiz steht, und reagiert auf Freigaben, Sonderaufträge, Münzgaben und Antworten auf Hilferufe.
_Avoid_: Bot, Testschüler, Dummy

**Simulation**:
Der Lauf, in dem die simulierten Schüler einer Testklasse in echter oder dreifacher Geschwindigkeit arbeiten, für 45 Minuten, 90 Minuten oder unbegrenzt; zum Ende hören sie nach und nach auf. Ein fester Zufallswert macht einen Lauf wiederholbar.
_Avoid_: Lasttest (ein PC schreibt alle Speicherstände, das Schulnetz wird nicht wie von 25 PCs belastet)

**Vorlauf**:
Die beim Anlegen einer Testklasse sofort erzeugte Vergangenheit von 1, 3 oder 6 Schulwochen, damit Lernstand, Rückblick und Selbsteinschätzung schon vor der ersten Simulation etwas zeigen.
_Avoid_: Vorgeschichte, Testdaten

**Klassenstufe**:
Der Jahrgang (5 bis 10), der sich aus der Klasse ergibt und bestimmt, welche Kapitel geladen werden.
_Avoid_: Jahrgangsstufe, Level

## Inhalte

**Aufgabenpool**:
Die Gesamtheit aller Aufgaben, nach Klassenstufe, Kapitel und Unterkapitel geordnet. Er enthält keine personenbezogenen Daten.
_Avoid_: Datenbank, Aufgabensammlung

**Kapitel**:
Ein Stoffgebiet einer Klassenstufe (z. B. „Brüche“).
_Avoid_: Themenbereich, Modul

**Unterkapitel**:
Ein abgegrenztes Thema innerhalb eines Kapitels (z. B. „Brüche erweitern“), das Aufgaben bündelt.
_Avoid_: Themenbereich, Lektion

**Aufgabe**:
Eine einzelne zu lösende Einheit in einem Unterkapitel, mit festem Aufgabenformat, Niveaustufe und Lernziel. Jede Aufgabe ist automatisch auswertbar.
_Avoid_: Übung, Item

**Aufgabenformat**:
Die Art, wie eine Aufgabe gestellt und beantwortet wird, zum Beispiel Zahleingabe, Auswahl, Lückentext, Zuordnen, Zahlenstrahl, Tabelle, Rechenraster, Zahlenmauer oder Malkreuz. Bei Zahlenstrahl, Rechenraster, Zahlenmauer und Malkreuz zeichnet das Dashboard die Darstellung selbst, und der Schüler trägt seine Antworten direkt in sie ein.
_Avoid_: Aufgabentyp, Bild (für eine Darstellung mit Eingabefeldern)

**Zahlenmauer**:
Ein Aufgabenformat aus Steinen in Reihen: Jeder Stein ist die Summe (bei der Mal-Mauer das Produkt) der beiden Steine darunter. Die gesuchten Zahlen tippt der Schüler in die leeren Steine.
_Avoid_: Rechenmauer, Zahlenpyramide

**Malkreuz**:
Ein Aufgabenformat für das Multiplizieren durch Zerlegen: Die Faktoren stehen zerlegt am Rand einer Tabelle (· | 20 | 3 und 4), die Teilprodukte und ihre Summe trägt der Schüler in die Felder ein.
_Avoid_: Malkreuz-Bild, Multiplikationstabelle

**Ordnen**:
Ein Aufgabenformat, bei dem der Schüler Zahlenkarten in die verlangte Reihenfolge bringt, mit Maus oder Tastatur. Richtig ist nur die ganze Reihenfolge.
_Avoid_: Sortieren, Reihenfolge-Aufgabe

**Schätzbild**:
Ein Aufgabenbild aus vielen kleinen Symbolen, deren Anzahl geschätzt und nicht gezählt werden soll. Jedes Kind sieht dasselbe Bild. Auf F und G ist ein Raster eingezeichnet, ab M blendet der Schüler es selbst ein.
_Avoid_: Wimmelbild, Foto

**Schätzbereich**:
Der Bereich um die wahre Anzahl eines Schätzbilds, in dem eine Schätzung ab M als richtig gilt. Auf F und G zählt stattdessen der Rechenweg: Anzahl im Feld mal Zahl der Felder. Nach der Antwort zeigt das Schüler-Dashboard immer die wahre Anzahl.
_Avoid_: Toleranz, ungefähr richtig

**Gitterzeichnen**:
Ein Aufgabenformat für die Geometrie: Der Schüler tippt Gitterpunkte auf einem Karogitter an, und das Dashboard verbindet sie zu Strecke, Gerade oder Figur. Geprüft wird die Lage der Punkte, nicht die Linienführung.
_Avoid_: Freihandzeichnen, Konstruieren

**Winkeldrehen**:
Ein Aufgabenformat zum Zeichnen von Winkeln: Ein Schenkel liegt fest, am aufgelegten Geodreieck dreht der Schüler den zweiten Schenkel, bis er die verlangte Gradzahl auf der Skala trifft. Das Dashboard zeigt die Gradzahl dabei nicht an. 2° Abweichung gelten als richtig.
_Avoid_: Winkelregler, Schieberegler

**Kreis am Gitter**:
Gitterzeichnen für Kreise: Der Schüler tippt den Mittelpunkt und einen Punkt auf der Kreislinie an, das Dashboard zeichnet den Kreis. Geprüft werden Mittelpunkt und Radius.
_Avoid_: Zirkel am Bildschirm

**Heftaufgabe mit Kontrollwert**:
Eine Aufgabe, bei der das Kind im Heft mit dem Geodreieck zeichnet und eine nachgemessene Länge in Millimetern eintippt. 2 mm Abweichung gelten als richtig. In Klasse 7 Kapitel 2 auch ein nachgemessener Winkel in Grad, mit 2° Abweichung; daneben steht die Planfigur.
_Avoid_: Konstruktionsaufgabe, Messaufgabe

**Heftaufgabe**:
Eine Aufgabe, die das Kind im Heft rechnet oder zeichnet; am Bildschirm gibt es nur das Ergebnis ein. Sie trägt im Pool `heftaufgabe: true` und im Dashboard das **Heftband** („Heftaufgabe: Rechne im Heft. Gib danach nur dein Ergebnis ein.“, bei Zeichenaufgaben „Zeichne im Heft“). Nicht zu verwechseln mit dem Heftcode, den das Kind ab Gold nach jeder gelösten Aufgabe notiert.
_Avoid_: Heftauftrag ohne Kennzeichen, Schreibaufgabe

**Periodische Dezimalzahl**:
Eine Dezimalzahl, bei der sich ab einer Stelle Ziffern endlos wiederholen; die wiederholten Ziffern heißen **Periode** und bekommen einen Strich darüber (0,16̅). Eine Dezimalzahl, die endet, heißt **abbrechend**.
_Avoid_: unendliche Kommazahl, Kommazahl mit Punkten

**Endnull**:
Eine Null am Ende hinter dem Komma (2,50). Sie ändert den Wert nicht und wird nie verlangt; beim Runden zeigt sie, wie genau gerundet wurde.
_Avoid_: überflüssige Null

**Zahlenstrahl mit Lupe**:
Zwei Zahlenstrahlen übereinander: Der untere vergrößert einen Schritt des oberen zehnfach, damit Hundertstel und Tausendstel ablesbar werden.
_Avoid_: Zoom, Ausschnittvergrößerung

**Stufenzahl**:
Eine der Zahlen 10, 100, 1000 (ab M auch 0,1 und 0,01). Mal und durch eine Stufenzahl rechnet das Kind, indem es das Komma verschiebt; die Stellenwerttafel zeigt dazu **Verschiebepfeile**, die anzeigen, wie weit jede Ziffer rückt.
_Avoid_: Zehnerzahl, Nullenzahl

**Überschlag**:
Ein grobes Ergebnis mit gerundeten Zahlen, um das genaue Ergebnis zu prüfen, vor allem die Stelle des Kommas. Gerundet wird jede Zahl auf Ganze oder auf ihre erste Stelle; jedes so entstandene Ergebnis zählt als richtig.
_Avoid_: Schätzung (die ist beim Zählen und bei Größen gemeint), Näherung

**Stützgröße**:
Eine Größe aus dem Alltag, die das Kind auswendig kennt und beim Schätzen als Vergleich nimmt, zum Beispiel eine Tür mit 2 m oder eine Tafel Schokolade mit 100 g.
_Avoid_: Richtwert, Faustgröße

**Vergleichsgröße**:
Ein Gegenstand bekannter Größe in einem Bild, an dem das Kind eine unbekannte Größe abschätzt, zum Beispiel ein Kind neben einem Turm.
_Avoid_: Maßstab (der ist ein festes Verhältnis auf Karten)

**Einheitentafel**:
Eine Tafel mit einer Spalte je Einheit (km, m, dm, cm, mm oder t, kg, g), in die das Kind die Ziffern einer Größe einträgt, um sie umzuwandeln. Für Zeit gibt es keine, weil 60 nicht zum Zehnersystem passt. Für Volumen hat sie drei Spalten je Einheit (H, Z, E), weil die Umrechnungszahl 1000 ist.
_Avoid_: Stellenwerttafel (die hat Spalten für Stellenwerte, nicht für Einheiten), Umrechnungstabelle

**Verlangte Einheit**:
Die Einheit, die eine Größenaufgabe im Text ausdrücklich fordert („Gib das Volumen in Litern an“). Stimmt der Wert, aber nicht die Einheit, ist die Antwort **fast richtig**: Das Kind bessert nach, ohne dass ein Versuch zählt. Nennt die Aufgabe keine Einheit, zählt jede gleichwertige Angabe.
_Avoid_: Zieleinheit, Pflichteinheit

**Einheitenart**:
Länge, Fläche oder Volumen. Eine Einheit der falschen Art (cm² für ein Volumen) ist falsch, auch wenn die Zahl stimmt, und hat eine eigene Rückmeldung.
_Avoid_: Dimension, Einheitentyp

**Gemischte Schreibweise**:
Eine Größe mit zwei Einheiten ohne Komma, zum Beispiel „3 € 50 ct“ oder „2 km 500 m“. Die **Kommaschreibweise** („3,50 €“) ist bei den Größen nur eine andere Schreibweise dafür.
_Avoid_: Dezimalzahl (für Größen vor dem Kapitel Brüche und Dezimalzahlen)

**Dezimalzahl**:
Eine Zahl mit Komma, deren Stellen nach dem Komma Zehntel, Hundertstel, Tausendstel und Zehntausendstel sind. Sie heißt erst ab der Dezimalschreibweise so; gesprochen wird Ziffer für Ziffer („null Komma zwei fünf“). In Klasse 5 wird mit ihr nicht gerechnet.
_Avoid_: Kommazahl, Dezimalbruch

**Bruchbild**:
Ein Aufgabenbild, das ein Ganzes in Teile zerlegt zeigt: Kreis, Rechteck, Streifen oder Mengenbild. Gefärbte Teile stehen für den Zähler, alle Teile für den Nenner.
_Avoid_: Tortendiagramm, Kreisdiagramm

**Brucheingabe**:
Die Eingabe eines Bruchs mit zwei Feldern übereinander und Bruchstrich. Ein gleichwertiger Bruch zählt als richtig, außer die Aufgabe verlangt einen bestimmten Nenner. Ab dem Meilenstein „Brüche kürzen“ in Klasse 6 muss das Ergebnis vollständig gekürzt sein: Ein richtiger, aber ungekürzter Bruch ist fast richtig, bekommt den Hinweis „Kürze noch“ und kostet keinen Versuch. Unechter Bruch und gemischte Zahl zählen gleich, außer die Aufgabe verlangt eine der beiden Formen.
_Avoid_: Schrägstrich-Schreibweise (3/4)

**Teile färben**:
Die Eingabe, bei der das Kind Teile eines Bruchbilds antippt, um einen Bruchteil darzustellen. Jede Auswahl mit der richtigen Anzahl ist richtig.

**Zentimeterraster**:
Ein Karogitter im Aufgabenbild, bei dem ein Feld 1 cm² und eine Feldseite 1 cm darstellt. Es gilt ab den Flächenmaßen; im Heft sind 1 cm² vier Kästchen, weil dort 2 Kästchen 1 cm sind. Vorher zählt das Kind Flächen nur in Kästchen, ohne Einheit.
_Avoid_: Millimeterpapier, Kästchen (für das Feld eines Zentimeterrasters)

**Haus der Vierecke**:
Die Ordnung der Vierecke nach ihren Eigenschaften, in der ein Name den anderen einschließt: Jedes Quadrat ist auch Rechteck und Raute, jedes Rechteck und jede Raute ein Parallelogramm, jedes Parallelogramm ein Trapez, jede Raute ein Drachen. „Genau“ meint den engsten Namen.
_Avoid_: Vierecksarten, Stammbaum

**Rechenraster**:
Ein Aufgabenformat für das schriftliche Rechnen: ein Feld je Ziffer in Stellenwertspalten, beim Multiplizieren mit einer Zeile je Teilprodukt, so wie im Heft. Beim Multiplizieren steht über dem Ergebnis eine Zeile kleiner Übertragsfelder; sie sind Notizhilfe und werden nicht bewertet. Ab Klasse 6 Kapitel 5 hat das Raster beim Addieren und Subtrahieren eine **Kommaspalte** (Komma unter Komma), auch dort mit Übertragsfeldern; fehlende Stellen sind **Endnullen**, auf F grau vorgezeichnet, auf G trägt das Kind sie in Notizfelder ein. Beim Multiplizieren von Dezimalzahlen rechnet das Raster ohne Komma, danach setzt das Kind das Komma im **Kommafeld** unter dem Raster.
_Avoid_: Kästchenraster

**Versuch**:
Eine abgegebene Antwort auf eine Aufgabe. Ein Schüler hat zwei Versuche; sind beide falsch, gilt die Aufgabe als nicht gelöst und die Lösung wird gezeigt. Ein Fehlversuch kostet nichts: Der zweite Versuch bringt so viele Münzen wie der erste.
_Avoid_: Eingabe, Abgabe

**Sicherheitsangabe**:
Ob ein Schüler beim ersten Versuch „sicher“ oder „unsicher“ geprüft hat; er wählt es mit dem Prüfen-Knopf, ohne zusätzlichen Klick. Eine sichere falsche Antwort heißt „sicher falsch“, bekommt sofort die Erklärung zum typischen Fehler und gilt in der Diagnose als stärkstes Zeichen einer Fehlvorstellung. Sie ändert keine Münzen. Die Lehrkraft schaltet sie pro Klasse ein.
_Avoid_: Konfidenz, Selbsteinschätzung (die gilt für Meilensteine)

**Heftcode**:
Ein kurzer Code (z. B. „H7“) zu jeder gelösten Aufgabe ab M, den der Schüler mit seinem Ergebnis ins Heft schreibt.
_Avoid_: Bookwork-Code, Kontrollnummer

**Heftcheck**:
Eine Stichprobe, etwa jede achte Aufgabe ab M: Der Schüler wählt aus vier Antworten, was er bei einem Heftcode herausbekommen hatte. Ist die Antwort falsch, löst er die Aufgabe noch einmal, ohne Münzen zu verlieren; die Lehrkraft sieht die Quote.
_Avoid_: Heftkontrolle (die macht die Lehrkraft von Hand)

**Niveaustufe**:
Eine von vier Anforderungsstufen einer Aufgabe: F (Grundlage: Basiskompetenzen mit größtmöglicher Unterstützung), G (grundlegendes Niveau, Hauptschulabschluss), M (mittleres Niveau, Realschulabschluss), E (erweitertes Niveau, Zugabe Richtung Gymnasium). Die Stufen unterscheiden sich in der Art der Anforderung, nicht in der Zahlengröße: F ein Schritt am Bild oder Material, G ein Standardverfahren, M mehrschrittig mit Übersetzen und Deuten, E Strukturen, Verallgemeinern und Begründen. F wird nie gewählt, sondern nur über die Grundlagen-Schleife erreicht (siehe ADR 0015).
_Avoid_: Schwierigkeit, Level, Sterne, Siegel

**Grundlage**:
Der Baustein, den ein Lernziel voraussetzt und den seine F-Aufgaben üben, in einem Satz im Jahresplan (zum Beispiel „Entbündeln: 1 Zehner sind 10 Einer“). So heißt F auch für die Schüler.
_Avoid_: Förderaufgabe, Bronze-Aufgabe

**Grundlagen-Schleife**:
Der Umweg über F bei einem einzelnen Lernziel: Löst ein Schüler auf G zwei Aufgaben trotz Lösungsschritt-Kärtchen nicht oder wird das Lernziel wackelig, kommen F-Aufgaben, bis drei richtig sind. Dann geht es von selbst zurück. Beim zweiten Mal erfährt es die Lehrkraft als Impuls mit dem Namen der Grundlage.
_Avoid_: Abstieg, Herunterstufen

**Nachweis**:
Die Rechnungen oder die benannte Prüfart, mit denen der Prüfer die Lösung einer Aufgabe unabhängig vom Erzeuger nachrechnet. Nicht zu verwechseln mit dem Nachweisen eines Lernziels durch den Schüler.

**Aufgabenbild**:
Ein schematisches Bild zu einer Aufgabe, im Dashboard aus den Zahlen der Aufgabe gezeichnet und ohne Eingabefelder: Zehnerfeld, Mengenbild, Gruppenbild, Punktefeld, Zehnermaterial, Stellenwerttafel, Streifenbild, Vergleichsbild, Zahlenstrahl. Jede F-Aufgabe hat eines, auf G mindestens drei von sechs; eine Aufgabe im Format Zahlenstrahl, Rechenraster, Zahlenmauer oder Malkreuz braucht keines.
_Avoid_: Illustration, Grafik

**Zielniveau**:
Die Niveaustufe, auf der ein Schüler Lernziele nachweisen muss; Standard M, von der Lehrkraft pro Schüler anpassbar. Bei Zielniveau F arbeitet der Schüler fest auf F, ohne Grundlagen-Schleife.
_Avoid_: Leistungsstufe, Einstufung

**Jahresplan**:
Die Folge der Kapitel einer Klassenstufe über das Schuljahr, in der Reihenfolge des Lehrwerks. Welche Kapitel offen sind, bestimmt allein die Torfreigabe, nicht die Reihenfolge.
_Avoid_: Lernpfad (für diese Ebene), Stoffverteilungsplan

**Aktuelles Kapitel**:
Das Kapitel, das die Lehrkraft für eine Klasse gerade als laufendes Thema gesetzt hat.
_Avoid_: aktuelles Thema

**Torfreigabe**:
Die Entscheidung der Lehrkraft, dass ein Kapitel für eine Klasse oder zusätzlich für einzelne Schüler offen ist. Sie gilt in beliebiger Reihenfolge und kann zurückgenommen werden; Siegel, Kronen und Münzen bleiben dabei erhalten. Für einzelne Schüler kann die Lehrkraft Tore nur zusätzlich öffnen, nie ein Klassentor schließen. Eine neue Klasse hat nur Tor 1 offen.
_Avoid_: Freischaltung, Kapitelsperre

**Lernpfad**:
Der Weg durch die Unterkapitel eines einzelnen Kapitels.
_Avoid_: Kurs, Weg, Themenbereich

**Schlossgarten**:
Die Übersicht aller Kapitel einer Klassenstufe: der Ausgangsort in der Mitte des Königreichs, mit einem Gartentor für jede Region. Hinter jedem Tor liegt die Regionskarte. Der Schüler sieht nur die Tore, die für ihn freigegeben sind, mit der Nummer des Kapitels im Lehrwerk; nicht freigegebene Tore fehlen ganz, nur ein Satz sagt, dass weitere folgen.
_Avoid_: Reichskarte, Weltkarte, Jahresplan (für die Ansicht)

**Regionskarte**:
Die Darstellung eines Lernpfads im Stil einer alten Landkarte: ein einziger Weg, auf dem die Unterkapitel Meilensteine sind. Die Niveaustufe ist kein eigener Weg mehr, sondern die Kronenfarbe, um die der Schüler spielt.
_Avoid_: Metrokarte, Lernlandkarte, Fortschrittsbalken, Straße

**Meilenstein**:
Ein Unterkapitel auf der Regionskarte. Er ist gemeistert, wenn der Schüler alle Lernziele des Unterkapitels erreicht hat, also eine Krone auf oder über seinem Zielniveau trägt. Meilensteine gehen nicht nacheinander auf, außer die Lehrkraft nutzt die Meilensteinfreigabe; die Karte zeigt sonst nur eine empfohlene Reihenfolge.
_Avoid_: Station, Haltestelle, Level, Knotenpunkt

**Aufgabenführung**:
Der Weg, den das Schüler-Dashboard von selbst vorschlägt, wenn der Schüler auf „Nächste Aufgabe“ oder „Hier geht es weiter“ drückt. Sie geht in Runden: In der ersten Runde kommt jedes Lernziel des Meilensteins, an dem er zuletzt gearbeitet hat, einmal dran, bis es ein Siegel hat oder unter dem Ziel geschafft ist, dann der nächste Meilenstein im Lernpfad. Lieber den ganzen Lernpfad auf Silber als lange in einem Lernziel. Ist der Lernpfad einmal durchgearbeitet, beginnt die nächste Runde vorn bei den Lernzielen ohne Siegel, wieder auf dem Zielniveau. Ein Lernziel, das zweimal nur unter dem Ziel geschafft ist, schlägt sie nicht mehr von selbst vor; die Lehrkraft bekommt dazu einen Impuls. Abstecher überspringt sie, bietet sie aber an. Sie zwingt nichts; der Schüler darf jeden offenen Meilenstein selbst wählen.
_Avoid_: Empfehlung, Lernpfad (das ist der Weg durch das Kapitel)

**Unter dem Ziel geschafft**:
Ein Lernziel, das ein Schüler nach derselben Regel wie fürs Siegel nachgewiesen hat, aber nur auf einer Niveaustufe unter seinem Zielniveau. Es bringt kein Siegel; die Aufgabenführung geht danach zum nächsten Lernziel. Der Schüler sieht die Marke „Silber geschafft“, die Lehrkraft den Lernzielstand „unter dem Ziel geschafft“ mit der Niveaustufe. Danach bringen Aufgaben dieses Lernziels unter dem Zielniveau nur noch 1 Münze.
_Avoid_: halb geschafft, Silbersiegel

**Meilensteinfreigabe**:
Die Wahl der Lehrkraft, dass in einem Kapitel für eine Klasse nur bestimmte Meilensteine offen sind. Standard: alle offen. Die übrigen liegen im Nebel und gehen für einen Schüler alle auf einmal auf, sobald er alle freigegebenen Meilensteine gemeistert hat. Ein Abstecher geht auf, wenn der Meilenstein gemeistert ist, an dem er hängt; für die übrigen ist er nicht nötig. Was ein Schüler schon begonnen hat oder wofür er eine Krone hat, bleibt für ihn offen.
_Avoid_: Freischaltung, Meilensteinsperre (das ist der gesperrte Meilenstein für einen einzelnen Schüler)

**Abstecher**:
Ein zusätzlicher Meilenstein, der abseits des Weges gestrichelt angehängt ist. Er bekommt eine Krone nach derselben Regel.
_Avoid_: Zusatzstation, Extra

**Niveau-Meilenstein**:
Ein Meilenstein, den das Lehrwerk mit M oder E markiert und der deshalb nur Aufgaben ab dieser Niveaustufe hat (M: auf M und E; E: nur auf E). Für Schüler mit einem Zielniveau darunter ist er ein Abstecher und für den Kapitelabschluss nicht nötig; sie dürfen ihn freiwillig versuchen. Dann arbeiten sie auf der niedrigsten Niveaustufe, die er hat. Für Schüler ab diesem Zielniveau ist er ein gewöhnlicher Meilenstein auf dem Weg. Ändert die Lehrkraft das Zielniveau, wechselt er sofort die Rolle; verdiente Kronen bleiben.
_Avoid_: Zusatzstoff, Extra, Erweiterung

**Pflicht ab M**:
Ein Meilenstein, den das Lehrwerk mit Sternchen markiert (in Klasse 7 die Einheiten 2.1 und 2.5) oder dessen Kern der Bildungsplan erst auf M verlangt (in Klasse 6 die Einheiten 3.2 Schrägbilder und 3.3 Grundriss und Aufriss, weil das Zeichnen erst ab M Pflicht ist). Er hat Aufgaben auf allen vier Niveaustufen, verbindlich ist er aber erst ab Zielniveau M. Wer ein Zielniveau darunter hat, erlebt ihn als freiwilligen Abstecher auf seiner eigenen Stufe; anders als beim Niveau-Meilenstein wird dabei nicht auf M gearbeitet.
_Avoid_: Sternchen-Meilenstein, Niveau-Meilenstein ab M

**Bildkarte**:
Eine Antwort einer Auswahlaufgabe, die ein kleines Bild ist (Körper, Netz oder Ansicht) und mit A, B, C … benannt wird. Am Handy stehen zwei Karten in einer Reihe. Auf F zählt eine Aufgabe mit Bildkarten als Aufgabe mit Bild. Eingeführt in Klasse 6 Kapitel 3.
_Avoid_: Bildauswahl, Bildoption

**Schrägbild**:
Zeichnung eines Körpers in Kavalierperspektive: Die Vorderfläche hat ihre wahre Größe, die Tiefe wird halb so lang unter 45° gezeichnet, im Karogitter eine Kästchendiagonale je Zentimeter. Verdeckte Kanten sind gestrichelt.
_Avoid_: 3D-Bild, Raumbild

**Ansicht**:
Ein Körper, von einer Seite gesehen: von vorne (Aufriss), von oben (Grundriss), von links (Seitenriss). Auf F heißt es nur „Ansicht von vorne“, „von oben“, „von links“; Grundriss und Aufriss ab G, Seitenriss ab M. „Von der Seite“ wird nicht gesagt.
_Avoid_: Seitenansicht, Riss (allein)

**Würfelbau**:
Ein Bauwerk aus gleich großen Würfeln. Jeder Turm steht auf dem Boden; bei Zählaufgaben ist jeder Turm höher als alle Türme, die in seiner Spalte vor ihm stehen. So lassen sich die Würfel zählen, ohne zu raten.
_Avoid_: Würfelgebäude, Würfelturm

**Zusammengesetzter Körper**:
Ein Körper aus mehreren Quadern, im Schrägbild mit Maßen. **Zerlegt** gezeigt hat er zwei Farben und eine gestrichelte Schnittlinie (F und G); ab M zerlegt oder ergänzt das Kind selbst. Die **Klebefläche**, an der zwei Teile aneinanderstoßen, gehört nicht zum Oberflächeninhalt.
_Avoid_: Quaderbau (so heißt nur die Bildform im Pool), Verbundkörper

**Einheitswürfel**:
Ein Würfel mit der Kantenlänge 1 in der Einheit der Aufgabe (1 cm³, 1 dm³). Das Volumen eines Körpers ist die Anzahl der Einheitswürfel, die hineinpassen.
_Avoid_: Zentimeterwürfel, Zählwürfel

**Volumen**:
Der Platz, den ein Körper einnimmt, gemessen in Einheitswürfeln. In Aufgaben heißt es immer „Volumen“.
_Avoid_: Rauminhalt (steht nur im Merkzettel), Inhalt

**Zuordnung**:
Eine Vorschrift, die jedem Wert einer Größe genau einen Wert einer zweiten Größe zuweist, geschrieben mit Pfeil („2 Hefte → 3 €“). Sie hat drei Darstellungen: Text, Tabelle (waagrecht, zwei Zeilen) und Schaubild.
_Avoid_: Funktion, Abbildung, Beziehung

**Proportionale Zuordnung**:
Eine Zuordnung, bei der zum Doppelten, Dreifachen oder zur Hälfte des einen Werts das Doppelte, Dreifache oder die Hälfte des anderen gehört. Ab M auch: Der Quotient der zusammengehörenden Werte ist immer gleich. „Je mehr, desto mehr“ allein genügt nicht.
_Avoid_: Proportionalitätsfaktor, lineare Zuordnung

**Antiproportionale Zuordnung**:
Eine Zuordnung, bei der zum Doppelten des einen Werts die Hälfte des anderen gehört; das Produkt der zusammengehörenden Werte bleibt gleich. In Klasse 6 nur auf E.
_Avoid_: umgekehrt proportional, indirekt proportional

**Schaubild**:
Das Bild einer Zuordnung im ersten Quadranten eines Koordinatensystems. Beide Achsen tragen den Namen der Größe mit Einheit und eine gleichmäßige Einteilung. Bei Stückzahlen stehen nur Punkte, bei messbaren Größen eine durchgezogene Linie. Der Punkt (0|0) heißt „Nullpunkt“.
_Avoid_: Graph, Diagramm (das sind Säulen, Balken, Bilder), Ursprung (steht nur im Merkzettel)

**Dreisatz**:
Rechenweg bei proportionalen (auf E auch antiproportionalen) Zuordnungen in drei Zeilen: gegebenes Wertepaar, Wert „für 1“ (ab M auch für einen gemeinsamen Teiler), gesuchter Wert. Die **Dreisatztabelle** zeigt die drei Zeilen; ein **Rechenpfeil** am Rand nennt, womit beide Seiten geteilt oder malgenommen werden.
_Avoid_: Schlussrechnung, Verhältnisgleichung

**Planfigur**:
Eine Skizze des gesuchten Dreiecks, in der alle gegebenen Seiten und Winkel markiert sind. In Kapitel 2 steht sie neben jeder Heftaufgabe des Konstruierens und ist maßstabsgetreu gezeichnet.
_Avoid_: Skizze, Entwurf

**Lernziel**:
Eine überprüfbare Kompetenz, festgelegt pro Klassenstufe und Kapitel nach dem Bildungsplan 2016 Baden-Württemberg und einem Unterkapitel zugeordnet. Es ist erreicht, wenn der Schüler drei Aufgaben dazu richtig löst, davon mindestens zwei auf oder über seinem Zielniveau und ohne Lösungsschritt-Kärtchen, und mindestens eine aus dem Anforderungsbereich II oder III. Eine Aufgabe, deren Lösung er am selben Tag schon gesehen hat, zählt dabei nicht (ADR 0031).
_Avoid_: Kompetenz (allein), Ziel

**Rückblick**:
Ein freiwilliges Päckchen aus drei bis fünf gemischten Aufgaben zu Lernzielen, deren Siegel etwa 14, 35 und 90 Tage alt sind. Er kommt erst, wenn der Schüler in der aktuellen Klassenstufe mindestens 10 Siegel hat. Er steht höchstens einmal am Tag oben auf der Startseite und bringt die normalen Münzen. Ein Fehler nimmt kein Siegel weg; die Aufgabe kommt im nächsten Rückblick wieder, und das Lernziel gilt für die Lehrkraft als aufzufrischen.
_Avoid_: Wiederholung (allein), Auffrischen, Review

**Einstiegscheck**:
Sechs bis acht Aufgaben über alle Meilensteine eines Kapitels, angeboten auf der Regionskarte, solange im Kapitel noch keine Aufgabe bearbeitet ist. Je Aufgabe ein Versuch, ohne Hilfekärtchen. Sein Ergebnis stellt die Kronenwahl vor; er bringt keine Siegel und zählt für kein Lernziel. Freiwillig, außer die Lehrkraft macht ihn für ein Kapitel zur Pflicht.
_Avoid_: Eingangstest, Vortest, Diagnosetest

**Voraussetzung**:
Ein Lernziel, auf dem ein anderes Lernziel aufbaut, auch aus früheren Kapiteln, aus einer früheren Klassenstufe oder aus dem Grundschulstoff. Eine Brücke darf deshalb Aufgaben einer früheren Klassenstufe zeigen; die Niveaustufen der eigenen Kapitel richten sich immer nach der eigenen Klassenstufe.
_Avoid_: Vorwissen (für die Verknüpfung)

**Zahlengerade**:
Der Zahlenstrahl, sobald er negative Zahlen zeigt (ab Klasse 7). Die Null ist hervorgehoben. In Klasse 5 und 6 heißt das Bild weiter Zahlenstrahl.
_Avoid_: Zahlenstrahl (für negative Zahlen), Zahlenlinie

**Vorzeichenknopf**:
Der Knopf „±“ neben jedem Zahlenfeld und jeder Brucheingabe der Aufgaben aus Klasse 7 Kapitel 1 (Rationale Zahlen) und seinen Abstechern, auch wenn sie später als Brücke kommen. In allen anderen Aufgaben tippt der Schüler das Minus selbst. Er setzt das Minus vor die Zahl und nimmt es wieder weg. Getippt zählen Bindestrich, Minuszeichen und Halbgeviertstrich gleich.
_Avoid_: Minus-Taste, Plusminus-Feld

**Kontoauszug**:
Die Tabelle aus Buchungen und Kontostand im Abstecher „Girokonto“. Eine Gutschrift ist positiv, eine Abbuchung negativ; ab M auch mit Spalte „S/H“ für Soll und Haben.
_Avoid_: Kontotabelle, Bankauszug

**Brücke**:
Drei Aufgaben zu einer Voraussetzung, eine Niveaustufe unter dem Zielniveau, die das Schüler-Dashboard auf M und E vorschlägt, wenn ein Lernziel wackelig wird. Auf G greift stattdessen die Grundlagen-Schleife. Höchstens eine je Lernziel und Tag, freiwillig; die Lehrkraft bekommt dazu einen Impuls.
_Avoid_: Förderaufgabe, Rückweg

**Vorstufe**:
Die Lernziele und Aufgaben früherer Klassenstufen, auf die ein Lernziel der eigenen Klassenstufe als Voraussetzung zeigt. Ein Schüler begegnet ihnen nur in einer Brücke, nie als eigenem Stoff auf der Karte. Ab Klasse 7 kann die Vorstufe aus mehreren Klassenstufen stammen.
_Avoid_: Wiederholungskapitel, Klasse-5-Teil

**Sonderauftrag**:
Drei bis fünf Aufgaben zu einem Lernziel, die die Lehrkraft einem einzelnen Schüler im Schülerprofil schickt, auf einer Niveaustufe, die sie frei wählt (F bis E). Er kommt als versiegelter Brief des Königs, nie mitten in einer Aufgabe, und bleibt sichtbar, bis er erledigt ist oder die Lehrkraft ihn zurückzieht; höchstens einer ist offen. Freiwillig, ohne Ablaufdatum. Seine Aufgaben zählen wie sonst für Lernziel und Wegstück; sind alle bearbeitet, gibt es eine Belohnung in Münzen dazu, egal wie viele richtig sind. Wie hoch sie ist, stellt die Lehrkraft für ihre Klasse ein (50, 100, 250, 500 oder 1000, Standard 100); der Brief nennt den Betrag, der beim Abschicken galt. Danach geht es zurück an die Stelle, an der der Schüler war. Mitschüler erfahren nichts davon.
_Avoid_: Bonusquest, Quest, Förderbrief, Bonuspunkte

**Training**:
Aufgaben unter dem Zielniveau eines Schülers; sie bringen weniger Münzen und schließen kein Lernziel ab, können aber eine Krone unter dem Zielniveau bringen.
_Avoid_: Übungsmodus

## Belohnung

**Münze**:
Die ausgebbare Währung für richtig gelöste Aufgaben. Gemessen wird am Zielniveau des Schülers: Eine Aufgabe auf dem eigenen Zielniveau bringt jedem gleich viel, darüber etwas mehr, im Training weniger. Ist das Lernziel auf der Niveaustufe der Aufgabe schon nachgewiesen (unter dem Ziel geschafft oder Siegel), bringt sie beim Üben nur noch 1 Münze; volle Münzen gibt es für Neues. Dazu kommen die Belohnung eines erledigten Sonderauftrags und Münzgaben. Münzen gibt der Schüler im Wappenschrank, für Rechenpausen und für Belohnungsspiele aus.
_Avoid_: Punkte, Coins, Taler

**Münzgabe**:
Münzen, die der Administrator einem einzelnen Schüler oder allen Schülern einer Klasse schickt, ohne Aufgabe: zum Testen oder als besondere Anerkennung. Fest wählbar sind 50, 100, 250, 500, 1000 und 5.000 Münzen, dazu ein kurzer Satz. Der Schüler bekommt sie als Brief „Eine Gabe des Königs“ mit eigenem Siegel, ohne Absender, nie mitten in einer Aufgabe; gutgeschrieben wird beim Öffnen. Eine Münzgabe an die Klasse kommt bei jedem Schüler als eigener Brief an, auch bei denen, die gerade fehlen. Ungeöffnet kann der Administrator sie zurückziehen, bei einer Klassen-Münzgabe alle Briefe auf einmal, danach gehören die Münzen dem Schüler. Münzen abziehen kann niemand. Die Lehrkraft der Klasse sieht die Münzgabe im Schülerprofil, ändern kann sie sie nicht.
_Avoid_: Geschenk, Bonus, Gutschrift

**Siegel**:
Eine nicht ausgebbare Auszeichnung, genau eines pro erreichtem Lernziel.

**Das kannst du schon**:
Die Seite, die sich mit einem Klick auf die Siegelzahl öffnet: alle Lernziele der aktuellen Klassenstufe mit Siegel als „Ich kann“-Sätze, nach Kapitel und Meilenstein geordnet, mit Krone des Meilensteins, Datum des Siegels und der Marke „gefestigt“, oben ein Zähler. Lernziele ohne Siegel stehen dort nicht.
_Avoid_: Siegelliste, Portfolio
_Avoid_: Stern, Punkte, Abzeichen

**Krone**:
Die nicht ausgebbare Auszeichnung eines Meilensteins, in einer der vier Kronenfarben. Sie zeigt das niedrigste Niveau, auf dem alle Lernziele des Meilensteins nachgewiesen sind. Jeder Schüler kann alle vier Kronen sammeln; gemeistert ist der Meilenstein aber erst mit einer Krone auf oder über seinem Zielniveau. Ein Schüler kann sie später aufwerten; der Meilenstein zeigt immer die beste Farbe. Kronen bringen keine Münzen und bestimmen nicht den Rang.
_Avoid_: Meilensteinkrone, Pokal, Medaille

**Kronenfarbe**:
Die Form, in der Schüler die Niveaustufen sehen: Bronze (F), Silber (G), Gold (M), Purpur (E). Bronze ist nur Anerkennung für drei richtige Aufgaben der Grundlage und steht nicht zur Wahl. Im Schüler-Dashboard erscheinen nur die Kronenfarben, im Lehrer-Dashboard nur die Niveaustufen.
_Avoid_: Kronenstufe, Lila, Purple

**Kronenwahl**:
Die Kronenfarbe, um die ein Schüler gerade spielt („Spiele um Gold“). Sie legt fest, auf welchem Niveau seine Aufgaben kommen, und gilt für ein Lernziel: Jedes neue Lernziel beginnt wieder auf seinem Zielniveau; eine selbst gewählte höhere Krone gilt für das Kapitel, bis er einmal absinkt. Sinkt er auf Silber, bietet das Dashboard das an; lehnt er ab und löst erneut drei der letzten fünf Aufgaben nicht, wechselt es von selbst. Zur Wahl stehen Silber, Gold und Purpur; Bronze nur bei Zielniveau F. Purpur schlägt das Schüler-Dashboard nie vor, weder nach guten Aufgaben auf Gold noch nach dem Einstiegscheck: Purpur wählt der Schüler selbst, oder die Lehrkraft setzt sein Zielniveau auf E.
_Avoid_: Straße wechseln, Niveauwahl (auf dem Bildschirm)

**Selbsteinschätzung**:
Der Vergleich der Kronenwahl beim ersten Start eines Meilensteins mit der ersten Krone, die der Schüler dort bekommt: unterschätzt (Krone besser), passend (gleich) oder überschätzt (Krone schlechter oder vorher abgestiegen). Spätere Aufwertungen zählen nicht. Der Schüler sieht das Ergebnis neutral, die Lehrkraft wertet es im Lernstand aus.
_Avoid_: Selbstbewertung, Prognose

**Rang**:
Die Stufe des Kundschafters, die sich allein aus der Zahl seiner Siegel ergibt und neue Wappen-Teile zum Kauf freischaltet. Es gibt zwölf Ränge über sechs Schuljahre, etwa alle 20 Siegel einen; die ersten vier heißen Wanderer, Kundschafter, Wegmeister und Hofkartograf.
_Avoid_: Level, Stufe

**Wappen**:
Das Schild, das ein Schüler selbst gestaltet; Farben und Zeichen kauft er mit Münzen. Ein Wappen-Zeichen heißt nie Krone (das teuerste Zeichen ist die Lilie).
_Avoid_: Avatar, Lok

**Wappenschrank**:
Das Angebot an Wappen-Teilen, die ein Schüler mit Münzen kaufen kann. Jede Klassenstufe öffnet beim Schuljahreswechsel einen neuen Wappenbereich; der Schrank einer Klassenstufe reicht für ein Schuljahr. Teile haben einen festen, sichtbaren Preis, nie einen Zufallsinhalt.
_Avoid_: Shop, Laden, Werkstatt

**Wappenbereich**:
Ein Teil des Wappens, den eine Klassenstufe neu öffnet: Klasse 5 Farben und Zeichen, Klasse 6 Schildteilung, Klasse 7 Helmzier, Klasse 8 Schildhalter, Klasse 9 Wahlspruch, Klasse 10 Prunkrahmen. Ein Teil eines Wappenbereichs heißt nie Krone.

**Schildteilung**:
Die Aufteilung des Schildes in Felder mit einer zweiten Farbe aus den schon gekauften Farben (gespalten, geteilt, geviert, schräg, Sparren, Pfahl, Schach).

**Wahlspruch**:
Ein Spruch auf dem Band unter dem Schild, den der Schüler aus einer festen Liste wählt. Er tippt ihn nie selbst.
_Avoid_: Motto, Freitext

**Helmzier**:
Der Helm über dem Schild mit Helmdecke (zwei Tücher in den Schildfarben) und Helmschmuck (Federbusch, Flügel oder Hörner). Decke und Schmuck zeigen sich nur mit einem Helm.

**Schildhalter**:
Die Tiere, die links und rechts vom Schild stehen und ihn halten. Sie dürfen gleich oder verschieden sein.

**Prunkrahmen**:
Was das ganze Wappen rahmt: Wappenmantel, Lorbeerkranz, Kette und Postament.

**Volles Wappen**:
Das Wappen mit allem, was um den Schild herum angelegt ist (Helmzier, Schildhalter, Wahlspruch, Prunkrahmen). Es erscheint nur groß auf der Wappenseite. Überall sonst steht das kleine Wappen: nur der Schild mit Schildteilung und Zeichen.

**Hauptzeichen** und **Beizeichen**:
Ein Wappen trägt ein großes Hauptzeichen und bis zu zwei kleine Beizeichen.

**Ehrenzeichen**:
Ein Wappen-Teil, das man nicht kaufen, sondern nur verdienen kann: Expeditionsfahne (geschaffte Expedition), Purpurrose (erste Purpurkrone), Kapitelband (ganzes Kapitel besiegelt), Wegstern (25 Wegstücke mit mindestens 4 von 5 richtig). Nichts davon belohnt tägliches Erscheinen.
_Avoid_: Abzeichen, Achievement

**Minispiel**:
Oberbegriff für Rechenpause und Belohnungsspiel: ein kurzes Spiel, das Münzen kostet.
_Avoid_: Game

**Rechenpause**:
Ein billiges, kurzes Minispiel mit Mathematik, etwa der Kopfrechen-Sprint. Ohne Bestenliste, nur mit eigenem Bestwert.
_Avoid_: Kurzpause

**Belohnungsspiel**:
Ein Minispiel rein zum Spaß, ohne Mathematik, eine Runde von höchstens drei Minuten pro Kauf (Botenritt, Burgmauer, Steinmetz, Grenzlauf, Kellerjagd). Es kostet deutlich mehr als eine Rechenpause und hat eine Bestenliste. Jedes ist ein eigenes Spiel im Kartenstil, kein Nachbau eines bekannten Spiels.
_Avoid_: Freispiel, Arcade, die Namen bekannter Spiele (Tetris, Pac-Man, Dino-Spiel)

**Banner**:
Ein Leben in einem Belohnungsspiel. Burgmauer, Grenzlauf und Kellerjagd beginnen mit drei Bannern; ein Treffer kostet eines, ohne Banner ist die Runde vorbei.
_Avoid_: Leben, Herz

**Spielfreigabe**:
Der Klassenschalter der Lehrkraft, wann Minispiele gehen: aus, nur in der Spielpause oder verdient. Bei „verdient“ geht die Rechenpause immer, ein Belohnungsspiel nach jedem vierten abgeschlossenen Wegstück.

**Spielpause**:
Ein von der Lehrkraft pro Klasse eingeschaltetes Zeitfenster, in dem alle Minispiele erlaubt sind; standardmäßig aus.
_Avoid_: Freizeit, Pause

**Bestenliste**:
Die Liste der fünf besten Ergebnisse der Klasse in einem Belohnungsspiel, dazu der eigene Platz. Sie beginnt jeden Montag neu, der eigene Bestwert bleibt. Schüler erscheinen mit Wappen und Beinamen, nie mit Namen oder Code; jeder kann sich ausblenden, die Lehrkraft kann sie pro Klasse abschalten.
_Avoid_: Rangliste (verwechselbar mit Rang), Highscore

**Hoftitel**:
Ein Titel mit Symbol für die fünf besten Schüler der Klasse im laufenden Schuljahr: Klassenkönig (Krone), Herzog (Zepter), Graf (Schwert), Ritter (Helm), Knappe (Wimpel), immer in dieser Form. Gemessen wird an Kronen und Siegeln der aktuellen Klassenstufe: je Meilenstein (auch Abstecher) zählt nur die beste Krone (Bronze 1, Silber 2, Gold 4, Purpur 6 Punkte), jedes Siegel 1 Punkt; für alle gleich, unabhängig vom Zielniveau, weil es um Spitzenleistung geht. Einen Titel gibt es erst ab einer Krone auf Silber oder besser. Bei Punktgleichheit entscheiden mehr Purpur-, dann Gold-, dann Silberkronen, sonst teilen sich beide den Platz. Der Titel ändert sich laufend, gilt nur, solange der Platz gehalten wird, und beginnt mit dem Schuljahreswechsel neu. Jeder Schüler sieht nur seinen eigenen Titel, in der Kopfzeile; die Mitschüler sehen ihn nicht. Die Lehrkraft sieht alle Titel mit Namen und kann sie pro Klasse abschalten (standardmäßig an). Ein Hoftitel bringt keine Münzen und kein Ehrenzeichen. Die Königskrone ist anders gezeichnet als die Kronen der Meilensteine.
_Avoid_: Rang (das ist die Stufe nach Siegeln), Ehrentafel (gibt es nicht mehr), Rangliste, Top 5

**Beiname**:
Der Name, unter dem ein Schüler auf der Bestenliste steht, aus festen Bausteinen gewählt (zum Beispiel „Seeblauer Falke“), nie frei getippt. Die erste eigene Wahl ist kostenlos, jede weitere Änderung kostet 50 Münzen; eine Änderung umfasst immer beide Bausteine.
_Avoid_: Nickname, Spitzname

**Nebel**:
Die Verhüllung der Regionskarte. Jeder gemeisterte Meilenstein lichtet den Nebel um sich und gibt Zeichnungen der Landschaft frei, ohne Münzen. Ein Meilenstein, den die Meilensteinfreigabe noch zurückhält, liegt im Nebel: nur Umriss und Nummer, ohne Namen, nicht wählbar.
_Avoid_: Fog of War, Verdeckung

**Expedition**:
Ein gemeinsames Ziel der ganzen Klasse, das die Lehrkraft mit Zahl, Enddatum und Belohnung setzt (z. B. „120 Expeditionszeichen bis zu den Ferien“, Belohnung Expeditionsfahne fürs Wappen oder eine Spielpause). Jeder Schüler sieht den Stand der Klasse und nur für sich seinen eigenen Beitrag, nie die Beiträge anderer. Ist das Ziel erreicht, bekommen alle die Belohnung.
_Avoid_: Klassenwettbewerb, Challenge, Quest

**Expeditionszeichen**:
Der Beitrag eines Schülers zur Expedition: eines je Siegel und höchstens eines am Tag für einen gelösten Rückblick.
_Avoid_: Punkte, Klassenpunkte

**Kundschafter**:
Die Rolle des Schülers in der Rahmenhandlung: Er erkundet im Auftrag des Königs die Regionen des Reiches; jedes Kapitel ist eine Region.
_Avoid_: Lokführer, Held, Spieler

## Hilfe und Diagnose

**Prozessbezogene Kompetenz**:
Eine der fünf Denkweisen des Bildungsplans 2016, die eine Aufgabe neben dem Stoff verlangt: Argumentieren, Probleme lösen, Modellieren, mit symbolischen Elementen umgehen, Kommunizieren. Jede Aufgabe trägt eine als Haupt- und höchstens eine als Nebenkompetenz. Aus ihnen entsteht das Kompetenzprofil.
_Avoid_: Kompetenz (allein, das ist mehrdeutig mit Lernziel), Skill

**Kompetenzprofil**:
Die Darstellung eines Schülers oder einer Klasse über die fünf prozessbezogenen Kompetenzen als Netzdiagramm. Zunächst nur im Lehrer-Dashboard.
_Avoid_: Radar (allein), Kompetenzradar, Stärkenprofil

**Typischer Fehler**:
Eine vorab bei der Aufgabe hinterlegte falsche Antwort samt der Fehlvorstellung, die sie verrät (z. B. „Zähler und Nenner addiert“).
_Avoid_: Fehlertyp, Distraktor

**Überwundene Fehlvorstellung**:
Eine Fehlvorstellung, die ein Schüler gezeigt hat und nach der er drei Aufgaben desselben Lernziels richtig und ohne sie gelöst hat. Taucht sie wieder auf, gilt sie für die Lehrkraft wieder als aktiv.
_Avoid_: korrigierter Fehler, behobener Fehler

**Aha-Moment**:
Eine überwundene Fehlvorstellung, wie der Schüler sie in seiner eigenen Sicht beim Wappen sieht: nur Überwundenes, nie offene Fehler, ohne Münzen.
_Avoid_: Erfolg, Abzeichen, Fehlerliste

**Diskrepanz**:
Wenn die Einschätzung eines Schülers nicht zu seinen Ergebnissen passt: überschätzt (oft sicher falsch oder in der Selbsteinschätzung zu hoch) oder unterschätzt (oft unsicher richtig oder zu niedrig). Die Lehrkraft filtert danach im Lernstand.
_Avoid_: Fehleinschätzung, Kalibrierung

**Diagnose**:
Die Auswertung des Lernstands im Lehrer-Dashboard: was Schüler und Klasse bearbeitet haben, wo sie hängen, welche Hilfen sie nutzen und welche typischen Fehler sie machen.
_Avoid_: Statistik, Analyse

**Bericht**:
Ein Export der Diagnose als PDF oder Excel-Datei; Namen werden erst beim Export aus der Namensliste eingesetzt.
_Avoid_: Report, Ausdruck

**Merkzettel**:
Die Regeln eines Unterkapitels in Kürze, mit einem vorgerechneten Beispiel und einem Hinweis fürs Heft. Jederzeit frei zugänglich, kostet keine Münzen und zählt nicht als Hilfekärtchen.
_Avoid_: Regelheft, Spickzettel

**Wortspeicher**:
Die Wörter eines Meilensteins mit je einer Erklärung in einem Satz, neben der Aufgabe. Er zeigt nur die Wörter bis zur Niveaustufe der Aufgabe, ist auf F und G aufgeklappt und auf M und E zugeklappt. Kostet nichts.
_Avoid_: Glossar, Vokabelliste

**Einfache Sprache**:
Die Schreibweise aller Aufgaben auf F und G: ein Gedanke pro Satz, keine Nebensätze, jeder Satz in einer eigenen Zeile, Alltagswörter, Zahlen als Ziffern, die Frage am Schluss.
_Avoid_: Leichte Sprache (die trennt Wörter mit Bindestrich, das tun wir nicht)

**Anforderungsbereich (AFB)**:
Die Art des Denkens, die eine Aufgabe verlangt: I wiedergeben, II Zusammenhänge herstellen, III beurteilen und begründen. Er wird relativ zur Niveaustufe gelesen. Je Lernziel und Niveaustufe gibt es sechs Aufgaben in fester Folge: F I, I, I, I, II, I; G I, I, II, I, II, III; M I, II, II, I, II, III; E I, II, II, III, II, III.
_Avoid_: Schwierigkeit

**Etappe**:
Das Aktuelle Kapitel mit dem nächsten Meilenstein, den die Aufgabenführung vorschlägt. Auf der Startseite leuchtet sein Tor, auf seiner Regionskarte der nächste Meilenstein; einen eigenen Knopf „Weitermachen“ gibt es nicht. Ist das Aktuelle Kapitel gemeistert oder keines gesetzt, leuchtet das Kapitel, das die Aufgabenführung wählt; ist alles gemeistert, leuchtet nichts. Gesperrte Meilensteine zählen nicht mit.
_Avoid_: Wochenmission, Wochenziel

**Wegstück**:
Ein Päckchen von fünf Aufgaben, etwa fünf Minuten Arbeit, mit „Aufgabe 3 von 5“ und einem kurzen Abschluss („Wegstück geschafft: 4 von 5“). Es gliedert eine lange Arbeitsphase in kleine, abschließbare Teile; eine Stunde hat etwa zehn bis zwölf Wegstücke.
_Avoid_: Runde (das ist ein Knopftext), Etappe (das ist das Kapitel), Chunk, Sequenz

**Seitenblick**:
Die eine Aufgabe in einem Wegstück, die zu einem schon besiegelten Lernziel desselben Kapitels gehört statt zum laufenden. Sie bringt Münzen, zählt für kein Siegel und nimmt keines weg. Sie kommt erst, wenn der Schüler in der aktuellen Klassenstufe mindestens 10 Siegel und im selben Kapitel mindestens 3 Siegel hat; vorher entfällt sie. Sie sagt dazu, wo es danach weitergeht.
_Avoid_: Rückblick (der ist ein eigenes Päckchen, einmal am Tag), Wiederholungsaufgabe

**Rast**:
Ein Vorschlag von 60 Sekunden Pause vom Bildschirm nach jedem vierten Wegstück, mit Sanduhr, überspringbar und ohne Münzen. Die Lehrkraft schaltet sie pro Klasse ab; standardmäßig ist sie an.
_Avoid_: Spielpause (die ist für Minispiele), Pause (allein)

**Gesehene Lösung**:
Ein Schüler hat die Lösung einer Aufgabe gesehen, wenn er sie nach zwei Fehlversuchen nicht gelöst hat (dann steht die Lösung da) oder das Lösungsschritt-Kärtchen geöffnet hat. Tipp und Beispiel zählen nicht dazu. Löst er dieselbe Aufgabe am selben Tag, bringt sie 1 Münze und zählt nicht fürs Siegel; ab dem nächsten Tag zählt sie wieder normal (ADR 0031).
_Avoid_: abgeschrieben, geschummelt

**Lösungen durchgeklickt**:
Eine Auffälligkeit für die Lehrkraft: Mindestens 5 der letzten 10 Aufgaben eines Schülers endeten mit gesehener Lösung, jede in unter 30 Sekunden.

**Hilfekärtchen**:
Eine von bis zu drei aufeinander aufbauenden Hilfen zu einer Aufgabe: Tipp, Beispiel, Lösungsschritt. F und G haben alle drei, M hat Tipp und Lösungsschritt, E nur den Tipp. Auf F liegt der Tipp von Anfang an offen, auf G und M öffnet er sich nach dem ersten falschen Versuch von selbst, auf E nur auf Wunsch. Der Tipp kostet keine Münzen, Beispiel und Lösungsschritt senken sie.
_Avoid_: Joker, Hinweis

**Hilferuf**:
Die Bitte eines Schülers um persönliche Hilfe durch die Lehrkraft, aus einer Aufgabe heraus und unabhängig von Hilfekärtchen. Der Schüler muss einen Hilferuf-Grund wählen.

**Hilferuf-Grund**:
Der Anlass eines Hilferufs, den der Schüler mit einem Klick wählt und die Lehrkraft sofort sieht: Ich verstehe die Aufgabe nicht, Die Aufgabe ist mir zu schwer, Ich glaube, die Aufgabe ist falsch, Technisches Problem, Etwas anderes. Aus „Aufgabe ist falsch“ kann die Lehrkraft mit einem Klick eine Aufgabenmeldung machen.
_Avoid_: Kategorie, Hilfeart
_Avoid_: Meldung, Ticket

**Hilfe-Warteschlange**:
Die nach Eingang geordnete Liste offener Hilferufe einer Klasse im Lehrer-Dashboard.
_Avoid_: Queue

## Speichern

**Startdatei**:
Die unveränderliche HTML-Datei, die das jeweils aktuelle Dashboard lädt: `Mathekingdom.html` auf dem Schülerlaufwerk für das Schüler-Dashboard, `Mathekingdom-Lehrer.html` für das Lehrer-Dashboard einer Lehrkraft (mit ihrem Kürzel), `Mathekingdom-Admin.html` für das Administrator-Dashboard. Schüler- und Lehrer-Startdateien erstellt der Administrator; sie enthalten seinen öffentlichen Schlüssel und den Pfad des Mathekingdom-Ordners als Hinweis. Ohne Internet startet die Kopie aus dem Mathekingdom-Ordner.
_Avoid_: Launcher, Verknüpfung

**Version**:
Der Stand beider Dashboards, den Schüler und Lehrkraft gerade sehen, mit Nummer und Datum (z. B. „0.1 vom 17.11.2026“). Schüler- und Lehrer-Dashboard tragen immer dieselbe Nummer. Die erste Ziffer steigt nur, wenn alte Speicherstände oder Klassendateien nicht mehr passen.
_Avoid_: Release, Build, Stand (für die Nummer)

**Versionslog**:
Die Liste aller Versionen mit dem, was sich darin für Schüler und für die Lehrkraft geändert hat.
_Avoid_: Changelog, Patchnotes

**Veröffentlichter Stand**:
Die Version, die die Startdateien gerade laden. Er ändert sich nur, wenn die Lehrkraft eine neue Version freigibt.
_Avoid_: Live-Version, Produktion

**Lehrerlaufwerk**:
Das persönliche Netzlaufwerk einer Lehrkraft; nur sie hat Zugriff. Hier liegt der private Schlüssel des Administrators.
_Avoid_: Lehrer-PC (für Daten)

**Lehrertauschlaufwerk**:
Das gemeinsame Netzlaufwerk aller Lehrkräfte der Schule; Schüler haben keinen Zugriff. Hier liegen Lehrerdaten und Backups im Mathekingdom-Ordner.
_Avoid_: Lehrerlaufwerk (für das gemeinsame), Share

**Schülerlaufwerk**:
Das persönliche Netzlaufwerk eines Schülers, auf dem seine Startdatei liegt.
_Avoid_: Home-Laufwerk

**Schülertauschlaufwerk**:
Das gemeinsame Netzlaufwerk aller Schüler der Schule, auf dem alle Schüler und Lehrkräfte lesen und schreiben. Hier liegen die Klassenordner im Mathekingdom-Ordner.
_Avoid_: Klassenlaufwerk, Share

**Mathekingdom-Ordner**:
Der Ordner `Mathekingdom` auf dem Schülertauschlaufwerk und auf dem Lehrertauschlaufwerk, darin je ein Schuljahresordner und darin die Klassen. Er wird einmal gewählt und danach im Browser gemerkt.
_Avoid_: Wurzel, Basisordner

**Ordnersatz**:
Die Ordner, mit denen ein Dashboard an einem Ort arbeitet, etwa die Mathekingdom-Ordner auf den Tauschlaufwerken in der Schule oder Ordner zu Hause. Der Browser merkt sich je Dashboard bis zu zwei Ordnersätze und öffnet mit dem, dessen Ordner antworten.
_Avoid_: Profil, Standort

**Schuljahresordner**:
Der Ordner eines Schuljahres im Mathekingdom-Ordner, benannt wie `2026-27`. Welches Schuljahr gilt, legt der Administrator fest.
_Avoid_: Jahrgang

**Administrator**:
Eine Lehrkraft mit dem Administrator-Schlüssel und dem Administrator-Dashboard: Sie legt Schuljahre, Klassen, Lehrkräfte (Kürzel) und Schüler an und löscht sie, ordnet Lehrkräfte Klassen zu, wechselt das Schuljahr, erstellt die Startdateien, stellt Backups wieder her, liest Betriebsprotokoll und Nutzungsstatistik und betreut die Aufgaben. Lernstände sieht sie im Lehrer-Dashboard, in allen Klassen.
_Avoid_: Admin (im Text für Nutzer), Schulleitung, Lehrkraft mit Einblick in alle Klassen

**Einblick in alle Klassen**:
Ein Recht, das der Administrator einer Lehrkraft gibt: Sie öffnet im Lehrer-Dashboard jede Klasse der Schule, mehr nicht. Administrator wird man nur mit einer Kopie der Schlüsseldatei.
_Avoid_: Administratorrechte

**Administrator-Dashboard**:
Die dritte Anwendung neben Schüler- und Lehrer-Dashboard, nur für Administratoren. Mit ihr beginnt die Einrichtung.
_Avoid_: Verwaltung, Klasse (das ist ein Bereich im Lehrer-Dashboard)

**Kürzel**:
Das Lehrerkürzel, mit dem der Administrator eine Lehrkraft anlegt; jede Lehrkraft hat einen eigenen Schlüssel.
_Avoid_: Lehrer-ID, Login

**Schulverzeichnis**:
Die vom Administrator unterschriebene Datei im Mathekingdom-Ordner des Schülertauschlaufwerks: aktuelles Schuljahr, Klassen und die Schlüssel der Lehrkräfte jeder Klasse. Die Startdatei vertraut nur dem Administrator und über das Schulverzeichnis den Lehrkräften.
_Avoid_: Konfiguration, schule.json (im Gespräch)

**Speicherstand**:
Die Datei eines einzelnen Schülers im Klassenordner, die seinen gesamten Lernstand und sein Versuchsprotokoll enthält.
_Avoid_: Spielstand, Save, Profil

**Versuchsprotokoll**:
Die lückenlose Liste aller Versuche eines Schülers, Grundlage der Diagnose und der Kronen. Jeder Versuch trägt die Version des Schüler-Dashboards. Es wandert bei Klassenwechsel und Schuljahreswechsel mit und wird nie nach dem Auslesen zurückgesetzt; Auswertungen filtern stattdessen nach Version oder Zeitraum.
_Avoid_: Log, Verlauf

**Betriebsprotokoll**:
Die Liste der technischen Ereignisse eines Dashboards: jeder Start mit Quelle und Version, jedes Sitzungsende und jedes technische Problem, etwa GitHub nicht erreichbar, Speichern fehlgeschlagen, ein zweites Fenster mit demselben Code oder ein Programmfehler. Handlungen von Lehrkraft und Administrator wie eine Münzgabe stehen dort mit der Art „Lehrkraft“, harmlose Hinweise mit „Info“. Es enthält keine Lerndaten. Nur der Administrator sieht es, über alle Klassen und Lehrkräfte; die Lehrkraft sieht nur Warnungen, bei denen sie im Unterricht selbst handeln kann.
_Avoid_: Log, Status, Fehlerliste

**Schuljahreswechsel**:
Der vom Administrator ausgelöste Übergang aller Klassen ins neue Schuljahr, in einer Tabelle für alle Schüler: Vorgeschlagen ist die nächste Klassenstufe mit demselben Buchstaben (aus 5a wird 6a, aus 5A-K4M2 wird 6A-K4M2), Ausnahmen sind Wiederholung, eine andere Klasse oder „verlässt die Schule“; Klasse 10 wird nie übernommen. Münzen, Siegel, Rang, Wappen, Versuchsprotokoll und Zielniveau ziehen mit; Tore, Aktuelles Kapitel, Sitzplan und Notizen beginnen neu.
_Avoid_: Versetzung, Reset

**Klassenordner**:
Der Ordner einer Klasse im Schuljahresordner auf dem Schülertauschlaufwerk (z. B. `Mathekingdom/2026-27/5a`), in dem die Speicherstände der Schüler liegen.
_Avoid_: Laufwerk, Share

**Klassendatei**:
Die Datei im Klassenordner, die nur die Lehrkraft schreibt und die Schüler lesen: Freigaben, aktuelles Kapitel, Zielniveaus, Antworten auf Hilferufe. Sie enthält keine Namen.
_Avoid_: Konfiguration, Einstellungen

**Klassendaten**:
Die Datei einer Klasse auf dem Lehrertauschlaufwerk (`Mathekingdom/2026-27/5a/klasse.json`) mit allem, was nur Lehrkräfte sehen dürfen: Namensliste, PINs, Einstellungen, Sitzplan, Notizen. Alle Lehrkräfte der Klasse teilen sie.
_Avoid_: Lehrer-Klassendatei, Lehrerdaten (für diese Datei)

**Lehrerdaten**:
Bis Version 0.20 die eine Datei der Lehrkraft mit allen Klassen (`lehrerdaten.json`); seit 0.21 nur noch Schlüssel und Betriebsprotokoll einer Lehrkraft (`Mathekingdom/<Kürzel>/lehrer.json`).
_Avoid_: Lehrer-Klassendatei

**Aufgabenkennung**:
Die eindeutige Kennung einer Aufgabe im Aufgabenpool, etwa `5.3.1-K1-F-01`. Sie steht klein beim Schüler unten links und im Lehrer-Dashboard bei der Aufgabe, an der ein Schüler gerade sitzt.
_Avoid_: Aufgaben-ID, Nummer

**Aufgabenmeldung**:
Der Hinweis einer Lehrkraft an den Administrator, dass eine Aufgabe fehlerhaft ist: Aufgabenkennung, Art (Lösung falsch, nicht lösbar, unklar formuliert, Bild falsch) und ein Satz. Der Administrator setzt sie auf offen, behoben oder kein Fehler und behebt die Aufgabe; die Lehrkraft sieht diesen Stand. Schüler melden nicht.
_Avoid_: Support-Protokoll, Ticket, Fehlermeldung

**Auffällige Aufgabe**:
Eine Aufgabe, die über alle Klassen hinweg an ihren Zahlen auffällt, ohne dass jemand sie gemeldet hat: etwa viele gleiche falsche Antworten, die kein typischer Fehler sind, oder eine viel niedrigere Lösungsquote als die übrigen Aufgaben ihres Lernziels. Nur der Administrator sieht diese Liste, ohne Namen.
_Avoid_: schwierige Aufgabe (das zeigt das Lehrer-Dashboard je Klasse)

**Aufgabenanalyse**:
Die Auswertung im Administrator-Dashboard, die zu jeder Aufgabe Bearbeitungen, Lösungsquoten, Dauer, Hilfekärtchen, Abbrüche, häufigste falsche Antwort und Feedback zeigt, gefiltert nach Klasse, Zeitraum (ein Tag, seit dem letzten Export, das ganze Schuljahr) und Version des Schüler-Dashboards, etwa einer einzelnen Teststunde. Nach dem Export wird nichts gelöscht. Auffällig markiert ist eine Aufgabe, die mindestens drei verschiedene Schüler bearbeitet haben und die viel länger dauert oder viel öfter falsch ist als die übrigen ihres Lernziels und Niveaus. Jede häufige falsche Antwort trägt die bekannte Fehlvorstellung aus dem Pool oder „unbekannt“; eine unbekannte, gehäufte Antwort kann auf einen Fehler in der Aufgabe zeigen. Sie wird beim Öffnen aus den Speicherständen berechnet und erst beim Export als Datei abgelegt, ohne Namen und Schülercodes.
_Avoid_: Statistik, Aufgabenstatistik, Analyse (allein)

**Feedbackfrage**:
Eine kurze Frage an den Schüler mit zwei Antworten, etwa zum Design oder dazu, ob die gerade gelöste Aufgabe zu schwer war. Sie kommt nach dem Ergebnis einer Aufgabe, nie mitten in einer Aufgabe, im Rückblick oder im Einstiegscheck, muss beantwortet werden und bringt keine Münzen. Ob und nach wie vielen Aufgaben sie kommt, stellt der Administrator je Klasse ein. Die Fragen kommen reihum; mit welcher ein Schüler beginnt, hängt von seinem Code ab, damit in einer Stunde alle Fragen vorkommen. Die Antworten sieht nur der Administrator, ohne Namen.
_Avoid_: Umfrage, Bewertung, Rückmeldung (das ist die Antwort des Dashboards auf eine Aufgabe)

**Zweites Fenster**:
Ein weiteres Fenster oder ein weiterer Tab im selben Browser, in dem sich derselbe Schüler anmeldet, während er schon angemeldet ist. Es wird gesperrt und speichert nicht, damit nicht zwei Fenster gleichzeitig in seinen Speicherstand schreiben; im Betriebsprotokoll steht es als Problem.
_Avoid_: Doppelanmeldung (das ist der Doppelklick beim Anmelden, den das Dashboard einfach ignoriert)

**Aufgabentester**:
Die Karte im Admin-Dashboard unter Aufgaben, in der der Administrator jede Aufgabe einmal so sieht und bedient, wie ein Schüler sie sieht, mit Lösung, typischen Fehlern und Aufgabenkennung daneben. Er hakt sie als kontrolliert ab, meldet einen Fehler oder überspringt sie.
_Avoid_: Aufgabenprüfung, Testmodus

**Kontrolliert**:
Eine Aufgabe, die der Administrator im Aufgabentester von Hand durchgesehen und bestätigt hat. Das Häkchen gilt für genau diesen Inhalt: Ändern sich Text, Lösung, Hilfen oder Bild, ist die Aufgabe wieder nicht kontrolliert. Schüler bekommen kontrollierte und nicht kontrollierte Aufgaben gleichermaßen; nur der Administrator und die Aufgabenübersicht zeigen den Zustand.
_Avoid_: geprüft (Prüfen ist das Auswerten einer Antwort), freigegeben

**Kontrollliste**:
Die Datei, die der Administrator aus dem Aufgabentester exportiert: alle kontrollierten Aufgaben mit ihrer Aufgabenkennung. Sie wird in den Aufgabenpool übernommen, damit das Häkchen auch die nächste Version überdauert.

**Namensliste**:
Die Zuordnung von Schülercodes zu echten Namen, Teil der Klassendaten.
_Avoid_: Klassenliste (für die Datei)

**Entfernen** (eines Schülers):
Der Schüler verschwindet aus der Namensliste, sein Speicherstand bleibt liegen; das lässt sich rückgängig machen. Lehrkraft und Administrator dürfen das.
_Avoid_: Löschen (für diesen Schritt)

**Löschen** (eines Schülers):
Speicherstand und seine Backups werden endgültig gelöscht, etwa bei Schulwechsel. Nur der Administrator darf das.
_Avoid_: Entfernen (für diesen Schritt)

**Klasse auflösen**:
Die Klasse verschwindet aus dem Schulverzeichnis, ihre Ordner bleiben. Erst danach kann der Administrator die Daten der Klasse endgültig löschen.
_Avoid_: Klasse löschen (für den ersten Schritt)

**Nutzungsstatistik**:
Zahlen zum Betrieb im Administrator-Dashboard, über alle Klassen und je Klasse: Starts, Versionen, Browser, technische Probleme, aktive Schüler, Alter des letzten Backups. Sie enthält keine Namen und keinen Lernstand; Lernstände sieht man im Lehrer-Dashboard.
_Avoid_: Statistik (allein), Auswertung

## Ergänzungen zum Lehrer-Dashboard

- **Live-Status**: Einschätzung, wie es einem Schüler in der laufenden Stunde geht: Hilferuf, blockiert, lässt nach, beobachten, im Flow, arbeitet, inaktiv, nicht da. Blockiert ist ein Schüler nach mehreren Fehlversuchen in Folge oder wenn er lange an einer Aufgabe sitzt, auch ohne Hilferuf. „Lässt nach“ heißt: Die Quote richtiger Aufgaben ist über zwei Wegstücke hinweg deutlich gesunken; der Schüler selbst bekommt dazu keine Meldung.
- **Akut-Zone**: Die Liste der Schüler, um die sich die Lehrkraft jetzt kümmern sollte: offene Hilferufe zuerst, dann blockierte Schüler. Ersetzt die frühere reine Hilfe-Warteschlange in der Anzeige; die Hilfe-Warteschlange ist ihr erster Teil.
- **Sitzplan**: Anordnung der Schüler im Klassenraum. Gehört zu den Klassendaten.
- **Impuls**: Vorschlag des Lehrer-Dashboards an die Lehrkraft, zum Beispiel ein Mini-Workshop, wenn mehrere Schüler denselben typischen Fehler machen, oder ein Hinweis auf einen Schnellläufer.
- **Lernbegleiter**: Ein Schüler, der ein Lernziel schon erreicht hat und einem blockierten Mitschüler helfen könnte. Nur ein Vorschlag an die Lehrkraft.
- **Schnellläufer**: Ein Schüler, der in der laufenden Stunde einen Meilenstein gemeistert hat. Die Lehrkraft kann sein Zielniveau anheben.
- **Gesperrter Meilenstein**: Ein Meilenstein, den die Lehrkraft für einen Schüler geschlossen hat. Der Schüler sieht sie, kann dort aber keine Aufgaben starten. Gemeistert wird ein Meilenstein nie von Hand, sondern nur über seine Lernziele.
- **Nachricht**: Kurzer Text der Lehrkraft an einen einzelnen Schüler. Der Schüler bestätigt ihn.
- **Anforderungsbereich (AFB)**: Einordnung jeder Aufgabe in I (Reproduzieren), II (Zusammenhänge herstellen) oder III (Verallgemeinern und Reflektieren). Unabhängig von der Niveaustufe.
- **Aufgaben-Audit**: Auswertung je Aufgabe, um unklare oder zu schwere Aufgaben im Aufgabenpool zu finden.
- **Abbruch**: Ein Schüler verlässt eine Aufgabe ohne Ergebnis.
- **Bereich**: Einer der vier Teile des Lehrer-Dashboards: Jetzt (Sitzplan und Akut-Zone), Lernstand (Klasse, Lernziel, Schüler), Aufgaben (Aufgaben-Audit), Klasse (Schüler, Unterricht, Berichte; bis 0.21 „Verwaltung“). Beim Öffnen einer Klasse erscheint Jetzt, wenn in den letzten 10 Minuten jemand gearbeitet hat, sonst Lernstand.
- **Leitfrage**: Die eine Frage, die ein Bereich beantwortet. Jetzt: Wer braucht mich in dieser Minute? Lernstand: Was plane ich für die nächste Stunde, wen fördere ich, was wiederhole ich mit allen? Aufgaben: Welche Aufgaben funktionieren nicht, und welche greife ich an der Tafel auf? Was keiner Leitfrage dient, gehört in den Bereich Klasse oder ist eine ausschaltbare Auswertung.
- **Auswertung**: Eine einzelne Karte mit Zahlen oder Namen in den Bereichen Lernstand und Aufgaben, etwa die Heatmap „Wer steht wo?“ oder das Kompetenzprofil. Sie ist entweder fest (beantwortet die Leitfrage des Bereichs) oder ausschaltbar. Eine Einstellung wie „Meilensteine sperren“ ist keine Auswertung.
  _Avoid_: Statistik, Analyse, Widget
- **Ansicht**: Welche ausschaltbaren Auswertungen eine Lehrkraft eingeschaltet hat. Sie gilt für alle Klassen dieser Lehrkraft und liegt in ihren Lehrerdaten, damit sie an jedem Schulrechner gleich ist. Eine ausgeschaltete Auswertung verschwindet ganz; der Bereich nennt nur, wie viele ausgeblendet sind. Geändert wird sie über „Ansicht anpassen“ oben im Bereich.
  _Avoid_: Einstellungen, Layout, Profil
- **Tafelbild**: Vollbild-Ansicht im Bereich Jetzt, die eine Aufgabe mit den häufigsten falschen Antworten der Klasse am Beamer zeigt, ohne Codes und Namen. Sie wird aus einem Mini-Workshop-Impuls geöffnet.
- **Lernzielstand**: Wie weit ein Schüler bei einem Lernziel ist: nicht begonnen, begonnen, wackelig, unter dem Ziel geschafft, Siegel, gefestigt oder aufzufrischen. Gefestigt heißt: Siegel vorhanden und das Lernziel mindestens sieben Tage nach dem Siegel im Rückblick oder im Seitenblick richtig gelöst. Aufzufrischen heißt: Siegel vorhanden, aber im Rückblick falsch gelöst.
- **Hilfebedarf**: Wie oft ein Schüler bei einem Lernziel Beispiel- oder Lösungsschritt-Kärtchen braucht, und ob das mit der Zeit weniger wird.
- **Versuchsverlauf**: Für die Lehrkraft die letzten Aufgaben eines Schülers mit erstem Versuch, zweitem Versuch, Ergebnis und erkannter Fehlvorstellung. Wackelig heißt begonnen, aber mit vielen Fehlversuchen oder Lösungsschritt-Kärtchen.

