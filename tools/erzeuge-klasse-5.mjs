// Erzeugt aufgabenpool/klasse-5.json.
// Aufruf: node tools/erzeuge-klasse-5.mjs
// Der Zufall ist fest geimpft: Gleicher Code ergibt immer dieselbe Datei.

import { writeFileSync, mkdirSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-5.mjs';
import { kapitel53, fehlvorstellungen53 } from './kapitel-5-3.mjs';
import { dividieren, fehlvorstellungenDiv } from './dividieren-5-4-5.mjs';

const PRO_GRUPPE = 6; // Aufgaben je Lernziel und Niveaustufe

// ---------- Zufall ----------
let saat = 20261117;
const zufall = () => {
  saat |= 0; saat = (saat + 0x6d2b79f5) | 0;
  let t = Math.imul(saat ^ (saat >>> 15), 1 | saat);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const zz = (von, bis) => von + Math.floor(zufall() * (bis - von + 1));
const wahl = (liste) => liste[zz(0, liste.length - 1)];
const mische = (liste) => {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) { const j = zz(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const suche = (erzeuge, passt) => {
  for (let i = 0; i < 100000; i++) { const x = erzeuge(); if (passt(x)) return x; }
  throw new Error('Keine passenden Zahlen gefunden');
};

// ---------- Zahlen ----------
// Ab fünf Stellen mit geschütztem Leerzeichen gliedern, wie im Schulbuch.
const fz = (n) => (n >= 10000 ? String(n).replace(/\B(?=(\d{3})+$)/g, ' ') : String(n));
const nullen = (n) => (String(n).match(/0/g) || []).length;
const runde = (n, auf) => Math.round(n / auf) * auf;

const uebertraege = (a, b) => {
  let anzahl = 0, uebertrag = 0;
  while (a > 0 || b > 0) {
    if (a % 10 < b % 10 + uebertrag) { anzahl++; uebertrag = 1; } else uebertrag = 0;
    a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return anzahl;
};
// Typischer Fehler: stellenweise immer die kleinere von der größeren Ziffer abziehen.
const kleinerVonGroesser = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    ergebnis += Math.abs((a % 10) - (b % 10)) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
// Typischer Fehler: entbündeln, aber den Übertrag in der nächsten Stelle nicht abziehen.
const uebertragVergessen = (a, b) => {
  let ergebnis = 0, stelle = 1;
  while (a > 0 || b > 0) {
    const x = a % 10, y = b % 10;
    ergebnis += (x < y ? x + 10 - y : x - y) * stelle;
    stelle *= 10; a = Math.floor(a / 10); b = Math.floor(b / 10);
  }
  return ergebnis;
};
const fehlerliste = (loesung, kandidaten) => {
  const gesehen = new Set([loesung]);
  return kandidaten.filter(([wert]) => {
    if (!Number.isInteger(wert) || wert < 0 || gesehen.has(wert)) return false;
    gesehen.add(wert); return true;
  }).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung }));
};

// ---------- Fehlvorstellungen ----------
const fv = (beschreibung, hinweis) => ({ beschreibung, hinweis });
// beschreibung: für die Diagnose der Lehrkraft. hinweis: Rückmeldung an den Schüler nach dem ersten falschen Versuch.
const fehlvorstellungen = {
  'begriffe-verwechselt': fv('Verwechselt die Fachbegriffe der Rechenart.', 'Schau dir die Fachbegriffe noch einmal an: Welche Zahl steht wo?'),
  'sub-kleiner-von-groesser': fv('Zieht in jeder Stelle die kleinere von der größeren Ziffer ab, statt zu entbündeln.', 'Achte auf die Reihenfolge: Es wird immer die untere von der oberen Ziffer abgezogen. Geht das nicht, musst du entbündeln.'),
  'sub-uebertrag-vergessen': fv('Entbündelt richtig, berücksichtigt den Übertrag in der nächsten Stelle aber nicht.', 'Schau dir deine Überträge noch einmal an. Hast du sie in der nächsten Stelle mitgerechnet?'),
  'sub-addiert': fv('Addiert, statt zu subtrahieren.', 'Schau auf das Rechenzeichen: Hier wird abgezogen.'),
  'sub-klammerfehler': fv('Rechnet a − (b − c) statt a − b − c: Der zweite Subtrahend wird addiert.', 'Jede Zahl hinter einem Minus wird abgezogen. Prüfe, ob du eine davon addiert hast.'),
  'ueberschlag-nicht-gerundet': fv('Rechnet genau, statt mit gerundeten Zahlen zu überschlagen.', 'Du hast genau gerechnet. Beim Überschlag rundest du zuerst und rechnest dann.'),
  'falsch-gerundet': fv('Rundet immer ab, statt nach der Rundungsregel zu runden.', 'Prüfe dein Runden: Bei 5, 6, 7, 8 und 9 wird aufgerundet.'),
  'probe-falsche-umkehr': fv('Wählt für die Probe nicht die Umkehraufgabe.', 'Die Probe ist die Umkehraufgabe. Sie muss wieder zur ersten Zahl der Aufgabe führen.'),
  'div-null-vergessen': fv('Lässt eine Null im Quotienten aus.', 'Passt der Divisor einmal nicht hinein, gehört an diese Stelle eine 0 ins Ergebnis.'),
  'div-stellenwert': fv('Irrt sich beim Stellenwert des Quotienten (eine Null zu viel oder zu wenig).', 'Prüfe mit einem Überschlag, wie viele Stellen dein Ergebnis haben muss.'),
  'div-rest-nicht-gedeutet': fv('Berechnet den Quotienten richtig, deutet den Rest aber nicht im Sachzusammenhang.', 'Deine Rechnung stimmt. Überlege jetzt, was mit dem Rest in dieser Situation passiert.'),
  'div-rest-vergessen': fv('Gibt den Rest nicht oder falsch an.', 'Prüfe den Rest: Was bleibt übrig, wenn du Ergebnis mal Divisor vom Dividenden abziehst?'),
  'sach-falsche-rechnung': fv('Wählt eine Rechnung, die nicht zur Situation passt.', 'Lies die Frage noch einmal: Welche Rechenart passt zu dieser Situation?'),
  'sach-unnoetige-angabe': fv('Verrechnet eine Angabe, die für die Frage nicht gebraucht wird.', 'Nicht jede Zahl im Text wird gebraucht. Welche Angaben gehören wirklich zur Frage?'),
  'sach-schritt-vergessen': fv('Führt nur einen von mehreren nötigen Rechenschritten aus.', 'Du bist noch nicht fertig: Es fehlt noch ein Rechenschritt.'),
};

// ---------- Bausteine ----------
const zahl = (text, loesung, typischeFehler, hilfen, einheit) => ({
  format: 'zahl', text, loesung, ...(einheit ? { einheit } : {}), typischeFehler, hilfen,
});
const auswahl = (text, optionen, hilfen, mehrfach = false) => ({
  format: 'auswahl', text, mehrfach,
  optionen: mische(optionen), hilfen,
});
const opt = (text, richtig = false, fehlvorstellung) => ({ text, richtig, ...(fehlvorstellung ? { fehlvorstellung } : {}) });

const subSchritt = (a, b) => {
  const x = a % 10, y = b % 10;
  return x >= y
    ? `Beginne bei den Einern: ${x} − ${y} = ${x - y}. Schreibe ${x - y} an die Einerstelle und rechne dann die Zehner.`
    : `Beginne bei den Einern: ${x} − ${y} geht nicht. Rechne ${x + 10} − ${y} = ${x + 10 - y} und merke dir den Übertrag 1 für die Zehner.`;
};
const divSchritt = (a, d) => {
  const s = String(a);
  let i = 1;
  while (Number(s.slice(0, i)) < d) i++;
  const p = Number(s.slice(0, i)), k = Math.floor(p / d);
  return `Beginne links: ${p} : ${d} = ${k}, denn ${k} · ${d} = ${k * d}. Es bleibt der Rest ${p - k * d}.`
    + (i < s.length ? ' Hole dann die nächste Ziffer herunter.' : '');
};

// ---------- Zahlen je Niveaustufe ----------
const subZahlen = (niveau) => {
  const regeln = {
    F: [200, 999, (a, b) => uebertraege(a, b) <= 1],
    G: [1000, 9999, (a, b) => uebertraege(a, b) >= 1],
    M: [10000, 99999, (a, b) => uebertraege(a, b) >= 2 && nullen(a) >= 1],
    E: [100000, 9999999, (a, b) => uebertraege(a, b) >= 3 && nullen(a) >= 2],
  }[niveau];
  const [von, bis, passt] = regeln;
  return suche(() => {
    const a = zz(von, bis);
    return [a, zz(Math.floor(von / 10) + 3, a - Math.floor(von / 10))];
  }, ([a, b]) => b > 0 && a - b > 0 && passt(a, b));
};
const subFehler = (a, b) => fehlerliste(a - b, [
  [kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'],
  [uebertragVergessen(a, b), 'sub-uebertrag-vergessen'],
  [a + b, 'sub-addiert'],
]);

const divEinstellig = (niveau) => {
  const d = niveau === 'E' ? zz(6, 9) : zz(2, 9);
  const q = {
    F: () => zz(12, 99),
    G: () => suche(() => zz(112, 999), (x) => nullen(x) === 0),
    M: () => suche(() => zz(1020, 9909), (x) => nullen(x) >= 1),
    E: () => suche(() => zz(10020, 99909), (x) => nullen(x) >= 1),
  }[niveau]();
  return [q * d, d, q];
};
const divZweistellig = (niveau) => {
  const d = { F: () => zz(1, 9) * 10, G: () => zz(11, 25), M: () => zz(26, 99), E: () => zz(26, 99) }[niveau]();
  const q = {
    F: () => zz(12, 99),
    G: () => zz(12, 99),
    M: () => zz(101, 999),
    E: () => suche(() => zz(1001, 9999), (x) => nullen(x) >= 1),
  }[niveau]();
  return [q * d, d, q];
};
const divFehler = (q) => fehlerliste(q, [
  ...(nullen(q) ? [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen']] : []),
  [q * 10, 'div-stellenwert'],
]);

// ---------- Aufgaben sammeln ----------
const aufgaben = [];
const gruppe = (lernziel, niveau, erzeuge) => {
  const texte = new Set();
  let i = 0, versuche = 0;
  while (i < PRO_GRUPPE) {
    if (++versuche > 1000) throw new Error(`Zu wenige verschiedene Aufgaben für ${lernziel} ${niveau}`);
    const a = erzeuge(i);
    const schluessel = a.text + JSON.stringify(a.optionen ?? '') + JSON.stringify([a.strahl, a.tabelle, a.diagramm, a.paare].filter(Boolean));
    if (texte.has(schluessel)) continue;
    texte.add(schluessel);
    aufgaben.push({ id: `${lernziel}-${niveau}-${String(++i).padStart(2, '0')}`, lernziel, niveau, afb: a.afb ?? afbVon(lernziel, niveau), ...a });
  }
};
const NIVEAUS = ['F', 'G', 'M', 'E'];

// Anforderungsbereich (AFB I Reproduzieren, II Zusammenhänge herstellen, III Verallgemeinern und Reflektieren).
// Faustregel je Lernziel und Niveaustufe; eine einzelne Aufgabe kann mit `afb` davon abweichen.
function afbVon(lernziel, niveau) {
  const kurz = lernziel.split('-').pop();
  const schwer = niveau === 'M' || niveau === 'E';
  if (['S2', 'S3', 'D2', 'D3', 'K1', 'K2', 'A2', 'A3'].includes(kurz)) return 1;            // Rechnen nach Verfahren, im Kopf oder schriftlich
  if (kurz === 'B1') return niveau === 'E' ? 2 : 1;                                         // Klammern berechnen
  if (['S1', 'D1', 'S4', 'D4', 'D5', 'K3', 'A1', 'A4', 'R1', 'R2'].includes(kurz)) return schwer ? 2 : 1; // Fachbegriffe, Überschlag und Probe, Rest deuten, geschickt rechnen, Rechengesetze
  return niveau === 'E' ? 3 : 2;                                                            // Sachaufgaben, Rechenausdrücke aufstellen
}

// =====================================================================
// 3.3 Subtrahieren
// =====================================================================
const S = (kurz) => `5.3.3-${kurz}`;

// ----- S1 Fachbegriffe -----
const subBegriffe = 'In einer Subtraktion heißt die erste Zahl Minuend, die Zahl, die abgezogen wird, Subtrahend und das Ergebnis Differenz.';
gruppe(S('S1'), 'F', (i) => {
  const [a, b] = suche(() => { const x = zz(40, 99); return [x, zz(11, x - 11)]; }, ([x, y]) => x - y !== y);
  const r = a - b;
  const hilfen = {
    tipp: 'Minuend − Subtrahend = Differenz.',
    beispiel: 'In 70 − 20 = 50 ist 70 der Minuend, 20 der Subtrahend und 50 die Differenz.',
    loesungsschritt: `Schau auf die Reihenfolge: ${a} steht vorn und ist der Minuend.`,
  };
  if (i >= 4) {
    return { format: 'zuordnen', text: `Ordne die Fachbegriffe zu: ${a} − ${b} = ${r}`,
      paare: [{ links: String(a), rechts: 'Minuend' }, { links: String(b), rechts: 'Subtrahend' }, { links: String(r), rechts: 'Differenz' }], hilfen };
  }
  const [wert, richtig] = [[a, 'Minuend'], [b, 'Subtrahend'], [r, 'Differenz']][i % 3];
  return auswahl(`${a} − ${b} = ${r}. Wie heißt die Zahl ${wert}?`,
    ['Minuend', 'Subtrahend', 'Differenz', 'Summand'].map((t) => opt(t, t === richtig, t === richtig ? undefined : 'begriffe-verwechselt')), hilfen);
});
gruppe(S('S1'), 'G', () => {
  const a = zz(120, 999), b = zz(25, a - 20);
  return zahl(`Der Minuend ist ${a}, der Subtrahend ist ${b}. Berechne die Differenz.`, a - b,
    fehlerliste(a - b, [[a + b, 'begriffe-verwechselt']]),
    { tipp: subBegriffe, beispiel: 'Minuend 90, Subtrahend 30: 90 − 30 = 60. Die Differenz ist 60.', loesungsschritt: `Die Rechnung lautet ${a} − ${b}.` });
});
gruppe(S('S1'), 'M', () => {
  const d = zz(120, 900), b = zz(35, 600);
  return zahl(`Die Differenz ist ${d}, der Subtrahend ist ${b}. Wie groß ist der Minuend?`, d + b,
    fehlerliste(d + b, [[d - b, 'begriffe-verwechselt']]),
    { tipp: 'Minuend − Subtrahend = Differenz. Gesucht ist die erste Zahl.', beispiel: 'Differenz 40, Subtrahend 25: ? − 25 = 40. Der Minuend ist 40 + 25 = 65.',
      loesungsschritt: `Schreibe ? − ${b} = ${d}. Den Minuenden findest du mit der Umkehraufgabe ${d} + ${b}.` });
});
gruppe(S('S1'), 'E', () => {
  const a = zz(300, 900), b = zz(100, a - 60), c = zz(a - b + 50, 2000);
  return zahl(`Subtrahiere die Differenz der Zahlen ${a} und ${b} von der Zahl ${c}.`, c - (a - b),
    fehlerliste(c - (a - b), [[c - a - b, 'sub-klammerfehler'], [a - b, 'sach-schritt-vergessen']]),
    { tipp: 'Berechne zuerst die Differenz der beiden Zahlen. Ziehe sie danach von der dritten Zahl ab.',
      beispiel: 'Subtrahiere die Differenz von 50 und 20 von 100: 50 − 20 = 30, dann 100 − 30 = 70.',
      loesungsschritt: `Berechne zuerst die Differenz: ${a} − ${b} = ${a - b}.` });
});

// ----- S2 Schriftlich subtrahieren -----
for (const niveau of NIVEAUS) {
  gruppe(S('S2'), niveau, () => {
    const [a, b] = subZahlen(niveau);
    return zahl(`Subtrahiere schriftlich: ${fz(a)} − ${fz(b)}`, a - b, subFehler(a, b), {
      tipp: 'Schreibe die Zahlen stellengerecht untereinander und beginne bei den Einern.',
      beispiel: '532 − 218: Einer 12 − 8 = 4 (Übertrag 1), Zehner 3 − 1 − 1 = 1, Hunderter 5 − 2 = 3. Ergebnis 314.',
      loesungsschritt: subSchritt(a, b),
    });
  });
}

// ----- S3 Mehrere Zahlen subtrahieren -----
for (const niveau of NIVEAUS) {
  gruppe(S('S3'), niveau, () => {
    const anzahl = { F: 2, G: 2, M: 3, E: 4 }[niveau];
    const [von, bis] = { F: [400, 999], G: [2000, 9999], M: [20000, 99999], E: [200000, 999999] }[niveau];
    const a = zz(von, bis);
    const sub = suche(() => Array.from({ length: anzahl }, () => zz(Math.floor(von / 20), Math.floor(a / anzahl))),
      (x) => a - x.reduce((s, y) => s + y, 0) > 0 && x[0] > x[1]);
    const summe = sub.reduce((s, y) => s + y, 0);
    const loesung = a - summe;
    return zahl(`Berechne: ${[a, ...sub].map(fz).join(' − ')}`, loesung,
      fehlerliste(loesung, [[loesung + 2 * sub[1], 'sub-klammerfehler'], [a - sub[0], 'sach-schritt-vergessen']]),
      { tipp: 'Du darfst die Subtrahenden zuerst addieren und dann ihre Summe auf einmal abziehen.',
        beispiel: '900 − 250 − 150: Die Subtrahenden ergeben zusammen 400. 900 − 400 = 500.',
        loesungsschritt: `Addiere zuerst die Subtrahenden: ${sub.map(fz).join(' + ')} = ${fz(summe)}. Ziehe diese Summe dann von ${fz(a)} ab.` });
  });
}

// ----- S4 Überschlag und Probe -----
const falscheRechnungen = (rechnungen, text, hilfen) => auswahl(text,
  rechnungen.map(([t, falsch]) => opt(t, falsch)), hilfen, true);

gruppe(S('S4'), 'F', () => {
  const [a, b] = subZahlen('F'), r = a - b;
  return auswahl(`Mit welcher Rechnung machst du die Probe zu ${a} − ${b} = ${r}?`, [
    opt(`${r} + ${b} = ${a}`, true),
    opt(`${a} + ${b} = ${a + b}`, false, 'probe-falsche-umkehr'),
    opt(`${a} − ${r} = ${b}`, false, 'probe-falsche-umkehr'),
    opt(`${a} + ${r} = ${a + r}`, false, 'probe-falsche-umkehr'),
  ], { tipp: 'Die Probe ist die Umkehraufgabe: Aus Minus wird Plus.',
    beispiel: 'Probe zu 80 − 30 = 50: 50 + 30 = 80. Das Ergebnis und der Subtrahend ergeben wieder den Minuenden.',
    loesungsschritt: `Beginne mit dem Ergebnis ${r} und addiere die Zahl, die abgezogen wurde.` });
});
gruppe(S('S4'), 'G', () => {
  const [a, b] = suche(() => subZahlen('G'), ([x, y]) => x % 100 !== 0 && y % 100 !== 0 && runde(x, 100) > runde(y, 100) && y >= 150);
  const loesung = runde(a, 100) - runde(b, 100);
  return zahl(`Überschlage: Runde beide Zahlen auf Hunderter und rechne dann. ${a} − ${b} ≈ ?`, loesung,
    fehlerliste(loesung, [[a - b, 'ueberschlag-nicht-gerundet'], [Math.floor(a / 100) * 100 - Math.floor(b / 100) * 100, 'falsch-gerundet']]),
    { tipp: 'Schau auf die Zehnerziffer: Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.',
      beispiel: '4782 − 1319: 4782 wird zu 4800, 1319 wird zu 1300. 4800 − 1300 = 3500.',
      loesungsschritt: `Runde zuerst den Minuenden: ${a} ≈ ${runde(a, 100)}.` });
});
gruppe(S('S4'), 'M', () => {
  const anzahlFalsch = zz(1, 2);
  const rechnungen = Array.from({ length: 4 }, (_, k) => {
    const [a, b] = subZahlen('G');
    const falsch = k < anzahlFalsch;
    const r = a - b + (falsch ? wahl([10, -10, 100, -100]) : 0);
    return [`${a} − ${b} = ${r}`, falsch];
  });
  return falscheRechnungen(rechnungen, 'Prüfe mit der Probe: Welche Rechnungen sind falsch? Es können mehrere sein.',
    { tipp: 'Addiere jeweils das Ergebnis und den Subtrahenden. Kommt nicht der Minuend heraus, ist die Rechnung falsch.',
      beispiel: '734 − 258 = 486? Probe: 486 + 258 = 744. Das ist nicht 734, also ist die Rechnung falsch.',
      loesungsschritt: 'Rechne für die erste Rechnung die Probe: Ergebnis plus Subtrahend.' });
});
gruppe(S('S4'), 'E', () => {
  const anzahlFalsch = zz(2, 3);
  const rechnungen = Array.from({ length: 5 }, (_, k) => {
    const [a, b] = suche(() => subZahlen('M'), ([x, y]) => x - y > 20000);
    const falsch = k < anzahlFalsch;
    const r = a - b + (falsch ? wahl([10000, -10000]) : 0);
    return [`${fz(a)} − ${fz(b)} = ${fz(r)}`, falsch];
  });
  return falscheRechnungen(rechnungen, 'Prüfe nur mit einem Überschlag, ohne genau zu rechnen: Welche Ergebnisse können nicht stimmen? Es können mehrere sein.',
    { tipp: 'Runde beide Zahlen auf Tausender und vergleiche deinen Überschlag mit dem angegebenen Ergebnis.',
      beispiel: '52 310 − 18 790 = 43 520? Überschlag: 52 000 − 19 000 = 33 000. Das Ergebnis liegt weit daneben, es kann nicht stimmen.',
      loesungsschritt: 'Überschlage die erste Rechnung mit auf Tausender gerundeten Zahlen und vergleiche.' });
});

// ----- S5 Sachaufgaben -----
const subKontexte = {
  F: [
    [(a, b) => `Im Kino gibt es ${a} Plätze. ${b} Plätze sind schon besetzt. Wie viele Plätze sind noch frei?`, 'Plätze', 150, 600],
    [(a, b) => `Ein Fahrrad kostet ${a} €. Mila hat schon ${b} € gespart. Wie viel Geld fehlt ihr noch?`, '€', 250, 900],
    [(a, b) => `Ein Buch hat ${a} Seiten. Jonas hat schon ${b} Seiten gelesen. Wie viele Seiten muss er noch lesen?`, 'Seiten', 180, 640],
    [(a, b) => `Der Wanderweg ist ${a} km lang. Die Gruppe ist schon ${b} km gewandert. Wie viele Kilometer liegen noch vor ihr?`, 'km', 110, 320],
    [(a, b) => `Ein Turm ist ${a} m hoch, das Rathaus daneben ${b} m. Wie viele Meter ist der Turm höher?`, 'm', 120, 360],
    [(a, b) => `In der Schulbücherei stehen ${a} Bücher. ${b} davon sind gerade ausgeliehen. Wie viele Bücher stehen im Regal?`, 'Bücher', 400, 990],
    [(a, b) => `Ein Bäcker hat ${a} Brötchen gebacken. Bis zum Mittag verkauft er ${b}. Wie viele Brötchen sind noch da?`, 'Brötchen', 300, 800],
  ],
  G: [
    [(a, b) => `Im Stadion gibt es ${a} Plätze. ${b} Karten wurden verkauft. Wie viele Plätze bleiben frei?`, 'Plätze', 4000, 9900],
    [(a, b) => `Ein gebrauchtes Auto kostet ${a} €. Familie Yilmaz hat ${b} € gespart. Wie viel Geld fehlt noch?`, '€', 5000, 9800],
    [(a, b) => `Die Zugspitze ist 2962 m hoch. Eine Hütte liegt auf ${b} m Höhe. Wie viele Höhenmeter sind es von der Hütte bis zum Gipfel?`, 'm', 2962, 2962],
    [(a, b) => `Ein Lkw darf ${a} kg laden. ${b} kg sind schon geladen. Wie viele Kilogramm dürfen noch dazu?`, 'kg', 3500, 9000],
    [(a, b) => `Ein Freibad hatte im Juli ${a} Besucher. Im August waren es ${b} Besucher weniger. Wie viele Besucher kamen im August?`, 'Besucher', 6000, 9900],
    [(a, b) => `Ein Flug ist ${a} km lang. ${b} km sind schon geschafft. Wie viele Kilometer sind es noch?`, 'km', 2000, 9500],
    [(a, b) => `Eine Fabrik soll ${a} Schrauben liefern. ${b} sind schon fertig. Wie viele Schrauben fehlen noch?`, 'Schrauben', 3000, 9900],
  ],
};
for (const niveau of ['F', 'G']) {
  gruppe(S('S5'), niveau, (i) => {
    const [text, einheit, von, bis] = subKontexte[niveau][i % subKontexte[niveau].length];
    const a = zz(von, bis), b = zz(Math.floor(a / 5), a - Math.floor(a / 6));
    return zahl(text(a, b), a - b, fehlerliste(a - b, [[a + b, 'sach-falsche-rechnung'], [uebertragVergessen(a, b), 'sub-uebertrag-vergessen']]),
      { tipp: 'Gesucht ist ein Unterschied oder ein Rest. Dazu ziehst du die kleinere Zahl von der größeren ab.',
        beispiel: '300 Plätze, 120 besetzt: 300 − 120 = 180 Plätze sind frei.',
        loesungsschritt: `Die Rechnung lautet ${a} − ${b}. ${subSchritt(a, b)}` }, einheit);
  });
}
const teil = (text, loesung, einheit, typischeFehler = []) => ({ format: 'zahl', text, loesung, einheit, typischeFehler });
const subZweischritt = [
  (a, b, c) => ({ text: `Auf dem Konto eines Sportvereins sind ${fz(a)} €. Zuerst bezahlt der Verein ${fz(b)} € für neue Tore, danach ${fz(c)} € für einen Rasenmäher.`,
    teile: [teil('Wie viel Geld ist nach dem Kauf der Tore noch auf dem Konto?', a - b, '€'), teil('Wie viel Geld ist nach dem Kauf des Rasenmähers noch auf dem Konto?', a - b - c, '€', fehlerliste(a - b - c, [[a - c, 'sach-schritt-vergessen']]))] }),
  (a, b, c) => ({ text: `Ein Schiff hat ${fz(a)} Container geladen. Im ersten Hafen werden ${fz(b)} Container entladen, im zweiten Hafen ${fz(c)}.`,
    teile: [teil('Wie viele Container sind nach dem ersten Hafen noch an Bord?', a - b, 'Container'), teil('Wie viele Container sind nach dem zweiten Hafen noch an Bord?', a - b - c, 'Container', fehlerliste(a - b - c, [[a - c, 'sach-schritt-vergessen']]))] }),
  (a, b, c) => ({ text: `Eine Radtour ist ${fz(a)} m lang. Bis zur ersten Pause fährt die Klasse ${fz(b)} m, bis zur zweiten Pause weitere ${fz(c)} m.`,
    teile: [teil('Wie viele Meter sind es nach der ersten Pause noch?', a - b, 'm'), teil('Wie viele Meter sind es nach der zweiten Pause noch?', a - b - c, 'm', fehlerliste(a - b - c, [[a - c, 'sach-schritt-vergessen']]))] }),
];
gruppe(S('S5'), 'M', (i) => {
  const a = zz(12000, 48000), b = zz(2500, Math.floor(a / 2)), c = zz(1200, Math.floor(a / 3));
  return { format: 'sachaufgabe', ...subZweischritt[i % 3](a, b, c),
    hilfen: { tipp: 'Rechne Schritt für Schritt: Das Ergebnis der ersten Frage brauchst du für die zweite.',
      beispiel: '1000 € auf dem Konto, erst 300 € weg, dann 200 € weg: 1000 − 300 = 700, dann 700 − 200 = 500.',
      loesungsschritt: `Für die erste Frage rechnest du ${fz(a)} − ${fz(b)}.` } };
});
const subMitUnnoetig = [
  (a, b, c, n) => [`Ein Wasserspeicher fasst ${fz(a)} Liter. Im Juli werden ${fz(b)} Liter entnommen, im August ${fz(c)} Liter. Der Speicher ist ${n} Jahre alt. Wie viele Liter sind Ende August noch im Speicher, wenn er Anfang Juli voll war?`, 'Liter'],
  (a, b, c, n) => [`Eine Stadt hat ${fz(a)} € für ihre Spielplätze eingeplant. Für neue Geräte zahlt sie ${fz(b)} €, für die Bepflanzung ${fz(c)} €. In der Stadt gibt es ${n} Spielplätze. Wie viel Geld ist noch übrig?`, '€'],
  (a, b, c, n) => [`Eine Druckerei soll ${fz(a)} Hefte drucken. Am Montag druckt sie ${fz(b)} Hefte, am Dienstag ${fz(c)}. Jedes Heft hat ${n} Seiten. Wie viele Hefte fehlen noch?`, 'Hefte'],
];
gruppe(S('S5'), 'E', (i) => {
  const a = zz(150000, 900000), b = zz(20000, Math.floor(a / 3)), c = zz(15000, Math.floor(a / 3)), n = zz(24, 96);
  const [text, einheit] = subMitUnnoetig[i % 3](a, b, c, n);
  const loesung = a - b - c;
  return zahl(text, loesung, fehlerliste(loesung, [[a - b, 'sach-schritt-vergessen'], [loesung - n, 'sach-unnoetige-angabe'], [a - b + c, 'sub-klammerfehler']]),
    { tipp: 'Nicht jede Zahl im Text wird gebraucht. Überlege, welche Angaben zur Frage gehören.',
      beispiel: '5000 € sind eingeplant, 1200 € und 800 € werden ausgegeben, es gibt 40 Spielplätze: 5000 − 1200 − 800 = 3000 €. Die 40 braucht man nicht.',
      loesungsschritt: `Ziehe zuerst die erste Menge ab: ${fz(a)} − ${fz(b)} = ${fz(a - b)}.` }, einheit);
});

// =====================================================================
// 4.5 Dividieren (eigene Datei, nach den Regeln aus docs/adr/0009)
// =====================================================================
saat = 54554554;
Object.assign(fehlvorstellungen, fehlvorstellungenDiv);
dividieren({ gruppe, zahl, auswahl, opt, zz, wahl, suche, fz, fehlerliste, teil });

// ---------- Schreiben ----------
// =====================================================================
// Übrige Stationen von Kapitel 3 (eigene Datei, eigene Saat: Die Aufgaben oben bleiben dadurch unverändert.)
// =====================================================================
saat = 53053053;
Object.assign(fehlvorstellungen, fehlvorstellungen53);
kapitel53({ gruppe, zahl, auswahl, opt, zz, wahl, suche, fz, fehlerliste, runde, NIVEAUS, teil, kleinerVonGroesser, uebertragVergessen });

const pool = {
  version: 2,
  klassenstufe: 5,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt 5 (Klett)',
  fehlvorstellungen,
  kapitel,
  aufgaben,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben.`);
