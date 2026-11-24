// Aufgaben zum Abstecher 7.1.X1 „Das Koordinatensystem“ (Lernziel K1) nach ADR 0015 und ADR 0043.
// Grilling mit Nils (2026-11-24): F und G lesen Punkte ab und tragen sie durch Tippen ein, M bestimmt den Quadranten und
// den vierten Eckpunkt eines Rechtecks, E spiegelt an den Achsen.
// Typische Fehler: Koordinaten vertauscht, Vorzeichen einer Koordinate nicht beachtet.

import { sechs, auswahl, luecken, gitterPunkte, B, Z } from '../werkzeug.mjs';
import { zt, opt, zz, wahl, mische, lk, koord, pkt, H, BILD, kind } from './7-1-rational.mjs';

const K1 = '7.1.X1-K1';
const tausch = ([x, y]) => [y, x];
// Ein Punkt in einem der Quadranten II, III oder IV (oder in einem bestimmten), mit verschiedenen Beträgen.
const VZ = { I: [1, 1], II: [-1, 1], III: [-1, -1], IV: [1, -1] };
const punkt = (r, quadranten = ['II', 'III', 'IV']) => { for (;;) { const [vx, vy] = VZ[wahl(quadranten)], x = zz(1, r), y = zz(1, r); if (x !== y) return [vx * x, vy * y]; } };
const pos = ([x, y]) => (y >= 0 ? (x >= 0 ? 'ro' : 'lo') : x >= 0 ? 'ru' : 'lu');
const P = (n, p) => [n, p[0], p[1], pos(p)];
const drin = (r) => ([x, y]) => Math.abs(x) <= r && Math.abs(y) <= r;
// Falsche Punkte: vertauscht, Vorzeichen der x- oder der y-Koordinate falsch.
const fehlerPunkt = (p, r) => [[[tausch(p)], 'koord-vertauscht'], [[[-p[0], p[1]]], 'koord-vorzeichen'], [[[p[0], -p[1]]], 'koord-vorzeichen']].filter(([q]) => q.every(drin(r)) && String(q[0]) !== String(p)).filter(([q], i, l) => l.findIndex(([x]) => String(x) === String(q)) === i);
const eintragen = (text, r, ps, hilfen, extra = {}) => gitterPunkte(text, koord(r, extra.punkte ?? []), ps, ps.length === 1 ? fehlerPunkt(ps[0], r) : [[ps.map(tausch), 'koord-vertauscht']].filter(([q]) => q.every(drin(r))), hilfen, { nachweis: [extra.beweis ?? { art: 'eintragen' }] });
const ablesenWahl = (text, r, name, p, hilfen, mehr = []) => auswahl(text, [opt(pkt(p), true), opt(pkt(tausch(p)), false, 'koord-vertauscht'), opt(pkt([-p[0], p[1]]), false, 'koord-vorzeichen')], hilfen, { bild: B.gitter(koord(r, [P(name, p), ...mehr])), nachweis: [{ art: 'punkt', name }] });
const quadrant = (text, p, hilfen, beweis) => { const r = p[0] > 0 ? (p[1] > 0 ? 'I' : 'IV') : p[1] > 0 ? 'II' : 'III';
  const spiegelX = p[1] > 0 ? (p[0] > 0 ? 'IV' : 'III') : p[0] > 0 ? 'I' : 'II';
  return auswahl(text, ['I', 'II', 'III', 'IV'].map((q) => opt(`${q}. Quadrant`, q === r, q === r ? undefined : q === spiegelX ? 'koord-vorzeichen' : 'koord-vertauscht')), hilfen, { nachweis: [beweis ?? { art: 'quadrant', punkt: p }] }); };

export function koordinaten() {
  const hLesen = (n) => H(n, 'Gehe vom Nullpunkt erst nach rechts oder links. Gehe dann nach oben oder unten.', 'Der Punkt (−3|2) liegt 3 nach links und 2 nach oben.', 'Die erste Zahl gehört zur x-Achse. Links vom Nullpunkt ist sie negativ.');
  const hSetzen = (n) => H(n, 'Die erste Zahl sagt: nach rechts oder links. Die zweite Zahl sagt: nach oben oder unten.', 'Für (−2|−4) gehst du 2 nach links und 4 nach unten.', 'Starte im Nullpunkt. Ein Minus bei der ersten Zahl heißt links, bei der zweiten Zahl unten.');
  sechs(K1, 'F', [
    () => { const p = punkt(4, ['II']);
      return ablesenWahl(Z('Schau auf den Punkt A.', 'Welche Koordinaten hat A?'), 5, 'A', p, hLesen(0)); },
    () => { const p = punkt(4, ['II', 'IV']);
      return eintragen(Z(`Trage den Punkt P${pkt(p)} ein.`, 'Tippe dazu auf die richtige Stelle.'), 5, [p], hSetzen(0)); },
    () => { const p = punkt(4, ['III', 'IV']);
      return luecken(Z('Schau auf den Punkt A.', 'Schreibe seine Koordinaten auf.', 'A({{x}}|{{y}})'), { x: lk(p[0], [[p[1], 'koord-vertauscht'], [-p[0], 'koord-vorzeichen']]), y: lk(p[1], [[p[0], 'koord-vertauscht'], [-p[1], 'koord-vorzeichen']]) }, hLesen(0),
        { bild: B.gitter(koord(5, [P('A', p)])), nachweis: [BILD(zt(p[0]), { punkt: 'A' }), BILD(zt(p[1]), { punkt: 'A' })] }); },
    () => { const p = punkt(4, ['III']);
      return eintragen(Z(`Trage den Punkt P${pkt(p)} ein.`, 'Tippe dazu auf die richtige Stelle.'), 5, [p], hSetzen(0)); },
    () => { const p = punkt(4, ['II', 'IV']), ps = mische([p, tausch(p), [Math.abs(p[0]), Math.abs(p[1])]]), namen = ['A', 'B', 'C'];
      if (new Set(ps.map(String)).size !== 3) return null;
      return auswahl(Z('Schau auf die Punkte A, B und C.', `Welcher Punkt hat die Koordinaten ${pkt(p)}?`), ps.map((q, i) => opt(namen[i], q === p, q === p ? undefined : String(q) === String(tausch(p)) ? 'koord-vertauscht' : 'koord-vorzeichen')), hLesen(0),
        { bild: B.gitter(koord(5, ps.map((q, i) => P(namen[i], q)))), nachweis: [{ art: 'punktwahl', punkt: p }] }); },
    () => { const k = zz(1, 4) * wahl([1, -1]), p = wahl([[0, -Math.abs(k)], [-Math.abs(k), 0]]);
      return eintragen(Z(`Trage den Punkt P${pkt(p)} ein.`, 'Tippe dazu auf die richtige Stelle.'), 5, [p],
        H(0, 'Bei der Zahl 0 gehst du in diese Richtung gar nicht.', 'Der Punkt (0|3) liegt auf der y-Achse, 3 über dem Nullpunkt.', 'Welche Koordinate ist 0? Dann liegt der Punkt genau auf einer Achse.')); },
  ]);
  sechs(K1, 'G', [
    () => { const p = punkt(6);
      return luecken(Z('Schau auf den Punkt A.', 'Schreibe seine Koordinaten auf.', 'A({{x}}|{{y}})'), { x: lk(p[0], [[p[1], 'koord-vertauscht'], [-p[0], 'koord-vorzeichen']]), y: lk(p[1], [[p[0], 'koord-vertauscht'], [-p[1], 'koord-vorzeichen']]) }, hLesen(1),
        { bild: B.gitter(koord(6, [P('A', p)])), nachweis: [BILD(zt(p[0]), { punkt: 'A' }), BILD(zt(p[1]), { punkt: 'A' })] }); },
    () => { const a = punkt(6, ['II']), b = punkt(6, ['IV']);
      return eintragen(Z(`Trage die Punkte A${pkt(a)} und B${pkt(b)} ein.`, 'Tippe dazu auf die richtigen Stellen.'), 6, [a, b], hSetzen(1)); },
    () => { const a = [zz(1, 4), zz(1, 4)], d = zz(a[0] + 1, a[0] + 5), unten = wahl([true, false]), um = unten ? [0, -zz(a[1] + 1, a[1] + 5)] : [-d, 0], z = [a[0] + um[0], a[1] + um[1]], n = Math.abs(um[0] || um[1]);
      return gitterPunkte(Z('Starte beim Punkt A.', `Gehe ${n} Kästchen nach ${unten ? 'unten' : 'links'}.`, 'Trage den Punkt ein, bei dem du landest.'), koord(6, [P('A', a)]), [z], [[[[a[0] - um[0], a[1] - um[1]]], 'richtung-vertauscht'], [[tausch(z)], 'koord-vertauscht']].filter(([q]) => q.every(drin(6))),
        H(1, 'Zähle die Kästchen von A aus. Du gehst über eine Achse hinweg.', 'Von (2|1) aus 5 nach links landest du bei (−3|1).', 'Zähle Kästchen für Kästchen. Hinter der Achse werden die Zahlen negativ.'), { nachweis: [{ art: 'verschieben', name: 'A', um }] }); },
    () => { const p = punkt(6, ['III', 'IV']);
      return ablesenWahl(Z('Schau auf den Punkt B.', 'Welche Koordinaten hat B?'), 6, 'B', p, hLesen(1)); },
    () => { const a = punkt(6, ['III']), b = punkt(6, ['II', 'IV']), c = [zz(1, 6), zz(1, 6)];
      return eintragen(Z(`Trage die Punkte A${pkt(a)}, B${pkt(b)} und C${pkt(c)} ein.`, 'Tippe dazu auf die richtigen Stellen.'), 6, [a, b, c], hSetzen(1)); },
    () => { const p = punkt(6, ['II', 'IV']), k = kind(), q = wahl([tausch(p), [-p[0], p[1]]]);
      return auswahl(Z(`${k} soll den Punkt ${pkt(p)} eintragen.`, `${k} zeichnet aber den Punkt Q.`, 'Welche Koordinaten hat Q wirklich?'), [opt(pkt(q), true), opt(pkt(p), false, 'koord-vertauscht'), opt(pkt([-q[0], -q[1]]), false, 'koord-vorzeichen')].filter((o, i, l) => l.findIndex((x) => x.text === o.text) === i), hLesen(1),
        { bild: B.gitter(koord(6, [P('Q', q)])), nachweis: [{ art: 'punkt', name: 'Q' }] }); },
  ]);
  const hQuad = (n) => H(n, 'Die Quadranten zählt man oben rechts beginnend gegen den Uhrzeigersinn: I, II, III, IV.', 'Schau auf die Vorzeichen: Ist x negativ, liegt der Punkt links. Ist y negativ, liegt er unten.');
  sechs(K1, 'M', [
    () => { const p = punkt(9);
      return quadrant(`In welchem Quadranten liegt der Punkt P${pkt(p)}?`, p, hQuad(2)); },
    () => { const x1 = -zz(1, 6), x2 = zz(1, 6), y1 = -zz(1, 6), y2 = zz(1, 6), e = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
      return gitterPunkte('A, B und C sind drei Ecken eines Rechtecks ABCD. Trage die vierte Ecke D ein.', koord(7, [P('A', e[0]), P('B', e[1]), P('C', e[2])]), [e[3]], [[[tausch(e[3])], 'koord-vertauscht'], [[[-x1, y2]], 'koord-vorzeichen']].filter(([q]) => q.every(drin(7)) && !e.slice(0, 3).some((c) => String(c) === String(q[0]))),
        H(2, 'D liegt genau über A und auf gleicher Höhe wie C.', 'D hat die x-Koordinate von A und die y-Koordinate von C.'), { nachweis: [{ art: 'rechteck' }] }); },
    () => { const k = zz(1, 9) * wahl([1, -1]), aufX = wahl([true, false]), p = aufX ? [k, 0] : [0, k];
      return auswahl(`Wo liegt der Punkt P${pkt(p)}?`, [opt('auf der x-Achse', aufX, aufX ? undefined : 'koord-vertauscht'), opt('auf der y-Achse', !aufX, aufX ? 'koord-vertauscht' : undefined), opt(`${k > 0 ? 'I' : 'III'}. Quadrant`, false), opt(`${k > 0 ? 'IV' : 'II'}. Quadrant`, false)],
        H(2, 'Ist eine Koordinate 0, liegt der Punkt auf einer Achse und in keinem Quadranten.', 'Ist die y-Koordinate 0, bleibt der Punkt auf der x-Achse. Ist die x-Koordinate 0, bleibt er auf der y-Achse.'), { nachweis: [{ art: 'quadrant', punkt: p }] }); },
    () => { const a = punkt(8, ['II']), b = punkt(8, ['III']), c = punkt(8, ['IV']);
      return eintragen(`Trage die Punkte A${pkt(a)}, B${pkt(b)} und C${pkt(c)} ins Koordinatensystem ein.`, 8, [a, b, c], hSetzen(2)); },
    () => { const a = [zz(1, 5), -zz(1, 5)], um = wahl([[-zz(a[0] + 2, a[0] + 7), 0], [0, zz(-a[1] + 2, -a[1] + 7)]]), z = [a[0] + um[0], a[1] + um[1]], n = Math.abs(um[0] || um[1]);
      return gitterPunkte(`Der Punkt A wird um ${n} Einheiten nach ${um[0] ? 'links' : 'oben'} verschoben. Trage den neuen Punkt ein.`, koord(8, [P('A', a)]), [z], [[[[a[0] - um[0], a[1] - um[1]]], 'richtung-vertauscht'], [[tausch(z)], 'koord-vertauscht']].filter(([q]) => q.every(drin(8))),
        H(2, 'Beim Verschieben nach links oder rechts ändert sich nur die x-Koordinate, nach oben oder unten nur die y-Koordinate.', 'Zähle die Einheiten von A aus ab. Achte darauf, wann du eine Achse überquerst.'), { nachweis: [{ art: 'verschieben', name: 'A', um }] }); },
    () => { const x1 = -zz(2, 7), x2 = zz(2, 7), y1 = -zz(2, 7), y2 = zz(2, 7);
      return gitterPunkte('A und C sind gegenüberliegende Ecken eines Rechtecks ABCD. Seine Seiten sind parallel zu den Achsen. Trage B und D ein.', koord(8, [P('A', [x1, y1]), P('C', [x2, y2])]), [[x2, y1], [x1, y2]], [[[[y1, x2], [y2, x1]], 'koord-vertauscht']].filter(([q]) => q.every(drin(8))),
        H(2, 'Jede fehlende Ecke hat die x-Koordinate der einen und die y-Koordinate der anderen gegebenen Ecke.', 'B liegt genau unter C und auf der Höhe von A. D liegt genau über A und auf der Höhe von C.'), { nachweis: [{ art: 'rechteck' }] }); },
  ]);
  const hSpiegel = H(3, 'Beim Spiegeln an der x-Achse wechselt die y-Koordinate ihr Vorzeichen, beim Spiegeln an der y-Achse die x-Koordinate.');
  const spiegle = (text, r, ps, achse, namen = ['A', 'B', 'C']) => { const bild = ps.map(([x, y]) => (achse === 'x' ? [x, -y] : achse === 'y' ? [-x, y] : [-x, -y])), andere = ps.map(([x, y]) => (achse === 'x' ? [-x, y] : [x, -y]));
    if ([...bild, ...andere].some((q) => ps.some((p) => String(p) === String(q)))) return null;
    return gitterPunkte(text, koord(r, ps.map((p, i) => P(namen[i], p))), bild, [[andere, 'koord-vertauscht'], [ps.map(([x, y]) => [-x, -y]), 'koord-vorzeichen']].filter(([q]) => String(q) !== String(bild)), hSpiegel, { nachweis: [{ art: 'spiegeln', achse }] }); };
  sechs(K1, 'E', [
    () => spiegle('Spiegle den Punkt A an der x-Achse. Trage den Spiegelpunkt ein.', 8, [punkt(7, ['I', 'II', 'III', 'IV'])], 'x'),
    () => spiegle('Spiegle den Punkt A an der y-Achse. Trage den Spiegelpunkt ein.', 8, [punkt(7, ['I', 'II', 'III', 'IV'])], 'y'),
    () => { const ps = [punkt(7, ['II']), punkt(7, ['III']), [-zz(1, 7), zz(1, 7)]];
      if (new Set(ps.map(String)).size !== 3 || (ps[0][0] === ps[1][0] && ps[1][0] === ps[2][0])) return null;
      return spiegle('Das Dreieck ABC wird an der y-Achse gespiegelt. Trage die drei Spiegelpunkte ein.', 8, ps, 'y'); },
    () => spiegle('Spiegle den Punkt A zuerst an der x-Achse und das Ergebnis dann an der y-Achse. Trage den Punkt ein, der am Ende entsteht.', 8, [punkt(7, ['I', 'II', 'III', 'IV'])], 'beide'),
    () => { const p = punkt(12, ['I', 'II', 'III', 'IV']), achse = wahl(['x', 'y']), s = achse === 'x' ? [p[0], -p[1]] : [-p[0], p[1]], f = achse === 'x' ? [-p[0], p[1]] : [p[0], -p[1]];
      return auswahl(`Der Punkt P${pkt(p)} wird an der ${achse}-Achse gespiegelt. Welche Koordinaten hat der Spiegelpunkt?`, [opt(pkt(s), true), opt(pkt(f), false, 'koord-vertauscht'), opt(pkt([-p[0], -p[1]]), false, 'koord-vorzeichen'), opt(pkt(tausch(p)), false, 'koord-vertauscht')], hSpiegel, { nachweis: [{ art: 'spiegelwahl', punkt: p, achse }] }); },
    () => { const p = punkt(12, ['I', 'II', 'III', 'IV']), achse = wahl(['x', 'y']), s = achse === 'x' ? [p[0], -p[1]] : [-p[0], p[1]];
      return quadrant(`Der Punkt P${pkt(p)} wird an der ${achse}-Achse gespiegelt. In welchem Quadranten liegt der Spiegelpunkt?`, s, H(3, 'Bestimme zuerst die Koordinaten des Spiegelpunkts. Schau dann auf die beiden Vorzeichen.'), { art: 'quadrant', punkt: s, von: p, achse }); },
  ]);
}
