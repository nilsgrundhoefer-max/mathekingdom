// Aufgaben zu 5.4.7 „Verteilungsgesetz“ (Lernziele V1 bis V3) nach ADR 0015.
//   F  geteiltes Punktefeld (oben ein Teil, unten der andere) und Malkreuz, ohne die Wörter ausmultiplizieren und ausklammern
//   G  Verteilungsgesetz benennen und in beide Richtungen nutzen, auch mit Minus
//   M  ausmultiplizieren und ausklammern mit größeren Zahlen, Fehler finden
//   E  zwei Summen malnehmen, Gegenbeispiele, Begründungen

import { sechs, stufen, zahl, auswahl, opt, luecken, malkreuz, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, HILFSZAHL, fz } from '../werkzeug.mjs';

const V = (kurz) => `5.4.7-${kurz}`;
// Zwei Teile für das geteilte Punktefeld: zusammen höchstens 12 Reihen.
const teile = (min = 2) => suche(() => [zz(min, 9), zz(2, 5)], ([a, b]) => a + b <= 12 && a !== b);

export function verteilungsgesetz() {
  // ===================================================================
  // V1 Ausmultiplizieren
  // ===================================================================
  sechs(V('V1'), 'F', [
    () => { const [a, z, e] = suche(() => [zz(3, 6), 10, zz(2, 5)], ([x, , y]) => x !== y);
      return malkreuz(Z(`${a} · (10 + ${e}) = ${a} · ${10 + e}`, 'Rechne mit dem Malkreuz.'), [a], [10, e],
        h3('Nimm beide Teile in der Klammer mal. Rechne dann zusammen.', '3 · (10 + 4): 3 · 10 = 30 und 3 · 4 = 12. Zusammen 42.', `${a} · 10 = ${a * 10}. Rechne jetzt ${a} · ${e}.`), { fehler: fehlerliste(a * (10 + e), [[a * 10 + e, 'verteilung-halb']]) }); },
    () => { const [a, c] = suche(() => [zz(3, 6), wahl([1, 2])], ([x]) => x !== 2);
      return luecken(Z('Welche Zahl fehlt?', `(10 + ${c}) · ${a} = 10 · ${a} + {{x}} · ${a}`), { x: [c, fehlerliste(c, [[c * a, 'verteilung-halb']])] },
        h3('Im Bild sind oben 10 Reihen. Unten sind die anderen Reihen.', '(10 + 2) · 3 = 10 · 3 + 2 · 3.', `Zähle die Reihen unter der Lücke.`), { bild: B.feld(10 + c, a, 10), nachweis: N(`(10 + ${c}) · ${a}`, `10 · ${a}`, `${c} · ${a}`, `${10 * a} + ${c * a}`) }); },
    () => { const [a, b] = teile(), c = suche(() => zz(3, 6), (x) => x !== a && x !== b);
      return zahl(Z('Rechne.', `(${a} + ${b}) · ${c}`, `Rechne ${a} · ${c} und ${b} · ${c}.`, 'Rechne dann zusammen.'), (a + b) * c, fehlerliste((a + b) * c, [[a * c + b, 'verteilung-halb']]),
        h3('Oben im Bild ist ein Teil, unten der andere.', '(5 + 2) · 3: 5 · 3 = 15 und 2 · 3 = 6. Zusammen 21.', `${a} · ${c} = ${a * c}. Rechne jetzt ${b} · ${c}.`), { bild: B.feld(a + b, c, a), nachweis: N(`${a} · ${c}`, `${b} · ${c}`, `${a * c} + ${b * c}`, `(${a} + ${b}) · ${c}`) }); },
    () => { const [a, b] = teile(), c = suche(() => zz(3, 6), (x) => x !== a && x !== b);
      return auswahl(Z('Welche Rechnung passt zum Bild?'), [opt(`${a} · ${c} + ${b} · ${c}`, true), opt(`${a} + ${b} · ${c}`, false, 'verteilung-halb'), opt(`${a} · ${c} + ${b}`, false, 'verteilung-halb')],
        h3('Zähle die Reihen oben und unten. In jeder Reihe sind gleich viele Punkte.', '3 Reihen oben, 2 Reihen unten, je 4 Punkte: 3 · 4 + 2 · 4.', `Oben sind ${a} Reihen mit je ${c} Punkten.`), { bild: B.feld(a + b, c, a), nachweis: [WERT((a + b) * c), ...N(`${a} · ${c}`, `${b} · ${c}`, `${a * c} + ${b * c}`)] }); },
    () => { const [a, b] = teile(), c = suche(() => zz(3, 7), (x) => x !== a && x !== b);
      return luecken(Z('Ergänze.', `(${a} + ${b}) · ${c} = ${a} · ${c} + {{a}} · {{b}}`), { a: [b, fehlerliste(b, [[a + b, 'verteilung-halb']])], b: c },
        h3('Beide Teile werden mit derselben Zahl malgenommen.', '(4 + 3) · 5 = 4 · 5 + 3 · 5.', `Der zweite Teil ist ${b}.`), { bild: B.feld(a + b, c, a), nachweis: N(`(${a} + ${b}) · ${c}`, `${a} · ${c} + ${b} · ${c}`) }); },
    () => { const a = suche(() => zz(3, 9), (x) => x !== 4);
      return malkreuz(Z(`Rechne ${a} · 12 mit dem Malkreuz.`, 'Zerlege 12 in 10 und 2.'), [a], [10, 2],
        h3('Nimm beide Teile mal. Rechne dann zusammen.', '4 · 12: 4 · 10 = 40 und 4 · 2 = 8. Zusammen 48.', `${a} · 10 = ${a * 10}. Rechne jetzt ${a} · 2.`), { fehler: fehlerliste(a * 12, [[a * 10 + 2, 'verteilung-halb']]) }); },
  ]);

  stufen(V('V1'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, b] = teile(5), c = suche(() => zz(4, 9), (x) => x !== a && x !== b);
        return luecken(Z('Rechne mit dem Verteilungsgesetz.', `(${a} + ${b}) · ${c} = ${a} · ${c} + ${b} · ${c}`, `= {{a}} + {{b}} = {{c}}`), { a: a * c, b: b * c, c: [(a + b) * c, fehlerliste((a + b) * c, [[a * c + b, 'verteilung-halb']])] },
          h3('Jeder Teil der Klammer wird malgenommen.', '(8 + 4) · 6 = 8 · 6 + 4 · 6 = 48 + 24 = 72.', `${a} · ${c} = ${a * c}.`), { bild: B.feld(a + b, c, a), nachweis: N(`${a} · ${c}`, `${b} · ${c}`, `${a * c} + ${b * c}`, `(${a} + ${b}) · ${c}`) }); }
      if (k === 1) { const [a, z, e] = suche(() => [zz(3, 9), zz(2, 6) * 10, zz(2, 9)], ([x, , y]) => x !== y);
        return malkreuz(Z(`${a} · ${z + e} = ${a} · (${z} + ${e})`, 'Rechne mit dem Malkreuz.'), [a], [z, e],
          h3('Nimm beide Teile mal und addiere.', '7 · (30 + 4): 7 · 30 = 210 und 7 · 4 = 28. Zusammen 238.', `${a} · ${z} = ${a * z}.`), { fehler: fehlerliste(a * (z + e), [[a * z + e, 'verteilung-halb']]) }); }
      const [a, z, e] = suche(() => [zz(3, 9), zz(2, 8) * 10, zz(2, 9)], ([x, , y]) => x !== y);
      return zahl(Z('Rechne mit dem Verteilungsgesetz.', `${a} · (${z} + ${e})`), a * (z + e), fehlerliste(a * (z + e), [[a * z + e, 'verteilung-halb']]),
        h3('Nimm jeden Teil der Klammer mal. Addiere dann.', '5 · (40 + 7) = 5 · 40 + 5 · 7 = 200 + 35 = 235.', `${a} · ${z} = ${a * z} und ${a} · ${e} = ${a * e}.`), { nachweis: N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a} · (${z} + ${e})`) });
    },
    2: (k) => {
      if (k === 0) { const [a, z, e] = suche(() => [zz(3, 9), zz(2, 6) * 10, zz(2, 9)], ([x, , y]) => x !== y);
        return auswahl(Z(`Welche Rechnung ist dasselbe wie ${a} · (${z} + ${e})?`), [opt(`${a} · ${z} + ${a} · ${e}`, true), opt(`${a} · ${z} + ${e}`, false, 'verteilung-halb'), opt(`${a} + ${z} · ${e}`)],
          h3('Beide Teile der Klammer werden malgenommen.', '8 · (30 + 5) = 8 · 30 + 8 · 5.', `Auch ${e} wird mit ${a} malgenommen.`), { nachweis: [WERT(a * (z + e)), ...N(`${a} · (${z} + ${e})`, `${a} · ${z} + ${a} · ${e}`)] }); }
      const [a, b] = teile(5), c = suche(() => zz(4, 9), (x) => x !== a && x !== b);
      return luecken(Z('Schau ins Bild.', `(${a} + ${b}) · ${c} = {{a}} · ${c} + {{b}} · ${c}`), { a, b },
        h3('Oben im Bild ist der erste Teil. Unten ist der zweite Teil.', '(7 + 5) · 9 = 7 · 9 + 5 · 9.', `Oben sind ${a} Reihen.`), { bild: B.feld(a + b, c, a), nachweis: N(`(${a} + ${b}) · ${c}`, `${a} · ${c} + ${b} · ${c}`) });
    },
    3: () => { const [a, z, e] = suche(() => [zz(3, 6), wahl([20, 25, 30]), zz(2, 4)], ([x, , y]) => x !== y), k = kind(), falsch = a * z + e;
      return auswahl(Z(`${k} rechnet:`, `${a} · (${z} + ${e}) = ${a * z} + ${e} = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Auch ${e} muss mit ${a} malgenommen werden.`, `${a * z} + ${a * e} = ${a * (z + e)}.`), true),
        opt(Z('Stimmt.', `${a} · ${z} = ${a * z}.`), false, 'verteilung-halb'),
        opt(Z('Falsch.', `Zuerst kommt das Plus: ${a} + ${z} = ${a + z}.`, `Richtig ist ${a + z} · ${e} = ${(a + z) * e}.`))],
      h3('Jeder Teil der Klammer wird malgenommen.', '4 · (25 + 3) = 4 · 25 + 4 · 3 = 100 + 12 = 112.', `Rechne ${a} · ${e}.`), { nachweis: [U(false, `${a} · (${z} + ${e})`, falsch), ...N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a * z} + ${e}`, `(${a} + ${z}) · ${e}`)] }); },
  });

  stufen(V('V1'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, z, e] = suche(() => [zz(4, 9), zz(3, 9) * 10, zz(2, 9)], ([x, , y]) => x !== y);
        return luecken(`Multipliziere aus und rechne: ${a} · (${z} + ${e}) = {{a}} + {{b}} = {{c}}`, { a: a * z, b: a * e, c: [a * (z + e), fehlerliste(a * (z + e), [[a * z + e, 'verteilung-halb']])] },
          h2('Jeder Summand in der Klammer wird mit dem Faktor davor malgenommen.', `${a} · ${z} = ${a * z}.`), { nachweis: N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a} · (${z} + ${e})`) }); }
      const [a, e] = suche(() => [zz(4, 9), zz(2, 4)], ([x, y]) => x !== y);
      return zahl(`Multipliziere aus und berechne: ${a} · (100 − ${e})`, a * (100 - e), fehlerliste(a * (100 - e), [[a * 100 - e, 'verteilung-halb']]),
        h2('Das Verteilungsgesetz gilt auch bei Minus.', `${a} · 100 = ${a * 100} und ${a} · ${e} = ${a * e}.`), { nachweis: N(`${a} · 100`, `${a} · ${e}`, `${a * 100} − ${a * e}`, `${a} · (100 − ${e})`) });
    },
    2: (k) => {
      if (k === 0) { const [z1, e1, z2, e2] = suche(() => [zz(1, 4) * 10, zz(2, 9), zz(2, 6) * 10, zz(2, 9)], ([w, x, y, z]) => w !== y && x !== z);
        return malkreuz(`Rechne ${z1 + e1} · ${z2 + e2} mit dem Malkreuz. Zerlege beide Faktoren: (${z1} + ${e1}) · (${z2} + ${e2}).`, [z1, e1], [z2, e2],
          h2('Jeder Teil wird mit jedem Teil malgenommen. Das sind vier Felder.', `${z1} · ${z2} = ${z1 * z2}.`), { fehler: fehlerliste((z1 + e1) * (z2 + e2), [[z1 * z2 + e1 * e2, 'verteilung-halb']]) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(4, 9), zz(6, 12), zz(3, 7)], ([x, y, z]) => new Set([x, y, z]).size === 3 && y > z);
        return auswahl('Welche Rechnung ist falsch ausmultipliziert?', [opt(`${a} · (${b} + ${c}) = ${a} · ${b} + ${a} · ${c}`), opt(`${a} · (${b} + ${c}) = ${a} · ${b} + ${c}`, true), opt(`(${b} + ${c}) · ${a} = ${b} · ${a} + ${c} · ${a}`), opt(`${a} · (${b} − ${c}) = ${a} · ${b} − ${a} · ${c}`)],
          h2('Rechne beide Seiten jeder Gleichung aus.', `${a} · (${b} + ${c}) = ${a} · ${b + c} = ${a * (b + c)}.`), { nachweis: [{ art: 'gleichungen', falsche: true }] }); }
      const [n, e, g] = suche(() => [zz(12, 28), zz(2, 4), zz(2, 3)], ([x, y, z]) => y !== z);
      return zahl(`Für ${n} Kinder kauft die Lehrerin je ein Eis für ${e} € und ein Getränk für ${g} €. Wie viel kostet alles zusammen?`, n * (e + g), fehlerliste(n * (e + g), [[n * e + g, 'verteilung-halb']]),
        h2('Du kannst zuerst ausrechnen, was ein Kind bekommt, oder Eis und Getränke getrennt rechnen.', `${n} · (${e} + ${g}) = ${n} · ${e} + ${n} · ${g}.`), { einheit: '€', nachweis: N(`${e} + ${g}`, `${n} · ${e + g}`, `${n} · ${e}`, `${n} · ${g}`, `${n * e} + ${n * g}`) });
    },
    3: () => { const [a, b, c] = suche(() => [zz(4, 9), zz(11, 19), zz(3, 9)], ([x, , z]) => x !== z), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${a} · (${b} + ${c}) = ${a} · ${b} + ${c}.“ ${k2} sagt: „${a} · (${b} + ${c}) = ${a} · ${b} + ${a} · ${c}.“ Wer hat recht?`, [
        opt(`${k2}. Beim Ausmultiplizieren wird jeder Summand malgenommen: ${a * b} + ${a * c} = ${a * (b + c)}.`, true),
        opt(`${k1}. Man nimmt nur den ersten Summanden mal, der zweite bleibt, wie er ist.`, false, 'verteilung-halb'),
        opt('Beide. Es kommt dasselbe heraus.', false, 'verteilung-halb'),
        opt(`Keiner. Richtig ist ${a + b} · ${c}.`)],
      h2('Rechne alle Ausdrücke aus und vergleiche.', `${a} · ${b + c} = ${a * (b + c)}.`), { nachweis: N(`${a} · ${b + c}`, `${a} · ${b}`, `${a} · ${c}`, `${a * b} + ${a * c}`, `${a * b} + ${c}`) }); },
  });

  stufen(V('V1'), 'E', {
    1: () => { const [a, z, e] = suche(() => [zz(11, 19), zz(3, 9) * 10, zz(3, 9)], ([x, , y]) => x !== y);
      return zahl(`Multipliziere aus und berechne: ${a} · (${z} + ${e}) − ${a} · ${e}`, a * z, fehlerliste(a * z, [[a * (z + e) - e, 'verteilung-halb']]),
        h1('Multipliziere zuerst aus. Was fällt dir dann auf?'), { nachweis: N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a * z + a * e} − ${a * e}`) }); },
    2: (k) => {
      if (k === 0) { const [a, z, e] = suche(() => [zz(3, 9), zz(2, 6) * 10, zz(2, 9)], ([x, , y]) => x !== y);
        return luecken(`Ergänze: {{a}} · (${z} + ${e}) = ${a * z} + ${a * e}`, { a: [a, fehlerliste(a, [[a * z / 10, 'verteilung-halb']].filter(([w]) => w !== a))] },
          h1('Mit welcher Zahl wurden beide Summanden malgenommen?'), { nachweis: N(`${a * z} : ${z}`, `${a * e} : ${e}`, `${a} · (${z} + ${e})`) }); }
      if (k === 1) { const [z, e, f] = suche(() => [wahl([20, 30, 40]), zz(2, 9), zz(2, 9)], ([, x, y]) => x !== y);
        return zahl(`Multipliziere aus: (${z} + ${e}) · (${z} + ${f})`, (z + e) * (z + f), fehlerliste((z + e) * (z + f), [[z * z + e * f, 'verteilung-halb']]),
          h1('Jeder Summand der ersten Klammer wird mit jedem Summanden der zweiten Klammer malgenommen.'), { nachweis: N(`${z} · ${z}`, `${z} · ${f}`, `${e} · ${z}`, `${e} · ${f}`, `${z * z} + ${z * f} + ${e * z} + ${e * f}`, `${z + e} · ${z + f}`) }); }
      const [e, f] = suche(() => [zz(2, 9), zz(2, 9)], ([x, y]) => x !== y);
      return auswahl(`Wie viele Teilprodukte entstehen, wenn du (10 + ${e}) · (10 + ${f}) ausmultiplizierst?`, [opt('4', true), opt('2', false, 'verteilung-halb'), opt('3', false, 'verteilung-halb'), opt('6'), opt('1')],
        h1('Jeder Summand der ersten Klammer trifft auf jeden Summanden der zweiten Klammer.'), { nachweis: [HILFSZAHL(2, 'zwei Summanden in jeder Klammer'), ...N('2 · 2', '10 · 10', `10 · ${f}`, `${e} · 10`, `${e} · ${f}`)] });
    },
    3: (k) => {
      if (k === 0) { const [z, e, d] = wahl([[40, 8, 4], [60, 12, 6], [30, 9, 3], [80, 16, 8]]);
        return auswahl(`Gilt das Verteilungsgesetz auch für eine Division wie (${z} + ${e}) : ${d}? Prüfe.`, [
          opt(`Ja. (${z} + ${e}) : ${d} = ${(z + e) / d} und ${z} : ${d} + ${e} : ${d} = ${z / d} + ${e / d} = ${(z + e) / d}.`, true),
          opt('Nein. Das Verteilungsgesetz gilt nur für die Multiplikation.', false, 'gesetz-auf-division'),
          opt(`Ja, aber nur, wenn man ${z} : ${d} + ${e} rechnet.`, false, 'verteilung-halb'),
          opt('Nein. Bei der Division darf man nichts zerlegen.', false, 'gesetz-auf-division'),
          opt('Das kann man nicht prüfen.')],
        h1('Rechne beide Wege aus und vergleiche.'), { nachweis: [...N(`(${z} + ${e}) : ${d}`, `${z} : ${d}`, `${e} : ${d}`, `${z / d} + ${e / d}`), U(true)] }); }
      const [a, b, c] = suche(() => [zz(2, 5), zz(3, 6), zz(2, 5)], (x) => new Set(x).size === 3), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${a} · (${b} · ${c}) = ${a} · ${b} · ${a} · ${c}.“ ${k2} sagt: „${a} · (${b} · ${c}) = ${a} · ${b} · ${c}.“ Wer hat recht?`, [
        opt(`${k2}. In der Klammer steht ein Produkt, keine Summe. Das Verteilungsgesetz gilt hier nicht: ${a} · ${b * c} = ${a * b * c}.`, true),
        opt(`${k1}. Man muss jeden Faktor in der Klammer mit ${a} malnehmen. Das sagt das Verteilungsgesetz.`, false, 'verteilung-halb'),
        opt('Beide. Es kommt dasselbe heraus.', false, 'verteilung-halb'),
        opt('Keiner. Man darf die Klammer nicht auflösen.'),
        opt(`${k1}. Das ist das Verbindungsgesetz.`, false, 'begriffe-verwechselt')],
      h1(`Rechne beide Ausdrücke aus. Was steht in der Klammer?`), { nachweis: N(`${b} · ${c}`, `${a} · ${b * c}`, `${a} · ${b} · ${c}`, `${a} · ${b} · ${a} · ${c}`) }); },
  });

  // ===================================================================
  // V2 Ausklammern
  // ===================================================================
  sechs(V('V2'), 'F', [
    () => { const [a, b] = teile(), c = suche(() => zz(3, 6), (x) => x !== a && x !== b);
      return luecken(Z('Welche Zahl fehlt?', `${a} · ${c} + ${b} · ${c} = ({{x}} + ${b}) · ${c}`), { x: [a, fehlerliste(a, [[a * c, 'verteilung-halb']])] },
        h3('Oben im Bild und unten sind gleich lange Reihen.', '3 · 4 + 2 · 4 = (3 + 2) · 4.', `Oben sind ${a} Reihen.`), { bild: B.feld(a + b, c, a), nachweis: N(`${a} · ${c} + ${b} · ${c}`, `(${a} + ${b}) · ${c}`) }); },
    () => { const [a, b] = teile(), c = suche(() => zz(3, 6), (x) => x !== a && x !== b);
      return auswahl(Z('Welche Rechnung passt zum Bild?'), [opt(`(${a} + ${b}) · ${c}`, true), opt(`${a} + ${b} · ${c}`, false, 'verteilung-halb'), opt(`${a} · ${b} · ${c}`)],
        h3('Zähle alle Reihen zusammen. In jeder Reihe sind gleich viele Punkte.', '4 Reihen oben und 3 Reihen unten, je 5 Punkte: (4 + 3) · 5.', `Es sind ${a} + ${b} Reihen mit je ${c} Punkten.`), { bild: B.feld(a + b, c, a), nachweis: [WERT((a + b) * c), ...N(`(${a} + ${b}) · ${c}`, `${a + b} · ${c}`)] }); },
    () => { const [a, b] = suche(() => [zz(4, 8), zz(2, 6)], ([x, y]) => x + y === 10 && x !== y), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
      return zahl(Z(`${a} · ${c} + ${b} · ${c} = (${a} + ${b}) · ${c}`, 'Rechne mit der Klammer.'), 10 * c, fehlerliste(10 * c, [[a * c + b, 'verteilung-halb']]),
        h3('In der Klammer kommt 10 heraus.', '6 · 5 + 4 · 5 = (6 + 4) · 5 = 10 · 5 = 50.', `${a} + ${b} = 10. Rechne 10 · ${c}.`), { bild: B.feld(10, c, a), nachweis: N(`${a} + ${b}`, `10 · ${c}`, `${a} · ${c} + ${b} · ${c}`) }); },
    () => { const [a, b] = teile(), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
      return luecken(Z('Welche Zahl fehlt?', `${c} · ${a} + ${c} · ${b} = ${c} · (${a} + {{x}})`), { x: [b, fehlerliste(b, [[c * b, 'verteilung-halb']])] },
        h3('Die gleiche Zahl steht vor der Klammer. In der Klammer stehen die beiden anderen Zahlen.', '8 · 3 + 8 · 2 = 8 · (3 + 2).', `Die zweite Zahl neben der ${c} ist ${b}.`), { bild: B.feld(a + b, c, a), nachweis: N(`${c} · ${a} + ${c} · ${b}`, `${c} · (${a} + ${b})`) }); },
    () => { const [a, b] = suche(() => [zz(4, 8), zz(2, 6)], ([x, y]) => x + y === 10 && x !== y), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
      return zahl(Z('Rechne geschickt.', `${a} · ${c} + ${b} · ${c}`), 10 * c, fehlerliste(10 * c, [[a * c + b, 'verteilung-halb']]),
        h3('Zähle zuerst die Reihen zusammen.', '7 · 4 + 3 · 4 = (7 + 3) · 4 = 40.', `${a} + ${b} = 10 Reihen mit je ${c}.`), { bild: B.feld(10, c, a), nachweis: N(`${a} + ${b}`, `10 · ${c}`, `${a} · ${c} + ${b} · ${c}`) }); },
    () => { const c = suche(() => zz(3, 9), (x) => x !== 9);
      return zahl(Z('Rechne geschickt.', `9 · ${c} + 1 · ${c}`), 10 * c, fehlerliste(10 * c, [[9 * c + 1, 'verteilung-halb']]),
        h3('9 Reihen und noch 1 Reihe sind 10 Reihen.', '9 · 3 + 1 · 3 = 10 · 3 = 30.', `Rechne 10 · ${c}.`), { bild: B.feld(10, c, 9), nachweis: N('9 + 1', `10 · ${c}`, `9 · ${c} + 1 · ${c}`) }); },
  ]);

  stufen(V('V2'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(4, 8), zz(2, 6)], ([x, y]) => x + y === 10 && x !== y), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
        return luecken(Z('Schreibe mit Klammer.', `${c} · ${a} + ${c} · ${b} = ${c} · ({{a}} + {{b}})`), { a, b },
          h3('Der gleiche Faktor kommt vor die Klammer.', '9 · 6 + 9 · 4 = 9 · (6 + 4).', `Der gleiche Faktor ist ${c}.`), { bild: B.feld(10, c, a), nachweis: N(`${c} · ${a} + ${c} · ${b}`, `${c} · (${a} + ${b})`) }); }
      if (k === 1) { const [a, b] = suche(() => [zz(11, 18), zz(2, 9)], ([x, y]) => (x + y) % 10 === 0), c = zz(3, 9);
        return zahl(Z('Rechne geschickt.', `${a} · ${c} + ${b} · ${c}`), (a + b) * c, fehlerliste((a + b) * c, [[a * c + b, 'verteilung-halb']]),
          h3('Der Faktor ist gleich. Addiere zuerst die anderen Zahlen.', '17 · 8 + 3 · 8 = (17 + 3) · 8 = 20 · 8 = 160.', `${a} + ${b} = ${a + b}.`), { nachweis: N(`${a} + ${b}`, `${a + b} · ${c}`, `${a} · ${c} + ${b} · ${c}`) }); }
      const a = suche(() => zz(21, 79), (x) => x % 10 !== 0 && x !== 50), b = 100 - a, c = zz(3, 9);
      return zahl(Z('Rechne geschickt.', `${c} · ${a} + ${c} · ${b}`), 100 * c, fehlerliste(100 * c, [[c * a + b, 'verteilung-halb']]),
        h3('Klammere den gleichen Faktor aus.', '7 · 46 + 7 · 54 = 7 · (46 + 54) = 7 · 100 = 700.', `${a} + ${b} = 100.`), { nachweis: N(`${a} + ${b}`, `${c} · 100`, `${c} · ${a} + ${c} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(11, 16), zz(4, 9)], ([x, y]) => (x + y) % 10 === 0), c = zz(3, 9);
        return auswahl(Z(`Welche Rechnung ist dasselbe wie ${a} · ${c} + ${b} · ${c}?`), [opt(`(${a} + ${b}) · ${c}`, true), opt(`${a} + ${b} · ${c}`, false, 'verteilung-halb'), opt(`(${a} · ${b}) + ${c}`)],
          h3('Der gleiche Faktor wird ausgeklammert. Die beiden anderen Zahlen kommen in die Klammer.', '12 · 5 + 8 · 5 = (12 + 8) · 5.', `Der gleiche Faktor ist ${c}.`), { nachweis: [WERT((a + b) * c), ...N(`${a} · ${c} + ${b} · ${c}`, `(${a} + ${b}) · ${c}`)] }); }
      const [a, b] = suche(() => [zz(6, 9), zz(1, 4)], ([x, y]) => x + y === 10), c = suche(() => zz(4, 9), (x) => x !== a);
      return zahl(Z('Rechne geschickt.', `${a} · ${c} + ${b} · ${c}`), 10 * c, fehlerliste(10 * c, [[a * c + b, 'verteilung-halb']]),
        h3('Zähle zuerst die Reihen oben und unten zusammen.', '8 · 9 + 2 · 9 = (8 + 2) · 9 = 90.', `${a} + ${b} = 10.`), { bild: B.feld(10, c, a), nachweis: N(`${a} + ${b}`, `10 · ${c}`, `${a} · ${c} + ${b} · ${c}`) });
    },
    3: () => { const [x, y] = suche(() => [zz(6, 8), zz(2, 4)], ([p, q]) => p + q === 10), c = suche(() => zz(4, 7), (z) => z !== x), k = kind(), falsch = c * x + y;
      return auswahl(Z(`${k} rechnet:`, `${c} · ${x} + ${c} · ${y} = ${c} · ${x} + ${y} = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Richtig ist ${c} · (${x} + ${y}) = ${c} · 10 = ${10 * c}.`), true),
        opt(Z('Stimmt.', `${c} · ${x} = ${c * x}.`), false, 'verteilung-halb'),
        opt(Z('Falsch.', 'Hier wird nur addiert.', `Richtig ist ${c} + ${x} + ${y} = ${c + x + y}.`))],
      h3('Beide Produkte haben den gleichen Faktor.', c === 6 && x === 7 ? '5 · 8 + 5 · 2 = 5 · (8 + 2) = 50.' : '6 · 7 + 6 · 3 = 6 · (7 + 3) = 60.', `Klammere ${c} aus.`), { bild: B.feld(10, c, x), nachweis: [U(false, `${c} · ${x} + ${c} · ${y}`, falsch), ...N(`${x} + ${y}`, `${c} · 10`, `${c} · ${x}`, `${c * x} + ${y}`, `${c} + ${x} + ${y}`)] }); },
  });

  stufen(V('V2'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(6, 9), zz(1, 4)], ([x, y]) => x + y === 10), c = zz(11, 19);
        return luecken(`Klammere aus und rechne: ${c} · ${a} + ${c} · ${b} = ${c} · ({{x}} + ${b}) = {{y}}`, { x: a, y: [10 * c, fehlerliste(10 * c, [[c * a + b, 'verteilung-halb']])] },
          h2('Der gemeinsame Faktor kommt vor die Klammer.', `${a} + ${b} = 10.`), { nachweis: N(`${a} + ${b}`, `${c} · 10`, `${c} · ${a} + ${c} · ${b}`) }); }
      const [a, b] = suche(() => [zz(11, 18), zz(2, 9)], ([x, y]) => (x + y) % 10 === 0), c = zz(13, 29);
      return zahl(`Klammere aus und berechne: ${c} · ${a} + ${c} · ${b}`, c * (a + b), fehlerliste(c * (a + b), [[c * a + b, 'verteilung-halb']]),
        h2('Klammere den gemeinsamen Faktor aus.', `${c} · (${a} + ${b}) = ${c} · ${a + b}.`), { nachweis: N(`${a} + ${b}`, `${c} · ${a + b}`, `${c} · ${a} + ${c} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(12, 19), zz(2, 9)], ([x, y]) => (x - y) % 10 === 0 && x > y), c = zz(23, 69);
        return zahl(`Klammere aus und berechne: ${c} · ${a} − ${c} · ${b}`, c * (a - b), fehlerliste(c * (a - b), [[c * a - b, 'verteilung-halb']]),
          h2('Ausklammern geht auch bei Minus.', `${c} · (${a} − ${b}) = ${c} · ${a - b}.`), { nachweis: N(`${a} − ${b}`, `${c} · ${a - b}`, `${c} · ${a} − ${c} · ${b}`) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(6, 9), zz(12, 18), zz(3, 7)], ([x, y, z]) => new Set([x, y, z]).size === 3), d = suche(() => zz(3, 9), (x) => x !== a);
        return auswahl('Bei welcher Rechnung kannst du einen gemeinsamen Faktor ausklammern?', [opt(`${a} · ${b} + ${a} · ${c}`, true), opt(`${a} · ${b} + ${d} · ${c}`), opt(`${a} + ${b} · ${c}`), opt(`${a} · ${b} · ${c}`)],
          h2('Ausklammern geht bei einer Summe aus zwei Produkten mit dem gleichen Faktor.', 'Suche die Summe, in der ein Faktor zweimal vorkommt.'), { nachweis: N(`${a} · ${b} + ${a} · ${c}`, `${a} · (${b} + ${c})`) }); }
      const [m, n, p] = suche(() => [zz(31, 48), 0, wahl([35, 40, 45, 55])], () => true), nach = 100 - m;
      return zahl(`Ein Bäcker verkauft am Morgen ${m} Brötchen und am Nachmittag ${nach} Brötchen. Jedes Brötchen kostet ${p} Cent. Wie viel Cent nimmt er ein?`, 100 * p, fehlerliste(100 * p, [[m * p + nach, 'verteilung-halb']]),
        h2('Klammere den Preis aus.', `${m} · ${p} + ${nach} · ${p} = (${m} + ${nach}) · ${p}.`), { einheit: 'Cent', nachweis: N(`${m} + ${nach}`, `100 · ${p}`, `${m} · ${p} + ${nach} · ${p}`) });
    },
    3: () => { const [a, b] = suche(() => [zz(6, 9), zz(2, 6)], ([x, y]) => x !== y), c = wahl([25, 15, 35]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${c} · ${a} + ${c} · ${b} = ${c} · ${a + b}.“ ${k2} sagt: „${c} · ${a} + ${c} · ${b} = ${c} · ${a * b}.“ Wer hat recht?`, [
        opt(`${k1}. Beim Ausklammern werden die Zahlen in der Klammer addiert: ${c} · (${a} + ${b}) = ${c * (a + b)}.`, true),
        opt(`${k2}. In der Klammer wird malgenommen, weil vorn auch malgenommen wird.`, false, 'verteilung-halb'),
        opt('Beide. Es kommt dasselbe heraus.', false, 'verteilung-halb'),
        opt(`Keiner. Richtig ist ${c} · ${a} + ${b}.`, false, 'verteilung-halb')],
      h2('Rechne beide Seiten aus.', `${c} · ${a} + ${c} · ${b} = ${c * a} + ${c * b}.`), { nachweis: N(`${c} · ${a}`, `${c} · ${b}`, `${c * a} + ${c * b}`, `${c} · ${a + b}`, `${c} · ${a * b}`) }); },
  });

  stufen(V('V2'), 'E', {
    1: () => { const c = zz(23, 89);
      return zahl(`Klammere aus und berechne: ${c} · 99 + ${c}`, 100 * c, fehlerliste(100 * c, [[99 * c + 1, 'verteilung-halb']]),
        h1(`Schreibe die einzelne ${c} als Produkt.`), { nachweis: [HILFSZAHL(1, `${c} = ${c} · 1`), ...N('99 + 1', `${c} · 100`, `${c} · 99 + ${c}`)] }); },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(13, 19), zz(3, 9)], ([x, y]) => x - y === 8);
        return zahl(`Klammere aus und berechne: 125 · ${a} − 125 · ${b}`, 1000, fehlerliste(1000, [[125 * a - b, 'verteilung-halb']]),
          h1('Klammere aus. Was steht dann in der Klammer?'), { nachweis: N(`${a} − ${b}`, '125 · 8', `125 · ${a} − 125 · ${b}`) }); }
      if (k === 1) { const [c, a] = [zz(12, 29), zz(11, 27)], b = 30 - a;
        return luecken(`Ergänze: ${c} · ${a} + ${c} · {{a}} = ${c} · 30 = {{b}}`, { a: [b, fehlerliste(b, [[30, 'verteilung-halb']])], b: 30 * c },
          h1(`Was muss zu ${a} dazukommen, damit in der Klammer 30 steht?`), { nachweis: N(`30 − ${a}`, `${c} · 30`, `${c} · ${a} + ${c} · ${b}`) }); }
      const c = zz(3, 9), [a, b] = suche(() => [zz(21, 49), zz(11, 39)], ([x, y]) => x + y < 100 && x !== y), d = 100 - a - b;
      return zahl(`Klammere aus und berechne: ${c} · ${a} + ${c} · ${b} + ${c} · ${d}`, 100 * c, fehlerliste(100 * c, [[c * a + b + d, 'verteilung-halb']]),
        h1('Man kann auch aus drei Produkten den gleichen Faktor ausklammern.'), { nachweis: N(`${a} + ${b} + ${d}`, `${c} · 100`, `${c} · ${a} + ${c} · ${b} + ${c} · ${d}`) });
    },
    3: (k) => {
      if (k === 0) { const c = zz(23, 89);
        return auswahl(`Warum ist ${c} · 99 + ${c} leicht zu rechnen?`, [
          opt(`Weil ${c} = ${c} · 1 ist. Ausklammern ergibt ${c} · (99 + 1) = ${c} · 100 = ${fz(100 * c)}.`, true),
          opt(`Weil man 99 + ${c} zuerst rechnen darf.`, false, 'punkt-vor-strich'),
          opt(`Weil man ${c} · 99 + ${c} als ${c} · 100 + ${c} rechnen darf, denn 99 ist fast 100.`, false, 'verteilung-halb'),
          opt('Weil man die Klammer weglassen darf.'),
          opt('Es ist nicht leicht. Man muss schriftlich rechnen.')],
        h1('Schreibe die einzelne Zahl als Produkt mit dem Faktor 1.'), { nachweis: [HILFSZAHL(1, `${c} = ${c} · 1`), ...N('99 + 1', `${c} · 100`, `${c} · 99 + ${c}`)] }); }
      const [a, b] = suche(() => [zz(7, 9), zz(2, 5)], ([x, y]) => x !== y), c = wahl([12, 14, 16, 18]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${c} · ${a} − ${c} · ${b} = ${c} · ${a - b}.“ ${k2} sagt: „${c} · ${a} − ${c} · ${b} = ${c} · ${a + b}.“ Wer hat recht?`, [
        opt(`${k1}. Beim Ausklammern bleibt das Minus in der Klammer: ${c} · (${a} − ${b}) = ${c * (a - b)}.`, true),
        opt(`${k2}. In der Klammer wird immer addiert.`, false, 'verteilung-halb'),
        opt('Beide. Ausklammern ändert nichts.', false, 'verteilung-halb'),
        opt('Keiner. Bei Minus darf man nicht ausklammern, das geht nur bei Plus.', false, 'verteilung-halb'),
        opt(`${k2}. Es kommt ${c * (a + b)} heraus.`, false, 'verteilung-halb')],
      h1('Rechne beide Seiten aus.'), { nachweis: N(`${c} · ${a}`, `${c} · ${b}`, `${c * a} − ${c * b}`, `${c} · ${a - b}`, `${c} · ${a + b}`) }); },
  });

  // ===================================================================
  // V3 Mit dem Verteilungsgesetz geschickt rechnen
  // ===================================================================
  sechs(V('V3'), 'F', [
    () => { const a = suche(() => zz(3, 9), (x) => x !== 4);
      return zahl(Z('Rechne geschickt.', `${a} · 12`, `Rechne ${a} · 10 und ${a} · 2.`), 12 * a, fehlerliste(12 * a, [[10 * a + 2, 'verteilung-halb']]),
        h3('12 ist 10 und 2. Nimm beide Teile mal.', '4 · 12: 4 · 10 = 40 und 4 · 2 = 8. Zusammen 48.', `${a} · 10 = ${10 * a}. Rechne jetzt ${a} · 2.`), { bild: B.feld(12, a, 10), nachweis: N(`${a} · 10`, `${a} · 2`, `${10 * a} + ${2 * a}`, `${a} · 12`) }); },
    () => { const a = suche(() => zz(3, 9), (x) => x !== 3);
      return zahl(Z('Rechne geschickt.', `11 · ${a}`, `Rechne 10 · ${a} und 1 · ${a}.`), 11 * a, fehlerliste(11 * a, [[10 * a + 1, 'verteilung-halb']]),
        h3('11 Reihen sind 10 Reihen und noch 1 Reihe.', '11 · 3: 10 · 3 = 30 und 1 · 3 = 3. Zusammen 33.', `10 · ${a} = ${10 * a}. Dazu kommt 1 Reihe mit ${a}.`), { bild: B.feld(11, a, 10), nachweis: N(`10 · ${a}`, `1 · ${a}`, `${10 * a} + ${a}`, `11 · ${a}`) }); },
    () => { const a = suche(() => zz(3, 8), (x) => x !== 6);
      return auswahl(Z(`Wie rechnest du 9 · ${a} geschickt?`), [opt(`10 · ${a} − 1 · ${a}`, true), opt(`10 · ${a} − 1`, false, 'verteilung-halb'), opt(`9 · ${a - 1} + 1`)],
        h3('9 Reihen sind 1 Reihe weniger als 10 Reihen.', '9 · 6 = 10 · 6 − 1 · 6 = 60 − 6 = 54.', `Von 10 Reihen mit je ${a} nimmst du 1 Reihe weg.`), { bild: B.feld(9, a), nachweis: [WERT(9 * a), ...N(`10 · ${a}`, `1 · ${a}`, `${10 * a} − ${a}`)] }); },
    () => { const a = suche(() => zz(3, 9), (x) => x !== 8);
      return zahl(Z('Rechne.', `12 · ${a}`, 'Zerlege 12 in 10 und 2.'), 12 * a, fehlerliste(12 * a, [[10 * a + 2, 'verteilung-halb']]),
        h3('Oben im Bild sind 10 Reihen, unten 2 Reihen.', '12 · 8: 10 · 8 = 80 und 2 · 8 = 16. Zusammen 96.', `10 · ${a} = ${10 * a}. Rechne jetzt 2 · ${a}.`), { bild: B.feld(12, a, 10), nachweis: N(`10 · ${a}`, `2 · ${a}`, `${10 * a} + ${2 * a}`, `12 · ${a}`) }); },
    () => { const a = suche(() => zz(3, 9), (x) => x !== 4);
      return malkreuz(Z(`Rechne ${a} · 11 geschickt.`, 'Zerlege 11 in 10 und 1.'), [a], [10, 1],
        h3('Nimm beide Teile mal. Rechne dann zusammen.', '4 · 11: 4 · 10 = 40 und 4 · 1 = 4. Zusammen 44.', `${a} · 10 = ${10 * a}.`), { fehler: fehlerliste(11 * a, [[10 * a + 1, 'verteilung-halb']]) }); },
    () => { const a = suche(() => zz(3, 9), (x) => x !== 5);
      return zahl(Z('Rechne geschickt.', `${a} · 11`), 11 * a, fehlerliste(11 * a, [[10 * a + 1, 'verteilung-halb']]),
        h3('11 ist 10 und 1.', '5 · 11: 5 · 10 = 50 und 5 · 1 = 5. Zusammen 55.', `${a} · 10 = ${10 * a}. Dazu kommt ${a} · 1.`), { bild: B.feld(11, a, 10), nachweis: N(`${a} · 10`, `${a} · 1`, `${10 * a} + ${a}`, `${a} · 11`) }); },
  ]);

  stufen(V('V3'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, e] = suche(() => [zz(3, 9), zz(1, 4)], ([x, y]) => x !== y);
        return malkreuz(Z(`Rechne ${a} · ${100 + e} geschickt.`, `Zerlege ${100 + e} in 100 und ${e}.`), [a], [100, e],
          h3('Nimm beide Teile mal. Rechne dann zusammen.', '8 · 102: 8 · 100 = 800 und 8 · 2 = 16. Zusammen 816.', `${a} · 100 = ${100 * a}.`), { fehler: fehlerliste(a * (100 + e), [[100 * a + e, 'verteilung-halb']]) }); }
      if (k === 1) { const [a, e] = suche(() => [zz(3, 9), zz(1, 3)], ([x, y]) => x !== y);
        return zahl(Z('Rechne geschickt.', `${a} · ${100 - e}`), a * (100 - e), fehlerliste(a * (100 - e), [[100 * a - e, 'verteilung-halb']]),
          h3(`${100 - e} ist ${e} weniger als 100.`, '7 · 98 = 7 · 100 − 7 · 2 = 700 − 14 = 686.', `${a} · 100 = ${100 * a}. Ziehe ${a} · ${e} = ${a * e} ab.`), { nachweis: N(`${a} · 100`, `${a} · ${e}`, `${100 * a} − ${a * e}`, `${a} · ${100 - e}`) }); }
      const [a, z] = suche(() => [zz(3, 9), wahl([30, 40, 50, 60])], ([x]) => x !== 5);
      return zahl(Z('Rechne geschickt.', `${a} · ${z - 2}`), a * (z - 2), fehlerliste(a * (z - 2), [[a * z - 2, 'verteilung-halb']]),
        h3(`${z - 2} ist 2 weniger als ${z}.`, '5 · 48 = 5 · 50 − 5 · 2 = 250 − 10 = 240.', `${a} · ${z} = ${a * z}. Ziehe ${a} · 2 ab.`), { nachweis: [HILFSZAHL(z, 'glatte Zahl'), HILFSZAHL(2, 'Abstand zur glatten Zahl'), ...N(`${a} · ${z}`, `${a} · 2`, `${a * z} − ${2 * a}`, `${a} · ${z - 2}`)] });
    },
    2: (k) => {
      if (k === 0) { const a = zz(12, 19);
        return luecken(Z('Rechne geschickt.', `${a} · 21 = ${a} · 20 + ${a} · {{a}}`, `${a} · 21 = {{b}}`), { a: 1, b: [21 * a, fehlerliste(21 * a, [[20 * a + 1, 'verteilung-halb']])] },
          h3('21 ist 20 und 1.', '15 · 21 = 15 · 20 + 15 · 1 = 300 + 15 = 315.', `${a} · 20 = ${20 * a}.`), { nachweis: N(`${a} · 20`, `${a} · 1`, `${20 * a} + ${a}`, `${a} · 21`) }); }
      const p = wahl([19, 29, 49]), kn = kind();
      return zahl(Z(`Ein Buch kostet ${p} €.`, `${kn} kauft 4 Bücher.`, 'Wie viel muss sie bezahlen?'.replace('sie', kn)), 4 * p, fehlerliste(4 * p, [[4 * (p + 1) - 1, 'verteilung-halb']]),
        h3('Rechne mit einem glatten Preis. Ziehe dann ab, was zu viel ist.', '4 Bücher zu je 19 €: 4 · 20 = 80. 80 − 4 = 76.', `4 · ${p + 1} = ${4 * (p + 1)}. Ziehe 4 · 1 = 4 ab.`), { einheit: '€', bild: B.streifen(frage(4 * p), [p, p, p, p]), nachweis: [HILFSZAHL(p + 1, 'glatter Preis'), ...N(`4 · ${p + 1}`, '4 · 1', `${4 * (p + 1)} − 4`, `4 · ${p}`)] });
    },
    3: () => { const a = suche(() => zz(6, 9), (x) => x !== 8), k = kind(), falsch = 10 * 12 - 1;
      return auswahl(Z(`${k} rechnet ${a} · 12 so:`, `10 · 12 − 1 = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `${a} ist ${10 - a} weniger als 10.`, `Richtig ist 10 · 12 − ${10 - a} · 12 = ${120 - (10 - a) * 12}.`), true),
        opt(Z('Stimmt.', 'Man nimmt nur 1 weg.'), false, 'verteilung-halb'),
        opt(Z('Falsch.', `Richtig ist 10 · 12 + ${10 - a} = ${120 + 10 - a}.`))],
      h3(`${a} Reihen sind ${10 - a} ${10 - a === 1 ? 'Reihe' : 'Reihen'} weniger als 10 Reihen.`, a === 9 ? '9 · 11 = 10 · 11 − 1 · 11 = 110 − 11 = 99.' : '9 · 12 = 10 · 12 − 1 · 12 = 120 − 12 = 108.', `Im Bild sind ${a} Reihen mit je 12 Punkten.`), { bild: B.feld(a, 12), nachweis: [U(false, `${a} · 12`, falsch), HILFSZAHL(10, 'glatte Zahl'), ...N(`10 · 12`, `${10 - a} · 12`, `${120} − ${(10 - a) * 12}`, `${a} · 12`, '10 · 12 − 1', `${120} + ${10 - a}`)] }); },
  });

  stufen(V('V3'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, z] = suche(() => [wahl([25, 15, 35, 45]), wahl([40, 60, 80])], () => true), e = zz(1, 3);
        return zahl(`Rechne geschickt: ${a} · ${z + e}`, a * (z + e), fehlerliste(a * (z + e), [[a * z + e, 'verteilung-halb']]),
          h2(`Zerlege ${z + e} in ${z} und ${e}.`, `${a} · ${z} = ${a * z}. Dazu ${a} · ${e} = ${a * e}.`), { nachweis: [HILFSZAHL(z, 'glatte Zahl'), ...N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a} · ${z + e}`)] }); }
      const a = zz(13, 49);
      return zahl(`Rechne geschickt: ${a} · 99`, 99 * a, fehlerliste(99 * a, [[100 * a - 1, 'verteilung-halb']]),
        h2('99 ist 100 − 1.', `${a} · 100 = ${100 * a}. Ziehe ${a} ab.`), { nachweis: N(`${a} · 100`, `${100 * a} − ${a}`, `${a} · 99`) });
    },
    2: (k) => {
      if (k === 0) { const [a, c] = [zz(31, 69), wahl([25, 15, 45])], b = 100 - a;
        return zahl(`Rechne geschickt: ${a} · ${c} + ${b} · ${c}`, 100 * c, fehlerliste(100 * c, [[a * c + b, 'verteilung-halb']]),
          h2('Klammere den gemeinsamen Faktor aus.', `${a} + ${b} = 100.`), { nachweis: N(`${a} + ${b}`, `100 · ${c}`, `${a} · ${c} + ${b} · ${c}`) }); }
      if (k === 1) { const [a, e] = [zz(13, 29), zz(2, 5)];
        return luecken(`Ergänze: ${a} · ${100 + e} = ${a} · 100 + {{a}} = {{b}}`, { a: a * e, b: [a * (100 + e), fehlerliste(a * (100 + e), [[100 * a + e, 'verteilung-halb']])] },
          h2(`Auch ${e} wird mit ${a} malgenommen.`, `${a} · ${e} = ${a * e}.`), { nachweis: N(`${a} · 100`, `${a} · ${e}`, `${100 * a} + ${a * e}`, `${a} · ${100 + e}`) }); }
      const [p, n] = [wahl([49, 59, 99]), zz(12, 18)];
      return zahl(`Ein Ticket kostet ${p} €. Eine Gruppe kauft ${n} Tickets. Wie viel kosten die Tickets? Rechne geschickt.`, n * p, fehlerliste(n * p, [[n * (p + 1) - 1, 'verteilung-halb']]),
        h2('Rechne mit einem glatten Preis. Ziehe dann ab, was zu viel ist.', `${n} · ${p + 1} = ${n * (p + 1)}. Ziehe ${n} · 1 ab.`), { einheit: '€', nachweis: [HILFSZAHL(p + 1, 'glatter Preis'), ...N(`${n} · ${p + 1}`, `${n} · 1`, `${n * (p + 1)} − ${n}`, `${n} · ${p}`)] });
    },
    3: () => { const a = wahl([35, 45, 55, 65]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} rechnet ${a} · 19 = ${a} · 20 − ${a} = ${a * 19}. ${k2} rechnet ${a} · 19 = ${a} · 20 − 19 = ${a * 20 - 19}. Wer hat recht?`, [
        opt(`${k1}. ${a} · 19 ist ${a} · 20 − ${a} · 1. Abgezogen wird ${a}, nicht 19.`, true),
        opt(`${k2}. Man zieht am Ende die Zahl ab, die geändert wurde.`, false, 'verteilung-halb'),
        opt('Beide. Es kommt dasselbe heraus.', false, 'verteilung-halb'),
        opt(`Keiner. Richtig ist ${a} · 20 − 1.`, false, 'verteilung-halb')],
      h2('Wie viele Reihen fehlen zu 20 Reihen?', `${a} · 19 = ${a} · (20 − 1).`), { nachweis: [U(false, `${a} · 19`, a * 20 - 19), ...N(`${a} · 20`, `${a} · 1`, `${a * 20} − ${a}`, `${a} · 19`, `${a * 20} − 19`)] }); },
  });

  stufen(V('V3'), 'E', {
    1: () => { const a = zz(23, 89);
      return zahl(`Rechne geschickt: 101 · ${a}`, 101 * a, fehlerliste(101 * a, [[100 * a + 1, 'verteilung-halb']]),
        h1('Zerlege 101 geschickt.'), { nachweis: N(`100 · ${a}`, `1 · ${a}`, `${100 * a} + ${a}`, `101 · ${a}`) }); },
    2: (k) => {
      if (k === 0) { const [c, a] = [zz(23, 59), zz(51, 79)], b = 100 - a;
        return zahl(`Rechne geschickt: ${c} · ${a} + ${c} · ${b}`, 100 * c, fehlerliste(100 * c, [[c * a + b, 'verteilung-halb']]),
          h1('Suche den gemeinsamen Faktor.'), { nachweis: N(`${a} + ${b}`, `${c} · 100`, `${c} · ${a} + ${c} · ${b}`) }); }
      if (k === 1) { const [a, e] = [zz(12, 49), zz(1, 3)];
        return zahl(`Rechne geschickt: ${1000 - e} · ${a}`, (1000 - e) * a, fehlerliste((1000 - e) * a, [[1000 * a - e, 'verteilung-halb']]),
          h1(`Wie weit ist ${1000 - e} von 1000 entfernt?`), { nachweis: N(`1000 · ${a}`, `${e} · ${a}`, `${1000 * a} − ${e * a}`, `${1000 - e} · ${a}`) }); }
      const x = suche(() => zz(21, 49), (v) => v % 10 !== 0), y = 100 - x;
      return zahl(`Rechne geschickt: 8 · ${x} · 125 + 8 · ${y} · 125`, 100000, fehlerliste(100000, [[1000 * x + y, 'verteilung-halb']]),
        h1('Fasse zuerst 8 · 125 zusammen. Klammere dann aus.'), { nachweis: N('8 · 125', `${x} + ${y}`, '1000 · 100', `8 · ${x} · 125 + 8 · ${y} · 125`) });
    },
    3: (k) => {
      if (k === 0) { const n = wahl([49, 39, 59]), m = n + 2;
        return auswahl(`Welche Gleichung stimmt? Prüfe, ohne ${n} · ${m} auszurechnen.`, [
          opt(`${n} · ${m} = ${n} · ${n + 1} + ${n}`, true),
          opt(`${n} · ${m} = ${n} · ${n + 1} + 2`, false, 'verteilung-halb'),
          opt(`${n} · ${m} = ${n + 1} · ${n + 1} + 1`, false, 'verteilung-halb'),
          opt(`${n} · ${m} = ${n + 1} · ${m} − 1`, false, 'verteilung-halb'),
          opt(`${n} · ${m} = ${n} · ${n} + 2`, false, 'verteilung-halb')],
        h1(`Schreibe ${m} als ${n + 1} + 1 und multipliziere aus.`), { nachweis: [{ art: 'gleichungen' }, ...N(`${n} · ${m}`, `${n} · ${n + 1}`, `${n * (n + 1)} + ${n}`)] }); }
      const [k1, k2] = zweiKinder(), a = wahl([16, 24, 32, 36]);
      return auswahl(`${k1} rechnet ${a} · 25 = ${a} · 20 + ${a} · 5 = ${a * 25}. ${k2} rechnet ${a} · 25 = ${a / 4} · 100 = ${a * 25}. Wer hat recht?`, [
        opt(`Beide. ${k1} nutzt das Verteilungsgesetz, ${k2} zerlegt ${a} in ${a / 4} · 4 und nutzt 4 · 25 = 100.`, true),
        opt(`Nur ${k1}. Man muss immer das Verteilungsgesetz nehmen, anders darf man nicht zerlegen.`),
        opt(`Nur ${k2}. Das Verteilungsgesetz gilt nicht bei 25.`, false, 'verteilung-halb'),
        opt(`Keiner. Richtig ist ${a * 20 + 5}.`, false, 'verteilung-halb'),
        opt('Keiner. Man muss schriftlich rechnen.')],
      h1('Prüfe beide Rechenwege Schritt für Schritt.'), { nachweis: N(`${a} · 20`, `${a} · 5`, `${a * 20} + ${a * 5}`, `${a} : 4`, '4 · 25', `${a / 4} · 100`, `${a} · 25`) }); },
  });
}
