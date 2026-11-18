// Aufgaben zu 5.4.1 „Kopfrechnen: das kleine Einmaleins“ (Lernziele K1 und K2) nach ADR 0015.
// Das Einmaleins ist Voraussetzung für das Dividieren (Brücke, ADR 0014) und zugleich ein normaler Meilenstein.
//   F  Kernaufgaben mit 2, 5 und 10 am Punktefeld und am Gruppenbild
//   G  das ganze kleine Einmaleins, Nachbaraufgaben, Platzhalter
//   M  schwere Aufgaben (6 bis 9), Zerlegen in Kernaufgaben, zwei Schritte, Fehler finden
//   E  Strukturen: Quadratzahlen, Zahlenrätsel, Teilbarkeit, Regeln aufstellen

import { sechs, stufen, zahl, auswahl, opt, luecken, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, U, WERT } from '../werkzeug.mjs';

const K = (kurz) => `5.4.1-${kurz}`;
const reihe = (b, bis) => Array.from({ length: bis }, (_, i) => (i + 1) * b).join(', ');
const malFehler = (a, b) => fehlerliste(a * b, [[a * b + b, '1x1-nachbar'], [a * b - b, '1x1-nachbar'], [a + b, '1x1-addiert']]);
const divFehler = (q) => fehlerliste(q, [[q + 1, 'div-einmaleins'], [q - 1, 'div-einmaleins']]);
const paare = (p) => { const x = []; for (let a = 1; a <= 10; a++) if (p % a === 0 && p / a <= 10) x.push([a, p / a]); return x; };
const verschieden = (von, bis) => suche(() => [zz(von, bis), zz(von, bis)], ([x, y]) => x !== y);

export function einmaleins() {
  // ===================================================================
  // K1 Malaufgaben des kleinen Einmaleins
  // ===================================================================
  sechs(K('K1'), 'F', [
    () => { const b = wahl([2, 5, 10]), n = suche(() => zz(2, 5), (x) => x !== b);
      return zahl(Z('Rechne.', `${n} · ${b}`), n * b, malFehler(n, b),
        h3('Mal heißt: gleich große Reihen zusammen.', '3 · 5 heißt: 3 Reihen mit je 5. Zähle 5, 10, 15. Das Ergebnis ist 15.', `Zähle in ${b}er-Schritten: ${reihe(b, n)}.`), { bild: B.feld(n, b), nachweis: N(`${n} · ${b}`) }); },
    () => { const b = wahl([2, 5, 10]), n = suche(() => zz(3, 4), (x) => x !== b);
      return auswahl(Z(Array(n).fill(b).join(' + '), 'Welche Mal-Aufgabe passt?'), [opt(`${n} · ${b}`, true), opt(`${b} + ${n}`, false, '1x1-addiert'), opt(`${n + 1} · ${b}`, false, '1x1-nachbar')],
        h3('Zähle, wie oft die gleiche Zahl dasteht.', '4 + 4 + 4 sind 3 Vieren. Dazu passt 3 · 4.', `Die Zahl ${b} steht ${n}-mal da.`), { bild: B.gruppen(n, b), nachweis: [WERT(n * b), ...N(Array(n).fill(b).join(' + '), `${n} · ${b}`)] }); },
    () => { const a = wahl([2, 5]), b = suche(() => zz(3, 6), (x) => x !== a);
      return luecken(Z('Welche Zahl fehlt?', `${a} · ${b} = ${b} · {{x}}`), { x: [a, fehlerliste(a, [[b, '1x1-addiert']])] },
        h3('Bei Mal-Aufgaben darfst du die Zahlen tauschen.', '2 · 7 und 7 · 2 ergeben beide 14.', `Tausche die Zahlen von ${a} · ${b}.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) }); },
    () => { const n = zz(2, 4), b = suche(() => wahl([2, 5, 10]), (x) => x !== n), k = kind();
      const [ding, eins, viele] = wahl([['Murmeln', 'Tüte', 'Tüten'], ['Stifte', 'Packung', 'Packungen'], ['Eier', 'Schachtel', 'Schachteln']]);
      return zahl(Z(`${k} hat ${n} ${viele}.`, `In jeder ${eins} sind ${b} ${ding}.`, `Wie viele ${ding} sind es zusammen?`), n * b, fehlerliste(n * b, [[n + b, '1x1-addiert']]),
        h3('Gleich viele in jeder Packung: Das ist eine Mal-Aufgabe.', '3 Tüten mit je 2 Bonbons: 3 · 2 = 6.', `Rechne ${n} · ${b}.`), { einheit: ding, bild: B.gruppen(n, b), nachweis: N(`${n} · ${b}`) }); },
    () => { const r = zz(3, 4), s = 5;
      return auswahl('Welche Aufgabe passt zum Bild?', [opt(`${r} · ${s}`, true), opt(`${r} + ${s}`, false, '1x1-addiert'), opt(`${r} · ${s + 1}`, false, '1x1-nachbar')],
        h3('Zähle die Reihen. Zähle dann die Punkte in 1 Reihe.', '2 Reihen mit je 5 Punkten: 2 · 5.', `Es sind ${r} Reihen. In jeder Reihe sind ${s} Punkte.`), { bild: B.feld(r, s), nachweis: N(`${r} · ${s}`) }); },
    () => { const n = zz(2, 9);
      return zahl(Z('Rechne.', `${n} · 10`), n * 10, fehlerliste(n * 10, [[n + 10, '1x1-addiert'], [n, 'stellenwert']]),
        h3('Mal 10 heißt: so viele Zehner.', '3 · 10 sind 3 Zehner. Das ist 30.', `Im Bild siehst du ${n} Zehner. Zähle 10, 20, 30 und so weiter.`), { bild: B.material({ z: n }), nachweis: N(`${n} · 10`) }); },
  ]);

  stufen(K('K1'), 'G', {
    1: (k) => {
      if (k === 0) { const a = zz(6, 9), b = zz(3, 9);
        return zahl(Z('Rechne.', `${a} · ${b}`), a * b, malFehler(a, b),
          h3('Nutze eine Kernaufgabe mit 2, 5 oder 10.', '6 · 7: Du weißt 5 · 7 = 35. Dazu noch einmal 7 ergibt 42.', `5 · ${b} = ${5 * b}. Dazu kommen ${a - 5} · ${b} = ${(a - 5) * b}.`), { bild: B.feld(a, b, 5), nachweis: N(`${a} · ${b}`, `5 · ${b}`, `${a - 5} · ${b}`) }); }
      if (k === 1) { const a = zz(3, 9), b = zz(3, 9);
        return zahl(Z('Welche Zahl fehlt?', `${a} · ▢ = ${a * b}`), b, fehlerliste(b, [[a * b - a, '1x1-addiert'], [b + 1, '1x1-nachbar'], [b - 1, '1x1-nachbar']]),
          h3('Gehe die Reihe durch.', '4 · ▢ = 28. Zähle 4, 8, 12, 16, 20, 24, 28. Das sind 7 Schritte.', `Zähle in ${a}er-Schritten: ${reihe(a, b)}.`), { nachweis: N(`${a * b} : ${a}`, `${a} · ${b}`) }); }
      const n = zz(3, 9), [ding, b, saetze] = wahl([['Stühle', zz(6, 9), (x, y) => [`In 1 Reihe stehen ${y} Stühle.`, `Es gibt ${x} Reihen.`]], ['Beine', 8, (x) => ['1 Spinne hat 8 Beine.', `Im Netz sitzen ${x} Spinnen.`]], ['Eier', 6, (x) => ['In 1 Karton passen 6 Eier.', `Es gibt ${x} Kartons.`]]]);
      return zahl(Z(...saetze(n, b), `Wie viele ${ding} sind es?`), n * b, fehlerliste(n * b, [[n + b, '1x1-addiert'], [n * b - b, '1x1-nachbar']]),
        h3('Gleich viele in jeder Gruppe: Das ist eine Mal-Aufgabe.', '4 Reihen mit je 5 Stühlen: 4 · 5 = 20.', `Rechne ${n} · ${b}.`), { einheit: ding, bild: B.feld(n, b), nachweis: N(`${n} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const a = zz(3, 8), b = zz(3, 9);
        return luecken(Z(`${a} · ${b} = ${a * b}`, `${a + 1} · ${b} = {{x}}`), { x: [(a + 1) * b, fehlerliste((a + 1) * b, [[a * b + 1, '1x1-nachbar'], [a * b + a, '1x1-nachbar']])] },
          h3('Bei der Nachbaraufgabe kommt eine Reihe dazu.', '5 · 6 = 30. Bei 6 · 6 kommt noch eine 6 dazu: 30 + 6 = 36.', `Rechne ${a * b} + ${b}.`), { bild: B.feld(a + 1, b, a), nachweis: N(`${a} · ${b}`, `${a * b} + ${b}`, `${a + 1} · ${b}`) }); }
      const [a, b] = verschieden(3, 9), p = a * b;
      return auswahl(`Welche Aufgabe hat das Ergebnis ${p}?`, [opt(`${a} · ${b}`, true), opt(`${a + 1} · ${b}`, false, '1x1-nachbar'), opt(`${a} + ${b}`, false, '1x1-addiert')],
        h3('Rechne jede Aufgabe aus.', '3 · 6 = 18 und 3 + 6 = 9. Nur 3 · 6 hat das Ergebnis 18.', `Rechne ${a} · ${b}.`), { nachweis: [{ art: 'wert', wert: p }, ...N(`${a} · ${b}`, `${a + 1} · ${b}`, `${a} + ${b}`)] });
    },
    3: () => { const a = wahl([3, 5, 7, 9]), k = kind();
      return auswahl(Z(`${k} sagt:`, '„Jede Zahl mal 2 ergibt eine gerade Zahl.“', `Prüfe mit ${a} · 2.`, 'Stimmt das?'),
        [opt(`Stimmt. ${a} · 2 = ${a * 2}. Mal 2 ist das Doppelte. Ein Doppeltes ist immer gerade.`, true), opt(`Falsch. ${a} ist ungerade. Dann ist auch ${a} · 2 ungerade.`), opt('Falsch. Das gilt nur bis 10.')],
        h3('Rechne die Aufgabe aus. Ist das Ergebnis gerade?', '7 · 2 = 14. 14 ist gerade. Mal 2 heißt: 2 gleiche Teile.', `Rechne ${a} · 2. Teile das Ergebnis in 2 gleiche Teile.`), { bild: B.feld(a, 2), nachweis: [U(true), ...N(`${a} · 2`)] }); },
  });

  stufen(K('K1'), 'M', {
    1: (k) => {
      const [a, b] = suche(() => [zz(6, 9), zz(6, 9)], ([x, y]) => x !== y || k === 1);
      if (k === 0) return zahl(`Wie viel ist ${a} · ${b}?`, a * b, malFehler(a, b), h2('Zerlege in eine Kernaufgabe und den Rest.', `Rechne 5 · ${b} = ${5 * b}. Dazu kommen ${a - 5} · ${b} = ${(a - 5) * b}.`), { nachweis: N(`${a} · ${b}`, `5 · ${b}`, `${a - 5} · ${b}`) });
      return zahl(`Welche Zahl fehlt? ▢ · ${b} = ${a * b}`, a, fehlerliste(a, [[a + 1, '1x1-nachbar'], [a - 1, '1x1-nachbar']]), h2(`Welche Zahl mal ${b} ergibt ${a * b}? Prüfe mit einer Kernaufgabe.`, `5 · ${b} = ${5 * b}. Bis ${a * b} fehlen noch ${(a - 5) * b}.`), { nachweis: N(`${a * b} : ${b}`, `${a} · ${b}`, `5 · ${b}`, `${a * b} − ${5 * b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = verschieden(6, 9);
        return auswahl(`Lisa rechnet ${a} · ${b} mit einer Kernaufgabe. Welcher Rechenweg passt?`,
          [opt(`5 · ${b} + ${a - 5} · ${b}`, true), opt(`5 · ${b} + ${a - 5}`, false, '1x1-addiert'), opt(`${a} · 5 + ${b}`, false, '1x1-addiert'), opt(`5 · ${b} + ${a} · ${b}`, false, '1x1-nachbar')],
          h2('Teile die erste Zahl auf: 5 und der Rest. Beide Teile werden mit derselben Zahl malgenommen.', `Teile ${a} in 5 und ${a - 5}. Nimm beide Teile mal ${b}.`), { nachweis: [{ art: 'wert', wert: a * b }, ...N(`${a} · ${b}`, `5 · ${b} + ${a - 5} · ${b}`)] }); }
      if (k === 1) { const r = zz(6, 9), p = zz(3, 5), frei = zz(5, r * p - 5);
        return zahl(`In einem Bus gibt es ${r} Reihen mit je ${p} Plätzen. ${r * p - frei} Plätze sind besetzt. Wie viele Plätze sind noch frei?`, frei, fehlerliste(frei, [[r * p, 'sach-schritt-vergessen'], [r + p, '1x1-addiert']]),
          h2('Rechne zuerst aus, wie viele Plätze es insgesamt gibt.', `Insgesamt sind es ${r} · ${p} = ${r * p} Plätze.`), { einheit: 'Plätze', nachweis: N(`${r} · ${p}`, `${r * p} − ${r * p - frei}`) }); }
      const p = wahl([12, 16, 18, 20, 24, 36]);
      const richtig = paare(p).filter(([x, y]) => x <= y && x > 1);
      const falsch = suche(() => [[zz(2, 9), zz(2, 9)], [zz(2, 9), zz(2, 9)]], (f) => f.every(([x, y]) => x * y !== p) && f[0].join() !== f[1].join());
      return auswahl(`Welche Aufgaben haben das Ergebnis ${p}? Wähle alle richtigen aus.`, [...richtig.map(([x, y]) => opt(`${x} · ${y}`, true)), ...falsch.map(([x, y]) => opt(`${x} · ${y}`, false, '1x1-nachbar'))],
        h2(`Gehe die Reihen durch: In welchen Reihen kommt ${p} vor?`, `${richtig[0][0]} · ${richtig[0][1]} = ${p}. Prüfe die anderen genauso.`), { mehrfach: true, nachweis: [{ art: 'wert', wert: p }, ...N(...richtig.map(([x, y]) => `${x} · ${y}`))] });
    },
    3: () => { const a = zz(6, 9), b = zz(6, 9), k = kind();
      return auswahl(`${k} rechnet ${a} · ${b} und erhält ${a * b + b}. Wie lässt sich der Fehler finden?`,
        [opt(`Mit der Nachbaraufgabe: ${a - 1} · ${b} = ${(a - 1) * b}. Dazu kommt noch einmal ${b}. Das sind ${a * b}.`, true), opt('Mit derselben Rechnung, noch einmal genauso gerechnet.'), opt(`Mit der Rechnung ${a} + ${b}.`, false, '1x1-addiert'), opt('Gar nicht. Das Ergebnis stimmt.', false, '1x1-nachbar')],
        h2('Welche Kernaufgabe oder Nachbaraufgabe kennst du sicher?', `${a - 1} · ${b} = ${(a - 1) * b}. Vergleiche mit dem Ergebnis ${a * b + b}.`), { nachweis: N(U(false, `${a} · ${b}`, a * b + b), `${a - 1} · ${b}`, `${(a - 1) * b} + ${b}`, `${a} · ${b}`) }); },
  });

  stufen(K('K1'), 'E', {
    1: () => { const n = zz(3, 9);
      return zahl(`Eine Zahl mal sich selbst ergibt ${n * n}. Wie heißt die Zahl?`, n, fehlerliste(n, [[n * n / 2, '1x1-addiert']]), h1(`Welche Aufgabe mit zwei gleichen Zahlen kennst du, die ${n * n} ergibt?`), { nachweis: [{ art: 'quadrat', zahl: n * n, wurzel: n }, ...N(`${n} · ${n}`)] }); },
    2: (k) => {
      if (k === 0) { const kein = wahl([23, 29, 31, 37, 41, 43, 47, 53]);
        const ja = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (x) => new Set(x.map(([u, v]) => u * v)).size === 3);
        return auswahl('Welche Zahl ist kein Ergebnis des kleinen Einmaleins?', [opt(String(kein), true), ...ja.map(([u, v]) => opt(String(u * v), false, '1x1-nachbar'))],
          h1('Zu welchen Zahlen findest du eine Aufgabe aus dem Einmaleins?'), { nachweis: [{ art: 'zahlenwahl', eigenschaft: 'einmaleins', gilt: false }, { art: 'anzahlProdukte', produkt: kein, bis: 10, anzahl: 0 }] }); }
      if (k === 1) { const [a, b] = suche(() => [zz(2, 9), zz(2, 9)], ([x, y]) => x < y);
        return luecken(`Zwei Zahlen aus dem Einmaleins haben das Produkt ${a * b} und die Summe ${a + b}. Die kleinere Zahl ist {{x}}, die größere ist {{y}}.`, { x: a, y: b },
          h1(`Welche Aufgaben mit dem Ergebnis ${a * b} kennst du? Welche passt auch zur Summe?`), { nachweis: [{ art: 'zahlenpaar', produkt: a * b, summe: a + b, paar: [a, b] }, ...N(`${a} · ${b}`, `${a} + ${b}`)] }); }
      const p = wahl([12, 18, 20, 24, 36]), n = paare(p).length;
      return zahl(`Wie viele Aufgaben des kleinen Einmaleins (beide Zahlen von 1 bis 10) haben das Ergebnis ${p}? Zähle Tauschaufgaben einzeln.`, n, fehlerliste(n, [[Math.ceil(n / 2), '1x1-nachbar']]),
        h1('Gehe alle Reihen von 1 bis 10 durch. In welchen kommt die Zahl vor?'), { nachweis: [{ art: 'anzahlProdukte', produkt: p, von: 1, bis: 10, anzahl: n }] });
    },
    3: (k) => {
      if (k === 0) { const [satz, richtig, falsch, bsp] = wahl([
        ['„Ungerade mal ungerade ergibt immer eine ungerade Zahl.“', 'Stimmt. Je zwei gleiche ungerade Päckchen ergeben zusammen eine gerade Zahl. Bei einer ungeraden Anzahl Päckchen bleibt eines übrig. Gerade plus ungerade ist ungerade.',
          ['Falsch. 3 · 5 ist gerade.', 'Falsch. Zwei ungerade Zahlen ergeben immer eine gerade Zahl.', 'Stimmt, aber nur im kleinen Einmaleins.', 'Das hängt von den beiden Zahlen ab.'], ['3 · 5', '7 · 9']],
        ['„Eine gerade Zahl mal irgendeine Zahl ergibt immer eine gerade Zahl.“', 'Stimmt. Eine gerade Zahl ist ein Doppeltes. Ein Doppeltes mal eine Zahl bleibt ein Doppeltes.',
          ['Falsch. Mit einer ungeraden Zahl wird das Ergebnis ungerade.', 'Falsch. Das gilt nur für 2 und 4.', 'Stimmt, aber nur, wenn die andere Zahl auch gerade ist.', 'Das hängt von den beiden Zahlen ab.'], ['4 · 3', '6 · 7']],
      ]);
        return auswahl(`Stimmt das? ${satz} Wähle die beste Begründung.`, [opt(richtig, true), ...falsch.map((f) => opt(f))], h1('Probiere einige Beispiele. Kannst du erklären, warum es immer so ist?'), { nachweis: [U(true), ...N(...bsp)] }); }
      return auswahl('9 · 1 = 9, 9 · 2 = 18, 9 · 3 = 27, 9 · 4 = 36. Stelle eine Regel für alle Ergebnisse von 9 · 1 bis 9 · 10 auf.', [
        opt('Zehnerziffer und Einerziffer ergeben zusammen immer 9, denn von Ergebnis zu Ergebnis wird der Zehner um 1 größer und der Einer um 1 kleiner.', true),
        opt('Alle Ergebnisse sind ungerade.'), opt('Die Einerziffer wird von Ergebnis zu Ergebnis um 1 größer.'), opt('Zehnerziffer und Einerziffer ergeben zusammen immer 10.'), opt('Es gibt keine Regel.')],
      h1('Vergleiche in jedem Ergebnis die Zehnerziffer und die Einerziffer. Was geschieht, wenn 9 dazukommt?'), { nachweis: N(...Array.from({ length: 10 }, (_, i) => `9 · ${i + 1}`), '1 + 8', '2 + 7', '3 + 6', '4 + 5', '9 + 0') });
    },
  });

  // ===================================================================
  // K2 Geteilt-Aufgaben aus dem kleinen Einmaleins
  // ===================================================================
  sechs(K('K2'), 'F', [
    () => { const d = wahl([2, 5]), q = suche(() => zz(2, 5), (x) => x !== d), a = d * q;
      return zahl(Z('Rechne.', `${a} : ${d}`), q, divFehler(q),
        h3(`Lege immer ${d} zusammen. Zähle die Gruppen.`, '15 : 5: Immer 5 zusammen. Das sind 3 Gruppen. Also 15 : 5 = 3.', `Zähle im Bild die Gruppen mit je ${d} Plättchen.`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const d = wahl([2, 5]), q = suche(() => zz(2, 4), (x) => x !== d), a = d * q;
      return auswahl(Z(`${a} : ${d}`, 'Welche Mal-Aufgabe hilft dir?'), [opt(`${q} · ${d} = ${a}`, true), opt(`${q + 1} · ${d} = ${(q + 1) * d}`, false, 'div-einmaleins'), opt(`${a} + ${d} = ${a + d}`, false, 'div-falsche-rechenart')],
        h3('Mal und geteilt gehören zusammen.', 'Zu 12 : 2 passt 6 · 2 = 12.', `Suche die Mal-Aufgabe mit dem Ergebnis ${a}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${q}`, `${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const d = zz(2, 4), q = suche(() => zz(2, 5), (x) => x !== d), a = d * q, ding = wahl(['Äpfel', 'Bonbons', 'Karten']);
      return zahl(Z(`${a} ${ding} werden an ${d} Kinder verteilt.`, 'Jedes Kind bekommt gleich viele.', `Wie viele ${ding} bekommt 1 Kind?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [a + d, 'div-falsche-rechenart']]),
        h3('Verteile gerecht. Im Bild hat jedes Kind eine Gruppe.', '6 Äpfel für 2 Kinder: 6 : 2 = 3. Jedes Kind bekommt 3.', `Rechne ${a} : ${d}. Zähle die Plättchen in 1 Gruppe.`), { einheit: ding, bild: B.gruppen(d, q), nachweis: N(`${a} : ${d}`) }); },
    () => { const q = zz(2, 9);
      return zahl(Z('Rechne.', `${q * 10} : 10`), q, fehlerliste(q, [[q * 10, 'div-stellenwert']]),
        h3('Geteilt durch 10 heißt: Wie viele Zehner sind es?', '30 : 10 = 3. In 30 stecken 3 Zehner.', `Zähle im Bild die Zehner.`), { bild: B.material({ z: q }), nachweis: N(`${q * 10} : 10`) }); },
    () => { const d = wahl([2, 5]), q = suche(() => zz(3, 5), (x) => x !== d), a = d * q;
      return zahl(Z('Welche Zahl fehlt?', `${a} : ▢ = ${q}`), d, fehlerliste(d, [[a - q, 'div-falsche-rechenart']]),
        h3('Denke an die Mal-Aufgabe.', '20 : ▢ = 4. Du weißt 4 · 5 = 20. Die Zahl ist 5.', `Im Bild sind ${q} Gruppen. Wie viele Plättchen sind in 1 Gruppe?`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${q}`, `${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const [g, je] = suche(() => [zz(2, 4), wahl([2, 5])], ([x, y]) => x !== y), a = g * je;
      return auswahl('Welche Aufgabe passt zum Bild?', [opt(`${a} : ${je} = ${g}`, true), opt(`${a} : ${je} = ${g + 1}`, false, 'div-einmaleins'), opt(`${je} : ${a} = ${g}`, false, 'div-vertauscht')],
        h3('Zähle alle Plättchen. Zähle dann die Gruppen.', '6 Plättchen, immer 2 zusammen, 3 Gruppen: 6 : 2 = 3.', `Es sind ${a} Plättchen. Immer ${je} sind zusammen.`), { bild: B.gruppen(g, je), nachweis: N(`${a} : ${je}`) }); },
  ]);

  stufen(K('K2'), 'G', {
    1: (k) => {
      if (k === 0) { const d = zz(3, 9), q = zz(3, 9), a = d * q;
        return zahl(Z('Rechne.', `${a} : ${d}`), q, divFehler(q),
          h3('Denke an die Mal-Aufgabe.', '42 : 6: Du weißt 7 · 6 = 42. Also ist 42 : 6 = 7.', `Zähle in ${d}er-Schritten bis ${a}: ${reihe(d, q)}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`) }); }
      if (k === 1) { const d = zz(3, 9), q = zz(3, 9), a = d * q;
        return zahl(Z('Welche Zahl fehlt?', `${a} : ▢ = ${q}`), d, fehlerliste(d, [[a - q, 'div-falsche-rechenart'], [d + 1, 'div-einmaleins']]),
          h3('Denke an die Mal-Aufgabe.', '36 : ▢ = 9. Du weißt 9 · 4 = 36. Die Zahl ist 4.', `${q} mal welche Zahl ergibt ${a}?`), { nachweis: N(`${a} : ${q}`, `${a} : ${d}`, `${q} · ${d}`) }); }
      const [d, q] = verschieden(3, 9), a = d * q;
      return luecken(Z(`${q} · ${d} = ${a}`, `${a} : ${d} = {{x}}`, `${a} : ${q} = {{y}}`), { x: [q, fehlerliste(q, [[d, 'div-vertauscht']])], y: [d, fehlerliste(d, [[q, 'div-vertauscht']])] },
        h3('Zu einer Mal-Aufgabe gehören 2 Geteilt-Aufgaben.', '3 · 5 = 15. Dazu gehören 15 : 5 = 3 und 15 : 3 = 5.', `${a} : ${d} fragt: Welche Zahl mal ${d} ergibt ${a}?`), { bild: B.feld(q, d), nachweis: N(`${q} · ${d}`, `${a} : ${d}`, `${a} : ${q}`) });
    },
    2: (k) => {
      if (k === 0) { const d = zz(3, 9), q = zz(3, 9), a = d * q;
        return zahl(Z(`${a} Kinder bilden Gruppen.`, `In jeder Gruppe sind ${d} Kinder.`, 'Wie viele Gruppen gibt es?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q + 1, 'div-einmaleins']]),
          h3('Wie oft passt die Gruppe in alle Kinder?', '24 Kinder, Gruppen mit je 6: 24 : 6 = 4. Es gibt 4 Gruppen.', `Rechne ${a} : ${d}.`), { einheit: 'Gruppen', bild: B.menge(a), nachweis: N(`${a} : ${d}`) }); }
      const [d, q] = [zz(3, 9), zz(3, 9)];
      const falsch = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (f) => f.every(([x]) => x !== q) && new Set([`${d * q} : ${d}`, ...f.map(([x, y]) => `${x * y} : ${y}`)]).size === 3);
      return auswahl(`Welche Aufgabe hat das Ergebnis ${q}?`, [opt(`${d * q} : ${d}`, true), ...falsch.map(([x, y]) => opt(`${x * y} : ${y}`, false, 'div-einmaleins'))],
        h3('Rechne jede Aufgabe aus.', '35 : 5 = 7, denn 7 · 5 = 35.', `Prüfe ${d * q} : ${d} mit ${q} · ${d}.`), { nachweis: [{ art: 'wert', wert: q }, ...N(`${d * q} : ${d}`, ...falsch.map(([x, y]) => `${x * y} : ${y}`))] });
    },
    3: () => { const [d, q] = verschieden(3, 9), a = d * q, k = kind();
      return auswahl(Z(`${k} rechnet ${a} : ${d} = ${q}.`, `${k} prüft mit ${q} · ${d}.`, 'Warum klappt das?'),
        [opt(`Mal macht geteilt wieder rückgängig. ${q} · ${d} = ${a}.`, true), opt(`Auch ${q} + ${d} ergibt ${a}.`, false, 'div-falsche-rechenart'), opt('Das klappt nur bei kleinen Zahlen.')],
        h3('Rechne die Mal-Aufgabe aus. Was kommt heraus?', '12 : 3 = 4. Prüfe: 4 · 3 = 12. Das ist wieder die erste Zahl.', `Rechne ${q} · ${d}. Vergleiche mit ${a}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`, `${q} + ${d}`) }); },
  });

  stufen(K('K2'), 'M', {
    1: (k) => {
      const [d, q] = [zz(6, 9), zz(6, 9)], a = d * q;
      if (k === 0) return zahl(`Wie viel ist ${a} : ${d}?`, q, divFehler(q), h2('Nutze die Umkehraufgabe.', `Welche Zahl mal ${d} ergibt ${a}? Beginne mit 5 · ${d} = ${5 * d}.`), { nachweis: N(`${a} : ${d}`, `5 · ${d}`) });
      return zahl(`Welche Zahl fehlt? ${a} : ▢ = ${q}`, d, fehlerliste(d, [[a - q, 'div-falsche-rechenart'], [d + 1, 'div-einmaleins']]), h2('Nutze die Umkehraufgabe.', `${q} · ▢ = ${a}. Probiere ${q} · 5 = ${q * 5} und gehe weiter.`), { nachweis: N(`${a} : ${q}`, `${a} : ${d}`, `${q} · 5`) });
    },
    2: (k) => {
      if (k === 0) { const d = zz(4, 8), q = zz(4, 9), laufen = zz(3, 9), alle = d * q + laufen;
        return zahl(`${alle} Kinder fahren zum Ausflug. ${laufen} Kinder kommen zu Fuß. Die anderen fahren in Autos mit je ${d} Plätzen. Wie viele Autos braucht man?`, q,
          fehlerliste(q, [[alle % d === 0 ? alle / d : -1, 'sach-schritt-vergessen'], [d * q - d, 'div-falsche-rechenart']]),
          h2('Wie viele Kinder fahren wirklich mit dem Auto?', `${alle} − ${laufen} = ${d * q}. Teile dann durch ${d}.`), { einheit: 'Autos', nachweis: N(`${alle} − ${laufen}`, `${d * q} : ${d}`) }); }
      if (k === 1) { const q = zz(3, 8), richtig = verschieden(3, 9);
        const falsch = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (f) => f.every(([, y]) => y !== q) && new Set([...richtig.map((d) => `${d * q} : ${d}`), ...f.map(([d, y]) => `${d * y} : ${d}`)]).size === 4);
        return auswahl(`Welche Aufgaben haben das Ergebnis ${q}? Wähle alle richtigen aus.`, [...richtig.map((d) => opt(`${d * q} : ${d}`, true)), ...falsch.map(([d, y]) => opt(`${d * y} : ${d}`, false, 'div-einmaleins'))],
          h2('Rechne jede Aufgabe mit der Umkehraufgabe nach.', `${richtig[0] * q} : ${richtig[0]} = ${q}, denn ${q} · ${richtig[0]} = ${richtig[0] * q}.`), { mehrfach: true, nachweis: [{ art: 'wert', wert: q }, ...N(`${richtig[0] * q} : ${richtig[0]}`, `${q} · ${richtig[0]}`)] }); }
      const [d, q] = verschieden(4, 9);
      return zahl(`Durch welche Zahl musst du ${d * q} teilen, um ${q} zu erhalten?`, d, fehlerliste(d, [[d * q - q, 'div-falsche-rechenart']]),
        h2('Stell die Aufgabe mit Platzhalter auf.', `${d * q} : ▢ = ${q}. Welche Zahl mal ${q} ergibt ${d * q}?`), { nachweis: N(`${d * q} : ${q}`, `${d * q} : ${d}`) });
    },
    3: () => { const [d, q] = [zz(6, 9), zz(5, 8)], a = d * q, k = kind();
      return auswahl(`${k} rechnet ${a} : ${d} = ${q + 1}. Wie lässt sich am besten zeigen, dass das falsch ist?`,
        [opt(`Mit der Probe: ${q + 1} · ${d} = ${(q + 1) * d}. Das ist nicht ${a}.`, true), opt('Indem man das richtige Ergebnis nennt.'), opt(`Mit der Rechnung ${q + 1} + ${d}.`, false, 'div-falsche-rechenart'), opt('Gar nicht. Das Ergebnis stimmt.', false, 'div-einmaleins')],
        h2('Welche Rechnung prüft eine Geteilt-Aufgabe?', `Rechne ${q + 1} · ${d} und vergleiche mit ${a}.`), { nachweis: N(`${q + 1} · ${d}`, `${a} : ${d}`) }); },
  });

  stufen(K('K2'), 'E', {
    1: () => { const [d, q] = [zz(4, 9), zz(4, 9)];
      return zahl(`Ich denke mir eine Zahl. Ich teile sie durch ${d} und erhalte ${q}. Welche Zahl habe ich mir gedacht?`, d * q, fehlerliste(d * q, [[d + q, 'div-falsche-rechenart']]), h1('Wie kannst du das Teilen rückgängig machen?'), { nachweis: N(`${q} · ${d}`, `${d * q} : ${d}`) }); },
    2: (k) => {
      if (k === 0) { const a = wahl([24, 36, 48, 72]);
        const teiler = [2, 3, 4, 6, 8, 9].filter((t) => a % t === 0), nicht = wahl([5, 7, 9, 8].filter((t) => a % t !== 0));
        const drei = suche(() => [wahl(teiler), wahl(teiler), wahl(teiler)], (x) => new Set(x).size === 3);
        return auswahl(`Durch welche Zahl ist ${a} nicht teilbar?`, [opt(String(nicht), true), ...drei.map((t) => opt(String(t), false, 'div-einmaleins'))],
          h1('Prüfe jede Zahl: Geht die Geteilt-Aufgabe ohne Rest auf?'), { nachweis: N({ art: 'zahlenwahl', eigenschaft: 'teilt', zahl: a, gilt: false }, ...drei.map((t) => `${a} : ${t}`), `${Math.floor(a / nicht)} · ${nicht} + ${a % nicht}`) }); }
      if (k === 1) { const a = wahl([12, 18, 20, 24, 30, 36, 40]);
        const n = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => a % t === 0).length;
        return zahl(`Wie viele Zahlen von 1 bis 10 teilen ${a} ohne Rest?`, n, fehlerliste(n, [[n - 1, 'div-einmaleins'], [n + 1, 'div-einmaleins']]), h1('Vergiss die 1 nicht. Und teilt die Zahl 10 auch?'), { nachweis: [{ art: 'anzahlTeiler', zahl: a, von: 1, bis: 10, anzahl: n }] }); }
      const [d, e, f] = suche(() => [zz(2, 4), zz(2, 3), zz(2, 5)], (x) => new Set(x).size === 3);
      return zahl(`Die Zahl ${d * e * f} wird durch ${d} geteilt. Das Ergebnis wird noch einmal durch ${e} geteilt. Was kommt heraus?`, f, fehlerliste(f, [[e * f, 'sach-schritt-vergessen']]),
        h1(`Was kommt nach dem ersten Teilen heraus? Und was passiert, wenn du gleich durch ${d * e} teilst?`), { nachweis: N(`${d * e * f} : ${d}`, `${e * f} : ${e}`, `${d} · ${e}`) });
    },
    3: (k) => {
      if (k === 0) { const a = wahl([24, 36, 48]), [d, e] = suche(() => [wahl([2, 3, 4]), wahl([6, 8, 12])], ([x, y]) => a % x === 0 && a % y === 0), n = kind();
        return auswahl(`${n} sagt: „Teilt man durch eine größere Zahl, wird das Ergebnis größer.“ Vergleiche ${a} : ${d} und ${a} : ${e}. Wähle die richtige Antwort.`,
          [opt(`Falsch. ${a} : ${d} = ${a / d}, aber ${a} : ${e} = ${a / e}. Das Ergebnis wird kleiner.`, true), opt('Stimmt. Größere Zahlen ergeben größere Ergebnisse.'), opt('Stimmt. Beim Malnehmen ist das auch so.'), opt('Falsch. Das Ergebnis bleibt immer gleich.'), opt(`Stimmt. ${a} : ${e} ist größer als ${a} : ${d}.`)],
          h1('Stell dir vor, du verteilst Kuchen an mehr Kinder. Was passiert mit jedem Stück?'), { nachweis: [U(false), ...N(`${a} : ${d}`, `${a} : ${e}`)] }); }
      const a = wahl([24, 40, 48, 56, 72]);
      return auswahl(`${a} : 2 = ${a / 2}, ${a} : 4 = ${a / 4} und ${a} : 8 = ${a / 8}. Stelle eine Regel auf: Was geschieht mit dem Ergebnis, wenn die Zahl, durch die geteilt wird, verdoppelt wird?`, [
        opt('Das Ergebnis halbiert sich.', true), opt('Das Ergebnis verdoppelt sich.', false, 'div-vertauscht'), opt('Das Ergebnis wird um 2 kleiner.'), opt('Das Ergebnis bleibt gleich.'), opt(`Das Ergebnis wird immer um ${a / 4} kleiner.`)],
      h1('Vergleiche je zwei Ergebnisse, die nebeneinander stehen.'), { nachweis: N(`${a} : 2`, `${a} : 4`, `${a} : 8`, `${a / 2} : 2`, `${a / 4} : 2`) });
    },
  });
}
