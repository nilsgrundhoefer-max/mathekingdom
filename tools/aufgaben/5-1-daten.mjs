// Aufgaben zu Kapitel 5.1 „Daten und Diagramme“ (Lernziele H1, H2, L1, L2, Z1, Z2, V1, V2, U1) nach ADR 0015.
// Grilling mit Nils am 2026-11-20: feinere Lernziele, Strichliste anlegen und Säulen zeichnen als eigene Formate,
// Achsen beginnen bei 0 und haben gleiche Schritte (Ausnahme: bewusst täuschende Diagramme in V2 auf M und E),
// halbe Bilder im Bilddiagramm erst ab M, Bündeln der Strichliste auf F und G von selbst, ab M selbst.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, tabelle, L, Z, B, frage, h1, h2, h3, zz, wahl, mische, suche, summe, kind, zweiKinder, U,
  HILFSZAHL, er, Er, strichlisteAnlegen, zeichnen, aufgaben } from '../werkzeug.mjs';

const ID = (uk, kurz) => `5.1.${uk}-${kurz}`;

// ---------- Sonderarten im Nachweis (tools/pruefe-pool.mjs prüft jede selbst am Bild, an der Liste oder an der Tabelle nach) ----------
const ABL = (name, wert, quelle, spalte) => ({ art: 'ablesen', name, wert, ...(quelle ? { quelle } : {}), ...(spalte ? { spalte } : {}) });
const ZEILE = (bedingung, wert, quelle) => ({ art: 'zeile', bedingung, ...(wert != null ? { wert } : {}), ...(quelle ? { quelle } : {}) });
const SCHLUESSEL = (wert) => ({ art: 'schluessel', wert });
const LINIE = (wert) => ({ art: 'linienabstand', wert });
const DATENWAHL = (quelle) => ({ art: 'datenwahl', ...(quelle ? { quelle } : {}) });
const RANG = (quelle) => ({ art: 'rangfolge', ...(quelle ? { quelle } : {}) });
const EINTEILUNG = (werte) => ({ art: 'einteilung', werte });
const MANGEL = { art: 'mangel' };
const AUSSAGE = (typ, namen, stimmt, wert) => ({ art: 'aussage', typ, namen, stimmt, ...(wert != null ? { wert } : {}) });
const AUSSAGEN = (liste) => ({ art: 'aussagen', liste });

// ---------- Hilfen je Niveaustufe ----------
const hil = (n, tipp, beispiel, schritt) => (n === 'E' ? h1(tipp) : n === 'M' ? h2(tipp, schritt ?? beispiel) : h3(tipp, beispiel, schritt));

// ---------- Sachzusammenhänge ----------
// Umfragen in der Klasse. spalte: Kopf der Tabelle. symbol: Bild im Bilddiagramm.
const UMFRAGEN = [
  { titel: 'Lieblingstiere', spalte: 'Tier', frage: 'Welches Tier magst du am liebsten?', namen: ['Hund', 'Katze', 'Pferd', 'Hase', 'Hamster'] },
  { titel: 'Lieblingsobst', spalte: 'Obst', frage: 'Welches Obst isst du am liebsten?', namen: ['Apfel', 'Banane', 'Erdbeere', 'Kirsche', 'Traube'] },
  { titel: 'Schulweg', spalte: 'Schulweg', frage: 'Wie kommst du zur Schule?', namen: ['zu Fuß', 'Fahrrad', 'Bus', 'Auto', 'Roller'] },
  { titel: 'Lieblingssport', spalte: 'Sport', frage: 'Welchen Sport machst du am liebsten?', namen: ['Fußball', 'Schwimmen', 'Turnen', 'Tanzen', 'Reiten'] },
  { titel: 'Lieblingsfarben', spalte: 'Farbe', frage: 'Welche Farbe magst du am liebsten?', namen: ['Rot', 'Blau', 'Grün', 'Gelb', 'Lila'] },
  { titel: 'Lieblingseis', spalte: 'Eissorte', frage: 'Welche Eissorte isst du am liebsten?', namen: ['Vanille', 'Schoko', 'Erdbeere', 'Zitrone', 'Nuss'] },
];
const umfrage = (u, klasse = wahl(['5a', '5b', '5c'])) => ({
  ...u, art: 'umfrage', einheit: 'Kinder', subjekt: 'Kinder', symbol: 'kind', klasse,
  diagrammTitel: `${u.titel} der ${klasse}`,
  einleitung: `Die Kinder der ${klasse} wurden gefragt: „${u.frage}“`,
  wie: (n) => `Wie viele Kinder haben „${n}“ gewählt?`,
  mehr: (a, b) => `Wie viele Kinder mehr haben „${a}“ gewählt als „${b}“?`,
  zus: (a, b) => `Wie viele Kinder haben „${a}“ oder „${b}“ gewählt?`,
  alle: 'Wie viele Kinder wurden insgesamt befragt?',
  gewaehlt: (n) => `„${n}“`, bei: (n) => `bei „${n}“`,
});
// Königreich: Der Kundschafter zählt für den König.
const BURGHOF = { titel: 'Tiere auf dem Burghof', spalte: 'Tier', einheit: 'Tiere', subjekt: 'Tiere', symbol: 'schaf', art: 'zaehlung', namen: ['Schafe', 'Ziegen', 'Hühner', 'Kühe', 'Gänse'],
  diagrammTitel: 'Tiere auf dem Burghof', einleitung: 'Der Kundschafter zählt die Tiere auf dem Burghof.',
  wie: (n) => `Wie viele ${n} sind auf dem Burghof?`, mehr: (a, b) => `Wie viele ${a} mehr als ${b} sind auf dem Burghof?`,
  zus: (a, b) => `Wie viele ${a} und ${b} sind es zusammen?`, alle: 'Wie viele Tiere sind es insgesamt?', gewaehlt: (n) => n,
  bei: (n) => `bei den ${{ Schafe: 'Schafen', Ziegen: 'Ziegen', Hühner: 'Hühnern', Kühe: 'Kühen', Gänse: 'Gänsen' }[n]}` };
const TAGE = { Mo: 'Montag', Di: 'Dienstag', Mi: 'Mittwoch', Do: 'Donnerstag', Fr: 'Freitag', Sa: 'Samstag', So: 'Sonntag' };
const besuch = (ort, titel) => ({ titel, spalte: 'Tag', einheit: 'Besucher', subjekt: 'Besucher', symbol: 'kind', art: 'besuch', namen: Object.keys(TAGE),
  diagrammTitel: titel, einleitung: `Das Diagramm zeigt die Besucher ${ort}.`,
  wie: (n) => `Wie viele Besucher kamen am ${TAGE[n]}?`, mehr: (a, b) => `Wie viele Besucher kamen am ${TAGE[a]} mehr als am ${TAGE[b]}?`,
  zus: (a, b) => `Wie viele Besucher kamen am ${TAGE[a]} und am ${TAGE[b]} zusammen?`, alle: 'Wie viele Besucher kamen an allen Tagen zusammen?', gewaehlt: (n) => TAGE[n], bei: (n) => `am ${TAGE[n]}` });
const BESUCHE = [besuch('im Freibad', 'Besucher im Freibad'), besuch('im Museum', 'Besucher im Museum'), besuch('auf der Burg', 'Besucher auf der Burg'), besuch('im Zoo', 'Besucher im Zoo')];
const BUECHER = { titel: 'Ausgeliehene Bücher', spalte: 'Klasse', einheit: 'Bücher', subjekt: 'Bücher', symbol: 'buch', art: 'zaehlung', namen: ['5a', '5b', '5c', '5d', '5e'],
  diagrammTitel: 'Ausgeliehene Bücher im Schuljahr', einleitung: 'Die Bücherei zählt die ausgeliehenen Bücher der Klassen.',
  wie: (n) => `Wie viele Bücher hat die Klasse ${n} ausgeliehen?`, mehr: (a, b) => `Wie viele Bücher hat die ${a} mehr ausgeliehen als die ${b}?`,
  zus: (a, b) => `Wie viele Bücher haben die ${a} und die ${b} zusammen ausgeliehen?`, alle: 'Wie viele Bücher wurden insgesamt ausgeliehen?', gewaehlt: (n) => n, bei: (n) => `bei der ${n}` };
const ERNTE = { titel: 'Äpfel im Königreich', spalte: 'Hof', einheit: 'Körbe', subjekt: 'Körbe', symbol: 'apfel', art: 'zaehlung', namen: ['Eichenhof', 'Mühlhof', 'Steinhof', 'Rosenhof', 'Talhof'],
  diagrammTitel: 'Apfelernte im Königreich', einleitung: 'Der Kundschafter notiert für den König die Apfelernte der Höfe.',
  wie: (n) => `Wie viele Körbe hat der ${n} geerntet?`, mehr: (a, b) => `Wie viele Körbe hat der ${a} mehr geerntet als der ${b}?`,
  zus: (a, b) => `Wie viele Körbe haben der ${a} und der ${b} zusammen geerntet?`, alle: 'Wie viele Körbe wurden insgesamt geerntet?', gewaehlt: (n) => n, bei: (n) => `beim ${n}` };

// Ein Sachzusammenhang für kleine Zahlen (Umfrage oder Burghof) und einer für große Zahlen.
const klein = () => (zz(1, 6) === 1 ? BURGHOF : umfrage(wahl(UMFRAGEN)));
const kleinUmfrage = () => umfrage(wahl(UMFRAGEN));
const gross = () => wahl([...BESUCHE, BESUCHE[0], BUECHER, ERNTE]);
// k Namen eines Sachzusammenhangs in ihrer festen Reihenfolge (Wochentage bleiben in der Wochenfolge).
const namenVon = (s, k) => { if (s.art === 'besuch') { const st = zz(0, 7 - k); return s.namen.slice(st, st + k); } return mische(s.namen).slice(0, k).sort((a, b) => s.namen.indexOf(a) - s.namen.indexOf(b)); };

// k verschiedene Werte, Vielfache von `schritt` zwischen von und bis. eindeutig: größter und kleinster Wert kommen nur einmal vor.
function werte(k, von, bis, schritt = 1, passt = () => true) {
  return suche(() => Array.from({ length: k }, () => zz(Math.ceil(von / schritt), Math.floor(bis / schritt)) * schritt),
    (w) => new Set(w).size === k && passt(w));
}
const Bei = (s, n) => s.bei(n)[0].toUpperCase() + s.bei(n).slice(1);
const paare = (namen, w) => namen.map((n, i) => [n, w[i]]);
const groesster = (namen, w) => namen[w.indexOf(Math.max(...w))];
const kleinster = (namen, w) => namen[w.indexOf(Math.min(...w))];
// Antworten einer Liste in zufälliger Reihenfolge (Urliste).
const urliste = (namen, w) => mische(namen.flatMap((n, i) => Array(w[i]).fill(n)));
// Strichlisten-Fehler: ein Bündel als 4 gezählt.
const alsVier = (n) => 4 * Math.floor(n / 5) + (n % 5);
const fehlerBuendel = (n) => (n >= 5 ? [{ wert: alsVier(n), fehlvorstellung: 'strich-buendel-als-vier' }] : []);
// Skalen-Fehler: Linien gezählt statt Zahlen gelesen, oder den nächsten beschrifteten Wert genommen.
function fehlerSkala(wert, d) {
  const f = [];
  const fein = d.fein ?? d.schritt;
  if (fein > 1 && wert / fein !== wert) f.push({ wert: wert / fein, fehlvorstellung: 'skala-einerschritte' });
  if (wert % d.schritt !== 0) {
    const unten = Math.floor(wert / d.schritt) * d.schritt;
    if (unten > 0 && !f.some((x) => x.wert === unten)) f.push({ wert: unten, fehlvorstellung: 'skala-zwischenwert' });
  }
  return f.filter((x) => x.wert !== wert && Number.isInteger(x.wert));
}
function fehlerBild(wert, je) {
  const ganz = Math.floor(wert / je), halb = wert % je !== 0;
  const f = [{ wert: ganz + (halb ? 1 : 0), fehlvorstellung: 'bild-symbole-gezaehlt' }];
  if (halb) f.push({ wert: (ganz + 1) * je, fehlvorstellung: 'bild-halbes-symbol' });
  return f.filter((x, i, a) => x.wert !== wert && a.findIndex((y) => y.wert === x.wert) === i);
}
const ohneDoppelte = (loesung, f) => f.filter((x, i, a) => x.wert !== loesung && x.wert >= 0 && a.findIndex((y) => y.wert === x.wert) === i);

// Skalen je Niveaustufe: fein = Abstand aller Linien, schritt = Abstand der beschrifteten Linien.
const SKALA = {
  F: [{ fein: 1, schritt: 1, max: 10 }, { fein: 2, schritt: 2, max: 20 }],
  G: [{ fein: 2, schritt: 10, max: 30 }, { fein: 2, schritt: 10, max: 40 }, { fein: 5, schritt: 10, max: 50 }, { fein: 5, schritt: 20, max: 100 }],
  M: [{ fein: 10, schritt: 50, max: 200 }, { fein: 20, schritt: 100, max: 400 }, { fein: 25, schritt: 100, max: 500 }],
  E: [{ fein: 50, schritt: 250, max: 1000 }, { fein: 100, schritt: 500, max: 2000 }, { fein: 50, schritt: 200, max: 1200 }],
};
// Werte zu einer Skala: auf den Linien, größter Wert nahe am Ende der Achse, ab G meist nicht auf einer beschrifteten Linie.
function skalenWerte(sk, k, n, extra = () => true) {
  const minimum = n === 'F' ? sk.fein : sk.fein * 2;
  return werte(k, minimum, sk.max, sk.fein, (w) => Math.max(...w) > sk.max - 3 * sk.fein && (n === 'F' || w.filter((x) => x % sk.schritt !== 0).length >= Math.ceil(k / 2)) && extra(w));
}
const saeulenBild = (s, namen, w, sk, extra = {}) => B.saeulen({ titel: s.diagrammTitel, einheit: s.einheit, max: sk.max, schritt: sk.schritt, ...(sk.fein !== sk.schritt ? { fein: sk.fein } : {}), saeulen: paare(namen, w), ...extra });
const balkenBild = (s, namen, w, sk, extra = {}) => saeulenBild(s, namen, w, sk, { liegend: true, ...extra });
const daten = (s, namen, w, kopf2) => ({ kopf: [s.spalte, kopf2 ?? s.einheit], zeilen: namen.map((n, i) => [n, String(w[i])]) });
const strichBild = (namen, w, titel) => B.strichliste(paare(namen, w), titel);
const bildDiagramm = (s, namen, w, je, extra = {}) => B.bilddiagramm({ titel: s.diagrammTitel, einheit: s.einheit, symbol: s.symbol, je, zeilen: paare(namen, w), ...extra });

export function datenUndDiagramme() {
  strichlisten();
  haeufigkeitstabellen();
  diagrammeLesen();
  bilddiagramme();
  saeulenZeichnen();
  einteilungUndFehler();
  datenVergleichen();
  aussagenPruefen();
  umfragen();
  // Ein Zitat im Zitat steht in einfachen Anführungszeichen: „Bei ‚Rot‘ sind es mehr.“
  for (const a of aufgaben.filter((x) => x.lernziel.startsWith('5.1.'))) {
    a.text = verschachtelt(a.text);
    for (const o of a.optionen ?? []) o.text = verschachtelt(o.text);
    for (const t of a.teile ?? []) t.text = verschachtelt(t.text);
    for (const k of Object.keys(a.hilfen ?? {})) a.hilfen[k] = verschachtelt(a.hilfen[k]);
    for (const n of a.nachweis ?? []) if (n?.art === 'aussagen') for (const x of n.liste) x.text = verschachtelt(x.text);
  }
}
function verschachtelt(text) {
  let tiefe = 0;
  return [...text].map((c) => {
    if (c === '„') return tiefe++ > 0 ? '‚' : c;
    if (c === '“') return --tiefe > 0 ? '‘' : c;
    if (c === '\n') tiefe = 0;
    return c;
  }).join('');
}

// =====================================================================
// H1 Strichlisten lesen und anlegen
// =====================================================================
function strichlisten() {
  const H1 = ID(1, 'H1');
  // Strichliste lesen: eine Zeile ablesen.
  const lies = (n, k, von, bis) => () => { const s = klein(), namen = namenVon(s, k), w = werte(k, von, bis, 1, (x) => x.some((y) => y >= 5)); const i = w.findIndex((y) => y >= 5), name = namen[i];
    return zahl(Z(s.einleitung, 'Er macht eine Strichliste.'.replace('Er macht', s.art === 'umfrage' ? 'Die Lehrerin macht' : 'Er macht'), s.wie(name)), w[i], fehlerBuendel(w[i]),
      hil(n, 'Ein Bündel sind 5 Striche. Zähle die Bündel in Fünferschritten, dann die einzelnen Striche.', 'Ein Bündel und 2 Striche: 5 + 2 = 7.', `Suche die Zeile ${s.gewaehlt(name)}. Zähle dort zuerst die Bündel.`),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [ABL(name, w[i])] }); };
  // Strichliste anlegen: aus einer Liste von Antworten.
  const anlegen = (n, k, von, bis, buendeln) => () => { const s = klein(), namen = namenVon(s, k), w = werte(k, von, bis, 1, (x) => x.some((y) => y >= 5));
    const liste = urliste(namen, w);
    return strichlisteAnlegen(Z(s.art === 'umfrage' ? `Das sind die Antworten der ${s.klasse}.` : 'Der Kundschafter hat diese Tiere gesehen.', s.art === 'umfrage' ? 'Mache für jede Antwort einen Strich in der passenden Zeile.' : 'Mache für jedes Tier einen Strich in der passenden Zeile.'),
      paare(namen, w), buendeln,
      hil(n, buendeln === 'auto' ? 'Gehe die Liste von vorne nach hinten durch. Mache bei jeder Antwort einen Strich.' : 'Mache bei jeder Antwort einen Strich. Den fünften Strich setzt du mit „Querstrich“ quer über die vier.',
        'Drei Antworten „Hund“: In die Zeile „Hund“ kommen 3 Striche.', `In der Liste steht ${s.gewaehlt(namen[0])} ${w[0]}-mal.`),
      { urliste: liste, nachweis: namen.map((nm, i) => ABL(nm, w[i], 'urliste')) }); };
  // Strichliste nachtragen: Es sind schon Striche da, neue Antworten kommen dazu.
  const nachtragen = (n, k, buendeln) => () => { const s = kleinUmfrage(), namen = namenVon(s, k);
    const alt = werte(k, 3, n === 'G' ? 12 : 18), neu = namen.map(() => zz(1, 4)), w = alt.map((x, i) => x + neu[i]);
    return strichlisteAnlegen(Z(`In der Strichliste stehen schon Antworten der ${s.klasse}.`, 'Diese Kinder haben später geantwortet.', 'Trage ihre Antworten nach.'),
      namen.map((nm, i) => [nm, w[i], alt[i]]), buendeln,
      hil(n, 'Lass die Striche stehen. Mache für jede neue Antwort einen Strich dazu.', 'Bei „Hund“ stehen 7 Striche, 2 neue Antworten kommen dazu: Danach sind es 9.', `${Bei(s, namen[0])} kommen ${neu[0]} Striche dazu.`),
      { urliste: urliste(namen, neu), nachweis: namen.flatMap((nm, i) => [ABL(nm, neu[i], 'urliste'), `${alt[i]} + ${neu[i]} = ${w[i]}`]) }); };

  sechs(H1, 'F', [
    lies('F', 3, 3, 12),
    anlegen('F', 2, 2, 7, 'auto'),
    () => { const s = klein(), name = wahl(s.namen), w = zz(10, 14);
      return zahl(Z(s.einleitung, `Die Strichliste zeigt ${s.gewaehlt(name)}.`, 'Wie viele Striche sind es zusammen?'), w, fehlerBuendel(w),
        hil('F', 'Zähle in Fünferschritten: 5, 10. Zähle dann die einzelnen Striche dazu.', 'Zwei Bündel und 1 Strich: 5 + 5 + 1 = 11.', 'Es sind 2 Bündel. Das sind 10 Striche.'),
        { bild: strichBild([name], [w]), nachweis: [ABL(name, w)] }); },
    () => { const s = klein(), namen = namenVon(s, 3), w = werte(3, 2, 9); const i = zz(0, 2);
      return auswahl(Z(s.einleitung, 'Er schreibt eine Strichliste.'.replace('Er schreibt', s.art === 'umfrage' ? 'Die Lehrerin schreibt' : 'Er schreibt'), `In welcher Zeile stehen ${w[i]} Striche?`), namen.map((nm, j) => opt(nm, j === i)),
        hil('F', 'Zähle die Striche in jeder Zeile.', 'Ein Bündel und 1 Strich sind 6 Striche.', `Zähle zuerst die Zeile ${s.gewaehlt(namen[0])}: ${w[0]} Striche.`),
        { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [ZEILE('gleich', w[i])] }); },
    () => { const s = klein(), namen = namenVon(s, 2), w = werte(2, 5, 9);
      return sach(Z(s.einleitung, 'Lies die Strichliste ab.'), [teil(s.wie(namen[0]), w[0], s.einheit, fehlerBuendel(w[0])), teil(`${s.zus(namen[0], namen[1])}`, w[0] + w[1], s.einheit, ohneDoppelte(w[0] + w[1], [{ wert: w[1], fehlvorstellung: 'sach-schritt-vergessen' }]))],
        hil('F', 'Zähle jede Zeile für sich. Rechne dann plus.', '6 Striche und 7 Striche: 6 + 7 = 13.', `In der ersten Zeile stehen ${w[0]} Striche.`),
        { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [ABL(namen[0], w[0]), ABL(namen[1], w[1]), `${w[0]} + ${w[1]} = ${w[0] + w[1]}`] }); },
    anlegen('F', 3, 2, 6, 'auto'),
  ]);
  sechs(H1, 'G', [
    anlegen('G', 3, 3, 8, 'auto'),
    lies('G', 4, 4, 19),
    () => { const s = klein(), namen = namenVon(s, 3), w = werte(3, 6, 18), gesamt = summe(w); const [a, b] = [namen[w.indexOf(Math.max(...w))], namen[w.indexOf(Math.min(...w))]]; const d = Math.max(...w) - Math.min(...w);
      return sach(Z(s.einleitung, 'Lies die Strichliste ab.'), [teil(s.alle, gesamt, s.einheit, ohneDoppelte(gesamt, [{ wert: alsVier(w[0]) + alsVier(w[1]) + alsVier(w[2]), fehlvorstellung: 'strich-buendel-als-vier' }])),
        teil(s.mehr(a, b), d, s.einheit, ohneDoppelte(d, [{ wert: Math.max(...w) + Math.min(...w), fehlvorstellung: 'unterschied-addiert' }]))],
      hil('G', 'Zähle jede Zeile. Schreibe die Zahl daneben.', 'Zeilen mit 7, 9 und 4 Strichen: 7 + 9 + 4 = 20.', `Die Zeilen haben ${w.join(', ')} Striche.`),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${gesamt}`, `${Math.max(...w)} − ${Math.min(...w)} = ${d}`] }); },
    () => { const s = klein(), namen = namenVon(s, 3), w = werte(3, 6, 14, 1, (x) => x.every((y) => y % 5 !== 0)); const i = zz(0, 2), fehlt = 5 - (w[i] % 5), voll = w[i] + fehlt;
      return zahl(Z(s.einleitung, `Schau dir die Zeile ${s.gewaehlt(namen[i])} an.`, 'Wie viele Striche fehlen bis zum nächsten vollen Bündel?'), fehlt, ohneDoppelte(fehlt, [{ wert: 4 - (w[i] % 5), fehlvorstellung: 'strich-buendel-als-vier' }]),
        hil('G', 'Ein volles Bündel hat 5 Striche. Zähle die einzelnen Striche nach dem letzten Bündel.', 'Nach dem Bündel stehen 3 Striche: Bis 5 fehlen 2.', `In der Zeile stehen ${w[i]} Striche. Das nächste volle Bündel ist bei ${voll}.`),
        { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [ABL(namen[i], w[i]), HILFSZAHL(5, 'Striche in einem Bündel'), `${w[i]} : 5 = ${Math.floor(w[i] / 5)} Rest ${w[i] % 5}`, `5 − ${w[i] % 5} = ${fehlt}`] }); },
    nachtragen('G', 3, 'auto'),
    () => { const s = klein(), namen = namenVon(s, 3), w = werte(3, 6, 14, 1, (x) => x.some((y) => y >= 10)); const i = w.indexOf(Math.max(...w)); const [x, y] = zweiKinder();
      return auswahl(Z(s.einleitung, `${x} und ${y} lesen die Zeile ${s.gewaehlt(namen[i])} ab.`, `${x} sagt: „Es sind ${w[i]}.“`, `${y} sagt: „Es sind ${alsVier(w[i])}.“`, 'Wer hat recht?'),
        [opt(`${x}, denn ein Bündel sind 5 Striche.`, true), opt(`${y}, denn ein Bündel sind 4 Striche.`, false, 'strich-buendel-als-vier'), opt('Beide, denn man kann Bündel verschieden zählen.', false)],
        hil('G', 'Zähle in einem Bündel alle Striche, auch den Querstrich.', 'Zwei Bündel und 1 Strich: 5 + 5 + 1 = 11.', `In der Zeile sind ${Math.floor(w[i] / 5)} Bündel. Jedes Bündel hat 5 Striche.`),
        { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [ABL(namen[i], w[i]), HILFSZAHL(5, 'Striche in einem Bündel'), HILFSZAHL(4, 'falsch gezähltes Bündel'), `${w[i]} : 5 = ${Math.floor(w[i] / 5)} Rest ${w[i] % 5}`, `${Math.floor(w[i] / 5)} · 4 + ${w[i] % 5} = ${alsVier(w[i])}`] }); },
  ]);
  sechs(H1, 'M', [
    anlegen('M', 4, 3, 9, 'selbst'),
    () => { const s = klein(), namen = namenVon(s, 4), w = werte(4, 4, 24), gesamt = summe(w); const [g, k] = [groesster(namen, w), kleinster(namen, w)], d = Math.max(...w) - Math.min(...w);
      return sach(Z(s.einleitung, 'Werte die Strichliste aus.'), [teil(s.alle, gesamt, s.einheit, ohneDoppelte(gesamt, [{ wert: summe(w.map(alsVier)), fehlvorstellung: 'strich-buendel-als-vier' }])),
        teil(s.mehr(g, k), d, s.einheit, ohneDoppelte(d, [{ wert: Math.max(...w) + Math.min(...w), fehlvorstellung: 'unterschied-addiert' }]))],
      hil('M', 'Schreibe zu jeder Zeile die Anzahl als Zahl. Rechne dann mit den Zahlen.', `Die Zeilen haben ${w.join(', ')} Striche.`),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${gesamt}`, `${Math.max(...w)} − ${Math.min(...w)} = ${d}`] }); },
    nachtragen('M', 4, 'selbst'),
    lies('M', 4, 12, 29),
    () => { const s = klein(), name = wahl(s.namen), w = suche(() => zz(13, 34), (x) => x % 5 !== 0), b = Math.floor(w / 5), r = w % 5;
      return luecken(Z(`${Bei(s, name)} sind es ${w} Striche.`, 'Es sind {{a}} volle Bündel und {{b}} einzelne Striche.'), { a: [b, ohneDoppelte(b, [{ wert: Math.floor(w / 4), fehlvorstellung: 'strich-buendel-als-vier' }])], b: r },
        hil('M', 'Ein Bündel sind 5 Striche. Wie oft passt 5 in die Zahl?', `${b} · 5 = ${b * 5}. Bis ${w} fehlen noch ${r}.`),
        { nachweis: [`${w} : 5 = ${b} Rest ${r}`, `${b} · 5 + ${r} = ${w}`] }); },
    () => { const s = kleinUmfrage(), namen = namenVon(s, 3), w = werte(3, 7, 14); const i = zz(0, 2);
      // Eine Zeile ist falsch gebündelt: fünf gerade Striche, dann erst der Querstrich.
      const falsch = 'IIIII/' + 'I'.repeat(w[i] - 6);
      return auswahl(((k) => Z(`${k} hat eine Strichliste zur Umfrage „${s.titel}“ gemacht.`, `In einer Zeile hat ${er(k)} falsch gebündelt.`, 'In welcher Zeile?'))(kind()), namen.map((nm, j) => opt(nm, j === i)),
        hil('M', 'Ein Bündel hat vier gerade Striche. Der fünfte geht quer darüber.', `In der Zeile ${s.gewaehlt(namen[i])} stehen fünf gerade Striche vor dem Querstrich.`),
        { bild: B.strichliste(namen.map((nm, j) => [nm, w[j], ...(j === i ? [falsch] : [])]), s.diagrammTitel), nachweis: [ZEILE('falschGebuendelt')] }); },
  ]);
  sechs(H1, 'E', [
    anlegen('E', 5, 3, 10, 'selbst'),
    () => { const s = kleinUmfrage(), namen = namenVon(s, 4), w = werte(4, 6, 26), gesamt = summe(w); const i = zz(0, 3), nicht = gesamt - w[i];
      return sach(Z(s.einleitung, 'Werte die Strichliste aus.'), [teil(s.alle, gesamt, s.einheit, ohneDoppelte(gesamt, [{ wert: summe(w.map(alsVier)), fehlvorstellung: 'strich-buendel-als-vier' }])),
        teil(s.wie(namen[i]), w[i], s.einheit, fehlerBuendel(w[i])), teil(`Wie viele Kinder haben nicht „${namen[i]}“ gewählt?`, nicht, s.einheit, ohneDoppelte(nicht, [{ wert: gesamt, fehlvorstellung: 'sach-schritt-vergessen' }]))],
      hil('E', 'Wer nicht diese Antwort gewählt hat, steht in einer der anderen Zeilen.'),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [...namen.map((nm, j) => ABL(nm, w[j])), `${w.join(' + ')} = ${gesamt}`, `${gesamt} − ${w[i]} = ${nicht}`] }); },
    () => { const s = kleinUmfrage(), namen = namenVon(s, 4), alt = werte(4, 6, 20), neu = namen.map(() => zz(2, 6)), w = alt.map((x, i) => x + neu[i]);
      return strichlisteAnlegen(Z(`Die Strichliste zur Umfrage „${s.titel}“ ist noch nicht fertig.`, 'Trage die Antworten der Nachzügler nach und bündle richtig.'),
        namen.map((nm, i) => [nm, w[i], alt[i]]), 'selbst', hil('E', 'Fülle zuerst das angefangene Bündel auf. Der fünfte Strich geht quer.'),
        { urliste: urliste(namen, neu), nachweis: namen.flatMap((nm, i) => [ABL(nm, neu[i], 'urliste'), `${alt[i]} + ${neu[i]} = ${w[i]}`]) }); },
    () => { const b = zz(5, 8), r = zz(1, 3), dazu = zz(3, 6), alt = 5 * b + r, neu = alt + dazu, nb = Math.floor(neu / 5), nr = neu % 5;
      return zahl(Z(`In einer Zeile stehen ${b} volle Bündel und ${r} einzelne Striche.`, `Es kommen ${dazu} Striche dazu.`, 'Wie viele volle Bündel stehen danach in der Zeile?'), nb,
        ohneDoppelte(nb, [{ wert: b, fehlvorstellung: 'sach-schritt-vergessen' }, { wert: Math.floor(neu / 4), fehlvorstellung: 'strich-buendel-als-vier' }]),
        hil('E', 'Rechne zuerst aus, wie viele Striche es danach sind.'),
        { nachweis: [`${b} · 5 + ${r} + ${dazu} = ${neu}`, `${neu} : 5 = ${nb} Rest ${nr}`] }); },
    () => { const s = kleinUmfrage(), name = wahl(s.namen), w = suche(() => zz(21, 39), (x) => x % 5 !== 0), b = Math.floor(w / 5), r = w % 5;
      return luecken(Z(`Für ${s.gewaehlt(name)} haben ${w} Kinder gestimmt.`, 'In der Strichliste sind das {{a}} volle Bündel und {{b}} einzelne Striche.'), { a: [b, ohneDoppelte(b, [{ wert: Math.floor(w / 4), fehlvorstellung: 'strich-buendel-als-vier' }])], b: r },
        hil('E', 'Ein Bündel sind 5 Striche.'), { nachweis: [`${w} : 5 = ${b} Rest ${r}`] }); },
    () => { const zeilen = zz(3, 5), je = zz(2, 4), echt = zeilen * je * 5, grenze = echt - zz(1, 2) * 5;
      return auswahl(Z(`Eine Strichliste hat ${zeilen} Zeilen.`, `In jeder Zeile stehen ${je} volle Bündel und sonst nichts.`, `${kind()} sagt: „Das sind mehr als ${grenze} Striche.“`, 'Stimmt das?'),
        [opt(`Stimmt, es sind ${echt} Striche.`, true), opt(`Falsch, es sind nur ${zeilen * je * 4} Striche.`, false, 'strich-buendel-als-vier'), opt(`Falsch, es sind nur ${zeilen * je} Striche.`, false, 'bild-symbole-gezaehlt'), opt('Das kann man ohne Bild nicht wissen.', false)],
        hil('E', 'Rechne aus, wie viele Bündel es zusammen sind. Jedes Bündel hat 5 Striche.'),
        { nachweis: [U(true), `${zeilen} · ${je} · 5 = ${echt}`, HILFSZAHL(4, 'falsch gezähltes Bündel'), `${zeilen} · ${je} · 4 = ${zeilen * je * 4}`, `${zeilen} · ${je} = ${zeilen * je}`] }); },
  ]);
}

// =====================================================================
// H2 Häufigkeitstabellen erstellen
// =====================================================================
function haeufigkeitstabellen() {
  const H2 = ID(1, 'H2');
  const kopfVon = (s) => [s.spalte, 'Anzahl'];
  // Tabelle aus einer Liste (Urliste) oder Strichliste, optional mit Gesamtzeile.
  const ausListe = (n, k, von, bis, { gesamt = false, strich = false } = {}) => () => {
    const s = n === 'F' ? klein() : kleinUmfrage(), namen = namenVon(s, k), w = werte(k, von, bis, 1, (x) => !strich || x.some((y) => y >= 5)), g = summe(w);
    const zeilen = namen.map((nm, i) => [nm, L(`z${i}`)]);
    const werte_ = Object.fromEntries(namen.map((nm, i) => [`z${i}`, [w[i], strich ? fehlerBuendel(w[i]) : ohneDoppelte(w[i], [{ wert: w[i] - 1, fehlvorstellung: 'liste-verzaehlt' }])]]));
    if (gesamt) { zeilen.push(['Gesamt', L('g')]); werte_.g = [g, ohneDoppelte(g, [{ wert: g - w.at(-1), fehlvorstellung: 'sach-schritt-vergessen' }])]; }
    const quelle = strich ? 'bild' : 'urliste';
    return tabelle(Z(strich ? `Die Strichliste zeigt die Antworten der ${s.klasse ?? 'Umfrage'}.`.replace('der Umfrage', 'des Kundschafters') : (s.art === 'umfrage' ? `Das sind die Antworten der ${s.klasse}.` : 'Der Kundschafter hat diese Tiere gesehen.'),
      gesamt ? 'Fülle die Tabelle aus.\nRechne auch die Gesamtzahl aus.'.replace('Gesamtzahl', n === 'F' ? 'Zahl für alle zusammen' : 'Gesamtzahl') : 'Schreibe die Anzahl in die Tabelle.'),
    kopfVon(s), zeilen, werte_,
    hil(n, strich ? 'Zähle jede Zeile der Strichliste. Ein Bündel sind 5.' : 'Zähle jede Antwort für sich. Streiche in Gedanken ab, was du gezählt hast.',
      strich ? 'Ein Bündel und 3 Striche: In die Tabelle kommt 8.' : 'In der Liste steht 4-mal „Hund“: In die Tabelle kommt 4.',
      `${s.gewaehlt(namen[0])} kommt ${w[0]}-mal vor.`),
    { ...(strich ? { bild: strichBild(namen, w, s.diagrammTitel) } : { urliste: urliste(namen, w) }), nachweis: [...namen.map((nm, i) => ABL(nm, w[i], quelle)), ...(gesamt ? [`${w.join(' + ')} = ${g}`] : [])] });
  };
  // Welche Tabelle passt zur Strichliste? Antworten „Hund: 5 · Katze: 3“.
  const tabellenWahl = (n, k, von, bis) => () => { const s = klein(), namen = namenVon(s, k), w = werte(k, von, bis, 1, (x) => x.some((y) => y >= 5));
    const text = (v) => namen.map((nm, i) => `${nm}: ${v[i]}`).join(' · ');
    const vertauscht = [w[1], w[0], ...w.slice(2)];
    const optionen = [opt(text(w), true), opt(text(w.map(alsVier)), false, 'strich-buendel-als-vier'), opt(text(vertauscht), false, 'diagramm-vertauscht'), opt(text(w.map((x, i) => (i === k - 1 ? x + 1 : x))), false, 'liste-verzaehlt')];
    return auswahl(Z('Welche Tabelle passt zur Strichliste?'), optionen.filter((o, i, a) => a.findIndex((x) => x.text === o.text) === i),
      hil(n, 'Zähle jede Zeile der Strichliste. Vergleiche dann mit den Antworten.', 'Ein Bündel und 1 Strich: Das sind 6.', `In der Zeile ${s.gewaehlt(namen[0])} sind es ${w[0]}.`),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: [DATENWAHL('bild'), ...namen.map((nm, i) => ABL(nm, w[i]))] }); };
  // Ein Wert fehlt in der Tabelle, die Gesamtzahl ist bekannt.
  const rueckwaerts = (n, k, von, bis) => () => { const s = kleinUmfrage(), namen = namenVon(s, k), w = werte(k, von, bis), g = summe(w), i = zz(0, k - 1);
    const zeilen = namen.map((nm, j) => [nm, j === i ? L('x') : String(w[j])]); zeilen.push(['Gesamt', String(g)]);
    const rest = w.filter((_, j) => j !== i);
    return tabelle(Z(`In der Tabelle zur Umfrage „${s.titel}“ fehlt eine Zahl.`, `Insgesamt wurden ${g} Kinder befragt.`, 'Welche Zahl fehlt?'), kopfVon(s), zeilen,
      { x: [w[i], ohneDoppelte(w[i], [{ wert: g + summe(rest), fehlvorstellung: 'sach-falsche-rechnung' }])] },
      hil(n, 'Alle Zahlen zusammen ergeben die Gesamtzahl. Ziehe die bekannten Zahlen davon ab.', `Gesamt 20, bekannt sind 7 und 5: 20 − 7 − 5 = 8.`, `Rechne ${g} − ${rest.join(' − ')}.`),
      { nachweis: [`${g} − ${rest.join(' − ')} = ${w[i]}`] }); };
  // Tabelle zu zwei Klassen: daten mit drei Spalten.
  const zweiKlassen = (n, k, von, bis, teile) => () => { const s = kleinUmfrage(), namen = namenVon(s, k), a = werte(k, von, bis), b = werte(k, von, bis);
    const i = zz(0, k - 1), j = (i + 1) % k, ga = summe(a);
    const d = { kopf: [s.spalte, '5a', '5b'], zeilen: namen.map((nm, x) => [nm, String(a[x]), String(b[x])]) };
    const alle = [
      teil(`Wie viele Kinder aus beiden Klassen haben „${namen[i]}“ gewählt?`, a[i] + b[i], 'Kinder', ohneDoppelte(a[i] + b[i], [{ wert: a[i], fehlvorstellung: 'sach-schritt-vergessen' }])),
      teil('Wie viele Kinder der 5a wurden befragt?', ga, 'Kinder', ohneDoppelte(ga, [{ wert: ga - a.at(-1), fehlvorstellung: 'sach-schritt-vergessen' }])),
      teil(`Wie viele Kinder haben in beiden Klassen zusammen „${namen[j]}“ gewählt?`, a[j] + b[j], 'Kinder', ohneDoppelte(a[j] + b[j], [{ wert: b[j], fehlvorstellung: 'sach-schritt-vergessen' }])),
    ].slice(0, teile);
    return sach(Z(`Die Umfrage „${s.titel}“ wurde in zwei Klassen gemacht.`, 'Lies die Tabelle ab.'), alle,
      hil(n, 'Die Zahlen für die 5a stehen in der mittleren Spalte, die für die 5b rechts.', '', `In der Zeile „${namen[i]}“ stehen ${a[i]} und ${b[i]}.`),
      { daten: d, nachweis: [ABL(namen[i], a[i], 'daten', 1), ABL(namen[i], b[i], 'daten', 2), `${a[i]} + ${b[i]} = ${a[i] + b[i]}`, `${a.join(' + ')} = ${ga}`, ...(teile > 2 ? [ABL(namen[j], a[j], 'daten', 1), ABL(namen[j], b[j], 'daten', 2), `${a[j]} + ${b[j]} = ${a[j] + b[j]}`] : [])] }); };

  sechs(H2, 'F', [
    ausListe('F', 3, 2, 6, { strich: true }),
    ausListe('F', 3, 2, 5),
    () => { const s = klein(), namen = namenVon(s, 3), w = werte(3, 2, 6), i = zz(0, 2);
      return zahl(Z(s.art === 'umfrage' ? `Das sind die Antworten der ${s.klasse}.` : 'Der Kundschafter hat diese Tiere gesehen.', `Wie oft steht ${s.gewaehlt(namen[i])} in der Liste?`), w[i], ohneDoppelte(w[i], [{ wert: w[i] + 1, fehlvorstellung: 'liste-verzaehlt' }]),
        hil('F', 'Zeige auf jede Antwort. Zähle nur die passenden.', 'In der Liste steht 3-mal „Hund“. Die Antwort ist 3.', `Suche alle Karten mit ${s.gewaehlt(namen[i])}.`),
        { urliste: urliste(namen, w), nachweis: [ABL(namen[i], w[i], 'urliste')] }); },
    tabellenWahl('F', 3, 3, 9),
    ausListe('F', 3, 2, 8, { strich: true, gesamt: true }),
    ausListe('F', 3, 3, 6),
  ]);
  sechs(H2, 'G', [
    ausListe('G', 4, 2, 7),
    ausListe('G', 4, 4, 16, { strich: true }),
    ausListe('G', 3, 3, 8, { gesamt: true }),
    tabellenWahl('G', 4, 4, 14),
    rueckwaerts('G', 3, 4, 12),
    () => { const s = kleinUmfrage(), namen = namenVon(s, 4), w = werte(4, 4, 16, 1, (x) => x.some((y) => y >= 5)), i = zz(0, 3), falsch = w[i] >= 5 ? alsVier(w[i]) : w[i] + 1;
      const d = { kopf: [s.spalte, 'Anzahl'], zeilen: namen.map((nm, j) => [nm, String(j === i ? falsch : w[j])]) };
      return auswahl(Z(`${kind()} hat die Strichliste in eine Tabelle übertragen.`, 'Eine Zahl in der Tabelle ist falsch.', 'In welcher Zeile?'), namen.map((nm, j) => opt(nm, j === i)),
        hil('G', 'Vergleiche jede Zeile der Strichliste mit der Zahl in der Tabelle.', 'Ein Bündel und 2 Striche sind 7, nicht 6.', `Prüfe die Zeile ${s.gewaehlt(namen[0])}: ${w[0]} Striche.`),
        { bild: strichBild(namen, w, s.diagrammTitel), daten: d, nachweis: [ZEILE('abweichend')] }); },
  ]);
  sechs(H2, 'M', [
    ausListe('M', 4, 3, 9),
    ausListe('M', 4, 3, 8, { gesamt: true }),
    () => { const s = kleinUmfrage(), namen = namenVon(s, 3), [a, c] = suche(() => [zz(5, 12), zz(3, 9)], ([x, y]) => x !== y && x !== y + 3 && y + 3 !== x), b = c + zz(2, 5), g = a + b + c;
      const zeilen = [[namen[0], String(a)], [namen[1], L('b')], [namen[2], L('c')], ['Gesamt', String(g)]];
      return tabelle(Z(`Bei der Umfrage „${s.titel}“ fehlen zwei Zahlen.`, `Für „${namen[1]}“ waren es ${b - c} Kinder mehr als für „${namen[2]}“.`), kopfVon(s), zeilen,
        { b: [b, ohneDoppelte(b, [{ wert: c, fehlvorstellung: 'diagramm-vertauscht' }])], c: [c, ohneDoppelte(c, [{ wert: b, fehlvorstellung: 'diagramm-vertauscht' }])] },
        hil('M', 'Rechne zuerst aus, wie viele Kinder die beiden fehlenden Zeilen zusammen haben.', `${g} − ${a} = ${b + c}. Ziehe davon die ${b - c} ab und teile durch 2.`),
        { nachweis: [`${g} − ${a} = ${b + c}`, `${b + c} − ${b - c} = ${2 * c}`, `${2 * c} : 2 = ${c}`, `${c} + ${b - c} = ${b}`] }); },
    ausListe('M', 5, 3, 14, { strich: true }),
    zweiKlassen('M', 4, 3, 9, 2),
    () => { const s = kleinUmfrage(), namen = namenVon(s, 3), w = werte(3, 4, 12), i = zz(0, 2), j = (i + 1) % 3, l = (i + 2) % 3, rest = w[j] + w[l], stimmt = w[i] > rest;
      return auswahl(Z(`Das sind die Antworten zur Umfrage „${s.titel}“.`, `${kind()} sagt: „„${namen[i]}“ kommt öfter vor als „${namen[j]}“ und „${namen[l]}“ zusammen.“`, 'Stimmt das?'),
        [opt(stimmt ? `Stimmt: ${w[i]} ist mehr als ${w[j]} + ${w[l]} = ${rest}.` : `Falsch: ${w[i]} ist nicht mehr als ${w[j]} + ${w[l]} = ${rest}.`, true),
          opt(stimmt ? `Falsch: ${w[i]} ist weniger als ${rest + w[i]}.` : `Stimmt: ${w[i]} ist mehr als ${Math.min(w[j], w[l])}.`, false, 'sach-schritt-vergessen'), opt('Das kann man ohne Tabelle nicht sagen.', false)],
        hil('M', 'Zähle alle drei Antworten aus. Rechne dann die beiden anderen zusammen.', `„${namen[i]}“: ${w[i]}, die anderen: ${w[j]} und ${w[l]}.`),
        { urliste: urliste(namen, w), nachweis: [U(stimmt), ...namen.map((nm, x) => ABL(nm, w[x], 'urliste')), `${w[j]} + ${w[l]} = ${rest}`, `${rest} + ${w[i]} = ${rest + w[i]}`] }); },
  ]);
  sechs(H2, 'E', [
    ausListe('E', 5, 3, 10, { gesamt: true }),
    () => { const s = kleinUmfrage(), namen = namenVon(s, 4), [a, d, c] = suche(() => [zz(6, 14), zz(4, 12), zz(3, 8)], ([x, y, z]) => new Set([x, y, z, 2 * z]).size === 4), b = 2 * c, g = a + b + c + d;
      const zeilen = [[namen[0], String(a)], [namen[1], L('b')], [namen[2], L('c')], [namen[3], String(d)], ['Gesamt', String(g)]];
      return tabelle(Z(`Bei der Umfrage „${s.titel}“ fehlen zwei Zahlen.`, `„${namen[1]}“ wurde doppelt so oft gewählt wie „${namen[2]}“.`), kopfVon(s), zeilen,
        { b: [b, ohneDoppelte(b, [{ wert: c, fehlvorstellung: 'diagramm-vertauscht' }])], c: [c, ohneDoppelte(c, [{ wert: b, fehlvorstellung: 'diagramm-vertauscht' }])] },
        hil('E', 'Die beiden fehlenden Zeilen haben zusammen drei gleich große Teile.'),
        { nachweis: [`${g} − ${a} − ${d} = ${b + c}`, `${b + c} : 3 = ${c}`, `2 · ${c} = ${b}`] }); },
    zweiKlassen('E', 4, 4, 14, 3),
    () => { const kinder = zz(18, 28), antworten = kinder * 2;
      return zahl(Z('Bei einer Umfrage durfte jedes Kind genau zwei Lieblingstiere nennen.', `In der Häufigkeitstabelle stehen zusammen ${antworten} Antworten.`, 'Wie viele Kinder wurden befragt?'), kinder,
        ohneDoppelte(kinder, [{ wert: antworten, fehlvorstellung: 'sach-schritt-vergessen' }]),
        hil('E', 'Jedes Kind hat zwei Antworten gegeben. Zu jedem Kind gehören also zwei Antworten.'),
        { nachweis: [HILFSZAHL(2, 'Antworten je Kind'), `${antworten} : 2 = ${kinder}`] }); },
    () => { const s = kleinUmfrage(), namen = namenVon(s, 3), mo = werte(3, 5, 14, 1, (x) => x.some((y) => y >= 5)), di = werte(3, 2, 6), w = mo.map((x, i) => x + di[i]), g = summe(w);
      const zeilen = namen.map((nm, i) => [nm, L(`z${i}`)]); zeilen.push(['Gesamt', L('g')]);
      return tabelle(Z(`Die Strichliste zeigt die Antworten vom Montag zur Umfrage „${s.titel}“.`, 'Die Karten sind die Antworten vom Dienstag.', 'Fülle die Tabelle für beide Tage zusammen aus.'), kopfVon(s), zeilen,
        { ...Object.fromEntries(namen.map((_, i) => [`z${i}`, [w[i], ohneDoppelte(w[i], [{ wert: mo[i], fehlvorstellung: 'sach-schritt-vergessen' }, { wert: di[i], fehlvorstellung: 'sach-schritt-vergessen' }])]])), g: [g, ohneDoppelte(g, [{ wert: summe(mo), fehlvorstellung: 'sach-schritt-vergessen' }])] },
        hil('E', 'Zähle für jede Antwort beide Tage zusammen.'),
        { bild: strichBild(namen, mo, `${s.titel} am Montag`), urliste: urliste(namen, di), nachweis: [...namen.flatMap((nm, i) => [ABL(nm, mo[i], 'bild'), ABL(nm, di[i], 'urliste'), `${mo[i]} + ${di[i]} = ${w[i]}`]), `${w.join(' + ')} = ${g}`] }); },
    () => { const s = kleinUmfrage(), namen = namenVon(s, 4), w = werte(4, 3, 14), g = summe(w), i = w.indexOf(Math.max(...w)), stimmt = 2 * w[i] > g;
      return auswahl(Z(`Die Tabelle zeigt das Ergebnis der Umfrage „${s.titel}“.`, `${kind()} behauptet: „Mehr als die Hälfte der Kinder hat „${namen[i]}“ gewählt.“`, 'Stimmt das?'),
        [opt(stimmt ? `Stimmt: Von ${g} Kindern sind ${w[i]} mehr als die Hälfte.` : `Falsch: Von ${g} Kindern sind ${w[i]} nicht mehr als die Hälfte.`, true),
          opt(stimmt ? 'Falsch: Es haben auch andere Kinder etwas anderes gewählt.' : `Stimmt: ${w[i]} ist die größte Zahl in der Tabelle.`, false, 'anteil-nicht-beachtet'), opt('Das kann man nicht prüfen.', false)],
        hil('E', 'Rechne zuerst aus, wie viele Kinder insgesamt befragt wurden.'),
        { daten: daten(s, namen, w, 'Kinder'), nachweis: [U(stimmt), `${w.join(' + ')} = ${g}`, `2 · ${w[i]} = ${2 * w[i]}`, AUSSAGE('mehrAlsHaelfte', [namen[i]], stimmt)] }); },
  ]);
}

// =====================================================================
// L1 Säulen- und Balkendiagramme ablesen
// =====================================================================
function diagrammeLesen() {
  const L1 = ID(2, 'L1');
  const sach_ = (n) => (n === 'F' || n === 'G' ? klein() : gross());
  // Einen Wert ablesen.
  const lies = (n, liegend, skala) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), sk = skala ?? wahl(SKALA[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const i = n === 'F' ? zz(0, k - 1) : suche(() => zz(0, k - 1), (x) => w[x] % sk.schritt !== 0), d = { ...sk };
    return zahl(Z(s.einleitung, s.wie(namen[i])), w[i], fehlerSkala(w[i], d),
      hil(n, liegend ? 'Gehe vom Ende des Balkens senkrecht nach unten zur Achse.' : 'Gehe vom oberen Ende der Säule waagerecht nach links zur Achse.',
        sk.fein === 1 ? 'Die Säule endet bei der Linie 6. Die Antwort ist 6.' : `Die Linien gehen in ${sk.fein}er-Schritten. Eine Linie über ${sk.schritt} ist ${sk.schritt + sk.fein}.`,
        `Die Linien gehen in ${sk.fein}er-Schritten. Zähle von der letzten Zahl unter dem Ende weiter.`),
      { bild: (liegend ? balkenBild : saeulenBild)(s, namen, w, sk), nachweis: [ABL(namen[i], w[i])] }); };
  const extrem = (n, was, liegend) => () => { const s = sach_(n), sk = wahl(SKALA[n]), k = n === 'F' || n === 'G' ? 3 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const richtig = was === 'groesste' ? groesster(namen, w) : kleinster(namen, w), anders = was === 'groesste' ? kleinster(namen, w) : groesster(namen, w);
    const frageText = s.art === 'besuch' ? (was === 'groesste' ? 'An welchem Tag kamen die meisten Besucher?' : 'An welchem Tag kamen die wenigsten Besucher?')
      : s.art === 'umfrage' ? (was === 'groesste' ? 'Was wurde am häufigsten gewählt?' : 'Was wurde am seltensten gewählt?') : (was === 'groesste' ? 'Wovon gibt es am meisten?' : 'Wovon gibt es am wenigsten?');
    return auswahl(Z(s.einleitung, frageText), namen.map((nm) => opt(s.gewaehlt(nm), nm === richtig, nm === anders ? 'extrem-verwechselt' : undefined)),
      hil(n, was === 'groesste' ? (liegend ? 'Suche den längsten Balken.' : 'Suche die höchste Säule.') : (liegend ? 'Suche den kürzesten Balken.' : 'Suche die niedrigste Säule.'), was === 'groesste' ? 'Die höchste Säule zeigt den größten Wert.' : 'Die niedrigste Säule zeigt den kleinsten Wert.', `Vergleiche die Enden der ${liegend ? 'Balken' : 'Säulen'}.`),
      { bild: (liegend ? balkenBild : saeulenBild)(s, namen, w, sk), nachweis: [ZEILE(was)] }); };
  const welcheZeigt = (n, liegend) => () => { const s = sach_(n), sk = wahl(SKALA[n]), k = n === 'F' || n === 'G' ? 3 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n), i = zz(0, k - 1);
    return auswahl(Z(s.einleitung, `Bei ${liegend ? 'welchem Balken' : 'welcher Säule'} sind es genau ${w[i]} ${s.einheit}?`), namen.map((nm) => opt(s.gewaehlt(nm), nm === namen[i])),
      hil(n, `Suche die Zahl ${w[i]} an der Achse. Welches Ende liegt genau auf dieser Linie?`, 'Die Säule endet genau bei 25: Sie zeigt 25.', `Die Linien gehen in ${sk.fein}er-Schritten.`),
      { bild: (liegend ? balkenBild : saeulenBild)(s, namen, w, sk), nachweis: [ZEILE('gleich', w[i])] }); };
  // Mehrere Fragen zu einem Diagramm.
  const zweiFragen = (n, liegend, k = 4) => () => { const s = sach_(n), sk = wahl(SKALA[n]), namen = namenVon(s, k), w = skalenWerte(sk, k, n); const [i, j] = mische([...namen.keys()]).slice(0, 2);
    const [a, b] = w[i] >= w[j] ? [i, j] : [j, i], d = w[a] - w[b];
    return sach(Z(s.einleitung, 'Lies die Werte ab und rechne.'), [teil(s.zus(namen[i], namen[j]), w[i] + w[j], s.einheit, ohneDoppelte(w[i] + w[j], [{ wert: d, fehlvorstellung: 'sach-falsche-rechnung' }])),
      teil(s.mehr(namen[a], namen[b]), d, s.einheit, ohneDoppelte(d, [{ wert: w[i] + w[j], fehlvorstellung: 'unterschied-addiert' }]))],
    hil(n, 'Lies zuerst beide Werte ab. Schreibe sie auf. Rechne dann.', 'Werte 30 und 20: zusammen 30 + 20 = 50, Unterschied 30 − 20 = 10.', `${s.gewaehlt(namen[i])} zeigt ${w[i]}, ${s.gewaehlt(namen[j])} zeigt ${w[j]}.`),
    { bild: (liegend ? balkenBild : saeulenBild)(s, namen, w, sk), nachweis: [ABL(namen[i], w[i]), ABL(namen[j], w[j]), `${w[i]} + ${w[j]} = ${w[i] + w[j]}`, `${w[a]} − ${w[b]} = ${d}`] }); };
  const allesAblesen = (n, liegend, k) => () => { const s = sach_(n), sk = wahl(SKALA[n]), namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    return tabelle(Z(s.einleitung, 'Lies alle Werte ab und trage sie in die Tabelle ein.'), [s.spalte, s.einheit], namen.map((nm, i) => [s.gewaehlt(nm), L(`z${i}`)]),
      Object.fromEntries(w.map((x, i) => [`z${i}`, [x, fehlerSkala(x, sk)]])),
      hil(n, `Die Linien gehen in ${sk.fein}er-Schritten. Beschriftet ist jede ${sk.schritt / sk.fein === 1 ? '' : `${sk.schritt / sk.fein}. `}Linie.`.replace('jede Linie', 'jede Linie'), '', 'Lies einen Wert nach dem anderen ab.'),
      { bild: (liegend ? balkenBild : saeulenBild)(s, namen, w, sk), nachweis: namen.map((nm, i) => ABL(nm, w[i])) }); };
  const fehlendeSaeule = (n, liegend, mitMal) => () => { const s = gross(), sk = wahl(SKALA[n]), k = 4, namen = namenVon(s, k);
    const w = skalenWerte(sk, k, n, (x) => (mitMal ? x[3] === 3 * x[0] && x[0] <= sk.max / 3 : true));
    const g = summe(w), rest = w.slice(0, 3);
    const saeulen = paare(namen, w).map(([nm, x], i) => (i === 3 ? [nm, frage(x)] : [nm, x]));
    const bild = B.saeulen({ titel: s.diagrammTitel, einheit: s.einheit, max: sk.max, schritt: sk.schritt, ...(sk.fein !== sk.schritt ? { fein: sk.fein } : {}), saeulen, ...(liegend ? { liegend: true } : {}) });
    if (mitMal) return zahl(Z(s.einleitung, `Am ${TAGE[namen[3]] ?? namen[3]} fehlt der Wert.`.replace(/Am (\d\w|\w+hof)/, 'Beim $1'), `Es waren 3-mal so viele ${s.subjekt} wie am ${TAGE[namen[0]] ?? namen[0]}.`.replace(/am (\d\w|\w+hof)/, 'beim $1'), `Wie viele ${s.subjekt} waren es?`), w[3],
      ohneDoppelte(w[3], [{ wert: w[0] + 3, fehlvorstellung: 'sach-falsche-rechnung' }]), hil(n, 'Lies den Wert ab, mit dem verglichen wird.', '', ''), { bild, nachweis: [ABL(namen[0], w[0]), `3 · ${w[0]} = ${w[3]}`] });
    return zahl(Z(s.einleitung, `Insgesamt waren es ${g} ${s.subjekt}.`, `Ein Wert fehlt. ${s.wie(namen[3])}`.replace('. Wie', '.\nWie')), w[3],
      ohneDoppelte(w[3], [{ wert: g - rest[0] - rest[1], fehlvorstellung: 'sach-schritt-vergessen' }]),
      hil(n, 'Lies die anderen Werte ab. Ziehe sie von der Gesamtzahl ab.', '', `Die anderen Werte sind ${rest.join(', ')}.`),
      { bild, nachweis: [...namen.slice(0, 3).map((nm, i) => ABL(nm, w[i])), `${g} − ${rest.join(' − ')} = ${w[3]}`] }); };

  sechs(L1, 'F', [
    lies('F', false, SKALA.F[0]),
    lies('F', true, SKALA.F[0]),
    extrem('F', 'groesste', false),
    lies('F', false, SKALA.F[1]),
    () => { const s = klein(), sk = SKALA.F[0], namen = namenVon(s, 3), w = skalenWerte(sk, 3, 'F', (x) => x[0] + x[1] <= 15); const [i, j] = [0, 1];
      return sach(Z(s.einleitung, 'Lies ab und rechne.'), [teil(s.wie(namen[i]), w[i], s.einheit), teil(s.zus(namen[i], namen[j]), w[i] + w[j], s.einheit, ohneDoppelte(w[i] + w[j], [{ wert: w[j], fehlvorstellung: 'sach-schritt-vergessen' }]))],
        hil('F', 'Lies zuerst beide Säulen ab. Rechne dann plus.', 'Säulen bis 4 und bis 3: 4 + 3 = 7.', `Die erste Säule endet bei ${w[i]}.`),
        { bild: saeulenBild(s, namen, w, sk), nachweis: [ABL(namen[i], w[i]), ABL(namen[j], w[j]), `${w[i]} + ${w[j]} = ${w[i] + w[j]}`] }); },
    extrem('F', 'kleinste', true),
  ]);
  sechs(L1, 'G', [
    lies('G', false),
    lies('G', true),
    zweiFragen('G', false, 3),
    welcheZeigt('G', false),
    () => { const s = klein(), sk = wahl(SKALA.G), namen = namenVon(s, 4), w = skalenWerte(sk, 4, 'G'), g = summe(w);
      return zahl(Z(s.einleitung, s.alle), g, ohneDoppelte(g, [{ wert: g - w[3], fehlvorstellung: 'sach-schritt-vergessen' }, { wert: summe(w) / sk.fein, fehlvorstellung: 'skala-einerschritte' }]),
        hil('G', 'Lies jeden Balken ab und schreibe die Zahl auf. Rechne dann alle zusammen.', 'Balken bis 12, 8 und 10: 12 + 8 + 10 = 30.', `Die Werte sind ${w.join(', ')}.`),
        { bild: balkenBild(s, namen, w, sk), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${g}`] }); },
    () => { const s = klein(), sk = { fein: 2, schritt: 10, max: 30 }, namen = namenVon(s, 3), w = skalenWerte(sk, 3, 'G', (x) => x.some((y) => y % 10 !== 0 && y / 2 !== y)); const i = w.findIndex((y) => y % 10 !== 0); const [x, y] = zweiKinder();
      return auswahl(Z(s.einleitung, `${x} liest ${s.bei(namen[i])} ${w[i] / 2} ab.`, `${y} liest ${w[i]} ab.`, 'Wer hat recht?'),
        [opt(`${y}, denn von Linie zu Linie sind es 2.`, true), opt(`${x}, denn jede Linie zählt 1.`, false, 'skala-einerschritte'), opt('Beide haben recht.', false)],
        hil('G', 'Schau auf die Zahlen an der Achse. Wie viel kommt von einer Linie zur nächsten dazu?', 'Zwischen 0 und 10 liegen 5 Abstände. Ein Abstand ist 2.', 'Zähle in Zweierschritten bis zum Ende der Säule.'),
        { bild: saeulenBild(s, namen, w, sk), nachweis: [ABL(namen[i], w[i]), LINIE(2), `${w[i]} : 2 = ${w[i] / 2}`] }); },
  ]);
  sechs(L1, 'M', [
    lies('M', false),
    zweiFragen('M', true),
    () => { const s = gross(), sk = wahl(SKALA.M), namen = namenVon(s, 4), w = skalenWerte(sk, 4, 'M'), g = summe(w), d = Math.max(...w) - Math.min(...w);
      return sach(Z(s.einleitung, 'Lies die Werte ab und rechne.'), [teil(s.alle, g, s.einheit, ohneDoppelte(g, [{ wert: g - w[3], fehlvorstellung: 'sach-schritt-vergessen' }])),
        teil(`Um wie viele ${s.subjekt} unterscheiden sich der größte und der kleinste Wert?`, d, s.einheit, ohneDoppelte(d, [{ wert: Math.max(...w) + Math.min(...w), fehlvorstellung: 'unterschied-addiert' }]))],
      hil('M', 'Lies alle Werte ab und schreibe sie auf.', `Die Werte sind ${w.join(', ')}.`),
      { bild: saeulenBild(s, namen, w, sk), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${g}`, `${Math.max(...w)} − ${Math.min(...w)} = ${d}`] }); },
    welcheZeigt('M', true),
    allesAblesen('M', false, 4),
    fehlendeSaeule('M', false, false),
  ]);
  sechs(L1, 'E', [
    lies('E', true),
    () => { const s = gross(), sk = wahl(SKALA.E), namen = namenVon(s, 5), w = skalenWerte(sk, 5, 'E'), g = summe(w); const [i, j] = [0, 4], d = Math.abs(w[i] - w[j]); const [a, b] = w[i] >= w[j] ? [i, j] : [j, i];
      return sach(Z(s.einleitung, 'Lies die Werte ab und rechne.'), [teil(s.alle, g, s.einheit, ohneDoppelte(g, [{ wert: g - w[4], fehlvorstellung: 'sach-schritt-vergessen' }])),
        teil(s.mehr(namen[a], namen[b]), d, s.einheit), teil(`Wie viele ${s.subjekt} waren es ohne ${s.gewaehlt(namen[a])}?`.replace('ohne Montag', 'ohne den Montag'), g - w[a], s.einheit, ohneDoppelte(g - w[a], [{ wert: g, fehlvorstellung: 'sach-schritt-vergessen' }]))],
      hil('E', 'Schreibe zuerst alle abgelesenen Werte auf.'),
      { bild: saeulenBild(s, namen, w, sk), nachweis: [...namen.map((nm, x) => ABL(nm, w[x])), `${w.join(' + ')} = ${g}`, `${w[a]} − ${w[b]} = ${d}`, `${g} − ${w[a]} = ${g - w[a]}`] }); },
    allesAblesen('E', true, 5),
    () => { const s = gross(), sk = wahl(SKALA.E), namen = namenVon(s, 4); const w = skalenWerte(sk, 4, 'E', (x) => x[0] <= sk.max / 2); const doppelt = zz(0, 1) === 1;
      if (doppelt) w[2] = 2 * w[0]; else w[2] = suche(() => zz(2, sk.max / sk.fein) * sk.fein, (x) => x !== 2 * w[0] && !w.slice(0, 2).includes(x) && x !== w[3] && x > w[0]);
      const stimmt = w[2] === 2 * w[0];
      return auswahl(Z(s.einleitung, `${kind()} sagt: „${Bei(s, namen[2])} waren es doppelt so viele ${s.subjekt} wie ${s.bei(namen[0])}.“`, 'Stimmt das?'),
        [opt(stimmt ? `Stimmt: 2 · ${w[0]} = ${w[2]}.` : `Falsch: 2 · ${w[0]} = ${2 * w[0]}, es waren aber ${w[2]}.`, true), opt(stimmt ? 'Falsch: Die Säule ist nicht doppelt so hoch.' : 'Stimmt: Die Säule ist höher.', false), opt('Das kann man nicht ablesen.', false)],
        hil('E', 'Lies beide Werte genau ab und rechne das Doppelte des kleineren Werts aus.'),
        { bild: saeulenBild(s, namen, w, sk), nachweis: [U(stimmt), ABL(namen[0], w[0]), ABL(namen[2], w[2]), `2 · ${w[0]} = ${2 * w[0]}`, AUSSAGE('doppelt', [namen[2], namen[0]], stimmt)] }); },
    fehlendeSaeule('E', true, false),
    fehlendeSaeule('E', false, true),
  ]);
}

// =====================================================================
// L2 Bilddiagramme ablesen
// =====================================================================
function bilddiagramme() {
  const L2 = ID(2, 'L2');
  const JE = { F: [2, 5], G: [5, 10], M: [10, 20], E: [50, 100] };
  // Werte zu einem Schlüssel: auf F und G ganze Bilder, ab M auch halbe (mindestens eins davon).
  const bildWerte = (n, k, je, maxBilder = 8) => { const halb = n === 'M' || n === 'E';
    return werte(k, je, maxBilder * je, halb ? je / 2 : je, (w) => !halb || w.some((x) => x % je !== 0)); };
  const lies = (n, je_) => () => { const s = n === 'F' || n === 'G' ? klein() : wahl([kleinUmfrage(), BUECHER, ERNTE, BESUCHE[2]]), je = je_ ?? wahl(JE[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k), w = bildWerte(n, k, je);
    const i = n === 'M' || n === 'E' ? w.findIndex((x) => x % je !== 0) : zz(0, k - 1);
    return zahl(Z(s.einleitung, s.wie(namen[i])), w[i], fehlerBild(w[i], je),
      hil(n, 'Lies zuerst den Schlüssel. Zähle dann für jedes Bild so viele weiter.', `Schlüssel: 1 Bild steht für 5. Drei Bilder sind 5 + 5 + 5 = 15.`, `Ein Bild steht für ${je}. Zähle in ${je}er-Schritten.`),
      { bild: bildDiagramm(s, namen, w, je), nachweis: [ABL(namen[i], w[i])] }); };

  sechs(L2, 'F', [
    lies('F', 2),
    lies('F', 5),
    () => { const s = klein(), je = 2, namen = namenVon(s, 3), w = bildWerte('F', 3, je), r = groesster(namen, w), f = kleinster(namen, w);
      return auswahl(Z(s.einleitung, s.art === 'umfrage' ? 'Was wurde am häufigsten gewählt?' : 'Wovon gibt es am meisten?'), namen.map((nm) => opt(s.gewaehlt(nm), nm === r, nm === f ? 'extrem-verwechselt' : undefined)),
        hil('F', 'Suche die Zeile mit den meisten Bildern.', 'Die Zeile mit 5 Bildern hat mehr als die Zeile mit 3 Bildern.', 'Zähle die Bilder in jeder Zeile.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ZEILE('groesste')] }); },
    () => { const s = klein(), je = wahl([2, 5]), namen = namenVon(s, 3), w = bildWerte('F', 3, je);
      return zahl(Z(s.einleitung, 'Schau auf den Schlüssel.', `Für wie viele ${s.subjekt} steht ein Bild?`), je, [{ wert: 1, fehlvorstellung: 'bild-symbole-gezaehlt' }],
        hil('F', 'Der Schlüssel steht über dem Diagramm.', 'Steht dort „1 Bild = 5 Kinder“, dann ist die Antwort 5.', 'Lies die Zahl hinter dem Gleichheitszeichen im Schlüssel.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [SCHLUESSEL(je)] }); },
    () => { const s = klein(), je = 2, namen = namenVon(s, 3), w = bildWerte('F', 3, je, 6);
      return sach(Z(s.einleitung, 'Lies ab und rechne.'), [teil(s.wie(namen[0]), w[0], s.einheit, fehlerBild(w[0], je)), teil(s.zus(namen[0], namen[1]), w[0] + w[1], s.einheit, ohneDoppelte(w[0] + w[1], [{ wert: (w[0] + w[1]) / je, fehlvorstellung: 'bild-symbole-gezaehlt' }]))],
        hil('F', 'Ein Bild steht für 2. Zähle in Zweierschritten.', 'Drei Bilder: 2, 4, 6. Das sind 6.', `In der ersten Zeile sind ${w[0] / je} Bilder.`),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ABL(namen[0], w[0]), ABL(namen[1], w[1]), `${w[0]} + ${w[1]} = ${w[0] + w[1]}`] }); },
    lies('F', 5),
  ]);
  sechs(L2, 'G', [
    lies('G', 10),
    lies('G', 5),
    () => { const s = klein(), je = wahl(JE.G), namen = namenVon(s, 3), w = bildWerte('G', 3, je); const [a, b] = [groesster(namen, w), kleinster(namen, w)], wa = Math.max(...w), wb = Math.min(...w);
      return sach(Z(s.einleitung, 'Lies ab und rechne.'), [teil(s.mehr(a, b), wa - wb, s.einheit, ohneDoppelte(wa - wb, [{ wert: (wa - wb) / je, fehlvorstellung: 'bild-symbole-gezaehlt' }])), teil(s.alle, summe(w), s.einheit, ohneDoppelte(summe(w), [{ wert: summe(w) / je, fehlvorstellung: 'bild-symbole-gezaehlt' }]))],
        hil('G', 'Rechne zuerst jede Zeile in eine Zahl um.', '4 Bilder bei 1 Bild = 5: 4 · 5 = 20.', `Ein Bild steht für ${je}. Die Zeilen zeigen ${w.join(', ')}.`),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${wa} − ${wb} = ${wa - wb}`, `${w.join(' + ')} = ${summe(w)}`] }); },
    () => { const s = klein(), je = wahl(JE.G), namen = namenVon(s, 3), w = bildWerte('G', 3, je), i = zz(0, 2);
      return auswahl(Z(s.einleitung, `In welcher Zeile sind es ${w[i]} ${s.einheit}?`), namen.map((nm, j) => opt(s.gewaehlt(nm), j === i, w[j] === w[i] / je * 1 ? 'bild-symbole-gezaehlt' : undefined)),
        hil('G', 'Rechne aus, wie viele Bilder man für diese Zahl braucht.', `Für 30 bei 1 Bild = 10 braucht man 3 Bilder.`, `${w[i]} : ${je} = ${w[i] / je}. Suche die Zeile mit ${w[i] / je} Bildern.`),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ZEILE('gleich', w[i]), `${w[i]} : ${je} = ${w[i] / je}`] }); },
    () => { const s = kleinUmfrage(), je = wahl(JE.G), anzahl = zz(3, 8), x = anzahl * je;
      return luecken(Z(`In einem Bilddiagramm steht 1 Bild für ${je} Kinder.`, `Für ${x} Kinder zeichnet man {{a}} Bilder.`), { a: [anzahl, [{ wert: x, fehlvorstellung: 'bild-symbole-gezaehlt' }]] },
        hil('G', `Ein Bild steht für ${je}. Wie oft passt ${je} in ${x}?`, '20 Kinder bei 1 Bild = 5: 20 : 5 = 4 Bilder.', `Rechne ${x} : ${je}.`), { nachweis: [`${x} : ${je} = ${anzahl}`] }); },
    () => { const s = klein(), je = 10, namen = namenVon(s, 3), w = bildWerte('G', 3, je), i = zz(0, 2); const [x, y] = zweiKinder();
      return auswahl(Z(s.einleitung, `${x} sagt: „${Bei(s, namen[i])} sind es ${w[i] / je}.“`, `${y} sagt: „Es sind ${w[i]}.“`, 'Wer hat recht?'),
        [opt(`${y}, denn ein Bild steht für ${je}.`, true), opt(`${x}, denn man zählt die Bilder.`, false, 'bild-symbole-gezaehlt'), opt('Beide haben recht.', false)],
        hil('G', 'Lies den Schlüssel über dem Diagramm.', '3 Bilder bei 1 Bild = 10 sind 30, nicht 3.', `Ein Bild steht für ${je}.`),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ABL(namen[i], w[i]), SCHLUESSEL(je), `${w[i]} : ${je} = ${w[i] / je}`] }); },
  ]);
  sechs(L2, 'M', [
    lies('M'),
    () => { const s = wahl([BUECHER, ERNTE, kleinUmfrage()]), je = wahl(JE.M), namen = namenVon(s, 4), w = bildWerte('M', 4, je), g = summe(w), d = Math.max(...w) - Math.min(...w);
      return sach(Z(s.einleitung, 'Lies ab und rechne.'), [teil(s.alle, g, s.einheit, ohneDoppelte(g, [{ wert: g - w[3], fehlvorstellung: 'sach-schritt-vergessen' }])), teil(s.mehr(groesster(namen, w), kleinster(namen, w)), d, s.einheit)],
        hil('M', 'Rechne jede Zeile in eine Zahl um. Ein halbes Bild ist die Hälfte des Schlüssels.', `Die Zeilen zeigen ${w.join(', ')}.`),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${g}`, `${Math.max(...w)} − ${Math.min(...w)} = ${d}`] }); },
    () => { const je = wahl(JE.M), ganz = zz(2, 7), x = ganz * je + je / 2;
      return luecken(Z(`In einem Bilddiagramm steht 1 Bild für ${je} Bücher.`, `Für ${x} Bücher zeichnet man {{a}} ganze Bilder und ein halbes Bild.`), { a: [ganz, ohneDoppelte(ganz, [{ wert: ganz + 1, fehlvorstellung: 'bild-halbes-symbol' }])] },
        hil('M', 'Ein halbes Bild steht für die Hälfte des Schlüssels.', `${je} : 2 = ${je / 2}. ${x} − ${je / 2} = ${x - je / 2}. ${x - je / 2} : ${je} = ${ganz}.`),
        { nachweis: [`${je} : 2 = ${je / 2}`, `${x} − ${je / 2} = ${x - je / 2}`, `${x - je / 2} : ${je} = ${ganz}`] }); },
    () => { const s = wahl([BUECHER, ERNTE, kleinUmfrage()]), je = wahl(JE.M), namen = namenVon(s, 4), w = bildWerte('M', 4, je), r = kleinster(namen, w), f = groesster(namen, w);
      return auswahl(Z(s.einleitung, s.art === 'umfrage' ? 'Was wurde am seltensten gewählt?' : 'Welcher Wert ist am kleinsten?'), namen.map((nm) => opt(s.gewaehlt(nm), nm === r, nm === f ? 'extrem-verwechselt' : undefined)),
        hil('M', 'Vergleiche die Länge der Zeilen. Achte auf halbe Bilder.', 'Die kürzeste Zeile zeigt den kleinsten Wert.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ZEILE('kleinste')] }); },
    () => { const s = wahl([BUECHER, ERNTE, kleinUmfrage()]), je = wahl(JE.M), namen = namenVon(s, 4), w = bildWerte('M', 4, je);
      return tabelle(Z(s.einleitung, 'Lies alle Werte ab und trage sie ein.'), [s.spalte, s.einheit], namen.map((nm, i) => [s.gewaehlt(nm), L(`z${i}`)]),
        Object.fromEntries(w.map((x, i) => [`z${i}`, [x, fehlerBild(x, je)]])), hil('M', 'Ein Bild steht für die Zahl im Schlüssel, ein halbes Bild für die Hälfte.', 'Rechne jede Zeile einzeln aus.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: namen.map((nm, i) => ABL(nm, w[i])) }); },
    () => { const s = wahl([BUECHER, ERNTE]), je = wahl(JE.M), namen = namenVon(s, 4), w = bildWerte('M', 4, je), g = summe(w), rest = w.slice(0, 3);
      return zahl(Z(s.einleitung, `Insgesamt sind es ${g} ${s.einheit}.`, `Die Zeile ${s.gewaehlt(namen[3])} ist noch leer.`, `Wie viele ${s.einheit} gehören in diese Zeile?`), w[3],
        ohneDoppelte(w[3], [{ wert: g - rest[0] - rest[1], fehlvorstellung: 'sach-schritt-vergessen' }]), hil('M', 'Lies die anderen Zeilen ab und ziehe sie von der Gesamtzahl ab.', `Die anderen Zeilen zeigen ${rest.join(', ')}.`),
        { bild: bildDiagramm(s, namen, w.map((x, i) => (i === 3 ? frage(x) : x)), je), nachweis: [...namen.slice(0, 3).map((nm, i) => ABL(nm, w[i])), `${g} − ${rest.join(' − ')} = ${w[3]}`] }); },
  ]);
  sechs(L2, 'E', [
    lies('E'),
    () => { const s = wahl([BESUCHE[2], ERNTE, BUECHER]), je = wahl(JE.E), namen = namenVon(s, 4), w = bildWerte('E', 4, je), g = summe(w), [a, b] = [namen[0], namen[1]], d = Math.abs(w[0] - w[1]), [x, y] = w[0] >= w[1] ? [a, b] : [b, a];
      return sach(Z(s.einleitung, 'Lies ab und rechne.'), [teil(s.alle, g, s.einheit), teil(s.mehr(x, y), d, s.einheit), teil(`Wie viele ${s.einheit} sind es ohne ${s.gewaehlt(namen[3])}?`, g - w[3], s.einheit, ohneDoppelte(g - w[3], [{ wert: g, fehlvorstellung: 'sach-schritt-vergessen' }]))],
        hil('E', 'Rechne zuerst jede Zeile in eine Zahl um.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${g}`, `${Math.max(w[0], w[1])} − ${Math.min(w[0], w[1])} = ${d}`, `${g} − ${w[3]} = ${g - w[3]}`] }); },
    () => { const s = wahl([BESUCHE[2], ERNTE, BUECHER]), je = wahl(JE.E), namen = namenVon(s, 5), w = bildWerte('E', 5, je);
      return tabelle(Z(s.einleitung, 'Lies alle Werte ab und trage sie ein.'), [s.spalte, s.einheit], namen.map((nm, i) => [s.gewaehlt(nm), L(`z${i}`)]),
        Object.fromEntries(w.map((x, i) => [`z${i}`, [x, fehlerBild(x, je)]])), hil('E', 'Ein halbes Bild steht für die Hälfte des Schlüssels.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: namen.map((nm, i) => ABL(nm, w[i])) }); },
    () => { const s = wahl([BUECHER, ERNTE]), je = 50, neu = 25, namen = namenVon(s, 4), w = bildWerte('E', 4, je), i = w.findIndex((x) => x % je !== 0);
      return zahl(Z(s.einleitung, `Das Diagramm soll neu gezeichnet werden: 1 Bild steht dann für ${neu} ${s.einheit}.`, `Wie viele Bilder braucht dann die Zeile ${s.gewaehlt(namen[i])}?`), w[i] / neu,
        ohneDoppelte(w[i] / neu, [{ wert: Math.ceil(w[i] / je), fehlvorstellung: 'bild-symbole-gezaehlt' }]), hil('E', 'Lies zuerst ab, wie viele es in dieser Zeile sind.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [ABL(namen[i], w[i]), `${w[i]} : ${neu} = ${w[i] / neu}`] }); },
    () => { const je = wahl([20, 40, 60]), ganz = zz(3, 8), x = ganz * je + je / 2;
      return luecken(Z(`In einem Bilddiagramm steht 1 Bild für ${je} Besucher.`, `Für ${x} Besucher zeichnet man {{a}} ganze Bilder und ein halbes Bild.`), { a: [ganz, ohneDoppelte(ganz, [{ wert: ganz + 1, fehlvorstellung: 'bild-halbes-symbol' }])] },
        hil('E', 'Ein halbes Bild steht für die Hälfte des Schlüssels.'), { nachweis: [`${je} : 2 = ${je / 2}`, `${x} − ${je / 2} = ${x - je / 2}`, `${x - je / 2} : ${je} = ${ganz}`] }); },
    () => { const s = wahl([BESUCHE[2], ERNTE, BUECHER]), je = wahl(JE.E), namen = namenVon(s, 4), w = bildWerte('E', 4, je), stimmt = zz(0, 1) === 1;
      const b = stimmt ? je / 2 : je;
      return auswahl(Z(s.einleitung, `${kind()} sagt: „Ein halbes Bild steht hier für ${b} ${s.einheit}.“`, 'Stimmt das?'),
        [opt(stimmt ? `Stimmt: ${je} : 2 = ${je / 2}.` : `Falsch: ${je} : 2 = ${je / 2}.`, true), opt(stimmt ? 'Falsch: Ein halbes Bild zählt gar nicht.' : 'Stimmt: Jedes Bild zählt gleich viel.', false, 'bild-halbes-symbol'), opt('Das hängt von der Zeile ab.', false)],
        hil('E', 'Schau in den Schlüssel.'),
        { bild: bildDiagramm(s, namen, w, je), nachweis: [U(stimmt), SCHLUESSEL(je), HILFSZAHL(2, 'ein halbes Bild'), `${je} : 2 = ${je / 2}`] }); },
  ]);
}

// =====================================================================
// Z1 Säulendiagramm zeichnen
// =====================================================================
function saeulenZeichnen() {
  const Z1 = ID(3, 'Z1');
  const ZSKALA = {
    F: [{ fein: 1, schritt: 1, max: 10 }, { fein: 2, schritt: 2, max: 16 }],
    G: [{ fein: 2, schritt: 10, max: 30 }, { fein: 5, schritt: 10, max: 50 }, { fein: 5, schritt: 25, max: 100 }],
    M: [{ fein: 10, schritt: 50, max: 200 }, { fein: 25, schritt: 100, max: 400 }, { fein: 1, schritt: 5, max: 20 }],
    E: [{ fein: 50, schritt: 250, max: 1000 }, { fein: 100, schritt: 500, max: 2000 }, { fein: 1, schritt: 5, max: 30 }],
  };
  const dia = (s, sk, saeulen, titel) => ({ titel: titel ?? s.diagrammTitel, einheit: s.einheit, max: sk.max, schritt: sk.schritt, fein: sk.fein, saeulen });
  const tippVon = (n, sk) => (sk.fein === 1 ? 'Jede Linie ist eine Zahl weiter. Ziehe die Säule bis zu ihrer Zahl.' : `Die Linien gehen in ${sk.fein}er-Schritten. Zähle von der beschrifteten Linie weiter.`);
  // Nach einer Tabelle zeichnen. vorgegeben: so viele Säulen stehen schon.
  const nachTabelle = (n, k, sk_, vorgegeben = 0) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), sk = sk_ ?? wahl(ZSKALA[n]), namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    return zeichnen(Z(`Die Tabelle zeigt ${s.titel === 'Tiere auf dem Burghof' ? 'die Tiere auf dem Burghof' : `die Umfrage „${s.titel}“`}.`, vorgegeben ? 'Zeichne die fehlenden Säulen.' : 'Zeichne zu jeder Zeile die Säule.'),
      dia(s, sk, namen.map((nm, i) => [nm, w[i], i >= vorgegeben ? 'offen' : undefined])),
      hil(n, tippVon(n, sk), sk.fein === 1 ? 'In der Tabelle steht 4: Die Säule geht bis zur Linie 4.' : `In der Tabelle steht ${sk.schritt + sk.fein}: Das ist eine Linie über ${sk.schritt}.`, `Die erste Säule geht bis ${w[vorgegeben]}.`),
      { daten: daten(s, namen, w), nachweis: namen.map((nm, i) => ABL(nm, w[i], 'daten')) }); };
  const nachStrichliste = (n, k, sk) => () => { const s = klein(), namen = namenVon(s, k), w = skalenWerte(sk, k, n, (x) => x.some((y) => y >= 5));
    return zeichnen(Z('Zähle die Striche in jeder Zeile.', 'Zeichne dann das Säulendiagramm.'), dia(s, sk, namen.map((nm, i) => [nm, w[i], 'offen'])),
      hil(n, 'Zähle erst eine Zeile und zeichne sofort ihre Säule.', 'Ein Bündel und 2 Striche: Die Säule geht bis 7.', `In der ersten Zeile stehen ${w[0]} Striche.`),
      { bild: strichBild(namen, w, s.diagrammTitel), nachweis: namen.map((nm, i) => ABL(nm, w[i], 'bild')) }); };
  const nachListe = (n, k, sk) => () => { const s = kleinUmfrage(), namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    return zeichnen(Z(`Das sind die Antworten der ${s.klasse}.`, 'Zähle jede Antwort.', 'Zeichne dann das Säulendiagramm.'), dia(s, sk, namen.map((nm, i) => [nm, w[i], 'offen'])),
      hil(n, 'Zähle zuerst alle Antworten einer Sorte. Zeichne dann ihre Säule.', 'Viermal „Hund“: Die Säule geht bis 4.', `${s.gewaehlt(namen[0])} kommt ${w[0]}-mal vor.`),
      { urliste: urliste(namen, w), nachweis: namen.map((nm, i) => ABL(nm, w[i], 'urliste')) }); };
  // Eine Säule fehlt, die Gesamtzahl ist bekannt.
  const mitGesamt = (n, k) => () => { const s = n === 'G' ? klein() : gross(), sk = wahl(ZSKALA[n].filter((x) => x.fein > 1)), namen = namenVon(s, k), w = skalenWerte(sk, k, n), g = summe(w), i = k - 1, rest = w.slice(0, i);
    return zeichnen(Z(`Die Tabelle ist nicht vollständig.`, `Insgesamt sind es ${g} ${s.einheit}.`, `Rechne den fehlenden Wert aus und zeichne die Säule ${s.gewaehlt(namen[i])}.`),
      dia(s, sk, namen.map((nm, j) => [nm, w[j], j === i ? 'offen' : undefined])),
      hil(n, 'Ziehe die bekannten Werte von der Gesamtzahl ab.', 'Gesamt 30, bekannt 10 und 12: 30 − 10 − 12 = 8.', `Rechne ${g} − ${rest.join(' − ')}.`),
      { daten: { kopf: [s.spalte, s.einheit], zeilen: [...namen.map((nm, j) => [nm, j === i ? '?' : String(w[j])]), ['Gesamt', String(g)]] }, nachweis: [`${g} − ${rest.join(' − ')} = ${w[i]}`] }); };
  // Zwei Tabellen (zwei Klassen oder zwei Wochen) zusammen zeichnen.
  const summeZeichnen = (n, k) => () => { const s = n === 'M' ? kleinUmfrage() : gross(), sk = wahl(ZSKALA[n].filter((x) => x.fein > 1)), namen = namenVon(s, k);
    const w = skalenWerte(sk, k, n, (x) => x.every((y) => y >= 2 * sk.fein)), a = w.map((x) => suche(() => zz(1, x / sk.fein - 1) * sk.fein, () => true)), b = w.map((x, i) => x - a[i]);
    const [s1, s2] = s.art === 'umfrage' ? ['5a', '5b'] : ['1. Woche', '2. Woche'];
    return zeichnen(Z(s.art === 'umfrage' ? `Die Umfrage „${s.titel}“ wurde in der 5a und der 5b gemacht.` : 'Die Tabelle zeigt zwei Wochen.', 'Zeichne die Säulen für beide zusammen.'),
      dia(s, sk, namen.map((nm, i) => [nm, w[i], 'offen']), s.art === 'umfrage' ? `${s.titel} der 5a und 5b` : `${s.titel} in zwei Wochen`),
      hil(n, 'Rechne zuerst für jede Zeile beide Zahlen zusammen.', '', `${namen[0]}: ${a[0]} + ${b[0]} = ${w[0]}.`),
      { daten: { kopf: [s.spalte, s1, s2], zeilen: namen.map((nm, i) => [nm, String(a[i]), String(b[i])]) }, nachweis: namen.flatMap((nm, i) => [ABL(nm, a[i], 'daten', 1), ABL(nm, b[i], 'daten', 2), `${a[i]} + ${b[i]} = ${w[i]}`]) }); };
  // Säulen mit einer Beziehung: doppelt so viele, die Hälfte, um … mehr.
  const beziehung = (n, zwei) => () => { const s = gross(), sk = wahl(ZSKALA[n].filter((x) => x.fein > 1)), namen = namenVon(s, 4);
    const w = skalenWerte(sk, 4, n, (x) => x[2] === 2 * x[0] && (!zwei || (x[3] === x[1] - 2 * sk.fein * 1 && x[3] > 0)));
    const nm = (i) => s.bei(namen[i]);
    const zeilen = [`${nm(2)[0].toUpperCase()}${nm(2).slice(1)} waren es doppelt so viele ${s.subjekt} wie ${nm(0)}.`, ...(zwei ? [`${nm(3)[0].toUpperCase()}${nm(3).slice(1)} waren es ${w[1] - w[3]} ${s.subjekt} weniger als ${nm(1)}.`] : [])];
    return zeichnen(Z('Zeichne die fehlenden Säulen.', ...zeilen), dia(s, sk, namen.map((x, i) => [x, w[i], i === 2 || (zwei && i === 3) ? 'offen' : undefined])),
      hil(n, 'Lies zuerst den Wert ab, mit dem verglichen wird.', '', `${nm(0)} sind es ${w[0]}. Das Doppelte ist ${2 * w[0]}.`.replace(/^./, (c) => c.toUpperCase())),
      { nachweis: [ABL(namen[0], w[0], 'diagramm'), `2 · ${w[0]} = ${w[2]}`, ...(zwei ? [ABL(namen[1], w[1], 'diagramm'), `${w[1]} − ${w[1] - w[3]} = ${w[3]}`] : [])] }); };

  sechs(Z1, 'F', [
    nachTabelle('F', 3, ZSKALA.F[0], 1),
    nachTabelle('F', 3, ZSKALA.F[0]),
    nachStrichliste('F', 3, ZSKALA.F[0]),
    nachTabelle('F', 3, ZSKALA.F[1]),
    nachListe('F', 3, { fein: 1, schritt: 1, max: 8 }),
    nachTabelle('F', 3, ZSKALA.F[1], 1),
  ]);
  sechs(Z1, 'G', [
    nachTabelle('G', 4, ZSKALA.G[0]),
    nachTabelle('G', 4, ZSKALA.G[1]),
    nachStrichliste('G', 4, { fein: 1, schritt: 5, max: 20 }),
    nachTabelle('G', 4, ZSKALA.G[2]),
    nachListe('G', 4, { fein: 1, schritt: 5, max: 10 }),
    mitGesamt('G', 4),
  ]);
  sechs(Z1, 'M', [
    nachTabelle('M', 4, ZSKALA.M[0]),
    summeZeichnen('M', 4),
    nachListe('M', 4, ZSKALA.M[2]),
    nachTabelle('M', 5, ZSKALA.M[1]),
    mitGesamt('M', 4),
    beziehung('M', false),
  ]);
  sechs(Z1, 'E', [
    nachTabelle('E', 5, ZSKALA.E[0]),
    summeZeichnen('E', 4),
    mitGesamt('E', 5),
    beziehung('E', true),
    nachStrichliste('E', 4, ZSKALA.E[2]),
    () => { const s = gross(), sk = ZSKALA.E[1], namen = namenVon(s, 4), w = skalenWerte(sk, 4, 'E', (x) => x[3] * 2 === x[1] + x[2] && x[3] % sk.fein === 0), m = w[3];
      return zeichnen(Z('Zeichne die letzte Säule.', `Sie ist halb so hoch wie die zweite und die dritte Säule zusammen.`), dia(s, sk, namen.map((x, i) => [x, w[i], i === 3 ? 'offen' : undefined])),
        hil('E', 'Lies die beiden Säulen ab, rechne sie zusammen und halbiere.'), { nachweis: [ABL(namen[1], w[1], 'diagramm'), ABL(namen[2], w[2], 'diagramm'), `${w[1]} + ${w[2]} = ${w[1] + w[2]}`, `${w[1] + w[2]} : 2 = ${m}`] }); },
  ]);
}

// =====================================================================
// Z2 Achseneinteilung wählen und Fehler in Diagrammen finden
// =====================================================================
function einteilungUndFehler() {
  const Z2 = ID(3, 'Z2');
  // Achseneinteilungen als Antworten: „In 5er-Schritten bis 60“. Genau eine passt: alle Werte auf einer Linie,
  // die größte Säule passt auf die Achse, und es sind höchstens 20 Linien.
  const einteilungText = (s, m, zusatz = '') => `In ${s}er-Schritten bis ${m}${zusatz}`;
  const passt = (werte_, s, m) => werte_.every((x) => x % s === 0) && m >= Math.max(...werte_) && m / s <= 20 && m % s === 0;
  function einteilungsAufgabe(n, stufe, mitGrund) {
    const s = n === 'F' || n === 'G' ? kleinUmfrage() : gross();
    const k = n === 'F' ? 3 : 4, namen = namenVon(s, k);
    const w = werte(k, stufe, stufe * 18, stufe, (x) => x.some((y) => y % (stufe * 2) !== 0) && Math.max(...x) > stufe * 8);
    const max = Math.ceil(Math.max(...w) / stufe) * stufe + stufe * zz(0, 2), m = max;
    const opts = [
      [stufe, m, true, null, mitGrund ? ', denn alle Werte liegen auf einer Linie.' : ''],
      [stufe * 2, Math.ceil(m / (stufe * 2)) * stufe * 2, false, 'einteilung-zu-grob', mitGrund ? ', denn mit großen Schritten wird es übersichtlich.' : ''],
      [stufe, Math.floor(Math.max(...w) / stufe - 2) * stufe, false, 'einteilung-zu-kurz', mitGrund ? ', denn die Achse soll kurz sein.' : ''],
      ...(stufe >= 5 ? [[stufe / 5, m, false, 'einteilung-zu-fein', mitGrund ? ', denn kleine Schritte sind genau.' : '']] : []),
      ...(stufe === 1 ? [[stufe, m * 10, false, 'einteilung-zu-fein', mitGrund ? ', denn eine lange Achse ist genau.' : '']] : []),
    ].filter(([st, mx]) => st >= 1 && mx > 0);
    const optionen = opts.map(([st, mx, r, f, z]) => opt(einteilungText(st, mx, z), r && passt(w, st, mx), f ?? undefined));
    return auswahl(Z(`${kind()} will ein Säulendiagramm zur ${n === 'F' ? 'Strichliste' : 'Tabelle'} zeichnen.`, 'Welche Achse passt am besten?'), optionen,
      hil(n, 'Prüfe zwei Dinge: Liegt jeder Wert auf einer Linie? Passt die größte Säule auf die Achse?', 'Werte 15, 20 und 35: 5er-Schritte bis 40 passen.', `Der größte Wert ist ${Math.max(...w)}. Alle Werte sind Vielfache von ${stufe}.`),
      { ...(n === 'F' ? { bild: strichBild(namen, w, s.diagrammTitel) } : { daten: daten(s, namen, w) }), nachweis: [EINTEILUNG(w)] });
  }
  // Eine Säule passt nicht zur Tabelle. mehrfach: zwei Säulen sind falsch.
  function falscheSaeule(n, mehrfach = false) {
    const s = n === 'F' || n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const falsch = mische([...namen.keys()]).slice(0, mehrfach ? 2 : 1);
    const gezeigt = w.map((x, i) => (falsch.includes(i) ? (x + sk.fein <= sk.max && !w.includes(x + sk.fein) ? x + sk.fein : x - sk.fein) : x));
    if (gezeigt.some((x) => x <= 0)) return null;
    return auswahl(Z(`${kind()} hat ein Säulendiagramm zur Tabelle gezeichnet.`, mehrfach ? 'Zwei Säulen passen nicht zur Tabelle.' : 'Eine Säule passt nicht zur Tabelle.', mehrfach ? 'Welche?' : 'Welche Säule ist falsch?'),
      namen.map((nm, i) => opt(s.gewaehlt(nm), falsch.includes(i))),
      hil(n, 'Prüfe jede Säule mit ihrer Zahl in der Tabelle.', 'In der Tabelle steht 6, die Säule endet bei 7: Sie ist falsch.', `Die Linien gehen in ${sk.fein}er-Schritten.`),
      { bild: saeulenBild(s, namen, gezeigt, sk), daten: daten(s, namen, w), mehrfach, nachweis: [ZEILE('abweichend')] });
  }
  const MAENGEL = { titel: 'Der Titel fehlt.', einheit: 'Die Einheit fehlt.', saeule: 'Eine Säule fehlt.', achse: 'Die Achse beginnt nicht bei 0.' };
  function mangelAufgabe(n, arten, gesucht) {
    const s = n === 'F' || n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), k = 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const was = gesucht ?? wahl(arten.filter((x) => x !== 'achse'));
    const gezeigt = was === 'saeule' ? [0, 1, 3].map((i) => [namen[i], w[i]]) : namen.map((nm, i) => [nm, w[i]]);
    const bild = B.saeulen({ titel: s.diagrammTitel, einheit: s.einheit, max: sk.max, schritt: sk.schritt, ...(sk.fein !== sk.schritt ? { fein: sk.fein } : {}), saeulen: gezeigt, ...(was !== 'saeule' ? { ohne: [was] } : {}) });
    return auswahl(Z(`${kind()} hat ein Säulendiagramm zur Tabelle gezeichnet.`, 'Etwas ist nicht in Ordnung.', 'Was ist es?'), arten.map((x) => opt(MAENGEL[x], x === was)),
      hil(n, 'Ein Diagramm braucht einen Titel, eine Einheit an der Achse und eine Säule für jede Zeile der Tabelle.', 'Steht über dem Diagramm nichts, fehlt der Titel.', 'Prüfe zuerst den Titel, dann die Achse, dann die Säulen.'),
      { bild, daten: daten(s, namen, w), nachweis: [MANGEL] });
  }
  function korrigieren(n, anzahl) {
    const s = n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), k = n === 'E' ? 5 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const falsch = mische([...namen.keys()]).slice(0, anzahl);
    const start = w.map((x, i) => (falsch.includes(i) ? (x + 2 * sk.fein <= sk.max ? x + 2 * sk.fein : x - 2 * sk.fein) : x));
    if (start.some((x) => x <= 0)) return null;
    return zeichnen(Z(`${kind()} hat ein Säulendiagramm zur Tabelle gezeichnet.`, `${['', 'Eine Säule ist', 'Zwei Säulen sind', 'Drei Säulen sind'][anzahl]} falsch.`, 'Ziehe sie auf die richtige Höhe.'),
      { titel: s.diagrammTitel, einheit: s.einheit, max: sk.max, schritt: sk.schritt, fein: sk.fein, saeulen: namen.map((nm, i) => ({ name: nm, wert: w[i], offen: true, start: start[i] })) },
      hil(n, 'Vergleiche jede Säule mit der Tabelle. Ändere nur die falschen.', 'In der Tabelle steht 12, die Säule endet bei 16: Ziehe sie bis 12.', `Die Linien gehen in ${sk.fein}er-Schritten.`),
      { daten: daten(s, namen, w), nachweis: namen.map((nm, i) => ABL(nm, w[i], 'daten')) });
  }
  const linienAbstand = (n, sk) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), namen = namenVon(s, 3), w = skalenWerte(sk, 3, n);
    return zahl(Z(s.einleitung, 'Schau dir die Linien an der Achse an.', 'Um wie viel geht es von einer Linie zur nächsten weiter?'), sk.fein, ohneDoppelte(sk.fein, [{ wert: 1, fehlvorstellung: 'skala-einerschritte' }, { wert: sk.schritt, fehlvorstellung: 'skala-zwischenwert' }]),
      hil(n, 'Suche zwei beschriftete Linien. Zähle die Abstände dazwischen.', 'Von 0 bis 10 sind es 5 Abstände: 10 : 5 = 2.', `Von 0 bis ${sk.schritt} sind es ${sk.schritt / sk.fein} Abstände.`),
      { bild: saeulenBild(s, namen, w, sk), nachweis: [LINIE(sk.fein)] }); };
  const zwischen = (n, s_, werte_) => () => { const st = s_, x = suche(() => werte_(), (v) => v % st !== 0), u = Math.floor(x / st) * st, o = u + st;
    return luecken(Z(`Die Achse geht in ${st}er-Schritten.`, `Der Wert ${x} liegt nicht auf einer Linie.`, 'Er liegt zwischen {{a}} und {{b}}.'), { a: u, b: o },
      hil(n, `Rechne aus, wie oft ${st} in ${x} passt.`, `${x} : ${st} = ${Math.floor(x / st)} Rest ${x % st}.`),
      { nachweis: [`${x} : ${st} = ${Math.floor(x / st)} Rest ${x % st}`, `${Math.floor(x / st)} · ${st} = ${u}`, `${u} + ${st} = ${o}`] }); };

  sechs(Z2, 'F', [
    () => falscheSaeule('F'),
    () => einteilungsAufgabe('F', 1),
    () => mangelAufgabe('F', ['titel', 'saeule'], 'titel'),
    linienAbstand('F', { fein: 2, schritt: 2, max: 20 }),
    () => falscheSaeule('F'),
    () => einteilungsAufgabe('F', 2),
  ]);
  sechs(Z2, 'G', [
    () => einteilungsAufgabe('G', 5),
    () => falscheSaeule('G'),
    () => mangelAufgabe('G', ['titel', 'einheit', 'saeule'], 'einheit'),
    linienAbstand('G', { fein: 5, schritt: 10, max: 50 }),
    () => korrigieren('G', 1),
    () => einteilungsAufgabe('G', 10, true),
  ]);
  sechs(Z2, 'M', [
    () => einteilungsAufgabe('M', 25),
    () => korrigieren('M', 2),
    () => falscheSaeule('M', true),
    linienAbstand('M', { fein: 25, schritt: 100, max: 500 }),
    () => mangelAufgabe('M', ['titel', 'einheit', 'saeule'], 'saeule'),
    zwischen('M', 20, () => zz(5, 19) * 10),
  ]);
  sechs(Z2, 'E', [
    () => einteilungsAufgabe('E', 50),
    () => korrigieren('E', 3),
    () => falscheSaeule('E', true),
    () => einteilungsAufgabe('E', 100, true),
    () => { const st = wahl([50, 25, 20]), maxWert = zz(12, 20) * st;
      return zahl(Z(`Ein Diagramm soll eine Achse in ${st}er-Schritten bekommen.`, `Der größte Wert ist ${maxWert}.`, 'Wie viele Linien braucht man über der Nulllinie mindestens?'), maxWert / st,
        ohneDoppelte(maxWert / st, [{ wert: maxWert / st + 1, fehlvorstellung: 'einteilung-zu-fein' }]), hil('E', `Jede Linie liegt ${st} höher als die vorige.`), { nachweis: [`${maxWert} : ${st} = ${maxWert / st}`] }); },
    () => { const st = wahl([25, 50]), x = suche(() => zz(3, 30) * 10, (v) => v % st !== 0), y = suche(() => zz(3, 30) * 10, (v) => v % st !== 0 && Math.floor(v / st) !== Math.floor(x / st));
      const [ux, uy] = [Math.floor(x / st) * st, Math.floor(y / st) * st];
      return luecken(Z(`Die Achse geht in ${st}er-Schritten.`, `Der Wert ${x} liegt zwischen {{a}} und {{b}}.`, `Der Wert ${y} liegt zwischen {{c}} und {{d}}.`), { a: ux, b: ux + st, c: uy, d: uy + st },
        hil('E', `Suche das größte Vielfache von ${st} unter dem Wert.`),
        { nachweis: [`${x} : ${st} = ${ux / st} Rest ${x - ux}`, `${ux / st} · ${st} = ${ux}`, `${ux} + ${st} = ${ux + st}`, `${y} : ${st} = ${uy / st} Rest ${y - uy}`, `${uy / st} · ${st} = ${uy}`, `${uy} + ${st} = ${uy + st}`] }); },
  ]);
}

// =====================================================================
// V1 Daten vergleichen
// =====================================================================
function datenVergleichen() {
  const V1 = ID(4, 'V1');
  const bildFuer = (art, s, namen, w, n, sk) => (art === 'balken' ? balkenBild(s, namen, w, sk) : art === 'strich' ? strichBild(namen, w, s.diagrammTitel) : art === 'bild' ? bildDiagramm(s, namen, w, sk.je) : saeulenBild(s, namen, w, sk));
  const unterschied = (n, art, sk_) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), sk = sk_ ?? wahl(SKALA[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k);
    const w = art === 'strich' ? werte(k, 3, 14) : art === 'bild' ? werte(k, sk.je, sk.je * 8, n === 'M' || n === 'E' ? sk.je / 2 : sk.je) : skalenWerte(sk, k, n);
    const [i, j] = n === 'M' || n === 'E' ? [w.indexOf(Math.max(...w)), w.indexOf(Math.min(...w))] : mische([...namen.keys()]).slice(0, 2).sort((a, b) => w[b] - w[a]);
    const d = w[i] - w[j];
    return zahl(Z(s.einleitung, n === 'M' || n === 'E' ? `Um wie viele ${s.subjekt} unterscheiden sich der größte und der kleinste Wert?` : s.mehr(namen[i], namen[j])), d,
      ohneDoppelte(d, [{ wert: w[i] + w[j], fehlvorstellung: 'unterschied-addiert' }, ...(art === 'bild' ? [{ wert: d / sk.je, fehlvorstellung: 'bild-symbole-gezaehlt' }] : [])].filter((x) => Number.isInteger(x.wert))),
      hil(n, 'Lies beide Werte ab. Ziehe den kleineren vom größeren ab.', '8 und 5: 8 − 5 = 3. Es sind 3 mehr.', `Die Werte sind ${w[i]} und ${w[j]}.`),
      { bild: bildFuer(art, s, namen, w, n, sk), nachweis: [ABL(namen[i], w[i]), ABL(namen[j], w[j]), `${w[i]} − ${w[j]} = ${d}`] }); };
  const extrem = (n, was, art) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const r = was === 'groesste' ? groesster(namen, w) : kleinster(namen, w), f = was === 'groesste' ? kleinster(namen, w) : groesster(namen, w);
    return auswahl(Z(s.einleitung, s.art === 'besuch' ? `An welchem Tag kamen die ${was === 'groesste' ? 'meisten' : 'wenigsten'} Besucher?` : s.art === 'umfrage' ? `Was wurde am ${was === 'groesste' ? 'häufigsten' : 'seltensten'} gewählt?` : `Wovon gibt es am ${was === 'groesste' ? 'meisten' : 'wenigsten'}?`),
      namen.map((nm) => opt(s.gewaehlt(nm), nm === r, nm === f ? 'extrem-verwechselt' : undefined)),
      hil(n, was === 'groesste' ? 'Der größte Wert hat den längsten Balken oder die höchste Säule.' : 'Der kleinste Wert hat den kürzesten Balken oder die niedrigste Säule.', 'Vergleiche die Zahlen über den Säulen.', 'Vergleiche die Zahlen.'),
      { bild: art === 'balken' ? balkenBild(s, namen, w, sk, { werteZeigen: true }) : saeulenBild(s, namen, w, sk, { werteZeigen: true }), nachweis: [ZEILE(was)] }); };
  const rang = (n, k) => () => { const s = n === 'F' || n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), namen = namenVon(s, k), w = skalenWerte(sk, k, n);
    const ordnung = [...namen].sort((a, b) => w[namen.indexOf(b)] - w[namen.indexOf(a)]);
    const umgekehrt = [...ordnung].reverse(), getauscht = [ordnung[1], ordnung[0], ...ordnung.slice(2)], getauscht2 = [...ordnung.slice(0, k - 2), ordnung[k - 1], ordnung[k - 2]];
    const text = (o) => o.map(s.gewaehlt).join(', ');
    const optionen = [opt(text(ordnung), true), opt(text(umgekehrt), false, 'extrem-verwechselt'), opt(text(getauscht), false), opt(text(getauscht2), false)].filter((o, i, a) => a.findIndex((x) => x.text === o.text) === i);
    return auswahl(Z(s.einleitung, n === 'F' || n === 'G' ? 'Ordne vom größten zum kleinsten Wert.' : 'Welche Rangfolge stimmt, vom größten zum kleinsten Wert?', 'Welche Reihe stimmt?'.replace(/^Welche Reihe stimmt\?$/, n === 'F' || n === 'G' ? 'Welche Reihe stimmt?' : '')).replace(/\n$/, ''),
      optionen, hil(n, 'Suche zuerst den größten Wert, dann den nächsten.', 'Säulen 8, 3 und 5: zuerst 8, dann 5, dann 3.', `Der größte Wert ist ${s.bei(ordnung[0])}.`),
      { bild: saeulenBild(s, namen, w, sk), nachweis: [RANG()] }); };
  const zweiGruppen = (n, k, teile) => () => { const s = kleinUmfrage(), namen = namenVon(s, k), [ga, gb] = ['Jungen', 'Mädchen'], a = werte(k, 2, n === 'G' ? 9 : 14), b = werte(k, 2, n === 'G' ? 9 : 14);
    const i = suche(() => zz(0, k - 1), (x) => a[x] !== b[x]), [g1, g2] = a[i] > b[i] ? [ga, gb] : [gb, ga], d = Math.abs(a[i] - b[i]), j = (i + 1) % k;
    const liste = [teil(`Wie viele Kinder haben „${namen[j]}“ gewählt?`, a[j] + b[j], 'Kinder', ohneDoppelte(a[j] + b[j], [{ wert: a[j], fehlvorstellung: 'sach-schritt-vergessen' }])),
      teil(`Wie viele ${g1} mehr als ${g2} haben „${namen[i]}“ gewählt?`, d, 'Kinder', ohneDoppelte(d, [{ wert: a[i] + b[i], fehlvorstellung: 'unterschied-addiert' }])),
      teil(`Wie viele ${gb} wurden befragt?`, summe(b), 'Kinder', ohneDoppelte(summe(b), [{ wert: summe(a) + summe(b), fehlvorstellung: 'sach-unnoetige-angabe' }]))].slice(0, teile);
    return sach(Z(`Bei der Umfrage „${s.titel}“ wurden Jungen und Mädchen getrennt gezählt.`, 'Vergleiche.'), liste,
      hil(n, 'Die Jungen stehen in der mittleren Spalte, die Mädchen rechts.', 'Jungen 6, Mädchen 4: Es sind 2 Jungen mehr.', `In der Zeile „${namen[i]}“ stehen ${a[i]} und ${b[i]}.`),
      { daten: { kopf: [s.spalte, ga, gb], zeilen: namen.map((nm, x) => [nm, String(a[x]), String(b[x])]) },
        nachweis: [ABL(namen[j], a[j], 'daten', 1), ABL(namen[j], b[j], 'daten', 2), `${a[j]} + ${b[j]} = ${a[j] + b[j]}`, ABL(namen[i], a[i], 'daten', 1), ABL(namen[i], b[i], 'daten', 2), `${Math.max(a[i], b[i])} − ${Math.min(a[i], b[i])} = ${d}`, ...(teile > 2 ? [`${b.join(' + ')} = ${summe(b)}`] : [])] }); };
  // Anteil: gleich viele, aber unterschiedlich große Gruppen.
  const anteil = (n) => () => { const s = kleinUmfrage(), name = wahl(s.namen); const [ka, kb] = n === 'M' ? suche(() => [zz(10, 15) * 2, zz(10, 15) * 2], ([x, y]) => x !== y) : suche(() => [zz(8, 10) * 3, zz(8, 12) * 2], ([x, y]) => x !== y);
    const [a, b] = n === 'M' ? [ka / 2, kb / 2] : [ka / 3, kb / 2];
    if (n === 'M') return auswahl(Z(`In der 5a mögen ${a} von ${ka} Kindern „${name}“ am liebsten.`, `In der 5b sind es ${b} von ${kb} Kindern.`, `${kind()} sagt: „In der ${a > b ? '5a' : '5b'} ist „${name}“ beliebter.“`, 'Was meinst du?'),
      [opt(`In beiden Klassen ist es genau die Hälfte: ${ka} : 2 = ${a} und ${kb} : 2 = ${b}.`, true), opt(`Die ${a > b ? '5a' : '5b'}, denn ${Math.max(a, b)} ist mehr als ${Math.min(a, b)}.`, false, 'anteil-nicht-beachtet'), opt('Das kann man nicht vergleichen.', false), opt(`Die ${a > b ? '5b' : '5a'}, denn die Klasse ist kleiner.`, false)],
      hil('M', 'Vergleiche nicht nur die Anzahl. Wie viele Kinder hat jede Klasse?', 'Vergleiche den Teil der Klasse.'), { nachweis: [`${ka} : 2 = ${a}`, `${kb} : 2 = ${b}`] });
    return auswahl(Z(`In der 5a mögen ${a} von ${ka} Kindern „${name}“ am liebsten.`, `In der 5b sind es ${b} von ${kb} Kindern.`, 'In welcher Klasse ist „' + name + '“ beliebter?'),
      [opt(`In der 5b: Dort ist es die Hälfte der Klasse, in der 5a nur ein Drittel.`, true), opt(`In der ${a > b ? '5a' : '5b'}, denn ${Math.max(a, b)} ist mehr als ${Math.min(a, b)}.`, a > b ? 'anteil-nicht-beachtet' : undefined), opt('In beiden gleich.', false), opt('Das kann man nicht vergleichen.', false)].filter((o, i, arr) => arr.findIndex((x) => x.text === o.text) === i),
      hil('E', 'Vergleiche, welcher Teil der Klasse es jeweils ist.'), { nachweis: [`${ka} : 3 = ${a}`, `${kb} : 2 = ${b}`] }); };

  sechs(V1, 'F', [
    unterschied('F', 'saeulen', SKALA.F[0]),
    extrem('F', 'groesste', 'balken'),
    extrem('F', 'kleinste', 'saeulen'),
    unterschied('F', 'strich'),
    rang('F', 3),
    unterschied('F', 'bild', { je: 2 }),
  ]);
  sechs(V1, 'G', [
    unterschied('G', 'saeulen'),
    extrem('G', 'groesste', 'balken'),
    rang('G', 4),
    unterschied('G', 'balken'),
    zweiGruppen('G', 3, 2),
    () => { const s = klein(), sk = wahl(SKALA.G), namen = namenVon(s, 3), w = skalenWerte(sk, 3, 'G', (x) => x[1] <= sk.max / 2); const stimmt = zz(0, 1) === 1;
      if (stimmt) w[0] = 2 * w[1]; if (!stimmt && w[0] === 2 * w[1]) w[0] += sk.fein; if (w[0] > sk.max || new Set(w).size < 3) return null;
      return auswahl(Z(s.einleitung, `${kind()} sagt: „${Bei(s, namen[0])} sind es doppelt so viele ${s.einheit} wie ${s.bei(namen[1])}.“`, 'Stimmt das?'),
        [opt(stimmt ? `Stimmt: 2 · ${w[1]} = ${w[0]}.` : `Falsch: 2 · ${w[1]} = ${2 * w[1]}, es sind aber ${w[0]}.`, true), opt(stimmt ? 'Falsch: Die Säule ist nur etwas höher.' : 'Stimmt: Die Säule ist höher.', false), opt('Das sieht man nicht.', false)],
        hil('G', 'Lies beide Werte ab. Rechne das Doppelte des kleineren Werts aus.', 'Das Doppelte von 7 ist 2 · 7 = 14.', `Die Werte sind ${w[0]} und ${w[1]}.`),
        { bild: saeulenBild(s, namen, w, sk), nachweis: [U(stimmt), ABL(namen[0], w[0]), ABL(namen[1], w[1]), `2 · ${w[1]} = ${2 * w[1]}`, AUSSAGE('doppelt', [namen[0], namen[1]], stimmt)] }); },
  ]);
  sechs(V1, 'M', [
    unterschied('M', 'saeulen'),
    rang('M', 5),
    zweiGruppen('M', 4, 3),
    unterschied('M', 'bild', { je: wahl([10, 20]) }),
    () => { const s = gross(), sk = wahl(SKALA.M), namen = namenVon(s, 4), w = skalenWerte(sk, 4, 'M'); const sortiert = [...w].sort((a, b) => b - a), [a, b] = [namen[w.indexOf(sortiert[0])], namen[w.indexOf(sortiert[1])]], d = sortiert[0] - sortiert[1];
      return zahl(Z(s.einleitung, `Um wie viele ${s.subjekt} liegt der größte Wert vor dem zweitgrößten?`), d, ohneDoppelte(d, [{ wert: sortiert[0] - sortiert[3], fehlvorstellung: 'extrem-verwechselt' }]),
        hil('M', 'Ordne zuerst die Werte der Größe nach.', `Der größte Wert ist ${sortiert[0]}, der zweitgrößte ${sortiert[1]}.`),
        { bild: balkenBild(s, namen, w, sk), nachweis: [ABL(a, sortiert[0]), ABL(b, sortiert[1]), `${sortiert[0]} − ${sortiert[1]} = ${d}`] }); },
    anteil('M'),
  ]);
  sechs(V1, 'E', [
    unterschied('E', 'balken'),
    zweiGruppen('E', 4, 3),
    () => { const s = wahl(BESUCHE), sk = wahl(SKALA.E), namen = ['Mo', 'Di', 'Sa', 'So'], w = skalenWerte(sk, 4, 'E', (x) => x[2] + x[3] > x[0] + x[1]), we = w[2] + w[3], an = w[0] + w[1], d = we - an;
      return zahl(Z(s.einleitung, 'Wie viele Besucher kamen am Samstag und Sonntag zusammen mehr als am Montag und Dienstag zusammen?'), d,
        ohneDoppelte(d, [{ wert: we, fehlvorstellung: 'sach-schritt-vergessen' }, { wert: we + an, fehlvorstellung: 'sach-falsche-rechnung' }]), hil('E', 'Rechne zuerst die beiden Tage jeweils zusammen.'),
        { bild: saeulenBild(s, namen, w, sk), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w[2]} + ${w[3]} = ${we}`, `${w[0]} + ${w[1]} = ${an}`, `${we} − ${an} = ${d}`] }); },
    anteil('E'),
    () => { const s = gross(), sk = wahl(SKALA.E), namen = namenVon(s, 5), w = skalenWerte(sk, 5, 'E'), sortiert = [...w].sort((a, b) => b - a), mitte = sortiert[2], name = namen[w.indexOf(mitte)];
      return auswahl(Z(s.einleitung, 'Welcher Wert steht in der Rangfolge genau in der Mitte?'), namen.map((nm) => opt(s.gewaehlt(nm), nm === name, w[namen.indexOf(nm)] === sortiert[0] || w[namen.indexOf(nm)] === sortiert[4] ? 'extrem-verwechselt' : undefined)),
        hil('E', 'Ordne die fünf Werte der Größe nach. Der dritte steht in der Mitte.'), { bild: balkenBild(s, namen, w, sk), nachweis: [ZEILE('mitte')] }); },
    () => { const s = kleinUmfrage(), namen = namenVon(s, 3), w = werte(3, 4, 18, 1, (x) => x[0] < x[1] + x[2]), fehlt = w[1] + w[2] - w[0];
      return zahl(Z(`Das Ergebnis der Umfrage „${s.titel}“ steht in der Tabelle.`, `Wie viele Stimmen fehlen „${namen[0]}“, damit es so viele sind wie für „${namen[1]}“ und „${namen[2]}“ zusammen?`), fehlt,
        ohneDoppelte(fehlt, [{ wert: w[1] + w[2], fehlvorstellung: 'sach-schritt-vergessen' }]), hil('E', 'Rechne zuerst die beiden anderen zusammen.'),
        { daten: daten(s, namen, w, 'Kinder'), nachweis: [...namen.map((nm, i) => ABL(nm, w[i], 'daten')), `${w[1]} + ${w[2]} = ${w[1] + w[2]}`, `${w[1] + w[2]} − ${w[0]} = ${fehlt}`] }); },
  ]);
}

// =====================================================================
// V2 Aussagen über Daten prüfen, täuschende Diagramme erkennen
// =====================================================================
function aussagenPruefen() {
  const V2 = ID(4, 'V2');
  // Aussagen als Satz und als Sonderart für den Prüfer.
  const satz = (s, typ, namen, wert) => {
    const b = (n) => s.bei(n), B_ = (n) => Bei(s, n), e = s.einheit;
    switch (typ) {
      case 'meiste': return s.art === 'umfrage' ? `„${namen[0]}“ wurde am häufigsten gewählt.` : `${B_(namen[0])} sind es die meisten ${e}.`;
      case 'wenigste': return s.art === 'umfrage' ? `„${namen[0]}“ wurde am seltensten gewählt.` : `${B_(namen[0])} sind es die wenigsten ${e}.`;
      case 'mehr': return `${B_(namen[0])} sind es mehr ${e} als ${b(namen[1])}.`;
      case 'gleich': return `${B_(namen[0])} und ${b(namen[1])} sind es gleich viele ${e}.`;
      case 'anzahl': return `${B_(namen[0])} sind es ${wert} ${e}.`;
      case 'summeMehr': return `${B_(namen[0])} und ${b(namen[1])} sind es zusammen mehr ${e} als ${b(namen[2])}.`;
      case 'doppelt': return `${B_(namen[0])} sind es doppelt so viele ${e} wie ${b(namen[1])}.`;
      case 'mehrAlsHaelfte': return s.art === 'umfrage' ? `Mehr als die Hälfte der Kinder hat „${namen[0]}“ gewählt.` : `${B_(namen[0])} sind es mehr als die Hälfte aller ${e}.`;
      default: throw new Error(typ);
    }
  };
  const wahr = (typ, nm, w, namen, wert) => { const v = (x) => w[namen.indexOf(x)];
    return { meiste: () => v(nm[0]) === Math.max(...w), wenigste: () => v(nm[0]) === Math.min(...w), mehr: () => v(nm[0]) > v(nm[1]), gleich: () => v(nm[0]) === v(nm[1]),
      anzahl: () => v(nm[0]) === wert, summeMehr: () => v(nm[0]) + v(nm[1]) > v(nm[2]), doppelt: () => v(nm[0]) === 2 * v(nm[1]), mehrAlsHaelfte: () => 2 * v(nm[0]) > summe(w) }[typ](); };
  // Eine Behauptung prüfen: Stimmt das?
  function behauptung(n, typ, bildArt = 'saeulen', soll = zz(0, 1) === 1) {
    const s = n === 'F' || n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), k = n === 'F' ? 3 : 4, namen = namenVon(s, k);
    let w = bildArt === 'bild' ? werte(k, 10, 80, 5, (x) => x.some((y) => y % 10 !== 0)) : skalenWerte(sk, k, n);
    let nm = mische(namen).slice(0, 3), wert = null;
    if (typ === 'gleich') { if (soll) w[namen.indexOf(nm[1])] = w[namen.indexOf(nm[0])]; }
    if (typ === 'doppelt') { const b = w[namen.indexOf(nm[1])]; if (soll) { if (2 * b > sk.max) return null; w[namen.indexOf(nm[0])] = 2 * b; } else if (w[namen.indexOf(nm[0])] === 2 * b) return null; }
    if (typ === 'meiste' || typ === 'wenigste') { const ziel = typ === 'meiste' ? groesster(namen, w) : kleinster(namen, w); nm = soll ? [ziel] : [wahl(namen.filter((x) => x !== ziel))]; }
    if (typ === 'anzahl') { const echt = w[namen.indexOf(nm[0])]; wert = soll ? echt : echt + (bildArt === 'bild' ? 5 : sk.fein); if (wert > (sk.max ?? 1000)) wert = echt - sk.fein; }
    if (typ !== 'gleich' && new Set(w).size < k) return null;
    const stimmt = wahr(typ, nm, w, namen, wert);
    if (stimmt !== soll) return null;
    const bild = bildArt === 'balken' ? balkenBild(s, namen, w, sk) : bildArt === 'bild' ? bildDiagramm(s, namen, w, 10) : saeulenBild(s, namen, w, sk);
    const begruendung = { meiste: 'Vergleiche die höchsten Säulen.', wenigste: 'Vergleiche die niedrigsten Säulen.', mehr: 'Vergleiche die beiden Werte.', gleich: 'Lies beide Werte genau ab.', anzahl: 'Lies den Wert genau ab.', summeMehr: 'Rechne die beiden Werte zusammen.', doppelt: 'Rechne das Doppelte des kleineren Werts aus.', mehrAlsHaelfte: 'Rechne alle Werte zusammen und vergleiche.' }[typ];
    const v = (x) => w[namen.indexOf(x)];
    const rechnung = typ === 'summeMehr' ? [`${v(nm[0])} + ${v(nm[1])} = ${v(nm[0]) + v(nm[1])}`] : typ === 'doppelt' ? [`2 · ${v(nm[1])} = ${2 * v(nm[1])}`] : typ === 'mehrAlsHaelfte' ? [`${w.join(' + ')} = ${summe(w)}`, `2 · ${v(nm[0])} = ${2 * v(nm[0])}`] : [];
    return auswahl(Z(s.einleitung, `${kind()} sagt:`, `„${satz(s, typ, nm, wert)}“`, 'Stimmt das?'), [opt(soll ? 'Stimmt.' : 'Falsch.', true), opt(soll ? 'Falsch.' : 'Stimmt.', false, typ === 'meiste' || typ === 'wenigste' ? 'extrem-verwechselt' : undefined)],
      hil(n, begruendung, 'Säulen 6 und 4: 6 ist mehr als 4.', `Lies die Werte ab: ${nm.map((x) => `${s.gewaehlt(x)} ${v(x)}`).join(', ')}.`),
      { bild, nachweis: [U(stimmt), AUSSAGE(typ, nm, stimmt, wert), ...nm.map((x) => ABL(x, v(x))), ...rechnung] });
  }
  // Welche Aussage stimmt? Eine von mehreren.
  function welcheStimmt(n, k) {
    const s = n === 'G' ? klein() : gross(), sk = wahl(SKALA[n]), namen = namenVon(s, 4), w = skalenWerte(sk, 4, n);
    const kandidaten = [];
    for (const typ of ['meiste', 'wenigste', 'mehr', 'summeMehr', 'doppelt']) for (let i = 0; i < 6; i++) {
      const nm = mische(namen).slice(0, 3); const t = satz(s, typ, nm); if (kandidaten.some((x) => x.text === t)) continue;
      kandidaten.push({ text: t, typ, namen: typ === 'meiste' || typ === 'wenigste' ? [nm[0]] : typ === 'summeMehr' ? nm : nm.slice(0, 2), stimmt: wahr(typ, nm, w, namen) });
    }
    const richtig = wahl(kandidaten.filter((x) => x.stimmt)), falsche = mische(kandidaten.filter((x) => !x.stimmt)).slice(0, k - 1);
    if (!richtig || falsche.length < k - 1) return null;
    const liste = mische([richtig, ...falsche]);
    return auswahl(Z(s.einleitung, 'Welche Aussage stimmt?'), liste.map((x) => opt(x.text, x === richtig)),
      hil(n, 'Prüfe jede Aussage mit den abgelesenen Zahlen.', 'Säule 8 und Säule 5: „mehr“ stimmt bei 8.', `Die Werte sind ${namen.map((x, i) => `${s.gewaehlt(x)} ${w[i]}`).join(', ')}.`),
      { bild: saeulenBild(s, namen, w, sk), nachweis: [AUSSAGEN(liste.map((x) => ({ text: x.text, typ: x.typ, namen: x.namen }))), ...namen.map((x, i) => ABL(x, w[i]))] });
  }
  // Täuschendes Diagramm: Die Achse beginnt nicht bei 0.
  function taeuschend(n, frageArt) {
    const s = wahl(BESUCHE), ab = n === 'M' ? 100 : 400, fein = n === 'M' ? 10 : 20, max = ab + fein * 12;
    const namen = namenVon(s, 3), w = werte(3, ab + fein, max, fein, (x) => { const lo = Math.min(...x), hi = Math.max(...x); return (hi - ab) >= 3 * (lo - ab) && hi < 2 * lo; });
    const [hi, lo] = [groesster(namen, w), kleinster(namen, w)], vh = Math.max(...w), vl = Math.min(...w);
    const bild = B.saeulen({ titel: s.diagrammTitel, einheit: s.einheit, max, schritt: fein * 4, fein, ab, saeulen: paare(namen, w) });
    if (frageArt === 'mangel') return auswahl(Z(s.einleitung, `Die Säule für ${s.gewaehlt(hi)} sieht mehr als dreimal so hoch aus wie die für ${s.gewaehlt(lo)}.`, 'Was ist an diesem Diagramm irreführend?'),
      [opt('Die Achse beginnt nicht bei 0.', true), opt('Der Titel fehlt.', false), opt('Die Einheit fehlt.', false), opt('Eine Säule fehlt.', false), opt('Nichts, das Diagramm ist in Ordnung.', false, 'achse-abgeschnitten')],
      hil(n, 'Schau dir die unterste Zahl an der Achse an.'), { bild, nachweis: [MANGEL] });
    if (frageArt === 'zahl') { const d = vh - vl;
      return zahl(Z(s.einleitung, `Die Säule für ${s.gewaehlt(hi)} sieht viel höher aus als die für ${s.gewaehlt(lo)}.`, `Wie viele Besucher kamen am ${TAGE[hi]} wirklich mehr?`), d, ohneDoppelte(d, [{ wert: vh - ab, fehlvorstellung: 'achse-abgeschnitten' }]),
        hil(n, 'Lies die Werte an der Achse ab. Die Achse beginnt nicht bei 0.', `${vh} − ${vl} = ${d}.`), { bild, nachweis: [ABL(hi, vh), ABL(lo, vl), `${vh} − ${vl} = ${d}`] }); }
    return auswahl(Z(s.einleitung, `${kind()} sagt: „Am ${TAGE[hi]} kamen mehr als doppelt so viele Besucher wie am ${TAGE[lo]}.“`, 'Stimmt das?'),
      [opt(`Falsch: Die Achse beginnt bei ${ab}. Es waren ${vh} und ${vl} Besucher, und 2 · ${vl} = ${2 * vl}.`, true), opt('Stimmt: Die Säule ist mehr als doppelt so hoch.', false, 'achse-abgeschnitten'), opt('Das kann man nicht ablesen.', false), opt(`Stimmt: ${vh} ist mehr als ${vl}.`, false)],
      hil(n, 'Schau, wo die Achse beginnt. Lies dann die Werte ab.', `Die Werte sind ${vh} und ${vl}.`),
      { bild, nachweis: [U(false), AUSSAGE('doppelt', [hi, lo], false), ABL(hi, vh), ABL(lo, vl), `2 · ${vl} = ${2 * vl}`, HILFSZAHL(ab, 'Beginn der Achse')] });
  }

  sechs(V2, 'F', [
    () => behauptung('F', 'meiste'),
    () => behauptung('F', 'mehr'),
    () => behauptung('F', 'anzahl', 'saeulen', true),
    () => behauptung('F', 'mehr', 'balken', false),
    () => behauptung('F', 'summeMehr'),
    () => behauptung('F', 'meiste', 'balken', false),
  ]);
  sechs(V2, 'G', [
    () => behauptung('G', 'mehr'),
    () => behauptung('G', 'anzahl', 'balken'),
    () => behauptung('G', 'summeMehr', 'saeulen'),
    () => behauptung('G', 'gleich'),
    () => behauptung('G', 'doppelt'),
    () => welcheStimmt('G', 3),
  ]);
  sechs(V2, 'M', [
    () => behauptung('M', 'mehr', 'bild'),
    () => behauptung('M', 'doppelt'),
    () => welcheStimmt('M', 4),
    () => behauptung('M', 'anzahl'),
    () => behauptung('M', 'mehrAlsHaelfte'),
    () => taeuschend('M', 'aussage'),
  ]);
  sechs(V2, 'E', [
    () => behauptung('E', 'summeMehr', 'balken'),
    () => behauptung('E', 'mehrAlsHaelfte'),
    () => welcheStimmt('E', 5),
    () => taeuschend('E', 'mangel'),
    () => behauptung('E', 'doppelt', 'balken'),
    () => taeuschend('E', 'zahl'),
  ]);
}

// =====================================================================
// U1 Eine Umfrage planen und auswerten
// =====================================================================
function umfragen() {
  const U1 = ID(5, 'U1');
  // Passende Frage zu einem Ergebnis.
  const FALSCHE_FRAGEN = ['Wie alt bist du?', 'Wie heißt du?', 'Hast du Geschwister?', 'Wie spät ist es?', 'Was hast du gestern gemacht?'];
  const frageWahl = (n, k, bildArt) => () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 2, 9, 1, (x) => x.some((y) => y >= 5)), andere = umfrage(wahl(UMFRAGEN.filter((x) => x.titel !== u.titel)));
    const optionen = [opt(u.frage, true), opt(andere.frage, false, 'umfrage-unpassend'), ...mische(FALSCHE_FRAGEN).slice(0, k - 2).map((f) => opt(f, false, 'umfrage-unpassend'))];
    return auswahl(((k) => Z(`${k} hat eine Umfrage gemacht.`, bildArt === 'strich' ? 'Das ist die Strichliste.' : 'Das ist das Diagramm dazu.', `Welche Frage hat ${er(k)} gestellt?`))(kind()), optionen,
      hil(n, 'Schau dir die Antworten an. Zu welcher Frage passen sie?', 'Antworten „Rot“ und „Blau“ passen zur Frage nach der Lieblingsfarbe.', `Die Antworten sind ${namen.map((x) => `„${x}“`).join(', ')}.`),
      { bild: bildArt === 'strich' ? strichBild(namen, w) : B.saeulen({ titel: 'Ergebnis der Umfrage', einheit: 'Kinder', max: 10, schritt: 1, saeulen: paare(namen, w) }) }); };
  const antwortenWahl = (n, k) => () => { const u = kleinUmfrage(), andere = mische(UMFRAGEN.filter((x) => x.titel !== u.titel)).slice(0, k - 1);
    const liste = (x) => mische(x.namen).slice(0, 4).join(', ');
    return auswahl(((k) => Z(`${k} will diese Frage stellen:`, `„${u.frage}“`, `Welche Antworten soll ${er(k)} zur Auswahl geben?`))(kind()), [opt(liste(u), true), ...andere.map((x) => opt(liste(x), false, 'umfrage-unpassend'))],
      hil(n, 'Jede Antwort muss zur Frage passen.', 'Zur Frage nach dem Schulweg passen „Bus“ und „Fahrrad“, aber nicht „Rot“.', 'Lies die Frage noch einmal. Wonach wird gefragt?')); };
  const UNKLAR = [
    ['Was isst du gern?', 'Jedes Kind kann viele Dinge nennen. Die Antworten lassen sich kaum zählen.'],
    ['Wie findest du die Schule?', 'Jedes Kind antwortet mit eigenen Worten. Gleiche Antworten sind selten.'],
    ['Was machst du am Wochenende?', 'Jedes Kind macht viele verschiedene Dinge.'],
  ];
  const klareFrage = (n, k) => () => { const u = kleinUmfrage(), unklar = mische(UNKLAR).slice(0, k - 1);
    return auswahl(Z(`${kind()} will eine Umfrage mit Strichliste machen.`, 'Welche Frage eignet sich dafür am besten?'), [opt(u.frage, true), ...unklar.map(([f]) => opt(f, false, 'umfrage-unpassend'))],
      hil(n, 'Gut ist eine Frage, auf die jedes Kind genau eine von wenigen Antworten gibt.', 'Bei „Welche Farbe magst du am liebsten?“ gibt es wenige Antworten.', 'Bei welcher Frage kannst du die Antworten in Zeilen zählen?')); };

  sechs(U1, 'F', [
    frageWahl('F', 3, 'strich'),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 2, 6), liste = urliste(namen, w);
      return strichlisteAnlegen(Z(`${kind()} fragt die Kinder:`, `„${u.frage}“`, 'Mache für jede Antwort einen Strich.'), paare(namen, w), 'auto',
        hil('F', 'Nimm eine Antwort nach der anderen. Mache in der passenden Zeile einen Strich.', 'Antwort „Bus“: Ein Strich in die Zeile „Bus“.', `„${namen[0]}“ kommt ${w[0]}-mal vor.`),
        { urliste: liste, nachweis: namen.map((nm, i) => ABL(nm, w[i], 'urliste')) }); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 2, 7), i = zz(0, 2);
      return zahl(Z(`${kind()} hat die Kinder gefragt:`, `„${u.frage}“`, `Wie viele Kinder haben „${namen[i]}“ gesagt?`), w[i], ohneDoppelte(w[i], [{ wert: w[i] + 1, fehlvorstellung: 'liste-verzaehlt' }]),
        hil('F', 'Zähle nur die Karten mit dieser Antwort.', 'Dreimal „Bus“: Die Antwort ist 3.', `Suche alle Karten mit „${namen[i]}“.`), { urliste: urliste(namen, w), nachweis: [ABL(namen[i], w[i], 'urliste')] }); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 2, 9), r = groesster(namen, w), f = kleinster(namen, w);
      return auswahl(Z(`${kind()} hat gefragt:`, `„${u.frage}“`, 'Welche Antwort kam am häufigsten?'), namen.map((nm) => opt(`„${nm}“`, nm === r, nm === f ? 'extrem-verwechselt' : undefined)),
        hil('F', 'Suche die höchste Säule.', 'Die höchste Säule zeigt die häufigste Antwort.', 'Vergleiche die drei Säulen.'),
        { bild: B.saeulen({ titel: u.titel, einheit: 'Kinder', max: 10, schritt: 1, saeulen: paare(namen, w) }), nachweis: [ZEILE('groesste')] }); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 4, 7), striche = summe(w), fehlt = zz(1, 3), befragt = striche + fehlt;
      return auswahl(Z(`${kind()} hat ${befragt} Kinder befragt.`, `In der Strichliste sind aber nur ${striche} Striche.`, 'Was ist passiert?'),
        [opt(`Es fehlen ${fehlt} Antworten.`, true), opt(`Es sind ${fehlt} Striche zu viel.`, false), opt('Alles ist richtig.', false)],
        hil('F', 'Vergleiche die Zahl der Kinder mit der Zahl der Striche.', '10 Kinder, aber nur 8 Striche: 2 fehlen.', `Rechne ${befragt} − ${striche}.`),
        { bild: strichBild(namen, w, u.titel), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${striche}`, `${befragt} − ${striche} = ${fehlt}`] }); },
    frageWahl('F', 3, 'saeulen'),
  ]);
  sechs(U1, 'G', [
    frageWahl('G', 3, 'saeulen'),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 4), w = werte(4, 2, 7);
      return tabelle(Z(`${kind()} hat die Kinder gefragt:`, `„${u.frage}“`, 'Werte die Antworten in der Tabelle aus.'), [u.spalte, 'Anzahl'], namen.map((nm, i) => [nm, L(`z${i}`)]),
        Object.fromEntries(w.map((x, i) => [`z${i}`, [x, ohneDoppelte(x, [{ wert: x - 1, fehlvorstellung: 'liste-verzaehlt' }])]])),
        hil('G', 'Zähle jede Antwort für sich.', 'Fünfmal „Bus“: In die Tabelle kommt 5.', `„${namen[0]}“ kommt ${w[0]}-mal vor.`), { urliste: urliste(namen, w), nachweis: namen.map((nm, i) => ABL(nm, w[i], 'urliste')) }); },
    antwortenWahl('G', 3),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 4), w = werte(4, 2, 7), i = zz(0, 3);
      return zahl(Z(`Das sind die Antworten zur Frage „${u.frage}“.`, `Wie viele Kinder haben „${namen[i]}“ geantwortet?`), w[i], ohneDoppelte(w[i], [{ wert: w[i] + 1, fehlvorstellung: 'liste-verzaehlt' }]),
        hil('G', 'Zähle nur diese Antwort.', 'Viermal „Rot“: Die Antwort ist 4.', `Suche alle Karten mit „${namen[i]}“.`), { urliste: urliste(namen, w), nachweis: [ABL(namen[i], w[i], 'urliste')] }); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 4, 12), g = summe(w), i = zz(0, 2);
      return sach(Z(`${kind()} hat die Kinder der ${u.klasse} gefragt:`, `„${u.frage}“`, 'Werte die Strichliste aus.'), [teil('Wie viele Kinder haben geantwortet?', g, 'Kinder'), teil(`Wie viele Kinder haben nicht „${namen[i]}“ gesagt?`, g - w[i], 'Kinder', ohneDoppelte(g - w[i], [{ wert: w[i], fehlvorstellung: 'sach-falsche-rechnung' }]))],
        hil('G', 'Zähle alle Striche zusammen.', '7 + 5 + 4 = 16 Kinder haben geantwortet.', `Die Zeilen haben ${w.join(', ')} Striche.`),
        { bild: strichBild(namen, w, u.titel), nachweis: [...namen.map((nm, j) => ABL(nm, w[j])), `${w.join(' + ')} = ${g}`, `${g} − ${w[i]} = ${g - w[i]}`] }); },
    () => { const [f, grund] = wahl(UNKLAR);
      return auswahl(Z(`${kind()} will mit einer Strichliste fragen:`, `„${f}“`, 'Warum ist diese Frage ungünstig?'),
        [opt(grund, true), opt('Die Frage ist zu kurz.', false), opt('Man darf in der Schule keine Umfragen machen.', false)],
        hil('G', 'Überlege, was die Kinder antworten. Kann man das in wenigen Zeilen zählen?', 'Bei „Lieblingsfarbe“ gibt es nur wenige Antworten.', 'Stell dir drei verschiedene Antworten vor.')); },
  ]);
  sechs(U1, 'M', [
    frageWahl('M', 4, 'strich'),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 4), w = werte(4, 2, 9), g = summe(w), r = groesster(namen, w), d = Math.max(...w) - Math.min(...w);
      return sach(Z(`Das sind die Antworten zur Frage „${u.frage}“.`, 'Werte die Umfrage aus.'), [teil('Wie viele Kinder wurden befragt?', g, 'Kinder', ohneDoppelte(g, [{ wert: g - 1, fehlvorstellung: 'liste-verzaehlt' }])),
        teil(`Wie viele Kinder haben „${r}“ gesagt?`, Math.max(...w), 'Kinder'), teil(`Wie viele Kinder mehr haben „${r}“ gesagt als „${kleinster(namen, w)}“?`, d, 'Kinder')],
      hil('M', 'Zähle zuerst jede Antwort aus und notiere die Zahlen.', `Die Antworten kommen ${w.join(', ')}-mal vor.`),
      { urliste: urliste(namen, w), nachweis: [...namen.map((nm, i) => ABL(nm, w[i], 'urliste')), `${w.join(' + ')} = ${g}`, `${Math.max(...w)} − ${Math.min(...w)} = ${d}`] }); },
    klareFrage('M', 4),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 5), w = werte(5, 2, 8);
      return tabelle(Z(`Das sind die Antworten zur Frage „${u.frage}“.`, 'Werte sie in der Häufigkeitstabelle aus.'), [u.spalte, 'Anzahl'], [...namen.map((nm, i) => [nm, L(`z${i}`)]), ['Gesamt', L('g')]],
        { ...Object.fromEntries(w.map((x, i) => [`z${i}`, [x, ohneDoppelte(x, [{ wert: x + 1, fehlvorstellung: 'liste-verzaehlt' }])]])), g: summe(w) },
        hil('M', 'Zähle jede Antwort aus. Die Gesamtzahl ist die Summe.', `Die erste Antwort kommt ${w[0]}-mal vor.`), { urliste: urliste(namen, w), nachweis: [...namen.map((nm, i) => ABL(nm, w[i], 'urliste')), `${w.join(' + ')} = ${summe(w)}`] }); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 3), w = werte(3, 4, 11), weiss = zz(2, 5), g = summe(w) + weiss;
      return sach(Z(`${kind()} hat die Kinder der ${u.klasse} gefragt:`, `„${u.frage}“`, `${weiss} Kinder haben „weiß nicht“ gesagt.`, 'Werte aus.'),
        [teil('Wie viele Kinder haben eine der drei Antworten gewählt?', summe(w), 'Kinder', ohneDoppelte(summe(w), [{ wert: g, fehlvorstellung: 'sach-unnoetige-angabe' }])), teil('Wie viele Kinder wurden insgesamt befragt?', g, 'Kinder', ohneDoppelte(g, [{ wert: summe(w), fehlvorstellung: 'sach-schritt-vergessen' }]))],
        hil('M', 'Auch „weiß nicht“ ist eine Antwort eines befragten Kindes.', `${w.join(' + ')} = ${summe(w)}.`),
        { bild: strichBild(namen, w, u.titel), nachweis: [...namen.map((nm, i) => ABL(nm, w[i])), `${w.join(' + ')} = ${summe(w)}`, `${summe(w)} + ${weiss} = ${g}`] }); },
    () => { const [ort, tier] = wahl([['im Reitverein', 'Pferd'], ['im Hundeverein', 'Hund'], ['im Fußballverein', 'Fußball']]);
      const ist = tier === 'Fußball' ? 'Fußball ist der beliebteste Sport' : `Das ${tier === 'Pferd' ? 'Pferd' : 'Hund'} ist das beliebteste Tier`.replace('Das Hund', 'Der Hund');
      const k = kind();
      return auswahl(Z(`${k} hat nur Kinder ${ort} befragt.`, `${Er(k)} sagt: „${ist} an unserer Schule.“`, 'Was meinst du dazu?'),
        [opt(`Falsch geschlossen: ${ort[0].toUpperCase()}${ort.slice(1)} ist „${tier}“ natürlich besonders beliebt. Man muss Kinder aus der ganzen Schule fragen.`, true),
          opt(`Stimmt, denn ${er(k)} hat viele Kinder gefragt.`, false), opt('Stimmt, denn eine Umfrage hat immer recht.', false), opt('Falsch, denn Umfragen sind nie richtig.', false)],
        hil('M', `Überlege, wen ${er(k)} gefragt hat. Antworten diese Kinder wie alle anderen?`, tier === 'Fußball' ? 'Wer im Fußballverein ist, mag Fußball besonders.' : `Wer ${ort} ist, mag dieses Tier besonders.`), { nachweis: [U(false)] }); },
  ]);
  sechs(U1, 'E', [
    frageWahl('E', 5, 'saeulen'),
    () => { const u = kleinUmfrage(), namen = namenVon(u, 5), w = werte(5, 2, 9), g = summe(w), r = groesster(namen, w), f = kleinster(namen, w);
      return sach(Z(`Das sind die Antworten zur Frage „${u.frage}“.`, 'Werte die Umfrage aus.'), [teil('Wie viele Kinder wurden befragt?', g, 'Kinder'), teil(`Wie viele Kinder mehr haben „${r}“ gesagt als „${f}“?`, Math.max(...w) - Math.min(...w), 'Kinder'),
        teil(`Wie viele Kinder haben weder „${r}“ noch „${f}“ gesagt?`, g - Math.max(...w) - Math.min(...w), 'Kinder', ohneDoppelte(g - Math.max(...w) - Math.min(...w), [{ wert: g - Math.max(...w), fehlvorstellung: 'sach-schritt-vergessen' }]))],
      hil('E', 'Zähle zuerst jede Antwort aus.'),
      { urliste: urliste(namen, w), nachweis: [...namen.map((nm, i) => ABL(nm, w[i], 'urliste')), `${w.join(' + ')} = ${g}`, `${Math.max(...w)} − ${Math.min(...w)} = ${Math.max(...w) - Math.min(...w)}`, `${g} − ${Math.max(...w)} − ${Math.min(...w)} = ${g - Math.max(...w) - Math.min(...w)}`] }); },
    klareFrage('E', 4),
    () => { const [gruppe, was] = wahl([['nur Kinder aus dem Schwimmverein', 'Schwimmen'], ['nur Kinder aus der Tanz-AG', 'Tanzen'], ['nur Kinder am Bus', 'Bus']]);
      const k = kind();
      return auswahl(Z(`${k} will wissen, wie beliebt „${was}“ an der Schule ist.`, `${Er(k)} befragt ${gruppe}.`, 'Was ist das Problem?'),
        [opt(`Diese Kinder antworten besonders oft mit „${was}“. Das Ergebnis gilt nicht für die ganze Schule.`, true), opt('Es sind zu wenige Antworten zum Zählen.', false), opt(`${Er(k)} hätte eine Strichliste machen müssen.`, false), opt('Es gibt kein Problem.', false, 'anteil-nicht-beachtet'), opt(`${Er(k)} hätte zweimal fragen müssen.`, false)],
        hil('E', 'Überlege, ob diese Kinder wie alle Kinder der Schule antworten.')); },
    () => { const u = kleinUmfrage(), namen = namenVon(u, 4), mo = werte(4, 3, 10), di = werte(4, 2, 6), w = mo.map((x, i) => x + di[i]);
      return tabelle(Z(`${kind()} fragt an zwei Tagen: „${u.frage}“`, 'Die Strichliste zeigt den ersten Tag, die Karten zeigen den zweiten Tag.', 'Werte beide Tage zusammen aus.'), [u.spalte, 'Anzahl'], [...namen.map((nm, i) => [nm, L(`z${i}`)]), ['Gesamt', L('g')]],
        { ...Object.fromEntries(w.map((x, i) => [`z${i}`, [x, ohneDoppelte(x, [{ wert: mo[i], fehlvorstellung: 'sach-schritt-vergessen' }])]])), g: summe(w) },
        hil('E', 'Zähle für jede Antwort beide Tage zusammen.'),
        { bild: strichBild(namen, mo, `${u.titel} am ersten Tag`), urliste: urliste(namen, di), nachweis: [...namen.flatMap((nm, i) => [ABL(nm, mo[i], 'bild'), ABL(nm, di[i], 'urliste'), `${mo[i]} + ${di[i]} = ${w[i]}`]), `${w.join(' + ')} = ${summe(w)}`] }); },
    () => { const je = 3, kinder = zz(15, 30), striche = kinder * je, b = Math.floor(striche / 5), r = striche % 5;
      return zahl(Z(`Bei einer Umfrage nennt jedes Kind genau ${je} Lieblingsfarben.`, `In der Strichliste stehen ${b} volle Bündel und ${r} einzelne Striche.`.replace(' und 0 einzelne Striche', ''), 'Wie viele Kinder wurden befragt?'), kinder,
        ohneDoppelte(kinder, [{ wert: striche, fehlvorstellung: 'sach-schritt-vergessen' }]), hil('E', 'Rechne zuerst aus, wie viele Striche es sind.'),
        { nachweis: [`${b} · 5 + ${r} = ${striche}`, `${striche} : ${je} = ${kinder}`] }); },
  ]);
}
