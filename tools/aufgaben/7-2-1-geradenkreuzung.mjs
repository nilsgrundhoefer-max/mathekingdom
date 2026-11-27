// Aufgaben zu 7.2.1 „Winkel im Schnittpunkt von Geraden“ (Lernziele W1 und W2) nach ADR 0015 und ADR 0044.
// Grilling mit Nils (2026-11-25): Das Buch markiert die Lerneinheit mit Sternchen, der Bildungsplan auf G mit [MSA].
// Sie hat deshalb Aufgaben auf allen vier Stufen, Pflicht ist sie erst ab Zielniveau M („Pflicht ab M“).
// W1: Scheitel- und Nebenwinkel an zwei sich schneidenden Geraden. W2: Stufen- und Wechselwinkel an geschnittenen Parallelen.
// F Winkel in Zehnerschritten, eine Gerade liegt waagerecht. G Fünferschritte, gedreht. M und E gradgenau.
// AFB III nach der ★-Tabelle der Lehrkraft: G richtige Begründung ankreuzen, M Grund selbst wählen, E Fehler erklären oder Beweis ordnen.
import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, figur, kreuzung, parallelen, NAMEN_G, NAMEN_H, STRICH, WERT, GESUCHT, NAME, H, grad, auswahl, opt, luecken, lk, Z, sach, teil, teilWahl, ordnen, BEZ, FIG, R, plus, dir, winkelFuer, kind } from './7-2-figur.mjs';

const W1 = '7.2.1-W1', W2 = '7.2.1-W2';
const drehFuer = (n) => (n === 'F' ? 0 : n === 'G' ? 5 * zz(-6, 6) : zz(-35, 35));
// Ein Winkel an der Kreuzung: nicht zu spitz, damit die Namen Platz haben, und nie 90°.
const alphaFuer = (n) => suche(() => winkelFuer(n, 40, 140), (a) => a !== 90);
const nebenWert = (a) => 180 - a;
// Vier Winkel an der Kreuzung: zeige[i] wie WERT, GESUCHT oder NAME (oder null).
const kr = (n, alpha, zeige, o = {}) => kreuzung(alpha, o.dreh ?? drehFuer(n), zeige, o);
const werte = (a) => [a, 180 - a, a, 180 - a];
const GRUND = { neben: 'Nebenwinkel', scheitel: 'Scheitelwinkel', stufen: 'Stufenwinkel', wechsel: 'Wechselwinkel' };
const grundOptionen = (richtig, andere = ['neben', 'scheitel', 'stufen']) => [...new Set([richtig, ...andere])].slice(0, 3).map((k) => opt(GRUND[k], k === richtig, k === richtig ? undefined : (['stufen', 'wechsel'].includes(k) && ['stufen', 'wechsel'].includes(richtig) ? 'stufen-wechsel-verwechselt' : 'scheitel-neben-verwechselt')));

// ---------- W1: Scheitel- und Nebenwinkel ----------
function w1() {
  const hNeben = (n, a) => H(n, 'Nebenwinkel liegen nebeneinander an einer Geraden. Zusammen sind sie 180°.', 'Ist α = 70°, dann ist sein Nebenwinkel 180° − 70° = 110°.', `Rechne 180° − ${a}°.`);
  const hScheitel = (n) => H(n, 'Scheitelwinkel liegen sich genau gegenüber. Sie sind gleich groß.', 'Ist α = 70°, dann ist auch γ = 70°.', 'Der gesuchte Winkel liegt dem bekannten Winkel gegenüber.');
  const hAlle = (n, a) => H(n, 'Gegenüber liegen gleich große Winkel. Nebeneinander ergeben zwei Winkel 180°.', 'Ist α = 60°, sind β = 120°, γ = 60° und δ = 120°.', `Der Winkel neben ${a}° ist sein Nebenwinkel: 180° − ${a}° = ${180 - a}°. Der Winkel gegenüber von ${a}° ist auch ${a}°.`);
  // Ein Winkel bekannt (Lage i), einer gesucht (Lage j).
  const einer = (n, i, j, text, hilfen) => { const a = alphaFuer(n), w = werte(a), zeige = [null, null, null, null];
    zeige[i] = WERT(w[i]); zeige[j] = GESUCHT(NAMEN_G[j], w[j]);
    const scheitel = (i + 2) % 4 === j, fl = scheitel ? [[180 - w[i], 'scheitel-neben-verwechselt']] : [[w[i], 'nebenwinkel-gleich'], [360 - w[i], 'gestreckt-voll']];
    return grad(text(NAMEN_G[j]), w[j], fl, hilfen(w[i]), { bild: kr(n, a, zeige), nachweis: [FIG(NAMEN_G[j]), ...(scheitel ? [] : [R(`180° − ${w[i]}° = ${w[j]}°`)])] }); };
  const alleDrei = (n, i, text) => { const a = alphaFuer(n), w = werte(a), zeige = NAMEN_G.map((x, k) => (k === i ? WERT(w[k]) : GESUCHT(x, w[k])));
    const andere = [0, 1, 2, 3].filter((k) => k !== i), nm = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' };
    const fl = (k) => ((k + 2) % 4 === i ? [[180 - w[k], 'scheitel-neben-verwechselt']] : [[w[i], 'nebenwinkel-gleich']]);
    return luecken(Z(...text, ...andere.map((k) => `${NAMEN_G[k]} = {{${nm[k]}}}°`)), Object.fromEntries(andere.map((k) => [nm[k], lk(w[k], fl(k))])), hAlle(n, w[i]),
      { bild: kr(n, a, zeige), nachweis: [...andere.map((k) => FIG(NAMEN_G[k], { luecke: nm[k] })), R(`180° − ${w[i]}° = ${180 - w[i]}°`)] }); };
  const namenBild = (n, a) => kr(n, a, NAMEN_G.map((x) => NAME(x)));

  sechs(W1, 'F', [
    () => einer('F', 0, 2, (x) => Z('Die Geraden g und h schneiden sich.', 'Gegenüberliegende Winkel sind gleich groß.', `Gib ${x} an.`), (w) => hScheitel('F')),
    () => einer('F', 0, 1, (x) => Z('Die Geraden g und h schneiden sich.', 'Nebeneinander ergeben zwei Winkel 180°.', `Berechne ${x}.`), (w) => hNeben('F', w)),
    () => { const a = alphaFuer('F');
      return auswahl(Z('Die Geraden g und h schneiden sich.', 'Welcher Winkel liegt α genau gegenüber?', 'Kreuze ihn an.'), [opt('β', false, 'scheitel-neben-verwechselt'), opt('γ', true), opt('δ', false, 'scheitel-neben-verwechselt')], hScheitel('F'),
        { bild: namenBild('F', a), nachweis: [BEZ(['α'], 'scheitel', { frage: 'α' })] }); },
    () => einer('F', 1, 0, (x) => Z('Die Geraden g und h schneiden sich.', 'Nebeneinander ergeben zwei Winkel 180°.', `Berechne ${x}.`), (w) => hNeben('F', w)),
    () => alleDrei('F', 0, ['Die Geraden g und h schneiden sich.', 'Berechne die anderen drei Winkel.']),
    () => einer('F', 1, 3, (x) => Z('Die Geraden g und h schneiden sich.', 'Gegenüberliegende Winkel sind gleich groß.', `Gib ${x} an.`), () => hScheitel('F')),
  ]);
  sechs(W1, 'G', [
    () => einer('G', wahl([0, 2]), wahl([1, 3]), (x) => Z('Die Geraden g und h schneiden sich.', `Berechne den Nebenwinkel ${x}.`), (w) => hNeben('G', w)),
    () => { const a = alphaFuer('G'), [p, q, welche] = wahl([['α', 'β', 'neben'], ['β', 'δ', 'scheitel'], ['γ', 'δ', 'neben'], ['α', 'γ', 'scheitel']]);
      return auswahl(Z('Die Geraden g und h schneiden sich.', `Wie heißen ${p} und ${q} zueinander?`, 'Kreuze an.'), grundOptionen(welche), hilfeBegriff('G'), { bild: namenBild('G', a), nachweis: [BEZ([p, q], welche)] }); },
    () => alleDrei('G', zz(0, 3), ['Die Geraden g und h schneiden sich.', 'Berechne die anderen drei Winkel.']),
    () => einer('G', wahl([1, 3]), wahl([1, 3]) === 1 ? 3 : 1, (x) => Z('Die Geraden g und h schneiden sich.', `Gib den Scheitelwinkel ${x} an.`), () => hScheitel('G')),
    () => { const a = 5 * zz(5, 14), zeige = [WERT(a), GESUCHT('β', 180 - a), null, null];
      return grad(Z('Eine Schere ist geöffnet.', `Die beiden Klingen bilden einen Winkel von ${a}°.`, 'Die Schere bildet zwei Geraden.', 'Sie schneiden sich.', 'Berechne den Nebenwinkel β.'), 180 - a, [[a, 'nebenwinkel-gleich']], hNeben('G', a),
        { bild: kr('G', a, zeige, { geraden: [null, null] }), nachweis: [FIG('β'), R(`180° − ${a}° = ${180 - a}°`)] }); },
    () => { const a = alphaFuer('G'), b = 180 - a, k = kind();
      return auswahl(Z(`${k} rechnet: β = 180° − ${a}° = ${b}°.`, `Warum darf ${k} so rechnen?`, 'Kreuze die richtige Begründung an.'),
        [opt('α und β sind Nebenwinkel. Zusammen sind sie 180°.', true), opt('α und β sind Scheitelwinkel. Zusammen sind sie 180°.', false, 'scheitel-neben-verwechselt'), opt('An einer Kreuzung sind alle Winkel zusammen 180°.', false, 'gestreckt-voll')],
        hilfeBegriff('G'), { bild: kr('G', a, [WERT(a), NAME('β'), null, null]), nachweis: [BEZ(['α', 'β'], 'neben'), R(`180° − ${a}° = ${b}°`)] }); },
  ]);
  sechs(W1, 'M', [
    () => alleDrei('M', zz(0, 3), ['Die Geraden g und h schneiden sich.', 'Berechne die anderen drei Winkel.']),
    () => { const a = alphaFuer('M'), i = zz(0, 3), j = wahl([(i + 1) % 4, (i + 3) % 4]), w = werte(a), zeige = [null, null, null, null];
      zeige[i] = WERT(w[i]); zeige[j] = GESUCHT(NAMEN_G[j], w[j]);
      return sach(`Die Geraden g und h schneiden sich. Bestimme ${NAMEN_G[j]} und gib den Grund an.`, [teil(`${NAMEN_G[j]} =`, w[j], '°', [{ wert: w[i], fehlvorstellung: 'nebenwinkel-gleich' }]), teilWahl('antwort', 'Grund:', grundOptionen('neben'))],
        hNeben('M', w[i]), { bild: kr('M', a, zeige), nachweis: [FIG(NAMEN_G[j], { teil: 0 }), BEZ([NAMEN_G[i], NAMEN_G[j]], 'neben', { teil: 1 }), R(`180° − ${w[i]}° = ${w[j]}°`)] }); },
    () => { const [x, y] = suche(() => [zz(35, 80), zz(35, 80)], ([p, q]) => p + q <= 125 && p !== q); const z = 180 - x - y;
      return grad(`Drei Geraden schneiden sich in einem Punkt. Bestimme γ.`, z, [[360 - x - y, 'gestreckt-voll'], [x + y, 'nebenwinkel-gleich']], H('M', 'Die drei Winkel liegen nebeneinander an einer Geraden.', `Rechne 180° − ${x}° − ${y}°.`),
        { bild: buendel('M', [x, y, z], [WERT(x), WERT(y), GESUCHT('γ', z)]), nachweis: [FIG('γ'), R(`180° − ${x}° − ${y}° = ${z}°`)] }); },
    () => { const a = alphaFuer('M');
      return auswahl('Die Geraden g und h schneiden sich. Welche Winkel sind Nebenwinkel von β? Kreuze alle an.', [opt('α', true), opt('γ', true), opt('δ', false, 'scheitel-neben-verwechselt')], hilfeBegriff('M'), { mehrfach: true, bild: namenBild('M', a), nachweis: [BEZ(['β'], 'neben', { frage: 'β' })] }); },
    () => { const a = suche(() => zz(25, 75), (x) => x % 5 !== 0), s = 2 * a;
      return grad(`Die Geraden g und h schneiden sich. Die Winkel α und γ sind zusammen ${s}° groß. Berechne β.`, 180 - a, [[180 - s, 'scheitel-neben-verwechselt'], [a, 'nebenwinkel-gleich']], H('M', 'α und γ sind Scheitelwinkel, also gleich groß.', `α = ${s}° : 2 = ${a}°.`),
        { bild: kr('M', a, [NAME('α'), GESUCHT('β', 180 - a), NAME('γ'), null]), nachweis: [`${s}° : 2 = ${a}°`, R(`180° − ${a}° = ${180 - a}°`), FIG('β')] }); },
    () => { const k = kind();
      return auswahl(`${k} sagt: „Nebenwinkel sind nie gleich groß.“ Überprüfe die Aussage. Kreuze die richtige Antwort an.`,
        [opt('Das stimmt nicht. Sind beide 90° groß, sind sie gleich groß.', true), opt('Das stimmt. Zusammen ergeben sie 180°, also ist immer einer größer.', false, 'nebenwinkel-gleich'), opt('Das stimmt. Nur Scheitelwinkel können gleich groß sein.', false, 'scheitel-neben-verwechselt'), opt('Das stimmt nicht. Nebenwinkel sind immer gleich groß.', false, 'nebenwinkel-gleich')],
        H('M', 'Suche ein Beispiel: Welche zwei gleich großen Winkel ergeben zusammen 180°?', '90° + 90° = 180°.'), { nachweis: [{ art: 'urteil', stimmt: false }, '90° + 90° = 180°'] }); },
  ]);
  sechs(W1, 'E', [
    () => alleDrei('E', zz(0, 3), ['Die Geraden g und h schneiden sich.', 'Berechne die anderen drei Winkel.']),
    () => { const k = wahl([2, 3, 4, 5, 8, 9]), a = 180 / (k + 1);
      return grad(`Die Geraden g und h schneiden sich. Der Winkel β ist ${k}-mal so groß wie α. Bestimme α.`, a, [[180 / k, 'gestreckt-voll'], [360 / (k + 1), 'gestreckt-voll'], [k * a, 'scheitel-neben-verwechselt']], H('E', `α und β sind zusammen 180°. Zusammen sind das ${k + 1} gleich große Teile.`),
        { bild: kr('E', a, [GESUCHT('α', a), NAME('β'), null, null]), nachweis: [`180° : ${k + 1} = ${a}°`, FIG('α')] }); },
    () => { const d = 2 * zz(8, 45), a = (180 - d) / 2;
      return grad(`Die Geraden g und h schneiden sich. Der Winkel β ist um ${d}° größer als α. Bestimme α.`, a, [[180 - d, 'gestreckt-voll'], [a + d, 'scheitel-neben-verwechselt']], H('E', `Nimmst du von 180° die ${d}° weg, bleiben zwei gleich große Winkel.`),
        { bild: kr('E', a, [GESUCHT('α', a), NAME('β'), null, null]), nachweis: [R(`180° − ${d}° = ${180 - d}°`), `${180 - d}° : 2 = ${a}°`, FIG('α')] }); },
    () => { const a = suche(() => zz(41, 79), (x) => x % 5 !== 0), k = kind();
      return auswahl(`Die Geraden g und h schneiden sich. ${k} rechnet: „γ = 180° − ${a}° = ${180 - a}°.“ Finde den Fehler. Kreuze die richtige Erklärung an.`,
        [opt(`γ liegt α gegenüber. Scheitelwinkel sind gleich groß, also ist γ = ${a}°.`, true), opt(`γ ist der Nebenwinkel von α. Die Rechnung ist richtig.`, false, 'scheitel-neben-verwechselt'), opt(`Um den Punkt sind es 360°. Richtig ist 360° − ${a}° = ${360 - a}°.`, false, 'gestreckt-voll'), opt(`γ ist halb so groß wie α.`, false, 'scheitel-neben-verwechselt')],
        H('E', 'Wo liegt γ im Bild: neben α oder gegenüber von α?'), { bild: kr('E', a, [WERT(a), null, NAME('γ'), null]), nachweis: [BEZ(['α', 'γ'], 'scheitel'), { art: 'urteil', stimmt: false }] }); },
    () => { const [x, y] = suche(() => [zz(30, 80), zz(30, 80)], ([p, q]) => p + q <= 130 && Math.abs(p - q) >= 6); const z = 180 - x - y;
      // Der bekannte zweite Winkel liegt gegenüber: Er ist der Scheitelwinkel des mittleren Winkels.
      return grad('Drei Geraden schneiden sich in einem Punkt. Bestimme φ.', z, [[180 - x, 'scheitel-neben-verwechselt'], [360 - x - y, 'gestreckt-voll']], H('E', 'Suche zu jedem Winkel seinen Scheitelwinkel. Drei Winkel nebeneinander ergeben 180°.'),
        { bild: buendel('E', [x, y, z], [WERT(x), null, GESUCHT('φ', z), null, WERT(y), null]), nachweis: [BEZ(['β*', 'β'], 'scheitel', { aus: 'buendel' }), R(`180° − ${x}° − ${y}° = ${z}°`), FIG('φ')] }); },
    () => ordnen('Die Geraden g und h schneiden sich. Begründe, warum α und γ gleich groß sind. Ordne die Schritte.',
      ['α + β = 180°, denn α und β sind Nebenwinkel.', 'β + γ = 180°, denn β und γ sind Nebenwinkel.', 'Also ist α + β = β + γ.', 'Nimm auf beiden Seiten β weg: α = γ.'],
      H('E', 'Beginne mit den beiden Nebenwinkeln von β.'), { bild: namenBild('E', alphaFuer('E')) }),
  ]);
}
const hilfeBegriff = (n) => H(n, 'Nebenwinkel liegen nebeneinander an einer Geraden. Scheitelwinkel liegen sich gegenüber.', 'α und β sind Nebenwinkel. α und γ sind Scheitelwinkel.', 'Liegen die beiden Winkel nebeneinander oder gegenüber?');

// Drei Geraden durch einen Punkt: Winkel w[0], w[1], w[2] liegen nebeneinander, gegenüber wiederholen sie sich.
// zeige: drei oder sechs Einträge (die Winkel 1 bis 6 gegen den Uhrzeigersinn).
function buendel(n, w, zeige) {
  const dreh = n === 'F' ? 0 : zz(-25, 25), lang = 3, S = [0, 0];
  const richt = [0, w[0], w[0] + w[1], 180, 180 + w[0], 180 + w[0] + w[1]].map((x) => x + dreh);
  const enden = Object.fromEntries(richt.map((r, i) => [`E${i}`, plus(S, dir(r), lang)]));
  const winkel = zeige.map((z, i) => (z ? ['S', `E${i}`, `E${(i + 1) % 6}`, { farbe: i % 3, ...z }] : null)).filter(Boolean);
  return figur({ punkte: { S, ...enden }, versteckt: Object.keys(enden), ohneName: ['S'], linien: [['E3', 'E0'], ['E4', 'E1'], ['E5', 'E2']], winkel });
}

// ---------- W2: Stufen- und Wechselwinkel ----------
function w2() {
  const hStufen = (n) => H(n, 'Stufenwinkel liegen an beiden Parallelen an derselben Stelle. Sie sind gleich groß.', 'Ist α = 60°, dann ist auch α′ = 60°.', 'Suche den Winkel, der an der anderen Geraden genauso liegt.');
  const hWechsel = (n) => H(n, 'Wechselwinkel liegen an verschiedenen Seiten der Geraden s, einer oben, einer unten. An Parallelen sind sie gleich groß.', 'Ist γ = 60°, dann ist auch α′ = 60°.', 'Wechselwinkel bilden zusammen ein Z.');
  const hZwei = (n, a) => H(n, 'Gehe in zwei Schritten: erst zum Stufenwinkel, dann zum Nebenwinkel.', 'Ist α = 60°, dann ist α′ = 60° und β′ = 120°.', `Der Nebenwinkel von ${a}° ist 180° − ${a}° = ${180 - a}°.`);
  const alphaP = (n) => suche(() => winkelFuer(n, 45, 135), (a) => a !== 90);
  const drehP = (n) => (n === 'F' ? 0 : n === 'G' ? 5 * zz(-4, 4) : zz(-20, 20));
  const pb = (n, a, zg, zh, o = {}) => parallelen(a, zg, zh, { dreh: drehP(n), ...o });
  const vier = (a) => [a, 180 - a, a, 180 - a];
  // Ein Winkel an g bekannt (Lage i), einer an h gesucht (Lage j).
  const einer = (n, i, j, text, hilfen, fl = []) => { const a = alphaP(n), w = vier(a), zg = [null, null, null, null], zh = [null, null, null, null];
    zg[i] = WERT(w[i]); zh[j] = GESUCHT(NAMEN_H[j], w[j]);
    const gleich = w[i] === w[j];
    return grad(text(NAMEN_G[i], NAMEN_H[j]), w[j], gleich ? [[180 - w[i], 'scheitel-neben-verwechselt'], ...fl] : [[w[i], 'nebenwinkel-gleich'], ...fl], hilfen(w[i]),
      { bild: pb(n, a, zg, zh), nachweis: [FIG(NAMEN_H[j]), ...(gleich ? [] : [R(`180° − ${w[i]}° = ${w[j]}°`)])] }); };
  const namenBild = (n, a) => pb(n, a, NAMEN_G.map((x) => NAME(x)), NAMEN_H.map((x) => NAME(x)));
  const SATZ = 'Die Geraden g und h sind parallel.';
  sechs(W2, 'F', [
    () => einer('F', 0, 0, (x, y) => Z(SATZ, `${x} und ${y} sind Stufenwinkel.`, 'Stufenwinkel sind gleich groß.', `Gib ${y} an.`), () => hStufen('F')),
    () => { const a = alphaP('F');
      return auswahl(Z(SATZ, 'Welcher Winkel ist der Stufenwinkel zu β?', 'Kreuze ihn an.'), [opt(`β${STRICH}`, true), opt(`δ${STRICH}`, false, 'stufen-wechsel-verwechselt'), opt('δ', false, 'scheitel-neben-verwechselt')], hStufen('F'),
        { bild: namenBild('F', a), nachweis: [BEZ(['β'], 'stufen', { frage: 'β' })] }); },
    () => einer('F', 2, 0, (x, y) => Z(SATZ, `${x} und ${y} sind Wechselwinkel.`, 'Wechselwinkel sind gleich groß.', `Gib ${y} an.`), () => hWechsel('F')),
    () => einer('F', 3, 3, (x, y) => Z(SATZ, `${x} und ${y} sind Stufenwinkel.`, 'Stufenwinkel sind gleich groß.', `Gib ${y} an.`), () => hStufen('F')),
    () => { const a = alphaP('F'), b = 180 - a;
      return grad(Z(SATZ, 'Gehe in zwei Schritten.', `Berechne β${STRICH}.`), b, [[a, 'nebenwinkel-gleich']], hZwei('F', a),
        { bild: pb('F', a, [WERT(a), null, null, null], [NAME(`α${STRICH}`), GESUCHT(`β${STRICH}`, b), null, null]), nachweis: [BEZ(['α', `α${STRICH}`], 'stufen'), R(`180° − ${a}° = ${b}°`), FIG(`β${STRICH}`)] }); },
    () => { const a = alphaP('F'), w = vier(a);
      return grad(Z(SATZ, `γ${STRICH} und γ sind Stufenwinkel.`, 'Gib γ an.'), w[2], [[180 - w[2], 'scheitel-neben-verwechselt']], hStufen('F'),
        { bild: pb('F', a, [null, null, GESUCHT('γ', w[2]), null], [null, null, WERT(w[2]), null]), nachweis: [FIG('γ')] }); },
  ]);
  sechs(W2, 'G', [
    () => { const i = zz(0, 3); return einer('G', i, i, (x, y) => Z(SATZ, `Berechne den Stufenwinkel ${y}.`), () => hStufen('G')); },
    () => { const a = alphaP('G'), [p, q, welche] = wahl([['α', `α${STRICH}`, 'stufen'], ['γ', `α${STRICH}`, 'wechsel'], ['δ', `β${STRICH}`, 'wechsel'], ['β', `β${STRICH}`, 'stufen']]);
      return auswahl(Z(SATZ, `Wie heißen ${p} und ${q} zueinander?`, 'Kreuze an.'), grundOptionen(welche, ['stufen', 'wechsel', 'scheitel']), hStufen('G'), { bild: namenBild('G', a), nachweis: [BEZ([p, q], welche)] }); },
    () => { const a = alphaP('G'), w = vier(a), i = zz(0, 3);
      const zg = [null, null, null, null]; zg[i] = WERT(w[i]);
      const zh = NAMEN_H.map((x, k) => (k === i || k === (i + 1) % 4 ? GESUCHT(x, w[k]) : null)), j = (i + 1) % 4, nm = ['x', 'y'];
      return luecken(Z(SATZ, 'Berechne die beiden Winkel an h.', `${NAMEN_H[i]} = {{x}}°`, `${NAMEN_H[j]} = {{y}}°`), { x: lk(w[i], [[180 - w[i], 'scheitel-neben-verwechselt']]), y: lk(w[j], [[w[i], 'nebenwinkel-gleich']]) }, hZwei('G', w[i]),
        { bild: pb('G', a, zg, zh), nachweis: [FIG(NAMEN_H[i], { luecke: 'x' }), FIG(NAMEN_H[j], { luecke: 'y' }), R(`180° − ${w[i]}° = ${w[j]}°`)] }); },
    () => { const [i, j] = wahl([[2, 0], [3, 1], [0, 2], [1, 3]]); return einer('G', i, j, (x, y) => Z(SATZ, `Berechne den Wechselwinkel ${y}.`), () => hWechsel('G')); },
    () => { const a = 5 * zz(9, 16);
      return grad(Z('Zwei Gleise liegen parallel.', `Eine Straße kreuzt sie unter einem Winkel von ${a}°.`, 'Berechne den Winkel β′ am zweiten Gleis.'), 180 - a, [[a, 'nebenwinkel-gleich']], hZwei('G', a),
        { bild: pb('G', a, [WERT(a), null, null, null], [null, GESUCHT(`β${STRICH}`, 180 - a), null, null], { namen: [null, null, null] }), nachweis: [BEZ(['α', `α${STRICH}`], 'stufen'), R(`180° − ${a}° = ${180 - a}°`), FIG(`β${STRICH}`)] }); },
    () => { const a = alphaP('G'), k = kind();
      return auswahl(Z(SATZ, `${k} sagt: „α${STRICH} ist so groß wie α.“`, 'Kreuze die richtige Begründung an.'),
        [opt('α und α′ sind Stufenwinkel an Parallelen.', true), opt('α und α′ sind Nebenwinkel.', false, 'scheitel-neben-verwechselt'), opt('Alle Winkel im Bild sind gleich groß.', false, 'nebenwinkel-gleich')],
        hStufen('G'), { bild: pb('G', a, [NAME('α'), null, null, null], [NAME(`α${STRICH}`), null, null, null]), nachweis: [BEZ(['α', `α${STRICH}`], 'stufen')] }); },
  ]);
  sechs(W2, 'M', [
    () => { const a = alphaP('M'), w = vier(a), i = zz(0, 3), zg = [null, null, null, null]; zg[i] = WERT(w[i]); const nm = ['p', 'q', 'r', 's'];
      return luecken(Z(`${SATZ} Berechne die vier Winkel an h.`, ...NAMEN_H.map((x, k) => `${x} = {{${nm[k]}}}°`)), Object.fromEntries(nm.map((x, k) => [x, lk(w[k], w[k] === w[i] ? [[180 - w[k], 'scheitel-neben-verwechselt']] : [[w[i], 'nebenwinkel-gleich']])])), hZwei('M', w[i]),
        { bild: pb('M', a, zg, NAMEN_H.map((x, k) => GESUCHT(x, w[k]))), nachweis: [...nm.map((x, k) => FIG(NAMEN_H[k], { luecke: x })), R(`180° − ${w[i]}° = ${180 - w[i]}°`)] }); },
    () => { const a = alphaP('M'), w = vier(a), [i, j, welche] = wahl([[0, 0, 'stufen'], [2, 0, 'wechsel'], [3, 1, 'wechsel'], [1, 1, 'stufen']]), zg = [null, null, null, null], zh = [null, null, null, null];
      zg[i] = WERT(w[i]); zh[j] = GESUCHT(NAMEN_H[j], w[j]);
      return sach(`${SATZ} Bestimme ${NAMEN_H[j]} und gib den Grund an.`, [teil(`${NAMEN_H[j]} =`, w[j], '°', [{ wert: 180 - w[i], fehlvorstellung: 'scheitel-neben-verwechselt' }]), teilWahl('antwort', 'Grund:', grundOptionen(welche, ['stufen', 'wechsel', 'neben']))],
        hStufen('M'), { bild: pb('M', a, zg, zh), nachweis: [FIG(NAMEN_H[j], { teil: 0 }), BEZ([NAMEN_G[i], NAMEN_H[j]], welche, { teil: 1 })] }); },
    () => { const a = zz(48, 76);
      return grad(`Eine Leiter lehnt schräg an zwei parallelen Stangen eines Gerüsts. Unten bildet sie mit der Stange den Winkel ${a}°. Berechne den Winkel δ′ an der oberen Stange.`, 180 - a, [[a, 'nebenwinkel-gleich']], hZwei('M', a),
        { bild: pb('M', a, [null, null, null, GESUCHT('δ′', 180 - a)], [WERT(a), null, null, null], { namen: [null, null, null] }), nachweis: [BEZ([`α${STRICH}`, 'α'], 'stufen'), R(`180° − ${a}° = ${180 - a}°`), FIG('δ′')] }); },
    () => { const a = alphaP('M');
      return auswahl(`${SATZ} Welche Winkel sind so groß wie α? Kreuze alle an.`, [opt('γ', true), opt(`α${STRICH}`, true), opt(`γ${STRICH}`, true), opt('β', false, 'nebenwinkel-gleich'), opt(`δ${STRICH}`, false, 'stufen-wechsel-verwechselt')], hStufen('M'),
        { mehrfach: true, bild: namenBild('M', a), nachweis: [BEZ(['α'], 'gleich', { frage: 'α' })] }); },
    () => { const a = zz(55, 80), k = suche(() => zz(-5, 5), (x) => Math.abs(x) >= 2), b = a - k;
      return auswahl(`Die Gerade s schneidet g und h. Es ist α = ${a}° und α′ = ${b}°. Sind g und h parallel? Kreuze die richtige Antwort an.`,
        [opt(`Nein. An Parallelen wären die Stufenwinkel α und α′ gleich groß.`, true), opt('Ja. Die beiden Winkel sind fast gleich groß.', false, 'ohne-parallele'), opt(`Ja. α und α′ sind Stufenwinkel, also sind g und h parallel.`, false, 'ohne-parallele')],
        H('M', 'Bei parallelen Geraden sind Stufenwinkel genau gleich groß.', `Vergleiche ${a}° und ${b}°.`), { bild: parallelen(a, [WERT(a, { n: 'α' }), null, null, null], [WERT(b, { n: `α${STRICH}` }), null, null, null], { dreh: zz(-10, 10), knick: k }), nachweis: [{ art: 'urteil', stimmt: false }, BEZ(['α', `α${STRICH}`], 'stufen', { parallel: false })] }); },
    () => { const a = alphaP('M');
      return sach(`${SATZ} Es ist α = ${a}°. Bestimme γ′ in zwei Schritten. Gib jeweils den Grund an.`,
        [teil(`α${STRICH} =`, a, '°', [{ wert: 180 - a, fehlvorstellung: 'scheitel-neben-verwechselt' }]), teilWahl('antwort', `Grund für α${STRICH}:`, grundOptionen('stufen', ['stufen', 'wechsel', 'neben'])),
          teil(`γ${STRICH} =`, a, '°', [{ wert: 180 - a, fehlvorstellung: 'scheitel-neben-verwechselt' }]), teilWahl('antwort', `Grund für γ${STRICH}:`, grundOptionen('scheitel', ['scheitel', 'neben', 'stufen']))],
        H('M', 'Gehe von α zum Stufenwinkel an h und dann zu seinem Scheitelwinkel.', `α${STRICH} und γ${STRICH} liegen sich gegenüber.`),
        { bild: pb('M', a, [WERT(a), null, null, null], [NAME(`α${STRICH}`), null, GESUCHT(`γ${STRICH}`, a), null]), nachweis: [BEZ(['α', `α${STRICH}`], 'stufen', { teil: 1 }), BEZ([`α${STRICH}`, `γ${STRICH}`], 'scheitel', { teil: 3 }), FIG(`α${STRICH}`, { teil: 0 }), FIG(`γ${STRICH}`, { teil: 2 })] }); },
  ]);
  sechs(W2, 'E', [
    () => { const a = alphaP('E'), w = vier(a), i = zz(0, 3), j = zz(0, 3), zh = [null, null, null, null]; zh[j] = WERT(w[j]); const nm = ['p', 'q', 'r', 's'];
      return luecken(Z(`${SATZ} Berechne die vier Winkel an g.`, ...NAMEN_G.map((x, k) => `${x} = {{${nm[k]}}}°`)), Object.fromEntries(nm.map((x, k) => [x, lk(w[k], w[k] === w[j] ? [[180 - w[k], 'scheitel-neben-verwechselt']] : [[w[j], 'nebenwinkel-gleich']])])), H('E', 'Gehe vom bekannten Winkel an h zu seinem Stufenwinkel an g.'),
        { bild: pb('E', a, NAMEN_G.map((x, k) => GESUCHT(x, w[k])), zh), nachweis: [...nm.map((x, k) => FIG(NAMEN_G[k], { luecke: x })), R(`180° − ${w[j]}° = ${180 - w[j]}°`)] }); },
    () => { const a = zz(58, 82), k = suche(() => zz(-6, 6), (x) => Math.abs(x) >= 3), b = 180 - a + k;
      return auswahl(`Die Gerade s schneidet g und h. Es ist γ = ${a}° und β′ = ${b}°. Überprüfe, ob g und h parallel sind. Kreuze die richtige Antwort an.`,
        [opt(`Nein. Bei Parallelen wäre α′ = γ = ${a}°, dann wäre β′ = ${180 - a}°.`, true), opt(`Ja. γ und β′ sind zusammen ${a + b}°, das ist ungefähr 180°.`, false, 'ohne-parallele'), opt(`Ja. γ und β′ sind Wechselwinkel.`, false, 'stufen-wechsel-verwechselt')],
        H('E', 'Rechne aus, wie groß β′ bei Parallelen sein müsste.'), { bild: parallelen(a, [null, null, WERT(a, { n: 'γ' }), null], [null, WERT(b, { n: `β${STRICH}` }), null, null], { dreh: zz(-10, 10), knick: k }), nachweis: [{ art: 'urteil', stimmt: false }, R(`180° − ${a}° = ${180 - a}°`), BEZ(['γ', `α${STRICH}`], 'wechsel', { parallel: false })] }); },
    () => { const [x, y] = suche(() => [zz(25, 60), zz(25, 60)], ([p, q]) => Math.abs(p - q) >= 8 && p + q <= 110);
      return grad('Die Geraden g und h sind parallel. Bestimme den Winkel φ am Knick.', x + y, [[180 - x - y, 'scheitel-neben-verwechselt'], [Math.abs(x - y), 'stufen-wechsel-verwechselt']], H('E', 'Zeichne durch den Knick eine dritte Parallele. Dann findest du zwei Wechselwinkel.'),
        { bild: zickzack(x, y), nachweis: [R(`${x}° + ${y}° = ${x + y}°`), FIG('φ')] }); },
    () => { const a = zz(56, 78), k = suche(() => zz(-7, 7), (x) => Math.abs(x) >= 4), kd = kind();
      return auswahl(`Die Gerade s schneidet g und h. ${kd} sagt: „α = ${a}°, also ist auch α′ = ${a}°.“ Im Bild misst α′ aber ${a - k}°. Erkläre den Fehler. Kreuze die richtige Erklärung an.`,
        [opt('Stufenwinkel sind nur an Parallelen gleich groß. g und h sind nicht parallel.', true), opt('α und α′ sind keine Stufenwinkel, sondern Nebenwinkel.', false, 'scheitel-neben-verwechselt'), opt('Man hat falsch gemessen. Stufenwinkel sind immer gleich groß, an allen Geraden.', false, 'ohne-parallele'), opt('α′ ist der Wechselwinkel von α.', false, 'stufen-wechsel-verwechselt')],
        H('E', 'Wann gilt die Regel für Stufenwinkel?'), { bild: parallelen(a, [WERT(a, { n: 'α' }), null, null, null], [WERT(a - k, { n: `α${STRICH}` }), null, null, null], { dreh: zz(-10, 10), knick: k }), nachweis: [{ art: 'urteil', stimmt: false }, BEZ(['α', `α${STRICH}`], 'stufen', { parallel: false })] }); },
    () => { const k = wahl([2, 3, 4, 5]), a = 180 / (k + 1);
      return grad(`Die Geraden g und h sind parallel. Der Winkel β′ ist ${k}-mal so groß wie α. Bestimme α.`, a, [[180 / k, 'gestreckt-voll'], [k * a, 'stufen-wechsel-verwechselt']], H('E', 'β′ und α′ sind Nebenwinkel. Und α′ ist der Stufenwinkel von α.'),
        { bild: pb('E', a, [GESUCHT('α', a), null, null, null], [null, NAME(`β${STRICH}`), null, null]), nachweis: [`180° : ${k + 1} = ${a}°`, FIG('α')] }); },
    () => ordnen(`${SATZ} Begründe, warum die Wechselwinkel γ und α′ gleich groß sind. Ordne die Schritte.`,
      ['α und α′ sind Stufenwinkel an Parallelen, also ist α = α′.', 'α und γ sind Scheitelwinkel, also ist α = γ.', 'Beide sind so groß wie α.', 'Also ist γ = α′.'],
      H('E', 'Gehe über den Winkel α.'), { bild: pb('E', alphaP('E'), [NAME('α'), null, NAME('γ'), null], [NAME(`α${STRICH}`), null, null, null]) }),
  ]);
}
// Zwei Parallelen mit einem Knick dazwischen: Der Winkel am Knick ist die Summe der beiden Winkel an g und h.
function zickzack(x, y) {
  const P = [0, 0], d = 1.5, Q = plus(P, dir(180 - x), d / Math.sin((x * Math.PI) / 180)), Rr = plus(P, dir(180 + y), d / Math.sin((y * Math.PI) / 180));
  const G1 = [Q[0] + 3.4, Q[1]], G2 = [Q[0] - 1.2, Q[1]], H1 = [Rr[0] + 3.4, Rr[1]], H2 = [Rr[0] - 1.2, Rr[1]];
  return figur({ punkte: { P, Q, R: Rr, G1, G2, H1, H2 }, versteckt: ['G1', 'G2', 'H1', 'H2'], ohneName: ['P', 'Q', 'R'],
    linien: [['G2', 'G1', { n: 'g' }], ['H2', 'H1', { n: 'h' }], ['Q', 'P'], ['P', 'R']],
    winkel: [['Q', 'G1', 'P', { wert: x, farbe: 0 }], ['R', 'H1', 'P', { wert: y, farbe: 1 }], ['P', 'Q', 'R', { n: 'φ', wert: x + y, frage: true, farbe: 2 }]] });
}

export function geradenkreuzung() { w1(); w2(); }
