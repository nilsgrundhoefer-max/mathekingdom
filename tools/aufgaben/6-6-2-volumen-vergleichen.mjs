// Aufgaben zu 6.6.2 „Volumen vergleichen“ (Lernziele W1, W2) nach ADR 0015 und ADR 0049.
// W1: Volumen durch Zählen von Einheitswürfeln. F zeigt jeden Würfel, G zählt verdeckte Würfel mit, M zählt in Schichten und mit
// verschieden großen Würfeln, E rechnet mit Lücken. W2: Volumen vergleichen und die Würfel eines Quaders in Schichten zählen.

import { sechs } from '../werkzeug.mjs';
import { risseBild, grundrissMitZahlen } from './6-3-koerper.mjs';
import { zz, wahl, mische, suche, Z, opt, auswahl, luecken, ordnen, H, zahl, lk, kind, zweiKinder, bildkarten, bau, ausTuermen, zufallsBau, verdeckteWuerfel, FREI, T, EW, volumen, laenge,
  BN, WERT, URTEIL, VGL, KN, ORD, rasterBild, kanten } from './6-6-quader.mjs';

const W1 = '6.6.2-W1', W2 = '6.6.2-W2';
// Würfelbau, bei dem jeder Würfel zu sehen ist (F), und einer mit mindestens einem verdeckten Würfel (G).
const offenerBau = (n) => suche(() => zufallsBau(3, 2, 2, n), (w) => verdeckteWuerfel(w) === 0);
const verdeckterBau = (n) => suche(() => zufallsBau(3, 3, 3, n), (w) => verdeckteWuerfel(w) >= 1 && verdeckteWuerfel(w) <= 3);
const treppe = () => ausTuermen([wahl([[3, 2, 1], [1, 2, 3], [2, 1], [1, 2], [4, 3, 2, 1], [1, 2, 3, 4]])]);
const hZaehl = H('F', 'Zähle die Würfel der Reihe nach.', 'Zähle zuerst unten. Zähle dann oben.', 'Tippe beim Zählen auf jeden Würfel.');
const hVerdeckt = H('G', 'Manche Würfel siehst du nicht.', 'Unter jedem Würfel oben liegt noch ein Würfel.', 'Zähle Turm für Turm von unten nach oben.');
const produkt = ([a, b, c]) => a * b * c;

export function volumenVergleichen6() {
  // ================= W1: Würfel zählen =================
  sechs(W1, 'F', [
    () => { const n = zz(4, 7), w = offenerBau(n); return zahl(Z('Der Körper ist aus gleich großen Würfeln gebaut.', 'Zähle die Würfel.'), n, [], hZaehl, { bild: bau(w), nachweis: [BN('wuerfel', n)] }); },
    () => { const n = zz(4, 7), w = offenerBau(n);
      return luecken(Z('Jeder Würfel hat das Volumen 1 cm³.', 'Zähle die Würfel.', 'Der Körper hat {{n}} Würfel.', 'Sein Volumen ist {{v}} cm³.'), { n: lk(n), v: lk(n) },
        H('F', 'Das Volumen ist die Anzahl der Würfel.', '5 Würfel mit je 1 cm³ haben zusammen 5 cm³.', 'Zähle die Würfel. Schreibe die Zahl in beide Felder.'), { bild: bau(w), nachweis: [BN('wuerfel', n), `${n} · 1 cm³ = ${n} cm³`] }); },
    () => { const a = zz(3, 5), c = zz(2, 3); return zahl(Z('Die Mauer ist aus gleich großen Würfeln gebaut.', 'Zähle die Würfel.'), a * c, [[a + c, 'volumen-kanten-addiert']],
      H('F', 'Zähle Reihe für Reihe.', 'Eine Mauer mit 2 Reihen aus je 4 Würfeln hat 8 Würfel.', 'Zähle eine Reihe. Zähle dann die Reihen.'), { bild: rasterBild(a, 1, c, 'cm', false), nachweis: [BN('wuerfel', a * c)] }); },
    () => { const n = zz(4, 8), w = offenerBau(n); return volumen(Z('Jeder Würfel hat das Volumen 1 cm³.', 'Gib das Volumen von dem Körper an.'), n * 1000, 'cm³', [],
      H('F', 'Zähle die Würfel. Jeder Würfel ist 1 cm³.', '6 Würfel haben zusammen 6 cm³.', 'Schreibe die Anzahl der Würfel mit der Einheit cm³.'), { bild: bau(w), nachweis: [BN('wuerfel', n), `${n} · 1 cm³ = ${n} cm³`] }); },
    () => { const [x, y, z] = mische([3, 4, 5, 6, 7]).slice(0, 3), max = Math.max(x, y, z);
      return bildkarten(Z('Alle Würfel sind gleich groß.', 'Kreuze den Körper mit dem größten Volumen an.'), [x, y, z].map((n) => [bau(offenerBau(n)), n === max]),
        H('F', 'Mehr Würfel heißt: mehr Volumen.', 'Ein Körper aus 6 Würfeln hat mehr Volumen als ein Körper aus 4 Würfeln.', 'Zähle bei jedem Körper die Würfel.'), { nachweis: [KN('wuerfel', 'max')] }); },
    () => { const w = treppe(); return zahl(Z('Die Treppe ist aus gleich großen Würfeln gebaut.', 'Zähle die Würfel.'), w.length, [], hZaehl, { bild: bau(w), nachweis: [BN('wuerfel', w.length)] }); },
  ]);
  sechs(W1, 'G', [
    () => { const n = zz(8, 12), w = verdeckterBau(n), v = verdeckteWuerfel(w);
      return zahl(Z('Der Körper ist aus gleich großen Würfeln gebaut.', 'Zähle alle Würfel.', 'Zähle auch die verdeckten Würfel mit.'), n, [[n - v, 'wuerfel-verdeckt']], hVerdeckt, { bild: bau(w), nachweis: [BN('wuerfel', n)] }); },
    () => { const [a, b, c] = mische([zz(2, 4), zz(2, 3), zz(2, 3)]), n = a * b * c;
      return zahl(Z('Der Quader ist aus gleich großen Würfeln gebaut.', 'Bestimme die Anzahl der Würfel.'), n, [[n - (a - 1) * (b - 1) * (c - 1), 'wuerfel-verdeckt'], [a + b + c, 'volumen-kanten-addiert']],
        H('G', 'Zähle die Würfel in einer Schicht. Zähle dann die Schichten.', 'Eine Schicht mit 6 Würfeln und 2 Schichten: 6 · 2 = 12 Würfel.', 'Rechne Würfel in einer Schicht mal Anzahl der Schichten.'), { bild: rasterBild(a, b, c, 'cm', false), nachweis: [`${a} · ${b} · ${c} = ${n}`, BN('wuerfel', n)] }); },
    () => { const n = zz(7, 11), w = verdeckterBau(n), v = verdeckteWuerfel(w);
      return volumen(Z('Jeder Würfel hat das Volumen 1 cm³.', 'Bestimme das Volumen von dem Körper.', 'Wähle auch die passende Einheit.'), n * 1000, 'cm³', [[(n - v) * 1000, 'wuerfel-verdeckt']], hVerdeckt,
        { einheiten: EW('cm'), bild: bau(w), nachweis: [BN('wuerfel', n), `${n} · 1 cm³ = ${n} cm³`] }); },
    () => { const n = zz(7, 12), w = zufallsBau(3, 3, 3, n), oben = new Set(w.map(([x, y]) => `${x},${y}`)).size;
      return luecken(Z('Der Plan zeigt einen Würfelbau von oben.', 'Jede Zahl nennt die Anzahl der Würfel übereinander.', 'Bestimme die Anzahl aller Würfel.', 'Der Würfelbau hat {{n}} Würfel.'), { n: lk(n, [[oben, 'wuerfel-verdeckt']]) },
        H('G', 'Jedes Kästchen ist ein Turm.', 'Ein Kästchen mit der Zahl 3 ist ein Turm aus 3 Würfeln.', 'Addiere alle Zahlen im Plan.'), { bild: risseBild(grundrissMitZahlen(w)), nachweis: [BN('wuerfel', n)] }); },
    () => { const n = zz(8, 12), w = verdeckterBau(n), v = verdeckteWuerfel(w), kn = kind();
      return auswahl(Z(`${kn} zählt bei dem Körper ${n - v} Würfel.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. Verdeckte Würfel fehlen. Es sind ${n} Würfel.`, true), opt('Stimmt. Man zählt nur die Würfel im Bild.', false, 'wuerfel-verdeckt'), opt(`Falsch. Es sind ${n - v - 1} Würfel.`, false)],
        hVerdeckt, { bild: bau(w), nachweis: [BN('wuerfel', n), URTEIL(false)] }); },
    () => { const w = suche(() => zufallsBau(3, 2, 3, zz(6, 10)), (x) => Math.max(...x.map((p) => p[0])) === 2 && Math.max(...x.map((p) => p[1])) === 1), bz = Math.max(...w.map((p) => p[2])) + 1, box = 3 * 2 * bz, n = w.length;
      if (box === n || bz < 2) return null;
      return zahl(Z('Der Körper wird zu einem Quader aufgefüllt.', `Der Quader ist 3 Würfel lang, 2 Würfel breit und ${bz} Würfel hoch.`, 'Bestimme die Anzahl der fehlenden Würfel.'), box - n, [[box, 'sach-schritt-vergessen'], [n, 'sach-schritt-vergessen']],
        H('G', 'Berechne die Würfel im vollen Quader. Ziehe die Würfel im Bild ab.', 'Voller Quader mit 12 Würfeln, im Bild 9 Würfel: Es fehlen 12 − 9 = 3 Würfel.', 'Rechne Länge mal Breite mal Höhe. Zähle dann die Würfel im Bild.'), { bild: bau(w), nachweis: [BN('wuerfel', n), `3 · 2 · ${bz} = ${box}`, `${box} − ${n} = ${box - n}`] }); },
  ]);
  sechs(W1, 'M', [
    () => { const a = zz(4, 9), b = zz(3, 6), c = zz(3, 8);
      return zahl(Z(`Ein Quader ist aus gleich großen Würfeln gebaut. In einer Schicht liegen ${b} Reihen mit je ${a} Würfeln. Der Quader hat ${c} Schichten.`, 'Bestimme die Anzahl der Würfel.'), a * b * c, [[a * b, 'sach-schritt-vergessen'], [a + b + c, 'volumen-kanten-addiert']],
        H('M', 'Berechne zuerst die Würfel in einer Schicht.', 'Nimm die Würfel einer Schicht mal die Anzahl der Schichten.'), { nachweis: [`${a} · ${b} = ${a * b}`, `${a * b} · ${c} = ${a * b * c}`] }); },
    () => { const [a, b, c] = mische([zz(3, 5), zz(2, 4), zz(2, 4)]), n = a * b * c;
      return volumen(Z('Der Quader ist aus Würfeln mit der Kantenlänge 1 cm gebaut.', 'Bestimme sein Volumen.'), n * 1000, 'cm³', [[(n - (a - 1) * (b - 1) * (c - 1)) * 1000, 'wuerfel-verdeckt'], [2 * (a * b + a * c + b * c) * 1000, 'volumen-oberflaeche-verwechselt']],
        H('M', 'Jeder Würfel hat das Volumen 1 cm³. Zähle in Schichten.', 'Würfel in einer Schicht mal Anzahl der Schichten.'), { einheiten: EW('cm'), bild: rasterBild(a, b, c, 'cm', false), nachweis: [`${a} · ${b} · ${c} = ${n}`, BN('wuerfel', n), `${n} · 1 cm³ = ${n} cm³`] }); },
    () => { const a = zz(3, 7), b = zz(2, 5), c = zz(3, 6), g = a * b, n = g * c;
      return zahl(Z(`Ein Quader besteht aus ${n} gleich großen Würfeln. In der untersten Schicht liegen ${g} Würfel.`, 'Bestimme die Anzahl der Schichten.'), c, [[n - g, 'sach-schritt-vergessen']],
        H('M', 'Jede Schicht hat gleich viele Würfel.', 'Teile die Anzahl aller Würfel durch die Würfel einer Schicht.'), { nachweis: [`${n} : ${g} = ${c}`] }); },
    () => { const n = zz(5, 9), w = suche(() => zufallsBau(3, 2, 3, n), (x) => verdeckteWuerfel(x) === 0), s = wahl([2, 3]), v = s * s * s;
      return volumen(Z(`Jeder Würfel hat die Kantenlänge ${s} cm.`, 'Bestimme das Volumen des Körpers.'), n * v * 1000, 'cm³', [[n * 1000, 'sach-schritt-vergessen'], [n * s * 1000, 'volumen-waechst-wie-kante'], [n * s * s * 1000, 'volumen-oberflaeche-verwechselt']],
        H('M', 'Berechne zuerst das Volumen von einem Würfel.', `Ein Würfel: ${s} cm · ${s} cm · ${s} cm = ${v} cm³. Nimm das mal die Anzahl der Würfel.`), { einheiten: EW('cm'), bild: bau(w), nachweis: [`${s} cm · ${s} cm · ${s} cm = ${v} cm³`, BN('wuerfel', n), `${n} · ${v} cm³ = ${n * v} cm³`] }); },
    () => { const n2 = zz(3, 6), n1 = suche(() => zz(18, 50), (x) => x !== 8 * n2);
      return auswahl(Z(`Körper A besteht aus ${n1} Würfeln mit der Kantenlänge 1 cm. Körper B besteht aus ${n2} Würfeln mit der Kantenlänge 2 cm.`, 'Kreuze den Körper mit dem größeren Volumen an.'),
        [opt('Körper A', n1 > 8 * n2, n1 > 8 * n2 ? undefined : 'volumen-waechst-wie-kante'), opt('Körper B', 8 * n2 > n1), opt('Beide haben dasselbe Volumen.', false)],
        H('M', 'Ein Würfel mit 2 cm Kantenlänge hat nicht das doppelte Volumen.', '2 cm · 2 cm · 2 cm = 8 cm³. Ein großer Würfel zählt wie 8 kleine.'), { nachweis: [`${n1} · 1 cm³ = ${n1} cm³`, '2 cm · 2 cm · 2 cm = 8 cm³', `${n2} · 8 cm³ = ${8 * n2} cm³`, VGL(`${n1} cm³`, `${8 * n2} cm³`, { groesser: 'Körper A', kleiner: 'Körper B', gleich: 'Beide haben dasselbe Volumen.' })] }); },
    () => { const [a, b, c] = [zz(2, 6) * 2, zz(2, 5) * 2, zz(2, 4) * 2], n = (a / 2) * (b / 2) * (c / 2);
      return zahl(Z(`Eine Schachtel ist innen ${a} cm lang, ${b} cm breit und ${c} cm hoch. Sie wird mit Würfeln der Kantenlänge 2 cm gefüllt.`, 'Bestimme, wie viele Würfel hineinpassen.'), n, [[a * b * c, 'sach-schritt-vergessen'], [(a * b * c) / 2, 'volumen-waechst-wie-kante']],
        H('M', 'Überlege für jede Kante, wie viele Würfel nebeneinander passen.', `In der Länge passen ${a} : 2 = ${a / 2} Würfel. Rechne so auch für Breite und Höhe und multipliziere.`),
        { nachweis: [`${a} cm : 2 cm = ${a / 2}`, `${b} cm : 2 cm = ${b / 2}`, `${c} cm : 2 cm = ${c / 2}`, `${a / 2} · ${b / 2} · ${c / 2} = ${n}`] }); },
  ]);
  sechs(W1, 'E', [
    () => { const [a, b, c] = [zz(3, 6), zz(3, 5), zz(3, 5)], n = a * b * c;
      return zahl(Z(`Ein Quader ist aus Würfeln gebaut: ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch. An jeder Ecke des Quaders wird ein Würfel entfernt.`, 'Bestimme die Anzahl der übrigen Würfel.'), n - 8, [[n - 4, 'wuerfel-verdeckt'], [n, 'sach-schritt-vergessen']],
        H('E', 'Ein Quader hat 8 Ecken.'), { nachweis: [`${a} · ${b} · ${c} = ${n}`, `${n} − 8 = ${n - 8}`] }); },
    () => { const [a, b, c] = [zz(3, 5), zz(3, 6), zz(3, 5)], n = a * b * c;
      return zahl(Z(`Ein Quader ist aus Würfeln gebaut: ${a} Würfel lang, ${b} Würfel tief und ${c} Würfel hoch. Von vorne nach hinten führt ein gerader Tunnel durch den Quader. Er ist einen Würfel breit und einen Würfel hoch.`, 'Bestimme die Anzahl der Würfel des Körpers.'), n - b, [[n - 1, 'wuerfel-verdeckt'], [n, 'sach-schritt-vergessen']],
        H('E', 'Der Tunnel ist so lang wie der Quader tief ist.'), { nachweis: [`${a} · ${b} · ${c} = ${n}`, `${n} − ${b} = ${n - b}`] }); },
    () => { const [k, gleich, anders] = wahl([[[4, 3, 2], [[6, 2, 2], [12, 2, 1], [8, 3, 1]], [[4, 4, 2], [5, 3, 2], [6, 3, 2]]], [[6, 3, 2], [[9, 2, 2], [4, 3, 3], [6, 6, 1]], [[5, 4, 2], [8, 2, 2], [6, 3, 3]]], [[5, 4, 2], [[10, 2, 2], [8, 5, 1], [5, 2, 4]], [[6, 3, 2], [4, 4, 3], [5, 5, 2]]]]);
      const r = mische(gleich).slice(0, zz(2, 3)), f = mische(anders).slice(0, 5 - r.length), t = ([x, y, z]) => `${x} · ${y} · ${z} Würfel`;
      return auswahl(Z(`Ein Quader ist ${k[0]} Würfel lang, ${k[1]} Würfel breit und ${k[2]} Würfel hoch. Alle Würfel sind gleich groß.`, 'Kreuze alle Quader an, die dasselbe Volumen haben.'), [...r.map((x) => opt(t(x), true)), ...f.map((x) => opt(t(x), false))],
        H('E', 'Gleiches Volumen heißt hier: gleich viele Würfel.'), { mehrfach: true, nachweis: [`${k[0]} · ${k[1]} · ${k[2]} = ${produkt(k)}`, WERT(`${produkt(k)}`)] }); },
    () => { const n = zz(3, 6), k = n - 2;
      return zahl(Z(`Ein Würfel ist aus ${n} · ${n} · ${n} kleinen Würfeln gebaut. Er wird außen ganz angemalt.`, 'Bestimme die Anzahl der kleinen Würfel ohne Farbe.'), k * k * k, [[(n - 1) ** 3, 'wuerfel-verdeckt'], [n * n * n, 'sach-schritt-vergessen']],
        H('E', 'Ohne Farbe bleiben nur Würfel im Inneren. Denke dir außen ringsum eine Schicht weg.'), { nachweis: [`${n} − 2 = ${k}`, `${k} · ${k} · ${k} = ${k * k * k}`] }); },
    () => { const [a, b, c] = kanten(2, 6), n = a * b * c, paare = []; for (let x = 2; x <= 6; x++) for (let y = 2; y <= x; y++) if (n % (x * y) === 0 && n / (x * y) >= 2 && !(x === a && y === b)) paare.push([x, y]);
      if (!paare.length) return null;
      const [x, y] = wahl(paare), c2 = n / (x * y);
      return zahl(Z(`Ein Quader aus Würfeln ist ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch. Aus allen Würfeln wird ein neuer Quader gebaut. Seine unterste Schicht hat ${x} · ${y} Würfel.`, 'Bestimme die Anzahl der Schichten des neuen Quaders.'), c2, [[n, 'sach-schritt-vergessen'], [c, 'sach-schritt-vergessen']],
        H('E', 'Die Anzahl der Würfel bleibt gleich.'), { nachweis: [`${a} · ${b} · ${c} = ${n}`, `${x} · ${y} = ${x * y}`, `${n} : ${x * y} = ${c2}`] }); },
    () => auswahl(Z('Zwei Körper bestehen aus gleich vielen gleich großen Würfeln. Der eine Körper ist höher als der andere.', `${kind()} sagt: „Der höhere Körper hat das größere Volumen.“`, 'Beurteile die Aussage.'),
      [opt('Falsch. Gleich viele gleich große Würfel haben zusammen immer dasselbe Volumen.', true), opt('Stimmt. Ein höherer Körper nimmt mehr Platz ein als ein flacher Körper.', false), opt('Stimmt, aber nur bei Quadern.', false), opt('Falsch. Der breitere Körper hat das größere Volumen.', false)],
      H('E', 'Das Volumen hängt nur davon ab, wie viele Einheitswürfel in den Körper passen.'), { nachweis: [FREI('Volumen hängt nicht von der Form ab'), URTEIL(false)] }),
  ]);

  // ================= W2: Volumen vergleichen, Würfel in Reihen und Schichten zählen =================
  sechs(W2, 'F', [
    () => { const [x, y, z] = mische([3, 4, 5, 6, 7]).slice(0, 3), min = Math.min(x, y, z);
      return bildkarten(Z('Alle Würfel sind gleich groß.', 'Kreuze den Körper mit dem kleinsten Volumen an.'), [x, y, z].map((n) => [bau(offenerBau(n)), n === min]),
        H('F', 'Weniger Würfel heißt: weniger Volumen.', 'Ein Körper aus 3 Würfeln hat weniger Volumen als ein Körper aus 5 Würfeln.', 'Zähle bei jedem Körper die Würfel.'), { nachweis: [KN('wuerfel', 'min')] }); },
    () => { const [x, y, z] = mische([4, 5, 6, 7, 8]).slice(0, 3);
      return bildkarten(Z('Jeder Würfel hat das Volumen 1 cm³.', `Kreuze den Körper mit dem Volumen ${x} cm³ an.`), [x, y, z].map((n) => [bau(offenerBau(n)), n === x]),
        H('F', 'Das Volumen ist die Anzahl der Würfel.', 'Ein Körper aus 5 Würfeln hat das Volumen 5 cm³.', 'Zähle bei jedem Körper die Würfel.'), { nachweis: [KN('wuerfel', 'gleich', x)] }); },
    () => { const a = zz(3, 6), b = zz(2, 4);
      return luecken(Z('Die Platte ist aus gleich großen Würfeln gebaut.', 'Zähle die Würfel.', 'In einer Reihe liegen {{a}} Würfel.', 'Es gibt {{b}} Reihen.', 'Zusammen sind es {{n}} Würfel.'), { a: lk(a), b: lk(b), n: lk(a * b, [[a + b, 'volumen-kanten-addiert']]) },
        H('F', 'Zähle zuerst die Würfel in der vorderen Reihe.', '2 Reihen mit je 4 Würfeln: 2 · 4 = 8 Würfel.', 'Rechne Würfel in einer Reihe mal Anzahl der Reihen.'), { bild: rasterBild(a, b, 1, 'cm', false), nachweis: [`${a} · ${b} = ${a * b}`, BN('wuerfel', a * b)] }); },
    () => { const a = zz(3, 6), c = zz(2, 4);
      return luecken(Z('Die Mauer ist aus gleich großen Würfeln gebaut.', 'Zähle die Würfel.', 'In einer Reihe liegen {{a}} Würfel.', 'Es liegen {{c}} Reihen übereinander.', 'Zusammen sind es {{n}} Würfel.'), { a: lk(a), c: lk(c), n: lk(a * c, [[a + c, 'volumen-kanten-addiert']]) },
        H('F', 'Zähle zuerst die Würfel in der untersten Reihe.', '3 Reihen mit je 5 Würfeln: 3 · 5 = 15 Würfel.', 'Rechne Würfel in einer Reihe mal Anzahl der Reihen.'), { bild: rasterBild(a, 1, c, 'cm', false), nachweis: [`${a} · ${c} = ${a * c}`, BN('wuerfel', a * c)] }); },
    () => { const n = zz(5, 8), w = offenerBau(n), kn = kind();
      return auswahl(Z(`${kn} baut den Körper um.`, 'Kein Würfel kommt dazu und kein Würfel bleibt übrig.', 'Kreuze an, was für das Volumen gilt.'), [opt('Das Volumen bleibt gleich.', true), opt('Das Volumen wird größer.', false), opt('Das Volumen wird kleiner.', false)],
        H('F', 'Das Volumen ist die Anzahl der Würfel.', 'Aus 6 Würfeln baust du einen Turm oder eine Mauer. Es bleiben 6 Würfel.', 'Überlege: Ändert sich die Anzahl der Würfel?'), { bild: bau(w), nachweis: [FREI('Volumen bleibt beim Umbauen gleich')] }); },
    () => { const a = zz(3, 6), b = zz(2, 4);
      return volumen(Z('Jeder Würfel hat das Volumen 1 cm³.', 'Gib das Volumen von der Platte an.'), a * b * 1000, 'cm³', [[(a + b) * 1000, 'volumen-kanten-addiert']],
        H('F', 'Zähle die Würfel. Jeder Würfel ist 1 cm³.', '2 Reihen mit je 4 Würfeln sind 8 Würfel. Das Volumen ist 8 cm³.', 'Rechne Würfel in einer Reihe mal Anzahl der Reihen.'), { bild: rasterBild(a, b, 1, 'cm', false), nachweis: [BN('wuerfel', a * b), `${a * b} · 1 cm³ = ${a * b} cm³`] }); },
  ]);
  const hSchicht = (n) => H(n, 'Zähle die Würfel in einer Schicht. Nimm sie mal die Anzahl der Schichten.', 'Eine Schicht mit 4 · 3 = 12 Würfeln und 2 Schichten: 12 · 2 = 24 Würfel.', 'Rechne Würfel in einer Reihe mal Reihen mal Schichten.');
  sechs(W2, 'G', [
    () => { const [a, b, c] = [zz(3, 5), zz(2, 4), zz(2, 4)], s = a * b;
      return luecken(Z('Der Quader ist aus gleich großen Würfeln gebaut.', 'Bestimme die Anzahl der Würfel.', `Die unterste Schicht: ${a} · ${b} = {{s}} Würfel`, 'Der Quader hat {{c}} Schichten.', 'Zusammen sind es {{n}} Würfel.'), { s: lk(s, [[a + b, 'volumen-kanten-addiert']]), c: lk(c), n: lk(s * c, [[s, 'sach-schritt-vergessen'], [s + c, 'volumen-kanten-addiert']]) },
        hSchicht('G'), { bild: rasterBild(a, b, c, 'cm', false), nachweis: [`${a} · ${b} = ${s}`, `${s} · ${c} = ${s * c}`, BN('wuerfel', s * c)] }); },
    () => { const [a, b, c] = kanten(2, 9), n = a * b * c;
      return zahl(Z(`Ein Quader ist ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch.`, 'Bestimme die Anzahl der Würfel.'), n, [[a + b + c, 'volumen-kanten-addiert'], [2 * (a * b + a * c + b * c), 'volumen-oberflaeche-verwechselt'], [a * b, 'sach-schritt-vergessen']], hSchicht('G'), { nachweis: [`${a} · ${b} · ${c} = ${n}`] }); },
    () => { const q = suche(() => [[zz(2, 4), zz(2, 3), zz(2, 3)], [zz(2, 4), zz(2, 3), zz(2, 3)], [zz(2, 4), zz(2, 3), zz(2, 3)]], (l) => new Set(l.map(produkt)).size === 3), max = Math.max(...q.map(produkt));
      return bildkarten(Z('Alle Würfel sind gleich groß.', 'Kreuze den Quader mit dem größten Volumen an.'), q.map((k) => [rasterBild(...k, 'cm', false), produkt(k) === max]), hSchicht('G'), { nachweis: [KN('wuerfel', 'max')] }); },
    () => { const [a, b, c] = [zz(3, 5), zz(2, 4), zz(2, 4)], n = a * b * c;
      return volumen(Z('Der Quader ist aus Würfeln mit dem Volumen 1 cm³ gebaut.', 'Bestimme das Volumen von dem Quader.', 'Wähle auch die passende Einheit.'), n * 1000, 'cm³', [[(a + b + c) * 1000, 'volumen-kanten-addiert'], [a * b * 1000, 'sach-schritt-vergessen']], hSchicht('G'),
        { einheiten: EW('cm'), bild: rasterBild(a, b, c, 'cm'), nachweis: [`${a} · ${b} · ${c} = ${n}`, BN('wuerfel', n), `${n} · 1 cm³ = ${n} cm³`] }); },
    () => { const p = kanten(2, 6), r = zz(0, 2) ? kanten(2, 6) : suche(() => kanten(2, 8), (x) => produkt(x) === produkt(p) && x.join() !== p.join()), [vp, vr] = [produkt(p), produkt(r)];
      if (p.join() === r.join()) return null;
      return auswahl(Z(`Quader A ist ${p[0]} Würfel lang, ${p[1]} Würfel breit und ${p[2]} Würfel hoch.`, `Quader B ist ${r[0]} Würfel lang, ${r[1]} Würfel breit und ${r[2]} Würfel hoch.`, 'Alle Würfel sind gleich groß.', 'Kreuze an, welcher Quader das größere Volumen hat.'),
        [opt('Quader A', vp > vr), opt('Quader B', vr > vp), opt('Beide haben dasselbe Volumen.', vp === vr)], hSchicht('G'),
        { nachweis: [`${p[0]} · ${p[1]} · ${p[2]} = ${vp}`, `${r[0]} · ${r[1]} · ${r[2]} = ${vr}`, VGL(`${vp}`, `${vr}`, { groesser: 'Quader A', kleiner: 'Quader B', gleich: 'Beide haben dasselbe Volumen.' })] }); },
    () => { const [a, b, c] = [zz(3, 6), zz(2, 5), zz(2, 6)], n = a * b * c;
      return zahl(Z(`Ein Quader besteht aus ${n} gleich großen Würfeln.`, `Er ist ${a} Würfel lang und ${b} Würfel breit.`, 'Bestimme die Anzahl der Schichten.'), c, [[n - a * b, 'sach-schritt-vergessen'], [a * b, 'sach-schritt-vergessen']],
        H('G', 'Berechne zuerst die Würfel in einer Schicht.', 'Eine Schicht mit 12 Würfeln, zusammen 36 Würfel: 36 : 12 = 3 Schichten.', 'Teile alle Würfel durch die Würfel einer Schicht.'), { nachweis: [`${a} · ${b} = ${a * b}`, `${n} : ${a * b} = ${c}`] }); },
  ]);
  sechs(W2, 'M', [
    () => { const [a, b, c] = [zz(4, 9), zz(3, 6), zz(2, 6)], n = a * b * c;
      return volumen(Z(`Ein Quader ist aus Würfeln mit der Kantenlänge 1 dm gebaut. In jeder Schicht liegen ${a} · ${b} Würfel. Der Quader hat ${c} Schichten.`, 'Bestimme das Volumen des Quaders.'), n * 1e6, 'dm³', [[a * b * 1e6, 'sach-schritt-vergessen'], [(a + b + c) * 1e6, 'volumen-kanten-addiert']],
        H('M', 'Ein Würfel mit 1 dm Kantenlänge hat das Volumen 1 dm³.', 'Würfel in einer Schicht mal Anzahl der Schichten.'), { einheiten: EW('dm'), nachweis: [`${a} · ${b} · ${c} = ${n}`, `${n} · 1 dm³ = ${n} dm³`] }); },
    () => { const n = zz(4, 9), [a, b, c] = suche(() => kanten(2, 6), (k) => produkt(k) !== 8 * n), v = a * b * c;
      return auswahl(Z(`Ein Turm besteht aus ${n} Würfeln mit der Kantenlänge 2 cm. Ein Quader besteht aus ${a} · ${b} · ${c} Würfeln mit der Kantenlänge 1 cm.`, 'Kreuze den Körper mit dem größeren Volumen an.'), [opt('der Turm', 8 * n > v), opt('der Quader', v > 8 * n, v > 8 * n ? undefined : 'volumen-waechst-wie-kante'), opt('Beide haben dasselbe Volumen.', false)],
        H('M', 'Vergleiche in derselben Einheit.', 'Ein Würfel mit 2 cm Kantenlänge hat 2 cm · 2 cm · 2 cm = 8 cm³.'), { nachweis: ['2 cm · 2 cm · 2 cm = 8 cm³', `${n} · 8 cm³ = ${8 * n} cm³`, `${a} · ${b} · ${c} = ${v}`, `${v} · 1 cm³ = ${v} cm³`, VGL(`${8 * n} cm³`, `${v} cm³`, { groesser: 'der Turm', kleiner: 'der Quader', gleich: 'Beide haben dasselbe Volumen.' })] }); },
    () => { const s = 5, [x, y, z] = [zz(3, 8), zz(2, 6), zz(2, 5)], n = x * y * z;
      return zahl(Z(`Eine Kiste ist innen ${x * s} cm lang, ${y * s} cm breit und ${z * s} cm hoch. Sie wird mit Würfeln der Kantenlänge ${s} cm gefüllt.`, 'Bestimme, wie viele Würfel hineinpassen.'), n, [[x * s * y * s * z * s, 'sach-schritt-vergessen'], [(x * s * y * s * z * s) / s, 'volumen-waechst-wie-kante']],
        H('M', 'Überlege für jede Kante, wie viele Würfel nebeneinander passen.', `In der Länge passen ${x * s} : ${s} = ${x} Würfel.`), { nachweis: [`${x * s} cm : ${s} cm = ${x}`, `${y * s} cm : ${s} cm = ${y}`, `${z * s} cm : ${s} cm = ${z}`, `${x} · ${y} · ${z} = ${n}`] }); },
    () => { const q = suche(() => [kanten(2, 6), kanten(2, 6), kanten(2, 6), kanten(2, 6)], (l) => new Set(l.map(produkt)).size === 4).sort((x, y) => produkt(x) - produkt(y));
      return ordnen(Z('Vier Quader sind aus gleich großen Würfeln gebaut.', 'Ordne sie nach dem Volumen. Beginne mit dem kleinsten Volumen.'), q.map(([a, b, c]) => `${a} · ${b} · ${c} Würfel`), H('M', 'Berechne für jeden Quader die Anzahl der Würfel.', 'Ordne dann die Ergebnisse von klein nach groß.'), { nachweis: [ORD('auf')] }); },
    () => { const [n, passt, falsch] = wahl([[36, [[6, 3, 2], [9, 2, 2], [4, 3, 3], [6, 6, 1]], [[5, 4, 2], [8, 2, 2], [6, 4, 2]]], [48, [[6, 4, 2], [4, 4, 3], [8, 3, 2], [12, 2, 2]], [[6, 3, 3], [5, 5, 2], [7, 3, 2]]], [60, [[5, 4, 3], [6, 5, 2], [10, 3, 2], [15, 2, 2]], [[6, 4, 3], [8, 4, 2], [5, 5, 2]]]]);
      const t = ([x, y, z]) => `${x} · ${y} · ${z}`;
      return auswahl(Z(`Ein Quader wird aus genau ${n} gleich großen Würfeln gebaut.`, 'Kreuze die Maße an, die nicht möglich sind.'), [...mische(passt).slice(0, 3).map((x) => opt(t(x), false)), opt(t(wahl(falsch)), true)],
        H('M', 'Multipliziere die drei Zahlen.', `Möglich sind nur Maße mit dem Produkt ${n}.`), { nachweis: [WERT(`${n}`, { nicht: true })] }); },
    () => { const [a, b, c] = kanten(2, 6), n = a * b * c, neu = (a + 1) * (b + 1) * (c + 1);
      return zahl(Z(`Ein Quader aus Würfeln ist ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch. Er wird in jeder Richtung um einen Würfel größer gebaut.`, 'Bestimme, wie viele Würfel dazukommen.'), neu - n, [[neu, 'sach-schritt-vergessen'], [3, 'volumen-waechst-wie-kante'], [a + b + c + 1, 'volumen-kanten-addiert']],
        H('M', 'Berechne die Anzahl der Würfel vorher und nachher.', 'Die Differenz der beiden Anzahlen ist die Lösung.'), { nachweis: [`${a} · ${b} · ${c} = ${n}`, `${a} + 1 = ${a + 1}`, `${b} + 1 = ${b + 1}`, `${c} + 1 = ${c + 1}`, `${a + 1} · ${b + 1} · ${c + 1} = ${neu}`, `${neu} − ${n} = ${neu - n}`] }); },
  ]);
  sechs(W2, 'E', [
    () => { const [a, b, c] = [zz(4, 9), zz(3, 6), zz(3, 8)], n = a * b * c;
      return laenge(Z(`Ein Quader besteht aus ${n} Würfeln mit der Kantenlänge 1 cm. Er ist ${a} cm lang und ${b} cm breit.`, 'Bestimme seine Höhe.'), c * 10, 'cm', [[(n - a * b) * 10, 'sach-schritt-vergessen'], [a * b * 10, 'sach-schritt-vergessen']],
        H('E', 'Berechne die Würfel in einer Schicht. Jede Schicht ist 1 cm hoch.'), { einheiten: EW('cm'), nachweis: [`${a} · ${b} = ${a * b}`, `${n} : ${a * b} = ${c}`, `${c} · 1 cm = ${c} cm`] }); },
    () => { const [a, b, c] = kanten(2, 5), n = a * b * c;
      return volumen(Z(`Ein Quader ist aus Würfeln mit der Kantenlänge 3 cm gebaut. Er ist ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch.`, 'Bestimme sein Volumen.'), n * 27000, 'cm³', [[n * 9000, 'volumen-oberflaeche-verwechselt'], [n * 3000, 'volumen-waechst-wie-kante'], [n * 1000, 'sach-schritt-vergessen']],
        H('E', 'Berechne zuerst das Volumen von einem Würfel.'), { einheiten: EW('cm'), nachweis: ['3 cm · 3 cm · 3 cm = 27 cm³', `${a} · ${b} · ${c} = ${n}`, `${n} · 27 cm³ = ${T(n * 27000, 'cm³')}`] }); },
    () => { const s = wahl([4, 6]), v = s * s * s, h = s / 2;
      return auswahl(Z(`Ein Würfel hat die Kantenlänge ${s} cm.`, 'Kreuze alle Rechnungen an, die sein Volumen ergeben.'),
        [opt(`${v} · 1 cm · 1 cm · 1 cm`, true), opt(`8 · ${h} cm · ${h} cm · ${h} cm`, true), opt(`2 · ${h} cm · ${h} cm · ${h} cm`, false, 'volumen-waechst-wie-kante'), opt(`${s} · ${s} cm · ${s} cm`, false, 'volumen-oberflaeche-verwechselt'), opt(`${s * s} cm² · ${s} cm`, true)],
        H('E', 'Berechne das Volumen des Würfels und dann jede Rechnung.'), { mehrfach: true, nachweis: [`${s} cm · ${s} cm · ${s} cm = ${v} cm³`, WERT(`${v} cm³`)] }); },
    () => { const n = wahl([12, 16, 18, 20, 24, 30, 36]); let anzahl = 0; for (let x = 1; x <= n; x++) for (let y = x; y <= n; y++) for (let z = y; z <= n; z++) if (x * y * z === n) anzahl++;
      return zahl(Z(`Aus genau ${n} gleich großen Würfeln werden Quader gebaut. Quader mit denselben drei Kantenlängen zählen nur einmal.`, 'Bestimme die Anzahl der verschiedenen Quader.'), anzahl, [[anzahl - 1, 'sach-schritt-vergessen'], [anzahl + 1, 'teilflaeche-doppelt']],
        H('E', 'Gehe geordnet vor: Beginne mit der kleinsten Kante 1, dann 2 und so weiter.'), { nachweis: [{ art: 'alleQuader', volumen: n, anzahl }] }); },
    () => { const [a, b, c] = kanten(2, 5), n = a * b * c;
      return zahl(Z(`Ein Quader aus Würfeln ist ${a} Würfel lang, ${b} Würfel breit und ${c} Würfel hoch. Er wird zum kleinsten Würfel ergänzt, in den er hineinpasst.`, 'Bestimme, wie viele kleine Würfel dazukommen.'), a * a * a - n, [[a * a * a, 'sach-schritt-vergessen'], [a - c, 'volumen-waechst-wie-kante']],
        H('E', 'Die längste Kante des Quaders ist die Kantenlänge des Würfels.'), { nachweis: [`${a} · ${b} · ${c} = ${n}`, `${a} · ${a} · ${a} = ${a * a * a}`, `${a * a * a} − ${n} = ${a * a * a - n}`] }); },
    () => auswahl(Z('Ein Quader aus Einheitswürfeln wird doppelt so lang, doppelt so breit und doppelt so hoch gebaut.', 'Kreuze an, wie viel mal so viele Würfel dann nötig sind.'),
      [opt('8-mal so viele, denn 2 · 2 · 2 = 8.', true), opt('2-mal so viele, denn jede Kante wird verdoppelt.', false, 'volumen-waechst-wie-kante'), opt('6-mal so viele, denn 2 + 2 + 2 = 6.', false, 'volumen-kanten-addiert'), opt('4-mal so viele, denn 2 · 2 = 4.', false, 'volumen-oberflaeche-verwechselt')],
      H('E', 'Probiere es mit einem Quader aus 3 · 2 · 1 Würfeln aus.'), { nachweis: [FREI('Wachstum des Volumens begründen')] }),
  ]);
}
