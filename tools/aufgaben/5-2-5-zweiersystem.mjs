// Aufgaben zu 5.2.5 „Zweiersystem“ (Lernziele Z1 und Z2) nach ADR 0015 und ADR 0030.
// Z1 vom Zweiersystem ins Zehnersystem, Z2 vom Zehnersystem ins Zweiersystem.
// F bis 15 an der Tafel 8, 4, 2, 1 mit Plättchen, G bis 31, M bis 255 ohne Spaltenköpfe, E Strukturfragen und freie Eingabe.
// Schreibweise: 1011₂ (ab G). Eingabe: F und G Ziffernfelder mit Spaltenköpfen, M ohne Köpfe, E freies Feld mit den Tasten 0 und 1.

import { sechs, zahl, auswahl, opt, luecken, zuordnen, ordnen, zeichen, stellentafel, L, Z, N, B, h1, h2, h3, zz, wahl, suche, mische, fehlerliste, kind, U, HILFSZAHL, dual, TIEF2 } from '../werkzeug.mjs';
import { EINS, zeichenwahl, verschieden } from './5-2-1-zahlenstrahl.mjs';

const Z_ = (kurz) => `5.2.5-${kurz}`;
const d2 = (n) => `${dual(n)}${TIEF2}`;
const D = (n, extra = {}) => ({ art: 'dual', dual: dual(n), wert: n, ...extra });
const um = (n, stellen) => parseInt(dual(n).padStart(stellen, '0').split('').reverse().join(''), 2);
const werte = (n) => { const t = dual(n); return [...t].map((c, i) => (c === '1' ? 2 ** (t.length - 1 - i) : 0)).filter(Boolean); };
const einsen = (n) => werte(n).length;
// Typische Fehler beim Lesen: umgedreht gelesen, als Zehnerzahl gelesen, Einsen gezählt.
const lesefehler = (n, stellen = dual(n).length) => fehlerliste(n, [[um(n, stellen), 'dual-umgedreht'], [Number(dual(n)), 'dual-zehnerwerte'], [[...dual(n).padStart(stellen, '0')].reduce((s, c, i) => s + (c === '1' ? [2, 4, 6, 8, 10, 12, 14, 16][stellen - 1 - i] : 0), 0), 'dual-gerade-werte']]);
// Tafel zum Eintragen: je Zeile eine Zahl, ein Feld je Stelle. koepfe: false lässt die Spaltenköpfe leer (ab M).
function trage2(text, zahlen, stellen, hilfen, { koepfe = true, nachweis = [] } = {}) {
  const kopf = Array.from({ length: stellen }, (_, i) => (koepfe ? String(2 ** (stellen - 1 - i)) : ''));
  const lsg = {}, zeilen = zahlen.map((n, r) => [...dual(n).padStart(stellen, '0')].map((c, i) => { const name = `${'abcd'[r]}${i}`; lsg[name] = [Number(c), fehlerliste(Number(c), [[1 - Number(c), 'dual-umgedreht']]).slice(0, 0)]; return L(name); }));
  return stellentafel(text, kopf, zeilen, lsg, hilfen, { nachweis: [...zahlen.map((n, r) => ({ art: 'tafel', zahl: n, basis: 2, zeile: r, ziffern: [...dual(n).padStart(stellen, '0')].map(Number) })), ...nachweis] });
}
const mitEinsen = (von, bis, min = 2, max = 9) => suche(() => zz(von, bis), (x) => einsen(x) >= min && einsen(x) <= max && um(x, dual(x).length) !== x);
const frei = (text, n, hilfen, nachweis = []) => zeichen(text, dual(n), ['0', '1'], [[dual(n).split('').reverse().join('').replace(/^0+/, ''), 'dual-umgedreht'], [dual(n + 1), 'dual-gerade-werte']], hilfen, { nachweis: [D(n), ...nachweis] });

export function zweiersystem() {
  // =====================================================================
  // Z1 Vom Zweiersystem ins Zehnersystem
  // =====================================================================
  sechs(Z_('Z1'), 'F', [
    () => { const n = mitEinsen(3, 14);
      return zahl(Z('In der Tafel liegen Plättchen.', 'Über jeder Spalte steht ihr Wert.', 'Welche Zahl ist gelegt?'), n, lesefehler(n, 4),
        h3('Zähle die Werte der Spalten zusammen, in denen ein Plättchen liegt.', 'Plättchen bei 8 und bei 2: Das ist 8 + 2 = 10.', `Es liegen Plättchen bei ${werte(n).join(' und ')}.`), { bild: B.dualTafel(n, 4, true), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }] }); },
    () => { const n = mitEinsen(3, 14);
      return zahl(Z('In der Tafel stehen nur die Ziffern 0 und 1.', '1 heißt: Der Wert der Spalte zählt mit.', 'Welche Zahl ist es?'), n, lesefehler(n, 4),
        h3('Zähle die Werte der Spalten zusammen, in denen eine 1 steht.', 'Eine 1 bei 4 und eine 1 bei 1: Das ist 4 + 1 = 5.', `Eine 1 steht bei ${werte(n).join(' und ')}.`), { bild: B.dualTafel(n, 4, false), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }] }); },
    () => { const n = mitEinsen(5, 15, 2, 3);
      return luecken(Z(`In der Tafel liegen ${einsen(n)} Plättchen.`, 'Rechne aus, welche Zahl gelegt ist.', `${werte(n).join(' + ')} = {{a}}`), { a: [n, lesefehler(n, 4)] },
        h3('Jedes Plättchen ist so viel wert, wie über seiner Spalte steht.', '8 + 2 + 1 = 11', `Zähle Schritt für Schritt zusammen. Beginne mit ${werte(n)[0]}.`), { bild: B.dualTafel(n, 4, true), nachweis: [HILFSZAHL(einsen(n), 'Zahl der Plättchen'), ...N(werte(n).join(' + '))] }); },
    () => { const n = mitEinsen(3, 14), l = [n, um(n, 4), einsen(n)];
      if (new Set(l).size < 3) return null;
      return auswahl(Z('Schau auf die Tafel.', 'Welche Zahl zeigt sie?'), [opt(String(n), true), opt(String(um(n, 4)), false, 'dual-umgedreht'), opt(String(einsen(n)), false, 'dual-zehnerwerte')],
        h3('Es zählt nicht, wie viele Plättchen es sind. Es zählt, wo sie liegen.', 'Ein Plättchen bei 8 ist 8 wert.', `Es liegen Plättchen bei ${werte(n).join(' und ')}.`), { bild: B.dualTafel(n, 4, true), nachweis: [D(n)] }); },
    () => { const w = wahl([1, 2, 4, 8]), n = suche(() => zz(1, 14), (x) => !werte(x).includes(w) && x + w <= 15 && einsen(x) >= 1);
      return zahl(Z(`Die Tafel zeigt eine Zahl.`, `Jetzt kommt ein Plättchen bei ${w} dazu.`, 'Welche Zahl ist es danach?'), n + w, fehlerliste(n + w, [[n, 'dual-zehnerwerte'], [n + 1, 'dual-zehnerwerte']]),
        h3('Rechne zuerst aus, welche Zahl die Tafel zeigt. Zähle dann den neuen Wert dazu.', 'Die Tafel zeigt 5. Ein Plättchen bei 2 kommt dazu: 5 + 2 = 7.', `Die Tafel zeigt ${n}. Das neue Plättchen ist ${w} wert.`), { bild: B.dualTafel(n, 4, true), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }, ...N(`${n} + ${w}`)] }); },
    () => { const n = mitEinsen(3, 7, 2, 2);
      return zahl(Z('Diese Tafel hat nur 3 Spalten.', 'Welche Zahl ist gelegt?'), n, lesefehler(n, 3),
        h3('Zähle die Werte der Spalten mit Plättchen zusammen.', 'Plättchen bei 4 und bei 1: Das ist 4 + 1 = 5.', `Es liegen Plättchen bei ${werte(n).join(' und ')}.`), { bild: B.dualTafel(n, 3, true), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }, HILFSZAHL(3, 'Zahl der Spalten')] }); },
  ]);
  sechs(Z_('Z1'), 'G', [
    () => { const n = mitEinsen(17, 30);
      return zahl(Z('Die Tafel zeigt eine Zahl im Zweiersystem.', 'Wie heißt die Zahl im Zehnersystem?'), n, lesefehler(n, 5),
        h3('Zähle die Stellenwerte zusammen, bei denen eine 1 steht.', '1 bei 16, 1 bei 4, 1 bei 2: Das ist 16 + 4 + 2 = 22.', `Eine 1 steht bei ${werte(n).join(', ')}.`), { bild: B.dualTafel(n, 5, false), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }] }); },
    () => { const n = mitEinsen(9, 30);
      return zahl(Z(`Die kleine 2 zeigt: Die Zahl steht im Zweiersystem.`, `Wie heißt ${d2(n)} im Zehnersystem?`), n, lesefehler(n),
        h3('Die Stellenwerte von rechts: 1, 2, 4, 8, 16.', '1011₂: 1 bei 8, 0 bei 4, 1 bei 2, 1 bei 1. Das ist 8 + 2 + 1 = 11.', `Die Ziffer ganz links steht beim Stellenwert ${2 ** (dual(n).length - 1)}.`), { nachweis: [D(n), HILFSZAHL(2, 'das Zeichen für das Zweiersystem')] }); },
    () => { const n = mitEinsen(19, 30, 3, 3), [x, y, z] = werte(n);
      return luecken(Z(`Zerlege die Zahl ${d2(n)}.`, `${x} + {{a}} + {{b}} = {{c}}`, 'Schreibe die Stellenwerte der Größe nach.'), { a: y, b: z, c: [n, lesefehler(n, 5)] },
        h3('Schreibe für jede 1 den Wert ihrer Spalte auf.', '11010₂: 16 + 8 + 2 = 26', `Die zweite 1 von links steht bei ${y}.`), { bild: B.dualTafel(n, 5, false), nachweis: [D(n), ...N(`${x} + ${y} + ${z}`)] }); },
    () => { const n = mitEinsen(9, 15), l = [n, um(n, 4), Number(dual(n).slice(0, 2))];
      const falsch = suche(() => zz(3, 15), (x) => x !== n && x !== um(n, 4));
      return auswahl(Z(`Welche Zahl im Zehnersystem ist ${d2(n)}?`), [opt(String(n), true), opt(String(um(n, 4)), false, 'dual-umgedreht'), opt(String(falsch), false, 'dual-gerade-werte')],
        h3('Die Stellenwerte von rechts: 1, 2, 4, 8.', '1101₂: 8 + 4 + 1 = 13.', `Die Ziffer ganz links steht beim Stellenwert 8.`), { nachweis: [D(n)] }); },
    () => { const n = wahl([3, 7, 15, 11, 5, 13, 23]);
      return zahl(Z(`Die Tafel zeigt die Zahl ${d2(n)}.`, 'Welche Zahl im Zehnersystem ist um 1 größer?'), n + 1, fehlerliste(n + 1, [[n, 'dual-zehnerwerte'], [Number(dual(n)) + 1, 'dual-zehnerwerte']]),
        h3('Rechne zuerst aus, welche Zahl die Tafel zeigt. Zähle dann 1 dazu.', '111₂ ist 4 + 2 + 1 = 7. Um 1 größer ist 8.', `Die Tafel zeigt ${werte(n).join(' + ')}.`), { bild: B.dualTafel(n, 5, true), nachweis: [D(n), EINS, ...N(`${n} + 1`)] }); },
    () => { const k = kind(), n = wahl([5, 6, 3]), wort = { 101: 'hunderteins', 110: 'hundertzehn', 11: 'elf' }[Number(dual(n))];
      return auswahl(Z(`${k} liest die Zahl ${d2(n)} als ${wort}.`, 'Stimmt das?'), [opt('Stimmt. Die Ziffern liest man wie bei jeder anderen Zahl.', false, 'dual-zehnerwerte'), opt(`Falsch. Im Zweiersystem zählen andere Stellenwerte. Die Zahl ist ${n}.`, true), opt(`Falsch. Die Zahl ist ${einsen(n)}.`, false, 'dual-zehnerwerte')],
        h3('Im Zweiersystem sind die Stellen von rechts 1, 2 und 4 wert.', '101₂: 4 + 1 = 5.', `Eine 1 steht bei ${werte(n).join(' und bei ')}.`), { nachweis: [U(false), D(n, { nurWert: true })] }); },
  ]);
  sechs(Z_('Z1'), 'M', [
    () => { const n = mitEinsen(33, 62);
      return zahl(`Wandle die Dualzahl ${d2(n)} ins Zehnersystem um.`, n, lesefehler(n), h2('Schreibe unter jede Ziffer ihren Stellenwert: von rechts 1, 2, 4, 8, 16, 32.', `Die Zahl ist ${werte(n).join(' + ')}.`), { nachweis: [D(n)] }); },
    () => { const n = mitEinsen(130, 254, 3, 6);
      return zahl(`Wandle die Dualzahl ${d2(n)} ins Zehnersystem um.`, n, lesefehler(n), h2('Die Dualzahl hat acht Stellen. Die Stelle ganz links hat den Wert 128.', `Addiere die Stellenwerte ${werte(n).join(', ')}.`), { nachweis: [D(n)] }); },
    () => { const a = wahl([8, 16, 32]), b = a - 1;
      const [l, r] = mische([a, b]);
      return auswahl(`Welches Zeichen passt? ${d2(l)} ▢ ${d2(r)}`, zeichenwahl(l, r).map((o) => (o.fehlvorstellung ? { ...o, fehlvorstellung: 'dual-zehnerwerte' } : o)), h2('Auch im Zweiersystem gilt: Die Zahl mit mehr Stellen ist größer.', `${d2(a)} ist ${a}, ${d2(b)} ist ${b}.`), { nachweis: [{ art: 'vergleich', links: d2(l), rechts: d2(r), zeichen: l < r ? '<' : '>', system: 'dual' }] }); },
    () => { const l = verschieden(() => mitEinsen(5, 31), 4);
      return zuordnen('Ordne jeder Dualzahl die Zahl im Zehnersystem zu.', l.map((n) => [d2(n), n]), h2('Wandle jede Dualzahl einzeln um. Beginne mit der kürzesten.', `${d2(l[0])} ist ${werte(l[0]).join(' + ')}.`), { nachweis: l.map((n) => D(n)) }); },
    () => luecken('Die Stellenwerte im Zweiersystem verdoppeln sich von rechts nach links: 1, 2, 4, 8, 16, {{a}}, {{b}}, {{c}}.', { a: [32, fehlerliste(32, [[18, 'dual-gerade-werte'], [20, 'dual-gerade-werte']])], b: [64, fehlerliste(64, [[20, 'dual-gerade-werte'], [48, 'dual-gerade-werte']])], c: [128, fehlerliste(128, [[22, 'dual-gerade-werte'], [96, 'dual-gerade-werte']])] },
      h2('Jeder Stellenwert ist doppelt so groß wie der Stellenwert rechts daneben.', 'Nach der 16 kommt 16 · 2.'), { nachweis: N('1 · 2', '2 · 2', '4 · 2', '8 · 2', '16 · 2', '32 · 2', '64 · 2') }),
    () => { const st = wahl([5, 6, 7]), n = 2 ** st - 1;
      return zahl(`Wie heißt die größte Zahl, die man im Zweiersystem mit ${st} Stellen schreiben kann? Gib sie im Zehnersystem an.`, n, fehlerliste(n, [[n + 1, 'dual-gerade-werte'], [2 ** (st - 1), 'dual-zehnerwerte'], [Number('1'.repeat(st)) > 256 ? null : Number('1'.repeat(st)), 'dual-zehnerwerte']].filter(([w]) => w != null)),
        h2('Bei der größten Zahl steht an jeder Stelle eine 1.', `Addiere die Stellenwerte ${werte(n).join(', ')}.`), { nachweis: [D(n), HILFSZAHL(st, 'Zahl der Stellen')] }); },
  ]);
  sechs(Z_('Z1'), 'E', [
    () => { const n = mitEinsen(260, 1000, 3, 6);
      return zahl(`Wandle die Dualzahl ${d2(n)} ins Zehnersystem um.`, n, lesefehler(n).filter((f) => f.wert < 5000), h1('Bestimme zuerst den Stellenwert der Ziffer ganz links, indem du von rechts immer verdoppelst.'), { nachweis: [D(n)] }); },
    () => auswahl('Woran erkennt man im Zweiersystem sofort, dass eine Zahl gerade ist?', [opt('Die letzte Ziffer ist eine 0.', true), opt('Die Zahl hat eine gerade Anzahl von Stellen.', false), opt('Die erste Ziffer ist eine 1.', false), opt('Die Zahl enthält eine gerade Anzahl von Einsen.', false), opt('Das kann man nicht erkennen, man muss umrechnen.', false, 'dual-zehnerwerte')],
      h1('Alle Stellenwerte außer einem einzigen sind gerade Zahlen.')),
    () => { const st = wahl([4, 5, 6, 7]);
      return zahl(`Wie viele verschiedene Zahlen kann man im Zweiersystem mit höchstens ${st} Stellen schreiben? Die 0 zählt mit.`, 2 ** st, fehlerliste(2 ** st, [[2 ** st - 1, 'begriffe-verwechselt'], [2 * st, 'dual-gerade-werte'], [st * st, 'dual-gerade-werte']]),
        h1('An jeder Stelle gibt es zwei Möglichkeiten. Mit jeder weiteren Stelle verdoppelt sich die Anzahl.'), { nachweis: [HILFSZAHL(st, 'Zahl der Stellen'), ...N(Array(st).fill(2).join(' · '))] }); },
    () => { const n = wahl([5, 7, 9, 11, 13]);
      return luecken(`Die Dualzahl ${d2(n)} ist im Zehnersystem die Zahl ${n}. Hängt man rechts eine 0 an, erhält man ${d2(2 * n)}, das ist {{a}}. Hängt man noch eine 0 an, erhält man ${d2(4 * n)}, das ist {{b}}.`, { a: [2 * n, fehlerliste(2 * n, [[10 * n, 'dual-zehnerwerte'], [n, 'dual-zehnerwerte']])], b: [4 * n, fehlerliste(4 * n, [[100 * n, 'dual-zehnerwerte'], [3 * n, 'dual-gerade-werte']])] },
        h1('Jede Ziffer rückt beim Anhängen einer 0 um eine Stelle nach links. Überlege, was dabei mit ihrem Stellenwert geschieht.'), { nachweis: [D(n), D(2 * n), D(4 * n)] }); },
    () => { const l = verschieden(() => zz(5, 40), 4).sort((x, y) => x - y);
      if (new Set(l.map((x) => dual(x).length)).size < 2) return null;
      return ordnen('Ordne die Dualzahlen. Beginne mit der kleinsten Zahl.', l.map(d2), h1('Vergleiche zuerst die Zahl der Stellen. Bei gleich vielen Stellen vergleichst du von links Ziffer für Ziffer.'),
        { nachweis: [{ art: 'ordnung', richtung: 'auf', system: 'dual' }], umgekehrt: 'reihenfolge-umgekehrt', sonst: 'dual-zehnerwerte', links: 'kleinste', rechts: 'größte' }); },
    () => { const k = kind(), st = wahl([4, 5]), a = 2 ** (st - 1), wort = { 4: ['vier', 'drei'], 5: ['fünf', 'vier'] }[st];
      return auswahl(`${k} behauptet: „Auch im Zweiersystem ist von zwei Zahlen immer die mit mehr Stellen die größere.“ Beurteile die Aussage.`, [
        opt(`Stimmt. Die kleinste Zahl mit ${wort[0]} Stellen ist ${a}, die größte mit ${wort[1]} Stellen ist nur ${a - 1}.`, true),
        opt('Falsch. Im Zweiersystem kommt es nur auf die Zahl der Einsen an, nicht auf die Stellen.', false, 'dual-zehnerwerte'),
        opt('Falsch. Das gilt nur im Zehnersystem.', false),
        opt('Das gilt nur, wenn die längere Zahl auf 1 endet.', false)],
      h1('Vergleiche die kleinste Zahl mit einer bestimmten Stellenzahl und die größte Zahl mit einer Stelle weniger.'), { nachweis: [U(true), D(a, { nurWert: true }), D(a - 1, { nurWert: true })] }); },
  ]);

  // =====================================================================
  // Z2 Vom Zehnersystem ins Zweiersystem
  // =====================================================================
  sechs(Z_('Z2'), 'F', [
    () => { const n = mitEinsen(3, 7);
      return trage2(Z(`Lege die Zahl ${n}.`, 'Welche Werte brauchst du?', 'Schreibe dort 1.', 'Schreibe 0 in alle anderen Spalten.'), [n], 4,
        h3('Welche Werte ergeben zusammen die Zahl? Jeden Wert gibt es nur einmal.', 'Die Zahl 5: Du brauchst 4 und 1. In der Tafel steht 0, 1, 0, 1.', `${n} ist ${werte(n).join(' + ')}.`), { nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = mitEinsen(9, 14);
      return trage2(Z(`Lege die Zahl ${n}.`, 'Welche Werte brauchst du?', 'Schreibe dort 1.', 'Schreibe 0 in alle anderen Spalten.'), [n], 4,
        h3('Beginne mit dem größten Wert, der in die Zahl passt.', 'Die Zahl 11: Die 8 passt. Es fehlen noch 3. Das sind 2 und 1.', `Die 8 passt in ${n}. Dann fehlen noch ${n - 8}.`), { nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = mitEinsen(5, 12, 2, 2), [x, y] = werte(n), f1 = suche(() => [wahl([8, 4, 2, 1]), wahl([4, 2, 1])], ([p, q]) => p > q && p + q !== n), f2 = suche(() => [wahl([8, 4, 2, 1]), wahl([4, 2, 1])], ([p, q]) => p > q && p + q !== n && p + q !== f1[0] + f1[1]);
      return auswahl(Z(`Die Tafel zeigt die Zahl ${n}.`, 'Welche Rechnung passt zur Tafel?'), [opt(`${x} + ${y}`, true), opt(`${f1[0]} + ${f1[1]}`, false, 'dual-umgedreht'), opt(`${f2[0]} + ${f2[1]}`, false)],
        h3('Schau nach, in welchen Spalten ein Plättchen liegt.', 'Plättchen bei 4 und bei 2: Die Rechnung ist 4 + 2.', `Die Plättchen liegen bei ${x} und bei ${y}.`), { bild: B.dualTafel(n, 4, true), nachweis: [{ art: 'tafel', zahl: n, basis: 2 }, ...N(`${x} + ${y}`)] }); },
    () => { const n = wahl([3, 5, 6, 7]);
      return trage2(Z('Diese Tafel hat nur 3 Spalten.', `Lege die Zahl ${n}.`, 'Schreibe 1 oder 0 in jede Spalte.'), [n], 3,
        h3('Welche der Werte 4, 2 und 1 brauchst du?', 'Die Zahl 6: Du brauchst 4 und 2. In der Tafel steht 1, 1, 0.', `${n} ist ${werte(n).join(' + ')}.`), { nachweis: [...N(werte(n).join(' + ')), HILFSZAHL(3, 'Zahl der Spalten')] }); },
    () => { const n = wahl([5, 6, 9, 10, 12, 13]);
      return trage2(Z(`Lege zuerst die Zahl ${n}.`, `Lege darunter die Zahl ${n + 1}.`, 'Schreibe 1 oder 0 in jede Spalte.'), [n, n + 1], 4,
        h3('Die zweite Zahl ist um 1 größer. Es ändert sich nur wenig.', 'Die Zahl 4 ist 0, 1, 0, 0. Die Zahl 5 ist 0, 1, 0, 1.', `${n} ist ${werte(n).join(' + ')}. Für ${n + 1} kommt noch die 1 dazu.`), { nachweis: [...N(werte(n).join(' + ')), ...N(werte(n + 1).join(' + '))] }); },
    () => { const n = wahl([8, 15, 12, 4]);
      return trage2(Z(`Lege die Zahl ${n}.`, 'Schreibe 1 oder 0 in jede Spalte.'), [n], 4,
        h3('Manchmal reicht ein einziger Wert. Manchmal brauchst du alle.', 'Die Zahl 2: nur eine 1 bei der 2. In der Tafel steht 0, 0, 1, 0.', `${n} ist ${werte(n).join(' + ')}.`), { nachweis: n === 8 || n === 4 ? [HILFSZAHL(n, 'die Zahl ist selbst ein Spaltenwert')] : N(werte(n).join(' + ')) }); },
  ]);
  sechs(Z_('Z2'), 'G', [
    () => { const n = mitEinsen(17, 30);
      return trage2(Z(`Schreibe die Zahl ${n} im Zweiersystem.`, 'Trage in jede Spalte 1 oder 0 ein.'), [n], 5,
        h3('Beginne mit dem größten Stellenwert, der in die Zahl passt.', 'Die Zahl 22: 16 passt, Rest 6. Die 8 passt nicht. 4 passt, Rest 2. Also 1, 0, 1, 1, 0.', `16 passt in ${n}. Der Rest ist ${n - 16}.`), { nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = mitEinsen(9, 14);
      return trage2(Z(`Schreibe die Zahl ${n} im Zweiersystem.`, 'Nicht jede Spalte wird gebraucht.'), [n], 5,
        h3('Passt ein Stellenwert nicht in die Zahl, schreibst du dort eine 0.', 'Die Zahl 9: 16 passt nicht. 8 passt, Rest 1. Also 0, 1, 0, 0, 1.', `16 passt nicht in ${n}. Schreibe dort eine 0.`), { nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = wahl([3, 5, 6, 7, 9, 10, 11, 13]);
      return trage2(Z(`Schreibe zuerst die Zahl ${n} im Zweiersystem.`, `Schreibe darunter das Doppelte: die Zahl ${2 * n}.`, 'Was fällt dir auf?'), [n, 2 * n], 5,
        h3('Beim Verdoppeln rücken alle Ziffern um eine Stelle nach links.', 'Die Zahl 3 ist 0, 0, 0, 1, 1. Die Zahl 6 ist 0, 0, 1, 1, 0.', `${n} ist ${werte(n).join(' + ')}. ${2 * n} ist ${werte(2 * n).join(' + ')}.`), { nachweis: N(`${n} · 2`) }); },
    () => { const n = mitEinsen(9, 15), f = suche(() => zz(8, 15), (x) => x !== n && x !== um(n, 4));
      if (um(n, 4) < 8) return null;
      return auswahl(Z(`Wie schreibt man die Zahl ${n} im Zweiersystem?`), [opt(d2(n), true), opt(d2(um(n, 4)), false, 'dual-umgedreht'), opt(d2(f), false, 'dual-gerade-werte')],
        h3('Zerlege die Zahl in die Stellenwerte 8, 4, 2 und 1.', '13 ist 8 + 4 + 1. Das schreibt man 1101₂.', `${n} ist ${werte(n).join(' + ')}.`), { nachweis: [D(n)] }); },
    () => { const n = mitEinsen(19, 30, 3, 3);
      return trage2(Z(`Eine Zahl ist die Summe ${werte(n).join(' + ')}.`, 'Schreibe sie im Zweiersystem.'), [n], 5,
        h3('Für jeden Summanden steht eine 1 in seiner Spalte.', '16 + 4 + 1: eine 1 bei 16, bei 4 und bei 1. Also 1, 0, 1, 0, 1.', `Schreibe eine 1 bei ${werte(n).join(', bei ')}.`), { nachweis: N(werte(n).join(' + ')) }); },
    () => { const k = kind(), n = wahl([12, 6, 14, 10]), falsch = dual(n).padStart(4, '0').split('').reverse().join('');
      return auswahl(Z(`${k} schreibt die Zahl ${n} im Zweiersystem so: ${falsch}${TIEF2}.`, 'Stimmt das?'), [opt('Stimmt. Die Stellen stehen in der richtigen Reihenfolge.', false, 'dual-umgedreht'), opt(`Falsch. ${k} hat die Stellen umgedreht. Richtig ist ${dual(n).padStart(4, '0')}${TIEF2}.`, true), opt(`Falsch. Richtig ist ${dual(n + 1).padStart(4, '0')}${TIEF2}.`, false, 'dual-gerade-werte')],
        h3('Der Stellenwert 1 steht ganz rechts. So ist es auch bei den Einern im Zehnersystem.', '12 ist 8 + 4. Das schreibt man 1100₂.', `${n} ist ${werte(n).join(' + ')}. Der größte Wert steht links.`), { nachweis: [U(false), D(n, { nurWert: true })] }); },
  ]);
  sechs(Z_('Z2'), 'M', [
    () => { const n = mitEinsen(33, 62);
      return trage2(`Schreibe die Zahl ${n} als Dualzahl. Die Tafel hat sechs Stellen, die Stellenwerte musst du selbst wissen.`, [n], 6, h2('Der größte Stellenwert der Tafel ist 32. Ziehe nacheinander alle Stellenwerte ab, die noch passen.', `${n} − 32 = ${n - 32}`), { koepfe: false, nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = mitEinsen(130, 254, 3, 6);
      return trage2(`Schreibe die Zahl ${n} als Dualzahl mit acht Stellen.`, [n], 8, h2('Die Stellenwerte von links: 128, 64, 32, 16, 8, 4, 2, 1. Passt ein Stellenwert, schreibst du 1 und rechnest mit dem Rest weiter.', `${n} − 128 = ${n - 128}`), { koepfe: false, nachweis: N(werte(n).join(' + ')) }); },
    () => { const n = wahl([100, 200, 50, 75, 150, 250]), t = dual(n);
      return zahl(`Wie viele Stellen hat die Zahl ${n}, wenn man sie als Dualzahl schreibt?`, t.length, fehlerliste(t.length, [[String(n).length, 'dual-zehnerwerte'], [t.length - 1, 'dual-gerade-werte'], [t.length + 1, 'dual-gerade-werte']]),
        h2('Suche den größten Stellenwert, der in die Zahl passt. Zähle, an der wievielten Stelle von rechts er steht.', `Der größte passende Stellenwert ist ${2 ** (t.length - 1)}.`), { nachweis: [D(n), { art: 'ziffernzahl', zahl: Number(t), was: 'stellen', anzahl: t.length }] }); },
    () => { const n = mitEinsen(19, 62), l = [n, um(n, dual(n).length), n + 2, n - 1].filter((x) => x > 0);
      if (new Set(l).size < 4 || dual(um(n, dual(n).length)).length !== dual(n).length) return null;
      return auswahl(`Wie schreibt man die Zahl ${n} als Dualzahl?`, [opt(d2(n), true), opt(d2(l[1]), false, 'dual-umgedreht'), opt(d2(l[2]), false, 'dual-gerade-werte'), opt(d2(l[3]), false)],
        h2('Zerlege die Zahl in Stellenwerte, beginnend mit dem größten, der passt.', `${n} ist ${werte(n).join(' + ')}.`), { nachweis: [D(n)] }); },
    () => { const n = wahl([7, 15, 31, 23, 47]);
      return trage2(`Schreibe die Zahl ${n} und ihren Nachfolger ${n + 1} als Dualzahlen untereinander. Die Tafel hat sechs Stellen.`, [n, n + 1], 6, h2('Beim Nachfolger werden die Einsen am rechten Ende zu Nullen, und die nächste Stelle links davon wird zur 1.', `${n + 1} ist ${werte(n + 1).join(' + ')}.`), { koepfe: false, nachweis: N(`${n} + 1`) }); },
    () => { const n = wahl([255, 127, 63]), t = dual(n);
      return zahl(`Wie viele Einsen braucht man, um die Zahl ${n} als Dualzahl zu schreiben?`, t.length, fehlerliste(t.length, [[String(n).length, 'dual-zehnerwerte'], [t.length + 1, 'dual-gerade-werte'], [1, 'dual-zehnerwerte']]),
        h2('Die Zahl liegt um 1 unter einem Stellenwert des Zweiersystems. Überlege, wie der Vorgänger eines Stellenwerts aussieht.', `${n + 1} ist ein Stellenwert. ${n} ist die Summe aller kleineren Stellenwerte.`), { nachweis: [D(n), { art: 'ziffernzahl', zahl: Number(t), was: 'stellen', anzahl: t.length }, { art: 'ziffernzahl', zahl: Number(t), was: 'nullen', anzahl: 0 }] }); },
  ]);
  sechs(Z_('Z2'), 'E', [
    () => { const n = mitEinsen(33, 120);
      return frei(`Schreibe die Zahl ${n} als Dualzahl.`, n, h1('Ziehe nacheinander die größten passenden Stellenwerte ab und notiere für jeden Stellenwert eine 1 oder eine 0.')); },
    () => { const n = mitEinsen(300, 1000, 3, 7);
      return frei(`Schreibe die Zahl ${n} als Dualzahl.`, n, h1('Der größte Stellenwert unter 1000 ist 512. Arbeite dich von dort Stellenwert für Stellenwert nach unten.')); },
    () => { const n = mitEinsen(9, 45);
      return frei(`Verdopple die Dualzahl ${d2(n)} und schreibe das Ergebnis wieder als Dualzahl. Versuche es, ohne ins Zehnersystem umzurechnen.`, 2 * n, h1('Überlege, was im Zehnersystem geschieht, wenn man eine Zahl mit 10 multipliziert.'), [D(n, { nurWert: true }), ...N(`${n} · 2`)]); },
    () => { const st = wahl([5, 6, 7, 8]), n = 2 ** (st - 1);
      return frei(`Schreibe den Vorgänger der Dualzahl ${d2(n)} als Dualzahl.`, n - 1, h1('Im Zehnersystem ist der Vorgänger von 1000 die Zahl 999. Übertrage diese Idee auf das Zweiersystem.'), [D(n, { nurWert: true }), ...N(`${n} − 1`)]); },
    () => { const n = mitEinsen(70, 250, 3, 5);
      return frei(`Eine Zahl ist die Summe ${werte(n).join(' + ')}. Schreibe sie als Dualzahl.`, n, h1('Jeder Summand ist ein Stellenwert. Achte auf die Stellenwerte, die in der Summe fehlen.'), N(werte(n).join(' + '))); },
    () => auswahl('Wie ändert sich eine Zahl, wenn man im Zweiersystem rechts eine 0 anhängt?', [opt('Sie verdoppelt sich, weil jede Ziffer auf den nächstgrößeren Stellenwert rückt.', true), opt('Sie wird zehnmal so groß, wie beim Anhängen einer 0 im Zehnersystem.', false, 'dual-zehnerwerte'), opt('Sie wird um 2 größer.', false, 'dual-gerade-werte'), opt('Sie bleibt gleich, denn eine 0 hat keinen Wert.', false)],
      h1('Probiere es mit einer kleinen Zahl aus, zum Beispiel mit 11₂ und 110₂.'), { nachweis: [D(3, { nurWert: true }), D(6, { nurWert: true }), ...N('3 · 2')] }),
  ]);
}
