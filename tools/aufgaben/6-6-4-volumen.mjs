// Aufgaben zu 6.6.4 „Volumen des Quaders“ (Lernziele V1, V2) nach ADR 0015 und ADR 0049.
// V1: Volumen berechnen. F rechnet mit ganzen Kanten bis 10 in einer Einheit, G bis 20 und wählt die Einheit, M mit einer Kommastelle
// und verschiedenen Einheiten, E verdoppelt Kanten und kehrt die Rechnung um. V2: Sachaufgaben; die fehlende Kante und Liter ab M.

import { sechs } from '../werkzeug.mjs';
import { zz, wahl, mische, suche, Z, opt, auswahl, luecken, H, zahl, lk, kind, FREI, mm, T, Q, gehtAuf, EW, volumen, laenge,
  QN, BN, WERT, URTEIL, VGL, HG, quaderBild, rasterBild, kanten, N } from './6-6-quader.mjs';

const V1 = '6.6.4-V1', V2 = '6.6.4-V2';
const q3 = (e) => `${e}³`;
// Rechnung und typische Fehler für das Volumen (Kanten in Millimetern, Werte in mm³).
const vRechnung = (a, b, c, e) => `${T(a, e)} · ${T(b, e)} · ${T(c, e)} = ${T(a * b * c, q3(e))}`;
const vFehler = (a, b, c, e) => { const f = mm(1, e), q = Q(a, b, c); return [[((a + b + c) / f) * f ** 3, 'volumen-kanten-addiert'], [(q.O / f ** 2) * f ** 3, 'volumen-oberflaeche-verwechselt'], [q.ab * f, 'sach-schritt-vergessen']]; };
const hV = (n) => H(n, 'Rechne Länge mal Breite mal Höhe.', 'Quader mit 5 cm, 4 cm und 2 cm: 5 cm · 4 cm · 2 cm = 40 cm³.', 'Multipliziere zuerst zwei Kanten. Nimm das Ergebnis mal die dritte Kante.');
const hVM = (n) => H(n, 'V = a · b · c. Alle Kanten brauchen dieselbe Einheit.', 'Achte auf die Einheit: Ein Volumen hat eine Volumeneinheit wie cm³.');
// Volumen als Größe. a, b, c in Millimetern.
function vAufgabe(niveau, zeilen, a, b, c, e, hilfen, { bild = null, einheit = q3(e), einheiten = EW(e), verlangt = false, zusatz = [] } = {}) {
  const v = a * b * c;
  if (!gehtAuf(v, einheit)) return null;
  return volumen(Z(...zeilen), v, einheit, [...vFehler(a, b, c, e), ...zusatz], hilfen, { ...(niveau === 'F' ? {} : { einheiten }), ...(verlangt ? { verlangt: true } : {}), bild,
    nachweis: [vRechnung(a, b, c, e), bild ? BN('volumen', T(v, q3(e))) : QN([T(a, e), T(b, e), T(c, e)], 'volumen', T(v, q3(e))), ...(einheit !== q3(e) ? [`${T(v, q3(e))} = ${T(v, einheit)}`] : [])] });
}
// Lückentext „a · b · c = V“ (F, G).
function vLuecke(zeilen, a, b, c, e, hilfen, bild, vorsatz = '') {
  const v = a * b * c;
  return luecken(Z(...zeilen, `${vorsatz}${a} ${e} · ${b} ${e} · ${c} ${e} = {{v}} ${q3(e)}`), { v: lk(v, [[a + b + c, 'volumen-kanten-addiert'], [2 * (a * b + a * c + b * c), 'volumen-oberflaeche-verwechselt'], [a * b, 'sach-schritt-vergessen']]) }, hilfen,
    { bild, nachweis: [`${a} ${e} · ${b} ${e} · ${c} ${e} = ${v} ${q3(e)}`, BN('volumen', `${v} ${q3(e)}`)] });
}
const bildQ = (a, b, c, e, o) => quaderBild(mm(a, e), mm(b, e), mm(c, e), e, o);
const kT = (a, b, c, e) => `a = ${T(a, e)}, b = ${T(b, e)} und c = ${T(c, e)}`;

export function volumen6() {
  // ================= V1: Volumen berechnen =================
  sechs(V1, 'F', [
    () => { const [a, b, c] = mische([zz(3, 5), zz(2, 4), zz(2, 3)]); return vLuecke(['Der Quader ist aus Würfeln mit 1 cm Kantenlänge gebaut.', 'Berechne das Volumen von dem Quader.'], a, b, c, 'cm', hV('F'), rasterBild(a, b, c, 'cm')); },
    () => { const [a, b, c] = kanten(2, 9); return vAufgabe('F', [`Der Quader ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, 'Berechne das Volumen.'], mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', hV('F'), { bild: bildQ(a, b, c, 'dm') }); },
    () => { const a = zz(2, 6), v = a * a * a;
      return luecken(Z(`Der Würfel hat die Kantenlänge ${a} cm.`, 'Berechne das Volumen.', `${a} cm · ${a} cm · ${a} cm = {{v}} cm³`), { v: lk(v, [[3 * a, 'volumen-kanten-addiert'], [a * a, 'sach-schritt-vergessen'], [6 * a * a, 'volumen-oberflaeche-verwechselt']]) },
        H('F', 'Beim Würfel sind alle Kanten gleich lang.', 'Würfel mit 2 cm Kantenlänge: 2 cm · 2 cm · 2 cm = 8 cm³.', `Rechne ${a} · ${a}. Nimm das Ergebnis noch einmal mal ${a}.`), { bild: bildQ(a, a, a, 'cm'), nachweis: [`${a} cm · ${a} cm · ${a} cm = ${v} cm³`, BN('volumen', `${v} cm³`)] }); },
    () => { const [a, b, c] = kanten(2, 9), g = a * b;
      return luecken(Z('Berechne das Volumen in zwei Schritten.', `Boden: ${a} m · ${b} m = {{g}} m²`, `Volumen: {{h}} m² · ${c} m = {{v}} m³`), { g: lk(g, [[a + b, 'umfang-flaeche-verwechselt']]), h: lk(g), v: lk(g * c, [[g + c, 'volumen-kanten-addiert'], [g, 'sach-schritt-vergessen']]) },
        H('F', 'Rechne zuerst den Boden aus: Länge mal Breite.', 'Boden 5 m · 4 m = 20 m². Mit der Höhe 2 m: 20 m² · 2 m = 40 m³.', 'Nimm den Boden mal die Höhe.'), { bild: bildQ(a, b, c, 'm'), nachweis: [`${a} m · ${b} m = ${g} m²`, `${g} m² · ${c} m = ${g * c} m³`, BN('volumen', `${g * c} m³`)] }); },
    () => { const [a, b, c] = kanten(2, 6), q = Q(a, b, c), kn = kind();
      return auswahl(Z(`${kn} sucht das Volumen von dem Quader.`, 'Kreuze die richtige Rechnung an.'), [opt(`${a} cm · ${b} cm · ${c} cm = ${q.V} cm³`, true), opt(`${a} cm + ${b} cm + ${c} cm = ${a + b + c} cm`, false, 'volumen-kanten-addiert'), opt(`2 · ${q.ab} cm² + 2 · ${q.ac} cm² + 2 · ${q.bc} cm² = ${q.O} cm²`, false, 'volumen-oberflaeche-verwechselt')],
        H('F', 'Für das Volumen rechnest du Länge mal Breite mal Höhe.', 'Ein Volumen hat die Einheit cm³.', 'Suche die Rechnung mit drei Kanten und dem Malpunkt.'), { bild: bildQ(a, b, c, 'cm'), nachweis: [BN('volumen', `${q.V} cm³`), WERT(`${q.V} cm³`)] }); },
    () => { const [a, b, c] = kanten(3, 10); return vAufgabe('F', [`Ein Paket ist ${a} cm lang, ${b} cm breit und ${c} cm hoch.`, 'Berechne das Volumen von dem Paket.'], mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm', hV('F'), { bild: bildQ(a, b, c, 'cm') }); },
  ]);
  sechs(V1, 'G', [
    () => { const [a, b, c] = kanten(4, 15); return vAufgabe('G', ['Berechne das Volumen von dem Quader.', 'Wähle auch die passende Einheit.'], mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm', hV('G'), { bild: bildQ(a, b, c, 'cm') }); },
    () => { const [a, b, c] = kanten(3, 20); if (a < 11) return null; return vAufgabe('G', [`Die Kanten sind a = ${a} cm, b = ${b} cm und c = ${c} cm.`, 'Berechne mit der Formel V = a · b · c.', 'Wähle auch die passende Einheit.'], mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm', hV('G')); },
    () => { const a = zz(7, 20), A = mm(a, 'dm'), v = A ** 3;
      return volumen(Z(`Ein Würfel hat die Kantenlänge ${a} dm.`, 'Berechne das Volumen.', 'Wähle auch die passende Einheit.'), v, 'dm³', [[3 * A * 1e4, 'volumen-kanten-addiert'], [A * A * 100, 'sach-schritt-vergessen'], [6 * A * A * 100, 'volumen-oberflaeche-verwechselt']],
        H('G', 'Beim Würfel sind alle Kanten gleich lang: V = a · a · a.', 'Würfel mit 10 dm Kantenlänge: 10 dm · 10 dm · 10 dm = 1000 dm³.', `Rechne ${a} · ${a}. Nimm das Ergebnis noch einmal mal ${a}.`), { einheiten: EW('dm'), nachweis: [`${a} dm · ${a} dm · ${a} dm = ${T(v, 'dm³')}`, QN([`${a} dm`, `${a} dm`, `${a} dm`], 'volumen', T(v, 'dm³'))] }); },
    () => { const [a, b, c] = kanten(2, 12); return vLuecke(['Berechne das Volumen von dem Quader.'], a, b, c, 'm', hV('G'), bildQ(a, b, c, 'm'), 'V = '); },
    () => { const p = kanten(3, 12), r = suche(() => kanten(3, 12), (x) => x.join() !== p.join()), [vp, vr] = [p[0] * p[1] * p[2], r[0] * r[1] * r[2]];
      if (r.join() === p.join()) return null;
      return auswahl(Z(`Quader A hat die Kanten ${p[0]} cm, ${p[1]} cm und ${p[2]} cm.`, `Quader B hat die Kanten ${r[0]} cm, ${r[1]} cm und ${r[2]} cm.`, 'Kreuze den Quader mit dem größeren Volumen an.'), [opt('Quader A', vp > vr), opt('Quader B', vr > vp), opt('Beide haben dasselbe Volumen.', vp === vr)],
        H('G', 'Berechne beide Volumen.', 'Für jeden Quader: Länge mal Breite mal Höhe.', 'Vergleiche dann die beiden Ergebnisse.'), { bild: bildQ(...p, 'cm', { titel: 'Quader A' }),
          nachweis: [QN(p.map((k) => `${k} cm`), 'volumen', `${vp} cm³`), QN(r.map((k) => `${k} cm`), 'volumen', `${vr} cm³`), VGL(`${vp} cm³`, `${vr} cm³`, { groesser: 'Quader A', kleiner: 'Quader B', gleich: 'Beide haben dasselbe Volumen.' })] }); },
    () => { const [a, b, c] = kanten(3, 9), q = Q(a, b, c), kn = kind();
      return auswahl(Z(`${kn} berechnet das Volumen von dem Quader.`, `${kn} schreibt: ${a} cm · ${b} cm · ${c} cm = ${q.V} cm².`, 'Beurteile das Ergebnis.'), [opt(`Falsch. Die Zahl stimmt, aber die Einheit ist falsch. Richtig sind ${q.V} cm³.`, true), opt('Stimmt. Die Zahl ist richtig gerechnet. Die Einheit passt zu cm.', false, 'einheit-art'), opt(`Falsch. Richtig sind ${q.O} cm².`, false, 'volumen-oberflaeche-verwechselt')],
        H('G', 'Prüfe die Zahl und die Einheit.', 'cm² ist eine Einheit für Flächen. cm³ ist eine Einheit für Volumen.', 'Rechne nach. Achte dann auf die kleine Zahl an der Einheit.'), { bild: bildQ(a, b, c, 'cm'), nachweis: [BN('volumen', `${q.V} cm³`), URTEIL(false)] }); },
  ]);
  sechs(V1, 'M', [
    () => { const a = mm(wahl([15, 25, 35, 45]), 'cm', true), b = mm(zz(2, 8), 'cm'), c = mm(zz(2, 6) * 2, 'cm'); return vAufgabe('M', [`Ein Quader hat die Kanten ${kT(a, b, c, 'cm')}.`, 'Berechne das Volumen.'], a, b, c, 'cm', hVM('M')); },
    () => { const a = mm(zz(2, 6), 'dm'), b = mm(wahl([15, 25, 35, 45]), 'cm'), c = mm(zz(4, 12), 'cm'), v = a * b * c, falsch = (a / 100) * (b / 10) * (c / 10) * 1000;
      return volumen(Z(`Ein Quader hat die Kanten a = ${T(a, 'dm')}, b = ${T(b, 'cm')} und c = ${T(c, 'cm')}.`, 'Berechne das Volumen.'), v, 'cm³', [[falsch, 'einheiten-nicht-angeglichen'], [(a / 10 + b / 10 + c / 10) * 1000, 'volumen-kanten-addiert']],
        H('M', 'Die Kanten haben verschiedene Einheiten. Wandle zuerst um.', `${T(a, 'dm')} = ${T(a, 'cm')}. Rechne dann alles in Zentimetern.`), { einheiten: ['cm³', 'dm³', 'cm²', 'l'], nachweis: [`${T(a, 'dm')} = ${T(a, 'cm')}`, vRechnung(a, b, c, 'cm'), QN([T(a, 'cm'), T(b, 'cm'), T(c, 'cm')], 'volumen', T(v, 'cm³'))] }); },
    () => { const a = mm(wahl([5, 15, 25, 35]), 'cm', true), v = a ** 3;
      return volumen(Z(`Ein Würfel hat die Kantenlänge ${T(a, 'cm')}.`, 'Berechne das Volumen.'), v, 'cm³', [[3 * a * 100, 'volumen-kanten-addiert'], [a * a * 10, 'sach-schritt-vergessen'], [6 * a * a * 10, 'volumen-oberflaeche-verwechselt']],
        H('M', 'Beim Würfel gilt V = a · a · a.', `Rechne zuerst ${T(a, 'cm')} · ${T(a, 'cm')} = ${T(a * a, 'cm²')}. Multipliziere dann noch einmal mit ${T(a, 'cm')}.`), { einheiten: EW('cm'), nachweis: [`${T(a, 'cm')} · ${T(a, 'cm')} · ${T(a, 'cm')} = ${T(v, 'cm³')}`, QN([T(a, 'cm'), T(a, 'cm'), T(a, 'cm')], 'volumen', T(v, 'cm³'))] }); },
    () => { const a = mm(wahl([35, 45, 55, 65]), 'm', true), b = mm(zz(3, 5), 'm'), c = mm(wahl([24, 25, 28, 32]), 'm', true); return vAufgabe('M', [`Ein Klassenzimmer ist ${T(a, 'm')} lang, ${T(b, 'm')} breit und ${T(c, 'm')} hoch.`, 'Berechne das Volumen des Raums.'], a, b, c, 'm', hVM('M')); },
    () => { const a = mm(zz(4, 8), 'cm'), b = mm(zz(3, 6), 'cm'), c = mm(wahl([15, 25, 35]), 'cm', true), s = mm(wahl([35, 45, 50]), 'cm', true), vp = a * b * c, vr = s ** 3;
      if (vp === vr) return null;
      return auswahl(Z(`Ein Quader hat die Kanten ${kT(a, b, c, 'cm')}.`, `Ein Würfel hat die Kantenlänge ${T(s, 'cm')}.`, 'Kreuze den Körper mit dem größeren Volumen an.'), [opt('der Quader', vp > vr), opt('der Würfel', vr > vp), opt('Beide haben dasselbe Volumen.', false)],
        H('M', 'Berechne beide Volumen und vergleiche.', `Würfel: ${T(s, 'cm')} · ${T(s, 'cm')} · ${T(s, 'cm')} = ${T(vr, 'cm³')}.`), { nachweis: [QN([T(a, 'cm'), T(b, 'cm'), T(c, 'cm')], 'volumen', T(vp, 'cm³')), QN([T(s, 'cm'), T(s, 'cm'), T(s, 'cm')], 'volumen', T(vr, 'cm³')), VGL(T(vp, 'cm³'), T(vr, 'cm³'), { groesser: 'der Quader', kleiner: 'der Würfel', gleich: 'Beide haben dasselbe Volumen.' })] }); },
    () => { const a = zz(2, 6), b = wahl([15, 25, 35]), c = zz(4, 12), kn = kind(), falsch = a * b * c, richtig = 10 * a * b * c;
      return auswahl(Z(`${kn} rechnet für einen Quader mit ${a} dm, ${b} cm und ${c} cm: ${a} · ${b} · ${c} = ${falsch}. ${kn} schreibt als Ergebnis ${falsch} cm³.`, 'Kreuze die Erklärung für den Fehler an.'),
        [opt(`Die Kanten haben verschiedene Einheiten. Mit ${a * 10} cm statt ${a} dm ergibt sich ${N(richtig)} cm³.`, true), opt(`Die Einheit ist falsch. Richtig sind ${falsch} dm³.`, false, 'einheiten-nicht-angeglichen'), opt('Die drei Kanten müssen addiert werden.', false, 'volumen-kanten-addiert'), opt('Die Rechnung stimmt. Es gibt keinen Fehler, denn man darf jede Einheit multiplizieren.', false, 'einheiten-nicht-angeglichen')],
        H('M', 'Prüfe die Einheiten der drei Kanten.', 'Vor dem Multiplizieren müssen alle Kanten dieselbe Einheit haben.'), { nachweis: [`${a} dm = ${a * 10} cm`, QN([`${a * 10} cm`, `${b} cm`, `${c} cm`], 'volumen', `${N(richtig)} cm³`), FREI('Einheiten vor dem Rechnen angleichen')] }); },
  ]);
  sechs(V1, 'E', [
    () => { const a = mm(wahl([12, 15, 18, 25]), 'm', true), b = mm(wahl([40, 50, 60, 80]), 'cm'), c = mm(zz(3, 6), 'dm'), v = a * b * c;
      return volumen(Z(`Eine Truhe ist ${T(a, 'm')} lang, ${T(b, 'cm')} breit und ${T(c, 'dm')} hoch.`, 'Berechne ihr Volumen in Kubikdezimetern.'), v, 'dm³', [[v / 10, 'umrechnungszahl'], [v * 10, 'umrechnungszahl'], [(a / 1000) * (b / 10) * (c / 100) * 1e6, 'einheiten-nicht-angeglichen']],
        H('E', 'Wandle zuerst alle Kanten in Dezimeter um.'), { einheiten: ['dm³', 'm³', 'cm³', 'dm²'], verlangt: true, nachweis: [`${T(a, 'm')} = ${T(a, 'dm')}`, `${T(b, 'cm')} = ${T(b, 'dm')}`, vRechnung(a, b, c, 'dm'), QN([T(a, 'dm'), T(b, 'dm'), T(c, 'dm')], 'volumen', T(v, 'dm³'))] }); },
    () => { const [a, b, c] = kanten(2, 6), v = a * b * c;
      return zahl(Z(`Ein Quader hat die Kanten ${a} cm, ${b} cm und ${c} cm. Alle drei Kanten werden verdoppelt.`, 'Gib an, wie viel mal so groß das Volumen dann ist.'), 8, [[2, 'volumen-waechst-wie-kante'], [6, 'volumen-kanten-addiert'], [4, 'volumen-oberflaeche-verwechselt']],
        H('E', 'Berechne das Volumen vorher und nachher und teile.'), { nachweis: [QN([`${a} cm`, `${b} cm`, `${c} cm`], 'volumen', `${v} cm³`), `2 · ${a} cm = ${2 * a} cm`, `2 · ${b} cm = ${2 * b} cm`, `2 · ${c} cm = ${2 * c} cm`, QN([`${2 * a} cm`, `${2 * b} cm`, `${2 * c} cm`], 'volumen', `${8 * v} cm³`), `${8 * v} cm³ : ${v} cm³ = 8`] }); },
    () => { const [a, b, c] = kanten(2, 8), v = a * b * c;
      return volumen(Z(`Ein Quader hat das Volumen ${v} cm³. Seine Länge und seine Breite werden verdoppelt, die Höhe bleibt gleich.`, 'Bestimme das neue Volumen.'), 4 * v * 1000, 'cm³', [[2 * v * 1000, 'volumen-waechst-wie-kante'], [8 * v * 1000, 'volumen-waechst-wie-kante'], [v * 1000, 'sach-schritt-vergessen']],
        H('E', 'Jede Verdopplung einer Kante verdoppelt das Volumen.'), { einheiten: EW('cm'), nachweis: ['2 · 2 = 4', `4 · ${v} cm³ = ${4 * v} cm³`] }); },
    () => auswahl(Z('Bei einem Würfel wird die Kantenlänge verdreifacht.', 'Kreuze an, wie sich das Volumen ändert.'),
      [opt('Es wird 27-mal so groß, denn 3 · 3 · 3 = 27.', true), opt('Es wird 3-mal so groß, denn die Kante wird verdreifacht.', false, 'volumen-waechst-wie-kante'), opt('Es wird 9-mal so groß, denn 3 · 3 = 9.', false, 'volumen-oberflaeche-verwechselt'), opt('Es wird 6-mal so groß, denn der Würfel hat 6 Flächen.', false), opt('Es wird 9-mal so groß, denn 3 + 3 + 3 = 9.', false, 'volumen-kanten-addiert')],
      H('E', 'Probiere es mit einem Würfel der Kantenlänge 1 cm aus.'), { nachweis: [FREI('Wachstum des Volumens begründen'), '3 · 3 · 3 = 27'] }),
    () => { const a = zz(2, 10), v = a ** 3;
      return laenge(Z(`Ein Würfel hat das Volumen ${v} cm³.`, 'Bestimme seine Kantenlänge.'), mm(a, 'cm'), 'cm', [[mm(v / 3, 'cm'), 'volumen-kanten-addiert']].filter(([w]) => Number.isInteger(w)),
        H('E', 'Gesucht ist eine Zahl, die dreimal mit sich selbst multipliziert das Volumen ergibt. Probiere.'), { einheiten: EW('cm'), nachweis: [HG(`${a} cm`, 'gesuchte Kante, durch Probieren'), QN([`${a} cm`, `${a} cm`, `${a} cm`], 'volumen', `${v} cm³`)] }); },
    () => { const a = zz(2, 5), v = a ** 3, kn = kind();
      return auswahl(Z(`Ein Würfel hat die Kantenlänge ${a} cm. ${kn} sagt: „Ein Würfel mit dem doppelten Volumen hat die doppelte Kantenlänge.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Mit der doppelten Kantenlänge ${2 * a} cm ist das Volumen ${8 * v} cm³. Das ist 8-mal so viel wie ${v} cm³.`, true), opt(`Stimmt. Mit ${2 * a} cm ist das Volumen ${2 * v} cm³.`, false, 'volumen-waechst-wie-kante'), opt(`Falsch. Mit der doppelten Kantenlänge ist das Volumen ${4 * v} cm³.`, false, 'volumen-oberflaeche-verwechselt'), opt('Stimmt, denn beim Würfel sind alle Kanten gleich lang. Doppelte Kante heißt doppeltes Volumen.', false, 'volumen-waechst-wie-kante')],
        H('E', 'Berechne das Volumen des Würfels mit der doppelten Kantenlänge.'), { nachweis: [QN([`${a} cm`, `${a} cm`, `${a} cm`], 'volumen', `${v} cm³`), `2 · ${a} cm = ${2 * a} cm`, QN([`${2 * a} cm`, `${2 * a} cm`, `${2 * a} cm`], 'volumen', `${8 * v} cm³`), URTEIL(false)] }); },
  ]);

  // ================= V2: Sachaufgaben, fehlende Kante, Liter =================
  sechs(V2, 'F', [
    () => { const [a, b, c] = kanten(2, 10), kn = kind(); return vAufgabe('F', [`${kn} hat eine Schachtel.`, `Sie ist ${a} cm lang, ${b} cm breit und ${c} cm hoch.`, 'Berechne das Volumen von der Schachtel.'], mm(a, 'cm'), mm(b, 'cm'), mm(c, 'cm'), 'cm', hV('F'), { bild: bildQ(a, b, c, 'cm') }); },
    () => { const a = zz(3, 9), b = zz(2, a), c = zz(1, 3); if (a === b && b === c) return null; return vLuecke(['Ein Sandkasten wird bis zum Rand mit Sand gefüllt.', 'Berechne das Volumen von dem Sand.'], a, b, c, 'dm', hV('F'), bildQ(a, b, c, 'dm')); },
    () => { const [a, b, c] = kanten(2, 9); return vAufgabe('F', ['Auf der Burg steht eine Schatztruhe.', `Sie ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, 'Berechne das Volumen von der Truhe.'], mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', hV('F'), { bild: bildQ(a, b, c, 'dm') }); },
    () => { const a = zz(2, 6), v = a ** 3;
      return luecken(Z(`Eine Kiste hat die Form von einem Würfel.`, `Jede Kante ist ${a} dm lang.`, 'Berechne das Volumen von der Kiste.', `${a} dm · ${a} dm · ${a} dm = {{v}} dm³`), { v: lk(v, [[3 * a, 'volumen-kanten-addiert'], [a * a, 'sach-schritt-vergessen'], [6 * a * a, 'volumen-oberflaeche-verwechselt']]) },
        H('F', 'Beim Würfel sind alle Kanten gleich lang.', 'Würfel mit 2 dm Kantenlänge: 2 dm · 2 dm · 2 dm = 8 dm³.', `Rechne ${a} · ${a}. Nimm das Ergebnis noch einmal mal ${a}.`), { bild: bildQ(a, a, a, 'dm'), nachweis: [`${a} dm · ${a} dm · ${a} dm = ${v} dm³`, BN('volumen', `${v} dm³`)] }); },
    () => { const [a, b, c] = kanten(2, 6), v = a * b * c, mehr = zz(0, 1), sand = v + (mehr ? zz(2, 9) : -zz(2, 9)), kn = kind();
      return auswahl(Z(`${kn} hat ${sand} dm³ Sand.`, 'Der Sand soll in die Kiste.', 'Kreuze die richtige Antwort an.'), [opt(`Der Sand passt hinein. Die Kiste fasst ${v} dm³.`, mehr === 0), opt(`Der Sand passt nicht hinein. Die Kiste fasst nur ${v} dm³.`, mehr === 1), opt(`Der Sand passt nicht hinein. Die Kiste fasst nur ${a + b + c} dm³.`, false, 'volumen-kanten-addiert')],
        H('F', 'Berechne zuerst das Volumen der Kiste.', 'Rechne Länge mal Breite mal Höhe.', 'Vergleiche dann mit dem Sand.'), { bild: bildQ(a, b, c, 'dm'), nachweis: [BN('volumen', `${v} dm³`), VGL(`${sand} dm³`, `${v} dm³`, { groesser: `Der Sand passt nicht hinein. Die Kiste fasst nur ${v} dm³.`, kleiner: `Der Sand passt hinein. Die Kiste fasst ${v} dm³.`, gleich: `Der Sand passt hinein. Die Kiste fasst ${v} dm³.` })] }); },
    () => { const [a, b, c] = kanten(2, 8); return vAufgabe('F', ['Ein Aquarium hat die Form von einem Quader.', `Es ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, 'Berechne das Volumen von dem Aquarium.'], mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', hV('F'), { bild: bildQ(a, b, c, 'dm') }); },
  ]);
  sechs(V2, 'G', [
    () => { const [a, b, c] = kanten(3, 9); return vAufgabe('G', ['Das Bild zeigt einen Umzugskarton.', 'Berechne sein Volumen.', 'Wähle auch die passende Einheit.'], mm(a, 'dm'), mm(b, 'dm'), mm(c, 'dm'), 'dm', hV('G'), { bild: bildQ(a, b, c, 'dm', { titel: 'Umzugskarton' }) }); },
    () => { const a = zz(6, 15), b = zz(3, 6), c = zz(1, 2); return vAufgabe('G', [`Ein Schwimmbecken ist ${a} m lang, ${b} m breit und ${c} m tief.`, 'Berechne das Volumen von dem Becken.', 'Wähle auch die passende Einheit.'], mm(a, 'm'), mm(b, 'm'), mm(c, 'm'), 'm', hV('G')); },
    () => { const [a, b, c] = kanten(2, 8), v = a * b * c, sack = wahl([2, 3, 4, 5, 6, 8]); if (v % sack !== 0 || v / sack < 2) return null;
      return zahl(Z(`Ein Hochbeet ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, `Ein Sack Erde hat das Volumen ${sack} dm³.`, 'Bestimme, wie viele Säcke das Hochbeet füllen.'), v / sack, [[v, 'sach-schritt-vergessen']],
        H('G', 'Berechne zuerst das Volumen von dem Hochbeet.', 'Hochbeet mit 40 dm³ und Säcke mit 5 dm³: 40 dm³ : 5 dm³ = 8 Säcke.', 'Teile das Volumen durch das Volumen von einem Sack.'), { einheit: 'Säcke', nachweis: [QN([`${a} dm`, `${b} dm`, `${c} dm`], 'volumen', `${v} dm³`), `${v} dm³ : ${sack} dm³ = ${v / sack}`] }); },
    () => { const [a, b, c] = kanten(3, 9); return vAufgabe('G', ['Im Turm der Burg liegt ein Zimmer.', 'Berechne das Volumen von dem Zimmer.', 'Wähle auch die passende Einheit.'], mm(a, 'm'), mm(b, 'm'), mm(c, 'm'), 'm', hV('G'), { bild: bildQ(a, b, c, 'm', { titel: 'Turmzimmer' }) }); },
    () => { const p = kanten(3, 9), r = suche(() => kanten(3, 9), (x) => x[0] * x[1] * x[2] !== p[0] * p[1] * p[2]), [vp, vr] = [p[0] * p[1] * p[2], r[0] * r[1] * r[2]];
      return auswahl(Z(`Karton A ist ${p[0]} dm lang, ${p[1]} dm breit und ${p[2]} dm hoch.`, `Karton B ist ${r[0]} dm lang, ${r[1]} dm breit und ${r[2]} dm hoch.`, 'Kreuze an, in welchen Karton mehr hineinpasst.'), [opt('Karton A', vp > vr), opt('Karton B', vr > vp), opt('In beide passt gleich viel.', false)],
        H('G', 'Berechne beide Volumen.', 'Für jeden Karton: Länge mal Breite mal Höhe.', 'Vergleiche dann die beiden Ergebnisse.'), { nachweis: [QN(p.map((k) => `${k} dm`), 'volumen', `${vp} dm³`), QN(r.map((k) => `${k} dm`), 'volumen', `${vr} dm³`), VGL(`${vp} dm³`, `${vr} dm³`, { groesser: 'Karton A', kleiner: 'Karton B', gleich: 'In beide passt gleich viel.' })] }); },
    () => { const a = zz(4, 9), b = zz(2, 5), c = zz(3, 6), v = a * b * (c - 1);
      return volumen(Z(`Das Aquarium ist ${a} dm lang, ${b} dm breit und ${c} dm hoch.`, 'Das Wasser steht 1 dm unter dem Rand.', 'Berechne das Volumen von dem Wasser.', 'Wähle auch die passende Einheit.'), v * 1e6, 'dm³', [[a * b * c * 1e6, 'sach-schritt-vergessen'], [(a * b * c - 1) * 1e6, 'sach-schritt-vergessen']],
        H('G', 'Das Wasser ist nicht so hoch wie das Aquarium.', 'Aquarium 5 dm hoch, Wasser 1 dm unter dem Rand: Das Wasser ist 4 dm hoch.', 'Rechne zuerst die Höhe von dem Wasser aus. Rechne dann Länge mal Breite mal Höhe.'), { einheiten: EW('dm'), bild: bildQ(a, b, c, 'dm', { titel: 'Aquarium' }), nachweis: [`${c} dm − 1 dm = ${c - 1} dm`, `${a} dm · ${b} dm · ${c - 1} dm = ${v} dm³`] }); },
  ]);
  sechs(V2, 'M', [
    () => { const a = mm(zz(5, 9), 'dm'), b = mm(wahl([25, 35, 45]), 'dm', true), c = mm(zz(2, 3) * 2, 'dm'), v = a * b * c;
      return volumen(Z(`Ein Aquarium ist ${T(a, 'dm')} lang, ${T(b, 'dm')} breit und ${T(c, 'dm')} hoch.`, 'Berechne, wie viele Liter Wasser hineinpassen.'), v, 'l', [[v / 10, 'umrechnungszahl'], [v * 1000, 'liter-nicht-dm3'], ...vFehler(a, b, c, 'dm')],
        H('M', 'Berechne das Volumen in dm³. 1 dm³ ist 1 Liter.', 'Multipliziere die drei Kanten in Dezimetern.'), { einheiten: ['l', 'ml', 'dm³', 'dm²'], verlangt: true, nachweis: [vRechnung(a, b, c, 'dm'), QN([T(a, 'dm'), T(b, 'dm'), T(c, 'dm')], 'volumen', T(v, 'dm³')), `${T(v, 'dm³')} = ${T(v, 'l')}`] }); },
    () => { const [a, b, c] = kanten(3, 12), v = a * b * c;
      return laenge(Z(`Ein Quader hat das Volumen ${N(v)} cm³. Zwei Kanten sind a = ${a} cm und b = ${b} cm.`, 'Rechne im Heft.', 'Bestimme die Kante c.'), mm(c, 'cm'), 'cm', [[mm(v / a, 'cm'), 'sach-schritt-vergessen'], [mm(v / b, 'cm'), 'sach-schritt-vergessen']],
        H('M', 'Das Volumen ist a · b · c. Teile das Volumen durch a · b.', `Rechne zuerst a · b = ${a * b} cm².`), { einheiten: EW('cm'), nachweis: [`${a} cm · ${b} cm = ${a * b} cm²`, `${N(v)} cm³ : ${a * b} cm² = ${c} cm`, QN([`${a} cm`, `${b} cm`, `${c} cm`], 'volumen', `${N(v)} cm³`)] }); },
    () => { const a = mm(zz(6, 9), 'cm'), b = mm(zz(5, 8), 'cm'), c = mm(wahl([15, 18, 20, 24, 25]), 'cm'), v = a * b * c;
      return volumen(Z(`Eine Saftpackung ist ${T(a, 'cm')} lang, ${T(b, 'cm')} breit und ${T(c, 'cm')} hoch.`, 'Berechne ihr Volumen in Litern.'), v, 'l', [[v * 10, 'umrechnungszahl'], [v * 100, 'umrechnungszahl'], [v * 1000, 'liter-nicht-dm3']],
        H('M', 'Berechne das Volumen in cm³. 1000 cm³ sind 1 Liter.', 'Teile die Maßzahl in cm³ durch 1000.'), { einheiten: ['l', 'ml', 'cm³', 'dm³'], verlangt: true, nachweis: [vRechnung(a, b, c, 'cm'), QN([T(a, 'cm'), T(b, 'cm'), T(c, 'cm')], 'volumen', T(v, 'cm³')), `${T(v, 'cm³')} = ${T(v, 'l')}`] }); },
    () => { const a = zz(4, 9), b = zz(2, 5), h = zz(2, 6), liter = a * b * h;
      return laenge(Z(`Ein Aquarium ist ${a} dm lang und ${b} dm breit. Es werden ${liter} l Wasser eingefüllt.`, 'Bestimme die Füllhöhe.'), mm(h, 'dm'), 'dm', [[mm(liter / a, 'dm'), 'sach-schritt-vergessen'], [mm(liter / b, 'dm'), 'sach-schritt-vergessen']].filter(([w]) => Number.isInteger(w)),
        H('M', '1 Liter ist 1 dm³. Das Wasser bildet einen Quader mit der Grundfläche des Aquariums.', 'Teile das Volumen des Wassers durch die Grundfläche.'), { einheiten: ['dm', 'cm', 'dm²', 'dm³'], nachweis: [`${liter} l = ${liter} dm³`, `${a} dm · ${b} dm = ${a * b} dm²`, `${liter} dm³ : ${a * b} dm² = ${h} dm`] }); },
    () => { const a = zz(6, 12), b = zz(3, 5), c = mm(wahl([15, 25]), 'm', true), v = mm(a, 'm') * mm(b, 'm') * c, vm = v / 1e9, je = wahl([3, 5, 6, 9, 10, 15]), std = vm / je; if (!Number.isInteger(std) || std < 2) return null;
      return zahl(Z(`Ein Schwimmbecken ist ${a} m lang, ${b} m breit und ${T(c, 'm')} tief. In jeder Stunde fließen ${je} m³ Wasser hinein.`, 'Rechne im Heft.', 'Gib an, nach wie vielen Stunden das Becken voll ist.'), std, [[vm, 'sach-schritt-vergessen']],
        H('M', 'Berechne zuerst das Volumen des Beckens.', 'Teile das Volumen durch die Wassermenge, die in einer Stunde hineinfließt.'), { einheit: 'Stunden', nachweis: [QN([`${a} m`, `${b} m`, T(c, 'm')], 'volumen', T(v, 'm³')), `${T(v, 'm³')} : ${je} m³ = ${std}`] }); },
    () => { const ziel = wahl([1, 2]), richtig = ziel === 1 ? wahl([[10, 10, 10], [5, 10, 20], [8, 5, 25]]) : wahl([[10, 10, 20], [8, 10, 25], [5, 20, 20]]);
      const falsch = mische(ziel === 1 ? [[5, 10, 10], [10, 10, 100], [10, 10, 1], [10, 10, 30], [5, 5, 20]] : [[10, 10, 2], [10, 20, 100], [10, 10, 10], [5, 10, 20], [20, 20, 20]]).slice(0, 3), t = ([x, y, z]) => `${x} cm · ${y} cm · ${z} cm`;
      return auswahl(Z(`Eine Packung soll genau ${ziel} l fassen.`, 'Kreuze die passenden Maße an.'), [opt(t(richtig), true), ...falsch.map((x) => opt(t(x), false))],
        H('M', '1 Liter sind 1000 cm³.', 'Berechne zu jeder Antwort das Volumen in cm³ und vergleiche.'), { nachweis: [`${ziel} l = ${ziel * 1000} cm³`, WERT(`${ziel} l`)] }); },
  ]);
  sechs(V2, 'E', [
    () => { const a = zz(4, 8), bcm = wahl([20, 30, 40, 50]), h = wahl([25, 35, 45, 3, 4]), hmm = h > 9 ? mm(h, 'dm', true) : mm(h, 'dm'), v = mm(a, 'dm') * mm(bcm, 'cm') * hmm;
      if (!gehtAuf(v, 'l', 0)) return null;
      return laenge(Z(`Ein Aquarium fasst ${T(v, 'l')}. Es ist ${a} dm lang und ${bcm} cm breit.`, 'Bestimme seine Höhe.'), hmm, 'dm', [[hmm / 10, 'einheiten-nicht-angeglichen'], [v / 1e6 / a * 100, 'sach-schritt-vergessen']].filter(([w]) => Number.isInteger(w)),
        H('E', 'Wandle alle Angaben in Dezimeter und Kubikdezimeter um. Teile dann das Volumen durch Länge mal Breite.'), { einheiten: ['dm', 'cm', 'dm²', 'dm³'], nachweis: [`${T(v, 'l')} = ${T(v, 'dm³')}`, `${bcm} cm = ${bcm / 10} dm`, `${a} dm · ${bcm / 10} dm = ${(a * bcm) / 10} dm²`, `${T(v, 'dm³')} : ${(a * bcm) / 10} dm² = ${T(hmm, 'dm')}`] }); },
    () => { const a = wahl([20, 25, 50]), b = wahl([8, 10, 12]), c = mm(wahl([15, 18, 20, 25]), 'm', true), v = mm(a, 'm') * mm(b, 'm') * c;
      return volumen(Z(`Ein Schwimmbecken ist ${a} m lang, ${b} m breit und ${T(c, 'm')} tief.`, 'Rechne im Heft.', 'Bestimme, wie viele Hektoliter Wasser in das Becken passen.'), v, 'hl', [[v / 10, 'umrechnungszahl'], [v * 10, 'umrechnungszahl'], [v / 100, 'umrechnungszahl']],
        H('E', '1 m³ sind 1000 Liter, und 100 Liter sind 1 Hektoliter.'), { einheiten: ['hl', 'l', 'm³', 'dm³'], verlangt: true, nachweis: [QN([`${a} m`, `${b} m`, T(c, 'm')], 'volumen', T(v, 'm³')), `${T(v, 'm³')} = ${T(v, 'l')}`, `${T(v, 'l')} = ${T(v, 'hl')}`] }); },
    () => { const a = zz(5, 10), b = zz(2, 5), steig = wahl([2, 4, 5, 8]), liter = (a * b * steig) / 10; if (!Number.isInteger(liter)) return null;
      return laenge(Z(`Ein Aquarium ist ${a} dm lang und ${b} dm breit. Es werden ${liter} l Wasser dazugegossen.`, 'Bestimme in Zentimetern, um wie viel das Wasser steigt.'), mm(steig, 'cm'), 'cm', [[mm(steig, 'dm'), 'umrechnungszahl'], [mm(liter, 'cm'), 'sach-schritt-vergessen']],
        H('E', 'Das neue Wasser bildet einen flachen Quader mit der Grundfläche des Aquariums.'), { einheiten: ['cm', 'dm', 'cm²', 'l'], verlangt: true, nachweis: [`${liter} l = ${liter} dm³`, `${a} dm · ${b} dm = ${a * b} dm²`, `${liter} dm³ : ${a * b} dm² = ${T(mm(steig, 'cm'), 'dm')}`, `${T(mm(steig, 'cm'), 'dm')} = ${steig} cm`] }); },
    () => { const [x, y, z] = [zz(2, 4), zz(2, 4), zz(2, 3)], [sa, sb, sc] = [wahl([10, 20]), wahl([10, 15]), wahl([5, 10])], n = x * y * z;
      return zahl(Z(`Ein Karton ist innen ${x * sa} cm lang, ${y * sb} cm breit und ${z * sc} cm hoch. Er wird mit Schachteln gefüllt, die ${sa} cm lang, ${sb} cm breit und ${sc} cm hoch sind. Alle Schachteln liegen gleich herum.`, 'Rechne im Heft.', 'Bestimme, wie viele Schachteln in den Karton passen.'), n, [[x + y + z, 'volumen-kanten-addiert'], [x * y, 'sach-schritt-vergessen']],
        H('E', 'Überlege für jede Richtung, wie viele Schachteln nebeneinander passen.'), { nachweis: [`${x * sa} cm : ${sa} cm = ${x}`, `${y * sb} cm : ${sb} cm = ${y}`, `${z * sc} cm : ${sc} cm = ${z}`, `${x} · ${y} · ${z} = ${n}`] }); },
    () => { const a = zz(4, 8), b = zz(3, 5), steig = wahl([5, 15, 25, 2, 4]), sm = mm(steig, 'cm'), v = mm(a, 'dm') * mm(b, 'dm') * sm;
      return volumen(Z(`Ein Wasserbecken ist ${a} dm lang und ${b} dm breit. Ein Stein wird ganz ins Wasser getaucht. Das Wasser steigt um ${steig} cm.`, 'Bestimme das Volumen des Steins.'), v, 'dm³', [[v * 10, 'einheiten-nicht-angeglichen'], [mm(a, 'dm') * mm(b, 'dm') * 100, 'sach-schritt-vergessen']],
        H('E', 'Der Stein verdrängt so viel Wasser, wie er selbst an Volumen hat. Achte auf die Einheiten.'), { einheiten: ['dm³', 'cm³', 'dm²', 'm³'], nachweis: [`${steig} cm = ${T(sm, 'dm')}`, `${a} dm · ${b} dm · ${T(sm, 'dm')} = ${T(v, 'dm³')}`] }); },
    () => { const a = wahl([10, 20]), kn = kind(), v1 = a ** 3 / 1000, v2 = (2 * a) ** 3 / 1000;
      return auswahl(Z(`${kn} sagt: „Ein Würfel mit ${2 * a} cm Kantenlänge fasst doppelt so viel wie ein Würfel mit ${a} cm Kantenlänge.“`, 'Beurteile die Aussage.'),
        [opt(`Falsch. Er fasst 8-mal so viel: ${v2} l statt ${v1} l.`, true), opt(`Stimmt. Er fasst ${2 * v1} l statt ${v1} l.`, false, 'volumen-waechst-wie-kante'), opt(`Falsch. Er fasst 4-mal so viel: ${4 * v1} l statt ${v1} l.`, false, 'volumen-oberflaeche-verwechselt'), opt(`Falsch. Er fasst 6-mal so viel: ${6 * v1} l statt ${v1} l.`, false, 'volumen-kanten-addiert')],
        H('E', 'Berechne beide Volumen und wandle in Liter um.'), { nachweis: [QN([`${a} cm`, `${a} cm`, `${a} cm`], 'volumen', `${a ** 3} cm³`), `${a ** 3} cm³ = ${v1} l`, QN([`${2 * a} cm`, `${2 * a} cm`, `${2 * a} cm`], 'volumen', `${N((2 * a) ** 3)} cm³`), `${N((2 * a) ** 3)} cm³ = ${v2} l`, `${v2} l : ${v1} l = 8`, URTEIL(false)] }); },
  ]);
}
