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
    regeln: [
      'Eine Zuordnung gibt zu jedem Wert einer Größe einen Wert einer zweiten Größe an. Du schreibst mit Pfeil: 2 Hefte → 3 €.',
      'Du kannst eine Zuordnung auf drei Arten zeigen: als Text, als Tabelle und als Schaubild.',
      'In der Tabelle stehen zusammengehörende Werte untereinander.',
      'Im Schaubild gehst du zuerst nach rechts und dann nach oben. An den Achsen steht, was gemessen wird.',
      'Ab G: Schau immer zuerst auf die Einteilung der Achsen. Ein Kästchen ist nicht immer 1 wert.',
    ],
    beispiel: 'Tabelle: Um 8 Uhr sind es 12 °C, um 10 Uhr sind es 16 °C. Im Schaubild liegen dazu die Punkte (8|12) und (10|16).',
    heft: 'Zeichne zuerst die Achsen mit dem Lineal. Schreibe an jede Achse die Größe mit Einheit und teile sie gleichmäßig ein.',
  },
  '6.7.2': {
    regeln: [
      'Proportional heißt: Zum Doppelten gehört das Doppelte, zum Dreifachen das Dreifache, zur Hälfte die Hälfte.',
      '„Je mehr, desto mehr“ reicht nicht. Ein Kind wird älter und größer, aber nicht doppelt so alt und doppelt so groß.',
      'In der Tabelle rechnest du oben und unten mit derselben Zahl mal oder geteilt.',
      'Ab M: Teile den unteren Wert durch den oberen. Kommt immer derselbe Quotient heraus, ist die Zuordnung proportional.',
      'Zu 0 gehört bei einer proportionalen Zuordnung immer 0.',
    ],
    beispiel: '2 Hefte → 3 €. Dann gilt: 4 Hefte → 6 € und 6 Hefte → 9 €. Der Quotient ist immer 1,5, denn 3 : 2 = 1,5 und 9 : 6 = 1,5.',
    heft: 'Schreibe die Rechenpfeile über und unter die Tabelle. So siehst du, ob oben und unten dasselbe gerechnet wird.',
  },
  '6.7.5': {
    regeln: [
      'Das Schaubild einer proportionalen Zuordnung ist eine Gerade durch den Nullpunkt (0|0).',
      'Bei Stückzahlen zeichnest du nur Punkte. Sie liegen auf einer Geraden durch den Nullpunkt.',
      'Eine Gerade, die nicht im Nullpunkt beginnt, gehört nicht zu einer proportionalen Zuordnung.',
      'Ablesen: Gehe vom Wert auf der Achse bis zur Geraden und von dort zur anderen Achse.',
      'Ab G: Achte auf die Einteilung. Lies an beiden Achsen ab, wie viel ein Kästchen wert ist.',
    ],
    beispiel: '1 kg Äpfel kostet 2 €. Die Punkte (1|2), (2|4) und (3|6) liegen auf einer Geraden durch den Nullpunkt.',
    heft: 'Trage zwei oder drei Punkte genau ein und lege das Lineal an. Geht die Gerade durch den Nullpunkt?',
  },
  '6.7.6': {
    regeln: [
      'Der Dreisatz hat drei Zeilen. Erste Zeile: das Wertepaar aus der Aufgabe.',
      'Zweite Zeile: Rechne auf 1 zurück. Teile dazu beide Seiten durch dieselbe Zahl.',
      'Dritte Zeile: Rechne auf den gesuchten Wert hoch. Nimm beide Seiten mit derselben Zahl mal.',
      'Die zweite Zeile ist nur ein Zwischenschritt. Die Antwort steht in der dritten Zeile.',
      'Ab M: Manchmal ist ein anderer Zwischenschritt leichter: von 6 kg über 3 kg auf 9 kg.',
      'Der Dreisatz gilt nur, wenn die Zuordnung proportional ist.',
    ],
    beispiel: '4 kg Kartoffeln kosten 6 €. Für 1 kg: 6 € : 4 = 1,50 €. Für 7 kg: 1,50 € · 7 = 10,50 €.',
    heft: 'Schreibe die drei Zeilen untereinander und die Rechenpfeile an beide Seiten. Schreibe zum Schluss einen Antwortsatz.',
  },
  '6.7.7': {
    regeln: [
      'Antiproportional heißt: Zum Doppelten gehört die Hälfte, zum Dreifachen ein Drittel, zur Hälfte das Doppelte.',
      'Das Produkt zusammengehörender Werte bleibt immer gleich.',
      '„Je mehr, desto weniger“ reicht nicht. Prüfe das Produkt.',
      'Im Schaubild liegen die Punkte auf einer Kurve, die fällt und immer flacher wird. Sie trifft keine Achse.',
    ],
    beispiel: '3 Pumpen → 8 h. Dann gilt: 6 Pumpen → 4 h und 1 Pumpe → 24 h. Das Produkt ist immer 24, denn 3 · 8 = 24 und 6 · 4 = 24.',
    heft: 'Schreibe unter jedes Wertepaar der Tabelle das Produkt. Ist es überall gleich, ist die Zuordnung antiproportional.',
  },
  '6.7.8': {
    regeln: [
      'Auch bei antiproportionalen Zuordnungen rechnest du in drei Zeilen über die 1.',
      'Die Rechenpfeile zeigen die Gegenrechnung: Links geteilt, rechts mal. Links mal, rechts geteilt.',
      'Entscheide zuerst: proportional, antiproportional oder keines von beiden? Erst dann rechnest du.',
      'Probe: Bei antiproportionalen Zuordnungen ist das Produkt in jeder Zeile gleich.',
      'Bei keinem von beiden hilft kein Dreisatz. Rechne dann so, wie der Text es beschreibt.',
    ],
    beispiel: '3 Pumpen brauchen 8 h. 1 Pumpe braucht 8 h · 3 = 24 h. 4 Pumpen brauchen 24 h : 4 = 6 h.',
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
    w('Gerade', 'F', 'Eine gerade Linie ohne Knick.'),
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
