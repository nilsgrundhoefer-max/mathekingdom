// Jahresplan Klasse 6 nach Schnittpunkt Mathematik 6, Differenzierende Ausgabe Baden-Württemberg (ISBN 978-3-12-745361-4).
// Quelle und Erläuterungen: docs/jahresplan-klasse-6.md und ADR 0037.
// Die Nummern der Unterkapitel stehen wie im Buch. Lerneinheiten mit der Marke MK (Medienkompetenz) fehlen, deshalb gibt es Lücken.
// `ab`: Marke M oder E des Buchs (Niveau-Meilenstein, ADR 0037). Das Dashboard wertet sie aus, sobald es dazu Aufgaben gibt.

import { merkzettel2, wortspeicher2, voraussetzungen2, grundlagen2 } from './jahresplan-6-2.mjs';
import { lernziele3, merkzettel3, wortspeicher3, voraussetzungen3, grundlagen3, bp6 } from './jahresplan-6-3.mjs';

// `pflicht` (ADR 0044, 0045): Ein Meilenstein ist erst ab dieser Stufe verbindlich, hat aber Aufgaben auf allen Stufen.
// `bp`: der Standard im Bildungsplan 2016 je Lernziel (ADR 0045, Quelle docs/quellen/niveaustufen-klasse-6.md).
const uk = (nr, titel, lernziele, ab = null, { pflicht = null } = {}) => ({ nr, titel, lernziele, ab, pflicht });

const roh = [
  ['Brüche', [
    // Feinere Lernziele (Nils, 2026-11-24). Die Kürzel meiden F, G, M und E, damit sie nicht mit einer Niveaustufe verwechselt werden.
    uk(1, 'Brüche', {
      B1: 'Ich kann Bruchteile an Bildern erkennen und darstellen, auch wenn sie größer als ein Ganzes sind.',
      B2: 'Ich kann gemischte Zahlen und Brüche ineinander umwandeln.',
    }),
    uk(2, 'Brüche erweitern', {
      W1: 'Ich kann einen Bruch mit einer gegebenen Zahl erweitern.',
      W2: 'Ich kann einen Bruch auf einen gegebenen Nenner erweitern und gleichwertige Brüche erkennen.',
    }),
    uk(3, 'Brüche kürzen', {
      K1: 'Ich kann einen Bruch mit einer gegebenen Zahl kürzen.',
      K2: 'Ich kann einen Bruch vollständig kürzen.',
    }),
    uk(4, 'Brüche vergleichen und ordnen', {
      V1: 'Ich kann Brüche mit gleichem Nenner oder gleichem Zähler vergleichen.',
      V2: 'Ich kann Brüche mit verschiedenen Nennern vergleichen und ordnen.',
    }),
    uk(5, 'Brüche und Größen', {
      T1: 'Ich kann den Bruchteil einer Größe berechnen.',
      T2: 'Ich kann vom Bruchteil auf das Ganze schließen und Anteile als Bruch angeben.',
    }),
    uk(6, 'Brüche am Zahlenstrahl', {
      Z1: 'Ich kann Brüche am Zahlenstrahl ablesen.',
      Z2: 'Ich kann Brüche am Zahlenstrahl eintragen.',
    }),
  ]],
  ['Rechnen mit Brüchen', [
    // Feinere Lernziele (Nils, 2026-11-24, ADR 0038). 2.6 trägt im Buch die Marke M: ein Niveau-Meilenstein mit Aufgaben nur auf M und E.
    uk(1, 'Gleichnamige Brüche addieren und subtrahieren', {
      A1: 'Ich kann gleichnamige Brüche addieren und subtrahieren.',
      A2: 'Ich kann gemischte Zahlen mit gleichem Nenner addieren und subtrahieren und zum Ganzen ergänzen.',
    }),
    uk(2, 'Ungleichnamige Brüche addieren und subtrahieren', {
      U1: 'Ich kann ungleichnamige Brüche addieren und subtrahieren, wenn ein Nenner ein Vielfaches des anderen ist.',
      U2: 'Ich kann zu ungleichnamigen Brüchen einen gemeinsamen Nenner finden und sie dann addieren und subtrahieren.',
    }),
    uk(3, 'Brüche vervielfachen', {
      V1: 'Ich kann einen Bruch mit einer natürlichen Zahl multiplizieren.',
      V2: 'Ich kann gemischte Zahlen vervielfachen und Sachaufgaben dazu lösen.',
    }),
    uk(4, 'Brüche teilen', {
      T1: 'Ich kann einen Bruch durch eine natürliche Zahl dividieren.',
      T2: 'Ich kann Sachaufgaben lösen, in denen ein Bruchteil gerecht verteilt wird.',
    }),
    uk(5, 'Brüche multiplizieren', {
      P1: 'Ich kann Brüche miteinander multiplizieren und dabei vorher kürzen.',
      P2: 'Ich kann den Bruchteil von einem Bruchteil bestimmen und Sachaufgaben dazu lösen.',
    }),
    uk(6, 'Brüche dividieren', {
      D1: 'Ich kann durch einen Bruch dividieren.',
      D2: 'Ich kann mit gemischten Zahlen dividieren und Sachaufgaben dazu lösen.',
    }, 'M'),
    uk(7, 'Punkt vor Strich und Klammern', {
      R1: 'Ich kann beim Rechnen mit Brüchen die Regel „Punkt vor Strich“ anwenden.',
      R2: 'Ich kann Rechenausdrücke mit Brüchen und Klammern berechnen und geschickt rechnen.',
    }),
  ]],
  ['Körper', [
    // Feinere Lernziele (Nils, 2026-11-25, ADR 0045). 3.2 und 3.3 sind Pflicht ab Gold.
    uk(1, 'Quader und ihre Netze', lernziele3[1]),
    uk(2, 'Schrägbilder von Quadern', lernziele3[2], null, { pflicht: 'M' }),
    uk(3, 'Grundriss und Aufriss', lernziele3[3], null, { pflicht: 'M' }),
    uk(4, 'Prisma', lernziele3[4]),
    uk(5, 'Pyramide', lernziele3[5]),
    uk(6, 'Zylinder, Kegel und Kugel', lernziele3[6]),
    uk(8, 'Kopfgeometrie im Raum', lernziele3[8]),
  ]],
  ['Dezimalzahlen', [
    uk(1, 'Dezimalschreibweise', ['Ich kann Dezimalzahlen lesen, schreiben und in die Stellenwerttafel eintragen.']),
    uk(2, 'Dezimalzahlen vergleichen und ordnen', ['Ich kann Dezimalzahlen vergleichen, ordnen und am Zahlenstrahl darstellen.']),
    uk(3, 'Dezimalzahlen runden', ['Ich kann Dezimalzahlen und Größen sinnvoll runden.']),
    uk(5, 'Umwandeln durch Erweitern und Kürzen', ['Ich kann Brüche durch Erweitern oder Kürzen in Dezimalzahlen umwandeln und umgekehrt.']),
    uk(6, 'Umwandeln durch Dividieren', ['Ich kann einen Bruch durch Dividieren in eine Dezimalzahl umwandeln, auch in eine periodische.'], 'M'),
    uk(7, 'Dezimalzahlen, Brüche und Prozentangaben', ['Ich kann Anteile als Bruch, Dezimalzahl und in Prozent angeben.']),
  ]],
  ['Rechnen mit Dezimalzahlen', [
    uk(1, 'Dezimalzahlen addieren und subtrahieren', ['Ich kann Dezimalzahlen im Kopf und schriftlich addieren und subtrahieren.']),
    uk(2, 'Mit Stufenzahlen multiplizieren und dividieren', ['Ich kann Dezimalzahlen mit Stufenzahlen multiplizieren und durch sie dividieren.']),
    uk(3, 'Dezimalzahlen multiplizieren', ['Ich kann Dezimalzahlen multiplizieren und das Ergebnis mit einem Überschlag prüfen.']),
    uk(4, 'Dezimalzahlen dividieren', ['Ich kann Dezimalzahlen dividieren und das Ergebnis mit einem Überschlag prüfen.']),
    uk(5, 'Verbindung der Rechenarten', ['Ich kann beim Rechnen mit Dezimalzahlen die Rechenregeln anwenden und geschickt rechnen.']),
  ]],
  ['Berechnungen am Quader', [
    uk(1, 'Oberflächeninhalt des Quaders', ['Ich kann den Oberflächeninhalt von Quader und Würfel berechnen.']),
    uk(2, 'Volumen vergleichen', ['Ich kann Volumen durch Auszählen von Einheitswürfeln bestimmen und vergleichen.']),
    uk(3, 'Volumeneinheiten', ['Ich kann Volumeneinheiten umwandeln, auch Liter und Milliliter.']),
    uk(4, 'Volumen des Quaders', ['Ich kann das Volumen von Quader und Würfel berechnen.']),
    uk(5, 'Zusammengesetzte Körper', ['Ich kann Volumen und Oberflächeninhalt von Körpern berechnen, die aus Quadern zusammengesetzt sind.']),
  ]],
  ['Zuordnungen', [
    uk(1, 'Zuordnungen und ihre Darstellungen', ['Ich kann Zuordnungen in Tabelle, Schaubild und Text lesen und ineinander überführen.']),
    uk(2, 'Proportionale Zuordnungen', ['Ich kann proportionale Zuordnungen erkennen und Tabellen dazu ergänzen.']),
    uk(5, 'Schaubilder proportionaler Zuordnungen', ['Ich kann proportionale Zuordnungen am Schaubild erkennen und Werte ablesen.']),
    uk(6, 'Dreisatz', ['Ich kann Sachaufgaben mit dem Dreisatz lösen.']),
    uk(7, 'Antiproportionale Zuordnungen', ['Ich kann antiproportionale Zuordnungen erkennen und Tabellen dazu ergänzen.'], 'E'),
    uk(8, 'Dreisatz bei antiproportionalen Zuordnungen', ['Ich kann den Dreisatz bei antiproportionalen Zuordnungen anwenden und entscheiden, welche Zuordnung vorliegt.'], 'E'),
  ]],
  ['Daten auswerten und darstellen', [
    uk(1, 'Daten erheben und Stichproben auswählen', ['Ich kann beurteilen, wie Daten erhoben werden und ob eine Stichprobe geeignet ist.']),
    uk(2, 'Daten mithilfe von Kenngrößen auswerten', ['Ich kann Minimum, Maximum, Spannweite, Mittelwert und Zentralwert bestimmen und deuten.']),
    uk(4, 'Absolute und relative Häufigkeit', ['Ich kann absolute und relative Häufigkeiten bestimmen und als Bruch, Dezimalzahl oder in Prozent angeben.']),
    uk(5, 'Kreis- und Streifendiagramme lesen', ['Ich kann Anteile aus Kreis- und Streifendiagrammen ablesen.']),
    uk(6, 'Daten darstellen', ['Ich kann Daten in einem passenden Diagramm darstellen, auch im Streifen- und Kreisdiagramm.'], 'M'),
  ]],
  ['Rationale Zahlen', [
    uk(1, 'Ganze Zahlen', ['Ich kann ganze Zahlen an der Zahlengerade darstellen und im Sachzusammenhang deuten.']),
    uk(2, 'Rationale Zahlen', ['Ich kann negative Brüche und Dezimalzahlen an der Zahlengerade darstellen und deuten.']),
    uk(3, 'Rationale Zahlen vergleichen und ordnen', ['Ich kann rationale Zahlen vergleichen und ordnen.']),
    uk(4, 'Zunahme und Abnahme', ['Ich kann Zunahmen und Abnahmen an der Zahlengerade und im Sachzusammenhang berechnen.']),
    uk(5, 'Rationale Zahlen addieren und subtrahieren', ['Ich kann rationale Zahlen addieren und subtrahieren.'], 'E'),
    uk(6, 'Rationale Zahlen multiplizieren und dividieren', ['Ich kann rationale Zahlen multiplizieren und dividieren.'], 'E'),
  ]],
  ['Flächenberechnungen', [
    uk(1, 'Dreieck', ['Ich kann den Flächeninhalt von Dreiecken berechnen.'], 'E'),
    uk(2, 'Parallelogramm', ['Ich kann den Flächeninhalt von Parallelogrammen berechnen.'], 'E'),
    uk(3, 'Trapez', ['Ich kann den Flächeninhalt von Trapezen berechnen.'], 'E'),
    uk(4, 'Kreis', ['Ich kann Umfang und Flächeninhalt von Kreisen berechnen.'], 'E'),
    uk(5, 'Zusammengesetzte Figuren', ['Ich kann den Flächeninhalt zusammengesetzter Figuren berechnen.'], 'E'),
  ]],
];

// Merkzettel je Unterkapitel: Regeln, ein Beispiel und ein Satz für das Heft.
export const merkzettel = {
  '6.1.1': {
    regeln: [
      'Ein Bruch nennt einen Teil vom Ganzen. Der Nenner sagt, in wie viele gleich große Teile das Ganze geteilt ist. Der Zähler zählt die Teile.',
      'Ist der Zähler so groß wie der Nenner, ist es genau ein Ganzes: 4⁄4 = 1.',
      'Ist der Zähler größer als der Nenner, ist es mehr als ein Ganzes: 5⁄4.',
      'Mehr als ein Ganzes schreibst du auch als gemischte Zahl: 5⁄4 = 1 1⁄4.',
      'Von der gemischten Zahl zum Bruch: Ganze mal Nenner, dann den Zähler dazu. 2 3⁄4 = 11⁄4, denn 2 · 4 + 3 = 11.',
      'Vom Bruch zur gemischten Zahl: Teile den Zähler durch den Nenner. Das Ergebnis sind die Ganzen, der Rest bleibt als Zähler.',
    ],
    beispiel: 'Drei Kinder essen zusammen 7 Viertel Pizza. Das sind 7⁄4 = 1 3⁄4 Pizzen: eine ganze Pizza und noch drei Viertel.',
    heft: 'Zeichne den Bruchstrich mit dem Lineal. Bei einer gemischten Zahl stehen die Ganzen groß vor dem Bruch.',
  },
  '6.1.2': {
    regeln: [
      'Erweitern heißt: Zähler und Nenner mit derselben Zahl malnehmen.',
      'Der Wert des Bruchs bleibt gleich. Es sind nur mehr und kleinere Teile.',
      '3⁄4 mit 2 erweitert ist 6⁄8, denn 3 · 2 = 6 und 4 · 2 = 8.',
      'Ab G: Suchst du einen bestimmten Nenner, dann überlege: Mit welcher Zahl muss ich den alten Nenner malnehmen?',
      'Ab G: Brüche mit gleichem Wert heißen gleichwertig.',
    ],
    beispiel: 'Eine halbe Pizza ist genauso viel wie zwei Viertel oder vier Achtel: 1⁄2 = 2⁄4 = 4⁄8.',
    heft: 'Schreibe die Zahl, mit der du erweiterst, klein über das Gleichheitszeichen.',
  },
  '6.1.3': {
    regeln: [
      'Kürzen heißt: Zähler und Nenner durch dieselbe Zahl teilen.',
      'Der Wert des Bruchs bleibt gleich. Es sind nur weniger und größere Teile.',
      '6⁄8 mit 2 gekürzt ist 3⁄4, denn 6 : 2 = 3 und 8 : 2 = 4.',
      'Kürze so weit wie möglich. Du darfst auch in mehreren Schritten kürzen.',
      'Durch 2 geht es bei geraden Zahlen. Durch 5 geht es, wenn hinten 0 oder 5 steht. Durch 10 geht es, wenn hinten 0 steht.',
      'Ab G: Durch 3 geht es, wenn die Quersumme durch 3 teilbar ist.',
    ],
    beispiel: '12⁄18 in zwei Schritten: erst mit 2 gekürzt 6⁄9, dann mit 3 gekürzt 2⁄3. Weiter geht es nicht.',
    heft: 'Schreibe jeden Schritt hin. Ein Ergebnis ist erst fertig, wenn du nicht mehr kürzen kannst.',
  },
  '6.1.4': {
    regeln: [
      'Gleicher Nenner: Der Bruch mit dem größeren Zähler ist größer. 5⁄8 ist größer als 3⁄8.',
      'Gleicher Zähler: Der Bruch mit dem kleineren Nenner ist größer, denn seine Teile sind größer. 3⁄4 ist größer als 3⁄8.',
      'Ab G: Verschiedene Nenner: Erweitere so, dass beide Brüche denselben Nenner haben. Vergleiche dann die Zähler.',
      'Ab M: Brüche mit gleichem Nenner heißen gleichnamig.',
      'Ab E: Manchmal geht es schneller: Vergleiche mit 1⁄2 oder mit 1, oder schau, wie viel bis zum Ganzen fehlt.',
    ],
    beispiel: '2⁄3 oder 3⁄4? Mit dem Nenner 12 sind es 8⁄12 und 9⁄12. Also ist 3⁄4 größer.',
    heft: 'Schreibe die erweiterten Brüche unter die alten. Setze erst dann das Zeichen < oder >.',
  },
  '6.1.5': {
    regeln: [
      'Einen Bruchteil einer Größe berechnest du in zwei Schritten: erst durch den Nenner teilen, dann mit dem Zähler malnehmen.',
      'Geht es nicht auf, wandle zuerst in eine kleinere Einheit um: 3⁄4 km sind 3⁄4 von 1000 m.',
      'Rückwärts zum Ganzen: Teile den Bruchteil durch den Zähler. So groß ist ein Teil. Nimm dann mit dem Nenner mal.',
      'Ein Anteil ist ein Bruch: Teil durch Ganzes. 15 von 20 Kindern sind 15⁄20 = 3⁄4.',
    ],
    beispiel: '3⁄4 von 2 km: 2 km = 2000 m, dann 2000 m : 4 = 500 m und 500 m · 3 = 1500 m.',
    heft: 'Schreibe beide Schritte untereinander. Vergiss die Einheit nicht.',
  },
  '6.1.6': {
    regeln: [
      'Am Zahlenstrahl sagt der Nenner, in wie viele gleich große Abstände die Strecke von 0 bis 1 geteilt ist.',
      'Zähle die Abstände, nicht die Striche.',
      'Der Zähler sagt, wie viele Abstände du von 0 aus gehst.',
      'Brüche, die größer als 1 sind, liegen rechts von der 1.',
      'Gleichwertige Brüche liegen an derselben Stelle: 1⁄2 und 2⁄4.',
    ],
    beispiel: 'Von 0 bis 1 sind es 4 Abstände. Der dritte Strich nach der 0 ist 3⁄4. Zwei Striche hinter der 1 liegt 1 2⁄4 = 1 1⁄2.',
    heft: 'Wähle die Länge für ein Ganzes so, dass sie sich gut teilen lässt: für Viertel zum Beispiel 4 oder 8 Kästchen.',
  },
  ...merkzettel2,
  ...merkzettel3,
};

// Wortspeicher je Unterkapitel: Wort, Niveaustufe, ab der es gezeigt und benutzt wird, und Erklärung.
const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });
export const wortspeicher = {
  '6.1.1': [
    w('Bruch', 'F', 'Eine Zahl aus Zähler und Nenner mit einem Bruchstrich dazwischen. Sie nennt einen Teil vom Ganzen.'),
    w('Zähler', 'F', 'Die Zahl über dem Bruchstrich. Sie zählt die Teile.'),
    w('Nenner', 'F', 'Die Zahl unter dem Bruchstrich. Sie sagt, in wie viele gleich große Teile das Ganze geteilt ist.'),
    w('Ganzes', 'F', 'Alles zusammen, bevor geteilt wird: die ganze Pizza, der ganze Streifen.'),
    w('gemischte Zahl', 'F', 'Eine Zahl aus Ganzen und einem Bruch, zum Beispiel 1 1⁄2.'),
    w('Stammbruch', 'G', 'Ein Bruch mit dem Zähler 1, zum Beispiel 1⁄4.'),
    w('unechter Bruch', 'G', 'Ein Bruch, der größer als ein Ganzes ist: Der Zähler ist größer als der Nenner.'),
    w('umwandeln', 'G', 'Dieselbe Zahl anders schreiben: 5⁄4 = 1 1⁄4.'),
    w('Scheinbruch', 'M', 'Ein Bruch, der eine natürliche Zahl ist, zum Beispiel 8⁄4 = 2.'),
  ],
  '6.1.2': [
    w('erweitern', 'F', 'Zähler und Nenner mit derselben Zahl malnehmen. Der Wert bleibt gleich.'),
    w('Wert', 'F', 'Wie viel ein Bruch vom Ganzen ist.'),
    w('gleichwertig', 'G', 'Zwei Brüche sind gleichwertig, wenn sie gleich viel vom Ganzen sind: 1⁄2 und 2⁄4.'),
    w('Erweiterungszahl', 'G', 'Die Zahl, mit der du Zähler und Nenner malnimmst.'),
    w('Vielfaches', 'M', 'Das Ergebnis, wenn du eine Zahl mit 1, 2, 3 und so weiter malnimmst. 12 ist ein Vielfaches von 4.'),
  ],
  '6.1.3': [
    w('kürzen', 'F', 'Zähler und Nenner durch dieselbe Zahl teilen. Der Wert bleibt gleich.'),
    w('teilbar', 'F', 'Eine Zahl ist durch eine andere teilbar, wenn beim Teilen kein Rest bleibt.'),
    w('Kürzungszahl', 'G', 'Die Zahl, durch die du Zähler und Nenner teilst.'),
    w('vollständig', 'G', 'Ein Bruch ist vollständig gekürzt, wenn du nicht mehr weiter kürzen kannst.'),
    w('Quersumme', 'G', 'Die Summe aller Ziffern einer Zahl. Die Quersumme von 27 ist 2 + 7 = 9.'),
    w('Teiler', 'M', 'Eine Zahl, durch die sich eine andere ohne Rest teilen lässt. 3 ist ein Teiler von 12.'),
    w('ggT', 'E', 'Der größte gemeinsame Teiler von zwei Zahlen. Kürzt du mit ihm, ist der Bruch in einem Schritt vollständig gekürzt.'),
  ],
  '6.1.4': [
    w('vergleichen', 'F', 'Herausfinden, welcher Bruch größer oder kleiner ist.'),
    w('ordnen', 'F', 'Brüche der Größe nach in eine Reihe bringen.'),
    w('Zeichen', 'F', 'Das Zeichen < heißt „kleiner als“, das Zeichen > heißt „größer als“. Die Spitze zeigt zur kleineren Zahl.'),
    w('gemeinsamer Nenner', 'G', 'Ein Nenner, auf den du beide Brüche erweitern kannst.'),
    w('gleichnamig', 'M', 'Brüche mit demselben Nenner heißen gleichnamig.'),
    w('Hauptnenner', 'E', 'Der kleinste gemeinsame Nenner von zwei oder mehr Brüchen.'),
  ],
  '6.1.5': [
    w('Anteil', 'F', 'Der Teil vom Ganzen, um den es geht, als Bruch geschrieben.'),
    w('Bruchteil', 'F', 'Ein Teil vom Ganzen, mit einem Bruch angegeben.'),
    w('Einheit', 'F', 'Das Maß hinter der Zahl, zum Beispiel m, kg oder min.'),
    w('Maßzahl', 'G', 'Die Zahl vor der Einheit. Bei 20 kg ist 20 die Maßzahl.'),
    w('rückwärts', 'M', 'Vom Teil zurück zum Ganzen rechnen.'),
  ],
  '6.1.6': [
    w('Zahlenstrahl', 'F', 'Eine Linie mit Strichen in gleichen Abständen. Jede Zahl hat darauf ihren Platz.'),
    w('Teilstrich', 'F', 'Ein kleiner Strich am Zahlenstrahl.'),
    w('Abstand', 'F', 'Das Stück zwischen zwei Teilstrichen.'),
    w('Einteilung', 'G', 'In wie viele Abstände ein Ganzes am Zahlenstrahl geteilt ist.'),
    w('verfeinern', 'M', 'Jeden Abstand noch einmal teilen. Aus Vierteln werden so Achtel.'),
  ],
  ...wortspeicher2,
  ...wortspeicher3,
};

// Voraussetzungen (ADR 0017): Lernziele, auf denen ein Lernziel aufbaut. Sie dürfen in Klasse 5 liegen (ADR 0037).
const voraussetzungen = {
  '6.1.1-B1': ['5.9.1-B1', '5.9.1-B2'],
  '6.1.1-B2': ['6.1.1-B1', '5.4.5-D4'],
  '6.1.2-W1': ['6.1.1-B1', '5.4.1-K1'],
  '6.1.2-W2': ['6.1.2-W1', '5.4.1-K2'],
  '6.1.3-K1': ['6.1.2-W1', '5.4.1-K2'],
  '6.1.3-K2': ['6.1.3-K1'],
  '6.1.4-V1': ['6.1.1-B1', '5.9.1-B3'],
  '6.1.4-V2': ['6.1.4-V1', '6.1.2-W2'],
  '6.1.5-T1': ['6.1.1-B1', '5.9.2-T1'],
  '6.1.5-T2': ['6.1.5-T1', '5.9.2-T2'],
  '6.1.6-Z1': ['6.1.1-B2', '5.2.1-N1'],
  '6.1.6-Z2': ['6.1.6-Z1', '6.1.2-W2'],
  ...voraussetzungen2,
  ...voraussetzungen3,
};

// Grundlage (ADR 0015): der Baustein, den die Förderstufe F übt. Er steht im Hinweis für die Lehrkraft.
const grundlagen = {
  '6.1.1-B1': 'An Kreis und Streifen zählen: Wie viele Teile hat ein Ganzes, wie viele sind gefärbt?',
  '6.1.1-B2': 'An zwei Kreisen sehen: Ein ganzer Kreis und ein Viertel sind zusammen fünf Viertel',
  '6.1.2-W1': 'Am Streifen jedes Teil halbieren: Aus einem Halben werden zwei Viertel, der gefärbte Teil bleibt gleich groß',
  '6.1.2-W2': 'Zwei Streifen untereinander vergleichen: Welche Brüche färben gleich viel?',
  '6.1.3-K1': 'Am Streifen je zwei Teile zusammenfassen: Aus zwei Vierteln wird ein Halbes',
  '6.1.3-K2': 'Zähler und Nenner durch 2 teilen, solange beide gerade sind',
  '6.1.4-V1': 'Zwei Streifen mit gleich vielen Teilen vergleichen: Wo ist mehr gefärbt?',
  '6.1.4-V2': 'Zwei Brüche an Streifen untereinander vergleichen, bei denen ein Nenner das Doppelte des anderen ist',
  '6.1.5-T1': 'Eine Größe gerecht teilen und mehrere Teile nehmen: drei Viertel von 8 kg',
  '6.1.5-T2': 'Von einem Teil auf das Ganze schließen: Ein Viertel sind 5 kg, wie viel sind vier Viertel?',
  '6.1.6-Z1': 'Am Zahlenstrahl von 0 bis 1 die Abstände zählen und einen Bruch ablesen',
  '6.1.6-Z2': 'Am Zahlenstrahl von 0 bis 1 so viele Abstände gehen, wie der Zähler sagt',
  ...grundlagen2,
  ...grundlagen3,
};

// IDs: Kapitel "6.1", Unterkapitel "6.1.3", Lernziel "6.1.3-K2". Unterkapitel ohne feine Lernziele haben "6.2.1-L1".
export const kapitel = roh.map(([titel, unterkapitel], k) => ({
  id: `6.${k + 1}`,
  titel,
  unterkapitel: unterkapitel.map((u) => {
    const id = `6.${k + 1}.${u.nr}`;
    const paare = Array.isArray(u.lernziele) ? u.lernziele.map((text, i) => [`L${i + 1}`, text]) : Object.entries(u.lernziele);
    const lernziele = paare.map(([kurz, text]) => ({ id: `${id}-${kurz}`, text, voraussetzungen: voraussetzungen[`${id}-${kurz}`] ?? [], ...(grundlagen[`${id}-${kurz}`] && { grundlage: grundlagen[`${id}-${kurz}`] }), ...(bp6[`${id}-${kurz}`] && { bp: bp6[`${id}-${kurz}`] }) }));
    return { id, titel: u.titel, extra: false, ...(u.ab && { ab: u.ab }), ...(u.pflicht && { pflicht: u.pflicht }), lernziele, ...(merkzettel[id] && { merkzettel: merkzettel[id] }), ...(wortspeicher[id] && { wortspeicher: wortspeicher[id] }) };
  }),
}));
