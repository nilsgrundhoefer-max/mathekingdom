# Versionen

Gemeinsames Versionslog für das Schüler-Dashboard (`Mathekingdom.html`) und das Lehrer-Dashboard (`Mathekingdom-Lehrer.html`). Beide tragen dieselbe Nummer, weil das Lehrer-Dashboard die Klassendatei schreibt, die das Schüler-Dashboard liest.

Die erste Ziffer steigt nur, wenn alte Speicherstände oder Klassendateien nicht mehr passen. Sonst steigt die zweite.

Die oberste Version gilt. `npm run build` liest Nummer, Datum und Punkte von hier und zeigt sie in beiden Dashboards unten in der Ecke an. Aufbau eines Eintrags: Überschrift `## <Nummer> vom <TT.MM.JJJJ>`, darunter die Abschnitte `### Schüler` und `### Lehrkraft` mit je einer Liste.

## 0.22 vom 19.11.2026

### Schüler

- Für dich ändert sich nichts.

### Lehrkraft

- Lehrer-Dashboard aufgeräumt (ADR 0025): Der Bereich „Verwaltung“ heißt jetzt „Klasse“ und hat drei Abschnitte: Schüler (Namensliste, neue PIN, Zielniveau, Code-Kärtchen, Startdatei), Unterricht (Tore, Expedition, Einstiegscheck, Sicherheitsangabe, Rast und Ton, Spiele, Bestenliste, Hoftitel) und Berichte.
- Hast du mehrere Klassen, wechselst du oben in der Kopfzeile. Mit nur einer Klasse öffnet sie sich gleich nach dem Start.
- Backup und Betriebsprotokoll sind ins Administrator-Dashboard gezogen. Das Lehrer-Dashboard sichert weiter stündlich im Hintergrund. Warnungen siehst du nur noch, wenn du selbst etwas tun kannst, etwa ein zweites offenes Dashboard schließen.
- Je Klasse bleiben höchstens fünf Backups: der neueste und je der letzte der vier Tage davor, an denen gesichert wurde.
- Administrator-Dashboard in vier Bereichen: Übersicht (was jetzt Aufmerksamkeit braucht), Schule, Klassen und Lehrkräfte, Betrieb (Backups und Betriebsprotokoll aller Klassen). Neu sind dort: Klasse auflösen und ihre Daten löschen, Schüler endgültig löschen, neue PIN, Lehrkraft löschen (ihre Klassendateien werden dabei neu unterschrieben), Backups jeder Klasse sichern und einzeln oder ganz wiederherstellen.
- „Administratorrechte“ einer Lehrkraft heißen jetzt „Einblick in alle Klassen“.

## 0.21 vom 19.11.2026

### Schüler

- Mit der neuen Startdatei wählst du nur beim ersten Mal einen Ordner, und zwar den Ordner „Mathekingdom“ auf dem Schülertauschlaufwerk. Danach merkt sich der Browser ihn. Deine Klasse findet Mathekingdom aus deinem Code.

### Lehrkraft

- Neu: das Administrator-Dashboard (`Mathekingdom-Admin.html`). Damit beginnt die Einrichtung: Schuljahre, Klassen, Lehrkräfte mit Kürzel, Übernahme ins neue Schuljahr (5A-K4M2 wird 6A-K4M2), Startdateien und der Umzug alter Lehrerdaten.
- Das Lehrer-Dashboard startet mit deinem Kürzel. Beim ersten Mal wählst du die Ordner „Mathekingdom“ auf dem Schüler- und dem Lehrertauschlaufwerk, danach öffnest du jede Klasse ohne Auswahlfenster.
- Namensliste, PINs, Einstellungen, Notizen und Backups gehören jetzt zur Klasse und liegen auf dem Lehrertauschlaufwerk. Zwei Lehrkräfte können eine Klasse teilen; oben steht, wer sie gerade noch offen hat.
- Der hintere Teil eines Schülercodes ist jetzt schulweit einmalig.

## 0.20 vom 19.11.2026

### Schüler

- Die Ehrentafel im Schlossgarten ist wieder weg. Wenn du zu den fünf Besten der Klasse gehörst, siehst du deinen Hoftitel (Klassenkönig, Herzog, Graf, Ritter, Knappe) nur noch oben in deiner Kopfzeile. Die anderen sehen ihn nicht, auch nicht in den Bestenlisten.

### Lehrkraft

- Hoftitel (ADR 0023, geändert): keine Ehrentafel, keine Meldung, keine weibliche Form und kein Ausblenden mehr. Im Lernstand heißt die Karte jetzt „Hoftitel“, in der Verwaltung der Schalter „Hoftitel zeigen“. Die Wertung bleibt gleich.

## 0.19 vom 19.11.2026

### Schüler

- Im Schlossgarten hängt die Ehrentafel: die fünf Besten der Klasse in diesem Schuljahr, nach Kronen und Siegeln. Purpur zählt am meisten, dann Gold, Silber und Bronze. Auf die Tafel kommst du ab einer Silberkrone.
- Die fünf tragen einen Hoftitel mit Symbol: Klassenkönig (Krone), Herzog (Zepter), Graf (Schwert), Ritter (Helm), Knappe (Wimpel). Beim ersten Titel wählst du, ob du zum Beispiel König oder Königin heißt; ändern kannst du das jederzeit kostenlos. Dein Symbol steht oben neben deinem Rang und in den Bestenlisten neben deinem Beinamen.
- Der Titel gilt, solange du deinen Platz hältst. Wer nicht auf der Tafel steht, sieht keinen Platz. Du kannst dich ausblenden; dann rückt der Nächste nach.

### Lehrkraft

- Ehrentafel (ADR 0023): Im Lernstand siehst du die fünf Besten mit Namen, Hoftitel, Punkten und Kronen je Niveaustufe (je Meilenstein die beste Krone: F 1, G 2, M 4, E 6 Punkte, dazu 1 je Siegel), und wer sich ausgeblendet hat. Gezählt wird für alle gleich, unabhängig vom Zielniveau. Die Werte kommen aus den Speicherständen der Schüler und sind nicht fälschungssicher.
- In der Verwaltung unter „Spiele und Bestenliste“ schaltest du die Ehrentafel je Klasse aus. Standardmäßig ist sie an.

## 0.18 vom 19.11.2026

### Schüler

- Im Schlossgarten siehst du nur die Tore, die deine Lehrkraft schon geöffnet hat. Ein neues Tor wird dir beim nächsten Start einmal angekündigt und leuchtet kurz auf.

### Lehrkraft

- Torfreigabe (ADR 0022): In der Verwaltung unter „Tore“ hakst du an, welche Kapitel die Klasse sieht, in beliebiger Reihenfolge. Einzelnen Schülern kannst du zusätzlich Tore öffnen. Nicht freigegebene Tore fehlen bei den Schülern ganz. Ein Tor wieder zu schließen nimmt niemandem Siegel, Kronen oder Münzen.
- Wenn du ein Aktuelles Kapitel wählst, öffnet sich sein Tor für die Klasse mit. „Alle Kapitel offen“ ist jetzt der Knopf „Alle Tore öffnen“. Eine neue Klasse beginnt mit Tor 1; bestehende Klassen behalten die Tore, die bisher offen waren.

## 0.17 vom 19.11.2026

### Schüler

- Deine Lehrkraft kann dir einen Sonderauftrag schicken: einen Brief des Königs mit drei bis fünf Aufgaben. Er kommt nie mitten in einer Aufgabe, und du kannst ihn sofort öffnen oder später. Wenn du alle Aufgaben bearbeitet hast, bekommst du 100 Münzen dazu, egal wie viele richtig sind. Danach geht es dort weiter, wo du warst.

### Lehrkraft

- Sonderauftrag (ADR 0021): Im Bereich Jetzt im Schülerprofil schickst du einem Schüler drei bis fünf Aufgaben zu einem Lernziel. Vorgeschlagen werden seine schwächsten Lernziele und ihre Voraussetzungen. Das Niveau stellst du frei ein (vorbelegt eine Stufe unter dem Zielniveau), einzelne Aufgaben kannst du tauschen, und ein kurzer Satz kann dabei sein. Du siehst, ob der Auftrag geöffnet ist, wie weit der Schüler ist und welche typischen Fehler er gemacht hat, und bekommst einen Impuls, wenn er erledigt ist. Ein offener Auftrag lässt sich zurückziehen.
- Die Aufgaben zählen wie sonst für das Lernziel und das Wegstück, aber nicht für die Selbsteinschätzung und die Grundlagen-Schleife. Im Versuchsverlauf stehen sie als „Sonderauftrag“.

## 0.16 vom 19.11.2026

### Schüler

- Deinen Beinamen für die Bestenliste änderst du jetzt mit dem Knopf „Beiname ändern“. Die erste Änderung ist kostenlos, danach kostet jede Änderung 50 Münzen. Vorher fragt das Dashboard noch einmal nach.

### Lehrkraft

- Beiname ändern kostet nach der ersten Änderung 50 Münzen, damit Schüler nicht dauernd wechseln (ADR 0020). Jeder Schüler hat eine kostenlose Änderung, auch wer schon einen Beinamen gewählt hat. Du musst nichts einstellen.

## 0.15 vom 19.11.2026

### Schüler

- Drei neue Belohnungsspiele unter „Spiele“, je 100 Münzen, eine Runde höchstens 3 Minuten, jedes mit eigener Bestenliste:
- Steinmetz: Bausteine der Burg fallen von oben. Schieben mit ← und →, drehen mit ↑, schneller fallen mit ↓. Jede volle Reihe zählt.
- Grenzlauf: Lauf über die Landstraße, spring mit ↑ über Steine, Zäune und Gräben und duck dich mit ↓ unter den Raben. Gezählt werden Meilen.
- Kellerjagd: Sammle im Burgkeller alle Pergamentrollen und nimm dann die Treppe in den nächsten Keller. Weich den Ratten aus.

### Lehrkraft

- Drei weitere Belohnungsspiele (ADR 0019). Freigabe, Preis und Bestenliste funktionieren wie bei Botenritt und Burgmauer, du musst nichts einstellen.

## 0.14 vom 19.11.2026

### Schüler

- Der Wappenschrank ist viel größer: zwölf Farben, darunter Silber und Gold, und zwanzig Zeichen in den Gruppen Formen, Natur, Werkzeuge, Bauwerke und Tiere. Dein Wappen trägt ein großes Hauptzeichen und bis zu zwei kleine Beizeichen.
- Ehrenzeichen kannst du nicht kaufen, nur verdienen: Purpurrose (erste Purpurkrone), Kapitelband (ein ganzes Kapitel besiegelt), Wegstern (25 Wegstücke mit mindestens 4 von 5 richtig) und die Expeditionsfahne.
- Neue Ränge bis „Ritter der Karte“: Jetzt gibt es zwölf statt vier.
- Neu oben: „Spiele“. Die Rechenpause (Kopfrechen-Sprint) kostet 20 Münzen. Die Belohnungsspiele Botenritt und Burgmauer kosten 100 Münzen, eine Runde dauert höchstens 3 Minuten.
- Bestenliste der Klasse in den Belohnungsspielen, jede Woche neu. Du stehst dort mit deinem Wappen und einem Beinamen, den du dir aussuchst, und kannst dich ausblenden.
- Auf deinem Zielniveau bringt jede Aufgabe 20 Münzen, egal auf welchem Ziel du spielst. Darüber gibt es 25, darunter 10.

### Lehrkraft

- Münzen einlösen (ADR 0018): Oben in der Leiste stellst du die Spielfreigabe ein: aus, nur in der Spielpause oder verdient. Bei „verdient“ geht die Rechenpause immer und ein Belohnungsspiel nach jedem vierten Wegstück am Tag.
- Verwaltung, Karte „Spiele und Bestenliste“: Bestenliste pro Klasse abschaltbar. Die Schüler erscheinen dort nie mit Namen oder Code.
- Münzen hängen jetzt am Zielniveau des Schülers, damit ein teurer Wappenschrank niemanden auf F oder G abhängt. Bereits gekaufte Teile und Guthaben bleiben. Alte Wappen mit mehr als drei Zeichen behalten die drei teuersten.

## 0.13 vom 19.11.2026

### Schüler

- Neu beim Wappen: deine Aha-Momente. Dort stehen Fehler, die du einmal gemacht hast und jetzt nicht mehr machst. Ein Zeichen neben „Wappen“ zeigt, wenn ein neuer dazugekommen ist.

### Lehrkraft

- Kompetenzprofil (ADR 0017): Jede Aufgabe trägt eine prozessbezogene Kompetenz des Bildungsplans (Argumentieren, Probleme lösen, Modellieren, mit symbolischen Elementen umgehen, Kommunizieren). Lernstand und Schüler-Seite zeigen sie als Netzdiagramm mit Tabelle: Anteil der Aufgaben im ersten Versuch ohne Beispiel und Lösungsschritt richtig, ab 6 Aufgaben je Kompetenz.
- Lernziel-Seite: „Baut auf“ und „Darauf baut auf“, mit der Zahl der Siegel in der Klasse. Alle 85 Lernziele haben jetzt Voraussetzungen. Neu bieten auch Kopfrechnen geschickt, die Fachbegriff-Lernziele und das Vertauschungsgesetz eine Brücke an.
- Aha-Momente der Schüler: Jede Fehlvorstellung hat einen Satz in einfacher Sprache, den der Schüler sieht, sobald er den Fehler überwunden hat.
- Die Aufgabenübersicht zeigt je Aufgabe die Kompetenz, je Lernziel die Voraussetzungen und am Ende alle Kindersätze.

## 0.12 vom 19.11.2026

### Schüler

- Kommst du bei einem Lernziel zum ersten Mal ohne Beispiel und Lösungsschritt aus, sagt dir das Ergebnis Bescheid.
- Warst du unsicher und hattest trotzdem recht, liest du ab und zu: Du kannst mehr, als du denkst.
- Löst du ein Lernziel mehr als eine Woche nach dem Siegel im Rückblick oder Seitenblick richtig, steht am Meilenstein „gefestigt“ daneben.

### Lehrkraft

- Lernen sichtbar machen (ADR 0017): Neben dem Siegel gibt es den Lernzielstand „gefestigt“ (★), wenn das Lernziel mindestens 7 Tage nach dem Siegel im Rückblick oder Seitenblick richtig gelöst wurde.
- Lernstand: Die Heatmap lässt sich auf „nach Fehlvorstellungen“ umschalten. Jede Spalte ist ein typischer Fehler, jede Zelle aktiv oder überwunden (danach drei Aufgaben desselben Lernziels ohne ihn richtig).
- Lernstand: Filter über der Heatmap: „Braucht viel Hilfe“ (Beispiel oder Lösungsschritt in mindestens der Hälfte der letzten 10 Aufgaben eines Lernziels), „Überschätzt sich“ und „Unterschätzt sich“, jeweils mit Grund.
- Lernziel-Seite: Hilfebedarf je Schüler mit Trend von der ersten zur zweiten Hälfte der Aufgaben.
- Schüler-Seite: Versuchsverlauf der letzten 20 Aufgaben mit erstem und zweitem Versuch, typische Fehler mit „überwunden“, Hilfebedarf je Lernziel und ein Hinweis, wenn die Einschätzung nicht passt.

## 0.11 vom 19.11.2026

### Schüler

- Während einer Aufgabe ist die Kopfzeile schmal: Dein Wappen führt zurück, daneben siehst du dein Wegstück. Siegel, Kronen und Münzen siehst du wieder auf der Karte.
- Wegstücke: Die Aufgaben kommen in Päckchen zu fünf. „Aufgabe 3 von 5“ zeigt, wie weit du bist, am Ende siehst du, wie viele richtig waren.
- Seitenblick: Einmal im Wegstück kommt eine Aufgabe zu einem Lernziel, das du schon kannst. Dein Siegel behältst du in jedem Fall.
- Rast: Nach jedem vierten Wegstück am Tag schlägt Mathekingdom eine Minute Pause vor. Du kannst sie überspringen.
- Ohne Maus: Das Eingabefeld ist gleich bereit, Enter prüft, und nach dem Ergebnis bringt dich Enter zur nächsten Aufgabe.
- Der Tipp und die anderen Hilfekärtchen liegen jetzt direkt unter dem Eingabefeld.
- Das Ergebnis ist kürzer. Ist eine Aufgabe zweimal falsch, siehst du neben der Lösung auch das Beispiel und den Lösungsschritt.
- Siegel, Krone und Meilenstein bekommen einen kurzen eigenen Moment.

### Lehrkraft

- Konzentration über eine ganze Stunde (ADR 0016): Fokus-Modus, Wegstücke zu fünf Aufgaben mit einem Seitenblick, kürzere Rückmeldung, Arbeiten ohne Maus.
- Im Bereich Jetzt zeigt jede Kachel die Wegstücke von heute als Punktreihe (voll ab 4 von 5, halb ab 3 von 5).
- Neuer Live-Status „lässt nach“ mit Impuls: Die letzten zwei Wegstücke liegen deutlich unter dem Schnitt davor. Der Schüler bekommt dazu keine Meldung.
- Verwaltung, „Rast und Ton“: Rast nach jedem vierten Wegstück (standardmäßig an) und ein leiser Ton bei richtigen Aufgaben (standardmäßig aus).
- Seitenblicke stehen im Versuchsprotokoll, zählen aber für kein Siegel und keine Krone.

## 0.10 vom 18.11.2026

### Schüler

- Kapitel 4 „Multiplizieren und Dividieren“ ist vollständig: Stufen- und Zehnerzahlen, geschickt rechnen, schriftlich multiplizieren, Rechenvorteile, Potenzen, Punkt vor Strich, Verteilungsgesetz und der Abstecher Zahlenmuster.
- Malkreuz und Mal-Mauer: Du trägst die Teilprodukte direkt in die Felder des Malkreuzes und die Zahlen direkt in die Steine der Mauer ein.
- Neue Bilder: Kästchenquadrate und Würfel zu Potenzen, Päckchenbilder zu Punkt vor Strich, geteilte Punktefelder zum Verteilungsgesetz.

### Lehrkraft

- 456 neue Aufgaben zu 19 Lernzielen (K3, K4, M1 bis M5, R1, R2, P1, P2, T1 bis T3, V1 bis V3, Z1, Z2), je Lernziel sechs Aufgaben auf F, G, M und E. Der Pool hat jetzt 1056 Aufgaben.
- F rechnet höchstens 12 · 12. Auf G hat der zweite Faktor höchstens zwei Stellen, auf M wird dreistellig mal zweistellig gerechnet.
- Fachbegriffe wie Faktor, Produkt, Potenz und Verteilungsgesetz stehen ab G, ausmultiplizieren und ausklammern ab M.
- „Wer hat recht?“-Aufgaben auf M und E: Zwei Kinder rechnen unterschiedlich, die Antwort nennt die Begründung.
- Wie alle Aufgaben trägt jede neue Aufgabe ihren Rechenweg als Nachweis. Der Prüfer rechnet sie nach. Beispiele in den Hilfekärtchen verraten nie die Lösung der eigenen Aufgabe.

## 0.9 vom 18.11.2026

### Schüler

- Alle Aufgaben sind neu. Silber, Gold und Purpur unterscheiden sich jetzt deutlich: Auf Silber rechnest du mit einem festen Verfahren, auf Gold löst du Aufgaben mit mehreren Schritten, auf Purpur begründest du.
- Viele Aufgaben haben ein Bild: Plättchen, Zehnerstangen, Punktefelder, Streifen oder einen Zahlenstrahl.
- Bronze steht nicht mehr zur Wahl. Du spielst mindestens um Silber.
- Grundlage: Klappt ein Lernziel auf Silber noch nicht, übst du zuerst drei Aufgaben zur Grundlage. Dort liegt der Tipp schon offen. Danach geht es von selbst mit Silber weiter. Für die drei Aufgaben bekommst du die Bronze-Krone.
- Rechenraster und Ziffernrätsel: Du trägst jede Ziffer in ein eigenes Feld ein.

### Lehrkraft

- Niveaustufen mit fester Bedeutung: G Hauptschulabschluss, M Realschulabschluss, E Zugabe Richtung Gymnasium, F Basiskompetenzen mit größtmöglicher Unterstützung. Alle 600 Aufgaben der Klasse 5 sind danach neu erzeugt.
- F wird nicht mehr gewählt oder empfohlen. Schüler kommen nur über die Grundlagen-Schleife dorthin, je Lernziel, und nach drei richtigen Aufgaben zurück. Ein Kind, das fest auf F arbeiten soll, bekommt wie bisher das Zielniveau F.
- Neuer Impuls „Grundlage“: Übt ein Schüler bei einem Lernziel zum zweiten Mal die Grundlage, steht das unter „Impulse“, mit dem Baustein, der fehlt.
- Die Brücke gibt es nur noch auf M und E. Auf G übernimmt die Grundlagen-Schleife.
- Hilfekärtchen: F und G drei, M zwei, E eines. Auf F und G gibt es höchstens drei Auswahlantworten.
- Jede Aufgabe trägt ihren Rechenweg als Nachweis. Ein unabhängiger Prüfer rechnet Lösung, Hilfekärtchen und Bild nach, bevor der Pool gebaut wird.

## 0.8 vom 18.11.2026

### Schüler

- Neuer Meilenstein „Kopfrechnen“ in Kapitel 4: das kleine Einmaleins, einmal mit Mal-Aufgaben und einmal mit Geteilt-Aufgaben, auf allen vier Kronen.
- Einmaleins-Brücke: Wird das schriftliche Dividieren wackelig, schlägt das Dashboard zuerst drei Geteilt-Aufgaben aus dem Einmaleins vor. Danach geht es zurück zum Dividieren.

### Lehrkraft

- Kapitel 4 hat zwei neue Lernziele mit je 24 Aufgaben (F bis E, mit Hilfekärtchen, typischen Fehlern, Merkzettel und Wortspeicher). Sie erscheinen in Lernstand, Heatmap, Einstiegscheck und beim Öffnen und Sperren von Meilensteinen.
- Das Einmaleins ist jetzt die erste Voraussetzung für schriftliches Dividieren durch einstellige Zahlen und für Division mit Rest, das Mal-Einmaleins für das Dividieren durch zweistellige Zahlen.

## 0.7 vom 18.11.2026

### Schüler

- Einstiegscheck: Bevor du in einem Kapitel die erste Aufgabe bearbeitest, bietet dir die Regionskarte sechs bis acht Aufgaben aus allen Meilensteinen an, je ein Versuch, ohne Hilfekärtchen. Danach bekommst du einen Vorschlag, um welche Krone du spielen könntest. Es gibt dabei keine Münzen und keine Siegel, und meistens darfst du ihn überspringen.
- Brücke: Wird ein Lernziel wackelig, schlägt dir das Dashboard drei kurze Aufgaben zu einem Lernziel vor, das du dafür brauchst, eine Krone tiefer. Danach geht es zurück zu deinem Lernziel. Die Brücke ist freiwillig.

### Lehrkraft

- Einstiegscheck: unter Verwaltung je Kapitel als Pflicht einstellbar. Im Lernstand zeigt die neue Karte „Vorwissen aus dem Einstiegscheck“, wie viele ihn gemacht oder übersprungen haben, welche Kronen vorgeschlagen wurden und wie gut jeder Meilenstein schon sitzt.
- Brücken-Impuls: Ist ein Schüler in der laufenden Stunde bei einem Lernziel wackelig und eine Voraussetzung sitzt noch nicht, steht das unter „Impulse“, mit dem Hinweis, ob die Brücke schon gegangen wurde.
- Aufgaben aus dem Einstiegscheck zählen für kein Lernziel: Ein Lernziel wird dadurch nicht „begonnen“ oder „wackelig“.

## 0.6 vom 18.11.2026

### Schüler

- Heftcode: Unter jeder gelösten Aufgabe auf Gold oder Purpur steht ein kurzer Code wie „H7“. Schreib ihn mit deinem Ergebnis ins Heft.
- Heftcheck: Ungefähr nach jeder achten solchen Aufgabe fragt dich das Dashboard, was du bei einem Heftcode herausbekommen hast. Passt deine Antwort nicht, löst du die Aufgabe noch einmal. Münzen verlierst du dabei nicht.
- Wenn deine Lehrkraft es einschaltet: Beim ersten Versuch prüfst du mit „ich bin sicher“ oder „ich bin unsicher“. Warst du sicher und es stimmt nicht, bekommst du einen deutlichen Hinweis zum Hinschauen.

### Lehrkraft

- Sicherheitsangabe als Probe: unter Verwaltung pro Klasse einschalten. Im Lernstand zeigt die neue Karte „Heftcheck und Sicherheitsangabe“ eine Vierfeldertafel (sicher/unsicher × richtig/falsch), die häufigsten Fehler bei „sicher falsch“ und wer am häufigsten sicher falsch lag.
- Heftcheck: Quote der Klasse und Schüler unter 70 % in derselben Karte, auf der Schülerseite „Heftcheck x von y richtig“.
- Tafelbild: Aus dem Mini-Workshop-Impuls oder bei den schwierigsten Aufgaben eines Lernziels öffnet „Tafelbild“ eine Vollbild-Ansicht für den Beamer: Aufgabe, häufigste falsche Antworten der Klasse, Lösung auf Knopfdruck, ohne Namen und Codes. Schließen mit Esc.

## 0.5 vom 18.11.2026

### Schüler

- Rückblick: Ein paar Tage und Wochen nach einem Siegel erscheint auf der Startseite ein kurzer Rückblick mit gemischten Aufgaben zu Lernzielen, die du schon geschafft hast. Er ist freiwillig, kommt höchstens einmal am Tag und bringt die normalen Münzen. Deine Siegel behältst du in jedem Fall.
- Nebel auf der Regionskarte: Am Anfang liegt die Region im Nebel. Jeder gemeisterte Meilenstein lichtet ihn und zeigt dir ein Stück Landschaft.
- Expedition: Hat deine Lehrkraft eine Expedition gestartet, sammelt die ganze Klasse gemeinsam Expeditionszeichen, für jedes neue Siegel und jeden Rückblick. Du siehst den Stand der Klasse und deinen eigenen Beitrag. Ist das Ziel erreicht, bekommen alle die Belohnung, zum Beispiel die Expeditionsfahne fürs Wappen.

### Lehrkraft

- Neue Karte „Expedition“ in der Verwaltung: Ziel, Enddatum und Belohnung (Expeditionsfahne oder Spielpause) festlegen. Du siehst den Stand der Klasse und die Beiträge aller Schüler, die Schüler nur den Stand der Klasse und ihren eigenen.
- Neuer Lernzielstand „aufzufrischen“ (↻) in Heatmap, Balken und Lernziel-Seite: Der Schüler hat das Siegel, hat das Lernziel aber im Rückblick falsch gelöst. Das Siegel bleibt, das Lernziel kommt beim nächsten Rückblick wieder.
- Rückblick-Aufgaben stehen im Versuchsprotokoll und zählen nicht zur Selbsteinschätzung.
## 0.4 vom 18.11.2026

### Schüler

- Keine Änderungen.

### Lehrkraft

- Die Meldung „Klassendatei wurde von außen verändert“ kam im Schulnetz regelmäßig, obwohl niemand die Datei angefasst hatte: Das Dashboard hatte sich beim Schreiben selbst überholt. Jetzt laufen alle Schreibvorgänge nacheinander, und gewarnt wird nur noch, wenn die Unterschrift der Datei nicht passt oder sie fehlt.
- Sind zwei Lehrer-Dashboards für dieselbe Klasse offen, etwa in zwei Tabs oder an zwei PCs, erscheint einmal ein Hinweis, weil sie sich sonst gegenseitig überschreiben.

## 0.3 vom 18.11.2026

### Schüler

- Im Hintergrund wird jetzt festgehalten, ob das Dashboard richtig geladen wurde und ob das Speichern klappt. Für dich ändert sich nichts.

### Lehrkraft

- Neues Protokoll unter Verwaltung: Jeder Start eines Dashboards steht dort mit Quelle (online von GitHub, Kopie oder Datei ohne Netz), Version und Browser, dazu jedes technische Problem, etwa GitHub nicht erreichbar, Speichern fehlgeschlagen, Klassendatei verändert oder Backup fehlgeschlagen.
- „Nur Probleme“ blendet die normalen Starts aus. „Protokoll als Textdatei speichern“ gibt alles zum Weitergeben aus, zum Beispiel an die Schul-IT; Schüler stehen darin nur mit Code.
- Ist GitHub nicht erreichbar, nennt die Lehrer-Startdatei jetzt den Grund, zum Beispiel „GitHub antwortet 404“.
- Damit auch die Schüler-Startdatei den Grund nennt, lade sie unter Verwaltung neu herunter und lege sie auf die Schülerlaufwerke. Die alte Startdatei funktioniert weiter.

## 0.2 vom 18.11.2026

### Schüler

- Die Regionskarte hat nur noch einen Weg. Statt die Straße zu wechseln, wählst du am Meilenstein, um welche Krone du spielst: Bronze, Silber, Gold oder Purpur.
- Jeder Meilenstein bekommt eine Krone in der Farbe, auf der du alle seine Lernziele geschafft hast. Du kannst sie später aufwerten.
- Gemeistert ist ein Meilenstein erst mit der Krone deines Ziels.
- Oben stehen jetzt neben Siegeln und Münzen deine Kronen, gezählt nach Farbe.
- Beim ersten Mal siehst du, um welche Krone du gespielt hast und welche du geschafft hast.
- Das Wappen-Zeichen Krone heißt jetzt Lilie.

### Lehrkraft

- Neue Auswertung „Selbsteinschätzung“ im Lernstand: Wer schätzt sich zu niedrig, passend oder zu hoch ein?
- Neuer Impuls: Wer sich dreimal in Folge unterschätzt, dem kann man das Zielniveau anheben.
- Auf der Seite eines Schülers stehen seine Meilensteine mit erreichtem Niveau, Ziel und erster Wahl. Unter dem Ziel heißt es zum Beispiel „F erreicht, Ziel M“.
- Senkst du ein Zielniveau, bekommt der Schüler beim nächsten Öffnen die Siegel, die er damit schon verdient hat. Siegel werden nie weggenommen.
- „Niveau“ statt „Straße“ in allen Auswertungen.

## 0.1 vom 17.11.2026

### Schüler

- Mittelalterliche Landkarte: Schlossgarten mit einem Gartentor je Kapitel, Regionskarte mit vier Straßen (Feldweg, Talweg, Königsweg, Bergpfad) und Meilensteinen.
- Siegel für erreichte Lernziele, Ränge vom Wanderer bis zum Hofkartografen, eigenes Wappen.
- Fehlversuche und Tipps kosten keine Münzen. Der Tipp öffnet sich nach dem ersten Fehlversuch.
- Merkzettel und Wortspeicher an jedem Meilenstein.
- Aufgaben für Kapitel 3 (Addieren und Subtrahieren) und Dividieren (4.5).
- Die Versionsnummer steht unten rechts.

### Lehrkraft

- Lehrer-Dashboard in vier Bereichen: Jetzt, Lernstand, Aufgaben, Verwaltung.
- Schülercode mit vierstelliger PIN, signierte Klassendatei, stündliches Backup aufs Lehrerlaufwerk.
- Berichte als PDF und Rohdaten als Excel-Datei.
- Das Lehrer-Dashboard lädt sich wie das Schüler-Dashboard bei jedem Öffnen neu von GitHub und legt eine Kopie aufs Lehrerlaufwerk für Tage ohne Internet.
- Neue Dateinamen: `Mathekingdom.html` für Schüler, `Mathekingdom-Lehrer.html` für die Lehrkraft.
- Die Versionsnummer steht unten rechts. Ein Klick zeigt, was neu ist.
