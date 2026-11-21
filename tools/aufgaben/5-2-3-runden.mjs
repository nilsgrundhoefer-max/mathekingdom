// Aufgaben zu 5.2.3 „Runden“ (Lernziele R1 und R2) nach ADR 0015 und ADR 0030.
// R1 auf eine Stelle runden, R2 sinnvoll runden und gerundete Angaben deuten.
// F und G runden auf Zehner, Hunderter und Tausender. Ab M geht es bis zur Million und mit Übertrag (3996 wird 4000).
// Kontexte: Zahlen aus der echten Welt stehen nur gerundet und mit „rund“ da.

import { sechs, zahl, auswahl, opt, luecken, tabelle, strahl, L, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, fz, kind, U, rundeAuf, STELLENNAME } from '../werkzeug.mjs';

const R_ = (kurz) => `5.2.3-${kurz}`;
const ab = (n, auf) => Math.floor(n / auf) * auf;
const runden = (zahl_, auf, frei) => ({ art: 'runden', zahl: zahl_, auf, wert: rundeAuf(zahl_, auf), ...(frei ? { frei: true } : {}) });
const grenze = (wert, auf, was = {}) => ({ art: 'rundungsgrenze', wert, auf, ...was });
// Zahlenstrahl zwischen den beiden Nachbarn der Zahl, die Zahl ist markiert.
const um = (n, auf, breit = 1) => { const von = ab(n, auf) - (breit - 1) * auf / 2; return B.strahl({ von, bis: von + auf * breit, schritt: auf / 10, beschriftung: auf, punkte: [n], ...(von > 0 ? { ausschnitt: true } : {}) }); };
// Typische Fehler beim Runden von n auf die Stelle `auf`.
function fehler(n, auf) {
  const richtig = rundeAuf(n, auf), ziffer = Math.floor(n / (auf / 10)) % 10, hoch = richtig > n;
  return fehlerliste(richtig, [
    [hoch ? ab(n, auf) : ab(n, auf) + auf, ziffer === 5 ? 'runden-fuenf-ab' : 'falsch-gerundet'],
    [auf > 10 ? rundeAuf(n, auf / 10) : rundeAuf(n, 100), 'runden-falsche-stelle'],
    [rundeAuf(n, auf * 10), 'runden-falsche-stelle'],
    [hoch ? n + auf : null, 'runden-ziffern-stehen'],
  ].filter(([w]) => w != null && w > 0));
}
// Eine Zahl, die an der Rundungsstelle nicht glatt ist und deren Nachbarziffer passt.
const zahlMit = (von, bis, auf, ziffern = [1, 2, 3, 4, 6, 7, 8, 9]) => suche(() => zz(von, bis), (x) => ziffern.includes(Math.floor(x / (auf / 10)) % 10) && x % auf !== 0 && x % (auf / 10) !== 0 || (auf === 10 && ziffern.includes(x % 10)));
const ORTE = [['Im Stadion sind', 'Menschen'], ['Im Zoo leben', 'Tiere'], ['In der Bücherei stehen', 'Bücher'], ['Zum Burgfest kommen', 'Gäste'], ['Im Hafen liegen', 'Kisten'], ['Auf der Wiese stehen', 'Schafe']];

export function rundenAufgaben() {
  // =====================================================================
  // R1 Auf eine Stelle runden
  // =====================================================================
  sechs(R_('R1'), 'F', [
    () => { const n = zahlMit(11, 98, 10);
      return zahl(Z(`Die Zahl ${n} ist am Zahlenstrahl markiert.`, `Runde ${n} auf Zehner.`), rundeAuf(n, 10), fehler(n, 10),
        h3('Suche die beiden Nachbarzehner. Welcher liegt näher?', '47 liegt näher an 50 als an 40. Also: 47 ≈ 50.', `Die Nachbarzehner sind ${ab(n, 10)} und ${ab(n, 10) + 10}.`), { bild: um(n, 10), nachweis: [runden(n, 10)] }); },
    () => { const n = zahlMit(11, 98, 10), st = { von: ab(n, 10), bis: ab(n, 10) + 10, schritt: 1, beschriftung: 10, punkte: [n], ...(n > 10 ? { ausschnitt: true } : {}) };
      return strahl('markieren', Z(`Runde ${n} auf Zehner.`, 'Tippe die gerundete Zahl am Zahlenstrahl an.'), st, rundeAuf(n, 10), fehler(n, 10).filter((f) => f.wert >= st.von && f.wert <= st.bis),
        h3('Welcher Zehner liegt näher an der Zahl?', '63 liegt näher an 60 als an 70.', `Zähle die Schritte bis ${ab(n, 10)} und bis ${ab(n, 10) + 10}.`), { nachweis: [runden(n, 10)] }); },
    () => { const n = zahlMit(11, 98, 10) * 10;
      return zahl(Z(`Die Zahl ${n} ist am Zahlenstrahl markiert.`, `Runde ${n} auf Hunderter.`), rundeAuf(n, 100), fehler(n, 100),
        h3('Suche die beiden Hunderter links und rechts. Welcher liegt näher?', '370 liegt näher an 400 als an 300. Also: 370 ≈ 400.', `Die Zahl liegt zwischen ${ab(n, 100)} und ${ab(n, 100) + 100}.`), { bild: um(n, 100), nachweis: [runden(n, 100)] }); },
    () => { const n = zz(1, 9) * 10 + 5;
      return zahl(Z(`Die Zahl ${n} liegt genau in der Mitte.`, `Runde ${n} auf Zehner.`), n + 5, fehler(n, 10),
        h3('Bei 5 wird aufgerundet. So ist es abgemacht.', '35 liegt in der Mitte zwischen 30 und 40. Man rundet auf: 35 ≈ 40.', `Runde auf: Nimm den größeren Zehner.`), { bild: um(n, 10), nachweis: [runden(n, 10)] }); },
    () => { const n = suche(() => zz(112, 987), (x) => x % 10 !== 5 && x % 10 !== 0 && Math.floor(x / 10) % 10 !== 5 && rundeAuf(x, 10) % 100 !== 0);
      return luecken(Z(`Runde die Zahl ${n} zweimal.`, 'Auf Zehner: {{a}}', 'Auf Hunderter: {{b}}'), { a: [rundeAuf(n, 10), fehler(n, 10)], b: [rundeAuf(n, 100), fehler(n, 100)] },
        h3('Für die Zehner schaust du auf die Einer. Für die Hunderter schaust du auf die Zehner.', '248 auf Zehner: 250. 248 auf Hunderter: 200.', `Die Einer sind ${n % 10}. Die Zehner sind ${Math.floor(n / 10) % 10}.`), { bild: um(n, 100), nachweis: [runden(n, 10), runden(n, 100)] }); },
    () => { const n = zahlMit(11, 98, 10), hoch = rundeAuf(n, 10) > n;
      return auswahl(Z(`Die Zahl ${n} wird auf Zehner gerundet.`, 'Was passiert?'), [opt(`Es wird abgerundet auf ${ab(n, 10)}.`, !hoch, hoch ? 'falsch-gerundet' : undefined), opt(`Es wird aufgerundet auf ${ab(n, 10) + 10}.`, hoch, hoch ? undefined : 'falsch-gerundet'), opt(`Die Zahl bleibt ${n}.`, false, 'runden-ziffern-stehen')],
        h3('Schau auf die Einer. Bei 0 bis 4 rundest du ab. Bei 5 bis 9 rundest du auf.', '82 hat 2 Einer. Es wird abgerundet auf 80.', `Die Zahl hat ${n % 10} Einer.`), { bild: um(n, 10), nachweis: [runden(n, 10)] }); },
  ]);
  sechs(R_('R1'), 'G', [
    () => { const n = zahlMit(1112, 9887, 100);
      return zahl(Z(`Runde ${n} auf Hunderter.`), rundeAuf(n, 100), fehler(n, 100),
        h3('Die Rundungsstelle sind die Hunderter. Schau auf die Ziffer rechts daneben.', '3482 auf Hunderter: Rechts neben der 4 steht eine 8. Aufrunden: 3500.', `Rechts neben den Hundertern steht ${Math.floor(n / 10) % 10}.`), { nachweis: [runden(n, 100)] }); },
    () => { const n = zahlMit(11, 98, 10) * 100 + zz(1, 9) * 10 + zz(0, 9) + 10000 * zz(0, 8);
      return zahl(Z(`Die Zahl ${fz(n)} ist am Zahlenstrahl markiert.`, `Runde ${fz(n)} auf Tausender.`), rundeAuf(n, 1000), fehler(n, 1000),
        h3('Schau auf die Ziffer bei den Hundertern. Sie entscheidet.', '4720 auf Tausender: Bei den Hundertern steht 7. Aufrunden: 5000.', `Bei den Hundertern steht ${Math.floor(n / 100) % 10}.`), { bild: um(n, 1000), nachweis: [runden(n, 1000)], lang: n > 99999 }); },
    () => { const n = suche(() => zz(1112, 8887), (x) => [x % 10, Math.floor(x / 10) % 10, Math.floor(x / 100) % 10].every((c) => c !== 0 && c !== 5) && rundeAuf(x, 10) % 100 !== 0 && rundeAuf(x, 100) % 1000 !== 0);
      return tabelle(Z(`Runde die Zahl ${n} dreimal.`, 'Jedes Mal ist eine andere Stelle gefragt.'), ['Zahl', 'auf Zehner', 'auf Hunderter', 'auf Tausender'], [[n, L('a'), L('b'), L('c')]], { a: [rundeAuf(n, 10), fehler(n, 10)], b: [rundeAuf(n, 100), fehler(n, 100)], c: [rundeAuf(n, 1000), fehler(n, 1000)] },
        h3('Geh jedes Mal von der Zahl selbst aus. Rechts von der Rundungsstelle stehen danach Nullen.', '3482: auf Zehner 3480, auf Hunderter 3500, auf Tausender 3000.', `Für die Zehner zählt die Einerziffer ${n % 10}.`), { nachweis: [runden(n, 10), runden(n, 100), runden(n, 1000)] }); },
    () => { const n = zz(11, 98) * 100 + 50, n2 = n % 1000 === 950 ? n - 100 : n;
      return zahl(Z(`Die Zahl ${n2} liegt genau in der Mitte.`, `Runde ${n2} auf Hunderter.`), n2 + 50, fehler(n2, 100),
        h3('Die Rundungsregel sagt: Bei 5 wird aufgerundet.', '6450 auf Hunderter: Rechts neben der 4 steht eine 5. Aufrunden: 6500.', `Rechts neben den Hundertern steht eine 5. Runde auf.`), { bild: um(n2, 100), nachweis: [runden(n2, 100)] }); },
    () => { const h = zz(2, 9) * 100;
      const r = suche(() => zz(h - 50, h + 49), (x) => x !== h), f1 = suche(() => zz(h - 99, h - 51), () => true), f2 = suche(() => zz(h + 50, h + 99), () => true);
      return auswahl(Z('Eine Zahl wird auf Hunderter gerundet.', `Das Ergebnis ist ${h}.`, 'Welche Zahl kann es gewesen sein?'), [opt(String(r), true), opt(String(f1), false, 'falsch-gerundet'), opt(String(f2), false, f2 === h + 50 ? 'runden-fuenf-ab' : 'falsch-gerundet')],
        h3('Runde jede der 3 Zahlen auf Hunderter. Nur eine ergibt das Ergebnis.', '651 ergibt 700. 649 ergibt 600.', `Die gesuchte Zahl liegt zwischen ${h - 50} und ${h + 49}.`), { nachweis: [{ art: 'rundenwahl', auf: 100, wert: h }] }); },
    () => { const k = kind(), t = zz(1, 8) * 1000, h = zz(1, 8) * 100, n = t + h + 40 + zz(5, 9), z1 = rundeAuf(n, 10), z2 = rundeAuf(z1, 100);
      return auswahl(Z(`${k} rundet ${n} auf Hunderter.`, `${k} rundet zuerst auf Zehner: ${z1}.`, `Dann rundet ${k} weiter auf Hunderter: ${z2}.`, 'Stimmt das Ergebnis?'), [opt('Stimmt.', false, 'runden-kette'), opt(`Falsch. Man rundet in einem Schritt. Richtig ist ${rundeAuf(n, 100)}.`, true), opt(`Falsch. Richtig ist ${rundeAuf(n, 1000) === 0 ? 1000 : rundeAuf(n, 1000)}.`, false, 'runden-falsche-stelle')],
        h3('Es zählt nur die Ziffer direkt rechts neben der Rundungsstelle.', '1449 auf Hunderter: Rechts neben der 4 steht eine 4. Abrunden: 1400.', `Rechts neben den Hundertern steht eine 4. Also wird abgerundet.`), { bild: um(n, 100), nachweis: [U(false), runden(n, 100)] }); },
  ]);
  sechs(R_('R1'), 'M', [
    () => { const n = zahlMit(111111, 988888, 10000);
      return zahl(`Runde ${fz(n)} auf Zehntausender.`, rundeAuf(n, 10000), fehler(n, 10000), h2('Suche die Rundungsstelle und schau nur auf die Ziffer rechts daneben.', `Rechts neben den Zehntausendern steht ${Math.floor(n / 1000) % 10}.`), { nachweis: [runden(n, 10000)], lang: true }); },
    () => { const [n, auf] = wahl([[zz(1, 8) * 1000 + 990 + zz(5, 9), 10], [zz(1, 8) * 10000 + 9900 + zz(50, 99), 100], [zz(1, 8) * 1000 + 950 + zz(0, 49), 100], [zz(1, 8) * 100000 + 99000 + zz(500, 999), 1000]]), r = rundeAuf(n, auf);
      return zahl(`Runde ${fz(n)} auf ${STELLENNAME[auf]}.`, r, fehlerliste(r, [[ab(n, auf), 'falsch-gerundet'], [r - auf * 10, 'runden-uebertrag'], [ab(n, auf * 10) + auf, 'runden-uebertrag']]),
        h2('An der Rundungsstelle steht eine 9. Wird sie aufgerundet, entsteht ein Übertrag in die nächste Stelle.', `Zwischen welchen ${STELLENNAME[auf]}n liegt die Zahl? Der obere Nachbar ist ${fz(r)}.`), { nachweis: [runden(n, auf)], lang: n > 99999 }); },
    () => { const n = suche(() => zz(1111111, 8888888), (x) => [1000, 100000, 1000000].every((a) => { const c = Math.floor(x / (a / 10)) % 10; return c !== 0 && c !== 5; }) && Math.floor(x / 100000) % 10 !== 9 && Math.floor(x / 1000) % 10 !== 9);
      return tabelle(`Runde die Zahl ${fz(n)} auf drei verschiedene Stellen.`, ['Zahl', 'auf Tausender', 'auf Hunderttausender', 'auf Millionen'], [[fz(n), L('a'), L('b'), L('c')]], { a: [rundeAuf(n, 1000), fehler(n, 1000)], b: [rundeAuf(n, 100000), fehler(n, 100000)], c: [rundeAuf(n, 1000000), fehler(n, 1000000)] },
        h2('Geh jedes Mal von der ursprünglichen Zahl aus, nicht vom letzten Ergebnis.', `Für die Tausender entscheidet die Hunderterziffer ${Math.floor(n / 100) % 10}.`), { nachweis: [runden(n, 1000), runden(n, 100000), runden(n, 1000000)], lang: true }); },
    () => { const n = zahlMit(11111111, 88888888, 1000000);
      return zahl(`Runde ${fz(n)} auf Millionen.`, rundeAuf(n, 1000000), fehler(n, 1000000), h2('Die Rundungsstelle ist die Millionenstelle. Es entscheidet die Ziffer der Hunderttausender.', `Bei den Hunderttausendern steht ${Math.floor(n / 100000) % 10}.`), { nachweis: [runden(n, 1000000)], lang: true }); },
    () => { const [auf, wert] = wahl([[100, zz(12, 88) * 100], [10, zz(12, 88) * 10], [1000, zz(12, 88) * 1000]]);
      return luecken(`Eine Zahl wurde auf ${STELLENNAME[auf]} gerundet. Das Ergebnis ist ${fz(wert)}. Die kleinste mögliche Zahl ist {{a}}, die größte mögliche Zahl ist {{b}}.`, { a: [wert - auf / 2, fehlerliste(wert - auf / 2, [[wert - auf / 2 + 1, 'runden-fuenf-ab'], [wert - auf, 'falsch-gerundet']])], b: [wert + auf / 2 - 1, fehlerliste(wert + auf / 2 - 1, [[wert + auf / 2, 'runden-fuenf-ab'], [wert + auf - 1, 'falsch-gerundet']])] },
        h2('Ab der Ziffer 5 wird aufgerundet, bis zur Ziffer 4 wird abgerundet.', `Die kleinste Zahl endet auf ${String(auf / 2).slice(0, 1)}${'0'.repeat(String(auf / 2).length - 1)}, die größte liegt um 1 unter der nächsten solchen Grenze.`), { nachweis: [grenze(wert, auf, { kleinste: wert - auf / 2, groesste: wert + auf / 2 - 1 })], lang: true }); },
    () => { const [auf, wert] = wahl([[10, zz(3, 98) * 10], [100, zz(3, 98) * 100]]), k = wert - auf / 2, g = wert + auf / 2 - 1;
      return zahl(`Wie viele natürliche Zahlen ergeben auf ${STELLENNAME[auf]} gerundet die Zahl ${wert}?`, auf, fehlerliste(auf, [[auf - 1, 'begriffe-verwechselt'], [auf / 2, 'falsch-gerundet'], [auf + 1, 'begriffe-verwechselt']]),
        h2('Bestimme die kleinste und die größte Zahl, die zu diesem Ergebnis gerundet wird. Zähle dann beide mit.', `Die kleinste Zahl ist ${k}, die größte ist ${g}.`), { nachweis: [grenze(wert, auf, { kleinste: k, groesste: g }), ...N(`${g} − ${k}`, `${g - k} + 1`)] }); },
  ]);
  sechs(R_('R1'), 'E', [
    () => { const [n, auf] = wahl([[zz(1, 8) * 1000000 + 999000 + zz(500, 999), 1000], [zz(1, 8) * 10000000 + 9960000 + zz(1, 39999), 100000], [zz(1, 8) * 100000 + 99950 + zz(0, 49), 100]]), r = rundeAuf(n, auf);
      return zahl(`Runde ${fz(n)} auf ${STELLENNAME[auf]}.`, r, fehlerliste(r, [[ab(n, auf), 'falsch-gerundet'], [r - auf * 10, 'runden-uebertrag'], [r - auf * 100, 'runden-uebertrag']]),
        h1('Der Übertrag kann über mehrere Stellen laufen. Überlege, zwischen welchen beiden Nachbarn die Zahl liegt.'), { nachweis: [runden(n, auf)], lang: true }); },
    () => { const [n, auf] = suche(() => { const a = wahl([10, 100, 1000, 10000]); return [zz(111111, 888888), a]; }, ([x, a]) => [10, 100, 1000, 10000, 100000].filter((s) => rundeAuf(x, s) === rundeAuf(x, a)).length === 1 && x % a !== 0);
      return auswahl(`Aus der Zahl ${fz(n)} wurde durch Runden die Zahl ${fz(rundeAuf(n, auf))}. Auf welche Stelle wurde gerundet?`, [10, 100, 1000, 10000, 100000].map((s) => opt(STELLENNAME[s], s === auf, s === auf ? undefined : 'runden-falsche-stelle')),
        h1('Vergleiche die beiden Zahlen von rechts: Ab welcher Stelle stehen nur noch Nullen?'), { nachweis: [{ art: 'rundungsstelle', zahl: n, wert: rundeAuf(n, auf), auf }] }); },
    () => { const [auf, wert] = wahl([[1000, zz(12, 88) * 10000 + zz(1, 9) * 1000], [10000, zz(12, 88) * 10000], [100000, zz(12, 88) * 100000]]);
      return luecken(`Eine Zahl wurde auf ${STELLENNAME[auf]} gerundet. Das Ergebnis ist ${fz(wert)}. Die kleinste mögliche Zahl ist {{a}}, die größte mögliche Zahl ist {{b}}.`, { a: [wert - auf / 2, fehlerliste(wert - auf / 2, [[wert - auf / 2 + 1, 'runden-fuenf-ab'], [wert - auf, 'falsch-gerundet']])], b: [wert + auf / 2 - 1, fehlerliste(wert + auf / 2 - 1, [[wert + auf / 2, 'runden-fuenf-ab'], [wert + auf - 1, 'falsch-gerundet']])] },
        h1('Überlege, ab welcher Zahl aufgerundet und bis zu welcher Zahl abgerundet wird.'), { nachweis: [grenze(wert, auf, { kleinste: wert - auf / 2, groesste: wert + auf / 2 - 1 })], lang: true }); },
    () => { const [a, b] = [kind(), kind()], n = zz(11, 88) * 1000 + zz(1, 9) * 100 + 40 + zz(5, 9), s1 = rundeAuf(n, 10), s2 = rundeAuf(s1, 100), s3 = rundeAuf(s2, 1000);
      if (a === b || s3 === rundeAuf(n, 1000)) return null;
      return luecken(`${a} rundet ${fz(n)} in Schritten: erst auf Zehner zu ${fz(s1)}, dann auf Hunderter zu ${fz(s2)}, dann auf Tausender zu {{a}}. ${b} rundet ${fz(n)} in einem Schritt auf Tausender und erhält {{b}}. Nur das Ergebnis von ${b} ist richtig.`, { a: [s3, fehlerliste(s3, [[rundeAuf(n, 1000), 'runden-kette']])], b: [rundeAuf(n, 1000), fehlerliste(rundeAuf(n, 1000), [[s3, 'runden-kette']])] },
        h1('Beim schrittweisen Runden kann jeder Schritt aufrunden, obwohl die ursprüngliche Zahl näher am unteren Nachbarn liegt.'), { nachweis: [runden(n, 10), runden(s1, 100), runden(s2, 1000), runden(n, 1000)], lang: true }); },
    () => { const [auf, wert] = wahl([[100, zz(12, 88) * 100], [1000, zz(12, 88) * 1000]]), k = wert - auf / 2, g = wert + auf / 2 - 1;
      return zahl(`Wie viele natürliche Zahlen ergeben auf ${STELLENNAME[auf]} gerundet die Zahl ${fz(wert)}?`, auf, fehlerliste(auf, [[auf - 1, 'begriffe-verwechselt'], [auf / 2, 'falsch-gerundet'], [auf + 1, 'begriffe-verwechselt']]),
        h1('Bestimme die kleinste und die größte Zahl mit diesem Ergebnis und zähle beide mit.'), { nachweis: [grenze(wert, auf, { kleinste: k, groesste: g }), ...N(`${g} − ${k}`, `${g - k} + 1`)] }); },
    () => { const [auf, wert] = wahl([[1000, zz(3, 98) * 1000], [100, zz(3, 98) * 100], [10000, zz(3, 98) * 10000]]);
      return zahl(`Eine Zahl ergibt auf ${STELLENNAME[auf]} gerundet ${fz(wert)}. Wie weit kann sie höchstens von ${fz(wert)} entfernt sein?`, auf / 2, fehlerliste(auf / 2, [[auf / 2 - 1, 'runden-fuenf-ab'], [auf, 'falsch-gerundet'], [auf - 1, 'falsch-gerundet']]),
        h1('Prüfe beide Seiten: die kleinste und die größte Zahl, die zu diesem Ergebnis gerundet wird.'), { nachweis: [grenze(wert, auf, { kleinste: wert - auf / 2, groesste: wert + auf / 2 - 1 }), ...N(`${wert} − ${wert - auf / 2}`)] }); },
  ]);

  // =====================================================================
  // R2 Sinnvoll runden und gerundete Angaben deuten
  // =====================================================================
  sechs(R_('R2'), 'F', [
    () => { const [satz, ding] = wahl(ORTE), n = zahlMit(11, 98, 10) * 10 + zz(1, 9);
      return zahl(Z(`${satz} ${n} ${ding}.`, 'Runde die Zahl auf Hunderter.'), rundeAuf(n, 100), fehler(n, 100),
        h3('Suche die beiden Hunderter links und rechts. Welcher liegt näher?', '478 liegt näher an 500 als an 400.', `Die Zahl liegt zwischen ${ab(n, 100)} und ${ab(n, 100) + 100}.`), { bild: um(n, 100), nachweis: [runden(n, 100)], einheit: ding }); },
    () => { const h = zz(2, 8) * 100, r = suche(() => zz(h - 49, h + 49), (x) => x !== h && x % 10 !== 0), f1 = zz(h - 90, h - 55), f2 = zz(h + 51, h + 90);
      return auswahl(Z(`In der Zeitung steht: „Rund ${h} Gäste kamen zum Fest.“`, 'Die Zahl ist auf Hunderter gerundet.', 'Welche Zahl kann genau stimmen?'), [opt(String(r), true), opt(String(f1), false, 'falsch-gerundet'), opt(String(f2), false, 'falsch-gerundet')],
        h3('Runde jede Zahl auf Hunderter. Welche ergibt die Zahl aus der Zeitung?', '287 ergibt gerundet 300. Aber 238 ergibt 200.', `Die Zahl muss näher an ${h} liegen als an ${h - 100} oder ${h + 100}.`),
        { bild: B.strahl({ von: h - 100, bis: h + 100, schritt: 10, beschriftung: 100, punkte: [h], ausschnitt: true }), nachweis: [{ art: 'rundenwahl', auf: 100, wert: h }] }); },
    () => { const n = zahlMit(11, 98, 10), [satz, einheit] = wahl([['Der Weg zur Burg ist', 'km'], ['Das Seil ist', 'm'], ['Der Turm ist', 'm']]);
      return zahl(Z(`${satz} ${n} ${einheit} ${satz.includes('Turm') ? 'hoch' : 'lang'}.`, 'Runde die Zahl auf Zehner.'), rundeAuf(n, 10), fehler(n, 10),
        h3('Schau auf die Einer. Bei 0 bis 4 rundest du ab. Bei 5 bis 9 rundest du auf.', '62 km sind rund 60 km.', `Die Zahl hat ${n % 10} Einer.`), { bild: um(n, 10), nachweis: [runden(n, 10)], einheit }); },
    () => { const k = kind(), z = zz(3, 9) * 10;
      return zahl(Z(`${k} sagt: „Ich habe rund ${z} Karten.“`, 'Die Zahl ist auf Zehner gerundet.', `Wie viele Karten hat ${k} mindestens?`), z - 5, fehlerliste(z - 5, [[z, 'falsch-gerundet'], [z - 4, 'runden-fuenf-ab'], [z - 10, 'falsch-gerundet']]),
        h3('Welche Zahlen werden auf diesen Zehner gerundet? Suche die kleinste.', 'Rund 50: Die kleinste Zahl ist 45. Denn bei 5 wird aufgerundet.', `Suche die kleinste Zahl mit dem Ergebnis ${z}. Sie endet auf 5.`),
        { bild: B.strahl({ von: z - 10, bis: z + 10, schritt: 1, beschriftung: 10, punkte: [z], ausschnitt: true }), nachweis: [grenze(z, 10, { kleinste: z - 5 })], einheit: 'Karten' }); },
    () => { const [satz, ding] = wahl(ORTE), n = zz(1, 8) * 1000 + zahlMit(11, 98, 10) * 10 + zz(1, 9), r = rundeAuf(n, 100);
      return auswahl(Z(`${satz} genau ${n} ${ding}.`, 'Auf einem Plakat soll eine runde Zahl stehen.', 'Welche Angabe passt am besten?'), [opt(`rund ${r} ${ding}`, true), opt(`rund ${r > n ? r - 100 : r + 100} ${ding}`, false, 'falsch-gerundet'), opt(`rund ${rundeAuf(n, 1000) === r ? r + 1000 : rundeAuf(n, 1000) + 2000} ${ding}`, false, 'runden-falsche-stelle')],
        h3('Die runde Zahl soll nah an der genauen Zahl liegen.', '1238 Tiere: Auf dem Plakat steht rund 1200 Tiere.', `Die Zahl liegt zwischen ${ab(n, 100)} und ${ab(n, 100) + 100}.`), { bild: um(n, 100), nachweis: [runden(n, 100, true)] }); },
    () => { const n = zahlMit(11, 98, 10) * 10 + zz(1, 9);
      return zahl(Z(`Ein Buch hat ${n} Seiten.`, 'Wie viele Seiten sind das ungefähr?', 'Runde auf Hunderter.'), rundeAuf(n, 100), fehler(n, 100),
        h3('Schau auf die Zehner. Bei 0 bis 4 rundest du ab. Bei 5 bis 9 rundest du auf.', '312 Seiten sind rund 300 Seiten.', `Bei den Zehnern steht ${Math.floor(n / 10) % 10}.`), { bild: um(n, 100), nachweis: [runden(n, 100)], einheit: 'Seiten' }); },
  ]);
  sechs(R_('R2'), 'G', [
    () => { const [satz, ding] = wahl(ORTE), n = zahlMit(11, 98, 10) * 100 + zz(1, 99);
      return zahl(Z(`${satz} ${n} ${ding}.`, 'Runde die Zahl auf Tausender.'), rundeAuf(n, 1000), fehler(n, 1000),
        h3('Die Rundungsstelle sind die Tausender. Schau auf die Hunderter.', '4720 Gäste sind rund 5000 Gäste.', `Bei den Hundertern steht ${Math.floor(n / 100) % 10}.`), { nachweis: [runden(n, 1000)], einheit: ding }); },
    () => { const k = wahl(['5a', '5b', '5c']), n = zz(22, 29);
      return auswahl(Z('Welche Zahl ist genau gezählt?'), [opt(`In der Klasse ${k} sind ${n} Kinder.`, true), opt(`Im Stadion sind rund ${fz(zz(3, 7) * 10000)} Menschen.`, false, 'gezaehlt-geschaetzt'), opt(`Die Stadt hat etwa ${fz(zz(2, 9) * 100000)} Einwohner.`, false, 'gezaehlt-geschaetzt')],
        h3('Die Wörter rund und etwa zeigen: Die Zahl ist gerundet.', 'Rund 500 Gäste: Das ist gerundet. 24 Kinder in der Klasse: Das ist gezählt.', 'Suche den Satz ohne rund und ohne etwa.')); },
    () => { const h = zz(3, 9) * 100, r = suche(() => zz(h - 50, h + 49), (x) => x !== h && x % 10 !== 0), f1 = zz(h - 99, h - 51), f2 = zz(h + 50, h + 99);
      return auswahl(Z(`Eine Schule meldet: „Wir haben rund ${h} Kinder.“`, 'Die Zahl ist auf Hunderter gerundet.', 'Welche Zahl kann genau stimmen?'), [opt(String(r), true), opt(String(f1), false, 'falsch-gerundet'), opt(String(f2), false, f2 === h + 50 ? 'runden-fuenf-ab' : 'falsch-gerundet')],
        h3('Runde jede Zahl auf Hunderter.', '751 ergibt 800. Aber 749 ergibt 700.', `Passend sind alle Zahlen von ${h - 50} bis ${h + 49}.`),
        { bild: B.strahl({ von: h - 100, bis: h + 100, schritt: 10, beschriftung: 100, punkte: [h], ausschnitt: true }), nachweis: [{ art: 'rundenwahl', auf: 100, wert: h }] }); },
    () => { const z = zz(3, 9) * 10, ding = wahl(['Murmeln', 'Äpfel', 'Münzen']);
      return luecken(Z(`In einer Kiste sind rund ${z} ${ding}.`, 'Die Zahl ist auf Zehner gerundet.', 'Es sind mindestens {{a}}.', 'Es sind höchstens {{b}}.'), { a: [z - 5, fehlerliste(z - 5, [[z - 4, 'runden-fuenf-ab'], [z - 10, 'falsch-gerundet']])], b: [z + 4, fehlerliste(z + 4, [[z + 5, 'runden-fuenf-ab'], [z + 9, 'falsch-gerundet']])] },
        h3('Suche die kleinste und die größte Zahl mit diesem Ergebnis.', 'Rund 70: mindestens 65, höchstens 74.', `Die kleinste Zahl endet auf 5. Die größte Zahl endet auf 4.`),
        { bild: B.strahl({ von: z - 10, bis: z + 10, schritt: 1, beschriftung: 10, punkte: [z], ausschnitt: true }), nachweis: [grenze(z, 10, { kleinste: z - 5, groesste: z + 4 })] }); },
    () => { const n = suche(() => zz(11, 88) * 1000 + zz(101, 899), (x) => Math.floor(x / 100) % 10 !== 5 && Math.floor(x / 100) % 10 !== 0), r = rundeAuf(n, 1000);
      return auswahl(Z(`Ein Dorf im Königreich hat genau ${fz(n)} Einwohner.`, 'Auf dem Schild am Tor soll eine runde Zahl stehen.', 'Was passt am besten?'), [opt(`rund ${fz(r)} Einwohner`, true), opt(`rund ${fz(r > n ? r - 1000 : r + 1000)} Einwohner`, false, 'falsch-gerundet'), opt(`rund ${fz(100000)} Einwohner`, false, 'runden-falsche-stelle')],
        h3('Eine runde Zahl ist leicht zu merken. Sie soll aber nah an der genauen Zahl liegen.', '48 372 Einwohner: Auf dem Schild steht rund 48 000 Einwohner.', `Die Zahl liegt zwischen ${fz(ab(n, 1000))} und ${fz(ab(n, 1000) + 1000)}.`), { nachweis: [runden(n, 1000, true)] }); },
    () => { const k = kind(), h = zz(3, 9) * 100;
      return auswahl(Z(`In der Zeitung steht: „Rund ${h} Besucher.“`, 'Die Zahl ist auf Hunderter gerundet.', `${k} sagt: „Dann waren es mindestens ${h}.“`, 'Stimmt das?'), [opt('Stimmt.', false, 'falsch-gerundet'), opt(`Falsch. Es können auch nur ${h - 50} gewesen sein.`, true), opt(`Falsch. Es waren genau ${h}.`, false, 'gezaehlt-geschaetzt')],
        h3('Beim Runden wird auch aufgerundet. Die genaue Zahl kann also kleiner sein.', 'Rund 300: Es können auch 250 gewesen sein. Denn 250 wird auf 300 aufgerundet.', `Die kleinste Zahl mit dem Ergebnis ${h} endet auf 50.`),
        { bild: B.strahl({ von: h - 100, bis: h + 100, schritt: 10, beschriftung: 100, punkte: [h], ausschnitt: true }), nachweis: [U(false), grenze(h, 100, { kleinste: h - 50 })] }); },
  ]);
  sechs(R_('R2'), 'M', [
    () => { const n = zahlMit(11111, 88888, 1000), [satz, ding] = wahl([['Ein Stadion hat', 'Plätze'], ['Zum Stadtlauf melden sich', 'Menschen'], ['In der Schatzkammer des Königs liegen', 'Münzen']]);
      return zahl(`${satz} ${fz(n)} ${ding}. Gib die Zahl auf Tausender gerundet an.`, rundeAuf(n, 1000), fehler(n, 1000), h2('Für die Tausender entscheidet die Ziffer der Hunderter.', `Bei den Hundertern steht ${Math.floor(n / 100) % 10}.`), { nachweis: [runden(n, 1000)], einheit: ding }); },
    () => auswahl('Bei welcher Angabe ist Runden nicht sinnvoll?', [opt(wahl(['bei einer Telefonnummer', 'bei einer Postleitzahl', 'bei einer Hausnummer']), true), opt('bei der Einwohnerzahl einer Stadt', false, 'gezaehlt-geschaetzt'), opt('bei der Zuschauerzahl eines Spiels', false, 'gezaehlt-geschaetzt'), opt('bei der Entfernung zwischen zwei Städten', false, 'gezaehlt-geschaetzt')],
      h2('Überlege, ob die gerundete Zahl noch denselben Zweck erfüllt.', 'Eine gerundete Größenangabe bleibt brauchbar. Eine Zahl, die etwas genau bezeichnet, wird durch Runden falsch.')),
    () => { const t = zz(11, 88) * 1000;
      return luecken(`Ein Verein meldet rund ${fz(t)} Zuschauer. Die Zahl ist auf Tausender gerundet. Es waren mindestens {{a}} und höchstens {{b}} Zuschauer.`, { a: [t - 500, fehlerliste(t - 500, [[t - 499, 'runden-fuenf-ab'], [t - 1000, 'falsch-gerundet'], [t, 'falsch-gerundet']])], b: [t + 499, fehlerliste(t + 499, [[t + 500, 'runden-fuenf-ab'], [t + 999, 'falsch-gerundet']])] },
        h2('Ab der Hunderterziffer 5 wird aufgerundet, bis zur Hunderterziffer 4 wird abgerundet.', `Die kleinste Zahl endet auf 500, die größte auf 499.`), { nachweis: [grenze(t, 1000, { kleinste: t - 500, groesste: t + 499 })], lang: true }); },
    () => { const [n, auf] = suche(() => [zz(1111, 8888), wahl([10, 100, 1000])], ([x, a]) => [10, 100, 1000].filter((s) => rundeAuf(x, s) === rundeAuf(x, a)).length === 1 && x % 10 !== 0);
      return auswahl(`In einem Bericht steht statt der genauen Zahl ${n} die Zahl ${rundeAuf(n, auf)}. Auf welche Stelle wurde gerundet?`, [10, 100, 1000, 10000].map((s) => opt(STELLENNAME[s], s === auf, s === auf ? undefined : 'runden-falsche-stelle')),
        h2('Vergleiche die beiden Zahlen von rechts: Ab welcher Stelle stehen nur noch Nullen?', `Runde ${n} probeweise auf jede Stelle.`), { nachweis: [{ art: 'rundungsstelle', zahl: n, wert: rundeAuf(n, auf), auf }] }); },
    () => { const je = wahl([100, 50]), n = suche(() => zz(1210, 4890), (x) => x % je !== 0 && x % je < je / 2), q = Math.floor(n / je), [satz, frage, einheit] = wahl([[`Ein Verein hat ${n} Mitglieder. Jedes Mitglied bekommt ein Heft. Die Hefte gibt es nur in Paketen zu je ${je} Stück.`, 'Wie viele Pakete muss der Verein bestellen?', 'Pakete'], [`Der König lädt ${n} Gäste ein. In jedes Zelt passen ${je} Gäste.`, 'Wie viele Zelte braucht er?', 'Zelte']]);
      return zahl(`${satz} ${frage}`, q + 1, fehlerliste(q + 1, [[q, 'falsch-gerundet'], [q + 2, 'falsch-gerundet']]),
        h2('Hier darf man nicht nach der Rundungsregel abrunden: Auch der Rest braucht noch ein Paket oder ein Zelt.', `${q} reichen nur für ${q * je}.`), { nachweis: N(`${n} : ${je} = ${q} Rest ${n % je}`, `${q} + 1`), einheit }); },
    () => { const k = kind(), t = zz(3, 9) * 1000;
      return auswahl(`Zwei Zahlen ergeben auf Tausender gerundet beide ${t}. ${k} sagt: „Dann unterscheiden sich die beiden Zahlen höchstens um 500.“ Stimmt das?`, [opt('Stimmt.', false, 'falsch-gerundet'), opt(`Falsch. Sie können fast 1000 auseinanderliegen, zum Beispiel ${t - 500} und ${t + 499}.`, true), opt('Falsch. Die beiden Zahlen müssen gleich sein.', false, 'gezaehlt-geschaetzt'), opt(`Falsch. Sie unterscheiden sich höchstens um 100.`, false, 'runden-falsche-stelle')],
        h2('Bestimme die kleinste und die größte Zahl, die auf diesen Tausender gerundet wird.', `Die kleinste Zahl ist ${t - 500}, die größte ist ${t + 499}.`), { nachweis: [U(false), grenze(t, 1000, { kleinste: t - 500, groesste: t + 499 })] }); },
  ]);
  sechs(R_('R2'), 'E', [
    () => { const n = zahlMit(1111111, 8888888, 1000000);
      return zahl(`Im Königreich leben ${fz(n)} Menschen. Gib die Zahl auf Millionen gerundet an.`, rundeAuf(n, 1000000), fehler(n, 1000000), h1('Es entscheidet allein die Ziffer der Hunderttausender.'), { nachweis: [runden(n, 1000000)], lang: true }); },
    () => { const a = zz(2, 5) * 1000, b = zz(6, 9) * 1000;
      return luecken(`Zwei Dörfer haben rund ${a} und rund ${b} Einwohner. Beide Zahlen sind auf Tausender gerundet. Zusammen haben die Dörfer mindestens {{a}} und höchstens {{b}} Einwohner.`, { a: [a + b - 1000, fehlerliste(a + b - 1000, [[a + b, 'falsch-gerundet'], [a + b - 500, 'falsch-gerundet']])], b: [a + b + 998, fehlerliste(a + b + 998, [[a + b + 499, 'falsch-gerundet'], [a + b + 1000, 'runden-fuenf-ab'], [a + b + 999, 'runden-fuenf-ab']])] },
        h1('Bestimme für jedes Dorf die kleinste und die größte mögliche Zahl und addiere dann.'),
        { nachweis: [grenze(a, 1000, { kleinste: a - 500, groesste: a + 499 }), grenze(b, 1000, { kleinste: b - 500, groesste: b + 499 }), ...N(`${a - 500} + ${b - 500}`, `${a + 499} + ${b + 499}`)] }); },
    () => { const je = wahl([48, 52, 45]), n = suche(() => zz(610, 1990), (x) => x % je !== 0 && x % je < je / 2), q = Math.floor(n / je);
      return zahl(`Zum Turnier reisen ${n} Fans mit Bussen an. In einen Bus passen ${je} Fans. Wie viele Busse werden mindestens gebraucht?`, q + 1, fehlerliste(q + 1, [[q, 'falsch-gerundet']]),
        h1('Überlege, was mit den Fans geschieht, die nach den vollen Bussen übrig bleiben.'), { nachweis: N(`${n} : ${je} = ${q} Rest ${n % je}`, `${q} + 1`), einheit: 'Busse' }); },
    () => { const [a, b] = [kind(), kind()], z = zz(2, 9) * 100 + 50;
      if (a === b) return null;
      return auswahl(`${a} rundet eine Zahl auf Zehner und erhält ${z}. ${b} rundet dieselbe Zahl auf Hunderter. Welches Ergebnis kann ${b} erhalten?`, [
        opt(`${z - 50} oder ${z + 50}: Bei ${z - 5} ergibt sich ${z - 50}, bei ${z + 4} ergibt sich ${z + 50}.`, true),
        opt(`Nur ${z + 50}, denn bei 5 wird immer aufgerundet.`, false, 'runden-kette'),
        opt(`Nur ${z - 50}, denn die Zahl wurde schon einmal gerundet.`, false, 'falsch-gerundet'),
        opt(`Nur ${z}, denn die Zahl ist schon rund.`, false, 'runden-ziffern-stehen')],
      h1('Bestimme zuerst alle Zahlen, die auf Zehner gerundet dieses Ergebnis haben, und runde die kleinste und die größte davon auf Hunderter.'),
      { nachweis: [grenze(z, 10, { kleinste: z - 5, groesste: z + 4 }), runden(z - 5, 100, true), runden(z + 4, 100, true)] }); },
    () => { const [n, auf] = suche(() => [zz(1111111, 8888888), wahl([1000, 10000, 100000])], ([x, a]) => [100, 1000, 10000, 100000, 1000000].filter((s) => rundeAuf(x, s) === rundeAuf(x, a)).length === 1);
      return auswahl(`Im Königreich leben genau ${fz(n)} Menschen. Im Bericht des Schreibers steht die Zahl ${fz(rundeAuf(n, auf))}. Mit welcher Genauigkeit hat er gerundet, also auf welche Stelle?`, [100, 1000, 10000, 100000, 1000000].map((s) => opt(STELLENNAME[s], s === auf, s === auf ? undefined : 'runden-falsche-stelle')),
        h1('Runde die genaue Zahl probeweise auf verschiedene Stellen und vergleiche mit dem Bericht.'), { nachweis: [{ art: 'rundungsstelle', zahl: n, wert: rundeAuf(n, auf), auf }] }); },
    () => { const k = kind(), x = wahl([14, 24, 34, 13]), s = 2 * x;
      return auswahl(`${k} behauptet: „Es ist egal, ob ich zwei Zahlen erst auf Zehner runde und dann addiere oder erst addiere und dann runde.“ Beurteile die Aussage.`, [
        opt(`Falsch. Gegenbeispiel: ${x} + ${x} = ${s}, gerundet ${rundeAuf(s, 10)}. Rundet man zuerst, erhält man ${rundeAuf(x, 10)} + ${rundeAuf(x, 10)} = ${2 * rundeAuf(x, 10)}.`, true),
        opt('Stimmt immer, denn Runden ändert eine Zahl nur wenig.', false, 'gezaehlt-geschaetzt'),
        opt('Stimmt, solange beide Zahlen abgerundet werden.', false, 'falsch-gerundet'),
        opt('Falsch. Wenn man zuerst rundet, ist das Ergebnis immer größer.', false, 'falsch-gerundet')],
      h1('Suche zwei Zahlen, die beide abgerundet werden, deren Summe aber aufgerundet wird.'), { nachweis: [U(false), ...N(`${x} + ${x}`, `${rundeAuf(x, 10)} + ${rundeAuf(x, 10)}`), `${s} ≈ ${rundeAuf(s, 10)}`] }); },
  ]);
}
