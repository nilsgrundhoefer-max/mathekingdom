// Aufgaben zu 5.4.1 „Kopfrechnen: das kleine Einmaleins“ (Lernziele K1 bis K4) nach ADR 0015.
// Das Einmaleins ist Voraussetzung für das Dividieren (Brücke, ADR 0014) und zugleich ein normaler Meilenstein.
//   F  Kernaufgaben mit 2, 5 und 10 am Punktefeld und am Gruppenbild
//   G  das ganze kleine Einmaleins, Nachbaraufgaben, Platzhalter
//   M  schwere Aufgaben (6 bis 9), Zerlegen in Kernaufgaben, zwei Schritte, Fehler finden
//   E  Strukturen: Quadratzahlen, Zahlenrätsel, Teilbarkeit, Regeln aufstellen

import { sechs, stufen, zahl, auswahl, opt, luecken, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, KLEINSTES, HILFSZAHL, fz, frage } from '../werkzeug.mjs';

const hze = (n) => ({ h: Math.floor(n / 100), z: Math.floor(n / 10) % 10, e: n % 10 });

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
        h3('Mal 10 heißt: so viele Zehner.', n === 3 ? '4 · 10 sind 4 Zehner. Das ist 40.' : '3 · 10 sind 3 Zehner. Das ist 30.', `Im Bild siehst du ${n} Zehner. Zähle 10, 20, 30 und so weiter.`), { bild: B.material({ z: n }), nachweis: N(`${n} · 10`) }); },
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
      const a = wahl([11, 12]), b = zz(3, 9), p = a * b;
      return auswahl(`Welche Aufgabe hat das Ergebnis ${p}?`, [opt(`${a} · ${b}`, true), opt(`${a + 1} · ${b}`, false, '1x1-nachbar'), opt(`${a} + ${b}`, false, '1x1-addiert')],
        h3('Rechne jede Aufgabe aus.', '11 · 2 = 22 und 11 + 2 = 13. Nur 11 · 2 hat das Ergebnis 22.', `${a} · ${b} ist 10 · ${b} und noch ${a - 10} · ${b}.`), { nachweis: [{ art: 'wert', wert: p }, ...N(`${a} · ${b}`, `${a + 1} · ${b}`, `${a} + ${b}`)] });
    },
    3: () => { const a = wahl([3, 5, 7, 9]), k = kind();
      return auswahl(Z(`${k} sagt:`, '„Jede Zahl mal 2 ergibt eine gerade Zahl.“', `Prüfe mit ${a} · 2.`, 'Stimmt das?'),
        [opt(`Stimmt. ${a} · 2 = ${a * 2}. Mal 2 ist das Doppelte. Ein Doppeltes ist immer gerade.`, true), opt(`Falsch. ${a} ist eine ungerade Zahl. Dann ist auch ${a} · 2 eine ungerade Zahl.`), opt('Falsch. Das gilt nur bis 10.')],
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
        [opt(`Mit der Nachbaraufgabe: ${a - 1} · ${b} = ${(a - 1) * b}. Dazu kommt noch einmal ${b}. Das sind ${a * b}.`, true), opt('Mit derselben Rechnung. Rechnet man noch einmal genauso, fällt der Fehler auf.'), opt(`Mit der Rechnung ${a} + ${b}.`, false, '1x1-addiert'), opt('Gar nicht. Das Ergebnis stimmt.', false, '1x1-nachbar')],
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
          ['Falsch. 3 · 5 ist gerade.', 'Falsch. Zwei ungerade Zahlen ergeben zusammen immer eine gerade Zahl. Das gilt beim Malnehmen genauso, denn Malnehmen ist wiederholtes Zusammenzählen.', 'Stimmt, aber nur im kleinen Einmaleins.', 'Das hängt von den beiden Zahlen ab.'], ['3 · 5', '7 · 9']],
        ['„Eine gerade Zahl mal irgendeine Zahl ergibt immer eine gerade Zahl.“', 'Stimmt. Eine gerade Zahl ist ein Doppeltes. Ein Doppeltes mal eine Zahl bleibt ein Doppeltes.',
          ['Falsch. Mit einer ungeraden Zahl wird das Ergebnis ungerade.', 'Falsch. Das gilt nur für 2 und 4.', 'Stimmt, aber nur, wenn die andere Zahl auch gerade ist. Sonst wird das Ergebnis ungerade.', 'Das hängt von den beiden Zahlen ab.'], ['4 · 3', '6 · 7']],
      ]);
        return auswahl(`Stimmt das? ${satz} Wähle die beste Begründung.`, [opt(richtig, true), ...falsch.map((f) => opt(f))], h1('Probiere einige Beispiele. Kannst du erklären, warum es immer so ist?'), { nachweis: [U(true), ...N(...bsp)] }); }
      return auswahl('9 · 1 = 9, 9 · 2 = 18, 9 · 3 = 27, 9 · 4 = 36. Stelle eine Regel für alle Ergebnisse von 9 · 1 bis 9 · 10 auf.', [
        opt('Zehnerziffer und Einerziffer ergeben zusammen immer 9, denn von Ergebnis zu Ergebnis wird der Zehner um 1 größer und der Einer um 1 kleiner.', true),
        opt('Alle Ergebnisse sind ungerade.'), opt('Die Einerziffer wird von Ergebnis zu Ergebnis um 1 größer.'), opt('Zehnerziffer und Einerziffer ergeben zusammen immer 10, denn die Ergebnisse liegen immer knapp unter dem nächsten Zehner.'), opt('Es gibt keine Regel.')],
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
        h3('Geteilt durch 10 heißt: Wie viele Zehner sind es?', q === 3 ? '40 : 10 = 4. In 40 stecken 4 Zehner.' : '30 : 10 = 3. In 30 stecken 3 Zehner.', `Zähle im Bild die Zehner.`), { bild: B.material({ z: q }), nachweis: N(`${q * 10} : 10`) }); },
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
      const [d, q] = [wahl([11, 12]), zz(3, 9)];
      const falsch = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (f) => f.every(([x]) => x !== q) && new Set([`${d * q} : ${d}`, ...f.map(([x, y]) => `${x * y} : ${y}`)]).size === 3);
      return auswahl(`Welche Aufgabe hat das Ergebnis ${q}?`, [opt(`${d * q} : ${d}`, true), ...falsch.map(([x, y]) => opt(`${x * y} : ${y}`, false, 'div-einmaleins'))],
        h3('Rechne jede Aufgabe aus.', '24 : 12 = 2, denn 2 · 12 = 24.', `Prüfe ${d * q} : ${d} mit ${q} · ${d}.`), { nachweis: [{ art: 'wert', wert: q }, ...N(`${d * q} : ${d}`, ...falsch.map(([x, y]) => `${x * y} : ${y}`))] });
    },
    3: () => { const [d, q] = verschieden(3, 9), a = d * q, k = kind();
      return auswahl(Z(`${k} rechnet ${a} : ${d} = ${q}.`, `${k} prüft mit ${q} · ${d}.`, 'Warum klappt das?'),
        [opt(`Mal macht geteilt wieder rückgängig. ${q} · ${d} = ${a}.`, true), opt(`Auch ${q} + ${d} ergibt ${a}.`, false, 'div-falsche-rechenart'), opt('Das ist Zufall. Das klappt nur bei kleinen Zahlen.')],
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
          [opt(`Falsch. ${a} : ${d} = ${a / d}, aber ${a} : ${e} = ${a / e}. Das Ergebnis wird kleiner.`, true), opt('Stimmt. Größere Zahlen in der Aufgabe ergeben größere Ergebnisse.'), opt('Stimmt. Beim Malnehmen ist das auch so.'), opt('Falsch. Das Ergebnis bleibt immer gleich.'), opt(`Stimmt. ${a} : ${e} ist größer als ${a} : ${d}.`)],
          h1('Stell dir vor, du verteilst Kuchen an mehr Kinder. Was passiert mit jedem Stück?'), { nachweis: [U(false), ...N(`${a} : ${d}`, `${a} : ${e}`)] }); }
      const a = wahl([24, 40, 48, 56, 72]);
      return auswahl(`${a} : 2 = ${a / 2}, ${a} : 4 = ${a / 4} und ${a} : 8 = ${a / 8}. Stelle eine Regel auf: Was geschieht mit dem Ergebnis, wenn die Zahl, durch die geteilt wird, verdoppelt wird?`, [
        opt('Das Ergebnis halbiert sich.', true), opt('Das Ergebnis verdoppelt sich.', false, 'div-vertauscht'), opt('Das Ergebnis wird um 2 kleiner.'), opt('Das Ergebnis bleibt gleich.'), opt(`Das Ergebnis wird immer um ${a / 4} kleiner.`)],
      h1('Vergleiche je zwei Ergebnisse, die nebeneinander stehen.'), { nachweis: N(`${a} : 2`, `${a} : 4`, `${a} : 8`, `${a / 2} : 2`, `${a / 4} : 2`) });
    },
  });

  // ===================================================================
  // K3 Stufenzahlen und Zehnerzahlen im Kopf (mal und geteilt)
  // ===================================================================
  sechs(K('K3'), 'F', [
    () => { const [a, z] = verschieden(2, 5);
      return zahl(Z('Rechne.', `${a} · ${z * 10}`, 'Jeder Punkt im Bild ist ein Zehner.'), a * z * 10, fehlerliste(a * z * 10, [[a * z, 'mal-stellenwert'], [a + z * 10, '1x1-addiert']]),
        h3(`${z * 10} sind ${z} Zehner.`, a * z === 6 ? '2 · 40: 2 · 4 Zehner sind 8 Zehner. Das ist 80.' : '2 · 30: 2 · 3 Zehner sind 6 Zehner. Das ist 60.', `${a} · ${z} = ${a * z}. Also sind es ${a * z} Zehner.`), { bild: B.feld(a, z), nachweis: N(`${a} · ${z}`, `${a} · ${z * 10}`) }); },
    () => { const n = zz(2, 9);
      return zahl(Z('Rechne.', `${n} · 100`), n * 100, fehlerliste(n * 100, [[n * 10, 'mal-stellenwert'], [n + 100, '1x1-addiert']]),
        h3('Mal 100 heißt: so viele Hunderter.', n === 3 ? '4 · 100 sind 4 Hunderter. Das ist 400.' : '3 · 100 sind 3 Hunderter. Das ist 300.', `Im Bild siehst du ${n} Hunderter.`), { bild: B.material({ h: n }), nachweis: N(`${n} · 100`) }); },
    () => { const n = zz(3, 9);
      return zahl(Z('Rechne.', `${n * 10} : 10`), n, fehlerliste(n, [[n * 100, 'div-stellenwert'], [n * 10 - 10, 'div-falsche-rechenart']]),
        h3('Geteilt durch 10 fragt: Wie viele Zehner sind es?', n === 4 ? '50 : 10 = 5, denn 50 sind 5 Zehner.' : '40 : 10 = 4, denn 40 sind 4 Zehner.', 'Zähle die Zehnerstangen im Bild.'), { bild: B.material({ z: n }), nachweis: N(`${n * 10} : 10`, `${n} · 10`) }); },
    () => { const [r, s] = verschieden(2, 4);
      return auswahl(Z('Jeder Punkt im Bild ist ein Zehner.', 'Welche Aufgabe passt zum Bild?'), [opt(`${r} · ${s * 10}`, true), opt(`${r + 1} · ${s * 10}`, false, '1x1-nachbar'), opt(`${r} + ${s * 10}`, false, '1x1-addiert')],
        h3('Zähle die Reihen. Zähle die Zehner in 1 Reihe.', '2 Reihen mit je 3 Zehnern: 2 · 30.', `Es sind ${r} Reihen. In jeder Reihe sind ${s} Zehner.`), { bild: B.feld(r, s), nachweis: [HILFSZAHL(r * s, 'Punkte im Bild, jeder ein Zehner'), ...N(`${r} · ${s * 10}`)] }); },
    () => { const n = zz(3, 9);
      return luecken(Z('Welche Zahl fehlt?', `{{x}} · 10 = ${n * 10}`), { x: [n, fehlerliste(n, [[n * 100, 'mal-stellenwert']])] },
        h3('Wie viele Zehner sind es?', n === 6 ? '▢ · 10 = 70. 70 sind 7 Zehner. Die Zahl ist 7.' : '▢ · 10 = 60. 60 sind 6 Zehner. Die Zahl ist 6.', 'Zähle die Zehnerstangen im Bild.'), { bild: B.material({ z: n }), nachweis: N(`${n * 10} : 10`, `${n} · 10`) }); },
    () => { const n = zz(3, 9), [ding, eins] = wahl([['Stifte', 'Packung'], ['Bonbons', 'Tüte'], ['Karten', 'Schachtel']]);
      return zahl(Z(`In 1 ${eins} sind 10 ${ding}.`, `Es gibt ${n} ${eins === 'Packung' ? 'Packungen' : eins === 'Tüte' ? 'Tüten' : 'Schachteln'}.`, `Wie viele ${ding} sind es?`), n * 10, fehlerliste(n * 10, [[n + 10, '1x1-addiert']]),
        h3('Gleich viele in jeder Gruppe: Rechne mal.', n === 4 ? '5 Tüten mit je 10: 5 · 10 = 50.' : '4 Tüten mit je 10: 4 · 10 = 40.', `Rechne ${n} · 10.`), { einheit: ding, bild: B.gruppen(n, 10), nachweis: N(`${n} · 10`) }); },
  ]);

  stufen(K('K3'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, z] = suche(() => [zz(3, 9), zz(2, 9)], ([x, y]) => x !== y && x * y !== 24);
        return zahl(Z('Rechne.', `${a} · ${z * 10}`, 'Jeder Punkt im Bild ist ein Zehner.'), a * z * 10, fehlerliste(a * z * 10, [[a * z, 'mal-stellenwert'], [a * z * 100, 'mal-stellenwert']]),
          h3('Rechne zuerst ohne die Null. Hänge die Null dann an.', '6 · 40: 6 · 4 = 24. Also ist 6 · 40 = 240.', `${a} · ${z} = ${a * z}.`), { bild: B.feld(a, z), nachweis: N(`${a} · ${z}`, `${a} · ${z * 10}`) }); }
      if (k === 1) { const [x, y] = suche(() => [zz(2, 9), zz(2, 9)], ([p, q]) => p !== q && p * q !== 12);
        return zahl(Z('Rechne.', `${x * 10} · ${y * 10}`), x * y * 100, fehlerliste(x * y * 100, [[x * y * 10, 'mal-stellenwert'], [x * y * 1000, 'mal-stellenwert']]),
          h3('Rechne zuerst ohne die Nullen. Hänge dann beide Nullen an.', '30 · 40: 3 · 4 = 12. Zwei Nullen dazu: 1200.', `${x} · ${y} = ${x * y}.`), { nachweis: N(`${x * 10} · ${y * 10}`) }); }
      const [d, q] = suche(() => [zz(3, 9), zz(2, 9)], ([p, r]) => p !== r && p * r !== 24);
      return zahl(Z('Rechne.', `${d * q * 10} : ${d}`, 'Jeder Punkt im Bild ist ein Zehner.'), q * 10, fehlerliste(q * 10, [[q, 'div-null-vergessen'], [q * 100, 'div-stellenwert']]),
        h3('Rechne zuerst ohne die Null. Hänge die Null dann an.', '240 : 6: 24 : 6 = 4. Also ist 240 : 6 = 40.', `${d * q} : ${d} = ${q}.`), { bild: B.feld(d, q), nachweis: [HILFSZAHL(d * q, 'Punkte im Bild, jeder ein Zehner'), ...N(`${d * q * 10} : ${d}`, `${d} · ${q * 10}`)] });
    },
    2: (k) => {
      if (k === 0) { const [d, q] = suche(() => [zz(3, 9), zz(2, 9)], ([p, r]) => p !== r && p * r !== 48);
        return zahl(Z('Rechne.', `${d * q * 100} : ${d}`), q * 100, fehlerliste(q * 100, [[q * 10, 'div-null-vergessen'], [q, 'div-null-vergessen']]),
          h3('Rechne zuerst ohne die Nullen. Hänge dann beide Nullen an.', '4800 : 8: 48 : 8 = 6. Also ist 4800 : 8 = 600.', `${d * q} : ${d} = ${q}.`), { nachweis: N(`${d * q * 100} : ${d}`, `${d} · ${q * 100}`) }); }
      const [n, m] = suche(() => [zz(3, 4), zz(11, 25)], ([x, y]) => x * y * 100 <= 10000 && y % 10 !== 0);
      return zahl(Z(`${n} Lastwagen bringen Steine.`, `Jeder Lastwagen bringt ${m * 100} Steine.`, 'Wie viele Steine sind es zusammen?'), n * m * 100, fehlerliste(n * m * 100, [[n * m * 10, 'mal-stellenwert'], [n + m * 100, 'sach-falsche-rechnung']]),
        h3('Jeder Lastwagen bringt gleich viele Steine. Rechne mal.', '2 Lastwagen mit je 1500 Steinen: 2 · 15 = 30. Also 2 · 1500 = 3000.', `Rechne ${n} · ${m} = ${n * m}. Hänge dann zwei Nullen an.`), { einheit: 'Steine', bild: B.streifen(frage(n * m * 100), Array(n).fill(m * 100)), nachweis: N(`${n} · ${m * 100}`) });
    },
    3: () => { const [x, y] = wahl([[5, 4], [5, 2], [5, 6], [5, 8]]), k = kind(), a = x * 10, b = y * 10, falsch = x * y * 10;
      return auswahl(Z(`${k} rechnet:`, `${a} · ${b} = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `${x} · ${y} = ${x * y}.`, `Dazu kommen zwei Nullen: ${x * y * 100}.`), true),
        opt(Z('Stimmt.', `${x} · ${y} = ${x * y}.`, 'Die Null ist schon da.'), false, 'mal-stellenwert'),
        opt(Z('Falsch.', `Richtig ist ${fz(x * y * 1000)}.`), false, 'mal-stellenwert')],
      h3('Rechne ohne die Nullen. Zähle dann die Nullen der beiden Zahlen.', '50 · 20: 5 · 2 = 10. Zwei Nullen dazu: 1000.', `Rechne ${x} · ${y}. Hänge dann zwei Nullen an.`), { nachweis: [U(false, `${a} · ${b}`, falsch), ...N(`${x} · ${y}`, `${a} · ${b}`)] }); },
  });

  stufen(K('K3'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(2, 9), zz(2, 9)], ([x, y]) => x !== y);
        return zahl(`Rechne im Kopf: ${a * 100} · ${b * 10}`, a * b * 1000, fehlerliste(a * b * 1000, [[a * b * 100, 'mal-stellenwert'], [a * b * 10000, 'mal-stellenwert']]),
          h2('Rechne ohne die Nullen und zähle dann alle Nullen der Faktoren.', `${a} · ${b} = ${a * b}. Dazu kommen drei Nullen.`), { nachweis: N(`${a} · ${b}`, `${a * 100} · ${b * 10}`) }); }
      const [d, q] = suche(() => [zz(3, 9), zz(3, 9)], ([x, y]) => x !== y);
      return zahl(`Rechne im Kopf: ${fz(d * q * 100)} : ${d * 10}`, q * 10, fehlerliste(q * 10, [[q * 100, 'div-stellenwert'], [q, 'div-null-vergessen']]),
        h2('Streiche bei beiden Zahlen gleich viele Nullen. Das Ergebnis bleibt gleich.', `${d * q * 100} : ${d * 10} ist so viel wie ${d * q * 10} : ${d}.`), { nachweis: N(`${d * q * 10} : ${d}`, `${d * q * 100} : ${d * 10}`, `${q * 10} · ${d * 10}`) });
    },
    2: (k) => {
      if (k === 0) { const [z, y] = suche(() => [zz(2, 9), zz(2, 9)], ([p, q]) => p !== q && p * q * 1000 <= 100000);
        return zahl(`Welche Zahl fehlt? ${z * 10} · ▢ = ${fz(z * y * 1000)}`, y * 100, fehlerliste(y * 100, [[y * 10, 'mal-stellenwert'], [y * 1000, 'mal-stellenwert']]),
          h2('Die Umkehraufgabe hilft dir.', `Rechne ${fz(z * y * 1000)} : ${z * 10}.`), { nachweis: N(`${z * y * 1000} : ${z * 10}`, `${z * 10} · ${y * 100}`) }); }
      if (k === 1) { const [d, q] = suche(() => [wahl([20, 40, 50, 60, 80]), zz(2, 9) * 10], ([x, y]) => x * y <= 10000 && x !== y);
        return zahl(`Wie oft passt ${d} in ${fz(d * q)}?`, q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [q / 10, 'div-null-vergessen']]),
          h2('Das ist eine Geteilt-Aufgabe. Streiche zuerst gleich viele Nullen.', `Rechne ${fz(d * q)} : ${d}.`), { nachweis: N(`${d * q} : ${d}`, `${q} · ${d}`) }); }
      const [kart, dosen, tage] = suche(() => [zz(2, 9) * 100, wahl([12, 20, 24, 30]), zz(3, 6)], ([x, y, t]) => x * y * t <= 100000);
      return zahl(`Eine Fabrik packt jeden Tag ${kart} Kartons. In jeden Karton kommen ${dosen} Dosen. Wie viele Dosen packt sie an ${tage} Tagen?`, kart * dosen * tage, fehlerliste(kart * dosen * tage, [[kart * dosen, 'sach-schritt-vergessen'], [kart * tage, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst die Dosen an einem Tag.', `An einem Tag: ${kart} · ${dosen} = ${fz(kart * dosen)} Dosen.`), { einheit: 'Dosen', nachweis: N(`${kart} · ${dosen}`, `${kart * dosen} · ${tage}`) });
    },
    3: () => { const [x, y] = wahl([[6, 5], [4, 5], [8, 5], [2, 5]]), [k1, k2] = zweiKinder(), a = x * 100, b = y * 10, falsch = x * y * 100;
      return auswahl(`${k1} rechnet ${a} · ${b} = ${fz(falsch)}. ${k2} rechnet ${a} · ${b} = ${fz(a * b)}. Wer hat recht?`, [
        opt(`${k2}. ${x} · ${y} = ${x * y}. Dazu kommen die drei Nullen der Faktoren: ${fz(a * b)}.`, true),
        opt(`${k1}. ${x} · ${y} = ${x * y}, und die Null von ${x * y} zählt schon mit.`, false, 'mal-stellenwert'),
        opt(`Keiner. Richtig ist ${fz(a * b * 10)}.`, false, 'mal-stellenwert'),
        opt('Beide. Es kommt nur auf die Ziffern an.')],
      h2('Rechne ohne die Nullen. Zähle dann alle Nullen der Faktoren.', `${x} · ${y} = ${x * y}. ${a} hat zwei Nullen, ${b} hat eine.`), { nachweis: [U(false, `${a} · ${b}`, falsch), ...N(`${x} · ${y}`, `${a} · ${b}`)] }); },
  });

  stufen(K('K3'), 'E', {
    1: () => { const [a, b] = suche(() => [zz(2, 5), zz(2, 5)], ([x, y]) => x !== y && x * y <= 10);
      return zahl(`Rechne im Kopf: ${fz(a * 1000)} · ${b * 100}`, a * b * 100000, fehlerliste(a * b * 100000, [[a * b * 10000, 'mal-stellenwert']]),
        h1('Rechne ohne die Nullen und zähle dann alle Nullen.'), { nachweis: N(`${a} · ${b}`, `${a * 1000} · ${b * 100}`) }); },
    2: (k) => {
      if (k === 0) { const [x, y] = suche(() => [zz(2, 9), zz(2, 9)], ([p, q]) => p !== q && p * q <= 100);
        return zahl(`Rechne im Kopf: ${fz(x * y * 10000)} : ${x * 100}`, y * 100, fehlerliste(y * 100, [[y * 10, 'div-null-vergessen'], [y * 1000, 'div-stellenwert']]),
          h1('Streiche bei beiden Zahlen gleich viele Nullen.'), { nachweis: N(`${x * y * 100} : ${x}`, `${x * y * 10000} : ${x * 100}`, `${y * 100} · ${x * 100}`) }); }
      if (k === 1) { const [a, p] = wahl([[250, 4], [125, 8], [500, 2], [250, 8], [125, 4]]), m = wahl([10, 100]), x = p * m;
        return zahl(`Welche Zahl fehlt? ${a} · ▢ = ${fz(a * x)}`, x, fehlerliste(x, [[x * 10, 'mal-stellenwert'], [x / 10, 'mal-stellenwert']]),
          h1(`Denke an ${a} · ${p} = ${a * p}.`), { nachweis: N(`${a} · ${p}`, `${a * x} : ${a}`, `${a} · ${x}`) }); }
      const [s, h, t] = suche(() => [zz(2, 9) * 1000, zz(6, 9), wahl([20, 30])], ([x, y, z]) => x * y * z <= 1000000);
      return zahl(`Eine Druckerei druckt jede Stunde ${fz(s)} Seiten. Sie druckt ${h} Stunden am Tag, und das an ${t} Tagen. Wie viele Seiten sind das?`, s * h * t, fehlerliste(s * h * t, [[s * h, 'sach-schritt-vergessen'], [s * t, 'sach-schritt-vergessen']]),
        h1('Wie viele Seiten sind es an einem Tag?'), { einheit: 'Seiten', nachweis: N(`${s} · ${h}`, `${s * h} · ${t}`) });
    },
    3: (k) => {
      if (k === 0) { const [x, y] = wahl([[5, 2], [5, 4], [5, 6], [5, 8]]), i = zz(1, 2), a = x * 10 ** i, b = y * 10, p = a * b, n = kind();
        const nullenP = String(p).match(/0+$/)[0].length;
        return auswahl(`${n} sagt: „Das Produkt hat immer genau so viele Nullen am Ende wie beide Faktoren zusammen.“ Prüfe mit ${a} · ${b}.`, [
          opt(`Falsch. ${a} · ${b} = ${fz(p)} hat ${nullenP} Nullen am Ende, die Faktoren zusammen nur ${i + 1}. ${x} · ${y} = ${x * y} bringt eine Null mit.`, true),
          opt('Stimmt. Man rechnet ohne Nullen und hängt die Nullen der Faktoren an. Mehr Nullen können nicht entstehen.', false, 'mal-stellenwert'),
          opt(`Stimmt. ${a} · ${b} = ${fz(p / 10)}.`, false, 'mal-stellenwert'),
          opt('Falsch. Das Produkt hat immer weniger Nullen.'),
          opt('Das kann man nicht prüfen.')],
        h1(`Rechne ${a} · ${b} aus und zähle die Nullen am Ende.`), { nachweis: [U(false), HILFSZAHL(nullenP, 'Nullen am Ende des Produkts'), HILFSZAHL(i + 1, 'Nullen der Faktoren zusammen'), ...N(`${x} · ${y}`, `${a} · ${b}`)] }); }
      const x = wahl([2, 4, 6, 8]), y = 5;
      const liste = [[x * 10, y * 100], [x * 100, y * 10], [x, y * 1000], [x * 10, y * 10], [x * 1000, y]];
      return auswahl('Welche Aufgabe hat das kleinste Ergebnis? Entscheide, ohne alles auszurechnen.', liste.map(([p, q], j) => opt(`${fz(p)} · ${fz(q)}`, j === 3)),
        h1('Zähle bei jeder Aufgabe die Nullen. Die Ziffern sind überall gleich.'), { nachweis: [KLEINSTES, ...N(...liste.map(([p, q]) => `${p} · ${q}`))] }); },
  });

  // ===================================================================
  // K4 Geschickt multiplizieren: zerlegen, verdoppeln, halbieren
  // ===================================================================
  sechs(K('K4'), 'F', [
    () => { const b = suche(() => zz(3, 9), (x) => x !== 7);
      return zahl(Z('Rechne.', `7 · ${b}`, `Zerlege in 5 · ${b} und 2 · ${b}.`), 7 * b, malFehler(7, b),
        h3('Rechne beide Teile. Rechne dann zusammen.', '7 · 4: 5 · 4 = 20 und 2 · 4 = 8. Zusammen 28.', `5 · ${b} = ${5 * b}. Rechne jetzt 2 · ${b}.`), { bild: B.feld(7, b, 5), nachweis: N(`5 · ${b}`, `2 · ${b}`, `${5 * b} + ${2 * b}`, `7 · ${b}`) }); },
    () => { const n = suche(() => zz(11, 34), (x) => x % 10 <= 4 && x % 10 > 0 && x !== 13);
      return zahl(Z(`Verdopple ${n}.`), 2 * n, fehlerliste(2 * n, [[n + 2, '1x1-addiert'], [2 * n - 10, 'stellenwert']]),
        h3('Verdopple die Zehner. Verdopple die Einer.', 'Das Doppelte von 13: 10 und 10 sind 20. 3 und 3 sind 6. Zusammen 26.', `Die Zehner: ${n - n % 10} + ${n - n % 10} = ${2 * (n - n % 10)}.`), { bild: B.material(hze(n)), nachweis: N(`2 · ${n}`, `${n - n % 10} + ${n - n % 10}`, `${n % 10} + ${n % 10}`) }); },
    () => { const n = suche(() => wahl([2, 4, 6, 8]) * 10 + wahl([2, 4, 6, 8]), (x) => x !== 26);
      return zahl(Z(`Halbiere ${n}.`), n / 2, fehlerliste(n / 2, [[n - 2, 'div-falsche-rechenart'], [n * 2, 'div-vertauscht']]),
        h3('Halbiere die Zehner. Halbiere die Einer.', 'Die Hälfte von 26: Die Hälfte von 20 ist 10. Die Hälfte von 6 ist 3. Zusammen 13.', `Die Hälfte von ${n - n % 10} ist ${(n - n % 10) / 2}.`), { bild: B.material(hze(n)), nachweis: N(`${n} : 2`, `${n - n % 10} : 2`, `${n % 10} : 2`) }); },
    () => { const a = zz(6, 9), b = suche(() => zz(3, 9), (x) => x !== a && x !== a - 5);
      return auswahl(Z(`Du rechnest ${a} · ${b}.`, 'Wie zerlegst du die Aufgabe?'), [opt(`5 · ${b} + ${a - 5} · ${b}`, true), opt(`5 · ${b} + ${a - 5}`, false, 'mal-zerlegung-halb'), opt(`5 + ${b} + ${a - 5} + ${b}`, false, '1x1-addiert')],
        h3('Schau ins Bild. Über der Lücke sind 5 Reihen.', '7 · 3: 5 Reihen und noch 2 Reihen. Also 5 · 3 + 2 · 3.', a === 6 ? `Unter der Lücke ist 1 Reihe mit ${b} Punkten.` : `Unter der Lücke sind ${a - 5} Reihen mit je ${b} Punkten.`), { bild: B.feld(a, b, 5), nachweis: [WERT(a * b), ...N(`5 · ${b}`, `${a - 5} · ${b}`, `${5 * b} + ${(a - 5) * b}`, `${a} · ${b}`)] }); },
    () => { const a = wahl([4, 6, 8]), b = suche(() => zz(3, 6), (x) => x !== a && 2 * x !== a);
      return luecken(Z('Welche Zahl fehlt?', `${a} · ${b} = ${a / 2} · {{x}}`), { x: [2 * b, fehlerliste(2 * b, [[b, 'geschickt-nicht-ausgeglichen'], [b / 2, 'geschickt-falsch-ausgeglichen']])] },
        h3('Halbiere die erste Zahl. Verdopple dann die zweite Zahl.', '4 · 7 = 2 · 14. Beide ergeben 28.', `${a} wird zu ${a / 2}. Verdopple jetzt ${b}.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${a / 2} · ${2 * b}`) }); },
    () => { const b = suche(() => zz(3, 9), (x) => x !== 4);
      return zahl(Z('Rechne.', `9 · ${b}`, `Rechne 10 · ${b}.`, `Nimm dann ${b} weg.`), 9 * b, malFehler(9, b),
        h3('9 Reihen sind 1 Reihe weniger als 10 Reihen.', '9 · 4: 10 · 4 = 40. 40 − 4 = 36.', `10 · ${b} = ${10 * b}. Rechne jetzt ${10 * b} − ${b}.`), { bild: B.feld(9, b), nachweis: N(`10 · ${b}`, `${10 * b} − ${b}`, `9 · ${b}`) }); },
  ]);

  stufen(K('K4'), 'G', {
    1: (k) => {
      if (k === 0) { const n = suche(() => zz(13, 24), (x) => x % 10 !== 0 && x !== 23);
        return zahl(Z('Rechne geschickt.', `4 · ${n}`, 'Verdopple zweimal.'), 4 * n, fehlerliste(4 * n, [[2 * n, 'sach-schritt-vergessen'], [4 * n - 4, '1x1-nachbar']]),
          h3('Mal 4 ist das Doppelte vom Doppelten.', '4 · 23: Das Doppelte von 23 ist 46. Das Doppelte von 46 ist 92.', `Das Doppelte von ${n} ist ${2 * n}.`), { bild: B.streifen(frage(4 * n), [n, n, n, n]), nachweis: N(`${n} + ${n}`, `${2 * n} + ${2 * n}`, `4 · ${n}`) }); }
      if (k === 1) { const [a, b] = suche(() => [wahl([11, 12]), zz(13, 19)], ([x, y]) => x * y !== 180);
        return zahl(Z('Rechne geschickt.', `${a} · ${b}`, `Zerlege ${a} in 10 und ${a - 10}.`), a * b, fehlerliste(a * b, [[10 * b + (a - 10), 'mal-zerlegung-halb'], [10 * b, 'sach-schritt-vergessen']]),
          h3(`Nimm beide Teile mal ${b}. Rechne dann zusammen.`, '12 · 15: 10 · 15 = 150 und 2 · 15 = 30. Zusammen 180.', `10 · ${b} = ${10 * b}. Rechne jetzt ${a - 10} · ${b}.`), { nachweis: N(`10 · ${b}`, `${a - 10} · ${b}`, `${10 * b} + ${(a - 10) * b}`, `${a} · ${b}`) }); }
      const n = suche(() => zz(51, 249) * 2, (x) => x % 10 !== 0 && x !== 348);
      return zahl(Z(`Halbiere ${n}.`), n / 2, fehlerliste(n / 2, [[n * 2, 'div-vertauscht'], [n - 2, 'div-falsche-rechenart']]),
        h3('Zerlege die Zahl in Teile, die du leicht halbieren kannst.', 'Die Hälfte von 348: Die Hälfte von 300 ist 150. Die Hälfte von 48 ist 24. Zusammen 174.', `Die Hälfte von ${n - n % 100} ist ${(n - n % 100) / 2}.`), { bild: B.material(hze(n)), nachweis: [HILFSZAHL(2, 'halbieren heißt durch 2 teilen'), ...N(`${n} : 2`)] });
    },
    2: (k) => {
      if (k === 0) { const m = suche(() => zz(2, 9), (x) => x !== 4);
        return zahl(Z('Rechne geschickt.', `25 · ${4 * m}`, 'Halbiere und verdopple zweimal.'), 100 * m, fehlerliste(100 * m, [[50 * m, 'geschickt-nicht-ausgeglichen'], [25 * m, 'geschickt-falsch-ausgeglichen']]),
          h3('Verdopple die 25. Halbiere die andere Zahl. Mache das noch einmal.', '25 · 16 = 50 · 8 = 100 · 4 = 400.', `25 · ${4 * m} = 50 · ${2 * m}.`), { nachweis: N(`25 · ${4 * m}`, `50 · ${2 * m}`, `100 · ${m}`) }); }
      const b = suche(() => zz(23, 89), (x) => x % 10 !== 0);
      return luecken(Z('Ergänze den Rechenweg.', `9 · ${b} = 10 · ${b} − {{a}}`, `9 · ${b} = {{b}}`), { a: [b, fehlerliste(b, [[9, 'geschickt-falsch-ausgeglichen'], [1, 'geschickt-falsch-ausgeglichen']])], b: [9 * b, fehlerliste(9 * b, [[10 * b - 1, 'geschickt-falsch-ausgeglichen'], [10 * b - 9, 'geschickt-falsch-ausgeglichen']])] },
        h3(`9 · ${b} ist 1-mal ${b} weniger als 10 · ${b}.`, '9 · 34: 10 · 34 = 340. 340 − 34 = 306.', `10 · ${b} = ${10 * b}.`), { bild: B.material(hze(b)), nachweis: N(`10 · ${b}`, `${10 * b} − ${b}`, `9 · ${b}`) });
    },
    3: () => { const a = wahl([6, 7, 8]), z = wahl([2, 3, 4]) * 10, b = z - 1, k = kind(), falsch = a * z - 1;
      return auswahl(Z(`${k} rechnet ${a} · ${b} so:`, `${a} · ${z} = ${a * z}`, `${a * z} − 1 = ${falsch}`, 'Stimmt das?'), [
        opt(Z('Falsch.', `${k} muss ${a}-mal 1 wegnehmen.`, `Richtig ist ${a * z} − ${a} = ${a * b}.`), true),
        opt(Z('Stimmt.', `${b} ist 1 weniger als ${z}.`, `Also nimmt ${k} am Ende 1 weg.`), false, 'geschickt-falsch-ausgeglichen'),
        opt(Z('Falsch.', `Richtig ist ${a * z} + ${a} = ${a * z + a}.`), false, 'geschickt-falsch-ausgeglichen')],
      h3(`${a} · ${b} sind ${a} Reihen mit je ${b}. In jeder Reihe fehlt 1.`, '3 · 19: 3 · 20 = 60. In 3 Reihen fehlt je 1. 60 − 3 = 57.', `Wie oft fehlt 1? Es sind ${a} Reihen.`), { nachweis: [U(false, `${a} · ${b}`, falsch), ...N(`${a} · ${z}`, `${a * z} − ${a}`, `${a * z} − 1`, `${a * z} + ${a}`, `${a} · ${b}`)] }); },
  });

  stufen(K('K4'), 'M', {
    1: (k) => {
      if (k === 0) { const m = suche(() => zz(5, 24), (x) => x % 4 !== 0 || x > 8);
        return zahl(`Rechne geschickt: 25 · ${4 * m}`, 100 * m, fehlerliste(100 * m, [[25 * m, 'geschickt-falsch-ausgeglichen'], [10 * m, 'mal-stellenwert']]),
          h2('25 · 4 = 100. Zerlege die andere Zahl so, dass eine 4 darin steckt.', `${4 * m} = 4 · ${m}. Also ist 25 · ${4 * m} = 100 · ${m}.`), { nachweis: N('25 · 4', `4 · ${m}`, `100 · ${m}`, `25 · ${4 * m}`) }); }
      const b = suche(() => zz(23, 89), (x) => x % 10 !== 0);
      return zahl(`Rechne geschickt: 99 · ${b}`, 99 * b, fehlerliste(99 * b, [[100 * b - 1, 'geschickt-falsch-ausgeglichen'], [100 * b - 99, 'geschickt-falsch-ausgeglichen']]),
        h2(`99 · ${b} ist 1-mal ${b} weniger als 100 · ${b}.`, `100 · ${b} = ${fz(100 * b)}. Ziehe ${b} ab.`), { nachweis: N(`100 · ${b}`, `${100 * b} − ${b}`, `99 · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const a = wahl([16, 24, 32, 48]);
        return zahl(`Rechne geschickt: ${a} · 125`, a * 125, fehlerliste(a * 125, [[a * 1000, 'geschickt-nicht-ausgeglichen'], [a / 8 * 100, 'mal-stellenwert']]),
          h2('8 · 125 = 1000. Zerlege die andere Zahl so, dass eine 8 darin steckt.', `${a} = ${a / 8} · 8. Also ist ${a} · 125 = ${a / 8} · 1000.`), { nachweis: N('8 · 125', `${a / 8} · 8`, `${a / 8} · 1000`, `${a} · 125`) }); }
      if (k === 1) { const n = suche(() => zz(112, 998), (x) => x % 10 !== 0);
        return zahl(`Rechne geschickt: 5 · ${n}`, 5 * n, fehlerliste(5 * n, [[10 * n, 'geschickt-nicht-ausgeglichen'], [n / 2 * 10 * 10, 'mal-stellenwert']]),
          h2('Mal 5 ist die Hälfte von mal 10.', `${n} · 10 = ${fz(n * 10)}. Halbiere das Ergebnis.`), { nachweis: N(`${n} · 10`, `${n * 10} : 2`, `5 · ${n}`) }); }
      const [a, b] = suche(() => [wahl([14, 16, 18, 22, 24]), wahl([15, 25, 35, 45])], ([x, y]) => x * y <= 10000);
      return luecken(`Halbiere und verdopple. Ergänze: ${a} · ${b} = ${a / 2} · {{a}} = {{b}}`, { a: [2 * b, fehlerliste(2 * b, [[b, 'geschickt-nicht-ausgeglichen'], [b / 5, 'geschickt-falsch-ausgeglichen']])], b: a * b },
        h2(`Halbiere ${a} und verdopple ${b}. Dann ist eine Zehnerzahl dabei.`, `${a / 2} · ${2 * b}: Rechne ${a / 2} · ${2 * b / 10} und hänge eine Null an.`), { nachweis: N(`${a / 2} · ${2 * b}`, `${a} · ${b}`) });
    },
    3: () => { const [a, b] = suche(() => [wahl([12, 14, 16, 18]), wahl([15, 25, 35])], ([x, y]) => x * y <= 1000), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${a} · ${b} ist dasselbe wie ${a / 2} · ${2 * b}.“ ${k2} sagt: „${a} · ${b} ist dasselbe wie ${2 * a} · ${2 * b}.“ Wer hat recht?`, [
        opt(`${k1}. Halbiert man einen Faktor und verdoppelt den anderen, bleibt das Produkt gleich: ${a / 2} · ${2 * b} = ${a * b}.`, true),
        opt(`${k2}. Man muss beide Faktoren gleich behandeln.`, false, 'geschickt-falsch-ausgeglichen'),
        opt('Beide. Beim Malnehmen darf man halbieren und verdoppeln, wie man will. Das Produkt bleibt gleich.', false, 'geschickt-falsch-ausgeglichen'),
        opt('Keiner. Man darf die Zahlen nicht verändern.')],
      h2('Rechne alle drei Aufgaben aus und vergleiche.', `${a} · ${b} = ${a * b}.`), { nachweis: N(`${a} · ${b}`, `${a / 2} · ${2 * b}`, `${2 * a} · ${2 * b}`) }); },
  });

  stufen(K('K4'), 'E', {
    1: () => { const m = suche(() => zz(3, 12), (x) => x !== 8);
      return zahl(`Rechne geschickt: 125 · ${8 * m}`, 1000 * m, fehlerliste(1000 * m, [[125 * m, 'geschickt-falsch-ausgeglichen'], [100 * m, 'mal-stellenwert']]),
        h1('Welche Zahl mal 125 ergibt 1000?'), { nachweis: N('125 · 8', `8 · ${m}`, `1000 · ${m}`, `125 · ${8 * m}`) }); },
    2: (k) => {
      if (k === 0) { const b = suche(() => zz(23, 99), (x) => x % 10 !== 0);
        return zahl(`Rechne geschickt: 999 · ${b}`, 999 * b, fehlerliste(999 * b, [[1000 * b - 1, 'geschickt-falsch-ausgeglichen'], [1000 * b - 999, 'geschickt-falsch-ausgeglichen']]),
          h1(`Wie hängt 999 · ${b} mit 1000 · ${b} zusammen?`), { nachweis: N(`1000 · ${b}`, `${1000 * b} − ${b}`, `999 · ${b}`) }); }
      if (k === 1) { const e = suche(() => zz(13, 99), (x) => x % 2 === 1 || x % 4 === 2), n = kind();
        return zahl(`${n} halbiert eine Zahl. Das Ergebnis halbiert ${n} noch einmal und dann ein drittes Mal. Am Ende steht ${e} da. Mit welcher Zahl hat ${n} begonnen?`, 8 * e, fehlerliste(8 * e, [[4 * e, 'sach-schritt-vergessen'], [e / 8, 'div-vertauscht'], [6 * e, 'sach-falsche-rechnung']]),
          h1('Rechne rückwärts. Was macht das Halbieren rückgängig?'), { nachweis: N(`${e} · 2`, `${2 * e} · 2`, `${4 * e} · 2`) }); }
      const [r, p, s] = [25, wahl([16, 18, 22, 24, 28]), 4];
      return zahl(`Ein Kinosaal hat ${r} Reihen mit je ${p} Plätzen. Ein Kino hat ${s} solche Säle. Wie viele Plätze hat das Kino? Rechne geschickt.`, r * p * s, fehlerliste(r * p * s, [[r * p, 'sach-schritt-vergessen'], [r * s * 10, 'mal-stellenwert']]),
        h1('Welche zwei Zahlen ergeben malgenommen genau 100?'), { einheit: 'Plätze', nachweis: N(`${r} · ${p}`, `${r * p} · ${s}`, `${r} · ${s}`, `100 · ${p}`) });
    },
    3: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(4, 9) * 3, wahl([6, 9, 12, 15])], ([x, y]) => x !== y);
        return auswahl(`Ein Faktor wird mit 3 multipliziert, der andere durch 3 geteilt. Was passiert mit dem Produkt? Prüfe an ${a} · ${b}.`, [
          opt(`Es bleibt gleich. ${a} · ${b} = ${a * b} und ${a * 3} · ${b / 3} = ${a * b}. Mal 3 und durch 3 heben sich auf.`, true),
          opt('Es wird 3-mal so groß.', false, 'geschickt-nicht-ausgeglichen'),
          opt('Es wird 9-mal so groß, denn 3 · 3 = 9.', false, 'geschickt-falsch-ausgeglichen'),
          opt('Es wird kleiner, denn durch 3 teilen macht stärker kleiner, als mal 3 größer macht.'),
          opt('Das hängt von den Zahlen ab.')],
        h1('Rechne vorher und nachher aus und vergleiche.'), { nachweis: N(`${a} · 3`, `${b} : 3`, `${a} · ${b}`, `${a * 3} · ${b / 3}`) }); }
      const m = suche(() => zz(11, 24), (x) => x % 10 !== 0), a = 4 * m, [k1, k2] = zweiKinder();
      return auswahl(`${k1} rechnet ${a} · 25 so: ${a} : 4 = ${m} und ${m} · 100 = ${fz(m * 100)}. ${k2} sagt: „Das ist falsch. Man darf nur halbieren und verdoppeln.“ Wer hat recht?`, [
        opt(`${k1}. 25 · 4 = 100. Teilt man ${a} durch 4 und nimmt 25 mal 4, bleibt das Produkt gleich.`, true),
        opt(`${k2}. Durch 4 teilen ist kein Halbieren.`, false, 'geschickt-falsch-ausgeglichen'),
        opt(`${k2}. Richtig ist ${fz(m * 25)}.`, false, 'geschickt-falsch-ausgeglichen'),
        opt('Keiner. Man muss schriftlich rechnen.'),
        opt(`Beide. ${k1} rechnet richtig, aber das klappt nur durch Zufall bei dieser Zahl.`)],
      h1(`Durch 4 teilen ist zweimal halbieren. Mal 4 ist zweimal verdoppeln.`), { nachweis: N(`${a} : 4`, `${m} · 100`, '25 · 4', `${a} · 25`) }); },
  });
}
