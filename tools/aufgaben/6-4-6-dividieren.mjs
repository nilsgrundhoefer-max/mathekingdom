// Aufgaben zu 6.4.6 „Umwandeln durch Dividieren“ (Lernziele D1, D2) nach ADR 0015 und ADR 0047.
// Niveau-Meilenstein mit der Marke M: je zwölf Aufgaben auf M und E, keine auf F und G.
// D1: abbrechende Dezimalzahlen, D2: periodische. Die Periode wird in einem eigenen Feld eingegeben und mit Überstrich gezeigt.
// Heftaufgaben (Grilling mit Nils, 2026-11-25): je Lernziel und Niveaustufe zwei schriftliche Divisionen im Heft, eingegeben wird nur das Ergebnis.
// Nach jeder Aufgabe mit `division` zeigt die App die schriftliche Division als Lösungsbild.

import { zwoelf, auswahl, luecken, ordnen, bruch, dezimal, periode, Z, h1, h2 } from '../werkzeug.mjs';
import { br, opt, zz, wahl, mische, kind, T, dfe, VGL, URTEIL, ZEICHEN, FREI, ggt, entwickle, dezimalText, abgebrochen, periodisch } from './6-4-dezimal.mjs';

const D1 = '6.4.6-D1', D2 = '6.4.6-D2';
// Abbrechend: z : n als Text.
const ab = (z, n) => dezimalText(z, n);
// Periodisch: Ziffern vor der Periode („0,1“) und Periode („6“).
const teile = (z, n) => { const e = entwickle(z, n); return { vor: `${e.ganz},${e.vor}`, per: e.periode, text: dezimalText(z, n) }; };
const DIV = (dividend, divisor) => ({ division: { dividend, divisor } });
// Typische Fehler bei periodischen Zahlen: abgebrochen (0,6 und 0,66), Strich über zu viele Ziffern.
const perFehler = (z, n) => { const e = entwickle(z, n), t = [];
  t.push([abgebrochen(z, n, Math.max(1, e.vor.length + 1)), 'periode-abgebrochen'], [abgebrochen(z, n, e.vor.length + 2 * e.periode.length), 'periode-abgebrochen']);
  if (e.vor.length) t.push([periodisch(`${e.ganz},`, e.vor + e.periode), 'periode-zu-frueh']);
  return t.filter(([w]) => !/,$/.test(w) && !/^0,0*$/.test(w)); };
const tM1 = h2('Ein Bruch ist eine Division: Zähler geteilt durch Nenner. Dividiere schriftlich und hänge nach dem Komma Nullen an.', 'Geht die Division auf, bist du fertig. Die Dezimalzahl bricht ab.');
const tM2 = h2('Dividiere schriftlich und schreibe jeden Rest auf. Kommt ein Rest zum zweiten Mal, wiederholen sich ab dort die Ziffern.', 'Schreibe die Ziffern vor der Periode ins erste Feld und die Ziffern, die sich wiederholen, ins zweite Feld.');

export function dividieren6() {
  // ================= D1: abbrechende Dezimalzahlen =================
  zwoelf(D1, 'M', [
    () => { const [z, n] = wahl([[3, 8], [5, 8], [7, 8], [1, 16], [3, 16]]), l = ab(z, n);
      return dezimal(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis als Dezimalzahl ein.'), l, dfe(l, [[T(Math.floor((z * 100) / n), 2), 'runden-abschneiden'], [`${z},${n}`, 'bruch-als-komma']]), tM1, { ...DIV(z, n), nachweis: [`${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[5, 16], [7, 16], [9, 16], [11, 16], [13, 16]]), l = ab(z, n);
      return dezimal(Z(`Wandle ${br(z, n)} durch Dividieren in eine Dezimalzahl um.`), l, dfe(l, [[`${z},${n}`, 'bruch-als-komma'], [T(Math.floor((z * 100) / n), 2), 'runden-abschneiden']]), tM1, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[7, 8], [3, 8], [1, 8], [9, 16], [3, 40]]), l = ab(z, n);
      return luecken(Z('Rechne mit Division.', `${br(z, n)} = ${z} : ${n} = {{a}}`), { a: [l, dfe(l, [[`${z},${n}`, 'bruch-als-komma'], [ab(n, z).includes('̅') ? null : ab(n, z), 'bruch-vertauscht']])] }, tM1, { ...DIV(z, n), nachweis: [`${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[3, 40], [7, 40], [9, 40], [11, 40], [13, 40]]), l = ab(z, n);
      return dezimal(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), l, dfe(l, [[`${z},${n}`, 'bruch-als-komma'], [T(Math.floor((z * 1000) / n), 2), 'dezimal-stelle']]), tM1, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[3, 8], [5, 8], [7, 8], [1, 8]]), l = ab(z, n);
      return dezimal(Z(`Ein ${z} m langes Band wird in ${n} gleich lange Stücke geschnitten.`, 'Gib die Länge eines Stücks an.'), l, dfe(l, [[ab(n, z), 'bruch-vertauscht'], [`${z},${n}`, 'bruch-als-komma']]), tM1,
        { einheit: 'm', ...DIV(z, n), nachweis: [`${z} m : ${n} = ${l} m`] }); },
    () => { const [z, n] = wahl([[3, 8], [5, 8], [1, 16], [3, 16]]), l = ab(z, n), falsch = dezimalText(n, z), kn = kind();
      return auswahl(Z(`${kn} rechnet für ${br(z, n)}: ${n} : ${z} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${z} : ${n} = ${l}.`, true), opt('Stimmt.', false, 'bruch-vertauscht'), opt(`Stimmt, denn ${n} : ${z} = ${falsch}.`, false, 'bruch-vertauscht')], tM1,
        { ...DIV(z, n), nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const [z, n] = wahl([[7, 16], [11, 16], [13, 16], [15, 16], [9, 40]]), l = ab(z, n);
      return dezimal(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis als Dezimalzahl ein.'), l, dfe(l, [[T(Math.floor((z * 100) / n), 2), 'runden-abschneiden'], [`${z},${n}`, 'bruch-als-komma']]), tM1, { ...DIV(z, n), nachweis: [`${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[9, 12], [3, 12], [6, 15], [9, 15], [12, 15]]), l = ab(z, n);
      return auswahl(Z(`Kreuze die Dezimalzahl zu ${br(z, n)} an.`), [opt(l, true), opt(`${z},${n}`, false, 'bruch-als-komma'), opt(dezimalText(n, z), false, 'bruch-vertauscht'), opt(T(Math.floor((z * 10) / n), 1) === l ? `0,${z}` : T(Math.floor((z * 10) / n), 1), false, 'runden-abschneiden')].filter((o, i, x) => x.findIndex((y) => y.text === o.text) === i), tM1,
        { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${l}`, { art: 'wert', wert: l }] }); },
    () => { const [geld, n] = wahl([[7, 4], [9, 4], [3, 8], [5, 8], [11, 4]]), l = T(Math.round((geld * 100) / n), 2, 2);
      if ((geld * 100) % n !== 0) return null;
      return dezimal(Z(`${n} Freunde teilen ${geld} € gerecht.`, 'Gib an, wie viel Euro jeder bekommt.'), l, dfe(l, [[`${geld},${n}`, 'bruch-als-komma'], [dezimalText(n, geld), 'bruch-vertauscht']]), tM1, { einheit: '€', ...DIV(geld, n), nachweis: [`${geld} € : ${n} = ${l} €`] }); },
    () => { const [z, n] = wahl([[13, 20], [17, 20], [9, 20], [7, 25], [12, 25]]), l = ab(z, n);
      return dezimal(Z(`Wandle ${br(z, n)} durch Dividieren in eine Dezimalzahl um.`), l, dfe(l, [[`${z},${n}`, 'bruch-als-komma']]), tM1, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${l}`] }); },
    () => { const g = zz(1, 4), [z, n] = wahl([[5, 8], [3, 8], [7, 8], [3, 16]]), l = T(Math.round((g + z / n) * 10000), 4);
      return dezimal(Z(`Wandle ${br(z, n, g)} in eine Dezimalzahl um.`), l, dfe(l, [[ab(z, n), 'bruch-ganzes-teil'], [`${g},${z}`, 'bruch-als-komma']]), h2('Die Ganzen stehen vor dem Komma.', 'Dividiere nur den Bruchteil: Zähler geteilt durch Nenner.'),
        { ...DIV(g * n + z, n), nachweis: [`${br(z, n, g)} = ${g} + ${z} : ${n} = ${l}`] }); },
    () => { const ja = mische([[3, 8], [7, 20], [9, 12], [6, 15], [5, 16], [7, 28]]).slice(0, 2), nein = mische([[2, 3], [5, 6], [4, 9], [7, 12], [3, 11]]).slice(0, 3);
      return auswahl(Z('Kreuze alle Brüche an, die eine abbrechende Dezimalzahl ergeben.'), mische([...ja.map(([z, n]) => opt(br(z, n), true)), ...nein.map(([z, n]) => opt(br(z, n), false, 'periode-abgebrochen'))]),
        h2('Kürze den Bruch zuerst vollständig. Schau dann auf den Nenner.', 'Ist der Nenner ein Produkt nur aus Zweien und Fünfen, zum Beispiel 8 = 2 · 2 · 2, geht die Division auf.'), { mehrfach: true, nachweis: [{ art: 'abbrechend' }] }); },
  ]);
  zwoelf(D1, 'E', [
    () => { const [z, n] = wahl([[11, 16], [13, 16], [15, 16], [1, 16]]), l = ab(z, n);
      return dezimal(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis als Dezimalzahl ein.'), l, dfe(l, [[T(Math.floor((z * 1000) / n), 3), 'runden-abschneiden']]), h1('Hänge so lange Nullen an, bis kein Rest mehr bleibt.'), { ...DIV(z, n), nachweis: [`${z} : ${n} = ${l}`] }); },
    () => { const [z, n] = wahl([[27, 40], [33, 40], [17, 40], [37, 40]]), l = ab(z, n);
      return dezimal(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), l, dfe(l, [[`${z},${n}`, 'bruch-als-komma'], [T(Math.floor((z * 100) / n), 2), 'runden-abschneiden']]), h1('Dividiere schriftlich oder erweitere auf 1000.'), { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${l}`] }); },
    () => { const [kg, n] = wahl([[5, 8], [3, 8], [7, 8], [3, 16], [5, 16]]), l = ab(kg, n);
      return dezimal(Z(`Ein Sack mit ${kg} kg Mehl wird auf ${n} gleich schwere Tüten verteilt.`, 'Gib das Gewicht einer Tüte in Kilogramm an.'), l, dfe(l, [[ab(n, kg), 'bruch-vertauscht'], [`${kg},${n}`, 'bruch-als-komma']]), h1('Teile das Gewicht durch die Anzahl der Tüten.'),
        { einheit: 'kg', ...DIV(kg, n), nachweis: [`${kg} kg : ${n} = ${l} kg`] }); },
    () => { const ja = mische([[7, 28], [9, 15], [11, 25], [21, 24], [6, 30]]).slice(0, 2), nein = mische([[3, 14], [5, 12], [4, 21], [7, 18], [10, 27]]).slice(0, 3);
      return auswahl(Z('Kreuze alle Brüche an, die eine abbrechende Dezimalzahl ergeben.'), mische([...ja.map(([z, n]) => opt(br(z, n), true)), ...nein.map(([z, n]) => opt(br(z, n), false, 'periode-abgebrochen'))]),
        h1('Kürze zuerst vollständig. Nur wenn der Nenner dann aus den Faktoren 2 und 5 besteht, geht die Division auf.'), { mehrfach: true, nachweis: [{ art: 'abbrechend' }] }); },
    () => { const [z, n] = wahl([[5, 8], [3, 8], [7, 16], [9, 16], [3, 40]]), l = ab(z, n);
      return luecken(Z('Ergänze die fehlende Zahl.', `{{a}} : ${n} = ${l}`), { a: [z, dfe(z, [[z * 10, 'dezimal-stelle']])] }, h1(`Rechne rückwärts: ${l} · ${n}.`), { nachweis: [`${l} · ${n} = ${z}`] }); },
    () => { const [z, n] = wahl([[5, 8], [3, 8], [7, 8], [5, 16]]), l = ab(z, n), falsch = T(Math.floor((z * 10) / n), 1), kn = kind();
      return auswahl(Z(`${kn} rechnet ${z} : ${n} = ${falsch} und hört auf.`, 'Beurteile die Rechnung und begründe.'), [opt(`Falsch. Es bleibt ein Rest. Es gilt ${z} : ${n} = ${l}.`, true), opt('Stimmt.', false, 'runden-abschneiden'), opt('Stimmt, denn eine Stelle nach dem Komma reicht.', false, 'runden-abschneiden')],
        h1('Prüfe: Nimm das Ergebnis mal den Divisor. Kommt der Dividend heraus?'), { ...DIV(z, n), nachweis: [URTEIL(false, `${z} : ${n} = ${falsch}`)] }); },
    () => { const [z, n] = wahl([[13, 40], [21, 40], [23, 40], [19, 40], [29, 40]]), l = ab(z, n);
      return dezimal(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis als Dezimalzahl ein.'), l, dfe(l, [[T(Math.floor((z * 100) / n), 2), 'runden-abschneiden']]), h1('Hänge so lange Nullen an, bis kein Rest mehr bleibt.'), { ...DIV(z, n), nachweis: [`${z} : ${n} = ${l}`] }); },
    () => { const liste = mische([[3, 8], [2, 5], [7, 16], [9, 20], [11, 25]]).slice(0, 4), karten = liste.map(([z, n], i) => (i % 2 ? ab(z, n) : br(z, n))), werte = liste.map(([z, n]) => z / n);
      if (new Set(werte).size !== 4) return null;
      return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), karten.map((t, i) => [t, werte[i]]).sort((x, y) => x[1] - y[1]).map(([t]) => t), h1('Wandle die Brüche durch Dividieren in Dezimalzahlen um.'),
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dezimal-mehr-ziffern' }); },
    () => { const [geld, n] = wahl([['4,50', 3], ['7,50', 6], ['9,60', 8], ['5,40', 4], ['8,40', 5]]), cent = Number(geld.replace(',', '')), l = T(cent / n, 2, 2);
      return dezimal(Z(`${n} Kinder teilen ${geld} € gerecht.`, 'Gib an, wie viel Euro jedes Kind bekommt.'), l, dfe(l, [[T(cent / n, 1), 'dezimal-stelle']]), h1('Dividiere wie bei natürlichen Zahlen. Setze das Komma, wenn du das Komma im Dividenden überschreitest.'),
        { einheit: '€', nachweis: [`${geld} € : ${n} = ${l} €`] }); },
    () => { const opts = [['Er ergibt eine abbrechende Dezimalzahl, wenn sich sein Nenner durch Erweitern zu einer Zehnerpotenz machen lässt.', true], ['Er ergibt eine abbrechende Dezimalzahl, wenn der Zähler kleiner als der Nenner ist.', false], ['Er ergibt eine abbrechende Dezimalzahl, wenn der Nenner gerade ist.', false], ['Er ergibt immer eine abbrechende Dezimalzahl.', false]];
      return auswahl(Z('Ein Bruch ist vollständig gekürzt.', 'Kreuze die Aussage an, die immer stimmt.'), opts.map(([t, r]) => opt(t, r, r ? undefined : 'periode-abgebrochen')), h1('Prüfe jede Aussage an Beispielen wie Sechsteln, Achteln und Zwölfteln.'), { nachweis: [FREI('Regel für abbrechende Dezimalzahlen')] }); },
    () => { const [z, n, k] = wahl([[21, 28, 7], [15, 24, 3], [18, 24, 6], [14, 16, 2], [10, 16, 2]]), l = ab(z, n);
      return dezimal(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), l, dfe(l, [[`${z},${n}`, 'bruch-als-komma']]), h1('Kürze zuerst. Dann ist die Division kürzer.'), { ...DIV(z / k, n / k), nachweis: [`${br(z, n)} = ${br(z / k, n / k)} = ${z / k} : ${n / k} = ${l}`] }); },
    () => { const [z, n] = wahl([[3, 16], [5, 16], [7, 16], [9, 16], [11, 16], [13, 16]]), l = ab(z, n);
      return luecken(Z('Ergänze den Zähler.', `{{a}}⁄${n} = ${l}`), { a: [z, dfe(z, [[Number(l.split(',')[1]), 'bruch-als-komma']])] }, h1(`Rechne rückwärts: ${l} · ${n}.`), { nachweis: [`${l} · ${n} = ${z}`] }); },
  ]);

  // ================= D2: periodische Dezimalzahlen =================
  zwoelf(D2, 'M', [
    () => { const [z, n] = wahl([[1, 3], [2, 3], [1, 9], [4, 9], [7, 9]]), p = teile(z, n);
      return periode(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis mit Periode ein.'), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[2, 9], [5, 9], [8, 9], [1, 3]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[5, 11], [3, 11], [7, 11], [9, 11], [6, 11]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, [...perFehler(z, n), [periodisch(`0,`, p.per[0]), 'periode-abgebrochen']], tM2, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[1, 6], [5, 6], [1, 12], [1, 15], [2, 15]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[7, 12], [5, 12], [11, 12], [7, 15], [11, 15]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[2, 3], [1, 3], [5, 9], [7, 9]]), p = teile(z, n), falsch = abgebrochen(z, n, 2), kn = kind();
      return auswahl(Z(`${kn} schreibt: ${br(z, n)} = ${falsch}`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${p.text}.`, true), opt('Stimmt.', false, 'periode-abgebrochen'), opt(`Stimmt, denn ${falsch} ist fast ${br(z, n)}.`, false, 'periode-abgebrochen')], tM2,
        { ...DIV(z, n), nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const [z, n] = wahl([[5, 6], [1, 6], [5, 12], [4, 15], [8, 15]]), p = teile(z, n);
      return periode(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis mit Periode ein.'), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[5, 11], [7, 11], [2, 11], [4, 11]]), p = teile(z, n);
      return auswahl(Z(`Kreuze die richtige Schreibweise für ${br(z, n)} an.`), [opt(p.text, true), opt(periodisch(`0,${p.per[0]}`, p.per[1]), false, 'periode-zu-frueh'), opt(periodisch('0,', p.per[0]), false, 'periode-abgebrochen'), opt(`0,${p.per}`, false, 'periode-abgebrochen')], tM2,
        { ...DIV(z, n), nachweis: [`${z} : ${n} = ${p.text}`, { art: 'wert', wert: p.text }] }); },
    () => { const [pizza, n] = wahl([[2, 3], [1, 3], [1, 6], [5, 6], [4, 9]]), p = teile(pizza, n);
      return periode(Z(`${pizza === 1 ? 'Eine Pizza wird' : `${pizza} Pizzen werden`} gerecht auf ${n} Kinder verteilt.`, 'Gib den Anteil für ein Kind als Dezimalzahl an.'), p.vor, p.per, perFehler(pizza, n), tM2, { ...DIV(pizza, n), nachweis: [`${pizza} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[4, 15], [7, 15], [1, 15], [13, 15]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), tM2, { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const g = zz(1, 4), [z, n] = wahl([[1, 3], [2, 3], [1, 6], [5, 9]]), p = teile(g * n + z, n);
      return periode(Z(`Wandle ${br(z, n, g)} in eine Dezimalzahl um.`), p.vor, p.per, [...perFehler(g * n + z, n), [teile(z, n).text, 'bruch-ganzes-teil']], h2('Die Ganzen stehen vor dem Komma.', 'Dividiere den Bruchteil schriftlich und achte auf die Reste.'),
        { ...DIV(g * n + z, n), nachweis: [`${br(z, n, g)} = ${g} + ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[1, 6], [5, 6], [1, 12], [7, 12]]), p = teile(z, n), falsch = periodisch(`0,`, entwickle(z, n).vor + p.per), kn = kind();
      return auswahl(Z(`${kn} schreibt: ${br(z, n)} = ${falsch}`, 'Beurteile die Schreibweise.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${p.text}.`, true), opt('Stimmt.', false, 'periode-zu-frueh'), opt(`Stimmt, denn ${z} : ${n} = ${falsch}.`, false, 'periode-zu-frueh')], tM2,
        { ...DIV(z, n), nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
  ]);
  zwoelf(D2, 'E', [
    () => { const [z, n] = wahl([[1, 7], [2, 7], [3, 7], [1, 13]]), p = teile(z, n);
      return periode(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis mit Periode ein.'), p.vor, p.per, perFehler(z, n), h1(`Schreibe jeden Rest auf. Beim Teilen durch ${n} gibt es höchstens ${n - 1} verschiedene Reste.`), { ...DIV(z, n), nachweis: [`${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[5, 13], [2, 13], [4, 7], [6, 7]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), h1('Die Periode kann lang sein. Höre erst auf, wenn ein Rest zum zweiten Mal kommt.'), { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[7, 30], [1, 30], [11, 30], [5, 18], [7, 18], [1, 24]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), h1('Nicht jede Periode beginnt direkt nach dem Komma.'), { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
    () => { const ja = mische([[4, 15], [5, 18], [7, 12], [2, 21], [5, 27]]).slice(0, 2), nein = mische([[3, 20], [7, 28], [9, 24], [6, 30], [12, 25]]).slice(0, 3);
      return auswahl(Z('Kreuze alle Brüche an, die eine periodische Dezimalzahl ergeben.'), mische([...ja.map(([z, n]) => opt(br(z, n), true)), ...nein.map(([z, n]) => opt(br(z, n), false, 'periode-abgebrochen'))]),
        h1('Kürze zuerst vollständig. Hat der Nenner dann einen anderen Teiler als 2 und 5, ist die Dezimalzahl periodisch.'), { mehrfach: true, nachweis: [{ art: 'abbrechend', periodisch: true }] }); },
    () => { const z = wahl([2, 4, 5, 7, 8]), p = teile(z, 9);
      return bruch(Z(`Gib den Bruch mit dem Nenner 9 an, der ${p.text} ist.`), br(z, 9), [[br(z, 10), 'periode-abgebrochen'], [br(9, z), 'bruch-vertauscht']].filter(([w]) => w !== br(9, 9)), h1('Dividiere Neuntel und schau dir die Muster an: 1 : 9, 2 : 9, 3 : 9.'),
        { gekuerzt: true, nachweis: [`${p.text} = ${br(z, 9)}`] }); },
    () => { const [z, n] = wahl([[1, 7], [2, 7], [3, 7]]), p = teile(z, n), falsch = `0,${p.per.slice(0, 4)}`, kn = kind();
      return auswahl(Z(`${kn} sagt: „${br(z, n)} = ${falsch}. Die Division geht auf.“`, 'Beurteile die Aussage und begründe.'), [opt(`Falsch. Der Rest kommt wieder. Es gilt ${br(z, n)} = ${p.text}.`, true), opt('Stimmt.', false, 'periode-abgebrochen'), opt(`Stimmt, denn ${falsch} hat vier Stellen.`, false, 'periode-abgebrochen')],
        h1('Prüfe den Rest nach der vierten Stelle. Ist er 0?'), { ...DIV(z, n), nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const [z, n] = wahl([[5, 12], [7, 18], [11, 24], [13, 30], [1, 18]]), p = teile(z, n);
      return periode(Z(`Dividiere schriftlich im Heft: ${z} : ${n}`, 'Gib das Ergebnis mit Periode ein.'), p.vor, p.per, perFehler(z, n), h1('Achte darauf, ab welchem Rest sich die Ziffern wiederholen.'), { ...DIV(z, n), nachweis: [`${z} : ${n} = ${p.text}`] }); },
    () => { const [a, c] = wahl([['0,3̅', '0,33'], ['0,6̅', '0,67'], ['0,1̅', '0,11'], ['0,16̅', '0,17'], ['0,8̅', '0,88']]);
      return auswahl(Z('Kreuze das passende Zeichen an.', `${a} ▢ ${c}`), ZEICHEN(Number(a.replace(/̅/g, '').replace(',', '.') + a.replace(/̅/g, '').slice(-1).repeat(4)) - Number(c.replace(',', '.')), 'periode-abgebrochen'),
        h1('Schreibe die periodische Zahl mit vielen Stellen aus. Vergleiche dann Stelle für Stelle.'), { nachweis: [VGL(a, c)] }); },
    () => {       return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), ['0,33', '0,3̅', '0,34', '0,3̅4̅'], h1('Schreibe jede Zahl mit sechs Stellen nach dem Komma aus. Vergleiche dann.'),
        { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'periode-abgebrochen'}); },
    () => { const z = wahl([2, 4, 5, 7, 8]), p = teile(z, 9);
      return bruch(Z('Es gilt: 0,1̅ = 1⁄9.', `Gib ${p.text} als vollständig gekürzten Bruch an.`), br(z, 9), [[br(z, 10), 'periode-abgebrochen']], h1(`${p.text} ist ${z}-mal so groß wie 0,1̅.`), { gekuerzt: true, nachweis: [`${p.text} = ${z} · 0,1̅ = ${br(z, 9)}`] }); },
    () => { const [pizza, n] = wahl([[3, 11], [5, 11], [2, 11], [1, 11]]), p = teile(pizza, n);
      return periode(Z(`${pizza === 1 ? 'Eine Pizza wird' : `${pizza} Pizzen werden`} gerecht auf ${n} Kinder verteilt.`, 'Gib den Anteil für ein Kind als Dezimalzahl an.'), p.vor, p.per, perFehler(pizza, n), h1('Teile die Pizzen durch die Anzahl der Kinder. Achte auf die Reste.'), { ...DIV(pizza, n), nachweis: [`${pizza} : ${n} = ${p.text}`] }); },
    () => { const [z, n] = wahl([[3, 22], [1, 22], [5, 22], [7, 22], [9, 22]]), p = teile(z, n);
      return periode(Z(`Wandle ${br(z, n)} in eine Dezimalzahl um.`), p.vor, p.per, perFehler(z, n), h1('Erst nach der ersten Stelle beginnt die Periode. Prüfe die Reste genau.'), { ...DIV(z, n), nachweis: [`${br(z, n)} = ${z} : ${n} = ${p.text}`] }); },
  ]);
}
