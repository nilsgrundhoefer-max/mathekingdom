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

**Versuch**:
Eine abgegebene Antwort auf eine Aufgabe. Ein Schüler hat zwei Versuche; sind beide falsch, gilt die Aufgabe als nicht gelöst und die Lösung wird gezeigt. Ein Fehlversuch kostet nichts: Der zweite Versuch bringt so viele Münzen wie der erste.
_Avoid_: Eingabe, Abgabe

**Niveaustufe**:
Eine von vier Anforderungsstufen einer Aufgabe: F (Förderniveau), G (grundlegendes Niveau), M (mittleres Niveau), E (erweitertes Niveau). Die Stufen unterscheiden sich zuerst in der Art der Anforderung, erst danach in der Zahlengröße: F eine Handlung in einem Schritt, G ein Standardverfahren in einem Schritt, M mehrschrittig mit Übersetzen und Deuten, E Strukturen, Lücken und Behauptungen (siehe ADR 0009).
_Avoid_: Schwierigkeit, Level, Sterne, Siegel

**Zielniveau**:
Die Niveaustufe, auf der ein Schüler Lernziele nachweisen muss; Standard M, von der Lehrkraft pro Schüler anpassbar.
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

**Training**:
Aufgaben unter dem Zielniveau eines Schülers; sie bringen weniger Münzen und schließen kein Lernziel ab.
_Avoid_: Übungsmodus

## Belohnung

**Münze**:
Die ausgebbare Währung für richtig gelöste Aufgaben; höhere Niveaustufen bringen mehr, Training weniger.
_Avoid_: Punkte, Coins, Taler

**Siegel**:
Eine nicht ausgebbare Auszeichnung, genau eines pro erreichtem Lernziel.
_Avoid_: Stern, Punkte, Abzeichen

**Krone**:
Die nicht ausgebbare Auszeichnung eines Meilensteins, in einer der vier Kronenfarben. Sie zeigt das niedrigste Niveau, auf dem alle Lernziele des Meilensteins nachgewiesen sind. Jeder Schüler kann alle vier Kronen sammeln; gemeistert ist der Meilenstein aber erst mit einer Krone auf oder über seinem Zielniveau. Ein Schüler kann sie später aufwerten; der Meilenstein zeigt immer die beste Farbe. Kronen bringen keine Münzen und bestimmen nicht den Rang.
_Avoid_: Meilensteinkrone, Pokal, Medaille

**Kronenfarbe**:
Die Form, in der Schüler die Niveaustufen sehen: Bronze (F), Silber (G), Gold (M), Purpur (E). Im Schüler-Dashboard erscheinen nur die Kronenfarben, im Lehrer-Dashboard nur die Niveaustufen.
_Avoid_: Kronenstufe, Lila, Purple

**Rang**:
Die Stufe des Kundschafters (Wanderer, Kundschafter, Wegmeister, Hofkartograf), die sich allein aus der Zahl seiner Siegel ergibt und neue Wappen-Teile zum Kauf freischaltet.
_Avoid_: Level, Stufe

**Wappen**:
Das Schild, das ein Schüler selbst gestaltet; Farben und Zeichen kauft er mit Münzen. Ein Wappen-Zeichen heißt nie Krone (das teuerste Zeichen ist die Lilie).
_Avoid_: Avatar, Lok

**Minispiel**:
Ein kurzes, mathematiknahes Spiel von höchstens drei Minuten, das Münzen kostet und nur während einer Spielpause spielbar ist.
_Avoid_: Belohnungsspiel, Game

**Spielpause**:
Ein von der Lehrkraft pro Klasse eingeschaltetes Zeitfenster, in dem Minispiele erlaubt sind; standardmäßig aus.
_Avoid_: Freizeit, Pause

**Kundschafter**:
Die Rolle des Schülers in der Rahmenhandlung: Er erkundet im Auftrag des Königs die Regionen des Reiches; jedes Kapitel ist eine Region.
_Avoid_: Lokführer, Held, Spieler

## Hilfe und Diagnose

**Typischer Fehler**:
Eine vorab bei der Aufgabe hinterlegte falsche Antwort samt der Fehlvorstellung, die sie verrät (z. B. „Zähler und Nenner addiert“).
_Avoid_: Fehlertyp, Distraktor

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
Die Art des Denkens, die eine Aufgabe verlangt: I wiedergeben, II Zusammenhänge herstellen, III beurteilen und begründen. Er wird relativ zur Niveaustufe gelesen. Je Lernziel und Niveaustufe gibt es sechs Aufgaben in der Folge I, II, II, I, II, III.
_Avoid_: Schwierigkeit

**Etappe**:
Das Kapitel, an dem ein Schüler gerade arbeitet, mit der Zahl der gemeisterten Meilensteine und dem nächsten Meilenstein. Sie steht oben auf der Startseite. Gesperrte Meilensteine zählen nicht mit.
_Avoid_: Wochenmission, Wochenziel

**Hilfekärtchen**:
Eine von bis zu drei aufeinander aufbauenden Hilfen zu einer Aufgabe: Tipp, Beispiel, Lösungsschritt. F und G haben alle drei, M hat Tipp und Lösungsschritt, E nur den Tipp. Nach dem ersten falschen Versuch öffnet sich der Tipp von selbst. Der Tipp kostet keine Münzen, Beispiel und Lösungsschritt senken sie.
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

- **Live-Status**: Einschätzung, wie es einem Schüler in der laufenden Stunde geht: Hilferuf, blockiert, beobachten, im Flow, arbeitet, inaktiv, nicht da. Blockiert ist ein Schüler nach mehreren Fehlversuchen in Folge oder wenn er lange an einer Aufgabe sitzt, auch ohne Hilferuf.
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
- **Lernzielstand**: Wie weit ein Schüler bei einem Lernziel ist: nicht begonnen, begonnen, wackelig oder Siegel. Wackelig heißt begonnen, aber mit vielen Fehlversuchen oder Lösungsschritt-Kärtchen.

