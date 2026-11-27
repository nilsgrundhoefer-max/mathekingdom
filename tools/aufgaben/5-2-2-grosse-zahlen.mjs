// Aufgaben zu 5.2.2 „Große Zahlen“ (Lernziele B1 und B2) nach ADR 0015 und ADR 0030.
// B1 große Zahlen lesen und schreiben, B2 große Zahlen vergleichen, ordnen und am Zahlenstrahl finden.
// Zahlenraum: F bleibt bei den Millionen und arbeitet an der gezeichneten Stellenwerttafel, ab G bis zur Billion.
// Zahlwörter werden nie getippt, nur ausgewählt, zugeordnet oder geordnet.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, strahl, ordnen, Z, N, B, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, fz, kind, zweiKinder, U, HILFSZAHL, zahlwort } from '../werkzeug.mjs';
import { EINS, lies, tippe, zwischen, einer, vergleich, zeichenwahl, kette, auf, verschieden, stellen, trage } from './5-2-1-zahlenstrahl.mjs';

const G_ = (kurz) => `5.2.2-${kurz}`;
const MIO = 1e6, MRD = 1e9, BIO = 1e12;
const wort = (n) => ({ art: 'zahlwort', wort: zahlwort(n), zahl: n });
const nullenIn = (n) => stellen(n).filter((c) => c === 0).length;
const naechsteWahl = (ziel, abstaende) => { const l = abstaende.map((d, i) => ziel + (i % 2 ? d : -d)); return mische(l).map((x) => opt(fz(x), Math.abs(x - ziel) === Math.min(...abstaende))); };

export function grosseZahlen() {
  // =====================================================================
  // B1 Große Zahlen lesen und schreiben
  // =====================================================================
  sechs(G_('B1'), 'F', [
    () => { const n = zz(1, 9) * MIO + zz(101, 989) * 1000 + zz(101, 989);
      return zahl(Z('Schau auf die Stellenwerttafel.', 'Welche Zahl steht dort?'), n, fehlerliste(n, [[Math.floor(n / 1000), 'dreierblock-vergessen']]),
        h3('Lies die Zahl in Dreierblöcken: erst die Millionen, dann die Tausender, dann die Einer.', '2 bei den Millionen, 405 bei den Tausendern, 300 bei den Einern: 2 405 300.', `Bei den Millionen steht ${Math.floor(n / MIO)}.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'tafel', zahl: n }], lang: true }); },
    () => { const m = zz(2, 9), t = wahl([20, 30, 40, 50, 60, 70, 80, 90]), n = m * MIO + t * 1000;
      return auswahl(Z('Schau auf die Stellenwerttafel.', 'Wie heißt die Zahl?'), [opt(zahlwort(n), true), opt(zahlwort(m * MIO + t), false, 'dreierblock-vergessen'), opt(zahlwort(m * 1000 + t), false, 'million-milliarde')],
        h3('Lies jeden Dreierblock für sich. Nenne danach den Namen des Blocks.', '3 bei den Millionen und 050 bei den Tausendern: drei Millionen fünfzigtausend.', `Im Block der Tausender steht ${t}.`),
        { bild: B.zahlTafel(n), nachweis: [wort(n)] }); },
    () => { const n = zz(1, 9) * MIO + zz(1, 9) * 100000 + zz(1, 9) * 1000;
      return trage(Z(`Trage die Zahl ${fz(n)} in die Stellenwerttafel ein.`), n, 7,
        h3('Die Zahl hat 3 Dreierblöcke. Trage Block für Block ein.', '2 405 000: 2 bei M, dann 4, 0, 5 bei den Tausendern, dann 0, 0, 0.', `Beginne links: ${Math.floor(n / MIO)} gehört in die Spalte M.`)); },
    () => { const [w, n] = wahl([['eine Million', MIO], ['zehn Millionen', 10 * MIO], ['hundert Millionen', 100 * MIO]]);
      return zahl(Z(`In der Stellenwerttafel steht ${w}.`, 'Wie viele Nullen hat die Zahl?'), nullenIn(n), fehlerliste(nullenIn(n), [[3, 'million-milliarde'], [nullenIn(n) + 1, 'dreierblock-vergessen'], [nullenIn(n) - 1, 'dreierblock-vergessen']]),
        h3('Zähle die Nullen in der Tafel. Jeder volle Dreierblock hat 3 Nullen.', 'Tausend hat 3 Nullen: 1000.', `Zähle die Nullen in jedem Block und zähle zusammen.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'ziffernzahl', zahl: n, was: 'nullen', anzahl: nullenIn(n) }] }); },
    () => { const m = zz(2, 9), t = wahl([12, 25, 40, 68, 300, 507, 450]), n = m * MIO + t * 1000;
      return trage(Z('Trage die Zahl in die Stellenwerttafel ein.', `Die Zahl heißt: ${zahlwort(n)}`), n, 7,
        h3('Jeder Dreierblock braucht 3 Ziffern. Fülle mit Nullen auf.', 'drei Millionen fünfzigtausend: 3, dann 050, dann 000.', `Bei den Millionen steht ${m}. Der Block der Einer besteht aus 3 Nullen.`), { nachweis: [wort(n)] }); },
    () => { const n = zz(11, 98) * MIO + zz(101, 989) * 1000, z = Math.floor(n / MIO) % 10;
      if (Math.floor(n / 10 / MIO) === z) return null;
      return zahl(Z(`Schau auf die Zahl ${fz(n)}.`, 'Welche Ziffer steht in der Spalte M?'), z, fehlerliste(z, [[Math.floor(n / 10 / MIO), 'tafel-verrutscht'], [Math.floor(n / 100000) % 10, 'tafel-verrutscht']]),
        h3('M heißt Millionen. Links daneben steht ZM für Zehnmillionen.', 'In 25 300 000 steht die 5 in der Spalte M.', `Suche im Kopf der Tafel das M. Lies die Ziffer darunter.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'stelle', zahl: n, stelle: 'M', ziffer: z }] }); },
  ]);
  sechs(G_('B1'), 'G', [
    () => { const a = zz(2, 9), b = wahl([20, 30, 40, 50, 60, 70, 80, 90]), n = a * MRD + b * MIO;
      return auswahl(Z(`Wie liest man die Zahl ${fz(n)}?`), [opt(zahlwort(n), true), opt(zahlwort(a * MIO + b * 1000), false, 'million-milliarde'), opt(zahlwort(a * MRD + b * 1000), false, 'dreierblock-vergessen')],
        h3('Zähle die Dreierblöcke von rechts: Einer, Tausender, Millionen, Milliarden.', '4 050 000 000: vier Milliarden fünfzig Millionen.', `Die Zahl hat 4 Blöcke. Ganz links steht ${a}.`),
        { bild: B.zahlTafel(n), nachweis: [wort(n)] }); },
    () => { const n = zz(1, 9) * MRD + zz(11, 98) * MIO + zz(101, 989) * 1000;
      return trage(Z(`Trage die Zahl ${fz(n)} in die Stellenwerttafel ein.`), n, 10,
        h3('Md heißt Milliarden. Trage Block für Block von links ein.', '3 045 200 000: 3 bei Md, dann 045, dann 200, dann 000.', `Die Zahl beginnt mit ${Math.floor(n / MRD)} Milliarden.`)); },
    () => { const mrd = wahl([true, false]), k = mrd ? zz(2, 9) : wahl([15, 35, 80, 120, 250, 406]), e = mrd ? MRD : MIO, n = k * e;
      return zahl(Z('Schreibe die Zahl mit Ziffern.', `${k} ${mrd ? 'Mrd.' : 'Mio.'}`), n, fehlerliste(n, [[k * 1000, 'million-milliarde'], [mrd ? k * MIO : k * MRD, 'million-milliarde'], [n / 10, 'dreierblock-vergessen']]),
        h3('Mio. heißt Million, Mrd. heißt Milliarde.', '35 Mio. schreibt man 35 000 000. Hinter der 35 stehen 6 Nullen.', `Schreibe ${k} und hänge ${mrd ? 9 : 6} Nullen an.`),
        { nachweis: [HILFSZAHL(e, mrd ? 'Mrd. heißt Milliarde' : 'Mio. heißt Million'), ...N(`${k} · ${e}`)], lang: true }); },
    () => { const n = zz(1, 9) * 100 * MIO + zz(1, 9) * MIO + zz(1, 9) * 100;
      return zahl(Z('Schau auf die Stellenwerttafel.', 'Welche Zahl steht dort?'), n, fehlerliste(n, [[Number(stellen(n).filter((c) => c !== 0).join('')), 'null-platzhalter'], [Math.floor(n / 1000), 'dreierblock-vergessen']]),
        h3('Lies Block für Block. Ein Block aus lauter Nullen gehört auch zur Zahl.', '405 bei den Millionen, 000 bei den Tausendern, 300 bei den Einern: 405 000 300.', `Der Block der Tausender besteht aus 3 Nullen.`),
        { bild: B.zahlTafel(n), nachweis: [{ art: 'tafel', zahl: n }], lang: true }); },
    () => { const m = zz(2, 9), x = zz(2, 9), l = [m * MIO + x * 100000, m * MIO + x * 10000, m * MIO + x * 1000];
      return zuordnen(Z('Welche Zahl gehört zu welchem Zahlwort?'), l.map((n) => [fz(n), zahlwort(n)]),
        h3('Schau auf den Block der Tausender. Steht dort 300, 030 oder 003?', '2 030 000 heißt zwei Millionen dreißigtausend.', `Alle Zahlen beginnen mit ${m} Millionen. Lies nur den Block der Tausender.`), { nachweis: l.map(wort) }); },
    () => { const k = kind(), m = zz(2, 9), t = zz(2, 9), n = m * MIO + t * 1000;
      return auswahl(Z(`${k} soll diese Zahl schreiben: ${zahlwort(n)}`, `${k} schreibt ${fz(m * MIO + t * 100000)}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'dreierblock-vergessen'), opt(`Falsch. Richtig ist ${fz(n)}.`, true), opt(`Falsch. Richtig ist ${fz(m * MIO + t)}.`, false, 'dreierblock-vergessen')],
        h3('Jeder Dreierblock braucht 3 Ziffern. Fülle mit Nullen auf.', 'zwei Millionen dreitausend: 2, dann 003, dann 000.', `Der Block der Tausender heißt 00${t}.`), { nachweis: [U(false), HILFSZAHL(n, zahlwort(n))] }); },
  ]);
  sechs(G_('B1'), 'M', [
    () => { const n = zz(2, 9) * MRD + wahl([4, 15, 40, 205, 360]) * MIO + wahl([0, 0, 500, 80]) * 1000;
      return zahl(`Schreibe mit Ziffern: ${zahlwort(n)}`, n, fehlerliste(n, [[Number(stellen(n).filter((c, i) => c !== 0 || i === 0).join('')), 'null-platzhalter'], [Math.floor(n / 1000), 'dreierblock-vergessen']]),
        h2('Schreibe für jeden Dreierblock drei Ziffern auf: Milliarden, Millionen, Tausender, Einer.', `Der Block der Millionen heißt ${String(Math.floor(n / MIO) % 1000).padStart(3, '0')}.`), { nachweis: [wort(n)], lang: true }); },
    () => { const a = zz(2, 9), b = wahl([30, 60, 400, 700, 15]), n = a * BIO + b * MRD;
      return auswahl(`Wie liest man die Zahl ${fz(n)}?`, [opt(zahlwort(n), true), opt(zahlwort(a * MRD + b * MIO), false, 'million-milliarde'), opt(zahlwort(a * BIO + b * MIO), false, 'dreierblock-vergessen'), opt(zahlwort(a * 100 * MRD + b * MIO), false, 'million-milliarde')],
        h2('Teile die Zahl von rechts in Dreierblöcke: Einer, Tausender, Millionen, Milliarden, Billionen.', `Die Zahl hat 5 Blöcke. Der Block ganz links gehört zu den Billionen.`), { nachweis: [wort(n)] }); },
    () => { const [name, e] = wahl([['Millionen', MIO], ['Milliarden', MRD], ['Billionen', BIO]]), k = wahl([20, 300, 5, 40, 700, 60]), n = k * e;
      return zahl(`Wie viele Nullen hat die Zahl ${k} ${name}, wenn man sie mit Ziffern schreibt?`, nullenIn(n), fehlerliste(nullenIn(n), [[nullenIn(e), 'null-platzhalter'], [nullenIn(n) + 3, 'million-milliarde'], [nullenIn(n) - 3, 'million-milliarde']]),
        h2('Zähle die Nullen der Stufenzahl und dazu die Nullen der Zahl davor.', `${name === 'Millionen' ? 'Eine Million' : name === 'Milliarden' ? 'Eine Milliarde' : 'Eine Billion'} hat ${nullenIn(e)} Nullen.`),
        { nachweis: [HILFSZAHL(e, `eine ${name.replace(/e?n$/, '')}`), ...N(`${k} · ${e}`), { art: 'ziffernzahl', zahl: n, was: 'nullen', anzahl: nullenIn(n) }] }); },
    () => { const n = (zz(1, 9) * 100 + zz(1, 9)) * MRD + zz(11, 98) * MIO + zz(1, 9) * 100000;
      return trage(`Trage die Zahl ${fz(n)} in die Stellenwerttafel ein.`, n, 12, h2('Trage Block für Block ein und achte auf die Nullen innerhalb der Blöcke.', `Der Block der Millionen heißt ${String(Math.floor(n / MIO) % 1000).padStart(3, '0')}.`)); },
    () => { const [gross, wg, klein, wk] = wahl([[MRD, 'Milliarden', MIO, 'Millionen'], [BIO, 'Billionen', MRD, 'Milliarden'], [MIO, 'Millionen', 1000, 'Tausender']]), k = zz(2, 9);
      return luecken(`${k} ${wg} sind genauso viel wie {{a}} ${wk}.`, { a: [k * 1000, fehlerliste(k * 1000, [[k * 100, 'million-milliarde'], [k * MIO, 'million-milliarde'], [k * 10, 'million-milliarde']])] },
        h2('Von einem Dreierblock zum nächsten wird die Einheit tausendmal so groß.', `1 ${wg.replace(/e?n$/, '')} sind 1000 ${wk}.`), { nachweis: [HILFSZAHL(gross, wg), HILFSZAHL(klein, wk), ...N(`${k} · ${gross} : ${klein}`)] }); },
    () => { const [a, b] = zweiKinder();
      return auswahl(`${a} sagt: „Eine Milliarde ist tausendmal so viel wie eine Million.“ ${b} sagt: „Eine Milliarde ist eine Million mal tausend.“ Wer hat recht?`, [
        opt(`Beide haben recht: 1000 · 1${' '}000${' '}000 und 1${' '}000${' '}000 · 1000 sind dasselbe.`, true),
        opt(`Nur ${a} hat recht.`, false),
        opt(`Nur ${b} hat recht.`, false),
        opt('Keiner hat recht: Eine Milliarde ist eine Million mal eine Million.', false, 'million-milliarde')],
      h2('Schreibe beide Aussagen als Malaufgabe auf.', 'Beim Multiplizieren darf man die Faktoren vertauschen.'), { nachweis: N('1000 · 1000000', '1000000 · 1000') }); },
  ]);
  sechs(G_('B1'), 'E', [
    () => { const n = zz(2, 9) * BIO + wahl([30, 300, 45, 7]) * MRD + wahl([5, 60, 0, 108]) * MIO + wahl([0, 0, 20]) * 1000;
      return zahl(`Schreibe mit Ziffern: ${zahlwort(n)}`, n, fehlerliste(n, [[Math.floor(n / 1000), 'dreierblock-vergessen'], [Number(stellen(n).filter((c, i) => c !== 0 || i === 0).join('')), 'null-platzhalter']]),
        h1('Schreibe für jeden der fünf Dreierblöcke drei Ziffern auf, auch wenn der Block im Zahlwort nicht vorkommt.'), { nachweis: [wort(n)], lang: true }); },
    () => { const d = zz(2, 9), l = [[`${d}0 Mio.`, d * 10 * MIO], [`${d} Mrd.`, d * MRD], [`${d}00 Mio.`, d * 100 * MIO], [`${d}0 Mrd.`, d * 10 * MRD]];
      return zuordnen('Ordne jeder Abkürzung die Zahl zu.', l.map(([t, n]) => [t, fz(n)]), h1('Mio. steht für sechs Nullen, Mrd. für neun Nullen. Zähle die Stellen der Zahlen.'),
        { nachweis: N(`${d}0 · ${MIO}`, `${d} · ${MRD}`, `${d}00 · ${MIO}`, `${d}0 · ${MRD}`) }); },
    () => { const [name, e] = wahl([['Milliarden', MRD], ['Billionen', BIO]]), k = wahl([45, 7, 380, 12, 600]), n = k * e;
      return zahl(`Wie viele Stellen hat die Zahl ${k} ${name}, wenn man sie mit Ziffern schreibt?`, String(n).length, fehlerliste(String(n).length, [[String(e).length, 'null-platzhalter'], [String(n).length - 1, 'null-platzhalter'], [String(n).length + 3, 'million-milliarde'], [String(n).length - 3, 'million-milliarde']]),
        h1('Eine Milliarde hat 10 Stellen, eine Billion hat 13 Stellen.'), { nachweis: [HILFSZAHL(e, name), ...N(`${k} · ${e}`), { art: 'ziffernzahl', zahl: n, was: 'stellen', anzahl: String(n).length }] }); },
    () => { const [wk, klein, wg, gross] = wahl([['hunderttausend', 100000, 'eine Billion', BIO], ['tausend', 1000, 'eine Milliarde', MRD], ['eine Million', MIO, 'eine Milliarde', MRD], ['tausend', 1000, 'eine Billion', BIO]]);
      return zahl(`Wie oft passt ${wk} in ${wg}?`, gross / klein, fehlerliste(gross / klein, [[gross / klein / 1000, 'million-milliarde'], [gross / klein * 1000, 'million-milliarde'], [1000, 'million-milliarde']]),
        h1('Vergleiche die Zahl der Dreierblöcke der beiden Zahlen.'), { nachweis: [HILFSZAHL(gross, wg), HILFSZAHL(klein, wk), ...N(`${gross} : ${klein}`)], lang: true }); },
    () => { const [w1, n1] = wahl([['Eine halbe Million', MIO / 2], ['Eine Viertelmillion', MIO / 4]]), [w2, n2] = wahl([['eine halbe Milliarde', MRD / 2], ['eine Viertelmilliarde', MRD / 4]]);
      return luecken(`Schreibe mit Ziffern. ${w1} ist {{a}}, ${w2} ist {{b}}.`, { a: [n1, fehlerliste(n1, [[n1 / 10, 'null-platzhalter'], [n1 * 1000, 'million-milliarde']])], b: [n2, fehlerliste(n2, [[n2 / 1000, 'million-milliarde'], [n2 / 10, 'null-platzhalter']])] },
        h1('Schreibe zuerst die ganze Million und die ganze Milliarde auf und teile dann.'), { nachweis: [HILFSZAHL(MIO, 'eine Million'), HILFSZAHL(MRD, 'eine Milliarde'), ...N(`${MIO} : ${MIO / n1}`, `${MRD} : ${MRD / n2}`)], lang: true }); },
    () => { const [satz, frage, je, ziel, einheit] = wahl([
      ['Ein Herz schlägt an einem Tag rund 100 000 Mal.', 'Nach wie vielen Tagen hat es eine Milliarde Mal geschlagen?', 100000, MRD, 'Tagen'],
      ['Eine Druckerei druckt an einem Tag rund 200 000 Zeitungen.', 'Nach wie vielen Tagen hat sie eine Milliarde Zeitungen gedruckt?', 200000, MRD, 'Tagen'],
      ['Durch einen Bach fließen in jeder Sekunde rund 2000 Liter Wasser.', 'Nach wie vielen Sekunden ist eine Million Liter durchgeflossen?', 2000, MIO, 'Sekunden'],
      ['Die Schreiber des Königs schaffen an einem Tag rund 5000 Seiten.', 'Nach wie vielen Tagen haben sie eine Million Seiten geschrieben?', 5000, MIO, 'Tagen']]);
      return zahl(`${satz} ${frage}`, ziel / je, fehlerliste(ziel / je, [[ziel / je / 10, 'null-platzhalter'], [ziel / je * 10, 'null-platzhalter'], [ziel / je / 1000, 'million-milliarde']]),
        h1('Überlege, wie oft die kleinere Zahl in die große passt. Streiche dazu in beiden Zahlen gleich viele Nullen.'), { nachweis: [HILFSZAHL(ziel, ziel === MRD ? 'eine Milliarde' : 'eine Million'), ...N(`${ziel} : ${je}`)], einheit: einheit === 'Tagen' ? 'Tage' : 'Sekunden' }); },
  ]);

  // =====================================================================
  // B2 Große Zahlen vergleichen, ordnen und am Zahlenstrahl finden
  // =====================================================================
  sechs(G_('B2'), 'F', [
    () => { const m = zz(1, 8), [x, y] = suche(() => [zz(1, 9), zz(1, 9)], ([p, q]) => p !== q), [a, b] = [m * MIO + x * 100000 + y * 10000, m * MIO + y * 100000 + x * 10000];
      return auswahl(Z('Welches Zeichen passt?', `${fz(a)} ▢ ${fz(b)}`), zeichenwahl(a, b),
        h3('Beide Zahlen haben gleich viele Stellen. Vergleiche von links Ziffer für Ziffer.', '2 450 000 < 2 540 000: Die Millionen sind gleich. Danach ist 4 kleiner als 5.', `Die Millionen sind gleich. Vergleiche die nächste Ziffer: ${x} und ${y}.`),
        { bild: B.zahlenTafel([a, b]), nachweis: [vergleich(a, b)] }); },
    () => { const l = [zz(5, 9) * 100000 + zz(1, 9) * 10000, zz(1, 4) * MIO + zz(1, 9) * 100000, zz(1, 3) * 10 * MIO + zz(1, 9) * MIO], g = Math.max(...l);
      return auswahl(Z('In der Stellenwerttafel stehen 3 Zahlen.', 'Welche Zahl ist am größten?'), l.map((x, i) => opt(fz(x), x === g, i === 0 ? 'vergleich-erste-ziffer' : undefined)),
        h3('Die Zahl mit den meisten Stellen ist am größten.', '12 000 000 hat 8 Stellen. 950 000 hat nur 6 Stellen. Also ist 12 000 000 größer.', `Eine Zahl reicht in der Tafel am weitesten nach links.`),
        { bild: B.zahlenTafel(mische(l)), nachweis: [{ art: 'extremwert', was: 'groesste', wert: g }] }); },
    () => { const m = zz(1, 8), l = verschieden(() => m * MIO + zz(1, 9) * 100000, 3), s = auf(l);
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.'), s.map(fz),
        h3('Weiter rechts am Zahlenstrahl ist die Zahl größer.', '3 200 000 liegt links von 3 700 000. Also ist 3 200 000 kleiner.', `Die kleinste Zahl ist ${fz(s[0])}.`),
        { bild: B.strahl({ von: m * MIO, bis: (m + 1) * MIO, schritt: 100000, beschriftung: 500000, punkte: l, ausschnitt: true }), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', links: 'kleinste', rechts: 'größte' }); },
    () => { const n = wahl([999999, 1999999, 4999999, 2099999, 7999999]);
      return zahl(Z(`In der Stellenwerttafel steht ${fz(n)}.`, 'Wie heißt der Nachfolger?'), n + 1, fehlerliste(n + 1, [[n - 1, 'nachbar-verwechselt'], [n + 10, 'stellenwert']]),
        h3('Der Nachfolger ist um 1 größer. Aus den Neunen werden Nullen.', 'Der Nachfolger von 99 999 ist 100 000.', `Rechne ${fz(n)} + 1. Links wird eine Ziffer um 1 größer.`),
        { bild: B.zahlTafel(n, 7), nachweis: [EINS, ...N(`${n} + 1`)], lang: true }); },
    () => { const l = [zz(6, 9) * 10000 + zz(1, 9) * 1000, zz(3, 9) * 100000 + zz(1, 9) * 10000, zz(1, 5) * MIO + zz(1, 9) * 100000, zz(1, 2) * 10 * MIO + zz(1, 9) * MIO], s = auf(l);
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.', 'Achte auf die Zahl der Stellen.'), s.map(fz),
        h3('Zähle zuerst die Stellen. Wenige Stellen heißt: kleine Zahl.', '85 000 hat 5 Stellen. 1 200 000 hat 7 Stellen. Also ist 85 000 kleiner.', `Die kleinste Zahl hat nur 5 Stellen.`),
        { bild: B.zahlenTafel(mische(l)), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'vergleich-erste-ziffer', links: 'kleinste', rechts: 'größte' }); },
    () => { const st = { von: 0, bis: 10 * MIO, schritt: MIO, beschriftung: 5 * MIO }, p = zwischen(st);
      return lies(Z('Hier ist jeder Schritt eine Million groß.', 'Auf welche Zahl zeigt der Pfeil?'), st, p, [[p / MIO, 'strahl-einerschritte'], [p / 10, 'dreierblock-vergessen']],
        { ...h3('Zähle in Millionen: 1 Million, 2 Millionen, 3 Millionen …', 'Der dritte Strich nach der 0 ist 3 000 000.', `Zähle von ${fz(p - (p % (5 * MIO)))} aus in Schritten von einer Million.`) }); },
  ]);
  sechs(G_('B2'), 'G', [
    () => { const [a, b] = mische([zz(7, 9) * 100 * MIO + zz(1, 9) * 10 * MIO, zz(1, 3) * MRD + zz(1, 9) * 100 * MIO]);
      return auswahl(Z('Welches Zeichen passt?', `${fz(a)} ▢ ${fz(b)}`), zeichenwahl(a, b),
        h3('Zähle zuerst die Stellen. Die Zahl mit mehr Stellen ist größer.', '980 000 000 < 1 200 000 000: Die erste Zahl hat 9 Stellen, die zweite 10.', `${fz(a)} hat ${String(a).length} Stellen. ${fz(b)} hat ${String(b).length} Stellen.`), { nachweis: [vergleich(a, b)] }); },
    () => { const d = zz(2, 9), l = [d * 100000, d * MIO, d * 10 * MIO, d * MRD];
      return ordnen(Z('Ordne die Zahlen.', 'Beginne mit der kleinsten Zahl.'), l.map(zahlwort),
        h3('Tausend ist weniger als eine Million. Eine Million ist weniger als eine Milliarde.', 'dreihunderttausend ist kleiner als drei Millionen.', `Die größte Zahl ist ${zahlwort(l[3])}.`),
        { nachweis: [{ art: 'ordnung', richtung: 'auf', system: 'wort' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'million-milliarde', links: 'kleinste', rechts: 'größte' }); },
    () => { const st = { von: 0, bis: 100 * MIO, schritt: 10 * MIO, beschriftung: 50 * MIO }, p = zwischen(st);
      return lies(Z('Auf welche Zahl zeigt der Pfeil?'), st, p, [[p / (10 * MIO), 'strahl-einerschritte'], [p / 10, 'dreierblock-vergessen'], [p - (p % (50 * MIO)) + (p % (50 * MIO)) / 10, 'strahl-einerschritte']],
        h3('Von 0 bis 50 Millionen sind es 5 Schritte. Ein Schritt ist 10 Millionen groß.', 'Der zweite Teilstrich nach der 0 ist 20 000 000.', `Zähle von ${fz(p - (p % (50 * MIO)))} aus in Schritten von 10 Millionen.`)); },
    () => { const l = [zz(6, 9) * 10 * MIO + zz(1, 9) * MIO, zz(2, 9) * 100 * MIO + zz(1, 9) * 10 * MIO, zz(1, 2) * MRD + zz(1, 9) * 100 * MIO], g = Math.max(...l);
      return auswahl(Z('In der Stellenwerttafel stehen 3 Zahlen.', 'Welche Zahl ist am größten?'), l.map((x, i) => opt(fz(x), x === g, i === 0 ? 'vergleich-erste-ziffer' : undefined)),
        h3('Die Zahl mit den meisten Stellen ist am größten.', '1 200 000 000 ist größer als 950 000 000. Sie hat eine Stelle mehr.', `Nur eine Zahl reicht bis zu den Milliarden.`),
        { bild: B.zahlenTafel(mische(l)), nachweis: [{ art: 'extremwert', was: 'groesste', wert: g }] }); },
    () => { const n = wahl([10 * MIO, 100 * MIO, MRD, 20 * MIO, 5 * MRD]);
      return zahl(Z(`Wie heißt der Vorgänger von ${fz(n)}?`), n - 1, fehlerliste(n - 1, [[n + 1, 'nachbar-verwechselt'], [n - 10, 'stellenwert'], [n - MIO, 'stellenwert']]),
        h3('Der Vorgänger ist um 1 kleiner. Aus den Nullen werden Neunen.', 'Der Vorgänger von 1 000 000 ist 999 999.', `Die erste Ziffer wird um 1 kleiner. Dahinter stehen nur Neunen.`), { nachweis: [EINS, ...N(`${n} − 1`)], lang: true }); },
    () => { const k = kind(), a = zz(5, 9) * 100 * MIO, b = zz(1, 4) * MRD;
      return auswahl(Z(`${k} sagt: „${fz(a)} ist größer als ${fz(b)}.“`, `„Denn ${a / (100 * MIO)} ist größer als ${b / MRD}.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'vergleich-erste-ziffer'), opt(`Falsch. ${fz(b)} hat mehr Stellen und ist größer.`, true), opt('Falsch. Die beiden Zahlen sind gleich groß.', false)],
        h3('Schau in die Stellenwerttafel: Welche Zahl reicht weiter nach links?', '900 Millionen sind weniger als 1 Milliarde.', `${fz(b)} reicht bis zu den Milliarden. ${fz(a)} reicht nur bis zu den Millionen.`),
        { bild: B.zahlenTafel([a, b]), nachweis: [U(false), vergleich(a, b)] }); },
  ]);
  sechs(G_('B2'), 'M', [
    () => { const l = auf([zz(2, 9) * MIO + zz(1, 9) * 100000, zz(11, 98) * MIO, zz(101, 989) * MIO, zz(2, 9) * MRD + zz(1, 9) * 100 * MIO, zz(11, 98) * MRD]);
      return ordnen('Ordne die Zahlen. Beginne mit der kleinsten Zahl.', l.map(fz), h2('Zähle zuerst die Stellen oder die Dreierblöcke jeder Zahl.', `Die kleinste Zahl ist ${fz(l[0])}.`),
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'vergleich-erste-ziffer', links: 'kleinste', rechts: 'größte' }); },
    () => { const st = { von: 0, bis: MRD, schritt: 50 * MIO, beschriftung: 250 * MIO }, w = zwischen(st);
      return tippe(`Markiere die Zahl ${fz(w)} am Zahlenstrahl.`, st, w, [[w - 50 * MIO, 'strahl-einerschritte'], [w + 50 * MIO, 'strahl-einerschritte']],
        h2('Der Zahlenstrahl reicht bis zu einer Milliarde. Bestimme zuerst die Schrittweite.', `Ein Schritt ist 50 Millionen groß.`)); },
    () => { const [ziel, name, satz] = wahl([[MRD, 'einer Milliarde', 'Eine Milliarde'], [100 * MIO, 'hundert Millionen', 'Hundert Millionen'], [10 * MRD, 'zehn Milliarden', 'Zehn Milliarden']]), ab = mische([zz(1, 4) * ziel / 1000, zz(5, 9) * ziel / 1000, zz(1, 9) * ziel / 100, zz(1, 4) * ziel / 10]).slice(0, 4);
      if (ab.filter((x) => x === Math.min(...ab)).length > 1) return null;
      return auswahl(`Welche Zahl liegt am nächsten an ${name}?`, naechsteWahl(ziel, ab), h2('Bestimme für jede Zahl den Abstand. Achte darauf, an welcher Stelle sich die Zahlen unterscheiden.', `${satz} schreibt man ${fz(ziel)}.`),
        { nachweis: [{ art: 'naechste', ziel, frei: true }] }); },
    () => { const a = zz(2, 9) * BIO + zz(11, 98) * MRD, b = wahl([a + zz(1, 9) * 10 * MRD, Math.floor(a / 10), a - zz(1, 9) * MRD, a + zz(1, 9) * 100 * MIO]);
      return auswahl(`Welches Zeichen passt? ${fz(a)} ▢ ${fz(b)}`, zeichenwahl(a, b), h2('Zähle zuerst die Dreierblöcke. Bei gleich vielen Blöcken vergleichst du Block für Block von links.', `${fz(a)} hat ${String(a).length} Stellen, ${fz(b)} hat ${String(b).length} Stellen.`), { nachweis: [vergleich(a, b)] }); },
    () => { const [s, b] = wahl([[250 * MIO, MRD], [200 * MIO, MRD], [25 * MIO, 100 * MIO], [500 * MIO, 2 * MRD]]), st = { von: 0, bis: 3 * b, schritt: s, beschriftung: b };
      return zahl('Wie groß ist der Schritt von Teilstrich zu Teilstrich?', s, fehlerliste(s, [[b, 'strahl-einerschritte'], [s / 1000, 'million-milliarde'], [MIO, 'strahl-einerschritte']]),
        h2('Teile den Abstand zweier beschrifteter Teilstriche durch die Zahl der Schritte dazwischen.', `Von 0 bis ${fz(b)} sind es ${b / s} Schritte.`), { bild: B.strahl(st), nachweis: [{ art: 'schrittweite', wert: s }], lang: true }); },
    () => auswahl('Eine natürliche Zahl hat zehn Stellen, eine andere hat neun Stellen. Was weißt du sicher?', [
      opt(`Die Zahl mit zehn Stellen ist größer. Sie ist mindestens ${fz(MRD)}, die andere höchstens ${fz(MRD - 1)}.`, true),
      opt('Das kommt auf die erste Ziffer an: Beginnt die neunstellige Zahl mit 9, kann sie größer sein.', false, 'vergleich-erste-ziffer'),
      opt('Die Zahl mit zehn Stellen ist genau zehnmal so groß.', false, 'stellenwert'),
      opt('Ohne die Zahlen zu kennen, weiß man nichts.', false)],
    h2('Überlege, welche die kleinste Zahl mit zehn Stellen und welche die größte Zahl mit neun Stellen ist.', 'Die kleinste Zahl mit zehn Stellen ist 1 000 000 000.'), { nachweis: [{ art: 'vergleich', links: '999999999', rechts: '1000000000', zeichen: '<' }] }),
  ]);
  sechs(G_('B2'), 'E', [
    () => { const l = [zz(2, 9) * BIO, zz(2, 9) * 100 * MRD, zz(2, 9) * 10 * MRD + zz(2, 9) * MIO, zz(2, 9) * 100 * MIO, zz(2, 9) * 10 * MIO + 500000];
      return ordnen('Ordne die Zahlen. Beginne mit der größten Zahl.', l.map(zahlwort), h1('Achte zuerst auf das größte Zahlwort: Billion vor Milliarde vor Million.'),
        { nachweis: [{ art: 'ordnung', richtung: 'ab', system: 'wort' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'million-milliarde', links: 'größte', rechts: 'kleinste' }); },
    () => { const z = zz(2, 8) * MRD, st = { von: z, bis: z + MRD, schritt: 25 * MIO, beschriftung: 250 * MIO, ausschnitt: true }, p = zwischen(st);
      return lies('Auf welche Zahl zeigt der Pfeil?', st, p, [[einer(st, p), 'strahl-einerschritte'], [p - ((p - z) % (250 * MIO)) + ((p - z) % (250 * MIO)) / 25, 'strahl-einerschritte']],
        h1('Bestimme die Schrittweite aus zwei beschrifteten Teilstrichen und der Zahl der Schritte dazwischen.')); },
    () => { const l = auf([zz(101, 989) * MIO, zz(2, 9) * MRD + zz(11, 98) * MIO, zz(11, 98) * MRD]);
      return auswahl('Welche Kette ist richtig?', [opt(kette(l), true), opt(kette([l[0], l[2], l[1]])), opt(kette(l, '>'), false, 'zeichen-verwechselt'), opt(kette([l[2], l[1], l[0]]), false, 'zeichen-verwechselt'), opt(kette([l[1], l[0], l[2]]), false, 'vergleich-erste-ziffer')],
        h1('Zähle die Stellen jeder Zahl. In einer richtigen Kette stimmt jeder einzelne Vergleich.'), { nachweis: [{ art: 'ketten' }] }); },
    () => { const [st, wortSt] = wahl([[10, 'zehn'], [13, 'dreizehn'], [7, 'sieben']]), kl = 10 ** (st - 1);
      return luecken(`Die kleinste Zahl mit ${wortSt} Stellen ist {{a}}. Ihr Vorgänger ist {{b}}.`, { a: [kl, fehlerliste(kl, [[kl * 10, 'null-platzhalter'], [kl / 10, 'null-platzhalter']])], b: [kl - 1, fehlerliste(kl - 1, [[kl + 1, 'nachbar-verwechselt']])] },
        h1('Die kleinste Zahl mit einer bestimmten Stellenzahl beginnt mit 1, danach folgen nur Nullen.'), { nachweis: N(`${kl - 1} + 1`, `${kl} − 1`), lang: true }); },
    () => { const [ziel, name] = wahl([[500 * MIO, 'einer halben Milliarde'], [250 * MIO, 'einer Viertelmilliarde'], [500000, 'einer halben Million']]), ab = mische([zz(1, 4) * ziel / 500, zz(5, 9) * ziel / 500, zz(1, 9) * ziel / 50, zz(1, 4) * ziel / 5, zz(3, 9) * ziel / 5000]);
      if (ab.filter((x) => x === Math.min(...ab)).length > 1 || new Set(ab).size < 5) return null;
      return auswahl(`Welche Zahl liegt am nächsten an ${name}?`, naechsteWahl(ziel, ab), h1('Schreibe die gesuchte Zahl zuerst mit Ziffern auf und bestimme dann die Abstände.'), { nachweis: [{ art: 'naechste', ziel, frei: true }] }); },
    () => { const tage = 12;
      return zahl(`Eine Million Sekunden sind rund ${tage} Tage. Wie viele Tage sind dann eine Milliarde Sekunden?`, tage * 1000, fehlerliste(tage * 1000, [[tage * 100, 'million-milliarde'], [tage * MIO, 'million-milliarde'], [tage * 10, 'million-milliarde']]),
        h1('Überlege, wie oft eine Million in eine Milliarde passt.'), { nachweis: [HILFSZAHL(MIO, 'eine Million'), HILFSZAHL(MRD, 'eine Milliarde'), ...N(`${MRD} : ${MIO}`, `${tage} · 1000`)], einheit: 'Tage' }); },
  ]);
}
