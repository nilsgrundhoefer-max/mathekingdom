// Erzeugt aufgabenpool/klasse-5.json.
// Aufruf: node tools/erzeuge-klasse-5.mjs
// Der Zufall ist fest geimpft: Gleicher Code ergibt immer dieselbe Datei.

import { writeFileSync, mkdirSync } from 'node:fs';
import { kapitel } from './jahresplan-klasse-5.mjs';

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
const fehlvorstellungen = {
  'begriffe-verwechselt': 'Verwechselt die Fachbegriffe der Rechenart.',
  'sub-kleiner-von-groesser': 'Zieht in jeder Stelle die kleinere von der größeren Ziffer ab, statt zu entbündeln.',
  'sub-uebertrag-vergessen': 'Entbündelt richtig, berücksichtigt den Übertrag in der nächsten Stelle aber nicht.',
  'sub-addiert': 'Addiert, statt zu subtrahieren.',
  'sub-klammerfehler': 'Rechnet a − (b − c) statt a − b − c: Der zweite Subtrahend wird addiert.',
  'ueberschlag-nicht-gerundet': 'Rechnet genau, statt mit gerundeten Zahlen zu überschlagen.',
  'falsch-gerundet': 'Rundet immer ab, statt nach der Rundungsregel zu runden.',
  'probe-falsche-umkehr': 'Wählt für die Probe nicht die Umkehraufgabe.',
  'div-null-vergessen': 'Lässt eine Null im Quotienten aus.',
  'div-stellenwert': 'Irrt sich beim Stellenwert des Quotienten (eine Null zu viel oder zu wenig).',
  'div-rest-nicht-gedeutet': 'Berechnet den Quotienten richtig, deutet den Rest aber nicht im Sachzusammenhang.',
  'div-rest-vergessen': 'Gibt den Rest nicht oder falsch an.',
  'sach-falsche-rechnung': 'Wählt eine Rechnung, die nicht zur Situation passt.',
  'sach-unnoetige-angabe': 'Verrechnet eine Angabe, die für die Frage nicht gebraucht wird.',
  'sach-schritt-vergessen': 'Führt nur einen von mehreren nötigen Rechenschritten aus.',
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
    const schluessel = a.text + JSON.stringify(a.optionen ?? '');
    if (texte.has(schluessel)) continue;
    texte.add(schluessel);
    aufgaben.push({ id: `${lernziel}-${niveau}-${String(++i).padStart(2, '0')}`, lernziel, niveau, ...a });
  }
};
const NIVEAUS = ['F', 'G', 'M', 'E'];

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
// 4.5 Dividieren
// =====================================================================
const D = (kurz) => `5.4.5-${kurz}`;

// ----- D1 Fachbegriffe -----
const divBegriffe = 'In einer Division heißt die Zahl, die geteilt wird, Dividend, die Zahl, durch die geteilt wird, Divisor und das Ergebnis Quotient.';
gruppe(D('D1'), 'F', (i) => {
  const d = zz(3, 9), q = suche(() => zz(4, 12), (x) => x !== d), a = q * d;
  const hilfen = { tipp: 'Dividend : Divisor = Quotient.',
    beispiel: 'In 20 : 4 = 5 ist 20 der Dividend, 4 der Divisor und 5 der Quotient.',
    loesungsschritt: `Schau auf die Reihenfolge: ${a} steht vorn und ist der Dividend.` };
  if (i >= 4) {
    return { format: 'zuordnen', text: `Ordne die Fachbegriffe zu: ${a} : ${d} = ${q}`,
      paare: [{ links: String(a), rechts: 'Dividend' }, { links: String(d), rechts: 'Divisor' }, { links: String(q), rechts: 'Quotient' }], hilfen };
  }
  const [wert, richtig] = [[a, 'Dividend'], [d, 'Divisor'], [q, 'Quotient']][i % 3];
  return auswahl(`${a} : ${d} = ${q}. Wie heißt die Zahl ${wert}?`,
    ['Dividend', 'Divisor', 'Quotient', 'Faktor'].map((t) => opt(t, t === richtig, t === richtig ? undefined : 'begriffe-verwechselt')), hilfen);
});
gruppe(D('D1'), 'G', () => {
  const d = zz(3, 9), q = zz(11, 60);
  return zahl(`Der Dividend ist ${q * d}, der Divisor ist ${d}. Berechne den Quotienten.`, q,
    fehlerliste(q, [[q * d * d, 'begriffe-verwechselt']]),
    { tipp: divBegriffe, beispiel: 'Dividend 60, Divisor 5: 60 : 5 = 12. Der Quotient ist 12.', loesungsschritt: `Die Rechnung lautet ${q * d} : ${d}.` });
});
gruppe(D('D1'), 'M', () => {
  const d = zz(4, 12), q = zz(15, 90);
  return zahl(`Der Quotient ist ${q}, der Divisor ist ${d}. Wie groß ist der Dividend?`, q * d,
    fehlerliste(q * d, [...(q % d === 0 ? [[q / d, 'begriffe-verwechselt']] : []), [q + d, 'begriffe-verwechselt']]),
    { tipp: 'Dividend : Divisor = Quotient. Gesucht ist die erste Zahl.', beispiel: 'Quotient 7, Divisor 6: ? : 6 = 7. Der Dividend ist 7 · 6 = 42.',
      loesungsschritt: `Schreibe ? : ${d} = ${q}. Den Dividenden findest du mit der Umkehraufgabe ${q} · ${d}.` });
});
gruppe(D('D1'), 'E', (i) => {
  const c = zz(4, 12), q = zz(25, 120), summe = q * c;
  if (i % 2 === 0) {
    const b = suche(() => zz(2, Math.floor(summe / c) - 2) * c, (x) => x > 0 && x < summe), a = summe - b;
    return zahl(`Dividiere die Summe der Zahlen ${a} und ${b} durch ${c}.`, q,
      fehlerliste(q, [[a + b / c, 'sach-schritt-vergessen']]),
      { tipp: 'Berechne zuerst die Summe. Teile danach das Ergebnis.', beispiel: 'Dividiere die Summe von 30 und 18 durch 6: 30 + 18 = 48, dann 48 : 6 = 8.',
        loesungsschritt: `Berechne zuerst die Summe: ${a} + ${b} = ${summe}.` });
  }
  const b = zz(40, 400), a = summe + b;
  return zahl(`Dividiere die Differenz der Zahlen ${a} und ${b} durch ${c}.`, q,
    fehlerliste(q, [[(a + b) % c === 0 ? (a + b) / c : -1, 'begriffe-verwechselt']]),
    { tipp: 'Berechne zuerst die Differenz. Teile danach das Ergebnis.', beispiel: 'Dividiere die Differenz von 80 und 24 durch 7: 80 − 24 = 56, dann 56 : 7 = 8.',
      loesungsschritt: `Berechne zuerst die Differenz: ${a} − ${b} = ${summe}.` });
});

// ----- D2 und D3 Schriftlich dividieren -----
for (const [kurz, zahlen, beispiel] of [
  ['D2', divEinstellig, '852 : 4: 8 : 4 = 2, dann 5 : 4 = 1 Rest 1, dann 12 : 4 = 3. Ergebnis 213.'],
  ['D3', divZweistellig, '756 : 21: 75 : 21 = 3, denn 3 · 21 = 63, Rest 12. Dann 126 : 21 = 6. Ergebnis 36.'],
]) {
  for (const niveau of NIVEAUS) {
    gruppe(D(kurz), niveau, () => {
      const [a, d, q] = zahlen(niveau);
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, divFehler(q), {
        tipp: kurz === 'D2'
          ? 'Beginne links bei der größten Stelle. Passt der Divisor nicht hinein, nimm die nächste Ziffer dazu.'
          : 'Überschlage bei jedem Schritt, wie oft der Divisor hineinpasst, und prüfe mit einer Multiplikation.',
        beispiel, loesungsschritt: divSchritt(a, d),
      });
    });
  }
}

// ----- D4 Division mit Rest -----
for (const niveau of ['F', 'G']) {
  gruppe(D('D4'), niveau, () => {
    const d = zz(3, 9);
    const a = suche(() => (niveau === 'F' ? zz(20, 99) : zz(100, 999)), (x) => x % d !== 0);
    const q = Math.floor(a / d), r = a % d;
    return { format: 'luecken', text: `${a} : ${d} = {{q}} Rest {{r}}`,
      luecken: { q: { loesung: q, typischeFehler: fehlerliste(q, [[q + 1, 'div-rest-vergessen']]) }, r: { loesung: r, typischeFehler: fehlerliste(r, [[0, 'div-rest-vergessen']]) } },
      hilfen: { tipp: 'Suche die größte Zahl, die mit dem Divisor malgenommen noch in den Dividenden passt. Was übrig bleibt, ist der Rest.',
        beispiel: '47 : 6: 7 · 6 = 42 passt, 8 · 6 = 48 ist zu viel. Also 7 Rest 5.',
        loesungsschritt: niveau === 'F' ? `${q} · ${d} = ${q * d}. Wie viel fehlt noch bis ${a}?` : divSchritt(a, d) } };
  });
}
const aufrunden = [
  [(a, d) => `${a} Personen fahren mit Kleinbussen zum Ausflug. In jeden Kleinbus passen ${d} Personen. Wie viele Kleinbusse werden mindestens gebraucht?`, 'Kleinbusse', 'Auch die Personen, die übrig bleiben, brauchen einen Kleinbus.'],
  [(a, d) => `${a} Eier sollen verpackt werden. In einen Karton passen ${d} Eier. Wie viele Kartons braucht man, damit alle Eier verpackt sind?`, 'Kartons', 'Auch die Eier, die übrig bleiben, brauchen einen Karton.'],
  [(a, d) => `${a} Kinder zelten. In ein Zelt passen ${d} Kinder. Wie viele Zelte werden mindestens gebraucht?`, 'Zelte', 'Auch die Kinder, die übrig bleiben, brauchen ein Zelt.'],
  [(a, d) => `In eine Gondel der Seilbahn passen ${d} Personen. ${a} Personen warten an der Talstation. Wie viele Gondeln werden mindestens gebraucht?`, 'Gondeln', 'Auch die Personen, die übrig bleiben, brauchen eine Gondel.'],
  [(a, d) => `${a} Fotos sollen in ein Album geklebt werden. Auf eine Seite passen ${d} Fotos. Wie viele Seiten werden gebraucht?`, 'Seiten', 'Auch die Fotos, die übrig bleiben, brauchen eine Seite.'],
  [(a, d) => `${a} Flaschen werden in Kästen gestellt. In einen Kasten passen ${d} Flaschen. Wie viele Kästen braucht man für alle Flaschen?`, 'Kästen', 'Auch die Flaschen, die übrig bleiben, brauchen einen Kasten.'],
];
const aufrundenGross = [
  [(a, d) => `${a} Fans reisen mit Bussen zum Auswärtsspiel. In jeden Bus passen ${d} Fans. Wie viele Busse werden mindestens gebraucht?`, 'Busse', 'Auch die Fans, die übrig bleiben, brauchen einen Bus.'],
  [(a, d) => `${a} Bücher werden in Kartons verpackt. In einen Karton passen ${d} Bücher. Wie viele Kartons braucht man für alle Bücher?`, 'Kartons', 'Auch die Bücher, die übrig bleiben, brauchen einen Karton.'],
  [(a, d) => `${a} Liter Saft werden in Fässer zu je ${d} Litern abgefüllt. Wie viele Fässer braucht man für den ganzen Saft?`, 'Fässer', 'Auch der Saft, der übrig bleibt, braucht ein Fass.'],
];
const abrunden = [
  (a, d) => [`Ein ${fz(a)} cm langes Band wird in Stücke von ${d} cm geschnitten.`, 'Wie viele ganze Stücke entstehen?', 'Stücke', 'Wie viele Zentimeter bleiben übrig?', 'cm'],
  (a, d) => [`${fz(a)} Äpfel werden in Kisten zu je ${d} Äpfeln gepackt. Nur volle Kisten werden verkauft.`, 'Wie viele Kisten können verkauft werden?', 'Kisten', 'Wie viele Äpfel bleiben übrig?', 'Äpfel'],
  (a, d) => [`Eine Bücherei hat ${fz(a)} € für neue Bücher. Ein Buch kostet ${d} €.`, 'Wie viele Bücher kann sie kaufen?', 'Bücher', 'Wie viel Geld bleibt übrig?', '€'],
];
gruppe(D('D4'), 'M', (i) => {
  const d = wahl([6, 7, 8, 9, 12]);
  const a = suche(() => zz(60, 300), (x) => x % d !== 0);
  const q = Math.floor(a / d);
  const [text, einheit, deutung] = aufrunden[i % aufrunden.length];
  return zahl(text(a, d), q + 1, fehlerliste(q + 1, [[q, 'div-rest-nicht-gedeutet']]),
    { tipp: `Rechne mit Rest und überlege dann, was der Rest in der Situation bedeutet. ${deutung}`,
      beispiel: '50 Kinder, 8 pro Zelt: 50 : 8 = 6 Rest 2. Die 2 Kinder brauchen auch ein Zelt, also 7 Zelte.',
      loesungsschritt: `Rechne zuerst ${a} : ${d} = ${q} Rest ${a % d}.` }, einheit);
});
gruppe(D('D4'), 'E', (i) => {
  const d = zz(13, 48);
  const a = suche(() => zz(1200, 9800), (x) => x % d !== 0);
  const q = Math.floor(a / d), r = a % d;
  const hilfenRest = (zusatz) => ({ tipp: `Rechne mit Rest und überlege dann, was der Rest in der Situation bedeutet. ${zusatz}`,
    beispiel: '500 cm Band, Stücke von 60 cm: 500 : 60 = 8 Rest 20. Es entstehen 8 ganze Stücke, 20 cm bleiben übrig.',
    loesungsschritt: divSchritt(a, d) });
  if (i % 2 === 0) {
    const [text, f1, e1, f2, e2] = abrunden[(i / 2) % abrunden.length](a, d);
    return { format: 'sachaufgabe', text,
      teile: [teil(f1, q, e1, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet']])), teil(f2, r, e2, fehlerliste(r, [[0, 'div-rest-vergessen']]))],
      hilfen: hilfenRest('Hier zählt nur, was vollständig ist.') };
  }
  const [text, einheit, deutung] = aufrundenGross[((i - 1) / 2) % aufrundenGross.length];
  return zahl(text(fz(a), d), q + 1, fehlerliste(q + 1, [[q, 'div-rest-nicht-gedeutet']]), hilfenRest(deutung), einheit);
});

// ----- D5 Überschlag und Probe -----
gruppe(D('D5'), 'F', () => {
  const [a, d, q] = divEinstellig('F');
  return auswahl(`Mit welcher Rechnung machst du die Probe zu ${a} : ${d} = ${q}?`, [
    opt(`${q} · ${d} = ${a}`, true),
    opt(`${a} · ${d} = ${a * d}`, false, 'probe-falsche-umkehr'),
    opt(`${a} − ${d} = ${a - d}`, false, 'probe-falsche-umkehr'),
    opt(`${q} + ${d} = ${q + d}`, false, 'probe-falsche-umkehr'),
  ], { tipp: 'Die Probe ist die Umkehraufgabe: Aus Geteilt wird Mal.',
    beispiel: 'Probe zu 84 : 4 = 21: 21 · 4 = 84. Quotient mal Divisor ergibt wieder den Dividenden.',
    loesungsschritt: `Beginne mit dem Ergebnis ${q} und multipliziere mit der Zahl, durch die geteilt wurde.` });
});
gruppe(D('D5'), 'G', () => {
  const d = zz(3, 9), k = zz(2, 9), basis = k * d * 100;
  const a = basis + wahl([-1, 1]) * zz(11, 39);
  const daneben = k > 5 ? k - 3 : k + 3;
  return auswahl(`Überschlage: ${a} : ${d} ≈ ?`, [
    opt(String(k * 100), true),
    opt(String(k * 10), false, 'div-stellenwert'),
    opt(String(k * 1000), false, 'div-stellenwert'),
    opt(String(daneben * 100)),
  ], { tipp: 'Ändere den Dividenden zu einer Zahl in der Nähe, die sich leicht durch den Divisor teilen lässt.',
    beispiel: '4172 : 7: In der Nähe liegt 4200, und 42 ist in der Siebenerreihe. 4200 : 7 = 600.',
    loesungsschritt: `Rechne mit ${basis} statt ${a}: ${k * d} gehört zur Einmaleinsreihe der ${d}.` });
});
gruppe(D('D5'), 'M', () => {
  const anzahlFalsch = zz(1, 2);
  const rechnungen = Array.from({ length: 4 }, (_, k) => {
    const [a, d, q] = divEinstellig('G');
    const falsch = k < anzahlFalsch;
    return [`${a} : ${d} = ${q + (falsch ? wahl([1, -1, 10, -10]) : 0)}`, falsch];
  });
  return falscheRechnungen(rechnungen, 'Prüfe mit der Probe: Welche Rechnungen sind falsch? Es können mehrere sein.',
    { tipp: 'Multipliziere jeweils das Ergebnis mit dem Divisor. Kommt nicht der Dividend heraus, ist die Rechnung falsch.',
      beispiel: '738 : 6 = 133? Probe: 133 · 6 = 798. Das ist nicht 738, also ist die Rechnung falsch.',
      loesungsschritt: 'Rechne für die erste Rechnung die Probe: Ergebnis mal Divisor.' });
});
gruppe(D('D5'), 'E', () => {
  const anzahlFalsch = zz(2, 3);
  const rechnungen = Array.from({ length: 5 }, (_, k) => {
    const [a, d, q] = suche(() => divEinstellig('M'), (x) => x[2] % 10 !== 0);
    const falsch = k < anzahlFalsch;
    const r = falsch ? wahl([q * 10 + zz(1, 9), Math.floor(q / 10)]) : q;
    return [`${fz(a)} : ${d} = ${fz(r)}`, falsch];
  });
  return falscheRechnungen(rechnungen, 'Prüfe nur mit einem Überschlag, ohne genau zu rechnen: Welche Ergebnisse können nicht stimmen? Es können mehrere sein.',
    { tipp: 'Überschlage, wie viele Stellen das Ergebnis haben muss, und vergleiche mit dem angegebenen Ergebnis.',
      beispiel: '8428 : 4 = 217? Überschlag: 8000 : 4 = 2000. Das Ergebnis muss vierstellig sein, 217 kann nicht stimmen.',
      loesungsschritt: 'Überschlage die erste Rechnung mit einem gerundeten Dividenden und vergleiche die Stellenzahl.' });
});

// ----- D6 Sachaufgaben -----
const divKontexte = [
  [(a, d) => `${a} Äpfel werden gleichmäßig in ${d} Kisten verteilt. Wie viele Äpfel kommen in jede Kiste?`, 'Äpfel'],
  [(a, d) => `${d} Freunde teilen sich die Kosten von ${a} € für ein Geschenk gleichmäßig. Wie viel zahlt jeder?`, '€'],
  [(a, d) => `Ein Buch hat ${a} Seiten. Samira möchte es in ${d} Tagen lesen und jeden Tag gleich viele Seiten schaffen. Wie viele Seiten liest sie pro Tag?`, 'Seiten'],
  [(a, d) => `${a} Stühle werden in Reihen zu je ${d} Stühlen aufgestellt. Wie viele Reihen entstehen?`, 'Reihen'],
  [(a, d) => `Ein Radweg ist ${a} km lang. Die Gruppe teilt ihn in ${d} gleich lange Etappen. Wie lang ist eine Etappe?`, 'km'],
  [(a, d) => `${a} Flaschen werden in Kästen zu je ${d} Flaschen gestellt. Wie viele Kästen werden voll?`, 'Kästen'],
];
const divKontexteGross = [
  [(a, d) => `Eine Fabrik verpackt ${a} Schrauben gleichmäßig in ${d} Kartons. Wie viele Schrauben kommen in jeden Karton?`, 'Schrauben'],
  [(a, d) => `Eine Reise kostet für ${d} Personen zusammen ${a} €. Alle zahlen gleich viel. Wie viel zahlt eine Person?`, '€'],
  [(a, d) => `Ein Lkw fährt in ${d} Tagen insgesamt ${a} km und jeden Tag gleich weit. Wie viele Kilometer fährt er an einem Tag?`, 'km'],
  [(a, d) => `${a} Flaschen werden in Kästen zu je ${d} Flaschen gestellt. Wie viele Kästen werden voll?`, 'Kästen'],
  [(a, d) => `Ein Gärtner pflanzt ${a} Salatköpfe in ${d} gleich lange Reihen. Wie viele Salatköpfe stehen in einer Reihe?`, 'Salatköpfe'],
  [(a, d) => `Eine Schule kauft ${d} gleiche Tablets für zusammen ${a} €. Wie viel kostet ein Tablet?`, '€'],
];
for (const niveau of ['F', 'G']) {
  gruppe(D('D6'), niveau, (i) => {
    const d = niveau === 'F' ? zz(3, 9) : wahl([4, 6, 7, 8, 9, 12]);
    const q = niveau === 'F' ? zz(6, 30) : zz(45, 280);
    const a = q * d;
    const kontexte = niveau === 'F' ? divKontexte : divKontexteGross;
    const [text, einheit] = kontexte[i % kontexte.length];
    return zahl(text(a, d), q, fehlerliste(q, [[a - d, 'sach-falsche-rechnung'], [a * d, 'sach-falsche-rechnung']]),
      { tipp: 'Hier wird gleichmäßig verteilt oder aufgeteilt. Das ist eine Division.',
        beispiel: '24 Äpfel in 4 Kisten: 24 : 4 = 6 Äpfel pro Kiste.',
        loesungsschritt: `Die Rechnung lautet ${a} : ${d}.` }, einheit);
  });
}
const divZweischritt = [
  (a, b, n) => ({ text: `Eine Klassenfahrt kostet insgesamt ${fz(a)} €. Der Förderverein übernimmt ${fz(b)} €. Den Rest teilen sich ${n} Kinder gleichmäßig.`,
    teile: ['Wie viel Euro müssen die Kinder zusammen bezahlen?', '€', 'Wie viel Euro zahlt jedes Kind?', '€'] }),
  (a, b, n) => ({ text: `Ein Bauer erntet ${fz(a)} kg Kartoffeln. ${fz(b)} kg behält er selbst. Den Rest füllt er gleichmäßig in ${n} Säcke.`,
    teile: ['Wie viele Kilogramm füllt er in Säcke?', 'kg', 'Wie viele Kilogramm kommen in jeden Sack?', 'kg'] }),
  (a, b, n) => ({ text: `Eine Schule bekommt ${fz(a)} Hefte geliefert. ${fz(b)} Hefte kommen ins Lager. Die übrigen werden gleichmäßig auf ${n} Klassen verteilt.`,
    teile: ['Wie viele Hefte werden verteilt?', 'Hefte', 'Wie viele Hefte bekommt jede Klasse?', 'Hefte'] }),
];
gruppe(D('D6'), 'M', (i) => {
  const n = zz(12, 28), q = zz(35, 180), b = zz(150, 900), a = q * n + b;
  const k = divZweischritt[i % 3](a, b, n);
  return { format: 'sachaufgabe', text: k.text,
    teile: [teil(k.teile[0], a - b, k.teile[1]), teil(k.teile[2], q, k.teile[3], fehlerliste(q, [[a % n === 0 ? a / n : -1, 'sach-schritt-vergessen']]))],
    hilfen: { tipp: 'Rechne Schritt für Schritt: erst abziehen, dann den Rest gleichmäßig teilen.',
      beispiel: '500 € Kosten, 100 € übernimmt der Verein, 20 Kinder: 500 − 100 = 400, dann 400 : 20 = 20 € pro Kind.',
      loesungsschritt: `Für die erste Frage rechnest du ${fz(a)} − ${fz(b)}.` } };
});
const divMitUnnoetig = [
  (k, m, d, n) => [`Ein Obsthof erntet ${k} Kisten mit je ${m} kg Äpfeln. Die Äpfel werden in Säcke zu je ${d} kg umgefüllt. Die Ernte dauert ${n} Tage. Wie viele Säcke werden gefüllt?`, 'Säcke'],
  (k, m, d, n) => [`Eine Firma liefert ${k} Paletten mit je ${m} Dosen. Die Dosen werden in Kartons zu je ${d} Dosen verpackt. Der Lkw fährt ${n} km weit. Wie viele Kartons werden gebraucht?`, 'Kartons'],
  (k, m, d, n) => [`Für ein Schulfest werden ${k} Packungen mit je ${m} Bechern gekauft. Die Becher werden gleichmäßig auf ${d} Stände verteilt. Das Fest beginnt um ${n} Uhr. Wie viele Becher bekommt jeder Stand?`, 'Becher'],
];
gruppe(D('D6'), 'E', (i) => {
  const d = wahl([12, 15, 16, 18, 24, 25]);
  const [k, m] = suche(() => [zz(14, 48), zz(15, 60)], ([x, y]) => (x * y) % d === 0 && x % d !== 0 && y % d !== 0);
  const n = i % 3 === 2 ? zz(10, 15) : zz(3, 9);
  const [text, einheit] = divMitUnnoetig[i % 3](k, m, d, n);
  const loesung = (k * m) / d;
  return zahl(text, loesung, fehlerliste(loesung, [[k * m, 'sach-schritt-vergessen'], [(k * m) % n === 0 ? (k * m) / n : -1, 'sach-unnoetige-angabe']]),
    { tipp: 'Berechne zuerst die Gesamtmenge. Nicht jede Zahl im Text wird gebraucht.',
      beispiel: '10 Kisten mit je 30 kg, Säcke zu 20 kg: 10 · 30 = 300 kg, dann 300 : 20 = 15 Säcke.',
      loesungsschritt: `Berechne zuerst die Gesamtmenge: ${k} · ${m} = ${k * m}.` }, einheit);
});

// ---------- Schreiben ----------
const pool = {
  version: 1,
  klassenstufe: 5,
  quelle: 'Bildungsplan 2016 Baden-Württemberg, Kapitelfolge nach Schnittpunkt 5 (Klett)',
  fehlvorstellungen,
  kapitel,
  aufgaben,
};
mkdirSync(new URL('../aufgabenpool/', import.meta.url), { recursive: true });
writeFileSync(new URL('../aufgabenpool/klasse-5.json', import.meta.url), JSON.stringify(pool, null, 1) + '\n');
console.log(`${aufgaben.length} Aufgaben geschrieben.`);
