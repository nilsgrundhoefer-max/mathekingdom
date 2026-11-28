// Aufgaben zu 6.8.4 „Absolute und relative Häufigkeit“ (Lernziele H1, H2) nach ADR 0058.
// Gesamtzahlen nach Stufe: F 10, 20, 50, 100 (Anteil als Bruch, auf F ohne die Wörter „absolut“ und „relativ“), G auch 25 und 200 und Prozent,
// M 40 und 80, kürzen, erweitern, Dezimalzahl. E vergleicht bei verschiedenen Gesamtzahlen und rechnet rückwärts.
// Brüche sind vollständig gekürzt; ungekürzt ist „fast richtig“ (Brucheingabe wie in Kapitel 1).

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, zahl, luecken, bruchAufgabe, tabelle, LU, daten, summe, bruch, roh, dz, umfrage, ANTEIL, ANZAHL, KENN, URTEIL, WERT } from './6-8-daten.mjs';

const H1 = '6.8.4-H1', H2 = '6.8.4-H2';
// k Antworten mit Anzahlen, zusammen genau gesamt; jede Anzahl ein Vielfaches von schritt.
function verteile(gesamt, k, schritt = 1) {
  for (;;) {
    const teile = Array.from({ length: k - 1 }, () => schritt * zz(1, Math.floor(gesamt / schritt / (k - 1)) - 0));
    const rest = gesamt - summe(teile);
    if (rest > 0 && rest % schritt === 0 && new Set([...teile, rest]).size === k) return [...teile, rest];
  }
}
const tab = (antworten, anzahlen) => daten(['Antwort', 'Anzahl'], antworten.map((a, i) => [a, anzahlen[i]]));
const pz = (anzahl, gesamt) => (anzahl * 100) / gesamt;
const P = (x) => `${dz(x, 1)} %`;

export function haeufigkeit6() {
  // ================= H1: absolute und relative Häufigkeit =================
  const anteilBruch = (n, gesamte, k = 3, nicht = false) => () => { const g = wahl(gesamte), u = umfrage(), antworten = mische(u.antworten).slice(0, k), a = verteile(g, k), i = zz(0, k - 1), z = nicht ? g - a[i] : a[i];
    if (bruch(z, g) === roh(z, g) && n === 'F' && g !== 10) return null;
    const wort = n === 'F' ? 'den Anteil' : 'die relative Häufigkeit';
    return bruchAufgabe(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme ${wort} ${nicht ? `aller Antworten außer „${antworten[i]}“` : `von „${antworten[i]}“`}.`, 'Gib einen Bruch an.', 'Kürze vollständig.'), z, g,
      [[bruch(z, a[(i + 1) % k]), 'haeufigkeit-falsche-gesamtzahl'], [bruch(z, g - z), 'haeufigkeit-falsche-gesamtzahl'], ...(nicht ? [[bruch(a[i], g), 'sach-frage-verfehlt']] : [])],
      H(n, 'Oben im Bruch steht die Anzahl, unten die Gesamtzahl.', '6 von 20 Kindern: 6⁄20 = 3⁄10.', `Rechne ${nicht ? `${g} − ${a[i]}` : `${a[i]}`} von ${g}. Kürze dann.`), { daten: tab(antworten, a), nachweis: [ANTEIL(z, g, bruch(z, g), 'bruch')] }); };
  const gesamt = (n) => () => { const g = wahl([10, 20, 50]), u = umfrage(), antworten = mische(u.antworten).slice(0, 4), a = verteile(g, 4);
    return luecken(Z(`Die Tabelle zeigt eine Umfrage ${u.zum}.`, 'Bestimme die Gesamtzahl.', 'Gesamtzahl: {{a}}'), { a: [g, [[Math.max(...a), 'extrem-verwechselt'], [4, 'liste-verzaehlt']]] },
      H(n, 'Die Gesamtzahl sind alle Antworten zusammen.', 'Hund 3, Katze 5: 3 + 5 = 8.', `Rechne ${a.join(' + ')}.`), { daten: tab(antworten, a), nachweis: [`${a.join(' + ')} = ${g}`] }); };
  sechs(H1, 'F', [gesamt('F'), anteilBruch('F', [20]), anteilBruch('F', [10]), anteilBruch('F', [50]), anteilBruch('F', [20, 10], 3, true), anteilBruch('F', [100])]);

  const prozent = (n, gesamte, k = 4) => () => { const g = wahl(gesamte), u = umfrage(), antworten = mische(u.antworten).slice(0, k), a = verteile(g, k, g === 200 ? 2 : 1), i = zz(0, k - 1), p = pz(a[i], g);
    if (!Number.isInteger(p)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme die relative Häufigkeit für „${antworten[i]}“ in Prozent.`), p, '%', [[a[i], 'prozent-als-zaehler'], [pz(a[i], g - a[i]), 'haeufigkeit-falsche-gesamtzahl']],
      H(n, 'Erweitere oder kürze den Bruch auf den Nenner 100.', `${a[i]} von ${g}: ${roh(a[i], g)} = ${roh(p, 100)} = ${p} %.`, `Schreibe ${roh(a[i], g)} mit dem Nenner 100.`), { daten: tab(antworten, a), nachweis: [ANTEIL(a[i], g, p, 'prozent')] }); };
  const prozentTabelle = (n, gesamte, k = 3) => () => { const g = wahl(gesamte), u = umfrage(), antworten = mische(u.antworten).slice(0, k), a = verteile(g, k, g === 40 ? 2 : 1);
    if (a.some((x) => !Number.isInteger(pz(x, g)))) return null;
    const namen = 'abcd'.split('');
    return tabelle(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, 'Ergänze die relative Häufigkeit in Prozent.'), ['Antwort', 'absolute Häufigkeit', 'relative Häufigkeit in %'], antworten.map((x, i) => [x, String(a[i]), LU(namen[i])]),
      Object.fromEntries(antworten.map((_, i) => [namen[i], [pz(a[i], g), [[a[i], 'prozent-als-zaehler']]]])),
      H(n, 'Teile jede Anzahl durch die Gesamtzahl. Schreibe den Anteil mit dem Nenner 100.', `${a[0]} von ${g} sind ${roh(a[0], g)} = ${roh(pz(a[0], g), 100)}.`, `Die Gesamtzahl ist ${g}.`), { nachweis: antworten.map((_, i) => ANTEIL(a[i], g, pz(a[i], g), 'prozent', { luecke: namen[i] })) }); };
  const absolut = (n, gesamte) => () => { const g = wahl(gesamte), p = wahl([20, 40, 60, 80, 12, 24, 36, 44]), a = (p * g) / 100, u = umfrage();
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `${p} % nennen „${wahl(u.antworten)}“.`, 'Bestimme die absolute Häufigkeit.'), a, null, [[p, 'prozent-als-zaehler'], [g - a, 'sach-frage-verfehlt']],
      H(n, `${p} % heißt ${p} von 100.`, '20 % von 50: 50 : 100 · 20 = 10.', `Rechne ${g} : 100 · ${p}.`), { nachweis: [ANZAHL(p, 'prozent', g, a)] }); };
  const urteilProzent = (n) => () => { const g = wahl([40, 25, 50, 20]), a = wahl([2, 4, 6, 8]), kn = kind(), p = pz(a, g);
    if (!Number.isInteger(p)) return null;
    return auswahl(Z(`${a} von ${g} Kindern fahren mit dem Bus.`, `${kn} sagt: „Das sind ${a} %.“`, 'Beurteile die Aussage.'), [opt(`Falsch. Es sind ${roh(a, g)} = ${p} %.`, true), opt('Stimmt. Prozent ist die Anzahl.', false, 'prozent-als-zaehler'), opt(`Falsch. Es sind ${g - a} %.`, false)],
      H(n, 'Prozent heißt „von 100“. Schreibe den Anteil mit dem Nenner 100.', `4 von 20 sind 4⁄20 = 20⁄100 = 20 %.`, `Erweitere ${roh(a, g)} auf den Nenner 100.`), { nachweis: [ANTEIL(a, g, p, 'prozent'), URTEIL(false)] }); };
  sechs(H1, 'G', [anteilBruch('G', [20, 25, 50], 4), prozent('G', [25]), prozent('G', [200], 3), prozentTabelle('G', [20, 25, 50]), absolut('G', [25, 50, 200]), urteilProzent('G')]);

  const dezimal = (n, gesamte, k = 4) => () => { const g = wahl(gesamte), u = umfrage(), antworten = mische(u.antworten).slice(0, k), a = verteile(g, k, 4), i = zz(0, k - 1), d = a[i] / g;
    if (Math.round(d * 100) !== d * 100) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme die relative Häufigkeit für „${antworten[i]}“ als Dezimalzahl.`), d, null, [[a[i] / 100, 'haeufigkeit-falsche-gesamtzahl'], [pz(a[i], g), 'dezimal-stelle']],
      H(n, 'Erweitere den Bruch auf den Nenner 100 und schreibe ihn als Dezimalzahl.', `${roh(a[i], g)} = ${roh(pz(a[i], g), 100)}.`), { daten: tab(antworten, a), nachweis: [ANTEIL(a[i], g, dz(d, 2), 'dezimal')] }); };
  const summeProzent = (n) => () => { const g = wahl([40, 80]), u = umfrage(), antworten = mische(u.antworten).slice(0, 4), a = verteile(g, 4, g === 40 ? 2 : 4), i = zz(0, 3);
    return zahl(Z(`Die Tabelle zeigt eine Umfrage ${u.zum}.`, `Bestimme die relative Häufigkeit für „${antworten[i]}“ in Prozent.`), pz(a[i], g), '%', [[a[i], 'prozent-als-zaehler'], [pz(a[i], g - a[i]), 'haeufigkeit-falsche-gesamtzahl']],
      H(n, 'Bestimme zuerst die Gesamtzahl.', `Rechne ${a.join(' + ')}.`), { daten: tab(antworten, a), nachweis: [KENN('summe', a.map(String), String(g), { zwischen: true }), ANTEIL(a[i], g, pz(a[i], g), 'prozent')] }); };
  const fehlerSumme = (n) => () => { const g = wahl([40, 80]), u = umfrage(), antworten = mische(u.antworten).slice(0, 3), a = verteile(g, 3, g === 40 ? 2 : 4), p = a.map((x) => pz(x, g)), j = zz(0, 2), falsch = p.map((x, i) => (i === j ? x + 5 : x)), kn = kind();
    return auswahl(Z(`${kn} hat zu der Umfrage die relativen Häufigkeiten in Prozent berechnet: ${antworten.map((x, i) => `${x} ${falsch[i]} %`).join(', ')}.`, 'Beurteile die Rechnung.'),
      [opt(`Falsch. Zusammen sind es ${summe(falsch)} %. Bei „${antworten[j]}“ sind es ${p[j]} %.`, true), opt('Stimmt. Jede Antwort hat einen eigenen Prozentwert.', false), opt(`Falsch. Bei „${antworten[(j + 1) % 3]}“ sind es ${p[(j + 1) % 3] + 5} %.`, false), opt('Stimmt. Die Prozente müssen nicht 100 % ergeben.', false, 'haeufigkeit-falsche-gesamtzahl')],
      H(n, 'Alle relativen Häufigkeiten zusammen ergeben 100 %.', 'Prüfe jeden Wert einzeln mit der Tabelle.'), { daten: tab(antworten, a), nachweis: [ANTEIL(a[j], g, p[j], 'prozent'), URTEIL(false)] }); };
  const rueckAbsolut = (n) => () => { const g = 80, p = wahl([15, 35, 45, 55, 65]), a = (p * g) / 100, u = umfrage();
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Die relative Häufigkeit für „${wahl(u.antworten)}“ ist ${p} %.`, 'Bestimme die absolute Häufigkeit.'), a, null, [[p, 'prozent-als-zaehler'], [g - a, 'sach-frage-verfehlt']],
      H(n, '1 % von 80 ist 0,8.', `Rechne 80 : 100 · ${p}.`), { nachweis: [ANZAHL(p, 'prozent', g, a)] }); };
  sechs(H1, 'M', [anteilBruch('M', [40], 4), dezimal('M', [80]), prozentTabelle('M', [40], 4), summeProzent('M'), rueckAbsolut('M'), fehlerSumme('M')]);

  const zweiKlassenProzent = (n) => () => { const u = umfrage('sport', 'obst', 'tier'), antworten = mische(u.antworten).slice(0, 3), [k1, k2] = mische(['6a', '6b', '6c']).slice(0, 2), a = verteile(wahl([18, 20, 22]), 3), g = wahl([40, 50]), b = [0, 0, 0].map((_, i) => 0), i = zz(0, 2);
    const rest = g - summe(a), bb = verteile(rest, 3); const s = a[i] + bb[i], p = pz(s, g);
    if (rest < 9 || !Number.isInteger(p)) return null;
    return zahl(Z(`Die Tabelle zeigt eine Umfrage in der ${k1} und der ${k2}.`, `Bestimme für beide Klassen zusammen die relative Häufigkeit für „${antworten[i]}“ in Prozent.`), p, '%', [[pz(a[i], summe(a)), 'haeufigkeit-falsche-gesamtzahl'], [s, 'prozent-als-zaehler']],
      H(n, 'Zähle die Anzahlen beider Klassen zusammen. Die Gesamtzahl sind alle Kinder beider Klassen.'), { daten: daten(['Antwort', k1, k2], antworten.map((x, j) => [x, a[j], bb[j]])), nachweis: [`${a[i]} + ${bb[i]} = ${s}`, ANTEIL(s, g, p, 'prozent')] }); };
  const gesamtRueck = (n) => () => { const p = wahl([20, 25, 30, 40, 60]), g = wahl([20, 30, 40, 50, 60]), a = (p * g) / 100;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${a} Kinder einer Umfrage nennen „Fußball“.`, `Das sind ${p} % aller Befragten.`, 'Bestimme, wie viele Kinder befragt wurden.'), g, null, [[(a * p) / 100, 'sach-falsche-rechnung'], [a + p, 'sach-falsche-rechnung']],
      H(n, `${p} % sind ${a} Kinder. Rechne zuerst aus, wie viele Kinder 1 % oder 10 % sind.`), { nachweis: [ANZAHL(p, 'prozent', g, a)] }); };
  const falscheGesamt = (n) => () => { const u = umfrage('sport'), antworten = mische(u.antworten).slice(0, 3), a = verteile(25, 3), kn = kind();
    return auswahl(Z(`${kn} bestimmt die relative Häufigkeit für „${antworten[0]}“.`, `${kn} rechnet: ${roh(a[0], a[0] + a[1])}.`, 'Beurteile die Rechnung.'), [opt(`Falsch. Die Gesamtzahl ist 25, also ${bruch(a[0], 25)}.`, true), opt(`Stimmt. ${kn} vergleicht „${antworten[0]}“ und „${antworten[1]}“.`, false, 'haeufigkeit-falsche-gesamtzahl'), opt(`Falsch. Es muss ${roh(a[0], a[2])} heißen.`, false, 'haeufigkeit-falsche-gesamtzahl'), opt(`Falsch. Es muss ${roh(25, a[0])} heißen.`, false, 'bruch-vertauscht')],
      H(n, 'Unten im Bruch steht die Gesamtzahl aller Befragten.'), { daten: tab(antworten, a), nachweis: [ANTEIL(a[0], 25, bruch(a[0], 25), 'bruch'), URTEIL(false)] }); };
  const beideSpalten = (n) => () => { const g = 50, u = umfrage(), antworten = mische(u.antworten).slice(0, 4), a = verteile(g, 4), namen = 'abcd'.split('');
    return tabelle(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, 'Ergänze die Tabelle.'), ['Antwort', 'absolute Häufigkeit', 'relative Häufigkeit in %'], antworten.map((x, i) => (i < 2 ? [x, LU(namen[i]), `${pz(a[i], g)}`] : [x, String(a[i]), LU(namen[i])])),
      Object.fromEntries(antworten.map((_, i) => [namen[i], i < 2 ? [a[i], [[pz(a[i], g), 'prozent-als-zaehler']]] : [pz(a[i], g), [[a[i], 'prozent-als-zaehler']]]])),
      H(n, 'Bei 50 Befragten ist jedes Kind 2 %.'), { nachweis: antworten.map((_, i) => (i < 2 ? ANZAHL(pz(a[i], g), 'prozent', g, a[i], { luecke: namen[i] }) : ANTEIL(a[i], g, pz(a[i], g), 'prozent', { luecke: namen[i] }))) }); };
  const dazu = (n) => () => { const g = 20, a = wahl([6, 8, 10, 12]), d = 5, u = umfrage(), x = wahl(u.antworten), p = pz(a + d, g + d);
    return zahl(Z(`${g} ${u.wer} wurden gefragt. ${a} nennen „${x}“.`, `Dann werden noch ${d} ${u.wer} gefragt. Alle ${d} nennen „${x}“.`, `Bestimme die neue relative Häufigkeit für „${x}“ in Prozent.`), p, '%', [[pz(a + d, g), 'haeufigkeit-falsche-gesamtzahl'], [pz(a, g), 'sach-schritt-vergessen']],
      H(n, 'Neu sind die Anzahl und die Gesamtzahl größer.'), { nachweis: [`${a} + ${d} = ${a + d}`, `${g} + ${d} = ${g + d}`, ANTEIL(a + d, g + d, p, 'prozent')] }); };
  sechs(H1, 'E', [zweiKlassenProzent('E'), anteilBruch('E', [80, 120], 4), gesamtRueck('E'), falscheGesamt('E'), beideSpalten('E'), dazu('E')]);

  // ================= H2: Bruch, Dezimalzahl, Prozent und vergleichen =================
  const dreiFormen = (n, gesamte, schritt = 1) => () => { const g = wahl(gesamte), a = schritt * zz(1, Math.floor((g - 1) / schritt)), d = a / g, p = pz(a, g), u = umfrage(), x = wahl(u.antworten);
    if (Math.round(d * 100) !== d * 100 || a === g / 2) return null;
    return luecken(Z(`${a} von ${g} ${u.wer} nennen „${x}“.`, `Der Anteil ist ${roh(a, g)}.`, 'Schreibe den Anteil als Dezimalzahl und in Prozent.', 'Dezimalzahl: {{a}}', 'Prozent: {{b}} %'), { a: [d, [[a / 100, 'haeufigkeit-falsche-gesamtzahl'], [p, 'dezimal-stelle']]], b: [p, [[a, 'prozent-als-zaehler'], [d, 'dezimal-stelle']]] },
      H(n, 'Erweitere oder kürze auf den Nenner 100.', '3⁄10 = 30⁄100 = 0,30 = 30 %.', `Schreibe ${roh(a, g)} mit dem Nenner 100.`), { daten: daten(['Antwort', 'Anzahl'], [[x, a], ['andere', g - a]]), nachweis: [ANTEIL(a, g, dz(d, 2), 'dezimal', { luecke: 'a' }), ANTEIL(a, g, p, 'prozent', { luecke: 'b' })] }); };
  const prozentVon = (n, g) => () => { const a = zz(1, g - 1), p = pz(a, g), u = umfrage(), x = wahl(u.antworten);
    if (!Number.isInteger(p) || p === 50) return null;
    return zahl(Z(`${a} von ${g} ${u.wer} nennen „${x}“.`, 'Gib den Anteil in Prozent an.'), p, '%', [[a, 'prozent-als-zaehler'], [100 - p, 'sach-frage-verfehlt']],
      H(n, 'Prozent heißt Hundertstel.', '7 von 20 sind 7⁄20 = 35⁄100 = 35 %.', `Schreibe ${roh(a, g)} mit dem Nenner 100.`), { daten: daten(['Antwort', 'Anzahl'], [[x, a], ['andere', g - a]]), nachweis: [ANTEIL(a, g, p, 'prozent')] }); };
  const dezimalVon = (n) => () => { const a = zz(1, 9), u = umfrage(), x = wahl(u.antworten);
    if (a === 5) return null;
    return zahl(Z(`${a} von 10 ${u.wer} nennen „${x}“.`, 'Gib den Anteil als Dezimalzahl an.'), a / 10, null, [[a, 'dezimal-stelle'], [(10 - a) / 10, 'sach-frage-verfehlt']],
      H(n, 'Zehntel stehen an der ersten Stelle nach dem Komma.', '3 von 10 sind 3⁄10 = 0,3.', `${a} von 10 ist ${roh(a, 10)}.`), { daten: daten(['Antwort', 'Anzahl'], [[x, a], ['andere', 10 - a]]), nachweis: [ANTEIL(a, 10, dz(a / 10, 2), 'dezimal')] }); };
  const gleich = (n) => () => { const [b, d, p, falsch] = wahl([['1⁄2', '0,5', '50 %', '12 %'], ['1⁄4', '0,25', '25 %', '14 %'], ['3⁄4', '0,75', '75 %', '34 %'], ['1⁄5', '0,2', '20 %', '15 %'], ['1⁄10', '0,1', '10 %', '1 %']]);
    return auswahl(Z(`Der Anteil ${b} kommt in einer Umfrage vor.`, `Kreuze an, was dasselbe ist wie ${b}.`), [opt(p, true), opt(falsch, false, 'prozent-als-zaehler'), opt(`${d.replace(',', '')} %`, false, 'dezimal-stelle')].filter((o, i, l) => l.findIndex((x) => x.text === o.text) === i),
      H(n, 'Schreibe den Bruch mit dem Nenner 100.', '1⁄2 = 50⁄100 = 50 %.', `Erweitere ${b} auf den Nenner 100.`), { daten: daten(['Bruch', 'Prozent'], [[b, '?']]), nachweis: [FREI(`${b} = ${d} = ${p}`)] }); };
  // Vergleich zweier Gruppen mit verschiedenen Gesamtzahlen.
  const vergleich = (n, paare) => () => { const [[a1, g1], [a2, g2]] = wahl(paare).map(([g]) => { const a = zz(Math.ceil(g / 5), Math.floor((4 * g) / 5)); return [a, g]; }), [k1, k2] = mische(['5a', '6a', '6b']).slice(0, 2), u = umfrage('sport', 'obst', 'tier');
    const x = wahl(u.antworten), p1 = pz(a1, g1), p2 = pz(a2, g2);
    if (p1 === p2 || !Number.isInteger(p1) || !Number.isInteger(p2) || (a1 > a2) === (p1 > p2)) return null;
    const groesser = p1 > p2 ? k1 : k2, kleiner = p1 > p2 ? k2 : k1;
    return auswahl(Z(`In der ${k1} nennen ${a1} von ${g1} Kindern „${x}“.`, `In der ${k2} nennen ${a2} von ${g2} Kindern „${x}“.`, `Kreuze an, in welcher Klasse der Anteil größer ist.`), [opt(`In der ${groesser}. Es sind ${Math.max(p1, p2)} % statt ${Math.min(p1, p2)} %.`, true), opt(`In der ${kleiner}. Dort nennen mehr Kinder „${x}“.`, false, 'relativ-absolut-verwechselt'), opt('Der Anteil ist gleich groß.', false)],
      H(n, 'Die Klassen sind verschieden groß. Vergleiche die Anteile in Prozent, nicht die Anzahlen.', '6⁄10 = 60 % und 8⁄20 = 40 %.', 'Rechne beide Anteile in Prozent um.'), { daten: daten(['Klasse', `„${x}“`, 'Kinder'], [[k1, a1, g1], [k2, a2, g2]]), nachweis: [ANTEIL(a1, g1, p1, 'prozent'), ANTEIL(a2, g2, p2, 'prozent'), FREI('Der größere Anteil entscheidet, nicht die größere Anzahl')] }); };
  sechs(H2, 'F', [dreiFormen('F', [10]), prozentVon('F', 100), dezimalVon('F'), gleich('F'), vergleich('F', [[[10], [100]], [[20], [10]]]), prozentVon('F', 20)]);

  const prozentBruch = (n, liste) => () => { const p = wahl(liste), g = 100;
    return bruchAufgabe(Z(`${p} % der Befragten nennen „Fußball“.`, 'Schreibe den Anteil als Bruch.', 'Kürze vollständig.'), p, g, [[roh(p, 10), 'dezimal-stelle'], [roh(100 - p, 100), 'sach-frage-verfehlt']],
      H(n, 'Prozent heißt Hundertstel. Kürze dann.', '35 % = 35⁄100 = 7⁄20.', `Schreibe ${p}⁄100 und kürze.`), { daten: daten(['Antwort', 'Anteil'], [['Fußball', `${p} %`], ['andere', `${100 - p} %`]]), nachweis: [ANTEIL(p, 100, bruch(p, 100), 'bruch')] }); };
  const groesster = (n) => () => { const werte = mische([[3, 5, '3⁄5', 60], [11, 20, '0,55', 55], [29, 50, '58 %', 58], [13, 25, '52 %', 52], [7, 10, '0,7', 70], [3, 4, '3⁄4', 75], [16, 25, '0,64', 64]]).slice(0, 3), max = Math.max(...werte.map((w) => w[3])), min = Math.min(...werte.map((w) => w[3]));
    return auswahl(Z('Drei Umfragen zum Lieblingssport haben diese Anteile für „Fußball“ ergeben.', 'Kreuze den größten Anteil an.'), werte.map((w) => opt(w[2], w[3] === max, w[3] === min ? undefined : undefined)),
      H(n, 'Schreibe alle Anteile in Prozent. Dann kannst du sie vergleichen.', '3⁄5 = 60 %, 0,55 = 55 %.', 'Schreibe die Brüche und Dezimalzahlen in Prozent.'), { daten: daten(['Umfrage', 'Anteil'], werte.map((w, i) => [`${i + 1}. Umfrage`, w[2]])), nachweis: werte.map((w) => FREI(`${w[2]} = ${w[3]} %`)) }); };
  const urteilGleich = (n) => () => { const a = wahl([10, 12]), g1 = wahl([25, 40]), g2 = wahl([20, 50].filter((x) => x !== g1)), [k1, k2] = mische(['6a', '6b', '6c']).slice(0, 2), kn = kind(), p1 = pz(a, g1), p2 = pz(a, g2);
    if (!Number.isInteger(p1) || !Number.isInteger(p2)) return null;
    return auswahl(Z(`In der ${k1} nennen ${a} von ${g1} Kindern „Reiten“.`, `In der ${k2} nennen ${a} von ${g2} Kindern „Reiten“.`, `${kn} sagt: „Reiten ist in beiden Klassen gleich beliebt.“`, 'Beurteile die Aussage.'),
      [opt(`Falsch. In der ${k1} sind es ${p1} %, in der ${k2} ${p2} %.`, true), opt(`Stimmt. In beiden Klassen sind es ${a} Kinder.`, false, 'relativ-absolut-verwechselt'), opt(`Falsch. In der ${k1} sind es ${a} %, in der ${k2} ${a + 5} %.`, false, 'prozent-als-zaehler')],
      H(n, 'Gleich viele Kinder heißt nicht gleicher Anteil.', `${a} von ${g1} und ${a} von ${g2} sind verschiedene Anteile.`, 'Rechne beide Anteile in Prozent um.'), { daten: daten(['Klasse', '„Reiten“', 'Kinder'], [[k1, a, g1], [k2, a, g2]]), nachweis: [ANTEIL(a, g1, p1, 'prozent', { zwischen: true }), ANTEIL(a, g2, p2, 'prozent', { zwischen: true }), URTEIL(false)] }); };
  sechs(H2, 'G', [dreiFormen('G', [20]), prozentVon('G', 25), vergleich('G', [[[25], [20]], [[50], [25]], [[20], [50]]]), prozentBruch('G', [35, 45, 15, 65, 85]), groesster('G'), urteilGleich('G')]);

  const tabelleFormen = (n) => () => { const liste = mische([[1, 4], [3, 5], [7, 20], [9, 25], [3, 8], [11, 40]]).slice(0, 3), namen = ['a', 'b', 'c', 'd', 'e', 'f'];
    const zeilen = liste.map(([z, nn], i) => [roh(z, nn), LU(namen[2 * i]), LU(namen[2 * i + 1])]);
    const werte = Object.fromEntries(liste.flatMap(([z, nn], i) => [[namen[2 * i], [z / nn, [[pz(z, nn), 'dezimal-stelle']], 3]], [namen[2 * i + 1], [pz(z, nn), [[z, 'prozent-als-zaehler']], 1]]]));
    return tabelle(Z('Die Tabelle zeigt relative Häufigkeiten als Bruch.', 'Ergänze Dezimalzahl und Prozent.'), ['Bruch', 'Dezimalzahl', 'Prozent'], zeilen, werte,
      H(n, 'Erweitere auf den Nenner 100 oder 1000.', `${roh(liste[0][0], liste[0][1])} = ${dz(liste[0][0] / liste[0][1], 3)}.`), { nachweis: liste.flatMap(([z, nn], i) => [ANTEIL(z, nn, dz(z / nn, 3), 'dezimal', { luecke: namen[2 * i] }), ANTEIL(z, nn, dz(pz(z, nn), 1), 'prozent', { luecke: namen[2 * i + 1] })]) }); };
  const dezimalBruch = (n) => () => { const d = wahl([35, 45, 15, 64, 72, 36, 85]);
    return bruchAufgabe(Z(`Die relative Häufigkeit für „Bus“ ist 0,${d}.`, 'Schreibe sie als Bruch.', 'Kürze vollständig.'), d, 100, [[roh(d, 10), 'dezimal-stelle']],
      H(n, 'Zwei Stellen nach dem Komma sind Hundertstel.', `0,${d} = ${roh(d, 100)}.`), { nachweis: [ANTEIL(d, 100, bruch(d, 100), 'bruch')] }); };
  const mehrAberWeniger = (n) => () => { const [a1, g1, a2, g2] = wahl([[12, 30, 10, 20], [15, 50, 12, 25], [18, 40, 14, 25], [16, 40, 9, 20]]), [k1, k2] = mische(['6a', '6b', '6c']).slice(0, 2), kn = kind();
    return auswahl(Z(`In der ${k1} nennen ${a1} von ${g1} Kindern „Fußball“.`, `In der ${k2} nennen ${a2} von ${g2} Kindern „Fußball“.`, `${kn} sagt: „In der ${k1} gibt es mehr Fußballfans, aber der Anteil ist kleiner.“`, 'Beurteile die Aussage.'),
      [opt(`Stimmt. ${a1} ist mehr als ${a2}, aber ${pz(a1, g1)} % ist weniger als ${pz(a2, g2)} %.`, true), opt('Falsch. Mehr Fans bedeutet immer einen größeren Anteil.', false, 'relativ-absolut-verwechselt'), opt(`Falsch. In der ${k2} gibt es mehr Fußballfans.`, false), opt(`Stimmt. Die ${k1} hat ${a1 - a2} Fans mehr.`, false)],
      H(n, 'Vergleiche einmal die Anzahlen und einmal die Anteile in Prozent.', 'Rechne für jede Klasse Anzahl durch Gesamtzahl in Prozent um.'), { daten: daten(['Klasse', '„Fußball“', 'Kinder'], [[k1, a1, g1], [k2, a2, g2]]), nachweis: [ANTEIL(a1, g1, pz(a1, g1), 'prozent', { zwischen: true }), ANTEIL(a2, g2, pz(a2, g2), 'prozent', { zwischen: true }), URTEIL(true)] }); };
  sechs(H2, 'M', [dreiFormen('M', [40], 2), dezimal('M', [80]), vergleich('M', [[[40], [25]], [[40], [50]], [[80], [50]]]), dezimalBruch('M'), tabelleFormen('M'), mehrAberWeniger('M')]);

  const dreiGruppen = (n) => () => { const l = mische([[12, 40], [9, 25], [11, 20], [21, 50]]).slice(0, 3), p = l.map(([a, g]) => pz(a, g)), [k1, k2, k3] = ['6a', '6b', '6c'], max = Math.max(...p), maxAbs = Math.max(...l.map((x) => x[0]));
    if (new Set(p).size < 3 || l.findIndex((x) => x[0] === maxAbs) === p.indexOf(max)) return null;
    const k = [k1, k2, k3];
    return auswahl(Z('In drei Klassen wurde gefragt, wer ein Haustier hat.', 'Kreuze die Klasse mit dem größten Anteil an.'), k.map((x, i) => opt(x, p[i] === max, l[i][0] === maxAbs ? 'relativ-absolut-verwechselt' : undefined)),
      H(n, 'Vergleiche die relativen Häufigkeiten, nicht die Anzahlen.'), { daten: daten(['Klasse', 'mit Haustier', 'Kinder'], k.map((x, i) => [x, l[i][0], l[i][1]])), nachweis: [...l.map(([a, g]) => ANTEIL(a, g, pz(a, g), 'prozent', { zwischen: true })), FREI(`Größter Anteil ${max} %`)] }); };
  const zusammenAnzahl = (n) => () => { const a1 = wahl([6, 8, 9, 11]), g1 = 25, p2 = wahl([20, 30, 40, 60]), g2 = wahl([20, 30]), a2 = (p2 * g2) / 100;
    return zahl(Z(`In der 6a nennen ${a1} von ${g1} Kindern „Schwimmen“.`, `In der 6b sind es ${p2} % von ${g2} Kindern.`, 'Bestimme, wie viele Kinder beider Klassen zusammen „Schwimmen“ nennen.'), a1 + a2, null, [[a1 + p2, 'prozent-als-zaehler'], [a2, 'sach-schritt-vergessen']],
      H(n, 'Rechne den Prozentwert zuerst in eine Anzahl um.'), { nachweis: [ANZAHL(p2, 'prozent', g2, a2, { zwischen: true }), `${a1} + ${a2} = ${a1 + a2}`] }); };
  sechs(H2, 'E', [dreiFormen('E', [80], 4), dreiGruppen('E'), zusammenAnzahl('E'), mehrAberWeniger('E'), prozentBruch('E', [12, 24, 36, 48, 64, 96]), urteilGleich('E')]);
}
