// Gemeinsames Werkzeug aller Aufgaben-Erzeuger: Zufall mit fester Saat, Bausteine je Aufgabenformat, Bilder, Sammeln der Gruppen.
// Regeln der Niveaustufen: docs/adr/0015-niveaustufen-nach-abschluss.md

export const NIVEAUS = ['F', 'G', 'M', 'E'];
export const PRO_GRUPPE = 6;
// Anforderungsbereiche der sechs Aufgaben je Niveaustufe (ADR 0015).
export const AFB_FOLGE = { F: [1, 1, 1, 1, 2, 1], G: [1, 1, 2, 1, 2, 3], M: [1, 2, 2, 1, 2, 3], E: [1, 2, 2, 3, 2, 3] };
// Auf F und G höchstens drei Antworten zur Auswahl.
export const MAX_OPTIONEN = { F: 3, G: 3, M: 4, E: 5 };

// ---------- Zufall ----------
let saat = 1;
export const setzeSaat = (s) => { saat = s; };
const zufall = () => {
  saat |= 0; saat = (saat + 0x6d2b79f5) | 0;
  let t = Math.imul(saat ^ (saat >>> 15), 1 | saat);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
export const zz = (von, bis) => von + Math.floor(zufall() * (bis - von + 1));
export const wahl = (liste) => liste[zz(0, liste.length - 1)];
export const mische = (liste) => {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = zz(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
export const suche = (erzeuge, passt) => {
  for (let i = 0; i < 100000; i++) { const x = erzeuge(); if (passt(x)) return x; }
  throw new Error('Keine passenden Zahlen gefunden');
};

// ---------- Zahlen ----------
// Ab fünf Stellen mit geschütztem Leerzeichen gliedern, wie im Schulbuch.
export const fz = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
export const nullen = (n) => (String(n).match(/0/g) || []).length;
export const runde = (n, auf) => Math.round(n / auf) * auf;
export const ziffern = (n, laenge = 0) => String(n).padStart(laenge, ' ').split('').map((c) => (c === ' ' ? '' : c));
export const summe = (liste) => liste.reduce((s, x) => s + x, 0);

// Anzahl der Stellen, an denen beim schriftlichen Subtrahieren getauscht werden muss.
export const subUebertraege = (a, b) => {
  let anzahl = 0, u = 0;
  while (a > 0 || b > 0) {
    if (a % 10 < b % 10 + u) { anzahl++; u = 1; } else u = 0;
    a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return anzahl;
};
// Anzahl der Überträge beim schriftlichen Addieren.
export const addUebertraege = (...zahlen) => {
  let anzahl = 0, u = 0, rest = [...zahlen];
  while (rest.some((x) => x > 0)) {
    const s = summe(rest.map((x) => x % 10)) + u;
    u = Math.floor(s / 10); if (u > 0) anzahl++;
    rest = rest.map((x) => Math.floor(x / 10));
  }
  return anzahl;
};
// Typischer Fehler: stellenweise immer die kleinere von der größeren Ziffer abziehen.
export const kleinerVonGroesser = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    ergebnis += Math.abs((a % 10) - (b % 10)) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
// Typischer Fehler: tauschen, aber den Übertrag in der nächsten Stelle nicht abziehen.
export const subUebertragVergessen = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    const x = a % 10, y = b % 10;
    ergebnis += (x < y ? x + 10 - y : x - y) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
// Typischer Fehler: stellenweise addieren, ohne die Überträge mitzunehmen.
export const addOhneUebertrag = (...zahlen) => {
  let ergebnis = 0, stelle = 1, rest = [...zahlen];
  while (rest.some((x) => x > 0)) {
    ergebnis += (summe(rest.map((x) => x % 10)) % 10) * stelle;
    stelle *= 10; rest = rest.map((x) => Math.floor(x / 10));
  }
  return ergebnis;
};
export const fehlerliste = (loesung, kandidaten) => {
  const gesehen = new Set([loesung]);
  return kandidaten.filter(([wert]) => {
    if (!Number.isInteger(wert) || wert < 0 || gesehen.has(wert)) return false;
    gesehen.add(wert); return true;
  }).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
};

// Rechnet einen Ausdruck aus Zahlen, +, −, ·, : und Klammern aus. Eine Division muss aufgehen.
// Potenzen in Hochschreibweise (2³) werden als Produkt gerechnet: 2³ = (2 · 2 · 2).
const HOCH = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const hoch = (n) => String(n).split('').map((z) => HOCH[z]).join('');
export const potenzAusschreiben = (s) => String(s).replace(new RegExp(`(\\d+)([${HOCH}]+)`, 'g'), (_, b, e) => `(${Array(Number([...e].map((c) => HOCH.indexOf(c)).join(''))).fill(b).join('·')})`);
export function rechne(ausdruck) {
  const t = potenzAusschreiben(ausdruck).replace(/[\s\u00a0]/g, '').match(/\d+|[+−·:()]/g) ?? [];
  let i = 0;
  const faktor = () => {
    if (t[i] === '(') { i++; const w = summe_(); if (t[i++] !== ')') throw new Error(`Klammer fehlt: ${ausdruck}`); return w; }
    if (!/^\d+$/.test(t[i] ?? '')) throw new Error(`Kein Rechenausdruck: ${ausdruck}`);
    return Number(t[i++]);
  };
  const produkt = () => {
    let w = faktor();
    while (t[i] === '·' || t[i] === ':') {
      const z = t[i++], r = faktor();
      if (z === ':' && (r === 0 || w % r !== 0)) throw new Error(`Division geht nicht auf: ${ausdruck}`);
      w = z === '·' ? w * r : w / r;
    }
    return w;
  };
  const summe_ = () => {
    let w = produkt();
    while (t[i] === '+' || t[i] === '−') { const z = t[i++], r = produkt(); w = z === '+' ? w + r : w - r; }
    return w;
  };
  const w = summe_();
  if (i !== t.length) throw new Error(`Kein Rechenausdruck: ${ausdruck}`);
  return w;
}
// Nachweis: die Rechnungen, mit denen sich die Lösung aus den Angaben der Aufgabe ergibt. pruefe-pool rechnet sie unabhängig nach.
// Ein Ausdruck ohne Gleichheitszeichen wird ausgerechnet ("58 − 25" wird zu "58 − 25 = 33").
export const N = (...zeilen) => zeilen.filter((z) => z != null && z !== false).map((z) => (typeof z === 'string' && !/[=≈]/.test(z) ? `${z} = ${rechne(z)}` : z));

// Sonderarten im Nachweis für Auswahlaufgaben (tools/pruefe-pool.mjs prüft jede davon selbst nach).
// Urteil über eine Behauptung: U(false, '48 + 17', 55) heißt: „48 + 17 = 55“ wird behauptet, und das ist falsch.
export const U = (stimmt, rechnung, behauptet, rest) => ({ art: 'urteil', stimmt, ...(rechnung != null ? { rechnung, behauptet } : {}), ...(rest != null ? { rest } : {}) });
export const GROESSTES = { art: 'extrem', was: 'groesstes' };
export const KLEINSTES = { art: 'extrem', was: 'kleinstes' };
export const WERT = (wert) => ({ art: 'wert', wert });
export const HILFSZAHL = (zahl, grund) => ({ zahl, grund });
export const UEBERFLUESSIG = (zahl) => ({ zahl, grund: 'überflüssige Angabe' });

export const KINDER = ['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara', 'Jonas', 'Finn', 'Ida', 'Ole', 'Lina', 'Paul', 'Emre', 'Noah', 'Elif', 'Sara'];
export const kind = () => wahl(KINDER);
export const zweiKinder = () => mische(KINDER).slice(0, 2);

// ---------- Fehlvorstellungen ----------
// beschreibung: für die Diagnose der Lehrkraft. hinweis: Rückmeldung an den Schüler nach dem ersten falschen Versuch.
// kind: Satz in einfacher Sprache für den Aha-Moment, wenn der Schüler den Fehler überwunden hat (ADR 0017).
const fv = (beschreibung, hinweis) => ({ beschreibung, hinweis });
const KIND = {
  'begriffe-verwechselt': 'Du weißt jetzt, welche Zahl wie heißt.',
  'sub-kleiner-von-groesser': 'Du tauschst jetzt richtig beim schriftlichen Minus.',
  'sub-uebertrag-vergessen': 'Du denkst jetzt an den Übertrag in der nächsten Stelle.',
  'sub-addiert': 'Du achtest jetzt auf das Minuszeichen.',
  'sub-klammerfehler': 'Du ziehst jetzt jede Zahl hinter einem Minus ab.',
  'add-uebertrag-vergessen': 'Du denkst jetzt an den Übertrag in der nächsten Stelle.',
  'add-subtrahiert': 'Du achtest jetzt auf das Pluszeichen.',
  'stellenwert': 'Du hältst jetzt Einer, Zehner und Hunderter auseinander.',
  'kopf-stellenwert': 'Du rechnest im Kopf jetzt an der richtigen Stelle.',
  'ergaenzen-zu-viel': 'Du ergänzt jetzt richtig: die Einer bis 10, alle anderen Stellen bis 9.',
  'geschickt-nicht-ausgeglichen': 'Du gleichst jetzt nach dem Rechnen mit der glatten Zahl aus.',
  'geschickt-falsch-ausgeglichen': 'Du gleichst jetzt in die richtige Richtung aus.',
  'ueberschlag-nicht-gerundet': 'Du rundest jetzt zuerst und überschlägst dann.',
  'falsch-gerundet': 'Du rundest jetzt richtig: Bei 5 bis 9 wird aufgerundet.',
  'probe-falsche-umkehr': 'Du findest jetzt die richtige Umkehraufgabe für die Probe.',
  'klammer-ignoriert': 'Du rechnest jetzt die Klammer zuerst.',
  'klammer-falsch-gesetzt': 'Du setzt die Klammer jetzt an die richtige Stelle.',
  'gesetz-auf-subtraktion': 'Du weißt jetzt: Beim Minus darfst du nicht tauschen.',
  'div-null-vergessen': 'Du denkst jetzt an die Null im Ergebnis.',
  'div-stellenwert': 'Du prüfst jetzt mit dem Überschlag, wie viele Stellen das Ergebnis hat.',
  'div-rest-nicht-gedeutet': 'Du überlegst jetzt, was der Rest in der Geschichte bedeutet.',
  'div-rest-vergessen': 'Du gibst den Rest jetzt richtig an.',
  'div-vertauscht': 'Du weißt jetzt: Beim Teilen darfst du nicht tauschen.',
  'div-falsche-rechenart': 'Du erkennst jetzt, wann geteilt wird.',
  'div-rest-zu-gross': 'Du weißt jetzt: Der Rest ist immer kleiner als die Zahl hinter dem Geteiltzeichen.',
  'div-einmaleins': 'Du prüfst Geteilt-Aufgaben jetzt mit dem Einmaleins.',
  'teilbar-summe': 'Du weißt jetzt: Volle Päckchen und volle Päckchen ergeben wieder volle Päckchen.',
  '1x1-nachbar': 'Du triffst im Einmaleins jetzt die richtige Reihe.',
  '1x1-addiert': 'Du achtest jetzt auf das Malzeichen.',
  '1x1-null': 'Du weißt jetzt: Mal 0 ergibt immer 0.',
  'div-durch-sich-selbst': 'Du weißt jetzt: Eine Zahl geteilt durch sich selbst ergibt 1.',
  'sach-falsche-rechnung': 'Du findest jetzt die passende Rechnung zur Geschichte.',
  'sach-unnoetige-angabe': 'Du erkennst jetzt, welche Zahlen du wirklich brauchst.',
  'mal-uebertrag-vergessen': 'Du nimmst den Übertrag jetzt in die nächste Stelle mit.',
  'mal-null-vergessen': 'Du denkst jetzt auch an die Null im Faktor.',
  'mal-nicht-eingerueckt': 'Du schreibst die Teilergebnisse jetzt an die richtige Stelle.',
  'mal-stellenwert': 'Du zählst die Nullen jetzt richtig.',
  'mal-zerlegung-halb': 'Du nimmst jetzt beide Teile mal.',
  'punkt-vor-strich': 'Du rechnest jetzt Punkt vor Strich.',
  'klammer-innen-aussen': 'Du beginnst jetzt bei der innersten Klammer.',
  'potenz-mal-exponent': 'Du weißt jetzt: 2³ heißt 2 · 2 · 2.',
  'potenz-vertauscht': 'Du hältst Basis und Exponent jetzt auseinander.',
  'potenz-nullen': 'Du zählst die Nullen bei Zehnerpotenzen jetzt richtig.',
  'verteilung-halb': 'Du nimmst jetzt jeden Teil in der Klammer mal.',
  'gesetz-auf-division': 'Du weißt jetzt: Beim Teilen darfst du nicht tauschen und keine Klammern verschieben.',
  'muster-falsche-regel': 'Du prüfst deine Regel jetzt an allen Zahlen des Musters.',
  'sach-schritt-vergessen': 'Du denkst jetzt an alle Rechenschritte.',
  'strich-buendel-falsch': 'Du bündelst jetzt richtig: Der fünfte Strich geht quer.',
  'strich-buendel-als-vier': 'Du weißt jetzt: Ein Bündel sind 5 Striche.',
  'liste-verzaehlt': 'Du zählst jetzt sorgfältig und streichst ab, was du schon gezählt hast.',
  'skala-einerschritte': 'Du schaust jetzt auf die Zahlen an der Achse.',
  'skala-zwischenwert': 'Du liest jetzt auch Werte zwischen zwei Zahlen genau ab.',
  'bild-symbole-gezaehlt': 'Du denkst jetzt an den Schlüssel: Ein Bild steht für mehrere.',
  'bild-halbes-symbol': 'Du weißt jetzt: Ein halbes Bild ist die Hälfte wert.',
  'diagramm-vertauscht': 'Du ordnest jetzt jeden Wert der richtigen Säule zu.',
  'extrem-verwechselt': 'Du unterscheidest jetzt sicher zwischen am meisten und am wenigsten.',
  'achse-abgeschnitten': 'Du schaust jetzt zuerst auf die unterste Zahl an der Achse.',
  'einteilung-zu-fein': 'Du wählst jetzt nicht zu kleine Schritte für die Achse.',
  'einteilung-zu-grob': 'Du wählst jetzt Schritte, bei denen jeder Wert auf einer Linie liegt.',
  'einteilung-zu-kurz': 'Du achtest jetzt darauf: Auch die größte Säule muss auf die Achse passen.',
  'umfrage-unpassend': 'Du stellst jetzt Fragen mit klaren Antworten zum Zählen.',
  'anteil-nicht-beachtet': 'Du vergleichst jetzt auch, wie viele insgesamt gefragt wurden.',
  'null-platzhalter': 'Du schreibst jetzt eine 0 an jede leere Stelle.',
  'zahl-nach-gehoer': 'Du schreibst Zahlen jetzt Stelle für Stelle und nicht so, wie du sie hörst.',
  'tafel-verrutscht': 'Du trägst jetzt jede Ziffer in die richtige Spalte ein.',
  'vergleich-erste-ziffer': 'Du schaust beim Vergleichen jetzt zuerst auf die Zahl der Stellen.',
  'zeichen-verwechselt': 'Du weißt jetzt: Die Spitze zeigt immer zur kleineren Zahl.',
  'nachbar-verwechselt': 'Du hältst Vorgänger und Nachfolger jetzt auseinander.',
  'strahl-einerschritte': 'Du findest jetzt zuerst heraus, wie groß ein Schritt am Zahlenstrahl ist.',
  'million-milliarde': 'Du hältst Tausender, Millionen und Milliarden jetzt auseinander.',
  'dreierblock-vergessen': 'Du gibst jetzt jedem Dreierblock seine drei Ziffern.',
  'runden-fuenf-ab': 'Du weißt jetzt: Bei 5 wird aufgerundet.',
  'runden-falsche-stelle': 'Du rundest jetzt auf die Stelle aus der Aufgabe.',
  'runden-ziffern-stehen': 'Du schreibst nach dem Runden jetzt Nullen hinter die Rundungsstelle.',
  'runden-kette': 'Du rundest jetzt in einem Schritt.',
  'runden-uebertrag': 'Du denkst beim Aufrunden jetzt daran: Aus 9 wird 10.',
  'schaetzen-nicht-hochgerechnet': 'Du rechnest jetzt von einem Feld auf alle Felder hoch.',
  'schaetzen-addiert': 'Du nimmst die Anzahl im Feld jetzt mal die Zahl der Felder.',
  'gezaehlt-geschaetzt': 'Du unterscheidest jetzt zwischen gezählt, gerundet und geschätzt.',
  'dual-zehnerwerte': 'Du weißt jetzt: Im Zweiersystem sind die Stellen 1, 2, 4, 8 und 16 wert.',
  'dual-gerade-werte': 'Du verdoppelst die Stellenwerte im Zweiersystem jetzt richtig: 1, 2, 4, 8, 16.',
  'dual-umgedreht': 'Du weißt jetzt: Im Zweiersystem steht die Einerstelle ganz rechts.',
  'roemisch-nur-addiert': 'Du weißt jetzt: Ein kleineres Zeichen links wird abgezogen.',
  'roemisch-vier-gleiche': 'Du schreibst höchstens drei gleiche Zeichen hintereinander.',
  'roemisch-falsch-abgezogen': 'Du weißt jetzt, welche Zeichen man abziehen darf.',
  'roemisch-zeichen-verwechselt': 'Du kennst jetzt den Wert jedes römischen Zeichens.',
  'gerade-begrenzt': 'Du hältst Strecke, Strahl und Gerade jetzt auseinander.',
  'laenge-kaestchen': 'Du weißt jetzt: Zwei Kästchen im Heft sind ein Zentimeter.',
  'lineal-nicht-null': 'Du schaust jetzt zuerst nach: Beginnt die Strecke am Lineal bei 0?',
  'einheit-mm-cm': 'Du weißt jetzt: Ein Zentimeter hat 10 Millimeter.',
  'senkrecht-lotrecht': 'Du weißt jetzt: Senkrecht zueinander heißt im rechten Winkel, egal in welcher Richtung.',
  'parallel-gleichlang': 'Du weißt jetzt: Parallel heißt überall gleicher Abstand, egal wie lang die Linien sind.',
  'senkrecht-parallel-verwechselt': 'Du hältst senkrecht und parallel jetzt auseinander.',
  'koord-vertauscht': 'Du gehst im Koordinatensystem jetzt erst nach rechts und dann nach oben.',
  'koord-ab-eins': 'Du beginnst im Koordinatensystem jetzt bei 0 zu zählen.',
  'abstand-schraeg': 'Du misst den Abstand jetzt auf dem kürzesten Weg, im rechten Winkel zur Linie.',
  'spiegel-verschoben': 'Du spiegelst jetzt und verschiebst die Figur nicht mehr nur.',
  'spiegel-abstand': 'Du zählst beim Spiegeln jetzt den Abstand zur Symmetrieachse.',
  'diagonale-als-achse': 'Du prüfst eine Symmetrieachse jetzt durch Falten in Gedanken.',
  'punkt-achsen-verwechselt': 'Du hältst Spiegeln an einer Achse und Drehen um einen Punkt jetzt auseinander.',
  'sonderfall-uebersehen': 'Du weißt jetzt: Ein Quadrat ist auch ein besonderes Rechteck.',
  'lage-prototyp': 'Du erkennst eine Figur jetzt auch in gedrehter Lage.',
  'viereck-eigenschaft': 'Du prüfst bei einem Viereck jetzt Seiten und rechte Winkel einzeln nach.',
  'umrechnungszahl': 'Du nimmst beim Umwandeln jetzt die richtige Umrechnungszahl.',
  'umrechnungsrichtung': 'Du weißt jetzt: Bei der kleineren Einheit steht die größere Zahl.',
  'zeit-zehnersystem': 'Du rechnest bei der Zeit jetzt mit 60 Minuten für eine Stunde.',
  'zeitpunkt-zeitspanne': 'Du unterscheidest jetzt Zeitpunkt und Zeitspanne.',
  'komma-falsch-gelesen': 'Du liest die Ziffern nach dem Komma jetzt richtig.',
  'masszahlen-addiert': 'Du wandelst jetzt erst in dieselbe Einheit um und rechnest dann.',
  'einheit-fehlt': 'Du schreibst jetzt zu jeder Größe die passende Einheit.',
  'massstab-verkehrt': 'Du weißt jetzt: Von der Karte zur Wirklichkeit rechnest du mal.',
  'massstab-einheit': 'Du wandelst beim Maßstab das Ergebnis jetzt in die passende Einheit um.',
  'groesse-ohne-vorstellung': 'Du vergleichst eine Größe jetzt mit Dingen aus dem Alltag.',
  'vergleich-nicht-genutzt': 'Du rechnest beim Schätzen jetzt mit der Vergleichsgröße weiter.',
  'sach-frage-verfehlt': 'Du liest am Ende jetzt noch einmal die Frage und prüfst deine Antwort.',
  'rueckgeld-preis': 'Du rechnest das Rückgeld jetzt als Unterschied aus.',
  'radius-durchmesser': 'Du hältst Radius und Durchmesser jetzt auseinander.',
  'kreis-mittelpunkt': 'Du setzt den Zirkel jetzt im Mittelpunkt ein.',
  'winkel-schenkellaenge': 'Du weißt jetzt: Lange Schenkel machen einen Winkel nicht größer.',
  'winkel-bezeichnung': 'Du liest Namen von Winkeln jetzt richtig.',
  'winkelart-grenze': 'Du ordnest Winkel jetzt sicher der richtigen Art zu.',
  'gestreckt-kein-winkel': 'Du weißt jetzt: Auch 180° und 360° sind Winkel.',
  'rechter-winkel-lage': 'Du erkennst rechte Winkel jetzt in jeder Lage.',
  'winkel-ohne-stuetze': 'Du vergleichst beim Schätzen jetzt mit dem rechten Winkel.',
  'skala-falsch': 'Du liest am Geodreieck jetzt auf der richtigen Skala ab.',
  'geodreieck-angelegt': 'Du legst das Geodreieck jetzt richtig an.',
  'ueberstumpf-klein': 'Du rechnest bei überstumpfen Winkeln jetzt 360° minus.',
  'gradnetz-vertauscht': 'Du nennst im Gradnetz jetzt zuerst die Breite und dann die Länge.',
  'gradnetz-richtung': 'Du hältst Nord, Süd, Ost und West im Gradnetz jetzt auseinander.',
  'dreieck-sonderfall': 'Du weißt jetzt: Ein gleichseitiges Dreieck ist auch gleichschenklig.',
  'dreieck-art': 'Du teilst Dreiecke jetzt richtig nach Seiten und Winkeln ein.',
  'winkelsumme': 'Du weißt jetzt: Die drei Winkel im Dreieck ergeben zusammen 180°.',
  // Kapitel 8 (ADR 0035)
  'umfang-flaeche-verwechselt': 'Du hältst Flächeninhalt und Umfang jetzt auseinander.',
  'gleicher-umfang-gleiche-flaeche': 'Du weißt jetzt: Gleicher Umfang heißt nicht gleich große Fläche.',
  'umfang-halb': 'Du zählst beim Umfang jetzt alle vier Seiten.',
  'randkaestchen-gezaehlt': 'Du zählst beim Umfang jetzt die Kästchenseiten am Rand.',
  'flaecheneinheit-laenge': 'Du schreibst bei Flächen jetzt cm² und bei Längen cm.',
  'umrechnungszahl-flaeche': 'Du nimmst bei Flächen jetzt die Umrechnungszahl 100.',
  'einheiten-gemischt-multipliziert': 'Du wandelst die Seiten jetzt erst in dieselbe Einheit um.',
  'innere-linie-im-umfang': 'Du zählst beim Umfang jetzt nur den äußeren Rand.',
  'teilflaeche-doppelt': 'Du zählst jede Teilfläche jetzt genau einmal.',
  'loch-nicht-abgezogen': 'Du ziehst das Loch jetzt vom Flächeninhalt ab.',
  // Kapitel 9 (ADR 0036)
  'bruch-vertauscht': 'Du schreibst den Zähler jetzt oben und den Nenner unten.',
  'bruch-teil-zu-rest': 'Du zählst beim Nenner jetzt alle Teile des Ganzen.',
  'bruch-ungleiche-teile': 'Du achtest jetzt auf gleich große Teile.',
  'bruch-nenner-groesse': 'Du weißt jetzt: Ein größerer Nenner macht die Teile kleiner.',
  'bruchteil-zaehler-vergessen': 'Du nimmst nach dem Teilen jetzt noch mit dem Zähler mal.',
  'bruch-ganzes-teil': 'Du hältst das Ganze und den Teil jetzt auseinander.',
  'dezimal-wie-natuerlich': 'Du vergleichst Dezimalzahlen jetzt Stelle für Stelle.',
  'dezimal-stelle': 'Du hältst Zehntel und Hundertstel jetzt auseinander.',
  'dezimal-endnull': 'Du weißt jetzt: Eine Null am Ende ändert die Dezimalzahl nicht.',
  'bruch-als-komma': 'Du schreibst einen Bruch jetzt über Zehntel oder Hundertstel als Dezimalzahl.',
  // Klasse 6, Kapitel 1 (ADR 0037)
  'erweitern-nur-ein-teil': 'Du rechnest beim Erweitern und Kürzen jetzt mit Zähler und Nenner.',
  'erweitern-addiert': 'Du nimmst beim Erweitern jetzt mal und zählst nichts dazu.',
  'erweitern-kuerzen-verwechselt': 'Du weißt jetzt: Erweitern heißt malnehmen und Kürzen heißt teilen.',
  'kuerzen-nicht-vollstaendig': 'Du kürzt jetzt so weit wie möglich.',
  'bruch-nur-zaehler-verglichen': 'Du schaust beim Vergleichen jetzt auf Zähler und Nenner.',
  'gemischt-umwandeln': 'Du rechnest die Ganzen jetzt erst in Bruchteile um.',
  'bruchstrahl-striche': 'Du zählst am Zahlenstrahl jetzt die Abstände bis zur 1.',
  // Klasse 6, Kapitel 2 (ADR 0038)
  'bruch-add-zaehler-nenner': 'Du lässt beim Addieren jetzt den Nenner stehen und rechnest nur mit den Zählern.',
  'bruch-add-ungleichnamig': 'Du machst Brüche jetzt erst gleichnamig und addierst dann.',
  'bruch-mal-nenner-mit': 'Du nimmst beim Vervielfachen jetzt nur den Zähler mal.',
  'bruch-mal-wie-plus': 'Du rechnest beim Malnehmen jetzt Zähler mal Zähler und Nenner mal Nenner.',
  'bruch-teilen-nenner-geteilt': 'Du weißt jetzt: Beim Teilen wird der Nenner größer oder der Zähler kleiner.',
  'bruch-kehrwert': 'Du drehst beim Teilen jetzt den zweiten Bruch um.',
  'gemischt-getrennt-mal': 'Du wandelst gemischte Zahlen vor dem Malnehmen jetzt in Brüche um.',
  'gemischt-kleiner-von-groesser': 'Du wandelst beim Abziehen jetzt ein Ganzes um.',
  'mal-macht-groesser': 'Du weißt jetzt: Malnehmen mit einem Bruch unter 1 macht kleiner.',
  // Klasse 7, Kapitel 1 (ADR 0043)
  'negativ-groesser': 'Du weißt jetzt: Links auf der Zahlengeraden steht die kleinere Zahl.',
  'betrag-gegenzahl': 'Du unterscheidest jetzt den Abstand zur Null und die Gegenzahl.',
  'betraege-addiert': 'Du schaust beim Addieren jetzt auf die Vorzeichen.',
  'minus-minus-uebersehen': 'Du machst aus Minus und Minus jetzt ein Plus.',
  'minus-mal-minus': 'Du weißt jetzt: Minus mal Minus ergibt Plus.',
  'vorzeichen-division': 'Du bestimmst beim Teilen jetzt zuerst das Vorzeichen.',
  'minusklammer': 'Du drehst nach einem Minus vor der Klammer jetzt jedes Zeichen um.',
  'vorzeichen-vergessen': 'Du schreibst jetzt das Vorzeichen zum Ergebnis.',
  'richtung-vertauscht': 'Du gehst bei Plus jetzt nach rechts und bei Minus nach links.',
  'abstand-ueber-null': 'Du zählst den Abstand jetzt über die Null hinweg.',
  'koord-vorzeichen': 'Du achtest bei jedem Punkt jetzt auf das Vorzeichen der Koordinaten.',
  // Klasse 7, Kapitel 2 (ADR 0044)
  'nebenwinkel-gleich': 'Du weißt jetzt: Nebenwinkel ergeben zusammen 180°.',
  'scheitel-neben-verwechselt': 'Du hältst Scheitelwinkel und Nebenwinkel jetzt auseinander.',
  'stufen-wechsel-verwechselt': 'Du hältst Stufenwinkel und Wechselwinkel jetzt auseinander.',
  'ohne-parallele': 'Du prüfst jetzt zuerst: Sind die Geraden parallel?',
  'gestreckt-voll': 'Du weißt jetzt: An einer Geraden sind es 180° und rundherum 360°.',
  'basiswinkel-falsch': 'Du findest die Basiswinkel jetzt an der Basis.',
  'seite-ecke-vertauscht': 'Du weißt jetzt: Die Seite a liegt der Ecke A gegenüber.',
  'kongruenz-verwechselt': 'Du erkennst jetzt, welcher Kongruenzsatz passt.',
  'drei-winkel-eindeutig': 'Du weißt jetzt: Drei Winkel legen die Größe eines Dreiecks nicht fest.',
  'dreiecksungleichung': 'Du prüfst jetzt: Zwei Seiten zusammen müssen länger als die dritte sein.',
  'hoehe-nicht-senkrecht': 'Du zeichnest die Höhe jetzt senkrecht zur Seite.',
  'hoehe-falsche-seite': 'Du zeichnest die Höhe jetzt von der richtigen Ecke aus.',
  'mittelsenkrechte-nicht-mittig': 'Du zeichnest die Mittelsenkrechte jetzt genau durch die Mitte.',
  'winkelhalbierende-seitenmitte': 'Du weißt jetzt: Die Winkelhalbierende teilt den Winkel und nicht die Seite.',
  'thales-durchmesser': 'Du findest den rechten Winkel jetzt gegenüber vom Durchmesser.',
  'ortslinie-verwechselt': 'Du weißt jetzt, welche Ortslinie zu welcher Bedingung gehört.',
  'tangente-nicht-senkrecht': 'Du weißt jetzt: Die Tangente steht senkrecht auf dem Radius.',
  'umkreis-inkreis-verwechselt': 'Du hältst Umkreis und Inkreis jetzt auseinander.',
  'innen-aussen-verwechselt': 'Du achtest jetzt darauf: Liegt der Punkt innen oder außen?',
  'konstruktion-reihenfolge': 'Du ordnest die Schritte einer Konstruktion jetzt richtig.',
  // Klasse 6, Kapitel 3 (ADR 0045)
  'ecken-kanten-verwechselt': 'Du hältst Ecken, Kanten und Flächen jetzt auseinander.',
  'verdeckt-nicht-gezaehlt': 'Du zählst jetzt auch, was hinten verdeckt ist.',
  'verdeckte-kante-durchgezogen': 'Du zeichnest verdeckte Kanten jetzt gestrichelt.',
  'tiefe-nicht-verkuerzt': 'Du zeichnest Kanten nach hinten jetzt schräg und verkürzt.',
  'netz-nur-gezaehlt': 'Du prüfst jetzt beim Netz auch die Lage der Flächen.',
  'riss-verwechselt': 'Du hältst die Ansichten von vorne, oben und der Seite jetzt auseinander.',
  'riss-gespiegelt': 'Du zeichnest die Ansicht jetzt nicht mehr spiegelverkehrt.',
  'wuerfel-verdeckt': 'Du zählst jetzt auch verdeckte Würfel mit.',
  'netz-ecken-gezaehlt': 'Du zählst Ecken jetzt am fertigen Körper und nicht im Netz.',
  'prisma-pyramide': 'Du hältst Prisma und Pyramide jetzt auseinander.',
  'name-nach-seitenflaeche': 'Du benennst den Körper jetzt nach seiner Grundfläche.',
  'gegenueber-benachbart': 'Du findest gegenüberliegende Flächen jetzt sicher.',
  'runde-koerper-zaehlen': 'Du zählst Flächen und Kanten an runden Körpern jetzt richtig.',
  'koerper-verwechselt': 'Du erkennst die Körper jetzt an ihren Flächen.',
  'wuerfel-kein-quader': 'Du weißt jetzt: Jeder Würfel ist auch ein Quader.',
  'kanten-teilweise': 'Du nimmst jetzt alle 12 Kanten mit.',
  'kippen-richtung': 'Du kippst den Körper jetzt in die richtige Richtung.',
  'kante-falsch-abgelesen': 'Du findest jetzt die gleich lange Kante.',
  // Klasse 6, Kapitel 4 „Dezimalzahlen“ (ADR 0047)
  'dezimal-mehr-ziffern': 'Du weißt jetzt: Mehr Ziffern machen eine Dezimalzahl nicht größer.',
  'drittel-als-zehntel': 'Du weißt jetzt: Ein Drittel ist nicht 0,3.',
  'runden-abschneiden': 'Du rundest jetzt, statt nur abzuschneiden.',
  'prozent-als-zaehler': 'Du rechnest einen Anteil jetzt erst in Hundertstel um.',
  'periode-zu-frueh': 'Du setzt den Strich jetzt nur über die sich wiederholenden Ziffern.',
  'periode-abgebrochen': 'Du erkennst jetzt endlos wiederholte Ziffern und schreibst sie als Periode.',
  // Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048)
  'komma-nicht-untereinander': 'Du schreibst jetzt Komma unter Komma.',
  'mal-komma-wie-plus': 'Du zählst jetzt die Stellen nach dem Komma in beiden Faktoren zusammen.',
  'stufe-null-angehaengt': 'Du verschiebst jetzt das Komma, statt eine Null anzuhängen.',
  'komma-falsche-richtung': 'Du verschiebst das Komma jetzt in die richtige Richtung.',
  'div-ein-komma-verschoben': 'Du verschiebst das Komma jetzt in beiden Zahlen gleich weit.',
  'div-komma-vergessen': 'Du setzt jetzt das Komma im Ergebnis an der richtigen Stelle.',
  'endnull-nicht-ergaenzt': 'Du ergänzt jetzt Endnullen, bevor du abziehst.',
  'div-macht-kleiner': 'Du weißt jetzt: Teilen durch eine Zahl unter 1 macht größer.',
};
export const fehlvorstellungen = {
  'begriffe-verwechselt': fv('Verwechselt die Fachbegriffe der Rechenart.', 'Schau dir die Fachbegriffe noch einmal an: Welche Zahl steht wo?'),
  'sub-kleiner-von-groesser': fv('Zieht in jeder Stelle die kleinere von der größeren Ziffer ab, statt zu tauschen.', 'Achte auf die Reihenfolge: Es wird immer die untere von der oberen Ziffer abgezogen. Geht das nicht, musst du tauschen.'),
  'sub-uebertrag-vergessen': fv('Tauscht richtig, berücksichtigt den Übertrag in der nächsten Stelle aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'sub-addiert': fv('Addiert, statt zu subtrahieren.', 'Schau auf das Rechenzeichen: Hier wird abgezogen.'),
  'sub-klammerfehler': fv('Rechnet a − (b − c) statt a − b − c: Der zweite Subtrahend wird addiert.', 'Jede Zahl hinter einem Minus wird abgezogen. Prüfe, ob du eine davon addiert hast.'),
  'add-uebertrag-vergessen': fv('Addiert stellenweise, berücksichtigt den Übertrag aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'add-subtrahiert': fv('Subtrahiert, statt zu addieren.', 'Schau auf das Rechenzeichen: Hier wird addiert.'),
  'stellenwert': fv('Verwechselt Stellenwerte (Einer, Zehner, Hunderter).', 'Prüfe die Stellen: Welche Ziffer steht bei den Einern, welche bei den Zehnern?'),
  'kopf-stellenwert': fv('Verrechnet sich beim Kopfrechnen um eine Stelle.', 'Prüfe die Stellen: Rechnest du mit Einern, Zehnern oder Hundertern?'),
  'ergaenzen-zu-viel': fv('Ergänzt jede Stelle einzeln bis zur vollen Zehn und erhält dadurch zu viel.', 'Nur die Einer werden bis 10 ergänzt. Alle anderen Stellen ergänzt du bis 9.'),
  'geschickt-nicht-ausgeglichen': fv('Rechnet mit der glatten Nachbarzahl, gleicht danach aber nicht aus.', 'Du hast mit einer glatten Zahl gerechnet. Jetzt musst du noch ausgleichen.'),
  'geschickt-falsch-ausgeglichen': fv('Gleicht nach dem Rechnen mit der glatten Nachbarzahl in die falsche Richtung aus.', 'Überlege: Hast du zu viel oder zu wenig gerechnet? In welche Richtung musst du ausgleichen?'),
  'ueberschlag-nicht-gerundet': fv('Rechnet genau, statt mit gerundeten Zahlen zu überschlagen.', 'Du hast genau gerechnet. Beim Überschlag rundest du zuerst und rechnest dann.'),
  'falsch-gerundet': fv('Rundet immer ab, statt nach der Rundungsregel zu runden.', 'Prüfe dein Runden: Bei 5, 6, 7, 8 und 9 wird aufgerundet.'),
  'probe-falsche-umkehr': fv('Wählt für die Probe nicht die Umkehraufgabe.', 'Die Probe macht die Rechnung rückgängig. Sie muss wieder zur ersten Zahl der Aufgabe führen.'),
  'klammer-ignoriert': fv('Rechnet von links nach rechts und beachtet die Klammer nicht.', 'Was in der Klammer steht, wird zuerst berechnet.'),
  'klammer-falsch-gesetzt': fv('Setzt die Klammer an die falsche Stelle.', 'Lies genau: Was soll zuerst zusammengefasst werden? Das gehört in die Klammer.'),
  'gesetz-auf-subtraktion': fv('Überträgt das Vertauschungs- oder Verbindungsgesetz auf die Subtraktion.', 'Die beiden Gesetze gelten nur für die Addition. Rechne beide Seiten aus.'),
  'div-null-vergessen': fv('Lässt eine Null im Quotienten aus.', 'Passt der Divisor einmal nicht hinein, gehört an diese Stelle eine 0 ins Ergebnis.'),
  'div-stellenwert': fv('Irrt sich beim Stellenwert des Quotienten (eine Null zu viel oder zu wenig).', 'Prüfe mit einem Überschlag, wie viele Stellen dein Ergebnis haben muss.'),
  'div-rest-nicht-gedeutet': fv('Berechnet den Quotienten richtig, deutet den Rest aber nicht im Sachzusammenhang.', 'Deine Rechnung stimmt. Überlege jetzt, was mit dem Rest in dieser Situation passiert.'),
  'div-rest-vergessen': fv('Gibt den Rest nicht oder falsch an.', 'Prüfe den Rest: Was bleibt übrig, wenn du Ergebnis mal Divisor vom Dividenden abziehst?'),
  'div-vertauscht': fv('Vertauscht bei der Division die beiden Zahlen.', 'Beim Teilen darfst du die Zahlen nicht tauschen. Die erste Zahl wird geteilt.'),
  'div-falsche-rechenart': fv('Wählt statt der Division eine andere Rechenart.', 'Überlege: Wird hier gerecht verteilt oder in gleiche Gruppen aufgeteilt? Dann wird geteilt.'),
  'div-rest-zu-gross': fv('Lässt einen Rest stehen, der so groß wie der Divisor oder größer ist.', 'Der Rest muss kleiner sein als die Zahl, durch die du teilst. Passt sie noch einmal hinein?'),
  'div-einmaleins': fv('Irrt sich im kleinen Einmaleins.', 'Prüfe mit der Mal-Aufgabe: Ergebnis mal die zweite Zahl muss die erste Zahl ergeben.'),
  'teilbar-summe': fv('Erkennt nicht, dass die Summe zweier Vielfacher wieder ein Vielfaches ist.', 'Zerlege in Päckchen: Was passiert, wenn du zu vollen Päckchen weitere volle Päckchen legst?'),
  '1x1-nachbar': fv('Irrt sich im Einmaleins um eine Reihe (Ergebnis der Nachbaraufgabe).', 'Geh von einer Kernaufgabe aus, zum Beispiel 5 mal. Rechne dann eine Reihe weiter.'),
  '1x1-addiert': fv('Addiert, statt zu multiplizieren.', 'Schau auf das Zeichen ·. Hier wird mal gerechnet, nicht plus.'),
  '1x1-null': fv('Meint, eine Zahl mal 0 ergibt die Zahl selbst.', 'Stell dir 0 Päckchen vor. Wie viel ist dann darin?'),
  'div-durch-sich-selbst': fv('Meint, eine Zahl geteilt durch sich selbst ergibt 0.', 'Verteile 4 Äpfel an 4 Kinder. Wie viele bekommt jedes Kind?'),
  'sach-falsche-rechnung': fv('Wählt eine Rechnung, die nicht zur Situation passt.', 'Lies die Frage noch einmal: Kommt etwas dazu, oder geht etwas weg?'),
  'sach-unnoetige-angabe': fv('Verrechnet eine Angabe, die für die Frage nicht gebraucht wird.', 'Nicht jede Zahl im Text wird gebraucht. Welche Angaben gehören wirklich zur Frage?'),
  'mal-uebertrag-vergessen': fv('Multipliziert stellenweise, nimmt den Übertrag aber nicht in die nächste Stelle mit.', 'Schau dir deine Überträge an: Den Zehner aus einer Stelle musst du bei der nächsten Stelle dazurechnen.'),
  'mal-null-vergessen': fv('Übersieht eine Null im Faktor und lässt die Stelle im Ergebnis aus.', 'Auch die Null wird malgenommen. 0 mal eine Zahl ist 0, und die Stelle bleibt im Ergebnis stehen.'),
  'mal-nicht-eingerueckt': fv('Schreibt die Teilprodukte nicht stellengerecht untereinander.', 'Jedes Teilprodukt endet unter der Ziffer, mit der du gerade malnimmst. Prüfe mit einem Überschlag.'),
  'mal-stellenwert': fv('Irrt sich bei der Zahl der Nullen (Stellenwert) im Produkt.', 'Zähle die Nullen der Faktoren. Prüfe dann mit einer leichten Aufgabe ohne Nullen.'),
  'mal-zerlegung-halb': fv('Multipliziert beim Zerlegen nur einen Teil und addiert den anderen Teil einfach dazu.', 'Beide Teile müssen malgenommen werden. Schau dir das Malkreuz an.'),
  'punkt-vor-strich': fv('Rechnet von links nach rechts und beachtet „Punkt vor Strich“ nicht.', 'Mal und geteilt kommen vor plus und minus. Unterstreiche zuerst die Punktrechnung.'),
  'klammer-innen-aussen': fv('Löst eine Klammer in der Klammer in der falschen Reihenfolge auf.', 'Bei einer Klammer in der Klammer beginnst du ganz innen.'),
  'potenz-mal-exponent': fv('Rechnet bei einer Potenz Basis mal Exponent (2³ = 6).', 'Der Exponent sagt, wie oft die Basis malgenommen wird. 2³ ist 2 · 2 · 2.'),
  'potenz-vertauscht': fv('Vertauscht bei einer Potenz Basis und Exponent.', 'Die große Zahl ist die Basis. Die kleine Zahl oben sagt, wie oft sie vorkommt.'),
  'potenz-nullen': fv('Zählt bei einer Zehnerpotenz die Nullen falsch.', 'Der Exponent sagt, wie viele Nullen die Zehnerpotenz hat. 10³ = 1000 hat 3 Nullen.'),
  'verteilung-halb': fv('Multipliziert beim Ausmultiplizieren nur den ersten Summanden in der Klammer.', 'Jeder Teil in der Klammer wird mit der Zahl vor der Klammer malgenommen.'),
  'gesetz-auf-division': fv('Überträgt das Vertauschungs- oder Verbindungsgesetz auf die Division.', 'Beim Dividieren darfst du die Zahlen nicht tauschen und die Klammern nicht verschieben. Rechne beide Seiten aus.'),
  'muster-falsche-regel': fv('Setzt ein Zahlenmuster mit einer falschen Regel fort (zum Beispiel immer gleich viel dazu statt immer mal gleich viel).', 'Prüfe deine Regel an allen Zahlen des Musters, nicht nur an den ersten beiden.'),
  'sach-schritt-vergessen': fv('Führt nur einen von mehreren nötigen Rechenschritten aus.', 'Du bist noch nicht fertig: Es fehlt noch ein Rechenschritt.'),
  // Kapitel 1: Daten und Diagramme
  'strich-buendel-falsch': fv('Bündelt die Strichliste falsch: Der Querstrich steht nicht als fünfter Strich.', 'Schau dir deine Bündel an: Vier Striche stehen gerade, der fünfte geht quer darüber.'),
  'strich-buendel-als-vier': fv('Zählt ein Bündel der Strichliste als 4 statt als 5.', 'Zähle in einem Bündel auch den Querstrich mit. Ein Bündel sind 5 Striche.'),
  'liste-verzaehlt': fv('Verzählt sich beim Auszählen einer Liste um eins oder zwei.', 'Zähle noch einmal und streiche dabei jede Antwort ab, die du schon gezählt hast.'),
  'skala-einerschritte': fv('Zählt die Linien des Diagramms, statt die Zahlen an der Achse zu beachten.', 'Schau auf die Zahlen an der Achse: In welchen Schritten geht es von Linie zu Linie?'),
  'skala-zwischenwert': fv('Liest bei einem Wert zwischen zwei beschrifteten Linien die nächste beschriftete Zahl ab.', 'Das Ende liegt zwischen zwei Zahlen. Zähle die feinen Linien in den richtigen Schritten weiter.'),
  'bild-symbole-gezaehlt': fv('Zählt im Bilddiagramm die Bilder, ohne den Schlüssel zu beachten.', 'Lies den Schlüssel: Ein Bild steht nicht für 1, sondern für mehrere.'),
  'bild-halbes-symbol': fv('Wertet ein halbes Bild im Bilddiagramm als ganzes oder lässt es weg.', 'Schau genau hin: Ein halbes Bild zählt die Hälfte des Schlüssels.'),
  'diagramm-vertauscht': fv('Trägt Werte bei der falschen Säule ein (zwei Werte vertauscht).', 'Prüfe Säule für Säule: Gehört der Wert aus der Tabelle wirklich zu diesem Namen?'),
  'extrem-verwechselt': fv('Verwechselt den größten mit dem kleinsten Wert.', 'Lies die Frage noch einmal: Wird nach am meisten oder nach am wenigsten gefragt?'),
  'achse-abgeschnitten': fv('Lässt sich von einer Achse täuschen, die nicht bei 0 beginnt, und vergleicht nur die Höhe der Säulen.', 'Schau, bei welcher Zahl die Achse beginnt. Vergleiche die Zahlen, nicht nur die Höhe der Säulen.'),
  'einteilung-zu-fein': fv('Wählt eine Achseneinteilung mit viel zu kleinen Schritten.', 'Mit so kleinen Schritten wird die Achse sehr lang. Nimm größere Schritte.'),
  'einteilung-zu-grob': fv('Wählt eine Achseneinteilung, bei der Werte zwischen die Linien fallen.', 'Prüfe jeden Wert: Liegt er genau auf einer Linie?'),
  'einteilung-zu-kurz': fv('Wählt eine Achse, die vor dem größten Wert endet.', 'Prüfe den größten Wert: Passt seine Säule noch auf die Achse?'),
  'umfrage-unpassend': fv('Wählt eine Umfragefrage, deren Antworten sich nicht eindeutig zählen lassen.', 'Überlege: Kann jedes Kind genau eine von wenigen Antworten geben?'),
  'anteil-nicht-beachtet': fv('Vergleicht Anzahlen aus unterschiedlich großen Gruppen, ohne die Gruppengröße zu beachten.', 'Die Gruppen sind verschieden groß. Vergleiche, welcher Teil der Gruppe es jeweils ist.'),
  // Kapitel 2: Natürliche Zahlen (Nils, 2026-11-21)
  'null-platzhalter': fv('Lässt die Null als Platzhalter weg (dreitausendfünf wird 35 oder 305).', 'Prüfe jede Stelle: Wo nichts steht, gehört eine 0 hin.'),
  'zahl-nach-gehoer': fv('Schreibt eine Zahl so, wie sie gesprochen wird (dreihundertfünf wird 3005).', 'Schreibe die Zahl in die Stellenwerttafel: Jede Stelle bekommt genau eine Ziffer.'),
  'tafel-verrutscht': fv('Trägt Ziffern in die falsche Spalte der Stellenwerttafel ein.', 'Beginne ganz rechts bei den Einern und gehe Spalte für Spalte nach links.'),
  'vergleich-erste-ziffer': fv('Hält die Zahl mit der größeren ersten Ziffer für größer, ohne auf die Zahl der Stellen zu achten.', 'Zähle zuerst die Stellen. Die Zahl mit mehr Stellen ist größer.'),
  'zeichen-verwechselt': fv('Verwechselt die Zeichen < und >.', 'Die Spitze des Zeichens zeigt immer zur kleineren Zahl.'),
  'nachbar-verwechselt': fv('Verwechselt Vorgänger und Nachfolger.', 'Der Vorgänger kommt direkt vor der Zahl, der Nachfolger direkt danach.'),
  'strahl-einerschritte': fv('Zählt am Zahlenstrahl jeden Strich als 1, statt die Schrittweite zu bestimmen.', 'Schau auf zwei beschriftete Striche: Wie viele Schritte liegen dazwischen, und wie groß ist dann ein Schritt?'),
  'million-milliarde': fv('Verwechselt Tausender, Millionen und Milliarden.', 'Zähle die Dreierblöcke von rechts: Einer, Tausender, Millionen, Milliarden.'),
  'dreierblock-vergessen': fv('Lässt einen Dreierblock aus oder füllt ihn nicht mit Nullen auf.', 'Jeder Block hat drei Ziffern. Fehlt etwas, kommen Nullen hinein.'),
  'runden-fuenf-ab': fv('Rundet bei der Ziffer 5 ab statt auf.', 'Schau auf die Ziffer rechts neben der Rundungsstelle: Bei 5 wird schon aufgerundet.'),
  'runden-falsche-stelle': fv('Rundet auf eine andere Stelle als verlangt.', 'Lies noch einmal: Auf welche Stelle soll gerundet werden?'),
  'runden-ziffern-stehen': fv('Lässt die Ziffern rechts von der Rundungsstelle stehen, statt Nullen zu schreiben.', 'Rechts von der Rundungsstelle stehen nach dem Runden nur Nullen.'),
  'runden-kette': fv('Rundet in mehreren Schritten nacheinander (1449 erst auf 1450, dann auf 1500).', 'Runde in einem Schritt. Es zählt nur die Ziffer direkt rechts neben der Rundungsstelle.'),
  'runden-uebertrag': fv('Vergisst beim Aufrunden den Übertrag, wenn an der Rundungsstelle eine 9 steht.', 'An der Rundungsstelle steht eine 9. Wird sie um 1 größer, ändert sich auch die Stelle links davon.'),
  'schaetzen-nicht-hochgerechnet': fv('Zählt beim Schätzen nur ein Feld und rechnet nicht auf alle Felder hoch.', 'Du hast ein Feld gezählt. Wie viele Felder hat das ganze Bild?'),
  'schaetzen-addiert': fv('Addiert beim Schätzen die Anzahl im Feld und die Zahl der Felder, statt zu multiplizieren.', 'In jedem Feld sind ungefähr gleich viele. Nimm die Anzahl im Feld mal die Zahl der Felder.'),
  'gezaehlt-geschaetzt': fv('Unterscheidet nicht zwischen gezählten, gerundeten und geschätzten Angaben.', 'Überlege: Hat hier jemand alles einzeln gezählt, oder ist die Zahl nur ungefähr?'),
  'dual-zehnerwerte': fv('Liest eine Zahl im Zweiersystem mit den Stellenwerten 1, 10, 100 des Zehnersystems.', 'Im Zweiersystem sind die Stellen von rechts 1, 2, 4, 8 und 16 wert.'),
  'dual-gerade-werte': fv('Nimmt im Zweiersystem die Stellenwerte 2, 4, 6, 8 statt zu verdoppeln.', 'Die Stellenwerte verdoppeln sich: 1, 2, 4, 8, 16.'),
  'dual-umgedreht': fv('Liest oder schreibt die Stellen im Zweiersystem in umgekehrter Reihenfolge.', 'Die Stelle mit dem Wert 1 steht ganz rechts, wie die Einer im Zehnersystem.'),
  'roemisch-nur-addiert': fv('Zählt bei römischen Zahlzeichen alle Zeichen zusammen und beachtet nicht, dass ein kleineres Zeichen links abgezogen wird (IX wird 11).', 'Steht ein kleineres Zeichen links vor einem größeren, wird es abgezogen.'),
  'roemisch-vier-gleiche': fv('Schreibt vier gleiche römische Zeichen hintereinander (IIII statt IV).', 'Höchstens drei gleiche Zeichen stehen hintereinander. Für 4 und 9 ziehst du ab.'),
  'roemisch-falsch-abgezogen': fv('Zieht bei römischen Zahlzeichen ein Zeichen ab, das man nicht abziehen darf (IC für 99, VX für 5).', 'Abgezogen wird nur I vor V und X, X vor L und C, C vor D und M.'),
  'roemisch-zeichen-verwechselt': fv('Verwechselt die Werte der römischen Zeichen (L und C, D und M, V und X).', 'Schau im Merkzettel nach: Welchen Wert hat jedes Zeichen?'),
  // Kapitel 5: Geometrische Grundbegriffe und ebene Figuren (Nils, 2026-11-21)
  'gerade-begrenzt': fv('Verwechselt Strecke, Strahl und Gerade oder hält eine Gerade für begrenzt.', 'Eine Strecke hat zwei Endpunkte, ein Strahl einen Anfangspunkt, eine Gerade hat kein Ende.'),
  'laenge-kaestchen': fv('Zählt Kästchen und gibt sie als Zentimeter an (oder umgekehrt).', 'Im Heft sind 2 Kästchen 1 cm lang. Ein Kästchen ist 5 mm lang.'),
  'lineal-nicht-null': fv('Liest am Lineal nur das Ende der Strecke ab, obwohl sie nicht bei 0 beginnt.', 'Schau auf den Anfang der Strecke: Bei welcher Zahl liegt er am Lineal?'),
  'einheit-mm-cm': fv('Rechnet Zentimeter und Millimeter falsch um.', 'Ein Zentimeter sind 10 Millimeter. Rechne zuerst alles in Millimeter um.'),
  'senkrecht-lotrecht': fv('Meint, „senkrecht“ heißt von oben nach unten, und erkennt rechte Winkel in schräger Lage nicht.', 'Senkrecht zueinander heißt: Die Linien bilden einen rechten Winkel. Dreh das Blatt in Gedanken.'),
  'parallel-gleichlang': fv('Hält Linien nur für parallel, wenn sie gleich lang sind oder genau untereinander liegen, oder hält Linien für parallel, die sich im Bild nur nicht treffen.', 'Parallele Linien haben überall den gleichen Abstand. Verlängere sie in Gedanken.'),
  'senkrecht-parallel-verwechselt': fv('Verwechselt die Begriffe senkrecht und parallel.', 'Senkrecht: Die Linien bilden einen rechten Winkel. Parallel: Die Linien treffen sich nie.'),
  'koord-vertauscht': fv('Vertauscht im Koordinatensystem die beiden Koordinaten (erst nach oben, dann nach rechts).', 'Die erste Zahl sagt, wie weit es nach rechts geht. Die zweite Zahl sagt, wie weit es nach oben geht.'),
  'koord-ab-eins': fv('Beginnt im Koordinatensystem bei 1 statt bei 0 zu zählen und landet ein Kästchen daneben.', 'Die Achsen beginnen bei 0. Zähle die Schritte, nicht die Linien.'),
  'abstand-schraeg': fv('Misst den Abstand zu einer Geraden schräg statt auf der Senkrechten.', 'Der Abstand ist der kürzeste Weg. Er steht immer senkrecht auf der Geraden.'),
  'spiegel-verschoben': fv('Verschiebt die Figur auf die andere Seite der Achse, statt sie zu spiegeln.', 'Beim Spiegeln wird die Figur umgeklappt. Was nah an der Achse liegt, bleibt nah an der Achse.'),
  'spiegel-abstand': fv('Setzt den Bildpunkt in einem anderen Abstand zur Symmetrieachse als den Punkt.', 'Zähle die Kästchen vom Punkt bis zur Achse. Genauso weit geht es auf der anderen Seite.'),
  'diagonale-als-achse': fv('Hält die Diagonale eines Rechtecks oder eine Linie durch ein Parallelogramm für eine Symmetrieachse.', 'Falte in Gedanken an der Linie. Liegen beide Hälften genau aufeinander?'),
  'punkt-achsen-verwechselt': fv('Verwechselt Achsensymmetrie (umklappen) und Punktsymmetrie (halbe Drehung).', 'Achsensymmetrisch: umklappen an einer Linie. Punktsymmetrisch: eine halbe Drehung um einen Punkt.'),
  'sonderfall-uebersehen': fv('Sieht nicht, dass ein Quadrat auch ein Rechteck ist (oder eine Raute auch ein Parallelogramm).', 'Prüfe die Eigenschaften: Hat die Figur alles, was die andere Figur braucht?'),
  'lage-prototyp': fv('Erkennt eine Figur nur in der gewohnten Lage (ein gedrehtes Quadrat gilt als Raute).', 'Dreh das Blatt in Gedanken. Die Figur bleibt dieselbe.'),
  'viereck-eigenschaft': fv('Ordnet einem Viereck Eigenschaften zu, die es nicht hat, oder verwechselt die Namen der Vierecke.', 'Prüfe der Reihe nach: Welche Seiten sind parallel? Welche sind gleich lang? Gibt es rechte Winkel?'),
  // Kapitel 6: Größen und Sachaufgaben (ADR 0033)
  'umrechnungszahl': fv('Wandelt mit der falschen Umrechnungszahl um (100 statt 1000, 100 statt 60).', 'Welche Umrechnungszahl gehört zu diesen beiden Einheiten? Schau auf den Merkzettel.'),
  'umrechnungsrichtung': fv('Rechnet beim Umwandeln in die falsche Richtung (teilt, statt malzunehmen, oder umgekehrt).', 'Ist die neue Einheit kleiner? Dann wird die Zahl davor größer.'),
  'zeit-zehnersystem': fv('Rechnet bei der Zeit wie im Zehnersystem (1 h als 100 min, 50 min und 20 min als 70 min ohne neue Stunde).', 'Eine Stunde hat 60 Minuten, nicht 100. Rechne bis zur vollen Stunde und dann weiter.'),
  'zeitpunkt-zeitspanne': fv('Verwechselt Zeitpunkt und Zeitspanne oder rechnet in die falsche Richtung auf der Zeitleiste.', 'Ein Zeitpunkt sagt wann, eine Zeitspanne sagt wie lange. Was ist hier gefragt?'),
  'komma-falsch-gelesen': fv('Liest die Stellen nach dem Komma falsch (3,5 € als 3 € 5 ct, 1,5 km als 1 km 5 m).', 'Was bedeuten die Ziffern nach dem Komma? Schreibe die Größe mit zwei Einheiten.'),
  'masszahlen-addiert': fv('Verrechnet die Zahlen verschiedener Einheiten, ohne umzuwandeln (2 m und 50 cm als 52).', 'Die Einheiten sind verschieden. Wandle zuerst in dieselbe Einheit um.'),
  'einheit-fehlt': fv('Gibt die Einheit nicht an oder wählt eine Einheit, die nicht zur Größe passt.', 'Zu einer Größe gehört eine Einheit. Welche passt hier?'),
  'massstab-verkehrt': fv('Rechnet beim Maßstab in die falsche Richtung (teilt auf dem Weg zur Wirklichkeit oder umgekehrt).', 'In Wirklichkeit ist alles größer als auf der Karte. Passt dein Ergebnis dazu?'),
  'massstab-einheit': fv('Rechnet mit dem Maßstab richtig, wandelt das Ergebnis aber nicht oder falsch um.', 'Dein Ergebnis steht noch in der Einheit der Karte. Wandle es in die gefragte Einheit um.'),
  'groesse-ohne-vorstellung': fv('Hat keine tragfähige Vorstellung von der Größe und wählt eine unpassende Einheit oder Zahl.', 'Vergleiche mit etwas, das du kennst: Eine Tür ist 2 m hoch, eine Tafel Schokolade wiegt 100 g.'),
  'vergleich-nicht-genutzt': fv('Nennt beim Schätzen nur die Vergleichsgröße oder nur, wie oft sie hineinpasst.', 'Wie oft passt die Vergleichsgröße hinein? Rechne dann mal.'),
  'sach-frage-verfehlt': fv('Rechnet richtig, beantwortet aber nicht die gestellte Frage (nennt ein Zwischenergebnis oder eine andere Größe).', 'Lies die Frage noch einmal. Was genau ist gesucht?'),
  'rueckgeld-preis': fv('Nennt beim Rückgeld den Preis oder zählt zusammen, statt abzuziehen.', 'Rückgeld ist das, was übrig bleibt: der gegebene Betrag minus der Preis.'),
  // Kapitel 7: Kreis und Winkel (ADR 0034)
  'radius-durchmesser': fv('Verwechselt Radius und Durchmesser und nimmt das Doppelte oder die Hälfte.', 'Der Radius geht vom Mittelpunkt bis zur Kreislinie. Der Durchmesser geht einmal ganz durch den Kreis.'),
  'kreis-mittelpunkt': fv('Zeichnet den Kreis nicht um den verlangten Mittelpunkt oder misst den Radius nicht vom Mittelpunkt aus.', 'Die Zirkelspitze gehört in den Mittelpunkt. Jeder Punkt der Kreislinie ist gleich weit davon entfernt.'),
  'winkel-schenkellaenge': fv('Hält einen Winkel für größer, weil seine Schenkel länger sind oder sein Bogen größer gezeichnet ist.', 'Die Größe eines Winkels hängt nicht von der Länge der Schenkel ab. Schau, wie weit sich die Schenkel öffnen.'),
  'winkel-bezeichnung': fv('Liest die Bezeichnung eines Winkels falsch (Scheitel nicht in der Mitte von ∢ASB, Scheitel und Schenkel verwechselt).', 'Der Scheitel ist der Punkt, in dem beide Schenkel beginnen. In einem Winkelnamen aus drei Buchstaben steht er in der Mitte.'),
  'winkelart-grenze': fv('Ordnet einen Winkel der falschen Winkelart zu, vor allem an den Grenzen 90° und 180°.', 'Vergleiche mit 90° und 180°. Spitz ist kleiner als 90°, stumpf liegt zwischen 90° und 180°.'),
  'gestreckt-kein-winkel': fv('Hält einen gestreckten Winkel oder einen Vollwinkel nicht für einen Winkel.', 'Auch 180° und 360° sind Winkel. Die Schenkel bilden dann eine Gerade oder liegen aufeinander.'),
  'rechter-winkel-lage': fv('Erkennt einen rechten Winkel nur, wenn ein Schenkel waagerecht liegt.', 'Dreh das Bild in Gedanken. Ein rechter Winkel bleibt ein rechter Winkel.'),
  'winkel-ohne-stuetze': fv('Schätzt einen Winkel deutlich daneben, ohne mit dem rechten Winkel zu vergleichen.', 'Vergleiche mit einem rechten Winkel: Ist der Winkel kleiner oder größer als 90°? Um wie viel ungefähr?'),
  'skala-falsch': fv('Liest am Geodreieck die falsche Skala ab und erhält 180° minus den Winkel.', 'Lies auf der Skala ab, die auf dem einen Schenkel bei 0 beginnt. Passt die Zahl zu spitz oder stumpf?'),
  'geodreieck-angelegt': fv('Legt das Geodreieck falsch an: Der Nullpunkt liegt nicht auf dem Scheitel, oder die lange Seite liegt nicht auf einem Schenkel.', 'Der Nullpunkt gehört genau auf den Scheitel. Die lange Seite liegt genau auf einem Schenkel.'),
  'ueberstumpf-klein': fv('Gibt bei einem überstumpfen Winkel den kleinen Winkel an und rechnet nicht 360° minus.', 'Der Bogen zeigt den großen Winkel. Miss den kleinen Winkel und rechne 360° minus.'),
  'gradnetz-vertauscht': fv('Vertauscht im Gradnetz Breite und Länge.', 'Zuerst kommt die Breite: Wie weit nördlich oder südlich vom Äquator? Dann kommt die Länge.'),
  'gradnetz-richtung': fv('Verwechselt im Gradnetz Nord und Süd oder Ost und West.', 'Nördlich vom Äquator heißt N, südlich heißt S. Östlich vom Längengrad 0° heißt O, westlich heißt W.'),
  'dreieck-sonderfall': fv('Sieht nicht, dass ein gleichseitiges Dreieck auch gleichschenklig ist.', 'Prüfe die Eigenschaft: Hat das Dreieck mindestens zwei gleich lange Seiten?'),
  'dreieck-art': fv('Teilt ein Dreieck falsch ein oder verwechselt die Einteilung nach Seiten mit der nach Winkeln.', 'Prüfe der Reihe nach: Welche Seiten sind gleich lang? Gibt es einen rechten oder einen stumpfen Winkel?'),
  'winkelsumme': fv('Rechnet im Dreieck mit einer falschen Winkelsumme (zum Beispiel 360°).', 'In jedem Dreieck ergeben die drei Winkel zusammen 180°.'),
  // Kapitel 8 „Flächeninhalt und Umfang“ (Grilling mit Nils, 2026-11-22)
  'umfang-flaeche-verwechselt': fv('Verwechselt Umfang und Flächeninhalt: rechnet den einen, wenn der andere gefragt ist.', 'Der Flächeninhalt sagt, wie viel Platz die Fläche hat. Der Umfang ist die Länge des Randes einmal ganz herum.'),
  'gleicher-umfang-gleiche-flaeche': fv('Meint, dass Figuren mit gleichem Umfang auch gleich großen Flächeninhalt haben (oder umgekehrt).', 'Zähle bei beiden Figuren nach. Ein langes, schmales Rechteck kann denselben Umfang haben wie ein Quadrat und trotzdem viel kleiner sein.'),
  'umfang-halb': fv('Rechnet beim Umfang nur a + b statt 2 · a + 2 · b und vergisst die beiden anderen Seiten.', 'Ein Rechteck hat vier Seiten. Zwei sind a lang, zwei sind b lang.'),
  'randkaestchen-gezaehlt': fv('Zählt beim Umfang die Kästchen am Rand statt der Kästchenseiten auf dem Rand.', 'Fahre mit dem Finger auf dem Rand entlang und zähle die Kästchenseiten. An einer Ecke zählen zwei Seiten.'),
  'flaecheneinheit-laenge': fv('Verwechselt Längen- und Flächeneinheiten: cm beim Flächeninhalt oder cm² beim Umfang.', 'Ein Flächeninhalt hat eine Einheit mit ², zum Beispiel cm². Ein Umfang ist eine Länge, zum Beispiel cm.'),
  'umrechnungszahl-flaeche': fv('Wandelt Flächeneinheiten mit der Umrechnungszahl 10 oder 1000 um statt mit 100.', 'Bei Flächen ist die Umrechnungszahl 100: 1 cm² sind 100 mm², 1 m² sind 100 dm².'),
  'einheiten-gemischt-multipliziert': fv('Multipliziert Seiten in verschiedenen Einheiten, ohne umzuwandeln (2 m · 50 cm = 100).', 'Die Seiten haben verschiedene Einheiten. Wandle zuerst beide in dieselbe Einheit um.'),
  'innere-linie-im-umfang': fv('Zählt bei zusammengesetzten Figuren Linien im Inneren zum Umfang.', 'Der Umfang ist nur der äußere Rand. Die Linien, mit denen du zerlegt hast, gehören nicht dazu.'),
  'teilflaeche-doppelt': fv('Zählt beim Zerlegen eine Teilfläche doppelt oder lässt eine weg.', 'Färbe oder nummeriere jede Teilfläche. Jede wird genau einmal gezählt.'),
  'loch-nicht-abgezogen': fv('Zieht bei einer Figur mit Loch das Loch nicht vom Flächeninhalt ab.', 'Rechne zuerst die ganze Fläche aus. Ziehe dann das Loch ab.'),
  // Kapitel 9 „Brüche und Dezimalzahlen“ (Grilling mit Nils, 2026-11-22)
  'bruch-vertauscht': fv('Vertauscht Zähler und Nenner.', 'Der Nenner steht unten und nennt alle Teile. Der Zähler steht oben und zählt die gemeinten Teile.'),
  'bruch-teil-zu-rest': fv('Vergleicht die gefärbten Teile mit den ungefärbten statt mit allen Teilen (3 von 8 gefärbt als drei Fünftel).', 'Zähle für den Nenner alle Teile des Ganzen, die gefärbten und die weißen.'),
  'bruch-ungleiche-teile': fv('Zählt ungleich große Teile als Bruchteil.', 'Ein Bruch braucht gleich große Teile. Schau genau hin: Sind alle Teile gleich groß?'),
  'bruch-nenner-groesse': fv('Hält den Bruch mit dem größeren Nenner für größer (ein Achtel größer als ein Viertel).', 'Bei mehr Teilen wird jedes Teil kleiner. Stell dir eine Pizza für 4 und eine für 8 Kinder vor.'),
  'bruchteil-zaehler-vergessen': fv('Teilt beim Bruchteil einer Größe nur durch den Nenner und nimmt nicht mit dem Zähler mal.', 'Du hast erst einen Teil. Wie viele Teile sind gemeint? Nimm mit dem Zähler mal.'),
  'bruch-ganzes-teil': fv('Verwechselt das Ganze mit dem Teil oder rechnet in die falsche Richtung.', 'Was ist gegeben: das Ganze oder ein Teil davon? Das Ganze ist größer als sein Teil.'),
  'dezimal-wie-natuerlich': fv('Liest die Nachkommastellen wie eine natürliche Zahl (0,15 größer als 0,5, weil 15 größer als 5 ist).', 'Vergleiche Stelle für Stelle: zuerst die Zehntel, dann die Hundertstel.'),
  'dezimal-stelle': fv('Verwechselt die Stellen nach dem Komma (0,5 als fünf Hundertstel, 0,05 als fünf Zehntel).', 'Die erste Stelle nach dem Komma sind die Zehntel, die zweite die Hundertstel.'),
  'dezimal-endnull': fv('Meint, eine Null am Ende ändere den Wert der Dezimalzahl (0,50 größer als 0,5).', '0,5 und 0,50 sind gleich viel: 5 Zehntel sind 50 Hundertstel.'),
  'bruch-als-komma': fv('Schreibt Zähler und Nenner einfach mit Komma hintereinander (ein Viertel als 0,4 oder 1,4).', 'Wie viele Zehntel oder Hundertstel sind es? Erst dann kannst du die Dezimalzahl schreiben.'),
  // Klasse 6, Kapitel 1 „Brüche“ (Grilling mit Nils, 2026-11-24)
  'erweitern-nur-ein-teil': fv('Erweitert oder kürzt nur den Zähler oder nur den Nenner.', 'Zähler und Nenner gehören zusammen. Rechne bei beiden mit derselben Zahl.'),
  'erweitern-addiert': fv('Zählt beim Erweitern dieselbe Zahl zu Zähler und Nenner dazu, statt malzunehmen (aus drei Vierteln werden fünf Sechstel).', 'Beim Erweitern nimmst du Zähler und Nenner mit derselben Zahl mal. Dazuzählen ändert den Wert.'),
  'erweitern-kuerzen-verwechselt': fv('Verwechselt Erweitern und Kürzen oder rechnet in die falsche Richtung.', 'Erweitern heißt malnehmen: Die Zahlen werden größer. Kürzen heißt teilen: Die Zahlen werden kleiner.'),
  'kuerzen-nicht-vollstaendig': fv('Kürzt nicht vollständig: Zähler und Nenner haben noch einen gemeinsamen Teiler.', 'Prüfe noch einmal: Lassen sich Zähler und Nenner noch durch dieselbe Zahl teilen?'),
  'bruch-nur-zaehler-verglichen': fv('Vergleicht Brüche nur über die Zähler oder die Zahlen einzeln, ohne auf die Größe der Teile zu achten.', 'Schau auf beide Zahlen: Der Nenner sagt, wie groß die Teile sind. Der Zähler sagt, wie viele es sind.'),
  'gemischt-umwandeln': fv('Wandelt gemischte Zahl und Bruch falsch um: schreibt die Ziffern nebeneinander oder zählt die Ganzen nur zum Zähler dazu.', 'Ein Ganzes hat so viele Teile, wie der Nenner sagt. Rechne die Ganzen zuerst in solche Teile um.'),
  'bruchstrahl-striche': fv('Zählt am Zahlenstrahl die Teilstriche statt der Abstände und nennt deshalb einen falschen Nenner.', 'Zähle die Abstände von 0 bis 1, nicht die Striche. So viele Teile hat das Ganze.'),
  // Klasse 6, Kapitel 2 (ADR 0038)
  'bruch-add-zaehler-nenner': fv('Addiert oder subtrahiert Zähler und Nenner getrennt (ein Halbes plus ein Drittel als zwei Fünftel).', 'Der Nenner sagt nur, wie groß die Teile sind. Er wird nicht mitgerechnet. Sind die Brüche gleichnamig?'),
  'bruch-add-ungleichnamig': fv('Addiert oder subtrahiert die Zähler, ohne die Brüche vorher gleichnamig zu machen, oder erweitert dabei nur den Nenner.', 'Die Teile sind verschieden groß. Erweitere zuerst so, dass beide Brüche denselben Nenner haben.'),
  'bruch-mal-nenner-mit': fv('Nimmt beim Vervielfachen auch den Nenner mit der Zahl mal (dreimal zwei Fünftel als sechs Fünfzehntel).', 'Die Teile bleiben gleich groß, es werden nur mehr. Nimm nur den Zähler mal.'),
  'bruch-mal-wie-plus': fv('Überträgt die Regel vom Addieren auf das Multiplizieren: macht gleichnamig und multipliziert nur die Zähler, oder addiert statt zu multiplizieren.', 'Beim Malnehmen brauchst du keinen gemeinsamen Nenner: Zähler mal Zähler und Nenner mal Nenner.'),
  'bruch-teilen-nenner-geteilt': fv('Teilt beim Dividieren durch eine Zahl den Nenner oder nimmt den Zähler mal, statt den Zähler zu teilen oder den Nenner malzunehmen.', 'Beim Teilen wird jeder Anteil kleiner. Teile den Zähler, oder nimm den Nenner mal.'),
  'bruch-kehrwert': fv('Bildet beim Dividieren keinen Kehrwert, den Kehrwert vom falschen Bruch oder von beiden Brüchen.', 'Nur der Bruch hinter dem Geteiltzeichen wird umgedreht. Dann wird malgenommen.'),
  'gemischt-getrennt-mal': fv('Multipliziert oder dividiert bei gemischten Zahlen die Ganzen und die Bruchteile getrennt.', 'Wandle die gemischte Zahl zuerst in einen Bruch um. Rechne erst dann.'),
  'gemischt-kleiner-von-groesser': fv('Zieht bei gemischten Zahlen den kleineren Bruchteil vom größeren ab, statt ein Ganzes umzuwandeln.', 'Der Bruch reicht nicht zum Abziehen. Wandle ein Ganzes in Bruchteile um.'),
  'mal-macht-groesser': fv('Meint, Multiplizieren vergrößert immer und Dividieren verkleinert immer.', 'Die Hälfte von etwas ist weniger. Malnehmen mit einem Bruch unter 1 macht kleiner, Teilen durch ihn macht größer.'),
  // Klasse 7, Kapitel 1 „Rationale Zahlen“ (Grilling mit Nils, 2026-11-24, ADR 0043)
  'negativ-groesser': fv('Hält bei negativen Zahlen die mit dem größeren Betrag für größer (−8 > −3).', 'Schau auf die Zahlengerade: Die Zahl weiter links ist kleiner. Bei −8 ist es kälter als bei −3.'),
  'betrag-gegenzahl': fv('Verwechselt Betrag und Gegenzahl oder gibt einen negativen Betrag an.', 'Der Betrag ist der Abstand zur Null, er ist nie negativ. Die Gegenzahl liegt auf der anderen Seite der Null.'),
  'betraege-addiert': fv('Addiert bei verschiedenen Vorzeichen die Beträge (−5 + 3 wird zu 8 oder −8).', 'Starte auf der Zahlengeraden bei der ersten Zahl. Plus geht nach rechts. Wo landest du?'),
  'minus-minus-uebersehen': fv('Übersieht beim Subtrahieren einer negativen Zahl das doppelte Minus (3 − (−5) wird zu −2).', 'Eine negative Zahl abziehen heißt: ihre Gegenzahl addieren. Aus − (−5) wird + 5.'),
  'minus-mal-minus': fv('Rechnet Minus mal Minus zu Minus.', 'Bestimme zuerst das Vorzeichen: Zwei gleiche Vorzeichen ergeben Plus, zwei verschiedene ergeben Minus.'),
  'vorzeichen-division': fv('Teilt nur die Beträge und setzt beim Dividieren das falsche oder kein Vorzeichen.', 'Beim Dividieren gilt dieselbe Regel wie beim Multiplizieren: gleiche Vorzeichen Plus, verschiedene Vorzeichen Minus.'),
  'minusklammer': fv('Lässt beim Auflösen einer Minusklammer die Zeichen in der Klammer stehen.', 'Steht ein Minus vor der Klammer, drehen sich alle Zeichen in der Klammer um.'),
  'vorzeichen-vergessen': fv('Rechnet mit den Beträgen richtig, gibt das Ergebnis aber ohne oder mit falschem Vorzeichen an.', 'Der Betrag stimmt. Prüfe noch das Vorzeichen: Liegt das Ergebnis links oder rechts von der Null?'),
  'richtung-vertauscht': fv('Geht an der Zahlengeraden in die falsche Richtung (Plus nach links, Minus nach rechts) oder verwechselt Zunahme und Abnahme.', 'Plus heißt: nach rechts, es wird mehr. Minus heißt: nach links, es wird weniger.'),
  'abstand-ueber-null': fv('Zieht beim Abstand zweier Zahlen mit verschiedenen Vorzeichen die Beträge voneinander ab, statt über die Null zu zählen.', 'Zähle die Schritte auf der Zahlengeraden: erst bis zur Null, dann weiter bis zur zweiten Zahl.'),
  'koord-vorzeichen': fv('Achtet im Koordinatensystem nicht auf das Vorzeichen einer Koordinate (links und rechts oder oben und unten verwechselt).', 'Eine negative x-Koordinate liegt links vom Nullpunkt. Eine negative y-Koordinate liegt unter dem Nullpunkt.'),
  // Klasse 7, Kapitel 2 (ADR 0044)
  'nebenwinkel-gleich': fv('Hält Nebenwinkel für gleich groß oder übernimmt den bekannten Winkel, statt ihn zu 180° zu ergänzen.', 'Liegen die beiden Winkel nebeneinander an einer Geraden? Dann ergeben sie zusammen 180°.'),
  'scheitel-neben-verwechselt': fv('Verwechselt Scheitelwinkel (gegenüber, gleich groß) und Nebenwinkel (nebeneinander, zusammen 180°).', 'Schau, wo die beiden Winkel liegen: gegenüber oder nebeneinander?'),
  'stufen-wechsel-verwechselt': fv('Verwechselt Stufenwinkel und Wechselwinkel oder nimmt einen Winkel in der falschen Lage an der zweiten Geraden.', 'Stufenwinkel liegen an beiden Geraden an derselben Stelle. Wechselwinkel liegen auf verschiedenen Seiten der schneidenden Geraden.'),
  'ohne-parallele': fv('Wendet die Sätze über Stufen- und Wechselwinkel an, obwohl die Geraden nicht parallel sind, oder schließt aus fast gleichen Winkeln auf Parallelität.', 'Stufen- und Wechselwinkel sind nur an parallelen Geraden gleich groß. Prüfe zuerst, ob die Geraden parallel sind.'),
  'gestreckt-voll': fv('Verwechselt den gestreckten Winkel (180°) mit dem Vollwinkel (360°).', 'Winkel nebeneinander an einer Geraden ergeben 180°. Erst rundherum um einen Punkt sind es 360°.'),
  'basiswinkel-falsch': fv('Hält im gleichschenkligen Dreieck die falschen Winkel für gleich groß (zum Beispiel den Winkel an der Spitze und einen Basiswinkel).', 'Die gleich großen Winkel liegen an der Basis, also an der Seite, die nicht Schenkel ist.'),
  'seite-ecke-vertauscht': fv('Verwechselt die Bezeichnungen im Dreieck: Die Seite a liegt nicht der Ecke A gegenüber oder der Winkel α nicht bei A.', 'Die Seite a liegt der Ecke A gegenüber. Der Winkel α liegt bei der Ecke A.'),
  'kongruenz-verwechselt': fv('Wählt den falschen Kongruenzsatz, weil die Lage des Winkels zu den Seiten nicht beachtet wird (sws und wsw, sws und SsW).', 'Schau genau: Liegt der Winkel zwischen den beiden Seiten, oder liegt die Seite zwischen den beiden Winkeln?'),
  'drei-winkel-eindeutig': fv('Meint, drei Winkel legen ein Dreieck eindeutig fest.', 'Zeichne zwei Dreiecke mit denselben Winkeln, eins klein und eins groß. Sind sie deckungsgleich?'),
  'dreiecksungleichung': fv('Hält ein Dreieck für konstruierbar, obwohl zwei Seiten zusammen nicht länger als die dritte sind.', 'Lege die beiden kürzeren Seiten an die längste. Treffen sie sich, wenn sie zusammen nur so lang sind?'),
  'hoehe-nicht-senkrecht': fv('Zeichnet die Höhe nicht senkrecht zur Seite (zum Beispiel senkrecht zum Heftrand oder zur Seitenmitte).', 'Die Höhe steht senkrecht auf der Seite. Lege das Geodreieck mit der Mittellinie auf die Seite.'),
  'hoehe-falsche-seite': fv('Zeichnet die Höhe von der falschen Ecke oder auf die falsche Seite, oder verlängert die Seite beim stumpfwinkligen Dreieck nicht.', 'Die Höhe h_c geht von der Ecke C aus und steht senkrecht auf der Seite c. Liegt ihr Fußpunkt außerhalb, verlängere die Seite.'),
  'mittelsenkrechte-nicht-mittig': fv('Zeichnet eine Senkrechte zur Strecke, die nicht durch die Mitte geht, oder eine Gerade durch die Mitte, die nicht senkrecht ist.', 'Die Mittelsenkrechte geht durch die Mitte der Strecke und steht senkrecht auf ihr.'),
  'winkelhalbierende-seitenmitte': fv('Zeichnet statt der Winkelhalbierenden die Linie von der Ecke zur Mitte der gegenüberliegenden Seite.', 'Die Winkelhalbierende teilt den Winkel in zwei gleich große Winkel. Sie trifft die Gegenseite meist nicht in der Mitte.'),
  'thales-durchmesser': fv('Sucht den rechten Winkel an der falschen Ecke oder nimmt eine Sehne, die nicht durch den Mittelpunkt geht, als Durchmesser des Thaleskreises.', 'Der rechte Winkel liegt an der Ecke auf dem Halbkreis. Die beiden anderen Ecken sind die Enden des Durchmessers.'),
  'ortslinie-verwechselt': fv('Verwechselt die Ortslinien: Kreis (fester Abstand zu einem Punkt), Mittelsenkrechte (gleicher Abstand zu zwei Punkten), Winkelhalbierende (gleicher Abstand zu zwei Geraden), Parallele (fester Abstand zu einer Geraden).', 'Lies die Bedingung genau: Abstand zu einem Punkt, zu zwei Punkten oder zu Geraden?'),
  'tangente-nicht-senkrecht': fv('Zeichnet die Tangente nicht senkrecht zum Radius im Berührpunkt.', 'Die Tangente berührt den Kreis in einem Punkt. Dort steht sie senkrecht auf dem Radius.'),
  'umkreis-inkreis-verwechselt': fv('Verwechselt Umkreis (Schnittpunkt der Mittelsenkrechten, durch die Ecken) und Inkreis (Schnittpunkt der Winkelhalbierenden, berührt die Seiten).', 'Der Umkreis geht durch alle Ecken. Der Inkreis berührt alle Seiten von innen.'),
  'innen-aussen-verwechselt': fv('Achtet nicht darauf, ob ein Punkt innerhalb oder außerhalb liegen soll (Kreis, Dreieck, Bereich).', 'Lies noch einmal: Soll der Punkt innen liegen, außen oder genau auf der Linie?'),
  'konstruktion-reihenfolge': fv('Bringt die Schritte einer Konstruktion oder einer Begründung in eine Reihenfolge, in der ein Schritt etwas benutzt, das es noch nicht gibt.', 'Prüfe jeden Schritt: Gibt es schon alles, was du dafür brauchst?'),
  // Klasse 6, Kapitel 3 (ADR 0045): Stolpersteine aus der Niveauübersicht (T03) und weitere Fehler beim Raumvorstellen
  'ecken-kanten-verwechselt': fv('Verwechselt Ecken, Kanten und Flächen eines Körpers (zählt zum Beispiel Kanten statt Ecken).', 'Ecken sind Punkte, Kanten sind Linien, Flächen sind die Seiten. Zeige beim Zählen auf jedes Teil.'),
  'verdeckt-nicht-gezaehlt': fv('Zählt nur die Ecken, Kanten oder Flächen, die im Bild sichtbar sind.', 'Denk an die Rückseite: Was ist hinten verdeckt? Die gestrichelten Linien helfen dir.'),
  'verdeckte-kante-durchgezogen': fv('Zeichnet verdeckte Kanten im Schrägbild durchgezogen oder lässt sie weg.', 'Kanten, die man von vorne nicht sieht, werden gestrichelt gezeichnet. Sie gehören trotzdem zum Bild.'),
  'tiefe-nicht-verkuerzt': fv('Zeichnet die Kanten nach hinten im Schrägbild nicht verkürzt oder nicht im Winkel von 45°.', '1 cm nach hinten ist eine Kästchendiagonale: ein Kästchen nach rechts und eins nach oben.'),
  'netz-nur-gezaehlt': fv('Prüft beim Netz nur, ob die Zahl der Flächen stimmt, nicht, wie sie liegen.', 'Falte das Netz in Gedanken. Liegen zwei Flächen aufeinander, fehlt eine andere.'),
  'riss-verwechselt': fv('Verwechselt die Ansichten: Grundriss (von oben), Aufriss (von vorne) und Seitenriss (von links).', 'Stell dir vor, du schaust genau von oben, von vorne oder von links auf den Körper.'),
  'riss-gespiegelt': fv('Zeichnet eine Ansicht spiegelverkehrt oder von der falschen Seite (zum Beispiel von hinten statt von vorne).', 'Was links vorne steht, steht in der Ansicht von vorne auch links.'),
  'wuerfel-verdeckt': fv('Zählt bei Würfelbauten nur die sichtbaren Würfel und vergisst verdeckte Würfel darunter oder dahinter.', 'Zähle Schicht für Schicht. Ein Würfel oben braucht einen Würfel darunter.'),
  'netz-ecken-gezaehlt': fv('Zählt Ecken oder Kanten im Netz statt am gefalteten Körper.', 'Beim Falten treffen sich mehrere Ecken des Netzes in einer Ecke des Körpers.'),
  'prisma-pyramide': fv('Verwechselt Prisma (zwei gleiche Vielecke, Rechtecke an den Seiten) und Pyramide (ein Vieleck, Dreiecke bis zur Spitze).', 'Hat der Körper oben eine Spitze? Dann ist es eine Pyramide. Hat er oben und unten dieselbe Fläche, ist es ein Prisma.'),
  'name-nach-seitenflaeche': fv('Benennt ein Prisma oder eine Pyramide nach der Form der Seitenflächen statt nach der Grundfläche.', 'Der Name richtet sich nach der Grundfläche: Hat sie fünf Ecken, ist es ein fünfseitiges Prisma.'),
  'gegenueber-benachbart': fv('Hält im Würfelnetz benachbarte Flächen für gegenüberliegend.', 'Zwei Flächen, die eine Kante gemeinsam haben, liegen nebeneinander. Gegenüber liegt die Fläche, die die andere nicht berührt.'),
  'runde-koerper-zaehlen': fv('Zählt bei Zylinder und Kegel die gekrümmte Fläche oder die Kreislinien nicht mit oder hält die Spitze für eine Kante.', 'Eine gekrümmte Fläche ist auch eine Fläche. Eine Kante ist dort, wo zwei Flächen zusammenstoßen.'),
  'koerper-verwechselt': fv('Verwechselt Körperformen (zum Beispiel Zylinder und Kegel oder Quader und Prisma).', 'Schau auf die Flächen: Wie viele sind es, sind sie eben oder gekrümmt?'),
  'wuerfel-kein-quader': fv('Meint, ein Würfel sei kein Quader.', 'Ein Quader hat sechs Rechtecke als Flächen. Ein Quadrat ist ein besonderes Rechteck. Also ist jeder Würfel ein Quader.'),
  'kanten-teilweise': fv('Nimmt bei der Kantenlänge eines Quaders nur die sichtbaren oder nur drei Kanten statt aller zwölf.', 'Ein Quader hat 12 Kanten, je 4 gleich lange. Rechne jede Länge viermal.'),
  'kante-falsch-abgelesen': fv('Liest die Länge an einer Kante ab, die nicht parallel zur gesuchten Kante ist.', 'Gleich lange Kanten eines Quaders sind parallel. Suche die beschriftete Kante, die in dieselbe Richtung zeigt.'),
  'kippen-richtung': fv('Kippt einen Körper in Gedanken in die falsche Richtung.', 'Lege einen Gegenstand vor dich und kippe ihn wirklich. Welche Fläche liegt danach unten?'),
  // Klasse 6, Kapitel 4 „Dezimalzahlen“ (Grilling mit Nils, 2026-11-25, ADR 0047)
  'dezimal-mehr-ziffern': fv('Hält die Dezimalzahl mit mehr Nachkommastellen für größer (0,705 viel größer als 0,7, 0,45 größer als 0,5).', 'Schreibe beide Zahlen mit gleich vielen Stellen nach dem Komma. Vergleiche dann Stelle für Stelle.'),
  'drittel-als-zehntel': fv('Schreibt ein Drittel als 0,3 oder zwei Drittel als 0,6, als ob der Nenner 10 wäre.', 'Rechne 1 : 3. Die Division geht nicht auf: Die 3 wiederholt sich immer weiter.'),
  'runden-abschneiden': fv('Schneidet die Stellen hinter der Rundungsstelle einfach ab, statt zu runden (4,38 auf Zehntel wird 4,3).', 'Schau auf die Ziffer rechts neben der Rundungsstelle. Ist sie 5 oder mehr, rundest du auf.'),
  'prozent-als-zaehler': fv('Nimmt den Zähler des Bruchs als Prozentzahl (3⁄5 als 3 %).', 'Prozent heißt Hundertstel. Erweitere den Bruch zuerst auf den Nenner 100.'),
  'periode-zu-frueh': fv('Setzt den Periodenstrich auch über Ziffern, die sich nicht wiederholen (1⁄6 als 0,1̅6̅ statt 0,16̅).', 'Schau genau: Welche Ziffern wiederholen sich immer wieder? Nur über sie kommt der Strich.'),
  // Klasse 6, Kapitel 5 „Rechnen mit Dezimalzahlen“ (ADR 0048)
  'komma-nicht-untereinander': fv('Schreibt die Zahlen beim schriftlichen Addieren und Subtrahieren rechtsbündig statt Komma unter Komma.', 'Schreibe Komma unter Komma. Dann stehen Zehntel unter Zehnteln und Hundertstel unter Hundertsteln.'),
  'mal-komma-wie-plus': fv('Setzt das Komma beim Multiplizieren wie beim Addieren (0,4 · 0,2 = 0,8).', 'Zähle die Stellen nach dem Komma in beiden Faktoren zusammen. So viele Stellen hat das Ergebnis.'),
  'stufe-null-angehaengt': fv('Hängt beim Multiplizieren mit 10, 100, 1000 eine Null an, statt das Komma zu verschieben (3,45 · 10 = 3,450).', 'Eine Null am Ende ändert eine Dezimalzahl nicht. Verschiebe das Komma um so viele Stellen, wie die Stufenzahl Nullen hat.'),
  'komma-falsche-richtung': fv('Verschiebt das Komma in die falsche Richtung (mal 10 nach links, durch 10 nach rechts).', 'Mal 10 macht die Zahl größer: Das Komma wandert nach rechts. Durch 10 macht sie kleiner: Es wandert nach links.'),
  'div-ein-komma-verschoben': fv('Verschiebt beim Dividieren durch eine Dezimalzahl das Komma nur im Divisor.', 'Verschiebe das Komma im Dividenden und im Divisor um gleich viele Stellen. Dann bleibt das Ergebnis gleich.'),
  'div-komma-vergessen': fv('Setzt beim Dividieren das Komma im Ergebnis nicht oder an der falschen Stelle.', 'Setze im Ergebnis das Komma, sobald du beim Dividenden das Komma überschreitest. Prüfe mit einem Überschlag.'),
  'endnull-nicht-ergaenzt': fv('Ergänzt beim Subtrahieren keine Endnullen und schreibt die Ziffern der unteren Zahl einfach ab (5 − 2,35 = 3,35).', 'Ergänze oben Endnullen, bis beide Zahlen gleich viele Stellen nach dem Komma haben. Dann ziehe Stelle für Stelle ab.'),
  'div-macht-kleiner': fv('Meint, Dividieren macht immer kleiner, auch beim Teilen durch eine Zahl kleiner als 1.', 'Überlege, wie oft der Divisor in die Zahl passt. 0,5 passt in 3 sechsmal hinein.'),
  'periode-abgebrochen': fv('Bricht eine periodische Dezimalzahl ab und schreibt sie ohne Periode (2⁄3 als 0,6 oder 0,66).', 'Rechne weiter: Kommt derselbe Rest wieder, wiederholen sich die Ziffern ohne Ende. Dann setzt du den Strich.'),
};
for (const [id, f] of Object.entries(fehlvorstellungen)) {
  if (!KIND[id]) throw new Error(`Fehlvorstellung ${id} hat keinen Kindersatz`);
  f.kind = KIND[id];
}

// ---------- Bausteine ----------
// Einfache Sprache: jeder Satz in einer eigenen Zeile.
export const Z = (...zeilen) => zeilen.filter((z) => z != null && z !== false).join('\n');
export const h3 = (tipp, beispiel, loesungsschritt) => ({ tipp, beispiel, loesungsschritt });
export const h2 = (tipp, loesungsschritt) => ({ tipp, loesungsschritt });
export const h1 = (tipp) => ({ tipp });

// `extra`: { einheit, bild, nachweis, ziffernfelder }. Als Text gilt es als Einheit (alte Schreibweise).
const mit = (extra) => (typeof extra === 'string' ? { einheit: extra } : Object.fromEntries(Object.entries(extra ?? {}).filter(([, v]) => v != null)));
export const zahl = (text, loesung, typischeFehler, hilfen, extra) => ({ format: 'zahl', text, loesung, typischeFehler: typischeFehler ?? [], hilfen, ...mit(extra) });
export const opt = (text, richtig = false, fehlvorstellung) => ({ text, richtig, ...(fehlvorstellung ? { fehlvorstellung } : {}) });
export const auswahl = (text, optionen, hilfen, extra) => ({
  format: 'auswahl', text, mehrfach: extra === true || extra?.mehrfach === true, optionen: mische(optionen), hilfen,
  ...(typeof extra === 'object' ? mit({ ...extra, mehrfach: undefined }) : {}),
});
const lueckenVon = (werte) => Object.fromEntries(Object.entries(werte).map(([n, w]) => [n, Array.isArray(w) ? { loesung: w[0], typischeFehler: w[1] ?? [] } : { loesung: w, typischeFehler: [] }]));
// Lückentext: Im Text stehen {{name}}, `werte` nennt je Lücke die Lösung oder [Lösung, typische Fehler].
export const luecken = (text, werte, hilfen, extra) => ({ format: 'luecken', text, luecken: lueckenVon(werte), hilfen, ...mit(extra) });
export const L = (name) => ({ luecke: name });
export const tabelle = (text, kopf, zeilen, werte, hilfen, extra) => ({
  format: 'tabelle', text,
  tabelle: { kopf: kopf.map(String), zeilen: zeilen.map((z) => z.map((c) => (typeof c === 'object' ? c : String(c)))) },
  luecken: lueckenVon(werte), hilfen, ...mit(extra),
});
export const teil = (text, loesung, einheit, typischeFehler = []) => ({ format: 'zahl', text, loesung, ...(einheit ? { einheit } : {}), typischeFehler });
export const sach = (text, teile, hilfen, extra) => ({ format: 'sachaufgabe', text, teile, hilfen, ...mit(extra) });
// Säulendiagramm: d = { titel, einheit, max, schritt, hilfslinien?, werteZeigen?, saeulen: [[name, wert]] }
export const diagramm = (text, d, teile, hilfen, extra) => ({ format: 'diagramm', text, diagramm: { ...d, saeulen: d.saeulen.map(([name, wert]) => ({ name, wert })) }, teile, hilfen, ...mit(extra) });
// Strichliste anlegen: zeilen = [[name, loesung, start?]]. buendeln: 'auto' (der fünfte Strich wird von selbst quer gesetzt, F und G)
// oder 'selbst' (das Kind setzt den Querstrich selbst, M und E).
export const strichlisteAnlegen = (text, zeilen, buendeln, hilfen, extra) => ({ format: 'strichliste', text, buendeln,
  zeilen: zeilen.map(([name, loesung, start]) => ({ name, loesung, ...(start ? { start } : {}) })), hilfen, ...mit(extra) });
// Säulendiagramm zeichnen: d = { titel, einheit, max, schritt, fein, saeulen: [[name, wert, art]] } mit art 'offen' (zu zeichnen),
// eine Zahl (offen, steht schon auf dieser falschen Höhe) oder fehlend (vorgegeben).
export const zeichnen = (text, d, hilfen, extra) => ({ format: 'zeichnen', text,
  diagramm: { ...d, saeulen: d.saeulen.map((x) => (Array.isArray(x) ? x : null)).map((x, i) => x === null ? { ...d.saeulen[i] } : (([name, wert, art]) => ({ name, wert, ...(art === 'offen' ? { offen: true } : typeof art === 'number' ? { offen: true, start: art } : {}) }))(x)) },
  hilfen, ...mit(extra) });
export const zuordnen = (text, paare, hilfen, extra) => ({ format: 'zuordnen', text, paare: paare.map(([links, rechts]) => ({ links: String(links), rechts: String(rechts) })), hilfen, ...mit(extra) });
export const strahl = (eingabe, text, bild, loesung, typischeFehler, hilfen, extra) => ({ format: 'zahlenstrahl', eingabe, text, strahl: bild, loesung, typischeFehler: typischeFehler ?? [], hilfen, ...mit(extra) });

// ---------- Kapitel 2: Natürliche Zahlen ----------
// Ordnen: `richtig` ist die verlangte Reihenfolge (Texte). Die Karten liegen gemischt da, nie schon richtig.
// extra: { umgekehrt (Fehlvorstellung, wenn genau falsch herum sortiert), links, rechts (Beschriftung der Enden) }
export function ordnen(text, richtig, hilfen, extra) {
  const loesung = richtig.map(String);
  let karten = mische(loesung);
  for (let i = 0; i < 50 && (karten.join() === loesung.join() || karten.join() === [...loesung].reverse().join()); i++) karten = mische(loesung);
  return { format: 'ordnen', text, karten, loesung, hilfen, ...mit(extra) };
}
// Zeichenfolge: römische Zahlzeichen oder eine Zahl im Zweiersystem. typischeFehler: [[zeichen, fehlvorstellung]]
export const ROEMISCH_TASTEN = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
export function zeichen(text, loesung, tasten, typischeFehler, hilfen, extra) {
  const gesehen = new Set([loesung]);
  const fehler = (typischeFehler ?? []).filter(([w]) => w && !gesehen.has(w) && gesehen.add(w)).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
  return { format: 'zeichen', text, loesung, tasten, typischeFehler: fehler, hilfen, ...mit(extra) };
}
// Schätzen ab M: Die Lösung ist die wahre Anzahl im Schätzbild, richtig ist alles im Schätzbereich (20 % nach oben und unten).
// typischeFehler: [[von, bis, fehlvorstellung]]
export const SCHAETZ_ANTEIL = 5; // ein Fünftel
export function schaetzen(text, bild, einheit, typischeFehler, hilfen, extra) {
  const n = summe(bild.felder.flat());
  return { format: 'schaetzen', text, bild, loesung: n, bereich: [Math.ceil(n - n / SCHAETZ_ANTEIL), Math.floor(n + n / SCHAETZ_ANTEIL)], einheit,
    typischeFehler: (typischeFehler ?? []).map(([von, bis, fehlvorstellung]) => ({ von, bis, fehlvorstellung })), hilfen, ...mit(extra) };
}
// Stellenwerttafel zum Eintragen: spalten = Namen, zeilen = Ziffern, '' oder L(name). gruppen: [[name, spaltenzahl]] für die Dreierblöcke.
export function stellentafel(text, spalten, zeilen, werte, hilfen, extra, gruppen) {
  const t = tabelle(text, spalten, zeilen, werte, hilfen, extra);
  t.tabelle.art = 'stellentafel';
  if (gruppen) t.tabelle.gruppen = gruppen.map(([name, n]) => ({ name, spalten: n }));
  return t;
}
// ---------- Kapitel 6: Größen und Sachaufgaben (ADR 0033) ----------
// Größe eingeben: Die Lösung steht in der kleinsten Einheit (Cent, Millimeter, Milligramm, Sekunde). `einheit` ist die Einheit der Anzeige.
// extra.einheiten: Das Kind wählt die Einheit selbst aus dieser Liste (ab M). typischeFehler: [[wert in der kleinsten Einheit, fehlvorstellung]]
export const groesse = (text, art, loesung, einheit, typischeFehler, hilfen, extra) => ({ format: 'groesse', text, groesse: art, loesung, einheit,
  typischeFehler: fehlerliste(loesung, (typischeFehler ?? []).filter(([w]) => w > 0)), hilfen, ...mit(extra) });
// Nachweis mit Größen: G('3 · 250 g = 750 g') ist eine Rechnung, G(rechnung, 2) gehört zu Teil 2 einer Sachaufgabe.
export const G = (rechnung, teil) => (teil ? { art: 'groesse', rechnung, teil } : rechnung);
// Eine Größe, die das Bild zeigt (Geld, Uhr, Waage, Karte).
export const BG = (groesseText, teil) => ({ art: 'bildgroesse', groesse: groesseText, ...(teil ? { teil } : {}) });
export const HILFSGROESSE = (groesseText, grund) => ({ groesse: groesseText, grund });
export const UEBRIG = (groesseText) => ({ groesse: groesseText, grund: 'überflüssige Angabe' });
// Auswahl als Teil einer Sachaufgabe: art 'angaben' (wichtige Angaben, mehrfach), 'rechnung', 'antwort' oder 'fehlt'.
export const teilWahl = (art, text, optionen, mehrfach = false) => ({ art, text, optionen: mische(optionen), ...(mehrfach ? { mehrfach: true } : {}) });
// Einheitentafel zum Eintragen: gruppen [[einheit, spaltenzahl]], kopf je Spalte ('H', 'Z', 'E' oder ''), zeilen aus Ziffern, '' oder L(name).
// ablesen: { text, luecke, einheit } fragt unter der Tafel nach der Größe in einer Einheit.
export function einheitentafel(text, gruppen, kopf, zeilen, werte, hilfen, extra, ablesen) {
  const t = tabelle(text, kopf, zeilen, werte, hilfen, extra);
  t.tabelle.art = 'einheitentafel';
  t.tabelle.gruppen = gruppen.map(([name, n]) => ({ name, spalten: n }));
  if (ablesen) t.tabelle.ablesen = ablesen;
  return t;
}
// Tabelle, in der jede Zeile dieselbe Größe in den Einheiten der Kopfzeile zeigt.
export function umwandeltabelle(text, kopf, zeilen, werte, hilfen, extra) {
  const t = tabelle(text, kopf, zeilen, werte, hilfen, extra);
  t.tabelle.art = 'umwandeln';
  return t;
}
// Schätzen mit Vergleichsgröße ab M: `loesung` ist das genaue Maß in `einheit`, richtig ist alles im Schätzbereich.
export const schaetzeGroesse = (text, bild, loesung, einheit, typischeFehler, hilfen, extra) => ({ format: 'schaetzen', text, bild, loesung,
  bereich: [Math.ceil(loesung - loesung / SCHAETZ_ANTEIL), Math.floor(loesung + loesung / SCHAETZ_ANTEIL)], einheit,
  typischeFehler: (typischeFehler ?? []).filter(([von, bis]) => von <= bis).map(([von, bis, fehlvorstellung]) => ({ von, bis, fehlvorstellung })), hilfen, ...mit(extra) });

// Stellenwerte bis zur Billion und die Dreierblöcke dazu.
export const STELLEN15 = ['HB', 'ZB', 'B', 'HMd', 'ZMd', 'Md', 'HM', 'ZM', 'M', 'HT', 'ZT', 'T', 'H', 'Z', 'E'];
export const BLOCKNAMEN = ['Billionen', 'Milliarden', 'Millionen', 'Tausender', 'Einer'];
export const stellenFuer = (anzahl) => STELLEN15.slice(-anzahl);
export const bloeckeFuer = (anzahl) => { const n = Math.ceil(anzahl / 3); return BLOCKNAMEN.slice(-n).map((name, i) => [name, i === 0 ? anzahl - 3 * (n - 1) : 3]); };
// Zahlwort nach deutscher Rechtschreibung: bis 999 999 zusammen, Millionen und mehr als eigene Wörter.
const EINER = ['', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'];
const ZEHNER = ['', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
const bis999 = (n, ende) => {
  const h = Math.floor(n / 100), r = n % 100;
  const rest = r === 0 ? '' : r === 1 ? (ende ? 'eins' : 'ein') : r < 20 ? EINER[r] : `${r % 10 ? `${EINER[r % 10]}und` : ''}${ZEHNER[Math.floor(r / 10)]}`;
  return `${h ? `${EINER[h]}hundert` : ''}${rest}`;
};
export function zahlwort(n) {
  if (n === 0) return 'null';
  const teile = [];
  for (const [wert, eins, viele] of [[1e12, 'eine Billion', 'Billionen'], [1e9, 'eine Milliarde', 'Milliarden'], [1e6, 'eine Million', 'Millionen']]) {
    const k = Math.floor(n / wert) % 1000;
    if (k) teile.push(k === 1 ? eins : `${bis999(k, false)} ${viele}`);
  }
  const t = Math.floor(n / 1000) % 1000, e = n % 1000;
  const klein = `${t ? `${bis999(t, false)}tausend` : ''}${e ? bis999(e, true) : ''}`;
  if (klein) teile.push(klein);
  return teile.join(' ');
}
// Römische Zahlzeichen (1 bis 3999) und Zweiersystem.
const ROEM = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
export const roemisch = (n) => { let t = ''; for (const [w, z] of ROEM) while (n >= w) { t += z; n -= w; } return t; };
// Typischer Fehler: nur zusammenzählen, ohne abzuziehen (9 wird VIIII, 40 wird XXXX).
export const roemischNurAddiert = (n) => { let t = ''; for (const [w, z] of ROEM.filter(([, x]) => x.length === 1)) while (n >= w) { t += z; n -= w; } return t; };
export const roemWert = (t) => [...t].reduce((s, c) => s + ROEM.find(([, z]) => z === c)[0], 0);
export const dual = (n) => n.toString(2);
export const TIEF2 = '₂';
// Rundet kaufmännisch auf 10, 100, 1000 …
export const rundeAuf = (n, auf) => Math.floor((n + auf / 2) / auf) * auf;
export const STELLENNAME = { 10: 'Zehner', 100: 'Hunderter', 1000: 'Tausender', 10000: 'Zehntausender', 100000: 'Hunderttausender', 1000000: 'Millionen' };

// ---------- Kapitel 5: Geometrie auf dem Karogitter (ADR 0032) ----------
// Ein Gitter ist b Kästchen breit und h hoch. Punkte [x, y] in Kästchen, y nach oben. Mit achsen: true ist es ein Koordinatensystem.
export const GT = (b, h, teile = {}) => ({ b, h, ...teile });
export const PT = (n, x, y, pos) => ({ n, x, y, ...(pos ? { pos } : {}) });
export const LN = (n, a, b, art = 'gerade', stil) => ({ ...(n ? { n } : {}), a, b, art, ...(stil ? { stil } : {}) });
export const FG = (n, ecken, stil) => ({ ...(n ? { n } : {}), ecken, ...(stil ? { stil } : {}) });
export const ACHSE = (a, b) => LN(null, a, b, 'gerade', 'achse');
const fehlerPunkte = (loesung, liste) => (liste ?? []).filter(([punkte]) => punkte.length && JSON.stringify([...punkte].sort()) !== JSON.stringify([...loesung].sort())).map(([punkte, fehlvorstellung]) => ({ punkte, fehlvorstellung }));
// Gitterzeichnen: Punkte setzen. fehler: [[punkte, fehlvorstellung]]
export const gitterPunkte = (text, gitter, loesung, fehler, hilfen, extra) => ({ format: 'gitter', eingabe: 'punkte', text, gitter, loesung, typischeFehler: fehlerPunkte(loesung, fehler), hilfen, ...mit(extra) });
// Gitterzeichnen: Kästchen färben (linke untere Ecke jedes Kästchens).
export const gitterZellen = (text, gitter, loesung, fehler, hilfen, extra) => ({ format: 'gitter', eingabe: 'zellen', text, gitter, loesung, typischeFehler: fehlerPunkte(loesung, fehler), hilfen, ...mit(extra) });
// Gitterzeichnen: eine Linie durch zwei Punkte. art 'gerade' oder 'strecke', bedingung siehe src/schueler/geo.js, beispiel: zwei Punkte, die sie erfüllen.
// fehler: [[bedingung, fehlvorstellung, beispiel]]
export const gitterLinie = (text, gitter, art, bedingung, beispiel, fehler, hilfen, extra) => ({ format: 'gitter', eingabe: 'linie', linie: art, text, gitter, bedingung, beispiel,
  typischeFehler: (fehler ?? []).map(([b, fehlvorstellung, bsp]) => ({ bedingung: b, fehlvorstellung, ...(bsp ? { beispiel: bsp } : {}) })), hilfen, ...mit({ nachweis: [{ art: 'linie' }], ...extra }) });

// ---------- Kapitel 7: Kreis und Winkel (ADR 0034) ----------
// Gitterzeichnen: ein Kreis. Erst der Mittelpunkt m, dann ein Punkt auf der Kreislinie. r in Kästchen. fehler: [[{ r, m? }, fehlvorstellung]]
export const gitterKreis = (text, gitter, m, r, beispiel, fehler, hilfen, extra) => ({ format: 'gitter', eingabe: 'kreis', text, gitter, bedingung: { art: 'kreis', m, r }, beispiel: [m, beispiel],
  // Derselbe falsche Kreis zählt nur einmal (bei r = 1 ist der doppelte Radius auch r + 1); der richtige Kreis ist nie ein Fehler.
  typischeFehler: (fehler ?? []).filter(([b], i, l) => (b.r !== r || (b.m && String(b.m) !== String(m))) && l.findIndex(([x]) => x.r === b.r && String(x.m ?? m) === String(b.m ?? m)) === i)
    .map(([b, fehlvorstellung]) => ({ bedingung: b, fehlvorstellung })), hilfen, ...mit(extra) });
// ---------- Kapitel 8: Flächeninhalt und Umfang (ADR 0035) ----------
// Kästchen färben mit einer Bedingung statt einer festen Lösung: bedingung { art: 'flaeche', n?, umfang?, rechteck? }.
// `beispiel` sind Kästchen, die die Bedingung erfüllen (für das Lösungsbild). fehler: [[bedingung, fehlvorstellung]]
export const gitterFlaeche = (text, gitter, bedingung, beispiel, fehler, hilfen, extra) => ({ format: 'gitter', eingabe: 'zellen', text, gitter, bedingung: { art: 'flaeche', ...bedingung }, loesung: beispiel,
  typischeFehler: (fehler ?? []).map(([b, fehlvorstellung]) => ({ bedingung: { art: 'flaeche', ...b }, fehlvorstellung })), hilfen, ...mit({ nachweis: [{ art: 'zellen' }], ...extra }) });
// ---------- Kapitel 9: Brüche und Dezimalzahlen (ADR 0036) ----------
// Ein Bruch steht im Text als „3⁄4“ (Bruchstrich U+2044), eine gemischte Zahl als „1 3⁄4“ mit schmalem geschütztem Leerzeichen.
export const br = (z, n, g = 0) => `${g ? `${g}\u202f` : ''}${z}\u2044${n}`;
// Brucheingabe: Lösung als Bruchtext. typischeFehler: [[bruchtext, fehlvorstellung]]. extra: { genau, einheit, bild, nachweis }
export function bruch(text, loesung, typischeFehler, hilfen, extra) {
  const gesehen = new Set([loesung]);
  const fehler = (typischeFehler ?? []).filter(([w]) => w && !gesehen.has(w) && gesehen.add(w)).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
  return { format: 'bruch', text, loesung, ...(loesung.includes('\u202f') ? { gemischt: true } : {}), typischeFehler: fehler, hilfen, ...mit(extra) };
}
// Teile färben: figur { form, teile | reihen + spalten, ganze? }, ziel ist der Bruch aus dem Text, loesung die Anzahl der Teile.
export const faerben = (text, figur, ziel, loesung, typischeFehler, hilfen, extra) => ({ format: 'faerben', text, faerben: figur, loesung,
  typischeFehler: fehlerliste(loesung, typischeFehler ?? []), hilfen, ...mit({ nachweis: [{ art: 'faerben', ziel }], ...extra }) });
// Dezimalzahl eingeben: Lösung als Text („0,25“). typischeFehler: [[text, fehlvorstellung]] oder fertige Einträge { wert, fehlvorstellung }
export function dezimal(text, loesung, typischeFehler, hilfen, extra) {
  if (/^\d+$/.test(String(loesung))) loesung = Number(loesung);
  const gesehen = new Set([loesung]);
  const fehler = (typischeFehler ?? []).map((f) => (Array.isArray(f) ? { wert: f[0], fehlvorstellung: f[1] } : f)).filter((f) => f.wert != null && !gesehen.has(String(f.wert)) && gesehen.add(String(f.wert)));
  return { format: 'zahl', text, loesung, typischeFehler: fehler, hilfen, ...mit(extra) };
}
// Klasse 6, Kapitel 4 (ADR 0047): periodische Dezimalzahl. Im Text steht über jeder Ziffer der Periode ein Strich (U+0305): „0,16̅“.
export const PERIODE = '\u0305';
export const periodisch = (vor, periode) => `${vor}${[...String(periode)].map((z) => z + PERIODE).join('')}`;
// Eingabe in zwei Feldern: Ziffern vor der Periode („0,1“) und die Periode („6“). typischeFehler: [[text, fehlvorstellung]],
// der Text darf abbrechen („0,6“) oder periodisch sein („0,1̅6̅“). extra: { bild, nachweis, division }
export function periode(text, vor, per, typischeFehler, hilfen, extra) {
  const loesung = periodisch(vor, per), gesehen = new Set([loesung]);
  const fehler = (typischeFehler ?? []).filter(([w]) => w && !gesehen.has(w) && gesehen.add(w)).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
  return { format: 'periode', text, loesung, typischeFehler: fehler, hilfen, ...mit(extra) };
}
// Stellenwerttafel mit Komma zum Eintragen: spalten wie ['Z', 'E', 'z', 'h'], das Komma steht nach der Spalte E.
export function kommatafel(text, spalten, zeilen, werte, hilfen, extra) {
  const t = tabelle(text, spalten, zeilen, werte, hilfen, extra);
  t.tabelle.art = 'stellentafel';
  t.tabelle.komma = spalten.indexOf('E');
  return t;
}
// Winkeldrehen: feld { b, h, s, von, l, punkte?, umlegen? }, loesung in Grad gegen den Uhrzeigersinn. typischeFehler: [[grad, fehlvorstellung]]
export const winkelDrehen = (text, feld, loesung, typischeFehler, hilfen, extra) => ({ format: 'winkel', text, winkelfeld: feld, loesung, toleranz: 2,
  typischeFehler: (typischeFehler ?? []).filter(([w]) => Math.min(Math.abs(w - loesung), 360 - Math.abs(w - loesung)) > 2).filter(([w], i, l) => l.findIndex(([x]) => x === w) === i).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung })), hilfen, ...mit(extra) });

// Stellenraster: schriftliches Rechnen mit einem Feld je Stelle (Niveaustufe F).
// `zeichen` ist '+' oder '−'. Bei einem Tausch oder Übertrag steht er schon im Raster (`hilfe`: true).
const STELLEN = ['E', 'Z', 'H', 'T'];
export function raster(text, zeichen, a, b, hilfen, { hilfe = false, extra } = {}) {
  const unten = Array.isArray(b) ? b : [b];
  if (zeichen === '−' && unten.length !== 1) throw new Error('Raster: Minus nur mit zwei Zahlen');
  const ergebnis = zeichen === '+' ? a + summe(unten) : a - unten[0];
  const n = Math.max(...[a, ...unten, ergebnis].map((x) => String(x).length));
  const stellen = (x) => String(x).padStart(n, '0').split('').map(Number);
  const kopf = ['', ...STELLEN.slice(0, n).reverse()];
  const zeilen = [['', ...ziffern(a, n)]];
  if (hilfe && zeichen === '−') {
    // Getauscht: Wo die obere Ziffer zu klein ist, steht sie um 10 größer, die Stelle links davon um 1 kleiner.
    const oben = stellen(a), u = stellen(unten[0]);
    for (let i = n - 1; i > 0; i--) if (oben[i] < u[i]) { oben[i] += 10; oben[i - 1] -= 1; }
    zeilen.push(['getauscht', ...oben.map((x, i) => (i < n - String(a).length ? '' : x))]);
  }
  for (const x of unten) zeilen.push([zeichen, ...ziffern(x, n)]);
  if (hilfe && zeichen === '+') {
    // Gemerkt: der Zehner aus einer Spalte, eingetragen in der Spalte links daneben.
    const gemerkt = Array(n).fill('');
    let u = 0;
    for (let i = n - 1; i >= 0; i--) {
      const s = summe([a, ...unten].map((x) => stellen(x)[i])) + u;
      u = Math.floor(s / 10); if (u && i > 0) gemerkt[i - 1] = u;
    }
    zeilen.push(['gemerkt', ...gemerkt]);
  }
  const namen = STELLEN.slice(0, n).reverse().map((s) => s.toLowerCase());
  const loesung = stellen(ergebnis);
  zeilen.push(['Ergebnis', ...namen.map((name) => L(name))]);
  const t = tabelle(text, kopf, zeilen, Object.fromEntries(namen.map((name, i) => [name, loesung[i]])), hilfen,
    { nachweis: [`${[a, ...unten].join(` ${zeichen} `)} = ${ergebnis}`], ...extra });
  t.tabelle.art = 'raster';
  t.tabelle.rechnung = { zeichen, zahlen: [a, ...unten], ergebnis };
  return t;
}

// Klasse 6, Kapitel 5 (ADR 0048): Rechenraster mit Kommaspalte für das schriftliche Addieren und Subtrahieren von Dezimalzahlen.
// zahlen sind Texte („2,35“). Komma steht unter Komma. Fehlende Stellen nach dem Komma sind Endnullen: auf F grau vorgezeichnet
// ({ endnull: true }), auf G ein kleines Notizfeld ({ notiz: true }), das nicht bewertet wird. Die Lücken sind die Ziffern des Ergebnisses.
const SPALTEN_GANZ = ['T', 'H', 'Z', 'E'], SPALTEN_NACH = ['z', 'h', 't'];
const dezTeile = (t) => { const [g, n = ''] = String(t).split(','); return { g, n }; };
const dezWert = (t) => { const { g, n } = dezTeile(t); return { z: Number(g + n), k: n.length }; };
const dezText = (z, k) => { const s = String(z).padStart(k + 1, '0'); return k ? `${s.slice(0, -k)},${s.slice(-k)}` : s; };
export function rasterKomma(text, zeichen, zahlen, hilfen, { endnullen = 'grau', extra } = {}) {
  if (zeichen === '−' && zahlen.length !== 2) throw new Error('Raster: Minus nur mit zwei Zahlen');
  const m = Math.max(...zahlen.map((x) => dezTeile(x).n.length));
  const auf = zahlen.map((x) => dezWert(x)).map(({ z, k }) => z * 10 ** (m - k));
  const e = zeichen === '+' ? summe(auf) : auf[0] - auf[1];
  if (e < 0) throw new Error('Raster: negatives Ergebnis');
  const ergebnis = dezText(e, m);
  const n = Math.max(...[...zahlen, ergebnis].map((x) => dezTeile(x).g.length));
  const kopf = ['', ...SPALTEN_GANZ.slice(-n), ',', ...SPALTEN_NACH.slice(0, m)];
  const zeile = (x, vorne) => { const { g, n: nach } = dezTeile(x);
    return [vorne, ...g.padStart(n, ' ').split('').map((c) => (c === ' ' ? '' : c)), ',', ...Array.from({ length: m }, (_, i) => (i < nach.length ? nach[i] : endnullen === 'grau' ? { endnull: true } : endnullen === 'notiz' ? { notiz: true } : ''))]; };
  const zeilen = zahlen.map((x, i) => zeile(x, i === 0 ? '' : zeichen));
  const { g: eg, n: en } = dezTeile(ergebnis), werte = {};
  const ganzFelder = eg.padStart(n, ' ').split('').map((c, i) => { if (c === ' ') return ''; werte[`g${i}`] = Number(c); return L(`g${i}`); });
  const nachFelder = en.split('').map((c, i) => { werte[`n${i}`] = Number(c); return L(`n${i}`); });
  zeilen.push(['Ergebnis', ...ganzFelder, ',', ...nachFelder]);
  const t = tabelle(text, kopf, zeilen, werte, hilfen, { nachweis: [`${zahlen.join(` ${zeichen} `)} = ${ergebnis.replace(/,?0+$/, '') || '0'}`], ...mit(extra) });
  t.tabelle.zeilen = zeilen;
  t.tabelle.art = 'raster';
  t.tabelle.komma = kopf.indexOf(',');
  t.tabelle.rechnung = { zeichen, zahlen, ergebnis };
  return t;
}
// Klasse 6, Kapitel 5 (ADR 0048): Dezimalzahlen schriftlich multiplizieren. Im Raster wird ohne Komma gerechnet,
// darunter setzt das Kind das Komma in einem eigenen Feld („2,3 · 1,4 = ▢“). typischeFehler: [[text, fehlvorstellung]] für dieses Feld.
export function rasterMalKomma(text, a, b, hilfen, { fehler = [], extra } = {}) {
  const [x, y] = [a, b].map((t) => Number(String(t).replace(',', '')));
  const kx = dezTeile(a).n.length, ky = dezTeile(b).n.length;
  const produkt = dezText(x * y, kx + ky).replace(/(,\d*?)0+$/, '$1').replace(/,$/, '');
  const t = rasterMal(text, x, y, hilfen, { extra });
  t.nachweis = [...t.nachweis, `${a} · ${b} = ${produkt}`];
  t.tabelle.ablesen = { text: `${a} · ${b} =`, luecke: 'k' };
  const gesehen = new Set([produkt]);
  t.luecken.k = { loesung: /,/.test(produkt) ? produkt : Number(produkt), typischeFehler: fehler.filter(([w]) => w != null && !gesehen.has(String(w)) && gesehen.add(String(w))).map(([wert, fehlvorstellung]) => ({ wert: /^\d+$/.test(String(wert)) ? Number(wert) : wert, fehlvorstellung })) };
  return t;
}

// Zahlenmauer: `unten` ist die unterste Reihe. Jeder Stein ist die Summe (bei '·' das Produkt) der beiden Steine darunter.
// `offen` nennt die Steine mit Eingabefeld als [reihe, stelle], Reihe 0 ist die unterste. Die Lücken heißen a, b, c … von oben nach unten.
export function mauer(text, rechenart, unten, offen, hilfen, extra) {
  const op = rechenart === '·' ? (x, y) => x * y : (x, y) => x + y;
  const reihen = [unten];
  while (reihen.at(-1).length > 1) { const r = reihen.at(-1); reihen.push(r.slice(1).map((x, i) => op(r[i], x))); }
  const frei = new Set(offen.map(([r, st]) => `${r},${st}`));
  if (frei.size !== offen.length || offen.some(([r, st]) => !reihen[r] || st >= reihen[r].length)) throw new Error('Mauer: Stein gibt es nicht');
  const werte = {};
  let k = 0;
  const zeilen = [...reihen.keys()].reverse().map((ri) => reihen[ri].map((x, st) => {
    if (!frei.has(`${ri},${st}`)) return String(x);
    const name = 'abcdefghij'[k++]; werte[name] = x; return L(name);
  }));
  const nachweis = reihen.slice(1).flatMap((r, i) => r.map((x, st) => `${reihen[i][st]} ${rechenart} ${reihen[i][st + 1]} = ${x}`));
  const t = tabelle(text, [], zeilen, werte, hilfen, { nachweis, ...mit(extra) });
  t.tabelle.art = 'mauer';
  t.tabelle.rechenart = rechenart;
  return t;
}
// Malkreuz: `links` ist die Zerlegung des ersten Faktors (je Zeile), `oben` die des zweiten (je Spalte).
// Die Teilprodukte und ihre Summe trägt der Schüler ein. `gegeben` nennt Felder [zeile, spalte], die schon ausgefüllt sind.
export function malkreuz(text, links, oben, hilfen, { gegeben = [], extra, fehler = [] } = {}) {
  const x = summe(links), y = summe(oben), werte = {};
  const fest = new Set(gegeben.map(([i, j]) => `${i},${j}`));
  const zeilen = links.map((l, i) => [String(l), ...oben.map((o, j) => {
    if (fest.has(`${i},${j}`)) return String(l * o);
    werte[`p${i}${j}`] = l * o; return L(`p${i}${j}`);
  })]);
  werte.e = [x * y, fehler];
  const teile = links.flatMap((l) => oben.map((o) => l * o));
  const nachweis = [...links.flatMap((l) => oben.map((o) => `${l} · ${o} = ${l * o}`)), `${teile.join(' + ')} = ${x * y}`, `${x} · ${y} = ${x * y}`];
  const t = tabelle(text, ['·', ...oben], zeilen, werte, hilfen, { nachweis, ...mit(extra) });
  t.tabelle.art = 'malkreuz';
  t.tabelle.rechnung = { faktoren: [x, y], summe: 'e' };
  return t;
}
// Rechenraster für das schriftliche Multiplizieren, so wie im Heft: oben a · b, darunter je Ziffer von b ein Teilprodukt,
// das unter dieser Ziffer endet, und zuletzt das Ergebnis. Bei einem einstelligen b ist das Teilprodukt schon das Ergebnis.
// `vorgegeben` füllt die Teilprodukte schon aus (nur das Ergebnis ist gesucht).
export function rasterMal(text, a, b, hilfen, { vorgegeben = false, extra } = {}) {
  const bz = String(b).split('').map(Number), m = bz.length, la = String(a).length, breite = la + 1 + m;
  if (m > 1 && bz.includes(0)) throw new Error('Raster: keine 0 im zweiten Faktor');
  const werte = {};
  const zeile = (zahl, ende, name, offen = true) => {
    const z = String(zahl), anfang = ende - z.length + 1;
    if (anfang < 0) throw new Error('Raster zu schmal');
    return Array.from({ length: breite }, (_, i) => {
      if (i < anfang || i > ende) return '';
      const ziffer = Number(z[i - anfang]);
      if (!offen) return String(ziffer);
      werte[`${name}${i}`] = ziffer; return L(`${name}${i}`);
    });
  };
  const zeilen = [[...String(a).split(''), '·', ...String(b).split('')]];
  const teile = bz.map((d) => a * d);
  if (m > 1) teile.forEach((p, i) => zeilen.push(zeile(p, la + 1 + i, `t${i}_`, !vorgegeben)));
  zeilen.push(zeile(a * b, breite - 1, 'e'));
  const nachweis = [...bz.map((d, i) => `${a} · ${d} = ${teile[i]}`), `${a} · ${b} = ${a * b}`];
  const t = tabelle(text, Array(breite).fill(''), zeilen, werte, hilfen, { nachweis, ...mit(extra) });
  t.tabelle.art = 'raster';
  t.tabelle.rechnung = { zeichen: '·', zahlen: [a, b], ergebnis: a * b };
  return t;
}

// ---------- Bilder ----------
// Jedes Bild ist reine Beschreibung; gezeichnet wird es im Dashboard (src/schueler/bilder.js).
// Ein Wert mit { wert, frage: true } wird als Fragezeichen gezeichnet.
export const frage = (wert) => ({ wert, frage: true });
export const B = {
  tafel: (spalten, plaettchen) => ({ art: 'stellenwerttafel', spalten, plaettchen }),
  material: ({ h = 0, z = 0, e = 0 }, weg = null) => ({ art: 'zehnermaterial', h, z, e, ...(weg ? { weg: { h: weg.h ?? 0, z: weg.z ?? 0, e: weg.e ?? 0 } } : {}) }),
  // `trenn`: nach so vielen Reihen steht eine Lücke (Zerlegen in eine Kernaufgabe und den Rest).
  feld: (reihen, spalten, trenn = 0) => ({ art: 'punktefeld', reihen, spalten, ...(trenn ? { trenn } : {}) }),
  menge: (anzahl, { weg = 0, dazu = 0 } = {}) => ({ art: 'mengenbild', anzahl, ...(weg ? { weg } : {}), ...(dazu ? { dazu } : {}) }),
  gruppen: (gruppen, je, rest = 0) => ({ art: 'gruppenbild', gruppen, je, ...(rest ? { rest } : {}) }),
  streifen: (ganz, teile) => ({ art: 'streifen', ganz, teile }),
  vergleich: (oben, unten, unterschied) => ({ art: 'vergleich', oben, unten, unterschied }),
  // Potenz zum Abzählen: ein Quadrat (seite · seite) oder ein Würfel aus `seite` Schichten.
  quadrat: (seite, wuerfel = false) => ({ art: 'quadratbild', seite, ...(wuerfel ? { schichten: seite } : {}) }),
  // Punkt vor Strich: einzelne Plättchen und volle Päckchen (3 + 2 · 4).
  paeckchen: (einzeln, paeckchen, je) => ({ art: 'paeckchen', ...(einzeln ? { einzeln } : {}), paeckchen, je }),
  zehnerfeld: (belegt, { dazu = 0, felder = 10 } = {}) => ({ art: 'zehnerfeld', felder, belegt, ...(dazu ? { dazu } : {}) }),
  strahl: (s) => ({ art: 'zahlenstrahl', ...s }),
  // Kapitel 1. zeilen/saeulen: [[name, wert]]; ein Wert { wert, frage: true } erscheint als Fragezeichen.
  // Strichliste: [name, anzahl] oder [name, anzahl, striche], striche zeigt eine (falsch) gezeichnete Liste, z. B. 'IIIII/'.
  strichliste: (zeilen, titel) => ({ art: 'strichliste', ...(titel ? { titel } : {}), zeilen: zeilen.map(([name, anzahl, striche]) => ({ name, anzahl, ...(striche ? { striche } : {}) })) }),
  // Säulen- oder Balkendiagramm: { titel, einheit, max, schritt (beschriftete Linien), fein (alle Linien), liegend, werteZeigen, ab, ohne }
  saeulen: (d) => ({ art: 'saeulen', ...d, saeulen: d.saeulen.map(([name, wert]) => ({ name, wert })) }),
  bilddiagramm: (d) => ({ art: 'bilddiagramm', ...d, zeilen: d.zeilen.map(([name, wert]) => ({ name, wert })) }),
  // Kapitel 2. Stellenwerttafel mit Ziffern (oder Plättchen): werte je Spalte, null ist ein leeres Feld. gruppen: [[name, spaltenzahl]].
  ziffern: (spalten, werte, { plaettchen = false, gruppen = null, basis = 10 } = {}) => ({ art: 'tafel', spalten, werte, ...(plaettchen ? { plaettchen: true } : {}),
    ...(basis !== 10 ? { basis } : {}), ...(gruppen ? { gruppen: gruppen.map(([name, n]) => ({ name, spalten: n })) } : {}) }),
  // Die Zahl n in einer Stellenwerttafel, mit Dreierblöcken ab fünf Stellen.
  zahlTafel: (n, stellen = String(n).length) => B.ziffern(stellenFuer(stellen), String(n).padStart(stellen, ' ').split('').map((c) => (c === ' ' ? null : Number(c))), { gruppen: stellen > 4 ? bloeckeFuer(stellen) : null }),
  // Mehrere Zahlen untereinander in einer Tafel, rechtsbündig (zum Vergleichen).
  zahlenTafel: (zahlen) => { const stellen = Math.max(...zahlen.map((n) => String(n).length)), zeile = (n) => String(n).padStart(stellen, ' ').split('').map((c) => (c === ' ' ? null : Number(c)));
    return { ...B.ziffern(stellenFuer(stellen), zeile(zahlen[0]), { gruppen: stellen > 4 ? bloeckeFuer(stellen) : null }), weitere: zahlen.slice(1).map(zeile) }; },
  // Zweiersystem: Spalten 16, 8, 4, 2, 1 mit Plättchen (0 oder 1 je Spalte) oder Ziffern.
  dualTafel: (n, stellen, plaettchen = true) => B.ziffern(Array.from({ length: stellen }, (_, i) => String(2 ** (stellen - 1 - i))), n.toString(2).padStart(stellen, '0').split('').map(Number), { plaettchen, basis: 2 }),
  // Spickzettel der römischen Zahlzeichen bis zu einem Zeichen: B.zeichentafel('X') zeigt I, V und X mit ihren Werten.
  zeichentafel: (bis) => ({ art: 'zeichentafel', zeichen: ROEMISCH_TASTEN.slice(0, ROEMISCH_TASTEN.indexOf(bis) + 1) }),
  // Schätzbild: felder = Anzahl je Feld (Reihen von oben), raster 'fest' | 'wahl' | 'ohne', markiert [reihe, spalte], gezaehlt zeigt die Anzahl im markierten Feld.
  // Kapitel 5: Karogitter (siehe GT) und Lineal mit einer Strecke von `von` bis `bis` Millimetern.
  gitter: (g) => ({ art: 'gitter', ...g }),
  lineal: (von, bis, lang = 100, namen = null) => ({ art: 'lineal', von, bis, lang, ...(namen ? { namen } : {}) }),
  // Kapitel 6: Geld in Cent, Uhren { h, min, text }, Waage in Gramm, Einheitentafel, Vergleichsbild zum Schätzen, Karte, Grundriss, Zeitleiste.
  geld: (stuecke) => ({ art: 'geld', stuecke }),
  uhr: (...uhren) => ({ art: 'uhr', uhren: uhren.map(([h, min, text]) => ({ h, min, ...(text ? { text } : {}) })) }),
  waage: (links, gewichte, linksDazu = null) => ({ art: 'waage', links, gewichte, ...(linksDazu ? { linksDazu } : {}) }),
  etafel: (gruppen, spalten, werte, weitere = null) => ({ art: 'einheitentafel', gruppen: gruppen.map(([name, n]) => ({ name, spalten: n })), spalten, werte, ...(weitere ? { weitere } : {}) }),
  vergleichsbild: (klein, gross, richtung, zehntel, hilfslinien = false) => ({ art: 'vergleichsbild', klein, gross, richtung, zehntel, ...(hilfslinien ? { hilfslinien: true } : {}) }),
  karte: (orte, { lang = 100, massstab = null, leiste = null } = {}) => ({ art: 'karte', orte: orte.map(([n, mm, zeichen]) => ({ n, mm, zeichen })), lang, ...(massstab ? { massstab } : {}), ...(leiste ? { leiste: { mm: leiste[0], text: leiste[1] } } : {}) }),
  grundriss: (name, b, h, { massstab = null, leiste = null } = {}) => ({ art: 'grundriss', name, b, h, ...(massstab ? { massstab } : {}), ...(leiste ? { leiste: { mm: leiste[0], text: leiste[1] } } : {}) }),
  zeitleiste: (punkte, spruenge) => ({ art: 'zeitleiste', punkte, spruenge }),
  // Kapitel 7: Winkel (Pixel, y nach oben) mit Geodreieck, Kreis am Lineal, Gradnetz.
  winkel: (b, h, winkel, { geo = null, texte = null } = {}) => ({ art: 'winkel', b, h, winkel, ...(geo ? { geo } : {}), ...(texte ? { texte } : {}) }),
  kreislineal: (von, bis, { lang = 100, radius = false, durchmesser = false } = {}) => ({ art: 'kreislineal', von, bis, lang, ...(radius ? { radius: true } : {}), ...(durchmesser ? { durchmesser: true } : {}) }),
  gradnetz: (breite, laenge, schritt, orte, { namen = false } = {}) => ({ art: 'gradnetz', breite, laenge, schritt, ...(namen ? { namen: true } : {}), orte }),
  // Kapitel 8 (ADR 0035): Figuren aus Rechtecken [x0, y0, x1, y1] mit Löchern, auf einem Raster ('kaestchen' oder 'cm') oder als Skizze.
  // f: { raster, b, h (Felder des Rasters), einheit (der Koordinaten und Maße), figuren: [{ n?, rechtecke, loecher?, zerlegt? }], masse?: [{ p, q, text?, frage? }], skizze? }
  flaeche: (f) => ({ art: 'flaeche', ...f }),
  // Kapitel 9 (ADR 0036): Bruchbild aus Figuren { n?, form, teile | reihen + spalten, ganze?, gefaerbt, ungleich? } und Stellenwerttafel mit Komma.
  bruch: (...figuren) => ({ art: 'bruch', figuren }),
  // Klasse 6, Kapitel 4 (ADR 0047): Zahlenstrahl mit Lupe. Oben der grobe Strahl, darunter ein Abschnitt zehnfach vergrößert.
  // oben und unten sind Zahlenstrahlen wie B.strahl; der untere zeigt genau den Abschnitt `stelle` bis `stelle + oben.schritt` des oberen.
  lupe: (oben, unten) => ({ art: 'lupe', oben, unten }),
  kommaTafel: (spalten, werte, weitere = null) => ({ art: 'tafel', spalten, werte, komma: spalten.indexOf('E'), ...(weitere ? { weitere } : {}) }),
  // Klasse 6, Kapitel 5 (ADR 0048): Stellenwerttafel mit Verschiebepfeilen. rechnung ist „· 100“ oder „: 10“.
  schiebeTafel: (spalten, werte, rechnung) => { const stellen = String(rechnung).match(/0/g).length;
    return { art: 'tafel', spalten, werte, komma: spalten.indexOf('E'), schieben: { stellen, richtung: rechnung.startsWith('·') ? 'links' : 'rechts', rechnung } }; },
  schaetz: (symbol, felder, { raster = 'fest', markiert = null, gezaehlt = false, grob = null } = {}) => ({ art: 'schaetzbild', symbol, felder, raster,
    ...(markiert ? { markiert } : {}), ...(gezaehlt ? { gezaehlt: true } : {}), ...(grob ? { grob } : {}), saat: String(zz(1, 999999)) }),
};

// ---------- Prozessbezogene Kompetenzen (Bildungsplan 2016, ADR 0017) ----------
// Jede Aufgabe trägt eine Haupt- und höchstens eine Nebenkompetenz: kompetenz: [haupt] oder [haupt, neben].
// Festgelegt je Aufgabenmuster: zuerst das Lernziel, dann Merkmale der Aufgabe (Nachweisart, Format). Ein Erzeuger kann
// sie mit `extra.kompetenz` selbst setzen; das geht vor.
export const KOMPETENZEN = {
  argumentieren: 'Argumentieren',
  'probleme-loesen': 'Probleme lösen',
  modellieren: 'Modellieren',
  symbolisch: 'Mit symbolischen Elementen umgehen',
  kommunizieren: 'Kommunizieren',
};
// Lernziele, deren Aufgaben im Kern eine andere Kompetenz als das Rechnen verlangen.
const KOMPETENZ_LERNZIEL = {
  kommunizieren: ['6.3.1-Q1', '6.3.2-S1', '6.3.2-S2', '6.3.3-A1', '6.3.3-A2', '6.3.4-P1', '6.3.5-Y1', '6.3.6-R1', '7.1.1-Z1', '7.1.X1-K1', '7.1.X2-W1', '6.1.1-B1', '6.1.6-Z1', '6.1.6-Z2', '5.9.1-B1', '5.9.1-B2', '5.9.3-K1', '5.5.1-B1', '5.5.2-S1', '5.5.3-P1', '5.5.4-K1', '5.5.7-V1', '5.5.8-V2', '5.5.9-V3', '5.2.1-N1', '5.2.1-N3', '5.2.2-B1', '5.2.5-Z1', '5.2.5-Z2', '5.2.X1-X1', '5.2.X1-X2', '5.1.1-H1', '5.1.1-H2', '5.1.2-L1', '5.1.2-L2', '5.1.3-Z1', '5.1.3-Z2', '5.3.2-A1', '5.3.3-S1', '5.4.2-M1', '5.4.5-D1', '5.4.4-P1', '5.7.1-R1', '5.7.2-V1', '5.7.3-A1', '5.7.X1-N1', '5.7.X2-D1'],
  modellieren: ['7.1.X3-C1', '7.1.X4-B1', '6.2.3-V2', '6.2.4-T2', '6.2.5-P2', '6.2.6-D2', '6.1.5-T2', '5.9.2-T2', '5.6.1-S1', '5.6.1-S2', '5.6.7-A1', '5.6.7-A2', '5.6.X1-X1', '5.6.6-K1', '5.6.6-K2', '5.2.4-S1', '5.1.4-V1', '5.1.5-U1', '5.3.2-A5', '5.3.3-S5', '5.4.2-M5', '5.4.5-D6', '5.3.4-B2', '5.4.6-T3'],
  'probleme-loesen': ['6.3.8-K1', '6.3.8-K2', '5.4.X1-Z1'],
  argumentieren: ['7.1.2-V1', '6.1.4-V2', '5.9.1-B3', '5.5.9-V4', '5.2.3-R2', '5.2.4-S2', '5.1.4-V2', '5.4.X1-Z2'],
};
// Nachweisarten, die eine echte Suche oder ein Knobeln verlangen (Ziffernrätsel, größte Zahl, Zahlen zwischen …).
const KNOBELN = new Set(['extrem', 'extremzahlen', 'ziffern', 'kombination', 'paarsumme', 'gleichungen', 'zwischen', 'kleinsteDifferenz', 'ersteUnterschreitung',
  'gleicheWerte', 'zahlenwahl', 'anzahlProdukte', 'zahlenpaar', 'anzahlTeiler', 'ziffernTeilbar', 'grenzVielfaches', 'ziffernZahlen', 'vielfachesZwischen',
  'restBleibt', 'grenzRest', 'anzahlMitRest', 'kleinsteMitResten', 'naheBei', 'quotientUeber', 'teilerZwischen']);
// Aufgaben, die eine Aussage prüfen oder begründen lassen („Wer hat recht?“, „Warum …?“).
const BEGRUENDEN = /Wer hat recht\?|Beurteile|Begründe|Stimmt das\?|Erkläre|Warum/;
export function kompetenzVon(lernziel, a) {
  const arten = new Set((Array.isArray(a.nachweis) ? a.nachweis : []).filter((e) => e && typeof e === 'object').map((e) => e.art ?? (e.zahl != null ? 'hilfszahl' : '')));
  const vomLernziel = Object.entries(KOMPETENZ_LERNZIEL).find(([, ids]) => ids.includes(lernziel))?.[0] ?? 'symbolisch';
  const sach = a.format === 'sachaufgabe' || arten.has('hilfszahl');
  const darstellung = ['diagramm', 'tabelle', 'strichliste', 'zeichnen', 'gitter', 'faerben'].includes(a.format) || a.bild?.art === 'bruch' || ['saeulen', 'bilddiagramm', 'strichliste', 'tafel', 'schaetzbild', 'gitter', 'lineal', 'karte', 'grundriss', 'zeitleiste', 'einheitentafel', 'gradnetz', 'kreislineal', 'flaeche'].includes(a.bild?.art) || Boolean(a.daten && lernziel.startsWith('5.6.'));
  let haupt = vomLernziel;
  if (arten.has('urteil') || BEGRUENDEN.test(a.text)) haupt = 'argumentieren';
  else if ([...arten].some((x) => KNOBELN.has(x))) haupt = 'probleme-loesen';
  else if (sach && haupt === 'symbolisch') haupt = 'modellieren';
  const neben = [vomLernziel !== haupt ? vomLernziel : null, sach && haupt !== 'modellieren' ? 'modellieren' : null, darstellung && haupt !== 'kommunizieren' ? 'kommunizieren' : null]
    .find((x) => x && x !== haupt && x !== 'symbolisch') ?? null;
  return neben ? [haupt, neben] : [haupt];
}

// ---------- Aufgaben sammeln ----------
export const aufgaben = [];
const schluessel = (a) => a.text + JSON.stringify(a.optionen?.map((o) => o.text).sort() ?? '') + JSON.stringify([a.strahl, a.tabelle, a.diagramm, a.paare, a.bild && { ...a.bild, saat: 0 }, a.daten, a.urliste, a.zeilen, a.karten && [...a.karten].sort(), a.gitter, a.bedingung, a.faerben, a.teile?.map((t) => t.text)].filter(Boolean));
// Heftaufgabe (Nils, 2026-11-25, ADR 0047): Eine Aufgabe, die im Heft bearbeitet wird, trägt das Kennzeichen `heftaufgabe`.
// Das Dashboard zeigt darüber das Heftband. Erkannt wird sie an ihrem Auftrag: „Im Heft: …“ oder „Zeichne … in dein Heft“.
export const HEFTAUFTRAG = /(?:^|\n|[.:!] )Im Heft:|\b(?:Zeichne|Konstruiere|Rechne|Dividiere|Multipliziere|Addiere|Subtrahiere)\b[^.?!\n]*?\b(?:in dein Heft|ins Heft|im Heft)\b/;
function nachbearbeiten(a, niveau) {
  if (HEFTAUFTRAG.test(a.text ?? '')) a.heftaufgabe = true;
  if (a.optionen) {
    // Einfache Sprache auf F und G: auch in den Antworten steht jeder Satz in einer eigenen Zeile.
    if (niveau === 'F' || niveau === 'G') a.optionen = a.optionen.map((o) => ({ ...o, text: o.text.replace(/(?<=[.?!]) (?=[A-ZÄÖÜ„\d])/g, '\n') }));
    // Zu viele Antworten: zuerst falsche ohne Fehlvorstellung streichen, dann die letzten.
    const max = MAX_OPTIONEN[niveau];
    while (a.optionen.length > max && !a.mehrfach) {
      const weg = a.optionen.findLast((o) => !o.richtig && !o.fehlvorstellung) ?? a.optionen.findLast((o) => !o.richtig);
      a.optionen = a.optionen.filter((o) => o !== weg);
    }
  }
  return a;
}
// Sechs Plätze je Lernziel und Niveaustufe. Jeder Platz ist ein Erzeuger; der Anforderungsbereich folgt aus dem Platz.
// Niveau-Meilensteine (ADR 0037, 0038) haben auf M und E zwölf oder auf E 24 Plätze: Die Folge der Anforderungsbereiche wiederholt sich.
export function sechs(lernziel, niveau, plaetze, anzahl = PRO_GRUPPE) {
  if (plaetze.length !== anzahl || anzahl % PRO_GRUPPE !== 0) throw new Error(`${lernziel} ${niveau}: ${plaetze.length} statt ${anzahl} Plätze`);
  const gesehen = new Set();
  plaetze.forEach((erzeuge, i) => {
    for (let versuch = 0; ; versuch++) {
      if (versuch > 300) throw new Error(`Keine neue Aufgabe für ${lernziel} ${niveau}, Platz ${i + 1}`);
      // Ein Erzeuger darf null liefern, wenn die gezogenen Zahlen nicht passen; dann wird neu gezogen.
      const roh = erzeuge();
      if (!roh) continue;
      const a = nachbearbeiten(roh, niveau);
      const k = schluessel(a);
      if (gesehen.has(k)) continue;
      gesehen.add(k);
      aufgaben.push({ id: `${lernziel}-${niveau}-${String(i + 1).padStart(2, '0')}`, lernziel, niveau, afb: AFB_FOLGE[niveau][i % PRO_GRUPPE], kompetenz: a.kompetenz ?? kompetenzVon(lernziel, a), ...a });
      break;
    }
  });
}
// Für Erzeuger, die je Anforderungsbereich Varianten liefern: je[afb](k), k zählt die Aufgaben desselben Bereichs.
export const zwoelf = (lernziel, niveau, plaetze) => sechs(lernziel, niveau, plaetze, 2 * PRO_GRUPPE);
export function stufen(lernziel, niveau, je) {
  const folge = AFB_FOLGE[niveau];
  sechs(lernziel, niveau, folge.map((afb, i) => () => je[afb](folge.slice(0, i).filter((x) => x === afb).length)));
}

// ---------- Multiplizieren ----------
// Typischer Fehler: stellenweise malnehmen, ohne die Überträge mitzunehmen (347 · 7 wird zu 1829 statt 2429).
export const malOhneUebertrag = (a, d) => {
  let ergebnis = 0, stelle = 1;
  for (let x = a; x > 0; x = Math.floor(x / 10), stelle *= 10) ergebnis += ((x % 10) * d % 10) * stelle;
  return ergebnis;
};
// Typischer Fehler: Die Null im ersten Faktor wird übersehen (507 · 6 wie 57 · 6).
export const malNullVergessen = (a, d) => Number(String(a).replace(/0/g, '') || 0) * d;
// Typischer Fehler: Die Teilprodukte werden ohne Einrücken addiert (418 · 54 wie 2090 + 1672).
export const malNichtEingerueckt = (a, b) => String(b).split('').reduce((s, z) => s + a * Number(z), 0);
// Alle Belegungen der Kästchen ▢ mit Ziffern, die die Rechnung „… = …“ wahr machen (wie im Prüfer).
export function raetselLoesungen(muster) {
  const k = (muster.match(/▢/g) ?? []).length, loesungen = [];
  for (let n = 0; n < 10 ** k; n++) {
    const z = String(n).padStart(k, '0').split('').map(Number);
    let i = 0;
    const [l, r] = muster.replace(/▢/g, () => z[i++]).split(' = ');
    try { if (rechne(l) === rechne(r)) loesungen.push(z); } catch { /* Division geht nicht auf */ }
  }
  return loesungen;
}
