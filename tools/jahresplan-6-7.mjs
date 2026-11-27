// Klasse 6, Kapitel 7 „Zuordnungen“ (ADR 0050): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-25: sechs Meilensteine mit je zwei Lernzielen und 24 Aufgaben. 7.3 und 7.4 (Medienkompetenz) entfallen.
// 7.6 „Dreisatz“ ist Pflicht ab M (der Bildungsplan verlangt ihn erst dort), hat aber Aufgaben auf allen Stufen.
// 7.7 und 7.8 tragen im Buch die Marke E: Niveau-Meilensteine mit 24 Aufgaben nur auf E.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele67 = {
  1: {
    D1: 'Ich kann Zuordnungen aus Text, Tabelle und Schaubild lesen.',
    D2: 'Ich kann zwischen Text, Tabelle und Schaubild wechseln.',
  },
  2: {
    P1: 'Ich kann erkennen, ob eine Zuordnung proportional ist.',
    P2: 'Ich kann Tabellen zu proportionalen Zuordnungen ergänzen.',
  },
  5: {
    S1: 'Ich kann proportionale Zuordnungen am Schaubild erkennen.',
    S2: 'Ich kann am Schaubild Werte ablesen und Punkte eintragen.',
  },
  6: {
    R1: 'Ich kann mit dem Dreisatz rechnen.',
    R2: 'Ich kann Sachaufgaben mit dem Dreisatz lösen.',
  },
  7: {
    A1: 'Ich kann antiproportionale Zuordnungen erkennen.',
    A2: 'Ich kann Tabellen zu antiproportionalen Zuordnungen ergänzen.',
  },
  8: {
    U1: 'Ich kann den Dreisatz bei antiproportionalen Zuordnungen anwenden.',
    U2: 'Ich kann entscheiden, welche Zuordnung vorliegt, und passend rechnen.',
  },
};

export const merkzettel67 = {
  '6.7.1': {
    heft: 'Zeichne zuerst die Achsen mit dem Lineal. Schreibe an jede Achse die Größe mit Einheit und teile sie gleichmäßig ein.',
  },
  '6.7.2': {
    heft: 'Schreibe die Rechenpfeile über und unter die Tabelle. So siehst du, ob oben und unten dasselbe gerechnet wird.',
  },
  '6.7.5': {
    heft: 'Trage zwei oder drei Punkte genau ein und lege das Lineal an. Geht die Gerade durch den Nullpunkt?',
  },
  '6.7.6': {
    heft: 'Schreibe die drei Zeilen untereinander und die Rechenpfeile an beide Seiten. Schreibe zum Schluss einen Antwortsatz.',
  },
  '6.7.7': {
    heft: 'Schreibe unter jedes Wertepaar der Tabelle das Produkt. Ist es überall gleich, ist die Zuordnung antiproportional.',
  },
  '6.7.8': {
    heft: 'Schreibe die drei Zeilen und an beide Seiten die Rechenpfeile. Prüfe mit dem Produkt, ob alle drei Zeilen passen.',
  },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
export const wortspeicher67 = {
  '6.7.1': [
    w('Zuordnung', 'F', 'Zu jedem Wert einer Größe gehört ein Wert einer zweiten Größe: 2 Hefte → 3 €.'),
    w('Schaubild', 'F', 'Ein Bild der Zuordnung mit zwei Achsen. Jeder Punkt zeigt zwei Werte, die zusammengehören.'),
    w('Achse', 'F', 'Eine der beiden Linien mit Zahlen im Schaubild: eine nach rechts, eine nach oben.'),
    w('Wertepaar', 'G', 'Zwei Werte, die zusammengehören, zum Beispiel 2 Hefte und 3 €.'),
    w('Einteilung', 'G', 'Wie viel ein Kästchen an einer Achse wert ist.'),
    w('Verlauf', 'M', 'Wie sich die Werte ändern: Die Linie steigt, fällt oder bleibt gleich hoch.'),
  ],
  '6.7.2': [
    w('proportional', 'F', 'Zum Doppelten gehört das Doppelte, zum Dreifachen das Dreifache.'),
    w('das Doppelte', 'F', 'Zweimal so viel.'),
    w('das Dreifache', 'G', 'Dreimal so viel. Das Zehnfache ist zehnmal so viel.'),
    w('Quotient', 'M', 'Das Ergebnis einer Division. Bei proportionalen Zuordnungen ist der Quotient der Wertepaare immer gleich.'),
  ],
  '6.7.5': [
    w('Nullpunkt', 'F', 'Der Punkt (0|0), an dem sich die beiden Achsen treffen.'),
    w('Gerade', 'F', 'Eine gerade Linie ohne Anfang und Ende. Sie geht in beide Richtungen immer weiter.'),
    w('Gitterlinie', 'G', 'Eine Linie des Karogitters im Schaubild. Dort kannst du genau ablesen.'),
    w('Zwischenwert', 'M', 'Ein Wert, der zwischen zwei eingetragenen Wertepaaren liegt und an der Geraden abgelesen wird.'),
  ],
  '6.7.6': [
    w('Dreisatz', 'F', 'Rechnung in drei Zeilen: gegebenes Wertepaar, Wert für 1, gesuchter Wert.'),
    w('Dreisatztabelle', 'F', 'Die drei Zeilen des Dreisatzes als Tabelle.'),
    w('Rechenpfeil', 'F', 'Der Pfeil am Rand der Dreisatztabelle. Er sagt, womit geteilt oder malgenommen wird.'),
    w('Zwischenschritt', 'G', 'Die mittlere Zeile im Dreisatz, meistens der Wert für 1.'),
    w('gemeinsamer Teiler', 'M', 'Eine Zahl, durch die sich zwei Zahlen teilen lassen. 3 ist ein gemeinsamer Teiler von 6 und 9.'),
  ],
  '6.7.7': [
    w('antiproportional', 'E', 'Zum Doppelten gehört die Hälfte, zum Dreifachen ein Drittel. Das Produkt bleibt gleich.'),
    w('Produkt', 'E', 'Das Ergebnis einer Multiplikation.'),
    w('Kurve', 'E', 'Eine gebogene Linie im Schaubild.'),
  ],
  '6.7.8': [
    w('Gegenrechnung', 'E', 'Die umgekehrte Rechnung: mal statt geteilt, geteilt statt mal.'),
  ],
};

// Voraussetzungen (Nils, 2026-11-25, Q12). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
export const voraussetzungen67 = {
  '6.7.1-D1': ['5.1.2-L1', '5.5.4-K1'],
  '6.7.1-D2': ['6.7.1-D1', '5.5.4-K2'],
  '6.7.2-P1': ['6.7.1-D1'],
  '6.7.2-P2': ['6.7.2-P1', '6.5.3-M1'],
  '6.7.5-S1': ['6.7.1-D2', '6.7.2-P1'],
  '6.7.5-S2': ['6.7.5-S1'],
  '6.7.6-R1': ['6.7.2-P2', '6.5.4-D1'],
  '6.7.6-R2': ['6.7.6-R1'],
  '6.7.7-A1': ['6.7.2-P1'],
  '6.7.7-A2': ['6.7.7-A1'],
  '6.7.8-U1': ['6.7.6-R1', '6.7.7-A2'],
  '6.7.8-U2': ['6.7.8-U1'],
};

export const grundlagen67 = {
  '6.7.1-D1': 'Einen Wert aus einer Wertetabelle oder an einem Punkt im Schaubild ablesen',
  '6.7.1-D2': 'Zwei Wertepaare aus einer Tabelle als Punkte ins Schaubild eintragen',
  '6.7.2-P1': 'Prüfen, ob zum Doppelten das Doppelte gehört',
  '6.7.2-P2': 'Eine Tabelle durch Verdoppeln und Halbieren ergänzen',
  '6.7.5-S1': 'Erkennen, ob die Punkte auf einer Geraden durch den Nullpunkt liegen',
  '6.7.5-S2': 'An einer Geraden durch den Nullpunkt einen Wert auf einer Gitterlinie ablesen',
  '6.7.6-R1': 'Die Dreisatztabelle mit vorgegebenen Rechenpfeilen ausfüllen',
  '6.7.6-R2': 'Eine Einkaufsaufgabe in der Dreisatztabelle mit vorgegebenen Rechenpfeilen lösen',
  '6.7.7-A1': 'Prüfen, ob zum Doppelten die Hälfte gehört',
  '6.7.7-A2': 'Eine Tabelle so ergänzen, dass das Produkt gleich bleibt',
  '6.7.8-U1': 'Die Dreisatztabelle mit der Gegenrechnung an den Rechenpfeilen ausfüllen',
  '6.7.8-U2': 'Entscheiden, ob zum Doppelten das Doppelte oder die Hälfte gehört',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T07).
export const bp67 = {
  '6.7.1-D1': 'FZ (1), (4)',
  '6.7.1-D2': 'FZ (3), (4), Wechsel zwischen Text, Tabelle und Schaubild ab M',
  '6.7.2-P1': 'FZ (1), (5)',
  '6.7.2-P2': 'FZ (4), (5)',
  '6.7.5-S1': 'FZ (4)',
  '6.7.5-S2': 'FZ (3), (4)',
  '6.7.6-R1': 'FZ (5), Dreisatz ab M',
  '6.7.6-R2': 'FZ (5), Dreisatz ab M',
  '6.7.7-A1': 'FZ (1), (5), antiproportional nur E',
  '6.7.7-A2': 'FZ (4), (5), antiproportional nur E',
  '6.7.8-U1': 'FZ (5), antiproportional nur E',
  '6.7.8-U2': 'FZ (1), (5), antiproportional nur E',
};
