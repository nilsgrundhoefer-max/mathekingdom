// Aufgaben zu 6.2.5 „Brüche multiplizieren“ (Lernziele P1, P2) nach ADR 0015 und ADR 0038.
// P1: Brüche miteinander multiplizieren, vorher kürzen. P2: Bruchteil von einem Bruchteil, Sachaufgaben.
// Grilling mit Nils (2026-11-24): Auf F und G zeigt ein Rechteckbild das Produkt: Hell gefärbt ist der zweite Bruch, kräftig gefärbt der
// Bruchteil davon. Typische Fehler: wie beim Addieren rechnen (gleichnamig machen, nur die Zähler malnehmen oder addieren), gemischte
// Zahlen getrennt malnehmen, „Malnehmen macht größer“.

import { sechs, auswahl, luecken, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, NB, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, mal, plus, minus, durch, T, echt, rechneB, optionen, urteil, VGL, ZEICHEN, akku, rechteckbild, istBruch, gleich } from './6-2-rechnen.mjs';

const P1 = '6.2.5-P1', P2 = '6.2.5-P2';
const B2 = (q) => br(q[0], q[1]);
// a · c mit zwei gekürzten echten Brüchen. felder: höchstens so viele Felder im Rechteckbild (Nenner mal Nenner).
const paar = (nenner, passt = () => true, felder = 1000) => { for (let i = 0; i < 1500; i++) { const a = echt(nenner), c = echt(nenner), p = mal(a, c), roh = [a[0] * c[0], a[1] * c[1]]; if (a[1] * c[1] <= felder && a[1] <= 5 + (felder > 20 ? 100 : 0) && passt(a, c, p, roh)) return { a, c, p, roh }; } return null; };
const fremd = (a, c, p, roh) => ggt(roh[0], roh[1]) === 1;
const kuerzbar = (a, c, p, roh) => ggt(roh[0], roh[1]) > 1;
const gz = (ganze, nenner) => { const a = echt(nenner), g = wahl(ganze); return [g * a[1] + a[0], a[1]]; };
const getrennt = (e, f) => { const ge = Math.floor(e[0] / e[1]), gf = Math.floor(f[0] / f[1]), re = [e[0] % e[1], e[1]], rf = [f[0] % f[1], f[1]]; return plus([ge * gf, 1], re[0] && rf[0] ? mal(re, rf) : re[0] ? re : rf); };
const NF = [2, 3, 4, 5];

export function multiplizieren() {
  // ================= P1: Bruch mal Bruch =================
  const tP = h3('Zähler mal Zähler und Nenner mal Nenner.', `${br(1, 2)} · ${br(3, 4)} = ${br(3, 8)}, denn 1 · 3 = 3 und 2 · 4 = 8.`, 'Rechne zuerst die Zähler mal. Rechne dann die Nenner mal.');
  sechs(P1, 'F', [
    () => { const { a, c, roh } = paar(NF, (x, y) => x[1] !== y[1], 20);
      return luecken(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, 'Zähle die kräftig gefärbten Felder.', `${B2(a)} · ${B2(c)} = {{a}}⁄${roh[1]}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + c[0], 'bruch-mal-wie-plus'], [c[0] * a[1], 'bruch-teil-zu-rest']])] },
        h3('Das Rechteck hat so viele Felder wie Nenner mal Nenner.', `${br(1, 2)} · ${br(3, 4)} = ${br(3, 8)}. Von 8 Feldern sind 3 kräftig gefärbt.`, 'Zähle nur die kräftig gefärbten Felder.'), { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))] }); },
    () => { const { a, c, p, roh } = paar(NF, fremd, 20);
      return rechneB(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Rechne ${B2(a)} · ${B2(c)}.`), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']], tP, [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
    () => { const { a, c, p, roh } = paar(NF, (x, y, pp, r) => fremd(x, y, pp, r) && x[0] === 1 && y[0] === 1, 20);
      return auswahl(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Wie viel ist ${B2(a)} · ${B2(c)}?`), optionen(p, [[[2, a[1] + c[1]], 'bruch-mal-wie-plus'], [[1, a[1] + c[1]], 'bruch-mal-wie-plus']], B2), tP,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, WERT(B2(p)), NB(B2(roh))] }); },
    () => { const { a, c, roh } = paar(NF, (x, y) => x[0] > 1 || y[0] > 1, 20);
      return luecken(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, 'Rechne Zähler mal Zähler und Nenner mal Nenner.', `${B2(a)} · ${B2(c)} = {{a}}⁄{{b}}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + c[0], 'bruch-mal-wie-plus']])], b: [roh[1], fehlerliste(roh[1], [[a[1] + c[1], 'bruch-mal-wie-plus'], [Math.max(a[1], c[1]), 'bruch-mal-wie-plus']])] }, tP,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh)), { art: 'teil', bruch: B2(roh), was: 'zaehler', zahl: roh[0] }, { art: 'teil', bruch: B2(roh), was: 'nenner', zahl: roh[1] }] }); },
    () => { const { a, c, p, roh } = paar(NF, (x, y, pp, r) => fremd(x, y, pp, r) && x[0] > 1 && y[0] > 1, 20);
      return rechneB(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Rechne ${B2(a)} · ${B2(c)}.`), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']], tP, [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
    () => { const { a, c, p, roh } = paar(NF, kuerzbar, 20);
      return rechneB(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Rechne ${B2(a)} · ${B2(c)}.`, 'Kürze das Ergebnis.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']],
        h3('Rechne zuerst mal. Kürze dann das Ergebnis.', `${br(2, 3)} · ${br(3, 4)} = ${br(6, 12)}. Gekürzt ist das ${br(1, 2)}.`, `Das Ergebnis heißt zuerst ${B2(roh)}. Teile Zähler und Nenner durch dieselbe Zahl.`), [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
  ]);
  const NG = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const tG = h3('Zähler mal Zähler und Nenner mal Nenner. Kürze am Ende.', `${br(3, 4)} · ${br(2, 5)} = ${br(6, 20)} = ${br(3, 10)}.`, 'Schreibe zuerst das Ergebnis ohne Kürzen. Kürze dann so weit wie möglich.');
  sechs(P1, 'G', [
    () => { const { a, c, p, roh } = paar(NF, kuerzbar, 20);
      return rechneB(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Rechne ${B2(a)} · ${B2(c)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']], tG, [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
    () => { const { a, c, roh } = paar(NF, (x, y) => x[0] > 1 && y[0] > 1 && x[1] !== y[1], 20);
      return luecken(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `${B2(a)} · ${B2(c)} = {{a}}⁄{{b}}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + c[0], 'bruch-mal-wie-plus']])], b: [roh[1], fehlerliste(roh[1], [[a[1] + c[1], 'bruch-mal-wie-plus'], [Math.max(a[1], c[1]), 'bruch-mal-wie-plus']])] }, tG,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh)), { art: 'teil', bruch: B2(roh), was: 'zaehler', zahl: roh[0] }, { art: 'teil', bruch: B2(roh), was: 'nenner', zahl: roh[1] }] }); },
    () => { const { a, c, roh } = paar(NG.filter((x) => x <= 7), (x, y, pp, r) => fremd(x, y, pp, r) && y[0] > 1 && x[0] > 1);
      return luecken(Z('Welcher Zähler fehlt?', `${B2(a)} · {{a}}⁄${c[1]} = ${B2(roh)}`), { a: [c[0], fehlerliste(c[0], [[roh[0] - a[0], 'bruch-mal-wie-plus'], [roh[0], 'sach-frage-verfehlt']])] },
        h3('Zähler mal Zähler ergibt den neuen Zähler.', `${br(2, 3)} · ${br(4, 5)} = ${br(8, 15)}, denn 2 · 4 = 8.`, `Rechne ${roh[0]} : ${a[0]}.`), { nachweis: [`${B2(roh)} : ${B2(a)} = ${B2(c)}`, { art: 'teil', bruch: B2(c), was: 'zaehler', zahl: c[0] }] }); },
    () => { const { a, c, p, roh } = paar(NG, (x, y, pp, r) => ggt(x[0], y[1]) > 1 && ggt(y[0], x[1]) > 1 && r[1] <= 60);
      return rechneB(Z(`Rechne ${B2(a)} · ${B2(c)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']],
        h3('Du darfst vor dem Malnehmen kürzen: einen Zähler mit einem Nenner.', `${br(3, 4)} · ${br(2, 9)}: Kürze 3 mit 9 und 2 mit 4. Dann bleibt ${br(1, 2)} · ${br(1, 3)} = ${br(1, 6)}.`, `Kürze ${a[0]} mit ${c[1]} und ${c[0]} mit ${a[1]}. Rechne dann mal.`), [`${B2(a)} · ${B2(c)} = ${B2(p)}`]); },
    () => { const a = echt([2, 3, 4]), c = echt([3, 4, 5]), e = echt([4, 5, 6]), p = mal(mal(a, c), e);
      if (new Set([a[1], c[1], e[1]]).size < 3 || a[1] * c[1] * e[1] > 60) return null;
      return rechneB(Z(`Rechne ${B2(a)} · ${B2(c)} · ${B2(e)}.`, 'Kürze das Ergebnis vollständig.'), p, [[[a[0] + c[0] + e[0], a[1] + c[1] + e[1]], 'bruch-mal-wie-plus'], [mal(a, c), 'sach-schritt-vergessen']],
        h3('Auch bei drei Brüchen: alle Zähler mal, alle Nenner mal.', `${br(1, 2)} · ${br(2, 3)} · ${br(3, 4)} = ${br(6, 24)} = ${br(1, 4)}.`, `Rechne ${a[0]} · ${c[0]} · ${e[0]} für den Zähler. Rechne ${a[1]} · ${c[1]} · ${e[1]} für den Nenner.`), [`${B2(a)} · ${B2(c)} · ${B2(e)} = ${B2(p)}`]); },
    () => { const n = wahl([3, 4]), a = echt([n]), c = echt([n]), roh = [a[0] * c[0], n * n], falle = [a[0] * c[0], n], kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} · ${B2(c)} = ${T(x)}`;
      if (ggt(roh[0], roh[1]) > 1 || a[0] * c[0] === n || gleich(falle, [a[0] + c[0], n])) return null;
      return urteil(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `${kn} rechnet: ${g(stimmt ? roh : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? roh : falle), g(stimmt ? falle : roh), [g([a[0] + c[0], n])], 'bruch-mal-wie-plus',
        h3('Beim Malnehmen bleibt der Nenner nicht gleich. Nenner mal Nenner.', `${br(1, 3)} · ${br(2, 3)} = ${br(2, 9)}, denn 3 · 3 = 9.`, `Prüfe den Nenner: Rechne ${n} · ${n}.`), { bild: rechteckbild(a, c), nachweis: [NB(B2(roh))] }); },
  ]);
  const NM = [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20];
  sechs(P1, 'M', [
    () => { const { a, c, p } = paar(NM, (x, y, pp, r) => ggt(x[0], y[1]) > 1 && ggt(y[0], x[1]) > 1 && x[1] >= 8 && y[1] >= 8);
      return rechneB(`Berechne ${B2(a)} · ${B2(c)} und kürze vollständig.`, p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[a[0] * c[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']],
        h2('Kürze vor dem Multiplizieren über Kreuz: einen Zähler mit einem Nenner.', `Kürze ${a[0]} und ${c[1]} mit ${ggt(a[0], c[1])} sowie ${c[0]} und ${a[1]} mit ${ggt(c[0], a[1])}. Multipliziere dann.`), [`${B2(a)} · ${B2(c)} = ${B2(p)}`]); },
    () => { const e = gz([1, 2, 3], [2, 3, 4, 5]), f = gz([1, 2], [2, 3, 4, 5, 6]), p = mal(e, f);
      if (!istBruch(p) || gleich(e, f)) return null;
      return rechneB(`Berechne ${T(e)} · ${T(f)} und kürze vollständig.`, p, [[getrennt(e, f), 'gemischt-getrennt-mal'], [[e[0] * f[0], Math.max(e[1], f[1])], 'bruch-mal-wie-plus']],
        h2('Wandle beide gemischten Zahlen zuerst in Brüche um.', `${T(e)} = ${B2(e)} und ${T(f)} = ${B2(f)}. Kürze, multipliziere und wandle das Ergebnis wieder um.`), [`${T(e)} · ${T(f)} = ${T(p)}`]); },
    () => { const a = echt([3, 4, 5, 6]), c = echt([4, 5, 6, 8]), e = echt([5, 6, 9, 10]), p = mal(mal(a, c), e);
      if (new Set([a[1], c[1], e[1]]).size < 3 || ggt(a[0] * c[0] * e[0], a[1] * c[1] * e[1]) < 4) return null;
      return rechneB(`Berechne ${B2(a)} · ${B2(c)} · ${B2(e)} und kürze vollständig.`, p, [[mal(a, c), 'sach-schritt-vergessen'], [[a[0] + c[0] + e[0], a[1] + c[1] + e[1]], 'bruch-mal-wie-plus']],
        h2('Schreibe alle Zähler und alle Nenner auf einen gemeinsamen Bruchstrich.', `Über dem Strich steht ${a[0]} · ${c[0]} · ${e[0]}, darunter ${a[1]} · ${c[1]} · ${e[1]}. Kürze dort, bevor du rechnest.`), [`${B2(a)} · ${B2(c)} · ${B2(e)} = ${B2(p)}`]); },
    () => { const e = gz([1, 2, 3], [2, 3, 4, 5, 6]), a = echt([3, 4, 5, 6, 8, 9]), p = mal(e, a);
      if (!istBruch(p) || ggt(e[0], a[1]) === 1) return null;
      return rechneB(`Berechne ${T(e)} · ${B2(a)} und kürze vollständig.`, p, [[plus([Math.floor(e[0] / e[1]), 1], mal([e[0] % e[1], e[1]], a)), 'gemischt-getrennt-mal'], [[e[0] * a[0], Math.max(e[1], a[1])], 'bruch-mal-wie-plus']],
        h2('Wandle die gemischte Zahl zuerst in einen Bruch um.', `${T(e)} = ${B2(e)}. Kürze ${e[0]} mit ${a[1]}, bevor du multiplizierst.`), [`${T(e)} · ${B2(a)} = ${T(p)}`]); },
    () => { const a = echt([3, 4, 5, 6, 8]), c = wahl([echt([3, 4, 5, 6, 7]), gz([1], [3, 4, 5, 6])]), p = mal(a, c);
      return auswahl(`Welches Zeichen passt? ${B2(a)} · ${T(c)} ▢ ${B2(a)}`, ZEICHEN(c[0] - c[1], 'mal-macht-groesser'), h2('Du musst nicht rechnen. Schau dir den zweiten Faktor an.', `Ist ${T(c)} kleiner oder größer als 1? Davon hängt ab, ob das Produkt kleiner oder größer als ${B2(a)} ist.`), { nachweis: [VGL(`${B2(a)} · ${T(c)}`, B2(a))] }); },
    () => auswahl('Du multiplizierst eine Zahl mit einem Bruch, der kleiner als 1 ist. Was gilt für das Ergebnis?', mische([opt('Es ist kleiner als die Zahl, denn du nimmst nur einen Teil von ihr.', true), opt('Es ist größer als die Zahl, denn Multiplizieren vergrößert immer.', false, 'mal-macht-groesser'), opt('Es ist genauso groß wie die Zahl.', false, 'mal-macht-groesser'), opt('Das hängt vom Nenner des Bruchs ab.', false, 'bruch-nenner-groesse')]),
      h2('Denke an das Wort „von“.', 'Die Hälfte von einer Zahl ist weniger als die Zahl selbst. Das gilt für jeden Bruchteil unter 1.'), { nachweis: [FREI('Multiplizieren mit einem Bruch unter 1 verkleinert')] }),
  ]);
  const NE = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25];
  sechs(P1, 'E', [
    () => { const e = gz([1, 2, 3], [3, 4, 5, 6]), f = gz([1, 2], [4, 5, 6, 8]), a = echt([6, 8, 9, 10]), p = mal(mal(e, f), a);
      if (!istBruch(p) || p[1] > 60) return null;
      return rechneB(`Berechne ${T(e)} · ${T(f)} · ${B2(a)} und kürze vollständig.`, p, [[mal(e, f), 'sach-schritt-vergessen'], [mal(getrennt(e, f), a), 'gemischt-getrennt-mal']],
        h1('Wandle um, schreibe alles auf einen Bruchstrich und kürze, bevor du multiplizierst.'), [`${T(e)} · ${T(f)} · ${B2(a)} = ${T(p)}`]); },
    () => { const { a, c, p } = paar(NE.filter((x) => x <= 16), (x, y, pp) => ggt(x[0], y[1]) > 1 && ggt(y[0], x[1]) > 1 && pp[1] <= 30 && x[0] > 2);
      return luecken(`Welcher Zähler fehlt? {{a}}⁄${a[1]} · ${B2(c)} = ${B2(p)}`, { a: [a[0], fehlerliste(a[0], [[p[0], 'sach-frage-verfehlt'], [a[1] - a[0], 'bruch-teil-zu-rest'], [a[0] * c[0], 'sach-schritt-vergessen']])] },
        h1(`Dividiere das Ergebnis durch ${B2(c)}, oder erweitere das Ergebnis auf den Nenner ${a[1] * c[1]}.`), { nachweis: [`${B2(p)} : ${B2(c)} = ${B2(a)}`, { art: 'teil', bruch: B2(a), was: 'zaehler', zahl: a[0] }] }); },
    () => { const a = echt([3, 4, 5, 6]), e = gz([1, 2, 3, 4], [2, 3, 4, 5, 6]), p = mal(a, e), g = Math.round(p[0] / p[1]) || 1;
      return auswahl(`Welches Zeichen passt? ${B2(a)} · ${T(e)} ▢ ${g}`, ZEICHEN(p[0] - g * p[1], 'gemischt-getrennt-mal'), h1('Wandle die gemischte Zahl um und kürze. Vergleiche das Produkt dann mit der Zahl rechts.'), { nachweis: [VGL(`${B2(a)} · ${T(e)}`, String(g))] }); },
    () => auswahl('Zwei echte Brüche werden miteinander multipliziert. Was gilt immer für das Produkt?', mische([opt('Es ist kleiner als jeder der beiden Brüche.', true), opt('Es ist größer als jeder der beiden Brüche.', false, 'mal-macht-groesser'), opt('Es liegt zwischen den beiden Brüchen.', false, 'mal-macht-groesser'), opt('Es ist größer als der kleinere und kleiner als die Summe der beiden Brüche.', false, 'mal-macht-groesser'), opt('Darüber lässt sich nichts sagen.', false, 'mal-macht-groesser')]),
      h1('Ein echter Bruch ist kleiner als 1. Was passiert mit einer Zahl, von der du nur einen Bruchteil nimmst?'), { nachweis: [FREI('Produkt echter Brüche ist kleiner als beide Faktoren')] }),
    () => { const a = echt([3, 4, 5, 6, 7, 8, 9]), k = durch([1, 1], a);
      if (a[0] === 1) return null;
      return rechneB(`Mit welcher Zahl musst du ${B2(a)} multiplizieren, um genau 1 zu erhalten?`, k, [[minus([1, 1], a), 'add-subtrahiert'], [a, 'sach-frage-verfehlt']],
        h1('Im Produkt muss sich alles wegkürzen. Welcher Bruch hat den Zähler und den Nenner dafür genau passend?'), [`1 : ${B2(a)} = ${T(k)}`]); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const e = gz([0, 1, 2], [2, 3, 4, 5, 6]), f = gz([0, 1], [3, 4, 5, 6, 8]), p = mal(e, f), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? p : wahl([getrennt(e, f), kz([e[0] * f[0], Math.max(e[1], f[1])]), plus(p, [1, p[1]])]);
        if (gleich(x, p) !== stimmt || !istBruch(x) || !istBruch(p) || gleich(e, f) || (e[0] < e[1] && f[0] < f[1] && i % 2 === 0)) return null;
        const t = `${T(e)} · ${T(f)} = ${T(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-getrennt-mal')), h1('Überschlage zuerst: Ist ein Faktor kleiner als 1, muss das Produkt kleiner sein als der andere Faktor.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);

  // ================= P2: Bruchteil von einem Bruchteil =================
  const tV = h3('Das Wort „von“ bedeutet mal.', `${br(1, 2)} von ${br(3, 4)} ist ${br(1, 2)} · ${br(3, 4)} = ${br(3, 8)}.`, 'Schreibe die Malaufgabe auf. Rechne Zähler mal Zähler und Nenner mal Nenner.');
  sechs(P2, 'F', [
    () => { const { a, c, roh } = paar(NF, (x, y) => x[1] !== y[1], 20);
      return luecken(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Wie viel ist ${B2(a)} von ${B2(c)}?`, `${B2(a)} · ${B2(c)} = {{a}}⁄${roh[1]}`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + c[0], 'bruch-mal-wie-plus'], [c[0] * a[1], 'bruch-teil-zu-rest']])] }, tV,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))] }); },
    () => { const { a, c, p, roh } = paar(NF, (x, y, pp, r) => fremd(x, y, pp, r) && x[0] === 1, 20), kn = kind();
      return rechneB(Z(`Vom Blechkuchen ist noch ${B2(c)} da.`, `${kn} isst ${B2(a)} davon.`, `Welchen Bruchteil vom ganzen Kuchen isst ${kn}?`), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [c, 'sach-frage-verfehlt']],
        h3('Das Wort „davon“ bedeutet mal.', `Vom Kuchen ist ${br(1, 2)} da. Mia isst ${br(1, 2)} davon. Das ist ${br(1, 2)} · ${br(1, 2)} = ${br(1, 4)} vom ganzen Kuchen.`, `Rechne ${B2(a)} · ${B2(c)}.`), [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
    () => { const { a, c, p, roh } = paar(NF, (x, y, pp, r) => fremd(x, y, pp, r) && x[0] === 1 && y[0] === 1, 20);
      return auswahl(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Wie viel ist ${B2(a)} von ${B2(c)}?`), optionen(p, [[[2, a[1] + c[1]], 'bruch-mal-wie-plus'], [[1, a[1] + c[1]], 'bruch-mal-wie-plus']], B2), tV,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, WERT(B2(p)), NB(B2(roh))] }); },
    () => { const { a, c, p, roh } = paar(NF, (x, y, pp, r) => fremd(x, y, pp, r) && y[0] > 1, 20), was = wahl(['Tomaten', 'Erdbeeren', 'Bohnen', 'Kürbisse']);
      return rechneB(Z(`${B2(c)} vom Garten sind Beete.`, `Auf ${B2(a)} davon wachsen ${was}.`, `Auf welchem Bruchteil vom ganzen Garten wachsen ${was}?`), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [c, 'sach-frage-verfehlt']],
        h3('Das Wort „davon“ bedeutet mal.', `${br(3, 4)} sind Beete. Auf ${br(1, 2)} davon wachsen Bohnen. Das ist ${br(1, 2)} · ${br(3, 4)} = ${br(3, 8)} vom Garten.`, `Rechne ${B2(a)} · ${B2(c)}.`), [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
    () => { const [a, c] = wahl([[[1, 2], [3, 5]], [[1, 3], [4, 5]], [[2, 3], [4, 5]], [[1, 2], [3, 4]], [[1, 3], [2, 5]], [[1, 2], [1, 4]]]), p = mal(a, c), was = wahl(['Ein Spiel', 'Ein Video', 'Ein Anruf']);
      return rechneB(Z(`Der Akku ist zu ${B2(c)} voll.`, `${was} verbraucht ${B2(a)} davon.`, 'Welcher Bruchteil vom ganzen Akku ist das?'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [a, 'sach-frage-verfehlt']],
        h3('Verbraucht wird nur ein Teil von dem, was noch da ist.', `Der Akku ist zu ${br(1, 2)} voll. Ein Spiel verbraucht ${br(1, 2)} davon. Das ist ${br(1, 2)} · ${br(1, 2)} = ${br(1, 4)} vom ganzen Akku.`, `Rechne ${B2(a)} · ${B2(c)}.`), [`${B2(a)} · ${B2(c)} = ${B2(p)}`], { bild: bild(akku(...c)) }); },
    () => { const { a, c, p, roh } = paar(NF, kuerzbar, 20);
      return rechneB(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `Wie viel ist ${B2(a)} von ${B2(c)}?`, 'Kürze das Ergebnis.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [[roh[0], Math.max(a[1], c[1])], 'bruch-mal-wie-plus']],
        h3('Rechne zuerst mal. Kürze dann das Ergebnis.', `${br(2, 3)} von ${br(3, 4)} ist ${br(2, 3)} · ${br(3, 4)} = ${br(6, 12)} = ${br(1, 2)}.`, `Das Ergebnis heißt zuerst ${B2(roh)}. Teile Zähler und Nenner durch dieselbe Zahl.`), [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh))], { bild: rechteckbild(a, c) }); },
  ]);
  const tVG = h3('Das Wort „davon“ bedeutet mal. Kürze am Ende.', `${br(2, 3)} von ${br(3, 4)} l sind ${br(2, 3)} · ${br(3, 4)} l = ${br(6, 12)} l = ${br(1, 2)} l.`, 'Schreibe die Malaufgabe auf. Kürze vor oder nach dem Malnehmen.');
  sechs(P2, 'G', [
    () => { const { a, c, p, roh } = paar(NF, (x, y) => true, 20), kn = kind(), was = wahl(['Milch', 'Sahne', 'Saft']);
      return rechneB(Z(`Im Krug ist ${B2(c)} l ${was}.`, `${kn} braucht ${B2(a)} davon.`, `Wie viel Liter braucht ${kn}?`, 'Kürze das Ergebnis vollständig.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [c, 'sach-frage-verfehlt']], tVG, [`${B2(a)} · ${B2(c)} l = ${B2(p)} l`, NB(B2(roh))], { einheit: 'l', bild: rechteckbild(a, c) }); },
    () => { const { a, c, roh } = paar(NF, (x, y) => x[0] > 1 && y[0] > 1 && x[1] !== y[1], 20);
      return luecken(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `${B2(a)} von ${B2(c)} ist {{a}}⁄{{b}}.`), { a: [roh[0], fehlerliste(roh[0], [[a[0] + c[0], 'bruch-mal-wie-plus']])], b: [roh[1], fehlerliste(roh[1], [[a[1] + c[1], 'bruch-mal-wie-plus'], [Math.max(a[1], c[1]), 'bruch-mal-wie-plus']])] }, tVG,
        { bild: rechteckbild(a, c), nachweis: [`${B2(a)} · ${B2(c)} = ${B2(roh)}`, NB(B2(roh)), { art: 'teil', bruch: B2(roh), was: 'zaehler', zahl: roh[0] }, { art: 'teil', bruch: B2(roh), was: 'nenner', zahl: roh[1] }] }); },
    () => { const { a, c, p } = paar([2, 3, 4, 5, 10], (x, y, pp, r) => kuerzbar(x, y, pp, r) && y[1] >= 4 && y[0] * 2 > y[1]), kn = kind();
      return rechneB(Z(`Der Schulweg von ${kn} ist ${B2(c)} km lang.`, `${B2(a)} davon fährt ${kn} mit dem Bus.`, 'Wie viele Kilometer sind das?', 'Kürze das Ergebnis vollständig.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [minus(c, p), 'sach-frage-verfehlt']], tVG, [`${B2(a)} · ${B2(c)} km = ${B2(p)} km`], { einheit: 'km' }); },
    () => { const [a, c] = wahl([[[1, 3], [3, 4]], [[2, 3], [3, 4]], [[1, 2], [3, 4]], [[1, 3], [1, 2]], [[1, 2], [1, 2]], [[3, 4], [1, 2]], [[2, 5], [3, 4]], [[1, 4], [1, 2]]]), p = mal(a, c), [was, teil] = wahl([['Das Training', 'Aufwärmen'], ['Die Probe', 'Einsingen'], ['Der Schwimmkurs', 'Tauchen']]);
      return rechneB(Z(`${was} dauert ${B2(c)} h.`, `${B2(a)} davon ist ${teil}.`, `Wie lange dauert das ${teil}?`, 'Gib das Ergebnis als Bruchteil einer Stunde an.'), p, [[[a[0] + c[0], a[1] + c[1]], 'bruch-mal-wie-plus'], [minus(c, p), 'sach-frage-verfehlt']], tVG, [`${B2(a)} · ${B2(c)} h = ${B2(p)} h`], { einheit: 'h' }); },
    () => { const { a, c, p } = paar(NG.filter((x) => x <= 6), (x, y, pp, r) => kuerzbar(x, y, pp, r) && y[0] > 1), rest = minus(c, p);
      if (rest[1] > 20) return null;
      return rechneB(Z(`Vom Kuchen ist noch ${B2(c)} da.`, `Die Gäste essen ${B2(a)} davon.`, 'Welcher Bruchteil vom ganzen Kuchen bleibt übrig?', 'Kürze das Ergebnis vollständig.'), rest, [[p, 'sach-schritt-vergessen'], [minus([1, 1], a), 'sach-falsche-rechnung']],
        h3('Rechne zuerst aus, wie viel gegessen wird. Ziehe das dann ab.', `Es ist ${br(3, 4)} da, ${br(1, 3)} davon wird gegessen. Das ist ${br(1, 4)}. Übrig bleibt ${br(3, 4)} − ${br(1, 4)} = ${br(1, 2)}.`, `Rechne zuerst ${B2(a)} · ${B2(c)}. Ziehe das Ergebnis von ${B2(c)} ab.`), [`${B2(a)} · ${B2(c)} = ${B2(p)}`, `${B2(c)} − ${B2(p)} = ${B2(rest)}`]); },
    () => { const { a, c, roh } = paar([2, 3, 4], (x, y, pp, r) => fremd(x, y, pp, r) && x[1] + y[1] !== r[1], 16), falle = [a[0] + c[0], a[1] + c[1]], kn = kind(), stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} · ${B2(c)} = ${B2(x)}`;
      if (gleich(falle, roh)) return null;
      return urteil(Z(`Gefärbt ${c[0] === 1 ? "ist" : "sind"} ${B2(c)} vom Rechteck.`, `Kräftig gefärbt ${a[0] === 1 ? "ist" : "sind"} ${B2(a)} davon.`, `${kn} rechnet: ${g(stimmt ? roh : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? roh : falle), g(stimmt ? falle : roh), [g([roh[0], Math.max(a[1], c[1]) + 1])], 'bruch-mal-wie-plus',
        h3('Bei „von“ wird malgenommen, nicht zusammengezählt.', `${br(1, 2)} von ${br(1, 3)} ist ${br(1, 2)} · ${br(1, 3)} = ${br(1, 6)}.`, 'Zähle die kräftig gefärbten Felder und alle Felder im Rechteck.'), { bild: rechteckbild(a, c), nachweis: [NB(B2(roh))] }); },
  ]);
  sechs(P2, 'M', [
    () => { const a = echt([3, 4, 5, 6]), e = gz([1, 2, 3, 4], [2, 3, 4, 5]), p = mal(a, e), kn = kind(), was = wahl(['Farbe', 'Saft', 'Wasser']);
      if (!istBruch(p) || ggt(a[1], e[0]) === 1) return null;
      return rechneB(`In einem Kanister sind ${T(e)} l ${was}. ${kn} verbraucht ${B2(a)} davon. Wie viel Liter verbraucht ${kn}? Kürze vollständig.`, p, [[minus(e, p), 'sach-frage-verfehlt'], [plus([Math.floor(e[0] / e[1]), 1], mal(a, [e[0] % e[1], e[1]])), 'gemischt-getrennt-mal']],
        h2('„Davon“ bedeutet mal. Wandle die gemischte Zahl vorher in einen Bruch um.', `Rechne ${B2(a)} · ${B2(e)}. Kürze ${a[1]} mit ${e[0]}.`), [`${B2(a)} · ${T(e)} l = ${T(p)} l`], { einheit: 'l' }); },
    () => { const a = echt([2, 3, 4]), c = echt([3, 4, 5]), e = echt([4, 5, 6, 8]), p = mal(mal(a, c), e);
      if (new Set([a[1], c[1], e[1]]).size < 3) return null;
      const text = wahl([
        `${B2(e)} der Kinder einer Schule sind in einem Verein. ${B2(c)} davon sind in einem Sportverein, und ${B2(a)} von diesen Kindern spielen Fußball. Welcher Bruchteil aller Kinder der Schule spielt im Verein Fußball?`,
        `${B2(e)} der Bücher einer Bücherei sind Romane. ${B2(c)} davon sind Krimis, und ${B2(a)} der Krimis sind ausgeliehen. Welcher Bruchteil aller Bücher sind ausgeliehene Krimis?`,
        `${B2(e)} der Fläche eines Parks sind Wiese. ${B2(c)} davon sind Spielwiese, und ${B2(a)} der Spielwiese liegen im Schatten. Welcher Bruchteil des Parks ist Spielwiese im Schatten?`]);
      return rechneB(`${text} Kürze vollständig.`, p, [[mal(c, e), 'sach-schritt-vergessen'], [mal(a, c), 'sach-schritt-vergessen']],
        h2('Jedes „davon“ ist eine weitere Multiplikation.', `Rechne ${B2(a)} · ${B2(c)} · ${B2(e)}. Schreibe alles auf einen Bruchstrich und kürze.`), [`${B2(a)} · ${B2(c)} · ${B2(e)} = ${B2(p)}`]); },
    () => { const a = echt([3, 4, 5]), e = gz([1, 2, 3], [2, 4, 5]), p = mal(a, e), rest = minus(e, p), was = wahl(['Mehl', 'Zucker', 'Reis']);
      if (!istBruch(rest) || rest[1] > 20) return null;
      return rechneB(`In einer Tüte sind ${T(e)} kg ${was}. ${B2(a)} des Inhalts werden verbraucht. Wie viel Kilogramm bleiben übrig? Kürze vollständig.`, rest, [[p, 'sach-schritt-vergessen'], [minus(e, a), 'sach-falsche-rechnung']],
        h2('Berechne zuerst, wie viel verbraucht wird. Oder überlege, welcher Bruchteil übrig bleibt.', `Übrig bleibt ${B2(minus([1, 1], a))} von ${T(e)} kg. Rechne ${B2(minus([1, 1], a))} · ${B2(e)}.`), [`${T(e)} kg − ${B2(a)} · ${T(e)} kg = ${T(rest)} kg`], { einheit: 'kg' }); },
    () => { const a = echt([3, 4, 5, 6, 8]), e = gz([1, 2, 3, 4], [2, 3, 4, 5]), p = mal(a, e);
      if (!istBruch(p) || p[1] > 30) return null;
      return rechneB(`Wie viel sind ${B2(a)} von ${T(e)} km? Kürze vollständig.`, p, [[plus([Math.floor(e[0] / e[1]), 1], mal(a, [e[0] % e[1], e[1]])), 'gemischt-getrennt-mal'], [minus(e, a), 'sach-falsche-rechnung']],
        h2('„Von“ bedeutet mal. Wandle die gemischte Zahl vorher in einen Bruch um.', `Rechne ${B2(a)} · ${B2(e)} und kürze.`), [`${B2(a)} · ${T(e)} km = ${T(p)} km`], { einheit: 'km' }); },
    () => { const { a, c, p } = paar([2, 3, 4, 5, 6], (x, y) => x[1] !== y[1]), v = wahl([[1, 2], [1, 3], [1, 4], p]);
      return auswahl(`Welches Zeichen passt? ${B2(a)} · ${B2(c)} ▢ ${B2(v)}`, ZEICHEN(p[0] * v[1] - v[0] * p[1], 'mal-macht-groesser'), h2('Berechne zuerst den Bruchteil vom Bruchteil.', `${B2(a)} · ${B2(c)} = ${B2(p)}. Bringe ${B2(p)} und ${B2(v)} auf denselben Nenner.`), { nachweis: [VGL(`${B2(a)} · ${B2(c)}`, B2(v))] }); },
    () => { const [k1, k2] = mische(['Mia', 'Tom', 'Lena', 'Ali', 'Ben', 'Mara']);
      return auswahl(`${k1} nimmt die Hälfte von einem Drittel einer Tafel Schokolade. ${k2} nimmt ein Drittel von der Hälfte einer gleich großen Tafel. Wer bekommt mehr?`, mische([opt('Beide bekommen gleich viel, denn die Faktoren dürfen vertauscht werden.', true), opt(`${k1} bekommt mehr, denn die Hälfte ist mehr als ein Drittel.`, false, 'mal-macht-groesser'), opt(`${k2} bekommt mehr, denn die Hälfte ist das größere Stück.`, false, 'mal-macht-groesser'), opt('Das lässt sich ohne die Größe der Tafel nicht sagen.', false, 'anteil-nicht-beachtet')]),
        h2('Schreibe beide Situationen als Multiplikation.', 'Einmal steht da ein Halb mal ein Drittel, einmal ein Drittel mal ein Halb.'), { nachweis: [FREI('Vertauschungsgesetz bei Bruchteilen von Bruchteilen')] }); },
  ]);
  sechs(P2, 'E', [
    () => { const a = echt([3, 4, 5]), c = echt([3, 4, 5, 6]), e = echt([5, 6, 8, 9]), p = mal(mal(a, c), e);
      if (new Set([a[1], c[1], e[1]]).size < 3 || ggt(a[0] * c[0] * e[0], a[1] * c[1] * e[1]) < 3) return null;
      return rechneB(`${B2(e)} eines Grundstücks sind Garten. ${B2(c)} des Gartens sind Rasen, und ${B2(a)} des Rasens sind schon gemäht. Welcher Bruchteil des Grundstücks ist gemähter Rasen? Kürze vollständig.`, p, [[mal(c, e), 'sach-schritt-vergessen'], [mal(a, c), 'sach-schritt-vergessen']],
        h1('Jeder Bruchteil bezieht sich auf den Teil davor. Multipliziere alle drei Brüche und kürze vorher.'), [`${B2(a)} · ${B2(c)} · ${B2(e)} = ${B2(p)}`]); },
    () => { const a = echt([3, 4, 5, 6]), c = echt([3, 4, 5, 6]), kn = kind(), rest = mal(minus([1, 1], a), minus([1, 1], c));
      if (a[1] === c[1]) return null;
      return rechneB(`${kn} gibt ${B2(a)} des Taschengelds für ein Buch aus und ${B2(c)} vom Rest für ein Geschenk. Welcher Bruchteil des Taschengelds ist danach noch übrig? Kürze vollständig.`, rest, [[minus([1, 1], plus(a, c))[0] > 0 ? minus([1, 1], plus(a, c)) : null, 'anteil-nicht-beachtet'], [mal(minus([1, 1], a), c), 'sach-frage-verfehlt']],
        h1('Der zweite Bruchteil bezieht sich nur auf den Rest. Überlege, welcher Bruchteil jeweils übrig bleibt.'), [`(1 − ${B2(a)}) · (1 − ${B2(c)}) = ${B2(rest)}`]); },
    () => { const a = echt([3, 4, 5]), c = echt([2, 3, 4, 6]), e = gz([1, 2, 3], [2, 3, 4, 5]), p = mal(mal(a, c), e), was = wahl(['Saft', 'Wasser', 'Milch']);
      if (!istBruch(p) || a[1] === c[1] || p[1] > 40) return null;
      return rechneB(`In einer Kanne sind ${T(e)} l ${was}. ${B2(c)} davon werden in einen Krug gegossen, und ${B2(a)} vom Inhalt des Krugs werden getrunken. Wie viel Liter werden getrunken? Kürze vollständig.`, p, [[mal(c, e), 'sach-schritt-vergessen'], [mal(a, e), 'sach-schritt-vergessen']],
        h1('Bilde eine einzige Multiplikation aus allen drei Angaben und kürze vor dem Rechnen.'), [`${B2(a)} · ${B2(c)} · ${T(e)} l = ${T(p)} l`], { einheit: 'l' }); },
    () => auswahl('Von einer Menge nimmst du einen Bruchteil und davon wieder einen Bruchteil. Beide Brüche sind kleiner als 1. Was gilt für das Ergebnis?', mische([opt('Es ist kleiner als jeder der beiden einzelnen Bruchteile der Menge.', true), opt('Es ist so groß wie die Summe der beiden Bruchteile.', false, 'bruch-mal-wie-plus'), opt('Es ist größer als der erste Bruchteil, weil noch einmal multipliziert wird.', false, 'mal-macht-groesser'), opt('Es liegt zwischen den beiden Bruchteilen.', false, 'mal-macht-groesser'), opt('Das hängt davon ab, welcher Bruchteil zuerst genommen wird.', false, 'anteil-nicht-beachtet')]),
      h1('Jedes Mal bleibt nur ein Teil von dem übrig, was vorher da war.'), { nachweis: [FREI('Bruchteil vom Bruchteil ist kleiner als beide')] }),
    () => { const a = echt([3, 4, 5]), c = echt([3, 4, 5, 6]), e = echt([3, 4, 5, 7]), f = echt([3, 4, 5, 6]), l = mal(a, c), r = mal(e, f);
      if (a[1] === c[1] || e[1] === f[1] || gleich(a, e) || gleich(c, f) || Math.abs(l[0] * r[1] - r[0] * l[1]) > l[1] * r[1] / 4) return null;
      return auswahl(`In der Klasse A sind ${B2(c)} der Kinder in einem Verein, ${B2(a)} davon in einem Sportverein. In der Klasse B sind ${B2(f)} in einem Verein, ${B2(e)} davon in einem Sportverein. Vergleiche die Bruchteile der Kinder im Sportverein. Welches Zeichen passt? ${B2(a)} · ${B2(c)} ▢ ${B2(e)} · ${B2(f)}`, ZEICHEN(l[0] * r[1] - r[0] * l[1], 'vergleich-nicht-genutzt'),
        h1('Berechne beide Bruchteile und bringe sie auf einen gemeinsamen Nenner.'), { nachweis: [VGL(`${B2(a)} · ${B2(c)}`, `${B2(e)} · ${B2(f)}`)] }); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const a = echt([2, 3, 4, 5, 6]), e = gz([0, 1, 2], [2, 3, 4, 5, 6, 8]), p = mal(a, e), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? p : wahl([kz([a[0] + e[0], a[1] + e[1]]), kz([a[0] * e[0], Math.max(a[1], e[1])]), plus(p, [1, p[1]])]);
        if (gleich(x, p) !== stimmt || !istBruch(x) || !istBruch(p) || gleich(a, e)) return null;
        const t = `${B2(a)} · ${T(e)} = ${T(kz(x))}`; if (roh.some(([q]) => q === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'bruch-mal-wie-plus')), h1('Der erste Faktor ist kleiner als 1. Das Produkt muss also kleiner sein als der zweite Faktor.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
}
