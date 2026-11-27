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
    heft: 'Zeichne ein Netz des Quaders und schreibe in jede Fläche ihren Flächeninhalt. So vergisst du keine Fläche.',
  },
  '6.6.2': {
    heft: 'Zeichne die unterste Schicht von oben als Kästchen und schreibe in jedes Kästchen, wie viele Würfel dort übereinander liegen.',
  },
  '6.6.3': {
    heft: 'Zeichne eine Einheitentafel mit drei Spalten je Einheit und trage die Ziffern ein. Dann liest du jede Einheit ab.',
  },
  '6.6.4': {
    heft: 'Schreibe zuerst die Formel, setze dann die Zahlen mit Einheit ein und rechne zum Schluss.',
  },
  '6.6.5': {
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
