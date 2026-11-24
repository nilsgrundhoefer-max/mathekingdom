// Aufgaben zu 6.2.4 „Brüche teilen“ (Lernziele T1, T2) nach ADR 0015 und ADR 0038.
// T1: einen Bruch durch eine natürliche Zahl dividieren. T2: Sachaufgaben, in denen ein Bruchteil gerecht verteilt wird.
// Grilling mit Nils (2026-11-24): Lässt sich der Zähler teilen, wird er geteilt; sonst wird der Nenner malgenommen. Typische Fehler:
// den Nenner teilen oder den Zähler malnehmen (6⁄8 : 2 = 6⁄4), bei gemischten Zahlen nur die Ganzen teilen.

import { sechs, auswahl, luecken, zahl, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { bild, FREI, WERT, ggt, br, opt, zz, wahl, mische, kz, mal, durch, T, echt, rechneB, optionen, urteil, VGL, ZEICHEN, kreis, streifen, akku, kreise, istBruch, gleich, ganz } from './6-2-rechnen.mjs';

const T1 = '6.2.4-T1', T2 = '6.2.4-T2';
const B2 = (q) => br(q[0], q[1]);
// a⁄n : k. q ist der gekürzte Quotient.
const teil = (nenner, ks, passt = () => true) => { for (let i = 0; i < 800; i++) { const a = echt(nenner), k = wahl(ks), q = durch(a, ganz(k)); if (passt(k, a, q)) return { k, a, n: a[1], q }; } return null; };
const teilbar = (k, a) => a[0] % k === 0;
const gz = (ganze, nenner) => { const a = echt(nenner), g = wahl(ganze); return [g * a[1] + a[0], a[1]]; };
const nurGanze = (e, k) => { const g = Math.floor(e[0] / e[1]); return g % k === 0 ? [(g / k) * e[1] + (e[0] % e[1]), e[1]] : null; };

export function teilen() {
  // ================= T1: Bruch durch natürliche Zahl =================
  const tZ = h3('Die gefärbten Teile werden gerecht verteilt. Teile den Zähler.', `${br(6, 7)} : 3 = ${br(2, 7)}, denn 6 : 3 = 2. Der Nenner bleibt 7.`, 'Teile den Zähler durch die Zahl. Schreibe den Nenner ab.');
  const tN = h3('Der Zähler lässt sich nicht teilen. Mache die Teile kleiner.', `${br(1, 2)} : 3 = ${br(1, 6)}, denn 2 · 3 = 6. Der Zähler bleibt 1.`, 'Nimm den Nenner mit der Zahl mal. Schreibe den Zähler ab.');
  sechs(T1, 'F', [
    () => { const { k, a, n } = teil([5, 7, 8, 9, 10, 11, 12], [2, 3, 4], (kk, x) => teilbar(kk, x) && x[0] > kk);
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Teile durch ${k}.`, `${B2(a)} : ${k} = {{a}}⁄${n}`), { a: [a[0] / k, fehlerliste(a[0] / k, [[a[0] * k, 'bruch-teilen-nenner-geteilt'], [a[0] - k, 'div-falsche-rechenart'], [a[0], 'bruch-teilen-nenner-geteilt']])] }, tZ,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} : ${k} = ${br(a[0] / k, n)}`] }); },
    () => { const { k, a, n, q } = teil([5, 7, 9, 11], [2, 3, 4], (kk, x) => teilbar(kk, x));
      return rechneB(Z(`Im Kreis ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} : ${k}.`), q, [[[a[0] * k, n], 'bruch-teilen-nenner-geteilt'], [[a[0] - k, n], 'div-falsche-rechenart']], tZ, [`${B2(a)} : ${k} = ${B2(q)}`], { bild: bild(kreis(...a)) }); },
    () => { const { k, a, n } = teil([2, 3, 4], [2, 3], (kk, x) => x[0] === 1 && x[1] * kk <= 12);
      return luecken(Z(`Im Kreis ist ${B2(a)} gefärbt.`, `Teile durch ${k}.`, `${B2(a)} : ${k} = 1⁄{{a}}`), { a: [n * k, fehlerliste(n * k, [[n + k, '1x1-addiert'], [n, 'sach-schritt-vergessen'], [k, 'bruch-teilen-nenner-geteilt']])] }, tN,
        { bild: bild(kreis(...a)), nachweis: [`${B2(a)} : ${k} = ${br(1, n * k)}`, { art: 'teil', bruch: br(1, n * k), was: 'nenner', zahl: n * k }] }); },
    () => { const { k, a, n, q } = teil([2, 3, 4, 5], [2, 3], (kk, x) => x[0] === 1 && x[1] * kk <= 12);
      return auswahl(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Wie viel ist ${B2(a)} : ${k}?`), optionen(q, [[[k, n], 'bruch-teilen-nenner-geteilt'], [[1, n + k], '1x1-addiert']], B2), tN,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} : ${k} = ${B2(q)}`, WERT(B2(q))] }); },
    () => { const { k, a, n, q } = teil([3, 4, 5], [2], (kk, x) => !teilbar(kk, x) && x[0] > 1 && x[1] * kk <= 12);
      return rechneB(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} : ${k}.`), q, [[[a[0] * k, n], 'bruch-teilen-nenner-geteilt'], [[a[0], n + k], '1x1-addiert']],
        h3('Der Zähler lässt sich nicht teilen. Mache die Teile kleiner.', `${br(3, 5)} : 2 = ${br(3, 10)}, denn 5 · 2 = 10. Der Zähler bleibt 3.`, 'Nimm den Nenner mit der Zahl mal. Schreibe den Zähler ab.'), [`${B2(a)} : ${k} = ${B2(q)}`], { bild: bild(streifen(...a)) }); },
    () => { const [a, k] = wahl([[[2, 3], 4], [[2, 5], 4], [[3, 4], 3], [[2, 3], 6]]), n = a[1], q = durch(a, ganz(k));
      return rechneB(Z(`Im Kreis ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} : ${k}.`, 'Kürze das Ergebnis.'), q, [[[a[0] * k, n], 'bruch-teilen-nenner-geteilt'], [[a[0], n + k], '1x1-addiert']],
        h3('Nimm den Nenner mal. Kürze dann das Ergebnis.', `${br(2, 5)} : 4 = ${br(2, 20)}. Gekürzt ist das ${br(1, 10)}.`, `Das Ergebnis heißt zuerst ${br(a[0], n * k)}. Teile Zähler und Nenner durch dieselbe Zahl.`), [`${B2(a)} : ${k} = ${br(a[0], n * k)}`], { bild: bild(kreis(...a)) }); },
  ]);
  const NG = [3, 4, 5, 6, 7, 8, 9, 10];
  const tG = h3('Teile den Zähler. Geht das nicht, dann nimm den Nenner mal.', `${br(8, 9)} : 4 = ${br(2, 9)}. Und ${br(3, 4)} : 2 = ${br(3, 8)}.`, 'Prüfe zuerst: Lässt sich der Zähler durch die Zahl teilen?');
  sechs(T1, 'G', [
    () => { const { k, a, q } = teil([7, 9, 10, 11, 13, 15, 16, 20], [2, 3, 4, 5], (kk, x) => teilbar(kk, x) && x[0] > kk);
      return rechneB(Z(`Rechne ${B2(a)} : ${k}.`, 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0] - k, a[1]], 'div-falsche-rechenart']], tG, [`${B2(a)} : ${k} = ${B2(q)}`]); },
    () => { const { k, a, n } = teil(NG.filter((x) => x <= 6), [2, 3], (kk, x) => !teilbar(kk, x) && x[0] > 1 && ggt(x[0], kk) === 1);
      return luecken(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `Teile durch ${k}.`, `${B2(a)} : ${k} = ${a[0]}⁄{{a}}`), { a: [n * k, fehlerliste(n * k, [[n + k, '1x1-addiert'], [n, 'sach-schritt-vergessen']])] }, tG,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} : ${k} = ${br(a[0], n * k)}`, { art: 'teil', bruch: br(a[0], n * k), was: 'nenner', zahl: n * k }] }); },
    () => { const { k, a, n } = teil(NG.filter((x) => x <= 5), [2, 3, 4], (kk, x) => ggt(x[0], kk) === 1 && x[0] > 1);
      return luecken(Z('Rechne und mache die Probe.', `${B2(a)} : ${k} = ${a[0]}⁄{{a}}`, `Probe: ${k} · ${br(a[0], n * k)} = {{b}}⁄${n * k}`), { a: [n * k, fehlerliste(n * k, [[n + k, '1x1-addiert'], [n, 'sach-schritt-vergessen']])], b: [a[0] * k, fehlerliste(a[0] * k, [[a[0], 'sach-schritt-vergessen'], [a[0] + k, '1x1-addiert']])] },
        h3('Die Probe ist die Malaufgabe. Sie muss den alten Bruch ergeben.', `${br(1, 2)} : 3 = ${br(1, 6)}. Probe: 3 · ${br(1, 6)} = ${br(3, 6)}, und das ist ${br(1, 2)}.`, 'Nimm zuerst den Nenner mal. Nimm bei der Probe den Zähler mal.'),
        { nachweis: [`${B2(a)} : ${k} = ${br(a[0], n * k)}`, `${k} · ${br(a[0], n * k)} = ${br(a[0] * k, n * k)}`, { art: 'teil', bruch: br(a[0], n * k), was: 'nenner', zahl: n * k }] }); },
    () => { const { k, a, q } = teil([3, 4, 5, 6], [2, 3, 4], (kk, x) => !teilbar(kk, x) && x[0] > 1 && x[1] * kk <= 20);
      return rechneB(Z(`Im Kreis ist ${B2(a)} gefärbt.`, `Rechne ${B2(a)} : ${k}.`, 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']], tG, [`${B2(a)} : ${k} = ${B2(q)}`], { bild: bild(kreis(...a)) }); },
    () => { const { k, a, q } = teil([5, 7, 9, 10], [4, 6, 8, 9], (kk, x) => !teilbar(kk, x) && ggt(x[0], kk) > 1 && x[1] * kk / ggt(x[0], kk) <= 60);
      return rechneB(Z(`Rechne ${B2(a)} : ${k}.`, 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']],
        h3('Nimm den Nenner mal. Kürze dann so weit wie möglich.', `${br(4, 5)} : 6 = ${br(4, 30)} = ${br(2, 15)}.`, `Das Ergebnis heißt zuerst ${br(a[0], a[1] * k)}. Kürze diesen Bruch.`), [`${B2(a)} : ${k} = ${B2(q)}`]); },
    () => { const { k, a, n, q } = teil([5, 7, 8, 9, 10], [2, 3], (kk, x) => teilbar(kk, x) && x[1] % kk === 0 === false && x[0] > kk), kn = kind(), falle = [a[0] * k, n], stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} : ${k} = ${B2(x)}`;
      return urteil(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `${kn} rechnet: ${g(stimmt ? q : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? q : falle), g(stimmt ? falle : q), [g([a[0], n + k])], 'bruch-teilen-nenner-geteilt',
        h3('Beim Teilen wird es weniger. Das Ergebnis muss kleiner sein als der alte Bruch.', `${br(6, 7)} : 3 = ${br(2, 7)}. Das ist weniger als ${br(6, 7)}.`, `Prüfe: Ist das Ergebnis kleiner als ${B2(a)}?`), { bild: bild(streifen(...a)) }); },
  ]);
  const NM = [5, 6, 7, 8, 9, 10, 12, 15, 16, 20, 25];
  sechs(T1, 'M', [
    () => { const e = gz([1, 2, 3, 4], [3, 4, 5, 6, 8]), k = zz(2, 7), q = durch(e, ganz(k)), f = nurGanze(e, k);
      if (e[0] % k !== 0 || !istBruch(q)) return null;
      return rechneB(`Berechne ${T(e)} : ${k} und kürze vollständig.`, q, [[f, 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h2('Wandle die gemischte Zahl zuerst in einen Bruch um.', `${T(e)} = ${B2(e)}. Der Zähler ${e[0]} lässt sich durch ${k} teilen.`), [`${T(e)} : ${k} = ${T(q)}`]); },
    () => { const { k, a, q } = teil(NM, [4, 6, 8, 9, 10, 12], (kk, x) => !teilbar(kk, x) && ggt(x[0], kk) > 1 && x[1] * kk <= 150);
      return rechneB(`Berechne ${B2(a)} : ${k} und kürze vollständig.`, q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']],
        h2('Der Zähler ist nicht durch die Zahl teilbar. Multipliziere den Nenner.', `Das Ergebnis heißt zuerst ${br(a[0], a[1] * k)}. Du kannst vorher ${a[0]} und ${k} mit ${ggt(a[0], k)} kürzen.`), [`${B2(a)} : ${k} = ${B2(q)}`]); },
    () => { const { k, a, q } = teil(NM.filter((x) => x <= 10), [3, 4, 5, 6, 7], (kk, x) => ggt(x[0], kk) === 1);
      return zahl(`Durch welche Zahl musst du ${B2(a)} dividieren, um ${B2(q)} zu erhalten?`, k, fehlerliste(k, [[q[1], 'sach-frage-verfehlt'], [q[1] - a[1], '1x1-addiert'], [a[1], 'sach-frage-verfehlt']]),
        h2('Der Zähler ist gleich geblieben. Vergleiche die Nenner.', `Mit welcher Zahl wurde der Nenner ${a[1]} multipliziert, damit ${q[1]} herauskommt?`), { nachweis: [`${B2(a)} : ${B2(q)} = ${k}`] }); },
    () => { const e = gz([1, 2, 3], [3, 4, 5, 6, 7, 8]), k = zz(2, 6), q = durch(e, ganz(k)), f = nurGanze(e, k);
      if (e[0] % k === 0 || !istBruch(q) || q[1] > 60) return null;
      return rechneB(`Berechne ${T(e)} : ${k} und kürze vollständig.`, q, [[f, 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h2('Wandle die gemischte Zahl zuerst in einen Bruch um.', `${T(e)} = ${B2(e)}. Multipliziere den Nenner mit ${k} und kürze.`), [`${T(e)} : ${k} = ${T(q)}`]); },
    () => { const { k, a, q } = teil(NM.filter((x) => x <= 12), [2, 3, 4], (kk, x) => x[0] > 1), v = wahl([q, [a[0], a[1] * (k + 1)], [a[0], a[1] * (k - 1) || a[1] * 5]]), vk = kz(v);
      return auswahl(`Welches Zeichen passt? ${B2(a)} : ${k} ▢ ${B2(vk)}`, ZEICHEN(q[0] * vk[1] - vk[0] * q[1], 'bruch-teilen-nenner-geteilt'), h2('Berechne den Quotienten links und vergleiche dann.', `${B2(a)} : ${k} = ${br(a[0], a[1] * k)}. Bringe beide Brüche auf denselben Zähler oder Nenner.`), { nachweis: [VGL(`${B2(a)} : ${k}`, B2(vk))] }); },
    () => auswahl('Ein Bruch wird durch eine natürliche Zahl dividiert, die größer als 1 ist. Was gilt für das Ergebnis?', mische([opt('Es ist kleiner als der Bruch, denn jeder Anteil wird kleiner.', true), opt('Es ist größer als der Bruch, denn der Nenner wird größer.', false, 'bruch-nenner-groesse'), opt('Es ist gleich groß, denn Zähler und Nenner ändern sich beide.', false, 'erweitern-kuerzen-verwechselt'), opt('Das hängt davon ab, ob der Zähler teilbar ist.', false, 'bruch-teilen-nenner-geteilt')]),
      h2('Stell dir vor, du verteilst ein Stück Kuchen an mehrere Kinder.', 'Ein größerer Nenner bedeutet kleinere Teile. Der Wert des Bruchs wird also kleiner.'), { nachweis: [FREI('Dividieren durch eine Zahl über 1 verkleinert')] }),
  ]);
  sechs(T1, 'E', [
    () => { const e = gz([5, 6, 7, 8, 9, 10, 12], [4, 5, 6, 8, 9, 10]), k = wahl([6, 8, 9, 12, 14, 15, 16, 18]), q = durch(e, ganz(k));
      if (ggt(e[0], k) < 3 || !istBruch(q) || q[1] > 100) return null;
      return rechneB(`Berechne ${T(e)} : ${k} und kürze vollständig.`, q, [[[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt'], [nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0], e[1] * k + 1], null]].filter(([, fv]) => fv),
        h1('Wandle in einen unechten Bruch um und kürze den Zähler mit dem Divisor.'), [`${T(e)} : ${k} = ${T(q)}`]); },
    () => { const q = gz([1, 2], [4, 6, 8, 9, 12]), k = zz(4, 9), e = mal(ganz(k), q);
      if (!istBruch(e)) return null;
      return rechneB(`Eine Zahl wird durch ${k} dividiert. Das Ergebnis ist ${T(q)}. Wie heißt die Zahl? Kürze vollständig.`, e, [[durch(q, ganz(k)), 'probe-falsche-umkehr'], [[k * Math.floor(q[0] / q[1]) * q[1] + (q[0] % q[1]), q[1]], 'gemischt-getrennt-mal']],
        h1('Mache die Division mit der Umkehraufgabe rückgängig.'), [`${k} · ${T(q)} = ${T(e)}`]); },
    () => { const q = echt([4, 5, 6, 8, 10]), k = zz(3, 9), e = mal(ganz(k), q);
      if (!istBruch(e) || e[0] < e[1] || e[1] === q[1]) return null;
      return luecken(`Welcher Divisor fehlt? ${T(e)} : {{a}} = ${B2(q)}`, { a: [k, fehlerliste(k, [[e[0], 'sach-frage-verfehlt'], [Math.floor(e[0] / e[1]), 'gemischt-getrennt-mal'], [k + 1, 'sach-schritt-vergessen']])] },
        h1('Wandle die gemischte Zahl in einen Bruch um. Erweitere beide Brüche so, dass du die Zähler vergleichen kannst.'), { nachweis: [`${T(e)} : ${B2(q)} = ${k}`] }); },
    () => auswahl('Durch eine natürliche Zahl zu dividieren ist dasselbe wie …', mische([opt('mit ihrem Kehrwert zu multiplizieren.', true), opt('den Nenner durch diese Zahl zu dividieren.', false, 'bruch-teilen-nenner-geteilt'), opt('den Zähler mit dieser Zahl zu multiplizieren.', false, 'bruch-teilen-nenner-geteilt'), opt('Zähler und Nenner durch diese Zahl zu dividieren.', false, 'erweitern-kuerzen-verwechselt'), opt('Zähler und Nenner mit dieser Zahl zu multiplizieren.', false, 'erweitern-kuerzen-verwechselt')]),
      h1('Halbieren heißt: die Hälfte nehmen. Wie schreibst du „die Hälfte von“ als Multiplikation?'), { nachweis: [FREI('Division als Multiplikation mit dem Kehrwert')] }),
    () => { const e = gz([3, 4, 5, 6, 7], [2, 3, 4, 5, 6, 8]), q = durch(e, ganz(4));
      if (q[1] > 64 || !istBruch(q)) return null;
      return rechneB(`Halbiere die Zahl ${T(e)} zweimal nacheinander. Welche Zahl erhältst du? Kürze vollständig.`, q, [[durch(e, ganz(2)), 'sach-schritt-vergessen'], [nurGanze(e, 4), 'gemischt-getrennt-mal'], [[e[0] * 4, e[1]], 'bruch-teilen-nenner-geteilt']],
        h1('Zweimal halbieren ist dasselbe wie einmal vierteln.'), [`${T(e)} : 2 : 2 = ${T(q)}`]); },
    () => { const roh = [];
      for (let i = 0; i < 5; i++) { const e = gz([1, 2, 3, 4], [3, 4, 5, 6, 8]), k = zz(2, 6), q = durch(e, ganz(k)), stimmt = i < 2 ? i === 0 : wahl([true, false]);
        const x = stimmt ? q : wahl([nurGanze(e, k) ?? [e[0] * k, e[1]], [e[0], e[1] + k], kz([q[0] * 2, q[1]])]);
        if (!x || gleich(x, q) !== stimmt || !istBruch(x) || !istBruch(q) || q[1] > 48) return null;
        const t = `${T(e)} : ${k} = ${T(kz(x))}`; if (roh.some(([s]) => s === t)) return null; roh.push([t, stimmt]); }
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', roh.map(([t, r]) => opt(t, r, r ? undefined : 'gemischt-getrennt-mal')), h1('Prüfe mit der Umkehraufgabe: Ergebnis mal Divisor muss die erste Zahl ergeben.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);

  // ================= T2: gerecht verteilen =================
  const tS = h3('Gerecht verteilen heißt teilen. Teile den Bruch durch die Anzahl.', `${br(6, 8)} Pizza für 3 Kinder: ${br(6, 8)} : 3 = ${br(2, 8)}. Jedes Kind bekommt ${br(2, 8)} Pizza.`, 'Teile den Zähler. Geht das nicht, dann nimm den Nenner mal.');
  sechs(T2, 'F', [
    () => { const { k, a, n } = teil([5, 7, 8, 9, 10], [2, 3, 4], (kk, x) => teilbar(kk, x) && x[0] > kk);
      return luecken(Z(`Auf dem Teller liegt ${B2(a)} Pizza.`, `${k} Kinder teilen gerecht.`, `${B2(a)} : ${k} = {{a}}⁄${n}`), { a: [a[0] / k, fehlerliste(a[0] / k, [[a[0] * k, 'bruch-teilen-nenner-geteilt'], [a[0] - k, 'div-falsche-rechenart']])] }, tS,
        { bild: bild(kreis(...a)), nachweis: [`${B2(a)} : ${k} = ${br(a[0] / k, n)}`] }); },
    () => { const { k, a, n, q } = teil([2, 3, 4], [2, 3], (kk, x) => x[0] === 1), was = wahl(['Pizza', 'Kuchen', 'Torte']);
      return rechneB(Z(`Auf dem Teller liegt ${B2(a)} ${was}.`, `${k} Kinder teilen gerecht.`, `Wie viel ${was} bekommt jedes Kind?`), q, [[[k, n], 'bruch-teilen-nenner-geteilt'], [[1, n + k], '1x1-addiert']],
        h3('Jedes Stück wird kleiner. Nimm den Nenner mal.', `${br(1, 2)} Pizza für 2 Kinder: ${br(1, 2)} : 2 = ${br(1, 4)}.`, `Rechne ${n} · ${k} für den Nenner. Der Zähler bleibt 1.`), [`${B2(a)} : ${k} = ${B2(q)}`], { bild: bild(kreis(...a)) }); },
    () => { const { k, a, n, q } = teil([4, 5, 8, 10], [2, 3], (kk, x) => teilbar(kk, x) && ggt(x[0] / kk, x[1]) === 1), was = wahl(['Saft', 'Wasser', 'Milch']);
      return auswahl(Z(`Im Krug ist ${B2(a)} l ${was}.`, `Er wird auf ${k} Gläser gleich verteilt.`, `Wie viel ${was} ist in jedem Glas?`), optionen(q, [[[a[0] * k, n], 'bruch-teilen-nenner-geteilt'], [[a[0] - k > 0 ? a[0] - k : a[0] + k, n], 'div-falsche-rechenart']], B2).map((o) => ({ ...o, text: `${o.text} l` })), tS,
        { bild: bild(streifen(...a)), nachweis: [`${B2(a)} l : ${k} = ${B2(q)} l`, WERT(`${B2(q)} l`, false)] }); },
    () => { const { k, a, n, q } = teil([5, 7, 9, 10], [2, 3, 4], (kk, x) => teilbar(kk, x) && ggt(x[0] / kk, x[1]) === 1), kn = kind(), ding = wahl(['Ein Band', 'Ein Seil', 'Ein Stück Stoff']);
      return rechneB(Z(`${ding} ist ${B2(a)} m lang.`, `${kn} schneidet ${k} gleich lange Stücke daraus.`, 'Wie lang ist ein Stück?'), q, [[[a[0] * k, n], 'bruch-teilen-nenner-geteilt'], [[a[0], n * k], 'bruch-teilen-nenner-geteilt']],
        h3('Alle Stücke sind gleich lang. Teile die Länge durch die Anzahl.', `${br(6, 7)} m in 3 Stücke: ${br(6, 7)} m : 3 = ${br(2, 7)} m.`, `Rechne ${a[0]} : ${k} für den Zähler. Der Nenner bleibt ${n}.`), [`${B2(a)} m : ${k} = ${B2(q)} m`], { einheit: 'm', bild: bild(streifen(...a)) }); },
    () => { const [a, k] = wahl([[[3, 4], 3], [[4, 5], 2], [[4, 5], 4], [[3, 5], 3], [[9, 10], 3], [[2, 5], 2], [[6, 7], 3], [[6, 7], 2]]), q = durch(a, ganz(k)), was = wahl(['Spielen', 'Videoschauen', 'Musikhören']);
      return rechneB(Z(`Der Akku ist zu ${B2(a)} voll.`, `Das reicht genau für ${k} Stunden ${was}.`, 'Welcher Bruchteil vom Akku wird in einer Stunde verbraucht?'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[1] - a[0], a[1]], 'sach-frage-verfehlt']],
        h3('In jeder Stunde wird gleich viel verbraucht. Teile durch die Stunden.', `${br(4, 5)} reicht für 2 Stunden. Eine Stunde braucht ${br(4, 5)} : 2 = ${br(2, 5)}.`, `Rechne ${B2(a)} : ${k}.`), [`${B2(a)} : ${k} = ${B2(q)}`], { bild: bild(akku(...a)) }); },
    () => { const [a, k] = wahl([[[2, 3], 4], [[2, 5], 4], [[3, 4], 3], [[2, 3], 6], [[3, 4], 6]]), q = durch(a, ganz(k)), was = wahl(['Kuchen', 'Pizza', 'Torte']);
      if (a[1] * k > 24) return null;
      return rechneB(Z(`Es ist noch ${B2(a)} ${was} da.`, `${k} Kinder teilen gerecht.`, `Wie viel ${was} bekommt jedes Kind?`, 'Kürze das Ergebnis.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']],
        h3('Nimm den Nenner mal. Kürze dann das Ergebnis.', `${br(2, 3)} Kuchen für 4 Kinder: ${br(2, 3)} : 4 = ${br(2, 12)} = ${br(1, 6)}.`, `Das Ergebnis heißt zuerst ${br(a[0], a[1] * k)}. Kürze diesen Bruch.`), [`${B2(a)} : ${k} = ${br(a[0], a[1] * k)}`], { bild: bild(kreis(...a)) }); },
  ]);
  const tSG = h3('Gerecht verteilen heißt teilen. Kürze am Ende.', `${br(3, 4)} kg auf 6 Tüten: ${br(3, 4)} kg : 6 = ${br(3, 24)} kg = ${br(1, 8)} kg.`, 'Teile den Zähler. Geht das nicht, dann nimm den Nenner mal. Kürze dann.');
  sechs(T2, 'G', [
    () => { const { k, a, q } = teil([4, 5, 8, 10], [2, 3, 4, 5, 6], (kk, x) => x[0] > 1 && x[1] * kk <= 60), was = wahl(['Nüsse', 'Bonbons', 'Rosinen', 'Mandeln']);
      return rechneB(Z(`${B2(a)} kg ${was} werden auf ${k} Tüten gleich verteilt.`, `Wie viel Kilogramm sind in einer Tüte?`, 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']], tSG, [`${B2(a)} kg : ${k} = ${B2(q)} kg`], { einheit: 'kg' }); },
    () => { const { k, a, q } = teil([4, 5, 8, 10], [2, 3, 4], (kk, x) => x[0] > 1), was = wahl(['Saft', 'Tee', 'Kakao']);
      return rechneB(Z(`Im Krug ist ${B2(a)} l ${was}.`, `${k} Kinder teilen gerecht.`, 'Wie viel bekommt jedes Kind?', 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']], tSG, [`${B2(a)} l : ${k} = ${B2(q)} l`], { einheit: 'l', bild: bild(streifen(...a)) }); },
    () => { const { k, a, q } = teil([4, 5, 10], [4, 6, 8], (kk, x) => x[0] > 1 && ggt(x[0], kk) > 1), kn = kind();
      return rechneB(Z(`Ein Brett ist ${B2(a)} m lang.`, `${kn} sägt es in ${k} gleich lange Teile.`, 'Wie lang ist ein Teil?', 'Kürze das Ergebnis vollständig.'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] * k + 1], null]].filter(([, f]) => f),
        h3('Alle Teile sind gleich lang. Teile die Länge durch die Anzahl.', `${br(4, 5)} m in 8 Teile: ${br(4, 5)} m : 8 = ${br(4, 40)} m = ${br(1, 10)} m.`, `Nimm den Nenner mal ${k}. Kürze dann.`), [`${B2(a)} m : ${k} = ${B2(q)} m`], { einheit: 'm' }); },
    () => { const { k, a, q } = teil([2, 4, 5, 10], [3, 4, 5, 6], (kk, x) => ggt(x[0], kk) === 1 && x[1] * kk <= 50);
      return rechneB(Z(`Ein Staffellauf ist ${B2(a)} km lang.`, `${k} Kinder laufen gleich lange Stücke.`, 'Wie viele Kilometer läuft jedes Kind?'), q, [[[a[0] * k, a[1]], 'bruch-teilen-nenner-geteilt'], [[a[0], a[1] + k], '1x1-addiert']], tSG, [`${B2(a)} km : ${k} = ${B2(q)} km`], { einheit: 'km' }); },
    () => { const e = gz([1, 2], [2, 4]), k = wahl([2, 3, 4, 5, 6]), q = durch(e, ganz(k));
      if (!istBruch(q) || q[0] >= q[1] || q[1] > 16) return null;
      return rechneB(Z(`Das Bild zeigt ${T(e)} Pizzen.`, `${k} Kinder teilen gerecht.`, 'Wie viel Pizza bekommt jedes Kind?', 'Kürze das Ergebnis vollständig.'), q, [[nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h3('Schreibe die gemischte Zahl zuerst als Bruch.', `${T([3, 2])} Pizzen für 3 Kinder: ${br(3, 2)} : 3 = ${br(1, 2)}.`, `Schreibe ${T(e)} als ${B2(e)}. Teile dann durch ${k}.`), [`${T(e)} : ${k} = ${B2(q)}`], { bild: bild(kreise(e)) }); },
    () => { const { k, a, n, q } = teil([4, 5, 7, 8], [2, 3], (kk, x) => !teilbar(kk, x) && x[0] > 1), kn = kind(), falle = [a[0] * k, n], stimmt = wahl([true, false, false]), g = (x) => `${B2(a)} : ${k} = ${T(kz(x))}`;
      return urteil(Z(`Im Streifen ist ${B2(a)} gefärbt.`, `${kn} verteilt ${B2(a)} l Saft auf ${k} Gläser.`, `${kn} rechnet: ${g(stimmt ? q : falle)}`, 'Stimmt das?'), stimmt, g(stimmt ? q : falle), g(stimmt ? falle : q), [g([a[0], n + k])], 'bruch-teilen-nenner-geteilt',
        h3('In jedem Glas ist weniger als im Krug. Das Ergebnis muss kleiner sein.', `${br(3, 4)} : 2 = ${br(3, 8)}. Das ist weniger als ${br(3, 4)}.`, `Prüfe: Ist das Ergebnis kleiner als ${B2(a)}?`), { bild: bild(streifen(...a)) }); },
  ]);
  sechs(T2, 'M', [
    () => { const e = gz([1, 2, 3], [2, 4, 5]), k = wahl([3, 4, 5, 6, 8, 9]), q = durch(e, ganz(k)), was = wahl(['Suppe', 'Punsch', 'Limonade']);
      if (!istBruch(q) || q[1] > 40 || ggt(e[0], k) === 1) return null;
      return rechneB(`${T(e)} l ${was} werden gerecht an ${k} Personen verteilt. Wie viel Liter bekommt jede Person? Kürze vollständig.`, q, [[nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h2('Wandle die gemischte Zahl in einen Bruch um und dividiere dann.', `${T(e)} = ${B2(e)}. Kürze ${e[0]} und ${k} mit ${ggt(e[0], k)}, bevor du den Nenner multiplizierst.`), [`${T(e)} l : ${k} = ${T(q)} l`], { einheit: 'l' }); },
    () => { const e = gz([3, 4, 5, 6, 7], [2, 4]), k = wahl([2, 3, 4, 5, 6]), q = durch(e, ganz(k)), kn = kind();
      if (!istBruch(q) || q[0] < q[1] || q[1] > 16) return null;
      return rechneB(`Ein Seil ist ${T(e)} m lang. ${kn} schneidet es in ${k} gleich lange Stücke. Wie lang ist ein Stück? Kürze vollständig.`, q, [[nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h2('Wandle die gemischte Zahl in einen Bruch um und dividiere dann.', `${T(e)} = ${B2(e)}. Multipliziere den Nenner mit ${k} und schreibe das Ergebnis als gemischte Zahl.`), [`${T(e)} m : ${k} = ${T(q)} m`], { einheit: 'm' }); },
    () => { const g = zz(4, 8), v = gz([1, 2], [2, 4]), k = wahl([2, 3, 4, 5]), rest = [g * v[1] - v[0], v[1]], q = durch(rest, ganz(k));
      if (!istBruch(q) || q[1] > 20) return null;
      return rechneB(`In einem Eimer sind ${g} l Farbe. Davon werden ${T(v)} l verbraucht. Der Rest wird gleichmäßig auf ${k} Dosen verteilt. Wie viel Liter sind in jeder Dose? Kürze vollständig.`, q, [[durch(ganz(g), ganz(k)), 'sach-schritt-vergessen'], [rest, 'sach-schritt-vergessen'], [durch(v, ganz(k)), 'sach-frage-verfehlt']],
        h2('Berechne zuerst den Rest. Verteile dann den Rest.', `Der Rest ist ${g} l − ${T(v)} l = ${T(rest)} l. Dividiere ihn durch ${k}.`), [`(${g} l − ${T(v)} l) : ${k} = ${T(q)} l`], { einheit: 'l' }); },
    () => { const e = gz([1, 2], [2, 3, 4, 6]), k = wahl([2, 3, 4, 5]), q = durch(e, ganz(k));
      if (!istBruch(q) || q[1] > 24) return null;
      return rechneB(`Ein Film dauert ${T(e)} h. Er wird in ${k} gleich lange Teile geschnitten. Welchen Bruchteil einer Stunde dauert jeder Teil? Kürze vollständig.`, q, [[nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h2('Wandle die gemischte Zahl in einen Bruch um und dividiere dann.', `${T(e)} = ${B2(e)}. Multipliziere den Nenner mit ${k}.`), [`${T(e)} h : ${k} = ${T(q)} h`], { einheit: 'h' }); },
    () => { const q = echt([8, 10, 12, 16, 20]), k = zz(3, 6), e = mal(ganz(k), q), was = wahl(['Tee', 'Gewürz', 'Kaffee']);
      if (e[0] >= e[1] || e[1] === q[1] || q[0] > 3) return null;
      return zahl(`${B2(e)} kg ${was} werden gleichmäßig in Dosen gefüllt. In jeder Dose sind danach ${B2(q)} kg. Wie viele Dosen sind es?`, k, fehlerliste(k, [[q[1] / e[1], 'sach-schritt-vergessen'], [k + 1, 'sach-schritt-vergessen'], [q[1], 'sach-frage-verfehlt']]),
        h2('Bringe beide Brüche auf denselben Nenner. Wie oft passt der kleine in den großen?', `${B2(e)} = ${br(e[0] * (q[1] / e[1]), q[1])}. Dividiere den Zähler durch ${q[0]}.`), { nachweis: [`${B2(e)} kg : ${B2(q)} kg = ${k}`] }); },
    () => { const k = wahl([2, 3]), g = k * zz(1, 2), a = echt([3, 5, 7]), e = [g * a[1] + a[0], a[1]], kn = kind();
      if (ggt(a[0], k) > 1) return null;
      return auswahl(`${kn} verteilt ${T(e)} l Saft gerecht auf ${k} Krüge und rechnet ${T(e)} : ${k} = ${T(nurGanze(e, k))}. Welchen Fehler macht ${kn}?`, [opt('Nur die Ganzen werden dividiert, der Bruch dahinter nicht.', true), opt('Der Nenner hätte dividiert werden müssen.', false, 'bruch-teilen-nenner-geteilt'), opt('Das Ergebnis ist richtig, es ist nur nicht gekürzt.', false, 'gemischt-getrennt-mal'), opt('Die Ganzen hätten multipliziert werden müssen.', false, 'mal-macht-groesser')],
        h2('Eine gemischte Zahl besteht aus Ganzen und einem Bruch. Beide Teile werden verteilt.', `Auch ${B2(a)} l muss durch ${k} dividiert werden. Wandle am besten zuerst in einen Bruch um.`), { nachweis: [FREI('Fehleranalyse: gemischte Zahl getrennt dividiert')] }); },
  ]);
  sechs(T2, 'E', [
    () => { const e = gz([8, 9, 10, 12, 14, 15], [2, 4, 5, 8]), k = wahl([6, 9, 12, 15]), q = durch(e, ganz(k));
      if (!istBruch(q) || ggt(e[0], k) < 3 || q[1] > 60 || q[0] < q[1]) return null;
      return rechneB(`Eine Wanderung von ${T(e)} km wird in ${k} gleich lange Etappen eingeteilt. Wie viele Kilometer hat eine Etappe? Kürze vollständig.`, q, [[nurGanze(e, k), 'gemischt-getrennt-mal'], [[e[0] * k, e[1]], 'bruch-teilen-nenner-geteilt']],
        h1('Wandle in einen unechten Bruch um und kürze vor dem Rechnen.'), [`${T(e)} km : ${k} = ${T(q)} km`], { einheit: 'km' }); },
    () => { const voll = gz([3, 4, 5], [2]), bleibt = echt([4]), k = wahl([3, 5, 6, 9]), rest = [voll[0] * 2 - bleibt[0], 4], q = durch(rest, ganz(k));
      if (!istBruch(q) || q[1] > 24) return null;
      return rechneB(`In einem Kanister sind ${T(voll)} l Saft. ${B2(bleibt)} l bleiben im Kanister, der Rest wird gleichmäßig auf ${k} Flaschen verteilt. Wie viel Liter sind in jeder Flasche? Kürze vollständig.`, q, [[durch(voll, ganz(k)), 'sach-schritt-vergessen'], [kz(rest), 'sach-schritt-vergessen']],
        h1('Berechne zuerst mit dem Hauptnenner, wie viel verteilt wird.'), [`(${T(voll)} l − ${B2(bleibt)} l) : ${k} = ${T(q)} l`], { einheit: 'l' }); },
    () => { const q = gz([1, 2], [8, 12, 16]), k = wahl([4, 6, 8, 12]), e = mal(ganz(k), q), ding = wahl(['Ein Seil', 'Eine Leiste', 'Ein Kabel']);
      if (!istBruch(e)) return null;
      return rechneB(`${ding} wird in ${k} gleich lange Stücke geschnitten. Jedes Stück ist ${T(q)} m lang. Wie lang war ${ding === 'Ein Seil' ? 'das Seil' : ding === 'Ein Kabel' ? 'das Kabel' : 'die Leiste'} vorher? Kürze vollständig.`, e, [[durch(q, ganz(k)), 'probe-falsche-umkehr'], [[k * Math.floor(q[0] / q[1]) * q[1] + (q[0] % q[1]), q[1]], 'gemischt-getrennt-mal']],
        h1('Hier wurde schon geteilt. Gesucht ist die Länge vor dem Teilen.'), [`${k} · ${T(q)} m = ${T(e)} m`], { einheit: 'm' }); },
    () => auswahl('Eine Menge wird zuerst gerecht auf einige Gruppen verteilt. Danach verteilt jede Gruppe ihren Anteil gerecht an ihre Kinder. Jede Gruppe hat gleich viele Kinder. Wie findest du den Anteil eines Kindes in einem Schritt?', mische([opt('Die Menge durch das Produkt aus Gruppenzahl und Kinderzahl dividieren.', true), opt('Die Menge durch die Summe aus Gruppenzahl und Kinderzahl dividieren.', false, '1x1-addiert'), opt('Die Menge durch die Gruppenzahl dividieren und mit der Kinderzahl multiplizieren.', false, 'mal-macht-groesser'), opt('Die Menge mit der Gruppenzahl und mit der Kinderzahl multiplizieren.', false, 'mal-macht-groesser'), opt('Das geht nicht in einem Schritt.', false, 'sach-schritt-vergessen')]),
      h1('Überlege, wie viele Kinder es insgesamt sind.'), { nachweis: [FREI('Zweimal dividieren heißt durch das Produkt dividieren')] }),
    () => { const n = wahl([2, 4]), tage = [gz([1, 2, 3], [n]), gz([1, 2, 3], [4]), gz([1, 2, 3], [n]), ganz(zz(2, 4))], kn = kind(), s = tage.reduce((x, y) => kz([x[0] * y[1] + y[0] * x[1], x[1] * y[1]])), q = durch(s, ganz(4));
      if (!istBruch(q) || q[1] > 16 || new Set(tage.map(T)).size < 4) return null;
      return rechneB(`${kn} fährt an vier Tagen ${tage.map((t) => `${T(t)} km`).join(', ').replace(/, ([^,]*)$/, ' und $1')}. Wie viele Kilometer sind das im Durchschnitt pro Tag? Kürze vollständig.`, q, [[s, 'sach-schritt-vergessen'], [durch(s, ganz(3)), 'sach-falsche-rechnung']],
        h1('Der Durchschnitt ist die Summe, gerecht auf die Tage verteilt.'), [`(${tage.map((t) => `${T(t)} km`).join(' + ')}) : 4 = ${T(q)} km`, { wert: '4', grund: 'vier Tage' }], { einheit: 'km' }); },
    () => { const a = gz([2, 3, 4], [2, 4]), ka = wahl([3, 5, 6]), kc = wahl([4, 5, 6, 9]), d = wahl([0, 1, -1]), qa = durch(a, ganz(ka)), c = kz([qa[0] * kc * 4 + d * qa[1], qa[1] * 4]);
      if (ka === kc || !istBruch(c) || c[1] > 8 || c[0] < c[1]) return null;
      return auswahl(`Bei Fest A teilen sich ${ka} Gäste ${T(a)} l Punsch, bei Fest B teilen sich ${kc} Gäste ${T(c)} l. Vergleiche, wie viel ein Gast bekommt. Welches Zeichen passt? ${T(a)} l : ${ka} ▢ ${T(c)} l : ${kc}`, ZEICHEN(-d, 'vergleich-nicht-genutzt'),
        h1('Berechne beide Anteile und bringe sie auf denselben Nenner.'), { nachweis: [VGL(`${T(a)} l : ${ka}`, `${T(c)} l : ${kc}`)] }); },
  ]);
}
