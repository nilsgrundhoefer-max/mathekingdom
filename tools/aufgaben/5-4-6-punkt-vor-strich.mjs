// Aufgaben zu 5.4.6 „Punkt vor Strich, Klammern zuerst“ (Lernziele T1 bis T3) nach ADR 0015.
//   F  Päckchenbild: einzelne Plättchen und volle Päckchen (3 + 2 · 4), geteiltes Punktefeld für die Klammer
//   G  Rechenausdrücke mit zwei Rechenarten, Klammer setzen, einfache Texte
//   M  lange Rechenausdrücke, Klammer in der Klammer, Fachsprache in Texten
//   E  Klammern geschickt setzen, Gegenbeispiele, mehrschrittige Texte

import { sechs, stufen, zahl, auswahl, opt, luecken, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, GROESSTES, HILFSZAHL, rechne } from '../werkzeug.mjs';

const T = (kurz) => `5.4.6-${kurz}`;
// Rechnet einen Ausdruck aus; geht eine Division nicht auf, ist der Wert NaN.
const wert = (t) => { try { return rechne(t); } catch { return NaN; } };

export function punktVorStrich() {
  // ===================================================================
  // T1 Punkt vor Strich
  // ===================================================================
  sechs(T('T1'), 'F', [
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return zahl(Z('Rechne.', `${e} + ${p} · ${j}`, `Rechne zuerst ${p} · ${j}.`), e + p * j, fehlerliste(e + p * j, [[(e + p) * j, 'punkt-vor-strich']]),
        h3('Punkt vor Strich: Mal rechnest du vor plus.', '2 + 3 · 4: Erst 3 · 4 = 12. Dann 2 + 12 = 14.', `${p} · ${j} = ${p * j}. Rechne jetzt ${e} + ${p * j}.`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`, `${e} + ${p} · ${j}`) }); },
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(2, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3 && new Set([y * z, x + y, x + z]).size === 3);
      return auswahl(Z(`${e} + ${p} · ${j}`, 'Was rechnest du zuerst?'), [opt(`${p} · ${j}`, true), opt(`${e} + ${p}`, false, 'punkt-vor-strich'), opt(`${e} + ${j}`)],
        h3('Punkt vor Strich: Das Mal kommt zuerst.', 'Bei 5 + 2 · 3 rechnest du zuerst 2 · 3.', 'Suche das Zeichen ·.'), { bild: B.paeckchen(e, p, j), nachweis: [WERT(p * j), ...N(`${p} · ${j}`, `${e} + ${p * j}`)] }); },
    () => { const [e, p, j] = suche(() => [zz(2, 8), zz(2, 5), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return zahl(Z(`Im Bild sind ${e} einzelne Plättchen.`, `Dazu kommen ${p} Päckchen mit je ${j} Plättchen.`, 'Wie viele Plättchen sind es?'), e + p * j, fehlerliste(e + p * j, [[(e + p) * j, 'punkt-vor-strich'], [e + p + j, '1x1-addiert']]),
        h3('Zähle zuerst die Plättchen in den Päckchen.', '3 einzelne und 2 Päckchen mit je 4: 2 · 4 = 8. 3 + 8 = 11.', `${p} · ${j} = ${p * j}. Rechne jetzt ${e} + ${p * j}.`), { einheit: 'Plättchen', bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`) }); },
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return zahl(Z('Rechne.', `${p} · ${j} + ${e}`, `Rechne zuerst ${p} · ${j}.`), p * j + e, fehlerliste(p * j + e, [[p * (j + e), 'punkt-vor-strich']]),
        h3('Das Mal kommt zuerst. Danach rechnest du plus.', '3 · 4 + 2: Erst 3 · 4 = 12. Dann 12 + 2 = 14.', `${p} · ${j} = ${p * j}. Rechne jetzt ${p * j} + ${e}.`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${p * j} + ${e}`, `${p} · ${j} + ${e}`) }); },
    () => { const [p, j] = suche(() => [zz(2, 4), zz(3, 5)], ([x, y]) => x !== y), a = suche(() => zz(15, 25), (x) => x > p * j + 2 && x !== 20);
      return zahl(Z('Rechne.', `${a} − ${p} · ${j}`), a - p * j, fehlerliste(a - p * j, [[(a - p) * j, 'punkt-vor-strich']]),
        h3('Auch bei minus gilt: Das Mal kommt zuerst.', '20 − 3 · 4: Erst 3 · 4 = 12. Dann 20 − 12 = 8.', `${p} · ${j} = ${p * j}. Nimm ${p * j} von ${a} weg.`), { bild: B.menge(a, { weg: p * j }), nachweis: N(`${p} · ${j}`, `${a} − ${p * j}`, `${a} − ${p} · ${j}`) }); },
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return luecken(Z('Rechne Schritt für Schritt.', `${p} · ${j} = {{a}}`, `${e} + ${p} · ${j} = {{b}}`), { a: p * j, b: [e + p * j, fehlerliste(e + p * j, [[(e + p) * j, 'punkt-vor-strich']])] },
        h3('Zuerst das Mal. Dann das Plus.', '4 + 2 · 3: 2 · 3 = 6. 4 + 6 = 10.', `Rechne ${e} + ${p * j}.`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`, `${e} + ${p} · ${j}`) }); },
  ]);

  stufen(T('T1'), 'G', {
    1: (k) => {
      if (k === 0) { const [e, p, j] = suche(() => [zz(5, 15), zz(3, 8), zz(4, 9)], ([x, y, z]) => y !== z);
        return zahl(Z('Rechne.', `${e} + ${p} · ${j}`), e + p * j, fehlerliste(e + p * j, [[(e + p) * j, 'punkt-vor-strich']]),
          h3('Punktrechnung vor Strichrechnung.', '7 + 6 · 8: Erst 6 · 8 = 48. Dann 7 + 48 = 55.', `${p} · ${j} = ${p * j}.`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`, `${e} + ${p} · ${j}`) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(4, 9), zz(5, 9), zz(11, 29)], ([x, y, z]) => x !== y && x * y > z);
        return zahl(Z('Rechne.', `${a} · ${b} − ${c}`), a * b - c, fehlerliste(a * b - c, [[a * (b - c), 'punkt-vor-strich']]),
          h3('Zuerst das Mal. Dann das Minus.', '9 · 7 − 25: 9 · 7 = 63. 63 − 25 = 38.', `${a} · ${b} = ${a * b}.`), { nachweis: N(`${a} · ${b}`, `${a * b} − ${c}`, `${a} · ${b} − ${c}`) }); }
      const [d, q, p, j] = suche(() => [zz(3, 9), zz(3, 9), zz(2, 9), zz(2, 9)], ([w, x, y, z]) => w !== x && y !== z);
      return zahl(Z('Rechne.', `${d * q} : ${d} + ${p} · ${j}`), q + p * j, fehlerliste(q + p * j, [[(q + p) * j, 'punkt-vor-strich']]),
        h3('Mal und geteilt kommen vor plus. Rechne beide Punktrechnungen zuerst.', '48 : 6 + 4 · 5: 48 : 6 = 8 und 4 · 5 = 20. 8 + 20 = 28.', `${d * q} : ${d} = ${q}.`), { nachweis: N(`${d * q} : ${d}`, `${p} · ${j}`, `${q} + ${p * j}`, `${d * q} : ${d} + ${p} · ${j}`) });
    },
    2: (k) => {
      if (k === 0) { const [e, p, j] = suche(() => [zz(3, 9), zz(3, 6), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3);
        return auswahl(Z('Welcher Rechenweg ist richtig?', `${e} + ${p} · ${j}`), [
          opt(Z(`${p} · ${j} = ${p * j}`, `${e} + ${p * j} = ${e + p * j}`), true),
          opt(Z(`${e} + ${p} = ${e + p}`, `${e + p} · ${j} = ${(e + p) * j}`), false, 'punkt-vor-strich'),
          opt(Z(`${e} + ${p} = ${e + p}`, `${e + p} + ${j} = ${e + p + j}`), false, '1x1-addiert')],
        h3('Punktrechnung vor Strichrechnung.', '4 + 5 · 3: Erst 5 · 3 = 15. Dann 4 + 15 = 19.', `Welcher Weg beginnt mit ${p} · ${j}?`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`) }); }
      const [e, p] = suche(() => [zz(2, 9), zz(3, 6)], ([x, y]) => x !== y), x = zz(3, 9);
      return zahl(Z('Welche Zahl fehlt?', `${e} + ${p} · ▢ = ${e + p * x}`), x, fehlerliste(x, [[(e + p * x) / (e + p), 'punkt-vor-strich']].filter(([w]) => Number.isInteger(w))),
        h3('Ziehe zuerst die einzelne Zahl ab.', '3 + 4 · ▢ = 31: 31 − 3 = 28. 4 · 7 = 28. Die Zahl ist 7.', `${e + p * x} − ${e} = ${p * x}. Welche Zahl mal ${p} ergibt ${p * x}?`), { nachweis: N(`${e + p * x} − ${e}`, `${p * x} : ${p}`, `${e} + ${p} · ${x}`) });
    },
    3: () => { const [e, p, j] = suche(() => [zz(3, 9), zz(2, 5), zz(2, 5)], ([x, y, z]) => y !== z && (x + y) * z !== x + y * z), k = kind(), falsch = (e + p) * j;
      return auswahl(Z(`${k} rechnet:`, `${e} + ${p} · ${j} = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Punkt vor Strich: ${p} · ${j} = ${p * j}.`, `${e} + ${p * j} = ${e + p * j}.`), true),
        opt(Z('Stimmt.', `${e} + ${p} = ${e + p}.`, `${e + p} · ${j} = ${falsch}.`), false, 'punkt-vor-strich'),
        opt(Z('Falsch.', `Richtig ist ${e + p + j}.`), false, '1x1-addiert')],
      h3('Welche Rechnung kommt zuerst?', '6 + 4 · 2: Erst 4 · 2 = 8. Dann 6 + 8 = 14.', `Rechne zuerst ${p} · ${j}.`), { bild: B.paeckchen(e, p, j), nachweis: [U(false, `${e} + ${p} · ${j}`, falsch), ...N(`${p} · ${j}`, `${e} + ${p * j}`, `${e} + ${p}`, `${e + p} · ${j}`)] }); },
  });

  stufen(T('T1'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b, c, d] = suche(() => [zz(110, 180), zz(6, 9), zz(11, 15), zz(12, 40)], ([w, x, y, z]) => w > x * y);
        return zahl(`Berechne ${a} − ${b} · ${c} + ${d}.`, a - b * c + d, fehlerliste(a - b * c + d, [[(a - b) * c + d, 'punkt-vor-strich'], [a - b * (c + d), 'punkt-vor-strich']]),
          h2('Rechne zuerst die Punktrechnung. Rechne dann die Strichrechnungen von links nach rechts.', `${b} · ${c} = ${b * c}.`), { nachweis: N(`${b} · ${c}`, `${a} − ${b * c}`, `${a - b * c} + ${d}`, `${a} − ${b} · ${c} + ${d}`) }); }
      const [d, q, a, b] = suche(() => [zz(6, 9), zz(6, 9), zz(5, 9), zz(6, 9)], ([w, x, y, z]) => w !== x && y !== z), c = zz(11, 30);
      return zahl(`Berechne ${d * q} : ${d} + ${a} · ${b} − ${c}.`, q + a * b - c, fehlerliste(q + a * b - c, [[(q + a) * b - c, 'punkt-vor-strich']]),
        h2('Erst beide Punktrechnungen, dann von links nach rechts plus und minus.', `${d * q} : ${d} = ${q} und ${a} · ${b} = ${a * b}.`), { nachweis: N(`${d * q} : ${d}`, `${a} · ${b}`, `${q} + ${a * b}`, `${q + a * b} − ${c}`, `${d * q} : ${d} + ${a} · ${b} − ${c}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(3, 9), zz(3, 9), zz(3, 9)], (x) => new Set(x).size === 3);
        const liste = [`${a} + ${b} · ${c}`, `${a} · ${b} + ${c}`, `${b} · ${c} − ${a}`, `${a} · ${c} − ${b}`];
        const werte = liste.map(wert), max = Math.max(...werte);
        if (werte.filter((w) => w === max).length !== 1) return null;
        return auswahl('Welche Rechnung hat das größte Ergebnis?', liste.map((t) => opt(t, wert(t) === max)),
          h2('Rechne bei jeder Rechnung zuerst das Mal.', `${a} + ${b} · ${c} = ${a} + ${b * c}.`), { nachweis: [GROESSTES, ...N(...liste)] }); }
      if (k === 1) { const [p, x] = suche(() => [zz(4, 9), zz(3, 9)], ([y, z]) => y !== z), r = zz(5, 30), a = r + p * x;
        return zahl(`Welche Zahl fehlt? ${a} − ▢ · ${p} = ${r}`, x, fehlerliste(x, [[(a - r) / p + 1, 'punkt-vor-strich']].filter(([w]) => w !== x)),
          h2('Wie viel wird von der ersten Zahl abgezogen?', `${a} − ${r} = ${a - r}. Also ist ▢ · ${p} = ${a - r}.`), { nachweis: N(`${a} − ${r}`, `${a - r} : ${p}`, `${a} − ${x} · ${p}`) }); }
      const [a, b, c, d] = suche(() => [zz(6, 9), zz(6, 9), zz(3, 7), zz(3, 8)], ([w, x, y, z]) => w * x > y * z && w !== x);
      return zahl(`Berechne ${a} · ${b} − ${c} · ${d}.`, a * b - c * d, fehlerliste(a * b - c * d, [[(a * b - c) * d, 'punkt-vor-strich']]),
        h2('Beide Produkte kommen zuerst.', `${a} · ${b} = ${a * b} und ${c} · ${d} = ${c * d}.`), { nachweis: N(`${a} · ${b}`, `${c} · ${d}`, `${a * b} − ${c * d}`, `${a} · ${b} − ${c} · ${d}`) });
    },
    3: () => { const [a, b, c] = suche(() => [zz(40, 90), zz(3, 6), zz(4, 9)], ([x, y, z]) => x > y * z && y !== z), [k1, k2] = zweiKinder(), falsch = (a - b) * c;
      return auswahl(`${k1} rechnet ${a} − ${b} · ${c} = ${falsch}. ${k2} rechnet ${a} − ${b} · ${c} = ${a - b * c}. Wer hat recht?`, [
        opt(`${k2}. Punkt vor Strich: ${b} · ${c} = ${b * c} und ${a} − ${b * c} = ${a - b * c}.`, true),
        opt(`${k1}. Man rechnet von links nach rechts.`, false, 'punkt-vor-strich'),
        opt('Beide. Die Reihenfolge ist egal.', false, 'punkt-vor-strich'),
        opt(`Keiner. Richtig ist ${a - b - c}.`)],
      h2('Welche Rechenart kommt zuerst?', `Rechne zuerst ${b} · ${c}.`), { nachweis: [U(false, `${a} − ${b} · ${c}`, falsch), ...N(`${b} · ${c}`, `${a} − ${b * c}`)] }); },
  });

  stufen(T('T1'), 'E', {
    1: () => { const [a, b, d, q, c, e] = suche(() => [zz(6, 9), zz(6, 9), zz(6, 12), zz(6, 12), zz(3, 5), zz(6, 9)], ([u, v, w, x, y, z]) => u * v + x > y * z && w !== x);
      return zahl(`Berechne ${a} · ${b} + ${d * q} : ${d} − ${c} · ${e}.`, a * b + q - c * e, fehlerliste(a * b + q - c * e, [[(a * b + q - c) * e, 'punkt-vor-strich']]),
        h1('Erst alle Punktrechnungen, dann von links nach rechts.'), { nachweis: N(`${a} · ${b}`, `${d * q} : ${d}`, `${c} · ${e}`, `${a * b} + ${q}`, `${a * b + q} − ${c * e}`, `${a} · ${b} + ${d * q} : ${d} − ${c} · ${e}`) }); },
    2: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(3, 9), zz(3, 9), zz(3, 9)], (x) => new Set(x).size === 3), [d, q] = suche(() => [zz(3, 6), zz(3, 6)], ([x, y]) => x !== y);
        return auswahl('Welche Gleichung stimmt?', [opt(`${a} + ${b} · ${c} = ${a + b * c}`, true), opt(`${a} + ${b} · ${c} = ${(a + b) * c}`, false, 'punkt-vor-strich'),
          opt(`${a * 10} − ${b} · ${c} = ${(a * 10 - b) * c}`, false, 'punkt-vor-strich'), opt(`${d} · ${q} + ${c} = ${d * (q + c)}`, false, 'punkt-vor-strich'), opt(`${d * q} : ${q} + ${c} = ${d * q + c}`)],
        h1('Rechne bei jeder Gleichung die linke Seite mit Punkt vor Strich aus.'), { nachweis: [{ art: 'gleichungen' }] }); }
      if (k === 1) { const [x, m, p] = [zz(6, 15), zz(3, 9), zz(11, 30)], erg = x * m + p;
        return zahl(`Ich denke mir eine Zahl. Ich nehme sie mal ${m} und addiere ${p}. Ich erhalte ${erg}. Welche Zahl habe ich mir gedacht?`, x, fehlerliste(x, [[(erg - p) - m, 'punkt-vor-strich']].filter(([w]) => w !== x && w > 0)),
          h1('Rechne rückwärts. Was hast du zuletzt gemacht?'), { nachweis: N(`${erg} − ${p}`, `${erg - p} : ${m}`, `${x} · ${m} + ${p}`) }); }
      const [a, b, c] = suche(() => [zz(3, 9), zz(3, 9), zz(3, 9)], (x) => new Set(x).size === 3), ziel = a + b * c;
      const liste = [`${a} + ${b} · ${c}`, `${a} · ${b} + ${c}`, `${a} · ${b} − ${c}`, `${a} + ${b} + ${c}`, `${a} · ${b} · ${c}`];
      if (liste.filter((t) => wert(t) === ziel).length !== 1) return null;
      return auswahl(`Welche Rechenzeichen passen? ${a} ▢ ${b} ▢ ${c} = ${ziel}`, liste.map((t) => opt(t, wert(t) === ziel, wert(t) === (a + b) * c ? 'punkt-vor-strich' : undefined)),
        h1('Rechne jede Möglichkeit mit Punkt vor Strich aus.'), { nachweis: [WERT(ziel), ...N(...liste)] });
    },
    3: (k) => {
      if (k === 0) { const [e, p, j] = suche(() => [zz(2, 9), zz(2, 6), zz(3, 9)], ([x, y, z]) => new Set([x, y, z]).size === 3);
        return auswahl(`Warum rechnet man bei ${e} + ${p} · ${j} zuerst ${p} · ${j}? Denke an ${e} einzelne Plättchen und ${p} Päckchen mit je ${j} Plättchen.`, [
          opt(`${p} · ${j} zählt die Plättchen in den Päckchen. Erst wenn sie gezählt sind, kommen die ${e} einzelnen dazu: ${e} + ${p * j} = ${e + p * j}.`, true),
          opt('Weil man immer mit der größten Zahl anfängt.'),
          opt(`Weil ${e} + ${p} zuerst gerechnet werden muss.`, false, 'punkt-vor-strich'),
          opt('Weil das Mal links steht.'),
          opt('Das ist nur eine Abmachung ohne Grund.')],
        h1('Was bedeutet ein Produkt in einer Plättchengeschichte?'), { nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`) }); }
      const [d, q, p, j] = suche(() => [zz(4, 9), zz(4, 9), zz(2, 3), zz(2, 3)], ([w, x, y, z]) => w !== x && x > y * z), [k1, k2] = zweiKinder(), a = d * q;
      return auswahl(`${k1} sagt: „Bei ${a} : ${d} − ${p} · ${j} rechnet man zuerst ${d} − ${p}.“ ${k2} sagt: „Man rechnet zuerst ${a} : ${d} und ${p} · ${j}.“ Wer hat recht?`, [
        opt(`${k2}. Geteilt und mal sind Punktrechnungen. ${a} : ${d} = ${q} und ${p} · ${j} = ${p * j}, also ${q} − ${p * j} = ${q - p * j}.`, true),
        opt(`${k1}. Minus steht in der Mitte.`, false, 'punkt-vor-strich'),
        opt('Beide. Das Ergebnis ist gleich.', false, 'punkt-vor-strich'),
        opt('Keiner. Man rechnet von links nach rechts.', false, 'punkt-vor-strich'),
        opt(`${k1}. Geteilt ist keine Punktrechnung.`, false, 'punkt-vor-strich')],
      h1('Welche Rechenzeichen gehören zur Punktrechnung?'), { nachweis: N(`${a} : ${d}`, `${p} · ${j}`, `${q} − ${p * j}`) }); },
  });

  // ===================================================================
  // T2 Klammern, auch Klammer in der Klammer
  // ===================================================================
  sechs(T('T2'), 'F', [
    () => { const [a, b, c] = suche(() => [zz(2, 5), zz(2, 4), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x + y <= 9);
      return zahl(Z('Rechne.', `(${a} + ${b}) · ${c}`, 'Rechne zuerst die Klammer.'), (a + b) * c, fehlerliste((a + b) * c, [[a + b * c, 'klammer-ignoriert']]),
        h3('Was in der Klammer steht, rechnest du zuerst.', '(2 + 3) · 4: Erst 2 + 3 = 5. Dann 5 · 4 = 20.', `${a} + ${b} = ${a + b}. Rechne jetzt ${a + b} · ${c}.`), { bild: B.feld(a + b, c, a), nachweis: N(`${a} + ${b}`, `${a + b} · ${c}`, `(${a} + ${b}) · ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(2, 3), zz(3, 6), zz(2, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3 && new Set([y + z, x * y, x * z]).size === 3);
      return auswahl(Z(`${a} · (${b} + ${c})`, 'Was rechnest du zuerst?'), [opt(`${b} + ${c}`, true), opt(`${a} · ${b}`, false, 'klammer-ignoriert'), opt(`${a} · ${c}`)],
        h3('Die Klammer kommt immer zuerst.', 'Bei 3 · (2 + 4) rechnest du zuerst 2 + 4.', 'Schau, was in der Klammer steht.'), { bild: B.feld(a, b + c), nachweis: [WERT(b + c), ...N(`${b} + ${c}`, `${a} · ${b + c}`)] }); },
    () => { const [b, c] = suche(() => [zz(3, 6), zz(2, 5)], ([x, y]) => x !== y), a = 20;
      return zahl(Z('Rechne.', `${a} − (${b} + ${c})`), a - b - c, fehlerliste(a - b - c, [[a - b + c, 'klammer-ignoriert']]),
        h3('Rechne zuerst die Klammer. Dann nimm alles zusammen weg.', '20 − (3 + 5): Erst 3 + 5 = 8. Dann 20 − 8 = 12.', `${b} + ${c} = ${b + c}. Nimm ${b + c} von ${a} weg.`), { bild: B.menge(a, { weg: b + c }), nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${a} − (${b} + ${c})`) }); },
    () => { const [b, c] = suche(() => [zz(2, 5), zz(3, 5)], ([x, y]) => x !== y && 10 - x !== y);
      return zahl(Z('Rechne.', `(10 − ${b}) · ${c}`), (10 - b) * c, fehlerliste((10 - b) * c, [[10 - b * c, 'klammer-ignoriert']]),
        h3('Zuerst die Klammer.', '(10 − 6) · 2: Erst 10 − 6 = 4. Dann 4 · 2 = 8.', `10 − ${b} = ${10 - b}. Rechne jetzt ${10 - b} · ${c}.`), { bild: B.feld(10 - b, c), nachweis: N(`10 − ${b}`, `${10 - b} · ${c}`, `(10 − ${b}) · ${c}`) }); },
    () => { const [a, b, c] = suche(() => [zz(2, 4), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x + y <= 8);
      return auswahl(Z(`${a} + ${b} · ${c} und (${a} + ${b}) · ${c}`, `Welche Rechnung hat das Ergebnis ${(a + b) * c}?`), [opt(`(${a} + ${b}) · ${c}`, true), opt(`${a} + ${b} · ${c}`, false, 'klammer-ignoriert'), opt('Beide Rechnungen')],
        h3('Rechne beide Rechnungen aus. Die Klammer kommt zuerst.', '2 + 3 · 4 = 14. Aber (2 + 3) · 4 = 20.', `(${a} + ${b}) · ${c}: Erst ${a} + ${b} = ${a + b}.`), { bild: B.feld(a + b, c, a), nachweis: [WERT((a + b) * c), ...N(`(${a} + ${b}) · ${c}`, `${a} + ${b} · ${c}`)] }); },
    () => { const [a, b, c] = suche(() => [zz(2, 5), zz(2, 5), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x + y <= 9);
      return luecken(Z('Rechne.', `(${a} + ${b}) · ${c} = {{x}}`), { x: [(a + b) * c, fehlerliste((a + b) * c, [[a + b * c, 'klammer-ignoriert']])] },
        h3('Die Klammer zuerst.', '(3 + 1) · 5: 3 + 1 = 4. 4 · 5 = 20.', `${a} + ${b} = ${a + b}.`), { bild: B.feld(a + b, c, a), nachweis: N(`${a} + ${b}`, `${a + b} · ${c}`, `(${a} + ${b}) · ${c}`) }); },
  ]);

  stufen(T('T2'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(3, 9), zz(11, 19), zz(3, 9)], ([x, y, z]) => y - z >= 3 && y - z <= 12 && x !== y - z);
        return zahl(Z('Rechne.', `${a} · (${b} − ${c})`), a * (b - c), fehlerliste(a * (b - c), [[a * b - c, 'klammer-ignoriert']]),
          h3('Zuerst die Klammer.', '8 · (12 − 5): 12 − 5 = 7. 8 · 7 = 56.', `${b} − ${c} = ${b - c}.`), { bild: B.feld(a, b - c), nachweis: N(`${b} − ${c}`, `${a} · ${b - c}`, `${a} · (${b} − ${c})`) }); }
      if (k === 1) { const [d, q] = suche(() => [zz(3, 9), zz(4, 9)], ([x, y]) => x !== y), b = zz(5, Math.min(20, d * q - 5)), a = d * q - b;
        return zahl(Z('Rechne.', `(${a} + ${b}) : ${d}`), q, fehlerliste(q, [[a + b / d, 'klammer-ignoriert']].filter(([w]) => Number.isInteger(w))),
          h3('Zuerst die Klammer. Dann geteilt.', '(35 + 13) : 6: 35 + 13 = 48. 48 : 6 = 8.', `${a} + ${b} = ${a + b}.`), { nachweis: N(`${a} + ${b}`, `${a + b} : ${d}`, `(${a} + ${b}) : ${d}`) }); }
      const [b, c, m] = suche(() => [zz(3, 8), zz(2, 6), zz(2, 4)], ([x, y, z]) => (x + y) * z < 50), a = zz(5, 9) * 10;
      return zahl(Z('Rechne.', `${a} − (${b} + ${c}) · ${m}`), a - (b + c) * m, fehlerliste(a - (b + c) * m, [[(a - b - c) * m, 'punkt-vor-strich'], [a - b + c * m, 'klammer-ignoriert']].filter(([w]) => w > 0)),
        h3('Erst die Klammer. Dann das Mal. Zum Schluss das Minus.', '50 − (6 + 4) · 3: 6 + 4 = 10. 10 · 3 = 30. 50 − 30 = 20.', `${b} + ${c} = ${b + c}. ${b + c} · ${m} = ${(b + c) * m}.`), { nachweis: N(`${b} + ${c}`, `${b + c} · ${m}`, `${a} − ${(b + c) * m}`, `${a} − (${b} + ${c}) · ${m}`) });
    },
    2: (k) => {
      if (k === 0) { const [m, b, c] = suche(() => [zz(2, 5), zz(2, 6), zz(2, 6)], ([x, y, z]) => y !== z), a = zz(2, 4) * 10, inner = a - (b + c);
        return zahl(Z('Rechne.', `${m} · (${a} − (${b} + ${c}))`), m * inner, fehlerliste(m * inner, [[m * (a - b + c), 'klammer-innen-aussen'], [m * a - b - c, 'klammer-ignoriert']]),
          h3('Bei einer Klammer in der Klammer rechnest du die innere Klammer zuerst.', '3 · (20 − (4 + 6)): 4 + 6 = 10. 20 − 10 = 10. 3 · 10 = 30.', `Innen: ${b} + ${c} = ${b + c}.`), { nachweis: N(`${b} + ${c}`, `${a} − ${b + c}`, `${m} · ${inner}`, `${m} · (${a} − (${b} + ${c}))`) }); }
      const [a, b, c] = suche(() => [zz(2, 4), zz(2, 5), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x + y <= 9);
      return auswahl(Z('Setze eine Klammer.', 'Das Ergebnis soll am größten sein.', `${a} + ${b} · ${c}`), [opt(`(${a} + ${b}) · ${c}`, true), opt(`${a} + (${b} · ${c})`, false, 'klammer-ignoriert'), opt(`${a} + ${b} · ${c}`, false, 'klammer-ignoriert')].slice(0, 2).concat([opt(`(${a} · ${b}) + ${c}`)]),
        h3('Rechne jede Möglichkeit aus und vergleiche.', '2 + 4 · 5 = 22. Aber (2 + 4) · 5 = 30.', `(${a} + ${b}) · ${c}: Erst ${a} + ${b} = ${a + b}.`), { bild: B.feld(a + b, c, a), nachweis: [GROESSTES, ...N(`(${a} + ${b}) · ${c}`, `${a} + (${b} · ${c})`, `(${a} · ${b}) + ${c}`)] });
    },
    3: () => { const [a, b, c] = suche(() => [zz(3, 7), zz(2, 4), zz(3, 4)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x + y <= 10), k = kind(), falsch = a + b * c;
      return auswahl(Z(`${k} rechnet:`, `(${a} + ${b}) · ${c} = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Zuerst die Klammer: ${a} + ${b} = ${a + b}.`, `${a + b} · ${c} = ${(a + b) * c}.`), true),
        opt(Z('Stimmt.', 'Punkt vor Strich.'), false, 'klammer-ignoriert'),
        opt(Z('Falsch.', `Richtig ist ${a + b + c}.`), false, '1x1-addiert')],
      h3('Was kommt bei Klammern zuerst?', '(6 + 2) · 3: Erst 6 + 2 = 8. Dann 8 · 3 = 24.', `Rechne zuerst ${a} + ${b}.`), { bild: B.feld(a + b, c, a), nachweis: [U(false, `(${a} + ${b}) · ${c}`, falsch), ...N(`${a} + ${b}`, `${a + b} · ${c}`, `${a} + ${b} + ${c}`)] }); },
  });

  stufen(T('T2'), 'M', {
    1: (k) => {
      if (k === 0) { const [m, b, c, d] = suche(() => [zz(3, 9), zz(30, 60), zz(11, 25), zz(5, 20)], ([w, x, y]) => x - y > 5);
        return zahl(`Berechne ${m} · (${b} − ${c}) + ${d}.`, m * (b - c) + d, fehlerliste(m * (b - c) + d, [[m * b - c + d, 'klammer-ignoriert'], [m * (b - c + d), 'punkt-vor-strich']]),
          h2('Zuerst die Klammer, dann das Mal, dann das Plus.', `${b} − ${c} = ${b - c}.`), { nachweis: N(`${b} − ${c}`, `${m} · ${b - c}`, `${m * (b - c)} + ${d}`, `${m} · (${b} − ${c}) + ${d}`) }); }
      const [d, q, p, j] = suche(() => [zz(6, 9), zz(4, 9), zz(5, 9), zz(5, 9)], ([w, x, y, z]) => y !== z && w !== x), a = d * q + p * j;
      return zahl(`Berechne (${a} − ${p} · ${j}) : ${d}.`, q, fehlerliste(q, [[(a - p) * j / d, 'punkt-vor-strich']].filter(([w]) => Number.isInteger(w) && w !== q)),
        h2('In der Klammer gilt Punkt vor Strich.', `${p} · ${j} = ${p * j}. ${a} − ${p * j} = ${a - p * j}.`), { nachweis: N(`${p} · ${j}`, `${a} − ${p * j}`, `${a - p * j} : ${d}`, `(${a} − ${p} · ${j}) : ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [m, b, c] = suche(() => [zz(3, 8), zz(10, 15), zz(2, 6)], ([x, y, z]) => x * (y - z) < 100), inner = m * (b - c);
        return zahl(`Berechne 100 − ${m} · (${b} − ${c}).`, 100 - inner, fehlerliste(100 - inner, [[100 - m * b - c, 'klammer-ignoriert'], [(100 - m) * (b - c), 'punkt-vor-strich']].filter(([w]) => w >= 0)),
          h2('Erst die Klammer, dann das Mal, zum Schluss das Minus.', `${b} − ${c} = ${b - c}.`), { nachweis: N(`${b} − ${c}`, `${m} · ${b - c}`, `100 − ${inner}`, `100 − ${m} · (${b} − ${c})`) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(3, 9), zz(3, 9), zz(11, 19)], ([x, y, z]) => x !== y), ziel = a * (b + c);
        const liste = [`${a} · (${b} + ${c})`, `(${a} · ${b}) + ${c}`, `${a} · ${b} + ${c}`, `(${a} + ${b}) · ${c}`];
        if (liste.filter((t) => wert(t) === ziel).length !== 1) return null;
        return auswahl(`Wo muss die Klammer stehen, damit ${ziel} herauskommt?`, liste.map((t) => opt(t, wert(t) === ziel, t.includes('+ ' + c) && wert(t) !== ziel ? 'klammer-ignoriert' : undefined)),
          h2('Rechne jede Möglichkeit aus.', `${a} · (${b} + ${c}) = ${a} · ${b + c}.`), { nachweis: [WERT(ziel), ...N(...liste)] }); }
      const [p, x, r] = suche(() => [zz(3, 9), zz(5, 12), zz(3, 9)], ([y, z, w]) => z > w && y !== z);
      return zahl(`Welche Zahl fehlt? (▢ + ${r}) · ${p} = ${(x + r) * p}`, x, fehlerliste(x, [[((x + r) * p - r) / p, 'klammer-ignoriert']].filter(([w]) => Number.isInteger(w) && w !== x)),
        h2('Teile zuerst durch die Zahl hinter der Klammer.', `${(x + r) * p} : ${p} = ${x + r}. Also ist ▢ + ${r} = ${x + r}.`), { nachweis: N(`${(x + r) * p} : ${p}`, `${x + r} − ${r}`, `(${x} + ${r}) · ${p}`) });
    },
    3: () => { const [a, b, c] = suche(() => [zz(6, 9) * 10, zz(15, 30), zz(3, 9)], ([x, y, z]) => y > z), [k1, k2] = zweiKinder(), falsch = a - b - c;
      return auswahl(`${k1} rechnet ${a} − (${b} − ${c}) = ${falsch}. ${k2} rechnet ${a} − (${b} − ${c}) = ${a - (b - c)}. Wer hat recht?`, [
        opt(`${k2}. Zuerst die Klammer: ${b} − ${c} = ${b - c}. Dann ${a} − ${b - c} = ${a - (b - c)}.`, true),
        opt(`${k1}. Man darf die Klammer bei Minus einfach weglassen.`, false, 'klammer-ignoriert'),
        opt('Beide. Es kommt dasselbe heraus.', false, 'klammer-ignoriert'),
        opt(`Keiner. Richtig ist ${a - b + c + 10}.`)],
      h2('Rechne zuerst die Klammer aus.', `${b} − ${c} = ${b - c}.`), { nachweis: [U(false, `${a} − (${b} − ${c})`, falsch), ...N(`${b} − ${c}`, `${a} − ${b - c}`)] }); },
  });

  stufen(T('T2'), 'E', {
    1: () => { const [m, a, b, c] = suche(() => [zz(2, 5), zz(30, 60), zz(3, 8), zz(3, 7)], ([w, x, y, z]) => y !== z && x > (y + z) * z && x - (y + z) * z <= 30);
      return zahl(`Berechne ${m} · (${a} − (${b} + ${c}) · ${c}).`, m * (a - (b + c) * c), fehlerliste(m * (a - (b + c) * c), [[m * (a - b - c * c), 'klammer-ignoriert']].filter(([w]) => w > 0)),
        h1('Arbeite dich von der innersten Klammer nach außen vor.'), { nachweis: N(`${b} + ${c}`, `${b + c} · ${c}`, `${a} − ${(b + c) * c}`, `${m} · ${a - (b + c) * c}`, `${m} · (${a} − (${b} + ${c}) · ${c})`) }); },
    2: (k) => {
      if (k === 0) { const [d, q] = suche(() => [zz(4, 9), zz(3, 9)], ([x, y]) => x !== y), [b, m] = [zz(5, 20), zz(3, 6)], innen = d * q + 60, a = Math.round((innen / m)) ;
        if (!Number.isInteger(innen / m)) return null;
        const s = innen / m - b; if (s < 3) return null;
        return zahl(`Berechne ((${s} + ${b}) · ${m} − 60) : ${d}.`, q, fehlerliste(q, []),
          h1('Rechne von innen nach außen.'), { nachweis: N(`${s} + ${b}`, `${s + b} · ${m}`, `${innen} − 60`, `${d * q} : ${d}`, `((${s} + ${b}) · ${m} − 60) : ${d}`) }); }
      if (k === 1) { const [a, b, c, d] = suche(() => [zz(2, 4), zz(3, 6), zz(3, 6), zz(4, 7)], (x) => new Set(x).size === 4);
        const liste = [`${a} · (${b} + ${c}) · ${d}`, `(${a} · ${b} + ${c}) · ${d}`, `${a} · (${b} + ${c} · ${d})`, `${a} · ${b} + ${c} · ${d}`, `(${a} · ${b}) + (${c} · ${d})`];
        const werte = liste.map(wert), max = Math.max(...werte);
        if (werte.filter((w) => w === max).length !== 1) return null;
        return auswahl(`Wo setzt du Klammern in ${a} · ${b} + ${c} · ${d}, damit das Ergebnis am größten wird?`, liste.map((t) => opt(t, wert(t) === max)),
          h1('Je später du malnimmst, desto mehr wird vorher zusammengezählt.'), { nachweis: [GROESSTES, ...N(...liste)] }); }
      const [m, s, t] = suche(() => [zz(3, 6), zz(5, 12), zz(2, 6)], ([x, y, z]) => y > z), x = s + t, w = m * (x - t);
      return zahl(`Welche Zahl fehlt? ${m} · (▢ − ${t}) = ${w}`, x, fehlerliste(x, [[w / m - t, 'klammer-innen-aussen']].filter(([v]) => v > 0 && v !== x)),
        h1('Rechne rückwärts: Was steht in der Klammer?'), { nachweis: N(`${w} : ${m}`, `${s} + ${t}`, `${m} · (${x} − ${t})`) });
    },
    3: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(3, 9), zz(3, 9), zz(3, 9)], (x) => new Set(x).size === 3);
        return auswahl(`Braucht man in ${a} + (${b} · ${c}) die Klammer?`, [
          opt(`Nein. Wegen Punkt vor Strich ist auch ${a} + ${b} · ${c} = ${a + b * c}.`, true),
          opt(`Ja. Ohne Klammer ist es ${(a + b) * c}.`, false, 'punkt-vor-strich'),
          opt('Ja. Klammern darf man nie weglassen.'),
          opt('Nein. Klammern ändern nie etwas.', false, 'klammer-ignoriert'),
          opt('Das kann man nicht sagen.')],
        h1('Rechne mit und ohne Klammer und vergleiche.'), { nachweis: [U(false), ...N(`${a} + (${b} · ${c})`, `${a} + ${b} · ${c}`)] }); }
      const [a, b, c] = suche(() => [zz(6, 9) * 10, zz(15, 30), zz(3, 9)], ([x, y, z]) => y > z), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „In (${a} − ${b}) − ${c} darf man die Klammer weglassen.“ ${k2} sagt: „In ${a} − (${b} − ${c}) darf man die Klammer weglassen.“ Wer hat recht?`, [
        opt(`Nur ${k1}. (${a} − ${b}) − ${c} = ${a - b - c} und ${a} − ${b} − ${c} = ${a - b - c}. Aber ${a} − (${b} − ${c}) = ${a - b + c}.`, true),
        opt(`Nur ${k2}. Die Klammer hinten ist egal.`, false, 'klammer-ignoriert'),
        opt('Beide. Bei Minus darf man Klammern immer weglassen.', false, 'klammer-ignoriert'),
        opt('Keiner. Klammern darf man nie weglassen.'),
        opt(`Beide. Es kommt immer ${a - b - c} heraus.`, false, 'klammer-ignoriert')],
      h1('Rechne alle drei Fassungen aus.'), { nachweis: N(`(${a} − ${b}) − ${c}`, `${a} − ${b} − ${c}`, `${a} − (${b} − ${c})`) }); },
  });

  // ===================================================================
  // T3 Text zu Rechenausdruck
  // ===================================================================
  sechs(T('T3'), 'F', [
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3), k = kind();
      return auswahl(Z(`${k} hat ${e} Murmeln.`, `Dazu bekommt ${k} ${p} Tüten mit je ${j} Murmeln.`, 'Welche Rechnung passt?'), [opt(`${e} + ${p} · ${j}`, true), opt(`(${e} + ${p}) · ${j}`, false, 'punkt-vor-strich'), opt(`${e} + ${p} + ${j}`, false, '1x1-addiert')],
        h3('Gleich viele in jeder Tüte: mal. Die einzelnen Murmeln: plus.', '2 Murmeln und 3 Tüten mit je 5: 2 + 3 · 5.', `${p} Tüten mit je ${j} sind ${p} · ${j}.`), { bild: B.paeckchen(e, p, j), nachweis: [WERT(e + p * j), ...N(`${p} · ${j}`, `${e} + ${p * j}`)] }); },
    () => { const [e, p, j] = suche(() => [zz(2, 8), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3), k = kind();
      return zahl(Z(`${k} hat ${e} Sticker.`, `${k} kauft ${p} Päckchen mit je ${j} Stickern.`, `Wie viele Sticker hat ${k} jetzt?`), e + p * j, fehlerliste(e + p * j, [[(e + p) * j, 'punkt-vor-strich']]),
        h3('Rechne zuerst die Päckchen.', '3 Sticker und 2 Päckchen mit je 5: 2 · 5 = 10. 3 + 10 = 13.', `${p} · ${j} = ${p * j}. Rechne jetzt ${e} + ${p * j}.`), { einheit: 'Sticker', bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`) }); },
    () => { const [e, p, j] = suche(() => [zz(2, 4), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return auswahl(Z(`Es gibt ${p} Päckchen mit je ${j} Plättchen.`, `Dazu kommen ${e} Plättchen.`, 'Welche Rechnung passt?'), [opt(`${p} · ${j} + ${e}`, true), opt(`${p} · (${j} + ${e})`, false, 'punkt-vor-strich'), opt(`${p} + ${j} + ${e}`, false, '1x1-addiert')],
        h3('Die Päckchen sind ein Mal. Die einzelnen Plättchen sind ein Plus.', '3 Päckchen mit je 4 und dazu 2: 3 · 4 + 2.', `${p} Päckchen mit je ${j}: ${p} · ${j}.`), { bild: B.paeckchen(e, p, j), nachweis: [WERT(p * j + e), ...N(`${p} · ${j}`, `${p * j} + ${e}`)] }); },
    () => { const [h, p] = suche(() => [zz(2, 4), zz(2, 3)], ([x, y]) => x !== y), k = kind();
      return zahl(Z(`${k} hat 20 €.`, `${k} kauft ${h} Hefte.`, `1 Heft kostet ${p} €.`, 'Wie viel Geld hat sie noch?'.replace('sie', k)), 20 - h * p, fehlerliste(20 - h * p, [[(20 - h) * p, 'punkt-vor-strich']]),
        h3('Rechne zuerst, was die Hefte kosten.', '2 Hefte zu je 3 €: 2 · 3 = 6 €. 20 − 6 = 14 €.', `Die Hefte kosten ${h} · ${p} = ${h * p} €.`), { einheit: '€', bild: B.menge(20, { weg: h * p }), nachweis: N(`${h} · ${p}`, `20 − ${h * p}`) }); },
    () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(3, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return auswahl(Z(`Welche Geschichte passt zu ${e} + ${p} · ${j}?`), [
        opt(`Ich habe ${e} Stifte. Ich kaufe ${p} Packungen mit je ${j} Stiften.`, true),
        opt(`Ich habe ${e} Packungen und ${p} Packungen mit je ${j} Stiften.`, false, 'punkt-vor-strich'),
        opt(`Ich habe ${e} Stifte, ${p} Stifte und ${j} Stifte.`, false, '1x1-addiert')],
      h3('Mal heißt: gleich viele in jeder Packung.', '2 + 3 · 4: 2 einzelne und 3 Packungen mit je 4.', `${p} · ${j} heißt: ${p} Packungen mit je ${j}.`), { bild: B.paeckchen(e, p, j), nachweis: N(`${p} · ${j}`, `${e} + ${p * j}`) }); },
    () => { const [n, l] = suche(() => [zz(3, 5), zz(2, 5)], ([x, y]) => x !== y);
      return zahl(Z('In 1 Kiste sind 6 Flaschen.', `Es gibt ${n} Kisten.`, `${l} Flaschen sind leer.`, 'Wie viele Flaschen sind voll?'), n * 6 - l, fehlerliste(n * 6 - l, [[n * (6 - l), 'punkt-vor-strich']]),
        h3('Rechne zuerst alle Flaschen. Nimm dann die leeren weg.', '2 Kisten mit je 6 Flaschen: 12 Flaschen. 3 sind leer: 12 − 3 = 9.', `${n} · 6 = ${n * 6}. Rechne ${n * 6} − ${l}.`), { einheit: 'Flaschen', bild: B.gruppen(n, 6), nachweis: N(`${n} · 6`, `${n * 6} − ${l}`) }); },
  ]);

  stufen(T('T3'), 'G', {
    1: (k) => {
      if (k === 0) { const [b, p, m] = [zz(3, 6), wahl([25, 30, 35, 40]), wahl([80, 90, 110])], kn = kind();
        return auswahl(Z(`${kn} kauft ${b} Brötchen zu je ${p} Cent.`, `Dazu kauft ${kn} eine Milch für ${m} Cent.`, 'Welcher Rechenausdruck passt?'), [opt(`${b} · ${p} + ${m}`, true), opt(`${b} · (${p} + ${m})`, false, 'punkt-vor-strich'), opt(`${b} + ${p} + ${m}`, false, '1x1-addiert')],
          h3('Gleich viele Brötchen zum gleichen Preis: mal. Die Milch kommt dazu: plus.', '2 Brezeln zu je 50 Cent und ein Saft für 70 Cent: 2 · 50 + 70.', `Die Brötchen kosten ${b} · ${p}.`), { nachweis: [WERT(b * p + m), ...N(`${b} · ${p}`, `${b * p} + ${m}`)] }); }
      if (k === 1) { const [n, e, p] = suche(() => [zz(3, 9), zz(6, 9), zz(2, 4)], ([x, y, z]) => x !== y);
        return zahl(Z(`${n} Kinder gehen ins Kino.`, `Eine Karte kostet ${e} €.`, `Jedes Kind kauft noch Popcorn für ${p} €.`, 'Wie viel bezahlen alle zusammen?'), n * (e + p), fehlerliste(n * (e + p), [[n * e + p, 'punkt-vor-strich']]),
          h3('Rechne zuerst, was ein Kind bezahlt.', '4 Kinder, Karte 5 €, Popcorn 2 €: (5 + 2) · 4 = 28 €.', `Ein Kind bezahlt ${e} + ${p} = ${e + p} €.`), { einheit: '€', nachweis: N(`${e} + ${p}`, `${n} · ${e + p}`) }); }
      const [a, b, m] = suche(() => [zz(3, 7), zz(2, 5), zz(3, 9)], ([x, y, z]) => x + y <= 12 && x !== y && z !== x + y);
      return zahl(Z(`Addiere ${a} und ${b}.`, `Nimm das Ergebnis mal ${m}.`), (a + b) * m, fehlerliste((a + b) * m, [[a + b * m, 'klammer-ignoriert']]),
        h3('Das Ergebnis der ersten Rechnung kommt in eine Klammer.', 'Addiere 2 und 3, nimm mal 4: (2 + 3) · 4 = 20.', `(${a} + ${b}) · ${m}. Rechne zuerst ${a} + ${b}.`), { bild: B.feld(a + b, m, a), nachweis: N(`${a} + ${b}`, `${a + b} · ${m}`) });
    },
    2: (k) => {
      if (k === 0) { const [e, p, j] = suche(() => [zz(2, 9), zz(2, 5), zz(3, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && new Set([x + y * z, (x + y) * z, x * y + z]).size === 3);
        return auswahl('Welcher Rechenausdruck passt zum Bild?', [opt(`${e} + ${p} · ${j}`, true), opt(`(${e} + ${p}) · ${j}`, false, 'punkt-vor-strich'), opt(`${e} · ${p} + ${j}`)],
          h3('Die vollen Päckchen sind ein Mal. Die einzelnen Plättchen kommen dazu.', '3 einzelne und 2 Päckchen mit je 4: 3 + 2 · 4.', `Es sind ${p} Päckchen mit je ${j} Plättchen.`), { bild: B.paeckchen(e, p, j), nachweis: [WERT(e + p * j), ...N(`${p} · ${j}`, `${e} + ${p * j}`)] }); }
      const [b, p] = suche(() => [zz(2, 4), zz(8, 15)], ([x, y]) => x * y < 50), g = 50, kn = kind();
      return zahl(Z(`${kn} hat ${g} €.`, `${kn} kauft ${b} Bücher zu je ${p} €.`, `Wie viel Geld bleibt ${kn}?`), g - b * p, fehlerliste(g - b * p, [[(g - b) * p, 'punkt-vor-strich'], [g - p, 'sach-schritt-vergessen']]),
        h3('Rechne zuerst, was alle Bücher kosten.', '2 Bücher zu je 15 €: 2 · 15 = 30 €. 50 − 30 = 20 €.', `Die Bücher kosten ${b} · ${p} = ${b * p} €.`), { einheit: '€', nachweis: N(`${b} · ${p}`, `${g} − ${b * p}`) });
    },
    3: () => { const [e, p, j] = suche(() => [zz(2, 6), zz(2, 4), zz(2, 4)], ([x, y, z]) => new Set([x, y, z]).size === 3), kn = kind();
      return auswahl(Z(`Die Geschichte heißt: Ich habe ${e} € und bekomme ${p}-mal ${j} €.`, `${kn} schreibt (${e} + ${p}) · ${j}.`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Nur die ${p}-mal ${j} € sind ein Mal: ${e} + ${p} · ${j} = ${e + p * j}.`), true),
        opt(Z('Stimmt.', 'Man rechnet die Zahlen der Reihe nach.'), false, 'punkt-vor-strich'),
        opt(Z('Falsch.', `Richtig ist ${e} + ${p} + ${j}.`), false, '1x1-addiert')],
      h3('Welcher Teil der Geschichte ist ein Mal?', '3 € und 2-mal 4 €: 3 + 2 · 4 = 11 €.', `${p}-mal ${j} € ist ${p} · ${j}.`), { bild: B.paeckchen(e, p, j), nachweis: [U(false), ...N(`${p} · ${j}`, `${e} + ${p * j}`)] }); },
  });

  stufen(T('T3'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b, g] = suche(() => [zz(4, 9), zz(6, 12), zz(70, 130)], ([x, y, z]) => z > x * y && x !== y);
        return auswahl(`Schreibe als Rechenausdruck: Subtrahiere das Produkt von ${a} und ${b} von ${g}.`, [opt(`${g} − ${a} · ${b}`, true), opt(`${a} · ${b} − ${g}`, false, 'begriffe-verwechselt'), opt(`(${g} − ${a}) · ${b}`, false, 'punkt-vor-strich'), opt(`${g} − ${a} + ${b}`, false, 'begriffe-verwechselt')],
          h2('Das Produkt ist das Ergebnis einer Mal-Aufgabe. Es wird von der Zahl abgezogen.', `Das Produkt ist ${a} · ${b}.`), { nachweis: [WERT(g - a * b), ...N(`${a} · ${b}`, `${g} − ${a * b}`)] }); }
      const [d, q] = suche(() => [zz(4, 9), zz(5, 12)], ([x, y]) => x !== y), b = zz(11, d * q - 11), a = d * q - b;
      return zahl(`Dividiere die Summe von ${a} und ${b} durch ${d}.`, q, fehlerliste(q, [[a + b / d, 'klammer-ignoriert']].filter(([w]) => Number.isInteger(w))),
        h2('Die Summe kommt in eine Klammer.', `(${a} + ${b}) : ${d}.`), { nachweis: N(`${a} + ${b}`, `${a + b} : ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [r, p, l] = suche(() => [zz(10, 16), zz(14, 22), zz(15, 45)], ([x, y, z]) => x !== y);
        return zahl(`Ein Kino hat ${r} Reihen mit je ${p} Plätzen. Bei einer Vorstellung bleiben ${l} Plätze leer. Wie viele Besucher sind im Kino?`, r * p - l, fehlerliste(r * p - l, [[r * (p - l), 'punkt-vor-strich']].filter(([w]) => w > 0)),
          h2('Schreibe einen Rechenausdruck mit Punkt vor Strich.', `${r} · ${p} − ${l}.`), { einheit: 'Besucher', nachweis: N(`${r} · ${p}`, `${r * p} − ${l}`) }); }
      if (k === 1) { const [n, t, h] = suche(() => [zz(2, 5), zz(9, 15), zz(19, 35)], ([x, y]) => x !== y), kn = kind();
        return luecken(`Ein T-Shirt kostet ${t} €, eine Hose kostet ${h} €. ${kn} kauft ${n} T-Shirts und eine Hose. Ergänze den Rechenausdruck: ${n} · {{a}} + {{b}} = {{c}}`, { a: t, b: h, c: [n * t + h, fehlerliste(n * t + h, [[n * (t + h), 'punkt-vor-strich']])] },
          h2('Gleich teure T-Shirts: mal. Die Hose kommt dazu.', `${n} · ${t} = ${n * t}.`), { nachweis: N(`${n} · ${t}`, `${n * t} + ${h}`) }); }
      const [n, e, b] = suche(() => [zz(18, 28), zz(4, 8), zz(2, 4)], ([x, y, z]) => y !== z);
      return auswahl(`Für einen Ausflug zahlt jedes der ${n} Kinder ${e} € Eintritt und ${b} € für den Bus. Welcher Rechenausdruck passt nicht?`, [
        opt(`${n} · ${e} + ${b}`, true), opt(`${n} · (${e} + ${b})`), opt(`${n} · ${e} + ${n} · ${b}`), opt(`${n} · ${e + b}`)],
      h2('Jedes Kind zahlt beides. Prüfe, ob der Bus bei jedem Ausdruck für alle Kinder gezählt wird.', `Ein Kind zahlt ${e} + ${b} = ${e + b} €.`), { nachweis: N(`${e} + ${b}`, `${n} · ${e} + ${b}`) });
    },
    3: () => { const [a, m, n] = suche(() => [zz(5, 9) * 10, zz(3, 5), zz(6, 9)], ([x, y, z]) => x > y * z), [k1, k2] = zweiKinder();
      const mal = { 3: 'Dreifache', 4: 'Vierfache', 5: 'Fünffache' }[m];
      return auswahl(`Zur Aufgabe „Ziehe von ${a} das ${mal} von ${n} ab“ schreibt ${k1} ${a} − ${m} · ${n} und ${k2} (${a} − ${m}) · ${n}. Wer hat recht?`, [
        opt(`${k1}. Das ${mal} von ${n} ist ${m} · ${n} = ${m * n}. ${a} − ${m * n} = ${a - m * n}.`, true),
        opt(`${k2}. Man rechnet in der Reihenfolge des Textes.`, false, 'punkt-vor-strich'),
        opt('Beide. Beide Ausdrücke haben dasselbe Ergebnis.', false, 'punkt-vor-strich'),
        opt(`Keiner. Richtig ist ${a} − ${m} − ${n}.`)],
      h2('Was wird abgezogen?', `Das ${mal} von ${n} ist ${m} · ${n}.`), { nachweis: N(`${m} · ${n}`, `${a} − ${m * n}`, `(${a} − ${m}) · ${n}`) }); },
  });

  stufen(T('T3'), 'E', {
    1: () => { const [a, b, c, d] = suche(() => [zz(60, 99), zz(21, 45), zz(4, 9), zz(5, 12)], ([w, x]) => w - x > 20);
      return zahl(`Multipliziere die Differenz von ${a} und ${b} mit der Summe von ${c} und ${d}.`, (a - b) * (c + d), fehlerliste((a - b) * (c + d), [[a - b * c + d, 'klammer-ignoriert']].filter(([w]) => w > 0)),
        h1('Differenz und Summe kommen je in eine Klammer.'), { nachweis: N(`${a} − ${b}`, `${c} + ${d}`, `${a - b} · ${c + d}`) }); },
    2: (k) => {
      if (k === 0) { const [n, e, m] = suche(() => [zz(22, 29), zz(5, 9), zz(4, 8)], ([x, y, z]) => y !== z), bus = n * m;
        return zahl(`Eine Klasse mit ${n} Kindern fährt in den Zoo. Der Eintritt kostet für jedes Kind ${e} €. Der Bus kostet für alle zusammen ${bus} €. Die Kosten werden gerecht verteilt. Wie viel muss jedes Kind bezahlen?`, e + m, fehlerliste(e + m, [[n * e + m, 'punkt-vor-strich'], [e + bus, 'sach-schritt-vergessen']]),
          h1('Schreibe zuerst einen Rechenausdruck für die Gesamtkosten.'), { einheit: '€', nachweis: N(`${n} · ${e}`, `${n * e} + ${bus}`, `${n * e + bus} : ${n}`) }); }
      if (k === 1) { const [a, b, d, q] = suche(() => [zz(11, 15), zz(4, 6), zz(3, 6), zz(6, 12)], ([w, x, y, z]) => y !== z);
        const liste = [`${a} · ${b} + ${d * q} : ${d}`, `(${a} · ${b} + ${d * q}) : ${d}`, `${a} · (${b} + ${d * q}) : ${d}`, `${a} + ${b} · ${d * q} : ${d}`, `${a} · ${b} + ${d * q} · ${d}`];
        const ziel = a * b + q; if (liste.some((t) => Number.isNaN(wert(t))) || liste.filter((t) => wert(t) === ziel).length !== 1) return null;
        return auswahl(`Welcher Rechenausdruck passt? Addiere zum Produkt von ${a} und ${b} den Quotienten aus ${d * q} und ${d}.`, liste.map((t) => opt(t, wert(t) === ziel)),
          h1('Produkt und Quotient sind beide Punktrechnungen. Braucht man dann eine Klammer?'), { nachweis: [WERT(ziel), ...N(...liste)] }); }
      const [x, p, m] = [zz(4, 12), zz(3, 9), zz(3, 6)], erg = (x + p) * m;
      return zahl(`Ich denke mir eine Zahl. Ich addiere ${p} und nehme das Ergebnis mal ${m}. Ich erhalte ${erg}. Welche Zahl habe ich mir gedacht?`, x, fehlerliste(x, [[erg / m + p, 'klammer-innen-aussen']].filter(([w]) => w !== x)),
        h1('Rechne rückwärts: zuerst die letzte Rechnung umkehren.'), { nachweis: N(`${erg} : ${m}`, `${x + p} − ${p}`, `(${x} + ${p}) · ${m}`) });
    },
    3: (k) => {
      if (k === 0) { const [g, a, m] = suche(() => [zz(3, 6) * 10, zz(3, 8), zz(3, 5)], ([x, y, z]) => x > y);
        return auswahl(`Welche Geschichte passt zu (${g} − ${a}) · ${m}?`, [
          opt(`Ein Paket wiegt ${g} kg. Davon werden ${a} kg ausgepackt. ${m} solche Pakete werden verschickt.`, true),
          opt(`Ein Paket wiegt ${g} kg. ${m} Pakete mit je ${a} kg werden davon ausgepackt.`, false, 'punkt-vor-strich'),
          opt(`Ich habe ${g} €. Ich gebe ${a} € aus und dann noch ${m} €.`, false, 'begriffe-verwechselt'),
          opt(`Ich habe ${g} €. Ich bekomme ${m}-mal ${a} € dazu.`, false, 'begriffe-verwechselt'),
          opt('Keine Geschichte passt.')],
        h1('Was rechnet man zuerst, und was wird danach malgenommen?'), { nachweis: N(`${g} − ${a}`, `${g - a} · ${m}`) }); }
      const [n, h, s] = suche(() => [zz(3, 9), zz(2, 4), zz(1, 3)], ([x, y, z]) => y !== z), [k1, k2] = zweiKinder();
      return auswahl(`Für ${n} Hefte zu je ${h} € und ${n} Stifte zu je ${s} € schreibt ${k1} ${n} · ${h} + ${s}. ${k2} schreibt ${n} · (${h} + ${s}). Wer hat recht?`, [
        opt(`${k2}. Jedes Heft und jeder Stift wird ${n}-mal gekauft: ${n} · ${h + s} = ${n * (h + s)}.`, true),
        opt(`${k1}. Punkt vor Strich.`, false, 'punkt-vor-strich'),
        opt('Beide. Die Ausdrücke sind gleich.', false, 'punkt-vor-strich'),
        opt(`Keiner. Richtig ist ${n} + ${h} + ${s}.`, false, '1x1-addiert'),
        opt(`${k1}. Die Stifte kosten nur ${s} €.`, false, 'punkt-vor-strich')],
      h1('Rechne aus, was die Stifte zusammen kosten.'), { nachweis: [HILFSZAHL(n, 'Anzahl'), ...N(`${h} + ${s}`, `${n} · ${h + s}`, `${n} · ${h}`, `${n} · ${s}`)] }); },
  });
}
