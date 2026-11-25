// Aufgaben zu 6.4.7 „Bruch, Dezimalzahl und Prozent“ (Lernziele P1, P2) nach ADR 0015 und ADR 0047.
// P1: Prozent als Hundertstel. P2: zwischen Bruch, Dezimalzahl und Prozent umwandeln und vergleichen.
// Grilling mit Nils (2026-11-25): F und G mit dem Hunderterfeld (50, 25, 10, 1, 75, 20 %), M alle Nenner, die in 100 aufgehen, auch über 100 %,
// E 12,5 % und 33,3 % (gerundet) und Vergleiche. Kein Grundwert und kein Prozentwert: Das kommt in Klasse 7.

import { sechs, auswahl, luecken, zuordnen, ordnen, bruch, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { br, opt, zz, wahl, mische, kind, T, dfe, VGL, URTEIL, ZEICHEN, fig, bild, vorn, ggt, kz, hundert, MARKT } from './6-4-dezimal.mjs';

const P1 = '6.4.7-P1', P2 = '6.4.7-P2';
const UM = (z, n, mit, wie, gesucht = true) => ({ art: 'umformen', von: br(z, n), nach: wie === 'erweitern' ? br(z * mit, n * mit) : br(z / mit, n / mit), mit, wie, ...(gesucht ? { gesucht: true } : {}) });
const NB = (bruchText, extra = {}) => ({ art: 'bild', bruch: bruchText, form: true, ...extra });
const RN = (zahl, stelle, ergebnis, extra = {}) => ({ art: 'runden', zahl, stelle, ergebnis, ...extra });
const pz = (k) => `${String(k).replace('.', ',')} %`;
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
// Mehrere Hunderterfelder mit Namen A, B, C.
const felder = (...ks) => bild(...ks.map((k, i) => fig('hundert', null, vorn(k), { n: 'ABCD'[i] })));
const F_PROZENT = [50, 25, 10, 1, 75, 20];

export function prozent6() {
  // ================= P1: Prozent heißt Hundertstel =================
  const tF = h3('Das Hunderterfeld hat 100 Felder. Ein Feld ist 1 %.', '25 % heißt: 25 von 100 Feldern.', 'Zähle die gefärbten Felder. So viel Prozent sind es.');
  sechs(P1, 'F', [
    () => { const k = wahl([25, 10, 75, 20, 30, 40]), ks = mische([k, 100 - k, k + 10]);
      return auswahl(Z(`Kreuze das Feld mit ${pz(k)} an.`), ks.map((x, i) => opt(`Feld ${'ABC'[i]}`, x === k, x === 100 - k ? 'bruch-teil-zu-rest' : undefined)), tF,
        { bild: felder(...ks), nachweis: [{ art: 'figurwahl', bruch: br(k, 100) }] }); },
    () => { const k = wahl([20, 25, 10, 75, 50, 30, 40]);
      return dezimal(Z('Gib an, wie viel Prozent gefärbt sind.'), k, dfe(k, [[100 - k, 'bruch-teil-zu-rest']]), tF, { einheit: '%', bild: hundert(k), nachweis: [NB(br(k, 100)), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const k = wahl([50, 25, 75, 20, 10]), [a, c] = kz([k, 100]);
      return bruch(Z(`Schreibe ${pz(k)} als Bruch.`, 'Kürze so weit wie möglich.'), br(a, c), [[br(k, 10), 'dezimal-stelle'], [br(1, k), 'prozent-als-zaehler']].filter(([w]) => w !== br(a, c)), tF,
        { gekuerzt: true, bild: hundert(k), nachweis: [`${pz(k)} = ${br(k, 100)}`, UM(k, 100, ggt(k, 100), 'kuerzen')] }); },
    () => { const k = wahl([75, 25, 20, 10, 50, 1]), d = T(k, 2);
      return dezimal(Z(`Schreibe ${pz(k)} als Dezimalzahl.`), d, dfe(d, [[T(k, 1), 'dezimal-stelle'], [k, 'prozent-als-zaehler']]), tF, { bild: hundert(k), nachweis: [`${pz(k)} = ${br(k, 100)} = ${d}`] }); },
    () => { const [z, n] = wahl([[1, 2], [1, 4], [3, 4], [1, 10], [1, 5]]), k = (100 / n) * z;
      return auswahl(Z(`Kreuze an, wie viel Prozent ${br(z, n)} sind.`), richtigZuerst([opt(pz(k), true), opt(pz(z), false, 'prozent-als-zaehler'), opt(pz(n), false, 'prozent-als-zaehler')].filter((o, i, l) => l.findIndex((x) => x.text === o.text) === i)), tF,
        { bild: hundert(k), nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${pz(k)}`, { art: 'wert', wert: pz(k) }] }); },
    () => { const ks = mische([10, 25, 1, 50, 75]).slice(0, 3);
      return zuordnen(Z('Ordne jeder Zahl die passende Dezimalzahl zu.'), ks.map((k) => [pz(k), T(k, 2)]), h3('Prozent heißt Hundertstel.', '25 % = 25⁄100 = 0,25.', 'Schreibe die Zahl vor dem Zeichen % als Hundertstel mit Komma.'),
        { daten: { kopf: ['Prozent', 'Hundertstel', 'Dezimalzahl'], zeilen: [['1 %', '1⁄100', '0,01']] }, nachweis: [{ art: 'paare' }] }); },
  ]);
  const tG = h3('Prozent heißt Hundertstel. Erweitere den Bruch auf den Nenner 100.', '7⁄20 = 35⁄100 = 35 %.', 'Der Zähler mit dem Nenner 100 ist die Prozentzahl.');
  sechs(P1, 'G', [
    () => { const [k, t] = wahl([[35, 53], [45, 54], [15, 51], [62, 26], [8, 80], [80, 8]]), ks = mische([k, 100 - k, t]);
      return auswahl(Z(`Kreuze das Feld mit ${pz(k)} an.`), ks.map((x, i) => opt(`Feld ${'ABC'[i]}`, x === k, x === 100 - k ? 'bruch-teil-zu-rest' : undefined)), tG,
        { bild: felder(...ks), nachweis: [{ art: 'figurwahl', bruch: br(k, 100) }] }); },
    () => { const k = wahl([35, 45, 15, 62, 8, 80, 27]);
      return dezimal(Z('Gib an, wie viel Prozent des Hunderterfelds weiß sind.'), 100 - k, dfe(100 - k, [[k, 'bruch-teil-zu-rest']]), tG,
        { einheit: '%', bild: hundert(k), nachweis: [NB(br(100 - k, 100), { rest: true }), `${br(100 - k, 100)} = ${pz(100 - k)}`] }); },
    () => { const [z, n] = wahl([[7, 20], [9, 20], [3, 25], [11, 25], [13, 50], [3, 50], [17, 20]]), k = (100 / n) * z;
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`), k, dfe(k, [[z, 'prozent-als-zaehler'], [n, 'prozent-als-zaehler']]), tG, { einheit: '%', nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const k = wahl([8, 4, 6, 3, 9]), d = T(k, 2);
      return dezimal(Z(`Gib ${d} in Prozent an.`), k, dfe(k, [[k * 10, 'dezimal-stelle'], [T(k, 1), 'dezimal-stelle']]), tG, { einheit: '%', bild: hundert(k), nachweis: [`${d} = ${br(k, 100)} = ${pz(k)}`] }); },
    () => { const rad = zz(5, 14), k = rad * 4;
      return dezimal(Z('In der Klasse sind 25 Kinder.', `${rad} Kinder kommen mit dem Rad.`, 'Gib den Anteil in Prozent an.'), k, dfe(k, [[rad, 'prozent-als-zaehler'], [25 - rad, 'bruch-teil-zu-rest']]), tG,
        { einheit: '%', daten: { kopf: ['Schulweg', 'Kinder'], zeilen: [['Rad', String(rad)], ['anders', String(25 - rad)]] }, nachweis: [UM(rad, 25, 4, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const [z, n] = wahl([[3, 5], [2, 5], [3, 4], [7, 10], [4, 5]]), k = (100 / n) * z, kn = kind();
      return auswahl(Z(`${kn} sagt: „${br(z, n)} = ${pz(z)}“`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${br(k, 100)} = ${pz(k)}.`, true), opt('Stimmt.', false, 'prozent-als-zaehler'), opt(`Stimmt, denn der Zähler ist ${z}.`, false, 'prozent-als-zaehler')], tG,
        { bild: hundert(k), nachweis: [URTEIL(false, `${br(z, n)} = ${pz(z)}`)] }); },
  ]);
  const tM = h2('Prozent heißt Hundertstel: 100 % ist das Ganze. Mehr als das Ganze ist mehr als 100 %.', 'Schreibe die Zahl als Bruch mit dem Nenner 100 oder als Dezimalzahl mit zwei Stellen. Die Hundertstel sind die Prozentzahl.');
  sechs(P1, 'M', [
    () => { const k = wahl([120, 150, 105, 230, 175, 110]), d = T(k, 2);
      return dezimal(Z(`Gib ${d} in Prozent an.`), k, dfe(k, [[Number(String(k).slice(0, -1)), 'dezimal-stelle'], [k / 10 === Math.floor(k / 10) ? k / 10 : null, 'dezimal-stelle']]), tM, { einheit: '%', nachweis: [`${d} = ${br(k, 100)} = ${pz(k)}`] }); },
    () => { const [z, n] = wahl([[7, 4], [5, 4], [6, 5], [9, 5], [13, 10], [27, 20]]), k = (100 / n) * z;
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`), k, dfe(k, [[z, 'prozent-als-zaehler'], [100 - k + 100, 'bruch-teil-zu-rest']].filter(([w]) => w > 0 && w !== k)), tM, { einheit: '%', nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const [z, n] = wahl([[13, 25], [21, 25], [7, 50], [31, 50], [19, 20], [3, 4]]), k = (100 / n) * z;
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`), k, dfe(k, [[z, 'prozent-als-zaehler']]), tM, { einheit: '%', nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const k = wahl([135, 160, 104, 250, 115]), d = T(k, 2);
      return dezimal(Z(`Schreibe ${pz(k)} als Dezimalzahl.`), d, dfe(d, [[T(k, 1), 'dezimal-stelle'], [T(k, 3), 'dezimal-stelle']]), tM, { nachweis: [`${pz(k)} = ${br(k, 100)} = ${d}`] }); },
    () => { const wer = wahl(MARKT), verkauft = zz(11, 39), k = verkauft * 2;
      return dezimal(Z(`Die ${wer === 'Tuchhändler' || wer === 'Kaufmann' ? 'Stände' : 'Säcke'} auf dem Burgmarkt: ${wer === 'Tuchhändler' || wer === 'Kaufmann' ? 'Ein Händler' : 'Eine Händlerin'} hat 50 Säcke Waren.`, `${verkauft} Säcke sind schon verkauft.`, 'Gib den verkauften Anteil in Prozent an.'), k, dfe(k, [[verkauft, 'prozent-als-zaehler'], [100 - k, 'bruch-teil-zu-rest']]), tM,
        { einheit: '%', nachweis: [UM(verkauft, 50, 2, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const [d, falsch] = wahl([['1,5', 15], ['1,2', 12], ['2,5', 25], ['1,8', 18]]), k = Number(d.replace(',', '')) * 10, kn = kind();
      return auswahl(Z(`${kn} sagt: „${d} = ${pz(falsch)}“`, `${kn} meint: Mehr als 100 % gibt es nicht.`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${d} = ${br(k, 100)} = ${pz(k)}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Falsch. Es gilt ${d} = ${pz(k * 10)}.`, false, 'dezimal-stelle'), opt(`Stimmt, denn 100 % ist das Ganze.`, false, 'dezimal-stelle')], tM,
        { nachweis: [URTEIL(false, `${d} = ${pz(falsch)}`)] }); },
  ]);
  sechs(P1, 'E', [
    () => { const [z, n, k] = wahl([[1, 8, 12.5], [3, 8, 37.5], [5, 8, 62.5], [7, 8, 87.5], [1, 40, 2.5]]), d = T(z * (1000 / n), 3);
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`), String(k).replace('.', ','), dfe(String(k).replace('.', ','), [[Math.floor(k), 'runden-abschneiden'], [z, 'prozent-als-zaehler']]), h1('Wandle zuerst in eine Dezimalzahl um. Die Hundertstel und alles danach ergeben die Prozentzahl.'),
        { einheit: '%', nachweis: [UM(z, n, 1000 / n, 'erweitern'), `${br(z * (1000 / n), 1000)} = ${d} = ${pz(k)}`] }); },
    () => { const [z, n, l] = wahl([[1, 3, '33,3'], [2, 3, '66,7'], [1, 6, '16,7'], [5, 6, '83,3'], [1, 9, '11,1']]);
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`, 'Runde auf Zehntel Prozent.'), l, dfe(l, [[l.replace(/,\d$/, (x) => `,${Number(x.slice(1)) - (Number(x.slice(1)) >= 5 ? 1 : 0)}`), 'runden-abschneiden'], [z, 'prozent-als-zaehler']]),
        h1('Dividiere den Zähler durch den Nenner. Die Dezimalzahl ist periodisch, deshalb rundest du.'), { einheit: '%', nachweis: [RN(br(z, n), 1, `${l} %`, { einheit: '%' })] }); },
    () => { const [z, n] = wahl([[3, 8], [5, 8], [1, 3], [2, 3], [7, 20]]), k = wahl([35, 40, 60, 65, 33]), d = z / n - k / 100;
      if (Math.abs(d) < 1e-9) return null;
      return auswahl(Z('Kreuze das passende Zeichen an.', `${br(z, n)} ▢ ${pz(k)}`), ZEICHEN(d, 'prozent-als-zaehler'), h1('Wandle beide Angaben in Dezimalzahlen um. Vergleiche dann.'), { nachweis: [VGL(br(z, n), pz(k))] }); },
    () => { const liste = mische([['0,35', 0.35], ['3⁄8', 0.375], ['36 %', 0.36], ['1⁄3', 1 / 3], ['0,4', 0.4]]).slice(0, 4);
      return ordnen(Z('Ordne die Anteile der Größe nach.', 'Beginne mit dem kleinsten Anteil.'), [...liste].sort((x, y) => x[1] - y[1]).map(([t]) => t), h1('Schreibe alle Anteile als Dezimalzahl mit drei Stellen.'),
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'prozent-als-zaehler' }); },
    () => { const [z, n, l] = wahl([[2, 3, 67], [1, 3, 33], [1, 6, 17], [5, 6, 83], [4, 9, 44], [1, 7, 14]]);
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`, 'Runde auf ganze Prozent.'), l, dfe(l, [[Math.floor((z * 100) / n) === l ? l - 1 : Math.floor((z * 100) / n), 'runden-abschneiden'], [z, 'prozent-als-zaehler']]),
        h1('Dividiere und runde auf Hundertstel. Die Hundertstel sind die Prozentzahl.'), { einheit: '%', nachweis: [RN(br(z, n), 0, `${l} %`, { einheit: '%' })] }); },
    () => { const [p, z, n] = wahl([['12,5', 1, 8], ['37,5', 3, 8], ['62,5', 5, 8], ['2,5', 1, 40], ['87,5', 7, 8]]), k = Number(p.replace(',', ''));
      return bruch(Z(`Schreibe ${p} % als vollständig gekürzten Bruch.`), br(z, n), [[br(Number(p.replace(',', '')), 100), 'dezimal-stelle']], h1('Schreibe die Prozentangabe als Dezimalzahl mit drei Stellen. Kürze dann den Zehnerbruch.'),
        { gekuerzt: true, nachweis: [`${p} % = ${br(k, 1000)}`, UM(k, 1000, k / z, 'kuerzen')] }); },
  ]);

  // ================= P2: umwandeln und vergleichen =================
  const qF = h3('Bruch, Dezimalzahl und Prozent können dieselbe Zahl sein.', '1⁄2 = 0,5 = 50 %.', 'Erweitere den Bruch auf Hundertstel. Dann kannst du beide Formen ablesen.');
  sechs(P2, 'F', [
    () => { const [z, n] = wahl([[1, 2], [1, 4], [3, 4], [1, 5], [1, 10]]), k = (100 / n) * z;
      return luecken(Z(`Schreibe ${br(z, n)} auf zwei Arten.`, `${br(z, n)} = {{a}} = {{b}} %`), { a: [T(k, 2), dfe(T(k, 2), [[`${z},${n}`, 'bruch-als-komma']])], b: [k, dfe(k, [[z, 'prozent-als-zaehler']])] }, qF,
        { bild: hundert(k), nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${T(k, 2)} = ${pz(k)}`] }); },
    () => { const [k, z, n] = wahl([[30, 1, 4], [20, 1, 4], [60, 1, 2], [40, 1, 2], [10, 1, 5]]), a = pz(k), c = br(z, n);
      return auswahl(Z(`Feld A zeigt ${a}.`, `Feld B zeigt ${c}.`, 'Kreuze den größeren Anteil an.'), [opt(a, k / 100 > z / n, 'prozent-als-zaehler'), opt(c, z / n > k / 100, 'prozent-als-zaehler')].map((o) => (o.richtig ? opt(o.text, true) : o)), qF,
        { bild: felder(k, (100 / n) * z), nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const paare = mische([[1, 2], [1, 4], [3, 4], [1, 10], [1, 5]]).slice(0, 3);
      return zuordnen(Z('Ordne jedem Bruch die passende Zahl in Prozent zu.'), paare.map(([z, n]) => [br(z, n), pz((100 / n) * z)]), qF,
        { daten: { kopf: ['Bruch', 'Hundertstel', 'Prozent'], zeilen: [['1⁄2', '50⁄100', '50 %']] }, nachweis: [{ art: 'paare' }] }); },
    () => { const k = wahl([2, 4, 6, 8, 5]), d = T(k, 1);
      return dezimal(Z(`Schreibe ${d} in Prozent.`), k * 10, dfe(k * 10, [[k, 'dezimal-stelle']]), qF, { einheit: '%', bild: hundert(k * 10), nachweis: [`${d} = ${br(k * 10, 100)} = ${pz(k * 10)}`] }); },
    () => { const k = wahl([5, 2, 4, 7, 3]), d = T(k, 1), kn = kind();
      return auswahl(Z(`${kn} sagt: „${d} = ${pz(k)}“`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${d} = ${br(k * 10, 100)} = ${pz(k * 10)}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Stimmt, denn nach dem Komma steht ${k}.`, false, 'dezimal-stelle')], qF,
        { bild: hundert(k * 10), nachweis: [URTEIL(false, `${d} = ${pz(k)}`)] }); },
    () => { const set = mische([['0,3', 30], ['25 %', 25], ['1⁄2', 50], ['0,1', 10], ['75 %', 75]]).slice(0, 3);
      return ordnen(Z('Die Felder A, B und C zeigen die Zahlen.', 'Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), [...set].sort((x, y) => x[1] - y[1]).map(([t]) => t), qF,
        { bild: felder(...set.map(([, k]) => k)), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'prozent-als-zaehler' }); },
  ]);
  const qG = h3('Schreibe alle Zahlen gleich: als Dezimalzahl oder in Prozent.', '2⁄5 = 40⁄100 = 0,4 = 40 %.', 'Erweitere Brüche auf den Nenner 100. Vergleiche dann die Hundertstel.');
  sechs(P2, 'G', [
    () => { const [z, n] = wahl([[3, 4], [2, 5], [7, 20], [9, 25], [3, 20], [21, 50]]), k = (100 / n) * z;
      return luecken(Z(`Schreibe ${br(z, n)} auf drei Arten.`, `${br(z, n)} = {{a}}⁄100 = {{b}} = {{c}} %`), { a: [k, dfe(k, [[z, 'erweitern-nur-ein-teil']])], b: [T(k, 2), dfe(T(k, 2), [[`${z},${n}`, 'bruch-als-komma']])], c: [k, dfe(k, [[z, 'prozent-als-zaehler']])] }, qG,
        { bild: hundert(k), nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(k, 100)} = ${T(k, 2)} = ${pz(k)}`] }); },
    () => { const set = mische([['0,45', 45], ['2⁄5', 40], ['42 %', 42], ['0,4', 40]].slice(0, 3));
      return auswahl(Z('Kreuze den größten Anteil an.'), set.map(([t, k]) => opt(t, k === Math.max(...set.map((x) => x[1])), 'prozent-als-zaehler')).map((o) => (o.richtig ? opt(o.text, true) : o)), qG,
        { bild: felder(...set.map(([, k]) => k)), nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const sport = zz(5, 11), mathe = zz(3, 20 - sport - 2), kunst = 20 - sport - mathe, k = sport * 5;
      return dezimal(Z('20 Kinder nennen ihr Lieblingsfach.', 'Gib den Anteil für Sport in Prozent an.'), k, dfe(k, [[sport, 'prozent-als-zaehler']]), qG,
        { einheit: '%', daten: { kopf: ['Fach', 'Kinder'], zeilen: [['Sport', String(sport)], ['Mathe', String(mathe)], ['Kunst', String(kunst)]] }, nachweis: [UM(sport, 20, 5, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const k = wahl([40, 60, 80, 35, 45, 15, 65]), [a, c] = kz([k, 100]);
      return bruch(Z(`Schreibe ${pz(k)} als Bruch.`, 'Kürze vollständig.'), br(a, c), [[br(k, 10), 'dezimal-stelle']], qG, { gekuerzt: true, bild: hundert(k), nachweis: [`${pz(k)} = ${br(k, 100)}`, UM(k, 100, ggt(k, 100), 'kuerzen')] }); },
    () => { const [z, n] = wahl([[3, 5], [2, 5], [3, 4], [7, 20], [9, 25]]), k = wahl([55, 65, 38, 42, 70, 30, 74]), d = z / n - k / 100;
      if (Math.abs(d) < 1e-9) return null;
      return auswahl(Z('Kreuze das passende Zeichen an.', `${br(z, n)} ▢ ${pz(k)}`), ZEICHEN(d, 'prozent-als-zaehler'), qG, { nachweis: [VGL(br(z, n), pz(k))] }); },
    () => { const k = wahl([7, 3, 9, 6]), d = T(k, 1), kn = kind();
      return auswahl(Z(`${kn} sagt: „${d} = ${pz(k)}“`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${d} = ${T(k * 10, 2)} = ${pz(k * 10)}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Falsch. Es gilt ${d} = ${pz(k * 100)}.`, false, 'dezimal-stelle')], qG,
        { bild: hundert(k * 10), nachweis: [URTEIL(false, `${d} = ${pz(k)}`)] }); },
  ]);
  const qM = h2('Wandle alle Angaben in dieselbe Form um, am besten in Dezimalzahlen mit drei Stellen.', 'Mehr als das Ganze ist mehr als 100 %. Gemischte Zahlen haben die Ganzen vor dem Komma.');
  sechs(P2, 'M', [
    () => { const g = zz(1, 2), [z, n] = wahl([[1, 4], [3, 4], [1, 2], [2, 5], [3, 20]]), k = g * 100 + (100 / n) * z;
      return luecken(Z(`Schreibe ${br(z, n, g)} als Dezimalzahl und in Prozent.`, `${br(z, n, g)} = {{a}} = {{b}} %`), { a: [T(k, 2), dfe(T(k, 2), [[T((100 / n) * z, 2), 'bruch-ganzes-teil']])], b: [k, dfe(k, [[(100 / n) * z, 'bruch-ganzes-teil']])] }, qM,
        { nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(z, n, g)} = ${g} + ${br((100 / n) * z, 100)} = ${T(k, 2)} = ${pz(k)}`] }); },
    () => { const liste = [['0,6', 0.6], ['5⁄8', 0.625], ['62 %', 0.62], ['13⁄20', 0.65]];
      return ordnen(Z('Ordne die Anteile der Größe nach.', 'Beginne mit dem kleinsten Anteil.'), [...liste].sort((x, y) => x[1] - y[1]).map(([t]) => t), qM,
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'prozent-als-zaehler' }); },
    () => { const [z, n] = wahl([[3, 4], [7, 10], [4, 5], [13, 20]]), k = wahl([70, 72, 78, 65, 82].filter((x) => x !== (100 / n) * z));
      return auswahl(Z(`Akku A ist zu ${br(z, n)} geladen.`, `Akku B zeigt ${pz(k)}.`, 'Kreuze die Ladung des volleren Akkus an.'), [opt(br(z, n), z / n > k / 100, 'prozent-als-zaehler'), opt(pz(k), k / 100 > z / n, 'prozent-als-zaehler')].map((o) => (o.richtig ? opt(o.text, true) : o)), qM,
        { nachweis: [{ art: 'extrem', was: 'groesste' }] }); },
    () => { const k = wahl([45, 35, 85, 12, 64, 48]), [a, c] = kz([k, 100]);
      return bruch(Z(`Schreibe ${pz(k)} als vollständig gekürzten Bruch.`), br(a, c), [[br(k, 10), 'dezimal-stelle']], qM, { gekuerzt: true, nachweis: [`${pz(k)} = ${br(k, 100)}`, UM(k, 100, ggt(k, 100), 'kuerzen')] }); },
    () => { const ritter = zz(11, 29), k = ritter * 2;
      return dezimal(Z('In der Burg wohnen 50 Leute.', `${ritter} davon sind Ritter.`, 'Gib den Anteil der Ritter in Prozent an.'), k, dfe(k, [[ritter, 'prozent-als-zaehler'], [100 - k, 'bruch-teil-zu-rest']]), qM,
        { einheit: '%', nachweis: [UM(ritter, 50, 2, 'erweitern'), `${br(k, 100)} = ${pz(k)}`] }); },
    () => { const [z, n] = wahl([[1, 4], [3, 4], [1, 5], [2, 5], [1, 8]]), d = T((1000 / n) * z, 3), kn = kind(), falsch = `0,${n}`;
      return auswahl(Z(`${kn} rechnet: ${br(z, n)} = ${falsch} = ${pz(n * 10)}`, 'Finde den Fehler.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${d} = ${pz((100 / n) * z)}.`, true), opt('Stimmt.', false, 'bruch-als-komma'), opt(`Falsch. Es gilt ${br(z, n)} = ${pz(z)}.`, false, 'prozent-als-zaehler'), opt(`Stimmt, denn ${falsch} = ${pz(n * 10)}.`, false, 'bruch-als-komma')], qM,
        { nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
  ]);
  sechs(P2, 'E', [
    () => { const [z, n, k] = wahl([[5, 8, '62,5'], [3, 8, '37,5'], [7, 8, '87,5'], [1, 8, '12,5'], [3, 40, '7,5']]), d = T((1000 / n) * z, 3);
      return dezimal(Z(`Gib ${br(z, n)} in Prozent an.`), k, dfe(k, [[Math.floor(Number(k.replace(',', '.'))), 'runden-abschneiden'], [z, 'prozent-als-zaehler']]), h1('Wandle in eine Dezimalzahl mit drei Stellen um. Lies dann die Prozentzahl ab.'),
        { einheit: '%', nachweis: [UM(z, n, 1000 / n, 'erweitern'), `${br((1000 / n) * z, 1000)} = ${d} = ${k} %`] }); },
    () => { const [z, n, k] = wahl([[1, 3, 33], [2, 3, 67], [1, 6, 17], [1, 9, 11], [2, 3, 66]]);
      return auswahl(Z('Kreuze das passende Zeichen an.', `${br(z, n)} ▢ ${pz(k)}`), ZEICHEN(z / n - k / 100, 'periode-abgebrochen'), h1('Schreibe den Bruch als periodische Dezimalzahl. Vergleiche Stelle für Stelle.'), { nachweis: [VGL(br(z, n), pz(k))] }); },
    () => { const liste = mische([['1⁄3', 1 / 3], ['33 %', 0.33], ['0,3', 0.3], ['3⁄8', 0.375], ['0,35', 0.35]]);
      return ordnen(Z('Ordne die Anteile der Größe nach.', 'Beginne mit dem größten Anteil.'), [...liste].sort((x, y) => y[1] - x[1]).map(([t]) => t), h1('Schreibe alle Anteile als Dezimalzahl mit vier Stellen. 1⁄3 ist periodisch.'),
        { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'zeichen-verwechselt', sonst: 'periode-abgebrochen' }); },
    () => { const [z, n, falsch, richtig] = wahl([[2, 3, '0,6', '0,6̅'], [1, 3, '0,3', '0,3̅'], [1, 6, '0,16', '0,16̅']]), kn = kind();
      return auswahl(Z(`${kn} rechnet: ${br(z, n)} = ${falsch} = ${pz(Number(falsch.slice(2)) * (falsch.length === 3 ? 10 : 1))}`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${richtig}. Das ist mehr als ${falsch}.`, true), opt('Stimmt.', false, 'periode-abgebrochen'), opt(`Stimmt, denn ${z} : ${n} ist ungefähr ${falsch}.`, false, 'periode-abgebrochen')],
        h1('Dividiere den Zähler durch den Nenner. Prüfe, ob die Division aufgeht.'), { nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const [an, k, kuerz, erw] = wahl([[12, 40, 6, 20], [9, 30, 3, 10], [18, 30, 6, 20], [21, 30, 3, 10], [6, 30, 6, 20]]), [a, c] = [an / kuerz, 30 / kuerz], p = a * erw;
      return dezimal(Z('30 Kinder werden nach ihrem Lieblingstier gefragt.', `${an} Kinder nennen den Hund.`, 'Gib den Anteil in Prozent an.'), p, dfe(p, [[an, 'prozent-als-zaehler'], [100 - p, 'bruch-teil-zu-rest']]), h1('30 ist kein Teiler von 100. Kürze zuerst, dann erweitere auf 100.'),
        { einheit: '%', nachweis: [UM(an, 30, kuerz, 'kuerzen'), UM(a, c, erw, 'erweitern'), `${br(p, 100)} = ${pz(p)}`] }); },
    () => { const liste = mische([['0,505', true], ['49 %', false], ['5⁄9', true], ['0,5̅', true], ['1⁄2', false], ['51 %', true], ['0,49', false]]).slice(0, 5);
      if (!liste.some(([, r]) => r) || liste.every(([, r]) => r)) return null;
      return auswahl(Z('Kreuze alle Anteile an, die mehr als die Hälfte sind.'), liste.map(([t, r]) => opt(t, r, r ? undefined : 'prozent-als-zaehler')), h1('Die Hälfte ist 1⁄2 = 0,5 = 50 %. Vergleiche jede Angabe damit.'),
        { mehrfach: true, nachweis: [{ wert: '1⁄2', grund: 'die Hälfte' }, { art: 'schwelle', wert: '1⁄2', zeichen: '>' }] }); },
  ]);
}
