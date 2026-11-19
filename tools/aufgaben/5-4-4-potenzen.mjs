// Aufgaben zu 5.4.4 „Potenzen“ (Lernziele P1 und P2) nach ADR 0015.
//   F  Quadrat und Würfel aus Kästchen abzählen, „3² heißt 3 · 3“, ohne die Wörter Basis und Exponent
//   G  Potenzschreibweise, Basis und Exponent, Quadratzahlen, Zehnerpotenzen bis 10⁴
//   M  größere Basen, mehrere Darstellungen derselben Zahl, Vergleiche
//   E  Regeln beim Verdoppeln und bei Zehnerpotenzen, Gegenbeispiele, Rechnen mit Potenzen

import { sechs, stufen, zahl, auswahl, opt, luecken, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, GROESSTES, HILFSZAHL, fz, hoch } from '../werkzeug.mjs';

const P = (kurz) => `5.4.4-${kurz}`;
const pot = (b, e) => `${b}${hoch(e)}`;
const lang = (b, e) => Array(e).fill(b).join(' · ');
const POT = (basis, exponent) => ({ art: 'potenz', basis, exponent, wert: basis ** exponent });
const potFehler = (b, e) => fehlerliste(b ** e, [[b * e, 'potenz-mal-exponent'], ...(b !== e ? [[e ** b, 'potenz-vertauscht']] : [])]);

export function potenzen() {
  // ===================================================================
  // P1 Potenzschreibweise, Basis und Exponent
  // ===================================================================
  sechs(P('P1'), 'F', [
    () => { const b = zz(3, 6);
      return auswahl(Z(`${b} · ${b}`, 'Wie schreibst du das kurz?'), [opt(pot(b, 2), true), opt(`${b} · 2`, false, 'potenz-mal-exponent'), opt(pot(2, b), false, 'potenz-vertauscht')],
        h3('Die kleine Zahl oben sagt, wie oft die Zahl dasteht.', '4 · 4 schreibst du kurz 4². Du liest: 4 hoch 2.', `Die Zahl ${b} steht 2-mal da.`), { bild: B.quadrat(b), nachweis: [WERT(b * b), POT(b, 2), ...N(`${b} · ${b}`)] }); },
    () => { const b = suche(() => zz(3, 9), (x) => x !== 5);
      return zahl(Z('Rechne.', pot(b, 2)), b * b, potFehler(b, 2),
        h3(`${pot(b, 2)} heißt ${b} · ${b}.`, '5² = 5 · 5 = 25.', `Rechne ${b} · ${b}.`), { bild: B.quadrat(b), nachweis: N(pot(b, 2), `${b} · ${b}`) }); },
    () => { const b = wahl([2, 3]);
      return zahl(Z(lang(b, 3), `Wie oft steht die ${b} da?`), 3, fehlerliste(3, [[b ** 3, 'begriffe-verwechselt']]),
        h3('Zähle die Zahlen zwischen den Malpunkten.', '4 · 4 · 4 · 4: Die 4 steht 4-mal da.', 'Zähle: 1, 2 und so weiter.'), { bild: B.quadrat(b, true), nachweis: [POT(b, 3), ...N(lang(b, 3))] }); },
    () => { const b = suche(() => zz(3, 8), (x) => x !== 4);
      return zahl(Z(`Das Quadrat hat ${b} Reihen.`, `In jeder Reihe sind ${b} Kästchen.`, `Das ist ${pot(b, 2)}.`, 'Wie viele Kästchen sind es?'), b * b, potFehler(b, 2),
        h3('Gleich viele Kästchen in jeder Reihe: Rechne mal.', '4 Reihen mit je 4 Kästchen: 4 · 4 = 16.', `Rechne ${b} · ${b}.`), { einheit: 'Kästchen', bild: B.quadrat(b), nachweis: N(`${b} · ${b}`, pot(b, 2)) }); },
    () => { const b = wahl([2, 4]);
      return auswahl(Z(`Was bedeutet ${pot(b, 3)}?`), [opt(lang(b, 3), true), opt(`${b} · 3`, false, 'potenz-mal-exponent'), opt(lang(3, b), false, 'potenz-vertauscht')],
        h3('Die kleine Zahl sagt, wie oft die große Zahl malgenommen wird.', '4³ heißt 4 · 4 · 4.', `Die ${b} steht 3-mal da.`), { bild: B.quadrat(b, true), nachweis: [WERT(b ** 3), ...N(pot(b, 3), lang(b, 3))] }); },
    () => {
      return zahl(Z('Rechne.', pot(10, 2)), 100, potFehler(10, 2),
        h3(`${pot(10, 2)} heißt 10 · 10.`, '3² = 3 · 3 = 9.', '10 Reihen mit je 10 Kästchen. Zähle in 10er-Schritten.'), { bild: B.quadrat(10), nachweis: N(pot(10, 2), '10 · 10') }); },
  ]);

  stufen(P('P1'), 'G', {
    1: (k) => {
      if (k === 0) { const [b, e] = [zz(3, 6), wahl([2, 3])];
        return auswahl(Z('Schreibe als Potenz.', lang(b, e)), [opt(pot(b, e), true), opt(`${b} · ${e}`, false, 'potenz-mal-exponent'), opt(pot(e, b), false, 'potenz-vertauscht')],
          h3('Die Basis ist der Faktor. Der Exponent sagt, wie oft er vorkommt.', '7 · 7 · 7 = 7³.', `Der Faktor ${b} kommt ${e}-mal vor.`), { bild: B.quadrat(b, e === 3), nachweis: [WERT(b ** e), POT(b, e), ...N(lang(b, e))] }); }
      if (k === 1) { const [b, e] = [zz(4, 9), wahl([2, 3])];
        return luecken(Z(`Bei ${pot(b, e)} ist die Basis {{a}}.`, 'Der Exponent ist {{b}}.'), { a: [b, fehlerliste(b, [[b ** e, 'begriffe-verwechselt']])], b: [e, fehlerliste(e, [[b, 'begriffe-verwechselt']])] },
          h3('Die Basis ist die große Zahl. Der Exponent ist die kleine Zahl oben.', 'Bei 2⁵ ist 2 die Basis. 5 ist der Exponent.', `${pot(b, e)} heißt ${lang(b, e)}.`), { bild: B.quadrat(b, e === 3), nachweis: [POT(b, e), ...N(pot(b, e))] }); }
      const [b, e] = wahl([[2, 5], [3, 4], [2, 6], [3, 5]]);
      return zahl(Z('Berechne.', pot(b, e)), b ** e, potFehler(b, e),
        h3('Schreibe die Potenz als Produkt. Rechne dann Schritt für Schritt.', '2⁴ = 2 · 2 · 2 · 2 = 16.', `${pot(b, e)} = ${lang(b, e)}.`), { nachweis: N(pot(b, e), lang(b, e)) });
    },
    2: (k) => {
      if (k === 0) { const [b, e] = wahl([[3, 3], [5, 3], [6, 3], [7, 3], [10, 3], [2, 5], [7, 2]]);
        return luecken(Z('Schreibe als Potenz.', lang(b, e), 'Die Basis ist {{a}}.', 'Der Exponent ist {{b}}.'), { a: [b, fehlerliste(b, [[e, 'potenz-vertauscht']])], b: [e, fehlerliste(e, [[b, 'potenz-vertauscht']])] },
          h3('Die Basis ist der Faktor. Der Exponent sagt, wie oft er dasteht.', '4 · 4 · 4 = 4³. Die Basis ist 4. Der Exponent ist 3.', `Der Faktor ist ${b}. Zähle, wie oft er dasteht.`), { nachweis: [POT(b, e), ...N(lang(b, e))] }); }
      const b = zz(3, 5);
      return zahl(Z(`Der große Würfel hat ${b} Schichten.`, `Jede Schicht hat ${b} Reihen mit je ${b} Würfeln.`, 'Wie viele kleine Würfel sind es?'), b ** 3, potFehler(b, 3),
        h3(`Das ist ${pot(b, 3)}.`, '2 Schichten mit je 2 · 2 Würfeln: 2³ = 8.', `In 1 Schicht sind ${b} · ${b} = ${b * b} Würfel.`), { einheit: 'Würfel', bild: B.quadrat(b, true), nachweis: N(`${b} · ${b}`, `${b * b} · ${b}`, pot(b, 3)) });
    },
    3: () => { const [b, e] = wahl([[3, 4], [2, 5], [4, 3], [5, 3]]), k = kind();
      return auswahl(Z(`${k} sagt:`, `„${pot(b, e)} = ${b * e}“`, 'Stimmt das?'), [
        opt(Z('Falsch.', `${pot(b, e)} = ${lang(b, e)} = ${b ** e}.`), true),
        opt(Z('Stimmt.', `${b} · ${e} = ${b * e}.`), false, 'potenz-mal-exponent'),
        opt(Z('Falsch.', `${pot(b, e)} = ${lang(e, b)}.`), false, 'potenz-vertauscht')],
      h3('Der Exponent sagt, wie oft die Basis malgenommen wird.', '2³ = 2 · 2 · 2 = 8 und nicht 2 · 3.', `Schreibe ${pot(b, e)} als Produkt.`), { nachweis: [U(false, pot(b, e), b * e), ...N(lang(b, e), `${b} · ${e}`)] }); },
  });

  stufen(P('P1'), 'M', {
    1: (k) => {
      if (k === 0) { const [b, e] = wahl([[8, 5], [7, 4], [9, 5], [6, 5]]);
        return luecken(`Bei ${pot(b, e)} ist die Basis {{a}} und der Exponent {{b}}.`, { a: [b, fehlerliste(b, [[e, 'begriffe-verwechselt']])], b: [e, fehlerliste(e, [[b, 'begriffe-verwechselt']])] },
          h2('Die Basis ist der Faktor, der mehrmals vorkommt. Der Exponent zählt, wie oft.', `${pot(b, e)} = ${lang(b, e)}.`), { nachweis: [POT(b, e)] }); }
      const [b, e] = wahl([[9, 6], [4, 7], [7, 6], [5, 7]]);
      return luecken(`Du schreibst ${lang(b, e)} als Potenz mit der Basis ${b}. Der Exponent ist {{x}}.`, { x: [e, fehlerliste(e, [[e - 1, 'begriffe-verwechselt']])] },
        h2('Zähle die Faktoren, nicht die Malpunkte.', `Es sind ${e - 1} Malpunkte. Wie viele Faktoren sind es?`), { nachweis: [POT(b, e), HILFSZAHL(e - 1, 'Malpunkte')] });
    },
    2: (k) => {
      if (k === 0) return auswahl('Welche Potenzen ergeben 64? Wähle alle richtigen aus.', [opt(pot(2, 6), true), opt(pot(4, 3), true), opt(pot(8, 2), true), opt(pot(6, 2), false, 'potenz-vertauscht')],
        h2('Rechne jede Potenz aus.', '2⁶ = 2 · 2 · 2 · 2 · 2 · 2.'), { mehrfach: true, nachweis: [WERT(64), ...N(pot(2, 6), pot(4, 3), pot(8, 2), pot(6, 2))] });
      if (k === 1) { const [x, y] = wahl([[100, 1000], [10, 10000], [1000, 100]]), e = String(x * y).length - 1;
        return zahl(`Schreibe ${fz(x)} · ${fz(y)} als Zehnerpotenz. Wie heißt der Exponent?`, e, fehlerliste(e, [[e - 1, 'potenz-nullen'], [e + 1, 'potenz-nullen']]),
          h2('Zähle alle Nullen.', `${fz(x)} · ${fz(y)} = ${fz(x * y)}.`), { nachweis: [POT(10, e), ...N(`${x} · ${y}`)] }); }
      const [b, e] = wahl([[3, 5], [2, 7], [3, 4]]), [c, f] = [e, b];
      return zahl(`Um wie viel ist ${pot(b, e)} größer als ${pot(c, f)}?`, b ** e - c ** f, fehlerliste(b ** e - c ** f, [[b * e - c * f, 'potenz-mal-exponent']]),
        h2('Berechne zuerst beide Potenzen.', `${pot(b, e)} = ${b ** e}.`), { nachweis: N(pot(b, e), pot(c, f), `${b ** e} − ${c ** f}`) });
    },
    3: () => { const [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${pot(2, 3)} = ${pot(3, 2)}.“ ${k2} sagt: „${pot(2, 3)} ist kleiner als ${pot(3, 2)}.“ Wer hat recht?`, [
        opt(`${k2}. ${pot(2, 3)} = 8 und ${pot(3, 2)} = 9.`, true),
        opt(`${k1}. Es kommen dieselben Zahlen vor.`, false, 'potenz-vertauscht'),
        opt(`${k1}. 2 · 3 = 3 · 2 = 6.`, false, 'potenz-mal-exponent'),
        opt(`Keiner. ${pot(2, 3)} ist größer.`, false, 'potenz-vertauscht')],
      h2('Rechne beide Potenzen aus.', '2³ = 2 · 2 · 2.'), { nachweis: N(pot(2, 3), pot(3, 2), '2 · 3', '3 · 2') }); },
  });

  stufen(P('P1'), 'E', {
    1: () => { const [b, e] = wahl([[2, 9], [3, 7], [5, 5], [4, 6]]);
      return luecken(`Gib Basis und Exponent an, wenn du ${lang(b, e)} als Potenz schreibst. Basis: {{a}}, Exponent: {{b}}`, { a: b, b: e },
        h1('Zähle die Faktoren genau.'), { nachweis: [POT(b, e)] }); },
    2: (k) => {
      if (k === 0) { const [b, e] = wahl([[2, 10], [3, 6], [5, 5], [4, 5]]);
        return zahl(`Eine Potenz hat die Basis ${b} und den Wert ${fz(b ** e)}. Wie heißt der Exponent?`, e, [],
          h1(`Multipliziere so lange mit ${b}, bis ${fz(b ** e)} herauskommt. Zähle die Faktoren.`), { nachweis: [POT(b, e)] }); }
      if (k === 1) return auswahl('Welche Potenz hat den größten Wert?', [opt(pot(2, 10), true), opt(pot(10, 3)), opt(pot(5, 4)), opt(pot(3, 6)), opt(pot(6, 3))],
        h1('Rechne jede Potenz aus. Rechne geschickt, zum Beispiel 2¹⁰ = 2⁵ · 2⁵.'), { nachweis: [GROESSTES, ...N(pot(2, 10), pot(10, 3), pot(5, 4), pot(3, 6), pot(6, 3))] });
      const [z, b1, e1, b2, e2] = wahl([[81, 9, 2, 3, 4], [64, 8, 2, 2, 6], [16, 4, 2, 2, 4], [729, 27, 2, 9, 3]]);
      return luecken(`Schreibe ${z} auf zwei Arten als Potenz. Mit der Basis ${b1} ist der Exponent {{a}}. Mit der Basis ${b2} ist der Exponent {{b}}.`, { a: e1, b: e2 },
        h1(`Wie oft musst du ${b1} malnehmen? Und wie oft ${b2}?`), { nachweis: [POT(b1, e1), POT(b2, e2)] });
    },
    3: (k) => {
      if (k === 0) { const e = zz(4, 6);
        return auswahl(`Was passiert mit dem Wert einer Potenz mit der Basis 2, wenn der Exponent um 1 größer wird? Prüfe an ${pot(2, e)} und ${pot(2, e + 1)}.`, [
          opt(`Er verdoppelt sich. ${pot(2, e + 1)} = ${pot(2, e)} · 2 = ${2 ** (e + 1)}.`, true),
          opt('Er wird um 1 größer.', false, 'potenz-mal-exponent'), opt('Er wird um 2 größer.', false, 'potenz-mal-exponent'),
          opt('Er wird 10-mal so groß.', false, 'potenz-nullen'), opt('Das hängt von der Zahl ab.')],
        h1('Rechne beide Potenzen aus und vergleiche.'), { nachweis: [HILFSZAHL(1, 'Exponent wird um 1 größer'), ...N(pot(2, e), pot(2, e + 1), `${2 ** e} · 2`)] }); }
      const [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Eine Zehnerpotenz hat so viele Nullen, wie der Exponent angibt.“ ${k2} sagt: „Sie hat eine Null mehr als der Exponent.“ Wer hat recht?`, [
        opt(`${k1}. ${pot(10, 3)} = 1000 hat drei Nullen, ${pot(10, 5)} = ${fz(100000)} hat fünf Nullen.`, true),
        opt(`${k2}. ${pot(10, 3)} = ${fz(10000)}.`, false, 'potenz-nullen'),
        opt(`Keiner. ${pot(10, 3)} = 30.`, false, 'potenz-mal-exponent'),
        opt('Beide. Es kommt auf die Zahl an.'),
        opt(`${k2}. Die 10 hat schon eine Null.`, false, 'potenz-nullen')],
      h1('Schreibe zwei Zehnerpotenzen aus und zähle die Nullen.'), { nachweis: N(pot(10, 3), pot(10, 5)) }); },
  });

  // ===================================================================
  // P2 Potenzen berechnen, Quadratzahlen, Zehnerpotenzen
  // ===================================================================
  sechs(P('P2'), 'F', [
    () => { const b = suche(() => zz(3, 9), (x) => x !== 4);
      return zahl(Z('Wie viele Kästchen hat das Quadrat?', `Rechne ${b} · ${b}.`), b * b, potFehler(b, 2),
        h3('Gleich viele Kästchen in jeder Reihe: Rechne mal.', '4 Reihen mit je 4 Kästchen: 4 · 4 = 16.', `Es sind ${b} Reihen mit je ${b} Kästchen.`), { einheit: 'Kästchen', bild: B.quadrat(b), nachweis: N(`${b} · ${b}`) }); },
    () => { const b = suche(() => zz(3, 9), (x) => x !== 5);
      return zahl(Z('Rechne.', pot(b, 2)), b * b, potFehler(b, 2),
        h3(`${pot(b, 2)} heißt ${b} · ${b}.`, '5² = 5 · 5 = 25.', `Zähle die Kästchen im Bild. Es sind ${b} Reihen mit je ${b}.`), { bild: B.quadrat(b), nachweis: N(pot(b, 2), `${b} · ${b}`) }); },
    () => {
      return zahl(Z('Rechne.', pot(2, 3)), 8, potFehler(2, 3),
        h3('2³ heißt 2 · 2 · 2.', '3³ = 3 · 3 · 3. Erst 3 · 3 = 9. Dann 9 · 3 = 27.', '2 · 2 = 4. Rechne dann 4 · 2.'), { bild: B.quadrat(2, true), nachweis: N(pot(2, 3), '2 · 2', '4 · 2') }); },
    () => { const b = wahl([3, 4, 5]);
      return auswahl(Z(`Wie viel ist ${pot(b, 2)}?`), [opt(String(b * b), true), opt(String(b * 2), false, 'potenz-mal-exponent'), opt(String(b + 2), false, '1x1-addiert')],
        h3(`${pot(b, 2)} heißt ${b} · ${b}.`, '6² = 6 · 6 = 36.', `Zähle die Kästchen im Bild.`), { bild: B.quadrat(b), nachweis: [POT(b, 2), ...N(`${b} · ${b}`)] }); },
    () => { const b = zz(6, 9);
      return zahl(Z(`Ein Quadrat hat ${b} Reihen mit je ${b} Kästchen.`, 'Wie viele Kästchen sind es?'), b * b, potFehler(b, 2),
        h3('Rechne Reihen mal Kästchen in 1 Reihe.', '5 Reihen mit je 5: 5 · 5 = 25.', `Rechne ${b} · ${b} = 5 · ${b} + ${b - 5} · ${b}.`), { einheit: 'Kästchen', bild: B.quadrat(b), nachweis: N(`${b} · ${b}`) }); },
    () => {
      return zahl(Z('Rechne.', pot(3, 3)), 27, potFehler(3, 3),
        h3('3³ heißt 3 · 3 · 3.', '2³ = 2 · 2 · 2. Erst 2 · 2 = 4. Dann 4 · 2 = 8.', '3 · 3 = 9. Rechne dann 9 · 3.'), { bild: B.quadrat(3, true), nachweis: N(pot(3, 3), '3 · 3', '9 · 3') }); },
  ]);

  stufen(P('P2'), 'G', {
    1: (k) => {
      if (k === 0) { const b = suche(() => zz(6, 9), (x) => x !== 8);
        return zahl(Z('Berechne die Quadratzahl.', pot(b, 2)), b * b, potFehler(b, 2),
          h3(`${pot(b, 2)} = ${b} · ${b}.`, '8² = 8 · 8 = 64.', `Rechne ${b} · ${b}.`), { bild: B.quadrat(b), nachweis: N(pot(b, 2), `${b} · ${b}`) }); }
      if (k === 1) { const e = zz(3, 4);
        return zahl(Z('Berechne die Zehnerpotenz.', pot(10, e)), 10 ** e, potFehler(10, e),
          h3('Bei einer Zehnerpotenz sagt der Exponent, wie viele Nullen die Zahl hat.', '10² = 100. Das sind 2 Nullen.', `${pot(10, e)} = ${lang(10, e)}.`), { nachweis: N(pot(10, e), lang(10, e)) }); }
      const b = zz(3, 5);
      return zahl(Z('Berechne.', pot(b, 3)), b ** 3, potFehler(b, 3),
        h3(`${pot(b, 3)} = ${lang(b, 3)}. Das ist ein Würfel.`, '2³ = 2 · 2 · 2 = 8.', `${b} · ${b} = ${b * b}. Rechne dann ${b * b} · ${b}.`), { bild: B.quadrat(b, true), nachweis: N(pot(b, 3), `${b} · ${b}`, `${b * b} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const b = zz(6, 9), q = b * b, [f1, f2] = suche(() => [q + wahl([-3, -1, 1, 2, 3]), q + wahl([-2, 4, 5, 6])], ([x, y]) => x !== y && ![x, y].some((z) => Number.isInteger(Math.sqrt(z))));
        return auswahl('Welche Zahl ist eine Quadratzahl?', [opt(String(q), true), opt(String(f1)), opt(String(f2))],
          h3('Eine Quadratzahl ist eine Zahl mal sich selbst.', '36 ist eine Quadratzahl, denn 6 · 6 = 36.', `Probiere ${b} · ${b}.`), { nachweis: [{ art: 'quadrat', zahl: q, wurzel: b }, ...N(`${b} · ${b}`)] }); }
      const b = zz(3, 5);
      return zahl(Z(`Der große Würfel hat ${b} Schichten.`, `Jede Schicht hat ${b} Reihen mit je ${b} Würfeln.`, 'Wie viele kleine Würfel sind es?'), b ** 3, potFehler(b, 3),
        h3(`Das ist ${pot(b, 3)}.`, '2 Schichten mit je 2 · 2 Würfeln: 2³ = 8.', `In 1 Schicht sind ${b} · ${b} = ${b * b} Würfel.`), { einheit: 'Würfel', bild: B.quadrat(b, true), nachweis: N(`${b} · ${b}`, `${b * b} · ${b}`, pot(b, 3)) });
    },
    3: () => { const k = kind();
      return auswahl(Z(`${k} sagt:`, `„${pot(10, 4)} hat 4 Nullen.“`, 'Stimmt das?'), [
        opt(Z('Stimmt.', `${pot(10, 4)} = 10 · 10 · 10 · 10 = ${fz(10000)}.`), true),
        opt(Z('Falsch.', `${pot(10, 4)} = 40.`), false, 'potenz-mal-exponent'),
        opt(Z('Falsch.', `${pot(10, 4)} hat 5 Nullen.`), false, 'potenz-nullen')],
      h3('Schreibe die Potenz als Produkt und rechne aus.', '10³ = 10 · 10 · 10 = 1000. Das sind 3 Nullen.', 'Rechne 10 · 10 · 10 · 10. Zähle die Nullen.'), { nachweis: [U(true), HILFSZAHL(4, 'Exponent und Zahl der Nullen'), ...N(pot(10, 4), '10 · 10 · 10 · 10')] }); },
  });

  stufen(P('P2'), 'M', {
    1: (k) => {
      if (k === 0) { const b = wahl([13, 14, 15, 16, 20, 25]);
        return zahl(`Berechne ${pot(b, 2)}.`, b * b, potFehler(b, 2),
          h2('Schreibe die Potenz als Produkt.', `${pot(b, 2)} = ${b} · ${b}.`), { nachweis: N(pot(b, 2), `${b} · ${b}`) }); }
      const e = 5;
      return zahl(`Berechne ${pot(10, e)}.`, 10 ** e, potFehler(10, e),
        h2('Der Exponent sagt, wie viele Nullen die Zehnerpotenz hat.', `${pot(10, e)} = ${lang(10, e)}.`), { nachweis: N(pot(10, e), lang(10, e)) });
    },
    2: (k) => {
      if (k === 0) { const [b, e, c] = wahl([[2, 4, 3], [2, 5, 4], [3, 3, 5], [2, 6, 6]]);
        return zahl(`Berechne ${pot(b, e)} + ${pot(c, 2)}.`, b ** e + c * c, fehlerliste(b ** e + c * c, [[b * e + c * 2, 'potenz-mal-exponent']]),
          h2('Berechne zuerst die Potenzen. Addiere dann.', `${pot(b, e)} = ${b ** e}.`), { nachweis: N(pot(b, e), pot(c, 2), `${b ** e} + ${c * c}`) }); }
      if (k === 1) { const [u, o, w] = wahl([[130, 150, 12], [100, 120, 11], [150, 180, 13], [180, 200, 14], [210, 240, 15]]);
        return zahl(`Welche Quadratzahl liegt zwischen ${u} und ${o}?`, w * w, [],
          h2('Gehe die Quadratzahlen der Reihe nach durch.', `${w - 1} · ${w - 1} = ${(w - 1) * (w - 1)}. Wie geht es weiter?`), { nachweis: [HILFSZAHL(u, 'untere Grenze'), HILFSZAHL(o, 'obere Grenze'), HILFSZAHL(w - 1, 'probiert'), HILFSZAHL(w, 'probiert'), HILFSZAHL(w + 1, 'probiert'), ...N(`${w - 1} · ${w - 1}`, `${w + 1} · ${w + 1}`, `${w} · ${w}`)] }); }
      const b = wahl([13, 14, 15, 16, 17, 18, 19]);
      return zahl(`Welche Zahl mal sich selbst ergibt ${b * b}?`, b, fehlerliste(b, [[b * b / 2, 'potenz-mal-exponent']]),
        h2('Mache einen Überschlag mit Zehnerzahlen.', `10 · 10 = 100 und 20 · 20 = 400. Die Zahl liegt zwischen 10 und 20.`), { nachweis: [{ art: 'quadrat', zahl: b * b, wurzel: b }] });
    },
    3: () => { const b = wahl([20, 30, 40]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} rechnet ${pot(b, 2)} = ${b * b}. ${k2} rechnet ${pot(b, 2)} = ${b * 2}. Wer hat recht?`, [
        opt(`${k1}. ${pot(b, 2)} = ${b} · ${b} = ${b * b}.`, true),
        opt(`${k2}. ${b} · 2 = ${b * 2}.`, false, 'potenz-mal-exponent'),
        opt(`Keiner. ${pot(b, 2)} = ${fz(b * b * 10)}.`, false, 'potenz-nullen'),
        opt('Beide. Es kommt darauf an, wie man rechnet.')],
      h2('Der Exponent sagt, wie oft die Basis malgenommen wird.', `${pot(b, 2)} = ${b} · ${b}.`), { nachweis: [U(false, pot(b, 2), b * 2), ...N(`${b} · ${b}`, `${b} · 2`)] }); },
  });

  stufen(P('P2'), 'E', {
    1: () => { const [b, c] = wahl([[5, 4], [4, 3], [6, 5], [3, 2]]);
      return zahl(`Berechne ${pot(b, 4)} − ${pot(c, 4)}.`, b ** 4 - c ** 4, fehlerliste(b ** 4 - c ** 4, [[(b - c) ** 4, 'potenz-vertauscht'], [b * 4 - c * 4, 'potenz-mal-exponent']]),
        h1('Berechne beide Potenzen einzeln.'), { nachweis: N(pot(b, 4), pot(c, 4), `${b ** 4} − ${c ** 4}`) }); },
    2: (k) => {
      if (k === 0) { const g = wahl([200, 300, 500]), w = Math.floor(Math.sqrt(g));
        return zahl(`Welche ist die größte Quadratzahl, die kleiner als ${g} ist?`, w * w, [],
          h1('Probiere Zahlen mal sich selbst, bis du über die Grenze kommst.'), { nachweis: [HILFSZAHL(g, 'Grenze'), HILFSZAHL(w, 'probiert'), HILFSZAHL(w + 1, 'probiert'), ...N(`${w + 1} · ${w + 1}`, `${w} · ${w}`)] }); }
      if (k === 1) { const [e, f] = wahl([[3, 2], [2, 3], [2, 2], [3, 3]]);
        return zahl(`Berechne ${pot(10, e)} · ${pot(10, f)}.`, 10 ** (e + f), fehlerliste(10 ** (e + f), [[10 ** (e * f), 'potenz-mal-exponent']]),
          h1('Schreibe beide Zehnerpotenzen aus. Wie viele Nullen hat das Produkt?'), { nachweis: N(pot(10, e), pot(10, f), `${10 ** e} · ${10 ** f}`) }); }
      const n = wahl([8, 9, 10, 11]);
      return zahl(`Auf ein Feld legt man 2 Körner, auf das nächste 4, dann 8 und so weiter. Es sind immer doppelt so viele. Wie viele Körner liegen auf dem ${n}. Feld?`, 2 ** n, fehlerliste(2 ** n, [[2 ** (n - 1), 'potenz-mal-exponent'], [2 * n, 'potenz-mal-exponent']]),
        h1('Auf dem ersten Feld liegen 2¹, auf dem zweiten 2² Körner. Und auf dem n-ten Feld?'), { einheit: 'Körner', nachweis: [POT(2, n), ...N('2 · 2', '4 · 2', pot(2, n))] });
    },
    3: (k) => {
      if (k === 0) return auswahl('Die Quadratzahlen beginnen so: 1, 4, 9, 16, 25. Welche Regel gilt für den Unterschied zwischen zwei benachbarten Quadratzahlen?', [
        opt('Die Unterschiede sind die ungeraden Zahlen 3, 5, 7, 9 und so weiter.', true),
        opt('Der Unterschied ist immer 3.'), opt('Der Unterschied verdoppelt sich jedes Mal.', false, 'muster-falsche-regel'),
        opt('Die Unterschiede sind die geraden Zahlen.', false, 'muster-falsche-regel'), opt('Es gibt keine Regel.')],
      h1('Rechne die Unterschiede aus und schreibe sie nebeneinander.'), { nachweis: N('4 − 1', '9 − 4', '16 − 9', '25 − 16') });
      const [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${pot(2, 10)} ist größer als ${pot(10, 2)}.“ ${k2} sagt: „${pot(10, 2)} ist größer, weil 10 größer als 2 ist.“ Wer hat recht?`, [
        opt(`${k1}. ${pot(2, 10)} = 1024 und ${pot(10, 2)} = 100.`, true),
        opt(`${k2}. Die größere Basis gewinnt immer.`, false, 'potenz-vertauscht'),
        opt('Keiner. Beide Potenzen sind gleich groß.', false, 'potenz-vertauscht'),
        opt(`${k2}. ${pot(2, 10)} = 20.`, false, 'potenz-mal-exponent'),
        opt('Beide. Es kommt auf die Zahl an.')],
      h1('Rechne beide Potenzen aus.'), { nachweis: N(pot(2, 10), pot(10, 2)) }); },
  });
}
