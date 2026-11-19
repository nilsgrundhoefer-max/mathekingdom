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
Die konkrete Lerngruppe eines Schuljahres (z. B. 7b). Sie wird beim ersten Öffnen festgelegt und ändert sich nur zum neuen Schuljahr.
_Avoid_: Kurs, Gruppe

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

**Rechenraster**:
Ein Aufgabenformat für das schriftliche Rechnen: ein Feld je Ziffer in Stellenwertspalten, beim Multiplizieren mit einer Zeile je Teilprodukt, so wie im Heft.
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
Die Folge der Kapitel einer Klassenstufe über das Schuljahr; alle Kapitel bis zum aktuellen Kapitel sind freigeschaltet.
_Avoid_: Lernpfad (für diese Ebene), Stoffverteilungsplan

**Aktuelles Kapitel**:
Das Kapitel, das die Lehrkraft für eine Klasse gerade als laufendes Thema gesetzt hat.
_Avoid_: aktuelles Thema

**Lernpfad**:
Der Weg durch die Unterkapitel eines einzelnen Kapitels.
_Avoid_: Kurs, Weg, Themenbereich

**Schlossgarten**:
Die Übersicht aller Kapitel einer Klassenstufe: der Ausgangsort in der Mitte des Königreichs, mit einem Gartentor für jede Region. Hinter jedem Tor liegt die Regionskarte. Gesperrte Kapitel haben ein geschlossenes Tor.
_Avoid_: Reichskarte, Weltkarte, Jahresplan (für die Ansicht)

**Regionskarte**:
Die Darstellung eines Lernpfads im Stil einer alten Landkarte: ein einziger Weg, auf dem die Unterkapitel Meilensteine sind. Die Niveaustufe ist kein eigener Weg mehr, sondern die Kronenfarbe, um die der Schüler spielt.
_Avoid_: Metrokarte, Lernlandkarte, Fortschrittsbalken, Straße

**Meilenstein**:
Ein Unterkapitel auf der Regionskarte. Er ist gemeistert, wenn der Schüler alle Lernziele des Unterkapitels erreicht hat, also eine Krone auf oder über seinem Zielniveau trägt. Meilensteine gehen nicht nacheinander auf; die Karte zeigt nur eine empfohlene Reihenfolge.
_Avoid_: Station, Haltestelle, Level, Knotenpunkt

**Abstecher**:
Ein zusätzlicher Meilenstein, der abseits des Weges gestrichelt angehängt ist. Er bekommt eine Krone nach derselben Regel.
_Avoid_: Zusatzstation, Extra

**Lernziel**:
Eine überprüfbare Kompetenz, festgelegt pro Klassenstufe und Kapitel nach dem Bildungsplan 2016 Baden-Württemberg und einem Unterkapitel zugeordnet. Es ist erreicht, wenn der Schüler drei Aufgaben dazu richtig löst, davon mindestens zwei auf oder über seinem Zielniveau und ohne Lösungsschritt-Kärtchen, und mindestens eine aus dem Anforderungsbereich II oder III.
_Avoid_: Kompetenz (allein), Ziel

**Rückblick**:
Ein freiwilliges Päckchen aus drei bis fünf gemischten Aufgaben zu Lernzielen, deren Siegel etwa 2, 7 und 21 Tage alt sind. Er steht höchstens einmal am Tag oben auf der Startseite und bringt die normalen Münzen. Ein Fehler nimmt kein Siegel weg; die Aufgabe kommt im nächsten Rückblick wieder, und das Lernziel gilt für die Lehrkraft als aufzufrischen.
_Avoid_: Wiederholung (allein), Auffrischen, Review

**Einstiegscheck**:
Sechs bis acht Aufgaben über alle Meilensteine eines Kapitels, angeboten auf der Regionskarte, solange im Kapitel noch keine Aufgabe bearbeitet ist. Je Aufgabe ein Versuch, ohne Hilfekärtchen. Sein Ergebnis stellt die Kronenwahl vor; er bringt keine Siegel und zählt für kein Lernziel. Freiwillig, außer die Lehrkraft macht ihn für ein Kapitel zur Pflicht.
_Avoid_: Eingangstest, Vortest, Diagnosetest

**Voraussetzung**:
Ein Lernziel, auf dem ein anderes Lernziel aufbaut, auch aus früheren Kapiteln oder aus dem Grundschulstoff.
_Avoid_: Vorwissen (für die Verknüpfung)

**Brücke**:
Drei Aufgaben zu einer Voraussetzung, eine Niveaustufe unter dem Zielniveau, die das Schüler-Dashboard auf M und E vorschlägt, wenn ein Lernziel wackelig wird. Auf G greift stattdessen die Grundlagen-Schleife. Höchstens eine je Lernziel und Tag, freiwillig; die Lehrkraft bekommt dazu einen Impuls.
_Avoid_: Förderaufgabe, Rückweg

**Sonderauftrag**:
Drei bis fünf Aufgaben zu einem Lernziel, die die Lehrkraft einem einzelnen Schüler im Schülerprofil schickt, auf einer Niveaustufe, die sie frei wählt (F bis E). Er kommt als versiegelter Brief des Königs, nie mitten in einer Aufgabe, und bleibt sichtbar, bis er erledigt ist oder die Lehrkraft ihn zurückzieht; höchstens einer ist offen. Freiwillig, ohne Ablaufdatum. Seine Aufgaben zählen wie sonst für Lernziel und Wegstück; sind alle bearbeitet, gibt es 100 Münzen dazu, egal wie viele richtig sind. Danach geht es zurück an die Stelle, an der der Schüler war. Mitschüler erfahren nichts davon.
_Avoid_: Bonusquest, Quest, Förderbrief, Bonuspunkte

**Training**:
Aufgaben unter dem Zielniveau eines Schülers; sie bringen weniger Münzen und schließen kein Lernziel ab, können aber eine Krone unter dem Zielniveau bringen.
_Avoid_: Übungsmodus

## Belohnung

**Münze**:
Die ausgebbare Währung für richtig gelöste Aufgaben. Gemessen wird am Zielniveau des Schülers: Eine Aufgabe auf dem eigenen Zielniveau bringt jedem gleich viel, darüber etwas mehr, im Training weniger. Dazu kommen 100 Münzen für einen erledigten Sonderauftrag. Münzen gibt der Schüler im Wappenschrank, für Rechenpausen und für Belohnungsspiele aus.
_Avoid_: Punkte, Coins, Taler

**Siegel**:
Eine nicht ausgebbare Auszeichnung, genau eines pro erreichtem Lernziel.
_Avoid_: Stern, Punkte, Abzeichen

**Krone**:
Die nicht ausgebbare Auszeichnung eines Meilensteins, in einer der vier Kronenfarben. Sie zeigt das niedrigste Niveau, auf dem alle Lernziele des Meilensteins nachgewiesen sind. Jeder Schüler kann alle vier Kronen sammeln; gemeistert ist der Meilenstein aber erst mit einer Krone auf oder über seinem Zielniveau. Ein Schüler kann sie später aufwerten; der Meilenstein zeigt immer die beste Farbe. Kronen bringen keine Münzen und bestimmen nicht den Rang.
_Avoid_: Meilensteinkrone, Pokal, Medaille

**Kronenfarbe**:
Die Form, in der Schüler die Niveaustufen sehen: Bronze (F), Silber (G), Gold (M), Purpur (E). Bronze ist nur Anerkennung für drei richtige Aufgaben der Grundlage und steht nicht zur Wahl. Im Schüler-Dashboard erscheinen nur die Kronenfarben, im Lehrer-Dashboard nur die Niveaustufen.
_Avoid_: Kronenstufe, Lila, Purple

**Kronenwahl**:
Die Kronenfarbe, um die ein Schüler gerade spielt („Spiele um Gold“). Sie legt fest, auf welchem Niveau seine Aufgaben kommen, und gilt für das ganze Kapitel. Voreingestellt ist sein Zielniveau. Zur Wahl stehen Silber, Gold und Purpur; Bronze nur bei Zielniveau F.
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
Ein Teil des Wappens, den eine Klassenstufe neu öffnet: Klasse 5 Farben und Zeichen, Klasse 6 Schildteilung, Klasse 7 Helmzier, Klasse 8 Schildhalter, Klasse 9 Wahlspruch, Klasse 10 Prunkrahmen.

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

**Beiname**:
Der Name, unter dem ein Schüler auf der Bestenliste steht, aus festen Bausteinen gewählt (zum Beispiel „Seeblauer Falke“), nie frei getippt. Die erste eigene Wahl ist kostenlos, jede weitere Änderung kostet 50 Münzen; eine Änderung umfasst immer beide Bausteine.
_Avoid_: Nickname, Spitzname

**Nebel**:
Die Verhüllung der Regionskarte. Jeder gemeisterte Meilenstein lichtet den Nebel um sich und gibt Zeichnungen der Landschaft frei. Rein optisch, ohne Münzen.
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
Das Kapitel, an dem ein Schüler gerade arbeitet, mit der Zahl der gemeisterten Meilensteine und dem nächsten Meilenstein. Sie steht oben auf der Startseite. Gesperrte Meilensteine zählen nicht mit.
_Avoid_: Wochenmission, Wochenziel

**Wegstück**:
Ein Päckchen von fünf Aufgaben, etwa fünf Minuten Arbeit, mit „Aufgabe 3 von 5“ und einem kurzen Abschluss („Wegstück geschafft: 4 von 5“). Es gliedert eine lange Arbeitsphase in kleine, abschließbare Teile; eine Stunde hat etwa zehn bis zwölf Wegstücke.
_Avoid_: Runde (das ist ein Knopftext), Etappe (das ist das Kapitel), Chunk, Sequenz

**Seitenblick**:
Die eine Aufgabe in einem Wegstück, die zu einem schon besiegelten Lernziel desselben Kapitels gehört statt zum laufenden. Sie bringt Münzen, zählt für kein Siegel und nimmt keines weg. Gibt es im Kapitel noch kein Siegel, entfällt sie.
_Avoid_: Rückblick (der ist ein eigenes Päckchen, einmal am Tag), Wiederholungsaufgabe

**Rast**:
Ein Vorschlag von 60 Sekunden Pause vom Bildschirm nach jedem vierten Wegstück, mit Sanduhr, überspringbar und ohne Münzen. Die Lehrkraft schaltet sie pro Klasse ab; standardmäßig ist sie an.
_Avoid_: Spielpause (die ist für Minispiele), Pause (allein)

**Hilfekärtchen**:
Eine von bis zu drei aufeinander aufbauenden Hilfen zu einer Aufgabe: Tipp, Beispiel, Lösungsschritt. F und G haben alle drei, M hat Tipp und Lösungsschritt, E nur den Tipp. Auf F liegt der Tipp von Anfang an offen, auf G und M öffnet er sich nach dem ersten falschen Versuch von selbst, auf E nur auf Wunsch. Der Tipp kostet keine Münzen, Beispiel und Lösungsschritt senken sie.
_Avoid_: Joker, Hinweis

**Hilferuf**:
Die Bitte eines Schülers um persönliche Hilfe durch die Lehrkraft, jederzeit und unabhängig von Hilfekärtchen möglich.
_Avoid_: Meldung, Ticket

**Hilfe-Warteschlange**:
Die nach Eingang geordnete Liste offener Hilferufe einer Klasse im Lehrer-Dashboard.
_Avoid_: Queue

## Speichern

**Startdatei**:
Die unveränderliche HTML-Datei, die das jeweils aktuelle Dashboard lädt: `Mathekingdom.html` auf dem Schülerlaufwerk für das Schüler-Dashboard, `Mathekingdom-Lehrer.html` auf dem Lehrer-PC für das Lehrer-Dashboard. Ohne Internet startet sie die Kopie aus dem Klassenordner bzw. vom Lehrerlaufwerk.
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
Das persönliche Netzlaufwerk der Lehrkraft; nur sie hat Zugriff.
_Avoid_: Lehrer-PC (für Daten)

**Schülerlaufwerk**:
Das persönliche Netzlaufwerk eines Schülers, auf dem seine Startdatei liegt.
_Avoid_: Home-Laufwerk

**Klassenlaufwerk**:
Das gemeinsame Netzlaufwerk einer Klasse, auf das alle Schüler der Klasse schreiben dürfen.
_Avoid_: Tauschlaufwerk, Share

**Speicherstand**:
Die Datei eines einzelnen Schülers im Klassenordner, die seinen gesamten Lernstand und sein Versuchsprotokoll enthält.
_Avoid_: Spielstand, Save, Profil

**Versuchsprotokoll**:
Die lückenlose Liste aller Versuche eines Schülers im laufenden Schuljahr, Grundlage der Diagnose. Beim Schuljahreswechsel wird es in die Lehrerdaten archiviert und ein Jahr später gelöscht.
_Avoid_: Log, Verlauf

**Betriebsprotokoll**:
Die Liste der technischen Ereignisse eines Dashboards: jeder Start mit Quelle und Version und jedes technische Problem, etwa GitHub nicht erreichbar oder Speichern fehlgeschlagen. Es enthält keine Lerndaten; die Lehrkraft sieht es für die ganze Klasse als „Protokoll“ in der Verwaltung.
_Avoid_: Log, Status, Fehlerliste

**Schuljahreswechsel**:
Der von der Lehrkraft ausgelöste Übergang in die nächste Klassenstufe; Münzen, Siegel, Rang, Wappen und erreichte Lernziele bleiben erhalten.
_Avoid_: Versetzung, Reset

**Klassenordner**:
Der Ordner einer Klasse auf dem Klassenlaufwerk, in dem die Speicherstände der Schüler liegen.
_Avoid_: Laufwerk, Share

**Klassendatei**:
Die Datei im Klassenordner, die nur die Lehrkraft schreibt und die Schüler lesen: Freigaben, aktuelles Kapitel, Zielniveaus, Antworten auf Hilferufe. Sie enthält keine Namen.
_Avoid_: Konfiguration, Einstellungen

**Lehrerdaten**:
Die Datei auf dem Lehrerlaufwerk mit allem, was nur die Lehrkraft sehen darf: Namensliste, Notizen, Diagnosen.
_Avoid_: Lehrer-Klassendatei

**Namensliste**:
Die Zuordnung von Schülercodes zu echten Namen, Teil der Lehrerdaten.
_Avoid_: Klassenliste (für die Datei)

## Ergänzungen zum Lehrer-Dashboard

- **Live-Status**: Einschätzung, wie es einem Schüler in der laufenden Stunde geht: Hilferuf, blockiert, lässt nach, beobachten, im Flow, arbeitet, inaktiv, nicht da. Blockiert ist ein Schüler nach mehreren Fehlversuchen in Folge oder wenn er lange an einer Aufgabe sitzt, auch ohne Hilferuf. „Lässt nach“ heißt: Die Quote richtiger Aufgaben ist über zwei Wegstücke hinweg deutlich gesunken; der Schüler selbst bekommt dazu keine Meldung.
- **Akut-Zone**: Die Liste der Schüler, um die sich die Lehrkraft jetzt kümmern sollte: offene Hilferufe zuerst, dann blockierte Schüler. Ersetzt die frühere reine Hilfe-Warteschlange in der Anzeige; die Hilfe-Warteschlange ist ihr erster Teil.
- **Sitzplan**: Anordnung der Schüler im Klassenraum. Gehört zu den Lehrerdaten.
- **Impuls**: Vorschlag des Lehrer-Dashboards an die Lehrkraft, zum Beispiel ein Mini-Workshop, wenn mehrere Schüler denselben typischen Fehler machen, oder ein Hinweis auf einen Schnellläufer.
- **Lernbegleiter**: Ein Schüler, der ein Lernziel schon erreicht hat und einem blockierten Mitschüler helfen könnte. Nur ein Vorschlag an die Lehrkraft.
- **Schnellläufer**: Ein Schüler, der in der laufenden Stunde einen Meilenstein gemeistert hat. Die Lehrkraft kann sein Zielniveau anheben.
- **Gesperrter Meilenstein**: Ein Meilenstein, den die Lehrkraft für einen Schüler geschlossen hat. Der Schüler sieht sie, kann dort aber keine Aufgaben starten. Gemeistert wird ein Meilenstein nie von Hand, sondern nur über seine Lernziele.
- **Nachricht**: Kurzer Text der Lehrkraft an einen einzelnen Schüler. Der Schüler bestätigt ihn.
- **Anforderungsbereich (AFB)**: Einordnung jeder Aufgabe in I (Reproduzieren), II (Zusammenhänge herstellen) oder III (Verallgemeinern und Reflektieren). Unabhängig von der Niveaustufe.
- **Aufgaben-Audit**: Auswertung je Aufgabe, um unklare oder zu schwere Aufgaben im Aufgabenpool zu finden.
- **Abbruch**: Ein Schüler verlässt eine Aufgabe ohne Ergebnis.
- **Bereich**: Einer der vier Teile des Lehrer-Dashboards: Jetzt (Sitzplan und Akut-Zone), Lernstand (Klasse, Lernziel, Schüler), Aufgaben (Aufgaben-Audit), Verwaltung (Klasse und Codes, Backup, Berichte). Beim Öffnen einer Klasse erscheint Jetzt, wenn in den letzten 10 Minuten jemand gearbeitet hat, sonst Lernstand.
- **Tafelbild**: Vollbild-Ansicht im Bereich Jetzt, die eine Aufgabe mit den häufigsten falschen Antworten der Klasse am Beamer zeigt, ohne Codes und Namen. Sie wird aus einem Mini-Workshop-Impuls geöffnet.
- **Lernzielstand**: Wie weit ein Schüler bei einem Lernziel ist: nicht begonnen, begonnen, wackelig, Siegel, gefestigt oder aufzufrischen. Gefestigt heißt: Siegel vorhanden und das Lernziel mindestens sieben Tage nach dem Siegel im Rückblick oder im Seitenblick richtig gelöst. Aufzufrischen heißt: Siegel vorhanden, aber im Rückblick falsch gelöst.
- **Hilfebedarf**: Wie oft ein Schüler bei einem Lernziel Beispiel- oder Lösungsschritt-Kärtchen braucht, und ob das mit der Zeit weniger wird.
- **Versuchsverlauf**: Für die Lehrkraft die letzten Aufgaben eines Schülers mit erstem Versuch, zweitem Versuch, Ergebnis und erkannter Fehlvorstellung. Wackelig heißt begonnen, aber mit vielen Fehlversuchen oder Lösungsschritt-Kärtchen.

