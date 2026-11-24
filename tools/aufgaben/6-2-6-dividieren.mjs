// Aufgaben zu 6.2.6 „Brüche dividieren“ (Lernziele D1, D2) nach ADR 0015 und ADR 0038.
// Niveau-Meilenstein mit der Marke M: Aufgaben gibt es nur auf M und E, je zwölf (ADR 0037, 0038).
// D1: durch einen Bruch dividieren. D2: mit gemischten Zahlen dividieren, Sachaufgaben („Wie oft passt es hinein?“).
// Typische Fehler: keinen Kehrwert oder den vom falschen Bruch bilden, gemischte Zahlen getrennt teilen, „Teilen macht kleiner“.

import { zwoelf, auswahl, luecken, zahl, h1, h2, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, FREI, ggt, br, opt, zz, wahl, mische, kz, mal, plus, minus, durch, T, echt, rechneB, urteil, VGL, ZEICHEN, streifen, istBruch, gleich, ganz } from './6-2-rechnen.mjs';

const D1 = '6.2.6-D1', D2 = '6.2.6-D2';
const B2 = (q) => br(q[0], q[1]);
const kehr = ([z, n]) => [n, z];
// Kehrwert als Text; aus 1⁄4 wird die Zahl 4.
const K = (c) => (c[0] === 1 ? String(c[1]) : br(c[1], c[0]));
// a : c mit zwei gekürzten echten Brüchen. q ist der gekürzte Quotient.
const paar = (nenner, passt = () => true) => { for (let i = 0; i < 2000; i++) { const a = echt(nenner), c = echt(nenner), q = durch(a, c); if (!gleich(a, c) && passt(a, c, q)) return { a, c, q }; } return null; };
const gz = (ganze, nenner) => { const a = echt(nenner), g = wahl(ganze); return [g * a[1] + a[0], a[1]]; };
const NM = [2, 3, 4, 5, 6, 8, 9, 10, 12];
const gleichungen = (anzahl, erzeuge, fv, tipp) => { const roh = [];
  for (let i = 0; i < anzahl; i++) { const stimmt = i < 2 ? i === 0 : wahl([true, false]), r = erzeuge(stimmt); if (!r || roh.some(([q]) => q === r)) return null; roh.push([r, stimmt]); }
  return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : fv)), tipp, { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); };

export function dividieren() {
  // ================= D1: durch einen Bruch dividieren =================
  const hK = (a, c) => h2('Durch einen Bruch dividieren heißt: mit seinem Kehrwert multiplizieren.', `Der Kehrwert von ${B2(c)} ist ${K(c)}. Rechne ${B2(a)} · ${K(c)} und kürze.`);
  zwoelf(D1, 'M', [
    () => { const n = wahl([4, 5, 6, 8, 10]), c = wahl([1, 2]), k = zz(2, 4);
      if (c * k >= n || ggt(c, n) > 1 || ggt(c * k, n) > 1) return null;
      return zahl(`Im Streifen ist ${br(c * k, n)} gefärbt. Wie oft passt ${br(c, n)} in ${br(c * k, n)}?`, k, fehlerliste(k, [[c * k, 'sach-frage-verfehlt'], [n, 'sach-frage-verfehlt'], [k + 1, 'sach-schritt-vergessen']]),
        h2('Dividieren heißt hier: zählen, wie oft der zweite Bruch in den ersten passt.', `Lege Stücke der Größe ${br(c, n)} nebeneinander, bis ${br(c * k, n)} erreicht ist.`), { bild: bild(streifen(c * k, n)), nachweis: [`${br(c * k, n)} : ${br(c, n)} = ${k}`] }); },
    () => { const c = echt([3, 4, 5, 6, 7, 8, 9]);
      if (c[0] === 1) return null;
      return luecken(`Der Kehrwert von ${B2(c)} ist {{a}}⁄{{b}}.`, { a: [c[1], fehlerliste(c[1], [[c[0], 'bruch-kehrwert'], [c[1] - c[0], 'bruch-teil-zu-rest']])], b: [c[0], fehlerliste(c[0], [[c[1], 'bruch-kehrwert']])] },
        h2('Beim Kehrwert tauschen Zähler und Nenner die Plätze.', `Der Zähler ${c[0]} wandert nach unten, der Nenner ${c[1]} nach oben.`), { nachweis: [{ art: 'teil', bruch: B2(c), was: 'nenner', zahl: c[1] }, { art: 'teil', bruch: B2(c), was: 'zaehler', zahl: c[0] }] }); },
    () => { const { a, c } = paar([2, 3, 4, 5, 7], (x, y) => x[1] !== y[1] && y[0] > 1 && ggt(x[0] * y[1], x[1] * y[0]) === 1), roh = [a[0] * c[1], a[1] * c[0]];
      return luecken(`Ergänze den Rechenweg: ${B2(a)} : ${B2(c)} = ${B2(a)} · {{a}}⁄{{b}} = {{c}}⁄${roh[1]}`, { a: [c[1], fehlerliste(c[1], [[c[0], 'bruch-kehrwert'], [a[1], 'bruch-kehrwert']])], b: [c[0], fehlerliste(c[0], [[c[1], 'bruch-kehrwert'], [a[0], 'bruch-kehrwert']])], c: [roh[0], fehlerliste(roh[0], [[a[0] * c[0], 'bruch-kehrwert'], [a[0] + c[1], '1x1-addiert']])] }, hK(a, c),
        { nachweis: [`${B2(a)} : ${B2(c)} = ${B2(a)} · ${B2(kehr(c))} = ${B2(roh)}`, { art: 'teil', bruch: B2(kehr(c)), was: 'zaehler', zahl: c[1] }, { art: 'teil', bruch: B2(kehr(c)), was: 'nenner', zahl: c[0] }, { art: 'teil', bruch: B2(roh), was: 'zaehler', zahl: roh[0] }] }); },
    () => { const { a, c, q } = paar(NM, (x, y, qq) => istBruch(qq) && qq[0] < qq[1] && x[1] !== y[1]);
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} und kürze vollständig.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert'], [mal(kehr(a), kehr(c)), 'bruch-kehrwert']], hK(a, c), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const c = echt([2, 3, 4, 5, 6, 8]), f = zz(1, 4), k = f * c[0], e = f * c[1];
      if (k < 2) return null;
      return zahl(`Berechne ${k} : ${B2(c)}.`, e, fehlerliste(e, [[k * c[0], 'bruch-kehrwert'], [f, 'sach-schritt-vergessen'], [k * c[1], 'sach-schritt-vergessen']]),
        h2('Auch eine natürliche Zahl kannst du durch einen Bruch dividieren: mit dem Kehrwert multiplizieren.', `Rechne ${k} · ${K(c)}. Kürze ${k} mit ${c[0]}.`), { nachweis: [`${k} : ${B2(c)} = ${e}`] }); },
    () => auswahl('Du dividierst eine Zahl durch einen Bruch, der kleiner als 1 ist. Was gilt für das Ergebnis?', mische([opt('Es ist größer als die Zahl, denn der kleine Bruch passt öfter als einmal hinein.', true), opt('Es ist kleiner als die Zahl, denn Dividieren verkleinert immer.', false, 'mal-macht-groesser'), opt('Es ist genauso groß wie die Zahl.', false, 'mal-macht-groesser'), opt('Es ist immer eine natürliche Zahl.', false, 'bruch-kehrwert')]),
      h2('Frage dich: Wie oft passt der Bruch in die Zahl?', 'Ein halbes Stück passt in zwei Ganze viermal. Das Ergebnis ist also größer als zwei.'), { nachweis: [FREI('Dividieren durch einen Bruch unter 1 vergrößert')] }),
    () => { const { a, c, q } = paar(NM, (x, y, qq) => istBruch(qq) && qq[0] > qq[1] && y[1] % x[1] === 0 && x[1] !== y[1]);
      return rechneB(`Berechne ${B2(a)} : ${B2(c)}. Gib das Ergebnis als vollständig gekürzte gemischte Zahl an.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert']], hK(a, c), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const { a, c, q } = paar([2, 3, 4, 5, 6], (x, y, qq) => istBruch(qq) && x[1] !== y[1]), falle = mal(a, c), kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} : ${B2(c)} = ${T(x)}`;
      return urteil(`${kn} rechnet: ${g(stimmt ? q : falle)}\nStimmt das?`, stimmt, g(stimmt ? q : falle), g(stimmt ? falle : q), [g(durch(c, a))].filter(() => istBruch(durch(c, a))), 'bruch-kehrwert',
        h2('Prüfe, ob mit dem Kehrwert des zweiten Bruchs multipliziert wurde.', `Richtig ist der Rechenweg ${B2(a)} · ${K(c)}. Vergleiche das Ergebnis.`)); },
    () => { const { a, c, q } = paar([6, 8, 9, 10, 12, 14, 15, 16], (x, y, qq) => istBruch(qq) && ggt(x[0], y[0]) > 1 && ggt(x[1], y[1]) > 1);
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} und kürze vollständig.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert']],
        h2('Bilde zuerst den Kehrwert des zweiten Bruchs. Kürze dann über Kreuz.', `Rechne ${B2(a)} · ${K(c)}. Kürze ${a[0]} mit ${c[0]} und ${c[1]} mit ${a[1]}.`), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const n = wahl([5, 7, 8, 9, 10, 11, 12]), a = echt([n]), c = echt([n]), q = durch(a, c);
      if (!istBruch(q) || q[0] < q[1]) return null;
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} und kürze vollständig.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert'], [[a[0] - c[0], n], 'div-falsche-rechenart']],
        h2('Die Brüche sind gleichnamig. Frage dich, wie oft der zweite in den ersten passt.', `Die Nenner kürzen sich weg. Übrig bleibt ${a[0]} : ${c[0]} als Bruch.`), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const a = echt([3, 4, 5, 6, 8]), c = wahl([echt([2, 3, 4, 5]), gz([1], [2, 3, 4])]);
      if (gleich(a, c)) return null;
      return auswahl(`Welches Zeichen passt? ${B2(a)} : ${T(c)} ▢ ${B2(a)}`, ZEICHEN(c[1] - c[0], 'mal-macht-groesser'), h2('Du musst nicht rechnen. Schau dir die Zahl an, durch die dividiert wird.', `Ist ${T(c)} kleiner oder größer als 1? Dividieren durch eine Zahl unter 1 vergrößert.`), { nachweis: [VGL(`${B2(a)} : ${T(c)}`, B2(a))] }); },
    () => gleichungen(4, (stimmt) => { const { a, c, q } = paar([2, 3, 4, 5, 6, 8], (x, y, qq) => istBruch(qq) && x[1] !== y[1]), x = stimmt ? q : wahl([mal(a, c), durch(c, a)]);
      return !istBruch(x) || gleich(x, q) !== stimmt ? null : `${B2(a)} : ${B2(c)} = ${T(x)}`; }, 'bruch-kehrwert', h2('Rechne jede Aufgabe mit dem Kehrwert nach.', 'Nur der zweite Bruch wird umgedreht. Überschlage: Ist der zweite Bruch kleiner als der erste, ist das Ergebnis größer als 1.')),
  ]);
  const NE = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25];
  zwoelf(D1, 'E', [
    () => { const { a, c, q } = paar(NE, (x, y, qq) => istBruch(qq) && ggt(x[0], y[0]) > 1 && ggt(x[1], y[1]) > 2 && x[1] >= 12 && y[1] >= 12);
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} und kürze vollständig.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert']], h1('Multipliziere mit dem Kehrwert und kürze über Kreuz, bevor du rechnest.'), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const { a, c, q } = paar([3, 4, 5, 6, 8, 9, 10], (x, y, qq) => istBruch(qq) && y[0] > 1 && qq[1] <= 30 && x[1] !== y[1]);
      return luecken(`Welcher Zähler fehlt? ${B2(a)} : {{a}}⁄${c[1]} = ${T(q)}`, { a: [c[0], fehlerliste(c[0], [[c[1] - c[0], 'bruch-teil-zu-rest'], [q[0], 'sach-frage-verfehlt'], [a[0], 'bruch-kehrwert']])] },
        h1('Der gesuchte Bruch ist der Quotient aus dem ersten Bruch und dem Ergebnis.'), { nachweis: [`${B2(a)} : ${T(q)} = ${B2(c)}`, { art: 'teil', bruch: B2(c), was: 'zaehler', zahl: c[0] }] }); },
    () => { const { a, c, q } = paar([3, 4, 5, 6, 8, 9, 10, 12], (x, y, qq) => istBruch(qq) && x[1] !== y[1]);
      return rechneB(`Im Zähler eines Doppelbruchs steht ${B2(a)}, im Nenner steht ${B2(c)}. Welchen Wert hat der Doppelbruch? Kürze vollständig.`, q, [[mal(a, c), 'bruch-kehrwert'], [durch(c, a), 'bruch-kehrwert']], h1('Der große Bruchstrich bedeutet geteilt: Zähler durch Nenner.'), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => auswahl('Warum führt die Multiplikation mit dem Kehrwert zum selben Ergebnis wie die Division durch den Bruch?', mische([opt('Weil die Division die Multiplikation umkehrt und ein Bruch mal sein Kehrwert genau eins ergibt.', true), opt('Weil beim Kehrwert Zähler und Nenner gleich groß werden.', false, 'bruch-kehrwert'), opt('Weil der Kehrwert immer kleiner ist als der Bruch.', false, 'mal-macht-groesser'), opt('Weil man bei Brüchen grundsätzlich nicht dividieren kann.', false, 'bruch-kehrwert'), opt('Weil beide Brüche dabei umgedreht werden.', false, 'bruch-kehrwert')]),
      h1('Mache die Probe mit einem Beispiel: Multipliziere das Ergebnis wieder mit dem Bruch, durch den du dividiert hast.'), { nachweis: [FREI('Begründung der Kehrwertregel')] }),
    () => { const a = echt([3, 4, 5, 6]), c = echt([4, 5, 6, 8]), e = echt([6, 8, 9, 10]), q = durch(durch(a, c), e);
      if (!istBruch(q) || new Set([a[1], c[1], e[1]]).size < 3 || q[1] > 40) return null;
      return rechneB(`Berechne ${B2(a)} : ${B2(c)} : ${B2(e)} und kürze vollständig.`, q, [[durch(a, durch(c, e)), 'klammer-falsch-gesetzt'], [durch(a, c), 'sach-schritt-vergessen']], h1('Rechne von links nach rechts. Jeder Bruch hinter einem Geteiltzeichen wird umgedreht.'), [`${B2(a)} : ${B2(c)} : ${B2(e)} = ${T(q)}`]); },
    () => gleichungen(5, (stimmt) => { const { a, c, q } = paar([4, 5, 6, 8, 9, 10, 12], (x, y, qq) => istBruch(qq) && x[1] !== y[1] && qq[1] <= 40), x = stimmt ? q : wahl([mal(a, c), durch(c, a), plus(q, [1, q[1]])]);
      return !istBruch(x) || gleich(x, q) !== stimmt ? null : `${B2(a)} : ${B2(c)} = ${T(x)}`; }, 'bruch-kehrwert', h1('Überschlage zuerst: Ist der Divisor kleiner als der erste Bruch, muss das Ergebnis größer als 1 sein.')),
    () => { const c = echt([5, 6, 7, 8, 9, 10, 12]), k = wahl([4, 6, 8, 9, 10, 12, 14, 15]), q = durch(ganz(k), c);
      if (!istBruch(q) || ggt(k, c[0]) === 1) return null;
      return rechneB(`Berechne ${k} : ${B2(c)} und kürze vollständig.`, q, [[mal(ganz(k), c), 'bruch-kehrwert'], [durch(c, ganz(k)), 'bruch-kehrwert']], h1('Schreibe die natürliche Zahl als Bruch mit dem Nenner 1 und kürze über Kreuz.'), [`${k} : ${B2(c)} = ${T(q)}`]); },
    () => { const { a, c, q } = paar([3, 4, 5, 6, 8, 9], (x, y, qq) => istBruch(qq) && x[1] !== y[1]);
      return rechneB(`Eine Zahl wird mit ${B2(c)} multipliziert. Das Ergebnis ist ${B2(a)}. Wie heißt die Zahl? Kürze vollständig.`, q, [[mal(a, c), 'probe-falsche-umkehr'], [durch(c, a), 'bruch-kehrwert']], h1('Mache die Multiplikation mit der Umkehraufgabe rückgängig.'), [`${B2(a)} : ${B2(c)} = ${T(q)}`]); },
    () => { const { a, c, q } = paar([3, 4, 5, 6, 8, 9, 10], (x, y, qq) => istBruch(qq) && x[1] !== y[1] && qq[1] <= 30 && y[0] > 1);
      return rechneB(`Durch welchen Bruch musst du ${B2(a)} dividieren, um ${T(q)} zu erhalten? Kürze vollständig.`, c, [[mal(a, q), 'probe-falsche-umkehr'], [durch(q, a), 'bruch-kehrwert']], h1('Der gesuchte Divisor ist der Quotient aus der ersten Zahl und dem Ergebnis.'), [`${B2(a)} : ${T(q)} = ${B2(c)}`]); },
    () => { const { a, c } = paar([3, 4, 5, 7], (x, y, qq) => istBruch(qq) && x[1] !== y[1] && x[0] > 1 && y[0] > 1), kn = kind();
      return auswahl(`${kn} rechnet ${B2(a)} : ${B2(c)} = ${B2(kehr(a))} · ${B2(c)} = ${T(mal(kehr(a), c))}. Welchen Fehler macht ${kn}?`, [opt('Es wurde der Kehrwert des ersten Bruchs gebildet statt des zweiten.', true), opt('Es hätten beide Brüche umgedreht werden müssen.', false, 'bruch-kehrwert'), opt('Es hätte gar kein Kehrwert gebildet werden dürfen.', false, 'bruch-kehrwert'), opt('Die Rechnung stimmt, das Ergebnis ist nur nicht gekürzt.', false, 'bruch-kehrwert'), opt('Die Nenner hätten zuerst gleichnamig gemacht werden müssen.', false, 'bruch-mal-wie-plus')],
        h1('Vergleiche die zweite Rechnung mit der ersten: Welcher Bruch hat sich verändert?'), { nachweis: [FREI('Fehleranalyse: Kehrwert vom falschen Bruch')] }); },
    () => { const { a, c } = paar([3, 4, 5, 6, 8], (x, y) => x[1] !== y[1] && y[0] > 1), art = wahl([0, 1, 2]), rechts = art === 0 ? `${B2(a)} · ${K(c)}` : art === 1 ? `${B2(a)} · ${B2(c)}` : `${B2(c)} : ${B2(a)}`, l = durch(a, c), r = art === 0 ? l : art === 1 ? mal(a, c) : durch(c, a);
      if (art === 2 && gleich(l, r)) return null;
      return auswahl(`Welches Zeichen passt? ${B2(a)} : ${B2(c)} ▢ ${rechts}`, ZEICHEN(l[0] * r[1] - r[0] * l[1], 'bruch-kehrwert'), h1('Überlege zuerst ohne Rechnung, ob jede Seite größer oder kleiner als der erste Bruch ist.'), { nachweis: [VGL(`${B2(a)} : ${B2(c)}`, rechts)] }); },
    () => auswahl('Zwei Brüche werden dividiert. Wann ist das Ergebnis kleiner als 1?', mische([opt('Wenn der erste Bruch kleiner ist als der zweite.', true), opt('Wenn beide Brüche kleiner als 1 sind.', false, 'mal-macht-groesser'), opt('Wenn der zweite Bruch kleiner ist als der erste.', false, 'bruch-kehrwert'), opt('Immer, denn Dividieren verkleinert.', false, 'mal-macht-groesser'), opt('Nie, denn Dividieren durch einen Bruch vergrößert.', false, 'mal-macht-groesser')]),
      h1('Frage dich: Wie oft passt der zweite Bruch in den ersten? Wann passt er nicht einmal ganz hinein?'), { nachweis: [FREI('Quotient unter 1, wenn der Dividend kleiner ist')] }),
  ]);

  // ================= D2: gemischte Zahlen, Sachaufgaben =================
  const hG = (e, f) => h2('Wandle gemischte Zahlen zuerst in Brüche um. Multipliziere dann mit dem Kehrwert.', `${T(e)} = ${B2(e)}${f[1] > 1 && f[0] > f[1] ? ` und ${T(f)} = ${B2(f)}` : ''}. Rechne ${B2(e)} · ${K(f)} und kürze.`);
  zwoelf(D2, 'M', [
    () => { const c = [1, wahl([2, 3, 4, 5, 8])], g = zz(2, 4), was = wahl(['Saft', 'Wasser', 'Tee']);
      return zahl(`Wie viele Gläser mit je ${B2(c)} l lassen sich aus ${g} l ${was} füllen?`, g * c[1], fehlerliste(g * c[1], [[c[1], 'sach-schritt-vergessen'], [g, 'sach-frage-verfehlt'], [g + c[1], '1x1-addiert']]),
        h2('Gefragt ist, wie oft der Bruch in die Menge passt. Das ist eine Division.', `In einen Liter passen ${c[1]} Gläser. Rechne ${g} · ${c[1]}.`), { nachweis: [`${g} l : ${B2(c)} l = ${g * c[1]}`] }); },
    () => { const e = gz([1, 2, 3], [2, 3, 4]), c = echt([2, 3, 4, 5, 6]), q = durch(e, c);
      if (!istBruch(q) || q[1] > 20) return null;
      return rechneB(`Berechne ${T(e)} : ${B2(c)} und kürze vollständig.`, q, [[mal(e, c), 'bruch-kehrwert'], [plus([Math.floor(e[0] / e[1]), 1], durch([e[0] % e[1], e[1]], c)), 'gemischt-getrennt-mal']], hG(e, c), [`${T(e)} : ${B2(c)} = ${T(q)}`]); },
    () => { const c = echt([2, 4, 5, 8]), k = zz(3, 8), e = mal(ganz(k), c), kn = kind(), ding = wahl(['Ein Band', 'Ein Seil', 'Eine Leiste']);
      if (!istBruch(e) || e[0] < e[1]) return null;
      return zahl(`${ding} ist ${T(e)} m lang. ${kn} schneidet Stücke von je ${B2(c)} m Länge ab. Wie viele Stücke erhält ${kn}?`, k, fehlerliste(k, [[Math.floor(e[0] / e[1]), 'sach-frage-verfehlt'], [k + 1, 'sach-schritt-vergessen'], [k - 1, 'sach-schritt-vergessen']]),
        h2('Gefragt ist, wie oft die Stücklänge in die ganze Länge passt.', `Rechne ${T(e)} : ${B2(c)} = ${B2(e)} · ${K(c)}.`), { nachweis: [`${T(e)} m : ${B2(c)} m = ${k}`] }); },
    () => { const e = gz([1, 2, 3, 4], [2, 3, 4, 5]), f = gz([1, 2], [2, 3, 4, 5]), q = durch(e, f);
      if (!istBruch(q) || q[1] > 20 || gleich(e, f)) return null;
      return rechneB(`Berechne ${T(e)} : ${T(f)} und kürze vollständig.`, q, [[mal(e, f), 'bruch-kehrwert'], [durch(f, e), 'bruch-kehrwert']], hG(e, f), [`${T(e)} : ${T(f)} = ${T(q)}`]); },
    () => { const c = wahl([[1, 10], [3, 20], [1, 5], [1, 8], [3, 10], [1, 4]]), k = zz(2, 6), voll = mal(ganz(k), c), was = wahl(['Spielen', 'Videoschauen', 'Musikhören']);
      if (voll[0] >= voll[1] || gleich(voll, c)) return null;
      return zahl(`Der Akku ist zu ${B2(voll)} voll. Eine Stunde ${was} verbraucht ${B2(c)} vom ganzen Akku. Für wie viele Stunden reicht der Akku noch?`, k, fehlerliste(k, [[k + 1, 'sach-schritt-vergessen'], [voll[1], 'sach-frage-verfehlt'], [c[1], 'sach-frage-verfehlt']]),
        h2('Gefragt ist, wie oft der Verbrauch einer Stunde in die Ladung passt.', `Rechne ${B2(voll)} : ${B2(c)} = ${B2(voll)} · ${K(c)}.`), { nachweis: [`${B2(voll)} : ${B2(c)} = ${k}`] }); },
    () => { const e = gz([2, 3, 4], [3, 5, 7]), c = echt([2, 3, 4]), kn = kind(), g = Math.floor(e[0] / e[1]);
      return auswahl(`${kn} rechnet ${T(e)} : ${B2(c)} und dividiert dabei nur die ${g} Ganzen durch ${B2(c)}. Den Bruch ${br(e[0] % e[1], e[1])} schreibt ${kn} einfach dahinter. Was ist daran falsch?`, [opt('Auch der Bruch hinter den Ganzen muss dividiert werden.', true), opt('Die Ganzen dürfen gar nicht dividiert werden.', false, 'gemischt-getrennt-mal'), opt('Nichts, so rechnet man mit gemischten Zahlen.', false, 'gemischt-getrennt-mal'), opt('Der Bruch dahinter hätte multipliziert werden müssen.', false, 'bruch-kehrwert')],
        h2('Eine gemischte Zahl ist eine Summe aus Ganzen und einem Bruch.', `Wandle ${T(e)} zuerst in ${B2(e)} um. Dann wird die ganze Zahl dividiert.`), { nachweis: [FREI('Fehleranalyse: gemischte Zahl getrennt dividiert')] }); },
    () => { const c = [1, wahl([4, 5, 8, 10])], k = zz(3, 9), e = mal(ganz(k), c), was = wahl(['Saft', 'Milch', 'Kakao']);
      if (e[0] >= e[1] || k === 1) return null;
      return zahl(`Aus ${B2(e)} l ${was} werden Becher mit je ${B2(c)} l gefüllt. Für wie viele Becher reicht das?`, k, fehlerliste(k, [[e[1], 'sach-frage-verfehlt'], [c[1], 'sach-frage-verfehlt'], [k + 1, 'sach-schritt-vergessen']]),
        h2('Gefragt ist, wie oft die Bechermenge in die ganze Menge passt.', `Rechne ${B2(e)} : ${B2(c)} = ${B2(e)} · ${c[1]}.`), { nachweis: [`${B2(e)} l : ${B2(c)} l = ${k}`] }); },
    () => { const c = echt([3, 4, 5, 10]), g = zz(2, 5), q = durch(ganz(g), c), tier = wahl(['Eine Schnecke', 'Eine Raupe', 'Ein Käfer']);
      if (!istBruch(q) || c[0] === 1) return null;
      return rechneB(`${tier} kommt in jeder Minute ${B2(c)} m weit. Wie viele Minuten braucht das Tier für ${g} m? Kürze vollständig.`, q, [[mal(ganz(g), c), 'bruch-kehrwert'], [durch(c, ganz(g)), 'bruch-kehrwert']],
        h2('Gefragt ist, wie oft die Strecke einer Minute in die ganze Strecke passt.', `Rechne ${g} : ${B2(c)} = ${g} · ${K(c)}.`), [`${g} m : ${B2(c)} m = ${T(q)}`]); },
    () => { const f = gz([1, 2], [2, 3, 4, 5]), k = zz(2, 8), q = durch(ganz(k), f);
      if (!istBruch(q) || q[1] > 15) return null;
      return rechneB(`Berechne ${k} : ${T(f)} und kürze vollständig.`, q, [[mal(ganz(k), f), 'bruch-kehrwert'], [durch(f, ganz(k)), 'bruch-kehrwert']],
        h2('Wandle die gemischte Zahl in einen Bruch um und multipliziere mit dessen Kehrwert.', `${T(f)} = ${B2(f)}. Rechne ${k} · ${K(f)}.`), [`${k} : ${T(f)} = ${T(q)}`]); },
    () => { const c = echt([4, 5, 8, 10]), k = zz(3, 8), e = mal(ganz(k), c), [ding, zutat, viele] = wahl([['einen Kuchen', 'Mehl', 'Kuchen'], ['ein Brot', 'Mehl', 'Brote'], ['ein Glas Marmelade', 'Zucker', 'Gläser']]);
      if (!istBruch(e) || e[0] < e[1] || c[0] === 1) return null;
      return zahl(`Für ${ding} braucht man ${B2(c)} kg ${zutat}. Im Schrank sind ${T(e)} kg ${zutat}. Für wie viele ${viele} reicht das?`, k, fehlerliste(k, [[Math.floor(e[0] / e[1]), 'sach-frage-verfehlt'], [k + 1, 'sach-schritt-vergessen'], [k - 1, 'sach-schritt-vergessen']]),
        h2('Gefragt ist, wie oft die Menge für ein Rezept in den Vorrat passt.', `Rechne ${T(e)} : ${B2(c)} = ${B2(e)} · ${K(c)}.`), { nachweis: [`${T(e)} kg : ${B2(c)} kg = ${k}`] }); },
    () => { const k = zz(2, 6), c = wahl([echt([2, 3, 4, 5]), gz([1], [2, 3, 4])]);
      return auswahl(`Welches Zeichen passt? ${k} : ${T(c)} ▢ ${k}`, ZEICHEN(c[1] - c[0], 'mal-macht-groesser'), h2('Du musst nicht rechnen. Schau dir die Zahl an, durch die dividiert wird.', `Ist ${T(c)} kleiner als 1, passt es öfter als einmal in jedes Ganze.`), { nachweis: [VGL(`${k} : ${T(c)}`, String(k))] }); },
    () => gleichungen(4, (stimmt) => { const e = gz([1, 2, 3], [2, 3, 4]), c = echt([2, 3, 4, 5, 6]), q = durch(e, c), x = stimmt ? q : wahl([mal(e, c), plus([Math.floor(e[0] / e[1]), 1], durch([e[0] % e[1], e[1]], c)), durch(c, e)]);
      return !istBruch(x) || !istBruch(q) || gleich(x, q) !== stimmt || q[1] > 24 ? null : `${T(e)} : ${B2(c)} = ${T(x)}`; }, 'gemischt-getrennt-mal', h2('Wandle jede gemischte Zahl in einen Bruch um und rechne mit dem Kehrwert nach.', 'Überschlage: Der Bruch ist kleiner als 1. Das Ergebnis muss also größer sein als die erste Zahl.')),
  ]);
  zwoelf(D2, 'E', [
    () => { const e = gz([3, 4, 5, 6, 7], [3, 4, 5, 6, 8]), f = gz([1, 2, 3], [3, 4, 5, 6, 8]), q = durch(e, f);
      if (!istBruch(q) || q[1] > 30 || ggt(e[0], f[0]) < 2) return null;
      return rechneB(`Berechne ${T(e)} : ${T(f)} und kürze vollständig.`, q, [[mal(e, f), 'bruch-kehrwert'], [durch(f, e), 'bruch-kehrwert']], h1('Wandle beide Zahlen in unechte Brüche um und kürze über Kreuz.'), [`${T(e)} : ${T(f)} = ${T(q)}`]); },
    () => { const z = echt([2, 3, 4, 5, 6]), s = gz([6, 8, 9, 10, 12, 15], [2, 4]), q = durch(s, z), wer = wahl(['Eine Radfahrerin', 'Ein Läufer', 'Ein Boot']);
      if (!istBruch(q) || q[1] > 12) return null;
      return rechneB(`${wer} legt in ${B2(z)} h eine Strecke von ${T(s)} km zurück. Wie viele Kilometer wären das bei gleichem Tempo in einer ganzen Stunde? Kürze vollständig.`, q, [[mal(s, z), 'bruch-kehrwert'], [s, 'sach-schritt-vergessen']],
        h1('Die Strecke gehört zu einem Bruchteil der Stunde. Dividiere sie durch diesen Bruchteil.'), [`${T(s)} km : ${B2(z)} = ${T(q)} km`], { einheit: 'km' }); },
    () => { const c = echt([4, 8]), k = zz(4, 12), weg = echt([2, 4]), voll = plus(mal(ganz(k), c), weg), was = wahl(['Saft', 'Sirup', 'Öl']);
      if (!istBruch(voll) || voll[0] < voll[1] || c[0] === 1) return null;
      return zahl(`In einem Kanister sind ${T(voll)} l ${was}. Davon werden ${B2(weg)} l sofort verbraucht. Der Rest wird in Flaschen mit je ${B2(c)} l gefüllt. Wie viele Flaschen werden voll?`, k, fehlerliste(k, [[k + 1, 'sach-schritt-vergessen'], [k - 1, 'sach-schritt-vergessen'], [Math.floor(voll[0] / voll[1]), 'sach-frage-verfehlt']]),
        h1('Berechne zuerst den Rest. Wie oft passt dann der Inhalt einer Flasche hinein?'), { nachweis: [`(${T(voll)} l − ${B2(weg)} l) : ${B2(c)} l = ${k}`] }); },
    () => auswahl('Eine Menge wird in gleich große Portionen abgefüllt. Die Portionen werden jetzt nur noch halb so groß gewählt. Was passiert mit der Anzahl der Portionen?', mische([opt('Sie verdoppelt sich.', true), opt('Sie halbiert sich.', false, 'mal-macht-groesser'), opt('Sie bleibt gleich.', false, 'anteil-nicht-beachtet'), opt('Sie wird um eine Portion größer.', false, '1x1-addiert'), opt('Das hängt von der Menge ab.', false, 'anteil-nicht-beachtet')]),
      h1('Dividieren durch die Hälfte einer Zahl: Was bedeutet das für den Kehrwert?'), { nachweis: [FREI('Halber Divisor, doppelter Quotient')] }),
    () => { const f = gz([1, 2], [2, 3, 4, 5]), q = gz([1, 2, 3], [2, 3, 4, 5, 6]), e = mal(f, q);
      if (!istBruch(e) || e[1] > 30) return null;
      return rechneB(`Eine Zahl wird durch ${T(f)} dividiert. Das Ergebnis ist ${T(q)}. Wie heißt die Zahl? Kürze vollständig.`, e, [[durch(q, f), 'probe-falsche-umkehr'], [durch(f, q), 'probe-falsche-umkehr']], h1('Mache die Division mit der Umkehraufgabe rückgängig.'), [`${T(q)} · ${T(f)} = ${T(e)}`]); },
    () => gleichungen(5, (stimmt) => { const e = gz([1, 2, 3, 4], [2, 3, 4, 5]), f = gz([0, 1], [2, 3, 4, 5, 6]), q = durch(e, f), x = stimmt ? q : wahl([mal(e, f), durch(f, e), plus(q, [1, 1])]);
      return !istBruch(x) || !istBruch(q) || gleich(x, q) !== stimmt || q[1] > 30 || gleich(e, f) ? null : `${T(e)} : ${T(f)} = ${T(x)}`; }, 'bruch-kehrwert', h1('Überschlage mit den Ganzen und prüfe, ob der Divisor über oder unter 1 liegt. Rechne dann genau nach.')),
    () => { const e = gz([2, 3, 4, 5], [2, 4]), f = gz([1], [2, 3, 4]), c = echt([3, 4, 5, 6]), q = durch(durch(e, f), c);
      if (!istBruch(q) || q[1] > 30) return null;
      return rechneB(`Berechne ${T(e)} : ${T(f)} : ${B2(c)} und kürze vollständig.`, q, [[durch(e, durch(f, c)), 'klammer-falsch-gesetzt'], [durch(e, f), 'sach-schritt-vergessen']], h1('Rechne von links nach rechts. Jede Zahl hinter einem Geteiltzeichen wird zum Kehrwert.'), [`${T(e)} : ${T(f)} : ${B2(c)} = ${T(q)}`]); },
    () => { const d = gz([1, 2, 3], [2, 4]), k = zz(4, 9), h = mal(ganz(k), d), ding = wahl(['Brettern', 'Büchern', 'Platten']);
      if (!istBruch(h)) return null;
      return zahl(`Ein Stapel aus gleich dicken ${ding} ist ${T(h)} cm hoch. Jedes Teil ist ${T(d)} cm dick. Aus wie vielen Teilen besteht der Stapel?`, k, fehlerliste(k, [[k + 1, 'sach-schritt-vergessen'], [k - 1, 'sach-schritt-vergessen'], [Math.floor(h[0] / h[1]), 'sach-frage-verfehlt']]),
        h1('Wie oft passt die Dicke eines Teils in die Höhe des Stapels?'), { nachweis: [`${T(h)} cm : ${T(d)} cm = ${k}`] }); },
    () => { const a = echt([3, 4, 5, 6, 8]), s = gz([2, 3, 4, 5, 6], [2, 4, 5]), q = durch(s, a);
      if (!istBruch(q) || q[1] > 12 || a[0] === 1) return null;
      return rechneB(`${B2(a)} einer Wanderstrecke sind ${T(s)} km. Wie lang ist die ganze Strecke? Kürze vollständig.`, q, [[mal(s, a), 'bruch-kehrwert'], [plus(s, mal(s, minus([1, 1], a))), 'anteil-nicht-beachtet']],
        h1('Bekannt ist ein Bruchteil der Strecke. Zum Ganzen kommst du mit der Umkehrung von „mal“.'), [`${T(s)} km : ${B2(a)} = ${T(q)} km`], { einheit: 'km' }); },
    () => { const e = gz([2, 3, 4, 5], [2, 3, 4]), c = echt([3, 4, 5, 6, 8]);
      return auswahl(`Ohne zu rechnen: Was gilt für das Ergebnis von ${T(e)} : ${B2(c)}?`, mische([opt(`Es ist größer als ${T(e)}, denn der Divisor ist kleiner als eins.`, false), opt('Es ist größer als die erste Zahl, denn der Divisor ist kleiner als eins.', true), opt('Es ist kleiner als die erste Zahl, denn Dividieren verkleinert.', false, 'mal-macht-groesser'), opt('Es ist kleiner als eins, denn der Divisor ist ein Bruch.', false, 'mal-macht-groesser'), opt('Es ist genauso groß wie die erste Zahl.', false, 'mal-macht-groesser')]).filter((o) => !/\d/.test(o.text)),
        h1('Frage dich, wie oft der Divisor in ein einziges Ganzes passt.'), { nachweis: [FREI('Plausibilität beim Dividieren durch einen echten Bruch'), { wert: T(e), grund: 'Zahl der Aufgabe' }, { wert: B2(c), grund: 'Zahl der Aufgabe' }] }); },
    () => { const e = gz([1, 2, 3], [2, 4, 8]), f = gz([1], [2, 4, 8]), q = durch(e, f);
      if (!istBruch(q) || gleich(e, f) || q[1] > 20) return null;
      return rechneB(`Im Zähler eines Doppelbruchs steht ${T(e)}, im Nenner steht ${T(f)}. Welchen Wert hat der Doppelbruch? Kürze vollständig.`, q, [[mal(e, f), 'bruch-kehrwert'], [durch(f, e), 'bruch-kehrwert']], h1('Der große Bruchstrich bedeutet geteilt. Wandle zuerst beide gemischten Zahlen um.'), [`${T(e)} : ${T(f)} = ${T(q)}`]); },
    () => { const a = echt([3, 4, 5, 6]), z = gz([1, 2, 3], [2, 4]), q = durch(z, a), was = wahl(['Videos', 'Musik', 'Spiele']);
      if (!istBruch(q) || q[1] > 12 || a[0] === 1) return null;
      return rechneB(`${B2(a)} einer Akkuladung reichen für ${T(z)} h ${was}. Wie viele Stunden reicht ein voller Akku bei gleichem Verbrauch? Kürze vollständig.`, q, [[mal(z, a), 'bruch-kehrwert'], [z, 'sach-schritt-vergessen']],
        h1('Bekannt ist die Zeit für einen Bruchteil der Ladung. Dividiere durch diesen Bruchteil.'), [`${T(z)} h : ${B2(a)} = ${T(q)} h`], { einheit: 'h' }); },
  ]);
}
