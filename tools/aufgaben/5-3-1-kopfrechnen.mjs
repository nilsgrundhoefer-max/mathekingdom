// Aufgaben zu 5.3.1 „Kopfrechnen“ (Lernziele K1 bis K3) nach ADR 0015.
// Formate für sinnvolles Üben: Päckchen mit Struktur, „Abziehen oder ergänzen?“, „Überlege zuerst“, Aufgabe und Zahlenstrahl zuordnen.

import { mauer, sechs, zahl, auswahl, opt, luecken, sach, teil, zuordnen, strahl, tabelle, L, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, addOhneUebertrag, kleinerVonGroesser, kind, U, GROESSTES, WERT, HILFSZAHL } from '../werkzeug.mjs';

const K = (kurz) => `5.3.1-${kurz}`;
const vor = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x += s), text: `+ ${s}` })); };
const zurueck = (a, ...schritte) => { let x = a; return schritte.map((s) => ({ von: x, nach: (x -= s), text: `− ${s}` })); };
// Zahlenstrahl über zwei Zehner rund um die Zahlen, Einerschritte.
const um = (klein, gross, extra = {}) => { const von = Math.floor(klein / 10) * 10, bis = Math.max(von + 20, Math.ceil(gross / 10) * 10); return { von, bis, schritt: 1, beschriftung: bis - von > 20 ? 10 : 5, ...extra }; };

export function kopfrechnen() {
  // =====================================================================
  // K1 Im Kopf addieren
  // =====================================================================
  sechs(K('K1'), 'F', [
    () => { const a = zz(4, 8);
      return zahl(Z(`Im Feld liegen ${a} Plättchen.`, 'Wie viele Plättchen fehlen bis 10?'), 10 - a, fehlerliste(10 - a, [[a, 'begriffe-verwechselt']]),
        h3('Zähle die leeren Felder.', '7 Plättchen: Bis 10 fehlen 3.', `Zähle von ${a} weiter bis 10.`), { bild: B.zehnerfeld(a), nachweis: N(`10 − ${a}`, `${a} + ${10 - a}`) }); },
    () => { const a = zz(7, 9), b = zz(11 - a + 1, 6);
      return zahl(Z('Rechne.', `${a} + ${b}`), a + b, fehlerliste(a + b, [[a + b - 10, 'stellenwert']]),
        h3('Fülle erst die Reihe bis 10. Der Rest kommt in die zweite Reihe.', '8 + 5: Erst 2 bis zur 10, dann noch 3. Ergebnis 13.', `Bis 10 fehlen ${10 - a}. Dann bleiben noch ${b - (10 - a)}.`), { bild: B.zehnerfeld(a, { dazu: b, felder: 20 }), nachweis: N(`${a} + ${b}`) }); },
    () => { const z = zz(2, 7) * 10, e = zz(6, 8);
      return strahl('markieren', Z(`Starte bei ${z + e}.`, `Springe ${10 - e} weiter.`, 'Tippe an: Wo landest du?'), { von: z, bis: z + 20, schritt: 1, beschriftung: 5, start: z + e }, z + 10, fehlerliste(z + 10, [[z + e - (10 - e), 'add-subtrahiert']]),
        h3('Weiter heißt: nach rechts.', `Start 27, 3 weiter: Du landest bei 30.`, `Zähle von ${z + e} aus ${10 - e} Striche nach rechts.`), { nachweis: N(`${z + e} + ${10 - e}`) }); },
    () => { const z = zz(2, 7) * 10, e = zz(6, 8), b = zz(10 - e + 2, 8), a = z + e;
      return luecken(Z(`${a} + ${b}`, `Erst bis zur ${z + 10}: ${a} + {{a}} = ${z + 10}`, `Dann weiter: ${z + 10} + {{b}} = {{c}}`), { a: 10 - e, b: b - (10 - e), c: a + b },
        h3(`Zerlege die ${b} in 2 Teile. Der erste Teil führt genau zum Zehner.`, '36 + 7: Erst 36 + 4 = 40. Dann 40 + 3 = 43.', `Bis ${z + 10} fehlen ${10 - e}.`),
        { bild: B.strahl({ von: z, bis: z + 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, 10 - e, b - (10 - e)) }), nachweis: N(`${a} + ${10 - e}`, `${z + 10} + ${b - (10 - e)}`, `${a} + ${b}`) }); },
    () => { const e = zz(2, 4), b = zz(3, 5);
      return luecken(Z('Rechne der Reihe nach.', `${e} + ${b} = {{a}}`, `${10 + e} + ${b} = {{b}}`, `${20 + e} + ${b} = {{c}}`, `${30 + e} + ${b} = {{d}}`), { a: e + b, b: 10 + e + b, c: 20 + e + b, d: 30 + e + b },
        h3('Die Einer bleiben gleich. Nur die Zehner ändern sich.', '3 + 4 = 7. Dann ist 13 + 4 = 17 und 23 + 4 = 27.', `${e} + ${b} = ${e + b}. Bei der nächsten Aufgabe kommt 1 Zehner dazu.`),
        { bild: B.strahl({ von: 0, bis: 40, schritt: 1, beschriftung: 10, spruenge: [0, 10, 20, 30].map((z) => ({ von: z + e, nach: z + e + b, text: `+ ${b}` })) }), nachweis: N(...[0, 10, 20, 30].map((z) => `${z + e} + ${b}`)) }); },
    () => { const a = zz(3, 6) * 10 + 5, b = 20;
      return auswahl(Z('Schau auf den Zahlenstrahl.', 'Welche Rechnung zeigt der Pfeil?'), [opt(`${a} + ${b}`, true), opt(`${a} − ${b}`, false, 'add-subtrahiert'), opt(`${b} + ${a + b}`, false, 'begriffe-verwechselt')],
        h3('Der Pfeil beginnt beim Start. Er zeigt nach rechts: Das ist plus.', 'Start 30, Pfeil + 10: Die Rechnung ist 30 + 10.', `Der Start ist bei ${a}. Am Pfeil steht + ${b}.`),
        { bild: B.strahl({ von: a - 5, bis: a + 35, schritt: 5, beschriftung: 10, start: a, spruenge: vor(a, b) }), nachweis: N(`${a} + ${b}`) }); },
  ]);
  sechs(K('K1'), 'G', [
    () => { const a = zz(21, 58), b = zz(2, 4) * 10;
      return zahl(Z('Rechne im Kopf.', `${a} + ${b}`), a + b, fehlerliste(a + b, [[a + b / 10, 'kopf-stellenwert']]), h3('Hier kommen nur Zehner dazu. Die Einer bleiben gleich.', '46 + 30: 4 Zehner + 3 Zehner = 7 Zehner. Ergebnis 76.', `${Math.floor(a / 10)} Zehner + ${b / 10} Zehner = ${Math.floor(a / 10) + b / 10} Zehner.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const z = zz(3, 8) * 10, e = zz(6, 8), b = zz(10 - e + 2, 9), a = z + e;
      return zahl(Z('Rechne im Kopf.', `${a} + ${b}`), a + b, fehlerliste(a + b, [[a + b - 10, 'add-uebertrag-vergessen']]), h3('Rechne erst bis zum nächsten Zehner. Dann kommt der Rest dazu.', '58 + 7: Erst 58 + 2 = 60. Dann 60 + 5 = 65.', `Bis ${z + 10} fehlen ${10 - e}. Dann bleiben noch ${b - (10 - e)}.`),
        { bild: B.strahl({ von: z, bis: z + 20, schritt: 1, beschriftung: 5, start: a, spruenge: vor(a, 10 - e, b - (10 - e)) }), nachweis: N(`${a} + ${b}`) }); },
    () => { const e = zz(5, 8), b = zz(11 - e + 1, 8), z = zz(1, 3) * 10;
      return luecken(Z('Rechne der Reihe nach.', `${z + e} + ${b} = {{a}}`, `${z + 10 + e} + ${b} = {{b}}`, `${z + 20 + e} + ${b} = {{c}}`, `Setze fort: ${z + 30 + e} + ${b} = {{d}}`), { a: z + e + b, b: z + 10 + e + b, c: z + 20 + e + b, d: z + 30 + e + b },
        h3('Die erste Zahl wird immer um 10 größer. Was passiert mit dem Ergebnis?', '26 + 8 = 34. Dann ist 36 + 8 = 44 und 46 + 8 = 54.', `${z + e} + ${b} = ${z + e + b}. Das nächste Ergebnis ist um 10 größer.`), { nachweis: N(...[0, 10, 20, 30].map((d) => `${z + d + e} + ${b}`)) }); },
    () => { const [a, b] = suche(() => [zz(24, 58), zz(13, 38)], ([x, y]) => x % 10 + y % 10 > 10 && x + y < 100);
      return zahl(Z('Rechne im Kopf.', `${a} + ${b}`), a + b, fehlerliste(a + b, [[addOhneUebertrag(a, b), 'add-uebertrag-vergessen']]), h3('Zerlege die zweite Zahl in Zehner und Einer.', '47 + 38: Erst 47 + 30 = 77. Dann 77 + 8 = 85.', `Erst die Zehner: ${a} + ${Math.floor(b / 10) * 10} = ${a + Math.floor(b / 10) * 10}.`),
        { bild: B.strahl({ von: Math.floor(a / 10) * 10, bis: Math.ceil((a + b) / 10) * 10, schritt: 1, beschriftung: 10, start: a, spruenge: vor(a, Math.floor(b / 10) * 10, b % 10) }), nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(24, 48), b = zz(31, 48);
      return auswahl(Z('Überlege zuerst.', 'Welche Aufgabe hat das größte Ergebnis?'), [opt(`${a} + ${b + 2}`, true), opt(`${a} + ${b}`), opt(`${a - 2} + ${b}`)],
        h3('Du musst nicht rechnen. Vergleiche die Zahlen.', '38 + 51 ist größer als 38 + 49. Denn 51 ist größer als 49.', `${b + 2} ist größer als ${b}. ${a} ist größer als ${a - 2}.`),
        { bild: B.streifen(frage(a + b + 2), [a, b + 2]), nachweis: [GROESSTES, ...N(`${a} + ${b + 2}`, `${a} + ${b}`, `${a - 2} + ${b}`)] }); },
    () => { const [a, b] = suche(() => [zz(24, 58), zz(13, 38)], ([x, y]) => x % 10 + y % 10 > 10 && x + y < 100), k = kind(), za = Math.floor(a / 10) * 10, zb = Math.floor(b / 10) * 10;
      return auswahl(Z(`${k} rechnet ${a} + ${b} so:`, `${za} + ${zb} = ${za + zb}`, `${a % 10} + ${b % 10} = ${a % 10 + b % 10}`, `${k} schreibt als Ergebnis ${za + zb + (a + b) % 10}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'add-uebertrag-vergessen'), opt(`Falsch. Ein Zehner fehlt. Richtig ist ${a + b}.`, true), opt('Falsch. Hier muss man minus rechnen.', false, 'add-subtrahiert')],
        h3('Zähle beide Teilergebnisse ganz zusammen.', '57 + 26: 50 + 20 = 70 und 7 + 6 = 13. Zusammen 70 + 13 = 83.', `Rechne ${za + zb} + ${a % 10 + b % 10}.`), { nachweis: [U(false, `${a} + ${b}`, za + zb + (a + b) % 10), ...N(`${a} + ${b}`, `${za} + ${zb}`, `${a % 10} + ${b % 10}`, `${za + zb} + ${a % 10 + b % 10}`)] }); },
  ]);
  sechs(K('K1'), 'M', [
    () => { const [a, b] = suche(() => [zz(24, 58) * 10, zz(13, 38) * 10], ([x, y]) => (x % 100 + y % 100) > 100);
      return zahl(`Rechne im Kopf: ${a} + ${b}`, a + b, fehlerliste(a + b, [[addOhneUebertrag(a, b), 'add-uebertrag-vergessen']]), h2('Rechne mit Zehnern wie mit kleinen Zahlen.', `${a / 10} Zehner + ${b / 10} Zehner = ${(a + b) / 10} Zehner.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const b = zz(14, 38) * 10, s = suche(() => zz(52, 88) * 10, (x) => x - b > 150 && x - b !== b);
      return luecken(`{{a}} + ${b} = ${s}`, { a: [s - b, fehlerliste(s - b, [[s + b, 'probe-falsche-umkehr'], [s - b + 100, 'ergaenzen-zu-viel']])] }, h2('Der fehlende Summand ist die Differenz aus Summe und bekanntem Summanden.', `Rechne ${s} − ${b}.`), { nachweis: N(`${s} − ${b}`, `${s - b} + ${b}`) }); },
    () => { const [a, b, c] = [zz(31, 58), zz(24, 48), zz(15, 37)];
      return mauer('Jeder Stein ist die Summe der beiden Steine darunter. Fülle die leeren Steine aus.', '+', [a, b, c], [[1, 0], [1, 1], [2, 0]],
        h2('Arbeite von unten nach oben: Zwei benachbarte Steine ergeben den Stein darüber.', `Links in der Mitte steht ${a} + ${b} = ${a + b}.`)); },
    () => { const a = zz(41, 78) * 10, b = zz(4, 9) * 10 + 5;
      return zahl(`Rechne im Kopf: ${a} + ${b}`, a + b, fehlerliste(a + b, [[a + b * 10, 'kopf-stellenwert']]), h2('Achte auf die Stellen: Zehner zu Zehnern, Einer zu Einern.', `${a} + ${b - 5} = ${a + b - 5}. Addiere noch 5.`), { nachweis: N(`${a} + ${b}`) }); },
    () => { const a = zz(21, 28) * 10, b = zz(12, 19) * 10, c = 95, ziel = suche(() => zz(6, 8) * 100, (x) => x - a - b - c > 20);
      return luecken(`Rechenkette: ${a} + ${b} = {{a}}, dann + ${c} = {{b}}, dann + {{c}} = ${ziel}.`, { a: a + b, b: a + b + c, c: ziel - a - b - c },
        h2('Rechne Glied für Glied. Das letzte Glied findest du durch Ergänzen.', `${a} + ${b} = ${a + b}.`), { nachweis: N(`${a} + ${b}`, `${a + b} + ${c}`, `${ziel} − ${a + b + c}`, `${a + b + c} + ${ziel - a - b - c}`) }); },
    () => auswahl('„Die Summe von zwei ungeraden Zahlen ist immer gerade.“ Beurteile die Aussage.', [
      opt('Richtig. Beispiel: 13 + 25 = 38. Von jeder ungeraden Zahl bleibt beim Paarebilden ein Einzelner übrig. Die beiden Einzelnen bilden zusammen wieder ein Paar.', true),
      opt('Falsch. Ungerade plus ungerade bleibt ungerade.', false, 'begriffe-verwechselt'),
      opt('Das stimmt nur bei kleinen Zahlen wie 3 + 5 = 8.'),
      opt('Richtig, denn jede Summe ist eine gerade Zahl.')],
    h2('Prüfe mehrere Beispiele und überlege dann, woran es liegt.', '3 + 5 = 8, 7 + 9 = 16, 13 + 25 = 38: Alle Ergebnisse sind gerade.'), { nachweis: [U(true), ...N('13 + 25', '3 + 5', '7 + 9')] }),
  ]);
  sechs(K('K1'), 'E', [
    () => { const [a, b] = suche(() => [zz(245, 589), zz(136, 389)], ([x, y]) => x % 10 + y % 10 > 10 && Math.floor(x / 10) % 10 + Math.floor(y / 10) % 10 >= 9);
      return zahl(`Rechne im Kopf: ${a} + ${b}`, a + b, fehlerliste(a + b, [[addOhneUebertrag(a, b), 'add-uebertrag-vergessen']]), h1('Addiere schrittweise: erst die Hunderter, dann die Zehner, dann die Einer.'), { nachweis: N(`${a} + ${b}`) }); },
    () => { const [a, b, c] = [zz(41, 68), zz(34, 58), zz(25, 47)];
      return mauer('Jeder Stein ist die Summe der beiden Steine darunter. Fülle die leeren Steine aus.', '+', [a, b, c], [[0, 1], [1, 1], [2, 0]],
        h1('Der linke mittlere Stein verrät dir den fehlenden unteren Stein.')); },
    () => { const a = zz(41, 68) * 10 + zz(1, 9), b = zz(21, 38) * 10 + zz(1, 9);
      return auswahl('Entscheide ohne zu rechnen: Welche Aufgabe hat das größte Ergebnis?', [
        opt(`${a} + ${b + 3}, denn der erste Summand ist gleich geblieben und der zweite ist am größten`, true),
        opt(`${a - 3} + ${b + 3}, denn hier wurden beide Summanden verändert`, false, 'geschickt-falsch-ausgeglichen'),
        opt(`${a} + ${b}, denn die Zahlen sind am einfachsten`),
        opt(`${a - 3} + ${b}, denn der erste Summand ist am kleinsten`, false, 'begriffe-verwechselt'),
        opt('Alle Ergebnisse sind gleich groß.', false, 'geschickt-falsch-ausgeglichen')],
      h1('Vergleiche jede Aufgabe Summand für Summand mit den anderen.'), { nachweis: [GROESSTES, ...N(`${a} + ${b + 3}`, `${a - 3} + ${b + 3}`, `${a} + ${b}`, `${a - 3} + ${b}`)] }); },
    () => { const m = wahl([100, 200, 300]);
      return luecken(`Summen von drei aufeinanderfolgenden Zahlen: 4 + 5 + 6 = 15, 10 + 11 + 12 = 33, 20 + 21 + 22 = 63. Stelle die Regel auf: Die Summe ist {{a}} · die mittlere Zahl. Sage damit ${m - 1} + ${m} + ${m + 1} vorher: {{b}}`, { a: 3, b: 3 * m },
        h1('Die kleinste Zahl ist um 1 kleiner als die mittlere, die größte um 1 größer.'), { nachweis: N('4 + 5 + 6', '15 : 5', '3 · 5 = 15', '10 + 11 + 12', '3 · 11 = 33', '20 + 21 + 22', '3 · 21 = 63', `${m - 1} + ${m} + ${m + 1}`, `3 · ${m}`) }); },
    () => { const s = zz(52, 88) * 10, x = zz(3, 9) * 5, y = zz(2, 5) * 10;
      return zahl(`Die Summe zweier Zahlen ist ${s}. Der erste Summand wird um ${x} größer, der zweite um ${y} größer. Bestimme die neue Summe.`, s + x + y, fehlerliste(s + x + y, [[s + x, 'sach-schritt-vergessen'], [s + x - y, 'add-subtrahiert']]), h1('Jede Änderung eines Summanden ändert die Summe um denselben Betrag.'), { nachweis: N(`${s} + ${x} + ${y}`) }); },
    () => { // Dart: Mit 16 und 17 genau 100 treffen. Die Lösung ist eindeutig: 16 · a + 17 · b = 100 nur für a = 2, b = 4.
      const loesungen = []; for (let a = 0; a <= 6; a++) for (let b = 0; b <= 5; b++) if (16 * a + 17 * b === 100) loesungen.push([a, b]);
      if (loesungen.length !== 1) throw new Error('K1-E-06: Dart-Aufgabe ist nicht eindeutig');
      const [a, b] = loesungen[0];
      return sach('Auf einer Dartscheibe gibt es nur die Felder 16 und 17. Du willst mit mehreren Würfen genau 100 Punkte erreichen.', [teil('Wie oft musst du die 16 treffen?', a), teil('Wie oft musst du die 17 treffen?', b)],
        h1('Probiere systematisch: Wie viel bleibt übrig, wenn du die 17 einmal, zweimal, dreimal … triffst?'), { nachweis: [{ art: 'kombination', werte: [16, 17], ziel: 100, anzahl: [a, b] }, ...N(`${a} · 16 + ${b} · 17`)] }); },
  ]);

  // =====================================================================
  // K2 Im Kopf subtrahieren
  // =====================================================================
  sechs(K('K2'), 'F', [
    () => { const z = zz(3, 8) * 10, b = zz(2, 6);
      return strahl('markieren', Z(`Starte bei ${z}.`, `Springe ${b} zurück.`, 'Tippe an: Wo landest du?'), { von: z - 10, bis: z + 10, schritt: 1, beschriftung: 5, start: z }, z - b, fehlerliste(z - b, [[z + b, 'sub-addiert']]),
        h3('Zurück heißt: nach links.', 'Start 30, 4 zurück: Du landest bei 26.', `Zähle von ${z} aus ${b} Striche nach links.`), { nachweis: N(`${z} − ${b}`) }); },
    () => { const z = zz(3, 8) * 10, e = zz(2, 4), b = zz(e + 2, 8), a = z + e;
      return luecken(Z(`${a} − ${b}`, `Erst bis zur ${z}: ${a} − {{a}} = ${z}`, `Dann weiter: ${z} − {{b}} = {{c}}`), { a: e, b: b - e, c: a - b },
        h3(`Zerlege die ${b} in 2 Teile. Der erste Teil führt genau zum Zehner.`, '43 − 7: Erst 43 − 3 = 40. Dann 40 − 4 = 36.', `Bis ${z} gehen ${e} weg.`),
        { bild: B.strahl({ von: z - 10, bis: z + 10, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, e, b - e) }), nachweis: N(`${a} − ${e}`, `${z} − ${b - e}`, `${a} − ${b}`) }); },
    () => { const z = zz(2, 8) * 10, e = zz(5, 8);
      return zahl(Z(`Der Punkt liegt bei ${z + e}.`, `Wie viel fehlt von ${z + e} bis ${z + 10}?`), 10 - e, fehlerliste(10 - e, [[e, 'begriffe-verwechselt']]),
        h3('Zähle die Striche vom Punkt bis zum nächsten Zehner.', 'Von 27 bis 30 fehlen 3.', `Zähle von ${z + e} weiter bis ${z + 10}.`), { bild: B.strahl({ von: z, bis: z + 10, schritt: 1, beschriftung: 5, start: z + e }), nachweis: N(`${z + 10} − ${z + e}`) }); },
    () => { const a = zz(5, 8) * 10 + 5, b = 20;
      return strahl('ablesen', Z('Der Pfeil springt zurück.', 'Bei welcher Zahl landet er?'), { von: a - 35, bis: a + 5, schritt: 5, beschriftung: 10, start: a, spruenge: zurueck(a, b), pfeil: a - b }, a - b, fehlerliste(a - b, [[a + b, 'sub-addiert'], [a - 2, 'stellenwert']]),
        h3('Hier gehen nur Zehner weg. Die Einer bleiben gleich.', 'Start 65, Sprung − 20: Du landest bei 45.', `${Math.floor(a / 10)} Zehner − 2 Zehner = ${Math.floor(a / 10) - 2} Zehner.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const e = zz(2, 4), b = zz(e + 2, 8);
      return luecken(Z('Rechne der Reihe nach.', `${10 + e} − ${b} = {{a}}`, `${20 + e} − ${b} = {{b}}`, `${30 + e} − ${b} = {{c}}`, `${40 + e} − ${b} = {{d}}`), { a: 10 + e - b, b: 20 + e - b, c: 30 + e - b, d: 40 + e - b },
        h3('Die erste Zahl wird immer um 10 größer. Das Ergebnis auch.', '15 − 6 = 9. Dann ist 25 − 6 = 19 und 35 − 6 = 29.', `${10 + e} − ${b} = ${10 + e - b}. Das nächste Ergebnis ist um 10 größer.`),
        { bild: B.strahl({ von: 0, bis: 20, schritt: 1, beschriftung: 5, start: 10 + e, spruenge: zurueck(10 + e, e, b - e) }), nachweis: N(...[10, 20, 30, 40].map((z) => `${z + e} − ${b}`)) }); },
    () => { const a = zz(5, 8) * 10 + 5, b = 20;
      return auswahl(Z('Schau auf den Zahlenstrahl.', 'Welche Rechnung zeigt der Pfeil?'), [opt(`${a} − ${b}`, true), opt(`${a} + ${b}`, false, 'sub-addiert'), opt(`${a - b} − ${b}`, false, 'begriffe-verwechselt')],
        h3('Der Pfeil beginnt beim Start. Er zeigt nach links: Das ist minus.', 'Start 50, Pfeil − 10: Die Rechnung ist 50 − 10.', `Der Start ist bei ${a}. Am Pfeil steht − ${b}.`),
        { bild: B.strahl({ von: a - 35, bis: a + 5, schritt: 5, beschriftung: 10, start: a, spruenge: zurueck(a, b) }), nachweis: N(`${a} − ${b}`) }); },
  ]);
  sechs(K('K2'), 'G', [
    () => { const a = zz(51, 98), b = zz(2, 4) * 10;
      return zahl(Z('Rechne im Kopf.', `${a} − ${b}`), a - b, fehlerliste(a - b, [[a - b / 10, 'kopf-stellenwert'], [a + b, 'sub-addiert']]), h3('Hier gehen nur Zehner weg. Die Einer bleiben gleich.', '76 − 30: 7 Zehner − 3 Zehner = 4 Zehner. Ergebnis 46.', `${Math.floor(a / 10)} Zehner − ${b / 10} Zehner = ${Math.floor(a / 10) - b / 10} Zehner.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const z = zz(4, 9) * 10, e = zz(2, 4), b = zz(e + 2, 9), a = z + e;
      return zahl(Z('Rechne im Kopf.', `${a} − ${b}`), a - b, fehlerliste(a - b, [[z + b - e, 'sub-kleiner-von-groesser']]), h3('Rechne erst bis zum Zehner. Dann geht der Rest weg.', '63 − 7: Erst 63 − 3 = 60. Dann 60 − 4 = 56.', `Bis ${z} gehen ${e} weg. Dann gehen noch ${b - e} weg.`),
        { bild: B.strahl({ von: z - 10, bis: z + 10, schritt: 1, beschriftung: 5, start: a, spruenge: zurueck(a, e, b - e) }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(5, 9) * 10 + zz(1, 3), d = zz(2, 4);
      return auswahl(Z('Abziehen oder ergänzen?', 'Bei welcher Aufgabe ist Ergänzen am leichtesten?'), [opt(`${a} − ${a - d}`, true), opt(`${a} − ${d}`), opt(`${a} − ${Math.floor(a / 20) * 10}`)],
        h3('Liegen beide Zahlen nah beieinander? Dann zähle von der kleinen zur großen.', '82 − 79: Von 79 bis 82 fehlen nur 3.', `${a - d} und ${a} liegen nah beieinander.`),
        { bild: B.strahl({ von: Math.floor((a - d) / 10) * 10, bis: Math.floor((a - d) / 10) * 10 + 20, schritt: 1, beschriftung: 5, start: a - d, spruenge: [{ von: a - d, nach: a, text: `+ ${d}` }] }), nachweis: N(`${a} − ${a - d}`) }); },
    () => { const [a, b] = suche(() => [zz(52, 95), zz(14, 38)], ([x, y]) => x % 10 < y % 10 && x - y > 20);
      return zahl(Z('Rechne im Kopf.', `${a} − ${b}`), a - b, fehlerliste(a - b, [[kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'], [a + b, 'sub-addiert']]), h3('Zerlege die zweite Zahl in Zehner und Einer.', '84 − 38: Erst 84 − 30 = 54. Dann 54 − 8 = 46.', `Erst die Zehner: ${a} − ${Math.floor(b / 10) * 10} = ${a - Math.floor(b / 10) * 10}.`),
        { bild: B.strahl({ von: Math.floor((a - b) / 10) * 10, bis: Math.ceil(a / 10) * 10, schritt: 1, beschriftung: 10, start: a, spruenge: zurueck(a, Math.floor(b / 10) * 10, b % 10) }), nachweis: N(`${a} − ${b}`) }); },
    () => { const a = zz(62, 95), b = zz(24, 38);
      return auswahl(Z('Überlege zuerst.', 'Welche Aufgabe hat das größte Ergebnis?'), [opt(`${a} − ${b}`, true), opt(`${a} − ${b + 3}`), opt(`${a - 2} − ${b}`)],
        h3('Du musst nicht rechnen. Wer weniger abzieht, behält mehr.', '75 − 28 ist größer als 75 − 31. Denn es geht weniger weg.', `Bei ${a} − ${b + 3} geht mehr weg. Bei ${a - 2} − ${b} ist die erste Zahl kleiner.`),
        { bild: B.streifen(a, [b, frage(a - b)]), nachweis: [GROESSTES, ...N(`${a} − ${b}`, `${a} − ${b + 3}`, `${a - 2} − ${b}`)] }); },
    () => { const [a, b] = suche(() => [zz(52, 95), zz(14, 38)], ([x, y]) => x % 10 < y % 10 && x - y > 20), k = kind(), za = Math.floor(a / 10) * 10, zb = Math.floor(b / 10) * 10;
      return auswahl(Z(`${k} rechnet ${a} − ${b} so:`, `${za} − ${zb} = ${za - zb}`, `${b % 10} − ${a % 10} = ${b % 10 - a % 10}`, `${k} schreibt als Ergebnis ${kleinerVonGroesser(a, b)}.`, 'Stimmt das?'), [opt('Stimmt.', false, 'sub-kleiner-von-groesser'), opt(`Falsch. Die Einer sind vertauscht. Richtig ist ${a - b}.`, true), opt('Falsch. Hier muss man plus rechnen.', false, 'sub-addiert')],
        h3('Die zweite Zahl geht ganz weg: erst ihre Zehner, dann ihre Einer.', '73 − 28: Erst 73 − 20 = 53. Dann 53 − 8 = 45.', `${a} − ${zb} = ${a - zb}. Davon gehen noch ${b % 10} weg.`), { nachweis: [U(false, `${a} − ${b}`, kleinerVonGroesser(a, b)), ...N(`${a} − ${b}`, `${a} − ${zb}`, `${a - zb} − ${b % 10}`)] }); },
  ]);
  sechs(K('K2'), 'M', [
    () => { const [a, b] = suche(() => [zz(52, 95) * 10, zz(14, 38) * 10], ([x, y]) => x % 100 < y % 100 && x - y > 200);
      return zahl(`Rechne im Kopf: ${a} − ${b}`, a - b, fehlerliste(a - b, [[kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'], [a + b, 'sub-addiert']]), h2('Rechne mit Zehnern wie mit kleinen Zahlen.', `${a / 10} Zehner − ${b / 10} Zehner = ${(a - b) / 10} Zehner.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const a = wahl([700, 800, 900]) + zz(2, 6), d1 = zz(6, 9), b = 1000 + zz(2, 5), d2 = zz(12, 17);
      return luecken(`Abziehen oder ergänzen? Rechne geschickt: ${a} − ${a - d1} = {{a}} und ${b} − ${b - d2} = {{b}}`, { a: d1, b: d2 }, h2('Liegen Minuend und Subtrahend nah beieinander, ist Ergänzen schneller als Abziehen.', `Von ${a - d1} bis ${a} fehlen ${d1}.`), { nachweis: N(`${a} − ${a - d1}`, `${b} − ${b - d2}`) }); },
    () => { const start = 900, b = zz(21, 28) * 10, mitte = start - b, ziel = 500, c = 125;
      return luecken(`Rechenkette: ${start} − ${b} = {{a}}, dann − {{b}} = ${ziel}, dann − ${c} = {{c}}.`, { a: mitte, b: mitte - ziel, c: ziel - c },
        h2('Rechne Glied für Glied. Das fehlende Glied ist der Unterschied der beiden Zahlen davor und danach.', `${start} − ${b} = ${mitte}.`), { nachweis: N(`${start} − ${b}`, `${mitte} − ${ziel}`, `${mitte} − ${mitte - ziel}`, `${ziel} − ${c}`) }); },
    () => { const a = zz(61, 95) * 10, b = zz(13, 38) * 10 + 5;
      return zahl(`Rechne im Kopf: ${a} − ${b}`, a - b, fehlerliste(a - b, [[a - b + 10, 'ergaenzen-zu-viel'], [a + b, 'sub-addiert']]), h2('Subtrahiere erst die Hunderter und Zehner, dann die Einer.', `${a} − ${b - 5} = ${a - b + 5}. Subtrahiere noch 5.`), { nachweis: N(`${a} − ${b}`) }); },
    () => { const [x, y, w] = [zz(31, 48), zz(15, 29), zz(21, 38)];
      return mauer('Jeder Stein ist die Summe der beiden Steine darunter. Fülle die leeren Steine aus.', '+', [x, y, w], [[1, 1], [0, 1], [0, 2]],
        h2('Hier rechnest du rückwärts: Stein oben minus Stein unten ergibt den Nachbarstein.', `Rechts in der Mitte steht ${x + 2 * y + w} − ${x + y}.`)); },
    () => auswahl('„Die Differenz von zwei ungeraden Zahlen ist immer gerade.“ Beurteile die Aussage.', [
      opt('Richtig. Beispiel: 25 − 13 = 12. Beide Zahlen liegen um 1 über einer geraden Zahl. Dieser Überschuss hebt sich beim Subtrahieren auf.', true),
      opt('Falsch. Ungerade minus ungerade bleibt ungerade.', false, 'begriffe-verwechselt'),
      opt('Das stimmt nur, wenn die Differenz kleiner als 10 ist.'),
      opt('Falsch. Beispiel: 25 − 13 = 11.', false, 'sub-uebertrag-vergessen')],
    h2('Prüfe mehrere Beispiele und überlege dann, woran es liegt.', '9 − 5 = 4, 17 − 3 = 14, 25 − 13 = 12: Alle Ergebnisse sind gerade.'), { nachweis: [U(true), HILFSZAHL(1, 'Eine ungerade Zahl liegt um 1 über einer geraden Zahl.'), ...N('25 − 13', '9 − 5', '17 − 3')] }),
  ]);
  sechs(K('K2'), 'E', [
    () => { const [a, b] = suche(() => [zz(512, 945), zz(146, 389)], ([x, y]) => x % 10 < y % 10 && Math.floor(x / 10) % 10 <= Math.floor(y / 10) % 10 && x - y > 150);
      return zahl(`Rechne im Kopf: ${a} − ${b}`, a - b, fehlerliste(a - b, [[kleinerVonGroesser(a, b), 'sub-kleiner-von-groesser'], [a + b, 'sub-addiert']]), h1('Subtrahiere schrittweise: erst die Hunderter, dann die Zehner, dann die Einer.'), { nachweis: N(`${a} − ${b}`) }); },
    () => { const [x, y, w] = [zz(131, 248), zz(115, 229), zz(121, 238)];
      return mauer('Jeder Stein ist die Summe der beiden Steine darunter. Fülle die leeren Steine aus.', '+', [x, y, w], [[1, 0], [0, 0], [0, 1]],
        h1('Beginne dort, wo zwei von drei zusammengehörenden Steinen bekannt sind.')); },
    () => { const a = zz(61, 88) * 10 + zz(2, 8), b = zz(21, 38) * 10 + zz(4, 8);
      return auswahl('Entscheide ohne zu rechnen: Welche Differenz ist am größten?', [
        opt(`${a + 3} − ${b - 3}, denn hier ist der Minuend am größten und der Subtrahend am kleinsten`, true),
        opt(`${a + 3} − ${b + 3}, denn beide Zahlen sind hier am größten`, false, 'geschickt-falsch-ausgeglichen'),
        opt(`${a} − ${b}, denn die Zahlen wurden nicht verändert`),
        opt(`${a - 3} − ${b - 3}, denn der Subtrahend ist am kleinsten`, false, 'geschickt-falsch-ausgeglichen'),
        opt('Alle Differenzen sind gleich groß.', false, 'geschickt-falsch-ausgeglichen')],
      h1('Eine Differenz wächst, wenn der Minuend wächst oder der Subtrahend schrumpft.'), { nachweis: [GROESSTES, ...N(`${a + 3} − ${b - 3}`, `${a + 3} − ${b + 3}`, `${a} − ${b}`, `${a - 3} − ${b - 3}`)] }); },
    () => { const [z, e] = wahl([[8, 7], [9, 4], [7, 6], [6, 9]]);
      return luecken(`Zahl minus Quersumme: 23 − 5 = 18, 41 − 5 = 36, 52 − 7 = 45. Alle Ergebnisse sind Vielfache von 9. Stelle die Regel auf: Das Ergebnis ist 9 · Zehnerziffer. Sage damit ${10 * z + e} − ${z + e} vorher: 9 · {{a}} = {{b}}`, { a: z, b: 9 * z },
        h1('Teile jedes Ergebnis durch 9 und vergleiche mit den Ziffern der Zahl.'), { nachweis: N('23 − 5', '41 − 5', '52 − 7', '9 · 2 = 18', '9 · 4 = 36', '9 · 5 = 45', '2 + 3 = 5', '4 + 1 = 5', '5 + 2 = 7', `${z} + ${e}`, `${10 * z + e} − ${z + e}`, `9 · ${z}`) }); },
    () => { const a = zz(52, 88) * 10 + zz(3, 7), b = wahl([298, 297, 398, 397]), d = Math.ceil(b / 100) * 100 - b;
      return luecken(`Verändere Minuend und Subtrahend um dieselbe Zahl: ${a} − ${b} = {{a}} − ${b + d} = {{b}}`, { a: a + d, b: a - b },
        h1('Vergrößerst du beide Zahlen um denselben Betrag, bleibt die Differenz gleich.'), { nachweis: N(`${a} + ${d}`, `${b} + ${d}`, `${a + d} − ${b + d}`, `${a} − ${b}`, { zahl: d, grund: 'Abstand des Subtrahenden zum nächsten Hunderter' }) }); },
    () => { const mehr = wahl([12, 16, 24, 30]), x = (100 - mehr) / 2;
      return zahl(`Steckbrief einer Unbekannten: „Ich bin eine zweistellige Zahl. Subtrahierst du mich von 100, erhältst du eine Zahl, die um ${mehr} größer ist als ich.“ Bestimme die Zahl.`, x, fehlerliste(x, [[100 - mehr, 'sach-schritt-vergessen'], [x + mehr, 'begriffe-verwechselt']]), h1('Die gesuchte Zahl und die Differenz ergeben zusammen 100.'), { nachweis: N(`100 − ${x}`, `${x} + ${mehr}`, `(100 − ${mehr}) : 2`) }); },
  ]);

  // =====================================================================
  // K3 Beim Kopfrechnen geschickt vorgehen
  // =====================================================================
  sechs(K('K3'), 'F', [
    () => { const a = zz(3, 8);
      return zahl(Z(`Im Feld liegen ${a} Plättchen.`, 'Wie viele Plättchen fehlen bis 10?'), 10 - a, fehlerliste(10 - a, [[a, 'begriffe-verwechselt']]),
        h3('Zähle die leeren Felder.', '6 Plättchen: Bis 10 fehlen 4.', `Zähle von ${a} weiter bis 10.`), { bild: B.zehnerfeld(a), nachweis: N(`10 − ${a}`, `${a} + ${10 - a}`) }); },
    () => { const a = zz(2, 7);
      return luecken(Z('Welche Zahl passt?', `${a} + {{a}} = 10`), { a: [10 - a, fehlerliste(10 - a, [[10 + a, 'add-subtrahiert']])] },
        h3('Zähle die leeren Felder im Bild.', '3 + 7 = 10.', `Zähle von ${a} weiter bis 10.`), { bild: B.zehnerfeld(a), nachweis: N(`10 − ${a}`, `${a} + ${10 - a}`) }); },
    () => { const [x, y, w] = mische([1, 2, 3, 4, 6, 7, 8, 9]).filter((v, i, alle) => !alle.slice(0, i).includes(10 - v)).slice(0, 3);
      return zuordnen(Z('Welche Zahlen ergeben zusammen 10?', 'Ordne zu.'), [x, y, w].map((v) => [v, 10 - v]),
        h3('Zwei Zahlen passen zusammen, wenn sie das Feld genau füllen.', '2 und 8 ergeben zusammen 10.', `${x} + ${10 - x} = 10.`), { bild: B.zehnerfeld(x, { dazu: 10 - x }), nachweis: N(...[x, y, w].map((v) => `${v} + ${10 - v}`)) }); },
    () => { const a = zz(3, 8) * 10;
      return zahl(Z(`Der Punkt liegt bei ${a}.`, `Wie viel fehlt von ${a} bis 100?`), 100 - a, fehlerliste(100 - a, [[10 - a / 10, 'stellenwert']]),
        h3('Zähle in Zehnerschritten bis 100.', 'Von 70 bis 100 fehlen 30.', `Von ${a} bis 100 sind es ${10 - a / 10} Zehnerschritte.`), { bild: B.strahl({ von: 0, bis: 100, schritt: 10, beschriftung: 10, start: a }), nachweis: N(`100 − ${a}`, `${a} + ${100 - a}`) }); },
    () => { const a = zz(2, 7);
      return luecken(Z(`${a} + ${10 - a} = 10`, 'Mit Zehnern geht es genauso.', `${a * 10} + {{a}} = 100`), { a: [100 - 10 * a, fehlerliste(100 - 10 * a, [[10 - a, 'stellenwert']])] },
        h3('Aus Einern werden Zehner. Die Ziffern bleiben gleich.', '3 + 7 = 10. Also ist 30 + 70 = 100.', `${a} Zehner + ${10 - a} Zehner = 10 Zehner.`), { bild: B.zehnerfeld(a, { dazu: 10 - a }), nachweis: N(`${a} + ${10 - a}`, `${10 * a} + ${100 - 10 * a}`) }); },
    () => { const a = zz(3, 8) * 10; const falsch = mische([10, 20, 30, 40, 50, 60, 70, 80].filter((v) => v !== 100 - a)).slice(0, 2);
      return auswahl(Z(`Welche Zahl ergibt zusammen mit ${a} genau 100?`), [opt(String(100 - a), true), ...falsch.map((v) => opt(String(v)))],
        h3('Zähle in Zehnerschritten bis 100.', '60 und 40 ergeben zusammen 100.', `Von ${a} bis 100 sind es ${10 - a / 10} Zehnerschritte.`), { bild: B.strahl({ von: 0, bis: 100, schritt: 10, beschriftung: 10, start: a }), nachweis: N(`100 − ${a}`, `${a} + ${100 - a}`) }); },
  ]);
  sechs(K('K3'), 'G', [
    () => { const a = zz(4, 8) * 10 + zz(2, 8);
      return zahl(Z(`Wie viel fehlt von ${a} bis 100?`), 100 - a, fehlerliste(100 - a, [[110 - a, 'ergaenzen-zu-viel']]), h3('Ergänze erst bis zum nächsten Zehner. Ergänze dann bis 100.', 'Von 64 bis 100: erst 6 bis 70, dann 30 bis 100. Zusammen 36.', `Von ${a} bis ${Math.ceil(a / 10) * 10} fehlen ${10 - a % 10}.`),
        { bild: B.strahl({ von: Math.floor(a / 10) * 10, bis: 100, schritt: Math.floor(a / 10) >= 6 ? 1 : 2, beschriftung: 10 }), nachweis: N(`100 − ${a}`, `${a} + ${100 - a}`) }); },
    () => { const a = zz(24, 67), b = wahl([19, 29]);
      return zahl(Z('Rechne geschickt.', `${a} + ${b}`, `Rechne erst ${a} + ${b + 1}.`, 'Ziehe dann 1 ab.'), a + b, fehlerliste(a + b, [[a + b + 1, 'geschickt-nicht-ausgeglichen'], [a + b + 2, 'geschickt-falsch-ausgeglichen']]), h3(`${b} ist fast ${b + 1}. Mit ${b + 1} rechnet es sich leichter.`, '37 + 19: Erst 37 + 20 = 57. Dann 57 − 1 = 56.', `${a} + ${b + 1} = ${a + b + 1}.`), { nachweis: N(`${a} + ${b}`, `${a} + ${b + 1} − 1`) }); },
    () => { const a = zz(24, 57), b = wahl([28, 38]);
      return luecken(Z('Rechne geschickt.', `${a} + ${b}`, `${a} + ${b + 2} = {{a}}`, 'Das sind 2 zu viel.', 'Ergebnis: {{b}}'), { a: a + b + 2, b: [a + b, fehlerliste(a + b, [[a + b + 4, 'geschickt-falsch-ausgeglichen']])] },
        h3('Du hast 2 zu viel dazugezählt. Die 2 müssen wieder weg.', '45 + 28: Erst 45 + 30 = 75. Dann 75 − 2 = 73.', `${a} + ${b + 2} = ${a + b + 2}.`),
        { bild: B.strahl({ von: Math.floor(a / 10) * 10, bis: Math.ceil((a + b + 2) / 10) * 10, schritt: 1, beschriftung: 10, start: a, spruenge: [{ von: a, nach: a + b + 2, text: `+ ${b + 2}` }, { von: a + b + 2, nach: a + b, text: '− 2' }] }), nachweis: N(`${a} + ${b + 2}`, `${a + b + 2} − 2`, `${a} + ${b}`) }); },
    () => { const [a, c] = suche(() => [zz(12, 38), zz(12, 38)], ([x, y]) => (x + y) % 10 === 0 && x % 10 !== 0 && x !== y), b = suche(() => zz(21, 48), (x) => x % 10 !== 0);
      return zahl(Z('Rechne geschickt.', `${a} + ${b} + ${c}`), a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]), h3('Suche 2 Zahlen mit einem glatten Ergebnis. Rechne sie zuerst zusammen.', '26 + 38 + 14: Erst 26 + 14 = 40. Dann 40 + 38 = 78.', `${a} + ${c} = ${a + c}.`),
        { bild: B.streifen(frage(a + b + c), [a, c, b]), nachweis: N(`${a} + ${b} + ${c}`, `${a} + ${c}`) }); },
    () => { const a = zz(6, 9) * 10 + zz(1, 3), d = zz(2, 4);
      return auswahl(Z(`Du rechnest ${a} − ${a - d}.`, 'Welcher Weg ist am leichtesten?'), [opt(`Ergänzen: von ${a - d} bis ${a}`, true), opt(`Abziehen: erst ${Math.floor((a - d) / 10) * 10} weg, dann ${(a - d) % 10} weg`), opt(`Zusammenzählen: ${a} + ${a - d}`, false, 'sub-addiert')],
        h3('Liegen beide Zahlen nah beieinander? Dann ist Ergänzen leicht.', '91 − 88: Von 88 bis 91 fehlen nur 3.', `Von ${a - d} bis ${a} fehlen nur ${d}.`),
        { bild: B.strahl({ von: Math.floor((a - d) / 10) * 10, bis: Math.floor((a - d) / 10) * 10 + 20, schritt: 1, beschriftung: 5, start: a - d, spruenge: [{ von: a - d, nach: a, text: `+ ${d}` }] }), nachweis: N(`${a} − ${a - d}`) }); },
    () => { const a = zz(34, 67), k = kind();
      return auswahl(Z(`${k} rechnet ${a} + 19 so:`, `${a} + 20 = ${a + 20}`, `${a + 20} + 1 = ${a + 21}`, 'Stimmt das?'), [opt('Stimmt.', false, 'geschickt-falsch-ausgeglichen'), opt(`Falsch. Es war 1 zu viel. Die 1 muss wieder weg. Richtig ist ${a + 19}.`, true), opt(`Falsch. Richtig ist ${a + 20}.`, false, 'geschickt-nicht-ausgeglichen')],
        h3('20 ist 1 mehr als 19. Was musst du danach tun?', '54 + 19: Erst 54 + 20 = 74. Dann 74 − 1 = 73.', `${a} + 20 = ${a + 20}. Das ist 1 zu viel.`), { nachweis: [U(false, `${a} + 19`, a + 21), ...N(`${a} + 19`, `${a} + 20`, `${a + 20} − 1`, `${a + 20} + 1`)] }); },
  ]);
  sechs(K('K3'), 'M', [
    () => { const a = wahl([198, 298, 299, 397]), b = zz(124, 268), r = Math.ceil(a / 100) * 100;
      return zahl(`Rechne geschickt: ${a} + ${b}`, a + b, fehlerliste(a + b, [[r + b, 'geschickt-nicht-ausgeglichen'], [r + b + (r - a), 'geschickt-falsch-ausgeglichen']]), h2(`Rechne mit ${r} statt ${a} und gleiche danach aus.`, `${r} + ${b} = ${r + b}. Das sind ${r - a} zu viel.`), { nachweis: N(`${a} + ${b}`, `${r} + ${b} − ${r - a}`) }); },
    () => { const a = zz(41, 78) * 10 + zz(1, 6), b = wahl([198, 297, 199]), r = Math.ceil(b / 100) * 100;
      return luecken(`Rechne geschickt: ${a} − ${b}. Rechne zuerst ${a} − ${r} = {{a}}. Gleiche dann aus: {{b}}`, { a: a - r, b: [a - b, fehlerliste(a - b, [[a - r - (r - b), 'geschickt-falsch-ausgeglichen'], [a - r, 'geschickt-nicht-ausgeglichen']])] },
        h2(`Mit ${r} hast du ${r - b} zu viel subtrahiert.`, `${a} − ${r} = ${a - r}. Addiere ${r - b}.`), { nachweis: N(`${a} − ${r}`, `${a - r} + ${r - b}`, `${a} − ${b}`) }); },
    () => { const b = zz(24, 68);
      return luecken(`Berechne der Reihe nach: 99 + ${b} = {{a}}, 199 + ${b} = {{b}}, 299 + ${b} = {{c}}. Nutze das Muster: 899 + ${b} = {{d}}`, { a: 99 + b, b: 199 + b, c: 299 + b, d: 899 + b },
        h2('Rechne jeweils mit dem glatten Hunderter und gleiche um 1 aus.', `99 + ${b} = 100 + ${b} − 1 = ${99 + b}.`), { nachweis: N(`99 + ${b}`, `199 + ${b}`, `299 + ${b}`, `899 + ${b}`) }); },
    () => { const [a, c] = wahl([[125, 75], [175, 25], [135, 65], [245, 55]]), b = zz(41, 89);
      return zahl(`Rechne geschickt: ${a} + ${b} + ${c}`, a + b + c, fehlerliste(a + b + c, [[a + b, 'sach-schritt-vergessen']]), h2('Addiere zuerst die beiden Zahlen, die sich zu einem glatten Hunderter ergänzen.', `${a} + ${c} = ${a + c}.`), { nachweis: N(`${a} + ${b} + ${c}`, `${a} + ${c}`) }); },
    () => { const [x, y, w] = [zz(41, 78) * 10, zz(21, 58) * 10 + 5, zz(12, 96)];
      return tabelle('Ergänze jede Zahl bis 1000.', ['Zahl', 'fehlt bis 1000'], [[x, L('a')], [y, L('b')], [w, L('c')]], { a: [1000 - x, fehlerliste(1000 - x, [[1100 - x, 'ergaenzen-zu-viel']])], b: [1000 - y, fehlerliste(1000 - y, [[1010 - y, 'ergaenzen-zu-viel'], [1100 - y, 'ergaenzen-zu-viel']])], c: [1000 - w, fehlerliste(1000 - w, [[1010 - w, 'ergaenzen-zu-viel'], [1100 - w, 'ergaenzen-zu-viel']])] },
        h2('Ergänze die Einer bis 10, die Zehner und Hunderter jeweils bis 9.', `${x} + ${1000 - x} = 1000.`), { nachweis: N(`1000 − ${x}`, `1000 − ${y}`, `1000 − ${w}`) }); },
    () => { const a = wahl([400, 500, 600]), k = kind();
      return auswahl(`${k} rechnet ${a} − 198 so: ${a} − 200 = ${a - 200}, dann ${a - 200} − 2 = ${a - 202}. Beurteile den Rechenweg.`, [
        opt(`Falsch. Mit 200 wurden 2 zu viel abgezogen. Die 2 müssen addiert werden: ${a - 200} + 2 = ${a - 198}.`, true),
        opt('Richtig. 198 ist um 2 kleiner als 200, also wird 2 abgezogen.', false, 'geschickt-falsch-ausgeglichen'),
        opt(`Falsch. Das Ergebnis ist ${a - 200}, ein Ausgleich ist nicht nötig.`, false, 'geschickt-nicht-ausgeglichen'),
        opt('Richtig. Beim Subtrahieren wird immer nach unten ausgeglichen.', false, 'geschickt-falsch-ausgeglichen')],
      h2('Überlege: Wurde mit 200 zu viel oder zu wenig abgezogen?', `${a} − 200 = ${a - 200}. Abgezogen werden sollten nur 198.`), { nachweis: [U(false, `${a} − 198`, a - 202), ...N(`${a} − 198`, `${a} − 200`, `${a - 200} + 2`, `${a - 200} − 2`)] }); },
  ]);
  sechs(K('K3'), 'E', [
    () => { const h = wahl([500, 700, 1000]);
      return zahl(`Rechne geschickt: ${h - 3} + ${h - 2} + ${h - 1}`, 3 * h - 6, fehlerliste(3 * h - 6, [[3 * h, 'geschickt-nicht-ausgeglichen'], [3 * h + 6, 'geschickt-falsch-ausgeglichen']]), h1('Alle drei Summanden liegen knapp unter derselben glatten Zahl.'), { nachweis: N(`${h - 3} + ${h - 2} + ${h - 1}`, `3 · ${h} − 6`) }); },
    () => { const a = wahl([398, 497, 298]), b = zz(124, 268), d = Math.ceil(a / 100) * 100 - a;
      return luecken(`Verändere die Summanden gegensinnig: ${a} + ${b} = ${a + d} + {{a}} = {{b}}`, { a: [b - d, fehlerliste(b - d, [[b + d, 'geschickt-falsch-ausgeglichen'], [b, 'geschickt-nicht-ausgeglichen']])], b: a + b },
        h1('Was der eine Summand gewinnt, muss der andere abgeben.'), { nachweis: N(`${a} + ${d}`, `${b} − ${d}`, `${a + d} + ${b - d}`, `${a} + ${b}`, { zahl: d, grund: 'Abstand des ersten Summanden zum nächsten Hunderter' }) }); },
    () => { const a = zz(52, 88) * 10 + zz(3, 7), b = wahl([298, 398]);
      return auswahl(`Welche Aufgabe hat dasselbe Ergebnis wie ${a} − ${b}? Wähle die Antwort mit der richtigen Begründung.`, [
        opt(`${a + 2} − ${b + 2}, denn Minuend und Subtrahend wurden um dieselbe Zahl vergrößert`, true),
        opt(`${a - 2} − ${b + 2}, denn die Änderungen gleichen sich aus`, false, 'geschickt-falsch-ausgeglichen'),
        opt(`${a + 2} − ${b - 2}, denn die Änderungen gleichen sich aus`, false, 'geschickt-falsch-ausgeglichen'),
        opt(`${a} − ${b + 2}, denn ${b + 2} ist eine glatte Zahl`, false, 'geschickt-nicht-ausgeglichen'),
        opt(`${a - 2} − ${b}, denn der Minuend darf beliebig verändert werden`)],
      h1('Die Differenz ist der Abstand zweier Zahlen. Verschiebe beide Zahlen gleich weit.'), { nachweis: [WERT(a - b), ...N(`${a} − ${b}`, `${a + 2} − ${b + 2}`, `${a - 2} − ${b + 2}`, `${a + 2} − ${b - 2}`, `${a} − ${b + 2}`, `${a - 2} − ${b}`)] }); },
    () => auswahl('Du rechnest mit einer glatten Nachbarzahl und gleichst aus. Stelle eine Regel auf, die für Summen und für Differenzen gilt.', [
      opt('Summe: die Summanden gegensinnig verändern. Differenz: Minuend und Subtrahend gleichsinnig verändern.', true),
      opt('Summe und Differenz: beide Zahlen gleichsinnig verändern.', false, 'geschickt-falsch-ausgeglichen'),
      opt('Summe und Differenz: beide Zahlen gegensinnig verändern.', false, 'geschickt-falsch-ausgeglichen'),
      opt('Summe: die Summanden gleichsinnig verändern. Differenz: gegensinnig verändern.', false, 'geschickt-falsch-ausgeglichen'),
      opt('Es genügt immer, nur eine der beiden Zahlen zu verändern.', false, 'geschickt-nicht-ausgeglichen')],
    h1('Prüfe an 48 + 27 = 50 + 25 und an 75 − 48 = 77 − 50.'), { nachweis: N('48 + 27', '50 + 25', '75 − 48', '77 − 50') }),
    () => { const m = wahl([50, 60, 80]);
      return zahl(`Berechne geschickt: ${m - 1} + ${m + 1} + ${m - 2} + ${m + 2} + ${m - 3} + ${m + 3}`, 6 * m, fehlerliste(6 * m, [[3 * m, 'sach-schritt-vergessen']]), h1('Bilde Paare, die sich gegenseitig ausgleichen.'), { nachweis: N(`${m - 1} + ${m + 1} + ${m - 2} + ${m + 2} + ${m - 3} + ${m + 3}`, `6 · ${m}`) }); },
    () => { const x = wahl([4, 6, 7, 8]);
      return zahl(`1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 = 45. Vor genau einer Zahl wird das Plus durch ein Minus ersetzt. Das Ergebnis ist dann ${45 - 2 * x}. Bestimme diese Zahl.`, x, fehlerliste(x, [[2 * x, 'sach-schritt-vergessen']]), h1('Wird eine Zahl subtrahiert statt addiert, sinkt das Ergebnis um das Doppelte dieser Zahl.'),
        { nachweis: N('1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9', `(45 − ${45 - 2 * x}) : 2`, `45 − 2 · ${x}`, [1, 2, 3, 4, 5, 6, 7, 8, 9].map((v, i) => (i === 0 ? '1' : `${v === x ? '−' : '+'} ${v}`)).join(' ')) }); },
  ]);
}
