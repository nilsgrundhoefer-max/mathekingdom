// Klasse 6, Kapitel 6 „Berechnungen am Quader“ (ADR 0049): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-25: fünf Meilensteine mit je zwei Lernzielen und 24 Aufgaben. 6.6 (Medienkompetenz) entfällt wie im ganzen Jahresplan.
// Das Buch setzt hier keine Marke M oder E: Alle Meilensteine haben Aufgaben auf allen vier Niveaustufen.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele66 = {
  1: {
    O1: 'Ich kann den Oberflächeninhalt von Quader und Würfel berechnen.',
    O2: 'Ich kann Sachaufgaben zum Oberflächeninhalt lösen und eine fehlende Kante bestimmen.',
  },
  2: {
    W1: 'Ich kann das Volumen eines Körpers durch Zählen von Einheitswürfeln bestimmen.',
    W2: 'Ich kann Volumen vergleichen und die Würfel eines Quaders in Schichten zählen.',
  },
  3: {
    U1: 'Ich kann Volumeneinheiten nennen und in die benachbarte Einheit umwandeln.',
    U2: 'Ich kann Liter und Milliliter umwandeln und Volumen über mehrere Einheiten umrechnen.',
  },
  4: {
    V1: 'Ich kann das Volumen von Quader und Würfel berechnen.',
    V2: 'Ich kann Sachaufgaben zum Volumen lösen und eine fehlende Kante bestimmen.',
  },
  5: {
    Z1: 'Ich kann das Volumen von Körpern berechnen, die aus Quadern zusammengesetzt sind.',
    Z2: 'Ich kann den Oberflächeninhalt von Körpern bestimmen, die aus Würfeln oder Quadern zusammengesetzt sind.',
  },
};

export const merkzettel66 = {
  '6.6.1': {
    regeln: [
      'Der Oberflächeninhalt O ist der Flächeninhalt aller sechs Flächen zusammen.',
      'Beim Quader sind je zwei Flächen gleich groß: Boden und Deckel, vorne und hinten, links und rechts.',
      'Rechne jede der drei Flächen aus, nimm sie mal 2 und addiere.',
      'Beim Würfel sind alle sechs Flächen gleich groß: O = 6 · a · a.',
      'Ab G: Formel für den Quader: O = 2 · (a · b + a · c + b · c).',
      'Die Einheit ist eine Flächeneinheit, zum Beispiel cm².',
    ],
    beispiel: 'Quader mit a = 5 cm, b = 4 cm, c = 2 cm: 5 cm · 4 cm = 20 cm², 5 cm · 2 cm = 10 cm², 4 cm · 2 cm = 8 cm². Zusammen 38 cm², mal 2 sind O = 76 cm².',
    heft: 'Zeichne ein Netz des Quaders und schreibe in jede Fläche ihren Flächeninhalt. So vergisst du keine Fläche.',
  },
  '6.6.2': {
    regeln: [
      'Das Volumen sagt, wie viel Platz ein Körper einnimmt. Ein anderes Wort ist Rauminhalt.',
      'Du misst das Volumen mit Einheitswürfeln: Wie viele gleich große Würfel passen hinein?',
      'Zähle auch die Würfel, die du nicht siehst. Unter jedem Würfel oben liegt ein Würfel.',
      'Ab G: Zähle in Schichten: Würfel in einer Reihe mal Reihen mal Schichten.',
      'Zwei Körper aus gleich vielen gleich großen Würfeln haben dasselbe Volumen, auch wenn sie anders aussehen.',
    ],
    beispiel: 'Ein Quader hat 4 Würfel in einer Reihe, 3 Reihen und 2 Schichten: 4 · 3 · 2 = 24 Würfel.',
    heft: 'Zeichne die unterste Schicht von oben als Kästchen und schreibe in jedes Kästchen, wie viele Würfel dort übereinander liegen.',
  },
  '6.6.3': {
    regeln: [
      'Volumeneinheiten: mm³, cm³, dm³, m³. Ein Würfel mit 1 cm Kante hat das Volumen 1 cm³.',
      'Die Umrechnungszahl ist 1000: 1 cm³ = 1000 mm³, 1 dm³ = 1000 cm³, 1 m³ = 1000 dm³.',
      'In die kleinere Einheit rechnest du mal 1000, in die größere Einheit durch 1000.',
      '1 Liter ist 1 dm³. 1 Milliliter ist 1 cm³. Also 1 l = 1000 ml.',
      'Ab M: 1 hl = 100 l.',
      'In der Einheitentafel hat jede Einheit drei Spalten.',
    ],
    beispiel: '3,5 l in ml: Die Einheit wird kleiner, also mal 1000. 3,5 l = 3500 ml.',
    heft: 'Zeichne eine Einheitentafel mit drei Spalten je Einheit und trage die Ziffern ein. Dann liest du jede Einheit ab.',
  },
  '6.6.4': {
    regeln: [
      'Volumen des Quaders: Länge mal Breite mal Höhe. V = a · b · c.',
      'Beim Würfel sind alle Kanten gleich lang: V = a · a · a.',
      'Alle Kanten müssen dieselbe Einheit haben. Wandle sonst zuerst um.',
      'Die Einheit ist eine Volumeneinheit: cm mal cm mal cm gibt cm³.',
      'Ab M: Fehlt eine Kante, teilst du das Volumen durch die beiden anderen Kanten.',
      'Ab M: Für Liter rechnest du in dm oder wandelst am Ende um: 1 dm³ = 1 l.',
    ],
    beispiel: 'Quader mit a = 5 cm, b = 4 cm, c = 2 cm: V = 5 cm · 4 cm · 2 cm = 40 cm³.',
    heft: 'Schreibe zuerst die Formel, setze dann die Zahlen mit Einheit ein und rechne zum Schluss.',
  },
  '6.6.5': {
    regeln: [
      'Zerlege den Körper in Quader. Berechne jedes Volumen und addiere.',
      'Jedes Stück des Körpers gehört zu genau einem Quader.',
      'Ab M: Manche Längen stehen nicht im Bild. Berechne sie aus den anderen Längen.',
      'Ab M: Zum Oberflächeninhalt gehören nur die Flächen, die außen liegen. Wo zwei Quader aneinanderstoßen, zählt nichts.',
      'Ab E: Manchmal ist es leichter, einen großen Quader zu rechnen und das fehlende Stück abzuziehen.',
    ],
    beispiel: 'Unten liegt ein Quader mit 6 cm · 4 cm · 2 cm = 48 cm³, darauf einer mit 2 cm · 4 cm · 3 cm = 24 cm³. Zusammen 48 cm³ + 24 cm³ = 72 cm³.',
    heft: 'Zeichne die Schnittlinie in deine Skizze und gib den Teilen Namen. Schreibe zu jedem Teil eine eigene Rechnung.',
  },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
export const wortspeicher66 = {
  '6.6.1': [
    w('Oberflächeninhalt', 'F', 'Der Flächeninhalt aller Flächen eines Körpers zusammen.'),
    w('Kante', 'F', 'Die Linie, an der zwei Flächen eines Körpers zusammenstoßen.'),
    w('Netz', 'F', 'Der aufgeklappte Körper: Alle Flächen liegen flach nebeneinander.'),
    w('Deckel', 'F', 'Die Fläche oben. Die Fläche unten heißt Boden.'),
    w('Formel', 'G', 'Eine Rechenvorschrift mit Buchstaben, zum Beispiel O = 6 · a · a.'),
    w('Grundfläche', 'M', 'Die Fläche, auf der ein Körper steht.'),
  ],
  '6.6.2': [
    w('Volumen', 'F', 'Wie viel Platz ein Körper einnimmt. Ein anderes Wort ist Rauminhalt.'),
    w('Einheitswürfel', 'F', 'Ein kleiner Würfel, mit dem du das Volumen misst, zum Beispiel mit 1 cm Kante.'),
    w('Würfelbau', 'F', 'Ein Körper, der aus gleich großen Würfeln gebaut ist.'),
    w('Schicht', 'G', 'Eine Lage Würfel, die nebeneinander auf gleicher Höhe liegen.'),
    w('volumengleich', 'M', 'Zwei Körper mit demselben Volumen sind volumengleich.'),
  ],
  '6.6.3': [
    w('Kubikzentimeter', 'F', 'Das Volumen eines Würfels mit 1 cm Kante. Kurz: cm³.'),
    w('Kubikdezimeter', 'F', 'Das Volumen eines Würfels mit 1 dm Kante. Kurz: dm³.'),
    w('Liter', 'F', 'Eine Einheit für Flüssigkeiten. 1 l ist so viel wie 1 dm³.'),
    w('Milliliter', 'F', 'Der tausendste Teil von einem Liter. 1 ml ist so viel wie 1 cm³.'),
    w('Einheitentafel', 'F', 'Eine Tabelle mit Spalten für jede Einheit. Beim Volumen hat jede Einheit drei Spalten.'),
    w('Umrechnungszahl', 'G', 'Die Zahl, mit der du beim Umwandeln malnimmst oder teilst. Beim Volumen ist es 1000.'),
    w('Hektoliter', 'M', 'Eine große Einheit für Flüssigkeiten: 1 hl = 100 l.'),
  ],
  '6.6.4': [
    w('Länge', 'F', 'Wie lang ein Quader von links nach rechts ist.'),
    w('Breite', 'F', 'Wie weit ein Quader nach hinten reicht.'),
    w('Höhe', 'F', 'Wie weit ein Quader nach oben reicht.'),
    w('Volumenformel', 'G', 'Die Formel für das Volumen des Quaders: V = a · b · c.'),
    w('Füllhöhe', 'M', 'Wie hoch eine Flüssigkeit in einem Gefäß steht.'),
  ],
  '6.6.5': [
    w('zusammengesetzter Körper', 'F', 'Ein Körper, der aus mehreren Quadern besteht.'),
    w('zerlegen', 'F', 'Einen Körper in Gedanken in einfache Quader teilen.'),
    w('Teilkörper', 'G', 'Einer der Quader, aus denen ein zusammengesetzter Körper besteht.'),
    w('Klebefläche', 'M', 'Die Fläche, an der zwei Teilkörper aneinanderstoßen. Sie liegt innen und gehört nicht zur Oberfläche.'),
  ],
};

// Voraussetzungen (Nils, 2026-11-25, Q12). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
export const voraussetzungen66 = {
  '6.6.1-O1': ['5.8.3-R1', '6.3.1-Q2'],
  '6.6.1-O2': ['6.6.1-O1'],
  '6.6.2-W1': ['6.3.8-K2'],
  '6.6.2-W2': ['6.6.2-W1'],
  '6.6.3-U1': ['5.8.2-H2', '6.5.2-S1'],
  '6.6.3-U2': ['6.6.3-U1'],
  '6.6.4-V1': ['6.6.2-W2', '6.5.3-M1'],
  '6.6.4-V2': ['6.6.4-V1', '6.6.3-U2'],
  '6.6.5-Z1': ['6.6.4-V1', '5.8.4-S1'],
  '6.6.5-Z2': ['6.6.5-Z1', '6.6.1-O1'],
};

export const grundlagen66 = {
  '6.6.1-O1': 'In einer Tabelle die drei Flächenpaare ausrechnen: jede Fläche, mal 2, dann die Summe',
  '6.6.1-O2': 'Die sechs Flächen einer Schachtel am Netz ausrechnen und addieren',
  '6.6.2-W1': 'Einheitswürfel zählen, wenn jeder Würfel zu sehen ist',
  '6.6.2-W2': 'Zwei Würfelbauten vergleichen: Welcher hat mehr Würfel?',
  '6.6.3-U1': 'In der Einheitentafel mit drei Spalten je Einheit umwandeln: 2 dm³ = 2000 cm³',
  '6.6.3-U2': 'Liter und Milliliter mit ganzen Zahlen umwandeln: 1 l = 1000 ml',
  '6.6.4-V1': 'Am Quader mit sichtbaren Einheitswürfeln rechnen: Länge mal Breite mal Höhe',
  '6.6.4-V2': 'Das Volumen einer Kiste mit ganzen Kantenlängen berechnen',
  '6.6.5-Z1': 'Zwei schon getrennt gefärbte Quader einzeln berechnen und die Volumen addieren',
  '6.6.5-Z2': 'Die Quadrate zählen, die bei einem Würfelbau außen liegen',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T06).
export const bp66 = {
  '6.6.1-O1': 'MES (15)',
  '6.6.1-O2': 'MES (8), (15), Umkehraufgaben nur E',
  '6.6.2-W1': 'MES (14)',
  '6.6.2-W2': 'MES (14)',
  '6.6.3-U1': 'MES (5)',
  '6.6.3-U2': 'MES (5)',
  '6.6.4-V1': 'MES (15)',
  '6.6.4-V2': 'MES (8), (15), Veränderung bei Vergrößerung FZ (6) nur E',
  '6.6.5-Z1': 'MES (15)',
  '6.6.5-Z2': 'MES (15), Oberflächeninhalt zusammengesetzter Körper ab M',
};
