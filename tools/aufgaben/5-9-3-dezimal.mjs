// Aufgaben zu 5.9.3 „Dezimalschreibweise“ (Lernziele K1, K2, K3) nach ADR 0015 und ADR 0036.
// K1: Stellenwerttafel mit Komma, Bruch mit Nenner 10, 100, 1000 und Dezimalzahl. K2: Zahlenstrahl, vergleichen, ordnen. K3: Größen mit Komma umwandeln.
// Grilling mit Nils (2026-11-22): Es heißt „Dezimalzahl“. F Zehntel, G Hundertstel und Endnullen, M Tausendstel, 0,15 gegen 0,5 gezielt auf M.
// Die Stellenwerttafel wird um z, h, t verlängert, das Komma steht auf der Trennlinie nach den Einern. Zeit mit Komma nur als Fehlersuche auf E.

import { sechs, auswahl, luecken, ordnen, zuordnen, strahl, bruch, dezimal, kommatafel, B, L, Z, h1, h2, h3, fehlerliste, kind } from '../werkzeug.mjs';
import { merktabelle, MERK, tafelBild } from './5-6-groessen.mjs';
import { vorn, fig, bild, NB, WERT, dz, br, opt, zz, wahl, mische } from './5-9-brueche.mjs';

const K1 = '5.9.3-K1', K2 = '5.9.3-K2', K3 = '5.9.3-K3';
const VGL = (l, r) => ({ art: 'vergleich', links: l, rechts: r });
const num = (t) => (typeof t === 'number' ? t : Number(String(t).replace(',', '.')));
// Typische Fehler mit Dezimalzahlen: [[wert, fehlvorstellung]], ohne die Lösung und ohne Doppelte.
const dfe = (loesung, paare) => { const gesehen = new Set([num(loesung)]); return paare.filter(([w]) => w != null && !Number.isNaN(num(w)) && num(w) >= 0 && !gesehen.has(num(w)) && gesehen.add(num(w))).map(([wert, fehlvorstellung]) => ({ wert, fehlvorstellung })); };
const zeichen = (a, c, fv) => [opt('<', a < c, fv), opt('>', a > c, fv), opt('=', a === c, fv)].map((o) => (o.richtig ? opt(o.text, true) : o));
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
const urteil = (stimmt, behauptung) => ({ art: 'urteil', stimmt, behauptung });
const ST = (st) => ({ teiler: 10, ...st });
const tafelZeile = (spalten, ziffern, vorsilbe) => { const werte = {}; return { zeile: ziffern.map((z, i) => { if (z == null) return ''; werte[`${vorsilbe}${i}`] = z; return L(`${vorsilbe}${i}`); }), werte }; };
// Ziffern einer Dezimalzahl (als ganze Zahl in der kleinsten Stelle) für die Spalten, führende Felder vor den Einern bleiben leer.
const ziffernFuer = (spalten, n) => { const t = String(n).padStart(spalten.length, ' ').split(''), e = spalten.indexOf('E'); return t.map((c, i) => (c === ' ' ? (i >= e ? 0 : null) : Number(c))); };

export function dezimalschreibweise() {
  // ================= K1: Stellenwerttafel, Bruch und Dezimalzahl =================
  const tK1 = h3('Die erste Stelle nach dem Komma zählt die Zehntel.', '3⁄10 = 0,3. Das sind 0 Einer und 3 Zehntel.', 'Schreibe zuerst die Einer, dann das Komma, dann die Zehntel.');
  sechs(K1, 'F', [
    () => { const k = wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return auswahl(Z('Der Streifen hat 10 gleich große Teile.', 'Welche Dezimalzahl passt zum gefärbten Teil?'), [opt(dz(k, 10), true), opt(`${k},0`, false, 'dezimal-stelle'), opt(dz(10 - k, 10), false, 'bruch-teil-zu-rest')], tK1,
        { bild: bild(fig('streifen', 10, vorn(k))), nachweis: [NB(br(k, 10)), WERT(dz(k, 10), false)] }); },
    () => { const e = zz(1, 9), z = zz(1, 9);
      if (e === z) return null;
      return kommatafel(Z(`Trage ${e},${z} in die Stellenwerttafel ein.`, 'E heißt Einer, z heißt Zehntel.'), ['E', 'z'], [[L('a'), L('b')]], { a: [e, fehlerliste(e, [[z, 'dezimal-stelle']])], b: [z, fehlerliste(z, [[e, 'dezimal-stelle']])] },
        h3('Vor dem Komma stehen die Einer. Nach dem Komma stehen die Zehntel.', 'Bei 2,5 trägst du 2 bei den Einern ein und 5 bei den Zehnteln.', 'Lies die Zahl von links nach rechts. Das Komma ist die Grenze.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: `${e},${z}` }] }); },
    () => { const k = zz(1, 9);
      return luecken(Z('Schreibe als Dezimalzahl.', `${br(k, 10)} = {{a}}`), { a: [dz(k, 10), dfe(dz(k, 10), [[`${k},1`, 'bruch-als-komma'], [k, 'dezimal-stelle']])] }, tK1, { bild: bild(fig('streifen', 10, vorn(k))), nachweis: [`${br(k, 10)} = ${dz(k, 10)}`] }); },
    () => { const e = zz(0, 9), z = zz(1, 9);
      if (e === z) return null;
      return dezimal(Z('Welche Dezimalzahl steht in der Stellenwerttafel?', 'E heißt Einer, z heißt Zehntel.'), `${e},${z}`, dfe(`${e},${z}`, [[`${z},${e}`, 'dezimal-stelle'], [e * 10 + z, 'dezimal-stelle']]),
        h3('Das Komma steht nach den Einern.', 'Stehen 2 Einer und 5 Zehntel in der Tafel, heißt die Zahl 2,5.', 'Schreibe die Einer, dann das Komma, dann die Zehntel.'), { bild: B.kommaTafel(['E', 'z'], [e, z]), nachweis: [{ art: 'tafelbild', zahl: `${e},${z}` }] }); },
    () => { const k = wahl([1, 2, 3, 4, 6, 7, 8, 9]);
      return bruch(Z(`Im Streifen sind 0,${k} gefärbt.`.replace('sind 0,1', 'ist 0,1'), `Schreibe 0,${k} als Bruch.`), br(k, 10), [[br(10, k), 'bruch-vertauscht'], [br(k, 100), 'dezimal-stelle'], [br(k, 10 - k), 'bruch-teil-zu-rest']],
        h3('Die Stelle nach dem Komma zählt die Zehntel. Zehntel haben den Nenner 10.', '0,3 sind 3 Zehntel. Als Bruch: 3⁄10.', 'Der Zähler ist die Ziffer nach dem Komma. Der Nenner ist 10.'), { bild: bild(fig('streifen', 10, vorn(k))), nachweis: [`0,${k} = ${br(k, 10)}`] }); },
    () => { const [a, c, d] = mische([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
      return zuordnen(Z('Was gehört zusammen?', 'Ordne zu.'), mische([[br(a, 10), dz(a, 10)], [`${c} Zehntel`, dz(c, 10)], [br(d, 10), dz(d, 10)]]),
        h3('Schau in die Tabelle: So schreibst du Zehntel mit Komma.', '1 Zehntel ist 1⁄10 oder 0,1.', 'Die Ziffer nach dem Komma zählt die Zehntel.'), { daten: { kopf: ['Bruch', 'Dezimalzahl'], zeilen: [[br(1, 10), '0,1'], [br(10, 10), '1']] }, nachweis: [{ art: 'paare' }] }); },
  ]);
  const tK1G = h3('Die erste Stelle nach dem Komma zählt die Zehntel, die zweite die Hundertstel.', '7⁄100 = 0,07. Das sind 0 Zehntel und 7 Hundertstel.', 'Schreibe Hundertstel immer mit zwei Stellen nach dem Komma.');
  const hundertstel = () => wahl([zz(2, 9), zz(11, 99), zz(11, 99)]);
  sechs(K1, 'G', [
    () => { const k = wahl([zz(3, 9), zz(11, 89)]);
      if (k % 10 === 0 || k % 11 === 0) return null;
      const falsch = k < 10 ? [opt(dz(k, 10), false, 'dezimal-stelle'), opt(`${k},0`, false, 'dezimal-stelle')] : [opt(dz(k, 10), false, 'dezimal-stelle'), opt(dz(Number(String(k).split('').reverse().join('')), 100), false, 'dezimal-stelle')];
      return auswahl(Z('Das Quadrat hat 100 gleich große Felder.', 'Welche Dezimalzahl passt zum gefärbten Teil?'), [opt(dz(k, 100), true), ...falsch],
        h3('Jedes Feld ist ein Hundertstel. Eine volle Spalte hat 10 Felder: Das ist ein Zehntel.', '7 Felder sind 7⁄100 = 0,07.', 'Zähle die vollen Spalten für die Zehntel. Zähle die einzelnen Felder für die Hundertstel.'),
        { bild: bild(fig('hundert', null, vorn(k))), nachweis: [NB(br(k, 100)), WERT(dz(k, 100), false)] }); },
    () => { const e = zz(1, 9), z = wahl([0, 0, zz(1, 9)]), h = zz(1, 9), zahl_ = `${e},${z}${h}`;
      const { zeile, werte } = tafelZeile(['E', 'z', 'h'], [e, z, h], 'a');
      return kommatafel(Z(`Trage ${zahl_} in die Stellenwerttafel ein.`, 'Die Spalte h zählt die Hundertstel.'), ['E', 'z', 'h'], [zeile], werte,
        h3('Nach dem Komma stehen zuerst die Zehntel, dann die Hundertstel.', 'Bei 2,05 trägst du ein: 2 Einer, 0 Zehntel, 5 Hundertstel.', 'Jede Ziffer bekommt ihr eigenes Feld. Auch die 0 wird eingetragen.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: zahl_ }] }); },
    () => { const k = hundertstel();
      return luecken(Z('Schreibe als Dezimalzahl.', `${br(k, 100)} = {{a}}`), { a: [dz(k, 100), dfe(dz(k, 100), [[dz(k, 10), 'dezimal-stelle'], [`${k},1`, 'bruch-als-komma'], [k, 'dezimal-stelle']])] }, tK1G,
        { bild: bild(fig('hundert', null, vorn(k))), nachweis: [`${br(k, 100)} = ${dz(k, 100)}`] }); },
    () => { const k = wahl([zz(11, 99), zz(11, 99), zz(1, 9) * 10]), text = dz(k, 100);
      return bruch(`Schreibe ${text} als Bruch mit dem Nenner 100.`, br(k, 100), [[br(k % 10 === 0 ? k / 10 : k, k % 10 === 0 ? 100 : 10), 'dezimal-stelle'], [br(100, k), 'bruch-vertauscht']],
        h3('Hundertstel haben den Nenner 100. Sie stehen an der zweiten Stelle nach dem Komma.', '0,3 sind 3 Zehntel. Das sind 30 Hundertstel: 30⁄100.', 'Schreibe die Zahl mit zwei Stellen nach dem Komma. Diese zwei Ziffern sind der Zähler.'), { genau: true, nachweis: [`${text} = ${br(k, 100)}`] }); },
    () => { const e = zz(1, 9), [z, h] = mische([1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== e)).slice(0, 2), [name, sp, ziffer] = wahl([['Zehntel', 'z', z], ['Hundertstel', 'h', h], ['Hundertstel', 'h', h]]);
      return dezimal(Z(`Schau auf die Zahl ${e},${z}${h}.`, `Welche Ziffer steht an der Stelle der ${name}?`), ziffer, fehlerliste(ziffer, [[sp === 'z' ? h : z, 'dezimal-stelle'], [e, 'dezimal-stelle']]),
        h3('Zähle die Stellen nach dem Komma: zuerst Zehntel, dann Hundertstel.', 'In 2,05 steht 0 bei den Zehnteln und 5 bei den Hundertsteln.', 'Die erste Ziffer nach dem Komma gehört zu den Zehnteln.'), { nachweis: [{ art: 'stelle', zahl: `${e},${z}${h}`, stelle: sp, ziffer }] }); },
    () => { const k = zz(1, 9), stimmt = wahl([true, false]), kn = kind(), a = `0,${k}`, c = stimmt ? `0,${k}0` : `0,0${k}`;
      return auswahl(Z(`${kn} sagt: „${a} und ${c} sind gleich viel.“`, 'Stimmt das?', 'Die Stellenwerttafel hilft dir.'), richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${a} > ${c}.`, !stimmt, 'dezimal-endnull'), opt(`Falsch. Es gilt ${a} < ${c}.`, false, stimmt ? 'dezimal-endnull' : 'dezimal-wie-natuerlich')]),
        h3('Trage beide Zahlen in die Stellenwerttafel ein. Vergleiche Stelle für Stelle.', '0,2 und 0,20 haben beide 2 Zehntel und 0 Hundertstel. Es gilt 0,2 = 0,20.', 'Eine Endnull ändert die Zahl nicht. Eine Null direkt nach dem Komma ändert sie.'),
        { bild: B.kommaTafel(['E', 'z', 'h'], [0, k, null], [stimmt ? [0, k, 0] : [0, 0, k]]), nachweis: [urteil(stimmt, `${a} = ${c}`)] }); },
  ]);
  const tK1M = h2('Die Stellen nach dem Komma heißen der Reihe nach Zehntel, Hundertstel, Tausendstel.', 'Tausendstel brauchen drei Stellen nach dem Komma. Fülle leere Stellen mit 0 auf.');
  const tausendstel = () => wahl([zz(2, 9), zz(11, 99), zz(101, 999), zz(101, 999)]);
  sechs(K1, 'M', [
    () => { const k = tausendstel();
      if (k % 10 === 0) return null;
      return luecken(Z('Schreibe als Dezimalzahl.', `${br(k, 1000)} = {{a}}`), { a: [dz(k, 1000), dfe(dz(k, 1000), [[dz(k, 100), 'dezimal-stelle'], [dz(k, 10), 'dezimal-stelle'], [dz(k, 10 ** String(k).length), 'null-platzhalter']])] }, tK1M, { nachweis: [`${br(k, 1000)} = ${dz(k, 1000)}`] }); },
    () => { const sp = ['E', 'z', 'h', 't'], n1 = zz(1, 9) * 1000 + zz(1, 9) * 10 + zz(1, 9), n2 = zz(1, 9) * 100 + zz(1, 9), z1 = tafelZeile(sp, ziffernFuer(sp, n1), 'a'), z2 = tafelZeile(sp, ziffernFuer(sp, n2), 'b');
      return kommatafel(`Trage die beiden Zahlen in die Stellenwerttafel ein: oben ${dz(n1, 1000)}, unten ${dz(n2, 1000)}.`, sp, [z1.zeile, z2.zeile], { ...z1.werte, ...z2.werte },
        h2('Jede Ziffer bekommt ihr eigenes Feld. Die Spalte t zählt die Tausendstel.', 'Beginne bei den Einern vor dem Komma. Auch jede 0 wird eingetragen.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: dz(n1, 1000) }, { art: 'tafel', zeile: 1, zahl: dz(n2, 1000) }] }); },
    () => { const k = wahl([zz(11, 99), zz(101, 999), zz(1, 9) * 10 + zz(1, 9) * 100]), text = dz(k, 1000);
      return bruch(`Schreibe ${text} als Bruch mit dem Nenner 1000.`, br(k, 1000), [[br(Number(String(k).replace(/0+$/, '')), 1000), 'dezimal-endnull'], [br(k, 100), 'dezimal-stelle'], [br(1000, k), 'bruch-vertauscht']].filter(([w]) => w !== br(k, 1000)),
        h2('Tausendstel haben den Nenner 1000. Sie stehen an der dritten Stelle nach dem Komma.', 'Schreibe die Zahl mit drei Stellen nach dem Komma. Diese drei Ziffern sind der Zähler, führende Nullen fallen weg.'), { genau: true, nachweis: [`${text} = ${br(k, 1000)}`] }); },
    () => { const [n1, s1, n2, s2] = wahl([['Zehntel', 100, 'Tausendstel', 1], ['Hundertstel', 10, 'Tausendstel', 1], ['Einer', 1000, 'Hundertstel', 10], ['Einer', 1000, 'Tausendstel', 1]]), a = zz(1, 9), c = zz(1, 9), wert = a * s1 + c * s2, lsg = dz(wert, 1000);
      return dezimal(`Schreibe als Dezimalzahl: ${a} ${n1} und ${c} ${n2}.`, lsg, dfe(lsg, [[n1 === 'Einer' ? `${a},${c}` : `0,${a}${c}`, 'null-platzhalter'], [`${a},${c}`, 'dezimal-stelle']]), tK1M, { nachweis: [`${a} ${n1} + ${c} ${n2} = ${lsg}`] }); },
    () => { const [z, n, hz] = wahl([[1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 2, 50]]), lsg = dz(hz, 100);
      return dezimal(Z(`Im Hunderterfeld ${z === 1 ? 'ist' : 'sind'} ${br(z, n)} gefärbt.`, `Schreibe ${br(z, n)} als Dezimalzahl.`), lsg, dfe(lsg, [[`0,${n}`, 'bruch-als-komma'], [`${z},${n}`, 'bruch-als-komma'], [`0,${z}${n}`, 'bruch-als-komma']]),
        h2('Zähle im Hunderterfeld: Wie viele Hundertstel sind gefärbt?', `Es sind ${hz} von 100 Feldern gefärbt, also ${br(hz, 100)}. Schreibe diese Hundertstel mit Komma.`),
        { bild: bild(fig('hundert', null, vorn(hz))), nachweis: [`${br(z, n)} = ${br(hz, 100)}`, `${br(hz, 100)} = ${lsg}`] }); },
    () => { const a = zz(1, 9), c = zz(11, 99), d = zz(2, 9), e = zz(1, 9), w = () => wahl([true, false]);
      const liste = [w() ? [`${dz(a, 10)} = ${br(a, 10)}`, true] : [`${dz(a, 100)} = ${br(a, 10)}`, false], w() ? [`${br(c, 100)} = ${dz(c, 100)}`, true] : [`${br(c, 100)} = ${dz(c, 1000)}`, false], w() ? [`${br(d, 1000)} = ${dz(d, 1000)}`, true] : [`${br(d, 1000)} = ${dz(d, 100)}`, false], w() ? [`0,${e}0 = 0,${e}`, true] : [`0,0${e} = 0,${e}`, false], [`${br(1, 2)} = 0,5`, true]];
      if (liste.filter(([, r]) => r).length > 4 || liste.filter(([, r]) => r).length < 2) return null;
      return auswahl('Welche Gleichungen stimmen? Kreuze alle an.', liste.map(([t, r]) => opt(t, r, r ? undefined : 'dezimal-stelle')), h2('Prüfe jede Gleichung mit der Stellenwerttafel: An welcher Stelle steht die Ziffer?', 'Zehntel stehen an der ersten, Hundertstel an der zweiten, Tausendstel an der dritten Stelle nach dem Komma.'), { mehrfach: true, nachweis: [{ art: 'aussagen' }] }); },
  ]);
  sechs(K1, 'E', [
    () => { const sp = ['Z', 'E', 'z', 'h', 't'], n = wahl([zz(1, 9) * 10000 + zz(1, 9) * 10 + zz(1, 9), zz(1, 9) * 10000 + zz(1, 9) * 1000 + zz(1, 9), zz(1, 9) * 1000 + zz(1, 9) * 10 + zz(0, 9), zz(1, 9) * 10000 + zz(1, 9) * 100 + zz(1, 9)]), z1 = tafelZeile(sp, ziffernFuer(sp, n), 'a');
      return kommatafel(`Trage ${dz(n, 1000)} in die Stellenwerttafel ein.`, sp, [z1.zeile], z1.werte, h1('Suche zuerst das Komma: Links davon stehen die Einer. Jede Stelle bekommt eine Ziffer, auch wenn sie 0 ist.'), { nachweis: [{ art: 'tafel', zeile: 0, zahl: dz(n, 1000) }] }); },
    () => { const e = zz(1, 9), a = zz(1, 9), c = zz(1, 9), [n1, s1, n2, s2] = wahl([['Hundertstel', 10, 'Tausendstel', 1], ['Zehntel', 100, 'Tausendstel', 1], ['Hundertstel', 10, 'Tausendstel', 1]]), wert = e * 1000 + a * s1 + c * s2, lsg = dz(wert, 1000);
      return dezimal(`Schreibe als Dezimalzahl: ${e} Einer, ${a} ${n1} und ${c} ${n2}.`, lsg, dfe(lsg, [[`${e},${a}${c}`, 'null-platzhalter'], [`${e}${a},${c}`, 'dezimal-stelle']]), h1('Stelle dir die Stellenwerttafel vor. Welche Stelle wird nicht genannt? Dort steht eine 0.'), { nachweis: [`${e} Einer + ${a} ${n1} + ${c} ${n2} = ${lsg}`] }); },
    () => { const g = zz(1, 9), k = wahl([zz(1, 9), zz(11, 99)]), text = `${g},${String(k).padStart(2, '0')}`;
      if (k % 10 === 0) return null;
      return bruch(`Schreibe ${text} als gemischte Zahl.`, br(k, 100, g), [[br(k, 10, g), 'dezimal-stelle'], [br(g * 100 + k, 1000), 'dezimal-stelle']], h1('Die Ziffern vor dem Komma sind die Ganzen. Die Ziffern nach dem Komma sind Hundertstel.'), { nachweis: [`${text} = ${br(k, 100, g)}`] }); },
    () => { const k = zz(2, 9), n = wahl([100, 1000]), stimmt = wahl([true, false, false]), kn = kind(), falsch = dz(k, n / 10), gesagt = stimmt ? dz(k, n) : falsch, g = (w) => `${br(k, n)} = ${w}`;
      return auswahl(`${kn} schreibt: ${g(gesagt)}. Stimmt das?`, richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${g(stimmt ? falsch : dz(k, n))}.`, !stimmt, 'dezimal-stelle'), opt(`Falsch. Es gilt ${g(dz(k, n * 10))}.`, false, 'dezimal-stelle')]),
        h1('Der Nenner sagt, an welcher Stelle nach dem Komma die letzte Ziffer stehen muss.'), { nachweis: [urteil(stimmt, g(gesagt))] }); },
    () => { const a = zz(2, 9), c = zz(11, 99), d = zz(101, 999), e = zz(2, 9), f = zz(1, 9), falsch = zz(0, 4);
      if (c % 10 === 0 || d % 10 === 0) return null;
      const liste = [[`${br(a, 10)} = ${dz(a, 10)}`, `${br(a, 10)} = ${dz(a, 100)}`], [`${br(c, 100)} = ${dz(c, 100)}`, `${br(c, 100)} = ${dz(c, 1000)}`], [`${br(d, 1000)} = ${dz(d, 1000)}`, `${br(d, 1000)} = ${dz(d, 100)}`], [`${br(e, 100)} = ${dz(e, 100)}`, `${br(e, 100)} = ${dz(e, 10)}`], [`${f},50 = ${br(1, 2, f)}`, `${f},2 = ${br(1, 2, f)}`]];
      return auswahl('Vier Gleichungen stimmen, eine ist falsch. Welche Gleichung ist falsch?', liste.map(([r, x], i) => opt(i === falsch ? x : r, i === falsch)), h1('Prüfe bei jeder Gleichung, ob die letzte Ziffer an der Stelle steht, die der Nenner nennt.'), { nachweis: [{ art: 'aussagen', falsche: true }] }); },
    () => { const z = zz(2, 4), t = zz(1, 9), lsg = `${2 * z},${z}0${t}`;
      return dezimal(`Gesucht ist eine Dezimalzahl mit drei Nachkommastellen. Sie hat ${z} Zehntel und ${t} Tausendstel, aber keine Hundertstel. Die Ziffer der Einer ist doppelt so groß wie die Ziffer der Zehntel. Wie heißt die Zahl?`, lsg, dfe(lsg, [[`${2 * z},${z}${t}`, 'null-platzhalter'], [`${z},${2 * z}0${t}`, 'dezimal-stelle'], [`${2 * z},0${z}${t}`, 'dezimal-stelle']]),
        h1('Zeichne eine Stellenwerttafel mit den Spalten E, z, h und t in dein Heft. Trage ein, was du weißt.'), { nachweis: [`${z} · 2 = ${2 * z}`, `${2 * z} Einer + ${z} Zehntel + ${t} Tausendstel = ${lsg}`] }); },
  ]);

  // ================= K2: Zahlenstrahl, vergleichen, ordnen =================
  const tK2 = h3('Von 0 bis 1 gibt es 10 gleiche Schritte. Jeder Schritt ist ein Zehntel.', 'Der dritte Teilstrich nach der 0 ist 0,3.', 'Zähle die Teilstriche ab der letzten beschrifteten Zahl.');
  const tVglF = h3('Am Zahlenstrahl steht die größere Zahl weiter rechts.', 'Es gilt 0,3 < 0,8. Denn 3 Zehntel sind weniger als 8 Zehntel.', 'Vergleiche zuerst die Einer. Sind sie gleich, vergleiche die Zehntel.');
  const strahlF = (bis = 20) => ({ von: 0, bis, schritt: 1, beschriftung: 10, teiler: 10 });
  sechs(K2, 'F', [
    () => { const p = wahl(vorn(19, 1).filter((x) => x % 10 !== 0));
      return strahl('ablesen', 'Auf welche Zahl zeigt der Pfeil?', { ...strahlF(), pfeil: p }, dz(p, 10), dfe(dz(p, 10), [[p, 'dezimal-stelle'], [p > 10 ? dz(p - 10, 10) : null, 'stellenwert']]), tK2, { nachweis: [{ art: 'strahl', zahl: dz(p, 10) }] }); },
    () => { const p = wahl(vorn(9, 1));
      return strahl('markieren', `Markiere ${dz(p, 10)} am Zahlenstrahl.`, strahlF(10), p, [], tK2, { nachweis: [{ art: 'strahl', zahl: dz(p, 10) }] }); },
    () => { const [a, c] = mische(vorn(9, 1)).slice(0, 2);
      return auswahl(Z('Beide Zahlen sind am Zahlenstrahl markiert.', 'Welches Zeichen passt?', `${dz(a, 10)} ▢ ${dz(c, 10)}`), zeichen(a, c, 'zeichen-verwechselt'), tVglF, { bild: B.strahl({ ...strahlF(10), punkte: [a, c] }), nachweis: [VGL(dz(a, 10), dz(c, 10))] }); },
    () => { const zs = mische(vorn(19, 1).filter((x) => x % 10 !== 0)).slice(0, 4).sort((a, c) => a - c);
      if (zs[0] > 9 || zs[3] < 11) return null;
      return ordnen(Z('Ordne die Dezimalzahlen.', 'Beginne mit der kleinsten.', 'Der Zahlenstrahl hilft dir.'), zs.map((x) => dz(x, 10)), tVglF, { bild: B.strahl(strahlF()), nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt' }); },
    () => { const p = wahl(vorn(29, 1).filter((x) => x % 10 !== 0 && x > 10));
      return strahl('markieren', `Markiere ${dz(p, 10)} am Zahlenstrahl.`, strahlF(30), p, fehlerliste(p, [[p % 10, 'stellenwert'], [(p % 10) * 10 + Math.floor(p / 10), 'dezimal-stelle']].filter(([w]) => w <= 30)),
        h3('Suche zuerst die Einer am Zahlenstrahl. Gehe dann in Zehntelschritten weiter.', 'Für 1,3 gehst du zur 1 und dann 3 Teilstriche nach rechts.', 'Die Ziffer vor dem Komma nennt die Einer. Die Ziffer nach dem Komma nennt die Zehntel.'), { nachweis: [{ art: 'strahl', zahl: dz(p, 10) }] }); },
    () => { const zs = mische(vorn(19, 1).filter((x) => x % 10 !== 0)).slice(0, 3), gross = wahl([true, false]), ziel = gross ? Math.max(...zs) : Math.min(...zs);
      return auswahl(Z(`Welche Zahl ist am ${gross ? 'größten' : 'kleinsten'}?`, 'Der Zahlenstrahl hilft dir.'), zs.map((x) => opt(dz(x, 10), x === ziel)), tVglF, { bild: B.strahl(strahlF()), nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
  ]);
  const tK2G = h3('Zwischen zwei Zehnteln liegen 10 kleine Schritte. Jeder Schritt ist ein Hundertstel.', 'Der dritte Teilstrich nach 0,2 ist 0,23.', 'Lies zuerst die beschriftete Zahl davor. Zähle dann die Hundertstel dazu.');
  const tVglG = h3('Vergleiche Stelle für Stelle von links: Einer, Zehntel, Hundertstel.', 'Es gilt 0,47 < 0,52. Denn 4 Zehntel sind weniger als 5 Zehntel.', 'Sind die Zehntel gleich, entscheiden die Hundertstel.');
  const strahlG = () => { const von = wahl([0, 0, zz(1, 8) * 10, zz(10, 30) * 10]); return { von, bis: von + 20, schritt: 1, beschriftung: 10, teiler: 100, ...(von > 0 ? { ausschnitt: true } : {}) }; };
  sechs(K2, 'G', [
    () => { const st = strahlG(), p = st.von + wahl(vorn(19, 1).filter((x) => x % 10 !== 0));
      return strahl('ablesen', 'Auf welche Zahl zeigt der Pfeil?', { ...st, pfeil: p }, dz(p, 100), dfe(dz(p, 100), [[dz(p, 10), 'dezimal-stelle'], [dz(Math.floor(p / 10) * 100 + (p % 10), 100), 'dezimal-stelle']]), tK2G, { nachweis: [{ art: 'strahl', zahl: dz(p, 100) }] }); },
    () => { const st = strahlG(), p = st.von + wahl(vorn(19, 1).filter((x) => x % 10 !== 0));
      return strahl('markieren', `Markiere ${dz(p, 100)} am Zahlenstrahl.`, st, p, [], tK2G, { nachweis: [{ art: 'strahl', zahl: dz(p, 100) }] }); },
    () => { const g = wahl([0, 0, zz(1, 9)]) * 100, [a, c] = mische(vorn(89, 11).filter((x) => x % 10 !== 0)).slice(0, 2), mit = wahl([true, false]), l = g + a, r = g + (mit ? Number(String(a).split('').reverse().join('')) : c);
      if (l === r) return null;
      return auswahl(Z('Welches Zeichen passt?', `${dz(l, 100)} ▢ ${dz(r, 100)}`), zeichen(l, r, 'dezimal-stelle'), tVglG, { nachweis: [VGL(dz(l, 100), dz(r, 100))] }); },
    () => { const z = zz(1, 8), zs = [z * 10 + zz(1, 9), z * 10 + 10 + zz(1, 9), z * 10 - 10 + zz(1, 9), zz(1, 9)].filter((x, i, l) => l.indexOf(x) === i).sort((a, c) => a - c);
      if (zs.length < 4) return null;
      return ordnen(Z('Ordne die Dezimalzahlen.', 'Beginne mit der kleinsten.'), zs.map((x) => dz(x, 100, 2)), tVglG, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt' }); },
    () => { const g = wahl([0, 0, zz(1, 9)]), k = zz(1, 9), a = `${g},${k}0`, c = `${g},${k}`, [l, r] = mische([a, c]);
      return auswahl(Z('Die Stellenwerttafel zeigt beide Zahlen.', 'Welches Zeichen passt?', `${l} ▢ ${r}`), [opt('=', true), opt(l === a ? '>' : '<', false, 'dezimal-endnull'), opt(l === a ? '<' : '>', false)],
        h3('Trage beide Zahlen in die Stellenwerttafel ein. Vergleiche Stelle für Stelle.', '0,2 und 0,20 haben beide 2 Zehntel und 0 Hundertstel. Es gilt 0,2 = 0,20.', 'Eine Endnull ändert die Zahl nicht.'),
        { bild: B.kommaTafel(['E', 'z', 'h'], l === a ? [g, k, 0] : [g, k, null], [l === a ? [g, k, null] : [g, k, 0]]), nachweis: [VGL(l, r)] }); },
    () => { const z = zz(1, 8), drin = mische(vorn(9, 1)).slice(0, 2).map((x) => z * 10 + x), aus = [mische([z * 10 - zz(1, 9), z + 10 * zz(1, 9)]), (z + 1) * 10 + zz(1, 9)].flat().filter((x) => x > 0 && (x < z * 10 || x > z * 10 + 10) && !drin.includes(x));
      const liste = mische([...drin, ...aus.slice(0, 2)]);
      if (new Set(liste).size !== 4) return null;
      return auswahl(Z(`Welche Zahlen liegen zwischen ${dz(z, 10)} und ${dz(z + 1, 10)}?`, 'Kreuze alle an.'), liste.map((x) => opt(dz(x, 100, 2), drin.includes(x))),
        h3('Schreibe die Grenzen mit zwei Stellen nach dem Komma. Dann kannst du gut vergleichen.', 'Es gilt 0,2 = 0,20 und 0,3 = 0,30. Dazwischen liegt zum Beispiel 0,25.', 'Prüfe bei jeder Zahl zuerst die Zehntel.'), { mehrfach: true, nachweis: [{ art: 'zwischen', von: dz(z, 10), bis: dz(z + 1, 10) }] }); },
  ]);
  const tStelle = h2('Vergleiche Stelle für Stelle von links. Die Zahl mit mehr Ziffern ist nicht automatisch größer.', 'Schreibe beide Zahlen mit gleich vielen Stellen nach dem Komma, zum Beispiel 0,5 = 0,50. Dann vergleiche.');
  sechs(K2, 'M', [
    () => { const x = zz(2, 9), y = zz(1, x - 1), z = zz(1, 9), a = x * 10, c = y * 10 + z, [l, r, lt, rt] = wahl([true, false]) ? [a, c, dz(x, 10), dz(c, 100)] : [c, a, dz(c, 100), dz(x, 10)];
      return auswahl(Z('Welches Zeichen passt?', `${lt} ▢ ${rt}`), zeichen(l, r, 'dezimal-wie-natuerlich'), tStelle, { nachweis: [VGL(lt, rt)] }); },
    () => { const von = zz(1, 97) * 10, p = von + wahl(vorn(19, 1).filter((x) => x % 10 !== 0)), st = { von, bis: von + 20, schritt: 1, beschriftung: 10, teiler: 1000, ausschnitt: true };
      return strahl('ablesen', 'Auf welche Zahl zeigt der Pfeil?', { ...st, pfeil: p }, dz(p, 1000), dfe(dz(p, 1000), [[dz(p, 100), 'dezimal-stelle'], [dz(Math.floor(p / 10) * 100 + (p % 10), 1000), 'dezimal-stelle']]),
        h2('Der Abstand zwischen zwei beschrifteten Zahlen ist ein Hundertstel. Er ist in 10 Schritte geteilt.', 'Jeder kleine Schritt ist ein Tausendstel. Lies die beschriftete Zahl vor dem Pfeil und zähle die Tausendstel dazu.'), { nachweis: [{ art: 'strahl', zahl: dz(p, 1000) }] }); },
    () => { const z = zz(2, 8), h = zz(1, 9), liste = [[z * 100, dz(z, 10)], [z * 100 + h * 10, dz(z * 10 + h, 100)], [z * 100 + h, dz(z * 100 + h, 1000)], [(z - 1) * 100 + 90 + h, dz((z - 1) * 100 + 90 + h, 1000)], [z * 100 + 50 + (h === 5 ? 1 : 0), dz(z * 100 + 50 + (h === 5 ? 1 : 0), 1000)]];
      if (new Set(liste.map(([w]) => w)).size !== 5) return null;
      return ordnen(Z('Ordne die Dezimalzahlen.', 'Beginne mit der kleinsten.'), liste.sort((a, c) => a[0] - c[0]).map(([, t]) => t), tStelle, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'dezimal-wie-natuerlich' }); },
    () => { const st = { von: 0, bis: 100, schritt: 5, beschriftung: 20, teiler: 100 }, p = wahl(vorn(19, 1).map((x) => x * 5).filter((x) => x % 20 !== 0));
      return strahl('markieren', `Markiere ${dz(p, 100)} am Zahlenstrahl.`, st, p, fehlerliste(p, [[p % 10 === 5 ? p + 5 : null, 'dezimal-stelle'], [p < 50 && (p * 2) % 20 !== 0 ? p * 2 : null, 'dezimal-stelle']].filter(([w]) => w && w <= 100)),
        h2('Wie groß ist ein Schritt zwischen zwei Teilstrichen? Von 0 bis 0,2 sind es 4 Schritte.', 'Ein Schritt ist 0,05 groß. Gehe von der letzten beschrifteten Zahl aus weiter.'), { nachweis: [{ art: 'strahl', zahl: dz(p, 100) }] }); },
    () => { const z = zz(2, 8), h = zz(1, 9), t = zz(1, 9), liste = [[z * 100, dz(z, 10), undefined], [(z - 1) * 100 + h * 10 + t, dz((z - 1) * 100 + h * 10 + t, 1000), undefined], [z * 100 + h, dz(z * 100 + h, 1000), undefined], [(z + 1) * 100 + 5 * (h % 2), dz((z + 1) * 100 + 5 * (h % 2), 1000), undefined]];
      const gross = wahl([true, false]), werte = liste.map(([w]) => w), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      if (new Set(werte).size !== 4) return null;
      const lang = liste.reduce((a, c) => (c[1].length > a[1].length ? c : a)), kurz = liste.reduce((a, c) => (c[1].length < a[1].length ? c : a)), falle = gross ? lang : kurz;
      return auswahl(`Welche Zahl ist am ${gross ? 'größten' : 'kleinsten'}?`, liste.map(([w, t]) => opt(t, w === ziel, w !== ziel && t === falle[1] ? 'dezimal-wie-natuerlich' : undefined)), tStelle, { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const z = zz(1, 8), drin = mische([z * 100 + zz(1, 9) * 10 + 5, z * 100 + zz(1, 9), z * 100 + zz(1, 9) * 10, z * 100 + 90 + zz(1, 9)]).slice(0, wahl([2, 3])), aus = mische([(z + 1) * 100 + zz(1, 9), (z - 1) * 100 + 90 + zz(1, 9), (z + 1) * 100 + zz(1, 9) * 10, z * 10 + zz(1, 9)]);
      const liste = mische([...drin, ...aus.slice(0, 5 - drin.length)]);
      if (new Set(liste).size !== 5) return null;
      return auswahl(Z(`Welche Zahlen liegen zwischen ${dz(z, 10)} und ${dz(z + 1, 10)}?`, 'Kreuze alle an.'), liste.map((x) => opt(dz(x, 1000), drin.includes(x), drin.includes(x) ? undefined : 'dezimal-wie-natuerlich')), tStelle, { mehrfach: true, nachweis: [{ art: 'zwischen', von: dz(z, 10), bis: dz(z + 1, 10) }] }); },
  ]);
  sechs(K2, 'E', [
    () => { const a = zz(1, 9), c = zz(1, 9), liste = [[a * 1000 + c * 10, dz(a * 1000 + c * 10, 10000)], [a * 1000 + c * 100, dz(a * 100 + c * 10, 1000)], [c * 1000 + a * 100, dz(c * 10 + a, 100)], [a * 100 + c * 10 + 5, dz(a * 100 + c * 10 + 5, 10000)], [a * 1000 + c * 100 + 5, dz(a * 1000 + c * 100 + 5, 10000)]];
      if (new Set(liste.map(([w]) => w)).size !== 5) return null;
      const ab = wahl([true, false]), sort = liste.sort((x, y) => x[0] - y[0]).map(([, t]) => t);
      return ordnen(Z('Ordne die Dezimalzahlen.', `Beginne mit der ${ab ? 'größten' : 'kleinsten'}.`), ab ? sort.reverse() : sort, h1('Schreibe alle Zahlen mit gleich vielen Nachkommastellen, indem du Endnullen anhängst. Vergleiche dann Stelle für Stelle.'), { nachweis: [{ art: 'ordnung', richtung: ab ? 'ab' : 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'dezimal-wie-natuerlich' }); },
    () => { const von = zz(1, 9) * 100, p = von + wahl(vorn(19, 1)) * 5, st = { von, bis: von + 100, schritt: 5, beschriftung: 50, teiler: 1000, ausschnitt: true };
      return strahl('ablesen', 'Auf welche Zahl zeigt der Pfeil?', { ...st, pfeil: p }, dz(p, 1000), dfe(dz(p, 1000), [[dz(von + ((p - von) / 5) * 10, 1000), 'dezimal-stelle'], [dz(von + (p - von) / 5, 1000), 'dezimal-stelle']]),
        h1('Bestimme zuerst die Schrittweite: Wie viele Schritte liegen zwischen den beiden beschrifteten Zahlen, und wie groß ist ihr Abstand?'), { nachweis: [{ art: 'strahl', zahl: dz(p, 1000) }] }); },
    () => { const von = zz(0, 8) * 10, st = { von, bis: von + 20, schritt: 1, beschriftung: 10, teiler: 100, ...(von > 0 ? { ausschnitt: true } : {}) }, p = von + wahl(vorn(19, 1).filter((x) => x % 10 !== 0));
      return strahl('markieren', `Markiere ${dz(p, 100)} am Zahlenstrahl.`, st, p, fehlerliste(p, [[p % 10 !== 0 && p - (p % 10) + 10 - (p % 10) !== p ? p - (p % 10) + 10 - (p % 10) : null, 'dezimal-stelle']].filter(([w]) => w && w >= von && w <= von + 20)),
        h1('Nicht jedes Zehntel ist beschriftet. Überlege zuerst, welche Zahlen an den längeren Teilstrichen stehen müssten.'), { nachweis: [{ art: 'strahl', zahl: dz(p, 100) }] }); },
    () => { const x = zz(3, 9), y = zz(1, x - 1), rest = zz(11, 99), kurz = dz(x, 10), lang = dz(y * 100 + rest, 1000), stimmt = wahl([true, false, false]), kn = kind();
      if (rest % 10 === 0) return null;
      const satz = stimmt ? `„${kurz} ist größer als ${lang}, denn ${x} Zehntel sind mehr als ${y} Zehntel.“` : `„${lang} ist größer als ${kurz}, denn ${y * 100 + rest} ist größer als ${x}.“`;
      const [l, r] = stimmt ? [kurz, lang] : [lang, kurz];
      return auswahl(`${kn} sagt: ${satz} Stimmt das?`, richtigZuerst([opt('Stimmt.', stimmt, 'dezimal-wie-natuerlich'), opt(`Falsch. Es gilt ${l} < ${r}.`, !stimmt, 'dezimal-wie-natuerlich'), opt(`Falsch. Es gilt ${l} = ${r}.`, false, 'dezimal-endnull')]),
        h1('Bei Dezimalzahlen entscheidet nicht die Zahl der Ziffern. Vergleiche zuerst die Zehntel.'), { nachweis: [urteil(stimmt, `${l} > ${r}`)] }); },
    () => { const [a, n] = wahl([[zz(1, 8), 10], [zz(11, 98), 100], [zz(1, 8) * 10, 100], [zz(11, 30), 10]]), l = dz(a, n), r = dz(a + 1, n), s = dz(2 * a + 1, n), m = dz((2 * a + 1) * 5, n * 10);
      return dezimal(`Welche Zahl liegt genau in der Mitte zwischen ${l} und ${r}?`, m, dfe(m, [[dz((2 * a + 1) * 5, n * 100), 'dezimal-stelle'], [dz(a * 10 + 1, n * 10), 'dezimal-stelle'], [s, 'sach-schritt-vergessen']]),
        h1('Teile den Abstand zwischen den beiden Zahlen in zwei gleiche Hälften. Eine weitere Nachkommastelle hilft dir.'), { nachweis: [`${l} + ${r} = ${s}`, `${s} : 2 = ${m}`] }); },
    () => { const [von, bis, drin, aus] = wahl([[[1, 4], [1, 2], ['0,3', '0,45', '0,255', '0,4'], [['0,14', 'bruch-als-komma'], ['0,205', 'dezimal-wie-natuerlich'], ['0,52', undefined], ['0,12', 'bruch-als-komma'], ['0,6', undefined]]], [[1, 2], [3, 4], ['0,6', '0,705', '0,55', '0,74'], [['0,34', 'bruch-als-komma'], ['0,8', undefined], ['0,12', 'bruch-als-komma'], ['0,45', undefined], ['0,076', 'dezimal-wie-natuerlich']]], [[1, 5], [1, 2], ['0,3', '0,25', '0,405', '0,49'], [['0,15', 'bruch-als-komma'], ['0,12', 'bruch-als-komma'], ['0,51', undefined], ['0,025', 'dezimal-wie-natuerlich'], ['0,7', undefined]]]]);
      const k = zz(2, 3), liste = mische([...mische(drin).slice(0, k).map((t) => opt(t, true)), ...mische(aus).slice(0, 5 - k).map(([t, fv]) => opt(t, false, fv))]);
      return auswahl(Z(`Welche Dezimalzahlen liegen zwischen ${br(von[0], von[1])} und ${br(bis[0], bis[1])}?`, 'Kreuze alle an.'), liste, h1('Schreibe die beiden Brüche zuerst als Dezimalzahlen. Dafür brauchst du Zehntel oder Hundertstel.'), { mehrfach: true, nachweis: [{ art: 'zwischen', von: br(von[0], von[1]), bis: br(bis[0], bis[1]) }] }); },
  ]);

  // ================= K3: Größen mit Komma umwandeln =================
  const tGeld = h3('Bei Euro stehen nach dem Komma die Cent. Es sind immer zwei Stellen.', '2,50 € = 2 € 50 ct.', 'Lies vor dem Komma die Euro und nach dem Komma die Cent.');
  const tCm = h3('1 cm sind 10 mm. Die Stelle nach dem Komma zählt die Millimeter.', '1,5 cm = 15 mm. Das sind 1 cm und 5 mm.', 'Vor dem Komma stehen die Zentimeter. Nach dem Komma stehen die Millimeter.');
  const MG = merktabelle(MERK.geld), MC = merktabelle(MERK.cmmm), ct2 = (ct) => `${Math.floor(ct / 100)},${String(ct % 100).padStart(2, '0')} €`;
  sechs(K3, 'F', [
    () => { const cm = zz(1, 9), mm = zz(1, 9), w = cm * 10 + mm;
      return luecken(Z('Wandle um.', `${cm},${mm} cm = {{a}} mm`), { a: [w, fehlerliste(w, [[cm + mm, 'masszahlen-addiert'], [w * 10, 'umrechnungszahl'], [cm * 100 + mm, 'komma-falsch-gelesen']])] }, tCm, { daten: MC, nachweis: [`${cm},${mm} cm = ${w} mm`] }); },
    () => { const eu = zz(1, 9), ct = wahl([5, 10, 20, 25, 40, 50, 75, 80, 90, 95]);
      return luecken(Z('Schreibe mit Euro und Cent.', `${ct2(eu * 100 + ct)} = {{a}} € {{b}} ct`), { a: [eu, []], b: [ct, fehlerliste(ct, [[ct % 10 === 0 ? ct / 10 : ct * 10, 'komma-falsch-gelesen']].filter(([x]) => x < 100))] }, tGeld, { daten: MG, nachweis: [`${ct2(eu * 100 + ct)} = ${eu} € ${ct} ct`] }); },
    () => { const eu = zz(1, 9), ct = wahl([5, 10, 20, 25, 40, 50, 75, 80, 90]), w = eu * 100 + ct;
      return luecken(Z('Wandle in Cent um.', `${ct2(w)} = {{a}} ct`), { a: [w, fehlerliste(w, [[eu * 10 + ct / (ct % 10 === 0 ? 10 : 1), 'komma-falsch-gelesen'], [eu + ct, 'masszahlen-addiert'], [eu * 1000 + ct, 'umrechnungszahl']])] }, tGeld, { daten: MG, nachweis: [`${ct2(w)} = ${w} ct`] }); },
    () => { const cm = zz(1, 9), mm = zz(1, 9), lsg = `${cm},${mm}`;
      return luecken(Z('Schreibe mit Komma.', `${cm} cm ${mm} mm = {{a}} cm`), { a: [lsg, dfe(lsg, [[cm * 10 + mm, 'umrechnungsrichtung'], [`${mm},${cm}`, 'komma-falsch-gelesen'], [cm + mm, 'masszahlen-addiert']])] }, tCm, { daten: MC, nachweis: [`${cm} cm ${mm} mm = ${lsg} cm`] }); },
    () => { const cm = zz(1, 8), mm = zz(1, 9), w = cm * 10 + mm, r = wahl([w, (cm + 1) * 10, cm * 10, mm * 10 + cm].filter((x) => x > 0));
      return auswahl(Z('Welches Zeichen passt?', `${cm},${mm} cm ▢ ${r} mm`), zeichen(w, r, 'umrechnungszahl'),
        h3('Vergleichen kannst du erst in derselben Einheit. Wandle in Millimeter um.', '1,5 cm = 15 mm. Es gilt 15 mm < 20 mm.', 'Schau in die Tabelle: 1 cm sind 10 mm.'), { daten: MC, nachweis: [VGL(`${cm},${mm} cm`, `${r} mm`)] }); },
    () => { const eu = zz(1, 9), z = zz(1, 9);
      return zuordnen(Z('Was gehört zusammen?', 'Ordne zu.'), mische([[ct2(eu * 100 + z * 10), `${eu} € ${z * 10} ct`], [ct2(eu * 100 + z), `${eu} € ${z} ct`], [ct2(z * 10 + eu), `${z * 10 + eu} ct`]]),
        h3('Nach dem Komma stehen bei Euro immer zwei Stellen für die Cent.', '2,05 € = 2 € 5 ct. Aber 2,50 € = 2 € 50 ct.', 'Lies die zwei Ziffern nach dem Komma zusammen als Cent.'), { daten: MG, nachweis: [{ art: 'paare' }] }); },
  ]);
  const tM = h3('1 m sind 100 cm. Nach dem Komma stehen zwei Stellen für die Zentimeter.', '1,25 m = 125 cm. Das sind 1 m und 25 cm.', 'Trage die Größe in die Einheitentafel ein. Lies sie dann ohne Komma in der kleineren Einheit.');
  const tKg = h3('1 kg sind 1000 g. Drei Stellen nach dem Komma gehören zu den Gramm.', '1,5 kg = 1500 g. Das sind 1 kg und 500 g.', 'Trage die Größe in die Einheitentafel ein. Fülle leere Stellen mit 0 auf.');
  sechs(K3, 'G', [
    () => { const m = zz(1, 9), cm = wahl([zz(11, 99), zz(1, 9) * 10, zz(1, 9)]), w = m * 100 + cm, text = `${m},${String(cm).padStart(2, '0')} m`;
      return luecken(Z('Wandle um.', 'Die Einheitentafel hilft dir.', `${text} = {{a}} cm`), { a: [w, fehlerliste(w, [[m * 10 + cm, 'komma-falsch-gelesen'], [w * 10, 'umrechnungszahl'], [m + cm, 'masszahlen-addiert']])] }, tM, { bild: tafelBild('m-cm', w * 10), nachweis: [`${text} = ${w} cm`] }); },
    () => { const kg = zz(0, 9), g = wahl([zz(1, 9) * 100, zz(1, 9) * 100 + 50, 250, 750]), w = kg * 1000 + g, text = `${dz(w, 1000)} kg`;
      if (!/^\d+,\d{1,2}$/.test(dz(w, 1000))) return null;
      return luecken(Z('Wandle um.', 'Die Einheitentafel hilft dir.', `${text} = {{a}} g`), { a: [w, fehlerliste(w, [[w / 10, 'umrechnungszahl'], [kg * 10 + Number(String(g).replace(/0+$/, '')), 'komma-falsch-gelesen']])] }, tKg, { bild: tafelBild('kg-g', w * 1000), nachweis: [`${text} = ${w} g`] }); },
    () => { const m = zz(1, 9), cm = wahl([zz(11, 99), zz(1, 9) * 10, zz(1, 9)]), w = m * 100 + cm, lsg = dz(w, 100);
      return luecken(Z('Wandle um.', `${w} cm = {{a}} m`), { a: [lsg, dfe(lsg, [[dz(w, 10), 'umrechnungszahl'], [dz(w, 1000), 'umrechnungszahl'], [w * 100, 'umrechnungsrichtung']])] },
        h3('100 cm sind 1 m. Die letzten zwei Ziffern sind die Zentimeter nach dem Komma.', '125 cm = 1,25 m. Das sind 1 m und 25 cm.', 'Setze das Komma so, dass zwei Stellen dahinter stehen.'), { nachweis: [`${w} cm = ${lsg} m`] }); },
    () => { const m = zz(1, 9), cm = wahl([zz(11, 99), zz(1, 9)]), text = `${m},${String(cm).padStart(2, '0')} m`;
      return luecken(Z('Schreibe mit zwei Einheiten.', `${text} = {{a}} m {{b}} cm`), { a: [m, []], b: [cm, fehlerliste(cm, [[cm < 10 ? cm * 10 : null, 'komma-falsch-gelesen'], [cm % 10 === 0 ? cm / 10 : null, 'komma-falsch-gelesen']].filter(([x]) => x))] }, tM, { nachweis: [`${text} = ${m} m ${cm} cm`] }); },
    () => { const m = zz(2, 4), z = zz(1, 9), ab = zz(3, 9) * 10, w = m * 100 + z * 10, kn = kind(), ding = wahl(['Ein Brett', 'Eine Latte', 'Ein Balken']);
      return dezimal(Z(`${ding} ist ${m},${z}0 m lang.`, `${kn} sägt ${ab} cm ab.`, 'Wie viele Zentimeter bleiben übrig?'), w - ab, fehlerliste(w - ab, [[w, 'sach-schritt-vergessen'], [m * 10 + z - ab > 0 ? m * 10 + z - ab : null, 'masszahlen-addiert'], [w + ab, 'sub-addiert']].filter(([x]) => x)),
        h3('Rechnen kannst du erst in derselben Einheit. Wandle die Länge in Zentimeter um.', '1,50 m = 150 cm. Dann rechnest du 150 cm − 30 cm = 120 cm.', 'Wandle zuerst um. Ziehe dann ab.'), { einheit: 'cm', nachweis: [`${m},${z}0 m = ${w} cm`, `${w} cm − ${ab} cm = ${w - ab} cm`] }); },
    () => { const m = zz(1, 9), z = zz(1, 9), stimmt = wahl([true, false, false]), kn = kind(), g = (cm) => `${m},${z} m = ${m} m ${cm} cm`;
      return auswahl(Z(`${kn} sagt: „${m},${z} m sind ${m} m ${stimmt ? z * 10 : z} cm.“`, 'Stimmt das?', 'Die Einheitentafel hilft dir.'), richtigZuerst([opt('Stimmt.', stimmt, 'komma-falsch-gelesen'), opt(`Falsch. Es gilt ${g(stimmt ? z : z * 10)}.`, !stimmt, 'komma-falsch-gelesen'), opt(`Falsch. Es gilt ${m},${z} m = ${m * 10 + z} cm.`, false, 'umrechnungszahl')]),
        h3('Trage die Größe in die Einheitentafel ein. Zentimeter brauchen zwei Stellen.', '1,5 m = 1,50 m. Das sind 1 m 50 cm.', 'Hänge eine Endnull an. Lies dann die zwei Stellen nach dem Komma als Zentimeter.'), { bild: tafelBild('m-cm', (m * 100 + z * 10) * 10), nachweis: [urteil(stimmt, g(stimmt ? z * 10 : z))] }); },
  ]);
  const tUm = h2('Überlege zuerst die Umrechnungszahl: 1 m = 100 cm, 1 km = 1000 m, 1 kg = 1000 g.', 'Bei 100 gehören zwei Stellen nach dem Komma zur kleineren Einheit, bei 1000 sind es drei. Fülle leere Stellen mit 0 auf.');
  sechs(K3, 'M', [
    () => { const m = zz(1, 9), cm = zz(1, 9), w = m * 100 + cm;
      return luecken(Z('Wandle um.', `${m},0${cm} m = {{a}} cm`), { a: [w, fehlerliste(w, [[m * 10 + cm, 'null-platzhalter'], [m * 100 + cm * 10, 'komma-falsch-gelesen'], [m * 1000 + cm, 'umrechnungszahl']])] }, tUm, { nachweis: [`${m},0${cm} m = ${w} cm`] }); },
    () => { const g = wahl([zz(11, 99), zz(1, 9), zz(1, 9) * 100 + zz(1, 9) * 10]), lsg = dz(g, 1000);
      return luecken(Z('Wandle um.', `${g} g = {{a}} kg`), { a: [lsg, dfe(lsg, [[dz(g, 100), 'umrechnungszahl'], [dz(g, 10 ** String(g).length), 'null-platzhalter'], [g * 1000, 'umrechnungsrichtung']])] }, tUm, { nachweis: [`${g} g = ${lsg} kg`] }); },
    () => { const km = zz(1, 9), h = zz(1, 9), m2 = wahl([zz(1, 9) * 100 + 50, zz(11, 99) * 10, zz(1, 9) * 100]), l1 = km * 1000 + h * 100, l2 = dz(m2, 1000);
      return luecken(Z('Wandle um.', `${km},${h} km = {{a}} m`, `${m2} m = {{b}} km`), { a: [l1, fehlerliste(l1, [[km * 100 + h * 10, 'umrechnungszahl'], [km * 1000 + h, 'komma-falsch-gelesen']])], b: [l2, dfe(l2, [[dz(m2, 100), 'umrechnungszahl'], [m2 * 1000, 'umrechnungsrichtung']])] }, tUm, { nachweis: [`${km},${h} km = ${l1} m`, `${m2} m = ${l2} km`] }); },
    () => { const k = zz(2, 9), [g, kl, f] = wahl([['kg', 'g', 1000], ['km', 'm', 1000]]);
      return zuordnen(Z('Welche Größen sind gleich?', 'Ordne zu.'), mische([[`0,${k} ${g}`, `${k * 100} ${kl}`], [`0,0${k} ${g}`, `${k * 10} ${kl}`], [`0,00${k} ${g}`, `${k} ${kl}`], [`${k} ${g}`, `${k * f} ${kl}`]]), tUm, { nachweis: [{ art: 'paare' }] }); },
    () => { const a = zz(1, 3) * 1000 + 500, c = wahl([250, 750, 400, 600]), d = wahl([250, 500, 125]), [was, ort] = wahl([['Pakete', 'Der Bote der Burg trägt'], ['Säcke', 'Der Müller lädt'], ['Körbe', 'Die Händlerin trägt']]);
      return dezimal(`${ort} drei ${was}. Sie wiegen ${dz(a, 1000)} kg, ${c} g und ${dz(d, 1000)} kg. Wie viel Gramm wiegen sie zusammen?`, a + c + d, fehlerliste(a + c + d, [[a + d, 'sach-schritt-vergessen'], [a / 1000 + c + d / 1000 === Math.floor(a / 1000 + c + d / 1000) ? a / 1000 + c + d / 1000 : null, 'masszahlen-addiert'], [a / 10 + c + d / 10, 'umrechnungszahl']].filter(([x]) => x && Number.isInteger(x))),
        h2('Wandle zuerst alle Gewichte in Gramm um.', `${dz(a, 1000)} kg sind ${a} g. Wandle auch das dritte Gewicht um und addiere dann.`), { einheit: 'g', nachweis: [`${dz(a, 1000)} kg = ${a} g`, `${dz(d, 1000)} kg = ${d} g`, `${a} g + ${c} g + ${d} g = ${a + c + d} g`] }); },
    () => { const z = zz(2, 8), h = zz(1, 9), liste = [[z * 100, `${dz(z, 10)} m`], [(z * 10 + h) * 10, `${z * 10 + h} cm`], [z * 100 + h, `${dz(z * 100 + h, 1000)} m`], [(z * 10 + h + 5) * 10, `${z * 10 + h + 5} cm`], [h * 1000 + z * 100, `${dz(h * 10 + z, 10)} m`]]; // Werte in Millimetern
      if (new Set(liste.map(([w]) => w)).size !== 5) return null;
      return ordnen(Z('Ordne die Längen.', 'Beginne mit der kleinsten.'), liste.sort((a, c) => a[0] - c[0]).map(([, t]) => t), h2('Wandle alle Längen in dieselbe Einheit um, am besten in Zentimeter.', '1 m = 100 cm. Verschiebe das Komma um zwei Stellen und fülle mit 0 auf.'), { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt' }); },
  ]);
  sechs(K3, 'E', [
    () => { const [g, k, f] = wahl([['m', 'cm', 100], ['kg', 'g', 1000], ['km', 'm', 1000]]), a = wahl([75, 8, 45, 125, 305, 6].filter((x) => x < f)), w = (a * 1000) / f, r = wahl([a < 10 ? a * 10 : Math.round(a / 10) * 10 + 10, a, a < 10 ? a * 100 : a + 5].filter((x) => x > 0));
      const lt = `${dz(w, 1000)} ${g}`, rt = `${r} ${k}`;
      return auswahl(Z('Welches Zeichen passt?', `${lt} ▢ ${rt}`), zeichen(a, r, 'komma-falsch-gelesen'), h1('Vergleichen kannst du erst in derselben Einheit. Wandle die Größe mit Komma in die kleinere Einheit um.'), { nachweis: [VGL(lt, rt)] }); },
    () => { const std = zz(1, 3), [komma, min, falle] = wahl([['5', 30, 5], ['5', 30, 50], ['25', 15, 25], ['75', 45, 75]]), stimmt = wahl([true, false, false]), kn = kind(), g = (x) => `${std},${komma} h = ${std} h ${x} min`;
      return auswahl(`${kn} sagt: „${std},${komma} h sind ${std} h ${stimmt ? min : falle} min.“ Stimmt das?`, richtigZuerst([opt('Stimmt.', stimmt, 'komma-falsch-gelesen'), opt(`Falsch. Es gilt ${g(stimmt ? falle : min)}.`, !stimmt, 'komma-falsch-gelesen'), opt(`Falsch. Es gilt ${g(min === 30 ? (falle === 5 ? 50 : 5) : 60 - min)}.`, false, 'umrechnungszahl')]),
        h1('Eine Stunde hat 60 min, nicht 100. Überlege: Welcher Bruchteil einer Stunde steht nach dem Komma?'), { nachweis: [urteil(stimmt, g(stimmt ? min : falle))] }); },
    () => { const m = zz(1, 3), z = zz(1, 9), liste = mische([[m * 1000 + z * 10, `${m},0${z} m`], [m * 100 + z * 10, `${m * 100 + z * 10} mm`], [m * 1000 + z * 100, `${m},${z} m`], [(m * 10 + z) * 10 + 5, `${m * 10 + z},5 cm`], [m * 1000 + 750 + z, `${m} m ${75} cm ${z} mm`]]);
      const gross = wahl([true, false]), werte = liste.map(([w]) => w), ziel = gross ? Math.max(...werte) : Math.min(...werte);
      if (new Set(werte).size !== 5) return null;
      return auswahl(`Welche Länge ist am ${gross ? 'größten' : 'kleinsten'}?`, liste.map(([w, t]) => opt(t, w === ziel)), h1('Wandle alle Längen in Millimeter um. Achte auf die Null nach dem Komma.'), { nachweis: [{ art: 'extrem', was: gross ? 'groesste' : 'kleinste' }] }); },
    () => { const a = zz(1, 9), c = zz(11, 99), d = zz(1, 9), e = zz(2, 9), f = zz(1, 9), falsch = zz(0, 4);
      const liste = [[`${a},5 kg = ${a * 1000 + 500} g`, `${a},5 kg = ${a * 1000 + 5} g`], [`0,${c} m = ${c} cm`, `0,${c} m = ${c * 10} cm`], [`${d},${e} km = ${d * 1000 + e * 100} m`, `${d},${e} km = ${d * 100 + e * 10} m`], [`0,0${e} € = ${e} ct`, `0,0${e} € = ${e * 10} ct`], [`${f},05 m = ${f * 100 + 5} cm`, `${f},05 m = ${f * 100 + 50} cm`]];
      return auswahl('Vier Umwandlungen stimmen, eine ist falsch. Welche Umwandlung ist falsch?', liste.map(([r, x], i) => opt(i === falsch ? x : r, i === falsch)), h1('Prüfe bei jeder Umwandlung die Umrechnungszahl: Wie viele Stellen nach dem Komma gehören zur kleineren Einheit?'), { nachweis: [{ art: 'aussagen', falsche: true }] }); },
    () => { const a = zz(1, 2) * 100 + zz(1, 9) * 10, c = zz(5, 9) * 10 + 5, d = zz(2, 9) * 10, kn = kind(), [was, tut] = wahl([['Bretter', 'legt'], ['Latten', 'legt'], ['Seile', 'knotet']]);
      return dezimal(`${kn} ${tut} drei ${was} aneinander: ${dz(a, 100)} m, ${c} cm und ${dz(d, 100)} m. Wie viele Zentimeter sind sie zusammen lang?`, a + c + d, fehlerliste(a + c + d, [[a + d, 'sach-schritt-vergessen'], [a / 10 + c + d / 10, 'komma-falsch-gelesen']].filter(([x]) => Number.isInteger(x))),
        h1('Wandle alle Längen in Zentimeter um. Achtung: 0,4 m sind nicht 4 cm.'), { einheit: 'cm', nachweis: [`${dz(a, 100)} m = ${a} cm`, `${dz(d, 100)} m = ${d} cm`, `${a} cm + ${c} cm + ${d} cm = ${a + c + d} cm`] }); },
    () => { const gr = zz(131, 158), mehr = zz(4, 9), [k1, wer] = wahl([[kind(), 'Ihr Bruder'], [kind(), 'Der Vater'], [kind(), 'Die Schwester']]), lsg = dz(gr + mehr, 100, 2), wer2 = wer.replace('Ihr ', 'der ').replace('Der ', 'der ').replace('Die ', 'die ');
      if ((gr + mehr) % 10 === 0 || gr % 10 === 0) return null;
      return dezimal(`${k1} ist ${dz(gr, 100, 2)} m groß. ${wer.replace('Ihr Bruder', 'Der Bruder')} ist ${mehr} cm größer. Wie groß ist ${wer2}? Gib die Größe in Metern an.`, lsg, dfe(lsg, [[dz(gr + mehr * 10, 100, 2), 'komma-falsch-gelesen'], [dz(gr * 10 + mehr * 1000, 1000), 'masszahlen-addiert'], [gr + mehr, 'umrechnungsrichtung']]),
        h1('Wandle die Körpergröße zuerst in Zentimeter um. Rechne dann und schreibe das Ergebnis wieder mit Komma.'), { einheit: 'm', nachweis: [`${dz(gr, 100, 2)} m + ${mehr} cm = ${lsg} m`] }); },
  ]);
}
