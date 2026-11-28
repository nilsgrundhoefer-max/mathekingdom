// Klasse 6, Kapitel 8 „Daten auswerten und darstellen“ (ADR 0058): Lernziele, Merkzettel, Wortspeicher, Voraussetzungen, Grundlagen und Bildungsplan.
// Grilling mit Nils, 2026-11-28: fünf Meilensteine mit je zwei Lernzielen. 8.3 (Medienkompetenz) entfällt.
// 8.6 „Daten darstellen“ trägt im Buch die Marke M: Niveau-Meilenstein mit je 12 Aufgaben auf M und E.

const w = (wort, ab, erklaerung) => ({ wort, ab, erklaerung });

export const lernziele68 = {
  1: {
    E1: 'Ich kann Daten erheben und in einer Häufigkeitstabelle ordnen.',
    E2: 'Ich kann beurteilen, ob eine Stichprobe passt.',
  },
  2: {
    K1: 'Ich kann Minimum, Maximum und Spannweite bestimmen.',
    K2: 'Ich kann den Mittelwert und den Zentralwert bestimmen und deuten.',
  },
  4: {
    H1: 'Ich kann absolute und relative Häufigkeiten bestimmen.',
    H2: 'Ich kann relative Häufigkeiten als Bruch, Dezimalzahl und in Prozent angeben und vergleichen.',
  },
  5: {
    L1: 'Ich kann Anteile aus Kreisdiagrammen ablesen.',
    L2: 'Ich kann Anteile aus Streifendiagrammen ablesen.',
  },
  6: {
    D1: 'Ich kann ein Streifendiagramm erstellen.',
    D2: 'Ich kann ein Kreisdiagramm erstellen.',
  },
};

export const merkzettel68 = {
  '6.8.1': { heft: 'Streiche in der Liste jede Antwort ab, sobald du sie gezählt hast. Zähle am Ende alle Striche zusammen: Das muss die Anzahl der Antworten sein.' },
  '6.8.2': { heft: 'Schreibe die Werte zuerst der Größe nach geordnet auf. Dann siehst du Minimum, Maximum und den Wert in der Mitte sofort.' },
  '6.8.4': { heft: 'Schreibe zu jeder Zeile der Tabelle den Anteil als Bruch: oben die Anzahl, unten die Gesamtzahl. Kürze dann.' },
  '6.8.5': { heft: 'Schreibe zu jedem Ausschnitt den Anteil. Zusammen müssen alle Anteile 100 % ergeben.' },
  '6.8.6': { heft: 'Berechne zuerst für jede Antwort den Winkel. Zähle alle Winkel zusammen: Es müssen 360° sein. Zeichne dann mit dem Geodreieck.' },
};

// Es zählt die früheste Stufe im ganzen Kapitel, und zwar je einzelnem Wort.
export const wortspeicher68 = {
  '6.8.1': [
    w('Umfrage', 'F', 'Man stellt vielen Personen dieselbe Frage und schreibt die Antworten auf.'),
    w('Strichliste', 'F', 'Für jede Antwort machst du einen Strich. Der fünfte Strich geht quer.'),
    w('Häufigkeit', 'F', 'Wie oft eine Antwort vorkommt.'),
    w('Stichprobe', 'G', 'Die Personen, die man wirklich fragt, wenn man etwas über alle wissen will.'),
    w('Beobachtung', 'M', 'Man schaut zu und zählt, ohne zu fragen, zum Beispiel Autos an einer Kreuzung.'),
    w('Messung', 'M', 'Man misst eine Größe, zum Beispiel die Weite beim Weitsprung.'),
  ],
  '6.8.2': [
    w('Minimum', 'F', 'Der kleinste Wert.'),
    w('Maximum', 'F', 'Der größte Wert.'),
    w('Spannweite', 'F', 'Maximum minus Minimum. So weit liegen der größte und der kleinste Wert auseinander.'),
    w('Mittelwert', 'F', 'Alle Werte zusammenzählen und durch ihre Anzahl teilen. Im Alltag sagt man auch Durchschnitt.'),
    w('Zentralwert', 'G', 'Der Wert in der Mitte, wenn alle Werte der Größe nach geordnet sind.'),
    w('Kenngröße', 'M', 'Eine Zahl, die eine ganze Datenreihe kurz beschreibt, zum Beispiel Mittelwert oder Spannweite.'),
    w('Ausreißer', 'E', 'Ein Wert, der weit weg von allen anderen liegt.'),
  ],
  '6.8.4': [
    w('Gesamtzahl', 'F', 'Wie viele Antworten es insgesamt gibt.'),
    w('Anteil', 'F', 'Welcher Teil der Gesamtzahl es ist, zum Beispiel 3 von 10.'),
    w('absolute Häufigkeit', 'G', 'Die Anzahl, wie oft eine Antwort vorkommt.'),
    w('relative Häufigkeit', 'G', 'Der Anteil an der Gesamtzahl: absolute Häufigkeit geteilt durch Gesamtzahl.'),
    w('Prozentsatz', 'M', 'Der Anteil in Prozent geschrieben, zum Beispiel 30 %.'),
  ],
  '6.8.5': [
    w('Kreisdiagramm', 'F', 'Der ganze Kreis steht für alle. Jeder Ausschnitt zeigt einen Anteil.'),
    w('Streifendiagramm', 'F', 'Der ganze Streifen steht für alle. Jeder Abschnitt zeigt einen Anteil.'),
    w('Legende', 'F', 'Die Liste neben dem Diagramm. Sie sagt, welche Farbe was bedeutet.'),
    w('Ausschnitt', 'G', 'Ein Stück des Kreises zwischen zwei Linien vom Mittelpunkt zum Rand.'),
    w('Mittelpunktswinkel', 'M', 'Der Winkel eines Ausschnitts in der Mitte des Kreises. Ein Prozent sind 3,6°.'),
  ],
  '6.8.6': [
    w('Vollwinkel', 'M', 'Ein ganzer Kreis: 360°.'),
  ],
};

// Voraussetzungen (Nils, 2026-11-28, Q18). Sie dürfen in Klasse 5 liegen; deren Aufgaben stehen in der Vorstufe.
export const voraussetzungen68 = {
  '6.8.1-E1': ['5.1.1-H2', '5.1.5-U1'],
  '6.8.1-E2': ['6.8.1-E1'],
  '6.8.2-K1': ['5.1.4-V1'],
  '6.8.2-K2': ['6.8.2-K1', '6.5.4-D1'],
  '6.8.4-H1': ['6.8.1-E1', '6.1.3-K2'],
  '6.8.4-H2': ['6.8.4-H1', '6.4.7-P2'],
  '6.8.5-L1': ['6.8.4-H2', '5.7.4-W1'],
  '6.8.5-L2': ['6.8.4-H2'],
  '6.8.6-D1': ['6.8.5-L2'],
  '6.8.6-D2': ['6.8.5-L1', '5.7.4-W2'],
};

export const grundlagen68 = {
  '6.8.1-E1': 'Antworten aus einer Liste mit einer Strichliste zählen',
  '6.8.1-E2': 'Erkennen, ob nur eine kleine Gruppe gefragt wurde',
  '6.8.2-K1': 'Den größten und den kleinsten Wert in einer Liste finden',
  '6.8.2-K2': 'Werte zusammenzählen und die Summe durch die Anzahl teilen',
  '6.8.4-H1': 'Den Anteil „3 von 10“ als Bruch schreiben',
  '6.8.4-H2': 'Einen Bruch mit dem Nenner 100 in Prozent schreiben',
  '6.8.5-L1': 'Halben und Viertel Kreis im Kreisdiagramm erkennen',
  '6.8.5-L2': 'An einem 10 cm langen Streifen ablesen: 1 cm ist ein Zehntel',
  '6.8.6-D1': 'Zu einem Anteil in Prozent die Anzahl der Kästchen im Streifen bestimmen',
  '6.8.6-D2': 'Zu einem Anteil den Winkel als Teil von 360° berechnen',
};

// Standard im Bildungsplan 2016 je Lernziel (Quelle docs/quellen/niveaustufen-klasse-6.md, T08).
export const bp68 = {
  '6.8.1-E1': 'DZ (1), (2)',
  '6.8.1-E2': 'DZ (1), Stichproben beurteilen auf E',
  '6.8.2-K1': 'DZ (4)',
  '6.8.2-K2': 'DZ (4), (7)',
  '6.8.4-H1': 'DZ (3)',
  '6.8.4-H2': 'DZ (3)',
  '6.8.5-L1': 'DZ (5), Irreführung DZ (9) nur E',
  '6.8.5-L2': 'DZ (5), Irreführung DZ (9) nur E',
  '6.8.6-D1': 'DZ (6), Streifendiagramm zeichnen ab M',
  '6.8.6-D2': 'DZ (6), Kreisdiagramm zeichnen ab M',
};
