// Klasse 6, Kapitel 4 „Dezimalzahlen“ (ADR 0047): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-25: sechs Meilensteine mit je zwei Lernzielen. 4.4 (Medienkompetenz) entfällt wie im ganzen Jahresplan.
// 4.6 „Umwandeln durch Dividieren“ trägt im Buch die Marke M: ein Niveau-Meilenstein mit Aufgaben nur auf M und E.
// Periodische Dezimalzahlen stehen mit Überstrich: über jeder Ziffer der Periode U+0305 („0,16̅“).

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });
const P = (vor, per) => `${vor}${[...per].map((z) => `${z}̅`).join('')}`;

export const lernziele4 = {
  1: {
    S1: 'Ich kann Dezimalzahlen in die Stellenwerttafel eintragen und Zehnerbrüche als Dezimalzahl schreiben.',
    S2: 'Ich kann den Stellenwert einer Ziffer angeben, Endnullen erkennen und Größen mit Komma schreiben.',
  },
  2: {
    V1: 'Ich kann Dezimalzahlen vergleichen und der Größe nach ordnen.',
    V2: 'Ich kann Dezimalzahlen am Zahlenstrahl ablesen und eintragen.',
  },
  3: {
    R1: 'Ich kann Dezimalzahlen auf eine vorgegebene Stelle runden.',
    R2: 'Ich kann Größen und Geldbeträge sinnvoll runden und gerundete Werte deuten.',
  },
  5: {
    U1: 'Ich kann einen Bruch durch Erweitern auf 10, 100 oder 1000 in eine Dezimalzahl umwandeln.',
    U2: 'Ich kann eine Dezimalzahl in einen vollständig gekürzten Bruch umwandeln.',
  },
  6: {
    D1: 'Ich kann einen Bruch durch Dividieren in eine abbrechende Dezimalzahl umwandeln.',
    D2: 'Ich kann einen Bruch durch Dividieren in eine periodische Dezimalzahl umwandeln und sie richtig schreiben.',
  },
  7: {
    P1: 'Ich kann Anteile in Prozent angeben: Prozent heißt Hundertstel.',
    P2: 'Ich kann Anteile als Bruch, Dezimalzahl und in Prozent angeben und vergleichen.',
  },
};

export const merkzettel4 = {
  '6.4.1': {
    heft: 'Zeichne die Stellenwerttafel mit einem dicken Strich nach den Einern. Dort steht das Komma.',
  },
  '6.4.2': {
    heft: 'Schreibe die Zahlen untereinander, Komma unter Komma. Fülle mit Endnullen auf.',
  },
  '6.4.3': {
    heft: 'Unterstreiche die Rundungsstelle und kreise die Ziffer rechts daneben ein. Schreibe dann ≈ und das Ergebnis.',
  },
  '6.4.5': {
    heft: 'Schreibe die Erweiterungszahl klein über das Gleichheitszeichen.',
  },
  '6.4.6': {
    heft: 'Schreibe jeden Rest auf. Kommt ein Rest zum zweiten Mal, kannst du aufhören.',
  },
  '6.4.7': {
    heft: 'Lege eine Tabelle mit den Spalten Bruch, Dezimalzahl und Prozent an.',
  },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
export const wortspeicher4 = {
  '6.4.1': [
    w('Dezimalzahl', 'F', 'Eine Zahl mit Komma. Nach dem Komma stehen Zehntel, Hundertstel und Tausendstel.'),
    w('Komma', 'F', 'Es trennt die Ganzen von den Teilen eines Ganzen.'),
    w('Zehntel', 'F', 'Ein Ganzes in 10 gleiche Teile geteilt. Die erste Stelle nach dem Komma.'),
    w('Hundertstel', 'F', 'Ein Ganzes in 100 gleiche Teile geteilt. Die zweite Stelle nach dem Komma.'),
    w('Stellenwerttafel', 'F', 'Eine Tabelle mit einer Spalte für jede Stelle: Einer, Zehntel, Hundertstel.'),
    w('Tausendstel', 'G', 'Ein Ganzes in 1000 gleiche Teile geteilt. Die dritte Stelle nach dem Komma.'),
    w('Endnull', 'G', 'Eine Null ganz hinten nach dem Komma. Sie ändert den Wert nicht.'),
    w('Zehnerbruch', 'G', 'Ein Bruch mit dem Nenner 10, 100 oder 1000.'),
    w('Stellenwert', 'G', 'Wie viel eine Ziffer an ihrer Stelle wert ist.'),
    w('Zehntausendstel', 'M', 'Die vierte Stelle nach dem Komma.'),
  ],
  '6.4.2': [
    w('vergleichen', 'F', 'Herausfinden, welche Zahl größer oder kleiner ist.'),
    w('ordnen', 'F', 'Zahlen der Größe nach in eine Reihe bringen.'),
    w('Zahlenstrahl', 'F', 'Eine Linie mit Strichen in gleichen Abständen. Jede Zahl hat darauf ihren Platz.'),
    w('Teilstrich', 'F', 'Ein kleiner Strich am Zahlenstrahl.'),
    w('Lupe', 'M', 'Ein Abschnitt des Zahlenstrahls, zehnmal vergrößert. So siehst du die nächste Stelle.'),
    w('Ausschnitt', 'G', 'Ein Stück des Zahlenstrahls. Er beginnt nicht bei 0.'),
    w('Mitte', 'E', 'Die Zahl genau in der Mitte zwischen zwei Zahlen: Addiere beide und teile durch 2.'),
  ],
  '6.4.3': [
    w('runden', 'F', 'Eine Zahl durch eine einfachere ersetzen, die ungefähr gleich groß ist.'),
    w('aufrunden', 'F', 'Die Rundungsstelle wird um 1 größer.'),
    w('abrunden', 'F', 'Die Rundungsstelle bleibt, wie sie ist.'),
    w('Rundungsstelle', 'G', 'Die letzte Stelle, die nach dem Runden noch stehen bleibt.'),
    w('ungefähr', 'G', 'Das Zeichen ≈ heißt „ist ungefähr“.'),
    w('Messwert', 'M', 'Eine Zahl, die beim Messen herauskommt. Oft wird sie gerundet.'),
    w('Genauigkeit', 'E', 'Wie viele Stellen eine Angabe hat. Je mehr Stellen, desto genauer.'),
  ],
  '6.4.5': [
    w('Bruch', 'F', 'Eine Zahl aus Zähler und Nenner. Sie nennt einen Teil vom Ganzen.'),
    w('erweitern', 'F', 'Zähler und Nenner mit derselben Zahl malnehmen. Der Wert bleibt gleich.'),
    w('kürzen', 'F', 'Zähler und Nenner durch dieselbe Zahl teilen. Der Wert bleibt gleich.'),
    w('umwandeln', 'F', 'Dieselbe Zahl anders schreiben: 1⁄2 = 0,5.'),
    w('vollständig gekürzt', 'G', 'Ein Bruch, den du nicht mehr weiter kürzen kannst.'),
    w('Erweiterungszahl', 'G', 'Die Zahl, mit der du Zähler und Nenner malnimmst.'),
    w('Zehnerpotenz', 'M', 'Eine der Zahlen 10, 100, 1000, 10000. Ihre Teiler sind nur aus 2 und 5 gebaut.'),
  ],
  '6.4.6': [
    w('dividieren', 'M', 'Teilen. Ein Bruch ist der Zähler geteilt durch den Nenner.'),
    w('abbrechend', 'M', 'Eine Dezimalzahl, deren Division irgendwann aufgeht.'),
    w('periodisch', 'M', 'Eine Dezimalzahl, deren Ziffern sich ohne Ende wiederholen.'),
    w('Periode', 'M', 'Die Ziffern, die sich immer wiederholen. Über ihnen steht ein Strich.'),
    w('Rest', 'M', 'Was beim Teilen übrig bleibt. Kommt ein Rest zum zweiten Mal, beginnt die Periode wieder.'),
  ],
  '6.4.7': [
    w('Prozent', 'F', 'Hundertstel. Das Zeichen ist %. 1 % = 1⁄100.'),
    w('Anteil', 'F', 'Der Teil vom Ganzen, um den es geht.'),
    w('Hunderterfeld', 'F', 'Ein Quadrat aus 100 gleichen Feldern. Jedes Feld ist ein Hundertstel.'),
    w('Prozentzahl', 'G', 'Die Zahl vor dem Zeichen %.'),
    w('Prozentangabe', 'M', 'Ein Anteil mit Prozentzeichen, zum Beispiel 35 %.'),
  ],
};

// Voraussetzungen (Nils, 2026-11-25, Q13). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
export const voraussetzungen4 = {
  '6.4.1-S1': ['5.9.3-K1'],
  '6.4.1-S2': ['6.4.1-S1', '5.9.3-K3'],
  '6.4.2-V1': ['6.4.1-S1', '5.9.3-K2'],
  '6.4.2-V2': ['6.4.2-V1', '5.9.3-K2'],
  '6.4.3-R1': ['6.4.1-S1', '5.2.3-R1'],
  '6.4.3-R2': ['6.4.3-R1', '5.2.3-R2'],
  '6.4.5-U1': ['6.4.1-S1', '6.1.2-W1'],
  '6.4.5-U2': ['6.4.5-U1', '6.1.3-K2'],
  '6.4.6-D1': ['6.4.5-U1', '5.4.5-D2'],
  '6.4.6-D2': ['6.4.6-D1'],
  '6.4.7-P1': ['6.4.5-U1', '6.1.5-T1'],
  '6.4.7-P2': ['6.4.7-P1', '6.4.5-U2'],
};

export const grundlagen4 = {
  '6.4.1-S1': 'Am Streifen aus 10 Teilen die gefärbten Zehntel zählen und mit Komma schreiben',
  '6.4.1-S2': 'In der Stellenwerttafel ablesen, welche Ziffer bei den Zehnteln steht',
  '6.4.2-V1': 'Zwei Dezimalzahlen mit gleich vielen Stellen am Zahlenstrahl vergleichen',
  '6.4.2-V2': 'Am Zahlenstrahl von 0 bis 1 in Zehntelschritten zählen',
  '6.4.3-R1': 'Am Zahlenstrahl sehen, ob eine Zahl näher am kleineren oder am größeren Zehntel liegt',
  '6.4.3-R2': 'Einen Preis auf ganze Euro runden: Ab 50 Cent wird aufgerundet',
  '6.4.5-U1': 'Im Hunderterfeld zählen, wie viele Hundertstel die Hälfte oder ein Viertel sind',
  '6.4.5-U2': 'Eine Dezimalzahl mit einer Stelle als Bruch mit dem Nenner 10 schreiben',
  '6.4.6-D1': 'Einen Bruch als Geteiltaufgabe lesen: 1⁄2 ist 1 : 2',
  '6.4.6-D2': 'Bei 1 : 3 beobachten, dass immer wieder der Rest 1 kommt',
  '6.4.7-P1': 'Im Hunderterfeld die gefärbten Felder zählen: So viele Prozent sind gefärbt',
  '6.4.7-P2': 'Die Hälfte als 1⁄2, 0,5 und 50 % erkennen',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T04).
export const bp4 = {
  '6.4.1-S1': 'ZVO (10)',
  '6.4.1-S2': 'ZVO (10)',
  '6.4.2-V1': 'ZVO (7), Dichte ZVO (9) nur E',
  '6.4.2-V2': 'ZVO (7)',
  '6.4.3-R1': 'ZVO (19)',
  '6.4.3-R2': 'ZVO (19), Genauigkeit bewerten ZVO (20) nur E',
  '6.4.5-U1': 'ZVO (10)',
  '6.4.5-U2': 'ZVO (10)',
  '6.4.6-D1': 'ZVO (10), Umwandeln durch Dividieren ab M',
  '6.4.6-D2': 'ZVO (10), periodische Dezimalzahlen ab M',
  '6.4.7-P1': 'ZVO (11)',
  '6.4.7-P2': 'ZVO (11)',
};
