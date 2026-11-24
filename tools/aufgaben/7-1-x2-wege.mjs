// Aufgaben zum Abstecher 7.1.X2 „Auf Zahlen gehen“ (Lernziel W1) nach ADR 0015 und ADR 0043.
// Grilling mit Nils (2026-11-24): „Wege auf der Zahlengeraden“ mit Start, Schritten und Ziel, ohne Rechenregeln.
// F ein oder zwei Schritte mit Bild, G größere Zahlen und Zehntel, M Start gesucht (Umkehraufgabe), E fehlender Schritt.
// Ein Schritt nach rechts ist Plus, ein Schritt nach links ist Minus. Typische Fehler: falsche Richtung, Vorzeichen des Ziels vergessen.

import { sechs, luecken, Z } from '../werkzeug.mjs';
import { Q, D, plus, minus, neg, durch, betrag, T, zt, dt, bt, zz, wahl, antwort, wahlAus, lkd, gerade, weg, H, urteil, markiere, WERT, kind, lauf, istGanz } from './7-1-rational.mjs';

const W1 = '7.1.X2-W1';
const ZG = (extra) => gerade(-10, 10, 1, 5, extra);
const ZEHNTEL = (extra) => gerade(-20, 20, 1, 10, { teiler: 10, ...extra });
const FEHLER = (s, k, z) => [[minus(s, k), 'richtung-vertauscht'], [neg(z), 'vorzeichen-vergessen'], [plus(betrag(s), betrag(k)), 'betraege-addiert']];

export function wege() {
  const hF = H(0, 'Nach rechts werden die Zahlen größer, nach links werden sie kleiner.', 'Start bei −3, dann 5 Schritte nach rechts: Das Ziel ist 2.', 'Lege den Finger auf den Start. Zähle die Schritte Strich für Strich.');
  sechs(W1, 'F', [
    () => { const s = -zz(2, 8), z = zz(1, 8), k = z - s;
      return antwort(Z(`Der Weg startet bei ${zt(s)}.`, `Er geht ${k} Schritte nach rechts.`, 'Bei welcher Zahl ist das Ziel?'), z, 'd', FEHLER(Q(s), Q(k), Q(z)), hF, [`${zt(s)} + ${k} = ${z}`], { bild: weg(-10, 10, s, [k]) }); },
    () => { const s = zz(1, 6), z = -zz(1, 8), k = s - z;
      return markiere(Z(`Der Weg startet bei ${s}.`, `Er geht ${k} Schritte nach links.`, 'Markiere das Ziel.'), ZG({ start: s }), z, [[-z, 'vorzeichen-vergessen'], [s + k, 'richtung-vertauscht'], [z + 1, 'strahl-einerschritte']],
        H(0, 'Nach links werden die Zahlen kleiner. Hinter der Null geht es mit Minus weiter.', 'Start bei 2, dann 5 Schritte nach links: Das Ziel ist −3.', 'Zähle vom Start aus nach links. Zähle über die Null hinweg weiter.'), [`${s} − ${k} = ${zt(z)}`]); },
    () => { const s = -zz(1, 5), a = zz(4, 9), b = zz(2, 9), z = s + a - b;
      if (s + a > 10 || z < -10 || z === s || z === 0) return null;
      return antwort(Z(`Der Weg startet bei ${zt(s)}.`, `Er geht erst ${a} Schritte nach rechts.`, `Dann geht er ${b} Schritte nach links.`, 'Bei welcher Zahl ist das Ziel?'), z, 'd', [[s - a + b, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [s + a, 'sach-schritt-vergessen']],
        H(0, 'Gehe einen Schritt nach dem anderen.', 'Start bei −2, dann 6 nach rechts: 4. Dann 5 nach links: −1.', 'Gehe erst nach rechts. Starte dort neu und gehe nach links.'), [`${zt(s)} + ${a} − ${b} = ${zt(z)}`], { bild: weg(-10, 10, s, [a, -b]) }); },
    () => { const s = zz(1, 4), k = zz(s + 1, s + 5), z = s - k;
      return antwort(Z(`Ein Aufzug startet im Stockwerk ${s}.`, `Er fährt ${k} Stockwerke nach unten.`, 'In welchem Stockwerk hält er?'), z, 'd', [[s + k, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen']],
        H(0, 'Nach unten heißt an der Zahlengeraden: nach links.', 'Start im Stockwerk 2, dann 3 Stockwerke nach unten: Stockwerk −1.', 'Zähle vom Start aus nach links. Unter der Null liegen die Stockwerke im Keller.'), [`${s} − ${k} = ${zt(z)}`], { bild: ZG({ start: s }) }); },
    () => { const s = -zz(2, 8), z = zz(1, 8), k = z - s;
      if (z === -s) return null;
      return wahlAus(Z(`Der Weg startet bei ${zt(s)} und endet bei ${z}.`, 'Plus heißt nach rechts, Minus heißt nach links.', 'Welcher Schritt passt?'), `+${k}`, [[`−${k}`, 'richtung-vertauscht'], [`+${Math.abs(z + s)}`, 'abstand-ueber-null']],
        H(0, 'Zähle die Striche vom Start bis zum Ziel. Zähle über die Null hinweg.', 'Von −3 bis 4 sind es 7 Schritte nach rechts. Der Schritt heißt +7.', 'Zähle erst vom Start bis zur Null. Zähle dann weiter bis zum Ziel.'),
        { bild: ZG({ start: s, spruenge: [{ von: s, nach: z, text: '?' }] }), nachweis: [`${z} − (${zt(s)}) = ${k}`, WERT(k)] }); },
    () => { const s = -zz(1, 4), k = zz(2, 5), z = s - k;
      return antwort(Z(`Der Weg startet bei ${zt(s)}.`, `Er geht ${k} Schritte nach links.`, 'Bei welcher Zahl ist das Ziel?'), z, 'd', [[s + k, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [k + s, 'richtung-vertauscht']],
        H(0, 'Links von der Null werden die Zahlen immer kleiner.', 'Start bei −2, dann 3 Schritte nach links: Das Ziel ist −5.', 'Zähle vom Start aus nach links. Das Ziel hat auch ein Minus.'), [`${zt(s)} − ${k} = ${zt(z)}`], { bild: weg(-10, 10, s, [-k]) }); },
  ]);

  const hG = H(1, 'Ein Schritt nach rechts macht die Zahl größer, ein Schritt nach links macht sie kleiner.', 'Start bei −20, dann 35 nach rechts: erst 20 bis zur Null, dann noch 15. Das Ziel ist 15.', 'Gehe erst bis zur Null. Gehe dann den Rest des Schrittes weiter.');
  sechs(W1, 'G', [
    () => { const s = -5 * zz(3, 9), z = 5 * zz(2, 9), k = z - s;
      return antwort(Z(`Der Weg startet bei ${zt(s)}.`, `Er geht ${k} Schritte nach rechts.`, 'Bei welcher Zahl ist das Ziel?'), z, 'd', FEHLER(Q(s), Q(k), Q(z)), hG, [`${zt(s)} + ${k} = ${z}`], { bild: gerade(-50, 50, 5, 25, { start: s }) }); },
    () => { const s = -zz(11, 40), a = zz(20, 50), b = zz(30, 60), c = zz(5, 19), z = s + a - b + c;
      if (z === 0 || s + a === 0) return null;
      return antwort(Z(`Ein Weg startet bei ${zt(s)}.`, `Er geht ${a} Schritte nach rechts und ${b} Schritte nach links.`, `Dann geht er noch ${c} Schritte nach rechts.`, 'Bei welcher Zahl ist das Ziel?'), z, 'd', [[s - a + b - c, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [s + a - b, 'sach-schritt-vergessen']],
        H(1, 'Gehe einen Schritt nach dem anderen.', 'Start bei −10, dann 30 nach rechts: 20. Dann 50 nach links: −30.', 'Schreibe nach jedem Schritt auf, wo du stehst.'), [`${zt(s)} + ${a} − ${b} + ${c} = ${zt(z)}`]); },
    () => { const s = -zz(3, 14), z = zz(1, 19), k = z - s;
      if (k > 30 || k % 10 === 0) return null;
      return markiere(Z(`Der Weg startet bei ${dt(D(s))}.`, `Er geht ${dt(D(k))} nach rechts.`, 'Markiere das Ziel.'), ZEHNTEL({ start: s }), z, [[-z, 'vorzeichen-vergessen'], [s - k, 'richtung-vertauscht'], [k, 'sach-schritt-vergessen']],
        H(1, 'Jeder kleine Strich ist ein Zehntel.', 'Start bei −0,5, dann 0,8 nach rechts: Das Ziel ist 0,3.', 'Zähle vom Start aus die Zehntel nach rechts. Zähle über die Null hinweg.'), [`${dt(D(s))} + ${dt(D(k))} = ${dt(D(z))}`]); },
    () => { const t = zz(8, 20), a = zz(5, 15), b = zz(6, 18), z = -t - a + b;
      if (z >= 0) return null;
      return antwort(Z(`Ein Taucher ist ${t} m unter der Wasseroberfläche.`, `Er taucht ${a} m tiefer.`, `Dann steigt er ${b} m nach oben.`, 'Auf welcher Höhe ist er jetzt?'), z, 'd', [[-z, 'vorzeichen-vergessen'], [-t + a - b, 'richtung-vertauscht'], [-t - a, 'sach-schritt-vergessen']],
        H(1, 'Unter Wasser sind die Höhen negativ. Tiefer heißt: Die Zahl wird kleiner.', 'Start bei −10 m, dann 5 m tiefer: −15 m. Dann 8 m nach oben: −7 m.', 'Starte bei der negativen Zahl. Rechne erst den Weg nach unten, dann den Weg nach oben.'), [`−${t} − ${a} + ${b} = ${zt(z)}`], { einheit: 'm' }); },
    () => { const s = -5 * zz(2, 6), k = 5 * zz(3, 8), z = s - k, name = kind(), stimmt = wahl([true, false]), falsch = wahl([s + k, -(z + 5 * wahl([1, 2]))]);
      if (z < -50 || falsch === z || falsch === 0) return null;
      const g = (x) => `${zt(s)} − ${k} = ${zt(x)}`, beh = stimmt ? z : falsch, andere = [s + k, -z, z + 10, z - 10].filter((x) => x !== z && x !== beh);
      return urteil(Z(`${name} startet bei ${zt(s)} und geht ${k} Schritte nach links.`, `${name} sagt: „Mein Ziel ist ${zt(beh)}.“`, 'Stimmt das?'), stimmt, g(beh), stimmt ? g(andere[0]) : g(z), [g(andere[stimmt ? 1 : 0])], 'richtung-vertauscht',
        H(1, 'Nach links werden die Zahlen kleiner. Von einer negativen Zahl aus geht es noch weiter ins Minus.', 'Start bei −10, dann 15 nach links: Das Ziel ist −25.', 'Geh den Weg selbst an der Zahlengeraden nach. Vergleiche dein Ziel.'), { bild: gerade(-50, 50, 5, 25, { start: s }) }); },
    () => { const s = -zz(5, 15), a = zz(6, 12), b = zz(8, 18), z1 = s + a, z2 = z1 - b;
      if (z2 < -20 || z1 === 0 || a % 10 === 0 || b % 10 === 0) return null;
      return luecken(Z(`Der Weg startet bei ${dt(D(s))}.`, `Erst geht er ${dt(D(a))} nach rechts.`, 'Dann ist er bei {{a}}.', `Danach geht er ${dt(D(b))} nach links.`, 'Jetzt ist er bei {{b}}.'),
        { a: lkd(D(z1), [[D(s - a), 'richtung-vertauscht'], [D(-z1), 'vorzeichen-vergessen']]), b: lkd(D(z2), [[D(z1 + b), 'richtung-vertauscht'], [D(-z2), 'vorzeichen-vergessen']]) },
        H(1, 'Schreibe nach jedem Schritt auf, wo der Weg gerade ist.', 'Start bei −1, dann 0,4 nach rechts: −0,6.', 'Zähle an der Zahlengeraden die Zehntel. Starte den zweiten Schritt beim ersten Ergebnis.'),
        { bild: ZEHNTEL({ start: s }), nachweis: [`${dt(D(s))} + ${dt(D(a))} = ${dt(D(z1))}`, `${dt(D(z1))} − ${dt(D(b))} = ${dt(D(z2))}`] }); },
  ]);

  const hM = (schritt) => H(2, 'Bei der Umkehraufgabe gehst du vom Ziel aus jeden Schritt in die andere Richtung.', schritt);
  sechs(W1, 'M', [
    () => { const s = D(-zz(105, 395), 2), k = D(zz(12, 48)), [z, g] = lauf(s, [k]);
      if (s[1] !== 100) return null;
      return antwort(`Ein Weg startet bei ${dt(s)}. Er geht ${dt(k)} nach rechts. Bei welcher Zahl ist das Ziel?`, z, 'd', FEHLER(s, k, z), H(2, 'Nach rechts wird die Zahl größer. Gehe erst bis zur Null, dann weiter.', 'Schreibe beide Zahlen mit zwei Nachkommastellen. Prüfe, ob der Schritt über die Null hinausgeht.'), [g]); },
    () => { const k = D(zz(25, 65)), z = D(-zz(11, 39)), s = plus(z, k);
      return antwort(`Ein Weg geht ${dt(k)} nach links und endet bei ${dt(z)}. Bei welcher Zahl war der Start?`, s, 'd', [[minus(z, k), 'richtung-vertauscht'], [neg(s), 'vorzeichen-vergessen']],
        hM('Gehe vom Ziel aus denselben Schritt nach rechts zurück.'), [`${dt(z)} + ${dt(k)} = ${dt(s)}`]); },
    () => { const a = zz(15, 45), b = zz(50, 90), z = -zz(20, 60), s = z + b - a;
      if (s === 0) return null;
      return antwort(`Ein Weg geht erst ${a} nach rechts und dann ${b} nach links. Er endet bei ${zt(z)}. Bei welcher Zahl war der Start?`, s, 'd', [[z - b + a, 'richtung-vertauscht'], [z + b, 'sach-schritt-vergessen'], [-s, 'vorzeichen-vergessen']],
        hM('Gehe vom Ziel aus erst den zweiten Schritt zurück, dann den ersten.'), [`${zt(z)} + ${b} − ${a} = ${zt(s)}`]); },
    () => { const N = wahl([5, 7, 9, 11]), s = Q(-zz(1, N - 1), N), k = Q(zz(1, N - 1), N), [z, g] = lauf(s, [k], 'b');
      if (istGanz(z) || s[1] !== N || k[1] !== N) return null;
      return antwort(`Ein Weg startet bei ${bt(s)}. Er geht ${bt(k)} nach rechts. Bei welcher Zahl ist das Ziel? Kürze vollständig.`, z, 'b', FEHLER(s, k, z),
        H(2, 'Zähle in gleichen Bruchteilen: erst bis zur Null, dann weiter.', 'Der Nenner bleibt. Zähle die Zähler vom Start aus nach rechts.'), [g]); },
    () => { const s = D(zz(15, 45)), k = D(zz(12, 25)), [z, g] = lauf(s, [neg(k), neg(k), neg(k)]);
      if (z[0] >= 0) return null;
      return antwort(`Ein Weg startet bei ${dt(s)}. Er geht dreimal ${dt(k)} nach links. Bei welcher Zahl ist das Ziel?`, z, 'd', [[minus(s, k), 'sach-schritt-vergessen'], [neg(z), 'vorzeichen-vergessen'], [plus(s, plus(k, plus(k, k))), 'richtung-vertauscht']],
        H(2, 'Gehe den gleichen Schritt dreimal hintereinander.', 'Rechne erst aus, wie lang die drei Schritte zusammen sind. Gehe dann vom Start aus so weit nach links.'), [g]); },
    () => { const st = D(zz(105, 245), 2), s = D(-zz(15, 35)), z = plus(s, plus(st, st));
      if (st[1] !== 100) return null;
      return antwort(`Ein Weg startet bei ${dt(s)} und endet bei ${dt(z)}. Er besteht aus zwei gleich langen Schritten nach rechts. Wie lang ist ein Schritt?`, st, 'd', [[plus(st, st), 'sach-schritt-vergessen'], [durch(minus(betrag(z), betrag(s)), 2), 'abstand-ueber-null']],
        H(2, 'Bestimme zuerst den ganzen Weg vom Start bis zum Ziel.', 'Zähle den Abstand über die Null hinweg. Halbiere ihn dann.'), [`(${dt(z)} − (${dt(s)})) : 2 = ${dt(st)}`]); },
  ]);

  sechs(W1, 'E', [
    () => { const [n1, n2] = wahl([[3, 4], [2, 5], [4, 6], [3, 8], [5, 6], [2, 3]]), s = Q(-zz(1, n1 - 1), n1), k = Q(zz(1, n2 - 1), n2), [z, g] = lauf(s, [k], 'b');
      if (z[0] === 0 || s[1] !== n1 || k[1] !== n2) return null;
      return antwort(`Ein Weg startet bei ${bt(s)}. Er geht ${bt(k)} nach rechts. Bei welcher Zahl ist das Ziel? Kürze vollständig.`, z, 'b', FEHLER(s, k, z), H(3, 'Mache die Brüche gleichnamig. Prüfe dann, ob der Schritt über die Null hinausgeht.'), [g]); },
    () => { const s = D(zz(12, 48)), z = D(-zz(105, 395), 2), st = minus(z, s);
      if (z[1] !== 100) return null;
      return antwort(`Ein Weg startet bei ${dt(s)} und endet bei ${dt(z)}. Welcher Schritt führt vom Start zum Ziel? Schreibe einen Schritt nach links mit Minus.`, st, 'd', [[neg(st), 'richtung-vertauscht'], [plus(z, s), 'abstand-ueber-null'], [neg(plus(z, s)), 'abstand-ueber-null']],
        H(3, 'Der Schritt ist so lang wie der Abstand von Start und Ziel. Die Richtung bestimmt das Vorzeichen.'), [`${dt(z)} − ${dt(s)} = ${dt(st)}`]); },
    () => { const s = -zz(1200, 4800), a = zz(1500, 3500), b = zz(6000, 9500), z = s - a + b;
      if (z <= 0) return null;
      return antwort(`Ein Weg startet bei ${zt(s)}. Er geht ${a} nach links und dann ${b} nach rechts. Bei welcher Zahl ist das Ziel?`, z, 'd', [[s + a - b, 'richtung-vertauscht'], [-z, 'vorzeichen-vergessen'], [s - a, 'sach-schritt-vergessen'], [b - a, 'sach-schritt-vergessen']],
        H(3, 'Fasse die beiden Schritte zu einem Schritt zusammen. Gehe ihn dann vom Start aus.'), [`${zt(s)} − ${a} + ${b} = ${z}`]); },
    () => { const k = D(2 * zz(13, 47) + 1), s = neg(durch(k, 2));
      return antwort(`Ein Weg geht ${dt(k)} nach rechts. Sein Ziel ist die Gegenzahl des Starts. Bei welcher Zahl ist der Start?`, s, 'd', [[neg(s), 'vorzeichen-vergessen'], [neg(k), 'sach-schritt-vergessen'], [k, 'sach-schritt-vergessen']],
        H(3, 'Start und Ziel liegen gleich weit von der Null entfernt. Die Null liegt also genau in der Mitte des Weges.'), [`−${dt(k)} : 2 = ${dt(s)}`]); },
    () => { const s = D(-zz(25, 65)), k = D(zz(115, 285), 2), z = minus(s, k), name = kind(), stimmt = wahl([true, false]), falsch = wahl([plus(s, k), neg(minus(betrag(s), k))]);
      if (k[1] !== 100) return null;
      const g = (x) => `${dt(s)} − ${dt(k)} = ${dt(x)}`, beh = stimmt ? z : falsch, andere = [plus(s, k), neg(z), minus(z, 1), plus(z, 1)].filter((x) => String(x) !== String(z) && String(x) !== String(beh));
      return urteil(`${name} startet bei ${dt(s)} und geht ${dt(k)} nach links. ${name} sagt: „Mein Ziel ist ${dt(beh)}.“ Stimmt das?`, stimmt, g(beh), stimmt ? g(andere[0]) : g(z), [g(andere[stimmt ? 1 : 0])], 'richtung-vertauscht',
        H(3, 'Von einer negativen Zahl aus führt ein Schritt nach links noch weiter von der Null weg.')); },
    () => { const s = -10 * zz(8, 30), a = 10 * zz(20, 50), c = 10 * zz(5, 15), z = -10 * zz(20, 60), x = z + c - a - s;
      if (x >= 0 || s + a === 0) return null;
      return antwort(`Ein Weg startet bei ${zt(s)}. Er geht ${a} nach rechts, dann einen unbekannten Schritt und zuletzt ${c} nach links. Das Ziel ist ${zt(z)}. Wie heißt der unbekannte Schritt? Schreibe einen Schritt nach links mit Minus.`, x, 'd',
        [[-x, 'richtung-vertauscht'], [z - c + a - s, 'richtung-vertauscht'], [z - (s + a), 'sach-schritt-vergessen']],
        H(3, 'Gehe vom Start aus den ersten Schritt. Gehe vom Ziel aus den letzten Schritt zurück. Dazwischen liegt der unbekannte Schritt.'), [`${zt(z)} + ${c} − ${a} − (${zt(s)}) = ${zt(x)}`]); },
  ]);
}
