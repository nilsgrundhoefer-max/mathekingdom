// Aufgaben zu 6.4.5 „Umwandeln durch Erweitern und Kürzen“ (Lernziele U1, U2) nach ADR 0015 und ADR 0047.
// U1: Bruch durch Erweitern auf 10, 100 oder 1000 als Dezimalzahl. U2: Dezimalzahl als vollständig gekürzter Bruch.
// Nenner (Grilling mit Nils, 2026-11-25): F 2, 4, 5, 10, 20, 25, G dazu 8 und 50, M dazu 40, 125, 250, E „geht nicht durch Erweitern“.

import { sechs, auswahl, luecken, zuordnen, ordnen, bruch as bruch0, dezimal, Z, h1, h2, h3 } from '../werkzeug.mjs';
import { br, opt, zz, wahl, mische, kind, T, dfe, URTEIL, ggt, kz, stufenzahl, hundert, streifen10, dezimalText } from './6-4-dezimal.mjs';

const U1 = '6.4.5-U1', U2 = '6.4.5-U2';
// Erweitern oder Kürzen als Nachweis: von z⁄n mit k.
const UM = (z, n, mit, wie, gesucht = true) => ({ art: 'umformen', von: br(z, n), nach: wie === 'erweitern' ? br(z * mit, n * mit) : br(z / mit, n / mit), mit, wie, ...(gesucht ? { gesucht: true } : {}) });
// z⁄n mit kleinster Stufenzahl 10^k: Erweiterungszahl und Zähler.
const auf10 = (z, n) => { const k = stufenzahl(n), f = 10 ** k / n; return { k, f, zz: z * f, N: 10 ** k, d: T(z * f, k) }; };
// Bruch zu einer Dezimalzahl (z · 10^−k), vollständig gekürzt.
const kurz = (z, k) => { const [a, c] = kz([z, 10 ** k]); return { a, c, g: ggt(z, 10 ** k), b: br(a, c) }; };
const richtigZuerst = (liste) => liste.map((o) => (o.richtig ? opt(o.text, true) : o));
const nichtAbbrechend = [3, 6, 7, 9, 11, 12, 15];
// Ein nicht vollständig gekürzter Bruch ist kein typischer Fehler: Die App meldet ihn selbst (gekuerzt, ADR 0037).
const wertVon = (t) => { const x = String(t).match(/^(?:(\d+)\u202f)?(\d+)\u2044(\d+)$/); return x ? (Number(x[1] ?? 0) * Number(x[3]) + Number(x[2])) / Number(x[3]) : NaN; };
const bruch = (text, loesung, fehler, ...rest) => bruch0(text, loesung, fehler.filter(([w]) => Math.abs(wertVon(w) - wertVon(loesung)) > 1e-12), ...rest);

export function umwandeln6() {
  // ================= U1: Bruch → Dezimalzahl durch Erweitern =================
  const tF = h3('Erweitere den Bruch auf den Nenner 10 oder 100.', '1⁄4 = 25⁄100 = 0,25. Mit 25 erweitert.', 'Frage dich: Mit welcher Zahl wird der Nenner zu 10 oder 100?');
  sechs(U1, 'F', [
    () => { const [z, n] = wahl([[1, 4], [3, 4], [1, 20], [3, 20], [7, 20], [1, 25], [2, 25], [9, 25], [11, 20], [4, 25]]), e = auf10(z, n);
      return luecken(Z(`Im Hunderterfeld sind ${br(z, n)} gefärbt.`, 'Erweitere auf Hundertstel und schreibe als Dezimalzahl.', `${br(z, n)} = {{a}}⁄100 = {{b}}`),
        { a: [e.zz, dfe(e.zz, [[z * 10, 'erweitern-nur-ein-teil']])], b: [e.d, dfe(e.d, [[T(e.zz, 1), 'dezimal-stelle'], [`${z},${n}`, 'bruch-als-komma']])] }, tF,
        { bild: hundert(e.zz), nachweis: [UM(z, n, e.f, 'erweitern'), `${br(e.zz, 100)} = ${e.d}`] }); },
    () => { const [z, n] = wahl([[1, 2], [1, 5], [2, 5], [3, 5], [4, 5]]), e = auf10(z, n);
      return dezimal(Z(`Der Streifen zeigt ${br(z, n)}.`, 'Schreibe den Bruch als Dezimalzahl.'), e.d, dfe(e.d, [[`${z},${n}`, 'bruch-als-komma'], [T(e.zz, 2), 'dezimal-stelle']]), tF,
        { bild: streifen10(e.zz), nachweis: [UM(z, n, e.f, 'erweitern'), `${br(e.zz, 10)} = ${e.d}`] }); },
    () => { const z = zz(1, 4), n = 5, e = auf10(z, n);
      return luecken(Z(`Erweitere ${br(z, n)} auf Zehntel.`, `${br(z, n)} = {{a}}⁄10 = {{b}}`), { a: [e.zz, dfe(e.zz, [[z + 5, 'erweitern-addiert']])], b: [e.d, dfe(e.d, [[`${z},${n}`, 'bruch-als-komma']])] },
        h3('Der Nenner 5 wird mit 2 zu 10.', '3⁄5 = 6⁄10 = 0,6.', 'Nimm Zähler und Nenner mit 2 mal.'), { bild: streifen10(e.zz), nachweis: [UM(z, n, 2, 'erweitern'), `${br(e.zz, 10)} = ${e.d}`] }); },
    () => { const [z, n] = wahl([[1, 4], [3, 4], [3, 20], [7, 25], [13, 20], [6, 25]]), e = auf10(z, n);
      return auswahl(Z(`Kreuze die Dezimalzahl zu ${br(z, n)} an.`), [opt(e.d, true), opt(`${z},${n}`, false, 'bruch-als-komma'), opt(T(e.zz, 1), false, 'dezimal-stelle')], tF,
        { bild: hundert(e.zz), nachweis: [UM(z, n, e.f, 'erweitern'), `${br(e.zz, 100)} = ${e.d}`, { art: 'wert', wert: e.d }] }); },
    () => { const paare = mische([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [1, 20], [1, 25]]).slice(0, 3);
      return zuordnen(Z('Ordne jedem Bruch seine Dezimalzahl zu.', 'Die Tabelle hilft beim Erweitern.'), paare.map(([z, n]) => [br(z, n), auf10(z, n).d]), tF,
        { daten: { kopf: ['Nenner', 'erweitern mit', 'neuer Nenner'], zeilen: [...new Set(paare.map(([, n]) => n))].map((n) => [String(n), String(auf10(1, n).f), String(auf10(1, n).N)]) }, nachweis: [{ art: 'paare' }] }); },
    () => { const [z, n] = wahl([[1, 4], [3, 4], [1, 2], [1, 5], [3, 5]]), e = auf10(z, n), d = T(e.zz * (e.k === 1 ? 10 : 1), 2, 2);
      return dezimal(Z(`Lea hat ${br(z, n)} €.`, 'Schreibe den Betrag als Dezimalzahl in Euro.'), d, dfe(d, [[`${z},${n}`, 'bruch-als-komma']]), h3('1 € sind 100 ct.', '1⁄4 € = 25⁄100 € = 0,25 €.', 'Erweitere auf Hundertstel.'),
        { einheit: '€', bild: hundert(e.zz * (e.k === 1 ? 10 : 1)), nachweis: [UM(z, n, 100 / n, 'erweitern'), `${br(z * (100 / n), 100)} € = ${d} €`] }); },
  ]);
  const tG = h3('Ist der Nenner 8, erweiterst du auf 1000. Bei 50 auf 100.', '3⁄8 = 375⁄1000 = 0,375. Mit 125 erweitert.', 'Teile 1000 oder 100 durch den Nenner. Das ist die Erweiterungszahl.');
  sechs(U1, 'G', [
    () => { const z = wahl([1, 3, 5, 7]), e = auf10(z, 8);
      return luecken(Z(`Erweitere ${br(z, 8)} auf Tausendstel.`, `${br(z, 8)} = {{a}}⁄1000 = {{b}}`), { a: [e.zz, dfe(e.zz, [[z * 100, 'erweitern-nur-ein-teil']])], b: [e.d, dfe(e.d, [[`${z},8`, 'bruch-als-komma'], [T(e.zz, 2), 'dezimal-stelle']])] }, tG,
        { daten: { kopf: ['Nenner', 'erweitern mit', 'neuer Nenner'], zeilen: [['8', '125', '1000']] }, nachweis: [UM(z, 8, 125, 'erweitern'), `${br(e.zz, 1000)} = ${e.d}`] }); },
    () => { const z = zz(1, 49), e = auf10(z, 50);
      if (ggt(z, 50) !== 1) return null;
      return dezimal(Z(`Schreibe ${br(z, 50)} als Dezimalzahl.`), e.d, dfe(e.d, [[T(z, 2), 'erweitern-nur-ein-teil'], [`${z},5`, 'bruch-als-komma']]), tG, { nachweis: [UM(z, 50, 2, 'erweitern'), `${br(e.zz, 100)} = ${e.d}`] }); },
    () => { const z = wahl([1, 3, 5, 7]), e = auf10(z, 8), a = wahl([1, 3, 5, 7].filter((x) => x !== z));
      return auswahl(Z(`Die Zahl ist ${e.d}.`, 'Kreuze den passenden Bruch an.'), [opt(br(z, 8), true), opt(br(a, 8), false, 'dezimal-stelle'), opt(br(e.zz, 100), false, 'dezimal-stelle')], tG,
        { nachweis: [UM(z, 8, 125, 'erweitern'), `${br(e.zz, 1000)} = ${e.d}`, { art: 'wert', wert: e.d }] }); },
    () => { const g = zz(1, 5), [z, n] = wahl([[1, 4], [3, 4], [1, 8], [3, 8], [2, 5], [7, 20]]), e = auf10(z, n), lsg = T(g * e.N + e.zz, e.k);
      return dezimal(Z(`Schreibe die gemischte Zahl ${br(z, n, g)} als Dezimalzahl.`), lsg, dfe(lsg, [[`${g},${z}${n}`, 'bruch-als-komma'], [e.d, 'bruch-ganzes-teil']]), tG,
        { nachweis: [UM(z, n, e.f, 'erweitern'), `${br(z, n, g)} = ${g} + ${br(e.zz, e.N)} = ${lsg}`] }); },
    () => { const [z, n] = wahl([[1, 4], [3, 4], [1, 2], [1, 5], [3, 20]]), e = auf10(z, n), falsch = `0,${z}`, kn = kind();
      if (falsch === e.d) return null;
      return auswahl(Z(`${kn} schreibt: ${br(z, n)} = ${falsch}`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${br(e.zz, e.N)} = ${e.d}.`, true), opt('Stimmt.', false, 'bruch-als-komma'), opt(`Stimmt, denn ${br(z, 10)} = ${falsch}.`, false, 'bruch-als-komma')], tG,
        { bild: hundert(e.zz * (e.k === 1 ? 10 : 1)), nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const z = wahl([1, 3, 5, 7]), e = auf10(z, 8), [gross, klein] = wahl([['kg', 'g'], ['km', 'm'], ['l', 'ml']]);
      return luecken(Z(`Schreibe ${br(z, 8)} ${gross} mit Komma und in ${klein}.`, `${br(z, 8)} ${gross} = {{a}} ${gross} = {{b}} ${klein}`), { a: [e.d, dfe(e.d, [[`${z},8`, 'bruch-als-komma']])], b: [e.zz, dfe(e.zz, [[z * 100, 'erweitern-nur-ein-teil']])] }, tG,
        { daten: { kopf: ['Einheit', 'Umrechnung'], zeilen: [[`1 ${gross}`, `1000 ${klein}`]] }, nachweis: [UM(z, 8, 125, 'erweitern'), `${br(e.zz, 1000)} ${gross} = ${e.d} ${gross}`, `${e.d} ${gross} = ${e.zz} ${klein}`] }); },
  ]);
  const tM = h2('Suche die Zahl, mit der der Nenner zu 10, 100 oder 1000 wird: 40 · 25 = 1000, 125 · 8 = 1000, 250 · 4 = 1000.', 'Lässt sich der Bruch kürzen, kürze zuerst. Dann ist das Erweitern oft leichter.');
  sechs(U1, 'M', [
    () => { const z = wahl([1, 3, 7, 9, 11, 13, 17, 19, 21, 23]), e = auf10(z, 40);
      return luecken(Z(`Erweitere ${br(z, 40)} auf Tausendstel.`, `${br(z, 40)} = {{a}}⁄1000 = {{b}}`), { a: [e.zz, dfe(e.zz, [[z * 10, 'erweitern-nur-ein-teil']])], b: [e.d, dfe(e.d, [[T(z, 2), 'erweitern-nur-ein-teil']])] }, tM,
        { nachweis: [UM(z, 40, 25, 'erweitern'), `${br(e.zz, 1000)} = ${e.d}`] }); },
    () => { const z = wahl([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14]), e = auf10(z, 125);
      return dezimal(Z(`Schreibe ${br(z, 125)} als Dezimalzahl.`), e.d, dfe(e.d, [[T(z, 3), 'erweitern-nur-ein-teil'], [`${z},125`, 'bruch-als-komma']]), tM, { nachweis: [UM(z, 125, 8, 'erweitern'), `${br(e.zz, 1000)} = ${e.d}`] }); },
    () => { const z = wahl([1, 3, 7, 9, 11, 13, 17, 19, 21, 23, 27, 29]), e = auf10(z, 250);
      return dezimal(Z(`Schreibe ${br(z, 250)} als Dezimalzahl.`), e.d, dfe(e.d, [[T(z, 3), 'erweitern-nur-ein-teil'], [T(z * 4, 2), 'dezimal-stelle']]), tM, { nachweis: [UM(z, 250, 4, 'erweitern'), `${br(e.zz, 1000)} = ${e.d}`] }); },
    () => { const liste = mische([[3, 8], [2, 5], [7, 20], [9, 25], [3, 4], [11, 40], [1, 8]]).slice(0, 4), karten = liste.map(([z, n], i) => (i % 2 ? auf10(z, n).d : br(z, n)));
      const werte = liste.map(([z, n]) => z / n);
      if (new Set(werte).size !== 4) return null;
      const sortiert = karten.map((t, i) => [t, werte[i]]).sort((x, y) => x[1] - y[1]).map(([t]) => t);
      return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der kleinsten Zahl.'), sortiert, tM, { nachweis: [{ art: 'ordnung', richtung: 'auf' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-als-komma' }); },
    () => { const [z, n, k] = wahl([[9, 12, 3], [6, 15, 3], [12, 16, 4], [14, 20, 2], [15, 20, 5], [10, 16, 2], [9, 15, 3]]), [a, c] = [z / k, n / k], e = auf10(a, c);
      return luecken(Z(`Kürze ${br(z, n)} zuerst. Erweitere dann.`, `${br(z, n)} = {{a}}⁄${c} = {{b}}`), { a: [a, dfe(a, [[z, 'erweitern-nur-ein-teil']])], b: [e.d, dfe(e.d, [[`${z},${n}`, 'bruch-als-komma']])] }, tM,
        { nachweis: [UM(z, n, k, 'kuerzen', false), UM(a, c, e.f, 'erweitern'), `${br(a * e.f, e.N)} = ${e.d}`] }); },
    () => { const [z, n] = wahl([[1, 8], [3, 8], [3, 40], [7, 40], [1, 125], [3, 250]]), e = auf10(z, n), falsch = `0,${z}`, kn = kind();
      return auswahl(Z(`${kn} schreibt: ${br(z, n)} = ${falsch}`, `${kn} meint, der Zähler steht nach dem Komma.`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${br(z, n)} = ${br(e.zz, e.N)} = ${e.d}.`, true), opt('Stimmt.', false, 'bruch-als-komma'), opt(`Falsch. Es gilt ${br(z, n)} = ${z},${n}.`, false, 'bruch-als-komma'), opt(`Stimmt, denn ${br(z, 10)} = ${falsch}.`, false, 'bruch-als-komma')], tM,
        { nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
  ]);
  sechs(U1, 'E', [
    () => { const ja = mische([[3, 8], [7, 20], [9, 40], [11, 25], [13, 50], [7, 125]]).slice(0, zz(2, 3)), nein = mische(nichtAbbrechend.map((n) => [wahl([1, 2, 4, 5].filter((z) => ggt(z, n) === 1 && z < n)), n])).slice(0, 5 - ja.length);
      return auswahl(Z('Kreuze alle Brüche an, die sich auf den Nenner 1000 erweitern lassen.'), mische([...ja.map(([z, n]) => opt(br(z, n), true)), ...nein.map(([z, n]) => opt(br(z, n), false, 'bruch-als-komma'))]),
        h1('Ein Bruch lässt sich auf 1000 erweitern, wenn sein Nenner ein Teiler von 1000 ist. 1000 = 2 · 2 · 2 · 5 · 5 · 5.'), { mehrfach: true, nachweis: [{ art: 'erweiterbar', nenner: 1000 }] }); },
    () => { const [n, z] = wahl([[25, zz(1, 24)], [20, zz(1, 19)], [50, zz(1, 49)], [8, wahl([1, 3, 5, 7])]]), e = auf10(z, n);
      if (ggt(z, n) !== 1) return null;
      return luecken(Z('Ein Bruch wurde als Dezimalzahl geschrieben.', `Ergänze den Zähler: {{a}}⁄${n} = ${e.d}`), { a: [z, dfe(z, [[e.zz, 'erweitern-nur-ein-teil']])] }, h1(`Schreibe ${e.d} als Bruch mit dem Nenner ${e.N}. Kürze dann auf den Nenner ${n}.`),
        { nachweis: [`${e.d} = ${br(e.zz, e.N)}`, UM(e.zz, e.N, e.f, 'kuerzen', false)] }); },
    () => { const z = wahl([1, 3, 7, 9, 11, 13, 17, 19]), n = 40, e = auf10(z, n), g = zz(1, 4), lsg = T(g * e.N + e.zz, e.k);
      return dezimal(Z(`Schreibe ${br(z, n, g)} als Dezimalzahl.`), lsg, dfe(lsg, [[e.d, 'bruch-ganzes-teil'], [`${g},${z}`, 'bruch-als-komma']]), h1('Die Ganzen stehen vor dem Komma. Erweitere nur den Bruchteil.'),
        { nachweis: [UM(z, n, e.f, 'erweitern'), `${br(z, n, g)} = ${g} + ${br(e.zz, e.N)} = ${lsg}`] }); },
    () => { const [z, n, falsch] = wahl([[1, 3, '0,3'], [2, 3, '0,6'], [1, 6, '0,6'], [1, 9, '0,9'], [1, 7, '0,7']]), kn = kind();
      return auswahl(Z(`${kn} sagt: „${br(z, n)} = ${falsch}“`, 'Beurteile die Aussage und begründe sie.'), [opt(`Falsch. Es gilt ${n} · ${falsch} = ${T(n * Number(falsch.slice(2)), 1)}.`, true), opt('Stimmt.', false, 'drittel-als-zehntel'), opt(`Stimmt, denn ${br(Number(falsch.slice(2)), 10)} = ${falsch}.`, false, 'drittel-als-zehntel')],
        h1(`Prüfe: Nimm die Dezimalzahl mit ${n} mal. Kommt ${z} heraus?`), { nachweis: [URTEIL(false, `${br(z, n)} = ${falsch}`)] }); },
    () => { const paare = mische([[3, 8], [7, 40], [9, 125], [11, 250], [13, 20], [17, 50]]).slice(0, 4);
      return zuordnen(Z('Ordne jedem Bruch seine Dezimalzahl zu.'), paare.map(([z, n]) => [br(z, n), auf10(z, n).d]), h1('Teile 1000 durch den Nenner. So findest du die Erweiterungszahl.'), { nachweis: [{ art: 'paare' }] }); },
    () => { const ja = mische([[6, 15], [9, 24], [21, 28], [12, 30], [18, 24]]).slice(0, 2), nein = mische([[5, 12], [4, 18], [10, 21], [8, 14]]).slice(0, 3);
      return auswahl(Z('Kreuze alle Brüche an, die sich nach dem Kürzen auf den Nenner 1000 erweitern lassen.'), mische([...ja.map(([z, n]) => opt(br(z, n), true)), ...nein.map(([z, n]) => opt(br(z, n), false, 'kuerzen-nicht-vollstaendig'))]),
        h1('Kürze jeden Bruch vollständig. Prüfe dann, ob der Nenner ein Teiler von 1000 ist.'), { mehrfach: true, nachweis: [{ art: 'erweiterbar', nenner: 1000, gekuerzt: true }] }); },
  ]);

  // ================= U2: Dezimalzahl → vollständig gekürzter Bruch =================
  const kF = h3('Schreibe die Dezimalzahl als Bruch mit dem Nenner 10 oder 100. Kürze dann so weit wie möglich.', '0,25 = 25⁄100 = 1⁄4. Mit 25 gekürzt.', 'Suche eine Zahl, durch die du Zähler und Nenner teilen kannst.');
  sechs(U2, 'F', [
    () => { const k = wahl([2, 4, 6, 8, 5]), b = kurz(k, 1);
      return bruch(Z(`Der Streifen zeigt ${T(k, 1)}.`, `Schreibe ${T(k, 1)} als Bruch.`, 'Kürze so weit wie möglich.'), b.b, [[br(k, 10), 'kuerzen-nicht-vollstaendig'], [br(k, 100), 'dezimal-stelle']].filter(([w]) => w !== b.b), kF,
        { gekuerzt: true, bild: streifen10(k), nachweis: [`${T(k, 1)} = ${br(k, 10)}`, UM(k, 10, b.g, 'kuerzen')] }); },
    () => { const k = wahl([25, 75, 50, 20, 40, 60, 80]), b = kurz(k, 2);
      return bruch(Z(`Im Hunderterfeld sind ${T(k, 2)} gefärbt.`, 'Schreibe die Zahl als Bruch.', 'Kürze so weit wie möglich.'), b.b, [[br(k, 100), 'kuerzen-nicht-vollstaendig'], [br(k / 10, 100), 'dezimal-stelle']].filter(([w]) => w !== b.b), kF,
        { gekuerzt: true, bild: hundert(k), nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, b.g, 'kuerzen')] }); },
    () => { const k = wahl([2, 4, 6, 8]), b = kurz(k, 1);
      return luecken(Z(`Schreibe ${T(k, 1)} als Bruch und kürze.`, `${T(k, 1)} = {{a}}⁄10 = {{b}}⁄5`), { a: [k, dfe(k, [[k * 10, 'dezimal-stelle']])], b: [b.a, dfe(b.a, [[k, 'erweitern-nur-ein-teil']])] }, kF,
        { bild: streifen10(k), nachweis: [`${T(k, 1)} = ${br(k, 10)}`, UM(k, 10, 2, 'kuerzen', false)] }); },
    () => { const k = wahl([25, 75, 45, 35, 65, 15, 55, 85, 95]), b = kurz(k, 2);
      return auswahl(Z(`Kreuze den Bruch zu ${T(k, 2)} an.`, 'Er soll so weit wie möglich gekürzt sein.'), [opt(b.b, true), opt(br(k, 10), false, 'dezimal-stelle'), opt(br(Math.floor(k / 10), 10), false, 'runden-abschneiden')], kF,
        { bild: hundert(k), nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, b.g, 'kuerzen'), { art: 'wert', wert: b.b }] }); },
    () => { const k = wahl([25, 75, 50, 20, 10]), b = kurz(k, 2);
      return bruch(Z(`Tim hat ${T(k, 2, 2)} €.`, 'Gib den Teil von 1 € als Bruch an.', 'Kürze so weit wie möglich.'), b.b, [[br(k, 100), 'kuerzen-nicht-vollstaendig'], [br(k, 10), 'dezimal-stelle']].filter(([w]) => w !== b.b),
        h3('1 € sind 100 ct.', '0,25 € = 25⁄100 € = 1⁄4 €.', 'Schreibe die Cent als Hundertstel. Kürze dann.'), { gekuerzt: true, einheit: '€', bild: hundert(k), nachweis: [{ wert: '1 €', grund: 'das Ganze' }, `${T(k, 2, 2)} € = ${br(k, 100)} €`, UM(k, 100, b.g, 'kuerzen'), `${br(k, 100)} € = ${b.b} €`] }); },
    () => { const k = wahl([5, 2, 4, 6, 8]), b = kurz(k, 1);
      return bruch(Z(`Ein Band ist ${T(k, 1)} m lang.`, 'Gib die Länge als Bruch in Metern an.', 'Kürze so weit wie möglich.'), b.b, [[br(k, 10), 'kuerzen-nicht-vollstaendig'], [br(1, k), 'bruch-vertauscht']].filter(([w]) => w !== b.b && w !== br(1, 1)), kF,
        { gekuerzt: true, einheit: 'm', bild: streifen10(k), nachweis: [`${T(k, 1)} m = ${br(k, 10)} m`, UM(k, 10, b.g, 'kuerzen'), `${br(k, 10)} m = ${b.b} m`] }); },
  ]);
  const kG = h3('Drei Stellen nach dem Komma sind Tausendstel. Der Nenner ist dann 1000.', '0,125 = 125⁄1000 = 1⁄8. Mit 125 gekürzt.', 'Kürze in mehreren Schritten, bis es nicht mehr geht.');
  sechs(U2, 'G', [
    () => { const z = wahl([1, 3, 5, 7]), k = z * 125, b = kurz(k, 3);
      return bruch(Z(`Schreibe ${T(k, 3)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 1000), 'kuerzen-nicht-vollstaendig'], [br(k / 5, 200), 'kuerzen-nicht-vollstaendig']], kG, { gekuerzt: true, nachweis: [`${T(k, 3)} = ${br(k, 1000)}`, UM(k, 1000, 125, 'kuerzen')] }); },
    () => { const k = wahl([35, 45, 15, 65, 85, 55]), b = kurz(k, 2);
      return bruch(Z(`Schreibe ${T(k, 2)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 100), 'kuerzen-nicht-vollstaendig'], [br(k, 10), 'dezimal-stelle']], kG, { gekuerzt: true, bild: hundert(k), nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, 5, 'kuerzen')] }); },
    () => { const k = wahl([6, 12, 14, 18, 22, 24, 26, 28]), b = kurz(k, 2);
      return bruch(Z(`Schreibe ${T(k, 2)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 100), 'kuerzen-nicht-vollstaendig'], [br(k / 2, 100), 'erweitern-nur-ein-teil']], kG, { gekuerzt: true, bild: hundert(k), nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, b.g, 'kuerzen')] }); },
    () => { const k = wahl([6, 2, 4, 8, 12, 14, 16, 18]), b = kurz(k, 2);
      return bruch(Z(`Schreibe ${T(k, 2)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 100), 'kuerzen-nicht-vollstaendig'], [br(k, 10), 'dezimal-stelle']], kG, { gekuerzt: true, bild: hundert(k), nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, b.g, 'kuerzen')] }); },
    () => { const g = zz(1, 5), k = wahl([25, 75, 5, 2, 4, 6, 8]), s = k >= 10 ? 2 : 1, b = kurz(k, s), t = `${g},${s === 2 ? String(k).padStart(2, '0') : k}`;
      return bruch(Z(`Schreibe ${t} als gemischte Zahl.`, 'Kürze den Bruch vollständig.'), br(b.a, b.c, g), [[br(k, 10 ** s, g), 'kuerzen-nicht-vollstaendig'], [br(g * 10 ** s + k, 10 ** s), 'kuerzen-nicht-vollstaendig']], kG,
        { gekuerzt: true, nachweis: [`${t} = ${br(k, 10 ** s, g)} = ${g} + ${br(k, 10 ** s)}`, UM(k, 10 ** s, b.g, 'kuerzen'), `${br(k, 10 ** s, g)} = ${br(b.a, b.c, g)}`] }); },
    () => { const k = zz(1, 9), kn = kind(), falsch = br(k, 100);
      return auswahl(Z(`${kn} schreibt: ${T(k, 1)} = ${falsch}`, 'Beurteile die Aussage.'), [opt(`Falsch. Es gilt ${T(k, 1)} = ${br(k, 10)}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Stimmt, denn ${T(k, 2)} = ${falsch}.`, false, 'dezimal-stelle')], kG,
        { bild: streifen10(k), nachweis: [URTEIL(false, `${T(k, 1)} = ${falsch}`)] }); },
  ]);
  const kM = h2('Der Nenner ist 10, 100, 1000 oder 10000, je nach Anzahl der Stellen nach dem Komma. Kürze dann mit dem größten gemeinsamen Teiler.', 'Teiler von Zehnerpotenzen sind nur aus 2 und 5 gebaut. Probiere 2, 5, 4, 25, 8 oder 125.');
  sechs(U2, 'M', [
    () => { const [k, s] = wahl([[25, 3], [8, 3], [12, 3], [75, 3], [4, 3], [24, 3], [28, 3]]), b = kurz(k, s);
      return bruch(Z(`Schreibe ${T(k, s)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 1000), 'kuerzen-nicht-vollstaendig'], [br(k, 100), 'dezimal-stelle']], kM, { gekuerzt: true, nachweis: [`${T(k, s)} = ${br(k, 1000)}`, UM(k, 1000, b.g, 'kuerzen')] }); },
    () => { const z = wahl([7, 9, 11, 13, 17, 19, 21, 23]), k = z * 25, b = kurz(k, 3);
      return bruch(Z(`Schreibe ${T(k, 3)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 1000), 'kuerzen-nicht-vollstaendig'], [br(k / 5, 200), 'kuerzen-nicht-vollstaendig']], kM, { gekuerzt: true, nachweis: [`${T(k, 3)} = ${br(k, 1000)}`, UM(k, 1000, 25, 'kuerzen')] }); },
    () => { const g = zz(1, 3), z = wahl([8, 16, 24, 32, 48, 56]), b = kurz(z, 3), t = `${g},${String(z).padStart(3, '0')}`;
      return bruch(Z(`Schreibe ${t} als gemischte Zahl.`, 'Kürze vollständig.'), br(b.a, b.c, g), [[br(z, 1000, g), 'kuerzen-nicht-vollstaendig'], [br(b.a, b.c), 'bruch-ganzes-teil']], kM,
        { gekuerzt: true, nachweis: [`${t} = ${br(z, 1000, g)}`, UM(z, 1000, b.g, 'kuerzen'), `${br(z, 1000, g)} = ${br(b.a, b.c, g)}`] }); },
    () => { const k = wahl([45, 35, 65, 85, 15, 55, 95]), b = kurz(k, 2);
      return luecken(Z(`Schreibe ${T(k, 2)} als Bruch und kürze vollständig.`, `${T(k, 2)} = {{a}}⁄100 = {{b}}⁄20`), { a: [k, dfe(k, [[k * 10, 'dezimal-stelle']])], b: [b.a, dfe(b.a, [[Math.floor(k / 10), 'erweitern-nur-ein-teil']])] }, kM,
        { nachweis: [`${T(k, 2)} = ${br(k, 100)}`, UM(k, 100, 5, 'kuerzen', false)] }); },
    () => { const [k, gross] = wahl([[75, 'kg'], [25, 'kg'], [5, 'l'], [125, 'km'], [375, 'kg'], [875, 'l']]), s = String(k).length === 3 ? 3 : String(k).length === 2 ? 2 : 1, b = kurz(k, s);
      return bruch(Z(`Ein Paket wiegt oder fasst ${T(k, s)} ${gross}.`, `Gib die Größe als vollständig gekürzten Bruch in ${gross} an.`), b.b, [[br(k, 10 ** s), 'kuerzen-nicht-vollstaendig']], kM,
        { gekuerzt: true, einheit: gross, nachweis: [`${T(k, s)} ${gross} = ${br(k, 10 ** s)} ${gross}`, UM(k, 10 ** s, b.g, 'kuerzen'), `${br(k, 10 ** s)} ${gross} = ${b.b} ${gross}`] }); },
    () => { const k = wahl([24, 36, 48, 12, 28, 44, 56, 64]), kn = kind(), falsch = br(k / 2, 25), b = kurz(k, 2);
      return auswahl(Z(`${kn} rechnet: ${T(k, 2)} = ${br(k, 100)} = ${falsch}`, 'Beurteile die Rechnung.'), [opt(`Falsch. Es gilt ${T(k, 2)} = ${br(k / 4, 25)}.`, true), opt('Stimmt.', false, 'erweitern-nur-ein-teil'), opt(`Falsch. Es gilt ${T(k, 2)} = ${br(k, 10)}.`, false, 'dezimal-stelle'), opt(`Stimmt, denn ${br(k, 100)} = ${falsch}.`, false, 'erweitern-nur-ein-teil')], kM,
        { nachweis: [URTEIL(false, `${T(k, 2)} = ${falsch}`)] }); },
  ]);
  sechs(U2, 'E', [
    () => { const [z, n] = wahl([[7, 16], [3, 16], [5, 16], [9, 16], [11, 16]]), k = (z * 10000) / n, b = kurz(k, 4);
      return bruch(Z(`Schreibe ${T(k, 4)} als Bruch.`, 'Kürze vollständig.'), b.b, [[br(k, 10000), 'kuerzen-nicht-vollstaendig'], [br(k / 25, 400), 'kuerzen-nicht-vollstaendig']], h1('Vier Stellen nach dem Komma: Nenner 10000. Kürze zuerst mit 625 oder in kleineren Schritten.'),
        { gekuerzt: true, nachweis: [`${T(k, 4)} = ${br(k, 10000)}`, UM(k, 10000, b.g, 'kuerzen')] }); },
    () => { const [z, n] = wahl([[3, 25], [7, 25], [3, 20], [7, 20], [9, 20], [3, 50], [7, 50], [3, 8]]), e = auf10(z, n);
      return bruch(Z(`Gib den vollständig gekürzten Bruch mit dem Zähler ${z} an, der ${e.d} ist.`), br(z, n), [[br(e.zz, e.N), 'kuerzen-nicht-vollstaendig'], [br(z, e.N), 'erweitern-nur-ein-teil']], h1('Schreibe die Dezimalzahl als Zehnerbruch. Kürze, bis der Zähler passt.'),
        { gekuerzt: true, nachweis: [`${e.d} = ${br(e.zz, e.N)}`, UM(e.zz, e.N, e.f, 'kuerzen')] }); },
    () => { const g = zz(1, 5), z = wahl([1, 3, 5, 7]), k = z * 125, t = `${g},${k}`;
      return bruch(Z(`Schreibe ${t} als gemischte Zahl.`, 'Kürze vollständig.'), br(z, 8, g), [[br(k, 1000, g), 'kuerzen-nicht-vollstaendig'], [br(g * 8 + z, 8), 'bruch-ganzes-teil']], h1('Die Ganzen bleiben stehen. Kürze nur den Bruchteil.'),
        { gekuerzt: true, nachweis: [`${t} = ${br(k, 1000, g)}`, UM(k, 1000, 125, 'kuerzen'), `${br(k, 1000, g)} = ${br(z, 8, g)}`] }); },
    () => { const k = wahl([36, 12, 28, 44, 52, 68, 76, 84]), b = kurz(k, 2), kn = kind();
      const opts = mische([br(k, 100), br(k / 2, 50), b.b]);
      return auswahl(Z(`${kn} wandelt ${T(k, 2)} in einen Bruch um.`, 'Kreuze den vollständig gekürzten Bruch an.'), opts.map((t) => opt(t, t === b.b, t === b.b ? undefined : 'kuerzen-nicht-vollstaendig')),
        h1('Ein Bruch ist vollständig gekürzt, wenn Zähler und Nenner keinen gemeinsamen Teiler außer 1 haben.'), { nachweis: [{ art: 'gekuerztwahl' }] }); },
    () => { const liste = mische([[3, 10, 'd'], [3, 8, 'b'], [35, 100, 'd'], [7, 25, 'b'], [2, 5, 'b'], [33, 100, 'd']]).slice(0, 5), karten = liste.map(([z, n, a]) => (a === 'd' ? T(z * (100 / n), 2) : br(z, n)));
      const werte = liste.map(([z, n]) => z / n);
      if (new Set(werte).size !== 5) return null;
      return ordnen(Z('Ordne die Zahlen der Größe nach.', 'Beginne mit der größten Zahl.'), karten.map((t, i) => [t, werte[i]]).sort((x, y) => y[1] - x[1]).map(([t]) => t), h1('Wandle alle Zahlen in Dezimalzahlen mit drei Stellen um. Vergleiche dann.'),
        { nachweis: [{ art: 'ordnung', richtung: 'ab' }], umgekehrt: 'zeichen-verwechselt', sonst: 'bruch-als-komma' }); },
    () => { const k = wahl([5, 2, 4, 6, 8]), kn = kind(), falsch = kz([k, 10]), richtig = kz([k, 100]);
      return auswahl(Z(`${kn} rechnet: ${T(k, 2)} = ${br(k, 10)} = ${br(...falsch)}`, 'Finde den Fehler.'), [opt(`Falsch. Es gilt ${T(k, 2)} = ${br(k, 100)} = ${br(...richtig)}.`, true), opt('Stimmt.', false, 'dezimal-stelle'), opt(`Falsch. Es gilt ${T(k, 2)} = ${br(k, 1000)}.`, false, 'dezimal-stelle')],
        h1('Zähle die Stellen nach dem Komma. So viele Nullen hat der Nenner.'), { nachweis: [URTEIL(false, `${T(k, 2)} = ${br(...falsch)}`)] }); },
  ]);
}
