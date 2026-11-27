// Aufgaben zu 5.4.5 „Dividieren“ (Lernziele D1 bis D6) nach ADR 0015.
//   F  Grundvorstellungen am Bild: aufteilen, verteilen, Rest legen, Probe mit der Mal-Aufgabe; kleines Einmaleins, nie schriftlich
//   G  ein Standardverfahren: schriftlich durch einstellige Zahlen, ohne Null im Ergebnis, Dividend bis 1000
//   M  mehrere Schritte, Nullen im Quotienten, zweistelliger Divisor, Rest deuten, Text in Rechnung übersetzen
//   E  Strukturen, Ziffernrätsel, Regeln aufstellen, Problemlösen; keine größeren Zahlen als M

import { sechs, stufen, zahl, auswahl, opt, luecken, sach, teil, zuordnen, Z, N, B, h1, h2, h3, zz, wahl, suche, fz, fehlerliste, kind, U, WERT, HILFSZAHL, UEBERFLUESSIG, GROESSTES } from '../werkzeug.mjs';

const D = (kurz) => `5.4.5-${kurz}`;
const einmaleins = (dMin = 2, dMax = 9, qMin = 2, qMax = 9) => { const d = zz(dMin, dMax), q = zz(qMin, qMax); return [d * q, d, q]; };
const ungleich = (...grenzen) => suche(() => einmaleins(...grenzen), ([, d, q]) => d !== q);
const mitRest = (dMin, dMax, qMin, qMax) => { const d = zz(dMin, dMax), q = zz(qMin, qMax), r = zz(1, d - 1); return [d * q + r, d, q, r]; };
const reihe = (d, bis) => Array.from({ length: bis }, (_, i) => `${i + 1} · ${d} = ${(i + 1) * d}`).join(', ');
const efehler = (q) => fehlerliste(q, [[q + 1, 'div-einmaleins'], [q - 1, 'div-einmaleins']]);
const hze = (a) => ({ h: Math.floor(a / 100), z: Math.floor(a / 10) % 10, e: a % 10 });
const ohneNull = (q) => !String(q).includes('0');
// Schriftlich auf G: einstelliger Divisor, Dividend 100 bis 1000, keine Null im Ergebnis.
const schriftlichG = (qMin = 12, qMax = 199) => suche(() => { const d = zz(2, 9), q = zz(qMin, qMax); return [d * q, d, q]; }, ([a, , q]) => a >= 100 && a <= 1000 && ohneNull(q));
const ablauf = (a, d) => {
  const s = String(a); let i = 1;
  while (Number(s.slice(0, i)) < d) i++;
  const p = Number(s.slice(0, i)), z = Math.floor(p / d);
  return `Beginne links. Wie oft passt die ${d} in die ${p}? ${z}-mal, denn ${z} · ${d} = ${z * d}. Rechne ${p} − ${z * d} = ${p - z * d}. Hole die nächste Ziffer herunter.`;
};
const mitNull = (q) => String(q).includes('0') && q % 10 !== 0;
const schriftlichM = () => suche(() => { const d = zz(3, 9), q = zz(102, 1909); return [d * q, d, q]; }, ([a, , q]) => mitNull(q) && a >= 1000 && a <= 9999);
const zweistelligM = () => suche(() => { const d = zz(12, 48), q = zz(104, 480); return [d * q, d, q]; }, ([a, d]) => d % 10 !== 0 && a <= 9999);
const restM = () => suche(() => mitRest(6, 24, 12, 48), ([a, d]) => a >= 100 && d % 10 !== 0);
const restE = (dMin, dMax) => suche(() => mitRest(dMin, dMax, 105, 480), ([a, d]) => d % 10 !== 0 && a <= 9999);

export function dividieren() {
  // ===================================================================
  // D1 Fachbegriffe. Jede Stufe fragt nur die Wörter ihres Wortspeichers ab.
  // ===================================================================
  sechs(D('D1'), 'F', [
    () => { const [a, d, q] = ungleich(2, 5, 2, 5);
      return auswahl(Z(`${a} : ${d}`, 'Wie liest du die Aufgabe?'), [opt(`${a} geteilt durch ${d}`, true), opt(`${a} mal ${d}`, false, 'begriffe-verwechselt'), opt(`${d} geteilt durch ${a}`, false, 'div-vertauscht')],
        h3('Das Zeichen : liest du „geteilt durch“.', '12 : 3 liest du: 12 geteilt durch 3.', `Die Zahl ${a} wird geteilt. Sie steht vorn.`), { bild: B.gruppen(q, d) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 5);
      return zahl(Z(`${a} : ${d} = ${q}`, 'Welche Zahl ist das Ergebnis?'), q, fehlerliste(q, [[a, 'begriffe-verwechselt'], [d, 'begriffe-verwechselt']]),
        h3('Das Ergebnis steht hinter dem Zeichen =.', '12 : 3 = 4. Das Ergebnis ist 4.', `Lies laut: ${a} geteilt durch ${d} ist gleich ${q}.`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 5);
      return auswahl(Z(`${a} geteilt durch ${d}`, 'Welche Aufgabe passt?'), [opt(`${a} : ${d}`, true), opt(`${d} : ${a}`, false, 'div-vertauscht'), opt(`${a} · ${d}`, false, 'begriffe-verwechselt')],
        h3('„Geteilt durch“ schreibst du mit dem Zeichen :.', '10 geteilt durch 2 schreibst du so: 10 : 2.', `Die Zahl ${a} wird geteilt. Sie steht vorn.`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 5);
      return zahl(Z(`Du hast ${a} Plättchen.`, `Immer ${d} Plättchen sind zusammen.`, 'Wie viele Gruppen sind es?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [d, 'begriffe-verwechselt']]),
        h3('Teilen heißt: gleich große Gruppen bilden.', a === 12 ? '10 Plättchen, immer 2 zusammen: Das sind 5 Gruppen. 10 : 2 = 5.' : '12 Plättchen, immer 3 zusammen: Das sind 4 Gruppen. 12 : 3 = 4.', 'Zähle im Bild die Gruppen.'), { einheit: 'Gruppen', bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 5);
      return auswahl(Z(`Die Mal-Aufgabe ist ${q} · ${d} = ${a}.`, 'Welche Geteilt-Aufgabe passt dazu?'), [opt(`${a} : ${d} = ${q}`, true), opt(`${d} : ${a} = ${q}`, false, 'div-vertauscht'), opt(`${q} : ${d} = ${a}`, false, 'div-vertauscht')],
        h3('Mal und geteilt gehören zusammen. Bei geteilt steht die größte Zahl vorn.', '3 · 5 = 15. Dazu passt 15 : 5 = 3.', `Die größte Zahl ist ${a}. Sie steht vorn.`), { bild: B.feld(q, d), nachweis: [{ art: 'gleichungen' }, ...N(`${q} · ${d}`, `${a} : ${d}`)] }); },
    () => { const [a, d, q] = ungleich(2, 4, 2, 5);
      return zahl(Z(`${a} Bonbons sind für ${d} Kinder.`, 'Jedes Kind bekommt gleich viele.', 'Wie viele Bonbons bekommt 1 Kind?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart']]),
        h3('Teilen heißt auch: gerecht verteilen.', '6 Bonbons für 2 Kinder: 6 : 2 = 3. Jedes Kind bekommt 3.', `Im Bild hat jedes Kind eine Gruppe. Zähle 1 Gruppe.`), { einheit: 'Bonbons', bild: B.gruppen(d, q), nachweis: N(`${a} : ${d}`) }); },
  ]);

  stufen(D('D1'), 'G', {
    1: (k) => {
      const [a, d, q] = ungleich(3, 9, 3, 9);
      const hilfen = h3('Das Ergebnis einer Geteilt-Aufgabe heißt Quotient.', '20 : 4 = 5. Der Quotient ist 5.', `Du rechnest ${a} : ${d}. Das Ergebnis ist der Quotient.`);
      if (k === 0) { const [gesucht, name] = wahl([[a, 'Dividend'], [d, 'Divisor']]);
        return auswahl(Z(`${a} : ${d} = ${q}`, `Wie heißt die Zahl ${gesucht}?`), ['Dividend', 'Divisor', 'Quotient'].map((n) => opt(n, n === name, n === name ? undefined : 'begriffe-verwechselt')),
          h3('Der Dividend wird geteilt. Der Divisor teilt. Der Quotient ist das Ergebnis.', '20 : 4 = 5. Der Dividend ist 20. Der Divisor ist 4.', `Die Zahl ${a} wird geteilt. Durch die Zahl ${d} wird geteilt.`), { nachweis: N(`${a} : ${d}`) }); }
      if (k === 1) return zahl(Z('Berechne den Quotienten.', `${a} : ${d}`), q, efehler(q), hilfen, { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`) });
      return luecken(Z(`${a} : ${d} = ${q}`, 'Der Quotient ist {{x}}.'), { x: [q, fehlerliste(q, [[a, 'begriffe-verwechselt'], [d, 'begriffe-verwechselt']])] }, hilfen, { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`) });
    },
    2: (k) => {
      if (k === 0) {
        const [a, d, q] = suche(() => einmaleins(3, 9, 3, 9), ([x, y, w]) => x - y !== w && y !== w);
        const [b, e] = suche(() => einmaleins(3, 9, 3, 9), ([x, y, w]) => w !== q && `${x} : ${y}` !== `${a} : ${d}`);
        return auswahl(Z(`Der Quotient ist ${q}.`, 'Welche Aufgabe passt?'), [opt(`${a} : ${d}`, true), opt(`${a} − ${d}`, false, 'begriffe-verwechselt'), opt(`${b} : ${e}`, false, 'div-einmaleins')],
          h3('Der Quotient ist das Ergebnis einer Geteilt-Aufgabe. Rechne die Geteilt-Aufgaben aus.', 'Der Quotient ist 4. Dazu passt 12 : 3, denn 12 : 3 = 4.', `Suche die Geteilt-Aufgabe mit dem Ergebnis ${q}.`), { nachweis: [WERT(q), ...N(`${a} : ${d}`)] });
      }
      const [a, d] = suche(() => einmaleins(2, 6, 2, 9), ([x, y]) => x !== y * 2);
      return zuordnen('Ordne jedem Ergebnis den richtigen Namen zu.', [[`${a} + ${d}`, 'Summe'], [`${a} − ${d}`, 'Differenz'], [`${a} · ${d}`, 'Produkt'], [`${a} : ${d}`, 'Quotient']],
        h3('Schau in den Wortspeicher: Zu jeder Rechenart gehört ein Name für das Ergebnis.', 'Bei 8 + 2 heißt das Ergebnis Summe. Bei 8 : 2 heißt es Quotient.', 'Plus gehört zu Summe. Geteilt gehört zu Quotient.'));
    },
    3: () => { const a = zz(6, 9), k = kind();
      return auswahl(Z(`${k} sagt:`, '„Der Quotient ist immer kleiner als die erste Zahl.“', `Prüfe mit ${a} : 1.`, 'Stimmt das?'),
        [opt(`Falsch. ${a} : 1 = ${a}. Der Quotient ist hier genauso groß.`, true), opt('Stimmt. Beim Teilen wird jede Zahl immer kleiner.'), opt(`Stimmt. ${a} : 1 = ${a - 1}.`, false, 'div-einmaleins')],
        h3('Rechne die Aufgabe aus. Vergleiche das Ergebnis mit der ersten Zahl.', '5 : 1 = 5. 5 Äpfel für 1 Kind: Das Kind bekommt alle 5.', `Rechne ${a} : 1. Wie viel bekommt 1 Kind allein?`), { bild: B.gruppen(1, a), nachweis: [U(false), ...N(`${a} : 1`)] }); },
  });

  stufen(D('D1'), 'M', {
    1: (k) => {
      const [d, q] = suche(() => [zz(6, 14), zz(6, 14)], ([x, y]) => x !== y && x !== 10 && y !== 10), a = d * q;
      if (k === 0) { const [gesucht, name] = wahl([[a, 'Dividend'], [d, 'Divisor'], [q, 'Quotient']]);
        return auswahl(`In der Aufgabe ${a} : ${d} = ${q}: Wie heißt die Zahl ${gesucht}?`, ['Dividend', 'Divisor', 'Quotient', 'Subtrahend'].map((n) => opt(n, n === name, n === name ? undefined : 'begriffe-verwechselt')),
          h2('Der Dividend wird geteilt, der Divisor teilt, der Quotient ist das Ergebnis.', `Die Zahl ${a} wird geteilt. Sie ist der Dividend.`), { nachweis: N(`${a} : ${d}`) }); }
      return zahl(`Der Dividend ist ${a}, der Divisor ist ${d}. Berechne den Quotienten.`, q, fehlerliste(q, [[a - d, 'begriffe-verwechselt'], [a * d, 'begriffe-verwechselt']]), h2('Dividend : Divisor = Quotient.', `Rechne ${a} : ${d}.`), { nachweis: N(`${a} : ${d}`) });
    },
    2: (k) => {
      const d = zz(6, 12), q = suche(() => zz(11, 25), (x) => x % 10 !== 0), a = d * q;
      if (k === 0) return zahl(`Der Quotient ist ${q}, der Divisor ist ${d}. Wie groß ist der Dividend?`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]), h2('Die Umkehraufgabe hilft: Quotient · Divisor = Dividend.', `Rechne ${q} · ${d}.`), { nachweis: N(`${q} · ${d}`) });
      if (k === 1) return zahl(`Der Dividend ist ${a}, der Quotient ist ${q}. Wie groß ist der Divisor?`, d, fehlerliste(d, [[a - q, 'begriffe-verwechselt']]), h2('Dividend : Quotient = Divisor.', `Rechne ${a} : ${q}.`), { nachweis: N(`${a} : ${q}`) });
      const t = zz(6, 9), e = zz(8, 15), x = suche(() => zz(20, t * e - 20), (v) => v !== t * e - v);
      return zahl(`Dividiere die Summe von ${x} und ${t * e - x} durch ${t}.`, e, [], h2('Berechne zuerst die Summe. Sie ist der Dividend.', `Die Summe ist ${x} + ${t * e - x} = ${t * e}.`), { nachweis: N(`${x} + ${t * e - x}`, `(${x} + ${t * e - x}) : ${t}`) });
    },
    3: () => {
      const [frage, richtig, falsch, bsp] = wahl([
        ['Der Dividend wird verdoppelt, der Divisor bleibt gleich.', 'Er verdoppelt sich.', ['Er halbiert sich.', 'Er bleibt gleich.', 'Er wird um 2 größer.'], ['24 : 4', '48 : 4']],
        ['Der Divisor wird verdoppelt, der Dividend bleibt gleich.', 'Er halbiert sich.', ['Er verdoppelt sich.', 'Er bleibt gleich.', 'Er wird um 2 kleiner.'], ['24 : 4', '24 : 8']],
      ]);
      return auswahl(`${frage} Was passiert mit dem Quotienten? Prüfe an einem eigenen Beispiel.`, [opt(richtig, true), ...falsch.map((f) => opt(f))],
        h2('Probiere es mit kleinen Zahlen aus, zum Beispiel mit 24 : 4.', 'Rechne 24 : 4 und dann die veränderte Aufgabe. Vergleiche die beiden Quotienten.'), { nachweis: N(...bsp) });
    },
  });

  stufen(D('D1'), 'E', {
    1: () => { const x = zz(3, 6), y = suche(() => zz(3, 6), (v) => v !== x), q = zz(11, 19);
      return zahl(`Berechne den Wert des Quotienten aus ${q * x * y} und dem Produkt von ${x} und ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen'], [q * x, 'sach-schritt-vergessen']]),
        h1('Was ist hier der Divisor: eine Zahl oder ein Term?'), { nachweis: N(`${x} · ${y}`, `${q * x * y} : ${x * y}`) }); },
    2: (k) => {
      if (k === 0) { const d = zz(11, 19), q = zz(12, 35), r = zz(2, d - 1);
        return zahl(`Der Divisor ist ${d}, der Quotient ${q} und der Rest ${r}. Bestimme den Dividenden.`, d * q + r, fehlerliste(d * q + r, [[d * q, 'div-rest-vergessen']]), h1('Wie lautet die Probe bei einer Division mit Rest?'), { nachweis: N(`${q} · ${d} + ${r}`) }); }
      if (k === 1) { const q = zz(12, 28);
        const [was, loesung, bsp] = wahl([['Dividend und Divisor werden beide verdoppelt.', q, ['24 : 4', '2 · 24', '2 · 4', '48 : 8', `${q} · 1`]], ['Der Dividend wird vervierfacht, der Divisor verdoppelt.', 2 * q, ['24 : 4', '4 · 24', '2 · 4', '96 : 8', '12 : 6', `2 · ${q}`]]]);
        return zahl(`Ein Quotient hat den Wert ${q}. ${was} Welchen Wert hat der neue Quotient?`, loesung, fehlerliste(loesung, [[2 * q, 'div-stellenwert'], [4 * q, 'div-stellenwert'], [q / 2, 'div-stellenwert'], [q, 'div-stellenwert']]),
          h1('Was passiert bei 24 : 4, wenn du beide Zahlen in gleicher Weise veränderst?'), { nachweis: [{ zahl: 24, grund: 'Beispiel für den Dividenden' }, ...N(...bsp)] }); }
      const d = zz(8, 15), q = zz(3, 7);
      return zahl(`Die Summe aus Dividend und Divisor ist ${d * (q + 1)}. Der Quotient ist ${q}. Wie groß ist der Dividend?`, d * q, fehlerliste(d * q, [[d, 'begriffe-verwechselt']]),
        h1(`Der Dividend ist das ${q}-Fache des Divisors. Wie viele gleich große Teile stecken dann in der Summe?`), { nachweis: N(`${q} + 1`, `${d * (q + 1)} : ${q + 1}`, `${q} · ${d}`, `${d * q} + ${d}`, `${d * q} : ${d}`) });
    },
    3: (k) => {
      if (k === 0) return auswahl('Welche Aussage gilt für jede Division natürlicher Zahlen, die ohne Rest aufgeht (Divisor nicht 0)?',
        [opt('Quotient · Divisor = Dividend', true), opt('Der Quotient ist immer kleiner als der Dividend.'), opt('Dividend und Divisor darf man vertauschen.', false, 'div-vertauscht'), opt('Der Quotient ist immer größer als der Divisor.'), opt('Der Quotient ist immer kleiner als der Divisor.')],
        h1('Suche zu jeder Aussage ein Gegenbeispiel. Denke auch an den Divisor 1.'), { nachweis: N(HILFSZAHL(0, 'durch 0 wird nicht geteilt'), '6 : 1', '6 · 1', '12 : 6', '12 : 2') });
      const d = zz(3, 6), q = zz(3, 7);
      return auswahl(`${d * q} : ${d} = ${q}, ${2 * d * q} : ${2 * d} = ${q} und ${3 * d * q} : ${3 * d} = ${q}. Stelle eine Regel auf.`, [
        opt('Werden Dividend und Divisor mit derselben Zahl multipliziert, bleibt der Wert des Quotienten gleich.', true), opt('Werden Dividend und Divisor mit derselben Zahl multipliziert, wird auch der Wert des Quotienten mit dieser Zahl multipliziert.'),
        opt('Wird zu Dividend und Divisor dieselbe Zahl addiert, bleibt der Wert des Quotienten gleich.'), opt('Der Wert des Quotienten bleibt gleich, wenn nur der Dividend größer wird.'), opt('Es gibt keine Regel. Die drei Ergebnisse sind zufällig gleich.')],
      h1('Vergleiche die zweite und dritte Aufgabe mit der ersten: Wie haben sich Dividend und Divisor verändert?'), { nachweis: N(`${d * q} : ${d}`, `${2 * d * q} : ${2 * d}`, `${3 * d * q} : ${3 * d}`, `2 · ${d * q}`, `2 · ${d}`, `3 · ${d * q}`, `3 · ${d}`) });
    },
  });

  // ===================================================================
  // D2 Dividieren durch einstellige Zahlen
  // ===================================================================
  sechs(D('D2'), 'F', [
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return zahl(Z('Rechne.', `${a} : ${d}`), q, efehler(q),
        h3(`Lege immer ${d} zusammen. Zähle die Gruppen.`, `12 : 3: Die 3er-Reihe hilft: ${reihe(3, 4)}. Also 12 : 3 = 4.`, `Zähle im Bild die Gruppen mit je ${d} Plättchen.`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(3, 6, 3, 6);
      return luecken(Z(`${q} · ${d} = ${a}`, `${a} : ${d} = {{x}}`), { x: [q, fehlerliste(q, [[d, 'div-vertauscht'], [q + 1, 'div-einmaleins']])] },
        h3('Die Mal-Aufgabe hilft dir beim Teilen.', a === 12 ? '5 · 2 = 10. Also ist 10 : 2 = 5.' : '4 · 3 = 12. Also ist 12 : 3 = 4.', `Welche Zahl mal ${d} ergibt ${a}? Schau auf die Mal-Aufgabe.`), { bild: B.feld(q, d), nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); },
    () => { const [a, d, q] = suche(() => einmaleins(2, 5, 3, 6), ([x, y, w]) => y !== w && x - y !== w && x - y !== w + 1);
      return auswahl(Z(`${a} : ${d}`, 'Welches Ergebnis stimmt?'), [opt(String(q), true), opt(String(q + 1), false, 'div-einmaleins'), opt(String(a - d), false, 'div-falsche-rechenart')],
        h3('Prüfe mit der Mal-Aufgabe.', '15 : 3 = 5, denn 5 · 3 = 15.', `Im Bild sind ${d} Punkte in 1 Reihe. Zähle die Reihen.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const [d, e] = suche(() => [zz(2, 4), zz(2, 4)], ([x, y]) => x * y <= 9 && x !== y), a = d * (10 + e);
      return luecken(Z(`Rechne ${a} : ${d} in 2 Schritten.`, `${d * 10} : ${d} = {{x}}`, `${d * e} : ${d} = {{y}}`, 'Zusammen: {{z}}'), { x: [10, fehlerliste(10, [[1, 'div-stellenwert']])], y: e, z: 10 + e },
        h3(`Die Zahl ${a} ist aufgeteilt in ${d * 10} und ${d * e}. Teile beide einzeln.`, '26 : 2: 20 : 2 = 10 und 6 : 2 = 3. Zusammen 13.', `${d * 10} sind ${d} Zehner. ${d} Zehner geteilt durch ${d} ist 1 Zehner.`), { bild: B.material({ z: d, e: d * e }), nachweis: N(`${d * 10} : ${d}`, `${d * e} : ${d}`, `10 + ${e}`, `${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return zahl(Z('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 2 = 5. Rechne 5 · 2 = 10. Die Zahl ist 10.', `Im Bild sind ${q} Gruppen mit je ${d} Plättchen. Zähle alle Plättchen.`), { bild: B.gruppen(q, d), nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); },
    () => { const [e, w] = suche(() => [zz(2, 4), zz(2, 4)], ([x, y]) => x !== y);
      return zahl(Z(`${e * w} : ${e} = ${w}`, `Wie viel ist ${e * w * 10} : ${e}?`), w * 10, fehlerliste(w * 10, [[w, 'div-stellenwert'], [w * 100, 'div-stellenwert']]),
        h3(`${e * w * 10} sind ${e * w} Zehner. Teile die Zehner.`, '6 : 2 = 3. Dann ist 60 : 2 = 30. Aus 3 Einern werden 3 Zehner.', `${e * w} Zehner geteilt durch ${e} sind ${w} Zehner.`), { bild: B.material({ z: e * w }), nachweis: N(`${e * w} : ${e}`, `${e * w * 10} : ${e}`) }); },
  ]);

  stufen(D('D2'), 'G', {
    1: (k) => {
      if (k === 1) { const [d, z, e] = suche(() => [zz(3, 8), zz(1, 9), zz(2, 9)], ([x, y, w]) => x * (y * 10 + w) <= 999), a = d * (z * 10 + e);
        return luecken(Z(`Rechne ${a} : ${d} in 2 Schritten.`, `${d * z * 10} : ${d} = {{zehner}}`, `${d * e} : ${d} = {{einer}}`, 'Zusammen: {{ergebnis}}'), { zehner: [z * 10, fehlerliste(z * 10, [[z, 'div-stellenwert']])], einer: e, ergebnis: z * 10 + e },
          h3(`Die Zahl ${a} ist aufgeteilt in ${d * z * 10} und ${d * e}. Teile beide Zahlen einzeln.`, '138 : 6: 120 : 6 = 20 und 18 : 6 = 3. Zusammen 20 + 3 = 23.', `${d * z} : ${d} = ${z}. Also ist ${d * z * 10} : ${d} = ${z * 10}.`), { bild: B.material(hze(a)), nachweis: N(`${d * z * 10} : ${d}`, `${d * e} : ${d}`, `${z * 10} + ${e}`, `${a} : ${d}`) }); }
      const [a, d, q] = k === 0 ? schriftlichG(12, 99) : schriftlichG(111, 199);
      return zahl(Z('Dividiere schriftlich.', `${a} : ${d}`), q, fehlerliste(q, [[q * 10, 'div-stellenwert']]),
        h3('Rechne der Reihe nach: teilen, malnehmen, abziehen, nächste Ziffer herunterholen.', '138 : 6: Die 6 passt 2-mal in die 13. 2 · 6 = 12. 13 − 12 = 1. Hole die 8 herunter: 18 : 6 = 3. Ergebnis 23.', ablauf(a, d)), { bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, d, q] = schriftlichG(12, 99);
        return zahl(Z('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
          h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 4 = 21. Rechne 21 · 4 = 84.', `Rechne ${q} · ${d}. Rechne erst ${q - (q % 10)} · ${d}, dann ${q % 10} · ${d}.`), { nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); }
      const [x, y] = wahl([[2, 4], [3, 6], [4, 8], [2, 6], [3, 9]]), n = zz(4, 11) * x * y;
      return auswahl(Z('Welche Aufgabe hat das größere Ergebnis?', 'Überlege zuerst.', 'Rechne dann nach.'), [opt(`${n} : ${x}`, true), opt(`${n} : ${y}`), opt('Beide Ergebnisse sind gleich.')],
        h3('Stell dir vor: Die gleiche Menge wird an wenige oder an viele Kinder verteilt.', '12 : 2 = 6 und 12 : 4 = 3. Bei weniger Kindern bekommt jedes Kind mehr.', `${n} wird einmal durch ${x} geteilt und einmal durch ${y}. Wann bekommt jeder mehr?`), { nachweis: N(GROESSTES, `${n} : ${x}`, `${n} : ${y}`) });
    },
    3: () => { const [a, d, q] = schriftlichG(12, 89), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} : ${d} = ${q + 10}.`, 'Prüfe mit der Mal-Aufgabe.', 'Stimmt das?'),
        [opt(`Falsch. ${q + 10} · ${d} = ${(q + 10) * d}. Richtig ist ${q}.`, true), opt(`Stimmt. ${q + 10} · ${d} = ${a}.`, false, 'div-einmaleins'), opt(`Falsch. Richtig ist ${q + 20}.`, false, 'div-einmaleins')],
        h3('Die Mal-Aufgabe prüft die Geteilt-Aufgabe: Ergebnis mal zweite Zahl.', '96 : 4 = 34? Prüfe: 34 · 4 = 136. Das ist nicht 96. Richtig ist 24.', `Rechne ${q + 10} · ${d}. Kommt ${a} heraus?`), { nachweis: N(U(false, `${a} : ${d}`, q + 10), `${q + 10} · ${d}`, `${a} : ${d}`) }); },
  });

  stufen(D('D2'), 'M', {
    1: () => { const [a, d, q] = schriftlichM();
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]),
        h2('Passt der Divisor einmal nicht hinein, gehört an diese Stelle eine 0 in den Quotienten.', ablauf(a, d)), { nachweis: N(`${a} : ${d}`) }); },
    2: (k) => {
      if (k === 0) { const [a, d, q] = schriftlichM();
        return zahl(`Bestimme den fehlenden Dividenden: ▢ : ${d} = ${fz(q)}`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]), h2('Die Umkehraufgabe der Division ist die Multiplikation.', `Rechne ${fz(q)} · ${d}.`), { nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); }
      if (k === 1) { const [x, y, q] = suche(() => [zz(4, 8), zz(3, 9), zz(52, 148)], ([u, v, w]) => u !== v && u * v * w <= 9999);
        return zahl(`Dividiere ${fz(q * x * y)} zuerst durch ${x}. Dividiere das Ergebnis dann durch ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen']]),
          h2('Rechne zwei Divisionen nacheinander. Das erste Ergebnis ist der neue Dividend.', `Erster Schritt: ${fz(q * x * y)} : ${x} = ${fz(q * y)}.`), { nachweis: N(`${q * x * y} : ${x}`, `${q * y} : ${y}`) }); }
      const [x, y, kgv] = wahl([[4, 8, 8], [3, 6, 6], [6, 9, 18], [2, 8, 8]]), n = zz(40, 110) * kgv;
      return zahl(`Um wie viel ist ${fz(n)} : ${x} größer als ${fz(n)} : ${y}?`, n / x - n / y, fehlerliste(n / x - n / y, [[n / x, 'sach-schritt-vergessen'], [n / y, 'sach-schritt-vergessen']]),
        h2('Berechne beide Quotienten und bilde dann die Differenz.', `Erster Quotient: ${fz(n)} : ${x} = ${fz(n / x)}.`), { nachweis: N(`${n} : ${x}`, `${n} : ${y}`, `${n / x} − ${n / y}`) });
    },
    3: () => { const d = zz(4, 9), h = zz(3, 9), e = zz(2, 9), q = h * 100 + e, a = q * d, k = kind();
      return auswahl(`${k} erhält bei ${fz(a)} : ${d} das Ergebnis ${h * 10 + e}. Prüfe mit einem Überschlag und entscheide.`,
        [opt(`Falsch: ${h * 100 * d} : ${d} = ${h * 100}, der Quotient muss dreistellig sein. Richtig ist ${q}.`, true), opt(`Richtig: ${h * 10 + e} · ${d} = ${fz(a)}.`, false, 'div-null-vergessen'), opt('Falsch: Der Quotient muss vierstellig sein.', false, 'div-stellenwert'), opt('Richtig: Der Überschlag bestätigt ein zweistelliges Ergebnis.', false, 'div-stellenwert')],
        h2('Runde den Dividenden so, dass du im Kopf teilen kannst. Wie viele Stellen hat der Quotient dann?', `Überschlage mit ${h * 100 * d} : ${d}.`), { nachweis: N(U(false, `${a} : ${d}`, h * 10 + e), `${h * 100 * d} : ${d}`, `${a} : ${d}`, `${h * 10 + e} · ${d}`) }); },
  });

  const ziffernraetsel = () => suche(() => {
    const d = zz(6, 9), h = zz(2, 9), e = zz(1, 9);
    return { d, h, e, passend: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((m) => (h * 100 + m * 10 + e) % d === 0) };
  }, (x) => x.passend.length >= 1);
  const alleAus = ([a, b, c]) => [[a, b, c], [a, c, b], [b, a, c], [b, c, a], [c, a, b], [c, b, a]].map(([x, y, w]) => x * 100 + y * 10 + w);
  stufen(D('D2'), 'E', {
    1: () => { const [a, d, q] = suche(() => { const x = zz(6, 9), y = zz(102, 1609); return [x * y, x, y]; }, ([x, , y]) => mitNull(y) && x >= 1000 && x <= 9999);
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]), h1('Wie viele Stellen muss der Quotient nach einem Überschlag haben?'), { nachweis: N(`${a} : ${d}`) }); },
    2: (k) => {
      if (k === 0) { const r = suche(ziffernraetsel, (x) => x.passend.length === 1);
        return zahl(`Bei einer Division wurde gekleckert: ${r.h}▢${r.e} : ${r.d}. Welche Ziffer muss in der Lücke stehen, damit die Division ohne Rest aufgeht?`, r.passend[0], [],
          h1(`Welche Vielfachen von ${r.d} liegen zwischen ${r.h}00 und ${r.h}99 und enden auf ${r.e}?`), { nachweis: [{ art: 'ziffernTeilbar', muster: `${r.h}▢${r.e}`, durch: r.d, ziffern: r.passend }] }); }
      if (k === 1) { const r = suche(ziffernraetsel, (x) => x.passend.length >= 2);
        return zahl(`Die Zahl ${r.h}▢${r.e} soll ohne Rest durch ${r.d} teilbar sein. Wie viele verschiedene Ziffern kommen für die Lücke in Frage?`, r.passend.length, fehlerliste(r.passend.length, [[1, 'teilbar-summe']]),
          h1(`Wenn du eine passende Zahl gefunden hast: Um wie viel musst du sie verändern, damit sie wieder durch ${r.d} teilbar ist und die Einerziffer gleich bleibt?`), { nachweis: [{ art: 'ziffernTeilbar', muster: `${r.h}▢${r.e}`, durch: r.d, ziffern: r.passend, anzahl: r.passend.length }] }); }
      const d = zz(6, 9);
      const [text, loesung, grenze] = wahl([[`Bestimme die kleinste vierstellige Zahl, die ohne Rest durch ${d} teilbar ist.`, Math.ceil(1000 / d) * d, 1000], [`Bestimme die größte dreistellige Zahl, die ohne Rest durch ${d} teilbar ist.`, Math.floor(999 / d) * d, 999]]);
      return zahl(text, loesung, [], h1('Welchen Rest lässt die Grenze selbst, also 1000 oder 999?'), { nachweis: [{ art: 'grenzVielfaches', durch: d, grenze, zahl: loesung }, ...N(`${loesung} : ${d}`)] });
    },
    3: (k) => {
      if (k === 0) { const d = zz(6, 9), m = zz(3, 5) * d, n = kind();
        return auswahl(`${n} behauptet: „Wenn ich zu einer Zahl, die ohne Rest durch ${d} teilbar ist, die Zahl ${m} addiere, ist das Ergebnis wieder ohne Rest durch ${d} teilbar.“ Beurteile, ohne eine bestimmte Zahl auszurechnen.`,
          [opt(`Stimmt immer, weil ${m} = ${m / d} · ${d} selbst ein Vielfaches von ${d} ist.`, true), opt('Stimmt nur manchmal: Es hängt von der Ausgangszahl ab.', false, 'teilbar-summe'), opt('Stimmt nie: Durch das Addieren entsteht ein Rest.', false, 'teilbar-summe'), opt(`Stimmt immer, weil jede Zahl plus ${m} durch ${d} teilbar ist.`, false, 'teilbar-summe')],
          h1(`Stell dir ${d}er-Päckchen vor. Was geschieht, wenn du weitere volle Päckchen dazulegst?`), { nachweis: [U(true), ...N(`${m / d} · ${d}`)] }); }
      const [ziffern, durch, anzahl] = suche(() => { const z = suche(() => [zz(1, 9), zz(1, 9), zz(1, 9)], (x) => new Set(x).size === 3).sort((p, q) => p - q), t = wahl([4, 6, 8]); return [z, t, alleAus(z).filter((x) => x % t === 0).length]; }, ([, , n]) => n >= 1 && n <= 4);
      return zahl(`Aus den Ziffern ${ziffern[0]}, ${ziffern[1]} und ${ziffern[2]} werden alle dreistelligen Zahlen gebildet, in denen jede Ziffer genau einmal vorkommt. Wie viele dieser Zahlen sind ohne Rest durch ${durch} teilbar?`, anzahl, fehlerliste(anzahl, [[6, 'sach-schritt-vergessen']]),
        h1('Schreibe alle sechs Zahlen geordnet auf und prüfe jede einzeln.'), { nachweis: [{ art: 'ziffernZahlen', ziffern, durch, anzahl }] });
    },
  });

  // ===================================================================
  // D3 Dividieren durch zweistellige Zahlen
  // F: durch 10. G: durch Zehnerzahlen, ohne Rest. M: schriftlich. E: Strukturen.
  // ===================================================================
  sechs(D('D3'), 'F', [
    () => { const q = zz(2, 9), a = q * 10;
      return zahl(Z('Rechne.', `${a} : 10`), q, fehlerliste(q, [[a, 'div-stellenwert'], [q * 100, 'div-stellenwert']]),
        h3('Geteilt durch 10 fragt: Wie viele Zehner sind es?', q === 7 ? '90 : 10 = 9. In 90 stecken 9 Zehner.' : '70 : 10 = 7. In 70 stecken 7 Zehner.', `Zähle im Bild die Zehner.`), { bild: B.material({ z: q }), nachweis: N(`${a} : 10`) }); },
    () => { const q = zz(2, 5), ding = wahl(['Sticker', 'Murmeln', 'Karten']);
      return zahl(Z(`10 Kinder teilen ${q * 10} ${ding} gerecht.`, `Wie viele ${ding} bekommt 1 Kind?`), q, fehlerliste(q, [[q * 10 - 10, 'div-falsche-rechenart']]),
        h3('Gerecht teilen heißt: Jedes Kind bekommt gleich viele.', q === 3 ? '10 Kinder teilen 40 Sticker. 40 : 10 = 4. Jedes Kind bekommt 4.' : '10 Kinder teilen 30 Sticker. 30 : 10 = 3. Jedes Kind bekommt 3.', `Rechne ${q * 10} : 10. Zähle im Bild 1 Gruppe.`), { einheit: ding, bild: B.gruppen(10, q), nachweis: N(`${q * 10} : 10`) }); },
    () => { const q = zz(2, 9), a = q * 10;
      return luecken(Z(`${a} sind {{x}} Zehner.`, `${a} : 10 = {{y}}`), { x: q, y: [q, fehlerliste(q, [[a, 'div-stellenwert']])] },
        h3('Zähle die Zehner. So viele sind das Ergebnis.', '40 sind 4 Zehner. 40 : 10 = 4.', 'Zähle im Bild die Zehner.'), { bild: B.material({ z: q }), nachweis: N(`${q} · 10`, `${a} : 10`) }); },
    () => { const q = zz(2, 9), a = q * 10;
      return auswahl(Z(`${a} : 10`, 'Welches Ergebnis stimmt?'), [opt(String(q), true), opt(String(a), false, 'div-stellenwert'), opt(String(q * 100), false, 'div-stellenwert')],
        h3('Geteilt durch 10: Die Zahl wird kleiner.', q === 6 ? '80 : 10 = 8. In 80 stecken 8 Zehner.' : '60 : 10 = 6. In 60 stecken 6 Zehner.', `Zähle im Bild die Zehner.`), { bild: B.material({ z: q }), nachweis: N(`${a} : 10`) }); },
    () => { const q = zz(2, 9);
      return zahl(Z(`${q * 10} : 10 = ${q}`, `Wie viel ist ${q * 100} : 10?`), q * 10, fehlerliste(q * 10, [[q, 'div-stellenwert'], [q * 100, 'div-stellenwert']]),
        h3('1 Hunderter sind 10 Zehner.', q === 5 ? '30 : 10 = 3. Dann ist 300 : 10 = 30.' : '50 : 10 = 5. Dann ist 500 : 10 = 50.', `${q} Hunderter sind ${q * 10} Zehner. Das ist das Ergebnis.`), { bild: B.material({ h: q }), nachweis: N(`${q * 10} : 10`, `${q * 100} : 10`) }); },
    () => { const q = zz(2, 9);
      return zahl(Z('Welche Zahl fehlt?', `▢ : 10 = ${q}`), q * 10, fehlerliste(q * 10, [[q, 'div-stellenwert'], [q + 10, 'div-falsche-rechenart']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', q === 4 ? '▢ : 10 = 7. Rechne 7 · 10 = 70.' : '▢ : 10 = 4. Rechne 4 · 10 = 40.', `Im Bild siehst du ${q} Zehner. Wie heißt die Zahl?`), { bild: B.material({ z: q }), nachweis: N(`${q} · 10`, `${q * 10} : 10`) }); },
  ]);

  const zehnerG = (max = 1000) => suche(() => { const d = zz(2, 9) * 10, q = zz(2, 30); return [d * q, d, q]; }, ([a, , q]) => a <= max && q % 10 !== 0);
  stufen(D('D3'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d, q] = zehnerG(200);
        return zahl(Z('Rechne.', `${a} : ${d}`), q, fehlerliste(q, [[q * 10, 'div-stellenwert']]),
          h3(`Teile erst durch 10. Teile dann durch ${d / 10}.`, '180 : 20: 180 : 10 = 18. Dann 18 : 2 = 9.', `${a} : 10 = ${a / 10}. Rechne jetzt ${a / 10} : ${d / 10}.`), { bild: B.material({ z: a / 10 }), nachweis: N(`${a} : 10`, `${a / 10} : ${d / 10}`, `${a} : ${d}`) }); }
      const [a, d, q] = zehnerG();
      if (k === 1) return luecken(Z(`Rechne ${a} : ${d} in 2 Schritten.`, `${a} : 10 = {{erst}}`, `Dann geteilt durch ${d / 10}: {{dann}}`), { erst: a / 10, dann: [q, fehlerliste(q, [[q * 10, 'div-stellenwert']])] },
        h3(`Durch ${d} teilen heißt: erst durch 10, dann durch ${d / 10}.`, '240 : 30: 240 : 10 = 24. Dann 24 : 3 = 8.', `${a} : 10 = ${a / 10}. Bei geteilt durch 10 fällt die letzte Null weg.`), { bild: B.material(hze(a)), nachweis: N(`${a} : 10`, `${a / 10} : ${d / 10}`, `${a} : ${d}`) });
      return zahl(Z(`${a} : 10 = ${a / 10}`, `Wie viel ist ${a} : ${d}?`), q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [a / 10, 'sach-schritt-vergessen']]),
        h3(`Durch ${d} teilen heißt: erst durch 10, dann durch ${d / 10}.`, '240 : 10 = 24. Dann ist 240 : 30 = 24 : 3 = 8.', `Rechne ${a / 10} : ${d / 10}.`), { nachweis: N(`${a} : 10`, `${a / 10} : ${d / 10}`, `${a} : ${d}`) });
    },
    2: (k) => {
      const [a, d, q] = zehnerG();
      if (k === 0) return zahl(Z('Welche Zahl fehlt?', `▢ : ${d} = ${q}`), a, fehlerliste(a, [[q * d / 10, 'div-stellenwert']]),
        h3('Rechne rückwärts mit einer Mal-Aufgabe.', '▢ : 20 = 6. Rechne 6 · 20 = 120.', `Rechne ${q} · ${d}. Rechne erst ${q} · ${d / 10}, hänge dann eine 0 an.`), { nachweis: N(`${q} · ${d}`, `${a} : ${d}`) });
      return zahl(Z(`${d} Kinder zahlen zusammen ${a} € für einen Ausflug.`, 'Alle zahlen gleich viel.', 'Wie viel Euro zahlt 1 Kind?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q * 10, 'div-stellenwert']]),
        h3('Das Geld wird gerecht aufgeteilt. Du musst teilen.', '20 Kinder zahlen zusammen 100 €. 100 : 20 = 5. Jedes Kind zahlt 5 €.', `Rechne ${a} : ${d}. Teile erst durch 10, dann durch ${d / 10}.`), { einheit: '€', bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) });
    },
    3: () => { const [d, q] = suche(() => [zz(2, 6) * 10, zz(2, 9) * 10], ([x, y]) => x * y <= 1000 && x !== y), a = d * q, k = kind();
      return auswahl(Z(`${k} rechnet: ${a} : ${d} = ${q / 10}.`, 'Prüfe mit der Mal-Aufgabe.', 'Stimmt das?'),
        [opt(`Falsch. ${q / 10} · ${d} = ${q / 10 * d}. Richtig ist ${q}.`, true), opt(`Stimmt. ${q / 10} · ${d} = ${a}.`, false, 'div-stellenwert'), opt(`Falsch. Richtig ist ${q * 10}.`, false, 'div-stellenwert')],
        h3('Die Mal-Aufgabe prüft: Ergebnis mal zweite Zahl muss die erste Zahl ergeben.', a === 600 ? '800 : 40 = 2? Prüfe: 2 · 40 = 80. Das ist nicht 800. Richtig ist 20.' : '600 : 20 = 3? Prüfe: 3 · 20 = 60. Das ist nicht 600. Richtig ist 30.', `Rechne ${q / 10} · ${d}. Kommt ${a} heraus?`), { nachweis: N(U(false, `${a} : ${d}`, q / 10), `${q / 10} · ${d}`, `${a} : ${d}`) }); },
  });

  stufen(D('D3'), 'M', {
    1: () => { const [a, d, q] = zweistelligM();
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [String(q).includes('0') ? Number(String(q).replace(/0/g, '')) : -1, 'div-null-vergessen']]),
        h2(`Notiere dir zuerst die Reihe ${d}, ${2 * d}, ${3 * d}, … am Rand. Sie hilft bei jedem Schritt.`, ablauf(a, d)), { nachweis: N(`${a} : ${d}`, `2 · ${d}`, `3 · ${d}`) }); },
    2: (k) => {
      if (k === 0) { const [a, d, q] = zweistelligM();
        return zahl(`Bestimme den fehlenden Dividenden: ▢ : ${d} = ${q}`, a, fehlerliste(a, [[q + d, 'begriffe-verwechselt']]), h2('Die Umkehraufgabe der Division ist die Multiplikation.', `Rechne ${q} · ${d}.`), { nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); }
      if (k === 1) { const [x, y, q] = suche(() => [zz(3, 8), zz(11, 15), zz(104, 260)], ([u, v, w]) => u * v * w <= 9999);
        return zahl(`Dividiere ${fz(q * x * y)} durch das Produkt aus ${x} und ${y}.`, q, fehlerliste(q, [[q * y, 'sach-schritt-vergessen'], [q * x, 'sach-schritt-vergessen']]),
          h2('Berechne zuerst das Produkt. Es ist der Divisor.', `Das Produkt ist ${x} · ${y} = ${x * y}.`), { nachweis: N(`${x} · ${y}`, `${q * x * y} : (${x} · ${y})`) }); }
      const [a, d, q] = suche(zweistelligM, ([, x]) => x >= 21 && (x % 10 >= 8 || x % 10 <= 2));
      const dr = Math.round(d / 10) * 10, ar = dr * Math.round(a / dr / 10) * 10;
      return auswahl(`Welcher Überschlag passt am besten zu ${fz(a)} : ${d}?`,
        [opt(`${fz(ar)} : ${dr} = ${ar / dr}`, true), opt(`${fz(ar)} : 10 = ${ar / 10}`, false, 'div-stellenwert'), opt(`${fz(ar * 10)} : ${dr} = ${ar * 10 / dr}`, false, 'div-stellenwert'), opt(`${fz(ar)} : 100 = ${ar / 100}`, false, 'div-stellenwert')],
        h2('Runde den Divisor auf Zehner. Runde den Dividenden so, dass die Division glatt aufgeht.', `Der Divisor ${d} wird zu ${dr}. Der genaue Quotient ist ${q}.`), { nachweis: [...N(`${a} : ${d}`, `${ar} : ${dr}`), `${d} ≈ ${dr}`] });
    },
    3: () => { const d = zz(12, 28), h = zz(2, 3), e = zz(3, 9), q = h * 100 + e, a = q * d, k = kind();
      return auswahl(`${k} erhält bei ${fz(a)} : ${d} das Ergebnis ${h * 10 + e}. Prüfe mit einem Überschlag und entscheide.`,
        [opt(`Falsch: ${fz(h * 100 * d)} : ${d} = ${h * 100}, der Quotient muss dreistellig sein. Richtig ist ${q}.`, true), opt(`Richtig: ${h * 10 + e} · ${d} = ${fz(a)}.`, false, 'div-null-vergessen'), opt('Falsch: Der Quotient muss vierstellig sein.', false, 'div-stellenwert'), opt('Richtig: Bei einem zweistelligen Divisor ist auch der Quotient zweistellig.', false, 'div-stellenwert')],
        h2('Wie oft passt der Divisor ungefähr in den Dividenden? Schätze mit glatten Zahlen.', `Überschlage mit ${fz(h * 100 * d)} : ${d}.`), { nachweis: N(U(false, `${a} : ${d}`, h * 10 + e), `${h * 100 * d} : ${d}`, `${a} : ${d}`, `${h * 10 + e} · ${d}`) }); },
  });

  const teiler = { 12: [[3, 4], 24, 8], 15: [[3, 5], 30, 10], 18: [[2, 9], 36, 12], 20: [[4, 5], 40, 8] };
  stufen(D('D3'), 'E', {
    1: () => { const [a, d, q] = suche(() => { const x = zz(26, 79), y = zz(101, 380); return [x * y, x, y]; }, ([x, y, w]) => y % 10 !== 0 && mitNull(w) && x <= 9999);
      return zahl(`Dividiere schriftlich: ${fz(a)} : ${d}`, q, fehlerliste(q, [[Number(String(q).replace(/0/g, '')), 'div-null-vergessen'], [q * 10, 'div-stellenwert']]), h1('Wie viele Stellen muss der Quotient nach einem Überschlag haben?'), { nachweis: N(`${a} : ${d}`) }); },
    2: (k) => {
      if (k === 0) { const d = zz(6, 24) * 2, q = zz(25, 125);
        return zahl(`Es gilt ${fz(d * q)} : ${d} = ${q}. Bestimme ohne schriftliche Rechnung: ${fz(d * q)} : ${d / 2}`, 2 * q, fehlerliste(2 * q, [[q % 2 === 0 ? q / 2 : -1, 'div-stellenwert'], [q, 'div-stellenwert']]),
          h1('Der Divisor ist nur noch halb so groß. Wie oft passt er dann hinein?'), { nachweis: N(`${d * q} : ${d}`, `${d} : 2`, `${d * q} : ${d / 2}`) }); }
      if (k === 1) { const [d, unten] = suche(() => [wahl([13, 14, 15, 16, 17, 18]), zz(20, 60) * 10], ([x, u]) => u % x !== 0), m = Math.ceil((unten + 1) / d) * d;
        return zahl(`Genau eine Zahl zwischen ${unten} und ${unten + d} ist ohne Rest durch ${d} teilbar. Welche?`, m, [],
          h1(`Welchen Rest lässt ${unten} bei Division durch ${d}? Wie viel fehlt bis zum nächsten Vielfachen?`), { nachweis: [{ art: 'vielfachesZwischen', durch: d, von: unten, bis: unten + d, zahl: m }, ...N(`${m} : ${d}`, `${unten} + ${d}`)] }); }
      const d = zz(12, 19), q = zz(21, 48);
      return zahl(`Eine Zahl ergibt bei Division durch ${d} den Quotienten ${q} und den größtmöglichen Rest. Wie heißt die Zahl?`, d * q + d - 1, fehlerliste(d * q + d - 1, [[d * q, 'div-rest-vergessen'], [d * q + d, 'div-rest-zu-gross']]),
        h1(`Wie groß kann ein Rest bei Division durch ${d} höchstens sein?`), { nachweis: N(`${d} − 1`, `${q} · ${d} + ${d - 1}`) });
    },
    3: (k) => {
      if (k === 0) { const d = wahl(Object.keys(teiler).map(Number)), [[x, y], doppelt, anders] = teiler[d];
        return auswahl(`Eine Zahl ist ohne Rest durch ${d} teilbar. Welche Aussage gilt dann immer?`,
          [opt(`Sie ist auch durch ${x} und durch ${y} teilbar.`, true), opt(`Sie ist auch durch ${doppelt} teilbar.`, false, 'teilbar-summe'), opt(`Sie ist auch durch ${anders} teilbar.`, false, 'teilbar-summe'), opt('Sie ist größer als 100.'), opt('Sie ist eine gerade Zahl und endet auf 0.')],
          h1(`Prüfe jede Aussage an der Zahl ${d} selbst.`), { nachweis: N(`${d} : ${x}`, `${d} : ${y}`, `${x} · ${y}`) }); }
      const [d, x, y] = wahl([[24, 4, 6], [18, 3, 6], [28, 4, 7], [32, 4, 8]]), q = zz(52, 148), a = d * q, n = kind();
      return auswahl(`${n} berechnet ${fz(a)} : ${d} in zwei Schritten: zuerst ${fz(a)} : ${x} = ${fz(a / x)}, dann ${fz(a / x)} : ${y} = ${q}. Beurteile den Rechenweg.`, [
        opt(`Richtig, denn ${x} · ${y} = ${d}. Nacheinander durch ${x} und durch ${y} zu teilen wirkt wie das Teilen durch ${d}.`, true), opt(`Falsch. ${n} müsste zuerst durch ${d - x} und dann noch einmal durch ${x} teilen, denn ${d - x} + ${x} = ${d}.`),
        opt('Falsch. Ein Divisor darf nicht zerlegt werden.'), opt(`Richtig, aber nur, weil ${fz(a)} eine gerade Zahl ist.`), opt(`Falsch, denn ${x} + ${y} ist nicht ${d}.`)],
      h1('Mache die Probe: Multipliziere das Ergebnis nacheinander mit beiden Zahlen.'), { nachweis: N(U(true, `${a} : ${d}`, q), `${a} : ${x}`, `${a / x} : ${y}`, `${x} · ${y}`, `${a} : ${d}`) });
    },
  });

  // ===================================================================
  // D4 Division mit Rest
  // F: handelnd im Zahlenraum bis 40. G: Rest im kleinen Einmaleins. M: Rest deuten. E: Reste untersuchen.
  // ===================================================================
  const restF = () => mitRest(2, 5, 2, 6);
  sechs(D('D4'), 'F', [
    () => { const [a, d, q, r] = restF();
      return zahl(Z(`Du hast ${a} Plättchen.`, `Du legst immer ${d} zusammen.`, 'Wie viele Plättchen bleiben übrig?'), r, fehlerliste(r, [[q, 'div-rest-vergessen'], [0, 'div-rest-vergessen']]),
        h3('Was nicht mehr für eine Gruppe reicht, bleibt übrig.', '14 Plättchen, immer 4 zusammen: 3 Gruppen sind 12 Plättchen. 2 bleiben übrig.', `${q} Gruppen sind ${q} · ${d} = ${q * d} Plättchen. Zähle die Plättchen ohne Gruppe.`), { einheit: 'Plättchen', bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`, `${q} · ${d}`) }); },
    () => { const [a, d, q, r] = restF();
      return luecken(`${a} : ${d} = {{q}} Rest {{r}}`, { q: [q, fehlerliste(q, [[q + 1, 'div-einmaleins']])], r: [r, fehlerliste(r, [[r + d, 'div-rest-zu-gross']])] },
        h3('Zähle erst die vollen Gruppen. Zähle dann, was übrig bleibt.', '17 : 5: 3 · 5 = 15 passt. Bis 17 fehlen 2. Also 3 Rest 2.', `${q} · ${d} = ${q * d}. Das passt in die ${a}.`), { bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`, `${q} · ${d}`) }); },
    () => { const [a, d, q, r] = restF();
      return zahl(Z(`${a} Kinder bilden ${d}er-Gruppen.`, 'Wie viele Kinder bleiben übrig?'), r, fehlerliste(r, [[q, 'div-rest-vergessen']]),
        h3('Wer in keine volle Gruppe passt, bleibt übrig.', '13 Kinder, 4er-Gruppen: 3 Gruppen sind 12 Kinder. 1 Kind bleibt übrig.', `${q} Gruppen sind ${q * d} Kinder. Zähle die Kinder ohne Gruppe.`), { einheit: 'Kinder', bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) }); },
    () => { const [a, d, q, r] = restF();
      return zahl(Z(`Du hast ${a} Plättchen.`, `Du legst immer ${d} zusammen.`, 'Wie viele volle Gruppen sind es?'), q, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
        h3('Nur volle Gruppen zählen.', '14 Plättchen, immer 4 zusammen: Es sind 3 volle Gruppen. 2 bleiben übrig.', `Zähle im Bild die Gruppen mit ${d} Plättchen.`), { einheit: 'Gruppen', bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) }); },
    () => { const t = zz(3, 5), basis = zz(2, 4) * t, x = zz(1, t - 1), bis = Math.ceil((basis + t + 1) / 5) * 5;
      return auswahl('Bei welcher Aufgabe bleibt ein Rest?', [opt(`${basis + x} : ${t}`, true), opt(`${basis} : ${t}`), opt(`${basis + t} : ${t}`)],
        h3(`Schau auf die ${t}er-Sprünge. Welche Zahl wird nicht getroffen?`, 'Die 3er-Reihe: 3, 6, 9, 12. Die 10 kommt nicht vor. Bei 10 : 3 bleibt ein Rest.', `Die ${t}er-Reihe: ${Array.from({ length: Math.floor(bis / t) }, (_, i) => (i + 1) * t).join(', ')}.`),
        { bild: B.strahl({ von: 0, bis, schritt: 1, beschriftung: 5, start: 0, spruenge: Array.from({ length: Math.floor(bis / t) }, (_, i) => ({ von: i * t, nach: (i + 1) * t, text: `+ ${t}` })) }), nachweis: N({ art: 'restBleibt' }, `${basis} : ${t}`, `${basis + t} : ${t}`, `${basis / t} · ${t} + ${x}`) }); },
    () => { const [a, d, q, r] = restF();
      return luecken(Z('Welche Zahl fehlt?', `${a} : ${d} = ${q} Rest {{r}}`), { r: [r, fehlerliste(r, [[r + d, 'div-rest-zu-gross'], [0, 'div-rest-vergessen']])] },
        h3('Der Rest ist das, was übrig bleibt.', '11 : 2 = 5 Rest 1. Denn 5 · 2 = 10. Bis 11 fehlt 1.', `${q} · ${d} = ${q * d}. Wie viel fehlt bis ${a}?`), { bild: B.gruppen(q, d, r), nachweis: N(`${q} · ${d}`, `${q} · ${d} + ${r}`) }); },
  ]);

  const restG = () => mitRest(3, 9, 3, 9);
  const behaelter = [['Eier', 'Karton', 'Kartons'], ['Flaschen', 'Kasten', 'Kästen'], ['Stifte', 'Dose', 'Dosen']];
  stufen(D('D4'), 'G', {
    1: (k) => {
      const [a, d, q, r] = restG();
      if (k === 0) return luecken(`${a} : ${d} = {{q}} Rest {{r}}`, { q: [q, fehlerliste(q, [[q + 1, 'div-einmaleins']])], r: [r, fehlerliste(r, [[r + d, 'div-rest-zu-gross']])] },
        h3(`Suche in der ${d}er-Reihe die größte Zahl, die noch in die ${a} passt.`, '47 : 6: 7 · 6 = 42 passt. Bis 47 fehlen 5. Also 7 Rest 5.', `${q} · ${d} = ${q * d}. Rechne ${a} − ${q * d}.`), { bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`, `${q} · ${d}`, `${a} − ${q * d}`) });
      if (k === 1) { const [ding, platz, plaetze] = wahl(behaelter);
        return zahl(Z(`Es gibt ${a} ${ding}.`, `In 1 ${platz} passen ${d} ${ding}.`, `Wie viele ${plaetze} werden ganz voll?`), q, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
          h3(`Teile ${a} durch ${d}. Nur volle ${plaetze} zählen.`, '50 Eier, 6 in 1 Karton: 50 : 6 = 8 Rest 2. 8 Kartons werden voll. 2 Eier bleiben übrig.', `${q} · ${d} = ${q * d}. Der Rest füllt nichts ganz.`), { einheit: plaetze, bild: B.gruppen(q, d, r), nachweis: N(`${a} : ${d} = ${q} Rest ${r}`, `${q} · ${d}`) }); }
      return luecken(Z(`${q} · ${d} = ${q * d}`, `${a} : ${d} = ${q} Rest {{r}}`), { r: [r, fehlerliste(r, [[r + d, 'div-rest-zu-gross'], [0, 'div-rest-vergessen']])] },
        h3('Der Rest ist das, was bis zur ersten Zahl noch fehlt.', '7 · 6 = 42. Dann ist 47 : 6 = 7 Rest 5, denn 47 − 42 = 5.', `Rechne ${a} − ${q * d}.`), { bild: B.gruppen(q, d, r), nachweis: N(`${q} · ${d}`, `${a} − ${q * d}`, `${q} · ${d} + ${r}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, d, q, r] = restG();
        return zahl(Z('Welche Zahl fehlt?', `▢ : ${d} = ${q} Rest ${r}`), a, fehlerliste(a, [[q * d, 'div-rest-vergessen']]),
          h3('Mache die Probe: Ergebnis mal zweite Zahl, dann den Rest dazu.', '▢ : 6 = 7 Rest 5. Rechne 7 · 6 = 42. Dann 42 + 5 = 47.', `Rechne ${q} · ${d} = ${q * d}. Zähle den Rest ${r} dazu.`), { nachweis: N(`${q} · ${d}`, `${q * d} + ${r}`) }); }
      const t = zz(4, 8);
      return auswahl(Z(`Du teilst durch ${t}.`, 'Welcher Rest ist nicht möglich?'), [opt(String(t), true), opt(String(t - 1), false, 'div-rest-zu-gross'), opt('1', false, 'div-rest-zu-gross')],
        h3('Der Rest ist immer kleiner als die Zahl, durch die du teilst.', 'Bleiben beim Teilen durch 4 noch 4 übrig, passt die 4 noch einmal hinein.', `Kann beim Teilen durch ${t} genau ${t} übrig bleiben?`), { nachweis: [{ art: 'zahlenwahl', eigenschaft: 'rest', durch: t, gilt: false }] });
    },
    3: () => { const [a, d, q, r] = suche(restG, ([, , w]) => w >= 4), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} : ${d} = ${q - 1} Rest ${r + d}.`, 'Stimmt das?'),
        [opt(`Falsch. Der Rest ${r + d} ist größer als ${d}. Richtig ist ${q} Rest ${r}.`, true), opt(`Stimmt. Die Probe passt: ${q - 1} · ${d} + ${r + d} = ${a}. Der Rest darf so groß sein.`, false, 'div-rest-zu-gross'), opt(`Falsch. Richtig ist ${q + 1} Rest ${r}.`, false, 'div-einmaleins')],
        h3('Vergleiche den Rest mit der Zahl, durch die geteilt wird.', '58 : 7 = 7 Rest 9? Der Rest 9 ist größer als 7. Richtig ist 8 Rest 2.', `Der Rest ist ${r + d}. Passt die ${d} noch einmal hinein?`), { nachweis: N(U(false, `${a} : ${d}`, q - 1, r + d), `${a} : ${d} = ${q} Rest ${r}`, `${q - 1} · ${d} + ${r + d}`) }); },
  });

  const kontexteAuf = [ // der Rest braucht einen weiteren Behälter: aufrunden
    (a, d) => [`${a} Muffins sollen in Schachteln verpackt werden. In jede Schachtel passen genau ${d} Muffins.`, 'Wie viele Schachteln werden vollständig gefüllt?', 'Schachteln', 'Wie viele Muffins bleiben übrig?', 'Muffins', 'Wie viele Schachteln werden insgesamt benötigt, damit alle Muffins eingepackt sind?'],
    (a, d) => [`${a} Kinder fahren mit Kleinbussen ins Schullandheim. In jeden Kleinbus passen ${d} Kinder.`, 'Wie viele Kleinbusse sind voll besetzt?', 'Kleinbusse', 'Wie viele Kinder sitzen im letzten Bus?', 'Kinder', 'Wie viele Kleinbusse werden insgesamt gebraucht?'],
    (a, d) => [`${a} Bücher werden in Kisten gepackt. In jede Kiste passen ${d} Bücher.`, 'Wie viele Kisten werden ganz voll?', 'Kisten', 'Wie viele Bücher bleiben übrig?', 'Bücher', 'Wie viele Kisten braucht man, damit alle Bücher verpackt sind?'],
  ];
  const kontexteAb = [ // der Rest reicht nicht für ein weiteres Stück: abrunden
    (a, d) => [`Aus einem ${a} cm langen Brett sollen Regalbretter von je ${d} cm Länge gesägt werden. Wie viele Regalbretter erhält man?`, 'Regalbretter'],
    (a, d) => [`Ein Armband braucht ${d} Perlen. Lina hat ${a} Perlen. Wie viele vollständige Armbänder kann sie fädeln?`, 'Armbänder'],
    (a, d) => [`Eine Eintrittskarte kostet ${d} €. Die Klassenkasse enthält ${a} €. Wie viele Karten kann die Klasse höchstens kaufen?`, 'Karten'],
  ];
  stufen(D('D4'), 'M', {
    1: () => { const [a, d, q, r] = restM();
      return luecken(`${fz(a)} : ${d} = {{q}} Rest {{r}}`, { q: [q, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet']])], r: [r, fehlerliste(r, [[0, 'div-rest-vergessen']])] },
        h2('Der Rest ist das, was nach dem letzten Abziehen übrig bleibt. Er ist kleiner als der Divisor.', ablauf(a, d)), { nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) }); },
    2: (k) => {
      const [a, d, q, r] = restM();
      if (k === 0) { const [text, f1, e1, f2, e2] = kontexteAuf[zz(0, 2)](a, d);
        return sach(text, [teil(f1, q, e1, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet']])), teil(f2, r, e2, fehlerliste(r, [[0, 'div-rest-vergessen']]))],
          h2('Dividiere mit Rest. Der Quotient und der Rest beantworten je eine Frage.', `Rechne ${fz(a)} : ${d}. Der Quotient ist ${q}.`), { nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) }); }
      if (k === 1) { const [text, , e1, , , f3] = kontexteAuf[zz(0, 2)](a, d);
        return zahl(`${text} ${f3}`, q + 1, fehlerliste(q + 1, [[q, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
          h2('Rechne zuerst mit Rest. Überlege dann: Was geschieht mit dem Rest?', `${fz(a)} : ${d} = ${q} Rest ${r}. Der Rest braucht auch noch Platz.`), { einheit: e1, nachweis: N(`${a} : ${d} = ${q} Rest ${r}`, `${q} + 1`) }); }
      const [text, einheit] = kontexteAb[d < 12 ? zz(1, 2) : zz(0, 2)](a, d); // ein Regalbrett ist nicht nur wenige Zentimeter lang
      return zahl(text, q, fehlerliste(q, [[q + 1, 'div-rest-nicht-gedeutet'], [r, 'div-rest-vergessen']]),
        h2('Rechne zuerst mit Rest. Überlege dann: Reicht der Rest für ein weiteres Stück?', `${fz(a)} : ${d} = ${q} Rest ${r}. Der Rest reicht nicht für ein weiteres Stück.`), { einheit, nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) });
    },
    3: () => { const [a, d, q, r] = suche(() => mitRest(28, 52, 3, 8), ([, x, , rest]) => rest > x / 2), k = kind();
      return auswahl(`${a} Kinder fahren mit Bussen zum Wandertag. Ein Bus hat ${d} Plätze. ${k} rechnet ${a} : ${d} = ${q} Rest ${r} und bestellt ${q} Busse. Beurteile die Entscheidung.`,
        [opt(`Falsch: ${r} Kinder hätten keinen Platz. Es werden ${q + 1} Busse gebraucht.`, true), opt(`Richtig: ${q} Busse sind voll, das genügt.`, false, 'div-rest-nicht-gedeutet'), opt(`Falsch: Es werden ${r} Busse gebraucht.`, false, 'div-rest-vergessen'), opt('Richtig: Bei Sachaufgaben lässt man den Rest immer einfach weg.', false, 'div-rest-nicht-gedeutet')],
        h2('Was bedeutet der Rest in dieser Situation? Wer oder was ist das?', `Der Rest ${r} steht für ${r} Kinder, die in den ${q} Bussen keinen Platz finden.`), { nachweis: N(U(false), `${a} : ${d} = ${q} Rest ${r}`, `${q} + 1`) }); },
  });

  stufen(D('D4'), 'E', {
    1: () => { const [a, d, q, r] = restE(13, 48);
      return luecken(`${fz(a)} : ${d} = {{q}} Rest {{r}}`, { q, r: [r, fehlerliste(r, [[0, 'div-rest-vergessen']])] }, h1('Wie kannst du dein Ergebnis mit einer Probe sichern?'), { nachweis: N(`${a} : ${d} = ${q} Rest ${r}`) }); },
    2: (k) => {
      const d = zz(6, 9), r = zz(2, d - 1);
      if (k === 0) { const m = Math.floor((999 - r) / d) * d + r;
        return zahl(`Bestimme die größte dreistellige Zahl, die bei Division durch ${d} den Rest ${r} lässt.`, m, fehlerliste(m, [[Math.floor(999 / d) * d, 'div-rest-vergessen']]),
          h1(`Suche zuerst das größte dreistellige Vielfache von ${d}. Was musst du noch beachten?`), { nachweis: [{ art: 'grenzRest', durch: d, rest: r, grenze: 999, zahl: m }, ...N(`${(m - r) / d} · ${d} + ${r}`)] }); }
      if (k === 1) { const f = wahl([2, 3]);
        return zahl(`Eine Zahl lässt bei Division durch ${d} den Rest ${r}. Welchen Rest lässt das ${f === 2 ? 'Doppelte' : 'Dreifache'} dieser Zahl bei Division durch ${d}?`, (f * r) % d, fehlerliste((f * r) % d, [[f * r, 'div-rest-zu-gross'], [r, 'teilbar-summe']]),
          h1(`Schreibe die Zahl als „Vielfaches von ${d} plus ${r}“. Was geschieht mit beiden Teilen?`), { nachweis: N(`${f} · ${r}`, `${f * r} : ${d} = ${Math.floor(f * r / d)} Rest ${(f * r) % d}`, `${d} + ${r}`, `${f} · ${d + r}`, `${f * (d + r)} : ${d} = ${Math.floor(f * (d + r) / d)} Rest ${(f * r) % d}`) }); }
      const bis = wahl([50, 60, 80]), anzahl = Array.from({ length: bis }, (_, i) => i + 1).filter((n) => n % d === r).length;
      return zahl(`Wie viele natürliche Zahlen von 1 bis ${bis} lassen bei Division durch ${d} den Rest ${r}?`, anzahl, fehlerliste(anzahl, [[Math.floor(bis / d), 'div-rest-vergessen']]),
        h1(`Die kleinste solche Zahl ist ${r}. In welchen Abständen folgen die nächsten?`), { nachweis: [{ art: 'anzahlMitRest', durch: d, rest: r, von: 1, bis, anzahl }] });
    },
    3: (k) => {
      if (k === 0) { const d = zz(5, 9), r = zz(2, d - 1), m = zz(2, 4) * d, n = kind();
        return auswahl(`Eine Zahl lässt bei Division durch ${d} den Rest ${r}. ${n} addiert ${m} zu dieser Zahl. Welche Aussage über den neuen Rest bei Division durch ${d} stimmt?`,
          [opt(`Der Rest bleibt ${r}, weil ${m} ein Vielfaches von ${d} ist.`, true), opt(`Der Rest wird ${r + m}.`, false, 'div-rest-zu-gross'), opt(`Der Rest wird 0, weil ${m} durch ${d} teilbar ist.`, false, 'teilbar-summe'), opt('Das hängt von der Ausgangszahl ab.', false, 'teilbar-summe')],
          h1(`Stell dir ${d}er-Päckchen und ${r} einzelne Teile vor. Was kommt durch die ${m} hinzu?`), { nachweis: N(`${m} : ${d}`, `${r} + ${m}`) }); }
      const [m1, m2] = wahl([[3, 5], [4, 5], [3, 7], [4, 7], [5, 6], [5, 7]]);
      const [r1, r2, x] = suche(() => { const a = zz(1, m1 - 1), b = zz(1, m2 - 1); let n = 1; while (n % m1 !== a || n % m2 !== b) n++; return [a, b, n]; }, ([, , n]) => n > m2);
      return zahl(`Eine Zahl lässt bei Division durch ${m1} den Rest ${r1} und bei Division durch ${m2} den Rest ${r2}. Bestimme die kleinste natürliche Zahl mit dieser Eigenschaft.`, x, [],
        h1(`Schreibe die ersten Zahlen auf, die bei Division durch ${m2} den Rest ${r2} lassen. Welche davon passt auch zur anderen Bedingung?`), { nachweis: [{ art: 'kleinsteMitResten', bedingungen: [[m1, r1], [m2, r2]], zahl: x }] });
    },
  });

  // ===================================================================
  // D5 Überschlag und Probe
  // F: Probe mit der Mal-Aufgabe. G: Probe und Überschlag mit Hundertern. M und E: beides gezielt einsetzen und bewerten.
  // ===================================================================
  sechs(D('D5'), 'F', [
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return auswahl(Z(`${a} : ${d} = ${q}`, 'Welche Mal-Aufgabe ist die Probe?'), [opt(`${q} · ${d} = ${a}`, true), opt(`${a} · ${d} = ${q}`, false, 'probe-falsche-umkehr'), opt(`${q} + ${d} = ${q + d}`, false, 'probe-falsche-umkehr')],
        h3('Die Probe ist die Mal-Aufgabe: Ergebnis mal zweite Zahl.', '28 : 4 = 7. Die Probe ist 7 · 4 = 28.', `Die Probe beginnt mit dem Ergebnis ${q}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return zahl(Z('Mache die Probe.', `${a} : ${d} = ${q}`, `${q} · ${d} = ▢`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
        h3('Bei der Probe kommt wieder die erste Zahl heraus.', '28 : 4 = 7. Probe: 7 · 4 = 28.', `Im Bild sind ${q} Reihen mit je ${d} Punkten. Zähle alle Punkte.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return luecken(Z('Mache die Probe.', `${a} : ${d} = ${q}`, `{{x}} · ${d} = {{y}}`), { x: [q, fehlerliste(q, [[a, 'probe-falsche-umkehr']])], y: a },
        h3('Die Probe ist die Mal-Aufgabe: Ergebnis mal zweite Zahl.', '15 : 3 = 5. Probe: 5 · 3 = 15.', `Die Probe beginnt mit dem Ergebnis ${q}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) }); },
    () => { const [a, d, q] = suche(() => einmaleins(2, 5, 3, 6), ([, x, y]) => x !== y);
      return auswahl(Z('Welche Rechnung ist richtig?', 'Prüfe mit der Mal-Aufgabe.'), [opt(`${a} : ${d} = ${q}`, true), opt(`${a} : ${d} = ${q + 1}`, false, 'div-einmaleins'), opt(`${a} : ${d} = ${q - 1}`, false, 'div-einmaleins')],
        h3('Rechne zu jeder Antwort: Ergebnis mal zweite Zahl.', '20 : 5 = 4? Probe: 4 · 5 = 20. Das stimmt.', `Bei der richtigen Antwort ergibt Ergebnis mal ${d} genau ${a}.`), { bild: B.feld(q, d), nachweis: [{ art: 'gleichungen' }, ...N(`${q} · ${d}`)] }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return auswahl(Z(`Die Probe ist ${q} · ${d} = ${a}.`, 'Welche Geteilt-Aufgabe wurde geprüft?'), [opt(`${a} : ${d} = ${q}`, true), opt(`${q} : ${d} = ${a}`, false, 'div-vertauscht'), opt(`${d} : ${a} = ${q}`, false, 'div-vertauscht')],
        h3('Bei der Geteilt-Aufgabe steht die größte Zahl vorn.', 'Probe 8 · 3 = 24. Geprüft wurde 24 : 3 = 8.', `Die größte Zahl ist ${a}. Sie wird geteilt.`), { bild: B.feld(q, d), nachweis: [{ art: 'gleichungen' }, ...N(`${q} · ${d}`)] }); },
    () => { const [a, d, q] = ungleich(3, 5, 3, 6);
      return zahl(Z(`${a} : ${d} = ${q}`, 'Die Probe ist eine Mal-Aufgabe.', 'Welche Zahl kommt bei der Probe heraus?'), a, fehlerliste(a, [[q, 'probe-falsche-umkehr'], [q + d, 'div-falsche-rechenart']]),
        h3('Bei der Probe kommt wieder die erste Zahl heraus.', '12 : 3 = 4. Probe: 4 · 3 = 12.', `Rechne ${q} · ${d}.`), { bild: B.feld(q, d), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) }); },
  ]);

  const vorzeichen = () => (zz(0, 1) ? 1 : -1);
  const ueberschlagG = () => suche(() => { const d = zz(2, 9), h = zz(1, 4), q = h * 100 + zz(2, 9) * vorzeichen(), a = q * d; return [a, d, q, h * 100]; },
    ([a, d, q]) => a >= 180 && a <= 1000 && q > 0 && a % 100 !== 0 && Math.round(a / (d * 100)) * d * 100 === Math.round(q / 100) * 100 * d);
  stufen(D('D5'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d, q] = schriftlichG(12, 99);
        return zahl(Z('Mache die Probe.', `${a} : ${d} = ${q}`, `${q} · ${d} = ▢`), a, fehlerliste(a, [[q + d, 'div-falsche-rechenart']]),
          h3('Die Probe ist die Mal-Aufgabe: Ergebnis mal zweite Zahl.', '96 : 4 = 24. Probe: 24 · 4 = 96.', `Rechne ${q - (q % 10)} · ${d} = ${(q - (q % 10)) * d}. Rechne dann ${q % 10} · ${d} dazu.`), { bild: B.material(hze(a)), nachweis: N(`${q} · ${d}`, `${a} : ${d}`) }); }
      if (k === 1) { const [a, d, , hq] = ueberschlagG();
        return zahl(Z('Überschlage.', `${a} : ${d}`, `Rechne mit ${hq * d} : ${d}.`), hq, fehlerliste(hq, [[a / d, 'ueberschlag-nicht-gerundet'], [hq / 10, 'div-stellenwert']]),
          h3('Beim Überschlag rechnest du mit einer runden Zahl. Das geht im Kopf.', 'Überschlag zu 418 : 4: Rechne 400 : 4 = 100.', `${hq * d / 100} Hunderter geteilt durch ${d} sind ${hq / 100} Hunderter.`), { bild: B.material(hze(hq * d)), nachweis: [...N(`${hq * d} : ${d}`), { art: 'naheBei', zahl: a, rund: hq * d }] }); }
      const [a, d, q] = schriftlichG(12, 99);
      return auswahl(Z(`${a} : ${d} = ${q}`, 'Welche Mal-Aufgabe ist die Probe?'), [opt(`${q} · ${d} = ${a}`, true), opt(`${a} · ${d} = ${q}`, false, 'probe-falsche-umkehr'), opt(`${q} + ${d} = ${q + d}`, false, 'probe-falsche-umkehr')],
        h3('Die Probe ist die Mal-Aufgabe: Ergebnis mal zweite Zahl.', '96 : 4 = 24. Die Probe ist 24 · 4 = 96.', `Die Probe beginnt mit dem Ergebnis ${q}.`), { nachweis: N(`${a} : ${d}`, `${q} · ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, d, , hq] = ueberschlagG();
        return auswahl(`Welcher Überschlag passt zu ${a} : ${d}?`, [opt(`${hq * d} : ${d} = ${hq}`, true), opt(`${hq * d} : 10 = ${hq * d / 10}`, false, 'falsch-gerundet'), opt(`${hq * d / 10} : ${d} = ${hq / 10}`, false, 'div-stellenwert')],
          h3('Runde nur die erste Zahl. Sie soll nahe bei der echten Zahl bleiben.', 'Zu 594 : 6 passt 600 : 6 = 100. Denn 594 liegt nahe bei 600.', `Welche runde Zahl liegt nahe bei ${a} und lässt sich gut durch ${d} teilen?`), { bild: B.material(hze(a)), nachweis: [...N(`${hq * d} : ${d}`), { art: 'naheBei', zahl: a, rund: hq * d }] }); }
      const [a, d, q] = schriftlichG(12, 99);
      return auswahl(Z(`${a} : ${d}`, 'Welches Ergebnis stimmt?', 'Prüfe mit der Mal-Aufgabe.'), [opt(String(q), true), opt(String(q + 10), false, 'div-einmaleins'), opt(String(q + 1), false, 'div-einmaleins')],
        h3('Rechne zu jeder Antwort: Antwort mal zweite Zahl.', '252 : 7 = 36? Probe: 36 · 7 = 252. Das stimmt.', `Bei der richtigen Antwort ergibt Antwort mal ${d} genau ${a}.`), { bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`, `${q} · ${d}`) });
    },
    3: () => { const [a, d, q] = suche(() => schriftlichG(112, 199), ([x, y, w]) => w % 100 >= 12 && (Math.round(x / 100) * 100) % (y * 10) === 0), ar = Math.round(a / 100) * 100, ue = ar / d, falsch = q % 100, k = kind();
      return auswahl(Z(`${k} rechnet: ${a} : ${d} = ${falsch}.`, `Der Überschlag ist ${ar} : ${d} = ${ue}.`, 'Was zeigt der Überschlag?'),
        [opt(`${falsch} ist viel zu klein. Das Ergebnis muss nahe bei ${ue} liegen. Richtig ist ${q}.`, true), opt(`${falsch} passt zum Überschlag.`, false, 'div-stellenwert'), opt(`Der Überschlag ist falsch. ${ar} : ${d} = ${ue / 10}. Das Ergebnis muss nahe bei ${ue / 10} liegen.`, false, 'div-stellenwert')],
        h3('Vergleiche das Ergebnis mit dem Überschlag. Die Zahlen müssen nahe beieinander liegen.', '848 : 4 = 12? Der Überschlag ist 800 : 4 = 200. 12 ist viel kleiner als 200. Richtig ist 212.', `Liegt ${falsch} nahe bei ${ue}?`), { nachweis: [U(false, `${a} : ${d}`, falsch), `${a} ≈ ${ar}`, ...N(`${ar} : ${d}`, `${a} : ${d}`)] }); },
  });

  stufen(D('D5'), 'M', {
    1: (k) => {
      if (k === 0) { const d = zz(3, 9), t = zz(2, 9), a = d * t * 100 + zz(4, 38) * vorzeichen();
        return zahl(`Überschlage: Runde den Dividenden auf Hunderter und rechne dann. ${fz(a)} : ${d} ≈ ?`, t * 100, fehlerliste(t * 100, [[t * 10, 'div-stellenwert'], [Number.isInteger(a / d) ? a / d : -1, 'ueberschlag-nicht-gerundet']]),
          h2('Runde so, dass du die Division im Kopf lösen kannst.', `Der Dividend wird zu ${fz(d * t * 100)}.`), { nachweis: [`${a} ≈ ${d * t * 100}`, ...N(`${d * t * 100} : ${d}`)] }); }
      const [a, d, q] = zweistelligM();
      return auswahl(`Welche Rechnung ist die Probe zu ${fz(a)} : ${d} = ${q}?`, [opt(`${q} · ${d} = ${fz(a)}`, true), opt(`${fz(a)} · ${d} = ${q}`, false, 'probe-falsche-umkehr'), opt(`${fz(a)} − ${q} = ${d}`, false, 'probe-falsche-umkehr'), opt(`${q} : ${d} = ${fz(a)}`, false, 'probe-falsche-umkehr')],
        h2('Die Probe ist die Umkehraufgabe. Sie führt zurück zum Dividenden.', 'Quotient · Divisor = Dividend.'), { nachweis: [{ art: 'gleichungen' }, ...N(`${a} : ${d}`, `${q} · ${d}`)] });
    },
    2: (k) => {
      if (k === 0) { const d = zz(4, 9), q = suche(() => zz(105, 980), (x) => x % 10 !== 0), a = d * q;
        return auswahl(`Nur ein Ergebnis kann stimmen. Entscheide mit einem Überschlag: ${fz(a)} : ${d}`, [opt(String(q), true), opt(String(Math.floor(q / 10)), false, 'div-stellenwert'), opt(fz(q * 10), false, 'div-stellenwert'), opt(fz(q + 1000), false, 'div-stellenwert')],
          h2('Überschlage zuerst, wie groß der Quotient ungefähr sein muss.', `Überschlag: ${fz(Math.round(q / 100) * 100 * d)} : ${d} = ${Math.round(q / 100) * 100}.`), { nachweis: N(`${a} : ${d}`, `${Math.round(q / 100) * 100 * d} : ${d}`) }); }
      if (k === 1) { const [a, d, q, r] = restM();
        return zahl(`Bei einer Division durch ${d} ist der Quotient ${q} und der Rest ${r}. Bestimme mit der Probe den Dividenden.`, a, fehlerliste(a, [[d * q, 'div-rest-vergessen']]),
          h2('Probe bei einer Division mit Rest: Quotient · Divisor, dann den Rest addieren.', `Rechne ${q} · ${d} = ${fz(q * d)}.`), { nachweis: N(`${q} · ${d}`, `${q} · ${d} + ${r}`) }); }
      const d = suche(() => zz(23, 78), (x) => x % 10 !== 0), q = suche(() => zz(21, 98), (x) => x % 10 !== 0), a = d * q, u = Math.floor(q / 10) * 10;
      return auswahl(`Zwischen welchen Zahlen liegt ${fz(a)} : ${d}? Entscheide mit einem Überschlag.`, [opt(`zwischen ${u} und ${u + 10}`, true), opt(`zwischen ${u / 10} und ${u / 10 + 1}`, false, 'div-stellenwert'), opt(`zwischen ${u * 10} und ${u * 10 + 100}`, false, 'div-stellenwert'), opt(`zwischen ${u + 20} und ${u + 30}`, false, 'falsch-gerundet')],
        h2('Multipliziere die Grenzen mit dem Divisor und vergleiche mit dem Dividenden.', `${u} · ${d} = ${fz(u * d)} und ${u + 10} · ${d} = ${fz((u + 10) * d)}.`), { nachweis: [{ art: 'zwischen', ausdruck: `${a} : ${d}`, von: u, bis: u + 10, gilt: true }, ...N(`${u} · ${d}`, `${u + 10} · ${d}`, `${a} : ${d}`)] });
    },
    3: () => { const d = wahl([14, 15, 16, 24, 25, 26]), q = zz(18, 36) * 10 + zz(2, 9), a = d * q, k = kind();
      const dr = Math.ceil(d / 10) * 10, ar = Math.floor(a / 1000) * 1000, ue = Math.round(ar / dr);
      return auswahl(`${k} rechnet ${fz(a)} : ${d} = ${q}. Die Probe ${q} · ${d} = ${fz(a)} stimmt. Ein grober Überschlag mit ${fz(ar)} : ${dr} ergibt aber nur etwa ${ue}. Was folgt daraus?`,
        [opt(`Das Ergebnis ${q} stimmt. Der Überschlag ist nur grob, weil stark gerundet wurde.`, true), opt(`Das Ergebnis ist falsch, weil der Überschlag etwa ${ue} ergibt und nicht dazu passt.`, false, 'ueberschlag-nicht-gerundet'), opt('Die Probe muss falsch sein.', false, 'probe-falsche-umkehr'), opt('Man nimmt den Mittelwert aus Ergebnis und Überschlag.')],
        h2('Welche Prüfung ist genau, welche nur ungefähr?', 'Die Probe rechnet genau zurück. Der Überschlag zeigt nur die Größenordnung.'), { nachweis: [...N(`${q} · ${d}`, `${a} : ${d}`), { zahl: ar, grund: 'abgerundeter Dividend' }, { zahl: dr, grund: 'aufgerundeter Divisor' }, { zahl: ue, grund: 'gerundeter Überschlagswert' }] }); },
  });

  stufen(D('D5'), 'E', {
    1: () => { const [dr, t] = suche(() => [zz(3, 8) * 10, wahl([100, 200, 300])], ([x, y]) => (x * y) % 1000 === 0 && x * y <= 9000), d = dr + zz(1, 3) * vorzeichen(), a = dr * t + zz(40, 300) * vorzeichen();
      return zahl(`Überschlage sinnvoll: ${fz(a)} : ${d} ≈ ? Runde den Divisor auf Zehner und den Dividenden auf Tausender.`, t, fehlerliste(t, [[t * 10, 'div-stellenwert'], [t / 10, 'div-stellenwert']]),
        h1('Auf welche glatten Zahlen kannst du runden, sodass die Division im Kopf aufgeht?'), { nachweis: [`${a} ≈ ${dr * t}`, `${d} ≈ ${dr}`, ...N(`${dr * t} : ${dr}`)] }); },
    2: (k) => {
      if (k === 0) { const d = suche(() => zz(62, 88), (x) => x % 10 !== 0), a = d * 100 + zz(150, 600);
        return auswahl('Entscheide ohne schriftliche Rechnung: Welcher Quotient ist größer als 100?', [opt(`${fz(a)} : ${d}`, true), opt(`${fz(a - 1000)} : ${d}`, false, 'div-stellenwert'), opt(`${fz(a)} : ${d + 10}`, false, 'div-stellenwert'), opt(`${fz(d * 100 - d)} : ${d}`, false, 'div-stellenwert')],
          h1('Wie groß wäre der Dividend, wenn der Quotient genau 100 wäre?'), { nachweis: [{ art: 'quotientUeber', grenze: 100 }, ...N(`100 · ${d}`, `100 · ${d + 10}`)] }); }
      if (k === 1) { const [a, d, q, r] = restE(23, 48);
        return zahl(`Bei einer Division durch ${d} ist der Quotient ${q} und der Rest ${r}. Bestimme den Dividenden.`, a, fehlerliste(a, [[d * q, 'div-rest-vergessen']]), h1('Wie lautet die Probe bei einer Division mit Rest?'), { nachweis: N(`${q} · ${d} + ${r}`) }); }
      const [dr, t] = suche(() => [zz(3, 6) * 10, zz(1, 3) * 100], ([x, y]) => (x * y) % 1000 === 0 && x * y <= 9000), d = dr - zz(1, 2), a = dr * t + zz(60, 240);
      return auswahl(`Der Überschlag zu einer Division lautet ${fz(dr * t)} : ${dr} = ${t}. Welche Aufgabe wurde überschlagen?`,
        [opt(`${fz(a)} : ${d}`, true), opt(`${fz(a)} : ${d + 40}`, false, 'falsch-gerundet'), opt(`${fz(Math.round(a / 10))} : ${d}`, false, 'div-stellenwert'), opt(`${fz(a * 10)} : ${d}`, false, 'div-stellenwert')],
        h1('Runde bei jeder Aufgabe Dividend und Divisor. Bei welcher entstehen genau diese glatten Zahlen?'), { nachweis: [{ art: 'ueberschlagVon', dividend: dr * t, divisor: dr }, `${a} ≈ ${dr * t}`, `${d} ≈ ${dr}`, ...N(`${dr * t} : ${dr}`)] });
    },
    3: (k) => {
      if (k === 0) return auswahl('Paula rundet bei einem Überschlag zur Division sowohl den Dividenden als auch den Divisor auf. Welche Aussage über ihren Überschlag gilt?',
        [opt('Er kann zu groß oder zu klein sein, weil die beiden Rundungen in entgegengesetzte Richtungen wirken.', true), opt('Er ist dann immer zu groß, weil beide Zahlen durch das Aufrunden größer geworden sind.', false, 'falsch-gerundet'), opt('Er ist dann immer zu klein.', false, 'falsch-gerundet'), opt('Er stimmt dann immer genau.', false, 'ueberschlag-nicht-gerundet')],
        h1('Was bewirkt ein größerer Dividend, was ein größerer Divisor? Probiere 100 : 20, 120 : 20 und 100 : 25.'), { nachweis: N('100 : 20', '120 : 20', '100 : 25') });
      const [a, d, q] = wahl([[4872, 58, 84], [4704, 56, 84], [4902, 57, 86]]), n = kind();
      return auswahl(`${n} überschlägt ${fz(a)} : ${d} mit 5000 : 50 = 100. Der genaue Wert ist ${q}. Warum ist der Überschlag deutlich zu groß?`, [
        opt('Der Dividend wurde vergrößert und der Divisor verkleinert. Beides vergrößert den Quotienten.', true), opt('Der Dividend wurde verkleinert und der Divisor vergrößert. Beides vergrößert den Quotienten.'),
        opt('Bei einem Überschlag darf nur der Dividend gerundet werden.'), opt('Ein Überschlag ergibt immer einen zu großen Wert.', false, 'falsch-gerundet'), opt(`Der Überschlag ist nicht zu groß: 100 und ${q} liegen nah genug beieinander.`)],
      h1('Vergleiche die gerundeten Zahlen mit den genauen: In welche Richtung wurde jeweils verändert?'), { nachweis: N(`${a} : ${d}`, '5000 : 50', `5000 − ${a}`, `${d} − 50`) });
    },
  });

  // ===================================================================
  // D6 Sachaufgaben
  // ===================================================================
  const dingeF = [['Äpfel', 'In jede Tüte', 'Tüten', 'Tüte'], ['Kekse', 'In jede Dose', 'Dosen', 'Dose'], ['Bälle', 'In jede Kiste', 'Kisten', 'Kiste']];
  sechs(D('D6'), 'F', [
    () => { const [a, d, q] = ungleich(2, 5, 2, 6), [ding, inJede, plaetze] = wahl(dingeF);
      return zahl(Z(`Es gibt ${a} ${ding}.`, `${inJede} kommen ${d} ${ding}.`, `Wie viele ${plaetze} werden voll?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [a + d, 'div-falsche-rechenart']]),
        h3(`Lege immer ${d} zusammen. Zähle die Gruppen.`, '24 Äpfel, immer 4 in eine Tüte: 24 : 4 = 6. Es werden 6 Tüten.', `Rechne ${a} : ${d}. Zähle im Bild die Gruppen.`), { einheit: plaetze, bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6), [ding] = wahl(dingeF);
      return zahl(Z(`${d} Kinder teilen ${a} ${ding} gerecht.`, `Wie viele ${ding} bekommt 1 Kind?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart']]),
        h3('Gerecht teilen heißt: Jedes Kind bekommt gleich viele.', a === 15 ? '4 Kinder teilen 8 Kekse: 8 : 4 = 2. Jedes Kind bekommt 2.' : '3 Kinder teilen 15 Kekse: 15 : 3 = 5. Jedes Kind bekommt 5.', `Rechne ${a} : ${d}. Zähle im Bild 1 Gruppe.`), { einheit: ding, bild: B.gruppen(d, q), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = suche(() => einmaleins(2, 5, 3, 6), ([x, y, w]) => y !== w && x !== 2 * y), [ding, , plaetze, platz] = wahl(dingeF);
      return auswahl(Z(`Es gibt ${a} ${ding}.`, `Immer ${d} kommen in 1 ${platz}.`, `Wie viele ${plaetze} sind es?`, 'Welche Rechnung passt?'), [opt(`${a} : ${d}`, true), opt(`${a} − ${d}`, false, 'div-falsche-rechenart'), opt(`${a} · ${d}`, false, 'div-falsche-rechenart')],
        h3('Hier wird in gleiche Gruppen aufgeteilt. Dazu passt geteilt.', '12 Kekse, immer 3 in 1 Dose. Die Rechnung ist 12 : 3.', `Du legst immer ${d} zusammen, bis alle ${a} verteilt sind.`), { bild: B.gruppen(q, d), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = ungleich(2, 5, 2, 6);
      return zahl(Z(`${a} Kinder gehen in ${d} gleich große Gruppen.`, 'Wie viele Kinder sind in 1 Gruppe?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [d, 'sach-falsche-rechnung']]),
        h3('Alle Gruppen sind gleich groß. Du musst teilen.', '12 Kinder in 3 Gruppen: 12 : 3 = 4. In jeder Gruppe sind 4 Kinder.', `Rechne ${a} : ${d}. Zähle im Bild 1 Gruppe.`), { einheit: 'Kinder', bild: B.gruppen(d, q), nachweis: N(`${a} : ${d}`) }); },
    () => { const [a, d, q] = suche(() => einmaleins(2, 5, 3, 6), ([, y, w]) => y !== w);
      return auswahl(Z(`Die Rechnung ist ${a} : ${d} = ${q}.`, 'Welche Geschichte passt?'), [opt(`${a} Kekse werden an ${d} Kinder gerecht verteilt.`, true), opt(`Zu ${a} Keksen kommen noch ${d} Kekse dazu.`, false, 'div-falsche-rechenart'), opt(`Von ${a} Keksen werden ${d} gegessen.`, false, 'div-falsche-rechenart')],
        h3('Geteilt bedeutet: gerecht verteilen.', '10 : 2 = 5 passt zu: 10 Äpfel werden an 2 Kinder verteilt.', 'Suche die Geschichte, in der etwas gerecht verteilt wird.'), { bild: B.gruppen(d, q), nachweis: N(`${a} : ${d}`) }); },
    () => { const w = zz(2, 5);
      return zahl(Z('1 Woche hat 7 Tage.', `Wie viele Wochen sind ${w * 7} Tage?`), w, fehlerliste(w, [[w * 7 - 7, 'div-falsche-rechenart']]),
        h3('Immer 7 Tage sind 1 Woche. Du bildest 7er-Gruppen.', '21 Tage sind 3 Wochen, denn 21 : 7 = 3.', `Rechne ${w * 7} : 7. Zähle im Bild die 7er-Gruppen.`), { einheit: 'Wochen', bild: B.gruppen(w, 7), nachweis: N(`${w * 7} : 7`) }); },
  ]);

  const kaufG = [['Springseile', 'Springseil'], ['Bälle', 'Ball'], ['Bücher', 'Buch'], ['Trikots', 'Trikot']];
  // Preise, die zu den Dingen passen: ein Stück kostet höchstens 29 €.
  const preisG = () => suche(() => { const d = zz(3, 9), q = zz(12, 29); return [d * q, d, q]; }, ([a, , q]) => a >= 100 && q % 10 !== 0);
  stufen(D('D6'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d, q] = preisG(), [viele, eins] = wahl(kaufG);
        return zahl(Z(`Die Klasse kauft ${d} ${viele}.`, 'Alle kosten gleich viel.', `Zusammen kosten sie ${a} €.`, `Wie viel Euro kostet 1 ${eins}?`), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q * 10, 'div-stellenwert']]),
          h3(`Der Preis wird gerecht auf ${d} ${viele} verteilt. Du musst teilen.`, '6 Springseile kosten 138 €. Rechne 120 : 6 = 20 und 18 : 6 = 3. 1 Seil kostet 23 €.', ablauf(a, d)), { einheit: '€', bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) }); }
      if (k === 1) { const w = zz(4, 12);
        return zahl(Z('1 Woche hat 7 Tage.', `Wie viele Wochen sind ${w * 7} Tage?`), w, fehlerliste(w, [[w * 7 - 7, 'div-falsche-rechenart']]),
          h3('Du bildest 7er-Gruppen aus den Tagen. Du musst teilen.', '21 Tage sind 3 Wochen, denn 21 : 7 = 3.', `Rechne ${w * 7} : 7.`), { einheit: 'Wochen', bild: B.gruppen(w, 7), nachweis: N(`${w * 7} : 7`) }); }
      const [a, d, q] = schriftlichG(12, 99);
      return zahl(Z(`${a} Flaschen stehen in ${d} gleich vollen Regalen.`, 'Wie viele Flaschen stehen in 1 Regal?'), q, fehlerliste(q, [[a - d, 'div-falsche-rechenart'], [q * 10, 'div-stellenwert']]),
        h3('Die Flaschen sind gleichmäßig verteilt. Du musst teilen.', '60 Flaschen in 5 Regalen: 60 : 5 = 12. In jedem Regal stehen 12 Flaschen.', ablauf(a, d)), { einheit: 'Flaschen', bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, d] = preisG(), [viele] = wahl(kaufG);
        return auswahl(Z(`${d} ${viele} kosten zusammen ${a} €.`, 'Alle kosten gleich viel.', 'Gesucht ist der Preis für 1 Stück.', 'Welche Rechnung passt?'), [opt(`${a} : ${d}`, true), opt(`${a} · ${d}`, false, 'div-falsche-rechenart'), opt(`${a} − ${d}`, false, 'div-falsche-rechenart')],
          h3('Der Gesamtpreis wird gerecht aufgeteilt.', '4 Bälle kosten 48 €. 1 Ball kostet 48 : 4 = 12 €.', `Der Gesamtpreis ${a} wird geteilt. Er steht vorn.`), { bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) }); }
      const [a, d, q] = schriftlichG(12, 99), n = kind();
      return auswahl(Z(`${a} Flaschen stehen in ${d} gleich vollen Regalen.`, `${n} rechnet ${a} : ${d} = ${q}.`, `Was bedeutet die ${q}?`), [opt(`In jedem Regal stehen ${q} Flaschen.`, true), opt(`Es gibt ${q} Regale.`, false, 'sach-falsche-rechnung'), opt(`${q} Flaschen bleiben am Ende übrig.`, false, 'div-rest-vergessen')],
        h3('Lies noch einmal: Was ist gegeben? Was wurde ausgerechnet?', '60 Flaschen in 5 Regalen: 60 : 5 = 12. In jedem Regal stehen 12 Flaschen.', `Die Zahl der Regale kennst du schon: ${d}. Die ${q} sagt etwas über 1 Regal.`), { bild: B.material(hze(a)), nachweis: N(`${a} : ${d}`) });
    },
    3: () => { const [a, d, q] = preisG(), [viele, eins] = wahl(kaufG), n = kind();
      return auswahl(Z(`${d} ${viele} kosten zusammen ${a} €.`, `${n} rechnet ${a} − ${d} = ${a - d}.`, `${n} sagt: „1 ${eins} kostet ${a - d} €.“`, 'Stimmt das?'),
        [opt(`Falsch. Hier wird geteilt: ${a} : ${d} = ${q}. 1 ${eins} kostet ${q} €.`, true), opt(`Stimmt. ${a} − ${d} = ${a - d}.`, false, 'div-falsche-rechenart'), opt(`Falsch. Hier wird mal gerechnet: ${a} · ${d}. So viel kostet 1 ${eins}.`, false, 'div-falsche-rechenart')],
        h3('Überlege: Kann 1 Stück fast so viel kosten wie alle zusammen?', '4 Bälle kosten 48 €. 1 Ball kostet 48 : 4 = 12 €. Nicht 48 − 4 = 44 €.', `Prüfe die Antwort: ${d} mal ${a - d} € wäre viel mehr als ${a} €.`), { bild: B.material(hze(a)), nachweis: N(U(false), `${a} : ${d}`, `${a} − ${d}`) }); },
  });

  const zweischrittM = [
    (a, b, n) => ({ text: `Ein Bauer erntet ${fz(a)} kg Kartoffeln. ${fz(b)} kg behält er selbst. Den Rest füllt er gleichmäßig in ${n} Säcke.`, f1: 'Wie viel Kilogramm füllt er in Säcke?', e1: 'kg', f2: 'Wie viel Kilogramm sind in einem Sack?', e2: 'kg' }),
    (a, b, n) => ({ text: `Ein Ausflug kostet ${fz(a)} €. Der Förderverein übernimmt ${fz(b)} €. Den Rest teilen sich ${n} Kinder gleichmäßig.`, f1: 'Wie viel Geld müssen die Kinder zusammen zahlen?', e1: '€', f2: 'Wie viel zahlt jedes Kind?', e2: '€' }),
    (a, b, n) => ({ text: `Eine Schule bekommt ${fz(a)} Hefte. ${fz(b)} Hefte kommen ins Lager. Die übrigen werden gleichmäßig an ${n} Klassen verteilt.`, f1: 'Wie viele Hefte werden verteilt?', e1: 'Hefte', f2: 'Wie viele Hefte bekommt jede Klasse?', e2: 'Hefte' }),
  ];
  stufen(D('D6'), 'M', {
    1: () => { const d = zz(12, 28), q = zz(24, 148), a = d * q;
      const [text, einheit] = wahl([[`Eine Reise kostet für ${d} Personen zusammen ${fz(a)} €. Alle zahlen gleich viel. Wie viel zahlt eine Person?`, '€'],
        [`${fz(a)} Flaschen werden gleichmäßig auf ${d} Kästen verteilt. Wie viele Flaschen kommen in einen Kasten?`, 'Flaschen'],
        [`Ein Lkw legt in ${d} Tagen ${fz(a)} km zurück, jeden Tag gleich viel. Wie viele Kilometer fährt er an einem Tag?`, 'km']]);
      return zahl(text, q, fehlerliste(q, [[q * 10, 'div-stellenwert'], [a - d, 'sach-falsche-rechnung']]), h2('Hier wird gleichmäßig verteilt. Welche Rechenart passt?', `Rechne ${fz(a)} : ${d}.`), { einheit, nachweis: N(`${a} : ${d}`) }); },
    2: (k) => {
      const n = zz(12, 28), q = zz(35, 180), b = zz(15, 90) * 10, a = q * n + b, kx = zweischrittM[zz(0, 2)](a, b, n);
      if (k === 0) return sach(kx.text, [teil(kx.f1, a - b, kx.e1), teil(kx.f2, q, kx.e2, fehlerliste(q, [[a % n === 0 ? a / n : -1, 'sach-schritt-vergessen']]))],
        h2('Rechne Schritt für Schritt: erst abziehen, dann gleichmäßig teilen.', `Für die erste Frage rechnest du ${fz(a)} − ${fz(b)}.`), { nachweis: N(`${a} − ${b}`, `${a - b} : ${n}`) });
      if (k === 1) return auswahl(`${kx.text} ${kx.f2} Welcher Rechenausdruck passt?`, [opt(`(${fz(a)} − ${fz(b)}) : ${n}`, true), opt(`${fz(a)} − ${fz(b)} : ${n}`, false, 'sach-schritt-vergessen'), opt(`${fz(a)} : ${n} − ${fz(b)}`, false, 'sach-falsche-rechnung'), opt(`(${fz(a)} + ${fz(b)}) : ${n}`, false, 'sach-falsche-rechnung')],
        h2('Was muss zuerst berechnet werden? Das gehört in die Klammer.', 'Erst wird abgezogen, dann wird das Ergebnis geteilt.'), { nachweis: N(`(${a} − ${b}) : ${n}`) });
      const p = zz(6, 12), je = wahl([12, 24]), pal = wahl([20, 30]);
      return zahl(`In einer Fabrik werden ${fz(p * je * pal)} Flaschen in Kästen zu je ${je} Flaschen gepackt. Je ${pal} Kästen kommen auf eine Palette. Wie viele Paletten werden voll?`, p, fehlerliste(p, [[p * pal, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst die Zahl der Kästen, dann die Zahl der Paletten.', `Kästen: ${fz(p * je * pal)} : ${je} = ${fz(p * pal)}.`), { einheit: 'Paletten', nachweis: N(`${p * je * pal} : ${je}`, `${p * pal} : ${pal}`) });
    },
    3: () => { const n = zz(18, 27), q = zz(16, 24), a = n * q, weniger = q - zz(2, 4), k = kind();
      return auswahl(`Der Ausflug kostet für ${n} Kinder zusammen ${fz(a)} €. ${k} sagt: „Wenn jedes Kind ${weniger} € mitbringt, reicht das Geld.“ Beurteile die Aussage.`,
        [opt(`Falsch: ${n} · ${weniger} € = ${fz(n * weniger)} €, es fehlen ${fz(a - n * weniger)} €. Nötig sind ${q} € pro Kind.`, true), opt(`Richtig: ${weniger} € sind fast ${q} €, das genügt bei so vielen Kindern.`, false, 'div-rest-nicht-gedeutet'), opt(`Richtig: ${fz(a)} : ${weniger} ist mehr als ${n}.`, false, 'sach-falsche-rechnung'), opt(`Falsch: Jedes Kind muss ${n} € zahlen.`, false, 'div-vertauscht')],
        h2('Berechne, wie viel jedes Kind zahlen muss, oder wie viel bei dem Vorschlag zusammenkommt.', `Rechne ${fz(a)} : ${n} oder ${n} · ${weniger}.`), { nachweis: N(U(false), `${n} · ${weniger}`, `${a} − ${n * weniger}`, `${a} : ${n}`) }); },
  });

  const unnoetigE = [
    (k, m, d, n) => [`Ein Obsthof erntet ${k} Kisten mit je ${m} kg Äpfeln. Die Äpfel werden in Säcke zu je ${d} kg umgefüllt. Die Ernte dauert ${n} Tage. Wie viele Säcke werden gefüllt?`, 'Säcke'],
    (k, m, d, n) => [`Eine Firma liefert ${k} Paletten mit je ${m} Dosen. Die Dosen werden in Kartons zu je ${d} Dosen verpackt. Der Lkw fährt ${n} km weit. Wie viele Kartons werden gebraucht?`, 'Kartons'],
    (k, m, d, n) => [`Für ein Schulfest werden ${k} Packungen mit je ${m} Bechern gekauft. Die Becher werden gleichmäßig auf ${d} Stände verteilt. Das Fest dauert ${n} Stunden. Wie viele Becher bekommt jeder Stand?`, 'Becher'],
  ];
  stufen(D('D6'), 'E', {
    1: () => { const d = zz(12, 28), q = zz(24, 148), a = d * q, n = suche(() => zz(3, 9), (x) => a % x !== 0 || a / x !== q);
      const [text, einheit] = wahl([[`Eine Reisegruppe aus ${d} Personen zahlt zusammen ${fz(a)} € für eine Fahrt, die ${n} Tage dauert. Alle zahlen gleich viel. Wie viel zahlt eine Person?`, '€'],
        [`${fz(a)} Flaschen werden gleichmäßig auf ${d} Kästen verteilt. Der Transport dauert ${n} Stunden. Wie viele Flaschen kommen in einen Kasten?`, 'Flaschen']]);
      return zahl(text, q, fehlerliste(q, [[a % n === 0 ? a / n : -1, 'sach-unnoetige-angabe'], [q * 10, 'div-stellenwert']]), h1('Welche Angaben brauchst du für die Frage, welche nicht?'), { einheit, nachweis: [UEBERFLUESSIG(n), ...N(`${a} : ${d}`)] }); },
    2: (k) => {
      if (k === 0) { const d = wahl([12, 15, 16, 18, 24, 25]);
        const [kk, m] = suche(() => [zz(14, 48), zz(15, 60)], ([x, y]) => (x * y) % d === 0 && x % d !== 0 && y % d !== 0);
        const n = zz(3, 9), [text, einheit] = unnoetigE[zz(0, 2)](kk, m, d, n), loesung = (kk * m) / d;
        return zahl(text, loesung, fehlerliste(loesung, [[kk * m, 'sach-schritt-vergessen'], [(kk * m) % n === 0 ? (kk * m) / n : -1, 'sach-unnoetige-angabe']]),
          h1('Welche Gesamtmenge wird verteilt? Welche Zahl im Text spielt für die Frage keine Rolle?'), { einheit, nachweis: [UEBERFLUESSIG(n), ...N(`${kk} · ${m}`, `${kk * m} : ${d}`)] }); }
      if (k === 1) { const [n, unten] = suche(() => [zz(20, 60) * 12, wahl([10, 20, 30])], ([x, u]) => Array.from({ length: 9 }, (_, i) => u + 1 + i).filter((v) => x % v === 0).length === 1);
        const oben = unten + 10, reihen = Array.from({ length: 9 }, (_, i) => unten + 1 + i).find((v) => n % v === 0);
        return zahl(`${n} Stühle sollen in gleich lange Reihen gestellt werden. Es sollen mehr als ${unten} und weniger als ${oben} Reihen sein, und kein Stuhl darf übrig bleiben. Wie viele Reihen sind es?`, reihen, [],
          h1(`Welche Zahlen zwischen ${unten} und ${oben} teilen ${n} ohne Rest? Teilbarkeitsregeln sparen Rechenarbeit.`), { einheit: 'Reihen', nachweis: [{ art: 'teilerZwischen', zahl: n, von: unten, bis: oben, teiler: reihen }, ...N(`${n} : ${reihen}`)] }); }
      const [p, je, ab] = suche(() => [zz(10, 24), zz(15, 60), zz(2, 6)], ([x, y, w]) => x > w + 4 && (x * y) % (x - w) === 0);
      return zahl(`Ein Betrag wird gleichmäßig auf ${p} Personen verteilt. Jede müsste ${je} € zahlen. Dann sagen ${ab} Personen ab. Wie viel zahlt nun jede der übrigen Personen?`, (p * je) / (p - ab),
        fehlerliste((p * je) / (p - ab), [[je, 'sach-schritt-vergessen'], [p * je, 'sach-schritt-vergessen']]), h1('Welche Größe bleibt gleich, wenn Personen absagen?'), { einheit: '€', nachweis: N(`${p} · ${je}`, `${p} − ${ab}`, `${p * je} : ${p - ab}`) });
    },
    3: (k) => {
      if (k === 0) { const [was, richtig, falsch, bsp] = wahl([
        ['Die Gruppe wird doppelt so groß.', 'Jede Person zahlt nur noch die Hälfte.', ['Jede Person zahlt doppelt so viel.', 'Jede Person zahlt 2 € weniger.', 'Der Betrag pro Person bleibt gleich.', 'Das hängt von der Höhe der Rechnung ab.'], ['120 : 4', '120 : 8', '200 : 4', '200 : 8']],
        ['Die Gruppe wird halb so groß.', 'Jede Person zahlt doppelt so viel.', ['Jede Person zahlt nur noch die Hälfte.', 'Jede Person zahlt 2 € mehr.', 'Der Betrag pro Person bleibt gleich.', 'Das hängt von der Höhe der Rechnung ab.'], ['120 : 8', '120 : 4', '200 : 8', '200 : 4']],
      ]);
        return auswahl(`Eine Rechnung wird gleichmäßig auf eine Gruppe verteilt. ${was} Welche Aussage gilt immer, egal wie hoch die Rechnung ist?`, [opt(richtig, true), ...falsch.map((f) => opt(f, false, 'sach-falsche-rechnung'))],
          h1('Prüfe an zwei verschiedenen Beträgen. Was bleibt gleich, was ändert sich?'), { nachweis: N(...bsp) }); }
      const stufenZahl = wahl([5, 6]), klassen = 4;
      return auswahl(`Eine Schule hat ${stufenZahl} Klassenstufen mit je ${klassen} Klassen. Alle Kinder fahren gemeinsam mit Reisebussen zu einem Ausflug. Schätze die fehlenden Angaben selbst. Wie viele Reisebusse werden ungefähr gebraucht?`, [
        opt('etwa 10', true), opt('etwa 2'), opt('etwa 50'), opt('etwa 100'), opt('etwa 500', false, 'sach-schritt-vergessen')],
      h1('Schätze, wie viele Kinder in einer Klasse sind und wie viele Plätze ein Reisebus hat.'), { nachweis: [{ zahl: 25, grund: 'geschätzte Kinder je Klasse' }, { zahl: 50, grund: 'geschätzte Plätze je Reisebus' }, ...N(`${stufenZahl} · ${klassen}`, `${stufenZahl * klassen} · 25`, `${stufenZahl * klassen * 25} : 50`)] });
    },
  });
}
