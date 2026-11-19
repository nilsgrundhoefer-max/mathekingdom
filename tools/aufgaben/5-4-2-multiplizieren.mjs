// Aufgaben zu 5.4.2 „Multiplizieren“ (Lernziele M1 bis M5) nach ADR 0015.
//   F  Malkreuz mit Zehnern und Einern, Punktefeld und Gruppenbild, höchstens 12 · 12 (Nils, 2026-11-18)
//   G  Standardverfahren im Rechenraster wie im Heft, zweiter Faktor höchstens zweistellig, Nullen im Faktor gezielt
//   M  dreistellig mal zweistellig, Fehler finden, zweischrittige Sachaufgaben, „Wer hat recht?“
//   E  Ziffernrätsel, Regeln über Stellenzahlen, dreischrittige Aufgaben, Größenordnung abschätzen

import {
  sechs, stufen, zahl, auswahl, opt, luecken, sach, teil, zuordnen, malkreuz, rasterMal, Z, N, B, frage, h1, h2, h3, zz, wahl, suche, fehlerliste, kind, zweiKinder,
  U, WERT, GROESSTES, HILFSZAHL, fz, runde, malOhneUebertrag, malNullVergessen, malNichtEingerueckt, raetselLoesungen,
} from '../werkzeug.mjs';

const M = (kurz) => `5.4.2-${kurz}`;
const zehnerEiner = (n) => [Math.floor(n / 10) * 10, n % 10].filter((x) => x > 0);
const hze = (n) => ({ h: Math.floor(n / 100), z: Math.floor(n / 10) % 10, e: n % 10 });
const ohneNull = (n) => !String(n).includes('0');
const fuehrend = (x) => { const p = 10 ** (String(x).length - 1); return Math.round(x / p) * p; };
// Ein Ziffernrätsel, das genau eine Lösung hat: `ziffern` sind die Stellen, die verdeckt werden.
function raetsel(rechnung, verdeckt) {
  let i = 0;
  const muster = rechnung.replace(/\d/g, (z) => (verdeckt.includes(i++) ? '▢' : z));
  const loes = raetselLoesungen(muster);
  if (loes.length !== 1) return null;
  let k = 0;
  return { muster, text: muster.replace(/▢/g, () => `{{${'abcdef'[k++]}}}`), ziffern: loes[0], werte: Object.fromEntries(loes[0].map((z, j) => ['abcdef'[j], z])) };
}

export function multiplizieren() {
  // ===================================================================
  // M1 Fachbegriffe Faktor und Produkt
  // ===================================================================
  sechs(M('M1'), 'F', [
    () => { const [r, sp] = [zz(3, 6), zz(3, 9)];
      return zahl(Z('Im Bild sind Reihen mit Punkten.', 'Wie viele Punkte sind es zusammen?'), r * sp, fehlerliste(r * sp, [[r + sp, '1x1-addiert'], [r * sp - sp, '1x1-nachbar']]),
        h3('Zähle die Reihen. Zähle die Punkte in 1 Reihe. Rechne dann mal.', '3 Reihen mit je 4 Punkten: 3 · 4 = 12.', `Es sind ${r} Reihen mit je ${sp} Punkten. Rechne ${r} · ${sp}.`), { bild: B.feld(r, sp), nachweis: N(`${r} · ${sp}`) }); },
    () => { const [r, sp] = suche(() => [zz(3, 5), zz(4, 8)], ([x, y]) => x !== y);
      return auswahl(Z(`Im Bild sind ${r} Reihen.`, `In jeder Reihe sind ${sp} Punkte.`, 'Welche Mal-Aufgabe passt?'), [opt(`${r} · ${sp}`, true), opt(`${r} + ${sp}`, false, '1x1-addiert'), opt(`${r} · ${sp + 1}`, false, '1x1-nachbar')],
        h3('Mal heißt: gleich viele in jeder Reihe.', '2 Reihen mit je 5 Punkten passen zu 2 · 5.', `Zuerst kommt die Zahl der Reihen: ${r}. Dann die Punkte in 1 Reihe.`), { bild: B.feld(r, sp), nachweis: [WERT(r * sp), ...N(`${r} · ${sp}`)] }); },
    () => { const [g, je] = [zz(2, 5), zz(3, 6)], ding = wahl(['Murmeln', 'Stifte', 'Bonbons']);
      return zahl(Z(`Es gibt ${g} Tüten.`, `In jeder Tüte sind ${je} ${ding}.`, `Wie viele ${ding} sind es zusammen?`), g * je, fehlerliste(g * je, [[g + je, '1x1-addiert']]),
        h3('Gleich viele in jeder Tüte: Das ist eine Mal-Aufgabe.', '3 Tüten mit je 4 Murmeln: 3 · 4 = 12.', `Rechne ${g} · ${je}.`), { einheit: ding, bild: B.gruppen(g, je), nachweis: N(`${g} · ${je}`) }); },
    () => { const [r, sp] = [zz(2, 4), zz(5, 9)];
      return zahl(Z('Rechne.', `${r} · ${sp}`), r * sp, fehlerliste(r * sp, [[r + sp, '1x1-addiert'], [r * sp + sp, '1x1-nachbar']]),
        h3('Das Bild hilft dir. Zähle die Reihen und die Punkte in 1 Reihe.', r * sp === 12 ? '3 · 5 heißt: 3 Reihen mit je 5 Punkten. Das sind 15.' : '2 · 6 heißt: 2 Reihen mit je 6 Punkten. Das sind 12.', `Zähle in ${sp}er-Schritten. Mache ${r} Schritte.`), { bild: B.feld(r, sp), nachweis: N(`${r} · ${sp}`) }); },
    () => { const [r, sp] = suche(() => [zz(3, 6), zz(3, 8)], ([x, y]) => x !== y);
      return zahl(Z('Welche Zahl fehlt?', `${r} · ▢ = ${r * sp}`), sp, fehlerliste(sp, [[r * sp - r, '1x1-addiert'], [sp + 1, '1x1-nachbar']]),
        h3('Schau ins Bild: Wie viele Punkte sind in 1 Reihe?', '3 · ▢ = 15. Im Bild sind 3 Reihen mit je 5 Punkten. Die Zahl ist 5.', `Es sind ${r} Reihen. Zähle die Punkte in 1 Reihe.`), { bild: B.feld(r, sp), nachweis: N(`${r * sp} : ${r}`, `${r} · ${sp}`) }); },
    () => { const [r, sp] = suche(() => [zz(3, 5), zz(4, 9)], ([x, y]) => x !== y && x * y - y !== x + y);
      return auswahl(Z(`${r} · ${sp}`, 'Was kommt heraus?'), [opt(String(r * sp), true), opt(String(r + sp), false, '1x1-addiert'), opt(String(r * sp - sp), false, '1x1-nachbar')],
        h3('Zähle alle Punkte im Bild.', '3 · 5: 3 Reihen mit je 5 Punkten. Das sind 15 Punkte.', `Zähle in ${sp}er-Schritten bis zur ${r}. Reihe.`), { bild: B.feld(r, sp), nachweis: N(`${r} · ${sp}`) }); },
  ]);

  stufen(M('M1'), 'G', {
    1: (k) => {
      const [a, b] = suche(() => [zz(3, 9), zz(3, 9)], ([x, y]) => x !== y && x * y !== x && x * y !== y), p = a * b;
      const hilfen = h3('Faktor mal Faktor ergibt das Produkt.', 'Bei 4 · 5 = 20 sind 4 und 5 die Faktoren. 20 ist das Produkt.', `Rechne ${a} · ${b}. Das Ergebnis heißt Produkt.`);
      if (k === 0) return auswahl(Z(`${a} · ${b} = ${p}`, `Wie heißt die Zahl ${p}?`), [opt('Produkt', true), opt('Faktor', false, 'begriffe-verwechselt'), opt('Summe', false, 'begriffe-verwechselt')], hilfen, { nachweis: N(`${a} · ${b}`) });
      if (k === 1) return zahl(Z('Berechne das Produkt.', `${a} · ${b}`), p, fehlerliste(p, [[a + b, 'begriffe-verwechselt']]), hilfen, { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`) });
      const erster = wahl([true, false]);
      return luecken(Z(`${a} · ${b} = ${p}`, `Der ${erster ? 'erste' : 'zweite'} Faktor ist {{x}}.`), { x: [erster ? a : b, fehlerliste(erster ? a : b, [[p, 'begriffe-verwechselt']])] },
        h3('Die Faktoren sind die Zahlen, die malgenommen werden.', 'Bei 4 · 5 = 20 ist 4 der erste Faktor und 5 der zweite Faktor.', `Lies die Mal-Aufgabe von links: ${a} · ${b}.`), { nachweis: N(`${a} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(11, 19), zz(3, 6)], ([x, y]) => x * y <= 100);
        return luecken(Z(`Die Faktoren sind ${a} und ${b}.`, 'Das Produkt ist {{x}}.'), { x: [a * b, fehlerliste(a * b, [[a + b, 'begriffe-verwechselt']])] },
          h3('Das Produkt ist das Ergebnis der Mal-Aufgabe.', 'Die Faktoren sind 12 und 3. Das Produkt ist 12 · 3 = 36.', `Rechne ${a} · ${b} = ${b} · 10 + ${b} · ${a - 10}.`), { nachweis: N(`${a} · ${b}`, `${b} · 10 + ${b} · ${a - 10}`) }); }
      const [a, b] = suche(() => [zz(4, 9), zz(4, 9)], ([x, y]) => x !== y);
      return zahl(Z(`Das Produkt ist ${a * b}.`, `Ein Faktor ist ${b}.`, 'Wie heißt der andere Faktor?'), a, fehlerliste(a, [[a * b - b, 'begriffe-verwechselt'], [a + 1, '1x1-nachbar']]),
        h3('Denke an die Mal-Aufgabe mit Lücke.', 'Das Produkt ist 24, ein Faktor ist 6. 4 · 6 = 24, also ist 4 der andere Faktor.', `▢ · ${b} = ${a * b}. Rechne ${a * b} : ${b}.`), { bild: B.feld(a, b), nachweis: N(`${a * b} : ${b}`, `${a} · ${b}`) });
    },
    3: () => { const a = zz(6, 9), k = kind();
      return auswahl(Z(`${k} sagt:`, '„Das Produkt ist immer größer als jeder Faktor.“', `Prüfe mit ${a} · 1.`, 'Stimmt das?'),
        [opt(`Falsch. ${a} · 1 = ${a}. Das Produkt ist hier genauso groß wie der Faktor ${a}.`, true), opt('Stimmt. Beim Malnehmen wird es immer mehr.'), opt(`Stimmt. ${a} · 1 = ${a + 1}.`, false, '1x1-addiert')],
        h3('Rechne die Aufgabe aus. Vergleiche das Produkt mit den Faktoren.', '5 · 1 = 5. 1 Reihe mit 5 Punkten sind 5 Punkte.', `Rechne ${a} · 1. Ist das Produkt größer als ${a}?`), { bild: B.feld(1, a), nachweis: [U(false), ...N(`${a} · 1`)] }); },
  });

  stufen(M('M1'), 'M', {
    1: (k) => {
      const [a, b] = suche(() => [zz(12, 29), zz(3, 9)], ([x, y]) => x % 10 !== 0 && x !== y), p = a * b;
      if (k === 0) { const [gesucht, name] = wahl([[a, 'Faktor'], [p, 'Produkt']]);
        return auswahl(`In der Aufgabe ${a} · ${b} = ${p}: Wie heißt die Zahl ${gesucht}?`, ['Faktor', 'Produkt', 'Summand', 'Quotient'].map((n) => opt(n, n === name, n === name ? undefined : 'begriffe-verwechselt')),
          h2('Die Faktoren werden malgenommen, das Produkt ist das Ergebnis.', `${p} ist das Ergebnis von ${a} · ${b}.`), { nachweis: N(`${a} · ${b}`) }); }
      return zahl(`Der erste Faktor ist ${a}, der zweite Faktor ist ${b}. Berechne das Produkt.`, p, fehlerliste(p, [[a + b, 'begriffe-verwechselt']]), h2('Faktor · Faktor = Produkt.', `Rechne ${a} · ${b} = ${b} · ${a - a % 10} + ${b} · ${a % 10}.`), { nachweis: N(`${a} · ${b}`, `${b} · ${a - a % 10} + ${b} · ${a % 10}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(12, 19), zz(4, 9)], ([x, y]) => x !== y);
        return zahl(`Ein Faktor ist ${a}, das Produkt ist ${a * b}. Wie heißt der andere Faktor?`, b, fehlerliste(b, [[a * b - a, 'begriffe-verwechselt']]), h2('Produkt : Faktor = anderer Faktor.', `Rechne ${a * b} : ${a}. Probiere ${a} · 5 = ${a * 5}.`), { nachweis: N(`${a * b} : ${a}`, `${a} · 5`, `${b} · ${a}`) }); }
      if (k === 1) { const [x, y] = suche(() => [zz(12, 38), zz(12, 38)], ([u, v]) => (u + v) % 10 === 0 && u !== v), f = zz(3, 8);
        return zahl(`Multipliziere die Summe von ${x} und ${y} mit ${f}.`, (x + y) * f, fehlerliste((x + y) * f, [[x + y * f, 'punkt-vor-strich'], [x + y + f, 'begriffe-verwechselt']]),
          h2('Berechne zuerst die Summe. Sie ist ein Faktor.', `Die Summe ist ${x} + ${y} = ${x + y}. Rechne dann ${x + y} · ${f}.`), { nachweis: N(`${x} + ${y}`, `(${x} + ${y}) · ${f}`) }); }
      const [f, b] = suche(() => [zz(3, 5), zz(4, 9)], ([u, v]) => u * 2 !== v), p = 2 * f * b;
      return zahl(`Das Produkt zweier Zahlen ist ${p}. Ein Faktor ist das Doppelte von ${f}. Wie heißt der andere Faktor?`, b, fehlerliste(b, [[p / f, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst den bekannten Faktor.', `Das Doppelte von ${f} ist ${2 * f}. Rechne ${p} : ${2 * f}.`), { nachweis: N(`2 · ${f}`, `${p} : ${2 * f}`) });
    },
    3: () => { const [a, b] = suche(() => [zz(4, 9), zz(4, 9)], ([x, y]) => x !== y), p = a * b, [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Bei ${a} · ${b} = ${p} nennt man ${p} Faktor.“ ${k2} sagt: „${p} nennt man Produkt.“ Wer hat recht?`, [
        opt(`${k2}. ${p} ist das Ergebnis der Mal-Aufgabe. Die Faktoren sind ${a} und ${b}.`, true),
        opt(`${k1}. Jede Zahl in einer Mal-Aufgabe ist ein Faktor.`, false, 'begriffe-verwechselt'),
        opt('Beide. Faktor und Produkt bedeuten dasselbe.', false, 'begriffe-verwechselt'),
        opt(`Keiner. ${p} nennt man Summe.`, false, 'begriffe-verwechselt')],
      h2('Welche Zahlen werden malgenommen, und welche ist das Ergebnis?', `${a} und ${b} werden malgenommen. ${p} kommt heraus.`), { nachweis: N(`${a} · ${b}`) }); },
  });

  stufen(M('M1'), 'E', {
    1: () => { const [x, y, w] = suche(() => [zz(2, 6), zz(3, 7), zz(4, 9)], ([u, v, t]) => new Set([u, v, t]).size === 3);
      return zahl(`Das Produkt von drei Faktoren ist ${x * y * w}. Zwei Faktoren sind ${x} und ${y}. Wie heißt der dritte Faktor?`, w, fehlerliste(w, [[x * y * w - x - y, 'begriffe-verwechselt']]),
        h1('Fasse die beiden bekannten Faktoren zuerst zusammen.'), { nachweis: N(`${x} · ${y}`, `${x * y * w} : ${x * y}`) }); },
    2: (k) => {
      if (k === 0) { const p = wahl([24, 36, 40, 48, 60]), n = Array.from({ length: p }, (_, i) => i + 1).filter((t) => p % t === 0).length, [tx, ty] = { 24: [3, 8], 36: [4, 9], 40: [5, 8], 48: [6, 8], 60: [6, 10] }[p];
        return zahl(`Wie viele Mal-Aufgaben mit zwei natürlichen Zahlen haben das Produkt ${p}? Zähle Tauschaufgaben wie ${tx} · ${ty} und ${ty} · ${tx} einzeln.`, n, fehlerliste(n, [[n / 2, 'begriffe-verwechselt']]),
          h1('Gehe die Zahlen von 1 an der Reihe nach durch. Welche passen als erster Faktor?'), { nachweis: [...N(`${tx} · ${ty}`, `${ty} · ${tx}`), { art: 'anzahlProdukte', produkt: p, von: 1, bis: p, anzahl: n }] }); }
      if (k === 1) { const [x, y] = wahl([[7, 13], [7, 11], [11, 13], [7, 17], [11, 17], [13, 17]]);
        return luecken(`Setze die beiden Faktoren ein. Beide sind größer als 1, der erste ist kleiner als der zweite: {{a}} · {{b}} = ${x * y}`, { a: x, b: y },
          h1(`Probiere, durch welche kleinen Zahlen sich ${x * y} ohne Rest teilen lässt.`), { nachweis: [HILFSZAHL(1, 'Bedingung: kein Faktor ist 1'), ...N(`${x} · ${y}`)] }); }
      const [a, b] = [zz(12, 25), zz(4, 9)];
      return zahl(`Ein Faktor wird verdoppelt, der andere bleibt gleich. Vorher war das Produkt ${a * b}. Wie groß ist das Produkt jetzt?`, a * b * 2, fehlerliste(a * b * 2, [[a * b + 2, 'begriffe-verwechselt'], [a * b * 4, 'mal-stellenwert']]),
        h1('Probiere es mit einem Beispiel aus.'), { nachweis: N(`${a * b} · 2`) });
    },
    3: (k) => {
      const [x, y] = [zz(3, 6), zz(4, 9)];
      if (k === 0) return auswahl(`Beide Faktoren werden verdoppelt. Was passiert mit dem Produkt? Prüfe an ${x} · ${y}.`, [
        opt(`Es wird 4-mal so groß, denn 2 · 2 = 4. ${x} · ${y} = ${x * y} und ${2 * x} · ${2 * y} = ${4 * x * y}.`, true),
        opt('Es wird doppelt so groß.', false, 'mal-stellenwert'), opt('Es bleibt gleich.'), opt('Es wird um 4 größer.', false, '1x1-addiert'), opt('Das hängt von den Zahlen ab.')],
      h1('Rechne vorher und nachher aus und vergleiche.'), { nachweis: N(`${x} · ${y}`, `${2 * x} · ${2 * y}`, `${x * y} · 4`, '2 · 2') });
      const g = wahl([4, 6, 8]), u = wahl([3, 5, 7, 9]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Ein Produkt ist schon dann gerade, wenn ein Faktor gerade ist.“ ${k2} sagt: „Nur wenn beide Faktoren gerade sind.“ Wer hat recht?`, [
        opt(`${k1}. Ein gerader Faktor ist ein Doppeltes. Dann ist auch das Produkt ein Doppeltes, zum Beispiel ${g} · ${u} = ${g * u}.`, true),
        opt(`${k2}. ${g} · ${u} ist ungerade, weil ${u} ungerade ist.`),
        opt('Beide. Es kommt auf die Zahlen an.'),
        opt(`Keiner. ${u} · ${u} = ${u * u} ist ungerade.`)],
      h1('Probiere ein Beispiel mit einem geraden und einem ungeraden Faktor.'), { nachweis: N(`${g} · ${u}`, `${u} · ${u}`) });
    },
  });

  // ===================================================================
  // M2 Schriftlich mit einer einstelligen Zahl multiplizieren
  // ===================================================================
  sechs(M('M2'), 'F', [
    () => { const a = zz(2, 5), n = suche(() => zz(12, 34), (x) => x % 10 !== 0 && a * x <= 144);
      return malkreuz(Z(`Rechne ${a} · ${n} mit dem Malkreuz.`, `Zerlege ${n} in ${zehnerEiner(n).join(' und ')}.`), [a], zehnerEiner(n),
        h3('Nimm beide Teile mal. Rechne dann zusammen.', '3 · 12: 3 · 10 = 30 und 3 · 2 = 6. Zusammen 36.', `${a} · ${zehnerEiner(n)[0]} = ${a * zehnerEiner(n)[0]}. Rechne jetzt ${a} · ${n % 10}.`), { fehler: fehlerliste(a * n, [[a * (n - n % 10) + n % 10, 'mal-zerlegung-halb']]) }); },
    () => { const a = zz(2, 4), n = suche(() => zz(21, 36), (x) => x % 10 !== 0 && a * x <= 144);
      return malkreuz(Z(`Rechne ${a} · ${n}.`, 'Ein Feld ist schon ausgefüllt.'), [a], zehnerEiner(n),
        h3('Rechne das fehlende Feld aus. Addiere dann beide Felder.', '2 · 23: 2 · 20 = 40 und 2 · 3 = 6. Zusammen 46.', `Es fehlt ${a} · ${n % 10}.`), { gegeben: [[0, 0]] }); },
    () => { const [a, z] = suche(() => [zz(2, 5), zz(2, 4)], ([x, y]) => x * y * 10 <= 1000 && x !== y);
      return zahl(Z('Rechne.', `${a} · ${z * 10}`, 'Jeder Punkt im Bild ist ein Zehner.'), a * z * 10, fehlerliste(a * z * 10, [[a * z, 'mal-stellenwert'], [a + z * 10, '1x1-addiert']]),
        h3(`${z * 10} sind ${z} Zehner.`, '3 · 20: 3 · 2 Zehner sind 6 Zehner. Das ist 60.', `${a} · ${z} = ${a * z}. Also ${a} · ${z} Zehner = ${a * z} Zehner.`), { bild: B.feld(a, z), nachweis: N(`${a} · ${z}`, `${a} · ${z * 10}`) }); },
    () => { const n = suche(() => zz(13, 38), (x) => x % 10 !== 0 && x % 10 !== Math.floor(x / 10));
      const [z, e] = zehnerEiner(n);
      return auswahl(Z(`Du rechnest 4 · ${n} mit dem Malkreuz.`, `Wie zerlegst du ${n}?`), [opt(`${z} und ${e}`, true), opt(`${z / 10} und ${e}`, false, 'stellenwert'), opt(`${z} und ${e + 1}`, false, 'stellenwert')],
        h3('Zerlege in Zehner und Einer.', '27 ist 20 und 7.', `${n} hat ${z / 10} Zehner und ${e} Einer.`), { bild: B.material(hze(n)), nachweis: [...N(`4 · ${n}`), { art: 'paarsumme', ziel: n }] }); },
    () => { const n = zz(3, 9);
      return malkreuz(Z(`Rechne 12 · ${n} mit dem Malkreuz.`, 'Zerlege 12 in 10 und 2.'), [10, 2], [n],
        h3('Nimm beide Teile von 12 mal.', '12 · 4: 10 · 4 = 40 und 2 · 4 = 8. Zusammen 48.', `10 · ${n} = ${10 * n}. Rechne jetzt 2 · ${n}.`), { fehler: fehlerliste(12 * n, [[10 * n + 2, 'mal-zerlegung-halb']]) }); },
    () => { const n = suche(() => zz(21, 44), (x) => x % 10 !== 0 && 2 * x <= 144), [z, e] = zehnerEiner(n);
      return zahl(Z('Rechne.', `2 · ${n}`, `Zerlege ${n} in ${z} und ${e}.`), 2 * n, fehlerliste(2 * n, [[2 * z + e, 'mal-zerlegung-halb'], [n + 2, '1x1-addiert']]),
        h3('Rechne erst mit den Zehnern, dann mit den Einern.', '2 · 34: 2 · 30 = 60 und 2 · 4 = 8. Zusammen 68.', `2 · ${z} = ${2 * z}. Dazu kommt 2 · ${e} = ${2 * e}.`), { bild: B.material(hze(n)), nachweis: N(`2 · ${z}`, `2 · ${e}`, `${2 * z} + ${2 * e}`, `2 · ${n}`) }); },
  ]);

  stufen(M('M2'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, d] = suche(() => [zz(213, 789), zz(3, 9)], ([x, y]) => ohneNull(x) && x * y <= 9999 && malOhneUebertrag(x, y) !== x * y);
        return rasterMal(Z('Rechne schriftlich.', `${a} · ${d}`), a, d,
          h3('Beginne bei den Einern. Den Zehner merkst du dir für die nächste Stelle.', '213 · 4: 3 · 4 = 12, schreibe 2, merke 1. 1 · 4 + 1 = 5. 2 · 4 = 8. Ergebnis 852.', `Beginne mit ${a % 10} · ${d} = ${(a % 10) * d}.`)); }
      if (k === 1) { const [a, d] = suche(() => [wahl([zz(1, 9) * 100 + zz(1, 9), zz(1, 9) * 100 + zz(1, 9) * 10, 1000 + zz(1, 9) * 100 + zz(1, 9)]), zz(3, 9)], ([x, y]) => x * y <= 9999);
        return rasterMal(Z('Rechne schriftlich.', 'Achte auf die Null.', `${a} · ${d}`), a, d,
          h3('Auch die Null wird malgenommen. 0 mal eine Zahl ist 0. Denke an den Übertrag.', '305 · 4: 5 · 4 = 20, schreibe 0, merke 2. 0 · 4 + 2 = 2. 3 · 4 = 12. Ergebnis 1220.', `Beginne mit ${a % 10} · ${d} = ${(a % 10) * d}.`)); }
      const [a, d] = suche(() => [zz(214, 689), zz(4, 9)], ([x, y]) => ohneNull(x) && malOhneUebertrag(x, y) !== x * y);
      return zahl(Z('Rechne schriftlich im Heft.', `${a} · ${d}`), a * d, fehlerliste(a * d, [[malOhneUebertrag(a, d), 'mal-uebertrag-vergessen'], [a + d, '1x1-addiert']]),
        h3('Schreibe die Aufgabe ins Heft. Beginne bei den Einern.', '124 · 3: 4 · 3 = 12, schreibe 2, merke 1. 2 · 3 + 1 = 7. 1 · 3 = 3. Ergebnis 372.', `Beginne mit ${a % 10} · ${d} = ${(a % 10) * d}.`), { nachweis: N(`${a} · ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const a = zz(112, 499), n = 12;
        return malkreuz(Z(`Rechne ${a} · 12 mit dem Malkreuz.`, 'Zerlege 12 in 10 und 2.'), [a], [10, 2],
          h3('12 ist 10 und 2. Nimm die Zahl mit beiden Teilen mal.', '123 · 12: 10 · 123 = 1230 und 2 · 123 = 246. Zusammen 1476.', `10 · ${a} = ${10 * a}. Rechne jetzt 2 · ${a}.`), { fehler: fehlerliste(n * a, [[10 * a + 2, 'mal-zerlegung-halb']]) }); }
      const r = suche(() => { const a = zz(102, 989), d = zz(3, 9); const x = raetsel(`${a} · ${d} = ${a * d}`, [1]); return x && { a, d, ...x }; }, (x) => x && x.ziffern[0] !== 0 && a_ok(x));
      return luecken(Z('Welche Ziffer fehlt?', r.text), r.werte, h3('Rechne rückwärts oder probiere die Ziffern aus.', '2▢4 · 3 = 732: Probiere 244 · 3 = 732. Die Ziffer ist 4.', `Probiere: Setze eine Ziffer ein und rechne ${r.muster.split(' = ')[0]} aus.`),
        { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: r.muster, ziffern: r.ziffern }] });
    },
    3: () => { const [a, d] = suche(() => [zz(1, 9) * 100 + zz(1, 9), zz(3, 9)], ([x, y]) => x * y <= 9999 && x * y >= 1000), falsch = malNullVergessen(a, d), k = kind();
      return auswahl(Z(`${k} rechnet: ${a} · ${d} = ${falsch}.`, 'Stimmt das?'), [
        opt(`Falsch. Richtig ist ${a * d}. ${k} hat die Null vergessen.`, true),
        opt(`Stimmt. ${a} · ${d} = ${falsch}.`, false, 'mal-null-vergessen'),
        opt(`Falsch. Richtig ist ${falsch * 10}.`, false, 'mal-stellenwert')],
      h3('Mache einen Überschlag. Passt das Ergebnis dazu?', '304 · 2: Überschlag 300 · 2 = 600. Das Ergebnis muss etwa 600 sein.', `Überschlag: ${runde(a, 100)} · ${d} = ${runde(a, 100) * d}.`), { nachweis: [U(false, `${a} · ${d}`, falsch), ...N(`${a} · ${d}`, `${runde(a, 100)} · ${d}`)] }); },
  });

  stufen(M('M2'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, d] = suche(() => [zz(1, 9) * 1000 + zz(0, 9) * 10 + zz(1, 9), zz(4, 9)], ([x, y]) => String(x).includes('0') && x * y <= 99999);
        return rasterMal('Rechne schriftlich. Achte auf die Null im ersten Faktor.', a, d, h2('Auch eine Null wird malgenommen: 0 mal eine Zahl ist 0, dazu kommt der Übertrag.', `Beginne mit ${a % 10} · ${d} = ${(a % 10) * d}.`), { extra: { } }); }
      const [a, d] = suche(() => [zz(112, 899), zz(3, 9)], ([x, y]) => ohneNull(x));
      return zahl(`Berechne ${a} · 12.`, a * 12, fehlerliste(a * 12, [[a * 10 + 2, 'mal-zerlegung-halb'], [a * 2, 'mal-stellenwert']]),
        h2('12 ist 10 und 2. Nimm die Zahl mit beiden Teilen mal.', `${a} · 10 = ${a * 10}. Dazu kommt ${a} · 2 = ${a * 2}.`), { nachweis: N(`${a} · 10`, `${a} · 2`, `${a * 10} + ${a * 2}`, `${a} · 12`) });
    },
    2: (k) => {
      if (k === 0) { const [a, d] = suche(() => [zz(1, 9) * 1000 + zz(1, 9) * 100 + zz(1, 9), zz(3, 9)], ([x, y]) => x * y <= 99999 && malOhneUebertrag(x, y) !== x * y);
        return zahl(`Rechne schriftlich: ${fz(a)} · ${d}`, a * d, fehlerliste(a * d, [[malNullVergessen(a, d), 'mal-null-vergessen'], [malOhneUebertrag(a, d), 'mal-uebertrag-vergessen']]),
          h2('Achte auf die Null und auf jeden Übertrag.', `${a % 10} · ${d} = ${(a % 10) * d}. Schreibe ${(a % 10) * d % 10}, merke ${Math.floor((a % 10) * d / 10)}.`), { nachweis: N(`${a} · ${d}`) }); }
      if (k === 1) { const r = suche(() => { const a = zz(102, 989), d = zz(3, 9); const x = raetsel(`${a} · ${d} = ${a * d}`, [1, 3]); return x && { a, d, ...x }; }, (x) => x && a_ok(x));
        return luecken(`Welche Ziffern fehlen? ${r.text}`, r.werte, h2('Beginne bei der Ziffer, die sich am leichtesten finden lässt.', `Probiere die Ziffern für ${r.muster.split(' = ')[0]} der Reihe nach aus.`),
          { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: r.muster, ziffern: r.ziffern }] }); }
      const [a, d] = suche(() => [zz(1234, 4999), zz(3, 9)], ([x, y]) => ohneNull(x) && x * y <= 99999 && malOhneUebertrag(x, y) !== x * y), falsch = malOhneUebertrag(a, d), kn = kind();
      return zahl(`${kn} rechnet ${d} · ${fz(a)} und erhält ${fz(falsch)}. Gib das richtige Ergebnis an.`, a * d, fehlerliste(a * d, [[falsch, 'mal-uebertrag-vergessen']]),
        h2('Rechne selbst schriftlich und vergleiche Stelle für Stelle.', (() => { const z = String(a).split('').reverse().map(Number).find((x) => x * d >= 10); return `Bei ${z} · ${d} = ${z * d} entsteht ein Übertrag von ${Math.floor(z * d / 10)}.`; })()), { nachweis: [HILFSZAHL(falsch, `falsches Ergebnis von ${kn}`), ...N(`${d} · ${a}`)] });
    },
    3: () => { const [a, d] = suche(() => [zz(1, 9) * 100 + zz(1, 9), zz(3, 9)], ([x, y]) => x * y >= 1000), falsch = malNullVergessen(a, d), [k1, k2] = zweiKinder();
      return auswahl(`${k1} rechnet ${a} · ${d} = ${a * d}. ${k2} rechnet ${a} · ${d} = ${falsch}. Wer hat recht?`, [
        opt(`${k1}. ${Math.floor(a / 100) * 100} · ${d} = ${Math.floor(a / 100) * 100 * d} und ${a % 10} · ${d} = ${(a % 10) * d}. Zusammen ${a * d}.`, true),
        opt(`${k2}. Die Null zählt beim Malnehmen nicht.`, false, 'mal-null-vergessen'),
        opt('Beide. Die Ziffern sind fast gleich.'),
        opt(`Keiner. Richtig ist ${fz(a * d * 10)}.`, false, 'mal-stellenwert')],
      h2('Zerlege den ersten Faktor in Hunderter und Einer.', `${a} = ${Math.floor(a / 100) * 100} + ${a % 10}.`), { nachweis: [U(false, `${a} · ${d}`, falsch), ...N(`${Math.floor(a / 100) * 100} · ${d}`, `${a % 10} · ${d}`, `${Math.floor(a / 100) * 100 * d} + ${(a % 10) * d}`, `${a} · ${d}`)] }); },
  });

  stufen(M('M2'), 'E', {
    1: () => { const [a, d] = suche(() => [zz(20, 99) * 1000 + zz(0, 9) * 100 + zz(1, 99), zz(3, 9)], ([x, y]) => String(x).includes('0') && x * y <= 999999);
      return zahl(`Rechne schriftlich: ${d} · ${fz(a)}`, a * d, fehlerliste(a * d, [[malNullVergessen(a, d), 'mal-null-vergessen'], [malOhneUebertrag(a, d), 'mal-uebertrag-vergessen']]),
        h1('Rechne Stelle für Stelle und schreibe jeden Übertrag auf.'), { nachweis: N(`${d} · ${a}`) }); },
    2: (k) => {
      if (k === 0) { const r = suche(() => { const a = zz(12, 98), d = zz(3, 9); const x = raetsel(`${a} · ${d} = ${a * d}`, [0, 1, String(a).length + 2]); return x && { a, d, ...x }; }, (x) => x && a_ok(x));
        return luecken(`Welche Ziffern fehlen? ${r.text}`, r.werte, h1('Welche Ziffer passt bei den Einern? Arbeite dich dann nach links vor.'), { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: r.muster, ziffern: r.ziffern }] }); }
      const [a, d] = suche(() => [zz(1102, 4899), zz(3, 9)], ([x, y]) => x * y <= 99999);
      return zahl(`Mit welcher einstelligen Zahl musst du ${fz(a)} multiplizieren, um ${fz(a * d)} zu erhalten?`, d, fehlerliste(d, [[d + 1, '1x1-nachbar']]), h1('Mache zuerst einen Überschlag, dann prüfe genau.'), { nachweis: N(`${a * d} : ${a}`, `${a} · ${d}`) });
    },
    3: (k) => {
      if (k === 0) return auswahl('Wie viele Stellen kann das Produkt einer dreistelligen und einer einstelligen Zahl haben? Wähle die Antwort mit der richtigen Begründung.', [
        opt('3 oder 4 Stellen. Das kleinste Produkt ist 100 · 1 = 100, das größte ist 999 · 9 = 8991.', true),
        opt('Immer 4 Stellen, denn 3 + 1 = 4.', false, 'mal-stellenwert'), opt('Immer 3 Stellen, denn die größere Zahl hat 3 Stellen.'),
        opt('3, 4 oder 5 Stellen, denn 999 · 9 ist fast 10 000.', false, 'mal-stellenwert'), opt('Das kann man nicht sagen.')],
      h1('Suche das kleinste und das größte mögliche Produkt.'), { nachweis: [HILFSZAHL(3, 'Stellen von 100'), HILFSZAHL(4, 'Stellen von 8991'), ...N('100 · 1', '999 · 9')] });
      const zahlen = suche(() => Array.from({ length: 4 }, () => [zz(4, 9), zz(2001, 6999)]), (l) => new Set(l.map(([d]) => d)).size === 4 && new Set(l.map(([d, x]) => d * x)).size === 4
        && (() => { const w = l.map(([d, x]) => d * x).sort((p, q) => q - p); return w[0] - w[1] < 2000 && w[0] - w[1] > 0; })());
      return auswahl('Welches Produkt ist am größten? Entscheide zuerst mit einem Überschlag und prüfe dann genau.', zahlen.map(([d, x]) => opt(`${d} · ${fz(x)}`, d * x === Math.max(...zahlen.map(([u, v]) => u * v)))),
        h1('Ein Überschlag zeigt, welche Produkte infrage kommen. Bei knappen Fällen rechnest du genau.'), { nachweis: [GROESSTES, ...N(...zahlen.map(([d, x]) => `${d} · ${x}`))] });
    },
  });

  // ===================================================================
  // M3 Schriftlich mit einer mehrstelligen Zahl multiplizieren
  // ===================================================================
  const kleinePaare = [[11, 11], [11, 12], [12, 11], [11, 13], [13, 11], [12, 12]];
  sechs(M('M3'), 'F', [
    () => { const [a, b] = wahl(kleinePaare);
      return malkreuz(Z(`Rechne ${a} · ${b} mit dem Malkreuz.`, 'Zerlege beide Zahlen in Zehner und Einer.'), [10, a - 10], [10, b - 10],
        h3('Rechne jedes Feld aus. Addiere dann alle Felder.', a * b === 132 ? '13 · 11: 10 · 10 = 100, 10 · 1 = 10, 3 · 10 = 30, 3 · 1 = 3. Zusammen 143.' : '11 · 12: 10 · 10 = 100, 10 · 2 = 20, 1 · 10 = 10, 1 · 2 = 2. Zusammen 132.', 'Beginne mit 10 · 10 = 100.')); },
    () => { const [a, b] = wahl(kleinePaare);
      return malkreuz(Z(`Rechne ${a} · ${b}.`, 'Zwei Felder sind schon ausgefüllt.'), [10, a - 10], [10, b - 10],
        h3('Rechne die leeren Felder aus. Addiere dann alle vier Felder.', a * b === 132 ? '13 · 11: Die Felder sind 100, 10, 30 und 3. Zusammen 143.' : '12 · 11: Die Felder sind 100, 10, 20 und 2. Zusammen 132.', `Es fehlen ${a - 10} · 10 und ${a - 10} · ${b - 10}.`), { gegeben: [[0, 0], [0, 1]] }); },
    () => { const b = zz(11, 12);
      return zahl(Z('Rechne.', `10 · ${b}`), 10 * b, fehlerliste(10 * b, [[b, 'mal-stellenwert'], [b + 10, '1x1-addiert']]),
        h3('Mal 10: An die Zahl wird eine Null angehängt.', '10 · 13 = 130.', `Hänge an ${b} eine Null an.`), { bild: B.feld(10, b), nachweis: N(`10 · ${b}`) }); },
    () => { const b = wahl([11, 12]);
      return auswahl(Z(`${b} · ${b} = 10 · ${b} + ${b - 10} · ${b}`, `Was ist ${b - 10} · ${b}?`), [opt(String((b - 10) * b), true), opt(String(b - 10 + b), false, '1x1-addiert'), opt(String(10 * b), false, 'mal-stellenwert')],
        h3('Schau ins Bild unter die rote Linie.', '3 · 11: 3 Reihen mit je 11 Punkten. Das sind 33.', `Unter der Linie sind ${b - 10} Reihen mit je ${b} Punkten.`), { bild: B.feld(b, b, 10), nachweis: [HILFSZAHL(b * b, `Punkte im ganzen Feld ${b} · ${b}`), ...N(`${b - 10} · ${b}`)] }); },
    () => { const [a, b] = wahl([[13, 11], [11, 13], [12, 12]]);
      return malkreuz(Z(`Rechne ${a} · ${b} mit dem Malkreuz.`), [10, a - 10], [10, b - 10],
        h3('Zerlege beide Zahlen. Rechne jedes Feld aus und addiere.', '11 · 11: 100 + 10 + 10 + 1 = 121.', 'Das Feld oben links ist 10 · 10 = 100.')); },
    () => { const b = wahl([11, 12]);
      return zahl(Z('Rechne.', `11 · ${b}`), 11 * b, fehlerliste(11 * b, [[10 * b + 1, 'mal-zerlegung-halb'], [11 + b, '1x1-addiert']]),
        h3('11 ist 10 und 1. Nimm beide Teile mal.', '11 · 13: 10 · 13 = 130 und 1 · 13 = 13. Zusammen 143.', `10 · ${b} = ${10 * b}. Dazu kommt 1 · ${b} = ${b}.`), { bild: B.feld(11, b, 10), nachweis: N(`10 · ${b}`, `1 · ${b}`, `${10 * b} + ${b}`, `11 · ${b}`) }); },
  ]);

  const zweistellig = () => suche(() => [zz(12, 98), zz(12, 98)], ([x, y]) => ohneNull(y) && x % 10 !== 0 && x !== y);
  stufen(M('M3'), 'G', {
    1: (k) => {
      if (k === 0) { const [a, b] = zweistellig();
        return rasterMal(Z('Rechne schriftlich.', `${a} · ${b}`), a, b, h3('Rechne für jede Ziffer des zweiten Faktors ein Teilprodukt. Es endet unter dieser Ziffer. Addiere dann.', '41 · 32: 41 · 3 = 123, darunter 41 · 2 = 82, um eine Stelle nach rechts. Zusammen 1312.', `Das erste Teilprodukt ist ${a} · ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)}.`)); }
      if (k === 1) { const [a, b] = zweistellig();
        return rasterMal(Z('Die Teilprodukte stehen schon da.', 'Addiere sie zum Ergebnis.', `${a} · ${b}`), a, b, h3('Addiere die Teilprodukte genau so, wie sie untereinanderstehen.', '23 · 14: 23 · 1 = 23 und 23 · 4 = 92. Die 23 steht eine Stelle weiter links. Zusammen 322.', `Rechne Spalte für Spalte von rechts nach links.`), { vorgegeben: true }); }
      const [a, b] = zweistellig();
      return zahl(Z('Rechne schriftlich im Heft.', `${a} · ${b}`), a * b, fehlerliste(a * b, [[malNichtEingerueckt(a, b), 'mal-nicht-eingerueckt'], [a * (b % 10), 'sach-schritt-vergessen']]),
        h3('Für jede Ziffer des zweiten Faktors gibt es ein Teilprodukt.', '21 · 13: 21 · 1 = 21 und 21 · 3 = 63. Die 21 rückt eine Stelle nach links: 210 + 63 = 273.', `Rechne zuerst ${a} · ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)}.`), { nachweis: N(`${a} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(12, 49), zz(12, 49)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && x !== y);
        return malkreuz(Z(`Rechne ${a} · ${b} mit dem Malkreuz.`), zehnerEiner(a), zehnerEiner(b),
          h3('Zerlege beide Zahlen in Zehner und Einer. Rechne jedes Feld aus und addiere.', '12 · 23: 200 + 30 + 40 + 6 = 276.', `Das Feld oben links ist ${zehnerEiner(a)[0]} · ${zehnerEiner(b)[0]} = ${zehnerEiner(a)[0] * zehnerEiner(b)[0]}.`)); }
      const [a, b] = zweistellig(), z = b - b % 10, e = b % 10;
      return luecken(Z(`Rechne ${a} · ${b} in Schritten.`, `${a} · ${z} = {{a}}`, `${a} · ${e} = {{b}}`, `${a} · ${b} = {{c}}`), { a: a * z, b: a * e, c: [a * b, fehlerliste(a * b, [[malNichtEingerueckt(a, b), 'mal-nicht-eingerueckt']])] },
        h3(`Zerlege ${b} in ${z} und ${e}.`, '23 · 14: 23 · 10 = 230 und 23 · 4 = 92. Zusammen 322.', `${a} · ${z} = ${a * z}. Addiere am Ende beide Ergebnisse.`), { nachweis: N(`${a} · ${z}`, `${a} · ${e}`, `${a * z} + ${a * e}`, `${a} · ${b}`) });
    },
    3: () => { const [a, b] = suche(() => [zz(21, 49), zz(21, 49)], ([x, y]) => ohneNull(y) && x % 10 !== 0 && x !== y), z = Math.floor(b / 10), e = b % 10, k = kind(), falsch = a * z + a * e;
      return auswahl(Z(`${k} rechnet ${a} · ${b} so:`, `${a} · ${z} = ${a * z}`, `${a} · ${e} = ${a * e}`, `${a * z} + ${a * e} = ${falsch}`, 'Stimmt das?'), [
        opt(`Falsch. Es ist ${a} · ${z * 10} = ${a * z * 10}. Richtig ist ${a * b}.`, true),
        opt('Stimmt. Alle Rechnungen sind richtig.', false, 'mal-nicht-eingerueckt'),
        opt(`Falsch. Richtig ist ${falsch * 10}.`, false, 'mal-stellenwert')],
      h3('Mache einen Überschlag. Passt das Ergebnis?', '23 · 31: Überschlag 20 · 30 = 600. 23 · 3 = 69 gehört eine Stelle nach links: 690.', `Die ${z} in ${b} steht für ${z * 10}.`), { nachweis: [U(false, `${a} · ${b}`, falsch), ...N(`${a} · ${z * 10}`, `${a * z * 10} + ${a * e}`, `${a} · ${b}`)] }); },
  });

  const dreiMalZwei = () => suche(() => [zz(123, 899), zz(23, 89)], ([x, y]) => ohneNull(y) && x * y <= 99999);
  stufen(M('M3'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b] = dreiMalZwei();
        return rasterMal(`Rechne schriftlich: ${a} · ${b}`, a, b, h2('Je Ziffer des zweiten Faktors ein Teilprodukt, jedes endet unter seiner Ziffer. Dann addieren.', `Das erste Teilprodukt ist ${a} · ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)}.`)); }
      const [a, b] = suche(() => [zz(23, 89), zz(1, 9) * 100 + zz(1, 9)], ([x, y]) => x % 10 !== 0 && x * y <= 99999);
      return zahl(`Berechne ${a} · ${b}.`, a * b, fehlerliste(a * b, [[malNullVergessen(b, a), 'mal-null-vergessen']]), h2('Tausche die Faktoren, wenn es dir leichter fällt. Achte auf die Null.', `${a} · ${b} = ${a} · ${Math.floor(b / 100) * 100} + ${a} · ${b % 10}.`), { nachweis: N(`${a} · ${Math.floor(b / 100) * 100} + ${a} · ${b % 10}`, `${a} · ${b}`) });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(1, 9) * 100 + zz(1, 9), zz(23, 89)], ([x, y]) => ohneNull(y) && x * y <= 99999);
        return zahl(`Rechne schriftlich: ${a} · ${b}`, a * b, fehlerliste(a * b, [[malNichtEingerueckt(a, b), 'mal-nicht-eingerueckt'], [malNullVergessen(a, b), 'mal-null-vergessen']]),
          h2('Achte auf die Null im ersten Faktor und auf das Einrücken.', `Das erste Teilprodukt ist ${a} · ${Math.floor(b / 10)} = ${a * Math.floor(b / 10)}.`), { nachweis: N(`${a} · ${b}`) }); }
      if (k === 1) { const [a, b] = dreiMalZwei(), falsch = malNichtEingerueckt(a, b), k_ = kind();
        return auswahl(`${k_} rechnet ${a} · ${b} = ${fz(falsch)}. Welchen Fehler hat ${k_} gemacht?`, [
          opt(`${k_} hat die Teilprodukte nicht stellengerecht untereinandergeschrieben. Richtig ist ${fz(a * b)}.`, true),
          opt(`${k_} hat sich bei ${a} · ${Math.floor(b / 10)} verrechnet.`), opt(`${k_} hat einen Übertrag vergessen.`, false, 'mal-uebertrag-vergessen'), opt(`${k_} hat richtig gerechnet.`, false, 'mal-nicht-eingerueckt')],
        h2('Mache einen Überschlag. Ist das Ergebnis viel zu klein?', `Überschlag: ${fuehrend(a)} · ${fuehrend(b)} = ${fz(fuehrend(a) * fuehrend(b))}.`), { nachweis: [U(false, `${a} · ${b}`, falsch), ...N(`${a} · ${Math.floor(b / 10)}`, `${a} · ${b % 10}`, `${a * Math.floor(b / 10)} + ${a * (b % 10)}`, `${fuehrend(a)} · ${fuehrend(b)}`, `${a} · ${b}`)] }); }
      const r = suche(() => { const a = zz(21, 79), b = zz(21, 79); const x = raetsel(`${a} · ${b} = ${a * b}`, [1, 3]); return x && { a, b, ...x }; }, (x) => x && a_ok(x));
      return luecken(`Welche Ziffern fehlen? ${r.text}`, r.werte, h2('Die Einerziffer des Produkts verrät dir viel über die Einerziffern der Faktoren.', `Probiere zuerst die Ziffer im ersten Faktor.`), { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: r.muster, ziffern: r.ziffern }] });
    },
    3: () => { const [a, b] = dreiMalZwei(), falsch = malNichtEingerueckt(a, b), [k1, k2] = zweiKinder(), [ra, rb] = [fuehrend(a), fuehrend(b)];
      return auswahl(`${k1} rechnet ${a} · ${b} = ${fz(a * b)}. ${k2} rechnet ${a} · ${b} = ${fz(falsch)}. Wer hat recht?`, [
        opt(`${k1}. Überschlag: ${ra} · ${rb} = ${fz(ra * rb)}. Dazu passt nur ${fz(a * b)}.`, true),
        opt(`${k2}. Die Teilprodukte werden einfach addiert.`, false, 'mal-nicht-eingerueckt'),
        opt('Beide. Die Teilprodukte sind bei beiden gleich.'),
        opt(`Keiner. Richtig ist ${fz(a * b * 10)}.`, false, 'mal-stellenwert')],
      h2('Ein Überschlag zeigt, welches Ergebnis passen kann.', `Runde ${a} auf ${ra} und ${b} auf ${rb}.`), { nachweis: [U(false, `${a} · ${b}`, falsch), `${a} ≈ ${ra}`, `${b} ≈ ${rb}`, ...N(`${ra} · ${rb}`, `${a} · ${b}`)] }); },
  });

  stufen(M('M3'), 'E', {
    1: () => { const [a, b] = suche(() => [zz(1203, 9876), zz(23, 98)], ([x, y]) => x * y <= 999999);
      return zahl(`Rechne schriftlich: ${fz(a)} · ${b}`, a * b, fehlerliste(a * b, [[malNichtEingerueckt(a, b), 'mal-nicht-eingerueckt']]), h1('Mache zuerst einen Überschlag, damit du dein Ergebnis prüfen kannst.'), { nachweis: N(`${a} · ${b}`) }); },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(213, 989), zz(213, 989)], ([x, y]) => x * y <= 999999 && x !== y);
        return zahl(`Rechne schriftlich: ${a} · ${b}`, a * b, fehlerliste(a * b, [[malNichtEingerueckt(a, b), 'mal-nicht-eingerueckt']]), h1('Bei drei Ziffern im zweiten Faktor gibt es drei Teilprodukte.'), { nachweis: N(`${a} · ${b}`) }); }
      if (k === 1) { const r = suche(() => { const a = zz(21, 98), b = zz(21, 98); const x = raetsel(`${a} · ${b} = ${a * b}`, [0, 3, 5]); return x && { a, b, ...x }; }, (x) => x && a_ok(x));
        return luecken(`Welche Ziffern fehlen? ${r.text}`, r.werte, h1('Überlege zuerst, wie groß die Faktoren ungefähr sein müssen.'), { ziffernfelder: true, nachweis: [{ art: 'ziffern', muster: r.muster, ziffern: r.ziffern }] }); }
      const [a, b] = suche(() => [zz(24, 68), zz(123, 389)], ([x, y]) => x * y <= 99999);
      return zahl(`Welche Zahl fehlt? ${a} · ▢ = ${fz(a * b)}`, b, fehlerliste(b, [[b + 1, '1x1-nachbar']]), h1('Die Umkehraufgabe hilft dir.'), { nachweis: N(`${a * b} : ${a}`, `${a} · ${b}`) });
    },
    3: (k) => {
      if (k === 0) return auswahl('Wie viele Stellen hat das Produkt zweier zweistelliger Zahlen höchstens? Wähle die Antwort mit der richtigen Begründung.', [
        opt('4 Stellen, denn das größte Produkt ist 99 · 99 = 9801.', true),
        opt('5 Stellen, denn 99 · 99 ist fast 10 000.', false, 'mal-stellenwert'), opt('3 Stellen, denn 10 · 10 = 100.'), opt('2 Stellen, wie die Faktoren.'), opt('Das kann man nicht sagen.')],
      h1('Welches ist das größte Produkt zweier zweistelliger Zahlen?'), { nachweis: [HILFSZAHL(4, 'Stellen von 9801'), ...N('99 · 99', '10 · 10')] });
      const n = zz(23, 79), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${n} · ${n} ist kleiner als ${n + 1} · ${n - 1}.“ ${k2} sagt: „${n} · ${n} ist größer.“ Wer hat recht?`, [
        opt(`${k2}. ${n} · ${n} = ${n * n} und ${n + 1} · ${n - 1} = ${(n + 1) * (n - 1)}. Der Unterschied ist genau 1.`, true),
        opt(`${k1}. ${n + 1} ist größer als ${n}.`), opt('Keiner. Beide Produkte sind gleich groß.'),
        opt(`${k1}. ${n} · ${n} = ${n * n - 100}.`, false, 'mal-stellenwert')],
      h1('Rechne beide Produkte aus. Was fällt dir auf?'), { nachweis: N(`${n} · ${n}`, `${n + 1} · ${n - 1}`, `${n * n} − ${(n + 1) * (n - 1)}`) });
    },
  });

  // ===================================================================
  // M4 Überschlag und Probe
  // ===================================================================
  sechs(M('M4'), 'F', [
    () => { const [a, b] = suche(() => [zz(4, 9), zz(3, 9)], ([x, y]) => x !== y && x * y / x !== x * y / y);
      return auswahl(Z(`${a} · ${b} = ${a * b}`, 'Welche Geteilt-Aufgabe passt dazu?'), [opt(`${a * b} : ${b} = ${a}`, true), opt(`${a * b} : ${a} = ${b + 1}`, false, 'div-einmaleins'), opt(`${a * b} + ${b} = ${a * b + b}`, false, 'probe-falsche-umkehr')],
        h3('Geteilt macht Mal rückgängig.', a * b === 12 ? '2 · 5 = 10. Dazu passt 10 : 5 = 2.' : '3 · 4 = 12. Dazu passt 12 : 4 = 3.', `Teile ${a * b} durch ${b}. Was kommt heraus?`), { bild: B.feld(a, b), nachweis: N(`${a * b} : ${b}`, `${a} · ${b}`) }); },
    () => { const z = zz(3, 9), e = suche(() => zz(1, 9), (x) => x !== 5), n = z * 10 + e, gerundet = runde(n, 10);
      return zahl(Z(`Runde ${n} auf Zehner.`), gerundet, fehlerliste(gerundet, [[e >= 5 ? z * 10 : z * 10 + 10, 'falsch-gerundet']]),
        h3('Welcher glatte Zehner liegt näher?', '43 liegt näher an 40 als an 50. 47 liegt näher an 50.', `${n} liegt zwischen ${z * 10} und ${z * 10 + 10}. Schau auf den Strahl.`), { bild: B.strahl({ von: z * 10, bis: z * 10 + 10, schritt: 1, beschriftung: 10, start: n }), nachweis: [`${n} ≈ ${gerundet}`] }); },
    () => { const [a, b] = suche(() => [zz(4, 9), zz(4, 9)], ([x, y]) => x !== y);
      return zahl(Z(`Prüfe ${a} · ${b} = ${a * b}.`, `Rechne ${a * b} : ${b}.`), a, fehlerliste(a, [[b, 'div-vertauscht'], [a + 1, 'div-einmaleins']]),
        h3('Kommt die erste Zahl wieder heraus, stimmt die Mal-Aufgabe.', '5 · 6 = 30. Prüfe: 30 : 6 = 5. Das stimmt.', `Im Bild sind ${a * b} Punkte in Reihen mit je ${b}. Zähle die Reihen.`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${a * b} : ${b}`) }); },
    () => { const a = zz(2, 4), z = zz(2, 3), n = z * 10 - zz(1, 2);
      return zahl(Z('Rechne ungefähr.', `${a} · ${n}`, `Rechne dafür ${a} · ${z * 10}.`), a * z * 10, fehlerliste(a * z * 10, [[a * n, 'ueberschlag-nicht-gerundet'], [a * z, 'mal-stellenwert']]),
        h3('Statt der krummen Zahl nimmst du den Zehner in der Nähe.', '3 · 19 ist ungefähr 3 · 20 = 60.', `${z * 10} sind ${z} Zehner. ${a} · ${z} Zehner sind ${a * z} Zehner.`), { bild: B.material({ z }), nachweis: [`${n} ≈ ${z * 10}`, ...N(`${a} · ${z * 10}`)] }); },
    () => { const a = zz(2, 4), z = zz(2, 3), n = z * 10 - 1, falsch = a * n + 30, k = kind();
      return auswahl(Z(`${k} rechnet ${a} · ${n} = ${falsch}.`, `Ungefähr ist es ${a} · ${z * 10} = ${a * z * 10}.`, `Kann ${falsch} stimmen?`), [
        opt(`Nein.\n${falsch} ist zu groß.\nEs muss etwas weniger als ${a * z * 10} sein.`, true), opt(`Ja.\n${falsch} ist nah an ${a * z * 10}.`, false, 'ueberschlag-nicht-gerundet'), opt('Ja.\nDas kann man nicht sehen.')],
      h3('Vergleiche mit dem ungefähren Ergebnis.', '2 · 19 ist ungefähr 2 · 20 = 40. Das Ergebnis ist etwas kleiner als 40.', `${n} ist kleiner als ${z * 10}. Also ist ${a} · ${n} kleiner als ${a * z * 10}.`), { bild: B.material({ z }), nachweis: [U(false, `${a} · ${n}`, falsch), `${n} ≈ ${z * 10}`, ...N(`${a} · ${z * 10}`)] }); },
    () => { const [a, b] = suche(() => [zz(4, 9), zz(4, 9)], ([x, y]) => x !== y);
      return zahl(Z(`${a} · ${b} = ${a * b}`, `Prüfe: ${a * b} : ${b} = ▢`), a, fehlerliste(a, [[b, 'div-vertauscht']]),
        h3('Die Geteilt-Aufgabe führt zurück zur ersten Zahl.', '4 · 7 = 28. Prüfe: 28 : 7 = 4.', `Wie viele Reihen mit je ${b} Punkten sind im Bild?`), { bild: B.feld(a, b), nachweis: N(`${a} · ${b}`, `${a * b} : ${b}`) }); },
  ]);

  stufen(M('M4'), 'G', {
    1: (k) => {
      if (k === 0) { const [z, d] = [zz(3, 8), zz(3, 9)], n = z * 10 + wahl([7, 8, 9]);
        return auswahl(Z('Mache einen Überschlag.', `${n} · ${d}`, 'Welcher Überschlag passt?'), [opt(`${z * 10 + 10} · ${d} = ${(z * 10 + 10) * d}`, true), opt(`${z * 10} · ${d} = ${z * 10 * d}`, false, 'falsch-gerundet'), opt(`${n} · ${d} = ${n * d}`, false, 'ueberschlag-nicht-gerundet')],
          h3('Runde die krumme Zahl auf Zehner. Rechne dann im Kopf.', '38 · 4: 38 wird zu 40. 40 · 4 = 160.', `${n} wird zu ${z * 10 + 10}.`), { bild: B.strahl({ von: z * 10, bis: z * 10 + 10, schritt: 1, beschriftung: 10, start: n }), nachweis: [`${n} ≈ ${z * 10 + 10}`, ...N(`${z * 10 + 10} · ${d}`)] }); }
      if (k === 1) { const [n, d] = suche(() => [zz(211, 849), zz(3, 9)], ([x]) => x % 100 < 50 && x % 100 > 5 && x % 10 !== 0), r = runde(n, 100);
        return zahl(Z('Mache einen Überschlag.', `${n} · ${d}`, `Runde ${n} auf Hunderter.`), r * d, fehlerliste(r * d, [[n * d, 'ueberschlag-nicht-gerundet'], [(r + 100) * d, 'falsch-gerundet']]),
          h3('Runde zuerst. Rechne dann mit der runden Zahl im Kopf.', '312 · 4: 312 wird zu 300. 300 · 4 = 1200.', `${n} wird zu ${r}. Rechne ${r} · ${d}.`), { bild: B.material(hze(n)), nachweis: [`${n} ≈ ${r}`, ...N(`${r} · ${d}`)] }); }
      const [a, d] = suche(() => [zz(23, 89), zz(3, 9)], ([x]) => x % 10 !== 0);
      return zahl(Z('Mache die Probe.', `${d} · ${a} = ${a * d}`, `Rechne ${a * d} : ${d}.`), a, fehlerliste(a, [[a * d - d, 'probe-falsche-umkehr']]),
        h3('Die Probe macht die Mal-Aufgabe rückgängig.', 'Zu 3 · 21 = 63 gehört 63 : 3 = 21.', `Teile ${a * d} durch ${d}. Es muss ${a} herauskommen, wenn die Aufgabe stimmt.`), { bild: B.material(hze(a)), nachweis: N(`${d} · ${a}`, `${a * d} : ${d}`) });
    },
    2: (k) => {
      if (k === 0) { const [n, d] = suche(() => [zz(211, 489), zz(3, 9)], ([x]) => x % 100 < 50 && x % 100 > 5 && x % 10 !== 0), r = runde(n, 100), falsch = n * d * 10, k_ = kind();
        return auswahl(Z(`${k_} rechnet ${n} · ${d} = ${fz(falsch)}.`, 'Mache einen Überschlag.', 'Stimmt das?'), [
          opt(`Falsch.\nÜberschlag: ${r} · ${d} = ${r * d}.\n${fz(falsch)} ist viel zu groß.`, true),
          opt(`Stimmt.\nDie Ziffern passen.`, false, 'mal-stellenwert'),
          opt(`Stimmt.\nÜberschlag: ${r} · ${d} = ${fz(falsch)}.`, false, 'mal-stellenwert')],
        h3('Runde und rechne im Kopf. Vergleiche dann.', '213 · 4: Überschlag 200 · 4 = 800. 8520 wäre viel zu groß.', `${n} wird zu ${r}.`), { nachweis: [U(false, `${n} · ${d}`, falsch), `${n} ≈ ${r}`, ...N(`${r} · ${d}`)] }); }
      const [a, d] = suche(() => [zz(23, 89), zz(3, 9)], ([x]) => x % 10 !== 0);
      return luecken(Z(`${a} · ${d} = {{x}}`, `Probe: {{y}} : ${d} = ${a}`), { x: a * d, y: a * d },
        h3('Rechne zuerst die Mal-Aufgabe. Bei der Probe teilst du das Ergebnis wieder.', '21 · 3 = 63. Probe: 63 : 3 = 21.', `${a} · ${d} = ${a * d}.`), { nachweis: N(`${a} · ${d}`, `${a * d} : ${d}`) });
    },
    3: () => { const [z, d] = [zz(3, 8), zz(4, 9)], n = z * 10 + 9, k_ = kind();
      return auswahl(Z(`${k_} sagt:`, `„Bei ${n} · ${d} ist der Überschlag ${z * 10 + 10} · ${d} = ${(z * 10 + 10) * d}.`, `Also ist das Ergebnis kleiner als ${(z * 10 + 10) * d}.“`, 'Stimmt das?'), [
        opt(`Stimmt.\n${n} ist kleiner als ${z * 10 + 10}.\nAlso ist ${n} · ${d} kleiner als ${z * 10 + 10} · ${d}.`, true),
        opt(`Falsch.\nDas Ergebnis ist größer als ${(z * 10 + 10) * d}.`, false, 'falsch-gerundet'), opt('Falsch.\nDas kann man ohne Rechnen nicht wissen.')],
      h3('Wurde beim Runden größer oder kleiner gemacht?', '29 · 3: 29 wurde zu 30 aufgerundet. 29 · 3 = 87 ist kleiner als 30 · 3 = 90.', `${n} wurde zu ${z * 10 + 10} aufgerundet.`), { nachweis: [U(true), ...N(`${z * 10 + 10} · ${d}`, `${n} · ${d}`)] }); },
  });

  stufen(M('M4'), 'M', {
    1: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(212, 889), zz(21, 89)], ([x, y]) => x % 100 > 5 && x % 100 < 95 && y % 10 !== 0 && y % 10 !== 5 && x % 100 !== 50), [ra, rb] = [runde(a, 100), runde(b, 10)];
        return zahl(`Überschlage ${a} · ${b}. Runde dazu auf Hunderter und auf Zehner.`, ra * rb, fehlerliste(ra * rb, [[a * b, 'ueberschlag-nicht-gerundet']]), h2('Runde jede Zahl auf ihre höchste Stelle und rechne im Kopf.', `${a} wird zu ${ra}, ${b} wird zu ${rb}.`), { nachweis: [`${a} ≈ ${ra}`, `${b} ≈ ${rb}`, ...N(`${ra} · ${rb}`)] }); }
      const [a, d] = suche(() => [zz(1203, 8796), zz(3, 9)], ([x]) => x % 1000 > 100 && x % 1000 < 400), r = runde(a, 1000);
      return zahl(`Überschlage ${d} · ${fz(a)}. Runde dazu auf Tausender.`, r * d, fehlerliste(r * d, [[a * d, 'ueberschlag-nicht-gerundet']]), h2('Runde auf Tausender. Dann ist es eine Einmaleins-Aufgabe mit Nullen.', `${fz(a)} wird zu ${fz(r)}.`), { nachweis: [`${a} ≈ ${r}`, ...N(`${d} · ${r}`)] });
    },
    2: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(312, 789), zz(31, 69)], ([x, y]) => y % 10 !== 0 && x * y <= 99999 && x * y >= 10000), p = a * b;
        const falsch = [Math.round(p / 10), p * 10, p + 10000].filter((x) => x <= 999999);
        return auswahl(`Welches Ergebnis gehört zu ${a} · ${b}? Entscheide mit einem Überschlag.`, [opt(fz(p), true), ...falsch.map((x) => opt(fz(x), false, 'mal-stellenwert'))],
          h2('Runde beide Zahlen und rechne im Kopf.', `Überschlag: ${fuehrend(a)} · ${fuehrend(b)} = ${fz(fuehrend(a) * fuehrend(b))}.`), { nachweis: [`${a} ≈ ${fuehrend(a)}`, `${b} ≈ ${fuehrend(b)}`, ...N(`${fuehrend(a)} · ${fuehrend(b)}`, `${a} · ${b}`)] }); }
      if (k === 1) { const [a, d] = suche(() => [zz(123, 987), zz(3, 9)], ([x]) => x % 10 !== 0);
        return zahl(`Prüfe ${a * d} : ${d} = ${a} mit der Umkehraufgabe. Was kommt bei der Probe heraus?`, a * d, fehlerliste(a * d, [[a + d, 'probe-falsche-umkehr']]), h2('Die Umkehraufgabe zur Division ist die Multiplikation.', `Rechne ${a} · ${d}.`), { nachweis: N(`${a * d} : ${d}`, `${a} · ${d}`) }); }
      const paare = suche(() => Array.from({ length: 4 }, () => [zz(31, 89), zz(31, 89)]), (l) => l.every(([x, y]) => x % 10 !== 0 && y % 10 !== 0) && new Set(l.map(([x, y]) => x * y)).size === 4);
      const falschIndex = zz(0, 3);
      const optionen = paare.map(([x, y], i) => opt(`${x} · ${y} = ${fz(i === falschIndex ? x * y * 10 : x * y)}`, i === falschIndex));
      return auswahl('Welche Rechnung ist sicher falsch? Entscheide mit einem Überschlag.', optionen,
        h2('Runde beide Faktoren auf Zehner. Passt das Ergebnis zur Größe?', `${paare[0][0]} · ${paare[0][1]}: Überschlag ${runde(paare[0][0], 10)} · ${runde(paare[0][1], 10)} = ${fz(runde(paare[0][0], 10) * runde(paare[0][1], 10))}.`), { nachweis: [{ art: 'gleichungen', falsche: true }] });
    },
    3: () => { const [a, b] = suche(() => [zz(301, 349), zz(51, 59)], () => true), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „${a} · ${b} ist größer als 300 · 50 = ${fz(15000)}.“ ${k2} sagt: „Es ist kleiner.“ Wer hat recht?`, [
        opt(`${k1}. ${a} ist größer als 300, und ${b} ist größer als 50. Also ist das Produkt größer als 300 · 50.`, true),
        opt(`${k2}. Beim Runden wird ein Ergebnis immer größer.`, false, 'falsch-gerundet'),
        opt('Keiner. Man muss genau rechnen, sonst weiß man es nicht.'),
        opt(`${k2}. ${fz(15000)} ist eine runde Zahl.`)],
      h2('Wurden die Zahlen beim Runden größer oder kleiner?', `${a} wurde zu 300 abgerundet, ${b} zu 50.`), { nachweis: N('300 · 50', `${a} · ${b}`) }); },
  });

  stufen(M('M4'), 'E', {
    1: () => { const [a, d] = suche(() => [zz(21301, 89399), zz(3, 9)], ([x]) => x % 10000 > 1000 && x % 10000 < 4000), r = runde(a, 10000);
      return zahl(`Überschlage ${d} · ${fz(a)} mit einer gerundeten Zahl.`, r * d, fehlerliste(r * d, [[a * d, 'ueberschlag-nicht-gerundet'], [r * d / 10, 'mal-stellenwert']]), h1('Runde auf die höchste Stelle.'), { nachweis: [`${a} ≈ ${r}`, ...N(`${d} · ${r}`)] }); },
    2: (k) => {
      if (k === 0) { const d = zz(3, 9), n = suche(() => zz(391, 899), (x) => x % 100 > 90), r = runde(n, 100), k_ = kind();
        return zahl(`${k_} rechnet ${d} · ${n} und rundet ${n} dafür auf ${r}. Um wie viel ist der Überschlag größer als das genaue Ergebnis?`, (r - n) * d, fehlerliste((r - n) * d, [[r - n, 'sach-schritt-vergessen']]), h1('Wie viel wurde beim Runden dazugegeben, und wie oft zählt das?'),
          { nachweis: N(`${r} − ${n}`, `${d} · ${r - n}`, `${d} · ${r}`, `${d} · ${n}`, `${r * d} − ${n * d}`) }); }
      if (k === 1) { const [a, d] = suche(() => [zz(312, 989), zz(4, 9)], ([x]) => x % 10 !== 0);
        return zahl(`Welche Zahl fehlt? ${d} · ▢ = ${fz(a * d)}. Löse mit einer Geteilt-Aufgabe.`, a, fehlerliste(a, [[a * d - d, 'probe-falsche-umkehr']]), h1('Welche Rechnung macht das Malnehmen rückgängig?'), { nachweis: N(`${a * d} : ${d}`, `${d} · ${a}`) }); }
      const [x, y] = suche(() => [zz(36, 44), zz(66, 74)], ([u, v]) => u % 10 !== 0 && v % 10 !== 0), rx = runde(x, 10), ry = runde(y, 10);
      return zahl(`Wie weit liegt das genaue Ergebnis von ${x} · ${y} vom Überschlag ${rx} · ${ry} entfernt?`, Math.abs(rx * ry - x * y), [], h1('Rechne beides aus und bilde den Unterschied.'),
        { nachweis: N(`${rx} · ${ry}`, `${x} · ${y}`, rx * ry > x * y ? `${rx * ry} − ${x * y}` : `${x * y} − ${rx * ry}`) });
    },
    3: (k) => {
      if (k === 0) { const [a, b] = suche(() => [zz(451, 489), zz(46, 49)], () => true);
        return auswahl(`${kind()} überschlägt ${a} · ${b} mit 500 · 50 = ${fz(25000)}. Ist das genaue Ergebnis größer oder kleiner? Wähle die richtige Begründung.`, [
          opt('Kleiner. Beide Zahlen wurden aufgerundet, also ist der Überschlag zu groß.', true),
          opt(`Größer. ${a} wurde aufgerundet.`, false, 'falsch-gerundet'), opt(`Kleiner. ${b} wurde abgerundet.`, false, 'falsch-gerundet'),
          opt('Gleich groß. Ein Überschlag ist immer genau.', false, 'ueberschlag-nicht-gerundet'), opt('Das kann man ohne genaues Rechnen nicht sagen.')],
        h1('Wurde beim Runden größer oder kleiner gemacht?'), { nachweis: [`${a} ≈ 500`, `${b} ≈ 50`, ...N('500 · 50', `${a} · ${b}`)] }); }
      const [x, y] = wahl([[125, 8], [25, 40], [250, 4], [125, 16]]), [k1, k2] = zweiKinder();
      return auswahl(`${k1} sagt: „Die Probe zu ${x} · ${y} = ${x * y} ist ${x * y} : ${x} = ${y}.“ ${k2} sagt: „Die Probe ist ${x * y} : ${y} = ${x}.“ Wer hat recht?`, [
        opt('Beide. Man kann das Produkt durch jeden der beiden Faktoren teilen.', true),
        opt(`Nur ${k1}. Man teilt immer durch den ersten Faktor.`), opt(`Nur ${k2}. Man teilt immer durch den zweiten Faktor.`),
        opt(`Keiner. Die Probe ist ${x * y} − ${x}.`, false, 'probe-falsche-umkehr'), opt('Keiner. Zur Mal-Aufgabe gibt es keine Probe.')],
      h1('Rechne beide Proben aus.'), { nachweis: N(`${x} · ${y}`, `${x * y} : ${x}`, `${x * y} : ${y}`) });
    },
  });

  // ===================================================================
  // M5 Sachaufgaben zur Multiplikation
  // ===================================================================
  sechs(M('M5'), 'F', [
    () => { const [g, je] = [zz(3, 5), zz(4, 8)], ding = wahl(['Äpfel', 'Birnen', 'Möhren']);
      return zahl(Z(`Es gibt ${g} Tüten.`, `In jeder Tüte sind ${je} ${ding}.`, `Wie viele ${ding} sind es?`), g * je, fehlerliste(g * je, [[g + je, '1x1-addiert']]),
        h3('Gleich viele in jeder Tüte: Rechne mal.', '3 Tüten mit je 5 Äpfeln: 3 · 5 = 15.', `Rechne ${g} · ${je}.`), { einheit: ding, bild: B.gruppen(g, je), nachweis: N(`${g} · ${je}`) }); },
    () => { const [g, je] = suche(() => [zz(3, 6), zz(4, 9)], ([x, y]) => x !== y && y - x > 0);
      return auswahl(Z(`Es gibt ${g} Kisten.`, `In jeder Kiste sind ${je} Flaschen.`, 'Welche Rechnung passt?'), [opt(`${g} · ${je}`, true), opt(`${g} + ${je}`, false, 'sach-falsche-rechnung'), opt(`${je} − ${g}`, false, 'sach-falsche-rechnung')],
        h3('Gleich viele in jeder Kiste: Das ist eine Mal-Aufgabe.', '4 Kisten mit je 6 Flaschen: 4 · 6.', `${g} Kisten mit je ${je} Flaschen.`), { bild: B.gruppen(g, je), nachweis: [WERT(g * je), ...N(`${g} · ${je}`)] }); },
    () => { const [n, preis] = [zz(4, 9), zz(2, 5)];
      return zahl(Z(`1 Heft kostet ${preis} €.`, `Ben kauft ${n} Hefte.`, 'Wie viel muss Ben zahlen?'), n * preis, fehlerliste(n * preis, [[n + preis, '1x1-addiert']]),
        h3('Jedes Heft kostet gleich viel. Rechne mal.', '1 Heft kostet 2 €. 3 Hefte kosten 3 · 2 = 6 €.', `Rechne ${n} · ${preis}.`), { einheit: '€', bild: B.gruppen(n, preis), nachweis: N(`${n} · ${preis}`) }); },
    () => { const [r, je] = suche(() => [zz(2, 4), zz(3, 6)], ([x, y]) => x !== y);
      return zuordnen(Z('Welche Rechnung passt zu welcher Geschichte?'), [[`${r} Reihen mit je ${je} Stühlen`, `${r} · ${je}`], [`${r} Stühle und noch ${je} Stühle`, `${r} + ${je}`]],
        h3('Gleich viele in jeder Reihe: mal. Einfach dazu: plus.', '2 Reihen mit je 3 Stühlen: 2 · 3. 2 Stühle und noch 3 Stühle: 2 + 3.', `Bei „${r} Reihen mit je ${je}“ ist jede Reihe gleich groß.`), { bild: B.gruppen(r, je), nachweis: N(`${r} · ${je}`, `${r} + ${je}`) }); },
    () => { const [p, je, lose] = suche(() => [zz(2, 4), zz(4, 6), zz(1, 3)], ([x, y]) => x !== y);
      return zahl(Z(`Es gibt ${p} Packungen mit je ${je} Stiften.`, `Dazu kommen ${lose} einzelne Stifte.`, 'Wie viele Stifte sind es?'), p * je + lose, fehlerliste(p * je + lose, [[p * je, 'sach-schritt-vergessen'], [p + je + lose, '1x1-addiert']]),
        h3('Rechne zuerst die Packungen. Zähle dann die einzelnen Stifte dazu.', p === 2 && je === 5 ? '3 Packungen mit je 4 Stiften sind 12 Stifte. Dazu 2 einzelne: 14.' : '2 Packungen mit je 5 Stiften sind 10 Stifte. Dazu 3 einzelne: 13.', `${p} · ${je} = ${p * je}. Dazu kommen ${lose}.`), { einheit: 'Stifte', bild: B.paeckchen(lose, p, je), nachweis: N(`${p} · ${je}`, `${p * je} + ${lose}`) }); },
    () => { const n = zz(3, 9);
      return zahl(Z('In 1 Karton sind 6 Eier.', `Mia kauft ${n} Kartons.`, 'Wie viele Eier sind es?'), n * 6, fehlerliste(n * 6, [[n + 6, '1x1-addiert']]),
        h3('In jedem Karton sind gleich viele Eier. Rechne mal.', '2 Kartons mit je 6 Eiern: 2 · 6 = 12.', `Rechne ${n} · 6.`), { einheit: 'Eier', bild: B.gruppen(n, 6), nachweis: N(`${n} · 6`) }); },
  ]);

  stufen(M('M5'), 'G', {
    1: (k) => {
      if (k === 0) { const [preis, n] = [zz(56, 99), zz(3, 4)];
        return zahl(Z(`1 Packung Saft kostet ${preis} Cent.`, `Lina kauft ${n} Packungen.`, 'Wie viel Cent muss sie zahlen?'), preis * n, fehlerliste(preis * n, [[preis + n, '1x1-addiert']]),
          h3('Jede Packung kostet gleich viel. Rechne mal.', '1 Packung kostet 75 Cent. 2 Packungen kosten 2 · 75 = 150 Cent.', `Rechne ${n} · ${preis}.`), { einheit: 'Cent', bild: B.streifen(frage(preis * n), Array(n).fill(preis)), nachweis: N(`${n} · ${preis}`) }); }
      if (k === 1) { const [t, st] = [zz(11, 14), zz(14, 19)];
        return zahl(Z(`Ein Turm hat ${t} Treppen.`, `Jede Treppe hat ${st} Stufen.`, 'Wie viele Stufen sind es zusammen?'), t * st, fehlerliste(t * st, [[t + st, '1x1-addiert']]),
          h3('Jede Treppe hat gleich viele Stufen. Rechne mal.', '10 Treppen mit je 15 Stufen: 10 · 15 = 150.', `Rechne ${t} · ${st}. Zerlege ${t} in 10 und ${t - 10}.`), { einheit: 'Stufen', nachweis: N(`${t} · ${st}`, `10 · ${st} + ${t - 10} · ${st}`) }); }
      const [x, n] = [zz(112, 245), zz(3, 4)], [a, b] = zweiKinder();
      return zahl(Z(`${a} hat ${x} Sammelkarten.`, `${b} hat ${n}-mal so viele Karten.`, `Wie viele Karten hat ${b}?`), x * n, fehlerliste(x * n, [[x + n, '1x1-addiert']]),
        h3(`„${n}-mal so viele“ heißt: Rechne mal ${n}.`, '„3-mal so viele wie 120“ sind 3 · 120 = 360.', `Rechne ${x} · ${n}.`), { einheit: 'Karten', bild: B.streifen(frage(x * n), Array(n).fill(x)), nachweis: N(`${x} · ${n}`) });
    },
    2: (k) => {
      if (k === 0) { const [n, t, s] = [zz(21, 29), zz(32, 48), zz(15, 25)];
        return sach(Z(`Eine Schule kauft ${n} Tische für je ${t} €.`, `Dazu kauft sie ${n} Stühle für je ${s} €.`), [
          teil('Wie viel kosten die Tische?', n * t, '€', fehlerliste(n * t, [[n + t, '1x1-addiert']])), teil('Wie viel kosten die Stühle?', n * s, '€'), teil('Wie viel kostet alles zusammen?', n * t + n * s, '€', fehlerliste(n * t + n * s, [[n * t, 'sach-schritt-vergessen']]))],
        h3('Rechne zuerst die Tische und dann die Stühle. Addiere am Ende.', '20 Tische für je 30 € kosten 20 · 30 = 600 €.', `Die Tische kosten ${n} · ${t} €.`), { nachweis: N(`${n} · ${t}`, `${n} · ${s}`, `${n * t} + ${n * s}`) }); }
      const [st, mal] = [zz(32, 68), zz(2, 4)], k_ = kind();
      return zahl(Z(`Eine Treppe hat ${st} Stufen.`, `${k_} geht sie ${mal}-mal hoch und wieder runter.`, 'Wie viele Stufen geht sie insgesamt?'), st * 2 * mal, fehlerliste(st * 2 * mal, [[st * mal, 'sach-schritt-vergessen']]),
        h3('Hoch und runter sind zwei Wege.', 'Eine Treppe mit 20 Stufen: hoch und runter sind 2 · 20 = 40 Stufen.', `Einmal hoch und runter: 2 · ${st} = ${2 * st} Stufen.`), { einheit: 'Stufen', nachweis: [HILFSZAHL(2, 'hoch und runter sind zwei Wege'), ...N(`2 · ${st}`, `${2 * st} · ${mal}`)] });
    },
    3: () => { const plaetze = zz(45, 58), n = zz(3, 4), kinder = suche(() => zz(10, 25) * 10, (x) => x < plaetze * n && x > plaetze * n - 40);
      return auswahl(Z(`Ein Bus hat ${plaetze} Plätze.`, `Es fahren ${n} Busse.`, `${kinder} Kinder fahren mit.`, 'Reicht der Platz?'), [
        opt(`Ja.\n${n} · ${plaetze} = ${n * plaetze}.\n${n * plaetze} ist mehr als ${kinder}.`, true), opt(`Nein.\n${plaetze} + ${n} = ${plaetze + n}.`, false, 'sach-falsche-rechnung'), opt(`Nein.\n${kinder} ist eine große Zahl.`)],
      h3('Rechne aus, wie viele Plätze alle Busse zusammen haben.', '3 Busse mit je 40 Plätzen haben 3 · 40 = 120 Plätze.', `Rechne ${n} · ${plaetze}. Vergleiche mit ${kinder}.`), { bild: B.streifen(frage(n * plaetze), Array(n).fill(plaetze)), nachweis: [U(true), ...N(`${n} · ${plaetze}`, `${n * plaetze} − ${kinder}`)] }); },
  });

  stufen(M('M5'), 'M', {
    1: (k) => {
      if (k === 0) { const [r, p] = [zz(14, 22), zz(18, 28)];
        return zahl(`Ein Kino hat ${r} Reihen mit je ${p} Plätzen. Wie viele Plätze hat das Kino?`, r * p, fehlerliste(r * p, [[r + p, '1x1-addiert'], [malNichtEingerueckt(r, p), 'mal-nicht-eingerueckt']]), h2('Gleich viele Plätze in jeder Reihe: Rechne mal.', `Rechne ${r} · ${p}.`), { einheit: 'Plätze', nachweis: N(`${r} · ${p}`) }); }
      const [preis, n] = [zz(289, 489), zz(11, 15)];
      return zahl(`Ein Fahrrad kostet ${preis} €. Eine Schule kauft ${n} Fahrräder. Wie viel kostet das?`, preis * n, fehlerliste(preis * n, [[preis * 10 + n, 'mal-zerlegung-halb']]), h2('Zerlege die Anzahl in 10 und den Rest.', `10 · ${preis} = ${10 * preis}. Dazu kommen ${n - 10} · ${preis}.`), { einheit: '€', nachweis: N(`10 · ${preis}`, `${n - 10} · ${preis}`, `${10 * preis} + ${(n - 10) * preis}`, `${n} · ${preis}`) });
    },
    2: (k) => {
      if (k === 0) { const [st, t] = suche(() => [wahl([12, 15, 16, 18]), zz(14, 28)], ([x, y]) => x !== y), k_ = kind();
        return zahl(`Ein Turm hat Treppen mit je ${st} Stufen. ${k_} ist ${st * t} Stufen gestiegen. Wie viele Treppen hat ${k_} geschafft?`, t, fehlerliste(t, [[st * t - st, 'div-falsche-rechenart']]), h2('Jetzt rechnest du rückwärts: Wie oft passen die Stufen einer Treppe hinein?', `Rechne ${st * t} : ${st}. Probe: ▢ · ${st} = ${st * t}.`), { einheit: 'Treppen', nachweis: N(`${st * t} : ${st}`, `${t} · ${st}`) }); }
      if (k === 1) { const [r, b, a] = [zz(6, 9), zz(11, 14), zz(45, 75)];
        return sach(`Auf einer Wiese stehen ${r} Reihen mit je ${b} Apfelbäumen. An jedem Baum hängen ${a} Äpfel.`, [
          teil('Wie viele Bäume sind es?', r * b, 'Bäume', fehlerliste(r * b, [[r + b, '1x1-addiert']])), teil('Wie viele Äpfel sind es zusammen?', r * b * a, 'Äpfel', fehlerliste(r * b * a, [[b * a, 'sach-schritt-vergessen']]))],
        h2('Berechne zuerst die Zahl der Bäume. Das ist die Zwischengröße.', `Es sind ${r} · ${b} = ${r * b} Bäume.`), { nachweis: N(`${r} · ${b}`, `${r * b} · ${a}`) }); }
      const [tage, preis, kinder] = [zz(3, 5), zz(24, 38), zz(22, 29)];
      return zahl(`Eine Klasse fährt ${tage} Tage ins Landheim. Pro Tag kostet es für jedes Kind ${preis} €. Es fahren ${kinder} Kinder mit. Wie viel kostet die Fahrt insgesamt?`, tage * preis * kinder, fehlerliste(tage * preis * kinder, [[tage * preis, 'sach-schritt-vergessen'], [preis * kinder, 'sach-schritt-vergessen']]),
        h2('Berechne zuerst, was die Fahrt für ein Kind kostet.', `Für ein Kind: ${tage} · ${preis} = ${tage * preis} €.`), { einheit: '€', nachweis: N(`${tage} · ${preis}`, `${tage * preis} · ${kinder}`) });
    },
    3: () => { const [t, p] = [zz(12, 16), zz(6, 8)], fehlen = zz(4, 9), gaeste = t * p + fehlen, [k1, k2] = zweiKinder();
      return auswahl(`Für ein Fest werden ${t} Tische mit je ${p} Plätzen aufgestellt. Es kommen ${gaeste} Gäste. ${k1} sagt: „Es fehlen ${fehlen} Plätze.“ ${k2} sagt: „Es fehlen ${gaeste - t - p} Plätze.“ Wer hat recht?`, [
        opt(`${k1}. ${t} · ${p} = ${t * p} und ${gaeste} − ${t * p} = ${fehlen}.`, true),
        opt(`${k2}. ${gaeste} − ${t} − ${p} = ${gaeste - t - p}.`, false, 'sach-falsche-rechnung'),
        opt('Keiner. Es sind genug Plätze da.'), opt('Beide. Es kommt auf die Rechnung an.')],
      h2('Wie viele Plätze gibt es an allen Tischen zusammen?', `Es gibt ${t} · ${p} = ${t * p} Plätze.`), { nachweis: [HILFSZAHL(gaeste - t - p, `falsche Rechnung von ${k2}`), ...N(`${t} · ${p}`, `${gaeste} − ${t * p}`)] }); },
  });

  stufen(M('M5'), 'E', {
    1: () => { const [l, n] = [wahl([125, 150, 175, 225, 250]), zz(24, 48)];
      return zahl(`Ein Rohr ist ${l} cm lang. Für eine Leitung werden ${n} Rohre aneinandergelegt. Wie lang ist die Leitung in Zentimetern?`, l * n, fehlerliste(l * n, [[l + n, '1x1-addiert']]), h1('Suche einen geschickten Rechenweg.'), { einheit: 'cm', nachweis: N(`${l} · ${n}`) }); },
    2: (k) => {
      if (k === 0) { const s = zz(62, 88);
        return zahl(`Ein Herz schlägt in einer Minute ${s}-mal. Wie oft schlägt es in einer Stunde?`, s * 60, fehlerliste(s * 60, [[s * 6, 'mal-stellenwert']]), h1('Wie viele Minuten hat eine Stunde?'), { nachweis: [HILFSZAHL(60, '1 Stunde hat 60 Minuten'), ...N(`${s} · 60`)] }); }
      if (k === 1) { const [tage, karten, preis] = [zz(5, 7), zz(215, 285), zz(7, 9)];
        return sach(`Ein Kino verkauft an ${tage} Tagen jeden Tag ${karten} Karten. Eine Karte kostet ${preis} €.`, [
          teil('Wie viele Karten sind das?', tage * karten, 'Karten'), teil('Wie viel Geld nimmt das Kino ein?', tage * karten * preis, '€', fehlerliste(tage * karten * preis, [[karten * preis, 'sach-schritt-vergessen']]))],
        h1('Die Zahl der Karten ist die Zwischengröße.'), { nachweis: N(`${tage} · ${karten}`, `${tage * karten} · ${preis}`) }); }
      const [proTag, wochen, tage] = [zz(42, 68) * 10, 2, zz(3, 6)];
      return zahl(`Eine Bäckerei backt jeden Tag gleich viele Brötchen, auch am Wochenende. In ${wochen} Wochen sind es ${fz(proTag * 14)} Brötchen. Wie viele Brötchen sind es an ${tage} Tagen?`, proTag * tage, fehlerliste(proTag * tage, [[proTag, 'sach-schritt-vergessen']]),
        h1('Berechne zuerst, wie viele Brötchen es an einem Tag sind.'), { einheit: 'Brötchen', nachweis: [HILFSZAHL(7, '1 Woche hat 7 Tage'), ...N(`${wochen} · 7`, `${proTag * 14} : 14`, `${proTag} · ${tage}`)] });
    },
    3: (k) => {
      if (k === 0) { const km = wahl([2, 4, 5]), schritt = 50, n = km * 100000 / schritt;
        return auswahl(`Ein Schritt ist etwa ${schritt} cm lang. Wie viele Schritte brauchst du ungefähr für ${km} km?`, [opt(`etwa ${fz(n)}`, true), opt(`etwa ${fz(n / 10)}`, false, 'mal-stellenwert'), opt(`etwa ${fz(n * 10)}`, false, 'mal-stellenwert'), opt(`etwa ${fz(n / 100)}`, false, 'mal-stellenwert')],
          h1('Wie viele Zentimeter sind 1 km? Wie viele Schritte sind dann 1 m?'), { nachweis: [HILFSZAHL(100000, '1 km sind 100 000 cm'), ...N(`${km} · 100000`, `${km * 100000} : ${schritt}`)] }); }
      const [w, p, voll, je] = [8, 64, zz(2, 4), zz(30, 45)], rest = w - voll, [k1, k2] = zweiKinder();
      return auswahl(`Ein Zug hat ${w} Wagen mit je ${p} Sitzplätzen. ${voll} Wagen sind voll, in den anderen Wagen sitzen je ${je} Personen. ${k1} sagt: „Es sind ${voll * p + rest * je} Personen.“ ${k2} sagt: „Es sind ${w * p} Personen.“ Wer hat recht?`, [
        opt(`${k1}. ${voll} · ${p} + ${rest} · ${je} = ${voll * p} + ${rest * je} = ${voll * p + rest * je}.`, true),
        opt(`${k2}. ${w} · ${p} = ${w * p}.`, false, 'sach-falsche-rechnung'),
        opt(`Keiner. Es sind ${w} · ${je} = ${w * je} Personen.`, false, 'sach-schritt-vergessen'), opt('Beide. Es kommt darauf an, wie man rechnet.')],
      h1('Rechne die vollen Wagen und die anderen Wagen getrennt.'), { nachweis: N(`${w} − ${voll}`, `${voll} · ${p}`, `${rest} · ${je}`, `${voll * p} + ${rest * je}`, `${w} · ${p}`) });
    },
  });
}

// Ein Rätsel ist nur brauchbar, wenn keine verdeckte Ziffer eine führende Null wäre.
function a_ok(r) { return !/(^|[^\d▢])▢/.test(r.muster) || r.ziffern[0] !== 0; }
