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
    regeln: [
      'Nach dem Komma stehen die Zehntel, die Hundertstel und die Tausendstel.',
      'Jede Stelle ist zehnmal so viel wert wie die Stelle rechts von ihr.',
      'Ein Zehnerbruch hat den Nenner 10, 100 oder 1000. Der Nenner sagt, wie viele Stellen nach dem Komma stehen: 7⁄100 = 0,07.',
      'Eine Null am Ende ändert den Wert nicht: 0,5 = 0,50. Eine Null direkt nach dem Komma ändert ihn: 0,05 ist viel weniger.',
      'Ab G: Gelesen wird Ziffer für Ziffer: 3,25 heißt „drei Komma zwei fünf“.',
      'Ab M: Nach den Tausendsteln kommen die Zehntausendstel.',
    ],
    beispiel: '2,35 sind 2 Einer, 3 Zehntel und 5 Hundertstel. Als Bruch: 235⁄100. Gelesen: zwei Komma drei fünf.',
    heft: 'Zeichne die Stellenwerttafel mit einem dicken Strich nach den Einern. Dort steht das Komma.',
  },
  '6.4.2': {
    regeln: [
      'Vergleiche zuerst die Ganzen. Sind sie gleich, vergleiche Stelle für Stelle von links: Zehntel, Hundertstel, Tausendstel.',
      'Mehr Ziffern heißt nicht größer: 0,7 ist größer als 0,65.',
      'Hänge Endnullen an, bis beide Zahlen gleich viele Stellen haben: 0,70 und 0,65.',
      'Am Zahlenstrahl liegt die größere Zahl weiter rechts.',
      'Ab G: Zwischen zwei Zehnteln liegen zehn Hundertstel.',
      'Ab E: Zwischen zwei Dezimalzahlen liegt immer noch eine weitere.',
    ],
    beispiel: '0,7 oder 0,705? Mit Endnullen: 0,700 und 0,705. Also ist 0,705 ein kleines bisschen größer.',
    heft: 'Schreibe die Zahlen untereinander, Komma unter Komma. Fülle mit Endnullen auf.',
  },
  '6.4.3': {
    regeln: [
      'Suche die Rundungsstelle. Schau dann nur auf die Ziffer rechts daneben.',
      'Ist sie 0, 1, 2, 3 oder 4, rundest du ab. Ist sie 5, 6, 7, 8 oder 9, rundest du auf.',
      'Hinter der Rundungsstelle fallen alle Ziffern weg.',
      'Runde in einem Schritt, nie Stelle für Stelle von hinten.',
      'Ab G: Aus einer 9, die aufgerundet wird, wird 10: 3,96 auf Zehntel ist 4,0.',
      'Ab M: Geld rundest du auf Cent, also auf Hundertstel Euro.',
    ],
    beispiel: '4,368 auf Zehntel: Die Rundungsstelle ist die 3. Rechts daneben steht 6, also aufrunden: 4,4.',
    heft: 'Unterstreiche die Rundungsstelle und kreise die Ziffer rechts daneben ein. Schreibe dann ≈ und das Ergebnis.',
  },
  '6.4.5': {
    regeln: [
      'Erweitere den Bruch auf den Nenner 10, 100 oder 1000. Dann kannst du ihn als Dezimalzahl schreiben.',
      `${'1⁄2'} = 5⁄10 = 0,5. ${'1⁄4'} = 25⁄100 = 0,25. ${'1⁄5'} = 2⁄10 = 0,2.`,
      'Umgekehrt: Schreibe die Dezimalzahl als Zehnerbruch und kürze dann vollständig: 0,25 = 25⁄100 = 1⁄4.',
      'Ab G: 1⁄8 = 125⁄1000 = 0,125.',
      'Ab E: Hat der gekürzte Nenner einen anderen Teiler als 2 und 5, geht es mit Erweitern nicht.',
    ],
    beispiel: '3⁄4 = 75⁄100 = 0,75, denn 4 · 25 = 100. Umgekehrt: 0,6 = 6⁄10 = 3⁄5.',
    heft: 'Schreibe die Erweiterungszahl klein über das Gleichheitszeichen.',
  },
  '6.4.6': {
    regeln: [
      'Jeder Bruch ist eine Division: Zähler geteilt durch Nenner. 3⁄8 = 3 : 8.',
      'Dividiere schriftlich. Hänge hinter dem Komma Nullen an, so lange du sie brauchst.',
      'Geht die Division auf, ist die Dezimalzahl abbrechend: 3⁄8 = 0,375.',
      `Kommt ein Rest zum zweiten Mal, wiederholen sich die Ziffern ohne Ende. Die Dezimalzahl ist periodisch: 2⁄3 = ${P('0,', '6')}.`,
      'Über die Ziffern, die sich wiederholen, setzt du einen Strich. Sie heißen Periode.',
      `Ab E: Nicht jede Periode beginnt direkt nach dem Komma: 1⁄6 = ${P('0,1', '6')}.`,
    ],
    beispiel: `Bei 1 : 3 bleibt nach jeder Stelle wieder der Rest 1. Der Rest kommt wieder, also 1⁄3 = ${P('0,', '3')}.`,
    heft: 'Schreibe jeden Rest auf. Kommt ein Rest zum zweiten Mal, kannst du aufhören.',
  },
  '6.4.7': {
    regeln: [
      'Prozent heißt Hundertstel: 1 % = 1⁄100 = 0,01.',
      'Ein Anteil in Prozent: Erweitere oder kürze den Bruch auf den Nenner 100. Der Zähler ist die Prozentzahl.',
      'Von der Dezimalzahl zu Prozent: Lies die Hundertstel. 0,35 = 35 %.',
      '50 % ist die Hälfte, 25 % ein Viertel, 10 % ein Zehntel, 100 % das Ganze.',
      'Ab M: Mehr als das Ganze ist mehr als 100 %: 1,2 = 120 %.',
    ],
    beispiel: '3 von 5 Kindern kommen mit dem Rad. 3⁄5 = 60⁄100 = 0,6 = 60 %.',
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
