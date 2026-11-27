// Klasse 6, Kapitel 3 „Körper“ (ADR 0045): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen und Grundlagen.
// Grilling mit Nils, 2026-11-25: sieben Meilensteine mit je zwei Lernzielen. 3.7 (Medienkompetenz) entfällt wie im ganzen Jahresplan.
// Schrägbild und Ansichten (3.2, 3.3) sind Pflicht ab Gold (M), haben aber Aufgaben auf allen Stufen.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele3 = {
  1: {
    Q1: 'Ich kann Quader und Würfel beschreiben: Ecken, Kanten und Flächen zählen und ihre Lage angeben.',
    Q2: 'Ich kann Netze von Würfel und Quader erkennen, ergänzen und prüfen.',
  },
  2: {
    S1: 'Ich kann Schrägbilder von Quadern lesen: sichtbare und verdeckte Kanten, Ecken und Maße.',
    S2: 'Ich kann Schrägbilder von Quadern im Gitter vervollständigen und zeichnen.',
  },
  3: {
    A1: 'Ich kann Ansichten von vorne, von oben und von der Seite einem Körper zuordnen.',
    A2: 'Ich kann Ansichten von Würfelbauten und Quadern im Gitter zeichnen.',
  },
  4: {
    P1: 'Ich kann Prismen erkennen und benennen und ihre Ecken, Kanten und Flächen zählen.',
    P2: 'Ich kann Netze von Prismen erkennen und prüfen.',
  },
  5: {
    Y1: 'Ich kann Pyramiden erkennen und benennen und ihre Ecken, Kanten und Flächen zählen.',
    Y2: 'Ich kann Netze von Pyramiden erkennen und prüfen.',
  },
  6: {
    R1: 'Ich kann Zylinder, Kegel und Kugel erkennen, auch an Gegenständen aus dem Alltag.',
    R2: 'Ich kann Netze von Zylinder und Kegel erkennen und Körper nach ihren Eigenschaften ordnen.',
  },
  8: {
    K1: 'Ich kann Würfelnetze im Kopf falten und gegenüberliegende Flächen finden.',
    K2: 'Ich kann mir Würfelbauten vorstellen: Würfel zählen, Ansichten finden und kippen.',
  },
};

export const merkzettel3 = {
  '6.3.1': {
    heft: 'Zeichne ein Netz mit dem Lineal auf Karopapier. Gleich lange Kanten müssen im Netz aneinanderliegen.',
  },
  '6.3.2': {
    heft: 'Zeichne zuerst die Vorderfläche, dann die Kanten nach hinten, zuletzt die Rückfläche. Verdeckte Kanten zeichnest du gestrichelt.',
  },
  '6.3.3': {
    heft: 'Zeichne die Ansicht von vorne oben und die Ansicht von oben darunter. Gleiche Breiten stehen genau untereinander.',
  },
  '6.3.4': {
    heft: 'Zeichne im Netz die Grund- und die Deckfläche an gegenüberliegende Seiten des Rechteckstreifens.',
  },
  '6.3.5': {
    heft: 'Zeichne zuerst die Grundfläche. Setze dann an jede Seite ein Dreieck.',
  },
  '6.3.6': {
    heft: 'Zeichne im Zylindernetz die Kreise an die langen Seiten des Rechtecks, einen oben und einen unten.',
  },
  '6.3.8': {
    heft: 'Schreibe in jede Fläche des Netzes einen Buchstaben. Markiere gegenüberliegende Flächen mit derselben Farbe.',
  },
};

export const wortspeicher3 = {
  '6.3.1': [
    w('Ecke', 'F', 'Ein Punkt, an dem Kanten zusammenstoßen.'),
    w('Kante', 'F', 'Eine Linie, an der zwei Flächen zusammenstoßen.'),
    w('Fläche', 'F', 'Eine Seite des Körpers. Beim Quader ist jede Fläche ein Rechteck.'),
    w('Würfel', 'F', 'Ein Quader mit 12 gleich langen Kanten. Alle Flächen sind Quadrate.'),
    w('Quader', 'F', 'Ein Körper mit 6 rechteckigen Flächen, 8 Ecken und 12 Kanten.'),
    w('Netz', 'F', 'Der aufgeklappte Körper. Faltest du das Netz, entsteht der Körper.'),
    w('Kantenlänge', 'G', 'Wie lang eine Kante ist. Beim Würfel haben alle Kanten dieselbe Kantenlänge.'),
    w('Kantenmodell', 'M', 'Ein Körper nur aus Kanten, zum Beispiel aus Draht oder Strohhalmen.'),
    w('Raumdiagonale', 'E', 'Eine Strecke von einer Ecke zur gegenüberliegenden Ecke quer durch den Körper.'),
  ],
  '6.3.2': [
    w('gestrichelt', 'F', 'Eine Linie aus kurzen Strichen mit Lücken. So zeichnest du Kanten, die man nicht sieht.'),
    w('Vorderfläche', 'F', 'Die Fläche, die vorne liegt. Im Schrägbild hat sie ihre wahre Größe.'),
    w('Schrägbild', 'G', 'Eine Zeichnung, die den Körper räumlich zeigt. Kanten nach hinten laufen schräg.'),
    w('verdeckte Kante', 'G', 'Eine Kante, die von vorne nicht zu sehen ist. Sie wird gestrichelt gezeichnet.'),
    w('Kästchendiagonale', 'M', 'Die schräge Strecke quer durch ein Kästchen. Im Schrägbild steht sie für 1 cm Tiefe.'),
  ],
  '6.3.3': [
    w('Ansicht', 'F', 'Wie ein Körper von einer Seite aussieht, zum Beispiel von vorne oder von oben.'),
    w('Grundriss', 'G', 'Die Ansicht von oben.'),
    w('Aufriss', 'G', 'Die Ansicht von vorne.'),
    w('Seitenriss', 'M', 'Die Ansicht von der Seite. Hier ist es immer die Ansicht von links.'),
  ],
  '6.3.4': [
    w('Rechteck', 'F', 'Ein Viereck mit vier rechten Winkeln. Die Seiten eines Prismas sind Rechtecke.'),
    w('Prisma', 'G', 'Ein Körper mit zwei gleichen Vielecken oben und unten und Rechtecken an den Seiten.'),
    w('Grundfläche', 'G', 'Die Fläche, auf der ein Körper steht. Nach ihr bekommt der Körper seinen Namen.'),
    w('Mantelfläche', 'M', 'Alle Seitenflächen zusammen, ohne Grund- und Deckfläche.'),
  ],
  '6.3.5': [
    w('Dreieck', 'F', 'Eine Fläche mit drei Ecken und drei Seiten. Die Seiten einer Pyramide sind Dreiecke.'),
    w('Pyramide', 'G', 'Ein Körper mit einem Vieleck als Grundfläche und Dreiecken, die sich in einer Spitze treffen.'),
    w('Spitze', 'G', 'Die Ecke ganz oben, in der sich die Dreiecke einer Pyramide oder die Fläche eines Kegels treffen.'),
    w('Seitendreieck', 'M', 'Eine der dreieckigen Seitenflächen einer Pyramide.'),
  ],
  '6.3.6': [
    w('Zylinder', 'F', 'Ein Körper mit zwei Kreisen oben und unten und einer gekrümmten Fläche, wie eine Dose.'),
    w('Kegel', 'F', 'Ein Körper mit einem Kreis unten und einer Spitze oben, wie eine Eistüte.'),
    w('Kugel', 'F', 'Ein runder Körper ohne Ecke und ohne Kante, wie ein Ball.'),
    w('gekrümmte Fläche', 'G', 'Eine Fläche, die nicht eben ist. Ein Ball rollt auf ihr.'),
    w('Kreisausschnitt', 'M', 'Ein Stück eines Kreises, wie ein Stück Torte. Daraus wird die gekrümmte Fläche des Kegels.'),
  ],
  '6.3.8': [
    w('Würfelbau', 'F', 'Ein Körper aus gleich großen Würfeln.'),
    w('falten', 'F', 'Ein Netz an den Kanten knicken, bis der Körper entsteht.'),
    w('Würfelnetz', 'G', 'Ein Netz, aus dem sich ein Würfel falten lässt. Es gibt 11 verschiedene.'),
    w('gegenüber', 'G', 'Zwei Flächen liegen gegenüber, wenn sie sich beim Würfel nicht berühren.'),
    w('kippen', 'M', 'Einen Körper über eine Kante auf eine andere Fläche legen.'),
  ],
};

export const voraussetzungen3 = {
  '6.3.1-Q1': ['5.5.7-V1', '5.5.3-P1'],
  '6.3.1-Q2': ['6.3.1-Q1', '5.5.7-V1'],
  '6.3.2-S1': ['6.3.1-Q1', '5.5.3-P1'],
  '6.3.2-S2': ['6.3.2-S1'],
  '6.3.3-A1': ['6.3.1-Q1'],
  '6.3.3-A2': ['6.3.3-A1'],
  '6.3.4-P1': ['6.3.1-Q1', '5.7.X2-D1'],
  '6.3.4-P2': ['6.3.4-P1', '6.3.1-Q2'],
  '6.3.5-Y1': ['6.3.4-P1'],
  '6.3.5-Y2': ['6.3.5-Y1', '6.3.4-P2'],
  '6.3.6-R1': ['5.7.1-R1'],
  '6.3.6-R2': ['6.3.6-R1', '6.3.1-Q2'],
  '6.3.8-K1': ['6.3.1-Q2'],
  '6.3.8-K2': ['6.3.3-A1', '6.3.1-Q1'],
};

export const grundlagen3 = {
  '6.3.1-Q1': 'Am Bild eines Würfels die Ecken, Kanten und Flächen zählen und abhaken',
  '6.3.1-Q2': 'Ein Kreuznetz aus sechs Quadraten erkennen und ein fehlendes Quadrat ergänzen',
  '6.3.2-S1': 'Im Schrägbild sichtbare und gestrichelte Kanten unterscheiden',
  '6.3.2-S2': 'Im Gitter eine fehlende Kante eines Würfels nachzeichnen',
  '6.3.3-A1': 'Zu einem Würfelbau die Ansicht von vorne aus drei Bildern auswählen',
  '6.3.3-A2': 'Die Ansicht von vorne eines Würfelbaus aus einer Reihe Kästchen färben',
  '6.3.4-P1': 'Am Bild eines Zelts die Flächen zählen und die Form der Seiten nennen',
  '6.3.4-P2': 'Im Netz eines Zelts die Dreiecke und Rechtecke zählen',
  '6.3.5-Y1': 'Am Bild eines Dachs die Dreiecke und die Spitze zeigen',
  '6.3.5-Y2': 'Im Netz einer Pyramide die Dreiecke um das Quadrat zählen',
  '6.3.6-R1': 'Gegenstände wie Dose, Eistüte und Ball dem passenden Körper zuordnen',
  '6.3.6-R2': 'Zählen, wie viele Kreise das Netz einer Dose hat',
  '6.3.8-K1': 'Im Kreuznetz eine Fläche festhalten und die Nachbarn hochklappen',
  '6.3.8-K2': 'Würfel eines kleinen Würfelbaus Schicht für Schicht zählen',
};

// Bildungsplan 2016, Standards der Klassen 5/6 (ADR 0045). Quelle: Niveauübersicht der Lehrkraft (docs/quellen/niveaustufen-klasse-6.md).
// Leitidee Zahl – Variable – Operation (ZVO) und Raum und Form (RF). „ab M“ heißt: Dieser Teil des Standards ist erst ab Gold verbindlich.
export const bp6 = {
  '6.1.1-B1': 'ZVO (5), (6)',
  '6.1.1-B2': 'ZVO (5), (6)',
  '6.1.2-W1': 'ZVO (16)',
  '6.1.2-W2': 'ZVO (16)',
  '6.1.3-K1': 'ZVO (16), Teilbarkeit ZVO (3)',
  '6.1.3-K2': 'ZVO (16), Teilbarkeit ZVO (3)',
  '6.1.4-V1': 'ZVO (7)',
  '6.1.4-V2': 'ZVO (7), (16)',
  '6.1.5-T1': 'ZVO (5), Bruch als Operator ab M',
  '6.1.5-T2': 'ZVO (5), Aspekt Verhältnis nur E',
  '6.1.6-Z1': 'ZVO (7)',
  '6.1.6-Z2': 'ZVO (7), Brüche zwischen Brüchen ZVO (9) ab M',
  '6.2.1-A1': 'ZVO (18)',
  '6.2.1-A2': 'ZVO (18)',
  '6.2.2-U1': 'ZVO (18)',
  '6.2.2-U2': 'ZVO (18)',
  '6.2.3-V1': 'ZVO (17)',
  '6.2.3-V2': 'ZVO (17)',
  '6.2.4-T1': 'ZVO (17)',
  '6.2.4-T2': 'ZVO (17)',
  '6.2.5-P1': 'ZVO (18)',
  '6.2.5-P2': 'ZVO (18)',
  '6.2.6-D1': 'ZVO (18), Division durch einen Bruch ab M',
  '6.2.6-D2': 'ZVO (18), Division durch einen Bruch ab M',
  '6.2.7-R1': 'ZVO (18), (26)',
  '6.2.7-R2': 'ZVO (18), (26)',
  '6.3.1-Q1': 'RF (7)',
  '6.3.1-Q2': 'RF (14), (15)',
  '6.3.2-S1': 'RF (14)',
  '6.3.2-S2': 'RF (14), Zeichnen ab M',
  '6.3.3-A1': 'RF (14)',
  '6.3.3-A2': 'RF (14), Zeichnen ab M',
  '6.3.4-P1': 'RF (7)',
  '6.3.4-P2': 'RF (14), (15)',
  '6.3.5-Y1': 'RF (7)',
  '6.3.5-Y2': 'RF (14), (15)',
  '6.3.6-R1': 'RF (7)',
  '6.3.6-R2': 'RF (7), (14)',
  '6.3.8-K1': 'RF (15)',
  '6.3.8-K2': 'RF (14), (15)',
};
