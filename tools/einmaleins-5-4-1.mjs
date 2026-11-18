// Aufgaben für 4.1 Kopfrechnen: das kleine Einmaleins als Grundlage (Grundschulstoff), nach docs/adr/0009.
// Es dient als Voraussetzung für das Dividieren (Brücke, ADR 0014) und ist zugleich ein normaler Meilenstein.
//
//   F  Kernaufgaben mit 1, 2, 5 und 10, Plus- und Mal-Aufgabe, Tauschaufgabe, einfache Sprache
//   G  das ganze kleine Einmaleins, Nachbaraufgaben, Platzhalter, einfache Sprache
//   M  schwere Aufgaben (6 bis 9), Zerlegen in Kernaufgaben, zwei Schritte, Fehler finden
//   E  Strukturen: Quadratzahlen, Zahlenrätsel, Teilbarkeit, Behauptungen beurteilen
// Je Lernziel und Stufe sechs Aufgaben in der Folge AFB I, II, II, I, II, III.
// Hilfekärtchen: F und G drei, M zwei (Tipp, Lösungsschritt), E eines (Tipp als Rückfrage).

const AFB_FOLGE = [1, 2, 2, 1, 2, 3];
const zeilen = (...z) => z.join('\n');
const h3 = (tipp, beispiel, loesungsschritt) => ({ tipp, beispiel, loesungsschritt });
const h2 = (tipp, loesungsschritt) => ({ tipp, loesungsschritt });
const h1 = (tipp) => ({ tipp });

export const fehlvorstellungen541 = {
  '1x1-nachbar': { beschreibung: 'Irrt sich im Einmaleins um eine Reihe (Ergebnis der Nachbaraufgabe).', hinweis: 'Geh von einer Kernaufgabe aus, zum Beispiel 5 mal. Rechne dann eine Reihe weiter.' },
  '1x1-addiert': { beschreibung: 'Addiert, statt zu multiplizieren.', hinweis: 'Schau auf das Zeichen ·. Hier wird mal gerechnet, nicht plus.' },
  '1x1-null': { beschreibung: 'Meint, eine Zahl mal 0 ergibt die Zahl selbst.', hinweis: 'Stell dir 0 Päckchen vor. Wie viel ist dann darin?' },
  'div-durch-sich-selbst': { beschreibung: 'Meint, eine Zahl geteilt durch sich selbst ergibt 0.', hinweis: 'Verteile 4 Äpfel an 4 Kinder. Wie viele bekommt jedes Kind?' },
};

export function einmaleins({ gruppe, zahl, auswahl, opt, zz, wahl, suche, fehlerliste }) {
  const K = (kurz) => `5.4.1-${kurz}`;
  const stufen = (kurz, niveau, je) => gruppe(K(kurz), niveau, (i) => {
    const afb = AFB_FOLGE[i];
    const k = AFB_FOLGE.slice(0, i).filter((x) => x === afb).length;
    const a = { ...je[afb](k), afb };
    if ((niveau === 'F' || niveau === 'G') && a.optionen) a.optionen = a.optionen.map((o) => ({ ...o, text: o.text.replace(/(?<=[.?!]) (?=[A-ZÄÖÜ„\d])/g, '\n') }));
    return a;
  });
  const luecken = (text, werte, hilfen) => ({ format: 'luecken', text, hilfen,
    luecken: Object.fromEntries(Object.entries(werte).map(([n, w]) => [n, Array.isArray(w) ? { loesung: w[0], typischeFehler: w[1] } : { loesung: w, typischeFehler: [] }])) });
  const KERN = [1, 2, 5, 10];
  const reihe = (b, bis) => Array.from({ length: bis }, (_, i) => (i + 1) * b).join(', ');
  const malFehler = (a, b) => fehlerliste(a * b, [[a * b + b, '1x1-nachbar'], [a * b - b, '1x1-nachbar'], [a + b, '1x1-addiert']]);
  const divFehler = (q) => fehlerliste(q, [[q + 1, 'div-einmaleins'], [q - 1, 'div-einmaleins']]);
  const paare = (p) => { const x = []; for (let a = 1; a <= 10; a++) if (p % a === 0 && p / a <= 10) x.push([a, p / a]); return x; };

  // ===================================================================
  // K1 Malaufgaben des kleinen Einmaleins
  // ===================================================================
  stufen('K1', 'F', {
    1: (k) => {
      const a = wahl(KERN), b = zz(2, 10);
      const [x, y] = k === 0 ? [a, b] : [b, a];
      return zahl(zeilen('Rechne.', `${x} · ${y}`), x * y, malFehler(x, y),
        h3('Mal heißt: gleich große Päckchen zusammen.', '3 · 5 heißt: 3 Päckchen mit je 5. Zähle 5, 10, 15. Das Ergebnis ist 15.',
          `Zähle in ${a}er-Schritten: ${reihe(a, Math.min(b, 10))}.`));
    },
    2: (k) => {
      if (k === 0) {
        const b = wahl([2, 5, 10]), n = zz(3, 5);
        const summe = Array(n).fill(b).join(' + ');
        return auswahl(zeilen(summe, 'Welche Mal-Aufgabe passt?'),
          [opt(`${n} · ${b}`, true), opt(`${b} + ${n}`, false, '1x1-addiert'), opt(`${n + 1} · ${b}`, false, '1x1-nachbar'), opt(`${n - 1} · ${b}`, false, '1x1-nachbar')],
          h3('Zähle, wie oft die gleiche Zahl dasteht.', '4 + 4 + 4 sind drei Vieren. Dazu passt 3 · 4.', `Die Zahl ${b} steht ${n}-mal da.`));
      }
      if (k === 1) {
        const a = wahl([2, 5, 10]), b = suche(() => zz(3, 9), (x) => x !== a);
        return luecken(`${a} · ${b} = ${b} · {{x}}`, { x: [a, fehlerliste(a, [[b, '1x1-addiert']])] },
          h3('Bei Mal-Aufgaben darfst du die Zahlen tauschen.', '2 · 7 und 7 · 2 ergeben beide 14.', `Tausche die Zahlen von ${a} · ${b}.`));
      }
      const [ding, beh] = wahl([['Murmeln', 'Tüte'], ['Stifte', 'Packung'], ['Eier', 'Schachtel']]);
      const n = zz(3, 9), b = wahl([2, 5, 10]);
      return zahl(zeilen(`Tom hat ${n} ${beh === 'Tüte' ? 'Tüten' : beh === 'Packung' ? 'Packungen' : 'Schachteln'}.`, `In jeder ${beh} sind ${b} ${ding}.`, `Wie viele ${ding} sind es zusammen?`),
        n * b, fehlerliste(n * b, [[n + b, '1x1-addiert']]),
        h3('Gleich viele in jeder Packung: Das ist eine Mal-Aufgabe.', '3 Tüten mit je 2 Bonbons: 3 · 2 = 6.', `Rechne ${n} · ${b}.`));
    },
    3: () => {
      const a = zz(2, 9);
      return auswahl(zeilen('Mia sagt:', `„${a} · 0 = ${a}“`, 'Stimmt das?'),
        [opt(`Nein. ${a} · 0 = 0.`, true), opt('Ja. Mal 0 ändert nichts.', false, '1x1-null'), opt('Ja. Die Zahl bleibt gleich.', false, '1x1-null'), opt('Nein. Es kommt 1 heraus.')],
        h3('Stell dir Päckchen vor, in denen nichts ist.', '3 · 0 heißt: 3 Päckchen mit je 0 Bonbons. Das sind 0 Bonbons.', `Lege ${a} leere Päckchen hin. Wie viele Bonbons sind darin?`));
    },
  });

  stufen('K1', 'G', {
    1: (k) => {
      const a = zz(3, 9), b = zz(3, 9);
      if (k === 0) return zahl(zeilen('Rechne.', `${a} · ${b}`), a * b, malFehler(a, b),
        h3('Nutze eine Kernaufgabe mit 2, 5 oder 10.', '6 · 7: Du weißt 5 · 7 = 35. Dazu noch einmal 7 ergibt 42.', `Rechne zuerst 5 · ${b} = ${5 * b}.`));
      return zahl(zeilen('Welche Zahl fehlt?', `${a} · ▢ = ${a * b}`), b, fehlerliste(b, [[a * b - a, '1x1-addiert'], [b + 1, '1x1-nachbar'], [b - 1, '1x1-nachbar']]),
        h3('Gehe die Reihe durch.', '4 · ▢ = 28. Zähle 4, 8, 12, 16, 20, 24, 28. Das sind 7 Schritte.', `Zähle in ${a}er-Schritten: ${reihe(a, b)}.`));
    },
    2: (k) => {
      if (k === 0) {
        const a = zz(3, 8), b = zz(3, 9);
        return luecken(zeilen(`${a} · ${b} = ${a * b}`, `${a + 1} · ${b} = {{x}}`), { x: [(a + 1) * b, fehlerliste((a + 1) * b, [[a * b + 1, '1x1-nachbar'], [a * b + a, '1x1-nachbar']])] },
          h3('Bei der Nachbaraufgabe kommt eine Reihe dazu.', '5 · 6 = 30. Bei 6 · 6 kommt noch eine 6 dazu: 30 + 6 = 36.', `Rechne ${a * b} + ${b}.`));
      }
      if (k === 1) {
        const [a, b] = [zz(3, 9), zz(3, 9)], p = a * b;
        const falsch = [[a + 1, b], [a, b - 1], [a - 1, b + 1]].filter(([x, y]) => x * y !== p);
        return auswahl(zeilen(`Welche Aufgabe hat das Ergebnis ${p}?`),
          [opt(`${a} · ${b}`, true), ...falsch.map(([x, y]) => opt(`${x} · ${y}`, false, '1x1-nachbar')), opt(`${a} + ${b}`, false, '1x1-addiert')].slice(0, 4),
          h3('Rechne jede Aufgabe aus.', '3 · 6 = 18 und 3 + 6 = 9. Nur 3 · 6 hat das Ergebnis 18.', `Rechne ${a} · ${b}.`));
      }
      const [ding, satz] = wahl([['Stühle', (n, b) => [`In einer Reihe stehen ${b} Stühle.`, `Es gibt ${n} Reihen.`]], ['Beine', (n, b) => [`Eine Spinne hat 8 Beine.`, `Im Netz sitzen ${n} Spinnen.`]], ['Eier', (n, b) => [`In einen Karton passen 6 Eier.`, `Es gibt ${n} Kartons.`]]]);
      const n = zz(3, 9), b = ding === 'Beine' ? 8 : ding === 'Eier' ? 6 : zz(6, 9);
      return zahl(zeilen(...satz(n, b), `Wie viele ${ding} sind es?`), n * b, fehlerliste(n * b, [[n + b, '1x1-addiert'], [n * b - b, '1x1-nachbar']]),
        h3('Gleich viele in jeder Gruppe: Das ist eine Mal-Aufgabe.', '4 Reihen mit je 5 Stühlen: 4 · 5 = 20.', `Rechne ${n} · ${b}.`));
    },
    3: () => {
      const a = wahl([3, 5, 7, 9]);
      return auswahl(zeilen('Ben sagt:', '„Jede Zahl mal 2 ergibt eine gerade Zahl.“', `Prüfe mit ${a} · 2.`, 'Stimmt das?'),
        [opt(`Ja. ${a} · 2 = ${a * 2}. Mal 2 ist das Doppelte. Ein Doppeltes ist immer gerade.`, true),
          opt(`Nein. ${a} ist ungerade. Dann ist auch ${a} · 2 ungerade.`), opt('Nein. Das gilt nur bis 10.'), opt('Ja. Aber nur für kleine Zahlen.')],
        h3('Rechne die Aufgabe aus. Ist das Ergebnis gerade?', '7 · 2 = 14. 14 ist gerade. Mal 2 heißt: zwei gleiche Teile.', `Rechne ${a} · 2. Teile das Ergebnis in zwei gleiche Teile.`));
    },
  });

  stufen('K1', 'M', {
    1: (k) => {
      const [a, b] = suche(() => [zz(6, 9), zz(6, 9)], ([x, y]) => x !== y || k === 1);
      if (k === 0) return zahl(`Wie viel ist ${a} · ${b}?`, a * b, malFehler(a, b), h2('Zerlege in eine Kernaufgabe und den Rest.', `Rechne 5 · ${b} = ${5 * b}. Dazu kommen ${a - 5} · ${b} = ${(a - 5) * b}.`));
      return zahl(`Welche Zahl fehlt? ▢ · ${b} = ${a * b}`, a, fehlerliste(a, [[a + 1, '1x1-nachbar'], [a - 1, '1x1-nachbar']]), h2(`Welche Zahl mal ${b} ergibt ${a * b}? Prüfe mit einer Kernaufgabe.`, `5 · ${b} = ${5 * b}. Bis ${a * b} fehlen noch ${(a - 5) * b}.`));
    },
    2: (k) => {
      if (k === 0) {
        const a = zz(6, 9), b = suche(() => zz(6, 9), (x) => x !== a);
        return auswahl(`Lisa rechnet ${a} · ${b} mit einer Kernaufgabe. Welcher Rechenweg passt?`,
          [opt(`5 · ${b} + ${a - 5} · ${b}`, true), opt(`5 · ${b} + ${a - 5}`, false, '1x1-addiert'), opt(`${a} · 5 + ${b}`, false, '1x1-addiert'), opt(`5 · ${b} + ${a} · ${b}`, false, '1x1-nachbar')],
          h2('Teile die erste Zahl auf: 5 und der Rest. Beide Teile werden mit derselben Zahl malgenommen.', `Teile ${a} in 5 und ${a - 5}. Nimm beide Teile mal ${b}.`));
      }
      if (k === 1) {
        const r = zz(6, 9), p = zz(3, 5), frei = zz(5, r * p - 5);
        return zahl(`In einem Bus gibt es ${r} Reihen mit je ${p} Plätzen. ${r * p - frei} Plätze sind besetzt. Wie viele Plätze sind noch frei?`, frei,
          fehlerliste(frei, [[r * p, 'sach-schritt-vergessen'], [r + p, '1x1-addiert']]),
          h2('Rechne zuerst aus, wie viele Plätze es insgesamt gibt.', `Insgesamt sind es ${r} · ${p} = ${r * p} Plätze.`));
      }
      const p = wahl([12, 16, 18, 20, 24, 36]);
      const richtig = paare(p).filter(([x, y]) => x <= y && x > 1);
      const falsch = suche(() => [[zz(2, 9), zz(2, 9)], [zz(2, 9), zz(2, 9)]], (f) => f.every(([x, y]) => x * y !== p) && f[0].join() !== f[1].join());
      return auswahl(`Welche Aufgaben haben das Ergebnis ${p}? Kreuze alle an.`,
        [...richtig.map(([x, y]) => opt(`${x} · ${y}`, true)), ...falsch.map(([x, y]) => opt(`${x} · ${y}`, false, '1x1-nachbar'))],
        h2(`Gehe die Reihen durch: In welchen Reihen kommt ${p} vor?`, `${richtig[0][0]} · ${richtig[0][1]} = ${p}. Prüfe die anderen genauso.`), true);
    },
    3: () => {
      const a = zz(6, 9), b = zz(6, 9);
      return auswahl(`Ben rechnet ${a} · ${b} und erhält ${a * b + b}. Wie kann er seinen Fehler finden?`,
        [opt(`Mit der Nachbaraufgabe: ${a - 1} · ${b} = ${(a - 1) * b}. Dazu kommt noch einmal ${b}. Das sind ${a * b}.`, true),
          opt('Er rechnet einfach noch einmal genauso.'), opt(`Er prüft mit ${a} + ${b}.`, false, '1x1-addiert'), opt('Gar nicht. Sein Ergebnis stimmt.', false, '1x1-nachbar')],
        h2('Welche Kernaufgabe oder Nachbaraufgabe kennst du sicher?', `${a - 1} · ${b} = ${(a - 1) * b}. Vergleiche mit Bens Ergebnis.`));
    },
  });

  stufen('K1', 'E', {
    1: (k) => {
      if (k === 0) {
        const n = zz(3, 9);
        return zahl(`Eine Zahl mal sich selbst ergibt ${n * n}. Wie heißt die Zahl?`, n, fehlerliste(n, [[n * n / 2, '1x1-addiert']]), h1(`Welche Aufgabe mit zwei gleichen Zahlen kennst du, die ${n * n} ergibt?`));
      }
      const a = zz(3, 9), b = zz(3, 6);
      return zahl(`${a} · ${b} = ${a * b}. Wie viel ist ${a} · ${2 * b}?`, 2 * a * b, fehlerliste(2 * a * b, [[a * b + 2, '1x1-addiert'], [a * b * 4, '1x1-nachbar']]), h1('Was passiert mit dem Ergebnis, wenn eine Zahl doppelt so groß wird?'));
    },
    2: (k) => {
      if (k === 0) {
        const kein = wahl([23, 29, 31, 37, 41, 43, 47, 53]);
        const ja = suche(() => [zz(3, 9) * zz(3, 9), zz(3, 9) * zz(3, 9), zz(3, 9) * zz(3, 9)], (x) => new Set(x).size === 3);
        return auswahl('Welche Zahl ist kein Ergebnis des kleinen Einmaleins?', [opt(String(kein), true), ...ja.map((x) => opt(String(x), false, '1x1-nachbar'))],
          h1('Zu welchen Zahlen findest du eine Aufgabe aus dem Einmaleins?'));
      }
      if (k === 1) {
        const [a, b] = suche(() => [zz(2, 9), zz(2, 9)], ([x, y]) => x < y);
        return luecken(`Zwei Zahlen aus dem Einmaleins haben das Produkt ${a * b} und die Summe ${a + b}. Die kleinere Zahl ist {{x}}, die größere ist {{y}}.`,
          { x: a, y: b }, h1(`Welche Aufgaben mit dem Ergebnis ${a * b} kennst du? Welche passt auch zur Summe?`));
      }
      const p = wahl([12, 18, 20, 24, 36]);
      const n = paare(p).length;
      return zahl(`Wie viele Aufgaben des kleinen Einmaleins (beide Zahlen von 1 bis 10) haben das Ergebnis ${p}? Zähle Tauschaufgaben einzeln.`, n,
        fehlerliste(n, [[Math.ceil(n / 2), '1x1-nachbar']]), h1('Gehe alle Reihen von 1 bis 10 durch. In welchen kommt die Zahl vor?'));
    },
    3: () => {
      const [satz, richtig, falsch] = wahl([
        ['„Ungerade mal ungerade ergibt immer eine ungerade Zahl.“', 'Ja. Je zwei gleiche ungerade Päckchen ergeben zusammen eine gerade Zahl. Bei einer ungeraden Anzahl Päckchen bleibt eines übrig. Gerade plus ungerade ist ungerade.',
          ['Nein. 3 · 5 ist gerade.', 'Nein. Zwei ungerade Zahlen ergeben immer gerade.', 'Ja. Aber nur im kleinen Einmaleins.']],
        ['„Eine gerade Zahl mal irgendeine Zahl ergibt immer eine gerade Zahl.“', 'Ja. Eine gerade Zahl ist ein Doppeltes. Ein Doppeltes mal eine Zahl bleibt ein Doppeltes.',
          ['Nein. Mit einer ungeraden Zahl wird das Ergebnis ungerade.', 'Nein. Das gilt nur für 2 und 4.', 'Ja. Aber nur, wenn die andere Zahl auch gerade ist.']],
      ]);
      return auswahl(`Stimmt das? ${satz} Wähle die beste Begründung.`, [opt(richtig, true), ...falsch.map((f) => opt(f))], h1('Probiere einige Beispiele. Kannst du erklären, warum es immer so ist?'));
    },
  });

  // ===================================================================
  // K2 Geteilt-Aufgaben aus dem kleinen Einmaleins
  // ===================================================================
  stufen('K2', 'F', {
    1: (k) => {
      const d = wahl([2, 5, 10]), q = zz(2, 10), a = d * q;
      if (k === 0) return zahl(zeilen('Rechne.', `${a} : ${d}`), q, divFehler(q),
        h3('Denke an die Mal-Aufgabe.', '15 : 5: Du weißt 3 · 5 = 15. Also ist 15 : 5 = 3.', `Welche Zahl mal ${d} ergibt ${a}? Zähle ${reihe(d, q)}.`));
      return auswahl(zeilen(`${a} : ${d}`, 'Welche Mal-Aufgabe hilft dir?'),
        [opt(`${q} · ${d} = ${a}`, true), opt(`${a} · ${d}`, false, 'div-falsche-rechenart'), opt(`${q + 1} · ${d}`, false, 'div-einmaleins'), opt(`${a} + ${d}`, false, 'div-falsche-rechenart')],
        h3('Mal und geteilt gehören zusammen.', 'Zu 12 : 2 passt 6 · 2 = 12.', `Suche die Mal-Aufgabe mit dem Ergebnis ${a}.`));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(2, 5), q = zz(2, 6), a = d * q;
        const ding = wahl(['Äpfel', 'Bonbons', 'Karten']);
        return zahl(zeilen(`${a} ${ding} werden an ${d} Kinder verteilt.`, 'Jedes Kind bekommt gleich viele.', 'Wie viele bekommt jedes Kind?'), q,
          fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [a + d, 'div-falsche-rechenart']]),
          h3('Verteile gerecht. Lege Plättchen.', '6 Äpfel für 2 Kinder: 6 : 2 = 3. Jedes Kind bekommt 3.', `Rechne ${a} : ${d}.`));
      }
      const d = wahl([2, 5, 10]), q = suche(() => zz(2, 10), (x) => x !== d), a = d * q;
      if (k === 1) return zahl(zeilen('Welche Zahl fehlt?', `${a} : ▢ = ${q}`), d, fehlerliste(d, [[a - q, 'div-falsche-rechenart']]),
        h3('Denke an die Mal-Aufgabe.', '20 : ▢ = 4. Du weißt 4 · 5 = 20. Die Zahl ist 5.', `${q} mal welche Zahl ergibt ${a}?`));
      return zahl(zeilen('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 2 = 7. Rechne 7 · 2 = 14. Die Zahl ist 14.', `Rechne ${q} · ${d}.`));
    },
    3: () => {
      const d = zz(3, 9);
      return auswahl(zeilen('Leo sagt:', `„${d} : ${d} = 0“`, 'Stimmt das?'),
        [opt(`Nein. ${d} : ${d} = 1.`, true), opt('Ja. Es bleibt nichts übrig.', false, 'div-durch-sich-selbst'), opt('Ja. Die Zahlen sind gleich.', false, 'div-durch-sich-selbst'), opt('Nein. Es kommt die Zahl selbst heraus.')],
        h3('Stell dir Äpfel und Kinder vor.', '4 Äpfel für 4 Kinder. Jedes Kind bekommt 1 Apfel.', `Verteile ${d} Äpfel an ${d} Kinder.`));
    },
  });

  stufen('K2', 'G', {
    1: (k) => {
      const d = zz(3, 9), q = zz(3, 9), a = d * q;
      if (k === 0) return zahl(zeilen('Rechne.', `${a} : ${d}`), q, divFehler(q),
        h3('Denke an die Mal-Aufgabe.', '42 : 6: Du weißt 7 · 6 = 42. Also ist 42 : 6 = 7.', `Zähle in ${d}er-Schritten bis ${a}: ${reihe(d, q)}.`));
      return zahl(zeilen('Welche Zahl fehlt?', `${a} : ▢ = ${q}`), d, fehlerliste(d, [[a - q, 'div-falsche-rechenart'], [d + 1, 'div-einmaleins']]),
        h3('Denke an die Mal-Aufgabe.', '36 : ▢ = 9. Du weißt 9 · 4 = 36. Die Zahl ist 4.', `${q} mal welche Zahl ergibt ${a}?`));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(3, 9), q = zz(3, 9), a = d * q;
        return zahl(zeilen(`${a} Kinder bilden Gruppen.`, `In jeder Gruppe sind ${d} Kinder.`, 'Wie viele Gruppen gibt es?'), q,
          fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q + 1, 'div-einmaleins']]),
          h3('Wie oft passt die Gruppe in alle Kinder?', '24 Kinder, Gruppen mit je 6: 24 : 6 = 4. Es gibt 4 Gruppen.', `Rechne ${a} : ${d}.`));
      }
      if (k === 1) {
        const [d, q] = [zz(3, 9), zz(3, 9)];
        const falsch = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (f) => f.every(([x]) => x !== q) && new Set(f.map((p) => p.join())).size === 3);
        return auswahl(`Welche Aufgabe hat das Ergebnis ${q}?`,
          [opt(`${d * q} : ${d}`, true), ...falsch.map(([x, y]) => opt(`${x * y} : ${y}`, false, 'div-einmaleins'))].filter((o, i, l) => l.findIndex((p) => p.text === o.text) === i),
          h3('Rechne jede Aufgabe aus.', '35 : 5 = 7, denn 7 · 5 = 35.', `Prüfe ${d * q} : ${d} mit ${q} · ${d}.`));
      }
      const ds = suche(() => [zz(3, 9), zz(3, 9), zz(3, 9), zz(3, 9)], () => true);
      const qs = suche(() => [zz(2, 9), zz(2, 9), zz(2, 9), zz(2, 9)], (x) => new Set(x).size === 4);
      return { format: 'zuordnen', text: 'Ordne jeder Aufgabe ihr Ergebnis zu.',
        paare: ds.map((d, i) => ({ links: `${d * qs[i]} : ${d}`, rechts: String(qs[i]) })).filter((p, i, l) => l.findIndex((x) => x.links === p.links) === i),
        hilfen: h3('Denke bei jeder Aufgabe an die Mal-Aufgabe.', '18 : 3 = 6, denn 6 · 3 = 18.', `Fang mit ${ds[0] * qs[0]} : ${ds[0]} an.`) };
    },
    3: () => {
      const d = zz(3, 9), q = zz(3, 9), a = d * q;
      return auswahl(zeilen(`Ida rechnet ${a} : ${d} = ${q}.`, `Sie prüft mit ${q} · ${d}.`, 'Warum klappt das?'),
        [opt(`Mal ist das Gegenteil von geteilt. ${q} · ${d} = ${a}.`, true), opt(`Auch ${q} + ${d} ergibt ${a}.`, false, 'div-falsche-rechenart'),
          opt('Das klappt nur bei kleinen Zahlen.'), opt('Das klappt gar nicht.')],
        h3('Rechne die Mal-Aufgabe aus. Was kommt heraus?', '12 : 3 = 4. Prüfe: 4 · 3 = 12. Das ist wieder die erste Zahl.', `Rechne ${q} · ${d}. Vergleiche mit ${a}.`));
    },
  });

  stufen('K2', 'M', {
    1: (k) => {
      const [d, q] = [zz(6, 9), zz(6, 9)], a = d * q;
      if (k === 0) return zahl(`Wie viel ist ${a} : ${d}?`, q, divFehler(q), h2('Nutze die Umkehraufgabe.', `Welche Zahl mal ${d} ergibt ${a}? Beginne mit 5 · ${d} = ${5 * d}.`));
      return zahl(`Welche Zahl fehlt? ${a} : ▢ = ${q}`, d, fehlerliste(d, [[a - q, 'div-falsche-rechenart'], [d + 1, 'div-einmaleins']]), h2('Nutze die Umkehraufgabe.', `${q} · ▢ = ${a}. Probiere ${q} · 5 = ${q * 5} und gehe weiter.`));
    },
    2: (k) => {
      if (k === 0) {
        const d = zz(4, 8), q = zz(4, 9), laufen = zz(3, 9);
        return zahl(`${d * q + laufen} Kinder fahren zum Ausflug. ${laufen} Kinder kommen zu Fuß. Die anderen fahren in Autos mit je ${d} Plätzen. Wie viele Autos braucht man?`, q,
          fehlerliste(q, [[(d * q + laufen) % d === 0 ? (d * q + laufen) / d : -1, 'sach-schritt-vergessen'], [d * q - d, 'div-falsche-rechenart']]),
          h2('Wie viele Kinder fahren wirklich mit dem Auto?', `${d * q + laufen} − ${laufen} = ${d * q}. Teile dann durch ${d}.`));
      }
      if (k === 1) {
        const q = zz(3, 8);
        const richtig = suche(() => [zz(3, 9), zz(3, 9)], ([x, y]) => x !== y);
        const falsch = suche(() => [[zz(3, 9), zz(3, 9)], [zz(3, 9), zz(3, 9)]], (f) => f.every(([, y]) => y !== q) && f[0].join() !== f[1].join() && !richtig.includes(f[0][0]) && !richtig.includes(f[1][0]));
        return auswahl(`Welche Aufgaben haben das Ergebnis ${q}? Kreuze alle an.`,
          [...richtig.map((d) => opt(`${d * q} : ${d}`, true)), ...falsch.map(([d, y]) => opt(`${d * y} : ${d}`, false, 'div-einmaleins'))],
          h2('Rechne jede Aufgabe mit der Umkehraufgabe nach.', `${richtig[0] * q} : ${richtig[0]} = ${q}, denn ${q} · ${richtig[0]} = ${richtig[0] * q}.`), true);
      }
      const [d, q] = suche(() => [zz(4, 9), zz(4, 9)], ([x, y]) => x !== y);
      return zahl(`Durch welche Zahl musst du ${d * q} teilen, um ${q} zu erhalten?`, d, fehlerliste(d, [[d * q - q, 'div-falsche-rechenart']]),
        h2('Stell die Aufgabe mit Platzhalter auf.', `${d * q} : ▢ = ${q}. Welche Zahl mal ${q} ergibt ${d * q}?`));
    },
    3: () => {
      const [d, q] = [zz(6, 9), zz(5, 8)], a = d * q;
      return auswahl(`Max rechnet ${a} : ${d} = ${q + 1}. Wie zeigst du ihm am besten, dass das falsch ist?`,
        [opt(`Mit der Probe: ${q + 1} · ${d} = ${(q + 1) * d}. Das ist nicht ${a}.`, true), opt('Ich sage ihm das richtige Ergebnis.'),
          opt(`Mit ${q + 1} + ${d}.`, false, 'div-falsche-rechenart'), opt('Gar nicht. Das Ergebnis stimmt.', false, 'div-einmaleins')],
        h2('Welche Rechnung prüft eine Geteilt-Aufgabe?', `Rechne ${q + 1} · ${d} und vergleiche mit ${a}.`));
    },
  });

  stufen('K2', 'E', {
    1: (k) => {
      const [d, q] = [zz(4, 9), zz(4, 9)];
      if (k === 0) return zahl(`Ich denke mir eine Zahl. Ich teile sie durch ${d} und erhalte ${q}. Welche Zahl habe ich mir gedacht?`, d * q, fehlerliste(d * q, [[d + q, 'div-falsche-rechenart']]), h1('Wie kannst du das Teilen rückgängig machen?'));
      const [x, y] = suche(() => [zz(3, 9), zz(3, 9)], ([u, v]) => u !== v);
      return zahl(`${x * y} : ${x} = ${y}. Wie viel ist ${x * y} : ${y}?`, x, fehlerliste(x, [[y, 'div-vertauscht']]), h1('Welche Mal-Aufgabe gehört zu beiden Geteilt-Aufgaben?'));
    },
    2: (k) => {
      if (k === 0) {
        const a = wahl([24, 36, 48, 72]);
        const teiler = [2, 3, 4, 6, 8, 9].filter((t) => a % t === 0), nicht = [5, 7, 9, 8].filter((t) => a % t !== 0);
        const drei = suche(() => [wahl(teiler), wahl(teiler), wahl(teiler)], (x) => new Set(x).size === 3);
        return auswahl(`Durch welche Zahl ist ${a} nicht teilbar?`, [opt(String(wahl(nicht)), true), ...drei.map((t) => opt(String(t), false, 'div-einmaleins'))],
          h1('Prüfe jede Zahl: Geht die Geteilt-Aufgabe ohne Rest auf?'));
      }
      if (k === 1) {
        const a = wahl([12, 18, 20, 24, 30, 36, 40]);
        const n = Array.from({ length: 10 }, (_, i) => i + 1).filter((t) => a % t === 0).length;
        return zahl(`Wie viele Zahlen von 1 bis 10 teilen ${a} ohne Rest?`, n, fehlerliste(n, [[n - 1, 'div-einmaleins'], [n + 1, 'div-einmaleins']]), h1('Vergiss die 1 nicht. Und teilt die Zahl 10 auch?'));
      }
      const [d, e, f] = [zz(2, 4), zz(2, 3), zz(2, 5)];
      return zahl(`Die Zahl ${d * e * f} wird durch ${d} geteilt. Das Ergebnis wird noch einmal durch ${e} geteilt. Was kommt heraus?`, f,
        fehlerliste(f, [[d * e * f / d, 'sach-schritt-vergessen']]), h1(`Was kommt nach dem ersten Teilen heraus? Und was passiert, wenn du gleich durch ${d * e} teilst?`));
    },
    3: () => {
      const a = wahl([24, 36, 48]), [d, e] = suche(() => [wahl([2, 3, 4]), wahl([6, 8, 12])], ([x, y]) => a % x === 0 && a % y === 0);
      return auswahl(`Tim sagt: „Teilt man durch eine größere Zahl, wird das Ergebnis größer.“ Vergleiche ${a} : ${d} und ${a} : ${e}. Wähle die richtige Antwort.`,
        [opt(`Nein. ${a} : ${d} = ${a / d}, aber ${a} : ${e} = ${a / e}. Das Ergebnis wird kleiner.`, true), opt('Ja. Größere Zahlen ergeben größere Ergebnisse.'),
          opt('Ja. Beim Malnehmen ist das auch so.'), opt('Nein. Das Ergebnis bleibt immer gleich.')],
        h1('Stell dir vor, du verteilst Kuchen an mehr Kinder. Was passiert mit jedem Stück?'));
    },
  });
}
