// Aufgaben zu 6.8.5 „Kreis- und Streifendiagramme lesen“ (Lernziele L1, L2) nach ADR 0058.
// L1 Kreisdiagramm: F nur Hälften, Viertel, Achtel ohne Zahlen. G Prozentangaben in 5er-Schritten in der Legende.
// M Winkelangaben, daraus der Anteil. E rechnet rückwärts auf Anzahlen und beurteilt irreführende Darstellungen.
// L2 Streifendiagramm: F 10 cm mit vollen Zentimetern, G 20 cm mit vollen Zentimetern, ab M halbe Zentimeter.

import { zz, wahl, mische, Z, opt, auswahl, kind, sechs, H, FREI, zahl, bruchAufgabe, daten, summe, bruch, roh, dz, umfrage, kreis, streifen, saeulen, ANTEIL, ANZAHL, LESEN, URTEIL, WERT } from './6-8-daten.mjs';

const L1 = '6.8.5-L1', L2 = '6.8.5-L2';
// k Teile in Schritten von `schritt`, zusammen `ganz`, alle verschieden (wenn verschieden).
function teile(ganz, k, schritt, { verschieden = true, min = 1 } = {}) {
  for (let v = 0; v < 500; v++) {
    const l = Array.from({ length: k - 1 }, () => schritt * zz(min, Math.floor(ganz / schritt / k) + 2)), rest = ganz - summe(l);
    if (rest >= schritt * min && (!verschieden || new Set([...l, rest]).size === k)) return mische([...l, rest]);
  }
  return null;
}
const ACHTEL = [[180, 90, 90], [180, 90, 45, 45], [90, 90, 90, 45, 45], [180, 135, 45], [270, 45, 45], [225, 90, 45]];
const NAMEN_F = { 180: 'die Hälfte', 90: 'ein Viertel', 45: 'ein Achtel', 135: 'drei Achtel', 270: 'drei Viertel', 225: 'fünf Achtel' };
const BRUCH_F = { 180: '1⁄2', 90: '1⁄4', 45: '1⁄8', 135: '3⁄8', 270: '3⁄4', 225: '5⁄8' };

export function diagrammeLesen6() {
  // ================= L1: Kreisdiagramme lesen =================
  const fKreis = () => { const w = wahl(ACHTEL), u = umfrage(), antworten = mische(u.antworten).slice(0, w.length), order = mische(w.map((_, i) => i)); return { u, antworten: order.map((i) => antworten[i]), winkel: order.map((i) => w[i]) }; };
  const welcherAnteil = (n) => () => { const { u, antworten, winkel } = fKreis(), i = zz(0, winkel.length - 1), w = winkel[i], falsch = Object.keys(BRUCH_F).map(Number).filter((x) => x !== w).slice(0, 2);
    return auswahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Kreuze an, welcher Anteil „${antworten[i]}“ ist.`), [opt(BRUCH_F[w], true), ...falsch.map((x) => opt(BRUCH_F[x]))],
      H(n, 'Der ganze Kreis sind alle Befragten. Ein halber Kreis ist 1⁄2, ein Viertelkreis ist 1⁄4.', 'Ein Viertelkreis sieht aus wie ein Stück mit einer rechten Ecke in der Mitte.', `Schau, wie viel vom Kreis „${antworten[i]}“ bedeckt.`), { bild: kreis(antworten.map((a, j) => [a, winkel[j]])), nachweis: [LESEN(antworten[i], BRUCH_F[w], 'bruch')] }); };
  const meiste = (n) => () => { const { u, antworten, winkel } = fKreis(), max = Math.max(...winkel), i = winkel.indexOf(max);
    if (winkel.filter((x) => x === max).length > 1) return null;
    const min = Math.min(...winkel), j = winkel.indexOf(min);
    return auswahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, 'Kreuze die häufigste Antwort an.'), [opt(antworten[i], true), opt(antworten[j], false, 'extrem-verwechselt'), ...antworten.filter((_, x) => x !== i && x !== j).slice(0, 1).map((a) => opt(a))],
      H(n, 'Die häufigste Antwort hat das größte Stück im Kreis.', 'Ein halber Kreis ist mehr als ein Viertel.', 'Vergleiche die Größe der Stücke.'), { bild: kreis(antworten.map((a, x) => [a, winkel[x]])), nachweis: [LESEN(antworten[i], BRUCH_F[max], 'bruch')] }); };
  const anzahlF = (n, gesamte) => () => { const { u, antworten, winkel } = fKreis(), i = zz(0, winkel.length - 1), g = wahl(gesamte), a = (winkel[i] * g) / 360;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[g - a, 'sach-frage-verfehlt'], [(winkel[i] / 90) * 4 === 2 ? g / 4 : g / 2, 'bruch-teil-zu-rest']],
      H(n, `„${antworten[i]}“ ist ${NAMEN_F[winkel[i]]} vom Kreis.`, 'Die Hälfte von 20 ist 10. Ein Viertel von 20 ist 5.', `Bestimme ${NAMEN_F[winkel[i]]} von ${g}.`), { bild: kreis(antworten.map((x, j) => [x, winkel[j]])), nachweis: [ANZAHL(winkel[i], 'grad', g, a)] }); };
  const prozentF = (n) => () => { const { u, antworten, winkel } = fKreis(), i = winkel.findIndex((w) => w === 180 || w === 90 || w === 270);
    if (i < 0) return null;
    const p = winkel[i] / 3.6;
    return auswahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Kreuze an, wie viel Prozent „${antworten[i]}“ ist.`), [opt(`${p} %`, true), opt(`${winkel[i]} %`, false, 'prozent-als-grad'), opt(`${p === 50 ? 25 : 50} %`, false)],
      H(n, 'Der ganze Kreis ist 100 %. Die Hälfte ist 50 %, ein Viertel ist 25 %.', 'Ein Viertelkreis ist 25 %.', `Wie viel vom Kreis ist „${antworten[i]}“?`), { bild: kreis(antworten.map((a, j) => [a, winkel[j]])), nachweis: [LESEN(antworten[i], p, 'prozent')] }); };
  const zusammenHaelfte = (n) => () => { const w = wahl([[90, 90, 90, 45, 45], [180, 90, 45, 45], [90, 45, 45, 180]]), u = umfrage(), antworten = mische(u.antworten).slice(0, w.length);
    const idx = w.map((_, i) => i), paar = (() => { for (const a of idx) for (const b of idx) if (a < b && w[a] + w[b] === 180) return [a, b]; return null; })();
    if (!paar) return null;
    const falsch = (() => { for (const a of idx) for (const b of idx) if (a < b && w[a] + w[b] !== 180) return [a, b]; return null; })();
    return auswahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, 'Kreuze an, welche zwei Antworten zusammen genau die Hälfte sind.'), [opt(`${antworten[paar[0]]} und ${antworten[paar[1]]}`, true), opt(`${antworten[falsch[0]]} und ${antworten[falsch[1]]}`, false)],
      H(n, 'Zwei Viertel sind zusammen eine Hälfte.', '1⁄4 und 1⁄4 sind 1⁄2.', 'Lege in Gedanken zwei Stücke zusammen.'), { bild: kreis(antworten.map((a, j) => [a, w[j]])), nachweis: [FREI(`${BRUCH_F[w[paar[0]]]} und ${BRUCH_F[w[paar[1]]]} sind zusammen 1⁄2`)] }); };
  sechs(L1, 'F', [welcherAnteil('F'), meiste('F'), anzahlF('F', [20, 40, 16]), prozentF('F'), anzahlF('F', [40, 80, 24]), zusammenHaelfte('F')]);

  // G: Prozent in 5er-Schritten.
  const gKreis = (k = 4) => { const p = teile(100, k, 5), u = umfrage(), antworten = mische(u.antworten).slice(0, k); return { p, u, antworten }; };
  const bildP = (antworten, p, frage = -1) => kreis(antworten.map((a, i) => [a, p[i] * 3.6, i === frage ? '?' : `${p[i]} %`]));
  const anzahlG = (n, gesamte, k = 4) => () => { const { p, u, antworten } = gKreis(k), g = wahl(gesamte), i = zz(0, k - 1), a = (p[i] * g) / 100;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[p[i], 'prozent-als-zaehler'], [g - a, 'sach-frage-verfehlt']],
      H(n, 'Lies den Prozentwert in der Legende ab. Rechne ihn in eine Anzahl um.', '25 % von 40: 40 : 4 = 10.', `Rechne ${p[i]} % von ${g}.`), { bild: bildP(antworten, p), nachweis: [ANZAHL(p[i], 'prozent', g, a)] }); };
  const fehltG = (n, k = 4) => () => { const { p, u, antworten } = gKreis(k), i = zz(0, k - 1);
    return zahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Bestimme, wie viel Prozent „${antworten[i]}“ ist.`), p[i], '%', [[100 - p[(i + 1) % k], 'sach-schritt-vergessen'], [summe(p) - p[i], 'sach-frage-verfehlt']],
      H(n, 'Alle Anteile zusammen sind 100 %.', '40 % + 35 % = 75 %, es fehlen 25 %.', `Rechne 100 % minus die anderen Prozentwerte.`), { bild: bildP(antworten, p, i), nachweis: [`100 − ${p.filter((_, j) => j !== i).join(' − ')} = ${p[i]}`] }); };
  const mehrAlsHaelfte = (n) => () => { const { p, u, antworten } = gKreis(4), s = [...p.keys()].sort((x, y) => p[y] - p[x]), a = s[0], b = s[1], c = s[2], d = s[3];
    if (p[a] + p[b] <= 50 || p[c] + p[d] >= 50) return null;
    return auswahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, 'Kreuze an, welche zwei Antworten zusammen mehr als die Hälfte sind.'), [opt(`${antworten[a]} und ${antworten[b]}`, true), opt(`${antworten[c]} und ${antworten[d]}`, false), opt(`${antworten[b]} und ${antworten[d]}`, false)].filter((o, i) => i < 2 || p[b] + p[d] < 50),
      H(n, 'Die Hälfte sind 50 %. Addiere die Prozentwerte.', '30 % + 25 % = 55 %. Das ist mehr als die Hälfte.', `Rechne ${p[a]} % + ${p[b]} %.`), { bild: bildP(antworten, p), nachweis: [`${p[a]} + ${p[b]} = ${p[a] + p[b]}`, FREI('Mehr als 50 %')] }); };
  const unterschiedG = (n) => () => { const { p, u, antworten } = gKreis(3), g = wahl([20, 40, 60]), [i, j] = [0, 1].sort((x, y) => p[y] - p[x]), d = ((p[i] - p[j]) * g) / 100;
    if (!Number.isInteger(d) || d === 0) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} mehr „${antworten[i]}“ als „${antworten[j]}“ nennen.`), d, null, [[p[i] - p[j], 'prozent-als-zaehler']],
      H(n, 'Rechne beide Prozentwerte in Anzahlen um. Bilde dann den Unterschied.', '50 % von 20 sind 10. 25 % von 20 sind 5. Der Unterschied ist 5.', `Rechne ${p[i]} % von ${g} und ${p[j]} % von ${g}.`), { bild: bildP(antworten, p), nachweis: [ANZAHL(p[i], 'prozent', g, (p[i] * g) / 100, { zwischen: true }), ANZAHL(p[j], 'prozent', g, (p[j] * g) / 100, { zwischen: true }), `${(p[i] * g) / 100} − ${(p[j] * g) / 100} = ${d}`] }); };
  const urteilG = (n) => () => { const { p, u, antworten } = gKreis(4), g = wahl([40, 20, 60]), i = zz(0, 3), a = (p[i] * g) / 100, kn = kind();
    if (!Number.isInteger(a) || a === p[i]) return null;
    return auswahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `${kn} sagt: „${p[i]} ${u.wer} nennen ${antworten[i]}.“`, 'Beurteile die Aussage.'), [opt(`Falsch. ${p[i]} % von ${g} sind ${a} ${u.wer}.`, true), opt(`Stimmt. Das steht in der Legende.`, false, 'prozent-als-zaehler'), opt(`Falsch. Es sind ${g - a} ${u.wer}.`, false)],
      H(n, 'Prozent ist keine Anzahl. Rechne den Prozentwert mit der Gesamtzahl in eine Anzahl um.', '25 % von 40 sind 10, nicht 25.', `Rechne ${p[i]} % von ${g}.`), { bild: bildP(antworten, p), nachweis: [ANZAHL(p[i], 'prozent', g, a), URTEIL(false)] }); };
  sechs(L1, 'G', [anzahlG('G', [20, 40, 60]), fehltG('G'), mehrAlsHaelfte('G'), anzahlG('G', [200, 100], 3), unterschiedG('G'), urteilG('G')]);

  // M: Winkelangaben.
  const mKreis = (k = 4, schritt = 18) => { const w = teile(360, k, schritt), u = umfrage(), antworten = mische(u.antworten).slice(0, k); return { w, u, antworten }; };
  const bildW = (antworten, w, frage = -1) => kreis(antworten.map((a, i) => [a, w[i], i === frage ? '?' : `${w[i]}°`]));
  const prozentAusWinkel = (n, schritt = 18) => () => { const { w, u, antworten } = mKreis(4, schritt), i = zz(0, 3), p = w[i] / 3.6;
    if (!Number.isInteger(p * 10)) return null;
    return zahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Bestimme den Anteil von „${antworten[i]}“ in Prozent.`), p, '%', [[w[i], 'prozent-als-grad'], [Math.round(w[i] / 3.6 / 10) * 10 === p ? p + 10 : Math.round(p), 'sach-falsche-rechnung']].filter(([x]) => x !== p),
      H(n, '360° sind 100 %. Also sind 3,6° ein Prozent.', `Rechne ${w[i]} : 3,6.`), { bild: bildW(antworten, w), nachweis: [LESEN(antworten[i], dz(p, 1), 'prozent')] }, 1); };
  const bruchAusWinkel = (n) => () => { const w = wahl([[120, 120, 60, 60], [120, 90, 90, 60], [60, 60, 120, 120], [120, 72, 96, 72], [40, 80, 120, 120]]), u = umfrage(), antworten = mische(u.antworten).slice(0, 4), i = w.findIndex((x) => x === 120 || x === 60 || x === 40);
    return bruchAufgabe(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Bestimme den Anteil von „${antworten[i]}“ als Bruch.`, 'Kürze vollständig.'), w[i], 360, [[roh(w[i], 100), 'prozent-als-grad']],
      H(n, 'Der ganze Kreis hat 360°. Der Anteil ist Winkel durch 360°.', `${w[i]}⁄360 kürzen.`), { bild: bildW(antworten, w), nachweis: [ANTEIL(w[i], 360, bruch(w[i], 360), 'bruch')] }); };
  const anzahlAusWinkel = (n) => () => { const { w, u, antworten } = mKreis(4, 30), g = wahl([24, 36, 48, 60, 72]), i = zz(0, 3), a = (w[i] * g) / 360;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[w[i], 'prozent-als-grad'], [g - a, 'sach-frage-verfehlt']],
      H(n, 'Der Anteil ist Winkel durch 360°. Nimm diesen Anteil von der Gesamtzahl.', `${w[i]}⁄360 von ${g}.`), { bild: bildW(antworten, w), nachweis: [ANZAHL(w[i], 'grad', g, a)] }); };
  const fehlenderWinkel = (n) => () => { const { w, u, antworten } = mKreis(4, 18), i = zz(0, 3);
    return zahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `Bestimme den Winkel für „${antworten[i]}“.`), w[i], '°', [[100 - summe(w.filter((_, j) => j !== i).map((x) => x / 3.6)), 'prozent-als-grad'], [180 - w[(i + 1) % 4], 'sach-falsche-rechnung']].filter(([x]) => x > 0 && Number.isInteger(x)),
      H(n, 'Alle Winkel zusammen ergeben 360°.', `Rechne 360° minus die anderen Winkel.`), { bild: bildW(antworten, w, i), nachweis: [`360 − ${w.filter((_, j) => j !== i).join(' − ')} = ${w[i]}`] }); };
  const unterschiedW = (n) => () => { const { w, u, antworten } = mKreis(3, 30), g = wahl([36, 48, 72]), [i, j] = [0, 1].sort((x, y) => w[y] - w[x]), ai = (w[i] * g) / 360, aj = (w[j] * g) / 360;
    if (!Number.isInteger(ai) || !Number.isInteger(aj) || ai === aj) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} mehr „${antworten[i]}“ als „${antworten[j]}“ nennen.`), ai - aj, null, [[w[i] - w[j], 'prozent-als-grad']],
      H(n, 'Rechne beide Winkel in Anzahlen um.', `${w[i]}⁄360 von ${g} und ${w[j]}⁄360 von ${g}.`), { bild: bildW(antworten, w), nachweis: [ANZAHL(w[i], 'grad', g, ai, { zwischen: true }), ANZAHL(w[j], 'grad', g, aj, { zwischen: true }), `${ai} − ${aj} = ${ai - aj}`] }); };
  const gradFehler = (n) => () => { const p = teile(100, 3, 5), u = umfrage(), antworten = mische(u.antworten).slice(0, 3), i = zz(0, 2), kn = kind();
    return auswahl(Z(`Eine Umfrage ${u.zum} ergibt: ${antworten.map((a, j) => `${a} ${p[j]} %`).join(', ')}.`, `${kn} zeichnet ein Kreisdiagramm. Für „${antworten[i]}“ zeichnet ${kn} einen Winkel von ${p[i]}°.`, 'Beurteile das.'),
      [opt(`Falsch. ${p[i]} % von 360° sind ${p[i] * 3.6}°.`, true), opt('Stimmt. Prozent und Grad sind dasselbe.', false, 'prozent-als-grad'), opt(`Falsch. Es müssen ${p[i] * 2}° sein.`, false), opt(`Falsch. Es müssen ${100 - p[i]}° sein.`, false)],
      H(n, 'Der ganze Kreis hat 360°, nicht 100°. 1 % sind 3,6°.', `Rechne ${p[i]} · 3,6°.`), { nachweis: [`${p[i]} · 3,6 = ${dz(p[i] * 3.6, 1)}`, URTEIL(false)] }); };
  sechs(L1, 'M', [prozentAusWinkel('M'), bruchAusWinkel('M'), anzahlAusWinkel('M'), fehlenderWinkel('M'), unterschiedW('M'), gradFehler('M')]);

  // E: rückwärts und Irreführung.
  const gesamtAusWinkel = (n) => () => { const { w, u, antworten } = mKreis(4, 18), i = zz(0, 3), g = wahl([20, 40, 60, 80, 100, 120]), a = (w[i] * g) / 360;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`Das Kreisdiagramm zeigt eine Umfrage ${u.zum}.`, `${a} ${u.wer} nennen „${antworten[i]}“.`, 'Bestimme, wie viele befragt wurden.'), g, null, [[(a * w[i]) / 360, 'sach-falsche-rechnung'], [a * 4, 'sach-falsche-rechnung']].filter(([x]) => Number.isInteger(x) && x !== g),
      H(n, `${w[i]}° sind ${a} ${u.wer}. Rechne aus, wie viele ${u.wer} 360° sind.`), { bild: bildW(antworten, w), nachweis: [ANZAHL(w[i], 'grad', g, a)] }); };
  const fehlendeAnzahl = (n) => () => { const { w, u, antworten } = mKreis(4, 30), g = wahl([36, 48, 72]), i = zz(0, 3), a = (w[i] * g) / 360;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[w[i], 'prozent-als-grad']],
      H(n, 'Bestimme zuerst den fehlenden Winkel.'), { bild: bildW(antworten, w, i), nachweis: [`360 − ${w.filter((_, j) => j !== i).join(' − ')} = ${w[i]}`, ANZAHL(w[i], 'grad', g, a)] }); };
  const ueber100 = (n) => () => { const p = teile(100, 4, 5), u = umfrage(), antworten = mische(u.antworten).slice(0, 4), j = zz(0, 3), falsch = p.map((x, i) => (i === j ? x + wahl([10, 15, 20]) : x));
    return auswahl(Z(`Eine Zeitung zeigt dieses Kreisdiagramm ${u.zum}.`, 'Beurteile die Darstellung.'), [opt(`Fehlerhaft. Zusammen sind es ${summe(falsch)} % statt 100 %.`, true), opt('In Ordnung. Jeder Anteil hat einen eigenen Ausschnitt im Kreis.', false), opt(`Fehlerhaft. „${antworten[j]}“ ist zu klein gezeichnet.`, false), opt('In Ordnung. Bei Umfragen dürfen es mehr als 100 % sein.', false, 'haeufigkeit-falsche-gesamtzahl')],
      H(n, 'Addiere alle Prozentwerte der Legende.'), { bild: kreis(antworten.map((a, i) => [a, p[i] * 3.6, `${falsch[i]} %`])), nachweis: [`${falsch.join(' + ')} = ${summe(falsch)}`, URTEIL(false)] }); };
  const falscherAusschnitt = (n) => () => { const p = [50, ...teile(50, 2, 5)], u = umfrage(), antworten = mische(u.antworten).slice(0, 3), w = [120, (240 * p[1]) / 50, (240 * p[2]) / 50];
    if (!w.every(Number.isInteger)) return null;
    return auswahl(Z(`Eine Werbung zeigt dieses Kreisdiagramm ${u.zum}.`, 'Beurteile die Darstellung.'), [opt(`Irreführend. „${antworten[0]}“ hat 50 %, der Ausschnitt ist aber kleiner als ein halber Kreis.`, true), opt('In Ordnung. Die Prozente stimmen zusammen.', false), opt(`Irreführend. „${antworten[1]}“ müsste kleiner sein als ${p[1]} %.`, false), opt('In Ordnung. Die Größe der Ausschnitte ist egal.', false)],
      H(n, 'Vergleiche die Größe jedes Ausschnitts mit seinem Prozentwert. 50 % müssen ein halber Kreis sein.'), { bild: kreis(antworten.map((a, i) => [a, w[i], `${p[i]} %`])), nachweis: [`${p.join(' + ')} = 100`, `50 · 3,6 = 180`, URTEIL(false)] }); };
  const zweiKreise = (n) => () => { const [ga, gb] = wahl([[20, 50], [25, 40], [20, 80]]), pa = wahl([40, 50, 60]), pb = wahl([20, 25, 30]), aa = (ga * pa) / 100, ab = (gb * pb) / 100, kn = kind();
    if (!Number.isInteger(aa) || !Number.isInteger(ab) || ab <= aa) return null;
    return auswahl(Z(`In der 6a nennen ${pa} % von ${ga} Kindern „Fußball“. Im Kreisdiagramm ist der Ausschnitt groß.`, `In der 6b nennen ${pb} % von ${gb} Kindern „Fußball“. Der Ausschnitt ist kleiner.`, `${kn} sagt: „In der 6a mögen mehr Kinder Fußball.“`, 'Beurteile die Aussage.'),
      [opt(`Falsch. In der 6a sind es ${aa} Kinder, in der 6b ${ab} Kinder.`, true), opt('Stimmt. Der Ausschnitt der 6a ist größer.', false, 'relativ-absolut-verwechselt'), opt(`Stimmt. ${pa} % ist mehr als ${pb} %.`, false, 'relativ-absolut-verwechselt'), opt('Das kann man nicht vergleichen.', false)],
      H(n, 'Ein Kreisdiagramm zeigt Anteile, keine Anzahlen. Bei verschieden großen Gruppen rechne die Anzahlen aus.'), { daten: daten(['Klasse', 'befragt', '„Fußball“'], [['6a', ga, `${pa} %`], ['6b', gb, `${pb} %`]]), nachweis: [ANZAHL(pa, 'prozent', ga, aa, { zwischen: true }), ANZAHL(pb, 'prozent', gb, ab, { zwischen: true }), URTEIL(false)] }); };
  sechs(L1, 'E', [gesamtAusWinkel('E'), fehlendeAnzahl('E'), prozentAusWinkel('E', 9), ueber100('E'), falscherAusschnitt('E'), zweiKreise('E')]);

  // ================= L2: Streifendiagramme lesen =================
  // laenge in cm, schritt in mm.
  const sDia = (laenge, k, schritt) => { const mm = teile(laenge * 10, k, schritt), u = umfrage(), antworten = mische(u.antworten).slice(0, k); return { mm, u, antworten }; };
  const bildS = (laenge, antworten, mm, texte = null) => streifen(laenge, antworten.map((a, i) => [a, mm[i], texte?.[i]]));
  const prozentS = (n, laenge, schritt) => () => { const { mm, u, antworten } = sDia(laenge, wahl([3, 4]), schritt), i = zz(0, mm.length - 1), p = (mm[i] * 100) / (laenge * 10), cm = mm[i] / 10;
    if (p === cm) return null;
    return zahl(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, `Der Streifen ist ${laenge} cm lang.`, `Bestimme den Anteil von „${antworten[i]}“ in Prozent.`), p, '%', [[cm, 'streifen-laenge-als-anteil'], [mm[i], 'streifen-laenge-als-anteil']],
      H(n, `Der ganze Streifen ist 100 %. ${laenge === 10 ? '1 cm sind 10 %.' : '1 cm sind 5 %.'}`, laenge === 10 ? '3 cm von 10 cm sind 30 %.' : '3 cm von 20 cm sind 15 %.', `Lies die Länge von „${antworten[i]}“ am Lineal ab.`), { bild: bildS(laenge, antworten, mm), nachweis: [LESEN(antworten[i], dz(p, 1), 'prozent')] }, 1); };
  const bruchS = (n) => () => { const mm = wahl([[50, 30, 20], [50, 20, 30], [25 * 2, 40, 10], [20, 50, 30]]), u = umfrage(), antworten = mische(u.antworten).slice(0, 3), i = mm.indexOf(50);
    return auswahl(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, `Kreuze an, welcher Anteil „${antworten[i]}“ ist.`), [opt('1⁄2', true), opt('1⁄5', false, 'streifen-laenge-als-anteil'), opt('1⁄4', false)],
      H(n, 'Der ganze Streifen ist ein Ganzes. Die Hälfte des Streifens ist 1⁄2.', '5 cm von 10 cm sind 1⁄2.', `Lies die Länge von „${antworten[i]}“ ab.`), { bild: bildS(10, antworten, mm), nachweis: [LESEN(antworten[i], '1⁄2', 'bruch')] }); };
  const anzahlS = (n, laenge, schritt, gesamte) => () => { const { mm, u, antworten } = sDia(laenge, 3, schritt), g = wahl(gesamte), i = zz(0, 2), a = (mm[i] * g) / (laenge * 10);
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Der Streifen ist ${laenge} cm lang.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[mm[i] / 10, 'streifen-laenge-als-anteil'], [(mm[i] * 100) / (laenge * 10), 'prozent-als-zaehler']].filter(([x]) => x !== a && Number.isInteger(x)),
      H(n, 'Bestimme zuerst den Anteil. Nimm diesen Anteil von der Gesamtzahl.', '4 cm von 10 cm sind 40 %. 40 % von 20 sind 8.', `Lies die Länge von „${antworten[i]}“ ab.`), { bild: bildS(laenge, antworten, mm), nachweis: [ANZAHL(mm[i], `mm von ${laenge * 10}`, g, a)] }); };
  const groesstes = (n) => () => { const { mm, u, antworten } = sDia(10, 4, 10), max = Math.max(...mm), min = Math.min(...mm);
    return auswahl(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, 'Kreuze die seltenste Antwort an.'), [opt(antworten[mm.indexOf(min)], true), opt(antworten[mm.indexOf(max)], false, 'extrem-verwechselt'), opt(antworten.find((_, i) => mm[i] !== max && mm[i] !== min))],
      H(n, 'Die seltenste Antwort hat den kürzesten Abschnitt.', 'Ein Abschnitt von 1 cm ist kürzer als einer von 3 cm.', 'Vergleiche die Längen der Abschnitte.'), { bild: bildS(10, antworten, mm), nachweis: [FREI(`Kürzester Abschnitt ${min / 10} cm`)] }); };
  const restS = (n, laenge, schritt) => () => { const { mm, u, antworten } = sDia(laenge, 4, schritt), i = zz(0, 3), p = (mm[i] * 100) / (laenge * 10), texte = mm.map((x, j) => (j === i ? '?' : `${dz((x * 100) / (laenge * 10), 1)} %`));
    return zahl(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, `Bestimme den Anteil von „${antworten[i]}“ in Prozent.`), p, '%', [[mm[i] / 10, 'streifen-laenge-als-anteil']].filter(([x]) => x !== p),
      H(n, 'Alle Anteile zusammen sind 100 %.', '30 % + 50 % = 80 %. Es fehlen 20 %.', 'Rechne 100 % minus die anderen Anteile.'), { bild: bildS(laenge, antworten, mm, texte), nachweis: [`100 − ${mm.filter((_, j) => j !== i).map((x) => dz((x * 100) / (laenge * 10), 1)).join(' − ')} = ${dz(p, 1)}`] }, 1); };
  sechs(L2, 'F', [prozentS('F', 10, 10), bruchS('F'), anzahlS('F', 10, 10, [20, 10, 50]), groesstes('F'), restS('F', 10, 10), prozentS('F', 10, 10)]);

  const unterschiedS = (n) => () => { const { mm, u, antworten } = sDia(20, 3, 10), [i, j] = [0, 1].sort((x, y) => mm[y] - mm[x]), d = ((mm[i] - mm[j]) * 100) / 200;
    if (d === 0) return null;
    return zahl(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, 'Der Streifen ist 20 cm lang.', `Bestimme, um wie viel Prozent „${antworten[i]}“ mehr ist als „${antworten[j]}“.`), d, '%', [[(mm[i] - mm[j]) / 10, 'streifen-laenge-als-anteil']],
      H(n, 'Bestimme beide Anteile in Prozent. Bilde dann den Unterschied.', '6 cm und 2 cm von 20 cm: 30 % und 10 %.', 'Ein Zentimeter sind hier 5 %.'), { bild: bildS(20, antworten, mm), nachweis: [`${dz((mm[i] * 100) / 200, 1)} − ${dz((mm[j] * 100) / 200, 1)} = ${dz(d, 1)}`] }, 1); };
  const urteilS = (n) => () => { const { mm, u, antworten } = sDia(20, 3, 10), i = zz(0, 2), cm = mm[i] / 10, p = cm * 5, kn = kind();
    return auswahl(Z(`Das Streifendiagramm ist 20 cm lang.`, `${kn} sagt: „Der Abschnitt ${antworten[i]} ist ${cm} cm lang, also sind es ${cm} %.“`, 'Beurteile die Aussage.'), [opt(`Falsch. ${cm} cm von 20 cm sind ${p} %.`, true), opt('Stimmt. Man liest die Prozent am Lineal ab.', false, 'streifen-laenge-als-anteil'), opt(`Falsch. Es sind ${cm * 10} %.`, false, 'streifen-laenge-als-anteil')].filter((o, x, l) => l.findIndex((y) => y.text === o.text) === x),
      H(n, 'Der ganze Streifen ist 100 %. Bei 20 cm ist 1 cm genau 5 %.', '4 cm von 20 cm sind 20 %.', `Rechne ${cm} · 5 %.`), { bild: bildS(20, antworten, mm), nachweis: [LESEN(antworten[i], p, 'prozent'), URTEIL(false)] }); };
  sechs(L2, 'G', [prozentS('G', 20, 10), anzahlS('G', 20, 10, [40, 20, 60]), unterschiedS('G'), prozentS('G', 20, 10), anzahlS('G', 20, 10, [200, 100]), urteilS('G')]);

  const bruchS2 = (n) => () => { const { mm, u, antworten } = sDia(10, 3, 5), i = mm.findIndex((x) => [25, 75, 50, 20, 40, 60, 80].includes(x));
    if (i < 0) return null;
    return bruchAufgabe(Z(`Das Streifendiagramm zeigt eine Umfrage ${u.zum}.`, 'Der Streifen ist 10 cm lang.', `Bestimme den Anteil von „${antworten[i]}“ als Bruch.`, 'Kürze vollständig.'), mm[i], 100, [[roh(mm[i], 10), 'streifen-laenge-als-anteil']],
      H(n, 'Der Anteil ist Länge des Abschnitts durch Länge des Streifens.', `${dz(mm[i] / 10, 1)} cm von 10 cm.`), { bild: bildS(10, antworten, mm), nachweis: [ANTEIL(mm[i], 100, bruch(mm[i], 100), 'bruch')] }); };
  const zweiStreifen = (n) => () => { const cm = wahl([4, 5, 6]), kn = kind();
    return auswahl(Z(`${kn} vergleicht zwei Streifendiagramme.`, `Im 10-cm-Streifen der 6a ist „Bus“ ${cm} cm lang.`, `Im 20-cm-Streifen der 6b ist „Bus“ auch ${cm} cm lang.`, 'Beurteile die Aussage: „In beiden Klassen fährt der gleiche Anteil mit dem Bus.“'),
      [opt(`Falsch. In der 6a sind es ${cm * 10} %, in der 6b ${cm * 5} %.`, true), opt('Stimmt. Beide Abschnitte sind gleich lang.', false, 'streifen-laenge-als-anteil'), opt(`Falsch. In der 6b sind es ${cm * 20} %.`, false), opt('Stimmt. Streifen kann man immer direkt vergleichen.', false, 'streifen-laenge-als-anteil')],
      H(n, 'Gleich lange Abschnitte bedeuten nur bei gleich langen Streifen den gleichen Anteil.', 'Rechne für jeden Streifen die Länge in Prozent um.'), { nachweis: [`${cm} · 10 = ${cm * 10}`, `${cm} · 5 = ${cm * 5}`, URTEIL(false)] }); };
  sechs(L2, 'M', [prozentS('M', 10, 5), anzahlS('M', 10, 5, [200, 40, 80]), prozentS('M', 20, 5), restS('M', 10, 5), bruchS2('M'), zweiStreifen('M')]);

  const gesamtS = (n) => () => { const { mm, u, antworten } = sDia(20, 3, 10), i = zz(0, 2), g = wahl([40, 60, 80, 100]), a = (mm[i] * g) / 200;
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`Das Streifendiagramm ist 20 cm lang.`, `${a} ${u.wer} nennen „${antworten[i]}“.`, 'Bestimme, wie viele befragt wurden.'), g, null, [[(mm[i] * a) / 10, 'sach-falsche-rechnung'], [a * 20, 'sach-falsche-rechnung']].filter(([x]) => Number.isInteger(x) && x !== g),
      H(n, 'Bestimme zuerst den Anteil in Prozent. Rechne dann zurück auf 100 %.'), { bild: bildS(20, antworten, mm), nachweis: [ANZAHL(mm[i], 'mm von 200', g, a)] }); };
  const restAnzahl = (n) => () => { const { mm, u, antworten } = sDia(20, 4, 10), g = wahl([40, 60, 80]), i = zz(0, 3), a = (mm[i] * g) / 200, texte = mm.map((x, j) => (j === i ? '?' : `${x / 2} %`));
    if (!Number.isInteger(a)) return null;
    return zahl(Z(`${g} ${u.wer} wurden nach ${u.dem} gefragt.`, `Bestimme, wie viele ${u.wer} „${antworten[i]}“ nennen.`), a, null, [[mm[i] / 2, 'prozent-als-zaehler']].filter(([x]) => x !== a),
      H(n, 'Bestimme zuerst den fehlenden Anteil in Prozent.'), { bild: bildS(20, antworten, mm, texte), nachweis: [`100 − ${mm.filter((_, j) => j !== i).map((x) => x / 2).join(' − ')} = ${mm[i] / 2}`, ANZAHL(mm[i] / 2, 'prozent', g, a)] }); };
  const ueber100S = (n) => () => { const { mm, u, antworten } = sDia(10, 3, 10), j = zz(0, 2), texte = mm.map((x, i) => `${x + (i === j ? 10 : 0)} %`), s = summe(mm) + 10;
    return auswahl(Z(`Ein Plakat zeigt dieses Streifendiagramm ${u.zum}.`, 'Beurteile die Darstellung.'), [opt(`Fehlerhaft. Die Anteile ergeben zusammen ${s} %. Bei „${antworten[j]}“ passt die Zahl nicht zur Länge.`, true), opt('In Ordnung. Die Abschnitte füllen den Streifen.', false), opt('In Ordnung. Die Zahlen sind gerundet.', false), opt(`Fehlerhaft. „${antworten[j]}“ müsste ${mm[j] + 20} % sein.`, false)],
      H(n, 'Prüfe zwei Dinge: Ergeben die Anteile 100 %? Passt jede Zahl zur Länge?'), { bild: bildS(10, antworten, mm, texte), nachweis: [`${texte.map((x) => x.replace(' %', '')).join(' + ')} = ${s}`, URTEIL(false)] }); };
  // Abgeschnittene Achse mit Rechnung.
  const achse = (n, frage) => () => { const [a, b, ab] = wahl([[80, 100, 70], [40, 50, 30], [160, 200, 140], [200, 250, 175]]), p = ((b - a) * 100) / a, [va, vb] = mische(['Burgverein', 'Ritterclub', 'Schützenverein', 'Reitverein']).slice(0, 2);
    const bild = saeulen('Mitglieder', 'Mitglieder', b + (ab % 10 === 0 ? 10 : 25), ab % 10 === 0 ? 10 : 25, [[va, a], [vb, b]], { ab });
    if (frage === 'zahl') return zahl(Z(`Das Säulendiagramm zeigt die Mitglieder von zwei Vereinen.`, 'Die Achse beginnt nicht bei 0.', `Bestimme, um wie viel Prozent der ${vb} mehr Mitglieder hat als der ${va}.`), p, '%', [[200, 'achse-abgeschnitten'], [b - a, 'prozent-als-zaehler']],
      H(n, 'Lies beide Werte ab. Der Unterschied geteilt durch den kleineren Wert ist der Anteil, um den es mehr ist.'), { bild, nachweis: [`${b} − ${a} = ${b - a}`, ANTEIL(b - a, a, p, 'prozent')] });
    return auswahl(Z('Das Säulendiagramm zeigt die Mitglieder von zwei Vereinen.', `Die Säule des ${vb} ist ${(b - ab) / (a - ab)}-mal so hoch wie die des ${va}.`, 'Beurteile die Darstellung.'),
      [opt(`Irreführend. Die Achse beginnt bei ${ab}. Der ${vb} hat nur ${p} % mehr Mitglieder.`, true), opt(`In Ordnung. Der ${vb} hat ${(b - ab) / (a - ab)}-mal so viele Mitglieder.`, false, 'achse-abgeschnitten'), opt('In Ordnung. Die Zahlen an der Achse stimmen.', false), opt(`Irreführend. Der ${va} hat in Wahrheit mehr Mitglieder.`, false)],
      H(n, 'Schau, wo die Achse beginnt. Vergleiche die echten Werte.'), { bild, nachweis: [`${b} − ${a} = ${b - a}`, ANTEIL(b - a, a, p, 'prozent'), URTEIL(false)] }); };
  sechs(L2, 'E', [gesamtS('E'), restAnzahl('E'), ueber100S('E'), achse('E', 'zahl'), prozentS('E', 20, 5), achse('E', 'urteil')]);
}
