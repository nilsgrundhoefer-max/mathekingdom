// Aufgaben zum Abstecher 5.4.X1 „Zahlenmuster“ (Lernziele Z1 und Z2) nach ADR 0015.
//   F  Plus- und Minusfolgen am Zahlenstrahl, wachsende Punktefelder, Verdoppeln
//   G  Mal-Folgen, Quadratzahlen, Unterschiede, Mal-Mauer
//   M  wachsende Unterschiede (Differenzen), Rückwärts-Mauer, zwei Regeln passen zu denselben Zahlen
//   E  Stelle in einer Folge, Mauer von oben nach unten, Begründungen

import { sechs, stufen, zahl, auswahl, opt, luecken, mauer, Z, N, B, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder, U, WERT, HILFSZAHL } from '../werkzeug.mjs';

const X = (kurz) => `5.4.X1-${kurz}`;
const FR = 'muster-falsche-regel';
const liste = (werte) => werte.join(', ');
const plusFolge = (a, d, n) => Array.from({ length: n }, (_, i) => a + i * d);
const malFolge = (a, m, n) => Array.from({ length: n }, (_, i) => a * m ** i);
// Nachweis einer Folge: jede Zahl entsteht aus der Zahl davor.
const schritte = (werte, zeichen) => werte.slice(1).map((w, i) => {
  const v = werte[i];
  if (zeichen === '+') return w >= v ? `${v} + ${w - v}` : `${v} − ${v - w}`;
  if (zeichen === '·') return w >= v ? `${v} · ${w / v}` : `${v} : ${v / w}`;
  return `${v} + ${v}`;
});
// Zahlenstrahl zu einer Folge. `offen`: Nummern der Sprünge, deren Weite nicht dasteht.
function strahlZu(werte, offen = []) {
  const min = Math.min(...werte), max = Math.max(...werte);
  const von = Math.floor(min / 10) * 10, bis = Math.max(Math.ceil(max / 10) * 10, von + 10);
  const schritt = bis - von <= 60 ? 1 : werte.every((w) => (w - von) % 2 === 0) && bis - von <= 120 ? 2 : 5;
  return B.strahl({ von, bis, schritt, beschriftung: 10, start: werte[0],
    spruenge: werte.slice(1).map((w, i) => ({ von: werte[i], nach: w, text: offen.includes(i) ? '?' : `${w > werte[i] ? '+' : '−'} ${Math.abs(w - werte[i])}` })) });
}

export function zahlenmuster() {
  // ===================================================================
  // Z1 Zahlenmuster fortsetzen
  // ===================================================================
  sechs(X('Z1'), 'F', [
    () => { const [a, d] = [zz(1, 6), zz(2, 5)], f = plusFolge(a, d, 5);
      return luecken(Z('Wie geht es weiter?', `${liste(f.slice(0, 4))}, {{x}}`), { x: [f[4], fehlerliste(f[4], [[f[3] + 1, FR]])] },
        h3('Schau auf die Sprünge am Zahlenstrahl.', d === 2 ? '1, 4, 7, 10: Es kommt immer 3 dazu. Dann kommt 13.' : '1, 3, 5, 7: Es kommt immer 2 dazu. Dann kommt 9.', `Es kommt immer ${d} dazu.`), { bild: strahlZu(f, [3]), nachweis: N(...schritte(f, '+')) }); },
    () => { const [a, d] = [zz(3, 4) * 10, zz(2, 5)], f = plusFolge(a, -d, 5);
      return luecken(Z('Wie geht es weiter?', `${liste(f.slice(0, 4))}, {{x}}`), { x: [f[4], fehlerliste(f[4], [[f[3] + d, FR], [f[3] - 1, FR]])] },
        h3('Die Zahlen werden kleiner. Schau auf die Sprünge.', d === 4 ? '20, 17, 14, 11: Es kommt immer 3 weg. Dann kommt 8.' : '20, 16, 12, 8: Es kommt immer 4 weg. Dann kommt 4.', `Es kommt immer ${d} weg.`), { bild: strahlZu(f, [3]), nachweis: N(...schritte(f, '+')) }); },
    () => { const s = zz(3, 6), f = [s, 2 * s, 3 * s, 4 * s];
      return luecken(Z('Jede Reihe hat gleich viele Punkte.', 'Zähle Reihe für Reihe weiter.', `${liste(f.slice(0, 3))}, {{x}}`), { x: [f[3], fehlerliste(f[3], [[f[2] + 1, FR]])] },
        h3('Mit jeder Reihe kommen gleich viele Punkte dazu.', s === 2 ? '3, 6, 9: Es kommen immer 3 dazu. Dann kommt 12.' : '2, 4, 6: Es kommen immer 2 dazu. Dann kommt 8.', `Es kommen immer ${s} dazu.`), { bild: B.feld(3, s), nachweis: N(...schritte(f, '+')) }); },
    () => { const [a, d] = suche(() => [zz(2, 8), wahl([2, 5, 10])], ([x, y]) => x !== y && x + 4 * y <= 60), f = plusFolge(a, d, 5);
      return auswahl(Z('Welche Zahl kommt als Nächstes?', liste(f.slice(0, 4))), [opt(String(f[4]), true), opt(String(f[3] + 1), false, FR), opt(String(f[4] + d))],
        h3('Wie viel kommt von Zahl zu Zahl dazu?', d === 5 ? '3, 13, 23, 33: Es kommt immer 10 dazu. Dann kommt 43.' : '3, 8, 13, 18: Es kommt immer 5 dazu. Dann kommt 23.', `Es kommt immer ${d} dazu.`), { bild: strahlZu(f, [3]), nachweis: N(...schritte(f, '+')) }); },
    () => { const [a, d] = suche(() => [zz(1, 6), zz(2, 5)], ([x, y]) => x !== y), f = plusFolge(a, d, 5);
      return luecken(Z('Zwei Zahlen fehlen.', `${f[0]}, {{x}}, ${f[2]}, ${f[3]}, {{y}}`), { x: [f[1], fehlerliste(f[1], [[f[0] + 1, FR]])], y: f[4] },
        h3('Schau auf zwei Nachbarzahlen, die beide dastehen.', d === 2 ? '1, ▢, 7, 10: Von 7 bis 10 sind es 3. Also fehlt 4.' : '2, ▢, 6, 8: Von 6 bis 8 sind es 2. Also fehlt 4.', `Von ${f[2]} bis ${f[3]} sind es ${d}.`), { bild: strahlZu(f, [0, 1, 3]), nachweis: N(...schritte(f, '+')) }); },
    () => { const a = wahl([1, 3]), f = [a, 2 * a, 4 * a, 8 * a, 16 * a];
      return luecken(Z('Jede Zahl ist das Doppelte der Zahl davor.', 'Wie heißt die nächste Zahl?', `${liste(f.slice(0, 4))}, {{x}}`), { x: [f[4], fehlerliste(f[4], [[f[3] + f[3] - f[2], FR], [f[3] + a, FR]])] },
        h3('Das Doppelte heißt: Rechne die Zahl plus die Zahl.', a === 1 ? '5, 10, 20: 20 + 20 = 40. Dann kommt 40.' : '2, 4, 8: 8 + 8 = 16. Dann kommt 16.', `Rechne ${f[3]} + ${f[3]}.`), { bild: strahlZu(f, [3]), nachweis: N(...schritte(f, 'doppelt')) }); },
  ]);

  stufen(X('Z1'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d] = [zz(11, 39), zz(6, 15)], f = plusFolge(a, d, 6);
        return luecken(Z('Setze die Zahlenfolge fort.', `${liste(f.slice(0, 4))}, {{x}}, {{y}}`), { x: [f[4], fehlerliste(f[4], [[f[3] + 10, FR]])], y: f[5] },
          h3('Bestimme den Unterschied zwischen zwei Nachbarzahlen.', d === 7 ? '12, 20, 28: Der Unterschied ist 8. Dann kommen 36 und 44.' : '12, 19, 26: Der Unterschied ist 7. Dann kommen 33 und 40.', `${f[1]} − ${f[0]} = ${d}.`), { nachweis: N(`${f[1]} − ${f[0]}`, ...schritte(f, '+')) }); }
      if (k === 1) { const [a, m] = suche(() => [zz(2, 4), zz(3, 4)], ([x, y]) => x !== y), f = malFolge(a, m, 5);
        return luecken(Z('Setze die Zahlenfolge fort.', `${liste(f.slice(0, 4))}, {{x}}`), { x: [f[4], fehlerliste(f[4], [[f[3] + f[3] - f[2], FR]])] },
          h3('Die Unterschiede sind nicht gleich. Probiere es mit Mal.', m === 3 ? '2, 8, 32: Immer mal 4. Dann kommt 128.' : '2, 6, 18: Immer mal 3. Dann kommt 54.', `${f[0]} · ${m} = ${f[1]}.`), { nachweis: N(`${f[1]} : ${f[0]}`, ...schritte(f, '·')) }); }
      const [a, d] = [wahl([100, 90, 80]), zz(6, 9)], f = plusFolge(a, -d, 5);
      return luecken(Z('Setze die Zahlenfolge fort.', `${liste(f.slice(0, 3))}, {{x}}, {{y}}`), { x: [f[3], fehlerliste(f[3], [[f[2] - 10, FR]])], y: f[4] },
        h3('Die Zahlen werden kleiner. Bestimme den Unterschied.', d === 7 ? '90, 82, 74: Immer 8 weniger. Dann kommen 66 und 58.' : '90, 83, 76: Immer 7 weniger. Dann kommen 69 und 62.', `${f[0]} − ${f[1]} = ${d}.`), { bild: strahlZu(f, [2, 3]), nachweis: N(...schritte(f, '+')) });
    },
    2: (k) => {
      if (k === 0) { const n = zz(2, 5), q = [n, n + 1, n + 2, n + 3].map((x) => x * x);
        return zahl(Z('Das sind Quadratzahlen.', `${n} · ${n} = ${q[0]}`, `${n + 1} · ${n + 1} = ${q[1]}`, `${n + 2} · ${n + 2} = ${q[2]}`, 'Wie heißt die nächste Quadratzahl?'), q[3], fehlerliste(q[3], [[q[2] + q[2] - q[1], FR], [(n + 3) * 2, 'potenz-mal-exponent']]),
          h3('Die nächste Zahl mal sich selbst.', n === 2 ? '7 · 7 = 49, 8 · 8 = 64. Dann kommt 9 · 9 = 81.' : '1 · 1 = 1, 2 · 2 = 4. Dann kommt 3 · 3 = 9.', `Rechne ${n + 3} · ${n + 3}.`), { bild: B.quadrat(n + 2), nachweis: [HILFSZAHL(n + 3, 'nächste Zahl'), ...N(`${n} · ${n}`, `${n + 1} · ${n + 1}`, `${n + 2} · ${n + 2}`, `${n + 3} · ${n + 3}`)] }); }
      const [a, b, c] = suche(() => [zz(2, 5), zz(2, 4), zz(2, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3);
      return mauer(Z('Das ist eine Mal-Mauer.', 'Jeder Stein ist das Produkt der beiden Steine darunter.', 'Fülle die leeren Steine aus.'), '·', [a, b, c], [[1, 0], [1, 1], [2, 0]],
        h3('Nimm die beiden Steine darunter mal.', 'Unten 6 und 7: Darüber steht 42.', `Unten links: ${a} · ${b} = ${a * b}.`));
    },
    3: () => { const a = wahl([2, 3, 5]), f = malFolge(a, 2, 4), kn = kind();
      return auswahl(Z(`${kn} sagt:`, `„Bei ${liste(f)} kommt immer ${a} dazu.“`, 'Stimmt das?'), [
        opt(Z('Falsch.', 'Jede Zahl ist das Doppelte der Zahl davor.', `Nach ${f[3]} kommt ${2 * f[3]}.`), true),
        opt(Z('Stimmt.', `${a} + ${a} = ${2 * a}.`), false, FR),
        opt(Z('Falsch.', 'Es geht abwechselnd plus und mal weiter.'))],
      h3('Prüfe die Regel an allen Zahlen, nicht nur an den ersten beiden.', a === 5 ? '3, 6, 12: Von 3 bis 6 sind es 3, von 6 bis 12 aber 6.' : '5, 10, 20: Von 5 bis 10 sind es 5, von 10 bis 20 aber 10.', `Von ${f[1]} bis ${f[2]} sind es ${f[2] - f[1]}.`), { bild: strahlZu(f), nachweis: [U(false), ...N(...schritte(f, 'doppelt'), `${f[3]} + ${f[3]}`, `${f[2]} − ${f[1]}`)] }); },
  });

  stufen(X('Z1'), 'M', {
    1: (k) => {
      if (k === 0) { const a = zz(2, 9), f = [a, a + 1, a + 3, a + 6, a + 10, a + 15];
        return luecken(`Setze die Zahlenfolge fort: ${liste(f.slice(0, 5))}, {{x}}`, { x: [f[5], fehlerliste(f[5], [[f[4] + 4, FR]])] },
          h2('Schreibe die Unterschiede zwischen den Nachbarzahlen auf.', `Die Unterschiede sind 1, 2, 3, 4. Als Nächstes kommt 5 dazu.`), { nachweis: N(...schritte(f, '+')) }); }
      const [a, m] = [zz(2, 3), wahl([4, 5])], f = malFolge(a, m, 4);
      return luecken(`Setze die Zahlenfolge fort: ${liste(f.slice(0, 3))}, {{x}}`, { x: [f[3], fehlerliste(f[3], [[f[2] + f[2] - f[1], FR]])] },
        h2('Prüfe, ob immer mit derselben Zahl malgenommen wird.', `${f[1]} : ${f[0]} = ${m}.`), { nachweis: N(...schritte(f, '·')) });
    },
    2: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(2, 6), zz(2, 5), zz(2, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x * y * y * z <= 600);
        return mauer('Das ist eine Mal-Mauer. Unten fehlt ein Stein. Fülle alle leeren Steine aus.', '·', [a, b, c], [[0, 1], [1, 1], [2, 0]],
          h2('Rechne zuerst den fehlenden unteren Stein aus. Geteilt ist die Umkehrung von Mal.', `${a * b} : ${a} = ${b}.`)); }
      if (k === 1) { const a = zz(3, 9), f = malFolge(a, 2, 5);
        return luecken(`Zwei Zahlen fehlen: ${f[0]}, {{x}}, ${f[2]}, ${f[3]}, {{y}}`, { x: [f[1], fehlerliste(f[1], [[(f[0] + f[2]) / 2, FR]])], y: f[4] },
          h2('Schau zuerst auf die beiden Nachbarzahlen, die dastehen.', `${f[3]} : ${f[2]} = 2.`), { nachweis: N(...schritte(f, '·')) }); }
      const [a, s] = [zz(2, 9), zz(2, 4)], f = [0, 1, 2, 3, 4].reduce((w, i) => [...w, w.at(-1) + s * (i + 1)], [a]);
      return zahl(`Bei der Zahlenfolge ${liste(f.slice(0, 5))} werden die Differenzen immer um ${s} größer. Wie heißt die nächste Zahl?`, f[5], fehlerliste(f[5], [[f[4] + 4 * s, FR], [f[4] + s, FR]]),
        h2('Schreibe die Differenzen auf und setze sie fort.', `Die Differenzen sind ${liste([1, 2, 3, 4].map((i) => s * i))}.`), { nachweis: N(...f.slice(1, 5).map((w, i) => `${w} − ${f[i]}`), `${4 * s} + ${s}`, ...schritte(f, '+')) });
    },
    3: () => { const a = zz(2, 5), [k1, k2] = zweiKinder();
      return auswahl(`Die Folge beginnt mit ${a}, ${2 * a}, ${4 * a}. ${k1} sagt: „Als Nächstes kommt ${8 * a}.“ ${k2} sagt: „Als Nächstes kommt ${7 * a}.“ Wer hat recht?`, [
        opt(`Beide. Bei „immer mal 2“ kommt ${8 * a}. Bei „die Unterschiede ${a}, ${2 * a} werden immer um ${a} größer“ kommt ${7 * a}. Drei Zahlen legen die Regel nicht fest.`, true),
        opt(`Nur ${k1}. Eine Zahlenfolge geht immer mit Mal weiter.`, false, FR),
        opt(`Nur ${k2}. Man muss immer auf die Unterschiede schauen.`, false, FR),
        opt(`Keiner. Es kommt immer ${2 * a} dazu, also kommt ${6 * a}.`, false, FR)],
      h2('Suche zwei verschiedene Regeln, die zu den drei Zahlen passen.', `${2 * a} − ${a} = ${a} und ${4 * a} − ${2 * a} = ${2 * a}.`), { nachweis: N(`${a} · 2`, `${2 * a} · 2`, `${4 * a} · 2`, `${2 * a} − ${a}`, `${4 * a} − ${2 * a}`, `${2 * a} + ${a}`, `${4 * a} + ${3 * a}`) }); },
  });

  stufen(X('Z1'), 'E', {
    1: () => { const s = zz(2, 6), f = [81, 27, 9, 3, 1].map((x) => x * s);
      return luecken(`Setze die Zahlenfolge fort: ${liste(f.slice(0, 4))}, {{x}}`, { x: [f[4], fehlerliste(f[4], [[f[3] - (f[2] - f[3]) / 3, FR]])] },
        h1('Die Zahlen werden schnell kleiner. Wird immer gleich viel weggenommen?'), { nachweis: N(...schritte(f, '·')) }); },
    2: (k) => {
      if (k === 0) { const [a, b, c] = suche(() => [zz(2, 6), zz(2, 5), zz(2, 6)], ([x, y, z]) => new Set([x, y, z]).size === 3 && x * y * y * z <= 1000);
        return mauer('In dieser Mal-Mauer stehen nur der oberste Stein und zwei untere Steine. Fülle alle leeren Steine aus.', '·', [a, b, c], [[0, 0], [1, 0], [1, 1]],
          h1('Welchen Stein kannst du aus den beiden unteren Steinen sofort ausrechnen?')); }
      if (k === 1) { const n = zz(1, 3), f = [0, 1, 2, 3, 4, 5].map((i) => (n + i) * (n + i) + 1);
        return luecken(`Setze die Zahlenfolge fort: ${liste(f.slice(0, 5))}, {{x}}`, { x: [f[5], fehlerliste(f[5], [[f[4] + f[4] - f[3], FR]])] },
          h1('Vergleiche die Zahlen mit den Quadratzahlen.'), { nachweis: [HILFSZAHL(n + 5, 'nächste Zahl'), ...N(`${n + 5} · ${n + 5}`, `${(n + 5) * (n + 5)} + 1`, ...schritte(f, '+'))] }); }
      const [a, d, n] = [zz(2, 9), zz(3, 7), wahl([10, 20, 30])];
      return zahl(`Die Zahlenfolge ${liste(plusFolge(a, d, 4))} geht immer plus ${d} weiter. Welche Zahl steht an der ${n}. Stelle?`, a + (n - 1) * d, fehlerliste(a + (n - 1) * d, [[a + n * d, FR], [n * d, FR]]),
        h1('Wie viele Sprünge brauchst du von der ersten Zahl bis zur Zahl an dieser Stelle?'), { nachweis: N(...schritte(plusFolge(a, d, 4), '+'), `${n} − 1`, `${n - 1} · ${d}`, `${a} + ${(n - 1) * d}`) });
    },
    3: (k) => {
      if (k === 0) { const d = wahl([3, 4, 6, 7]), t = suche(() => zz(100, 150), (x) => x % d !== 0), q = Math.floor(t / d), kn = kind();
        return auswahl(`${kn} sagt: „In der Zahlenfolge ${liste(plusFolge(d, d, 4))}, … kommt irgendwann die Zahl ${t} vor.“ Stimmt das?`, [
          opt(`Falsch. Alle Zahlen der Folge stehen in der ${d}er-Reihe. ${t} liegt zwischen ${q} · ${d} = ${q * d} und ${q + 1} · ${d} = ${(q + 1) * d}.`, true),
          opt('Stimmt. Die Folge geht immer weiter, also kommt jede Zahl einmal vor.', false, FR),
          opt(`Stimmt. Man muss nur lange genug ${d} dazuzählen.`, false, FR),
          opt(`Falsch. In der Folge kommen nur Zahlen bis 100 vor.`)],
        h1(`Welche Zahlen bekommst du, wenn du bei ${d} anfängst und immer ${d} dazuzählst?`), { nachweis: [U(false), ...N(...schritte(plusFolge(d, d, 4), '+'), `${q} · ${d}`, `${q + 1} · ${d}`)] }); }
      const [a, b, c] = suche(() => [zz(2, 5), zz(2, 4), zz(2, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3), t = a * b * b * c, [k1, k2] = zweiKinder();
      return auswahl(`In einer Mal-Mauer stehen unten ${a}, ${b} und ${c}. Oben steht ${t}. ${k1} sagt: „Verdopple ich den mittleren unteren Stein, wird der oberste Stein doppelt so groß.“ ${k2} sagt: „Er wird viermal so groß.“ Wer hat recht?`, [
        opt(`${k2}. Der mittlere Stein steckt in beiden Steinen darüber. Mit ${2 * b} steht oben ${a * 2 * b} · ${2 * b * c} = ${4 * t}, und das ist 4 · ${t}.`, true),
        opt(`${k1}. Ein Stein wird doppelt so groß, also wird alles doppelt so groß.`, false, FR),
        opt('Beide. Es kommt darauf an, wie man rechnet.'),
        opt('Keiner. Der oberste Stein bleibt gleich.')],
      h1('Rechne die Mauer mit dem verdoppelten Stein neu aus und vergleiche.'), { nachweis: N(`${a} · ${b}`, `${b} · ${c}`, `${a * b} · ${b * c}`, `${b} + ${b}`, `${a} · ${2 * b}`, `${2 * b} · ${c}`, `${2 * a * b} · ${2 * b * c}`, `4 · ${t}`) }); },
  });

  // ===================================================================
  // Z2 Die Regel eines Zahlenmusters beschreiben
  // ===================================================================
  sechs(X('Z2'), 'F', [
    () => { const [a, d] = suche(() => [zz(1, 9), zz(2, 5)], ([x, y]) => !plusFolge(x, y, 4).includes(y + 1)), f = plusFolge(a, d, 4);
      return auswahl(Z('Welche Regel passt?', liste(f)), [opt(`Immer plus ${d}.`, true), opt(`Immer plus ${d + 1}.`), opt(`Immer minus ${d}.`)],
        h3('Schau auf die Sprünge am Zahlenstrahl.', d === 3 ? '2, 4, 6, 8: Es kommt immer 2 dazu.' : '1, 4, 7, 10: Es kommt immer 3 dazu.', `Von ${f[0]} bis ${f[1]} sind es ${d}.`), { bild: strahlZu(f, [1, 2]), nachweis: N(...schritte(f, '+')) }); },
    () => { const [a, d] = suche(() => [zz(2, 4) * 10, zz(2, 5)], ([x, y]) => !plusFolge(x, -y, 4).includes(y + 1)), f = plusFolge(a, -d, 4);
      return auswahl(Z('Welche Regel passt?', liste(f)), [opt(`Immer minus ${d}.`, true), opt(`Immer plus ${d}.`), opt(`Immer minus ${d + 1}.`)],
        h3('Die Zahlen werden kleiner. Schau auf die Sprünge.', d === 2 ? '20, 17, 14: Es kommt immer 3 weg.' : '20, 18, 16: Es kommt immer 2 weg.', `Von ${f[0]} bis ${f[1]} sind es ${d}.`), { bild: strahlZu(f, [1, 2]), nachweis: N(...schritte(f, '+')) }); },
    () => { const s = zz(3, 6), f = [s, 2 * s, 3 * s];
      return auswahl(Z('Jede Reihe hat gleich viele Punkte.', `Zähle Reihe für Reihe: ${liste(f)}.`, 'Welche Regel passt?'), [opt(`Immer plus ${s}.`, true), opt('Immer plus 1.', false, FR), opt('Immer das Doppelte.', false, FR)],
        h3('Wie viele Punkte kommen mit einer Reihe dazu?', s === 2 ? '3, 6, 9: Mit jeder Reihe kommen 3 dazu.' : '2, 4, 6: Mit jeder Reihe kommen 2 dazu.', `Zähle die Punkte in 1 Reihe.`), { bild: B.feld(3, s), nachweis: N(...schritte(f, '+')) }); },
    () => { const a = wahl([1, 2, 3]), f = [a, 2 * a, 4 * a, 8 * a];
      return auswahl(Z('Welche Regel passt?', liste(f)), [opt('Jede Zahl ist das Doppelte der Zahl davor.', true), opt(`Immer plus ${a}.`, false, FR), opt(`Immer plus ${2 * a}.`, false, FR)],
        h3('Prüfe die Regel an allen Zahlen.', a === 5 ? '3, 6, 12: 3 + 3 = 6 und 6 + 6 = 12.' : '5, 10, 20: 5 + 5 = 10 und 10 + 10 = 20.', `${f[1]} + ${f[1]} = ${f[2]}.`), { bild: strahlZu(f), nachweis: N(...schritte(f, 'doppelt')) }); },
    () => { const [a, d] = suche(() => [zz(1, 9), zz(2, 5)], ([x, y]) => x !== y), f = plusFolge(a, d, 4);
      return luecken(Z(`Die Regel heißt: immer plus ${d}.`, `Starte bei ${a}.`, `${a}, {{x}}, {{y}}, {{z}}`), { x: [f[1], fehlerliste(f[1], [[a + 1, FR]])], y: f[2], z: f[3] },
        h3('Springe am Zahlenstrahl immer gleich weit.', d === 3 ? 'Regel: immer plus 2. Start bei 1: 1, 3, 5, 7.' : 'Regel: immer plus 3. Start bei 1: 1, 4, 7, 10.', `${a} + ${d} = ${f[1]}.`), { bild: strahlZu(f, [0, 1, 2]), nachweis: N(...schritte(f, '+')) }); },
    () => { const [a, d] = [zz(3, 5) * 10, wahl([2, 5, 10])], f = plusFolge(a, -d, 4);
      return luecken(Z(`Die Regel heißt: immer minus ${d}.`, `Starte bei ${a}.`, `${a}, {{x}}, {{y}}, {{z}}`), { x: [f[1], fehlerliste(f[1], [[a + d, FR]])], y: f[2], z: f[3] },
        h3('Springe am Zahlenstrahl immer gleich weit zurück.', d === 2 ? 'Regel: immer minus 5. Start bei 20: 20, 15, 10, 5.' : 'Regel: immer minus 2. Start bei 20: 20, 18, 16, 14.', `${a} − ${d} = ${f[1]}.`), { bild: strahlZu(f, [0, 1, 2]), nachweis: N(...schritte(f, '+')) }); },
  ]);

  stufen(X('Z2'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d] = suche(() => [zz(11, 29), zz(4, 9)], ([x, y]) => x % 10 !== 0), f = plusFolge(a, d, 4);
        return luecken(Z('Ergänze die Regel.', liste(f), 'Die Regel heißt: immer plus {{x}}.'), { x: [d, fehlerliste(d, [[f[1], FR]])] },
          h3('Rechne den Unterschied zwischen zwei Nachbarzahlen aus.', d === 6 ? '13, 20, 27: 20 − 13 = 7.' : '13, 19, 25: 19 − 13 = 6.', `${f[1]} − ${f[0]} = ?`), { bild: strahlZu(f, [0, 1, 2]), nachweis: N(...f.slice(1).map((w, i) => `${w} − ${f[i]}`)) }); }
      if (k === 1) { const [a, m] = suche(() => [zz(2, 5), zz(3, 5)], ([x, y]) => x !== y), f = malFolge(a, m, 4);
        return luecken(Z('Ergänze die Regel.', liste(f), 'Die Regel heißt: immer mal {{x}}.'), { x: [m, fehlerliste(m, [[f[1] - f[0], FR]])] },
          h3('Die Unterschiede sind nicht gleich. Mit welcher Zahl wird malgenommen?', m === 3 ? '2, 8, 32: 2 · 4 = 8. Immer mal 4.' : '2, 6, 18: 2 · 3 = 6. Immer mal 3.', `${f[0]} · ? = ${f[1]}.`), { nachweis: N(...f.slice(1).map((w, i) => `${w} : ${f[i]}`)) }); }
      const [a, d] = [wahl([100, 90, 80]), zz(6, 9)], f = plusFolge(a, -d, 4);
      return luecken(Z('Ergänze die Regel.', liste(f), 'Die Regel heißt: immer minus {{x}}.'), { x: [d, fehlerliste(d, [[f[1], FR]])] },
        h3('Rechne den Unterschied zwischen zwei Nachbarzahlen aus.', d === 7 ? '90, 82, 74: 90 − 82 = 8.' : '90, 83, 76: 90 − 83 = 7.', `${f[0]} − ${f[1]} = ?`), { bild: strahlZu(f, [0, 1, 2]), nachweis: N(...f.slice(1).map((w, i) => `${f[i]} − ${w}`)) });
    },
    2: (k) => {
      if (k === 0) { const n = zz(1, 4), q = [n, n + 1, n + 2, n + 3].map((x) => x * x);
        return luecken(Z('Das sind Quadratzahlen.', liste(q), 'Schreibe die Unterschiede auf: {{a}}, {{b}}, {{c}}'), { a: q[1] - q[0], b: [q[2] - q[1], fehlerliste(q[2] - q[1], [[q[1] - q[0], FR]])], c: q[3] - q[2] },
          h3('Rechne immer die größere minus die kleinere Zahl.', n === 4 ? '1, 4, 9: 4 − 1 = 3 und 9 − 4 = 5.' : '16, 25, 36: 25 − 16 = 9 und 36 − 25 = 11.', `${q[1]} − ${q[0]} = ${q[1] - q[0]}.`), { bild: B.quadrat(n + 3), nachweis: N(`${q[1]} − ${q[0]}`, `${q[2]} − ${q[1]}`, `${q[3]} − ${q[2]}`) }); }
      const [a, m] = suche(() => [zz(2, 4), zz(3, 4)], ([x, y]) => x !== y), f = malFolge(a, m, 4), p = plusFolge(a, m, 4), q = plusFolge(m, m, 4);
      return auswahl(Z(`Die Regel heißt: immer mal ${m}.`, `Starte bei ${a}.`, 'Welche Zahlenfolge passt?'), [opt(liste(f), true), opt(liste(p), false, FR), opt(liste(q), false, FR)],
        h3('Rechne die zweite Zahl aus. Rechne dann weiter.', m === 3 ? 'Immer mal 4, Start bei 1: 1, 4, 16, 64.' : 'Immer mal 3, Start bei 1: 1, 3, 9, 27.', `${a} · ${m} = ${a * m}.`), { nachweis: N(...schritte(f, '·')) });
    },
    3: () => { const a = wahl([3, 5, 6]), f = malFolge(a, 2, 4), kn = kind();
      return auswahl(Z(`${kn} sagt:`, `„Die Regel von ${liste(f)} heißt: immer plus ${a}.“`, 'Stimmt das?'), [
        opt(Z('Falsch.', `Von ${f[1]} bis ${f[2]} sind es ${f[2] - f[1]}.`, 'Die Regel heißt: immer mal 2.'), true),
        opt(Z('Stimmt.', `${a} + ${a} = ${2 * a}.`), false, FR),
        opt(Z('Falsch.', `Die Regel heißt: immer plus ${2 * a}.`), false, FR)],
      h3('Prüfe die Regel an allen Zahlen.', a === 5 ? '3, 6, 12: 3 + 3 = 6, aber 6 + 3 = 9.' : '5, 10, 20: 5 + 5 = 10, aber 10 + 5 = 15.', `Rechne ${f[1]} + ${a}. Kommt ${f[2]} heraus?`), { nachweis: [U(false), ...N(`${a} + ${a}`, `${f[2]} − ${f[1]}`, `${f[1]} + ${a}`, ...schritte(f, '·'))] }); },
  });

  stufen(X('Z2'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, s] = [zz(2, 9), zz(2, 5)], f = [0, 1, 2, 3].reduce((w, i) => [...w, w.at(-1) + s * (i + 1)], [a]);
        return luecken(`Bei ${liste(f)} werden die Differenzen immer um {{x}} größer.`, { x: [s, fehlerliste(s, [[f[1] - f[0] + s, FR]])] },
          h2('Schreibe die Differenzen der Nachbarzahlen auf. Vergleiche sie dann.', `${f[1]} − ${f[0]} = ${s} und ${f[2]} − ${f[1]} = ${2 * s}.`), { nachweis: N(...f.slice(1).map((w, i) => `${w} − ${f[i]}`), `${2 * s} − ${s}`) }); }
      const a = zz(3, 9), f = malFolge(a, 2, 5);
      return luecken(`Die Regel heißt: immer mal 2. Ergänze die ersten beiden Zahlen: {{x}}, {{y}}, ${liste(f.slice(2))}`, { x: [f[0], fehlerliste(f[0], [[f[2] - 2, FR]])], y: f[1] },
        h2('Gehe rückwärts. Das Gegenteil von mal 2 ist geteilt durch 2.', `${f[2]} : 2 = ${f[1]}.`), { nachweis: N(`${f[2]} : 2`, `${f[1]} : 2`, ...schritte(f, '·')) });
    },
    2: (k) => {
      if (k === 0) { const a = zz(3, 6), f = [a, 2 * a, 2 * a - 2, 4 * a - 4, 4 * a - 6, 8 * a - 12];
        return auswahl(`Welche Regel passt zu ${liste(f)}?`, [opt('Abwechselnd mal 2 und minus 2.', true), opt(`Abwechselnd plus ${a} und minus 2.`, false, FR), opt(`Immer plus ${a}.`, false, FR), opt('Abwechselnd mal 2 und plus 2.')],
          h2('Prüfe jede Regel an allen Zahlen, nicht nur an den ersten.', `${f[0]} · 2 = ${f[1]} und ${f[1]} − 2 = ${f[2]}.`), { nachweis: N(`${f[0]} · 2`, `${f[1]} − 2`, `${f[2]} · 2`, `${f[3]} − 2`, `${f[4]} · 2`) }); }
      if (k === 1) { const [a, m] = suche(() => [zz(2, 4), zz(3, 5)], ([x, y]) => x !== y), f = malFolge(a, m, 5);
        return luecken(`${liste(f.slice(0, 4))}: Die Regel heißt immer mal {{x}}. Die nächste Zahl ist {{y}}.`, { x: [m, fehlerliste(m, [[f[1] - f[0], FR]])], y: [f[4], fehlerliste(f[4], [[f[3] + f[3] - f[2], FR]])] },
          h2('Teile eine Zahl durch die Zahl davor.', `${f[1]} : ${f[0]} = ${m}.`), { nachweis: N(...f.slice(1).map((w, i) => `${w} : ${f[i]}`), `${f[3]} · ${m}`) }); }
      return auswahl('Welche Regel beschreibt die Zahlenfolge 1, 4, 9, 16, 25?', [
        opt('Das sind die Quadratzahlen 1 · 1, 2 · 2, 3 · 3, 4 · 4 und 5 · 5.', true),
        opt('Immer plus 3.', false, FR), opt('Immer mal 4.', false, FR), opt('Die Differenzen sind immer gleich.', false, FR)],
      h2('Prüfe jede Regel an allen Zahlen.', '4 − 1 = 3, aber 9 − 4 = 5.'), { bild: B.quadrat(5), nachweis: [...N('1 · 1', '2 · 2', '3 · 3', '4 · 4', '5 · 5', '4 − 1', '9 − 4')] });
    },
    3: () => { const d = zz(3, 9), r = zz(1, d - 1), f = plusFolge(d + r, d, 4), [k1, k2] = zweiKinder();
      return auswahl(`Zur Zahlenfolge ${liste(f)} sagt ${k1}: „Die Regel heißt: immer plus ${d}.“ ${k2} sagt: „Das sind die Zahlen der ${d}er-Reihe, jeweils plus ${r}.“ Wer hat recht?`, [
        opt(`Beide. Es kommt immer ${d} dazu. Und ${f[0]} = ${d} + ${r}, ${f[1]} = ${2 * d} + ${r} und so weiter. Eine Folge kann man mit verschiedenen Regeln beschreiben.`, true),
        opt(`Nur ${k1}. Eine Regel muss immer von Zahl zu Zahl gehen.`),
        opt(`Nur ${k2}. Bei „immer plus ${d}“ müsste die Folge bei ${d} anfangen.`, false, FR),
        opt(`Keiner. Die Regel heißt: immer mal 2.`, false, FR)],
      h2('Prüfe beide Regeln an allen Zahlen.', `${f[1]} − ${f[0]} = ${d} und ${f[0]} − ${d} = ${r}.`), { nachweis: N(...schritte(f, '+'), `${d} + ${r}`, `${2 * d} + ${r}`, `${3 * d} + ${r}`, `${4 * d} + ${r}`, `${f[0]} − ${d}`) }); },
  });

  stufen(X('Z2'), 'E', {
    1: () => { const [s, m] = [zz(2, 5), zz(3, 5)], f = malFolge(s, m, 4).reverse();
      return luecken(`${liste(f)}: Die Regel heißt immer geteilt durch {{x}}.`, { x: [m, fehlerliste(m, [[f[0] - f[1], FR]])] },
        h1('Die Zahlen werden nicht immer um gleich viel kleiner.'), { nachweis: N(...f.slice(1).map((w, i) => `${f[i]} : ${w}`)) }); },
    2: (k) => {
      if (k === 0) { const [a, c] = suche(() => [zz(2, 6), zz(1, 3)], ([x, y]) => x !== y), f = [0, 1, 2, 3].reduce((w) => [...w, w.at(-1) * 2 + c], [a]);
        return luecken(`${liste(f)}: Die Regel heißt: mal {{x}}, dann plus {{y}}.`, { x: 2, y: [c, fehlerliste(c, [[f[1] - f[0], FR]])] },
          h1('Die Unterschiede werden immer größer. Probiere es mit Mal und Plus.'), { nachweis: N(`${f[1]} − ${f[0]} · 2`, `(${f[2]} − ${f[1]}) : (${f[1]} − ${f[0]})`, ...f.slice(1).map((w, i) => `${f[i]} · 2 + ${c}`), ...f.slice(1).map((w, i) => `${w} − ${f[i]}`)) }); }
      if (k === 1) { const [a, b, c] = suche(() => [zz(2, 5), zz(2, 4), zz(2, 5)], ([x, y, z]) => new Set([x, y, z]).size === 3), t = a * b * b * c;
        return auswahl(`Unten in einer Mal-Mauer stehen ${a}, ${b} und ${c}. Welcher Term ergibt den obersten Stein?`, [
          opt(`${a} · ${b} · ${b} · ${c}`, true), opt(`${a} · ${b} · ${c}`, false, FR), opt(`${a} · ${b} + ${b} · ${c}`), opt(`(${a} + ${c}) · ${b}`)],
        h1('Schreibe zuerst die beiden mittleren Steine als Produkt.'), { nachweis: [WERT(t), ...N(`${a} · ${b}`, `${b} · ${c}`, `${a * b} · ${b * c}`)] }); }
      const [a, d, s] = suche(() => [zz(2, 9), zz(2, 5), zz(2, 4)], ([, x, y]) => x !== y), df = [0, 1, 2, 3].map((i) => d + i * s), f = df.reduce((w, x) => [...w, w.at(-1) + x], [a]);
      return luecken(`${liste(f)}: Die Unterschiede sind {{a}}, {{b}}, {{c}}, {{e}}. Sie werden immer um {{s}} größer.`, { a: df[0], b: df[1], c: df[2], e: df[3], s: [s, fehlerliste(s, [[d, FR]])] },
        h1('Schreibe die Unterschiede auf. Vergleiche dann die Unterschiede miteinander.'), { nachweis: N(...f.slice(1).map((w, i) => `${w} − ${f[i]}`), `${df[1]} − ${df[0]}`) });
    },
    3: (k) => {
      if (k === 0) { const a = wahl([3, 5, 7, 9]), f = malFolge(a, 2, 4);
        return auswahl(`Warum ist in der Zahlenfolge ${liste(f)}, … ab der zweiten Zahl jede Zahl gerade?`, [
          opt('Jede Zahl ist das Doppelte der Zahl davor. Ein Doppeltes ist immer gerade.', true),
          opt(`Weil man immer plus ${a} rechnet.`, false, FR),
          opt('Weil die Zahlen immer größer werden.'),
          opt('Das stimmt nur zufällig für diese vier Zahlen.')],
        h1('Mit welcher Rechnung kommst du von einer Zahl zur nächsten?'), { nachweis: N(...schritte(f, '·')) }); }
      const a = zz(2, 5), f = malFolge(a, 3, 4), [k1, k2] = zweiKinder();
      return auswahl(`Zur Zahlenfolge ${liste(f)} sagt ${k1}: „Die Regel heißt: immer mal 3.“ ${k2} sagt: „Der Unterschied zur nächsten Zahl ist immer das Doppelte der Zahl davor.“ Wer hat recht?`, [
        opt(`Beide. Eine Zahl plus ihr Doppeltes ist dasselbe wie die Zahl mal 3: ${a} + 2 · ${a} = 3 · ${a} = ${3 * a}.`, true),
        opt(`Nur ${k1}. Unterschiede gibt es nur bei Plus-Folgen.`, false, FR),
        opt(`Nur ${k2}. Bei mal 3 wären die Unterschiede immer gleich.`, false, FR),
        opt(`Keiner. Die Regel heißt: immer plus ${2 * a}.`, false, FR)],
      h1('Prüfe beide Regeln an allen Zahlen.'), { nachweis: N(...schritte(f, '·'), ...f.slice(1).map((w, i) => `${w} − ${f[i]}`), ...f.slice(0, 3).map((w) => `2 · ${w}`), `${a} + 2 · ${a}`) }); },
  });
}
