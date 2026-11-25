// Aufgaben zu 6.6.3 „Volumeneinheiten“ (Lernziele U1, U2) nach ADR 0015 und ADR 0049.
// U1: mm³, cm³, dm³, m³ und die benachbarte Einheit (Umrechnungszahl 1000). U2: Liter und Milliliter, mehrere Stufen, Komma.
// F wandelt ganze Zahlen in die Nachbareinheit um (mit Einheitentafel), G auch gemischte Angaben, M mit Komma und über mehrere Stufen,
// E sucht Fehler, ordnet und begründet. Hektoliter gibt es erst ab M.

import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, Z, opt, auswahl, luecken, ordnen, H, zahl, lk, kind, FREI, T, faktor, volumen, WERT, URTEIL, VGL, ART, ORD, quaderBild, tafelBild, tafelAufgabe, N } from './6-6-quader.mjs';

const U1 = '6.6.3-U1', U2 = '6.6.3-U2';
const NACHBARN = [['m³', 'dm³', 'm³-dm³'], ['dm³', 'cm³', 'dm³-cm³'], ['cm³', 'mm³', 'cm³-mm³']];
const NAME = { 'mm³': 'Kubikmillimeter', 'cm³': 'Kubikzentimeter', 'dm³': 'Kubikdezimeter', 'm³': 'Kubikmeter', l: 'Liter', ml: 'Milliliter', hl: 'Hektoliter' };
// Wert in mm³ aus Maßzahl (auch Tausendstel als ganze Zahl mit teiler) und Einheit.
const V = (n, e, teiler = 1) => (n * faktor(e)) / teiler;
const hGross = (g, k) => H('F', `1 ${g} sind 1000 ${k}.`, `2 ${g} = 2000 ${k}`, `Rechne mal 1000: Hänge drei Nullen an.`);
const hKlein = (g, k) => H('F', `1000 ${k} sind 1 ${g}.`, `3000 ${k} = 3 ${g}`, 'Rechne durch 1000: Streiche drei Nullen.');
const hG = (g, k) => H('G', `Die Umrechnungszahl ist 1000: 1 ${g} = 1000 ${k}.`, `2 ${g} 500 ${k} = 2000 ${k} + 500 ${k} = 2500 ${k}`, `Wandle zuerst die ${g} um. Addiere dann den Rest.`);
// Umwandeln als Größe mit verlangter Einheit: wert in mm³, von → nach.
const wandle = (niveau, wert, von, nach, einheiten, fehler, tipp, schritt) => volumen(Z(`Wandle ${T(wert, von)} in ${NAME[nach]} um.`), wert, nach, fehler,
  H(niveau, tipp, schritt), { einheiten, verlangt: true, nachweis: [`${T(wert, von)} = ${T(wert, nach)}`] });

export function einheiten6() {
  // ================= U1: Volumeneinheiten und die benachbarte Einheit =================
  sechs(U1, 'F', [
    () => { const n = zz(2, 9); return luecken(Z('Die Tafel hilft dir.', 'Wandle um.', `${n} dm³ = {{a}} cm³`), { a: lk(n * 1000, [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']]) }, hGross('dm³', 'cm³'),
      { bild: tafelBild('dm³-cm³', V(n, 'dm³')), nachweis: [`${n} dm³ = ${n * 1000} cm³`] }); },
    () => { const [g, k, tafel] = wahl(NACHBARN), n = zz(2, 9);
      return tafelAufgabe(Z(`Trage ${n} ${g} in die Tafel ein.`, `Lies dann in ${k} ab.`), tafel, V(n, g), [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl'], [n, 'umrechnungszahl']],
        H('F', 'Jede Einheit hat drei Spalten. In jede Spalte kommt eine Ziffer.', `Für 2 ${g} steht die 2 in der rechten Spalte von ${g}. Bei ${k} stehen drei Nullen.`, `Schreibe die Ziffer bei ${g} ganz rechts. Fülle die Spalten von ${k} mit Nullen.`)); },
    () => { const e = wahl(['cm', 'dm', 'm']); return auswahl(Z('Das Volumen von dem Quader wird gemessen.', 'Kreuze die passende Einheit an.'), [opt(`${e}³`, true), opt(`${e}²`, false, 'einheit-art'), opt(e, false, 'einheit-art')],
      H('F', 'Ein Volumen misst du mit Würfeln.', 'cm ist eine Länge. cm² ist eine Fläche. cm³ ist ein Volumen.', 'Suche die Einheit mit der kleinen 3.'), { bild: quaderBild(faktor(e) * zz(3, 6), faktor(e) * zz(2, 3), faktor(e) * 2, e), nachweis: [ART('volumen')] }); },
    () => { const [g, k, tafel] = wahl(NACHBARN), n = zz(2, 9); return luecken(Z('Die Tafel hilft dir.', 'Wandle um.', `${n * 1000} ${k} = {{a}} ${g}`), { a: lk(n, [[n * 10, 'umrechnungszahl'], [n * 100, 'umrechnungszahl']]) }, hKlein(g, k),
      { bild: tafelBild(tafel, V(n, g)), nachweis: [`${n * 1000} ${k} = ${n} ${g}`] }); },
    () => { const n = zz(2, 9), kn = kind();
      return auswahl(Z(`${kn} wandelt um: ${n} dm³ = ${n * 100} cm³.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. 1 dm³ = 1000 cm³. Also ${n} dm³ = ${n * 1000} cm³.`, true), opt('Stimmt.', false, 'umrechnungszahl'), opt(`Falsch. ${n} dm³ = ${n * 10} cm³.`, false, 'umrechnungszahl')],
        H('F', 'Ein Würfel mit 1 dm³ hat 1000 kleine Würfel mit 1 cm³.', '2 dm³ = 2000 cm³', 'Prüfe: Hat das Ergebnis drei Nullen mehr?'), { bild: tafelBild('dm³-cm³', V(n, 'dm³')), nachweis: [`${n} dm³ = ${n * 1000} cm³`, URTEIL(false)] }); },
    () => { const [g, k, tafel] = wahl([NACHBARN[0], NACHBARN[2]]), n = zz(2, 9); return luecken(Z('Die Tafel hilft dir.', 'Wandle um.', `${n} ${g} = {{a}} ${k}`), { a: lk(n * 1000, [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']]) }, hGross(g, k),
      { bild: tafelBild(tafel, V(n, g)), nachweis: [`${n} ${g} = ${n * 1000} ${k}`] }); },
  ]);
  sechs(U1, 'G', [
    () => { const n = zz(11, 99); return luecken(Z('Wandle um.', `${n} cm³ = {{a}} mm³`), { a: lk(n * 1000, [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']]) }, hG('cm³', 'mm³'),
      { bild: tafelBild('cm³-mm³', V(n, 'cm³')), nachweis: [`${n} cm³ = ${N(n * 1000)} mm³`] }); },
    () => { const n = zz(12, 60); return luecken(Z('Wandle um.', `${N(n * 1000)} dm³ = {{a}} m³`), { a: lk(n, [[n * 10, 'umrechnungszahl'], [n * 100, 'umrechnungszahl']]) },
      H('G', 'Die Einheit wird größer. Die Zahl wird kleiner.', `${N(15000)} dm³ = 15 m³`, 'Teile durch die Umrechnungszahl 1000.'), { tippBild: tafelBild('m³-dm³', V(n, 'm³')), nachweis: [`${N(n * 1000)} dm³ = ${n} m³`] }); },
    () => { const [g, k, tafel] = wahl(NACHBARN), n = zz(2, 9), r = zz(1, 19) * 50, w = V(n, g) + V(r, k);
      return luecken(Z('Wandle um.', `${n} ${g} ${r} ${k} = {{a}} ${k}`), { a: lk(n * 1000 + r, [[n * 100 + r, 'umrechnungszahl'], [n + r, 'masszahlen-addiert'], [n * 10 + r, 'umrechnungszahl']]) }, hG(g, k),
        { bild: tafelBild(tafel, w), nachweis: [`${n} ${g} ${r} ${k} = ${n * 1000 + r} ${k}`] }); },
    () => { const [g, k, tafel] = wahl(NACHBARN), n = zz(2, 9), r = zz(1, 19) * 50, w = V(n, g) + V(r, k);
      return luecken(Z('Wandle um.', `${n * 1000 + r} ${k} = {{a}} ${g} {{b}} ${k}`), { a: lk(n), b: lk(r, [[r * 10, 'umrechnungszahl']]) },
        H('G', `1000 ${k} sind 1 ${g}.`, `2500 ${k} = 2 ${g} 500 ${k}`, 'Die Tausender sind die größere Einheit. Der Rest bleibt stehen.'), { bild: tafelBild(tafel, w), nachweis: [`${n * 1000 + r} ${k} = ${n} ${g} ${r} ${k}`] }); },
    () => { const [g, k] = wahl(NACHBARN), n = zz(2, 9), m = wahl([n * 100, n * 1000 - 500, n * 1000 + 500, n * 1000]), l = `${n} ${g}`, r = `${m} ${k}`;
      return auswahl(Z('Vergleiche die beiden Angaben.', 'Kreuze das größere Volumen an.'), [opt(l, n * 1000 > m), opt(r, m > n * 1000, m > n * 1000 ? undefined : 'umrechnungszahl'), opt('Beide sind gleich groß.', m === n * 1000, m === n * 1000 ? undefined : 'umrechnungszahl')],
        H('G', 'Wandle beide Angaben in dieselbe Einheit um.', `2 ${g} = 2000 ${k}`, `Wandle ${g} in ${k} um. Vergleiche dann die Zahlen.`), { nachweis: [`${n} ${g} = ${n * 1000} ${k}`, VGL(l, r, { groesser: l, kleiner: r, gleich: 'Beide sind gleich groß.' })] }); },
    () => auswahl(Z('1 dm³ sind 1000 cm³.', 'Kreuze die richtige Begründung an.'),
      [opt('Ein Würfel mit 1 dm Kantenlänge ist 10 cm lang, breit und hoch. Es passen 10 · 10 · 10 Würfel mit 1 cm³ hinein.', true), opt('1 dm sind 10 cm. Deshalb sind 1 dm³ auch 10 cm³.', false, 'umrechnungszahl'), opt('1 dm² sind 100 cm². Deshalb kommt bei dm³ immer eine Null dazu.', false)],
      H('G', 'Denke an einen Würfel mit 1 dm Kantenlänge.', '1 dm = 10 cm. In eine Reihe passen 10 kleine Würfel.', 'Rechne: Würfel in einer Reihe mal Reihen mal Schichten.'), { nachweis: [FREI('Umrechnungszahl 1000 begründen'), '10 · 10 · 10 = 1000'] }),
  ]);
  sechs(U1, 'M', [
    () => { const [g, k] = wahl(NACHBARN), z = wahl([15, 25, 35, 45, 12, 75, 125, 375]), t = z > 99 ? 100 : 10, w = V(z, g, t);
      return luecken(Z('Wandle um.', `${T(w, g)} = {{a}} ${k}`), { a: lk(w / faktor(k), [[w / faktor(k) / 10, 'umrechnungszahl'], [w / faktor(k) / 100, 'umrechnungszahl']]) },
        H('M', 'Die Einheit wird kleiner, also mal 1000.', 'Verschiebe das Komma um drei Stellen nach rechts. Fülle leere Stellen mit Nullen.'), { nachweis: [`${T(w, g)} = ${T(w, k)}`] }); },
    () => { const [g, k] = wahl(NACHBARN), n = wahl([750, 250, 500, 125, 80, 1500, 2250, 45]), w = V(n, k);
      return wandle('M', w, k, g, [g, k, g.replace('³', '²')], [[w * 10, 'umrechnungszahl'], [w * 100, 'umrechnungszahl'], [w * 1000, 'umrechnungsrichtung']], 'Die Einheit wird größer, also durch 1000.', 'Verschiebe das Komma um drei Stellen nach links.'); },
    () => { const [g, k] = wahl(NACHBARN), z = wahl([42, 36, 18, 105, 64, 7]), w = V(z, g, 10);
      return wandle('M', w, g, k, [k, g, k.replace('³', '²')], [[w / 10, 'umrechnungszahl'], [w / 100, 'umrechnungszahl']], 'Die Einheit wird kleiner, also mal 1000.', 'Verschiebe das Komma um drei Stellen nach rechts.'); },
    () => { const [g, k] = wahl(NACHBARN), n = zz(2, 9), r = wahl([5, 8, 20, 40, 45, 75]);
      return luecken(Z('Wandle um.', `${n} ${g} ${r} ${k} = {{a}} ${k}`), { a: lk(n * 1000 + r, [[Number(`${n}${r}`), 'null-platzhalter'], [n * 100 + r, 'umrechnungszahl'], [n + r, 'masszahlen-addiert']]) },
        H('M', `${n} ${g} sind ${n * 1000} ${k}. Addiere dann ${r} ${k}.`, 'Achte auf die Nullen: Jede Einheit hat in der Einheitentafel drei Spalten.'), { nachweis: [`${n} ${g} ${r} ${k} = ${n * 1000 + r} ${k}`] }); },
    () => { const [g, k] = wahl(NACHBARN), z = wahl([5, 8, 12, 25, 4]), m = wahl([z * 100 - 50, z * 100 + 50, z * 10, z * 100]), l = T(V(z, g, 10), g), r = `${m} ${k}`, lw = z * 100;
      return auswahl(Z('Vergleiche die beiden Angaben.', 'Kreuze das größere Volumen an.'), [opt(l, lw > m), opt(r, m > lw), opt('Beide sind gleich groß.', lw === m)],
        H('M', 'Wandle beide Angaben in dieselbe Einheit um.', `${l} = ${lw} ${k}`), { nachweis: [`${l} = ${lw} ${k}`, VGL(l, r, { groesser: l, kleiner: r, gleich: 'Beide sind gleich groß.' })] }); },
    () => { const [g, k] = wahl(NACHBARN), werte = mische([[8, g, 10], [750, k, 1], [12, g, 10], [900, k, 1], [1300, k, 1], [5, g, 10], [45, g, 100]]).slice(0, 4).map(([n, e, t]) => [V(n, e, t), e]).sort((x, y) => x[0] - y[0]);
      if (new Set(werte.map((x) => x[0])).size !== 4 || new Set(werte.map((x) => x[1])).size !== 2) return null;
      return ordnen(Z('Ordne die Angaben nach der Größe. Beginne mit dem kleinsten Volumen.'), werte.map(([w, e]) => T(w, e)), H('M', 'Wandle alle Angaben in dieselbe Einheit um.', 'Vergleiche dann die Maßzahlen.'), { nachweis: [ORD('auf')] }); },
  ]);
  sechs(U1, 'E', [
    () => { const [g, k] = wahl(NACHBARN), n = wahl([125, 5, 40, 375, 8, 60, 905]), w = V(n, k);
      return wandle('E', w, k, g, [g, k, g.replace('³', '²'), k.replace('³', '²')], [[w * 10, 'umrechnungszahl'], [w * 100, 'umrechnungszahl'], [w * 1000, 'umrechnungsrichtung']], 'Teile durch die Umrechnungszahl. Achte auf die Nullen nach dem Komma.'); },
    () => { const [g, k] = wahl(NACHBARN), z = wahl([35, 24, 18, 75, 62]), kn = kind(), l = T(V(z, g, 10), g);
      return auswahl(Z(`${kn} wandelt um: ${l} = ${z * 10} ${k}.`, 'Kreuze die Erklärung für den Fehler an.'),
        [opt(`Die Umrechnungszahl ist 1000 und nicht 100. Richtig ist ${l} = ${z * 100} ${k}.`, true), opt(`Die Umrechnungszahl ist 10. Richtig ist ${l} = ${z} ${k}.`, false, 'umrechnungszahl'), opt(`Es wurde in die falsche Richtung gerechnet. Richtig ist ${l} = ${T(V(z, g, 10) / 1000, k)}.`, false, 'umrechnungsrichtung'), opt('Das Ergebnis stimmt, nur die Einheit ist falsch.', false)],
        H('E', 'Überlege, wie viele kleine Würfel in den nächstgrößeren Würfel passen.'), { nachweis: [`${l} = ${z * 100} ${k}`, FREI('Fehler beim Umwandeln erklären')] }); },
    () => { const werte = mische([[2500, 'mm³', 1], [3, 'cm³', 1], [4, 'dm³', 1000], [35, 'cm³', 10], [1, 'dm³', 100], [9000, 'mm³', 1], [12, 'cm³', 1], [5, 'dm³', 1000]]).slice(0, 5).map(([n, e, t]) => [V(n, e, t), e]).sort((x, y) => x[0] - y[0]);
      if (new Set(werte.map((x) => x[0])).size !== 5 || new Set(werte.map((x) => x[1])).size !== 3) return null;
      return ordnen(Z('Ordne die Angaben nach der Größe. Beginne mit dem kleinsten Volumen.'), werte.map(([w, e]) => T(w, e)), H('E', 'Wandle alle Angaben in dieselbe Einheit um, zum Beispiel in cm³.'), { nachweis: [ORD('auf')] }); },
    () => auswahl(Z('Bei Längen ist die Umrechnungszahl 10, bei Flächen 100 und bei Volumen 1000.', 'Kreuze die Begründung an.'),
      [opt('Eine Länge hat eine Richtung, eine Fläche zwei und ein Volumen drei. In jeder Richtung passt die kleinere Einheit 10-mal hinein.', true), opt('Volumen sind immer größer als Flächen, deshalb braucht man größere Zahlen.', false), opt('Die Hochzahl gibt an, wie viele Nullen dazukommen: bei cm² zwei Nullen, bei cm³ drei Nullen. Das ist nur eine Abmachung.', false), opt('Bei jeder neuen Größenart wird die Umrechnungszahl mit 100 multipliziert.', false, 'umrechnungszahl')],
      H('E', 'Vergleiche: 10, dann 10 · 10 = 100, dann 10 · 10 · 10 = 1000.'), { nachweis: [FREI('Umrechnungszahlen 10, 100, 1000 begründen'), '10 · 10 = 100', '10 · 10 · 10 = 1000'] }),
    () => { const z = wahl([25, 15, 35, 45]), w = V(z, 'dm³', 10), g = Math.floor(z / 10);
      return auswahl(Z(`Kreuze alle Angaben an, die gleich ${T(w, 'dm³')} sind.`), [opt(`${z * 100} cm³`, true), opt(`${g} dm³ 500 cm³`, true), opt(`${z * 10} cm³`, false, 'umrechnungszahl'), opt(`${N(z * 100000)} mm³`, true), opt(`${N(z * 1000)} mm³`, false, 'umrechnungszahl')],
        H('E', 'Wandle jede Angabe in Kubikzentimeter um.'), { mehrfach: true, nachweis: [`${T(w, 'dm³')} = ${z * 100} cm³`, WERT(T(w, 'dm³'))] }); },
    () => { const n = zz(2, 9), [gross, klein, f] = wahl([['dm³', 'mm', 1e6], ['m³', 'cm', 1e6], ['cm³', 'mm', 1e3], ['m³', 'dm', 1e3]]), k = `${klein}³`;
      return zahl(Z(`Ein Gefäß hat das Volumen ${n} ${gross}.`, `Bestimme, wie viele Würfel mit der Kantenlänge 1 ${klein} hineinpassen.`), n * f, [[n * f / 10, 'umrechnungszahl'], [n * f / 1000, 'umrechnungszahl'], [n * 1000 === n * f ? n * 100 : n * 1000, 'umrechnungszahl']],
        H('E', `Ein Würfel mit der Kantenlänge 1 ${klein} hat das Volumen 1 ${k}. Wandle Schritt für Schritt um.`), { nachweis: [`${n} ${gross} = ${N(n * f)} ${k}`, `${N(n * f)} ${k} : 1 ${k} = ${N(n * f)}`] }); },
  ]);

  // ================= U2: Liter und Milliliter, mehrere Stufen =================
  const wuerfelDm = quaderBild(100, 100, 100, 'dm', { titel: '1 dm³ = 1 l' }), wuerfelCm = quaderBild(10, 10, 10, 'cm', { titel: '1 cm³ = 1 ml' });
  sechs(U2, 'F', [
    () => { const n = zz(2, 9); return luecken(Z('Die Tafel hilft dir.', 'Wandle um.', `${n} l = {{a}} ml`), { a: lk(n * 1000, [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']]) }, hGross('l', 'ml'),
      { bild: tafelBild('l-ml', V(n, 'l')), nachweis: [`${n} l = ${n * 1000} ml`] }); },
    () => { const n = zz(2, 20); return luecken(Z('Der Würfel fasst genau 1 Liter.', 'Wandle um.', `${n} dm³ = {{a}} l`), { a: lk(n, [[n * 1000, 'liter-nicht-dm3'], [n * 10, 'liter-nicht-dm3']]) },
      H('F', '1 dm³ ist genau 1 Liter.', '3 dm³ = 3 l', 'Die Zahl bleibt gleich. Nur die Einheit hat einen anderen Namen.'), { bild: wuerfelDm, nachweis: [`${n} dm³ = ${n} l`] }); },
    () => { const n = zz(2, 9); return tafelAufgabe(Z(`Trage ${n} l in die Tafel ein.`, 'Lies dann in ml ab.'), 'l-ml', V(n, 'l'), [[n * 100, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']],
      H('F', 'Jede Einheit hat drei Spalten. In jede Spalte kommt eine Ziffer.', 'Für 2 l steht die 2 in der rechten Spalte von l. Bei ml stehen drei Nullen.', 'Schreibe die Ziffer bei l ganz rechts. Fülle die Spalten von ml mit Nullen.')); },
    () => { const n = zz(2, 9); return luecken(Z('Die Tafel hilft dir.', 'Wandle um.', `${n * 1000} ml = {{a}} l`), { a: lk(n, [[n * 10, 'umrechnungszahl'], [n * 100, 'umrechnungszahl']]) }, hKlein('l', 'ml'),
      { bild: tafelBild('l-ml', V(n, 'l')), nachweis: [`${n * 1000} ml = ${n} l`] }); },
    () => { const n = zz(1, 5); return auswahl(Z(`In einem Krug sind ${n} l Saft.`, 'Kreuze an, wie viele Milliliter das sind.'), [opt(`${n * 1000} ml`, true), opt(`${n * 100} ml`, false, 'umrechnungszahl'), opt(`${n * 10} ml`, false, 'umrechnungszahl')], hGross('l', 'ml'),
      { bild: tafelBild('l-ml', V(n, 'l')), nachweis: [`${n} l = ${n * 1000} ml`, WERT(`${n} l`)] }); },
    () => { const n = zz(2, 9) * wahl([10, 50, 100]); return luecken(Z('Der kleine Würfel fasst genau 1 Milliliter.', 'Wandle um.', `${n} cm³ = {{a}} ml`), { a: lk(n, [[n * 1000, 'liter-nicht-dm3'], [n * 10, 'liter-nicht-dm3']]) },
      H('F', '1 cm³ ist genau 1 Milliliter.', '20 cm³ = 20 ml', 'Die Zahl bleibt gleich. Nur die Einheit hat einen anderen Namen.'), { bild: wuerfelCm, nachweis: [`${n} cm³ = ${n} ml`] }); },
  ]);
  sechs(U2, 'G', [
    () => { const n = zz(1, 9), r = zz(1, 19) * 50; return luecken(Z('Wandle um.', `${n * 1000 + r} ml = {{a}} l {{b}} ml`), { a: lk(n), b: lk(r, [[r * 10, 'umrechnungszahl']]) },
      H('G', '1000 ml sind 1 l.', '2500 ml = 2 l 500 ml', 'Die Tausender sind die Liter. Der Rest bleibt in Millilitern stehen.'), { bild: tafelBild('l-ml', V(n * 1000 + r, 'ml')), nachweis: [`${n * 1000 + r} ml = ${n} l ${r} ml`] }); },
    () => { const n = zz(2, 9), r = zz(1, 19) * 50; return luecken(Z('Wandle um.', `${n} l ${r} ml = {{a}} ml`), { a: lk(n * 1000 + r, [[n * 100 + r, 'umrechnungszahl'], [n + r, 'masszahlen-addiert']]) }, hG('l', 'ml'),
      { bild: tafelBild('l-ml', V(n * 1000 + r, 'ml')), nachweis: [`${n} l ${r} ml = ${n * 1000 + r} ml`] }); },
    () => { const n = zz(2, 9); return luecken(Z('Wandle in zwei Schritten um.', `${n} dm³ = {{a}} l`, `${n} l = {{b}} ml`), { a: lk(n, [[n * 1000, 'liter-nicht-dm3']]), b: lk(n * 1000, [[n * 100, 'umrechnungszahl'], [n, 'liter-nicht-dm3']]) },
      H('G', '1 dm³ ist 1 Liter. 1 Liter sind 1000 Milliliter.', '2 dm³ = 2 l = 2000 ml', 'Bei dm³ und l bleibt die Zahl gleich. Rechne dann mal 1000.'), { tippBild: tafelBild('l-ml', V(n, 'l')), nachweis: [`${n} dm³ = ${n} l`, `${n} l = ${n * 1000} ml`] }); },
    () => { const n = zz(2, 9); return luecken(Z('Wandle um.', 'Denke daran: 1 dm³ ist 1 Liter.', `${n * 1000} cm³ = {{a}} l`), { a: lk(n, [[n * 1000, 'liter-nicht-dm3'], [n * 10, 'umrechnungszahl'], [n * 100, 'umrechnungszahl']]) },
      H('G', 'Wandle zuerst in dm³ um.', '3000 cm³ = 3 dm³ = 3 l', 'Teile durch die Umrechnungszahl 1000.'), { bild: tafelBild('dm³-cm³', V(n, 'dm³')), nachweis: [`${n * 1000} cm³ = ${n} dm³`, `${n} dm³ = ${n} l`] }); },
    () => { const n = zz(1, 4), m = wahl([n * 1000 - 500, n * 1000 + 500, n * 100 + 50, n * 1000 + 250]), l = `${n} l`, r = `${m} ml`;
      return auswahl(Z(`Eine Flasche fasst ${l}.`, `Eine Kanne fasst ${r}.`, 'Kreuze an, was mehr fasst.'), [opt('die Flasche', n * 1000 > m), opt('die Kanne', m > n * 1000, m > n * 1000 ? undefined : 'umrechnungszahl'), opt('Beide fassen gleich viel.', false)],
        H('G', 'Wandle die Liter in Milliliter um.', '2 l = 2000 ml', 'Vergleiche dann die beiden Zahlen.'), { nachweis: [`${n} l = ${n * 1000} ml`, VGL(l, r, { groesser: 'die Flasche', kleiner: 'die Kanne', gleich: 'Beide fassen gleich viel.' })] }); },
    () => { const glas = wahl([200, 250, 500]), n = zz(1, 4), anz = (n * 1000) / glas;
      return zahl(Z(`Ein Glas fasst ${glas} ml.`, `In einer Flasche sind ${n} l Wasser.`, 'Bestimme, wie viele Gläser voll werden.'), anz, [[(n * 100) / glas, 'umrechnungszahl'], [n * 1000, 'sach-schritt-vergessen']].filter(([w]) => Number.isInteger(w)),
        H('G', 'Wandle zuerst die Liter in Milliliter um.', '1 l = 1000 ml. Mit 250 ml je Glas: 1000 ml : 250 ml = 4 Gläser.', 'Teile die Milliliter in der Flasche durch die Milliliter in einem Glas.'), { nachweis: [`${n} l = ${n * 1000} ml`, `${n * 1000} ml : ${glas} ml = ${anz}`] }); },
  ]);
  sechs(U2, 'M', [
    () => { const n = wahl([750, 250, 500, 125, 80, 1500, 330, 45]), w = V(n, 'ml');
      return wandle('M', w, 'ml', 'l', ['l', 'ml', 'hl', 'dm²'], [[w * 10, 'umrechnungszahl'], [w * 100, 'umrechnungszahl'], [w * 1000, 'umrechnungsrichtung']], '1000 ml sind 1 l. Die Einheit wird größer, also durch 1000.', 'Verschiebe das Komma um drei Stellen nach links.'); },
    () => { const z = wahl([25, 15, 35, 75, 125, 5, 33]), t = z > 99 ? 100 : z === 33 ? 100 : 10, w = V(z, 'l', t);
      return luecken(Z('Wandle um.', `${T(w, 'l')} = {{a}} ml`), { a: lk(w / 1000, [[w / 10000, 'umrechnungszahl'], [w / 100000, 'umrechnungszahl']]) },
        H('M', 'Die Einheit wird kleiner, also mal 1000.', 'Verschiebe das Komma um drei Stellen nach rechts. Fülle leere Stellen mit Nullen.'), { nachweis: [`${T(w, 'l')} = ${T(w, 'ml')}`] }); },
    () => { const z = wahl([3, 5, 12, 25, 8]), t = wahl([1, 10]), w = V(z, 'm³', t);
      return wandle('M', w, 'm³', 'l', ['l', 'ml', 'hl', 'm³'], [[w / 10, 'umrechnungszahl'], [w / 100, 'umrechnungszahl'], [w / 1000, 'liter-nicht-dm3']], 'Wandle zuerst in dm³ um. 1 dm³ ist 1 Liter.', `${T(w, 'm³')} = ${T(w, 'dm³')}. Die Maßzahl in dm³ ist die Maßzahl in Litern.`); },
    () => { const n = zz(2, 12), um = zz(0, 1);
      return um ? luecken(Z('Wandle um.', `${n} hl = {{a}} l`), { a: lk(n * 100, [[n * 1000, 'umrechnungszahl'], [n * 10, 'umrechnungszahl']]) }, H('M', '1 Hektoliter sind 100 Liter.', 'Hier ist die Umrechnungszahl 100 und nicht 1000.'), { nachweis: [`${n} hl = ${n * 100} l`] })
        : luecken(Z('Wandle um.', `${n * 100} l = {{a}} hl`), { a: lk(n, [[n * 10, 'umrechnungszahl']]) }, H('M', '100 Liter sind 1 Hektoliter.', 'Teile durch 100.'), { nachweis: [`${n * 100} l = ${n} hl`] }); },
    () => { const z = wahl([25, 15, 4, 125, 36, 8]), t = z > 99 ? 100 : 10, w = V(z, 'dm³', t);
      return wandle('M', w, 'mm³', 'dm³', ['dm³', 'cm³', 'mm³', 'l'], [[w * 1000, 'umrechnungszahl'], [w * 10, 'umrechnungszahl'], [w * 100, 'umrechnungszahl']], 'Von mm³ nach dm³ sind es zwei Schritte: erst in cm³, dann in dm³.', `${T(w, 'mm³')} = ${T(w, 'cm³')}. Teile noch einmal durch 1000.`); },
    () => { const werte = mische([[5, 'l', 10], [450, 'ml', 1], [6, 'dm³', 10], [550, 'cm³', 1], [75, 'l', 100], [700, 'ml', 1], [4, 'dm³', 10], [650, 'cm³', 1]]).slice(0, 4).map(([n, e, t]) => [V(n, e, t), e]).sort((x, y) => x[0] - y[0]);
      if (new Set(werte.map((x) => x[0])).size !== 4 || new Set(werte.map((x) => x[1])).size < 3) return null;
      return ordnen(Z('Ordne die Angaben nach der Größe. Beginne mit dem kleinsten Volumen.'), werte.map(([w, e]) => T(w, e)), H('M', 'Wandle alle Angaben in Milliliter um. 1 cm³ ist 1 ml.', 'Vergleiche dann die Maßzahlen.'), { nachweis: [ORD('auf')] }); },
  ]);
  sechs(U2, 'E', [
    () => { const z = wahl([35, 45, 8, 125, 6, 75]), t = z > 99 ? 1000 : 100, w = V(z, 'm³', t);
      return wandle('E', w, 'm³', 'l', ['l', 'ml', 'hl', 'dm²', 'm³'], [[w / 10, 'umrechnungszahl'], [w / 100, 'umrechnungszahl'], [w / 1000, 'liter-nicht-dm3']], '1 m³ sind 1000 dm³, und 1 dm³ ist 1 Liter.'); },
    () => { const z = wahl([25, 15, 35, 45, 12]), kn = kind(), l = T(V(z, 'm³', 10), 'm³');
      return auswahl(Z(`${kn} wandelt um: ${l} = ${z * 10} l.`, 'Beurteile das Ergebnis.'), [opt(`Falsch. 1 m³ = 1000 l. Also ${l} = ${z * 100} l.`, true), opt('Stimmt.', false, 'umrechnungszahl'), opt(`Falsch. 1 m³ = 1 l. Also ${l} = ${T(V(z, 'l', 10), 'l')}.`, false, 'liter-nicht-dm3'), opt(`Falsch. 1 m³ = 10 l. Also ${l} = ${z} l.`, false, 'umrechnungszahl')],
        H('E', 'Wandle zuerst in dm³ um.'), { nachweis: [`${l} = ${z * 100} dm³`, `${z * 100} dm³ = ${z * 100} l`, URTEIL(false)] }); },
    () => { const werte = mische([[750, 'ml', 1], [8, 'l', 10], [900, 'cm³', 1], [12, 'dm³', 10], [1, 'hl', 100], [15, 'l', 10], [1250, 'ml', 1], [2, 'hl', 100], [1800, 'cm³', 1]]).slice(0, 5).map(([n, e, t]) => [V(n, e, t), e]).sort((x, y) => x[0] - y[0]);
      if (new Set(werte.map((x) => x[0])).size !== 5 || new Set(werte.map((x) => x[1])).size < 4) return null;
      return ordnen(Z('Ordne die Angaben nach der Größe. Beginne mit dem kleinsten Volumen.'), werte.map(([w, e]) => T(w, e)), H('E', 'Wandle alle Angaben in dieselbe Einheit um, zum Beispiel in Milliliter.'), { nachweis: [ORD('auf')] }); },
    () => { const hl = zz(2, 6), kanne = wahl([8, 10, 16, 20, 25]), anz = (hl * 100) / kanne; if (!Number.isInteger(anz)) return null;
      return zahl(Z(`Ein Regenfass enthält ${hl} hl Wasser. Es wird mit einer Gießkanne geleert, die ${kanne} l fasst.`, 'Bestimme, wie oft die Gießkanne gefüllt werden kann.'), anz, [[(hl * 1000) / kanne, 'umrechnungszahl'], [(hl * 10) / kanne, 'umrechnungszahl']].filter(([w]) => Number.isInteger(w)),
        H('E', '1 hl sind 100 l.'), { nachweis: [`${hl} hl = ${hl * 100} l`, `${hl * 100} l : ${kanne} l = ${anz}`] }); },
    () => { const z = wahl([15, 25, 35]), w = V(z, 'l', 10);
      return auswahl(Z(`Kreuze alle Angaben an, die gleich ${T(w, 'l')} sind.`), [opt(`${z * 100} ml`, true), opt(T(w, 'dm³'), true), opt(`${z * 10} cm³`, false, 'umrechnungszahl'), opt(`${z * 100} cm³`, true), opt(T(w * 10, 'hl'), false, 'umrechnungszahl')],
        H('E', 'Wandle jede Angabe in Milliliter um. 1 hl sind 100 l.'), { mehrfach: true, nachweis: [`${T(w, 'l')} = ${z * 100} ml`, WERT(T(w, 'l'))] }); },
    () => auswahl(Z('1 m³ sind 1000 Liter.', 'Kreuze die richtige Begründung an.'),
      [opt('1 m³ = 1000 dm³, und jeder Kubikdezimeter ist ein Liter.', true), opt('1 m = 100 cm, also passen 100 Liter in einen Kubikmeter.', false, 'umrechnungszahl'), opt('Die Vorsilbe Kubik bedeutet immer 1000 Liter.', false), opt('1 m³ = 1000 cm³, und jeder Kubikzentimeter ist ein Liter.', false, 'liter-nicht-dm3')],
      H('E', 'Ein Liter passt genau in einen Würfel mit 1 dm Kantenlänge.'), { nachweis: [FREI('Kubikmeter und Liter begründen'), '1 m³ = 1000 dm³', '1000 dm³ = 1000 l'] }),
  ]);
}
