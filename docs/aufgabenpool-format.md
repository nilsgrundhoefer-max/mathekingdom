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
| `fehlvorstellungen` | Katalog: Kürzel → Beschreibung für die Diagnose |
| `kapitel` | Jahresplan: Kapitel → Unterkapitel → Lernziele |
| `aufgaben` | Liste aller Aufgaben |

Kennungen: Kapitel `5.3`, Unterkapitel `5.3.3` (Extras `5.2.X1`), Lernziel `5.3.3-S2`, Aufgabe `5.3.3-S2-G-01`.

## Felder jeder Aufgabe

| Feld | Inhalt |
|---|---|
| `id` | Lernziel, Niveaustufe und laufende Nummer |
| `lernziel` | Kennung des Lernziels, das die Aufgabe nachweist |
| `niveau` | `F`, `G`, `M` oder `E` |
| `format` | Aufgabenformat, siehe unten |
| `text` | Aufgabentext |
| `hilfen` | die drei Hilfekärtchen `tipp`, `beispiel`, `loesungsschritt` |

## Aufgabenformate

**`zahl`**: Eine natürliche Zahl wird eingegeben. `loesung` ist die Zahl, `einheit` (optional) wird hinter dem Eingabefeld angezeigt und nicht getippt. `typischeFehler` ist eine Liste aus `wert` und `fehlvorstellung`.

**`auswahl`**: `optionen` mit `text`, `richtig` und optional `fehlvorstellung`. Bei `mehrfach: true` müssen genau alle richtigen Optionen angekreuzt werden.

**`luecken`**: Im `text` stehen Lücken als `{{name}}`. `luecken` ordnet jedem Namen `loesung` und `typischeFehler` zu. Alle Lücken müssen stimmen.

**`zuordnen`**: `paare` aus `links` und `rechts`. Das Dashboard mischt die rechte Seite.

**`sachaufgabe`**: Ein gemeinsamer `text` und mehrere `teile`. Jeder Teil ist wie eine `zahl`-Aufgabe aufgebaut. Alle Teile müssen stimmen.

Noch nicht im Pilot enthalten und später zu ergänzen: `zahlenstrahl`, `diagramm`, `tabelle`.

## Regeln, die die Prüfung erzwingt

- Jedes Lernziel mit Aufgaben hat auf jeder Niveaustufe mindestens 6 Aufgaben. Sonst könnte ein Schüler mit diesem Zielniveau das Lernziel nie erreichen.
- Jede Aufgabe hat alle drei Hilfekärtchen.
- Ein typischer Fehler ist nie gleich der Lösung, und seine Fehlvorstellung steht im Katalog.
- Reine Rechenaufgaben und die Rechnungen in Mehrfachauswahlen werden unabhängig nachgerechnet.
