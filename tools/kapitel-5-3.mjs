// Aufgaben zu Kapitel 3 „Addieren und Subtrahieren“ außer 3.3 (das steht in erzeuge-klasse-5.mjs):
// 3.1 Kopfrechnen, 3.2 Addieren, 3.4 Klammern, 3.5 Rechengesetze.
// Wird von erzeuge-klasse-5.mjs aufgerufen und bekommt dessen Werkzeuge.

const fv = (beschreibung, hinweis) => ({ beschreibung, hinweis });
export const fehlvorstellungen53 = {
  'add-uebertrag-vergessen': fv('Addiert stellenweise, berücksichtigt den Übertrag aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'add-subtrahiert': fv('Subtrahiert, statt zu addieren.', 'Schau auf das Rechenzeichen: Hier wird addiert.'),
  'kopf-stellenwert': fv('Verrechnet sich beim Kopfrechnen um eine Stelle.', 'Prüfe die Stellen: Rechnest du mit Zehnern, Hundertern oder Tausendern?'),
  'ergaenzen-zu-viel': fv('Ergänzt jede Stelle einzeln bis zur vollen Zehn und erhält dadurch zu viel.', 'Nur die Einer werden bis 10 ergänzt. Alle anderen Stellen ergänzt du bis 9.'),
  'geschickt-nicht-ausgeglichen': fv('Rechnet mit der glatten Nachbarzahl, gleicht danach aber nicht aus.', 'Du hast mit einer glatten Zahl gerechnet. Jetzt musst du noch ausgleichen.'),
  'geschickt-falsch-ausgeglichen': fv('Gleicht nach dem Rechnen mit der glatten Nachbarzahl in die falsche Richtung aus.', 'Überlege: Hast du zu viel oder zu wenig gerechnet? In welche Richtung musst du ausgleichen?'),
  'klammer-ignoriert': fv('Rechnet von links nach rechts und beachtet die Klammer nicht.', 'Was in der Klammer steht, wird zuerst berechnet.'),
  'klammer-falsch-gesetzt': fv('Setzt die Klammer an die falsche Stelle.', 'Lies genau: Was soll zuerst zusammengefasst werden? Das gehört in die Klammer.'),
  'gesetz-auf-subtraktion': fv('Überträgt das Vertauschungs- oder Verbindungsgesetz auf die Subtraktion.', 'Die beiden Gesetze gelten nur für die Addition. Rechne beide Seiten aus.'),
};

export function kapitel53(w) {
  const { gruppe, zahl, auswahl, opt, zz, wahl, suche, fz, fehlerliste, runde, NIVEAUS, teil, kleinerVonGroesser, uebertragVergessen } = w;
  const K = (kurz) => `5.3.1-${kurz}`, A = (kurz) => `5.3.2-${kurz}`, KL = (kurz) => `5.3.4-${kurz}`, R = (kurz) => `5.3.5-${kurz}`;
  const summe = (liste) => liste.reduce((s, x) => s + x, 0);

  // ---------- Bausteine für die neuen Formate ----------
  const strahl = (eingabe, text, bild, loesung, typischeFehler, hilfen) => ({ format: 'zahlenstrahl', eingabe, text, strahl: bild, loesung, typischeFehler, hilfen });
  const tabelle = (text, kopf, zeilen, loesungen, hilfen) => ({ format: 'tabelle', text, tabelle: { kopf: kopf.map(String), zeilen: zeilen.map((z) => z.map((c) => (typeof c === 'object' ? c : String(c)))) },
    luecken: Object.fromEntries(Object.entries(loesungen).map(([n, l]) => [n, { loesung: l, typischeFehler: [] }])), hilfen });
  const L = (name) => ({ luecke: name });
  const luecken = (text, eintraege, hilfen) => ({ format: 'luecken', text, luecken: Object.fromEntries(Object.entries(eintraege).map(([n, [loesung, fehler]]) => [n, { loesung, typischeFehler: fehler ?? [] }])), hilfen });

  // Stellenweise addieren, ohne Überträge mitzunehmen (typischer Fehler).
  const ohneUebertrag = (...zahlen) => {
    let ergebnis = 0, stelle = 1, rest = [...zahlen];
    while (rest.some((x) => x > 0)) {
      ergebnis += (summe(rest.map((x) => x % 10)) % 10) * stelle;
      stelle *= 10; rest = rest.map((x) => Math.floor(x / 10));
    }
    return ergebnis;
  };
  const addUebertraege = (a, b) => {
    let anzahl = 0, u = 0;
    while (a > 0 || b > 0) { u = (a % 10) + (b % 10) + u >= 10 ? 1 : 0; anzahl += u; a = Math.floor(a / 10); b = Math.floor(b / 10); }
    return anzahl;
  };

  // =====================================================================
  // 3.1 Kopfrechnen
  // =====================================================================
  // ----- K1 Im Kopf addieren -----
  gruppe(K('K1'), 'F', (i) => {
    if (i < 3) {
      const [a, b] = suche(() => [zz(3, 12) * 10, zz(2, 8) * 10], ([x, y]) => x + y <= 200 && x + y > 100 && x < 100);
      return strahl('markieren', `Starte bei ${a} und springe ${b} weiter. Bei welcher Zahl landest du?`, { von: 0, bis: 200, schritt: 10, beschriftung: 50, start: a },
        a + b, fehlerliste(a + b, [[a - b, 'add-subtrahiert']]),
        { tipp: 'Weiter springen heißt addieren. Springe in Zehnerschritten nach rechts.', beispiel: 'Start bei 90, 50 weiter: erst 10 bis zur 100, dann noch 40. Du landest bei 140.',
          loesungsschritt: `Springe zuerst bis zur 100. Das sind ${100 - a}. Von den ${b} bleiben dann noch ${b - (100 - a)} übrig, die springst du danach.` });
    }
    const [a, b] = suche(() => [zz(2, 9) * 10, zz(2, 9) * 10], ([x, y]) => x + y > 100);
    return zahl(`Rechne im Kopf: ${a} + ${b}`, a + b, fehlerliste(a + b, [[a + b - 100, 'kopf-stellenwert'], [Math.abs(a - b), 'add-subtrahiert']]),
      { tipp: 'Rechne mit den Zehnern wie mit kleinen Zahlen und hänge die Null wieder an.', beispiel: '60 + 70: 6 Zehner + 7 Zehner = 13 Zehner, also 130.',
        loesungsschritt: `${a / 10} Zehner + ${b / 10} Zehner = ${(a + b) / 10} Zehner.` });
  });
  gruppe(K('K1'), 'G', (i) => {
    if (i >= 4) {
      const [a, b] = suche(() => [zz(2, 13) * 50, zz(3, 12) * 50], ([x, y]) => x + y <= 1000 && Math.floor(x / 100) !== Math.floor((x + y - 1) / 100));
      return strahl('ablesen', 'Der Zahlenstrahl zeigt einen Sprung. Bei welcher Zahl landet er?', { von: 0, bis: 1000, schritt: 50, beschriftung: 100, start: a, spruenge: [{ von: a, nach: a + b, text: `+ ${b}` }], pfeil: a + b },
        a + b, fehlerliste(a + b, [[a - b, 'add-subtrahiert'], [a + b + 100, 'kopf-stellenwert'], [a + b - 100, 'kopf-stellenwert']]),
        { tipp: 'Der Sprung beginnt beim Punkt „Start“. Rechne Start plus Sprung.', beispiel: 'Start 350, Sprung + 200: 350 + 200 = 550.', loesungsschritt: `Der Start liegt bei ${a}. Rechne ${a} + ${b}.` });
    }
    const [a, b] = suche(() => [zz(12, 78) * 10, zz(12, 78) * 10], ([x, y]) => x + y < 1000 && (x % 100) + (y % 100) >= 100);
    return zahl(`Rechne im Kopf: ${a} + ${b}`, a + b, fehlerliste(a + b, [[ohneUebertrag(a, b), 'add-uebertrag-vergessen'], [Math.abs(a - b), 'add-subtrahiert']]),
      { tipp: 'Zerlege die zweite Zahl in Hunderter und Zehner und addiere sie nacheinander.', beispiel: '340 + 280: 340 + 200 = 540, dann 540 + 80 = 620.',
        loesungsschritt: `Addiere zuerst die Hunderter: ${a} + ${Math.floor(b / 100) * 100} = ${a + Math.floor(b / 100) * 100}. Dann fehlen noch ${b % 100}.` });
  });
  gruppe(K('K1'), 'M', (i) => {
    if (i % 2 === 0) {
      const [a1, a2] = suche(() => [zz(12, 89) * 10, zz(12, 89) * 10], ([x, y]) => x !== y);
      const [b1, b2] = suche(() => [zz(11, 49) * 10, zz(11, 49) * 10], ([x, y]) => x !== y);
      return tabelle('Fülle die Additionstabelle aus. Rechne im Kopf.', ['+', b1, b2], [[a1, L('a'), L('b')], [a2, L('c'), L('d')]],
        { a: a1 + b1, b: a1 + b2, c: a2 + b1, d: a2 + b2 },
        { tipp: 'In jedes Feld gehört die Summe aus der Zahl links und der Zahl oben.', beispiel: 'Links 250, oben 130: In das Feld gehört 250 + 130 = 380.',
          loesungsschritt: `Das erste Feld: ${a1} + ${b1} = ${a1 + b1}.` });
    }
    const [a, b, c] = suche(() => [zz(12, 48) * 10, zz(11, 39) * 10, zz(11, 39) * 10], (x) => summe(x) < 1000);
    return zahl(`Rechne im Kopf: ${a} + ${b} + ${c}`, a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen'], [ohneUebertrag(a, b, c), 'add-uebertrag-vergessen']]),
      { tipp: 'Addiere Schritt für Schritt und merke dir das Zwischenergebnis.', beispiel: '250 + 130 + 270: 250 + 130 = 380, dann 380 + 270 = 650.', loesungsschritt: `Rechne zuerst ${a} + ${b} = ${a + b}.` });
  });
  gruppe(K('K1'), 'E', (i) => {
    if (i % 2 === 0) {
      const a = zz(12, 95) * 1000, b = suche(() => zz(11, 99) * 100, (x) => x % 1000 !== 0);
      return zahl(`Rechne im Kopf: ${fz(a)} + ${fz(b)}`, a + b, fehlerliste(a + b, [[a + b * 10, 'kopf-stellenwert'], [a + b / 10, 'kopf-stellenwert']]),
        { tipp: 'Achte auf die Stellen: Tausender zu Tausendern, Hunderter zu Hundertern.', beispiel: '48 000 + 7 500: 48 000 + 7 000 = 55 000, dann + 500 = 55 500.',
          loesungsschritt: `Addiere zuerst die Tausender: ${fz(a)} + ${fz(Math.floor(b / 1000) * 1000)} = ${fz(a + Math.floor(b / 1000) * 1000)}.` });
    }
    const s = zz(2, 9) * 10000, b = suche(() => zz(11, 99) * 100, (x) => x % 1000 !== 0 && x < s);
    return luecken(`{{a}} + ${fz(b)} = ${fz(s)}`, { a: [s - b, fehlerliste(s - b, [[s + b, 'add-subtrahiert'], [s - b + 1000, 'ergaenzen-zu-viel']])] },
      { tipp: 'Gesucht ist ein Summand. Du findest ihn mit der Umkehraufgabe.', beispiel: '? + 2 500 = 10 000: 10 000 − 2 500 = 7 500.', loesungsschritt: `Rechne ${fz(s)} − ${fz(b)}.` });
  });

  // ----- K2 Im Kopf subtrahieren -----
  gruppe(K('K2'), 'F', (i) => {
    if (i < 3) {
      const [a, b] = suche(() => [zz(11, 19) * 10, zz(2, 8) * 10], ([x, y]) => x - y < 100);
      return strahl('markieren', `Starte bei ${a} und springe ${b} zurück. Bei welcher Zahl landest du?`, { von: 0, bis: 200, schritt: 10, beschriftung: 50, start: a },
        a - b, fehlerliste(a - b, [[a + b, 'sub-addiert']]),
        { tipp: 'Zurück springen heißt subtrahieren. Springe in Zehnerschritten nach links.', beispiel: 'Start bei 120, 50 zurück: erst 20 bis zur 100, dann noch 30. Du landest bei 70.',
          loesungsschritt: `Springe zuerst zurück bis zur 100. Das sind ${a - 100}. Von den ${b} bleiben dann noch ${b - (a - 100)} übrig, die springst du danach.` });
    }
    const [a, b] = suche(() => [zz(11, 18) * 10, zz(2, 9) * 10], ([x, y]) => x - y < 100 && x - y > 0);
    return zahl(`Rechne im Kopf: ${a} − ${b}`, a - b, fehlerliste(a - b, [[a + b, 'sub-addiert'], [kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser']]),
      { tipp: 'Rechne mit den Zehnern wie mit kleinen Zahlen und hänge die Null wieder an.', beispiel: '130 − 50: 13 Zehner − 5 Zehner = 8 Zehner, also 80.',
        loesungsschritt: `${a / 10} Zehner − ${b / 10} Zehner = ${(a - b) / 10} Zehner.` });
  });
  gruppe(K('K2'), 'G', (i) => {
    if (i >= 4) {
      const [a, b] = suche(() => [zz(6, 20) * 50, zz(3, 12) * 50], ([x, y]) => x - y >= 0 && Math.floor(x / 100) !== Math.floor((x - y) / 100));
      return strahl('ablesen', 'Der Zahlenstrahl zeigt einen Sprung zurück. Bei welcher Zahl landet er?', { von: 0, bis: 1000, schritt: 50, beschriftung: 100, start: a, spruenge: [{ von: a, nach: a - b, text: `− ${b}` }], pfeil: a - b },
        a - b, fehlerliste(a - b, [[a + b, 'sub-addiert'], [a - b + 100, 'kopf-stellenwert'], [a - b - 100, 'kopf-stellenwert']]),
        { tipp: 'Der Sprung beginnt beim Punkt „Start“ und geht nach links. Rechne Start minus Sprung.', beispiel: 'Start 750, Sprung − 200: 750 − 200 = 550.', loesungsschritt: `Der Start liegt bei ${a}. Rechne ${a} − ${b}.` });
    }
    const [a, b] = suche(() => [zz(31, 98) * 10, zz(12, 78) * 10], ([x, y]) => x - y > 100 && x % 100 < y % 100);
    return zahl(`Rechne im Kopf: ${a} − ${b}`, a - b, fehlerliste(a - b, [[kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'], [uebertragVergessen(a, b), 'sub-uebertrag-vergessen'], [a + b, 'sub-addiert']]),
      { tipp: 'Zerlege die zweite Zahl in Hunderter und Zehner und ziehe sie nacheinander ab.', beispiel: '720 − 350: 720 − 300 = 420, dann 420 − 50 = 370.',
        loesungsschritt: `Ziehe zuerst die Hunderter ab: ${a} − ${Math.floor(b / 100) * 100} = ${a - Math.floor(b / 100) * 100}. Dann fehlen noch ${b % 100}.` });
  });
  gruppe(K('K2'), 'M', (i) => {
    if (i % 2 === 0) {
      const [a1, a2] = suche(() => [zz(61, 99) * 10, zz(61, 99) * 10], ([x, y]) => x !== y);
      const [b1, b2] = suche(() => [zz(12, 55) * 10, zz(12, 55) * 10], ([x, y]) => x !== y);
      return tabelle('Fülle die Tabelle aus: Ziehe von der Zahl links die Zahl oben ab. Rechne im Kopf.', ['−', b1, b2], [[a1, L('a'), L('b')], [a2, L('c'), L('d')]],
        { a: a1 - b1, b: a1 - b2, c: a2 - b1, d: a2 - b2 },
        { tipp: 'In jedes Feld gehört die Differenz: Zahl links minus Zahl oben.', beispiel: 'Links 750, oben 230: In das Feld gehört 750 − 230 = 520.', loesungsschritt: `Das erste Feld: ${a1} − ${b1} = ${a1 - b1}.` });
    }
    const [a, b, c] = suche(() => [zz(60, 99) * 10, zz(12, 35) * 10, zz(12, 35) * 10], ([x, y, v]) => x - y - v > 50);
    return zahl(`Rechne im Kopf: ${a} − ${b} − ${c}`, a - b - c, fehlerliste(a - b - c, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
      { tipp: 'Ziehe Schritt für Schritt ab. Oder fasse die beiden Zahlen zusammen, die abgezogen werden.', beispiel: '900 − 250 − 150: 250 + 150 = 400, dann 900 − 400 = 500.', loesungsschritt: `Rechne zuerst ${a} − ${b} = ${a - b}.` });
  });
  gruppe(K('K2'), 'E', (i) => {
    if (i % 2 === 0) {
      const a = zz(20, 95) * 1000, b = suche(() => zz(11, 99) * 100, (x) => x % 1000 !== 0 && x < a);
      return zahl(`Rechne im Kopf: ${fz(a)} − ${fz(b)}`, a - b, fehlerliste(a - b, [[a + b, 'sub-addiert'], [a - b + 1000, 'ergaenzen-zu-viel'], [a - b / 10, 'kopf-stellenwert']]),
        { tipp: 'Ziehe erst die Tausender ab, dann die Hunderter.', beispiel: '60 000 − 7 500: 60 000 − 7 000 = 53 000, dann − 500 = 52 500.',
          loesungsschritt: `Ziehe zuerst die Tausender ab: ${fz(a)} − ${fz(Math.floor(b / 1000) * 1000)} = ${fz(a - Math.floor(b / 1000) * 1000)}.` });
    }
    const a = zz(2, 9) * 10000, d = suche(() => zz(11, 99) * 100, (x) => x % 1000 !== 0 && x < a);
    return luecken(`${fz(a)} − {{a}} = ${fz(d)}`, { a: [a - d, fehlerliste(a - d, [[a + d, 'sub-addiert'], [a - d + 1000, 'ergaenzen-zu-viel']])] },
      { tipp: 'Gesucht ist die Zahl, die abgezogen wird. Du findest sie, wenn du das Ergebnis von der ersten Zahl abziehst.', beispiel: '10 000 − ? = 6 400: 10 000 − 6 400 = 3 600.', loesungsschritt: `Rechne ${fz(a)} − ${fz(d)}.` });
  });

  // ----- K3 Geschickt rechnen -----
  const ergaenzen = (a, ziel, stellen) => {
    const l = ziel - a;
    return zahl(`Wie viel fehlt von ${fz(a)} bis ${fz(ziel)}?`, l, fehlerliste(l, stellen.map((s) => [l + s, 'ergaenzen-zu-viel'])),
      { tipp: 'Ergänze in Schritten: erst bis zum nächsten Zehner, dann weiter bis zur glatten Zahl.', beispiel: 'Von 64 bis 100: 6 bis zur 70, dann 30 bis zur 100. Zusammen 36.',
        loesungsschritt: `Bis zum nächsten Zehner fehlen ${10 - (a % 10)}. Du bist dann bei ${fz(a + 10 - (a % 10))}.` });
  };
  const nachbar = (a, b, glatt, plus) => {
    const l = plus ? a + b : a - b, d = glatt - b; // d: so viel ist die glatte Zahl größer
    const roh = plus ? a + glatt : a - glatt;
    return zahl(`Rechne geschickt: ${fz(a)} ${plus ? '+' : '−'} ${fz(b)}`, l,
      fehlerliste(l, [[roh, 'geschickt-nicht-ausgeglichen'], [plus ? roh + d : roh - d, 'geschickt-falsch-ausgeglichen']]),
      { tipp: `Rechne mit der glatten Nachbarzahl ${fz(glatt)} und gleiche danach aus.`,
        beispiel: plus ? '46 + 19: 46 + 20 = 66, das war 1 zu viel, also 66 − 1 = 65.' : '83 − 29: 83 − 30 = 53, das war 1 zu viel abgezogen, also 53 + 1 = 54.',
        loesungsschritt: `${fz(a)} ${plus ? '+' : '−'} ${fz(glatt)} = ${fz(roh)}. Jetzt gleichst du noch ${d} aus.` });
  };
  gruppe(K('K3'), 'F', (i) => {
    if (i < 3) return ergaenzen(suche(() => zz(12, 88), (x) => x % 10 !== 0), 100, [10]);
    const b = wahl([9, 19, 29]);
    return i % 2 ? nachbar(suche(() => zz(23, 68), (x) => x % 10 !== 0 && x % 10 !== 1), b, b + 1, true)
      : nachbar(suche(() => zz(42, 97), (x) => x % 10 !== 0 && x % 10 !== 9), b, b + 1, false);
  });
  gruppe(K('K3'), 'G', (i) => {
    if (i < 3) return ergaenzen(suche(() => zz(125, 940), (x) => x % 10 !== 0 && Math.floor(x / 10) % 10 !== 9), 1000, [10, 100, 110]);
    const b = wahl([98, 99, 198, 199, 299]), glatt = Math.ceil(b / 100) * 100;
    return i % 2 ? nachbar(suche(() => zz(215, 680), (x) => x % 10 > 2), b, glatt, true) : nachbar(suche(() => zz(412, 975), (x) => x % 10 < 8), b, glatt, false);
  });
  gruppe(K('K3'), 'M', (i) => {
    if (i % 3 === 2) {
      const z = suche(() => [zz(125, 890), zz(125, 890), zz(125, 890)], (x) => new Set(x).size === 3 && x.every((v) => v % 10 !== 0));
      return tabelle('Ergänze jede Zahl bis 1000.', ['Zahl', 'fehlt bis 1000'], z.map((v, k) => [v, L('abc'[k])]), { a: 1000 - z[0], b: 1000 - z[1], c: 1000 - z[2] },
        { tipp: 'Ergänze in Schritten: erst zum nächsten Zehner, dann zum nächsten Hunderter, dann bis 1000.', beispiel: 'Von 463 bis 1000: 7 bis 470, 30 bis 500, 500 bis 1000. Zusammen 537.',
          loesungsschritt: `Für ${z[0]}: Bis zum nächsten Zehner fehlen ${10 - (z[0] % 10)}.` });
    }
    const b = wahl([997, 998, 1997, 1998, 2996, 2998]), glatt = Math.ceil(b / 1000) * 1000;
    return i % 2 ? nachbar(suche(() => zz(2150, 6800), (x) => x % 10 > 4), b, glatt, true) : nachbar(suche(() => zz(4120, 9750), (x) => x % 10 < 6), b, glatt, false);
  });
  gruppe(K('K3'), 'E', (i) => {
    if (i % 2) return ergaenzen(suche(() => zz(12500, 94000), (x) => x % 10 !== 0 && Math.floor(x / 10) % 10 !== 9 && Math.floor(x / 100) % 10 !== 9 && Math.floor(x / 1000) % 10 !== 9), 100000, [10, 100, 1000]);
    const k1 = zz(3, 8), k2 = zz(2, 6), d1 = zz(2, 6), d2 = zz(2, 5);
    const a = k1 * 1000 - d1, b = k2 * 1000 - d2, c = d1 + d2, l = (k1 + k2) * 1000;
    return zahl(`Rechne geschickt: ${fz(a)} + ${fz(b)} + ${c}`, l, fehlerliste(l, [[l + c, 'geschickt-nicht-ausgeglichen'], [l - c, 'geschickt-falsch-ausgeglichen'], [a + b, 'sach-schritt-vergessen']]),
      { tipp: 'Die ersten beiden Zahlen liegen knapp unter einem Tausender. Verteile die kleine Zahl so, dass glatte Zahlen entstehen.',
        beispiel: '3 996 + 1 998 + 6: 3 996 + 4 = 4 000 und 1 998 + 2 = 2 000. Zusammen 6 000.', loesungsschritt: `${fz(a)} + ${d1} = ${fz(k1 * 1000)}. Die übrigen ${d2} gehören zur zweiten Zahl.` });
  });

  // =====================================================================
  // 3.2 Addieren
  // =====================================================================
  const addBegriffe = 'In einer Addition heißen die Zahlen, die addiert werden, Summanden. Das Ergebnis heißt Summe.';
  // ----- A1 Fachbegriffe -----
  gruppe(A('A1'), 'F', (i) => {
    const [a, b] = suche(() => [zz(12, 60), zz(12, 38)], ([x, y]) => x !== y);
    const s = a + b;
    const [wert, richtig] = [[a, 'Summand'], [s, 'Summe'], [b, 'Summand']][i % 3];
    return auswahl(`${a} + ${b} = ${s}. Wie heißt die Zahl ${wert}?`, ['Summand', 'Summe', 'Differenz', 'Minuend'].map((t) => opt(t, t === richtig, t === richtig ? undefined : 'begriffe-verwechselt')),
      { tipp: 'Summand + Summand = Summe.', beispiel: 'In 20 + 30 = 50 sind 20 und 30 die Summanden, 50 ist die Summe.', loesungsschritt: `Schau, wo ${wert} steht: vor oder hinter dem Gleichheitszeichen?` });
  });
  gruppe(A('A1'), 'G', () => {
    const a = zz(120, 680), b = zz(25, 290);
    return zahl(`Die Summanden sind ${a} und ${b}. Berechne die Summe.`, a + b, fehlerliste(a + b, [[a - b, 'begriffe-verwechselt'], [ohneUebertrag(a, b), 'add-uebertrag-vergessen']]),
      { tipp: addBegriffe, beispiel: 'Summanden 40 und 25: 40 + 25 = 65. Die Summe ist 65.', loesungsschritt: `Die Rechnung lautet ${a} + ${b}.` });
  });
  gruppe(A('A1'), 'M', () => {
    const a = zz(135, 600), s = a + zz(120, 380);
    return zahl(`Die Summe ist ${s}, ein Summand ist ${a}. Wie groß ist der andere Summand?`, s - a, fehlerliste(s - a, [[s + a, 'begriffe-verwechselt']]),
      { tipp: 'Summand + Summand = Summe. Gesucht ist einer der Summanden.', beispiel: 'Summe 90, ein Summand 35: 35 + ? = 90. Der andere Summand ist 90 − 35 = 55.',
        loesungsschritt: `Schreibe ${a} + ? = ${s}. Den Summanden findest du mit der Umkehraufgabe ${s} − ${a}.` });
  });
  gruppe(A('A1'), 'E', () => {
    const a = zz(210, 600), b = zz(110, 380), c = zz(400, 900), d = zz(120, c - 100);
    const l = a + b + c - d;
    return zahl(`Addiere zur Summe der Zahlen ${a} und ${b} die Differenz der Zahlen ${c} und ${d}.`, l, fehlerliste(l, [[a + b + c + d, 'begriffe-verwechselt'], [a + b, 'sach-schritt-vergessen']]),
      { tipp: 'Berechne zuerst die Summe und die Differenz einzeln. Addiere danach beide Ergebnisse.', beispiel: 'Summe von 30 und 20 ist 50, Differenz von 90 und 60 ist 30. Zusammen 50 + 30 = 80.',
        loesungsschritt: `Berechne zuerst die Summe: ${a} + ${b} = ${a + b}.` });
  });

  // ----- A2 Schriftlich addieren -----
  const addZahlen = (niveau) => {
    const [von, bis, passt] = {
      F: [120, 799, (a, b) => addUebertraege(a, b) <= 1],
      G: [1200, 7999, (a, b) => addUebertraege(a, b) >= 1],
      M: [12000, 79999, (a, b) => addUebertraege(a, b) >= 2],
      E: [120000, 7999999, (a, b) => addUebertraege(a, b) >= 3 && String(a).length !== String(b).length],
    }[niveau];
    return suche(() => { const a = zz(von, bis); return [a, zz(Math.floor(von / 3), a - 1)]; }, ([a, b]) => passt(a, b));
  };
  const addSchritt = (a, b) => {
    const x = a % 10, y = b % 10;
    return x + y < 10 ? `Beginne bei den Einern: ${x} + ${y} = ${x + y}. Schreibe ${x + y} an die Einerstelle und rechne dann die Zehner.`
      : `Beginne bei den Einern: ${x} + ${y} = ${x + y}. Schreibe ${(x + y) % 10} an die Einerstelle und merke dir den Übertrag 1 für die Zehner.`;
  };
  for (const niveau of NIVEAUS) {
    gruppe(A('A2'), niveau, () => {
      const [a, b] = addZahlen(niveau);
      return zahl(`Addiere schriftlich: ${fz(a)} + ${fz(b)}`, a + b, fehlerliste(a + b, [[ohneUebertrag(a, b), 'add-uebertrag-vergessen'], [a - b, 'add-subtrahiert']]),
        { tipp: 'Schreibe die Zahlen stellengerecht untereinander und beginne bei den Einern.', beispiel: '457 + 268: Einer 7 + 8 = 15 (schreibe 5, Übertrag 1), Zehner 5 + 6 + 1 = 12 (schreibe 2, Übertrag 1), Hunderter 4 + 2 + 1 = 7. Ergebnis 725.',
          loesungsschritt: addSchritt(a, b) });
    });
  }

  // ----- A3 Mehrere Zahlen addieren -----
  for (const niveau of NIVEAUS) {
    gruppe(A('A3'), niveau, () => {
      const bereiche = { F: [[120, 480], [35, 290], [12, 95]], G: [[1200, 4800], [350, 2900], [45, 950]], M: [[12000, 48000], [3500, 9900], [450, 980], [25, 99]], E: [[120000, 780000], [35000, 99000], [4500, 9800], [250, 990], [25, 99]] }[niveau];
      const z = bereiche.map(([von, bis]) => zz(von, bis)), l = summe(z);
      return zahl(`Berechne: ${z.map(fz).join(' + ')}`, l, fehlerliste(l, [[ohneUebertrag(...z), 'add-uebertrag-vergessen'], [l - z.at(-1), 'sach-schritt-vergessen']]),
        { tipp: 'Schreibe alle Zahlen stellengerecht untereinander: Einer unter Einer, Zehner unter Zehner. Der Übertrag kann auch 2 sein.',
          beispiel: '478 + 356 + 89: Einer 8 + 6 + 9 = 23 (schreibe 3, Übertrag 2), Zehner 7 + 5 + 8 + 2 = 22 (schreibe 2, Übertrag 2), Hunderter 4 + 3 + 2 = 9. Ergebnis 923.',
          loesungsschritt: `Beginne bei den Einern: ${z.map((x) => x % 10).join(' + ')} = ${summe(z.map((x) => x % 10))}.` });
    });
  }

  // ----- A4 Überschlag und Probe -----
  gruppe(A('A4'), 'F', () => {
    const [a, b] = suche(() => addZahlen('F'), ([x, y]) => x - y > 20), s = a + b;
    return auswahl(`Mit welcher Rechnung machst du die Probe zu ${a} + ${b} = ${s}?`, [
      opt(`${s} − ${b} = ${a}`, true), opt(`${s} + ${b} = ${s + b}`, false, 'probe-falsche-umkehr'),
      opt(`${a} − ${b} = ${a - b}`, false, 'probe-falsche-umkehr'), opt(`${s} + ${a} = ${s + a}`, false, 'probe-falsche-umkehr'),
    ], { tipp: 'Die Probe ist die Umkehraufgabe: Aus Plus wird Minus.', beispiel: 'Probe zu 50 + 30 = 80: 80 − 30 = 50. Summe minus ein Summand ergibt den anderen Summanden.',
      loesungsschritt: `Beginne mit der Summe ${s} und ziehe einen der Summanden ab.` });
  });
  gruppe(A('A4'), 'G', () => {
    const [a, b] = suche(() => addZahlen('G'), ([x, y]) => x % 100 !== 0 && y % 100 !== 0 && y >= 150 && (x % 100 >= 50 || y % 100 >= 50));
    const l = runde(a, 100) + runde(b, 100);
    return zahl(`Überschlage: Runde beide Zahlen auf Hunderter und rechne dann. ${a} + ${b} ≈ ?`, l,
      fehlerliste(l, [[a + b, 'ueberschlag-nicht-gerundet'], [Math.floor(a / 100) * 100 + Math.floor(b / 100) * 100, 'falsch-gerundet']]),
      { tipp: 'Schau auf die Zehnerziffer: Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.', beispiel: '4782 + 1319: 4782 wird zu 4800, 1319 wird zu 1300. 4800 + 1300 = 6100.',
        loesungsschritt: `Runde zuerst die erste Zahl: ${a} ≈ ${runde(a, 100)}.` });
  });
  gruppe(A('A4'), 'M', () => {
    const anzahlFalsch = zz(1, 2);
    const rechnungen = Array.from({ length: 4 }, (_, k) => {
      const [a, b] = addZahlen('G');
      return opt(`${a} + ${b} = ${a + b + (k < anzahlFalsch ? wahl([10, -10, 100, -100]) : 0)}`, k < anzahlFalsch);
    });
    return auswahl('Prüfe mit der Probe: Welche Rechnungen sind falsch? Es können mehrere sein.', rechnungen,
      { tipp: 'Ziehe vom Ergebnis einen Summanden ab. Kommt nicht der andere Summand heraus, ist die Rechnung falsch.',
        beispiel: '2458 + 1367 = 3925? Probe: 3925 − 1367 = 2558. Das ist nicht 2458, also ist die Rechnung falsch.', loesungsschritt: 'Rechne für die erste Rechnung die Probe: Ergebnis minus zweiter Summand.' }, true);
  });
  gruppe(A('A4'), 'E', () => {
    const z = suche(() => [zz(12000, 68000), zz(11000, 48000), zz(2500, 9400)], (x) => x.every((v) => v % 1000 !== 0) && x.some((v) => v % 1000 >= 500));
    const l = summe(z.map((v) => runde(v, 1000)));
    return zahl(`Überschlage: Runde alle Zahlen auf Tausender und rechne dann. ${z.map(fz).join(' + ')} ≈ ?`, l,
      fehlerliste(l, [[summe(z), 'ueberschlag-nicht-gerundet'], [summe(z.map((v) => Math.floor(v / 1000) * 1000)), 'falsch-gerundet']]),
      { tipp: 'Schau auf die Hunderterziffer: Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.', beispiel: '23 480 + 15 720 + 4 510: 23 000 + 16 000 + 5 000 = 44 000.',
        loesungsschritt: `Runde zuerst die erste Zahl: ${fz(z[0])} ≈ ${fz(runde(z[0], 1000))}.` });
  });

  // ----- A5 Sachaufgaben -----
  const addKontexte = {
    F: [
      [(a, b) => `Mila hat ${a} € gespart. Zum Geburtstag bekommt sie ${b} € dazu. Wie viel Geld hat sie jetzt?`, '€', 120, 480, 15, 90],
      [(a, b) => `Am Vormittag kommen ${a} Kinder ins Hallenbad, am Nachmittag noch einmal ${b}. Wie viele Kinder waren es an diesem Tag?`, 'Kinder', 110, 380, 85, 290],
      [(a, b) => `Ein Buch hat ${a} Seiten, der zweite Band hat ${b} Seiten. Wie viele Seiten haben beide Bände zusammen?`, 'Seiten', 180, 420, 160, 390],
      [(a, b) => `Die Klasse 5a sammelt ${a} Kastanien, die Klasse 5b sammelt ${b}. Wie viele Kastanien sind es zusammen?`, 'Kastanien', 240, 560, 180, 430],
      [(a, b) => `Eine Radtour führt am ersten Tag über ${a} km und am zweiten Tag über ${b} km. Wie lang ist die ganze Tour?`, 'km', 38, 72, 29, 64],
      [(a, b) => `In einer Bücherei stehen ${a} Sachbücher und ${b} Romane. Wie viele Bücher sind das zusammen?`, 'Bücher', 260, 540, 180, 450],
    ],
    G: [
      [(a, b) => `Ein Zoo hatte im Juni ${a} Besucher und im Juli ${b} Besucher. Wie viele Besucher kamen in beiden Monaten zusammen?`, 'Besucher', 3200, 5800, 2400, 4100],
      [(a, b) => `Ein Fahrradladen verkauft ein E-Bike für ${a} € und dazu einen Anhänger für ${b} €. Wie viel kostet beides zusammen?`, '€', 1850, 3400, 280, 690],
      [(a, b) => `Ein Lkw hat ${a} kg Sand geladen. Es werden noch ${b} kg Kies dazugeladen. Wie viele Kilogramm hat er dann geladen?`, 'kg', 2400, 4800, 1250, 2900],
    ],
  };
  const sachAdd = (niveau, i) => {
    const [text, einheit, v1, b1, v2, b2] = addKontexte[niveau][i % addKontexte[niveau].length];
    const a = zz(v1, b1), b = zz(v2, b2);
    return zahl(text(a, b), a + b, fehlerliste(a + b, [[Math.abs(a - b), 'sach-falsche-rechnung'], [ohneUebertrag(a, b), 'add-uebertrag-vergessen']]),
      { tipp: 'Gesucht ist, wie viel es zusammen ist. Dazu addierst du.', beispiel: '120 Kinder am Vormittag, 90 am Nachmittag: 120 + 90 = 210 Kinder.', loesungsschritt: `Die Rechnung lautet ${a} + ${b}. ${addSchritt(a, b)}` }, einheit);
  };
  const diagrammThemen = [
    ['Besucher im Freibad', 'Besucher', ['Mo', 'Di', 'Mi', 'Do'], (x, y) => `Wie viele Besucher kamen am ${x} und am ${y} zusammen?`, 'Wie viele Besucher kamen an allen vier Tagen zusammen?', (x, y) => `Wie viele Besucher kamen am ${x} mehr als am ${y}?`],
    ['Verkaufte Brötchen', 'Brötchen', ['Mo', 'Di', 'Mi', 'Do'], (x, y) => `Wie viele Brötchen wurden am ${x} und am ${y} zusammen verkauft?`, 'Wie viele Brötchen wurden an allen vier Tagen zusammen verkauft?', (x, y) => `Wie viele Brötchen wurden am ${x} mehr verkauft als am ${y}?`],
    ['Ausgeliehene Bücher', 'Bücher', ['Jan', 'Feb', 'Mär', 'Apr'], (x, y) => `Wie viele Bücher wurden im ${x} und im ${y} zusammen ausgeliehen?`, 'Wie viele Bücher wurden in allen vier Monaten zusammen ausgeliehen?', (x, y) => `Wie viele Bücher wurden im ${x} mehr ausgeliehen als im ${y}?`],
  ];
  const langName = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Jan: 'Januar', Feb: 'Februar', Mär: 'März', Apr: 'April' };
  gruppe(A('A5'), 'F', (i) => sachAdd('F', i));
  gruppe(A('A5'), 'G', (i) => {
    if (i >= 3) return sachAdd('G', i);
    const [titel, einheit, namen, frage] = diagrammThemen[i % 3];
    const werte = suche(() => namen.map(() => zz(2, 9) * 50), (x) => new Set(x).size === 4);
    const [p, q] = suche(() => [zz(0, 3), zz(0, 3)], ([x, y]) => x < y);
    const l = werte[p] + werte[q];
    return { format: 'diagramm', text: 'Lies die Werte im Diagramm ab und rechne.', diagramm: { titel, einheit, max: 500, schritt: 100, hilfslinien: true, werteZeigen: false, saeulen: namen.map((name, k) => ({ name, wert: werte[k] })) },
      teile: [teil(frage(langName[namen[p]], langName[namen[q]]), l, einheit, fehlerliste(l, [[Math.abs(werte[p] - werte[q]), 'sach-falsche-rechnung']]))],
      hilfen: { tipp: 'Lies an der linken Achse ab, wie hoch jede Säule ist. Die gestrichelte Linie liegt genau zwischen zwei Hundertern.', beispiel: 'Eine Säule endet bei 300, eine andere bei 150: zusammen 300 + 150 = 450.',
        loesungsschritt: `Die Säule ${namen[p]} zeigt ${werte[p]}.` } };
  });
  gruppe(A('A5'), 'M', (i) => {
    if (i < 3) {
      const [was, spalten, zeilen] = [
        ['Im Zoo werden die Besucher gezählt. Ergänze die Spalte „Gesamt“.', ['Tag', 'Vormittag', 'Nachmittag', 'Gesamt'], ['Freitag', 'Samstag', 'Sonntag']],
        ['Die Schule sammelt Altpapier. Ergänze die Spalte „Gesamt“ (Angaben in kg).', ['Klasse', '1. Woche', '2. Woche', 'Gesamt'], ['5a', '5b', '5c']],
        ['Ein Kino zählt die verkauften Karten. Ergänze die Spalte „Gesamt“.', ['Film', 'Kinder', 'Erwachsene', 'Gesamt'], ['Film 1', 'Film 2', 'Film 3']],
      ][i % 3];
      const z = zeilen.map(() => [zz(1250, 4800), zz(1150, 3900)]);
      return tabelle(was, spalten, zeilen.map((n, k) => [n, fz(z[k][0]), fz(z[k][1]), L('abc'[k])]), { a: summe(z[0]), b: summe(z[1]), c: summe(z[2]) },
        { tipp: 'In die Spalte „Gesamt“ gehört die Summe der beiden Zahlen in derselben Zeile.', beispiel: 'Vormittag 1 200, Nachmittag 2 350: Gesamt 1 200 + 2 350 = 3 550.',
          loesungsschritt: `Erste Zeile: ${fz(z[0][0])} + ${fz(z[0][1])}. ${addSchritt(z[0][0], z[0][1])}` });
    }
    const a = zz(12500, 38000), b = zz(4500, 9800), c = zz(2500, 8900);
    const s = [
      { text: `Ein Sportverein hat ${fz(a)} € auf dem Konto. Er nimmt beim Sommerfest ${fz(b)} € ein und bekommt ${fz(c)} € Spenden.`,
        teile: [teil('Wie viel Geld ist nach dem Sommerfest auf dem Konto?', a + b, '€'), teil('Wie viel Geld ist mit den Spenden auf dem Konto?', a + b + c, '€', fehlerliste(a + b + c, [[a + c, 'sach-schritt-vergessen']]))] },
      { text: `Ein Schiff hat ${fz(a)} Container geladen. Im ersten Hafen kommen ${fz(b)} Container dazu, im zweiten Hafen ${fz(c)}.`,
        teile: [teil('Wie viele Container sind nach dem ersten Hafen an Bord?', a + b, 'Container'), teil('Wie viele Container sind nach dem zweiten Hafen an Bord?', a + b + c, 'Container', fehlerliste(a + b + c, [[a + c, 'sach-schritt-vergessen']]))] },
      { text: `In einem Stausee sind ${fz(a)} Kubikmeter Wasser. Im März fließen ${fz(b)} Kubikmeter dazu, im April ${fz(c)} Kubikmeter.`,
        teile: [teil('Wie viel Wasser ist Ende März im See?', a + b, 'm³'), teil('Wie viel Wasser ist Ende April im See?', a + b + c, 'm³', fehlerliste(a + b + c, [[a + c, 'sach-schritt-vergessen']]))] },
    ][i % 3];
    return { format: 'sachaufgabe', ...s, hilfen: { tipp: 'Rechne Schritt für Schritt: Das Ergebnis der ersten Frage brauchst du für die zweite.',
      beispiel: '1000 € auf dem Konto, erst 300 € dazu, dann 200 € dazu: 1000 + 300 = 1300, dann 1300 + 200 = 1500.', loesungsschritt: `Für die erste Frage rechnest du ${fz(a)} + ${fz(b)}.` } };
  });
  gruppe(A('A5'), 'E', (i) => {
    if (i < 3) {
      const [titel, einheit, namen, , alle, mehr] = diagrammThemen[i % 3];
      const werte = suche(() => namen.map(() => zz(3, 19) * 250), (x) => new Set(x).size === 4);
      const [p, q] = suche(() => [zz(0, 3), zz(0, 3)], ([x, y]) => werte[x] > werte[y]);
      return { format: 'diagramm', text: 'Lies die Werte im Diagramm ab und rechne.', diagramm: { titel, einheit, max: 5000, schritt: 1000, hilfslinien: true, werteZeigen: false, saeulen: namen.map((name, k) => ({ name, wert: werte[k] })) },
        teile: [teil(alle, summe(werte), einheit, fehlerliste(summe(werte), [[summe(werte) - werte[3], 'sach-schritt-vergessen']])), teil(mehr(langName[namen[p]], langName[namen[q]]), werte[p] - werte[q], einheit, fehlerliste(werte[p] - werte[q], [[werte[p] + werte[q], 'sach-falsche-rechnung']]))],
        hilfen: { tipp: 'Die gestrichelte Linie liegt bei 500. Eine Säule kann auch auf halbem Weg zwischen zwei Linien enden: Das sind dann 250 mehr.',
          beispiel: 'Endet eine Säule in der Mitte zwischen 2 000 und 2 500, zeigt sie 2 250.', loesungsschritt: `Die Säule ${namen[0]} zeigt ${fz(werte[0])}.` } };
    }
    const a = zz(125000, 480000), b = zz(35000, 98000), c = zz(12500, 48000), n = zz(12, 48);
    const [text, einheit] = [
      [`Eine Stadt baut eine Sporthalle. Der Rohbau kostet ${fz(a)} €, die Technik ${fz(b)} € und die Einrichtung ${fz(c)} €. Die Bauzeit beträgt ${n} Wochen. Wie viel kostet die Halle insgesamt?`, '€'],
      [`Ein Verlag druckt ${fz(a)} Schulbücher, ${fz(b)} Arbeitshefte und ${fz(c)} Lösungshefte. Die Druckerei hat ${n} Mitarbeiter. Wie viele Hefte und Bücher werden insgesamt gedruckt?`, 'Stück'],
      [`Bei einem Stadtlauf werden ${fz(a)} € Startgeld, ${fz(b)} € von Sponsoren und ${fz(c)} € Spenden eingenommen. Die Strecke ist ${n} km lang. Wie viel Geld kommt insgesamt zusammen?`, '€'],
    ][i % 3];
    const l = a + b + c;
    return zahl(text, l, fehlerliste(l, [[a + b, 'sach-schritt-vergessen'], [l + n, 'sach-unnoetige-angabe'], [ohneUebertrag(a, b, c), 'add-uebertrag-vergessen']]),
      { tipp: 'Nicht jede Zahl im Text wird gebraucht. Überlege, welche Angaben zur Frage gehören.', beispiel: 'Rohbau 5000 €, Technik 1200 €, Bauzeit 40 Wochen: 5000 + 1200 = 6200 €. Die 40 braucht man nicht.',
        loesungsschritt: `Addiere zuerst die beiden größten Beträge: ${fz(a)} + ${fz(b)} = ${fz(a + b)}.` }, einheit);
  });

  // =====================================================================
  // 3.4 Klammern
  // =====================================================================
  const klammerHilfen = (erst, zwischen) => ({ tipp: 'Was in der Klammer steht, wird zuerst berechnet.', beispiel: '50 − (20 + 10): Die Klammer ergibt 30, dann 50 − 30 = 20.', loesungsschritt: `Berechne zuerst die Klammer: ${erst} = ${zwischen}.` });
  const einfach = (von, bis, i) => {
    const art = i % 3;
    const [a, b, c] = suche(() => [zz(von, bis), zz(Math.floor(von / 4), Math.floor(bis / 2)), zz(Math.floor(von / 8), Math.floor(bis / 3))],
      ([x, y, v]) => (art === 0 ? x - (y + v) > 0 : art === 1 ? y > v && x - (y - v) > 0 : y > v) && y !== v && v > 2);
    const [text, l, ohne, erst, zw] = art === 0 ? [`${fz(a)} − (${fz(b)} + ${fz(c)})`, a - (b + c), a - b + c, `${fz(b)} + ${fz(c)}`, b + c]
      : art === 1 ? [`${fz(a)} − (${fz(b)} − ${fz(c)})`, a - (b - c), a - b - c, `${fz(b)} − ${fz(c)}`, b - c]
        : [`${fz(a)} + (${fz(b)} − ${fz(c)})`, a + (b - c), a + b + c, `${fz(b)} − ${fz(c)}`, b - c];
    return zahl(`Berechne: ${text}`, l, fehlerliste(l, [[ohne, 'klammer-ignoriert']]), klammerHilfen(erst, fz(zw)));
  };
  gruppe(KL('B1'), 'F', (i) => einfach(40, 99, i % 2));
  gruppe(KL('B1'), 'G', (i) => einfach(200, 990, i));
  gruppe(KL('B1'), 'M', (i) => {
    if (i % 3 === 2) {
      const z = suche(() => [0, 1, 2].map(() => [zz(400, 990), zz(110, 250), zz(35, 140)]), (x) => new Set(x.map((v) => v[0])).size === 3);
      return tabelle('Berechne für jede Zeile den Wert von a − (b + c).', ['a', 'b', 'c', 'a − (b + c)'], z.map(([a, b, c], k) => [a, b, c, L('abc'[k])]),
        Object.fromEntries(z.map(([a, b, c], k) => ['abc'[k], a - (b + c)])), klammerHilfen(`${z[0][1]} + ${z[0][2]}`, z[0][1] + z[0][2]));
    }
    const [a, b, c, d] = suche(() => [zz(500, 990), zz(110, 380), zz(60, 190), zz(25, 150)], ([x, y, v, u]) => (i % 2 ? x - y - (v + u) > 0 : v > u) && v !== u);
    const [text, l, ohne] = i % 2 ? [`(${a} − ${b}) − (${c} + ${d})`, a - b - (c + d), a - b - c + d] : [`(${a} + ${b}) − (${c} − ${d})`, a + b - (c - d), a + b - c - d];
    return zahl(`Berechne: ${text}`, l, fehlerliste(l, [[ohne, 'klammer-ignoriert']]),
      { tipp: 'Berechne zuerst beide Klammern einzeln. Verrechne danach die beiden Ergebnisse.', beispiel: '(90 − 30) − (20 + 10): 60 − 30 = 30.', loesungsschritt: `Die erste Klammer: ${a} ${i % 2 ? '−' : '+'} ${b} = ${i % 2 ? a - b : a + b}.` });
  });
  gruppe(KL('B1'), 'E', (i) => {
    const [a, b, c, d] = suche(() => [zz(2500, 9800), zz(1200, 4800), zz(250, 980), zz(120, 640)], ([x, y, v, u]) => (i % 2 ? y - (v + u) > 0 && x - (y - (v + u)) > 0 : v > u && x - (y + (v - u)) > 0));
    const [text, l, ohne, erst, zw] = i % 2 ? [`${fz(a)} − [${fz(b)} − (${c} + ${d})]`, a - (b - (c + d)), a - b - c + d, `${c} + ${d}`, c + d]
      : [`${fz(a)} − [${fz(b)} + (${c} − ${d})]`, a - (b + (c - d)), a - b + c - d, `${c} − ${d}`, c - d];
    return zahl(`Berechne: ${text}`, l, fehlerliste(l, [[ohne, 'klammer-ignoriert']]),
      { tipp: 'Bei Klammern in Klammern rechnest du von innen nach außen: erst die runde Klammer, dann die eckige.', beispiel: '100 − [50 − (20 + 10)]: runde Klammer 30, eckige Klammer 50 − 30 = 20, dann 100 − 20 = 80.',
        loesungsschritt: `Berechne zuerst die runde Klammer: ${erst} = ${zw}.` });
  });

  // ----- B2 Rechenausdrücke aufstellen -----
  const wortaufgabe = (a, b, c, art) => (art === 0
    ? [`Subtrahiere von ${fz(a)} die Summe der Zahlen ${fz(b)} und ${fz(c)}.`, `${fz(a)} − (${fz(b)} + ${fz(c)})`, a - (b + c), a - b + c]
    : art === 1 ? [`Subtrahiere von ${fz(a)} die Differenz der Zahlen ${fz(b)} und ${fz(c)}.`, `${fz(a)} − (${fz(b)} − ${fz(c)})`, a - (b - c), a - b - c]
      : [`Addiere zu ${fz(a)} die Differenz der Zahlen ${fz(b)} und ${fz(c)}.`, `${fz(a)} + (${fz(b)} − ${fz(c)})`, a + (b - c), a + b + c]);
  gruppe(KL('B2'), 'F', (i) => {
    const art = i % 3;
    const [a, b, c] = suche(() => [zz(50, 99), zz(18, 40), zz(5, 17)], ([x, y, v]) => x - (y + v) > 0);
    const [text, richtig] = wortaufgabe(a, b, c, art);
    const alle = [`${a} − (${b} + ${c})`, `${a} − (${b} − ${c})`, `${a} + (${b} − ${c})`, `(${a} − ${b}) + ${c}`, `(${a} + ${b}) − ${c}`];
    const falsche = alle.filter((t) => t !== richtig).slice(0, 3);
    return auswahl(`Welcher Rechenausdruck passt? „${text}“`, [opt(richtig, true), ...falsche.map((t) => opt(t, false, 'klammer-falsch-gesetzt'))],
      { tipp: 'Die Summe oder Differenz, von der im Text die Rede ist, gehört in die Klammer.', beispiel: '„Subtrahiere von 80 die Summe von 20 und 10“: Die Summe ist (20 + 10), also 80 − (20 + 10).',
        loesungsschritt: `Welche zwei Zahlen werden zuerst zusammengefasst? Es sind ${b} und ${c}.` });
  });
  gruppe(KL('B2'), 'G', (i) => {
    const [a, b, c] = suche(() => [zz(400, 990), zz(120, 300), zz(25, 115)], ([x, y, v]) => x - (y + v) > 0);
    const [text, ausdruck, l, ohne] = wortaufgabe(a, b, c, i % 3);
    return zahl(`${text} Schreibe den Rechenausdruck mit Klammer auf und berechne ihn.`, l, fehlerliste(l, [[ohne, 'klammer-ignoriert']]),
      { tipp: 'Die Summe oder Differenz, von der im Text die Rede ist, gehört in die Klammer und wird zuerst berechnet.', beispiel: '„Subtrahiere von 80 die Summe von 20 und 10“: 80 − (20 + 10) = 80 − 30 = 50.',
        loesungsschritt: `Der Rechenausdruck lautet ${ausdruck}.` });
  });
  gruppe(KL('B2'), 'M', (i) => {
    const a = zz(60, 200), b = zz(12, 45), c = zz(8, 38);
    const s = [
      [`Lena hat ${a} € gespart. Sie kauft ein Buch für ${b} € und ein Spiel für ${c} €.`, 'Wie viel kosten Buch und Spiel zusammen?', 'Wie viel Geld hat Lena danach noch?', '€'],
      [`In einem Kinosaal gibt es ${a} Plätze. Die Klasse 5a reserviert ${b} Plätze, die Klasse 5b reserviert ${c} Plätze.`, 'Wie viele Plätze sind reserviert?', 'Wie viele Plätze sind danach noch frei?', 'Plätze'],
      [`Ein Wanderweg ist ${a} km lang. Die Gruppe schafft am ersten Tag ${b} km und am zweiten Tag ${c} km.`, 'Wie viele Kilometer hat die Gruppe an beiden Tagen geschafft?', 'Wie viele Kilometer liegen noch vor ihr?', 'km'],
    ][i % 3];
    return { format: 'sachaufgabe', text: `${s[0]} Zur Aufgabe passt der Rechenausdruck ${a} − (${b} + ${c}).`,
      teile: [teil(s[1], b + c, s[3]), teil(s[2], a - (b + c), s[3], fehlerliste(a - (b + c), [[a - b + c, 'klammer-ignoriert'], [a - b, 'sach-schritt-vergessen']]))],
      hilfen: { tipp: 'Die Klammer fasst zusammen, was insgesamt weggeht. Sie wird zuerst berechnet.', beispiel: '50 € gespart, 12 € und 8 € ausgegeben: 50 − (12 + 8) = 50 − 20 = 30 €.', loesungsschritt: `Die Klammer: ${b} + ${c} = ${b + c}.` } };
  });
  gruppe(KL('B2'), 'E', (i) => {
    if (i % 2 === 0) {
      const [a, b, c, d] = suche(() => [zz(500, 990), zz(120, 380), zz(300, 800), zz(110, 290)], ([x, y, v, u]) => x > y && v > u);
      const l = a - b + (c - d);
      return zahl(`Addiere zur Differenz der Zahlen ${a} und ${b} die Differenz der Zahlen ${c} und ${d}. Schreibe den Rechenausdruck mit Klammern auf und berechne ihn.`, l,
        fehlerliste(l, [[a - b + c + d, 'klammer-ignoriert'], [a - b, 'sach-schritt-vergessen']]),
        { tipp: 'Jede Differenz bekommt eine eigene Klammer. Berechne beide Klammern und addiere die Ergebnisse.', beispiel: 'Differenz von 90 und 60 ist 30, Differenz von 50 und 30 ist 20: (90 − 60) + (50 − 30) = 50.',
          loesungsschritt: `Der Rechenausdruck lautet (${a} − ${b}) + (${c} − ${d}).` });
    }
    const p = zz(48, 60), a = zz(12, 20), b = zz(9, 18), c = zz(3, 8);
    const [text, einheit] = [
      [`Ein Bus hat ${p} Plätze. An der ersten Haltestelle steigen ${a} Personen ein. An der zweiten steigen ${b} Personen ein und ${c} aus. Wie viele Plätze sind danach noch frei?`, 'Plätze'],
      [`In einer Kiste sind ${p} Äpfel. Am Montag werden ${a} Äpfel gegessen. Am Dienstag werden ${b} gegessen, aber ${c} neue dazugelegt. Wie viele Äpfel sind danach in der Kiste?`, 'Äpfel'],
      [`Ein Parkplatz hat ${p} Stellplätze. Am Morgen kommen ${a} Autos. Am Mittag kommen ${b} Autos dazu und ${c} fahren weg. Wie viele Stellplätze sind danach noch frei?`, 'Stellplätze'],
    ][Math.floor(i / 2) % 3];
    const l = p - (a + (b - c));
    return zahl(text, l, fehlerliste(l, [[p - a - b - c, 'klammer-ignoriert'], [p - a, 'sach-schritt-vergessen']]),
      { tipp: 'Überlege zuerst, wie sich die Anzahl an der zweiten Station insgesamt ändert. Das gehört in eine Klammer.', beispiel: '40 Plätze, erst 10 ein, dann 8 ein und 3 aus: 40 − [10 + (8 − 3)] = 40 − 15 = 25.',
        loesungsschritt: `An der zweiten Station ändert sich die Anzahl um ${b} − ${c} = ${b - c}.` }, einheit);
  });

  // =====================================================================
  // 3.5 Rechengesetze
  // =====================================================================
  const V = 'Vertauschungsgesetz', B = 'Verbindungsgesetz', KEIN = 'kein Gesetz, die Gleichung ist falsch';
  const gesetzHilfen = { tipp: 'Vertauschungsgesetz: Summanden darf man vertauschen. Verbindungsgesetz: Beim Addieren darf man Klammern beliebig setzen. Für die Subtraktion gilt beides nicht.',
    beispiel: '17 + 25 = 25 + 17 (Vertauschungsgesetz). (17 + 25) + 5 = 17 + (25 + 5) (Verbindungsgesetz).', loesungsschritt: 'Schau zuerst: Wurden nur Zahlen vertauscht oder wurde die Klammer versetzt?' };
  // ----- R1 Gesetze erkennen -----
  gruppe(R('R1'), 'F', () => {
    const [a, b] = suche(() => [zz(12, 68), zz(12, 68)], ([x, y]) => x !== y);
    return luecken(`${a} + ${b} = ${b} + {{a}}`, { a: [a, fehlerliste(a, [[b, 'begriffe-verwechselt'], [a + b, 'sach-falsche-rechnung']])] },
      { tipp: 'Vertauschungsgesetz: Beim Addieren darf man die Summanden vertauschen. Das Ergebnis bleibt gleich.', beispiel: '14 + 23 = 23 + 14.', loesungsschritt: `Rechts steht schon ${b}. Es fehlt der andere Summand von der linken Seite.` });
  });
  gruppe(R('R1'), 'G', (i) => {
    const [a, b, c] = suche(() => [zz(12, 68), zz(12, 68), zz(12, 68)], (x) => new Set(x).size === 3 && x[0] > x[1]);
    if (i % 2 === 0) {
      return luecken(`(${a} + ${b}) + ${c} = ${a} + ({{a}} + ${c})`, { a: [b, fehlerliste(b, [[a, 'begriffe-verwechselt'], [a + b, 'sach-falsche-rechnung']])] },
        { tipp: 'Verbindungsgesetz: Beim Addieren darf man die Klammer versetzen. Die Zahlen bleiben in derselben Reihenfolge.', beispiel: '(14 + 23) + 7 = 14 + (23 + 7).', loesungsschritt: 'Die Reihenfolge der drei Zahlen bleibt gleich. Welche Zahl steht links in der Mitte?' });
    }
    const [gleichung, richtig] = [[`${a} + ${b} = ${b} + ${a}`, V], [`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, B], [`${a} − ${b} = ${b} − ${a}`, KEIN]][Math.floor(i / 2) % 3];
    return auswahl(`Welches Rechengesetz zeigt diese Gleichung? ${gleichung}`, [V, B, KEIN].map((t) => opt(t, t === richtig, t === richtig ? undefined : richtig === KEIN ? 'gesetz-auf-subtraktion' : 'begriffe-verwechselt')), gesetzHilfen);
  });
  gruppe(R('R1'), 'M', () => {
    const [a, b, c] = suche(() => [zz(120, 480), zz(25, 95), zz(12, 75)], (x) => new Set(x).size === 3);
    return { format: 'zuordnen', text: 'Ordne jeder Gleichung zu, welches Rechengesetz sie zeigt.',
      paare: [{ links: `${a} + ${b} = ${b} + ${a}`, rechts: V }, { links: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, rechts: B }, { links: `(${a} − ${b}) − ${c} = ${a} − (${b} − ${c})`, rechts: KEIN }], hilfen: gesetzHilfen };
  });
  gruppe(R('R1'), 'E', () => {
    const [a, b, c] = suche(() => [zz(320, 880), zz(125, 295), zz(35, 115)], (x) => new Set(x).size === 3);
    const kandidaten = [
      [`${a} + ${b} = ${b} + ${a}`, true], [`(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, true], [`${a} + ${b} + ${c} = ${c} + ${a} + ${b}`, true],
      [`${a} − ${b} = ${b} − ${a}`, false], [`(${a} − ${b}) − ${c} = ${a} − (${b} − ${c})`, false], [`${a} − (${b} + ${c}) = (${a} − ${b}) + ${c}`, false],
    ];
    const gewaehlt = suche(() => { const k = [...kandidaten]; const aus = []; while (aus.length < 4) aus.push(k.splice(zz(0, k.length - 1), 1)[0]); return aus; }, (x) => x.some((v) => v[1]) && x.some((v) => !v[1]));
    return auswahl('Welche Gleichungen stimmen? Es können mehrere sein.', gewaehlt.map(([t, wahr]) => opt(t, wahr, wahr ? undefined : 'gesetz-auf-subtraktion')),
      { ...gesetzHilfen, loesungsschritt: 'Rechne bei der ersten Gleichung beide Seiten aus und vergleiche.' }, true);
  });

  // ----- R2 Vorteilhaft rechnen -----
  const vorteil = (zahlen, paare, l) => zahl(`Rechne vorteilhaft: ${zahlen.map(fz).join(' + ')}`, l, fehlerliste(l, [[l - zahlen.at(-1), 'sach-schritt-vergessen'], [ohneUebertrag(...zahlen), 'add-uebertrag-vergessen']]),
    { tipp: 'Suche Zahlen, die zusammen eine glatte Zahl ergeben. Du darfst die Summanden vertauschen und beliebig zusammenfassen.', beispiel: '17 + 25 + 3: 17 + 3 = 20, dann 20 + 25 = 45.',
      loesungsschritt: `Fasse zuerst zusammen: ${paare}.` });
  gruppe(R('R2'), 'F', () => {
    const a = suche(() => zz(11, 48), (x) => x % 10 !== 0), c = 10 - (a % 10) + 10 * zz(0, 2), b = suche(() => zz(12, 49), (x) => x % 10 !== 0 && (x + a) % 10 !== 0);
    return vorteil([a, b, c], `${a} + ${c} = ${a + c}`, a + b + c);
  });
  gruppe(R('R2'), 'G', () => {
    const a = suche(() => zz(110, 480), (x) => x % 100 !== 0 && x % 10 !== 0), c = 100 - (a % 100) + 100 * zz(0, 2), b = suche(() => zz(25, 95), (x) => x % 10 !== 0);
    return vorteil([a, b, c], `${a} + ${c} = ${a + c}`, a + b + c);
  });
  gruppe(R('R2'), 'M', () => {
    const a = suche(() => zz(110, 480), (x) => x % 100 !== 0 && x % 5 === 0), a2 = 100 - (a % 100) + 100 * zz(0, 2);
    const b = suche(() => zz(111, 389), (x) => x % 100 !== 0 && x % 10 !== 0 && (x + a) % 100 !== 0), b2 = 100 - (b % 100) + 100 * zz(0, 1);
    return vorteil([a, b, a2, b2], `${a} + ${a2} = ${a + a2} und ${b} + ${b2} = ${b + b2}`, a + b + a2 + b2);
  });
  gruppe(R('R2'), 'E', (i) => {
    if (i % 2 === 0) {
      const a = suche(() => zz(1100, 4800), (x) => x % 1000 !== 0 && x % 50 === 0), a2 = 1000 - (a % 1000) + 1000 * zz(0, 2);
      const b = suche(() => zz(1125, 3875), (x) => x % 1000 !== 0 && x % 25 === 0 && (x + a) % 1000 !== 0), b2 = 1000 - (b % 1000) + 1000 * zz(0, 1), e = zz(12, 98) * 10;
      return vorteil([a, b, a2, e, b2], `${fz(a)} + ${fz(a2)} = ${fz(a + a2)} und ${fz(b)} + ${fz(b2)} = ${fz(b + b2)}`, a + b + a2 + b2 + e);
    }
    const a = zz(5200, 9800), b = suche(() => zz(1150, 2850), (x) => x % 1000 !== 0 && x % 50 === 0), c = 1000 - (b % 1000) + 1000 * zz(0, 1);
    const l = a - b - c;
    return zahl(`Rechne vorteilhaft: ${fz(a)} − ${fz(b)} − ${fz(c)}`, l, fehlerliste(l, [[a - b + c, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
      { tipp: 'Fasse die beiden Zahlen zusammen, die abgezogen werden. Ihre Summe ist eine glatte Zahl.', beispiel: '900 − 250 − 150: 250 + 150 = 400, dann 900 − 400 = 500.',
        loesungsschritt: `${fz(b)} + ${fz(c)} = ${fz(b + c)}. Ziehe diese Summe von ${fz(a)} ab.` });
  });
}
