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
| `fehlvorstellungen` | Katalog: Kürzel → `beschreibung` (für die Diagnose) und `hinweis` (Rückmeldung an den Schüler nach dem ersten falschen Versuch) |
| `kapitel` | Jahresplan: Kapitel → Unterkapitel → Lernziele. Ein Unterkapitel mit Aufgaben trägt einen `merkzettel` mit `regeln` (Liste), `beispiel` und `heft`. Die Texte stehen in `tools/jahresplan-klasse-5.mjs`. |
| `aufgaben` | Liste aller Aufgaben |

Kennungen: Kapitel `5.3`, Unterkapitel `5.3.3` (Extras `5.2.X1`), Lernziel `5.3.3-S2`, Aufgabe `5.3.3-S2-G-01`.

## Felder jeder Aufgabe

| Feld | Inhalt |
|---|---|
| `id` | Lernziel, Niveaustufe und laufende Nummer |
| `lernziel` | Kennung des Lernziels, das die Aufgabe nachweist |
| `niveau` | `F`, `G`, `M` oder `E` |
| `afb` | Anforderungsbereich `1`, `2` oder `3`. Der Erzeuger setzt ihn nach einer Faustregel je Lernziel und Niveaustufe (Kopfrechnen und schriftliches Rechnen I; Klammern berechnen I, auf E II; geschickt und vorteilhaft rechnen, Gesetze erkennen wie Fachbegriffe; Rechenausdruck aufstellen wie Sachaufgaben; Fachbegriffe, Überschlag, Probe, Rest deuten auf F und G I, auf M und E II; Sachaufgaben II, auf E III). Eine Aufgabe kann davon abweichen. |
| `format` | Aufgabenformat, siehe unten |
| `text` | Aufgabentext |
| `hilfen` | die drei Hilfekärtchen `tipp`, `beispiel`, `loesungsschritt` |

## Aufgabenformate

**`zahl`**: Eine natürliche Zahl wird eingegeben. `loesung` ist die Zahl, `einheit` (optional) wird hinter dem Eingabefeld angezeigt und nicht getippt. `typischeFehler` ist eine Liste aus `wert` und `fehlvorstellung`.

**`auswahl`**: `optionen` mit `text`, `richtig` und optional `fehlvorstellung`. Bei `mehrfach: true` müssen genau alle richtigen Optionen angekreuzt werden.

**`luecken`**: Im `text` stehen Lücken als `{{name}}`. `luecken` ordnet jedem Namen `loesung` und `typischeFehler` zu. Alle Lücken müssen stimmen.

**`zuordnen`**: `paare` aus `links` und `rechts`. Das Dashboard mischt die rechte Seite.

**`sachaufgabe`**: Ein gemeinsamer `text` und mehrere `teile`. Jeder Teil ist wie eine `zahl`-Aufgabe aufgebaut. Alle Teile müssen stimmen.

**`zahlenstrahl`**: `strahl` beschreibt den Strahl mit `von`, `bis`, `schritt` (Abstand der Teilstriche) und `beschriftung` (Abstand der beschrifteten Striche). Optional markiert `start` einen Punkt, `spruenge` (Liste aus `von`, `nach`, `text`) zeichnet Bögen und `pfeil` zeigt mit einem Fragezeichen auf eine Stelle. Bei `eingabe: "markieren"` tippt der Schüler auf einen Teilstrich, bei `eingabe: "ablesen"` gibt er die Zahl ein. `loesung` und `typischeFehler` wie bei `zahl`. Die Lösung muss auf einem Teilstrich liegen.

**`diagramm`**: `diagramm` beschreibt ein Säulendiagramm mit `titel`, `einheit`, `max`, `schritt` (Beschriftung der Achse), `hilfslinien` (Abstand feinerer Linien, optional), `werteZeigen` (Werte über den Säulen, sonst muss abgelesen werden) und `saeulen` aus `name` und `wert`. Dazu `teile` wie bei der `sachaufgabe`. Jeder Wert muss auf einer Linie liegen, damit er sich ablesen lässt.

**`tabelle`**: `tabelle` hat einen `kopf` und `zeilen`. Eine Zelle ist ein Text oder eine Lücke `{ "luecke": "name" }`. `luecken` ordnet jedem Namen `loesung` und `typischeFehler` zu, wie beim Format `luecken`. Alle Lücken müssen stimmen.

## Regeln, die die Prüfung erzwingt

- Jedes Lernziel mit Aufgaben hat auf jeder Niveaustufe mindestens 6 Aufgaben. Sonst könnte ein Schüler mit diesem Zielniveau das Lernziel nie erreichen.
- Jede Aufgabe hat alle drei Hilfekärtchen.
- Ein typischer Fehler ist nie gleich der Lösung, und seine Fehlvorstellung steht im Katalog.
- Reine Rechenaufgaben und die Rechnungen in Mehrfachauswahlen werden unabhängig nachgerechnet.
