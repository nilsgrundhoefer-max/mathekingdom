// Aufgaben zu 5.2.1 „Zahlenstrahl und Stellenwerte“ (Lernziele N1 bis N3) nach ADR 0015 und ADR 0030.
// N1 Zahlen am Zahlenstrahl ablesen und eintragen, N2 Zahlen vergleichen und ordnen, N3 Stellenwerttafel.
// Zahlenraum: F bis 10 000, sonst bis 1 Million. Die 0 ist eine natürliche Zahl.

import { sechs, zahl, auswahl, opt, luecken, sach, teil, strahl, ordnen, stellentafel, stellenFuer, bloeckeFuer, L, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, fz, kind, zweiKinder, U, HILFSZAHL } from '../werkzeug.mjs';

const N_ = (kurz) => `5.2.1-${kurz}`;
export const EINS = HILFSZAHL(1, 'Vorgänger und Nachfolger liegen um 1 neben der Zahl');
export const ZWEI = HILFSZAHL(2, 'die Mitte ist die Hälfte der Summe');
// Zahlenstrahl ablesen: Der Pfeil zeigt auf die Lösung.
export const lies = (text, st, pfeil, fehler, hilfen) => strahl('ablesen', text, { ...st, pfeil }, pfeil, fehlerliste(pfeil, fehler), hilfen, { nachweis: [{ art: 'strahl', wert: pfeil }] });
// Zahlenstrahl markieren: Die Zahl steht im Text.
export const tippe = (text, st, wert, fehler, hilfen) => strahl('markieren', text, st, wert, fehlerliste(wert, fehler), hilfen, { nachweis: [{ art: 'strahl', wert }] });
// Ein Pfeil, der nicht auf einem beschrifteten Strich steht.
export const zwischen = (st) => suche(() => st.von + zz(1, (st.bis - st.von) / st.schritt - 1) * st.schritt, (w) => (w - st.von) % st.beschriftung !== 0);
// Der Fehler „jeder Strich zählt 1“: vom beschrifteten Strich links aus gezählt.
export const einer = (st, w) => { const basis = w - ((w - st.von) % st.beschriftung); return basis + (w - basis) / st.schritt; };
export const vergleich = (a, b) => ({ art: 'vergleich', links: fz(a), rechts: fz(b), zeichen: a < b ? '<' : a > b ? '>' : '=' });
export const zeichenwahl = (a, b) => [opt('<', a < b, a < b ? undefined : 'zeichen-verwechselt'), opt('>', a > b, a > b ? undefined : 'zeichen-verwechselt'), opt('=', false)];
export const kette = (zahlen, z = '<') => zahlen.map(fz).join(` ${z} `);
export const auf = (zahlen) => [...zahlen].sort((x, y) => x - y);
export const verschieden = (erzeuge, n) => suche(() => Array.from({ length: n }, erzeuge), (l) => new Set(l).size === n);
export const stellen = (n) => String(n).split('').map(Number);
// Stellenwerttafel zum Eintragen: eine Zeile mit einem Feld je Ziffer.
export function trage(text, n, breite, hilfen, extra = {}) {
  const z = stellen(n), leer = breite - z.length, namen = stellenFuer(breite).map((s) => s.toLowerCase());
  const zeile = namen.map((name, i) => (i < leer ? '' : L(name)));
  const werte = Object.fromEntries(namen.slice(leer).map((name, i) => [name, z[i]]));
  return stellentafel(text, stellenFuer(breite), [zeile], werte, hilfen, { ...extra, nachweis: [{ art: 'tafel', zahl: n, ziffern: z }, ...(extra.nachweis ?? [])] }, breite > 4 ? bloeckeFuer(breite) : null);
}

export function zahlenstrahlUndStellenwerte() {
  // =====================================================================
  // N1 Zahlen am Zahlenstrahl ablesen und eintragen
  // =====================================================================
  sechs(N_('N1'), 'F', [
    () => { const z = zz(1, 7) * 10, st = { von: z, bis: z + 20, schritt: 1, beschriftung: 10 }, p = zwischen(st);
      return lies(Z('Schau auf den Zahlenstrahl.', 'Auf welche Zahl zeigt der Pfeil?'), st, p, [[p + 1, 'strahl-einerschritte'], [p - 1, 'strahl-einerschritte']],
        h3('Suche die Zahl links vom Pfeil. Zähle von dort die Striche.', 'Der Pfeil steht 3 Striche nach der 20. Das ist die 23.', `Links vom Pfeil steht ${p - (p % 10)}. Zähle von dort weiter.`)); },
    () => { const st = { von: 0, bis: 100, schritt: 5, beschriftung: 10 }, w = zz(1, 9) * 10 + 5;
      return tippe(Z(`Tippe die Zahl ${w} an.`), st, w, [[w - 5, 'strahl-einerschritte'], [w + 5, 'strahl-einerschritte']],
        h3('Die Zahl liegt genau zwischen zwei beschrifteten Strichen.', 'Die 25 liegt in der Mitte zwischen 20 und 30.', `Suche ${w - 5} und ${w + 5}. Die Zahl liegt in der Mitte.`)); },
    () => { const st = { von: 0, bis: 1000, schritt: 100, beschriftung: 500 }, p = zwischen(st);
      return lies(Z('Hier ist jeder Schritt 100 groß.', 'Auf welche Zahl zeigt der Pfeil?'), st, p, [[einer(st, p), 'strahl-einerschritte']],
        h3('Zähle in Hunderterschritten: 100, 200, 300 …', 'Der zweite Strich nach der 0 ist die 200.', `Zähle von ${p - (p % 500)} aus in Hunderterschritten weiter.`)); },
    () => { const n = suche(() => zz(12, 98), (x) => x % 10 !== 0 && x % 10 !== 9), von = Math.floor(n / 10) * 10;
      return luecken(Z(`Die Zahl ${n} ist am Zahlenstrahl markiert.`, 'Der Vorgänger ist {{a}}.', 'Der Nachfolger ist {{b}}.'), { a: [n - 1, fehlerliste(n - 1, [[n + 1, 'nachbar-verwechselt']])], b: [n + 1, fehlerliste(n + 1, [[n - 1, 'nachbar-verwechselt']])] },
        h3('Der Vorgänger steht direkt links. Der Nachfolger steht direkt rechts.', 'Bei 35 ist der Vorgänger 34. Der Nachfolger ist 36.', `Geh von ${n} einen Strich nach links und einen nach rechts.`),
        { bild: B.strahl({ von, bis: von + 10, schritt: 1, beschriftung: 10, punkte: [n] }), nachweis: [EINS, ...N(`${n} − 1`, `${n} + 1`)] }); },
    () => { const h = zz(1, 8) * 100, st = { von: h, bis: h + 200, schritt: 10, beschriftung: 100 }, p = zwischen(st);
      return lies(Z('Schau genau hin: Wie groß ist ein Schritt?', 'Auf welche Zahl zeigt der Pfeil?'), st, p, [[einer(st, p), 'strahl-einerschritte']],
        h3('Zwischen zwei beschrifteten Strichen liegen 10 Schritte. Ein Schritt ist 10 groß.', 'Der vierte Strich nach der 300 ist die 340.', `Zähle von ${p - (p % 100)} aus in Zehnerschritten weiter.`)); },
    () => { const st = { von: 0, bis: 1000, schritt: 50, beschriftung: 100 }, w = zz(1, 9) * 100 + 50;
      return tippe(Z('Hier ist jeder Schritt 50 groß.', `Tippe die Zahl ${w} an.`), st, w, [[w - 50, 'strahl-einerschritte'], [w + 50, 'strahl-einerschritte']],
        h3('Die Zahl liegt in der Mitte zwischen zwei Hundertern.', 'Die 250 liegt in der Mitte zwischen 200 und 300.', `Suche ${w - 50}. Geh einen Strich nach rechts.`)); },
  ]);
  sechs(N_('N1'), 'G', [
    () => { const z = zz(1, 8) * 100, st = { von: z, bis: z + 100, schritt: 5, beschriftung: 50 }, p = zwischen(st);
      return lies(Z('Auf welche Zahl zeigt der Pfeil?'), st, p, [[einer(st, p), 'strahl-einerschritte']],
        h3('Finde zuerst heraus, wie groß ein Schritt ist.', 'Von 100 bis 150 sind es 10 Schritte. Ein Schritt ist 5 groß.', `Ein Schritt ist 5 groß. Zähle von ${p - ((p - z) % 50)} aus weiter.`)); },
    () => { const st = { von: 0, bis: 600, schritt: 20, beschriftung: 100 }, w = suche(() => zz(1, 29) * 20, (x) => x % 100 !== 0);
      return tippe(Z(`Tippe die Zahl ${w} an.`), st, w, [[w - (w % 100) + (w % 100) / 20, 'strahl-einerschritte']],
        h3('Von Hunderter zu Hunderter sind es 5 Schritte. Ein Schritt ist 20 groß.', 'Die 140 liegt 2 Schritte rechts von der 100.', `Suche ${w - (w % 100)}. Zähle von dort in Zwanzigerschritten.`)); },
    () => { const [s, b] = wahl([[25, 100], [20, 100], [50, 500], [250, 1000], [200, 1000]]), von = zz(0, 3) * b, st = { von, bis: von + 2 * b, schritt: s, beschriftung: b };
      return zahl(Z('Schau auf den Zahlenstrahl.', 'Wie groß ist der Schritt von Teilstrich zu Teilstrich?'), s, fehlerliste(s, [[1, 'strahl-einerschritte'], [b, 'strahl-einerschritte']]),
        h3('Zähle die Schritte zwischen zwei beschrifteten Teilstrichen.', 'Von 0 bis 100 sind es 4 Schritte. Ein Schritt ist 25 groß, denn 100 : 4 = 25.', `Von ${von} bis ${von + b} sind es ${b / s} Schritte.`),
        { bild: B.strahl(st), nachweis: [{ art: 'schrittweite', wert: s }] }); },
    () => { const z = zz(1, 8) * 1000, st = { von: z, bis: z + 1000, schritt: 50, beschriftung: 500 }, p = zwischen(st);
      return lies(Z('Der Zahlenstrahl zeigt nur einen Ausschnitt.', 'Auf welche Zahl zeigt der Pfeil?'), { ...st, ausschnitt: true }, p, [[einer(st, p), 'strahl-einerschritte']],
        h3('Von 2000 bis 2500 sind es 10 Schritte. Wie groß ist ein Schritt?', 'Ein Schritt ist 50 groß. Der dritte Teilstrich nach 2000 ist 2150.', `Ein Schritt ist 50 groß. Zähle von ${p - ((p - z) % 500)} aus weiter.`)); },
    () => { const a = zz(2, 8) * 100, b = a + 100, m = a + 50;
      return zahl(Z(`Eine Zahl liegt genau in der Mitte zwischen ${a} und ${b}.`, 'Wie heißt die Zahl?'), m, fehlerliste(m, [[a + 5, 'strahl-einerschritte'], [a + 55, 'stellenwert']]),
        h3('Zähle die Schritte zwischen den beiden Zahlen. Die Mitte ist nach der Hälfte der Schritte.', 'Die Mitte zwischen 200 und 300 ist 250.', `Von ${a} bis ${b} sind es 10 Schritte. Geh 5 Schritte weit.`),
        { bild: B.strahl({ von: a, bis: b, schritt: 10, beschriftung: 100, ausschnitt: true }), nachweis: [ZWEI, ...N(`${a} + ${b}`, `${a + b} : 2`)] }); },
    () => { const k = kind(), z = zz(1, 8) * 100, s = wahl([5, 20]), n = zz(2, 4), p = z + n * s;
      return auswahl(Z(`${k} sagt: „Der Pfeil zeigt auf ${z + n}.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'strahl-einerschritte'), opt(`Falsch. Ein Schritt ist ${s} groß. Der Pfeil zeigt auf ${p}.`, true), opt(`Falsch. Der Pfeil zeigt auf ${z + n * 10 + (s === 5 ? 100 : 0)}.`, false)],
        h3('Zähle die Schritte zwischen zwei beschrifteten Teilstrichen.', 'Sind es 5 Schritte bis zum nächsten Hunderter, dann ist ein Schritt 20 groß.', `Ein Schritt ist ${s} groß. Der Pfeil steht ${n} Schritte nach ${z}.`),
        { bild: B.strahl({ von: z, bis: z + 100, schritt: s, beschriftung: 100, pfeil: p, ausschnitt: true }), nachweis: [U(false), { art: 'strahl', wert: p }, { art: 'schrittweite', wert: s }, HILFSZAHL(n, 'Schritte nach dem beschrifteten Teilstrich')] }); },
  ]);
  sechs(N_('N1'), 'M', [
    () => { const z = zz(2, 8) * 1000, st = { von: z, bis: z + 2000, schritt: 100, beschriftung: 1000, ausschnitt: true }, p = zwischen(st);
      return lies('Der Zahlenstrahl zeigt einen Ausschnitt. Auf welche Zahl zeigt der Pfeil?', st, p, [[einer(st, p), 'strahl-einerschritte']],
        h2('Bestimme zuerst die Schrittweite: Wie viele Schritte liegen zwischen zwei beschrifteten Teilstrichen?', `Ein Schritt ist 100 groß. Zähle von ${fz(p - ((p - z) % 1000))} aus weiter.`)); },
    () => { const z = zz(1, 4) * 10000, st = { von: z, bis: z + 20000, schritt: 500, beschriftung: 2000, ausschnitt: true }, p = zwischen(st);
      return lies('Auf welche Zahl zeigt der Pfeil?', st, p, [[einer(st, p), 'strahl-einerschritte'], [p - ((p - z) % 2000) + ((p - z) % 2000) / 5, 'strahl-einerschritte']],
        h2('Von einem beschrifteten Teilstrich zum nächsten sind es 2000. Dazwischen liegen 4 Schritte.', `Ein Schritt ist 500 groß. Zähle von ${fz(p - ((p - z) % 2000))} aus weiter.`)); },
    () => { const z = zz(2, 8) * 10000, st = { von: z, bis: z + 10000, schritt: 500, beschriftung: 5000, ausschnitt: true }, w = zwischen(st);
      return tippe(`Markiere die Zahl ${fz(w)} am Zahlenstrahl.`, st, w, [[w - 500, 'strahl-einerschritte'], [w + 500, 'strahl-einerschritte']],
        h2('Bestimme zuerst die Schrittweite. Zähle dann vom nächsten beschrifteten Teilstrich aus.', `Ein Schritt ist 500 groß. Beginne bei ${fz(w - ((w - z) % 5000))}.`)); },
    () => { const [s, b] = wahl([[2500, 10000], [2000, 10000], [5000, 20000], [250, 1000], [1250, 5000]]), von = zz(1, 4) * b, st = { von, bis: von + 4 * b, schritt: s, beschriftung: b, ausschnitt: true };
      return zahl('Wie groß ist der Schritt von Teilstrich zu Teilstrich?', s, fehlerliste(s, [[1, 'strahl-einerschritte'], [b, 'strahl-einerschritte'], [b / 10, 'strahl-einerschritte']]),
        h2('Teile den Abstand zweier beschrifteter Teilstriche durch die Zahl der Schritte dazwischen.', `Von ${fz(von)} bis ${fz(von + b)} sind es ${b / s} Schritte.`),
        { bild: B.strahl(st), nachweis: [{ art: 'schrittweite', wert: s }] }); },
    () => { const a = zz(12, 44) * 200, d = wahl([600, 1000, 1400, 1800]), b = a + d;
      return zahl(`Welche Zahl liegt genau in der Mitte zwischen ${fz(a)} und ${fz(b)}?`, a + d / 2, fehlerliste(a + d / 2, [[d / 2, 'begriffe-verwechselt'], [a + d, 'begriffe-verwechselt']]),
        h2('Bestimme den Abstand der beiden Zahlen und geh die Hälfte davon weiter.', `Der Abstand ist ${d}. Die Hälfte davon ist ${d / 2}.`), { nachweis: N(`${b} − ${a}`, `${d} : 2`, `${a} + ${d / 2}`) }); },
    () => { const [k, d] = wahl([[3, 1200], [4, 2000], [2, 600], [5, 3000], [3, 2400], [4, 1000]]), a = zz(2, 8) * 1000, b = a + d;
      return zahl(`Auf einem Zahlenstrahl sind ${fz(a)} und ${fz(b)} beschriftet. Dazwischen liegen genau ${k} weitere Teilstriche. Wie groß ist ein Schritt?`, d / (k + 1), fehlerliste(d / (k + 1), [[d / k, 'strahl-einerschritte'], [1, 'strahl-einerschritte']]),
        h2('Zähle die Schritte, nicht die Teilstriche: Es ist immer ein Schritt mehr als Teilstriche dazwischen.', `${k} Teilstriche teilen die Strecke in ${k + 1} Schritte.`), { nachweis: N(`${b} − ${a}`, `${k} + 1`, `${d} : ${k + 1}`) }); },
  ]);
  sechs(N_('N1'), 'E', [
    () => { const z = zz(2, 8) * 100000, st = { von: z, bis: z + 100000, schritt: 2500, beschriftung: 25000, ausschnitt: true }, p = zwischen(st);
      return lies('Auf welche Zahl zeigt der Pfeil?', st, p, [[einer(st, p), 'strahl-einerschritte'], [p - ((p - z) % 25000) + ((p - z) % 25000) / 25, 'strahl-einerschritte']],
        h1('Bestimme die Schrittweite aus zwei beschrifteten Teilstrichen und der Zahl der Schritte dazwischen.')); },
    () => { const a = zz(4, 14) * 50000, b = a + wahl([50000, 150000]), m = (a + b) / 2, von = Math.floor(a / 200000) * 200000, st = { von, bis: von + 200000 * (b > von + 200000 ? 2 : 1), schritt: b > von + 200000 ? 12500 : 5000, beschriftung: b > von + 200000 ? 100000 : 50000, ausschnitt: von > 0 };
      if ((m - st.von) % st.schritt !== 0 || b > st.bis) return null;
      return strahl('markieren', `Markiere die Zahl, die genau in der Mitte zwischen ${fz(a)} und ${fz(b)} liegt.`, st, m, [], h1('Berechne zuerst die Mitte. Bestimme dann die Schrittweite des Zahlenstrahls.'),
        { nachweis: [...N(`${a} + ${b}`, `${a + b} : 2`), { art: 'strahl', wert: m, wort: true }] }); },
    () => { const [k, d] = wahl([[7, 100000], [3, 50000], [7, 200000], [4, 250000], [9, 125000], [7, 60000]]), a = zz(1, 6) * 100000, b = a + d;
      return zahl(`Auf einem Zahlenstrahl sind ${fz(a)} und ${fz(b)} beschriftet. Dazwischen liegen genau ${k} weitere Teilstriche. Wie groß ist ein Schritt?`, d / (k + 1), fehlerliste(d / (k + 1), [[Math.round(d / k), 'strahl-einerschritte']]),
        h1('Die Teilstriche dazwischen teilen die Strecke in einen Schritt mehr, als es Teilstriche sind.'), { nachweis: N(`${b} − ${a}`, `${k} + 1`, `${d} : ${k + 1}`) }); },
    () => { const s = wahl([1000, 2000, 5000]), ziel = wahl([500000, 1000000, 200000]);
      return zahl(`Auf einem Zahlenstrahl ist ein Schritt von ${s} auf dem Papier genau einen Zentimeter lang. Wie viele Zentimeter ist der Strahl von 0 bis ${fz(ziel)} lang?`, ziel / s, fehlerliste(ziel / s, [[ziel / s / 10, 'stellenwert'], [ziel / s * 10, 'stellenwert']]),
        h1('Überlege, wie oft der Schritt in die ganze Strecke passt.'), { einheit: 'cm', nachweis: N(`${ziel} : ${s}`) }); },
    () => { const st = { von: 0, bis: 1000000, schritt: 25000, beschriftung: 250000 }, p = zwischen(st);
      return lies('Der Zahlenstrahl reicht bis zu einer Million. Auf welche Zahl zeigt der Pfeil?', st, p, [[einer(st, p), 'strahl-einerschritte'], [p - (p % 250000) + (p % 250000) / 25, 'strahl-einerschritte']],
        h1('Zwischen zwei beschrifteten Teilstrichen liegen 10 Schritte.')); },
    () => { const k = kind(), klein = wahl([250, 400, 750]), gross = wahl([990000, 950000, 875000]);
      return auswahl(`${k} will die Zahlen ${klein} und ${fz(gross)} auf einem Zahlenstrahl von 0 bis 1${' '}000${' '}000 eintragen. Der Strahl ist im Heft 10 cm lang. Welche Aussage trifft zu?`, [
        opt(`Das geht kaum: ${klein} liegt so dicht bei 0, dass man den Abstand nicht sehen kann.`, true),
        opt(`Das geht gut: ${klein} liegt etwa in der Mitte des Strahls.`, false, 'strahl-einerschritte'),
        opt(`Das geht nicht, weil ${fz(gross)} größer ist als das Ende des Strahls.`, false, 'vergleich-erste-ziffer'),
        opt('Das geht gut, wenn man jeden Schritt 1 groß wählt.', false, 'strahl-einerschritte')],
      h1('Überlege, wie groß ein Schritt sein muss, wenn eine Million auf 10 cm passen soll.'), { nachweis: [...N('1000000 : 10'), HILFSZAHL(klein, 'kleine Zahl der Aufgabe'), HILFSZAHL(gross, 'große Zahl der Aufgabe')] }); },
  ]);

  // =====================================================================
  // N2 Zahlen vergleichen und ordnen
  // =====================================================================
  sechs(N_('N2'), 'F', [
    () => { const [a, b] = suche(() => { const x = zz(1, 8), y = zz(x + 1, 9); return wahl([[x * 10 + y, y * 10 + x], [y * 10 + x, x * 10 + y]]); }, () => true), von = Math.floor(Math.min(a, b) / 10) * 10, bis = Math.ceil((Math.max(a, b) + 1) / 10) * 10;
      return auswahl(Z('Welches Zeichen passt?', `${a} ▢ ${b}`), zeichenwahl(a, b),
        h3('Weiter rechts am Zahlenstrahl ist die Zahl größer. Die Spitze zeigt zur kleineren Zahl.', '27 < 72: 27 ist kleiner als 72.', `Schau auf die Zehner: ${Math.floor(a / 10)} Zehner und ${Math.floor(b / 10)} Zehner.`),
        { bild: B.strahl({ von, bis, schritt: bis - von > 40 ? 5 : 1, beschriftung: 10, punkte: [a, b] }), nachweis: [vergleich(a, b)] }); },
    () => { const h = zz(1, 8) * 100, l = verschieden(() => h + zz(1, 19) * 5, 3), g = Math.max(...l);
      return auswahl(Z('Drei Zahlen sind am Zahlenstrahl markiert.', 'Welche Zahl ist am größten?'), l.map((x) => opt(String(x), x === g, x === Math.min(...l) ? 'zeichen-verwechselt' : undefined)),
        h3('Die größte Zahl liegt am weitesten rechts.', '460 liegt rechts von 430. Also ist 460 größer.', `Suche die Zahl ganz rechts am Zahlenstrahl.`),
        { bild: B.strahl({ von: h, bis: h + 100, schritt: 5, beschriftung: 50, punkte: l }), nachweis: [{ art: 'extremwert', was: 'groesste', wert: g }] }); },
    () => { const l = verschieden(() => zz(11, 99), 3), s = auf(l), von = Math.floor(s[0] / 10) * 10, bis = Math.ceil((s[2] + 1) / 10) * 10;
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.'), s.map(String),
        h3('Vergleiche zuerst die Zehner. Bei gleichen Zehnern schaust du auf die Einer.', '38, 52, 57: 3 Zehner sind am wenigsten.', `Die kleinste Zahl ist ${s[0]}.`),
        { bild: B.strahl({ von, bis, schritt: bis - von > 40 ? 5 : 1, beschriftung: 10, punkte: l }), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', links: 'kleinste', rechts: 'größte' }); },
    () => { const n = wahl([199, 299, 399, 499, 599, 699, 799, 899, 209, 309, 409, 509]);
      return zahl(Z(`Die Zahl ${n} ist am Zahlenstrahl markiert.`, 'Wie heißt ihr Nachfolger?'), n + 1, fehlerliste(n + 1, [[n - 1, 'nachbar-verwechselt'], [n + 10, 'stellenwert']]),
        h3('Der Nachfolger ist um 1 größer. Er steht direkt rechts.', 'Der Nachfolger von 59 ist 60.', `Geh von ${n} einen Strich nach rechts.`),
        { bild: B.strahl({ von: Math.floor(n / 10) * 10, bis: Math.floor(n / 10) * 10 + 10, schritt: 1, beschriftung: 10, punkte: [n], ausschnitt: true }), nachweis: [EINS, ...N(`${n} + 1`)] }); },
    () => { const [x, y, z] = suche(() => [zz(1, 4), zz(5, 9), 0], () => true), l = [x * 100 + y, x * 100 + y * 10, y * 100 + x, y * 100 + x * 10], s = auf(l);
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.'), s.map(String),
        h3('Vergleiche zuerst die Hunderter. Dann kommen die Zehner, dann die Einer.', '305 ist kleiner als 350. Beide haben 3 Hunderter, aber 0 Zehner sind weniger als 5 Zehner.', `Zwei Zahlen haben ${x} Hunderter. Vergleiche bei ihnen die Zehner.`),
        { bild: B.strahl({ von: x * 100, bis: (y + 1) * 100, schritt: (y + 1 - x) > 4 ? 50 : 10, beschriftung: 100, punkte: l, ausschnitt: true }), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'stellenwert', links: 'kleinste', rechts: 'größte' }); },
    () => { const h = zz(1, 8) * 100, l = auf(verschieden(() => h + zz(1, 9) * 10, 3));
      return auswahl(Z('Welche Reihe stimmt?'), [opt(kette(l), true), opt(kette([l[1], l[0], l[2]])), opt(kette(l, '>'), false, 'zeichen-verwechselt')],
        h3('Das Zeichen < heißt: ist kleiner als. Die Spitze zeigt zur kleineren Zahl.', '120 < 150 < 180: Die Zahlen werden nach rechts immer größer.', `Die kleinste Zahl ist ${l[0]}. Sie muss ganz links stehen.`),
        { bild: B.strahl({ von: h, bis: h + 100, schritt: 10, beschriftung: 50, punkte: l, ausschnitt: true }), nachweis: [{ art: 'ketten' }] }); },
  ]);
  sechs(N_('N2'), 'G', [
    () => { const t = zz(1, 8), [x, y] = suche(() => [zz(0, 9), zz(0, 9)], ([p, q]) => p !== q), e = zz(1, 9), a = t * 1000 + x * 100 + y * 10 + e, b = t * 1000 + y * 100 + x * 10 + e;
      return auswahl(Z('Welches Zeichen passt?', `${a} ▢ ${b}`), zeichenwahl(a, b),
        h3('Vergleiche von links: erst die Tausender, dann die Hunderter.', '4072 < 4702: Beide haben 4 Tausender. Aber 0 Hunderter sind weniger als 7 Hunderter.', `Die Tausender sind gleich. Vergleiche die Hunderter: ${x} und ${y}.`),
        { bild: B.strahl({ von: t * 1000, bis: (t + 1) * 1000, schritt: 100, beschriftung: 500, punkte: [a, b], ausschnitt: true }), nachweis: [vergleich(a, b)] }); },
    () => { const t = zz(2, 8), l = auf(verschieden(() => t * 1000 + zz(0, 9) * 100 + zz(0, 9) * 10 + zz(0, 9), 4));
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der größten Zahl.'), [...l].reverse().map(String),
        h3('Alle Zahlen haben gleich viele Tausender. Vergleiche also die Hunderter.', '5830 ist größer als 5380, denn 8 Hunderter sind mehr als 3 Hunderter.', `Die größte Zahl ist ${l[3]}.`),
        { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'stellenwert', links: 'größte', rechts: 'kleinste' }); },
    () => { const namen = mische(['Mia', 'Tom', 'Lena', 'Ali']).slice(0, 3), t = zz(2, 8), [x, y] = suche(() => [zz(1, 9), zz(0, 9)], ([p, q]) => p !== q && q !== 0), l = mische([t * 1000 + x * 100 + y * 10, t * 1000 + y * 100 + x * 10, t * 1000 + x * 100 + y]);
      if (new Set(l).size < 3) return null;
      return sach(Z('Drei Kinder sammeln Punkte in einem Spiel.', ...namen.map((n, i) => `${n} hat ${l[i]} Punkte.`)), [
        teil('Wie viele Punkte hat das Kind mit den meisten Punkten?', Math.max(...l), 'Punkte', fehlerliste(Math.max(...l), [[Math.min(...l), 'zeichen-verwechselt']])),
        teil('Wie viele Punkte hat das Kind mit den wenigsten Punkten?', Math.min(...l), 'Punkte', fehlerliste(Math.min(...l), [[Math.max(...l), 'zeichen-verwechselt']]))],
      h3('Alle Zahlen haben gleich viele Tausender. Vergleiche die Hunderter, dann die Zehner.', '3520 ist größer als 3250, denn 5 Hunderter sind mehr als 2 Hunderter.', `Alle Zahlen haben ${t} Tausender. Schau jetzt auf die Hunderter.`),
      { nachweis: [{ art: 'extremwert', was: 'groesste', wert: Math.max(...l), zahlen: l }, { art: 'extremwert', was: 'kleinste', wert: Math.min(...l), zahlen: l }] }); },
    () => { const n = zz(2, 9) * 1000, vor = wahl([true, false]);
      return zahl(Z(`Die Zahl ${n} ist am Zahlenstrahl markiert.`, `Wie heißt ihr ${vor ? 'Vorgänger' : 'Nachfolger'}?`), vor ? n - 1 : n + 1, fehlerliste(vor ? n - 1 : n + 1, [[vor ? n + 1 : n - 1, 'nachbar-verwechselt'], [vor ? n - 1000 : n + 1000, 'stellenwert'], [vor ? n - 10 : n + 10, 'stellenwert']]),
        h3('Der Vorgänger ist um 1 kleiner. Der Nachfolger ist um 1 größer.', 'Der Vorgänger von 3000 ist 2999.', `Geh von ${n} einen Schritt nach ${vor ? 'links' : 'rechts'}.`),
        { bild: B.strahl({ von: n - 10, bis: n + 10, schritt: 1, beschriftung: 10, punkte: [n], ausschnitt: true }), nachweis: [EINS, ...N(vor ? `${n} − 1` : `${n} + 1`)] }); },
    () => { const x = zz(1, 7), y = zz(8, 9), l = [y * 100 + y * 10 + x, 1000 + x * 10 + y, 1000 + y * 10 + x, y * 100 + x * 10 + y, 1000 + x * 100 + y], s = auf(l);
      if (new Set(l).size < 5) return null;
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.', 'Achte auf die Zahl der Stellen.'), s.map(String),
        h3('Eine Zahl mit 3 Stellen ist immer kleiner als eine Zahl mit 4 Stellen.', '989 ist kleiner als 1001. Denn 989 hat nur 3 Stellen.', `Zwei Zahlen haben nur 3 Stellen. Sie stehen ganz links.`),
        { bild: B.strahl({ von: 800, bis: 2000, schritt: 100, beschriftung: 400, punkte: [s[0], s[4]] }), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'vergleich-erste-ziffer', links: 'kleinste', rechts: 'größte' }); },
    () => { const k = kind(), a = wahl([989, 978, 899, 995, 909]), b = wahl([1001, 1010, 1100, 1002]);
      return auswahl(Z(`${k} sagt: „${a} ist größer als ${b}.“`, `„Denn 9 ist größer als 1.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'vergleich-erste-ziffer'), opt(`Falsch. ${b} hat mehr Stellen. Also ist ${b} größer.`, true), opt('Falsch. Die beiden Zahlen sind gleich groß.', false)],
        h3('Zähle zuerst die Stellen der beiden Zahlen.', '99 ist kleiner als 100. Denn 99 hat 2 Stellen und 100 hat 3 Stellen.', `${a} hat 3 Stellen. ${b} hat 4 Stellen.`),
        { nachweis: [U(false), vergleich(a, b)] }); },
  ]);
  sechs(N_('N2'), 'M', [
    () => { const l = auf([...verschieden(() => zz(10, 99) * 1000 + zz(0, 999), 3), zz(100, 999) * 1000 + zz(0, 999), zz(1000, 9999)]);
      return ordnen('Ordne die Zahlen. Beginne mit der kleinsten Zahl.', l.map(fz), h2('Zähle zuerst die Stellen. Bei gleich vielen Stellen vergleichst du von links Ziffer für Ziffer.', `Die kleinste Zahl hat nur 4 Stellen: ${l[0]}.`),
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'vergleich-erste-ziffer', links: 'kleinste', rechts: 'größte' }); },
    () => { const zs = suche(() => mische([0, zz(1, 4), zz(5, 7), zz(8, 9)]), (l) => new Set(l).size === 4), ab = [...zs].sort((x, y) => y - x), gross = Number(ab.join('')), aufw = [...zs].sort((x, y) => x - y), klein = Number([aufw[1], aufw[0], aufw[2], aufw[3]].join(''));
      return luecken(`Bilde aus den Ziffern ${zs.join(', ')} vierstellige Zahlen. Jede Ziffer kommt genau einmal vor. Die größte Zahl ist {{a}}, die kleinste Zahl ist {{b}}.`, { a: gross, b: [klein, fehlerliste(klein, [[Number(aufw.join('')), 'null-platzhalter']])] },
        h2('Für die größte Zahl steht die größte Ziffer ganz links. Bei der kleinsten Zahl darf die 0 nicht vorne stehen.', `Die größte Zahl beginnt mit ${ab[0]}, die kleinste mit ${aufw[1]}.`), { nachweis: [{ art: 'extremzahlen', ziffern: zs, gross, klein }] }); },
    () => { const m = zz(12, 88) * 1000, l = [m - zz(1, 9) * 10, m + zz(1, 9) * 10, m + zz(11, 99) * 100, m - zz(11, 99) * 100], d = l.map((x) => Math.abs(x - m)), kl = Math.min(...d);
      if (d.filter((x) => x === kl).length > 1) return null;
      return auswahl(`Welche Zahl liegt am nächsten an ${fz(m)}?`, l.map((x) => opt(fz(x), Math.abs(x - m) === kl)),
        h2('Bestimme für jede Zahl den Abstand zur gesuchten Zahl.', `Zwei Zahlen weichen erst bei den Zehnern von ${fz(m)} ab.`), { nachweis: [{ art: 'naechste', ziel: m }] }); },
    () => { const [a, b] = suche(() => { const x = zz(100, 999) * 1000 + zz(0, 999); return [x, wahl([x + wahl([9, 90, 900]), Math.floor(x / 10), x - wahl([9, 90])])]; }, ([x, y]) => x !== y && y > 9999);
      return auswahl(`Welches Zeichen passt? ${fz(a)} ▢ ${fz(b)}`, zeichenwahl(a, b), h2('Zähle zuerst die Stellen. Bei gleich vielen Stellen vergleichst du von links, bis sich zwei Ziffern unterscheiden.', `${fz(a)} hat ${String(a).length} Stellen, ${fz(b)} hat ${String(b).length} Stellen.`), { nachweis: [vergleich(a, b)] }); },
    () => { const a = wahl([10000, 100000, 250000, 30000, 400000]), b = wahl([9999, 99999, 309999, 49999, 599999].filter((x) => x + 1 !== a));
      return luecken(`Der Vorgänger von ${fz(a)} ist {{a}}. Der Nachfolger von ${fz(b)} ist {{b}}.`, { a: [a - 1, fehlerliste(a - 1, [[a + 1, 'nachbar-verwechselt'], [a - 10, 'stellenwert']])], b: [b + 1, fehlerliste(b + 1, [[b - 1, 'nachbar-verwechselt']])] },
        h2('Der Vorgänger ist um 1 kleiner, der Nachfolger um 1 größer. Achte darauf, wie sich die Stellen dabei ändern.', `Vor ${fz(a)} endet die Zahl auf lauter Neunen.`), { nachweis: N(`${a} − 1`, `${b} + 1`), lang: true }); },
    () => { const m = zz(2, 9) * 1000, u = zz(3, 7), o = zz(3, 8), a = m - u, b = m + o;
      return zahl(`Wie viele natürliche Zahlen sind größer als ${a} und kleiner als ${b}?`, b - a - 1, fehlerliste(b - a - 1, [[b - a, 'begriffe-verwechselt'], [b - a + 1, 'begriffe-verwechselt']]),
        h2('Die beiden Grenzen selbst zählen nicht mit. Probiere es mit kleinen Zahlen: Zwischen 3 und 7 liegen 4, 5 und 6.', `Die erste Zahl ist ${a + 1}, die letzte ist ${b - 1}.`), { nachweis: N(`${b} − ${a}`, `${b - a} − 1`) }); },
  ]);
  sechs(N_('N2'), 'E', [
    () => { const [x, y, z] = suche(() => [zz(1, 9), zz(0, 9), zz(0, 9)], (l) => new Set(l).size === 3), q = (...d) => Number(d.join('')), l = [q(x, y, z, x, y, z), q(x, z, y, x, y, z), q(x, y, z, z, y, x), q(x, y, x, z, y, z), q(x, z, y, z, x, y)];
      if (new Set(l).size < 5) return null;
      return ordnen('Ordne die Zahlen. Beginne mit der größten Zahl.', auf(l).reverse().map(fz), h1('Alle Zahlen haben gleich viele Stellen. Vergleiche von links, bis sich zwei Ziffern unterscheiden.'),
        { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'stellenwert', links: 'größte', rechts: 'kleinste' }); },
    () => { const l = auf(verschieden(() => zz(100, 999) * 1000 + zz(0, 999), 3));
      return auswahl('Welche Kette ist richtig?', [opt(kette(l), true), opt(kette([l[0], l[2], l[1]])), opt(kette(l, '>'), false, 'zeichen-verwechselt'), opt(kette([l[2], l[1], l[0]]), false, 'zeichen-verwechselt'), opt(kette([l[1], l[0], l[2]]))],
        h1('In einer richtigen Kette stimmt jeder einzelne Vergleich.'), { nachweis: [{ art: 'ketten' }] }); },
    () => { const zs = suche(() => mische([0, zz(1, 3), zz(4, 5), zz(6, 7), zz(8, 9)]), (l) => new Set(l).size === 5), ab = [...zs].sort((x, y) => y - x), gross = Number(ab.join('')), aufw = [...zs].sort((x, y) => x - y), klein = Number([aufw[1], aufw[0], ...aufw.slice(2)].join(''));
      return luecken(`Bilde aus den Ziffern ${zs.join(', ')} fünfstellige Zahlen. Jede Ziffer kommt genau einmal vor. Die größte Zahl ist {{a}}, die kleinste Zahl ist {{b}}.`, { a: gross, b: [klein, fehlerliste(klein, [[Number(aufw.join('')), 'null-platzhalter']])] },
        h1('Überlege für jede Stelle von links, welche Ziffer dort stehen muss. Eine fünfstellige Zahl beginnt nicht mit 0.'), { nachweis: [{ art: 'extremzahlen', ziffern: zs, gross, klein }], lang: true }); },
    () => { const st = wahl([4, 5]), groesste = 10 ** st - 1, d = zz(11, 48), a = groesste - d;
      return zahl(`Wie viele ${st === 4 ? 'vierstellige' : 'fünfstellige'} Zahlen sind größer als ${fz(a)}?`, d, fehlerliste(d, [[d + 1, 'begriffe-verwechselt'], [d - 1, 'begriffe-verwechselt']]),
        h1('Überlege, welche die größte Zahl mit dieser Stellenzahl ist.'), { nachweis: [HILFSZAHL(groesste, 'größte Zahl mit dieser Stellenzahl'), ...N(`${groesste} − ${a}`)] }); },
    () => { const m = zz(2, 9) * 50000, l = [m - zz(11, 49) * 100, m + zz(11, 49) * 100, m + zz(51, 99) * 100, m - zz(51, 99) * 1000, m + zz(11, 99) * 10], d = l.map((x) => Math.abs(x - m)), kl = Math.min(...d);
      if (d.filter((x) => x === kl).length > 1) return null;
      return auswahl(`Welche Zahl liegt am nächsten an ${fz(m)}?`, l.map((x) => opt(fz(x), Math.abs(x - m) === kl)), h1('Bestimme für jede Zahl den Abstand zur gesuchten Zahl.'), { nachweis: [{ art: 'naechste', ziel: m }] }); },
    () => { const k = kind();
      return auswahl(`${k} behauptet: „Von zwei natürlichen Zahlen ist immer die Zahl mit mehr Stellen die größere.“ Beurteile die Aussage.`, [
        opt('Stimmt. Jede vierstellige Zahl ist mindestens 1000, jede dreistellige höchstens 999. So ist es bei jeder Stellenzahl.', true),
        opt('Falsch. 999 ist größer als 1000, denn 9 ist größer als 1.', false, 'vergleich-erste-ziffer'),
        opt('Das gilt nur, wenn auch die erste Ziffer größer ist.', false, 'vergleich-erste-ziffer'),
        opt('Das gilt nur für Zahlen bis 1000.', false)],
      h1('Vergleiche die kleinste Zahl mit vier Stellen und die größte Zahl mit drei Stellen.'), { nachweis: [U(true), { art: 'vergleich', links: '999', rechts: '1000', zeichen: '<' }] }); },
  ]);

  // =====================================================================
  // N3 Zahlen in der Stellenwerttafel darstellen
  // =====================================================================
  sechs(N_('N3'), 'F', [
    () => { const n = suche(() => zz(123, 987), (x) => new Set(stellen(x)).size === 3 && !stellen(x).includes(0)), z = stellen(n);
      return zahl(Z('Schau auf die Stellenwerttafel.', 'Welche Zahl steht dort?'), n, fehlerliste(n, [[Number([...z].reverse().join('')), 'tafel-verrutscht']]),
        h3('Lies von links: erst die Hunderter, dann die Zehner, dann die Einer.', '4 Hunderter, 2 Zehner und 7 Einer sind die Zahl 427.', `Bei den Hundertern steht ${z[0]}. Bei den Zehnern steht ${z[1]}.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'tafel', zahl: n }] }); },
    () => { const n = suche(() => zz(123, 987), (x) => new Set(stellen(x)).size === 3 && !stellen(x).includes(0));
      return trage(Z(`Trage die Zahl ${n} in die Stellenwerttafel ein.`), n, 3,
        h3('H heißt Hunderter, Z heißt Zehner, E heißt Einer.', 'Die Zahl 385: 3 bei H, 8 bei Z, 5 bei E.', `Die erste Ziffer ${stellen(n)[0]} gehört zu den Hundertern.`)); },
    () => { const n = suche(() => zz(123, 987), (x) => new Set(stellen(x)).size === 3 && !stellen(x).includes(0)), i = zz(0, 2), z = stellen(n), wort = ['Hundertern', 'Zehnern', 'Einern'][i];
      return zahl(Z(`Schau auf die Zahl ${n}.`, `Welche Ziffer steht bei den ${wort}?`), z[i], fehlerliste(z[i], z.filter((_, j) => j !== i).map((x) => [x, 'stellenwert'])),
        h3('Die Einer stehen ganz rechts. Links daneben stehen die Zehner.', 'In 472 steht die 7 bei den Zehnern.', `Suche in der Tafel die Spalte ${['H', 'Z', 'E'][i]}.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'stelle', zahl: n, stelle: ['H', 'Z', 'E'][i], ziffer: z[i] }] }); },
    () => { const h = zz(1, 5), e = zz(1, 6), mitte = wahl([true, false]), z = mitte ? [h, 0, e] : [h, e, 0], n = Number(z.join(''));
      return zahl(Z('In der Stellenwerttafel liegen Plättchen.', 'Welche Zahl ist gelegt?'), n, fehlerliste(n, [[h * 10 + e, 'null-platzhalter'], [mitte ? h * 100 + e * 10 : h * 100 + e, 'tafel-verrutscht']]),
        h3('Zähle die Plättchen in jeder Spalte. Für eine leere Spalte schreibst du 0.', '2 Plättchen bei H, keins bei Z, 4 bei E: Das ist 204.', `Bei den Hundertern liegen ${h} Plättchen. Eine Spalte ist leer.`),
        { bild: B.ziffern(['H', 'Z', 'E'], z, { plaettchen: true }), nachweis: [{ art: 'tafel', zahl: n }] }); },
    () => { const h = zz(2, 9), e = zz(1, 9), n = h * 100 + e;
      return trage(Z(`Eine Zahl hat ${h} Hunderter und ${e} Einer.`, 'Zehner hat sie keine.', 'Trage die Zahl in die Stellenwerttafel ein.'), n, 3,
        h3('Auch die leere Stelle braucht eine Ziffer. Dort steht eine 0.', '5 Hunderter und 3 Einer: 5 bei H, 0 bei Z, 3 bei E.', `Trage ${h} bei H ein. Bei Z steht eine 0.`), { nachweis: N(`${h} · 100 + ${e}`) }); },
    () => { const t = zz(1, 9), z = zz(1, 9), mitH = wahl([true, false]), h = mitH ? zz(1, 9) : 0, zz_ = mitH ? 0 : z, n = t * 1000 + h * 100 + zz_ * 10;
      return trage(Z(`Trage die Zahl ${n} in die Stellenwerttafel ein.`, 'Achte auf die Nullen.'), n, 4,
        h3('Jede Ziffer bekommt ein eigenes Feld. Auch die 0 wird eingetragen.', 'Die Zahl 3050: 3 bei T, 0 bei H, 5 bei Z, 0 bei E.', `Beginne links: ${t} gehört zu den Tausendern.`)); },
  ]);
  sechs(N_('N3'), 'G', [
    () => { const t = zz(2, 9), z = zz(1, 9), e = zz(1, 9), n = t * 1000 + z * 10 + e;
      return zahl(Z(`Eine Zahl hat ${t} Tausender, ${z} Zehner und ${e} Einer.`, 'Schreibe die Zahl.'), n, fehlerliste(n, [[t * 100 + z * 10 + e, 'null-platzhalter'], [t * 1000 + z * 100 + e * 10, 'tafel-verrutscht']]),
        h3('Welcher Stellenwert fehlt? Dort steht eine 0.', '4 Tausender, 7 Zehner und 2 Einer: 4072.', `Die Hunderter fehlen. Schreibe dort eine 0.`), { nachweis: N(`${t} · 1000 + ${z} · 10 + ${e}`) }); },
    () => { const n = suche(() => zz(10, 98) * 1000 + zz(0, 9) * 100 + zz(0, 9) * 10 + zz(0, 9), (x) => stellen(x).filter((c) => c === 0).length >= 1 && stellen(x).filter((c) => c === 0).length <= 2);
      return trage(Z(`Trage die Zahl ${fz(n)} in die Stellenwerttafel ein.`), n, 5,
        h3('ZT heißt Zehntausender. Beginne ganz rechts bei den Einern.', 'Die Zahl 40 720: 4 bei ZT, 0 bei T, 7 bei H, 2 bei Z, 0 bei E.', `Die letzte Ziffer ${n % 10} gehört zu den Einern.`)); },
    () => { const n = suche(() => zz(1234, 9876), (x) => new Set(stellen(x)).size === 4 && !stellen(x).includes(0)), i = zz(0, 2), z = stellen(n), wert = z[i] * 10 ** (3 - i);
      return zahl(Z(`Schau auf die Zahl ${n}.`, `Welchen Wert hat die Ziffer ${z[i]} in dieser Zahl?`), wert, fehlerliste(wert, [[z[i], 'stellenwert'], [wert / 10, 'stellenwert'], [wert * 10, 'stellenwert']]),
        h3('Der Stellenwert sagt, wie viel eine Ziffer wert ist.', 'In 4725 steht die 7 bei den Hundertern. Sie ist 700 wert.', `Die Ziffer ${z[i]} steht bei den ${['Tausendern', 'Hundertern', 'Zehnern'][i]}.`),
        { nachweis: [{ art: 'stelle', zahl: n, stelle: ['T', 'H', 'Z'][i], ziffer: z[i] }, ...N(`${z[i]} · ${10 ** (3 - i)}`)] }); },
    () => { const n = suche(() => zz(10, 98) * 1000 + zz(0, 9) * 100 + zz(0, 9) * 10 + zz(0, 9), (x) => stellen(x).filter((c) => c === 0).length === 2), z = stellen(n);
      return zahl(Z('Schau auf die Stellenwerttafel.', 'Welche Zahl steht dort?'), n, fehlerliste(n, [[Number(z.filter((c) => c !== 0).join('')), 'null-platzhalter'], [Math.floor(n / 10), 'tafel-verrutscht']]),
        h3('Lies von links nach rechts. Auch jede 0 gehört zur Zahl.', '4 bei ZT, 0 bei T, 7 bei H, 2 bei Z, 0 bei E: Das ist 40 720.', `Die Zahl hat 5 Stellen. Sie beginnt mit ${z[0]}.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'tafel', zahl: n }] }); },
    () => { const h = zz(1, 6), z = zz(11, 18), e = zz(1, 9), n = h * 100 + z * 10 + e;
      return zahl(Z('Bei den Zehnern liegen zu viele Plättchen.', '10 Zehner sind 1 Hunderter.', 'Welche Zahl ist gelegt?'), n, fehlerliste(n, [[h * 1000 + z * 10 + e, 'stellenwert'], [h * 100 + (z - 10) * 10 + e, 'stellenwert']]),
        h3('Tausche 10 Plättchen bei Z gegen 1 Plättchen bei H.', '2 bei H, 14 bei Z, 5 bei E: Tausche um. Dann sind es 3 bei H und 4 bei Z. Die Zahl ist 345.', `Nach dem Tauschen liegen ${h + 1} Plättchen bei H und ${z - 10} bei Z.`),
        { bild: B.ziffern(['H', 'Z', 'E'], [h, z, e], { plaettchen: true }), nachweis: N(`${h} · 100 + ${z} · 10 + ${e}`) }); },
    () => { const k = kind(), t = zz(2, 9), e = zz(1, 9), wort = `${['', '', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'][t]}tausend${['', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'][e]}`, n = t * 1000 + e;
      return auswahl(Z(`${k} soll die Zahl ${wort} schreiben.`, `${k} schreibt ${t * 100 + e}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'null-platzhalter'), opt(`Falsch. Richtig ist ${n}.`, true), opt(`Falsch. Richtig ist ${t}000${e}.`, false, 'zahl-nach-gehoer')],
        h3('Schreibe die Zahl in die Stellenwerttafel. Jede Stelle bekommt eine Ziffer.', 'Viertausendsechs: 4 Tausender, 0 Hunderter, 0 Zehner, 6 Einer. Das ist 4006.', `Die Zahl hat ${t} Tausender und ${e} Einer. Dazwischen stehen 2 Nullen.`),
        { nachweis: [U(false), HILFSZAHL(n, `die Zahl ${wort}`)] }); },
  ]);
  sechs(N_('N3'), 'M', [
    () => { const ht = zz(1, 9), t = zz(1, 9), z = zz(1, 9), n = ht * 100000 + t * 1000 + z * 10;
      return trage(`Eine Zahl besteht aus ${ht} Hunderttausendern, ${t} Tausendern und ${z} Zehnern. Trage sie in die Stellenwerttafel ein.`, n, 6,
        h2('Jede Stelle, die nicht genannt ist, bekommt eine 0.', `Bei HT steht ${ht}, bei ZT steht 0.`), { nachweis: N(`${ht} · 100000 + ${t} · 1000 + ${z} · 10`) }); },
    () => { const n = zz(12, 98) * 1000 + zz(1, 9) * 100, auf_ = wahl([[100, 'Hunderter'], [10, 'Zehner']]);
      return zahl(`Wie viele ${auf_[1]} sind ${fz(n)} insgesamt?`, n / auf_[0], fehlerliste(n / auf_[0], [[Math.floor(n / auf_[0]) % 10, 'stellenwert'], [n / auf_[0] / 10, 'stellenwert']]),
        h2(`Gefragt ist nicht die Ziffer an einer Stelle, sondern wie oft ${auf_[0]} in die ganze Zahl passt.`, `Rechne ${fz(n)} : ${auf_[0]}.`), { nachweis: N(`${n} : ${auf_[0]}`) }); },
    () => { const n = suche(() => zz(11, 88) * 1000 + zz(100, 899), (x) => Math.floor(x / 1000) % 10 <= 5), k = zz(2, 4), [stufe, wort] = wahl([[1000, 'Tausenderstelle'], [100, 'Hunderterstelle']]);
      if (Math.floor(n / stufe) % 10 + k > 9) return null;
      return zahl(`In der Zahl ${fz(n)} wird die Ziffer an der ${wort} um ${k} erhöht. Wie heißt die neue Zahl?`, n + k * stufe, fehlerliste(n + k * stufe, [[n + k, 'stellenwert'], [n + k * stufe * 10, 'stellenwert'], [n + k * stufe / 10, 'stellenwert']]),
        h2('Nur eine Ziffer ändert sich. Alle anderen Stellen bleiben, wie sie sind.', `An der ${wort} steht ${Math.floor(n / stufe) % 10}. Daraus wird ${Math.floor(n / stufe) % 10 + k}.`), { nachweis: N(`${k} · ${stufe}`, `${n} + ${k * stufe}`) }); },
    () => { const a = zz(2, 9), b = zz(1, 9), c = zz(1, 9), n = a * 10000 + b * 100 + c;
      return zahl(`Schreibe als eine Zahl: ${a} · 10${' '}000 + ${b} · 100 + ${c}`, n, fehlerliste(n, [[a * 100 + b * 10 + c, 'null-platzhalter'], [a * 1000 + b * 100 + c, 'tafel-verrutscht'], [a * 10000 + b * 1000 + c, 'tafel-verrutscht']]),
        h2('Die Stufenzahlen nennen die Stellen: 10 000 sind die Zehntausender, 100 die Hunderter.', `Tausender und Zehner fehlen. Dort stehen Nullen.`), { nachweis: N(`${a} · 10000 + ${b} · 100 + ${c}`) }); },
    () => { const [gross, wg] = wahl([[1000000, 'einer Million'], [100000, 'hunderttausend'], [10000, 'zehntausend']]), [klein, wk] = wahl([[100, 'Hunderter'], [10, 'Zehner'], [1000, 'Tausender']].filter(([x]) => x * 10 <= gross));
      return zahl(`Wie viele ${wk} braucht man, um ${wg === 'einer Million' ? 'eine Million' : wg} zu legen?`, gross / klein, fehlerliste(gross / klein, [[gross / klein / 10, 'stellenwert'], [gross / klein * 10, 'stellenwert']]),
        h2('Jede Stufenzahl ist zehnmal so groß wie die Stufenzahl davor.', `Schreibe beide Zahlen in die Stellenwerttafel und vergleiche die Zahl der Nullen.`), { nachweis: [HILFSZAHL(gross, 'die genannte Stufenzahl'), HILFSZAHL(klein, 'der genannte Stellenwert'), ...N(`${gross} : ${klein}`)] }); },
    () => { const n = suche(() => zz(1234, 9876), (x) => { const z = stellen(x); return z[1] < z[2] && !z.includes(0) && new Set(z).size === 4; }), z = stellen(n), neu = Number([z[0], z[2], z[1], z[3]].join(''));
      return zahl(`In der Zahl ${n} werden die Ziffern an der Hunderterstelle und an der Zehnerstelle vertauscht. Um wie viel wird die Zahl größer?`, neu - n, fehlerliste(neu - n, [[z[2] - z[1], 'stellenwert'], [(z[2] - z[1]) * 100, 'stellenwert'], [(z[2] - z[1]) * 10, 'stellenwert']]),
        h2('Schreibe die neue Zahl auf und vergleiche sie mit der alten.', `Die neue Zahl ist ${neu}.`), { nachweis: [HILFSZAHL(neu, 'die Zahl mit vertauschten Ziffern'), ...N(`${neu} − ${n}`)] }); },
  ]);
  sechs(N_('N3'), 'E', [
    () => { const t = zz(12, 48), h = zz(11, 19), e = zz(1, 9), n = t * 1000 + h * 100 + e;
      return trage(`Eine Zahl besteht aus ${t} Tausendern, ${h} Hundertern und ${e} Einern. Trage sie in die Stellenwerttafel ein.`, n, 5,
        h1('In jedes Feld passt nur eine Ziffer. 10 Hunderter werden zu einem Tausender gebündelt.'), { nachweis: N(`${t} · 1000 + ${h} · 100 + ${e}`) }); },
    () => { const n = zz(12, 98) * 10000;
      return luecken(`Die Zahl ${fz(n)} besteht insgesamt aus {{a}} Tausendern. Man kann auch sagen: Sie besteht aus {{b}} Zehnern.`, { a: [n / 1000, fehlerliste(n / 1000, [[Math.floor(n / 1000) % 10, 'stellenwert']])], b: [n / 10, fehlerliste(n / 10, [[0, 'stellenwert'], [n / 100, 'stellenwert']])] },
        h1('Gefragt ist, wie oft der Stellenwert in die ganze Zahl passt, nicht die Ziffer an dieser Stelle.'), { nachweis: N(`${n} : 1000`, `${n} : 10`), lang: true }); },
    () => { const [st, gr, wort] = wahl([[5, 99999, 'fünfstellige'], [6, 999999, 'sechsstellige']]), [stufe, name] = wahl([[100, 'Hunderterstelle'], [1000, 'Tausenderstelle'], [10, 'Zehnerstelle']]);
      return zahl(`Wie heißt die größte ${wort} Zahl, an deren ${name} eine 0 steht?`, gr - 9 * stufe, fehlerliste(gr - 9 * stufe, [[gr, 'null-platzhalter'], [gr - 9 * stufe * 10, 'tafel-verrutscht'], [gr - 9 * stufe / 10, 'tafel-verrutscht']]),
        h1('An allen anderen Stellen soll die größte Ziffer stehen.'), { nachweis: [HILFSZAHL(gr, `größte ${wort} Zahl`), ...N(`9 · ${stufe}`, `${gr} − ${9 * stufe}`)] }); },
    () => auswahl('Die Römer hatten kein Zeichen für die Null. Warum braucht unser Zehnersystem die Ziffer 0?', [
      opt('Die 0 hält eine Stelle frei. Ohne sie könnte man 305 und 35 nicht unterscheiden.', true),
      opt('Die 0 macht jede Zahl zehnmal so groß, egal, wo sie steht.', false, 'stellenwert'),
      opt('Die 0 braucht man nur am Ende einer Zahl, in der Mitte kann man sie weglassen.', false, 'null-platzhalter'),
      opt('Die 0 braucht man eigentlich nicht, sie hat ja keinen Wert.', false, 'null-platzhalter')],
    h1('Schreibe 3 Hunderter und 5 Einer einmal mit und einmal ohne die 0 auf.'), { nachweis: [{ art: 'vergleich', links: '35', rechts: '305', zeichen: '<' }] }),
    () => { const [klein, wk] = wahl([[100, 'Hunderter'], [1000, 'Tausender']]), [mittel, wm] = wahl([[10000, 'Zehntausender'], [100000, 'Hunderttausender']]);
      return luecken(`Eine Million sind {{a}} ${wk} oder {{b}} ${wm}.`, { a: [1000000 / klein, fehlerliste(1000000 / klein, [[100000 / klein, 'stellenwert']])], b: [1000000 / mittel, fehlerliste(1000000 / mittel, [[10000000 / mittel, 'stellenwert']])] },
        h1('Vergleiche die Zahl der Nullen der beiden Stufenzahlen.'), { nachweis: [HILFSZAHL(1000000, 'eine Million'), HILFSZAHL(klein, wk), HILFSZAHL(mittel, wm), ...N(`1000000 : ${klein}`, `1000000 : ${mittel}`)], lang: true }); },
    () => { const [st, wort, erste] = wahl([[3, 'dreistellige', 9], [4, 'vierstellige', 90]]), name = wahl(['Zehnerstelle', 'Einerstelle']);
      return zahl(`Wie viele ${wort} Zahlen haben an der ${name} eine 0?`, erste * 10, fehlerliste(erste * 10, [[erste, 'stellenwert'], [erste * 10 + 10, 'null-platzhalter'], [100, 'null-platzhalter']]),
        h1('Zähle, wie viele Ziffern an jeder der anderen Stellen möglich sind. Die erste Stelle darf nicht 0 sein.'), { nachweis: st === 3 ? N('9 · 10') : N('9 · 10', '90 · 10') }); },
  ]);
}
