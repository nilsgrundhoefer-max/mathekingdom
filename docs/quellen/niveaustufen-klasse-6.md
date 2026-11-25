---
titel: Niveaustufen und Beispielaufgaben Mathematik Klasse 6
version: 1
stand: 2026-11-24
schulart: Realschule Baden-Württemberg, Sekundarstufe I
klassenstufe: 6
grundlage: Bildungsplan 2016 BW Mathematik Sek I (Fassung 29.02.2024), Standards Klassen 5/6
gliederung: Klett Schnittpunkt Mathematik 6 (Ausgabe BW), Kapitel 1 bis 10
niveaus:
  - id: G
    symbol: "●○○"
    name: Basis
  - id: M
    symbol: "●●○"
    name: Standard
  - id: E
    symbol: "●●●"
    name: Experte
formelsatz: LaTeX inline zwischen $…$ (KaTeX-kompatibel), Dezimalkomma, Malpunkt \cdot
sprache: de
personenbezogene_daten: keine (alle Namen in Aufgaben sind erfundene Maskottchen-Figuren)
---

# Niveaustufen und Beispielaufgaben Mathematik Klasse 6

Diese Datei beschreibt für jedes Thema der Klasse 6, was eine Aufgabe auf den drei Niveaustufen ●○○ / ●●○ / ●●● leisten soll, und gibt je Stufe geprüfte Beispielaufgaben mit Lösung. Sie ist für die Übergabe an ein Lernplattformprojekt gedacht und deshalb einheitlich aufgebaut (Abschnitt 1 beschreibt das Schema).

## 0 Lesehilfe für die Plattform

### 0.1 Aufbau je Thema

Jedes Thema `T00` bis `T10` hat dieselben Unterabschnitte:

| Abschnitt | Inhalt |
|---|---|
| Kopf | `id`, Lehrwerkskapitel, Leitidee, Teilkompetenzen des Bildungsplans (Nummer und Seite) |
| Niveaubeschreibung | je Stufe: Bildungsplan-Formulierung, typische Tätigkeit, Grad der Vorstrukturierung, Schwerpunkt Anforderungsbereich (AFB) |
| Beispielaufgaben | je Stufe 2 bis 4 Aufgaben mit festen Feldern (siehe 0.2) |
| Stolpersteine | typische Fehler im Thema, als Hinweis für Rückmeldungen der Plattform |

### 0.2 Felder einer Beispielaufgabe

Jede Aufgabe hat eine Überschrift `#### <Thema>-<Niveau>-<Nr>` (z. B. `T02-M-03`) und darunter immer diese Felder in dieser Reihenfolge:

- `niveau`: ●○○ / ●●○ / ●●●
- `afb`: Anforderungsbereich I, II oder III nach Bildungsplan Kap. 4
- `bp`: Teilkompetenz(en) des Bildungsplans, z. B. `ZVO (18)` = Leitidee Zahl – Variable – Operation, Standard 18
- `operator`: Operator bzw. Arbeitsanweisung am Satzanfang
- `aufgabe`: Aufgabentext für Schülerinnen und Schüler
- `loesung`: erwartete Lösung (bei offenen Aufgaben: Beispiellösung und Kriterium)
- `darstellung` (optional): benötigte Abbildung, falls die Aufgabe eine braucht

Abkürzungen der Leitideen: `ZVO` Zahl – Variable – Operation · `MES` Messen · `RF` Raum und Form · `FZ` Funktionaler Zusammenhang · `DZ` Daten und Zufall.

## 1 Was die drei Stufen bedeuten

### 1.1 Bezug zum Bildungsplan

Der Bildungsplan 2016 beschreibt drei Niveaus: **G** (grundlegend, Hauptschulabschluss), **M** (mittel, Realschulabschluss) und **E** (erweitert). Für viele Teilkompetenzen gibt er je Niveau einen eigenen Wortlaut (Bildungsplan S. 8, 63–64). In dieser Datei gilt folgende Zuordnung:

| Symbol | Name | Bildungsplan-Niveau | AFB-Schwerpunkt | Vorstrukturierung |
|---|---|---|---|---|
| ●○○ | Basis | G-Formulierung | I | hoch: Bild, Lückentext, vorgegebener erster Schritt, kleine Zahlen, ein Rechenschritt |
| ●●○ | Standard | M-Formulierung | I und II | mittel: Verfahren bekannt, zwei bis drei Schritte, Sachkontext, Darstellungswechsel |
| ●●● | Experte | E-Formulierung oder M-Inhalt auf AFB III | II und III | gering: offene Aufgaben, Umkehraufgaben, Begründen, Verallgemeinern, Fehler erklären |

Wichtig für die Klasse 6 an dieser Schule: Der Unterricht findet auf den Niveaus G und M statt, Klassenarbeiten werden auf M-Niveau gestellt. ●●○ ist damit das Zielniveau, das alle erreichen sollen. ●○○ sichert den Einstieg, ●●● ist das Angebot für schnelle und leistungsstarke Lernende. Die Zuordnung „Punkte ↔ G/M/E“ ist eine Arbeitsentscheidung der Lehrkraft für ihre Materialien, keine Vorgabe des Bildungsplans.

### 1.2 Regeln für das Stufen von Aufgaben

1. **Stufen über die Tätigkeit, nicht nur über die Zahlengröße.** Eine ●●●-Aufgabe ist nicht dieselbe Rechnung mit größeren Zahlen, sondern verlangt eine andere Tätigkeit (umkehren, vergleichen, begründen, verallgemeinern, Fehler finden).
2. **Gleiches Thema, gleicher Kontext.** Alle drei Stufen einer Aufgabe arbeiten am selben Inhalt, damit sich die Lernenden später über ihre Wege austauschen können.
3. **Selbstwahl.** In den Arbeitsblättern wählen die Kinder ihre Stufe selbst. Für eine Plattform bietet sich an, die Wahl offen zu lassen und eine Empfehlung anzuzeigen, statt die Stufe fest zuzuweisen (Vorschlag, nicht belegt; siehe Abschnitt 3).
4. **Darstellung auf Schülerseite nur als Punkte.** Auf Schülermaterial stehen nur ●○○ / ●●○ / ●●●, keine Buchstaben G/M/E und keine Legende.
5. **Verteilung auf einem Arbeitsblatt:** etwa AFB I 35 %, AFB II 50 %, AFB III 15 % über alle Teilaufgaben (Vorgabe der Lehrkraft für Arbeitsblätter, keine Vorgabe des Bildungsplans).
6. **Operatoren nach Bildungsplan Kap. 4** (S. 56–58): AFB I angeben, berechnen, darstellen, erkennen, identifizieren · AFB II anwenden, auswerten, beschreiben, bestimmen, deuten, entnehmen, erklären, erläutern, nutzen, skizzieren, untersuchen, vergleichen, zuordnen · AFB III begründen, beurteilen, bewerten, beweisen, überprüfen. Die AFB-Zuordnung hängt im Einzelfall vom Kontext ab. Fachverben wie rechnen, kürzen, zeichnen sind keine Operatoren.
7. **Sprache:** kurze Sätze, ein Auftrag pro Satz, Fachwörter des Bildungsplans verwenden und bei ●○○ im Wortspeicher erklären.

### 1.3 Gestufte Zusatzaufgabe (★)

Am Ende jedes Arbeitsblatts steht eine ★-Aufgabe, die in sich gestuft ist. Diese Formate eignen sich auch für die Plattform (Formate nach Leuders, *Intelligent üben*, S. 139–141, siehe Quellen):

| Format | ●○○ | ●●○ | ●●● |
|---|---|---|---|
| Stimmt das? | richtige Begründung ankreuzen (3 Optionen) | selbst überprüfen und begründen | verallgemeinern: Warum gilt das immer? |
| Finde den Fehler | falsche Zeile markieren | richtig rechnen | erklären, wie man den Fehler vermeidet |
| Finde passende … | aus einer Auswahl wählen | selbst ein Beispiel finden | möglichst viele finden, begründen |
| Was passiert, wenn …? | an einem Beispiel ausprobieren | mehrere Beispiele vergleichen | allgemein begründen |
| Was passt nicht? | Außenseiter ankreuzen | begründen | eigene Reihe mit Außenseiter erfinden |
| Erfinde eine Aufgabe | Vorlage mit Lücken ausfüllen | Aufgabe zu vorgegebenem Ergebnis erfinden | Aufgabe und Lösung für den Partner erfinden |

## 2 Themen

---

## T00 Teilbarkeit (Grundlage für das Bruchrechnen)

- `id`: T00
- `kapitel`: kein eigenes Kapitel in Schnittpunkt 6; Vorwissen aus Klasse 5, wird für Kürzen und Hauptnenner gebraucht
- `leitidee`: ZVO
- `bp`: ZVO (3), S. 17

### Niveaubeschreibung

- **●○○ Basis:** einfache Primzahlen erkennen, Teilbarkeitsregeln für 2, 3, 5, 10 anwenden. Teiler mit Einmaleins-Hilfe finden.
- **●●○ Standard:** zusätzlich Teilbarkeitsregel für 9 und Primfaktorzerlegung. Gemeinsame Vielfache (kgV) für den Hauptnenner bestimmen.
- **●●● Experte:** zusätzlich Teilbarkeitsregel für 6. Teilbarkeitsregeln begründen und kombinieren.

### Beispielaufgaben

#### T00-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (3)
- `operator`: Prüfe
- `aufgabe`: Prüfe, ob $135$ durch $2$, $3$, $5$ und $10$ teilbar ist. Kreuze an.
- `loesung`: durch $2$: nein (letzte Ziffer ungerade) · durch $3$: ja (Quersumme $9$) · durch $5$: ja (letzte Ziffer $5$) · durch $10$: nein

#### T00-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (3)
- `operator`: Gib an
- `aufgabe`: Gib alle Teiler von $18$ an.
- `loesung`: $1, 2, 3, 6, 9, 18$

#### T00-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (3)
- `operator`: Zerlege
- `aufgabe`: Zerlege $84$ in Primfaktoren.
- `loesung`: $84 = 2 \cdot 2 \cdot 3 \cdot 7$

#### T00-M-02
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (3), ZVO (16)
- `operator`: Bestimme
- `aufgabe`: Bestimme das kleinste gemeinsame Vielfache von $6$ und $8$.
- `loesung`: Vielfache von $8$: $8, 16, 24$; $24$ ist durch $6$ teilbar. kgV $= 24$

#### T00-E-01
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (3)
- `operator`: Begründe
- `aufgabe`: Begründe, warum eine Zahl, die durch $2$ und durch $3$ teilbar ist, auch durch $6$ teilbar ist.
- `loesung`: Die Zahl enthält die Primfaktoren $2$ und $3$, also auch das Produkt $2 \cdot 3 = 6$. Kriterium: Bezug auf Primfaktoren oder auf $6 = 2 \cdot 3$.

#### T00-E-02
- `niveau`: ●●●
- `afb`: II
- `bp`: ZVO (3)
- `operator`: Finde
- `aufgabe`: Finde die kleinste vierstellige Zahl, die durch $2$, $3$, $5$ und $9$ teilbar ist.
- `loesung`: Sie muss durch $90$ teilbar sein. $90 \cdot 12 = 1080$ (denn $90 \cdot 11 = 990$ ist dreistellig). Lösung: $1080$

### Stolpersteine
- Quersummenregel wird auf $2$, $5$ oder $10$ übertragen.
- „Teiler“ und „Vielfache“ werden verwechselt.
- $1$ wird als Primzahl gezählt.

---

## T01 Brüche

- `id`: T01
- `kapitel`: Schnittpunkt 6, Kap. 1 (Brüche, Erweitern, Kürzen, Vergleichen und Ordnen, Brüche und Größen, Zahlenstrahl)
- `leitidee`: ZVO
- `bp`: ZVO (5), (6), (7), (9), (16), S. 18–19

### Niveaubeschreibung

- **●○○ Basis:** Brüche als Anteil, Teile eines oder mehrerer Ganzer und Maßzahl einer Größe verwenden (BP G, ohne Operator-Aspekt). Anteile an Figuren und Bruchstreifen ablesen und färben. Mit vorgegebener Zahl erweitern und kürzen. Brüche mit gleichem Nenner vergleichen.
- **●●○ Standard:** zusätzlich Bruch als Operator („$\frac{3}{4}$ von $200\ \mathrm{g}$“). Vollständig kürzen, ungleichnamige Brüche vergleichen und ordnen, Brüche am Zahlenstrahl zuordnen. Erläutern, dass zwischen zwei Brüchen weitere liegen (BP (9) ab M).
- **●●● Experte:** zusätzlich Aspekt Verhältnis (BP E). Begründen, warum Erweitern den Wert nicht ändert, Aussagen über Brüche prüfen, beliebig viele Brüche zwischen zwei Brüchen finden.

### Beispielaufgaben

#### T01-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (5), (6)
- `operator`: Gib an
- `aufgabe`: Eine Pizza ist in $8$ gleich große Stücke geteilt. $3$ Stücke sind gegessen. Gib den Anteil der gegessenen Pizza als Bruch an.
- `loesung`: $\frac{3}{8}$
- `darstellung`: Kreis in 8 gleiche Teile, 3 Teile gefärbt

#### T01-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (16)
- `operator`: Erweitere, Kürze
- `aufgabe`: a) Erweitere $\frac{2}{3}$ mit $4$. b) Kürze $\frac{6}{9}$ mit $3$.
- `loesung`: a) $\frac{2 \cdot 4}{3 \cdot 4} = \frac{8}{12}$ b) $\frac{6 : 3}{9 : 3} = \frac{2}{3}$

#### T01-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (7)
- `operator`: Trage ein
- `aufgabe`: Der Zahlenstrahl geht von $0$ bis $1$ und ist in $4$ gleiche Teile geteilt. Trage $\frac{1}{4}$ und $\frac{3}{4}$ ein.
- `loesung`: $\frac{1}{4}$ am ersten Teilstrich, $\frac{3}{4}$ am dritten Teilstrich
- `darstellung`: Zahlenstrahl 0 bis 1 mit 3 Teilstrichen

#### T01-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (5)
- `operator`: Berechne
- `aufgabe`: Für einen Kuchen braucht man $200\ \mathrm{g}$ Mehl. Leon nimmt nur $\frac{3}{4}$ davon. Berechne, wie viel Mehl er nimmt.
- `loesung`: $200\ \mathrm{g} : 4 = 50\ \mathrm{g}$; $50\ \mathrm{g} \cdot 3 = 150\ \mathrm{g}$

#### T01-M-02
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (7), (16)
- `operator`: Ordne
- `aufgabe`: Ordne der Größe nach. Beginne mit dem kleinsten Bruch: $\frac{2}{3}$; $\frac{3}{5}$; $\frac{7}{10}$
- `loesung`: Hauptnenner $30$: $\frac{20}{30}$; $\frac{18}{30}$; $\frac{21}{30}$. Also $\frac{3}{5} < \frac{2}{3} < \frac{7}{10}$

#### T01-M-03
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (16)
- `operator`: Kürze
- `aufgabe`: Kürze $\frac{18}{24}$ so weit wie möglich.
- `loesung`: $\frac{18}{24} = \frac{3}{4}$ (gekürzt mit $6$)

#### T01-E-01
- `niveau`: ●●●
- `afb`: II
- `bp`: ZVO (9)
- `operator`: Gib an, Erläutere
- `aufgabe`: Gib drei Brüche an, die zwischen $\frac{1}{3}$ und $\frac{1}{2}$ liegen. Erläutere dein Vorgehen.
- `loesung`: z. B. $\frac{1}{3} = \frac{8}{24}$, $\frac{1}{2} = \frac{12}{24}$, dazwischen $\frac{9}{24}$, $\frac{10}{24}$, $\frac{11}{24}$. Kriterium: beide Brüche auf einen gemeinsamen, ausreichend großen Nenner erweitern.

#### T01-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (7), (16)
- `operator`: Überprüfe, Begründe
- `aufgabe`: Stimmt das? „Wenn man bei einem Bruch Zähler und Nenner um $1$ vergrößert, wird der Bruch größer.“ Überprüfe an Beispielen und begründe.
- `loesung`: Für Brüche kleiner als $1$ stimmt es: $\frac{1}{2} < \frac{2}{3}$, $\frac{3}{4} < \frac{4}{5}$, denn der fehlende Teil bis zum Ganzen wird kleiner ($\frac{1}{2}$ fehlt, dann $\frac{1}{3}$). Für Brüche größer als $1$ stimmt es nicht: $\frac{3}{2} = 1{,}5$, aber $\frac{4}{3} \approx 1{,}33$. Kriterium: Gegenbeispiel oder Einschränkung erkannt.

#### T01-E-03
- `niveau`: ●●●
- `afb`: II
- `bp`: ZVO (5) (Aspekt Verhältnis, nur E)
- `operator`: Bestimme
- `aufgabe`: In einer Gruppe kommen auf $2$ Jungen $3$ Mädchen. Bestimme, welcher Anteil der Gruppe Mädchen sind.
- `loesung`: $2 + 3 = 5$ Teile, davon $3$ Mädchen: $\frac{3}{5}$ (nicht $\frac{3}{2}$)

### Stolpersteine
- Beim Erweitern wird nur der Nenner verändert.
- „Größerer Nenner = größerer Bruch“ ($\frac{1}{8} > \frac{1}{4}$).
- Verhältnis $2 : 3$ wird als Anteil $\frac{2}{3}$ gelesen.

---

## T02 Rechnen mit Brüchen

- `id`: T02
- `kapitel`: Schnittpunkt 6, Kap. 2 (Addieren und Subtrahieren, Vervielfachen, Teilen, Multiplizieren, Dividieren [M], Punkt vor Strich und Klammern)
- `leitidee`: ZVO
- `bp`: ZVO (17), (18), (26), S. 19–20

### Niveaubeschreibung

- **●○○ Basis:** einfache positive Brüche addieren, subtrahieren und multiplizieren (BP G). Gleichnamige Brüche, Hauptnenner mit Vorgabe („$\frac{1}{2} = \frac{□}{4}$“). Brüche mit natürlichen Zahlen multiplizieren und durch natürliche Zahlen dividieren (BP (17), alle Niveaus). Terme mit höchstens einer Klammerebene.
- **●●○ Standard:** zusätzlich Division durch einen Bruch (BP M). Hauptnenner selbst finden, Ergebnisse kürzen, gemischte Zahlen. Terme mit Punkt vor Strich und Klammern in einfachen Fällen. Sachaufgaben mit Brüchen.
- **●●● Experte:** auch rationale Zahlen (BP E). Unbekannte Hauptnenner, drei Brüche, Fehler in Rechnungen finden und erklären, Umkehraufgaben, Rechenregeln an Vorstellungen begründen.

### Beispielaufgaben

#### T02-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (18)
- `operator`: Berechne
- `aufgabe`: Berechne. Kürze, wenn es geht. a) $\frac{2}{7} + \frac{3}{7}$ b) $\frac{5}{9} - \frac{2}{9}$
- `loesung`: a) $\frac{5}{7}$ b) $\frac{3}{9} = \frac{1}{3}$

#### T02-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (18)
- `operator`: Ergänze, Berechne
- `aufgabe`: Ergänze und berechne: $\frac{1}{2} + \frac{1}{4} = \frac{□}{4} + \frac{1}{4} = $ ____
- `loesung`: $\frac{2}{4} + \frac{1}{4} = \frac{3}{4}$
- `darstellung`: optional Bruchstreifen in Vierteln

#### T02-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (17)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $3 \cdot \frac{2}{5}$ b) $\frac{4}{5} : 2$
- `loesung`: a) $\frac{6}{5} = 1\frac{1}{5}$ b) $\frac{2}{5}$

#### T02-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (18)
- `operator`: Berechne
- `aufgabe`: Berechne. Kürze das Ergebnis. a) $\frac{1}{3} + \frac{1}{4}$ b) $\frac{5}{6} - \frac{1}{4}$
- `loesung`: a) $\frac{4}{12} + \frac{3}{12} = \frac{7}{12}$ b) $\frac{10}{12} - \frac{3}{12} = \frac{7}{12}$

#### T02-M-02
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (18)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $\frac{2}{3} \cdot \frac{9}{10}$ b) $\frac{3}{4} : \frac{3}{8}$
- `loesung`: a) $\frac{18}{30} = \frac{3}{5}$ b) $\frac{3}{4} \cdot \frac{8}{3} = \frac{24}{12} = 2$

#### T02-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (18)
- `operator`: Berechne
- `aufgabe`: Tobi hat eine Flasche mit $1\ \mathrm{l}$ Saft. Er trinkt morgens $\frac{1}{4}\ \mathrm{l}$ und mittags $\frac{1}{2}\ \mathrm{l}$. Berechne, wie viel Saft übrig bleibt.
- `loesung`: $\frac{1}{4} + \frac{2}{4} = \frac{3}{4}$; $1 - \frac{3}{4} = \frac{1}{4}$. Es bleibt $\frac{1}{4}\ \mathrm{l}$ übrig.

#### T02-M-04
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (26)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $\frac{1}{2} + \frac{1}{3} \cdot \frac{3}{4}$ b) $\left(\frac{1}{2} + \frac{1}{3}\right) \cdot \frac{3}{4}$
- `loesung`: a) $\frac{1}{2} + \frac{1}{4} = \frac{3}{4}$ b) $\frac{5}{6} \cdot \frac{3}{4} = \frac{15}{24} = \frac{5}{8}$

#### T02-E-01
- `niveau`: ●●●
- `afb`: II
- `bp`: ZVO (18)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $\frac{5}{6} - \frac{3}{8}$ b) $\frac{1}{2} + \frac{1}{3} + \frac{1}{4}$
- `loesung`: a) $\frac{20}{24} - \frac{9}{24} = \frac{11}{24}$ b) $\frac{6}{12} + \frac{4}{12} + \frac{3}{12} = \frac{13}{12} = 1\frac{1}{12}$

#### T02-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (18); prozessbezogen 2.1 Argumentieren
- `operator`: Finde den Fehler, Erkläre
- `aufgabe`: Frida rechnet: $\frac{2}{3} : \frac{1}{2} = \frac{1}{3}$. Finde den Fehler. Erkläre, wie man ohne Rechnen merkt, dass das Ergebnis nicht stimmen kann.
- `loesung`: Frida hat multipliziert statt durch $\frac{1}{2}$ zu teilen. Richtig: $\frac{2}{3} \cdot \frac{2}{1} = \frac{4}{3}$. Überlegung: „Wie oft passt $\frac{1}{2}$ in $\frac{2}{3}$?“ Mehr als einmal, denn $\frac{2}{3} > \frac{1}{2}$. Das Ergebnis muss größer als $1$ sein.

#### T02-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (18)
- `operator`: Finde, Beschreibe
- `aufgabe`: Finde zwei Brüche mit verschiedenen Nennern, deren Summe $\frac{3}{4}$ ist. Beschreibe, wie du immer neue passende Brüche findest.
- `loesung`: z. B. $\frac{1}{2} + \frac{1}{4}$, $\frac{1}{3} + \frac{5}{12}$, $\frac{2}{3} + \frac{1}{12}$. Vorgehen: $\frac{3}{4}$ erweitern (z. B. $\frac{9}{12}$), den Zähler in zwei Summanden zerlegen, kürzen. Mit jedem Erweitern entstehen neue Zerlegungen, also gibt es unendlich viele.

### Stolpersteine
- Zähler plus Zähler und Nenner plus Nenner ($\frac{1}{2} + \frac{1}{4} = \frac{2}{6}$).
- „Multiplizieren macht immer größer, Dividieren macht immer kleiner.“
- Beim Dividieren wird der falsche Bruch umgedreht.
- Punkt vor Strich wird bei Brüchen nicht beachtet.

---

## T03 Körper

- `id`: T03
- `kapitel`: Schnittpunkt 6, Kap. 3 (Quader und Netze, Schrägbilder, Grund- und Aufriss, Prisma, Pyramide, Zylinder, Kegel, Kugel, Kopfgeometrie)
- `leitidee`: RF
- `bp`: RF (7), (14), (15), S. 25–26

### Niveaubeschreibung

- **●○○ Basis:** Körper erkennen und benennen. Einem vorgegebenen Netz den Körper zuordnen (BP G). Ecken, Kanten und Flächen zählen. Netze von Würfel und Quader auf Karopapier zeichnen.
- **●●○ Standard:** Schrägbilder, Grund- und Aufrisse von Quadern und Würfeln zeichnen. Zusammenhänge zwischen Netz, Schrägbild und Modell herstellen (BP M), z. B. prüfen, ob ein Netz zu einem Würfel gehört.
- **●●● Experte:** Kopfgeometrie: gegenüberliegende Flächen im Netz bestimmen, alle Würfelnetze finden, Zusammenhänge zwischen Ecken, Flächen und Kanten untersuchen und als Vermutung formulieren.

### Beispielaufgaben

#### T03-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: RF (7)
- `operator`: Gib an
- `aufgabe`: Gib an, welche Körperform die Gegenstände haben: Konservendose, Schuhkarton, Eiswaffel, Fußball.
- `loesung`: Zylinder, Quader, Kegel, Kugel
- `darstellung`: Fotos oder Zeichnungen der vier Gegenstände

#### T03-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: RF (7)
- `operator`: Gib an
- `aufgabe`: Gib an, wie viele Ecken, Kanten und Flächen ein Quader hat.
- `loesung`: $8$ Ecken, $12$ Kanten, $6$ Flächen

#### T03-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: RF (14)
- `operator`: Zeichne
- `aufgabe`: Zeichne ein Netz eines Würfels mit der Kantenlänge $3\ \mathrm{cm}$ auf Karopapier.
- `loesung`: $6$ Quadrate mit $3\ \mathrm{cm}$ Seitenlänge, z. B. als Kreuz (vier in einer Reihe, je eines links und rechts am zweiten Quadrat)

#### T03-M-01
- `niveau`: ●●○
- `afb`: II
- `bp`: RF (15)
- `operator`: Untersuche, Begründe
- `aufgabe`: Ein Netz besteht aus vier Quadraten in einer Reihe. Ein fünftes Quadrat liegt über dem ersten, ein sechstes über dem zweiten Quadrat der Reihe. Untersuche, ob sich daraus ein Würfel falten lässt.
- `loesung`: Nein. Die vier Quadrate der Reihe bilden die Seitenflächen. Beide oberen Quadrate werden zum Deckel und liegen übereinander, der Boden fehlt.
- `darstellung`: Netz wie beschrieben

#### T03-M-02
- `niveau`: ●●○
- `afb`: I
- `bp`: RF (14)
- `operator`: Zeichne
- `aufgabe`: Zeichne ein Schrägbild eines Quaders mit $a = 4\ \mathrm{cm}$, $b = 3\ \mathrm{cm}$ und $c = 2\ \mathrm{cm}$.
- `loesung`: Vorderfläche $4\ \mathrm{cm} \times 2\ \mathrm{cm}$ in wahrer Größe; nach hinten laufende Kanten ($b = 3\ \mathrm{cm}$) unter $45°$ und verkürzt (auf Karopapier: je $1\ \mathrm{cm}$ Tiefe eine Kästchendiagonale, also $3$ Kästchendiagonalen); verdeckte Kanten gestrichelt

#### T03-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: RF (14)
- `operator`: Zeichne
- `aufgabe`: Ein Körper besteht aus $4$ gleichen Würfeln. Drei liegen in einer Reihe, auf dem linken Würfel liegt der vierte. Zeichne den Grundriss und den Aufriss von vorne.
- `loesung`: Grundriss: $3$ Quadrate in einer Reihe. Aufriss: $3$ Quadrate in einer Reihe, über dem linken ein viertes Quadrat.

#### T03-E-01
- `niveau`: ●●●
- `afb`: II
- `bp`: RF (15); prozessbezogen 2.2 Probleme lösen
- `operator`: Bestimme
- `aufgabe`: Bei einem Spielwürfel ergeben gegenüberliegende Augenzahlen zusammen $7$. Das Kreuznetz hat eine senkrechte Reihe aus vier Feldern A, B, C, D (von oben nach unten) und links und rechts neben B die Felder L und R. Es gilt A $= 1$, B $= 2$, L $= 3$. Bestimme die Augenzahlen auf C, D und R.
- `loesung`: Gegenüber liegen A und C, B und D, L und R. C $= 6$, D $= 5$, R $= 4$.
- `darstellung`: Kreuznetz mit Feldbezeichnungen

#### T03-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: RF (14), (15)
- `operator`: Finde, Begründe
- `aufgabe`: Finde möglichst viele verschiedene Würfelnetze. Begründe, warum zwei Netze, die durch Drehen oder Spiegeln auseinander hervorgehen, als gleich gelten.
- `loesung`: Es gibt $11$ verschiedene Würfelnetze. Kriterium: mindestens $6$ verschiedene korrekte Netze; gedrehte oder gespiegelte Netze ergeben beim Ausschneiden dasselbe Stück Papier.

#### T03-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: RF (7); prozessbezogen 2.1 Vermutungen entwickeln
- `operator`: Untersuche, Formuliere
- `aufgabe`: Zähle bei Quader, quadratischer Pyramide und dreiseitigem Prisma die Ecken, Flächen und Kanten. Untersuche den Zusammenhang und formuliere eine Vermutung.
- `loesung`: Quader $8 + 6 - 12 = 2$; Pyramide $5 + 5 - 8 = 2$; Prisma $6 + 5 - 9 = 2$. Vermutung: Ecken plus Flächen minus Kanten ergibt immer $2$.

### Stolpersteine
- Verdeckte Kanten im Schrägbild werden durchgezogen oder weggelassen.
- Tiefenkanten werden nicht verkürzt oder im falschen Winkel gezeichnet.
- Bei Netzen wird nur gezählt, ob es $6$ Quadrate sind, nicht wie sie liegen.

---

## T04 Dezimalzahlen

- `id`: T04
- `kapitel`: Schnittpunkt 6, Kap. 4 (Dezimalschreibweise, Vergleichen und Ordnen, Runden, Umwandeln durch Erweitern und Kürzen, Umwandeln durch Dividieren [M], Brüche, Dezimalzahlen und Prozent)
- `leitidee`: ZVO
- `bp`: ZVO (7), (9), (10), (11), (19), (20), S. 18–19

### Niveaubeschreibung

- **●○○ Basis:** in einfachen Fällen Brüche in Dezimalzahlen umwandeln und umgekehrt (Zehntel, Hundertstel, $\frac{1}{2}$, $\frac{1}{4}$). Stellenwerttafel nutzen. Runden auf eine vorgegebene Stelle. Zwei Dezimalzahlen vergleichen.
- **●●○ Standard:** Brüche durch Dividieren umwandeln, auch periodische Dezimalzahlen (BP M). Mehrere Dezimalzahlen ordnen. Brüche, Dezimalzahlen und Prozent ineinander umwandeln. Situationsgerecht runden.
- **●●● Experte:** Dichte der Zahlen begründen, Muster bei abbrechenden und periodischen Dezimalzahlen untersuchen, Genauigkeit gerundeter Werte bewerten (BP (20), nur E).

### Beispielaufgaben

#### T04-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (10)
- `operator`: Schreibe
- `aufgabe`: Schreibe als Dezimalzahl: a) $\frac{3}{10}$ b) $\frac{7}{100}$ c) $\frac{1}{2}$
- `loesung`: a) $0{,}3$ b) $0{,}07$ c) $0{,}5$

#### T04-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (19)
- `operator`: Runde
- `aufgabe`: Runde $4{,}368$ auf Zehntel.
- `loesung`: $4{,}4$

#### T04-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (7)
- `operator`: Vergleiche
- `aufgabe`: Vergleiche. Setze $<$ oder $>$ ein: $0{,}5$ ☐ $0{,}45$
- `loesung`: $0{,}5 > 0{,}45$ (denn $0{,}50 > 0{,}45$)

#### T04-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (7)
- `operator`: Ordne
- `aufgabe`: Ordne der Größe nach. Beginne mit der kleinsten Zahl: $0{,}7$; $0{,}65$; $0{,}705$; $0{,}07$
- `loesung`: $0{,}07 < 0{,}65 < 0{,}7 < 0{,}705$

#### T04-M-02
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (10)
- `operator`: Wandle um
- `aufgabe`: Wandle durch Dividieren in eine Dezimalzahl um: a) $\frac{3}{8}$ b) $\frac{2}{3}$
- `loesung`: a) $3 : 8 = 0{,}375$ b) $2 : 3 = 0{,}\overline{6}$

#### T04-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (11)
- `operator`: Ergänze
- `aufgabe`: Ergänze die Tabelle. Zeile 1: Bruch $\frac{3}{4}$. Zeile 2: Dezimalzahl $0{,}4$. Zeile 3: Prozent $5\ \%$.
- `loesung`: $\frac{3}{4} = 0{,}75 = 75\ \%$ · $\frac{2}{5} = 0{,}4 = 40\ \%$ · $\frac{1}{20} = 0{,}05 = 5\ \%$
- `darstellung`: Tabelle mit Spalten Bruch, Dezimalzahl, Prozent

#### T04-M-04
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (19)
- `operator`: Runde
- `aufgabe`: Ein Taschenrechner zeigt für den Preis eines Brötchens $0{,}4583\ €$. Runde sinnvoll und begründe deine Wahl.
- `loesung`: $0{,}46\ €$, weil es bei Geld nur ganze Cent gibt

#### T04-E-01
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (9)
- `operator`: Gib an, Begründe
- `aufgabe`: Gib eine Dezimalzahl an, die zwischen $0{,}3$ und $0{,}31$ liegt. Begründe, warum es zwischen zwei verschiedenen Dezimalzahlen immer noch eine weitere gibt.
- `loesung`: z. B. $0{,}305$. Man kann immer eine Stelle anhängen ($0{,}300 \ldots 0{,}310$) oder die Mitte nehmen. Kriterium: Begründung allgemein, nicht nur am Beispiel.

#### T04-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (10); prozessbezogen 2.1 Vermutungen entwickeln
- `operator`: Untersuche, Formuliere
- `aufgabe`: Wandle $\frac{1}{2}$, $\frac{1}{3}$, $\frac{1}{4}$, $\frac{1}{5}$, $\frac{1}{6}$ und $\frac{1}{8}$ in Dezimalzahlen um. Untersuche, wann die Dezimalzahl abbricht. Formuliere eine Vermutung.
- `loesung`: $0{,}5$; $0{,}\overline{3}$; $0{,}25$; $0{,}2$; $0{,}1\overline{6}$; $0{,}125$. Vermutung: Die Dezimalzahl bricht ab, wenn der Nenner (vollständig gekürzt) nur die Primfaktoren $2$ und $5$ hat.

#### T04-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (20) (nur E)
- `operator`: Bestimme, Bewerte
- `aufgabe`: Ein Beet ist auf ganze Meter gerundet $4\ \mathrm{m}$ lang. Bestimme, zwischen welchen Werten die wirkliche Länge liegt. Bewerte, ob man damit genug Zaun für $4\ \mathrm{m}$ kaufen sollte.
- `loesung`: $3{,}5\ \mathrm{m} \le$ Länge $< 4{,}5\ \mathrm{m}$. $4\ \mathrm{m}$ Zaun können bis fast $0{,}5\ \mathrm{m}$ zu kurz sein; besser vorher genau messen.

### Stolpersteine
- „Mehr Ziffern = größere Zahl“ ($0{,}705$ gilt als viel größer als $0{,}7$, $0{,}45$ als größer als $0{,}5$).
- $\frac{1}{4}$ wird als $0{,}4$ geschrieben.
- Beim Runden wird von hinten schrittweise gerundet ($4{,}45 \to 4{,}5 \to 5$).

---

## T05 Rechnen mit Dezimalzahlen

- `id`: T05
- `kapitel`: Schnittpunkt 6, Kap. 5 (Addieren und Subtrahieren, mit Stufenzahlen multiplizieren und dividieren, Multiplizieren, Dividieren, Verbindung der Rechenarten)
- `leitidee`: ZVO
- `bp`: ZVO (12), (13), (14), (18), (22), (26), S. 18–20

### Niveaubeschreibung

- **●○○ Basis:** schriftlich addieren und subtrahieren, multiplizieren (ein Faktor höchstens 2-stellig) und dividieren (Divisor 1-stellig) (BP G). Mit Zehnerstufenzahlen sicher multiplizieren und dividieren.
- **●●○ Standard:** multiplizieren (ein Faktor höchstens 3-stellig), dividieren (Divisor höchstens 2-stellig), Kommaverschiebung anwenden und begründen (BP M). Überschlag zur Kontrolle. Terme mit Punkt vor Strich und Klammern. Sachaufgaben.
- **●●● Experte:** Verfahren begründen, Fehler erklären, Wirkung von Faktoren und Divisoren kleiner als $1$ untersuchen, Klammern gezielt setzen.

### Beispielaufgaben

#### T05-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (13)
- `operator`: Berechne
- `aufgabe`: Berechne schriftlich. a) $12{,}5 + 3{,}75$ b) $20 - 7{,}4$
- `loesung`: a) $16{,}25$ b) $12{,}6$

#### T05-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (14)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $3{,}45 \cdot 10$ b) $72{,}1 : 100$
- `loesung`: a) $34{,}5$ b) $0{,}721$

#### T05-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (13)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $4{,}6 \cdot 3$ b) $9{,}6 : 4$
- `loesung`: a) $13{,}8$ b) $2{,}4$

#### T05-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (13), (12)
- `operator`: Überschlage, Berechne
- `aufgabe`: Überschlage zuerst. Berechne dann genau. a) $2{,}35 \cdot 1{,}4$ b) $4{,}9 \cdot 6{,}1$
- `loesung`: a) Überschlag $2 \cdot 1{,}5 = 3$; genau $3{,}29$ b) Überschlag $5 \cdot 6 = 30$; genau $29{,}89$

#### T05-M-02
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (13), (14)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $7{,}8 : 0{,}3$ b) $12{,}6 : 12$
- `loesung`: a) $78 : 3 = 26$ b) $1{,}05$

#### T05-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (18); MES (8)
- `operator`: Berechne
- `aufgabe`: Ein Kilogramm Äpfel kostet $1{,}80\ €$. Leon kauft $2{,}5\ \mathrm{kg}$. Berechne den Preis.
- `loesung`: $2{,}5 \cdot 1{,}80\ € = 4{,}50\ €$

#### T05-M-04
- `niveau`: ●●○
- `afb`: I
- `bp`: ZVO (26)
- `operator`: Berechne
- `aufgabe`: Berechne: $(3{,}5 + 1{,}25) \cdot 4 - 2{,}6$
- `loesung`: $4{,}75 \cdot 4 - 2{,}6 = 19 - 2{,}6 = 16{,}4$

#### T05-E-01
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (14)
- `operator`: Begründe
- `aufgabe`: Begründe, warum man bei $7{,}8 : 0{,}3$ in beiden Zahlen das Komma um eine Stelle nach rechts verschieben darf.
- `loesung`: Beide Zahlen werden mit $10$ multipliziert. Der Quotient bleibt gleich, wenn Dividend und Divisor mit derselben Zahl multipliziert werden: $7{,}8 : 0{,}3 = 78 : 3$. Kriterium: Bezug auf „gleiches Vervielfachen beider Zahlen“.

#### T05-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (13), (22)
- `operator`: Finde den Fehler, Erkläre
- `aufgabe`: Pik rechnet $0{,}4 \cdot 0{,}2 = 0{,}8$. Finde den Fehler. Erkläre mit Brüchen, warum das Ergebnis kleiner sein muss.
- `loesung`: Richtig: $0{,}08$. $\frac{4}{10} \cdot \frac{2}{10} = \frac{8}{100}$. Das Ergebnis hat so viele Nachkommastellen wie beide Faktoren zusammen ($1 + 1 = 2$).

#### T05-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (13); prozessbezogen 2.1 Argumentieren
- `operator`: Untersuche, Begründe
- `aufgabe`: Was passiert, wenn man $6$ durch eine Zahl kleiner als $1$ teilt? Untersuche an $6 : 0{,}5$ und $6 : 0{,}2$. Begründe allgemein.
- `loesung`: $6 : 0{,}5 = 12$; $6 : 0{,}2 = 30$. Das Ergebnis wird größer als $6$, weil die kleine Zahl mehr als $6$-mal in die $6$ passt. Kriterium: Deutung als „Wie oft passt … hinein?“.

#### T05-E-04
- `niveau`: ●●●
- `afb`: II
- `bp`: ZVO (26)
- `operator`: Setze Klammern
- `aufgabe`: Setze in $2{,}5 + 1{,}5 \cdot 4 - 0{,}5$ Klammern so, dass das Ergebnis möglichst groß wird.
- `loesung`: $(2{,}5 + 1{,}5) \cdot 4 - 0{,}5 = 15{,}5$ (zum Vergleich: ohne Klammern $8$; $(2{,}5 + 1{,}5) \cdot (4 - 0{,}5) = 14$)

### Stolpersteine
- Komma beim schriftlichen Addieren nicht untereinander.
- Beim Multiplizieren wird das Komma wie beim Addieren gesetzt ($0{,}4 \cdot 0{,}2 = 0{,}8$).
- „Dividieren macht immer kleiner.“

---

## T06 Berechnungen am Quader

- `id`: T06
- `kapitel`: Schnittpunkt 6, Kap. 6 (Oberflächeninhalt, Volumen vergleichen, Volumeneinheiten, Volumen des Quaders, zusammengesetzte Körper)
- `leitidee`: MES, RF
- `bp`: MES (5), (8), (14), (15), S. 22–23; FZ (6) (nur E), S. 27

### Niveaubeschreibung

- **●○○ Basis:** Volumen und Oberflächeninhalt von Würfel und Quader mit Formel und ganzzahligen Kanten bestimmen. Bei einfachen zusammengesetzten Körpern nur das Volumen (BP G). Volumeneinheiten in benachbarte Einheiten umwandeln.
- **●●○ Standard:** auch Dezimalzahlen als Kantenlängen, Volumen und Oberfläche einfacher zusammengesetzter Körper (BP M), Einheiten über mehrere Stufen umwandeln (auch Liter), Sachaufgaben.
- **●●● Experte:** Umkehraufgaben (Kante aus Volumen oder Oberfläche), Veränderung von Volumen und Oberfläche bei Vergrößerung erläutern (BP FZ (6), nur E), Optimierungsaufgaben.

### Beispielaufgaben

#### T06-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: MES (15)
- `operator`: Berechne
- `aufgabe`: Ein Würfel hat die Kantenlänge $3\ \mathrm{cm}$. Berechne sein Volumen und seinen Oberflächeninhalt.
- `loesung`: $V = 3 \cdot 3 \cdot 3 = 27\ \mathrm{cm}^3$; $O = 6 \cdot 9 = 54\ \mathrm{cm}^2$

#### T06-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: MES (15)
- `operator`: Berechne
- `aufgabe`: Ein Quader ist $5\ \mathrm{cm}$ lang, $4\ \mathrm{cm}$ breit und $2\ \mathrm{cm}$ hoch. Berechne sein Volumen.
- `loesung`: $V = 5 \cdot 4 \cdot 2 = 40\ \mathrm{cm}^3$

#### T06-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: MES (5)
- `operator`: Wandle um
- `aufgabe`: Wandle um. a) $2\ \mathrm{dm}^3$ in $\mathrm{cm}^3$ b) $3000\ \mathrm{cm}^3$ in $\mathrm{dm}^3$
- `loesung`: a) $2000\ \mathrm{cm}^3$ b) $3\ \mathrm{dm}^3$ (Umrechnungszahl $1000$)

#### T06-M-01
- `niveau`: ●●○
- `afb`: I
- `bp`: MES (15)
- `operator`: Berechne
- `aufgabe`: Ein Quader hat die Kanten $a = 6\ \mathrm{cm}$, $b = 4\ \mathrm{cm}$ und $c = 2{,}5\ \mathrm{cm}$. Berechne Volumen und Oberflächeninhalt.
- `loesung`: $V = 6 \cdot 4 \cdot 2{,}5 = 60\ \mathrm{cm}^3$; $O = 2 \cdot (24 + 15 + 10) = 98\ \mathrm{cm}^2$

#### T06-M-02
- `niveau`: ●●○
- `afb`: I
- `bp`: MES (5)
- `operator`: Wandle um
- `aufgabe`: Wandle um. a) $3{,}5\ \mathrm{l}$ in $\mathrm{cm}^3$ b) $0{,}25\ \mathrm{m}^3$ in Liter
- `loesung`: a) $3{,}5\ \mathrm{dm}^3 = 3500\ \mathrm{cm}^3$ b) $250\ \mathrm{dm}^3 = 250\ \mathrm{l}$

#### T06-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: MES (8), (15)
- `operator`: Berechne
- `aufgabe`: Ein Aquarium ist $80\ \mathrm{cm}$ lang, $40\ \mathrm{cm}$ breit und $50\ \mathrm{cm}$ hoch. Es wird bis $5\ \mathrm{cm}$ unter den Rand gefüllt. Berechne, wie viele Liter Wasser im Aquarium sind.
- `loesung`: Wasserhöhe $45\ \mathrm{cm}$; $80 \cdot 40 \cdot 45 = 144\,000\ \mathrm{cm}^3 = 144\ \mathrm{l}$

#### T06-M-04
- `niveau`: ●●○
- `afb`: II
- `bp`: MES (15)
- `operator`: Bestimme
- `aufgabe`: Ein Körper besteht aus zwei Quadern. Quader A: $6\ \mathrm{cm} \times 4\ \mathrm{cm} \times 2\ \mathrm{cm}$. Quader B steht auf A: $2\ \mathrm{cm} \times 4\ \mathrm{cm} \times 3\ \mathrm{cm}$. Bestimme das Volumen des Körpers.
- `loesung`: $48\ \mathrm{cm}^3 + 24\ \mathrm{cm}^3 = 72\ \mathrm{cm}^3$
- `darstellung`: Schrägbild des zusammengesetzten Körpers

#### T06-E-01
- `niveau`: ●●●
- `afb`: II
- `bp`: MES (15)
- `operator`: Bestimme
- `aufgabe`: Ein Würfel hat den Oberflächeninhalt $150\ \mathrm{cm}^2$. Bestimme seine Kantenlänge und sein Volumen.
- `loesung`: Eine Fläche: $150 : 6 = 25\ \mathrm{cm}^2$, also $a = 5\ \mathrm{cm}$; $V = 125\ \mathrm{cm}^3$

#### T06-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: FZ (6) (nur E), MES (15)
- `operator`: Untersuche, Begründe
- `aufgabe`: Was passiert mit dem Volumen und dem Oberflächeninhalt eines Würfels, wenn man jede Kante verdoppelt? Untersuche an einem Beispiel und begründe allgemein.
- `loesung`: Beispiel $a = 1\ \mathrm{cm} \to 2\ \mathrm{cm}$: $V$ von $1$ auf $8\ \mathrm{cm}^3$, $O$ von $6$ auf $24\ \mathrm{cm}^2$. Volumen wird $2 \cdot 2 \cdot 2 = 8$-mal so groß, jede Fläche $2 \cdot 2 = 4$-mal so groß.

#### T06-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: MES (15); prozessbezogen 2.2 systematisch probieren
- `operator`: Finde, Bestimme
- `aufgabe`: Finde alle Quader mit ganzzahligen Kantenlängen (in $\mathrm{cm}$) und dem Volumen $24\ \mathrm{cm}^3$. Bestimme, welcher den kleinsten Oberflächeninhalt hat.
- `loesung`: $1 \times 1 \times 24$ ($98\ \mathrm{cm}^2$), $1 \times 2 \times 12$ ($76$), $1 \times 3 \times 8$ ($70$), $1 \times 4 \times 6$ ($68$), $2 \times 2 \times 6$ ($56$), $2 \times 3 \times 4$ ($52$). Kleinster Oberflächeninhalt: $2 \times 3 \times 4$ mit $52\ \mathrm{cm}^2$.

### Stolpersteine
- Umrechnungszahl $10$ oder $100$ statt $1000$ bei Volumeneinheiten.
- Oberfläche: nur drei Flächen statt sechs addiert.
- Volumen und Oberfläche werden verwechselt; Einheit $\mathrm{cm}^2$ statt $\mathrm{cm}^3$.

---

## T07 Zuordnungen

- `id`: T07
- `kapitel`: Schnittpunkt 6, Kap. 7 (Darstellungen, proportionale Zuordnungen, Schaubilder, Dreisatz, antiproportionale Zuordnungen [E], Dreisatz antiproportional [E])
- `leitidee`: FZ
- `bp`: FZ (1), (3), (4), (5), S. 26–27

### Niveaubeschreibung

- **●○○ Basis:** einfache Zusammenhänge in Alltagssituationen erkennen. Wertetabellen mit einfachen Zahlen ergänzen, Punkte eintragen und ablesen. Entscheiden, ob „doppelt so viel → doppelt so teuer“ gilt.
- **●●○ Standard:** proportionale Zuordnungen an Tabelle (Quotientengleichheit) und Schaubild (Ursprungsgerade) erkennen, Sachaufgaben mit dem Dreisatz lösen, zwischen Text, Tabelle und Graph wechseln (BP M).
- **●●● Experte:** zusätzlich antiproportionale Zuordnungen und antiproportionaler Dreisatz (BP E). Zuordnungen begründet als proportional, antiproportional oder keines von beiden einordnen.

### Beispielaufgaben

#### T07-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: FZ (4), (5)
- `operator`: Ergänze
- `aufgabe`: Ein Heft kostet $1{,}50\ €$. Ergänze die Tabelle für $2$, $3$ und $5$ Hefte.
- `loesung`: $2 \to 3{,}00\ €$; $3 \to 4{,}50\ €$; $5 \to 7{,}50\ €$

#### T07-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: FZ (1), (5)
- `operator`: Kreuze an
- `aufgabe`: Kreuze an, wo gilt: doppelt so viel, doppelt so viel. a) Anzahl Brötchen → Preis b) Alter eines Kindes → Körpergröße
- `loesung`: a) ja b) nein

#### T07-G-03
- `niveau`: ●○○
- `afb`: I
- `bp`: FZ (3), (4)
- `operator`: Trage ein
- `aufgabe`: Trage die Werte aus der Heft-Tabelle (T07-G-01) als Punkte in das Koordinatensystem ein. x-Achse: Anzahl Hefte, y-Achse: Preis in €.
- `loesung`: Punkte $(2 \mid 3)$, $(3 \mid 4{,}5)$, $(5 \mid 7{,}5)$; sie liegen auf einer Geraden durch den Ursprung
- `darstellung`: vorgegebenes Koordinatensystem mit Einteilung

#### T07-M-01
- `niveau`: ●●○
- `afb`: II
- `bp`: FZ (5)
- `operator`: Berechne
- `aufgabe`: $4\ \mathrm{kg}$ Kartoffeln kosten $6\ €$. Berechne mit dem Dreisatz, wie viel $7\ \mathrm{kg}$ kosten.
- `loesung`: $4\ \mathrm{kg} \to 6\ €$; $1\ \mathrm{kg} \to 1{,}50\ €$; $7\ \mathrm{kg} \to 10{,}50\ €$

#### T07-M-02
- `niveau`: ●●○
- `afb`: II
- `bp`: FZ (4), (5)
- `operator`: Untersuche
- `aufgabe`: Untersuche, welche Tabelle zu einer proportionalen Zuordnung gehört. Tabelle A: $2 \to 5$, $4 \to 10$, $6 \to 15$. Tabelle B: $2 \to 5$, $4 \to 9$, $6 \to 13$.
- `loesung`: A ist proportional (Quotient immer $2{,}5$). B nicht: $5 : 2 = 2{,}5$, aber $9 : 4 = 2{,}25$.

#### T07-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: FZ (4)
- `operator`: Beschreibe
- `aufgabe`: Beschreibe, woran man im Schaubild erkennt, dass eine Zuordnung proportional ist.
- `loesung`: Die Punkte liegen auf einer Geraden, die durch den Ursprung $(0 \mid 0)$ geht.

#### T07-E-01
- `niveau`: ●●●
- `afb`: II
- `bp`: FZ (5) (antiproportional, nur E)
- `operator`: Berechne
- `aufgabe`: $3$ gleiche Pumpen leeren ein Becken in $8$ Stunden. Berechne, wie lange $4$ Pumpen brauchen.
- `loesung`: $1$ Pumpe braucht $24$ Stunden; $4$ Pumpen brauchen $24 : 4 = 6$ Stunden.

#### T07-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: FZ (1), (5)
- `operator`: Begründe
- `aufgabe`: Begründe, ob die Zuordnung proportional, antiproportional oder keines von beiden ist. a) Seitenlänge eines Quadrats → Flächeninhalt b) Geschwindigkeit → Fahrzeit für $120\ \mathrm{km}$ c) gefahrene Kilometer → Taxipreis bei $4\ €$ Grundgebühr und $2\ €$ pro km
- `loesung`: a) keines: Seitenlänge doppelt, Fläche viermal so groß ($1 \to 1$, $2 \to 4$) b) antiproportional: doppelte Geschwindigkeit, halbe Zeit (Produkt immer $120$) c) keines: $1\ \mathrm{km} \to 6\ €$, $2\ \mathrm{km} \to 8\ €$, nicht das Doppelte; der Graph geht nicht durch den Ursprung

### Stolpersteine
- Jede „je mehr, desto mehr“-Zuordnung wird für proportional gehalten.
- Beim Dreisatz wird im zweiten Schritt falsch herum gerechnet (multipliziert statt dividiert).
- Achsen werden ungleichmäßig eingeteilt.

---

## T08 Daten auswerten und darstellen

- `id`: T08
- `kapitel`: Schnittpunkt 6, Kap. 8 (Erheben und Stichproben, Kenngrößen, absolute und relative Häufigkeit, Kreis- und Streifendiagramme lesen, Daten darstellen [M])
- `leitidee`: DZ
- `bp`: DZ (1) bis (9), S. 28–29

### Niveaubeschreibung

- **●○○ Basis:** Strichlisten und Häufigkeitstabellen anfertigen, absolute und relative Häufigkeiten bestimmen, Maximum, Minimum, Spannweite und Mittelwert berechnen. Daten in Säulen- und Balkendiagrammen darstellen (BP G), Werte aus Kreis- und Streifendiagrammen entnehmen.
- **●●○ Standard:** zusätzlich Kreis- und Streifendiagramme selbst zeichnen (BP M), Wirkung einzelner Werte auf den Mittelwert beschreiben, einfache statistische Aussagen formulieren, Datenerhebung mit Hilfe planen.
- **●●● Experte:** statistische Aussagen mithilfe der Kenngrößen formulieren, Stichproben beurteilen, Darstellungen auf Eignung und Irreführung beurteilen (BP (9), nur E), Datensätze zu vorgegebenen Kenngrößen erfinden.

### Beispielaufgaben

#### T08-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: DZ (3), (6)
- `operator`: Zeichne, Berechne
- `aufgabe`: $20$ Kinder wurden nach ihrem Lieblingssport gefragt: Fußball $8$, Schwimmen $5$, Reiten $4$, Basketball $3$. a) Zeichne ein Säulendiagramm. b) Berechne die relative Häufigkeit für Fußball als Bruch und in Prozent.
- `loesung`: a) vier Säulen mit Höhen $8$, $5$, $4$, $3$, Achsen beschriftet b) $\frac{8}{20} = \frac{2}{5} = 40\ \%$

#### T08-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: DZ (4)
- `operator`: Bestimme
- `aufgabe`: Fünf Kinder springen weit: $3{,}2\ \mathrm{m}$; $2{,}8\ \mathrm{m}$; $3{,}5\ \mathrm{m}$; $3{,}0\ \mathrm{m}$; $2{,}5\ \mathrm{m}$. Bestimme Maximum, Minimum, Spannweite und Mittelwert.
- `loesung`: Maximum $3{,}5\ \mathrm{m}$; Minimum $2{,}5\ \mathrm{m}$; Spannweite $1{,}0\ \mathrm{m}$; Mittelwert $15{,}0 : 5 = 3{,}0\ \mathrm{m}$

#### T08-M-01
- `niveau`: ●●○
- `afb`: II
- `bp`: DZ (3), (6)
- `operator`: Zeichne
- `aufgabe`: Zeichne zu den Daten aus T08-G-01 ein Kreisdiagramm. Berechne zuerst die Winkel.
- `loesung`: Fußball $40\ \% \to 144°$; Schwimmen $25\ \% \to 90°$; Reiten $20\ \% \to 72°$; Basketball $15\ \% \to 54°$ (Summe $360°$)

#### T08-M-02
- `niveau`: ●●○
- `afb`: II
- `bp`: DZ (4), (7)
- `operator`: Berechne, Beschreibe
- `aufgabe`: Ein sechstes Kind springt $4{,}0\ \mathrm{m}$ (Daten aus T08-G-02). Berechne den neuen Mittelwert. Beschreibe, wie sich Mittelwert und Spannweite verändern.
- `loesung`: $19{,}0 : 6 \approx 3{,}17\ \mathrm{m}$. Der Mittelwert steigt um etwa $0{,}17\ \mathrm{m}$, die Spannweite wächst von $1{,}0\ \mathrm{m}$ auf $1{,}5\ \mathrm{m}$.

#### T08-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: DZ (5)
- `operator`: Entnimm
- `aufgabe`: Ein Streifendiagramm ist $10\ \mathrm{cm}$ lang. Der Abschnitt „Bus“ ist $3{,}5\ \mathrm{cm}$ lang. Es wurden $200$ Personen befragt. Entnimm, wie viele Personen mit dem Bus fahren.
- `loesung`: $3{,}5 : 10 = 35\ \%$; $35\ \%$ von $200 = 70$ Personen

#### T08-E-01
- `niveau`: ●●●
- `afb`: III
- `bp`: DZ (9) (nur E)
- `operator`: Beurteile
- `aufgabe`: Ein Säulendiagramm zeigt die Mitglieder zweier Vereine: A $95$, B $100$. Die y-Achse beginnt bei $90$. Die Säule von B ist doppelt so hoch wie die von A. Beurteile die Darstellung.
- `loesung`: Irreführend. Durch den Achsenbeginn bei $90$ wirkt B doppelt so groß, tatsächlich hat B nur $5$ Mitglieder (etwa $5\ \%$) mehr. Die Achse sollte bei $0$ beginnen oder der Achsenbruch deutlich gekennzeichnet sein.

#### T08-E-02
- `niveau`: ●●●
- `afb`: III
- `bp`: DZ (1)
- `operator`: Beurteile
- `aufgabe`: Leon will wissen, wie die Kinder seiner Schule zur Schule kommen. Er befragt nur seine Fußballmannschaft. Beurteile die Stichprobe und mache einen besseren Vorschlag.
- `loesung`: Nicht geeignet: zu klein und einseitig (z. B. ein Wohnort, ein Alter). Besser: aus jeder Klasse einige zufällig ausgewählte Kinder befragen.

#### T08-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: DZ (4)
- `operator`: Finde
- `aufgabe`: Finde fünf Zahlen mit dem Mittelwert $4$ und der Spannweite $6$. Finde eine zweite, ganz andere Lösung.
- `loesung`: z. B. $1, 3, 4, 5, 7$ (Summe $20$, Spannweite $7 - 1 = 6$) oder $2, 2, 2, 6, 8$ (Summe $20$, Spannweite $6$). Kriterium: Summe $20$ und Differenz von größter und kleinster Zahl $6$.

### Stolpersteine
- Mittelwert wird mit dem Wert in der Mitte verwechselt.
- Relative Häufigkeit wird auf die falsche Gesamtzahl bezogen.
- Kreisdiagramm: Prozent werden direkt als Grad eingetragen.

---

## T09 Rationale Zahlen

- `id`: T09
- `kapitel`: Schnittpunkt 6, Kap. 9 (ganze Zahlen, rationale Zahlen, Vergleichen und Ordnen, Zunahme und Abnahme, Addieren und Subtrahieren [E], Multiplizieren und Dividieren [E])
- `leitidee`: ZVO
- `bp`: ZVO (4), (7), (8) (nur E), (18) (E), S. 18–19
- `hinweis`: In der 6a laut Stoffverteilungsplan nach Notenschluss; Klasse 7 Kap. 1 nimmt das Thema vollständig wieder auf.

### Niveaubeschreibung

- **●○○ Basis:** ganze Zahlen für Situationen mit Skala (Thermometer) und Änderung (Kontostand) verwenden. Ganze Zahlen auf der Zahlengeraden eintragen, vergleichen und ordnen.
- **●●○ Standard:** auch negative Brüche und Dezimalzahlen auf der Zahlengeraden zuordnen, vergleichen und ordnen. Zunahme und Abnahme in Sachsituationen berechnen. Zahlen zwischen zwei rationalen Zahlen angeben.
- **●●● Experte:** Betrag angeben (BP (8), nur E). Mit rationalen Zahlen rechnen (BP (18) E). Aussagen über negative Zahlen prüfen.

### Beispielaufgaben

#### T09-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (4)
- `operator`: Berechne
- `aufgabe`: Morgens zeigt das Thermometer $-3\ °\mathrm{C}$, mittags $5\ °\mathrm{C}$. Berechne, um wie viel Grad es wärmer geworden ist.
- `loesung`: $8\ °\mathrm{C}$
- `darstellung`: Thermometer-Skala von $-10$ bis $10$

#### T09-G-02
- `niveau`: ●○○
- `afb`: I
- `bp`: ZVO (7)
- `operator`: Ordne
- `aufgabe`: Ordne der Größe nach. Beginne mit der kleinsten Zahl: $-4$; $2$; $-1$; $0$; $-7$
- `loesung`: $-7 < -4 < -1 < 0 < 2$

#### T09-M-01
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (7)
- `operator`: Ordne
- `aufgabe`: Ordne der Größe nach: $-0{,}5$; $-\frac{1}{4}$; $-0{,}75$; $\frac{1}{2}$
- `loesung`: $-0{,}75 < -0{,}5 < -\frac{1}{4} < \frac{1}{2}$

#### T09-M-02
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (4)
- `operator`: Berechne
- `aufgabe`: Auf einem Konto sind $120\ €$. Es werden $150\ €$ abgebucht. Berechne den neuen Kontostand.
- `loesung`: $120\ € - 150\ € = -30\ €$

#### T09-M-03
- `niveau`: ●●○
- `afb`: II
- `bp`: ZVO (7), (9)
- `operator`: Gib an
- `aufgabe`: Gib zwei Zahlen an, die zwischen $-1$ und $-\frac{1}{2}$ liegen.
- `loesung`: z. B. $-0{,}6$ und $-0{,}75$

#### T09-E-01
- `niveau`: ●●●
- `afb`: I
- `bp`: ZVO (8) (nur E)
- `operator`: Gib an
- `aufgabe`: a) Gib den Betrag von $-7$ an. b) Gib alle ganzen Zahlen an, deren Betrag kleiner als $3$ ist.
- `loesung`: a) $\lvert -7 \rvert = 7$ b) $-2, -1, 0, 1, 2$

#### T09-E-02
- `niveau`: ●●●
- `afb`: I
- `bp`: ZVO (18) (E)
- `operator`: Berechne
- `aufgabe`: Berechne. a) $-3 + 8$ b) $-2 - 5$ c) $(-4) \cdot 3$ d) $(-12) : (-4)$
- `loesung`: a) $5$ b) $-7$ c) $-12$ d) $3$

#### T09-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: ZVO (7), (8)
- `operator`: Überprüfe, Begründe
- `aufgabe`: Stimmt das? „Eine negative Zahl ist umso größer, je größer ihr Betrag ist.“ Überprüfe und begründe.
- `loesung`: Nein. $\lvert -10 \rvert > \lvert -2 \rvert$, aber $-10 < -2$, denn $-10$ liegt auf der Zahlengeraden weiter links.

### Stolpersteine
- $-7 > -4$, weil $7 > 4$.
- Das Minus als Rechenzeichen und als Vorzeichen wird verwechselt.
- Temperaturänderung wird als Summe statt als Abstand berechnet ($-3$ bis $5$: „$2$ Grad“).

---

## T10 Flächenberechnungen

- `id`: T10
- `kapitel`: Schnittpunkt 6, Kap. 10 (Dreieck, Parallelogramm, Trapez, Kreis, zusammengesetzte Figuren), im Lehrwerk vollständig [E]
- `leitidee`: MES
- `bp`: MES (9), (12), (13), S. 22–23
- `hinweis`: Im Bildungsplan gehören Dreieck, Parallelogramm, Trapez und Kreis in Klasse 5/6 nur zu Niveau E. G und M verlangen nur Rechteck, Quadrat und daraus zusammengesetzte Figuren. In der 6a ist das Kapitel nicht eingeplant (Puffer). Die Stufen unten sind deshalb ein Vorschlag für die Plattform: ●○○ und ●●○ bleiben auf G/M-Inhalt, ●●● nimmt E-Inhalte auf.

### Niveaubeschreibung

- **●○○ Basis:** Flächeninhalt und Umfang von Rechteck und Quadrat berechnen (BP G/M).
- **●●○ Standard:** Flächeninhalt von Figuren bestimmen, die aus Rechtecken und Quadraten zusammengesetzt sind (BP G/M), auch durch Ergänzen und Abziehen.
- **●●● Experte:** Flächeninhalt von Dreieck, Parallelogramm, Trapez und Kreis berechnen und die Formeln für Parallelogramm und Dreieck geometrisch erklären (BP E).

### Beispielaufgaben

#### T10-G-01
- `niveau`: ●○○
- `afb`: I
- `bp`: MES (9), (13)
- `operator`: Berechne
- `aufgabe`: Ein Rechteck ist $7\ \mathrm{cm}$ lang und $4\ \mathrm{cm}$ breit. Berechne Flächeninhalt und Umfang.
- `loesung`: $A = 28\ \mathrm{cm}^2$; $u = 2 \cdot (7 + 4) = 22\ \mathrm{cm}$

#### T10-M-01
- `niveau`: ●●○
- `afb`: II
- `bp`: MES (13)
- `operator`: Bestimme
- `aufgabe`: Aus einem Rechteck ($6\ \mathrm{cm}$ lang, $4\ \mathrm{cm}$ breit) wird an einer Ecke ein Quadrat mit $2\ \mathrm{cm}$ Seitenlänge ausgeschnitten. Bestimme den Flächeninhalt der Restfigur. Beschreibe einen zweiten Lösungsweg.
- `loesung`: $24\ \mathrm{cm}^2 - 4\ \mathrm{cm}^2 = 20\ \mathrm{cm}^2$. Zweiter Weg: in zwei Rechtecke zerlegen, z. B. $4 \cdot 4 + 2 \cdot 2 = 16 + 4 = 20\ \mathrm{cm}^2$.
- `darstellung`: L-förmige Figur auf Karopapier

#### T10-E-01
- `niveau`: ●●●
- `afb`: I
- `bp`: MES (13) (E)
- `operator`: Berechne
- `aufgabe`: Berechne den Flächeninhalt. a) Dreieck mit $g = 6\ \mathrm{cm}$, $h = 4\ \mathrm{cm}$ b) Parallelogramm mit $g = 5\ \mathrm{cm}$, $h = 3\ \mathrm{cm}$ c) Trapez mit $a = 8\ \mathrm{cm}$, $c = 4\ \mathrm{cm}$, $h = 3\ \mathrm{cm}$
- `loesung`: a) $\frac{6 \cdot 4}{2} = 12\ \mathrm{cm}^2$ b) $15\ \mathrm{cm}^2$ c) $\frac{8 + 4}{2} \cdot 3 = 18\ \mathrm{cm}^2$

#### T10-E-02
- `niveau`: ●●●
- `afb`: I
- `bp`: MES (9), (13) (E)
- `operator`: Berechne
- `aufgabe`: Ein Kreis hat den Radius $5\ \mathrm{cm}$. Berechne Umfang und Flächeninhalt. Rechne mit $\pi \approx 3{,}14$.
- `loesung`: $u = 2 \cdot 3{,}14 \cdot 5 = 31{,}4\ \mathrm{cm}$; $A = 3{,}14 \cdot 25 = 78{,}5\ \mathrm{cm}^2$

#### T10-E-03
- `niveau`: ●●●
- `afb`: III
- `bp`: MES (12) (E)
- `operator`: Erkläre
- `aufgabe`: Erkläre mit einer Skizze, warum der Flächeninhalt eines Dreiecks $A = \frac{g \cdot h}{2}$ ist.
- `loesung`: Zwei gleiche Dreiecke lassen sich zu einem Parallelogramm mit Grundseite $g$ und Höhe $h$ zusammensetzen. Das Parallelogramm hat $A = g \cdot h$, ein Dreieck die Hälfte. Kriterium: Verdopplung oder Zerlegung sichtbar und begründet.

### Stolpersteine
- Schräge Seite statt Höhe wird eingesetzt.
- Umfang und Flächeninhalt werden verwechselt.
- Beim Kreis wird Durchmesser statt Radius quadriert.

---

## 3 Hinweise für die Umsetzung auf der Plattform

Die folgenden Punkte sind Vorschläge der Lehrkraft bzw. aus der Erstellung dieser Datei. Sie sind keine Forschungsbefunde.

- **Niveauwahl offen lassen.** Die Kinder wählen in den Arbeitsblättern ihre Stufe selbst. Eine Plattform kann eine Empfehlung geben (z. B. nach zwei richtigen ●○○-Aufgaben die ●●○-Stufe anbieten), sollte aber den Wechsel in beide Richtungen erlauben.
- **●●○ ist das Ziel für alle.** Klassenarbeiten in Klasse 6 sind auf M-Niveau. Wer nur ●○○ bearbeitet, sollte gezielt zu ●●○ geführt werden.
- **Offene Aufgaben (AFB III) brauchen andere Auswertung.** Aufgaben mit „Begründe“, „Finde möglichst viele“ oder „Beurteile“ haben ein `kriterium` statt einer einzigen Lösung. Eine automatische Auswertung ist dort nur eingeschränkt möglich; hier sind Musterlösungen zum Vergleichen oder eine Rückmeldung durch die Lehrkraft sinnvoller.
- **Stolpersteine als Rückmeldung nutzen.** Die Liste je Thema eignet sich für gezielte Hinweise bei typischen falschen Antworten (z. B. Eingabe $\frac{2}{6}$ bei $\frac{1}{2} + \frac{1}{4}$).
- **Formeln und Einheiten** sind in LaTeX gesetzt. Dezimalkomma als `{,}`, Einheiten aufrecht mit `\mathrm{}`.
- **Keine Schülerdaten.** Alle Namen in den Aufgaben (Leon, Tobi, Pik, Frida) sind die Maskottchen-Figuren der Lehrkraft.

## 4 Bildungsplan-Inhalte Klasse 5/6 ohne eigenes Kapitel in Schnittpunkt 6

Diese Teilkompetenzen gelten für die Doppelklasse 5/6, sind im Lehrwerk für Klasse 6 aber kein eigenes Kapitel (vermutlich in Klasse 5 behandelt; mit dem Lehrwerk Klasse 5 abgleichen). Für sie sind hier keine Aufgaben ausgearbeitet:

- ZVO (1), (2), (15), (21), (23)–(28): Stellenwertsystem, große Zahlen, Potenzen und Quadratzahlen, Zahlterme und Fachbegriffe, Gleichungen durch Probieren
- MES (1)–(7), (11): Messen, Einheiten, Schätzen, Winkel, Rechteckformel erklären
- RF (1)–(6), (8)–(13): Lagebeziehungen, Winkel, Symmetrie, Vierecke, Zeichnen, Koordinatensystem, Spiegelungen
- FZ (2), (7), (8): Muster, Maßstab

## 5 Quellen und Verifizierungsstatus

| Quelle | Verwendung | Status |
|---|---|---|
| Ministerium für Kultus, Jugend und Sport BW: Bildungsplan 2016, Sekundarstufe I, Mathematik, vom 23.03.2016 in der Fassung vom 29.02.2024 (V2) | Teilkompetenzen und Niveaus G/M/E (S. 17–29), Niveaus und Kennzeichnungen (S. 8, 63–64), Operatoren und AFB (S. 56–58) | liegt als Projektdatei vor (`ressourcen/bildungsplan/BP2016BW_Mathematik_Sek1.pdf`), Seitenangaben aus der Projektübersicht übernommen; S. 19 (ZVO 13–20) am PDF gegengeprüft. Nicht per Websuche verifiziert. Für wörtliche Zitate PDF prüfen. |
| KMK: Bildungsstandards Mathematik ESA/MSA, i. d. F. vom 23.06.2022 | ergänzender Rahmen, AFB I–III | liegt als Projektdatei vor; in dieser Datei nur als Hintergrund, keine Einzelaussage daraus übernommen |
| Klett: Schnittpunkt Mathematik 6, Ausgabe BW, Inhaltsverzeichnis | Gliederung der Themen T01–T10 | Inhaltsverzeichnis von der Lehrkraft hochgeladen (2026-11-02), Kapitelzuordnung aus `ressourcen/stoffverteilungsplaene/Stoffverteilungsplan_Kl6.md` |
| Leuders, T.: Intelligent üben (Formate der ★-Aufgabe, S. 139–141) | Tabelle 1.3 | aus der Arbeitsblatt-Vorlage der Lehrkraft übernommen; nicht verifiziert, vor Weitergabe Titel, Auflage und Seiten prüfen (z. B. über FIS Bildung oder Google Scholar) |
| Stolpersteine je Thema | Hinweise für Rückmeldungen | Erfahrungswissen aus der Unterrichtspraxis und den Lehrkraftseiten der Arbeitsblätter; nicht einzeln durch Studien belegt |
| Beispielaufgaben | Abschnitt 2 | selbst erstellt, teilweise aus Arbeitsblättern der 6a übernommen (K02 AB02); alle Lösungen nachgerechnet |
