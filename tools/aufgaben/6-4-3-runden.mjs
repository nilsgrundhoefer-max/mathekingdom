// Aufgaben zu 6.4.3 „Dezimalzahlen runden“ (Lernziele R1, R2) nach ADR 0015 und ADR 0047.
// R1: auf eine Stelle runden. R2: sinnvoll runden bei Geld, Größen und Taschenrechner, ab E die Genauigkeit bewerten (BP 20).
// Grilling mit Nils (2026-11-25): Endnullen werden nie verlangt. 3,96 auf Zehntel ist 4,0, und auch 4 ist richtig.
// Die Lösung zeigt die Null; die App schreibt dazu „Man darf die Null schreiben …“. Übertrag über die 9 ab G, schrittweises Runden ist ein typischer Fehler.

import { sechs, auswahl, luecken, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, opt, zz, wahl, mische, kind, T, dfe, alsPaar, runde, abschneiden, rundeKette, strahlSpec } from './6-4-dezimal.mjs';

const R1 = '6.4.3-R1', R2 = '6.4.3-R2';
// Ein Nachweis „gerundet“: zahl auf `stelle` Stellen nach dem Komma ist ergebnis.
const RN = (zahl, stelle, ergebnis, extra = {}) => ({ art: 'runden', zahl, stelle, ergebnis, ...extra });
const RW = (stelle, ergebnis, extra = {}) => ({ art: 'rundenwahl', stelle, ergebnis, ...extra });
// z · 10^−k gerundet auf `auf` Stellen, mit allen Stellen (auch der Endnull).
const G = (z, k, auf) => (auf === 0 ? runde(z, k, 0) : T(runde(z, k, auf), auf, auf));
// Typische Fehler beim Runden: abgeschnitten, Stelle für Stelle von hinten, an der falschen Stelle.
const rundFehler = (z, k, auf) => dfe(G(z, k, auf), [[T(abschneiden(z, k, auf), auf, auf), 'runden-abschneiden'], [T(rundeKette(z, k, auf), auf, auf), 'runden-kette'], ...(auf + 1 < k ? [[T(runde(z, k, auf + 1), auf + 1), 'runden-falsche-stelle']] : [])]);
const NAMEN = { 0: 'Ganze', 1: 'Zehntel', 2: 'Hundertstel', 3: 'Tausendstel' };
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
const verschieden = (liste) => new Set(liste.map((t) => Number(String(t).replace(/[^\d,]/g, '').replace(',', '.')))).size === liste.length;

export function runden6() {
  // ================= R1: auf eine Stelle runden =================
  const tF = h3('Schau auf die Ziffer rechts neben den Zehnteln. Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.', '2,46 auf Zehntel: Rechts neben der 4 steht 6. Also aufrunden: 2,5.', 'Am Zahlenstrahl siehst du, welches Zehntel näher liegt.');
  sechs(R1, 'F', [
    () => { const z = zz(1, 8), p = z * 10 + zz(1, 9);
      if (p % 10 === 5) return null;
      return dezimal(Z(`Runde ${T(p, 2)} auf Zehntel.`, 'Der Pfeil zeigt die Zahl.'), G(p, 2, 1), rundFehler(p, 2, 1), tF,
        { bild: B.strahl(strahlSpec(z * 10, z * 10 + 10, 100, 5, { pfeil: p })), nachweis: [RN(T(p, 2), 1, G(p, 2, 1))] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), h = zz(1, 9), p = g * 100 + z * 10 + h, lsg = G(p, 2, 1), ab = T(g * 10 + z, 1), auf = T(g * 10 + z + 1, 1);
      if (h === 5) return null;
      return auswahl(Z(`Runde ${T(p, 2)} auf Zehntel.`, 'Kreuze das Ergebnis an.'), richtigZuerst([opt(ab, ab === lsg, 'runden-abschneiden'), opt(auf, auf === lsg, 'runden-fuenf-ab'), opt(T(p, 2), false, 'runden-ziffern-stehen')]), tF,
        { bild: B.strahl(strahlSpec(g * 100 + z * 10, g * 100 + z * 10 + 10, 100, 5, { ausschnitt: true, pfeil: p })), nachweis: [RN(T(p, 2), 1, lsg), { art: 'wert', wert: lsg }] }); },
    () => { const e = zz(2, 8), c = wahl([5, 15, 25, 35, 45, 55, 65, 75, 85, 95].filter((x) => x !== 50)), p = e * 100 + c, preis = T(p, 2, 2), lsg = runde(p, 2, 0);
      return dezimal(Z(`Ein Heft kostet ${preis} €.`, 'Runde den Preis auf ganze Euro.'), lsg, dfe(lsg, [[e, 'runden-abschneiden'], [e + 1, 'runden-fuenf-ab']]), h3('Ab 50 Cent rundest du auf. Unter 50 Cent rundest du ab.', '2,65 € sind mehr als 2,50 €. Also rundest du auf 3 €.', 'Vergleiche den Preis mit der Hälfte. Liegt er darüber, rundest du auf.'),
        { einheit: '€', bild: B.strahl(strahlSpec(e * 100, e * 100 + 100, 100, 50, { schritt: 5, ausschnitt: true, pfeil: p })), nachweis: [RN(`${preis} €`, 0, `${lsg} €`, { einheit: '€' })] }); },
    () => { const e = zz(1, 9), z = zz(1, 8), h = zz(1, 9), p = e * 100 + z * 10 + h;
      if (h === 5) return null;
      return dezimal(Z(`Runde die Zahl aus der Stellenwerttafel auf Zehntel.`), G(p, 2, 1), rundFehler(p, 2, 1), tF,
        { bild: B.kommaTafel(['E', 'z', 'h'], [e, z, h]), nachweis: [{ art: 'tafelbild', zahl: T(p, 2) }, RN(T(p, 2), 1, G(p, 2, 1))] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), a = g * 100 + z * 10 + zz(1, 4), c = g * 100 + z * 10 + zz(6, 9);
      return luecken(Z('Runde beide Zahlen auf Zehntel.', `${T(a, 2)} ≈ {{a}}`, `${T(c, 2)} ≈ {{b}}`), { a: [G(a, 2, 1), dfe(G(a, 2, 1), [[T(g * 10 + z + 1, 1), 'runden-fuenf-ab']])], b: [G(c, 2, 1), dfe(G(c, 2, 1), [[T(g * 10 + z, 1), 'runden-abschneiden']])] },
        h3('Das Zeichen ≈ bedeutet: ist fast gleich.', '4,72 ≈ 4,7 und 4,78 ≈ 4,8.', 'Schau bei jeder Zahl auf die Hundertstel.'), { bild: B.strahl(strahlSpec(g * 100 + z * 10, g * 100 + z * 10 + 10, 100, 5, { ausschnitt: true, punkte: [a, c] })), nachweis: [RN(T(a, 2), 1, G(a, 2, 1)), RN(T(c, 2), 1, G(c, 2, 1))] }); },
    () => { const e = zz(1, 8), z = wahl([1, 2, 3, 4, 6, 7, 8, 9]), p = e * 10 + z, lsg = runde(p, 1, 0);
      return dezimal(Z(`Runde ${T(p, 1)} auf Ganze.`), lsg, dfe(lsg, [[z >= 5 ? e : e + 1, z >= 5 ? 'runden-abschneiden' : 'runden-fuenf-ab']]), h3('Schau auf die Zehntel. Ab 5 Zehntel rundest du auf.', '3,6 auf Ganze: 6 Zehntel. Also aufrunden: 4.', 'Am Zahlenstrahl siehst du, welche ganze Zahl näher liegt.'),
        { bild: B.strahl(strahlSpec(e * 10, e * 10 + 10, 10, 5, { ausschnitt: true, pfeil: p })), nachweis: [RN(T(p, 1), 0, String(lsg))] }); },
  ]);
  const tG = h3('Unterstreiche die Rundungsstelle. Schau nur auf die Ziffer rechts daneben.', '2,347 auf Hundertstel: Rechts neben der 4 steht 7. Also 2,35.', 'Wird eine 9 aufgerundet, wird daraus 10. Dann wächst die Stelle links davon.');
  sechs(R1, 'G', [
    () => { const g = zz(1, 9), k = zz(101, 999), p = g * 1000 + k;
      if (k % 10 === 5 || k % 10 === 0 || Math.floor(k / 10) % 10 === 9) return null;
      return dezimal(Z(`Runde ${T(p, 3)} auf Hundertstel.`), G(p, 3, 2), rundFehler(p, 3, 2), tG, { bild: B.kommaTafel(['E', 'z', 'h', 't'], [g, Math.floor(k / 100), Math.floor(k / 10) % 10, k % 10]), nachweis: [RN(T(p, 3), 2, G(p, 3, 2))] }); },
    () => { const g = zz(1, 8), p = g * 100 + 90 + zz(5, 9);
      return dezimal(Z(`Runde ${T(p, 2)} auf Zehntel.`), G(p, 2, 1), dfe(G(p, 2, 1), [[`${g},10`, 'runden-uebertrag'], [T(g * 10 + 9, 1), 'runden-abschneiden']]), tG, { bild: B.kommaTafel(['E', 'z', 'h'], [g, 9, p % 10]), nachweis: [RN(T(p, 2), 1, G(p, 2, 1))] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), h = zz(1, 8), t = zz(1, 9), p = g * 1000 + z * 100 + h * 10 + t;
      if (t === 5 || h === 5 || h === 4) return null;
      return luecken(Z(`Runde ${T(p, 3)} zweimal.`, `Auf Zehntel: {{a}}`, `Auf Hundertstel: {{b}}`), { a: [G(p, 3, 1), rundFehler(p, 3, 1)], b: [G(p, 3, 2), rundFehler(p, 3, 2)] }, tG,
        { nachweis: [RN(T(p, 3), 1, G(p, 3, 1)), RN(T(p, 3), 2, G(p, 3, 2))] }); },
    () => { const h = zz(11, 89), p = h * 10 + zz(1, 9);
      if (p % 10 === 5 || h % 10 === 9) return null;
      return dezimal(Z(`Runde ${T(p, 3)} auf Hundertstel.`, 'Der Pfeil zeigt die Zahl.'), G(p, 3, 2), rundFehler(p, 3, 2), tG,
        { bild: B.strahl(strahlSpec(h * 10, h * 10 + 10, 1000, 5, { ausschnitt: true, pfeil: p })), nachweis: [RN(T(p, 3), 2, G(p, 3, 2))] }); },
    () => { const g = zz(1, 8), z = zz(1, 8), ziel = T(g * 10 + z, 1), basis = g * 100 + z * 10;
      const liste = mische([[basis - 5, true], [basis + 4, true], [basis - 6, false], [basis + 5, false]]).slice(0, 4);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z('Runde jede Zahl auf Zehntel.', `Kreuze alle Zahlen mit dem Ergebnis ${ziel} an.`), liste.map(([w, r]) => opt(T(w, 2), r, r ? undefined : w < basis ? 'runden-abschneiden' : 'runden-fuenf-ab')), tG,
        { mehrfach: true, bild: B.strahl(strahlSpec(basis - 10, basis + 10, 100, 5, { ausschnitt: true, punkte: liste.map(([w]) => w) })), nachweis: [RW(1, ziel)] }); },
    () => { const g = zz(1, 9), z = zz(1, 7), p = g * 1000 + z * 100 + 4 * 10 + zz(5, 9), kn = kind(), zwischen = G(p, 3, 2), falsch = G(runde(p, 3, 2), 2, 1), lsg = G(p, 3, 1);
      return auswahl(Z(`${kn} rundet ${T(p, 3)} auf Zehntel.`, `${kn} rundet zuerst auf ${zwischen}.`, `Dann rundet ${kn} auf ${falsch}.`, 'Beurteile das Ergebnis.'),
        [opt(`Falsch. ${T(p, 3)} ≈ ${lsg}. Man rundet in einem Schritt.`, true), opt('Stimmt.', false, 'runden-kette'), opt(`Stimmt, denn ${zwischen} ≈ ${falsch}.`, false, 'runden-kette')], tG,
        { nachweis: [{ wert: zwischen, grund: 'Zwischenschritt des Kindes' }, RN(T(p, 3), 1, lsg, { behauptet: falsch })] }); },
  ]);
  const tM = h2('Suche die Rundungsstelle und schau nur auf die Ziffer rechts daneben. Alles dahinter spielt keine Rolle.', 'Bei 5 bis 9 wird die Rundungsstelle um 1 größer. Aus einer 9 wird dabei 10, und die Stelle links wächst mit.');
  sechs(R1, 'M', [
    () => { const g = zz(1, 9), k = zz(1001, 9999), p = g * 10000 + k;
      if (k % 10 === 5 || k % 10 === 0 || Math.floor(k / 10) % 10 === 9) return null;
      return dezimal(Z(`Runde ${T(p, 4)} auf Tausendstel.`), G(p, 4, 3), rundFehler(p, 4, 3), tM, { nachweis: [RN(T(p, 4), 3, G(p, 4, 3))] }); },
    () => { const g = zz(0, 4), z = zz(0, 8), p = g * 10000 + z * 1000 + 9 * 100 + zz(5, 9) * 10 + zz(1, 9);
      return dezimal(Z(`Runde ${T(p, 4)} auf Hundertstel.`), G(p, 4, 2), dfe(G(p, 4, 2), [[`${g},${z}10`, 'runden-uebertrag'], [T(g * 100 + z * 10 + 9, 2), 'runden-abschneiden']]), tM, { nachweis: [RN(T(p, 4), 2, G(p, 4, 2))] }); },
    () => { const g = zz(1, 9), k = zz(1001, 9999), p = g * 10000 + k;
      if ([1, 2, 3].some((s) => [4, 5].includes(Math.floor(k / 10 ** (3 - s)) % 10)) || k % 10 === 0) return null;
      return luecken(Z(`Runde ${T(p, 4)}.`, 'Auf Ganze: {{a}}', 'Auf Zehntel: {{b}}', 'Auf Hundertstel: {{c}}'), { a: [G(p, 4, 0), rundFehler(p, 4, 0)], b: [G(p, 4, 1), rundFehler(p, 4, 1)], c: [G(p, 4, 2), rundFehler(p, 4, 2)] }, tM,
        { nachweis: [RN(T(p, 4), 0, G(p, 4, 0)), RN(T(p, 4), 1, G(p, 4, 1)), RN(T(p, 4), 2, G(p, 4, 2))] }); },
    () => { const e = zz(2, 9), c = zz(101, 999), p = e * 1000 + c, lsg = G(p, 3, 2);
      if (c % 10 === 5 || c % 10 === 0 || Math.floor(c / 10) % 10 === 9) return null;
      return dezimal(Z(`Ein Rechner zeigt ${T(p, 3)} € an.`, 'Runde den Betrag auf Cent.'), lsg, rundFehler(p, 3, 2), h2('Ein Cent ist ein Hundertstel Euro. Runde also auf Hundertstel.', 'Schau auf die dritte Stelle nach dem Komma.'),
        { einheit: '€', nachweis: [RN(`${T(p, 3)} €`, 2, `${lsg} €`, { einheit: '€' })] }); },
    () => { const g = zz(1, 8), z = zz(1, 8), h = zz(1, 8), ziel = G(g * 100 + z * 10 + h, 2, 2), basis = (g * 100 + z * 10 + h) * 10;
      const liste = mische([[basis - 5, true], [basis + 4, true], [basis - 1, true], [basis + 5, false], [basis - 6, false], [basis + 9, false]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Kreuze alle Zahlen an, die auf Hundertstel gerundet ${ziel} ergeben.`), liste.map(([w, r]) => opt(T(w, 3), r, r ? undefined : w < basis ? 'runden-abschneiden' : 'runden-fuenf-ab')), tM,
        { mehrfach: true, nachweis: [RW(2, ziel)] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), h = zz(1, 8), p = (g * 100 + z * 10 + h) * 100 + zz(51, 99), kn = kind(), falsch = T(abschneiden(p, 4, 2), 2, 2), lsg = G(p, 4, 2);
      if (p % 10 === 0) return null;
      return auswahl(Z(`${kn} rundet ${T(p, 4)} auf Hundertstel und schreibt ${falsch}.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. ${T(p, 4)} ≈ ${lsg}. Die dritte Stelle ist ${Math.floor(p / 10) % 10}, also aufrunden.`, true), opt('Stimmt.', false, 'runden-abschneiden'), opt('Stimmt, denn beim Runden fallen die Ziffern hinten einfach weg.', false, 'runden-abschneiden')], tM,
        { nachweis: [RN(T(p, 4), 2, lsg, { behauptet: falsch })] }); },
  ]);
  sechs(R1, 'E', [
    () => { const g = zz(2, 8), h = zz(11, 89), ziel = T(g * 100 + h, 2), basis = (g * 100 + h) * 10;
      if (h % 10 === 0) return null;
      const liste = mische([[basis - 5, true], [basis + 4, true], [basis + 5, false], [basis - 6, false], [basis + 1, true], [basis - 15, false]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Eine Zahl mit drei Stellen nach dem Komma wird auf Hundertstel gerundet.`, `Das Ergebnis ist ${ziel}.`, 'Kreuze alle Zahlen an, die es gewesen sein können.'), liste.map(([w, r]) => opt(T(w, 3), r, r ? undefined : 'runden-fuenf-ab')),
        h1('Überlege, ab welcher Zahl aufgerundet wird und bis zu welcher Zahl abgerundet wird.'), { mehrfach: true, nachweis: [RW(2, ziel)] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), ziel = T(g * 10 + z, 1), grenze = T(g * 100 + z * 10 + 5, 2), lsg = T(g * 1000 + z * 100 + 49, 3);
      return dezimal(Z('Eine Zahl hat drei Stellen nach dem Komma.', `Auf Zehntel gerundet ergibt sie ${ziel}.`, 'Gib die größte Zahl an, die es sein kann.'), lsg, dfe(lsg, [[T(g * 1000 + z * 100 + 99, 3), 'runden-abschneiden'], [T(g * 1000 + z * 100 + 50, 3), 'runden-fuenf-ab'], [T(g * 1000 + z * 100 + 4, 3), 'runden-falsche-stelle']]),
        h1(`Ab ${grenze} wird schon aufgerundet. Nimm die Zahl mit drei Stellen direkt davor.`), { nachweis: [{ wert: grenze, grund: 'ab hier wird aufgerundet' }, `${grenze} − 0,001 = ${lsg}`, RN(lsg, 1, ziel)] }); },
    () => { const g = zz(1, 8), p = g * 10000 + 9990 + zz(5, 9), a = G(p, 4, 3), c = G(p, 4, 2), e = G(p, 4, 1);
      return luecken(Z(`Runde ${T(p, 4)}.`, 'Auf Tausendstel: {{a}}', 'Auf Hundertstel: {{b}}', 'Auf Zehntel: {{c}}'), { a: [a, dfe(a, [[`${g},9910`, 'runden-uebertrag']])], b: [c, dfe(c, [[`${g},100`, 'runden-uebertrag'], [T(g * 100 + 99, 2), 'runden-abschneiden']])], c: [e, dfe(e, [[`${g},10`, 'runden-uebertrag'], [T(g * 10 + 9, 1), 'runden-abschneiden']])] },
        h1('Wird eine 9 aufgerundet, wird daraus 10. Die Stelle links davon wächst um 1, auch mehrmals hintereinander.'), { nachweis: [RN(T(p, 4), 3, a), RN(T(p, 4), 2, c), RN(T(p, 4), 1, e)] }); },
    () => { const g = zz(1, 9), z = zz(1, 7), p = (g * 100 + z * 10 + 4) * 100 + 4 * 10 + zz(5, 9), kn = kind(), lsg = G(p, 4, 1), falsch = T(rundeKette(p, 4, 1), 1, 1);
      if (falsch === lsg) return null;
      return auswahl(Z(`${kn} rundet ${T(p, 4)} Stelle für Stelle von hinten auf Zehntel.`, `${kn} erhält ${falsch}.`, 'Finde den Fehler.'),
        [opt(`Falsch. ${T(p, 4)} ≈ ${lsg}. Es zählt nur die Ziffer rechts neben den Zehnteln.`, true), opt('Stimmt.', false, 'runden-kette'), opt('Stimmt, denn jede Stelle wurde richtig gerundet.', false, 'runden-kette')],
        h1('Runde in einem Schritt. Schau nur auf die Ziffer rechts neben der Rundungsstelle.'), { nachweis: [RN(T(p, 4), 1, lsg, { behauptet: falsch })] }); },
    () => { const z = zz(1, 8), ziel = `0,${z}0`, basis = z * 100;
      const liste = mische([[basis * 10 - 50, true], [basis * 10 + 49, true], [basis * 10 + 50, false], [basis * 10 - 51, false], [basis * 10, true], [basis * 10 - 100, false]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Kreuze alle Zahlen an, die auf Hundertstel gerundet ${ziel} ergeben.`), liste.map(([w, r]) => opt(T(w, 4), r, r ? undefined : 'runden-fuenf-ab')),
        h1(`${ziel} ist dasselbe wie 0,${z}. Bestimme die kleinste und die größte Zahl, die noch dazu passt.`), { mehrfach: true, nachweis: [RW(2, ziel)] }); },
    () => { const g = zz(1, 9), z = zz(1, 8), h = zz(1, 8), ziel = T(g * 100 + z * 10 + h, 2), grenze = T((g * 100 + z * 10 + h) * 10 - 5, 3), lsg = grenze;
      return dezimal(Z('Eine Zahl hat drei Stellen nach dem Komma.', `Auf Hundertstel gerundet ergibt sie ${ziel}.`, 'Gib die kleinste Zahl an, die es sein kann.'), lsg, dfe(lsg, [[T((g * 100 + z * 10 + h) * 10 - 4, 3), 'runden-fuenf-ab'], [T((g * 100 + z * 10 + h) * 10 - 6, 3), 'runden-abschneiden']]),
        h1('Ab der Hälfte eines Hundertstels wird aufgerundet. Diese Zahl gehört schon dazu.'), { nachweis: [{ wert: '0,005', grund: 'ein halbes Hundertstel' }, `${ziel} − 0,005 = ${lsg}`, RN(lsg, 2, ziel)] }); },
  ]);

  // ================= R2: sinnvoll runden =================
  const tR2F = h3('Bei Geld rundest du auf ganze Euro. Ab 50 Cent rundest du auf.', '9,89 € sind fast 10 €. Also: 9,89 € ≈ 10 €.', 'Schau nur auf die Cent hinter dem Komma.');
  sechs(R2, 'F', [
    () => { const ware = wahl(['Buch', 'Spiel', 'Ball', 'Puzzle']), e = zz(3, 19), c = zz(51, 99), p = e * 100 + c, lsg = e + 1;
      return dezimal(Z(`Das ${ware} kostet ${T(p, 2, 2)} €.`, 'Runde den Preis auf ganze Euro.'), lsg, dfe(lsg, [[e, 'runden-abschneiden']]), tR2F,
        { einheit: '€', daten: { kopf: ['Ware', 'Preis'], zeilen: [[ware, `${T(p, 2, 2)} €`]] }, nachweis: [RN(`${T(p, 2, 2)} €`, 0, `${lsg} €`, { einheit: '€' })] }); },
    () => { const z = zz(1, 8), h = wahl([1, 2, 3, 4, 6, 7, 8, 9]), p = 100 + z * 10 + h, lsg = G(p, 2, 1);
      return dezimal(Z(`Ein Brett ist ${T(p, 2)} m lang.`, 'Runde die Länge auf Zehntel Meter.'), lsg, rundFehler(p, 2, 1), h3('Schau auf die Hundertstel. Ab 5 rundest du auf.', '1,46 m ≈ 1,5 m.', 'Am Zahlenstrahl siehst du, welches Zehntel näher liegt.'),
        { einheit: 'm', bild: B.strahl(strahlSpec(100 + z * 10, 100 + z * 10 + 10, 100, 5, { ausschnitt: true, pfeil: p })), nachweis: [RN(`${T(p, 2)} m`, 1, `${lsg} m`, { einheit: 'm' })] }); },
    () => { const waren = mische(['Brot', 'Milch', 'Käse', 'Obst']).slice(0, 3), preise = waren.map(() => zz(1, 4) * 100 + wahl([zz(10, 40), zz(60, 95)])), gerundet = preise.map((p) => runde(p, 2, 0)), summe = gerundet.reduce((x, y) => x + y, 0);
      return luecken(Z('Runde jeden Preis auf ganze Euro.', 'Rechne dann mit den gerundeten Preisen den Gesamtpreis aus.', 'Gesamtpreis: etwa {{a}} €'), { a: [summe, dfe(summe, [[preise.map((p) => Math.floor(p / 100)).reduce((x, y) => x + y, 0), 'runden-abschneiden']])] },
        h3('Runde zuerst jeden Preis. Addiere dann die gerundeten Preise.', '2,80 € ≈ 3 € und 1,20 € ≈ 1 €. Zusammen etwa 4 €.', 'Schreibe die gerundeten Preise untereinander.'),
        { daten: { kopf: ['Ware', 'Preis'], zeilen: waren.map((w, i) => [w, `${T(preise[i], 2, 2)} €`]) }, nachweis: [...preise.map((p, i) => RN(`${T(p, 2, 2)} €`, 0, `${gerundet[i]} €`, { einheit: '€' })), `${gerundet.map((g) => `${g} €`).join(' + ')} = ${summe} €`] }); },
    () => { const kn = kind(), p = zz(13, 17) * 100 + zz(1, 9) * 10 + wahl([1, 2, 3, 4, 6, 7, 8, 9]), lsg = G(p, 2, 1);
      if (Math.floor(p / 10) % 10 === 9) return null;
      return dezimal(Z(`${kn} läuft 100 m in ${T(p, 2)} s.`, 'Runde die Zeit auf Zehntel Sekunden.'), lsg, rundFehler(p, 2, 1), h3('Schau auf die zweite Stelle nach dem Komma.', '14,26 s ≈ 14,3 s.', 'Bei 0 bis 4 rundest du ab, bei 5 bis 9 auf.'),
        { einheit: 's', daten: { kopf: ['Kind', 'Zeit'], zeilen: [[kn, `${T(p, 2)} s`]] }, nachweis: [{ wert: '100 m', grund: 'Laufstrecke' }, RN(`${T(p, 2)} s`, 1, `${lsg} s`, { einheit: 's' })] }); },
    () => { const e = zz(2, 9), c = wahl([zz(10, 45), zz(55, 95)]), p = e * 100 + c, lsg = runde(p, 2, 0), ware = wahl(['Saft', 'Kuchen', 'Stift']);
      return auswahl(Z(`${ware} kostet ${T(p, 2, 2)} €.`, 'Kreuze den passend gerundeten Preis an.'), richtigZuerst([opt(`${e} €`, lsg === e, 'runden-abschneiden'), opt(`${e + 1} €`, lsg === e + 1, 'runden-fuenf-ab'), opt(`${e + 2} €`, false, 'runden-falsche-stelle')]), tR2F,
        { daten: { kopf: ['Ware', 'Preis'], zeilen: [[ware, `${T(p, 2, 2)} €`]] }, nachweis: [RN(`${T(p, 2, 2)} €`, 0, `${lsg} €`, { einheit: '€' }), { art: 'wert', wert: `${lsg} €` }] }); },
    () => { const e = zz(1, 8), z = wahl([1, 2, 3, 4, 6, 7, 8, 9]), p = e * 10 + z, lsg = runde(p, 1, 0);
      return dezimal(Z(`Ein Paket wiegt ${T(p, 1)} kg.`, 'Runde auf ganze Kilogramm.'), lsg, dfe(lsg, [[z >= 5 ? e : e + 1, z >= 5 ? 'runden-abschneiden' : 'runden-fuenf-ab']]), h3('Schau auf die Zehntel. Ab 5 Zehntel rundest du auf.', '2,7 kg ≈ 3 kg.', 'Am Zahlenstrahl siehst du, welche ganze Zahl näher liegt.'),
        { einheit: 'kg', bild: B.strahl(strahlSpec(e * 10, e * 10 + 10, 10, 5, { ausschnitt: true, pfeil: p })), nachweis: [RN(`${T(p, 1)} kg`, 0, `${lsg} kg`, { einheit: 'kg' })] }); },
  ]);
  const tR2G = h3('Überlege zuerst, auf welche Stelle du runden musst. Ein Cent ist ein Hundertstel Euro.', '1,789 € auf Cent: Rundungsstelle ist die 8. Also 1,79 €.', 'Unterstreiche die Rundungsstelle. Schau dann auf die Ziffer rechts daneben.');
  sechs(R2, 'G', [
    () => { const g = zz(2, 19), k = zz(101, 999), p = g * 1000 + k, lsg = G(p, 3, 1);
      if (Math.floor(k / 10) % 10 === 5 || k % 100 === 0 || Math.floor(k / 100) === 9) return null;
      return dezimal(Z(`Der Weg zur Burg ist ${T(p, 3)} km lang.`, 'Runde auf Zehntel Kilometer.'), lsg, rundFehler(p, 3, 1), tR2G,
        { einheit: 'km', bild: B.kommaTafel(['Z', 'E', 'z', 'h', 't'], [g >= 10 ? 1 : null, g % 10, Math.floor(k / 100), Math.floor(k / 10) % 10, k % 10]), nachweis: [RN(`${T(p, 3)} km`, 1, `${lsg} km`, { einheit: 'km' })] }); },
    () => { const p = 1000 + zz(4, 8) * 100 + zz(1, 8) * 10 + 9, lsg = G(p, 3, 2);
      return dezimal(Z(`An der Tankstelle kostet ein Liter ${T(p, 3)} €.`, 'Runde den Preis auf Cent.'), lsg, rundFehler(p, 3, 2), tR2G,
        { einheit: '€', daten: { kopf: ['Sorte', 'Preis für 1 l'], zeilen: [['Benzin', `${T(p, 3)} €`]] }, nachweis: [RN(`${T(p, 3)} €`, 2, `${lsg} €`, { einheit: '€' })] }); },
    () => { const [n, betrag] = wahl([[3, 10], [3, 20], [6, 10], [7, 10], [3, 40]]), q = Math.floor((betrag * 1000) / n), lsg = G(q, 3, 2);
      return dezimal(Z(`${n} Freunde teilen ${betrag} € gerecht.`, `Der Taschenrechner zeigt ${T(q, 3)}.`, 'Runde auf Cent.', 'Gib an, wie viel jeder etwa bekommt.'), lsg, rundFehler(q, 3, 2), tR2G,
        { einheit: '€', bild: B.kommaTafel(['Z', 'E', 'z', 'h', 't'], [q >= 10000 ? 1 : null, Math.floor(q / 1000) % 10, Math.floor(q / 100) % 10, Math.floor(q / 10) % 10, q % 10]), nachweis: [{ wert: `${betrag} €`, grund: 'Geld zum Teilen' }, { wert: String(n), grund: 'Anzahl der Freunde' }, { wert: `${T(q, 3)} €`, grund: 'Anzeige des Rechners in Euro' }, RN(`${T(q, 3)} €`, 2, `${lsg} €`, { einheit: '€' })] }); },
    () => { const namen = mische(['Ali', 'Emma', 'Paul', 'Lina']).slice(0, 2), zeiten = namen.map(() => zz(13, 16) * 100 + zz(1, 8) * 10 + wahl([1, 2, 3, 4, 6, 7, 8, 9]));
      if (zeiten[0] === zeiten[1]) return null;
      return luecken(Z('Runde beide Zeiten auf Zehntel Sekunden.', `${namen[0]}: {{a}} s`, `${namen[1]}: {{b}} s`), { a: [G(zeiten[0], 2, 1), rundFehler(zeiten[0], 2, 1)], b: [G(zeiten[1], 2, 1), rundFehler(zeiten[1], 2, 1)] },
        h3('Schau bei jeder Zeit auf die Hundertstel.', '14,26 s ≈ 14,3 s und 14,21 s ≈ 14,2 s.', 'Runde jede Zeit für sich.'),
        { daten: { kopf: ['Kind', 'Zeit für 100 m'], zeilen: namen.map((n, i) => [n, `${T(zeiten[i], 2)} s`]) }, nachweis: zeiten.map((t) => RN(`${T(t, 2)} s`, 1, `${G(t, 2, 1)} s`, { einheit: 's' })) }); },
    () => { const e = zz(1, 8), p = e * 100 + 95 + wahl([0, 1, 2, 3, 4]), kn = kind(), lsg = G(p, 2, 1);
      return auswahl(Z(`${kn} rundet ${T(p, 2, 2)} € auf Zehntel Euro.`, `${kn} schreibt: ${e + 1} €`, 'Beurteile das Ergebnis.'), [opt(`Stimmt. Man darf auch ${lsg} € schreiben.`, true), opt(`Falsch. Es muss ${e},10 € heißen.`, false, 'runden-uebertrag'), opt(`Falsch. Es muss ${T(e * 10 + 9, 1)} € heißen.`, false, 'runden-abschneiden')], tR2G,
        { nachweis: [RN(`${T(p, 2, 2)} €`, 1, `${lsg} €`, { einheit: '€', behauptet: `${e + 1} €` })] }); },
    () => { const e = zz(3, 9), ziel = `${e} €`, liste = mische([[(e - 1) * 100 + 50, true], [e * 100 + 49, true], [(e - 1) * 100 + 49, false], [e * 100 + 50, false], [e * 100 + 9, true]]).slice(0, 4);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Ein Preis wurde auf ganze Euro gerundet: etwa ${ziel}.`, 'Kreuze alle möglichen Preise an.'), liste.map(([w, r]) => opt(`${T(w, 2, 2)} €`, r, r ? undefined : 'runden-fuenf-ab')), tR2G,
        { mehrfach: true, nachweis: [RW(0, ziel, { einheit: '€' })] }); },
  ]);
  const tR2M = h2('Überlege zuerst, welche Stelle die Einheit vorgibt: Cent sind Hundertstel Euro, Gramm sind Tausendstel Kilogramm, Zentimeter sind Hundertstel Meter.', 'Runde dann auf diese Stelle. Schau nur auf die Ziffer rechts daneben.');
  sechs(R2, 'M', [
    () => { const e = zz(2, 9), c = zz(101, 999), p = e * 1000 + c, lsg = G(p, 3, 2);
      if (c % 10 === 0 || c % 10 === 5 || Math.floor(c / 10) % 10 === 9) return null;
      return dezimal(Z(`Max kauft Äpfel. Die Waage zeigt den Preis ${T(p, 3)} €.`, 'Runde auf Cent.'), lsg, rundFehler(p, 3, 2), tR2M, { einheit: '€', nachweis: [RN(`${T(p, 3)} €`, 2, `${lsg} €`, { einheit: '€' })] }); },
    () => { const [laenge, n] = wahl([[10, 3], [20, 3], [10, 6], [5, 3], [10, 7]]), q = Math.floor((laenge * 10000) / n), lsg = G(q, 4, 2);
      return dezimal(Z(`Ein ${laenge} m langes Seil wird in ${n} gleich lange Stücke geschnitten.`, `Der Rechner zeigt ${T(q, 4)} m.`, 'Gib die Länge eines Stücks auf Zentimeter gerundet an.'), lsg, rundFehler(q, 4, 2), tR2M,
        { einheit: 'm', nachweis: [{ wert: `${laenge} m`, grund: 'Länge des Seils' }, { wert: String(n), grund: 'Anzahl der Stücke' }, RN(`${T(q, 4)} m`, 2, `${lsg} m`, { einheit: 'm' })] }); },
    () => { const g = zz(1, 9), k = zz(1001, 9999), p = g * 10000 + k, lsg = G(p, 4, 3);
      if (k % 10 === 0 || k % 10 === 5 || Math.floor(k / 10) % 10 === 9) return null;
      return dezimal(Z(`Eine Waage zeigt ${T(p, 4)} kg.`, 'Gib das Gewicht auf Gramm gerundet an.'), lsg, rundFehler(p, 4, 3), tR2M, { einheit: 'kg', nachweis: [RN(`${T(p, 4)} kg`, 3, `${lsg} kg`, { einheit: 'kg' })] }); },
    () => { const namen = mische(['Ali', 'Emma', 'Paul', 'Lina']).slice(0, 3), zeiten = namen.map(() => zz(12, 16) * 1000 + zz(1, 8) * 100 + zz(0, 9) * 10 + wahl([1, 3, 6, 8]));
      if (new Set(zeiten).size < 3) return null;
      return luecken(Z('Die Zeiten wurden auf Tausendstel gemessen.', 'Runde jede Zeit auf Hundertstel Sekunden.', `${namen[0]}: {{a}} s`, `${namen[1]}: {{b}} s`, `${namen[2]}: {{c}} s`),
        Object.fromEntries(zeiten.map((t, i) => ['abc'[i], [G(t, 3, 2), rundFehler(t, 3, 2)]])), tR2M,
        { daten: { kopf: ['Kind', 'Zeit für 100 m'], zeilen: namen.map((n, i) => [n, `${T(zeiten[i], 3)} s`]) }, nachweis: zeiten.map((t) => RN(`${T(t, 3)} s`, 2, `${G(t, 3, 2)} s`, { einheit: 's' })) }); },
    () => { const e = zz(2, 8), z = zz(1, 8), ziel = `${e},${z}0 €`, basis = (e * 10 + z) * 10;
      const liste = mische([[basis - 5, true], [basis + 4, true], [basis * 10 + 49, true, 3], [basis + 5, false], [basis - 6, false], [basis * 10 - 51, false, 3]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Kreuze alle Beträge an, die auf Zehntel Euro gerundet ${ziel} ergeben.`), liste.map(([w, r, k]) => opt(`${T(w, k ?? 2, k ?? 2)} €`, r, r ? undefined : 'runden-fuenf-ab')), tR2M,
        { mehrfach: true, nachweis: [RW(1, ziel, { einheit: '€' })] }); },
    () => { const g = zz(2, 9), z = zz(1, 8), h = zz(1, 8), p = (g * 100 + z * 10 + h) * 100 + zz(51, 99), kn = kind(), falsch = T(abschneiden(p, 4, 2), 2, 2), lsg = G(p, 4, 2);
      if (p % 10 === 0) return null;
      return auswahl(Z(`Der Rechner zeigt ${T(p, 4)} m.`, `${kn} rundet auf Zentimeter und schreibt ${falsch} m.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. ${T(p, 4)} m ≈ ${lsg} m.`, true), opt('Stimmt.', false, 'runden-abschneiden'), opt('Stimmt, denn Zentimeter sind Hundertstel Meter.', false, 'runden-abschneiden')], tR2M,
        { nachweis: [RN(`${T(p, 4)} m`, 2, `${lsg} m`, { einheit: 'm', behauptet: `${falsch} m` })] }); },
  ]);
  sechs(R2, 'E', [
    () => { const g = zz(1, 3), k = zz(1001, 9999), p = g * 10000 + k, lsg = G(p, 4, 3), kn = kind();
      if (k % 10 === 0 || k % 10 === 5 || Math.floor(k / 10) % 10 === 9 || Math.floor(k / 100) % 10 === 9) return null;
      const opts = [[`${lsg} m`, true], [`${G(p, 4, 2)} m`, false, 'runden-falsche-stelle'], [`${T(p, 4)} m`, false, 'runden-ziffern-stehen'], [`${T(abschneiden(p, 4, 3), 3, 3)} m`, false, 'runden-abschneiden']];
      if (!verschieden(opts.map(([t]) => t))) return null;
      return auswahl(Z(`${kn} misst mit einem Laser ${T(p, 4)} m.`, 'Ihr Zollstock misst nur auf Millimeter genau.', 'Kreuze die Angabe auf Millimeter genau an.'), opts.map(([t, r, f]) => opt(t, r, f)),
        h1('Ein Millimeter ist ein Tausendstel Meter. Runde auf Tausendstel.'), { nachweis: [RN(`${T(p, 4)} m`, 3, `${lsg} m`, { einheit: 'm' }), { art: 'wert', wert: `${lsg} m` }] }); },
    () => { const e = zz(1, 8), z = zz(1, 8), ziel = `${e},${z}0 €`, grenze = `${T(e * 100 + z * 10 + 5, 2, 2)} €`, lsg = T(e * 100 + z * 10 + 4, 2, 2);
      return dezimal(Z(`Ein Preis wurde auf Zehntel Euro gerundet: ${ziel}.`, 'Gib den höchsten möglichen Preis in Cent genau an.'), lsg, dfe(lsg, [[T(e * 100 + z * 10 + 5, 2, 2), 'runden-fuenf-ab'], [T(e * 100 + z * 10 + 9, 2, 2), 'runden-abschneiden']]),
        h1('Überlege, ab welchem Betrag schon auf das nächste Zehntel aufgerundet wird.'), { einheit: '€', nachweis: [{ wert: grenze, grund: 'ab hier wird aufgerundet' }, `${grenze} − 1 ct = ${lsg} €`, RN(`${lsg} €`, 1, ziel, { einheit: '€' })] }); },
    () => { const [z, n] = wahl([[2, 3], [1, 3], [5, 6], [1, 6], [4, 9], [7, 9], [1, 7]]), q = Math.floor((z * 10000) / n), a = G(q, 4, 1), c = G(q, 4, 2), e = G(q, 4, 3);
      return luecken(Z(`Der Taschenrechner zeigt für ${z} : ${n} die Zahl ${T(q, 4)}.`, 'Runde die Anzeige.', 'Auf Zehntel: {{a}}', 'Auf Hundertstel: {{b}}', 'Auf Tausendstel: {{c}}'), { a: [a, rundFehler(q, 4, 1)], b: [c, rundFehler(q, 4, 2)], c: [e, rundFehler(q, 4, 3)] },
        h1('Der Rechner hat die Zahl schon abgeschnitten. Runde trotzdem nur nach der Ziffer rechts neben der Rundungsstelle.'), { nachweis: [{ wert: String(z), grund: 'Zähler der Division' }, { wert: String(n), grund: 'Teiler' }, RN(T(q, 4), 1, a), RN(T(q, 4), 2, c), RN(T(q, 4), 3, e)] }); },
    () => { const e = zz(2, 8), z = zz(1, 7), p = (e * 100 + z * 10 + 4) * 100 + 4 * 10 + zz(5, 9), kn = kind(), lsg = G(p, 4, 1), falsch = T(rundeKette(p, 4, 1), 1, 1);
      if (falsch === lsg) return null;
      return auswahl(Z(`${kn} rundet den Betrag ${T(p, 4)} € auf Zehntel Euro.`, `${kn} rundet Stelle für Stelle und erhält ${falsch} €.`, 'Beurteile das Ergebnis und begründe.'),
        [opt(`Falsch. ${T(p, 4)} € ≈ ${lsg} €.`, true), opt('Stimmt.', false, 'runden-kette'), opt('Stimmt, denn jede Stelle wurde richtig gerundet.', false, 'runden-kette')],
        h1('Prüfe, welche Ziffer rechts neben den Zehnteln steht. Nur sie entscheidet.'), { nachweis: [RN(`${T(p, 4)} €`, 1, `${lsg} €`, { einheit: '€', behauptet: `${falsch} €` })] }); },
    () => { const [k, n] = wahl([[7, 9], [5, 7], [2, 3], [5, 6], [4, 7], [8, 9]]), q = Math.floor((k * 10000) / n), lsg = G(q, 4, 2);
      return dezimal(Z(`In einer Umfrage nennen ${k} von ${n} Kindern Pizza als Lieblingsessen.`, `Der Rechner zeigt für den Anteil ${T(q, 4)}.`, 'Gib den Anteil auf Hundertstel gerundet an.'), lsg, rundFehler(q, 4, 2),
        h1('Hundertstel reichen hier. Runde auf die zweite Stelle nach dem Komma.'), { nachweis: [{ wert: String(k), grund: 'Kinder mit Pizza' }, { wert: String(n), grund: 'alle Kinder' }, RN(T(q, 4), 2, lsg)] }); },
    () => { const e = zz(2, 8), z = zz(1, 8), ziel = `${e},${z}0`, basis = (e * 10 + z) * 1000;
      const liste = mische([[basis - 50, true, 4], [basis + 49, true, 4], [basis + 50, false, 4], [basis - 51, false, 4], [(e * 10 + z) * 100, true, 3], [(e * 10 + z) * 100 - 6, false, 3]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z(`Ein Messwert wurde auf Hundertstel gerundet und ergibt ${ziel}.`, 'Kreuze alle Werte an, die es gewesen sein können.'), liste.map(([w, r, k]) => opt(T(w, k), r, r ? undefined : 'runden-fuenf-ab')),
        h1(`Die Endnull zeigt: Es wurde auf Hundertstel gerundet. Bestimme die kleinste und die größte passende Zahl.`), { mehrfach: true, nachweis: [RW(2, ziel)] }); },
  ]);
}
