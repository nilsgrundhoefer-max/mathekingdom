// Jahresplan Klasse 5 nach Schnittpunkt 5 (Baden-Württemberg).
// Quelle und Erläuterungen: docs/jahresplan-klasse-5.md

const uk = (titel, lernziele, extra = false) => ({ titel, lernziele, extra });

const roh = [
  ['Daten und Diagramme', [
    uk('Strichlisten und Häufigkeitstabellen', ['Ich kann mit Strichlisten und Häufigkeitstabellen umgehen.']),
    uk('Diagramme lesen', ['Ich kann Informationen aus Diagrammen ablesen.']),
    uk('Diagramme zeichnen', ['Ich kann Diagramme anfertigen.']),
    uk('Daten vergleichen', ['Ich kann Daten miteinander vergleichen.']),
    uk('Daten erheben', ['Ich kann Daten erheben.']),
  ]],
  ['Natürliche Zahlen', [
    uk('Natürliche Zahlen', ['Ich kann mit natürlichen Zahlen umgehen.']),
    uk('Große Zahlen', ['Ich kann mit großen Zahlen umgehen.']),
    uk('Runden', ['Ich kann Zahlen runden.']),
    uk('Schätzen', ['Ich kann eine Anzahl auf Bildern schätzen.']),
    uk('Zweiersystem', ['Ich kann Zahlen im Zweiersystem verwenden.']),
    uk('Römische Zahlzeichen', ['Ich kann römische Zahlzeichen verwenden.'], true),
  ]],
  ['Addieren und Subtrahieren', [
    uk('Kopfrechnen', ['Ich kann im Kopf addieren und subtrahieren und dabei geschickt vorgehen.']),
    uk('Addieren', ['Ich kann Zahlen addieren.']),
    uk('Subtrahieren', {
      S1: 'Ich kann die Fachbegriffe Minuend, Subtrahend und Differenz verwenden.',
      S2: 'Ich kann schriftlich subtrahieren, auch mit Übertrag.',
      S3: 'Ich kann mehrere Zahlen schriftlich subtrahieren.',
      S4: 'Ich kann ein Ergebnis mit Überschlag und Probe prüfen.',
      S5: 'Ich kann Sachaufgaben zur Subtraktion lösen.',
    }),
    uk('Klammern', ['Ich kann mit Klammern umgehen.']),
    uk('Rechengesetze', ['Ich kann Rechengesetze anwenden.']),
  ]],
  ['Multiplizieren und Dividieren', [
    uk('Kopfrechnen', ['Ich kann im Kopf multiplizieren und dividieren und dabei geschickt vorgehen.']),
    uk('Multiplizieren', ['Ich kann Multiplikationsaufgaben berechnen.']),
    uk('Rechenvorteile', ['Ich kann Rechengesetze anwenden und somit Rechenvorteile nutzen.']),
    uk('Potenzen', ['Ich kann Potenzen berechnen.']),
    uk('Dividieren', {
      D1: 'Ich kann die Fachbegriffe Dividend, Divisor und Quotient verwenden.',
      D2: 'Ich kann schriftlich durch einstellige Zahlen dividieren.',
      D3: 'Ich kann schriftlich durch zweistellige Zahlen dividieren.',
      D4: 'Ich kann Divisionen mit Rest berechnen und den Rest deuten.',
      D5: 'Ich kann ein Ergebnis mit Überschlag und Probe prüfen.',
      D6: 'Ich kann Sachaufgaben zur Division lösen.',
    }),
    uk('Punkt vor Strich, Klammern zuerst', ['Ich kann die Rechenregeln „Punkt vor Strich“ und „Klammern zuerst“ anwenden.']),
    uk('Verteilungsgesetz', ['Ich kann das Verteilungsgesetz anwenden, indem ich ausklammere und ausmultipliziere.']),
    uk('Zahlenmuster', ['Ich kann Zahlenmuster erkennen.'], true),
  ]],
  ['Geometrische Grundbegriffe und ebene Figuren', [
    uk('Strecke und Gerade', ['Ich kann die Begriffe Strecke und Gerade anwenden.']),
    uk('Senkrechten', ['Ich kann Senkrechten erkennen und zeichnen.']),
    uk('Parallelen', ['Ich kann Parallelen erkennen und zeichnen.']),
    uk('Koordinatensystem', ['Ich kann Punkte im Koordinatensystem ablesen und darstellen.']),
    uk('Entfernung und Abstand', ['Ich kann die Begriffe Entfernung und Abstand richtig anwenden.']),
    uk('Symmetrie', ['Ich kann symmetrische Figuren erkennen und zeichnen.']),
    uk('Rechteck und Quadrat', ['Ich kann Rechteck und Quadrat erkennen, unterscheiden und zeichnen.']),
    uk('Parallelogramm und Raute', ['Ich kann Parallelogramm und Raute erkennen, unterscheiden und zeichnen.']),
    uk('Drachen und Trapez', ['Ich kann Drachen und Trapez erkennen, unterscheiden und zeichnen.']),
  ]],
  ['Größen und Sachaufgaben', [
    uk('Größen schätzen', ['Ich kann Größen schätzen.']),
    uk('Geld', ['Ich kann mit Geldbeträgen und Geldeinheiten rechnen.']),
    uk('Zeit', ['Ich kann mit Zeitpunkten, Zeitspannen und Zeiteinheiten umgehen.']),
    uk('Gewicht', ['Ich kann mit Gewichten und Gewichtseinheiten umgehen.']),
    uk('Länge', ['Ich kann mit Längen und Längeneinheiten umgehen.']),
    uk('Maßstab', ['Ich kann mit Maßstäben und maßstäblichen Zeichnungen umgehen.']),
    uk('Sachaufgaben', ['Ich kann Sachaufgaben sicher lösen.']),
    uk('Sachaufgaben zu Beruf und Alltag', ['Ich kann Sachaufgaben zu Beruf und Alltag lösen.'], true),
  ]],
  ['Kreis und Winkel', [
    uk('Kreise', ['Ich kann Kreise anhand verschiedener Vorgaben zeichnen.']),
    uk('Winkel vergleichen', ['Ich kann Winkel zeichnen und Winkelgrößen vergleichen.']),
    uk('Winkelarten', ['Ich kann Winkelarten angeben sowie Winkelgrößen schätzen und auch bestimmen.']),
    uk('Winkel messen und zeichnen', ['Ich kann Winkel zeichnen, schätzen und messen.']),
    uk('Dreiecke', ['Ich kann Dreiecke nach Winkelart oder Seitenbeziehung einteilen und selbst zeichnen.'], true),
    uk('Gradnetz', ['Ich kann mithilfe des Gradnetzes Aussagen treffen.'], true),
  ]],
  ['Flächeninhalt und Umfang', [
    uk('Flächen vergleichen', ['Ich kann Flächeninhalte durch Abzählen von Kästchen angeben und vergleichen.']),
    uk('Flächenmaße', ['Ich kann sicher mit Flächenmaßen umgehen.']),
    uk('Rechteck', ['Ich kann die Berechnung von Flächeninhalt und Umfang bei Rechtecken sicher durchführen und anwenden.']),
    uk('Zusammengesetzte Figuren', ['Ich kann die Berechnung von Flächeninhalt und Umfang auch bei zusammengesetzten Figuren durchführen und anwenden.']),
  ]],
  ['Brüche und Dezimalzahlen', [
    uk('Bruchschreibweise', ['Ich kann die Bruchschreibweise verwenden.']),
    uk('Bruchteile von Größen', ['Ich kann mit Bruchteilen von Größen umgehen.']),
    uk('Dezimalschreibweise', ['Ich kann die Dezimalschreibweise verwenden.']),
  ]],
];

// IDs: Kapitel "5.3", Unterkapitel "5.3.3" (Extras "5.2.X1"), Lernziel "5.3.3-S2".
export const kapitel = roh.map(([titel, unterkapitel], k) => {
  let nr = 0;
  let extraNr = 0;
  return {
    id: `5.${k + 1}`,
    titel,
    unterkapitel: unterkapitel.map((u) => {
      const id = u.extra ? `5.${k + 1}.X${++extraNr}` : `5.${k + 1}.${++nr}`;
      const lernziele = Array.isArray(u.lernziele)
        ? u.lernziele.map((text, i) => ({ id: `${id}-L${i + 1}`, text }))
        : Object.entries(u.lernziele).map(([kurz, text]) => ({ id: `${id}-${kurz}`, text }));
      return { id, titel: u.titel, extra: u.extra, lernziele };
    }),
  };
});
