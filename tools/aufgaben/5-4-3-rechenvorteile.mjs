// Aufgaben zu 5.4.3 „Rechenvorteile beim Multiplizieren“ (Lernziele R1 und R2) nach ADR 0015.
//   F  Tauschaufgaben und die passende 10 (2 · 5) am Punktefeld, ohne die Namen der Gesetze
//   G  Vertauschungs- und Verbindungsgesetz benennen, 2 · 5, 4 · 25 und 20 · 5 zusammenfassen
//   M  Gesetze in Gleichungen erkennen, 125 · 8, mehrere Faktoren, Division als Gegenbeispiel
//   E  Gesetze begründen, Gegenbeispiele prüfen, lange Produkte

import { sechs, stufen, zahl, auswahl, opt, luecken, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, HILFSZAHL, fz } from '../werkzeug.mjs';

const RV = (kurz) => `5.4.3-${kurz}`;
const verschieden = (von, bis) => suche(() => [zz(von, bis), zz(von, bis)], ([x, y]) => x !== y);

export function rechenvorteile() {
  // ===================================================================
  // R1 Vertauschungsgesetz und Verbindungsgesetz der Multiplikation
  // ===================================================================
  sechs(RV('R1'), 'F', [
    () => { const [a, b] = verschieden(3, 9);
      return luecken(Z(`${a} · ${b} = ${a * b}`, 'Tausche die Zahlen.', `${b} · ${a} = {{a}}`), { a: [a * b, fehlerliste(a * b, [[a + b, '1x1-addiert']])] },
        h3('Bei der Tauschaufgabe bleibt das Ergebnis gleich.', a * b === 12 ? '2 · 5 = 10. Also ist auch 5 · 2 = 10.' : '3 · 4 = 12. Also ist auch 4 · 3 = 12.', 'Es sind dieselben Punkte. Du zählst sie nur anders.'), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) }); },
    () => { const [a, b] = verschieden(3, 9);
      return auswahl(Z('Welche Aufgabe ist die Tauschaufgabe?', `${a} · ${b}`), [opt(`${b} · ${a}`, true), opt(`${b} + ${a}`, false, '1x1-addiert'), opt(`${a} · ${a}`)],
        h3('Bei der Tauschaufgabe tauschen die beiden Zahlen den Platz.', 'Die Tauschaufgabe zu 2 · 6 ist 6 · 2.', `Die Zahlen ${a} und ${b} bleiben. Das Mal bleibt auch.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) }); },
    () => { const c = suche(() => zz(3, 9), (x) => x !== 4 && x !== 5);
      return zahl(Z('Rechne.', `2 · ${c} · 5`, 'Rechne zuerst 2 · 5.'), 10 * c, fehlerliste(10 * c, [[2 * c + 5, 'punkt-vor-strich'], [c * 2 * 10, 'mal-stellenwert']]),
        h3('2 · 5 = 10. Mit 10 rechnest du leicht weiter.', '2 · 4 · 5: 2 · 5 = 10. 10 · 4 = 40.', `Rechne jetzt 10 · ${c}.`), { bild: B.feld(c, 10), nachweis: N('2 · 5', `10 · ${c}`, `2 · ${c} · 5`) }); },
    () => { const [a, b] = verschieden(3, 9);
      return luecken(Z('Welche Zahl fehlt?', `${a} · ${b} = ${b} · {{x}}`), { x: [a, fehlerliste(a, [[a * b, 'sach-schritt-vergessen']])] },
        h3('Links und rechts stehen dieselben Zahlen. Sie sind nur getauscht.', '2 · 7 = 7 · 2.', `Links stehen ${a} und ${b}. Rechts steht schon die ${b}.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) }); },
    () => { const [a, b] = verschieden(3, 9);
      return auswahl('Welche 2 Aufgaben haben dasselbe Ergebnis?', [opt(`${a} · ${b} und ${b} · ${a}`, true), opt(`${a} · ${b} und ${a} + ${b}`, false, '1x1-addiert'), opt(`${a} · ${b} und ${a} · ${a}`)],
        h3('Tauschaufgaben haben dasselbe Ergebnis.', '5 · 3 und 3 · 5 haben beide das Ergebnis 15.', 'Suche die Aufgabe mit denselben Zahlen und einem Mal.'), { bild: B.feld(a, b), nachweis: N({ art: 'gleicheWerte' }, `${a} · ${b}`, `${b} · ${a}`, `${a} + ${b}`, `${a} · ${a}`) }); },
    () => { const c = suche(() => zz(3, 9), (x) => x !== 7 && x !== 5);
      return zahl(Z('Rechne.', `5 · ${c} · 2`, `Tausche zuerst: 5 · 2 · ${c}.`), 10 * c, fehlerliste(10 * c, [[5 * c + 2, 'punkt-vor-strich'], [c, 'sach-schritt-vergessen']]),
        h3('Du darfst die Zahlen tauschen. Dann stehen 5 und 2 nebeneinander.', '5 · 7 · 2 = 5 · 2 · 7. 5 · 2 = 10. 10 · 7 = 70.', `5 · 2 = 10. Rechne jetzt 10 · ${c}.`), { bild: B.feld(c, 10), nachweis: N('5 · 2', `10 · ${c}`, `5 · ${c} · 2`, `5 · 2 · ${c}`) }); },
  ]);

  stufen(RV('R1'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, b] = verschieden(3, 9);
        return auswahl(Z('Welches Gesetz siehst du?', `${a} · ${b} = ${b} · ${a}`), [opt('Vertauschungsgesetz', true), opt('Verbindungsgesetz', false, 'begriffe-verwechselt'), opt('Kein Gesetz. Die Rechnung ist falsch.')],
          h3('Schau genau: Haben die Faktoren den Platz getauscht?', '5 · 9 = 9 · 5: Die Faktoren sind vertauscht. Das ist das Vertauschungsgesetz.', `${a} und ${b} haben den Platz getauscht.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(3, 9), zz(2, 5), zz(2, 5)], (x) => new Set(x).size === 3);
        return luecken(Z('Die Klammer wandert.', 'Die Faktoren bleiben gleich.', `(${a} · ${b}) · ${c} = ${a} · (${b} · {{a}})`), { a: [c, fehlerliste(c, [[b * c, 'sach-schritt-vergessen']])] },
          h3('Beim Verbindungsgesetz bleibt die Reihenfolge der Faktoren gleich.', '(4 · 7) · 2 = 4 · (7 · 2).', `Links stehen ${a}, ${b} und ${c}. Rechts fehlt der letzte Faktor.`), { nachweis: N(`(${a} · ${b}) · ${c}`, `${a} · (${b} · ${c})`) }); }
      const [a, b] = verschieden(3, 9);
      return luecken(Z('Welche Zahl fehlt?', `${a} · ${b} = {{x}} · ${a}`), { x: [b, fehlerliste(b, [[a * b, 'sach-schritt-vergessen']])] },
        h3('Beim Vertauschungsgesetz bleiben die Faktoren dieselben.', '6 · 8 = 8 · 6.', `Links stehen die Faktoren ${a} und ${b}.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${b} · ${a}`) });
    },
    2: (k) => {
      if (k === 0) { const a = zz(3, 9);
        return luecken(Z('Rechne auf 2 Wegen.', `(${a} · 2) · 5 = {{a}}`, `${a} · (2 · 5) = {{b}}`), { a: 10 * a, b: 10 * a },
          h3('Rechne immer zuerst die Klammer aus.', a === 7 ? '(6 · 2) · 5 = 12 · 5 = 60. Und 6 · (2 · 5) = 6 · 10 = 60.' : '(7 · 2) · 5 = 14 · 5 = 70. Und 7 · (2 · 5) = 7 · 10 = 70.', `Zweiter Weg: 2 · 5 = 10. Dann ${a} · 10.`), { bild: B.gruppen(a, 10), nachweis: N(`${a} · 2`, `${2 * a} · 5`, '2 · 5', `${a} · 10`, `(${a} · 2) · 5`, `${a} · (2 · 5)`) }); }
      const [a, b, c] = suche(() => [zz(11, 19), zz(2, 5), zz(2, 5)], ([x, y, z]) => y !== z);
      return auswahl(Z('Welche Rechnung hat dasselbe Ergebnis?', `${a} · (${b} · ${c})`), [opt(`(${a} · ${b}) · ${c}`, true), opt(`(${a} · ${b}) + ${c}`, false, '1x1-addiert'), opt(`${a} · (${b} + ${c})`, false, '1x1-addiert')],
        h3('Beim Multiplizieren darfst du die Klammer versetzen.', '5 · (4 · 2) = (5 · 4) · 2.', 'Suche die Rechnung mit denselben Zahlen und 2-mal Mal.'), { nachweis: [WERT(a * b * c), ...N(`${a} · (${b} · ${c})`, `(${a} · ${b}) · ${c}`)] });
    },
    3: () => { const [d, e] = wahl([[4, 2], [6, 3], [8, 2], [8, 4]]), q = zz(2, 4), a = d * e * q, k = kind(), li = a / d / e, re = a / (d / e);
      return auswahl(Z(`${k} sagt:`, `(${a} : ${d}) : ${e} ist dasselbe wie ${a} : (${d} : ${e}).`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Links kommt ${li} heraus.`, `Rechts kommt ${re} heraus.`), true),
        opt('Stimmt. Die Klammer darf man immer versetzen.', false, 'gesetz-auf-division'),
        opt(Z('Falsch.', `Links kommt ${re} heraus.`, `Rechts kommt ${li} heraus.`), false, 'klammer-ignoriert')],
      h3('Rechne beide Seiten aus. Die Klammer kommt zuerst.', '(16 : 4) : 2 = 4 : 2 = 2. Aber 16 : (4 : 2) = 16 : 2 = 8.', `Rechts: Klammer ${d} : ${e} = ${d / e}. Dann ${a} : ${d / e}.`), { nachweis: [U(false), ...N(`(${a} : ${d}) : ${e}`, `${a} : (${d} : ${e})`)] }); },
  });

  stufen(RV('R1'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(12, 39), zz(3, 9), zz(3, 9)], ([x, y, z]) => y !== z);
        return auswahl(`Welches Rechengesetz wurde angewendet? ${a} · ${b} · ${c} = ${a} · ${c} · ${b}`, [opt('Vertauschungsgesetz', true), opt('Verbindungsgesetz', false, 'begriffe-verwechselt'), opt('Kein Rechengesetz. Die Gleichung ist falsch.'), opt('Verteilungsgesetz', false, 'begriffe-verwechselt')],
          h2('Vergleiche beide Seiten: Hat sich die Reihenfolge der Faktoren geändert oder nur die Klammer?', `${b} und ${c} haben den Platz getauscht.`), { nachweis: N(`${a} · ${b} · ${c}`, `${a} · ${c} · ${b}`) }); }
      const [a, b, c] = suche(() => [zz(12, 39), zz(3, 9), zz(3, 9)], ([x, y, z]) => y !== z);
      return auswahl(`Welches Rechengesetz wurde angewendet? (${a} · ${b}) · ${c} = ${a} · (${b} · ${c})`, [opt('Verbindungsgesetz', true), opt('Vertauschungsgesetz', false, 'begriffe-verwechselt'), opt('Kein Rechengesetz. Die Gleichung ist falsch.'), opt('Verteilungsgesetz', false, 'begriffe-verwechselt')],
        h2('Vergleiche beide Seiten: Hat sich die Reihenfolge der Faktoren geändert oder nur die Klammer?', 'Die Reihenfolge ist gleich geblieben. Nur die Klammer steht an einer anderen Stelle.'), { nachweis: N(`(${a} · ${b}) · ${c}`, `${a} · (${b} · ${c})`) });
    },
    2: (k) => {
      if (k === 0) { const a = suche(() => zz(13, 79), (x) => x % 10 !== 0);
        return luecken(`Ergänze: 4 · ${a} · 25 = ${a} · (4 · {{x}}) = {{y}}`, { x: 25, y: [100 * a, fehlerliste(100 * a, [[4 * a + 25, 'punkt-vor-strich'], [10 * a, 'mal-stellenwert']])] },
          h2('Tausche so, dass 4 und 25 nebeneinanderstehen. Fasse sie mit einer Klammer zusammen.', `4 · 25 = 100. Dann ${a} · 100.`), { nachweis: N('4 · 25', `${a} · 100`, `4 · ${a} · 25`, `${a} · (4 · 25)`) }); }
      if (k === 1) { const [a, b] = verschieden(3, 9), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
        return auswahl('Welche Gleichungen stimmen? Wähle alle richtigen aus.', [opt(`${a} · ${b} = ${b} · ${a}`, true), opt(`(${a} · ${b}) · ${c} = ${a} · (${b} · ${c})`, true), opt('(48 : 4) : 2 = 48 : (4 : 2)', false, 'gesetz-auf-division'), opt(`${a} · ${b} = ${a} + ${b}`, false, '1x1-addiert')],
          h2('Beim Multiplizieren darfst du vertauschen und Klammern versetzen. Prüfe die übrigen Gleichungen durch Ausrechnen.', '(48 : 4) : 2 = 6, aber 48 : (4 : 2) = 24.'), { mehrfach: true, nachweis: [{ art: 'gleichungen' }, ...N('(48 : 4) : 2', '48 : (4 : 2)')] }); }
      const a = suche(() => zz(13, 89), (x) => x % 10 !== 0);
      return zahl(`Welche Zahl fehlt? (${a} · 25) · 4 = ${a} · ▢`, 100, fehlerliste(100, [[29, '1x1-addiert'], [25, 'sach-schritt-vergessen']]),
        h2('Die Klammer darf wandern. Fasse die beiden letzten Faktoren zusammen.', `(${a} · 25) · 4 = ${a} · (25 · 4).`), { nachweis: N(`(${a} · 25) · 4`, '25 · 4') });
    },
    3: () => { const [d, e] = wahl([[4, 2], [6, 2], [6, 3], [8, 4]]), q = zz(2, 5), a = d * e * q, [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „(${a} : ${d}) : ${e} ist dasselbe wie ${a} : (${d} : ${e}).“ ${k2} sagt: „Bei der Division darf man die Klammer nicht versetzen.“ Wer hat recht?`, [
        opt(`${k2}. (${a} : ${d}) : ${e} = ${a / d / e}, aber ${a} : (${d} : ${e}) = ${a / (d / e)}.`, true),
        opt(`${k1}. Das Verbindungsgesetz gilt für alle Rechenarten.`, false, 'gesetz-auf-division'),
        opt('Beide. Bei manchen Zahlen geht es, bei anderen nicht.'),
        opt(`${k1}. Beide Seiten ergeben ${a / d / e}.`, false, 'gesetz-auf-division')],
      h2('Rechne beide Seiten aus und vergleiche.', `Rechts: ${d} : ${e} = ${d / e}, dann ${a} : ${d / e}.`), { nachweis: N(`(${a} : ${d}) : ${e}`, `${a} : (${d} : ${e})`) }); },
  });

  stufen(RV('R1'), 'E', {
    1: () => { const a = suche(() => zz(13, 89), (x) => x % 10 !== 0);
      return auswahl(`Welche Rechengesetze werden in 4 · (${a} · 25) = (4 · 25) · ${a} verwendet?`, [
        opt('Vertauschungsgesetz und Verbindungsgesetz', true), opt('Nur das Vertauschungsgesetz', false, 'begriffe-verwechselt'), opt('Nur das Verbindungsgesetz', false, 'begriffe-verwechselt'),
        opt('Das Verteilungsgesetz', false, 'begriffe-verwechselt'), opt('Keins. Die Gleichung ist falsch.')],
      h1('Achte auf zwei Dinge: Hat sich die Reihenfolge geändert? Steht die Klammer anders?'), { nachweis: N(`4 · (${a} · 25)`, `(4 · 25) · ${a}`) }); },
    2: (k) => {
      if (k === 0) { const a = suche(() => zz(13, 89), (x) => x % 10 !== 0);
        return luecken(`Schreibe mit dem Vertauschungsgesetz so um, dass 25 und 4 nebeneinanderstehen: 25 · ${a} · 4 = 25 · {{x}} · {{y}}`, { x: 4, y: a },
          h1('Nur die Reihenfolge der Faktoren ändert sich.'), { nachweis: N(`25 · ${a} · 4`, `25 · 4 · ${a}`) }); }
      if (k === 1) { const [a, b] = verschieden(3, 9), c = suche(() => zz(3, 9), (x) => x !== a && x !== b);
        return auswahl('Welche Gleichung ist falsch?', [opt(`${a} · ${b} · ${c} = ${c} · ${b} · ${a}`), opt(`(${a} · ${b}) · ${c} = ${a} · (${b} · ${c})`), opt('(64 : 8) : 2 = 64 : (8 : 2)', true),
          opt(`${a} · ${b} · ${c} = ${b} · (${a} · ${c})`), opt(`${a} · ${b} · ${c} = (${c} · ${a}) · ${b}`)],
        h1('Vertauschen und Klammern versetzen sind beim Multiplizieren erlaubt. Prüfe die anderen Gleichungen genau.'), { nachweis: [{ art: 'gleichungen', falsche: true }, ...N('(64 : 8) : 2', '64 : (8 : 2)')] }); }
      const [a, b, c] = suche(() => [zz(12, 25), zz(3, 9), zz(3, 9)], ([x, y, z]) => y !== z);
      return zahl(`Es gilt (${a} · ${b}) · ${c} = ${fz(a * b * c)}. Wie groß ist ${c} · (${b} · ${a})? Antworte, ohne neu zu rechnen.`, a * b * c, fehlerliste(a * b * c, [[a * b + c, 'punkt-vor-strich']]),
        h1('Welche Gesetze verbinden die beiden Rechnungen?'), { nachweis: N(`(${a} · ${b}) · ${c}`, `${c} · (${b} · ${a})`) });
    },
    3: (k) => {
      if (k === 0) { const [a, d] = wahl([[24, 6], [36, 4], [40, 8], [42, 7]]);
        return auswahl(`Gilt das Vertauschungsgesetz auch für die Division? Prüfe an ${a} : ${d} und ${d} : ${a}.`, [
          opt(`Nein. ${a} : ${d} = ${a / d}, aber ${d} : ${a} ergibt keine natürliche Zahl. Die Ergebnisse sind verschieden.`, true),
          opt('Ja. Bei allen Rechenarten darf man vertauschen, das Ergebnis bleibt dabei immer gleich.', false, 'gesetz-auf-division'),
          opt(`Ja. Beide Aufgaben ergeben ${a / d}.`, false, 'gesetz-auf-division'),
          opt('Nein. Bei der Division darf man gar nichts umstellen.'),
          opt('Das kann man nicht prüfen.')],
        h1('Rechne beide Aufgaben aus. Was fällt dir bei der zweiten auf?'), { nachweis: [U(false), ...N(`${a} : ${d}`)] }); }
      const [d, e] = wahl([[8, 2], [8, 4], [6, 2]]), q = wahl([2, 4]), a = d * e * q;
      return auswahl('Welche Rechnung zeigt, dass das Verbindungsgesetz für die Division nicht gilt?', [
        opt(`(${a} : ${d}) : ${e} = ${a / d / e}, aber ${a} : (${d} : ${e}) = ${a / (d / e)}.`, true),
        opt(`(${a} : ${d}) : ${e} = ${a / d / e} und ${a} : (${d} : ${e}) = ${a / d / e}.`, false, 'gesetz-auf-division'),
        opt(`${a} : ${d} = ${a / d} und ${a} : ${e} = ${a / e}.`),
        opt(`(${a} · ${d}) · ${e} = ${a} · (${d} · ${e}).`),
        opt('Das kann keine Rechnung zeigen.')],
      h1('Ein Gegenbeispiel braucht dieselben Zahlen, einmal mit der Klammer vorne, einmal hinten.'), { nachweis: N(`(${a} : ${d}) : ${e}`, `${a} : (${d} : ${e})`, `${a} : ${d}`, `${a} : ${e}`) }); },
  });

  // ===================================================================
  // R2 Vorteilhaft multiplizieren
  // ===================================================================
  sechs(RV('R2'), 'F', [
    () => { const c = suche(() => zz(3, 9), (x) => x !== 7 && x !== 5);
      return zahl(Z('Rechne geschickt.', `2 · ${c} · 5`, 'Rechne zuerst 2 · 5.'), 10 * c, fehlerliste(10 * c, [[2 * c + 5, 'punkt-vor-strich']]),
        h3('2 · 5 = 10. Mit 10 rechnest du leicht weiter.', '2 · 7 · 5: 2 · 5 = 10. 10 · 7 = 70.', `Rechne jetzt 10 · ${c}.`), { bild: B.feld(c, 10), nachweis: N('2 · 5', `10 · ${c}`, `2 · ${c} · 5`) }); },
    () => { const c = zz(3, 9);
      return auswahl(Z(`5 · ${c} · 2`, 'Welche 2 Zahlen rechnest du zuerst?'), [opt('5 · 2', true), opt(`5 · ${c}`), opt(`${c} · 2`)],
        h3('Suche 2 Zahlen, die zusammen 10 ergeben, wenn du sie malnimmst.', '2 · 5 = 10. Mit 10 rechnest du leicht.', 'Probiere 5 · 2.'), { bild: B.feld(c, 10), nachweis: [WERT(10), ...N('5 · 2', `10 · ${c}`, `5 · ${c} · 2`)] }); },
    () => { const c = suche(() => zz(3, 9), (x) => x !== 9 && x !== 5);
      return zahl(Z('Rechne.', `5 · ${c} · 2`, `Tausche zuerst: 5 · 2 · ${c}.`), 10 * c, fehlerliste(10 * c, [[5 * c + 2, 'punkt-vor-strich']]),
        h3('Tausche so, dass 5 und 2 nebeneinanderstehen.', '5 · 9 · 2 = 5 · 2 · 9 = 10 · 9 = 90.', `5 · 2 = 10. Rechne jetzt 10 · ${c}.`), { bild: B.feld(c, 10), nachweis: N('5 · 2', `10 · ${c}`, `5 · ${c} · 2`, `5 · 2 · ${c}`) }); },
    () => { const c = zz(3, 9);
      return luecken(Z('Welche Zahl fehlt?', `5 · 2 · ${c} = 10 · {{x}}`), { x: [c, fehlerliste(c, [[10 * c, 'sach-schritt-vergessen']])] },
        h3('5 · 2 ist 10. Die letzte Zahl bleibt.', '5 · 2 · 4 = 10 · 4.', `Im Bild sind ${c} Reihen mit je 10 Punkten.`), { bild: B.feld(c, 10), nachweis: N('5 · 2', `5 · 2 · ${c}`, `10 · ${c}`) }); },
    () => { const c = suche(() => zz(3, 9), (x) => x !== 4 && x !== 5);
      return zahl(Z('Rechne geschickt.', `2 · ${c} · 5`), 10 * c, fehlerliste(10 * c, [[2 * c + 5, 'punkt-vor-strich'], [2 * c, 'sach-schritt-vergessen']]),
        h3('Suche 2 Zahlen, die mal genommen 10 ergeben.', '2 · 4 · 5: 2 · 5 = 10. 10 · 4 = 40.', 'Rechne zuerst 2 · 5.'), { bild: B.feld(c, 10), nachweis: N('2 · 5', `10 · ${c}`, `2 · ${c} · 5`) }); },
    () => { const c = zz(3, 9);
      return zahl(Z('In 1 Kiste sind 2 Reihen.', 'In jeder Reihe sind 5 Flaschen.', `Es gibt ${c} Kisten.`, 'Wie viele Flaschen sind es?'), 10 * c, fehlerliste(10 * c, [[2 + 5 + c, '1x1-addiert'], [5 * c, 'sach-schritt-vergessen']]),
        h3('Rechne zuerst die Flaschen in 1 Kiste.', '2 Reihen mit je 5 sind 10 Flaschen. 3 Kisten: 3 · 10 = 30.', `In 1 Kiste sind 2 · 5 = 10 Flaschen. Rechne ${c} · 10.`), { einheit: 'Flaschen', bild: B.gruppen(c, 10), nachweis: N('2 · 5', `${c} · 10`) }); },
  ]);

  stufen(RV('R2'), 'G', {
    1: (k) => {
      if (k === 0) { const a = zz(3, 9);
        return luecken(Z('Rechne geschickt.', `5 · ${a} · 2 = 10 · {{a}} = {{b}}`), { a, b: [10 * a, fehlerliste(10 * a, [[5 * a + 2, 'punkt-vor-strich']])] },
          h3('Tausche so, dass 5 und 2 nebeneinanderstehen.', '5 · 6 · 2 = 10 · 6 = 60.', `5 · 2 = 10. Es bleibt der Faktor ${a}.`), { bild: B.gruppen(a, 10), nachweis: N('5 · 2', `10 · ${a}`, `5 · ${a} · 2`) }); }
      if (k === 1) { const a = wahl([11, 12]);
        return zahl(Z('Rechne geschickt.', `2 · ${a} · 5`), 10 * a, fehlerliste(10 * a, [[2 * a + 5, 'punkt-vor-strich'], [2 * a, 'sach-schritt-vergessen']]),
          h3('Fasse 2 und 5 zusammen.', '2 · 13 · 5: 2 · 5 = 10. 10 · 13 = 130.', `2 · 5 = 10. Rechne jetzt 10 · ${a}.`), { bild: B.feld(a, 10), nachweis: N('2 · 5', `10 · ${a}`, `2 · ${a} · 5`) }); }
      const a = suche(() => zz(13, 49), (x) => x % 10 !== 0);
      return luecken(Z('Rechne geschickt.', `20 · ${a} · 5 = 100 · {{a}} = {{b}}`), { a, b: [100 * a, fehlerliste(100 * a, [[10 * a, 'mal-stellenwert']])] },
        h3('20 · 5 = 100. Mit 100 rechnest du leicht.', '20 · 17 · 5 = 100 · 17 = 1700.', `Es bleibt der Faktor ${a}.`), { nachweis: N('20 · 5', `100 · ${a}`, `20 · ${a} · 5`) });
    },
    2: (k) => {
      if (k === 0) { const a = suche(() => zz(13, 99), (x) => x % 10 !== 0 && x !== 13);
        return zahl(Z('Rechne geschickt.', `4 · ${a} · 25`), 100 * a, fehlerliste(100 * a, [[4 * a * 10, 'mal-stellenwert'], [4 * a + 25, 'punkt-vor-strich']]),
          h3('4 · 25 = 100. Tausche die Faktoren.', '4 · 13 · 25 = 4 · 25 · 13 = 100 · 13 = 1300.', `4 · 25 = 100. Rechne jetzt 100 · ${a}.`), { nachweis: N('4 · 25', `100 · ${a}`, `4 · ${a} · 25`) }); }
      const f = suche(() => zz(5, 9), (x) => x !== 6);
      return zahl(Z(`In 1 Kiste sind 4 Reihen mit je ${f} Flaschen.`, 'Ein Laster bringt 25 Kisten.', 'Wie viele Flaschen sind es?'), 100 * f, fehlerliste(100 * f, [[4 * f, 'sach-schritt-vergessen'], [25 * f, 'sach-schritt-vergessen']]),
        h3('Rechne geschickt: 25 Kisten mit je 4 Reihen sind 100 Reihen.', '25 Kisten mit je 4 Reihen zu 6 Flaschen: 25 · 4 = 100. 100 · 6 = 600.', `25 · 4 = 100 Reihen. Rechne 100 · ${f}.`), { einheit: 'Flaschen', bild: B.feld(4, f), nachweis: [HILFSZAHL(4 * f, 'Flaschen in 1 Kiste'), ...N('25 · 4', `100 · ${f}`, `25 · 4 · ${f}`)] });
    },
    3: () => { const a = suche(() => zz(13, 39), (x) => x % 10 !== 0);
      return auswahl(Z('Welcher Weg ist am geschicktesten?', `25 · ${a} · 4`), [
        opt(Z('Zuerst 25 · 4 = 100.', `Dann 100 · ${a} = ${100 * a}.`), true),
        opt(Z(`Zuerst 25 · ${a}.`, 'Dann das Ergebnis mal 4.')),
        opt(Z(`Zuerst ${a} · 4.`, 'Dann das Ergebnis mal 25.'))],
      h3('Suche 2 Faktoren, die zusammen eine glatte Zahl ergeben.', '25 · 4 = 100. Mal 100 ist leicht.', 'Tausche die Faktoren so, dass 25 und 4 nebeneinanderstehen.'), { nachweis: N('25 · 4', `100 · ${a}`, `25 · ${a} · 4`) }); },
  });

  stufen(RV('R2'), 'M', {
    1: (k) => {
      if (k === 0) { const a = suche(() => zz(13, 99), (x) => x % 10 !== 0 && x !== 25);
        return zahl(`Rechne vorteilhaft: 25 · ${a} · 4`, 100 * a, fehlerliste(100 * a, [[10 * a, 'mal-stellenwert']]),
          h2('Suche zwei Faktoren, die zusammen 100 ergeben.', `25 · 4 = 100. Rechne 100 · ${a}.`), { nachweis: N('25 · 4', `100 · ${a}`, `25 · ${a} · 4`) }); }
      const a = suche(() => zz(13, 99), (x) => x % 10 !== 0);
      return zahl(`Rechne vorteilhaft: 2 · ${a} · 50`, 100 * a, fehlerliste(100 * a, [[10 * a, 'mal-stellenwert']]),
        h2('Suche zwei Faktoren, die zusammen 100 ergeben.', `2 · 50 = 100. Rechne 100 · ${a}.`), { nachweis: N('2 · 50', `100 · ${a}`, `2 · ${a} · 50`) });
    },
    2: (k) => {
      if (k === 0) { const a = suche(() => zz(3, 79), (x) => x % 10 !== 0 && x !== 8);
        return zahl(`Rechne vorteilhaft: 125 · ${a} · 8`, 1000 * a, fehlerliste(1000 * a, [[100 * a, 'mal-stellenwert']]),
          h2('125 · 8 = 1000.', `Rechne 1000 · ${a}.`), { nachweis: N('125 · 8', `1000 · ${a}`, `125 · ${a} · 8`) }); }
      if (k === 1) { const a = suche(() => zz(13, 99), (x) => x % 10 !== 0);
        return zahl(`Rechne vorteilhaft: 4 · 5 · ${a} · 25 · 2`, 1000 * a, fehlerliste(1000 * a, [[100 * a, 'mal-stellenwert'], [10 * a, 'mal-stellenwert']]),
          h2('Bilde zwei Paare, die glatte Zahlen ergeben.', `4 · 25 = 100 und 5 · 2 = 10. Rechne 100 · 10 · ${a}.`), { nachweis: N('4 · 25', '5 · 2', '100 · 10', `1000 · ${a}`, `4 · 5 · ${a} · 25 · 2`) }); }
      const [b, k_] = [zz(5, 9), zz(12, 28)];
      return zahl(`Ein Regal hat ${b} Böden. Auf jedem Boden stehen ${k_} Kisten mit je 20 Dosen. Wie viele Dosen stehen im Regal? Rechne vorteilhaft.`, b * k_ * 20, fehlerliste(b * k_ * 20, [[k_ * 20, 'sach-schritt-vergessen'], [b * k_, 'sach-schritt-vergessen']]),
        h2('Nimm zuerst die beiden Zahlen mal, die eine glatte Zahl ergeben.', `${b} · 20 = ${b * 20}. Rechne dann ${b * 20} · ${k_}.`), { einheit: 'Dosen', nachweis: N(`${b} · 20`, `${b * 20} · ${k_}`, `${b} · ${k_} · 20`) });
    },
    3: () => { const a = suche(() => zz(13, 49), (x) => x % 10 !== 0), [k1, k2] = zweiKinder();
      return auswahl(`${k1} rechnet 25 · ${a} · 4 so: 25 · 4 = 100 und 100 · ${a} = ${fz(100 * a)}. ${k2} rechnet 25 · ${a} = ${25 * a} und ${25 * a} · 4 = ${fz(100 * a)}. Wer rechnet vorteilhafter?`, [
        opt(`${k1}. 25 · 4 = 100 ist leicht, und mal 100 hängt nur zwei Nullen an.`, true),
        opt(`${k2}. Man muss immer von links nach rechts rechnen, sonst wird es falsch.`),
        opt('Beide gleich. Das Ergebnis ist ja dasselbe.'),
        opt('Keiner. Beide Ergebnisse sind falsch.')],
      h2('Beide Ergebnisse stimmen. Welcher Weg hat die leichteren Schritte?', `Vergleiche 25 · 4 mit 25 · ${a}.`), { nachweis: N('25 · 4', `100 · ${a}`, `25 · ${a}`, `${25 * a} · 4`) }); },
  });

  stufen(RV('R2'), 'E', {
    1: () => { const a = suche(() => zz(13, 99), (x) => x % 10 !== 0);
      return zahl(`Rechne vorteilhaft: 8 · ${a} · 125`, 1000 * a, fehlerliste(1000 * a, [[100 * a, 'mal-stellenwert']]),
        h1('Welche zwei Faktoren ergeben zusammen eine Stufenzahl?'), { nachweis: N('8 · 125', `1000 · ${a}`, `8 · ${a} · 125`) }); },
    2: (k) => {
      if (k === 0) { const a = zz(2, 9);
        return zahl(`Rechne vorteilhaft: 4 · 125 · ${a} · 25 · 8`, 100000 * a, fehlerliste(100000 * a, [[10000 * a, 'mal-stellenwert']]),
          h1('Bilde Paare, die Stufenzahlen ergeben.'), { nachweis: N('4 · 25', '125 · 8', '100 · 1000', `100000 · ${a}`, `4 · 125 · ${a} · 25 · 8`) }); }
      if (k === 1) { const b = wahl([12, 16, 24, 28, 32]);
        return zahl(`Rechne vorteilhaft: 50 · ${b} · 25`, 50 * b * 25, fehlerliste(50 * b * 25, [[50 * b + 25, 'punkt-vor-strich']]),
          h1(`Zerlege ${b} geschickt, sodass Faktoren für 100 entstehen.`), { nachweis: N(`${b} : 4`, '25 · 4', `50 · ${b / 4}`, `100 · ${50 * b / 4}`, `50 · ${b} · 25`) }); }
      const [t, p] = [zz(2, 6), wahl([16, 24, 32, 40])];
      return zahl(`Ein Stadion hat ${t} Tribünen. Jede Tribüne hat 125 Reihen mit je ${p} Plätzen. Wie viele Plätze hat das Stadion? Rechne vorteilhaft.`, t * 125 * p, fehlerliste(t * 125 * p, [[125 * p, 'sach-schritt-vergessen']]),
        h1(`Zerlege ${p} so, dass eine 8 darin steckt.`), { einheit: 'Plätze', nachweis: N(`${p} : 8`, '125 · 8', `1000 · ${p / 8}`, `${1000 * p / 8} · ${t}`, `${t} · 125 · ${p}`) });
    },
    3: (k) => {
      if (k === 0) { const a = suche(() => zz(13, 99), (x) => x % 10 !== 0);
        return auswahl(`Warum darf man bei 25 · ${a} · 4 zuerst 25 · 4 rechnen?`, [
          opt(`Wegen des Vertauschungsgesetzes darf man ${a} und 4 tauschen. Wegen des Verbindungsgesetzes darf man dann 25 · 4 zuerst rechnen.`, true),
          opt('Weil man immer mit den kleinsten Zahlen anfängt.'),
          opt('Wegen des Verteilungsgesetzes darf man die Faktoren neu verteilen. Deshalb darf man die beiden passenden Zahlen zuerst malnehmen.', false, 'begriffe-verwechselt'),
          opt('Weil Punkt vor Strich gilt.', false, 'begriffe-verwechselt'),
          opt('Das darf man nicht. Man muss von links nach rechts rechnen.')],
        h1('Welche beiden Rechengesetze gelten für die Multiplikation?'), { nachweis: N('25 · 4', `100 · ${a}`, `25 · ${a} · 4`) }); }
      const [x, y] = wahl([[25, 4], [125, 8], [50, 2]]), a = suche(() => zz(13, 49), (z) => z % 10 !== 0), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Bei ${x} · ${a} · ${y} darf ich ${x} · ${y} zuerst rechnen.“ ${k2} sagt: „Bei ${x * a * y} : ${a} : ${y} darf ich auch ${a} : ${y} zuerst rechnen.“ Wer hat recht?`, [
        opt(`Nur ${k1}. Beim Multiplizieren gelten Vertauschungs- und Verbindungsgesetz, beim Dividieren nicht.`, true),
        opt(`Beide. Die Rechengesetze gelten für Mal und Geteilt, denn Geteilt ist die Umkehrung von Mal.`, false, 'gesetz-auf-division'),
        opt(`Nur ${k2}. Beim Dividieren darf man umstellen.`, false, 'gesetz-auf-division'),
        opt('Keiner. Man muss immer von links nach rechts rechnen.'),
        opt('Beide. Das Verbindungsgesetz gilt immer.', false, 'gesetz-auf-division')],
      h1('Die Rechengesetze gelten nicht für jede Rechenart.'), { nachweis: N(`${x} · ${y}`, `${x * y} · ${a}`, `${x} · ${a} · ${y}`, `${x * a * y} : ${a}`) }); },
  });
}
