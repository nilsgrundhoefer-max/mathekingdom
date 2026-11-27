// Aufgaben zu 6.4.1 „Dezimalschreibweise“ (Lernziele S1, S2) nach ADR 0015 und ADR 0047.
// S1: Stellenwerttafel und Zehnerbrüche. S2: Stellenwert einer Ziffer, Endnullen, Lesen und Größen mit Komma.
// Klasse 5 (5.9.3) ging bis Tausendstel. Hier: F Zehntel und Hundertstel, G Tausendstel, M Zehntausendstel, E Bündeln und Rätsel.

import { sechs, auswahl, luecken, zuordnen, bruch, dezimal, kommatafel, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { B, br, opt, zz, wahl, mische, kind, fehlerliste, vorn, fig, bild, NB, WERT, FREI, dz, T, dfe, URTEIL, tafelZeile, ziffernFuer, NAME, hundert, streifen10 } from './6-4-dezimal.mjs';
import { tafelBild } from './5-6-groessen.mjs';

const S1 = '6.4.1-S1', S2 = '6.4.1-S2';
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
const TAFEL = (spalten, z, k) => B.kommaTafel(spalten, ziffernFuer(spalten, z, k));

export function dezimalschreibweise6() {
  // ================= S1: Stellenwerttafel und Zehnerbrüche =================
  const tF = h3('Die erste Stelle nach dem Komma zählt die Zehntel, die zweite die Hundertstel.', '7⁄100 = 0,07. Das sind 0 Zehntel und 7 Hundertstel.', 'Zähle die Felder. Schreibe Hundertstel mit zwei Stellen nach dem Komma.');
  sechs(S1, 'F', [
    () => { const k = wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return auswahl(Z('Der Streifen hat 10 gleich große Teile.', 'Kreuze die Dezimalzahl zum gefärbten Teil an.'), [opt(T(k, 1), true), opt(T(k, 2), false, 'dezimal-stelle'), opt(T(10 - k, 1), false, 'bruch-teil-zu-rest')], tF,
        { bild: streifen10(k), nachweis: [NB(br(k, 10)), WERT(T(k, 1), false)] }); },
    () => { const e = zz(1, 9), z = zz(0, 9), h = zz(1, 9), t = `${e},${z}${h}`;
      const { zeile, werte } = tafelZeile([e, z, h], 'a');
      return kommatafel(Z(`Trage ${t} in die Stellenwerttafel ein.`, 'E heißt Einer, z Zehntel, h Hundertstel.'), ['E', 'z', 'h'], [zeile], werte,
        h3('Vor dem Komma stehen die Einer. Danach kommen Zehntel und Hundertstel.', 'Bei 2,05 trägst du ein: 2 Einer, 0 Zehntel, 5 Hundertstel.', 'Jede Ziffer bekommt ein eigenes Feld. Auch die 0 wird eingetragen.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: t }] }); },
    () => { const k = wahl([zz(2, 9), zz(11, 99), zz(11, 99)]);
      if (k % 10 === 0) return null;
      return luecken(Z('Das Hunderterfeld hat 100 Felder.', 'Schreibe den gefärbten Teil als Dezimalzahl.', `${br(k, 100)} = {{a}}`), { a: [T(k, 2), dfe(T(k, 2), [[T(k, 1), 'dezimal-stelle'], [`${k},1`, 'bruch-als-komma'], [k, 'dezimal-stelle']])] }, tF,
        { bild: hundert(k), nachweis: [`${br(k, 100)} = ${T(k, 2)}`] }); },
    () => { const e = zz(0, 9), z = zz(0, 9), h = zz(1, 9), t = `${e},${z}${h}`;
      if (e === h) return null;
      return dezimal(Z('Lies die Zahl in der Stellenwerttafel ab.', 'Schreibe sie als Dezimalzahl.'), t, dfe(t, [[`${e},${h}${z}`, 'dezimal-stelle'], [`${e},${h}`, 'null-platzhalter'], [e * 100 + z * 10 + h, 'dezimal-stelle']]),
        h3('Das Komma steht nach den Einern.', 'Stehen dort 2 Einer, 0 Zehntel und 5 Hundertstel, heißt die Zahl 2,05.', 'Schreibe die Einer, dann das Komma, dann Zehntel und Hundertstel.'), { bild: B.kommaTafel(['E', 'z', 'h'], [e, z, h]), nachweis: [{ art: 'tafelbild', zahl: t }] }); },
    () => { const k = wahl([zz(11, 99), zz(1, 9) * 10 + zz(1, 9)]), t = T(k, 2);
      if (k % 10 === 0) return null;
      return bruch(Z(`Im Hunderterfeld sind ${t} gefärbt.`, `Schreibe ${t} als Bruch mit dem Nenner 100.`), br(k, 100), [[br(k, 10), 'dezimal-stelle'], [br(100, k), 'bruch-vertauscht'], [br(100 - k, 100), 'bruch-teil-zu-rest']],
        h3('Hundertstel haben den Nenner 100.', '0,35 sind 35 Hundertstel. Als Bruch: 35⁄100.', 'Die zwei Ziffern nach dem Komma sind der Zähler.'), { genau: true, bild: hundert(k), nachweis: [`${t} = ${br(k, 100)}`] }); },
    () => { const [a, c] = mische([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2), d = zz(11, 99);
      if (d % 10 === 0) return null;
      return zuordnen(Z('Ordne jedem Bruch die passende Dezimalzahl zu.', 'Die Tabelle hilft dir.'), mische([[br(a, 10), T(a, 1)], [br(c, 100), T(c, 2)], [br(d, 100), T(d, 2)]]),
        h3('Der Nenner sagt, wie viele Stellen nach dem Komma stehen.', '3⁄10 = 0,3 und 3⁄100 = 0,03.', 'Nenner 10: eine Stelle. Nenner 100: zwei Stellen.'), { daten: { kopf: ['Bruch', 'Dezimalzahl'], zeilen: [[br(1, 10), '0,1'], [br(1, 100), '0,01']] }, nachweis: [{ art: 'paare' }] }); },
  ]);
  const tG = h3('Die dritte Stelle nach dem Komma zählt die Tausendstel.', '47⁄1000 = 0,047. Das sind 0 Zehntel, 4 Hundertstel und 7 Tausendstel.', 'Tausendstel brauchen drei Stellen nach dem Komma. Fülle leere Stellen mit 0 auf.');
  sechs(S1, 'G', [
    () => { const sp = ['E', 'z', 'h', 't'], n1 = zz(1, 9) * 1000 + zz(0, 9) * 100 + zz(1, 9), n2 = zz(1, 9) * 10 + zz(1, 9), a = tafelZeile(ziffernFuer(sp, n1, 3), 'a'), b = tafelZeile(ziffernFuer(sp, n2, 3), 'b');
      return kommatafel(Z('Trage die beiden Zahlen in die Stellenwerttafel ein.', `Oben steht ${T(n1, 3)}.`, `Unten steht ${T(n2, 3)}.`), sp, [a.zeile, b.zeile], { ...a.werte, ...b.werte },
        h3('Die Spalte t zählt die Tausendstel.', 'Bei 0,047 trägst du ein: 0 Einer, 0 Zehntel, 4 Hundertstel, 7 Tausendstel.', 'Beginne bei den Einern. Trage auch jede 0 ein.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: T(n1, 3) }, { art: 'tafel', zeile: 1, zahl: T(n2, 3) }] }); },
    () => { const k = wahl([zz(2, 9), zz(11, 99), zz(101, 999)]);
      if (k % 10 === 0) return null;
      return luecken(Z('Schreibe als Dezimalzahl.', `${br(k, 1000)} = {{a}}`), { a: [T(k, 3), dfe(T(k, 3), [[T(k, 2), 'dezimal-stelle'], [T(k, 1), 'dezimal-stelle'], [`0,${k}`, 'null-platzhalter']])] }, tG, { nachweis: [`${br(k, 1000)} = ${T(k, 3)}`] }); },
    () => { const e = zz(1, 9), h = zz(1, 9), t = zz(1, 9), lsg = `${e},0${h}${t}`;
      return dezimal(Z(`Schreibe als Dezimalzahl: ${e} Einer, ${h} Hundertstel und ${t} Tausendstel.`), lsg, dfe(lsg, [[`${e},${h}${t}`, 'null-platzhalter'], [`${e},${h}0${t}`, 'dezimal-stelle']]),
        h3('Stell dir die Stellenwerttafel vor. Die Zehntel werden nicht genannt.', '2 Einer und 5 Hundertstel sind 2,05. Bei den Zehnteln steht 0.', 'Schreibe für jede Stelle eine Ziffer. Wo nichts genannt ist, steht 0.'), { nachweis: [`${e} Einer + ${h} Hundertstel + ${t} Tausendstel = ${lsg}`] }); },
    () => { const sp = ['E', 'z', 'h', 't'], n = zz(1, 9) * 1000 + zz(0, 9) * 100 + zz(0, 9) * 10 + zz(1, 9), t = T(n, 3), zi = ziffernFuer(sp, n, 3);
      return dezimal(Z('Lies die Zahl in der Stellenwerttafel ab.', 'Schreibe sie als Dezimalzahl.'), t, dfe(t, [[`${zi[0]},${zi.slice(1).join('').replace(/^0+/, '')}`, 'null-platzhalter'], [String(n), 'dezimal-stelle']]),
        h3('Lies die Ziffern von links nach rechts. Das Komma steht nach den Einern.', '2 Einer, 0 Zehntel, 4 Hundertstel und 7 Tausendstel sind 2,047.', 'Schreibe jede Ziffer der Tafel ab, auch die 0.'), { bild: B.kommaTafel(sp, zi), nachweis: [{ art: 'tafelbild', zahl: t }] }); },
    () => { const sp = ['E', 'z', 'h', 't'], k = wahl([zz(11, 99), zz(101, 999)]), zi = ziffernFuer(sp, k, 3);
      if (k % 10 === 0) return null;
      return bruch(Z('Schreibe die Zahl aus der Stellenwerttafel als Bruch.', 'Nimm den Nenner 1000.'), br(k, 1000), [[br(k, 100), 'dezimal-stelle'], [br(1000, k), 'bruch-vertauscht']],
        h3('Tausendstel haben den Nenner 1000.', '0,047 sind 47 Tausendstel. Als Bruch: 47⁄1000.', 'Lies die Ziffern nach dem Komma als Zahl. Führende Nullen fallen weg.'), { genau: true, bild: B.kommaTafel(sp, zi), nachweis: [`${T(k, 3)} = ${br(k, 1000)}`] }); },
    () => { const k = zz(2, 9), n = wahl([100, 1000]), stimmt = wahl([true, false, false]), kn = kind(), falsch = dz(k, n / 10), g = (x) => `${br(k, n)} = ${x}`;
      return auswahl(Z(`${kn} schreibt: ${g(stimmt ? dz(k, n) : falsch)}`, 'Beurteile die Aussage.'), richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${g(stimmt ? falsch : dz(k, n))}.`, !stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${g(dz(k, n === 1000 ? 10 : n * 10))}.`, false, 'dezimal-stelle')]),
        h3('Der Nenner sagt, an welcher Stelle die letzte Ziffer steht.', '7⁄100: Die 7 steht bei den Hundertsteln. Also 0,07.', 'Zähle die Nullen im Nenner. So viele Stellen stehen nach dem Komma.'), { nachweis: [URTEIL(stimmt, g(stimmt ? dz(k, n) : falsch))] }); },
  ]);
  const tM = h2('Nach den Tausendsteln kommen die Zehntausendstel. Sie stehen an der vierten Stelle nach dem Komma.', 'Zähle die Nullen im Nenner: So viele Stellen hat die Zahl nach dem Komma. Fülle vorne mit 0 auf.');
  sechs(S1, 'M', [
    () => { const k = wahl([zz(2, 9), zz(11, 99), zz(101, 999), zz(1001, 9999)]);
      if (k % 10 === 0) return null;
      return luecken(Z('Schreibe als Dezimalzahl.', `${br(k, 10000)} = {{a}}`), { a: [T(k, 4), dfe(T(k, 4), [[T(k, 3), 'dezimal-stelle'], [`0,${k}`, 'null-platzhalter'], [T(k, 2), 'dezimal-stelle']])] }, tM, { nachweis: [`${br(k, 10000)} = ${T(k, 4)}`] }); },
    () => { const z = zz(1, 9), a = zz(1, 9), c = zz(1, 9), lsg = `${z}0,${a}0${c}`;
      return dezimal(`Schreibe als Dezimalzahl: ${z} Zehner, ${a} Zehntel und ${c} Tausendstel.`, lsg, dfe(lsg, [[`${z},${a}${c}`, 'null-platzhalter'], [`${z}0,${a}${c}`, 'null-platzhalter'], [`${z},${a}0${c}`, 'stellenwert']]), tM, { nachweis: [`${z} Zehner + ${a} Zehntel + ${c} Tausendstel = ${lsg}`] }); },
    () => { const g = zz(1, 9), k = wahl([zz(11, 99), zz(101, 999)]), t = `${g},${String(k).padStart(3, '0')}`;
      if (k % 10 === 0) return null;
      return bruch(`Schreibe ${t} als gemischte Zahl mit dem Nenner 1000.`, br(k, 1000, g), [[br(k, 100, g), 'dezimal-stelle'], [br(g * 1000 + k, 10000), 'dezimal-stelle']],
        h2('Vor dem Komma stehen die Ganzen. Die drei Stellen nach dem Komma sind Tausendstel.', `Die Ganzen sind ${g}. Die Ziffern nach dem Komma ergeben den Zähler über 1000.`), { genau: true, nachweis: [`${t} = ${br(k, 1000, g)}`] }); },
    () => { const sp = ['Z', 'E', 'z', 'h', 't'], n = zz(1, 9) * 10000 + zz(0, 9) * 1000 + zz(0, 9) * 10 + zz(1, 9), r = tafelZeile(ziffernFuer(sp, n, 3), 'a');
      return kommatafel(`Trage ${T(n, 3)} in die Stellenwerttafel ein.`, sp, [r.zeile], r.werte, h2('Suche zuerst das Komma. Links davon stehen Einer und Zehner.', 'Trage jede Ziffer in ihre Spalte ein. Steht an einer Stelle nichts, trägst du 0 ein.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: T(n, 3) }] }); },
    () => { const a = zz(1, 9), c = zz(11, 99), d = zz(101, 999), e = zz(1001, 9999), w = () => wahl([true, false]);
      if (c % 10 === 0 || d % 10 === 0 || e % 10 === 0) return null;
      const liste = [w() ? [`${br(a, 10)} = ${T(a, 1)}`, true] : [`${br(a, 10)} = ${T(a, 2)}`, false], w() ? [`${br(c, 1000)} = ${T(c, 3)}`, true] : [`${br(c, 1000)} = ${T(c, 2)}`, false],
        w() ? [`${br(d, 10000)} = ${T(d, 4)}`, true] : [`${br(d, 10000)} = ${T(d, 3)}`, false], w() ? [`${br(e, 10000)} = ${T(e, 4)}`, true] : [`${br(e, 10000)} = ${T(e, 3)}`, false]];
      if (liste.filter(([, r]) => r).length < 1 || liste.every(([, r]) => r)) return null;
      return auswahl('Kreuze alle Gleichungen an, die stimmen.', liste.map(([t, r]) => opt(t, r, r ? undefined : 'dezimal-stelle')), h2('Prüfe jede Gleichung: Wie viele Nullen hat der Nenner?', 'So viele Stellen muss die Dezimalzahl nach dem Komma haben. Die letzte Ziffer des Zählers steht an der letzten Stelle.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
    () => { const z = zz(2, 4), t = zz(1, 9), zt = zz(1, 9), lsg = `${2 * z},${z}0${t}${zt}`;
      return dezimal(Z('Finde die Dezimalzahl mit vier Stellen nach dem Komma.', `Sie hat ${z} Zehntel, ${t} Tausendstel und ${zt} Zehntausendstel, aber keine Hundertstel.`, 'Die Ziffer der Einer ist doppelt so groß wie die Ziffer der Zehntel.', 'Gib die Zahl an.'), lsg, dfe(lsg, [[`${2 * z},${z}${t}${zt}`, 'null-platzhalter'], [`${z},${2 * z}0${t}${zt}`, 'stellenwert']]),
        h2('Zeichne eine Stellenwerttafel mit den Spalten E, z, h, t und zt. Trage ein, was du weißt.', 'Die Hundertstel fehlen: Dort steht 0. Die Einer bekommst du aus den Zehnteln.'), { nachweis: [`${z} · 2 = ${2 * z}`, `${2 * z} Einer + ${z} Zehntel + ${t} Tausendstel + ${zt} Zehntausendstel = ${lsg}`] }); },
  ]);
  sechs(S1, 'E', [
    () => { const sp = ['H', 'Z', 'E', 'z', 'h', 't'], n = zz(1, 9) * 100000 + zz(0, 9) * 1000 + zz(1, 9) * 10 + zz(1, 9), r = tafelZeile(ziffernFuer(sp, n, 3), 'a');
      return kommatafel(`Trage ${T(n, 3)} in die Stellenwerttafel ein.`, sp, [r.zeile], r.werte, h1('Beginne beim Komma und arbeite nach links und nach rechts. Jede Stelle bekommt eine Ziffer, auch die 0.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: T(n, 3) }] }); },
    () => { const h = zz(11, 99), t = zz(1, 9), lsg = T(h * 10 + t, 3);
      if (h % 10 === 0) return null;
      return dezimal(`Schreibe als Dezimalzahl: ${h} Hundertstel und ${t} Tausendstel.`, lsg, dfe(lsg, [[`${h},${t}`, 'stellenwert'], [`0,${h}0${t}`, 'null-platzhalter'], [T(h + t, 2), 'stellenwert']]), h1('Bündle: 10 Hundertstel sind ein Zehntel. Wie viele Zehntel stecken in den Hundertsteln?'), { nachweis: [`${h} Hundertstel + ${t} Tausendstel = ${lsg}`] }); },
    () => { const g = zz(1, 9), k = wahl([zz(101, 999), zz(1001, 9999)]), t = `${g},${String(k).padStart(4, '0')}`;
      if (k % 10 === 0) return null;
      return bruch(`Schreibe ${t} als gemischte Zahl mit dem Nenner 10000.`, br(k, 10000, g), [[br(k, 1000, g), 'dezimal-stelle'], [br(g * 10000 + k, 10000), 'gemischt-umwandeln']], h1('Die vier Stellen nach dem Komma sind Zehntausendstel. Führende Nullen gehören nicht in den Zähler.'), { genau: true, nachweis: [`${t} = ${br(k, 10000, g)}`] }); },
    () => { const a = zz(2, 9), c = zz(11, 99), d = zz(101, 999), e = zz(2, 9), f = zz(1, 9), falsch = zz(0, 4);
      if (c % 10 === 0 || d % 10 === 0) return null;
      const liste = [[`${br(a, 10)} = ${T(a, 1)}`, `${br(a, 10)} = ${T(a, 2)}`], [`${br(c, 1000)} = ${T(c, 3)}`, `${br(c, 1000)} = ${T(c, 2)}`], [`${br(d, 10000)} = ${T(d, 4)}`, `${br(d, 10000)} = ${T(d, 3)}`], [`${br(e, 100)} = ${T(e * 10, 3)}`, `${br(e, 100)} = ${T(e, 1)}`], [`${f},50 = ${br(50, 100, f)}`, `${f},5 = ${br(5, 100, f)}`]];
      return auswahl('Vier Gleichungen stimmen, eine ist falsch. Kreuze die falsche Gleichung an.', liste.map(([r, x], i) => opt(i === falsch ? x : r, i === falsch)), h1('Prüfe bei jeder Gleichung, ob die letzte Ziffer des Zählers an der Stelle steht, die der Nenner nennt.'), { nachweis: [{ art: 'aussagen', falsche: true }] }); },
    () => { const e = zz(1, 9), k = zz(1001, 9999), lsg = T(e * 10000 + k, 4);
      if (k % 10 === 0) return null;
      return dezimal(`Schreibe als Dezimalzahl: ${e} Einer und ${k} Zehntausendstel.`, lsg, dfe(lsg, [[`${e},0${k}`, 'stellenwert'], [`${e}${k}`, 'dezimal-stelle']]), h1('1000 Zehntausendstel sind ein Zehntel. Schreibe die Zehntausendstel mit vier Stellen nach dem Komma.'), { nachweis: [`${e} Einer + ${k} Zehntausendstel = ${lsg}`] }); },
    () => { const h = zz(1, 4), t = zz(5, 9), lsg = `0,${h}${h + t > 9 ? 0 : h + t}${t}`;
      if (h + t > 9) return null;
      return dezimal(Z('Finde die Dezimalzahl mit drei Stellen nach dem Komma und ohne Einer.', `Die Zehntel und die Hundertstel haben dieselbe Ziffer ${h}.`.replace(/dieselbe Ziffer \d/, 'verschiedene Ziffern'), `Die Zehntel sind ${h}, die Tausendstel sind ${t}.`, 'Die Ziffer der Hundertstel ist die Summe aus Zehnteln und Tausendsteln.', 'Gib die Zahl an.'), lsg, dfe(lsg, [[`0,${h}${t}${h + t}`, 'stellenwert'], [`0,${t}${h + t}${h}`, 'stellenwert']]),
        h1('Zeichne eine Stellenwerttafel mit den Spalten E, z, h und t. Trage die Ziffern Schritt für Schritt ein.'), { nachweis: [`${h} + ${t} = ${h + t}`, `${h} Zehntel + ${h + t} Hundertstel + ${t} Tausendstel = ${lsg}`] }); },
  ]);

  // ================= S2: Stellenwert, Endnullen, Lesen, Größen mit Komma =================
  const tS2F = h3('Nach dem Komma kommen zuerst die Zehntel, dann die Hundertstel.', 'In 3,47 steht 4 bei den Zehnteln und 7 bei den Hundertsteln.', 'Zeige mit dem Finger auf das Komma. Gehe dann eine Stelle nach rechts.');
  sechs(S2, 'F', [
    () => { const e = zz(1, 9), [z, h] = mische([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== e)).slice(0, 2), [name, sp, ziffer] = wahl([['Zehnteln', 'z', z], ['Hundertsteln', 'h', h]]);
      return dezimal(Z(`Schau auf die Zahl ${e},${z}${h} in der Tafel.`, `Gib die Ziffer bei den ${name} an.`), ziffer, fehlerliste(ziffer, [[sp === 'z' ? h : z, 'dezimal-stelle'], [e, 'stellenwert']]), tS2F,
        { bild: B.kommaTafel(['E', 'z', 'h'], [e, z, h]), nachweis: [{ art: 'stelle', zahl: `${e},${z}${h}`, stelle: sp, ziffer }] }); },
    () => { const k = zz(1, 9), stimmt = wahl([true, false]), kn = kind(), a = `0,${k}`, c = stimmt ? `0,${k}0` : `0,0${k}`;
      return auswahl(Z(`${kn} sagt: „${a} und ${c} sind gleich viel.“`, 'Beurteile die Aussage.', 'Die Stellenwerttafel hilft dir.'), richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${a} > ${c}.`, !stimmt, 'dezimal-endnull'), opt(`Falsch. Es gilt ${a} < ${c}.`, false, 'dezimal-mehr-ziffern')]),
        h3('Trage beide Zahlen in die Tafel ein. Vergleiche Stelle für Stelle.', '0,2 und 0,20 haben beide 2 Zehntel. Es gilt 0,2 = 0,20.', 'Eine Null ganz hinten ändert nichts. Eine Null direkt nach dem Komma schon.'),
        { bild: B.kommaTafel(['E', 'z', 'h'], [0, k, null], [stimmt ? [0, k, 0] : [0, 0, k]]), nachweis: [URTEIL(stimmt, `${a} = ${c}`)] }); },
    () => { const eu = zz(1, 9), ct = wahl([5, 10, 25, 40, 50, 75, 80, 95]), lsg = `${eu},${String(ct).padStart(2, '0')}`;
      return luecken(Z('Schreibe den Betrag mit Komma.', `${eu} € ${ct} ct = {{a}} €`), { a: [lsg, dfe(lsg, [[`${eu},${ct % 10 === 0 ? ct / 10 : ct}`.replace(/,(\d)$/, ct < 10 ? ',$1' : ',$1'), ct < 10 ? 'null-platzhalter' : 'dezimal-stelle'], [`${eu}${ct}`, 'dezimal-stelle']].filter(([w]) => w !== lsg && !(ct % 10 === 0 && w === `${eu},${ct / 10}`)))] },
        h3('1 € sind 100 ct. Nach dem Komma stehen zwei Stellen für die Cent.', '2 € 5 ct = 2,05 €. Aber 2 € 50 ct = 2,50 €.', 'Schreibe die Euro, dann das Komma, dann die Cent mit zwei Ziffern.'), { bild: tafelBild('€-ct', eu * 100 + ct), nachweis: [`${eu} € ${ct} ct = ${lsg} €`] }); },
    () => { const m = zz(1, 9), cm = wahl([zz(11, 99), zz(1, 9)]), lsg = `${m},${String(cm).padStart(2, '0')}`;
      if (cm % 10 === 0) return null;
      return luecken(Z('Schreibe die Länge mit Komma.', `${m} m ${cm} cm = {{a}} m`), { a: [lsg, dfe(lsg, [[cm < 10 ? `${m},${cm}` : null, 'null-platzhalter'], [`${m}${cm}`, 'dezimal-stelle']])] },
        h3('1 m sind 100 cm. Nach dem Komma stehen zwei Stellen für die Zentimeter.', '1 m 5 cm = 1,05 m. Aber 1 m 50 cm = 1,50 m.', 'Schreibe die Meter, das Komma und die Zentimeter mit zwei Ziffern.'), { bild: tafelBild('m-cm', (m * 100 + cm) * 10), nachweis: [`${m} m ${cm} cm = ${lsg} m`] }); },
    () => { const e = zz(1, 9), z = zz(1, 9), h = zz(1, 9), t = `${e},${z}${h}`, sp = wahl([['Zehntel', 'z', z, `${z} Zehntel`], ['Hundertstel', 'h', h, `${h} Hundertstel`]]);
      if (new Set([e, z, h]).size < 3) return null;
      return auswahl(Z(`Die Zahl ist ${t}.`, `Kreuze an, wie viel die Ziffer ${sp[2]} wert ist.`), [opt(sp[3], true), opt(`${sp[2]} Einer`, false, 'stellenwert'), opt(sp[1] === 'z' ? `${sp[2]} Hundertstel` : `${sp[2]} Zehntel`, false, 'dezimal-stelle')], tS2F,
        { bild: B.kommaTafel(['E', 'z', 'h'], [e, z, h]), nachweis: [{ art: 'stelle', zahl: t, stelle: sp[1], ziffer: sp[2] }, { art: 'wert', wert: sp[3] }] }); },
    () => { const k = zz(1, 9), z = zz(1, 9);
      return zuordnen(Z('Ordne jeder Zahl die gleich große Zahl zu.'), mische([[`0,${k}`, `0,${k}0`], [`0,0${z}`, `${z} Hundertstel`], [`${z},${k}`, `${z},${k}0`]].filter((p, i, l) => l.findIndex((q) => q[0] === p[0]) === i)),
        h3('Eine Null ganz hinten ändert die Zahl nicht.', '0,3 = 0,30. Beides sind 3 Zehntel.', 'Trage die Zahlen in Gedanken in die Tafel ein und vergleiche.'), { daten: { kopf: ['Zahl', 'gleich viel'], zeilen: [['0,1', '0,10'], ['0,01', '1 Hundertstel']] }, nachweis: [{ art: 'paare' }] }); },
  ]);
  const tS2G = h3('Jede Stelle ist zehnmal so viel wert wie die Stelle rechts von ihr.', 'In 4,326 ist die 2 zwei Hundertstel wert, die 6 sechs Tausendstel.', 'Zähle vom Komma aus: Zehntel, Hundertstel, Tausendstel.');
  sechs(S2, 'G', [
    () => { const e = zz(1, 9), [z, h, t] = mische([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== e)).slice(0, 3), [name, sp, ziffer] = wahl([['Hundertsteln', 'h', h], ['Tausendsteln', 't', t], ['Zehnteln', 'z', z]]), zahl = `${e},${z}${h}${t}`;
      return dezimal(Z(`Schau auf die Zahl ${zahl}.`, `Gib die Ziffer bei den ${name} an.`), ziffer, fehlerliste(ziffer, [[sp === 't' ? h : t, 'dezimal-stelle'], [sp === 'z' ? h : z, 'dezimal-stelle']]), tS2G, { nachweis: [{ art: 'stelle', zahl, stelle: sp, ziffer }] }); },
    () => { const e = zz(1, 9), z = zz(1, 9), h = zz(1, 9), stimmt = wahl([true, false]), kn = kind(), a = `${e},${z}${h}`, c = stimmt ? `${e},${z}${h}0` : `${e},${z}0${h}`;
      return auswahl(Z(`${kn} sagt: „${a} und ${c} sind gleich viel.“`, 'Beurteile die Aussage.'), richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-endnull'), opt(`Falsch. Es gilt ${a} > ${c}.`, !stimmt, 'dezimal-endnull'), opt(`Falsch. Es gilt ${a} < ${c}.`, false, 'dezimal-mehr-ziffern')]),
        h3('Eine Endnull ändert den Wert nicht. Eine Null mitten in der Zahl schon.', '2,35 = 2,350. Aber 2,305 ist weniger als 2,35.', 'Schreibe beide Zahlen untereinander, Komma unter Komma.'), { bild: B.kommaTafel(['E', 'z', 'h', 't'], [e, z, h, null], [stimmt ? [e, z, h, 0] : [e, z, 0, h]]), nachweis: [URTEIL(stimmt, `${a} = ${c}`)] }); },
    () => { const e = zz(1, 9), z = zz(0, 9), h = zz(1, 9), WORT = ['null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun'], t = `${e},${z}${h}`;
      return auswahl(Z(`Kreuze an, wie man ${t} richtig liest.`), [opt(`${WORT[e]} Komma ${WORT[z]} ${WORT[h]}`, true), opt(`${WORT[e]} Komma ${z * 10 + h}`, false, 'dezimal-wie-natuerlich'), opt(`${WORT[e]} Komma ${WORT[h]} ${WORT[z]}`, false, 'dezimal-stelle')],
        h3('Nach dem Komma liest man jede Ziffer einzeln.', '3,25 liest man „drei Komma zwei fünf“.', 'Sprich zuerst die Zahl vor dem Komma. Nenne dann jede Ziffer nach dem Komma einzeln.'), { bild: B.kommaTafel(['E', 'z', 'h'], [e, z, h]), nachweis: [FREI('Dezimalzahl Ziffer für Ziffer lesen')] }); },
    () => { const kg = zz(1, 9), g = wahl([zz(1, 9) * 100 + zz(1, 9) * 10 + 5, zz(1, 9) * 10 + 5, zz(1, 9) * 100 + 5]), lsg = T(kg * 1000 + g, 3);
      return luecken(Z('Schreibe das Gewicht mit Komma.', `${kg} kg ${g} g = {{a}} kg`), { a: [lsg, dfe(lsg, [[`${kg},${g}`, 'null-platzhalter'], [T(kg * 100 + g, 2), 'dezimal-stelle']])] },
        h3('1 kg sind 1000 g. Nach dem Komma stehen drei Stellen für die Gramm.', '2 kg 50 g = 2,050 kg = 2,05 kg.', 'Schreibe die Gramm mit drei Ziffern. Fülle vorne mit 0 auf.'), { bild: tafelBild('kg-g', (kg * 1000 + g) * 1000), nachweis: [`${kg} kg ${g} g = ${lsg} kg`] }); },
    () => { const k = zz(11, 99), h = zz(1, 9), stellen = wahl([2, 3]), wert = stellen === 2 ? k * 10 : k * 10 + h, t = T(wert, 3);
      if (k % 10 === 0) return null;
      return dezimal(Z(`Die Zahl ist ${t}.`, 'Gib an, wie viele Tausendstel das sind.'), wert, fehlerliste(wert, [[k, 'dezimal-endnull'], [Math.floor(wert / 10), 'stellenwert']]),
        h3('Ein Hundertstel sind 10 Tausendstel.', '0,25 = 0,250. Das sind 250 Tausendstel.', 'Fülle mit Endnullen auf drei Stellen auf. Lies dann die Ziffern nach dem Komma als Zahl.'), { einheit: 'Tausendstel', nachweis: [`${t} = ${wert} Tausendstel`] }); },
    () => { const a = zz(1, 9), c = zz(1, 9), kn = kind();
      if (a === c) return null;
      return auswahl(Z(`${kn} sagt: „Eine 0 am Ende macht die Zahl zehnmal so groß.“`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${a},${c} = ${a},${c}0.`, true), opt('Stimmt. Wie bei den natürlichen Zahlen.', false, 'dezimal-endnull'), opt(`Falsch. Es gilt ${a},${c} > ${a},${c}0.`, false, 'dezimal-mehr-ziffern')],
        h3('Bei natürlichen Zahlen stimmt das: Aus 35 wird 350.', 'Bei Dezimalzahlen nicht: 3,5 = 3,50. Es sind beide Male 3 Einer und 5 Zehntel.', 'Trage beide Zahlen in die Tafel ein. Jede Ziffer bleibt an ihrer Stelle.'), { nachweis: [URTEIL(false, `${a},${c} < ${a},${c}0`)] }); },
  ]);
  const tS2M = h2('Gleiche Einheiten nebeneinander: 1 m = 100 cm, 1 kg = 1000 g, 1 km = 1000 m. Die Umrechnungszahl sagt, wie viele Stellen nach dem Komma zur kleineren Einheit gehören.', 'Schreibe die kleinere Einheit mit so vielen Ziffern, wie die Umrechnungszahl Nullen hat. Fülle vorne mit 0 auf.');
  sechs(S2, 'M', [
    () => { const e = zz(1, 9), ds = mische([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== e)).slice(0, 4), [name, i] = wahl([['Zehntausendsteln', 3], ['Tausendsteln', 2], ['Hundertsteln', 1]]), zahl = `${e},${ds.join('')}`;
      return dezimal(`Gib die Ziffer an, die in ${zahl} bei den ${name} steht.`, ds[i], fehlerliste(ds[i], [[ds[i === 3 ? 2 : i + 1], 'dezimal-stelle'], [ds[i - 1], 'dezimal-stelle']]), tS2M,
        { nachweis: [{ art: 'stelle', zahl, stelle: ['z', 'h', 't', 'zt'][i], ziffer: ds[i] }] }); },
    () => { const km = zz(1, 9), m = wahl([zz(1, 9), zz(11, 99), zz(101, 999)]), lsg = T(km * 1000 + m, 3);
      if (m % 10 === 0) return null;
      return luecken(`Schreibe mit Komma: ${km} km ${m} m = {{a}} km`, { a: [lsg, dfe(lsg, [[`${km},${m}`, 'null-platzhalter'], [T(km * 100 + m, 2), 'dezimal-stelle']])] }, tS2M, { nachweis: [`${km} km ${m} m = ${lsg} km`] }); },
    () => { const t = zz(1, 9), kg = wahl([zz(1, 9) * 100 + 5, zz(11, 99), zz(1, 9) * 10]), lsg = T(t * 1000 + kg, 3);
      return luecken(`Schreibe mit Komma: ${t} t ${kg} kg = {{a}} t`, { a: [lsg, dfe(lsg, [[`${t},${kg}`, 'null-platzhalter'], [T(t * 100 + kg, 2), 'dezimal-stelle']])] }, tS2M, { nachweis: [`${t} t ${kg} kg = ${lsg} t`] }); },
    () => { const z = zz(1, 9), k = zz(1, 9), m = zz(1, 9);
      if (z === k || k === m || z === m) return null;
      return zuordnen('Ordne jeder Größe die gleich große Größe zu.', mische([[`${z},${k}0 m`, `${z} m ${k * 10} cm`], [`${z},0${k} m`, `${z} m ${k} cm`], [`${m},${k} kg`, `${m} kg ${k * 100} g`], [`${m},0${k} kg`, `${m} kg ${k * 10} g`]]), tS2M, { nachweis: [{ art: 'paare' }] }); },
    () => { const [g, kl, f, s] = wahl([['m', 'cm', 100, 2], ['kg', 'g', 1000, 3], ['km', 'm', 1000, 3]]), a = zz(1, 9), b = wahl([zz(1, 9), zz(11, f / 10 - 1)]), lsg = T(a * f + b, s), kn = kind(), falsch = `${a},${b}`;
      if (b % 10 === 0 || falsch === lsg) return null;
      return auswahl(Z(`${kn} schreibt: ${a} ${g} ${b} ${kl} = ${falsch} ${g}`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${a} ${g} ${b} ${kl} = ${lsg} ${g}.`, true), opt('Stimmt.', false, 'null-platzhalter'), opt(`Falsch. Es gilt ${a} ${g} ${b} ${kl} = ${a}${b} ${g}.`, false, 'dezimal-stelle')],
        h2(`Wie viele ${kl} sind 1 ${g}? So viele Stellen gehören nach dem Komma zu den ${kl}.`, `Schreibe ${b} ${kl} mit ${s} Ziffern und fülle vorne mit 0 auf.`), { nachweis: [URTEIL(false, `${a} ${g} ${b} ${kl} = ${falsch} ${g}`)] }); },
    () => { const m = zz(1, 9), k = zz(1, 9), r = zz(1, 9), liste = [[`${m},${k}${r} m`, (m * 100 + k * 10 + r) * 10], [`${m} m ${k} cm ${r} mm`, m * 1000 + k * 10 + r], [`${m},0${k} m`, (m * 100 + k) * 10], [`${m * 100 + k} cm`, (m * 100 + k) * 10]];
      if (new Set([m, k, r]).size < 3) return null;
      const stimmt = liste.filter(([, w], i, l) => l.filter(([, x]) => x === w).length > 1).map(([t]) => t);
      if (stimmt.length !== 2) return null;
      return auswahl('Kreuze die beiden Längen an, die gleich groß sind.', liste.map(([t]) => opt(t, stimmt.includes(t), stimmt.includes(t) ? undefined : 'null-platzhalter')), tS2M,
        { mehrfach: true, nachweis: [`${m},0${k} m = ${m * 100 + k} cm`, `${m},${k}${r} m = ${(m * 100 + k * 10 + r) * 10} mm`, `${m} m ${k} cm ${r} mm = ${m * 1000 + k * 10 + r} mm`, { art: 'wert', wert: `${m * 100 + k} cm` }] }); },
  ]);
  sechs(S2, 'E', [
    () => { const e = zz(1, 9), z = zz(1, 9), stelle = wahl([['Zehntel', 'z', 1], ['Hundertstel', 'h', 2], ['Tausendstel', 't', 3]]), lsg = T(e * 10 ** stelle[2] + z, stelle[2]);
      return dezimal(`Gib die Dezimalzahl an: ${e} Einer und ${z} ${stelle[0]}. Sonst ist keine Stelle besetzt.`, lsg, dfe(lsg, [[`${e},${z}`, 'null-platzhalter'], [T(e * 10 ** (stelle[2] + 1) + z, stelle[2] + 1), 'dezimal-stelle'], [`${z},${e}`, 'stellenwert']]),
        h1('Die Ziffer der genannten Stelle steht nach so vielen Stellen hinter dem Komma, wie der Name sagt: Zehntel eine, Hundertstel zwei, Tausendstel drei.'), { nachweis: [`${e} Einer + ${z} ${stelle[0]} = ${lsg}`] }); },
    () => { const a = zz(2, 9), k = zz(1, 9), kn = kind(), [g, kl, f] = wahl([['m', 'cm', 100], ['€', 'ct', 100]]);
      const falsch = `${a},${k} ${g}`, richtig = `${a},0${k} ${g}`;
      return auswahl(`${kn} liest auf dem Zettel „${a} ${g} ${k} ${kl}“ und tippt ${falsch} in den Rechner. Beurteile, ob das stimmt.`, [opt(`Falsch. Es gilt ${k} ${kl} = ${T(k, 2)} ${g}, also sind es ${richtig}.`, true), opt('Stimmt.', false, 'null-platzhalter'), opt(`Stimmt, denn ${k} ${kl} = ${T(k, 1)} ${g}.`, false, 'null-platzhalter')],
        h1(`Wie viele ${kl} sind 1 ${g}? Prüfe, wie viele Stellen nach dem Komma zu den ${kl} gehören.`), { nachweis: [URTEIL(false, `${a} ${g} ${k} ${kl} = ${falsch}`), `${k} ${kl} = ${T(k, 2)} ${g}`, `${a} ${g} ${k} ${kl} = ${richtig}`] }); },
    () => { const km = zz(1, 9), m = zz(1, 9) * 10 + zz(1, 9), lsg = T(km * 1000 + m, 3);
      return luecken(`Schreibe als Kilometer mit Komma: ${km * 1000 + m} m = {{a}} km`, { a: [lsg, dfe(lsg, [[T(km * 1000 + m, 2), 'dezimal-stelle'], [`${km},${m}`, 'null-platzhalter']])] }, h1('1 km sind 1000 m. Die letzten drei Ziffern der Meter stehen nach dem Komma.'), { nachweis: [`${km * 1000 + m} m = ${lsg} km`] }); },
    () => { const a = zz(1, 9), k = zz(1, 9), falsch = zz(0, 4);
      const liste = [[`${a},5 kg = ${a} kg 500 g`, `${a},5 kg = ${a} kg 5 g`], [`0,${k}5 m = ${k * 10 + 5} cm`, `0,${k}5 m = ${k * 100 + 50} cm`], [`${a},0${k} km = ${a} km ${k * 10} m`, `${a},0${k} km = ${a} km ${k} m`], [`0,0${k} € = ${k} ct`, `0,0${k} € = ${k * 10} ct`], [`${a},${k}00 t = ${a} t ${k * 100} kg`, `${a},${k}00 t = ${a} t ${k} kg`]];
      return auswahl('Vier Umwandlungen stimmen, eine ist falsch. Kreuze die falsche an.', liste.map(([r, x], i) => opt(i === falsch ? x : r, i === falsch)), h1('Prüfe bei jeder Umwandlung die Umrechnungszahl. Achte auf Nullen direkt nach dem Komma und auf Endnullen.'), { nachweis: [{ art: 'aussagen', falsche: true }] }); },
    () => { const k = zz(11, 99), stimmt = wahl([true, false]), kn = kind(), a = T(k, 2), c = stimmt ? `${a}00` : T(k * 10, 4).replace(/^0,/, '0,0');
      if (k % 10 === 0 || c === a) return null;
      return auswahl(Z(`${kn} sagt: „${a} und ${c} sind gleich viel.“`, 'Beurteile die Aussage und begründe sie.'), richtigZuerst([opt(stimmt ? 'Stimmt. Endnullen ändern den Wert nicht.' : 'Stimmt. Beide haben dieselben Ziffern, und Nullen ändern den Wert einer Dezimalzahl an keiner Stelle.', stimmt, stimmt ? undefined : 'dezimal-wie-natuerlich'), opt(stimmt ? `Falsch. Es gilt ${a} < ${c}, denn ${c} hat mehr Stellen.` : `Falsch. Es gilt ${a} > ${c}, denn die Null nach dem Komma schiebt die Ziffern um eine Stelle nach rechts.`, !stimmt, stimmt ? 'dezimal-mehr-ziffern' : undefined), opt(`Falsch. Es gilt ${a} < ${c}.`, false, 'dezimal-mehr-ziffern')].filter((o, i, l) => l.findIndex((x) => x.text === o.text) === i)),
        h1('Schreibe beide Zahlen untereinander, Komma unter Komma. Vergleiche Stelle für Stelle.'), { nachweis: [URTEIL(stimmt, `${a} = ${c}`)] }); },
    () => { const g = zz(1, 9), kl = zz(1, 9) * 100 + zz(1, 9) * 10 + zz(1, 9), m = g * 1000 + kl, kn = kind(), cm = Math.floor(kl / 10), mm = kl % 10;
      return dezimal(`${kn} misst eine Strecke: ${g} m ${cm} cm ${mm} mm. Gib die Länge in Metern mit Komma an.`, T(m, 3), dfe(T(m, 3), [[`${g},${cm}${mm}`, 'null-platzhalter'], [T(m, 2), 'dezimal-stelle']]), h1('1 m = 100 cm = 1000 mm. Rechne alles in Millimeter um und setze dann das Komma.'), { einheit: 'm', nachweis: [`${g} m ${cm} cm ${mm} mm = ${m} mm`, `${m} mm = ${T(m, 3)} m`] }); },
  ]);
}
