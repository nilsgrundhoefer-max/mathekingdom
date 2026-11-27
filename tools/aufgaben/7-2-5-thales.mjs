// Aufgaben zu 7.2.5 „Der Satz des Thales“ (Lernziele T1 und T2) und zum Purpur-Abstecher 7.2.X1 „Kreis und Tangenten“ (ADR 0044).
// Grilling mit Nils (2026-11-25): Die Lerneinheit trägt im Buch ein Sternchen und im Bildungsplan auf G [MSA].
// Sie hat Aufgaben auf allen Stufen und ist Pflicht ab M. Thales als „Satz“ ab M, auf F und G heißt es „Thaleskreis“.
// E: Thales begründen. Tangenten (3.2.3 (12)) nur E. Heftaufgaben mit Kontrollwert in T2 je 2 von 6 auf G bis E.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, suche, mische, figur, plus, dir, drehe, cm, WERT, GESUCHT, NAME, H, grad, zahl, auswahl, opt, luecken, lk, Z, sach, teilWahl, ordnen, FIG, R, winkelFuer, drehFuer, kind, gitterBild, gitterPunkte, gitterLinie, gitterKreis, GT, PT, LN } from './7-2-figur.mjs';

const T1 = '7.2.5-T1', T2 = '7.2.5-T2', X1 = '7.2.X1-T1';
// Thaleskreis: Durchmesser AB (Radius r), C auf dem Kreis mit α bei A. Dann ist γ = 90° und β = 90° − α.
function thales(alpha, dreh = 0, { r = 3, zeige = {}, mitM = false, extra = {} } = {}) {
  const M = [0, 0], A = drehe([-r, 0], dreh), B = drehe([r, 0], dreh), C = drehe(plus(M, dir(2 * alpha), r), dreh);
  const nach = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
  return figur({ punkte: { A, B, C, M, ...(extra.punkte ?? {}) }, versteckt: [...(mitM ? [] : ['M']), ...(extra.versteckt ?? [])],
    linien: [['A', 'B'], ['B', 'C'], ['C', 'A'], ...(extra.linien ?? [])], kreise: [['M', r, 'hilfs']],
    winkel: [...Object.entries(zeige).map(([p, o]) => [p, nach[p][0], nach[p][1], o]), ...(extra.winkel ?? [])] });
}
const alphaT = (n) => winkelFuer(n, 25, 65);
const hThales = (n) => H(n, 'Liegt C auf dem Halbkreis über AB, ist der Winkel bei C ein rechter Winkel.', 'Dann ist γ = 90°. Die beiden anderen Winkel sind zusammen 90°.', 'Der rechte Winkel liegt an der Ecke auf dem Kreis.');

// ---------- T1: Satz des Thales erkennen und anwenden ----------
function t1() {
  const rest = (n, text, a, gesucht) => { const b = 90 - a, zeige = gesucht === 'β' ? { A: WERT(a), C: WERT(90), B: GESUCHT('β', b) } : { B: WERT(b), C: WERT(90), A: GESUCHT('α', a) };
    return grad(text, gesucht === 'β' ? b : a, [[180 - (gesucht === 'β' ? a : b), 'thales-durchmesser'], [gesucht === 'β' ? a : b, 'basiswinkel-falsch']], H(n, 'γ ist 90°. Dann sind α und β zusammen 90°.', 'α = 30°: β = 90° − 30° = 60°.', `Rechne 180° − 90° − ${gesucht === 'β' ? a : b}°.`),
      { bild: thales(a, drehFuer(n), { zeige }), nachweis: [R(`180° − 90° − ${gesucht === 'β' ? a : b}° = ${gesucht === 'β' ? b : a}°`), FIG(gesucht)] }); };
  sechs(T1, 'F', [
    () => { const a = 10 * zz(3, 6);
      return grad(Z('C liegt auf dem Thaleskreis über AB.', 'Gib den Winkel γ an.'), 90, [[180, 'thales-durchmesser'], [a, 'thales-durchmesser']], hThales('F'), { bild: thales(a, 0, { zeige: { C: GESUCHT('γ', 90) } }), nachweis: [{ art: 'thales' }, FIG('γ')] }); },
    () => rest('F', Z('C liegt auf dem Thaleskreis.', 'Darum ist γ = 90°.', 'Berechne β.'), 10 * zz(3, 6), 'β'),
    () => { const a = 10 * zz(3, 6);
      return auswahl(Z('C liegt auf dem Thaleskreis über AB.', 'An welcher Ecke ist der rechte Winkel?', 'Kreuze an.'), ['A', 'B', 'C'].map((x) => opt(x, x === 'C', x === 'C' ? undefined : 'thales-durchmesser')), hThales('F'),
        { bild: thales(a, 0), nachweis: [{ art: 'thales' }] }); },
    () => rest('F', Z('C liegt auf dem Thaleskreis.', 'Darum ist γ = 90°.', 'Berechne α.'), 10 * zz(3, 6), 'α'),
    () => { const a = 10 * zz(3, 6);
      return luecken(Z('C liegt auf dem Thaleskreis.', 'Berechne γ und β.', 'γ = {{g}}°', 'β = {{b}}°'), { g: lk(90, [[180, 'thales-durchmesser']]), b: lk(90 - a, [[180 - a, 'thales-durchmesser']]) }, hThales('F'),
        { bild: thales(a, 0, { zeige: { A: WERT(a), C: GESUCHT('γ', 90), B: GESUCHT('β', 90 - a) } }), nachweis: [{ art: 'thales' }, R(`180° − 90° − ${a}° = ${90 - a}°`), FIG('γ', { luecke: 'g' }), FIG('β', { luecke: 'b' })] }); },
    () => { const a = 10 * zz(3, 6);
      return grad(Z('Ein Fenster hat oben einen Halbkreis.', 'Eine Leiste geht von A über C nach B.', 'C liegt auf dem Halbkreis.', 'Gib den Winkel bei C an.'), 90, [[180, 'thales-durchmesser']], hThales('F'),
        { bild: thales(a, 0, { zeige: { C: GESUCHT('γ', 90) } }), nachweis: [{ art: 'thales' }, FIG('γ')] }); },
  ]);
  sechs(T1, 'G', [
    () => rest('G', Z('C liegt auf dem Thaleskreis über AB.', 'Berechne β.'), alphaT('G'), 'β'),
    () => rest('G', Z('C liegt auf dem Thaleskreis über AB.', 'Berechne α.'), alphaT('G'), 'α'),
    () => { const a = alphaT('G'), r = 3, dreh = drehFuer('G'), P = drehe(plus([0, 0], dir(110), r), dreh), Q = drehe(plus([0, 0], dir(70), 2), dreh), S = drehe(plus([0, 0], dir(40), 3.7), dreh);
      return auswahl(Z('Welche Punkte bilden mit A und B einen rechten Winkel?', 'Kreuze alle an.'), [opt('C', true), opt('P', true), opt('Q', false, 'thales-durchmesser'), opt('S', false, 'thales-durchmesser')], hThales('G'),
        { mehrfach: true, bild: thales(a, dreh, { mitM: true, extra: { punkte: { P, Q, S } } }), nachweis: [{ art: 'thales', aufKreis: ['C', 'P'], nicht: ['Q', 'S'] }] }); },
    () => rest('G', Z('Das Dreieck hat seine Ecke C auf dem Thaleskreis.', 'Berechne β.'), alphaT('G'), 'β'),
    () => { const a = alphaT('G'), b = 90 - a;
      return luecken(Z('C liegt auf dem Thaleskreis über AB.', 'Berechne die fehlenden Winkel.', 'γ = {{g}}°', 'β = {{b}}°'), { g: lk(90, [[180, 'thales-durchmesser']]), b: lk(b, [[180 - a, 'thales-durchmesser']]) }, hThales('G'),
        { bild: thales(a, drehFuer('G'), { zeige: { A: WERT(a), C: GESUCHT('γ', 90), B: GESUCHT('β', b) } }), nachweis: [{ art: 'thales' }, R(`180° − 90° − ${a}° = ${b}°`), FIG('γ', { luecke: 'g' }), FIG('β', { luecke: 'b' })] }); },
    () => { const a = alphaT('G');
      return auswahl(Z('C liegt auf dem Thaleskreis über AB.', 'Warum ist γ ein rechter Winkel?', 'Kreuze die richtige Begründung an.'),
        [opt('AB ist ein Durchmesser, und C liegt auf dem Kreis.', true), opt('Jedes Dreieck hat einen rechten Winkel.', false, 'dreieck-art'), opt('C liegt genau über dem Mittelpunkt des Kreises.', false, 'thales-durchmesser')],
        hThales('G'), { bild: thales(a, drehFuer('G'), { mitM: true }), nachweis: [{ art: 'thales' }, { art: 'urteil', stimmt: true }] }); },
  ]);
  sechs(T1, 'M', [
    () => rest('M', 'C liegt auf dem Thaleskreis über AB. Berechne den fehlenden Winkel.', alphaT('M'), wahl(['α', 'β'])),
    () => { const a = alphaT('M');
      // MC ist ein Radius wie MA: Das Dreieck AMC ist gleichschenklig, also ∢ACM = α.
      return grad('M ist der Mittelpunkt des Thaleskreises. Die Strecken MA, MB und MC sind Radien. Berechne den Winkel φ = ∢ACM.', a, [[90 - a, 'basiswinkel-falsch'], [180 - 2 * a, 'basiswinkel-falsch']],
        H('M', 'Das Dreieck AMC ist gleichschenklig, denn MA und MC sind gleich lang.', 'Seine Basiswinkel sind gleich groß.'),
        { bild: thales(a, drehFuer('M'), { mitM: true, zeige: { A: WERT(a) }, extra: { linien: [['M', 'C', { stil: 'hilfs' }]], winkel: [['C', 'A', 'M', { n: 'φ', wert: a, frage: true, farbe: 2 }]] } }), nachweis: [{ art: 'thales' }, FIG('φ')] }); },
    () => { const g = wahl([86, 87, 88, 92, 93, 94, 90]);
      return auswahl(`Im Dreieck ABC ist γ = ${g}°. Überprüfe, ob C auf dem Thaleskreis über AB liegt. Kreuze an.`, [opt(g === 90 ? 'Ja, genau dann ist γ = 90°.' : 'Nein. Nur bei γ = 90° liegt C auf dem Thaleskreis.', true), opt(g === 90 ? 'Nein, γ müsste 180° sein.' : 'Ja, fast genau.', false, 'thales-durchmesser'), opt(g < 90 ? 'Nein, C liegt innerhalb des Kreises.' : g > 90 ? 'Nein, C liegt außerhalb des Kreises.' : 'Nur, wenn das Dreieck gleichschenklig ist.', false, 'innen-aussen-verwechselt')],
        H('M', 'Umkehrung des Satzes des Thales: Ist γ = 90°, liegt C auf dem Thaleskreis.', 'Vergleiche γ genau mit 90°. Fast 90° reicht nicht.'), { nachweis: [{ art: 'urteil', stimmt: g === 90 }] }); },
    () => { const r = zz(3, 8);
      return zahl(`Der Thaleskreis über AB hat den Radius ${cm(r)}. Bestimme die Länge von AB.`, 2 * r, [[r, 'thales-durchmesser']], H('M', 'AB ist ein Durchmesser.', `2 · ${r} cm.`), { einheit: 'cm', nachweis: [`2 · ${r} = ${2 * r}`] }); },
    () => { const a = alphaT('M'), b = 90 - a, d = 2 * b;
      return grad('M ist der Mittelpunkt des Thaleskreises. Berechne den Winkel δ = ∢AMC.', d, [[2 * a, 'basiswinkel-falsch'], [180 - a, 'basiswinkel-falsch']],
        H('M', 'Das Dreieck AMC ist gleichschenklig mit der Spitze M.', `Rechne 180° − ${a}° − ${a}°.`),
        { bild: thales(a, drehFuer('M'), { mitM: true, zeige: { A: WERT(a) }, extra: { linien: [['M', 'C', { stil: 'hilfs' }]], winkel: [['M', 'A', 'C', { n: 'δ', wert: d, frage: true, farbe: 2 }]] } }), nachweis: [R(`180° − ${a}° − ${a}° = ${d}°`), FIG('δ')] }); },
    () => { const k = kind(), a = alphaT('M');
      return auswahl(`${k} sagt: „C liegt auf dem Thaleskreis über AB. Also ist α = 90°.“ Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt('Der rechte Winkel liegt an der Ecke auf dem Kreis, also bei C. Es ist γ = 90°.', true), opt('Der rechte Winkel liegt immer bei A.', false, 'thales-durchmesser'), opt('Im Thaleskreis gibt es keinen rechten Winkel, nur am Durchmesser.', false, 'thales-durchmesser'), opt('Der rechte Winkel liegt beim Mittelpunkt M.', false, 'thales-durchmesser')],
        hThales('M'), { bild: thales(a, drehFuer('M')), nachweis: [{ art: 'thales' }, { art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(T1, 'E', [
    () => { const k = wahl([2, 3, 4, 5, 8, 9]), a = 90 / (k + 1); if (!Number.isInteger(a)) return null;
      return grad(`C liegt auf dem Thaleskreis über AB. Der Winkel β ist ${k}-mal so groß wie α. Bestimme α.`, a, [[180 / (k + 1), 'thales-durchmesser'], [k * a, 'seite-ecke-vertauscht']].filter(([x]) => Number.isInteger(x)), H('E', 'α und β sind zusammen 90°.'),
        { bild: thales(a, drehFuer('E'), { zeige: { A: GESUCHT('α', a), B: NAME('β') } }), nachweis: [`90° : ${k + 1} = ${a}°`, FIG('α')] }); },
    () => { const d = suche(() => 2 * zz(20, 70), (x) => x !== 90), a = 90 - d / 2;
      return grad(`M ist der Mittelpunkt des Thaleskreises über AB, und ∢AMC = ${d}°. Bestimme α.`, (180 - d) / 2, [[d / 2, 'basiswinkel-falsch'], [180 - d, 'basiswinkel-falsch']],
        H('E', 'Das Dreieck AMC ist gleichschenklig.'), { bild: thales((180 - d) / 2, drehFuer('E'), { mitM: true, extra: { linien: [['M', 'C', { stil: 'hilfs' }]], winkel: [['M', 'A', 'C', { wert: d, farbe: 2 }], ['A', 'B', 'C', { n: 'α', wert: (180 - d) / 2, frage: true, farbe: 0 }]] } }), nachweis: [R(`180° − ${d}° = ${180 - d}°`), `${180 - d}° : 2 = ${(180 - d) / 2}°`, FIG('α')] }); },
    () => ordnen('Beweise den Satz des Thales. M ist die Mitte von AB, C liegt auf dem Kreis. Ordne die Schritte.',
      ['MA, MB und MC sind Radien, also gleich lang.', 'Die Dreiecke AMC und MBC sind gleichschenklig: ∢ACM = α und ∢MCB = β.', 'Also ist γ = α + β.', 'Mit α + β + γ = 180° folgt 2γ = 180°, also γ = 90°.'],
      H('E', 'Zerlege das Dreieck mit der Strecke MC.'), { bild: thales(alphaT('E'), drehFuer('E'), { mitM: true, zeige: { A: NAME('α'), B: NAME('β') }, extra: { linien: [['M', 'C', { stil: 'hilfs' }]] } }) }),
    () => { const k = kind();
      return auswahl(`${k} zeichnet einen Kreis und eine Sehne AB, die nicht durch den Mittelpunkt geht. C liegt auf dem Kreis. ${k} sagt: „Dann ist γ = 90°.“ Beurteile die Aussage. Kreuze an.`,
        [opt('Falsch. Der Satz gilt nur, wenn AB ein Durchmesser ist.', true), opt('Richtig. Jeder Punkt auf einem Kreis bildet einen rechten Winkel.', false, 'thales-durchmesser'), opt('Richtig, wenn C oben liegt.', false, 'thales-durchmesser'), opt('Falsch. γ ist dann immer 180°.', false, 'thales-durchmesser')],
        H('E', 'Was verlangt der Satz des Thales von der Strecke AB?'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
    () => { const a = alphaT('E'), b = 90 - a, d = 180 - 2 * a;
      return luecken(`M ist der Mittelpunkt des Thaleskreises, α = ${a}°. Berechne β und den Winkel ε = ∢BMC.\nβ = {{b}}°\nε = {{m}}°`, { b: lk(b, [[180 - a, 'thales-durchmesser']]), m: lk(2 * a, [[d, 'basiswinkel-falsch']]) },
        H('E', 'Der Winkel ∢BMC ist Nebenwinkel von ∢AMC.'), { bild: thales(a, drehFuer('E'), { mitM: true, zeige: { A: WERT(a), B: GESUCHT('β', b) }, extra: { linien: [['M', 'C', { stil: 'hilfs' }]], winkel: [['M', 'B', 'C', { n: 'ε', wert: 2 * a, frage: true, farbe: 3 }]] } }),
          nachweis: [R(`180° − 90° − ${a}° = ${b}°`), R(`180° − ${a}° − ${a}° = ${d}°`), R(`180° − ${d}° = ${2 * a}°`), FIG('β', { luecke: 'b' })] }); },
    () => { const lage = wahl(['innen', 'aussen']);
      return auswahl(`Der Punkt C liegt ${lage === 'innen' ? 'innerhalb' : 'außerhalb'} des Thaleskreises über AB. Entscheide, wie groß γ dann ist. Kreuze an.`,
        [opt(lage === 'innen' ? 'größer als 90°' : 'kleiner als 90°', true), opt('genau 90°', false, 'thales-durchmesser'), opt(lage === 'innen' ? 'kleiner als 90°' : 'größer als 90°', false, 'innen-aussen-verwechselt')],
        H('E', 'Schiebe C in Gedanken näher an AB heran. Was passiert mit γ?'), { nachweis: [{ art: 'thales', lage }] }); },
  ]);
}

// ---------- T2: mit dem Thaleskreis konstruieren (Gitter und Heft) ----------
// Thaleskreis am Gitter: AB waagerecht mit Länge 2r, M ganzzahlig. Für r = 5 liegen Gitterpunkte auf dem Kreis in der Höhe 3 und 4.
function t2() {
  // voll: Der ganze Kreis passt ins Gitter (wenn das Kind ihn zeichnet), sonst nur der Halbkreis über AB.
  const lage = (r = wahl([2, 3, 4, 5]), voll = false) => { const ox = zz(1, 2), y = voll ? r : 1, M = [ox + r, y]; return { r, M, A: [ox, y], B: [ox + 2 * r, y], g: (extra) => GT(ox + 2 * r + 1, voll ? 2 * r : r + 3, extra) }; };
  const hMitte = (n) => H(n, 'Die Mitte von AB ist der Mittelpunkt des Thaleskreises.', 'AB ist 6 Kästchen lang. Die Mitte liegt 3 Kästchen von A entfernt.', 'Zähle die Kästchen von A bis B und halbiere.');
  const hKreis = (n, r) => H(n, 'Der Thaleskreis hat seinen Mittelpunkt in der Mitte von AB.', 'Sein Radius ist die halbe Strecke AB.', `Setze den Mittelpunkt in die Mitte und den Kreis durch A. Der Radius ist ${r} Kästchen.`);
  const SCHRITTE = ['Zeichne die Strecke AB.', 'Bestimme die Mitte M von AB.', 'Zeichne den Halbkreis um M durch A und B.', 'Wähle C auf dem Halbkreis und verbinde C mit A und B.'];
  const aufHoehe = (n, text) => { const ox = zz(1, 3), M = [ox + 5, 1], h = wahl([3, 4]), d = h === 3 ? 4 : 3, C1 = [M[0] - d, 1 + h], C2 = [M[0] + d, 1 + h];
    return gitterPunkte(text(h), GT(ox + 11, 7, { punkte: [PT('A', ox, 1), PT('B', ox + 10, 1)], linien: [LN('c', [ox, 1], [ox + 10, 1], 'strecke'), LN('p', [ox, 1 + h], [ox + 10, 1 + h], 'gerade')], kreise: [{ m: M, r: 5 }] }), [C1, C2], [[[C1], 'thales-durchmesser'], [[C2], 'thales-durchmesser']],
      H(n, 'C liegt auf dem Thaleskreis und auf der Geraden p.', 'Kreis und Gerade schneiden sich in zwei Punkten.', 'Suche beide Schnittpunkte.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: M, r: 5 }, { art: 'abstandGerade', a: [ox, 1], b: [ox + 10, 1], d: h }, { art: 'ueber', a: [ox, 1], b: [ox + 10, 1] }] }] }); };
  // Heftaufgabe: rechtwinkliges Dreieck mit γ = 90° und c, dazu b oder α. Kontrollwert in mm oder Grad.
  const heftT = (n, kontext) => { const c = wahl([6, 7, 8, 9, 10]), mitWinkel = wahl([true, false]);
    if (mitWinkel) { const a = winkelFuer(n === 'G' ? 'G' : 'M', 25, 65), b = Math.round(c * Math.cos((a * Math.PI) / 180) * 10);
      return zahl(kontext ? kontext(`c = ${cm(c)}, γ = 90° und α = ${a}°`) : Z(`Konstruiere im Heft ein Dreieck mit c = ${cm(c)}, γ = 90° und α = ${a}°.`, 'Nutze den Thaleskreis über c.', 'Miss dann die Seite b in Millimetern.'), b, [], H(n, 'Zeichne c und den Thaleskreis über c.', 'Trage α bei A an.', 'Der freie Schenkel schneidet den Thaleskreis in C.'),
        { einheit: 'mm', toleranz: 2, nachweis: [{ art: 'heft', gegeben: { c, α: a, γ: 90 }, gesucht: 'b', satz: 'thales' }] }); }
    const b = zz(3, c - 2), a = Math.round((Math.acos(b / c) * 180) / Math.PI);
    return zahl(kontext ? kontext(`c = ${cm(c)}, γ = 90° und b = ${cm(b)}`) : Z(`Konstruiere im Heft ein Dreieck mit c = ${cm(c)}, γ = 90° und b = ${cm(b)}.`, 'Nutze den Thaleskreis über c.', 'Miss dann den Winkel α.'), a, [], H(n, 'Zeichne c und den Thaleskreis über c.', 'Ein Kreis um A mit dem Radius b schneidet den Thaleskreis in C.', 'Verbinde C mit A und B.'),
      { einheit: '°', toleranz: 2, nachweis: [{ art: 'heft', gegeben: { c, b, γ: 90 }, gesucht: 'α', satz: 'thales' }] }); };
  sechs(T2, 'F', [
    () => { const t = lage(); return gitterPunkte(Z('Der Thaleskreis hat seinen Mittelpunkt in der Mitte von AB.', 'Tippe die Mitte M an.'), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')] }), [t.M], [], hMitte('F'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'mitte', a: t.A, b: t.B }] }] }); },
    () => { const t = lage(undefined, true); return gitterKreis(Z('Zeichne den Thaleskreis über AB.', 'Setze zuerst den Mittelpunkt.', 'Tippe dann einen Punkt auf dem Kreis an.'), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')] }), t.M, t.r, t.B, [[{ r: 2 * t.r }, 'thales-durchmesser'], [{ m: t.A, r: 2 * t.r }, 'thales-durchmesser']], hKreis('F', t.r), { nachweis: [{ art: 'kreisGitter', r: t.r }] }); },
    () => aufHoehe('F', (h) => Z('Der Thaleskreis über AB ist gezeichnet.', `C soll ${h} Kästchen über AB liegen.`, 'Tippe beide möglichen Punkte C an.')),
    () => ordnen(Z('Ein Dreieck mit rechtem Winkel bei C wird gezeichnet.', 'Bringe die Schritte in die richtige Reihenfolge.'), SCHRITTE, H('F', 'Zuerst brauchst du die Strecke.', 'Den Kreis kannst du erst zeichnen, wenn du die Mitte kennst.', 'Zuletzt wählst du C.'), { bild: thales(alphaT('F'), 0, { mitM: true, zeige: { C: WERT(90) } }) }),
    () => { const t = lage(undefined, true); return gitterKreis(Z('Zeichne den Thaleskreis über AB.', 'Finde zuerst die Mitte von AB.', 'Tippe dann die Mitte und einen Punkt auf dem Kreis an.'), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')] }), t.M, t.r, t.A, [[{ r: 2 * t.r }, 'thales-durchmesser'], [{ m: t.A, r: t.r }, 'thales-durchmesser']], hKreis('F', t.r), { nachweis: [{ art: 'kreisGitter', r: t.r }] }); },
    () => { const ox = zz(1, 3), M = [ox + 5, 1], [C] = mische([[M[0] - 3, 5], [M[0] + 3, 5], [M[0] - 4, 4], [M[0] + 4, 4], [M[0], 6]]), A = [ox, 1];
      return gitterLinie(Z('C liegt auf dem Thaleskreis.', 'Zeichne die Seite b von A nach C.'), GT(ox + 11, 7, { punkte: [PT('A', ...A), PT('B', ox + 10, 1), PT('C', ...C)], linien: [LN('c', A, [ox + 10, 1], 'strecke'), LN('a', [ox + 10, 1], C, 'strecke')], kreise: [{ m: M, r: 5 }] }), 'strecke', { art: 'strecke', a: A, b: C }, [A, C],
        [[{ art: 'strecke', a: M, b: C }, 'thales-durchmesser']], H('F', 'Die Seite b liegt der Ecke B gegenüber.', 'b verbindet A und C.', 'Verbinde A mit C.')); },
  ]);
  sechs(T2, 'G', [
    () => { const t = lage(undefined, true); return gitterKreis(Z('Zeichne den Thaleskreis über AB.', 'Tippe den Mittelpunkt und einen Punkt auf dem Kreis an.'), t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')] }), t.M, t.r, t.B, [[{ r: 2 * t.r }, 'thales-durchmesser'], [{ m: t.A, r: 2 * t.r }, 'thales-durchmesser']], hKreis('G', t.r), { nachweis: [{ art: 'kreisGitter', r: t.r }] }); },
    () => aufHoehe('G', (h) => Z(`C soll auf dem Thaleskreis liegen und ${h} Kästchen über AB.`, 'Tippe beide möglichen Punkte an.')),
    () => heftT('G'),
    () => ordnen(Z('Ein Dreieck mit γ = 90° wird gezeichnet.', 'Bringe die Schritte in die richtige Reihenfolge.'), SCHRITTE, H('G', 'Ohne Mitte gibt es keinen Kreis.', 'Erst die Strecke, dann die Mitte.', 'C wählst du ganz zum Schluss.'), { bild: thales(alphaT('F'), 0, { mitM: true, zeige: { C: WERT(90) } }) }),
    () => heftT('G'),
    () => { const k = kind();
      return auswahl(Z(`${k} soll ein Dreieck mit γ = 90° über AB zeichnen.`, `${k} zeichnet einen Kreis um A durch B.`, 'Kreuze die richtige Begründung an.'),
        [opt('Das ist falsch. Der Mittelpunkt muss die Mitte von AB sein.', true), opt('Das ist richtig. Jeder Kreis durch B passt.', false, 'thales-durchmesser'), opt('Das ist richtig. A ist eine Ecke.', false, 'thales-durchmesser')],
        H('G', 'Beim Thaleskreis ist AB ein Durchmesser.', 'Ein Durchmesser geht durch den Mittelpunkt.', 'Wo liegt also der Mittelpunkt?'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(T2, 'M', [
    () => aufHoehe('M', (h) => `C soll mit A und B einen rechten Winkel bilden und ${h} Kästchen von AB entfernt sein. Tippe alle möglichen Punkte C oberhalb von AB an.`),
    () => heftT('M'),
    () => { const t = lage(wahl([2, 3, 4]), true);
      return gitterKreis(`Alle Punkte C mit γ = 90° liegen auf einer Ortslinie. Zeichne sie für die Strecke AB.`, t.g({ punkte: [PT('A', ...t.A), PT('B', ...t.B)], linien: [LN('c', t.A, t.B, 'strecke')] }), t.M, t.r, t.B, [[{ r: 2 * t.r }, 'thales-durchmesser'], [{ m: t.A, r: 2 * t.r }, 'ortslinie-verwechselt']], hKreis('M', t.r), { nachweis: [{ art: 'kreisGitter', r: t.r }] }); },
    () => auswahl('Welche Ortslinie enthält alle Punkte C, für die das Dreieck ABC bei C einen rechten Winkel hat? Kreuze an.',
      [opt('der Thaleskreis über AB (ohne A und B)', true), opt('die Mittelsenkrechte von AB', false, 'ortslinie-verwechselt'), opt('ein Kreis um A durch B', false, 'thales-durchmesser'), opt('eine Parallele zu AB', false, 'ortslinie-verwechselt')],
      H('M', 'Umkehrung des Satzes des Thales.', 'Ist γ = 90°, liegt C auf dem Halbkreis über AB.'), { nachweis: [{ art: 'thales' }] }),
    () => heftT('M'),
    () => { const k = kind();
      return auswahl(`${k} soll ein Dreieck mit c = 6 cm, γ = 90° und b = 7 cm zeichnen. Der Kreis um A schneidet den Thaleskreis nicht. Erkläre, warum. Kreuze an.`,
        [opt('b ist länger als der Durchmesser c. Im rechtwinkligen Dreieck ist c die längste Seite.', true), opt('Der Zirkel war falsch eingestellt.', false, 'thales-durchmesser'), opt('Man muss den Kreis um B zeichnen.', false, 'konstruktion-reihenfolge'), opt('Der Thaleskreis ist zu klein gezeichnet. Ein größerer Kreis über c würde passen.', false, 'thales-durchmesser')],
        H('M', 'Alle Punkte des Thaleskreises sind höchstens c von A entfernt.', 'Vergleiche b = 7 cm mit dem Durchmesser c = 6 cm.'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
  sechs(T2, 'E', [
    () => heftT('E'),
    () => heftT('E'),
    () => { const ox = 1, M = [ox + 5, 1], hs = [3, 4];
      return gitterPunkte('C soll mit A und B einen rechten Winkel bilden und genau 3 oder 4 Kästchen über AB liegen. Tippe alle möglichen Punkte C oberhalb von AB an.', GT(12, 7, { punkte: [PT('A', ox, 1), PT('B', ox + 10, 1)], linien: [LN('c', [ox, 1], [ox + 10, 1], 'strecke')], kreise: [{ m: M, r: 5 }] }),
        [[M[0] - 4, 4], [M[0] + 4, 4], [M[0] - 3, 5], [M[0] + 3, 5]], [[[[M[0] - 4, 4], [M[0] + 4, 4]], 'thales-durchmesser']], H('E', 'Für jede Höhe gibt es zwei Schnittpunkte mit dem Thaleskreis.'),
        { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: M, r: 5 }, { art: 'hoehe', a: [ox, 1], b: [ox + 10, 1], werte: hs }] }] }); },
    () => ordnen('Konstruiere ein Dreieck mit c, γ = 90° und der Höhe h_c. Ordne die Schritte.',
      ['Zeichne c und den Thaleskreis über c.', 'Zeichne eine Parallele zu c im Abstand h_c.', 'Ein Schnittpunkt der Parallelen mit dem Thaleskreis ist C.', 'Verbinde C mit A und B.'], H('E', 'C muss zwei Bedingungen erfüllen.')),
    () => auswahl('Gegeben sind c = 8 cm und γ = 90°. Für welche Höhe h_c gibt es genau ein Dreieck oberhalb von c (bis auf Spiegeln an der Mittelsenkrechten)? Kreuze an.',
      [opt('h_c = 4 cm, denn dann berührt die Parallele den Thaleskreis.', true), opt('h_c = 8 cm', false, 'thales-durchmesser'), opt('h_c = 2 cm', false, 'thales-durchmesser'), opt('Für jede beliebige Höhe gibt es genau ein solches Dreieck.', false, 'thales-durchmesser')],
      H('E', 'Der Thaleskreis hat den Radius 4 cm.'), { nachweis: ['8 : 2 = 4'] }),
    () => { const k = kind();
      return auswahl(`${k} sagt: „Mit c = 6 cm und γ = 90° ist das Dreieck schon eindeutig.“ Beurteile die Aussage. Kreuze an.`,
        [opt('Falsch. C kann überall auf dem Thaleskreis liegen. Es fehlt eine dritte Angabe.', true), opt('Richtig. Der Thaleskreis legt C fest.', false, 'kongruenz-verwechselt'), opt('Richtig. Es gibt nur ein einziges rechtwinkliges Dreieck mit c = 6 cm.', false, 'kongruenz-verwechselt'), opt('Falsch. Es gibt gar kein solches Dreieck.', false, 'thales-durchmesser')],
        H('E', 'Wie viele Punkte hat der Thaleskreis?'), { nachweis: [{ art: 'urteil', stimmt: false }] }); },
  ]);
}

// ---------- 7.2.X1: Tangenten (nur E, 24 Aufgaben) ----------
// Kreis um M mit r = 5: Gitterpunkte darauf sind (±3|±4), (±4|±3), (0|±5), (±5|0). Die Tangente in P hat die Richtung senkrecht zu MP.
const AUF5 = [[3, 4], [4, 3], [-3, 4], [-4, 3], [0, 5], [5, 0], [3, -4], [-4, -3], [-5, 0], [0, -5], [4, -3], [-3, -4]];
// Tangenten von Q an den Kreis (r = 5, M im Ursprung): Berührpunkte T mit T·Q = 25.
const VON_AUSSEN = [[[5, 5], [0, 5], [5, 0]], [[1, 7], [4, 3], [-3, 4]], [[7, 1], [3, 4], [4, -3]], [[-5, 5], [0, 5], [-5, 0]], [[-1, 7], [-4, 3], [3, 4]], [[-7, 1], [-3, 4], [-4, -3]]];
function tangenten() {
  const O = [7, 7], g = (extra) => GT(14, 14, extra), v = (p) => [O[0] + p[0], O[1] + p[1]];
  const tangenteIn = (text) => { const p = wahl(AUF5), P = v(p), e = p[0] === 0 || p[1] === 0 ? [p[1] === 0 ? 0 : 1, p[0] === 0 ? 0 : 1] : [-p[1], p[0]];
    const drin = (q) => q.every((x) => x >= 0 && x <= 14), Q = drin([P[0] + e[0], P[1] + e[1]]) ? [P[0] + e[0], P[1] + e[1]] : [P[0] - e[0], P[1] - e[1]];
    return gitterLinie(text, g({ punkte: [PT('M', ...O), PT('P', ...P)], kreise: [{ m: O, r: 5 }], linien: [LN(null, O, P, 'strecke', 'hilfs')] }), 'gerade', { art: 'senkrecht', zu: [O, P], durch: P }, [P, Q],
      [[{ art: 'gerade', a: O, b: P }, 'tangente-nicht-senkrecht'], [{ art: 'parallel', zu: [O, P], durch: P }, 'tangente-nicht-senkrecht']], H('E', 'Die Tangente steht im Berührpunkt senkrecht auf dem Radius.'), { nachweis: [{ art: 'linie' }, { art: 'tangente', m: O, p: P }] }); };
  const beruehr = (text) => { const [q, t1, t2] = wahl(VON_AUSSEN), Q = v(q), T1 = v(t1), T2 = v(t2);
    return gitterPunkte(text, g({ punkte: [PT('M', ...O), PT('Q', ...Q)], kreise: [{ m: O, r: 5 }] }), [T1, T2], [[[T1], 'tangente-nicht-senkrecht'], [[T2], 'tangente-nicht-senkrecht']],
      H('E', 'Der Thaleskreis über MQ schneidet den Kreis in den Berührpunkten.'), { nachweis: [{ art: 'ort', bedingungen: [{ art: 'abstand', von: O, r: 5 }, { art: 'rechter', a: O, b: Q }] }] }); };
  const lageD = () => { const r = zz(3, 8), d = wahl([r - zz(1, 2), r, r + zz(1, 3), 0]), was = d < r ? 'Sekante' : d === r ? 'Tangente' : 'Passante';
    return auswahl(`Ein Kreis hat den Radius ${cm(r)}. Eine Gerade hat vom Mittelpunkt den Abstand ${cm(d)}. Entscheide, wie die Gerade heißt. Kreuze an.`,
      ['Sekante', 'Tangente', 'Passante'].map((x) => opt(x, x === was, x === was ? undefined : 'innen-aussen-verwechselt')), H('E', 'Vergleiche den Abstand mit dem Radius.'), { hinweise: { 'innen-aussen-verwechselt': 'Ist der Abstand kleiner als der Radius, gleich groß oder größer? Danach richtet sich der Name.' }, nachweis: [{ art: 'kreislage', r, d, was }] }); };
  const viereck = () => { const m = suche(() => zz(70, 130), (x) => x !== 90), q = 180 - m, dreh = zz(0, 359), r = 2.2;
    const M = [0, 0], T1 = drehe(plus(M, dir(-m / 2), r), dreh), T2 = drehe(plus(M, dir(m / 2), r), dreh), Q = drehe(plus(M, dir(0), r / Math.cos((m / 2 * Math.PI) / 180)), dreh);
    return grad(`Von Q aus gehen zwei Tangenten an den Kreis um M. Sie berühren ihn in T₁ und T₂. Es ist ∢T₁MT₂ = ${m}°. Bestimme den Winkel φ bei Q.`, q, [[m, 'tangente-nicht-senkrecht'], [360 - m, 'winkelsumme']],
      H('E', 'Im Viereck MT₁QT₂ sind zwei Winkel rechte Winkel. Zusammen sind alle vier 360°.'),
      { bild: figur({ punkte: { M, 'T₁': T1, 'T₂': T2, Q }, linien: [['M', 'T₁', { stil: 'hilfs' }], ['M', 'T₂', { stil: 'hilfs' }], ['Q', 'T₁'], ['Q', 'T₂']], kreise: [['M', r]], winkel: [['M', 'T₁', 'T₂', { wert: m, farbe: 0 }], ['T₁', 'M', 'Q', { wert: 90, farbe: 1 }], ['T₂', 'Q', 'M', { wert: 90, farbe: 1 }], ['Q', 'T₁', 'T₂', { n: 'φ', wert: q, frage: true, farbe: 2 }]] }),
        nachweis: [R(`360° − 90° − 90° − ${m}° = ${q}°`), FIG('φ')] }); };
  const SCHRITTE = ['Verbinde M mit Q und bestimme die Mitte von MQ.', 'Zeichne den Thaleskreis über MQ.', 'Die Schnittpunkte des Thaleskreises mit dem Kreis sind die Berührpunkte T₁ und T₂.', 'Zeichne die Geraden QT₁ und QT₂.'];
  const urteil = () => { const k = kind(), [satz, stimmt, grund, fv] = wahl([
    ['Die Tangente in P ist parallel zum Radius MP.', false, 'Sie steht senkrecht auf dem Radius MP.', 'tangente-nicht-senkrecht'],
    ['Von einem Punkt außerhalb gibt es genau zwei Tangenten an einen Kreis.', true, 'Der Thaleskreis über MQ schneidet den Kreis in zwei Punkten.', 'tangente-nicht-senkrecht'],
    ['Von einem Punkt innerhalb des Kreises gibt es eine Tangente.', false, 'Jede Gerade durch einen Punkt innerhalb schneidet den Kreis zweimal.', 'innen-aussen-verwechselt'],
    ['In jedem Punkt des Kreises gibt es genau eine Tangente.', true, 'Es gibt genau eine Senkrechte zum Radius durch diesen Punkt.', 'tangente-nicht-senkrecht']]);
    return auswahl(`${k} sagt: „${satz}“ Beurteile die Aussage. Kreuze an.`, [opt(`${stimmt ? 'Stimmt' : 'Stimmt nicht'}. ${grund}`, true), opt(`${stimmt ? 'Stimmt nicht' : 'Stimmt'}. Das sieht man ohne Begründung an der Zeichnung.`, false, fv), opt('Das hängt vom Radius ab.', false, fv)],
      H('E', 'Denke an den rechten Winkel zwischen Tangente und Radius.'), { nachweis: [{ art: 'urteil', stimmt }] }); };
  const abstand = () => { const [q, t1] = wahl(VON_AUSSEN), Q = v(q), T = v(t1), l = Math.abs(Q[0] - T[0]) + Math.abs(Q[1] - T[1]); if (Q[0] !== T[0] && Q[1] !== T[1]) return null;
    return zahl('Von Q geht eine Tangente an den Kreis um M. Sie berührt ihn im Punkt T. Bestimme die Länge der Strecke QT in Kästchen.', l, [[5, 'tangente-nicht-senkrecht']].filter(([x]) => x !== l),
      H('E', 'Zähle die Kästchen von Q bis T.'), { bild: gitterBild(g({ punkte: [PT('M', ...O), PT('Q', ...Q), PT('T', ...T)], kreise: [{ m: O, r: 5 }], linien: [LN(null, Q, T, 'strecke'), LN(null, O, T, 'strecke', 'hilfs')] })), nachweis: [{ art: 'gitterlaenge', a: Q, b: T, wert: l }] }); };
  const rechterWinkel = () => { const a = zz(20, 70), dreh = zz(0, 359), r = 2.2, M = [0, 0], P = drehe([r, 0], dreh), Q = drehe(plus([r, 0], dir(90), 3), dreh), S = drehe(plus([r, 0], dir(-90), 2), dreh), Rr = drehe(plus([0, 0], dir(a * 2), r), dreh);
    return grad(`Die Gerade t ist die Tangente im Punkt P. Die Sehne PR bildet mit dem Radius MP den Winkel ${90 - a}°. Bestimme den Winkel φ zwischen Sehne und Tangente.`, a, [[90 - a, 'tangente-nicht-senkrecht'], [180 - a, 'tangente-nicht-senkrecht']],
      H('E', 'Tangente und Radius bilden einen rechten Winkel.'),
      { bild: figur({ punkte: { M, P, Q, S, R: Rr }, versteckt: ['Q', 'S'], linien: [['S', 'Q', { n: 't' }], ['M', 'P', { stil: 'hilfs' }], ['P', 'R']], kreise: [['M', r]], winkel: [['P', 'M', 'R', { wert: 90 - a, farbe: 0 }], ['P', 'R', 'Q', { n: 'φ', wert: a, frage: true, farbe: 2 }]] }), nachweis: [R(`90° − ${90 - a}° = ${a}°`), FIG('φ')] }); };
  sechs(X1, 'E', [
    () => lageD(), () => tangenteIn('Zeichne die Tangente an den Kreis im Punkt P.'), () => viereck(), () => urteil(), () => beruehr('Von Q aus gehen zwei Tangenten an den Kreis. Tippe die beiden Berührpunkte an.'),
    () => ordnen('Konstruiere die Tangenten von einem Punkt Q außerhalb an einen Kreis um M. Ordne die Schritte.', SCHRITTE, H('E', 'Die Berührpunkte findest du mit dem Satz des Thales.')),
    () => tangenteIn('Der Punkt P liegt auf dem Kreis um M. Zeichne die Tangente in P.'), () => rechterWinkel(), () => viereck(), () => abstand(), () => lageD(), () => urteil(),
    () => lageD(), () => beruehr('Tippe die Berührpunkte der beiden Tangenten von Q an den Kreis an.'), () => viereck(),
    () => grad('Der Radius MP und die Tangente in P bilden einen Winkel. Gib seine Größe an.', 90, [[180, 'tangente-nicht-senkrecht'], [45, 'tangente-nicht-senkrecht']], H('E', 'Wie steht die Tangente zum Radius?'), { nachweis: [{ art: 'tangente' }] }),
    () => rechterWinkel(), () => auswahl('Warum schneidet der Thaleskreis über MQ den Kreis genau in den Berührpunkten? Kreuze an.',
      [opt('Für Punkte T auf dem Thaleskreis ist ∢MTQ = 90°. Dann steht QT senkrecht auf dem Radius MT.', true), opt('Weil der Thaleskreis so groß ist wie der Kreis und ihn deshalb genau zweimal trifft.', false, 'thales-durchmesser'), opt('Weil Q auf dem Kreis liegt.', false, 'innen-aussen-verwechselt'), opt('Weil MQ eine Tangente ist.', false, 'tangente-nicht-senkrecht')],
      H('E', 'Was gilt für den Winkel zwischen Tangente und Radius?'), { nachweis: [{ art: 'thales' }, { art: 'urteil', stimmt: true }] }),
    () => tangenteIn('Zeichne die Tangente in P. Sie soll senkrecht zum Radius MP stehen.'), () => abstand(), () => urteil(), () => beruehr('Q liegt außerhalb des Kreises. Tippe die Punkte an, in denen die Tangenten von Q den Kreis berühren.'),
    () => tangenteIn('Konstruiere die Tangente im Punkt P des Kreises.'), () => viereck(),
  ], 24);
}

export function satzDesThales() { t1(); t2(); }
export { tangenten };
